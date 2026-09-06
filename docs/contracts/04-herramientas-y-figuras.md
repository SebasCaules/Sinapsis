# 04 · Herramientas y figuras — bundles, runtime y `CompatApp`

Una **herramienta** es una vista propia de la materia (un explorador, una calculadora, un
laboratorio). Una **figura** es un dibujo interactivo que el lector monta dentro de una
página del wiki. Las dos salen del mismo lugar: un **bundle** de scripts clásicos que el CLI
empaqueta, que viaja dentro de `subjects/<slug>/tools/` y que el sitio sirve como archivos
estáticos (N0-41, N0-42 y N0-57).

No hay React, ni módulos ES, ni paso de compilación obligatorio: son archivos `.js` que se
cargan en orden y hablan con `window.App`. Es a propósito, para poder mudar herramientas ya
escritas sin reescribirlas.

---

## 1. Qué es un bundle

```
<repositorio de la materia>/
  sinapsis.config.json
  tools/                      ← la carpeta por defecto (<config>/tools)
    <id>/
      sinapsis.tools.json     ← el manifiesto (obligatorio)
      lib-math.js             ← scripts clásicos, se cargan EN ORDEN
      tools.js
      figuras/u1.js
      css/tools.css
      data/datos.json
      dist/tool-push.json     ← lo escribe `tools build`; no se versiona
      .dist/                  ← scripts minificados con --minify; no se versiona
```

`sinapsis tools build` descubre los bundles solo: si `tools/` tiene manifiesto, es **un**
bundle; si no, lo es cada subcarpeta de primer nivel que lo tenga. Se saltan las carpetas que
empiezan con `.` y las llamadas `dist`, `.dist` y `node_modules`.

Un bundle es, entonces: **un manifiesto + los archivos que declara + los archivos sueltos que
hagan falta en tiempo de ejecución**.

---

## 2. `sinapsis.tools.json` — el manifiesto (`ToolManifest`)

```jsonc
{
  "id": "proba-tools",              // ^[a-z][a-z0-9_-]*$, ≤ 48. Es la URL del bundle.
  "title": "Herramientas de Probabilidad",
  "version": "1.0.0",               // texto libre; súbala cuando cambie el bundle
  "description": "Explorador, calculadoras y las figuras del wiki.",
  "runtime": 1,                     // versión del runtime que necesita (hoy: 1)

  "scripts": ["lib-math.js", "tools.js", "figuras/u1.js"],  // se cargan EN ORDEN
  "styles": ["css/tools.css"],      // se inyectan con el bundle y se quitan al salir
  "data": ["data/datos.json"],      // quedan en App.DATA["datos"]

  "views": [                        // cada vista abre en /m/<materia>/t/<id de vista>
    { "id": "explorador", "label": "Explorador de distribuciones",
      "icon": "chart", "layout": "wide" }
  ],
  "figures": true,                  // true si registra figuras para los callouts [!figura]
  "progress": false                 // true si registra proveedores de progreso (§6.5)
}
```

| Campo | Tipo | Obligatorio | Default | Límite | Descripción |
|---|---|---|---|---|---|
| `id` | texto | **sí** | — | `^[a-z][a-z0-9_-]*$`, 1–48 | Identidad del bundle. Es el segmento de la URL y tiene que coincidir con el de `PUT …/tools/:id`. |
| `title` | texto | **sí** | — | 1–120 | Nombre legible. |
| `version` | texto | **sí** | — | 1–40 | Libre (`1.0.0`, `2026-09-06`). **No se compara ni se valida**: es trazabilidad. |
| `description` | texto | no | — | ≤ 600 | — |
| `runtime` | número | no | `1` | literal `RUNTIME_VERSION` = `1` | Cualquier otro valor **falla** la validación. |
| `scripts` | `ToolFilePath[]` | no | `[]` | ≤ 64 | Se cargan **en este orden**, encadenados. |
| `styles` | `ToolFilePath[]` | no | `[]` | ≤ 32 | Se inyectan como `<link rel="stylesheet">` y se quitan al descargar el bundle. |
| `views` | `ToolView[]` | no | `[]` | ≤ 32 | Vistas que el bundle promete registrar. |
| `figures` | booleano | no | `false` | — | `true` si registra figuras para los callouts `[!figura]`. |
| `progress` | booleano | no | `false` | — | `true` si registra proveedores de progreso (`App.registerProgressProvider`). Igual que `figures`, **el bundle se carga al entrar en la materia**: la barra de cada división tiene que poder contar sus pasos sin que nadie abra la herramienta. Ver §6.5. |
| `data` | `ToolFilePath[]` | no | `[]` | ≤ 16 | JSON que el runtime pide **antes** de cargar los scripts y deja en `App.DATA`. |

### `ToolView`

| Campo | Tipo | Obligatorio | Default | Límite | Descripción |
|---|---|---|---|---|---|
| `id` | texto | **sí** | — | `^[a-z][a-z0-9_-]*$`, 1–48 | Lo que el bundle pasa a `App.registerView(id, fn)` y lo que abre `/m/<materia>/t/<id>`. **Es el `target` de un ítem `kind: "tool"` del rail.** |
| `label` | texto | **sí** | — | 1–80 | Nombre de la vista. |
| `icon` | `IconName` | no | — | registro cerrado | — |
| `layout` | `"wide"` \| `"full"` | no | `"wide"` | — | `wide` = 1120 px; `full` = todo el ancho del área de contenido. |

