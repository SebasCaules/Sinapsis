/** `sinapsis sync` — compila el wiki y lo sincroniza contra el API. */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { routes } from "@sinapsis/contract";
import { compileWiki } from "@sinapsis/markdown";
import { ApiError, putSync } from "../api.js";
import { resolveUserPath, type Ctx } from "../context.js";
import { countsByDivision, countsByType, heading, warnings as printWarnings } from "../report.js";
import { GENERATOR } from "../version.js";
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
}

export const DEFAULT_API = "http://localhost:3000";
export const DEFAULT_WEB = "http://localhost:5173";

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
  printWarnings(ctx, warnings);
  ctx.out("");

  if (opts.out) {
    const outFile = resolveUserPath(ctx, opts.out);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    ctx.out(pc.dim(`payload escrito en ${outFile}`));
  }

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
    const web = opts.web ?? ctx.env["SINAPSIS_WEB"] ?? DEFAULT_WEB;
    ctx.out(`  ${web.replace(/\/+$/, "")}${routes.subject(loaded.config.slug)}`);
    return 0;
  } catch (cause) {
    if (cause instanceof ApiError) {
      ctx.err(pc.red(`Falló el sync contra ${api}: ${cause.message}`));
      if (cause.status === 401 || cause.status === 403) {
        ctx.err(pc.dim("Revisá el token: tiene que coincidir con SYNC_TOKEN del .env del API."));
      }
      if (cause.status === undefined) {
        ctx.err(pc.dim("¿Está corriendo el API? `pnpm dev:api` en el repo de Sinapsis."));
      }
      return 1;
    }
    ctx.err(pc.red(cause instanceof Error ? cause.message : String(cause)));
    return 1;
  }
}
