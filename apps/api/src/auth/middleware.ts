import { createMiddleware } from "hono/factory";
import type { AppBindings } from "../types.js";
import { unauthorized } from "../lib/errors.js";
import { readSessionCookie, resolveUser } from "./session.js";

/** Exige una sesión válida y deja el usuario en `c.var.user`. */
export const requireSession = createMiddleware<AppBindings>(async (c, next) => {
  const sessionId = await readSessionCookie(c, c.var.env);
  if (!sessionId) throw unauthorized();
  const user = await resolveUser(c.var.db, sessionId);
  if (!user) throw unauthorized();
  c.set("user", user);
  c.set("sessionId", sessionId);
  await next();
});
