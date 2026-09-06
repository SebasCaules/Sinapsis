/**
 * Búsqueda de texto completo por materia (FTS5) con reordenamiento propio.
 *
 * `services/sync.ts` mantiene el índice `pages_fts` (solo las páginas que
 * cambiaron), así que acá hay lectura, saneamiento de la consulta y ranking,
 * más las primitivas de escritura que usa el sync.
 *
 * Por qué no alcanza con BM25 solo: en un wiki de una materia el vocabulario es
 * muy repetitivo ("normal" aparece en casi todas las páginas de Proba), la IDF
 * se hace prácticamente cero y todos los documentos terminan con puntajes
 * indistinguibles. FTS5 elige entonces los candidatos y el ranking final lo
 * decide `scoreHit`, que mira dónde cayó cada término (título, slug, resumen) y
 * si la página es material propio o una fuente citada.
 */
import { sql, type SQL } from "drizzle-orm";
import { fold, type SearchHit } from "@sinapsis/contract";
import type { Db } from "../db/client.js";

/** Máximo de resultados devueltos. */
export const SEARCH_LIMIT = 20;
/** Candidatos que pide a FTS5 antes de reordenar. */
const CANDIDATE_LIMIT = 120;

/**
 * Minúsculas sin acentos: "Distribución" y "distribucion" son lo mismo. Es el
 * `fold` del contrato (mismo criterio que el compilador y la web); se reexporta
 * porque el ranking de acá es su usuario más caliente.
 */
export { fold } from "@sinapsis/contract";

/**
 * Traduce el texto del usuario a una consulta FTS5 segura: se descarta todo lo
 * que no sea letra o dígito (los operadores `*`, `"`, `NEAR`, `:` de FTS5 no
 * deben llegar crudos) y cada término se busca como prefijo entrecomillado.
 * Devuelve null si no queda nada que buscar.
 */
export function toFtsQuery(raw: string): string | null {
  const terms = queryTerms(raw);
  if (terms.length === 0) return null;
  return terms.map((t) => `"${t.replace(/"/g, '""')}"*`).join(" ");
}

/** Términos normalizados de la consulta (máximo 12). */
export function queryTerms(raw: string): string[] {
  const cleaned = raw.normalize("NFC").replace(/[^\p{L}\p{N}_]+/gu, " ").trim();
  if (cleaned.length === 0) return [];
  return cleaned.split(/\s+/).slice(0, 12);
}

interface HitRow {
  slug: string;
  title: string;
  type: string;
  division: string;
  summary: string;
  snip: string | null;
  rank: number;
}

export interface SearchOptions {
  /**
   * ¿El tipo es material de referencia (las "fuentes", `countsAsContent: false`)?
   * Pesan menos que las páginas propias del wiki. Lo decide
   * `contentTypePredicate` de `services/subjects.ts`.
   */
  isSecondary?: (type: string) => boolean;
}

/** Puntaje de una página frente a los términos buscados. Más alto es mejor. */
export function scoreHit(row: HitRow, terms: string[], secondary: boolean): number {
  const title = fold(row.title);
  const titleWords = title.split(/[^\p{L}\p{N}_]+/u).filter(Boolean);
  const slugWords = fold(row.slug).split("-").filter(Boolean);
  const summary = fold(row.summary);
  const query = terms.join(" ");

  let score = 0;
  let matchedTitleWords = 0;

  for (const term of terms) {
    if (titleWords.includes(term)) {
      score += 40;
      matchedTitleWords += 1;
    } else if (titleWords.some((w) => w.startsWith(term))) {
      score += 18;
      matchedTitleWords += 1;
    }
    if (slugWords.includes(term)) score += 12;
    else if (slugWords.some((w) => w.startsWith(term))) score += 6;
    if (summary.includes(term)) score += 4;
  }

  // Un título corto que se compone casi solo de lo buscado es mejor resultado
  // que un título largo donde el término es incidental.
  if (titleWords.length > 0) score += 12 * (matchedTitleWords / titleWords.length);

  if (title === query) score += 60;
  if (fold(row.slug) === terms.join("-")) score += 60;

  // BM25 de SQLite es negativo (más negativo = mejor). Se suma a la escala de la
  // heurística (≈ 2 puntos por unidad, tope 20): ordena entre iguales sin tapar
  // el título, el slug ni el resumen. (Antes ×1e5 anulaba el ranking propio.)
  score += Math.min(20, Math.max(0, -row.rank) * 2);

  // Las fuentes (apuntes, teóricas, videos, TPs) se atenúan en vez de
  // penalizarse con un valor fijo: siguen ganando cuando son lo único que
  // coincide ("tp7"), pero ceden ante la página propia del wiki cuando las dos
  // coinciden ("chebyshev" → "Desigualdad de Chebyshev").
  return secondary ? score * 0.55 : score;
}

