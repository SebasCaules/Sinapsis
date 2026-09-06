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
  /**
   * Rótulo del grupo del rail al que pertenece la ruta («Practicar», «Resolver»…).
   * Es lo que el baseline pone en el `title` del punto de la pestaña (`tabMark`),
   * y de donde sale el color de ese punto cuando la ruta no es una página.
   */
  section: string | null;
  /** Miga intermedia (la división de la página abierta). */
  parent: { label: string; to: string } | null;
  /** Slug de la página del wiki que abre la ruta (null si no es el lector). */
  page: string | null;
  /** División en foco: la de `/d/:division` o la de la página abierta. */
  division: string | null;
  /** Id de la vista de herramienta que abre la ruta (`/t/:tool`), o null. */
  tool: string | null;
}

/**
 * Rótulos del material de estudio, que es del agente D3b. Mientras su `useStudy`
 * no exista, las vistas de estudio se describen con su título fijo.
 */
export interface StudyLabels {
  deck?: (id: string) => string | undefined;
  quiz?: (id: string) => string | undefined;
  kit?: (id: string) => string | undefined;
  /**
   * Rótulo de una vista de herramienta (`ToolView.label` del manifiesto), que
   * manda sobre el del rail: la materia puede llamar «Explorador» al ítem y
   * «Explorador de distribuciones» a la vista.
   */
  tool?: (id: string) => string | undefined;
}

const EMPTY: RouteInfo = {
  title: "No encontrado",
  chip: null,
  color: null,
  section: null,
  parent: null,
  page: null,
  division: null,
  tool: null,
};

const plain = (title: string): RouteInfo => ({ ...EMPTY, title });

/**
 * Grupo del rail que contiene esa dirección. Es el criterio del baseline
 * (`tabMark` → `NAV_SECTIONS`): una ruta que no pertenece a ninguna división se
 * reconoce por la intención de su sección, con el color y el nombre del grupo.
 * Se busca por la ruta ya resuelta, así vale igual para un `builtin` que para
 * una herramienta sin tener que repetir la tabla de rutas del modelo.
 */
function railSection(model: SubjectModel | null, to: string): { label: string; color: string } | null {
  if (!model) return null;
  for (const group of model.railGroups) {
    for (const view of group.items) {
      if (view.to === to) return { label: group.label, color: group.color };
    }
  }
  return null;
}

/** `plain`, pero además marcado con el grupo del rail al que pertenece la ruta. */
function inSection(model: SubjectModel | null, to: string, title: string): RouteInfo {
  const section = railSection(model, to);
  return { ...EMPTY, title, section: section?.label ?? null, color: section?.color ?? null };
}

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

  if (!head) return inSection(model, routes.subject(subject), "Inicio");

  switch (head) {
    case "wiki":
      return inSection(model, routes.wiki(subject), "Todo el wiki");
    case "graph":
      return inSection(model, routes.graph(subject), "Grafo de conexiones");
    case "notes":
      return inSection(model, routes.notes(subject), "Mis apuntes");
    case "favorites":
      return inSection(model, routes.favorites(subject), "Favoritos");
    case "plan":
      return inSection(model, routes.plan(subject), "Plan de estudio");
    case "kits": {
      /* Un kit cuelga de la lista de kits: «… › Kits de estudio › <kit>»; un id
         que no existe se anuncia como tal, no como la lista. */
      if (!arg) return inSection(model, routes.kits(subject), "Kits de estudio");
      return {
        ...inSection(model, routes.kits(subject), labels.kit?.(arg) ?? "Kit desconocido"),
        parent: { label: "Kits de estudio", to: routes.kits(subject) },
      };
    }
    case "flashcards":
      return inSection(model, routes.flashcards(subject), arg ? (labels.deck?.(arg) ?? "Flashcards") : "Flashcards");
    case "quiz":
      return inSection(model, routes.quiz(subject), arg ? (labels.quiz?.(arg) ?? "Quiz") : "Quiz");
    case "d": {
      const division = model?.division(arg) ?? null;
      return {
        ...EMPTY,
        title: division?.label ?? model?.config.division.singular ?? "División",
        color: division?.color ?? null,
        /* La división se alcanza DESDE el catálogo y es a donde se vuelve
           (reader.js del original). */
        parent: { label: "Todo el wiki", to: routes.wiki(subject) },
        division: arg || null,
      };
    }
    case "t":
      return {
        ...inSection(model, routes.tool(subject, arg), labels.tool?.(arg) ?? model?.railItem(arg)?.item.label ?? "Herramienta"),
        tool: arg || null,
      };
    case "p": {
      const page = model?.bySlug.get(arg) ?? null;
      /* Con el modelo ya cargado, un slug que no existe NO se rotula con el slug
         crudo: la pestaña, la miga y el título del documento dicen lo mismo que
         la vista («Página no encontrada», core.js:1485-1493). Mientras el modelo
         no llegó, el slug sigue siendo el mejor rótulo provisional. */
      if (model && !page) {
        return { ...EMPTY, title: "Página no encontrada", page: arg || null };
      }
      const key = page && model ? model.divisionOf(page) : null;
      const division = key && model ? (model.division(key) ?? null) : null;
      return {
        title: page?.title ?? arg,
        chip: division?.short ?? null,
        color: division?.color ?? null,
        section: null,
        parent: division ? { label: division.label, to: routes.division(subject, division.key) } : null,
        page: arg || null,
        division: key,
        tool: null,
      };
    }
    default:
      return EMPTY;
  }
}
