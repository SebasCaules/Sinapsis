/**
 * Manifiesto de la siembra: lo escribe `global-setup.ts` y lo leen las specs
 * para saber CON QUÉ datos están corriendo (el vault real de Proba o el
 * fixture `fixtures/mini-payload.json`) y adaptar las aserciones.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const E2E_DIR = path.resolve(__dirname, "..");
export const REPO_ROOT = path.resolve(E2E_DIR, "..");
export const AUTH_DIR = path.join(E2E_DIR, ".auth");
export const STORAGE_STATE = path.join(AUTH_DIR, "dev.json");
export const SEED_FILE = path.join(AUTH_DIR, "seed.json");
export const SHOTS_DIR = path.join(E2E_DIR, "shots");

export const API_ORIGIN = "http://localhost:3100";
export const WEB_ORIGIN = "http://localhost:5174";
export const SYNC_TOKEN = "e2e-token";

/** Vault de Proba en la máquina del autor; si no está, se siembra el fixture. */
export const PROBA_VAULT = path.join(
  process.env["HOME"] ?? "",
  "Desktop/ITBA/26-1C/Proba_Obsidian/wiki",
);

/** Cuerpo exacto de `POST /api/subjects` con el que se sembró cada tarjeta. */
export interface CreateSubjectBody {
  slug: string;
  name: string;
  code: string;
  institution: string;
  semester: string;
  color: string;
  division: { singular: string; abbr: string; plural: string };
}

export interface SeedManifest {
  /** "proba": vault real; "demo": fixture `mini-payload.json`. */
  mode: "proba" | "demo";
  subject: {
    slug: string;
    name: string;
    code: string;
    institution: string;
    /** Cuatrimestre con el que se agregó a la landing del usuario dev. */
    semester: string;
    /** Rótulo del árbol del índice ("UNIDADES" / "SEMANAS"). */
    divisionPlural: string;
    /** Divisiones declaradas en el config. */
    divisionsDeclared: number;
    /** Claves de esas divisiones, en el orden del config. */
    divisionKeys: string[];
    /** Divisiones que el índice llega a dibujar (las que tienen páginas). */
    divisionsVisible: number;
    /** Páginas sincronizadas (todas, fuentes incluidas). */
    pages: number;
  };
  /** Página que usa `reader.spec.ts`. */
  readerPage: { slug: string; title: string; division: string };
  /** División con la que `catalog-search.spec.ts` recorta el catálogo (`?d=`). */
  catalogDivision: string;
  /** Página que usa `catalog-search.spec.ts` para el filtro de texto. */
  filterPage: { slug: string; title: string; term: string; division: string };
  /** Término de la paleta ⌘K y el título que debe encabezar los resultados. */
  palette: { term: string; expected: string };
  /** Materia placeholder creada con POST /api/subjects. */
  placeholder: { slug: string; name: string; semester: string };
  /** Las dos tarjetas de la landing sembrada, para poder reponerlas. */
  landing: CreateSubjectBody[];
}

/**
 * Manifiesto de reserva. Playwright RECOLECTA los archivos de prueba antes de
 * correr `globalSetup`, así que en esa primera pasada `.auth/seed.json` puede no
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
  },
  readerPage: { slug: "demo-formula-clave", title: "Fórmula clave", division: "1" },
  catalogDivision: "1",
  filterPage: { slug: "demo-tecnica", title: "Técnica de resolución", term: "técnica", division: "2" },
  palette: { term: "formula", expected: "Fórmula clave" },
  placeholder: { slug: "demo-b", name: "Materia Demo B", semester: "2025-2C" },
  landing: [],
};

let cached: SeedManifest | null = null;

export function readSeed(): SeedManifest {
  if (cached) return cached;
  if (!existsSync(SEED_FILE)) return FALLBACK;
  cached = JSON.parse(readFileSync(SEED_FILE, "utf8")) as SeedManifest;
  return cached;
}

/** true cuando la siembra usó el vault real de Proba. */
export function isProba(): boolean {
  return readSeed().mode === "proba";
}
