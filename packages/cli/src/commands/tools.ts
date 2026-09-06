/**
 * `sinapsis tools build | list` — los bundles de herramientas y figuras de la
 * materia (decisiones N0-41 y N0-42).
 *
 * La carpeta por defecto es `<carpeta del config>/tools`: si tiene manifiesto es
 * un único bundle, y si no, cada subcarpeta con `sinapsis.tools.json` es uno
 * (`tools/explorador/`, `tools/figuras/`…). `publish` usa exactamente el mismo
 * camino para decidir qué archivos de cada bundle viajan al repositorio de la
 * plataforma.
 *
 * Desde el Sprint 4 no hay `tools push`: no hay API al que subir nada. Publicar
 * un bundle es publicar la materia (`sinapsis publish`), y `tools list` mira lo
 * que hay en `<repo>/subjects/<slug>/tools`, no lo que devolvía un servidor.
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { plural, routes, type ToolManifest as ToolManifestType } from "@sinapsis/contract";
import { resolveUserPath, type Ctx } from "../context.js";
import { heading } from "../report.js";
import {
  MANIFEST_FILE,
  buildBundle,
  findBundles,
  formatBytes,
  readManifest,
  writePush,
  type BuildProblem,
  type BuiltBundle,
  type SkippedPath,
} from "../tools/bundle.js";
import { repoRoot } from "../git.js";
import { SUBJECTS_DIR } from "./publish.js";
import { resolveRepo } from "./propose.js";
import { DEFAULT_CONFIG, loadConfig } from "./validate.js";

export interface ToolsBuildOptions {
  config?: string;
  dir?: string;
  minify?: boolean;
  /** Dónde escribir el `ToolPush` (solo con un bundle). */
  out?: string;
}

export interface ToolsListOptions {
  config?: string;
  /** Repositorio de la plataforma (o `SINAPSIS_HOME`). */
  repo?: string;
}

/** Carpeta de herramientas: `--dir`, o `<carpeta del config>/tools`. */
export function toolsDir(ctx: Ctx, configPath: string, flag?: string): string {
  return flag ? resolveUserPath(ctx, flag) : path.join(path.dirname(configPath), "tools");
}

/** Lo que devuelve `buildAll`: o están todos construidos, o algo impide seguir. */
export type BuildAllOutcome = { ok: true; bundles: BuiltBundle[] } | { ok: false };

export interface BuildAllOptions {
  minify?: boolean | undefined;
  out?: string | undefined;
  /**
   * `true` cuando las herramientas son un extra del comando y no su objeto:
   * publicar una materia SIN carpeta `tools/` (o sin manifiestos) avisa y
   * sigue, porque lo que se pidió es publicar el wiki. En
   * `tools build` la carpeta es el objeto del comando y su ausencia es un
   * error.
   */
  optional?: boolean | undefined;
}

/**
 * Construye todos los bundles de `base`.
 *
 * Distingue dos desenlaces que antes eran el mismo:
 *
 *   no hay carpeta / no hay manifiestos → no hay nada que construir. Con
 *     `optional`, es un aviso y la lista vacía;
 *   un bundle no compila → error: no se publica ninguno, para que la materia no
 *     quede con la mitad publicada.
 */
