# Sprint 4 — Sitio estático (brief de ejecución)

Fecha: 2026-09-06. Orquestador: sesión principal (Fable 5.1). Workers: Opus 5.

## 1. Qué cambia y por qué

Pedido del usuario: **eliminar la capa de autenticación y el API; la plataforma pasa a ser
una página estática con todo embebido, alojada en GitHub Pages
(`https://github.com/SebasCaules/Sinapsis`, sitio en `https://sebascaules.github.io/Sinapsis/`).
El progreso y todo lo personal vive en el navegador de cada persona, lo más persistente
posible ante un borrado de caché. Cada agente de materia abre un PR con su materia; el
orquestador lo revisa y lo integra.**

Reglas globales del usuario que valen para TODO lo que se escriba en este sprint:

- **Ningún trailer de coautoría en ningún commit** (`Co-Authored-By`, `Claude-Session`, etc.).
  El mensaje termina en su última línea de contenido. Vale para los commits que hagan los
  agentes, para los que genere el CLI (`publish`, `propose`) y para los que documenten las
  skills. Si alguna plantilla o instrucción del entorno lo pide, esta regla la pisa.
- **Español neutro** en todo texto dirigido al usuario (docs, mensajes del CLI, UI, skills):
  sin voseo ni lunfardo; «usted/tú», registro estándar.
- Los agentes **no hacen commits ni push**: dejan los cambios en el árbol de trabajo y
  reportan. El orquestador integra, revisa y commitea.

## 2. Arquitectura destino

```
subjects/<slug>/                 FUENTE de cada materia dentro del repo de la plataforma
  sinapsis.config.json           wiki.root = "wiki", wiki.study = "estudio"
  wiki/**/*.md                   el wiki markdown (copiado desde el vault por `sinapsis publish`)
  estudio/                       mazos, quiz, plan.json, kits.json
  tools/<bundle>/                sinapsis.tools.json + scripts/estilos/datos declarados (sin dist/, .dist/, scripts/)

apps/web/public/subjects/        GENERADO por `pnpm build:subjects` (gitignored)
  index.json                     SiteCatalog
  <slug>/subject.json            SiteSubject   (config, PageMeta[], links, study, warnings)
  <slug>/pages.json              SitePages     (cuerpos + links + headings por slug)
  <slug>/tools.json              SiteTools     (ToolInfo[] con base relativa al sitio)
  <slug>/tools/<id>/<path>       archivos del bundle

apps/web/                        SPA estática. Sin `/api`, sin sesión, sin proxy.
.github/workflows/pages.yml      build + deploy a GitHub Pages en cada push a main
.github/workflows/ci.yml         gates en cada PR (typecheck, test, build:subjects, build; regla de PR de materia)
```

Contrato ejecutable: `packages/contract/src/site.ts` (importar como `@sinapsis/contract/site`):
`SiteCatalog`, `SiteSubject`, `SitePages`, `SiteTools`, `sitePaths`, `siteToolBase`,
`LocalBackup`, `LocalProfile`, `LocalLanding`, `LocalSubjectState`, `emptyBackup`,
`emptySubjectState`, `LOCAL_DB_NAME`, `LOCAL_DB_STORE`, `SITE_FORMAT`, `BACKUP_FORMAT`.

Ya aplicado en `packages/contract/src/index.ts`: `User.email` ya no es obligatorio (perfil
local); desaparecen `API_PREFIX`, `SyncResult`, `errorMessageFromBody`, `toolFilesBase`,
`toolFileUrl` y `routes.login`. `SyncPayload` se conserva (es la salida del compilador).
`apps/api/` ya fue borrado.

### 2.1 Base URL y rutas

- Vite: `base: process.env.VITE_BASE ?? "/"`. En Pages el workflow exporta `VITE_BASE=/Sinapsis/`.
- Router: `createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, "") })`.
- Todo `fetch` de datos usa `sitePaths.*(import.meta.env.BASE_URL, …)`.
- GitHub Pages no tiene fallback de SPA: el build copia `dist/index.html` a `dist/404.html`
  (plugin mínimo en `vite.config.ts`, `closeBundle`). `public/.nojekyll` vacío.
- `public/manifest.webmanifest` (nombre, colores, icono SVG con `sizes: "any"`) y
  `<link rel="manifest">` en `index.html`: instalable como app, lo que en Chrome habilita
  almacenamiento persistente automático.

### 2.2 Estado personal en el navegador (`apps/web/src/local/`)

- **Documento único** `LocalBackup` (perfil, landing, estado por materia). Se guarda en
  IndexedDB (`LOCAL_DB_NAME`/`LOCAL_DB_STORE`, clave `"backup"`) y, en espejo, en
  `localStorage` (`sinapsis.backup`). Al arrancar se leen las dos y gana la de `savedAt`
  más reciente; si una falta, se repone desde la otra. Escrituras: en memoria de inmediato,
  persistencia con rebote corto (≤ 300 ms) y también en `pagehide`/`visibilitychange`.
