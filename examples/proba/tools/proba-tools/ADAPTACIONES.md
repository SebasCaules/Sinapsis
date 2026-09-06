# `proba-tools` — adaptaciones respecto del baseline

Bundle de herramientas de la materia **Probabilidad y Estadística (ITBA 93.24)**.
Es una copia del baseline `~/Desktop/ITBA/26-1C/Proba_Obsidian/estudio/` con las
adaptaciones mínimas para correr contra el runtime de la plataforma (N0-41, N0-42).
El baseline es de **solo lectura**: nada de lo que sigue se cambió allá.

Cada diferencia respecto del original está marcada en el código con el
comentario `[bundle]`, y todas están explicadas acá.

---

## 1. Qué contiene el bundle

| Archivo | Origen | kB |
|---|---|---:|
| `sinapsis.tools.json` | escrito para el bundle | 1,3 |
| `data/study-data.js` | **generado** desde `estudio/study-data.js` | 5,7 |
| `data/study-data.json` | **generado** desde `estudio/study-data.js` | 29,9 |
| `lookup.js` | `estudio/lookup.js` | 25,0 |
| `tools.js` | `estudio/tools.js` | 103,3 |
| `taller.js` | `estudio/taller.js` | 46,7 |
| `lab.js` | `estudio/lab.js` | 18,9 |
| `figuras/u1.js … u9.js, u0.js` | `estudio/figuras/*.js` | 613,7 |
| `css/vocab.css` | **generado** desde `estudio/styles.css` (+ `reader.css`, `roadmap.css`) | 38,5 |
| `css/tools.css` | **generado** desde `estudio/tools.css` | 13,0 |
| `css/taller.css` | **generado** desde `estudio/taller.css` | 4,9 |
| `css/lab.css` | **generado** desde `estudio/lab.css` | 0,6 |
| `css/lookup.css` | **generado** desde `estudio/lookup.css` | 8,0 |

**21 archivos, 888 kB** según `sinapsis tools build`. Los tres `scripts/*.mjs`
(41 kB) son herramientas de generación: viven en la carpeta pero el CLI no los
sube (los reporta como «no declarados en el manifiesto», que es lo correcto).

Los tres scripts se corren a mano cuando cambia el baseline:

```
node scripts/extract-study-data.mjs   # data/study-data.{json,js}
node scripts/wrap-css.mjs             # css/*.css
node scripts/smoke.mjs                # verificación sin runtime
```

## 2. Lo que el bundle NO trae

`figures.js`, `plot.js` y `lib-math.js` (el motor de dibujo y la numérica) y
`figures.css` los aporta el runtime: ya están portados en
`packages/runtime/src/{figures,plot,math}.ts` y `src/styles/figures.css`.
Tampoco entran `core.js` ni el resto del chrome del baseline (header, sidebar,
lector, paleta, grafo, flashcards, quiz, selector de tema).

### 2.1 Divergencias declaradas de `figures.css` respecto del baseline

`packages/runtime/src/styles/figures.css` era **byte a byte** el del baseline.
Ya no lo es. Cada divergencia lleva en el código la sigla del agente que la
introdujo, y son estas tres —ninguna cambia el dibujo de una figura:

| Marca | Regla | Por qué | Efecto en el baseline |
|---|---|---|---|
| `[F5]` | `@import "katex/dist/katex.min.css";` (línea 9) | En el baseline la hoja de KaTeX la cargaba `index.html` para todo el documento; en la plataforma solo la traía el lector, así que al entrar directo a una vista de herramienta la matemática salía **duplicada** (el bloque `.katex-mathml`, que esa hoja esconde, quedaba visible) y sin tipografía. Medido: 14 fórmulas en el explorador, 72 en calculadoras, 5 en el laboratorio, 4 en el taller. | Ninguno: el baseline no la necesita. Cuesta ~9 kB comprimidos duplicados en el build. |
| `[F5]` | `.fig-tex:has(> code)` | Cuando `putTex` no puede componer, deja el LaTeX crudo en un `<code>`; como ese rótulo es un overlay (`position: absolute`, `nowrap`) una línea larga se iba muy afuera de la hoja (medido: 1585 px de ancho de contenido en una hoja de 840). La regla lo devuelve al flujo, debajo del lienzo. | Ninguno: `:has(> code)` acota la regla **exactamente** al repliegue, y con KaTeX disponible el hijo es `.katex`. |
| `[X5]` | `min-height: 24px` en `.fig-ctl.fig-toggle label` | La casilla del conmutador mide 15 × 15 y el objetivo señalable quedaba por debajo del mínimo de 24 px del contrato (hallazgo 29 de la revisión de diseño). Se agranda la **etiqueta**, que envuelve a la casilla y la activa: medido 193,6 × 21,6 → 193,6 × 24. La casilla NO se toca. | Ninguno visible: la etiqueta crece 2,4 px dentro de una fila de controles que ya mide más. |

