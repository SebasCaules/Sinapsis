import { defineConfig } from "drizzle-kit";

/**
 * Referencia para `pnpm db:generate`. Las migraciones que aplica el servidor
 * son los `.sql` versionados en `src/db/migrations` (incluida la tabla virtual
 * FTS5, que drizzle-kit no sabe generar).
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./data/sinapsis.db",
  },
});
