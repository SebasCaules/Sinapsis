/**
 * Utilidades compartidas por las specs.
 *
 * Ya no hay servidor que sembrar. El estado personal (progreso, favoritos,
 * apuntes, repaso, plan, landing y perfil) vive en el navegador —IndexedDB con
 * espejo en `localStorage`— y se toca por el GANCHO DE PRUEBAS que instala la
 * web con `VITE_E2E=1` (`apps/web/src/local/testHook.ts`):
 *
 *   window.__sinapsis = { reset(), snapshot(), restore(doc), setTheme(t) }
 *
 * De ahí salen todos los repositores: `snapshot()` trae el documento
 * (`LocalBackup`), se lo edita en Node y `restore()` lo deja escrito. Dos
 * cuidados que las specs tienen que respetar:
 *
 *  · el gancho solo existe con la aplicación cargada, así que los helpers
 *    navegan a `/` si la pestaña todavía está en `about:blank`;
 *  · `restore()` invalida las consultas, pero si la pantalla YA estaba montada
 *    conviene recargar (`page.reload()`) para verla con el estado nuevo.
 *
 * Aislamiento: cada prueba de Playwright corre en un contexto propio, con
 * IndexedDB y `localStorage` vacíos. No hace falta limpiar al terminar; lo que
 * se repone es lo que la prueba necesita ENCONTRAR (la materia placeholder de la
 * landing, tarjetas de repaso vencidas…).
 *
 * Lo que es del SITIO —el material de estudio, los bundles— no se lee del
 * navegador sino de los archivos que compiló la siembra (`e2e/.site/subjects/`).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Browser, Page } from "@playwright/test";
import { SITE_SUBJECTS_DIR, readSeed, type PlaceholderDto, type PlacementDto } from "./seed";

// ---------------------------------------------------------------------------
// El gancho
// ---------------------------------------------------------------------------

/** `LocalSubjectState` del contrato, con lo que leen las specs. */
export interface StudyStateDto {
  srs: Array<{
    cardId: string;
    ease: number;
    interval: number;
    due: string;
    reps: number;
    lapses: number;
    lastGrade: number | null;
    updatedAt: string;
  }>;
  bookmarks: string[];
  notes: Array<{ page: string; body: string; updatedAt: string }>;
  tasksDone: string[];
  attempts: Array<{ quizId: string; score: number; total: number; at: string }>;
  planDates: Record<string, string>;
  /** slug de página → fecha ISO en que se marcó estudiada. */
  studied: Record<string, string>;
}

/** `LocalBackup` del contrato: el documento entero del estado personal. */
export interface LocalBackupDto {
  format: 1;
  savedAt: string;
  exportedAt?: string;
  profile: { name: string; theme: "pergamino" | "laurel" | "claustro" };
  landing: {
    placements: Record<string, PlacementDto>;
    semesters: string[];
    hidden: string[];
    placeholders: PlaceholderDto[];
  };
  subjects: Record<string, StudyStateDto>;
}

declare global {
  interface Window {
    __sinapsis?: {
      reset(): Promise<void>;
      snapshot(): Promise<LocalBackupDto>;
      restore(doc: LocalBackupDto): Promise<void>;
      setTheme(theme: "pergamino" | "laurel" | "claustro"): Promise<void>;
    };
  }
}

/** Estado vacío de una materia (`emptySubjectState` del contrato). */
export function emptySubjectState(): StudyStateDto {
  return { srs: [], bookmarks: [], notes: [], tasksDone: [], attempts: [], planDates: {}, studied: {} };
}

/**
 * Deja la aplicación cargada y el gancho instalado. `main.tsx` lo cuelga DESPUÉS
 * de leer el estado local, así que esperar al gancho garantiza además que la
 * hidratación terminó y `snapshot()` no devuelve un documento a medio leer.
 */
export async function withHook(page: Page): Promise<void> {
  if (!page.url().startsWith("http")) await page.goto("/");
  await page.waitForFunction(() => Boolean(window.__sinapsis));
}

/** El documento vigente del navegador. */
export async function snapshot(page: Page): Promise<LocalBackupDto> {
  await withHook(page);
  return page.evaluate(() => window.__sinapsis!.snapshot());
}

