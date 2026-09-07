/**
 * `sinapsis site build` — compila las materias de `subjects/` a los archivos
 * estáticos que lee la web (contrato `@sinapsis/contract/site`).
 *
 * Es el reemplazo del API: lo que antes hacía `PUT /api/subjects/:slug/sync`
 * contra SQLite (resolver enlaces, levantar advertencias, guardar el material de
 * estudio) y lo que hacía `PUT …/tools/:id` con los bundles (escribirlos en
 * disco, con contención de rutas), ahora ocurre en frío y el resultado se
 * publica como archivos:
 *
 *     <out>/index.json                  SiteCatalog
 *     <out>/<slug>/subject.json         SiteSubject
 *     <out>/<slug>/pages.json           SitePages
 *     <out>/<slug>/tools.json           SiteTools
 *     <out>/<slug>/tools/<id>/<path>    archivos de cada bundle
 *
 * Todo se valida con los esquemas de `site.ts` ANTES de escribirlo: un archivo
 * que la web no podría parsear no llega a existir.
 */
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import {
  PageMeta,
  SubjectConfig,
  countsAsContent,
  plural,
  type ColorRef,
  type Page as PageType,
  type SubjectConfig as SubjectConfigType,
  type ToolInfo as ToolInfoType,
} from "@sinapsis/contract";
import {
  SiteCatalog,
  SitePages,
  SiteSubject,
  SiteTools,
  SITE_ASSETS_DIR,
  SITE_FORMAT,
  siteToolBase,
  type SiteCatalogEntry as SiteCatalogEntryType,
} from "@sinapsis/contract/site";
import { compileWiki, isPublishedAssetName, type WikiAsset } from "@sinapsis/markdown";
import { resolveUserPath, type Ctx } from "../context.js";
import { buildBundle, findBundles, type BuiltBundle } from "../tools/bundle.js";
import { GENERATOR } from "../version.js";
import { pageWarnings, resolveLinks, studyWarnings, warningSink } from "../site/warnings.js";

export interface SiteBuildOptions {
  /** Carpeta con las materias fuente (`subjects/`). */
  subjects?: string;
  /** Carpeta de salida (`apps/web/public/subjects/`). */
  out?: string;
  /** Compila una sola materia y deja el resto del `--out` como estaba. */
  only?: string;
  /** Las advertencias también hacen salir 1. */
  strict?: boolean;
}

export const DEFAULT_SUBJECTS_DIR = "subjects";
export const DEFAULT_OUT_DIR = path.join("apps", "web", "public", "subjects");
export const CONFIG_FILE = "sinapsis.config.json";

/**
 * Color de la materia cuando el config no declara ninguno. Era el
 * `DEFAULT_SUBJECT_COLOR` del API (`services/landing.ts`): el catálogo del sitio
 * exige un color, porque la landing pinta la tarjeta con él.
 */
export const DEFAULT_SUBJECT_COLOR = "--u1";

/** Tope de advertencias que admite `SiteSubject.warnings`. */
const MAX_SUBJECT_WARNINGS = 500;

/** Lo que se escribe de una materia; se arma entero antes de tocar el disco. */
interface CompiledSubject {
  slug: string;
  dir: string;
  entry: SiteCatalogEntryType;
  subject: unknown;
  pages: unknown;
  tools: unknown;
  bundles: BuiltBundle[];
  /** Adjuntos de imagen que hay que emitir bajo `<out>/<slug>/assets/` (N0-nn). */
  assets: readonly WikiAsset[];
  warnings: string[];
  /** Páginas totales y las que cuentan como contenido, para el resumen. */
  counts: { pages: number; content: number };
}

