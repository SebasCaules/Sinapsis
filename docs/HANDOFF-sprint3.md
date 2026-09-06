# Handoff — Sprint 3 («Herramientas») de Sinapsis

Fecha: 2026-09-06. Ejecución autónoma (autopilot) continuando el Sprint 2 sin intervención del
usuario; decisiones nuevas numeradas en `docs/DECISIONS.md` (N0-40 … N0-49). Todo lo que quedó
diferido está en `EXEC_STATE.md` (S-14 … S-26).

## 1. Qué se agregó

| Pieza | Qué hace | Dónde |
|---|---|---|
| Herramientas por materia (bundles) | Cada materia trae sus propias vistas y figuras como scripts clásicos (IIFE) contra un runtime de compatibilidad `window.App` / `window.M` con la superficie de la app original de Proba (N0-41). Manifiesto `sinapsis.tools.json`, `sinapsis tools build/push/list`, `sync --tools`. El API guarda el bundle en disco (atómico, 20 MB) y lo sirve con MIME, ETag y CSP con `sandbox`. | `packages/runtime`, `packages/contract` (`ToolManifest`), `apps/api/src/{routes,services}/tools.ts`, `packages/cli/src/commands/tools.ts` |
| Bundle real de Proba | Explorador de distribuciones, calculadoras, asistente, taller, laboratorio Monte Carlo, buscador de valores (⌘J) y las 92 figuras interactivas del wiki, con el CSS acotado a `.sinapsis-tool`. | `examples/proba/tools/proba-tools/` (`ADAPTACIONES.md` documenta cada desvío del baseline) |
| Figuras en el lector | `> [!figura] id` monta la figura del bundle dentro del lector (N0-42); las figuras siguen el tema y se desmontan al salir. | `apps/web/src/features/subject/markdown/remarkCallouts.ts`, `views/ReaderView.tsx` |
| `Plan.tracks` | Modalidades del plan (Proba: «Cursada + final» y «Final directo») con conmutador y elección recordada por materia (N0-43). | contrato, `packages/markdown/src/study.ts`, `study/PlanView.tsx` |
| `dueCount` | Tarjetas de la landing con «N para repasar». | `apps/api/src/services/landing.ts`, `features/landing/SubjectCard.tsx` |
| Propuestas de cambio a la plataforma | `sinapsis propose` (gates → rama `proposal/*` → archivo de propuesta → fila en `proposals/INBOX.md` en `main` → PR si hay GitHub) y la skill `/sinapsis-review` del orquestador (worktree, gates, 7 lentes, `merge --no-ff`). Probado de punta a punta con 5 casos negativos (N0-44). | `packages/cli/src/commands/propose.ts`, `skills/sinapsis-review/`, `docs/PROPOSALS.md`, `proposals/` |
| Contratos consolidados | Ocho contratos legibles por un agente de materia, verificados campo a campo contra el código (N0-45). | `docs/contracts/00-07`, `docs/CONTRACT.md` (índice) |
| Normalización de `$$` | El compilador pone los delimitadores de display en líneas propias (N0-47): 51 páginas de Proba se truncaban en el lector y la matemática de una línea salía inline. | `packages/markdown/src/inline.ts` |
| Runtime: `App.$`/`App.$$`, `paletteOpen`/`openPalette`, `bindView` | Consulta del DOM acotada a la vista, paleta ⌘K desde un bundle y delegación de `[data-nav]`/`[data-go]`/wikilinks (N0-48). | `packages/runtime/src/{compat,nav}.ts` |
| Sesión y reconexión | `useMe` reintenta 5xx/red y `RequireAuth` distingue error de «sin sesión», con «Reintentar» e «Ir a iniciar sesión» (S-15, AC-09). | `apps/web/src/lib/auth.ts`, `app/RequireAuth.tsx` |

## 2. Verificación

- Gates en el commit de cierre: `pnpm typecheck`, `pnpm test` (contract 29 · runtime 133 · markdown 88 · api 169 · web 252 · cli 50 = 721), `pnpm build`, `pnpm e2e` (60 pruebas: 59 pasadas y 1 que solo corre con el fixture de demostración).
- Revisión de diseño con el navegador (D5): 36 pantallas × 3 temas × 4 anchos; 33 fallas, 25 corregidas
  (`docs/DISENO-sprint3.md`).
- Comparación página a página con la app original de Proba (F5, N0-46): 20 pantallas pareadas, 34
  diferencias (25 intencionales por contrato/mockup, 9 defectos, todos corregidos por F5 y X5)
  (`docs/FIDELIDAD-sprint3.md`).
- Auditoría: seguridad 4 hallazgos (3 medios, 1 bajo) corregidos; corrección 15 hallazgos (1 alto, 8
  medios, 6 bajos) corregidos. Detalle en `EXEC_STATE.md`.
- Smoke real del orquestador con Proba: bundle subido por el CLI, cinco vistas, figuras montadas con
  controles, plan con dos modalidades, paleta desde `App.openPalette()`.

## 3. Cómo probarlo

```bash
pnpm dev                                  # API :3000 · web :5173 (la migración 0003 corre sola)
set -a; source apps/api/.env; set +a
pnpm sinapsis -- sync --config examples/proba/sinapsis.config.json --wiki ~/Desktop/ITBA/26-1C/Proba_Obsidian/wiki --token "$SYNC_TOKEN" --tools
```

Abrir <http://localhost:5173/m/proba>: rail → Explorador, Calculadoras, Asistente, Taller,
Laboratorio; en el lector, `tecnica-derivadas-parciales` o `cadenas-de-markov` muestran figuras
interactivas; Plan → conmutador de modalidad. Para comparar con la app original:
`python3 -m http.server 4599 --directory ~/Desktop/ITBA/26-1C/Proba_Obsidian/estudio`.

Para proponer un cambio a la plataforma desde una materia: `skills/sinapsis/SKILL.md` § «Proponer
un cambio a la plataforma»; para revisarlo, `/sinapsis-review`. Hay una propuesta real cerrada como
ejemplo en `proposals/` (ver `proposals/INBOX.md`).

## 4. Decisiones que debe revisar el usuario

`docs/DECISIONS.md` N0-40 … N0-49. Las de mayor impacto: N0-41 (bundles clásicos en el origen de la
plataforma; S-14 sandbox si deja de ser personal), N0-44 (flujo de propuestas), N0-47 (normalización
de `$$` en el compilador), N0-48 (`paletteOpen` como pregunta). Diferidos que piden decisión: S-17
(¿el contador de la landing cuenta el paso de aprendizaje de 10 min?), S-08 (rótulos del inicio).

## 5. Pendientes y siguiente sprint

- Diferidos S-14, S-17 … S-26 en `EXEC_STATE.md` (sandbox, `data-testid`, validación del plan en el
  API, `sources` sin verificar, colisiones de `headingId`, sanitizador del runtime, bloques sangrados,
  re-login tras reinicio del API (S-24), tope de `chi2Inv`, `App.STUDY` sin deshacer).
- Sprint 4 propuesto: deploy (Dockerfile, Turso/libSQL remoto, dominio, Google OAuth de producción,
  backups), tokens de sync por usuario, modo móvil completo.

## 6. Notas operativas

- Stack de desarrollo en `.claude/launch.json` (`api`, `web`, `web-attach`); la app original de
  Proba se sirve aparte en :4599 para comparar.
- Las capturas masivas de las revisiones (`design/referencias/sprint3*/`) quedan fuera del repo salvo
  las que citan los docs.
- `.dist/` (bundles minificados) y `dist/` están en `.gitignore`.