export async function searchPages(
  db: Db,
  subjectId: string,
  q: string,
  options: SearchOptions = {},
): Promise<SearchHit[]> {
  const match = toFtsQuery(q);
  if (!match) return [];
  const terms = queryTerms(q).map(fold);

  let rows: HitRow[];
  try {
    rows = await db.all<HitRow>(sql`
      SELECT p.slug AS slug,
             p.title AS title,
             p.type AS type,
             p.division AS division,
             p.summary AS summary,
             snippet(pages_fts, 1, '', '', '…', 14) AS snip,
             bm25(pages_fts, 10.0, 1.0) AS rank
        FROM pages_fts
        JOIN pages p
          ON p.slug = pages_fts.slug
         AND p.subject_id = pages_fts.subject_id
       WHERE pages_fts MATCH ${match}
         AND pages_fts.subject_id = ${subjectId}
       ORDER BY rank
       LIMIT ${CANDIDATE_LIMIT}
    `);
  } catch {
    // Una consulta que FTS5 rechaza no es un error del servidor: no hay resultados.
    return [];
  }

  const isSecondary = options.isSecondary ?? (() => false);

  return rows
    .map((row) => ({ row, score: scoreHit(row, terms, isSecondary(row.type)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, SEARCH_LIMIT)
    .map(({ row }) => ({
      slug: row.slug,
      title: row.title,
      type: row.type,
      division: row.division,
      snippet: (row.snip ?? "").trim() || row.summary,
    }));
}

/** Filas del índice, en lotes: `pages_fts` no tiene índices, conviene tocarla poco. */
const FTS_BATCH = 100;

/** Página tal como entra al índice. */
export interface IndexablePage {
  slug: string;
  title: string;
  body: string;
  summary: string;
}

/** Borra del índice solo los slugs indicados (los que cambiaron o se borraron). */
export async function removeFromFts(db: Db, subjectId: string, slugs: readonly string[]): Promise<void> {
  for (const batch of chunks(slugs, FTS_BATCH)) {
    const list: SQL = sql.join(
      batch.map((slug) => sql`${slug}`),
      sql`, `,
    );
    await db.run(sql`DELETE FROM pages_fts WHERE subject_id = ${subjectId} AND slug IN (${list})`);
  }
}

/** Inserta páginas en el índice, en lotes de a `FTS_BATCH`. */
export async function indexPages(db: Db, subjectId: string, list: readonly IndexablePage[]): Promise<void> {
  for (const batch of chunks(list, FTS_BATCH)) {
    const rows: SQL = sql.join(
      batch.map((p) => sql`(${p.title}, ${`${p.summary}\n${p.body}`}, ${p.slug}, ${subjectId})`),
      sql`, `,
    );
    await db.run(sql`INSERT INTO pages_fts (title, body, slug, subject_id) VALUES ${rows}`);
  }
}

/** Parte una lista en tandas de a `size` (la última puede ser más corta). */
export function chunks<T>(list: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}
