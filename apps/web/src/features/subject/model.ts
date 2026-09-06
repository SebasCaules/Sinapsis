/**
 * Modelo derivado de una materia: todo lo que el shell necesita saber para
 * dibujarse a partir de `SubjectDetail` (config + páginas + progreso).
 *
 * Es una capa PURA (sin React, sin DOM): se construye una vez por respuesta del
 * API y se memoriza. Las vistas solo leen de acá; ninguna vuelve a recorrer las
 * páginas por su cuenta.
 *
 * Reglas del contrato que implementa (ninguna se reescribe acá):
 *  - Divisiones efectivas y sintéticas: `effectiveDivisions` + `divisionOf`.
 *  - Rótulos y color: `divisionShort` / `divisionLong` / `divisionColor`.
 *  - Secuencia pedagógica: `order` asc → orden del tipo en `pageTypes` → título.
 *  - Progreso: solo tipos con `countsAsContent !== false` (las fuentes no cuentan).
 *  - Rail: FIXED_RAIL + rail del config (SLOT) + FIXED_RAIL_TAIL, sin ítems rotos.
 */
import {
  FIXED_RAIL,
  FIXED_RAIL_TAIL,
  PAGE_TYPE_META,
  countsAsContent,
  cssColor,
  divisionColor,
  divisionLong,
  divisionOf as divisionOfContract,
  divisionShort,
  effectiveDivisions,
  isExternalUrl,
  routes,
  type BuiltinView,
  type DivisionDef,
  type DivisionKey,
  type PageMeta,
  type PageTypeDef,
  type RailGroup,
  type RailItem,
  type SubjectConfig,
  type SubjectDetail,
  typeColor,
} from "@sinapsis/contract";

/**
 * Una división lista para dibujar: la `DivisionDef` del contrato (declarada o
 * sintética) con sus rótulos y su color ya resueltos.
 */
export interface DivisionNode {
  key: DivisionKey;
  name: string;
  kind: DivisionDef["kind"];
  /** Rótulo corto: "U3", "Transv.", "Eval." */
  short: string;
  /** Rótulo largo: "Unidad 3 · Variables Aleatorias Discretas". */
  long: string;
  /** Rótulo del índice: "U3 · Variables Aleatorias Discretas". */
  label: string;
  /** Valor CSS listo para usar (var(--u3) o un hex del config). */
  color: string;
  /** true si la derivó la plataforma (Transversales / Otras): no cuenta como unidad. */
  synthetic: boolean;
}

export interface TypeBlock {
  type: PageTypeDef;
  pages: PageMeta[];
  count: number;
}

export interface Progress {
  done: number;
  total: number;
  /** 0..1; 0 cuando no hay páginas de contenido. */
  ratio: number;
}

export interface RailItemView {
  item: RailItem;
  /** Ruta interna del SPA (null si el ítem es un enlace externo). */
  to: string | null;
  /** URL externa (null si es interno). */
  href: string | null;
  external: boolean;
}

export interface RailGroupView {
  id: string;
  label: string;
  /** Valor CSS del color del grupo. */
  color: string;
  /** true en los grupos declarados por la materia (regiones 03 del contrato). */
  slot: boolean;
  items: RailItemView[];
}

