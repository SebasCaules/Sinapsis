/**
 * Grafo de conexiones de una materia (N0-31), calculado en el navegador con lo
 * que ya trae `subject.json`: los nodos son TODAS las páginas —las de contenido
 * y las fuentes citadas— y las aristas son los wikilinks que el compilador dejó
 * resueltos en `links` (solo los que apuntan a una página que existe, S-07).
 *
 * La división efectiva la decide el contrato (`divisionOf`), igual que el
 * índice: así los filtros del grafo y los del panel coinciden (N0-23).
 */
import {
  divisionOf,
  type GraphData,
  type GraphEdge,
  type GraphNode,
  type PageMeta,
  type SubjectConfigLoose,
} from "@sinapsis/contract";

export function buildGraph(
  config: Pick<SubjectConfigLoose, "divisions">,
  pages: readonly PageMeta[],
  links: readonly GraphEdge[],
): GraphData {
  const slugs = new Set(pages.map((page) => page.slug));

  /* Una arista hacia una página que ya no está dibujaría un nodo fantasma: el
     compilador no las emite, pero el archivo puede ser de una compilación vieja. */
  const edges: GraphEdge[] = links
    .filter((edge) => slugs.has(edge.from) && slugs.has(edge.to))
    .map((edge) => ({ from: edge.from, to: edge.to }))
    .sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to));

  const outDegree = new Map<string, number>();
  const inDegree = new Map<string, number>();
  for (const edge of edges) {
    outDegree.set(edge.from, (outDegree.get(edge.from) ?? 0) + 1);
    inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
  }

  const nodes: GraphNode[] = [...pages]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((page) => ({
      slug: page.slug,
      title: page.title,
      type: page.type,
      division: divisionOf(config, page),
      words: page.words,
      inDegree: inDegree.get(page.slug) ?? 0,
      outDegree: outDegree.get(page.slug) ?? 0,
    }));

  return { nodes, edges };
}
