/**
 * Sync idempotente de una materia (contrato §4).
 *
 * Reemplaza el conjunto entero de páginas: las que ya no vienen se borran. El
 * progreso del usuario se guarda por slug y en su propia tabla, así que
 * sobrevive a los borrados (si la página vuelve, la marca sigue ahí).
 */
import { createHash } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { DIVISION_NONE, type Page, type SubjectConfig, type SyncResult } from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import { withTransaction } from "../db/client.js";
import { pages, subjects, type SubjectRow } from "../db/schema.js";
import { newId, nowIso } from "../lib/ids.js";
import { badRequest } from "../lib/errors.js";
import { clearSubjectFts, indexPage } from "./search.js";

/** Tope de warnings devueltos; el resto se resume en una línea final. */
const MAX_WARNINGS = 120;

/** Huella del contenido de una página: distingue "modificada" de "igual". */
export function pageFingerprint(page: Page): string {
  const canonical = JSON.stringify([
    page.slug,
    page.title,
    page.type,
    page.folder,
    page.division,
    page.order ?? null,
    page.summary,
    page.format ?? null,
    page.tags,
    page.sources,
    page.updatedAt ?? null,
    page.links,
    page.headings,
    page.body,
    page.words,
  ]);
  return createHash("sha1").update(canonical).digest("hex");
}

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
    if (!types.has(page.type)) {
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

    let created = 0;
    let updated = 0;

    for (const page of incoming) {
      const hash = pageFingerprint(page);
      const values = {
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
        contentHash: hash,
      };
      const existing = currentBySlug.get(page.slug);
      if (!existing) {
        await db.insert(pages).values({ id: newId(), subjectId: subject.id, ...values });
        created += 1;
      } else if (existing.contentHash !== hash) {
        await db.update(pages).set(values).where(eq(pages.id, existing.id));
        updated += 1;
      }
    }

    const staleIds = current.filter((row) => !seen.has(row.slug)).map((row) => row.id);
    for (let i = 0; i < staleIds.length; i += 200) {
      await db.delete(pages).where(inArray(pages.id, staleIds.slice(i, i + 200)));
    }

    // Reconstrucción del índice FTS de esta materia.
    await clearSubjectFts(db, subject.id);
    for (const page of incoming) {
      await indexPage(db, subject.id, {
        slug: page.slug,
        title: page.title,
        body: page.body,
        summary: page.summary,
      });
    }

    return {
      subject: subject.slug,
      pages: incoming.length,
      created,
      updated,
      deleted: staleIds.length,
      warnings,
    } satisfies SyncResult;
  });
}

/** El payload ya validado por zod (subconjunto que usa el servicio). */
export interface SyncPayloadLike {
  config: SubjectConfig;
  pages: Page[];
}
