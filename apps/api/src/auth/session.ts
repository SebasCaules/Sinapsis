/**
 * Sesiones: fila en `sessions` + cookie httpOnly firmada con SESSION_SECRET.
 */
import { eq, lt } from "drizzle-orm";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import type { Context } from "hono";
import type { Db } from "../db/client.js";
import { sessions, users, type UserRow } from "../db/schema.js";
import { isProduction, type AppEnv } from "../env.js";
import { newSessionId, nowIso } from "../lib/ids.js";

export const SESSION_COOKIE = "sinapsis_sid";
/** 30 días. */
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export async function createSession(db: Db, userId: string): Promise<{ id: string; expiresAt: string }> {
  const id = newSessionId();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await db.insert(sessions).values({ id, userId, expiresAt, createdAt: nowIso() });
  return { id, expiresAt };
}

export async function setSessionCookie(c: Context, env: AppEnv, sessionId: string): Promise<void> {
  await setSignedCookie(c, SESSION_COOKIE, sessionId, env.SESSION_SECRET, {
    httpOnly: true,
    sameSite: "Lax",
    secure: isProduction(env),
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(c: Context, env: AppEnv): void {
  deleteCookie(c, SESSION_COOKIE, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: isProduction(env),
  });
}

export async function readSessionCookie(c: Context, env: AppEnv): Promise<string | null> {
  const value = await getSignedCookie(c, env.SESSION_SECRET, SESSION_COOKIE);
  // getSignedCookie devuelve false cuando la firma no valida.
  return typeof value === "string" && value.length > 0 ? value : null;
}

/** Devuelve el usuario de la sesión vigente, o null. Borra las vencidas. */
export async function resolveUser(db: Db, sessionId: string): Promise<UserRow | null> {
  const rows = await db
    .select({ user: users, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, sessionId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (new Date(row.expiresAt).getTime() <= Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }
  return row.user;
}

export async function destroySession(db: Db, sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

/** Limpieza oportunista de sesiones vencidas. */
export async function purgeExpiredSessions(db: Db): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, nowIso()));
}
