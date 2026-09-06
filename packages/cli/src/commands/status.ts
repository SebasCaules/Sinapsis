/** `sinapsis status` — estado de la materia en la plataforma. */
import pc from "picocolors";
import { ApiError, devLogin, getStudy, getSubject } from "../api.js";
import type { Ctx } from "../context.js";
import { countsByDivision, countsByType, heading, reportApiError, studyLine, webUrl } from "../report.js";
import { DEFAULT_CONFIG, loadConfig } from "./validate.js";
import { resolveApi, resolveToken } from "./sync.js";

export interface StatusOptions {
  config?: string;
  api?: string;
  token?: string;
  web?: string;
}

/**
 * Material de estudio publicado. Es una ruta del Sprint 2: contra un API viejo
 * responde 404 y `status` lo dice en vez de romper el informe entero.
 */
async function reportStudy(
  ctx: Ctx,
  opts: { api: string; token?: string | undefined; cookie?: string | undefined },
  slug: string,
): Promise<void> {
  try {
    studyLine(ctx, await getStudy(opts, slug));
  } catch (cause) {
    if (cause instanceof ApiError && cause.status === 404) {
      ctx.out(`  ${pc.bold("Estudio")}: ${pc.yellow("API sin soporte de estudio")} ${pc.dim("(GET /study → 404)")}`);
      return;
    }
    const detail = cause instanceof Error ? cause.message : String(cause);
    ctx.out(`  ${pc.bold("Estudio")}: ${pc.yellow(`no se pudo consultar (${detail})`)}`);
  }
}

export async function runStatus(opts: StatusOptions, ctx: Ctx): Promise<number> {
  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;

  const api = resolveApi(ctx, opts.api);
  const token = resolveToken(ctx, opts.token);

  // `GET /api/subjects/:slug` pide sesión. Simplificación aceptada del Sprint 1:
  // se intenta primero el bypass de desarrollo (`POST /api/auth/dev`, decisión N0-5).
  const cookie = (await devLogin({ api, token })) ?? undefined;

  try {
    const detail = await getSubject({ api, token, cookie }, loaded.config.slug);

    heading(ctx, detail.config);
    ctx.out(`  API: ${pc.dim(api)}`);
    if (detail.placeholder) {
      ctx.out(pc.yellow("  la materia todavía no recibió ningún sync (es un placeholder de la landing)"));
    }
    ctx.out(`  última sync: ${detail.lastSyncAt ? pc.bold(detail.lastSyncAt) : pc.yellow("nunca")}`);
    ctx.out(`  páginas: ${pc.bold(String(detail.pages.length))}`);
    ctx.out(`  estudiadas: ${detail.studied.length}`);
    ctx.out("");
    countsByType(ctx, detail.config, detail.pages);
    ctx.out("");
    countsByDivision(ctx, detail.config, detail.pages);
    ctx.out("");
    await reportStudy(ctx, { api, token, cookie }, detail.config.slug);
    ctx.out("");

    const local = loaded.config;
    if (JSON.stringify(local) !== JSON.stringify(detail.config)) {
      ctx.out(pc.yellow("  el config local difiere del que tiene la plataforma: corré `sinapsis sync`."));
    }
    ctx.out(`  ${webUrl(ctx, opts.web, detail.config.slug)}`);
    return 0;
  } catch (cause) {
    const noSession = {
      headline: "`status` necesita una sesión y el API no la dio.",
      hints: [
        "Levante el API con AUTH_DEV_BYPASS=1 (así `POST /api/auth/dev` abre sesión), o iniciá sesión en la web.",
      ],
    };
    return reportApiError(ctx, api, cause, {
      byStatus: {
        401: noSession,
        403: noSession,
        404: {
          headline: `La materia "${loaded.config.slug}" no existe en ${api}.`,
          hints: ["Ejecute `sinapsis sync` para crearla."],
        },
      },
    });
  }
}
