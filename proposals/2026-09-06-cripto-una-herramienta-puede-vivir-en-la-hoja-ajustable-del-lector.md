---
fecha: 2026-09-06
materia: cripto
titulo: "Una herramienta puede vivir en la hoja ajustable del lector"
rama: proposal/cripto-20260906-una-herramienta-puede-vivir-en-la-hoja-ajustable-del-lector
estado: abierta
pr: https://github.com/SebasCaules/Sinapsis/pull/13
---

## Motivo

Una herramienta que se lee como un documento no puede usar la hoja ajustable del lector.

Qué pasa. La hoja de una página del wiki es una caja con un ancho que el lector ajusta arrastrando los costados, y que vuelve a 840 con doble clic. Es una preferencia de lectura, global, y está bien resuelta. Una herramienta no la tiene: su contenido queda suelto sobre el área, sin la caja y sin el ancho ajustable, aunque lo que muestre sea texto largo que se lee igual que una página.

Hoy `ToolView.frame` admite un solo valor, `"page"`, que envuelve la vista en el marco de página **entero**: la hoja, la línea de identidad (división · tipo · posición) y la barra de la unidad con su Anterior/Siguiente. Y **solo se aplica cuando el `?arg=` resuelve a un paso de progreso de una división**, porque el marco necesita saber en qué unidad está. Para una herramienta que no es un paso de ningún recorrido —los parciales viejos de Criptografía, el formulario general de Probabilidad— eso no sirve: pedir el marco no hace nada, y si hiciera algo traería una barra de unidad que no corresponde.

Se ve en las dos materias del repositorio. En Criptografía, la vista «Parciales resueltos» son 19 enunciados con su resolución: un documento, con la misma necesidad de ancho que una página del wiki. En Probabilidad, el formulario general es exactamente el mismo caso.

Por qué no se resuelve en la materia. La hoja y su ajuste son del lector: viven en `PageFrame` y en `views/sheetWidth.ts`. Un bundle podría dibujar una caja parecida con su propio CSS, y sería otra caja —con otro ancho, otro comportamiento y sin la preferencia global compartida—, que es justamente lo que el contrato 00 no quiere: la plataforma decide cómo se ve lo común.

Qué trae la rama. `ToolView.frame` pasa a admitir `"sheet"`: la vista se dibuja dentro de la **misma hoja ajustable**, con las mismas asas y la misma preferencia de ancho, pero **sin** la línea de identidad ni la barra de la unidad. No depende del `?arg=`: se aplica siempre, porque no necesita saber en qué unidad está.

La hoja se extrae de `PageFrame` como un componente `Sheet` y `PageFrame` la sigue usando por dentro: no hay una segunda implementación del arrastre. El host marca `data-frame="sheet"` en el contenedor, igual que ya hace con `"page"`, para que el bundle sepa que la caja está dibujada y no la repita.

La prueba del contrato que fijaba «`page` es el único marco» pasa a fijar los dos, y sigue rechazando cualquier tercero. Dos pruebas nuevas en `ToolHost.test.tsx`: una vista con `frame: "sheet"` queda dentro de `[data-page-frame]` con sus asas, y una sin `frame` no dibuja hoja ninguna.

Una cosa que esta rama NO hace, y que corresponde: **declarar `frame: "sheet"` en las vistas de Probabilidad**. `subjects/proba/` es de otra materia y el contrato 00 me prohíbe tocarlo. El formulario general es el caso que el usuario nombró; queda a criterio del orquestador aplicarlo al mergear —es una línea en `subjects/proba/tools/proba-exercises/sinapsis.tools.json`— o dejarlo para el agente de esa materia.

TEXTO PARA LA FILA DE docs/DECISIONS.md

Qué se decide. `ToolView.frame` admite `"sheet"`, además de `"page"`: la vista se dibuja dentro de la hoja ajustable del lector, con su ancho arrastrable y su preferencia global, pero sin la línea de identidad ni la barra de la unidad, y sin depender de que el `?arg=` resuelva a un paso de progreso.

Por qué. `"page"` cubre la herramienta que ES un paso del recorrido; no cubre la que se lee como un documento y no está en ninguna unidad, que es el caso de los parciales viejos y del formulario general. Sin esto, cada materia terminaría dibujando su propia caja con su propio ancho, y la preferencia de lectura —que es global y del usuario, no de la materia— dejaría de valer dentro de las herramientas. Se extrajo la hoja de `PageFrame` en vez de duplicarla, así el arrastre sigue teniendo una sola implementación.

Costo de revertir. Bajo. Es un valor de enum opcional y un componente extraído: quitarlo devuelve las vistas al dibujo suelto, sin romper ningún manifiesto —una vista que declare `"sheet"` dejaría de validar, así que hay que sacarlo de los manifiestos que lo usen— ni ningún archivo del sitio.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `apps/web/src/features/subject/components/PageFrame.tsx` — modificado
- `apps/web/src/features/subject/tools/ToolHost.test.tsx` — modificado
- `apps/web/src/features/subject/tools/ToolHost.tsx` — modificado
- `docs/contracts/04-herramientas-y-figuras.md` — modificado
- `packages/contract/src/index.ts` — modificado
- `packages/contract/src/tools.test.ts` — modificado

**Contrato afectado: `packages/contract`.** Si esto cambia el esquema, necesita versión del contrato o campo opcional con default, tests, y una fila en `docs/DECISIONS.md`; si solo documenta o prueba una decisión ya tomada, alcanza con decir cuál (regla de `docs/PROPOSALS.md`).

