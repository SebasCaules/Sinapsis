/**
 * Cliente de base de datos: libSQL (SQLite local o Turso) + Drizzle.
 *
 * Una sola conexión por proceso. Las transacciones se manejan con
 * BEGIN/COMMIT explícitos sobre esa conexión (ver `withTransaction`) en vez de
 * `db.transaction()`: el driver de `@libsql/client` abre una conexión nueva por
 * transacción, lo que rompe las bases en memoria (`file::memory:`) que usan los
 * tests.
 */
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import * as schema from "./schema.js";

export type Db = LibSQLDatabase<typeof schema> & { $client: Client };

export interface CreateDbOptions {
  authToken?: string | null;
}

/** Crea la conexión y activa las claves foráneas. */
export function createDb(url: string, options: CreateDbOptions = {}): Db {
  const client = createClient({
    url,
    ...(options.authToken ? { authToken: options.authToken } : {}),
  });
  const db = drizzle(client, { schema }) as Db;
  // libSQL/SQLite arranca con foreign_keys apagado; sin esto los ON DELETE
  // CASCADE del esquema no se aplican.
  void client.execute("PRAGMA foreign_keys = ON");
  return db;
}

/** Cierra la conexión (los tests lo usan al terminar cada archivo). */
export function closeDb(db: Db): void {
  db.$client.close();
}

// ---------------------------------------------------------------------------
// Transacciones serializadas
// ---------------------------------------------------------------------------

const locks = new WeakMap<object, Promise<unknown>>();

/**
 * Ejecuta `fn` dentro de una transacción sobre la conexión compartida.
 * Las transacciones se serializan por conexión con una cola de promesas: SQLite
 * no admite transacciones anidadas ni concurrentes sobre la misma conexión.
 */
export async function withTransaction<T>(db: Db, fn: () => Promise<T>): Promise<T> {
  const previous = locks.get(db) ?? Promise.resolve();
  const run = previous.then(
    () => runTransaction(db, fn),
    () => runTransaction(db, fn),
  );
  locks.set(
    db,
    run.catch(() => undefined),
  );
  return run;
}

async function runTransaction<T>(db: Db, fn: () => Promise<T>): Promise<T> {
  await db.run(sql`BEGIN IMMEDIATE`);
  try {
    const result = await fn();
    await db.run(sql`COMMIT`);
    return result;
  } catch (error) {
    try {
      await db.run(sql`ROLLBACK`);
    } catch {
      // Si la transacción ya se deshizo sola, no hay nada que revertir.
    }
    throw error;
  }
}
