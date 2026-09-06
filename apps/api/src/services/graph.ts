/**
 * Grafo de conexiones de una materia (N0-31).
 *
 * Los nodos son TODAS las páginas de la materia — las de contenido y las
 * fuentes citadas: el grafo muestra de dónde sale cada cosa, no solo el temario.
 * Las aristas y los grados salen de `page_links`, que el sync deja resuelta
 * (solo wikilinks cuyo destino existe, S-07), así que acá no hay que volver a
 * abrir ningún JSON.
 */
import { asc, eq } from "drizzle-orm";
import { divisionOf, type GraphData, type GraphEdge, type GraphNode } from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import { pageLinks, pages, type SubjectRow } from "../db/schema.js";
import { resolveConfig } from "./subjects.js";

export async function buildGraph(db: Db, subject: SubjectRow): Promise<GraphData> {
  const rows = await db
    .select({
      slug: pages.slug,
      title: pages.title,
      type: pages.type,
      division: pages.division,
      words: pages.words,
    })
    .from(pages)
    .where(eq(pages.subjectId, subject.id))
    .orderBy(asc(pages.slug));

  const edgeRows = await db
    .select({ from: pageLinks.fromSlug, to: pageLinks.toSlug })
    .from(pageLinks)
    .where(eq(pageLinks.subjectId, subject.id))
    .orderBy(asc(pageLinks.fromSlug), asc(pageLinks.toSlug));

  const outDegree = new Map<string, number>();
  const inDegree = new Map<string, number>();
  for (const edge of edgeRows) {
    outDegree.set(edge.from, (outDegree.get(edge.from) ?? 0) + 1);
    inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
  }

  // La división efectiva (declarada, «meta» o «otras») la decide el contrato,
  // igual que en el índice: así los filtros del grafo y del panel coinciden (N0-23).
  const config = resolveConfig(subject);

  const nodes: GraphNode[] = rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    type: row.type,
    division: divisionOf(config, row),
    words: row.words,
    inDegree: inDegree.get(row.slug) ?? 0,
    outDegree: outDegree.get(row.slug) ?? 0,
  }));

  const edges: GraphEdge[] = edgeRows.map((edge) => ({ from: edge.from, to: edge.to }));

  return { nodes, edges };
}
