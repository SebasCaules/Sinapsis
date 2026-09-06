import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { requireSession } from "../auth/middleware.js";
import { pages, progress } from "../db/schema.js";
import { notFound } from "../lib/errors.js";
import { nowIso } from "../lib/ids.js";
import { loadSubject } from "../middleware/subject.js";
import type { AppBindings } from "../types.js";

export function progressRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/subjects/:slug/progress/:page", requireSession, loadSubject);

  app.put("/subjects/:slug/progress/:page", async (c) => {
    const db = c.var.db;
    const subject = c.var.subject;

    const pageSlug = c.req.param("page") ?? "";
    const exists = (
      await db
        .select({ id: pages.id })
        .from(pages)
        .where(and(eq(pages.subjectId, subject.id), eq(pages.slug, pageSlug)))
        .limit(1)
    )[0];
    if (!exists) throw notFound("La página no existe");

    await db
      .insert(progress)
      .values({ userId: c.var.user.id, subjectId: subject.id, pageSlug, studiedAt: nowIso() })
      .onConflictDoUpdate({
        target: [progress.userId, progress.subjectId, progress.pageSlug],
        set: { studiedAt: nowIso() },
      });

    return c.body(null, 204);
  });

  app.delete("/subjects/:slug/progress/:page", async (c) => {
    const db = c.var.db;
    const subject = c.var.subject;

    await db
      .delete(progress)
      .where(
        and(
          eq(progress.userId, c.var.user.id),
          eq(progress.subjectId, subject.id),
          eq(progress.pageSlug, c.req.param("page") ?? ""),
        ),
      );

    return c.body(null, 204);
  });

  return app;
}
