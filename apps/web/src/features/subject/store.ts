/**
 * Estado de UI del shell de materia (zustand).
 *
 *  - `openDivisions`: qué divisiones están desplegadas en el índice, POR MATERIA,
 *    persistido en localStorage con `LS_KEYS.openDivisions(slug)`.
 *  - `collapsedTypes`: qué bloques de tipo están plegados dentro de una división
 *    (los tipos con `collapsedByDefault` nacen plegados). Solo en memoria.
 *  - `tabs`: las pestañas de la cabecera (N0-29), por materia, persistidas en
 *    `LS_KEYS.tabs(slug)`. Viven en su propio store: cambian en cada navegación
 *    y no tienen por qué redibujar el índice.
 *  - `planTrack`: la modalidad de plan elegida (N0-43), POR MATERIA, persistida
 *    en `sinapsis.<slug>.planTrack`. Vive acá y no en la vista porque el modelo
 *    de estudio la necesita para contar el progreso y decir «lo próximo».
 *  - `compact`: el índice plegado. NO es estado propio de la materia: se comparte
 *    con la plataforma (`LS_KEYS.sidebarCompact` + clase `sb-compact` en <html>),
 *    así que este módulo lo delega en el store de UI de la plataforma y es el
 *    único punto de contacto con él.
 */
import { create } from "zustand";
import { LS_KEYS, routes, type ThemeId } from "@sinapsis/contract";
import { readJson, useUiStore, writeJson } from "@/lib/store";

function readOpen(slug: string): string[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.openDivisions(slug));
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeOpen(slug: string, keys: string[]): void {
  try {
    localStorage.setItem(LS_KEYS.openDivisions(slug), JSON.stringify(keys));
  } catch {
    /* modo privado o cuota llena: la preferencia se pierde, la app sigue */
  }
}

/**
 * Clave de la modalidad de plan elegida. Sigue la forma de `LS_KEYS` del
 * contrato (`sinapsis.<materia>.<preferencia>`) sin agregarle una entrada: es
 * una preferencia solo de la web y no viaja por ningún contrato.
 */
export function planTrackKey(subject: string): string {
  return `sinapsis.${subject}.planTrack`;
}

function readPlanTrack(slug: string): string | null {
  try {
    const raw = localStorage.getItem(planTrackKey(slug));
    return raw && raw.length <= 120 ? raw : null;
  } catch {
    return null;
  }
}

function writePlanTrack(slug: string, id: string): void {
  try {
    localStorage.setItem(planTrackKey(slug), id);
  } catch {
    /* modo privado o cuota llena: la preferencia se pierde, la app sigue */
  }
}

/** Cache de la primera lectura: mantiene estable la referencia del array vacío. */
const initialCache = new Map<string, string[]>();
function initialOpen(slug: string): string[] {
  let cached = initialCache.get(slug);
  if (!cached) {
    cached = readOpen(slug);
    initialCache.set(slug, cached);
  }
  return cached;
}

export interface SubjectUiState {
  open: Record<string, string[]>;
  /** Modalidad de plan elegida por materia (null = la primera del plan). */
  planTracks: Record<string, string | null>;
  /** Estado explícito por bloque: true plegado, false desplegado; ausente = `collapsedByDefault`. */
  collapsedTypes: Record<string, boolean>;
  toggleDivision: (slug: string, key: string) => void;
  /** Abre la división (idempotente): la usa la navegación a una página. */
  openDivision: (slug: string, key: string) => void;
  toggleType: (slug: string, division: string, type: string, byDefault: boolean) => void;
  setPlanTrack: (slug: string, trackId: string) => void;
}

const typeId = (slug: string, division: string, type: string): string => `${slug}/${division}/${type}`;

