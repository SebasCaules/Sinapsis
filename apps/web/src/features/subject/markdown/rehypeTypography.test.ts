/**
 * Lo que el plugin promete: la puntuación que sigue a una fórmula en línea no
 * puede quedar huérfana en el renglón siguiente, y «Ej. 3» no se parte. Nada
 * más: el código y la fórmula de bloque quedan exactamente como estaban.
 */
import { describe, expect, it } from "vitest";
import { atarAbreviaturas, NOWRAP_CLASS, NOWRAP_MAX, rehypeTypography } from "./rehypeTypography";

interface Node {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
}

const WJ = "⁠";
const NBSP = " ";

const text = (value: string): Node => ({ type: "text", value });
const el = (tagName: string, children: Node[], properties: Record<string, unknown> = {}): Node => ({
  type: "element",
  tagName,
  properties,
  children,
});
const inline = (tex: string): Node => el("span", [text(tex)], { className: ["math", "math-inline"] });
const display = (tex: string): Node => el("div", [text(tex)], { className: ["math", "math-display"] });
const root = (children: Node[]): Node => ({ type: "root", children });

const textos = (node: Node): string[] =>
  (node.children ?? []).flatMap((c) => (c.type === "text" ? [c.value ?? ""] : textos(c)));

describe("rehypeTypography", () => {
  it("prohíbe el corte entre una fórmula en línea y la puntuación que la sigue", () => {
    const p = el("p", [text("Con "), inline("9^{2} = 81 \\equiv 26"), text(", y "), inline("x"), text(". Fin")]);
    rehypeTypography()(root([p]));
    expect(textos(p)).toEqual(["Con ", "9^{2} = 81 \\equiv 26", `${WJ}, y `, "x", `${WJ}. Fin`]);
  });

  it("tampoco deja un paréntesis de apertura solo al final del renglón, antes de una fórmula", () => {
    const p = el("p", [text("Con ("), inline("\\gcd(7, 40) = 1"), text(") y «"), inline("k"), text("»")]);
    rehypeTypography()(root([p]));
    expect(textos(p)).toEqual([`Con (${WJ}`, "\\gcd(7, 40) = 1", `${WJ}) y «${WJ}`, "k", `${WJ}»`]);
  });

  it("no toca el texto que sigue a una fórmula si no empieza con puntuación", () => {
    const p = el("p", [inline("k"), text(" es la clave")]);
    rehypeTypography()(root([p]));
    expect(textos(p)).toEqual(["k", " es la clave"]);
  });

  it("deja la fórmula de bloque y su contenido como estaban", () => {
    const tex = "\\Pr[M=m \\mid C=c] = \\Pr[M=m], \\text{Ej. 4}";
    const tree = root([display(tex), text(". Sigue")]);
    rehypeTypography()(tree);
    expect(textos(tree)).toEqual([tex, ". Sigue"]);
  });

  it("no entra en el código", () => {
    const pre = el("pre", [el("code", [text("Ej. 3, $x$.")])]);
    rehypeTypography()(root([pre]));
    expect(textos(pre)).toEqual(["Ej. 3, $x$."]);
  });

  it("deja los encabezados tal cual: su texto es el que leen el índice y las placas", () => {
    const h3 = el("h3", [text("Ejercicio 1")]);
    rehypeTypography()(root([h3]));
    expect(textos(h3)).toEqual(["Ejercicio 1"]);
  });

  it("envuelve la fórmula corta para que no se parta, y deja libre a la larga", () => {
    const corta = inline("a = b");
    const larga = inline("x".repeat(NOWRAP_MAX + 1));
    const p = el("p", [text("Sea "), corta, text(" y "), larga, text(".")]);
    rehypeTypography()(root([p]));
    const hijos = p.children ?? [];
    expect(hijos[1]?.tagName).toBe("span");
    expect(hijos[1]?.properties?.className).toEqual([NOWRAP_CLASS]);
    expect(hijos[1]?.children).toEqual([corta]);
    expect(hijos[3]).toBe(larga);
    /* La puntuación se ató antes de envolver: la coma sigue pegada a la fórmula. */
    expect(hijos[4]?.value).toBe(`${WJ}.`);
  });

  it("ata las abreviaturas a su número y nada más", () => {
    expect(atarAbreviaturas("el Ej. 3 de la Clase 5 y la Guía 4")).toBe(
      `el Ej.${NBSP}3 de la Clase${NBSP}5 y la Guía${NBSP}4`,
    );
    expect(atarAbreviaturas("Ej. de otra cosa, clase de hoy, 3 guías")).toBe("Ej. de otra cosa, clase de hoy, 3 guías");
  });
});
