import { Hono } from "hono";
import { requireSession } from "../auth/middleware.js";
import { loadSubject } from "../middleware/subject.js";
import { buildGraph } from "../services/graph.js";
import type { AppBindings } from "../types.js";

export function graphRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  app.use("/subjects/:slug/graph", requireSession, loadSubject);

  app.get("/subjects/:slug/graph", async (c) => c.json(await buildGraph(c.var.db, c.var.subject)));

  return app;
}
