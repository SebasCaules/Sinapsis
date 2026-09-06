-- Índice de texto completo (FTS5) sobre título y cuerpo de las páginas.
-- Se mantiene explícitamente desde el servicio de sync (no con triggers): el
-- sync reemplaza el conjunto entero de páginas de una materia en una sola
-- transacción, así que reconstruir el índice de esa materia es más simple y
-- más barato que disparar un trigger por fila.
-- `remove_diacritics 2` permite que "distribucion" encuentre "distribución".

CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts USING fts5 (
  title,
  body,
  slug UNINDEXED,
  subject_id UNINDEXED,
  tokenize = 'unicode61 remove_diacritics 2'
);