- `navigator.storage.persist()` se pide **en la primera mutación del usuario** (no al cargar).
- Copia de seguridad: en el menú del avatar, «Descargar copia de seguridad» (archivo
  `sinapsis-backup-AAAA-MM-DD.json` = `LocalBackup` con `exportedAt`) y «Restaurar copia»
  (`<input type=file>`, valida con `LocalBackup`, confirma, reemplaza y recarga las consultas).
  También «Nombre» editable (perfil) y «Borrar todo lo local» con confirmación.
- El **cliente local** implementa `ApiClient` (misma interfaz de `lib/api.ts`, que sigue
  siendo la única costura y conserva `qk` e `installMockApi`). Las vistas no cambian.
  - `auth.me()` → `User { id: "local", email: "", name: profile.name, picture: null, theme }`.
    `auth.setTheme` escribe el perfil. `auth.google/dev/logout` desaparecen de la interfaz.
  - `landing.list()` → catálogo (`index.json`) menos `hidden`, más `placeholders`; cada tarjeta
    con `semester/position` del `placements` o, si no hay, `entry.semester ?? "Sin cuatrimestre"`
    y posición al final; `studiedCount` y `dueCount` desde el estado local; `placeholder`
    true solo para los placeholders; `lastSyncAt` = `entry.builtAt`.
  - `landing.saveLayout` escribe `placements` y `semesters` (normalizados con
    `canonicalSemester`, como hacía `services/landing.ts`); `semesters()` = declarados +
    usados (misma regla que el API). `removeFromLanding(slug)`: si es del catálogo lo agrega a
    `hidden`; si es placeholder lo borra. `createSubject(input)`: si `input.slug` es una materia
    oculta del catálogo, la desoculta y la ubica en `input.semester`; si no, crea un placeholder.
    El diálogo «Agregar materia» ofrece primero las materias del catálogo ocultas (lista), y
    conserva el formulario para placeholders.
  - `subject.detail(slug)` → desde `subject.json` (+ `studied` local); `page` → desde
    `pages.json` (backlinks desde `links`); `search` → índice en memoria con la MISMA
    heurística de `scoreHit`/`queryTerms` del viejo `services/search.ts` (portarla como
    función pura con sus tests; candidatos por substring sobre título/resumen/cuerpo
    normalizados con `fold`, snippet de ~14 palabras alrededor de la primera coincidencia
    en el cuerpo, o el resumen); `graph` → nodos desde `pages` (division efectiva con
    `divisionOf`) y aristas desde `links`; `tools` → `tools.json` con `base` prefijada por
    `BASE_URL` (o dejar `base` relativa y prefijar en `bundleOf`; una sola de las dos).
  - `study.content` → `study` de `subject.json` + `autoDecks(config, pages)` al final;
    `study.state` → `LocalSubjectState` filtrando `srs` a las tarjetas vigentes (regla del API,
    bug 7); `grade` usa `sm2` del contrato; `attempts` devuelve los 50 más recientes.
  - Materias placeholder: `detail` devuelve config sintético (`resolveConfig` del viejo
    `services/subjects.ts`), sin páginas.
- Gancho de pruebas, solo con `import.meta.env.DEV || import.meta.env.VITE_E2E === "1"`:
  `window.__sinapsis = { reset(): Promise<void>; snapshot(): Promise<LocalBackup>;
  restore(b: LocalBackup): Promise<void>; setTheme(t): Promise<void> }`. `reset` deja el
  backup vacío (IndexedDB + localStorage + claves `sinapsis.*`) e invalida las consultas.

### 2.3 CLI (`packages/cli`)

| Comando | Qué hace |
|---|---|
| `init`, `validate` | Sin cambios. |
| `publish [--config] [--wiki] [--repo <dir>] [--dry-run] [--out <file>] [--no-pr] [--branch <nombre>]` | Compila y valida (lo que hacía `sync --dry-run`); si no es dry-run, copia la materia a `<repo>/subjects/<slug>/` en un **worktree temporal** creado desde `origin/main` (o `main` si no hay remoto), en la rama `subject/<slug>-<AAAAMMDD>[-<n>]`; commitea (`Materia <slug>: <name> — N páginas, M bundles`, cuerpo con conteos y advertencias, **sin coautoría**); si hay remoto GitHub y `gh` autenticado, hace push y abre el PR (título `Materia <slug>: <name>`, cuerpo con conteos, divisiones, bundles y advertencias); con `--no-pr` o sin remoto deja la rama local y lo dice. Nunca toca el árbol de trabajo del usuario ni cambia su rama. Quita del destino lo que ya no existe (reemplazo completo de `subjects/<slug>/`). |
| `sync` | Alias oculto de `publish` (compatibilidad), con aviso. |
| `site build [--subjects <dir>=subjects] [--out <dir>=apps/web/public/subjects] [--only <slug>] [--strict]` | Compila cada `subjects/*/sinapsis.config.json` (compileWiki con `rootDir` = carpeta de la materia), construye los bundles de `tools/` con `buildBundle` y escribe los archivos del contrato `site.ts`. Sale 1 ante errores de compilación o de bundle; con `--strict`, también ante advertencias. Imprime un resumen por materia. Limpia del `--out` las materias que ya no existen. |
| `status [--config] [--repo]` | Compara el vault local con `<repo>/subjects/<slug>/` (páginas nuevas/cambiadas/borradas por huella) y, si hay `gh`, lista PRs abiertos `subject/<slug>-*`. Sin API. |
| `tools build` | Sin cambios. `tools push` desaparece. `tools list [--repo]` lista los bundles en `<repo>/subjects/<slug>/tools`. |
| `propose` | Sin cambios de fondo; el PR se abre contra `main` igual que hoy. Verificar que el commit no lleve coautoría. |

