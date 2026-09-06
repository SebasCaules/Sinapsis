# 05 · Publicación y sitio — de la materia al sitio estático

Sinapsis no tiene servidor. Una materia no «sincroniza contra un API»: **se publica como
fuente dentro del repositorio de la plataforma** (`subjects/<slug>/`) mediante un pull
request, y el build la compila a archivos JSON estáticos que la web lee con `fetch`
(N0-56, N0-57, N0-58).

Hay dos pasos y son de dueños distintos:

| Paso | Comando | Quién | Qué produce |
|---|---|---|---|
| **Publicar** | `sinapsis publish` | El agente de la materia, en el repositorio de la materia | Una rama `subject/<slug>-<AAAAMMDD>` con `subjects/<slug>/` actualizado, y un PR. |
| **Compilar** | `sinapsis site build` | El build de la plataforma (`pnpm build:subjects`), local y en CI | `apps/web/public/subjects/**`: el catálogo y, por materia, tres JSON y los archivos de los bundles. |

Contrato ejecutable: `packages/contract/src/site.ts`, importable como
`@sinapsis/contract/site`.

---

## 1. `sinapsis publish` — la materia entra al repositorio

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish \
  [--config <file>] [--wiki <dir>] [--repo <dir>] \
  [--dry-run] [--out <file>] [--no-pr] [--branch <nombre>]
