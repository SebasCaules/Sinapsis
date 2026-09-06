import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { LandingLayoutInput } from "@sinapsis/contract";
import { requireSession } from "../auth/middleware.js";
import { withTransaction } from "../db/client.js";
import { subjects, userSubjects } from "../db/schema.js";
import { jsonBody } from "../lib/validate.js";
import { landingCards } from "../services/landing.js";
import type { AppBindings } from "../types.js";

export function landingRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/landing", requireSession);

  app.get("/landing", async (c) => c.json(await landingCards(c.var.db, c.var.user.id)));

  app.put(
    "/landing",
    jsonBody(LandingLayoutInput, "Disposición inválida"),
    async (c) => {
      const db = c.var.db;
      const userId = c.var.user.id;
      const { items } = c.req.valid("json");

      // Un solo SELECT para todos los slugs; después, un UPDATE por materia.
      // Los slugs que no existen o que no están en la landing del usuario se
      // ignoran en silencio: la disposición es del usuario, no un alta.
      const slugs = [...new Set(items.map((item) => item.slug))];
      const known =
        slugs.length === 0
          ? []
          : await db
              .select({ id: subjects.id, slug: subjects.slug })
              .from(subjects)
              .where(inArray(subjects.slug, slugs));
      const idBySlug = new Map(known.map((row) => [row.slug, row.id]));

      await withTransaction(db, async () => {
        for (const item of items) {
          const subjectId = idBySlug.get(item.slug);
          if (subjectId === undefined) continue;
          await db
            .update(userSubjects)
            .set({ semester: item.semester, position: item.position })
            .where(and(eq(userSubjects.userId, userId), eq(userSubjects.subjectId, subjectId)));
        }
      });

      return c.json(await landingCards(db, userId));
    },
  );

  return app;
}