### `ToolFilePath` — las rutas admitidas

Una ruta relativa a la carpeta del bundle. Cuatro reglas, todas obligatorias:

1. Caracteres: `^[a-zA-Z0-9_][a-zA-Z0-9_./-]*$`, 1–200.
2. Relativa y sin `..`: no empieza con `/` ni contiene un segmento `..`.
3. **Ya normalizada**: sin `./`, sin `//` y sin barra final.
4. Extensión de la lista cerrada:

```
js  mjs  css  json  svg  png  jpg  jpeg  webp  woff  woff2  txt  md  csv
```

Cualquier otra extensión no se publica. Además del esquema, el CLI resuelve cada ruta contra
la carpeta del bundle (siguiendo los enlaces simbólicos) y comprueba que el resultado siga
cayendo adentro: la primera regla es del contrato, la segunda es la que de verdad impide leer
o copiar fuera.

---

## 3. Qué viaja y qué no

| Archivo de la carpeta | ¿Viaja? | Por qué |
|---|---|---|
| Declarado en `scripts`, `styles` o `data` | **Sí** | El runtime lo carga. |
| Suelto, sin declarar, y **no** es `.js` / `.mjs` / `.css` (una fuente, una imagen que pide el CSS, un `.md`) | **Sí** | Sirve en tiempo de ejecución y no se declara en ningún lado. |
| Suelto y **es** `.js`, `.mjs` o `.css` | **No** | El runtime solo carga lo que está en `scripts` y `styles`: subirlo publicaría código muerto o scripts de construcción. Aviso amarillo, no error. |
| Con extensión ajena al contrato (`.ts`, `.html`, `.yaml`) | **No** | Aviso amarillo. |
| Bajo `dist/`, `.dist/`, `node_modules/` o una carpeta que empieza con `.` | **No** | Nunca forman parte del bundle. |

Codificación en el `ToolPush`: `utf8` para `.js .mjs .css .json .svg .txt .md .csv`,
`base64` para el resto.

**Topes**: 20 MB por bundle (`MAX_TOOL_BYTES`, ya decodificado) y **400 archivos**
(`ToolPush.files`, mínimo 1).

---

## 4. `ToolPush`, `ToolFile` y `ToolInfo`

Lo que el CLI arma al empaquetar un bundle y lo que el sitio publica.

```ts
ToolPush  = { manifest: ToolManifest, files: ToolFile[] }      // 1..400 archivos
ToolFile  = { path: ToolFilePath, encoding: "utf8" | "base64", content: string }
ToolInfo  = { manifest: ToolManifest, bytes: number, updatedAt: string, base: string }
```

`ToolPush` es el bundle **en memoria**: lo que `tools build` valida y lo que `publish` y
`site build` copian a disco. Ya no viaja por la red: no hay servidor al que subirlo.
`ToolInfo` es lo que queda escrito en `subjects/<slug>/tools.json` (`SiteTools`):

| `ToolInfo` | Qué es |
|---|---|
| `manifest` | El manifiesto tal como se publicó. |
| `bytes` | Suma de los bytes decodificados del bundle. |
| `updatedAt` | ISO de la última compilación del bundle. |
| `base` | Base de las rutas de los archivos, **relativa al sitio y sin barra final**. |

`base` lo calcula el contrato con `siteToolBase(slug, toolId)` (`packages/contract/src/site.ts`):

```
subjects/<slug>/tools/<id>
```

La web la prefija con `import.meta.env.BASE_URL` y compone `${base}/${path}`; el helper
equivalente que ya trae el prefijo es `sitePaths.toolFile(base, slug, toolId, path)`. Las dos
formas coinciden carácter por carácter: **no armes la URL a mano**.

---

## 5. Cómo se sirven los archivos

Como archivos estáticos: `site build` los copia bajo
`apps/web/public/subjects/<slug>/tools/<id>/<path>` y el sitio los entrega igual que a
cualquier otro asset (Vite en desarrollo, GitHub Pages en producción).

| Aspecto | Comportamiento |
|---|---|
| `Content-Type` | Lo decide el servidor estático por extensión. La lista cerrada de `ToolFilePath` (§5.1) es lo que garantiza que nunca se publique una extensión que el navegador interprete de forma inesperada. |
| Caché | La del host estático. GitHub Pages sirve los archivos con su propia política y un `ETag` derivado del contenido: un bundle que no cambió cuesta un `304`. |
| Ruta inválida o fuera de la carpeta | No llega a publicarse: el CLI la rechaza al empaquetar. |
| Archivo inexistente | `404` del host estático. |

### 5.1 Tipos MIME esperados

Los que corresponden a la lista cerrada de extensiones. No los fija la plataforma —los pone el
host estático—, pero son los que el runtime espera al cargar un bundle:

| Extensión | `Content-Type` |
|---|---|
| `js`, `mjs` | `text/javascript; charset=utf-8` |
| `css` | `text/css; charset=utf-8` |
| `json` | `application/json; charset=utf-8` |
| `svg` | `image/svg+xml` |
| `png` | `image/png` |
| `jpg`, `jpeg` | `image/jpeg` |
| `webp` | `image/webp` |
| `woff` | `font/woff` |
| `woff2` | `font/woff2` |
| `txt` | `text/plain; charset=utf-8` |
| `md` | `text/markdown; charset=utf-8` |
| `csv` | `text/csv; charset=utf-8` |

### 5.2 Dónde viven

En tres lugares, y conviene no confundirlos:

| Lugar | Qué es |
|---|---|
| `<vault>/tools/<id>/` | La **fuente**, en el repositorio de la materia. Puede tener `dist/`, `.dist/` y scripts de construcción. |
| `subjects/<slug>/tools/<id>/` | Lo **publicado**, en el repositorio de la plataforma: el manifiesto y los archivos que el runtime carga, nada más. Lo escribe `publish`. |
| `apps/web/public/subjects/<slug>/tools/<id>/` | Lo **compilado**, generado por `site build` y no versionado. |

**Los bundles viajan con la materia**: `publish` reemplaza `subjects/<slug>/` entero, así que
borrar un bundle del vault lo borra del sitio en la siguiente publicación. Es lo contrario de
lo que pasaba antes del Sprint 4, cuando los bundles tenían su propio ciclo de vida.

---

## 6. El runtime del navegador

La plataforma instala, mientras hay una materia abierta:

- `window.SinapsisRuntime` — el mando del host (`SinapsisRuntime` del contrato).
- `window.App` — la superficie de compatibilidad (`CompatApp`).
- `window.M` — la biblioteca numérica (`App.M`).

Un bundle es **JavaScript clásico**: se carga después del runtime y registra lo suyo contra
`window.App`. Nada de `import`/`export`, nada de `type="module"`.

### 6.1 `SinapsisRuntime` — lo que garantiza el contrato

| Miembro | Firma | Qué hace |
|---|---|---|
| `version` | `1` | Versión del runtime instalado. |
| `subject` | `string \| null` | Slug de la materia activa; `null` fuera de una materia. |
| `theme` | `ThemeId` | `pergamino` · `laurel` · `claustro`. |
| `App` | `CompatApp` | La superficie de abajo. |
| `loadBundle(info)` | `({ id, base, scripts, styles, data }) => Promise<void>` | Carga un bundle **una sola vez**; resuelve cuando registró sus vistas y figuras. |
| `unloadBundle(id)` | `(string) => void` | Quita sus `<script>` y `<link>`, y desregistra sus vistas y figuras. |
| `view(id)` | `(string) => ViewFn \| null` | La vista registrada por algún bundle cargado. |
| `onThemeChange(fn)` | `((theme) => void) => () => void` | Suscripción al cambio de tema; devuelve el desuscriptor. |
| `bindView(container)` | `(HTMLElement) => () => void` | Ata el contenedor de la vista montada: pasa a ser el ámbito de `App.$` y `App.$$`, y recibe la delegación de los clics de navegación (`[data-nav]`, `[data-go]`, `a.wikilink[data-slug]`) hacia `App.go` — sin recargar la página. Solo intercepta el clic «normal»: los del botón secundario, los que llevan modificador (⌘, Ctrl, ⇧, Alt), los ya cancelados y los `target="_blank"` pasan de largo. Devuelve el desatador, que **el host llama al desmontar**; también limpia `setRedraw`. Lo llama el host, no el bundle. |

### 6.2 `CompatApp` — la superficie de `window.App`

Es la que garantiza el contrato (`packages/contract/src/runtime.ts`). Los nombres son los del
baseline de Proba: lo marcado «compat» existe para no reescribir código ya escrito.

**Registro**

| Miembro | Firma | Semántica |
|---|---|---|
| `registerView` | `(id: string, fn: ViewFn) => void` | Registra una vista. `ViewFn = (main: HTMLElement, arg?: string) => void \| (() => void)`: escribe dentro de `main` y puede devolver un limpiador que el host llama al desmontar. |
| `registerFigure` | `(id: string, draw: FigureDraw, meta?: FigureMeta) => void` | Registra una figura. `FigureDraw = (host, ctx, meta?) => void \| (() => void)`. |
| `registerAction` | `(name: string, fn: (el, ev) => void) => void` | Compat: engancha los clics en `[data-action="name"]` (delegación global instalada por el runtime). |
| `mountFigures` | `(container: HTMLElement \| Document) => number` | Recorre los `[data-fig]` del contenedor, los dibuja y devuelve cuántos montó. |
| `unmountFigures` | `(container) => number` | Los desmonta, corriendo sus limpiadores. |
| `setRedraw` | `(fn: (() => void) \| null) => void` | Compat: la vista registra su propio redibujo para el cambio de tema. |
| `FIGURES` | `Record<string, { draw, meta }>` | Registro de figuras (lectura). |

**Datos de la materia (solo lectura)**