```

| Bandera | Qué hace |
|---|---|
| `--config <file>` | El `sinapsis.config.json` de la materia (por defecto, el del directorio actual). |
| `--wiki <dir>` | Sobrescribe `wiki.root`. **No mueve `wiki.study`**, que cuelga del config. |
| `--repo <dir>` | Repositorio de la plataforma. Sin ella: `SINAPSIS_HOME`. |
| `--dry-run` | Compila, valida e informa; no escribe nada, no crea rama ni PR. |
| `--out <file>` | Escribe el payload compilado (JSON indentado) antes de publicar. |
| `--no-pr` | Deja la rama local y no abre pull request. |
| `--branch <nombre>` | Fuerza el nombre de la rama en vez del derivado de la fecha. |

### 1.1 Qué copia a `subjects/<slug>/`

| Destino | Origen | Detalle |
|---|---|---|
| `sinapsis.config.json` | El config de la materia | Reescrito con `wiki.root: "wiki"` y `wiki.study: "estudio"`, que es la forma canónica dentro del repositorio. `index`, `log`, `ignore`, `divisionField` y todo lo demás viajan tal cual. |
| `wiki/**/*.md` | El `wiki.root` real del vault | Todos los `.md` que **lee el compilador**: primer nivel de cada carpeta, respetando `wiki.ignore`, más `wiki.index` y `wiki.log`. |
| `estudio/` | La carpeta `wiki.study` | Completa. |
| `tools/<bundle>/` | Cada bundle de `tools/` | El `sinapsis.tools.json` más los archivos que `buildBundle` incluiría: los declarados (`scripts`, `styles`, `data`) y los assets sueltos que sirven en tiempo de ejecución. |

**Nunca** se copian `dist/`, `.dist/`, `scripts/` ni `node_modules/`: son artefactos de
construcción del vault y no forman parte de lo publicado.

### 1.2 Reemplazo completo

`subjects/<slug>/` pasa a ser exactamente lo que el vault tiene hoy: **lo que ya no existe se
borra del destino**. Es la misma regla que gobernaba el sync (principio 9): publicar contra un
wiki incompleto borra páginas. Como el estado personal vive en el navegador y se guarda por
slug y por id, no se pierde progreso (§3), pero la materia sí queda incompleta hasta el
siguiente `publish`.

Un `publish` que no cambia nada no crea rama ni PR: lo dice y sale `0`.

### 1.3 Rama, commit y PR

1. Crea un **worktree temporal** desde `origin/main` (o `main` si no hay remoto). El árbol de
   trabajo y la rama del usuario **no se tocan nunca**.
2. Rama: `subject/<slug>-<AAAAMMDD>`; si ya existe, `subject/<slug>-<AAAAMMDD>-2`, `-3`, …
   (o el nombre que fije `--branch`).
3. Commit:

   ```
   Materia <slug>: <name> — N páginas, M bundles

   Páginas: N (por división y por tipo)
   Estudio: A mazos (B tarjetas) · C quiz · plan de D fases · E kits
   Bundles: <id> (F archivos), …
   Advertencias: G
     …
   ```

   **Sin trailers de coautoría.** El mensaje termina en su última línea de contenido: nada de
   `Co-Authored-By`, `Claude-Session` ni equivalentes, ni en este commit ni en ninguno del
   flujo (N0-58). Si una plantilla del entorno lo pide, esta regla la pisa.
4. Si hay remoto en GitHub y `gh` autenticado: empuja la rama y abre el PR.
   - Título: `Materia <slug>: <name>`.
   - Cuerpo: los conteos (páginas totales y por división, tipos, material de estudio),
     los bundles con sus vistas y las advertencias del compilador, con su motivo.
5. Con `--no-pr`, sin remoto de GitHub o sin `gh` autenticado, deja la rama y lo dice. **No
   falta nada**: el orquestador puede mergearla localmente.

### 1.4 Un PR de materia toca solo su carpeta

Regla del flujo, verificada por el job `subject-pr` del CI: el diff de una rama `subject/*`
contra `main` **no puede tocar nada fuera de `subjects/<slug>/`**, con el slug tomado del
nombre de la rama. Un cambio a la plataforma que la materia necesite va por el otro camino:
una propuesta (`07-propuestas.md`).

---

## 2. `sinapsis site build` — la fuente se vuelve sitio

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- site build \
  [--subjects <dir>] [--out <dir>] [--only <slug>] [--strict]
```

| Bandera | Default | Qué hace |
|---|---|---|
| `--subjects <dir>` | `subjects` | Carpeta con las materias fuente. |
| `--out <dir>` | `apps/web/public/subjects` | Dónde se escriben los archivos del sitio. |
| `--only <slug>` | — | Compila una sola materia (el resto queda como está). |
| `--strict` | — | Las advertencias también hacen salir `1`. |

Para cada `subjects/*/sinapsis.config.json`: compila el wiki con `compileWiki` (`rootDir` = la
carpeta de la materia), construye los bundles de `tools/` con `buildBundle` y escribe los
archivos del contrato. Imprime un resumen por materia. **Sale `1`** ante un error de
compilación o de bundle y, con `--strict`, también ante advertencias. Del `--out` se limpian
las materias que ya no existen en la fuente.

Es lo que corre `pnpm build:subjects`, que a su vez es el primer paso de `pnpm dev` y de
`pnpm build`. La salida **no se versiona** (está en `.gitignore`): se regenera siempre.

### 2.1 Los archivos

Bajo `<BASE_URL>subjects/` (`SITE_DATA_DIR` = `subjects`):

```
subjects/index.json                 SiteCatalog   — una entrada por materia
subjects/<slug>/subject.json        SiteSubject   — config, páginas sin cuerpo, enlaces, estudio
subjects/<slug>/pages.json          SitePages     — cuerpos, enlaces y encabezados por slug
subjects/<slug>/tools.json          SiteTools     — bundles con su `base`
subjects/<slug>/tools/<id>/<path>   los archivos de cada bundle, tal cual
```

Ninguna ruta del contrato asume el prefijo: se compone con `sitePaths.*(base, …)`, donde
`base` es `import.meta.env.BASE_URL` de Vite (termina en `/`: `/` en desarrollo, `/Sinapsis/`
en Pages, N0-59).

| Helper | Devuelve |
|---|---|
| `sitePaths.catalog(base)` | `<base>subjects/index.json` |
| `sitePaths.subject(base, slug)` | `<base>subjects/<slug>/subject.json` |
| `sitePaths.pages(base, slug)` | `<base>subjects/<slug>/pages.json` |
| `sitePaths.tools(base, slug)` | `<base>subjects/<slug>/tools.json` |
| `sitePaths.toolBase(base, slug, toolId)` | Base de los archivos de un bundle, sin barra final |
| `sitePaths.toolFile(base, slug, toolId, path)` | Un archivo concreto del bundle |

`SITE_FORMAT` (hoy `1`) es el campo `format` de los cuatro archivos y **solo sube con cambios
incompatibles**. Un archivo con otro `format` no valida y la web lo trata como error de carga.

### 2.2 `index.json` — `SiteCatalog`

```ts
SiteCatalog = {
  format: 1,
  builtAt: string,             // ISO de la compilación completa
  generator?: string,          // ≤ 80 ("@sinapsis/cli 0.1.0")
  subjects: SiteCatalogEntry[] // ≤ 200
}
```

`SiteCatalogEntry` es lo que la landing necesita **sin abrir la materia**:

| Campo | Tipo | Qué es |
|---|---|---|
| `slug` | `Slug` | Identidad y URL (`/m/<slug>`). |
| `name` · `code` · `institution` | string | Del config. |
| `color` | `ColorRef` | Color de la materia (`#rrggbb` o `--token`). |
| `semester` | string opcional | `SubjectConfig.semester`: **sugerencia**, no ubicación. La ubicación real es del usuario (`LocalLanding.placements`). |
| `division` | `DivisionLabel` | `{ singular, abbr, plural }`. |
| `divisionsCount` | entero ≥ 0 | Divisiones **declaradas** en el config; las sintéticas no cuentan (N0-23). |
| `pagesCount` | entero ≥ 0 | Páginas que **cuentan como contenido** (`countsAsContent`): es el denominador del progreso. |
| `totalPages` | entero ≥ 0 | Todas las páginas, fuentes y meta incluidas. |
| `toolsCount` | entero ≥ 0 | Bundles publicados. |
| `builtAt` | string ISO | Compilación **de esta materia**. Es lo que la tarjeta muestra como última actualización. |

