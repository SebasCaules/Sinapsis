/**
 * La landing, calculada en el navegador.
 *
 * Antes era una consulta contra `user_subjects`; ahora es la unión del catálogo
 * del sitio (`index.json`) con lo que el usuario guardó en su `LocalLanding`:
 * dónde puso cada materia (`placements`), qué cuatrimestres declaró
 * (`semesters`, incluidos los vacíos), qué materias del catálogo quitó de su
 * landing (`hidden`) y qué materias inventó a mano (`placeholders`).
 *
 * Las reglas son las que aplicaba `services/landing.ts`, portadas tal cual:
 *
 *  · el rótulo de cuatrimestre se guarda SIEMPRE en su forma canónica
 *    ("2026-1c" → "2026-1C"), que es el único criterio de igualdad (N0-32);
 *  · el orden es cuatrimestre descendente y posición ascendente, y a igualdad
 *    de las dos, el nombre;
 *  · los cuatrimestres son los declarados (en su orden) más los que alguna
 *    materia use y la lista no mencione.
 *
 * Todo lo de este módulo es puro: recibe el documento y el catálogo, devuelve
 * tarjetas o un documento nuevo. Quien lo baja al estado es `client.ts`.
 */
import {
  canonicalSemester,
  compareSemestersDesc,
  type CreateSubjectInput,
  type LandingLayoutInput,
  type SubjectCard,
  type SubjectConfigLoose,
} from "@sinapsis/contract";
import type {
  LocalBackup,
  LocalPlaceholder,
  LocalPlacement,
  SiteCatalog,
  SiteCatalogEntry,
} from "@sinapsis/contract/site";
import { ApiError } from "@/lib/apiError";
import { subjectStateOf, withLanding } from "./state";

/** Color de reserva cuando la materia no declara ninguno. */
export const DEFAULT_SUBJECT_COLOR = "--u1";

/** Cuatrimestre de las materias que no declaran ninguno. */
export const NO_SEMESTER = "Sin cuatrimestre";

/**
 * Rótulo de cuatrimestre tal como se guarda: la forma canónica del contrato.
 * Los rótulos libres (los que no tienen la forma "AAAA-NC") solo se recortan; si
 * al recortarlos no queda nada se conserva lo que escribió el usuario antes que
 * guardar una cadena vacía (N0-32).
 */
export function normalizeSemester(raw: string): string {
  return canonicalSemester(raw) || raw;
}

/** Cuatrimestre descendente ("2026-2C" antes que "2026-1C"), posición ascendente. */
export function compareCards(a: SubjectCard, b: SubjectCard): number {
  const bySemester = compareSemestersDesc(a.semester, b.semester);
  if (bySemester !== 0) return bySemester;
  if (a.position !== b.position) return a.position - b.position;
  return a.name.localeCompare(b.name, "es");
}

/** Config sintético de una materia placeholder (el `resolveConfig` del API). */
export function placeholderConfig(placeholder: LocalPlaceholder, semester?: string): SubjectConfigLoose {
  return {
    contract: 1,
    slug: placeholder.slug,
    name: placeholder.name,
    code: placeholder.code,
    institution: placeholder.institution,
    exercisePlates: true,
    ...(placeholder.color ? { color: placeholder.color } : {}),
    ...(semester ? { semester } : {}),
    division: placeholder.division,
    divisions: [],
    pageTypes: [],
    rail: [],
    fab: null,
    wiki: { root: "wiki", ignore: [], divisionField: "division", study: "estudio", standalone: [] },
  };
}

// ---------------------------------------------------------------------------
// Agregados del estado local
// ---------------------------------------------------------------------------

/**
 * Tarjetas SRS vencidas de una materia. A diferencia del API no se recortan al
 * material vigente: eso obligaría a bajar el `subject.json` de cada materia
 * para dibujar la landing. El recorte sigue estando donde se ve (§2.2:
 * `study.state`), que es de donde salen las sesiones de repaso.
 */
export function dueCountOf(doc: LocalBackup, slug: string, now: string): number {
  return subjectStateOf(doc, slug).srs.filter((card) => card.due <= now).length;
}

/** Páginas marcadas como estudiadas, sin pasarse del total de la materia. */
export function studiedCountOf(doc: LocalBackup, slug: string, pagesCount: number): number {
  const marked = Object.keys(subjectStateOf(doc, slug).studied).length;
  return pagesCount > 0 ? Math.min(marked, pagesCount) : marked;
}

// ---------------------------------------------------------------------------
// Tarjetas
// ---------------------------------------------------------------------------

