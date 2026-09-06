/**
 * Rutas del material de estudio, RELATIVAS al layout de la materia: el shell
 * (`features/subject/routes.tsx`) las mete entre sus hijas.
 *
 * Todas llegan en diferido (`lazy` del router de datos): la primera pantalla de
 * una materia no paga el pipeline de markdown, KaTeX ni el modelo de estudio.
 */
import type { RouteObject } from "react-router-dom";

export const studyRoutes: RouteObject[] = [
  { path: "plan", lazy: async () => ({ Component: (await import("./PlanView")).PlanView }) },
  { path: "kits", lazy: async () => ({ Component: (await import("./KitsView")).KitsView }) },
  { path: "kits/:kit", lazy: async () => ({ Component: (await import("./KitView")).KitView }) },
  { path: "flashcards", lazy: async () => ({ Component: (await import("./FlashcardsView")).FlashcardsView }) },
  { path: "flashcards/:deck", lazy: async () => ({ Component: (await import("./SessionView")).SessionView }) },
  { path: "quiz", lazy: async () => ({ Component: (await import("./QuizzesView")).QuizzesView }) },
  { path: "quiz/:quiz", lazy: async () => ({ Component: (await import("./QuizView")).QuizView }) },
];
