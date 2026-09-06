import type { ZodError } from "zod";

/** Mensaje legible (en español) a partir de los issues de zod. */
export function zodMessage(error: ZodError): string {
  return error.issues
    .slice(0, 8)
    .map((issue) => `${issue.path.join(".") || "(raíz)"}: ${issue.message}`)
    .join("; ");
}
