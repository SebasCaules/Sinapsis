-- Sinapsis · Sprint 2 (Estudio).
--
-- Tres bloques:
--  1. FTS externa (S-06): `pages_fts` deja de ser una copia del contenido y pasa
--     a ser un índice `content='pages'` mantenido por triggers. Así el MATCH ya
--     no recorre las páginas de todas las materias: se filtra por rowid.
--     Indexa las tres columnas de texto de `pages` (title, summary, body): el
--     resumen es la frase que mejor describe a la página y muchas veces dice lo
--     que el cuerpo no repite, así que tiene que ser buscable, no solo pesar en
--     el reordenamiento posterior.
--     Ojo: el índice referencia `pages` por rowid y `pages` no tiene INTEGER
--     PRIMARY KEY, así que un VACUUM podría renumerarlos. Si alguna vez se
--     agrega mantenimiento de la base, hay que correr después
--     `INSERT INTO pages_fts(pages_fts) VALUES('rebuild')`.
--  2. Material de estudio de la materia (`subject_study`) y grafo de enlaces
--     (`page_links`, S-07), ambos poblados por el sync.
--  3. Estado por usuario: favoritos, apuntes, SRS, tareas del plan, intentos de
--     quiz y cuatrimestres de la landing (S-03).

DROP TABLE IF EXISTS pages_fts;
--> statement-breakpoint
CREATE VIRTUAL TABLE pages_fts USING fts5 (
  title,
  summary,
  body,
  content = 'pages',
  content_rowid = 'rowid',
  tokenize = 'unicode61 remove_diacritics 2'
);
--> statement-breakpoint
INSERT INTO pages_fts (pages_fts) VALUES ('rebuild');
--> statement-breakpoint
DROP TRIGGER IF EXISTS pages_ai;
--> statement-breakpoint
DROP TRIGGER IF EXISTS pages_ad;
--> statement-breakpoint
DROP TRIGGER IF EXISTS pages_au;
--> statement-breakpoint
CREATE TRIGGER pages_ai AFTER INSERT ON pages BEGIN
  INSERT INTO pages_fts (rowid, title, summary, body)
  VALUES (new.rowid, new.title, new.summary, new.body);
END;
--> statement-breakpoint
CREATE TRIGGER pages_ad AFTER DELETE ON pages BEGIN
  INSERT INTO pages_fts (pages_fts, rowid, title, summary, body)
  VALUES ('delete', old.rowid, old.title, old.summary, old.body);
END;
--> statement-breakpoint
CREATE TRIGGER pages_au AFTER UPDATE ON pages BEGIN
  INSERT INTO pages_fts (pages_fts, rowid, title, summary, body)
  VALUES ('delete', old.rowid, old.title, old.summary, old.body);
  INSERT INTO pages_fts (rowid, title, summary, body)
  VALUES (new.rowid, new.title, new.summary, new.body);
END;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS subject_study (
  subject_id  TEXT PRIMARY KEY REFERENCES subjects (id) ON DELETE CASCADE,
  study_json  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS page_links (
  subject_id  TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  from_slug   TEXT NOT NULL,
  to_slug     TEXT NOT NULL,
  PRIMARY KEY (subject_id, from_slug, to_slug)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS page_links_to_idx ON page_links (subject_id, to_slug);
--> statement-breakpoint
INSERT OR IGNORE INTO page_links (subject_id, from_slug, to_slug)
SELECT p.subject_id, p.slug, json_extract(link.value, '$.slug')
  FROM pages p, json_each(p.links_json) link
 WHERE json_extract(link.value, '$.slug') IS NOT NULL
   AND json_extract(link.value, '$.slug') <> p.slug
   AND EXISTS (
     SELECT 1 FROM pages target
      WHERE target.subject_id = p.subject_id
        AND target.slug = json_extract(link.value, '$.slug')
   );
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  page_slug   TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  PRIMARY KEY (user_id, subject_id, page_slug)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS notes (
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  page_slug   TEXT NOT NULL,
  body        TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (user_id, subject_id, page_slug)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS srs_cards (
  user_id        TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id     TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  card_id        TEXT NOT NULL,
  ease           REAL NOT NULL,
  interval_days  REAL NOT NULL,
  due            TEXT NOT NULL,
  reps           INTEGER NOT NULL DEFAULT 0,
  lapses         INTEGER NOT NULL DEFAULT 0,
  last_grade     INTEGER,
  updated_at     TEXT NOT NULL,
  PRIMARY KEY (user_id, subject_id, card_id)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS tasks (
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  task_id     TEXT NOT NULL,
  done_at     TEXT NOT NULL,
  PRIMARY KEY (user_id, subject_id, task_id)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  quiz_id     TEXT NOT NULL,
  score       INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  at          TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS quiz_attempts_user_subject_quiz_idx
  ON quiz_attempts (user_id, subject_id, quiz_id);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS user_semesters (
  user_id   TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  label     TEXT NOT NULL,
  position  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, label)
);
