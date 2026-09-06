/**
 * La partida de quiz en curso, por materia y por quiz, en el navegador.
 *
 * El baseline guarda la partida en una variable de módulo (`quizSession`), así
 * que salir a otra vista y volver la reanuda y solo una recarga la pierde. Acá
 * se guarda en `localStorage` —una recarga tampoco la pierde— porque el
 * componente se desmonta con cada navegación y una variable de módulo se iría
 * igual con el primer refresco.
 *
 * Se guardan los IDS de las preguntas, nunca su contenido: si el wiki cambió el
 * quiz en el medio, la partida vieja se descarta sola al no poder rehidratar.
 * El estado de estudio que SÍ es del usuario (intentos, SRS) vive en el API;
 * esto es una comodidad local, como la actividad de `activity.ts`.
 *
 *   shuffle(list)                 mezcla pura (Fisher-Yates), no toca el original
 *   readRun(slug, quizId)         la partida guardada, o null
 *   saveRun(slug, run)            guarda / pisa la partida de ese quiz
 *   clearRun(slug, quizId)        la borra (resultado a la vista, o «Repetir»)
 */

/** Clave por materia. Se promueve a `LS_KEYS` del contrato cuando haya un segundo uso. */
const keyOf = (slug: string): string => `sinapsis.${slug}.quizRun`;

/** Una partida sin tocar por más de esto ya no se reanuda: es otra sesión de estudio. */
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Cuántos quizzes distintos se recuerdan a la vez. */
const MAX_RUNS = 5;

export interface SavedRun {
  quizId: string;
  /** Los ids de las preguntas EN EL ORDEN de la partida (ya mezclado y recortado). */
  ids: string[];
  /** Índice de la pregunta actual. */
  at: number;
  /** id de pregunta → índice de la opción elegida. */
  picks: Record<string, number>;
  /** Repesca de las falladas: no registra intento. */
  retry: boolean;
  /**
   * Longitud pedida en la URL (`?n=`), o null si la tanda es el quiz entero.
   * Se guarda para NO reanudar una partida de otra longitud: pedir «5» tiene
   * que empezar una tanda de cinco aunque haya una partida completa a medias.
   */
  n: number | null;
  /** Instante del último guardado (ISO). */
  savedAt: string;
}

/**
 * Mezcla pura (Fisher-Yates). Devuelve una copia: la lista de preguntas del
 * modelo se comparte con otras vistas y no se puede reordenar en el lugar.
 *
 * `rng` existe para las pruebas; en la aplicación siempre es `Math.random`.
 */
export function shuffle<T>(list: readonly T[], rng: () => number = Math.random): T[] {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const a = out[i] as T;
    const b = out[j] as T;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

type Bag = Record<string, SavedRun>;

function readBag(slug: string): Bag {
  try {
    const raw = localStorage.getItem(keyOf(slug));
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Bag;
  } catch {
    return {};
  }
}

function writeBag(slug: string, bag: Bag): void {
  try {
    localStorage.setItem(keyOf(slug), JSON.stringify(bag));
  } catch {
    /* sin almacenamiento: la partida vive solo mientras la vista esté montada */
  }
}

function valid(run: unknown): run is SavedRun {
  if (!run || typeof run !== "object") return false;
  const r = run as Partial<SavedRun>;
  return (
    typeof r.quizId === "string" &&
    Array.isArray(r.ids) &&
    r.ids.every((id) => typeof id === "string") &&
    typeof r.at === "number" &&
    !!r.picks &&
    typeof r.picks === "object" &&
    typeof r.savedAt === "string"
  );
}

/** La partida guardada de ese quiz, si sigue siendo reanudable. */
export function readRun(slug: string, quizId: string, now = Date.now()): SavedRun | null {
  const run = readBag(slug)[quizId];
  if (!valid(run)) return null;
  const age = now - Date.parse(run.savedAt);
  if (!Number.isFinite(age) || age > MAX_AGE_MS || age < -MAX_AGE_MS) return null;
  if (!run.ids.length || run.at >= run.ids.length) return null;
  return { ...run, retry: run.retry === true, n: typeof run.n === "number" ? run.n : null };
}

export function saveRun(slug: string, run: Omit<SavedRun, "savedAt">): void {
  const bag = readBag(slug);
  const next: Bag = { ...bag, [run.quizId]: { ...run, savedAt: new Date().toISOString() } };
  /* Se recuerdan pocas partidas: las más viejas se caen solas. */
  const keys = Object.keys(next).sort(
    (a, b) => Date.parse(next[b]?.savedAt ?? "") - Date.parse(next[a]?.savedAt ?? ""),
  );
  const kept: Bag = {};
  for (const key of keys.slice(0, MAX_RUNS)) {
    const value = next[key];
    if (value) kept[key] = value;
  }
  writeBag(slug, kept);
}

export function clearRun(slug: string, quizId: string): void {
  const bag = readBag(slug);
  if (!(quizId in bag)) return;
  const next = { ...bag };
  delete next[quizId];
  writeBag(slug, next);
}
