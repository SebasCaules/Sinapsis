/**
 * Fixtures de desarrollo. Solo en `import.meta.env.DEV` y solo cuando la URL
 * trae `?mock=1`: sirven para revisar la landing sin el API levantado (smoke
 * visual, capturas). En producción este módulo es inerte y el bundler lo poda.
 */
import type { SubjectCard, User } from "@sinapsis/contract";

const FLAG = "sinapsis.devMock";

/** ?mock=1 enciende el modo; ?mock=0 lo apaga. La elección dura la pestaña. */
export function isMockMode(): boolean {
  if (!import.meta.env.DEV || typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search).get("mock");
    if (q === "1") sessionStorage.setItem(FLAG, "1");
    if (q === "0") sessionStorage.removeItem(FLAG);
    return sessionStorage.getItem(FLAG) === "1";
  } catch {
    return false;
  }
}

/** ?empty=1 muestra la landing vacía; ?theme= fuerza un tema (capturas). */
export function mockParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

export const mockUser: User = {
  id: "dev-1",
  email: "estudiante@itba.edu.ar",
  name: "Sebastián Caules",
  picture: null,
  theme: "pergamino",
};

const unidad = { singular: "Unidad", abbr: "U", plural: "Unidades" };
const semana = { singular: "Semana", abbr: "S", plural: "Semanas" };
const modulo = { singular: "Módulo", abbr: "M", plural: "Módulos" };

function card(
  slug: string,
  name: string,
  code: string,
  color: string,
  semester: string,
  position: number,
  divisionsCount: number,
  pagesCount: number,
  studiedCount: number,
  extra: Partial<SubjectCard> = {},
): SubjectCard {
  return {
    slug,
    name,
    code,
    institution: "ITBA",
    color,
    division: unidad,
    divisionsCount,
    pagesCount,
    studiedCount,
    semester,
    position,
    placeholder: false,
    lastSyncAt: "2026-09-04T18:20:00.000Z",
    ...extra,
  };
}

export const mockLanding: SubjectCard[] = [
  card("proba", "Probabilidad y Estadística", "93.24", "--u9", "2026-2C", 0, 12, 207, 62),
  card("analisis-ii", "Análisis Matemático II", "93.28", "--u2", "2026-2C", 1, 9, 118, 0),
  card("algoritmos-iii", "Algoritmos y Estructuras de Datos III", "72.33", "--u1", "2026-2C", 2, 8, 96, 96, {
    division: modulo,
  }),
  card("fisica-ii", "Física II", "93.26", "--u4", "2026-1C", 0, 10, 132, 44),
  card("quimica", "Química General", "12.09", "--u6", "2026-1C", 1, 7, 71, 71),
  card("ingles-tecnico", "Inglés Técnico", "94.02", "--u8", "2026-1C", 2, 14, 38, 5, {
    division: semana,
    placeholder: true,
    lastSyncAt: null,
  }),
  card("algebra", "Álgebra I", "93.58", "--u3", "2025-2C", 0, 6, 84, 84),
];
