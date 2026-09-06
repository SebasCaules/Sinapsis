/* ============================================================
   figures.js — motor de figuras interactivas del wiki de estudio.

   Se carga DESPUÉS de core.js (necesita window.App) y ANTES de los módulos
   de vista que montan figuras (reader.js, study.js, taller.js…).

   ──────────────────────────────────────────────────────────────────────────
   CONTRATO (todo colgado de window.App)
   ──────────────────────────────────────────────────────────────────────────

   REGISTRO Y MONTAJE
     App.FIGURES                       {id: {draw, meta}}  registro vivo
     App.registerFigure(id, draw, meta)
         meta se NORMALIZA al registrar: `title` y `titulo` quedan con el
         mismo texto, `unidad` sale del prefijo del id cuando no viene
         declarada ("u8-…" → "8") y siempre es cadena, y `page` queda como
         slug pelado (sin carpeta y sin .md). El resto pasa tal cual.
         draw(host, api, meta)         host = elemento donde dibujar
                                       api  = {Fig, state, setState, cleanup}
         El valor devuelto por draw, si es función, se agrega como limpieza.
     App.mountFigures(container) → Number
         Recorre container.querySelectorAll('[data-fig]'); para cada uno:
           · host   = el.querySelector('.fig-host') || el
           · desmonta lo previo (ejecuta cleanups, vacía el host)
           · llama draw(host, api, meta) y marca host.dataset.mounted = "1"
             (y también el.dataset.mounted, cuando el ≠ host)
           · si el id NO está registrado, inserta
             <div class="fig-missing"><code>ID</code> figura no registrada</div>
         Devuelve la cantidad de figuras efectivamente DIBUJADAS (los
         placeholders de figura faltante o con error no cuentan).
         Es idempotente: llamarlo dos veces sobre el mismo contenedor
         redibuja sin duplicar. Pensado para invocarse en cada cambio de
         tema o resize (App.setRedraw), porque los colores se leen en
         tiempo de dibujo.
     App.unmountFigures(container) → Number
         Ejecuta las limpiezas y vacía los hosts. NO borra el estado.

   ESTADO
     El estado de cada figura vive en host.__figState (objeto plano) y
     SOBREVIVE al desmontaje: por eso un remonte por cambio de tema o
     resize conserva la posición de los deslizadores y todo lo demás.
       api.state          referencia directa a host.__figState
       api.setState(patch) mezcla patch en el estado y REDIBUJA la figura
       api.cleanup(fn)    registra una limpieza (listeners, timers…)
     Los controles (Fig.controls/toggle/select) leen su valor inicial del
     estado por su clave k y lo escriben ahí en cada cambio, así que la
     conservación es automática: no hace falta gestionarla en cada figura.

   COORDENADAS
     Salvo Fig.curve/Fig.area/Fig.bars —que reciben las escalas sx, sy y
     por eso trabajan en unidades de DATOS— todos los helpers de dibujo
     esperan PÍXELES del viewBox. Convierta con sx(v) / sy(v).

   HELPERS DE DIBUJO — App.Fig
     Todos leen los colores en tiempo de dibujo con App.cssVar, de los
     tokens --plot-grid, --plot-axis, --text, --text-2, --text-3,
     --primary, --accent, --good, --bad, --warn, --u1..--u9, --u0,
     --ueval, --surface, --surface-2, --border, y de los tokens de gráfico
     --s1..--s6, --seq-100..--seq-700, --div-n3..--div-p3, --plot-fill-a y
     --plot-band-a.

   PALETA DE GRÁFICO — App.Fig  (contrato nuevo, ola 14)
     Fig.series(i)   color de la ranura de serie i (1..6, --s1..--s6). La
                     paleta NO es cíclica: i > 6 devuelve la ranura 6 y avisa
                     por console.warn (con más de seis series conviene plegar
                     en «Otros» o separar en paneles). El orden de la ranura
                     es el mecanismo de seguridad para daltonismo: pida 1, 2,
                     3… en el mismo orden en que aparecen en la leyenda.
     Fig.seq(t)      rampa secuencial (magnitud continua), t ∈ [0, 1],
                     interpolando --seq-100..--seq-700 (claro → oscuro).
     Fig.div(t)      par divergente con neutro al medio, t ∈ [−1, 1]
                     (--div-n3..--div-p3, con --div-0 en el centro).
     Fig.status(n)   color de ESTADO: "good" | "warn" | "bad" (y sinónimos en
                     español). Reservado para significado — correcto /
                     atención / incorrecto, acepta / rechaza, región crítica —
                     y SIEMPRE acompañado de rótulo o icono. Nunca como
                     identidad de serie: para eso están las ranuras.
     Fig.SERIES_MAX  cantidad de ranuras (6).
     Fig.label(g, x, y, txt, o)  rótulo con clave de color opcional (ver abajo).
     Fig.hatch(svg, color, o)    patrón de rayado. CANAL SECUNDARIO: refuerza
                     una región ya distinguida por color; no es el relleno por
                     omisión de un área.

   VALORES POR OMISIÓN DEL MOTOR (ola 14 — cambian todas las figuras a la vez)
     · Rótulos de Fig.marker / Fig.vline / Fig.hline en color("text-2"), con un
       punto de 6 px del color de la serie DELANTE del texto (clave de color).
       El punto se apaga con {key: false} y se fuerza otro color con {keyColor}.
     · Fig.marker: anillo de 2 px de --surface; avisa por console.warn si se
       pide un radio menor a 4 px.
     · Fig.area: opacidad 0.10; con {band: true} usa var(--plot-band-a), la
       misma opacidad que la muestra de la leyenda.
     · Fig.bars: cada barra es un <path> con radio de 4 px SOLO en el extremo
       del dato (la base queda recta), 2 px de separación entre barras vecinas
       y sin opacidad (una barra es una marca sólida).
     · Grosor de trazo por omisión 2.0 px, con unión y remate redondos. Las
       líneas de REFERENCIA de Fig.vline / Fig.hline son canal secundario:
       punteadas, de 1.5 px y marcadas con la clase .fig-ref (por eso quedan
       fuera de la regla «trazo distinto de 2» de check-figuras.mjs).
     · Fig.legend: la muestra de relleno se pinta con la misma opacidad que la
       marca ({alpha} explícito, o --plot-band-a con {band: true}, o
       --plot-fill-a).
     · Cada <svg> recibe un <title> tomado de meta.title cuando la figura no
       pone uno propio.

   LECTURA AL PASAR EL PUNTERO (una sola capa por figura)
     Fig.curve / Fig.line / Fig.area / Fig.bars / Fig.marker registran sus
     puntos en el host:
       host.__series.push({label, color, kind, svg, pts:[{x, y, vx, vy}]})
     con x/y en píxeles del viewBox y vx/vy en unidades de dato cuando el
     ayudante las conoce. Se registra con {serie: "nombre"} y se evita con
     {serie: false}. Después de dibujar, mountFigures monta UNA capa por
     figura: una regla vertical, un punto por serie y un globo `.fig-tip` con
     el punto más cercano de cada serie (en barras, la lectura de la barra
     apuntada). El blanco de puntero cubre todo el lienzo pero va por DEBAJO
     del dibujo, así que no bloquea los controles ni los tiradores. La capa
     nace APAGADA y solo se enciende con el puntero encima; se apaga al salir.
     Solo entran en la lectura las series LEGIBLES —las que tienen rótulo
     ({serie: "nombre"} o {label}) o valor de dato (vy)—. Nunca se inventa un
     nombre: si en el globo hay series con rótulo, se muestran solo esas; si no
     hay ninguna con rótulo, se muestra UNA sola lectura, la del punto más
     cercano al puntero, en vez de una pila de números anónimos. La capa no se
     monta si la figura no registró series legibles, y se desactiva por figura
     con meta.hover === false.

   HERRAMIENTA DE DESARROLLO — estudio/check-figuras.mjs
     node estudio/check-figuras.mjs [unidad] [tema]
     Monta el arnés de una unidad (o de las diez) sobre el servidor local y
     cuenta, regla por regla, lo que se aparta de este contrato: rótulos
     pintados con el color de la serie, trazos distintos de 2.0, marcadores de
     radio menor a 4, barras de más de 24 px o sin separación, figuras sin
     <title>, figuras con dos o más series y sin leyenda (y al revés), prosa
     de más de 38 caracteres dentro del SVG, rejilla punteada, porcentaje de
     rayado, gradientes y series pintadas con --good/--warn/--bad. Deja un
     JSON por corrida y devuelve código 1 si alguna regla supera su umbral
     (los umbrales están en la cabecera del archivo).

     Fig.svg(host, {w, h, cls})                   → <svg> responsive .fig-svg
     Fig.panels(host, n, {heights, w, gap})       → [svg, …] mismo ancho
     Fig.scale(domain, range, {log})              → s(v), s.invert(px),
                                                    s.domain(), s.range(), s.log
     Fig.axes(svg, {sx, sy, xTicks, yTicks, xLabel, yLabel, grid, y0})
     Fig.line(svg, pts, {stroke, width, dash, fill, opacity, sx, sy, close})
     Fig.curve(svg, fn, sx, sy, {from, to, n, stroke, width, dash})
     Fig.area(svg, fn, sx, sy, {from, to, fill, opacity, hatch, base})
     Fig.bars(svg, data, sx, sy, {fill, width, stroke, opacity, base})
     Fig.marker(svg, x, y, {r, fill, stroke, label, labelDy, size})
     Fig.vline(svg, x, {y0, y1, stroke, dash, width, label, labelAt})
     Fig.hline(svg, y, {x0, x1, stroke, dash, width, label, labelAt})
     Fig.text(svg, x, y, str, {size, anchor, fill, mono, weight, baseline, rotate})
     Fig.tex(host, tex, {x, y, svg, anchor})      → KaTeX sobre el SVG
     Fig.drag(el, {onDrag(x, y, ev), onStart, onEnd})  → stop()
     Fig.grid(svg, {cols, rows, cell, x0, y0, gap, fill, stroke, onCell})
     Fig.timeline(svg, {t0, t1, marks, y, x0, x1, label, stroke})
     Fig.graph(svg, {nodes, edges, r, stroke, fill})
     Fig.iso3d({elev, azim, scale})               → {project, depth, rotate,
                                                     elev, azim, scale}
     Fig.surface(svg, fn, {xs, ys}, proj, {fillLow, fillHigh, stroke, cx, cy,
                 zScale, opacity})
     Fig.slice(svg, fn, {axis, at, range, n}, proj, {stroke, width, cx, cy,
                 zScale, plane, planeFill})

   CONTROLES Y LECTURAS — App.Fig
     Fig.controls(host, [{k, label, min, max, step, value, log, fmt}], onChange)
                                        → {get(k), set(k, v), values, el}
     Fig.buttons(host, [{label, onClick, cls, title}])          → {el, items}
     Fig.toggle(host, {k, label, value}, onChange)              → {get, set, el}
     Fig.select(host, {k, label, options:[{v,label}], value}, onChange)
                                                                → {get, set, el}
     Fig.readouts(host, [{k, label, tex}], opts)                → {set(k,v), el}
     Fig.legend(host, [{label, color, dash, fill}])             → {el}
     onChange recibe (k, valor, todos).
     Las etiquetas con TeX se componen con KaTeX por DOM (katex.render), sin
     innerHTML; si KaTeX no está disponible, degradan a <code>.
     MACROS: Fig.tex y las etiquetas {tex} de controls/readouts se componen
     con las MISMAS macros que A.katex usa en el cuerpo del wiki —\R \N \E
     \P \Var \Cov \indic—, tomadas de A.KATEX_MACROS si core.js las exporta y
     si no de la copia de reserva Fig.MACROS (que se puede extender). Sin
     ellas, esas macros fallan EN SILENCIO (KaTeX deja el texto literal y \P
     sale como ¶), así que no se debe quitar este paso.

   TEXTO DEL SVG — una trampa que conviene conocer
     En SVG los atributos de presentación (fill, font-size) tienen
     especificidad CERO frente a cualquier regla de hoja de estilo. Por eso
     Fig.text escribe tamaño y color como ESTILO EN LÍNEA, y figures.css no
     declara ni fill ni font-size sobre `.fig-svg text`: si lo hiciera,
     anularía en silencio las opciones {fill} y {size} de cada llamada.
     El tamaño sale como calc(Npx * var(--fig-scale, 1)); figures.css sube
     ese factor en pantallas angostas para que el texto siga legible cuando
     el viewBox se escala hacia abajo.

   MEDIDAS DEL LIENZO
     El ancho y el alto del viewBox se resuelven SIEMPRE sobre el <svg>
     dueño (no sobre el nodo recibido), así que los valores por omisión de
     vline/hline/tex/timeline/surface/slice son correctos también cuando el
     helper recibe una capa <g> — que es el patrón normal de una figura, para
     poder vaciar el grupo y redibujar barato.

   UTILIDADES — App.Fig
     Fig.rng(seed)   mulberry32 → u(); u.normal(mu, s); u.exp(l); u.int(n);
                     u.range(lo, hi); u.pick(arr)
     Fig.fmt(x, d)   número a texto con d decimales (2 por defecto)
     Fig.mix(c1, c2, t)  interpolación de colores (hex o rgb())
     Fig.color(name) atajo de App.cssVar('--' + name)

   FIGURAS REGISTRADAS
     Este archivo es solo el motor: no registra ninguna figura propia. Las
     figuras del wiki las declaran los módulos estudio/figuras/u<N>.js, uno
     por unidad, que se cargan después de este.
   ============================================================ */
