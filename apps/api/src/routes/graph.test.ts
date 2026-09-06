/**
 * Grafo de conexiones (N0-31) sobre `page_links`, la tabla que llena el sync.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { GraphData, PageInput, SearchHit } from "@sinapsis/contract";
import { createHarness, type Harness } from "../test/harness.js";
import { demoPayload, linkedPages, pageApunte } from "../test/fixtures.js";

/** Página de contenido con una división que el config no declara (→ «otras»). */
const pageRara: PageInput = {
  ...pageApunte,
  slug: "pagina-rara",
  title: "Página rara",
  type: "concepto",
  division: "99",
  links: [],
};

describe("GET /api/subjects/:slug/graph", () => {
  let h: Harness;

  const graph = async (slug = "demo"): Promise<GraphData> =>
    (await (await h.request(`/api/subjects/${slug}/graph`)).json()) as GraphData;

  beforeAll(async () => {
    h = await createHarness();
    const res = await h.json(
      "PUT",
      "/api/subjects/demo/sync",
      demoPayload([...linkedPages(), pageApunte, pageRara]),
      { authorization: `Bearer ${h.env.SYNC_TOKEN}` },
    );
    expect(res.status).toBe(200);
    await h.login();
  });

  afterAll(() => h.close());

  it("exige sesión y 404 si la materia no existe", async () => {
    const anon = await createHarness();
    expect((await anon.request("/api/subjects/demo/graph")).status).toBe(401);
    anon.close();

    const res = await h.request("/api/subjects/no-existe/graph");
    expect(res.status).toBe(404);
    expect((await res.json()) as { error: string }).toEqual({ error: "La materia no existe" });
  });

  it("los nodos son todas las páginas: contenido y fuentes", async () => {
    const { nodes } = await graph();
    expect(nodes.map((n) => n.slug)).toEqual([
      "apunte-clase",
      "nodo-a",
      "nodo-b",
      "nodo-c",
      "nodo-d",
      "pagina-rara",
    ]);
    // `apunte-clase` es de tipo `fuente` y también es un nodo.
    expect(nodes.find((n) => n.slug === "apunte-clase")?.type).toBe("fuente");
    expect(nodes.find((n) => n.slug === "nodo-a")?.title).toBe("Nodo A");
    expect(nodes.find((n) => n.slug === "nodo-a")?.words).toBe(5);
  });

  it("la división de cada nodo es la efectiva del contrato (N0-23)", async () => {
    const { nodes } = await graph();
    expect(nodes.find((n) => n.slug === "nodo-a")?.division).toBe("1");
    // La división "99" no está declarada: cae en la sintética «otras».
    expect(nodes.find((n) => n.slug === "pagina-rara")?.division).toBe("otras");
  });

  it("las aristas salen de page_links y descartan los wikilinks rotos", async () => {
    const { edges } = await graph();
    expect(edges).toEqual([
      { from: "nodo-a", to: "nodo-b" },
      { from: "nodo-a", to: "nodo-c" },
      { from: "nodo-b", to: "nodo-c" },
      { from: "nodo-c", to: "nodo-d" },
      { from: "nodo-d", to: "nodo-a" },
    ]);
    // `nodo-d` también enlaza a "pagina-fantasma", que no existe.
    expect(edges.some((e) => e.to === "pagina-fantasma")).toBe(false);
  });

  it("los grados se calculan desde las aristas", async () => {
    const bySlug = new Map((await graph()).nodes.map((n) => [n.slug, n]));
    expect(bySlug.get("nodo-a")).toMatchObject({ inDegree: 1, outDegree: 2 });
    expect(bySlug.get("nodo-b")).toMatchObject({ inDegree: 1, outDegree: 1 });
    expect(bySlug.get("nodo-c")).toMatchObject({ inDegree: 2, outDegree: 1 });
    expect(bySlug.get("nodo-d")).toMatchObject({ inDegree: 1, outDegree: 1 });
    // Una página aislada existe en el grafo con grado 0.
    expect(bySlug.get("pagina-rara")).toMatchObject({ inDegree: 0, outDegree: 0 });
  });

  it("los backlinks del lector leen la misma tabla", async () => {
    const detail = (await (
      await h.request("/api/subjects/demo/pages/nodo-c")
    ).json()) as { backlinks: { slug: string }[] };
    expect(detail.backlinks.map((b) => b.slug)).toEqual(["nodo-a", "nodo-b"]);
  });

  it("la búsqueda sigue funcionando con el índice FTS externo (S-06)", async () => {
    const hits = (await (
      await h.request("/api/subjects/demo/search?q=nodo")
    ).json()) as SearchHit[];
    expect(hits.map((hit) => hit.slug)).toContain("nodo-a");
    expect(hits[0]?.snippet.length).toBeGreaterThan(0);
  });

  it("una materia sin páginas devuelve un grafo vacío", async () => {
    const creada = await h.json("POST", "/api/subjects", {
      slug: "vacia",
      name: "Materia vacía",
      code: "00.02",
      institution: "ITBA",
      semester: "2026-1C",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    });
    expect(creada.status).toBe(201);
    expect(await graph("vacia")).toEqual({ nodes: [], edges: [] });
  });
});
