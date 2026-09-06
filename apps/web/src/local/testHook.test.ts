/**
 * El gancho de pruebas (`window.__sinapsis`): lo que el end-to-end usa para
 * sembrar y limpiar el estado sin API ni cookies.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emptyBackup } from "@sinapsis/contract/site";
import { memoryStore } from "./db";
import { loadLocalState, resetPersistForTests } from "./persist";
import { getState, resetStateForTests, update, withProfile } from "./state";
import { createTestHook, installTestHook, testHookEnabled } from "./testHook";

const queries = { resetQueries: vi.fn(async () => undefined) };

beforeEach(async () => {
  resetStateForTests(emptyBackup("2026-09-06T12:00:00.000Z"));
  resetPersistForTests();
  localStorage.clear();
  queries.resetQueries.mockClear();
  await loadLocalState({ store: memoryStore(), listen: false });
});

afterEach(() => {
  resetPersistForTests();
  delete window.__sinapsis;
});

describe("gancho de pruebas", () => {
  it("solo existe en desarrollo o con VITE_E2E", () => {
    /* vitest corre con DEV = true: el gancho está disponible. */
    expect(testHookEnabled()).toBe(true);
    installTestHook(queries);
    expect(typeof window.__sinapsis?.reset).toBe("function");
  });

  it("`snapshot` devuelve una copia, no el documento vivo", async () => {
    const hook = createTestHook(queries);
    const snap = await hook.snapshot();
    update((doc) => withProfile(doc, { name: "Ana" }));
    expect(snap.profile.name).toBe("Estudiante");
  });

  it("`restore` reemplaza el estado e invalida las consultas", async () => {
    const hook = createTestHook(queries);
    await hook.restore({ ...emptyBackup("2026-01-01T00:00:00.000Z"), profile: { name: "Ana", theme: "claustro" } });

    expect(getState().profile.name).toBe("Ana");
    expect(document.documentElement.getAttribute("data-theme")).toBe("claustro");
    expect(queries.resetQueries).toHaveBeenCalled();
    expect(queries.resetQueries).toHaveBeenCalled();
  });

  it("`reset` deja el documento vacío y limpia las claves `sinapsis.*`", async () => {
    localStorage.setItem("sinapsis.theme", '"laurel"');
    update((doc) => withProfile(doc, { name: "Ana" }));

    await createTestHook(queries).reset();

    expect(getState().profile.name).toBe("Estudiante");
    expect(localStorage.getItem("sinapsis.theme")).toBe('"pergamino"');
    expect(localStorage.getItem("sinapsis.backup")).toBeNull();
    expect(queries.resetQueries).toHaveBeenCalled();
  });
});
