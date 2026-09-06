import { describe, expect, it } from "vitest";
import { Slug } from "@sinapsis/contract";
import { isValidSlug, slugify } from "./slug";

describe("slugify", () => {
  it("baja a minúsculas y une con guiones", () => {
    expect(slugify("Probabilidad y Estadística")).toBe("probabilidad-y-estadistica");
    expect(slugify("Análisis Matemático II")).toBe("analisis-matematico-ii");
  });

  it("quita acentos, eñes y signos", () => {
    expect(slugify("Diseño de Señales (2026)")).toBe("diseno-de-senales-2026");
    expect(slugify("  ¡Física II!  ")).toBe("fisica-ii");
  });

  it("colapsa separadores y no deja guiones en los extremos", () => {
    expect(slugify("---A / B---")).toBe("a-b");
    expect(slugify("72.33 — Algoritmos III")).toBe("72-33-algoritmos-iii");
  });

  it("devuelve cadena vacía cuando no queda nada utilizable", () => {
    expect(slugify("¿?¡!")).toBe("");
    expect(slugify("")).toBe("");
  });

  it("produce slugs que el contrato acepta", () => {
    for (const name of ["Probabilidad y Estadística", "Química General", "Inglés Técnico"]) {
      expect(Slug.safeParse(slugify(name)).success).toBe(true);
      expect(isValidSlug(slugify(name))).toBe(true);
    }
  });
});
