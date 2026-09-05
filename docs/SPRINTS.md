# Sprints

Cada sprint se cierra de punta a punta (código + tests + verificación visual + docs) y el
usuario lo revisa antes de habilitar el siguiente.

## Sprint 1 — MVP (en ejecución, 2026-09-05)

Objetivo: una materia real (Probabilidad y Estadística) sincronizada desde su wiki y
navegable dentro del shell estándar, más la landing que organiza las materias por
cuatrimestre, con login de Google.

### Unidades de trabajo

| # | Unidad | Paquete | Done-test |
|---|---|---|---|
| S1-01 | Contrato (`@sinapsis/contract`): zod + helpers | packages/contract | `pnpm --filter @sinapsis/contract test` verde; el config de Proba valida. |
| S1-02 | Compilador markdown (`@sinapsis/markdown`): frontmatter, wikilinks, headings, orden | packages/markdown | Tests con fixtures; compilar el wiki de Proba produce 200 páginas con los mismos slugs que `build.py`. |
| S1-03 | API: esquema Drizzle + migraciones + auth (Google + dev) + sesiones | apps/api | `pnpm --filter @sinapsis/api test`; `/api/me` 401 sin cookie, 200 con sesión. |
| S1-04 | API: sync, subjects, landing layout, pages, search (FTS5), progress | apps/api | Tests de integración sobre DB temporal; sync de Proba ≥ 190 páginas. |
| S1-05 | CLI `sinapsis` (init/sync/status) | packages/cli | `sinapsis sync --config examples/proba/sinapsis.config.json` termina 0 y el API responde con el conteo. |
| S1-06 | Skill `/sinapsis` (init, sync, status) | .claude/skills/sinapsis | SKILL.md con contrato, pasos y comandos; validado leyendo el config de Proba. |
| S1-07 | Web: base (Vite, router, tokens CSS, fuentes, tema, cliente API, auth guard, login) | apps/web | `pnpm --filter @sinapsis/web typecheck` + `build` verdes; login dev navega a la landing. |
| S1-08 | Web: landing (grilla, tarjetas, gestión, diálogo, vacía, menú de avatar) | apps/web/src/features/landing | Playwright: agregar materia → aparece en el cuatrimestre; mover; quitar con confirmación. |
| S1-09 | Web: shell de materia (rail FIJO+SLOT, índice, cabecera, migas, plegado) | apps/web/src/features/subject | Playwright: medidas 52/250/40/28; rail con grupos de Proba; índice con 12 divisiones. |
| S1-10 | Web: Inicio de materia (progreso, por dónde empezar, repaso) | apps/web/src/features/subject/home | Playwright: contadores coinciden con el API. |
| S1-11 | Web: Lector (markdown, KaTeX, wikilinks, callouts, TOC, fuentes, backlinks, marcar estudiado, anterior/siguiente) | apps/web/src/features/subject/reader | Playwright: abrir `distribucion-normal`, fórmula renderizada, wikilink navega, marcar estudiado persiste tras recargar. |
| S1-12 | Web: catálogo "Todo el wiki" + búsqueda ⌘K | apps/web/src/features/subject/catalog | Playwright: filtro por división y tipo; búsqueda "normal" devuelve la página. |
| S1-13 | E2E + smoke visual (3 temas × landing/inicio/lector) | e2e/ | `pnpm e2e` verde; capturas en `e2e/shots/`. |
| S1-14 | Auditoría final (code-review, security-review, ux-review, simplify) + fixes | — | Cero hallazgos altos abiertos. |
| S1-15 | Docs: README (setup, Google Client ID, sync), CONTRACT.md, DECISIONS.md, HANDOFF | docs/ | Un usuario nuevo levanta todo con los comandos del README. |

### Fuera de alcance (Sprint 2+)
Pestañas múltiples estilo Obsidian, grafo de conexiones, flashcards/quiz/SRS, plan de estudio y
kits, figuras interactivas, herramientas React por materia (plugins), tokens de sync por usuario,
deploy (Dockerfile + Turso), modo móvil completo.

## Sprint 2 — Estudio (propuesto)
Grafo, flashcards + SRS, quiz, plan/kits desde `study-data`, favoritos y apuntes, pestañas.

## Sprint 3 — Herramientas por materia (propuesto)
Sistema de plugins: cada materia publica un bundle React registrado en `rail[].items[kind=tool]`;
sandbox de carga; contrato de props (`App.registerView` del baseline como referencia).

## Sprint 4 — Deploy (propuesto)
Dockerfile, Turso/libSQL remoto, dominio, Google OAuth de producción, backups.
