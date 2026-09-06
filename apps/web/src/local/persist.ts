/**
 * Persistencia del estado personal: dos copias, una regla y un rebote.
 *
 *  · IndexedDB (`LOCAL_DB_NAME` / `LOCAL_DB_STORE`, clave `"backup"`) es la
 *    copia principal: aguanta documentos grandes y sobrevive mejor a un
 *    borrado de caché.
 *  · `localStorage["sinapsis.backup"]` es el espejo: se escribe de forma
 *    síncrona, así que es la que llega entera cuando la pestaña se cierra en
 *    medio de una escritura.
 *
 * Al arrancar se leen las dos y gana la de `savedAt` más reciente; la que
 * falta —o la que quedó vieja— se repone desde la otra. Durante la sesión, cada
 * cambio se guarda en memoria de inmediato y baja al almacén con un rebote
 * corto (`SAVE_DEBOUNCE`), más un vaciado forzado en `pagehide` y cuando la
 * pestaña se oculta.
 *
 * `navigator.storage.persist()` se pide en la PRIMERA mutación del usuario, no
 * al cargar: pedir almacenamiento persistente antes de que haya algo que
 * perder es lo que hace que el navegador muestre un permiso sin motivo.
 */
import { emptyBackup, type LocalBackup } from "@sinapsis/contract/site";
import { BACKUP_KEY, deleteDatabase, openKeyStore, type KeyStore } from "./db";
import { getState, hydrate, parseBackup, subscribe } from "./state";

/** Clave del espejo en `localStorage`. */
export const MIRROR_KEY = "sinapsis.backup";

/** Prefijo de TODO lo que la plataforma guarda en `localStorage`. */
export const LOCAL_PREFIX = "sinapsis.";

/** Rebote de la escritura, en milisegundos (el brief pide ≤ 300). */
export const SAVE_DEBOUNCE = 250;

let store: KeyStore | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let unsubscribe: (() => void) | null = null;
let listening = false;
let askedForPersistence = false;

function keyStore(): KeyStore {
  return (store ??= openKeyStore());
}

// ---------------------------------------------------------------------------
// Espejo en localStorage
// ---------------------------------------------------------------------------

export function readMirror(): LocalBackup | null {
  try {
    const raw = localStorage.getItem(MIRROR_KEY);
    return raw ? parseBackup(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeMirror(doc: LocalBackup): void {
  try {
    localStorage.setItem(MIRROR_KEY, JSON.stringify(doc));
  } catch {
    /* cuota llena o modo privado: queda IndexedDB */
  }
}

// ---------------------------------------------------------------------------
// Regla de `savedAt`
// ---------------------------------------------------------------------------

/**
 * Cuál de las dos copias gana: la de `savedAt` más reciente. Ante empate (o
 * ante una fecha ilegible) gana la primera, que es la de IndexedDB.
 */
export function pickNewer(a: LocalBackup | null, b: LocalBackup | null): LocalBackup | null {
  if (!a) return b;
  if (!b) return a;
  const ta = Date.parse(a.savedAt);
  const tb = Date.parse(b.savedAt);
  if (Number.isNaN(ta)) return Number.isNaN(tb) ? a : b;
  if (Number.isNaN(tb)) return a;
  return tb > ta ? b : a;
}

// ---------------------------------------------------------------------------
// Carga y guardado
// ---------------------------------------------------------------------------

export interface PersistOptions {
  /** Almacén a usar; por defecto IndexedDB (o memoria si no está). */
  store?: KeyStore;
  /** false para no instalar los oyentes de `pagehide`/`visibilitychange`. */
  listen?: boolean;
}

/**
 * Lee las dos copias, deja ganar a la más reciente, repone la que falte y queda
 * escuchando los cambios. Es lo que `main.tsx` espera antes de renderizar.
 */
export async function loadLocalState(options: PersistOptions = {}): Promise<LocalBackup> {
  if (options.store) store = options.store;
  const s = keyStore();

  const fromDb = parseBackup(await s.get<unknown>(BACKUP_KEY));
  const fromMirror = readMirror();
  const chosen = pickNewer(fromDb, fromMirror);

  hydrate(chosen ?? emptyBackup());

  /* Sin ninguna copia no hay nada que reponer: un navegador nuevo no debe
     estrenar el almacén hasta que el usuario cambie algo. */
  if (chosen) {
    if (!fromDb || fromDb.savedAt !== chosen.savedAt) void s.put(BACKUP_KEY, chosen);
    if (!fromMirror || fromMirror.savedAt !== chosen.savedAt) writeMirror(chosen);
  }

  startPersistence(options);
  return getState();
}

/** Se suscribe a los cambios del documento y programa su bajada al almacén. */
export function startPersistence(options: PersistOptions = {}): void {
  if (!unsubscribe) unsubscribe = subscribe(() => schedule());
  if (options.listen === false || listening || typeof document === "undefined") return;
  listening = true;
  window.addEventListener("pagehide", onLeave);
  document.addEventListener("visibilitychange", onHidden);
}

export function stopPersistence(): void {
  unsubscribe?.();
  unsubscribe = null;
  if (timer !== null) clearTimeout(timer);
  timer = null;
  if (!listening || typeof document === "undefined") return;
  listening = false;
  window.removeEventListener("pagehide", onLeave);
  document.removeEventListener("visibilitychange", onHidden);
}

function onLeave(): void {
  void flush();
}

function onHidden(): void {
  if (document.visibilityState === "hidden") void flush();
}

function schedule(): void {
  requestPersistentStorage();
  if (timer !== null) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void flush();
  }, SAVE_DEBOUNCE);
}

/**
 * Baja el documento vigente a las dos copias YA. El espejo va primero y de
 * forma síncrona: si la pestaña se cierra en este instante, esa es la que queda.
 */
export async function flush(): Promise<void> {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  const doc = getState();
  writeMirror(doc);
  await keyStore().put(BACKUP_KEY, doc);
}

/**
 * Pide almacenamiento persistente una sola vez, en la primera mutación. Nunca
 * lanza ni espera: si el navegador dice que no, todo sigue funcionando.
 */
export function requestPersistentStorage(): void {
  if (askedForPersistence) return;
  askedForPersistence = true;
  try {
    void navigator.storage?.persist?.()?.catch?.(() => undefined);
  } catch {
    /* sin `navigator.storage`: nada que pedir */
  }
}

/**
 * Borra TODO lo local: las dos copias del documento y cualquier otra clave
 * `sinapsis.*` (tema, pestañas abiertas, actividad). No toca el documento en
 * memoria: eso lo hace quien llama (`backup.ts`).
 */
export async function clearPersisted(): Promise<void> {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LOCAL_PREFIX)) keys.push(key);
    }
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    /* sin localStorage no hay espejo que borrar */
  }
  const s = keyStore();
  await s.del(BACKUP_KEY);
  /* Sin cerrar, `deleteDatabase` queda bloqueado por esta misma conexión y las
     aperturas siguientes se encolan detrás: la próxima escritura no volvería. */
  s.close();
  await deleteDatabase();
  store = null;
}

/** Solo para las pruebas: olvida el almacén y los oyentes. */
export function resetPersistForTests(): void {
  stopPersistence();
  store = null;
  askedForPersistence = false;
}