/** Reemplaza el documento del navegador y lo persiste. */
export async function restore(page: Page, doc: LocalBackupDto): Promise<void> {
  await withHook(page);
  await page.evaluate((next) => window.__sinapsis!.restore(next), doc);
}

/** Deja el estado personal como recién estrenado (IndexedDB, espejo y claves). */
export async function resetLocal(page: Page): Promise<void> {
  await withHook(page);
  await page.evaluate(() => window.__sinapsis!.reset());
}

/** `snapshot()` + parche + `restore()`, que es la forma de todos los repositores. */
async function patch(page: Page, fn: (doc: LocalBackupDto) => LocalBackupDto): Promise<void> {
  const doc = await snapshot(page);
  await restore(page, fn(doc));
}

/**
 * Abre una pestaña con la aplicación cargada para los hooks que no reciben la
 * fixture `page` (`beforeAll` / `afterAll` solo tienen `browser`).
 */
export async function withApi<T>(browser: Browser, fn: (page: Page) => Promise<T>): Promise<T> {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await withHook(page);
    return await fn(page);
  } finally {
    await context.close();
  }
}

// ---------------------------------------------------------------------------
// Datos del sitio (archivos, no navegador)
// ---------------------------------------------------------------------------

function siteJson<T>(slug: string, file: string): T {
  return JSON.parse(readFileSync(path.join(SITE_SUBJECTS_DIR, slug, file), "utf8")) as T;
}

export interface StudyDeckDto {
  id: string;
  title: string;
  source?: "auto" | "authored";
  division?: string;
  cards: Array<{ id: string; front: string; back: string; page?: string }>;
}

export interface StudyQuizDto {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    prompt: string;
    options: Array<{ text: string; correct: boolean }>;
    explanation?: string;
  }>;
}

export interface PlanPhaseDto {
  id: string;
  title: string;
  instance?: string;
  retake?: string;
}

/** Modalidad del plan (N0-43): su propia lista de fases. */
export interface PlanTrackDto {
  id: string;
  label: string;
  description?: string;
  phases: PlanPhaseDto[];
}

export interface PlanDto {
  title: string;
  phases: PlanPhaseDto[];
  tracks: PlanTrackDto[];
  instances: Array<{ key: string; label: string; optional?: boolean }>;
}

/** Lanzador de un kit: un id del rail, o el id con rótulo e icono propios. */
export type KitToolDto = string | { target: string; label?: string; icon?: string };

export interface KitDto {
  id: string;
  title: string;
  pages: string[];
  decks: string[];
  quizzes: string[];
  tools: KitToolDto[];
}

export interface StudyContentDto {
  decks: StudyDeckDto[];
  quizzes: StudyQuizDto[];
  plan: PlanDto | null;
  kits: KitDto[];
}

interface SiteSubjectDto {
  config: unknown;
  pages: Array<{ slug: string; title: string; summary: string; type: string; division: string }>;
  study: StudyContentDto;
}

/** Metadatos de las páginas de la materia, tal como los compiló la siembra. */
export function subjectPages(slug: string): SiteSubjectDto["pages"] {
  return siteJson<SiteSubjectDto>(slug, "subject.json").pages;
}

let autoDecksFn: ((cfg: unknown, pages: unknown) => StudyDeckDto[]) | null = null;

/**
 * El material que VE la web: el autoral de `estudio/` más los mazos automáticos
 * por división, que la plataforma calcula al leer (no viajan en el archivo).
 */
export async function studyContent(slug: string): Promise<StudyContentDto> {
  const subject = siteJson<SiteSubjectDto>(slug, "subject.json");
  if (!autoDecksFn) {
    ({ autoDecks: autoDecksFn } = (await import("../../packages/contract/src/index.js")) as {
      autoDecks: (cfg: unknown, pages: unknown) => StudyDeckDto[];
    });
  }
  return { ...subject.study, decks: [...subject.study.decks, ...autoDecksFn(subject.config, subject.pages)] };
}

