/* ============================================================
   figuras/u0.js — figuras de la Unidad 0 (Complementos matemáticos).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure) y de
   lib-math.js (window.M). Cada figura se registra con su identificador
   definitivo; las páginas del wiki la invocan con el callout

       > [!figura] <id>
       > <epígrafe>

   FIGURAS REGISTRADAS
     u0-fubini-orden-de-integracion        tecnica-integrales-dobles.md
     u0-superficie-densidad-suma-de-riemann
                                           tecnica-integrales-dobles.md
     u0-baricentro-placa-triangular        tecnica-integrales-dobles.md
     u0-alambre-masa-acumulada-y-densidad  tecnica-derivadas-parciales.md
     u0-derivada-cruzada-cuatro-vertices   tecnica-derivadas-parciales.md
     u0-clairaut-dos-caminos               tecnica-derivadas-parciales.md
     u0-cola-convergente-vs-divergente     tecnica-integrales-impropias.md
     u0-singularidad-tipo-ii-area-finita   tecnica-integrales-impropias.md

   EXACTITUD DE LOS NÚMEROS
     Ninguna lectura se escribe a mano. Todas salen de expresiones cerradas
     verificables sobre las mismas funciones que se dibujan:
       placa triangular  d(x,y)=xy sobre 0<x, 0<y, x+y<1
                         masa = 1/24, baricentro (2/5, 2/5)
       masa acumulada    m(x,y)=x²y³   →  ∂²m/∂x∂y = 6xy²
                         cociente centrado exacto = 2α(3β² + (Δy/2)²)
       alambre           m(x)=3x²−2x³  →  dm/dx = 6x(1−x)
                         secante centrada exacta = 6α(1−α) − (Δx/2)²·2
       colas             ∫₁ᵗ x⁻² = 1 − 1/t ;  ∫₁ᵗ x⁻¹ = ln t
       singularidad      ∫ₜ⁵ (2√(x−2))⁻¹ = √3 − √(t−2)
     Donde hay una integral sin primitiva cómoda a mano se usa M.integrate
     (Simpson de lib-math.js), no una constante copiada.

   NOTA SOBRE EL 3D
     La figura de la suma de Riemann normaliza la altura de los prismas con
     el MISMO zmin/zmax que usa Fig.surface sobre su malla de muestreo, para
     que prismas y superficie queden a la misma escala vertical cuando se
     muestran juntos.
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || typeof A.registerFigure !== "function") return;
  var M = window.M || {};

  // ---------------- utilidades locales ----------------

  // Los overlays de KaTeX (Fig.tex) se cuelgan del envoltorio del <svg>, no
  // de la capa <g> que se vacía en cada redibujo: hay que borrarlos a mano o
  // se acumulan uno encima de otro en cada movimiento de un deslizador.
  function clearTex(svg) {
    var wrap = svg && svg.__wrap;
    if (!wrap) return;
    var nodes = wrap.querySelectorAll(".fig-tex");
    for (var i = 0; i < nodes.length; i++) wrap.removeChild(nodes[i]);
  }

  // Fig.tex con tamaño explícito (los overlays por omisión son de 13px y las
  // fórmulas largas de esta unidad necesitan bajar un punto para no invadir
  // el dibujo).
  function texAt(F, svg, str, x, y, opts) {
    opts = opts || {};
    var d = F.tex(svg, str, { x: x, y: y, anchor: opts.anchor || "start", svg: svg, color: opts.color });
    if (d) d.style.fontSize = (opts.size || 12.5) + "px";
    return d;
  }

  // \textcolor sólo si el token resolvió a un hexadecimal; si el tema
  // devolviera rgb() KaTeX lo rechazaría y la fórmula saldría en crudo.
  function tc(color, str) {
    return /^#[0-9a-fA-F]{3,8}$/.test(color || "") ? "\\textcolor{" + color + "}{" + str + "}" : str;
  }

  function arrow(F, layer, x1, y1, x2, y2, col, opts) {
    opts = opts || {};
    var dx = x2 - x1, dy = y2 - y1;
    var L = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / L, uy = dy / L;
    var head = opts.head == null ? 9 : opts.head;
    var hx = x2 - ux * head, hy = y2 - uy * head;
    F.line(layer, [[x1, y1], [hx, hy]], {
      stroke: col, width: opts.width == null ? 1.2 : opts.width, dash: opts.dash,
      cls: "fig-ref", serie: false
    });
    var w = head * 0.5;
    F.path(layer,
      "M" + x2 + " " + y2 +
      "L" + (hx - uy * w) + " " + (hy + ux * w) +
      "L" + (hx + uy * w) + " " + (hy - ux * w) + "Z",
      { fill: col, stroke: col, width: 0.6, cls: "fig-ref" });
  }

  function rect(F, layer, x0, y0, x1, y1, o) {
    o = o || {};
    return F.el("rect", {
      x: Math.min(x0, x1), y: Math.min(y0, y1),
      width: Math.abs(x1 - x0), height: Math.abs(y1 - y0),
      rx: o.rx == null ? 2 : o.rx,
      fill: o.fill || "none",
      opacity: o.opacity == null ? null : o.opacity,
      "fill-opacity": o.fillOpacity == null ? null : o.fillOpacity,
      stroke: o.stroke || null,
      "stroke-width": o.stroke ? (o.width == null ? 1.2 : o.width) : null,
      "stroke-dasharray": o.dash || null
    }, layer);
  }

  // Línea de CONSTRUCCIÓN o apoyo (rejilla propia, ejes de una escena 3D,
  // aristas, guías): canal secundario. Va a 1.2 px y con la clase .fig-ref,
  // porque el trazo de 2 px queda reservado para las marcas que llevan dato.
  function aux(F, layer, pts, col, o) {
    o = o || {};
    return F.line(layer, pts, {
      sx: o.sx, sy: o.sy, close: o.close, fill: o.fill, opacity: o.opacity,
      stroke: col, width: o.width == null ? 1.2 : o.width, dash: o.dash,
      cls: "fig-ref", serie: false
    });
  }

  // Puntos equiespaciados en escala logarítmica (Fig.curve muestrea uniforme
  // en datos y sobre un eje log dejaría la parte izquierda sin resolución).
  function logPts(fn, a, b, n) {
    var out = [], i, la = Math.log(a), lb = Math.log(b);
    for (i = 0; i <= n; i++) {
      var x = Math.exp(la + (lb - la) * i / n);
      var y = fn(x);
      if (isFinite(y)) out.push([x, y]);
    }
    return out;
  }

  function toPx(pts, sx, sy) {
    return pts.map(function (p) { return [sx(p[0]), sy(p[1])]; });
  }

  // ============================================================
  //  1. Fubini: qué límite depende de qué variable
  // ============================================================

  A.registerFigure("u0-fubini-orden-de-integracion", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 350;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Barrido del triángulo con una varilla, en los dos órdenes de integración"
    });

    var sel = F.select(host, {
      k: "orden", label: "orden de integración", value: "dydx",
      options: [
        { v: "dydx", label: "dy dx — varilla vertical" },
        { v: "dxdy", label: "dx dy — varilla horizontal" }
      ]
    }, function () { redraw(); });

    var ctl = F.controls(host, [
      { k: "u", label: "posición de la varilla", min: 0.02, max: 0.98, step: 0.01, value: 0.35, dec: 2 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "ext", label: "límite externo" },
      { k: "int", label: "límite interno" },
      { k: "len", label: "largo de la varilla" }
    ]);

    F.legend(host, [
      { label: "recinto R: 0 < x < 1, 0 < y < 1 − x", color: F.series(1), fill: true },
      { label: "varilla de la integral interna", color: F.series(2) }
    ]);

    var layer = F.el("g", null, svg);
    var sx = F.scale([0, 1.16], [70, 340]);
    var sy = F.scale([0, 1.16], [286, 26]);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      clearTex(svg);

      var orden = sel.get();
      var u = ctl.get("u");
      var cRod = F.series(2);
      var cReg = F.series(1);
      var cTxt = F.color("text-2");
      var cMut = F.color("text-3");

      F.axes(layer, {
        sx: sx, sy: sy,
        xTicks: [0, 0.25, 0.5, 0.75, 1], yTicks: [0, 0.25, 0.5, 0.75, 1],
        xLabel: "x", yLabel: "y"
      });

      // Recinto en dos piezas: el lavado plano va sin trazo y el contorno
      // aparte, de 2 px, para que el recinto quede registrado como serie
      // legible (un camino con relleno no entra en la capa de lectura).
      F.line(layer, [[0, 0], [1, 0], [0, 1]], {
        sx: sx, sy: sy, close: true, fill: cReg, opacity: 0.10
      });
      F.line(layer, [[0, 0], [1, 0], [0, 1], [0, 0]], {
        sx: sx, sy: sy, stroke: cReg, width: 2, serie: "recinto R"
      });
      F.label(layer, sx(0.56), sy(0.50), "y = 1 − x", { size: 12, keyColor: cReg });
      F.text(layer, sx(0.20), sy(0.20), "R", { size: 15, fill: cTxt, weight: 600 });

      // varilla
      var a, b, len, fixedLabel, rodPts;
      if (orden === "dydx") {
        a = 0; b = 1 - u; len = b - a;
        rodPts = [[u, a], [u, b]];
        fixedLabel = "x = " + F.fmt(u, 2);
      } else {
        a = 0; b = 1 - u; len = b - a;
        rodPts = [[a, u], [b, u]];
        fixedLabel = "y = " + F.fmt(u, 2);
      }
      F.line(layer, rodPts, { sx: sx, sy: sy, stroke: cRod, width: 2, serie: "varilla" });
      F.marker(layer, sx(rodPts[0][0]), sy(rodPts[0][1]), { r: 4.6, fill: cRod, serie: false });
      F.marker(layer, sx(rodPts[1][0]), sy(rodPts[1][1]), { r: 4.6, fill: cRod, serie: false });

      if (orden === "dydx") {
        F.vline(layer, sx(u), {
          y0: sy(0), y1: sy(1.14), stroke: cRod,
          label: fixedLabel, labelAt: sy(1.14) - 6, keyColor: cRod
        });
        arrow(F, layer, sx(u) + 13, sy(a), sx(u) + 13, sy(b), cRod, { head: 7 });
        F.label(layer, sx(u) + 18, (sy(a) + sy(b)) / 2, "y: 0 → 1 − x", {
          size: 11.5, keyColor: cRod, baseline: "middle"
        });
      } else {
        F.hline(layer, sy(u), {
          x0: sx(0), x1: sx(1.06), stroke: cRod,
          label: fixedLabel, labelAt: sx(0.62), keyColor: cRod
        });
        arrow(F, layer, sx(a), sy(u) - 13, sx(b), sy(u) - 13, cRod, { head: 7 });
        F.label(layer, (sx(a) + sx(b)) / 2, sy(u) - 19, "x: 0 → 1 − y", {
          size: 11.5, keyColor: cRod, anchor: "middle"
        });
      }

      // flecha del barrido externo (fuera del recinto, para no tapar la varilla)
      if (orden === "dydx") {
        arrow(F, layer, sx(0.04), 14, sx(1.0), 14, cMut, { head: 7 });
        F.text(layer, (sx(0) + sx(1)) / 2, 342, "barrido externo en x", {
          size: 11, anchor: "middle", fill: cMut
        });
      } else {
        arrow(F, layer, sx(1.10), sy(0.04), sx(1.10), sy(1.0), cMut, { head: 7 });
        F.text(layer, (sx(0) + sx(1)) / 2, 342, "barrido externo en y", {
          size: 11, anchor: "middle", fill: cMut
        });
      }

      // fórmulas
      var X0 = 384;
      var inner = orden === "dydx" ? "1-x" : "1-y";
      var dv1 = orden === "dydx" ? "dy" : "dx";
      var dv2 = orden === "dydx" ? "dx" : "dy";
      F.text(layer, X0, 58, "Integral iterada", { size: 12, fill: cTxt, weight: 600 });
      texAt(F, svg, "\\iint_R d(x,y)\\,dA \\;=", X0, 84, { size: 13 });
      texAt(F, svg,
        "\\int_{" + tc(cMut, "0") + "}^{" + tc(cMut, "1") + "}\\!\\left[\\;\\int_{" +
        tc(cRod, "0") + "}^{" + tc(cRod, inner) + "} d(x,y)\\," + dv1 + "\\right]" + dv2,
        X0, 128, { size: 12.5 });
      // Las dos líneas cortas (en vez de una larga) y el hueco de 40 unidades
      // bajo la fórmula dejan sitio para el overlay de KaTeX, que es HTML y no
      // se encoge con el viewBox: a 400 px de ancho la integral iterada se
      // montaba sobre esta nota.
      F.text(layer, X0, 166, "externo constante ·", { size: 11, fill: cMut });
      F.text(layer, X0, 185, "interno con la otra variable", { size: 11, fill: cMut });

      F.text(layer, X0, 206, "Con la varilla en " + fixedLabel, { size: 12, fill: cTxt, weight: 600 });
      texAt(F, svg,
        "\\int_{0}^{" + F.fmt(b, 2) + "} d(" +
        (orden === "dydx" ? F.fmt(u, 2) + ",\\,y" : "x,\\," + F.fmt(u, 2)) +
        ")\\," + dv1,
        X0, 238, { size: 13, color: cRod });

      F.text(layer, X0, 272, "Si en un límite quedan dos variables,", { size: 11, fill: cMut });
      F.text(layer, X0, 292, "el orden está invertido.", { size: 11, fill: cMut });

      out.set("ext", orden === "dydx" ? "0 ≤ x ≤ 1" : "0 ≤ y ≤ 1");
      out.set("int", orden === "dydx"
        ? "0 ≤ y ≤ 1 − x = " + F.fmt(b, 2)
        : "0 ≤ x ≤ 1 − y = " + F.fmt(b, 2));
      out.set("len", F.fmt(len, 3));
    }

    redraw();
  }, {
    titulo: "Fubini: qué límite depende de qué variable",
    title: "Fubini: qué límite depende de qué variable",
    page: "tecnica-integrales-dobles", kind: "interactive", unidad: "0"
  });

  // ============================================================
  //  2. Suma de Riemann en 3D: la masa como volumen
  // ============================================================

  A.registerFigure("u0-superficie-densidad-suma-de-riemann", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 344;
    var HB = H - 18;                   // franja inferior reservada para la nota
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Prismas sobre la malla del triángulo y superficie de densidad d(x,y) = xy"
    });

    var vista = F.select(host, {
      k: "vista", label: "vista", value: "prismas",
      options: [
        { v: "prismas", label: "prismas de la suma" },
        { v: "superficie", label: "superficie d(x,y)" },
        { v: "ambas", label: "prismas y superficie" }
      ]
    }, function () { redraw(); });

    var ctl = F.controls(host, [
      { k: "n", label: "celdas por lado (n)", min: 2, max: 24, step: 1, value: 5, dec: 0 },
      { k: "azim", label: "azimut (°)", min: -180, max: 180, step: 5, value: 35, dec: 0 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "cells", label: "celdas con parte dentro de R" },
      { k: "sum", tex: "\\sum\\sum d(x_i,y_j)\\,\\Delta A_{ij}" },
      { k: "exact", tex: "\\iint_R xy\\,dA = 1/24" },
      { k: "err", label: "error relativo" }
    ]);

    F.legend(host, [
      { label: "prisma: altura d(xᵢ, yⱼ), base = celda ∩ R", color: F.series(1), fill: true },
      { label: "superficie d(x, y) = x·y", color: F.series(2) },
      { label: "recinto R sobre el plano z = 0", color: F.series(3) }
    ]);

    var layer = F.el("g", null, svg);   // escena 3D (se reencuadra en cada dibujo)
    var hud = F.el("g", null, svg);     // nota fija al pie, fuera del reencuadre
    var SN = 26;                        // malla de muestreo de la superficie
    var EXACT = 1 / 24;

    function dens(x, y) { return (x + y < 1) ? x * y : 0; }

    // mismo muestreo que hace Fig.surface con {from:0,to:1,n:SN}
    function sampleMax() {
      var mx = 0, i, j, v;
      for (i = 0; i <= SN; i++) {
        for (j = 0; j <= SN; j++) {
          v = dens(i / SN, j / SN);
          if (v > mx) mx = v;
        }
      }
      return mx;
    }
    var ZMAX = sampleMax(), ZMIN = 0, ZS = 0.62;

    // ------------------------------------------------------------------
    // Recorte de una celda por el semiplano x + y ≤ 1 (Sutherland-Hodgman).
    // Sirve para DOS cosas a la vez y por eso el dibujo y el número no pueden
    // discrepar: el polígono recortado es la base del prisma que se dibuja, y
    // su área es el peso ΔA_ij con que la celda entra en la suma.
    //
    // POR QUÉ PESAR POR ÁREA. Contar la celda entera cuando su centro cae
    // dentro de R (que es lo natural sobre un rectángulo) deja en el borde un
    // error de escalera de orden 1/n que además oscila con la paridad de n:
    // medido sobre esta misma placa, el error relativo iba de 4,2 % con n = 6
    // a 18,1 % con n = 10 y 11,7 % con n = 16, de modo que refinar la malla
    // EMPEORABA el resultado en buena parte del rango y la figura mostraba lo
    // contrario de lo que enuncia. Con el peso por área el error decrece de
    // forma monótona (50 % con n = 2, 5,6 % con n = 6, 2,0 % con n = 10,
    // 0,35 % con n = 24), que es la convergencia que la página describe.
    // ------------------------------------------------------------------
    function clipCell(x0, x1, y0, y1) {
      var poly = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], res = [], i;
      for (i = 0; i < 4; i++) {
        var a = poly[i], b = poly[(i + 1) % 4];
        var fa = 1 - a[0] - a[1], fb = 1 - b[0] - b[1];
        if (fa >= 0) res.push(a);
        if ((fa > 0 && fb < 0) || (fa < 0 && fb > 0)) {
          var t = fa / (fa - fb);
          res.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        }
      }
      return res;
    }
    function polyArea(p) {
      var s = 0, i, n = p.length;
      if (n < 3) return 0;
      for (i = 0; i < n; i++) {
        var q = p[(i + 1) % n];
        s += p[i][0] * q[1] - q[0] * p[i][1];
      }
      return Math.abs(s) / 2;
    }

    function riemann(n) {
      var w = 1 / n, S = 0, cells = [], i, j;
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          var x0 = i * w, y0 = j * w;
          var poly = clipCell(x0, x0 + w, y0, y0 + w);
          var dA = polyArea(poly);
          if (dA <= 1e-12) continue;
          var xc = x0 + w / 2, yc = y0 + w / 2;   // punto de muestreo: el centro de la celda
          var d = xc * yc;
          S += d * dA;
          var gx = 0, gy = 0, q;
          for (q = 0; q < poly.length; q++) { gx += poly[q][0]; gy += poly[q][1]; }
          cells.push({
            poly: poly, dA: dA, xc: xc, yc: yc, d: d,
            gx: gx / poly.length, gy: gy / poly.length,   // centro del polígono recortado
            full: dA > w * w - 1e-12
          });
        }
      }
      return { S: S, cells: cells, w: w };
    }

    function zOf(d) { return (d - ZMIN) / ((ZMAX - ZMIN) || 1) * ZS; }

    // Encuadre analítico. La escena se mide EN EL AZIMUT PEDIDO, sobre los
    // puntos que de verdad se van a dibujar (base, ejes, tapas de los prismas
    // y, si corresponde, la superficie), y se escala y centra para llenar el
    // lienzo. Con la escala fija anterior la escena dejaba cerca de la mitad
    // del alto en blanco arriba para unos azimuts y se salía por abajo para
    // otros, arrastrando el rótulo del eje y sobre la fila de controles.
    function frame(az, view, R) {
      var p0 = F.iso3d({ elev: 27, azim: az, scale: 1 });
      var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      function add(x, y, z) {
        var p = p0.project(x - 0.5, y - 0.5, z || 0);
        if (p[0] < x0) x0 = p[0];
        if (p[0] > x1) x1 = p[0];
        if (p[1] < y0) y0 = p[1];
        if (p[1] > y1) y1 = p[1];
      }
      // base completa (rejilla) y puntas de los ejes
      add(0, 0, 0); add(1, 0, 0); add(1, 1, 0); add(0, 1, 0);
      add(1.24, 0, 0); add(0, 1.24, 0); add(0, 0, ZS * 1.12);
      if (view === "prismas" || view === "ambas") {
        R.cells.forEach(function (c) {
          var z = zOf(c.d);
          c.poly.forEach(function (q) { add(q[0], q[1], z); });
        });
      }
      if (view === "superficie" || view === "ambas") {
        var K = 13, i, j;
        for (i = 0; i <= K; i++) {
          for (j = 0; j <= K; j++) add(i / K, j / K, zOf(dens(i / K, j / K)));
        }
      }
      var padL = 54, padR = 28, padT = 20, padB = 14;
      var availW = W - padL - padR, availH = HB - padT - padB;
      var sc = Math.min(availW / (x1 - x0), availH / (y1 - y0));
      return {
        proj: F.iso3d({ elev: 27, azim: az, scale: sc }),
        cx: padL - x0 * sc + (availW - (x1 - x0) * sc) / 2,
        cy: padT - y0 * sc + (availH - (y1 - y0) * sc) / 2
      };
    }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      while (hud.firstChild) hud.removeChild(hud.firstChild);
      layer.removeAttribute("transform");

      var n = Math.round(ctl.get("n"));
      var az = ctl.get("azim");
      var view = vista.get();
      var R = riemann(n);
      var fr = frame(az, view, R);
      var proj = fr.proj, cx = fr.cx, cy = fr.cy;
      var cGrid = F.color("plot-grid"), cAxis = F.color("plot-axis");
      var cReg = F.series(3), cLow = F.color("surface-2"), cHigh = F.series(1);
      var cAcc = F.series(2);
      var cTxt = F.color("text-3"), cEdge = F.color("border-2") || F.color("border");

      function P(x, y, z) {
        var p = proj.project(x - 0.5, y - 0.5, z || 0);
        return [cx + p[0], cy + p[1]];
      }
      function D(x, y, z) { return proj.depth(x - 0.5, y - 0.5, z || 0); }

      // rejilla de la base
      var g, k;
      for (k = 0; k <= n; k++) {
        g = k / n;
        aux(F, layer, [P(g, 0, 0), P(g, 1, 0)], cGrid, { width: 0.8 });
        aux(F, layer, [P(0, g, 0), P(1, g, 0)], cGrid, { width: 0.8 });
      }
      // recinto triangular sobre la base: lavado plano y contorno de 2 px
      F.line(layer, [P(0, 0, 0), P(1, 0, 0), P(0, 1, 0)], {
        close: true, fill: cReg, opacity: 0.10
      });
      F.line(layer, [P(0, 0, 0), P(1, 0, 0), P(0, 1, 0), P(0, 0, 0)], {
        stroke: cReg, width: 2, serie: false
      });

      // ejes del plano base
      aux(F, layer, [P(0, 0, 0), P(1.16, 0, 0)], cAxis);
      aux(F, layer, [P(0, 0, 0), P(0, 1.16, 0)], cAxis);
      var ex = P(1.24, 0, 0), ey = P(0, 1.24, 0);
      F.text(layer, ex[0], ex[1] + 4, "x", { size: 12, fill: cTxt, anchor: "middle" });
      F.text(layer, ey[0], ey[1] + 4, "y", { size: 12, fill: cTxt, anchor: "middle" });
      var z0 = P(0, 0, 0), z1 = P(0, 0, ZS * 1.12);
      aux(F, layer, [z0, z1], cAxis, { dash: "3 3" });
      F.text(layer, z1[0] - 9, z1[1] - 4, "d(x, y)", { size: 12, fill: cTxt, anchor: "end" });

      // los prismas van ANTES que la superficie: dibujados después la tapaban
      // por completo y la vista «prismas y superficie» era indistinguible de
      // la de prismas sueltos.
      if (view === "prismas" || view === "ambas") {
        // orden del pintor: por el centro del polígono RECORTADO (el centro de
        // la celda entera cae fuera de R en las celdas del borde y daría un
        // orden equivocado justo en la diagonal).
        var order = R.cells.slice().sort(function (a1, b1) {
          return D(b1.gx, b1.gy, 0) - D(a1.gx, a1.gy, 0);
        });
        order.forEach(function (c) {
          var z = zOf(c.d);
          var t = Math.max(0, Math.min(1, (c.d - ZMIN) / ((ZMAX - ZMIN) || 1)));
          var fill = F.mix(cLow, cHigh, t);
          var side = F.mix(fill, cLow, 0.35);
          var np = c.poly.length, q;
          var dCen = D(c.gx, c.gy, 0);
          var faces = [];
          for (q = 0; q < np; q++) {
            var a = c.poly[q], b = c.poly[(q + 1) % np];
            var dep = D((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0);
            if (dep >= dCen) continue;          // cara que mira hacia el fondo
            faces.push({ a: a, b: b, dep: dep });
          }
          faces.sort(function (p1, p2) { return p2.dep - p1.dep; });
          faces.forEach(function (f2) {
            F.line(layer, [
              P(f2.a[0], f2.a[1], 0), P(f2.b[0], f2.b[1], 0),
              P(f2.b[0], f2.b[1], z), P(f2.a[0], f2.a[1], z)
            ], { close: true, fill: side, stroke: cEdge, width: 0.4, cls: "fig-ref", serie: false });
          });
          var top = c.poly.map(function (p) { return P(p[0], p[1], z); });
          F.line(layer, top, {
            close: true, fill: fill, stroke: cEdge, width: 0.4, cls: "fig-ref", serie: false
          });
        });
      }

      // En «prismas y superficie» la superficie va DESPUÉS de los prismas y en
      // el color de acento, translúcida: dibujada antes quedaba íntegramente
      // tapada por los prismas opacos y la vista era indistinguible de la de
      // prismas sueltos. En acento, además, se distingue del rojo de los
      // prismas sin necesidad de la malla de aristas, que a 26×26 llenaba de
      // ruido la parte plana de fuera de R.
      if (view === "superficie" || view === "ambas") {
        var doble = view === "ambas";
        F.surface(layer, dens,
          { xs: { from: 0, to: 1, n: SN }, ys: { from: 0, to: 1, n: SN } }, proj, {
            fillLow: cLow, fillHigh: doble ? cAcc : cHigh,
            stroke: doble ? false : cEdge,
            strokeWidth: 0.3,
            cx: cx - proj.project(0.5, 0.5, 0)[0], cy: cy - proj.project(0.5, 0.5, 0)[1],
            zScale: ZS, opacity: doble ? 0.6 : null
          });
      }

      // Reencuadre fino: los rótulos de texto no entran en el cálculo
      // analítico, así que se mide el dibujo terminado y se lo recentra (y se
      // lo encoge sólo si de verdad no entra en el lienzo).
      var bb = null;
      try { bb = layer.getBBox(); } catch (e) { bb = null; }
      if (bb && bb.width > 1 && bb.height > 1) {
        var s = Math.min(1, (W - 8) / bb.width, (HB - 8) / bb.height);
        var tx = (W - bb.width * s) / 2 - bb.x * s;
        var ty = (HB - bb.height * s) / 2 - bb.y * s;
        layer.setAttribute("transform",
          "translate(" + F.fmt(tx, 2) + " " + F.fmt(ty, 2) + ") scale(" + F.fmt(s, 4) + ")");
      }

      F.text(hud, 10, H - 6, "peso = área de la celda dentro de R", {
        size: 11, fill: cTxt
      });

      out.set("cells", String(R.cells.length) + " de " + (n * n));
      out.set("sum", F.fmt(R.S, 5));
      out.set("exact", F.fmt(EXACT, 5));
      out.set("err", F.fmt(100 * Math.abs(R.S - EXACT) / EXACT, 2) + " %");
    }

    redraw();
  }, {
    titulo: "La masa como volumen bajo la superficie de densidad",
    title: "La masa como volumen bajo la superficie de densidad",
    page: "tecnica-integrales-dobles", kind: "interactive", unidad: "0"
  });

  // ============================================================
  //  3. Baricentro de la placa triangular (estática)
  // ============================================================

  A.registerFigure("u0-baricentro-placa-triangular", function (host, api) {
    var F = api.Fig;
    var W = 640, H = 340;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Densidad xy sobre el triángulo con el baricentro correcto y el publicado por el apunte"
    });

    var out = F.readouts(host, [
      { k: "masa", tex: "\\text{masa}=\\iint_R xy\\,dA" },
      { k: "xb", tex: "\\bar x" },
      { k: "dmax", label: "máximo de x·y en la clausura de R" }
    ]);

    F.legend(host, [
      { label: "baricentro correcto (2/5, 2/5)", color: F.status("good"), fill: true },
      { label: "baricentro publicado por el apunte (1/5, 1/5)", color: F.status("bad"), fill: true }
    ]);

    var layer = F.el("g", null, svg);
    var sx = F.scale([0, 1.12], [66, 346]);
    var sy = F.scale([0, 1.12], [292, 26]);

    // Las lecturas se calculan por integración numérica sobre la misma
    // densidad que se dibuja: masa = ∫₀¹ x(1−x)²/2 dx, masa·x̄ = ∫₀¹ x²(1−x)²/2 dx.
    function integrate(f, a, b) {
      if (typeof M.integrate === "function") return M.integrate(f, a, b, 2000);
      var s = 0, n = 2000, h = (b - a) / n, i;
      for (i = 0; i < n; i++) s += f(a + (i + 0.5) * h) * h;
      return s;
    }
    var masa = integrate(function (x) { return x * (1 - x) * (1 - x) / 2; }, 0, 1);
    var numX = integrate(function (x) { return x * x * (1 - x) * (1 - x) / 2; }, 0, 1);
    var xbar = numX / masa;

    var cReg = F.color("plot-axis"), cGood = F.status("good"), cBad = F.status("bad");
    var cTxt = F.color("text-2"), cMut = F.color("text-3");
    var DMAX = 0.25;                    // máximo de xy sobre el triángulo, en (1/2, 1/2)

    F.axes(layer, {
      sx: sx, sy: sy,
      xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1], yTicks: [0, 0.2, 0.4, 0.6, 0.8, 1],
      xLabel: "x", yLabel: "y"
    });

    // Mapa de intensidad de d(x,y) = xy sobre el triángulo. Las celdas se
    // pintan enteras cuando su centro cae dentro de R, así que sin recorte la
    // escalera de color cruzaba la hipotenusa hasta media celda hacia afuera;
    // el grupo va recortado por el propio triángulo para que el sombreado no
    // se salga del recinto que la figura delimita con su trazo.
    var TRI = [[0, 0], [1, 0], [0, 1]].map(function (p) { return sx(p[0]) + "," + sy(p[1]); }).join(" ");
    var clipId = "u0-bari-clip-" + Math.random().toString(36).slice(2, 9);
    var defs = F.el("defs", null, svg);
    var cp = F.el("clipPath", { id: clipId, clipPathUnits: "userSpaceOnUse" }, defs);
    F.el("polygon", { points: TRI }, cp);
    var heat = F.el("g", { "clip-path": "url(#" + clipId + ")" }, layer);

    // Se pinta TODA celda que toque R (esquina inferior izquierda dentro) y el
    // recorte se encarga del borde: descartando las celdas cuyo centro cae
    // fuera quedaban muescas blancas contra la hipotenusa, el defecto simétrico
    // del desborde que se quería corregir.
    var NC = 38, w = 1 / NC, i, j;
    for (i = 0; i < NC; i++) {
      for (j = 0; j < NC; j++) {
        if (i * w + j * w >= 1) continue;
        var xc = Math.min((i + 0.5) * w, 1), yc = Math.min((j + 0.5) * w, 1);
        rect(F, heat, sx(i * w), sy(j * w), sx((i + 1) * w), sy((j + 1) * w), {
          fill: F.seq((xc * yc) / DMAX), rx: 0, opacity: 0.95
        });
      }
    }
    F.line(layer, [[0, 0], [1, 0], [0, 1], [0, 0]], {
      sx: sx, sy: sy, stroke: cReg, width: 2, serie: false
    });
    F.text(layer, sx(0.30), sy(0.86), "d(x, y) = x·y", { size: 12, fill: cTxt });
    F.text(layer, sx(0.30), sy(0.79), "nula sobre los dos ejes", { size: 11, fill: cMut });

    // los dos baricentros; las etiquetas caen sobre el mapa de intensidad, así
    // que llevan una placa de fondo para que el texto no pierda contraste
    function tagged(px, py, l1, l2, col) {
      rect(F, layer, px + 8, py - 20, px + 86, py + 18, {
        fill: F.color("surface"), opacity: 0.88, stroke: col, width: 1, rx: 3
      });
      F.marker(layer, px, py, { r: 6, fill: col, serie: false });
      F.label(layer, px + 13, py - 6, l1, { size: 12, mono: true, keyColor: col });
      F.text(layer, px + 13, py + 13, l2, { size: 11, fill: cMut });
    }
    tagged(sx(0.4), sy(0.4), "(2/5, 2/5)", "correcto", cGood);
    tagged(sx(0.2), sy(0.2), "(1/5, 1/5)", "del apunte", cBad);

    aux(F, layer, [[0, 0], [0.5, 0.5]], cMut, { sx: sx, sy: sy, dash: "3 4" });

    // escala de color
    var bx = 402, by0 = 250, by1 = 60, steps = 40;
    F.text(layer, bx, by1 - 18, "densidad", { size: 11, fill: cTxt });
    for (i = 0; i < steps; i++) {
      var t0 = i / steps;
      rect(F, layer, bx, by0 + (by1 - by0) * t0, bx + 16, by0 + (by1 - by0) * (t0 + 1 / steps), {
        fill: F.seq(t0), rx: 0
      });
    }
    rect(F, layer, bx, by1, bx + 16, by0, { stroke: F.color("border-2") || F.color("border"), width: 1 });
    F.text(layer, bx + 21, by0, "0", { size: 11, fill: cMut, baseline: "middle", mono: true });
    F.text(layer, bx + 21, by1, "0.25", { size: 11, fill: cMut, baseline: "middle", mono: true });

    // nota lateral (el razonamiento completo va al epígrafe de la figura)
    var tx = 452;
    F.text(layer, tx, 96, "Tras normalizar:", { size: 11.5, fill: cTxt });
    texAt(F, svg, "(\\E[X],\\,\\E[Y])", tx, 122, { size: 13 });

    out.set("masa", F.fmt(masa, 5) + "  (1/24 = " + F.fmt(1 / 24, 5) + ")");
    out.set("xb", F.fmt(xbar, 4) + "  (2/5 = 0.4)");
    out.set("dmax", F.fmt(DMAX, 3) + " en (1/2, 1/2)");
  }, {
    titulo: "Dónde cae el baricentro de la placa xy",
    title: "Dónde cae el baricentro de la placa xy",
    page: "tecnica-integrales-dobles", kind: "static", unidad: "0"
  });

  // ============================================================
  //  4. Alambre: masa acumulada y densidad
  // ============================================================

  A.registerFigure("u0-alambre-masa-acumulada-y-densidad", function (host, api) {
    var F = api.Fig;
    var W = 660;
    var ps = F.panels(host, 2, { w: W, heights: [188, 168], gap: 8 });
    var svgA = ps[0], svgB = ps[1];

    var ctl = F.controls(host, [
      { k: "alpha", label: "posición α", min: 0.08, max: 0.92, step: 0.01, value: 0.35, dec: 2 },
      { k: "dx", label: "ancho Δx", min: 0.02, max: 0.5, step: 0.01, value: 0.30, dec: 2 }
    ], function () { redraw(); });

    var tg = F.toggle(host, {
      k: "proba", label: "etiquetas probabilísticas (Fₓ, fₓ)", value: false
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "sec", label: "pendiente de la secante Δm/Δx" },
      { k: "der", label: "derivada exacta en α" },
      { k: "dif", label: "diferencia" }
    ]);

    F.legend(host, [
      { label: "masa acumulada m(x) = 3x² − 2x³", color: F.series(1) },
      { label: "secante entre α ± Δx/2", color: F.series(2), dash: true },
      { label: "densidad dm/dx = 6x(1 − x)", color: F.series(3) }
    ]);

    var lA = F.el("g", null, svgA);
    var lB = F.el("g", null, svgB);
    var sx = F.scale([0, 1], [72, 618]);
    var syA = F.scale([0, 1.08], [156, 44]);
    var syB = F.scale([0, 2.0], [130, 20]);

    function m(x) { return 3 * x * x - 2 * x * x * x; }
    function d(x) { return 6 * x * (1 - x); }

    function redraw() {
      while (lA.firstChild) lA.removeChild(lA.firstChild);
      while (lB.firstChild) lB.removeChild(lB.firstChild);
      clearTex(svgA);
      clearTex(svgB);

      var al = ctl.get("alpha");
      var h = ctl.get("dx") / 2;
      h = Math.min(h, al - 0.005, 1 - al - 0.005);
      // Cerca de los extremos del alambre el semiancho se recorta para que la
      // secante no se salga del dominio. El deslizador se reescribe con el Δx
      // efectivamente usado: si no, mostraba un valor que no era el del dibujo
      // ni el de la identidad −2·(Δx/2)² anotada en la lectura.
      if (Math.abs(2 * h - ctl.get("dx")) > 1e-9) ctl.set("dx", 2 * h);
      var x0 = al - h, x1 = al + h;
      var proba = tg.get();

      var cM = F.series(1), cSec = F.series(2), cD = F.series(3);
      var cTxt = F.color("text-2"), cMut = F.color("text-3");

      var labM = proba ? "Fₓ(x)" : "m(x)  [kg]";
      var labD = proba ? "fₓ(x)" : "dm/dx  [kg/m]";

      // ---- panel superior: masa acumulada ----
      F.axes(lA, {
        sx: sx, sy: syA,
        xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1], yTicks: [0, 0.5, 1],
        yLabel: labM
      });

      // el alambre, sombreado por densidad
      var NS = 70, i;
      for (i = 0; i < NS; i++) {
        var xa = i / NS, xb = (i + 1) / NS;
        rect(F, lA, sx(xa), 16, sx(xb), 30, {
          fill: F.seq(d((xa + xb) / 2) / 1.5), rx: 0
        });
      }
      rect(F, lA, sx(0), 16, sx(1), 30, { stroke: F.color("border-2") || F.color("border"), width: 1 });
      F.text(lA, sx(0), 11, proba ? "densidad" : "alambre", { size: 11, fill: cMut });

      F.curve(lA, m, sx, syA, { stroke: cM, width: 2, n: 200, serie: "m(x)" });

      // triángulo del cociente incremental
      var mA = m(x0), mB = m(x1);
      F.line(lA, [[sx(x0), syA(mA)], [sx(x1), syA(mA)], [sx(x1), syA(mB)]], {
        close: true, fill: cSec, opacity: 0.10, serie: false
      });
      // secante prolongada
      var slope = (mB - mA) / (x1 - x0);
      var ext = 0.10;
      F.line(lA, [
        [sx(x0 - ext), syA(mA - slope * ext)],
        [sx(x1 + ext), syA(mB + slope * ext)]
      ], { stroke: cSec, width: 2, dash: "6 4", serie: "secante" });
      F.marker(lA, sx(x0), syA(mA), { r: 4.6, fill: cSec, serie: false });
      F.marker(lA, sx(x1), syA(mB), { r: 4.6, fill: cSec, serie: false });
      F.label(lA, (sx(x0) + sx(x1)) / 2, syA(mA) - 5, "Δx = " + F.fmt(2 * h, 2), {
        size: 11, anchor: "middle", mono: true, keyColor: cSec
      });
      F.label(lA, sx(x1) + 6, (syA(mA) + syA(mB)) / 2, "Δm = " + F.fmt(mB - mA, 3), {
        size: 11, baseline: "middle", mono: true, keyColor: cSec
      });
      F.vline(lA, sx(al), {
        y0: syA(0), y1: syA(1.06), stroke: cMut,
        label: "α = " + F.fmt(al, 2), labelAt: syA(1.06) + 10, key: false
      });

      // ---- panel inferior: densidad ----
      F.axes(lB, {
        sx: sx, sy: syB,
        xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1], yTicks: [0, 0.5, 1, 1.5, 2],
        xLabel: "x  [m]", yLabel: labD
      });
      // Franja cuya área vale Δm: lavado plano en la opacidad de banda del
      // motor (la misma que la muestra de la leyenda). Sin rayado: la textura
      // es canal secundario y aquí el color ya distingue la franja.
      F.area(lB, d, sx, syB, { from: x0, to: x1, fill: cSec, band: true, serie: false });
      F.curve(lB, d, sx, syB, { stroke: cD, width: 2, n: 200, serie: "densidad" });
      F.hline(lB, syB(slope), {
        x0: sx(0), x1: sx(1), stroke: cSec,
        label: "pendiente = " + F.fmt(slope, 3), labelAt: sx(0.02), keyColor: cSec
      });
      F.marker(lB, sx(al), syB(d(al)), { r: 4.6, fill: cD, serie: false });
      F.label(lB, sx(al) + 8, syB(d(al)) - 10, "d(α) = " + F.fmt(d(al), 3), {
        size: 11, mono: true, keyColor: cD
      });
      F.vline(lB, sx(al), { y0: syB(0), y1: syB(d(al)), stroke: cMut });

      out.set("sec", F.fmt(slope, 5));
      out.set("der", F.fmt(d(al), 5));
      out.set("dif", F.fmt(slope - d(al), 5) + "  (= −2·(Δx/2)²)");
      void cTxt;
    }

    redraw();
  }, {
    titulo: "Del alambre acumulado a la densidad",
    title: "Del alambre acumulado a la densidad",
    page: "tecnica-derivadas-parciales", kind: "interactive", unidad: "0"
  });

  // ============================================================
  //  5. Derivada cruzada: los cuatro vértices con signos +,−,+,−
  // ============================================================

  A.registerFigure("u0-derivada-cruzada-cuatro-vertices", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 360;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Inclusión y exclusión de los cuatro cuadrantes acumulados alrededor de (α, β)"
    });

    var ctl = F.controls(host, [
      { k: "alpha", label: "α", min: 0.5, max: 1.7, step: 0.05, value: 1.1, dec: 2 },
      { k: "beta", label: "β", min: 0.5, max: 1.7, step: 0.05, value: 1.0, dec: 2 },
      { k: "dx", label: "Δx", min: 0.05, max: 1.0, step: 0.05, value: 0.60, dec: 2 },
      { k: "dy", label: "Δy", min: 0.05, max: 1.0, step: 0.05, value: 0.60, dec: 2 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "q", tex: "\\dfrac{\\Delta m}{\\Delta x\\,\\Delta y}" },
      { k: "d", tex: "d(\\alpha,\\beta)=6\\alpha\\beta^2" },
      { k: "e", label: "diferencia" }
    ]);

    var paso = api.state.paso == null ? 4 : api.state.paso;
    F.buttons(host, [
      { label: "Término siguiente", onClick: function () { paso = paso >= 4 ? 0 : paso + 1; api.state.paso = paso; redraw(); } },
      { label: "Ver los cuatro", onClick: function () { paso = 4; api.state.paso = paso; redraw(); } },
      { label: "Reiniciar", onClick: function () { paso = 0; api.state.paso = paso; redraw(); } }
    ]);

    // Signo del término: par divergente (+ cálido / − frío). No son estados,
    // son los dos extremos de una magnitud con signo.
    F.legend(host, [
      { label: "cuadrante que se suma (+)", color: F.div(1), fill: true },
      { label: "cuadrante que se resta (−)", color: F.div(-1), fill: true },
      { label: "rectángulo Δx · Δy que sobrevive", color: F.series(1), fill: true }
    ]);

    var layer = F.el("g", null, svg);
    var sx = F.scale([0, 2.3], [66, 366]);
    var sy = F.scale([0, 2.3], [296, 26]);

    function m(x, y) { return x * x * y * y * y; }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      clearTex(svg);

      var al = ctl.get("alpha"), be = ctl.get("beta");
      var h = Math.min(ctl.get("dx") / 2, al - 0.05);
      var k = Math.min(ctl.get("dy") / 2, be - 0.05);
      // Mismo recorte y misma corrección que en la figura del alambre: los
      // deslizadores quedan en el Δx y el Δy que de verdad se usan, de modo
      // que la identidad 2α·(Δy/2)² de la lectura sea comprobable.
      if (Math.abs(2 * h - ctl.get("dx")) > 1e-9) ctl.set("dx", 2 * h);
      if (Math.abs(2 * k - ctl.get("dy")) > 1e-9) ctl.set("dy", 2 * k);

      var cGood = F.div(1), cBad = F.div(-1), cAcc = F.series(1);
      var cTxt = F.color("text-2"), cMut = F.color("text-3");

      F.axes(layer, {
        sx: sx, sy: sy,
        xTicks: [0, 0.5, 1, 1.5, 2], yTicks: [0, 0.5, 1, 1.5, 2],
        xLabel: "x", yLabel: "y"
      });

      var terms = [
        { s: +1, x: al + h, y: be + k, lab: "+ m(α+Δx/2, β+Δy/2)" },
        { s: -1, x: al + h, y: be - k, lab: "− m(α+Δx/2, β−Δy/2)" },
        { s: +1, x: al - h, y: be - k, lab: "+ m(α−Δx/2, β−Δy/2)" },
        { s: -1, x: al - h, y: be + k, lab: "− m(α−Δx/2, β+Δy/2)" }
      ];

      // Los cuatro cuadrantes arrancan todos en el origen y se superponen casi
      // por completo: rellenándolos a la vez, el verde del término que se suma
      // y el rojo del que se resta se mezclaban en una única mancha parda y el
      // código de color de la leyenda no se podía leer. Ahora el relleno lo
      // lleva SÓLO el término recién agregado; los anteriores quedan como
      // contorno punteado de su color, y cada vértice lleva una ficha maciza
      // con el signo, que es donde el color se lee sin ambigüedad.
      var nOn = Math.min(paso, 4);
      var t;
      for (t = 0; t < nOn; t++) {
        var q = terms[t];
        var col = q.s > 0 ? cGood : cBad;
        // El relleno lo lleva el término que se acaba de agregar. En el estado
        // final (los cuatro) ninguno va relleno: así el único bloque de color
        // macizo es el rectángulo Δx·Δy que sobrevive, que es el resultado.
        var last = t === nOn - 1 && paso < 4;
        rect(F, layer, sx(0), sy(0), sx(q.x), sy(q.y), {
          fill: last ? col : "none",
          fillOpacity: last ? 0.22 : null,
          stroke: col, width: last ? 2 : 1.4, dash: last ? null : "5 3", rx: 0
        });
        F.marker(layer, sx(q.x), sy(q.y), { r: 4.6, fill: col, serie: "vértices" });
        // Ficha del signo: fondo de la superficie con borde del color del
        // término, para que el signo se lea en el color de texto del tema.
        var chx = sx(q.x) + 13, chy = sy(q.y) - 13;
        rect(F, layer, chx - 9, chy - 9, chx + 9, chy + 9, {
          fill: F.color("surface"), rx: 4, stroke: col, width: 1.6
        });
        F.text(layer, chx, chy + 1, q.s > 0 ? "+" : "−", {
          size: 14, fill: F.color("text"), weight: 700,
          anchor: "middle", baseline: "middle"
        });
      }

      // el rectángulo que sobrevive
      if (paso >= 4) {
        rect(F, layer, sx(al - h), sy(be - k), sx(al + h), sy(be + k), {
          fill: cAcc, opacity: 0.34, stroke: cAcc, width: 1.8, rx: 0
        });
      } else {
        rect(F, layer, sx(al - h), sy(be - k), sx(al + h), sy(be + k), {
          stroke: cMut, width: 1, dash: "2 3", rx: 0
        });
      }
      F.marker(layer, sx(al), sy(be), { r: 4.6, fill: cAcc, serie: "(α, β)" });
      // arriba y a la izquierda del punto: a la derecha chocaba con la ficha
      // del vértice (α+Δx/2, β−Δy/2)
      F.label(layer, sx(al) - 7, sy(be) - 18, "(α, β)", {
        size: 11.5, mono: true, anchor: "end", keyColor: cAcc
      });

      // guías de los lados del rectángulo
      F.text(layer, (sx(al - h) + sx(al + h)) / 2, sy(be - k) + 16, "Δx", {
        size: 11, anchor: "middle", fill: cMut, mono: true
      });
      F.text(layer, sx(al - h) - 8, (sy(be - k) + sy(be + k)) / 2, "Δy", {
        size: 11, anchor: "end", fill: cMut, mono: true, baseline: "middle"
      });

      // panel derecho
      var X0 = 402;
      F.text(layer, X0, 48, "Masa acumulada del cuadrante", { size: 12, fill: cTxt, weight: 600 });
      texAt(F, svg, "m(x,y)=x^2y^3", X0, 76, { size: 13 });
      F.text(layer, X0, 104, "acumulada en {X ≤ x, Y ≤ y}", { size: 11, fill: cMut });

      F.text(layer, X0, 132, "Términos (" + Math.min(paso, 4) + " de 4)", { size: 12, fill: cTxt, weight: 600 });
      var yy = 156;
      terms.forEach(function (q, idx) {
        var on = idx < paso;
        F.label(layer, X0, yy, q.lab, {
          size: 11.5, mono: true,
          fill: on ? F.color("text-2") : cMut,
          keyColor: on ? (q.s > 0 ? cGood : cBad) : null
        });
        yy += 19;
      });

      F.text(layer, X0, 248, paso >= 4
        ? "Sobrevive sólo el rectángulo Δx·Δy."
        : "Pulse «Término siguiente».", { size: 11.5, fill: cMut });

      // números: el cociente centrado es exacto para m = x²y³
      var dm = m(al + h, be + k) - m(al + h, be - k) + m(al - h, be - k) - m(al - h, be + k);
      var quot = dm / (4 * h * k);
      var exact = 6 * al * be * be;
      out.set("q", F.fmt(quot, 4));
      out.set("d", F.fmt(exact, 4));
      out.set("e", F.fmt(quot - exact, 4) + "  (= 2α·(Δy/2)²)");
    }

    redraw();
  }, {
    titulo: "Los cuatro cuadrantes acumulados y los signos +,−,+,−",
    title: "Los cuatro cuadrantes acumulados y los signos +,−,+,−",
    page: "tecnica-derivadas-parciales", kind: "interactive", unidad: "0"
  });

  // ============================================================
  //  6. Clairaut: los dos caminos de derivación (estática)
  // ============================================================

  A.registerFigure("u0-clairaut-dos-caminos", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 300;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Cuadro conmutativo de las derivadas cruzadas de m(x,y) = x²y³"
    });

    var layer = F.el("g", null, svg);
    var cBox = F.color("surface-2");
    var cPri = F.series(1), cAcc = F.series(2), cGood = F.series(3);
    var cTxt = F.color("text-2"), cMut = F.color("text-3");

    var BW = 176, BH = 46;
    var boxes = [
      { cx: 132, cy: 76, tex: "m(x,y)=x^2y^3", col: cPri },
      { cx: 500, cy: 76, tex: "\\dfrac{\\partial m}{\\partial x}=2xy^3", col: cAcc },
      { cx: 132, cy: 214, tex: "\\dfrac{\\partial m}{\\partial y}=3x^2y^2", col: cAcc },
      { cx: 500, cy: 214, tex: "6xy^2", col: cGood }
    ];

    boxes.forEach(function (b) {
      rect(F, layer, b.cx - BW / 2, b.cy - BH / 2, b.cx + BW / 2, b.cy + BH / 2, {
        fill: cBox, stroke: b.col, width: b.col === cGood ? 2 : 1.3, rx: 6
      });
      texAt(F, svg, b.tex, b.cx, b.cy, { anchor: "middle", size: 13.5 });
    });

    // flechas horizontales (derivar en x) y verticales (derivar en y)
    arrow(F, layer, 132 + BW / 2 + 8, 76, 500 - BW / 2 - 8, 76, cAcc);
    arrow(F, layer, 132 + BW / 2 + 8, 214, 500 - BW / 2 - 8, 214, cAcc);
    arrow(F, layer, 132, 76 + BH / 2 + 8, 132, 214 - BH / 2 - 8, cAcc);
    arrow(F, layer, 500, 76 + BH / 2 + 8, 500, 214 - BH / 2 - 8, cAcc);

    F.label(layer, 316, 66, "∂ / ∂x", { size: 12.5, anchor: "middle", keyColor: cAcc });
    F.label(layer, 316, 204, "∂ / ∂x", { size: 12.5, anchor: "middle", keyColor: cAcc });
    F.label(layer, 124, 145, "∂ / ∂y", { size: 12.5, anchor: "end", keyColor: cAcc });
    F.label(layer, 508, 145, "∂ / ∂y", { size: 12.5, anchor: "start", keyColor: cAcc });

    F.text(layer, 316, 129, "los dos caminos", { size: 12, anchor: "middle", fill: cMut });
    F.text(layer, 316, 148, "llegan al mismo", { size: 12, anchor: "middle", fill: cMut });
    F.text(layer, 316, 167, "resultado", { size: 12, anchor: "middle", fill: cMut });

    texAt(F, svg,
      "\\dfrac{\\partial^2 m}{\\partial x\\,\\partial y}=" +
      "\\dfrac{\\partial^2 m}{\\partial y\\,\\partial x}",
      500, 214 + BH / 2 + 30, { anchor: "middle", size: 14 });
    void cTxt;

  }, {
    titulo: "Los dos caminos de derivación llegan al mismo lugar",
    title: "Los dos caminos de derivación llegan al mismo lugar",
    page: "tecnica-derivadas-parciales", kind: "static", unidad: "0"
  });

  // ============================================================
  //  7. Cola convergente frente a cola divergente
  // ============================================================

  A.registerFigure("u0-cola-convergente-vs-divergente", function (host, api) {
    var F = api.Fig;
    var W = 660;
    var ps = F.panels(host, 2, { w: W, heights: [212, 176], gap: 8 });
    var svgA = ps[0], svgB = ps[1];

    var ctl = F.controls(host, [
      {
        k: "t", label: "extremo t", min: 1.2, max: 10000, value: 20, log: true,
        fmt: function (v) { return v < 100 ? F.fmt(v, 1) : F.fmt(v, 0); }
      }
    ], function () { redraw(); });

    var tg2 = F.toggle(host, { k: "sq", label: "mostrar 1/x²", value: true }, function () { redraw(); });
    var tg1 = F.toggle(host, { k: "lin", label: "mostrar 1/x", value: true }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "t", label: "t" },
      { k: "a2", tex: "\\int_1^t x^{-2}dx = 1-\\tfrac1t" },
      { k: "a1", tex: "\\int_1^t x^{-1}dx = \\ln t" }
    ]);

    F.legend(host, [
      { label: "1/x² — converge a 1", color: F.series(1) },
      { label: "1/x — diverge", color: F.series(2), dash: true }
    ]);

    var lA = F.el("g", null, svgA);
    var lB = F.el("g", null, svgB);
    var TMAX = 10000;
    var sx = F.scale([1, TMAX], [76, 620], { log: true });
    var syA = F.scale([0, 1.06], [176, 44]);
    var syB = F.scale([0, 10], [136, 20]);

    function f2(x) { return 1 / (x * x); }
    function f1(x) { return 1 / x; }
    function A2(u) { return 1 - 1 / u; }
    function A1(u) { return Math.log(u); }

    function fillTo(layer, fn, t, col, opacity) {
      var pts = toPx(logPts(fn, 1, t, 200), sx, syA);
      pts.unshift([sx(1), syA(0)]);
      pts.push([sx(t), syA(0)]);
      F.path(layer, F.ptsToPath(pts, true), { fill: col, opacity: opacity });
    }

    function redraw() {
      while (lA.firstChild) lA.removeChild(lA.firstChild);
      while (lB.firstChild) lB.removeChild(lB.firstChild);

      var t = ctl.get("t");
      var showSq = tg2.get(), showLin = tg1.get();
      var cSq = F.series(1), cLin = F.series(2);
      var cRef = F.color("plot-axis");
      var cMut = F.color("text-3"), cTxt = F.color("text-2");

      // ---- panel A: los integrandos ----
      F.axes(lA, { sx: sx, sy: syA, yTicks: [0, 0.5, 1], yLabel: "f(x)" });
      if (showLin) {
        fillTo(lA, f1, t, cLin, 0.10);
        F.line(lA, toPx(logPts(f1, 1, TMAX, 260), sx, syA), {
          stroke: cLin, width: 2, dash: "6 4", serie: "1/x"
        });
      }
      if (showSq) {
        fillTo(lA, f2, t, cSq, 0.10);
        F.line(lA, toPx(logPts(f2, 1, TMAX, 260), sx, syA), {
          stroke: cSq, width: 2, serie: "1/x²"
        });
      }
      F.vline(lA, sx(t), {
        y0: syA(0), y1: syA(1.06), stroke: cRef,
        label: "t", labelAt: syA(0.98), key: false
      });
      F.text(lA, 76, 16, "tramo ya integrado: de 1 a t", { size: 11, fill: cMut });

      // ---- panel B: el área acumulada ----
      F.axes(lB, {
        sx: sx, sy: syB, yTicks: [0, 2, 4, 6, 8, 10],
        xLabel: "extremo superior t (escala log)",
        yLabel: "área acumulada"
      });
      F.hline(lB, syB(1), {
        x0: sx(1), x1: sx(TMAX), stroke: cSq,
        label: "techo en 1", labelAt: sx(1400), keyColor: cSq
      });
      if (showSq) {
        F.line(lB, toPx(logPts(A2, 1, TMAX, 260), sx, syB), {
          stroke: cSq, width: 2, serie: "área de 1/x²"
        });
        F.marker(lB, sx(t), syB(A2(t)), { r: 4.6, fill: cSq, serie: false });
      }
      if (showLin) {
        F.line(lB, toPx(logPts(A1, 1, TMAX, 260), sx, syB), {
          stroke: cLin, width: 2, dash: "6 4", serie: "área de 1/x"
        });
        F.marker(lB, sx(t), syB(Math.min(10, A1(t))), { r: 4.6, fill: cLin, serie: false });
      }
      F.vline(lB, sx(t), { y0: syB(0), y1: syB(10), stroke: cRef });
      // debajo de la curva: ln t sólo sube, así que a la derecha del anclaje
      // el trazo queda por encima del texto y no lo atraviesa.
      F.label(lB, sx(160), syB(A1(160) - 1.7), "ln t no tiene techo", {
        size: 11, keyColor: cLin
      });

      out.set("t", t < 100 ? F.fmt(t, 2) : F.fmt(t, 0));
      out.set("a2", F.fmt(A2(t), 5));
      out.set("a1", F.fmt(A1(t), 4));
      void cTxt;
    }

    redraw();
  }, {
    titulo: "1/x² converge, 1/x diverge: la misma cola infinita",
    title: "1/x² converge, 1/x diverge: la misma cola infinita",
    page: "tecnica-integrales-impropias", kind: "interactive", unidad: "0"
  });

  // ============================================================
  //  8. Tipo II: área finita bajo una asíntota vertical
  // ============================================================

  A.registerFigure("u0-singularidad-tipo-ii-area-finita", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 330;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Área entre t y 5 bajo 1/(2√(x−2)), con la singularidad en x = 2"
    });

    var ctl = F.controls(host, [
      {
        k: "u", label: "distancia a la singularidad, t − 2",
        min: 0.000001, max: 2.5, value: 0.5, log: true,
        fmt: function (v) { return v < 0.001 ? v.toExponential(1) : F.fmt(v, 3); }
      }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "t", label: "t" },
      { k: "h", tex: "f(t)=\\dfrac{1}{2\\sqrt{t-2}}" },
      { k: "a", tex: "\\int_t^5 f = \\sqrt3-\\sqrt{t-2}" }
    ]);

    F.legend(host, [
      { label: "f(x) = 1 / (2√(x − 2))", color: F.series(1) },
      { label: "área acumulada entre t y 5", color: F.series(2), fill: true }
    ]);

    var layer = F.el("g", null, svg);
    var YMAX = 3.2;
    var sx = F.scale([1.72, 5.25], [72, 566]);
    var sy = F.scale([0, YMAX], [270, 30]);
    var S3 = Math.sqrt(3);

    function f(x) { return x <= 2 ? Infinity : 1 / (2 * Math.sqrt(x - 2)); }
    function fClip(x) { return Math.min(f(x), YMAX); }
    function area(t) { return S3 - Math.sqrt(Math.max(0, t - 2)); }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var u = ctl.get("u");
      var t = 2 + u;
      var cF = F.series(1), cA = F.series(2);
      var cMut = F.color("text-3"), cTxt = F.color("text-2");

      F.axes(layer, {
        sx: sx, sy: sy,
        xTicks: [2, 3, 4, 5], yTicks: [0, 1, 2, 3],
        xLabel: "x", yLabel: "f(x)  (eje y recortado en 3.2)"
      });

      // asíntota; el rótulo va girado en el hueco entre el eje y la asíntota
      F.vline(layer, sx(2), { y0: sy(0), y1: sy(YMAX), stroke: F.color("plot-axis") });
      F.text(layer, sx(2) - 10, sy(1.5), "asíntota x = 2", {
        size: 11, anchor: "middle", fill: cMut, rotate: -90
      });

      // área entre t y 5
      F.area(layer, fClip, sx, sy, { from: t, to: 5, fill: cA, n: 400, serie: "área" });
      F.curve(layer, fClip, sx, sy, {
        from: 2.0000001, to: 5.15, stroke: cF, width: 2, n: 400, serie: "f(x)"
      });

      var ht = f(t), clipped = ht > YMAX;
      F.vline(layer, sx(t), { y0: sy(0), y1: sy(Math.min(ht, YMAX)), stroke: cA, dash: false });
      F.marker(layer, sx(t), sy(0), { r: 4.6, fill: cA, serie: false });
      // Con el eje y fijo, acercar t a 2 no cambiaba nada en el trazo: la
      // altura se recortaba en YMAX y el crecimiento sólo aparecía en la
      // lectura. Cuando f(t) se sale del recinto visible, la franja se remata
      // con una flecha hacia arriba y el valor real al lado, de modo que la
      // divergencia se vea en el dibujo y no sólo en el número.
      if (clipped) {
        arrow(F, layer, sx(t), sy(YMAX), sx(t), sy(YMAX) - 16, cA, { head: 8 });
        F.label(layer, sx(t) + 7, sy(YMAX) - 20, "f(t) = " + F.fmt(ht, ht > 100 ? 1 : 3), {
          size: 11, mono: true, keyColor: cA
        });
        F.text(layer, sx(t) + 7, sy(YMAX) - 6, "fuera de escala", { size: 11, fill: cMut });
      }
      F.label(layer, sx(t) + 6, sy(Math.min(ht, YMAX)) + (clipped ? 16 : -7),
        "t = " + (u < 0.001 ? "2 + " + u.toExponential(1) : F.fmt(t, 3)), {
          size: 11, mono: true, keyColor: cA
        });
      F.vline(layer, sx(5), { y0: sy(0), y1: sy(f(5)), stroke: cMut, dash: "3 3" });

      // barra del área acumulada, comparada con √3
      var bx = 596, by0 = 270, by1 = 30;
      var sB = F.scale([0, 2], [by0, by1]);
      rect(F, layer, bx, sB(0), bx + 18, sB(2), {
        fill: F.color("surface-2"), stroke: F.color("border-2") || F.color("border"), width: 1, rx: 2
      });
      var av = area(t);
      rect(F, layer, bx, sB(0), bx + 18, sB(av), { fill: cA, rx: 2 });
      aux(F, layer, [[bx - 4, sB(S3)], [bx + 22, sB(S3)]], cF);
      F.label(layer, bx + 9, sB(S3) - 8, "√3", { size: 11, anchor: "middle", mono: true, keyColor: cF });
      F.text(layer, bx + 9, by0 + 14, "área", { size: 11, anchor: "middle", fill: cMut });
      void cTxt;

      out.set("t", u < 0.001 ? "2 + " + u.toExponential(2) : F.fmt(t, 4));
      out.set("h", F.fmt(f(t), f(t) > 100 ? 1 : 4));
      out.set("a", F.fmt(av, 5));
    }

    redraw();
  }, {
    titulo: "Área finita bajo una asíntota vertical",
    title: "Área finita bajo una asíntota vertical",
    page: "tecnica-integrales-impropias", kind: "interactive", unidad: "0"
  });

})();
