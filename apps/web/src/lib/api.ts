/**
 * Costura ÚNICA de datos de la SPA. Desde el Sprint 4 no hay servidor: detrás
 * de `api` está el CLIENTE LOCAL (`src/local/client.ts`), que lee las materias
 * de los archivos estáticos del sitio y guarda todo lo personal en el navegador.
 *
 * Lo que no cambió es lo que importa: `ApiClient` sigue siendo el contrato entre
 * las vistas y los datos, `api` sigue siendo un objeto MUTABLE (la costura del
 * modo mock), `qk` sigue mandando las claves de TanStack Query y `ApiError`
 * sigue teniendo `{ status, message }`, que es como las vistas distinguen el 404.
 * Ninguna vista sabe si detrás hay archivos, memoria o fixtures.
 */
import type {
  CreateSubjectInput,
  GraphData,
  LandingLayoutInput,
  Note,
  QuizAttempt,
  SrsGrade,
  SrsState,
  StudyContent,
  StudyState,
  PageDetail,
  SearchHit,
  SubjectCard,
  SubjectDetail,
  ThemeId,
  ToolInfo,
  User,
} from "@sinapsis/contract";
import { localApi } from "@/local/client";

export { ApiError } from "./apiError";

/** Superficie completa de datos. La implementan el cliente local y el de mock. */
export interface ApiClient {
  auth: {
    me(): Promise<User>;
    setTheme(theme: ThemeId): Promise<User>;
    /** Nombre del perfil local (reemplaza al de la cuenta de Google). */
    setName(name: string): Promise<User>;
  };
  landing: {
    list(): Promise<SubjectCard[]>;
    /** Materias del catálogo que están fuera de la landing (para «Agregar materia»). */
    available(): Promise<SubjectCard[]>;
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
    /** Sprint 3 · bundles de herramientas y figuras que declaró la materia. */
    tools(slug: string): Promise<ToolInfo[]>;
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
    /** Reinicia el plan: borra todas las tareas tildadas de la materia (las fechas quedan). */
    resetTasks(slug: string): Promise<void>;
    /** Fecha de una instancia evaluatoria del plan (AAAA-MM-DD). */
    setPlanDate(slug: string, key: string, date: string): Promise<void>;
    clearPlanDate(slug: string, key: string): Promise<void>;
    /** Borra todas las fechas cargadas de la materia. */
    resetPlanDates(slug: string): Promise<void>;
    recordAttempt(slug: string, quizId: string, score: number, total: number): Promise<QuizAttempt>;
  };
}

/**
 * El cliente vigente. Se arma copiando cada sección del cliente local para que
 * `installMockApi` pueda reemplazar sus métodos sin tocar el original y sin
 * romper la identidad de los objetos: quien haya capturado `api.landing` sigue
 * viendo la implementación vigente.
 */
export const api: ApiClient = {
  auth: { ...localApi.auth },
  landing: { ...localApi.landing },
  subject: { ...localApi.subject },
  study: { ...localApi.study },
};

/**
 * Costura del modo mock: reemplaza las implementaciones sección por sección.
 * Solo la llama `main.tsx`, bajo `import.meta.env.DEV`, para que el bundler pode
 * las fixtures.
 */
export function installMockApi(mock: ApiClient): void {
  Object.assign(api.auth, mock.auth);
  Object.assign(api.landing, mock.landing);
  Object.assign(api.subject, mock.subject);
  Object.assign(api.study, mock.study);
}

/** Claves de TanStack Query compartidas por todas las features. */
export const qk = {
  me: ["me"] as const,
  landing: ["landing"] as const,
  available: ["landing", "available"] as const,
  subject: (slug: string) => ["subject", slug] as const,
  page: (slug: string, page: string) => ["subject", slug, "page", page] as const,
  search: (slug: string, q: string) => ["subject", slug, "search", q] as const,
  graph: (slug: string) => ["subject", slug, "graph"] as const,
  tools: (slug: string) => ["subject", slug, "tools"] as const,
  study: (slug: string) => ["subject", slug, "study"] as const,
  studyState: (slug: string) => ["subject", slug, "study", "state"] as const,
  semesters: ["landing", "semesters"] as const,
};
