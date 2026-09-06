/**
 * El bloque de ejercicios del índice (N0-61): debajo de los bloques por tipo,
 * una fila por grupo (Guía, Lutzio, Parciales, Finales) con su avance.
 *
 * Lo que se prueba acá es lo NUEVO; el resto del árbol (divisiones, bloques por
 * tipo, filas de página) lo cubren los E2E del panel.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SubjectConfig, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { buildSubjectModel, type ExtraStep } from "../model";
import { useSubjectUiStore } from "../store";
import { IndexPanel } from "./IndexPanel";

const config = SubjectConfig.parse(rawProbaConfig);

function page(slug: string, title: string, division: string, order: number): PageMeta {
  return {
    slug,
    title,
    type: "concepto",
    folder: "concepto",
    division,
    summary: "",
    tags: [],
    sources: [],
    words: 100,
    order,
  };
}

const pages: PageMeta[] = [
  page("u1-a", "Medidas de posición", "1", 1),
  page("u1-b", "Medidas de dispersión", "1", 2),
];

/** Dos grupos: uno a medio hacer y otro entero resuelto. */
const PASOS: Record<string, ExtraStep[]> = {
  "1": [
    { id: "g1", label: "Ejercicio 1", done: true, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
    { id: "g2", label: "Ejercicio 2", done: false, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
    { id: "l1", label: "Propuesto 1", done: true, group: "Lutzio", to: "/m/proba/t/ejercicios?arg=1%2Flutzio", source: "ejercicios" },
  ],
};

function renderPanel(pasos = false) {
  const detail: SubjectDetail = { config, pages, studied: [], placeholder: false, lastSyncAt: null };
  const model = buildSubjectModel(detail, false, pasos ? { extraSteps: (d) => PASOS[d] ?? [] } : {});
  return render(
    <MemoryRouter initialEntries={["/m/proba"]}>
      <IndexPanel model={model} activePage={null} activeDivision="1" bookmarks={new Set()} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  useSubjectUiStore.setState({ open: {}, collapsedTypes: {} });
  localStorage.clear();
});

describe("<IndexPanel/> · ejercicios de la unidad", () => {
  it("lista un bloque con una fila por grupo y su avance", () => {
    renderPanel(true);
    expect(screen.getByText("EJERCICIOS · 3")).toBeTruthy();

    const guia = screen.getByRole("link", { name: "Guía · 1 de 2 resueltos" });
    expect(guia.getAttribute("href")).toBe("/m/proba/t/ejercicios?arg=1%2Fguia");
    expect(within(guia).getByText("1/2")).toBeTruthy();
    /* El grupo a medio hacer no lleva tilde. */
    expect(within(guia).queryByTitle("Completo")).toBeNull();

    const lutzio = screen.getByRole("link", { name: "Lutzio · 1 de 1 resuelto" });
    expect(within(lutzio).getByText("1/1")).toBeTruthy();
    expect(within(lutzio).getByTitle("Completo")).toBeTruthy();
  });

  it("el badge de la unidad sigue contando páginas y el tooltip nombra los ejercicios", () => {
    renderPanel(true);
    const fila = screen.getByTestId("division-row");
    expect(within(fila).getByText("2")).toBeTruthy();
    expect(fila.getAttribute("title")).toContain("2 páginas · 0 leídas");
    expect(fila.getAttribute("title")).toContain("3 ejercicios · 2 resueltos");
  });

  it("sin pasos de bundles el índice queda exactamente como estaba", () => {
    renderPanel();
    expect(screen.queryByText(/^EJERCICIOS/)).toBeNull();
    expect(screen.getByTestId("division-row").getAttribute("title")).toBe(
      "Unidad 1 · Estadística Descriptiva · 2 páginas · 0 leídas",
    );
  });
});