| Miembro | Tipo | Qué es |
|---|---|---|
| `SUBJECT` | `{ slug, config }` | La materia activa y su `SubjectConfigLoose`. |
| `PAGES` | `PageMeta[]` | Todas las páginas. |
| `CONTENT` | `PageMeta[]` | Solo las que cuentan como contenido (`countsAsContent`). |
| `BY_SLUG` | `Record<string, PageMeta>` | Índice por slug. |
| `UNITS` | `Array<{ key, name, color }>` | Divisiones efectivas con su color resuelto. |
| `TYPES` | `Array<{ key, label }>` | Tipos de página. |
| `unitShort(key)` | `(string) => string` | `U3`, `S07`… (`divisionShort`). |
| `unitMeta(key)` | `(string) => { key, name, color }` | Metadatos de una división. |
| `isStudied(slug)` | `(string) => boolean` | ¿El usuario marcó esa página como estudiada? |
| `STUDY` | `Record<string, unknown>` | Contenido de `data/study-data.json` fundido por clave (compat con el baseline). |
| `DATA` | `Record<string, unknown>` | Los JSON de `manifest.data`, **por nombre de archivo sin extensión**: `data/datos.json` → `App.DATA["datos"]`. |

**Navegación**

| Miembro | Firma | Semántica |
|---|---|---|
| `go(target, opts?)` | `(string, { replace?: boolean }) => void` | Acepta rutas del baseline (`#/p/slug`, `#/unidad/3`, `#/explorador/normal`) y del SPA (`/m/…`). Una URL externa se abre en pestaña nueva. Las rutas desconocidas se leen como una herramienta: `#/<vista>/<arg>` → `/m/<materia>/t/<vista>?arg=<arg>`. |
| `setCrumbs(items)` | `(Array<{ label, href? }>) => void` | Migas de la vista. El host las borra al dejarla. |
| `render()` | `() => void` | Compat: «vuelva a dibujarme». El host re-monta la vista. |
| `toast(message, tone?)` | `(string, "ok" \| "bad") => void` | Aviso efímero. |

**Render**

| Miembro | Firma |
|---|---|
| `escapeHtml(s)` | `(string) => string` |
| `icon(name, size?)` | `(string, number) => string` (SVG del registro cerrado) |
| `katex(tex, display?)` | `(string, boolean) => string`; además `katex.renderToString(tex, opts?)` |
| `KATEX_MACROS` | `Record<string, string>` |
| `renderMarkdown(md, currentSlug?)` | `(string, string) => string` — markdown completo: matemática, wikilinks y callouts |
| `renderMathHtml(html)` | `(string) => string` |
| `rich(text)` | `(string) => string` — texto con `$…$` a HTML en línea |
| `enhanceDoc(root)` | `(HTMLElement) => void` |
| `emptyState(title, sub?)` | `(string, string) => string` |
| `backBar(href, label)` | `(string, string) => string` |
| `fmt(n, digits?)` | `(number, number) => string` |
| `cssVar(name)` | `(string) => string` — token CSS resuelto (`--primary` → `#7c2230`) |
| `withAlpha(color, alpha)` | `(string, number) => string` |
| `quickLookup?(kind, params)` | Compat, **opcional**: burbuja de valores. Ver §6.6. |

**Dibujo y matemática**

| Miembro | Qué es |
|---|---|
| `Fig` | Helpers de dibujo portados de `figures.js` del baseline. |
| `Plot` | Helpers de gráficos portados de `plot.js`. |
| `M` | Biblioteca numérica (`lib-math.js` portada): densidades, acumuladas, inversas, matrices. También en `window.M`. |

**Consulta del DOM y paleta** (compat con el `$`/`$$` del baseline)

| Miembro | Firma | Semántica |
|---|---|---|
| `$(sel, root?)` | `(string, ParentNode \| null) => HTMLElement \| null` | `querySelector` **acotado al contenedor de la vista montada** (el que ató `bindView`); con `root`, dentro de ese nodo. Sin vista montada —o con el contenedor ya desmontado— cae en `document`, como hacía el baseline. |
| `$$(sel, root?)` | `(string, ParentNode \| null) => HTMLElement[]` | Igual, pero devuelve un **array**, no una `NodeList`. |
| `paletteOpen()` | `() => boolean` | ¿Está abierta la paleta ⌘K del shell? Es una **pregunta**, no una orden: así la usa el baseline para que Escape cierre lo suyo solo si la paleta no está abierta. |
| `openPalette()` | `() => void` | Abre la paleta ⌘K del shell. |

> Una vista que cuelgue marcado de `document.body` (una burbuja flotante, por ejemplo) tiene
> que pasar su raíz a mano: `App.$(".x", miNodo)`.

### 6.3 `FigureContext` — el `api` que recibe cada figura

`draw(host, ctx, meta?)`:

