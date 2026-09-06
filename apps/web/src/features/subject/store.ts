/**
 * Estado de UI del shell de materia (zustand).
 *
 *  - `openDivisions`: qué divisiones están desplegadas en el índice, POR MATERIA,
 *    persistido en localStorage con `LS_KEYS.openDivisions(slug)`.
 *  - `collapsedTypes`: qué bloques de tipo están plegados dentro de una división
 *    (los tipos con `collapsedByDefault` nacen plegados). Solo en memoria.
 *  - `compact`: el índice plegado. NO es estado propio de la materia: se comparte
 *    con la plataforma (`LS_KEYS.sidebarCompact` + clase `sb-compact` en <html>),
 *    así que este módulo lo delega en el store de UI de la plataforma y es el
 *    único punto de contacto con él.
 */
import { create } from "zustand";
import { LS_KEYS } from "@sinapsis/contract";
import { useUiStore } from "@/lib/store";

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
  setTypeCollapsed: (slug: string, division: string, type: string, collapsed: boolean) => void;
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

  setTypeCollapsed: (slug, division, type, collapsed) => {
    const id = typeId(slug, division, type);
    set((s) => ({ collapsedTypes: { ...s.collapsedTypes, [id]: collapsed } }));
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
