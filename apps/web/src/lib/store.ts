/**
 * Estado de UI de la plataforma (zustand). Nada de datos del servidor: eso vive
 * en TanStack Query. Acá solo tema y estado del panel lateral, ambos persistidos
 * en localStorage con las claves del contrato (LS_KEYS).
 */
import { create } from "zustand";
import { LS_KEYS, ThemeId } from "@sinapsis/contract";
import { api } from "./api";

const THEME_CYCLE: ThemeId[] = ["pergamino", "laurel", "claustro"];

/** Lee una clave de `localStorage` como JSON; null si falta, no es JSON o no hay almacenamiento. */
export function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Escribe una preferencia en `localStorage`. Si no se puede, la app sigue igual. */
export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo privado o cuota llena: la preferencia se pierde, la app sigue */
  }
}

/** Tema inicial: localStorage → preferencia del sistema → pergamino. */
export function initialTheme(): ThemeId {
  const stored = ThemeId.safeParse(readJson<string>(LS_KEYS.theme));
  if (stored.success) return stored.data;
  try {
    if (matchMedia("(prefers-color-scheme: dark)").matches) return "claustro";
  } catch {
    /* jsdom sin matchMedia */
  }
  return "pergamino";
}

function initialCompact(): boolean {
  return readJson<boolean>(LS_KEYS.sidebarCompact) === true;
}

/** Pinta el tema en el documento (el `<html>` ya lo trae del script de index.html). */
function applyTheme(theme: ThemeId): void {
  if (typeof document !== "undefined") document.documentElement.setAttribute("data-theme", theme);
}

function applyCompact(compact: boolean): void {
  if (typeof document !== "undefined") document.documentElement.classList.toggle("sb-compact", compact);
}

export interface SetThemeOptions {
  /** false cuando el tema viene del servidor: no hay que devolvérselo. */
  push?: boolean;
}

export interface UiState {
  theme: ThemeId;
  /** true cuando hay sesión: habilita persistir el tema en el perfil (PATCH /me). */
  signedIn: boolean;
  sidebarCompact: boolean;
  setTheme: (theme: ThemeId, options?: SetThemeOptions) => void;
  cycleTheme: () => void;
  setSignedIn: (signedIn: boolean) => void;
  setSidebarCompact: (compact: boolean) => void;
  toggleSidebarCompact: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: initialTheme(),
  signedIn: false,
  sidebarCompact: initialCompact(),

  setTheme: (theme, options) => {
    if (get().theme !== theme) set({ theme });
    applyTheme(theme);
    writeJson(LS_KEYS.theme, theme);
    if (options?.push !== false && get().signedIn) {
      void api.auth.setTheme(theme).catch(() => {
        /* sin red o sin sesión: queda el tema local */
      });
    }
  },

  cycleTheme: () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(get().theme) + 1) % THEME_CYCLE.length] ?? "pergamino";
    get().setTheme(next);
  },

  setSignedIn: (signedIn) => set({ signedIn }),

  setSidebarCompact: (compact) => {
    set({ sidebarCompact: compact });
    applyCompact(compact);
    writeJson(LS_KEYS.sidebarCompact, compact);
  },

  toggleSidebarCompact: () => get().setSidebarCompact(!get().sidebarCompact),
}));

/** Rótulo humano de cada tema (tooltips, menús). */
export const THEME_LABEL: Record<ThemeId, string> = {
  pergamino: "Pergamino",
  laurel: "Laurel",
  claustro: "Claustro",
};
