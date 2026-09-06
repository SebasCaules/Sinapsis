/**
 * Portada de la división: los seis bloques que la vuelven una portada de curso
 * y no una lista de páginas (vuelta al catálogo, hero con progreso, acción
 * primaria, panorama, temario y fuentes) más el salto a la división vecina.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { SubjectConfig, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { buildSubjectModel, type ExtraStep } from "../model";
import type { SubjectCtx } from "../context";
import { DivisionView } from "./DivisionView";

const config = SubjectConfig.parse(rawProbaConfig);

function meta(slug: string, title: string, type: string, division: string, extra: Partial<PageMeta> = {}): PageMeta {
  return { slug, title, type, folder: type, division, summary: "", tags: [], sources: [], words: 100, ...extra };
}

const pages: PageMeta[] = [
  meta("hub-1", "Estadística Descriptiva", "concepto", "1", {
    order: 3,
    hub: true,
    summary: "Resumir y describir una muestra sin inferir todavía sobre la población.",
  }),
  meta("media", "Medidas de posición", "concepto", "1", { order: 1 }),
  meta("chebyshev", "Desigualdad de Chebyshev", "teorema", "1", { order: 2 }),
  meta("f-b", "02 - Teórica general", "fuente", "1", { format: "teórica" }),
  meta("f-a", "01 - Introducción", "fuente", "1", { format: "slides" }),
  meta("axiomas", "Axiomas de Kolmogorov", "concepto", "2", { order: 1 }),
];

/**
 * Proveedor de mentira de pasos de progreso (N0-61): dos ejercicios de la guía
 * (uno hecho) y uno de parcial en la unidad 1, ninguno en el resto.
 */
