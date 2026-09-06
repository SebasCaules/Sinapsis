/**
 * La copia de seguridad: exportar, volver a importar y rechazar lo que no es una
 * copia. Es la única red de seguridad del estudiante, así que lo que importa es
 * que el viaje de ida y vuelta no pierda nada.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { emptyBackup } from "@sinapsis/contract/site";
import { memoryStore } from "./db";
import {
  backupFileName,
  clearAllLocal,
  exportBackup,
  importBackup,
  parseBackupFile,
  serializeBackup,
} from "./backup";
import { loadLocalState, resetPersistForTests } from "./persist";
import { getState, resetStateForTests, update, withProfile, withSubject } from "./state";

const AHORA = "2026-09-06T12:00:00.000Z";

/** Un documento con algo de todo: perfil, landing y estado de una materia. */
async function sembrar(): Promise<void> {
  await loadLocalState({ store: memoryStore(), listen: false });
  update((doc) => withProfile(doc, { name: "Sebastián", theme: "laurel" }), AHORA);
  update(
    (doc) => ({
      ...doc,
      landing: {
        ...doc.landing,
        placements: { proba: { semester: "2026-1C", position: 2 } },
        semesters: ["2026-1C"],
        hidden: ["algebra"],
      },
    }),
    AHORA,
  );
  update(
    (doc) =>
      withSubject(doc, "proba", (state) => ({
        ...state,
        bookmarks: ["media"],
        notes: [{ page: "media", body: "Repasar", updatedAt: AHORA }],
        tasksDone: ["t1"],
        planDates: { parcial1: "2026-10-01" },
        studied: { media: AHORA },
      })),
    AHORA,
  );
}

beforeEach(async () => {
  resetStateForTests(emptyBackup(AHORA));
  resetPersistForTests();
  localStorage.clear();
  await sembrar();
});

afterEach(() => {
  resetPersistForTests();
});

describe("nombre del archivo", () => {
  it("lleva la fecha del día", () => {
    expect(backupFileName(new Date("2026-09-06T23:30:00.000Z"))).toMatch(/^sinapsis-backup-\d{4}-\d{2}-\d{2}\.json$/);
  });
});

describe("exportar e importar", () => {
  it("el archivo es el documento más la fecha de exportación", () => {
    const doc = exportBackup(new Date(AHORA));
    expect(doc.exportedAt).toBe(AHORA);
    expect(doc.profile.name).toBe("Sebastián");
    expect(doc.subjects["proba"]?.bookmarks).toEqual(["media"]);
  });

  it("exportar e importar no pierde nada (es idempotente)", async () => {
    const archivo = serializeBackup(new Date(AHORA));
    const antes = getState();

    /* El estado se ensucia antes de restaurar: si la importación no reemplazara
       de verdad, el nombre nuevo sobreviviría. */
    update((doc) => withProfile(doc, { name: "Otro" }));
    await importBackup(parseBackupFile(archivo));

    const despues = getState();
    expect(despues.profile).toEqual(antes.profile);
    expect(despues.landing).toEqual(antes.landing);
    expect(despues.subjects).toEqual(antes.subjects);
    /* `exportedAt` es del archivo, no del documento vivo. */
    expect(despues.exportedAt).toBeUndefined();
  });

  it("importar sella una fecha de guardado nueva: esta copia gana", async () => {
    const archivo = parseBackupFile(serializeBackup(new Date(AHORA)));
    await importBackup({ ...archivo, savedAt: "2020-01-01T00:00:00.000Z" });
    expect(Date.parse(getState().savedAt)).toBeGreaterThan(Date.parse("2020-01-01T00:00:00.000Z"));
  });
});

describe("archivos que no sirven", () => {
  it("rechaza lo que no es JSON", () => {
    expect(() => parseBackupFile("{no es json")).toThrow(/JSON/);
  });

  it("rechaza un JSON que no es una copia de Sinapsis", () => {
    expect(() => parseBackupFile(JSON.stringify({ hola: "mundo" }))).toThrow(/copia de seguridad/);
    expect(() => parseBackupFile(JSON.stringify({ format: 99, savedAt: AHORA }))).toThrow(/copia de seguridad/);
  });

  it("un archivo inválido no toca el estado", () => {
    const antes = getState();
    expect(() => parseBackupFile("[]")).toThrow();
    expect(getState()).toBe(antes);
  });
});

describe("borrar todo lo local", () => {
  it("deja el documento vacío", async () => {
    localStorage.setItem("sinapsis.theme", '"laurel"');
    await clearAllLocal();

    expect(getState().profile).toEqual({ name: "Estudiante", theme: "pergamino" });
    expect(getState().subjects).toEqual({});
    expect(getState().landing.hidden).toEqual([]);
    expect(localStorage.getItem("sinapsis.theme")).toBeNull();
    expect(localStorage.getItem("sinapsis.backup")).toBeNull();
  });
});