export async function buildAll(ctx: Ctx, base: string, opts: BuildAllOptions): Promise<BuildAllOutcome> {
  const dirs = await findBundles(base);
  const nothing = (headline: string, hint: string): BuildAllOutcome => {
    if (opts.optional) {
      ctx.out(pc.yellow(`  ${headline}`));
      ctx.out(pc.dim(`  ${hint}`));
      return { ok: true, bundles: [] };
    }
    ctx.err(pc.red(headline));
    ctx.err(pc.dim(hint));
    return { ok: false };
  };

  if (dirs === null) {
    return nothing(
      `No encuentro la carpeta de herramientas: ${base}`,
      `Cree <materia>/tools/<id>/${MANIFEST_FILE}, o indique otra carpeta con --dir.`,
    );
  }
  if (dirs.length === 0) {
    return nothing(
      `${base} no tiene ningún bundle.`,
      `Falta un ${MANIFEST_FILE} en esa carpeta o en alguna de sus subcarpetas.`,
    );
  }
  if (dirs.length > 1 && opts.out) {
    ctx.err(pc.red(`--out solo vale con un bundle; ${base} tiene ${dirs.length}.`));
    return { ok: false };
  }

  const built: BuiltBundle[] = [];
  let failed = false;
  for (const dir of dirs) {
    const outcome = await buildBundle(dir, { minify: opts.minify });
    if (!outcome.ok) {
      reportProblems(ctx, dir, outcome.problems);
      failed = true;
      continue;
    }
    const pushFile = await writePush(outcome.bundle, opts.out ? resolveUserPath(ctx, opts.out) : undefined);
    reportBundle(ctx, outcome.bundle, pushFile);
    built.push(outcome.bundle);
  }
  return failed ? { ok: false } : { ok: true, bundles: built };
}

// ---------------------------------------------------------------------------
// tools build
// ---------------------------------------------------------------------------

export async function runToolsBuild(opts: ToolsBuildOptions, ctx: Ctx): Promise<number> {
  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;

  heading(ctx, loaded.config);
  const base = toolsDir(ctx, loaded.path, opts.dir);
  const outcome = await buildAll(ctx, base, { minify: opts.minify, out: opts.out });
  if (!outcome.ok) return 1;
  const built = outcome.bundles;

  ctx.out("");
  ctx.out(
    pc.green(
      `${built.length} ${plural(built.length, "bundle listo", "bundles listos")} · ${formatBytes(built.reduce((n, b) => n + b.bytes, 0))}`,
    ),
  );
  ctx.out(pc.dim("Publíquelos con `sinapsis publish`."));
  return 0;
}

// ---------------------------------------------------------------------------
// tools list
// ---------------------------------------------------------------------------

export async function runToolsList(opts: ToolsListOptions, ctx: Ctx): Promise<number> {
  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;

  const repoDir = resolveRepo(ctx, opts.repo);
  const root = (await repoRoot(repoDir)) ?? repoDir;
  const base = path.join(root, SUBJECTS_DIR, loaded.config.slug, "tools");

  heading(ctx, loaded.config);
  ctx.out(`  plataforma: ${pc.dim(base)}`);

  const dirs = await findBundles(base);
  if (dirs === null || dirs.length === 0) {
    ctx.out(pc.yellow("  la materia no tiene ningún bundle publicado"));
    ctx.out(pc.dim("  Publíquelos con `sinapsis publish`."));
    return 0;
  }

  ctx.out(`  ${pc.bold(String(dirs.length))} ${plural(dirs.length, "bundle", "bundles")}`);
  for (const dir of dirs) {
    const manifest = await readManifest(dir);
    if (manifest === null) {
      ctx.out("");
      ctx.out(pc.yellow(`  ${path.basename(dir)}: el ${MANIFEST_FILE} publicado no cumple el contrato`));
      continue;
    }
    reportPublished(ctx, manifest, await treeBytes(dir), loaded.config.slug);
  }
  return 0;
}

/** Bytes de todos los archivos publicados del bundle. */
async function treeBytes(dir: string): Promise<number> {
  let total = 0;
  const visit = async (current: string): Promise<void> => {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(full);
      else if (entry.isFile()) total += (await stat(full)).size;
    }
  };
  try {
    await visit(dir);
  } catch {
    return total;
  }
  return total;
}

// ---------------------------------------------------------------------------
// Informes
// ---------------------------------------------------------------------------