const PASOS: Record<string, ExtraStep[]> = {
  "1": [
    { id: "ej:g1", label: "Ejercicio 1", done: true, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
    { id: "ej:g2", label: "Ejercicio 2", done: false, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
    { id: "ej:p1", label: "Parcial 2024", done: false, group: "Parciales", to: "/m/proba/t/ejercicios?arg=1%2Fparciales", source: "ejercicios" },
  ],
};

function renderDivision(key: string, studied: string[] = [], pasos = false) {
  const detail: SubjectDetail = { config, pages, studied, placeholder: false, lastSyncAt: null };
  const ctx = {
    slug: "proba",
    model: buildSubjectModel(detail, false, pasos ? { extraSteps: (d) => PASOS[d] ?? [] } : {}),
    openSearch: () => {},
    runtime: { ready: false } as unknown as SubjectCtx["runtime"],
  } satisfies SubjectCtx;
  return render(
    <MemoryRouter initialEntries={[`/m/proba/d/${key}`]}>
      <Routes>
        <Route path="/m/:slug" element={<Outlet context={ctx} />}>
          <Route path="d/:division" element={<DivisionView />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(cleanup);

describe("DivisionView", () => {
  it("abre con la barra de vuelta al catálogo", () => {
    renderDivision("1");
    expect(screen.getByRole("link", { name: "Todo el wiki" }).getAttribute("href")).toBe("/m/proba/wiki");
  });

  it("nombra el tramo sin jerga de plataforma y sin recortar el nombre", () => {
    renderDivision("1");
    expect(screen.getByText("Unidad 1")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Estadística Descriptiva");

    cleanup();
    renderDivision("eval");
    /* El epígrafe nombra la sección, como el original: ni «Sección extra» ni el
       nombre recortado a «Evalua.» al lado del nombre entero. */
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Evaluaciones");
    expect(screen.getAllByText("Evaluaciones")).toHaveLength(2);
    expect(screen.queryByText(/Sección extra/i)).toBeNull();
    expect(screen.queryByText("Evalua.")).toBeNull();
  });

  it("muestra el progreso con porcentaje", () => {
    renderDivision("1", ["media"]);
    expect(screen.getByText("1 / 3 páginas leídas")).toBeTruthy();
    expect(screen.getByText("33%")).toBeTruthy();
  });

  it("la barra suma los ejercicios de la unidad y el texto los nombra aparte", () => {
    renderDivision("1", ["media"], true);
    /* 1 de 3 páginas + 1 de 3 ejercicios = 2 de 6 → 33 %, y el texto conserva
       el conteo de páginas tal como estaba. */
    expect(screen.getByText(/1 \/ 3 páginas leídas/)).toBeTruthy();
    expect(screen.getByText(/1 \/ 3 ejercicios resueltos/)).toBeTruthy();
    expect(screen.getByText("33%")).toBeTruthy();
  });

  it("sin pasos de bundles el hero no menciona ejercicios", () => {
    renderDivision("1", ["media"]);
    expect(screen.queryByText(/ejercicios resueltos/)).toBeNull();
    expect(screen.queryByRole("heading", { name: "Ejercicios" })).toBeNull();
  });

  it("lista una tarjeta por grupo de ejercicios, con su destino y su estado", () => {
    renderDivision("1", [], true);
    const seccion = screen.getByRole("heading", { name: "Ejercicios" }).closest("section")!;
    const guia = within(seccion).getByText("Guía").closest("a")!;
    expect(guia.getAttribute("href")).toBe("/m/proba/t/ejercicios?arg=1%2Fguia");
    expect(within(seccion).getByText("1 de 2 resueltos")).toBeTruthy();
    /* El grupo sin nada resuelto dice cuántos hay, no «0 de N». */
    expect(within(seccion).getByText("Parciales")).toBeTruthy();
    expect(within(seccion).getByText("1 ejercicio")).toBeTruthy();
  });

  it("un grupo entero resuelto se marca como completo", () => {
    const detail: SubjectDetail = { config, pages, studied: [], placeholder: false, lastSyncAt: null };
    const ctx = {
      slug: "proba",
      model: buildSubjectModel(detail, false, {
        extraSteps: (d) =>
          d === "1" ? [{ id: "u", label: "Único", done: true, group: "Guía", source: "ejercicios" }] : [],
      }),
      openSearch: () => {},
      runtime: { ready: false } as unknown as SubjectCtx["runtime"],
    } satisfies SubjectCtx;
    render(
      <MemoryRouter initialEntries={["/m/proba/d/1"]}>
        <Routes>
          <Route path="/m/:slug" element={<Outlet context={ctx} />}>
            <Route path="d/:division" element={<DivisionView />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("1 de 1 resuelto")).toBeTruthy();
    expect(screen.getByText("completo")).toBeTruthy();
  });

  it("la acción primaria empieza la división y, con progreso, la retoma", () => {
    renderDivision("1");
    /* El hub abre la secuencia aunque tenga `order: 3`. */
    expect(screen.getByRole("link", { name: "Empezar a leer" }).getAttribute("href")).toBe("/m/proba/p/hub-1");

    cleanup();
    renderDivision("1", ["hub-1"]);
    expect(screen.getByRole("link", { name: "Continuar leyendo" }).getAttribute("href")).toBe("/m/proba/p/media");
  });

  it("dibuja la tarjeta de panorama con el hub y su extracto", () => {
    renderDivision("1");
    expect(screen.getByText("Panorama de la unidad")).toBeTruthy();
    const card = screen.getByText("Panorama de la unidad").closest("section");
    expect(card).not.toBeNull();
    expect(within(card as HTMLElement).getByText("hub")).toBeTruthy();
    expect(within(card as HTMLElement).getByText(/Resumir y describir una muestra/)).toBeTruthy();
  });

  it("sin hub, el panorama es «Para empezar»", () => {
    renderDivision("2");
    expect(screen.getByText("Para empezar")).toBeTruthy();
  });

  it("titula el temario y cuenta las páginas del grupo", () => {
    renderDivision("1");
    const temario = screen.getByRole("heading", { level: 2, name: /Temario/ });
    expect(temario).toBeTruthy();
    expect(screen.getByText("Páginas en orden de aparición")).toBeTruthy();
    expect(screen.getByRole("list", { name: /Temario/ })).toBeTruthy();
    const filas = within(screen.getByRole("list", { name: /Temario/ })).getAllByRole("listitem");
    expect(filas).toHaveLength(3);
  });

  it("cada fila lleva rótulo de tipo y la leída cambia el número por el tilde", () => {
    renderDivision("1", ["media"]);
    expect(screen.getByText("Teorema")).toBeTruthy();
    expect(screen.getByTitle("Leída")).toBeTruthy();
    /* Quedan los números de las dos sin leer: 01 (el hub) y 03. */
    expect(screen.getByText("01")).toBeTruthy();
    expect(screen.queryByText("02")).toBeNull();
    expect(screen.getByText("03")).toBeTruthy();
  });

  it("pliega las fuentes y las ordena por título al abrirlas", () => {
    renderDivision("1");
    const boton = screen.getByRole("button", { name: "Fuentes de esta unidad (2)" });
    expect(boton.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(boton);
    expect(boton.getAttribute("aria-expanded")).toBe("true");
    const titulos = screen.getAllByRole("link").map((a) => a.textContent ?? "");
    const fuentes = titulos.filter((t) => t.includes("Introducción") || t.includes("Teórica general"));
    expect(fuentes[0]).toContain("01 - Introducción");
    expect(fuentes[1]).toContain("02 - Teórica general");
  });

  it("salta a la división vecina y no ofrece anterior en la primera", () => {
    renderDivision("1");
    const nav = screen.getByRole("navigation", { name: /Navegación entre unidades/i });
    expect(within(nav).getByRole("link").getAttribute("href")).toBe("/m/proba/d/2");
    expect(within(nav).getByText(/Siguiente unidad/)).toBeTruthy();

    cleanup();
    renderDivision("2");
    const nav2 = screen.getByRole("navigation", { name: /Navegación entre unidades/i });
    expect(within(nav2).getByRole("link").getAttribute("href")).toBe("/m/proba/d/1");
    expect(within(nav2).getByText(/Unidad anterior/)).toBeTruthy();
  });
});
