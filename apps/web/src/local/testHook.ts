/**
 * Gancho de pruebas: `window.__sinapsis`.
 *
 * Sin API ni cookies, un end-to-end no tiene forma de sembrar el estado del
 * estudiante: esto se la da. Solo existe en desarrollo o con `VITE_E2E=1`, de
 * modo que en la compilación de Pages la condición es la constante `false` y
 * Rollup se lleva el módulo entero.
 */
import type { ThemeId } from "@sinapsis/contract";
import { emptyBackup, type LocalBackup } from "@sinapsis/contract/site";
import { useUiStore } from "@/lib/store";
import { clearSearchIndexes } from "./client";
import { clearPersisted, flush } from "./persist";
import { getState, replace } from "./state";

export interface SinapsisTestHook {
  /** Deja el estado personal vacío (memoria, IndexedDB, `localStorage`) e invalida las consultas. */
  reset(): Promise<void>;
  /** El documento vigente, tal como se guardaría. */
  snapshot(): Promise<LocalBackup>;
  /** Reemplaza el estado por el documento dado y lo persiste. */
  restore(doc: LocalBackup): Promise<void>;
  /** Cambia el tema del perfil (y lo pinta). */
  setTheme(theme: ThemeId): Promise<void>;
}

/**
 * Lo que rehace las consultas después de tocar el estado por debajo. Es
 * `resetQueries` y no `clear` + `invalidateQueries`: con la caché vacía no hay
 * nada que invalidar y las vistas montadas se quedaban con lo último dibujado.
 */
export interface QueryInvalidator {
  resetQueries(): Promise<void> | void;
}

/** ¿Corresponde instalar el gancho en esta compilación? */
export function testHookEnabled(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_E2E === "1";
}

export function createTestHook(queries: QueryInvalidator): SinapsisTestHook {
  return {
    reset: async () => {
      replace(emptyBackup(new Date().toISOString()));
      clearSearchIndexes();
      await clearPersisted();
      useUiStore.getState().setTheme("pergamino", { push: false });
      await queries.resetQueries();
    },
    snapshot: async () => structuredClone(getState()),
    restore: async (doc: LocalBackup) => {
      replace(doc);
      clearSearchIndexes();
      await flush();
      useUiStore.getState().setTheme(doc.profile.theme, { push: false });
      await queries.resetQueries();
    },
    setTheme: async (theme: ThemeId) => {
      useUiStore.getState().setTheme(theme);
      await flush();
    },
  };
}

/** Cuelga el gancho de `window`. No hace nada si la compilación no lo permite. */
export function installTestHook(queries: QueryInvalidator): void {
  if (!testHookEnabled() || typeof window === "undefined") return;
  window.__sinapsis = createTestHook(queries);
}
