import { describe, expect, it } from "vitest";
import { cleanWikilink, parseFrontmatter, parseScalarOrList, splitTopCommas } from "./frontmatter.js";

describe("parseFrontmatter", () => {
  it("separa el bloque YAML del cuerpo", () => {
    const { meta, body } = parseFrontmatter(
      ["---", "titulo: Distribución Normal", "unidad: 4", "---", "", "# Normal", "Texto."].join("\n"),
    );
    expect(meta["titulo"]).toBe("Distribución Normal");
    expect(meta["unidad"]).toBe(4);
    expect(body).toBe("# Normal\nTexto.");
  });

  it("devuelve el texto completo si no hay frontmatter", () => {
    const { meta, body } = parseFrontmatter("# Sin frontmatter\n");
    expect(meta).toEqual({});
    expect(body).toBe("# Sin frontmatter\n");
  });

  it("reduce los wikilinks de una lista a su slug", () => {
    const { meta } = parseFrontmatter(
      ["---", 'fuentes: ["[[teorica-normal]]", "[[tp4|TP 4]]", "[[apunte#seccion]]"]', "---", "cuerpo"].join("\n"),
    );
    expect(meta["fuentes"]).toEqual(["teorica-normal", "tp4", "apunte"]);
  });

  it("conserva un resumen con $math$ y comillas internas", () => {
    const resumen =
      "Caso más usado del TCL: para $n$ grande, $\\mathrm{Bin}(n,p)\\approx\\mathcal{N}(np,\\sqrt{npq})$.";
    const { meta } = parseFrontmatter(["---", `resumen: '${resumen}'`, "---", "cuerpo"].join("\n"));
    expect(meta["resumen"]).toBe(resumen);
  });

  it("cae al parser manual cuando el YAML es inválido", () => {
    // `titulo` sin comillas y con dos puntos rompe YAML; el parser manual lo tolera.
    const { meta, body } = parseFrontmatter(
      ["---", "titulo: Bayes: la regla", "tags: [a, b]", "---", "cuerpo"].join("\n"),
    );
    expect(meta["titulo"]).toBe("Bayes: la regla");
    expect(meta["tags"]).toEqual(["a", "b"]);
    expect(body).toBe("cuerpo");
  });

  it("ignora comentarios y líneas sin dos puntos en el parser manual", () => {
    const { meta } = parseFrontmatter(
      ["---", "titulo: X: Y", "# comentario", "línea suelta", "orden: 3", "---", "b"].join("\n"),
    );
    expect(meta).toEqual({ titulo: "X: Y", orden: "3" });
  });

  it("normaliza null a cadena vacía", () => {
    const { meta } = parseFrontmatter(["---", "resumen:", "---", "b"].join("\n"));
    expect(meta["resumen"]).toBe("");
  });

  it("no convierte las fechas en objetos Date", () => {
    const { meta } = parseFrontmatter(["---", "actualizado: 2026-09-04", "---", "b"].join("\n"));
    expect(meta["actualizado"]).toBe("2026-09-04");
  });
});

describe("parseScalarOrList", () => {
  it("parsea listas entre corchetes", () => {
    expect(parseScalarOrList("[uno, dos, tres]")).toEqual(["uno", "dos", "tres"]);
    expect(parseScalarOrList("[]")).toEqual([]);
  });

  it("quita comillas de los escalares", () => {
    expect(parseScalarOrList('"hola"')).toBe("hola");
    expect(parseScalarOrList("'hola'")).toBe("hola");
    expect(parseScalarOrList("")).toBe("");
  });
});

describe("splitTopCommas", () => {
  it("no corta dentro de comillas", () => {
    expect(splitTopCommas('"a, b", c')).toEqual(['"a, b"', " c"]);
  });
});

describe("cleanWikilink", () => {
  it("reduce el wikilink a su slug", () => {
    expect(cleanWikilink("[[a-b]]")).toBe("a-b");
    expect(cleanWikilink("[[a-b|Texto]]")).toBe("a-b");
    expect(cleanWikilink("[[a-b#Ancla|Texto]]")).toBe("a-b");
    expect(cleanWikilink("texto plano")).toBe("texto plano");
  });
});
