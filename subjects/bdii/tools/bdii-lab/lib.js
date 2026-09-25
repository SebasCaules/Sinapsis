/* ============================================================
   bdii-lab / lib.js — base compartida de las herramientas interactivas de la
   materia (72.41 Base de Datos II).

   IIFE clásico, sin módulos ES, sin `eval`, sin `fetch` a terceros. Cuelga UNA
   sola cosa de `window`: nada. Todo lo que exporta vive en `App.bdiiLab`, y
   cada herramienta del bundle registra su motor puro en
   `App.bdiiLab.engines.<id>`.

   Documentación de esta API (con ejemplos): ver TOOLS_LIB.md, en
   `_exec/2026-09-25-ingesta-herramientas/`. Este archivo es la fuente; ese
   documento tiene que alcanzar sin leer este archivo.
   ============================================================ */
(function () {
  "use strict";

  var App = window.App;
  if (!App) return; // sin runtime instalado, no hay nada que registrar

  var SVG_NS = "http://www.w3.org/2000/svg";
  var uidCounter = 0;

  // ------------------------------------------------------------------
  // Utilidades internas
  // ------------------------------------------------------------------

  function uid(prefix) {
    uidCounter += 1;
    return (prefix || "bdii") + "-" + uidCounter;
  }

  function looseEqual(a, b) {
    return a === b || String(a) === String(b);
  }

  function applyStyle(node, styleObj) {
    Object.keys(styleObj).forEach(function (key) {
      var val = styleObj[key];
      if (val == null) return;
      if (key.indexOf("--") === 0) node.style.setProperty(key, String(val));
      else node.style[key] = val;
    });
  }

  /** Aplica un atributo/propiedad de `h`/`svg`. Nunca concatena marcado. */
  function setAttr(node, key, value, isSvg) {
    if (value == null || value === false) return;
    if (key === "on" && typeof value === "object") {
      Object.keys(value).forEach(function (evt) {
        if (typeof value[evt] === "function") node.addEventListener(evt, value[evt]);
      });
      return;
    }
    if (key === "style") {
      if (value && typeof value === "object") applyStyle(node, value);
      else if (typeof value === "string") node.setAttribute("style", value);
      return;
    }
    if (!isSvg) {
      // Estas tres viven mejor como propiedad IDL: así `get()`/`set()` de los
      // controles quedan sincronizados con lo que el usuario tipeó, no solo
      // con el valor inicial (que es lo único que fija un atributo).
      if (key === "value" && "value" in node) { node.value = value; return; }
      if (key === "checked") { node.checked = !!value; return; }
      if (key === "disabled") { node.disabled = !!value; return; }
    }
    if (key === "class") { node.setAttribute("class", value); return; }
    if (value === true) { node.setAttribute(key, ""); return; }
    node.setAttribute(key, String(value));
  }

  /** Cuelga un hijo del nodo. Strings/números entran como texto, nunca HTML. */
  function appendChild(node, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { appendChild(node, c); }); return; }
    if (typeof child === "string" || typeof child === "number") {
      node.appendChild(document.createTextNode(String(child)));
      return;
    }
    if (child && child.nodeType) { node.appendChild(child); return; }
  }

  /** Crea un elemento HTML. `attrs` admite class, id, for, type, value, role, aria-, data-, style (objeto) y on ({evento:fn}). */
  function h(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) { setAttr(node, key, attrs[key], false); });
    var children = Array.prototype.slice.call(arguments, 2);
    children.forEach(function (c) { appendChild(node, c); });
    return node;
  }

  /** Igual que `h`, para SVG (namespace correcto; sin las propiedades IDL de formularios). */
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) { setAttr(node, key, attrs[key], true); });
    var children = Array.prototype.slice.call(arguments, 2);
    children.forEach(function (c) { appendChild(node, c); });
    return node;
  }

  // ------------------------------------------------------------------
  // Formato
  // ------------------------------------------------------------------

  function fmtInt(n) {
    if (n == null || !isFinite(n)) return "—";
    try { return new Intl.NumberFormat("es").format(Math.round(n)); }
    catch (e) {
      var neg = n < 0;
      var s = String(Math.round(Math.abs(n)));
      var out = "";
      for (var i = 0; i < s.length; i++) {
        if (i > 0 && (s.length - i) % 3 === 0) out += ".";
        out += s[i];
      }
      return (neg ? "-" : "") + out;
    }
  }

  function fmtNum(n, dec) {
    dec = dec == null ? 2 : dec;
    if (n == null || !isFinite(n)) return "—";
    try {
      return new Intl.NumberFormat("es", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
    } catch (e) {
      return n.toFixed(dec).replace(".", ",");
    }
  }

  function plural(n, sing, plur) {
    return n === 1 ? sing : (plur != null ? plur : sing + "s");
  }

  // ------------------------------------------------------------------
  // Slugs — MISMA implementación que `normalizeSlug` de
  // packages/contract/src/index.ts (línea ~487 al escribir esto). Si el
  // contrato cambia esa función, esta copia queda desactualizada: avisarlo.
  // ------------------------------------------------------------------

  function fold(text) {
    return (text == null ? "" : text).normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase();
  }

  function normalizeSlug(raw) {
    return fold(raw)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120)
      .replace(/-+$/, "");
  }

  // ------------------------------------------------------------------
  // Controles
  // ------------------------------------------------------------------

  function select(opts) {
    opts = opts || {};
    var options = opts.options || [];
    var onChange = typeof opts.onChange === "function" ? opts.onChange : null;
    var current = opts.value;
    var id = uid("bdii-select");
    var selectEl = h("select", { id: id });
    options.forEach(function (opt) {
      selectEl.appendChild(h("option", { value: String(opt.value) }, opt.label != null ? opt.label : String(opt.value)));
    });
    function sync() {
      var match = null;
      for (var i = 0; i < options.length; i++) { if (looseEqual(options[i].value, current)) { match = options[i]; break; } }
      if (!match && options[0]) { match = options[0]; current = match.value; }
      selectEl.value = match ? String(match.value) : "";
    }
    sync();
    selectEl.addEventListener("change", function () {
      var raw = selectEl.value;
      var match = null;
      for (var i = 0; i < options.length; i++) { if (String(options[i].value) === raw) { match = options[i]; break; } }
      current = match ? match.value : raw;
      if (onChange) onChange(current);
    });
    var wrapper = h("div", { class: "bdii-field bdii-select" }, h("label", { for: id }, opts.label), selectEl);
    return { el: wrapper, get: function () { return current; }, set: function (v) { current = v; sync(); } };
  }

  function segmented(opts) {
    opts = opts || {};
    var options = opts.options || [];
    var onChange = typeof opts.onChange === "function" ? opts.onChange : null;
    var current = opts.value;
    var groupId = uid("bdii-seg");
    var entries = [];
    var buttonEls = options.map(function (opt) {
      var btn = h("button", {
        type: "button", class: "bdii-seg-btn", "aria-pressed": looseEqual(opt.value, current) ? "true" : "false",
        on: { click: function () { current = opt.value; refresh(); if (onChange) onChange(current); } },
      }, opt.label);
      entries.push({ btn: btn, value: opt.value });
      return btn;
    });
    function refresh() {
      entries.forEach(function (e) { e.btn.setAttribute("aria-pressed", looseEqual(e.value, current) ? "true" : "false"); });
    }
    var labelId = groupId + "-label";
    var groupEl = h("div", { class: "bdii-segmented", role: "group", "aria-labelledby": labelId }, buttonEls);
    var labelEl = h("span", { class: "bdii-field-label", id: labelId }, opts.label);
    var wrapper = h("div", { class: "bdii-field" }, labelEl, groupEl);
    return { el: wrapper, get: function () { return current; }, set: function (v) { current = v; refresh(); } };
  }

  function defaultSliderFormat(v) { return Number.isInteger(v) ? fmtInt(v) : fmtNum(v, 2); }

  function slider(opts) {
    opts = opts || {};
    var min = opts.min, max = opts.max;
    var step = opts.step != null ? opts.step : 1;
    var isLog = !!opts.log;
    var format = typeof opts.format === "function" ? opts.format : defaultSliderFormat;
    var onChange = typeof opts.onChange === "function" ? opts.onChange : null;
    var current = opts.value != null ? opts.value : min;
    var logMin = isLog ? Math.max(min, 1e-6) : min; // el log necesita un piso positivo

    var id = uid("bdii-slider");
    var outId = id + "-out";
    var rangeMin = isLog ? 0 : min;
    var rangeMax = isLog ? 1000 : max;
    var rangeStep = isLog ? 1 : step;

    function valueToPos(v) {
      if (!isLog) return v;
      var ratio = Math.log(Math.max(v, logMin) / logMin) / Math.log(max / logMin);
      return Math.round(ratio * 1000);
    }
    function posToValue(p) {
      if (!isLog) return p;
      return logMin * Math.pow(max / logMin, p / 1000);
    }

    var input = h("input", { type: "range", id: id, min: rangeMin, max: rangeMax, step: rangeStep, value: valueToPos(current), "aria-describedby": outId });
    var output = h("output", { for: id, id: outId, class: "bdii-slider-value" }, "");

    function refresh(v, fire) {
      current = v;
      input.value = String(valueToPos(v));
      var text = format(v);
      output.textContent = text;
      input.setAttribute("aria-valuetext", text);
      if (fire && onChange) onChange(current);
    }

    input.addEventListener("input", function () {
      refresh(posToValue(parseFloat(input.value)), true);
    });
    refresh(current, false);

    var head = h("div", { class: "bdii-slider-head" }, h("label", { for: id }, opts.label), output);
    var wrapper = h("div", { class: "bdii-field bdii-slider" }, head, input);
    return { el: wrapper, get: function () { return current; }, set: function (v) { refresh(v, false); } };
  }

  function number(opts) {
    opts = opts || {};
    var min = opts.min, max = opts.max;
    var step = opts.step != null ? opts.step : 1;
    var onChange = typeof opts.onChange === "function" ? opts.onChange : null;
    var current = opts.value != null ? opts.value : (min != null ? min : 0);
    var id = uid("bdii-number");
    var attrs = { type: "number", id: id, value: current, step: step };
    if (min != null) attrs.min = min;
    if (max != null) attrs.max = max;
    var input = h("input", attrs);
    input.addEventListener("change", function () {
      var v = parseFloat(input.value);
      if (isNaN(v)) v = current;
      if (min != null) v = Math.max(min, v);
      if (max != null) v = Math.min(max, v);
      current = v;
      input.value = String(v);
      if (onChange) onChange(current);
    });
    var wrapper = h("div", { class: "bdii-field bdii-number" }, h("label", { for: id }, opts.label), input);
    return { el: wrapper, get: function () { return current; }, set: function (v) { current = v; input.value = String(v); } };
  }

  function text(opts) {
    opts = opts || {};
    var onChange = typeof opts.onChange === "function" ? opts.onChange : null;
    var current = opts.value != null ? opts.value : "";
    var id = uid("bdii-text");
    var attrs = { type: "text", id: id, value: current, placeholder: opts.placeholder || "" };
    if (opts.mono) attrs.class = "bdii-mono";
    var input = h("input", attrs);
    input.addEventListener("input", function () { current = input.value; if (onChange) onChange(current); });
    var wrapper = h("div", { class: "bdii-field bdii-text" }, h("label", { for: id }, opts.label), input);
    return { el: wrapper, get: function () { return current; }, set: function (v) { current = v; input.value = v; } };
  }

  function toggle(opts) {
    opts = opts || {};
    var onChange = typeof opts.onChange === "function" ? opts.onChange : null;
    var checked = !!opts.checked;
    var id = uid("bdii-toggle");
    var input = h("input", { type: "checkbox", id: id, role: "switch", checked: checked });
    input.addEventListener("change", function () { checked = input.checked; if (onChange) onChange(checked); });
    var wrapper = h("div", { class: "bdii-field bdii-toggle" }, h("label", { for: id }, opts.label), input);
    return { el: wrapper, get: function () { return checked; }, set: function (v) { checked = !!v; input.checked = checked; } };
  }

  function button(opts) {
    opts = opts || {};
    var kind = opts.kind === "primary" ? "primary" : "ghost";
    var onClick = typeof opts.onClick === "function" ? opts.onClick : null;
    var btn = h("button", { type: "button", class: "bdii-btn bdii-btn--" + kind, on: onClick ? { click: onClick } : null }, opts.label || "");
    return { el: btn, get: function () { return btn.textContent; }, set: function (v) { btn.textContent = v; } };
  }

  // ------------------------------------------------------------------
  // Tabla, código, avisos
  // ------------------------------------------------------------------

  function table(opts) {
    opts = opts || {};
    var columns = opts.columns || [];
    var rows = opts.rows || [];
    var rowClassFn = typeof opts.rowClass === "function" ? opts.rowClass : null;

    var headCells = columns.map(function (col) {
      var attrs = { scope: "col" };
      if (col.align) attrs.style = { textAlign: col.align };
      return h("th", attrs, col.label != null ? col.label : col.key);
    });

    var bodyRows = rows.map(function (row, i) {
      var trAttrs = {};
      if (rowClassFn) { var cls = rowClassFn(row, i); if (cls) trAttrs.class = cls; }
      var cells = columns.map(function (col) {
        var value = row ? row[col.key] : undefined;
        var tdAttrs = {};
        if (col.align) tdAttrs.style = { textAlign: col.align };
        if (col.mono) tdAttrs.class = "bdii-mono";
        var content = value === null ? h("em", { class: "bdii-null" }, "NULL") : (value === undefined ? "" : value);
        return h("td", tdAttrs, content);
      });
      return h("tr", trAttrs, cells);
    });

    var tableEl = h("table", { class: "bdii-table" },
      opts.caption ? h("caption", {}, opts.caption) : null,
      h("thead", {}, h("tr", {}, headCells)),
      h("tbody", {}, bodyRows));
    return h("div", { class: "bdii-table-wrap" }, tableEl);
  }

  function code(text_, lang) {
    var codeAttrs = { class: "bdii-code" };
    if (lang) codeAttrs["data-lang"] = lang;
    var codeEl = h("code", codeAttrs, text_ == null ? "" : String(text_));
    return h("pre", { class: "bdii-pre" }, codeEl);
  }

  var CALLOUT_MARKERS = { info: "(nota)", ok: "✓", bad: "✗", warn: "(atención)" };

  function callout(kind, title) {
    var children = Array.prototype.slice.call(arguments, 2);
    var marker = CALLOUT_MARKERS[kind] || CALLOUT_MARKERS.info;
    var titleEl = h("div", { class: "bdii-callout-title" }, h("span", { class: "bdii-callout-marker" }, marker), title ? " " + title : "");
    var bodyEl = h("div", { class: "bdii-callout-body" });
    children.forEach(function (c) { appendChild(bodyEl, c); });
    var parts = [titleEl];
    if (children.length) parts.push(bodyEl);
    var el = h.apply(null, ["div", { class: "bdii-callout bdii-callout--" + kind }].concat(parts));
    return el;
  }

  function badge(text_, kind) {
    return h("span", { class: "bdii-badge bdii-badge--" + (kind || "neutral") }, text_);
  }

  // ------------------------------------------------------------------
  // Stepper
  // ------------------------------------------------------------------

  function stepper(opts) {
    opts = opts || {};
    var count = Math.max(1, opts.count || 1);
    var render = typeof opts.render === "function" ? opts.render : function () { return null; };
    var label = opts.label || "Paso";

    var reduceMotion = false;
    try {
      if (typeof window.matchMedia === "function") {
        reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
    } catch (e) { reduceMotion = false; }

    var i = 0;
    var playing = false;
    var timer = null;

    var content = h("div", { class: "bdii-stepper-content" });
    var status = h("div", { class: "bdii-stepper-status", "aria-live": "polite" });

    var prevBtn = h("button", { type: "button", class: "bdii-btn bdii-btn--ghost bdii-stepper-btn", on: { click: prev } }, "‹ Anterior");
    var nextBtn = h("button", { type: "button", class: "bdii-btn bdii-btn--ghost bdii-stepper-btn", on: { click: next } }, "Siguiente ›");
    var resetBtn = h("button", { type: "button", class: "bdii-btn bdii-btn--ghost bdii-stepper-btn", on: { click: reset } }, "Reiniciar");
    var playBtn = h("button", { type: "button", class: "bdii-btn bdii-btn--ghost bdii-stepper-btn", on: { click: togglePlay } }, "Reproducir");

    function renderStep() {
      content.replaceChildren();
      var node = render(i);
      if (node) appendChild(content, node);
      status.textContent = label + " " + (i + 1) + " de " + count;
      prevBtn.disabled = i <= 0;
      nextBtn.disabled = i >= count - 1;
      playBtn.disabled = count <= 1;
      playBtn.textContent = playing ? "Pausar" : "Reproducir";
    }

    function go(n) {
      n = Math.max(0, Math.min(count - 1, n));
      i = n;
      renderStep();
    }
    function next() { if (i < count - 1) go(i + 1); else stop(); }
    function prev() { stop(); go(i - 1); }
    function reset() { stop(); go(0); }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      playing = false;
      playBtn.textContent = "Reproducir";
    }
    function play() {
      // prefers-reduced-motion: no se arma un intervalo que avance solo; un
      // clic en "Reproducir" avanza un paso, nada más.
      if (reduceMotion) { next(); return; }
      if (i >= count - 1) go(0);
      playing = true;
      playBtn.textContent = "Pausar";
      timer = setInterval(function () {
        if (i >= count - 1) { stop(); return; }
        go(i + 1);
      }, 900);
    }
    function togglePlay() { if (playing) stop(); else play(); }

    function onKeydown(ev) {
      if (ev.key === "ArrowRight") { ev.preventDefault(); next(); }
      else if (ev.key === "ArrowLeft") { ev.preventDefault(); prev(); }
    }

    var controls = h("div", { class: "bdii-stepper-controls", role: "group", "aria-label": label }, prevBtn, nextBtn, resetBtn, playBtn);
    var root = h("div", { class: "bdii-stepper", tabindex: "0", on: { keydown: onKeydown } }, controls, status, content);

    renderStep();

    return {
      el: root,
      go: go,
      destroy: function () { stop(); },
    };
  }

  // ------------------------------------------------------------------
  // Layout
  // ------------------------------------------------------------------

  function panel(title) {
    var children = Array.prototype.slice.call(arguments, 1);
    var body = h("div", { class: "bdii-panel-body" });
    children.forEach(function (c) { appendChild(body, c); });
    var parts = [];
    if (title) parts.push(h("h3", { class: "bdii-panel-title" }, title));
    parts.push(body);
    return h.apply(null, ["div", { class: "bdii-panel" }].concat(parts));
  }

  function grid(cols) {
    var children = Array.prototype.slice.call(arguments, 1);
    var wrap = h("div", { class: "bdii-grid", style: { "--bdii-grid-cols": cols } });
    children.forEach(function (c) { appendChild(wrap, c); });
    return wrap;
  }

  /**
   * `opts.value` (opcional): índice del preset que ya está cargado al montar,
   * para que el selector lo muestre elegido en vez de "Elegir un escenario…".
   * Solo marca la opción: NO llama a onPick (la herramienta ya dibujó ese estado).
   */
  function presetPicker(opts) {
    opts = opts || {};
    var presets = opts.presets || [];
    var onPick = typeof opts.onPick === "function" ? opts.onPick : null;
    var options = [{ value: "", label: "Elegir un escenario…" }].concat(presets.map(function (p, idx) {
      var label = p.label + (p.origen ? " — " + p.origen : "");
      return { value: String(idx), label: label };
    }));
    var initial = typeof opts.value === "number" && presets[opts.value] ? String(opts.value) : "";
    return select({
      label: opts.label || "Escenario de partida",
      options: options,
      value: initial,
      onChange: function (v) {
        if (v === "") return;
        var preset = presets[parseInt(v, 10)];
        if (preset && onPick) onPick(preset);
      },
    });
  }

  // ------------------------------------------------------------------
  // Enlaces al vault y a otras herramientas
  // ------------------------------------------------------------------

  function findPage(slug) {
    if (App.BY_SLUG && App.BY_SLUG[slug]) return App.BY_SLUG[slug];
    if (Array.isArray(App.PAGES)) {
      for (var i = 0; i < App.PAGES.length; i++) {
        if (App.PAGES[i] && App.PAGES[i].slug === slug) return App.PAGES[i];
      }
    }
    return null;
  }

  function subjectSlug() {
    return (App.SUBJECT && App.SUBJECT.slug) || "bdii";
  }

  /** Enlace a una página del vault, buscada por el nombre de su archivo (sin `.md`). */
  function pageLink(stem, label) {
    var slug = normalizeSlug(stem);
    var page = findPage(slug);
    if (!page) return h("span", { class: "bdii-pagelink bdii-pagelink--missing" }, label);
    var href = "/m/" + subjectSlug() + "/p/" + page.slug;
    return h("a", { class: "wikilink bdii-pagelink", "data-slug": page.slug, href: href }, label);
  }

  /** Enlace a otra vista del bundle (u otra herramienta), navegado por `App.go` vía `data-nav`. */
  function toolLink(viewId, label) {
    var target = "/m/" + subjectSlug() + "/t/" + viewId;
    return h("a", { class: "bdii-toollink", href: target, "data-nav": target }, label);
  }

  function sourcesRow(sources) {
    if (!sources || !sources.length) return null;
    var wrap = h("div", { class: "bdii-lab-sources" }, h("span", { class: "bdii-lab-sources-label" }, "En el wiki: "));
    sources.forEach(function (s, idx) {
      wrap.appendChild(pageLink(s.stem, s.label));
      if (idx < sources.length - 1) wrap.appendChild(document.createTextNode(" · "));
    });
    return wrap;
  }

  // ------------------------------------------------------------------
  // tool() — registra la vista y (opcionalmente) la figura de una herramienta
  // ------------------------------------------------------------------

  function tool(config, mount) {
    config = config || {};
    var id = config.id;
    var title = config.title || id;
    var subtitle = config.subtitle || "";
    var sources = config.sources || [];
    var figureConfig = config.figure || null;

    function buildHeader(mode) {
      if (mode === "figure") {
        return h("div", { class: "bdii-lab-figheader" },
          h("span", { class: "bdii-lab-figtitle" }, title),
          toolLink(id, "Abrir el laboratorio completo"));
      }
      var parts = [h("h1", { class: "bdii-lab-title" }, title)];
      if (subtitle) parts.push(h("p", { class: "bdii-lab-subtitle" }, subtitle));
      var links = sourcesRow(sources);
      if (links) parts.push(links);
      return h.apply(null, ["header", { class: "bdii-lab-header" }].concat(parts));
    }

    function mountInto(container, mode, ctx) {
      container.replaceChildren();
      container.classList.add("bdii-lab");
      container.classList.add(mode === "figure" ? "bdii-lab--figure" : "bdii-lab--view");
      container.appendChild(buildHeader(mode));
      var body = h("div", { class: "bdii-lab-body" });
      container.appendChild(body);
      var cleanup;
      try {
        cleanup = mount(body, { mode: mode, ctx: ctx, App: App });
      } catch (err) {
        if (window.console && console.error) console.error("[bdii-lab] " + id + ":", err);
        body.replaceChildren();
        body.appendChild(callout("bad", "Error al cargar la herramienta",
          h("div", { class: "bdii-mono" }, String((err && err.message) || err))));
        cleanup = undefined;
      }
      return typeof cleanup === "function" ? cleanup : undefined;
    }

    App.registerView(id, function (main) {
      var cleanup = mountInto(main, "view", null);
      return function () { if (cleanup) { try { cleanup(); } catch (e) { /* noop */ } } };
    });

    if (figureConfig && figureConfig.id && typeof App.registerFigure === "function") {
      App.registerFigure(figureConfig.id, function (host, ctx) {
        var cleanup = mountInto(host, "figure", ctx);
        if (cleanup && ctx && typeof ctx.cleanup === "function") ctx.cleanup(cleanup);
        return cleanup;
      }, { caption: figureConfig.caption, height: figureConfig.height });
    }
  }

  // ------------------------------------------------------------------
  // Registro
  // ------------------------------------------------------------------

  var lab = App.bdiiLab = App.bdiiLab || {};
  lab.engines = lab.engines || {};

  lab.h = h;
  lab.svg = svg;
  lab.select = select;
  lab.segmented = segmented;
  lab.slider = slider;
  lab.number = number;
  lab.text = text;
  lab.toggle = toggle;
  lab.button = button;
  lab.table = table;
  lab.code = code;
  lab.callout = callout;
  lab.badge = badge;
  lab.stepper = stepper;
  lab.panel = panel;
  lab.grid = grid;
  lab.presetPicker = presetPicker;
  lab.pageLink = pageLink;
  lab.toolLink = toolLink;
  lab.tool = tool;
  lab.fmtInt = fmtInt;
  lab.fmtNum = fmtNum;
  lab.plural = plural;
  // Expuesta para pruebas y para herramientas que necesiten resolver un slug
  // sin pasar por pageLink (p. ej. armar un href a mano).
  lab.normalizeSlug = normalizeSlug;
})();
