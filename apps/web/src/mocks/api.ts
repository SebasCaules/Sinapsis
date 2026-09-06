/**
 * Implementación de mentira del API, para revisar la interfaz sin el servidor
 * levantado (`?mock=1` en desarrollo: smoke visual y capturas).
 *
 * Este módulo es el ÚNICO que conoce las fixtures, y nadie lo importa de forma
 * estática: `main.tsx` lo carga con un `import()` dinámico bajo
 * `import.meta.env.DEV`, así que en la compilación de producción Rollup poda
 * tanto el módulo como todo lo que arrastra (la materia de Proba incluida).
 */
import type { SubjectCard, ThemeId, User } from "@sinapsis/contract";
import type { ApiClient } from "@/lib/api";
import { mockPageDetail, mockSearch, mockSubjectDetail } from "@/features/subject/mocks/proba-fixture";
import { mockLanding, mockParam, mockUser } from "./dev-fixtures";

/* Estado en memoria: dura lo que dura la pestaña. */
let user: User = { ...mockUser };
let cards: SubjectCard[] | null = null;

/** ?empty=1 arranca con la landing vacía (captura del estado inicial). */
function state(): SubjectCard[] {
  if (!cards) cards = mockParam("empty") === "1" ? [] : mockLanding.map((c) => ({ ...c }));
  return cards;
}

const copy = (list: SubjectCard[]): SubjectCard[] => list.map((c) => ({ ...c }));

export const mockApi: ApiClient = {
  auth: {
    me: async () => user,
    google: async () => user,
    dev: async () => user,
    logout: async () => {
      /* sin sesión que cerrar: el usuario de mentira sigue ahí */
    },
    setTheme: async (theme: ThemeId) => (user = { ...user, theme }),
  },

  landing: {
    list: async () => copy(state()),

    saveLayout: async (input) => {
      const byId = new Map(state().map((c) => [c.slug, c]));
      for (const item of input.items) {
        const card = byId.get(item.slug);
        if (card) Object.assign(card, { semester: item.semester, position: item.position });
      }
      return copy(state());
    },

    createSubject: async (input) => {
      const card: SubjectCard = {
        ...input,
        color: input.color ?? "--u0",
        divisionsCount: 0,
        pagesCount: 0,
        studiedCount: 0,
        position: state().filter((c) => c.semester === input.semester).length,
        placeholder: true,
        lastSyncAt: null,
      };
      state().push(card);
      return { ...card };
    },

    removeFromLanding: async (slug) => {
      cards = state().filter((c) => c.slug !== slug);
    },
    semesters: async () => Array.from(new Set(state().map((c) => c.semester))),
  },

  subject: {
    detail: async (slug) => mockSubjectDetail(slug),
    page: async (slug, page) => mockPageDetail(slug, page),
    search: async (slug, q) => mockSearch(slug, q),
    markStudied: async () => {
      /* el progreso de mentira vive en la caché optimista de la consulta */
    },
    unmarkStudied: async () => {
      /* ídem */
    },
    // Sprint 2: el agente C3 completa el grafo de mentira a partir de las páginas del fixture.
    graph: async () => ({ nodes: [], edges: [] }),
  },

  // Sprint 2: estado de estudio en memoria (el agente C3 lo completa con fixtures reales).
  study: {
    content: async () => ({ decks: [], quizzes: [], plan: null, kits: [] }),
    state: async () => ({ srs: [], bookmarks: [], notes: [], tasksDone: [], attempts: [] }),
    grade: async (_slug, cardId, grade) => ({
      cardId, ease: 2.5, interval: 1, due: new Date().toISOString(), reps: 1, lapses: 0, lastGrade: grade, updatedAt: new Date().toISOString(),
    }),
    resetCard: async () => {},
    addBookmark: async () => {},
    removeBookmark: async () => {},
    saveNote: async (_slug, page, body) => ({ page, body, updatedAt: new Date().toISOString() }),
    deleteNote: async () => {},
    setTask: async () => {},
    recordAttempt: async (_slug, quizId, score, total) => ({ quizId, score, total, at: new Date().toISOString() }),
  },

  config: async () => ({ googleClientId: null, devBypass: true }),
};
