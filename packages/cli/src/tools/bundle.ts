/**
 * Construcción de un bundle de herramientas (`sinapsis.tools.json`).
 *
 * Un bundle es una carpeta del repositorio de la materia con un manifiesto y los
 * archivos que declara: scripts clásicos (IIFE contra `window.App` / `window.M`),
 * estilos y datos JSON (decisión N0-41). El CLI lo empaqueta en un `ToolPush` y
 * el API lo sirve después bajo el origen de la plataforma.
 *
 * Como ese código termina corriendo en el origen de la plataforma, acá se
 * verifica todo lo que se puede verificar en frío:
 *
 *  1. El manifiesto cumple `ToolManifest`.
 *  2. Cada ruta declarada cumple `ToolFilePath` (sin «..», sin raíz, extensión
 *     conocida), existe, y —resolviendo enlaces simbólicos— queda dentro de la
 *     carpeta del bundle.
 *  3. Cada script parsea COMO SCRIPT CLÁSICO: `node --check` sobre una copia
 *     temporal, siempre con extensión `.js` y con su propio `package.json`
 *     (`"type": "commonjs"`). Las dos cosas apuntan al mismo lado: el cargador
 *     inserta un `<script>` clásico, así que ni un `package.json` de la materia
 *     puede hacer que un IIFE se lea como módulo, ni un `.mjs` puede colar un
 *     `import` que después revienta en el navegador.
 *  4. El bundle no supera el tope de 20 MB del contrato.
 */
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, realpath, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import {
  ToolFilePath,
  ToolManifest,
  ToolPush,
  type ToolFile as ToolFileType,
  type ToolManifest as ToolManifestType,
  type ToolPush as ToolPushType,
} from "@sinapsis/contract";
import { isInside } from "@sinapsis/markdown";

const run = promisify(execFile);

/** Nombre del manifiesto dentro de la carpeta del bundle. */
export const MANIFEST_FILE = "sinapsis.tools.json";
/** Salida de `tools build`: el `ToolPush` listo para `tools push`. */
export const PUSH_FILE = path.join("dist", "tool-push.json");
/** Carpeta de los scripts minificados (`--minify`). */
export const MIN_DIR = ".dist";
/** Tope por bundle (contrato de `ToolPush`). */
export const MAX_BYTES = 20 * 1024 * 1024;

/** Carpetas que nunca forman parte del bundle. */
const SKIP_DIRS = new Set(["dist", MIN_DIR, "node_modules"]);
/** Profundidad máxima del recorrido de la carpeta del bundle. */
const MAX_DEPTH = 8;
/** Motivos por los que un archivo de la carpeta no viaja. */
const SKIP_EXT = "extensión ajena al contrato";
const SKIP_DEPTH = `más de ${MAX_DEPTH} niveles`;
/** Extensiones que viajan como texto; el resto va en base64. */
const TEXT = /\.(js|mjs|css|json|svg|txt|md|csv)$/i;
/** Código: solo se sube si el manifiesto lo declara (el runtime no carga otra cosa). */
const CODE = /\.(js|mjs|css)$/i;

export interface BundleFile {
  /** Ruta relativa a la carpeta del bundle, con barras. */
  path: string;
  encoding: "utf8" | "base64";
  /** Bytes del archivo tal como se sube (ya minificado, si corresponde). */
  bytes: number;
  /** Bytes del original, cuando `--minify` lo cambió. */
  originalBytes?: number;
  /** true si el manifiesto lo declara (scripts, styles, data). */
  declared: boolean;
  role: "script" | "style" | "data" | "asset";
}

export interface BuiltBundle {
  dir: string;
  manifest: ToolManifestType;
  push: ToolPushType;
  files: BundleFile[];
  /** Suma de los bytes que se suben. */
  bytes: number;
  /** Rutas que había en la carpeta y no se suben, cada una con su motivo. */
  skipped: SkippedPath[];
  /**
   * Código de la carpeta que el manifiesto no declara (`.js`, `.mjs`, `.css`):
   * el runtime solo carga lo que está en `scripts` y `styles`, así que subirlo
   * no serviría de nada y publicaría scripts de construcción o código muerto.
   */
  ignored: string[];
}

/** Algo que estaba en la carpeta y no viaja en el bundle, y por qué. */
export interface SkippedPath {
  /** Ruta relativa a la carpeta del bundle, con barras. */
  path: string;
  /** Motivo, en la voz del informe: «extensión ajena al contrato». */
  reason: string;
}

export interface BuildProblem {
  /** Archivo o campo afectado. */
  where: string;
  message: string;
}

export type BuildOutcome = { ok: true; bundle: BuiltBundle } | { ok: false; problems: BuildProblem[] };

