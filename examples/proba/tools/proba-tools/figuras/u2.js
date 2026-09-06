/* ============================================================
   figuras/u2.js — figuras de la unidad 2 (probabilidad: axiomas,
   Laplace, condicional, independencia, probabilidad total y Bayes).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure y App.Fig)
   y de lib-math.js (window.M). Cada figura se registra con su id
   definitivo 'u2-…' y se monta desde el markdown del wiki con el bloque
   '> [!figura] <id>'.

   Figuras registradas aquí
     u2-dados-condicional-grilla     condicionar = achicar el universo
     u2-bayes-mosaico-area           Bayes como cociente de áreas
     u2-venn-inclusion-exclusion     P(A∪B) = P(A)+P(B)−P(A∩B)
     u2-independencia-rectangulo     independencia como rectángulo
     u2-arbol-bayes-invertido        el mismo árbol leído desde abajo
     u2-suma-dos-dados-no-equiprobable  Laplace pide equiprobabilidad en S
     u2-curva-cumpleanos             problema del cumpleaños
     u2-de-morgan-cuatro-paneles     De Morgan en cuatro diagramas (estática)
     u2-serie-paralelo-fiabilidad    serie vs. paralelo

   Convenciones internas
     · Los colores se leen SIEMPRE en tiempo de dibujo (F.color), nunca se
       guardan entre montajes: el remonte por cambio de tema los renueva.
     · Lo que no cambia (rejilla de 36 celdas, ejes fijos) se construye una
       sola vez y en cada interacción solo se actualizan atributos o se
       vacía la capa dinámica.
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || !A.registerFigure) return;
  var M = window.M || {};

  var uidc = 0;
  function uniqueId(p) { return p + (++uidc); }

  function clearNode(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ---- máscaras y recortes (regiones de un Venn) ------------------------
  // shapes: {t:"rect", x, y, w, h} | {t:"circle", x, y, r}
  function shapeInto(F, parent, s, fill) {
    if (s.t === "rect") F.el("rect", { x: s.x, y: s.y, width: s.w, height: s.h, fill: fill }, parent);
    else F.el("circle", { cx: s.x, cy: s.y, r: s.r, fill: fill }, parent);
  }
  function maskShape(F, svg, adds, subs) {
    var id = uniqueId("u2m");
    var m = F.el("mask", { id: id, maskUnits: "userSpaceOnUse" }, F.defs(svg));
    (adds || []).forEach(function (s) { shapeInto(F, m, s, "#fff"); });
    (subs || []).forEach(function (s) { shapeInto(F, m, s, "#000"); });
    return "url(#" + id + ")";
  }
  function clipShape(F, svg, s) {
    var id = uniqueId("u2c");
    var cp = F.el("clipPath", { id: id, clipPathUnits: "userSpaceOnUse" }, F.defs(svg));
    if (s.t === "rect") F.el("rect", { x: s.x, y: s.y, width: s.w, height: s.h }, cp);
    else F.el("circle", { cx: s.x, cy: s.y, r: s.r }, cp);
    return "url(#" + id + ")";
  }
  // Pinta una región descrita por (adds − subs), opcionalmente recortada.
  function paintRegion(F, svg, layer, box, o) {
    var g = F.el("g", o.clip ? { "clip-path": o.clip } : null, layer);
    F.el("rect", {
      x: box.x, y: box.y, width: box.w, height: box.h,
      fill: o.fill, opacity: o.opacity == null ? 1 : o.opacity,
      mask: maskShape(F, svg, o.adds, o.subs)
    }, g);
    return g;
  }

  // ---- rejilla 6×6 de dos dados ----------------------------------------
  // j = primer dado (fila), i = segundo dado (columna).
  function diceGrid(F, svg, o) {
    var cell = o.cell || 32, gap = o.gap == null ? 3 : o.gap;
    var x0 = o.x0, y0 = o.y0;
    var cTxt = F.color("text-3");
    var grid = F.grid(svg, {
      cols: 6, rows: 6, cell: cell, gap: gap, x0: x0, y0: y0,
      fill: F.color("surface-2"), stroke: F.color("border-2"), onCell: o.onCell
    });
    var i;
    for (i = 0; i < 6; i++) {
      F.text(svg, grid.x(i), y0 - 8, String(i + 1), {
        size: 11, anchor: "middle", baseline: "auto", fill: cTxt, mono: true
      });
      F.text(svg, x0 - 9, grid.y(i), String(i + 1), {
        size: 11, anchor: "end", baseline: "middle", fill: cTxt, mono: true
      });
    }
    F.text(svg, x0 + (6 * (cell + gap) - gap) / 2, y0 - 24, "segundo dado", {
      size: 11.5, anchor: "middle", fill: cTxt
    });
    F.text(svg, x0 - 26, y0 + (6 * (cell + gap) - gap) / 2, "primer dado", {
      size: 11.5, anchor: "middle", fill: cTxt, rotate: -90
    });
    return grid;
  }

  // Barra horizontal rotulada (comparaciones de dos probabilidades).
  function hbar(F, layer, o) {
    var w = Math.max(0, Math.min(1, o.p)) * o.len;
    F.el("rect", {
      x: o.x, y: o.y, width: o.len, height: o.h, rx: 3,
      fill: F.color("surface-2"), stroke: F.color("border-2"), "stroke-width": 1
    }, layer);
    if (w > 0.5) {
      F.el("rect", { x: o.x, y: o.y, width: w, height: o.h, rx: 3, fill: o.fill, opacity: o.opacity == null ? 1 : o.opacity }, layer);
    }
    F.text(layer, o.x, o.y - 6, o.label, { size: 11.5, fill: o.labelFill || F.color("text-2") });
    F.text(layer, o.x + o.len + 8, o.y + o.h / 2, o.value, {
      size: 11.5, baseline: "middle", fill: o.labelFill || F.color("text"), mono: true
    });
  }

  // ============================================================
  //  1 · u2-dados-condicional-grilla
  // ============================================================

  var EV = {
    sumaGE: { txt: function (k) { return "suma ≥ " + k; }, k: [2, 12], f: function (a, b, k) { return a + b >= k; } },
    sumaLE: { txt: function (k) { return "suma ≤ " + k; }, k: [2, 12], f: function (a, b, k) { return a + b <= k; } },
    sumaPar: { txt: function () { return "suma par"; }, f: function (a, b) { return (a + b) % 2 === 0; } },
    sumaImpar: { txt: function () { return "suma impar"; }, f: function (a, b) { return (a + b) % 2 === 1; } },
    d1LE: { txt: function (k) { return "primer dado ≤ " + k; }, k: [1, 6], f: function (a, b, k) { return a <= k; } },
    d2GE: { txt: function (k) { return "segundo dado ≥ " + k; }, k: [1, 6], f: function (a, b, k) { return b >= k; } },
    iguales: { txt: function () { return "los dos dados iguales"; }, f: function (a, b) { return a === b; } }
  };
  var EV_OPTS = [
    { v: "sumaGE", label: "suma ≥ k" },
    { v: "sumaLE", label: "suma ≤ k" },
    { v: "sumaPar", label: "suma par" },
    { v: "sumaImpar", label: "suma impar" },
    { v: "d1LE", label: "primer dado ≤ k" },
    { v: "d2GE", label: "segundo dado ≥ k" },
    { v: "iguales", label: "los dos dados iguales" }
  ];
  function evKey(kind, k) {
    var e = EV[kind];
    if (!e.k) return null;
    return clamp(Math.round(k), e.k[0], e.k[1]);
  }
  function evTest(kind, k) {
    var e = EV[kind], kk = evKey(kind, k);
    return function (a, b) { return !!e.f(a, b, kk); };
  }
  function evText(kind, k) { return EV[kind].txt(evKey(kind, k)); }

  A.registerFigure("u2-dados-condicional-grilla", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 300;
    var svg = F.svg(host, { w: W, h: H, title: "Grilla 6×6 de dos dados: condicionar achica el universo" });

    // El umbral k no significa lo mismo en todos los eventos: las sumas lo
    // recorren de 2 a 12, los eventos de un solo dado de 1 a 6 y tres eventos
    // ("suma par", "suma impar", "los dos dados iguales") no lo usan. Los
    // deslizadores se crean con la UNIÓN de los rangos y se recortan al rango
    // del evento elegido en cada cambio, de modo que el número del control sea
    // siempre el que dibuja la figura; cuando el evento no usa k, el deslizador
    // queda deshabilitado y su valor se lee "sin k" en lugar de un número inerte.
    var kinds = {
      kc: (api.state && api.state.evC) || "sumaGE",
      kd: (api.state && api.state.evD) || "sumaPar"
    };
    function kRange(key) { var e = EV[kinds[key]]; return e && e.k ? e.k : null; }
    function fmtK(key) {
      return function (v) {
        var r = kRange(key);
        // el espacio duro evita que la lectura del control se parta en dos líneas
        return r ? String(clamp(Math.round(v), r[0], r[1])) : "sin k";
      };
    }

    var ctl = F.controls(host, [
      { k: "kc", label: "umbral k del condicionante C", min: 1, max: 12, step: 1, value: 8, dec: 0, fmt: fmtK("kc") },
      { k: "kd", label: "umbral k del evento D", min: 1, max: 12, step: 1, value: 7, dec: 0, fmt: fmtK("kd") }
    ], function (k) { syncK(k); redraw(); });

    // Los dos <input type="range"> de la fila, en orden de creación (kc, kd):
    // hacen falta para deshabilitarlos cuando el evento no usa umbral.
    var kInputs = {};
    (function () {
      var ins = ctl.el ? ctl.el.querySelectorAll('input[type="range"]') : [];
      kInputs.kc = ins[0] || null;
      kInputs.kd = ins[1] || null;
    })();

    // Recorta el valor del control al rango del evento vigente y refresca su
    // etiqueta. ctl.set no dispara onChange, así que no hay recursión.
    function syncK(key) {
      if (key !== "kc" && key !== "kd") return;
      var r = kRange(key), v = ctl.get(key);
      ctl.set(key, r ? clamp(Math.round(v), r[0], r[1]) : Math.round(v));
      var inp = kInputs[key];
      if (inp) {
        inp.disabled = !r;
        if (inp.parentNode && inp.parentNode.style) inp.parentNode.style.opacity = r ? "" : "0.55";
      }
    }

    var selC = F.select(host, {
      k: "evC", label: "condicionante C", value: "sumaGE",
      options: EV_OPTS
    }, function () { kinds.kc = selC.get(); syncK("kc"); redraw(); });
    var selD = F.select(host, {
      k: "evD", label: "evento de interés D", value: "sumaPar",
      options: EV_OPTS
    }, function () { kinds.kd = selD.get(); syncK("kd"); redraw(); });
    var tg = F.toggle(host, { k: "restr", label: "restringir el universo a C", value: false }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "nc", tex: "|C|" },
      { k: "ncd", tex: "|C\\cap D|" },
      { k: "pd", tex: "P(D)" },
      { k: "pdc", tex: "P(D\\mid C)" },
      { k: "ind", label: "coinciden P(D|C) y P(D)" }
    ]);

    F.legend(host, [
      { label: "solo C", color: F.series(1), fill: true },
      { label: "solo D", color: F.series(2), fill: true },
      { label: "C ∩ D", color: F.series(3), fill: true }
    ]);

    var grid = diceGrid(F, svg, { x0: 58, y0: 56, cell: 32, gap: 3 });
    var layer = F.el("g", null, svg);

    function redraw() {
      clearNode(layer);
      var kindC = selC.get(), kindD = selD.get();
      var tC = evTest(kindC, ctl.get("kc")), tD = evTest(kindD, ctl.get("kd"));
      var restr = tg.get();
      var cSurf = F.color("surface-2"), cBord = F.color("border-2");
      var cC = F.series(1), cD = F.series(2), cCD = F.series(3);
      var nC = 0, nD = 0, nCD = 0, a, b;

      for (a = 1; a <= 6; a++) {
        for (b = 1; b <= 6; b++) {
          var inC = tC(a, b), inD = tD(a, b);
          if (inC) nC++;
          if (inD) nD++;
          if (inC && inD) nCD++;
          var fill = cSurf, op = 1, stroke = cBord, sw = 1;
          if (inC && inD) { fill = cCD; op = 0.55; }
          else if (inC) { fill = cC; op = 0.24; }
          else if (inD) { fill = cD; op = 0.34; }
          if (inC) { stroke = cC; sw = 2; }
          if (restr && !inC) { fill = cSurf; op = 0.16; stroke = cBord; sw = 1; }
          grid.set(b - 1, a - 1, {
            fill: fill, opacity: op, stroke: stroke, "stroke-width": sw
          });
        }
      }

      var pD = nD / 36, pDC = nC ? nCD / nC : NaN;
      var x = 320, cTxt = F.color("text-2"), cT3 = F.color("text-3");

      // El nombre del evento va en tinta de texto con una clave de color al
      // lado: el color sigue identificando la serie sin teñir la lectura.
      F.label(layer, x, 40, "C : " + evText(kindC, ctl.get("kc")), { size: 12.5, keyColor: cC, weight: 600 });
      F.label(layer, x, 58, "D : " + evText(kindD, ctl.get("kd")), { size: 12.5, keyColor: cD, weight: 600 });

      F.text(layer, x, 88, "denominador: " + (restr ? nC + " (solo C)" : "36 (todo S)"), {
        size: 11.5, fill: cT3
      });

      hbar(F, layer, {
        x: x, y: 112, len: 260, h: 16, p: pD, fill: cD,
        label: "P(D) = " + nD + "/36", value: F.fmt(pD, 4)
      });
      hbar(F, layer, {
        x: x, y: 168, len: 260, h: 16, p: isFinite(pDC) ? pDC : 0, fill: cCD,
        label: "P(D | C) = " + nCD + "/" + nC, value: isFinite(pDC) ? F.fmt(pDC, 4) : "—"
      });

      var mismo = isFinite(pDC) && Math.abs(pDC - pD) < 1e-12;
      // Veredicto: el color es ESTADO (coincide / no coincide) y va siempre
      // con su rótulo; la explicación larga vive en el epígrafe de la página.
      F.label(layer, x, 222, mismo ? "P(D | C) = P(D)" : "P(D | C) ≠ P(D)", {
        size: 12, weight: 600, keyColor: F.status(mismo ? "good" : "warn")
      });
      F.text(layer, x, 244, mismo ? "C y D son independientes" : "saber C cambia la chance de D", {
        size: 11.5, fill: cTxt
      });
      F.text(layer, x, 262, "36 casos → " + nC + " casos.", { size: 11.5, fill: cT3, mono: true });

      out.set("nc", String(nC));
      out.set("ncd", String(nCD));
      out.set("pd", nD + "/36 = " + F.fmt(pD, 4));
      out.set("pdc", nC ? nCD + "/" + nC + " = " + F.fmt(pDC, 4) : "indefinida");
      out.set("ind", mismo ? "sí (independientes)" : "no");
      host.__u2 = { nC: nC, nD: nD, nCD: nCD, pD: pD, pDC: pDC };
    }

    // El estado puede venir de un montaje anterior: los selects mandan.
    kinds.kc = selC.get();
    kinds.kd = selD.get();
    syncK("kc");
    syncK("kd");
    redraw();
  }, {
    title: "Condicionar es achicar el universo", titulo: "Condicionar es achicar el universo",
    page: "probabilidad-condicional", kind: "interactive", unidad: "2"
  });

  // ============================================================
  //  2 · u2-bayes-mosaico-area
  // ============================================================

  A.registerFigure("u2-bayes-mosaico-area", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 384;
    var svg = F.svg(host, { w: W, h: H, title: "Mosaico de áreas: prior por verosimilitud y probabilidad a posteriori" });

    var ctl = F.controls(host, [
      { k: "pe", label: "P(E) — prevalencia", min: 0.005, max: 0.7, step: 0.005, value: 0.05, dec: 3 },
      { k: "se", label: "P(+|E) — sensibilidad", min: 0.01, max: 1, step: 0.005, value: 0.9, dec: 3 },
      { k: "sp", label: "P(−|Eᶜ) — especificidad", min: 0.01, max: 1, step: 0.005, value: 0.99, dec: 3 }
    ], function () { redraw(); });
    var tg = F.toggle(host, { k: "dos", label: "segundo test positivo", value: false }, function () { redraw(); });
    F.buttons(host, [
      { label: "test diagnóstico", title: "P(E)=0.05, P(+|E)=0.9, P(−|Eᶜ)=0.99", onClick: function () { set(0.05, 0.9, 0.99); } },
      { label: "daltónicos", title: "P(V)=0.47, P(D|V)=0.04, P(D|V̄)=0.02", onClick: function () { set(0.47, 0.04, 0.98); } }
    ]);
    function set(a, b, c) { ctl.set("pe", a); ctl.set("se", b); ctl.set("sp", c); redraw(); }

    var out = F.readouts(host, [
      { k: "pplus", tex: "P(+)" },
      { k: "post", tex: "P(E\\mid +)" },
      { k: "neg", tex: "P(E\\mid -)" },
      { k: "post2", tex: "P(E\\mid ++)" }
    ]);

    F.legend(host, [
      // Los tres primeros son ESTADO (acierto / falso positivo / falso negativo)
      // y llevan su rótulo; el cuarto usa un color neutro de fondo.
      { label: "verdaderos positivos", color: F.status("good"), fill: true },
      { label: "falsos positivos", color: F.status("bad"), fill: true },
      { label: "falsos negativos", color: F.status("warn"), fill: true },
      { label: "verdaderos negativos", color: F.color("u0"), fill: true }
    ]);

    var layer = F.el("g", null, svg);
    var X0 = 58, Y0 = 30, S = 246;

    function redraw() {
      clearNode(layer);
      var pe = ctl.get("pe"), se = ctl.get("se"), sp = ctl.get("sp");
      var vp = pe * se, fn = pe * (1 - se), fp = (1 - pe) * (1 - sp), vn = (1 - pe) * sp;
      var pPlus = vp + fp, pMinus = fn + vn;
      var post = pPlus > 0 ? vp / pPlus : NaN;
      var postNeg = pMinus > 0 ? fn / pMinus : NaN;
      var post2 = (post * se + (1 - post) * (1 - sp)) > 0
        ? post * se / (post * se + (1 - post) * (1 - sp)) : NaN;

      var cVP = F.status("good"), cFP = F.status("bad"), cFN = F.status("warn"), cVN = F.color("u0");
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");
      var wE = S * pe, wEc = S - wE;

      function rect(x, y, w, h, fill, op) {
        F.el("rect", {
          x: x, y: y, width: Math.max(0, w), height: Math.max(0, h),
          fill: fill, opacity: op, stroke: F.color("surface"), "stroke-width": 0.8
        }, layer);
      }
      rect(X0, Y0, wE, S * se, cVP, 0.72);
      rect(X0, Y0 + S * se, wE, S * (1 - se), cFN, 0.5);
      rect(X0 + wE, Y0, wEc, S * (1 - sp), cFP, 0.6);
      rect(X0 + wE, Y0 + S * (1 - sp), wEc, S * sp, cVN, 0.7);
      F.el("rect", {
        x: X0, y: Y0, width: S, height: S, fill: "none",
        stroke: F.color("plot-axis"), "stroke-width": 1.4
      }, layer);

      // rótulos del cuadrado
      F.text(layer, X0 + wE / 2, Y0 - 9, "E", { size: 12, anchor: "middle", fill: cTxt, weight: 600 });
      F.text(layer, X0 + wE + wEc / 2, Y0 - 9, "Eᶜ", { size: 12, anchor: "middle", fill: cTxt, weight: 600 });
      F.text(layer, X0 + S / 2, Y0 + S + 14, "ancho = P(E) y P(Eᶜ)", {
        size: 11, anchor: "middle", baseline: "hanging", fill: cT3
      });
      F.text(layer, X0 - 12, Y0 + S / 2, "alto = verosimilitud", {
        size: 11.5, anchor: "middle", fill: cT3, rotate: -90
      });

      // panel numérico
      var px = X0 + S + 34, py = Y0 + 6;
      var filas = [
        ["verdaderos positivos", "P(E)·P(+|E)", vp, cVP],
        ["falsos positivos", "P(Eᶜ)·P(+|Eᶜ)", fp, cFP],
        ["falsos negativos", "P(E)·P(−|E)", fn, cFN],
        ["verdaderos negativos", "P(Eᶜ)·P(−|Eᶜ)", vn, cVN]
      ];
      filas.forEach(function (r, i) {
        var y = py + i * 34;
        F.el("rect", { x: px, y: y - 9, width: 11, height: 11, rx: 2, fill: r[3], opacity: 0.72 }, layer);
        F.text(layer, px + 18, y, r[0], { size: 11.5, fill: cTxt, baseline: "middle" });
        F.text(layer, px + 18, y + 14, r[1] + " = " + F.fmt(r[2], 4), {
          size: 11, fill: cT3, baseline: "middle", mono: true
        });
      });
      F.text(layer, px, py + 4 * 34 + 6, "P(+) = " + F.fmt(pPlus, 4) + "   (probabilidad total)", {
        size: 11.5, fill: cTxt, baseline: "middle", mono: true
      });

      // franja de positivos reescalada a ancho completo
      var bx = X0, by = Y0 + S + 54, bl = W - X0 - 40, bh = 26;
      var wvp = pPlus > 0 ? bl * (vp / pPlus) : 0;
      F.text(layer, bx, by - 8, "los positivos, reescalados a ancho 1", {
        size: 11.5, fill: cT3
      });
      F.el("rect", { x: bx, y: by, width: bl, height: bh, rx: 3, fill: cFP, opacity: 0.55 }, layer);
      F.el("rect", { x: bx, y: by, width: wvp, height: bh, rx: 3, fill: cVP, opacity: 0.75 }, layer);
      F.el("rect", { x: bx, y: by, width: bl, height: bh, rx: 3, fill: "none", stroke: F.color("plot-axis"), "stroke-width": 1.2 }, layer);
      if (isFinite(post)) {
        F.text(layer, bx + 8, by + bh / 2, "P(E | +) = " + F.fmt(post, 4), {
          size: 12, baseline: "middle", fill: F.color("text"), mono: true, weight: 600
        });
        // el rótulo de la derecha solo entra si la franja roja es ancha
        if (bl - wvp > 160) {
          F.text(layer, bx + bl - 8, by + bh / 2, "P(Eᶜ | +) = " + F.fmt(1 - post, 4), {
            size: 12, baseline: "middle", anchor: "end", fill: F.color("text"), mono: true
          });
        }
      }

      if (tg.get() && isFinite(post2)) {
        // La franja ocupa todo el ancho útil, así que el rótulo va ADENTRO (como
        // el de P(E | +)): a la derecha se saldría del lienzo y quedaría cortado.
        var y2 = by + bh + 10, bh2 = 14;
        F.el("rect", { x: bx, y: y2, width: bl, height: bh2, rx: 3, fill: cFP, opacity: 0.4 }, layer);
        F.el("rect", { x: bx, y: y2, width: bl * post2, height: bh2, rx: 3, fill: cVP, opacity: 0.75 }, layer);
        F.text(layer, bx + 8, y2 + bh2 / 2, "P(E | ++) = " + F.fmt(post2, 4), {
          size: 11, baseline: "middle", fill: F.color("text"), mono: true, weight: 600
        });
      }

      out.set("pplus", F.fmt(pPlus, 4));
      out.set("post", F.fmt(post, 4));
      out.set("neg", F.fmt(postNeg, 5));
      out.set("post2", tg.get() ? F.fmt(post2, 4) : "—");
      host.__u2 = { vp: vp, fp: fp, fn: fn, vn: vn, pPlus: pPlus, post: post, post2: post2 };
    }

    redraw();
  }, {
    title: "Bayes como cociente de áreas", titulo: "Bayes como cociente de áreas",
    page: "probabilidad-total-y-bayes", kind: "interactive", unidad: "2"
  });

  // ============================================================
  //  3 · u2-venn-inclusion-exclusion
  // ============================================================

  function lensArea(d, r1, r2) {
    if (d >= r1 + r2) return 0;
    if (d <= Math.abs(r1 - r2)) { var rm = Math.min(r1, r2); return Math.PI * rm * rm; }
    var a = clamp((d * d + r1 * r1 - r2 * r2) / (2 * d * r1), -1, 1);
    var b = clamp((d * d + r2 * r2 - r1 * r1) / (2 * d * r2), -1, 1);
    var t = (-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2);
    return r1 * r1 * Math.acos(a) + r2 * r2 * Math.acos(b) - 0.5 * Math.sqrt(Math.max(0, t));
  }
  // distancia entre centros que produce exactamente el área de solape pedida
  function solveDist(target, r1, r2) {
    var lo = Math.abs(r1 - r2), hi = r1 + r2, i, mid;
    if (target >= lensArea(lo, r1, r2)) return lo;
    if (target <= 0) return hi;
    for (i = 0; i < 60; i++) {
      mid = (lo + hi) / 2;
      if (lensArea(mid, r1, r2) > target) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  A.registerFigure("u2-venn-inclusion-exclusion", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 366;
    var svg = F.svg(host, { w: W, h: H, title: "Diagrama de Venn con áreas proporcionales a las probabilidades" });

    var ctl = F.controls(host, [
      { k: "pa", label: "P(A)", min: 0.04, max: 0.39, step: 0.01, value: 0.3, dec: 2 },
      { k: "pb", label: "P(B)", min: 0.04, max: 0.39, step: 0.01, value: 0.25, dec: 2 },
      { k: "pi", label: "P(A∩B)", min: 0, max: 0.39, step: 0.01, value: 0.1, dec: 2 }
    ], function (k) { fix(k); redraw(); });
    var sel = F.select(host, {
      k: "reg", label: "resaltar", value: "inter",
      options: [
        { v: "inter", label: "A ∩ B (lo contado dos veces)" },
        { v: "amb", label: "A ∖ B" },
        { v: "bma", label: "B ∖ A" },
        { v: "union", label: "A ∪ B" },
        { v: "comp", label: "(A ∪ B)ᶜ" },
        { v: "none", label: "nada" }
      ]
    }, function () { redraw(); });
    F.buttons(host, [
      { label: "m.e. (solape 0)", onClick: function () { ctl.set("pi", 0); redraw(); } },
      { label: "A ⊆ B", onClick: function () {
        var a = Math.min(ctl.get("pa"), ctl.get("pb")), b = Math.max(ctl.get("pa"), ctl.get("pb"));
        ctl.set("pa", a); ctl.set("pb", b); ctl.set("pi", a); redraw();
      } }
    ]);

    var out = F.readouts(host, [
      { k: "suma", tex: "P(A)+P(B)" },
      { k: "inter", tex: "P(A\\cap B)" },
      { k: "union", tex: "P(A\\cup B)" },
      { k: "comp", tex: "P((A\\cup B)^c)" }
    ]);

    F.legend(host, [
      { label: "A", color: F.series(1), fill: true },
      { label: "B", color: F.series(2), fill: true },
      { label: "región resaltada", color: F.series(3), fill: true }
    ]);

    // el solape admisible: max(0, P(A)+P(B)−1) ≤ P(A∩B) ≤ min(P(A), P(B))
    function fix(k) {
      var pa = ctl.get("pa"), pb = ctl.get("pb"), pi = ctl.get("pi");
      var lo = Math.max(0, pa + pb - 1), hi = Math.min(pa, pb);
      if (k !== "pi" || pi > hi || pi < lo) {
        var v = clamp(pi, lo, hi);
        if (Math.abs(v - pi) > 1e-9) ctl.set("pi", v);
      }
    }

    var layer = F.el("g", null, svg);
    var BOX = { x: 62, y: 30, w: 560, h: 280 };
    var UNIT = BOX.w * BOX.h;   // área en píxeles que representa la probabilidad 1

    fix("pa");

    function redraw() {
      clearNode(layer);
      var pa = ctl.get("pa"), pb = ctl.get("pb"), pi = ctl.get("pi");
      var pu = pa + pb - pi;
      var cA = F.series(1), cB = F.series(2), cH = F.series(3);
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");

      var rA = Math.sqrt(pa * UNIT / Math.PI), rB = Math.sqrt(pb * UNIT / Math.PI);
      var d = solveDist(pi * UNIT, rA, rB);
      var cy = BOX.y + BOX.h / 2;
      var ext = d + rA + rB;
      var xA = BOX.x + (BOX.w - ext) / 2 + rA, xB = xA + d;
      var SA = { t: "circle", x: xA, y: cy, r: rA }, SB = { t: "circle", x: xB, y: cy, r: rB };
      var SBOX = { t: "rect", x: BOX.x, y: BOX.y, w: BOX.w, h: BOX.h };

      F.el("rect", {
        x: BOX.x, y: BOX.y, width: BOX.w, height: BOX.h, rx: 4,
        fill: F.color("surface-2"), stroke: F.color("plot-axis"), "stroke-width": 1.3
      }, layer);
      F.text(layer, BOX.x + 10, BOX.y + 16, "S  (área total = 1)", { size: 12, fill: cT3 });

      F.el("circle", { cx: xA, cy: cy, r: rA, fill: cA, opacity: 0.24, stroke: cA, "stroke-width": 2 }, layer);
      F.el("circle", { cx: xB, cy: cy, r: rB, fill: cB, opacity: 0.24, stroke: cB, "stroke-width": 2 }, layer);

      var reg = sel.get();
      if (reg === "inter") {
        // Un solo lavado plano: el color ya distingue la lente y el rayado
        // encima solo agregaba ruido a la región más pequeña del dibujo.
        paintRegion(F, svg, layer, BOX, { clip: clipShape(F, svg, SA), adds: [SB], fill: cH, opacity: 0.5 });
      } else if (reg === "amb") {
        paintRegion(F, svg, layer, BOX, { clip: clipShape(F, svg, SA), adds: [SBOX], subs: [SB], fill: cH, opacity: 0.42 });
      } else if (reg === "bma") {
        paintRegion(F, svg, layer, BOX, { clip: clipShape(F, svg, SB), adds: [SBOX], subs: [SA], fill: cH, opacity: 0.42 });
      } else if (reg === "union") {
        paintRegion(F, svg, layer, BOX, { adds: [SA, SB], fill: cH, opacity: 0.3 });
      } else if (reg === "comp") {
        paintRegion(F, svg, layer, BOX, { adds: [SBOX], subs: [SA, SB], fill: cH, opacity: 0.3 });
      }

      F.label(layer, xA - rA * 0.55, cy - rA * 0.55, "A", { size: 15, weight: 700, keyColor: cA });
      F.label(layer, xB + rB * 0.42, cy - rB * 0.55, "B", { size: 15, weight: 700, keyColor: cB });

      var y = BOX.y + BOX.h + 22;
      // Por qué el solape se cuenta dos veces se explica en el epígrafe; aquí
      // queda solo la cuenta.
      F.text(layer, BOX.x, y, "P(A) + P(B) = " + F.fmt(pa, 2) + " + " + F.fmt(pb, 2) + " = " + F.fmt(pa + pb, 2), {
        size: 12, fill: cTxt
      });
      F.text(layer, BOX.x, y + 20, "P(A ∪ B) = " + F.fmt(pa, 2) + " + " + F.fmt(pb, 2) + " − " + F.fmt(pi, 2) +
        " = " + F.fmt(pu, 2), { size: 12, fill: cTxt });
      F.text(layer, BOX.x + 300, y + 20, "P((A ∪ B)ᶜ) = 1 − " + F.fmt(pu, 2) + " = " + F.fmt(1 - pu, 2), {
        size: 12, fill: cTxt
      });

      out.set("suma", F.fmt(pa + pb, 3));
      out.set("inter", F.fmt(pi, 3));
      out.set("union", F.fmt(pu, 3));
      out.set("comp", F.fmt(1 - pu, 3));
      host.__u2 = {
        pa: pa, pb: pb, pi: pi, pu: pu, rA: rA, rB: rB, d: d,
        lens: lensArea(d, rA, rB) / UNIT, areaA: Math.PI * rA * rA / UNIT
      };
    }

    redraw();
  }, {
    title: "El área que se cuenta dos veces", titulo: "El área que se cuenta dos veces",
    page: "axiomas-de-probabilidad", kind: "interactive", unidad: "2"
  });

  // ============================================================
  //  4 · u2-independencia-rectangulo
  // ============================================================

  A.registerFigure("u2-independencia-rectangulo", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 300;
    var svg = F.svg(host, { w: W, h: H, title: "Independencia en la grilla de dos dados: la intersección es un rectángulo" });

    var ctl = F.controls(host, [
      { k: "a", label: "A : primer dado ≤ a", min: 1, max: 5, step: 1, value: 2, dec: 0 },
      { k: "b", label: "B : segundo dado ≥ b", min: 2, max: 6, step: 1, value: 5, dec: 0 }
    ], function () { redraw(); });
    var sel = F.select(host, {
      k: "tipoB", label: "definición de B", value: "col",
      options: [
        { v: "col", label: "columnas: segundo dado ≥ b" },
        { v: "diag8", label: "diagonal: suma ≥ 8" },
        { v: "diagPar", label: "diagonal: suma par" },
        { v: "me", label: "excluyente: primer dado > a" }
      ]
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "pa", tex: "P(A)" },
      { k: "pb", tex: "P(B)" },
      { k: "pab", tex: "P(A\\cap B)" },
      { k: "prod", tex: "P(A)\\,P(B)" },
      { k: "ver", label: "veredicto" }
    ]);

    F.legend(host, [
      { label: "A (bandas de filas)", color: F.series(1), fill: true },
      { label: "B", color: F.series(2), fill: true },
      { label: "A ∩ B", color: F.series(3), fill: true }
    ]);

    var grid = diceGrid(F, svg, { x0: 58, y0: 56, cell: 32, gap: 3 });
    var layer = F.el("g", null, svg);

    function redraw() {
      clearNode(layer);
      var a = Math.round(ctl.get("a")), b = Math.round(ctl.get("b")), tipo = sel.get();
      function inA(d1) { return d1 <= a; }
      function inB(d1, d2) {
        if (tipo === "col") return d2 >= b;
        if (tipo === "diag8") return d1 + d2 >= 8;
        if (tipo === "diagPar") return (d1 + d2) % 2 === 0;
        return d1 > a;
      }
      var cSurf = F.color("surface-2"), cBord = F.color("border-2");
      var cA = F.series(1), cB = F.series(2), cAB = F.series(3);
      var nA = 0, nB = 0, nAB = 0, d1, d2;
      for (d1 = 1; d1 <= 6; d1++) {
        for (d2 = 1; d2 <= 6; d2++) {
          var iA = inA(d1), iB = inB(d1, d2);
          if (iA) nA++;
          if (iB) nB++;
          if (iA && iB) nAB++;
          var fill = cSurf, op = 1, stroke = cBord, sw = 1;
          if (iA && iB) { fill = cAB; op = 0.6; stroke = cAB; sw = 1.8; }
          else if (iA) { fill = cA; op = 0.24; }
          else if (iB) { fill = cB; op = 0.3; }
          grid.set(d2 - 1, d1 - 1, { fill: fill, opacity: op, stroke: stroke, "stroke-width": sw });
        }
      }

      var pA = nA / 36, pB = nB / 36, pAB = nAB / 36, prod = pA * pB;
      var indep = Math.abs(pAB - prod) < 1e-12;
      var x = 320, cTxt = F.color("text-2"), cT3 = F.color("text-3");

      F.label(layer, x, 40, "A : primer dado ≤ " + a, { size: 12.5, keyColor: cA, weight: 600 });
      F.label(layer, x, 58, "B : " + (tipo === "col" ? "segundo dado ≥ " + b
        : tipo === "diag8" ? "suma ≥ 8"
          : tipo === "diagPar" ? "suma par" : "primer dado > " + a), {
        size: 12.5, keyColor: cB, weight: 600
      });
      F.text(layer, x, 80, tipo === "col"
        ? "A ∩ B : rectángulo de " + a + " × " + (7 - b)
        : tipo === "me" ? "A ∩ B = ∅ (m.e., no independencia)"
          : "A ∩ B : recorte diagonal", {
        size: 11.5, fill: cT3
      });

      var lm = Math.max(pAB, prod, 0.02);
      hbar(F, layer, {
        x: x, y: 116, len: 250, h: 16, p: pAB / lm * 0.92, fill: cAB,
        label: "P(A ∩ B) = " + nAB + "/36", value: F.fmt(pAB, 4)
      });
      hbar(F, layer, {
        x: x, y: 172, len: 250, h: 16, p: prod / lm * 0.92, fill: cA,
        label: "P(A)·P(B) = (" + nA + "/36)(" + nB + "/36)", value: F.fmt(prod, 4)
      });

      // Veredicto: punto de estado + rótulo, con el texto en tinta de texto.
      F.el("circle", { cx: x + 8, cy: 224, r: 7, fill: F.status(indep ? "good" : "warn") }, layer);
      F.text(layer, x + 22, 224, indep ? "independientes" : "no independientes", {
        size: 13, baseline: "middle", fill: F.color("text"), weight: 600
      });
      F.text(layer, x, 254, indep
        ? "misma fracción de B dentro de A"
        : "A cambia la fracción de B", { size: 11.5, fill: cTxt });

      out.set("pa", nA + "/36 = " + F.fmt(pA, 4));
      out.set("pb", nB + "/36 = " + F.fmt(pB, 4));
      out.set("pab", nAB + "/36 = " + F.fmt(pAB, 4));
      out.set("prod", F.fmt(prod, 4));
      out.set("ver", indep ? "independientes" : "no independientes");
      host.__u2 = { nA: nA, nB: nB, nAB: nAB, pA: pA, pB: pB, pAB: pAB, prod: prod, indep: indep };
    }

    redraw();
  }, {
    title: "Independencia es un rectángulo", titulo: "Independencia es un rectángulo",
    page: "independencia", kind: "interactive", unidad: "2"
  });

  // ============================================================
  //  5 · u2-arbol-bayes-invertido
  // ============================================================

  A.registerFigure("u2-arbol-bayes-invertido", function (host, api) {
    var F = api.Fig;
    // El alto deja dos bandas libres —arriba de la columna de hojas y debajo de
    // la rama inferior— para anotar las cuatro reglas del árbol sobre el dibujo.
    var W = 690, H = 348;
    var svg = F.svg(host, { w: W, h: H, title: "Árbol de dos niveles y el mismo árbol invertido, con las cuatro reglas anotadas" });

    var ctl = F.controls(host, [
      { k: "pv", label: "P(V) — primera rama", min: 0.01, max: 0.99, step: 0.01, value: 0.47, dec: 2 },
      { k: "dv", label: "P(D|V)", min: 0, max: 1, step: 0.005, value: 0.04, dec: 3 },
      { k: "dm", label: "P(D|M)", min: 0, max: 1, step: 0.005, value: 0.02, dec: 3 }
    ], function () { draw(); });
    var tg = F.toggle(host, { k: "inv", label: "invertir el árbol", value: false }, function () { draw(); });

    var out = F.readouts(host, [
      { k: "pd", tex: "P(D)" },
      { k: "pvd", tex: "P(V\\mid D)" },
      { k: "pvdc", tex: "P(V\\mid D^c)" },
      { k: "sum", label: "suma de las hojas" },
      { k: "hoja", label: "camino resaltado" }
    ]);

    F.legend(host, [
      { label: "rama V / M (sexo)", color: F.series(1) },
      { label: "rama D / Dᶜ (daltónico)", color: F.series(2) },
      { label: "camino resaltado", color: F.series(3) }
    ]);

    var layer = F.el("g", null, svg);
    var hits = F.el("g", null, svg);
    var sel = -1;
    var YS = [76, 154, 234, 312];
    var XL = 452;
    // Las zonas sensibles se crean UNA sola vez (sus posiciones son fijas): si
    // se recrearan en cada redibujo, quitar el nodo bajo el puntero dispararía
    // una cascada de entrar/salir en cada movimiento del ratón.
    YS.forEach(function (y, k) {
      var hr = F.el("rect", {
        x: XL - 24, y: y - 22, width: 250, height: 44,
        fill: "transparent", "pointer-events": "all"
      }, hits);
      hr.style.cursor = "pointer";
      function enter() { if (sel !== k) { sel = k; draw(); } }
      function leave() { if (sel === k) { sel = -1; draw(); } }
      hr.addEventListener("pointerenter", enter);
      hr.addEventListener("pointerleave", leave);
      api.cleanup(function () {
        hr.removeEventListener("pointerenter", enter);
        hr.removeEventListener("pointerleave", leave);
        sel = -1;
      });
    });

    function draw() {
      clearNode(layer);
      var pv = ctl.get("pv"), dv = ctl.get("dv"), dm = ctl.get("dm");
      var joint = [pv * dv, pv * (1 - dv), (1 - pv) * dm, (1 - pv) * (1 - dm)];  // VD, VDᶜ, MD, MDᶜ
      var pD = joint[0] + joint[2], pDc = joint[1] + joint[3];
      var pVD = pD > 0 ? joint[0] / pD : NaN, pVDc = pDc > 0 ? joint[1] / pDc : NaN;
      var inv = tg.get();

      var cA = F.series(1), cB = F.series(2), cH = F.series(3);
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");
      var x0 = 60, x1 = 244, x2 = XL, ys = YS;
      var yc = 194, y1a = 115, y1b = 273;

      // (nivel1, hoja, prob del camino, etiqueta de la 1ª arista, de la 2ª, rótulo)
      var lv1 = inv
        ? [{ n: "D", p: pD, c: cB }, { n: "Dᶜ", p: pDc, c: cB }]
        : [{ n: "V", p: pv, c: cA }, { n: "M", p: 1 - pv, c: cA }];
      var leaves = inv
        ? [
          { n: "V", j: joint[0], e: pVD, c: cA, txt: "D ∩ V" },
          { n: "M", j: joint[2], e: isFinite(pVD) ? 1 - pVD : NaN, c: cA, txt: "D ∩ M" },
          { n: "V", j: joint[1], e: pVDc, c: cA, txt: "Dᶜ ∩ V" },
          { n: "M", j: joint[3], e: isFinite(pVDc) ? 1 - pVDc : NaN, c: cA, txt: "Dᶜ ∩ M" }
        ]
        : [
          { n: "D", j: joint[0], e: dv, c: cB, txt: "V ∩ D" },
          { n: "Dᶜ", j: joint[1], e: 1 - dv, c: cB, txt: "V ∩ Dᶜ" },
          { n: "D", j: joint[2], e: dm, c: cB, txt: "M ∩ D" },
          { n: "Dᶜ", j: joint[3], e: 1 - dm, c: cB, txt: "M ∩ Dᶜ" }
        ];

      var nodes = [
        { id: "r", x: x0, y: yc, label: "S", fill: F.color("surface-2") },
        { id: "n0", x: x1, y: y1a, label: lv1[0].n, fill: F.color("surface-2") },
        { id: "n1", x: x1, y: y1b, label: lv1[1].n, fill: F.color("surface-2") }
      ];
      var edges = [];
      [0, 1].forEach(function (i) {
        // Grosor fijo de 2 px: la probabilidad la lleva el número de la arista,
        // no el ancho del trazo.
        edges.push({
          from: "r", to: "n" + i, label: F.fmt(lv1[i].p, 3), color: lv1[i].c,
          width: 2, labelFill: cTxt
        });
      });
      leaves.forEach(function (lf, k) {
        var parent = k < 2 ? "n0" : "n1";
        nodes.push({ id: "h" + k, x: x2, y: ys[k], label: lf.n, fill: F.color("surface-2") });
        edges.push({
          from: parent, to: "h" + k, label: F.fmt(lf.e, 3), color: lf.c,
          width: 2, labelFill: cTxt
        });
      });
      if (sel >= 0) {
        edges.forEach(function (e) {
          var hit = (e.to === "h" + sel) || (e.to === "n" + (sel < 2 ? 0 : 1) && e.from === "r");
          if (hit) { e.color = cH; }
        });
        nodes.forEach(function (n) {
          if (n.id === "h" + sel || n.id === "n" + (sel < 2 ? 0 : 1) || n.id === "r") n.stroke = cH;
        });
      }
      F.graph(layer, { nodes: nodes, edges: edges, r: 18 });

      // hojas: producto del camino
      leaves.forEach(function (lf, k) {
        var em = sel === k;
        F.text(layer, x2 + 28, ys[k] - 6, lf.txt, {
          size: 11.5, baseline: "middle", fill: em ? F.color("text") : cTxt, weight: em ? 600 : null
        });
        F.text(layer, x2 + 28, ys[k] + 9, F.fmt(lf.j, 4) + "  =  " + F.fmt(lv1[k < 2 ? 0 : 1].p, 4) + " · " + F.fmt(lf.e, 4), {
          size: 11, baseline: "middle", fill: cT3, mono: true
        });
      });

      // Un solo rótulo corto por árbol: qué llevan las aristas del segundo
      // nivel. Las cuatro reglas del árbol —y la observación de que las hojas
      // valen lo mismo al darlo vuelta— viven en el epígrafe de la página.
      F.text(layer, x0 - 6, 22, inv
        ? "aristas del 2.º nivel: a posteriori"
        : "aristas del 2.º nivel: verosimilitud", {
        size: 12, fill: cTxt
      });

      out.set("pd", F.fmt(pD, 4));
      out.set("pvd", F.fmt(pVD, 4));
      out.set("pvdc", F.fmt(pVDc, 4));
      out.set("sum", F.fmt(joint[0] + joint[1] + joint[2] + joint[3], 6));
      out.set("hoja", sel >= 0 ? leaves[sel].txt + " = " + F.fmt(leaves[sel].j, 4) : "—");
      host.__u2 = { joint: joint, pD: pD, pVD: pVD, pVDc: pVDc, inv: inv };
    }

    draw();
  }, {
    title: "El árbol dado vuelta", titulo: "El árbol dado vuelta",
    page: "arbol-de-probabilidades", kind: "interactive", unidad: "2"
  });

  // ============================================================
  //  6 · u2-suma-dos-dados-no-equiprobable
  // ============================================================

  A.registerFigure("u2-suma-dos-dados-no-equiprobable", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 330;
    var svg = F.svg(host, { w: W, h: H, title: "Los 36 resultados son equiprobables; las 11 sumas no" });

    var ctl = F.controls(host, [
      { k: "s", label: "suma objetivo", min: 2, max: 12, step: 1, value: 8, dec: 0 }
    ], function () { redraw(); });
    var tg = F.toggle(host, { k: "unif", label: "tratar las 11 sumas como equiprobables", value: false },
      function () { redraw(); });

    var out = F.readouts(host, [
      { k: "fav", label: "casos favorables" },
      { k: "p", tex: "P(\\text{suma}=s)" },
      { k: "mal", label: "si se creyera uniforme" }
    ]);

    F.legend(host, [
      { label: "casos por suma (sobre 36)", color: F.series(1), fill: true },
      { label: "suma elegida", color: F.series(2), fill: true },
      { label: "uniforme errónea 1/11", color: F.status("bad"), dash: true }
    ]);

    var grid = diceGrid(F, svg, {
      x0: 52, y0: 62, cell: 30, gap: 3,
      onCell: function (i, j) { ctl.set("s", (j + 1) + (i + 1)); redraw(); }
    });
    var layer = F.el("g", null, svg);

    var counts = [];
    (function () {
      var k;
      for (k = 0; k <= 12; k++) counts[k] = 0;
      for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) counts[a + b]++;
    })();

    function redraw() {
      clearNode(layer);
      var s = Math.round(ctl.get("s"));
      var cSurf = F.color("surface-2"), cBord = F.color("border-2");
      var cU = F.series(1), cSel = F.series(2), cBad = F.status("bad");
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");

      var d1, d2;
      for (d1 = 1; d1 <= 6; d1++) {
        for (d2 = 1; d2 <= 6; d2++) {
          var su = d1 + d2, on = su === s;
          grid.set(d2 - 1, d1 - 1, {
            fill: on ? cSel : F.mix(cSurf, cU, (counts[su] - 1) / 5 * 0.75),
            opacity: on ? 0.8 : 1,
            stroke: on ? cSel : cBord,
            "stroke-width": on ? 2.2 : 1
          });
        }
      }

      var sx = F.scale([1.4, 12.6], [318, 672]);
      var sy = F.scale([0, 6.6 / 36], [284, 54]);
      F.axes(layer, {
        sx: sx, sy: sy, xTicks: [2, 4, 6, 8, 10, 12], yTicks: 4, y0: 0,
        xLabel: "suma de los dos dados", yLabel: "probabilidad"
      });
      // Dos grupos de barras —el fondo y la suma elegida— en vez de uno con
      // opacidades: así la figura declara las DOS series que anuncia la leyenda
      // y la lectura al pasar el puntero las distingue.
      var base = [], marc = [], k;
      for (k = 2; k <= 12; k++) {
        (k === s ? marc : base).push({ x: k, y: counts[k] / 36 });
      }
      F.bars(layer, base, sx, sy, { width: 0.82, fill: cU, serie: "casos por suma" });
      F.bars(layer, marc, sx, sy, { width: 0.82, fill: cSel, serie: "suma elegida" });
      // Etiqueta directa SELECTIVA: la suma elegida y la más probable, no un
      // número sobre cada una de las once barras.
      [s, 7].forEach(function (v, i) {
        if (i === 1 && v === s) return;
        F.text(layer, sx(v), sy(counts[v] / 36) - 7, counts[v] + "/36", {
          size: 11, anchor: "middle", fill: cT3, mono: true
        });
      });
      if (tg.get()) {
        F.hline(layer, sy(1 / 11), {
          x0: sx(1.4), x1: sx(12.6), stroke: cBad, dash: "5 4",
          label: "1/11 ≈ 0.0909 (mal)", labelAt: sx(1.4) + 6
        });
      }

      F.text(layer, 318, 30, "las 36 celdas pesan 1/36 cada una", { size: 11.5, fill: cT3 });
      F.text(layer, 52, 280, "P(suma = " + s + ") = " + counts[s] + "/36 = " + F.fmt(counts[s] / 36, 4), {
        size: 11.5, fill: cTxt
      });
      F.text(layer, 52, 298, "Laplace va sobre las 36 celdas.", { size: 11.5, fill: cT3 });

      out.set("fav", counts[s] + " de 36");
      out.set("p", counts[s] + "/36 = " + F.fmt(counts[s] / 36, 4));
      out.set("mal", "1/11 = " + F.fmt(1 / 11, 4));
      host.__u2 = { s: s, fav: counts[s], p: counts[s] / 36, counts: counts.slice(2, 13) };
    }

    redraw();
  }, {
    title: "Equiprobable en S no es equiprobable en la suma",
    titulo: "Equiprobable en S no es equiprobable en la suma",
    page: "regla-de-laplace", kind: "interactive", unidad: "2"
  });

  // ============================================================
  //  7 · u2-curva-cumpleanos
  // ============================================================

  function birthdayP(n, d) {
    if (n < 2) return 0;
    if (n > d) return 1;
    var lg = 0, i;
    for (i = 0; i < n; i++) lg += Math.log(1 - i / d);
    return 1 - Math.exp(lg);
  }
  function birthdayMin(target, d, nmax) {
    var n;
    for (n = 2; n <= nmax; n++) if (birthdayP(n, d) >= target) return n;
    return NaN;
  }

  A.registerFigure("u2-curva-cumpleanos", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 350;
    var svg = F.svg(host, { w: W, h: H, title: "Probabilidad de al menos una coincidencia de cumpleaños según el tamaño del grupo" });

    var ctl = F.controls(host, [
      { k: "n", label: "n (personas)", min: 2, max: 80, step: 1, value: 23, dec: 0 },
      { k: "d", label: "d (días del año)", min: 20, max: 500, step: 1, value: 365, dec: 0 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "p", tex: "P(\\text{al menos 2 iguales})" },
      { k: "q", label: "complemento (todos distintos)" },
      { k: "pares", tex: "\\binom{n}{2}" },
      { k: "n50", label: "n mínimo con P ≥ 0.5" },
      { k: "n99", label: "n mínimo con P ≥ 0.99" }
    ]);

    F.legend(host, [
      { label: "P(al menos dos coinciden)", color: F.series(1) },
      { label: "umbral 0.5", color: F.series(2), dash: true },
      { label: "n elegido", color: F.series(3) }
    ]);

    var layer = F.el("g", null, svg);
    var NMAX = 80;

    function redraw() {
      clearNode(layer);
      var n = Math.round(ctl.get("n")), d = Math.round(ctl.get("d"));
      var cP = F.series(1), cA = F.series(2), cU = F.series(3);
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");

      var sx = F.scale([2, NMAX], [56, 462]);
      var sy = F.scale([0, 1], [278, 34]);
      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 8, yTicks: 5, y0: 0,
        xLabel: "n (personas en la reunión)", yLabel: "probabilidad"
      });

      var pts = [], k;
      for (k = 2; k <= NMAX; k++) pts.push([k, birthdayP(k, d)]);
      // Con las escalas puestas, la lectura al pasar el puntero devuelve n y
      // P(n) en unidades de dato y no en píxeles del lienzo.
      F.line(layer, pts, { sx: sx, sy: sy, stroke: cP, width: 2, serie: "P(al menos dos coinciden)" });

      var n50 = birthdayMin(0.5, d, NMAX), n99 = birthdayMin(0.99, d, NMAX);
      F.hline(layer, sy(0.5), { x0: sx(2), x1: sx(NMAX), stroke: cA, dash: "5 4", width: 1.4 });
      if (isFinite(n50)) {
        F.vline(layer, sx(n50), {
          y0: sy(0), y1: sy(birthdayP(n50, d)), stroke: cA, dash: "4 4", width: 1.4
        });
        F.label(layer, sx(n50) - 6, sy(0) - 8, "n = " + n50, { size: 11, anchor: "end", mono: true, keyColor: cA });
      }
      var pn = birthdayP(n, d);
      F.vline(layer, sx(n), { y0: sy(0), y1: sy(pn), stroke: cU, dash: "3 3", width: 1.4 });
      // El rótulo va aparte: el punto de clave que dibuja Fig.marker mide 3 px
      // y quedaría dentro del grupo .fig-marker, donde el mínimo son 4 px.
      F.marker(layer, sx(n), sy(pn), { r: 5, fill: cU, vx: n, vy: pn, serie: "n elegido" });
      F.label(layer, sx(n), sy(pn) - 12, F.fmt(pn, 4), { size: 11, anchor: "middle", mono: true, keyColor: cU });

      // tabla de referencia (se recalcula con d)
      var tx = 500, ty = 60;
      F.text(layer, tx, ty - 20, "n", { size: 11.5, fill: cT3, mono: true });
      F.text(layer, tx + 52, ty - 20, "P(n)", { size: 11.5, fill: cT3, mono: true });
      [10, 20, 23, 30, 41, 57, 70].forEach(function (v, i) {
        var y = ty + i * 21;
        var em = v === n;
        F.text(layer, tx, y, String(v), { size: 11.5, fill: em ? F.color("text") : cTxt, mono: true });
        F.text(layer, tx + 52, y, F.fmt(birthdayP(v, d), 4), {
          size: 11.5, fill: em ? F.color("text") : cTxt, mono: true, weight: em ? 600 : null
        });
      });
      F.text(layer, tx, ty + 7 * 21 + 8, "d = " + d + " días", { size: 11.5, fill: cT3 });
      F.text(layer, 56, H - 10, "cuentan los pares, no las personas", { size: 11.5, fill: cT3 });

      out.set("p", F.fmt(pn, 5));
      out.set("q", F.fmt(1 - pn, 5));
      out.set("pares", String(Math.round(M.comb ? M.comb(n, 2) : n * (n - 1) / 2)));
      out.set("n50", isFinite(n50) ? String(n50) : "> " + NMAX);
      out.set("n99", isFinite(n99) ? String(n99) : "> " + NMAX);
      host.__u2 = { n: n, d: d, p: pn, n50: n50, n99: n99 };
    }

    redraw();
  }, {
    title: "Curva del problema del cumpleaños", titulo: "Curva del problema del cumpleaños",
    page: "tecnica-conteo-combinatoria", kind: "interactive", unidad: "2"
  });

  // ============================================================
  //  8 · u2-de-morgan-cuatro-paneles  (estática)
  // ============================================================

  A.registerFigure("u2-de-morgan-cuatro-paneles", function (host, api) {
    var F = api.Fig;
    var W = 690, PH = 188;
    var svgs = F.panels(host, 2, { w: W, heights: [PH, PH], gap: 6 });

    var cH = F.series(3), cA = F.series(1), cB = F.series(2);
    var cTxt = F.color("text-2"), cT3 = F.color("text-3");

    // un mini-Venn con la región pedida sombreada
    function venn(svg, x, titulo, modo) {
      var box = { x: x, y: 54, w: 250, h: 112 };
      var SBOX = { t: "rect", x: box.x, y: box.y, w: box.w, h: box.h };
      var r = 44, cy = box.y + box.h / 2;
      var SA = { t: "circle", x: box.x + 92, y: cy, r: r };
      var SB = { t: "circle", x: box.x + 158, y: cy, r: r };
      var layer = F.el("g", null, svg);

      F.el("rect", {
        x: box.x, y: box.y, width: box.w, height: box.h, rx: 4,
        fill: F.color("surface-2"), stroke: F.color("plot-axis"), "stroke-width": 1.2
      }, layer);

      if (modo === "fuera") {
        // (A∪B)ᶜ  =  Aᶜ ∩ Bᶜ : todo lo que queda fuera de los dos círculos
        paintRegion(F, svg, layer, box, { adds: [SBOX], subs: [SA, SB], fill: cH, opacity: 0.5 });
      } else {
        // (A∩B)ᶜ  =  Aᶜ ∪ Bᶜ : todo salvo la lente central
        paintRegion(F, svg, layer, box, { adds: [SBOX], fill: cH, opacity: 0.5 });
        var hueco = F.el("g", { "clip-path": clipShape(F, svg, SA) }, layer);
        F.el("rect", {
          x: box.x, y: box.y, width: box.w, height: box.h,
          fill: F.color("surface-2"), mask: maskShape(F, svg, [SB])
        }, hueco);
      }

      F.el("circle", { cx: SA.x, cy: SA.y, r: r, fill: "none", stroke: cA, "stroke-width": 2 }, layer);
      F.el("circle", { cx: SB.x, cy: SB.y, r: r, fill: "none", stroke: cB, "stroke-width": 2 }, layer);
      F.label(layer, SA.x - 30, cy - 24, "A", { size: 13, weight: 700, keyColor: cA });
      F.label(layer, SB.x + 20, cy - 24, "B", { size: 13, weight: 700, keyColor: cB });
      F.text(layer, box.x + box.w / 2, box.y - 10, titulo, {
        size: 13, anchor: "middle", fill: cTxt, weight: 600
      });
      F.text(layer, box.x + 8, box.y + box.h - 8, "S", { size: 11.5, fill: cT3 });
      return box;
    }

    venn(svgs[0], 44, "(A ∪ B)ᶜ", "fuera");
    venn(svgs[0], 396, "Aᶜ ∩ Bᶜ", "fuera");
    F.text(svgs[0], 345, 110, "=", { size: 24, anchor: "middle", baseline: "middle", fill: F.color("text-3") });
    F.text(svgs[0], 44, 20, "Primera ley (negar una unión)", { size: 12, fill: cT3 });

    venn(svgs[1], 44, "(A ∩ B)ᶜ", "lente");
    venn(svgs[1], 396, "Aᶜ ∪ Bᶜ", "lente");
    F.text(svgs[1], 345, 110, "=", { size: 24, anchor: "middle", baseline: "middle", fill: F.color("text-3") });
    F.text(svgs[1], 44, 20, "Segunda ley (negar una intersección)", { size: 12, fill: cT3 });

    F.legend(host, [
      { label: "región sombreada", color: cH, fill: true },
      { label: "A", color: cA },
      { label: "B", color: cB }
    ]);
  }, {
    title: "De Morgan en cuatro paneles", titulo: "De Morgan en cuatro paneles",
    page: "leyes-de-de-morgan", kind: "static", unidad: "2"
  });

  // ============================================================
  //  9 · u2-serie-paralelo-fiabilidad
  // ============================================================

  var TOPOS = {
    mixta: { label: "mixta: dos ramas de dos (TP2 ej. 20)", n: 4 },
    serie4: { label: "los cuatro en serie", n: 4 },
    par4: { label: "los cuatro en paralelo", n: 4 }
  };
  function reliab(topo, p) {
    if (topo === "serie4") return Math.pow(p, 4);
    if (topo === "par4") return 1 - Math.pow(1 - p, 4);
    var rama = p * p;
    return 1 - Math.pow(1 - rama, 2);
  }
  function conduce(topo, abiertos) {
    function ok(i) { return !abiertos[i]; }
    if (topo === "serie4") return ok(0) && ok(1) && ok(2) && ok(3);
    if (topo === "par4") return ok(0) || ok(1) || ok(2) || ok(3);
    return (ok(0) && ok(1)) || (ok(2) && ok(3));
  }

  A.registerFigure("u2-serie-paralelo-fiabilidad", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 318;
    var svg = F.svg(host, { w: W, h: H, title: "Confiabilidad de un circuito de cuatro contactos en serie y en paralelo" });

    var ctl = F.controls(host, [
      { k: "q", label: "probabilidad de falla de cada contacto", min: 0.001, max: 0.3, log: true, value: 0.01,
        fmt: function (v) { return v < 0.01 ? v.toExponential(1) : F.fmt(v, 3); } }
    ], function () { redraw(); });
    var sel = F.select(host, {
      k: "topo", label: "topología", value: "mixta",
      options: [
        { v: "mixta", label: TOPOS.mixta.label },
        { v: "serie4", label: TOPOS.serie4.label },
        { v: "par4", label: TOPOS.par4.label }
      ]
    }, function () { redraw(); });
    F.buttons(host, [
      { label: "restablecer contactos", onClick: function () { api.state.abiertos = [0, 0, 0, 0]; redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "p", label: "cada contacto funciona con p" },
      { k: "rama", label: "una rama en serie" },
      { k: "r", label: "confiabilidad del circuito" },
      { k: "q9", label: "nueves de confiabilidad" },
      { k: "cond", label: "con los contactos abiertos" }
    ]);

    // Aquí el color es ESTADO, no identidad de serie: cerrado / forzado a
    // fallar / camino que conduce, y los tres llevan su rótulo en la leyenda.
    F.legend(host, [
      { label: "contacto cerrado (funciona)", color: F.status("good"), fill: true },
      { label: "contacto forzado a fallar", color: F.status("bad"), fill: true },
      { label: "camino que conduce", color: F.status("good") }
    ]);

    if (!api.state.abiertos) api.state.abiertos = [0, 0, 0, 0];
    var layer = F.el("g", null, svg);

    function redraw() {
      clearNode(layer);
      var q = ctl.get("q"), p = 1 - q, topo = sel.get();
      var ab = api.state.abiertos;
      var R = reliab(topo, p), rama = p * p;
      var cond = conduce(topo, ab);
      var cGood = F.status("good"), cBad = F.status("bad"), cAxis = F.color("plot-axis");
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");

      // posiciones de los cuatro contactos según la topología
      var yA = 74, yB = 134, ym = 104;
      var pos = topo === "serie4"
        ? [[176, ym], [280, ym], [384, ym], [488, ym]]
        : topo === "par4"
          ? [[330, 50], [330, 88], [330, 126], [330, 164]]
          : [[236, yA], [400, yA], [236, yB], [400, yB]];
      var xIn = 96, xOut = 606;

      // El cableado DIBUJA el circuito: no es una serie de datos, así que va
      // al grosor único de 2 px y no entra en la lectura al pasar el puntero.
      function wire(x1, y1, x2, y2, on) {
        F.line(layer, [[x1, y1], [x2, y2]], {
          stroke: on ? cGood : cAxis, width: 2, opacity: on ? 1 : 0.75, serie: false
        });
      }
      function contacto(i) {
        var x = pos[i][0], y = pos[i][1], abierto = !!ab[i];
        var g = F.el("g", null, layer);
        F.el("rect", {
          x: x - 22, y: y - 12, width: 44, height: 24, rx: 4,
          fill: abierto ? cBad : cGood, opacity: abierto ? 0.55 : 0.28,
          stroke: abierto ? cBad : cGood, "stroke-width": 1.6
        }, g);
        F.text(g, x, y, "ABCD".charAt(i), {
          size: 12.5, anchor: "middle", baseline: "middle", fill: F.color("text"), weight: 600
        });
        var hit = F.el("rect", {
          x: x - 24, y: y - 14, width: 48, height: 28, fill: "transparent", "pointer-events": "all"
        }, g);
        hit.style.cursor = "pointer";
        hit.addEventListener("click", function () {
          api.state.abiertos[i] = api.state.abiertos[i] ? 0 : 1;
          redraw();
        });
      }

      // cableado
      if (topo === "serie4") {
        for (var s = 0; s < 5; s++) {
          wire(s === 0 ? xIn : pos[s - 1][0] + 22, ym,
            s === 4 ? xOut : pos[s][0] - 22, ym, cond);
        }
      } else if (topo === "par4") {
        pos.forEach(function (p2, i) {
          wire(xIn, ym, xIn + 40, p2[1], cond && !ab[i]);
          wire(xIn + 40, p2[1], p2[0] - 22, p2[1], cond && !ab[i]);
          wire(p2[0] + 22, p2[1], xOut - 40, p2[1], cond && !ab[i]);
          wire(xOut - 40, p2[1], xOut, ym, cond && !ab[i]);
        });
      } else {
        [[0, 1, yA], [2, 3, yB]].forEach(function (r) {
          var vive = !ab[r[0]] && !ab[r[1]];
          wire(xIn, ym, xIn + 40, r[2], vive && cond);
          wire(xIn + 40, r[2], pos[r[0]][0] - 22, r[2], vive && cond);
          wire(pos[r[0]][0] + 22, r[2], pos[r[1]][0] - 22, r[2], vive && cond);
          wire(pos[r[1]][0] + 22, r[2], xOut - 40, r[2], vive && cond);
          wire(xOut - 40, r[2], xOut, ym, vive && cond);
        });
      }
      [0, 1, 2, 3].forEach(contacto);

      F.el("circle", { cx: xIn, cy: ym, r: 5, fill: cAxis }, layer);
      F.el("circle", { cx: xOut, cy: ym, r: 5, fill: cAxis }, layer);
      F.text(layer, xIn - 12, ym, "entrada", { size: 11.5, anchor: "end", baseline: "middle", fill: cT3 });
      F.text(layer, xOut + 12, ym, "salida", { size: 11.5, baseline: "middle", fill: cT3 });

      // Comparación de la probabilidad de FALLA en escala logarítmica: en
      // escala lineal las dos confiabilidades son casi 1 y no se distinguen.
      var bx = 96, bl = 380;
      var refs = topo === "mixta"
        ? [["una rama en serie falla con 1 − p²", 1 - rama], ["el circuito falla con (1 − p²)²", 1 - R]]
        : topo === "serie4"
          ? [["un contacto falla con q", q], ["los cuatro en serie fallan con 1 − p⁴", 1 - R]]
          : [["un contacto falla con q", q], ["los cuatro en paralelo fallan con q⁴", 1 - R]];
      function logPos(x) { return clamp((Math.log(x) / Math.LN10 + 6) / 6, 0, 1); }
      hbar(F, layer, { x: bx, y: 200, len: bl, h: 15, p: logPos(refs[0][1]), fill: F.series(1), label: refs[0][0], value: F.fmt(refs[0][1], 6) });
      hbar(F, layer, { x: bx, y: 244, len: bl, h: 15, p: logPos(refs[1][1]), fill: F.series(2), label: refs[1][0], value: F.fmt(refs[1][1], 6) });
      [-6, -5, -4, -3, -2, -1, 0].forEach(function (e) {
        var px = bx + logPos(Math.pow(10, e)) * bl;
        F.line(layer, [[px, 261], [px, 266]], { stroke: cAxis, width: 1, cls: "fig-ref", serie: false });
        F.text(layer, px, 269, e === 0 ? "1" : "1e" + e, {
          size: 11, anchor: "middle", baseline: "hanging", fill: cT3, mono: true
        });
      });
      F.text(layer, bx + bl + 8, 268, "escala logarítmica", { size: 11, baseline: "hanging", fill: cT3 });

      var nueves = R >= 1 ? Infinity : -Math.log(1 - R) / Math.LN10;
      // R y los nueves ya están en las lecturas: en el lienzo queda la fórmula.
      F.text(layer, bx, 300, topo === "serie4" ? "R = p⁴"
        : topo === "par4" ? "R = 1 − (1 − p)⁴" : "R = 1 − (1 − p²)²", {
        size: 12, fill: cTxt, mono: true
      });
      F.label(layer, bx, 30, cond ? "el circuito conduce" : "el circuito NO conduce", {
        size: 12, weight: 600, keyColor: F.status(cond ? "good" : "bad")
      });
      F.text(layer, bx, 176, "Haga clic en un contacto.", { size: 11.5, fill: cT3 });

      out.set("p", F.fmt(p, 6));
      out.set("rama", F.fmt(rama, 6));
      out.set("r", F.fmt(R, 6));
      out.set("q9", isFinite(nueves) ? F.fmt(nueves, 2) : "∞");
      out.set("cond", cond ? "conduce" : "no conduce");
      host.__u2 = { q: q, p: p, R: R, rama: rama, topo: topo, cond: cond };
    }

    redraw();
  }, {
    title: "Serie y paralelo: por qué duplicar la rama vale tanto",
    titulo: "Serie y paralelo: por qué duplicar la rama vale tanto",
    page: "independencia", kind: "interactive", unidad: "2"
  });

})();
