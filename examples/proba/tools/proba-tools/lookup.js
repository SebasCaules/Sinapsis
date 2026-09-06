/* [bundle proba-tools] Copia de `estudio/lookup.js` del baseline de Proba.
   Las diferencias con el original están marcadas con «[bundle]» y explicadas
   en ADAPTACIONES.md. Compat de datos: el runtime deja el JSON declarado en
   `manifest.data` en `App.STUDY`; el baseline lo leía del global
   `window.STUDY`. El shim mantiene vivos los dos nombres. */
var STUDY = window.STUDY || (window.App && window.App.STUDY) || {};

/* ============================================================
   lookup.js — Buscador rápido de valores (burbuja flotante).

   Un FAB fijo abajo a la derecha (#qlFab) abre un panel NO modal (#qlPanel)
   que resuelve, en los dos sentidos, las cinco distribuciones que la materia
   usa para tablas: Normal Φ, t de Student, χ², Binomial y Poisson.
   No modal a propósito: se puede seguir leyendo el enunciado detrás mientras
   se consulta un fractil. Por eso NO usa #scrim (cuyo click ya está atado a
   la paleta en core.js).

   Atajo: ⌘J / Ctrl+J (libre; core.js solo toma ⌘K, "/", "t" y Escape).
   Escape cierra el panel, pero solo si la paleta ⌘K no está abierta —
   mientras la paleta está abierta ella se queda con la tecla.

   Todo el HTML que se inyecta lo genera este módulo: los textos fijos son
   literales y cualquier dato variable pasa por A.escapeHtml (esc) o por los
   formateadores numéricos. No entra markup de ninguna fuente externa.

   API pública (window.App.quickLookup):
     open(opts?)   abre el panel; opts se pasa a set() antes de abrir
     close()       cierra y devuelve el foco a donde estaba
     toggle()      abre o cierra
     isOpen()      → boolean
     set(opts)     opts = {mode, dir, value, df, n, p, lam, mu, sigma}
                   mode: "norm" | "t" | "chi2" | "binom" | "pois"
                   dir:  "cdf" (valor → probabilidad) | "inv" (probabilidad → valor)
                   value: el campo principal del modo actual
                   df: grados de libertad (t, χ²) · n, p: binomial · lam: Poisson
                   mu, sigma: parámetros de la Normal
   El último estado queda en memoria del módulo (no se persiste en disco).
   ============================================================ */