import type { FigureContext, FigureDraw, FigureMeta } from "@sinapsis/contract";
import { KATEX_TRUST } from "./markdown.js";

/**
 * Tipo laxo del motor portado. El baseline es JavaScript sin tipos y las 92
 * figuras de Proba lo consumen tal cual: tipar el motor «bien» cambiaría su
 * superficie. Se mantiene acotado a este archivo y a `plot.ts`.
 */
type Loose = any;

/**
 * `api` que recibe cada figura. Es el del baseline (`Fig`, `state`, `setState`,
 * `cleanup`, `id`, `host`, `figure`) más los tres miembros que pide el
 * `FigureContext` del contrato (`theme`, `cssVar`, `redraw`).
 */
export interface FigureApi extends FigureContext {
  Fig: Record<string, unknown>;
  state: Record<string, unknown>;
  setState(patch: Record<string, unknown>): void;
  cleanup(fn: () => void): void;
  id: string;
  host: HTMLElement;
  figure: HTMLElement;
}

/** Firma real de `draw` en el motor portado (el baseline recibe también `meta`). */
export type FigureDrawFn = (
  host: HTMLElement,
  api: FigureApi,
  meta: FigureMeta,
) => void | (() => void);

export interface FiguresEngine {
  Fig: Record<string, unknown>;
  FIGURES: Record<string, { draw: FigureDraw; meta: FigureMeta }>;
  registerFigure(id: string, draw: FigureDraw, meta?: FigureMeta): void;
  mountFigures(container: HTMLElement | Document | null): number;
  unmountFigures(container: HTMLElement | Document | null): number;
}

/**
 * Crea el motor de figuras contra un `App` ya construido (necesita
 * `A.cssVar`, `A.escapeHtml`, `A.katex`/`A.KATEX_MACROS`). Equivale al IIFE
 * `figures.js` del baseline, que leía `window.App`.
 */
