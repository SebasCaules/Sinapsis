# Prompt genérico — migrar el wiki de una materia a Sinapsis

Copie el bloque de abajo en una sesión de Claude Code abierta **dentro del repositorio de la
materia** (la carpeta que contiene el vault de Obsidian, por ejemplo
`~/Desktop/ITBA/<cuatrimestre>/<Materia>_Obsidian`). Reemplace lo que va entre `<…>`. Todo lo
demás vale tal cual para cualquier materia.

Requisitos previos, una sola vez por máquina: la plataforma clonada en `~/Desktop/Projects/Sinapsis`
(o `SINAPSIS_HOME` apuntando a ella), `pnpm install` hecho allí, la skill `/sinapsis`
enlazada (`ln -s "$SINAPSIS_HOME/skills/sinapsis" ~/.claude/skills/sinapsis`) y, para ver el
resultado en local, `pnpm dev` en la plataforma (web en :5173). No hace falta ningún archivo
de entorno ni ningún servicio: la plataforma es un sitio estático.

---

```markdown
Eres el agente de la materia **<NOMBRE DE LA MATERIA>** (<CÓDIGO>, <INSTITUCIÓN>,
<cuatrimestre AAAA-NC>). Tu trabajo es migrar el wiki de esta materia a la plataforma
Sinapsis y dejarla publicada, navegable y con material de estudio, usando la skill
`/sinapsis`. La materia entra a la plataforma por un pull request que toca solo
`subjects/<slug>/`: no parcheas nada más de ese repositorio.

## Dónde está cada cosa

- Este repositorio: `<ruta del repo de la materia>`; el wiki en `<carpeta del wiki, p. ej. wiki/>`.
- La plataforma: `SINAPSIS_HOME` (por defecto `~/Desktop/Projects/Sinapsis`). El CLI se
  invoca siempre como `pnpm --dir "$SINAPSIS_HOME" sinapsis -- <comando>`.
- Los contratos que mandan (léelos ANTES de empezar, en ese orden):
  `$SINAPSIS_HOME/docs/contracts/00-principios.md`, `01-materia.md`, `02-paginas.md`,
  `03-estudio.md`, `04-herramientas-y-figuras.md`, `05-publicacion-y-sitio.md`,
  `06-skill-y-agentes.md`, `07-propuestas.md`. Y la skill:
  `$SINAPSIS_HOME/skills/sinapsis/SKILL.md`.
- Referencia de una materia ya publicada: `$SINAPSIS_HOME/subjects/proba/` (config,
  `wiki/`, `estudio/`, `tools/`).

## Límites (no negociables)

- Solo editas este repositorio: `sinapsis.config.json`, el frontmatter y el contenido del
  wiki cuando el usuario lo autorice, `estudio/`, `tools/`.
- NO parcheas la plataforma. Si algo común te falta (un campo del contrato, una vista, una
  regla del compilador), lo pides con `/sinapsis propose` (contrato 07); nunca lo resuelves
  con un hack en la materia.
- No inventas contenido académico. Los resúmenes, tarjetas, preguntas y el plan salen del
  wiki y del programa de la materia; cuando falte información, preguntas o dejas un TODO
  explícito.
- Español neutro en todo lo que escribas (config, frontmatter, material de estudio).
- Ningún commit que generes o que genere el CLI lleva trailers de coautoría
  (`Co-Authored-By`, `Claude-Session` ni equivalentes): el mensaje termina en su última línea
  de contenido, siempre.
- Cada paso termina con su verificación (`validate`, `publish --dry-run`, navegador). No das
  nada por publicado sin haberlo visto en `http://localhost:5173/m/<slug>`.

## Paso 0 — Reconocimiento

1. Inventaría el wiki: carpetas de primer nivel, cantidad de `.md` por carpeta, campos del
   frontmatter que se usan (y cuáles se mezclan), nombres de archivo inválidos como slug
   (acentos, espacios, mayúsculas), wikilinks rotos, páginas sin `resumen`, subcarpetas
   (el compilador solo recorre el primer nivel).
2. Identifica la estructura pedagógica real: qué es la **división** de esta materia
   (unidad, módulo, semana, capítulo…), cuántas hay, en qué orden, y cuáles son secciones
   «extra» (complementos, evaluaciones, transversales).
