# Herramientas y figuras de una materia (referencia)

Una **herramienta** es una vista propia de la materia (un explorador, una calculadora, un
laboratorio) y una **figura** es un dibujo interactivo que el lector monta dentro de una
página del wiki. Las dos cosas viven en el mismo lugar: un **bundle** de scripts clásicos
que el CLI empaqueta, que viaja con la materia a `subjects/<slug>/tools/` y que el sitio sirve
como archivos estáticos (decisiones N0-41, N0-42 y N0-57 de la plataforma).

No hay React, ni build step obligatorio, ni módulos ES: son archivos `.js` que se cargan en
orden y hablan con `window.App`. Es a propósito, para poder mudar herramientas ya escritas
sin reescribirlas.

---

## 1. La carpeta

```
<materia>/
  sinapsis.config.json
  wiki/
  estudio/
  tools/                       # ← acá viven los bundles
    <id>/
      sinapsis.tools.json      # el manifiesto (obligatorio)
      tools.js                 # scripts clásicos, en el orden del manifiesto
      figuras/u1.js
      css/tools.css
      data/datos.json
      dist/tool-push.json      # lo escribe `tools build` (no se versiona)
```

Una materia puede tener **un** bundle (`tools/<id>/`) o varios. `tools build` los descubre
solos: si `tools/` tiene manifiesto es un bundle, y si no, lo es cada subcarpeta que lo
tenga.

## 2. `sinapsis.tools.json`

```jsonc
{
  "id": "proba-tools",              // ^[a-z][a-z0-9_-]*$, ≤ 48. Es la URL del bundle.
  "title": "Herramientas de Probabilidad",
  "version": "1.0.0",               // libre; súbala cuando cambie el bundle
  "description": "Explorador, calculadoras y las figuras del wiki.",
  "runtime": 1,                     // versión del runtime que necesita (hoy: 1)

  "scripts": ["lib-math.js", "tools.js", "figuras/u1.js"],   // se cargan EN ORDEN
  "styles": ["css/tools.css"],      // se inyectan con el bundle y se quitan al salir
  "data": ["data/datos.json"],      // quedan en App.DATA["data/datos.json"]

  "views": [                        // cada vista abre en /m/<materia>/t/<id de vista>
    { "id": "explorador", "label": "Explorador de distribuciones",
      "icon": "chart", "layout": "wide" },  // layout: "wide" (1120) o "full"
    { "id": "ejercicios", "label": "Ejercicios", "icon": "pencil",
      "layout": "wide", "frame": "page" }   // dentro de la hoja del lector (ver abajo)
  ],
  "figures": true,                  // true si registra figuras para los callouts [!figura]
  "progress": false                 // true si registra proveedores de progreso (ver abajo)
}
```

**`frame: "page"` — la vista dentro de la hoja del lector.** Una vista puede pedir que la
plataforma la envuelva en el **mismo marco que una página del wiki**: la hoja con su ancho y
sus asas, la línea de identidad (chip de la unidad, etiqueta de tipo, «ejercicios 1 de 4 · 16
ejercicios») y la barra de la unidad con su Anterior/Siguiente. Es lo que hace que la vista de
ejercicios de una unidad se lea como una página más de esa unidad.

Solo se aplica cuando el `?arg=` de la URL resuelve a un **grupo de progreso**: el anfitrión
busca el grupo que declaró `to: "/m/<materia>/t/<vista>?arg=…"` con ese mismo argumento (ver
«Progreso» más abajo). Si no resuelve —el índice de la herramienta, una colección vacía— la
vista se dibuja suelta, como cualquier otra.

Del lado del bundle, el contenedor llega con `data-frame="page"`. Con ese atributo la vista
tiene que: (1) no repetir lo que el marco ya muestra (su antetítulo con la unidad, su conteo,
una barra de unidad propia); (2) no volver a pintar la hoja —nada de la clase `sheet`— ni
acotar el ancho de la página; (3) dejar su título como primer elemento del documento, que pasa
a ser el título de la página. Lo suyo —controles, filtros, contenido— no se toca. En CSS, lo
del modo enmarcado cuelga de `&[data-frame="page"]` dentro del envoltorio `.sinapsis-tool`.
El contrato completo está en `docs/contracts/04-herramientas-y-figuras.md` §8.1.

**Rutas (`ToolFilePath`).** Relativas a la carpeta del bundle, sin `..`, sin barra inicial,
y con una de estas extensiones: `js mjs css json svg png jpg jpeg webp woff woff2 txt md
csv`. Cualquier otra cosa no se sube.