(function () {
  "use strict";
  var A = window.App;
  if (!A) return;
  var M = window.M || {};
  // [bundle] `App.$` / `App.$$` no están en CompatApp (anotados para R4):
  // equivalentes locales con la misma semántica que los del baseline.
  var $ = typeof A.$ === "function" ? A.$ : function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = typeof A.$$ === "function" ? A.$$ : function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ---------------------------------------------------------------- estado
  var MODES = [
    { id: "norm", label: "Normal Φ" },
    { id: "t", label: "t" },
    { id: "chi2", label: "χ²" },
    { id: "binom", label: "Binomial" },
    { id: "pois", label: "Poisson" }
  ];
  var DIRS = [
    { id: "cdf", label: "valor → probabilidad" },
    { id: "inv", label: "probabilidad → valor" }
  ];
  var CHIPS = [0.90, 0.95, 0.975, 0.99];

  var st = {
    mode: "norm",
    dir: "cdf",
    mu: 0, sigma: 1,
    df: 10,
    n: 20, p: 0.4,
    lam: 4,
    vals: {
      norm: { cdf: 1.96, inv: 0.975 },
      t: { cdf: 2.2281, inv: 0.975 },
      chi2: { cdf: 18.307, inv: 0.95 },
      binom: { cdf: 8, inv: 0.95 },
      pois: { cdf: 3, inv: 0.95 }
    }
  };

  var open = false;
  var lastFocus = null;
  var fab = null, panel = null, host = null;

  /**
   * [bundle] La burbuja se monta en `body`, fuera del contenedor de la vista,
   * así que no heredaría el ámbito `.sinapsis-tool` con el que se envuelve
   * `css/lookup.css`. Se monta dentro de un host propio que SÍ lleva esa
   * clase; con `display:contents` el host no genera caja y el FAB y el panel
   * (ambos `position:fixed`) se colocan igual que en el baseline.
   */
  function ensureHost() {
    if (host && host.isConnected) return host;
    host = document.createElement("div");
    host.className = "sinapsis-tool ql-host";
    host.style.display = "contents";
    document.body.appendChild(host);
    return host;
  }

  // ---------------------------------------------------------------- formato
  function fmtP(x) {                       // probabilidades
    if (!isFinite(x)) return "—";
    if (x !== 0 && Math.abs(x) < 1e-4) return x.toExponential(3);
    return x.toFixed(4);
  }
  function fmtV(x) {                       // valores críticos / fractiles
    if (!isFinite(x)) return x > 0 ? "∞" : "−∞";
    return x.toFixed(4);
  }
  function fmtIn(x) {                      // el dato tal como lo escribió la persona
    if (!isFinite(x)) return "—";
    var r = Math.round(x * 1e6) / 1e6;
    return String(r);
  }
  function num(v) {
    if (v == null) return NaN;
    v = String(v).trim().replace(",", ".");
    if (v === "") return NaN;
    return Number(v);
  }
  function esc(s) { return A.escapeHtml(String(s)); }

  // Todas las consultas de DOM van acotadas al panel, nunca a document: así el
  // módulo no depende de que sus ids sean únicos en la página.
  function q(sel) { return panel ? panel.querySelector(sel) : null; }
  function qa(sel) { return panel ? $$(sel, panel) : []; }

  // ---------------------------------------------------------------- DOM
  function seg(name, items, cur) {
    return '<div class="seg ql-seg" role="group">' + items.map(function (it) {
      return '<button type="button" data-ql-' + esc(name) + '="' + esc(it.id) + '"' +
        (it.id === cur ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') +
        ">" + esc(it.label) + "</button>";
    }).join("") + "</div>";
  }
  function fld(key, label, value, attrs) {
    return '<label class="ql-fld"><span class="ql-lbl">' + esc(label) + "</span>" +
      '<input class="field ql-in" type="text" inputmode="decimal" autocomplete="off" data-ql-fld="' + esc(key) + '" ' +
      (attrs || "") + ' value="' + esc(fmtIn(value)) + '" /></label>';
  }

  function mainLabel() {
    var inv = st.dir === "inv";
    if (st.mode === "norm") return inv ? "p = P(X ≤ x)" : "x";
    if (st.mode === "t") return inv ? "p = P(T ≤ t)" : "t";
    if (st.mode === "chi2") return inv ? "p = P(X ≤ x)" : "x";
    return inv ? "p objetivo" : "k";
  }
  function outLabel() {
    if (st.dir === "inv") {
      if (st.mode === "norm") return st.mu === 0 && st.sigma === 1 ? "Fractil z" : "Fractil x";
      if (st.mode === "t") return "Fractil t";
      if (st.mode === "chi2") return "Fractil χ²";
      return "Menor k";
    }
    return "Probabilidad acumulada";
  }

  function paramsHtml() {
    if (st.mode === "norm") return fld("mu", "μ", st.mu) + fld("sigma", "σ", st.sigma);
    if (st.mode === "t" || st.mode === "chi2") return fld("df", "grados de libertad", st.df, 'min="1" step="1"');
    if (st.mode === "binom") return fld("n", "n", st.n, 'min="1" step="1"') + fld("p", "p", st.p, 'min="0" max="1"');
    return fld("lam", "λ", st.lam, 'min="0"');
  }

  function renderForm() {
    var v = st.vals[st.mode][st.dir];
    var chips = CHIPS.map(function (c) {
      return '<button type="button" class="chip-btn ql-chip" data-ql-chip="' + c + '">' + c + "</button>";
    }).join("");
    q("#qlForm").innerHTML =
      '<div class="ql-segs">' + seg("mode", MODES, st.mode) + seg("dir", DIRS, st.dir) + "</div>" +
      '<div class="ql-params">' + paramsHtml() + "</div>" +
      '<label class="ql-fld ql-main"><span class="ql-lbl">' + esc(mainLabel()) + "</span>" +
      '<input class="field ql-in" id="qlValue" type="text" inputmode="decimal" autocomplete="off" data-ql-fld="value" value="' + esc(fmtIn(v)) + '" /></label>' +
      '<div class="ql-chips"><span class="ql-chips-lbl">Fractiles frecuentes</span>' + chips + "</div>";
  }

  function build() {
    if (fab) return;
    var root = ensureHost();   // [bundle] antes: document.body

    fab = document.createElement("button");
    fab.id = "qlFab";
    fab.type = "button";
    fab.className = "ql-fab";
    fab.setAttribute("title", "Buscador de valores (⌘J)");
    fab.setAttribute("aria-label", "Buscador de valores (⌘J)");
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-controls", "qlPanel");
    fab.innerHTML = A.icon("function", 20);
    fab.addEventListener("click", function () { toggle(); });
    root.appendChild(fab);   // [bundle] antes: document.body

    panel = document.createElement("div");
    panel.id = "qlPanel";
    panel.className = "ql-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-label", "Buscador de valores");
    panel.innerHTML =
      '<div class="ql-head">' +
      '<span class="ql-title">Buscador de valores</span>' +
      '<span class="kbd">⌘J</span>' +
      '<button type="button" class="icon-btn ql-close" id="qlClose" aria-label="Cerrar el buscador">' + A.icon("x", 15) + "</button>" +
      "</div>" +
      '<div class="ql-body">' +
      '<div id="qlForm"></div>' +
      '<div class="ql-result">' +
      '<div class="ql-out-head"><span class="ql-out-lbl" id="qlOutLbl"></span>' +
      '<button type="button" class="icon-btn ql-copy" id="qlCopy" title="Copiar el resultado" aria-label="Copiar el resultado">' + A.icon("copy", 14) + "</button></div>" +
      '<div class="ql-out" id="qlOut" aria-live="polite">—</div>' +
      '<div class="ql-read" id="qlRead"></div>' +
      '<div class="ql-note" id="qlNote"></div>' +
      '<div class="ql-err" id="qlErr" role="alert"></div>' +
      "</div></div>";
    root.appendChild(panel);   // [bundle] antes: document.body

    renderForm();

    panel.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button") : null;
      if (!b) return;
      if (b.id === "qlClose") { close(); return; }
      if (b.id === "qlCopy") { copyOut(); return; }
      if (b.hasAttribute("data-ql-mode")) { st.mode = b.getAttribute("data-ql-mode"); renderForm(); compute(); focusMain(); return; }
      if (b.hasAttribute("data-ql-dir")) { st.dir = b.getAttribute("data-ql-dir"); renderForm(); compute(); focusMain(); return; }
      if (b.hasAttribute("data-ql-chip")) {
        st.dir = "inv";
        st.vals[st.mode].inv = Number(b.getAttribute("data-ql-chip"));
        renderForm(); compute(); focusMain();
      }
    });
    panel.addEventListener("input", function (e) {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute("data-ql-fld")) { readForm(); compute(); }
    });
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target && e.target.classList && e.target.classList.contains("ql-in")) {
        e.preventDefault(); copyOut();
      }
    });

    compute();
  }

  function readForm() {
    qa("[data-ql-fld]").forEach(function (el) {
      var k = el.getAttribute("data-ql-fld");
      var v = num(el.value);
      if (k === "value") st.vals[st.mode][st.dir] = v;
      else st[k] = v;
    });
  }

  // ---------------------------------------------------------------- cálculo
  function bad(msg, field) {
    q("#qlOut").textContent = "—";
    q("#qlRead").innerHTML = "";
    q("#qlNote").textContent = "";
    q("#qlErr").textContent = msg;
    qa("[data-ql-fld]").forEach(function (el) {
      el.classList.toggle("err", el.getAttribute("data-ql-fld") === field);
    });
  }
  function good(label, out, readTex, note) {
    q("#qlOutLbl").textContent = label;
    q("#qlOut").textContent = out;
    q("#qlRead").innerHTML = readTex ? A.rich(readTex) : "";
    q("#qlNote").textContent = note || "";
    q("#qlErr").textContent = "";
    qa("[data-ql-fld]").forEach(function (el) { el.classList.remove("err"); });
  }

  // ------------------------------------------------------- lectura de colas
  // Convención: α es el área de la cola CHICA. Este módulo solo llama α a un
  // área menor que 0.5 y siempre aclara de qué cola se trata. Un área de 0.5 o
  // más se informa por su nombre ("cola superior" / "cola inferior") pero nunca
  // como α: con z = −1.96 la cola superior vale 0.9750, y eso no es ningún α.
  function isNeg(x) { return x < 0 && Math.abs(x) >= 5e-5; }

  // p = P(X ≤ v). two: la distribución es simétrica, así que el α bilateral
  // vale el doble del unilateral (no vale para la χ²). up es la cola superior:
  // quien la tenga calculada aparte la pasa (la Normal la saca de M.normSF) para
  // no perder cifras en el 1 − p; el resto deja que se deduzca.
  function alphaTex(p, two, up) {
    if (up == null) up = 1 - p;
    // Empate práctico: si la cola chica se muestra como 0.5000 no hay α que
    // nombrar. La comparación es por la resolución que se imprime (4 decimales)
    // y no por igualdad exacta, porque normCDF(0) no devuelve exactamente 0.5.
    if (Math.min(p, up) > 0.5 - 5e-5) return " · las dos colas valen $0.5$; ninguna de las dos es un α";
    if (up < p) {
      return " · $\\alpha = " + fmtP(up) + "$ en la cola superior" +
        (two ? "; a dos colas $" + fmtP(2 * up) + "$" : "");
    }
    if (p < up) {
      return " · $\\alpha = " + fmtP(p) + "$ en la cola inferior" +
        (two ? "; a dos colas $" + fmtP(2 * p) + "$" : "");
    }
    return "";
  }

  function compute() {
    if (!panel) return;
    var v = st.vals[st.mode][st.dir];
    var inv = st.dir === "inv";
    q("#qlOutLbl").textContent = outLabel();

    // ---- validación de los parámetros del modo ----
    if (st.mode === "norm") {
      if (!isFinite(st.mu)) return bad("μ debe ser un número.", "mu");
      if (!(st.sigma > 0)) return bad("σ debe ser mayor que 0.", "sigma");
    }
    if (st.mode === "t" || st.mode === "chi2") {
      if (!(st.df >= 1)) return bad("Los grados de libertad deben ser un número ≥ 1.", "df");
    }
    if (st.mode === "binom") {
      if (!(st.n >= 1) || Math.floor(st.n) !== st.n) return bad("n debe ser un entero ≥ 1.", "n");
      if (!(st.p >= 0 && st.p <= 1)) return bad("p debe estar entre 0 y 1.", "p");
    }
    if (st.mode === "pois") {
      if (!(st.lam >= 0)) return bad("λ debe ser un número ≥ 0.", "lam");
    }

    // ---- validación del campo principal ----
    if (!isFinite(v)) return bad(inv ? "Ingrese una probabilidad entre 0 y 1." : "Ingrese un valor numérico.", "value");
    if (inv) {
      var disc = st.mode === "binom" || st.mode === "pois";
      if (disc && !(v >= 0 && v <= 1)) return bad("La probabilidad debe estar entre 0 y 1.", "value");
      if (!disc && !(v > 0 && v < 1)) return bad("La probabilidad debe estar entre 0 y 1 (sin incluirlos).", "value");
    } else {
      if (st.mode === "chi2" && v < 0) return bad("La χ² solo toma valores ≥ 0.", "value");
      if (st.mode === "binom" || st.mode === "pois") {
        if (v < 0 || Math.floor(v) !== v) return bad("k debe ser un entero ≥ 0.", "value");
        if (st.mode === "binom" && v > st.n) return bad("k no puede superar a n.", "value");
      }
    }

    // ---- resolución por modo ----
    if (st.mode === "norm") return doNorm(v, inv);
    if (st.mode === "t") return doT(v, inv);
    if (st.mode === "chi2") return doChi2(v, inv);
    if (st.mode === "binom") return doBinom(v, inv);
    return doPois(v, inv);
  }

  function doNorm(v, inv) {
    var std = st.mu === 0 && st.sigma === 1;
    var read, note;
    if (!inv) {
      var z = (v - st.mu) / st.sigma;
      var pr = M.normCDF(v, st.mu, st.sigma);
      // La cola superior sale de erfc, no de 1 − Φ: la resta se come todas las
      // cifras justo donde hacen falta (con z = 9, 1 − Φ da 0 y la cola vale
      // 1.13e-19).
      var sf = M.normSF(v, st.mu, st.sigma);
      var zt = fmtV(z);
      read = (std ? "" : "$z = \\dfrac{" + fmtIn(v) + " - " + fmtIn(st.mu) + "}{" + fmtIn(st.sigma) + "} = " + zt + "$ · ") +
        "$\\Phi(" + zt + ") = P(Z \\le " + zt + ") = " + fmtP(pr) + "$" +
        " · cola superior $1 - \\Phi(" + zt + ") = " + fmtP(sf) + "$" +
        (isNeg(z) ? " · por simetría $\\Phi(" + fmtV(-z) + ") = 1 - \\Phi(" + zt + ") = " + fmtP(sf) + "$" : "") +
        alphaTex(pr, true, sf);
      return good(std ? "Φ(z)" : "P(X ≤ x)", fmtP(pr), read,
        "Las dos colas se calculan con erfc de precisión doble, sin restar una de otra.");
    }
    var zz = M.normInv(v);
    var xx = st.mu + st.sigma * zz;
    read = "z tal que $\\Phi(z) = " + fmtIn(v) + "$" +
      (std ? "" : " · $x = \\mu + \\sigma z = " + fmtV(xx) + "$");
    note = v > 0.5
      ? "Como valor crítico: α = " + fmtP(1 - v) + " en la cola superior; sirve para un intervalo bilateral de " +
        // dos decimales solo cuando hacen falta: 95 %, pero también 99.98 % (con
        // un decimal, p = 0.9999 se redondeaba a "100 % de confianza")
        (Math.round((2 * v - 1) * 10000) / 100) + " % de confianza."
      : v < 0.5
        ? "Como valor crítico: α = " + fmtP(v) + " en la cola inferior; por simetría este fractil es el opuesto del de " + fmtIn(1 - v) + "."
        : "";
    return good(std ? "Fractil z" : "Fractil x", fmtV(std ? zz : xx), read, note);
  }

  function doT(v, inv) {
    var df = st.df;
    if (!inv) {
      var pr = M.tCDF(v, df);
      var dft = fmtIn(df);
      return good("P(T ≤ t)", fmtP(pr),
        "$P(T_{" + dft + "} \\le " + fmtIn(v) + ") = " + fmtP(pr) + "$" +
        " · cola superior $P(T_{" + dft + "} \\ge " + fmtIn(v) + ") = " + fmtP(1 - pr) + "$" +
        (isNeg(v) ? " · por simetría $P(T_{" + dft + "} \\le " + fmtIn(-v) + ") = " + fmtP(1 - pr) + "$" : "") +
        alphaTex(pr, true),
        "La t es simétrica: P(T ≤ −t) = 1 − P(T ≤ t).");
    }
    var tv = M.tInv(v, df);
    var note = v > 0.5
      ? "Como valor crítico: α = " + fmtP(1 - v) + " en la cola superior, con " + fmtIn(df) + " grados de libertad."
      : v < 0.5
        ? "Como valor crítico: α = " + fmtP(v) + " en la cola inferior, con " + fmtIn(df) +
          " grados de libertad; por simetría es el opuesto del fractil de " + fmtIn(1 - v) + "."
        : "";
    return good("Fractil t", fmtV(tv),
      "t con " + fmtIn(df) + " gl tal que $P(T \\le t) = " + fmtIn(v) + "$", note);
  }

  function doChi2(v, inv) {
    var k = st.df;
    var asim = "La χ² no es simétrica: un intervalo bilateral usa dos fractiles distintos.";
    if (!inv) {
      var pr = M.chi2CDF(v, k);
      var kt = fmtIn(k);
      return good("P(X ≤ x)", fmtP(pr),
        "$P(\\chi^2_{" + kt + "} \\le " + fmtIn(v) + ") = " + fmtP(pr) + "$" +
        " · cola superior $P(\\chi^2_{" + kt + "} > " + fmtIn(v) + ") = " + fmtP(1 - pr) + "$" +
        alphaTex(pr, false),
        asim);
    }
    var xv = M.chi2Inv(v, k);
    return good("Fractil χ²", fmtV(xv),
      "$\\chi^2$ con " + fmtIn(k) + " gl tal que $P(X \\le \\chi^2) = " + fmtIn(v) + "$", asim);
  }

  function doBinom(v, inv) {
    var n = st.n, p = st.p;
    var head = "$X \\sim \\mathrm{Bi}(" + fmtIn(n) + ";\\, " + fmtIn(p) + ")$";
    if (!inv) {
      var pmf = M.binomPMF(v, n, p), cdf = M.binomCDF(v, n, p), sf = M.binomSF(v, n, p);
      return good("P(X ≤ k)", fmtP(cdf),
        head + " · $P(X = " + fmtIn(v) + ") = " + fmtP(pmf) + "$ · $P(X \\le " + fmtIn(v) + ") = " + fmtP(cdf) +
        "$ · $P(X \\ge " + fmtIn(v) + ") = " + fmtP(sf) + "$",
        "La cola superior se suma directamente, sin restar 1 − P(X ≤ k−1).");
    }
    var k = M.binomInv(v, n, p);
    return good("Menor k", String(k),
      head + " · menor $k$ con $P(X \\le k) \\ge " + fmtIn(v) + "$; aquí $P(X \\le " + k + ") = " + fmtP(M.binomCDF(k, n, p)) + "$",
      "");
  }

  function doPois(v, inv) {
    var lam = st.lam;
    var head = "$X \\sim \\mathrm{Po}(" + fmtIn(lam) + ")$";
    if (!inv) {
      var pmf = M.poissonPMF(v, lam), cdf = M.poissonCDF(v, lam), sf = M.poissonSF(v, lam);
      return good("P(X ≤ k)", fmtP(cdf),
        head + " · $P(X = " + fmtIn(v) + ") = " + fmtP(pmf) + "$ · $P(X \\le " + fmtIn(v) + ") = " + fmtP(cdf) +
        "$ · $P(X \\ge " + fmtIn(v) + ") = " + fmtP(sf) + "$",
        "La cola superior se suma directamente, sin restar 1 − P(X ≤ k−1).");
    }
    var k = M.poissonInv(v, lam);
    if (!isFinite(k)) return bad("Con p = 1 no hay un k finito: el soporte de Poisson no está acotado.", "value");
    return good("Menor k", String(k),
      head + " · menor $k$ con $P(X \\le k) \\ge " + fmtIn(v) + "$; aquí $P(X \\le " + k + ") = " + fmtP(M.poissonCDF(k, lam)) + "$",
      "");
  }

  // ---------------------------------------------------------------- copiar
  function copyOut() {
    var el = q("#qlOut");
    var txt = el ? el.textContent : "";
    if (!txt || txt === "—") { A.toast("Todavía no hay un resultado para copiar"); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(
        function () { A.toast("Copiado al portapapeles"); },
        function () { legacyCopy(txt); }
      );
      return;
    }
    legacyCopy(txt);
  }
  function legacyCopy(txt) {
    try {
      var ta = document.createElement("textarea");
      ta.value = txt;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      A.toast(ok ? "Copiado al portapapeles" : "No se pudo copiar");
    } catch (e) {
      A.toast("Portapapeles no disponible");
    }
  }

  // ---------------------------------------------------------------- abrir / cerrar
  function focusMain() {
    var el = q("#qlValue");
    if (el) { el.focus(); try { el.select(); } catch (e) {} }
  }
  // [bundle] `#palette.show` es la paleta ⌘K de la app original. En la
  // plataforma la paleta la dibuja el shell (otro marcado), así que esto
  // devuelve false y Escape siempre cierra la burbuja. Anotado en
  // ADAPTACIONES.md: si el runtime expusiera un `App.paletteOpen()`, o si el
  // shell marcase su paleta abierta con `[data-palette-open]` en la raíz,
  // aquí se recupera la deferencia original sin tocar nada más.
  function paletteOpen() {
    var p = $("#palette");
    if (p && p.classList.contains("show")) return true;
    if (typeof A.paletteOpen === "function") return !!A.paletteOpen();
    return !!document.querySelector("[data-palette-open]");
  }
  function set(opts) {
    if (!opts) return api;
    if (opts.mode && MODES.some(function (m) { return m.id === opts.mode; })) st.mode = opts.mode;
    if (opts.dir === "cdf" || opts.dir === "inv") st.dir = opts.dir;
    ["mu", "sigma", "df", "n", "p", "lam"].forEach(function (k) {
      if (opts[k] != null && isFinite(Number(opts[k]))) st[k] = Number(opts[k]);
    });
    if (opts.value != null && isFinite(Number(opts.value))) st.vals[st.mode][st.dir] = Number(opts.value);
    if (panel) { renderForm(); compute(); }
    return api;
  }
  function doOpen(opts) {
    build();
    if (opts) set(opts);
    if (!open) lastFocus = document.activeElement;
    open = true;
    panel.classList.add("show");
    fab.classList.add("on");
    fab.setAttribute("aria-expanded", "true");
    compute();
    focusMain();
    return api;
  }
  function close() {
    if (!open) return api;
    open = false;
    if (panel) panel.classList.remove("show");
    if (fab) { fab.classList.remove("on"); fab.setAttribute("aria-expanded", "false"); }
    if (lastFocus && document.contains(lastFocus) && lastFocus !== document.body) {
      try { lastFocus.focus(); } catch (e) {}
    } else if (fab) {
      try { fab.focus(); } catch (e) {}
    }
    lastFocus = null;
    return api;
  }
  function toggle(opts) { return open ? close() : doOpen(opts); }
  function isOpen() { return open; }

  // ---------------------------------------------------------------- teclado
  // En FASE DE CAPTURA a propósito: así el orden respecto del handler de
  // core.js no depende de cuál script se cargó primero. Importa para Escape:
  // si la paleta ⌘K está abierta, la tecla es de ella y esta burbuja no la
  // toca; core.js recién cierra la paleta después, en fase de burbujeo.
  // ⌘J/Ctrl+J no colisiona con nada: core.js solo toma ⌘K, "/", "t" y Escape.
  document.addEventListener("keydown", function (e) {
    var key = (e.key || "").toLowerCase();
    if ((e.metaKey || e.ctrlKey) && !e.altKey && key === "j") {
      e.preventDefault();
      toggle();
      return;
    }
    if (e.key === "Escape" && open && !paletteOpen()) {
      e.preventDefault();
      close();
    }
  }, true);

  // ---------------------------------------------------------------- arranque
  function boot() { build(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  var api = { open: doOpen, close: close, toggle: toggle, set: set, isOpen: isOpen };
  A.quickLookup = api;
})();