/** `ToolInfo` del contrato, con lo que leen las specs. */
export interface ToolInfoDto {
  manifest: {
    id: string;
    title: string;
    version: string;
    views: Array<{ id: string; label: string; layout: "wide" | "full" }>;
    figures: boolean;
    scripts: string[];
    styles: string[];
  };
  bytes: number;
  updatedAt: string;
  /** Base de los archivos del bundle, relativa al sitio y sin barra final. */
  base: string;
}

/** Los bundles que `site build` escribió para la materia. */
export function subjectTools(slug: string): ToolInfoDto[] {
  return siteJson<{ tools: ToolInfoDto[] }>(slug, "tools.json").tools;
}

// ---------------------------------------------------------------------------
// Landing
// ---------------------------------------------------------------------------

export interface LandingCard {
  slug: string;
  name: string;
  code: string;
  institution: string;
  semester: string;
  position: number;
  pagesCount: number;
  studiedCount: number;
  /** Tarjetas SRS vencidas de la materia: el «N para repasar». */
  dueCount: number;
  placeholder: boolean;
}

interface CatalogEntryDto {
  slug: string;
  name: string;
  code: string;
  institution: string;
  semester?: string;
  pagesCount: number;
}

function catalogEntries(): CatalogEntryDto[] {
  const file = path.join(SITE_SUBJECTS_DIR, "index.json");
  return (JSON.parse(readFileSync(file, "utf8")) as { subjects: CatalogEntryDto[] }).subjects;
}

const NO_SEMESTER = "Sin cuatrimestre";

/**
 * La landing tal como la calcula la web (`local/landing.ts`): las materias del
 * catálogo que el usuario no quitó, más las que inventó, cada una en el
 * cuatrimestre que le fijó `placements` o el que sugiere su config.
 *
 * Se deriva del documento (`snapshot()`) y del catálogo compilado en vez de
 * leerse del DOM porque las specs miran cifras que la tarjeta no siempre
 * escribe (`pagesCount`, `dueCount`, el cuatrimestre sin rotular).
 */
export async function landingCards(page: Page): Promise<LandingCard[]> {
  const doc = await snapshot(page);
  const now = new Date().toISOString();
  const hidden = new Set(doc.landing.hidden);
  const next = new Map<string, number>();

  const place = (slug: string, suggested: string): PlacementDto => {
    const saved = doc.landing.placements[slug];
    if (saved) {
      next.set(saved.semester, Math.max(next.get(saved.semester) ?? 0, saved.position + 1));
      return saved;
    }
    const position = next.get(suggested) ?? 0;
    next.set(suggested, position + 1);
    return { semester: suggested, position };
  };

  const stateOf = (slug: string): StudyStateDto => doc.subjects[slug] ?? emptySubjectState();
  const cards: LandingCard[] = [];

  for (const entry of catalogEntries()) {
    if (hidden.has(entry.slug)) continue;
    const at = place(entry.slug, entry.semester || NO_SEMESTER);
    const state = stateOf(entry.slug);
    cards.push({
      slug: entry.slug,
      name: entry.name,
      code: entry.code,
      institution: entry.institution,
      semester: at.semester,
      position: at.position,
      pagesCount: entry.pagesCount,
      studiedCount: Math.min(Object.keys(state.studied).length, entry.pagesCount),
      dueCount: state.srs.filter((card) => card.due <= now).length,
      placeholder: false,
    });
  }

  for (const holder of doc.landing.placeholders) {
    const at = place(holder.slug, NO_SEMESTER);
    const state = stateOf(holder.slug);
    cards.push({
      slug: holder.slug,
      name: holder.name,
      code: holder.code,
      institution: holder.institution,
      semester: at.semester,
      position: at.position,
      pagesCount: 0,
      studiedCount: 0,
      dueCount: state.srs.filter((card) => card.due <= now).length,
      placeholder: true,
    });
  }

  return cards.sort((a, b) => b.semester.localeCompare(a.semester) || a.position - b.position);
}

/**
 * Deja la landing como la describe la siembra: todas las materias del catálogo
 * en el cuatrimestre de su config, más la materia placeholder «Materia Demo B».
 *
 * Sin API, la landing inicial de un navegador nuevo es el catálogo entero: la
 * placeholder es lo único que hay que crear, y se crea con `restore()`.
 */