> **Atribución corregida.** La revisión de diseño anotó las casillas de 15 × 15
> como «del bundle de Proba» y las pasó al orquestador. No lo son: el bundle no
> tiene **ni una** casilla ni un radio propios —cero apariciones de
> `type="checkbox"` / `type="radio"` en los 15 scripts y en el `tool-push.json`
> generado—. El control lo dibuja el runtime de la plataforma
> (`packages/runtime/src/figures.ts` → `Fig.toggle`) y lo estila el `figures.css`
> del runtime, así que la corrección va ahí y la hereda **cualquier** materia,
> no solo Proba. Por eso **no hizo falta volver a subir el bundle**: sus cinco
> hojas (`lab`, `lookup`, `taller`, `tools`, `vocab`) no cambiaron.

### 2.2 `window.katex` lo publica el runtime

El baseline definía **`window.katex`** como global desde su `index.html`, y los
scripts portados lo dan por sentado: `figures.js` → `putTex` compone con
`window.katex.render(...)` y, si no está, cae al repliegue del `<code>` con el
LaTeX crudo. En la plataforma ese global no existía (verificado:
`typeof window.katex === "undefined"` mientras `App.katex` sí era función), y
por eso salían crudas **22 fórmulas de figura** en 6 páginas del wiki —6 en
`tecnica-derivadas-parciales`, 5 en `proceso-de-poisson`, 4 en
`tecnica-integrales-dobles`, 3 en `cadenas-de-markov`, 3 en
`proceso-de-bernoulli` y 1 en `datos-agrupados`.

Ahora lo publica `installRuntime` (`packages/runtime/src/index.ts`) junto con
`window.App`, `window.M` y `window.SinapsisRuntime`, y lo retira el teardown
**solo si sigue siendo el suyo** (una página que traiga su propio KaTeX manda).
Con eso `putTex` queda verbatim y conserva sus macros propias (`macros()` mezcla
las `MACROS` de `figures.ts` con `A.KATEX_MACROS`), que es lo que pide P4-1; la
alternativa —cambiar `putTex` para usar `A.katex`— las habría perdido.

El bundle **no cambia**: sigue sin declarar KaTeX y sigue asumiendo el global,
igual que en el baseline.

---

## 3. Adaptaciones aplicadas

### (a) Datos: `window.STUDY` → `App.STUDY`

El baseline leía un global `window.STUDY` que dejaba un IIFE de 63 kB. En la
plataforma los datos viajan como JSON declarado en `manifest.data`, y el
runtime los deja en `App.STUDY`.

**Hallazgo que obligó a partir el archivo en dos.** Las distribuciones **no son
datos puros**: cada entrada de `DISTS` trae cuatro funciones vivas cerradas
sobre la numérica `M` —`f`, `domain`, `mean`, `varc`— más un `valid` en dos
casos. JSON las pierde en silencio, y sin ellas el explorador se cae en la
primera llamada (`dist.domain is not a function`). Por eso
`scripts/extract-study-data.mjs` emite **dos mitades**:

* `data/study-data.json` — la mitad serializable (`manifest.data`);
* `data/study-data.js` — **primer script del manifiesto**: publica
  `window.STUDY` y vuelve a enganchar las **58 funciones** en su lugar, con el
  cuerpo copiado literalmente del original (vía `Function.prototype.toString`,
  así no hay transcripción a mano). Si el JSON y el JS se desincronizan, avisa
  por consola en vez de fallar callado.

Además, cada script de vista lleva el shim pedido al inicio del archivo:

```js
var STUDY = window.STUDY || (window.App && window.App.STUDY) || {};
```

**Decisión P4-2 — `data/study-data.js` se conserva** (no alcanzaba con el
shim): es donde viven las funciones que el JSON no puede llevar. Deja además
un único lugar donde mirar cuando los datos no llegan.

**Decisión P4-3 — el shim va en los cuatro scripts de vista, no en las 10
figuras**: `grep` confirma que `figuras/*.js` no toca `STUDY` en ninguna línea.

De las ocho claves del baseline se conservan las cuatro que usan las vistas:
`DISTS` (14), `DIST_WIZARD`, `TEST_WIZARD`, `CHEATSHEETS` (9). Se descartan
`FLASHCARDS`, `QUIZ`, `ROADMAP` y `KITS`: ese material ya vive en `estudio/`
como contenido de estudio de la plataforma.

