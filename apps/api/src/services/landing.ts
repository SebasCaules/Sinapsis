/**
 * La landing del usuario: sus materias con los agregados que muestra la
 * tarjeta (divisiones, páginas de contenido, progreso).
 *
 * `subjects` es global y `user_subjects` guarda cuatrimestre y posición por
 * usuario (N0-6).
 */
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { canonicalSemester, compareSemestersDesc, type SubjectCard } from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import { pages, progress, subjects, userSemesters, userSubjects, type SubjectRow } from "../db/schema.js";
import { contentTypePredicate, resolveConfig } from "./subjects.js";

/** Color de reserva cuando la materia no declara ninguno. */
export const DEFAULT_SUBJECT_COLOR = "--u1";

/** Cuatrimestre descendente ("2026-2C" antes que "2026-1C"), posición ascendente. */
export function compareCards(a: SubjectCard, b: SubjectCard): number {
  const bySemester = compareSemestersDesc(a.semester, b.semester);
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
    dueCount: 0, // TODO Sprint 3 (A4): tarjetas SRS vencidas del usuario en esta materia
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

/** Conteos por tipo (totales y estudiados) de un conjunto acotado de materias. */
async function countsFor(
  db: Db,
  userId: string,
  ids: readonly string[],
): Promise<{ pageCounts: CountsBySubject; studiedCounts: CountsBySubject }> {
  const scope = inArray(pages.subjectId, [...ids]);

  const pageRows = await db
    .select({ subjectId: pages.subjectId, type: pages.type, n: sql<number>`count(*)` })
    .from(pages)
    .where(scope)
    .groupBy(pages.subjectId, pages.type);

  const studiedRows = await db
    .select({ subjectId: pages.subjectId, type: pages.type, n: sql<number>`count(*)` })
    .from(progress)
    .innerJoin(pages, and(eq(pages.subjectId, progress.subjectId), eq(pages.slug, progress.pageSlug)))
    .where(and(eq(progress.userId, userId), inArray(progress.subjectId, [...ids])))
    .groupBy(pages.subjectId, pages.type);

  return { pageCounts: groupCounts(pageRows), studiedCounts: groupCounts(studiedRows) };
}

export async function landingCards(db: Db, userId: string): Promise<SubjectCard[]> {
  const rows = await db
    .select({ subject: subjects, semester: userSubjects.semester, position: userSubjects.position })
    .from(userSubjects)
    .innerJoin(subjects, eq(subjects.id, userSubjects.subjectId))
    .where(eq(userSubjects.userId, userId));

  if (rows.length === 0) return [];
  const { pageCounts, studiedCounts } = await countsFor(db, userId, rows.map((r) => r.subject.id));

  return rows
    .map((r) => buildCard(r.subject, r.semester, r.position, pageCounts, studiedCounts))
    .sort(compareCards);
}

/**
 * Tarjeta de una sola materia de la landing del usuario (null si no está).
 * Consulta acotada a esa materia: no arma la landing entera para descartarla.
 */
export async function landingCard(db: Db, userId: string, slug: string): Promise<SubjectCard | null> {
  const row = (
    await db
      .select({ subject: subjects, semester: userSubjects.semester, position: userSubjects.position })
      .from(userSubjects)
      .innerJoin(subjects, eq(subjects.id, userSubjects.subjectId))
      .where(and(eq(userSubjects.userId, userId), eq(subjects.slug, slug)))
      .limit(1)
  )[0];
  if (!row) return null;

  const { pageCounts, studiedCounts } = await countsFor(db, userId, [row.subject.id]);
  return buildCard(row.subject, row.semester, row.position, pageCounts, studiedCounts);
}

// ---------------------------------------------------------------------------
// Cuatrimestres del usuario (S-03, N0-32)
// ---------------------------------------------------------------------------

/**
 * Cuatrimestres de la landing: primero los que el usuario declaró y ordenó
 * (`user_semesters`, que es lo único que conserva los vacíos), después los que
 * aparecen en sus materias y todavía no estaban declarados, en el orden
 * canónico del contrato (el más reciente primero).
 */
export async function landingSemesters(db: Db, userId: string): Promise<string[]> {
  const declared = await db
    .select({ label: userSemesters.label })
    .from(userSemesters)
    .where(eq(userSemesters.userId, userId))
    .orderBy(asc(userSemesters.position), asc(userSemesters.label));

  const used = await db
    .select({ semester: userSubjects.semester })
    .from(userSubjects)
    .where(eq(userSubjects.userId, userId));

  const out = declared.map((row) => row.label);
  const known = new Set(out);
  const extra = [...new Set(used.map((row) => row.semester))]
    .filter((label) => !known.has(label))
    .sort(compareSemestersDesc);

  return [...out, ...extra];
}

/**
 * Rótulo de cuatrimestre tal como se guarda: la forma canónica del contrato
 * ("2026-1c" → "2026-1C"). Los rótulos libres (los que no tienen la forma
 * "AAAA-NC") solo se recortan; si al recortarlos no queda nada, se conserva lo
 * que escribió el usuario antes que guardar una cadena vacía. Es el único
 * criterio de igualdad entre cuatrimestres: se aplica al declararlos
 * (`user_semesters`) y al ubicar una materia (`user_subjects.semester`), así
 * «2026-1c» y «2026-1C» son siempre la misma fila (N0-32).
 */
export function normalizeSemester(raw: string): string {
  return canonicalSemester(raw) || raw;
}

/**
 * Reemplaza la lista de cuatrimestres del usuario: `position` es el índice en
 * el array recibido. Se llama dentro de la transacción de `PUT /api/landing`.
 * Los rótulos se normalizan y se deduplican por su forma canónica, conservando
 * la primera aparición.
 */
export async function replaceSemesters(db: Db, userId: string, labels: string[]): Promise<void> {
  await db.delete(userSemesters).where(eq(userSemesters.userId, userId));
  const unique = [...new Set(labels.map(normalizeSemester))];
  if (unique.length === 0) return;
  await db
    .insert(userSemesters)
    .values(unique.map((label, position) => ({ userId, label, position })));
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