| Miembro | Tipo | Qué es |
|---|---|---|
| `id` | `string` | El id con el que se registró. |
| `host` | `HTMLElement` | Dónde dibujar (el `.fig-host` del callout). |
| `figure` | `HTMLElement` | El bloque completo, con epígrafe. |
| `Fig` | `Record<string, unknown>` | Los helpers de dibujo (`App.Fig`). |
| `state` | `Record<string, unknown>` | Estado **por instancia** de figura (controles interactivos). |
| `setState(patch)` | `(patch) => void` | Fusiona en `state` y redibuja. |
| `cleanup(fn)` | `(() => void) => void` | Registra un limpiador (listeners, timers) que corre al desmontar. |
| `theme` | `ThemeId` | Tema vigente. |
| `cssVar(name)` | `(string) => string` | Token CSS resuelto. |
| `redraw()` | `() => void` | Vuelve a dibujar (por ejemplo, tras cambiar el tema). |

`FigureMeta`: `{ caption?: string, height?: number, …extra }`. `caption` es el epígrafe por
defecto si el callout no trae texto; `height` es el alto sugerido en px.

### 6.4 Extensiones del runtime que el contrato todavía no nombra

La implementación (`packages/runtime`) publica en `window.App` algunos miembros que
`CompatApp` no declara, porque los usan los módulos portados del baseline: `fmt4`, `fmt6`,
`joinInlineMath`, `refitFormulas`, `figureMarkup`, `shuffle`, `VIEWS`, `view(id)`, `ACTIONS`,
`runAction`, `redraw()`, `MathLib` y `subject`.

**No son contrato**: un bundle que dependa de ellos puede romperse sin que ninguna propuesta
lo anuncie. Si a una materia le hacen falta, el camino es proponer que entren en `CompatApp`
(ver `07-propuestas.md`).

### 6.5 Progreso: `registerProgressProvider` y `progressChanged`

La barra de progreso de una división cuenta sus **páginas de contenido leídas** más los
**pasos** que declaran los bundles con `"progress": true` en el manifiesto (N0-61). Cada
paso vale uno, igual que una página: un ejercicio resuelto es tanto trabajo como una página
leída.

| Miembro | Firma | Semántica |
|---|---|---|
| `registerProgressProvider(p)` | `(ProgressProvider) => void` | Registra un proveedor. El registro es **del bundle**: se olvida al descargarlo (salir de la materia). |
| `progressChanged()` | `() => void` | Avisa de que el estado de los pasos cambió. El anfitrión vuelve a pedirlos y redibuja las barras. |

```ts
interface ProgressProvider {
  id: string;                                  // identidad dentro del bundle
  label: string;                               // plural y en minúsculas: «ejercicios»
  stepsOf(division: string): ProgressStep[];   // los pasos de esa división
}

interface ProgressStep {
  id: string;        // estable dentro del proveedor (no se muestra)
  label: string;     // rótulo del paso
  done: boolean;     // el criterio lo pone el bundle
  group?: string;    // «Guía», «Parciales»: el anfitrión dibuja una tarjeta por grupo
  to?: string;       // destino del grupo, ruta del SPA: /m/<materia>/t/<vista>?arg=…
}
```

`stepsOf` se consulta **cada vez** que la plataforma recalcula el progreso, así que devuelve
el estado del momento; el bundle no cachea nada y avisa con `progressChanged()`.

Dónde se ve: la barra y el porcentaje del hero de la división y las filas del inicio usan el
total combinado; el texto lo desglosa («12 / 20 páginas leídas · 8 / 34 ejercicios
resueltos», con el `label` del proveedor), y la portada de la división lista una tarjeta por
`group` con su enlace `to`. El progreso del lector sigue hablando solo de páginas.

Ejemplo mínimo:

```js
if (typeof A.registerProgressProvider === "function") {   // runtime viejo: no rompe
  A.registerProgressProvider({
    id: "ejercicios",
    label: "ejercicios",
    stepsOf: function (u) {
      return itemsOf(u).map(function (it) {
        return {
          id: it.id,
          label: "n.º " + it.numero,
          done: getEstado(it.id) >= 1,
          group: "Guía",
          to: "/m/" + A.SUBJECT.slug + "/t/ejercicios?arg=" + encodeURIComponent(u + "/guia")
        };
      });
    }
  });
}
// y en el punto donde se guarda el estado:
if (typeof A.progressChanged === "function") A.progressChanged();
```

Del lado del runtime, `SinapsisRuntime.progressProviders()` devuelve los proveedores de los
bundles cargados y `SinapsisRuntime.onProgressChange(fn)` suscribe al aviso (devuelve el
desuscriptor).

### 6.6 `quickLookup` no lo provee el runtime

`CompatApp.quickLookup` está declarado **opcional** en el contrato y el runtime **no lo
implementa**: en Proba lo instala el propio bundle (`lookup.js` hace `A.quickLookup = api`) y
otro script del mismo bundle lo consume comprobando antes que exista. Un bundle no puede
contar con él salvo que lo traiga él mismo.

---

## 7. Ciclo de vida de una vista

Lo que hace el host (`/m/:slug/t/:vista`):

1. Busca el bundle cuyo manifiesto declara esa vista. Si no hay ninguno, muestra
   «Próximamente» con el nombre que la materia le dio en el rail.
2. Carga el bundle (una sola vez por visita): primero los `data` (por `fetch` al propio
   origen del sitio), después los `styles`, después los `scripts` **en orden y
   encadenados** — el siguiente se inserta recién cuando el anterior disparó `load`.
