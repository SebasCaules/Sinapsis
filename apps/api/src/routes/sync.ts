import { Hono } from "hono";
import { SyncPayload } from "@sinapsis/contract";
import { requireSyncToken } from "../auth/sync-token.js";
import { jsonBody } from "../lib/validate.js";
import { syncSubject } from "../services/sync.js";
import type { AppBindings } from "../types.js";

export function syncRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  /** El CLI se autentica con SYNC_TOKEN, no con la sesión del navegador (N0-7). */
  app.use("/subjects/:slug/sync", requireSyncToken);

  /**
   * Reemplaza páginas y material de estudio de la materia. NO toca los bundles
   * de herramientas (`subject_tools`): tienen su propio ciclo de vida y un
   * `sinapsis sync` no puede dejar a la materia sin sus herramientas.
   */
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
