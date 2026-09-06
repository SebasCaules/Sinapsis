/**
 * Acceso a los datos de una materia: una sola consulta (`GET /api/subjects/:slug`)
 * alimenta el rail, el índice, el inicio, el catálogo y las divisiones; el lector
 * agrega la suya por página. Todo lo derivado se calcula en `model.ts`.
 */
import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { Note, PageDetail, SearchHit, StudyState, SubjectDetail } from "@sinapsis/contract";
import { api, qk } from "@/lib/api";
import { useToast } from "@/components/platform";
import { buildSubjectModel, type SubjectModel } from "./model";
import { useIsDark } from "./store";

/**
 * Lo que se le dice al usuario cuando una mutación optimista se deshace sola
 * (U15). Sin esto, el favorito o el tilde se apagaban en silencio y no había
 * forma de distinguirlo de un clic que no llegó a registrarse.
 */
const SAVE_FAILED = "No se pudo guardar el cambio.";

/* El modo de mentira (`?mock=1`) vive en UNA costura, dentro de `lib/api`: acá
   no hay ramas de desarrollo, solo llamadas al API. */

export interface UseSubjectResult {
  query: UseQueryResult<SubjectDetail>;
  /** null mientras carga o si falló. */
  model: SubjectModel | null;
}

/** La materia entera + su modelo derivado (memorizado por respuesta y tema). */
export function useSubject(slug: string): UseSubjectResult {
  const query = useQuery({ queryKey: qk.subject(slug), queryFn: () => api.subject.detail(slug) });
  const dark = useIsDark();
  const data = query.data;
  const model = useMemo(() => (data ? buildSubjectModel(data, dark) : null), [data, dark]);
  return { query, model };
}

/** Una página del wiki (cuerpo markdown, backlinks, estudiada). */
export function usePage(slug: string, page: string): UseQueryResult<PageDetail> {
  return useQuery({ queryKey: qk.page(slug, page), queryFn: () => api.subject.page(slug, page) });
}

/** Búsqueda de la paleta. `q` ya viene con el rebote aplicado. */
export function useSearch(slug: string, q: string, enabled: boolean): UseQueryResult<SearchHit[]> {
  return useQuery({
    queryKey: qk.search(slug, q),
    queryFn: () => api.subject.search(slug, q),
    enabled: enabled && q.trim().length > 0,
    staleTime: 60_000,
  });
}

/**
 * Marcar / desmarcar estudiada, con actualización optimista de las dos consultas
 * que muestran el estado (la materia y la página) y vuelta atrás si el API falla.
 */
export function useToggleStudied(slug: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ page, studied }: { page: string; studied: boolean }) => {
      if (studied) await api.subject.markStudied(slug, page);
      else await api.subject.unmarkStudied(slug, page);
    },
    onSettled: () => {
      // La tarjeta de la landing muestra studiedCount: refrescarla al asentarse.
      void qc.invalidateQueries({ queryKey: qk.landing });
    },
    onMutate: async ({ page, studied }) => {
      /* `exact`: sin él, `qk.subject(slug)` es PREFIJO de `qk.page(slug, …)` y
         de `qk.studyState(slug)`, así que cancelar la materia cancelaba también
         la página que se acaba de abrir y las consultas de estudio (bug 6). */
      await Promise.all([
        qc.cancelQueries({ queryKey: qk.subject(slug), exact: true }),
        qc.cancelQueries({ queryKey: qk.page(slug, page), exact: true }),
      ]);
      const prevSubject = qc.getQueryData<SubjectDetail>(qk.subject(slug));
      const prevPage = qc.getQueryData<PageDetail>(qk.page(slug, page));
      if (prevSubject) {
        const rest = prevSubject.studied.filter((s) => s !== page);
        qc.setQueryData<SubjectDetail>(qk.subject(slug), {
          ...prevSubject,
          studied: studied ? [...rest, page] : rest,
        });
      }
      if (prevPage) qc.setQueryData<PageDetail>(qk.page(slug, page), { ...prevPage, studied });
      return { prevSubject, prevPage, page };
    },
    onError: (_err, _vars, ctx) => {
      toast(SAVE_FAILED, "bad");
      if (!ctx) return;
      if (ctx.prevSubject) qc.setQueryData(qk.subject(slug), ctx.prevSubject);
      if (ctx.prevPage) qc.setQueryData(qk.page(slug, ctx.page), ctx.prevPage);
    },
  });
}

