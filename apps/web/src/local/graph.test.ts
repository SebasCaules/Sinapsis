/**
 * El grafo de la materia: nodos ordenados, grados y división efectiva. Es lo que
 * calculaba `services/graph.ts` en el API, ahora con `subject.json` en la mano.
 */
import { describe, expect, it } from "vitest";
import type { GraphEdge, PageMeta, SubjectConfigLoose } from "@sinapsis/contract";
import { buildGraph } from "./graph";

const config = {
  divisions: [
    { key: "u1", name: "Unidad 1", kind: "numbered" },
    { key: "u2", name: "Unidad 2", kind: "numbered" },
  ],
} as unknown as SubjectConfigLoose;

function page(slug: string, division: string, words = 100): PageMeta {
  return {
    slug,
    title: slug.toUpperCase(),
    type: "tema",
    folder: "temas",
    division,
    summary: "",
    tags: [],
    sources: [],
    words,
  };
}

const pages: PageMeta[] = [page("beta", "u2"), page("alfa", "u1"), page("gamma", "u9"), page("delta", "meta")];
const links: GraphEdge[] = [
  { from: "beta", to: "alfa" },
  { from: "gamma", to: "alfa" },
  { from: "alfa", to: "beta" },
  { from: "beta", to: "fantasma" },
];

describe("buildGraph", () => {
  const graph = buildGraph(config, pages, links);

  it("un nodo por página, ordenados por slug", () => {
    expect(graph.nodes.map((n) => n.slug)).toEqual(["alfa", "beta", "delta", "gamma"]);
  });

  it("descarta las aristas hacia páginas que ya no están", () => {
    expect(graph.edges).toEqual([
      { from: "alfa", to: "beta" },
      { from: "beta", to: "alfa" },
      { from: "gamma", to: "alfa" },
    ]);
  });

  it("cuenta los grados de entrada y de salida", () => {
    const alfa = graph.nodes.find((n) => n.slug === "alfa");
    expect(alfa?.inDegree).toBe(2);
    expect(alfa?.outDegree).toBe(1);
    expect(graph.nodes.find((n) => n.slug === "delta")?.inDegree).toBe(0);
  });

  it("la división es la EFECTIVA: la no declarada cae en «otras» y la vacía en «meta»", () => {
    const bySlug = new Map(graph.nodes.map((n) => [n.slug, n.division]));
    expect(bySlug.get("alfa")).toBe("u1");
    expect(bySlug.get("gamma")).toBe("otras");
    expect(bySlug.get("delta")).toBe("meta");
  });
});