3. Ata el contenedor con `bindView(main)` **antes de dibujar** —una vista puede llamar a
   `App.$` mientras se monta y tiene que ver su propio contenedor, no el documento entero— y
   después monta la vista: `fn(main, arg)`, donde `main` es un `<div class="sinapsis-tool">`
   vacío y `arg` viene de `?arg=` en la URL.
4. Al salir: llama al desatador de `bindView`, al limpiador que devolvió la vista, vacía el
   nodo y borra las migas que la vista haya pedido.
5. Al cambiar de tema: si la vista registró un redibujo con `setRedraw`, el runtime lo llama;
   si no, el host **vuelve a montar la vista** entera.
6. `App.render()` fuerza un re-montaje.

Detalles del cargador que importan al escribir un bundle:

- **Idempotente por id**: pedir dos veces el mismo bundle devuelve la misma promesa.
- **Serializado**: mientras un bundle carga, sus `registerView` / `registerFigure` se le
  atribuyen a él, para que `unloadBundle` sepa qué sacar.
- **Un script que falla corta la carga** con un error que nombra la URL, y el bundle no queda
  marcado como cargado (se puede reintentar).
- Al desinstalar el runtime (cambio de materia, salida) se descargan todos los bundles y se
  borran los globales.

---

## 8. CSS: todo acotado a `.sinapsis-tool`

El contenedor que el host le entrega a una vista lleva la clase **global** `sinapsis-tool`
(más `data-layout`, `data-tool` y `data-view`). Es la clase contra la que están escritos los
estilos de los bundles.

Reglas:

- **Todo selector del bundle cuelga de `.sinapsis-tool`** (o de una clase propia del bundle
  dentro de él). Una hoja que estilice `body`, `a`, `h1` o `.card` a secas pisa el shell de la
  plataforma y el de las demás materias: los `<link>` de un bundle viven en `<head>` mientras
  el bundle esté cargado.
- Los colores salen de `cssVar` / `ctx.cssVar`, nunca de literales: hay tres temas y el bundle
  se redibuja al cambiarlos.
- El host se encarga del ancho (`wide` 1120 · `full`) y de que las imágenes, `canvas` y `svg`
  no desborden. El bundle no fija el ancho del área de contenido.

---

## 9. Requisitos del host (lo que la plataforma garantiza)

- `window.App`, `window.M` y `window.SinapsisRuntime` están instalados **antes** de que se
  cargue el primer script del bundle.
- Los `data` del manifiesto ya están en `App.DATA` (y `study-data.json`, además, fundido en
  `App.STUDY`) antes de que corra ningún script.
- Los `styles` ya están inyectados.
- Hay exactamente **una materia abierta a la vez**: instalar el runtime de otra desmonta el
  anterior.
- La delegación de `data-action` está activa a nivel documento.
- El contenedor de la vista ya está atado con `bindView` cuando corre la función de la vista:
  `App.$` y `App.$$` ven ese nodo, y los clics de navegación del marcado que emita se
  resuelven con `App.go` sin recargar la página.
- El marcado de figura que emite el lector para `> [!figura] <id>` es el mismo que espera
  `mountFigures`: `<figure class="figura doc-figure" data-fig="<id>"><div class="fig-host">…`.
  Una figura registrada sirve igual en el wiki y dentro de una vista propia.

---

## 10. Reglas de convivencia (obligatorias)

El bundle corre **en el origen de la plataforma** y comparte el ámbito global con ella y con
los demás bundles.

1. **Envolver todo en un IIFE.** No colgar nada de `window` salvo por `App.register*`.
2. **No tocar el DOM fuera de `main`** (en una vista) o de `host` (en una figura).
3. **Texto que no escribió el autor del bundle** —el título de una página, lo que tipeó el
   usuario, un dato del JSON— se inserta con `textContent` o pasando por `App.escapeHtml`.
   Para markdown y matemática están `App.renderMarkdown` y `App.rich`, que ya escapan lo que
   corresponde. Armar marcado concatenando valores crudos es la única forma de romper la
   plataforma desde un bundle.
4. **Nada de `fetch` a terceros ni de `eval`.** Si hace falta un dato, va en `data`.
5. **Devolver un limpiador** desde la vista si se ataron listeners o timers fuera de `main`;
   en una figura, usar `ctx.cleanup(fn)`.
6. **Los colores salen de `cssVar`.**

### Seguridad: el modelo de amenaza, dicho en voz alta (N0-41, S-14)

El código de un bundle **corre en el origen del sitio, sin sandbox**. Tiene acceso al DOM del
shell y al almacenamiento local del sitio, que es donde vive todo el estado personal
(IndexedDB y `localStorage`).

Eso es aceptable hoy porque **los repositorios de materia son del propio usuario**: la
plataforma es personal y publicar un bundle es equivalente a ejecutar código propio en el
navegador propio. Queda anotado en la decisión N0-41 que, si la plataforma se comparte entre
usuarios, hace falta sandbox por iframe (pendiente **S-14**).

Lo que sí hace la plataforma para contener el daño accidental:

