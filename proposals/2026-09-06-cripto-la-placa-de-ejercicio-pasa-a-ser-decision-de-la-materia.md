---
fecha: 2026-09-06
materia: cripto
titulo: "La placa de ejercicio pasa a ser decision de la materia"
rama: proposal/cripto-20260906-la-placa-de-ejercicio-pasa-a-ser-decision-de-la-materia
estado: abierta
pr: null
---

## Motivo

La placa de ejercicio se arma hoy para cualquier materia, y en las guías de Criptografía encaja una caja adentro de otra.

Qué pasa. Desde que la guía y su resolución viven en la misma página, cada ejercicio de Criptografía se escribe así: el enunciado en prosa bajo un `### Ejercicio N`, y la resolución en un aviso plegado `> [!nota]- Resolución del Ejercicio N`, cerrado, para poder intentar el ejercicio antes de ver la respuesta. El lector, además, envuelve todo eso en la placa de ejercicio (§ lector-05), que también es una caja con fondo, borde y sombra. Medido en la Guía 3: 6 placas, 8 avisos plegados y **22 elementos anidados** entre caja y caja. Se lee sucio y el pliegue —que es lo que la página quiere destacar— queda como una caja de tercer nivel adentro de otras dos.

Por qué no se resuelve en la materia. La placa la arma el lector a partir del texto del encabezado (`^ejercicio\b` en singular). Lo único que la materia podría hacer es dejar de llamar «Ejercicio N» a sus ejercicios, y eso rompe dos cosas a la vez: la legibilidad del enunciado y las **44 anclas** `[[guia-0N#Ejercicio 6]]` que otras páginas ya le apuntan.

Y no es que la placa esté mal: en Probabilidad es exactamente lo que hace legible una guía escrita como prosa continua, donde enunciado y resolución van seguidos sin más estructura que los encabezados. Son dos formas distintas de escribir una guía, y cada materia sabe cuál usa.

Qué se pide, y qué trae la rama. Un campo booleano `exercisePlates` en `SubjectConfig`, **opcional y con default `true`**: Probabilidad y cualquier materia que no lo declare siguen viendo la placa exactamente como hoy. Con `false`, «Ejercicio 1» es un encabezado más y el aviso plegado de la resolución queda como la única caja de la página.

La bandera no toca el markdown ni los ids de encabezado: las anclas resuelven igual con placa y sin ella. Hay un test que fija las dos ramas.

TEXTO PARA LA FILA DE docs/DECISIONS.md

Qué se decide. Armar la placa de ejercicio pasa a ser una decisión de la materia, no de la plataforma: `SubjectConfig.exercisePlates`, opcional y con default `true`. Con `false`, el lector no envuelve los encabezados de ejercicio y la materia se hace cargo de su propia estructura.

Por qué. La placa resuelve un problema real —una guía escrita como prosa continua, donde el enunciado se confunde con la resolución y con el ejercicio anterior— pero supone esa forma de escribir. Una guía que ya separa enunciado y resolución con un aviso plegable no tiene ese problema y sí gana una caja adentro de otra. Es la misma línea del contrato 00: la plataforma decide cómo se ve lo común, y lo que depende de cómo escribe cada materia se declara en su config. Se eligió un booleano y no una heurística —«no armar la placa si adentro hay un aviso plegado»— porque una heurística cambia el dibujo de una página según lo que alguien escriba adentro, y eso es más difícil de predecir que una bandera.

Costo de revertir. Bajo. Es un campo opcional con default: quitarlo devuelve la placa a todas las materias, sin romper ningún config publicado —los que declaren `exercisePlates` quedan con un campo que el esquema ignora— ni ningún archivo del sitio. Nada del estado personal depende de esto.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `apps/web/src/features/subject/markdown/Markdown.tsx` — modificado
- `apps/web/src/features/subject/markdown/rehypeExercisePlates.test.tsx` — modificado
- `apps/web/src/features/subject/views/ReaderView.tsx` — modificado
- `apps/web/src/local/landing.ts` — modificado
- `docs/contracts/01-materia.md` — modificado
- `packages/contract/src/config.test.ts` — modificado
- `packages/contract/src/index.ts` — modificado

**Contrato afectado: `packages/contract`.** Si esto cambia el esquema, necesita versión del contrato o campo opcional con default, tests, y una fila en `docs/DECISIONS.md`; si solo documenta o prueba una decisión ya tomada, alcanza con decir cuál (regla de `docs/PROPOSALS.md`).

## Compatibilidad

Campo opcional con default true: Proba y cualquier config ya publicado se comportan exactamente igual, sin tocar nada. No sube ninguna version de formato. La bandera solo cambia si el lector envuelve los encabezados de ejercicio; no toca el markdown, ni los ids de encabezado, ni las anclas.

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
- `packages/markdown`: 119 passed (119)
- `packages/runtime`: 178 passed (178)
- `apps/web`: 708 passed (708)
- `packages/cli`: 57 passed (57)

