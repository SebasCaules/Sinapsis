/**
 * El wikilink es el enlace del wiki: su destino tiene que salir de `routes` y su
 * ancla del MISMO `headingId` que el compilador le puso al encabezado, o
 * `[[pagina#Sección]]` apunta a un id que no existe en el DOM.
 */
import { describe, expect, it } from "vitest";
import { routes } from "@sinapsis/contract";
import { parseWikilink, remarkWikilinks } from "./remarkWikilinks";

interface Node {
  type: string;
  value?: string;
  url?: string;
  children?: Node[];
  data?: Record<string, unknown>;
}

function run(text: string, exists: (slug: string) => boolean = () => true): Node[] {
  const paragraph: Node = { type: "paragraph", children: [{ type: "text", value: text }] };
  const tree: Node = { type: "root", children: [paragraph] };
  remarkWikilinks({ subject: "proba", exists })(tree);
  return paragraph.children ?? [];
}

describe("parseWikilink", () => {
  it("parte destino, ancla y texto", () => {
    expect(parseWikilink("distribucion-normal#Estandarización|acá")).toEqual({
      slug: "distribucion-normal",
      anchor: "Estandarización",
      text: "acá",
    });
  });
});

describe("remarkWikilinks", () => {
  it("arma el href con las rutas del contrato", () => {
    const [link] = run("ver [[distribucion-normal]]").filter((n) => n.type === "link");
    expect(link?.url).toBe(routes.page("proba", "distribucion-normal"));
  });

  it("normaliza el ancla con el criterio del compilador", () => {
    const [link] = run("ver [[distribucion-normal#Estandarización|acá]]").filter((n) => n.type === "link");
    expect(link?.url).toBe(`${routes.page("proba", "distribucion-normal")}#estandarización`);
    expect(link?.children?.[0]?.value).toBe("acá");
  });

  it("marca como roto el enlace a una página que no existe", () => {
    const nodes = run("ver [[pagina-fantasma]]", () => false);
    expect(nodes.some((n) => n.type === "wikilinkBroken")).toBe(true);
    expect(nodes.some((n) => n.type === "link")).toBe(false);
  });
});
