/**
 * El plan con MODALIDADES (S-11 / N0-43): el conmutador de arriba cambia las
 * fases que se dibujan, el progreso y «lo próximo», la elección se recuerda por
 * materia, y una tarea tildada sigue tildada en la otra vía porque los ids de
 * tarea son globales al plan.
 *
 * El API se reemplaza por la MISMA costura del modo mock (`lib/api` es un objeto
 * mutable): no hay red ni fixtures escondidas.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { SubjectConfig, type StudyContent, type StudyState, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import type { SubjectCtx } from "../context";
import { buildSubjectModel } from "../model";
import { resetPlanTracksForTests } from "../store";
import { IDLE_RUNTIME } from "../tools/useRuntime";
import { PlanView } from "./PlanView";

const config = SubjectConfig.parse(rawProbaConfig);
const detail: SubjectDetail = { config, pages: [], studied: [], placeholder: false, lastSyncAt: null };
const ctx: SubjectCtx = {
  slug: "proba",
  model: buildSubjectModel(detail),
  openSearch: () => undefined,
  runtime: IDLE_RUNTIME,
};

/**
 * Dos modalidades sobre las mismas tareas: la cursada las reparte en dos fases
 * (cuatro tareas) y el final directo las junta en una sola (dos tareas, de las
 * cuales una —`t-leer`— es la MISMA que la cursada).
 */
