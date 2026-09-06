/**
 * Migraciones: aplica en orden los `.sql` de `src/db/migrations`, registrando
 * cada uno en la tabla `_migrations` para que volver a correrlo sea inocuo.
 *
 * Se usa desde el script `pnpm db:migrate` y desde los tests (`runMigrations`).
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import type { Db } from "./client.js";

const STATEMENT_BREAK = "--> statement-breakpoint";

/** Carpeta con los `.sql`, tanto corriendo desde `src` como desde `dist`. */
export function migrationsDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "migrations"),
    resolve(here, "../../src/db/migrations"),
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  throw new Error(`No se encontró la carpeta de migraciones (probé: ${candidates.join(", ")})`);
}

/**
 * Corta el archivo en sentencias. El corte se hace por línea (no por búsqueda
 * de texto) para que la marca mencionada dentro de un comentario no parta nada,
 * y los comentarios `--` se descartan antes de mandar el SQL al driver.
 */
function splitStatements(source: string): string[] {
  const statements: string[] = [];
  let current: string[] = [];

  const flush = () => {
    const text = current.join("\n").trim().replace(/;\s*$/, "").trim();
    if (text.length > 0) statements.push(text);
    current = [];
  };

  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === STATEMENT_BREAK) {
      flush();
      continue;
    }
    if (trimmed.startsWith("--")) continue;
    current.push(line);
  }
  flush();
  return statements;
}

/** Aplica las migraciones pendientes. Devuelve los nombres aplicados. */
export async function runMigrations(db: Db, dir = migrationsDir()): Promise<string[]> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
  )`);

  const done = new Set(
    (await db.all<{ name: string }>(sql`SELECT name FROM _migrations`)).map((r) => r.name),
  );

  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const applied: string[] = [];
  for (const file of files) {
    if (done.has(file)) continue;
    const statements = splitStatements(readFileSync(join(dir, file), "utf8"));
    for (const statement of statements) {
      await db.run(sql.raw(statement));
    }
    await db.run(
      sql`INSERT INTO _migrations (name, applied_at) VALUES (${file}, ${new Date().toISOString()})`,
    );
    applied.push(file);
  }
  return applied;
}

/** Entrada del script `pnpm db:migrate`. */
async function main(): Promise<void> {
  const { config } = await import("dotenv");
  config();
  const { loadEnv } = await import("../env.js");
  const { createDb, closeDb } = await import("./client.js");
  const { mkdirSync } = await import("node:fs");

  const env = loadEnv();
  // Para `file:./data/sinapsis.db` hay que asegurar que la carpeta exista.
  const filePath = env.DATABASE_URL.startsWith("file:")
    ? env.DATABASE_URL.slice("file:".length)
    : null;
  if (filePath && !filePath.startsWith(":")) {
    mkdirSync(dirname(resolve(process.cwd(), filePath)), { recursive: true });
  }

  const db = createDb(env.DATABASE_URL, { authToken: env.DATABASE_AUTH_TOKEN });
  const applied = await runMigrations(db);
  closeDb(db);
  if (applied.length === 0) {
    console.log("Migraciones: nada pendiente.");
  } else {
    console.log(`Migraciones aplicadas: ${applied.join(", ")}`);
  }
}

const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === `file://${resolve(process.argv[1])}`;

if (invokedDirectly) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
