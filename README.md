# Sinapsis

Plataforma personal para organizar y estudiar los wikis markdown de todas las materias.
Cada materia aporta su wiki (estilo Obsidian) y un `sinapsis.config.json`; la plataforma
los envuelve en un shell estándar de tres columnas —rail de herramientas, índice del
temario y área de lectura— con estética *university press* y tres temas.

Desde el Sprint 4 Sinapsis es un **sitio estático**: no hay servidor, ni base de datos, ni
inicio de sesión. Las materias viven como fuente dentro de este repositorio, en
`subjects/<slug>/`, y se compilan a archivos JSON durante el build. El sitio se publica en
GitHub Pages:

**<https://sebascaules.github.io/Sinapsis/>**

Todo lo personal —progreso, favoritos, apuntes, repaso espaciado, plan, intentos de quiz y la
disposición de la landing— vive en el navegador de cada persona y se puede exportar como
copia de seguridad (N0-56).

- **Contrato** plataforma ↔ materia: [`docs/CONTRACT.md`](docs/CONTRACT.md) (fuente ejecutable: `packages/contract`).
- **Decisiones de arquitectura**: [`docs/DECISIONS.md`](docs/DECISIONS.md).
- **Plan por sprints**: [`docs/SPRINTS.md`](docs/SPRINTS.md). Estado de ejecución: [`EXEC_STATE.md`](EXEC_STATE.md).
- **Diseño**: mockups exportados de Claude Design en `design/export/`, brief del baseline en `design/referencias/`.

## Estructura

```
subjects/<slug>/       FUENTE de cada materia (la copia `sinapsis publish` desde su vault)
  sinapsis.config.json   configuración de la materia
  wiki/**/*.md           el wiki markdown
  estudio/               mazos, quizzes, plan.json, kits.json
  tools/<bundle>/        sinapsis.tools.json + scripts, estilos y datos declarados

apps/web/              SPA React + Vite (landing y shell de materia). Sin API ni sesión.
apps/web/public/subjects/  GENERADO por `pnpm build:subjects` (no se versiona)
packages/contract      esquemas zod y helpers compartidos (SubjectConfig, Page, site.ts)
packages/markdown      compilador del wiki: frontmatter, wikilinks, headings → Page[]
packages/runtime       runtime del navegador para los bundles de herramientas y figuras
packages/cli           `sinapsis init | validate | publish | site build | status | tools | propose`
skills/sinapsis        skill /sinapsis para el agente de cada materia
skills/sinapsis-review skill /sinapsis-review para el orquestador
e2e/                   pruebas Playwright de punta a punta
.github/workflows/     ci.yml (gates de cada PR) y pages.yml (build y deploy)
```

## Requisitos

Node ≥ 20 (probado con 22 y 23), pnpm 10. Sin servicios externos y sin archivos de entorno:
todo lo que el sitio necesita sale del repositorio.

## Puesta en marcha

```bash
pnpm install
pnpm dev            # compila subjects/ y levanta la web en :5173
```

Abrir <http://localhost:5173>. No hay pantalla de inicio de sesión: el perfil es local (un
nombre y un tema que se pueden cambiar desde el menú del avatar).

`pnpm dev` corre `pnpm build:subjects` antes de Vite. Si se agrega o se cambia una materia en
`subjects/` con el servidor levantado, hay que volver a correr `pnpm build:subjects` para que
la web vea los datos nuevos.

## Publicar una materia

Cada materia es un repositorio aparte (el vault de Obsidian con su wiki). Su agente trabaja
allí con la skill `/sinapsis` y la publica con `sinapsis publish`, que copia la materia a
`subjects/<slug>/` de este repositorio, en su propia rama, y abre un pull request:

```bash
SINAPSIS_HOME="${SINAPSIS_HOME:-$HOME/Desktop/Projects/Sinapsis}"

# 1) generar la configuración a partir del wiki (una sola vez)
pnpm --dir "$SINAPSIS_HOME" sinapsis -- init --wiki wiki

# 2) completar nombre, código, institución, divisiones y rail; validar
pnpm --dir "$SINAPSIS_HOME" sinapsis -- validate --config sinapsis.config.json

# 3) compilar y revisar sin escribir nada
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json --dry-run

# 4) publicar: rama subject/<slug>-<AAAAMMDD>, commit y pull request
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish --config sinapsis.config.json
```

`publish` trabaja en un worktree temporal creado desde `origin/main`: nunca toca el árbol de
trabajo ni la rama del usuario. Copia el `sinapsis.config.json` (reescrito con `wiki.root:
"wiki"` y `wiki.study: "estudio"`), el wiki, la carpeta de estudio y los archivos de cada
bundle de `tools/`, y **reemplaza por completo** `subjects/<slug>/`: lo que ya no existe en el
vault desaparece del repositorio. Los commits que genera no llevan trailers de coautoría.

