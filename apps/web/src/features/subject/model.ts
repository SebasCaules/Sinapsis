/**
 * Modelo derivado de una materia: todo lo que el shell necesita saber para
 * dibujarse a partir de `SubjectDetail` (config + páginas + progreso).
 *
 * Es una capa PURA (sin React, sin DOM): se construye una vez por respuesta del
 * API y se memoriza. Las vistas solo leen de acá; ninguna vuelve a recorrer las
 * páginas por su cuenta.
 *
 * Reglas del contrato que implementa:
 *  - Orden de divisiones: `order` explícito, si falta el orden del array.
 *  - División sintética `meta` («Transversales») si hay páginas sin división.
 *  - Divisiones desconocidas (en páginas, no en el config) → grupo «Otras».
 *  - Secuencia pedagógica: `order` asc → orden del tipo en `pageTypes` → título.
 *  - Progreso: solo tipos con `countsAsContent !== false` (las fuentes no cuentan).
 *  - Rail: FIXED_RAIL + rail del config (SLOT) + FIXED_RAIL_TAIL, sin ítems rotos.
 */
import {
  DIVISION_NONE,
  FIXED_RAIL,
  FIXED_RAIL_TAIL,
  divisionColor,
  divisionLong,
  divisionShort,
  routes,
  type DivisionKey,
  type PageMeta,
  type PageTypeDef,
  type RailGroup,
  type RailItem,
  type SubjectConfig,
  type SubjectDetail,
} from "@sinapsis/contract";

/** Clave de la división sintética que recoge las divisiones no declaradas. */
export const OTHER_DIVISION = "otras";

export interface DivisionNode {
  key: string;
  name: string;
  kind: "numbered" | "extra";
  /** Rótulo corto: "U3", "Transv.", "Eval." */
  short: string;
  /** Rótulo largo: "Unidad 3 · Variables Aleatorias Discretas". */
  long: string;
  /** Rótulo del índice: "U3 · Variables Aleatorias Discretas". */
  label: string;
  /** Valor CSS listo para usar (var(--u3) o un hex del config). */
  color: string;
  /** null si viene del config; "meta"/"unknown" si la derivó la plataforma. */
  synthetic: "meta" | "unknown" | null;
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
  /** Todas las divisiones, en orden (incluye las que no tienen páginas). */
  divisions: DivisionNode[];
  /** Solo las divisiones con páginas: es lo que dibuja el índice. */
  visibleDivisions: DivisionNode[];
  divisionOf: (page: PageMeta) => string;
  division: (key: string) => DivisionNode | undefined;
  pagesByDivision: (key: string) => PageMeta[];
  contentPages: (key: string) => PageMeta[];
  /** Páginas de contenido de la división en orden pedagógico. */
  sequence: (key: string) => PageMeta[];
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
  type: (key: string) => PageTypeDef | undefined;
  typeLabel: (key: string) => string;
  railGroups: RailGroupView[];
}

const UNKNOWN_TYPE_ORDER = 9_999;

function orderedDivisions(cfg: SubjectConfig): SubjectConfig["divisions"] {
  return cfg.divisions
    .map((d, i) => ({ d, i }))
    .sort((a, b) => (a.d.order ?? a.i) - (b.d.order ?? b.i) || a.i - b.i)
    .map((x) => x.d);
}

function labelOf(short: string, name: string): string {
  return short && short !== name ? `${short} · ${name}` : name;
}