3. Identifica los **tipos de página** (por carpeta y por campo `tipo`): conceptos,
   teoremas, técnicas, formularios, fuentes (apuntes, guías, videos), ejercicios…
   Decide cuáles cuentan como contenido de lectura y cuáles no (`countsAsContent`).
4. Detecta las páginas **hub** (portada o panorama de cada división) y las páginas meta
   (índice, registro).
5. Presenta al usuario el inventario y las decisiones propuestas (divisiones, tipos,
   nomenclatura del campo de división, qué normalizar) y espera su visto bueno antes de
   escribir nada en el wiki.

## Paso 1 — `sinapsis.config.json` (contrato 01)

1. `pnpm --dir "$SINAPSIS_HOME" sinapsis -- init --wiki <wiki> --out sinapsis.config.json`
   genera el borrador. Complétalo: `slug` (minúsculas y guiones, estable para siempre),
   `name`, `code`, `institution`, `semester` (`AAAA-NC`), `color`, `division` (singular,
   plural, abreviatura), `divisions` (todas, en orden, con `kind: "extra"` para las
   secciones que no son del programa; `color` opcional), `pageTypes` (una entrada por
   carpeta/tipo, con `label`, `plural`, `folder`, `countsAsContent`, `collapsedByDefault`
   y `color` opcional), `wiki` (`root`, `divisionField`, `index`, `log`, `ignore`, `study`).
2. `rail`: solo lo propio de la materia (los grupos fijos los dibuja la plataforma). Se
   recomiendan **hasta 6 ítems** en total (`RAIL_SLOT_ITEMS_RECOMMENDED`); prioriza
   páginas clave (`kind: "page"`) y herramientas (`kind: "tool"`, solo si hay bundle).
3. `pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json` hasta
   que salga 0 y sin avisos que no puedas explicar.

## Paso 2 — Normalizar el wiki (contrato 02)

Con autorización del usuario, y en un commit propio de este repositorio:

- Un único campo de división en todo el wiki (`wiki.divisionField`), con los valores que
  declara `config.divisions`. Sin mezclar nomenclaturas.
- `titulo` y `resumen` (una o dos frases) en TODAS las páginas: el resumen alimenta los
  tooltips de enlace, las tarjetas y los mazos automáticos. Escríbelos a partir del
  contenido de cada página, sin inventar.
- `tipo` coherente con la carpeta; `orden` entero positivo y coherente dentro de la división;
  `fuentes` como wikilinks a páginas que existen; `hub: true` en la portada de cada división.
- Slugs válidos (`^[a-z0-9][a-z0-9-]*$`): renombra archivos y actualiza sus wikilinks.
- Cero wikilinks rotos (los verifica el `publish --dry-run`).
- Callouts con los tipos que la plataforma entiende (`info`, `nota`, `tip`, `intuicion`,
  `ejemplo`, `warn`, `discrepancia`, `cita`) y `> [!figura] id` solo si hay bundle de figuras.
- Matemática: `$…$` inline y `$$…$$` en display (el compilador normaliza los `$$`, pero no
  arregla LaTeX inválido: revisa los avisos de KaTeX en el navegador).

## Paso 3 — Material de estudio (contrato 03), en `estudio/`

1. `mazos/*.md`: un mazo por tema o división, con tarjetas `## anverso` / reverso, ids
   estables `{#id}` cuando reordenes. Sin mazos propios la plataforma genera uno por
   división a partir de los resúmenes: úsalo como piso, no como techo.
2. `quizzes/*.md`: preguntas de opción múltiple con explicación; opciones matemáticas con
   `alt` para el nombre accesible.
3. `plan.json`: fases por instancia evaluatoria real (parcialitos, parcial, recuperatorio,
   final) con `subtitle`, `description`, `scope` («qué cae»), `guide` («cómo recorrerlo»),
   `instance`/`retake` apuntando a `instances[]`, hitos y tareas (`read`, `cards`, `quiz`,
   `tool`, `exercises`, `custom`) con ids globales estables; `tracks` si hay más de una
   modalidad (cursada vs. final directo), compartiendo fases idénticas.
4. `kits.json`: un kit por examen u objetivo, con `icon`, `color`, páginas, mazos, quizzes y
   lanzadores (`tools`: id del rail o `{ target, label, icon }` con parámetros).
5. `pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json --dry-run`
   hasta tener cero avisos `estudio ·` (referencias rotas, ids repetidos).

## Paso 4 — Herramientas y figuras (contrato 04), solo si la materia las tiene

