/* ============================================================
   plot.js — App.Plot: helper de gráficos sobre canvas 2D.
   Se carga DESPUÉS de figures.js (usa A.Fig.ticks / A.Fig.series si existen)
   y ANTES de los módulos de vista que dibujan (tools.js, taller.js, lab.js).

   Motivación: figures.js resuelve el SVG estático de las páginas; las vistas
   interactivas (explorador, taller, laboratorio) dibujan sobre canvas y hasta
   ahora cada una repetía su propio marco, sus ejes y sus rellenos. App.Plot
   unifica ese vocabulario: un solo padding, una sola rejilla, una sola
   especificación de marca (relleno plano, área lavada, línea de 2 px) y una
   leyenda con la misma estructura que .pw-legend/.pw-sw de taller.css.

   ──────────────────────────────────────────────────────────────────────────
   CONTRATO PÚBLICO — window.App.Plot
   ──────────────────────────────────────────────────────────────────────────
   GEOMETRÍA
     Plot.PAD  {l:48, r:16, t:20, b:34}   padding estándar, único para todos.
     Plot.setup(canvas, cssH) → {ctx, W, H, dpr}
       Ajusta el canvas al ancho CSS del contenedor y a cssH píxeles de alto
       (por omisión, el alto CSS que ya tenga), aplica devicePixelRatio con
       setTransform y limpia. W/H son medidas CSS: todo lo demás trabaja en CSS.
     Plot.frame(ctx, {W, H, pad}) → box
       box = {x0, y0, x1, y1, w, h, pad, W, H}: el rectángulo de datos.
       No pinta nada; solo calcula (y limpia si se le pasa clear:true).
     Plot.scales(dom, ran, o?) → s
       s(v) → px. s.invert(px) → v. s.domain() → [d0,d1]. s.range() → [r0,r1].
       o = {log:true} para escala logarítmica (dominio estrictamente positivo).
     Plot.ticks(a, b, n) → valores redondos (delega en A.Fig.ticks).
     Plot.logTicks(a, b) → potencias de 10 del intervalo (A.Fig no lo expone).

   EJES
     Plot.axes(ctx, {sx, sy, box?, xTicks, yTicks, log, xLabel, yLabel,
                     fmtX, fmtY, zero})
       Rejilla horizontal de filete continuo de 1 px en --plot-grid, eje de
       base en --plot-axis, rótulos en --text-3 con --font-mono a 11 px.
       xTicks/yTicks: número de divisiones deseadas (por omisión 6 y 5) o un
       arreglo de valores ya elegidos. log:true usa logTicks en X.
       Deja en ctx.canvas.__plotDebug = {xTicks, yTicks, xLabels, yLabels}
       los valores y las etiquetas REALMENTE dibujadas (para pruebas), más
       yLabelBox = {x0, x1, rotated, tickLeft} con la franja que ocupa el
       rótulo del eje Y: x1 <= tickLeft garantiza que no pisa a los ticks.

   MARCAS  (relleno plano: ningún degradado, nunca)
     Plot.bars(ctx, {sx, sy, xs, ys, base?, color, width?, radius?, gap?})
       Barra de 24 px como máximo, separación de 2 px entre vecinas y radio de
       4 px SOLO en el extremo del dato. color acepta un color o una función
       (i, x, y) → color, para resaltar un subconjunto.
     Plot.area(ctx, {sx, sy, xs, ys, base?, color?, alpha?, fill?})
       Lavado plano: el color de la serie a la opacidad de var(--plot-band-a)
       (un NÚMERO en el tema, no un color; 0.10 si el token falta). Nunca un
       bloque saturado. `alpha` la pisa y `fill` pisa el color ya compuesto.
     Plot.tokenAlpha(name, def) → lee un token de opacidad del tema como número
       (--plot-band-a para el lavado, --plot-fill-a para un relleno con cuerpo).
     Plot.curve(ctx, {sx, sy, xs, ys, color, width?, dash?})
       Línea de 2 px, lineJoin y lineCap redondos.
     Plot.vline(ctx, x, {sx, box, label, color?, labelColor?, dash?, align?})
       Línea de referencia punteada. El trazo va por omisión en --text-3 (una
       anotación legible en los tres temas, no la rejilla) y el rótulo SIEMPRE
       en --text-2 (o el labelColor que se pase): el texto no lleva el color
       del dato. Quien la use en una leyenda debe pintar el swatch con el mismo
       token de anotación, nunca con --plot-axis.

   LEYENDA · LECTURA · ACCESIBILIDAD
     Plot.legend(host, items) → el host
       host: elemento o selector. items: [{label, color, kind, alpha, dash}]
       con kind ∈ 'bar' (por omisión) | 'area' | 'line' | 'dash'. Emite
       .pw-legend con un .pw-sw por entrada, pintado con la MISMA opacidad que
       la marca a la que representa.
     Plot.hover(canvas, {series, sx, sy, box, fmt?, readout?, snapshot?})
         → función que desengancha
       series: [{label, color, xs, ys, kind}]. Toma una instantánea del canvas
       ya dibujado y, con mousemove/touchmove, repone la instantánea y encima
       dibuja la cruz filiforme, el punto más cercano y una ficha de lectura.
       fmt(pt) → string arma el texto (por omisión "x · y"). readout: elemento
       (o selector) donde se escribe el texto; si se pasa, la ficha NO se dibuja
       sobre el lienzo (un solo lugar de lectura, sin tapar las anotaciones). Llamarla de nuevo tras
       cada redibujo; devuelve el desenganche del anterior.
     Plot.a11y(canvas, label, tableHtml?)
       role="img" + aria-label en el canvas y, si se pasa tableHtml, un
       <details class="pw-data"> hermano con la tabla equivalente.

   COLOR DE SERIE
     Plot.series(i) → color de la ranura i, i = 1..6 (MISMA numeración que
       A.Fig.series, que es 1-based: se pide 1, 2, 3… en el orden de la
       leyenda). Delega en A.Fig.series(i) cuando figures.js lo expone; si no,
       lee --s1..--s6 del :root; y si esos tokens todavía no existen, cae a los
       semánticos --primary, --accent, --u2, --u4, --u3, --u8 y luego a
       --primary.
     Plot.cssVar(name), Plot.alpha(color, a)  — atajos sobre App.
   ============================================================ */
