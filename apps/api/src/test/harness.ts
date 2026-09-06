/**
 * Andamiaje de los tests: una base SQLite temporal por archivo de test y la
 * app in-process (`app.request`), sin puertos ni servidores.
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Hono } from "hono";
import { serializeSigned } from "hono/utils/cookie";
import type { User } from "@sinapsis/contract";
import { createApp } from "../app.js";
import { createSession, SESSION_COOKIE } from "../auth/session.js";
import { closeDb, createDb, type Db } from "../db/client.js";
import { runMigrations } from "../db/migrate.js";
import { users } from "../db/schema.js";
import { EnvSchema, type AppEnv } from "../env.js";
import { newId, nowIso } from "../lib/ids.js";
import type { AppBindings, AppDeps } from "../types.js";

/** Cliente HTTP de otro usuario: mismas firmas que el harness, otra cookie. */
export interface UserClient {
  id: string;
  email: string;
  request(path: string, init?: RequestInit): Promise<Response>;
  json(method: string, path: string, body?: unknown, headers?: Record<string, string>): Promise<Response>;
}

export interface Harness {
  app: Hono<AppBindings>;
  db: Db;
  env: AppEnv;
  /** Pedido crudo (adjunta las cookies capturadas). */
  request(path: string, init?: RequestInit): Promise<Response>;
  /** Pedido con cuerpo JSON y el content-type que exige el guard CSRF. */
  json(method: string, path: string, body?: unknown, headers?: Record<string, string>): Promise<Response>;
  /** Abre sesión con el bypass de desarrollo. */
  login(): Promise<User>;
  /**
   * Segundo usuario con sesión abierta: la fila se inserta directo en `users` y
   * la sesión con el mismo helper que usa el API, así el aislamiento entre
   * usuarios se puede probar sin un segundo bypass de desarrollo.
   */
  otherUser(options?: { email?: string; name?: string }): Promise<UserClient>;
  cookies: Map<string, string>;
  close(): void;
}

export interface HarnessOptions {
  env?: Partial<Record<keyof AppEnv, unknown>>;
  deps?: Partial<AppDeps>;
}

const BASE_ENV = {
  NODE_ENV: "test",
  PORT: 3000,
  DATABASE_URL: "file::memory:",
  SESSION_SECRET: "secreto-de-pruebas-suficientemente-largo",
  SYNC_TOKEN: "token-de-sync-de-pruebas",
  AUTH_DEV_BYPASS: "1",
} as const;

export async function createHarness(options: HarnessOptions = {}): Promise<Harness> {
  const dir = mkdtempSync(join(tmpdir(), "sinapsis-api-"));
  const file = join(dir, "test.db");
  const env = EnvSchema.parse({ ...BASE_ENV, ...options.env, DATABASE_URL: `file:${file}` });

  const db = createDb(env.DATABASE_URL);
  await runMigrations(db);

  const app = createApp({ db, env, log: false, ...options.deps });
  const cookies = new Map<string, string>();

  function readSetCookies(res: Response): string[] {
    const headers = res.headers as Headers & { getSetCookie?: () => string[] };
    if (typeof headers.getSetCookie === "function") return headers.getSetCookie();
    const single = res.headers.get("set-cookie");
    return single ? [single] : [];
  }

  function capture(res: Response): void {
    for (const line of readSetCookies(res)) {
      const pair = line.split(";")[0] ?? "";
      const eq = pair.indexOf("=");
      if (eq < 0) continue;
      const name = pair.slice(0, eq).trim();
      const value = pair.slice(eq + 1).trim();
      if (value.length === 0) cookies.delete(name);
      else cookies.set(name, value);
    }
  }

  async function request(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    if (cookies.size > 0 && !headers.has("cookie")) {
      headers.set(
        "cookie",
        [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
      );
    }
    const res = await app.request(path, { ...init, headers });
    capture(res);
    return res;
  }

  async function json(
    method: string,
    path: string,
    body?: unknown,
    headers: Record<string, string> = {},
  ): Promise<Response> {
    const init: RequestInit = { method, headers: { ...headers } };
    if (body !== undefined) {
      init.body = JSON.stringify(body);
      init.headers = { "content-type": "application/json", ...headers };
    }
    return request(path, init);
  }

  async function login(): Promise<User> {
    const res = await request("/api/auth/dev", { method: "POST" });
    if (res.status !== 200) throw new Error(`No se pudo abrir sesión de desarrollo (${res.status})`);
    return (await res.json()) as User;
  }

  async function otherUser(options: { email?: string; name?: string } = {}): Promise<UserClient> {
    const id = newId();
    const email = options.email ?? `otro-${id.slice(0, 8)}@sinapsis.local`;
    const now = nowIso();
    await db.insert(users).values({
      id,
      email,
      name: options.name ?? "Otra persona",
      picture: null,
      googleSub: null,
      theme: "pergamino",
      createdAt: now,
      updatedAt: now,
    });

    const session = await createSession(db, id);
    const setCookie = await serializeSigned(SESSION_COOKIE, session.id, env.SESSION_SECRET, {
      path: "/",
    });
    const cookie = setCookie.split(";")[0] ?? "";

    async function requestAs(path: string, init: RequestInit = {}): Promise<Response> {
      const headers = new Headers(init.headers);
      if (!headers.has("cookie")) headers.set("cookie", cookie);
      return app.request(path, { ...init, headers });
    }

    return {
      id,
      email,
      request: requestAs,
      json(method, path, body, extra = {}) {
        const init: RequestInit = { method, headers: { ...extra } };
        if (body !== undefined) {
          init.body = JSON.stringify(body);
          init.headers = { "content-type": "application/json", ...extra };
        }
        return requestAs(path, init);
      },
    };
  }

  return {
    app,
    db,
    env,
    request,
    json,
    login,
    otherUser,
    cookies,
    close() {
      closeDb(db);
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
