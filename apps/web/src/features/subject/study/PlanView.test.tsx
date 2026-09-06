/**
 * El plan con MODALIDADES (S-11 / N0-43): el conmutador de arriba cambia las
 * fases que se dibujan, el progreso y «lo próximo», la elección se recuerda por
 * materia, y una tarea tildada sigue tildada en la otra vía porque los ids de
 * tarea son globales al plan.
 *
 * El cliente de datos se reemplaza por la MISMA costura del modo mock (`lib/api` es un objeto
 * mutable): no hay red ni fixtures escondidas.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { SubjectConfig, type StudyContent, type StudyState, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
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

  /**
   * En un `radiogroup` el foco SIGUE a la selección (APG). Con el tabindex
   * rotativo del grupo, quedarse sobre el botón anterior deja el foco en un
   * radio recién desmarcado y con `tabIndex=-1`: un lector de pantalla solo
   * anuncia que se desmarcó y nunca cuál quedó activa.
   */
  it("la flecha mueve el foco al radio que quedó activo", async () => {
    renderPlan();
    const group = await screen.findByRole("radiogroup", { name: "MODALIDAD" });
    const cursada = within(group).getByRole("radio", { name: "Cursada y final" });
    const directo = within(group).getByRole("radio", { name: "Final directo" });

    cursada.focus();
    expect(document.activeElement).toBe(cursada);

    fireEvent.keyDown(cursada, { key: "ArrowRight" });
    await waitFor(() => expect(directo.getAttribute("aria-checked")).toBe("true"));
    expect(document.activeElement).toBe(directo);
    expect(directo.getAttribute("tabindex")).toBe("0");
    expect(cursada.getAttribute("tabindex")).toBe("-1");

    /* Y vuelve: la flecha contraria devuelve selección Y foco. */
    fireEvent.keyDown(directo, { key: "ArrowLeft" });
    await waitFor(() => expect(cursada.getAttribute("aria-checked")).toBe("true"));
    expect(document.activeElement).toBe(cursada);
  });
});

/* ==========================================================================
   Fechas de las instancias (Sprint 3 · D7)
   Las fechas de los parcialitos, el parcial y su recuperatorio las carga el
   usuario y viven en su cuenta. Acá se comprueba el circuito entero de la
   vista: cargar, ver la cuenta regresiva, vaciar, borrarlas todas, y que
   reiniciar el progreso NO las toque.
   ========================================================================== */