export interface BuildBundleOptions {
  /** Minifica los scripts en `.dist/` y sube esa versión. */
  minify?: boolean | undefined;
}

// ---------------------------------------------------------------------------
// Descubrimiento de bundles
// ---------------------------------------------------------------------------

/**
 * Carpetas de bundle bajo `base`: la propia `base` si tiene manifiesto, y si no
 * cada subcarpeta de primer nivel que lo tenga (`<config>/tools/<id>/…`).
 * `null` si `base` no existe.
 */
export async function findBundles(base: string): Promise<string[] | null> {
  if (await isFile(path.join(base, MANIFEST_FILE))) return [base];

  let entries;
  try {
    entries = await readdir(base, { withFileTypes: true });
  } catch (cause) {
    const code = (cause as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "ENOTDIR") return null;
    throw cause;
  }

  const dirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !SKIP_DIRS.has(e.name))
    .map((e) => path.join(base, e.name))
    .sort((a, b) => a.localeCompare(b, "en"));
  const withManifest = await Promise.all(dirs.map((dir) => isFile(path.join(dir, MANIFEST_FILE))));
  return dirs.filter((_, i) => withManifest[i]);
}

/**
 * Manifiesto de un bundle, o `null` si no está o no cumple el contrato. Lo usa
 * `validate` para comprobar que los ítems `kind: "tool"` del rail abran una vista
 * que exista de verdad; los errores detallados los da `tools build`.
 */
export async function readManifest(dir: string): Promise<ToolManifestType | null> {
  try {
    const parsed = ToolManifest.safeParse(JSON.parse(await readFile(path.join(dir, MANIFEST_FILE), "utf8")) as unknown);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// buildBundle
// ---------------------------------------------------------------------------

export async function buildBundle(dir: string, opts: BuildBundleOptions = {}): Promise<BuildOutcome> {
  const problems: BuildProblem[] = [];
  const manifestPath = path.join(dir, MANIFEST_FILE);

  let raw: string;
  try {
    raw = await readFile(manifestPath, "utf8");
  } catch {
    return { ok: false, problems: [{ where: MANIFEST_FILE, message: `no encuentro ${manifestPath}` }] };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw) as unknown;
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    return { ok: false, problems: [{ where: MANIFEST_FILE, message: `no es JSON válido: ${detail}` }] };
  }

  const parsed = ToolManifest.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      problems: parsed.error.issues.map((issue) => ({
        where: `${MANIFEST_FILE}${issue.path.length > 0 ? ` · ${issue.path.join(".")}` : ""}`,
        message: issue.message,
      })),
    };
  }
  const manifest = parsed.data;

  // --- rutas declaradas -----------------------------------------------------
  const declared: Array<{ path: string; role: BundleFile["role"] }> = [
    ...manifest.scripts.map((p) => ({ path: p, role: "script" as const })),
    ...manifest.styles.map((p) => ({ path: p, role: "style" as const })),
    ...manifest.data.map((p) => ({ path: p, role: "data" as const })),
  ];
  const seen = new Map<string, string>();
  for (const item of declared) {
    const before = seen.get(item.path);
    if (before) problems.push({ where: item.path, message: `declarado dos veces (${before} y ${item.role})` });
    else seen.set(item.path, item.role);
  }

  const realDir = await realpath(dir).catch(() => dir);
  for (const item of declared) {
    const full = path.join(dir, item.path);
    let real: string;
    try {
      real = await realpath(full);
    } catch {
      problems.push({ where: item.path, message: `el manifiesto lo declara en «${item.role}» pero el archivo no existe` });
      continue;
    }
    if (!isInside(realDir, real)) {
      problems.push({ where: item.path, message: "un enlace simbólico lo saca de la carpeta del bundle" });
      continue;
    }
    if (!(await isFile(full))) problems.push({ where: item.path, message: "no es un archivo" });
  }

  // --- archivos de la carpeta ----------------------------------------------
  const walked = await walk(dir);
  const skipped: SkippedPath[] = [
    ...walked.invalid.map((p) => ({ path: p, reason: SKIP_EXT })),
    ...walked.pruned.map((p) => ({ path: p, reason: SKIP_DEPTH })),
  ];
  const declaredPaths = new Set(declared.map((d) => d.path));
  const loose = walked.files.filter((p) => !declaredPaths.has(p));
  // Los archivos sueltos que el manifiesto no declara viajan igual —una fuente o
  // una imagen que pide el CSS no se declara en ningún lado—, salvo el código:
  // un script o un estilo que no está en el manifiesto no lo carga nadie.
  const ignored = loose.filter((p) => CODE.test(p));
  const assets = loose.filter((p) => !CODE.test(p));

  if (problems.length > 0) return { ok: false, problems };

  // --- sintaxis de los scripts ---------------------------------------------
  const sources = new Map<string, Buffer>();
  for (const item of declared) sources.set(item.path, await readFile(path.join(dir, item.path)));

  const scripts = manifest.scripts.map((p) => ({ path: p, code: sources.get(p)!.toString("utf8") }));
  problems.push(...(await checkSyntax(scripts)));
  if (problems.length > 0) return { ok: false, problems };

  // --- minificado opcional --------------------------------------------------
  const minified = new Map<string, string>();
  if (opts.minify && scripts.length > 0) {
    const result = await minifyScripts(dir, scripts);
    if (!result.ok) return { ok: false, problems: result.problems };
    for (const [file, code] of result.code) minified.set(file, code);
  }

  // --- archivos del push ----------------------------------------------------
  const files: BundleFile[] = [];
  const push: ToolFileType[] = [];

  const add = async (relative: string, role: BundleFile["role"], declaredHere: boolean) => {
    const min = minified.get(relative);
    const original = sources.get(relative) ?? (await readFile(path.join(dir, relative)));
    const buffer = min === undefined ? original : Buffer.from(min, "utf8");
    const text = TEXT.test(relative) && !buffer.includes(0) && isUtf8(buffer);
    const encoding = text ? ("utf8" as const) : ("base64" as const);
    push.push({ path: relative, encoding, content: text ? buffer.toString("utf8") : buffer.toString("base64") });
    files.push({
      path: relative,
      encoding,
      bytes: buffer.byteLength,
      ...(min === undefined ? {} : { originalBytes: original.byteLength }),
      declared: declaredHere,
      role,
    });
  };

  for (const item of declared) await add(item.path, item.role, true);
  for (const asset of assets) await add(asset, "asset", false);

  const bytes = files.reduce((n, f) => n + f.bytes, 0);
  if (bytes > MAX_BYTES) {
    return {
      ok: false,
      problems: [
        {
          where: manifest.id,
          message:
            `el bundle pesa ${formatBytes(bytes)} y el tope del contrato es ${formatBytes(MAX_BYTES)}. ` +
            "Saque de la carpeta lo que no haga falta (los archivos que no declara el manifiesto también viajan) " +
            "o parta la herramienta en varios bundles.",
        },
      ],
    };
  }

  const payload = ToolPush.safeParse({ manifest, files: push });
  if (!payload.success) {
    return {
      ok: false,
      problems: payload.error.issues.map((issue) => ({
        where: issue.path.join(".") || manifest.id,
        message: issue.message,
      })),
    };
  }

  return { ok: true, bundle: { dir, manifest, push: payload.data, files, bytes, skipped, ignored } };
}

