# Handoff — Sprint 1 (MVP) de Sinapsis

> Histórico: describe la arquitectura anterior al Sprint 4 (sitio estático); ver HANDOFF-sprint4.md.

Fecha: 2026-09-05 / 06. Ejecución autónoma (autopilot) del orquestador sobre el mockup
exportado de Claude Design. Este documento resume qué quedó construido, qué se verificó,
qué decisiones se tomaron sin consultar (para revisarlas en bloque) y cómo seguir.

## 1. Qué hay

| Pieza | Estado | Dónde |
|---|---|---|
| Contrato plataforma ↔ materia (zod + helpers) | listo | `packages/contract` · `docs/CONTRACT.md` |
| Compilador del wiki (paridad con `build.py`, 209 páginas de Proba) | listo | `packages/markdown` |
| CLI `sinapsis init · validate · sync · status` | listo | `packages/cli` |
| Skill `/sinapsis` para el agente de cada materia | lista | `skills/sinapsis` (enlazada en `.claude/skills/sinapsis`) |
| API Hono + Drizzle + SQLite (libsql): auth Google + dev, sesiones, landing, sync, páginas, búsqueda FTS5, progreso | listo | `apps/api` |
| SPA React: login, landing (grilla por cuatrimestre, gestión con arrastre, alta/baja/mover, vacía), shell de materia (rail FIJO+SLOT, índice adaptable, cabecera, migas, plegado), Inicio, Lector (KaTeX, wikilinks, callouts, TOC, fuentes, backlinks, estudiada), catálogo con filtros en URL, paleta ⌘K, 3 temas | listo | `apps/web` |
| Primera materia real sincronizada: Probabilidad y Estadística (209 páginas, 11 unidades) | listo | `examples/proba/sinapsis.config.json` |
| Pruebas | 216 unitarias/integración + 24 E2E Playwright | `pnpm test` · `pnpm e2e` |

## 2. Cómo levantarlo

```bash
pnpm install
cp apps/api/.env.example apps/api/.env        # ya existe uno de desarrollo en esta máquina
pnpm db:migrate
pnpm dev                                      # API :3000 · web :5173
```

Abrir <http://localhost:5173>, «Entrar como usuario de desarrollo», abrir Probabilidad y
Estadística. Para el login real con Google: `README.md` § «Login con Google».

Sincronizar Proba de nuevo tras editar el wiki:

```bash
set -a; source apps/api/.env; set +a
pnpm sinapsis -- sync --config examples/proba/sinapsis.config.json --wiki ~/Desktop/ITBA/26-1C/Proba_Obsidian/wiki --token "$SYNC_TOKEN"
```

Para adoptar el flujo definitivo, copiar `examples/proba/sinapsis.config.json` a la raíz de
`Proba_Obsidian/` y correr `/sinapsis sync` desde ese repo.

## 3. Verificación realizada

- Gates: `pnpm typecheck`, `pnpm test` (contract 11 · markdown 52 · api 68 · web 67 · cli 18),
  `pnpm build`, `pnpm e2e` (24) — todo en verde en el commit final.
- Smoke real del orquestador en el navegador sobre el stack completo con los datos de Proba:
  login → landing → materia → lector con 147 nodos KaTeX → marcar estudiado persiste → landing 1/97.
- Auditoría final con cuatro lentes y adjudicación del orquestador:
  seguridad 4/4 corregidos (SEC-1..4), corrección 5/5 (BUG-1..5), UX 35 hallazgos (31
  corregidos, 4 diferidos como decisiones de producto), simplificación 46 hallazgos (todos
  aplicados salvo S-06/S-07 diferidos). Detalle en `EXEC_STATE.md`.

## 4. Decisiones que debe revisar el usuario

Todas numeradas en `docs/DECISIONS.md` (N0-1 … N0-25). Las que más conviene mirar:

1. **N0-2 / N0-3** SQLite (libsql) + Hono. Alternativa razonable: Postgres + Fastify.
2. **N0-5** Bypass de desarrollo (`AUTH_DEV_BYPASS`); el API se niega a arrancar con él en producción.
3. **N0-6 / N0-7** Materias globales + landing por usuario; token de sync estático.
4. **N0-8** Tema global por usuario (el mockup lo dejaba pendiente).
5. **N0-11** `kind` de los ítems del rail (`builtin | page | link | tool`); `tool` es Sprint 3.
6. **N0-20** Hoja de 840 con el índice abierto a 1440 recortando márgenes.
7. **N0-21..N0-23** El H1 duplicado se corta en el compilador; los ids de encabezado los define el compilador; «Transversales»/«Otras» las define el contrato.
8. **S-08 / S-09** (en `EXEC_STATE.md`): rótulos de los botones del Inicio y asimetría del buscador landing/materia.

## 5. Fuera de alcance (sprints siguientes)

Pestañas múltiples, grafo, flashcards/quiz/SRS, plan y kits, figuras interactivas,
herramientas React por materia (plugins), tokens de sync por usuario, cuatrimestres vacíos
persistentes (S-03), FTS por materia (S-06), tabla de backlinks (S-07), deploy (Dockerfile +
Turso). Ver `docs/SPRINTS.md`.

## 6. Notas operativas

- `apps/api/.env` de esta máquina tiene `SESSION_SECRET` y `SYNC_TOKEN` generados; no se versiona.
- La base local `apps/api/data/sinapsis.db` contiene Proba sincronizada y el usuario dev.
- `design/export/*.dc.html` es la exportación literal del mockup; el hook de diseño reporta
  hallazgos sobre esos archivos que no aplican (son fixtures).
- El stack de desarrollo puede quedar corriendo tras la sesión: `pkill -f "tsx src/index.ts"; pkill -f "vite --port 5173"` lo detiene.
