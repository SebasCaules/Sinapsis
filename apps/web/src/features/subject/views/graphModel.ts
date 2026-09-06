/**
 * Modelo del grafo de conexiones (N0-31): la parte con reglas, separada del
 * lienzo para poder probarla sin canvas ni simulación.
 *
 * `api.subject.graph(slug)` devuelve nodos y aristas crudos; acá se les
 * aplica el filtro (divisiones, tipos, «solo contenido», búsqueda) y se les pega
 * lo que el dibujo necesita: color de división, radio por grado, si es fuente
 * (se atenúa), si es troncal (hub) y si coincide con la búsqueda (se resalta).
 * Las aristas que pierden una punta se caen: nunca se dibuja una línea a un nodo
 * que no está.
 *
 * Dos reglas heredadas del baseline y verificadas contra él:
 *  - Las aristas son SIN DIRECCIÓN: dos páginas que se enlazan mutuamente son
 *    una sola conexión, no dos (si no, el resorte del enlace tira doble y el
 *    contador miente).
 *  - Las páginas índice/registro del wiki (`type: "meta"`) no son parte del
 *    mapa: son el índice del wiki, no un tema. Solo aparecen si el filtro de
 *    tipo las pide por su nombre.
 */
import type { GraphData, GraphNode } from "@sinapsis/contract";
import { PAGE_TYPE_META, fold } from "@sinapsis/contract";
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

/**
 * «Solo contenido» nace ENCENDIDO, como el «Solo temas» del baseline: el grafo
 * es el mapa del temario y con las fuentes adentro son doscientos nodos en bola
 * en vez de noventa y cinco legibles. La vista lo apaga con `c=0` en la URL.
 */
export const CONTENT_ONLY_DEFAULT = true;

/** Cuántas páginas troncales se marcan cuando la materia no declara ninguna. */
export const HUB_COUNT = 6;

