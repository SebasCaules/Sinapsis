-- Sinapsis · página «hub» de una división (frontmatter `hub: true`).
--
-- Marca la portada de la división: abre su secuencia de lectura y la vista de
-- la división la muestra como tarjeta de panorama. Es dato del wiki, no del
-- usuario, así que viaja con la página y lo repone cada sync.

ALTER TABLE pages ADD COLUMN hub INTEGER;
