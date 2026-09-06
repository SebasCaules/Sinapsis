/**
 * Esquema de la base (Drizzle + SQLite/libSQL).
 *
 * Las fechas se guardan como texto ISO-8601 (UTC): es lo que viaja por HTTP en
 * el contrato (`lastSyncAt: string | null`) y evita conversiones en el borde.
 * Los objetos del contrato (SubjectConfig, DivisionLabel, tags, links…) se
 * guardan como JSON en columnas `*_json`.
 */
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type {
  DivisionLabel,
  PageHeading,
  PageLink,
  SrsGrade,
  StudyContent,
  SubjectConfig,
  ThemeId,
} from "@sinapsis/contract";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    picture: text("picture"),
    theme: text("theme").$type<ThemeId>().notNull().default("pergamino"),
    googleSub: text("google_sub"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_uq").on(t.email),
    googleSubIdx: uniqueIndex("users_google_sub_uq").on(t.googleSub),
  }),
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({ userIdx: index("sessions_user_idx").on(t.userId) }),
);

export const subjects = sqliteTable(
  "subjects",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    institution: text("institution").notNull(),
    color: text("color"),
    semesterHint: text("semester_hint"),
    divisionJson: text("division_json", { mode: "json" }).$type<DivisionLabel>().notNull(),
    /** SubjectConfig completo; null mientras la materia sea placeholder. */
    configJson: text("config_json", { mode: "json" }).$type<SubjectConfig | null>(),
    placeholder: integer("placeholder", { mode: "boolean" }).notNull().default(true),
    lastSyncAt: text("last_sync_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({ slugIdx: uniqueIndex("subjects_slug_uq").on(t.slug) }),
);

export const pages = sqliteTable(
  "pages",
  {
    id: text("id").primaryKey(),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    type: text("type").notNull(),
    folder: text("folder").notNull().default(""),
    division: text("division").notNull().default("meta"),
    order: integer("order"),
    summary: text("summary").notNull().default(""),
    format: text("format"),
    tagsJson: text("tags_json", { mode: "json" }).$type<string[]>().notNull(),
    sourcesJson: text("sources_json", { mode: "json" }).$type<string[]>().notNull(),
    updatedAtSrc: text("updated_at_src"),
    linksJson: text("links_json", { mode: "json" }).$type<PageLink[]>().notNull(),
    headingsJson: text("headings_json", { mode: "json" }).$type<PageHeading[]>().notNull(),
    body: text("body").notNull(),
    /** Huella del contenido: permite que el sync distinga páginas realmente modificadas. */
    contentHash: text("content_hash").notNull().default(""),
    words: integer("words").notNull().default(0),
  },
  (t) => ({
    subjectSlugIdx: uniqueIndex("pages_subject_slug_uq").on(t.subjectId, t.slug),
    subjectIdx: index("pages_subject_idx").on(t.subjectId),
  }),
);

export const userSubjects = sqliteTable(
  "user_subjects",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    semester: text("semester").notNull(),
    position: integer("position").notNull().default(0),
    addedAt: text("added_at").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.subjectId] }),
    userIdx: index("user_subjects_user_idx").on(t.userId),
  }),
);

/**
 * Progreso por usuario y página. Se guarda por `page_slug` (no por id de
 * página) para que sobreviva a los syncs que borran y recrean páginas.
 */
export const progress = sqliteTable(
  "progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    pageSlug: text("page_slug").notNull(),
    studiedAt: text("studied_at").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.subjectId, t.pageSlug] }),
    userSubjectIdx: index("progress_user_subject_idx").on(t.userId, t.subjectId),
  }),
);

// ---------------------------------------------------------------------------
// Sprint 2 · material de estudio y grafo de la materia (los pobla el sync)
// ---------------------------------------------------------------------------

/**
 * `StudyContent` autoral de la materia: lo que vino en `SyncPayload.study`, sin
 * los mazos automáticos (esos los calcula el contrato en cada lectura, así
 * siguen a las páginas sin necesidad de re-sincronizar).
 */
export const subjectStudy = sqliteTable("subject_study", {
  subjectId: text("subject_id")
    .primaryKey()
    .references(() => subjects.id, { onDelete: "cascade" }),
  studyJson: text("study_json", { mode: "json" }).$type<StudyContent>().notNull(),
  updatedAt: text("updated_at").notNull(),
});

/**
 * Wikilinks resueltos de la materia (S-07): solo los que apuntan a una página
 * que existe. Alimenta los backlinks del lector y el grafo de conexiones. Se
 * guarda por slug (no por id) para que el sync la pueda reconstruir entera.
 */
export const pageLinks = sqliteTable(
  "page_links",
  {
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    fromSlug: text("from_slug").notNull(),
    toSlug: text("to_slug").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.subjectId, t.fromSlug, t.toSlug] }),
    toIdx: index("page_links_to_idx").on(t.subjectId, t.toSlug),
  }),
);

// ---------------------------------------------------------------------------
// Sprint 2 · estado de estudio por usuario y materia
// ---------------------------------------------------------------------------

/** Favoritos del lector. Por slug, como el progreso: sobrevive a los syncs. */
export const bookmarks = sqliteTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    pageSlug: text("page_slug").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.subjectId, t.pageSlug] }) }),
);

/** Apunte del usuario sobre una página (markdown crudo, ≤ 50 000 caracteres). */
export const notes = sqliteTable(
  "notes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    pageSlug: text("page_slug").notNull(),
    body: text("body").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.subjectId, t.pageSlug] }) }),
);

/**
 * Estado SM-2 de cada tarjeta (N0-28). `card_id` no tiene clave foránea: los
 * mazos automáticos no están en la base y las tarjetas autorales viven dentro
 * del JSON de `subject_study`.
 */
export const srsCards = sqliteTable(
  "srs_cards",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    cardId: text("card_id").notNull(),
    ease: real("ease").notNull(),
    intervalDays: real("interval_days").notNull(),
    due: text("due").notNull(),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    lastGrade: integer("last_grade").$type<SrsGrade | null>(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.subjectId, t.cardId] }) }),
);

/** Tareas del plan de estudio marcadas como hechas. */
export const tasks = sqliteTable(
  "tasks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    taskId: text("task_id").notNull(),
    doneAt: text("done_at").notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.subjectId, t.taskId] }) }),
);

/** Historial de intentos de quiz (se conservan todos; la vista lee los últimos). */
export const quizAttempts = sqliteTable(
  "quiz_attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    quizId: text("quiz_id").notNull(),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    at: text("at").notNull(),
  },
  (t) => ({
    userSubjectQuizIdx: index("quiz_attempts_user_subject_quiz_idx").on(t.userId, t.subjectId, t.quizId),
  }),
);

/**
 * Cuatrimestres declarados por el usuario en su landing (S-03, N0-32). Existen
 * aunque no tengan materias: es la única forma de conservar un cuatrimestre
 * vacío y el orden elegido.
 */
export const userSemesters = sqliteTable(
  "user_semesters",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.label] }) }),
);

/** Tabla de control de migraciones aplicadas. */
export const migrationsApplied = sqliteTable("_migrations", {
  name: text("name").primaryKey(),
  appliedAt: text("applied_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type UserRow = typeof users.$inferSelect;
export type SubjectRow = typeof subjects.$inferSelect;
export type PageRow = typeof pages.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
export type SrsCardRow = typeof srsCards.$inferSelect;
