/**
 * Cliente HTTP tipado contra el API de Sinapsis. ÚNICA fuente de fetch de la SPA.
 * Las firmas son contrato entre los agentes (landing, materia): no renombrar.
 * Todas las llamadas llevan la cookie de sesión (same-origin vía proxy de Vite).
 *
 * `api` es un objeto MUTABLE: es la única costura del modo mock. En desarrollo,
 * `main.tsx` puede reemplazar sus secciones con `installMockApi()`; el resto de
 * la aplicación llama siempre a `api` y nunca sabe si detrás hay red o fixtures.
 */
import {
  API_PREFIX,
  errorMessageFromBody,
  type CreateSubjectInput,
  type GraphData,
  type LandingLayoutInput,
  type Note,
  type QuizAttempt,
  type SrsGrade,
  type SrsState,
  type StudyContent,
  type StudyState,
  type PageDetail,
  type SearchHit,
  type SubjectCard,
  type SubjectDetail,
  type ThemeId,
  type User,
} from "@sinapsis/contract";

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_PREFIX}${path}`, {
    method,
    credentials: "same-origin",
    headers: body !== undefined ? { "content-type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) throw new ApiError(res.status, errorMessageFromBody(data, res.status, res.statusText), data);
  return data as T;
}
function safeJson(t: string): unknown { try { return JSON.parse(t); } catch { return t; } }

/** Config pública que el servidor expone sin sesión (p. ej. el Google Client ID). */
export interface PublicConfig {
  googleClientId: string | null;
  devBypass: boolean;
}

/** Superficie completa del API. La implementan el cliente real y el de mock. */
export interface ApiClient {
  auth: {
    me(): Promise<User>;
    google(credential: string): Promise<User>;
    dev(): Promise<User>;
    logout(): Promise<void>;
    setTheme(theme: ThemeId): Promise<User>;
  };
  landing: {
    list(): Promise<SubjectCard[]>;
    saveLayout(input: LandingLayoutInput): Promise<SubjectCard[]>;
    createSubject(input: CreateSubjectInput): Promise<SubjectCard>;
    removeFromLanding(slug: string): Promise<void>;
    /** Cuatrimestres del usuario (incluidos los vacíos), en orden. */
    semesters(): Promise<string[]>;
  };
  subject: {
    detail(slug: string): Promise<SubjectDetail>;
    page(slug: string, page: string): Promise<PageDetail>;
    search(slug: string, q: string): Promise<SearchHit[]>;
    markStudied(slug: string, page: string): Promise<void>;
    unmarkStudied(slug: string, page: string): Promise<void>;
    graph(slug: string): Promise<GraphData>;
  };
  /** Sprint 2 · material y estado de estudio por materia. */
  study: {
    content(slug: string): Promise<StudyContent>;
    state(slug: string): Promise<StudyState>;
    grade(slug: string, cardId: string, grade: SrsGrade): Promise<SrsState>;
    resetCard(slug: string, cardId: string): Promise<void>;
    addBookmark(slug: string, page: string): Promise<void>;
    removeBookmark(slug: string, page: string): Promise<void>;
    saveNote(slug: string, page: string, body: string): Promise<Note>;
    deleteNote(slug: string, page: string): Promise<void>;
    setTask(slug: string, taskId: string, done: boolean): Promise<void>;
    recordAttempt(slug: string, quizId: string, score: number, total: number): Promise<QuizAttempt>;
  };
  config(): Promise<PublicConfig>;
}

const enc = encodeURIComponent;

export const api: ApiClient = {
  auth: {
    me: () => request<User>("GET", "/me"),
    google: (credential) => request<User>("POST", "/auth/google", { credential }),
    dev: () => request<User>("POST", "/auth/dev"),
    logout: () => request<void>("POST", "/auth/logout"),
    setTheme: (theme) => request<User>("PATCH", "/me", { theme }),
  },
  landing: {
    list: () => request<SubjectCard[]>("GET", "/landing"),
    saveLayout: (input) => request<SubjectCard[]>("PUT", "/landing", input),
    createSubject: (input) => request<SubjectCard>("POST", "/subjects", input),
    removeFromLanding: (slug) => request<void>("DELETE", `/subjects/${enc(slug)}/landing`),
    semesters: () => request<string[]>("GET", "/landing/semesters"),
  },
  subject: {
    detail: (slug) => request<SubjectDetail>("GET", `/subjects/${enc(slug)}`),
    page: (slug, page) => request<PageDetail>("GET", `/subjects/${enc(slug)}/pages/${enc(page)}`),
    search: (slug, q) => request<SearchHit[]>("GET", `/subjects/${enc(slug)}/search?q=${encodeURIComponent(q)}`),
    markStudied: (slug, page) => request<void>("PUT", `/subjects/${enc(slug)}/progress/${enc(page)}`),
    unmarkStudied: (slug, page) => request<void>("DELETE", `/subjects/${enc(slug)}/progress/${enc(page)}`),
    graph: (slug) => request<GraphData>("GET", `/subjects/${enc(slug)}/graph`),
  },
  study: {
    content: (slug) => request<StudyContent>("GET", `/subjects/${enc(slug)}/study`),
    state: (slug) => request<StudyState>("GET", `/subjects/${enc(slug)}/study/state`),
    grade: (slug, cardId, grade) => request<SrsState>("POST", `/subjects/${enc(slug)}/study/srs/${enc(cardId)}`, { grade }),
    resetCard: (slug, cardId) => request<void>("DELETE", `/subjects/${enc(slug)}/study/srs/${enc(cardId)}`),
    addBookmark: (slug, page) => request<void>("PUT", `/subjects/${enc(slug)}/bookmarks/${enc(page)}`),
    removeBookmark: (slug, page) => request<void>("DELETE", `/subjects/${enc(slug)}/bookmarks/${enc(page)}`),
    saveNote: (slug, page, body) => request<Note>("PUT", `/subjects/${enc(slug)}/notes/${enc(page)}`, { body }),
    deleteNote: (slug, page) => request<void>("DELETE", `/subjects/${enc(slug)}/notes/${enc(page)}`),
    setTask: (slug, taskId, done) => request<void>(done ? "PUT" : "DELETE", `/subjects/${enc(slug)}/tasks/${enc(taskId)}`),
    recordAttempt: (slug, quizId, score, total) =>
      request<QuizAttempt>("POST", `/subjects/${enc(slug)}/quiz/${enc(quizId)}/attempts`, { score, total }),
  },
  config: () => request<PublicConfig>("GET", "/config"),
};

/**
 * Costura ÚNICA del modo mock: reemplaza las implementaciones de `api` sección
 * por sección, conservando la identidad de cada objeto (quien haya capturado
 * `api.landing` sigue viendo la implementación vigente). Solo la llama
 * `main.tsx`, bajo `import.meta.env.DEV`, para que el bundler pode las fixtures.
 */
export function installMockApi(mock: ApiClient): void {
  Object.assign(api.auth, mock.auth);
  Object.assign(api.landing, mock.landing);
  Object.assign(api.subject, mock.subject);
  Object.assign(api.study, mock.study);
  api.config = mock.config;
}

/** Claves de TanStack Query compartidas por todas las features. */
export const qk = {
  me: ["me"] as const,
  config: ["config"] as const,
  landing: ["landing"] as const,
  subject: (slug: string) => ["subject", slug] as const,
  page: (slug: string, page: string) => ["subject", slug, "page", page] as const,
  search: (slug: string, q: string) => ["subject", slug, "search", q] as const,
  graph: (slug: string) => ["subject", slug, "graph"] as const,
  study: (slug: string) => ["subject", slug, "study"] as const,
  studyState: (slug: string) => ["subject", slug, "study", "state"] as const,
  semesters: ["landing", "semesters"] as const,
};
