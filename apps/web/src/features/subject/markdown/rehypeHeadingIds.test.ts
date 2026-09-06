/**
 * El plugin tiene un solo trabajo: que el id del encabezado en el DOM sea el
 * MISMO que `headingId` del contrato le puso a `Page.headings[].id`. Si estos
 * dos se separan, el índice de la página y los `[[pagina#ancla]]` del wiki
 * apuntan a anclas que no existen.
 */
import { describe, expect, it } from "vitest";
import { headingId } from "@sinapsis/contract";
import { headingText, rehypeHeadingIds } from "./rehypeHeadingIds";

interface Node {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
}

const text = (value: string): Node => ({ type: "text", value });

const el = (tagName: string, children: Node[], properties: Record<string, unknown> = {}): Node => ({
  type: "element",
  tagName,
  properties,
  children,
});

const root = (children: Node[]): Node => ({ type: "root", children });

function idsOf(tree: Node): Array<string | undefined> {
  const out: Array<string | undefined> = [];
  for (const child of tree.children ?? []) {
    if (child.type === "element") out.push(child.properties?.id as string | undefined);
  }
  return out;
}

describe("rehypeHeadingIds", () => {
  it("le pone a cada encabezado el id del contrato", () => {
    const tree = root([
      el("h2", [text("Función de densidad")]),
      el("h3", [text("Regla empírica")]),
      el("p", [text("Un párrafo cualquiera")]),
    ]);
    rehypeHeadingIds()(tree);
    expect(idsOf(tree)).toEqual([headingId("Función de densidad"), headingId("Regla empírica"), undefined]);
    expect(idsOf(tree)[0]).toBe("función-de-densidad");
  });

  it("toca h1..h6 y nada más", () => {
    const tree = root([
      el("h1", [text("Uno")]),
      el("h6", [text("Seis")]),
      el("div", [text("Ni ahí")]),
    ]);
    rehypeHeadingIds()(tree);
    expect(idsOf(tree)).toEqual(["uno", "seis", undefined]);
  });

  it("conserva las demás propiedades del encabezado", () => {
    const tree = root([el("h2", [text("Estandarización")], { className: ["destacado"] })]);
    rehypeHeadingIds()(tree);
    const h2 = tree.children?.[0];
    expect(h2?.properties).toEqual({ className: ["destacado"], id: "estandarización" });
  });

  it("junta el texto de los hijos, saltea la matemática y coincide con el compilador", () => {
    const heading = el("h2", [
      text("La normal "),
      el("em", [text("estándar")]),
      text(" "),
      el("span", [text("N(0,1)")], { className: ["math", "math-inline"] }),
    ]);
    expect(headingText(heading)).toBe("La normal estándar ");
    // el compilador ve el markdown crudo, con la fórmula entre $…$
    expect(headingId(headingText(heading))).toBe(headingId("La normal *estándar* $N(0,1)$"));
  });
});
