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
  /** Estado explícito por bloque: true plegado, false desplegado; ausente = `collapsedByDefault`. */
  collapsedTypes: Record<string, boolean>;
  toggleDivision: (slug: string, key: string) => void;
  /** Abre la división (idempotente): la usa la navegación a una página. */
  openDivision: (slug: string, key: string) => void;
  toggleType: (slug: string, division: string, type: string, byDefault: boolean) => void;
}

const typeId = (slug: string, division: string, type: string): string => `${slug}/${division}/${type}`;

export const useSubjectUiStore = create<SubjectUiState>((set, get) => ({
  open: {},
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
 * Una pestaña de la cabecera. `path` es la ruta del SPA que abre; `title`,
 * `chip` y `color` son lo que se dibuja (los repone la navegación); `scrollY`
 * es la posición de `main` cuando se dejó la pestaña.
 */
export interface SubjectTab {
  id: string;
  path: string;
  title: string;
  /** Rótulo corto de la división: solo cuando la pestaña es una página del wiki. */
  chip: string | null;
  /** Color de la división del chip. */
  color: string | null;
  scrollY: number;
}

export interface TabsState {
  list: SubjectTab[];
  /** id de la pestaña activa. Siempre existe en `list`. */
  active: string;
}

/** Lo que la ruta activa aporta a una pestaña (sin el id ni el scroll). */
export interface TabInfo {
  path: string;
  title: string;
  chip: string | null;
  color: string | null;
}

/** Tope del baseline: pasado el 20, se cierra la más vieja que no esté activa. */
export const MAX_TABS = 20;

let tabSeq = 0;
/** Id de pestaña: único dentro de la sesión y estable al persistirse. */
export function newTabId(): string {
  tabSeq += 1;
  return `t${Date.now().toString(36)}${tabSeq.toString(36)}`;
}

function tab(info: TabInfo): SubjectTab {
  return { id: newTabId(), path: info.path, title: info.title, chip: info.chip, color: info.color, scrollY: 0 };
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
  const list = parsed.list.filter(isTab).slice(0, MAX_TABS).map((t) => ({
    id: t.id,
    path: t.path,
    title: t.title,
    chip: typeof t.chip === "string" ? t.chip : null,
    color: typeof t.color === "string" ? t.color : null,
    scrollY: typeof t.scrollY === "number" && Number.isFinite(t.scrollY) ? t.scrollY : 0,
  }));
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
   * Abre una pestaña nueva al final. Si ya hay 20, cierra la primera que no
   * esté activa. Devuelve el id de la nueva.
   */
  openTab: (slug: string, info: TabInfo, activate?: boolean) => string;
  /** Abre una pestaña «Inicio» y la activa (el botón «+»). */
  newTab: (slug: string) => string;
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
      const fresh = tab(info);
      let list = [...state.list, fresh];
      let active = activate ? fresh.id : state.active;
      if (list.length > MAX_TABS) {
        const victim = list.find((t) => t.id !== active && t.id !== fresh.id);
        if (victim) list = list.filter((t) => t.id !== victim.id);
        else list = list.slice(list.length - MAX_TABS);
      }
      if (!list.some((t) => t.id === active)) active = (list[0] as SubjectTab).id;
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
        return fresh.path;
      }
      if (state.active !== id) {
        commit(slug, { list, active: state.active });
        return null;
      }
      /* Se cerró la activa: manda la vecina de la derecha, si no la de la izquierda. */
      const heir = list[Math.min(at, list.length - 1)] as SubjectTab;
      commit(slug, { list, active: heir.id });
      return heir.path;
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

      /* La activa YA está en esa ruta: no se está navegando a ningún lado, así
         que la regla del «ya abierto en otra pestaña» no aplica (si aplicara,
         abrir una pestaña nueva sobre una ruta repetida saltaría a la vieja).
         Solo se reponen los rótulos, y únicamente si cambiaron. */
      if (current.path === info.path) {
        if (current.title === info.title && current.chip === info.chip && current.color === info.color) return;
        const list = state.list.map((t) =>
          t.id === state.active ? { ...t, title: info.title, chip: info.chip, color: info.color } : t,
        );
        commit(slug, { ...state, list });
        return;
      }

      /* El destino ya está abierto: se activa esa pestaña en vez de mover la actual. */
      const other = state.list.find((t) => t.path === info.path);
      if (other) {
        commit(slug, { ...withScroll(state, state.active, scrollY), active: other.id });
        return;
      }

      const list = state.list.map((t) =>
        t.id === state.active
          ? { ...t, path: info.path, title: info.title, chip: info.chip, color: info.color, scrollY: 0 }
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
