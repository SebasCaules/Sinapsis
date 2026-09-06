/**
 * Sync idempotente de una materia (contrato §4).
 *
 * Reemplaza el conjunto entero de páginas: las que ya no vienen se borran. El
 * progreso del usuario se guarda por slug y en su propia tabla, así que
 * sobrevive a los borrados (si la página vuelve, la marca sigue ahí).
 *
 * Un sync que no cambia nada no escribe nada: ni `pages`, ni `page_links`, ni
 * el índice FTS (que desde el Sprint 2 mantienen los triggers de la migración
 * `0002_study.sql` sobre `pages`, no este servicio).
 */
import { createHash } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import {
  DIVISION_NONE,
  PAGE_TYPE_META,
  type Page,
  type StudyContent,
  type SubjectConfig,
  type SyncResult,
} from "@sinapsis/contract";
import type { Db } from "../db/client.js";
import { withTransaction } from "../db/client.js";
import { pageLinks, pages, subjects, subjectStudy, type SubjectRow } from "../db/schema.js";
import { chunks } from "../lib/chunks.js";
import { newId, nowIso } from "../lib/ids.js";
import { badRequest } from "../lib/errors.js";

/** Tope de warnings devueltos; el resto se resume en una línea final. */
const MAX_WARNINGS = 120;

/** Filas por sentencia en los `INSERT` masivos. */
const INSERT_BATCH = 100;

/** Filas por sentencia en los `DELETE ... IN (…)` y en el alta de `page_links`. */
const DELETE_BATCH = 200;

/** Acumulador de warnings con tope: el resto se resume en una sola línea. */
function warningSink() {
  const list: string[] = [];
  let extra = 0;
  return {
    push(message: string): void {
      if (list.length < MAX_WARNINGS) list.push(message);
      else extra += 1;
    },
    drain(): string[] {
      if (extra > 0) list.push(`…y ${extra} advertencia(s) más`);
      return list;
    },
  };
}

type Sink = ReturnType<typeof warningSink>;

function pageWarnings(config: SubjectConfig, list: Page[], sink: Sink): void {
  const divisions = new Set(config.divisions.map((d) => d.key));
  const types = new Set(config.pageTypes.map((t) => t.key));
  for (const page of list) {
    if (page.division !== DIVISION_NONE && !divisions.has(page.division)) {
      sink.push(`página "${page.slug}": la división "${page.division}" no está declarada en el config`);
    }
    // "meta" es el tipo reservado de las páginas índice/registro: nunca se declara en pageTypes.
    if (page.type !== PAGE_TYPE_META && !types.has(page.type)) {
      sink.push(`página "${page.slug}": el tipo "${page.type}" no está declarado en pageTypes`);
    }
  }
}

/**
 * Referencias rotas del material de estudio: tarjetas y preguntas que citan una
 * página inexistente, kits que arman su combo con ids que no existen y tareas
 * del plan cuyo destino no se puede resolver.
 */
