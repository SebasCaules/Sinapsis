/**
 * La lista de mazos: los dos accesos sintéticos de arriba («Repaso de hoy» y
 * «Todas las tarjetas»), el rótulo de la acción de cada mazo —que tiene que
 * decir la MISMA cifra que abre la sesión— y la separación entre los mazos de la
 * materia y los que arma la plataforma.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { SubjectConfig, type StudyContent, type StudyState, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import type { SubjectCtx } from "../context";
import { buildSubjectModel } from "../model";
import { IDLE_RUNTIME } from "../tools/useRuntime";
import { FlashcardsView } from "./FlashcardsView";

const config = SubjectConfig.parse(rawProbaConfig);
const detail: SubjectDetail = { config, pages: [], studied: [], placeholder: false, lastSyncAt: null };
const ctx: SubjectCtx = {
  slug: "proba",
  model: buildSubjectModel(detail),
  openSearch: () => {},
  runtime: IDLE_RUNTIME,
};

const card = (id: string) => ({ id, front: `Anverso ${id}`, back: `Reverso ${id}`, tags: [] });

const content: StudyContent = {
  decks: [
    { id: "d1", title: "Mazo de la materia", source: "authored", cards: [card("c1"), card("c2"), card("c3")] },
    { id: "auto-1", title: "Resúmenes · Unidad 1", source: "auto", cards: [card("a1"), card("a2")] },
  ],
  quizzes: [],
  plan: null,
  kits: [],
};

/** Una tarjeta ya estudiada y vencida: el mazo tiene 1 vencida + 2 nuevas = 3 pendientes. */
const ayer = new Date(Date.now() - 86_400_000).toISOString();
const state: StudyState = {
  srs: [
    { cardId: "c1", ease: 2.5, interval: 1, due: ayer, reps: 1, lapses: 0, lastGrade: 3, updatedAt: ayer },
  ],
  bookmarks: [],
  notes: [],
  planDates: {},
  tasksDone: [],
  attempts: [],
};

let original: ApiClient["study"];

beforeEach(() => {
  original = { ...api.study };
  api.study.content = async () => content;
  api.study.state = async () => state;
});

afterEach(() => {
  Object.assign(api.study, original);
  cleanup();
});

function renderList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, networkMode: "always" } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/m/proba/flashcards"]}>
        <Routes>
          <Route path="/m/:subject" element={<Outlet context={ctx} />}>
            <Route path="flashcards" element={<FlashcardsView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const deck = (id: string) => document.querySelector(`[data-deck="${id}"]`) as HTMLElement;

describe("<FlashcardsView/>", () => {
  it("ofrece el repaso de hoy y el mazo entero, con las cifras que abren de verdad", async () => {
    renderList();
    /* 1 vencida + 4 nuevas = 5 pendientes; 5 tarjetas en total. */
    const hoy = await screen.findByRole("link", { name: /Repaso de hoy \(5\)/ });
    expect(hoy.getAttribute("href")).toBe("/m/proba/flashcards/todo?modo=vencidas");

    /* «Todas las tarjetas» existe siempre, no solo cuando queda algo pendiente. */
    const todas = screen.getByRole("link", { name: /Todas las tarjetas \(5\)/ });
    expect(todas.getAttribute("href")).toBe("/m/proba/flashcards/todo?modo=todo");
  });

  it("el mazo rotula PENDIENTES, no vencidas: es lo que trae la cola", async () => {
    renderList();
    await screen.findByRole("heading", { name: "Flashcards", level: 1 });
    /* 1 vencida + 2 nuevas: el botón decía «Repasar vencidas (1)» y abría 3. */
    const accion = within(deck("d1")).getByRole("link", { name: /Repasar pendientes \(3\)/ });
    expect(accion.getAttribute("href")).toBe("/m/proba/flashcards/d1?modo=vencidas");
  });

  it("el título del mazo es el enlace a su acción principal", async () => {
    renderList();
    await screen.findByRole("heading", { name: "Flashcards", level: 1 });
    const titulo = within(deck("d1")).getByRole("link", { name: "Mazo de la materia" });
    expect(titulo.getAttribute("href")).toBe("/m/proba/flashcards/d1?modo=vencidas");
  });

  it("separa los mazos de la materia de los resúmenes automáticos", async () => {
    renderList();
    expect(await screen.findByRole("heading", { name: "Mazos de la materia" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Resúmenes automáticos" })).toBeTruthy();
    expect(deck("auto-1").textContent).toContain("Automático");
  });

  it("un mazo sin estudiar no repite tres ceros y una barra vacía", async () => {
    renderList();
    await screen.findByRole("heading", { name: "Flashcards", level: 1 });
    /* `auto-1` no tiene ninguna tarjeta con estado: no se dibujan las cifras. */
    expect(within(deck("auto-1")).queryByText("DOMINADAS")).toBeNull();
    /* `d1` sí tiene una: ahí las cifras dicen algo. */
    expect(within(deck("d1")).getByText("DOMINADAS")).toBeTruthy();
  });
});
