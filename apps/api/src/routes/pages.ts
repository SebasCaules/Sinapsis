import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import type { PageDetail, PageLink } from "@sinapsis/contract";
import { requireSession } from "../auth/middleware.js";
import { pages, progress } from "../db/schema.js";
import { notFound } from "../lib/errors.js";
import { findSubjectBySlug, pageMetaColumns, rowToPage, rowToPageMeta } from "../services/subjects.js";
import type { AppBindings } from "../types.js";

export function pageRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/subjects/:slug/pages/:page", requireSession);

  app.get("/subjects/:slug/pages/:page", async (c) => {
    const db = c.var.db;
    const subject = await findSubjectBySlug(db, c.req.param("slug"));
    if (!subject) throw notFound("La materia no existe");

    const pageSlug = c.req.param("page");
    const row = (
      await db
        .select()
        .from(pages)
        .where(and(eq(pages.subjectId, subject.id), eq(pages.slug, pageSlug)))
        .limit(1)
    )[0];
    if (!row) throw notFound("La página no existe");

    // Backlinks: las páginas de la materia cuyos wikilinks apuntan a esta.
    const candidates = await db
      .select({ ...pageMetaColumns, linksJson: pages.linksJson })
      .from(pages)
      .where(eq(pages.subjectId, subject.id));

    const backlinks = candidates
      .filter((candidate) => {
        if (candidate.slug === pageSlug) return false;
        const links: PageLink[] = candidate.linksJson ?? [];
        return links.some((link) => link.slug === pageSlug);
      })
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
