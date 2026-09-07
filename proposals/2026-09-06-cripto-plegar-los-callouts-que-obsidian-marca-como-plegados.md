---
fecha: 2026-09-06
materia: cripto
titulo: "Plegar los callouts que Obsidian marca como plegados"
rama: proposal/cripto-20260906-plegar-los-callouts-que-obsidian-marca-como-plegados
estado: aprobada
pr: https://github.com/SebasCaules/Sinapsis/pull/4
---

## Motivo

El contrato 02 §10 dice hoy que el marcador de plegado de Obsidian (`[!tipo]-` / `[!tipo]+`) «se acepta y se descarta: la plataforma no pliega callouts». Esta propuesta lo hace valer.

Para qué. El wiki de Criptografía escribe sus **418 citas de transcripción** como `> [!cita]- De la transcripción — <tema> (cues pt2 583-589)`, con el marcador `-`, porque son el respaldo de lo que la nota afirma y no lo que hay que leer primero: la síntesis en prosa va arriba y la cita queda a mano para verificarla. En Obsidian eso ya funciona; en la plataforma las 418 llegan abiertas y una nota de clase se vuelve el doble de larga, con la voz del docente compitiendo con la explicación.

No es un caso de una materia sola. Cualquier wiki que cite una fuente larga —una demostración completa, la letra de un enunciado, la salida de un comando— tiene el mismo problema, y `[!tipo]-` es la forma en que Obsidian ya lo resuelve: no hay que inventar sintaxis, solo dejar de descartar el marcador que el vault ya escribe.

Por qué no se resuelve en la materia. El plegado es del lector, y el lector es de la plataforma. Lo único que la materia podría hacer es partir cada nota en dos páginas —la explicación y las citas— que es peor: rompe el hilo de lectura, duplica el frontmatter y deja el respaldo a un clic de distancia en vez de a un pliegue.

Qué trae la rama. `> [!tipo]-` se dibuja como `<details class="callout calloutFolded">` cerrado, con la versalita única del aviso (§ lector-17) de `<summary>`; `+` y la ausencia de marcador siguen siendo el `<aside>` de siempre. Vale para todos los tipos del registro, `cita` incluido, y no toca `[!figura]`, que no es un aviso. El cuerpo queda en el HTML aunque el pliegue esté cerrado, así que la búsqueda, los enlaces entrantes y el índice de la página no cambian; y un ancla que apunta a un encabezado adentro de un aviso cerrado lo abre antes de saltar, porque si no el destino no tiene medida y el salto queda en cualquier lado.

TEXTO PARA LA FILA DE docs/DECISIONS.md

Qué se decide. El marcador de plegado de Obsidian deja de descartarse: `[!tipo]-` renderiza el aviso cerrado como `<details>`, `[!tipo]+` y la ausencia lo dejan abierto. El cuerpo viaja siempre en el HTML y el lector abre los pliegues que contienen al ancla de destino.

Por qué. Era la única marca de Obsidian que el compilador leía y tiraba, y la que más cambia cómo se lee una página larga: sin ella, una nota con veinte citas de transcripción obliga a leerlas todas para llegar al final. Se eligió `<details>` sobre un control propio con `aria-expanded` porque el navegador ya trae el teclado, el foco y la semántica, y porque el contenido de un `<details>` cerrado sigue siendo parte del documento —que es lo que mantiene intactas la búsqueda y las anclas.

Costo de revertir. Bajo. Es una rama del renderizador: volver a ignorar el marcador deja todos los avisos abiertos, que es el comportamiento anterior, y ningún contenido publicado se vuelve inválido. Nada del estado personal del usuario depende de esto. Lo que se pierde al revertir es la intención que el wiki ya expresa en el markdown.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `apps/web/src/features/subject/markdown/folded.test.ts` — nuevo
- `apps/web/src/features/subject/markdown/folded.ts` — nuevo
- `apps/web/src/features/subject/markdown/markdown.module.css` — modificado
- `apps/web/src/features/subject/markdown/remarkCallouts.test.tsx` — modificado
- `apps/web/src/features/subject/markdown/remarkCallouts.ts` — modificado
- `apps/web/src/features/subject/views/ReaderView.tsx` — modificado
- `docs/contracts/02-paginas.md` — modificado

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Ninguna materia publicada usa el marcador: Proba no tiene un solo callout con - ni con +, así que todos sus avisos se dibujan igual que antes (aside abierto). No cambia ningún esquema ni ninguna versión de formato: es una rama del renderizador del lector. Un wiki que ya escribía [!tipo]- venía viéndose abierto y ahora se ve cerrado, que es lo que ese markdown pedía.

