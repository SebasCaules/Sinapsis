---
fecha: 2026-09-06
materia: cripto
titulo: "El runtime lee la ruta aunque el sitio cuelgue de un base"
rama: proposal/cripto-20260906-el-runtime-lee-la-ruta-aunque-el-sitio-cuelgue-de-un-base
estado: abierta
pr: https://github.com/SebasCaules/Sinapsis/pull/11
---

## Motivo

En producción, una herramienta que navega cambiando solo la consulta no se vuelve a dibujar.

Qué pasa. La vista «Parciales resueltos» de Criptografía tiene dos botones, «Por tipo» y «Por parcial», que son enlaces a `#/parciales` y `#/parciales?orden=parcial`. En desarrollo funcionan. En el sitio publicado, el clic cambia la URL —se ve `?orden=parcial` en la barra— y la vista **no se redibuja**: sigue mostrando el agrupamiento anterior. Cargando esa misma URL a mano sí agrupa bien, así que el bundle lee su estado correctamente: lo que no ocurre es el redibujo.

Dónde está. `App.go` decide si hay que redibujar con `isQueryOnlyChange` (`packages/runtime/src/compat.ts`), que compara la ruta actual con la de destino usando `parseLocation`. Y `parseLocation` descuenta el prefijo de la materia **solo si el pathname empieza con él**:

```
if (subject && (path === prefix || path.startsWith(prefix + "/"))) path = path.slice(prefix.length);
```

En GitHub Pages el sitio cuelga de un base (N0-59) y el pathname real es `/Sinapsis/m/cripto/t/parciales`, que no empieza con `/m/cripto`. No se descuenta nada, la ruta se lee como la vista **«Sinapsis»** con argumento vacío, las dos rutas comparadas dan lo mismo y el redibujo no se pide nunca.

El mismo `parseLocation` alimenta `App.parseRoute()`, que en producción devuelve la vista equivocada por la misma razón. Cualquier bundle que lo use para leer su estado lo sufre.

Por qué no lo agarró nadie hasta ahora. En desarrollo el base es `/` y el pathname sí empieza con el prefijo, así que todo anda. Y las pruebas de `packages/runtime/test/primitives.test.ts` pasan rutas sin base, que es el caso que funciona. Es un bug que solo existe en producción.

Por qué no se resuelve en la materia. Es `packages/runtime`: el bundle no puede arreglarlo. Lo más que podría hacer es llamar `App.render()` a mano después de cada navegación, que es tratar el síntoma y deja el problema para la próxima materia que use `App.go` o `App.parseRoute`.

Qué trae la rama. `parseLocation` busca el prefijo de la materia **como segmento completo** en vez de exigir que empiece ahí, así que descuenta el base cualquiera sea, y de cualquier profundidad. Tres pruebas nuevas: la ruta con base, `isQueryOnlyChange` con base —el caso exacto que falla en producción— y un prefijo que NO es un segmento completo (`/m/probabilidad` no es `/m/proba`), para que la búsqueda no se vuelva laxa de más.

TEXTO PARA LA FILA DE docs/DECISIONS.md

Qué se decide. `parseLocation` del runtime descuenta el prefijo de la materia buscándolo como segmento completo del pathname, no exigiendo que sea su comienzo. Con eso `App.go` y `App.parseRoute` leen la misma ruta en desarrollo y en el sitio publicado, que cuelga de un base.

Por qué. Era un bug que solo se veía en producción y que rompía en silencio: la URL cambiaba, la vista no. Se eligió buscar el segmento en vez de pasarle el base al runtime porque el runtime no tiene forma de conocerlo sin una API nueva que todos los anfitriones tendrían que llenar, y porque el prefijo de una materia —`/m/<slug>`— es único y no ambiguo dentro de un pathname.

Costo de revertir. Bajo: es una condición en una función pura, con sus pruebas. Revertir devuelve el bug de producción tal como estaba.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `docs/contracts/04-herramientas-y-figuras.md` — modificado
- `packages/runtime/src/compat.ts` — modificado
- `packages/runtime/test/primitives.test.ts` — modificado

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Arregla, no cambia: en desarrollo el pathname ya empezaba con el prefijo y el resultado es identico. Proba gana lo mismo que Cripto, porque sus bundles usan App.go y App.parseRoute. No toca ningun esquema ni ninguna version de formato, y la funcion sigue siendo pura.

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
- `packages/runtime`: 181 passed (181)
- `apps/web`: 708 passed (708)
- `packages/cli`: 57 passed (57)

Últimas líneas:

```
… (280 líneas anteriores)
apps/web test:  Test Files  58 passed (58)
apps/web test:       Tests  708 passed (708)
apps/web test:    Start at  23:39:16
apps/web test:    Duration  8.69s (transform 2.38s, setup 0ms, collect 20.63s, tests 14.73s, environment 33.15s, prepare 5.46s)
apps/web test: Done
packages/cli test:  ✓ src/cli.test.ts (57 tests) 10627ms
packages/cli test:    ✓ sinapsis publish > compila la materia real de Proba y escribe un payload válido (--dry-run) 1316ms
packages/cli test:    ✓ sinapsis publish --no-pr > deja la materia en una rama nueva sin tocar el árbol ni la rama del usuario 861ms
packages/cli test:    ✓ sinapsis publish --no-pr > una segunda publicación sin cambios no crea ninguna rama 1118ms
packages/cli test:    ✓ sinapsis status > no reporta diferencias cuando el vault y lo publicado coinciden 682ms
packages/cli test:    ✓ sinapsis propose > crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main 689ms
packages/cli test:    ✓ sinapsis propose > falla si el árbol tiene cambios que --files no declara, y no toca git 347ms
packages/cli test:    ✓ sinapsis propose > corre los gates y no crea nada si fallan 369ms
packages/cli test:    ✓ sinapsis propose > si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15) 1027ms
packages/cli test:    ✓ sinapsis propose > dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX 512ms
packages/cli test:  Test Files  1 passed (1)
packages/cli test:       Tests  57 passed (57)
packages/cli test:    Start at  23:39:16
packages/cli test:    Duration  11.46s (transform 300ms, setup 0ms, collect 455ms, tests 10.63s, environment 0ms, prepare 98ms)
packages/cli test: Done
```

## Revisión

(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
