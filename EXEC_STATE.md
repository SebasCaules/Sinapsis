# EXEC_STATE — Sprint 1 (MVP)

Ejecución autónoma iniciada el 2026-09-05. Orquestador: sesión principal (Fable 5.1).
Workers y verificadores de ola: Opus 5. Auditoría final: modelo N0.

## Fase 0 — Reconciliación

- Diseño importado desde Claude Design (`design/export/*.dc.html`), baseline de Proba leído
  (`design/referencias/BRIEF-baseline-proba.md`), no existía código previo.
- Gaps detectados y cerrados antes de la ola 1:
  - G-01 El mockup deja pendiente "tema global o por materia" → decisión N0-8 (global).
  - G-02 El mockup no define cómo se autentica el CLI de sync → N0-7 (token estático).
  - G-03 Los `kind` de ítems del rail no estaban en el mockup → N0-11.
  - G-04 Proba usa `unidad:` como campo de división → `wiki.divisionField` en el config.
- Contratos escritos por el orquestador: `packages/contract/src/index.ts`,
  `docs/CONTRACT.md`, `docs/DECISIONS.md`, `docs/SPRINTS.md`, `examples/proba/sinapsis.config.json`.

## Pasos

| paso | estado | commit | notas |
|---|---|---|---|
| F0 Reconciliación + contratos | DONE | — | |
| S1-01 contract | DOING | | zod + helpers escritos; faltan tests (ola 1, agente B) |
| S1-02 markdown | TODO | | ola 1 · agente B |
| S1-03 api auth/db | TODO | | ola 1 · agente A |
| S1-04 api sync/pages/search | TODO | | ola 1 · agente A |
| S1-05 cli | TODO | | ola 1 · agente B |
| S1-06 skill /sinapsis | TODO | | ola 1 · agente B |
| S1-07 web base | TODO | | ola 1 · agente C |
| S1-08 web landing | TODO | | ola 1 · agente C |
| S1-09 web shell materia | TODO | | ola 1 · agente D |
| S1-10 web inicio | TODO | | ola 1 · agente D |
| S1-11 web lector | TODO | | ola 1 · agente D |
| S1-12 web catálogo + búsqueda | TODO | | ola 1 · agente D |
| S1-13 e2e + smoke visual | TODO | | ola 2 |
| S1-14 auditoría final | TODO | | ola 3 |
| S1-15 docs | TODO | | ola 3 |

## Ownership de archivos (ola 1)

| Agente | Carpetas exclusivas |
|---|---|
| A (api) | `apps/api/**` |
| B (contenido) | `packages/markdown/**`, `packages/cli/**`, `packages/contract/src/*.test.ts`, `.claude/skills/sinapsis/**`, `examples/**` |
| C (web base + landing) | `apps/web/**` salvo `src/features/subject/**` y `src/app/router.tsx` |
| D (web materia) | `apps/web/src/features/subject/**` |
| Orquestador | `packages/contract/src/index.ts`, `apps/web/src/app/router.tsx`, `apps/web/src/lib/api.ts` (firmas), raíz del repo, docs |

## Decisiones N0-n

Ver `docs/DECISIONS.md` (N0-1 … N0-19).

## Fixes sugeridos (S-nn)

| # | fix | superficie | origen | cuándo |
|---|---|---|---|---|
| — | | | | |

## Veredicto final

Pendiente.
