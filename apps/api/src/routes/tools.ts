/**
 * Herramientas de una materia (Sprint 3 · N0-41 y N0-42).
 *
 * Cuatro rutas y dos autenticaciones distintas:
 *
 *  - `PUT|DELETE /api/subjects/:slug/tools/:id` — las publica el CLI de la
 *    materia con `Authorization: Bearer <SYNC_TOKEN>`, igual que el sync.
 *  - `GET /api/subjects/:slug/tools` y `GET .../tools/:id/files/*` — las lee la
 *    web con la sesión del navegador.
 *
 * La materia tiene que existir (haber pasado por un sync o haberse creado desde
 * la landing): un bundle es de una materia, no la crea.
 *
 * Los archivos se sirven con el `Content-Type` de su extensión, `nosniff`, y
 * revalidación por `ETag` (`Cache-Control: private, max-age=0,
 * must-revalidate`): un push nuevo se ve en la recarga siguiente sin tener que
 * cachebustear las URLs, y un bundle que no cambió cuesta un 304.
 */
import { and, asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import type { Context } from "hono";
import { API_PREFIX, ToolManifest, ToolPush, type ToolInfo } from "@sinapsis/contract";
import { requireSession } from "../auth/middleware.js";
import { requireSyncToken } from "../auth/sync-token.js";
import { subjectTools } from "../db/schema.js";
import { badRequest, notFound } from "../lib/errors.js";
import { nowIso } from "../lib/ids.js";
import { jsonBody } from "../lib/validate.js";
import { loadSubject } from "../middleware/subject.js";
import {
  bundleDir,
  contentTypeFor,
  decodeToolFiles,
  etagOf,
  missingManifestFiles,
  readBundleFile,
  removeBundle,
  rowToToolInfo,
  toolBase,
  writeBundle,
} from "../services/tools.js";
import type { AppBindings } from "../types.js";

/** Revalidación en cada carga: el bundle cambia con cada push del CLI. */
const CACHE_CONTROL = "private, max-age=0, must-revalidate";

/**
 * Segmentos que preceden a la ruta del archivo en
 * `<API_PREFIX>/subjects/:slug/tools/:id/files/<path>`. Se cuenta en vez de
 * recortar por texto para que un slug o un id llamados «files» no partan la
 * URL por el lugar equivocado.
 */
const FILE_PATH_INDEX = API_PREFIX.split("/").filter((s) => s.length > 0).length + 6;

/** Id de herramienta de la URL, con el mismo formato que exige el manifiesto. */
function toolIdParam(c: Context<AppBindings>): string {
  const parsed = ToolManifest.shape.id.safeParse(c.req.param("id") ?? "");
  if (!parsed.success) throw notFound("La herramienta no existe");
  return parsed.data;
}

/**
 * Ruta pedida dentro del bundle, ya decodificada. Se arma segmento a segmento
 * (y no con la URL entera) para que un `%2F` incrustado no pueda inventar
 * separadores que la validación posterior no vea.
 */
function requestedFilePath(c: Context<AppBindings>): string {
  const segments = new URL(c.req.url).pathname.split("/").slice(FILE_PATH_INDEX);
  if (segments.length === 0) return "";
  try {
    return segments.map((segment) => decodeURIComponent(segment)).join("/");
  } catch {
    return "";
  }
}

/** ¿El `If-None-Match` del pedido incluye este ETag? */
function matchesEtag(header: string | undefined, etag: string): boolean {
  if (!header) return false;
  return header
    .split(",")
    .map((value) => value.trim().replace(/^W\//, ""))
    .some((value) => value === etag || value === "*");
}

export function toolRoutes(): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  // -------------------------------------------------------------------------
  // Publicación (CLI de la materia)
  // -------------------------------------------------------------------------

  /**
   * Reemplaza el bundle entero. El manifiesto tiene que declarar el mismo id
   * que la URL y no puede citar archivos que no vengan en el push: un bundle a
   * medias rompería la vista en el navegador, no acá.
   */
  app.put(
    "/subjects/:slug/tools/:id",
    requireSyncToken,
    loadSubject,
    jsonBody(ToolPush, "Bundle inválido"),
    async (c) => {
      const db = c.var.db;
      const env = c.var.env;
      const subject = c.var.subject;
      const toolId = toolIdParam(c);
      const { manifest, files } = c.req.valid("json");

      if (manifest.id !== toolId) {
        throw badRequest(
          `El id del manifiesto ("${manifest.id}") no coincide con el de la URL ("${toolId}")`,
        );
      }

      const decoded = decodeToolFiles(files, bundleDir(env, subject.id, toolId));
      const present = new Set(decoded.map((file) => file.path));
      const missing = missingManifestFiles(manifest, present);
      if (missing.length > 0) {
        throw badRequest(
          `El manifiesto declara archivos que no vienen en el bundle: ${missing.join(", ")}`,
        );
      }

      const bytes = decoded.reduce((total, file) => total + file.data.byteLength, 0);
      const existing = (
        await db
          .select({ toolId: subjectTools.toolId })
          .from(subjectTools)
          .where(and(eq(subjectTools.subjectId, subject.id), eq(subjectTools.toolId, toolId)))
          .limit(1)
      )[0];

      // Primero el disco (el swap es atómico) y después el índice: si la
      // escritura falla, la fila sigue describiendo el bundle que se sirve.
      writeBundle(env, subject.id, toolId, decoded);

      const updatedAt = nowIso();
      await db
        .insert(subjectTools)
        .values({ subjectId: subject.id, toolId, manifestJson: manifest, bytes, updatedAt })
        .onConflictDoUpdate({
          target: [subjectTools.subjectId, subjectTools.toolId],
          set: { manifestJson: manifest, bytes, updatedAt },
        });

      const info: ToolInfo = { manifest, bytes, updatedAt, base: toolBase(subject.slug, toolId) };
      return c.json(info, existing ? 200 : 201);
    },
  );

  /** Quita el bundle: fila y carpeta. Idempotente (204 aunque no existiera). */
  app.delete("/subjects/:slug/tools/:id", requireSyncToken, loadSubject, async (c) => {
    const toolId = toolIdParam(c);
    await c.var.db
      .delete(subjectTools)
      .where(and(eq(subjectTools.subjectId, c.var.subject.id), eq(subjectTools.toolId, toolId)));
    removeBundle(c.var.env, c.var.subject.id, toolId);
    return c.body(null, 204);
  });

  // -------------------------------------------------------------------------
  // Lectura (navegador)
  // -------------------------------------------------------------------------

  /**
   * Bundles de la materia. `base` viene sin barra final: la web compone
   * `${base}/${path}` con cada `path` del manifiesto.
   */
  app.get("/subjects/:slug/tools", requireSession, loadSubject, async (c) => {
    const rows = await c.var.db
      .select()
      .from(subjectTools)
      .where(eq(subjectTools.subjectId, c.var.subject.id))
      .orderBy(asc(subjectTools.toolId));
    return c.json(rows.map((row) => rowToToolInfo(row, c.var.subject.slug)) satisfies ToolInfo[]);
  });

  /** Un archivo del bundle. Nunca sale de su carpeta: ver `services/tools.ts`. */
  app.get("/subjects/:slug/tools/:id/files/*", requireSession, loadSubject, (c) => {
    const toolId = toolIdParam(c);
    const relative = requestedFilePath(c);
    const data = readBundleFile(c.var.env, c.var.subject.id, toolId, relative);
    if (data === null) throw notFound("El archivo no existe");

    const etag = etagOf(data);
    const headers: Record<string, string> = {
      "cache-control": CACHE_CONTROL,
      etag,
      "x-content-type-options": "nosniff",
    };
    if (matchesEtag(c.req.header("if-none-match"), etag)) return c.body(null, 304, headers);

    return c.body(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer, 200, {
      ...headers,
      "content-type": contentTypeFor(relative),
      "content-length": String(data.byteLength),
    });
  });

  return app;
}