### 2.3 `subject.json` — `SiteSubject`

```ts
SiteSubject = {
  format: 1,
  builtAt: string,
  generator?: string,
  config: SubjectConfig,   // el de la materia, validado — ver 01-materia.md
  pages: PageMeta[],       // ≤ 20000: `Page` sin `body`, `links` ni `headings`
  links: GraphEdge[],      // wikilinks resueltos
  study: StudyContent,     // material AUTORAL de `estudio/` — ver 03-estudio.md
  warnings: string[],      // ≤ 500
}
```

- **`links`** es el grafo de la materia y la fuente de los enlaces entrantes. Reglas: solo
  aristas cuyo **destino existe** en la misma materia, **sin auto-enlaces** (`from === to`) y
  **sin repetidos** (deduplicadas por el par). Son las mismas reglas que aplicaba
  `resolveLinks` del sync, ahora en el build. Un wikilink roto no genera arista: queda como
  advertencia.
- **`study`** trae solo lo que escribió la materia. Los **mazos automáticos no se guardan**:
  los calcula la web con `autoDecks(config, pages)` y los agrega al final de `decks`, para que
  un cambio en la heurística no obligue a recompilar (N0-27).
- **`warnings`** son las advertencias del compilador y del material de estudio, ya formateadas
  como texto. Existen para el reporte —la vista de la materia y la revisión del PR— y **no
  detienen nada**: el contenido nunca rompe una publicación (principio 4). Con `--strict`,
  `site build` sí sale `1`, y eso es una decisión del build, no del contrato.

### 2.4 `pages.json` — `SitePages`

```ts
SitePages = {
  format: 1,
  pages: Record<Slug, { body: string, links: PageLink[], headings: PageHeading[] }>
}
```

Es lo que `PageMeta` deja afuera. Se carga **una sola vez por materia**, al abrir la primera
página o al buscar, y alimenta el lector, la búsqueda y los enlaces entrantes. `links` acá es
el wikilink **tal como se escribió** (con su ancla y su texto, aunque el destino no exista);
las aristas resueltas son las de `subject.json`.

### 2.5 `tools.json` — `SiteTools`

```ts
SiteTools = { format: 1, tools: ToolInfo[] }   // ≤ 64
```

Cada `ToolInfo` lleva `manifest`, `bytes`, `updatedAt` y `base`. La `base` que escribe el
build es **relativa al sitio y sin barra final**:

```ts
siteToolBase(slug, toolId)   // "subjects/proba/tools/proba-tools"
```

La web la prefija con `BASE_URL` al cargar el bundle y compone `${base}/${path}`. Los archivos
se copian tal cual bajo `subjects/<slug>/tools/<id>/`, con las rutas del manifiesto
(`ToolFilePath`: relativas, sin `..`, con extensión de la lista cerrada). Detalle completo en
`04-herramientas-y-figuras.md`.

