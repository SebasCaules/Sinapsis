/**
 * Resuelve el `:slug` de la URL a la materia y la deja en `c.var.subject`.
 *
 * Se monta junto a `requireSession` en todas las rutas `/subjects/:slug/...`,
 * así el 404 «La materia no existe» se decide en un solo lugar y los handlers
 * arrancan con la materia ya cargada.
 */
import { createMiddleware } from "hono/factory";
import { notFound } from "../lib/errors.js";
import { findSubjectBySlug } from "../services/subjects.js";
import type { AppBindings } from "../types.js";

export const loadSubject = createMiddleware<AppBindings>(async (c, next) => {
  const subject = await findSubjectBySlug(c.var.db, c.req.param("slug") ?? "");
  if (!subject) throw notFound("La materia no existe");
  c.set("subject", subject);
  await next();
});
