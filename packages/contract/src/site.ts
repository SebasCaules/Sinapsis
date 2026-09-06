/**
 * Contrato del SITIO ESTÁTICO (Sprint 4 · N0-56..N0-60).
 *
 * La plataforma ya no tiene API ni sesión: es una SPA servida desde GitHub
 * Pages, y cada materia viaja compilada como archivos JSON estáticos dentro del
 * propio sitio. Este módulo define:
 *
 *   1. Lo que `sinapsis site build` ESCRIBE (y la web LEE) bajo
 *      `<BASE_URL>subjects/…`:
 *
 *        subjects/index.json                 SiteCatalog   — una entrada por materia
 *        subjects/<slug>/subject.json        SiteSubject   — config, páginas sin cuerpo, enlaces, estudio
 *        subjects/<slug>/pages.json          SitePages     — cuerpos, enlaces y encabezados por slug
 *        subjects/<slug>/tools.json          SiteTools     — bundles con su `base` relativa al sitio
 *        subjects/<slug>/tools/<id>/<path>   archivos de cada bundle, tal cual
 *
 *   2. La copia de seguridad del estado personal (`LocalBackup`): lo que el
 *      navegador guarda (progreso, favoritos, apuntes, repaso, plan, intentos,
 *      landing y perfil) y lo que se exporta/importa como archivo.
 *
 * `base` es siempre `import.meta.env.BASE_URL` de Vite (termina en `/`): en
 * desarrollo `/`, en GitHub Pages `/Sinapsis/`. Ninguna ruta de este módulo la
 * asume: se recibe como argumento.
 */
import { z } from "zod";
import {
  DivisionLabel,
  GraphEdge,
  PageHeading,
  PageLink,
  PageMeta,
  Slug,
  StudyContent,
  StudyId,
  StudyState,
  SubjectConfig,
  ThemeId,
  ToolInfo,
  ColorRef,
} from "./index.js";

/** Versión del formato de los archivos estáticos. Sube solo con cambios incompatibles. */
export const SITE_FORMAT = 1 as const;

/** Carpeta (bajo `base`) donde viven los datos de las materias. Sin barras. */
export const SITE_DATA_DIR = "subjects" as const;

/** Nombre de la base IndexedDB y prefijo de las claves del estado personal. */
export const LOCAL_DB_NAME = "sinapsis" as const;
export const LOCAL_DB_STORE = "state" as const;

// ---------------------------------------------------------------------------
// Rutas
// ---------------------------------------------------------------------------

function join(base: string, ...parts: string[]): string {
  const b = base.endsWith("/") ? base : `${base}/`;
  return b + parts.map((p) => p.replace(/^\/+|\/+$/g, "")).join("/");
}

/** Rutas de los archivos estáticos, relativas a `base` (= `import.meta.env.BASE_URL`). */
export const sitePaths = {
  catalog: (base: string) => join(base, SITE_DATA_DIR, "index.json"),
  subject: (base: string, slug: string) => join(base, SITE_DATA_DIR, slug, "subject.json"),
  pages: (base: string, slug: string) => join(base, SITE_DATA_DIR, slug, "pages.json"),
  tools: (base: string, slug: string) => join(base, SITE_DATA_DIR, slug, "tools.json"),
  /** Base (sin barra final) de los archivos de un bundle: `${base}/${path}`. */
  toolBase: (base: string, slug: string, toolId: string) => join(base, SITE_DATA_DIR, slug, "tools", toolId),
  toolFile: (base: string, slug: string, toolId: string, path: string) =>
    join(base, SITE_DATA_DIR, slug, "tools", toolId, path),
} as const;

/**
 * `ToolInfo.base` tal como lo escribe `site build`: RELATIVA al sitio y sin
 * barra final (`subjects/proba/tools/proba-tools`). La web la prefija con
 * `BASE_URL` al cargar el bundle.
 */
export function siteToolBase(slug: string, toolId: string): string {
  return `${SITE_DATA_DIR}/${slug}/tools/${toolId}`;
}

// ---------------------------------------------------------------------------
// Catálogo y materia
// ---------------------------------------------------------------------------

/** Una materia en el catálogo del sitio (lo que necesita la landing sin abrirla). */
export const SiteCatalogEntry = z.object({
  slug: Slug,
  name: z.string(),
  code: z.string(),
  institution: z.string(),
  color: ColorRef,
  /** Cuatrimestre sugerido por el config (`SubjectConfig.semester`); puede faltar. */
  semester: z.string().optional(),
  division: DivisionLabel,
  divisionsCount: z.number().int().min(0),
  /** Páginas que cuentan como contenido (`countsAsContent`). */
  pagesCount: z.number().int().min(0),
  /** Todas las páginas, fuentes incluidas. */
  totalPages: z.number().int().min(0),
  /** Bundles de herramientas publicados. */
  toolsCount: z.number().int().min(0),
  /** Fecha ISO de la compilación de esta materia. */
  builtAt: z.string(),
});
export type SiteCatalogEntry = z.infer<typeof SiteCatalogEntry>;

export const SiteCatalog = z.object({
  format: z.literal(SITE_FORMAT),
  builtAt: z.string(),
  generator: z.string().max(80).optional(),
  subjects: z.array(SiteCatalogEntry).max(200),
});
export type SiteCatalog = z.infer<typeof SiteCatalog>;