export function createFigures(A: Loose): FiguresEngine {

  var NS = "http://www.w3.org/2000/svg";
  var uid = 0;

  // ---------------- utilidades básicas ----------------

  function cssVar(name?: any): any {
    var v = A.cssVar ? A.cssVar(name) : "";
    return v || "";
  }
  function color(name?: any): any { return cssVar(name.charAt(0) === "-" ? name : "--" + name); }

  // ---------------- paleta de gráfico (ola 14) ----------------
  // Seis ranuras de identidad de serie (--s1..--s6), independientes de los
  // tokens semánticos de interfaz. El ORDEN de la ranura es el mecanismo de
  // seguridad para daltonismo: se pide 1, 2, 3… en el orden de la leyenda.
  var SERIES_MAX = 6;

  // Los avisos del motor se emiten UNA sola vez por mensaje: una página con
  // noventa figuras no debe llenar la consola con la misma advertencia (y las
  // herramientas de captura tratan cada aviso como un renglón de error).
  var avisado: Loose = {};
  function avisar(msg?: any): any {
    if (avisado[msg] || !window.console) return;
    avisado[msg] = 1;
    console.warn(msg);
  }

  // Grosor de las LÍNEAS DE REFERENCIA de Fig.vline / Fig.hline: son canal
  // secundario (punteadas, sin dato propio) y por eso van más finas que el
  // trazo de datos, que es de 2.0 px. Se marcan con la clase .fig-ref.
  var REF_W = 1.5;

  function series(i?: any): any {
    var k = Math.round(i);
    if (!isFinite(k) || k < 1) k = 1;
    if (k > SERIES_MAX) {
      avisar("Fig.series(" + i + "): la paleta tiene " + SERIES_MAX + " ranuras; se devuelve la " +
        SERIES_MAX + ". Con más de " + SERIES_MAX + " series conviene plegar en «Otros» o separar en paneles.");
      k = SERIES_MAX;
    }
    return color("s" + k) || color("primary");
  }

  // interpola una lista de paradas de color en t ∈ [0, 1]
  function rampAt(stops?: any, t?: any): any {
    var list = [], i;
    for (i = 0; i < stops.length; i++) if (stops[i]) list.push(stops[i]);
    if (!list.length) return color("primary");
    if (list.length === 1) return list[0];
    var u = Math.max(0, Math.min(1, isFinite(t) ? t : 0)) * (list.length - 1);
    var lo = Math.floor(u);
    if (lo >= list.length - 1) return list[list.length - 1];
    return mix(list[lo], list[lo + 1], u - lo);
  }

  // rampa secuencial (magnitud continua): t ∈ [0, 1], claro → oscuro
  function seq(t?: any): any {
    return rampAt([color("seq-100"), color("seq-200"), color("seq-300"), color("seq-400"),
      color("seq-500"), color("seq-600"), color("seq-700")], t);
  }

  // par divergente con neutro al medio: t ∈ [−1, 1]
  function divg(t?: any): any {
    var v = isFinite(t) ? Math.max(-1, Math.min(1, t)) : 0;
    return rampAt([color("div-n3"), color("div-n2"), color("div-n1"), color("div-0"),
      color("div-p1"), color("div-p2"), color("div-p3")], (v + 1) / 2);
  }

  // color de ESTADO (correcto / atención / incorrecto). Nunca como identidad
  // de serie: para eso están las ranuras de Fig.series.
  var STATUS: Loose = {
    good: "good", bien: "good", ok: "good", acepta: "good", correcto: "good",
    warn: "warn", aviso: "warn", atencion: "warn", "atención": "warn",
    bad: "bad", mal: "bad", error: "bad", rechaza: "bad", incorrecto: "bad"
  };
  function status(name?: any): any {
    var k = STATUS[String(name || "").toLowerCase()];
    if (!k) {
      avisar("Fig.status('" + name + "'): estado desconocido; se usa 'warn'.");
      k = "warn";
    }
    return color(k);
  }

  // ---------------- registro de series para la capa de hover ----------------
  // Cada helper de dibujo que representa una SERIE deja sus puntos en el host,
  // en píxeles del viewBox (x, y) y —cuando el helper las conoce— en unidades
  // de dato (vx, vy). mountFigures monta con eso una sola capa de lectura.
  function hostOfSvg(node?: any): any {
    var s0 = ownerSvg(node);
    return (s0 && s0.__host) || null;
  }
  function pushSeries(node?: any, entry?: any): any {
    var h = hostOfSvg(node);
    if (!h || !entry || !entry.pts || !entry.pts.length) return;
    entry.svg = ownerSvg(node);
    var list = (h.__series = h.__series || []);
    // Los marcadores sueltos que comparten color y rótulo son UNA sola serie
    // (si no, una figura con trece puntos abriría trece filas en la lectura).
    if (entry.kind === "marker") {
      for (var i = 0; i < list.length; i++) {
        if (list[i].kind === "marker" && list[i].svg === entry.svg &&
            list[i].color === entry.color && list[i].label === entry.label) {
          list[i].pts = list[i].pts.concat(entry.pts);
          return;
        }
      }
    }
    list.push(entry);
  }

  function num(x?: any, d?: any): any {
    if (x == null || !isFinite(x)) return x > 0 ? "∞" : (x < 0 ? "-∞" : "—");
    var k = d == null ? 2 : d;
    var t = x.toFixed(k);
    // «-0.000» es ruido: un cero es un cero.
    if (/^-0(\.0*)?$/.test(t)) t = t.slice(1);
    return t;
  }

  function parseColor(c?: any): any {
    c = (c || "").trim();
    if (c.charAt(0) === "#") {
      var h = c.slice(1);
      if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
      var n = parseInt(h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    var m = c.match(/rgba?\(([^)]+)\)/);
    if (m) {
      var p = m[1].split(/[,\s/]+/).filter(function(s?: any): any { return s !== ""; });
      return [+p[0] || 0, +p[1] || 0, +p[2] || 0];
    }
    return [128, 128, 128];
  }
  function mix(c1?: any, c2?: any, t?: any): any {
    var a = parseColor(c1), b = parseColor(c2);
    t = Math.max(0, Math.min(1, t || 0));
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," +
      Math.round(a[1] + (b[1] - a[1]) * t) + "," +
      Math.round(a[2] + (b[2] - a[2]) * t) + ")";
  }

  function el(tag?: any, attrs?: any, parent?: any): any {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      var v = attrs[k];
      if (v == null || v === false) continue;
      e.setAttribute(k, String(v));
    }
    if (parent) parent.appendChild(e);
    return e;
  }
  function div(cls?: any, parent?: any): any {
    var d = document.createElement("div");
    if (cls) d.className = cls;
    if (parent) parent.appendChild(d);
    return d;
  }
  function defsOf(svg?: any): any {
    var d = svg.querySelector("defs");
    if (!d) { d = el("defs", null, null); svg.insertBefore(d, svg.firstChild); }
    return d;
  }
  function ownerSvg(node?: any): any {
    while (node && node.tagName !== "svg") node = node.parentNode;
    return node;
  }
  // Medidas del viewBox. __w/__h/__wrap las escribe Fig.svg en el <svg>, pero
  // los helpers reciben habitualmente una capa <g>: el patrón normal de una
  // figura es dibujar sobre un grupo para poder vaciarlo y redibujar barato.
  // Por eso SIEMPRE se resuelve antes el <svg> dueño; leer __w/__h del <g>
  // devolvía la constante de reserva (600/300) sin ningún aviso.
  function dimW(node?: any): any { var s = ownerSvg(node); return (s && s.__w) || 600; }
  function dimH(node?: any): any { var s = ownerSvg(node); return (s && s.__h) || 300; }

  // Macros de KaTeX del proyecto. La fuente de verdad es KATEX_MACROS de
  // core.js (lo que usa A.katex para el markdown del wiki); si core.js llega a
  // exportarlas en el objeto App, se toman de ahí y esta tabla queda de
  // reserva. Sin ellas, \E \Var \P \R \N \Cov \indic FALLAN EN SILENCIO dentro
  // de las figuras: KaTeX con throwOnError:false los deja como texto literal
  // (y \P sale como el calderón ¶), sin aviso en consola.
  var MACROS: Loose = {
    "\\R": "\\mathbb{R}", "\\N": "\\mathbb{N}", "\\E": "\\mathbb{E}", "\\P": "\\mathbb{P}",
    "\\Var": "\\operatorname{Var}", "\\Cov": "\\operatorname{Cov}", "\\indic": "\\mathbf{1}"
  };
  function macros(): any {
    var m = A.KATEX_MACROS;
    if (m && typeof m === "object") {
      var out: Loose = {}, k;
      for (k in MACROS) if (Object.prototype.hasOwnProperty.call(MACROS, k)) out[k] = MACROS[k];
      for (k in m) if (Object.prototype.hasOwnProperty.call(m, k)) out[k] = m[k];
      return out;
    }
    return MACROS;
  }

  // Compone TeX dentro de un nodo por DOM (KaTeX construye los elementos;
  // no se asigna markup como texto en ningún punto del módulo). Las opciones
  // son las mismas que usa A.katex en core.js — macros incluidas —, así que
  // una fórmula se ve igual dentro de una figura que en el cuerpo del wiki.
  function putTex(node?: any, str?: any): any {
    while (node.firstChild) node.removeChild(node.firstChild);
    if ((window as Loose).katex && typeof (window as Loose).katex.render === "function") {
      try {
        (window as Loose).katex.render(String(str), node, {
          throwOnError: false, strict: false, trust: KATEX_TRUST, macros: macros()
        });
        return node;
      } catch (e) { /* cae al literal */ }
    }
    var c = document.createElement("code");
    c.textContent = String(str);
    node.appendChild(c);
    return node;
  }

  // ---------------- escalas y ejes ----------------

  function scale(domain?: any, range?: any, opts?: any): any {
    opts = opts || {};
    var lg = !!opts.log;
    var d0 = +domain[0], d1 = +domain[1], r0 = +range[0], r1 = +range[1];
    var a0 = lg ? Math.log(d0) : d0;
    var a1 = lg ? Math.log(d1) : d1;
    var span = (a1 - a0) || 1;
    function s(v?: any): any {
      var t = ((lg ? Math.log(v) : v) - a0) / span;
      return r0 + t * (r1 - r0);
    }
    s.invert = function(px?: any): any {
      var t = (px - r0) / ((r1 - r0) || 1);
      var v = a0 + t * span;
      return lg ? Math.exp(v) : v;
    };
    s.domain = function(): any { return [d0, d1]; };
    s.range = function(): any { return [r0, r1]; };
    s.log = lg;
    s.clamp = function(v?: any): any { return Math.max(Math.min(d0, d1), Math.min(Math.max(d0, d1), v)); };
    return s;
  }

  function niceTicks(a?: any, b?: any, count?: any): any {
    count = count || 6;
    if (!isFinite(a) || !isFinite(b) || a === b) return [a];
    var lo = Math.min(a, b), hi = Math.max(a, b);
    var raw = (hi - lo) / count;
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var norm = raw / mag;
    var step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
    var out = [], v = Math.ceil(lo / step) * step;
    for (; v <= hi + step * 1e-9 && out.length < 200; v += step) {
      out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    }
    return out;
  }
  function logTicks(a?: any, b?: any): any {
    var out: Loose[] = [];
    var e0 = Math.floor(Math.log(Math.min(a, b)) / Math.LN10);
    var e1 = Math.ceil(Math.log(Math.max(a, b)) / Math.LN10);
    for (var e = e0; e <= e1 && out.length < 40; e++) {
      var v = Math.pow(10, e);
      if (v >= Math.min(a, b) * 0.999 && v <= Math.max(a, b) * 1.001) out.push(v);
    }
    return out.length ? out : niceTicks(a, b, 5);
  }
  function tickList(s?: any, spec?: any): any {
    if (Array.isArray(spec)) return spec;
    var d = s.domain();
    var n = typeof spec === "number" ? spec : 6;
    return s.log ? logTicks(d[0], d[1]) : niceTicks(d[0], d[1], n);
  }
  function tickLabel(v?: any): any {
    if (v === 0) return "0";
    var av = Math.abs(v);
    if (av >= 1e5 || (av < 1e-3 && av > 0)) return v.toExponential(0).replace("e+", "e");
    if (Number.isInteger(v)) return String(v);
    if (av >= 100) return v.toFixed(0);
    if (av >= 10) return v.toFixed(1);
    return String(Math.round(v * 1000) / 1000);
  }

  // ---------------- lienzo ----------------

  // El envoltorio de scroll (.fig-scroll) va SIEMPRE por fuera de .fig-plot.
  // En pantallas angostas figures.css le da al dibujo un ancho mínimo legible
  // y el sobrante se desplaza en .fig-scroll; .fig-plot conserva el ancho del
  // dibujo, que es lo que necesita Fig.tex: sus overlays se posicionan en % y
  // quedarían corridos si el que se achicara fuese .fig-plot.
  // opts.noScroll lo omite: lo usa panels(), que pone un solo .fig-scroll para
  // todos sus paneles y así los mantiene alineados al desplazarse.
  function svgOf(host?: any, opts?: any): any {
    opts = opts || {};
    var w = opts.w || 640, h = opts.h || 320;
    var wrap = div("fig-plot", opts.noScroll ? host : div("fig-scroll", host));
    var s = el("svg", {
      viewBox: "0 0 " + w + " " + h,
      class: "fig-svg" + (opts.cls ? " " + opts.cls : ""),
      preserveAspectRatio: opts.preserveAspectRatio || "xMidYMid meet",
      role: "img"
    }, wrap);
    s.style.width = "100%";
    s.style.height = "auto";
    if (opts.maxHeight) s.style.maxHeight = opts.maxHeight;
    s.__w = w; s.__h = h; s.__wrap = wrap;
    // el host DUEÑO de la figura (Fig.panels dibuja sobre una caja intermedia)
    s.__host = host.__figHost || host;
    if (opts.title) el("title", null, s).textContent = opts.title;
    (host.__figSvgs = host.__figSvgs || []).push(s);
    return s;
  }

  function panels(host?: any, n?: any, opts?: any): any {
    opts = opts || {};
    var w = opts.w || 640;
    var hs = opts.heights || [];
    var box = div("fig-panels", div("fig-scroll", host));
    box.__figHost = host.__figHost || host;
    host.__figSvgs = host.__figSvgs || [];
    box.__figSvgs = host.__figSvgs;
    var out: Loose = [];
    for (var i = 0; i < n; i++) {
      var h = hs[i] || opts.h || Math.round(300 / n);
      var s = svgOf(box, { w: w, h: h, cls: opts.cls, noScroll: true });
      if (opts.gap && i) s.__wrap.style.marginTop = opts.gap + "px";
      out.push(s);
    }
    out.w = w;
    out.el = box;
    return out;
  }

  // ---------------- primitivas de dibujo ----------------

  function axes(svg?: any, o?: any): any {
    o = o || {};
    var sx = o.sx, sy = o.sy;
    if (!sx || !sy) return null;
    var xr = sx.range(), yr = sy.range();
    var x0 = Math.min(xr[0], xr[1]), x1 = Math.max(xr[0], xr[1]);
    var y0 = Math.min(yr[0], yr[1]), y1 = Math.max(yr[0], yr[1]);
    var g = el("g", { class: "fig-axes" }, svg);
    var cGrid = color("plot-grid"), cAxis = color("plot-axis"), cTxt = color("text-3");
    var xt = tickList(sx, o.xTicks == null ? 6 : o.xTicks);
    var yt = tickList(sy, o.yTicks == null ? 5 : o.yTicks);

    if (o.grid !== false) {
      yt.forEach(function(v?: any): any {
        var py = sy(v);
        el("line", { x1: x0, y1: py, x2: x1, y2: py, stroke: cGrid, "stroke-width": 1 }, g);
      });
      if (o.gridX !== false) xt.forEach(function(v?: any): any {
        var px = sx(v);
        el("line", { x1: px, y1: y0, x2: px, y2: y1, stroke: cGrid, "stroke-width": 1 }, g);
      });
    }

    // eje x: en la fila del cero si el cero cae dentro del dominio
    var baseY = y1;
    if (o.y0 != null) baseY = sy(o.y0);
    else {
      var dy = sy.domain();
      if (Math.min(dy[0], dy[1]) <= 0 && Math.max(dy[0], dy[1]) >= 0) baseY = sy(0);
    }
    baseY = Math.max(y0, Math.min(y1, baseY));
    el("line", { x1: x0, y1: baseY, x2: x1, y2: baseY, stroke: cAxis, "stroke-width": 1.2 }, g);
    el("line", { x1: x0, y1: y0, x2: x0, y2: y1, stroke: cAxis, "stroke-width": 1.2 }, g);

    if (o.xTicks !== false) xt.forEach(function(v?: any): any {
      var px = sx(v);
      el("line", { x1: px, y1: baseY, x2: px, y2: baseY + 4, stroke: cAxis, "stroke-width": 1 }, g);
      text(g, px, baseY + 7, tickLabel(v), { size: 11, anchor: "middle", baseline: "hanging", fill: cTxt, mono: true });
    });
    if (o.yTicks !== false) yt.forEach(function(v?: any): any {
      var py = sy(v);
      text(g, x0 - 6, py, tickLabel(v), { size: 11, anchor: "end", baseline: "middle", fill: cTxt, mono: true });
    });

    if (o.xLabel) text(g, (x0 + x1) / 2, y1 + 26, o.xLabel, { size: 12, anchor: "middle", baseline: "hanging", fill: cTxt });
    if (o.yLabel) text(g, x0 - 36, (y0 + y1) / 2, o.yLabel, { size: 12, anchor: "middle", fill: cTxt, rotate: -90 });
    g.__baseY = baseY;
    return g;
  }

  function path(svg?: any, d?: any, o?: any): any {
    o = o || {};
    return el("path", {
      d: d,
      fill: o.fill || "none",
      stroke: o.stroke || "none",
      "stroke-width": o.width == null ? 2.0 : o.width,   // grosor por omisión del motor
      "stroke-dasharray": o.dash || null,
      "stroke-linejoin": "round",
      "stroke-linecap": o.cap || "round",
      opacity: o.opacity == null ? null : o.opacity,
      class: o.cls || null
    }, svg);
  }

  function ptsToPath(pts?: any, close?: any): any {
    var d = "", i;
    for (i = 0; i < pts.length; i++) {
      if (!isFinite(pts[i][0]) || !isFinite(pts[i][1])) continue;
      d += (d ? "L" : "M") + (Math.round(pts[i][0] * 100) / 100) + " " + (Math.round(pts[i][1] * 100) / 100);
    }
    return d + (close ? "Z" : "");
  }

  function line(svg?: any, pts?: any, o?: any): any {
    o = o || {};
    var mapped = pts.map(function(p?: any): any {
      var x = p[0] != null ? p[0] : p.x, y = p[1] != null ? p[1] : p.y;
      return [o.sx ? o.sx(x) : x, o.sy ? o.sy(y) : y];
    });
    var stroke = o.stroke || color("primary");
    var el0 = path(svg, ptsToPath(mapped, o.close), {
      stroke: stroke, width: o.width, dash: o.dash,
      fill: o.fill, opacity: o.opacity, cls: o.cls
    });
    if (o.serie !== false && !o.fill) {
      pushSeries(svg, {
        label: o.serie || o.label || null, color: stroke, kind: "line",
        pts: mapped.map(function(m?: any, i?: any): any {
          var pi = pts[i] || [];
          var vx = pi[0] != null ? pi[0] : pi.x, vy = pi[1] != null ? pi[1] : pi.y;
          return { x: m[0], y: m[1], vx: vx, vy: vy };
        })
      });
    }
    return el0;
  }

  function samples(fn?: any, from?: any, to?: any, n?: any): any {
    var out = [], i;
    n = n || 160;
    for (i = 0; i <= n; i++) {
      var x = from + (to - from) * i / n;
      var y = fn(x);
      if (isFinite(y)) out.push([x, y]);
    }
    return out;
  }

  function curve(svg?: any, fn?: any, sx?: any, sy?: any, o?: any): any {
    o = o || {};
    var d = sx.domain();
    var from = o.from == null ? d[0] : o.from;
    var to = o.to == null ? d[1] : o.to;
    var raw = samples(fn, from, to, o.n || 200);
    var pts = raw.map(function(p?: any): any { return [sx(p[0]), sy(p[1])]; });
    var stroke = o.stroke || color("primary");
    var el0 = path(svg, ptsToPath(pts), {
      stroke: stroke,
      width: o.width == null ? 2.0 : o.width,
      dash: o.dash, fill: o.fill, opacity: o.opacity, cls: o.cls
    });
    if (o.serie !== false) {
      pushSeries(svg, {
        label: o.serie || o.label || null, color: stroke, kind: "curve",
        pts: pts.map(function(m?: any, i?: any): any { return { x: m[0], y: m[1], vx: raw[i][0], vy: raw[i][1] }; })
      });
    }
    return el0;
  }

  // CANAL SECUNDARIO. El rayado no es el relleno por omisión de un área: sirve
  // para reforzar una región ya distinguida por color (por ejemplo la región
  // crítica de un contraste), o para separar dos áreas que se superponen.
  function hatchPattern(svg?: any, stroke?: any, opts?: any): any {
    opts = opts || {};
    var id = "figh" + (++uid);
    var size = opts.size || 7;
    var p = el("pattern", {
      id: id, width: size, height: size,
      patternUnits: "userSpaceOnUse",
      patternTransform: "rotate(" + (opts.angle == null ? 45 : opts.angle) + ")"
    }, defsOf(svg));
    el("line", { x1: 0, y1: 0, x2: 0, y2: size, stroke: stroke, "stroke-width": opts.width || 1.6 }, p);
    return "url(#" + id + ")";
  }

  function area(svg?: any, fn?: any, sx?: any, sy?: any, o?: any): any {
    o = o || {};
    var d = sx.domain();
    var from = o.from == null ? d[0] : o.from;
    var to = o.to == null ? d[1] : o.to;
    var base = o.base == null ? 0 : o.base;
    var raw = samples(fn, from, to, o.n || 200);
    var pts = raw.map(function(p?: any): any { return [sx(p[0]), sy(p[1])]; });
    if (!pts.length) return null;
    var by = sy(base);
    var all = [[sx(from), by]].concat(pts, [[sx(to), by]]);
    var fill = o.fill || color("primary");
    var d2 = ptsToPath(all, true);
    // Opacidad por omisión 0.10: el área es contexto, no la marca principal.
    // Con {band: true} se usa --plot-band-a, la MISMA opacidad que el recuadro
    // de la leyenda, para que la banda y su muestra se vean iguales.
    var defA = o.band ? (parseFloat(color("plot-band-a")) || 0.14) : 0.10;
    var alpha = o.opacity == null ? defA : o.opacity;
    if (o.hatch) {
      var back = path(svg, d2, { fill: fill, opacity: alpha, cls: o.cls });
      var pat = hatchPattern(svg, fill, typeof o.hatch === "object" ? o.hatch : null);
      path(svg, d2, { fill: pat, opacity: o.hatchOpacity == null ? 0.5 : o.hatchOpacity });
      return back;
    }
    var el0 = path(svg, d2, {
      fill: fill, opacity: alpha, cls: o.cls,
      stroke: o.stroke, width: o.strokeWidth
    });
    if (o.serie !== false) {
      pushSeries(svg, {
        label: o.serie || o.label || null, color: fill, kind: "area", alpha: alpha,
        pts: pts.map(function(m?: any, i?: any): any { return { x: m[0], y: m[1], vx: raw[i][0], vy: raw[i][1] }; })
      });
    }
    return el0;
  }

  function bars(svg?: any, data?: any, sx?: any, sy?: any, o?: any): any {
    o = o || {};
    var g = el("g", { class: "fig-bars" }, svg);
    var pts = data.map(function(p?: any): any {
      if (Array.isArray(p)) return { x: p[0], y: p[1] };
      return { x: p.x, y: p.y, fill: p.fill, opacity: p.opacity };
    });
    var wData = o.width;
    if (wData == null) {
      var minGap = Infinity;
      for (var i = 1; i < pts.length; i++) minGap = Math.min(minGap, Math.abs(pts[i].x - pts[i - 1].x));
      wData = isFinite(minGap) ? minGap * 0.72 : (sx.domain()[1] - sx.domain()[0]) / 12;
    }
    var base = o.base == null ? 0 : o.base;
    var by = sy(base);
    var fill = o.fill || color("primary");
    // separación de 2 px entre barras vecinas (1 px por lado) y radio de 4 px
    // SOLO en el extremo del dato: la base queda recta sobre el eje.
    var gap = o.gap == null ? 2 : o.gap;
    var reg: Loose[] = [];
    pts.forEach(function(p?: any): any {
      if (!isFinite(p.y)) return;
      var xa = sx(p.x - wData / 2), xb = sx(p.x + wData / 2);
      var x0 = Math.min(xa, xb), x1 = Math.max(xa, xb);
      if (x1 - x0 > gap + 2) { x0 += gap / 2; x1 -= gap / 2; }
      var y = sy(p.y);
      var yTop = Math.min(y, by), yBot = Math.max(y, by);
      if (yBot - yTop < 0.5) yBot = yTop + 0.5;
      var w = Math.max(1, x1 - x0), h = yBot - yTop;
      var r = Math.min(o.rx == null ? 4 : o.rx, w / 2, h);
      var up = y <= by;                       // el dato está arriba de la base
      var d;
      if (r <= 0.2) {
        d = "M" + x0 + " " + yTop + "H" + x1 + "V" + yBot + "H" + x0 + "Z";
      } else if (up) {
        d = "M" + x0 + " " + yBot + "V" + (yTop + r) +
            "Q" + x0 + " " + yTop + " " + (x0 + r) + " " + yTop +
            "H" + (x1 - r) + "Q" + x1 + " " + yTop + " " + x1 + " " + (yTop + r) +
            "V" + yBot + "Z";
      } else {
        d = "M" + x0 + " " + yTop + "V" + (yBot - r) +
            "Q" + x0 + " " + yBot + " " + (x0 + r) + " " + yBot +
            "H" + (x1 - r) + "Q" + x1 + " " + yBot + " " + x1 + " " + (yBot - r) +
            "V" + yTop + "Z";
      }
      el("path", {
        d: d,
        fill: p.fill || fill,
        // sin opacidad por omisión: una barra es una marca sólida
        opacity: p.opacity == null ? (o.opacity == null ? null : o.opacity) : p.opacity,
        stroke: o.stroke || null, "stroke-width": o.stroke ? (o.strokeWidth || 1) : null
      }, g);
      reg.push({ x: (x0 + x1) / 2, y: y, vx: p.x, vy: p.y });
    });
    if (o.serie !== false) {
      pushSeries(svg, { label: o.serie || o.label || null, color: fill, kind: "bars", pts: reg });
    }
    return g;
  }

  function text(svg?: any, x?: any, y?: any, str?: any, o?: any): any {
    o = o || {};
    var fill = o.fill || color("text-2");
    var t = el("text", {
      x: x, y: y,
      "text-anchor": o.anchor || "start",
      "dominant-baseline": o.baseline || "auto",
      fill: fill,                       // atributo: sirve si la hoja no cargó
      "font-weight": o.weight || null,
      class: o.mono ? "mono" : null,
      transform: o.rotate ? "rotate(" + o.rotate + " " + x + " " + y + ")" : null,
      opacity: o.opacity == null ? null : o.opacity
    }, svg);
    t.textContent = str == null ? "" : String(str);
    // TAMAÑO Y COLOR VAN POR ESTILO EN LÍNEA, NO POR ATRIBUTO. En SVG los
    // atributos de presentación tienen especificidad cero: cualquier regla de
    // figures.css sobre `.fig-svg text` les ganaría y anularía en silencio las
    // opciones {size} y {fill} de cada llamada. El estilo en línea, en cambio,
    // le gana a la hoja. (figures.css ya no declara ni fill ni font-size.)
    t.style.fill = fill;
    // el factor --fig-scale lo sube figures.css en pantallas angostas, para que
    // el texto siga siendo legible cuando el viewBox se escala hacia abajo.
    t.style.fontSize = "calc(" + (o.size || (o.mono ? 11 : 12)) + "px * var(--fig-scale, 1))";
    if (o.mono) t.style.fontFamily = "var(--font-mono)";
    return t;
  }

  // Ancho aproximado de una cadena, para colocar la clave de color delante del
  // rótulo sin medir en el DOM (medir forzaría un reflujo por cada etiqueta).
  function approxWidth(str?: any, size?: any, mono?: any): any {
    return String(str == null ? "" : str).length * size * (mono ? 0.60 : 0.54);
  }

  // Rótulo de una marca: texto en --text-2 y, si acompaña a una serie, un punto
  // de 6 px con el color de esa serie delante del texto (clave de color). El
  // punto se puede quitar con {key: false}.
  function keyedLabel(parent?: any, x?: any, y?: any, str?: any, o?: any): any {
    o = o || {};
    var size = o.size || 11;
    var anchor = o.anchor || "start";
    var fill = o.fill || color("text-2");
    var keyColor = o.key === false ? null : o.keyColor;
    if (!keyColor) {
      return text(parent, x, y, str, {
        size: size, anchor: anchor, fill: fill, mono: o.mono, weight: o.weight, baseline: o.baseline
      });
    }
    var r = 3, gap = 4;
    var w = approxWidth(str, size, o.mono);
    var cx, tx;
    if (anchor === "middle") {
      var left = x - (2 * r + gap + w) / 2;
      cx = left + r; tx = left + 2 * r + gap + w / 2;
    } else if (anchor === "end") {
      cx = x - w - gap - r; tx = x;
    } else {
      cx = x + r; tx = x + 2 * r + gap;
    }
    el("circle", { cx: cx, cy: y - size * 0.30, r: r, fill: keyColor }, parent);
    return text(parent, tx, y, str, {
      size: size, anchor: anchor, fill: fill, mono: o.mono, weight: o.weight, baseline: o.baseline
    });
  }

  function marker(svg?: any, x?: any, y?: any, o?: any): any {
    o = o || {};
    var g = el("g", { class: "fig-marker" }, svg);
    var r = o.r == null ? 4.5 : o.r;
    if (r < 4) {
      avisar("Fig.marker: radio " + r + " px; por debajo de 4 px el punto se pierde " +
        "en pantalla y en impresión. Use r ≥ 4. (Se avisa una vez por radio; " +
        "el conteo completo lo da estudio/check-figuras.mjs.)");
    }
    var fill = o.fill || color("primary");
    el("circle", {
      cx: x, cy: y, r: r,
      fill: fill,
      // anillo de 2 px del color del fondo: separa el punto de lo que tenga debajo
      stroke: o.stroke || color("surface"),
      "stroke-width": o.strokeWidth == null ? 2 : o.strokeWidth,
      opacity: o.opacity == null ? null : o.opacity
    }, g);
    if (o.label != null) {
      keyedLabel(g, x, y + (o.labelDy == null ? -10 : o.labelDy), o.label, {
        size: o.size || 11, anchor: o.labelAnchor || "middle",
        fill: o.labelFill || color("text-2"), mono: o.mono !== false,
        key: o.key, keyColor: o.key === false ? null : (o.keyColor || fill)
      });
    }
    if (o.serie !== false) {
      pushSeries(svg, {
        label: o.serie || o.label || null, color: fill, kind: "marker",
        pts: [{ x: x, y: y, vx: o.vx, vy: o.vy }]
      });
    }
    return g;
  }

  function vline(svg?: any, x?: any, o?: any): any {
    o = o || {};
    var g = el("g", null, svg);
    el("line", {
      x1: x, y1: o.y0 == null ? 0 : o.y0, x2: x, y2: o.y1 == null ? dimH(svg) : o.y1,
      stroke: o.stroke || color("accent"),
      "stroke-width": o.width == null ? REF_W : o.width,
      "stroke-dasharray": o.dash === false ? null : (o.dash || "4 4"),
      opacity: o.opacity == null ? null : o.opacity,
      "class": "fig-ref"
    }, g);
    if (o.label != null) {
      var ly = o.labelAt == null ? (o.y0 == null ? 12 : o.y0 + 12) : o.labelAt;
      keyedLabel(g, x + 4, ly, o.label, {
        size: 11, fill: o.labelFill || color("text-2"), mono: true,
        key: o.key, keyColor: o.key === false ? null : (o.keyColor || o.stroke || null)
      });
    }
    return g;
  }

  function hline(svg?: any, y?: any, o?: any): any {
    o = o || {};
    var g = el("g", null, svg);
    el("line", {
      x1: o.x0 == null ? 0 : o.x0, y1: y, x2: o.x1 == null ? dimW(svg) : o.x1, y2: y,
      stroke: o.stroke || color("accent"),
      "stroke-width": o.width == null ? REF_W : o.width,
      "stroke-dasharray": o.dash === false ? null : (o.dash || "4 4"),
      opacity: o.opacity == null ? null : o.opacity,
      "class": "fig-ref"
    }, g);
    if (o.label != null) {
      var lx = o.labelAt == null ? (o.x0 == null ? 6 : o.x0 + 6) : o.labelAt;
      keyedLabel(g, lx, y - 5, o.label, {
        size: 11, fill: o.labelFill || color("text-2"), mono: true,
        key: o.key, keyColor: o.key === false ? null : (o.keyColor || o.stroke || null)
      });
    }
    return g;
  }

  // ---------------- KaTeX sobre el SVG ----------------

  function tex(host?: any, str?: any, o?: any): any {
    o = o || {};
    var svg = o.svg;
    if (host && host.tagName === "svg") { svg = host; host = null; }
    if (!svg) {
      var list = host && host.__figSvgs;
      svg = list && list.length ? list[list.length - 1] : (host ? host.querySelector("svg.fig-svg") : null);
    }
    if (!svg) return null;
    svg = ownerSvg(svg) || svg;
    var wrap = svg.__wrap || svg.parentNode;
    var d = div("fig-tex", wrap);
    var w = dimW(svg), h = dimH(svg);
    var x = o.x == null ? w / 2 : o.x, y = o.y == null ? 0 : o.y;
    d.style.left = (x / w * 100) + "%";
    d.style.top = (y / h * 100) + "%";
    var anchor = o.anchor || "middle";
    d.style.transform = anchor === "start" ? "translate(0,-50%)"
      : anchor === "end" ? "translate(-100%,-50%)"
        : "translate(-50%,-50%)";
    if (o.color) d.style.color = o.color;
    putTex(d, str);
    return d;
  }

  // ---------------- arrastre ----------------

  function drag(target?: any, o?: any): any {
    o = o || {};
    var svg = ownerSvg(target) || target;
    var pt = svg.createSVGPoint ? svg.createSVGPoint() : null;
    var active = false, pid: Loose = null;

    function toLocal(ev?: any): any {
      if (!pt || !svg.getScreenCTM) return [ev.clientX, ev.clientY];
      pt.x = ev.clientX; pt.y = ev.clientY;
      var m = svg.getScreenCTM();
      if (!m) return [ev.clientX, ev.clientY];
      var p = pt.matrixTransform(m.inverse());
      return [p.x, p.y];
    }
    function down(ev?: any): any {
      active = true; pid = ev.pointerId;
      try { target.setPointerCapture(ev.pointerId); } catch (e) {}
      ev.preventDefault();
      var c = toLocal(ev);
      if (o.onStart) o.onStart(c[0], c[1], ev);
      if (o.onDrag) o.onDrag(c[0], c[1], ev);
    }
    function move(ev?: any): any {
      if (!active || (pid != null && ev.pointerId !== pid)) return;
      ev.preventDefault();
      var c = toLocal(ev);
      if (o.onDrag) o.onDrag(c[0], c[1], ev);
    }
    function up(ev?: any): any {
      if (!active) return;
      active = false; pid = null;
      try { target.releasePointerCapture(ev.pointerId); } catch (e) {}
      var c = toLocal(ev);
      if (o.onEnd) o.onEnd(c[0], c[1], ev);
    }
    target.addEventListener("pointerdown", down);
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
    target.addEventListener("pointercancel", up);
    if (target.classList) target.classList.add("fig-hit");

    return function stop(): any {
      target.removeEventListener("pointerdown", down);
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", up);
      target.removeEventListener("pointercancel", up);
    };
  }

  // ---------------- grilla de celdas ----------------

  function gridCells(svg?: any, o?: any): any {
    o = o || {};
    var cols = o.cols || 6, rows = o.rows || 6;
    var cell = o.cell || 34, gap = o.gap == null ? 3 : o.gap;
    var x0 = o.x0 == null ? 40 : o.x0, y0 = o.y0 == null ? 20 : o.y0;
    var g = el("g", { class: "fig-grid" }, svg);
    var rects: Loose[] = [];
    var cBorder = color("border-2") || color("border");
    for (var i = 0; i < cols; i++) {
      rects[i] = [];
      for (var j = 0; j < rows; j++) {
        var r = el("rect", {
          x: x0 + i * (cell + gap), y: y0 + j * (cell + gap),
          width: cell, height: cell, rx: 3,
          fill: (typeof o.fill === "function" ? o.fill(i, j) : o.fill) || color("surface-2"),
          stroke: o.stroke || cBorder, "stroke-width": 1,
          class: "fig-cell"
        }, g);
        r.dataset.i = i; r.dataset.j = j;
        if (o.onCell) (function(ii?: any, jj?: any, rr?: any): any {
          rr.addEventListener("click", function(ev?: any): any { o.onCell(ii, jj, rr, ev); });
        })(i, j, r);
        rects[i][j] = r;
      }
    }
    return {
      g: g, rects: rects,
      at: function(i?: any, j?: any): any { return rects[i] && rects[i][j]; },
      set: function(i?: any, j?: any, attrs?: any): any {
        var r = rects[i] && rects[i][j];
        if (!r) return;
        for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) r.setAttribute(k, attrs[k]);
      },
      size: { cols: cols, rows: rows, cell: cell, gap: gap, x0: x0, y0: y0 },
      x: function(i?: any): any { return x0 + i * (cell + gap) + cell / 2; },
      y: function(j?: any): any { return y0 + j * (cell + gap) + cell / 2; }
    };
  }

  // ---------------- línea de tiempo ----------------

  function timeline(svg?: any, o?: any): any {
    o = o || {};
    var t0 = o.t0 == null ? 0 : o.t0, t1 = o.t1 == null ? 10 : o.t1;
    var x0 = o.x0 == null ? 46 : o.x0, x1 = o.x1 == null ? dimW(svg) - 20 : o.x1;
    var y = o.y == null ? dimH(svg) / 2 : o.y;
    var g = el("g", { class: "fig-timeline" }, svg);
    var s = scale([t0, t1], [x0, x1]);
    var cAxis = color("plot-axis"), cTxt = color("text-3");
    el("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: o.stroke || cAxis, "stroke-width": 1.4 }, g);
    el("path", { d: "M" + x1 + " " + y + "l-7 -4 v8 z", fill: o.stroke || cAxis }, g);
    tickList(s, o.ticks == null ? 6 : o.ticks).forEach(function(v?: any): any {
      var px = s(v);
      el("line", { x1: px, y1: y, x2: px, y2: y + 4, stroke: cAxis, "stroke-width": 1 }, g);
      text(g, px, y + 8, tickLabel(v), { size: 11, anchor: "middle", baseline: "hanging", fill: cTxt, mono: true });
    });
    // marcas de evento; cuando dos caen muy cerca, el rótulo sube un escalón
    // para no encimarse (los procesos de Poisson producen marcas apiñadas)
    var lastPx = -1e9, tier = 0;
    (o.marks || []).slice().sort(function(a?: any, b?: any): any { return a.t - b.t; }).forEach(function(m?: any): any {
      var px = s(m.t);
      var c = m.color || color("primary");
      tier = (px - lastPx) < (o.minGap == null ? 22 : o.minGap) ? (tier + 1) % 3 : 0;
      lastPx = px;
      var h = (m.h || 13) + tier * 13;
      el("line", { x1: px, y1: y - h, x2: px, y2: y + 3, stroke: c, "stroke-width": m.width || 2 }, g);
      el("circle", { cx: px, cy: y, r: m.r == null ? 3.2 : m.r, fill: c }, g);
      if (m.label != null) {
        text(g, px, y - h - 5, m.label, { size: 11, anchor: "middle", fill: c, mono: true });
      }
    });
    if (o.label) text(g, x1, y + 24, o.label, { size: 11.5, anchor: "end", baseline: "hanging", fill: cTxt });
    return { g: g, sx: s, y: y };
  }

  // ---------------- grafo dirigido ----------------

  function arrowHead(svg?: any, stroke?: any): any {
    var id = "figa" + (++uid);
    var m = el("marker", {
      id: id, viewBox: "0 0 10 10", refX: 9.4, refY: 5,
      markerWidth: 6.5, markerHeight: 6.5, orient: "auto-start-reverse"
    }, defsOf(svg));
    el("path", { d: "M0 0 L10 5 L0 10 z", fill: stroke }, m);
    return "url(#" + id + ")";
  }

  function graph(svg?: any, o?: any): any {
    o = o || {};
    var nodes2 = o.nodes || [], edges = o.edges || [];
    var byId: Loose = {};
    nodes2.forEach(function(n?: any): any { byId[n.id] = n; });
    var r = o.r == null ? 20 : o.r;
    var g = el("g", { class: "fig-graph" }, svg);
    var cStroke = o.stroke || color("plot-axis");
    var cFill = o.fill || color("surface-2");
    var cTxt = color("text");
    var head = arrowHead(svg, cStroke);

    edges.forEach(function(e?: any): any {
      var a = byId[e.from], b = byId[e.to];
      if (!a || !b) return;
      var c = e.color || cStroke;
      var eh = e.color ? arrowHead(svg, c) : head;
      var d, lx, ly;
      var rr = e.r == null ? r : e.r;
      if (e.from === e.to) {
        // autolazo: arco por encima del nodo (más ancho que alto para que se lea)
        var up = e.up == null ? rr * 1.9 : e.up;
        // los extremos quedan algo POR FUERA del círculo, si no el nodo,
        // que se dibuja después, tapa la punta de flecha
        d = "M" + (a.x - rr * 0.70) + " " + (a.y - rr * 0.92) +
          "C" + (a.x - up * 1.25) + " " + (a.y - rr - up) + " " +
          (a.x + up * 1.25) + " " + (a.y - rr - up) + " " +
          (a.x + rr * 0.70) + " " + (a.y - rr * 0.92);
        lx = a.x; ly = a.y - rr - up * 0.86;
      } else {
        var dx = b.x - a.x, dy = b.y - a.y;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var ux = dx / len, uy = dy / len;
        var ax = a.x + ux * rr, ay = a.y + uy * rr;
        var bx = b.x - ux * rr, by = b.y - uy * rr;
        var k = e.curve || 0;
        if (k) {
          var mx = (ax + bx) / 2 - uy * k, my = (ay + by) / 2 + ux * k;
          d = "M" + ax + " " + ay + "Q" + mx + " " + my + " " + bx + " " + by;
          lx = (ax + bx) / 2 - uy * k * 0.62; ly = (ay + by) / 2 + ux * k * 0.62;
        } else {
          d = "M" + ax + " " + ay + "L" + bx + " " + by;
          lx = (ax + bx) / 2 - uy * 11; ly = (ay + by) / 2 + ux * 11;
        }
      }
      var p = path(g, d, { stroke: c, width: e.width == null ? 1.6 : e.width, dash: e.dash });
      p.setAttribute("marker-end", eh);
      if (e.label != null) {
        text(g, lx, ly, e.label, { size: 11, anchor: "middle", baseline: "middle", fill: e.labelFill || c, mono: true });
      }
    });

    nodes2.forEach(function(n?: any): any {
      var ng = el("g", { class: "fig-node" }, g);
      el("circle", {
        cx: n.x, cy: n.y, r: n.r == null ? r : n.r,
        fill: n.fill || cFill,
        stroke: n.stroke || cStroke, "stroke-width": n.strokeWidth == null ? 1.4 : n.strokeWidth
      }, ng);
      if (n.label != null) {
        text(ng, n.x, n.y, n.label, {
          size: n.size || 12.5, anchor: "middle", baseline: "middle",
          fill: n.textFill || cTxt, weight: 600
        });
      }
      if (n.sub != null) {
        text(ng, n.x, n.y + (n.r == null ? r : n.r) + 13, n.sub, {
          size: 11, anchor: "middle", baseline: "middle", fill: color("text-3")
        });
      }
    });
    return g;
  }

  // ---------------- 3D isométrico ----------------

  function iso3d(o?: any): any {
    o = o || {};
    var elev = o.elev == null ? 28 : o.elev;
    var azim = o.azim == null ? 35 : o.azim;
    var sc = o.scale == null ? 40 : o.scale;
    var e = elev * Math.PI / 180, a = azim * Math.PI / 180;
    var ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e);
    return {
      elev: elev, azim: azim, scale: sc,
      project: function(x?: any, y?: any, z?: any): any {
        var xr = x * ca - y * sa;
        var yr = x * sa + y * ca;
        return [xr * sc, (yr * se - (z || 0) * ce) * sc];
      },
      // mayor profundidad = más lejos de la cámara (para el orden del pintor)
      depth: function(x?: any, y?: any, z?: any): any {
        var yr = x * sa + y * ca;
        return yr * ce - (z || 0) * se;
      },
      rotate: function(dAzim?: any, dElev?: any): any {
        return iso3d({ elev: elev + (dElev || 0), azim: azim + (dAzim || 0), scale: sc });
      }
    };
  }

  function axisSamples(spec?: any): any {
    if (Array.isArray(spec)) return spec;
    var s = spec || {};
    var from = s.from == null ? -3 : s.from;
    var to = s.to == null ? 3 : s.to;
    var n = s.n == null ? 20 : s.n;
    var out: Loose[] = [];
    for (var i = 0; i <= n; i++) out.push(from + (to - from) * i / n);
    return out;
  }

  function surface(svg?: any, fn?: any, dom?: any, proj?: any, o?: any): any {
    o = o || {};
    dom = dom || {};
    var xs = axisSamples(dom.xs), ys = axisSamples(dom.ys);
    var cx = o.cx == null ? dimW(svg) / 2 : o.cx;
    var cy = o.cy == null ? dimH(svg) * 0.60 : o.cy;
    var zs = o.zScale == null ? 1 : o.zScale;
    var g = el("g", { class: "fig-surface" }, svg);

    var Z: Loose = [], zmin = Infinity, zmax = -Infinity, i, j;
    for (i = 0; i < xs.length; i++) {
      Z[i] = [];
      for (j = 0; j < ys.length; j++) {
        var v = fn(xs[i], ys[j]);
        if (!isFinite(v)) v = 0;
        Z[i][j] = v;
        if (v < zmin) zmin = v;
        if (v > zmax) zmax = v;
      }
    }
    if (!isFinite(zmin)) { zmin = 0; zmax = 1; }
    if (zmax === zmin) zmax = zmin + 1;

    var lo = o.fillLow || color("surface-2");
    var hi = o.fillHigh || color("primary");
    var stroke = o.stroke === false ? null : (o.stroke || color("border-2") || color("border"));

    var quads: Loose[] = [];
    for (i = 0; i < xs.length - 1; i++) {
      for (j = 0; j < ys.length - 1; j++) {
        var corners: Loose = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
        var pts = [], dsum = 0, zsum = 0;
        for (var c = 0; c < 4; c++) {
          var ii = corners[c][0], jj = corners[c][1];
          var zz = (Z[ii][jj] - zmin) / (zmax - zmin) * zs;
          var p = proj.project(xs[ii], ys[jj], zz);
          pts.push([cx + p[0], cy + p[1]]);
          dsum += proj.depth(xs[ii], ys[jj], zz);
          zsum += Z[ii][jj];
        }
        quads.push({ pts: pts, d: dsum / 4, t: (zsum / 4 - zmin) / (zmax - zmin) });
      }
    }
    quads.sort(function(a?: any, b?: any): any { return b.d - a.d; });   // los lejanos primero
    quads.forEach(function(q?: any): any {
      el("polygon", {
        points: q.pts.map(function(p?: any): any {
          return (Math.round(p[0] * 10) / 10) + "," + (Math.round(p[1] * 10) / 10);
        }).join(" "),
        fill: mix(lo, hi, q.t),
        stroke: stroke, "stroke-width": o.strokeWidth == null ? 0.4 : o.strokeWidth,
        opacity: o.opacity == null ? null : o.opacity
      }, g);
    });
    return { g: g, zmin: zmin, zmax: zmax, cx: cx, cy: cy, zScale: zs };
  }

  function slice(svg?: any, fn?: any, spec?: any, proj?: any, o?: any): any {
    o = o || {};
    spec = spec || {};
    var axis = spec.axis === "y" ? "y" : "x";
    var at = spec.at == null ? 0 : spec.at;
    var range = spec.range || [-3, 3];
    var n = spec.n == null ? 90 : spec.n;
    var cx = o.cx == null ? dimW(svg) / 2 : o.cx;
    var cy = o.cy == null ? dimH(svg) * 0.60 : o.cy;
    var zs = o.zScale == null ? 1 : o.zScale;
    var zmin = o.zmin == null ? 0 : o.zmin;
    var zmax = o.zmax == null ? 1 : o.zmax;
    var g = el("g", { class: "fig-slice" }, svg);
    var pts = [], base = [], i;
    for (i = 0; i <= n; i++) {
      var u = range[0] + (range[1] - range[0]) * i / n;
      var x = axis === "x" ? at : u;
      var y = axis === "x" ? u : at;
      var v = fn(x, y);
      if (!isFinite(v)) v = zmin;
      var zz = (v - zmin) / ((zmax - zmin) || 1) * zs;
      var p = proj.project(x, y, zz);
      var p0 = proj.project(x, y, 0);
      pts.push([cx + p[0], cy + p[1]]);
      base.push([cx + p0[0], cy + p0[1]]);
    }
    if (o.plane !== false) {
      var poly = pts.concat(base.slice().reverse());
      path(g, ptsToPath(poly, true), {
        fill: o.planeFill || color("accent"),
        opacity: o.planeOpacity == null ? 0.16 : o.planeOpacity
      });
    }
    path(g, ptsToPath(pts), {
      stroke: o.stroke || color("accent"),
      width: o.width == null ? 2.4 : o.width,
      dash: o.dash
    });
    return { g: g, pts: pts, base: base };
  }

  // ---------------- controles ----------------

  function ctlRow(host?: any): any {
    var row = null, i;
    for (i = 0; i < host.children.length; i++) {
      if (host.children[i].classList && host.children[i].classList.contains("fig-controls")) {
        row = host.children[i]; break;
      }
    }
    if (!row) row = div("fig-controls", host);
    return row;
  }

  function fromState(host?: any, k?: any, fallback?: any): any {
    var st = host && host.__figState;
    if (st && Object.prototype.hasOwnProperty.call(st, k) && st[k] != null) return st[k];
    return fallback;
  }
  function toState(host?: any, k?: any, v?: any): any {
    if (!host) return;
    host.__figState = host.__figState || {};
    host.__figState[k] = v;
  }

  function controls(host?: any, specs?: any, onChange?: any): any {
    var row = ctlRow(host);
    var values: Loose = {};
    var inputs: Loose = {};
    var labels: Loose = {};

    (specs || []).forEach(function(s?: any): any {
      var k = s.k;
      var min = s.min == null ? 0 : +s.min;
      var max = s.max == null ? 1 : +s.max;
      var step = s.step == null ? (max - min) / 100 : +s.step;
      var init = +fromState(host, k, s.value == null ? min : s.value);
      if (!isFinite(init)) init = min;
      init = Math.max(min, Math.min(max, init));
      values[k] = init;
      toState(host, k, init);

      var box = div("fig-ctl", row);
      var lab = document.createElement("label");
      var nameSpan = document.createElement("span");
      nameSpan.className = "n";
      if (s.tex) putTex(nameSpan, s.tex);
      else nameSpan.textContent = s.label || k;
      var vSpan = document.createElement("span");
      vSpan.className = "v";
      lab.appendChild(nameSpan);
      lab.appendChild(vSpan);
      box.appendChild(lab);

      var inp = document.createElement("input");
      inp.type = "range";
      var lg = !!s.log && min > 0 && max > 0;
      if (lg) {
        inp.min = "0"; inp.max = "1000"; inp.step = "1";
        inp.value = String(Math.round((Math.log(init) - Math.log(min)) / (Math.log(max) - Math.log(min)) * 1000));
      } else {
        inp.min = String(min); inp.max = String(max); inp.step = String(step);
        inp.value = String(init);
        // El navegador ajusta el valor a la grilla min + k·step. Si el valor
        // inicial no cae en ella, el pulgar arranca en un número y la figura
        // dibuja otro, y al primer toque el valor salta sin poder volver al de
        // partida. No se corrige en silencio (el valor de origen suele estar
        // elegido a propósito): se avisa para que se ajuste el step o el valor.
        if (window.console && Math.abs(+inp.value - init) > Math.abs(step) / 1000) {
          console.warn("figura: valor inicial fuera de la grilla del deslizador",
            { control: k, valor: init, ajustado: +inp.value, min: min, step: step });
        }
      }
      inp.setAttribute("aria-label", s.label || k);
      box.appendChild(inp);

      function fmtV(v?: any): any {
        return s.fmt ? s.fmt(v) : num(v, s.dec == null ? (step >= 1 ? 0 : step >= 0.1 ? 1 : 2) : s.dec);
      }
      function readInput(): any {
        if (lg) {
          var t = +inp.value / 1000;
          return Math.exp(Math.log(min) + t * (Math.log(max) - Math.log(min)));
        }
        return +inp.value;
      }
      vSpan.textContent = fmtV(init);
      labels[k] = { v: vSpan, fmt: fmtV };
      inputs[k] = { inp: inp, lg: lg, min: min, max: max };

      inp.addEventListener("input", function(): any {
        var v = readInput();
        values[k] = v;
        toState(host, k, v);
        vSpan.textContent = fmtV(v);
        if (onChange) onChange(k, v, values);
      });
    });

    return {
      el: row,
      values: values,
      get: function(k?: any): any { return values[k]; },
      set: function(k?: any, v?: any): any {
        var it = inputs[k];
        if (!it) return;
        v = Math.max(it.min, Math.min(it.max, +v));
        values[k] = v;
        toState(host, k, v);
        it.inp.value = it.lg
          ? String(Math.round((Math.log(v) - Math.log(it.min)) / (Math.log(it.max) - Math.log(it.min)) * 1000))
          : String(v);
        if (labels[k]) labels[k].v.textContent = labels[k].fmt(v);
      }
    };
  }

  function buttons(host?: any, list?: any): any {
    var row = div("fig-buttons", host);
    var items = (list || []).map(function(b?: any): any {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn sm" + (b.cls ? " " + b.cls : "");
      btn.textContent = b.label;
      if (b.title) btn.title = b.title;
      if (b.onClick) btn.addEventListener("click", function(ev?: any): any { b.onClick(ev, btn); });
      row.appendChild(btn);
      return btn;
    });
    return { el: row, items: items };
  }

  function toggle(host?: any, spec?: any, onChange?: any): any {
    var row = ctlRow(host);
    var k = spec.k;
    var init = !!fromState(host, k, spec.value);
    toState(host, k, init);
    var box = div("fig-ctl fig-toggle", row);
    var lab = document.createElement("label");
    var inp = document.createElement("input");
    inp.type = "checkbox";
    inp.checked = init;
    var span = document.createElement("span");
    span.textContent = spec.label || k;
    lab.appendChild(inp);
    lab.appendChild(span);
    box.appendChild(lab);
    inp.addEventListener("change", function(): any {
      toState(host, k, inp.checked);
      if (onChange) onChange(k, inp.checked, host.__figState);
    });
    return {
      el: box,
      get: function(): any { return inp.checked; },
      set: function(v?: any): any { inp.checked = !!v; toState(host, k, !!v); }
    };
  }

  function select(host?: any, spec?: any, onChange?: any): any {
    var row = ctlRow(host);
    var k = spec.k;
    var init = fromState(host, k, spec.value);
    var box = div("fig-ctl fig-select", row);
    var lab = document.createElement("label");
    var span = document.createElement("span");
    span.textContent = spec.label || k;
    lab.appendChild(span);
    box.appendChild(lab);
    var sel = document.createElement("select");
    (spec.options || []).forEach(function(op?: any): any {
      var o2 = document.createElement("option");
      o2.value = String(op.v);
      o2.textContent = op.label == null ? String(op.v) : op.label;
      sel.appendChild(o2);
    });
    if (init == null && spec.options && spec.options.length) init = spec.options[0].v;
    sel.value = String(init);
    toState(host, k, sel.value);
    box.appendChild(sel);
    sel.setAttribute("aria-label", spec.label || k);
    sel.addEventListener("change", function(): any {
      toState(host, k, sel.value);
      if (onChange) onChange(k, sel.value, host.__figState);
    });
    return {
      el: box,
      get: function(): any { return sel.value; },
      set: function(v?: any): any { sel.value = String(v); toState(host, k, sel.value); }
    };
  }

  function readouts(host?: any, list?: any): any {
    var row = div("fig-readouts", host);
    var cells: Loose = {};
    (list || []).forEach(function(r?: any): any {
      var it = div("fig-readout", row);
      var k = document.createElement("span");
      k.className = "k";
      if (r.tex) putTex(k, r.tex);
      else k.textContent = r.label == null ? r.k : r.label;
      var v = document.createElement("span");
      v.className = "v";
      v.textContent = r.value == null ? "—" : String(r.value);
      it.appendChild(k);
      it.appendChild(v);
      cells[r.k] = v;
    });
    return {
      el: row,
      set: function(k?: any, val?: any): any { if (cells[k]) cells[k].textContent = val == null ? "—" : String(val); },
      get: function(k?: any): any { return cells[k] ? cells[k].textContent : null; }
    };
  }

  function legend(host?: any, list?: any): any {
    var row = div("fig-legend", host);
    (list || []).forEach(function(it?: any): any {
      var e = div("it", row);
      var sw = document.createElement("span");
      sw.className = "sw" + (it.dash ? " dash" : "") + (it.fill ? " fill" : "");
      sw.style.borderTopColor = it.color || color("primary");
      if (it.fill) {
        sw.style.color = it.color || color("primary");
        sw.style.background = it.color || color("primary");
        // la muestra se pinta con la MISMA opacidad que la marca del dibujo:
        // relleno de área (var(--plot-fill-a)) salvo que la llamada pase otra.
        var a = it.alpha;
        if (a == null) a = it.band ? color("plot-band-a") : color("plot-fill-a");
        if (a !== "" && a != null) sw.style.opacity = String(a);
      }
      var t = document.createElement("span");
      t.textContent = it.label;
      e.appendChild(sw);
      e.appendChild(t);
    });
    return { el: row };
  }

  // ---------------- azar reproducible ----------------

  function rng(seed?: any): any {
    var a = (seed == null ? 12345 : seed) >>> 0;
    function u(): any {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    u.int = function(n?: any): any { return Math.floor(u() * n); };
    u.range = function(lo?: any, hi?: any): any { return lo + u() * (hi - lo); };
    u.pick = function(arr?: any): any { return arr[Math.floor(u() * arr.length)]; };
    u.normal = function(mu?: any, sd?: any): any {
      var v1 = Math.max(1e-12, u()), v2 = u();
      var z = Math.sqrt(-2 * Math.log(v1)) * Math.cos(2 * Math.PI * v2);
      return (mu == null ? 0 : mu) + (sd == null ? 1 : sd) * z;
    };
    u.exp = function(lambda?: any): any { return -Math.log(Math.max(1e-12, 1 - u())) / (lambda == null ? 1 : lambda); };
    return u;
  }

  var Fig = {
    svg: svgOf, panels: panels, scale: scale, axes: axes,
    line: line, curve: curve, area: area, bars: bars,
    marker: marker, vline: vline, hline: hline, text: text, tex: tex,
    drag: drag, grid: gridCells, timeline: timeline, graph: graph,
    iso3d: iso3d, surface: surface, slice: slice,
    controls: controls, buttons: buttons, toggle: toggle, select: select,
    readouts: readouts, legend: legend,
    rng: rng, fmt: num, mix: mix, color: color,
    // paleta de gráfico (ola 14)
    series: series, seq: seq, div: divg, status: status, SERIES_MAX: SERIES_MAX,
    label: keyedLabel, hatch: hatchPattern,
    // bajo nivel, por si una figura necesita salirse del molde
    el: el, path: path, ptsToPath: ptsToPath, ticks: niceTicks, defs: defsOf, putTex: putTex,
    // macros de KaTeX efectivas (mismas que A.katex); extensible
    MACROS: MACROS
  };

  // ============================================================
  //  Registro y montaje
  // ============================================================

  var FIGURES = A.FIGURES || {};

  // Hoy los archivos por unidad declaran los metadatos con la misma forma
  // (`title`, `page` con el slug pelado y `unidad`), pero el registro los
  // uniforma igual al entrar: así una figura nueva que escriba `titulo`, que
  // omita `unidad` o que ponga la ruta completa del archivo en `page` no
  // rompe a quien los lea, que siempre encuentra
  //   title / titulo  el texto que haya, copiado en las dos claves
  //   unidad          si falta, sale del prefijo del id ("u8-…" → "8");
  //                   siempre como cadena
  //   page            slug pelado, sin carpeta y sin la extensión .md
  // El resto de las claves pasa tal cual. Se trabaja sobre una copia: el objeto
  // que entrega quien registra la figura no se toca.
  function normalizeMeta(id?: any, meta?: any): any {
    var m: Loose = {}, k;
    if (meta) for (k in meta) if (Object.prototype.hasOwnProperty.call(meta, k)) m[k] = meta[k];
    var t = m.title != null ? m.title : m.titulo;
    if (t != null) { m.title = t; m.titulo = t; }
    if (m.unidad == null || m.unidad === "") {
      var pref = /^u(eval|[0-9]+)-/.exec(String(id));
      if (pref) m.unidad = pref[1];
    }
    if (m.unidad != null) m.unidad = String(m.unidad);
    if (typeof m.page === "string" && m.page) m.page = m.page.replace(/\.md$/i, "").replace(/^.*\//, "");
    return m;
  }

  function registerFigure(id?: any, draw?: any, meta?: any): any {
    if (!id || typeof draw !== "function") return;
    FIGURES[id] = { draw: draw, meta: normalizeMeta(id, meta) };
  }

  function runCleanups(host?: any): any {
    var list = host.__figCleanups;
    if (list && list.length) {
      for (var i = list.length - 1; i >= 0; i--) {
        try { list[i](); } catch (e) { if (window.console) console.error("figura: error al limpiar", e); }
      }
    }
    host.__figCleanups = [];
  }

  function clearHost(fig?: any, host?: any): any {
    runCleanups(host);
    host.__figSvgs = [];
    host.__series = [];
    while (host.firstChild) host.removeChild(host.firstChild);
    delete host.dataset.mounted;
    if (fig !== host) delete fig.dataset.mounted;
  }

  function missing(host?: any, id?: any, msg?: any): any {
    var d = div("fig-missing", host);
    var c = document.createElement("code");
    c.textContent = id;
    d.appendChild(c);
    d.appendChild(document.createTextNode(" " + (msg || "figura no registrada")));
    return d;
  }

  function hostOf(fig?: any): any { return fig.querySelector(".fig-host") || fig; }

  function markMounted(fig?: any, host?: any): any {
    host.dataset.mounted = "1";
    if (fig !== host) fig.dataset.mounted = "1";
  }

  function drawInto(fig?: any, id?: any): any {
    var host = hostOf(fig);
    clearHost(fig, host);
    var entry = FIGURES[id];
    if (!entry) {
      missing(host, id);
      markMounted(fig, host);
      return false;
    }
    host.__figState = host.__figState || {};
    host.__figCleanups = [];
    host.__series = [];
    var api = {
      Fig: Fig,
      state: host.__figState,
      setState: function(patch?: any): any {
        if (patch) for (var k in patch) {
          if (Object.prototype.hasOwnProperty.call(patch, k)) host.__figState[k] = patch[k];
        }
        drawInto(fig, id);
      },
      cleanup: function(fn?: any): any { if (typeof fn === "function") host.__figCleanups.push(fn); },
      id: id,
      host: host,
      figure: fig,
      // añadido del port (no está en el baseline): completa el `FigureContext`
      // del contrato sin cambiar nada de lo que usan las figuras de Proba.
      theme: A.theme,
      cssVar: cssVar,
      redraw: function(): any { drawInto(fig, id); }
    };
    try {
      var ret = entry.draw(host, api, entry.meta);
      if (typeof ret === "function") host.__figCleanups.push(ret);
      // el orden importa: la capa de lectura inserta su blanco de puntero al
      // principio del <svg>, así que el <title> se pone DESPUÉS para que quede
      // como primer hijo, que es donde lo esperan los lectores de pantalla.
      mountHover(host, entry.meta);
      ensureTitles(host, entry.meta);
    } catch (e) {
      if (window.console) console.error("figura '" + id + "': error al dibujar", e);
      clearHost(fig, host);
      missing(host, id, "error al dibujar la figura");
      markMounted(fig, host);
      return false;
    }
    markMounted(fig, host);
    return true;
  }

  // ============================================================
  //  Capa de lectura al pasar el puntero (una sola por figura)
  // ============================================================
  // Se monta DESPUÉS de dibujar, a partir de las series que los helpers
  // registraron en host.__series. No hace nada si la figura no registró
  // ninguna serie, y se puede apagar por figura con meta.hover === false.
  function esNumero(v?: any): any { return v != null && isFinite(v); }

  // Una serie es LEGIBLE si tiene rótulo o si sus puntos traen valor de dato:
  // sin una cosa ni la otra no hay nada que leer y la capa no se monta. Nunca
  // se inventa un nombre («serie N» con el índice interno, como antes).
  function legible(entry?: any): any {
    if (entry.label) return true;
    for (var i = 0; i < entry.pts.length; i++) if (esNumero(entry.pts[i].vy)) return true;
    return false;
  }

  function nearestOf(entry?: any, px?: any): any {
    var best = null, bd = Infinity, i;
    for (i = 0; i < entry.pts.length; i++) {
      var d = Math.abs(entry.pts[i].x - px);
      if (d < bd) { bd = d; best = entry.pts[i]; }
    }
    return best ? { pt: best, d: bd } : null;
  }

  function mountHoverOn(host?: any, svg?: any, list?: any): any {
    var wrap = svg.__wrap;
    if (!wrap) return;
    wrap.classList.add("fig-hoverable");
    // blanco de puntero: cubre todo el lienzo, pero va ABAJO de todo, así que
    // ningún control ni tirador de la figura queda bloqueado.
    var hit = el("rect", {
      x: 0, y: 0, width: svg.__w, height: svg.__h,
      fill: "transparent", class: "fig-hit"
    }, null);
    svg.insertBefore(hit, svg.firstChild);
    var layer = el("g", { class: "fig-hover", "pointer-events": "none" }, svg);
    var rule = el("line", { x1: -1000, y1: 0, x2: -1000, y2: svg.__h, class: "fig-hover-rule" }, layer);
    var dots: Loose[] = [];
    list.forEach(function(entry?: any): any {
      var d = el("circle", {
        cx: -1000, cy: -1000, r: 4,
        fill: entry.color, stroke: color("surface"), "stroke-width": 2
      }, layer);
      d.style.display = "none";
      dots.push(d);
    });
    var tip = div("fig-tip", wrap);
    tip.setAttribute("role", "status");
    // La capa nace APAGADA y fuera del lienzo: si no, la regla y los puntos se
    // pintarían sobre el borde izquierdo de cada figura hasta que el usuario
    // moviera el puntero por ella (falso punto de datos en la carga).
    layer.style.display = "none";
    tip.style.display = "none";
    var on = false;

    function hide(): any {
      if (!on) return;
      on = false;
      layer.style.display = "none";
      tip.style.display = "none";
    }
    function move(ev?: any): any {
      var r = svg.getBoundingClientRect();
      if (!r.width) return;
      var k = svg.__w / r.width;
      var px = (ev.clientX - r.left) * k;
      var rows: Loose = [], i, ref: Loose = null;
      // solo se leen las series cuyo punto más cercano cae CERCA del puntero:
      // así una figura con muchas marcas sueltas no abre una fila por cada una.
      var CERCA = 48;
      for (i = 0; i < list.length; i++) {
        var n = nearestOf(list[i], px);
        if (!n || n.d > CERCA) { dots[i].style.display = "none"; continue; }
        dots[i].style.display = "";
        dots[i].setAttribute("cx", n.pt.x);
        dots[i].setAttribute("cy", n.pt.y);
        if (!ref || n.d < ref.d) ref = n;
        rows.push({ label: list[i].label, color: list[i].color, pt: n.pt, d: n.d, i: i });
      }
      // Una fila sin nombre y sin valor no dice nada: se descarta.
      rows = rows.filter(function(r?: any): any { return r.label || esNumero(r.pt.vy); });
      if (!rows.length) { hide(); return; }
      rows.sort(function(a?: any, b?: any): any { return a.d - b.d; });
      // Si alguna serie tiene nombre, solo se leen las que lo tienen: mezclar
      // filas con nombre y números sueltos se lee peor que no mostrarlos.
      // Y si NINGUNA lo tiene, se muestra una sola lectura, la más cercana al
      // puntero, en vez de una pila de números anónimos.
      var conNombre = rows.filter(function(r?: any): any { return !!r.label; });
      rows = conNombre.length ? conNombre : rows.slice(0, 1);
      var sobran = 0;
      if (rows.length > 5) { sobran = rows.length - 5; rows = rows.slice(0, 5); }
      for (i = 0; i < list.length; i++) {
        var visible = false, j;
        for (j = 0; j < rows.length; j++) if (rows[j].i === i) { visible = true; break; }
        if (!visible) dots[i].style.display = "none";
      }
      on = true;
      layer.style.display = "";
      rule.setAttribute("x1", ref.pt.x); rule.setAttribute("x2", ref.pt.x);
      while (tip.firstChild) tip.removeChild(tip.firstChild);
      if (esNumero(ref.pt.vx)) {
        var head = div("hd", tip);
        head.textContent = num(ref.pt.vx, 2);
      }
      rows.forEach(function(row?: any): any {
        var line = div("row", tip);
        var sw = document.createElement("i");
        sw.style.background = row.color;
        line.appendChild(sw);
        if (row.label) {
          var lb = document.createElement("span");
          lb.className = "lb";
          lb.textContent = row.label;
          line.appendChild(lb);
        }
        if (esNumero(row.pt.vy)) {
          var vv = document.createElement("b");
          vv.textContent = num(row.pt.vy, 3);
          line.appendChild(vv);
        }
      });
      if (sobran) {
        var mas = div("row", tip);
        var lbm = document.createElement("span");
        lbm.className = "lb";
        lbm.textContent = "y " + sobran + " serie" + (sobran > 1 ? "s" : "") + " más";
        mas.appendChild(lbm);
      }
      tip.style.display = "block";
      // el globo se coloca dentro del envoltorio, del lado con más aire
      var left = ref.pt.x / k + 12;
      if (left + tip.offsetWidth > r.width - 4) left = ref.pt.x / k - tip.offsetWidth - 12;
      tip.style.left = Math.max(2, left) + "px";
      tip.style.top = Math.max(2, Math.min(r.height - tip.offsetHeight - 2, (ev.clientY - r.top) - tip.offsetHeight - 12)) + "px";
    }
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerleave", hide);
    svg.addEventListener("pointercancel", hide);
    return function(): any {
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerleave", hide);
      svg.removeEventListener("pointercancel", hide);
      if (tip.parentNode) tip.parentNode.removeChild(tip);
    };
  }

  function mountHover(host?: any, meta?: any): any {
    if (meta && meta.hover === false) return;
    var list = host.__series || [];
    if (!list.length) return;
    var svgs: Loose = [], groups: Loose = [], i, j;
    for (i = 0; i < list.length; i++) {
      if (!list[i].svg || !list[i].pts || !list[i].pts.length) continue;
      if (!legible(list[i])) continue;
      j = svgs.indexOf(list[i].svg);
      if (j < 0) { svgs.push(list[i].svg); groups.push([]); j = svgs.length - 1; }
      groups[j].push(list[i]);
    }
    for (i = 0; i < svgs.length; i++) {
      try {
        var off = mountHoverOn(host, svgs[i], groups[i]);
        if (off) (host.__figCleanups = host.__figCleanups || []).push(off);
      } catch (e) {
        if (window.console) console.warn("figura: no se pudo montar la lectura al pasar el puntero", e);
      }
    }
  }

  // Toda figura necesita un <title> accesible; si el dibujo no lo puso, se toma
  // el título declarado en los metadatos de la figura.
  function ensureTitles(host?: any, meta?: any): any {
    var t = meta && (meta.title || meta.titulo);
    if (!t) return;
    (host.__figSvgs || []).forEach(function(svg?: any): any {
      var own = svg.querySelector(":scope > title") || svg.querySelector("title");
      if (own && own.parentNode === svg) return;
      var n = el("title", null, null);
      n.textContent = t;
      svg.insertBefore(n, svg.firstChild);
    });
  }

  function figNodes(container?: any): any {
    var root = container || document;
    if (!root.querySelectorAll) return [];
    var list = Array.prototype.slice.call(root.querySelectorAll("[data-fig]"));
    if (root.nodeType === 1 && root.hasAttribute && root.hasAttribute("data-fig")) list.unshift(root);
    return list;
  }

  function mountFigures(container?: any): any {
    var n = 0;
    figNodes(container).forEach(function(fig?: any): any {
      var id = fig.getAttribute("data-fig");
      if (!id) return;
      if (drawInto(fig, id)) n++;
    });
    return n;
  }

  function unmountFigures(container?: any): any {
    var n = 0;
    figNodes(container).forEach(function(fig?: any): any {
      clearHost(fig, hostOf(fig));
      n++;
    });
    return n;
  }

  A.FIGURES = FIGURES;
  A.Fig = Fig;
  A.registerFigure = registerFigure;
  A.mountFigures = mountFigures;
  A.unmountFigures = unmountFigures;

  return {
    Fig: Fig,
    FIGURES: FIGURES,
    registerFigure: registerFigure,
    mountFigures: mountFigures,
    unmountFigures: unmountFigures,
  };
}
