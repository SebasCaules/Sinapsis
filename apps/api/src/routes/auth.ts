import { Hono } from "hono";
import { z } from "zod";
import { devBypassEnabled } from "../env.js";
import type { AppBindings, AppDeps } from "../types.js";
import { httpError, notFound, unauthorized } from "../lib/errors.js";
import { jsonBody } from "../lib/validate.js";
import { toUserDto, upsertDevUser, upsertGoogleUser } from "../auth/users.js";
import {
  clearSessionCookie,
  createSession,
  destroySession,
  purgeExpiredSessions,
  readSessionCookie,
  setSessionCookie,
} from "../auth/session.js";

const GoogleBody = z.object({ credential: z.string().min(1, "credential es obligatorio") });

export function authRoutes(deps: AppDeps): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.post(
    "/auth/google",
    jsonBody(GoogleBody, "Cuerpo inválido"),
    async (c) => {
      const env = c.var.env;
      const verifier = deps.googleVerifier;
      if (!verifier || !env.GOOGLE_CLIENT_ID) {
        throw httpError(503, "El inicio de sesión con Google no está configurado en este servidor");
      }
      const { credential } = c.req.valid("json");
      const identity = await verifier(credential);
      if (!identity) throw unauthorized("El token de Google no es válido");

      const user = await upsertGoogleUser(c.var.db, identity);
      const session = await createSession(c.var.db, user.id);
      await setSessionCookie(c, env, session.id);
      void purgeExpiredSessions(c.var.db).catch(() => undefined);
      return c.json(toUserDto(user));
    },
  );

  app.post("/auth/dev", async (c) => {
    const env = c.var.env;
    // Fuera de desarrollo la ruta no existe (N0-5).
    if (!devBypassEnabled(env)) throw notFound("Ruta no encontrada");
    const user = await upsertDevUser(c.var.db);
    const session = await createSession(c.var.db, user.id);
    await setSessionCookie(c, env, session.id);
    return c.json(toUserDto(user));
  });

  app.post("/auth/logout", async (c) => {
    const env = c.var.env;
    const sessionId = await readSessionCookie(c, env);
    if (sessionId) await destroySession(c.var.db, sessionId);
    clearSessionCookie(c, env);
    return c.body(null, 204);
  });

  return app;
}
