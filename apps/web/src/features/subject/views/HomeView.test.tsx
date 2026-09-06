/**
 * Inicio de la materia: el panel de control (brechas «inicio»).
 *
 * Se comprueba lo que el baseline muestra y Sinapsis había perdido: el
 * porcentaje del progreso (global y por división), la barra SEGMENTADA con su
 * nombre accesible, la tira de racha de 14 días, «continuar leyendo», el paso
 * directo a la sesión de repaso, los anillos por fase del plan y la grilla de
 * herramientas.
 *
 * El API se reemplaza por la MISMA costura del modo mock (`lib/api` es un objeto
 * mutable): no hay red ni fixtures escondidas.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import {
  StudyContent,
  SubjectConfig,
  type PageMeta,
  type StudyState,
  type SubjectDetail,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import { recordActivity, setLastRead } from "../activity";
import type { SubjectCtx } from "../context";
import { buildSubjectModel } from "../model";
import { resetPlanTracksForTests } from "../store";
import { IDLE_RUNTIME } from "../tools/useRuntime";
import { HomeView } from "./HomeView";

const config = SubjectConfig.parse(rawProbaConfig);

/** Una página del wiki con los valores por defecto del contrato. */
function page(slug: string, title: string, division: string, order: number, type = "concepto"): PageMeta {
  return {
    slug,
    title,
    type,
    folder: "",
    division,
    order,
    summary: "",
    tags: [],
    sources: [],
    words: 100,
  };
}

/* Cuatro páginas en dos unidades: alcanza para que el progreso tenga dos filas
   con números distintos y para que haya una «siguiente sin leer». */
const PAGES: PageMeta[] = [
  page("u1-a", "Estadística descriptiva", "1", 1),
  page("u1-b", "Medidas de dispersión", "1", 2),
  page("u2-a", "Axiomas de probabilidad", "2", 1),
  page("u2-b", "Probabilidad condicional", "2", 2),
];

function detailWith(studied: string[]): SubjectDetail {
  return { config, pages: PAGES, studied, placeholder: false, lastSyncAt: null };
}

/** Un mazo de dos tarjetas y un plan de dos fases (tres tareas). */
const content: StudyContent = StudyContent.parse({
  decks: [
    {
      id: "d1",
      title: "Unidad 1",
      cards: [
        { id: "c1", front: "¿Media?", back: "Suma sobre n" },
        { id: "c2", front: "¿Mediana?", back: "El valor del medio" },
      ],
    },
  ],
  quizzes: [],
  kits: [],
  plan: {
    title: "Plan de estudio",
    instances: [],
    phases: [
      {
        id: "p1",
        title: "Parcialito 1",
        milestones: [
          {
            id: "m1",
            title: "Descriptiva",
            divisions: ["1"],
            tasks: [
              { id: "t1", label: "Leer la unidad 1", kind: "custom" },
              { id: "t2", label: "Resolver la guía 1", kind: "custom" },
            ],
          },
        ],
      },
      {
        id: "p2",
        title: "Parcial",
        milestones: [
          {
            id: "m2",
            title: "Probabilidad",
            divisions: ["2"],
            tasks: [{ id: "t3", label: "Repasar Bayes", kind: "custom" }],
          },
        ],
      },
    ],
  },
});

const EMPTY_STUDY: StudyContent = StudyContent.parse({});

function stateWith(patch: Partial<StudyState> = {}): StudyState {
  return { srs: [], bookmarks: [], notes: [], planDates: {}, tasksDone: [], attempts: [], ...patch };
}

let original: ApiClient["study"];

beforeEach(() => {
  original = { ...api.study };
  api.study.content = async () => content;
  api.study.state = async () => stateWith();
  localStorage.clear();
  resetPlanTracksForTests();
});

afterEach(() => {
  Object.assign(api.study, original);
  localStorage.clear();
  resetPlanTracksForTests();
  cleanup();
});