| Barrera | Dónde |
|---|---|
| Rutas validadas con `ToolFilePath` **y** resueltas contra la carpeta del bundle | CLI (`tools build`, `publish`, `site build`) |
| Enlaces simbólicos que salen de la carpeta, rechazados | CLI (`realpath` + `isInside`) |
| Cada script parsea (`node --check`) antes de publicarse | CLI |
| Extensiones de la lista cerrada: nada que el navegador interprete de forma inesperada | contrato |
| Tope de 20 MB y 400 archivos | contrato y CLI |
| El bundle entra por un PR revisado, con el diff a la vista | `/sinapsis-review` |
| CSS acotado a `.sinapsis-tool` | convención + host |

---

## 11. Bundle mínimo completo

Tres archivos: una vista que dibuja y una figura para los callouts del wiki.

**`tools/demo/sinapsis.tools.json`**

```json
{
  "id": "demo",
  "title": "Demostración",
  "version": "0.1.0",
  "scripts": ["demo.js"],
  "styles": ["demo.css"],
  "views": [{ "id": "demo", "label": "Vista de ejemplo", "icon": "flask", "layout": "wide" }],
  "figures": true
}
```

**`tools/demo/demo.js`**

```js
(function () {
  "use strict";
  var App = window.App;
  var SVG = "http://www.w3.org/2000/svg";

  /** Nodo con atributos y texto, sin concatenar marcado. */
  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // --- una vista: se abre en /m/<materia>/t/demo ---------------------------
  App.registerView("demo", function (main) {
    main.replaceChildren();

    var caja = el("div", { class: "demo" });
    caja.append(el("h1", {}, "Vista de ejemplo"));
    caja.append(el("p", {}, "La densidad normal concentra el 95 % en ±1,96 desvíos."));

    // Un hueco de figura: `data-fig` es lo que busca App.mountFigures, igual
    // que en el marcado que emite el lector para `> [!figura] demo-normal`.
    caja.append(el("figure", { class: "figura doc-figure demo-plot", "data-fig": "demo-normal" }));

    main.append(caja);
    App.mountFigures(main);
    return function () { App.unmountFigures(main); };
  });

  // --- una figura: la usa el wiki con `> [!figura] demo-normal` -------------
  App.registerFigure(
    "demo-normal",
    function (host, ctx) {
      var w = 640;
      var h = 220;
      var puntos = [];
      for (var i = 0; i <= 120; i += 1) {
        var x = -4 + (8 * i) / 120;
        var y = Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
        puntos.push(((w * (x + 4)) / 8).toFixed(1) + "," + (h - y * h * 2.2).toFixed(1));
      }

      var svg = document.createElementNS(SVG, "svg");
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", String(h));

      var linea = document.createElementNS(SVG, "polyline");
      linea.setAttribute("fill", "none");
      linea.setAttribute("stroke", ctx.cssVar("--primary"));   // sigue el tema
      linea.setAttribute("stroke-width", "2");
      linea.setAttribute("points", puntos.join(" "));

      svg.append(linea);
      host.replaceChildren(svg);
    },
    { caption: "Densidad de la normal estándar", height: 220 },
  );
})();
```

**`tools/demo/demo.css`**

```css
.demo { max-width: 1120px; }
.demo-plot { margin-block: 16px; }
```

El ítem del rail que la abre, en `sinapsis.config.json`:

```jsonc
{ "id": "demo", "label": "Demostración", "icon": "flask", "kind": "tool", "target": "demo" }
```

`target` es el **id de la vista**, no el del bundle. `sinapsis validate` avisa si ningún
bundle registra esa vista.

Y en cualquier página del wiki, la figura:

```markdown
> [!figura] demo-normal
> La densidad de la normal estándar.
```

Sin bundle cargado, ese callout se sigue viendo como el epígrafe: una materia sin
herramientas no rompe nada.

---

## 12. Comandos y qué verifica cada uno

```bash
SINAPSIS_HOME="${SINAPSIS_HOME:-$HOME/Desktop/Projects/Sinapsis}"

pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build            # valida y empaqueta
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build --minify   # minifica en .dist/ y empaqueta eso
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools list             # qué hay en subjects/<slug>/tools
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish                # wiki + estudio + herramientas
```

`tools push` **ya no existe**: no hay servidor al que subir. Los bundles se publican con la
materia y llegan al sitio con el merge del PR.

Opciones comunes: `--config <file>`, `--dir <carpeta>`, `--repo <dir>`,
`--out <file>` (solo con un bundle).

### Qué revisa `tools build` (sale `1` sin publicar nada)

| Comprobación | Mensaje |
|---|---|
| El manifiesto existe y es JSON válido | `sinapsis.tools.json: no encuentro <ruta>` / `no es JSON válido: …` |
| El manifiesto cumple `ToolManifest` | `sinapsis.tools.json · <campo>: <motivo>` |
| Ninguna ruta se declara dos veces | `<path>: declarado dos veces (script y style)` |
| Cada archivo declarado existe | `<path>: el manifiesto lo declara en «script» pero el archivo no existe` |
| Ningún enlace simbólico sale de la carpeta | `<path>: un enlace simbólico lo saca de la carpeta del bundle` |
| Cada script parsea (`node --check` sobre una copia con su propio `package.json` de tipo `commonjs`) | el archivo y la línea |
| El bundle no supera 20 MB | — |

