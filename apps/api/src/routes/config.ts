import { Hono } from "hono";
import { devBypassEnabled } from "../env.js";
import type { AppBindings } from "../types.js";

/** Salud y configuración pública que necesita el cliente antes de autenticarse. */
export function configRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.get("/health", (c) => c.json({ ok: true }));

  app.get("/config", (c) => {
    const env = c.var.env;
    return c.json({
      googleClientId: env.GOOGLE_CLIENT_ID,
      devBypass: devBypassEnabled(env),
    });
  });

  return app;
}