interface Placed {
  semester: string;
  position: number;
}

/**
 * Ubica cada materia: lo que diga `placements` y, si no dice nada, el
 * cuatrimestre que sugiere el catálogo (o «Sin cuatrimestre») y la última
 * posición libre de esa fila.
 */
function placements(doc: LocalBackup, entries: ReadonlyArray<{ slug: string; semester?: string }>): Map<string, Placed> {
  const out = new Map<string, Placed>();
  const next = new Map<string, number>();

  for (const [slug, placement] of Object.entries(doc.landing.placements) as Array<[string, LocalPlacement]>) {
    const semester = normalizeSemester(placement.semester);
    next.set(semester, Math.max(next.get(semester) ?? 0, placement.position + 1));
    out.set(slug, { semester, position: placement.position });
  }

  for (const entry of entries) {
    if (out.has(entry.slug)) continue;
    const semester = normalizeSemester(entry.semester || NO_SEMESTER);
    const position = next.get(semester) ?? 0;
    next.set(semester, position + 1);
    out.set(entry.slug, { semester, position });
  }

  return out;
}

function catalogCard(entry: SiteCatalogEntry, doc: LocalBackup, at: Placed, now: string): SubjectCard {
  return {
    slug: entry.slug,
    name: entry.name,
    code: entry.code,
    institution: entry.institution,
    color: entry.color || DEFAULT_SUBJECT_COLOR,
    division: entry.division,
    divisionsCount: entry.divisionsCount,
    pagesCount: entry.pagesCount,
    studiedCount: studiedCountOf(doc, entry.slug, entry.pagesCount),
    semester: at.semester,
    position: at.position,
    placeholder: false,
    dueCount: dueCountOf(doc, entry.slug, now),
    lastSyncAt: entry.builtAt,
  };
}

function placeholderCard(placeholder: LocalPlaceholder, doc: LocalBackup, at: Placed, now: string): SubjectCard {
  return {
    slug: placeholder.slug,
    name: placeholder.name,
    code: placeholder.code,
    institution: placeholder.institution,
    color: placeholder.color || DEFAULT_SUBJECT_COLOR,
    division: placeholder.division,
    divisionsCount: 0,
    pagesCount: 0,
    studiedCount: 0,
    semester: at.semester,
    position: at.position,
    placeholder: true,
    dueCount: dueCountOf(doc, placeholder.slug, now),
    lastSyncAt: null,
  };
}

/** Materias del catálogo que el usuario NO quitó, en el orden del archivo. */
export function visibleEntries(doc: LocalBackup, catalog: SiteCatalog): SiteCatalogEntry[] {
  const hidden = new Set(doc.landing.hidden);
  return catalog.subjects.filter((entry) => !hidden.has(entry.slug));
}

/** La landing del usuario: catálogo visible + placeholders, ya ordenada. */
export function landingCards(doc: LocalBackup, catalog: SiteCatalog, now = new Date().toISOString()): SubjectCard[] {
  const entries = visibleEntries(doc, catalog);
  const placeholders = doc.landing.placeholders;
  const at = placements(doc, [...entries, ...placeholders.map((p) => ({ slug: p.slug, semester: undefined }))]);

  const cards: SubjectCard[] = [];
  for (const entry of entries) {
    const place = at.get(entry.slug);
    if (place) cards.push(catalogCard(entry, doc, place, now));
  }
  for (const placeholder of placeholders) {
    const place = at.get(placeholder.slug);
    if (place) cards.push(placeholderCard(placeholder, doc, place, now));
  }
  return cards.sort(compareCards);
}

/**
 * Materias del catálogo que están fuera de la landing: lo que ofrece el diálogo
 * «Agregar materia» antes del formulario de materia nueva.
 */
