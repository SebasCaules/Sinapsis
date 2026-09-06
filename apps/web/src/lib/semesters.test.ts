import { describe, expect, it } from "vitest";
import type { SubjectCard } from "@sinapsis/contract";
import {
  compareSemestersDesc,
  groupBySemester,
  nextSemesterSuggestion,
  parseSemester,
  semesterChip,
  semesterLabel,
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

describe("nextSemesterSuggestion", () => {
  it("propone el siguiente al más reciente", () => {
    expect(nextSemesterSuggestion(["2026-1C", "2025-2C"])).toBe("2026-2C");
    expect(nextSemesterSuggestion(["2026-2C"])).toBe("2027-1C");
  });
});
