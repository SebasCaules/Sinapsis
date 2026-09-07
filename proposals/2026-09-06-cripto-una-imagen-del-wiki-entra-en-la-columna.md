---
fecha: 2026-09-06
materia: cripto
titulo: "Una imagen del wiki entra en la columna"
rama: proposal/cripto-20260906-una-imagen-del-wiki-entra-en-la-columna
estado: aprobada
pr: null
---

## Motivo

Una imagen del wiki desborda la columna del lector.

Qué pasa. Desde que los adjuntos se publican (N0-68), las imágenes de una página se dibujan con su tamaño natural. Los diagramas que la cátedra de Criptografía usa en clase vienen escaneados o exportados a **entre 1000 y 1100 px de ancho**, y la hoja del lector mide **758**: la imagen se sale de la columna y arrastra la barra de desplazamiento horizontal de toda la página. Se ve en las 26 páginas con imágenes, y peor en las dos resoluciones de guía manuscritas, que son las más anchas.

La hoja del lector ya resuelve este mismo problema para todo lo demás que puede venir ancho —las tablas van en un contenedor con `overflow-x`, las fórmulas de display se encogen hasta 0,78 y recién ahí se vuelven desplazables, y el SVG de una figura interactiva tiene `max-width: 100%`—. La imagen de markdown es el único caso que quedó sin regla.

Por qué no se resuelve en la materia. El markdown de una imagen es `![alt](ruta)`: no admite tamaño ni clase, y el lector no monta `rehype-raw`, así que la materia no puede envolverla en nada. Redimensionar los archivos originales tampoco corresponde: son la fuente, y el mismo archivo tiene que servir en una pantalla angosta y en una ancha.

Qué trae la rama. Una regla en la hoja del lector: `.prose img` con `max-width: 100%` y `height: auto`, que es lo que conserva la proporción al achicarla, más `display: block` y centrado, que es como se lee un diagrama dentro de una nota. No toca la figura interactiva, que ya tenía su propia regla.

TEXTO PARA LA FILA DE docs/DECISIONS.md

Qué se decide. Una imagen del cuerpo de una página nunca desborda la columna: se achica hasta entrar, conservando la proporción, y va centrada en su propio renglón.

Por qué. Es la última pieza que faltaba de N0-68: publicar los adjuntos sin acotar su ancho deja que un diagrama de 1000 px rompa la medida de la hoja y agregue desplazamiento horizontal a toda la página. Achicar es preferible a desplazar para una imagen —al revés que para una tabla o una fórmula, donde encoger vuelve el contenido ilegible—: un diagrama sigue leyéndose a 758 px, y si no, se abre aparte.

Costo de revertir. Nulo. Son cinco líneas de CSS sin nada que dependa de ellas.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `apps/web/src/features/subject/markdown/markdown.module.css` — modificado

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Proba no tiene imagenes en su wiki, asi que no cambia nada para ella. Para cualquier materia con imagenes el efecto es el mismo: la que ya entraba se ve igual y la que desbordaba se achica. No toca ningun esquema ni ninguna version de formato.

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

- `packages/contract`: 48 passed (48)
- `packages/runtime`: 178 passed (178)
- `packages/markdown`: 119 passed (119)
- `apps/web`: 706 passed (706)
- `packages/cli`: 57 passed (57)

Últimas líneas:

```
… (279 líneas anteriores)
apps/web test:  ✓ src/features/subject/components/rail-fit.test.ts (3 tests) 1ms
apps/web test:  Test Files  58 passed (58)
apps/web test:       Tests  706 passed (706)
apps/web test:    Start at  22:33:03
apps/web test:    Duration  7.86s (transform 2.43s, setup 0ms, collect 18.52s, tests 13.04s, environment 28.75s, prepare 5.08s)
apps/web test: Done
packages/cli test:  ✓ src/cli.test.ts (57 tests) 9845ms
packages/cli test:    ✓ sinapsis publish > compila la materia real de Proba y escribe un payload válido (--dry-run) 1201ms
packages/cli test:    ✓ sinapsis publish --no-pr > deja la materia en una rama nueva sin tocar el árbol ni la rama del usuario 962ms
packages/cli test:    ✓ sinapsis publish --no-pr > una segunda publicación sin cambios no crea ninguna rama 1136ms
packages/cli test:    ✓ sinapsis status > no reporta diferencias cuando el vault y lo publicado coinciden 831ms
packages/cli test:    ✓ sinapsis propose > crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main 697ms
packages/cli test:    ✓ sinapsis propose > corre los gates y no crea nada si fallan 357ms
packages/cli test:    ✓ sinapsis propose > si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15) 928ms
packages/cli test:    ✓ sinapsis propose > dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX 443ms
packages/cli test:  Test Files  1 passed (1)
packages/cli test:       Tests  57 passed (57)
packages/cli test:    Start at  22:33:03
packages/cli test:    Duration  10.70s (transform 299ms, setup 0ms, collect 462ms, tests 9.85s, environment 0ms, prepare 127ms)
packages/cli test: Done
```

### `pnpm build` — OK

Últimas líneas:

