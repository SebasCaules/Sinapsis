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
| S1-13 e2e + smoke visual | DONE | ola2 | 24 E2E verdes; smoke manual real; capturas 3 temas |
| S1-14 auditoría final | DONE | dfbd68b | seguridad 4/4 · corrección 5/5 · UX 31/35 (4 diferidos S-08/S-09 y decisiones) · simplificación 44/46 (S-06, S-07 diferidos) |
| S1-15 docs | DONE | | README, CONTRACT, DECISIONS (N0-1..25), SPRINTS, HANDOFF-sprint1 |

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


## Auditoría final — seguridad (adjudicada por el orquestador)

| # | Hallazgo | Veredicto | Fix |
|---|---|---|---|
| SEC-1 | `POST /api/auth/dev` dependía solo de `NODE_ENV !== production`, que ningún script fijaba en producción | CONFIRMADO (alta) | `loadEnv` falla si `AUTH_DEV_BYPASS` + `NODE_ENV=production`; `start` fija `NODE_ENV=production`; README |
| SEC-2 | `wiki.index/log/root` del config admitían `..` y rutas absolutas → el CLI podía leer archivos fuera del wiki y subirlos | CONFIRMADO (media) | `SafeRelativePath` en el contrato + contención `isInside()` en el compilador |
| SEC-3 | `target` de ítems `link` sin validar esquema → `javascript:` en el rail/paleta | CONFIRMADO (media) | `ExternalUrl` (http(s)/mailto) en `RailItem`/`Fab` + filtro `isSafeExternalUrl` en la web |
| SEC-4 | Cookie `Secure` y orígenes CSRF de desarrollo atados a `NODE_ENV` | CONFIRMADO (media) | `COOKIE_SECURE`, `ALLOWED_ORIGINS` en `AppEnv` validado; guard lee de `c.var.env` |
Descartado por el auditor con evidencia: inyección SQL/FTS5, IDOR, comparación del token, CSRF, XSS en el lector (react-markdown sanea URLs, sin rehype-raw, KaTeX trust=false), traversal en el estático, YAML, verificación del ID token.

## Auditoría final — corrección (adjudicada por el orquestador)

| # | Hallazgo | Veredicto | Fix |
|---|---|---|---|
| BUG-1 | El bloque de tipo con `collapsedByDefault` (Fuentes) no se podía desplegar: `toggleType` conmutaba la marca, no el estado efectivo | CONFIRMADO (alta) | `collapsedTypes: Record<string, boolean>`; toggle contra el efectivo |
| BUG-2 | `-rank * 1e5` hacía que BM25 tapara la heurística de título/slug/resumen (`tp7` → la guía TP7 en 9.º lugar) | CONFIRMADO (alta) | BM25 a escala: `min(20, -rank*2)` |
| BUG-3 | `studied` sin `ORDER BY` → «Repaso de hoy» mostraba las más recientes | CONFIRMADO (media) | `orderBy(progress.studiedAt)` |
| BUG-4 | Marcar estudiado no invalidaba `qk.landing` → tarjeta con progreso viejo | CONFIRMADO (media) | `onSettled` invalida landing |
| BUG-5 | `order` explícito de divisiones cambiaba el índice pero no numeración ni color | CONFIRMADO (media, latente) | el modelo pasa `divisions` ordenadas a los helpers |

## Auditoría final — E2E

24 pruebas Playwright (auth, landing, shell, lector, catálogo/búsqueda, temas) en verde antes y después de los fixes; 0 bugs de la app detectados por la suite; capturas 1440×1024 en `e2e/shots/`.

## Auditoría final — UX/fidelidad y simplificación (adjudicadas por el orquestador)

UX: 35 hallazgos (4 bloqueantes, 15 importantes, 16 menores). Se corrigen todos salvo los que son decisiones de producto, que quedan en `docs/DECISIONS.md` (N0-20..N0-25) o en S-nn. Simplificación: reutilización 12, simplificación 12, eficiencia 12, altitud 10 → se aplican en la ola 3 (fixers S, W1, W2) salvo los diferidos de abajo.