/** Mismo criterio de tipado laxo que `figures.ts`: port fiel del baseline. */
type Loose = any;

/**
 * Crea `App.Plot` (helper de canvas 2D) contra un `App` ya construido. Usa
 * `A.Fig.ticks` / `A.Fig.series` cuando el motor de figuras ya está instalado,
 * igual que el `plot.js` del baseline, que se cargaba después de `figures.js`.
 */
export function createPlot(A: Loose): Record<string, unknown> {

  var PAD = { l: 48, r: 16, t: 20, b: 34 };
  // Orden de respaldo mientras --s1..--s6 no existan (mapa de la auditoría).
  var FALLBACK = ["--primary", "--accent", "--u2", "--u4", "--u3", "--u8"];

  function cssVar(n?: any): any {
    if (A.cssVar) return A.cssVar(n) || "";
    return (getComputedStyle(document.documentElement).getPropertyValue(n) || "").trim();
  }
  function alpha(c?: any, a?: any): any { return A.withAlpha ? A.withAlpha(c, a) : c; }
  // Los tokens de opacidad del tema (--plot-band-a, --plot-fill-a) son NÚMEROS,
  // no colores: se leen como alfa y no como fillStyle.
  function tokenAlpha(name?: any, def?: any): any {
    var v = parseFloat(cssVar(name));
    return isFinite(v) && v > 0 && v <= 1 ? v : def;
  }

  // Ranura de identidad de serie, 1..6, MISMA numeración que A.Fig.series:
  // se pide 1, 2, 3… en el orden de la leyenda.
  function series(i?: any): any {
    var F = A.Fig;
    if (F && typeof F.series === "function") {
      var c = F.series(i);
      if (c) return c;
    }
    var k = Math.round(i);
    if (!isFinite(k) || k < 1) k = 1;
    if (k > 6) k = 6;
    return cssVar("--s" + k) || cssVar(FALLBACK[k - 1]) || cssVar("--primary") || "#7a6a4a";
  }

  function el(sel?: any): any {
    if (!sel) return null;
    return typeof sel === "string" ? document.querySelector(sel) : sel;
  }

  // ---------------- geometría ----------------
  function setup(canvas?: any, cssH?: any): any {
    var dpr = window.devicePixelRatio || 1;
    var W = canvas.clientWidth || canvas.parentNode && canvas.parentNode.clientWidth || 600;
    var H = cssH || canvas.clientHeight || 320;
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));
    canvas.style.height = H + "px";
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    return { ctx: ctx, W: W, H: H, dpr: dpr };
  }

  function frame(ctx?: any, o?: any): any {
    o = o || {};
    var pad = Object.assign({}, PAD, o.pad || {});
    var W = o.W, H = o.H;
    if (W == null || H == null) {
      var dpr = window.devicePixelRatio || 1;
      W = W == null ? ctx.canvas.width / dpr : W;
      H = H == null ? ctx.canvas.height / dpr : H;
    }
    if (o.clear) ctx.clearRect(0, 0, W, H);
    return {
      pad: pad, W: W, H: H,
      x0: pad.l, x1: W - pad.r, y0: pad.t, y1: H - pad.b,
      w: Math.max(1, W - pad.l - pad.r), h: Math.max(1, H - pad.t - pad.b)
    };
  }

  function scales(dom?: any, ran?: any, o?: any): any {
    o = o || {};
    var d0 = dom[0], d1 = dom[1], r0 = ran[0], r1 = ran[1];
    var log = !!o.log;
    var l0 = log ? Math.log(Math.max(1e-12, d0)) : d0;
    var l1 = log ? Math.log(Math.max(1e-12, d1)) : d1;
    var span = (l1 - l0) || 1;
    var s: Loose = function(v?: any): any {
      var t = ((log ? Math.log(Math.max(1e-12, v)) : v) - l0) / span;
      return r0 + t * (r1 - r0);
    };
    s.invert = function(px?: any): any {
      var t = (r1 - r0) ? (px - r0) / (r1 - r0) : 0;
      var v = l0 + t * span;
      return log ? Math.exp(v) : v;
    };
    s.domain = function(): any { return [d0, d1]; };
    s.range = function(): any { return [r0, r1]; };
    s.log = log;
    return s;
  }

  // ---------------- ticks ----------------
  function niceTicks(a?: any, b?: any, n?: any): any {
    if (A.Fig && typeof A.Fig.ticks === "function") return A.Fig.ticks(a, b, n || 6);
    n = n || 6;
    if (!isFinite(a) || !isFinite(b) || a === b) return [a];
    var lo = Math.min(a, b), hi = Math.max(a, b);
    var raw = (hi - lo) / n;
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var norm = raw / mag;
    var step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
    var out = [], v = Math.ceil(lo / step) * step;
    for (; v <= hi + step * 1e-9 && out.length < 200; v += step) {
      out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    }
    return out;
  }
  // A.Fig no expone logTicks (es interno de figures.js): se replica acá.
  function logTicks(a?: any, b?: any): any {
    var lo = Math.min(a, b), hi = Math.max(a, b);
    if (!(lo > 0) || !isFinite(hi)) return niceTicks(a, b, 5);
    var out: Loose[] = [];
    var e0 = Math.floor(Math.log(lo) / Math.LN10);
    var e1 = Math.ceil(Math.log(hi) / Math.LN10);
    for (var e = e0; e <= e1 && out.length < 40; e++) {
      var v = Math.pow(10, e);
      if (v >= lo * 0.999 && v <= hi * 1.001) out.push(v);
    }
    return out.length ? out : niceTicks(a, b, 5);
  }

  // Etiqueta redonda: los decimales salen del paso entre ticks, no del valor.
  function labeler(vals?: any): any {
    var step = Infinity, i;
    for (i = 1; i < vals.length; i++) step = Math.min(step, Math.abs(vals[i] - vals[i - 1]));
    if (!isFinite(step) || step <= 0) step = Math.abs(vals[0]) || 1;
    var dec = Math.max(0, Math.min(6, Math.ceil(-Math.log(step) / Math.LN10) + (step < 1 ? 0 : 0)));
    if (step >= 1) dec = 0;
    return function(v?: any): any {
      if (Math.abs(v) < step * 1e-9) return "0";
      var av = Math.abs(v);
      if (av >= 1e5 || (av > 0 && av < 1e-4)) return v.toExponential(0).replace("e+", "e");
      return v.toFixed(dec);
    };
  }

  // ---------------- ejes ----------------
  function axes(ctx?: any, o?: any): any {
    o = o || {};
    var sx = o.sx, sy = o.sy;
    var box = o.box || {
      x0: Math.min.apply(null, sx.range()), x1: Math.max.apply(null, sx.range()),
      y0: Math.min.apply(null, sy.range()), y1: Math.max.apply(null, sy.range())
    };
    var grid = cssVar("--plot-grid") || "#ddd";
    var axis = cssVar("--plot-axis") || "#bbb";
    var txt = cssVar("--text-3") || "#777";
    var mono = cssVar("--font-mono") || "monospace";

    var yv = Array.isArray(o.yTicks) ? o.yTicks : niceTicks(sy.domain()[0], sy.domain()[1], o.yTicks || 5);
    var xv;
    if (Array.isArray(o.xTicks)) xv = o.xTicks;
    else if (o.log || sx.log) xv = logTicks(sx.domain()[0], sx.domain()[1]);
    else xv = niceTicks(sx.domain()[0], sx.domain()[1], o.xTicks || 6);

    var fy = o.fmtY || labeler(yv);
    var fx = o.fmtX || labeler(xv);
    var yLabels: Loose[] = [], xLabels: Loose[] = [];

    ctx.save();
    // rejilla horizontal: filete continuo de 1 px, jamás punteada
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = grid;
    ctx.fillStyle = txt;
    ctx.font = "11px " + mono;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    yv.forEach(function(v?: any): any {
      var py = Math.round(sy(v)) + 0.5;
      if (py < box.y0 - 1 || py > box.y1 + 1) return;
      ctx.beginPath(); ctx.moveTo(box.x0, py); ctx.lineTo(box.x1, py); ctx.stroke();
      var t = fy(v); yLabels.push(t);
      ctx.fillText(t, box.x0 - 8, py);
    });

    // eje de base
    var zero = o.zero != null ? o.zero : (sy.domain()[0] <= 0 && sy.domain()[1] >= 0 ? sy(0) : box.y1);
    ctx.strokeStyle = axis; ctx.lineWidth = 1;
    var pz = Math.round(zero) + 0.5;
    ctx.beginPath(); ctx.moveTo(box.x0, pz); ctx.lineTo(box.x1, pz); ctx.stroke();

    // rótulos de X
    ctx.fillStyle = txt; ctx.textAlign = "center"; ctx.textBaseline = "top";
    xv.forEach(function(v?: any): any {
      var px = sx(v);
      if (px < box.x0 - 1 || px > box.x1 + 1) return;
      var t = fx(v); xLabels.push(t);
      ctx.fillText(t, px, pz + 7);
    });

    if (o.xLabel) {
      ctx.textAlign = "right"; ctx.textBaseline = "bottom";
      ctx.fillText(o.xLabel, box.x1, box.y1 + (box.pad ? box.pad.b : PAD.b) - 1);
    }
    var yLabelBox: Loose = null;
    if (o.yLabel) {
      // El rótulo del eje Y ocupa la franja libre a la IZQUIERDA de las
      // etiquetas de tick: se lo alinea contra el borde de la etiqueta más
      // ancha en vez de fijarlo en una x constante (con etiquetas de cuatro
      // caracteres, "0.05" y similares, la x fija se le montaba encima).
      var lblH = 11;                                   // alto de caja de la fuente de 11 px
      var maxW = 0;
      yLabels.forEach(function(t?: any): any { var w = ctx.measureText(t).width; if (w > maxW) maxW = w; });
      var tickLeft = box.x0 - 8 - maxW;                // borde izquierdo del texto de los ticks
      var bandX = tickLeft - 3 - lblH;                 // franja del rótulo, con 3 px de aire
      if (bandX >= 1) {
        ctx.save();
        ctx.translate(bandX, box.y0 + (box.y1 - box.y0) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(o.yLabel, 0, 0);
        ctx.restore();
        yLabelBox = { x0: bandX, x1: bandX + lblH, rotated: true, tickLeft: tickLeft };
      } else {
        // Sin franja suficiente: el rótulo va en horizontal SOBRE el marco,
        // donde no hay etiquetas de tick.
        var hy = Math.max(0, box.y0 - 8 - lblH);
        ctx.textAlign = "left"; ctx.textBaseline = "top";
        ctx.fillText(o.yLabel, 1, hy);
        yLabelBox = { x0: 1, x1: 1 + ctx.measureText(o.yLabel).width, y0: hy, y1: hy + lblH,
                      rotated: false, tickLeft: tickLeft };
      }
    }
    ctx.restore();

    ctx.canvas.__plotDebug = {
      xTicks: xv.slice(), yTicks: yv.slice(),
      xLabels: xLabels, yLabels: yLabels,
      yLabelBox: yLabelBox
    };
    return { xTicks: xv, yTicks: yv, zero: zero };
  }

  // ---------------- marcas ----------------
  function roundedBar(ctx?: any, x?: any, y?: any, w?: any, h?: any, r?: any): any {
    // radio SOLO en el extremo del dato (arriba si la barra sube)
    var up = h >= 0;
    var top = up ? y : y + h, hh = Math.abs(h);
    r = Math.max(0, Math.min(r, w / 2, hh));
    ctx.beginPath();
    if (up) {
      ctx.moveTo(x, top + hh);
      ctx.lineTo(x, top + r);
      ctx.quadraticCurveTo(x, top, x + r, top);
      ctx.lineTo(x + w - r, top);
      ctx.quadraticCurveTo(x + w, top, x + w, top + r);
      ctx.lineTo(x + w, top + hh);
    } else {
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + hh - r);
      ctx.quadraticCurveTo(x, top + hh, x + r, top + hh);
      ctx.lineTo(x + w - r, top + hh);
      ctx.quadraticCurveTo(x + w, top + hh, x + w, top + hh - r);
      ctx.lineTo(x + w, top);
    }
    ctx.closePath();
    ctx.fill();
  }

  function bars(ctx?: any, o?: any): any {
    var sx = o.sx, sy = o.sy, xs = o.xs, ys = o.ys;
    var base = o.base != null ? o.base : sy(0);
    var gap = o.gap != null ? o.gap : 2;
    var step = xs.length > 1 ? Math.abs(sx(xs[1]) - sx(xs[0])) : (o.width || 24) + gap;
    var w = o.width != null ? o.width : Math.max(1, Math.min(24, step - gap));
    var r = o.radius != null ? o.radius : 4;
    var col = o.color;
    ctx.save();
    ctx.setLineDash([]);
    for (var i = 0; i < xs.length; i++) {
      var px = sx(xs[i]), py = sy(ys[i]);
      ctx.fillStyle = typeof col === "function" ? col(i, xs[i], ys[i]) : (col || series(1));
      roundedBar(ctx, px - w / 2, py, w, base - py, r);
    }
    ctx.restore();
    return w;
  }

  function area(ctx?: any, o?: any): any {
    var sx = o.sx, sy = o.sy, xs = o.xs, ys = o.ys;
    var base = o.base != null ? o.base : sy(0);
    var fill = o.fill;
    if (!fill) {
      var a = o.alpha != null ? o.alpha : tokenAlpha("--plot-band-a", 0.10);
      fill = alpha(o.color || series(1), a);
    }
    if (!xs.length) return;
    ctx.save();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(sx(xs[0]), base);
    for (var i = 0; i < xs.length; i++) ctx.lineTo(sx(xs[i]), sy(ys[i]));
    ctx.lineTo(sx(xs[xs.length - 1]), base);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
  }

  function curve(ctx?: any, o?: any): any {
    var sx = o.sx, sy = o.sy, xs = o.xs, ys = o.ys;
    if (!xs.length) return;
    ctx.save();
    ctx.beginPath();
    for (var i = 0; i < xs.length; i++) {
      var px = sx(xs[i]), py = sy(ys[i]);
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.strokeStyle = o.color || series(1);
    ctx.lineWidth = o.width != null ? o.width : 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.setLineDash(o.dash || []);
    ctx.stroke();
    ctx.restore();
  }

  function vline(ctx?: any, x?: any, o?: any): any {
    o = o || {};
    var box = o.box;
    var px = o.sx ? o.sx(x) : x;
    var y0 = o.y0 != null ? o.y0 : (box ? box.y0 : 0);
    var y1 = o.y1 != null ? o.y1 : (box ? box.y1 : ctx.canvas.height);
    ctx.save();
    // La referencia es una ANOTACIÓN, no rejilla: por omisión va en --text-3,
    // que se lee en los tres temas (--plot-axis queda al nivel de la rejilla y
    // en el tema oscuro resulta prácticamente invisible).
    ctx.strokeStyle = o.color || cssVar("--text-3") || "#999";
    ctx.lineWidth = o.width != null ? o.width : 1.5;
    ctx.setLineDash(o.dash || [5, 4]);
    ctx.beginPath(); ctx.moveTo(px, y0); ctx.lineTo(px, y1); ctx.stroke();
    ctx.setLineDash([]);
    if (o.label) {
      // El rótulo NO lleva el color del dato: la identidad ya la da el trazo.
      ctx.fillStyle = o.labelColor || cssVar("--text-2") || "#555";
      ctx.font = "600 11px " + (cssVar("--font-mono") || "monospace");
      var right = o.align === "left" ? false : (box ? px > box.x1 - 46 : false);
      ctx.textAlign = right ? "right" : "left";
      ctx.textBaseline = "top";
      ctx.fillText(o.label, px + (right ? -5 : 5), y0 + 1);
    }
    ctx.restore();
    return px;
  }

  // ---------------- leyenda ----------------
  function legend(host?: any, items?: any): any {
    host = el(host);
    if (!host) return null;
    host.className = (host.className || "").indexOf("pw-legend") >= 0 ? host.className : ((host.className ? host.className + " " : "") + "pw-legend");
    host.innerHTML = (items || []).map(function(it?: any): any {
      var kind = it.kind || "bar";
      var c = it.color || series(1);
      var st;
      if (kind === "line" || kind === "dash") {
        st = "background:none;height:6px;border-radius:0;border-bottom:2.5px " +
          (kind === "dash" ? "dashed " : "solid ") + c + ";";
      } else {
        // misma opacidad que la marca a la que representa
        st = "background:" + (it.alpha != null ? alpha(c, it.alpha) : c) + ";";
      }
      var lbl = A.escapeHtml ? A.escapeHtml(it.label) : String(it.label);
      // el color también va dentro de un atributo: una comilla lo cerraría (AS S3-A4)
      var sty = A.escapeHtml ? A.escapeHtml(st) : String(st).replace(/"/g, "&quot;");
      return '<span><i class="pw-sw" style="' + sty + '"></i>' + lbl + "</span>";
    }).join("");
    return host;
  }

  // ---------------- lectura punto a punto ----------------
  function hover(canvas?: any, o?: any): any {
    o = o || {};
    if (canvas.__plotHoverOff) { canvas.__plotHoverOff(); }
    var sx = o.sx, sy = o.sy, box = o.box;
    var ss = (o.series || []).filter(function(s?: any): any { return s && s.xs && s.xs.length; });
    var readout = el(o.readout);
    var dpr = window.devicePixelRatio || 1;
    var snap: Loose = null;
    try { snap = o.snapshot || canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height); } catch (e) { snap = null; }
    var fmt = o.fmt || function(pt?: any): any {
      return (A.fmt ? A.fmt(pt.x) : pt.x) + " · " + (A.fmt4 ? A.fmt4(pt.y) : pt.y);
    };

    function restore(ctx?: any): any {
      if (snap) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.putImageData(snap, 0, 0); ctx.restore(); }
    }

    function nearest(mx?: any): any {
      var best: Loose = null;
      ss.forEach(function(s?: any, si?: any): any {
        for (var i = 0; i < s.xs.length; i++) {
          var d = Math.abs(sx(s.xs[i]) - mx);
          if (!best || d < best.d) best = { d: d, x: s.xs[i], y: s.ys[i], serie: s, si: si, i: i };
        }
      });
      return best;
    }

    function draw(ev?: any): any {
      var ctx = canvas.getContext("2d");
      var r = canvas.getBoundingClientRect();
      var t = ev.touches && ev.touches[0] ? ev.touches[0] : ev;
      var mx = (t.clientX - r.left) * (canvas.width / dpr / r.width);
      var my = (t.clientY - r.top) * (canvas.height / dpr / r.height);
      if (mx < box.x0 - 6 || mx > box.x1 + 6 || my < box.y0 - 10 || my > box.y1 + 12) { leave(); return; }
      var hit = nearest(mx);
      if (!hit) return;
      restore(ctx);
      var px = sx(hit.x), py = sy(hit.y);
      var txt2 = cssVar("--text-2") || "#555";
      ctx.save();
      // cruz filiforme
      ctx.strokeStyle = cssVar("--plot-axis") || "#999";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(Math.round(px) + 0.5, box.y0); ctx.lineTo(Math.round(px) + 0.5, box.y1); ctx.stroke();
      ctx.setLineDash([]);
      // punto más cercano
      var c = hit.serie.color || series(hit.si + 1);
      ctx.fillStyle = cssVar("--surface") || "#fff";
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
      // Ficha de lectura SOBRE el lienzo solo cuando no hay un elemento de
      // lectura en el DOM: con los dos a la vez el mismo número se leería dos
      // veces y la ficha taparía las anotaciones de arriba (E[X], por ejemplo).
      var label = fmt(hit);
      if (!readout) {
        ctx.font = "11px " + (cssVar("--font-mono") || "monospace");
        var wpx = ctx.measureText(label).width + 16;
        var bx = px > box.x1 - wpx - 12 ? box.x0 + 2 : box.x1 - wpx - 2;
        var by = box.y0 + 2;
        ctx.fillStyle = alpha(cssVar("--surface") || "#fff", 0.92);
        ctx.strokeStyle = cssVar("--plot-grid") || "#ddd";
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, wpx, 22, 5);
        else ctx.rect(bx, by, wpx, 22);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = txt2;
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(label, bx + 8, by + 11);
      }
      ctx.restore();
      canvas.dataset.plotReadout = label;
      if (readout) { readout.textContent = label; readout.hidden = false; }
    }

    function leave(): any {
      restore(canvas.getContext("2d"));
      canvas.dataset.plotReadout = "";
      if (readout) { readout.textContent = ""; readout.hidden = true; }
    }

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", leave);
    canvas.addEventListener("touchmove", draw, { passive: true });
    canvas.addEventListener("touchend", leave);
    var off = function(): any {
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseleave", leave);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", leave);
      canvas.__plotHoverOff = null;
    };
    canvas.__plotHoverOff = off;
    return off;
  }

  // ---------------- accesibilidad ----------------
  function a11y(canvas?: any, label?: any, tableHtml?: any): any {
    canvas.setAttribute("role", "img");
    if (label) canvas.setAttribute("aria-label", label);
    var next = canvas.parentNode && canvas.parentNode.querySelector(":scope > details.pw-data");
    if (!tableHtml) { if (next) next.remove(); return; }
    if (!next) {
      next = document.createElement("details");
      next.className = "pw-data";
      canvas.parentNode.appendChild(next);
    }
    next.innerHTML = "<summary>Ver los datos en una tabla</summary>" + tableHtml;
  }

  var Plot = {
    PAD: PAD,
    setup: setup, frame: frame, scales: scales,
    ticks: niceTicks, logTicks: logTicks, labeler: labeler,
    axes: axes, bars: bars, area: area, curve: curve, vline: vline,
    legend: legend, hover: hover, a11y: a11y,
    series: series, cssVar: cssVar, alpha: alpha, tokenAlpha: tokenAlpha
  };
  A.Plot = Plot;
  return Plot;
}
