/**
 * Cliente LOCAL: implementa `ApiClient` sin red ni sesión.
 *
 * Es el reemplazo exacto del cliente HTTP del Sprint 3: mismas firmas, mismos
 * tipos, mismos errores (`ApiError` con `status`). Los datos de las materias
 * salen de los archivos estáticos del sitio (`catalog.ts`) y todo lo personal
 * —progreso, favoritos, apuntes, repaso, plan, intentos, landing y perfil— del
 * documento en memoria de `state.ts`, que `persist.ts` baja al navegador.
 *
 * Las vistas no cambian porque la costura no cambió: siguen llamando a `api`.
 */
import {
  SRS_DEFAULT,
  autoDecks,
  countsAsContent,
  sm2,
  type CreateSubjectInput,
  type GraphData,
  type LandingLayoutInput,
  type Note,
  type Page,
  type PageDetail,
  type PageMeta,
  type QuizAttempt,
  type SearchHit,
  type SrsGrade,
  type SrsState,
  type StudyContent,
  type StudyState,
  type SubjectConfigLoose,
  type SubjectDetail,
  type ThemeId,
  type ToolInfo,
  type User,
} from "@sinapsis/contract";
import type { GraphEdge } from "@sinapsis/contract";
import type { LocalSubjectState, SiteSubject } from "@sinapsis/contract/site";
import { ApiError } from "@/lib/apiError";
import type { ApiClient } from "@/lib/api";
import { loadCatalog, loadPages, loadSubject, loadTools } from "./catalog";
import { buildGraph } from "./graph";
import {
  applyLayout,
  availableCards,
  cardOf,
  createSubject as createSubjectIn,
  landingCards,
  landingSemesters,
  placeholderConfig,
  removeFromLanding as removeFromLandingIn,
} from "./landing";
import { buildIndex, searchIndex, type SearchIndex } from "./search";
import { getState, subjectStateOf, update, withProfile, withSubject } from "./state";

/** Intentos de quiz que devuelve `study.state` (los más recientes). */
export const ATTEMPTS_LIMIT = 50;

/** Intentos que se GUARDAN por materia: el documento no puede crecer sin techo. */
export const ATTEMPTS_KEPT = 200;

/** `StudyContent` vacío: lo que ve una materia placeholder. */
const EMPTY_STUDY: StudyContent = { decks: [], quizzes: [], plan: null, kits: [] };

const now = (): string => new Date().toISOString();

// ---------------------------------------------------------------------------
// Resolución de la materia (del sitio o del documento local)
// ---------------------------------------------------------------------------

interface ResolvedSubject {
  config: SubjectConfigLoose;
  pages: PageMeta[];
  links: GraphEdge[];
  study: StudyContent;
  placeholder: boolean;
  lastSyncAt: string | null;
}

const indexes = new Map<string, SearchIndex>();

/** Olvida los índices de búsqueda (lo usa el gancho de pruebas). */
export function clearSearchIndexes(): void {
  indexes.clear();
}

function fromSite(site: SiteSubject): ResolvedSubject {
  return {
    config: site.config,
    pages: site.pages,
    links: site.links,
    study: site.study,
    placeholder: false,
    lastSyncAt: site.builtAt,
  };
}

/**
 * La materia, venga del sitio o del documento local. Una materia que no está en
 * ninguno de los dos es un 404, que es lo que las vistas ya saben mostrar.
 */
async function resolve(slug: string): Promise<ResolvedSubject> {
  const catalog = await loadCatalog();
  if (catalog.subjects.some((entry) => entry.slug === slug)) return fromSite(await loadSubject(slug));

  const placeholder = getState().landing.placeholders.find((p) => p.slug === slug);
  if (!placeholder) throw new ApiError(404, "La materia no existe");

  const placement = getState().landing.placements[slug];
  return {
    config: placeholderConfig(placeholder, placement?.semester),
    pages: [],
    links: [],
    study: EMPTY_STUDY,
    placeholder: true,
    lastSyncAt: null,
  };
}

/** Páginas ordenadas como las lee el índice: `order` primero, después el título. */
function studyOrder(pages: readonly PageMeta[]): PageMeta[] {
  return [...pages].sort((a, b) => {
    const ao = a.order ?? null;
    const bo = b.order ?? null;
    if (ao === null && bo !== null) return 1;
    if (ao !== null && bo === null) return -1;
    if (ao !== null && bo !== null && ao !== bo) return ao - bo;
    return a.title.localeCompare(b.title, "es");
  });
}

/** Material que ve la web: el autoral más los mazos automáticos al final (N0-27). */
function studyContentOf(subject: ResolvedSubject): StudyContent {
  const auto = autoDecks(subject.config, studyOrder(subject.pages));
  return {
    decks: [...subject.study.decks, ...auto],
    quizzes: subject.study.quizzes,
    plan: subject.study.plan,
    kits: subject.study.kits,
  };
}