function studyWarnings(
  config: SubjectConfig,
  study: StudyContent,
  pageSlugs: ReadonlySet<string>,
  sink: Sink,
): void {
  const deckIds = new Set(study.decks.map((d) => d.id));
  const quizIds = new Set(study.quizzes.map((q) => q.id));
  const divisions = new Set([...config.divisions.map((d) => d.key), DIVISION_NONE]);

  for (const deck of study.decks) {
    for (const card of deck.cards) {
      if (card.page !== undefined && !pageSlugs.has(card.page)) {
        sink.push(`mazo "${deck.id}": la tarjeta "${card.id}" cita la página "${card.page}", que no existe`);
      }
    }
  }
  for (const quiz of study.quizzes) {
    for (const question of quiz.questions) {
      if (question.page !== undefined && !pageSlugs.has(question.page)) {
        sink.push(
          `quiz "${quiz.id}": la pregunta "${question.id}" cita la página "${question.page}", que no existe`,
        );
      }
    }
  }
  for (const kit of study.kits) {
    for (const slug of kit.pages) {
      if (!pageSlugs.has(slug)) sink.push(`kit "${kit.id}": la página "${slug}" no existe`);
    }
    for (const id of kit.decks) {
      if (!deckIds.has(id)) sink.push(`kit "${kit.id}": el mazo "${id}" no existe`);
    }
    for (const id of kit.quizzes) {
      if (!quizIds.has(id)) sink.push(`kit "${kit.id}": el quiz "${id}" no existe`);
    }
  }
  for (const phase of study.plan?.phases ?? []) {
    for (const milestone of phase.milestones) {
      for (const task of milestone.tasks) {
        const target = task.target ?? "";
        if (target.length === 0) continue;
        if (task.kind === "read" && !divisions.has(target)) {
          sink.push(`plan · tarea "${task.id}": la división "${target}" no está declarada en el config`);
        } else if (task.kind === "cards" && !deckIds.has(target)) {
          sink.push(`plan · tarea "${task.id}": el mazo "${target}" no existe`);
        } else if (task.kind === "quiz" && !quizIds.has(target)) {
          sink.push(`plan · tarea "${task.id}": el quiz "${target}" no existe`);
        }
      }
    }
  }
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

/**
 * Aristas del grafo de la materia (S-07): un wikilink por par distinto, y solo
 * cuando el destino es una página de la misma materia. Los enlaces rotos
 * (destino inexistente) y los que apuntan a la propia página no entran: la
 * tabla es a la vez el índice de backlinks y el grafo de conexiones.
 */
export function resolveLinks(list: readonly Page[], slugs: ReadonlySet<string>): Array<{ fromSlug: string; toSlug: string }> {
  const out: Array<{ fromSlug: string; toSlug: string }> = [];
  for (const page of list) {
    const seen = new Set<string>();
    for (const link of page.links) {
      if (link.slug === page.slug || seen.has(link.slug) || !slugs.has(link.slug)) continue;
      seen.add(link.slug);
      out.push({ fromSlug: page.slug, toSlug: link.slug });
    }
  }
  return out;
}

export async function syncSubject(db: Db, slug: string, payload: SyncPayloadLike): Promise<SyncResult> {
  const { config, pages: incoming, study } = payload;

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

  const sink = warningSink();
  pageWarnings(config, incoming, sink);
  if (study) studyWarnings(config, study, seen, sink);
  const warnings = sink.drain();

  return withTransaction(db, async () => {
    const now = nowIso();
    const subject = await upsertSubject(db, config, now);

    const current = await db
      .select({ id: pages.id, slug: pages.slug, contentHash: pages.contentHash })
      .from(pages)
      .where(eq(pages.subjectId, subject.id));
    const currentBySlug = new Map(current.map((row) => [row.slug, row]));

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
      }
    }

    // Los triggers `pages_ai/au/ad` mantienen `pages_fts` con cada una de estas
    // escrituras: el sync no vuelve a tocar el índice.
    for (const batch of chunks(inserts, INSERT_BATCH)) {
      await db.insert(pages).values(batch);
    }

    const stale = current.filter((row) => !seen.has(row.slug));
    for (const batch of chunks(stale, DELETE_BATCH)) {
      await db.delete(pages).where(inArray(pages.id, batch.map((row) => row.id)));
    }

    const created = inserts.length;
    const deleted = stale.length;

    // El grafo solo puede haber cambiado si cambió alguna página (los enlaces
    // viven en la propia fila) o si cambió el conjunto de destinos válidos.
    if (created + updated + deleted > 0) {
      await db.delete(pageLinks).where(eq(pageLinks.subjectId, subject.id));
      const edges = resolveLinks(incoming, seen);
      for (const batch of chunks(edges, DELETE_BATCH)) {
        await db.insert(pageLinks).values(batch.map((edge) => ({ subjectId: subject.id, ...edge })));
      }
    }

    // El material de estudio se reemplaza entero cuando viene; un payload sin
    // `study` (CLI viejo) deja el que ya estaba guardado.
    if (study) {
      await db
        .insert(subjectStudy)
        .values({ subjectId: subject.id, studyJson: study, updatedAt: now })
        .onConflictDoUpdate({
          target: subjectStudy.subjectId,
          set: { studyJson: study, updatedAt: now },
        });
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
  study?: StudyContent;
}
