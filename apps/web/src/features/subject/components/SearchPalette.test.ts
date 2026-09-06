/**
 * El snippet del API llega con el texto del wiki tal cual: marcadores del
 * resaltado, wikilinks y LaTeX. En una lista de resultados eso no se lee, así
 * que la paleta lo deja en prosa antes de mostrarlo.
 */
import { describe, expect, it } from "vitest";
import { highlight, plainSnippet } from "./SearchPalette";

describe("plainSnippet", () => {
  it("quita los marcadores del resaltado del API", () => {
    expect(plainSnippet("la <b>normal</b> y su <mark>densidad</mark>")).toBe("la normal y su densidad");
  });

  it("lee los wikilinks por su texto", () => {
    expect(plainSnippet("ver [[distribucion-normal|la Normal]] y [[varianza]]")).toBe(
      "ver la Normal y varianza",
    );
  });

  it("resume la matemática en línea y en bloque", () => {
    expect(plainSnippet("la campana $N(\\mu,\\sigma)$ es simétrica")).toBe("la campana … es simétrica");
    expect(plainSnippet("se define $$f(x) = 1$$ para todo x")).toBe("se define … para todo x");
  });

  it("colapsa los espacios y recorta las puntas", () => {
    expect(plainSnippet("  dos    saltos\n  y tabulación\t ")).toBe("dos saltos y tabulación");
  });

  it("tolera un snippet vacío", () => {
    expect(plainSnippet("")).toBe("");
  });
});

describe("highlight", () => {
  it("parte el texto por el término, sin distinguir mayúsculas", () => {
    expect(highlight("Distribución Normal", "normal")).toEqual([
      { text: "Distribución ", hit: false },
      { text: "Normal", hit: true },
    ]);
  });

  it("sin término, devuelve el texto entero sin marcar", () => {
    expect(highlight("Distribución Normal", "  ")).toEqual([{ text: "Distribución Normal", hit: false }]);
  });
});
