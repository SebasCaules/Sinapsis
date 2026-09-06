/**
 * La landing local: ocultar y desocultar materias del catálogo, placeholders,
 * ubicaciones y cuatrimestres canónicos. Son las reglas que aplicaba
 * `services/landing.ts`, ahora sobre el documento del navegador.
 */
import { describe, expect, it } from "vitest";
import type { CreateSubjectInput } from "@sinapsis/contract";
import { emptyBackup, type LocalBackup, type SiteCatalog } from "@sinapsis/contract/site";
import { ApiError } from "@/lib/apiError";
import {
  applyLayout,
  availableCards,
  createSubject,
  landingCards,
  landingSemesters,
  normalizeSemester,
  removeFromLanding,
} from "./landing";

const AHORA = "2026-09-06T12:00:00.000Z";

const catalog: SiteCatalog = {
  format: 1,
  builtAt: "2026-09-05T10:00:00.000Z",
  subjects: [
    {
      slug: "proba",
      name: "Probabilidad y Estadística",
      code: "93.24",
      institution: "ITBA",
      color: "--u9",
      semester: "2026-1C",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
      divisionsCount: 12,
      pagesCount: 200,
      totalPages: 240,
      toolsCount: 2,
      builtAt: "2026-09-05T10:00:00.000Z",
    },
    {
      slug: "algebra",
      name: "Álgebra",
      code: "22.01",
      institution: "ITBA",
      color: "--u2",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
      divisionsCount: 4,
      pagesCount: 30,
      totalPages: 30,
      toolsCount: 0,
      builtAt: "2026-09-05T10:00:00.000Z",
    },
  ],
};

const nuevo: CreateSubjectInput = {
  slug: "analisis",
  name: "Análisis Matemático",
  code: "93.58",
  institution: "ITBA",
  semester: "2026-2c",
  color: "--u4",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
};

const doc = (): LocalBackup => emptyBackup(AHORA);

describe("tarjetas de la landing", () => {
  it("una materia del catálogo cae en el cuatrimestre que sugiere el sitio", () => {
    const cards = landingCards(doc(), catalog, AHORA);
    expect(cards.map((c) => c.slug)).toEqual(["proba", "algebra"]);
    expect(cards[0]?.semester).toBe("2026-1C");
    expect(cards[0]?.lastSyncAt).toBe("2026-09-05T10:00:00.000Z");
    expect(cards[0]?.placeholder).toBe(false);
  });

  it("la que no declara cuatrimestre cae en «Sin cuatrimestre», al final", () => {
    const cards = landingCards(doc(), catalog, AHORA);
    expect(cards[1]?.semester).toBe("Sin cuatrimestre");
  });

  it("el progreso y el repaso salen del estado local", () => {
    const base = doc();
    base.subjects["proba"] = {
      srs: [
        { cardId: "c1", ease: 2.5, interval: 1, due: "2026-09-05T00:00:00.000Z", reps: 1, lapses: 0, lastGrade: 3, updatedAt: AHORA },
        { cardId: "c2", ease: 2.5, interval: 9, due: "2026-12-01T00:00:00.000Z", reps: 1, lapses: 0, lastGrade: 3, updatedAt: AHORA },
      ],
      bookmarks: [],
      notes: [],
      tasksDone: [],
      attempts: [],
      planDates: {},
      studied: { "a": AHORA, "b": AHORA },
    };
    const card = landingCards(base, catalog, AHORA).find((c) => c.slug === "proba");
    expect(card?.studiedCount).toBe(2);
    expect(card?.dueCount).toBe(1);
  });

  it("respeta el `placement` guardado y ordena por cuatrimestre y posición", () => {
    const base = doc();
    base.landing.placements = { algebra: { semester: "2026-2C", position: 0 }, proba: { semester: "2026-1C", position: 3 } };
    expect(landingCards(base, catalog, AHORA).map((c) => c.slug)).toEqual(["algebra", "proba"]);
  });
});

