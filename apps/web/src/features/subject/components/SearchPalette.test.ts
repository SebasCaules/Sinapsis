/**
 * El snippet del API llega con el texto del wiki tal cual: marcadores del
 * resaltado, wikilinks y LaTeX. En una lista de resultados eso no se lee, así
 * que la paleta lo deja en prosa antes de mostrarlo.
 */
import { describe, expect, it } from "vitest";
import { coreTitle, highlight, norm, plainSnippet, scorePage } from "./SearchPalette";

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

  it("resume la matemática que el recorte del API dejó abierta", () => {
    expect(plainSnippet("Se calcula así: $$ F_X(x)=P")).toBe("Se calcula así: …");
    expect(plainSnippet("el desvío $X y su")).toBe("el desvío …");
  });

  it("quita los marcadores de markdown", () => {
    expect(plainSnippet("**Qué es:** una *medida* de `dispersión`")).toBe("Qué es: una medida de dispersión");
    expect(plainSnippet("## Función de densidad")).toBe("Función de densidad");
    expect(plainSnippet("> [!nota]\n> es la más usada")).toBe("[!nota] es la más usada");
    expect(plainSnippet("ver [la tabla](https://x.test/t) y nada más")).toBe("ver la tabla y nada más");
  });

  it("no parte palabras con guion bajo ni multiplicaciones", () => {
    expect(plainSnippet("la variable x_i por a * b")).toBe("la variable x_i por a * b");
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

describe("orden de los resultados", () => {
  const page = (title: string, content = true) => ({ title, hay: norm(title), content });

  it("normaliza sin tildes para comparar", () => {
    expect(norm("Distribución Binomial")).toBe("distribucion binomial");
  });

  it("el núcleo del título deja fuera el sustantivo genérico inicial", () => {
    expect(coreTitle("distribucion binomial")).toBe("binomial");
    expect(coreTitle("teorema de la probabilidad total")).toBe("probabilidad total");
    /* Sin sustantivo genérico, el núcleo es el título entero. */
    expect(coreTitle("esperanza")).toBe("esperanza");
  });

  it("la página canónica del término gana a la que solo lo menciona", () => {
    const canonica = scorePage(page("Distribución Binomial"), "binomial", ["binomial"]);
    const derivada = scorePage(page("Aproximación Normal de la Binomial"), "binomial", ["binomial"]);
    expect(canonica).toBeGreaterThan(derivada);
  });

  it("el contenido va antes que las fuentes", () => {
    const contenido = scorePage(page("Varianza"), "varianza", ["varianza"]);
    const fuente = scorePage(page("Varianza", false), "varianza", ["varianza"]);
    expect(contenido).toBeGreaterThan(fuente);
  });

  it("empezar por lo escrito puntúa más que mencionarlo a mitad de palabra", () => {
    const empieza = scorePage(page("Media aritmética"), "media", ["media"]);
    const dentro = scorePage(page("Promedio"), "media", ["media"]);
    expect(empieza).toBeGreaterThan(dentro);
  });
});
