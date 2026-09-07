/**
 * Adjuntos de imagen de una página (N0-nn).
 *
 * Un vault de Obsidian escribe `![alt](../../assets/des-feistel.png)` al pegar
 * una imagen. El compilador reconoce esas referencias, las resuelve contra el
 * archivo real y les asigna un **nombre estable con el hash del contenido**, que
 * es lo que `publish` copia a `subjects/<slug>/assets/` y lo que el lector usa
 * para reescribir el `src`.
 *
 * Tres guardas gobiernan todo el módulo:
 *
 *  - **Solo imágenes locales.** Nada de URLs, rutas absolutas, `data:` ni
 *    `javascript:`, y solo las extensiones de `IMAGE_EXTENSIONS`. Un `.svg`
 *    NO es una de ellas: se sirve en el mismo origen del sitio y puede llevar
 *    `<script>`, así que se avisa (`asset-unsupported`) y se deja como está.
 *  - **Nada de fuera del vault.** Un `..` que salga de la raíz se descarta con
 *    advertencia: el compilador nunca lee fuera de la carpeta de la materia.
 *  - **El nombre publicado también es dato ajeno.** El índice de la copia
 *    publicada lo escribe una materia, así que solo se acepta la forma exacta
 *    que produce `assetFileName` (`isPublishedAssetName`) y, ya resuelto, la
 *    ruta real tiene que caer dentro de `<materia>/assets/`.
 *
 * En la copia publicada los archivos ya no se llaman como en el vault, así que
 * `publish` deja un índice (`assets/assets.json`) que traduce la ruta del vault
 * al nombre publicado. Cuando ese índice existe, `resolvePageAssets` lo usa en
 * vez de leer del disco: es lo que hace que `site build` compile la copia
 * publicada al mismo resultado que el vault de origen.
 */
import { createHash } from "node:crypto";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import type { PageAsset } from "@sinapsis/contract";

/**
 * Extensiones que se admiten como adjunto. Cerrada a propósito, y **sin `svg`**:
 * un SVG publicado se sirve desde el mismo origen que la plataforma y puede
 * llevar `<script>` o manejadores `on*`, así que abrirlo por su URL ejecutaría
 * con acceso al estado personal (`localStorage`, IndexedDB). Una referencia
 * `.svg` se avisa con `asset-unsupported` y el markdown se deja intacto.
 */
export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp"] as const;

/** Tope por archivo. Una figura de clase pesa dos órdenes de magnitud menos. */
export const MAX_ASSET_BYTES = 2 * 1024 * 1024;

/** Tope por materia, sumando todos los adjuntos distintos. */
export const MAX_SUBJECT_ASSET_BYTES = 25 * 1024 * 1024;

/** Nombre del índice que `publish` deja dentro de `assets/`. */
export const ASSET_INDEX_FILE = "assets.json";

/** Carpeta de los adjuntos dentro de la materia, en el vault y en la copia publicada. */
export const ASSET_DIR = "assets";

/**
 * La forma exacta de un nombre publicado: 16 dígitos hexadecimales, un punto y
 * una extensión admitida. Un solo segmento, sin barras ni `..` y sin
 * dos puntos, porque es lo único que `assetFileName` sabe producir.
 */
export const PUBLISHED_ASSET_NAME = /^[a-f0-9]{16}\.(png|jpe?g|gif|webp)$/;

/**
 * ¿El valor es un nombre publicado válido?
 *
 * El índice de la copia publicada es dato de la materia: sin esta guarda, un
 * `"assets/x.png": "../../../etc/passwd"` haría que `site build` leyera y
 * copiara un archivo cualquiera del runner.
 */
export function isPublishedAssetName(value: unknown): value is string {
  return typeof value === "string" && PUBLISHED_ASSET_NAME.test(value);
}

/** Versión del formato del índice. Sube solo con cambios incompatibles. */
export const ASSET_INDEX_FORMAT = 1 as const;