---

## 3. Qué sobrevive cuando una página o una tarjeta desaparece

La regla no cambió con el sitio estático, solo cambió dónde vive el estado: antes en una base
de datos por usuario, ahora en el navegador (§4).

**El estado personal se guarda por slug o por id y no se borra nunca.** Si una página deja de
existir en la materia, su marca de estudiada, su favorito y su apunte **siguen guardados**; si
el slug vuelve en una publicación posterior, la marca reaparece intacta. Lo mismo con las
tarjetas (`srs`), las tareas hechas (`tasksDone`), los intentos de quiz (`attempts`) y las
fechas del plan (`planDates`).

Lo único que cambia es **qué se muestra**: el repaso espaciado de tarjetas que ya no existen
en el material vigente **no se muestra ni se cuenta**. La entrada queda en el documento local,
pero se filtra al leer el estado de estudio, igual que hacía `GET /study/state`. Consecuencia
práctica: reordenar un mazo sin `{#id}` cambia los ids y el progreso de esas tarjetas
desaparece de la vista aunque el dato siga ahí (principio 7).

Las materias placeholder (creadas a mano desde la landing, sin fuente en `subjects/`) y las
materias ocultas son casos del mismo régimen: son estado del usuario y viven en `LocalLanding`.

---

## 4. La copia de seguridad — `LocalBackup`

El estado personal es **un solo documento**. Se guarda en IndexedDB (`LOCAL_DB_NAME` =
`sinapsis`, `LOCAL_DB_STORE` = `state`, clave `"backup"`) y, en espejo, en `localStorage`
(`sinapsis.backup`); al arrancar se leen las dos y gana la de `savedAt` más reciente, y si
falta una se repone desde la otra. **Ese mismo documento es el archivo de la copia de
seguridad**: exportar es escribirlo a disco; importar es validarlo y reemplazar.

```ts
LocalBackup = {
  format: 1,                                  // BACKUP_FORMAT
  savedAt: string,                            // ISO de la última escritura: decide cuál copia gana
  exportedAt?: string,                        // ISO; solo en el archivo exportado
  profile: LocalProfile,
  landing: LocalLanding,
  subjects: Record<Slug, LocalSubjectState>,
}
```

| Pieza | Forma |
|---|---|
| `LocalProfile` | `{ name: string ≤ 120 (default "Estudiante"), theme: ThemeId (default "pergamino") }`. Reemplaza al usuario de Google: no hay correo ni foto. |
| `LocalLanding` | `{ placements: Record<Slug, { semester, position }>, semesters: string[] ≤ 64, hidden: Slug[], placeholders: LocalPlaceholder[] ≤ 64 }`. `semesters` incluye los cuatrimestres vacíos y se guarda en forma canónica (`canonicalSemester`, N0-32); `hidden` son materias del catálogo que el usuario quitó de su landing; `placeholders` son materias que creó a mano y no existen en `subjects/`. |
| `LocalPlaceholder` | `{ slug, name, code, institution, color?, division, createdAt }`. |
| `LocalSubjectState` | `StudyState` (`srs`, `bookmarks`, `notes`, `tasksDone`, `attempts`, `planDates`) **más** `studied: Record<Slug, string>`: slug de página → fecha ISO en que se marcó estudiada (la fecha es lo que alimenta «Repaso de hoy»). |

Helpers del contrato: `emptyBackup(savedAt?)` y `emptySubjectState()` construyen los
documentos vacíos; `LocalBackupSubjectIds` (`{ cards: StudyId[], tasks: StudyId[] }`) sirve
para contrastar un backup contra el material vigente, si hace falta.

### 4.1 El archivo

- Nombre: `sinapsis-backup-AAAA-MM-DD.json`.
- Contenido: el `LocalBackup` completo, con `exportedAt`.
- Al restaurar se **valida con el esquema**; un archivo que no cumple se rechaza entero, sin
  fusiones parciales. Restaurar **reemplaza** el estado y recarga las consultas.
- `BACKUP_FORMAT` sube solo con cambios incompatibles; un archivo con otro `format` no valida.

### 4.2 Persistencia

- Escrituras: en memoria de inmediato; a IndexedDB y `localStorage` con rebote corto (≤ 300 ms)
  y también en `pagehide` / `visibilitychange`, para no perder la última acción al cerrar.
