# El contrato Sinapsis ↔ materia — índice

Sinapsis es una plataforma que envuelve wikis markdown de varias materias en un shell común.
Todo lo que pasa entre la plataforma y una materia está definido por un contrato, y todos los
contratos están en **`docs/contracts/`**. Este archivo es el índice y el punto de entrada
(decisión N0-45).

La fuente de verdad **ejecutable** es `packages/contract` (esquemas zod). Donde un documento y
un esquema discrepen, gana el esquema y el documento es un bug.

---

## Los contratos

| # | Contrato | Archivo | Fuente ejecutable | Decisiones | Última revisión |
|---|---|---|---|---|---|
| 00 | **Principios** — roles, qué es contrato, versionado, compatibilidad, conflictos, qué pasa al violarlo | [`contracts/00-principios.md`](contracts/00-principios.md) | `packages/contract/src/index.ts` · `packages/contract/src/runtime.ts` · `apps/api/src/app.ts` | N0-1, N0-6, N0-7, N0-11, N0-13, N0-22, N0-23, N0-44, N0-45 | 2026-09-06 |
| 01 | **La materia** — `sinapsis.config.json`: campos, límites, rail, `wiki` | [`contracts/01-materia.md`](contracts/01-materia.md) | `packages/contract/src/index.ts` (`SubjectConfig`) · `packages/cli/src/commands/validate.ts` | N0-6, N0-11, N0-12, N0-14, N0-23, N0-27, N0-32 | 2026-09-06 |
| 02 | **Las páginas** — wiki markdown → `Page`: frontmatter, slugs, wikilinks, encabezados, callouts, matemática | [`contracts/02-paginas.md`](contracts/02-paginas.md) | `packages/markdown/src/{compile,frontmatter,inline}.ts` · `packages/contract/src/index.ts` (`Page`, `headingId`) | N0-10, N0-13, N0-21, N0-22, N0-23, N0-42, N0-47 | 2026-09-06 |
| 03 | **El estudio** — `StudyContent`: mazos, quizzes, `plan.json` (+`tracks`), `kits.json`, SRS, `StudyState` | [`contracts/03-estudio.md`](contracts/03-estudio.md) | `packages/markdown/src/study.ts` · `packages/contract/src/index.ts` (`StudyContent`, `sm2`) · `apps/api/src/services/study.ts` | N0-27, N0-28, N0-33, N0-37, N0-43 | 2026-09-06 |
| 04 | **Herramientas y figuras** — `sinapsis.tools.json`, bundles, `CompatApp`, `SinapsisRuntime`, figuras | [`contracts/04-herramientas-y-figuras.md`](contracts/04-herramientas-y-figuras.md) | `packages/contract/src/runtime.ts` · `packages/runtime/src/` · `packages/cli/src/tools/bundle.ts` · `apps/api/src/{routes,services}/tools.ts` | N0-11, N0-40, N0-41, N0-42 | 2026-09-06 |
| 05 | **Sync y API** — `SyncPayload`, autenticación, todas las rutas, errores, idempotencia | [`contracts/05-sync-y-api.md`](contracts/05-sync-y-api.md) | `apps/api/src/routes/` · `apps/api/src/services/sync.ts` · `apps/api/src/auth/sync-token.ts` · `apps/api/.env.example` | N0-2, N0-3, N0-4, N0-5, N0-6, N0-7, N0-9, N0-17, N0-32 | 2026-09-06 |
| 06 | **Skill y agentes** — el CLI, `/sinapsis`, qué puede tocar un agente de materia, checklist | [`contracts/06-skill-y-agentes.md`](contracts/06-skill-y-agentes.md) | `skills/sinapsis/SKILL.md` · `packages/cli/src/cli.ts` · `packages/cli/src/commands/` | N0-5, N0-7, N0-13, N0-27, N0-40 | 2026-09-06 |
| 07 | **Propuestas** — cómo se cambia la plataforma: rama, gates, siete lentes, estados, merge | [`contracts/07-propuestas.md`](contracts/07-propuestas.md) | `packages/cli/src/commands/propose.ts` · `skills/sinapsis-review/SKILL.md` · `docs/PROPOSALS.md` · `proposals/` | N0-44, N0-45 | 2026-09-06 |