export interface GraphModelNode extends GraphNode {
  /** División efectiva (la declarada, «Transversales» u «Otras»). */
  divisionKey: string;
  /** Rótulo corto de la división: "U3". */
  divisionShort: string;
  /** Valor CSS del color de la división (se resuelve a un color real al dibujar). */
  color: string;
  /** Vecinos distintos dentro del grafo dibujado (entradas + salidas, sin repetir). */
  degree: number;
  /** Radio en unidades del lienzo, derivado del grado. */
  radius: number;
  /** true en los tipos que no cuentan como contenido: se dibujan atenuados. */
  source: boolean;
  /**
   * Página troncal: la que sirve de punto de orientación. Sale de `hub: true`
   * en el frontmatter y, si la materia no marca ninguna, de las de mayor grado.
   */
  hub: boolean;
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

/** Un bloque de la lista textual: una división y sus páginas, ya ordenadas. */
export interface GraphAltGroup {
  key: string;
  /** "U3 · Variables Aleatorias Discretas". */
  label: string;
  color: string;
  nodes: GraphModelNode[];
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
  /** Lo mismo que el lienzo, en texto: todas las páginas agrupadas por división. */
  alt: GraphAltGroup[];
  /** Tipos presentes en el grafo COMPLETO, para dibujar los chips del filtro. */
  types: Array<{ key: string; label: string; count: number; content: boolean }>;
}

const R_MIN = 4;
const R_SPAN = 14;
/** Lo que crece el radio de una página troncal: se distingue en reposo. */
export const HUB_BONUS = 2;

/**
 * Radio por grado (vecinos distintos): raíz cuadrada —el área crece con el
 * grado, no el radio, que es lo que el ojo compara— y tope, para que un nodo
 * muy citado no se coma la pantalla. Es la fórmula del baseline: el tamaño
 * mide CUÁNTOS ENLACES TIENE la página, no cuántas la citan.
 */
export function nodeRadius(degree: number): number {
  return R_MIN + Math.min(R_SPAN, Math.sqrt(Math.max(0, degree)) * 2.4);
}

/** Clave de una arista sin dirección: `a|b` con las puntas ordenadas. */
function edgeKey(from: string, to: string): string {
  return from < to ? `${from}|${to}` : `${to}|${from}`;
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
  /* Las páginas meta solo entran si el filtro de tipo las nombra. */
  const wantsMeta = types.has(PAGE_TYPE_META);

  const typeCounts = new Map<string, number>();
  for (const node of data.nodes) typeCounts.set(node.type, (typeCounts.get(node.type) ?? 0) + 1);

  /* 1) qué nodos sobreviven al filtro. El radio todavía no: depende del grado
        dentro del subgrafo dibujado, que recién se conoce con las aristas. */
  interface Kept {
    node: GraphNode;
    divisionKey: string;
    divisionShort: string;
    color: string;
    source: boolean;
    declaredHub: boolean;
  }
  const kept: Kept[] = [];
  for (const node of data.nodes) {
    if (node.type === PAGE_TYPE_META && !wantsMeta) continue;
    const page = model.bySlug.get(node.slug);
    const key = page ? model.divisionOf(page) : node.division;
    const division = model.division(key);
    const isSource = page ? !model.isContent(page) : false;

    if (filters.contentOnly && isSource) continue;
    if (divisions.size && !divisions.has(key)) continue;
    if (types.size && !types.has(node.type)) continue;

    kept.push({
      node,
      divisionKey: key,
      divisionShort: division?.short ?? key,
      color: division?.color ?? "var(--u0)",
      source: isSource,
      declaredHub: page?.hub === true,
    });
  }

  /* 2) aristas: sin dirección, sin lazos y solo entre nodos que sobrevivieron. */
  const visible = new Set(kept.map((k) => k.node.slug));
  const seen = new Set<string>();
  const edges: GraphModelEdge[] = [];
  const degree = new Map<string, number>();
  for (const edge of data.edges) {
    if (edge.from === edge.to) continue;
    if (!visible.has(edge.from) || !visible.has(edge.to)) continue;
    const key = edgeKey(edge.from, edge.to);
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push({ from: edge.from, to: edge.to });
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }

  /* 3) páginas troncales: las que la materia declara (`hub: true`) o, si no
        declara ninguna, las de mayor grado entre las de contenido. */
  const hubs = new Set(kept.filter((k) => k.declaredHub).map((k) => k.node.slug));
  if (hubs.size === 0) {
    const byDegree = kept
      .filter((k) => !k.source)
      .sort(
        (a, b) =>
          (degree.get(b.node.slug) ?? 0) - (degree.get(a.node.slug) ?? 0) ||
          a.node.title.localeCompare(b.node.title, "es"),
      );
    for (const k of byDegree.slice(0, HUB_COUNT)) hubs.add(k.node.slug);
  }

  const nodes: GraphModelNode[] = kept.map((k) => {
    const deg = degree.get(k.node.slug) ?? 0;
    const hub = hubs.has(k.node.slug);
    return {
      ...k.node,
      divisionKey: k.divisionKey,
      divisionShort: k.divisionShort,
      color: k.color,
      degree: deg,
      radius: nodeRadius(deg) + (hub ? HUB_BONUS : 0),
      source: k.source,
      hub,
      match: needle.length > 0 && fold(k.node.title).includes(needle),
    };
  });

  const counts = new Map<string, number>();
  for (const node of nodes) counts.set(node.divisionKey, (counts.get(node.divisionKey) ?? 0) + 1);
  const legend: GraphLegendEntry[] = model.divisions
    .filter((d) => counts.has(d.key))
    .map((d) => ({ key: d.key, label: d.short, color: d.color, count: counts.get(d.key) ?? 0 }));

  /* El equivalente textual del lienzo: TODAS las páginas dibujadas, agrupadas
     por división en el orden del temario y ordenadas por título dentro de cada
     grupo (el lienzo no tiene orden que copiar). */
  const byDivision = new Map<string, GraphModelNode[]>();
  for (const node of nodes) {
    const list = byDivision.get(node.divisionKey);
    if (list) list.push(node);
    else byDivision.set(node.divisionKey, [node]);
  }
  const alt: GraphAltGroup[] = model.divisions
    .filter((d) => byDivision.has(d.key))
    .map((d) => ({
      key: d.key,
      label: d.label,
      color: d.color,
      nodes: (byDivision.get(d.key) ?? []).slice().sort((a, b) => a.title.localeCompare(b.title, "es")),
    }));

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
    alt,
    types: typeList,
  };
}
