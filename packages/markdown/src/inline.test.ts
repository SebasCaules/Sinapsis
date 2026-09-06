import { describe, expect, it } from "vitest";
import { countWords, extractHeadings, extractLinks, firstH1, normalizeDisplayMath, slugifyAnchor } from "./inline.js";

describe("extractLinks", () => {
  it("lee las tres formas de wikilink", () => {
    const links = extractLinks("Ver [[a-b]], [[c-d|texto]] y [[e-f#Ancla larga|otro]].");
    expect(links).toEqual([
      { slug: "a-b" },
      { slug: "c-d", text: "texto" },
      { slug: "e-f", anchor: "Ancla larga", text: "otro" },
    ]);
  });

  it("desescapa los pipes de tabla de Obsidian", () => {
    expect(extractLinks("| [[a-b\\|Texto]] |")).toEqual([{ slug: "a-b", text: "Texto" }]);
  });

  it("deduplica por (slug, ancla, texto)", () => {
    const links = extractLinks("[[a]] [[a]] [[a|x]] [[a#h]] [[a#h]]");
    expect(links).toEqual([
      { slug: "a" },
      { slug: "a", text: "x" },
      { slug: "a", anchor: "h" },
    ]);
  });

  it("deja el slug vacío en los enlaces internos [[#ancla]]", () => {
    expect(extractLinks("ver [[#Proceso de Markov|los procesos]]")).toEqual([
      { slug: "", anchor: "Proceso de Markov", text: "los procesos" },
    ]);
  });
});

describe("extractHeadings", () => {
  it("toma H1..H4 y calcula el id", () => {
    const body = ["# Uno", "## Dos", "##### Cinco (fuera)", "#### Cuatro #"].join("\n");
    expect(extractHeadings(body)).toEqual([
      { level: 1, text: "Uno", id: "uno" },
      { level: 2, text: "Dos", id: "dos" },
      { level: 4, text: "Cuatro", id: "cuatro" },
    ]);
  });

  it("ignora los encabezados dentro de bloques $$…$$", () => {
    const body = ["# Real", "$$", "# No es un heading", "\\# tampoco", "$$", "## Después"].join("\n");
    expect(extractHeadings(body).map((h) => h.text)).toEqual(["Real", "Después"]);
  });

  it("no se queda dentro del bloque si la línea abre y cierra", () => {
    const body = ["$$ x = 1 $$", "# Visible"].join("\n");
    expect(extractHeadings(body).map((h) => h.text)).toEqual(["Visible"]);
  });
});

describe("slugifyAnchor", () => {
  it("conserva los acentos del español y baja a minúsculas", () => {
    expect(slugifyAnchor("Aproximación Normal de la Binomial")).toBe("aproximación-normal-de-la-binomial");
    expect(slugifyAnchor("Por qué funciona (esbozo)")).toBe("por-qué-funciona-esbozo");
    expect(slugifyAnchor("Corrección — continuidad")).toBe("corrección-continuidad");
  });

  it("quita $math$, wikilinks y marcas de formato", () => {
    expect(slugifyAnchor("Media $\\mu$ y varianza")).toBe("media-y-varianza");
    expect(slugifyAnchor("Ver [[distribucion-normal|la Normal]]")).toBe("ver-la-normal");
    expect(slugifyAnchor("Ver [[distribucion-normal]]")).toBe("ver-distribucionnormal");
    expect(slugifyAnchor("**Negrita** y `código`")).toBe("negrita-y-código");
  });

  it("devuelve 'h' si no queda nada", () => {
    expect(slugifyAnchor("$$$$")).toBe("h");
    expect(slugifyAnchor("###")).toBe("h");
  });
});

describe("countWords", () => {
  it("cuenta como el \\w+ de Python", () => {
    expect(countWords("Hola, mundo. Ñandú 42 _guion")).toBe(5);
    expect(countWords("")).toBe(0);
  });
});

describe("firstH1", () => {
  it("devuelve el primer H1 o null", () => {
    expect(firstH1("texto\n# Título\n## Otro")).toBe("Título");
    expect(firstH1("## Solo H2")).toBeNull();
  });
});

describe("normalizeDisplayMath", () => {
  it("pone en líneas propias un $$ que abre con contenido y otro que cierra con contenido", () => {
    const body = ["texto", "", "$$ \\frac{a}{b}", "\\to c. $$", "**Sigue** $m$."].join("\n");
    expect(normalizeDisplayMath(body)).toBe(
      ["texto", "", "$$", "\\frac{a}{b}", "\\to c.", "$$", "**Sigue** $m$."].join("\n"),
    );
  });

  it("convierte `$$ x $$` solo en su línea en un bloque display", () => {
    expect(normalizeDisplayMath("a\n$$ x^2 $$\nb")).toBe("a\n$$\nx^2\n$$\nb");
    expect(normalizeDisplayMath("$$E[X]=\\mu$$")).toBe("$$\nE[X]=\\mu\n$$");
  });

  it("deja intactos los bloques ya bien formados, el inline dentro de texto y los bloques de código", () => {
    const ok = ["$$", "x", "$$", "", "y $$z$$ w", "", "```", "$$ no toca", "```", "", "$a$ y $$b$$ y $$c$$"].join("\n");
    expect(normalizeDisplayMath(ok)).toBe(ok);
  });

  it("respeta la sangría del contenido al partir el cierre", () => {
    expect(normalizeDisplayMath("$$ a\n   b. $$")).toBe("$$\na\n   b.\n$$");
  });

  it("no confunde un $$ que solo cierra con un cierre inline", () => {
    expect(normalizeDisplayMath("$$\na\n$$ b $$")).toBe("$$\na\n$$ b $$");
  });
});
