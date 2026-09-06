import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

/** Error de aplicación con status y mensaje en español. */
export function httpError(status: ContentfulStatusCode, message: string): HTTPException {
  return new HTTPException(status, {
    res: Response.json({ error: message }, { status }),
  });
}

export const notFound = (message = "No encontrado") => httpError(404, message);
export const unauthorized = (message = "Sesión requerida") => httpError(401, message);
export const badRequest = (message: string) => httpError(400, message);
export const conflict = (message: string) => httpError(409, message);