/** Escribe el `ToolPush` compilado (por defecto `<bundle>/dist/tool-push.json`). */
export async function writePush(bundle: BuiltBundle, outFile?: string): Promise<string> {
  const target = outFile ?? path.join(bundle.dir, PUSH_FILE);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(bundle.push, null, 2)}\n`, "utf8");
  return target;
}

// ---------------------------------------------------------------------------
// Auxiliares
// ---------------------------------------------------------------------------

/**
 * Archivos del bundle: todo lo que cuelga de la carpeta (menos `dist/`, `.dist/`,
 * `node_modules/` y lo oculto) partido en los que `ToolFilePath` admite y los que
 * no. Los enlaces simbólicos se saltean: solo se sube lo que está de verdad
 * dentro de la carpeta.
 */
async function walk(dir: string): Promise<{ files: string[]; invalid: string[]; pruned: string[] }> {
  const files: string[] = [];
  const invalid: string[] = [];
  const pruned: string[] = [];

  const visit = async (current: string, prefix: string, depth: number): Promise<void> => {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, "en"))) {
      if (entry.name.startsWith(".") || entry.isSymbolicLink()) continue;
      const relative = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        // La poda se ANOTA: un árbol más hondo que el tope no puede desaparecer
        // en silencio, porque lo que cuelga de ahí no viaja en el bundle.
        if (depth + 1 > MAX_DEPTH) {
          pruned.push(`${relative}/`);
          continue;
        }
        await visit(path.join(current, entry.name), relative, depth + 1);
        continue;
      }
      if (!entry.isFile()) continue;
      if (relative === MANIFEST_FILE) continue; // el manifiesto viaja aparte, en `ToolPush.manifest`
      if (ToolFilePath.safeParse(relative).success) files.push(relative);
      else invalid.push(relative);
    }
  };

  await visit(dir, "", 0);
  return { files, invalid, pruned };
}

/**
 * `node --check` sobre una copia temporal de cada script. Devuelve un problema
 * por script que no parsea, con el error de Node reescrito contra la ruta real.
 */
async function checkSyntax(scripts: ReadonlyArray<{ path: string; code: string }>): Promise<BuildProblem[]> {
  if (scripts.length === 0) return [];
  const work = await mkdtemp(path.join(tmpdir(), "sinapsis-tools-"));
  try {
    // Sin esto, un `package.json` con `"type": "module"` en el repositorio de la
    // materia haría que Node leyera los IIFE clásicos como módulos ES.
    await writeFile(path.join(work, "package.json"), '{ "type": "commonjs" }\n', "utf8");

    const problems: BuildProblem[] = [];
    for (const [i, script] of scripts.entries()) {
      // SIEMPRE `.js`: el cargador inserta los scripts del bundle como
      // `<script>` clásico, así que lo que hay que comprobar es que parseen como
      // script, no como módulo. Con la copia en `.mjs`, un `import`/`export`
      // pasaba el gate acá y reventaba recién en el navegador.
      const copy = path.join(work, `check-${i}.js`);
      await writeFile(copy, script.code, "utf8");
      try {
        await run(process.execPath, ["--check", copy]);
      } catch (cause) {
        const stderr = String((cause as { stderr?: string }).stderr ?? cause);
        problems.push({ where: script.path, message: syntaxMessage(stderr, script.path) });
      }
    }
    return problems;
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

/**
 * Deja el error de `node --check` en una sola línea, con la ruta real del script.
 * La ruta de la copia no le sirve al autor, y además Node la imprime ya resuelta
 * (`/private/var/…`), así que de esa línea solo se rescata el número.
 */
function syntaxMessage(stderr: string, real: string): string {
  const lines = stderr.split("\n").map((l) => l.trim());
  const error = lines.find((l) => /^\w*(Syntax|Reference|Type)Error\b/.test(l));
  const at = lines.map((l) => l.match(/(?:^|\/)check-\d+\.m?js:(\d+)$/)).find((m) => m !== null);
  const where = at ? `${real}:${at[1]}` : real;
  return `${error ?? "no parsea"} — ${where}${isModuleSyntax(stderr) ? MODULE_HINT : ""}`;
}

/** ¿El script falló por ser un módulo ES y no un script clásico? */
function isModuleSyntax(stderr: string): boolean {
  return /Cannot use import statement outside a module|Unexpected token '?export'?|await is only valid/i.test(stderr);
}

const MODULE_HINT =
  ". El runtime inserta los scripts del bundle como `<script>` clásico: no admite " +
  "`import` ni `export`. Envuelva el código en un IIFE y regístrelo contra `window.App`.";

/**
 * ¿El contenido es UTF-8 válido? Un `.txt`/`.csv`/`.md`/`.css`/`.svg` en latin-1
 * pasa el filtro de extensión y no tiene bytes nulos, pero subirlo como texto lo
 * llena de U+FFFD y le cambia el tamaño: eso va en base64.
 */
function isUtf8(buffer: Buffer): boolean {
  return Buffer.compare(Buffer.from(buffer.toString("utf8"), "utf8"), buffer) === 0;
}

/**
 * Minifica cada script en `<bundle>/.dist/<ruta>` con esbuild y devuelve el
 * código minificado. esbuild es una dependencia de desarrollo del CLI: si no
 * está instalada, `--minify` falla con un mensaje claro en vez de subir el
 * bundle a medias.
 */
async function minifyScripts(
  dir: string,
  scripts: ReadonlyArray<{ path: string; code: string }>,
): Promise<{ ok: true; code: Map<string, string> } | { ok: false; problems: BuildProblem[] }> {
  let transform: (typeof import("esbuild"))["transform"];
  try {
    ({ transform } = await import("esbuild"));
  } catch (cause) {
    return {
      ok: false,
      problems: [
        {
          where: "--minify",
          message: `hace falta esbuild para minificar y no se pudo cargar (${cause instanceof Error ? cause.message : String(cause)})`,
        },
      ],
    };
  }

  const code = new Map<string, string>();
  const problems: BuildProblem[] = [];
  for (const script of scripts) {
    try {
      // Sin `format`: los scripts son clásicos y su ámbito superior es el global
      // (`window.App`), así que no se los puede envolver ni renombrar por arriba.
      const out = await transform(script.code, {
        loader: "js",
        minify: true,
        legalComments: "none",
        target: "es2019",
      });
      const target = path.join(dir, MIN_DIR, script.path);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, out.code, "utf8");
      code.set(script.path, out.code);
    } catch (cause) {
      problems.push({ where: script.path, message: `no se pudo minificar: ${cause instanceof Error ? cause.message : String(cause)}` });
    }
  }
  return problems.length > 0 ? { ok: false, problems } : { ok: true, code };
}

async function isFile(target: string): Promise<boolean> {
  try {
    return (await stat(target)).isFile();
  } catch {
    return false;
  }
}

/** "348 KB", "1.2 MB": para los resúmenes, no para el contrato. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
