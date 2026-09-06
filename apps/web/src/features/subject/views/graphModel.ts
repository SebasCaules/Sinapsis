/**
 * Modelo del grafo de conexiones (N0-31): la parte con reglas, separada del
 * lienzo para poder probarla sin canvas ni simulación.
 *
 * `GET /api/subjects/:slug/graph` devuelve nodos y aristas crudos; acá se les
 * aplica el filtro (divisiones, tipos, «solo contenido», búsqueda) y se les pega
 * lo que el dibujo necesita: color de división, radio por grado de entrada, si
 * es fuente (se atenúa) y si coincide con la búsqueda (se resalta). Las aristas
 * que pierden una punta se caen: nunca se dibuja una línea a un nodo que no está.
 */
import type { GraphData, GraphNode } from "@sinapsis/contract";
import { fold } from "@sinapsis/contract";
import type { SubjectModel } from "../model";

export interface GraphFilters {
  /** Claves de división; vacío = todas. */
  divisions: string[];
  /** Claves de tipo de página; vacío = todos. */
  types: string[];
  /** Deja fuera los tipos con `countsAsContent: false` (las fuentes). */
  contentOnly: boolean;
  /** Búsqueda por título: no filtra, RESALTA (y cuenta las coincidencias). */
  query: string;
}

export const EMPTY_FILTERS: GraphFilters = { divisions: [], types: [], contentOnly: false, query: "" };

export interface GraphModelNode extends GraphNode {
  /** División efectiva (la declarada, «Transversales» u «Otras»). */
  divisionKey: string;
  /** Rótulo corto de la división: "U3". */
  divisionShort: string;
  /** Valor CSS del color de la división (se resuelve a un color real al dibujar). */
  color: string;
  /** Radio en unidades del lienzo, derivado del grado de entrada. */
  radius: number;
  /** true en los tipos que no cuentan como contenido: se dibujan atenuados. */
  source: boolean;
  /** true si el título coincide con la búsqueda. */
  match: boolean;
}

export interface GraphModelEdge {
  from: string;
  to: string;
}

export interface GraphLegendEntry {
  key: string;
  label: string;
  color: string;
  count: number;
}

export interface GraphModel {
  nodes: GraphModelNode[];
  edges: GraphModelEdge[];
  /** Nodos del grafo completo (antes de filtrar). */
  total: number;
  /** Cuántos dejó fuera el filtro. */
  hidden: number;
  /** Cuántos de los visibles resalta la búsqueda (0 si no hay búsqueda). */
  matches: number;
  /** Divisiones presentes entre los nodos visibles, en el orden del temario. */
  legend: GraphLegendEntry[];
  /** Tipos presentes en el grafo COMPLETO, para dibujar los chips del filtro. */
  types: Array<{ key: string; label: string; count: number; content: boolean }>;
}

const R_MIN = 4.5;
const R_MAX = 19;

/**
 * Radio por grado de entrada: raíz cuadrada (el área crece con el grado, no el
 * radio, que es lo que el ojo compara) y tope, para que un nodo muy citado no
 * se coma la pantalla.
 */
export function nodeRadius(inDegree: number): number {
  return Math.min(R_MAX, R_MIN + Math.sqrt(Math.max(0, inDegree)) * 3.4);
}

/**
 * Aplica los filtros y prepara los nodos para el lienzo.
 *
 * Recibe el `SubjectModel` además de los datos crudos porque el color, el
 * rótulo corto y «qué cuenta como contenido» son reglas del contrato que ya
 * viven ahí: el grafo no puede tener su propia idea de ninguna de las tres.
 */
export function buildGraphModel(data: GraphData, model: SubjectModel, filters: GraphFilters): GraphModel {
  const needle = fold(filters.query.trim());
  const divisions = new Set(filters.divisions);
  const types = new Set(filters.types);

  const typeCounts = new Map<string, number>();
  for (const node of data.nodes) typeCounts.set(node.type, (typeCounts.get(node.type) ?? 0) + 1);

  const nodes: GraphModelNode[] = [];
  for (const node of data.nodes) {
    const page = model.bySlug.get(node.slug);
    const key = page ? model.divisionOf(page) : node.division;
    const division = model.division(key);
    const isSource = page ? !model.isContent(page) : false;

    if (filters.contentOnly && isSource) continue;
    if (divisions.size && !divisions.has(key)) continue;
    if (types.size && !types.has(node.type)) continue;

    nodes.push({
      ...node,
      divisionKey: key,
      divisionShort: division?.short ?? key,
      color: division?.color ?? "var(--u0)",
      radius: nodeRadius(node.inDegree),
      source: isSource,
      match: needle.length > 0 && fold(node.title).includes(needle),
    });
  }

  /* Una arista solo existe si sus dos puntas sobrevivieron al filtro. */
  const visible = new Set(nodes.map((n) => n.slug));
  const edges = data.edges.filter((e) => e.from !== e.to && visible.has(e.from) && visible.has(e.to));

  const counts = new Map<string, number>();
  for (const node of nodes) counts.set(node.divisionKey, (counts.get(node.divisionKey) ?? 0) + 1);
  const legend: GraphLegendEntry[] = model.divisions
    .filter((d) => counts.has(d.key))
    .map((d) => ({ key: d.key, label: d.short, color: d.color, count: counts.get(d.key) ?? 0 }));

  const typeList = [...typeCounts.entries()]
    .map(([key, count]) => ({
      key,
      label: model.typeLabel(key),
      count,
      content: model.config.pageTypes.find((t) => t.key === key)?.countsAsContent !== false,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"));

  return {
    nodes,
    edges,
    total: data.nodes.length,
    hidden: data.nodes.length - nodes.length,
    matches: needle ? nodes.filter((n) => n.match).length : 0,
    legend,
    types: typeList,
  };
}