Avisos amarillos que **no** detienen la build: scripts o estilos sin declarar, archivos con
extensión ajena al contrato, archivos sueltos que el manifiesto no declara (viajan igual).

`tools build` deja el `ToolPush` en `<bundle>/dist/tool-push.json` (o donde diga `--out`).

### Errores al publicar el bundle

Todos hacen salir `1` y ninguno deja el bundle a medias.

| Mensaje | Causa |
|---|---|
| `El id del manifiesto ("a") no coincide con el de la carpeta ("b")` | La carpeta del bundle y su `id` no coinciden. |
| `El manifiesto declara archivos que no existen: …` | Falta un `scripts`/`styles`/`data`. |
| `Archivo "<path>": <motivo>` | Ruta inadmisible o que sale de la carpeta. |
| `El archivo "<path>" viene repetido en el bundle` | Dos entradas con el mismo `path`. |
| `El bundle supera el tope de 20 MB` | — |

---

## 13. Errores típicos

| Síntoma | Causa | Arreglo |
|---|---|---|
| El rail muestra «Próximamente» | Ningún bundle registra esa vista, o el `target` del rail es el id del **bundle**. | Publicar el bundle; usar el id de la **vista**. |
| «El material de la materia no registró la vista «x»» | El manifiesto declara la vista pero el script nunca llama a `App.registerView("x", …)`. | Registrar la vista con ese id exacto. |
| El script no se carga | No está en `scripts` del manifiesto. | Declararlo (los `.js` sueltos no se suben). |
| `SyntaxError` al construir | El script usa `import`/`export` o sintaxis de módulo. | IIFE clásico. |
| La figura no aparece | El bundle no está cargado en el lector, o el id del callout no coincide con el de `registerFigure`. | Comprobar `figures: true` y el id. |
| Los colores no siguen al tema | Se escribieron literales en vez de `ctx.cssVar(…)`. | Usar los tokens. |
| El shell se descompone al abrir la herramienta | El CSS del bundle estiliza selectores globales. | Acotar todo a `.sinapsis-tool`. |
| Al volver a la vista hay listeners duplicados | La vista no devolvió limpiador. | Devolver una función que desate lo que ató. |
| Un dato del bundle llega `undefined` | La clave de `App.DATA` es el nombre del archivo **sin carpeta y sin extensión**. | `data/datos.json` → `App.DATA["datos"]`. |
| El archivo se sirve con un tipo inesperado | Extensión fuera de la tabla MIME del host. | Usar una de las admitidas. |
| Un cambio del bundle no se ve | Falta `pnpm build:subjects` (en local) o falta mergear el PR (en el sitio). | Recompilar, o mirar `gh run list --workflow pages.yml`. |

---

## Fuente ejecutable

- `packages/contract/src/index.ts` — `RUNTIME_VERSION`, `ToolFilePath`, `ToolView`,
  `ToolManifest`, `ToolFile`, `ToolPush`, `ToolInfo`.
- `packages/contract/src/site.ts` — `siteToolBase`, `sitePaths.toolBase`,
  `sitePaths.toolFile`, `SiteTools`.
- `packages/contract/src/runtime.ts` — `CompatApp`, `SinapsisRuntime`, `ViewFn`,
  `FigureDraw`, `FigureMeta`, `FigureContext`, `KatexLike`.
- `packages/runtime/src/index.ts` — `installRuntime`, `uninstallRuntime`.
- `packages/runtime/src/compat.ts` — `createCompatApp`, `translateRoute`, y las extensiones
  fuera del contrato (§6.4).
- `packages/runtime/src/loader.ts` — orden de carga, atribución, `dataKey`, `resolveUrl`.
- `packages/runtime/src/figures.ts` · `plot.ts` · `math.ts` · `markdown.ts` · `icons.ts`.
- `packages/cli/src/tools/bundle.ts` — descubrimiento, validación, `node --check`,
  minificado, `MAX_BYTES`.
- `packages/cli/src/commands/tools.ts` — `tools build | list`, informes.
- `packages/cli/src/commands/publish.ts` — qué archivos del bundle se copian a
  `subjects/<slug>/tools/`.
- `packages/cli/src/commands/site.ts` — la copia al sitio y `tools.json`.
- `apps/web/src/features/subject/tools/ToolHost.tsx` y `ToolHost.module.css` — ciclo de vida
  y `.sinapsis-tool`.
- `skills/sinapsis/reference/herramientas.md` — la misma referencia para el agente de materia.
- `subjects/proba/tools/proba-tools/` — el bundle real (5 vistas, 93 figuras).

## Decisiones relacionadas

N0-41 (bundles de scripts clásicos contra `window.App`/`window.M`; sin sandbox, pendiente
S-14) · N0-42 (las figuras también son bundles) · N0-11 (`kind: "tool"` en el rail) ·
N0-40 (alcance del Sprint 3) · N0-48 (ampliación de `CompatApp`) ·
N0-57 (los bundles viajan en `subjects/<slug>/tools/` y se copian al sitio en el build).
