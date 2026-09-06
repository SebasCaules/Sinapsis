/**
 * Implementación de mentira del API, para revisar la interfaz sin el servidor
 * levantado (`?mock=1` en desarrollo: smoke visual y capturas).
 *
 * Este módulo es el ÚNICO que conoce las fixtures, y nadie lo importa de forma
 * estática: `main.tsx` lo carga con un `import()` dinámico bajo
 * `import.meta.env.DEV`, así que en la compilación de producción Rollup poda
 * tanto el módulo como todo lo que arrastra (la materia de Proba incluida).
 *
 * Todo el estado vive en memoria y dura lo que dura la pestaña: al recargar se
 * vuelve al fixture. Eso alcanza para el smoke (guardar un cuatrimestre vacío,
 * calificar una tarjeta, marcar una tarea) y evita inventar una persistencia
 * que el servidor real ya resuelve.
 */
import {
  SRS_DEFAULT,
  compareSemestersDesc,
  sm2,
  type Note,
  type QuizAttempt,
  type SrsGrade,
  type SrsState,
  type StudyState,
  type SubjectCard,
  type ThemeId,
  type User,
} from "@sinapsis/contract";
import type { ApiClient } from "@/lib/api";
import { mockPageDetail, mockSearch, mockSubjectDetail } from "@/features/subject/mocks/proba-fixture";
import { mockLanding, mockParam, mockUser } from "./dev-fixtures";
import { mockGraph, mockStudyContent, mockStudyState } from "./study-fixture";

/* Estado en memoria: dura lo que dura la pestaña. */
let user: User = { ...mockUser };
let cards: SubjectCard[] | null = null;
/** Cuatrimestres del usuario, en orden y con los vacíos (lo que persiste `user_semesters`). */
let semesters: string[] | null = null;
/** Estado de estudio por materia. */
const studyStates = new Map<string, StudyState>();

/** ?empty=1 arranca con la landing vacía (captura del estado inicial). */
function state(): SubjectCard[] {
  if (!cards) cards = mockParam("empty") === "1" ? [] : mockLanding.map((c) => ({ ...c }));
  return cards;
}

/** Los cuatrimestres arrancan siendo los de las materias, del más reciente al más antiguo. */
function semesterList(): string[] {
  if (!semesters) semesters = [...new Set(state().map((c) => c.semester))].sort(compareSemestersDesc);
  return semesters;
}

const copy = (list: SubjectCard[]): SubjectCard[] => list.map((c) => ({ ...c }));

function studyState(slug: string): StudyState {
  let s = studyStates.get(slug);
  if (!s) {
    s = mockStudyState();
    studyStates.set(slug, s);
  }
  return s;
}

/** Copia honda de lo que se devuelve: quien lo reciba no debe poder mutar el estado. */
function copyState(s: StudyState): StudyState {
  return {
    srs: s.srs.map((x) => ({ ...x })),
    bookmarks: [...s.bookmarks],
    notes: s.notes.map((n) => ({ ...n })),
    tasksDone: [...s.tasksDone],
    attempts: s.attempts.map((a) => ({ ...a })),
  };
}

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
      /* Los cuatrimestres se guardan tal como vienen (incluidos los vacíos), más
         los que alguna materia todavía use y la lista no mencione. */
      if (input.semesters) {
        const declared = input.semesters.filter((s, i, all) => all.indexOf(s) === i);
        const used = state()
          .map((c) => c.semester)
          .filter((s) => !declared.includes(s))
          .sort(compareSemestersDesc);
        semesters = [...declared, ...new Set(used)];
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
      if (!semesterList().includes(card.semester)) semesterList().push(card.semester);
      return { ...card };
    },

    removeFromLanding: async (slug) => {
      cards = state().filter((c) => c.slug !== slug);
      /* Quitar la última materia NO borra el cuatrimestre: ahora persiste vacío. */
    },

    semesters: async () => [...semesterList()],
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
    graph: async () => mockGraph(),
  },

  study: {
    content: async () => mockStudyContent(),
    state: async (slug) => copyState(studyState(slug)),

    /** SM-2 del contrato sobre el estado en memoria: la próxima lectura ya lo ve. */
    grade: async (slug, cardId, grade: SrsGrade) => {
      const s = studyState(slug);
      const prev = s.srs.find((x) => x.cardId === cardId);
      const next: SrsState = { cardId, ...sm2(prev ?? SRS_DEFAULT, grade, new Date().toISOString()) };
      s.srs = [...s.srs.filter((x) => x.cardId !== cardId), next];
      return { ...next };
    },

    resetCard: async (slug, cardId) => {
      const s = studyState(slug);
      s.srs = s.srs.filter((x) => x.cardId !== cardId);
    },

    addBookmark: async (slug, page) => {
      const s = studyState(slug);
      if (!s.bookmarks.includes(page)) s.bookmarks = [...s.bookmarks, page];
    },

    removeBookmark: async (slug, page) => {
      const s = studyState(slug);
      s.bookmarks = s.bookmarks.filter((p) => p !== page);
    },

    saveNote: async (slug, page, body) => {
      const s = studyState(slug);
      const note: Note = { page, body, updatedAt: new Date().toISOString() };
      s.notes = [...s.notes.filter((n) => n.page !== page), note];
      return { ...note };
    },

    deleteNote: async (slug, page) => {
      const s = studyState(slug);
      s.notes = s.notes.filter((n) => n.page !== page);
    },

    setTask: async (slug, taskId, done) => {
      const s = studyState(slug);
      s.tasksDone = done
        ? s.tasksDone.includes(taskId)
          ? s.tasksDone
          : [...s.tasksDone, taskId]
        : s.tasksDone.filter((t) => t !== taskId);
    },

    recordAttempt: async (slug, quizId, score, total) => {
      const s = studyState(slug);
      const attempt: QuizAttempt = { quizId, score, total, at: new Date().toISOString() };
      s.attempts = [...s.attempts, attempt];
      return { ...attempt };
    },
  },

  config: async () => ({ googleClientId: null, devBypass: true }),
};