describe("ocultar y desocultar", () => {
  it("quitar una materia del catálogo la oculta, no la borra", () => {
    const next = removeFromLanding(doc(), catalog, "proba");
    expect(next.landing.hidden).toEqual(["proba"]);
    expect(landingCards(next, catalog, AHORA).map((c) => c.slug)).toEqual(["algebra"]);
    expect(availableCards(next, catalog, AHORA).map((c) => c.slug)).toEqual(["proba"]);
  });

  it("agregarla otra vez la desoculta y la ubica donde se pidió", () => {
    const oculta = removeFromLanding(doc(), catalog, "proba");
    const vuelta = createSubject(oculta, catalog, { ...nuevo, slug: "proba" }, AHORA);
    expect(vuelta.landing.hidden).toEqual([]);
    expect(vuelta.landing.placeholders).toEqual([]);
    const card = landingCards(vuelta, catalog, AHORA).find((c) => c.slug === "proba");
    expect(card?.semester).toBe("2026-2C");
    /* Vuelve como materia del catálogo: conserva su nombre y sus páginas. */
    expect(card?.name).toBe("Probabilidad y Estadística");
    expect(card?.pagesCount).toBe(200);
  });

  it("una materia que ya está en la landing es un conflicto", () => {
    expect(() => createSubject(doc(), catalog, { ...nuevo, slug: "proba" }, AHORA)).toThrow(ApiError);
    try {
      createSubject(doc(), catalog, { ...nuevo, slug: "proba" }, AHORA);
    } catch (err) {
      expect((err as ApiError).status).toBe(409);
    }
  });
});

describe("placeholders", () => {
  it("una materia que no está en el catálogo se crea a mano", () => {
    const next = createSubject(doc(), catalog, nuevo, AHORA);
    const card = landingCards(next, catalog, AHORA).find((c) => c.slug === "analisis");
    expect(card?.placeholder).toBe(true);
    expect(card?.lastSyncAt).toBeNull();
    expect(card?.pagesCount).toBe(0);
    /* El cuatrimestre se guarda canónico: "2026-2c" → "2026-2C" (N0-32). */
    expect(card?.semester).toBe("2026-2C");
  });

  it("quitar un placeholder lo borra pero conserva su progreso", () => {
    const conMateria = createSubject(doc(), catalog, nuevo, AHORA);
    conMateria.subjects["analisis"] = { srs: [], bookmarks: [], notes: [], tasksDone: [], attempts: [], planDates: {}, studied: { intro: AHORA } };
    const next = removeFromLanding(conMateria, catalog, "analisis");
    expect(next.landing.placeholders).toEqual([]);
    expect(next.subjects["analisis"]?.studied).toEqual({ intro: AHORA });
  });

  it("dos placeholders del mismo cuatrimestre no comparten posición", () => {
    const uno = createSubject(doc(), catalog, nuevo, AHORA);
    const dos = createSubject(uno, catalog, { ...nuevo, slug: "fisica", name: "Física" }, AHORA);
    const cards = landingCards(dos, catalog, AHORA).filter((c) => c.semester === "2026-2C");
    expect(cards.map((c) => c.position)).toEqual([0, 1]);
  });
});

describe("disposición y cuatrimestres", () => {
  it("guarda las posiciones e ignora los slugs ajenos", () => {
    const next = applyLayout(doc(), catalog, {
      items: [
        { slug: "proba", semester: "2026-2c", position: 1 },
        { slug: "fantasma", semester: "2026-1C", position: 0 },
      ],
      semesters: ["2026-2c", "2026-1C", "2026-2C"],
    });
    expect(next.landing.placements["proba"]).toEqual({ semester: "2026-2C", position: 1 });
    expect(next.landing.placements["fantasma"]).toBeUndefined();
    /* Los rótulos se normalizan y se deduplican por su forma canónica. */
    expect(next.landing.semesters).toEqual(["2026-2C", "2026-1C"]);
  });

  it("sin `semesters` no se tocan los declarados", () => {
    const base = applyLayout(doc(), catalog, { items: [], semesters: ["2025-1C"] });
    const next = applyLayout(base, catalog, { items: [] });
    expect(next.landing.semesters).toEqual(["2025-1C"]);
  });

  it("los cuatrimestres son los declarados (con los vacíos) más los usados", () => {
    const base = applyLayout(doc(), catalog, { items: [], semesters: ["2027-1C", "2026-1C"] });
    expect(landingSemesters(base, landingCards(base, catalog, AHORA))).toEqual([
      "2027-1C",
      "2026-1C",
      "Sin cuatrimestre",
    ]);
  });

  it("normalizeSemester conserva los rótulos libres", () => {
    expect(normalizeSemester("2026-1c")).toBe("2026-1C");
    expect(normalizeSemester("  verano  ")).toBe("verano");
  });
});
