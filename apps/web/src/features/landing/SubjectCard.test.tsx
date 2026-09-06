import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { SubjectCard as SubjectCardData } from "@sinapsis/contract";
import { SubjectCard, metaOf, progressOf } from "./SubjectCard";

afterEach(cleanup);

function card(overrides: Partial<SubjectCardData> = {}): SubjectCardData {
  return {
    slug: "proba",
    name: "Probabilidad y Estadística",
    code: "93.24",
    institution: "ITBA",
    color: "--u9",
    division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    divisionsCount: 12,
    pagesCount: 200,
    studiedCount: 0,
    semester: "2026-1C",
    position: 0,
    placeholder: false,
    lastSyncAt: null,
    ...overrides,
  };
}

function renderCard(data: SubjectCardData) {
  return render(
    <MemoryRouter>
      <SubjectCard card={data} />
    </MemoryRouter>,
  );
}

describe("progressOf", () => {
  it("clasifica los tres estados", () => {
    expect(progressOf({ pagesCount: 200, studiedCount: 0 })).toMatchObject({ pct: 0, state: "none" });
    expect(progressOf({ pagesCount: 200, studiedCount: 50 })).toMatchObject({ pct: 25, state: "doing" });
    expect(progressOf({ pagesCount: 200, studiedCount: 200 })).toMatchObject({ pct: 100, state: "done" });
  });

  it("no divide por cero ni pasa de 100", () => {
    expect(progressOf({ pagesCount: 0, studiedCount: 0 })).toMatchObject({ pct: 0, state: "none" });
    expect(progressOf({ pagesCount: 10, studiedCount: 99 })).toMatchObject({ pct: 100, state: "done" });
  });
});

describe("metaOf", () => {
  it("usa el rótulo de división de la materia", () => {
    expect(metaOf(card())).toBe("12 unidades · 200 páginas");
    expect(metaOf(card({ divisionsCount: 1, pagesCount: 1 }))).toBe("1 unidad · 1 página");
    expect(
      metaOf(card({ division: { singular: "Semana", abbr: "S", plural: "Semanas" }, divisionsCount: 14 })),
    ).toBe("14 semanas · 200 páginas");
  });
});

describe("<SubjectCard/>", () => {
  it("sin comenzar: 0 % y estado gris", () => {
    renderCard(card());
    expect(screen.getByText("SIN COMENZAR")).toBeTruthy();
    expect(screen.getByText("0/200 páginas")).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  });

  it("en curso: porcentaje parcial", () => {
    renderCard(card({ studiedCount: 62 }));
    expect(screen.getByText("EN CURSO")).toBeTruthy();
    expect(screen.getByText("62/200 páginas")).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("31");
  });

  it("completa: 100 %", () => {
    renderCard(card({ studiedCount: 200 }));
    expect(screen.getByText("COMPLETA")).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
  });

  it("enlaza a la materia y marca las que no se sincronizaron", () => {
    renderCard(card({ placeholder: true }));
    /* El enlace grande de la tarjeta se nombra con el nombre de la materia. */
    const link = screen.getByRole("link", { name: "Probabilidad y Estadística" });
    expect(link.getAttribute("href")).toBe("/m/proba");
    expect(screen.getByText("Sin sincronizar")).toBeTruthy();
  });

  it("ofrece los atajos de estudio del pie", () => {
    renderCard(card());
    expect(screen.getByRole("link", { name: "Repasar" }).getAttribute("href")).toBe("/m/proba/flashcards");
    expect(screen.getByRole("link", { name: "Plan" }).getAttribute("href")).toBe("/m/proba/plan");
  });

  it("en gestión la tarjeta no navega: ni enlace grande ni atajos", () => {
    render(
      <MemoryRouter>
        <SubjectCard card={card()} manage semesters={["2026-1C"]} />
      </MemoryRouter>,
    );
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
