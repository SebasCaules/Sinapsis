/**
 * Material de estudio de una materia y estado de estudio del usuario (Sprint 2).
 *
 * El material autoral (mazos, quizzes, plan y kits escritos en `wiki.study`)
 * llega en el sync y se guarda entero en `subject_study`; los mazos automáticos
 * NO se guardan: los calcula `autoDecks()` del contrato en cada lectura a
 * partir de las páginas vigentes (N0-27), así siguen a los resúmenes del wiki
 * sin depender de una re-sincronización.
 */
import { and, asc, desc, eq, sql } from "drizzle-orm";
import {
  autoDecks,
  type Note,
  type QuizAttempt,
  type SrsState,
  type StudyContent,
  type StudyState,
} from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import {
  bookmarks,
  notes,
  pages,
  quizAttempts,
  srsCards,
  subjectStudy,
  tasks,
  type SrsCardRow,
  type SubjectRow,
} from "../db/schema.js";
import { resolveConfig } from "./subjects.js";

/** Intentos de quiz que devuelve `GET .../study/state` (los más recientes). */
export const ATTEMPTS_LIMIT = 50;

/** `StudyContent` vacío: lo que ve una materia sin sync ni material propio. */
export const EMPTY_STUDY: StudyContent = { decks: [], quizzes: [], plan: null, kits: [] };

/** Páginas ordenadas como las lee el índice: `order` primero, después el título. */
async function studyPages(db: Db, subjectId: string) {
  return db
    .select({
      slug: pages.slug,
      title: pages.title,
      summary: pages.summary,
      type: pages.type,
      division: pages.division,
    })
    .from(pages)
    .where(eq(pages.subjectId, subjectId))
    .orderBy(sql`${pages.order} IS NULL`, asc(pages.order), asc(pages.title));
}

/**
 * Material que ve la web: el autoral tal como vino en el sync, más los mazos
 * automáticos por división al final de `decks` (marcados `source: "auto"`).
 */
export async function readStudyContent(db: Db, subject: SubjectRow): Promise<StudyContent> {
  const stored = (
    await db
      .select({ studyJson: subjectStudy.studyJson })
      .from(subjectStudy)
      .where(eq(subjectStudy.subjectId, subject.id))
      .limit(1)
  )[0];
  const authored = stored?.studyJson ?? EMPTY_STUDY;

  const list = await studyPages(db, subject.id);
  const auto = autoDecks(resolveConfig(subject), list);

  return {
    decks: [...authored.decks, ...auto],
    quizzes: authored.quizzes,
    plan: authored.plan,
    kits: authored.kits,
  };
}

/** Fila de `srs_cards` → `SrsState` del contrato. */
export function rowToSrsState(row: SrsCardRow): SrsState {
  return {
    cardId: row.cardId,
    ease: row.ease,
    interval: row.intervalDays,
    due: row.due,
    reps: row.reps,
    lapses: row.lapses,
    lastGrade: row.lastGrade ?? null,
    updatedAt: row.updatedAt,
  };
}

/** Estado de estudio del usuario en una materia. */
export async function readStudyState(
  db: Db,
  userId: string,
  subjectId: string,
): Promise<StudyState> {
  const srsRows = await db
    .select()
    .from(srsCards)
    .where(and(eq(srsCards.userId, userId), eq(srsCards.subjectId, subjectId)))
    .orderBy(asc(srsCards.due), asc(srsCards.cardId));

  const bookmarkRows = await db
    .select({ pageSlug: bookmarks.pageSlug })
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.subjectId, subjectId)))
    .orderBy(asc(bookmarks.createdAt), asc(bookmarks.pageSlug));

  const noteRows = await db
    .select({ pageSlug: notes.pageSlug, body: notes.body, updatedAt: notes.updatedAt })
    .from(notes)
    .where(and(eq(notes.userId, userId), eq(notes.subjectId, subjectId)))
    .orderBy(asc(notes.pageSlug));

  const taskRows = await db
    .select({ taskId: tasks.taskId })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.subjectId, subjectId)))
    .orderBy(asc(tasks.taskId));

  const attemptRows = await db
    .select({
      quizId: quizAttempts.quizId,
      score: quizAttempts.score,
      total: quizAttempts.total,
      at: quizAttempts.at,
    })
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.subjectId, subjectId)))
    .orderBy(desc(quizAttempts.at), desc(quizAttempts.id))
    .limit(ATTEMPTS_LIMIT);

  return {
    srs: srsRows.map(rowToSrsState),
    bookmarks: bookmarkRows.map((row) => row.pageSlug),
    notes: noteRows.map(
      (row): Note => ({ page: row.pageSlug, body: row.body, updatedAt: row.updatedAt }),
    ),
    tasksDone: taskRows.map((row) => row.taskId),
    attempts: attemptRows.map(
      (row): QuizAttempt => ({ quizId: row.quizId, score: row.score, total: row.total, at: row.at }),
    ),
  };
}
