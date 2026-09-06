/**
 * El grafo dibuja en canvas, así que lo único que se puede probar de verdad es
 * su modelo: qué nodos sobreviven al filtro, qué aristas quedan y qué se resalta.
 */
import { describe, expect, it } from "vitest";
import { SubjectConfig, type GraphData, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { buildSubjectModel } from "../model";
import { CONTENT_ONLY_DEFAULT, EMPTY_FILTERS, HUB_COUNT, buildGraphModel, nodeRadius, type GraphFilters } from "./graphModel";

const config = SubjectConfig.parse(rawProbaConfig);

function meta(slug: string, type: string, division: string, title = slug, hub = false): PageMeta {
  return {
    slug,
    title,
    type,
    folder: type,
    division,
    summary: "",
    tags: [],
    sources: [],
    words: 100,
    ...(hub ? { hub: true } : {}),
  };
}

const pages: PageMeta[] = [
  meta("media", "concepto", "1", "Media aritmética"),
  meta("varianza", "concepto", "1", "Varianza"),
  meta("normal", "distribucion", "3", "Distribución Normal"),
  meta("teorica-01", "fuente", "1", "Teórica 01"),
  meta("suelta", "concepto", "77", "Página de otra división"),
];

const detail: SubjectDetail = { config, pages, studied: [], placeholder: false, lastSyncAt: null };
const model = buildSubjectModel(detail);

function node(slug: string, type: string, division: string, inDegree: number, outDegree: number) {
  const page = pages.find((p) => p.slug === slug);
  return { slug, title: page?.title ?? slug, type, division, words: 100, inDegree, outDegree };
}

const data: GraphData = {
  nodes: [
    node("media", "concepto", "1", 2, 1),
    node("varianza", "concepto", "1", 1, 2),
    node("normal", "distribucion", "3", 0, 1),
    node("teorica-01", "fuente", "1", 0, 0),
    node("suelta", "concepto", "77", 0, 0),
  ],
  edges: [
    { from: "varianza", to: "media" },
    { from: "normal", to: "media" },
    { from: "media", to: "varianza" },
    /* Arista a un nodo que no existe: nunca se dibuja. */
    { from: "media", to: "fantasma" },
  ],
};

const filters = (patch: Partial<GraphFilters> = {}): GraphFilters => ({ ...EMPTY_FILTERS, ...patch });

const slugs = (list: Array<{ slug: string }>) => list.map((n) => n.slug);

describe("sin filtros", () => {
  it("trae todos los nodos y descarta las aristas rotas", () => {
    const graph = buildGraphModel(data, model, filters());
    expect(graph.nodes).toHaveLength(5);
    expect(graph.total).toBe(5);
    expect(graph.hidden).toBe(0);
    /* `varianza → media` y `media → varianza` son UNA conexión, no dos. */
    expect(graph.edges).toHaveLength(2);
    expect(graph.edges.some((e) => e.to === "fantasma")).toBe(false);
  });

  it("le pega a cada nodo el color y el rótulo corto de su división", () => {
    const graph = buildGraphModel(data, model, filters());
    const media = graph.nodes.find((n) => n.slug === "media");
    expect(media?.divisionKey).toBe("1");
    expect(media?.divisionShort).toBe("U1");
    expect(media?.color).toBe("var(--u1)");
  });

  it("manda las divisiones no declaradas a «Otras»", () => {
    const graph = buildGraphModel(data, model, filters());
    expect(graph.nodes.find((n) => n.slug === "suelta")?.divisionKey).toBe("otras");
  });

  it("marca como fuente lo que no cuenta como contenido", () => {
    const graph = buildGraphModel(data, model, filters());
    expect(graph.nodes.find((n) => n.slug === "teorica-01")?.source).toBe(true);
    expect(graph.nodes.find((n) => n.slug === "media")?.source).toBe(false);
  });

  it("el radio crece con el grado y tiene tope", () => {
    expect(nodeRadius(0)).toBeLessThan(nodeRadius(4));
    expect(nodeRadius(4)).toBeLessThan(nodeRadius(30));
    expect(nodeRadius(100_000)).toBeLessThanOrEqual(19);
  });

  it("el grado es SIN dirección: entradas y salidas, sin repetir", () => {
    const graph = buildGraphModel(data, model, filters());
    const by = new Map(graph.nodes.map((n) => [n.slug, n]));
    /* media: vecinos varianza y normal (la ida y la vuelta con varianza no
       cuentan dos veces); normal solo enlaza a media. */
    expect(by.get("media")?.degree).toBe(2);
    expect(by.get("varianza")?.degree).toBe(1);
    expect(by.get("normal")?.degree).toBe(1);
    expect(by.get("teorica-01")?.degree).toBe(0);
  });

  it("el radio sale del grado, no de las entradas", () => {
    const graph = buildGraphModel(data, model, filters());
    const by = new Map(graph.nodes.map((n) => [n.slug, n]));
    /* `normal` no la cita nadie (inDegree 0) pero enlaza a `media`: en el
       baseline es un nodo con enlaces, no el mínimo. */
    expect(by.get("normal")?.inDegree).toBe(0);
    expect(by.get("normal")?.radius).toBeGreaterThan(by.get("teorica-01")?.radius ?? 0);
  });
});

describe("páginas meta", () => {
  const conMeta: GraphData = {
    nodes: [...data.nodes, node("indice", "meta", "meta", 0, 2)],
    edges: [...data.edges, { from: "indice", to: "media" }],
  };

  it("el índice del wiki no es parte del mapa", () => {
    const graph = buildGraphModel(conMeta, model, filters());
    expect(slugs(graph.nodes)).not.toContain("indice");
    /* El total sigue siendo el grafo completo: lo que baja es lo dibujado. */
    expect(graph.total).toBe(6);
    expect(graph.hidden).toBe(1);
    expect(graph.edges.some((e) => e.from === "indice" || e.to === "indice")).toBe(false);
  });

  it("entra solo si el filtro de tipo la pide por su nombre", () => {
    const graph = buildGraphModel(conMeta, model, filters({ types: ["meta"] }));
    expect(slugs(graph.nodes)).toEqual(["indice"]);
  });
});

describe("páginas troncales", () => {
  it("sin `hub: true` en la materia, son las de mayor grado (y nunca una fuente)", () => {
    const graph = buildGraphModel(data, model, filters());
    const hubs = graph.nodes.filter((n) => n.hub).map((n) => n.slug);
    expect(hubs).toContain("media");
    expect(hubs).not.toContain("teorica-01");
  });

  it("nunca marca más de HUB_COUNT y prefiere las de más grado", () => {
    /* Diez conceptos en cadena: el grado baja de la primera a la última. */
    const muchas: PageMeta[] = Array.from({ length: 10 }, (_, i) => meta(`c${i}`, "concepto", "1", `Concepto ${i}`));
    const modelo = buildSubjectModel({ config, pages: muchas, studied: [], placeholder: false, lastSyncAt: null });
    const nodos = muchas.map((p, i) => node(p.slug, "concepto", "1", i, 0));
    const aristas = muchas.flatMap((p, i) => muchas.slice(0, i).map((q) => ({ from: q.slug, to: p.slug })));
    const graph = buildGraphModel({ nodes: nodos, edges: aristas }, modelo, filters());
    const hubs = graph.nodes.filter((n) => n.hub);
    expect(hubs).toHaveLength(HUB_COUNT);
    /* La troncal es más grande que una llana del mismo grado no lo es. */
    const troncal = hubs[0];
    const llana = graph.nodes.find((n) => !n.hub);
    expect(troncal && llana ? troncal.radius > nodeRadius(troncal.degree) : false).toBe(true);
    expect(llana ? llana.radius === nodeRadius(llana.degree) : false).toBe(true);
  });

  it("si la materia declara `hub: true`, manda la declaración", () => {
    const declaradas: PageMeta[] = [
      meta("media", "concepto", "1", "Media aritmética"),
      meta("varianza", "concepto", "1", "Varianza"),
      meta("normal", "distribucion", "3", "Distribución Normal", true),
      meta("teorica-01", "fuente", "1", "Teórica 01"),
      meta("suelta", "concepto", "77", "Página de otra división"),
    ];
    const conHub = buildSubjectModel({ config, pages: declaradas, studied: [], placeholder: false, lastSyncAt: null });
    const graph = buildGraphModel(data, conHub, filters());
    expect(graph.nodes.filter((n) => n.hub).map((n) => n.slug)).toEqual(["normal"]);
  });
});

describe("filtros", () => {
  it("«solo contenido» deja fuera las fuentes", () => {
    const graph = buildGraphModel(data, model, filters({ contentOnly: true }));
    expect(slugs(graph.nodes)).not.toContain("teorica-01");
    expect(graph.hidden).toBe(1);
  });

  it("filtra por división y se lleva puestas las aristas que pierden una punta", () => {
    const graph = buildGraphModel(data, model, filters({ divisions: ["1"] }));
    expect(slugs(graph.nodes).sort()).toEqual(["media", "teorica-01", "varianza"]);
    /* normal → media desaparece: `normal` es de la U3. Queda media↔varianza. */
    expect(graph.edges).toHaveLength(1);
  });

  it("filtra por tipo, y varios tipos se suman", () => {
    expect(slugs(buildGraphModel(data, model, filters({ types: ["distribucion"] })).nodes)).toEqual(["normal"]);
    const dos = buildGraphModel(data, model, filters({ types: ["distribucion", "fuente"] }));
    expect(slugs(dos.nodes).sort()).toEqual(["normal", "teorica-01"]);
  });

  it("combina división y tipo", () => {
    const graph = buildGraphModel(data, model, filters({ divisions: ["1"], types: ["concepto"] }));
    expect(slugs(graph.nodes).sort()).toEqual(["media", "varianza"]);
  });
});

describe("búsqueda", () => {
  it("no filtra: resalta, y sin acentos ni mayúsculas", () => {
    const graph = buildGraphModel(data, model, filters({ query: "DISTRIBUCION" }));
    expect(graph.nodes).toHaveLength(5);
    expect(graph.matches).toBe(1);
    expect(graph.nodes.find((n) => n.slug === "normal")?.match).toBe(true);
    expect(graph.nodes.find((n) => n.slug === "media")?.match).toBe(false);
  });

  it("sin búsqueda no hay ninguna coincidencia marcada", () => {
    const graph = buildGraphModel(data, model, filters());
    expect(graph.matches).toBe(0);
    expect(graph.nodes.every((n) => !n.match)).toBe(true);
  });
});

describe("lista textual", () => {
  it("dice lo MISMO que el lienzo: todas las páginas dibujadas, ni una menos", () => {
    const graph = buildGraphModel(data, model, filters());
    const enLista = graph.alt.flatMap((g) => g.nodes.map((n) => n.slug));
    expect(enLista.sort()).toEqual(slugs(graph.nodes).sort());
  });

  it("agrupa por división en el orden del temario, con el rótulo del índice", () => {
    const graph = buildGraphModel(data, model, filters());
    expect(graph.alt.map((g) => g.key)).toEqual(["1", "3", "otras"]);
    expect(graph.alt[0]?.label).toContain("U1");
    /* Dentro del grupo, por título. */
    expect(graph.alt[0]?.nodes.map((n) => n.title)).toEqual(["Media aritmética", "Teórica 01", "Varianza"]);
  });

  it("«solo contenido» nace encendido y es lo que el grafo dibuja de entrada", () => {
    expect(CONTENT_ONLY_DEFAULT).toBe(true);
    const graph = buildGraphModel(data, model, filters({ contentOnly: CONTENT_ONLY_DEFAULT }));
    expect(slugs(graph.nodes)).not.toContain("teorica-01");
  });
});

describe("leyenda y tipos", () => {
  it("la leyenda solo lista divisiones presentes, en el orden del temario", () => {
    const graph = buildGraphModel(data, model, filters());
    expect(graph.legend.map((e) => e.key)).toEqual(["1", "3", "otras"]);
    expect(graph.legend.find((e) => e.key === "1")?.count).toBe(3);
  });

  it("los tipos se cuentan sobre el grafo COMPLETO (los chips no se mueven al filtrar)", () => {
    const graph = buildGraphModel(data, model, filters({ types: ["fuente"] }));
    expect(graph.types.map((t) => t.key).sort()).toEqual(["concepto", "distribucion", "fuente"]);
    expect(graph.types.find((t) => t.key === "concepto")?.count).toBe(3);
    expect(graph.types.find((t) => t.key === "fuente")?.content).toBe(false);
  });
});

describe("grafo vacío", () => {
  it("no se rompe sin nodos", () => {
    const graph = buildGraphModel({ nodes: [], edges: [] }, model, filters());
    expect(graph.nodes).toEqual([]);
    expect(graph.total).toBe(0);
    expect(graph.legend).toEqual([]);
  });
});
