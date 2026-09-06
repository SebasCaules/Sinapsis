/**
 * Arranque del servidor: carga `.env`, prepara la base (migraciones incluidas),
 * arma la app y la sirve en PORT.
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { serve } from "@hono/node-server";
import { config as loadDotenv } from "dotenv";
import { createApp } from "./app.js";
import { closeDb, createDb } from "./db/client.js";
import { runMigrations } from "./db/migrate.js";
import { loadEnv } from "./env.js";

loadDotenv();

/** Crea la carpeta del archivo SQLite si hace falta. */
function ensureDatabaseDir(databaseUrl: string): void {
  if (!databaseUrl.startsWith("file:")) return;
  const filePath = databaseUrl.slice("file:".length);
  if (filePath.startsWith(":")) return; // file::memory:
  mkdirSync(dirname(resolve(process.cwd(), filePath)), { recursive: true });
}

async function main(): Promise<void> {
  const env = loadEnv();
  ensureDatabaseDir(env.DATABASE_URL);

  const db = createDb(env.DATABASE_URL, { authToken: env.DATABASE_AUTH_TOKEN });
  const applied = await runMigrations(db);
  if (applied.length > 0) console.log(`Migraciones aplicadas: ${applied.join(", ")}`);

  const app = createApp({ db, env });

  const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    console.log(`Sinapsis API escuchando en http://localhost:${info.port} (${env.NODE_ENV})`);
    if (env.WEB_DIST) console.log(`SPA servida desde ${resolve(process.cwd(), env.WEB_DIST)}`);
  });

  const shutdown = () => {
    server.close(() => {
      closeDb(db);
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