| # | fix diferido | superficie | origen | cuándo |
|---|---|---|---|---|
| S-06 | `pages_fts` con `subject_id UNINDEXED`: el MATCH recorre todas las materias; con 10 materias se puntúan 10× candidatos. Pasar a FTS externa (`content=pages`) filtrando por rowid. | apps/api fts | eficiencia 11 | Sprint 2 (cuando haya ≥ 3 materias) |
| S-07 | Tabla `page_links(subject_id, from_slug, to_slug)` poblada en el sync para backlinks indexados (hoy: prefiltro LIKE + confirmación en JS). | apps/api | eficiencia 5 | Sprint 2 |
| S-08 | Botones del hero de Inicio: la implementación dice «Continuar» / «Todo el wiki»; el mockup «Empezar por División 1» / «Ver herramientas de la materia». Decidir si el segundo debe llevar a las herramientas (Sprint 3) o al catálogo. | apps/web HomeView | UX 34 | revisión del usuario |
| S-09 | Landing y materia comparten el mismo botón ⌘K pero uno filtra en línea y el otro abre una paleta que consulta el API. Confirmar la asimetría (hoy el placeholder de la landing dice «Filtrar materias…»). | apps/web | UX 12 | revisión del usuario |

## Veredicto final

**Sprint 1 (MVP) cerrado el 2026-09-06.** Gates en verde en `dfbd68b`: typecheck, 216 tests unitarios/integración (contract 11 · markdown 52 · api 68 · web 67 · cli 18), build, 24 E2E. Cero hallazgos altos abiertos. Smoke real del orquestador sobre Proba (209 páginas) correcto. Pendiente de revisión del usuario: decisiones N0-1..N0-25 y S-03, S-06..S-09.


---

# EXEC_STATE — Sprint 2 (Estudio)

Iniciado el 2026-09-06 en autopilot; decisiones acumuladas en `docs/DECISIONS.md` (N0-26…).

## Pasos

| paso | estado | commit | notas |
|---|---|---|---|
| F0 contrato + docs | DONE | | StudyContent, SRS, GraphData, rail y rutas nuevas |
| S2-01 contract tests | DONE | | 16 tests (sm2, autoDecks) |
| S2-02 compilador + CLI + skill | DONE | | compileStudy, 69 tests markdown, 22 CLI; CONTRACT §7 |
| S2-03 contenido Proba | DONE | | 6 mazos/46 tarjetas, 1 quiz/15, plan 6 fases/30 hitos/89 tareas, 8 kits; 0 referencias rotas |
| S2-04 API | DONE | | 124 tests; migración 0002 con backfill de page_links; FTS externa (title, summary, body) |
| S2-05 web shell (pestañas, grafo, favoritos, apuntes) | DONE | c4b8787 | 52 tests nuevos; smoke real: grafo 209 nodos, pestañas persistentes |
| S2-06 web estudio (flashcards, quiz, plan, kits) | DONE | c4b8787 | 27 tests; smoke real con el material de Proba |
| S2-07 web landing (S-03) + vitest 3 | DONE | c4b8787 | cuatrimestres persistentes y ordenables; vitest 3.2.7 |
| S2-08 E2E | DONE | 2c79496 | 47 pruebas (24 + 23); 0 bugs de la app |
| S2-09 auditoría | DONE | | seguridad 0 · corrección 12/12 · UX 43/43 (decisiones N0-33..39) · fixers S4, WS, WL |
| S2-10 docs | DONE | | CONTRACT §5/§7, DECISIONS N0-26..39, HANDOFF-sprint2, SPRINTS |

## Ownership (ola 1)

| Agente | Carpetas exclusivas |
|---|---|
| A3 | `apps/api/**` |
| B3 | `packages/markdown/**`, `packages/cli/**`, `packages/contract/src/*.test.ts`, `skills/sinapsis/**`, `examples/**` |
| C3 | `apps/web/**` salvo `src/features/subject/**` y `src/app/router.tsx` |
| D3a | `apps/web/src/features/subject/**` salvo `study/**` |
| D3b | `apps/web/src/features/subject/study/**` (exporta `studyRoutes`) |
| Orquestador | `packages/contract/src/index.ts`, docs, raíz |

## Fixes diferidos (Sprint 2)

