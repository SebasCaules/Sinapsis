import { Hono } from "hono";
import { requireSession } from "../auth/middleware.js";
import { notFound } from "../lib/errors.js";
import { searchPages } from "../services/search.js";
import { findSubjectBySlug, resolveConfig } from "../services/subjects.js";
import type { AppBindings } from "../types.js";

export function searchRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/subjects/:slug/search", requireSession);

  app.get("/subjects/:slug/search", async (c) => {
    const subject = await findSubjectBySlug(c.var.db, c.req.param("slug"));
    if (!subject) throw notFound("La materia no existe");
    const config = resolveConfig(subject);
    const secondaryTypes = new Set(
      config.pageTypes.filter((t) => t.countsAsContent === false).map((t) => t.key),
    );
    const q = c.req.query("q") ?? "";
    return c.json(await searchPages(c.var.db, subject.id, q, { secondaryTypes }));
  });

  return app;
}
