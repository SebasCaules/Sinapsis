# Handoff — Sprint 4 · Sitio estático

Fecha: 2026-09-06. Decisiones N0-56 a N0-60. Brief de ejecución: `docs/SPRINT4-BRIEF.md`.

## Qué cambió

La plataforma dejó de tener servidor. Antes: una SPA que hablaba con un API Hono sobre SQLite,
con inicio de sesión de Google y un token de sincronización. Ahora: **un sitio estático en
GitHub Pages** (<https://sebascaules.github.io/Sinapsis/>) que lee archivos JSON generados en
el build.

| Antes | Ahora |
|---|---|
| `apps/api` (Hono, Drizzle, SQLite/libSQL) | Eliminado. |
| Sesión con Google + cookie firmada | Perfil local: un nombre y un tema en el navegador. |
| `PUT /api/subjects/:slug/sync` con `SYNC_TOKEN` | `sinapsis publish` → rama `subject/*` → PR → merge. |
| La materia vivía en la base | La materia es fuente en `subjects/<slug>/` del repositorio. |
| Progreso en tablas por usuario | Un documento `LocalBackup` en IndexedDB + espejo en `localStorage`. |
| Búsqueda con FTS5 | Índice en memoria, con la misma heurística de ranking portada. |
| `tools push` al API | Los bundles viajan dentro del `publish`. |

Lo que **no** cambió: el contrato de la materia (`sinapsis.config.json`, el wiki, `estudio/`,
los bundles), el compilador, el runtime del navegador, las vistas y el flujo de propuestas.
`lib/api.ts` sigue siendo la única costura entre las vistas y los datos: cambió su
implementación, no su interfaz.

### Piezas nuevas

- `packages/contract/src/site.ts` — los cuatro archivos del sitio (`SiteCatalog`,
  `SiteSubject`, `SitePages`, `SiteTools`), `sitePaths`, `siteToolBase`, y el estado personal
  (`LocalBackup`, `LocalProfile`, `LocalLanding`, `LocalSubjectState`).
- `subjects/<slug>/` — la fuente de cada materia dentro del repositorio.
- `apps/web/src/local/` — el documento local, su persistencia y la copia de seguridad.
- `.github/workflows/ci.yml` — gates de cada PR y la regla de alcance de un PR de materia.
- `.github/workflows/pages.yml` — build y deploy en cada push a `main`.

## Cómo se opera

### Desarrollo

```bash
pnpm install
pnpm dev            # compila subjects/ y levanta la web en :5173
```

`pnpm dev` corre `pnpm build:subjects` antes de Vite. Si se toca `subjects/` con el servidor
levantado, hay que volver a compilar.

### Publicar una materia (agente de materia, en el repositorio de la materia)

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish  --config sinapsis.config.json --dry-run
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish  --config sinapsis.config.json
```

`publish` trabaja en un worktree temporal desde `origin/main`, reemplaza `subjects/<slug>/`
entero, commitea **sin trailers de coautoría** y abre el PR. Variables: `SINAPSIS_HOME` y
`SINAPSIS_WEB`, nada más.

### Revisar e integrar (orquestador, en este repositorio)

`/sinapsis-review` adjudica dos tipos de rama:

- `proposal/*` — cambios a la plataforma; el flujo de siempre (gates, siete lentes, merge
  `--no-ff`, veredicto escrito).
- `subject/*` — materias; CI verde, `site build` sin errores, advertencias razonadas, diff
  contenido en `subjects/<slug>/`, contenido revisado por muestreo, merge con
  `gh pr merge --merge` (sin *squash*) y verificación del deploy con
  `gh run list --workflow pages.yml`.

Ningún merge lleva coautoría ni cuerpo adicional.

### Desplegar

Automático: cada push a `main` construye y publica. **Una sola configuración manual del
repositorio**: en *Settings → Pages*, la fuente tiene que ser «GitHub Actions», no una rama.

### El estado personal

Vive en el navegador y no se sincroniza entre dispositivos. Desde el menú del avatar:
descargar copia de seguridad (`sinapsis-backup-AAAA-MM-DD.json`), restaurar y borrar todo. El
formato está en `docs/contracts/05-publicacion-y-sitio.md` §4. Conviene descargar una copia
antes de limpiar el navegador o de cambiar de máquina.

## Qué quedó abierto

Todo lo siguiente está **fuera del alcance declarado del Sprint 4**; ninguno bloquea el uso.
El orquestador completa esta lista al cerrar el sprint.

| # | Qué falta | Por qué se dejó afuera |
|---|---|---|
| 1 | **Service worker y modo sin conexión.** El sitio necesita red para el primer `fetch` de cada materia. | No se pidió; agregarlo trae invalidación de caché, que es su propio problema. |
| 2 | **Sincronización del estado entre dispositivos.** Hoy la única puente es la copia de seguridad manual. | Requiere un servicio: es exactamente lo que N0-56 sacó. |
| 3 | **Multiusuario**: cuentas, permisos, materias privadas. | Ídem. Costo de revertir N0-56 anotado como alto. |
| 4 | **Dominio propio.** El sitio vive en `/Sinapsis/`; con dominio en la raíz, `VITE_BASE` vuelve a `/` (N0-59). | No se pidió. |
| 5 | **Modo móvil completo.** | Diferido desde el Sprint 1. |
| 6 | **Escala de la búsqueda.** El índice se arma en memoria; con un corpus mucho mayor haría falta un índice pregenerado en el build (N0-60). | Un par de miles de páginas entran sobrado. |
| 7 | **Sandbox de los bundles (S-14).** Siguen corriendo en el origen del sitio, sin aislamiento, y ahora comparten origen con el almacenamiento del estado personal. | N0-41: los repositorios de materia son del propio usuario. Revisar si la plataforma se comparte. |
| 8 | Diferidos S-17 … S-26 de `EXEC_STATE.md`. | Sin cambios respecto del Sprint 3. |
| 9 | **Dos pestañas a la vez.** Las dos escriben el mismo documento local y gana la última por `savedAt`, sin fusión. | Uso personal; una fusión por campo es trabajo propio. |
| 10 | **`dueCount` de la landing** no se recorta al material vigente (sí se recorta `study.state`). | Recortarlo obligaría a bajar `subject.json` de cada materia al abrir la landing. |
| 11 | **La barra de unidad del lector** muestra los ejercicios como pasos, pero la vista «Ejercicios» (herramienta) no muestra la barra: desde ella se vuelve por el índice o las migas. | El original tampoco la tenía como página; la herramienta es del bundle. |

## Por dónde seguir

- `docs/CONTRACT.md` — índice de los contratos.
- `docs/contracts/05-publicacion-y-sitio.md` — `publish`, `site build`, los archivos del sitio
  y la copia de seguridad.
- `docs/contracts/06-skill-y-agentes.md` — el CLI y el agente de materia.
- `docs/contracts/07-propuestas.md` — propuestas y PR de materia.
- `docs/DECISIONS.md` — N0-56 a N0-63 (N0-61 ejercicios en el progreso; N0-62 hoja redimensionable; N0-63 columna y botón «PANEL»).
- `docs/HANDOFF-sprint1.md` · `HANDOFF-sprint2.md` · `HANDOFF-sprint3.md` — histórico de la
  arquitectura anterior.