### (b) Rutas hash

Sin cambios, como corresponde: pasan por `A.go` y por los `<a data-nav>` que el
runtime traduce. Las que usa el bundle son `#/explorador/<id>` (`A.go`),
`#/calc/<id>`, `#/taller/<key>`, `#/taller`, `#/plan` y `#/calc`
(`href` + `data-nav`).

> **Para R4:** el runtime tiene que delegar el click sobre `a[data-nav]` dentro
> del contenedor de la vista hacia `App.go`, igual que hacía `core.js`
> (`NAV_SEL = "[data-nav], a.wikilink[data-slug]"`). Sin eso los enlaces del hub
> del taller y de la subnavegación de calculadoras navegan al hash crudo.
> Lo mismo para `[data-action]` → `registerAction`: el bundle registra
> **14 acciones** (ver el smoke).

### (c) `A.render()` / `A.setCrumbs`

Existen en `CompatApp` y se usan sin tocar (`lab.js` llama `A.render()`;
`tools.js` y `taller.js` llaman `A.setCrumbs`).

### (d) `localStorage` con prefijo `pe.`

**No aplica.** `grep -n "localStorage\|sessionStorage"` sobre `tools.js`,
`taller.js`, `lab.js`, `lookup.js` y las diez `figuras/*.js` no devuelve ni una
línea: el estado de estas vistas vive en memoria del módulo. El prefijo `pe.`
solo aparece en `index.html` y `core.js` del baseline, que no entran al bundle.
No hizo falta renombrar nada, y por lo tanto tampoco hay riesgo de colisión con
`sinapsis.*`.

### (e) Miembros de `App` que no están en `CompatApp`

Todos quedaron con reemplazo local para que el bundle funcione **hoy**, y
anotados abajo para que R4 los agregue al runtime.

| Nombre | Uso | Qué se hizo en el bundle |
|---|---|---|
| `App.$(sel, root?)` | los 4 scripts de vista | reemplazo local: `(root \|\| document).querySelector(sel)` |
| `App.$$(sel, root?)` | los 4 scripts de vista | reemplazo local: `Array.prototype.slice.call((root \|\| document).querySelectorAll(sel))` |
| `App.katex` | `tools.js` (66 llamadas), `taller.js`, `lab.js` | **discrepancia de forma**, ver abajo |
| `App.paletteOpen()` | `lookup.js` | **opcional**, ver abajo |
| `App._taller`, `App._lab` | `taller.js`, `lab.js` | son **escrituras**, no lecturas: exponen el núcleo puro para testeo. No hay que agregarlas al contrato. |

#### `App.katex`: el contrato y el baseline no coinciden

`CompatApp` la declara como objeto —`katex: { renderToString(tex, opts) }`—
pero **todo el baseline la llama como función**: `A.katex(tex, display)`, donde
`display` es un booleano, y devuelve HTML. Son 66 llamadas solo en `tools.js`.

En el bundle se resolvió con un shim que acepta las dos formas, así que corre
contra cualquiera de las dos. **La recomendación para R4 es cambiar el contrato
a la forma del baseline** (`katex(tex: string, display?: boolean): string`):
es la que asume el resto de la superficie (`rich`, `renderMathHtml`,
`KATEX_MACROS`) y la que ya usa `packages/runtime/src/figures.ts`.

#### `App.paletteOpen()`: opcional, no bloqueante

`lookup.js` cierra su burbuja con Escape **solo si la paleta ⌘K no está
abierta** (mientras la paleta está abierta, la tecla es de ella). El baseline lo
resolvía mirando `#palette.show`, marcado que en la plataforma no existe.

Queda con tres intentos en cascada, todos guardados: `#palette.show` →
`App.paletteOpen()` si es función → `[data-palette-open]` en el documento. Si
ninguno responde, Escape siempre cierra la burbuja, que es el comportamiento
degradado aceptable. Si el shell marcase su paleta abierta con
`[data-palette-open]` en la raíz, se recupera la deferencia original sin tocar
una línea del bundle.

### (f) `FigureContext`: el contrato no coincide con el motor

Las 92 figuras reciben como segundo argumento el `api` que arma
`figures.js`: `{ Fig, state, setState, cleanup }` — 155 usos de `api.state`,
82 de `api.Fig`, 9 de `api.cleanup`, 3 de `api.setState`.

