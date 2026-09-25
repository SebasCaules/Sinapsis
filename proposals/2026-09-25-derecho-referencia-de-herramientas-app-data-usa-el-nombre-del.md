---
fecha: 2026-09-25
materia: derecho
titulo: "Referencia de herramientas: App.DATA usa el nombre del archivo sin extensión"
rama: proposal/derecho-20260925-referencia-de-herramientas-app-data-usa-el-nombre-del
estado: aprobada
pr: https://github.com/SebasCaules/Sinapsis/pull/34
---

## Motivo

La referencia de la skill (skills/sinapsis/reference/herramientas.md, línea 48) decía que un archivo declarado en data queda en App.DATA["data/datos.json"]. El runtime lo guarda con dataKey() de packages/runtime/src/loader.ts: nombre sin carpeta ni extensión (App.DATA["datos"]), como ya dice el contrato canónico docs/contracts/04-herramientas-y-figuras.md (líneas 53, 266 y 745). Al portar las herramientas de la materia derecho siguiendo la skill, las tres vistas leían App.DATA["data/kit.json"] y se dibujaban vacías; se detectó recién en la vista previa local. El arreglo alinea la referencia con el runtime y con el contrato, y agrega una línea explícita en la sección de datos para que el agente de materia no vuelva a caer en el error.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `skills/sinapsis/reference/herramientas.md` — modificado

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Solo documentación: no cambia el contrato, el runtime ni ninguna materia publicada. Los bundles que ya leen App.DATA por nombre sin extensión siguen igual.

## Gates

Omitidos con `--skip-gates`: la propuesta no cambia código ejecutable.

## Revisión

**Veredicto:** aprobada
**Revisó:** orquestador de la plataforma · 2026-09-25
**Commit de merge:** `a106382`

### Gates en la rama

La propuesta los omitió con `--skip-gates`, y corresponde: el diff solo toca
`skills/sinapsis/reference/herramientas.md` y este archivo, ningún código ejecutable. Igual
se corrieron en un worktree aparte, sobre `main` con esta rama y los PR de materia #33
(derecho) y #35 (bdii) mergeados encima:

- `pnpm typecheck`: OK
- `pnpm test`: OK — `packages/contract` 52, `packages/markdown` 119, `packages/runtime` 181,
  `apps/web` 726, `packages/cli` 57 (+2 salteadas).
- `pnpm build`: no corresponde por el diff; `build:subjects` y el build de la web con
  `VITE_BASE=/Sinapsis/` pasaron igual.
- `pnpm e2e`: no corresponde por el diff; se corrió igual por las materias nuevas, sobre el mismo árbol combinado: 94 pasadas, 3 salteadas y 1 falla ajena a esta rama. `e2e/tests/exercises.spec.ts:30` espera «289 ejercicios resueltos» del bundle de proba y el que se publicó en #32 trae 429; falla igual en `main` (`e096523`) sin esta rama ni los PR de materia.

### Hallazgos

Sin hallazgos. Se buscó:

- que la afirmación sea cierta: `dataKey()` (`packages/runtime/src/loader.ts:73`) quita la
  carpeta, la extensión y lo que siga a `?` o `#`, y el contrato 04 dice lo mismo en las
  líneas 53, 266 y 745;
- otra copia del error: `App.DATA["data/…"]` no aparece en ningún otro documento, y
  `.claude/skills/sinapsis` y `~/.claude/skills/sinapsis` son enlaces a `skills/sinapsis`,
  no copias que haya que igualar;
- una decisión nueva: no la hay. La regla ya estaba en el contrato 04, así que no abre fila
  en `docs/DECISIONS.md`.

Arreglo trivial al mergear: el frontmatter decía `pr: null` (defecto conocido de `propose`);
se completó con el enlace al PR.

### Efecto en las materias

- Ninguna tiene que volver a publicar: el runtime no cambia.
- **derecho** y **bdii** leen su dato con la clave correcta y dejan la vieja como respaldo
  (`A.DATA.kit || A.DATA["data/kit.json"]`, `App.DATA["aggregation"] ||
  App.DATA["data/aggregation.json"]`). Funciona; el respaldo y el comentario de cabecera de
  `tools/derecho-final/simulacros.js:17`, que todavía cita la forma vieja, se pueden quitar en
  la próxima publicación.