/** `subjects/<slug>/subject.json`: todo lo de la materia salvo los cuerpos. */
export const SiteSubject = z.object({
  format: z.literal(SITE_FORMAT),
  builtAt: z.string(),
  generator: z.string().max(80).optional(),
  config: SubjectConfig,
  pages: z.array(PageMeta).max(20000),
  /** Wikilinks resueltos (solo destinos que existen, sin auto-enlaces, sin repetidos). */
  links: z.array(GraphEdge),
  /** Material autoral compilado de `estudio/` (sin los mazos automáticos: los calcula la web). */
  study: StudyContent,
  /** Advertencias del compilador y del material de estudio, para el reporte. */
  warnings: z.array(z.string()).max(500),
});
export type SiteSubject = z.infer<typeof SiteSubject>;

/** Lo que `pages.json` guarda por página: lo que `PageMeta` no lleva. */
export const SitePageBody = z.object({
  body: z.string(),
  links: z.array(PageLink),
  headings: z.array(PageHeading),
});
export type SitePageBody = z.infer<typeof SitePageBody>;

/** `subjects/<slug>/pages.json`: cuerpos por slug. Se carga una sola vez, al abrir la primera página o buscar. */
export const SitePages = z.object({
  format: z.literal(SITE_FORMAT),
  pages: z.record(Slug, SitePageBody),
});
export type SitePages = z.infer<typeof SitePages>;

/** `subjects/<slug>/tools.json`. `base` de cada bundle = `siteToolBase(slug, id)`. */
export const SiteTools = z.object({
  format: z.literal(SITE_FORMAT),
  tools: z.array(ToolInfo).max(64),
});
export type SiteTools = z.infer<typeof SiteTools>;

// ---------------------------------------------------------------------------
// Estado personal (navegador) y copia de seguridad
// ---------------------------------------------------------------------------

/** Versión del formato de la copia de seguridad. */
export const BACKUP_FORMAT = 1 as const;

/** Perfil local: reemplaza al usuario de Google. */
export const LocalProfile = z.object({
  name: z.string().max(120).default("Estudiante"),
  theme: ThemeId.default("pergamino"),
});
export type LocalProfile = z.infer<typeof LocalProfile>;

/** Materia placeholder creada desde la landing (no está en el catálogo). */
export const LocalPlaceholder = z.object({
  slug: Slug,
  name: z.string().min(1).max(120),
  code: z.string().min(1).max(24),
  institution: z.string().min(1).max(80),
  color: ColorRef.optional(),
  division: DivisionLabel,
  createdAt: z.string(),
});
export type LocalPlaceholder = z.infer<typeof LocalPlaceholder>;

/** Ubicación de una materia en la landing del usuario. */
export const LocalPlacement = z.object({
  semester: z.string().min(1).max(24),
  position: z.number().int().min(0),
});
export type LocalPlacement = z.infer<typeof LocalPlacement>;

/** La landing: placements por slug, cuatrimestres declarados (incluidos los vacíos), materias ocultas y placeholders. */
export const LocalLanding = z.object({
  placements: z.record(Slug, LocalPlacement).default({}),
  semesters: z.array(z.string().min(1).max(24)).max(64).default([]),
  /** Materias del catálogo que el usuario quitó de su landing. */
  hidden: z.array(Slug).default([]),
  placeholders: z.array(LocalPlaceholder).max(64).default([]),
});
export type LocalLanding = z.infer<typeof LocalLanding>;

/** Estado personal de UNA materia: `StudyState` + páginas estudiadas (con fecha, para «Repaso de hoy»). */
export const LocalSubjectState = StudyState.extend({
  /** slug de página → fecha ISO en que se marcó estudiada. */
  studied: z.record(Slug, z.string()).default({}),
});
export type LocalSubjectState = z.infer<typeof LocalSubjectState>;

export function emptySubjectState(): LocalSubjectState {
  return { srs: [], bookmarks: [], notes: [], tasksDone: [], attempts: [], planDates: {}, studied: {} };
}

/**
 * Copia de seguridad completa: es TAMBIÉN el documento que se persiste en
 * IndexedDB (y en espejo en localStorage). Exportar = escribir este objeto a un
 * archivo; importar = validarlo y reemplazar (o fusionar) el estado.
 */
export const LocalBackup = z.object({
  format: z.literal(BACKUP_FORMAT),
  /** Fecha ISO de la última escritura (decide cuál copia gana al arrancar). */
  savedAt: z.string(),
  /** Fecha ISO de exportación; solo en el archivo. */
  exportedAt: z.string().optional(),
  profile: LocalProfile.default({}),
  landing: LocalLanding.default({}),
  subjects: z.record(Slug, LocalSubjectState).default({}),
});
export type LocalBackup = z.infer<typeof LocalBackup>;

export function emptyBackup(savedAt = new Date(0).toISOString()): LocalBackup {
  return {
    format: BACKUP_FORMAT,
    savedAt,
    profile: { name: "Estudiante", theme: "pergamino" },
    landing: { placements: {}, semesters: [], hidden: [], placeholders: [] },
    subjects: {},
  };
}

/** Ids que el backup referencia por materia (para validar contra el material vigente, si se quiere). */
export const LocalBackupSubjectIds = z.object({ cards: z.array(StudyId), tasks: z.array(StudyId) });
