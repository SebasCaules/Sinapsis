import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { CreateSubjectInput, type SubjectDetail } from "@sinapsis/contract";
import { requireSession } from "../auth/middleware.js";
import { withTransaction } from "../db/client.js";
import { pages, progress, subjects, userSubjects } from "../db/schema.js";
import { conflict, notFound } from "../lib/errors.js";
import { newId, nowIso } from "../lib/ids.js";
import { zodMessage } from "../lib/validate.js";
import { landingCard, nextPosition } from "../services/landing.js";
import { findSubjectBySlug, pageMetaColumns, resolveConfig, rowToPageMeta } from "../services/subjects.js";
import type { AppBindings } from "../types.js";

export function subjectRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/subjects", requireSession);
  app.use("/subjects/:slug", requireSession);
  app.use("/subjects/:slug/landing", requireSession);

  /**
   * Agregar materia desde la landing. Si el slug no existe se crea una materia
   * placeholder (sin config, a la espera del primer sync); si ya existe solo se
   * suma a la landing de este usuario (N0-6: las materias son globales).
   */
  app.post(
    "/subjects",
    zValidator("json", CreateSubjectInput, (result, c) => {
      if (!result.success) {
        return c.json({ error: `Materia inválida — ${zodMessage(result.error)}` }, 400);
      }
      return undefined;
    }),
    async (c) => {
      const db = c.var.db;
      const userId = c.var.user.id;
      const input = c.req.valid("json");

      const slug = await withTransaction(db, async () => {
        const existing = await findSubjectBySlug(db, input.slug);
        const now = nowIso();

        let subjectId: string;
        if (existing) {
          subjectId = existing.id;
          const already = (
            await db
              .select({ userId: userSubjects.userId })
              .from(userSubjects)
              .where(and(eq(userSubjects.userId, userId), eq(userSubjects.subjectId, subjectId)))
              .limit(1)
          )[0];
          if (already) throw conflict(`La materia "${input.slug}" ya está en tu landing`);
        } else {
          subjectId = newId();
          await db.insert(subjects).values({
            id: subjectId,
            slug: input.slug,
            name: input.name,
            code: input.code,
            institution: input.institution,
            color: input.color ?? null,
            semesterHint: input.semester,
            divisionJson: input.division,
            configJson: null,
            placeholder: true,
            lastSyncAt: null,
            createdAt: now,
            updatedAt: now,
          });
        }

        const position = await nextPosition(db, userId, input.semester);
        await db.insert(userSubjects).values({
          userId,
          subjectId,
          semester: input.semester,
          position,
          addedAt: now,
        });
        return input.slug;
      });

      const card = await landingCard(db, userId, slug);
      if (!card) throw notFound("No se pudo leer la materia recién agregada");
      return c.json(card, 201);
    },
  );

  /** Quitar de la landing: no borra la materia (es global) ni el progreso. */
  app.delete("/subjects/:slug/landing", async (c) => {
    const db = c.var.db;
    const subject = await findSubjectBySlug(db, c.req.param("slug"));
    if (!subject) throw notFound("La materia no existe");
    await db
      .delete(userSubjects)
      .where(and(eq(userSubjects.userId, c.var.user.id), eq(userSubjects.subjectId, subject.id)));
    return c.body(null, 204);
  });

  /**
   * Detalle para el shell de la materia. Cualquier usuario autenticado puede
   * abrir una materia sincronizada aunque no esté en su landing (N0-6).
   */
  app.get("/subjects/:slug", async (c) => {
    const db = c.var.db;
    const subject = await findSubjectBySlug(db, c.req.param("slug"));
    if (!subject) throw notFound("La materia no existe");

    const metas = await db
      .select(pageMetaColumns)
      .from(pages)
      .where(eq(pages.subjectId, subject.id));

    const studiedRows = await db
      .select({ pageSlug: progress.pageSlug })
      .from(progress)
      .innerJoin(pages, and(eq(pages.subjectId, progress.subjectId), eq(pages.slug, progress.pageSlug)))
      .where(and(eq(progress.userId, c.var.user.id), eq(progress.subjectId, subject.id)))
      // Más vieja primero: «Repaso de hoy» toma las tres primeras.
      .orderBy(progress.studiedAt);

    const detail: SubjectDetail = {
      config: resolveConfig(subject),
      pages: metas.map(rowToPageMeta),
      studied: studiedRows.map((r) => r.pageSlug),
      placeholder: subject.placeholder,
      lastSyncAt: subject.lastSyncAt,
    };
    return c.json(detail);
  });

  return app;
}