`FigureContext` en `packages/contract/src/runtime.ts` declara en cambio
`{ theme, cssVar, redraw }`, que **ninguna figura usa**. El motor ya portado
(`packages/runtime/src/figures.ts`, línea 1674) sí construye la forma correcta,
así que esto es una corrección **del tipo**, no del runtime.

> **Para R4:** `FigureContext` debería ser
> `{ Fig: Record<string, unknown>; state: Record<string, unknown>;
> setState(patch): void; cleanup(fn): void }`, y `theme`/`cssVar`/`redraw`
> quedar como opcionales si se los quiere conservar.

Nota menor del mismo tenor: `FigureMeta` declara `caption` y `height`, pero las
figuras del baseline pasan `title` (173), `unidad` (97), `page` (92), `titulo`
(41) y `height` (82). `normalizeMeta` de `figures.ts` ya los uniforma; el tipo
convendría ampliarlo.

### (g) CSS: acotado a `.sinapsis-tool`

`scripts/wrap-css.mjs` envuelve los cinco archivos en `.sinapsis-tool { … }` con
anidamiento CSS nativo, reescribiendo cada selector con un `&` explícito:

```css
.sinapsis-tool {
  & .card { … }                          /* .sinapsis-tool .card */
  [data-theme="claustro"] & .card { … }  /* el tema es ancestro del contenedor */
}
```

Los selectores que empiezan por un ancestro de tema (`[data-theme=…]`, `html`,
`body`) llevan el `&` **después** del ancestro: el tema se declara en la raíz
del documento, por encima del contenedor de la vista. El resto lo lleva
delante. Todos los colores ya viajaban como `var(--token)`; no se tocó ninguno.

**`vocab.css`.** Del `styles.css` del baseline entran completas las secciones
`TINTA DE UNIDAD`, `TIPOGRAFÍA DE SECCIÓN`, `COMPONENTES`, `DOC`,
`PLOTS / EXPLORADOR / CALCULADORAS` y `EJERCICIOS / WIZARD`; de `HEADER`,
`READER`, `MOBILE`, `PRESTIGIO` y `PRINT` entran solo las reglas cuya **primera
clase** pertenece a ese vocabulario (así entra `.doc h1` y queda afuera
`.dash-hero h1`, entra `.chip-btn.on` y queda afuera `.theme-pop.show`). Las
demás secciones son chrome de la app original y no entran nunca. Se descartan
**122 reglas**, entre ellas `:root`, los tres bloques de tema, los 14
`@font-face` y `html` / `body` / `body::before` / `*`.

**Sobre «sin bloques de tema».** Lo que se saca son las *definiciones* de tema
—los `:root` / `[data-theme="…"]` que declaran los tokens y el `color-scheme`—,
que las aporta la plataforma. Sí queda una regla **calificada** por tema,
`[data-theme="claustro"] & .card`, que le pone el grano de imprenta a las
tarjetas en el tema oscuro: es refinamiento de un componente del vocabulario, no
declaración de tokens, y sin ella las tarjetas del taller y del laboratorio
pierden textura en claustro.

**Decisión P4-4 — preámbulo escrito a mano.** Al sacar la regla `body` se
pierde lo que ella le daba a todas estas clases, así que `vocab.css` empieza con
un bloque propio, acotado, que la reemplaza: `box-sizing: border-box` sobre el
contenedor y su subárbol, y `color`, `font-family: var(--font-ui)`,
`font-weight: 500`, `font-size: 14.75px`, `line-height: 1.55` y el suavizado
en el contenedor. **Depende de que la plataforma defina los tokens del baseline**
(`--font-ui`, `--text`, `--surface`, `--border`, `--u1…--u9`, `--grain-22`…).

**Decisión P4-5 — dos rescates fuera de `styles.css`.** Las vistas del bundle
usan `.unit-hero` (cabecera de `taller` y `lab`, definida en `reader.css`) y
`.kit-grid` / `.kit-card` / `.kit-card-top` / `.kit-ic` / `.rm-hero*` /
`.rm-foot` (la rejilla de tarjetas del hub del taller, en `roadmap.css`). Sin
ellas el hub queda sin maqueta. Se rescatan solo esas reglas, marcadas con su
sección propia en el archivo generado.

Cobertura verificada: de las 160 clases que emiten los cuatro scripts, 154
tienen regla en el bundle. Las 6 restantes —`bs-like`, `bs-prior`,
`calc-preset`, `ql-close`, `ql-copy`, `ql-in`— **tampoco tienen regla en el
baseline**: son ganchos de JS, y su aspecto lo dan `.field`, `.chip-btn` y
`.icon-btn`.

