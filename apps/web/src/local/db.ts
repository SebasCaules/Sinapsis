/**
 * Almacén clave → valor del estado personal (Sprint 4 · §2.2 del brief).
 *
 * La plataforma ya no tiene servidor: todo lo del estudiante vive en su
 * navegador. El almacén principal es IndexedDB —sobrevive a un borrado de caché
 * mucho mejor que `localStorage` y admite documentos grandes—, pero el resto de
 * la capa local no habla con IndexedDB directamente: habla con `KeyStore`.
 *
 * Esa indirección existe por dos motivos:
 *
 *   1. las pruebas usan `memoryStore()` y no necesitan ninguna dependencia
 *      nueva (no hay `fake-indexeddb` en el repositorio);
 *   2. un navegador que niega IndexedDB (modo privado de algunos móviles, cuota
 *      llena) no puede tirar la aplicación: `openKeyStore()` cae a memoria y el
 *      espejo de `localStorage` sigue guardando el documento.
 *
 * Nada de este módulo valida el contenido: eso es de `persist.ts`, que lo pasa
 * por `LocalBackup`.
 */
import { LOCAL_DB_NAME, LOCAL_DB_STORE } from "@sinapsis/contract/site";

/** Clave única del documento de estado dentro del almacén. */
export const BACKUP_KEY = "backup" as const;

/** Lo mínimo que la capa local necesita de un almacén persistente. */
export interface KeyStore {
  get<T>(key: string): Promise<T | null>;
  put(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  /**
   * Cierra la conexión (si la hay). Hace falta ANTES de `deleteDatabase`: una
   * base con una conexión abierta no se borra —el pedido queda «bloqueado»— y
   * cualquier apertura posterior se encola detrás de ese borrado para siempre.
   */
  close(): void;
}

/** Almacén de mentira, en memoria: pruebas y navegadores sin IndexedDB. */
export function memoryStore(seed?: Readonly<Record<string, unknown>>): KeyStore {
  const map = new Map<string, unknown>(Object.entries(seed ?? {}));
  return {
    get: async <T,>(key: string) => (map.has(key) ? (map.get(key) as T) : null),
    put: async (key, value) => {
      map.set(key, value);
    },
    del: async (key) => {
      map.delete(key);
    },
    close: () => undefined,
  };
}

/** ¿Hay IndexedDB utilizable en este entorno? */
export function hasIndexedDb(): boolean {
  try {
    return typeof indexedDB !== "undefined" && indexedDB !== null;
  } catch {
    return false;
  }
}

/** Envuelve una petición de IndexedDB en una promesa. */
function wrap<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB rechazó la operación"));
  });
}

/**
 * Abre (y si hace falta crea) la base del estado personal.
 *
 * Sin `version` se abre la que haya. Si la base existe pero no tiene el almacén
 * (la creó otra versión, o quedó a medias), se vuelve a abrir con la versión
 * siguiente para que `onupgradeneeded` lo cree: si no, cada escritura fallaría
 * en silencio para siempre.
 */
export function openDatabase(name = LOCAL_DB_NAME, store = LOCAL_DB_STORE, version?: number): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = version === undefined ? indexedDB.open(name) : indexedDB.open(name, version);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(store)) request.result.createObjectStore(store);
    };
    request.onsuccess = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(store)) {
        const next = database.version + 1;
        database.close();
        if (version !== undefined) {
          reject(new Error("La base local no tiene el almacén del estado"));
          return;
        }
        resolve(openDatabase(name, store, next));
        return;
      }
      /* Otra pestaña (o «Borrar todo lo local») quiere borrar o migrar la base:
         se suelta la conexión para no bloquearla. La próxima operación reabre. */
      database.onversionchange = () => database.close();
      resolve(database);
    };
    request.onerror = () => reject(request.error ?? new Error("No se pudo abrir la base local"));
    /* Otra pestaña con una versión distinta bloquea la apertura: no se espera
       para siempre, se resuelve con lo que haya (el espejo alcanza). */
    request.onblocked = () => reject(new Error("La base local está bloqueada por otra pestaña"));
  });
}

/** Almacén sobre IndexedDB. La conexión se abre una sola vez y se reaprovecha. */
export function indexedDbStore(name = LOCAL_DB_NAME, store = LOCAL_DB_STORE): KeyStore {
  let connection: Promise<IDBDatabase> | null = null;
  const db = (): Promise<IDBDatabase> => {
    if (!connection) {
      connection = openDatabase(name, store).then((database) => {
        /* Si la conexión se cierra por un `versionchange`, se olvida la promesa
           para que la operación siguiente vuelva a abrir en vez de fallar con
           «connection is closing». */
        const previous = database.onversionchange;
        database.onversionchange = (event) => {
          connection = null;
          if (typeof previous === "function") previous.call(database, event);
        };
        return database;
      });
      connection.catch(() => {
        connection = null;
      });
    }
    return connection;
  };

  async function run<T>(mode: IDBTransactionMode, body: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const database = await db();
    const tx = database.transaction(store, mode);
    const result = await wrap(body(tx.objectStore(store)));
    if (mode === "readwrite") {
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onabort = () => reject(tx.error ?? new Error("La escritura local se canceló"));
        tx.onerror = () => reject(tx.error ?? new Error("La escritura local falló"));
      });
    }
    return result;
  }

  return {
    get: async <T,>(key: string) => {
      const value = await run<unknown>("readonly", (s) => s.get(key));
      return (value ?? null) as T | null;
    },
    put: async (key, value) => {
      await run("readwrite", (s) => s.put(value, key));
    },
    del: async (key) => {
      await run("readwrite", (s) => s.delete(key));
    },
    close: () => {
      const pending = connection;
      connection = null;
      void pending?.then((database) => database.close()).catch(() => undefined);
    },
  };
}

/**
 * El almacén que usa la aplicación: IndexedDB si el navegador lo permite, y si
 * no, memoria. Nunca lanza: quedarse sin almacén no puede impedir arrancar.
 */
export function openKeyStore(): KeyStore {
  if (!hasIndexedDb()) return memoryStore();
  const idb = indexedDbStore();
  return {
    get: async <T,>(key: string) => {
      try {
        return await idb.get<T>(key);
      } catch {
        return null;
      }
    },
    put: async (key, value) => {
      try {
        await idb.put(key, value);
      } catch {
        /* sin IndexedDB queda el espejo de localStorage */
      }
    },
    del: async (key) => {
      try {
        await idb.del(key);
      } catch {
        /* ídem */
      }
    },
    close: () => idb.close(),
  };
}

/** Borra la base entera (la usa «Borrar todo lo local»). */
export async function deleteDatabase(name = LOCAL_DB_NAME): Promise<void> {
  if (!hasIndexedDb()) return;
  await new Promise<void>((resolve) => {
    try {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    } catch {
      resolve();
    }
  });
}
