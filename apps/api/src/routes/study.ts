/**
 * Estudio (Sprint 2): material de la materia y estado del usuario.
 *
 * Todas las rutas exigen sesión y resuelven la materia con `loadSubject` (404
 * «La materia no existe»). El estado es por usuario y materia; nada de lo que
 * se guarda acá depende de que la tarjeta, la tarea o el quiz existan en el
 * material: los mazos automáticos se calculan al vuelo y el material autoral
 * vive dentro de un JSON. Lo único que se valida contra la base son los slugs
 * de página (favoritos y apuntes), que sí son filas de `pages`. Al leer, en
 * cambio, el SRS se recorta al material vigente: una tarjeta que ya no existe
 * conserva su fila pero no vuelve en el estado (bug 7).
 *
 * Los cuerpos JSON se validan con los esquemas del contrato (`SrsGradeInput`,
 * `NoteInput`, `QuizAttemptInput`), que son los mismos que tipa la web: si el
 * límite del apunte o la regla `score <= total` cambian, cambian en un solo
 * lugar. Los ids de la URL, en cambio, se validan acá con `StudyId`.
 */
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import {
  NoteInput,
  QuizAttemptInput,
  SRS_DEFAULT,
  SrsGradeInput,
  StudyId,
  sm2,
  type Note,
  type QuizAttempt,
  type SrsState,
} from "@sinapsis/contract";
import { requireSession } from "../auth/middleware.js";
import { bookmarks, notes, pages, quizAttempts, srsCards, tasks } from "../db/schema.js";
import { badRequest, notFound } from "../lib/errors.js";
import { newId, nowIso } from "../lib/ids.js";
import { jsonBody } from "../lib/validate.js";
import { loadSubject } from "../middleware/subject.js";
import type { Db } from "../db/client.js";
import { readStudyContent, readStudyState, rowToSrsState, studyCardIds } from "../services/study.js";
import type { AppBindings } from "../types.js";

/** Id de tarjeta / tarea / quiz de la URL, con el formato del contrato. */
function studyId(raw: string | undefined, what: string): string {
  const parsed = StudyId.safeParse(raw ?? "");
  if (!parsed.success) throw badRequest(`El id ${what} no tiene un formato válido`);
  return parsed.data;
}

/** Exige que la página exista en la materia (favoritos y apuntes son por página). */
async function requirePage(db: Db, subjectId: string, slug: string): Promise<void> {
  const row = (
    await db
      .select({ id: pages.id })
      .from(pages)
      .where(and(eq(pages.subjectId, subjectId), eq(pages.slug, slug)))
      .limit(1)
  )[0];
  if (!row) throw notFound("La página no existe");
}

