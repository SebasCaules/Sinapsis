/**
 * El wikilink es el enlace del wiki: su destino tiene que salir de `routes` y su
 * ancla del MISMO `headingId` que el compilador le puso al encabezado, o
 * `[[pagina#Sección]]` apunta a un id que no existe en el DOM.
 *
 * Las dos formas que el baseline resuelve y este plugin dejaba crudas (§4-C):
 * `[[#ancla|texto]]` (salto dentro de la página) y una etiqueta con matemática,
 * que llega al árbol partida en varios hermanos porque `remark-math` corre en el
 * PARSER. Las dos van acá con su regresión.
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

/**
 * El árbol tal como lo deja `remark-math`: la matemática ya es un nodo aparte y
 * el texto queda partido a los costados. Es lo que este plugin recibe SIEMPRE,
 * sin importar el orden de los plugins (remark-math es extensión del parser).
 */
function runNodes(children: Node[], exists: (slug: string) => boolean = () => true): Node[] {
  const paragraph: Node = { type: "paragraph", children };
  const tree: Node = { type: "root", children: [paragraph] };
  remarkWikilinks({ subject: "proba", exists })(tree);
  return paragraph.children ?? [];
}

const text = (v: string): Node => ({ type: "text", value: v });
const math = (v: string): Node => ({ type: "inlineMath", value: v });
const flat = (nodes: Node[]): string =>
  nodes
    .map((n) => (n.type === "text" ? n.value : n.type === "inlineMath" ? `$${n.value}$` : flat(n.children ?? [])))
    .join("");