/**
 * `assets/assets.json` de una materia publicada: ruta del archivo relativa a la
 * raíz de la materia (con barras) → nombre publicado.
 *
 * Se valida a mano y no con zod: este paquete no depende de zod, y el índice
 * viene de la copia publicada, que es dato ajeno como cualquier otro.
 */
export interface AssetIndexType {
  format: typeof ASSET_INDEX_FORMAT;
  assets: Record<string, string>;
}

/**
 * ¿El valor tiene la forma de un índice de adjuntos?
 *
 * Acá se comprueba la **forma** del archivo. Cada nombre publicado se valida
 * aparte, entrada por entrada, en `resolvePageAssets` con `isPublishedAssetName`:
 * así una fila adulterada se descarta sola (`asset-index-invalid`) en vez de
 * tirar abajo el índice entero de una materia sana.
 */
export function isAssetIndex(value: unknown): value is AssetIndexType {
  if (typeof value !== "object" || value === null) return false;
  const raw = value as { format?: unknown; assets?: unknown };
  if (raw.format !== ASSET_INDEX_FORMAT) return false;
  if (typeof raw.assets !== "object" || raw.assets === null || Array.isArray(raw.assets)) return false;
  return Object.values(raw.assets as Record<string, unknown>).every((v) => typeof v === "string" && v !== "");
}

/** Un adjunto resuelto, con lo que hace falta para copiarlo. */
export interface WikiAsset {
  /** Nombre publicado: `<hash>.<ext>`. */
  file: string;
  /** Archivo de origen, absoluto. */
  source: string;
  /** Ruta del origen relativa a la raíz de la materia, con barras. */
  ref: string;
  bytes: number;
}

/** Problema al resolver un adjunto. El cuerpo nunca se modifica por esto. */
export interface AssetIssue {
  kind: "asset-missing" | "asset-outside" | "asset-too-big" | "asset-unsupported" | "asset-index-invalid";
  detail: string;
}

const FENCE = /^\s*(```|~~~)/;

/**
 * Referencias de imagen del cuerpo, en orden y sin repetir.
 *
 * Se saltan los bloques de código y el código en línea, que es donde el wiki
 * muestra la sintaxis en vez de usarla.
 */
export function imageRefs(body: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  let inFence = false;
  for (const line of body.split(/\r\n|[\n\r]/)) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    // El código en línea se enmascara: `![alt](x.png)` dentro de backticks es
    // documentación de la sintaxis, no una imagen.
    const masked = line.replace(/`+[^`]*`+/g, (m) => " ".repeat(m.length));
    for (const m of masked.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const ref = m[1];
      if (ref === undefined || seen.has(ref)) continue;
      seen.add(ref);
      out.push(ref);
    }
  }
  return out;
}

/**
 * ¿La referencia apunta a un archivo de la propia materia?
 *
 * Solo mira la forma del texto: descarta URLs, protocolos y rutas absolutas.
 * La extensión se decide aparte, para poder avisar de una imagen que existe
 * pero no se publica (un `.svg`).
 */
export function isLocalRef(ref: string): boolean {
  if (ref === "" || ref.startsWith("/") || ref.startsWith("#")) return false;
  // Protocolo o URL sin esquema: `http://`, `data:`, `javascript:`, `//cdn…`.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(ref) || ref.startsWith("//")) return false;
  if (/^[a-zA-Z]:[\\/]/.test(ref)) return false; // ruta absoluta de Windows
  return true;
}

/** ¿La referencia es un archivo local con extensión de imagen admitida? */
export function isLocalImageRef(ref: string): boolean {
  if (!isLocalRef(ref)) return false;
  const clean = ref.split("#")[0]?.split("?")[0] ?? "";
  return extensionOf(clean) !== null;
}

/** Extensión escrita en la ruta, en minúsculas, admitida o no. */
export function rawExtensionOf(ref: string): string {
  return path.extname(ref).replace(/^\./, "").toLowerCase();
}

/** Extensión admitida de una ruta, en minúsculas, o `null`. */
export function extensionOf(ref: string): string | null {
  const ext = path.extname(ref).replace(/^\./, "").toLowerCase();
  return (IMAGE_EXTENSIONS as readonly string[]).includes(ext) ? ext : null;
}