// ---------------------------------------------------------------------------
// Sprint 2 — estado de estudio del usuario (favoritos, apuntes, SRS, tareas)
// ---------------------------------------------------------------------------

/** El estado vacío: referencia estable, para que las vistas no ramifiquen por `undefined`. */
const EMPTY_STUDY_STATE: StudyState = { srs: [], bookmarks: [], notes: [], tasksDone: [], attempts: [] };

export interface UseStudyStateResult {
  query: UseQueryResult<StudyState>;
  /** Nunca null: mientras carga es el estado vacío. */
  state: StudyState;
  bookmarks: Set<string>;
  /** slug de página → apunte. */
  notes: Map<string, Note>;
}

/**
 * `GET /api/subjects/:slug/study/state`, con los índices que usan el lector, el
 * índice, el catálogo y las vistas de «Lo mío». Es UNA consulta compartida: las
 * mutaciones de abajo la escriben en optimista y ninguna vista vuelve a pedirla.
 */
export function useStudyState(slug: string): UseStudyStateResult {
  const query = useQuery({ queryKey: qk.studyState(slug), queryFn: () => api.study.state(slug) });
  const state = query.data ?? EMPTY_STUDY_STATE;
  const bookmarks = useMemo(() => new Set(state.bookmarks), [state.bookmarks]);
  const notes = useMemo(() => new Map(state.notes.map((n) => [n.page, n])), [state.notes]);
  return { query, state, bookmarks, notes };
}

/** Aplica un cambio sobre el estado de estudio en caché y devuelve el anterior. */
function patchStudyState(
  qc: ReturnType<typeof useQueryClient>,
  slug: string,
  patch: (prev: StudyState) => StudyState,
): StudyState | undefined {
  const prev = qc.getQueryData<StudyState>(qk.studyState(slug));
  qc.setQueryData<StudyState>(qk.studyState(slug), patch(prev ?? EMPTY_STUDY_STATE));
  return prev;
}

/** Favorito de una página, en optimista: la ★ se enciende antes que responda el API. */
export function useToggleBookmark(slug: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ page, on }: { page: string; on: boolean }) => {
      if (on) await api.study.addBookmark(slug, page);
      else await api.study.removeBookmark(slug, page);
    },
    onMutate: async ({ page, on }) => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      const prev = patchStudyState(qc, slug, (s) => ({
        ...s,
        bookmarks: on ? [...s.bookmarks.filter((b) => b !== page), page] : s.bookmarks.filter((b) => b !== page),
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      toast(SAVE_FAILED, "bad");
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
  });
}

/**
 * Guarda el apunte de una página. El rebote de 800 ms lo pone quien escribe (el
 * lector): acá el guardado es siempre explícito, así el ⌘S y el botón no tienen
 * que esperar a que venza ningún temporizador.
 */
export function useSaveNote(slug: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ page, body }: { page: string; body: string }) => api.study.saveNote(slug, page, body),
    onMutate: async ({ page, body }) => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      const at = new Date().toISOString();
      const prev = patchStudyState(qc, slug, (s) => ({
        ...s,
        notes: s.notes.some((n) => n.page === page)
          ? s.notes.map((n) => (n.page === page ? { ...n, body, updatedAt: at } : n))
          : [...s.notes, { page, body, updatedAt: at }],
      }));
      return { prev };
    },
    onSuccess: (note) => {
      /* La fecha la fija el servidor: se repone la que devolvió. */
      patchStudyState(qc, slug, (s) => ({
        ...s,
        notes: s.notes.map((n) => (n.page === note.page ? note : n)),
      }));
    },
    onError: (_err, _vars, ctx) => {
      toast(SAVE_FAILED, "bad");
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
  });
}

/** Borra el apunte de una página (el textarea vacío no se guarda: se borra). */
export function useDeleteNote(slug: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ page }: { page: string }) => api.study.deleteNote(slug, page),
    onMutate: async ({ page }) => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      const prev = patchStudyState(qc, slug, (s) => ({ ...s, notes: s.notes.filter((n) => n.page !== page) }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      toast(SAVE_FAILED, "bad");
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
  });
}