export function studyRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/subjects/:slug/study", requireSession, loadSubject);
  app.use("/subjects/:slug/study/*", requireSession, loadSubject);
  app.use("/subjects/:slug/bookmarks/:page", requireSession, loadSubject);
  app.use("/subjects/:slug/notes/:page", requireSession, loadSubject);
  app.use("/subjects/:slug/tasks/:taskId", requireSession, loadSubject);
  app.use("/subjects/:slug/quiz/:quizId/attempts", requireSession, loadSubject);

  // -------------------------------------------------------------------------
  // Material y estado
  // -------------------------------------------------------------------------

  app.get("/subjects/:slug/study", async (c) =>
    c.json(await readStudyContent(c.var.db, c.var.subject)),
  );

  /**
   * El estado devuelve solo el SRS de tarjetas que existen hoy (bug 7): el
   * material vigente se calcula igual que en `GET .../study` —una fila de
   * `subject_study` más las páginas de la materia— y las filas de tarjetas
   * borradas quedan guardadas, pero no viajan.
   */
  app.get("/subjects/:slug/study/state", async (c) => {
    const content = await readStudyContent(c.var.db, c.var.subject);
    return c.json(
      await readStudyState(c.var.db, c.var.user.id, c.var.subject.id, studyCardIds(content)),
    );
  });

  // -------------------------------------------------------------------------
  // SRS (SM-2, N0-28)
  // -------------------------------------------------------------------------

  app.post(
    "/subjects/:slug/study/srs/:cardId",
    jsonBody(SrsGradeInput, "Nota inválida"),
    async (c) => {
      const db = c.var.db;
      const userId = c.var.user.id;
      const subjectId = c.var.subject.id;
      const cardId = studyId(c.req.param("cardId"), "de la tarjeta");
      const { grade } = c.req.valid("json");

      const previous = (
        await db
          .select()
          .from(srsCards)
          .where(
            and(
              eq(srsCards.userId, userId),
              eq(srsCards.subjectId, subjectId),
              eq(srsCards.cardId, cardId),
            ),
          )
          .limit(1)
      )[0];

      const next = sm2(previous ? rowToSrsState(previous) : SRS_DEFAULT, grade, nowIso());
      const values = {
        userId,
        subjectId,
        cardId,
        ease: next.ease,
        intervalDays: next.interval,
        due: next.due,
        reps: next.reps,
        lapses: next.lapses,
        lastGrade: next.lastGrade,
        updatedAt: next.updatedAt,
      };

      await db
        .insert(srsCards)
        .values(values)
        .onConflictDoUpdate({
          target: [srsCards.userId, srsCards.subjectId, srsCards.cardId],
          set: {
            ease: values.ease,
            intervalDays: values.intervalDays,
            due: values.due,
            reps: values.reps,
            lapses: values.lapses,
            lastGrade: values.lastGrade,
            updatedAt: values.updatedAt,
          },
        });

      return c.json({ cardId, ...next } satisfies SrsState);
    },
  );

  app.delete("/subjects/:slug/study/srs/:cardId", async (c) => {
    const cardId = studyId(c.req.param("cardId"), "de la tarjeta");
    await c.var.db
      .delete(srsCards)
      .where(
        and(
          eq(srsCards.userId, c.var.user.id),
          eq(srsCards.subjectId, c.var.subject.id),
          eq(srsCards.cardId, cardId),
        ),
      );
    return c.body(null, 204);
  });

  // -------------------------------------------------------------------------
  // Favoritos
  // -------------------------------------------------------------------------

  app.put("/subjects/:slug/bookmarks/:page", async (c) => {
    const db = c.var.db;
    const subjectId = c.var.subject.id;
    const pageSlug = c.req.param("page") ?? "";
    await requirePage(db, subjectId, pageSlug);

    await db
      .insert(bookmarks)
      .values({ userId: c.var.user.id, subjectId, pageSlug, createdAt: nowIso() })
      .onConflictDoNothing({
        target: [bookmarks.userId, bookmarks.subjectId, bookmarks.pageSlug],
      });

    return c.body(null, 204);
  });

  app.delete("/subjects/:slug/bookmarks/:page", async (c) => {
    await c.var.db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, c.var.user.id),
          eq(bookmarks.subjectId, c.var.subject.id),
          eq(bookmarks.pageSlug, c.req.param("page") ?? ""),
        ),
      );
    return c.body(null, 204);
  });

  // -------------------------------------------------------------------------
  // Apuntes
  // -------------------------------------------------------------------------

  app.put(
    "/subjects/:slug/notes/:page",
    jsonBody(NoteInput, "Apunte inválido"),
    async (c) => {
      const db = c.var.db;
      const subjectId = c.var.subject.id;
      const pageSlug = c.req.param("page") ?? "";
      await requirePage(db, subjectId, pageSlug);

      const body = c.req.valid("json").body;
      const updatedAt = nowIso();

      await db
        .insert(notes)
        .values({ userId: c.var.user.id, subjectId, pageSlug, body, updatedAt })
        .onConflictDoUpdate({
          target: [notes.userId, notes.subjectId, notes.pageSlug],
          set: { body, updatedAt },
        });

      return c.json({ page: pageSlug, body, updatedAt } satisfies Note);
    },
  );

  app.delete("/subjects/:slug/notes/:page", async (c) => {
    await c.var.db
      .delete(notes)
      .where(
        and(
          eq(notes.userId, c.var.user.id),
          eq(notes.subjectId, c.var.subject.id),
          eq(notes.pageSlug, c.req.param("page") ?? ""),
        ),
      );
    return c.body(null, 204);
  });

  // -------------------------------------------------------------------------
  // Tareas del plan
  // -------------------------------------------------------------------------

  app.put("/subjects/:slug/tasks/:taskId", async (c) => {
    const taskId = studyId(c.req.param("taskId"), "de la tarea");
    await c.var.db
      .insert(tasks)
      .values({
        userId: c.var.user.id,
        subjectId: c.var.subject.id,
        taskId,
        doneAt: nowIso(),
      })
      .onConflictDoNothing({ target: [tasks.userId, tasks.subjectId, tasks.taskId] });
    return c.body(null, 204);
  });

  app.delete("/subjects/:slug/tasks/:taskId", async (c) => {
    const taskId = studyId(c.req.param("taskId"), "de la tarea");
    await c.var.db
      .delete(tasks)
      .where(
        and(
          eq(tasks.userId, c.var.user.id),
          eq(tasks.subjectId, c.var.subject.id),
          eq(tasks.taskId, taskId),
        ),
      );
    return c.body(null, 204);
  });

  // -------------------------------------------------------------------------
  // Intentos de quiz
  // -------------------------------------------------------------------------

  app.post(
    "/subjects/:slug/quiz/:quizId/attempts",
    jsonBody(QuizAttemptInput, "Intento inválido"),
    async (c) => {
      const quizId = studyId(c.req.param("quizId"), "del quiz");
      const { score, total } = c.req.valid("json");
      const at = nowIso();

      await c.var.db.insert(quizAttempts).values({
        id: newId(),
        userId: c.var.user.id,
        subjectId: c.var.subject.id,
        quizId,
        score,
        total,
        at,
      });

      return c.json({ quizId, score, total, at } satisfies QuizAttempt, 201);
    },
  );

  return app;
}
