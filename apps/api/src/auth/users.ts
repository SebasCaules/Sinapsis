/**
 * Alta y actualización de usuarios (upsert por google_sub, si no por email).
 */
import { eq } from "drizzle-orm";
import type { User } from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import { users, type UserRow } from "../db/schema.js";
import { newId, nowIso } from "../lib/ids.js";
import type { GoogleIdentity } from "./google.js";

/** Proyecta una fila de `users` al DTO `User` del contrato. */
export function toUserDto(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    picture: row.picture,
    theme: row.theme,
  };
}

async function findByGoogleSub(db: Db, sub: string): Promise<UserRow | undefined> {
  const rows = await db.select().from(users).where(eq(users.googleSub, sub)).limit(1);
  return rows[0];
}

async function findByEmail(db: Db, email: string): Promise<UserRow | undefined> {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return rows[0];
}

export async function upsertGoogleUser(db: Db, identity: GoogleIdentity): Promise<UserRow> {
  const existing = (await findByGoogleSub(db, identity.sub)) ?? (await findByEmail(db, identity.email));
  const now = nowIso();
  if (existing) {
    const updated = await db
      .update(users)
      .set({
        email: identity.email,
        name: identity.name,
        picture: identity.picture,
        googleSub: identity.sub,
        updatedAt: now,
      })
      .where(eq(users.id, existing.id))
      .returning();
    return updated[0] ?? existing;
  }
  const inserted = await db
    .insert(users)
    .values({
      id: newId(),
      email: identity.email,
      name: identity.name,
      picture: identity.picture,
      googleSub: identity.sub,
      theme: "pergamino",
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  const row = inserted[0];
  if (!row) throw new Error("No se pudo crear el usuario");
  return row;
}

export const DEV_USER_EMAIL = "dev@sinapsis.local";
export const DEV_USER_NAME = "Usuario Dev";

/** Usuario del bypass de desarrollo (N0-5). */
export async function upsertDevUser(db: Db): Promise<UserRow> {
  const existing = await findByEmail(db, DEV_USER_EMAIL);
  const now = nowIso();
  if (existing) return existing;
  const inserted = await db
    .insert(users)
    .values({
      id: newId(),
      email: DEV_USER_EMAIL,
      name: DEV_USER_NAME,
      picture: null,
      googleSub: null,
      theme: "pergamino",
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  const row = inserted[0];
  if (!row) throw new Error("No se pudo crear el usuario de desarrollo");
  return row;
}