| # | fix | superficie | origen | cuándo |
|---|---|---|---|---|
| S-10 | FTS: incluir `summary` en el índice externo (A3-5) | apps/api migración 0002 | reporte A3 | HECHO (A3b) |
| S-11 | `Plan` sin modalidades (cursada vs. final directo): hoy son fases consecutivas; agregar `Plan.tracks` | contrato, compilador, web plan | reporte B3 (contractRequest 2) | Sprint 3 |
| S-12 | Re-ejecutar `examples/proba/tools/convert-study-data.mjs` para usar `PlanTask.kind = "tool"`, `detail` e `icon` recién agregados al contrato | examples/proba/estudio | reporte B3 | HECHO (S4) |
| S-13 | Reiniciar el API de desarrollo obliga a volver a iniciar sesión en el navegador aunque `sessions` persiste en la base: diagnosticar (¿cookie firmada con secreto distinto? ¿`Set-Cookie` sin `Max-Age` en el proxy?) | apps/api auth | smoke del orquestador | Sprint 3 |

## Veredicto final (Sprint 2)

**Sprint 2 («Estudio») cerrado el 2026-09-06.** Gates en verde: typecheck, 431 tests unitarios/integración (contract 16 · markdown 70 · api 128 · web 195 · cli 22), build, 47 E2E. Cero hallazgos altos abiertos. Smoke real con el material de estudio de Proba. Pendiente de revisión del usuario: decisiones N0-26..N0-39 y S-11.



---

# EXEC_STATE — Sprint 3 (Herramientas)

Iniciado el 2026-09-06 en autopilot; decisiones N0-40… en `docs/DECISIONS.md`.

| paso | estado | commit | notas |
|---|---|---|---|
| F0 contrato + docs + propuestas | DONE | | ToolManifest, runtime types, Plan.tracks, dueCount, PROPOSALS.md |
| S3-01 contract tests | DONE | 442560a | 29 tests |
| S3-02 runtime | DONE | d91a57d | 93 tests; motor de figuras portado 1:1 |
| S3-03 API tools + dueCount + S-13 | DONE | | 169 tests; S-13 → S-15 (web) |
| S3-04 CLI tools/propose + tracks + skill | DONE | 442560a | 37 tests CLI; push real del bundle de Proba (913 KB) |
| S3-05 bundle Proba | DONE | | 22 archivos, 912 kB, 5 vistas, 92 figuras |
| S3-06 web ToolHost/figuras/tracks/dueCount/grafo | DONE | | 217 tests web |
| S3-07 /sinapsis-review + propuesta de prueba | DOING | 5752f5d | Q5: flujo feliz + 5 casos negativos en un clon, 11 fricciones corregidas (43 tests CLI); falta la propuesta real con el árbol limpio (la hace el orquestador al cierre) |
| S3-08 E2E + diseño + fidelidad | DONE | 48e78c4 6f42c59 b6b8d60 | E5: 60 E2E (13 nuevas) · D5: 36 pantallas × 3 temas × 4 anchos, 33 fallas (25 corregidas) en `docs/DISENO-sprint3.md` · F5: 20 pantallas pareadas con la app original, 34 diferencias (25 intencionales, 9 defectos) en `docs/FIDELIDAD-sprint3.md`; los 7 defectos fuera de ownership los cierra X5 (ola 3) · N0-47 hallado en el smoke del orquestador |
| S3-09 auditoría | DOING | 83e1420 | AS: 4 hallazgos (3 medios, 1 bajo) todos corregidos por el orquestador (CSP sandbox en archivos de bundle, trust de KaTeX, `/\\host` externo, color de leyenda escapado); S-22/S-23 anotados · AC: 15 hallazgos (1 alto, 8 medios, 6 bajos), todos aceptados: AC-01/02/03/06 corregidos por el orquestador en el compilador; AC-04/05/07..15 en Y5 |
| S3-10 contratos consolidados + handoff | TODO | | cierre |

Ownership ola 1: A4 `apps/api/**` · B4 `packages/cli/**`, `packages/markdown/**`, `packages/contract/src/*.test.ts`, `skills/**`, `docs/PROPOSALS.md`(no), `examples/proba/estudio/**` · R4 `packages/runtime/**` · P4 `examples/proba/tools/**` · D4 `apps/web/**` salvo `router.tsx` · orquestador: contrato, docs, `proposals/`.