### (h) La burbuja ⌘J se monta fuera de la vista

`lookup.js` cuelga su FAB y su panel de `document.body`, o sea fuera del
contenedor de la vista, donde el ámbito `.sinapsis-tool` de `css/lookup.css` no
llegaría.

**Decisión P4-6.** El módulo crea su propio host y le pone la clase:

```js
host = document.createElement("div");
host.className = "sinapsis-tool ql-host";
host.style.display = "contents";   // no genera caja
document.body.appendChild(host);
```

`display: contents` va **en línea desde el script**, a propósito: así el bundle
no necesita ninguna regla CSS sin envolver, y el `.ql-host` no altera el flujo
de `body`. El FAB y el panel siguen siendo `position: fixed`, así que se
colocan exactamente como en el baseline.

Dos reglas de `lookup.css` quedaron muertas al envolver, las dos apuntando a
chrome del baseline:

* `#main { padding-bottom: 72px }` (@media ≤720 px) — **se quitó** y quedó
  comentada en el generado. Reservaba el hueco bajo el FAB al final de la vista
  en pantallas angostas. **Para R4/el host:** conviene reservar ese espacio en
  el contenedor de la herramienta.
* `body:has(.page-view .with-rail:not(.rail-collapsed)) .ql-fab` (@media
  ≥1081 px) — se conserva reescrita, pero `.page-view` / `.with-rail` son del
  lector del baseline: hoy no matchea. Corría el FAB hacia adentro cuando el
  rail del lector estaba abierto.

### (i) `document.title` lo escribe el ANFITRIÓN, no el bundle *(brecha herr-10)*

Las cinco vistas fijaban `document.title = "… · Estudio P&E"` y ganaban siempre,
porque el bundle llega asíncrono y se monta después del efecto del shell: la
pestaña del navegador nombraba a la app anterior en toda la materia.

Ahora el bundle **pide un rótulo** y la plataforma compone el título con el
nombre de la materia:

```js
if (A.setTitle) A.setTitle("Calculadoras");   // → «Calculadoras · Probabilidad y Estadística»
```

Cambió en `tools.js` (3 vistas), `taller.js` (2) y `lab.js` (1). La guardia
`if (A.setTitle)` deja el bundle corriendo contra un runtime anterior, sin
título propio, que es la degradación correcta: el título es del anfitrión.

### (j) El árbol de decisión se redibuja sobre `A.viewRoot()` *(brecha herr-01)*

Las tres acciones del asistente (`wiz-pick`, `wiz-which`, `wiz-reset`) llamaban a
`drawWizard($("#main"))`. En el baseline `#main` **era** el contenedor de la
vista; en la plataforma no existe con ese id, así que `$("#main")` devolvía
`null` y cada clic lanzaba una excepción: la herramienta quedaba congelada en la
primera pregunta.

El runtime expone ahora `App.viewRoot()` —el nodo que el host le presta a la
vista— y además resuelve `App.$("#main")` (y `#app`, `#content`, `#contenido`) a
esa misma raíz, para cualquier materia. En el bundle:

```js
function wizRoot() { return (A.viewRoot && A.viewRoot()) || $("#main"); }
```

### (k) La burbuja ⌘J se desmonta con el bundle *(brecha herr-04)*

`lookup.js` cuelga su FAB y su panel de `document.body` y ata ⌘J en `document`.
En el baseline el script corría una vez por vida de la página; acá se ejecuta
cada vez que se entra en la materia, así que se acumulaban un FAB, un panel y un
`keydown` por reentrada (tres FAB tras dos idas y vueltas, ids duplicados y
marcado huérfano sin estilos en la portada).

El runtime agregó `App.onTeardown(fn)`, que corre cuando se **descarga el
bundle** (salir de la materia, cambiar de materia, desinstalar el runtime), y el
módulo lo usa para retirar su host, sus teclas y `A.quickLookup`. El cargador,
además, barre cualquier nodo con `data-bundle="<id>"` que el bundle haya dejado
suelto, como cinturón para materias que no limpien.

---

## 4. Verificación

* `node --check` sobre los **15 scripts** del manifiesto: sin errores.
* `sinapsis tools build --config examples/proba/sinapsis.config.json`:
  1 bundle listo, 21 archivos, 888 kB.
* `ToolManifest.parse`: OK — `proba-tools 1.0.0 · runtime 1 · 15 scripts,
  5 estilos, 5 vistas, figures: true`.
