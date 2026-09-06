/**
 * Bundles de herramientas de una materia (Sprint 3 · N0-41 y N0-42).
 *
 * Un bundle es un manifiesto (`ToolManifest`) más un puñado de archivos
 * estáticos: scripts clásicos, estilos, datos e imágenes. El índice vive en la
 * tabla `subject_tools`; los archivos, en disco, bajo
 *
 *     TOOLS_DIR/<subject_id>/<tool_id>/<path>
 *
 * Están en disco y no en la base porque se sirven tal cual, byte a byte: como
 * blobs en SQLite pagaríamos una lectura y una copia en memoria por request
 * para no ganar nada.
 *
 * El push es atómico: los archivos se escriben en una carpeta temporal hermana
 * y recién al final se renombra sobre la definitiva (la anterior se aparta y se
 * borra después). Así un push a medio camino —o fallado— nunca deja el bundle
 * mezclado entre dos versiones, y la carpeta que se sirve pasa de una versión
 * completa a la siguiente en un solo `rename` del mismo sistema de archivos.
 *
 * Contención: cada `path` se valida con `ToolFilePath` del contrato (sin `..`,
 * sin raíz, extensión conocida) y además se exige que sea una ruta POSIX ya
 * normalizada y que, resuelta contra la carpeta del bundle, siga cayendo
 * adentro. La primera regla es del contrato, la segunda es la que de verdad
 * impide escribir o leer fuera: nunca se confía en la forma del texto.
 */
import { createHash, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix, resolve, sep } from "node:path";
import {
  ToolFilePath,
  toolFileUrl,
  type ToolFile,
  type ToolInfo,
  type ToolManifest,
} from "@sinapsis/contract";
import type { AppEnv } from "../env.js";
import { badRequest, httpError } from "../lib/errors.js";
import type { SubjectToolRow } from "../db/schema.js";

/** Tope del bundle entero, ya decodificado (el contrato dice 20 MB). */
export const MAX_TOOL_BYTES = 20 * 1024 * 1024;

/** Archivo listo para escribirse: ruta relativa validada y contenido decodificado. */
export interface DecodedFile {
  path: string;
  data: Buffer;
}

// ---------------------------------------------------------------------------
// Ubicación en disco
// ---------------------------------------------------------------------------

/**
 * Raíz de los bundles: `TOOLS_DIR` si está declarado y, si no, la carpeta
 * `tools/` al lado del archivo SQLite de `DATABASE_URL` (así los datos de una
 * instalación quedan todos juntos). Con una base remota (Turso) o en memoria
 * cae en `./data/tools`.
 */
export function toolsRoot(env: AppEnv): string {
  if (env.TOOLS_DIR) return resolve(process.cwd(), env.TOOLS_DIR);
  const url = env.DATABASE_URL;
  if (url.startsWith("file:")) {
    const file = url.slice("file:".length);
    // `file::memory:` y compañía no tienen carpeta.
    if (file.length > 0 && !file.startsWith(":")) {
      return join(dirname(resolve(process.cwd(), file)), "tools");
    }
  }
  return resolve(process.cwd(), "data", "tools");
}

/** Carpeta de un bundle concreto. */
export function bundleDir(env: AppEnv, subjectId: string, toolId: string): string {
  return join(toolsRoot(env), subjectId, toolId);
}

/**
 * Resuelve `relative` dentro de `root` y devuelve la ruta absoluta, o null si
 * se escapa. Es la única función que decide qué archivo se toca: todo lo demás
 * (escritura y lectura) pasa por acá.
 */
export function resolveInside(root: string, relative: string): string | null {
  const target = resolve(root, relative);
  const prefix = root.endsWith(sep) ? root : root + sep;
  return target === root || !target.startsWith(prefix) ? null : target;
}

// ---------------------------------------------------------------------------
// URL pública y tipos MIME
// ---------------------------------------------------------------------------

/**
 * Base de las URLs de los archivos del bundle, SIN barra final: la web compone
 * `${base}/${path}`. Es exactamente `toolFileUrl(slug, id, "")` recortada, así
 * que las dos formas de armar la URL coinciden carácter por carácter:
 *
 *     base = "/api/subjects/<slug>/tools/<id>/files"
 *     url  = `${base}/${path}`   →   "/api/subjects/<slug>/tools/<id>/files/app.js"
 */
export function toolBase(slug: string, toolId: string): string {
  return toolFileUrl(slug, toolId, "").replace(/\/+$/, "");
}

/** Tipos MIME de las extensiones que admite `ToolFilePath`. */
const CONTENT_TYPES: Readonly<Record<string, string>> = {
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  woff: "font/woff",
  woff2: "font/woff2",
  txt: "text/plain; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  csv: "text/csv; charset=utf-8",
};

/**
 * Content-Type por extensión. `ToolFilePath` ya limita las extensiones
 * admitidas, así que el fallback solo cubre un contrato que crezca sin que esta
 * tabla lo acompañe: se sirve como binario opaco, nunca como algo que el
 * navegador pueda interpretar.
 */
