import { zValidator } from "@hono/zod-validator";
import type { ZodError, ZodType } from "zod";

/** Mensaje legible (en español) a partir de los issues de zod. */
export function zodMessage(error: ZodError): string {
  return error.issues
    .slice(0, 8)
    .map((issue) => `${issue.path.join(".") || "(raíz)"}: ${issue.message}`)
    .join("; ");
}

/**
 * Validador del cuerpo JSON de una ruta. Único lugar donde se decide el formato
 * del 400: `{ error: "<prefijo> — <campo>: <motivo>; …" }`. El JSON directamente
 * roto no llega acá: lo mapea `app.onError`.
 */
export function jsonBody<T extends ZodType>(schema: T, prefix: string) {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return c.json({ error: `${prefix} — ${zodMessage(result.error)}` }, 400);
    }
    return undefined;
  });
}
