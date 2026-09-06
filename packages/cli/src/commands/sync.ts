/** `sinapsis sync` — compila el wiki y lo sincroniza contra el API. */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { compileWiki } from "@sinapsis/markdown";
import { putSync } from "../api.js";
import { resolveUserPath, type Ctx } from "../context.js";
import {
  countsByDivision,
  countsByType,
  heading,
  reportApiError,
  studyLine,
  warnings as printWarnings,
  webUrl,
} from "../report.js";
import { GENERATOR } from "../version.js";
import { buildAll, pushAll, toolsDir } from "./tools.js";
import { DEFAULT_CONFIG, loadConfig } from "./validate.js";

export interface SyncOptions {
  config?: string;
  /** Sobreescribe `wiki.root` del config (útil cuando el config vive fuera del vault). */
  wiki?: string;
  api?: string;
  token?: string;
  dryRun?: boolean;
  out?: string;
  web?: string;
  /** Construye y sube también los bundles de `<carpeta del config>/tools`. */
  tools?: boolean;
  minify?: boolean;
}

export const DEFAULT_API = "http://localhost:3000";

export function resolveApi(ctx: Ctx, flag?: string): string {
  return flag ?? ctx.env["SINAPSIS_API"] ?? DEFAULT_API;
}

export function resolveToken(ctx: Ctx, flag?: string): string | undefined {
  return flag ?? ctx.env["SINAPSIS_TOKEN"] ?? ctx.env["SYNC_TOKEN"];
}

export async function runSync(opts: SyncOptions, ctx: Ctx): Promise<number> {
  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;

  const wikiRoot = opts.wiki ? resolveUserPath(ctx, opts.wiki) : undefined;

  let compiled;
  try {
    compiled = await compileWiki({
      config: loaded.config,
      rootDir: path.dirname(loaded.path),
      ...(wikiRoot ? { wikiRoot } : {}),
      generator: GENERATOR,
    });
  } catch (cause) {
    ctx.err(pc.red("No se pudo compilar el wiki:"));
    ctx.err(`  ${cause instanceof Error ? cause.message : String(cause)}`);
    return 1;
  }

  const { payload, warnings } = compiled;

  heading(ctx, loaded.config);
  ctx.out(`  wiki: ${pc.dim(compiled.wikiRoot)}`);
  ctx.out(`  páginas: ${pc.bold(String(payload.pages.length))}`);
  ctx.out("");
  countsByType(ctx, loaded.config, payload.pages);
  ctx.out("");
  countsByDivision(ctx, loaded.config, payload.pages);
  ctx.out("");
  studyLine(ctx, compiled.study);
  ctx.out(`  ${pc.dim(compiled.studyDir)}`);
  ctx.out("");
  printWarnings(ctx, warnings);
  ctx.out("");

  if (opts.out) {
    const outFile = resolveUserPath(ctx, opts.out);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    ctx.out(pc.dim(`payload escrito en ${outFile}`));
  }

  // Herramientas: se construyen antes de tocar el API para que un bundle roto
  // detenga el sync entero en vez de dejar la materia a medio publicar.
  const bundles = opts.tools
    ? await buildAll(ctx, toolsDir(ctx, loaded.path, undefined), { minify: opts.minify })
    : [];
  if (bundles === null) return 1;
  if (opts.tools) ctx.out("");

  if (opts.dryRun) {
    ctx.out(pc.dim("--dry-run: no se llamó al API."));
    return 0;
  }

  const api = resolveApi(ctx, opts.api);
  const token = resolveToken(ctx, opts.token);
  if (!token) {
    ctx.err(pc.red("Falta el token de sync."));
    ctx.err(pc.dim("Pasalo con --token, o exportá SINAPSIS_TOKEN (o SYNC_TOKEN)."));
    return 1;
  }

  try {
    const result = await putSync({ api, token }, loaded.config.slug, payload);
    ctx.out(
      pc.green(
        `sync OK · ${result.subject}: ${result.pages} página(s) — ${result.created} creada(s), ${result.updated} actualizada(s), ${result.deleted} borrada(s)`,
      ),
    );
    if (result.warnings.length > 0) {
      ctx.out(pc.bold(pc.yellow(`  el API devolvió ${result.warnings.length} advertencia(s):`)));
      for (const line of result.warnings) ctx.out(pc.yellow(`    ${line}`));
    }

    if (bundles.length > 0) {
      ctx.out("");
      const code = await pushAll(ctx, bundles, { api, token }, loaded.config.slug);
      if (code !== 0) return code;
    }

    ctx.out(`  ${webUrl(ctx, opts.web, loaded.config.slug)}`);
    return 0;
  } catch (cause) {
    const badToken = { hints: ["Revise el token: tiene que coincidir con SYNC_TOKEN del .env del API."] };
    return reportApiError(ctx, api, cause, {
      headline: (base, message) => `Falló el sync contra ${base}: ${message}`,
      byStatus: { 401: badToken, 403: badToken },
    });
  }
}
