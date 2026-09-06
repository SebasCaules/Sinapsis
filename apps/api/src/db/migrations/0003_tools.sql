-- Sinapsis · Sprint 3 (Herramientas).
--
-- Bundles de herramientas por materia (N0-41, N0-42). La base guarda solo el
-- índice —manifiesto, tamaño y fecha—; los archivos viven en disco, bajo
-- `TOOLS_DIR/<subject_id>/<tool_id>/<path>`, porque son estáticos que se
-- sirven tal cual y no tiene sentido pagarlos como blobs en SQLite.
--
-- La fila y la carpeta se crean y se borran juntas (`PUT`/`DELETE` de
-- `/api/subjects/:slug/tools/:id`). El sync de la materia NO las toca: un wiki
-- se puede re-sincronizar cuantas veces haga falta sin perder sus herramientas.

CREATE TABLE IF NOT EXISTS subject_tools (
  subject_id     TEXT NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
  tool_id        TEXT NOT NULL,
  manifest_json  TEXT NOT NULL,
  bytes          INTEGER NOT NULL DEFAULT 0,
  updated_at     TEXT NOT NULL,
  PRIMARY KEY (subject_id, tool_id)
);