export interface SubjectModel {
  slug: string;
  config: SubjectConfig;
  placeholder: boolean;
  lastSyncAt: string | null;
  pages: PageMeta[];
  bySlug: Map<string, PageMeta>;
  studied: Set<string>;
  /** Slugs estudiados en el orden que devolvió el API (el más viejo primero). */
  studiedOrder: string[];
  /** Todas las divisiones, en orden (declaradas + sintéticas, con o sin páginas). */
  divisions: DivisionNode[];
  /** Solo las divisiones con páginas: es lo que dibuja el índice. */
  visibleDivisions: DivisionNode[];
  /**
   * Cuántas divisiones DECLARA la materia. Es el número que muestra la landing
   * (`SubjectCard.divisionsCount`): las sintéticas se ven, pero no se cuentan.
   */
  divisionsCount: number;
  divisionOf: (page: PageMeta) => string;
  division: (key: string) => DivisionNode | undefined;
  pagesByDivision: (key: string) => PageMeta[];
  contentPages: (key: string) => PageMeta[];
  /** Las páginas de la división que NO cuentan como contenido (las fuentes). */
  sources: (key: string) => PageMeta[];
  /** ¿Esta página cuenta como contenido (progreso, numeración de lectura)? */
  isContent: (page: PageMeta) => boolean;
  /** Páginas de contenido de la división en orden pedagógico (el hub primero). */
  sequence: (key: string) => PageMeta[];
  /**
   * Página de panorama de la división: la que el wiki marca como `hub`
   * (frontmatter `hub: true`) o, si no hay ninguna, la primera de la secuencia
   * del primer tipo de contenido declarado (en Proba, el primer concepto).
   */
  overview: (key: string) => PageMeta | null;
  /**
   * División contigua entre las recorribles de punta a punta: las declaradas
   * (incluidas las `extra`) que tienen secuencia. Las sintéticas quedan afuera:
   * un cajón transversal no es la unidad siguiente de nadie.
   */
  adjacentDivision: (key: string, dir: -1 | 1) => DivisionNode | null;
  /** slug → posición 1..N dentro de la secuencia de la división (mapa memorizado). */
  positions: (key: string) => ReadonlyMap<string, number>;
  /** Bloques por tipo (en el orden de `pageTypes`) dentro de una división. */
  typeBlocks: (key: string) => TypeBlock[];
  progress: (key: string) => Progress;
  progressTotal: Progress;
  /** Secuencia global: divisiones en orden, páginas de contenido en orden. */
  allSequence: PageMeta[];
  /** Total de páginas que no cuentan como contenido (fuentes). */
  sourcesCount: number;
  /** Posición 1..N de la página dentro de la secuencia de su división (0 si no está). */
  positionOf: (pageSlug: string) => number;
  nextUnread: () => PageMeta | null;
  prevNext: (pageSlug: string) => { prev: PageMeta | null; next: PageMeta | null };
  /** Las tres para repasar: estudiadas hace más tiempo, o las tres primeras sin leer. */
  reviewPages: () => PageMeta[];
  typeLabel: (key: string) => string;
  /** Color del tipo de página (`typeColor` del contrato): segmentos de la barra de unidad, puntos de tipo. */
  typeColor: (key: string) => string;
  railGroups: RailGroupView[];
  /** El ítem del rail de una herramienta (`/t/:tool`) o de una vista builtin. */
  railItem: (key: string) => RailItemView | null;
  /** El botón flotante ya resuelto, o null si la materia no lo declara o está roto. */
  fab: RailItemView | null;
}

const UNKNOWN_TYPE_ORDER = 9_999;

/**
 * Vista builtin → ruta del contrato. Es la ÚNICA tabla que traduce un ítem
 * `builtin` del rail a una dirección: el rail, el fab y la paleta pasan todos
 * por acá, así que ninguna vista de la plataforma puede quedar colgada de
 * `/t/:tool` por olvido.
 */
const BUILTIN_ROUTES: Record<BuiltinView, (slug: string) => string> = {
  home: routes.subject,
  plan: routes.plan,
  kits: routes.kits,
  wiki: routes.wiki,
  graph: routes.graph,
  flashcards: routes.flashcards,
  quiz: routes.quiz,
  notes: routes.notes,
  favorites: routes.favorites,
};

function orderedDivisions(cfg: SubjectConfig): SubjectConfig["divisions"] {
  return cfg.divisions
    .map((d, i) => ({ d, i }))
    .sort((a, b) => (a.d.order ?? a.i) - (b.d.order ?? b.i) || a.i - b.i)
    .map((x) => x.d);
}

function labelOf(short: string, name: string): string {
  /* Una división `extra` no tiene rótulo corto propio: `divisionShort` devuelve
     el nombre recortado, y componerlo con el nombre entero tartamudea
     («Comple. · Complementos Matemáticos») y obliga a recortar en el panel de
     250 px. Si el corto es un prefijo del nombre, no aporta nada. */
  if (!short || short === name) return name;
  const stem = short.replace(/\.$/, "");
  if (name.startsWith(stem)) return name;
  return `${short} · ${name}`;
}