## Compatibilidad

Valor nuevo en un enum opcional: ninguna vista publicada declara frame sheet, asi que Proba y Cripto se dibujan igual que hoy hasta que alguien lo pida. PageFrame no cambia de comportamiento y no sube ninguna version de formato.

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
apps/web typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck: Done
apps/web typecheck: Done
```

### `pnpm test` — OK

Conteos (esto es lo que el orquestador vuelve a obtener en la rama):

- `packages/contract`: 51 passed (51)
- `packages/runtime`: 181 passed (181)
- `packages/markdown`: 119 passed (119)
- `apps/web`: 710 passed (710)
- `packages/cli`: 57 passed (57)

Últimas líneas:

```
… (283 líneas anteriores)
apps/web test:    Start at  23:56:20
apps/web test:    Duration  8.71s (transform 2.69s, setup 0ms, collect 20.34s, tests 15.68s, environment 32.26s, prepare 5.24s)
apps/web test: Done
packages/cli test:  ✓ src/cli.test.ts (57 tests) 10670ms
packages/cli test:    ✓ sinapsis publish > compila la materia real de Proba y escribe un payload válido (--dry-run) 1392ms
packages/cli test:    ✓ sinapsis publish --no-pr > deja la materia en una rama nueva sin tocar el árbol ni la rama del usuario 881ms
packages/cli test:    ✓ sinapsis publish --no-pr > una segunda publicación sin cambios no crea ninguna rama 1017ms
packages/cli test:    ✓ sinapsis status > no reporta diferencias cuando el vault y lo publicado coinciden 780ms
packages/cli test:    ✓ sinapsis propose > crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main 755ms
packages/cli test:    ✓ sinapsis propose > falla si el árbol tiene cambios que --files no declara, y no toca git 361ms
packages/cli test:    ✓ sinapsis propose > corre los gates y no crea nada si fallan 395ms
packages/cli test:    ✓ sinapsis propose > si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15) 962ms
packages/cli test:    ✓ sinapsis propose > dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX 499ms
packages/cli test:    ✓ sinapsis propose > la fila entra en la tabla de abiertas, no al final de un INBOX con más secciones 310ms
packages/cli test:    ✓ sinapsis propose > recorta el título largo por el guion: la rama no termina en un muñón 302ms
packages/cli test:  Test Files  1 passed (1)
packages/cli test:       Tests  57 passed (57)
packages/cli test:    Start at  23:56:20
packages/cli test:    Duration  11.61s (transform 337ms, setup 0ms, collect 514ms, tests 10.67s, environment 0ms, prepare 152ms)
packages/cli test: Done
```

### `pnpm build` — OK

Últimas líneas:

```
… (175 líneas anteriores)
apps/web build: dist/assets/chunk-TICWLB2K-B6ETwjjO.js                 49.39 kB │ gzip:  15.66 kB │ map:   153.09 kB
apps/web build: dist/assets/flowDiagram-HODETNUW-1a9SsIfB.js           62.71 kB │ gzip:  19.83 kB │ map:   195.61 kB
apps/web build: dist/assets/c4Diagram-7LVT6UL2-Byc85pb6.js             65.65 kB │ gzip:  18.71 kB │ map:   192.69 kB
apps/web build: dist/assets/ganttDiagram-EL5Y4UJY-Cu9mk13L.js          69.79 kB │ gzip:  23.38 kB │ map:   249.92 kB
apps/web build: dist/assets/index-nwuZA-Bu.js                          74.57 kB │ gzip:  29.00 kB │ map:   334.10 kB
apps/web build: dist/assets/cose-bilkent-JH36ORCC-DrLjGYD6.js          81.81 kB │ gzip:  22.45 kB │ map:   305.64 kB
apps/web build: dist/assets/swimlanes-42K2YHIH-DycHA9Dz.js            117.21 kB │ gzip:  42.54 kB │ map:   547.57 kB
apps/web build: dist/assets/sequenceDiagram-WJ2MYXX4-GsEjYAbd.js      117.55 kB │ gzip:  31.08 kB │ map:   352.12 kB
apps/web build: dist/assets/architectureDiagram-5GKGNRK7-CWyyQgSv.js  152.12 kB │ gzip:  42.96 kB │ map:   602.43 kB
apps/web build: dist/assets/Markdown-EYeD67hm.js                      188.16 kB │ gzip:  58.31 kB │ map: 1,152.17 kB
apps/web build: dist/assets/cytoscape.esm-Bch-eiPH.js                 443.89 kB │ gzip: 141.82 kB │ map: 1,871.17 kB
apps/web build: dist/assets/mermaid.core-CyUYT6yi.js                  659.13 kB │ gzip: 158.99 kB │ map: 2,245.78 kB
apps/web build: dist/assets/cynefin-OW5HDTMX-D7S8WRbW.js              690.91 kB │ gzip: 154.63 kB │ map: 2,180.10 kB
apps/web build: dist/assets/index-C3PN_8Bh.js                         819.44 kB │ gzip: 255.11 kB │ map: 3,177.45 kB
apps/web build: ✓ built in 6.65s
apps/web build: (!) Some chunks are larger than 500 kB after minification. Consider:
apps/web build: - Using dynamic import() to code-split the application
apps/web build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
apps/web build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
apps/web build: Done
```

## Revisión

(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
