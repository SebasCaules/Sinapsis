import { randomBytes, randomUUID } from "node:crypto";

/** Identificador de fila (usuarios, materias, páginas). */
export function newId(): string {
  return randomUUID();
}

/** Identificador de sesión: 32 bytes aleatorios en base64url. */
export function newSessionId(): string {
  return randomBytes(32).toString("base64url");
}

/** Instante actual en ISO-8601 (UTC). */
export function nowIso(): string {
  return new Date().toISOString();
}