function reportBundle(ctx: Ctx, bundle: BuiltBundle, pushFile: string): void {
  const m = bundle.manifest;
  const count = (role: string) => bundle.files.filter((f) => f.role === role).length;

  ctx.out("");
  ctx.out(`  ${pc.bold(m.title)} ${pc.dim(`· ${m.id} ${m.version}`)}`);
  ctx.out(`    carpeta: ${pc.dim(bundle.dir)}`);
  ctx.out(
    `    archivos: ${pc.bold(String(bundle.files.length))} (${formatBytes(bundle.bytes)})` +
      pc.dim(
        ` · ${count("script")} ${plural(count("script"), "script", "scripts")}` +
          ` · ${count("style")} ${plural(count("style"), "estilo", "estilos")}` +
          ` · ${count("data")} ${plural(count("data"), "dato", "datos")}` +
          (count("asset") > 0 ? ` · ${count("asset")} sin declarar` : ""),
      ),
  );
  ctx.out(
    `    vistas: ${m.views.length === 0 ? pc.dim("ninguna") : m.views.map((v) => `${v.label} (${v.id})`).join(", ")}`,
  );
  ctx.out(`    figuras: ${m.figures ? "sí" : pc.dim("no")}`);

  const minified = bundle.files.filter((f) => f.originalBytes !== undefined);
  if (minified.length > 0) {
    const before = minified.reduce((n, f) => n + (f.originalBytes ?? 0), 0);
    const after = minified.reduce((n, f) => n + f.bytes, 0);
    ctx.out(`    minificado: ${formatBytes(before)} → ${formatBytes(after)} (${minified.length} scripts)`);
  }
  if (count("asset") > 0) {
    const assets = bundle.files.filter((f) => f.role === "asset").map((f) => f.path);
    ctx.out(pc.dim(`    ${assets.length} archivo(s) sueltos que el manifiesto no declara (viajan igual): ${list(assets)}`));
  }
  if (bundle.ignored.length > 0) {
    ctx.out(
      pc.yellow(
        `    ${bundle.ignored.length} script/estilo que el manifiesto no declara (no se suben): ${list(bundle.ignored)}`,
      ),
    );
    ctx.out(pc.dim("      Si el bundle los necesita, agréguelos a `scripts` o `styles`."));
  }
  for (const [reason, paths] of groupByReason(bundle.skipped)) {
    ctx.out(pc.yellow(`    ${paths.length} archivo(s) que no se suben (${reason}): ${list(paths)}`));
  }
  ctx.out(`    push: ${pc.dim(pushFile)}`);
}

/** Los salteados, agrupados por motivo y en el orden en que aparecieron. */
function groupByReason(skipped: readonly SkippedPath[]): Array<[string, string[]]> {
  const groups = new Map<string, string[]>();
  for (const item of skipped) {
    const paths = groups.get(item.reason);
    if (paths) paths.push(item.path);
    else groups.set(item.reason, [item.path]);
  }
  return Array.from(groups.entries());
}

/** Lista corta para el resumen: hasta 6 rutas y el resto contado. */
function list(paths: readonly string[]): string {
  return paths.length <= 6 ? paths.join(", ") : `${paths.slice(0, 6).join(", ")} … (+${paths.length - 6})`;
}

function reportProblems(ctx: Ctx, dir: string, problems: readonly BuildProblem[]): void {
  ctx.err(pc.red(`El bundle de ${dir} no se puede publicar (${problems.length} problema(s)):`));
  for (const problem of problems) ctx.err(`  ${pc.bold(problem.where)}: ${problem.message}`);
}

/** Una ficha de bundle publicado: manifiesto, peso en disco y sus vistas. */
function reportPublished(ctx: Ctx, manifest: ToolManifestType, bytes: number, slug: string): void {
  ctx.out("");
  ctx.out(`  ${pc.bold(manifest.title)} ${pc.dim(`· ${manifest.id} ${manifest.version}`)}`);
  ctx.out(`    ${formatBytes(bytes)}`);
  for (const view of manifest.views) {
    ctx.out(`    ${view.label} ${pc.dim(routes.tool(slug, view.id))}`);
  }
  if (manifest.figures) ctx.out(pc.dim("    registra figuras para los callouts [!figura]"));
}
