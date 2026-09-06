/**
 * Helpers compartidos sobre materias y páginas.
 */
import { eq } from "drizzle-orm";
import { countsAsContent, type Page, type PageMeta, type SubjectConfigLoose } from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import { pages, subjects, type PageRow, type SubjectRow } from "../db/schema.js";

export async function findSubjectBySlug(db: Db, slug: string): Promise<SubjectRow | undefined> {
  const rows = await db.select().from(subjects).where(eq(subjects.slug, slug)).limit(1);
  return rows[0];
}

/**
 * Config efectivo de una materia. Las materias placeholder (creadas a mano
 * desde la landing, sin sync) todavía no tienen `config_json`: se les arma un
 * config sintético mínimo con lo que declaró el diálogo "Agregar materia".
 *
 * El tipo de retorno es `SubjectConfigLoose` justamente por eso: `divisions` y
 * `pageTypes` pueden venir vacíos, que es lo que `SubjectConfig` no admite.
 */
export function resolveConfig(row: SubjectRow): SubjectConfigLoose {
  if (row.configJson) return row.configJson;
  return {
    contract: 1,
    slug: row.slug,
    name: row.name,
    code: row.code,
    institution: row.institution,
    ...(row.color ? { color: row.color } : {}),
    ...(row.semesterHint ? { semester: row.semesterHint } : {}),
    division: row.divisionJson,
    divisions: [],
    pageTypes: [],
    rail: [],
    fab: null,
    wiki: { root: "wiki", ignore: [], divisionField: "division", study: "estudio" },
  };
}

/**
 * Predicado "este tipo de página cuenta como contenido", con la regla del
 * contrato (`countsAsContent`) resuelta una sola vez: solo quedan fuera los
 * tipos declarados con `countsAsContent: false`; un tipo que el config no
 * declara cuenta (y además genera un warning en el sync).
 */
export function contentTypePredicate(
  config: Pick<SubjectConfigLoose, "pageTypes">,
): (type: string) => boolean {
  const excluded = new Set(
    config.pageTypes.filter((t) => !countsAsContent(config, t.key)).map((t) => t.key),
  );
  return (type: string) => !excluded.has(type);
}

/** Columnas suficientes para armar un `PageMeta` (sin cuerpo ni enlaces). */
export const pageMetaColumns = {
  id: pages.id,
  subjectId: pages.subjectId,
  slug: pages.slug,
  title: pages.title,
  type: pages.type,
  folder: pages.folder,
  division: pages.division,
  order: pages.order,
  summary: pages.summary,
  format: pages.format,
  tagsJson: pages.tagsJson,
  sourcesJson: pages.sourcesJson,
  updatedAtSrc: pages.updatedAtSrc,
  words: pages.words,
} as const;

export type PageMetaRow = Omit<PageRow, "body" | "linksJson" | "headingsJson" | "contentHash">;

export function rowToPageMeta(row: PageMetaRow): PageMeta {
  return {
    slug: row.slug,
    title: row.title,
    type: row.type,
    folder: row.folder,
    division: row.division,
    ...(row.order === null ? {} : { order: row.order }),
    summary: row.summary,
    ...(row.format === null ? {} : { format: row.format }),
    tags: row.tagsJson,
    sources: row.sourcesJson,
    ...(row.updatedAtSrc === null ? {} : { updatedAt: row.updatedAtSrc }),
    words: row.words,
  };
}

export function rowToPage(row: PageRow): Page {
  return {
    ...rowToPageMeta(row),
    links: row.linksJson,
    headings: row.headingsJson,
    body: row.body,
  };
}