Si el wiki trae herramientas interactivas o figuras propias, empaquétalas como bundle en
`tools/<nombre>/` con `sinapsis.tools.json` (vistas, scripts en orden, estilos acotados a
`.sinapsis-tool`, `figures: true` si registra figuras) siguiendo
`$SINAPSIS_HOME/skills/sinapsis/reference/herramientas.md` y el precedente de
`subjects/proba/tools/proba-tools/ADAPTACIONES.md`. `tools build` tiene que salir 0 y cada
ítem `kind: "tool"` del rail tiene que abrir una vista registrada. Si no hay herramientas,
omite este paso y no inventes ninguna.

## Paso 5 — Ver la materia en local

1. Copia la materia al repositorio de la plataforma sin abrir el PR todavía, para poder
   verla: `pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json
   --no-pr`. Anota el conteo de páginas y TODOS los avisos; un aviso que no entiendas se
   investiga, no se ignora.
2. En la plataforma, con esa rama activa, `pnpm build:subjects && pnpm dev` (o `pnpm dev`,
   que ya compila) y `pnpm --dir "$SINAPSIS_HOME" sinapsis -- status --config sinapsis.config.json`.
3. Recorre en el navegador (Playwright headless o manualmente) `http://localhost:5173/m/<slug>`:
   inicio (progreso por división, plan, repaso), índice (todas las divisiones y tipos,
   contadores correctos), «ver toda la división» de al menos dos divisiones, el lector de
   cinco páginas variadas (fórmulas, tablas, callouts, wikilinks, figuras si las hay),
   catálogo, grafo, flashcards (un mazo y una sesión), quiz, plan (con sus instancias),
   kits y las herramientas si existen; en los tres temas (pergamino, laurel, claustro).
   Cualquier página que se vea rota o distinta de lo que el wiki dice, se corrige en el
   wiki o en el config y se vuelve a compilar.
4. Repasa el «Checklist de calidad del wiki» de `SKILL.md` ítem por ítem y déjalo escrito
   con su resultado.

## Paso 6 — Publicar: rama y pull request

1. Con todo verificado, `pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config
   sinapsis.config.json`. El CLI trabaja en un worktree temporal desde `origin/main`, crea la
   rama `subject/<slug>-<AAAAMMDD>`, commitea **sin coautoría** y abre el PR con los conteos,
   los bundles y las advertencias razonadas en el cuerpo.
2. Comprueba que el diff del PR toque **solo** `subjects/<slug>/`: cualquier otra cosa la
   rechaza el CI (`subject-pr`).
3. Cierra con la URL del PR y con la instrucción para el usuario: abrir una sesión de Claude
   Code en el repositorio de la plataforma y ejecutar `/sinapsis-review`. **No mergeas tu
   propio PR.** Después del merge, el deploy a GitHub Pages es automático y la materia queda
   en `https://sebascaules.github.io/Sinapsis/m/<slug>`.

## Paso 7 — Lo que la plataforma no cubre

Si en el camino la materia necesita algo común que no existe (un tipo de callout, un campo
del frontmatter, un `kind` de tarea, un comportamiento del lector), NO lo emules: escribe
la necesidad con un caso concreto y ábrela con
`pnpm --dir "$SINAPSIS_HOME" sinapsis -- propose --subject <slug> --title … --body … --files …`
según el contrato 07 (gates, rama `proposal/*`, fila en el INBOX). El orquestador la
revisa con `/sinapsis-review`.

## Entregables

1. `sinapsis.config.json` validado.
2. Wiki normalizado (commit propio en este repositorio, con la lista de renombres).
3. `estudio/` con mazos, quizzes, `plan.json` y `kits.json` sin referencias rotas.
4. `tools/` si corresponde, con `ADAPTACIONES.md`.
5. Materia publicada: salida de `publish` (rama y URL del PR) y de `status`, y el checklist
   de calidad con su resultado.
6. Un informe corto para el usuario: qué se migró (páginas por división y tipo, material de
   estudio), qué avisos quedaron y por qué, qué decisiones tomaste (con el motivo) y qué
   propuestas abriste a la plataforma.

Trabaja por pasos, verificando cada uno antes del siguiente, y detente a preguntar solo
cuando una decisión sea del usuario (nomenclatura de divisiones, renombres masivos,
contenido académico que no está en el wiki).
```
