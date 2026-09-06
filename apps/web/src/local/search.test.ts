/**
 * La búsqueda local. La heurística viene del API (`services/search.ts`) y estos
 * casos son los suyos, más los que trae el índice nuevo: candidatos por
 * subcadena y fragmento alrededor de la primera coincidencia.
 */
import { describe, expect, it } from "vitest";
import { buildIndex, fold, queryTerms, scoreHit, searchIndex, snippetAround, type SearchDoc } from "./search";

describe("saneamiento de la consulta", () => {
  it("descarta la puntuación y los operadores que traía FTS5", () => {
    expect(queryTerms('normal" OR body:*')).toEqual(["normal", "OR", "body"]);
    expect(queryTerms("NEAR(a b)")).toEqual(["NEAR", "a", "b"]);
  });

  it("no deja términos cuando no hay nada que buscar", () => {
    expect(queryTerms("")).toEqual([]);
    expect(queryTerms("   ")).toEqual([]);
    expect(queryTerms('** -- ""')).toEqual([]);
  });

  it("corta las consultas larguísimas", () => {
    expect(queryTerms("a b c d e f g h i j k l m n o")).toHaveLength(12);
  });

  it("normaliza acentos y mayúsculas", () => {
    expect(fold("Distribución Normal")).toBe("distribucion normal");
    // La ñ se pliega igual que en FTS5 con `remove_diacritics 2`.
    expect(fold("ÑOÑO")).toBe("nono");
  });
});

describe("puntaje de una página", () => {
  const row = { slug: "desigualdad-de-chebyshev", title: "Desigualdad de Chebyshev", type: "tema", division: "u3", summary: "Cota de la probabilidad", rank: 0 };

  it("el título pesa más que el resumen", () => {
    const enTitulo = scoreHit(row, ["chebyshev"], false);
    const enResumen = scoreHit({ ...row, title: "Apunte 7", slug: "apunte-7" }, ["chebyshev"], false);
    expect(enTitulo).toBeGreaterThan(enResumen);
  });

  it("las fuentes se atenúan, no se descartan", () => {
    const propia = scoreHit(row, ["chebyshev"], false);
    const fuente = scoreHit(row, ["chebyshev"], true);
    expect(fuente).toBeCloseTo(propia * 0.55, 6);
    expect(fuente).toBeGreaterThan(0);
  });

  it("el rango del cuerpo suma como el BM25, con el mismo tope", () => {
    const sinCuerpo = scoreHit(row, ["chebyshev"], false);
    expect(scoreHit({ ...row, rank: -3 }, ["chebyshev"], false)).toBeCloseTo(sinCuerpo + 6, 6);
    expect(scoreHit({ ...row, rank: -50 }, ["chebyshev"], false)).toBeCloseTo(sinCuerpo + 20, 6);
  });
});

describe("fragmento", () => {
  const body = "uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis";
  const words = body.split(" ");
  const folded = words.map(fold);

  it("toma ~14 palabras alrededor de la primera coincidencia", () => {
    const snippet = snippetAround(words, folded, ["diez"]);
    expect(snippet.startsWith("…")).toBe(true);
    expect(snippet).toContain("diez");
    expect(snippet.replace(/…/g, "").trim().split(/\s+/)).toHaveLength(14);
  });

  it("no pone puntos suspensivos donde no cortó", () => {
    expect(snippetAround(words, folded, ["uno"]).startsWith("…")).toBe(false);
  });

  it("vacío cuando el término no está en el cuerpo", () => {
    expect(snippetAround(words, folded, ["gamma"])).toBe("");
  });
});

const docs: SearchDoc[] = [
  {
    slug: "desigualdad-de-chebyshev",
    title: "Desigualdad de Chebyshev",
    type: "tema",
    division: "u3",
    summary: "Cota de la probabilidad de alejarse de la media.",
    body: "La desigualdad de Chebyshev acota la probabilidad de que una variable se aleje de su media más de k desviaciones.",
  },
  {
    slug: "apunte-7",
    title: "Apunte 7 · repaso",
    type: "apunte",
    division: "u3",
    summary: "Repaso general de la unidad.",
    body: "Menciona la desigualdad de Chebyshev al pasar, entre muchas otras cosas de la unidad tres del programa.",
  },
  {
    slug: "esperanza",
    title: "Esperanza",
    type: "tema",
    division: "u2",
    summary: "Valor medio de una variable aleatoria.",
    body: "La esperanza es el valor medio y no dice nada de la dispersión.",
  },
];

describe("búsqueda sobre el índice", () => {
  const index = buildIndex(docs);
  const isSecondary = (type: string) => type === "apunte";

  it("la página propia gana a la fuente que la menciona", () => {
    const hits = searchIndex(index, "chebyshev", { isSecondary });
    expect(hits.map((h) => h.slug)).toEqual(["desigualdad-de-chebyshev", "apunte-7"]);
  });

  it("exige TODOS los términos, como el MATCH de FTS5", () => {
    expect(searchIndex(index, "chebyshev esperanza", { isSecondary })).toEqual([]);
    expect(searchIndex(index, "valor medio", { isSecondary }).map((h) => h.slug)).toEqual(["esperanza"]);
  });

  it("ignora acentos y mayúsculas", () => {
    expect(searchIndex(index, "ALEATORIA", {}).map((h) => h.slug)).toEqual(["esperanza"]);
  });

  it("cada resultado trae un fragmento del cuerpo", () => {
    const [hit] = searchIndex(index, "chebyshev", { isSecondary });
    expect(hit?.snippet).toContain("Chebyshev");
  });

  it("una consulta vacía no busca nada", () => {
    expect(searchIndex(index, "   ", {})).toEqual([]);
  });
});