```
… (175 líneas anteriores)
apps/web build: dist/assets/blockDiagram-I7D4REHJ-CdmiLYfp.js          43.25 kB │ gzip:  13.83 kB │ map:   138.72 kB
apps/web build: dist/assets/xychartDiagram-S5SC5T6Z-DT2FBaqE.js        44.60 kB │ gzip:  12.57 kB │ map:   147.77 kB
apps/web build: dist/assets/GraphView-BQ0QYD53.js                      45.16 kB │ gzip:  16.21 kB │ map:   182.98 kB
apps/web build: dist/assets/markdown-cJMflFpV.js                       47.20 kB │ gzip:  15.21 kB │ map:   156.11 kB
apps/web build: dist/assets/chunk-TICWLB2K-eZfvz4GM.js                 49.39 kB │ gzip:  15.66 kB │ map:   153.09 kB
apps/web build: dist/assets/flowDiagram-HODETNUW-C0Od66nw.js           62.71 kB │ gzip:  19.83 kB │ map:   195.61 kB
apps/web build: dist/assets/c4Diagram-7LVT6UL2-D0TAt2qE.js             65.65 kB │ gzip:  18.71 kB │ map:   192.69 kB
apps/web build: dist/assets/ganttDiagram-EL5Y4UJY-DXq1VDKm.js          69.79 kB │ gzip:  23.37 kB │ map:   249.92 kB
apps/web build: dist/assets/index-Bh5SsWFH.js                          74.53 kB │ gzip:  28.98 kB │ map:   333.47 kB
apps/web build: dist/assets/cose-bilkent-JH36ORCC-CfWj1ZxD.js          81.81 kB │ gzip:  22.45 kB │ map:   305.64 kB
apps/web build: dist/assets/swimlanes-42K2YHIH-BldEnOSE.js            117.21 kB │ gzip:  42.54 kB │ map:   547.57 kB
apps/web build: dist/assets/sequenceDiagram-WJ2MYXX4-H9TKxDEn.js      117.55 kB │ gzip:  31.08 kB │ map:   352.12 kB
apps/web build: dist/assets/architectureDiagram-5GKGNRK7-CekKTfI6.js  152.12 kB │ gzip:  42.96 kB │ map:   602.43 kB
apps/web build: dist/assets/Markdown-DD4Q_n10.js                      188.10 kB │ gzip:  58.28 kB │ map: 1,151.54 kB
apps/web build: dist/assets/cytoscape.esm-Bch-eiPH.js                 443.89 kB │ gzip: 141.82 kB │ map: 1,871.17 kB
apps/web build: dist/assets/mermaid.core-DwPIHd0S.js                  659.13 kB │ gzip: 159.00 kB │ map: 2,245.78 kB
apps/web build: dist/assets/cynefin-OW5HDTMX-CfgnCib5.js              690.91 kB │ gzip: 154.63 kB │ map: 2,180.10 kB
apps/web build: dist/assets/index-DH25le9R.js                         819.38 kB │ gzip: 255.08 kB │ map: 3,176.50 kB
apps/web build: ✓ built in 5.52s
apps/web build: Done
```

## Revisión

**Veredicto:** aprobada
**Revisó:** orquestador de la plataforma · 2026-09-06
**Commit de merge:** `975710e`
**Decisión:** `N0-71` en `docs/DECISIONS.md`.

### Gates en la rama

Corridos en un worktree limpio sobre la rama, con `pnpm install --frozen-lockfile`:

- `pnpm typecheck`: OK
- `pnpm test`: OK — los mismos conteos que declara la propuesta (`packages/contract` 48,
  `packages/runtime` 178, `packages/markdown` 119, `apps/web` 706, `packages/cli` 57, de las
  cuales 2 quedan omitidas por el entorno). Ninguno bajó. Los conteos son los de la rama, que
  nació antes de que entrara la propuesta de la placa de ejercicio; en `main` ya son 51 y 708.
- `pnpm build`: OK (el cambio toca `apps/web`).
- `pnpm e2e`: no corresponde — no cambia ningún texto, rol ni `data-*` de los que mira la
  suite.

El CI del PR #8 también quedó verde.

### Hallazgos

1. **(medio, corregido al mergear)** La propuesta y el comentario del CSS atribuían la
   publicación de adjuntos a `N0-61`, que es «El progreso de una unidad suma los pasos que
   declaran los bundles». La decisión de los adjuntos es `N0-68`. Se corrigieron las dos
   referencias de la propuesta y la del comentario, que además ahora nombra su propia
   decisión, `N0-71`.
2. **(bajo, documentado)** «No toca la figura interactiva» no es exacto. La regla de abajo
   —`.prose :global(.figura .fig-host) > :is(svg, canvas, img)`— solo redeclara `max-width`,
   así que `display: block`, `margin: 18px auto` y `border-radius: var(--r)` **sí** alcanzan a
   un `<img>` dentro de una figura. No bloquea: se revisaron los dos bundles de Proba y
   ninguna figura dibuja un `<img>` (el único `img` de `ejercicios.js` es un `role="img"` en
   un `div`, y el `& img` de `vocab.css` vive en el contenedor propio del bundle, fuera de
   `.prose`). Queda escrito en el comentario del CSS y en la fila `N0-71` para que la próxima
   figura que dibuje una imagen sepa qué hereda.
3. **(bajo, aceptado)** `display: block` manda a su propio renglón también a una imagen que
   se hubiera escrito en medio de un párrafo. Es la decisión de la propuesta —«es como se lee
   un diagrama dentro de una nota»— y cae en lo que el contrato 00 §2 deja explícitamente del
   lado de la plataforma (la estética no es contrato).

Se buscó, sin encontrarlo: un token inexistente (`--r` vale 12 px en `styles/tokens.css`); un
selector que le ganara por especificidad y dejara la regla muerta (`.prose img` es (0,1,1) y
nada más apunta a esa imagen); contenido ancho que quedara sin resolver (la tabla y la
fórmula ya tenían su propia regla); y una materia perjudicada (Proba no tiene imágenes en su
wiki).

### Efecto en las materias

- Ninguna materia tiene que hacer nada: es una regla de la hoja del lector, no del contrato.
  La imagen que ya entraba se ve igual; la que desbordaba se achica.
