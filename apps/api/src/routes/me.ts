import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { ThemeId } from "@sinapsis/contract";
import { requireSession } from "../auth/middleware.js";
import { toUserDto } from "../auth/users.js";
import { users } from "../db/schema.js";
import { nowIso } from "../lib/ids.js";
import { zodMessage } from "../lib/validate.js";
import type { AppBindings } from "../types.js";

const PatchMeBody = z.object({ theme: ThemeId });

export function meRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/me", requireSession);

  app.get("/me", (c) => c.json(toUserDto(c.var.user)));

  app.patch(
    "/me",
    zValidator("json", PatchMeBody, (result, c) => {
      if (!result.success) {
        return c.json({ error: `Tema inválido — ${zodMessage(result.error)}` }, 400);
      }
      return undefined;
    }),
    async (c) => {
      const { theme } = c.req.valid("json");
      const updated = await c.var.db
        .update(users)
        .set({ theme, updatedAt: nowIso() })
        .where(eq(users.id, c.var.user.id))
        .returning();
      const row = updated[0] ?? c.var.user;
      return c.json(toUserDto(row));
    },
  );

  return app;
}
