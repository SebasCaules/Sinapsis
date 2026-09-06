/**
 * Manifiesto de la siembra: lo escribe `global-setup.ts` leyendo el sitio ya
 * compilado (`e2e/.site/subjects/`) y lo leen las specs para saber CON QUÉ datos
 * están corriendo —la materia real de `subjects/proba/` o el fixture
 * `e2e/fixtures/subjects/demo/`— y adaptar sus aserciones.
 *
 * Ya no hay base de datos ni cookies: el estado personal vive en el navegador
 * (IndexedDB + `localStorage`) y cada prueba de Playwright arranca con un
 * contexto limpio. Lo único que este archivo describe es el CONTENIDO del sitio
 * y la landing que las specs de landing reponen con `restore()`.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { E2E_DIR, REPO_ROOT, SITE_DIR, SITE_SUBJECTS_DIR } from "./site";

export { E2E_DIR, REPO_ROOT, SITE_DIR, SITE_SUBJECTS_DIR };

/** Manifiesto de la siembra (gitignorado: lo rehace cada corrida). */
export const SEED_FILE = path.join(E2E_DIR, ".seed.json");
export const SHOTS_DIR = path.join(E2E_DIR, "shots");

export const WEB_ORIGIN = "http://localhost:5174";

/** Nomenclatura de la división de una materia. */
export interface DivisionLabelDto {
  singular: string;
  abbr: string;
  plural: string;
}

/** Ubicación de una materia en la landing (`LocalPlacement` del contrato). */
export interface PlacementDto {
  semester: string;
  position: number;
}

/** Materia inventada a mano (`LocalPlaceholder` del contrato). */
export interface PlaceholderDto {
  slug: string;
  name: string;
  code: string;
  institution: string;
  color?: string;
  division: DivisionLabelDto;
  createdAt: string;
}

/** `LocalLanding` del contrato: lo que repone `resetLanding`. */
export interface SeedLanding {
  placements: Record<string, PlacementDto>;
  semesters: string[];
  hidden: string[];
  placeholders: PlaceholderDto[];
}

/** Bundle de herramientas publicado en la materia sembrada. */
export interface SeedTools {
  /** Id del manifiesto: es el de la URL del bundle. */
  id: string;
  title: string;
  /** Vistas registradas, en el orden del manifiesto. */
  views: Array<{ id: string; label: string }>;
  /** La vista que abren las specs (la primera del manifiesto). */
  view: { id: string; label: string };
  /** Ids de vista de TODOS los bundles de la materia, no solo los del principal. */
  allViews: string[];
  /** true si el bundle registra figuras para los callouts `[!figura]`. */
  figures: boolean;
  /** Archivos del bundle escritos en el sitio. */
  files: number;
}

/** Material de estudio con el que corren las specs de repaso y de quiz. */
export interface SeedStudy {
  /** Mazo AUTORAL más corto: una sesión entera cabe en una prueba. */
  deck: { id: string; title: string; cards: number } | null;
  /** Primer quiz de la materia. */
  quiz: { id: string; title: string; questions: number } | null;
  /** Mazos automáticos que agrega la plataforma (uno por división con contenido). */
  autoDecks: number;
  /** Mazos autorales del wiki. */
  authoredDecks: number;
  /** La materia trae plan de estudio. */
  hasPlan: boolean;
  /** Kits declarados en `estudio/kits.json`. */
  kits: number;
}

export interface SeedManifest {
  /** "proba": la materia real del repositorio; "demo": el fixture de `e2e/fixtures`. */
  mode: "proba" | "demo";
  subject: {
    slug: string;
    name: string;
    code: string;
    institution: string;
    /** Cuatrimestre que declara el config: es donde la landing la ubica sola. */
    semester: string;
    /** Rótulo del árbol del índice ("UNIDADES" / "SEMANAS"). */
    divisionPlural: string;
    /** Divisiones declaradas en el config. */
    divisionsDeclared: number;
    /** Claves de esas divisiones, en el orden del config. */
    divisionKeys: string[];
    /** Divisiones que el índice llega a dibujar (las que tienen páginas). */
    divisionsVisible: number;
    /** Páginas compiladas (todas, fuentes incluidas). */
    pages: number;
    /** Páginas que cuentan como contenido (lo que muestra la landing). */
    contentPages: number;
  };
  /** Página que usan `reader.spec.ts`, `study.spec.ts` y `page-tip.spec.ts`. */
  readerPage: { slug: string; title: string; division: string };
  /** División con la que `catalog-search.spec.ts` recorta el catálogo (`?d=`). */
  catalogDivision: string;
  /** Página que usa `catalog-search.spec.ts` para el filtro de texto. */
  filterPage: { slug: string; title: string; term: string; division: string };
  /** Término de la paleta ⌘K y el título que debe encabezar los resultados. */
  palette: { term: string; expected: string };
  /** Bundle principal de la materia (el que registra figuras). */
  tools: SeedTools;
  /** Ítems `kind: "tool"` del rail del config, con la vista que abre cada uno. */
  railTools: Array<{ id: string; label: string; target: string }>;
  /** Rótulos de los grupos SLOT del rail (los que declara `rail[]` del config). */
  railSlots: string[];
  /** Página con un `> [!figura]` y el id de la primera figura que declara. */
  figurePage: { slug: string; title: string; fig: string };
  /** Materia placeholder que crean las specs de landing con `restore()`. */
  placeholder: PlaceholderDto & { semester: string };
  /** Landing inicial que repone `resetLanding` (catálogo + la placeholder). */
  landing: SeedLanding;
  study: SeedStudy;
}