/** Construye el modelo. `dark` solo afecta a la escala paramétrica (N > 9 divisiones). */
export function buildSubjectModel(detail: SubjectDetail, dark = false): SubjectModel {
  // Los helpers del contrato (numeración, color) indexan por posición en
  // `divisions`: se les pasa la lista ya ordenada por `order` para que
  // rótulo, color y orden del índice coincidan.
  const cfg = { ...detail.config, divisions: orderedDivisions(detail.config) };
  const pages = detail.pages;
  const bySlug = new Map(pages.map((p) => [p.slug, p]));
  const studiedOrder = detail.studied.slice();
  const studied = new Set(studiedOrder);

  const typeIndex = new Map(cfg.pageTypes.map((t, i) => [t.key, i]));
  const typeByKey = new Map(cfg.pageTypes.map((t) => [t.key, t]));

  const divisionOf = (page: PageMeta): string => divisionOfContract(cfg, page);

  // --- divisiones -----------------------------------------------------------
  /* Las sintéticas («Transversales», «Otras») las decide el contrato: acá solo
     se les pegan los rótulos y el color, con la lista efectiva como índice para
     que la numeración U1…UN siga saliendo de las declaradas. */
  const effective = effectiveDivisions(cfg, pages);
  const labelCfg = { ...cfg, divisions: effective };
  const declaredKeys = new Set(cfg.divisions.map((d) => d.key));

  const nodes: DivisionNode[] = effective.map((d) => {
    const short = divisionShort(labelCfg, d.key);
    return {
      key: d.key,
      name: d.name,
      kind: d.kind,
      short,
      long: divisionLong(labelCfg, d.key),
      label: labelOf(short, d.name),
      color: divisionColor(labelCfg, d.key, dark),
      synthetic: !declaredKeys.has(d.key),
    };
  });
  const nodeByKey = new Map(nodes.map((n) => [n.key, n]));

  // --- índices por división -------------------------------------------------
  const byDivision = new Map<string, PageMeta[]>(nodes.map((n) => [n.key, []]));
  for (const page of pages) {
    const key = divisionOf(page);
    const bucket = byDivision.get(key);
    if (bucket) bucket.push(page);
    else byDivision.set(key, [page]);
  }

  /* `countsAsContent` es del contrato; acá solo se memoriza por tipo. */
  const contentByType = new Map<string, boolean>();
  const isContent = (page: PageMeta): boolean => {
    let flag = contentByType.get(page.type);
    if (flag === undefined) {
      flag = countsAsContent(cfg, page.type);
      contentByType.set(page.type, flag);
    }
    return flag;
  };

  const orderOf = (page: PageMeta): number => page.order ?? Number.MAX_SAFE_INTEGER;
  const typePos = (page: PageMeta): number => typeIndex.get(page.type) ?? UNKNOWN_TYPE_ORDER;
  const compare = (a: PageMeta, b: PageMeta): number =>
    orderOf(a) - orderOf(b) || typePos(a) - typePos(b) || a.title.localeCompare(b.title, "es");

  const contentCache = new Map<string, PageMeta[]>();
  const sourcesCache = new Map<string, PageMeta[]>();
  const sequenceCache = new Map<string, PageMeta[]>();
  const positionsCache = new Map<string, Map<string, number>>();
  const blocksCache = new Map<string, TypeBlock[]>();

  const pagesByDivision = (key: string): PageMeta[] => byDivision.get(key) ?? [];

  const contentPages = (key: string): PageMeta[] => {
    let out = contentCache.get(key);
    if (!out) {
      out = pagesByDivision(key).filter(isContent);
      contentCache.set(key, out);
    }
    return out;
  };

  /* Las fuentes no tienen orden pedagógico (no traen `order`): se listan por
     título, que es como se las busca en el estante. */
  const sources = (key: string): PageMeta[] => {
    let out = sourcesCache.get(key);
    if (!out) {
      out = pagesByDivision(key)
        .filter((p) => !isContent(p))
        .sort((a, b) => a.title.localeCompare(b.title, "es"));
      sourcesCache.set(key, out);
    }
    return out;
  };

  const sequence = (key: string): PageMeta[] => {
    let out = sequenceCache.get(key);
    if (!out) {
      out = contentPages(key).slice().sort(compare);
      /* El hub abre la división aunque su `order` no lo ponga primero: es el
         panorama, y leer la unidad empieza por él. */
      const at = out.findIndex((p) => p.hub);
      if (at > 0) out.unshift(out.splice(at, 1)[0] as PageMeta);
      sequenceCache.set(key, out);
    }
    return out;
  };

  /* Primer tipo de CONTENIDO declarado por la materia: el respaldo del panorama
     cuando ninguna página de la división se declara hub. */
  const firstContentType = cfg.pageTypes.find((t) => t.countsAsContent !== false)?.key;

  const overview = (key: string): PageMeta | null => {
    const seq = sequence(key);
    const hub = seq.find((p) => p.hub);
    if (hub) return hub;
    if (!firstContentType) return null;
    return seq.find((p) => p.type === firstContentType) ?? null;
  };

  /* El mapa de posiciones se arma UNA vez por división: el índice lo usa en cada
     fila y el lector en cada render. */
  const positions = (key: string): ReadonlyMap<string, number> => {
    let out = positionsCache.get(key);
    if (!out) {
      out = new Map(sequence(key).map((p, i) => [p.slug, i + 1]));
      positionsCache.set(key, out);
    }
    return out;
  };

  const typeBlocks = (key: string): TypeBlock[] => {
    let out = blocksCache.get(key);
    if (out) return out;
    const inDivision = pagesByDivision(key);
    out = [];
    for (const type of cfg.pageTypes) {
      const list = inDivision.filter((p) => p.type === type.key).sort(compare);
      if (list.length) out.push({ type, pages: list, count: list.length });
    }
    // tipos que aparecen en las páginas pero no están declarados en el config
    const seen = new Set(cfg.pageTypes.map((t) => t.key));
    for (const page of inDivision) {
      if (seen.has(page.type)) continue;
      seen.add(page.type);
      const list = inDivision.filter((p) => p.type === page.type).sort(compare);
      out.push({
        type: { key: page.type, label: page.type, plural: page.type, countsAsContent: true, collapsedByDefault: false },
        pages: list,
        count: list.length,
      });
    }
    blocksCache.set(key, out);
    return out;
  };

  const progressOf = (list: PageMeta[]): Progress => {
    const total = list.length;
    const done = list.reduce((n, p) => (studied.has(p.slug) ? n + 1 : n), 0);
    return { done, total, ratio: total ? done / total : 0 };
  };

  const progress = (key: string): Progress => progressOf(contentPages(key));

  const allSequence = nodes.flatMap((n) => sequence(n.key));
  const progressTotal = progressOf(allSequence);
  const sourcesCount = pages.length - allSequence.length;

  const positionOf = (pageSlug: string): number => {
    const page = bySlug.get(pageSlug);
    if (!page) return 0;
    return positions(divisionOf(page)).get(pageSlug) ?? 0;
  };

  const nextUnread = (): PageMeta | null => allSequence.find((p) => !studied.has(p.slug)) ?? null;

  const prevNext = (pageSlug: string): { prev: PageMeta | null; next: PageMeta | null } => {
    const page = bySlug.get(pageSlug);
    if (!page) return { prev: null, next: null };
    const key = divisionOf(page);
    const at = positions(key).get(pageSlug);
    if (at === undefined) return { prev: null, next: null };
    const seq = sequence(key);
    return { prev: seq[at - 2] ?? null, next: seq[at] ?? null };
  };

  /* La cadena de divisiones recorribles: las DECLARADAS con secuencia. Las
     sintéticas («Transversales», «Otras») se ven en el índice pero no encadenan:
     no son la división siguiente de nadie. */
  let chain: DivisionNode[] | null = null;
  const divisionChain = (): DivisionNode[] => {
    if (!chain) chain = nodes.filter((n) => !n.synthetic && sequence(n.key).length > 0);
    return chain;
  };

  const adjacentDivision = (key: string, dir: -1 | 1): DivisionNode | null => {
    const list = divisionChain();
    const i = list.findIndex((n) => n.key === key);
    if (i === -1) return null;
    return list[i + dir] ?? null;
  };

  /* El contrato RESERVA el tipo `meta` (índice y registro del wiki): una materia
     no lo puede declarar en `pageTypes`, así que el rótulo lo pone la plataforma
     en vez de caer en la clave cruda («META»). */
  const typeLabel = (key: string): string => {
    const declared = typeByKey.get(key)?.label;
    if (declared) return declared;
    return key === PAGE_TYPE_META ? "Wiki" : key;
  };

  const reviewPages = (): PageMeta[] => {
    const oldest = studiedOrder
      .map((slug) => bySlug.get(slug))
      .filter((p): p is PageMeta => !!p && isContent(p))
      .slice(0, 3);
    if (oldest.length) return oldest;
    return allSequence.filter((p) => !studied.has(p.slug)).slice(0, 3);
  };

  // --- rail -----------------------------------------------------------------
  const resolveItem = (item: RailItem): RailItemView | null => {
    if (item.kind === "page") {
      if (!bySlug.has(item.target)) return null;
      return { item, to: routes.page(cfg.slug, item.target), href: null, external: false };
    }
    if (item.kind === "link") {
      // Defensa en profundidad (el contrato ya lo exige): solo http(s)/mailto.
      if (!isExternalUrl(item.target)) return null;
      return { item, to: null, href: item.target, external: true };
    }
    if (item.kind === "tool") {
      return { item, to: routes.tool(cfg.slug, item.target), href: null, external: false };
    }
    // builtin: la tabla de arriba decide; lo que no está en ella cae en /t/:id
    // y lo atiende «Próximamente» (una materia puede declarar un builtin que
    // esta versión de la plataforma todavía no dibuja).
    const to = BUILTIN_ROUTES[item.target as BuiltinView];
    return {
      item,
      to: to ? to(cfg.slug) : routes.tool(cfg.slug, item.id),
      href: null,
      external: false,
    };
  };

  const toGroup = (group: RailGroup, slot: boolean): RailGroupView | null => {
    const items = group.items.map(resolveItem).filter((x): x is RailItemView => x !== null);
    if (!items.length) return null;
    return { id: group.id, label: group.label, color: cssColor(group.color, "var(--primary)"), slot, items };
  };

  const railGroups: RailGroupView[] = [
    ...FIXED_RAIL.map((g) => toGroup(g, false)),
    ...cfg.rail.map((g) => toGroup(g, true)),
    ...FIXED_RAIL_TAIL.map((g) => toGroup(g, false)),
  ].filter((g): g is RailGroupView => g !== null);

  const railItem = (key: string): RailItemView | null => {
    /* Los ítems `page` y `link` no tienen un `target` que se pueda nombrar desde
       fuera (es un slug o una URL entera): se los busca por su `id`, que es como
       los nombran los kits. La búsqueda por `target` manda igual, así que una
       herramienta NO se encuentra por su id (un kit que declare «calc» sigue
       abriendo la herramienta «calc», no un enlace que se llame así). */
    let byId: RailItemView | null = null;
    for (const group of railGroups) {
      for (const view of group.items) {
        const { item } = view;
        if (item.kind === "tool" && item.target === key) return view;
        if (item.kind === "builtin" && item.id === key) return view;
        if (!byId && (item.kind === "page" || item.kind === "link") && item.id === key) byId = view;
      }
    }
    return byId;
  };

  /* El fab pasa por el MISMO resolutor que el rail: una página inexistente o un
     enlace que no sea http(s)/mailto lo dejan en null y no se dibuja. */
  const fabDef = cfg.fab;
  const fab = fabDef
    ? resolveItem({
        id: "fab",
        label: fabDef.label,
        icon: fabDef.icon,
        kind: fabDef.kind,
        target: fabDef.target,
      })
    : null;

  return {
    slug: cfg.slug,
    config: cfg,
    placeholder: detail.placeholder,
    lastSyncAt: detail.lastSyncAt,
    pages,
    bySlug,
    studied,
    studiedOrder,
    divisions: nodes,
    visibleDivisions: nodes.filter((n) => pagesByDivision(n.key).length > 0),
    divisionsCount: cfg.divisions.length,
    divisionOf,
    division: (key: string) => nodeByKey.get(key),
    pagesByDivision,
    contentPages,
    sources,
    isContent,
    sequence,
    overview,
    adjacentDivision,
    positions,
    typeBlocks,
    progress,
    progressTotal,
    allSequence,
    sourcesCount,
    positionOf,
    nextUnread,
    prevNext,
    reviewPages,
    typeLabel,
    typeColor: (key: string) => typeColor(cfg, key),
    railGroups,
    railItem,
    fab,
  };
}

/** Número de dos cifras del índice ("01", "02", …, "12"). */
export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