export async function runSiteBuild(opts: SiteBuildOptions, ctx: Ctx): Promise<number> {
  const subjectsDir = resolveUserPath(ctx, opts.subjects ?? DEFAULT_SUBJECTS_DIR);
  const outDir = resolveUserPath(ctx, opts.out ?? DEFAULT_OUT_DIR);
  const builtAt = new Date().toISOString();

  const all = await listSubjects(subjectsDir);
  if (all === null) {
    ctx.err(pc.red(`No encuentro la carpeta de materias: ${subjectsDir}`));
    ctx.err(pc.dim("Indique otra con --subjects <dir>."));
    return 1;
  }

  const only = (opts.only ?? "").trim();
  const selected = only === "" ? all : all.filter((s) => s === only);
  if (only !== "" && selected.length === 0) {
    ctx.err(pc.red(`No encuentro la materia "${only}" en ${subjectsDir}.`));
    ctx.err(pc.dim(all.length === 0 ? "La carpeta no tiene ninguna materia." : `Hay: ${all.join(", ")}`));
    return 1;
  }
  if (all.length === 0) {
    ctx.out(pc.yellow(`${subjectsDir} no tiene ninguna materia (falta un ${CONFIG_FILE}).`));
  }

  ctx.out(pc.bold(`site build · ${subjectsDir}`));
  ctx.out(`  salida: ${pc.dim(outDir)}`);
  ctx.out("");

  const compiled: CompiledSubject[] = [];
  let failed = false;
  for (const slug of selected) {
    const outcome = await compileSubject(ctx, path.join(subjectsDir, slug), builtAt);
    if (outcome === null) {
      failed = true;
      continue;
    }
    compiled.push(outcome);
  }
  if (failed) {
    ctx.err(pc.red("No se escribió nada: primero corrija las materias que no compilan."));
    return 1;
  }

  // --- escritura ------------------------------------------------------------
  for (const subject of compiled) {
    const dir = path.join(outDir, subject.slug);
    // Reemplazo completo: lo que ya no está en la fuente no sobrevive al build.
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    await writeJson(path.join(dir, "subject.json"), subject.subject);
    await writeJson(path.join(dir, "pages.json"), subject.pages);
    await writeJson(path.join(dir, "tools.json"), subject.tools);
    // Los adjuntos van tal cual, con el nombre publicado: el lector los pide
    // por `siteAssetBase(slug) + "/" + file`, prefijado con `BASE_URL`.
    if (subject.assets.length > 0) {
      const assetsDir = path.join(dir, SITE_ASSETS_DIR);
      await mkdir(assetsDir, { recursive: true });
      for (const asset of subject.assets) {
        // El nombre viene del compilador, pero puede haber salido del
        // `assets.json` de una materia: la misma contención que los bundles.
        // `site build` corre en el CI de cada PR, así que acá no se descarta en
        // silencio, se para.
        const target = isPublishedAssetName(asset.file) ? resolveInside(assetsDir, asset.file) : null;
        if (target === null) {
          ctx.err(pc.red(`${subject.slug} · adjunto "${asset.file}": no es un nombre publicado válido`));
          return 1;
        }
        await copyFile(asset.source, target);
      }
    }
    for (const bundle of subject.bundles) {
      const problem = await writeBundleFiles(path.join(dir, "tools", bundle.manifest.id), bundle);
      if (problem !== null) {
        ctx.err(pc.red(`${subject.slug} · bundle "${bundle.manifest.id}": ${problem}`));
        return 1;
      }
    }
  }

  // Sin `--only`, el `--out` refleja exactamente lo que hay en `--subjects`.
  const removed = only === "" ? await pruneOutput(outDir, new Set(all)) : [];

  const catalog = SiteCatalog.parse({
    format: SITE_FORMAT,
    builtAt,
    generator: GENERATOR,
    subjects: mergeCatalog(await readCatalog(outDir), compiled.map((s) => s.entry), only === "" ? new Set(all) : null),
  });
  await mkdir(outDir, { recursive: true });
  await writeJson(path.join(outDir, "index.json"), catalog);

  // --- informe --------------------------------------------------------------
  let warned = 0;
  for (const subject of compiled) {
    const tools = subject.bundles.length;
    ctx.out(
      `  ${pc.bold(subject.slug.padEnd(14))} ${String(subject.counts.pages).padStart(4)} ${plural(subject.counts.pages, "página", "páginas")}` +
        pc.dim(` (${subject.counts.content} de contenido)`) +
        ` · ${tools} ${plural(tools, "bundle", "bundles")}` +
        (subject.warnings.length === 0
          ? ` · ${pc.green("sin advertencias")}`
          : ` · ${pc.yellow(`${subject.warnings.length} advertencia(s)`)}`),
    );
    for (const line of subject.warnings.slice(0, 8)) ctx.out(pc.yellow(`      ${line}`));
    if (subject.warnings.length > 8) ctx.out(pc.dim(`      … y ${subject.warnings.length - 8} más`));
    warned += subject.warnings.length;
  }
  for (const slug of removed) ctx.out(pc.dim(`  ${slug}: se quitó de la salida (ya no está en ${subjectsDir})`));

  ctx.out("");
  ctx.out(
    pc.green(
      `${compiled.length} ${plural(compiled.length, "materia compilada", "materias compiladas")} en ${outDir}`,
    ),
  );
  if (warned > 0 && opts.strict) {
    ctx.err(pc.red(`--strict: ${warned} advertencia(s) hacen fallar el build.`));
    return 1;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Compilación de una materia
// ---------------------------------------------------------------------------

/** Compila una materia entera. `null` si algo impide publicarla (ya informó). */
async function compileSubject(ctx: Ctx, dir: string, builtAt: string): Promise<CompiledSubject | null> {
  const slug = path.basename(dir);
  const configFile = path.join(dir, CONFIG_FILE);

  let config: SubjectConfigType;
  try {
    config = SubjectConfig.parse(JSON.parse(await readFile(configFile, "utf8")) as unknown);
  } catch (cause) {
    ctx.err(pc.red(`${configFile} no se puede leer como config de materia:`));
    ctx.err(`  ${cause instanceof Error ? cause.message : String(cause)}`);
    return null;
  }
  if (config.slug !== slug) {
    ctx.err(pc.red(`${configFile}: el slug del config ("${config.slug}") no coincide con la carpeta ("${slug}").`));
    return null;
  }

  let compiled;
  try {
    compiled = await compileWiki({ config, rootDir: dir, generator: GENERATOR });
  } catch (cause) {
    ctx.err(pc.red(`${slug}: no se pudo compilar el wiki:`));
    ctx.err(`  ${cause instanceof Error ? cause.message : String(cause)}`);
    return null;
  }

  const pages: PageType[] = compiled.payload.pages;
  const slugs = new Set(pages.map((p) => p.slug));

  // Advertencias: las del compilador (wikilinks rotos, slugs normalizados…) más
  // las de coherencia que levantaba el API al recibir el sync.
  const sink = warningSink();
  pageWarnings(config, pages, sink);
  studyWarnings(config, compiled.study, slugs, sink);
  const warnings = capWarnings([...compiled.warnings, ...sink.drain()], MAX_SUBJECT_WARNINGS);

  // --- bundles --------------------------------------------------------------
  const bundles: BuiltBundle[] = [];
  const dirs = (await findBundles(path.join(dir, "tools"))) ?? [];
  for (const bundleDir of dirs) {
    const outcome = await buildBundle(bundleDir);
    if (!outcome.ok) {
      ctx.err(pc.red(`${slug}: el bundle de ${bundleDir} no compila:`));
      for (const problem of outcome.problems) ctx.err(`  ${pc.bold(problem.where)}: ${problem.message}`);
      return null;
    }
    bundles.push(outcome.bundle);
  }

  const tools: ToolInfoType[] = bundles.map((bundle) => ({
    manifest: bundle.manifest,
    bytes: bundle.bytes,
    updatedAt: builtAt,
    base: siteToolBase(slug, bundle.manifest.id),
  }));

  // --- archivos del contrato ------------------------------------------------
  const subject = SiteSubject.parse({
    format: SITE_FORMAT,
    builtAt,
    generator: GENERATOR,
    config,
    pages: pages.map((page) => PageMeta.parse(page)),
    links: resolveLinks(pages, slugs),
    study: compiled.study,
    warnings,
  });

  const bodies: Record<string, unknown> = {};
  for (const page of pages) {
    bodies[page.slug] = {
      body: page.body,
      links: page.links,
      headings: page.headings,
      assets: page.assets,
    };
  }
  const sitePages = SitePages.parse({ format: SITE_FORMAT, pages: bodies });
  const siteTools = SiteTools.parse({ format: SITE_FORMAT, tools });

  const content = pages.filter((p) => countsAsContent(config, p.type)).length;
  const entry: SiteCatalogEntryType = {
    slug,
    name: config.name,
    code: config.code,
    institution: config.institution,
    color: (config.color ?? DEFAULT_SUBJECT_COLOR) as ColorRef,
    ...(config.semester === undefined ? {} : { semester: config.semester }),
    division: config.division,
    divisionsCount: config.divisions.length,
    pagesCount: content,
    totalPages: pages.length,
    toolsCount: bundles.length,
    builtAt,
  };

  return {
    slug,
    dir,
    entry,
    subject,
    pages: sitePages,
    tools: siteTools,
    bundles,
    assets: compiled.assets,
    warnings,
    counts: { pages: pages.length, content },
  };
}

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

/**
 * Escribe los archivos de un bundle bajo `<out>/<slug>/tools/<id>/`.
 *
 * Decodifica el `ToolFile` (utf8 o base64) y aplica la misma contención que
 * hacía el API (`services/tools.ts`, `resolveInside`): la ruta resuelta tiene
 * que caer dentro de la carpeta del bundle. `buildBundle` ya validó cada `path`
 * contra `ToolFilePath`, pero acá se vuelve a comprobar porque esta es la
 * función que de verdad decide qué archivo se escribe.
 */
async function writeBundleFiles(root: string, bundle: BuiltBundle): Promise<string | null> {
  await mkdir(root, { recursive: true });
  for (const file of bundle.push.files) {
    const target = resolveInside(root, file.path);
    if (target === null) return `el archivo "${file.path}" sale de la carpeta del bundle`;
    const data = file.encoding === "base64" ? Buffer.from(file.content, "base64") : Buffer.from(file.content, "utf8");
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data);
  }
  return null;
}

/**
 * Resuelve `relative` dentro de `root` y devuelve la ruta absoluta, o `null` si
 * se escapa. Portada de `resolveInside` del API: nunca se confía en la forma del
 * texto, sino en la ruta ya resuelta.
 */
export function resolveInside(root: string, relative: string): string | null {
  const target = path.resolve(root, relative);
  const prefix = root.endsWith(path.sep) ? root : root + path.sep;
  return target === root || !target.startsWith(prefix) ? null : target;
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value)}\n`, "utf8");
}

/** Carpetas del `--out` que ya no corresponden a ninguna materia. Devuelve las quitadas. */
async function pruneOutput(outDir: string, keep: ReadonlySet<string>): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(outDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const stale = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !keep.has(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "en"));
  for (const name of stale) await rm(path.join(outDir, name), { recursive: true, force: true });
  return stale;
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

/** El catálogo que ya estaba escrito, o `[]` si no hay ninguno legible. */
async function readCatalog(outDir: string): Promise<SiteCatalogEntryType[]> {
  try {
    const parsed = SiteCatalog.safeParse(JSON.parse(await readFile(path.join(outDir, "index.json"), "utf8")));
    return parsed.success ? parsed.data.subjects : [];
  } catch {
    return [];
  }
}

/**
 * Catálogo final: las materias recién compiladas más, con `--only`, las que ya
 * estaban y no se tocaron (sus archivos siguen en el `--out`). Sin `--only` el
 * catálogo es exactamente lo que hay en `--subjects`.
 */
export function mergeCatalog(
  previous: readonly SiteCatalogEntryType[],
  compiled: readonly SiteCatalogEntryType[],
  keep: ReadonlySet<string> | null,
): SiteCatalogEntryType[] {
  const fresh = new Map(compiled.map((entry) => [entry.slug, entry]));
  const out = [...fresh.values()];
  for (const entry of previous) {
    if (fresh.has(entry.slug)) continue;
    if (keep !== null && !keep.has(entry.slug)) continue;
    out.push(entry);
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug, "en"));
}

// ---------------------------------------------------------------------------
// Auxiliares
// ---------------------------------------------------------------------------

/** Carpetas de `base` con un `sinapsis.config.json`. `null` si `base` no existe. */
export async function listSubjects(base: string): Promise<string[] | null> {
  let entries;
  try {
    entries = await readdir(base, { withFileTypes: true });
  } catch (cause) {
    const code = (cause as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "ENOTDIR") return null;
    throw cause;
  }
  const dirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "en"));
  const withConfig = await Promise.all(
    dirs.map(async (name) => {
      try {
        await readFile(path.join(base, name, CONFIG_FILE), "utf8");
        return true;
      } catch {
        return false;
      }
    }),
  );
  return dirs.filter((_, i) => withConfig[i]);
}

/** Recorta la lista al tope del contrato, resumiendo lo que queda afuera. */
export function capWarnings(lines: readonly string[], max: number): string[] {
  if (lines.length <= max) return [...lines];
  return [...lines.slice(0, max - 1), `…y ${lines.length - (max - 1)} advertencia(s) más`];
}
