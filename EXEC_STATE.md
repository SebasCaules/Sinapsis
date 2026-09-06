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
| F0 Reconciliación + contratos | DONE | 5a39786 | |
| S1-01 contract | DONE | ola1 | 11 tests; SubjectConfigLoose y PageLink.slug libre por pedido del API |
| S1-02 markdown | DONE | ola1 | paridad exacta con build.py (209 páginas), 46 tests |
| S1-03 api auth/db | DONE | ola1 | Hono + Drizzle + libsql; 58 tests en total con S1-04 |
| S1-04 api sync/pages/search | DONE | ola1 | sync Proba ~89 ms; FTS5 + scorer propio (A-2) |
| S1-05 cli | DONE | ola1 | init/validate/sync/status; sync real contra API verificado por el orquestador |
| S1-06 skill /sinapsis | DONE | ola1 | skills/sinapsis + symlink .claude/skills/sinapsis |
| S1-07 web base | DONE | ola1 | store, auth, login GIS+dev, componentes de plataforma |
| S1-08 web landing | DONE | ola1 | grilla, gestión con dnd-kit, diálogo, vacía; 39 tests web (C+D) |
| S1-09 web shell materia | DONE | ola1 | medidas 52/250/40/28/840/248 verificadas en DOM |
| S1-10 web inicio | DONE | ola1 | progreso real 0/97 → 1/97 tras marcar |
| S1-11 web lector | DONE | ola1 | 147 nodos KaTeX, 28 wikilinks, callout; H1 duplicado corregido por el orquestador |
| S1-12 web catálogo + búsqueda | DONE | ola1 | filtros en URL, paleta ⌘K |
| S1-13 e2e + smoke visual | DOING | | agente E (Playwright) + smoke manual del orquestador sobre stack real |
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
| S-01 | El sync del API avisa «tipo meta no declarado» para indice/log; el compilador ya reserva `meta` (B-3). Alinear el API. | apps/api/src/services/sync.ts | verificación del orquestador | antes del cierre |
| S-02 | `packages/contract` se consume como .ts crudo; `node dist` del API depende del type stripping de Node ≥ 22.18 (A pendiente). Dar build al contract o bundlear el API. | packages/contract, apps/api | reporte A | Sprint 4 (deploy) |
| S-03 | Un cuatrimestre creado en la landing sin materias desaparece al guardar y el orden de cuatrimestres no es persistible: `LandingLayoutInput` no transporta `semesters`. Evaluar `semesters: string[]` en API + web. | contract, apps/api, apps/web landing | reporte C (contractRequest 2) | auditoría final |
| S-04 | Ids de encabezado: el compilador usa el slugify de build.py y el lector `rehype-slug` (github-slugger); coinciden en la práctica pero no por contrato. Unificar en github-slugger. | packages/markdown, apps/web reader | reporte D | Sprint 2 |
| S-05 | Guard CSRF: el `Origin` del dev server (:5173) no coincidía con el `Host` del API (:3000) vía proxy → 403 «Origen no permitido» en todo login. Corregido: `ALLOWED_ORIGINS` + `x-forwarded-host` + proxy sin `changeOrigin`. | apps/api csrf, apps/web vite.config | smoke del orquestador | HECHO |

## Veredicto final

Pendiente.