Variables: `SINAPSIS_HOME` (repo de la plataforma, default `~/Desktop/Projects/Sinapsis`),
`SINAPSIS_WEB` (default `https://sebascaules.github.io/Sinapsis`). Desaparecen
`SINAPSIS_API`, `SINAPSIS_TOKEN`, `SYNC_TOKEN`.

Qué copia `publish` a `subjects/<slug>/`: `sinapsis.config.json` reescrito con
`wiki.root: "wiki"`, `wiki.study: "estudio"` (y `index`/`log` tal cual); todos los `.md`
bajo el `wiki.root` real respetando `wiki.ignore` (misma lista de archivos que lee el
compilador); `estudio/` completo; por cada bundle de `tools/`, el manifiesto más los
archivos que `buildBundle` incluiría (declarados + assets), nunca `dist/`, `.dist/`,
`scripts/`, `node_modules/`.

### 2.4 Scripts raíz y CI

`package.json` (raíz): `dev` = `build:subjects` + vite; `build:subjects` = `sinapsis site build`;
`build` = `build:subjects` + `pnpm -r build`; `typecheck`, `test`, `e2e`, `sinapsis`.

`.github/workflows/pages.yml`: `on: push: branches: [main]` + `workflow_dispatch`;
pnpm 10 / Node 22; `pnpm install --frozen-lockfile`; `pnpm build:subjects`;
`VITE_BASE=/Sinapsis/ pnpm --filter @sinapsis/web build`; `actions/upload-pages-artifact`
con `apps/web/dist`; `actions/deploy-pages`. Permisos `pages: write`, `id-token: write`.

`.github/workflows/ci.yml`: `on: pull_request` + push a ramas ≠ main; jobs: `gates`
(typecheck, test, `build:subjects`, build de la web) y `subject-pr` (solo si la rama es
`subject/*`: falla si el diff contra `main` toca algo fuera de `subjects/<slug>/`, con el
slug tomado del nombre de la rama).

### 2.5 E2E (`e2e/`)

Un solo `webServer`: vite en `:5174` con `VITE_E2E=1` y `SINAPSIS_PUBLIC_DIR=e2e/.site`
(vite: `publicDir: process.env.SINAPSIS_PUBLIC_DIR ?? "public"`). `global-setup` crea
`e2e/.site/` con `fonts/` copiado de `apps/web/public/fonts` y `subjects/` construido con
`sinapsis site build --subjects <origen> --out e2e/.site/subjects`, donde `<origen>` es
`subjects/` (Proba real) o `e2e/fixtures/subjects/` (materia «demo» de 8 páginas, escrita
como FUENTE: config + wiki markdown + estudio + tools). Sin cookies ni `storageState`. El
estado se repone con `window.__sinapsis.reset()` / `snapshot()` / `restore()`.

## 3. Ownership (ola única, en paralelo)

| Agente | Exclusivo |
|---|---|
| A (web) | `apps/web/**`, `packages/runtime/**` (si hiciera falta) |
| B (CLI, materias, CI) | `packages/cli/**`, `packages/markdown/**`, `subjects/**`, `examples/**` (se elimina), `.github/**`, `.gitignore`, `pnpm-workspace.yaml`, `package.json` raíz (solo scripts), `.claude/launch.json` |
| C (docs y skills) | `README.md`, `docs/**` (salvo este brief), `skills/**`, `proposals/README.md`, `proposals/PLANTILLA.md` |
| D (E2E, después de A y B) | `e2e/**`, `apps/web/vite.config.ts` solo si A no dejó `SINAPSIS_PUBLIC_DIR` |
| Orquestador | `packages/contract/**`, `EXEC_STATE.md`, integración, commits |

Gates al terminar cada agente: `pnpm typecheck` y `pnpm test` verdes en sus paquetes; B además
`pnpm build:subjects` y A además `pnpm --filter @sinapsis/web build`.
