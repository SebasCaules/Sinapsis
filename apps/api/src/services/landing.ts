/**
 * La landing del usuario: sus materias con los agregados que muestra la
 * tarjeta (divisiones, páginas de contenido, progreso).
 *
 * `subjects` es global y `user_subjects` guarda cuatrimestre y posición por
 * usuario (N0-6).
 */
import { and, eq, inArray, sql } from "drizzle-orm";
import type { SubjectCard } from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import { pages, progress, subjects, userSubjects, type SubjectRow } from "../db/schema.js";
import { contentTypePredicate, resolveConfig } from "./subjects.js";

/** Color de reserva cuando la materia no declara ninguno. */
export const DEFAULT_SUBJECT_COLOR = "--u1";

/** Cuatrimestre descendente ("2026-2C" antes que "2026-1C"), posición ascendente. */
export function compareCards(a: SubjectCard, b: SubjectCard): number {
  const bySemester = b.semester.localeCompare(a.semester, "es", {
    numeric: true,
    sensitivity: "base",
  });
  if (bySemester !== 0) return bySemester;
  if (a.position !== b.position) return a.position - b.position;
  return a.name.localeCompare(b.name, "es");
}

/** Conteos por tipo de página, agrupados por materia. */
type CountsBySubject = Map<string, Map<string, number>>;

function sumCounting(
  counts: Map<string, number> | undefined,
  isContent: (type: string) => boolean,
): number {
  if (!counts) return 0;
  let total = 0;
  for (const [type, n] of counts) if (isContent(type)) total += n;
  return total;
}

function buildCard(
  row: SubjectRow,
  semester: string,
  position: number,
  pageCounts: CountsBySubject,
  studiedCounts: CountsBySubject,
): SubjectCard {
  const config = resolveConfig(row);
  const isContent = contentTypePredicate(config);
  return {
    slug: row.slug,
    name: row.name,
    code: row.code,
    institution: row.institution,
    color: row.color ?? DEFAULT_SUBJECT_COLOR,
    division: row.divisionJson,
    divisionsCount: config.divisions.length,
    pagesCount: sumCounting(pageCounts.get(row.id), isContent),
    studiedCount: sumCounting(studiedCounts.get(row.id), isContent),
    semester,
    position,
    placeholder: row.placeholder,
    lastSyncAt: row.lastSyncAt,
  };
}

function groupCounts(rows: { subjectId: string; type: string; n: number }[]): CountsBySubject {
  const out: CountsBySubject = new Map();
  for (const row of rows) {
    let bucket = out.get(row.subjectId);
    if (!bucket) {
      bucket = new Map();
      out.set(row.subjectId, bucket);
    }
    bucket.set(row.type, Number(row.n));
  }
  return out;
}

export async function landingCards(db: Db, userId: string): Promise<SubjectCard[]> {
  const rows = await db
    .select({ subject: subjects, semester: userSubjects.semester, position: userSubjects.position })
    .from(userSubjects)
    .innerJoin(subjects, eq(subjects.id, userSubjects.subjectId))
    .where(eq(userSubjects.userId, userId));

  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.subject.id);

  const pageRows = await db
    .select({ subjectId: pages.subjectId, type: pages.type, n: sql<number>`count(*)` })
    .from(pages)
    .where(inArray(pages.subjectId, ids))
    .groupBy(pages.subjectId, pages.type);

  const studiedRows = await db
    .select({ subjectId: pages.subjectId, type: pages.type, n: sql<number>`count(*)` })
    .from(progress)
    .innerJoin(pages, and(eq(pages.subjectId, progress.subjectId), eq(pages.slug, progress.pageSlug)))
    .where(and(eq(progress.userId, userId), inArray(progress.subjectId, ids)))
    .groupBy(pages.subjectId, pages.type);

  const pageCounts = groupCounts(pageRows);
  const studiedCounts = groupCounts(studiedRows);

  return rows
    .map((r) => buildCard(r.subject, r.semester, r.position, pageCounts, studiedCounts))
    .sort(compareCards);
}

/** Tarjeta de una sola materia de la landing del usuario (null si no está). */
export async function landingCard(db: Db, userId: string, slug: string): Promise<SubjectCard | null> {
  const all = await landingCards(db, userId);
  return all.find((card) => card.slug === slug) ?? null;
}

/** Siguiente posición libre dentro de un cuatrimestre. */
export async function nextPosition(db: Db, userId: string, semester: string): Promise<number> {
  const row = (
    await db
      .select({ max: sql<number | null>`max(${userSubjects.position})` })
      .from(userSubjects)
      .where(and(eq(userSubjects.userId, userId), eq(userSubjects.semester, semester)))
  )[0];
  const max = row?.max ?? null;
  return max === null ? 0 : Number(max) + 1;
}