- `navigator.storage.persist()` se pide **en la primera mutación del usuario**, no al cargar:
  el permiso se justifica con un dato que ya vale la pena guardar.
- El sitio declara `manifest.webmanifest`: instalado como aplicación, Chrome habilita el
  almacenamiento persistente automáticamente.
- Aun así el estado vive en **un solo navegador**: no se sincroniza entre dispositivos y un
  borrado de datos del sitio lo elimina. La copia de seguridad es la red.

---

## 5. Errores típicos

| Síntoma | Causa | Arreglo |
|---|---|---|
| `publish` borró páginas que no se querían borrar | Se publicó apuntando a un wiki incompleto (`--wiki` equivocado). | Volver a publicar con el wiki correcto: el estado personal sobrevivió. |
| El material de estudio desapareció | Se publicó sin la carpeta `estudio/`: el reemplazo la dejó vacía. | Restaurarla y volver a publicar. |
| «No hay nada que publicar» | La fuente del repositorio ya coincide con el vault. | Es lo correcto. |
| El CI del PR falla en `subject-pr` | El diff toca algo fuera de `subjects/<slug>/`. | Sacar ese cambio del PR; si es un cambio de la plataforma, va por una propuesta. |
| `site build` sale `1` | Un config que no valida, una ruta que se escapa de su carpeta o un bundle roto. | El mensaje nombra la materia y el campo. |
| La web no ve una materia nueva | Falta correr `pnpm build:subjects` (o `pnpm dev`, que lo hace). | Recompilar. |
| Los archivos del sitio no están en git | Es deliberado: `apps/web/public/subjects/` es generado y está en `.gitignore`. | — |
| Se abrió el sitio de Pages y da 404 en una ruta interna | El deploy no copió `404.html`, o la fuente de Pages no es «GitHub Actions». | Revisar `vite.config.ts` y *Settings → Pages*. |
| Se perdió el progreso al limpiar el navegador | El estado es local por diseño (N0-56). | Restaurar una copia de seguridad; descargar una antes de limpiar. |

---

## Fuente ejecutable

- `packages/contract/src/site.ts` — `SITE_FORMAT`, `SITE_DATA_DIR`, `sitePaths`,
  `siteToolBase`, `SiteCatalog`, `SiteCatalogEntry`, `SiteSubject`, `SitePages`,
  `SitePageBody`, `SiteTools`, `BACKUP_FORMAT`, `LocalProfile`, `LocalPlaceholder`,
  `LocalPlacement`, `LocalLanding`, `LocalSubjectState`, `LocalBackup`,
  `LocalBackupSubjectIds`, `emptyBackup`, `emptySubjectState`, `LOCAL_DB_NAME`,
  `LOCAL_DB_STORE`.
- `packages/contract/src/index.ts` — `SubjectConfig`, `Page`, `PageMeta`, `GraphEdge`,
  `StudyContent`, `StudyState`, `ToolInfo`, `autoDecks`, `canonicalSemester`, `sm2`.
- `packages/cli/src/commands/publish.ts` — qué se copia, la rama, el commit y el PR.
- `packages/cli/src/commands/site.ts` — `site build`.
- `packages/markdown/src/compile.ts` — el compilador del wiki y sus advertencias.
- `packages/cli/src/tools/bundle.ts` — `buildBundle`.
- `apps/web/src/local/` — el documento local, el espejo y la copia de seguridad.
- `apps/web/src/lib/api.ts` — la única costura entre las vistas y los datos.
- `.github/workflows/ci.yml` — los gates y la regla del PR de materia.
- `.github/workflows/pages.yml` — el build y el deploy.

## Decisiones relacionadas

N0-56 (sitio estático sin API ni sesión, estado personal en el navegador) ·
N0-57 (materias como fuente en `subjects/`, compiladas en el build) ·
N0-58 (integración por PR, sin coautoría) · N0-59 (`basename` y `404.html`) ·
N0-60 (búsqueda y grafo en el cliente) · N0-23 (divisiones efectivas) ·
N0-27 (el estudio es contenido de la materia; los mazos automáticos los calcula la
plataforma) · N0-28 (SM-2) · N0-32 (cuatrimestres canónicos) ·
N0-41 y N0-42 (bundles de herramientas y figuras).
