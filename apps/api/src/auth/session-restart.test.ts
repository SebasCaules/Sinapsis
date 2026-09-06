/**
 * S-13 — «reiniciar el API obliga a volver a iniciar sesión».
 *
 * Este archivo reproduce el reinicio del proceso lo más cerca que se puede
 * in-process: una instancia de `createApp` abre sesión, se cierra la conexión,
 * y una segunda instancia se arma sobre el MISMO archivo de base y el MISMO
 * `AppEnv` (que es lo que hace `index.ts` en cada arranque, porque
 * `SESSION_SECRET` sale de `.env` y `loadEnv` se niega a arrancar sin él).
 *
 * El resultado es que la cookie sigue valiendo: el API no pierde la sesión al
 * reiniciarse. Los tres sospechosos del fix quedan descartados acá mismo:
 *
 *  1. el secreto de firma no se genera por arranque (es obligatorio en el
 *     entorno; sin él el proceso ni levanta),
 *  2. `runMigrations` no aplica nada en el segundo arranque y no toca
 *     `sessions` (la fila sigue ahí y con su vencimiento original),
 *  3. la sesión se busca por el id que viaja firmado en la cookie, y la firma
 *     de la primera instancia la valida la segunda.
 *
 * El último caso documenta la única forma de perderla desde el API: cambiar
 * `SESSION_SECRET` entre arranques.
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { User } from "@sinapsis/contract";
import { createApp } from "../app.js";
import { closeDb, createDb, type Db } from "../db/client.js";
import { runMigrations } from "../db/migrate.js";
import { sessions } from "../db/schema.js";
import { EnvSchema, type AppEnv } from "../env.js";

describe("S-13 · la sesión sobrevive al reinicio del API", () => {
  let dir: string;
  let env: AppEnv;
  let cookie: string;
  let setCookie: string;
  let user: User;
  let db: Db;

  /** Arranca el proceso: conexión nueva + migraciones + app, como `index.ts`. */
  async function boot(over: Partial<AppEnv> = {}): Promise<{ db: Db; app: ReturnType<typeof createApp>; applied: string[] }> {
    const fresh = createDb(env.DATABASE_URL);
    const applied = await runMigrations(fresh);
    return { db: fresh, app: createApp({ db: fresh, env: { ...env, ...over }, log: false }), applied };
  }

  beforeAll(async () => {
    dir = mkdtempSync(join(tmpdir(), "sinapsis-s13-"));
    env = EnvSchema.parse({
      NODE_ENV: "test",
      PORT: 3000,
      DATABASE_URL: `file:${join(dir, "s13.db")}`,
      SESSION_SECRET: "secreto-de-pruebas-suficientemente-largo",
      SYNC_TOKEN: "token-de-sync-de-pruebas",
      AUTH_DEV_BYPASS: "1",
    });

    const first = await boot();
    expect(first.applied.length).toBeGreaterThan(0);

    const login = await first.app.request("/api/auth/dev", { method: "POST" });
    expect(login.status).toBe(200);
    user = (await login.json()) as User;

    const header = login.headers as Headers & { getSetCookie?: () => string[] };
    setCookie = header.getSetCookie?.()[0] ?? login.headers.get("set-cookie") ?? "";
    cookie = setCookie.split(";")[0] ?? "";
    expect((await first.app.request("/api/me", { headers: { cookie } })).status).toBe(200);

    // Fin del proceso viejo.
    closeDb(first.db);
    db = (await boot()).db;
  });

  afterAll(() => {
    closeDb(db);
    rmSync(dir, { recursive: true, force: true });
  });

  it("la cookie es persistente (Max-Age), no de sesión de navegador", () => {
    expect(setCookie).toContain("Max-Age=2592000");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Path=/");
  });

  it("el segundo arranque no aplica migraciones ni borra sesiones", async () => {
    const again = await boot();
    expect(again.applied).toEqual([]);
    const rows = await again.db.select().from(sessions);
    expect(rows).toHaveLength(1);
    expect(new Date(rows[0]?.expiresAt ?? 0).getTime()).toBeGreaterThan(Date.now());
    closeDb(again.db);
  });

  it("la misma cookie sigue valiendo en la instancia nueva", async () => {
    const { db: fresh, app } = await boot();
    const res = await app.request("/api/me", { headers: { cookie } });
    expect(res.status).toBe(200);
    expect((await res.json()) as User).toMatchObject({ id: user.id, email: user.email });
    closeDb(fresh);
  });

  it("solo la deja de valer si cambia SESSION_SECRET entre arranques", async () => {
    const { db: fresh, app } = await boot({ SESSION_SECRET: "otro-secreto-igual-de-largo-1234" });
    expect((await app.request("/api/me", { headers: { cookie } })).status).toBe(401);
    closeDb(fresh);
  });
});
