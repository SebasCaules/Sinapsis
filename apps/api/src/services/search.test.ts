import { describe, expect, it } from "vitest";
import { fold, queryTerms, toFtsQuery } from "./search.js";

describe("saneamiento de la consulta FTS", () => {
  it("convierte cada término en un prefijo entrecomillado", () => {
    expect(toFtsQuery("teorema central")).toBe('"teorema"* "central"*');
  });

  it("descarta los operadores de FTS5", () => {
    expect(toFtsQuery('normal" OR body:*')).toBe('"normal"* "OR"* "body"*');
    expect(toFtsQuery("NEAR(a b)")).toBe('"NEAR"* "a"* "b"*');
  });

  it("devuelve null cuando no queda nada que buscar", () => {
    expect(toFtsQuery("")).toBeNull();
    expect(toFtsQuery("   ")).toBeNull();
    expect(toFtsQuery('** -- ""')).toBeNull();
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
