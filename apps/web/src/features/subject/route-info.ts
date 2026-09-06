/**
 * «Qué es esta ruta»: título, chip de división, color y miga intermedia de
 * cualquier dirección de una materia.
 *
 * Es una función PURA sobre el pathname, no un puñado de `useMatch`: además de
 * la ruta activa (el shell) hay que describir rutas que NO se están visitando
 * —la que abre un ⌘-clic en una pestaña nueva—, y eso los hooks de router no lo
 * pueden hacer. Una sola definición para la pestaña, las migas y el título del
 * documento.
 */
import { routes } from "@sinapsis/contract";
import type { SubjectModel } from "./model";

export interface RouteInfo {
  /** Rótulo de la vista: pestaña, última miga y `document.title`. */
  title: string;
  /** Rótulo corto de la división (solo con una página abierta). */
  chip: string | null;
  /** Color de la división, si la ruta pertenece a una. */
  color: string | null;
  /** Miga intermedia (la división de la página abierta). */
  parent: { label: string; to: string } | null;
  /** Slug de la página del wiki que abre la ruta (null si no es el lector). */
  page: string | null;
  /** División en foco: la de `/d/:division` o la de la página abierta. */
  division: string | null;
}

/**
 * Rótulos del material de estudio, que es del agente D3b. Mientras su `useStudy`
 * no exista, las vistas de estudio se describen con su título fijo.
 */
export interface StudyLabels {
  deck?: (id: string) => string | undefined;
  quiz?: (id: string) => string | undefined;
  kit?: (id: string) => string | undefined;
}

const EMPTY: RouteInfo = { title: "No encontrado", chip: null, color: null, parent: null, page: null, division: null };

const plain = (title: string): RouteInfo => ({ ...EMPTY, title });

/** Segmentos de la ruta DENTRO de la materia; null si el pathname es de otra. */
export function subjectSegments(subject: string, pathname: string): string[] | null {
  const base = routes.subject(subject);
  if (pathname !== base && !pathname.startsWith(`${base}/`)) return null;
  return pathname
    .slice(base.length)
    .split("/")
    .filter(Boolean)
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    });
}

/** ¿Esta dirección pertenece a la materia (y por lo tanto la abre una pestaña)? */
export function isSubjectPath(subject: string, pathname: string): boolean {
  return subjectSegments(subject, pathname) !== null;
}

/**
 * Describe una ruta de la materia. `model` puede ser null mientras carga: en ese
 * caso se devuelven los rótulos fijos que no dependen de las páginas.
 */
export function describePath(
  model: SubjectModel | null,
  subject: string,
  pathname: string,
  labels: StudyLabels = {},
): RouteInfo {
  const segments = subjectSegments(subject, pathname);
  if (!segments) return EMPTY;
  const [head = "", arg = ""] = segments;

  if (!head) return plain("Inicio");

  switch (head) {
    case "wiki":
      return plain("Todo el wiki");
    case "graph":
      return plain("Grafo de conexiones");
    case "notes":
      return plain("Mis apuntes");
    case "favorites":
      return plain("Favoritos");
    case "plan":
      return plain("Plan de estudio");
    case "kits":
      return plain(arg ? (labels.kit?.(arg) ?? "Kits de estudio") : "Kits de estudio");
    case "flashcards":
      return plain(arg ? (labels.deck?.(arg) ?? "Flashcards") : "Flashcards");
    case "quiz":
      return plain(arg ? (labels.quiz?.(arg) ?? "Quiz") : "Quiz");
    case "d": {
      const division = model?.division(arg) ?? null;
      return {
        ...EMPTY,
        title: division?.label ?? model?.config.division.singular ?? "División",
        color: division?.color ?? null,
        division: arg || null,
      };
    }
    case "t":
      return plain(model?.railItem(arg)?.item.label ?? "Herramienta");
    case "p": {
      const page = model?.bySlug.get(arg) ?? null;
      const key = page && model ? model.divisionOf(page) : null;
      const division = key && model ? (model.division(key) ?? null) : null;
      return {
        title: page?.title ?? arg,
        chip: division?.short ?? null,
        color: division?.color ?? null,
        parent: division ? { label: division.label, to: routes.division(subject, division.key) } : null,
        page: arg || null,
        division: key,
      };
    }
    default:
      return EMPTY;
  }
}
