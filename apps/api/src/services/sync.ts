/**
 * Sync idempotente de una materia (contrato §4).
 *
 * Reemplaza el conjunto entero de páginas: las que ya no vienen se borran. El
 * progreso del usuario se guarda por slug y en su propia tabla, así que
 * sobrevive a los borrados (si la página vuelve, la marca sigue ahí).
 *
 * Un sync que no cambia nada no escribe nada: ni `pages` ni el índice FTS. Y
 * cuando sí hay cambios, solo se reindexan las páginas creadas, modificadas o
 * borradas — no las 200 de la materia.
 */
import { createHash } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import {
  DIVISION_NONE,
  PAGE_TYPE_META,
  type Page,
  type SubjectConfig,
  type SyncResult,
} from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import { withTransaction } from "../db/client.js";
import { pages, subjects, type SubjectRow } from "../db/schema.js";
import { newId, nowIso } from "../lib/ids.js";
import { badRequest } from "../lib/errors.js";
import { chunks, indexPages, removeFromFts, type IndexablePage } from "./search.js";

/** Tope de warnings devueltos; el resto se resume en una línea final. */
const MAX_WARNINGS = 120;

/** Filas por sentencia en los `INSERT` masivos. */
const INSERT_BATCH = 100;

/** Filas por sentencia en los `DELETE ... IN (…)`. */
const DELETE_BATCH = 200;

function collectWarnings(config: SubjectConfig, list: Page[]): string[] {
  const divisions = new Set(config.divisions.map((d) => d.key));
  const types = new Set(config.pageTypes.map((t) => t.key));
  const warnings: string[] = [];
  let extra = 0;
  const push = (message: string) => {
    if (warnings.length < MAX_WARNINGS) warnings.push(message);
    else extra += 1;
  };
  for (const page of list) {
    if (page.division !== DIVISION_NONE && !divisions.has(page.division)) {
      push(`página "${page.slug}": la división "${page.division}" no está declarada en el config`);
    }
    // "meta" es el tipo reservado de las páginas índice/registro: nunca se declara en pageTypes.
    if (page.type !== PAGE_TYPE_META && !types.has(page.type)) {
      push(`página "${page.slug}": el tipo "${page.type}" no está declarado en pageTypes`);
    }
  }
  if (extra > 0) warnings.push(`…y ${extra} advertencia(s) más`);
  return warnings;
}

async function upsertSubject(db: Db, config: SubjectConfig, now: string): Promise<SubjectRow> {
  const existing = (await db.select().from(subjects).where(eq(subjects.slug, config.slug)).limit(1))[0];
  const values = {
    name: config.name,
    code: config.code,
    institution: config.institution,
    color: config.color ?? null,
    semesterHint: config.semester ?? null,
    divisionJson: config.division,
    configJson: config,
    placeholder: false,
    lastSyncAt: now,
    updatedAt: now,
  };
  if (existing) {
    const updated = await db.update(subjects).set(values).where(eq(subjects.id, existing.id)).returning();
    const row = updated[0];
    if (!row) throw new Error("No se pudo actualizar la materia");
    return row;
  }
  const inserted = await db
    .insert(subjects)
    .values({ id: newId(), slug: config.slug, createdAt: now, ...values })
    .returning();
  const row = inserted[0];
  if (!row) throw new Error("No se pudo crear la materia");
  return row;
}

/** Columnas de `pages` que se escriben por página (sin id ni subjectId). */
function pageValues(page: Page) {
  return {
    slug: page.slug,
    title: page.title,
    type: page.type,
    folder: page.folder,
    division: page.division,
    order: page.order ?? null,
    summary: page.summary,
    format: page.format ?? null,
    tagsJson: page.tags,
    sourcesJson: page.sources,
    updatedAtSrc: page.updatedAt ?? null,
    linksJson: page.links,
    headingsJson: page.headings,
    body: page.body,
    words: page.words,
  };
}

/**
 * Huella del contenido de una página: distingue "modificada" de "igual". Se
 * calcula sobre lo mismo que se guarda (`pageValues`), así no hay una segunda
 * lista de campos que se pueda desincronizar de la tabla.
 */
export function pageHash(values: ReturnType<typeof pageValues>): string {
  return createHash("sha1").update(JSON.stringify(values)).digest("hex");
}

export async function syncSubject(db: Db, slug: string, payload: SyncPayloadLike): Promise<SyncResult> {
  const { config, pages: incoming } = payload;

  if (config.slug !== slug) {
    throw badRequest(
      `El slug de la URL ("${slug}") no coincide con el del config ("${config.slug}")`,
    );
  }

  const seen = new Set<string>();
  for (const page of incoming) {
    if (seen.has(page.slug)) {
      throw badRequest(`La página "${page.slug}" viene repetida en el payload`);
    }
    seen.add(page.slug);
  }

  const warnings = collectWarnings(config, incoming);

  return withTransaction(db, async () => {
    const now = nowIso();
    const subject = await upsertSubject(db, config, now);

    const current = await db
      .select({ id: pages.id, slug: pages.slug, contentHash: pages.contentHash })
      .from(pages)
      .where(eq(pages.subjectId, subject.id));
    const currentBySlug = new Map(current.map((row) => [row.slug, row]));

    /** Altas y modificaciones: son las que hay que volver a indexar. */
    const reindex: IndexablePage[] = [];
    const inserts: Array<
      { id: string; subjectId: string; contentHash: string } & ReturnType<typeof pageValues>
    > = [];
    let updated = 0;

    for (const page of incoming) {
      const values = pageValues(page);
      const hash = pageHash(values);
      const existing = currentBySlug.get(page.slug);
      if (!existing) {
        inserts.push({ id: newId(), subjectId: subject.id, ...values, contentHash: hash });
      } else if (existing.contentHash !== hash) {
        await db.update(pages).set({ ...values, contentHash: hash }).where(eq(pages.id, existing.id));
        updated += 1;
      } else {
        continue;
      }
      reindex.push({ slug: page.slug, title: page.title, body: page.body, summary: page.summary });
    }

    for (const batch of chunks(inserts, INSERT_BATCH)) {
      await db.insert(pages).values(batch);
    }

    const stale = current.filter((row) => !seen.has(row.slug));
    for (const batch of chunks(stale, DELETE_BATCH)) {
      await db.delete(pages).where(inArray(pages.id, batch.map((row) => row.id)));
    }

    const created = inserts.length;
    const deleted = stale.length;

    // Índice FTS: nada que hacer si el sync no movió una sola página.
    if (created + updated + deleted > 0) {
      const touched = [...reindex.map((p) => p.slug), ...stale.map((row) => row.slug)];
      await removeFromFts(db, subject.id, touched);
      await indexPages(db, subject.id, reindex);
    }

    return {
      subject: subject.slug,
      pages: incoming.length,
      created,
      updated,
      deleted,
      warnings,
    } satisfies SyncResult;
  });
}

/** El payload ya validado por zod (subconjunto que usa el servicio). */
export interface SyncPayloadLike {
  config: SubjectConfig;
  pages: Page[];
}
