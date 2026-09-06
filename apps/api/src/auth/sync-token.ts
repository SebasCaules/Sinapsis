/**
 * Autenticación del CLI: `Authorization: Bearer <SYNC_TOKEN>` (N0-7).
 *
 * Es la puerta de todo lo que publica una materia —el sync del wiki y el push
 * de bundles de herramientas—, así que vive en un solo lugar: si mañana el
 * token pasa a ser por materia, cambia acá y en ningún otro lado.
 */
import { createMiddleware } from "hono/factory";
import { secretEquals } from "../lib/compare.js";
import { unauthorized } from "../lib/errors.js";
import type { AppBindings } from "../types.js";

/** Extrae el token de un header `Authorization: Bearer <token>`. */
export function bearer(header: string | undefined): string | null {
  if (!header) return null;
  const match = header.trim().match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

/** Exige el token de sincronización; la comparación es en tiempo constante. */
export const requireSyncToken = createMiddleware<AppBindings>(async (c, next) => {
  const token = bearer(c.req.header("authorization"));
  if (!token || !secretEquals(token, c.var.env.SYNC_TOKEN)) {
    throw unauthorized("Token de sincronización inválido");
  }
  await next();
});