/** Construye el modelo. `dark` solo afecta a la escala paramétrica (N > 9 divisiones). */
export function buildSubjectModel(detail: SubjectDetail, dark = false): SubjectModel {
  const cfg = detail.config;
  const pages = detail.pages;
  const bySlug = new Map(pages.map((p) => [p.slug, p]));
  const studiedOrder = detail.studied.slice();
  const studied = new Set(studiedOrder);

  const declared = new Set(cfg.divisions.map((d) => d.key));
  const typeIndex = new Map(cfg.pageTypes.map((t, i) => [t.key, i]));
  const typeByKey = new Map(cfg.pageTypes.map((t) => [t.key, t]));

  const divisionOf = (page: PageMeta): string => {
    if (declared.has(page.division)) return page.division;
    if (page.division === DIVISION_NONE || !page.division) return DIVISION_NONE;
    return OTHER_DIVISION;
  };

  // --- divisiones -----------------------------------------------------------
  const nodes: DivisionNode[] = orderedDivisions(cfg).map((d) => {
    const short = divisionShort(cfg, d.key);
    return {
      key: d.key,
      name: d.name,
      kind: d.kind,
      short,
      long: divisionLong(cfg, d.key),
      label: labelOf(short, d.name),
      color: divisionColor(cfg, d.key, dark),
      synthetic: null,
    };
  });

  const usedKeys = new Set(pages.map(divisionOf));
  if (usedKeys.has(DIVISION_NONE) && !declared.has(DIVISION_NONE)) {
    nodes.push({
      key: DIVISION_NONE,
      name: "Transversales",
      kind: "extra",
      short: "Transv.",
      long: "Transversales (toda la materia)",
      label: "Transv. · Transversales",
      color: "var(--umeta)",
      synthetic: "meta",
    });
  }
  if (usedKeys.has(OTHER_DIVISION)) {
    nodes.push({
      key: OTHER_DIVISION,
      name: "Otras",
      kind: "extra",
      short: "Otras",
      long: "Otras (fuera del programa declarado)",
      label: "Otras",
      color: "var(--u0)",
      synthetic: "unknown",
    });
  }
  const nodeByKey = new Map(nodes.map((n) => [n.key, n]));

  // --- índices por división -------------------------------------------------
  const byDivision = new Map<string, PageMeta[]>(nodes.map((n) => [n.key, []]));
  for (const page of pages) {
    const key = divisionOf(page);
    const bucket = byDivision.get(key);
    if (bucket) bucket.push(page);
    else byDivision.set(key, [page]);
  }

  const isContent = (page: PageMeta): boolean => typeByKey.get(page.type)?.countsAsContent !== false;
  const orderOf = (page: PageMeta): number => page.order ?? Number.MAX_SAFE_INTEGER;
  const typePos = (page: PageMeta): number => typeIndex.get(page.type) ?? UNKNOWN_TYPE_ORDER;
  const compare = (a: PageMeta, b: PageMeta): number =>
    orderOf(a) - orderOf(b) || typePos(a) - typePos(b) || a.title.localeCompare(b.title, "es");

  const contentCache = new Map<string, PageMeta[]>();
  const sequenceCache = new Map<string, PageMeta[]>();
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

  const sequence = (key: string): PageMeta[] => {
    let out = sequenceCache.get(key);
    if (!out) {
      out = contentPages(key).slice().sort(compare);
      sequenceCache.set(key, out);
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
    return sequence(divisionOf(page)).findIndex((p) => p.slug === pageSlug) + 1;
  };

  const nextUnread = (): PageMeta | null => allSequence.find((p) => !studied.has(p.slug)) ?? null;

  const prevNext = (pageSlug: string): { prev: PageMeta | null; next: PageMeta | null } => {
    const page = bySlug.get(pageSlug);
    if (!page) return { prev: null, next: null };
    const seq = sequence(divisionOf(page));
    const i = seq.findIndex((p) => p.slug === pageSlug);
    if (i === -1) return { prev: null, next: null };
    return { prev: seq[i - 1] ?? null, next: seq[i + 1] ?? null };
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
      if (!isSafeExternalUrl(item.target)) return null;
      return { item, to: null, href: item.target, external: true };
    }
    if (item.kind === "tool") {
      return { item, to: routes.tool(cfg.slug, item.target), href: null, external: false };
    }
    // builtin
    if (item.target === "home") return { item, to: routes.subject(cfg.slug), href: null, external: false };
    if (item.target === "wiki") return { item, to: routes.wiki(cfg.slug), href: null, external: false };
    if (item.target === "graph") return { item, to: routes.graph(cfg.slug), href: null, external: false };
    return { item, to: routes.tool(cfg.slug, item.id), href: null, external: false };
  };

  const toGroup = (group: RailGroup, slot: boolean): RailGroupView | null => {
    const items = group.items.map(resolveItem).filter((x): x is RailItemView => x !== null);
    if (!items.length) return null;
    const color = group.color
      ? group.color.startsWith("--")
        ? `var(${group.color})`
        : group.color
      : "var(--primary)";
    return { id: group.id, label: group.label, color, slot, items };
  };

  const railGroups: RailGroupView[] = [
    ...FIXED_RAIL.map((g) => toGroup(g, false)),
    ...cfg.rail.map((g) => toGroup(g, true)),
    ...FIXED_RAIL_TAIL.map((g) => toGroup(g, false)),
  ].filter((g): g is RailGroupView => g !== null);

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
    divisionOf,
    division: (key: string) => nodeByKey.get(key),
    pagesByDivision,
    contentPages,
    sequence,
    typeBlocks,
    progress,
    progressTotal,
    allSequence,
    sourcesCount,
    positionOf,
    nextUnread,
    prevNext,
    reviewPages,
    type: (key: string) => typeByKey.get(key),
    typeLabel: (key: string) => typeByKey.get(key)?.label ?? key,
    railGroups,
  };
}

/** Número de dos cifras del índice ("01", "02", …, "12"). */
export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Clave de división que usa la URL para una página (normaliza las desconocidas). */
export function divisionKeyForUrl(model: SubjectModel, page: PageMeta): DivisionKey {
  return model.divisionOf(page);
}

/** true si la URL es http(s) o mailto (ningún otro esquema llega a un href). */
export function isSafeExternalUrl(url: string): boolean {
  return /^(https?:\/\/[^\s]+|mailto:[^\s]+)$/i.test(url);
}