Últimas líneas:

```
… (279 líneas anteriores)
apps/web test:  ✓ src/features/subject/components/rail-fit.test.ts (3 tests) 1ms
apps/web test:  Test Files  58 passed (58)
apps/web test:       Tests  708 passed (708)
apps/web test:    Start at  22:32:01
apps/web test:    Duration  7.60s (transform 2.02s, setup 0ms, collect 17.64s, tests 12.68s, environment 28.29s, prepare 4.69s)
apps/web test: Done
packages/cli test:  ✓ src/cli.test.ts (57 tests) 9577ms
packages/cli test:    ✓ sinapsis publish > compila la materia real de Proba y escribe un payload válido (--dry-run) 1159ms
packages/cli test:    ✓ sinapsis publish --no-pr > deja la materia en una rama nueva sin tocar el árbol ni la rama del usuario 856ms
packages/cli test:    ✓ sinapsis publish --no-pr > una segunda publicación sin cambios no crea ninguna rama 1170ms
packages/cli test:    ✓ sinapsis status > no reporta diferencias cuando el vault y lo publicado coinciden 857ms
packages/cli test:    ✓ sinapsis propose > crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main 462ms
packages/cli test:    ✓ sinapsis propose > corre los gates y no crea nada si fallan 357ms
packages/cli test:    ✓ sinapsis propose > si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15) 943ms
packages/cli test:    ✓ sinapsis propose > dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX 438ms
packages/cli test:  Test Files  1 passed (1)
packages/cli test:       Tests  57 passed (57)
packages/cli test:    Start at  22:32:01
packages/cli test:    Duration  10.47s (transform 343ms, setup 0ms, collect 526ms, tests 9.58s, environment 0ms, prepare 151ms)
packages/cli test: Done
```

### `pnpm build` — OK

Últimas líneas:

```
… (175 líneas anteriores)
apps/web build: dist/assets/blockDiagram-I7D4REHJ-B3-IZfPT.js          43.25 kB │ gzip:  13.84 kB │ map:   138.72 kB
apps/web build: dist/assets/xychartDiagram-S5SC5T6Z-CHhqYVrA.js        44.60 kB │ gzip:  12.57 kB │ map:   147.77 kB
apps/web build: dist/assets/GraphView-B9aPCM0n.js                      45.16 kB │ gzip:  16.21 kB │ map:   182.98 kB
apps/web build: dist/assets/markdown-DAiFXyjU.js                       47.20 kB │ gzip:  15.21 kB │ map:   156.11 kB
apps/web build: dist/assets/chunk-TICWLB2K-C5mNKE5E.js                 49.39 kB │ gzip:  15.65 kB │ map:   153.09 kB
apps/web build: dist/assets/flowDiagram-HODETNUW-D1-FfKhU.js           62.71 kB │ gzip:  19.83 kB │ map:   195.61 kB
apps/web build: dist/assets/c4Diagram-7LVT6UL2-Rw-ZU-y6.js             65.65 kB │ gzip:  18.71 kB │ map:   192.69 kB
apps/web build: dist/assets/ganttDiagram-EL5Y4UJY-CRXD3z5q.js          69.79 kB │ gzip:  23.38 kB │ map:   249.92 kB
apps/web build: dist/assets/index-DKH6Givz.js                          74.53 kB │ gzip:  28.98 kB │ map:   333.47 kB
apps/web build: dist/assets/cose-bilkent-JH36ORCC-SOuV8sDS.js          81.81 kB │ gzip:  22.45 kB │ map:   305.64 kB
apps/web build: dist/assets/swimlanes-42K2YHIH-D3PlIp00.js            117.21 kB │ gzip:  42.54 kB │ map:   547.57 kB
apps/web build: dist/assets/sequenceDiagram-WJ2MYXX4-BghUFQMD.js      117.55 kB │ gzip:  31.08 kB │ map:   352.12 kB
apps/web build: dist/assets/architectureDiagram-5GKGNRK7-D3F67bBR.js  152.12 kB │ gzip:  42.96 kB │ map:   602.43 kB
apps/web build: dist/assets/Markdown-BozALFqb.js                      188.16 kB │ gzip:  58.31 kB │ map: 1,152.17 kB
apps/web build: dist/assets/cytoscape.esm-Bch-eiPH.js                 443.89 kB │ gzip: 141.82 kB │ map: 1,871.17 kB
apps/web build: dist/assets/mermaid.core-D3tAQDDu.js                  659.13 kB │ gzip: 159.00 kB │ map: 2,245.78 kB
apps/web build: dist/assets/cynefin-OW5HDTMX-DFse_mup.js              690.91 kB │ gzip: 154.63 kB │ map: 2,180.10 kB
apps/web build: dist/assets/index-28H68MZJ.js                         819.43 kB │ gzip: 255.10 kB │ map: 3,177.02 kB
apps/web build: ✓ built in 5.44s
apps/web build: Done
```

## Revisión

(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
