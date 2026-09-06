/**
 * `createApp(deps)` arma la aplicación Hono a partir de sus dependencias
 * (base, entorno, verificador de Google). Los tests la usan in-process con
 * `app.request(...)`; `index.ts` la sirve sobre un puerto.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { API_PREFIX } from "@sinapsis/contract";
import { createGoogleVerifier } from "./auth/google.js";
import { csrfGuard } from "./middleware/csrf.js";
import { authRoutes } from "./routes/auth.js";
import { configRoutes } from "./routes/config.js";
import { landingRoutes } from "./routes/landing.js";
import { meRoutes } from "./routes/me.js";
import { pageRoutes } from "./routes/pages.js";
import { progressRoutes } from "./routes/progress.js";
import { searchRoutes } from "./routes/search.js";
import { subjectRoutes } from "./routes/subjects.js";
import { syncRoutes } from "./routes/sync.js";
import type { AppBindings, AppDeps } from "./types.js";

/** Tope de cuerpo aceptado (el sync de un wiki grande ronda unos pocos MB). */
export const MAX_BODY_BYTES = 50 * 1024 * 1024;

export function createApp(deps: AppDeps): Hono<AppBindings> {
  const { db, env } = deps;
  const app = new Hono<AppBindings>();

  const shouldLog = deps.log ?? env.NODE_ENV !== "test";
  if (shouldLog) app.use("*", logger());

  app.use("*", async (c, next) => {
    c.set("db", db);
    c.set("env", env);
    await next();
  });

  app.use(
    `${API_PREFIX}/*`,
    bodyLimit({
      maxSize: MAX_BODY_BYTES,
      onError: (c) => c.json({ error: "El cuerpo del pedido supera los 50 MB" }, 413),
    }),
  );
  app.use(`${API_PREFIX}/*`, csrfGuard);

  const googleVerifier =
    deps.googleVerifier ?? (env.GOOGLE_CLIENT_ID ? createGoogleVerifier(env.GOOGLE_CLIENT_ID) : undefined);
  const withVerifier: AppDeps = { ...deps, ...(googleVerifier ? { googleVerifier } : {}) };

  app.route(API_PREFIX, configRoutes());
  app.route(API_PREFIX, authRoutes(withVerifier));
  app.route(API_PREFIX, meRoutes());
  app.route(API_PREFIX, landingRoutes());
  app.route(API_PREFIX, syncRoutes());
  app.route(API_PREFIX, pageRoutes());
  app.route(API_PREFIX, searchRoutes());
  app.route(API_PREFIX, progressRoutes());
  app.route(API_PREFIX, subjectRoutes());

  mountWebDist(app, env.WEB_DIST);

  app.notFound((c) => c.json({ error: "Ruta no encontrada" }, 404));

  app.onError((error, c) => {
    if (error instanceof HTTPException) {
      const res = error.getResponse();
      // Las HTTPException que arma `lib/errors.ts` ya traen `{ error }`.
      if (res.headers.get("content-type")?.includes("application/json")) return res;
      return c.json({ error: error.message || "Pedido inválido" }, error.status);
    }
    if (shouldLog) console.error(error);
    return c.json({ error: "Error interno del servidor" }, 500);
  });

  return app;
}

/**
 * Fallback estático: si WEB_DIST existe, sirve sus archivos y devuelve
 * `index.html` para cualquier ruta que no empiece por `/api` (SPA con rutas de
 * navegador, N0-9).
 */
function mountWebDist(app: Hono<AppBindings>, webDist: string | null): void {
  if (!webDist) return;
  const absolute = resolve(process.cwd(), webDist);
  if (!existsSync(absolute)) return;

  const indexPath = join(absolute, "index.html");
  // serveStatic resuelve `root` contra el cwd del proceso.
  const root = relative(process.cwd(), absolute) || ".";

  app.use("/*", serveStatic({ root }));

  app.get("/*", (c) => {
    if (c.req.path.startsWith(`${API_PREFIX}/`) || c.req.path === API_PREFIX) {
      return c.json({ error: "Ruta no encontrada" }, 404);
    }
    if (!existsSync(indexPath)) return c.json({ error: "La SPA no está compilada" }, 404);
    return c.html(readFileSync(indexPath, "utf8"));
  });
}