export async function resetLanding(page: Page): Promise<void> {
  const seed = readSeed();
  await patch(page, (doc) => ({ ...doc, landing: structuredClone(seed.landing) }));
}

/**
 * Repone la lista de cuatrimestres declarados (los vacíos y su orden, N0-32) sin
 * tocar dónde está cada materia.
 */
export async function resetSemesters(page: Page): Promise<void> {
  const seed = readSeed();
  await patch(page, (doc) => ({
    ...doc,
    landing: { ...doc.landing, semesters: [...seed.landing.semesters] },
  }));
}

// ---------------------------------------------------------------------------
// Estado de una materia
// ---------------------------------------------------------------------------

/** Desmarca todas las páginas estudiadas de una materia. */
export async function resetProgress(page: Page, slug: string): Promise<void> {
  await patch(page, (doc) => ({
    ...doc,
    subjects: { ...doc.subjects, [slug]: { ...(doc.subjects[slug] ?? emptySubjectState()), studied: {} } },
  }));
}

/**
 * Deja el estudio de una materia en cero: sin repasos, sin favoritos, sin
 * apuntes, sin tareas hechas, sin intentos y sin fechas del plan. Las páginas
 * marcadas como estudiadas NO se tocan: de eso se ocupa `resetProgress`.
 */
export async function resetStudy(page: Page, slug: string): Promise<void> {
  await patch(page, (doc) => ({
    ...doc,
    subjects: {
      ...doc.subjects,
      [slug]: { ...emptySubjectState(), studied: doc.subjects[slug]?.studied ?? {} },
    },
  }));
}

/** El estado personal de una materia, tal como lo guarda el navegador. */
export async function studyState(page: Page, slug: string): Promise<StudyStateDto> {
  const doc = await snapshot(page);
  const state = doc.subjects[slug] ?? emptySubjectState();
  return {
    ...state,
    srs: [...state.srs].sort((a, b) => a.due.localeCompare(b.due) || a.cardId.localeCompare(b.cardId)),
  };
}

/**
 * Atrasa el vencimiento de TODAS las tarjetas SRS de una materia y devuelve
 * cuántas tocó.
 *
 * No es comodidad: calificar corre el SM-2 del contrato, que SIEMPRE deja la
 * próxima revisión en el futuro —con «Otra vez», diez minutos—, así que por la
 * interfaz no hay forma de dejar una tarjeta vencida. El `dueCount` de la
 * landing cuenta `due <= ahora`, de modo que sin esto la única prueba posible
 * sería esperar diez minutos. Lo que se prueba sigue siendo del producto: el
 * conteo lo calcula la web y la tarjeta la dibuja la landing.
 *
 * Quien llame tiene que RECARGAR para ver el efecto si la pantalla ya estaba
 * montada.
 */
export async function expireSrsCards(page: Page, slug: string, at?: Date): Promise<number> {
  const due = (at ?? new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString();
  const doc = await snapshot(page);
  const state = doc.subjects[slug] ?? emptySubjectState();
  await restore(page, {
    ...doc,
    subjects: { ...doc.subjects, [slug]: { ...state, srs: state.srs.map((card) => ({ ...card, due })) } },
  });
  return state.srs.length;
}

// ---------------------------------------------------------------------------
// Tema y shell
// ---------------------------------------------------------------------------

/** Fija el tema del perfil con el gancho (es global, N0-8). */
export async function setUserTheme(
  page: Page,
  theme: "pergamino" | "laurel" | "claustro",
): Promise<void> {
  await withHook(page);
  await page.evaluate((t) => window.__sinapsis!.setTheme(t), theme);
}

/** Tema pintado en `<html data-theme>`. */
export async function currentTheme(page: Page): Promise<string | null> {
  return page.locator("html").getAttribute("data-theme");
}

/** Espera a que el shell de la materia esté dibujado (no el armazón de carga). */
export async function waitForSubjectShell(page: Page): Promise<void> {
  await page.locator('nav[aria-label="Secciones de la materia"]').waitFor();
}