/** Nombre publicado de un archivo: 16 caracteres del sha256 más su extensión. */
export function assetFileName(bytes: Buffer | Uint8Array, ext: string): string {
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
  return `${hash}.${ext}`;
}

export interface ResolvePageAssetsInput {
  /** Cuerpo ya normalizado de la página. */
  body: string;
  /** Carpeta del archivo `.md`, absoluta: contra ella se resuelve la referencia. */
  pageDir: string;
  /** Raíz de la materia (la carpeta del config), absoluta: nada sale de acá. */
  rootDir: string;
  /** Índice de la copia publicada, si existe. */
  index?: AssetIndexType | null;
  /** Adjuntos ya resueltos en esta materia: ruta relativa → adjunto. */
  known: Map<string, WikiAsset>;
}

export interface ResolvePageAssetsResult {
  assets: PageAsset[];
  issues: AssetIssue[];
}

/**
 * Resuelve las referencias de imagen de una página.
 *
 * Una referencia que no resuelve **se deja intacta** y se avisa: el cuerpo se
 * publica igual y el lector la muestra como estaba.
 */
export async function resolvePageAssets(input: ResolvePageAssetsInput): Promise<ResolvePageAssetsResult> {
  const { body, pageDir, rootDir, index, known } = input;
  const assets: PageAsset[] = [];
  const issues: AssetIssue[] = [];

  for (const ref of imageRefs(body)) {
    if (!isLocalRef(ref)) continue;
    const clean = ref.split("#")[0]?.split("?")[0] ?? "";
    const decoded = decodeRef(clean);

    // Extensión no admitida (`.svg`, `.pdf`, `.bmp`): se avisa y el markdown
    // queda como está. Sin extensión no es un adjunto y no se dice nada.
    const ext = extensionOf(decoded);
    if (ext === null) {
      if (rawExtensionOf(decoded) !== "") {
        issues.push({
          kind: "asset-unsupported",
          detail: `"${ref}" no es una imagen publicable (${IMAGE_EXTENSIONS.join(", ")})`,
        });
      }
      continue;
    }

    const full = path.resolve(pageDir, decoded);
    if (!containedIn(rootDir, full)) {
      issues.push({ kind: "asset-outside", detail: `"${ref}" queda fuera de la carpeta de la materia` });
      continue;
    }
    const rel = path.relative(rootDir, full).split(path.sep).join("/");

    const already = known.get(rel);
    if (already) {
      assets.push({ ref, file: already.file });
      continue;
    }

    // Copia publicada: el índice traduce la ruta del vault al nombre publicado y
    // el archivo vive en `assets/<hash>.<ext>`, no donde dice la referencia.
    const named = indexEntry(index, rel);
    if (named !== undefined) {
      // El nombre lo escribió la materia: se acepta solo la forma que produce
      // `assetFileName`, y ya resuelto tiene que caer dentro de `<materia>/assets/`.
      const file = isPublishedAssetName(named) ? named : null;
      const source = file === null ? null : await resolveInsideAssets(rootDir, file);
      if (file === null || source === null) {
        issues.push({
          kind: "asset-index-invalid",
          detail: `"${ref}" → el índice publica "${String(named)}", que no es un nombre de adjunto válido`,
        });
        issues.push({ kind: "asset-missing", detail: `"${ref}" no tiene un archivo publicado válido` });
        continue;
      }
      const bytes = await sizeOrNull(source);
      if (bytes === null) {
        issues.push({ kind: "asset-missing", detail: `"${ref}" → falta el archivo publicado "${file}"` });
        continue;
      }
      const asset: WikiAsset = { file, source, ref: rel, bytes };
      known.set(rel, asset);
      assets.push({ ref, file });
      continue;
    }

    let data: Buffer;
    try {
      data = await readFile(full);
    } catch {
      issues.push({ kind: "asset-missing", detail: `"${ref}" no existe` });
      continue;
    }
    if (data.byteLength > MAX_ASSET_BYTES) {
      issues.push({
        kind: "asset-too-big",
        detail: `"${ref}" pesa ${formatBytes(data.byteLength)} y el tope por archivo es ${formatBytes(MAX_ASSET_BYTES)}`,
      });
      continue;
    }
    const file = assetFileName(data, ext);
    const asset: WikiAsset = { file, source: full, ref: rel, bytes: data.byteLength };
    known.set(rel, asset);
    assets.push({ ref, file });
  }

  return { assets, issues };
}

