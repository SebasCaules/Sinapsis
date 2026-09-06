-- Sinapsis · esquema inicial (Sprint 1).
-- Las sentencias se separan con la marca `--> statement-breakpoint`.

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  name        TEXT NOT NULL,
  picture     TEXT,
  theme       TEXT NOT NULL DEFAULT 'pergamino',
  google_sub  TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS users_email_uq ON users (email);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_uq ON users (google_sub);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS subjects (
  id             TEXT PRIMARY KEY,
  slug           TEXT NOT NULL,
  name           TEXT NOT NULL,
  code           TEXT NOT NULL,
  institution    TEXT NOT NULL,
  color          TEXT,
  semester_hint  TEXT,
  division_json  TEXT NOT NULL,
  config_json    TEXT,
  placeholder    INTEGER NOT NULL DEFAULT 1,
  last_sync_at   TEXT,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS subjects_slug_uq ON subjects (slug);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS pages (
  id              TEXT PRIMARY KEY,
  subject_id      TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  slug            TEXT NOT NULL,
  title           TEXT NOT NULL,
  type            TEXT NOT NULL,
  folder          TEXT NOT NULL DEFAULT '',
  division        TEXT NOT NULL DEFAULT 'meta',
  "order"         INTEGER,
  summary         TEXT NOT NULL DEFAULT '',
  format          TEXT,
  tags_json       TEXT NOT NULL DEFAULT '[]',
  sources_json    TEXT NOT NULL DEFAULT '[]',
  updated_at_src  TEXT,
  links_json      TEXT NOT NULL DEFAULT '[]',
  headings_json   TEXT NOT NULL DEFAULT '[]',
  body            TEXT NOT NULL DEFAULT '',
  content_hash    TEXT NOT NULL DEFAULT '',
  words           INTEGER NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS pages_subject_slug_uq ON pages (subject_id, slug);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pages_subject_idx ON pages (subject_id);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS user_subjects (
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  semester    TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  added_at    TEXT NOT NULL,
  PRIMARY KEY (user_id, subject_id)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS user_subjects_user_idx ON user_subjects (user_id);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS progress (
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  subject_id  TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  page_slug   TEXT NOT NULL,
  studied_at  TEXT NOT NULL,
  PRIMARY KEY (user_id, subject_id, page_slug)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS progress_user_subject_idx ON progress (user_id, subject_id);
