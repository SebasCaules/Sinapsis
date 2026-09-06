# Handoff — Sprint 2 («Estudio») de Sinapsis

> Histórico: describe la arquitectura anterior al Sprint 4 (sitio estático); ver HANDOFF-sprint4.md.

Fecha: 2026-09-06. Ejecución autónoma (autopilot) continuando el Sprint 1 sin intervención
del usuario; todas las decisiones nuevas están numeradas en `docs/DECISIONS.md` (N0-26 … N0-39).

## 1. Qué se agregó

| Pieza | Qué hace | Dónde |
|---|---|---|
| Material de estudio en el wiki | Carpeta `wiki.study` (por defecto `estudio/`): mazos y quizzes en markdown, `plan.json` y `kits.json`; se compila y viaja en `SyncPayload.study`. Sin mazos propios, la plataforma genera uno por división con título → resumen. | `packages/markdown/src/study.ts`, `docs/contracts/03-estudio.md` |
| Contenido real de Proba | 6 mazos (46 tarjetas), 1 quiz (15 preguntas, opciones matemáticas con `alt`), plan de 6 fases / 30 hitos / 89 tareas (2 apuntan a herramientas del rail), 8 kits. Conversor reejecutable desde `study-data.js`. | `examples/proba/estudio/`, `examples/proba/tools/convert-study-data.mjs` |
| API | Grafo (`page_links`), estudio (`/study`, `/study/state`, SRS SM-2 con `sm2` del contrato, favoritos, apuntes, tareas, intentos), cuatrimestres del usuario, FTS5 externa por materia con título+resumen+cuerpo. Migración `0002_study.sql` con backfill de enlaces. | `apps/api` (128 tests) |
| Shell de materia | Pestañas múltiples (hasta 20, ⌘-clic, arrastre, teclado, persistentes), grafo de conexiones (`d3-force` en canvas, filtros, lista «Más citadas»), favoritos y apuntes (lector + vistas propias + exportación markdown), «PARA HOY» en Inicio, diálogo de atajos (`?`). | `apps/web/src/features/subject` |
| Estudio | Flashcards (mazos, sesión con SM-2, atajos Espacio/1-4), quiz (opción múltiple, explicación, resultado, intentos), plan (fases, hitos, tareas tildables, progreso), kits. | `apps/web/src/features/subject/study` |
| Landing | Cuatrimestres persistentes, vacíos y ordenables por arrastre o teclado; borrador protegido (confirmación al descartar); enlaces «Repasar» y «Plan» por materia. | `apps/web/src/features/landing` |
| Rail fijo | «Mi ruta» (Inicio, Plan, Kits) · «Consultar» (Todo el wiki, Grafo) · «Practicar» (Flashcards, Quiz) · slots de la materia · «Lo mío» (Apuntes, Favoritos) · «Wiki». | `packages/contract` `FIXED_RAIL` / `FIXED_RAIL_TAIL` |

## 2. Verificación

- Gates en el commit de cierre: `pnpm typecheck`, `pnpm test` (contract 16 · markdown 70 · api 128 · web 195 · cli 22 = 431), `pnpm build`, `pnpm e2e` (47 pruebas: las 24 del Sprint 1 + 23 nuevas).
- Smoke real del orquestador con el material de Proba: flashcards (18 mazos), sesión con KaTeX, plan (89 tareas), kits, grafo (209 nodos / 2087 aristas), rail con 7 grupos, «PARA HOY».
- Auditoría final: seguridad sin hallazgos; corrección 12 bugs corregidos; UX 43 hallazgos (4 bloqueantes) corregidos salvo decisiones de producto (N0-33..39); tres notas menores del auditor de seguridad aplicadas (contención de `wiki.study` en `validate`, `rehype-raw` fuera, ids canónicos).

## 3. Cómo probarlo

```bash
pnpm dev                                  # API :3000 · web :5173 (la migración 0002 corre sola)
set -a; source apps/api/.env; set +a
pnpm sinapsis -- sync --config examples/proba/sinapsis.config.json --wiki ~/Desktop/ITBA/26-1C/Proba_Obsidian/wiki --token "$SYNC_TOKEN"
```

Abrir <http://localhost:5173/m/proba>: rail → Flashcards, Quiz, Plan, Kits, Grafo; en el
lector, «A favoritos» y la tarjeta APUNTES; `?` muestra los atajos. Para una materia nueva:
`pnpm sinapsis -- init …` crea `estudio/` con un mazo de ejemplo y el README del formato.

## 4. Decisiones que debe revisar el usuario

`docs/DECISIONS.md` N0-26 … N0-39. Las de mayor impacto: N0-27 (formato del material de
estudio: markdown para mazos/quizzes, JSON para plan/kits; mazos automáticos), N0-28 (SM-2 con
cuatro notas), N0-29 (pestañas solo en el cliente), N0-31 (grafo en canvas), N0-33 («Flashcards»,
«Quiz» y «Kits» como nombres propios), N0-34 (⌘⇧W cierra pestañas), N0-35 (autoguardado de
apuntes), N0-37 (plan sin modalidades hasta S-11).

## 5. Pendientes y siguiente sprint

- S-11 `Plan.tracks` (cursada vs. final directo), S-06 ya cerrado (FTS externa), S-07 cerrado
  (`page_links`), S-03 cerrado (cuatrimestres).
- Señalado por los fixers, fuera de alcance: el cursor de teclado del grafo no desplaza el
  lienzo al nodo elegido; `SubjectCard` de la landing no trae agregados de estudio («3 para
  repasar» costaría una llamada por tarjeta o un campo `dueCount` en el DTO).
- Sprint 3 propuesto: herramientas React por materia (plugins para `kind: "tool"`), `Plan.tracks`,
  figuras interactivas del wiki (`[!figura]`), tokens de sync por usuario.

## 6. Notas operativas

- El stack de desarrollo queda corriendo en :3000/:5173 con la base ya migrada y Proba
  sincronizada con estudio. `pkill -f "tsx src/index.ts"; pkill -f "vite --port 5173"` lo detiene.
- La base `apps/api/data/sinapsis.db` conserva el progreso, favoritos, apuntes y SRS del usuario dev.