const content: StudyContent = {
  decks: [],
  quizzes: [],
  kits: [],
  plan: {
    title: "Plan de estudio",
    instances: [],
    phases: [
      {
        id: "p-unica",
        title: "Fase por defecto",
        milestones: [
          {
            id: "m-default",
            title: "Hito por defecto",
            divisions: [],
            tasks: [{ id: "t-default", label: "Tarea por defecto", kind: "custom" }],
          },
        ],
      },
    ],
    tracks: [
      {
        id: "cursada",
        label: "Cursada y final",
        description: "Dos parciales y el final.",
        phases: [
          {
            id: "p-parcial",
            title: "Primer parcial",
            milestones: [
              {
                id: "m-parcial",
                title: "Descriptiva",
                divisions: [],
                tasks: [
                  { id: "t-leer", label: "Leer la unidad 1", kind: "custom" },
                  { id: "t-tp", label: "Resolver el TP1", kind: "custom" },
                ],
              },
            ],
          },
          {
            id: "p-final",
            title: "Final de cursada",
            milestones: [
              {
                id: "m-final",
                title: "Repaso",
                divisions: [],
                tasks: [
                  { id: "t-quiz", label: "Hacer el quiz", kind: "custom" },
                  { id: "t-tabla", label: "Practicar con la tabla", kind: "custom" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "final-directo",
        label: "Final directo",
        description: "Una sola instancia.",
        phases: [
          {
            id: "p-libre",
            title: "Final libre",
            milestones: [
              {
                id: "m-libre",
                title: "Todo junto",
                divisions: [],
                tasks: [
                  { id: "t-leer", label: "Leer la unidad 1", kind: "custom" },
                  { id: "t-formulario", label: "Armar el formulario", kind: "custom" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

/** `t-leer` está hecha: aparece en las DOS modalidades. */
const state: StudyState = {
  srs: [],
  bookmarks: [],
  notes: [],
  planDates: {},
  tasksDone: ["t-leer"],
  attempts: [],
};

let original: ApiClient["study"];

beforeEach(() => {
  original = { ...api.study };
  api.study.content = async () => content;
  api.study.state = async () => state;
  localStorage.clear();
  resetPlanTracksForTests();
});

afterEach(() => {
  Object.assign(api.study, original);
  localStorage.clear();
  resetPlanTracksForTests();
  cleanup();
});

function renderPlan() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, networkMode: "always" },
      mutations: { retry: false, networkMode: "always" },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/m/proba/plan"]}>
        <Routes>
          <Route path="/m/:subject" element={<Outlet context={ctx} />}>
            <Route path="plan" element={<PlanView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const phases = () => screen.getAllByTestId("plan-phase").map((el) => el.getAttribute("data-phase"));
const total = () => screen.getByTestId("plan-total").textContent;

describe("<PlanView/> con modalidades", () => {
  it("arranca en la primera modalidad y cuenta solo sus fases", async () => {
    renderPlan();
    await screen.findByRole("radiogroup", { name: "MODALIDAD" });

    const cursada = screen.getByRole("radio", { name: "Cursada y final" });
    expect(cursada.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Final directo" }).getAttribute("aria-checked")).toBe("false");

    expect(phases()).toEqual(["p-parcial", "p-final"]);
    /* Cuatro tareas en la cursada, una hecha. La fase por defecto del plan
       (`p-unica`) no se cuenta: hay modalidades y manda la activa. */
    expect(total()).toBe("1/4");
    expect(screen.getByText("Dos parciales y el final.")).toBeTruthy();
  });

  it("cambiar de modalidad cambia las fases, el progreso y «lo próximo»", async () => {
    renderPlan();
    await screen.findByRole("radiogroup", { name: "MODALIDAD" });
    /* Aparece dos veces: en «Lo próximo» de la cabecera y en su hito. */
    expect(screen.getAllByText("Resolver el TP1").length).toBe(2);

    fireEvent.click(screen.getByRole("radio", { name: "Final directo" }));

    await waitFor(() => expect(phases()).toEqual(["p-libre"]));
    expect(total()).toBe("1/2");
    expect(screen.getByRole("radio", { name: "Final directo" }).getAttribute("aria-checked")).toBe("true");
    /* Lo que solo existe en la cursada deja de estar a la vista. */
    expect(screen.queryAllByText("Resolver el TP1")).toHaveLength(0);
    /* «Lo próximo» es de la modalidad activa, no del plan entero: la primera
       pendiente del final directo (la de leer ya está hecha). */
    expect(screen.getAllByText("Armar el formulario").length).toBe(2);
  });

  it("una tarea de id compartido se ve tildada en las dos modalidades", async () => {
    renderPlan();
    await screen.findByRole("radiogroup", { name: "MODALIDAD" });

    const enCursada = screen.getByRole("checkbox", { name: /Leer la unidad 1/ }) as HTMLInputElement;
    expect(enCursada.checked).toBe(true);

    fireEvent.click(screen.getByRole("radio", { name: "Final directo" }));
    await waitFor(() => expect(phases()).toEqual(["p-libre"]));

    const enFinal = screen.getByRole("checkbox", { name: /Leer la unidad 1/ }) as HTMLInputElement;
    expect(enFinal.checked).toBe(true);
  });

  it("recuerda la modalidad por materia", async () => {
    const view = renderPlan();
    await screen.findByRole("radiogroup", { name: "MODALIDAD" });
    fireEvent.click(screen.getByRole("radio", { name: "Final directo" }));
    await waitFor(() => expect(localStorage.getItem("sinapsis.proba.planTrack")).toBe("final-directo"));

    view.unmount();
    cleanup();
    renderPlan();
    await screen.findByRole("radiogroup", { name: "MODALIDAD" });
    expect(screen.getByRole("radio", { name: "Final directo" }).getAttribute("aria-checked")).toBe("true");
    expect(phases()).toEqual(["p-libre"]);
  });

  it("las flechas recorren el grupo de radios", async () => {
    renderPlan();
    const group = await screen.findByRole("radiogroup", { name: "MODALIDAD" });
    const cursada = within(group).getByRole("radio", { name: "Cursada y final" });
    /* Solo la activa entra en la tabulación: adentro se mueve uno con flechas. */
    expect(cursada.getAttribute("tabindex")).toBe("0");

    fireEvent.keyDown(cursada, { key: "ArrowRight" });
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "Final directo" }).getAttribute("aria-checked")).toBe("true"),
    );
  });
});
