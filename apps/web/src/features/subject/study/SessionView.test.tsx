/**
 * La sesión de repaso de punta a punta con dos tarjetas: dar vuelta, calificar,
 * pasar a la siguiente y el reenganche de «Otra vez». El API se reemplaza por la
 * MISMA costura que usa el modo mock (`lib/api` es un objeto mutable): no hay
 * red ni fixtures escondidas.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import type { SubjectCtx } from "../context";
import { buildSubjectModel } from "../model";
import { SessionView } from "./SessionView";

const config = SubjectConfig.parse(rawProbaConfig);
const detail: SubjectDetail = { config, pages: [], studied: [], placeholder: false, lastSyncAt: null };
const ctx: SubjectCtx = { slug: "proba", model: buildSubjectModel(detail), openSearch: () => {} };

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

const emptyState: StudyState = { srs: [], bookmarks: [], notes: [], tasksDone: [], attempts: [] };

let graded: Array<{ cardId: string; grade: SrsGrade }> = [];
let original: ApiClient["study"];

beforeEach(() => {
  original = { ...api.study };
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

const flipButton = () => screen.getByRole("button", { name: /respuesta/ });
const gradeButton = (name: RegExp) => screen.getByRole("button", { name }) as HTMLButtonElement;

describe("<SessionView/>", () => {
  it("da vuelta la tarjeta y al calificar llama al API y pasa a la siguiente", async () => {
    renderSession();

    /* Primera tarjeta: solo el anverso, y las notas todavía no se pueden usar. */
    expect(await screen.findByText("Anverso uno")).toBeTruthy();
    expect(screen.getByText("1 / 2")).toBeTruthy();
    expect(flipButton().getAttribute("aria-label")).toBe("Ver la respuesta");
    expect(gradeButton(/Bien/).disabled).toBe(true);

    fireEvent.click(flipButton());
    expect(flipButton().getAttribute("aria-label")).toBe("Ocultar la respuesta");
    expect(gradeButton(/Bien/).disabled).toBe(false);

    fireEvent.click(gradeButton(/Bien/));

    await waitFor(() => expect(graded).toEqual([{ cardId: "c1", grade: 3 }]));
    expect(await screen.findByText("Anverso dos")).toBeTruthy();
    expect(screen.queryByText("Anverso uno")).toBeNull();
    expect(screen.getByText("2 / 2")).toBeTruthy();
    /* La siguiente empieza tapada otra vez. */
    expect(flipButton().getAttribute("aria-label")).toBe("Ver la respuesta");
  });

  it("«Otra vez» devuelve la tarjeta al final de la cola y el resumen llega al terminar", async () => {
    renderSession();
    expect(await screen.findByText("Anverso uno")).toBeTruthy();

    /* Espacio da vuelta y 1 califica «Otra vez»: la tarjeta vuelve a la cola. */
    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "1" });

    expect(await screen.findByText("Anverso dos")).toBeTruthy();
    /* Sigue siendo la primera de dos: «Otra vez» no cuenta como resuelta. */
    expect(screen.getByText("1 / 2")).toBeTruthy();

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
});