export const useSubjectUiStore = create<SubjectUiState>((set, get) => ({
  open: {},
  planTracks: {},
  collapsedTypes: {},

  toggleDivision: (slug, key) => {
    const current = get().open[slug] ?? initialOpen(slug);
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    writeOpen(slug, next);
    set((s) => ({ open: { ...s.open, [slug]: next } }));
  },

  openDivision: (slug, key) => {
    const current = get().open[slug] ?? initialOpen(slug);
    if (current.includes(key)) return;
    const next = [...current, key];
    writeOpen(slug, next);
    set((s) => ({ open: { ...s.open, [slug]: next } }));
  },

  setPlanTrack: (slug, trackId) => {
    writePlanTrack(slug, trackId);
    set((s) => ({ planTracks: { ...s.planTracks, [slug]: trackId } }));
  },

  toggleType: (slug, division, type, byDefault) => {
    const id = typeId(slug, division, type);
    set((s) => {
      const effective = s.collapsedTypes[id] ?? byDefault;
      return { collapsedTypes: { ...s.collapsedTypes, [id]: !effective } };
    });
  },
}));

/** Divisiones abiertas de una materia (referencia estable entre renders). */
export function useOpenDivisions(slug: string): string[] {
  return useSubjectUiStore((s) => s.open[slug] ?? initialOpen(slug));
}

/**
 * La modalidad de plan elegida para esta materia (null: todavía no eligió, o el
 * plan no tiene modalidades). Quien la resuelve contra el plan real es
 * `resolveTrack` del modelo de estudio: acá solo se recuerda el id.
 */
export function usePlanTrack(slug: string): string | null {
  return useSubjectUiStore((s) => {
    const chosen = s.planTracks[slug];
    return chosen === undefined ? initialPlanTrack(slug) : chosen;
  });
}

const planTrackCache = new Map<string, string | null>();
function initialPlanTrack(slug: string): string | null {
  if (!planTrackCache.has(slug)) planTrackCache.set(slug, readPlanTrack(slug));
  return planTrackCache.get(slug) ?? null;
}

/** ¿Está plegado este bloque de tipo? `byDefault` viene de `collapsedByDefault`. */
export function useTypeCollapsed(slug: string, division: string, type: string, byDefault: boolean): boolean {
  const flag = useSubjectUiStore((s) => s.collapsedTypes[typeId(slug, division, type)]);
  return flag === undefined ? byDefault : flag;
}

/** El índice plegado, compartido con la plataforma. */
export function useCompact(): { compact: boolean; toggle: () => void } {
  const compact = useUiStore((s) => s.sidebarCompact);
  const toggle = useUiStore((s) => s.toggleSidebarCompact);
  return { compact, toggle };
}

/** Tema activo, para la escala de color paramétrica (más de 9 divisiones). */
export function useIsDark(): boolean {
  return useUiStore((s) => s.theme === "claustro");
}

/**
 * El tema, tal cual. Lo usa el grafo, que dibuja en canvas y por lo tanto tiene
 * que releer los tokens de color con `getComputedStyle` cada vez que cambian.
 */
export function useTheme(): ThemeId {
  return useUiStore((s) => s.theme);
}

// ---------------------------------------------------------------------------
// Pestañas múltiples (N0-29) — estado de sesión de lectura, solo en el cliente
// ---------------------------------------------------------------------------

/**
 * Una pestaña de la cabecera. `path` es la ruta del SPA que abre, SIEMPRE sin
 * ancla: es lo que se compara con `location.pathname`, y guardar el `#seccion`
 * dentro de `path` hacía que una pestaña abierta con ⌘-clic sobre un wikilink
 * con ancla no volviera a reconocerse al navegar (bug 4). El ancla viaja aparte
 * y se vuelve a pegar al activar la pestaña. `title`, `chip` y `color` son lo
 * que se dibuja (los repone la navegación); `scrollY` es la posición de `main`
 * cuando se dejó la pestaña.
 */
export interface SubjectTab {
  id: string;
  path: string;
  /** Query de la ruta («?arg=4/guia») o cadena vacía: es el estado de las vistas de
      herramienta, y sin ella la pestaña volvía a la portada de la vista al reactivarla. */
  search: string;
  /** Ancla de la ruta («#seccion») o cadena vacía. Nunca forma parte de `path`. */
  hash: string;
  title: string;
  /** Rótulo corto de la división: solo cuando la pestaña es una página del wiki. */
  chip: string | null;
  /** Color de la división del chip, o el del grupo del rail cuando no es una página. */
  color: string | null;
  /** Grupo del rail al que pertenece la ruta («Practicar»…): el `title` del punto. */
  section: string | null;
  scrollY: number;
}