## Gates

### `pnpm typecheck` — OK

Últimas líneas:

```

> sinapsis@0.1.0 typecheck .
> pnpm -r run typecheck

Scope: 5 of 6 workspace projects
packages/contract typecheck$ tsc --noEmit -p tsconfig.json
packages/contract typecheck: Done
packages/markdown typecheck$ tsc --noEmit -p tsconfig.json
packages/runtime typecheck$ tsc --noEmit -p tsconfig.json
packages/markdown typecheck: Done
packages/runtime typecheck: Done
apps/web typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck: Done
apps/web typecheck: Done
```

### `pnpm test` — OK

Conteos (esto es lo que el orquestador vuelve a obtener en la rama):

- `packages/contract`: 44 passed (44)
- `packages/markdown`: 97 passed (97)
- `packages/runtime`: 178 passed (178)
- `apps/web`: 689 passed (689)
- `packages/cli`: 57 passed (57)

Últimas líneas:

```
… (277 líneas anteriores)
apps/web test:    Start at  20:05:36
apps/web test:    Duration  8.30s (transform 2.26s, setup 0ms, collect 18.66s, tests 12.27s, environment 32.49s, prepare 5.27s)
apps/web test: Done
packages/cli test:  ✓ src/cli.test.ts (57 tests) 10790ms
packages/cli test:    ✓ sinapsis publish > compila la materia real de Proba y escribe un payload válido (--dry-run) 1479ms
packages/cli test:    ✓ sinapsis publish --no-pr > deja la materia en una rama nueva sin tocar el árbol ni la rama del usuario 1003ms
packages/cli test:    ✓ sinapsis publish --no-pr > una segunda publicación sin cambios no crea ninguna rama 1077ms
packages/cli test:    ✓ sinapsis status > compara el vault con lo publicado y nombra lo nuevo, lo cambiado y lo borrado 352ms
packages/cli test:    ✓ sinapsis status > no reporta diferencias cuando el vault y lo publicado coinciden 839ms
packages/cli test:    ✓ sinapsis propose > crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main 593ms
packages/cli test:    ✓ sinapsis propose > corre los gates y no crea nada si fallan 403ms
packages/cli test:    ✓ sinapsis propose > si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15) 972ms
packages/cli test:    ✓ sinapsis propose > dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX 603ms
packages/cli test:    ✓ sinapsis propose > la fila entra en la tabla de abiertas, no al final de un INBOX con más secciones 313ms
packages/cli test:    ✓ sinapsis propose > recorta el título largo por el guion: la rama no termina en un muñón 306ms
packages/cli test:  Test Files  1 passed (1)
packages/cli test:       Tests  57 passed (57)
packages/cli test:    Start at  20:05:36
packages/cli test:    Duration  12.03s (transform 445ms, setup 0ms, collect 671ms, tests 10.79s, environment 0ms, prepare 196ms)
packages/cli test: Done
```

### `pnpm build` — OK

Últimas líneas:

```
… (115 líneas anteriores)
apps/web build: dist/assets/KitView-BlLfK-s-.js                         7.85 kB │ gzip:   2.90 kB │ map:    24.13 kB
apps/web build: dist/assets/DivisionView-L3dFRHL_.js                    8.11 kB │ gzip:   2.80 kB │ map:    20.63 kB
apps/web build: dist/assets/CatalogView-DpRjni2O.js                     8.14 kB │ gzip:   3.01 kB │ map:    26.87 kB
apps/web build: dist/assets/PageFrame-H5nFRCq2.js                       8.53 kB │ gzip:   3.38 kB │ map:    39.22 kB
apps/web build: dist/assets/SessionView-ucsgxtwC.js                     9.66 kB │ gzip:   3.94 kB │ map:    32.46 kB
apps/web build: dist/assets/NotesView-a-B7xQ-i.js                      10.19 kB │ gzip:   3.91 kB │ map:    35.90 kB
apps/web build: dist/assets/QuizView-C5rD7fhl.js                       10.57 kB │ gzip:   4.21 kB │ map:    34.04 kB
apps/web build: dist/assets/ReaderView-DTO9ahwT.js                     13.02 kB │ gzip:   5.22 kB │ map:    52.71 kB
apps/web build: dist/assets/PlanView-DHiltojw.js                       25.45 kB │ gzip:   9.12 kB │ map:    85.34 kB
apps/web build: dist/assets/markdown-DRLRT8Ek.js                       47.20 kB │ gzip:  15.21 kB │ map:   156.11 kB
apps/web build: dist/assets/index-dg-eg7N8.js                          74.48 kB │ gzip:  28.93 kB │ map:   332.89 kB
apps/web build: dist/assets/GraphView-DJH0gmsu.js                      82.32 kB │ gzip:  28.34 kB │ map:   340.34 kB
apps/web build: dist/assets/Markdown-CLuqnB7X.js                      184.32 kB │ gzip:  56.74 kB │ map: 1,136.08 kB
apps/web build: dist/assets/index-Dky4QTR5.js                         818.75 kB │ gzip: 254.94 kB │ map: 3,174.28 kB
apps/web build: ✓ built in 2.35s
apps/web build: (!) Some chunks are larger than 500 kB after minification. Consider:
apps/web build: - Using dynamic import() to code-split the application
apps/web build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
apps/web build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
apps/web build: Done
```

## Revisión

**Veredicto:** aprobada
**Revisó:** orquestador de la plataforma · 2026-09-06
**Commit de merge:** `6a505b7`

### Gates en la rama
- `pnpm typecheck`: OK
- `pnpm test`: OK — contract 44, markdown 97, runtime 178, web 689, cli 55 + 2 omitidas (57; las omitidas exigen `packages/cli/dist`, que el worktree no tiene). Coinciden con la propuesta.
- `pnpm build`: OK
- `pnpm e2e`: 93 pasadas, 3 omitidas, 1 falla **preexistente en `main`**: `landing.spec.ts:47` («agrupa las materias por cuatrimestre») compara la lista exacta de cuatrimestres y asume una sola materia en el catálogo; falla igual en `main` desde que entró Cripto (2026-2C) y en las otras dos ramas abiertas. No es de esta propuesta.

### Hallazgos
1. **(bajo)** `packages/runtime/src/markdown.ts:190` — el renderizador de markdown del runtime (el de los bundles) también lee el marcador `[+-]?` y sigue descartándolo: un `[!tipo]-` dentro de una herramienta se dibuja abierto. Es la misma duplicación de registro anotada al aprobar `cita`; Cripto no publica bundles. Deuda de la plataforma, no de la propuesta.
2. **(bajo)** Código y contrato citaban la decisión como N0-62, que ya existía (ancho de la hoja). Se reemplazó por el número asignado al mergear: **N0-66**.
3. **(bajo)** frontmatter `pr:` — la rama empujada decía `pr: null` (el CLI estampa la URL con `--amend` después de empujar); se estampó en `main`.

Sin hallazgos de corrección ni de seguridad. Se buscó: que `[!figura]-` no se pliegue (probado); que `+` y la ausencia de marcador sigan dando el `<aside>` de siempre (probado); que el cuerpo del `<details>` cerrado siga en el HTML para la búsqueda (probado); que un ancla dentro de un pliegue lo abra — el compilador no indexa encabezados dentro de un blockquote (`extractHeadings` no reconoce `> ##`), así que hoy ningún id de la página cae dentro de un aviso y `openFoldedAncestors` es una red de seguridad, no una ruta activa; que el índice de la página (`ReaderView.tsx:442-449`), que salta con `scrollMainTo` sin pasar por el `hash`, no necesite abrir pliegues por lo mismo. No se agrega HTML crudo: `details` y `summary` son nodos del árbol con `hName`, igual que el `aside`.

Sin fila nueva de esquema: no toca `packages/contract`. Sí abre una fila N0 porque cambia una regla del lector que el contrato 02 §10 fijaba en sentido contrario.

### Efecto en las materias
- Ninguna acción: el plegado lo aplica el lector al renderizar. Las 418 citas de Cripto, escritas con `[!quote]-`, aparecen cerradas apenas se despliegue `main`; Proba no tiene marcadores y no cambia.