El material de estudio (mazos, quizzes, plan y kits) vive en la carpeta `estudio/` junto al
wiki; el formato está en [`docs/contracts/03-estudio.md`](docs/contracts/03-estudio.md) y
`sinapsis init` deja un ejemplo. Sin mazos propios, la plataforma genera uno por división a
partir de los resúmenes.

Una materia también puede traer sus propias vistas (exploradores, calculadoras) y figuras
interactivas como bundles de scripts clásicos en `tools/`, descritos por `sinapsis.tools.json`
(contrato en [`docs/contracts/04-herramientas-y-figuras.md`](docs/contracts/04-herramientas-y-figuras.md)).
Se validan con `sinapsis tools build` y viajan con el `publish`.

## Cómo se revisa y se integra

Un pull request de materia toca **solo** `subjects/<slug>/`. El orquestador lo adjudica desde
una sesión abierta en este repositorio con la skill `/sinapsis-review`:

1. Comprueba que el CI del PR esté verde (typecheck, tests, `build:subjects` y build de la
   web) y que el diff no salga de `subjects/<slug>/`.
2. Revisa el contenido por muestreo: el config, un par de páginas, el material de estudio y
   los manifiestos de los bundles.
3. Aprueba con `gh pr merge --merge` (sin *squash*, para conservar el historial de la
   materia) o pide cambios con los motivos escritos.

El mismo comando adjudica las **propuestas de cambio a la plataforma** (ramas `proposal/*`),
que es el camino para todo lo que una materia no puede resolver dentro de su repositorio:
`sinapsis propose` corre los gates, crea la rama, escribe la propuesta en `proposals/` y abre
el PR. Flujo completo en [`docs/contracts/07-propuestas.md`](docs/contracts/07-propuestas.md).

Ninguna rama llega a `main` sin veredicto, y ningún commit del flujo lleva coautoría.

## Despliegue

Cada push a `main` dispara `.github/workflows/pages.yml`: instala, corre `pnpm build:subjects`,
construye la web con `VITE_BASE=/Sinapsis/` y publica `apps/web/dist` en GitHub Pages. No hay
paso manual: mergear el PR de una materia la deja publicada.

> **Configuración del repositorio, una sola vez.** En *Settings → Pages*, la fuente
> («Source») tiene que ser **GitHub Actions**, no una rama. Con la opción de rama el workflow
> corre pero el sitio no se actualiza.

Detalles que hacen que el sitio funcione bajo `/Sinapsis/`: el router usa `basename` =
`import.meta.env.BASE_URL`, el build copia `dist/index.html` a `dist/404.html` (GitHub Pages
no tiene fallback de SPA) y `public/.nojekyll` evita que Jekyll se coma las carpetas con
guion bajo (N0-59).

## Dónde vive el progreso y cómo hacer una copia de seguridad

El estado personal se guarda en el navegador, en IndexedDB, con un espejo en `localStorage`
por si una de las dos se pierde; al arrancar gana la copia más reciente. En la primera
modificación el sitio pide `navigator.storage.persist()`, y el sitio se puede instalar como
aplicación, lo que en Chrome habilita el almacenamiento persistente automáticamente.

Aun así, **el estado vive en un solo navegador**: no se sincroniza entre dispositivos y un
borrado de datos del sitio lo elimina. Desde el menú del avatar:

- **Descargar copia de seguridad** — escribe `sinapsis-backup-AAAA-MM-DD.json` con todo el
  estado (perfil, landing, progreso, favoritos, apuntes, repaso, plan e intentos).
- **Restaurar copia** — pide el archivo, lo valida, confirma y reemplaza el estado.
- **Borrar todo lo local** — con confirmación.

El formato del archivo es `LocalBackup`, descrito en
[`docs/contracts/05-publicacion-y-sitio.md`](docs/contracts/05-publicacion-y-sitio.md).
Conviene descargar una copia antes de limpiar el navegador o de cambiar de máquina.

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Compila `subjects/` y levanta la web en :5173 |
| `pnpm build:subjects` | `sinapsis site build`: compila `subjects/**` a `apps/web/public/subjects/` |
| `pnpm build` | `build:subjects` + build de todos los paquetes (`apps/web/dist` es el sitio) |
| `pnpm typecheck` · `pnpm test` | Gates de tipos y de pruebas en todo el repositorio |
| `pnpm e2e` | Playwright contra el sitio estático |
| `pnpm sinapsis -- <cmd>` | CLI de materias |

## Las skills

- `skills/sinapsis` — la del agente de cada materia (`init`, `validate`, `publish`,
  `status`, `tools`, `propose`). Para tenerla disponible en todos los proyectos:
  `ln -s "$PWD/skills/sinapsis" ~/.claude/skills/sinapsis`.
- `skills/sinapsis-review` — la del orquestador, dentro de este repositorio: adjudica los PR
  de materia (`subject/*`) y las propuestas (`proposal/*`).