/** Parte una dirección del SPA en su pathname (con query) y su ancla. */
export function splitHash(href: string): { path: string; hash: string } {
  const at = href.indexOf("#");
  return at === -1 ? { path: href, hash: "" } : { path: href.slice(0, at), hash: href.slice(at) };
}

/** Parte una dirección del SPA en pathname, query («?…») y ancla («#…»). */
export function splitHref(href: string): { path: string; search: string; hash: string } {
  const { path: withQuery, hash } = splitHash(href);
  const q = withQuery.indexOf("?");
  return q === -1
    ? { path: withQuery, search: "", hash }
    : { path: withQuery.slice(0, q), search: withQuery.slice(q), hash };
}

/** La dirección completa de una pestaña: lo que hay que navegar para abrirla. */
export function tabHref(tab: SubjectTab): string {
  return `${tab.path}${tab.search ?? ""}${tab.hash}`;
}

export interface TabsState {
  list: SubjectTab[];
  /** id de la pestaña activa. Siempre existe en `list`. */
  active: string;
}

/** Lo que la ruta activa aporta a una pestaña (sin el id ni el scroll). */
export interface TabInfo {
  /** Pathname, sin ancla: quien llame parte la dirección con `splitHref`. */
  path: string;
  /** Query («?…»), si la ruta trae una. */
  search?: string;
  /** Ancla, si la ruta trae una. */
  hash?: string;
  title: string;
  chip: string | null;
  color: string | null;
  /** Grupo del rail de la ruta, si pertenece a alguno. */
  section?: string | null;
}

/**
 * Tope del baseline (core.js:1626-1628): al llegar a 20, `openTab` NO abre nada
 * y avisa. Desalojar en silencio la pestaña más vieja hacía desaparecer trabajo
 * sin decirlo.
 */
export const MAX_TABS = 20;

let tabSeq = 0;
/** Id de pestaña: único dentro de la sesión y estable al persistirse. */
export function newTabId(): string {
  tabSeq += 1;
  return `t${Date.now().toString(36)}${tabSeq.toString(36)}`;
}

function tab(info: TabInfo): SubjectTab {
  /* Defensa en profundidad: si a alguien se le cuela una dirección con ancla en
     `path`, se normaliza acá y no dentro del estado. */
  const split = splitHref(info.path);
  return {
    id: newTabId(),
    path: split.path,
    search: info.search ?? split.search,
    hash: info.hash ?? split.hash,
    title: info.title,
    chip: info.chip,
    color: info.color,
    section: info.section ?? null,
    scrollY: 0,
  };
}

/** Pestaña «Inicio» de una materia: el estado al que se vuelve al cerrar la última. */
function homeTab(slug: string): SubjectTab {
  return tab({ path: routes.subject(slug), title: "Inicio", chip: null, color: null });
}

function isTab(v: unknown): v is SubjectTab {
  if (!v || typeof v !== "object") return false;
  const t = v as Record<string, unknown>;
  return typeof t.id === "string" && typeof t.path === "string" && typeof t.title === "string";
}

/** Lo persistido puede venir de otra versión: se sanea o se descarta entero. */
function readTabs(slug: string): TabsState | null {
  const raw = readJson<unknown>(LS_KEYS.tabs(slug));
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw as { list?: unknown; active?: unknown };
  if (!Array.isArray(parsed.list)) return null;
  const list = parsed.list.filter(isTab).slice(0, MAX_TABS).map((t) => {
    /* Lo guardado por una versión anterior traía el ancla dentro de `path`. */
    const split = splitHref(t.path);
    return {
      id: t.id,
      path: split.path,
      search: typeof t.search === "string" ? t.search : split.search,
      hash: typeof t.hash === "string" && t.hash ? t.hash : split.hash,
      title: t.title,
      chip: typeof t.chip === "string" ? t.chip : null,
      color: typeof t.color === "string" ? t.color : null,
      section: typeof t.section === "string" ? t.section : null,
      scrollY: typeof t.scrollY === "number" && Number.isFinite(t.scrollY) ? t.scrollY : 0,
    };
  });
  if (!list.length) return null;
  const active = typeof parsed.active === "string" && list.some((t) => t.id === parsed.active)
    ? parsed.active
    : (list[0] as SubjectTab).id;
  return { list, active };
}