/** Ids de tarjeta que existen hoy en la materia (autoral + automático). */
function knownCards(content: StudyContent): Set<string> {
  return new Set(content.decks.flatMap((deck) => deck.cards.map((card) => card.id)));
}

/** Progreso de la materia, recortado a las páginas que siguen existiendo. */
function studiedSlugs(slug: string, pages: readonly PageMeta[]): string[] {
  const exists = new Set(pages.map((page) => page.slug));
  return Object.entries(subjectStateOf(getState(), slug).studied)
    .filter(([page]) => exists.has(page))
    /* Más vieja primero: «Repaso de hoy» toma las tres primeras. */
    .sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]))
    .map(([page]) => page);
}

/** Muta el estado de UNA materia. */
function mutateSubject(slug: string, fn: (state: LocalSubjectState) => LocalSubjectState): void {
  update((doc) => withSubject(doc, slug, fn));
}

// ---------------------------------------------------------------------------
// Perfil
// ---------------------------------------------------------------------------

function currentUser(): User {
  const { profile } = getState();
  return { id: "local", email: "", name: profile.name, picture: null, theme: profile.theme };
}

// ---------------------------------------------------------------------------
// El cliente
// ---------------------------------------------------------------------------

export const localApi: ApiClient = {
  auth: {
    me: async () => currentUser(),
    setTheme: async (theme: ThemeId) => {
      update((doc) => withProfile(doc, { theme }));
      return currentUser();
    },
    setName: async (name: string) => {
      update((doc) => withProfile(doc, { name: name.trim().slice(0, 120) || "Estudiante" }));
      return currentUser();
    },
  },

  landing: {
    list: async () => landingCards(getState(), await loadCatalog()),

    available: async () => availableCards(getState(), await loadCatalog()),

    saveLayout: async (input: LandingLayoutInput) => {
      const catalog = await loadCatalog();
      update((doc) => applyLayout(doc, catalog, input));
      return landingCards(getState(), catalog);
    },

    createSubject: async (input: CreateSubjectInput) => {
      const catalog = await loadCatalog();
      const at = now();
      update((doc) => createSubjectIn(doc, catalog, input, at));
      const card = cardOf(getState(), catalog, input.slug, at);
      if (!card) throw new ApiError(500, "No se pudo leer la materia recién agregada");
      return card;
    },

    removeFromLanding: async (slug: string) => {
      const catalog = await loadCatalog();
      update((doc) => removeFromLandingIn(doc, catalog, slug));
    },

    semesters: async () => {
      const catalog = await loadCatalog();
      return landingSemesters(getState(), landingCards(getState(), catalog));
    },
  },

  subject: {
    detail: async (slug: string): Promise<SubjectDetail> => {
      const subject = await resolve(slug);
      return {
        config: subject.config,
        pages: subject.pages,
        studied: studiedSlugs(slug, subject.pages),
        placeholder: subject.placeholder,
        lastSyncAt: subject.lastSyncAt,
      };
    },

    page: async (slug: string, page: string): Promise<PageDetail> => {
      const subject = await resolve(slug);
      const meta = subject.pages.find((p) => p.slug === page);
      if (!meta) throw new ApiError(404, "La página no existe");

      const bodies = await loadPages(slug);
      const body = bodies.pages[page];
      if (!body) throw new ApiError(404, "La página no existe");

      const bySlug = new Map(subject.pages.map((p) => [p.slug, p]));
      const backlinks = subject.links
        .filter((edge) => edge.to === page)
        .map((edge) => bySlug.get(edge.from))
        .filter((p): p is PageMeta => Boolean(p))
        .sort((a, b) => a.title.localeCompare(b.title, "es"));

      const full: Page = { ...meta, links: body.links, headings: body.headings, body: body.body };
      return { page: full, backlinks, studied: page in subjectStateOf(getState(), slug).studied };
    },

    search: async (slug: string, q: string): Promise<SearchHit[]> => {
      const subject = await resolve(slug);
      if (subject.pages.length === 0) return [];

      let index = indexes.get(slug);
      if (!index) {
        const bodies = await loadPages(slug);
        index = buildIndex(
          subject.pages.map((page) => ({
            slug: page.slug,
            title: page.title,
            type: page.type,
            division: page.division,
            summary: page.summary,
            body: bodies.pages[page.slug]?.body ?? "",
          })),
        );
        indexes.set(slug, index);
      }

      return searchIndex(index, q, { isSecondary: (type) => !countsAsContent(subject.config, type) });
    },

    markStudied: async (slug: string, page: string) => {
      const at = now();
      mutateSubject(slug, (state) => ({ ...state, studied: { ...state.studied, [page]: at } }));
    },

    unmarkStudied: async (slug: string, page: string) => {
      mutateSubject(slug, (state) => {
        const { [page]: _gone, ...studied } = state.studied;
        return { ...state, studied };
      });
    },

    graph: async (slug: string): Promise<GraphData> => {
      const subject = await resolve(slug);
      return buildGraph(subject.config, subject.pages, subject.links);
    },

    /**
     * Los bundles, con la `base` RELATIVA que escribió `site build`. El prefijo
     * `BASE_URL` lo pone `bundleOf` en `tools/runtime.ts`: una sola de las dos
     * puntas puede hacerlo, y esa es la que arma la carga.
     */
    tools: async (slug: string): Promise<ToolInfo[]> => {
      const catalog = await loadCatalog();
      if (!catalog.subjects.some((entry) => entry.slug === slug)) return [];
      return (await loadTools(slug)).tools;
    },
  },

  study: {
    content: async (slug: string) => studyContentOf(await resolve(slug)),

    state: async (slug: string): Promise<StudyState> => {
      const subject = await resolve(slug);
      const known = knownCards(studyContentOf(subject));
      const state = subjectStateOf(getState(), slug);
      return {
        /* El SRS se recorta al material vigente (bug 7): una tarjeta borrada
           conserva su fila —el progreso vuelve si vuelve la tarjeta— pero no
           puede aparecer como «vence hoy» en algo que no se puede abrir. */
        srs: state.srs
          .filter((card) => known.has(card.cardId))
          .slice()
          .sort((a, b) => a.due.localeCompare(b.due) || a.cardId.localeCompare(b.cardId)),
        bookmarks: [...state.bookmarks],
        notes: [...state.notes].sort((a, b) => a.page.localeCompare(b.page)),
        tasksDone: [...state.tasksDone].sort(),
        attempts: [...state.attempts]
          .sort((a, b) => b.at.localeCompare(a.at))
          .slice(0, ATTEMPTS_LIMIT),
        planDates: { ...state.planDates },
      };
    },

    grade: async (slug: string, cardId: string, grade: SrsGrade): Promise<SrsState> => {
      const at = now();
      const previous = subjectStateOf(getState(), slug).srs.find((card) => card.cardId === cardId);
      const next: SrsState = { cardId, ...sm2(previous ?? SRS_DEFAULT, grade, at) };
      mutateSubject(slug, (state) => ({
        ...state,
        srs: [...state.srs.filter((card) => card.cardId !== cardId), next],
      }));
      return { ...next };
    },

    resetCard: async (slug: string, cardId: string) => {
      mutateSubject(slug, (state) => ({ ...state, srs: state.srs.filter((card) => card.cardId !== cardId) }));
    },

    addBookmark: async (slug: string, page: string) => {
      mutateSubject(slug, (state) =>
        state.bookmarks.includes(page) ? state : { ...state, bookmarks: [...state.bookmarks, page] },
      );
    },

    removeBookmark: async (slug: string, page: string) => {
      mutateSubject(slug, (state) => ({ ...state, bookmarks: state.bookmarks.filter((p) => p !== page) }));
    },

    saveNote: async (slug: string, page: string, body: string): Promise<Note> => {
      const note: Note = { page, body, updatedAt: now() };
      mutateSubject(slug, (state) => ({
        ...state,
        notes: [...state.notes.filter((n) => n.page !== page), note],
      }));
      return { ...note };
    },

    deleteNote: async (slug: string, page: string) => {
      mutateSubject(slug, (state) => ({ ...state, notes: state.notes.filter((n) => n.page !== page) }));
    },

    setTask: async (slug: string, taskId: string, done: boolean) => {
      mutateSubject(slug, (state) => ({
        ...state,
        tasksDone: done
          ? state.tasksDone.includes(taskId)
            ? state.tasksDone
            : [...state.tasksDone, taskId]
          : state.tasksDone.filter((id) => id !== taskId),
      }));
    },

    /** «Reiniciar el plan»: destilda las tareas. Las FECHAS no se tocan. */
    resetTasks: async (slug: string) => {
      mutateSubject(slug, (state) => ({ ...state, tasksDone: [] }));
    },

    setPlanDate: async (slug: string, key: string, date: string) => {
      mutateSubject(slug, (state) => ({ ...state, planDates: { ...state.planDates, [key]: date } }));
    },

    clearPlanDate: async (slug: string, key: string) => {
      mutateSubject(slug, (state) => {
        const { [key]: _gone, ...planDates } = state.planDates;
        return { ...state, planDates };
      });
    },

    /** «Borrar fechas»: todas las de la materia, sin tocar el progreso. */
    resetPlanDates: async (slug: string) => {
      mutateSubject(slug, (state) => ({ ...state, planDates: {} }));
    },

    recordAttempt: async (slug: string, quizId: string, score: number, total: number): Promise<QuizAttempt> => {
      const attempt: QuizAttempt = { quizId, score, total, at: now() };
      mutateSubject(slug, (state) => ({
        ...state,
        /* Se guardan los últimos `ATTEMPTS_KEPT`: el historial completo haría
           crecer la copia de seguridad sin que nadie lo mire. */
        attempts: [...state.attempts, attempt].slice(-ATTEMPTS_KEPT),
      }));
      return { ...attempt };
    },
  },
};