* `node scripts/smoke.mjs`: **OK** (salida completa abajo).
* Cotejo del motor: los **39** miembros de `M`, los **39** de `Fig` y los
  **16** de `Plot` que pide el bundle ya aparecen en
  `packages/runtime/src/{math,figures,plot}.ts`.

### Salida de `scripts/smoke.mjs`

`smoke.mjs` monta un DOM de jsdom, instala un stub de `window.App` con los
miembros de `CompatApp` (leídos del propio `runtime.ts`, cada uno registrando
sus llamadas), corre los 15 scripts en orden con `vm.runInContext` y renderiza
cada vista. **El stub no trae `$` ni `$$` a propósito**, para ejercitar los
reemplazos locales de la adaptación (e).

```
==========================================================================
  smoke — bundle proba-tools v1.0.0
==========================================================================

  OK    15 scripts cargados sin excepción
  OK    vistas registradas (5): explorador, calc, asistente, taller, lab
  OK    figuras registradas: 92 (mínimo 90)
        acciones data-action registradas: 14
          ex-tab calc-copy calc-preset calc-lookup wiz-which wiz-reset wiz-pick mk-solve cf-solve
          inf-solve bs-solve pw-solve lab-run lab-reseed

  Render de cada vista contra el stub (informativo: el stub no tiene
  matemática ni dibujo de verdad):
    dibuja  explorador   3710 bytes de HTML
    dibuja  calc         56098 bytes de HTML
    dibuja  asistente    860 bytes de HTML
    dibuja  taller       2634 bytes de HTML
    dibuja  lab          2937 bytes de HTML

--------------------------------------------------------------------------
  MIEMBROS DE `App` QUE USA EL BUNDLE   (x = no está en CompatApp)
--------------------------------------------------------------------------
    x  App.$
    x  App.$$
       App.BY_SLUG
       App.Fig
       App.KATEX_MACROS
       App.M
       App.Plot
       App.STUDY
    x  App._lab
    x  App._taller
       App.backBar
       App.cssVar
       App.emptyState
       App.enhanceDoc
       App.escapeHtml
       App.fmt
       App.go
       App.icon
       App.katex
    x  App.paletteOpen
       App.quickLookup
       App.registerAction
       App.registerFigure
       App.registerView
       App.render
       App.rich
       App.setCrumbs
       App.setRedraw
       App.toast
       App.unitMeta
       App.unitShort
       App.withAlpha

--------------------------------------------------------------------------
  MIEMBROS DEL 2º ARGUMENTO DE `registerFigure` (FigureContext)
--------------------------------------------------------------------------
    x  ctx.Fig
    x  ctx.cleanup
    x  ctx.setState
    x  ctx.state

--------------------------------------------------------------------------
  MOTOR PORTADO AL RUNTIME  (x = el nombre no aparece en packages/runtime/src)
--------------------------------------------------------------------------
  window.M — 39 miembros requeridos  (cotejo contra math.ts)
    binomCDF binomInv binomPMF binomSF chi2CDF chi2Inv chi2PDF comb combLog expCDF eye gammaSF
    gammafn gammp geomCDF geomPMF hyperCDF hyperPMF integrate lfact lgamma matInverse matMul
    matPow negbinCDF negbinPMF normCDF normInv normPDF normSF poissonCDF poissonInv poissonPMF
    poissonSF stationary tCDF tInv tPDF uniformCDF

  App.Fig — 39 miembros requeridos  (cotejo contra figures.ts)
    area axes bars buttons color controls curve defs div drag el fmt graph grid hline iso3d
    label legend line marker mix panels path ptsToPath readouts rng scale select seq series
    status surface svg tex text ticks timeline toggle vline

  App.Plot — 16 miembros requeridos  (cotejo contra plot.ts)
    a11y alpha area axes bars cssVar curve frame hover legend scales series setup ticks
    tokenAlpha vline

--------------------------------------------------------------------------
  POR ARCHIVO  (escaneo estático)
--------------------------------------------------------------------------
  data/study-data.js
      App:
        M STUDY
      M:
        binomPMF chi2PDF combLog gammafn hyperPMF lfact lgamma normPDF poissonPMF tPDF
  lookup.js
      App:
        $ $$ escapeHtml icon paletteOpen quickLookup rich toast
      M:
        binomCDF binomInv binomPMF binomSF chi2CDF chi2Inv normCDF normInv normSF poissonCDF
        poissonInv poissonPMF poissonSF tCDF tInv
  tools.js
      App:
        $ $$ BY_SLUG KATEX_MACROS M Plot STUDY cssVar emptyState enhanceDoc escapeHtml fmt go icon
        katex quickLookup registerAction registerView rich setCrumbs setRedraw toast unitMeta
        unitShort
      M:
        binomCDF binomInv binomPMF binomSF chi2CDF chi2Inv comb combLog expCDF geomCDF hyperCDF
        lfact negbinCDF normCDF normInv normSF poissonCDF poissonInv poissonPMF poissonSF tCDF tInv
        uniformCDF
      Plot:
        a11y area axes bars curve frame hover legend scales setup ticks tokenAlpha vline
  taller.js
      App:
        $ $$ KATEX_MACROS Plot _taller backBar enhanceDoc escapeHtml icon katex registerAction
        registerView setCrumbs setRedraw
      M:
        integrate matInverse matMul matPow normCDF normInv normPDF stationary tCDF tInv
      Plot:
        a11y alpha axes cssVar curve frame hover legend scales series setup ticks tokenAlpha vline
  lab.js
      App:
        $ $$ KATEX_MACROS Plot _lab enhanceDoc escapeHtml icon katex registerAction registerView
        render setRedraw
      M:
        normPDF
      Plot:
        a11y alpha axes bars cssVar curve frame hover legend scales series setup tokenAlpha vline
  figuras/u1.js
      App:
        registerFigure
      FigureContext:
        Fig cleanup setState state
      M:
        chi2Inv integrate normCDF normPDF
      Fig:
        axes bars buttons color controls curve drag el fmt hline label legend line marker panels
        path readouts rng scale select series status svg tex text ticks vline
  figuras/u2.js
      App:
        registerFigure
      FigureContext:
        Fig cleanup state
      M:
        comb
      Fig:
        axes bars buttons color controls defs el fmt graph grid hline label legend line marker mix
        panels readouts scale select series status svg text toggle vline
  figuras/u3.js
      App:
        registerFigure
      FigureContext:
        Fig cleanup state
      M:
        binomPMF comb geomPMF hyperPMF negbinPMF poissonPMF
      Fig:
        axes bars buttons color controls drag el fmt graph hline label legend line marker mix panels
        path readouts rng scale series status svg text toggle vline
  figuras/u4.js
      App:
        registerFigure
      FigureContext:
        Fig cleanup setState state
      M:
        expCDF gammafn integrate normCDF normInv normPDF
      Fig:
        area axes buttons color controls curve drag el fmt hline label legend line marker panels
        readouts scale select series svg text toggle vline
  figuras/u5.js
      App:
        registerFigure
      FigureContext:
        Fig state
      M:
        hyperPMF integrate normCDF normPDF
      Fig:
        area axes buttons color controls curve defs div el fmt hline iso3d label legend line marker
        panels path ptsToPath readouts rng scale select series status surface svg text toggle vline
  figuras/u6.js
      App:
        Fig registerFigure withAlpha
      FigureContext:
        cleanup state
      M:
        binomPMF eye integrate lgamma matInverse matMul normCDF normPDF poissonCDF poissonPMF
        stationary
      Fig:
        axes bars buttons color controls curve drag el fmt graph hline label legend line marker
        panels path ptsToPath readouts rng scale select series svg tex text toggle vline
  figuras/u7.js
      App:
        registerFigure
      FigureContext:
        Fig state
      M:
        binomCDF binomPMF gammaSF gammp integrate lgamma normCDF normPDF normSF poissonCDF
      Fig:
        area axes bars buttons color controls curve el fmt hline iso3d label legend line marker
        panels readouts rng scale select series status surface svg text timeline toggle vline
  figuras/u8.js
      App:
        registerFigure
      FigureContext:
        Fig cleanup state
      M:
        chi2Inv chi2PDF normInv normPDF tCDF tInv tPDF
      Fig:
        area axes buttons color controls curve defs drag el fmt hline iso3d label legend line marker
        panels path readouts rng scale select series status surface svg text ticks toggle vline
  figuras/u9.js
      App:
        registerFigure
      FigureContext:
        Fig cleanup
      M:
        normCDF normInv normPDF tCDF tInv tPDF
      Fig:
        area axes color controls curve drag el fmt label legend line marker mix panels readouts
        scale select series status svg text toggle vline
  figuras/u0.js
      App:
        registerFigure
      FigureContext:
        Fig state
      M:
        integrate
      Fig:
        area axes buttons color controls curve div el fmt hline iso3d label legend line marker mix
        panels path ptsToPath readouts scale select seq series status surface svg tex text toggle
        vline

--------------------------------------------------------------------------
  Escrituras sobre App durante la carga: App.STUDY, App._lab, App._taller, App.quickLookup
  Faltan en CompatApp: App.$, App.$$, App._lab, App._taller, App.paletteOpen
  Faltan en FigureContext: ctx.Fig, ctx.cleanup, ctx.setState, ctx.state
--------------------------------------------------------------------------
  RESULTADO: OK
```

