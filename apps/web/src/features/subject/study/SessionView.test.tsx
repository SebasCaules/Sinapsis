/**
 * La sesión de repaso de punta a punta con dos tarjetas: dar vuelta, calificar,
 * pasar a la siguiente y el reenganche de «Otra vez». El cliente se reemplaza por la
 * MISMA costura que usa el modo mock (`lib/api` es un objeto mutable): no hay
 * red ni fixtures escondidas.
 *
 * La cola se BARAJA al armar la sesión, así que el azar se fija acá: con
 * `Math.random` devolviendo 0,999 el Fisher-Yates deja el orden del mazo, y con
 * 0 lo da vuelta. Las dos cosas se prueban.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import {
  SubjectConfig,
  type SrsGrade,
  type SrsState,
  type StudyContent,
  type StudyState,
  type SubjectDetail,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import type { SubjectCtx } from "../context";
import { buildSubjectModel } from "../model";
import { IDLE_RUNTIME } from "../tools/useRuntime";
import { SessionView } from "./SessionView";

const config = SubjectConfig.parse(rawProbaConfig);
const detail: SubjectDetail = { config, pages: [], studied: [], placeholder: false, lastSyncAt: null };
const ctx: SubjectCtx = {
  slug: "proba",
  model: buildSubjectModel(detail),
  openSearch: () => {},
  runtime: IDLE_RUNTIME,
};

const content: StudyContent = {
  decks: [
    {
      id: "d1",
      title: "Mazo de prueba",
      source: "authored",
      cards: [
        { id: "c1", front: "Anverso uno", back: "Reverso uno", tags: [] },
        { id: "c2", front: "Anverso dos", back: "Reverso dos", tags: [] },
      ],
    },
  ],
  quizzes: [],
  plan: null,
  kits: [],
};

const emptyState: StudyState = { srs: [], bookmarks: [], notes: [], planDates: {},
      tasksDone: [], attempts: [] };

let graded: Array<{ cardId: string; grade: SrsGrade }> = [];
let original: ApiClient["study"];

beforeEach(() => {
  original = { ...api.study };
  /* Orden identidad: `j = floor(0.999 * (i + 1)) = i`, cada elemento consigo mismo. */
  vi.spyOn(Math, "random").mockReturnValue(0.999);
  graded = [];
  api.study.content = async () => content;
  api.study.state = async () => emptyState;
  api.study.grade = async (_slug, cardId, grade): Promise<SrsState> => {
    graded.push({ cardId, grade });
    const at = new Date().toISOString();
    return { cardId, ease: 2.5, interval: 1, due: at, reps: 1, lapses: 0, lastGrade: grade, updatedAt: at };
  };
});

afterEach(() => {
  Object.assign(api.study, original);
  vi.restoreAllMocks();
  cleanup();
});

