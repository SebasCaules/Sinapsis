/** `sinapsis status` — estado de la materia en la plataforma. */
import pc from "picocolors";
import { routes } from "@sinapsis/contract";
import { ApiError, devLogin, getSubject } from "../api.js";
import type { Ctx } from "../context.js";
import { countsByDivision, countsByType, heading } from "../report.js";
import { DEFAULT_CONFIG, loadConfig } from "./validate.js";
import { DEFAULT_WEB, resolveApi, resolveToken } from "./sync.js";

export interface StatusOptions {
  config?: string;
  api?: string;
  token?: string;
  web?: string;
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

    const local = loaded.config;
    if (JSON.stringify(local) !== JSON.stringify(detail.config)) {
      ctx.out(pc.yellow("  el config local difiere del que tiene la plataforma: corré `sinapsis sync`."));
    }
    const web = opts.web ?? ctx.env["SINAPSIS_WEB"] ?? DEFAULT_WEB;
    ctx.out(`  ${web.replace(/\/+$/, "")}${routes.subject(detail.config.slug)}`);
    return 0;
  } catch (cause) {
    if (cause instanceof ApiError) {
      if (cause.status === 401 || cause.status === 403) {
        ctx.err(pc.red("`status` necesita una sesión y el API no la dio."));
        ctx.err(
          pc.dim(
            "Levantá el API con AUTH_DEV_BYPASS=1 (así `POST /api/auth/dev` abre sesión), o iniciá sesión en la web.",
          ),
        );
        return 1;
      }
      if (cause.status === 404) {
        ctx.err(pc.red(`La materia "${loaded.config.slug}" no existe en ${api}.`));
        ctx.err(pc.dim("Corré `sinapsis sync` para crearla."));
        return 1;
      }
      ctx.err(pc.red(`No se pudo consultar ${api}: ${cause.message}`));
      if (cause.status === undefined) {
        ctx.err(pc.dim("¿Está corriendo el API? `pnpm dev:api` en el repo de Sinapsis."));
      }
      return 1;
    }
    ctx.err(pc.red(cause instanceof Error ? cause.message : String(cause)));
    return 1;
  }
}
