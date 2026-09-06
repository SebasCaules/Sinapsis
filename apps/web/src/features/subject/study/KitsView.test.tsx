/**
 * La lista de kits: porcentaje por tarjeta (para comparar kits de distinto
 * tamaño), conteo de herramientas que incluye los ítems del rail que no son
 * `kind: "tool"`, nada dibujado en cero, el total de páginas DISTINTAS y la
 * salida hacia el plan.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import {
  SubjectConfig,
  type PageMeta,
  type StudyContent,
  type StudyState,
  type SubjectDetail,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import type { SubjectCtx } from "../context";
import { buildSubjectModel } from "../model";
import { IDLE_RUNTIME } from "../tools/useRuntime";
import { KitsView } from "./KitsView";

const config = SubjectConfig.parse(rawProbaConfig);

function meta(slug: string, title: string, division: string): PageMeta {
  return {
    slug,
    title,
    type: "concepto",
    folder: "conceptos",
    division,
    summary: "",
    tags: [],
    sources: [],
    words: 100,
    updatedAt: "2026-09-01",
  };
}

const pages: PageMeta[] = [
  meta("descriptiva", "Estadística descriptiva", "1"),
  meta("probabilidad", "Probabilidad", "2"),
  meta("formulario-maestro", "Formulario general", "0"),
];

const detail: SubjectDetail = {
  config,
  pages,
  studied: ["descriptiva"],
  placeholder: false,
  lastSyncAt: null,
};

const ctx: SubjectCtx = {
  slug: "proba",
  model: buildSubjectModel(detail),
  openSearch: () => undefined,
  runtime: IDLE_RUNTIME,
};

/* Dos kits que COMPARTEN una página: el total de la cabecera cuenta distintas. */
const content: StudyContent = {
  decks: [],
  quizzes: [],
  plan: null,
  kits: [
    {
      id: "k1",
      title: "Parcialito 1",
      description: "Unidades 1 y 2.",
      icon: "timer",
      color: "--u1",
      divisions: ["1", "2"],
      pages: ["descriptiva", "probabilidad"],
      decks: [],
      quizzes: [],
      tools: ["calc", "formularios"],
    },
    {
      id: "k2",
      title: "Repaso exprés",
      description: "La última semana.",
      icon: "sparkle",
      color: "--u7",
      divisions: ["1"],
      pages: ["descriptiva"],
      decks: [],
      quizzes: [],
      tools: ["formularios"],
    },
  ],
};

const state: StudyState = {
  srs: [],
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

function renderKits() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, networkMode: "always" } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/m/proba/kits"]}>
        <Routes>
          <Route path="/m/:subject" element={<Outlet context={ctx} />}>
            <Route path="kits" element={<KitsView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

/** Los renglones de «de qué está hecho» de una tarjeta, ya normalizados. */
const parts = (el: HTMLElement): string[] =>
  Array.from(el.querySelectorAll("li")).map((li) => (li.textContent ?? "").replace(/\s+/g, " ").trim());

describe("<KitsView/>", () => {
  it("cuenta las páginas distintas de todos los kits, no la suma con repetidos", async () => {
    renderKits();
    await screen.findByRole("heading", { name: "Kits de estudio", level: 1 });
    /* k1 (2 páginas) + k2 (1, repetida) = 2 distintas, no 3. */
    expect(screen.getByText("PÁGINAS").previousSibling?.textContent).toBe("2");
  });

  it("da a cada tarjeta su porcentaje de lectura", async () => {
    renderKits();
    const [uno, dos] = await screen.findAllByTestId("kit-card");
    /* k1: una de dos páginas leídas. k2: su única página, leída. */
    expect(within(uno!).getByText("50%")).toBeTruthy();
    expect(within(dos!).getByText("100%")).toBeTruthy();
  });

  it("cuenta las herramientas que el rail sabe abrir y no dibuja lo que está en cero", async () => {
    renderKits();
    const tarjetas = await screen.findAllByTestId("kit-card");
    /* «calc» (tool) + «formularios» (page): antes solo contaba la primera, y
       las tarjetas decían además «0 mazos» y «0 quizzes». */
    expect(parts(tarjetas[0]!)).toEqual(["2 herramientas", "2 páginas"]);
    expect(parts(tarjetas[1]!)).toEqual(["1 herramienta", "1 página"]);
  });

  it("cierra la lista con la salida hacia el plan", async () => {
    renderKits();
    const plan = await screen.findByRole("link", { name: "Ir al plan de estudio" });
    expect(plan.getAttribute("href")).toBe("/m/proba/plan");
  });
});
