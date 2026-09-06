/**
 * Documento del estado personal en memoria (`LocalBackup`) y sus mutaciones.
 *
 * Es la única copia viva: el cliente local lee y escribe acá, y `persist.ts`
 * se suscribe para bajarlo a IndexedDB (y a su espejo) con un rebote corto.
 * Todo lo que cambia el documento pasa por `update()`, que sella `savedAt`:
 * esa fecha es la que decide, al arrancar, cuál de las dos copias gana.
 *
 * Las funciones exportadas que reciben un documento y devuelven otro son PURAS
 * (no tocan el estado vivo ni el argumento): así se prueban sin montar nada y
 * se pueden encadenar dentro de un solo `update`.
 */
import {
  LocalBackup,
  type LocalLanding,
  type LocalProfile,
  type LocalSubjectState,
  emptyBackup,
  emptySubjectState,
} from "@sinapsis/contract/site";

type Listener = (doc: LocalBackup) => void;

let doc: LocalBackup = emptyBackup();
const listeners = new Set<Listener>();

/** Documento vigente. No se debe mutar: use `update()`. */
export function getState(): LocalBackup {
  return doc;
}

/**
 * Instala un documento SIN sellar `savedAt` ni avisar a los suscriptores: es la
 * carga inicial, que no es un cambio del usuario y no debe volver a escribirse.
 */
export function hydrate(next: LocalBackup): void {
  doc = next;
}

/** Se entera de cada cambio. Devuelve la baja. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Aplica una mutación pura, sella `savedAt` y avisa. Devuelve el documento nuevo. */
export function update(fn: (current: LocalBackup) => LocalBackup, now = new Date().toISOString()): LocalBackup {
  doc = { ...fn(doc), savedAt: now };
  for (const listener of [...listeners]) listener(doc);
  return doc;
}

/** Reemplaza el documento entero (restaurar una copia, borrar todo). */
export function replace(next: LocalBackup, now = new Date().toISOString()): LocalBackup {
  return update(() => next, now);
}

/** Solo para las pruebas: deja el módulo como recién cargado. */
export function resetStateForTests(next: LocalBackup = emptyBackup()): void {
  doc = next;
  listeners.clear();
}

// ---------------------------------------------------------------------------
// Mutaciones puras
// ---------------------------------------------------------------------------

export function withProfile(current: LocalBackup, patch: Partial<LocalProfile>): LocalBackup {
  return { ...current, profile: { ...current.profile, ...patch } };
}

export function withLanding(current: LocalBackup, patch: Partial<LocalLanding>): LocalBackup {
  return { ...current, landing: { ...current.landing, ...patch } };
}

/** Estado de una materia; el vacío si nunca se tocó (no lo guarda). */
export function subjectStateOf(current: LocalBackup, slug: string): LocalSubjectState {
  return current.subjects[slug] ?? emptySubjectState();
}

/** Reescribe el estado de UNA materia dejando el resto intacto. */
export function withSubject(
  current: LocalBackup,
  slug: string,
  fn: (state: LocalSubjectState) => LocalSubjectState,
): LocalBackup {
  return { ...current, subjects: { ...current.subjects, [slug]: fn(subjectStateOf(current, slug)) } };
}

/** Olvida el estado de una materia (lo usa el borrado de un placeholder, si se pide). */
export function withoutSubject(current: LocalBackup, slug: string): LocalBackup {
  if (!(slug in current.subjects)) return current;
  const { [slug]: _gone, ...rest } = current.subjects;
  return { ...current, subjects: rest };
}

/**
 * Valida un documento cualquiera (leído del almacén o de un archivo) contra el
 * contrato. Devuelve null si no es un `LocalBackup`: quien lo llame decide si
 * eso es «no hay copia» o «el archivo no sirve».
 */
export function parseBackup(value: unknown): LocalBackup | null {
  const parsed = LocalBackup.safeParse(value);
  return parsed.success ? parsed.data : null;
}
