import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import type { PageDetail } from "@sinapsis/contract";
import { requireSession } from "../auth/middleware.js";
import { pageLinks, pages, progress } from "../db/schema.js";
import { notFound } from "../lib/errors.js";
import { loadSubject } from "../middleware/subject.js";
import { pageMetaColumns, rowToPage, rowToPageMeta } from "../services/subjects.js";
import type { AppBindings } from "../types.js";

export function pageRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/subjects/:slug/pages/:page", requireSession, loadSubject);

  app.get("/subjects/:slug/pages/:page", async (c) => {
    const db = c.var.db;
    const subject = c.var.subject;

    const pageSlug = c.req.param("page") ?? "";
    const row = (
      await db
        .select()
        .from(pages)
        .where(and(eq(pages.subjectId, subject.id), eq(pages.slug, pageSlug)))
        .limit(1)
    )[0];
    if (!row) throw notFound("La página no existe");

    // Backlinks: `page_links` ya tiene los wikilinks resueltos de la materia
    // (solo los que apuntan a una página que existe, S-07), así que alcanza con
    // un índice — antes había que prefiltrar con LIKE y confirmar sobre el JSON.
    const backlinkRows = await db
      .select(pageMetaColumns)
      .from(pageLinks)
      .innerJoin(
        pages,
        and(eq(pages.subjectId, pageLinks.subjectId), eq(pages.slug, pageLinks.fromSlug)),
      )
      .where(and(eq(pageLinks.subjectId, subject.id), eq(pageLinks.toSlug, pageSlug)));

    const backlinks = backlinkRows
      .map(rowToPageMeta)
      .sort((a, b) => a.title.localeCompare(b.title, "es"));

    const studied = (
      await db
        .select({ pageSlug: progress.pageSlug })
        .from(progress)
        .where(
          and(
            eq(progress.userId, c.var.user.id),
            eq(progress.subjectId, subject.id),
            eq(progress.pageSlug, pageSlug),
          ),
        )
        .limit(1)
    ).length > 0;

    const detail: PageDetail = { page: rowToPage(row), backlinks, studied };
    return c.json(detail);
  });

  return app;
}