/** `AAAA-MM-DD` del día local que cae dentro de `days` días. */
function isoIn(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const PARCIAL = "Parcial (TP1–TP7)";
const RECUPERATORIO = "Recuperatorio del parcial";

const conFechas: StudyContent = {
  decks: [],
  quizzes: [],
  kits: [],
  plan: {
    title: "Plan de estudio",
    instances: [
      { key: "parcial", label: PARCIAL, optional: false },
      { key: "recparcial", label: RECUPERATORIO, optional: true },
    ],
    phases: [
      {
        id: "fase-parcial",
        title: "Parcial",
        subtitle: "TP1 a TP7",
        description: "Integra todo lo anterior.",
        instance: "parcial",
        retake: "recparcial",
        scope: "**Qué cae:**\n- Bayes\n- Normal",
        milestones: [
          {
            id: "m-parcial",
            title: "Repaso general",
            divisions: [],
            tasks: [
              { id: "tp-1", label: "Resolver el TP5", kind: "custom" },
              { id: "tp-2", label: "Resolver el TP6", kind: "custom" },
            ],
          },
        ],
      },
    ],
    tracks: [],
  },
};

describe("<PlanView/> · fechas de las instancias", () => {
  let dates: Record<string, string>;
  let tasksDone: string[];
  let calls: string[];

  beforeEach(() => {
    dates = {};
    tasksDone = ["tp-1"];
    calls = [];
    api.study.content = async () => conFechas;
    api.study.state = async (): Promise<StudyState> => ({
      srs: [],
      bookmarks: [],
      notes: [],
      planDates: { ...dates },
      tasksDone: [...tasksDone],
      attempts: [],
    });
    api.study.setPlanDate = async (_slug: string, key: string, date: string) => {
      calls.push(`set:${key}:${date}`);
      dates[key] = date;
    };
    api.study.clearPlanDate = async (_slug: string, key: string) => {
      calls.push(`clear:${key}`);
      delete dates[key];
    };
    api.study.resetPlanDates = async () => {
      calls.push("resetDates");
      dates = {};
    };
    api.study.resetTasks = async () => {
      calls.push("resetTasks");
      tasksDone = [];
    };
  });

  /** Los disparadores del calendario de la instancia (el del panel y el de la fase). */
  const campos = (label: string) => screen.getAllByLabelText(`Fecha de ${label}`) as HTMLButtonElement[];
  const valor = (campo: HTMLElement) => campo.getAttribute("data-value") ?? "";
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const largo = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d} de ${MESES[(m ?? 1) - 1]} de ${y}`;
  };
  /** Elige `iso` en el calendario propio: abre, avanza los meses que hagan falta y toca el día. */
  const elegir = async (campo: HTMLElement, iso: string) => {
    const desde = valor(campo) || isoIn(0);
    fireEvent.click(campo);
    const dialogo = await screen.findByRole("dialog", { name: /Elegir fecha/ });
    const [y1, m1] = desde.split("-").map(Number);
    const [y2, m2] = iso.split("-").map(Number);
    const saltos = ((y2 ?? 0) - (y1 ?? 0)) * 12 + ((m2 ?? 0) - (m1 ?? 0));
    for (let i = 0; i < Math.abs(saltos); i += 1) {
      fireEvent.click(within(dialogo).getByRole("button", { name: saltos >= 0 ? "Mes siguiente" : "Mes anterior" }));
    }
    fireEvent.click(within(dialogo).getByRole("gridcell", { name: largo(iso) }));
  };
  const quitar = (label: string) => fireEvent.click(screen.getAllByRole("button", { name: `Quitar fecha: Fecha de ${label}` })[0] as HTMLElement);

  it("un campo por instancia, con la fecha que ya está cargada", async () => {
    dates = { parcial: isoIn(15) };
    renderPlan();
    await screen.findByText("Fechas de las instancias");

    /* Dos campos por instancia principal: el del panel y el de la tarjeta de la
       fase; el recuperatorio solo aparece en la fase (el panel lo lista igual). */
    expect(campos(PARCIAL).length).toBe(2);
    for (const campo of campos(PARCIAL)) expect(valor(campo)).toBe(isoIn(15));
    expect(campos(RECUPERATORIO).length).toBe(2);
    expect(valor(campos(RECUPERATORIO)[0] as HTMLElement)).toBe("");
    expect(screen.getAllByText("faltan 15 días").length).toBe(2);
  });

  it("cargar una fecha la guarda, la muestra en la fase y cuenta los días", async () => {
    renderPlan();
    await screen.findByText("Fechas de las instancias");
    expect(screen.queryByText(/faltan|falta 1 día|es hoy|pasó hace/)).toBeNull();

    await elegir(campos(PARCIAL)[0] as HTMLElement, isoIn(10));

    await waitFor(() => expect(calls).toEqual([`set:parcial:${isoIn(10)}`]));
    /* El chip está en el panel y en la tarjeta de la fase, con la misma fecha. */
    await waitFor(() => expect(screen.getAllByText("faltan 10 días").length).toBe(2));
    expect(valor(campos(PARCIAL)[1] as HTMLElement)).toBe(isoIn(10));
    /* Con fecha aparece el ritmo: una tarea pendiente de dos, dos semanas. */
    expect(screen.getByText("~1 tarea por semana · 1 hito restante")).toBeTruthy();
  });

  it("vaciar el campo borra la fecha", async () => {
    dates = { parcial: isoIn(15) };
    renderPlan();
    await screen.findByText("Fechas de las instancias");

    quitar(PARCIAL);

    await waitFor(() => expect(calls).toEqual(["clear:parcial"]));
    await waitFor(() => expect(screen.queryByText("faltan 15 días")).toBeNull());
    expect(valor(campos(PARCIAL)[1] as HTMLElement)).toBe("");
  });

  it("«Borrar fechas» pide confirmación y las saca todas", async () => {
    dates = { parcial: isoIn(15), recparcial: isoIn(30) };
    renderPlan();
    await screen.findByText("Fechas de las instancias");
    expect(screen.getAllByText("faltan 15 días").length).toBe(2);

    fireEvent.click(screen.getByRole("button", { name: "Borrar fechas" }));
    const dialogo = await screen.findByRole("dialog");
    expect(within(dialogo).getByText("¿Borrar las fechas?")).toBeTruthy();
    /* Cancelar no toca nada. */
    fireEvent.click(within(dialogo).getByRole("button", { name: "Cancelar" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(calls).toEqual([]);

    fireEvent.click(screen.getByRole("button", { name: "Borrar fechas" }));
    const otra = await screen.findByRole("dialog");
    fireEvent.click(within(otra).getByRole("button", { name: "Borrar fechas" }));

    await waitFor(() => expect(calls).toEqual(["resetDates"]));
    await waitFor(() => expect(screen.queryByText("faltan 15 días")).toBeNull());
    for (const campo of campos(PARCIAL)) expect(valor(campo)).toBe("");
  });

  it("«Reiniciar el plan» destilda las tareas y NO borra las fechas", async () => {
    dates = { parcial: isoIn(15) };
    renderPlan();
    await screen.findByText("Fechas de las instancias");
    expect(total()).toBe("1/2");

    fireEvent.click(screen.getByRole("button", { name: "Reiniciar el plan" }));
    const dialogo = await screen.findByRole("dialog");
    fireEvent.click(within(dialogo).getByRole("button", { name: "Reiniciar el plan" }));

    await waitFor(() => expect(total()).toBe("0/2"));
    expect(calls).toEqual(["resetTasks"]);
    /* Las fechas siguen ahí: son otra acción y otra tabla. */
    expect(screen.getAllByText("faltan 15 días").length).toBe(2);
    for (const campo of campos(PARCIAL)) expect(valor(campo)).toBe(isoIn(15));
  });

  /** Elegir un día en el calendario guarda UNA vez: abrir, cambiar de mes o cerrar no guardan nada. */
  it("elegir en el calendario guarda una sola vez", async () => {
    renderPlan();
    await screen.findByText("Fechas de las instancias");
    const panel = campos(PARCIAL)[0] as HTMLElement;

    /* Abrir y cerrar con Escape: nada. */
    fireEvent.click(panel);
    const dialogo = await screen.findByRole("dialog", { name: /Elegir fecha/ });
    fireEvent.click(within(dialogo).getByRole("button", { name: "Mes siguiente" }));
    fireEvent.keyDown(dialogo, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: /Elegir fecha/ })).toBeNull());
    expect(calls).toEqual([]);

    await elegir(panel, isoIn(45));
    await waitFor(() => expect(calls).toEqual([`set:parcial:${isoIn(45)}`]));
    await new Promise((r) => setTimeout(r, 100));
    expect(calls).toEqual([`set:parcial:${isoIn(45)}`]);
    expect(valor(campos(PARCIAL)[1] as HTMLElement)).toBe(isoIn(45));
  });

  /**
   * Si el guardado falla, los dos disparadores vuelven a lo que dice el servidor
   * (el calendario es controlado desde la caché: no guarda nada por su cuenta).
   */
  it("un guardado que falla vuelve a mostrar lo del servidor", async () => {
    api.study.setPlanDate = async (_slug: string, key: string, date: string) => {
      calls.push(`set:${key}:${date}`);
      throw new Error("500");
    };
    renderPlan();
    await screen.findByText("Fechas de las instancias");

    await elegir(campos(PARCIAL)[0] as HTMLElement, isoIn(10));
    await waitFor(() => expect(calls).toEqual([`set:parcial:${isoIn(10)}`]));
    await waitFor(() => expect(valor(campos(PARCIAL)[0] as HTMLElement)).toBe(""));
    expect(valor(campos(PARCIAL)[1] as HTMLElement)).toBe("");
    expect(screen.queryByText(/faltan|pasó hace/)).toBeNull();
  });

  /**
   * Dos guardados que se solapan y fallan. El segundo guarda como «estado
   * anterior» una foto que YA trae el parche optimista del primero, así que su
   * vuelta atrás restaura una fecha que el servidor nunca tuvo. Para que eso se
   * note el segundo tiene que terminar ÚLTIMO —de ahí las dos esperas, la
   * segunda más larga—: al terminar el último se vuelve a pedir el estado, que
   * es la única fuente de verdad, y todo queda vacío.
   */
  it("dos guardados solapados que fallan terminan mostrando lo del servidor", async () => {
    const esperas = [200, 400];
    api.study.setPlanDate = async (_slug: string, key: string, date: string) => {
      calls.push(`set:${key}:${date}`);
      await new Promise((r) => setTimeout(r, esperas.shift() ?? 0));
      throw new Error("500");
    };
    renderPlan();
    await screen.findByText("Fechas de las instancias");

    await elegir(campos(PARCIAL)[0] as HTMLElement, isoIn(10));
    await elegir(campos(PARCIAL)[0] as HTMLElement, isoIn(12));

    await waitFor(() => expect(calls).toEqual([`set:parcial:${isoIn(10)}`, `set:parcial:${isoIn(12)}`]));
    /* Se espera a que la SEGUNDA (la lenta) haya terminado de verdad: entre las
       dos vueltas atrás hay un momento en que la pantalla está bien por
       casualidad, y mirar ahí no probaría nada. */
    await new Promise((r) => setTimeout(r, 600));

    await waitFor(() => expect(valor(campos(PARCIAL)[0] as HTMLElement)).toBe(""));
    expect(valor(campos(PARCIAL)[1] as HTMLElement)).toBe("");
    expect(dates).toEqual({});
    expect(screen.queryByText(/faltan|pasó hace/)).toBeNull();
  });

  it("«Completar fase» tilda todas las tareas de la fase y después la reabre", async () => {
    renderPlan();
    await screen.findByText("Fechas de las instancias");
    const guardadas: string[] = [];
    api.study.setTask = async (_slug: string, taskId: string, done: boolean) => {
      guardadas.push(`${taskId}:${done}`);
    };

    fireEvent.click(screen.getByRole("button", { name: "Completar fase" }));
    await waitFor(() => expect(total()).toBe("2/2"));
    expect(guardadas).toEqual(["tp-2:true"]);

    fireEvent.click(await screen.findByRole("button", { name: "Reabrir fase" }));
    await waitFor(() => expect(total()).toBe("0/2"));
  });
});

describe("<PlanView/> sin instancias", () => {
  it("un plan que no declara instancias no dibuja el panel de fechas", async () => {
    renderPlan();
    await screen.findByRole("radiogroup", { name: "MODALIDAD" });
    expect(screen.queryByText("Fechas de las instancias")).toBeNull();
    expect(screen.queryByRole("button", { name: "Borrar fechas" })).toBeNull();
    /* «Reiniciar el plan» sí está: no depende de las fechas. */
    expect(screen.getByRole("button", { name: "Reiniciar el plan" })).toBeTruthy();
  });
});
