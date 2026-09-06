/**
 * Persistencia del estado personal: la regla de `savedAt`, el espejo de
 * `localStorage` y la reposición de la copia que falta.
 *
 * El almacén es el de memoria (`memoryStore`), que es exactamente la interfaz
 * que usa `persist.ts`: no hace falta `fake-indexeddb` —que el repositorio no
 * tiene— para probar la regla, que es lo que puede romperse.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emptyBackup, type LocalBackup } from "@sinapsis/contract/site";
import { BACKUP_KEY, memoryStore, type KeyStore } from "./db";
import {
  MIRROR_KEY,
  SAVE_DEBOUNCE,
  flush,
  loadLocalState,
  pickNewer,
  readMirror,
  resetPersistForTests,
  writeMirror,
} from "./persist";
import { getState, resetStateForTests, update, withProfile } from "./state";

function backup(savedAt: string, name: string): LocalBackup {
  return { ...emptyBackup(savedAt), profile: { name, theme: "pergamino" } };
}

const VIEJA = backup("2026-01-01T00:00:00.000Z", "Vieja");
const NUEVA = backup("2026-09-06T00:00:00.000Z", "Nueva");

beforeEach(() => {
  resetStateForTests();
  resetPersistForTests();
  localStorage.clear();
});

afterEach(() => {
  resetPersistForTests();
  vi.useRealTimers();
});

describe("regla de savedAt", () => {
  it("gana la copia más reciente", () => {
    expect(pickNewer(VIEJA, NUEVA)).toBe(NUEVA);
    expect(pickNewer(NUEVA, VIEJA)).toBe(NUEVA);
  });

  it("con una sola copia, gana esa", () => {
    expect(pickNewer(null, VIEJA)).toBe(VIEJA);
    expect(pickNewer(VIEJA, null)).toBe(VIEJA);
    expect(pickNewer(null, null)).toBeNull();
  });

  it("ante un empate gana la de IndexedDB", () => {
    const otra = backup(VIEJA.savedAt, "Otra");
    expect(pickNewer(VIEJA, otra)).toBe(VIEJA);
  });

  it("una fecha ilegible pierde contra una legible", () => {
    const rota = { ...VIEJA, savedAt: "no es una fecha" };
    expect(pickNewer(rota, NUEVA)).toBe(NUEVA);
    expect(pickNewer(NUEVA, rota)).toBe(NUEVA);
  });
});

describe("carga", () => {
  it("el espejo más nuevo le gana a IndexedDB, y la base se repone", async () => {
    const store: KeyStore = memoryStore({ [BACKUP_KEY]: VIEJA });
    writeMirror(NUEVA);

    const loaded = await loadLocalState({ store, listen: false });

    expect(loaded.profile.name).toBe("Nueva");
    expect(getState().profile.name).toBe("Nueva");
    expect((await store.get<LocalBackup>(BACKUP_KEY))?.profile.name).toBe("Nueva");
  });

  it("sin espejo, se repone desde IndexedDB", async () => {
    const store: KeyStore = memoryStore({ [BACKUP_KEY]: NUEVA });

    await loadLocalState({ store, listen: false });

    expect(getState().profile.name).toBe("Nueva");
    expect(readMirror()?.profile.name).toBe("Nueva");
  });

  it("sin ninguna copia arranca vacío y no estrena el almacén", async () => {
    const store: KeyStore = memoryStore();

    const loaded = await loadLocalState({ store, listen: false });

    expect(loaded.profile.name).toBe("Estudiante");
    expect(await store.get(BACKUP_KEY)).toBeNull();
    expect(localStorage.getItem(MIRROR_KEY)).toBeNull();
  });

  it("una copia corrupta se descarta como si no estuviera", async () => {
    const store: KeyStore = memoryStore({ [BACKUP_KEY]: { format: 99, savedAt: "x" } });
    localStorage.setItem(MIRROR_KEY, "{no es json");

    const loaded = await loadLocalState({ store, listen: false });

    expect(loaded.profile.name).toBe("Estudiante");
  });
});

describe("escritura", () => {
  it("cada cambio baja al almacén con un rebote corto", async () => {
    vi.useFakeTimers();
    const store: KeyStore = memoryStore();
    await loadLocalState({ store, listen: false });

    update((doc) => withProfile(doc, { name: "Ana" }));
    update((doc) => withProfile(doc, { name: "Beatriz" }));

    /* Antes del rebote todavía no se escribió: dos cambios seguidos son una sola escritura. */
    expect(await store.get(BACKUP_KEY)).toBeNull();

    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE + 5);

    expect((await store.get<LocalBackup>(BACKUP_KEY))?.profile.name).toBe("Beatriz");
    expect(readMirror()?.profile.name).toBe("Beatriz");
  });

  it("`flush` guarda ya, sin esperar el rebote", async () => {
    const store: KeyStore = memoryStore();
    await loadLocalState({ store, listen: false });

    update((doc) => withProfile(doc, { name: "Ana" }));
    await flush();

    expect((await store.get<LocalBackup>(BACKUP_KEY))?.profile.name).toBe("Ana");
  });

  it("cada escritura sella `savedAt`", async () => {
    const store: KeyStore = memoryStore();
    await loadLocalState({ store, listen: false });
    const antes = getState().savedAt;

    update((doc) => withProfile(doc, { name: "Ana" }), "2026-09-06T13:00:00.000Z");

    expect(getState().savedAt).toBe("2026-09-06T13:00:00.000Z");
    expect(getState().savedAt).not.toBe(antes);
  });
});