const PLACEHOLDER: PlaceholderDto & { semester: string } = {
  slug: "demo-b",
  name: "Materia Demo B",
  code: "00.02",
  institution: "Instituto Demo",
  color: "--u6",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  createdAt: "2026-01-01T00:00:00.000Z",
  semester: "2025-2C",
};

/** La materia placeholder de las specs de landing, con su cuatrimestre. */
export const SEED_PLACEHOLDER = PLACEHOLDER;

/**
 * Manifiesto de reserva. Playwright RECOLECTA los archivos de prueba antes de
 * correr `globalSetup`, así que en esa primera pasada `.seed.json` puede no
 * existir todavía. Los títulos de las pruebas no dependen de estos valores: los
 * workers (que arrancan después de la siembra) siempre leen el archivo real.
 */
const FALLBACK: SeedManifest = {
  mode: "demo",
  subject: {
    slug: "demo",
    name: "Materia Demo",
    code: "00.01",
    institution: "Instituto Demo",
    semester: "2026-1C",
    divisionPlural: "SEMANAS",
    divisionsDeclared: 3,
    divisionKeys: ["1", "2", "3"],
    divisionsVisible: 3,
    pages: 8,
    contentPages: 7,
  },
  readerPage: { slug: "demo-conceptos-basicos", title: "Conceptos básicos", division: "1" },
  catalogDivision: "1",
  filterPage: { slug: "demo-tecnica", title: "Técnica de resolución", term: "técnica", division: "2" },
  palette: { term: "formula", expected: "Fórmula clave" },
  tools: {
    id: "mini-demo",
    title: "Herramientas de Materia Demo",
    views: [{ id: "demo", label: "Vista de demostración" }],
    view: { id: "demo", label: "Vista de demostración" },
    allViews: ["demo"],
    figures: true,
    files: 2,
  },
  railTools: [
    { id: "demo", label: "Vista de demostración", target: "demo" },
    { id: "calc", label: "Calculadoras", target: "calc" },
  ],
  railSlots: ["Resolver", "Material"],
  figurePage: { slug: "demo-repaso", title: "Repaso general", fig: "demo-fig" },
  placeholder: PLACEHOLDER,
  landing: {
    placements: {
      demo: { semester: "2026-1C", position: 0 },
      [PLACEHOLDER.slug]: { semester: PLACEHOLDER.semester, position: 0 },
    },
    semesters: ["2026-1C", PLACEHOLDER.semester],
    hidden: [],
    placeholders: [PLACEHOLDER],
  },
  study: {
    deck: { id: "demo-basico", title: "Nociones de la materia demo", cards: 4 },
    quiz: { id: "quiz-demo", title: "Quiz de la materia demo", questions: 5 },
    autoDecks: 3,
    authoredDecks: 1,
    hasPlan: true,
    kits: 1,
  },
};

let cached: SeedManifest | null = null;

export function readSeed(): SeedManifest {
  if (cached) return cached;
  if (!existsSync(SEED_FILE)) return FALLBACK;
  cached = JSON.parse(readFileSync(SEED_FILE, "utf8")) as SeedManifest;
  return cached;
}

/** true cuando la suite corre con la materia real de `subjects/proba/`. */
export function isProba(): boolean {
  return readSeed().mode === "proba";
}

/** "2026-1C" → "Cuatrimestre 1 · 2026" (el rótulo que dibuja la landing). */
export function semesterLabel(raw: string): string {
  const m = raw.match(/^(\d{4})-(\d)C$/);
  return m ? `Cuatrimestre ${m[2] as string} · ${m[1] as string}` : raw;
}
