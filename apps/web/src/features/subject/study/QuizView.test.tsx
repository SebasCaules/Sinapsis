/**
 * La partida de quiz: mezcla, tanda corta, marcador en curso, el revelado que
 * dice cuál era la correcta y la partida que se reanuda al volver a la vista.
 *
 * El API se reemplaza por la MISMA costura que usa el modo mock (`lib/api` es
 * un objeto mutable) y el azar se fija con `Math.random`: con 0,999 el
 * Fisher-Yates deja el orden del archivo, así que las aserciones sobre «la
 * primera pregunta» son deterministas.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import {
  SubjectConfig,
  type QuizAttempt,
  type StudyContent,
  type StudyState,
  type SubjectDetail,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import type { SubjectCtx } from "../context";
import { buildSubjectModel } from "../model";
import { IDLE_RUNTIME } from "../tools/useRuntime";
import { QuizView } from "./QuizView";

const config = SubjectConfig.parse(rawProbaConfig);
const detail: SubjectDetail = { config, pages: [], studied: [], placeholder: false, lastSyncAt: null };
const ctx: SubjectCtx = {
  slug: "proba",
  model: buildSubjectModel(detail),
  openSearch: () => {},
  runtime: IDLE_RUNTIME,
};

/** Cuatro preguntas: la correcta es siempre la B, para poder afirmar la letra. */
const content: StudyContent = {
  decks: [],
  quizzes: [
    {
      id: "q1",
      title: "Quiz de prueba",
      questions: [1, 2, 3, 4].map((n) => ({
        id: `p${n}`,
        prompt: `Enunciado ${n}`,
        options: [
          { text: `Opción A de ${n}`, correct: false },
          { text: `Opción B de ${n}`, correct: true },
        ],
        explanation: `Explicación ${n}`,
      })),
    },
  ],
  plan: null,
  kits: [],
};

const emptyState: StudyState = {
  srs: [],
  bookmarks: [],
  notes: [],
  planDates: {},
  tasksDone: [],
  attempts: [],
};

let attempts: Array<{ quizId: string; score: number; total: number }> = [];
let original: ApiClient["study"];

beforeEach(() => {
  original = { ...api.study };
  vi.spyOn(Math, "random").mockReturnValue(0.999);
  localStorage.clear();
  attempts = [];
  api.study.content = async () => content;
  api.study.state = async () => emptyState;
  api.study.recordAttempt = async (_slug, quizId, score, total): Promise<QuizAttempt> => {
    attempts.push({ quizId, score, total });
    return { quizId, score, total, at: new Date().toISOString() };
  };
});

afterEach(() => {
  Object.assign(api.study, original);
  vi.restoreAllMocks();
  localStorage.clear();
  cleanup();
});

function renderQuiz(search = "") {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, networkMode: "always" },
      mutations: { retry: false, networkMode: "always" },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/m/proba/quiz/q1${search}`]}>
        <Routes>
          <Route path="/m/:subject" element={<Outlet context={ctx} />}>
            <Route path="quiz/:quiz" element={<QuizView />} />
            <Route path="quiz" element={<p>Lista de quizzes</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const counter = () => screen.getByTestId("quiz-counter").textContent;
const option = (letter: "A" | "B") => screen.getByRole("button", { name: new RegExp(`^${letter}\\. `) });

describe("<QuizView/>", () => {
  it("cuenta los aciertos en curso y al fallar dice cuál era la correcta", async () => {
    renderQuiz();

    expect(await screen.findByText("Enunciado 1")).toBeTruthy();
    expect(counter()).toBe("1 / 4");
    expect(screen.getByTestId("quiz-score").textContent).toContain("0");

    fireEvent.click(option("A"));
    /* El color y el tilde no son el único aviso: la letra correcta va en texto. */
    expect(screen.getByText("La respuesta correcta es B.")).toBeTruthy();
    expect(screen.getByText("INCORRECTO")).toBeTruthy();
    expect(screen.getByTestId("quiz-score").textContent).toContain("0");

    fireEvent.click(screen.getByRole("button", { name: /Siguiente/ }));
    expect(await screen.findByText("Enunciado 2")).toBeTruthy();
    fireEvent.click(option("B"));
    expect(screen.getByTestId("quiz-score").textContent).toContain("1");
    expect(screen.queryByText(/La respuesta correcta es/)).toBeNull();
  });

  it("baraja las preguntas: con otro azar la partida empieza por otra", async () => {
    /* `j = 0` en cada vuelta: el Fisher-Yates rota la lista. */
    vi.spyOn(Math, "random").mockReturnValue(0);
    renderQuiz();
    expect(await screen.findByText("Enunciado 2")).toBeTruthy();
    expect(screen.queryByText("Enunciado 1")).toBeNull();
  });

  it("«?n=2» recorta la tanda y esa partida no registra intento", async () => {
    renderQuiz("?n=2");

    expect(await screen.findByText("Enunciado 1")).toBeTruthy();
    expect(counter()).toBe("1 / 2");

    fireEvent.click(option("B"));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/ }));
    expect(await screen.findByText("Enunciado 2")).toBeTruthy();
    fireEvent.click(option("B"));
    fireEvent.click(screen.getByRole("button", { name: /Ver el resultado/ }));

    expect(await screen.findByText("TANDA CORTA")).toBeTruthy();
    expect(screen.getByText(/no queda registrada/)).toBeTruthy();
    await waitFor(() => expect(attempts).toEqual([]));
  });

  it("volver a la vista reanuda la partida donde iba", async () => {
    const first = renderQuiz();
    expect(await screen.findByText("Enunciado 1")).toBeTruthy();
    fireEvent.click(option("B"));
    fireEvent.click(screen.getByRole("button", { name: /Siguiente/ }));
    expect(await screen.findByText("Enunciado 2")).toBeTruthy();

    first.unmount();
    renderQuiz();

    /* Antes, montar el componente rearmaba la partida desde cero. */
    expect(await screen.findByText("Enunciado 2")).toBeTruthy();
    expect(counter()).toBe("2 / 4");
    expect(screen.getByTestId("quiz-score").textContent).toContain("1");
  });

  it("el quiz entero sí registra el intento y el resultado gradúa el veredicto", async () => {
    renderQuiz();
    expect(await screen.findByText("Enunciado 1")).toBeTruthy();

    for (let i = 1; i <= 4; i += 1) {
      fireEvent.click(option("A"));
      fireEvent.click(screen.getByRole("button", { name: i === 4 ? /Ver el resultado/ : /Siguiente/ }));
    }

    expect(await screen.findByText("RESULTADO")).toBeTruthy();
    /* Cero de cuatro: el veredicto del tramo bajo manda a las flashcards. */
    expect(screen.getByText(/Conviene repasar con las flashcards y el wiki\./)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Repasar con las flashcards" })).toBeTruthy();
    await waitFor(() => expect(attempts).toEqual([{ quizId: "q1", score: 0, total: 4 }]));

    /* Y la partida terminada no se reanuda: volver empieza una nueva. */
    cleanup();
    renderQuiz();
    expect(await screen.findByText("Enunciado 1")).toBeTruthy();
    expect(counter()).toBe("1 / 4");
  });
});
