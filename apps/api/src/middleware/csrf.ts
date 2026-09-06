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
 *
 * El guard no toca el cuerpo: solo mira encabezados. El JSON roto lo atrapa
 * `app.onError` (`app.ts`), donde ya se decide el formato de todos los errores.
 */
import { createMiddleware } from "hono/factory";
import type { AppBindings } from "../types.js";
import { httpError } from "../lib/errors.js";
import { allowedOrigins } from "../env.js";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const JSON_TYPE = "application/json";

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
      allowedOrigins(c.var.env).has(origin);
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

  await next();
});