function writeTabs(slug: string, state: TabsState): void {
  writeJson(LS_KEYS.tabs(slug), state);
}

/**
 * Estado inicial de una materia: lo persistido o una sola pestaña «Inicio». Se
 * memoriza para que la referencia sea estable mientras el store no tenga nada
 * suyo (si no, cada render devolvería un objeto nuevo y redibujaría la barra).
 */
const initialTabsCache = new Map<string, TabsState>();
function initialTabs(slug: string): TabsState {
  let cached = initialTabsCache.get(slug);
  if (!cached) {
    const stored = readTabs(slug);
    if (stored) cached = stored;
    else {
      const first = homeTab(slug);
      cached = { list: [first], active: first.id };
    }
    initialTabsCache.set(slug, cached);
  }
  return cached;
}

/** Guarda el scroll de la pestaña `id` (sin tocar nada más). */
function withScroll(state: TabsState, id: string, scrollY: number | undefined): TabsState {
  if (scrollY === undefined) return state;
  return { ...state, list: state.list.map((t) => (t.id === id ? { ...t, scrollY } : t)) };
}

export interface SubjectTabsState {
  tabs: Record<string, TabsState>;
  /** Estado de una materia, creándolo si hace falta (no escribe). */
  tabsOf: (slug: string) => TabsState;
  /**
   * Abre una pestaña nueva al final. Devuelve el id de la nueva, o null si ya se
   * llegó al tope de 20 (en ese caso no abre nada: quien llame avisa).
   */
  openTab: (slug: string, info: TabInfo, activate?: boolean) => string | null;
  /** Abre una pestaña «Inicio» y la activa (el botón «+»). Null si está en el tope. */
  newTab: (slug: string) => string | null;
  /** Activa una pestaña; `scrollY` es el scroll con el que se deja la anterior. */
  activateTab: (slug: string, id: string, scrollY?: number) => void;
  /** Cierra una pestaña. Devuelve la ruta a la que hay que navegar, o null. */
  closeTab: (slug: string, id: string) => string | null;
  /** Reordena por arrastre (índices de `list`). */
  moveTab: (slug: string, from: number, to: number) => void;
  /**
   * Lo que hace la navegación: si el destino ya está abierto en OTRA pestaña,
   * la activa; si no, actualiza la activa con la ruta nueva.
   */
  syncActive: (slug: string, info: TabInfo, scrollY?: number) => void;
  setScroll: (slug: string, id: string, scrollY: number) => void;
}

