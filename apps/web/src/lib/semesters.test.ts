import { describe, expect, it } from "vitest";
import type { SubjectCard } from "@sinapsis/contract";
import {
  compareSemestersDesc,
  groupBySemester,
  groupBySemesters,
  nextSemesterSuggestion,
  parseSemester,
  semesterChip,
  semesterLabel,
  unionSemesters,
} from "./semesters";

function card(slug: string, semester: string, position: number, name = slug): SubjectCard {
  return {
    slug,
    name,
    code: "00.00",
    institution: "ITBA",
    color: "--u1",
    division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    divisionsCount: 1,
    pagesCount: 10,
    studiedCount: 0,
    semester,
    position,
    placeholder: false,
    lastSyncAt: null,
  };
}

describe("parseSemester", () => {
  it("analiza el formato canónico", () => {
    expect(parseSemester("2026-1C")).toEqual({ year: 2026, term: 1 });
    expect(parseSemester("2025-2c")).toEqual({ year: 2025, term: 2 });
  });

  it("devuelve null con rótulos libres", () => {
    expect(parseSemester("Verano")).toBeNull();
    expect(parseSemester("")).toBeNull();
    expect(parseSemester("26-1C")).toBeNull();
  });
});

describe("semesterLabel / semesterChip", () => {
  it("arma el rótulo largo y el chip", () => {
    expect(semesterLabel("2026-1C")).toBe("Cuatrimestre 1 · 2026");
    expect(semesterChip("2026-1C")).toBe("C1");
    expect(semesterChip("2026-2C")).toBe("C2");
  });

  it("conserva los rótulos libres", () => {
    expect(semesterLabel("Verano 2026")).toBe("Verano 2026");
    expect(semesterChip("Verano 2026")).toBe("VER");
  });
});

describe("compareSemestersDesc", () => {
  it("ordena del más reciente al más antiguo", () => {
    const sorted = ["2025-2C", "2026-2C", "2026-1C"].sort(compareSemestersDesc);
    expect(sorted).toEqual(["2026-2C", "2026-1C", "2025-2C"]);
  });

  it("deja los rótulos libres al final", () => {
    const sorted = ["Verano", "2026-1C"].sort(compareSemestersDesc);
    expect(sorted).toEqual(["2026-1C", "Verano"]);
  });
});

describe("groupBySemester", () => {
  const cards = [
    card("b", "2026-1C", 1),
    card("a", "2026-1C", 0),
    card("c", "2025-2C", 0),
    card("d", "2026-2C", 0),
  ];

  it("agrupa por cuatrimestre en orden descendente", () => {
    const groups = groupBySemester(cards);
    expect(groups.map((g) => g.semester)).toEqual(["2026-2C", "2026-1C", "2025-2C"]);
    expect(groups[0]?.label).toBe("Cuatrimestre 2 · 2026");
    expect(groups[0]?.chip).toBe("C2");
  });

  it("ordena las tarjetas de cada grupo por posición", () => {
    const groups = groupBySemester(cards);
    expect(groups[1]?.cards.map((c) => c.slug)).toEqual(["a", "b"]);
  });
});

describe("unionSemesters", () => {
  const cards = [card("a", "2026-1C", 0), card("b", "2025-2C", 0)];

  it("conserva el orden guardado, aunque no sea el del rótulo", () => {
    expect(unionSemesters(["2025-2C", "2026-2C", "2026-1C"], cards)).toEqual(["2025-2C", "2026-2C", "2026-1C"]);
  });

  it("mantiene los cuatrimestres vacíos que el usuario guardó", () => {
    expect(unionSemesters(["2026-2C", "2026-1C", "2025-2C"], cards)).toContain("2026-2C");
  });

  it("agrega al final los que usa alguna materia y no están en la lista", () => {
    expect(unionSemesters(["2026-2C"], cards)).toEqual(["2026-2C", "2026-1C", "2025-2C"]);
  });

  it("sin lista guardada ordena por rótulo, del más reciente al más antiguo", () => {
    expect(unionSemesters([], cards)).toEqual(["2026-1C", "2025-2C"]);
  });

  it("no repite ni deja rótulos vacíos", () => {
    expect(unionSemesters(["2026-1C", "", "2026-1C"], cards)).toEqual(["2026-1C", "2025-2C"]);
  });

  /* B10: la identidad de un cuatrimestre es su forma canónica. */
  it("deduplica por forma canónica y devuelve el rótulo canónico", () => {
    expect(unionSemesters(["2026-1c", " 2026-1C ", "2025-2C"], cards)).toEqual(["2026-1C", "2025-2C"]);
  });

  it("no abre una sección gemela para una materia guardada en minúscula", () => {
    expect(unionSemesters(["2026-1C"], [card("a", "2026-1c", 0)])).toEqual(["2026-1C"]);
  });
});

describe("groupBySemesters", () => {
  const cards = [card("b", "2026-1C", 1), card("a", "2026-1C", 0)];

  it("respeta el orden dado y devuelve los grupos vacíos", () => {
    const groups = groupBySemesters(["2026-2C", "2026-1C"], cards);
    expect(groups.map((g) => g.semester)).toEqual(["2026-2C", "2026-1C"]);
    expect(groups[0]?.cards).toEqual([]);
    expect(groups[0]?.label).toBe("Cuatrimestre 2 · 2026");
    expect(groups[1]?.cards.map((c) => c.slug)).toEqual(["a", "b"]);
  });

  it("descarta las materias de un cuatrimestre que no está en la lista", () => {
    expect(groupBySemesters(["2026-2C"], cards)[0]?.cards).toEqual([]);
  });

  it("reparte por forma canónica: «2026-1c» cae en la sección «2026-1C»", () => {
    const groups = groupBySemesters(["2026-1C"], [card("a", "2026-1c", 0)]);
    expect(groups[0]?.cards.map((c) => c.slug)).toEqual(["a"]);
  });
});

describe("nextSemesterSuggestion", () => {
  it("propone el siguiente al más reciente", () => {
    expect(nextSemesterSuggestion(["2026-1C", "2025-2C"])).toBe("2026-2C");
    expect(nextSemesterSuggestion(["2026-2C"])).toBe("2027-1C");
  });
});