**Qué viaja.** Los archivos declarados (`scripts`, `styles`, `data`) y los archivos sueltos
de la carpeta que sirvan en tiempo de ejecución (una fuente, una imagen que pide el CSS).
Un `.js`, `.mjs` o `.css` que el manifiesto **no** declara no se publica: el runtime nunca lo
cargaría. Los scripts de construcción, entonces, pueden quedarse en la carpeta sin ensuciar
lo publicado. `dist/`, `.dist/`, `scripts/` y `node_modules/` nunca se copian.

**Tope:** 20 MB por bundle.

## 3. Qué garantiza el runtime (`window.App`)

La plataforma instala `window.SinapsisRuntime` y, mientras hay una materia abierta,
`window.App` y `window.M` con la superficie del baseline. Un bundle puede contar con esto
(resumen de `CompatApp`, en `packages/contract/src/runtime.ts` de la plataforma):

**Registro**

| Miembro | Qué hace |
|---|---|
| `App.registerView(id, fn)` | `fn(main, arg?)` escribe dentro de `main`; puede devolver un limpiador. |
| `App.registerFigure(id, draw, meta?)` | `draw(host, api, meta?)` dibuja; `meta = { caption, height, … }`. |
| `App.registerAction(nombre, fn)` | Compat: engancha `data-action="nombre"`. |
| `App.mountFigures(el)` / `App.unmountFigures(el)` | Monta o desmonta las figuras de un contenedor: recorre sus `[data-fig]` y devuelve cuántas dibujó. |
| `App.setRedraw(fn)` | La vista pide que la redibujen al cambiar el tema. |

El `api` que recibe una figura (`FigureContext`) trae: `id`, `host`, `figure` (el bloque
completo, con epígrafe), `Fig` (los helpers de dibujo), `state` y `setState(patch)` para los
controles interactivos, `cleanup(fn)` para listeners y timers, `theme`, `cssVar(nombre)` y
`redraw()`.

**Datos de la materia (solo lectura)**

`App.SUBJECT` (`{ slug, config }`), `App.PAGES`, `App.CONTENT` (las que cuentan como
contenido), `App.BY_SLUG`, `App.UNITS`, `App.TYPES`, `App.unitShort(key)`,
`App.unitMeta(key)`, `App.isStudied(slug)`, y los JSON del propio bundle en `App.DATA` y
`App.STUDY`.

**Navegación y avisos**

`App.go(destino, { replace })` (acepta rutas del baseline `#/p/slug` y del SPA `/m/…`),
`App.setCrumbs([{ label, href }])`, `App.render()`, `App.toast(mensaje, "ok" | "bad")`.

Dentro del contenedor de la vista, los clics en `[data-nav="ruta"]`, `[data-go="slug"]` y
`a.wikilink[data-slug]` navegan por `App.go` sin recargar la página (⌘/Ctrl-clic y
`target="_blank"` pasan de largo): no hace falta atar listeners propios para navegar.

**DOM y paleta**

`App.$(sel, root?)` y `App.$$(sel, root?)` consultan el DOM acotados al contenedor de la vista
montada (`$$` devuelve un array). `App.paletteOpen()` responde si la paleta ⌘K del shell está
abierta (es una pregunta, como la usa el baseline con Escape); `App.openPalette()` la abre.
`App.quickLookup` NO lo provee el runtime: es un miembro que instala el propio bundle de Proba
y solo existe si ese bundle lo define.

**Render**

`App.escapeHtml`, `App.icon(nombre, size)`, `App.katex(tex, display)` (también
`App.katex.renderToString`), `App.KATEX_MACROS`,
`App.renderMarkdown(md, slugActual)`, `App.renderMathHtml`, `App.rich(texto)` (`$…$` en
línea), `App.enhanceDoc(root)`, `App.emptyState(titulo, sub)`, `App.backBar(href, label)`,
`App.fmt(n, digits)`, `App.cssVar("--primary")`, `App.withAlpha(color, alpha)`.

**Dibujo y matemática**

`App.Fig` y `App.Plot` (los helpers de dibujo portados del baseline) y `window.M` (la
biblioteca numérica: densidades, acumuladas, inversas, matrices).

**Progreso de la unidad**

La barra de progreso de cada división cuenta sus páginas leídas **más los pasos que aporte el
bundle**: cada paso vale uno, igual que una página. Un bundle que quiera sumar los suyos
declara `"progress": true` en el manifiesto —así se carga al entrar en la materia, como los de
figuras, y la barra cuenta aunque nadie abra la herramienta— y registra un proveedor:

```js
if (typeof App.registerProgressProvider === "function") {   // runtime viejo: no rompe
  App.registerProgressProvider({
    id: "ejercicios",
    label: "ejercicios",                       // plural, en minúsculas: es el rótulo del desglose
    stepsOf: function (u) {                    // los pasos de esa división
      return itemsOf(u).map(function (it) {
        return {
          id: it.id,
          label: "n.º " + it.numero,
          done: getEstado(it.id) >= 1,         // el criterio lo pone el bundle
          group: "Guía",                       // una tarjeta por grupo en la portada
          to: "/m/" + App.SUBJECT.slug + "/t/ejercicios?arg=" + encodeURIComponent(u + "/guia")
        };
      });
    }
  });
}
```

`stepsOf` se consulta cada vez que se recalcula el progreso: devuelva el estado del momento y
avise de los cambios con `App.progressChanged()` en el punto donde guarda el estado. El texto
del hero queda «12 / 20 páginas leídas · 8 / 34 ejercicios resueltos»; el progreso del lector
sigue hablando solo de páginas.

**Reglas de convivencia**

- El bundle corre en el origen del sitio y comparte el ámbito global con la plataforma y con
  los demás bundles —incluido el almacenamiento donde vive el estado personal de quien
  estudia—: envuelva todo en un IIFE y no cuelgue nada de `window` salvo por `App.register*`.
- No toque el DOM fuera de `main` (en una vista) o de `host` (en una figura).
- **Texto que no escribió usted** —el título de una página, lo que tipeó el usuario, un dato
  del JSON— se inserta con `textContent` o pasando por `App.escapeHtml`. Para markdown y
  matemática existen `App.renderMarkdown` y `App.rich`, que ya escapan lo que corresponde.
  Armar marcado concatenando valores crudos es la única forma de romper la plataforma desde
  un bundle.
- Los colores salen de `ctx.cssVar` / `App.cssVar`: la plataforma tiene tres temas y el
  bundle se redibuja al cambiarlos.
- Nada de `fetch` a terceros ni de `eval`: si hace falta un dato, va en `data`.

## 4. Bundle mínimo completo

Tres archivos. Una vista que dibuja y una figura para los callouts del wiki.

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

Después, en el `sinapsis.config.json`, el ítem del rail que la abre:

```jsonc
{ "id": "demo", "label": "Demostración", "icon": "flask", "kind": "tool", "target": "demo" }
```

`target` es el **id de la vista**, no el del bundle. `sinapsis validate` avisa si ningún
bundle registra esa vista.

El lector emite ese mismo marcado (`<figure class="figura doc-figure" data-fig="…">`) por
cada callout de figura, así que una figura registrada sirve igual en el wiki y dentro de una
vista propia.

Y en cualquier página del wiki, la figura:

```markdown
> [!figura] demo-normal
> La densidad de la normal estándar.
```

Sin bundle cargado, ese callout se sigue viendo como el epígrafe: una materia sin
herramientas no rompe nada.

## 5. Comandos

```bash
SINAPSIS_HOME="${SINAPSIS_HOME:-$HOME/Desktop/Projects/Sinapsis}"

# valida, comprueba que cada archivo declarado exista y que cada script parsee,
# y deja tools/<id>/dist/tool-push.json
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build

# lo mismo, minificando los scripts en tools/<id>/.dist/ y publicando esa versión
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools build --minify

# qué bundles tiene la materia en subjects/<slug>/tools del repositorio de la plataforma
pnpm --dir "$SINAPSIS_HOME" sinapsis -- tools list

# wiki + estudio + herramientas, en un solo paso: rama, commit y pull request
pnpm --dir "$SINAPSIS_HOME" sinapsis -- publish
```

**`tools push` ya no existe**: no hay servidor al que subir un bundle. Los bundles viajan
dentro del `publish` y llegan al sitio cuando el orquestador mergea el pull request.

Opciones comunes: `--config <file>`, `--dir <carpeta>` (otro lugar para los bundles),
`--repo <dir>`.

### Qué revisa `tools build`

| Comprobación | Si falla |
|---|---|
| El manifiesto cumple `ToolManifest` | Sale 1 con el campo (`scripts.0`, `views.1.id`…). |
| Cada ruta declarada cumple `ToolFilePath` | Sale 1: «ruta de bundle: …». |
| Cada archivo declarado existe y está dentro de la carpeta (también resolviendo enlaces simbólicos) | Sale 1. |
| Cada script parsea (`node --check`) | Sale 1 con el archivo y la línea. |
| El bundle no supera 20 MB | Sale 1 y explica qué sacar. |

Los avisos amarillos (scripts sin declarar, extensiones ajenas) no detienen la build.