/** Store propio: las pestañas cambian en cada navegación y no deben redibujar el índice. */
export const useSubjectTabsStore = create<SubjectTabsState>((set, get) => {
  const commit = (slug: string, next: TabsState) => {
    writeTabs(slug, next);
    set((s) => ({ tabs: { ...s.tabs, [slug]: next } }));
  };

  const read = (slug: string): TabsState => get().tabs[slug] ?? initialTabs(slug);

  return {
    tabs: {},

    tabsOf: read,

    openTab: (slug, info, activate = false) => {
      const state = read(slug);
      /* El tope corta ANTES de crear nada (core.js:1626-1628): ninguna pestaña
         abierta se pierde por abrir una más. */
      if (state.list.length >= MAX_TABS) return null;
      const fresh = tab(info);
      const list = [...state.list, fresh];
      const active = activate ? fresh.id : state.active;
      commit(slug, { list, active });
      return fresh.id;
    },

    newTab: (slug) =>
      get().openTab(slug, { path: routes.subject(slug), title: "Inicio", chip: null, color: null }, true),

    activateTab: (slug, id, scrollY) => {
      const state = read(slug);
      if (!state.list.some((t) => t.id === id)) return;
      if (state.active === id) return;
      commit(slug, { ...withScroll(state, state.active, scrollY), active: id });
    },

    closeTab: (slug, id) => {
      const state = read(slug);
      const at = state.list.findIndex((t) => t.id === id);
      if (at === -1) return null;
      const list = state.list.filter((t) => t.id !== id);
      /* La última pestaña no deja la cabecera vacía: se repone «Inicio». */
      if (!list.length) {
        const fresh = homeTab(slug);
        commit(slug, { list: [fresh], active: fresh.id });
        return tabHref(fresh);
      }
      if (state.active !== id) {
        commit(slug, { list, active: state.active });
        return null;
      }
      /* Se cerró la activa: manda la vecina de la derecha, si no la de la izquierda. */
      const heir = list[Math.min(at, list.length - 1)] as SubjectTab;
      commit(slug, { list, active: heir.id });
      return tabHref(heir);
    },

    moveTab: (slug, from, to) => {
      const state = read(slug);
      if (from === to) return;
      const list = [...state.list];
      const moved = list[from];
      if (!moved || to < 0 || to >= list.length) return;
      list.splice(from, 1);
      list.splice(to, 0, moved);
      commit(slug, { ...state, list });
    },

    syncActive: (slug, info, scrollY) => {
      const state = read(slug);
      const current = state.list.find((t) => t.id === state.active);
      if (!current) return;
      /* La comparación es SIEMPRE por pathname: el ancla no cambia de vista y no
         puede decidir si se está navegando o no (bug 4). */
      const parts = splitHref(info.path);
      const path = parts.path;
      const search = info.search ?? parts.search;
      const hash = info.hash ?? parts.hash;

      /* La activa YA está en esa ruta: no se está navegando a ningún lado, así
         que la regla del «ya abierto en otra pestaña» no aplica (si aplicara,
         abrir una pestaña nueva sobre una ruta repetida saltaría a la vieja).
         Solo se reponen los rótulos y el ancla, y únicamente si cambiaron. */
      if (current.path === path) {
        if (
          current.title === info.title &&
          current.chip === info.chip &&
          current.color === info.color &&
          current.section === (info.section ?? null) &&
          current.hash === hash &&
          (current.search ?? "") === search
        ) {
          return;
        }
        const list = state.list.map((t) =>
          t.id === state.active
            ? { ...t, search, hash, title: info.title, chip: info.chip, color: info.color, section: info.section ?? null }
            : t,
        );
        commit(slug, { ...state, list });
        return;
      }

      /* El destino ya está abierto: se activa esa pestaña en vez de mover la actual. */
      const other = state.list.find((t) => t.path === path);
      if (other) {
        commit(slug, { ...withScroll(state, state.active, scrollY), active: other.id });
        return;
      }

      const list = state.list.map((t) =>
        t.id === state.active
          ? { ...t, path, search, hash, title: info.title, chip: info.chip, color: info.color, section: info.section ?? null, scrollY: 0 }
          : t,
      );
      commit(slug, { ...state, list });
    },

    setScroll: (slug, id, scrollY) => {
      const state = read(slug);
      const current = state.list.find((t) => t.id === id);
      if (!current || current.scrollY === scrollY) return;
      commit(slug, withScroll(state, id, scrollY));
    },
  };
});

/** Pestañas de una materia (referencia estable entre renders). */
export function useTabs(slug: string): TabsState {
  return useSubjectTabsStore((s) => s.tabs[slug] ?? initialTabs(slug));
}

/** Solo para los tests: vacía el store y la caché de la primera lectura. */
export function resetTabsForTests(): void {
  initialTabsCache.clear();
  useSubjectTabsStore.setState({ tabs: {} });
}

/** Solo para los tests: olvida la modalidad de plan leída de localStorage. */
export function resetPlanTracksForTests(): void {
  planTrackCache.clear();
  useSubjectUiStore.setState({ planTracks: {} });
}
