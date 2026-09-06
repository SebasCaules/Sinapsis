---
fecha: 2026-09-06
materia: cripto
titulo: "Agregar el callout de cita al registro"
rama: proposal/cripto-20260906-agregar-el-callout-de-cita-al-registro
estado: abierta
pr: null
---

## Motivo

El registro de callouts del contrato 02 §10 no tiene un tipo para la cita textual, y este wiki lo usa 418 veces.

Qué es. Las notas de clase de Criptografía citan la transcripción del audio: el pasaje literal de lo que dijo el docente, con el número de cue, para poder distinguir lo que se dijo en clase de lo que infirió el vault. La convención del vault es `> [!quote]- De la transcripción — <de qué habla> (cues pt2 583-589)`, con el cuerpo en cursiva y entre comillas.

Qué pasa hoy. `quote` no está en el registro, así que cae en `nota` y se rotula «Nota». No es un error y nada se rompe, pero el aviso pierde justo lo que lo hacía útil: un lector que ve «Nota» no sabe si está leyendo la voz del docente o el comentario del autor de la nota, que es la distinción que estas 418 marcas existen para sostener.

Por qué no se resuelve en la materia. El registro es cerrado por diseño (contrato 02 §11: «Un tipo de callout propio → el registro es cerrado»). Cambiar los 418 a `[!info]` o `[!nota]` empeora las dos copias: pierde el rótulo en Obsidian, donde `quote` sí existe y se renderiza como cita, y no gana nada en la plataforma.

Qué se pide. Agregar `cita` al registro, con alias `quote`, rotulado «Cita». Es un cambio compatible según el contrato 00 §4.1: agregar un valor a un enum de salida que la materia no declara. Ninguna materia existente lo usa hoy, así que no cambia nada de lo publicado; Proba no tiene un solo `[!quote]`.

Nota de alcance: `quote` es un tipo estándar de Obsidian, junto con `cite`. Si la plataforma prefiere admitir el conjunto entero de Obsidian en vez de este tipo suelto, la materia no tiene preferencia: lo que necesita es que la cita textual se distinga de la nota.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `apps/web/src/features/subject/markdown/markdown.module.css` — modificado
- `apps/web/src/features/subject/markdown/remarkCallouts.test.tsx` — modificado
- `apps/web/src/features/subject/markdown/remarkCallouts.ts` — modificado
- `docs/contracts/02-paginas.md` — modificado

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Valor nuevo en un enum de salida, de los compatibles del contrato 00 seccion 4.1: ninguna materia lo declara en su config y ninguna publicada lo usa (Proba tiene 0 callouts quote). Un wiki que hoy escribe quote ya compila y seguira compilando: cambia el rotulo de Nota a Cita, no el comportamiento. La hoja de estilos le da color propio y el contrato 02 documenta el tipo nuevo.

## Gates

### `pnpm typecheck` — OK

Últimas líneas:

```

> sinapsis@0.1.0 typecheck .
> pnpm -r run typecheck

Scope: 5 of 6 workspace projects
packages/contract typecheck$ tsc --noEmit -p tsconfig.json
packages/contract typecheck: Done
packages/runtime typecheck$ tsc --noEmit -p tsconfig.json
packages/markdown typecheck$ tsc --noEmit -p tsconfig.json
packages/markdown typecheck: Done
packages/runtime typecheck: Done
packages/cli typecheck$ tsc --noEmit -p tsconfig.json
apps/web typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck: Done
apps/web typecheck: Done
```

### `pnpm test` — OK

Conteos (esto es lo que el orquestador vuelve a obtener en la rama):

- `packages/contract`: 44 passed (44)
- `packages/runtime`: 178 passed (178)
- `packages/markdown`: 97 passed (97)
- `apps/web`: 681 passed (681)
- `packages/cli`: 57 passed (57)

Últimas líneas:

```
… (273 líneas anteriores)
apps/web test:  Test Files  54 passed (54)
apps/web test:       Tests  681 passed (681)
apps/web test:    Start at  18:59:14
apps/web test:    Duration  7.20s (transform 2.15s, setup 0ms, collect 16.86s, tests 10.66s, environment 28.08s, prepare 4.39s)
apps/web test: Done
packages/cli test:  ✓ src/cli.test.ts (57 tests) 9533ms
packages/cli test:    ✓ sinapsis publish > compila la materia real de Proba y escribe un payload válido (--dry-run) 1137ms
packages/cli test:    ✓ sinapsis publish --no-pr > deja la materia en una rama nueva sin tocar el árbol ni la rama del usuario 892ms
packages/cli test:    ✓ sinapsis publish --no-pr > una segunda publicación sin cambios no crea ninguna rama 1013ms
packages/cli test:    ✓ sinapsis status > no reporta diferencias cuando el vault y lo publicado coinciden 821ms
packages/cli test:    ✓ sinapsis site build > sin --only limpia de la salida las materias que ya no están 330ms
packages/cli test:    ✓ sinapsis propose > crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main 359ms
packages/cli test:    ✓ sinapsis propose > corre los gates y no crea nada si fallan 355ms
packages/cli test:    ✓ sinapsis propose > si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15) 1010ms
packages/cli test:    ✓ sinapsis propose > dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX 458ms
packages/cli test:  Test Files  1 passed (1)
packages/cli test:       Tests  57 passed (57)
packages/cli test:    Start at  18:59:14
packages/cli test:    Duration  10.33s (transform 277ms, setup 0ms, collect 428ms, tests 9.53s, environment 0ms, prepare 157ms)
packages/cli test: Done
```

### `pnpm build` — OK

Últimas líneas:

```
… (115 líneas anteriores)
apps/web build: dist/assets/KitView-COmC3Cj-.js                         7.85 kB │ gzip:   2.90 kB │ map:    24.13 kB
apps/web build: dist/assets/DivisionView-BGR1Oxk1.js                    8.11 kB │ gzip:   2.80 kB │ map:    20.63 kB
apps/web build: dist/assets/CatalogView-tLCxZMqI.js                     8.14 kB │ gzip:   3.01 kB │ map:    26.87 kB
apps/web build: dist/assets/PageFrame-B1GcIt00.js                       8.53 kB │ gzip:   3.38 kB │ map:    39.22 kB
apps/web build: dist/assets/SessionView-CzI5keEP.js                     9.66 kB │ gzip:   3.94 kB │ map:    32.46 kB
apps/web build: dist/assets/NotesView-CC0ZGNM5.js                      10.19 kB │ gzip:   3.90 kB │ map:    35.90 kB
apps/web build: dist/assets/QuizView-DhE-iuoM.js                       10.57 kB │ gzip:   4.21 kB │ map:    34.04 kB
apps/web build: dist/assets/ReaderView-DUTxDkWO.js                     12.88 kB │ gzip:   5.15 kB │ map:    51.53 kB
apps/web build: dist/assets/PlanView-BoHwi2Bj.js                       25.45 kB │ gzip:   9.11 kB │ map:    85.34 kB
apps/web build: dist/assets/markdown-85jgLMIf.js                       47.20 kB │ gzip:  15.21 kB │ map:   156.11 kB
apps/web build: dist/assets/index-D8pLtFH_.js                          74.48 kB │ gzip:  28.93 kB │ map:   332.89 kB
apps/web build: dist/assets/GraphView-khESRL9i.js                      82.32 kB │ gzip:  28.34 kB │ map:   340.34 kB
apps/web build: dist/assets/Markdown-DJguNvia.js                      184.00 kB │ gzip:  56.67 kB │ map: 1,134.08 kB
apps/web build: dist/assets/index-CcqpdK0e.js                         818.75 kB │ gzip: 254.94 kB │ map: 3,174.28 kB
apps/web build: ✓ built in 2.15s
apps/web build: (!) Some chunks are larger than 500 kB after minification. Consider:
apps/web build: - Using dynamic import() to code-split the application
apps/web build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
apps/web build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
apps/web build: Done
```

## Revisión

(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