export function contentTypeFor(path: string): string {
  const ext = (/\.([a-z0-9]+)$/i.exec(path)?.[1] ?? "").toLowerCase();
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

/** ETag fuerte de un contenido: los 32 primeros hex de su sha-256. */
export function etagOf(data: Buffer): string {
  return `"${createHash("sha256").update(data).digest("hex").slice(0, 32)}"`;
}

// ---------------------------------------------------------------------------
// Validación del push
// ---------------------------------------------------------------------------

const BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/;

/**
 * Ruta admisible dentro de un bundle: la del contrato y, además, ya
 * normalizada (`a/./b`, `a//b` y los `..` que el contrato deja pasar en medio
 * de un segmento quedan afuera). Se exige la forma normalizada en vez de
 * normalizarla en silencio para que el `path` del archivo y el que cita el
 * manifiesto sean el mismo texto: si se normalizara, un manifiesto podría
 * referirse a un archivo que existe con otro nombre.
 */
export function checkToolPath(path: string): string | null {
  const parsed = ToolFilePath.safeParse(path);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "ruta de bundle inválida";
  if (posix.normalize(path) !== path) return "ruta de bundle: debe venir normalizada";
  return null;
}

/**
 * Decodifica los archivos del push y valida rutas, duplicados y tamaño total.
 * Devuelve los buffers listos para escribir; lanza 400 (rutas) o 413 (tamaño).
 */
export function decodeToolFiles(files: readonly ToolFile[], root: string): DecodedFile[] {
  const out: DecodedFile[] = [];
  const seen = new Set<string>();
  let total = 0;

  for (const file of files) {
    const problem = checkToolPath(file.path);
    if (problem) throw badRequest(`Archivo "${file.path}": ${problem}`);
    if (seen.has(file.path)) throw badRequest(`El archivo "${file.path}" viene repetido en el bundle`);
    seen.add(file.path);

    // Segunda barrera, la que de verdad manda: la ruta resuelta tiene que caer
    // dentro de la carpeta del bundle.
    if (resolveInside(root, file.path) === null) {
      throw badRequest(`Archivo "${file.path}": la ruta sale de la carpeta del bundle`);
    }

    let data: Buffer;
    if (file.encoding === "base64") {
      const raw = file.content.replace(/\s+/g, "");
      if (!BASE64_RE.test(raw) || raw.length % 4 !== 0) {
        throw badRequest(`Archivo "${file.path}": el contenido no es base64 válido`);
      }
      data = Buffer.from(raw, "base64");
    } else {
      data = Buffer.from(file.content, "utf8");
    }

    total += data.byteLength;
    if (total > MAX_TOOL_BYTES) {
      throw httpError(
        413,
        `El bundle supera el tope de ${Math.round(MAX_TOOL_BYTES / (1024 * 1024))} MB`,
      );
    }
    out.push({ path: file.path, data });
  }

  return out;
}

/**
 * Archivos que el manifiesto declara (`scripts`, `styles`, `data`) y no vienen
 * en el push. Los `views` no se listan: son ids de vista, no archivos.
 */
export function missingManifestFiles(manifest: ToolManifest, present: ReadonlySet<string>): string[] {
  const declared = [...manifest.scripts, ...manifest.styles, ...manifest.data];
  return [...new Set(declared.filter((path) => !present.has(path)))];
}

// ---------------------------------------------------------------------------
// Escritura y borrado
// ---------------------------------------------------------------------------

/**
 * Escribe el bundle entero de forma atómica: staging hermano → se aparta la
 * versión anterior → `rename` del staging a la carpeta final → se borra la
 * apartada. Si algo falla antes del último paso, se restaura la anterior y no
 * queda nada a medio escribir.
 */
export function writeBundle(
  env: AppEnv,
  subjectId: string,
  toolId: string,
  files: readonly DecodedFile[],
): void {
  const parent = join(toolsRoot(env), subjectId);
  const final = join(parent, toolId);
  const stamp = randomBytes(6).toString("hex");
  const staging = join(parent, `.push-${toolId}-${stamp}`);
  const previous = join(parent, `.old-${toolId}-${stamp}`);

  mkdirSync(staging, { recursive: true });
  try {
    for (const file of files) {
      const target = resolveInside(staging, file.path);
      if (target === null) {
        throw badRequest(`Archivo "${file.path}": la ruta sale de la carpeta del bundle`);
      }
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, file.data);
    }
  } catch (error) {
    rmSync(staging, { recursive: true, force: true });
    throw error;
  }

  const hadPrevious = existsSync(final);
  if (hadPrevious) renameSync(final, previous);
  try {
    renameSync(staging, final);
  } catch (error) {
    if (hadPrevious) renameSync(previous, final);
    rmSync(staging, { recursive: true, force: true });
    throw error;
  }
  if (hadPrevious) rmSync(previous, { recursive: true, force: true });
}

/** Borra la carpeta del bundle (inocuo si no existe). */
export function removeBundle(env: AppEnv, subjectId: string, toolId: string): void {
  rmSync(bundleDir(env, subjectId, toolId), { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------------------

/**
 * Contenido de un archivo del bundle, o null si la ruta no es admisible, sale
 * de la carpeta o no existe (todos esos casos son un 404 para el cliente: no se
 * distingue «no existe» de «no te corresponde»).
 */
export function readBundleFile(
  env: AppEnv,
  subjectId: string,
  toolId: string,
  relative: string,
): Buffer | null {
  if (relative.length === 0 || checkToolPath(relative) !== null) return null;
  const target = resolveInside(bundleDir(env, subjectId, toolId), relative);
  if (target === null) return null;
  try {
    if (!statSync(target).isFile()) return null;
    return readFileSync(target);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Fila → contrato
// ---------------------------------------------------------------------------

/** `subject_tools` → `ToolInfo` (lo que ve la web). */
export function rowToToolInfo(row: SubjectToolRow, slug: string): ToolInfo {
  return {
    manifest: row.manifestJson,
    bytes: row.bytes,
    updatedAt: row.updatedAt,
    base: toolBase(slug, row.toolId),
  };
}
