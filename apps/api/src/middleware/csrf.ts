/**
 * Mitigación CSRF mínima para un API de un solo origen (N0-17):
 *
 *  - Si el request declara `content-type`, tiene que ser `application/json`.
 *    Un formulario HTML de otro sitio solo puede enviar form-urlencoded,
 *    multipart o text/plain, así que este chequeo alcanza para frenarlo; los
 *    métodos sin cuerpo (logout, DELETE, POST /api/auth/dev) no declaran
 *    content-type y pasan.
 *  - Si el request trae `Origin`, su host debe coincidir con el del request (o con
 *    `x-forwarded-host`), o el origen debe estar en ALLOWED_ORIGINS.
 */
import { createMiddleware } from "hono/factory";
import type { AppBindings } from "../types.js";
import { httpError } from "../lib/errors.js";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const JSON_TYPE = "application/json";

/**
 * Orígenes admitidos además del propio host: los declarados en ALLOWED_ORIGINS
 * (separados por coma) y, fuera de producción, el dev server de Vite (:5173) y
 * el de las pruebas E2E (:5174), que llegan a través del proxy con otro Host.
 */
function allowedOrigins(): Set<string> {
  const set = new Set<string>();
  for (const o of (process.env.ALLOWED_ORIGINS ?? "").split(",")) {
    const v = o.trim();
    if (v) set.add(v);
  }
  if (process.env.NODE_ENV !== "production") {
    for (const p of ["5173", "5174"]) {
      set.add(`http://localhost:${p}`);
      set.add(`http://127.0.0.1:${p}`);
    }
  }
  return set;
}

export const csrfGuard = createMiddleware<AppBindings>(async (c, next) => {
  if (!MUTATING.has(c.req.method)) {
    await next();
    return;
  }

  const origin = c.req.header("origin");
  if (origin && origin !== "null") {
    const host = c.req.header("host");
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    const forwardedHost = c.req.header("x-forwarded-host");
    const ok =
      (!!host && originHost === host) ||
      (!!forwardedHost && originHost === forwardedHost) ||
      allowedOrigins().has(origin);
    if (!ok) {
      throw httpError(403, "Origen no permitido");
    }
  }

  const declared = c.req.header("content-type");
  const contentType = declared ? (declared.split(";")[0] ?? "").trim().toLowerCase() : null;

  const length = c.req.header("content-length");
  const declaresBody =
    (length !== undefined && length !== "0") || c.req.header("transfer-encoding") !== undefined;

  if (contentType !== null && contentType !== JSON_TYPE) {
    throw httpError(415, "El cuerpo debe enviarse como application/json");
  }
  if (declaresBody && contentType === null) {
    throw httpError(415, "Falta el encabezado content-type: application/json");
  }

  if (contentType === JSON_TYPE && (declaresBody || c.req.raw.body !== null)) {
    // Se parsea acá (queda cacheado para el validador zod de cada ruta) para
    // que un JSON roto devuelva `{ error }` como el resto del API.
    try {
      await c.req.json();
    } catch {
      throw httpError(400, "El cuerpo no es JSON válido");
    }
  }

  await next();
});