function renderHome(studied: string[] = ["u1-a"]) {
  const ctx: SubjectCtx = {
    slug: "proba",
    model: buildSubjectModel(detailWith(studied)),
    openSearch: () => undefined,
    runtime: IDLE_RUNTIME,
  };
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, networkMode: "always" },
      mutations: { retry: false, networkMode: "always" },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/m/proba"]}>
        <Routes>
          <Route path="/m/:subject" element={<Outlet context={ctx} />}>
            <Route index element={<HomeView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("<HomeView/> · progreso", () => {
  it("muestra el porcentaje global y el de cada división", async () => {
    renderHome(["u1-a"]);
    await screen.findByRole("heading", { name: "Progreso", level: 1 });

    // 1 de 4 páginas de contenido.
    expect(screen.getByText("25%")).toBeTruthy();
    expect(screen.getByText("1 / 4 páginas")).toBeTruthy();

    const fila = screen.getByRole("link", { name: "U1 Estadística Descriptiva 1/2 50%" });
    expect(within(fila).getByText("1/2")).toBeTruthy();
    expect(within(fila).getByText("50%")).toBeTruthy();
  });

  it("sin nada leído no repite una columna de ceros", async () => {
    renderHome([]);
    await screen.findByRole("heading", { name: "Progreso", level: 1 });
    expect(screen.queryByText("0%")).toBeNull();
  });

  it("la barra total tiene nombre accesible y un tramo por división con su tooltip", async () => {
    const { container } = renderHome(["u1-a", "u2-a"]);
    await screen.findByRole("heading", { name: "Progreso", level: 1 });

    expect(screen.getByRole("img", { name: "Progreso total: 50%" })).toBeTruthy();
    const tramos = [...container.querySelectorAll("i[title]")].map((n) => n.getAttribute("title"));
    expect(tramos).toEqual(["U1: 1", "U2: 1"]);
  });

  it("cada fila lleva el código corto además del nombre", async () => {
    renderHome(["u1-a"]);
    await screen.findByRole("heading", { name: "Progreso", level: 1 });
    const fila = screen.getByRole("link", { name: "U1 Estadística Descriptiva 1/2 50%" });
    expect(within(fila).getByText("U1")).toBeTruthy();
    expect(within(fila).getByText("Estadística Descriptiva")).toBeTruthy();
  });
});

describe("<HomeView/> · para hoy", () => {
  it("cuenta las tarjetas PENDIENTES (vencidas + nuevas) y entra directo a la sesión", async () => {
    renderHome(["u1-a"]);
    const cta = await screen.findByRole("link", { name: /Repasar 2 tarjetas pendientes/ });
    // La sesión de todos los mazos, no la lista de mazos.
    expect(cta.getAttribute("href")).toBe("/m/proba/flashcards/todo?modo=nuevas");
  });

  it("al día, la tarjeta sigue en pantalla y lo dice", async () => {
    const manana = new Date(Date.now() + 3 * 86_400_000).toISOString();
    api.study.state = async () =>
      stateWith({
        srs: [
          { cardId: "c1", due: manana, interval: 30, ease: 2.5, reps: 4, lapses: 0, lastGrade: 3, updatedAt: manana },
          { cardId: "c2", due: manana, interval: 30, ease: 2.5, reps: 4, lapses: 0, lastGrade: 3, updatedAt: manana },
        ],
      });
    renderHome(["u1-a"]);
    expect(await screen.findByText("Sin tarjetas pendientes para hoy.")).toBeTruthy();
  });

  it("dibuja la racha de 14 días y cuenta el día de hoy", async () => {
    recordActivity("proba");
    const { container } = renderHome(["u1-a"]);
    await screen.findByRole("heading", { name: "Progreso", level: 1 });

    expect(screen.getByText("RACHA · 1 día")).toBeTruthy();
    const tira = screen.getByRole("img", { name: /Racha de 1 día: 1 de los últimos 14 días con estudio/ });
    expect(within(tira).getAllByTitle(/^\d{4}-\d{2}-\d{2}/).length).toBe(14);
    expect(container.querySelectorAll("[title$='· con actividad']").length).toBe(1);
  });
});

describe("<HomeView/> · plan", () => {
  it("muestra un anillo por fase, cada uno a su fase del plan", async () => {
    renderHome(["u1-a"]);
    const p1 = await screen.findByRole("link", { name: /Parcialito 1: 0 de 2/ });
    expect(p1.getAttribute("href")).toBe("/m/proba/plan?fase=p1");
    expect(screen.getByRole("link", { name: /Parcial: 0 de 1/ }).getAttribute("href")).toBe(
      "/m/proba/plan?fase=p2",
    );
    // Las dos salidas del baseline: el plan y los kits.
    expect(screen.getByRole("link", { name: "Abrir el plan" }).getAttribute("href")).toBe("/m/proba/plan");
    expect(screen.getByRole("link", { name: "Kits de estudio" }).getAttribute("href")).toBe("/m/proba/kits");
  });

  it("sin plan no dibuja la tarjeta", async () => {
    api.study.content = async () => EMPTY_STUDY;
    renderHome(["u1-a"]);
    await screen.findByRole("heading", { name: "Progreso", level: 1 });
    expect(screen.queryByText(/PLAN DE ESTUDIO/)).toBeNull();
  });
});

describe("<HomeView/> · seguir estudiando", () => {
  it("recuerda la última página abierta y ofrece también la siguiente sin leer", async () => {
    setLastRead("proba", "u1-a");
    renderHome(["u1-a"]);
    await screen.findByRole("heading", { name: "Seguir estudiando", level: 2 });

    expect(screen.getByText("CONTINUAR LEYENDO")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Estadística descriptiva U1 · Concepto · ✓ leída" })).toBeTruthy();
    expect(screen.getByText("SIGUIENTE RECOMENDADO")).toBeTruthy();
  });

  it("en el primer uso el botón nombra la página que abre, no la división", async () => {
    renderHome([]);
    const cta = await screen.findByRole("link", { name: "Empezar por U1 · Estadística descriptiva" });
    expect(cta.getAttribute("href")).toBe("/m/proba/p/u1-a");
    // El secundario lleva al plan, no al catálogo.
    expect(screen.getByRole("link", { name: "Ver el plan de estudio" }).getAttribute("href")).toBe("/m/proba/plan");
    // Y no se invita a «volver a leer» algo que nunca se abrió.
    expect(screen.queryByText(/VOLVER A LEER/)).toBeNull();
  });
});

describe("<HomeView/> · herramientas", () => {
  it("arma la grilla con lo mismo que el rail, sin repetir «Inicio»", async () => {
    renderHome(["u1-a"]);
    await screen.findByRole("heading", { name: "Herramientas", level: 2 });

    const grilla = screen.getByRole("heading", { name: "Herramientas", level: 2 }).parentElement!;
    const titulos = [...grilla.querySelectorAll("a")].map((a) => a.textContent ?? "");
    expect(titulos.some((t) => t.startsWith("Plan de estudio"))).toBe(true);
    expect(titulos.some((t) => t.startsWith("Todo el wiki"))).toBe(true);
    expect(titulos.some((t) => t.startsWith("Explorador de distribuciones"))).toBe(true);
    expect(titulos.some((t) => t.startsWith("Inicio"))).toBe(false);
  });
});
