/**
 * Contexto que el shell le pasa a sus vistas por el Outlet: la materia ya
 * cargada y derivada. Ninguna vista vuelve a pedir `api.subject.detail(slug)`.
 */
import { useOutletContext } from "react-router-dom";
import type { SubjectModel } from "./model";
import type { RuntimeHandle } from "./tools/useRuntime";

export interface SubjectCtx {
  slug: string;
  model: SubjectModel;
  /** Abre la paleta de búsqueda (⌘K) desde cualquier vista. */
  openSearch: () => void;
  /**
   * Runtime de herramientas y figuras de la materia (Sprint 3). Siempre existe;
   * `ready` dice si hay algo detrás. Lo usan `ToolHost` y el lector.
   */
  runtime: RuntimeHandle;
}

export function useSubjectCtx(): SubjectCtx {
  return useOutletContext<SubjectCtx>();
}