| # | fix diferido | superficie | origen | cuándo |
|---|---|---|---|---|
| S-14 | Sandbox por iframe para bundles de herramientas si la plataforma deja de ser personal | runtime, web | N0-41 | cuando haya más de un usuario |
| S-16 | Runtime: agregar `App.$`/`App.$$`, delegación de `[data-nav]`/`[data-go]` dentro del contenedor de la vista y `App.paletteOpen()` (pedidos de P4) | packages/runtime, web ToolHost | reporte P4 | HECHO (W5, e393a34; contrato de997d4). Pendiente en el shell: pasar `openSearch`/`searchOpen` a `useRuntime` para que `App.openPalette()` funcione fuera de `/t/:tool` |
| S-15 | S-13 resuelto en diagnóstico (A4): el API conserva la sesión; `useMe()` de la web trata un 500/fallo de red del proxy (API reiniciándose) como «sin sesión» y `RequireAuth` manda a `/login`. Fix: reintentar 5xx/red en `useMe` y distinguir `isError` de «sin sesión» en `RequireAuth`. | apps/web lib/auth.ts, app/RequireAuth.tsx | reporte A4 | HECHO (W5, e393a34): reintentos 300·2ⁿ ms hasta 5, aviso «Reconectando con el servidor…» desde el primer fallo |
| S-17 | `dueCount` no cuenta el paso de aprendizaje de 10 min (nota 1 → `due = ahora + 10 min`, N0-28): una sesión de repaso por sí sola nunca enciende «para repasar» en la landing. Decidir si el contador debe incluir tarjetas en aprendizaje. | contrato `sm2`, api landing | reporte E5 | revisión del usuario |
| S-18 | Anclas estables para E2E: `data-testid` en el host de herramienta (`ToolHost`), el conmutador de tema, el grupo de modalidades del plan y el enlace de pendientes de la tarjeta. Hoy los specs anclan en roles/nombres accesibles. | apps/web | reporte E5 | cuando algún spec se rompa por copy |
| S-19 | El API valida el plan a medias: `services/sync.ts` recorre solo `study.plan.phases` (no `plan.tracks`) y no revisa tareas `kind: "tool"` ni `kit.tools`; el compilador sí (`planPhases`). Alinear el API con `checkPlanIds`. | apps/api services/sync.ts | reporte C5 | Sprint 4 |
| S-20 | `Page.sources` no se verifica: una `fuentes: [[pagina-inexistente]]` no genera advertencia (el compilador solo recorta a 120 caracteres). | packages/markdown compile.ts | reporte C5 | Sprint 4 |
| S-21 | `headingId` puede colapsar dos encabezados (solo matemática → `"h"`; sin desambiguación de ids repetidos dentro de una página). | packages/contract headingId, compilador | reporte C5 | Sprint 4 |
| S-22 | El `renderMarkdown` del runtime (`marked` sin sanitizador) trata el texto que recibe como HTML de confianza; hoy solo lo alimentan constantes del bundle de Proba (N0-41). Si una materia renderiza texto del wiki o de `study-data.json` con `App.renderMarkdown`/`App.rich`, hace falta un sanitizador en la salida (auditoría AS S3-A2, parte PLAUSIBLE). | packages/runtime markdown.ts | reporte AS | cuando un bundle renderice texto del wiki |
| S-23 | `normalizeDisplayMath` no reconoce bloques de código sangrados con 4 espacios: una línea `    $$ x` dentro de uno se reescribe como display. El vault de Proba no los usa (solo cercas). | packages/markdown inline.ts | nota de AS | Sprint 4 |
| S-24 | Tras el reinicio automático del API de desarrollo (tsx watch, 03:38) el navegador volvió a `/login` aunque la sesión seguía viva en la base (una cookie previa por `curl` respondía 200 en `/api/me`): el 401 llegó del propio API, no de un 5xx, así que S-15 no lo cubre. Diagnosticar por qué la cookie del navegador dejó de validar (¿`Set-Cookie` con `Max-Age` reescrito por el proxy? ¿secreto de firma regenerado en el arranque?). | apps/api auth/session.ts, apps/web proxy | smoke del orquestador | Sprint 4 |
