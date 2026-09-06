/**
 * Búsqueda por materia, en el navegador.
 *
 * La heurística de ranking es la MISMA que tenía el API en
 * `services/search.ts`: `queryTerms` sanea la consulta y `scoreHit` decide el
 * orden mirando dónde cayó cada término (título, slug, resumen) y si la página
 * es material propio o una fuente citada. Se porta tal cual porque es lo que
 * hace que «chebyshev» abra «Desigualdad de Chebyshev» y no el apunte que la
 * menciona de paso.
 *
 * Lo único que cambia es de dónde salen los candidatos. Antes los elegía FTS5 y
 * los ordenaba con BM25; ahora el índice es un arreglo en memoria y los
 * candidatos son las páginas cuyo título, resumen o cuerpo —plegados con `fold`—
 * contienen TODOS los términos (el mismo «Y» implícito que hacía el MATCH).
 * El lugar del BM25 lo ocupa `bodyRank`, un conteo de apariciones en el cuerpo
 * con el mismo signo y la misma escala: `scoreHit` no se entera.
 */
import { fold, type SearchHit } from "@sinapsis/contract";

/** Máximo de resultados devueltos. */
export const SEARCH_LIMIT = 20;

/** Candidatos que se puntúan antes de recortar. */
export const CANDIDATE_LIMIT = 120;

/** Palabras del fragmento que acompaña a cada resultado. */
export const SNIPPET_WORDS = 14;

export { fold };

/** Términos normalizados de la consulta (máximo 12). */
export function queryTerms(raw: string): string[] {
  const cleaned = raw.normalize("NFC").replace(/[^\p{L}\p{N}_]+/gu, " ").trim();
  if (cleaned.length === 0) return [];
  return cleaned.split(/\s+/).slice(0, 12);
}

/** Una fila puntuable: lo que `scoreHit` mira de una página. */
export interface HitRow {
  slug: string;
  title: string;
  type: string;
  division: string;
  summary: string;
  /** Negativo, como el BM25 de SQLite: cuanto más negativo, mejor. */
  rank: number;
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

  // El rango del cuerpo se suma a la escala de la heurística (≈ 2 puntos por
  // unidad, tope 20): ordena entre iguales sin tapar el título, el slug ni el
  // resumen.
  score += Math.min(20, Math.max(0, -row.rank) * 2);

  // Las fuentes (apuntes, teóricas, videos, TPs) se atenúan en vez de
  // penalizarse con un valor fijo: siguen ganando cuando son lo único que
  // coincide ("tp7"), pero ceden ante la página propia del wiki cuando las dos
  // coinciden ("chebyshev" → "Desigualdad de Chebyshev").
  return secondary ? score * 0.55 : score;
}

/** Página tal como entra al índice. */
export interface SearchDoc {
  slug: string;
  title: string;
  type: string;
  division: string;
  summary: string;
  body: string;
}

interface IndexedDoc extends SearchDoc {
  foldedTitle: string;
  foldedSummary: string;
  foldedBody: string;
  /** Palabras del cuerpo, en su forma original y plegada (para el fragmento). */
  words: string[];
  foldedWords: string[];
}

export interface SearchIndex {
  docs: IndexedDoc[];
}

export function buildIndex(docs: readonly SearchDoc[]): SearchIndex {
  return {
    docs: docs.map((doc) => {
      const words = doc.body.split(/\s+/).filter(Boolean);
      return {
        ...doc,
        foldedTitle: fold(doc.title),
        foldedSummary: fold(doc.summary),
        foldedBody: fold(doc.body),
        words,
        foldedWords: words.map(fold),
      };
    }),
  };
}

/** Apariciones de los términos en el cuerpo, con el signo del BM25 (tope 10). */
export function bodyRank(foldedBody: string, terms: readonly string[]): number {
  let total = 0;
  for (const term of terms) {
    if (!term) continue;
    let at = foldedBody.indexOf(term);
    while (at >= 0 && total < 10) {
      total += 1;
      at = foldedBody.indexOf(term, at + term.length);
    }
    if (total >= 10) break;
  }
  return -total;
}

/**
 * Fragmento de ~14 palabras alrededor de la primera coincidencia en el cuerpo.
 * Vacío si ningún término aparece en el cuerpo: quien llame cae al resumen,
 * igual que hacía el `snippet()` de FTS5.
 */
export function snippetAround(words: readonly string[], foldedWords: readonly string[], terms: readonly string[]): string {
  let at = -1;
  for (let i = 0; i < foldedWords.length && at < 0; i += 1) {
    const word = foldedWords[i] ?? "";
    if (terms.some((term) => term && word.includes(term))) at = i;
  }
  if (at < 0) return "";

  const start = Math.max(0, at - Math.floor(SNIPPET_WORDS / 2));
  const end = Math.min(words.length, start + SNIPPET_WORDS);
  const text = words.slice(start, end).join(" ");
  return `${start > 0 ? "…" : ""}${text}${end < words.length ? "…" : ""}`;
}

export interface SearchOptions {
  /**
   * ¿El tipo es material de referencia (las «fuentes», `countsAsContent: false`)?
   * Pesan menos que las páginas propias del wiki.
   */
  isSecondary?: (type: string) => boolean;
}

export function searchIndex(index: SearchIndex, q: string, options: SearchOptions = {}): SearchHit[] {
  const raw = queryTerms(q);
  if (raw.length === 0) return [];
  const terms = raw.map(fold).filter(Boolean);
  if (terms.length === 0) return [];

  const isSecondary = options.isSecondary ?? (() => false);

  const candidates = index.docs
    .map((doc) => ({ doc, rank: 0 }))
    .filter(({ doc }) => {
      const hay = `${doc.foldedTitle}\n${doc.foldedSummary}\n${doc.foldedBody}`;
      return terms.every((term) => hay.includes(term));
    })
    .map((entry) => ({ ...entry, rank: bodyRank(entry.doc.foldedBody, terms) }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, CANDIDATE_LIMIT);

  return candidates
    .map(({ doc, rank }) => ({
      doc,
      score: scoreHit({ ...doc, rank }, terms, isSecondary(doc.type)),
    }))
    /* Desempate estable por título y slug: sin BM25 detrás, dos páginas pueden
       empatar y el orden no puede depender del recorrido del índice. */
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title, "es") || a.doc.slug.localeCompare(b.doc.slug))
    .slice(0, SEARCH_LIMIT)
    .map(({ doc }): SearchHit => ({
      slug: doc.slug,
      title: doc.title,
      type: doc.type,
      division: doc.division,
      snippet: snippetAround(doc.words, doc.foldedWords, terms).trim() || doc.summary,
    }));
}