/**
 * Los adjuntos que caben en el tope de la materia, en el orden en que se
 * encontraron. Lo que no entra se devuelve aparte para avisarlo.
 */
export function capAssets(assets: readonly WikiAsset[]): { kept: WikiAsset[]; dropped: WikiAsset[] } {
  const kept: WikiAsset[] = [];
  const dropped: WikiAsset[] = [];
  let total = 0;
  for (const asset of assets) {
    if (total + asset.bytes > MAX_SUBJECT_ASSET_BYTES) {
      dropped.push(asset);
      continue;
    }
    total += asset.bytes;
    kept.push(asset);
  }
  return { kept, dropped };
}

/** Lee y valida `assets/assets.json` de una materia publicada. */
export async function readAssetIndex(rootDir: string): Promise<AssetIndexType | null> {
  try {
    const raw = await readFile(path.join(rootDir, "assets", ASSET_INDEX_FILE), "utf8");
    const parsed: unknown = JSON.parse(raw);
    return isAssetIndex(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** `%20` y compañía: Obsidian encodea los espacios de la ruta al pegar una imagen. */
function decodeRef(ref: string): string {
  try {
    return decodeURIComponent(ref);
  } catch {
    return ref;
  }
}

/**
 * Valor del índice para `rel`, solo si es una clave propia del objeto: un
 * `"constructor"` o un `"__proto__"` en el markdown no puede sacar nada de la
 * cadena de prototipos.
 */
function indexEntry(index: AssetIndexType | null | undefined, rel: string): unknown {
  if (index === null || index === undefined) return undefined;
  return Object.prototype.hasOwnProperty.call(index.assets, rel) ? index.assets[rel] : undefined;
}

/**
 * true si `target` cuelga de `base`, ya resueltos los dos. Es la versión
 * estricta de `isInside` de `compile.ts`: acá `base` mismo no cuenta —un
 * adjunto es un archivo dentro de la carpeta, nunca la carpeta— y un nombre
 * como `..foo` no se confunde con un `..`.
 */
function containedIn(base: string, target: string): boolean {
  const rel = path.relative(base, target);
  if (path.isAbsolute(rel)) return false;
  return rel !== ".." && !rel.startsWith(`..${path.sep}`);
}

/**
 * Ruta real de un adjunto publicado, o `null` si no cae dentro de
 * `<materia>/assets/`.
 *
 * `isPublishedAssetName` ya deja fuera cualquier nombre con barras o `..`; esta
 * es la segunda vuelta, sobre la ruta ya resuelta y con los enlaces simbólicos
 * seguidos, que es lo único que de verdad dice qué archivo se va a leer.
 */
export async function resolveInsideAssets(rootDir: string, named: string): Promise<string | null> {
  const dir = path.resolve(rootDir, ASSET_DIR);
  const target = path.resolve(dir, named);
  if (!containedIn(dir, target)) return null;
  try {
    // Se comprueban las rutas reales, pero se devuelve la escrita: en macOS
    // `/var` es un enlace a `/private/var` y el origen tiene que seguir
    // nombrándose como la materia lo nombra.
    const realDir = await realpath(dir);
    const realTarget = await realpath(target);
    return containedIn(realDir, realTarget) ? target : null;
  } catch {
    // El archivo no existe todavía: la ruta escrita ya quedó contenida y
    // `sizeOrNull` va a reportar la falta.
    return target;
  }
}

async function sizeOrNull(file: string): Promise<number | null> {
  try {
    const info = await stat(file);
    return info.isFile() ? info.size : null;
  } catch {
    return null;
  }
}