Las 92 figuras se reparten por unidad así: u0 8 · u1 9 · u2 9 · u3 10 · u4 10 ·
u5 10 · u6 10 · u7 9 · u8 8 · u9 9. No hay identificadores repetidos.

---

## 5. Resumen para R4

Lo que el runtime tiene que agregar o corregir para que este bundle corra
completo:

1. **`App.$(sel, root?)` y `App.$$(sel, root?)`** en `CompatApp`. El bundle ya
   tiene reemplazos locales, así que esto es paridad, no bloqueo.
2. **`App.katex` como función** `(tex: string, display?: boolean) => string`
   (hoy el contrato dice `{ renderToString }`). El bundle acepta las dos.
3. **`FigureContext` = `{ Fig, state, setState, cleanup }`** — lo que realmente
   pasa `figures.ts`; lo declarado hoy (`theme`, `cssVar`, `redraw`) no lo usa
   ninguna de las 92 figuras. Es corrección del tipo, no del runtime.
4. **`FigureMeta`** debería admitir `title` / `titulo` / `page` / `unidad`
   además de `caption` / `height`.
5. **Delegación de `[data-nav]`** (y de `[data-action]`) dentro del contenedor
   de la vista, como hacía `core.js`.
6. **`App.paletteOpen()`** — opcional; hoy `lookup.js` lo prueba con guardia y
   degrada bien sin él.
