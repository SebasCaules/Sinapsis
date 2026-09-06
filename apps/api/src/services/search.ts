/**
 * Búsqueda de texto completo por materia (FTS5) con reordenamiento propio.
 *
 * `pages_fts` es un índice FTS5 de contenido externo sobre `pages`
 * (`content='pages'`, S-06): no guarda una copia del texto y lo mantienen los
 * triggers `pages_ai/ad/au` de la migración `0002_study.sql`. Este módulo solo
 * lee: saneamiento de la consulta, filtro por materia y ranking.
 *
 * El índice cubre las tres columnas de texto de la tabla: `title`, `summary` y
 * `body`. El MATCH corre sobre las tres (una página cuyo resumen menciona el
 * término es candidata aunque el cuerpo no lo diga); el `snippet()` se pide solo
 * sobre el cuerpo, que es de donde sale un fragmento legible, y cuando no hay
 * fragmento se cae al resumen. El resumen además sigue pesando en el ranking
 * propio: `scoreHit` lo mira sobre la fila de `pages`.
 *
 * Por qué no alcanza con BM25 solo: en un wiki de una materia el vocabulario es
 * muy repetitivo ("normal" aparece en casi todas las páginas de Proba), la IDF
 * se hace prácticamente cero y todos los documentos terminan con puntajes
 * indistinguibles. FTS5 elige entonces los candidatos y el ranking final lo
 * decide `scoreHit`, que mira dónde cayó cada término (título, slug, resumen) y
 * si la página es material propio o una fuente citada.
 */
import { sql } from "drizzle-orm";
import { fold, type SearchHit } from "@sinapsis/contract";
import type { Db } from "../db/client.js";

/** Máximo de resultados devueltos. */
export const SEARCH_LIMIT = 20;
/** Candidatos que pide a FTS5 antes de reordenar. */
const CANDIDATE_LIMIT = 120;
/**
 * Posición de `body` en `pages_fts` (title = 0, summary = 1, body = 2). La
 * necesita `snippet()`, que se pide por índice de columna.
 */
const BODY_COLUMN = 2;

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
             snippet(pages_fts, ${sql.raw(String(BODY_COLUMN))}, '', '', '…', 14) AS snip,
             bm25(pages_fts, 10.0, 3.0, 1.0) AS rank
        FROM pages_fts
        JOIN pages p ON p.rowid = pages_fts.rowid
       WHERE pages_fts MATCH ${match}
         AND pages_fts.rowid IN (SELECT rowid FROM pages WHERE subject_id = ${subjectId})
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

