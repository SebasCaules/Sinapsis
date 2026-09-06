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
import { buildSubjectModel, type SubjectModel } from "./model";
import { useIsDark } from "./store";

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
