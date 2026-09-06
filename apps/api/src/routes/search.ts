import { Hono } from "hono";
import { requireSession } from "../auth/middleware.js";
import { loadSubject } from "../middleware/subject.js";
import { searchPages } from "../services/search.js";
import { contentTypePredicate, resolveConfig } from "../services/subjects.js";
import type { AppBindings } from "../types.js";

export function searchRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/subjects/:slug/search", requireSession, loadSubject);

  app.get("/subjects/:slug/search", async (c) => {
    const subject = c.var.subject;
    // Las fuentes pesan menos en el ranking: misma regla que el progreso.
    const isContent = contentTypePredicate(resolveConfig(subject));
    const q = c.req.query("q") ?? "";
    return c.json(
      await searchPages(c.var.db, subject.id, q, { isSecondary: (type) => !isContent(type) }),
    );
  });

  return app;
}
