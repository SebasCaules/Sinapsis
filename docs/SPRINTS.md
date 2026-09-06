# Sprints

Cada sprint se cierra de punta a punta (código + tests + verificación visual + docs) y el
usuario lo revisa antes de habilitar el siguiente.

## Sprint 1 — MVP (cerrado el 2026-09-06, pendiente de revisión del usuario)

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

## Sprint 2 — Estudio (en ejecución, 2026-09-06)

Objetivo: convertir el shell en una mesa de estudio: pestañas, grafo, favoritos y apuntes,
flashcards con repetición espaciada, quiz, plan de estudio y kits; con el material de
estudio compilado desde el wiki de cada materia (N0-27). Cierra S-03, S-06 y S-07.

| # | Unidad | Paquete | Done-test |
|---|---|---|---|
| S2-01 | Contrato: StudyContent (Deck/Card/Quiz/Plan/Kit), SrsState + `sm2`, GraphData, StudyState, rail FIJO ampliado, rutas | packages/contract | tests de `sm2` (intervalos crecientes, lapso reinicia) y `autoDecks` con Proba |
| S2-02 | Compilador: `wiki.study` → StudyContent (markdown de mazos y quizzes, `plan.json`, `kits.json`); CLI sync lo envía; skill documenta el formato | packages/markdown, packages/cli, skills | fixtures + `examples/proba/estudio/` compilan; 0 errores de validación |
| S2-03 | Contenido real de Proba: convertir FLASHCARDS/QUIZ/ROADMAP/KITS de `study-data.js` a `examples/proba/estudio/` | examples | `sinapsis sync --dry-run` reporta N mazos, M quizzes, plan con fases, kits |
| S2-04 | API: tablas `bookmarks`, `notes`, `srs_cards`, `tasks`, `quiz_attempts`, `user_semesters`, `page_links`, `subject_study`; rutas de estudio, grafo, favoritos, apuntes, tareas, intentos, cuatrimestres; FTS externa por materia (S-06); backlinks por `page_links` (S-07) | apps/api | tests de integración por ruta; sync de Proba llena `page_links`; búsqueda filtra por materia con índice |
| S2-05 | Web · shell: pestañas múltiples (N0-29), grafo (N0-31), favoritos, apuntes en el lector y vista «Mis apuntes», «Guardar» vivo, rail con los grupos nuevos, rutas | apps/web features/subject (shell) | E2E: abrir 3 pestañas y cambiar; grafo con nodos de Proba; favorito persiste; apunte se guarda |
| S2-06 | Web · estudio: flashcards (mazos, sesión de repaso con SM-2, atajos Espacio/1-4), quiz (opción múltiple, explicación, resultado, intentos), plan (fases, hitos, tareas tildables, progreso), kits (tarjetas con páginas/mazos/quizzes/herramientas) | apps/web features/subject/study | E2E: repasar 3 tarjetas cambia `due`; quiz de 3 preguntas muestra resultado; tildar tarea persiste |
| S2-07 | Web · landing: cuatrimestres vacíos persistentes y ordenables (S-03); vitest 3 | apps/web landing | E2E: crear cuatrimestre vacío → recargar → sigue |
| S2-08 | E2E + smoke visual de las vistas nuevas en 3 temas | e2e | `pnpm e2e` verde |
| S2-09 | Auditoría final (seguridad, corrección, UX) + fixes | — | cero altas abiertas |
| S2-10 | Docs: CONTRACT §7 (formato de estudio), README, HANDOFF-sprint2, DECISIONS | docs | — |


## Sprint 3 — Herramientas por materia (propuesto)
Sistema de plugins: cada materia publica un bundle React registrado en `rail[].items[kind=tool]`;
sandbox de carga; contrato de props (`App.registerView` del baseline como referencia).

## Sprint 4 — Deploy (propuesto)
Dockerfile, Turso/libSQL remoto, dominio, Google OAuth de producción, backups.
