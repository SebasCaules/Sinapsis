/**
 * Contexto que el shell le pasa a sus vistas por el Outlet: la materia ya
 * cargada y derivada. Ninguna vista vuelve a pedir `GET /api/subjects/:slug`.
 */
import { useOutletContext } from "react-router-dom";
import type { SubjectModel } from "./model";

export interface SubjectCtx {
  slug: string;
  model: SubjectModel;
  /** Abre la paleta de búsqueda (⌘K) desde cualquier vista. */
  openSearch: () => void;
}

export function useSubjectCtx(): SubjectCtx {
  return useOutletContext<SubjectCtx>();
}
