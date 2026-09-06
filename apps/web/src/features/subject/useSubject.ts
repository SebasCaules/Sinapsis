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
import type { PageDetail, SearchHit, SubjectDetail } from "@sinapsis/contract";
import { api, qk } from "@/lib/api";
import { isMockMode } from "@/mocks/dev-fixtures";
import { buildSubjectModel, type SubjectModel } from "./model";
import { useIsDark } from "./store";

/* El `import.meta.env.DEV &&` no es redundante: es literal `false` en la compilación
   de producción, así que el bundler poda el import dinámico y las fixtures no viajan. */
async function fetchSubject(slug: string): Promise<SubjectDetail> {
  if (import.meta.env.DEV && isMockMode()) {
    const { mockSubjectDetail } = await import("./mocks/proba-fixture");
    return mockSubjectDetail(slug);
  }
  return api.subject.detail(slug);
}

async function fetchPage(slug: string, page: string): Promise<PageDetail> {
  if (import.meta.env.DEV && isMockMode()) {
    const { mockPageDetail } = await import("./mocks/proba-fixture");
    return mockPageDetail(slug, page);
  }
  return api.subject.page(slug, page);
}

async function fetchSearch(slug: string, q: string): Promise<SearchHit[]> {
  if (import.meta.env.DEV && isMockMode()) {
    const { mockSearch } = await import("./mocks/proba-fixture");
    return mockSearch(slug, q);
  }
  return api.subject.search(slug, q);
}

export interface UseSubjectResult {
  query: UseQueryResult<SubjectDetail>;
  /** null mientras carga o si falló. */
  model: SubjectModel | null;
}

/** La materia entera + su modelo derivado (memorizado por respuesta y tema). */
export function useSubject(slug: string): UseSubjectResult {
  const query = useQuery({ queryKey: qk.subject(slug), queryFn: () => fetchSubject(slug) });
  const dark = useIsDark();
  const data = query.data;
  const model = useMemo(() => (data ? buildSubjectModel(data, dark) : null), [data, dark]);
  return { query, model };
}

/** Una página del wiki (cuerpo markdown, backlinks, estudiada). */
export function usePage(slug: string, page: string): UseQueryResult<PageDetail> {
  return useQuery({ queryKey: qk.page(slug, page), queryFn: () => fetchPage(slug, page) });
}

/** Búsqueda de la paleta. `q` ya viene con el rebote aplicado. */
export function useSearch(slug: string, q: string, enabled: boolean): UseQueryResult<SearchHit[]> {
  return useQuery({
    queryKey: qk.search(slug, q),
    queryFn: () => fetchSearch(slug, q),
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
  return useMutation({
    mutationFn: async ({ page, studied }: { page: string; studied: boolean }) => {
      if (import.meta.env.DEV && isMockMode()) return;
      if (studied) await api.subject.markStudied(slug, page);
      else await api.subject.unmarkStudied(slug, page);
    },
    onSettled: () => {
      // La tarjeta de la landing muestra studiedCount: refrescarla al asentarse.
      void qc.invalidateQueries({ queryKey: qk.landing });
    },
    onMutate: async ({ page, studied }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: qk.subject(slug) }),
        qc.cancelQueries({ queryKey: qk.page(slug, page) }),
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
      if (!ctx) return;
      if (ctx.prevSubject) qc.setQueryData(qk.subject(slug), ctx.prevSubject);
      if (ctx.prevPage) qc.setQueryData(qk.page(slug, ctx.page), ctx.prevPage);
    },
  });
}