describe("parseWikilink", () => {
  it("parte destino, ancla y texto", () => {
    expect(parseWikilink("distribucion-normal#Estandarización|acá")).toEqual({
      slug: "distribucion-normal",
      anchor: "Estandarización",
      text: "acá",
    });
  });

  it("un ancla sin destino no tiene slug", () => {
    expect(parseWikilink("#Independencia|Independencia")).toEqual({
      slug: "",
      anchor: "Independencia",
      text: "Independencia",
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

  /* §4-C(a) */
  it("`[[#ancla|texto]]` salta dentro de la misma página, sin slug", () => {
    const nodes = run("ver [[#Independencia|Independencia]] arriba");
    const link = nodes.find((n) => n.type === "link");
    expect(link).toBeDefined();
    // el ancla pasa por el MISMO `headingId` del compilador (N0-22)
    expect(link?.url).toBe("#independencia");
    expect(link?.children?.[0]?.value).toBe("Independencia");
    expect(nodes.some((n) => n.type === "text" && n.value?.includes("[["))).toBe(false);
  });

  it("un ancla interna con acentos y separadores usa el id del compilador", () => {
    /* El ancla real de `formulario-maestro`: el encabezado es
       `## 6 · Normal estándar y estandarización` y el compilador le pone
       `6-normal-estándar-y-estandarización`. Los dos lados usan `headingId`, así
       que el enlace y el id del DOM no pueden separarse (N0-22). */
    const [link] = run("ver [[#6 · Normal estándar y estandarización|la normal]]").filter(
      (n) => n.type === "link",
    );
    expect(link?.url).toBe("#6-normal-estándar-y-estandarización");
  });

  it("una etiqueta con `]` adentro no corta el wikilink", () => {
    // `[[esperanza|$E[X]$]]` — 4 casos así en el wiki de Proba
    const nodes = runNodes([text("se resume con [[esperanza|"), math("E[X]"), text("]].")]);
    const link = nodes.find((n) => n.type === "link");
    expect(link?.url).toBe(routes.page("proba", "esperanza"));
    expect(link?.children?.[0]?.type).toBe("inlineMath");
    expect(flat(nodes)).toBe("se resume con $E[X]$.");
  });

  /* §4-C(b) */
  it("resuelve la etiqueta partida por `remark-math` y conserva la matemática", () => {
    const nodes = runNodes([
      text("→ [[distribucion-binomial|Binomial "),
      math("(n,p)"),
      text("]] y listo"),
    ]);
    const link = nodes.find((n) => n.type === "link");
    expect(link?.url).toBe(routes.page("proba", "distribucion-binomial"));
    // la matemática sigue siendo un nodo `inlineMath` DENTRO del enlace: se compone
    expect(link?.children?.map((c) => c.type)).toEqual(["text", "inlineMath"]);
    expect(link?.children?.[1]?.value).toBe("(n,p)");
    expect(flat(nodes)).toBe("→ Binomial $(n,p)$ y listo");
  });

  it("una etiqueta que ARRANCA con matemática también se arma entera", () => {
    const nodes = runNodes([text("ver [[esperanza|"), math("E[X]"), text(" de X]] fin")]);
    const link = nodes.find((n) => n.type === "link");
    expect(link?.children?.map((c) => c.type)).toEqual(["inlineMath", "text"]);
    expect(flat(nodes)).toBe("ver $E[X]$ de X fin");
  });

  /* La trampa del recorrido por padre: un `[[…]]` DENTRO de una fórmula no es un
     enlace, es un intervalo. Se comprueba con el `$[[a,b]]$` del enunciado y con
     el `]]` de `$E[E[X\mid Y]]$`, que sí aparece en el wiki de Proba (6 veces). */
  it("no toca los corchetes que viven dentro de una fórmula", () => {
    const nodes = runNodes([math("[[a,b]]"), text(" y [[distribucion-normal|la Normal]]")]);
    expect(nodes[0]?.type).toBe("inlineMath");
    expect(nodes[0]?.value).toBe("[[a,b]]");
    expect(nodes.filter((n) => n.type === "link")).toHaveLength(1);
  });

  it("un `]]` de la matemática no cierra un wikilink de al lado", () => {
    const nodes = runNodes([math("E[E[X\\mid Y]]"), text(" y [[distribucion-normal|N]]")]);
    expect(nodes[0]?.type).toBe("inlineMath");
    expect(nodes[0]?.value).toBe("E[E[X\\mid Y]]");
    const link = nodes.find((n) => n.type === "link");
    expect(link?.url).toBe(routes.page("proba", "distribucion-normal"));
  });

  it("un wikilink partido por un salto de línea blando se resuelve igual", () => {
    // `distribucion-pareto` y `parcialito-tp3y4` lo escriben así; el baseline los resuelve
    const [link] = run(
      "no tiene [[funcion-generadora-de-momentos|función generadora de\nmomentos]] útil",
    ).filter((n) => n.type === "link");
    expect(link?.url).toBe(routes.page("proba", "funcion-generadora-de-momentos"));
    expect(link?.children?.[0]?.value).toBe("función generadora de\nmomentos");
  });

  it("un `[[` sin cerrar no se come el resto del párrafo", () => {
    const largo = "x".repeat(400);
    const nodes = run(`abre [[sin-cerrar ${largo} y sigue`);
    expect(nodes.every((n) => n.type === "text")).toBe(true);
  });

  it("desescapa el separador de las celdas de tabla", () => {
    const [link] = run("| [[distribucion-normal\\|N]] |").filter((n) => n.type === "link");
    expect(link?.url).toBe(routes.page("proba", "distribucion-normal"));
    expect(link?.children?.[0]?.value).toBe("N");
  });

  it("no anida enlaces dentro de un enlace de verdad", () => {
    const link: Node = { type: "link", url: "/x", children: [text("ver [[distribucion-normal]]")] };
    const tree: Node = { type: "root", children: [{ type: "paragraph", children: [link] }] };
    remarkWikilinks({ subject: "proba", exists: () => true })(tree);
    expect(link.children?.[0]?.type).toBe("text");
    expect(link.children?.[0]?.value).toContain("[[");
  });

  it("un wikilink suelto no tapa al que vive dentro de `**negrita**`", () => {
    const strong: Node = { type: "strong", children: [text("[[esperanza|E]]")] };
    const nodes = runNodes([text("ver [[distribucion-normal|N]] y "), strong]);
    expect(nodes.filter((n) => n.type === "link")).toHaveLength(1);
    expect(strong.children?.[0]?.type).toBe("link");
  });
});