function renderSession() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, networkMode: "always" },
      mutations: { retry: false, networkMode: "always" },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/m/proba/flashcards/d1?modo=todo"]}>
        <Routes>
          <Route path="/m/:subject" element={<Outlet context={ctx} />}>
            <Route path="flashcards/:deck" element={<SessionView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

/**
 * El control con nombre de la tarjeta (U37). Ya no es la tarjeta con un
 * `aria-label` encima —eso tapaba su contenido— sino un botón hermano que
 * anuncia el estado con `aria-expanded`.
 */
const flipButton = () => screen.getByRole("button", { name: /respuesta/ });
/** La tarjeta lleva su posición y su lado en el nombre (se enfoca sola con cada tarjeta). */
const cardGroup = () => screen.getByRole("group", { name: /^Tarjeta \d+ de \d+/ });
const gradeButton = (name: RegExp) => screen.getByRole("button", { name }) as HTMLButtonElement;

/** «Ver la respuesta» / «Ocultar la respuesta» + el `aria-expanded` que le toca. */
function expectFlipState(flipped: boolean): void {
  const button = flipButton();
  expect(button.textContent).toContain(flipped ? "Ocultar la respuesta" : "Ver la respuesta");
  expect(button.getAttribute("aria-expanded")).toBe(String(flipped));
}

describe("<SessionView/>", () => {
  it("da vuelta la tarjeta y al calificar llama al API y pasa a la siguiente", async () => {
    renderSession();

    /* Primera tarjeta: solo el anverso, y las notas todavía no se pueden usar. */
    expect(await screen.findByText("Anverso uno")).toBeTruthy();
    expect(screen.getByText("1 / 2")).toBeTruthy();
    expectFlipState(false);
    expect(gradeButton(/Bien/).disabled).toBe(true);
    /* El anverso es contenido de verdad, no el rótulo de un botón: la tarjeta
       tiene su propio papel y el texto queda a la vista de un lector. */
    expect(cardGroup().textContent).toContain("Anverso uno");
    expect(cardGroup().getAttribute("aria-label")).toBe("Tarjeta 1 de 2, anverso");
    /* El foco vive en la tarjeta desde que entra: es lo que anuncia la tarjeta
       nueva y lo que hace que Espacio y 1-4 funcionen sin buscar nada. */
    expect(document.activeElement).toBe(cardGroup());

    fireEvent.click(flipButton());
    expectFlipState(true);
    expect(gradeButton(/Bien/).disabled).toBe(false);

    fireEvent.click(gradeButton(/Bien/));

    await waitFor(() => expect(graded).toEqual([{ cardId: "c1", grade: 3 }]));
    expect(await screen.findByText("Anverso dos")).toBeTruthy();
    expect(screen.queryByText("Anverso uno")).toBeNull();
    expect(screen.getByText("2 / 2")).toBeTruthy();
    /* La siguiente empieza tapada otra vez. */
    expectFlipState(false);
  });

  it("Espacio sobre la tarjeta enfocada la da vuelta UNA sola vez", async () => {
    renderSession();
    expect(await screen.findByText("Anverso uno")).toBeTruthy();

    /* Bug 2: la tarjeta tenía su propio `onKeyDown` ADEMÁS del atajo global, así
       que un Espacio real sobre ella la giraba y la volvía a girar. El evento
       sale del elemento enfocado y sube hasta `window`, como en el navegador. */
    const card = cardGroup();
    card.focus();
    fireEvent.keyDown(card, { key: " ", bubbles: true });
    expectFlipState(true);

    fireEvent.keyDown(card, { key: " ", bubbles: true });
    expectFlipState(false);
  });

  it("«Otra vez» devuelve la tarjeta al final de la cola y el resumen llega al terminar", async () => {
    renderSession();
    expect(await screen.findByText("Anverso uno")).toBeTruthy();

    /* Espacio da vuelta y 1 califica «Otra vez»: la tarjeta vuelve a la cola. */
    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "1" });

    expect(await screen.findByText("Anverso dos")).toBeTruthy();
    /* El contador es la posición en la cola VIVA: «Otra vez» reencoló la
       tarjeta, así que la cola pasó a tres y esta es la segunda. Antes se
       quedaba en «1 / 2» y la sesión parecía trabada. */
    expect(screen.getByText("2 / 3")).toBeTruthy();

    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "3" });

    /* Vuelve la que quedó pendiente. */
    expect(await screen.findByText("Anverso uno")).toBeTruthy();
    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "4" });

    expect(await screen.findByText("2 tarjetas repasadas")).toBeTruthy();
    await waitFor(() =>
      expect(graded).toEqual([
        { cardId: "c1", grade: 1 },
        { cardId: "c2", grade: 3 },
        { cardId: "c1", grade: 4 },
      ]),
    );
  });

  it("baraja la cola: con otro azar la sesión empieza por la otra tarjeta", async () => {
    /* `j = floor(0 * (i + 1)) = 0`: con dos tarjetas, el Fisher-Yates las
       intercambia. Es la prueba de que la cola pasa por la mezcla y no sale
       siempre en el orden del archivo. */
    vi.spyOn(Math, "random").mockReturnValue(0);
    renderSession();

    expect(await screen.findByText("Anverso dos")).toBeTruthy();
    expect(screen.queryByText("Anverso uno")).toBeNull();
  });

  it("si el API rechaza la calificación, la tarjeta vuelve a la cola", async () => {
    api.study.grade = async (): Promise<SrsState> => {
      throw new Error("sin red");
    };
    renderSession();
    expect(await screen.findByText("Anverso uno")).toBeTruthy();

    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "3" });

    /* La sesión avanza igual —el optimista ya está puesto— pero la tarjeta que
       no se pudo guardar se reencola: antes desaparecía sin estado SRS y sin
       manera de volver a ella. */
    expect(await screen.findByText("Anverso dos")).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId("session-counter").textContent).toBe("2 / 3"));

    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "3" });
    expect(await screen.findByText("Anverso uno")).toBeTruthy();
  });
});
