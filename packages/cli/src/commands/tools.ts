/**
 * `sinapsis tools build | push | list` — los bundles de herramientas y figuras
 * de la materia (decisiones N0-41 y N0-42).
 *
 * La carpeta por defecto es `<carpeta del config>/tools`: si tiene manifiesto es
 * un único bundle, y si no, cada subcarpeta con `sinapsis.tools.json` es uno
 * (`tools/explorador/`, `tools/figuras/`…). `sync --tools` usa exactamente el
 * mismo camino después de sincronizar el wiki.
 */
import path from "node:path";
import pc from "picocolors";
import { plural, routes, type ToolInfo as ToolInfoType } from "@sinapsis/contract";
import { devLogin, getTools, putTool } from "../api.js";
import { resolveUserPath, type Ctx } from "../context.js";
import { heading, reportApiError, webUrl } from "../report.js";
import {
  MANIFEST_FILE,
  buildBundle,
  findBundles,
  formatBytes,
  writePush,
  type BuildProblem,
  type BuiltBundle,
  type SkippedPath,
} from "../tools/bundle.js";
import { DEFAULT_CONFIG, loadConfig } from "./validate.js";
import { resolveApi, resolveToken } from "./sync.js";

export interface ToolsBuildOptions {
  config?: string;
  dir?: string;
  minify?: boolean;
  /** Dónde escribir el `ToolPush` (solo con un bundle). */
  out?: string;
}

export interface ToolsPushOptions extends ToolsBuildOptions {
  api?: string;
  token?: string;
  web?: string;
}

export interface ToolsListOptions {
  config?: string;
  api?: string;
  token?: string;
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
   * `sync --tools` sobre una materia SIN carpeta `tools/` (o sin manifiestos)
   * avisa y sigue, porque lo que se le pidió es sincronizar el wiki. En
   * `tools build`/`tools push` la carpeta es el objeto del comando y su
   * ausencia es un error.
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
 *   un bundle no compila → error: no se sube ninguno, para que la materia no
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
  ctx.out(pc.dim("Súbalos con `sinapsis tools push` (o con `sinapsis sync --tools`)."));
  return 0;
}

// ---------------------------------------------------------------------------
// tools push
// ---------------------------------------------------------------------------

export async function runToolsPush(opts: ToolsPushOptions, ctx: Ctx): Promise<number> {
  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;

  heading(ctx, loaded.config);
  const base = toolsDir(ctx, loaded.path, opts.dir);
  const outcome = await buildAll(ctx, base, { minify: opts.minify, out: opts.out });
  if (!outcome.ok) return 1;
  const built = outcome.bundles;

  const api = resolveApi(ctx, opts.api);
  const token = resolveToken(ctx, opts.token);
  if (!token) {
    ctx.err(pc.red("Falta el token de sync."));
    ctx.err(pc.dim("Páselo con --token, o exporte SINAPSIS_TOKEN (o SYNC_TOKEN)."));
    return 1;
  }

  ctx.out("");
  const code = await pushAll(ctx, built, { api, token }, loaded.config.slug);
  if (code === 0) ctx.out(`  ${webUrl(ctx, opts.web, loaded.config.slug)}`);
  return code;
}

/** Sube los bundles ya construidos e informa el `ToolInfo` de cada uno. */
export async function pushAll(
  ctx: Ctx,
  bundles: readonly BuiltBundle[],
  opts: { api: string; token: string },
  slug: string,
): Promise<number> {
  for (const bundle of bundles) {
    try {
      const info = await putTool(opts, slug, bundle.manifest.id, bundle.push);
      ctx.out(
        pc.green(
          `push OK · ${bundle.manifest.id} ${bundle.manifest.version} — ${bundle.push.files.length} ${plural(bundle.push.files.length, "archivo", "archivos")}, ${formatBytes(bundle.bytes)}`,
        ),
      );
      if (info) {
        ctx.out(`    ${pc.dim(`bytes: ${info.bytes} · actualizado: ${info.updatedAt}`)}`);
        ctx.out(`    ${pc.dim(`base: ${info.base}`)}`);
        for (const view of info.manifest.views) {
          ctx.out(`    ${pc.dim(`${routes.tool(slug, view.id)} · ${view.label}`)}`);
        }
      } else {
        ctx.out(pc.dim("    el API no devolvió un ToolInfo (¿API anterior al Sprint 3?)"));
      }
    } catch (cause) {
      const badToken = { hints: ["Revise el token: tiene que coincidir con SYNC_TOKEN del .env del API."] };
      return reportApiError(ctx, opts.api, cause, {
        headline: (base, message) => `Falló el push de "${bundle.manifest.id}" contra ${base}: ${message}`,
        byStatus: {
          401: badToken,
          403: badToken,
          404: {
            headline: `${opts.api} no conoce la materia "${slug}" o no tiene la ruta de herramientas.`,
            hints: ["Corra `sinapsis sync` primero; la ruta de herramientas es del Sprint 3."],
          },
          413: { hints: ["El bundle supera el tope del API (20 MB)."] },
        },
      });
    }
  }
  return 0;
}

// ---------------------------------------------------------------------------
// tools list
// ---------------------------------------------------------------------------

export async function runToolsList(opts: ToolsListOptions, ctx: Ctx): Promise<number> {
  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;

  const api = resolveApi(ctx, opts.api);
  const token = resolveToken(ctx, opts.token);
  // Como `status`: la ruta de lectura pide sesión, así que se intenta primero el
  // bypass de desarrollo (decisión N0-5).
  const cookie = (await devLogin({ api, token })) ?? undefined;

  try {
    const tools = await getTools({ api, token, cookie }, loaded.config.slug);
    heading(ctx, loaded.config);
    ctx.out(`  API: ${pc.dim(api)}`);
    if (tools.length === 0) {
      ctx.out(pc.yellow("  la materia no tiene ningún bundle publicado"));
      ctx.out(pc.dim("  Súbalos con `sinapsis tools push`."));
      return 0;
    }
    ctx.out(`  ${pc.bold(String(tools.length))} ${plural(tools.length, "bundle", "bundles")}`);
    for (const info of tools) reportInfo(ctx, info, loaded.config.slug);
    return 0;
  } catch (cause) {
    const noSession = {
      headline: "`tools list` necesita una sesión y el API no la dio.",
      hints: ["Levante el API con AUTH_DEV_BYPASS=1, o inicie sesión en la web."],
    };
    return reportApiError(ctx, api, cause, {
      byStatus: {
        401: noSession,
        403: noSession,
        404: {
          headline: `${api} no conoce la materia "${loaded.config.slug}" o no tiene la ruta de herramientas.`,
          hints: ["Ejecute `sinapsis sync` para crear la materia."],
        },
      },
    });
  }
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

function reportInfo(ctx: Ctx, info: ToolInfoType, slug: string): void {
  ctx.out("");
  ctx.out(`  ${pc.bold(info.manifest.title)} ${pc.dim(`· ${info.manifest.id} ${info.manifest.version}`)}`);
  ctx.out(`    ${formatBytes(info.bytes)} · actualizado ${info.updatedAt}`);
  ctx.out(`    ${pc.dim(info.base)}`);
  for (const view of info.manifest.views) {
    ctx.out(`    ${view.label} ${pc.dim(routes.tool(slug, view.id))}`);
  }
  if (info.manifest.figures) ctx.out(pc.dim("    registra figuras para los callouts [!figura]"));
}