export function availableCards(doc: LocalBackup, catalog: SiteCatalog, now = new Date().toISOString()): SubjectCard[] {
  const hidden = new Set(doc.landing.hidden);
  return catalog.subjects
    .filter((entry) => hidden.has(entry.slug))
    .map((entry) =>
      catalogCard(entry, doc, { semester: normalizeSemester(entry.semester || NO_SEMESTER), position: 0 }, now),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

/**
 * Cuatrimestres de la landing: primero los que el usuario declaró y ordenó
 * (lo único que conserva los vacíos), después los que aparecen en sus materias
 * y todavía no estaban declarados, del más reciente al más antiguo.
 */
export function landingSemesters(doc: LocalBackup, cards: readonly SubjectCard[]): string[] {
  const out: string[] = [];
  const known = new Set<string>();
  for (const raw of doc.landing.semesters) {
    const label = normalizeSemester(raw);
    if (!label || known.has(label)) continue;
    known.add(label);
    out.push(label);
  }
  const extra = [...new Set(cards.map((card) => card.semester))]
    .filter((label) => label && !known.has(label))
    .sort(compareSemestersDesc);
  return [...out, ...extra];
}

// ---------------------------------------------------------------------------
// Mutaciones
// ---------------------------------------------------------------------------

/** ¿Qué es este slug para el usuario? */
export function classify(doc: LocalBackup, catalog: SiteCatalog, slug: string): "catalog" | "hidden" | "placeholder" | "unknown" {
  if (doc.landing.placeholders.some((p) => p.slug === slug)) return "placeholder";
  if (catalog.subjects.some((entry) => entry.slug === slug)) {
    return doc.landing.hidden.includes(slug) ? "hidden" : "catalog";
  }
  return "unknown";
}

/**
 * Guarda la disposición. Los slugs que el usuario no tiene se ignoran en
 * silencio (la disposición es una mudanza, no un alta), y `semesters` ausente
 * deja los cuatrimestres declarados como estaban.
 */
export function applyLayout(doc: LocalBackup, catalog: SiteCatalog, input: LandingLayoutInput): LocalBackup {
  const mine = new Set([
    ...visibleEntries(doc, catalog).map((entry) => entry.slug),
    ...doc.landing.placeholders.map((p) => p.slug),
  ]);

  const next: Record<string, LocalPlacement> = { ...doc.landing.placements };
  for (const item of input.items) {
    if (!mine.has(item.slug)) continue;
    next[item.slug] = { semester: normalizeSemester(item.semester), position: item.position };
  }

  const semesters = input.semesters
    ? [...new Set(input.semesters.map(normalizeSemester).filter(Boolean))]
    : doc.landing.semesters;

  return withLanding(doc, { placements: next, semesters });
}

/** Quita una materia de la landing: la del catálogo se oculta, el placeholder se borra. */
export function removeFromLanding(doc: LocalBackup, catalog: SiteCatalog, slug: string): LocalBackup {
  const kind = classify(doc, catalog, slug);
  const { [slug]: _gone, ...placements } = doc.landing.placements;

  if (kind === "catalog") {
    return withLanding(doc, { placements, hidden: [...doc.landing.hidden, slug] });
  }
  if (kind === "placeholder") {
    /* El progreso de la materia NO se borra: si vuelve, vuelve con lo estudiado. */
    return withLanding(doc, { placements, placeholders: doc.landing.placeholders.filter((p) => p.slug !== slug) });
  }
  return doc;
}

/** Siguiente posición libre de un cuatrimestre. */
export function nextPosition(doc: LocalBackup, catalog: SiteCatalog, semester: string, now: string): number {
  const label = normalizeSemester(semester);
  const used = landingCards(doc, catalog, now).filter((card) => card.semester === label);
  return used.reduce((max, card) => Math.max(max, card.position + 1), 0);
}

/**
 * «Agregar materia». Si el slug es una materia del catálogo que el usuario había
 * quitado, la devuelve a la landing en el cuatrimestre elegido; si no, crea una
 * materia placeholder. Una materia que YA está en la landing es un conflicto.
 */
export function createSubject(
  doc: LocalBackup,
  catalog: SiteCatalog,
  input: CreateSubjectInput,
  now = new Date().toISOString(),
): LocalBackup {
  const kind = classify(doc, catalog, input.slug);
  if (kind === "catalog" || kind === "placeholder") {
    throw new ApiError(409, `La materia "${input.slug}" ya está en tu landing`);
  }

  const semester = normalizeSemester(input.semester);
  const position = nextPosition(doc, catalog, semester, now);
  const placements = { ...doc.landing.placements, [input.slug]: { semester, position } };

  if (kind === "hidden") {
    return withLanding(doc, { placements, hidden: doc.landing.hidden.filter((s) => s !== input.slug) });
  }

  const placeholder: LocalPlaceholder = {
    slug: input.slug,
    name: input.name,
    code: input.code,
    institution: input.institution,
    ...(input.color ? { color: input.color } : {}),
    division: input.division,
    createdAt: now,
  };
  return withLanding(doc, { placements, placeholders: [...doc.landing.placeholders, placeholder] });
}

/** La tarjeta de una materia después de una mutación (para devolverla al llamador). */
export function cardOf(doc: LocalBackup, catalog: SiteCatalog, slug: string, now = new Date().toISOString()): SubjectCard | null {
  return landingCards(doc, catalog, now).find((card) => card.slug === slug) ?? null;
}