7. **El host de la vista debe llevar la clase `sinapsis-tool`** y definir los
   tokens del baseline. En pantallas ≤720 px conviene reservar ~72 px de aire
   abajo para que el FAB de ⌘J no tape los últimos controles.

Estado tras la ronda de brechas (fixer «herramientas»): 1, 5, 6 y 7 **hechos**;
2, 3 y 4 siguen abiertos (son correcciones del tipo, no del runtime). Se
agregaron además `App.viewRoot()`, `App.setTitle()`, `App.onTeardown()`,
`App.LS`, `App.parseRoute()`, `App.setQuery()`, `App.viewState()`,
`App.scrollFor()`, `App.markActivity()`, `App.localToday()`, `App.today()` y
`App.registerSearchProvider()` — ver §3 (i), (j) y (k) y el contrato en
`packages/contract/src/runtime.ts`.

## 6. Decisiones

| Id | Decisión |
|---|---|
| **P4-1** | Los scripts se copian **verbatim** del baseline; toda diferencia lleva el comentario `[bundle]` y está en este archivo. Nada del baseline se modifica. |
| **P4-2** | `data/study-data.js` **se conserva** (no se elimina): las 58 funciones de `DISTS` no sobreviven a JSON y hay que volver a engancharlas. |
| **P4-3** | El shim de `STUDY` va en los cuatro scripts de vista, no en las diez figuras: ninguna toca `STUDY`. |
| **P4-4** | `vocab.css` lleva un preámbulo escrito a mano (`box-sizing` + tipografía base) que reemplaza, acotado al contenedor, lo que aportaba la regla `body` del baseline. |
| **P4-5** | Se rescatan de `reader.css` y `roadmap.css` las reglas de `.unit-hero` y de la rejilla de kits: las vistas del bundle las usan y no están en `styles.css`. |
| **P4-6** | La burbuja ⌘J se monta en un host propio con clase `sinapsis-tool` y `display: contents` en línea, en vez de agregar una regla CSS sin envolver. |
| **P4-7** | Los reemplazos de `App.$`/`$$`/`katex` son **equivalentes funcionales**, no meras guardias: el bundle anda contra el runtime tal como está hoy y sigue andando cuando R4 agregue los miembros. |
| **P4-8** | El CSS se genera con `scripts/wrap-css.mjs` en vez de editarse a mano, para poder regenerarlo cuando cambie el baseline y para que el criterio de recorte quede escrito en código. |
| **X5-1** | El objetivo señalable del conmutador de figura se arregla en `figures.css` del **runtime**, no en el CSS del bundle: el bundle no tiene casillas propias y la corrección vale para cualquier materia. Queda como tercera divergencia declarada (§2.1) en vez de como parche de Proba. |
| **X5-2** | `window.katex` lo publica el **runtime** (§2.2) en vez de reescribir `putTex` para que use `A.katex`: así el script portado sigue siendo verbatim (P4-1) y no pierde las macros de `figures.ts`. |
