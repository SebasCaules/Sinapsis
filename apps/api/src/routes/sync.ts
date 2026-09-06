import { Hono } from "hono";
import { SyncPayload } from "@sinapsis/contract";
import { secretEquals } from "../lib/compare.js";
import { unauthorized } from "../lib/errors.js";
import { jsonBody } from "../lib/validate.js";
import { syncSubject } from "../services/sync.js";
import type { AppBindings } from "../types.js";

/** Extrae el token de un header `Authorization: Bearer <token>`. */
function bearer(header: string | undefined): string | null {
  if (!header) return null;
  const match = header.trim().match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

export function syncRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  /** El CLI se autentica con SYNC_TOKEN, no con la sesión del navegador (N0-7). */
  app.use("/subjects/:slug/sync", async (c, next) => {
    const token = bearer(c.req.header("authorization"));
    if (!token || !secretEquals(token, c.var.env.SYNC_TOKEN)) {
      throw unauthorized("Token de sincronización inválido");
    }
    await next();
  });

  app.put(
    "/subjects/:slug/sync",
    jsonBody(SyncPayload, "Payload de sync inválido"),
    async (c) => {
      const payload = c.req.valid("json");
      const result = await syncSubject(c.var.db, c.req.param("slug") ?? "", payload);
      return c.json(result);
    },
  );

  return app;
}
