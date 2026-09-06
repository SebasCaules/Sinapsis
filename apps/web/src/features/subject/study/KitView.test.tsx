/**
 * El detalle del kit como HERRAMIENTA de trabajo, no como catálogo:
 *  - los lanzadores van primero y resuelven también los ítems del rail que no
 *    son `kind: "tool"` (el «Formulario general» del rail de esta prueba es una
 *    página);
 *  - cada página se puede tildar como leída desde el kit, y hay un
 *    «Marcar todas como leídas» que usa la MISMA mutación que el lector.
 *
 * El cliente de datos se reemplaza por la costura del modo mock (`lib/api` es un objeto
 * mutable): no hay red. El contexto de la materia se arma con `useSubject`, para
 * que el optimista del tilde llegue de verdad al modelo que dibuja la vista.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import {
  SubjectConfig,
  type PageMeta,
  type StudyContent,
  type StudyState,
  type SubjectDetail,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import { Toaster } from "@/components/platform";
import type { SubjectCtx } from "../context";
import { useSubject } from "../useSubject";
import { IDLE_RUNTIME } from "../tools/useRuntime";
import { KitView } from "./KitView";

/* El grupo «Resolver» de Proba pasó a ser todo `kind: "tool"`: los formularios
   son ahora una vista del bundle `proba-exercises` y no la página de wiki. Para
   no perder la cobertura del ítem `kind: "page"` —el camino que antes se perdía
   en silencio— el rail de esta prueba agrega uno propio. */
const config = SubjectConfig.parse({
  ...rawProbaConfig,
  rail: [
    ...(rawProbaConfig.rail as unknown[]),
    {
      id: "material",
      label: "Material",
      items: [
        { id: "maestro", label: "Formulario general", icon: "sigma", kind: "page", target: "formulario-maestro" },
      ],
    },
  ],
});

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

/* `formulario-maestro` existe para que el ítem `maestro` del rail de esta prueba
   (kind: "page") se resuelva: sin la página, el rail lo descarta. */
const pages: PageMeta[] = [
  meta("descriptiva", "Estadística descriptiva", "1"),
  meta("probabilidad", "Probabilidad", "2"),
  meta("formulario-maestro", "Formulario general", "0"),
];

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
      tools: [
        "calc",
        "formularios",
        "maestro",
        { target: "asistente", label: "¿Qué distribución uso?", icon: "compass" },
        { target: "explorador?d=normal", label: "Explorador acotado", icon: "chart" },
      ],
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

let original: { subject: ApiClient["subject"]; study: ApiClient["study"] };
let studied: string[] = [];
let marked: Array<{ page: string; studied: boolean }> = [];

beforeEach(() => {
  original = { subject: { ...api.subject }, study: { ...api.study } };
  studied = ["descriptiva"];
  marked = [];
  const detail = (): SubjectDetail => ({
    config,
    pages,
    studied: [...studied],
    placeholder: false,
    lastSyncAt: null,
  });
  api.subject.detail = async () => detail();
  api.subject.markStudied = async (_slug: string, page: string) => {
    if (!studied.includes(page)) studied.push(page);
    marked.push({ page, studied: true });
  };
  api.subject.unmarkStudied = async (_slug: string, page: string) => {
    studied = studied.filter((s) => s !== page);
    marked.push({ page, studied: false });
  };
  api.study.content = async () => content;
  api.study.state = async () => state;
});

afterEach(() => {
  Object.assign(api.subject, original.subject);
  Object.assign(api.study, original.study);
  cleanup();
});

/** El shell de verdad: el contexto sale de `useSubject`, como en la aplicación. */
function Harness() {
  const { model } = useSubject("proba");
  if (!model) return null;
  const ctx: SubjectCtx = { slug: "proba", model, openSearch: () => undefined, runtime: IDLE_RUNTIME };
  return (
    <Routes>
      <Route path="/m/:subject" element={<Outlet context={ctx} />}>
        <Route path="kits/:kit" element={<KitView />} />
      </Route>
    </Routes>
  );
}

function renderKit() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, networkMode: "always" },
      mutations: { retry: false, networkMode: "always" },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/m/proba/kits/k1"]}>
        <Harness />
      </MemoryRouter>
      <Toaster />
    </QueryClientProvider>,
  );
}

const check = (title: string) => screen.getByRole("button", { name: new RegExp(`: ${title}$`) });

describe("<KitView/>", () => {
  it("dibuja los lanzadores primero y resuelve los ítems del rail que no son herramientas", async () => {
    renderKit();
    const headings = await screen.findAllByRole("heading", { level: 2 });
    expect(headings.map((h) => h.textContent)).toEqual(["Herramientas", "Páginas clave"]);

    /* Rótulo del rail cuando el kit solo declara el id… */
    expect(screen.getByRole("link", { name: /Calculadoras/ }).getAttribute("href")).toBe("/m/proba/t/calc");
    expect(screen.getByRole("link", { name: /^Formularios/ }).getAttribute("href")).toBe(
      "/m/proba/t/formularios",
    );
    /* …incluido el ítem `kind: "page"` que antes se perdía en silencio. */
    expect(screen.getByRole("link", { name: /Formulario general/ }).getAttribute("href")).toBe(
      "/m/proba/p/formulario-maestro",
    );
    /* Rótulo propio del kit a una vista que el rail no declara. */
    expect(screen.getByRole("link", { name: /¿Qué distribución uso\?/ }).getAttribute("href")).toBe(
      "/m/proba/t/asistente",
    );
    /* Destino con parámetros. */
    expect(screen.getByRole("link", { name: /Explorador acotado/ }).getAttribute("href")).toBe(
      "/m/proba/t/explorador?d=normal",
    );
  });

  it("muestra el porcentaje de lectura del kit", async () => {
    renderKit();
    /* Una de las dos páginas leídas. */
    expect(await screen.findByText("50")).toBeTruthy();
  });

  it("tilda una página desde el kit con la mutación del lector", async () => {
    renderKit();
    const sinLeer = await waitFor(() => check("Probabilidad"));
    expect(sinLeer.getAttribute("aria-pressed")).toBe("false");
    expect(check("Estadística descriptiva").getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(sinLeer);

    await waitFor(() => expect(check("Probabilidad").getAttribute("aria-pressed")).toBe("true"));
    expect(marked).toEqual([{ page: "probabilidad", studied: true }]);
    /* El conteo de la sección sigue al tilde. */
    expect(screen.getByText("2 de 2 leídas")).toBeTruthy();
  });

  it("«Marcar todas como leídas» marca lo que falta y después ofrece desmarcar", async () => {
    renderKit();
    const marcar = await screen.findByRole("button", { name: "Marcar todas como leídas" });

    fireEvent.click(marcar);

    await screen.findByRole("button", { name: "Desmarcar todas" });
    /* Solo la que faltaba: la ya leída no se vuelve a escribir. */
    expect(marked).toEqual([{ page: "probabilidad", studied: true }]);
    expect(screen.getByText("Páginas marcadas como leídas")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Desmarcar todas" }));

    await screen.findByRole("button", { name: "Marcar todas como leídas" });
    expect(marked.slice(1)).toEqual([
      { page: "descriptiva", studied: false },
      { page: "probabilidad", studied: false },
    ]);
    expect(screen.getByText("Páginas desmarcadas")).toBeTruthy();
  });
});