**Por dónde empezar.** Un agente de materia que ve el contrato por primera vez: 00 → 01 → 02
→ 03, y 04 solo si la materia tiene herramientas. Quien integra contra el API: 05. Quien
necesita cambiar algo de la plataforma: 07.

---

## Los principios, en diez líneas

1. La materia produce datos y herramientas; la plataforma decide cómo se ven.
2. Todo lo común se cambia por propuesta revisada, nunca por parche.
3. Cada regla tiene un dueño único y todos los demás la importan.
4. El contenido nunca rompe un sync: los problemas de contenido son advertencias.
5. Lo que viene de una materia es dato ajeno: se valida en el borde, siempre.
6. Ninguna ruta declarada por una materia puede salir de su carpeta.
7. Los ids son estado del usuario: cambiarlos le borra el progreso.
8. Un campo nuevo nace opcional y con default.
9. El sync reemplaza: lo que no viene, se borra (salvo el estado del usuario).
10. La fuente de verdad es el esquema zod; los documentos lo explican.

El desarrollo de cada uno, con los roles, el versionado y qué pasa cuando algo viola el
contrato, está en [`contracts/00-principios.md`](contracts/00-principios.md).

---

## Cómo cambiar un contrato

1. **Comprobar que hace falta.** Si se resuelve con el `sinapsis.config.json`, con un bundle
   propio o cambiando el wiki, no es un cambio de contrato: es trabajo de la materia.
2. **Elegir la forma compatible.** Un campo nuevo nace **opcional y con default**; un valor
   nuevo se agrega a un enum de salida; un límite se amplía, no se restringe. Lo incompatible
   —quitar, renombrar, endurecer, cambiar la semántica— sube `contract` a la versión
   siguiente y convive con la anterior durante una transición.
3. **Implementarlo en el repositorio de la plataforma**, mínimo y coherente: un cambio por
   propuesta, con sus tests en `packages/contract`.
4. **Proponer** desde la materia:

   ```bash
   pnpm --dir "$SINAPSIS_HOME" sinapsis -- propose \
     --subject <slug> --title "<qué se propone>" --body "<por qué hace falta>"
   ```

   El CLI corre los gates antes de tocar git, crea la rama
   `proposal/<materia>-<AAAAMMDD>-<titulo>`, escribe `proposals/<fecha>-<materia>-<titulo>.md`
   y deja la fila en `proposals/INBOX.md` de `main`.
5. **Revisar**, del lado de la plataforma: `/sinapsis-review` corre los gates en un worktree
   de la rama, pasa el diff por las siete lentes (corrección, seguridad, contratos,
   compatibilidad entre materias, alcance, duplicación, idioma) y decide: aprobar
   (`git merge --no-ff`), pedir cambios o rechazar. **Sin revisión no hay merge.**
6. **Registrar**: una fila `N0-nn` en [`DECISIONS.md`](DECISIONS.md) si el cambio decide algo
   nuevo, el veredicto en la propuesta, y la fila del INBOX a «Cerradas».
7. **Actualizar este contrato**: el archivo de `docs/contracts/` que corresponda y la fecha de
   «última revisión» de su fila. Un cambio que solo toca documentación va con `--skip-gates`.
8. **Avisar a las materias** qué tienen que hacer. Casi siempre alcanza con `sinapsis sync`.

El flujo completo, desde los dos lados, está en
[`contracts/07-propuestas.md`](contracts/07-propuestas.md).

---

## Alrededor

- [`DECISIONS.md`](DECISIONS.md) — las decisiones de arquitectura `N0-1 … N0-47`, con su
  porqué y su costo de revertir. Cada regla de estos contratos cita la suya.
- [`PROPOSALS.md`](PROPOSALS.md) — el contrato de propuestas en prosa corta (N0-44).
- [`SPRINTS.md`](SPRINTS.md) — el plan por sprints.
- [`HANDOFF-sprint1.md`](HANDOFF-sprint1.md) · [`HANDOFF-sprint2.md`](HANDOFF-sprint2.md) —
  qué se entregó en cada sprint.
- [`../README.md`](../README.md) — puesta en marcha del monorepo.
- `skills/sinapsis/reference/` — las mismas reglas, empaquetadas para el agente de una
  materia (`contrato.md`, `config-ejemplo.md`, `herramientas.md`).
