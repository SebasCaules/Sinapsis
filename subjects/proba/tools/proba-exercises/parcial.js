/* ============================================================
   parcial.js — "Simulador de parcial cronometrado".

   Port de la SECCIÓN 3 de `estudio/study.js` del baseline de Proba
   (flashcards y quiz quedan afuera: ese material ya vive en la
   plataforma como contenido de estudio). Entran, en este orden:
   `buildQuizPool` (el banco de opción múltiple: las declaradas más las
   28 que se generan por distribución), el banco de ejercicios abiertos
   que sale del corpus de `ejercicios-data.js`, y el simulador entero.

   Datos: `window.EXAMEN` (data/exam-data.js) trae `QUIZ` y `DISTS`; el
   corpus abierto sale de `window.EJERCICIOS`.

   RUTAS
     #/parcial              simulador; query ?u=1,2 recorta el banco a esas
                            unidades (el plan de estudio enlaza así el
                            simulacro de un tramo del programa)
     #/parcial/resultado    corrección y repaso ítem por ítem

   ESTADO OBSERVABLE DEL SIMULADOR (para pruebas automatizadas)
     El examen mezcla ítems al azar, así que el primero puede ser de opción
     múltiple y no montar ningún '.ej-doc'. Ya arrancado, el contenedor lleva
     .exam-stage[data-exam-ready="1"] con data-exam-kind="mcq|open" (el ítem en
     pantalla) y data-exam-open="<n>" (ejercicios abiertos del examen armado).
     Para ver un enunciado hay que ir a un ítem abierto con los puntos
     '.exam-dot' de la barra de progreso.

   IIFE sin dependencias externas; todo offline.
   ============================================================ */
(function () {
  "use strict";
  var A = window.App;
  if (!A) return;

  // atajos al contrato
  var $ = A.$, $$ = A.$$;
  var icon = A.icon, rich = A.rich, katex = A.katex, escapeHtml = A.escapeHtml;
  var enhanceDoc = A.enhanceDoc;
  var BY_SLUG = A.BY_SLUG, shuffle = A.shuffle, unitMeta = A.unitMeta;
  // [bundle] En el baseline `STUDY` era el global de `study-data.js` entero.
  // Acá el banco de opción múltiple viaja con este bundle (data/exam-data.js)
  // y NO en `App.STUDY`: las `DISTS` de `App.STUDY` son las de `proba-tools`,
  // que llevan funciones vivas y no se pueden pisar.
  var STUDY = window.EXAMEN || {};

  // ============================================================
  function katexSafe(t) { return katex(t, false); }

  function buildQuizPool() {
    var pool = (STUDY.QUIZ || []).map(function (q) { return Object.assign({}, q); });
    var ds = STUDY.DISTS || [];
    var gen = function (d, key, qword) {
      var correctTex = d.tex[key];
      var distractors = shuffle(ds.filter(function (x) { return x.id !== d.id && x.tex[key] !== correctTex; })).slice(0, 3);
      var opts = shuffle([{ tex: correctTex, ok: true }].concat(distractors.map(function (o) { return { tex: o.tex[key], ok: false }; })));
      return {
        q: qword + " de la **" + d.name + "**?",
        texOpts: opts.map(function (o) { return o.tex; }),
        correct: opts.findIndex(function (o) { return o.ok; }),
        explain: "", slug: d.slug,
      };
    };
    ds.forEach(function (d) {
      pool.push(gen(d, "mean", "¿Cuál es la esperanza E[X]"));
      pool.push(gen(d, "var", "¿Cuál es la varianza V(X)"));
    });
    return shuffle(pool);
  }
  function ringColor(pct) { return pct >= 70 ? "var(--good)" : pct >= 40 ? "var(--warn)" : "var(--bad)"; }
  function quizVerdictMsg(pct) {
    return pct >= 70 ? "Tema dominado."
      : pct >= 40 ? "Conviene repasar los temas que falló."
      : "Conviene repasar con las flashcards y el wiki.";
  }
  // ============================================================
  //  BANCO DE EJERCICIOS ABIERTOS DEL SIMULADOR
  //  Sale de window.EJERCICIOS (ejercicios-data.js), el mismo corpus que
  //  muestra la vista #/ejercicios. Se toman los de evaluación y los
  //  oficiales de la guía —los que de verdad tomaron en un examen—, sin
  //  los parametrizados por K (sin el K asignado no se pueden corregir).
  // ============================================================
  var EJ = window.EJERCICIOS || {};
  function openBank() {
    return (EJ.items || []).filter(function (e) {
      return (e.coleccion === "examen" || e.oficial) &&
        (e.tags || []).indexOf("parametrizado") < 0 &&
        !!(e.enunciadoHtml || "").trim() &&
        !!(e.resolucionHtml || "").trim();
    });
  }

  // Recorte del banco por unidades: '#/parcial?u=1,2' arma un simulacro del
  // tramo del programa que pide el plan de estudio. Las unidades llegan en la
  // query separadas por comas; sin query entra todo el programa.
  function unidadesPedidas() {
    var out = [];
    String((A.parseRoute().query || {}).u || "").split(",").forEach(function (k) {
      k = k.trim();
      if (k && out.indexOf(k) < 0) out.push(k);
    });
    return out;
  }
  function bancoAbierto(us) {
    var todo = openBank();
    if (!us || !us.length) return todo;
    return todo.filter(function (e) { return us.indexOf(e.unidad) >= 0; });
  }
  // Las preguntas de opción múltiple no tienen unidad propia: la toma de la
  // página del wiki que explican. La que no enlaza ninguna sirve para cualquier
  // tramo y se deja pasar.
  function bancoMcq(us) {
    var todo = buildQuizPool();
    if (!us || !us.length) return todo;
    return todo.filter(function (q) {
      var p = q.slug && BY_SLUG[q.slug];
      // [bundle] a la unidad de una página la plataforma la llama `division`
      // («meta» es la transversal, que sirve para cualquier tramo). En el
      // baseline el campo era `unidad`: se aceptan los dos, así el módulo sigue
      // valiendo contra el dato original.
      var pu = p && (p.unidad || (p.division !== "meta" ? p.division : ""));
      return !pu || us.indexOf(pu) >= 0;
    });
  }

  // Enlace a la ficha del ejercicio: lo arma ejercicios.js, que es quien sabe en
  // qué colección cae cada evaluación (parciales o finales). Sin eso el enlace
  // apuntaba a la colección 'examen' del dato y la vista tenía que corregir el
  // hash con un render de más.
  function ejHref(it) {
    return A.ejercicioHref ? A.ejercicioHref(it) : "#/ejercicios/" + it.unidad;
  }

  // Enunciado y resolución se pintan con el mismo tratamiento que en la vista de
  // ejercicios —matemática, tablas, callouts y diagramas de mermaid—, que es de
  // ejercicios.js porque el corpus es suyo. Si el módulo no estuviera cargado
  // queda el camino de siempre, sin diagramas.
  function pintarEj(host, html, it) {
    if (!host) return;
    if (A.pintarEjercicio) { A.pintarEjercicio(host, html || "", it); return; }
    host.innerHTML = A.renderMathHtml(html || "");
    try { enhanceDoc(host); } catch (e) {}
  }
  // Un ejercicio etiquetado 'respuesta-simbolica' se contesta con una fórmula en
  // los parámetros del enunciado, no con un número: el simulador lo deja en el
  // banco pero avisa que la corrección es comparar la expresión con la resolución.
  function esSimbolico(it) {
    return (it.tags || []).indexOf("respuesta-simbolica") >= 0;
  }
  function notaSimbolicaHtml() {
    return '<div class="exam-simbolica">' + icon("sigma", 14) +
      " <b>Respuesta simbólica:</b> compare su expresión con la resolución." + "</div>";
  }

  function pintarEnunciados(root, items) {
    $$("[data-ej-enun]", root).forEach(function (h) {
      var it = items[+h.dataset.ejEnun];
      if (it) pintarEj(h, it.enunciadoHtml, it);
    });
  }
  function pintarResoluciones(root, items) {
    $$("[data-ej-reso]", root).forEach(function (h) {
      var it = items[+h.dataset.ejReso];
      if (it) pintarEj(h, it.resolucionHtml, it);
    });
  }

  // ============================================================
  //  3) SIMULADOR DE PARCIAL CRONOMETRADO  (feature estrella)
  // ============================================================
  var examSession = null;   // estado de la sesión en curso
  var examTimer = null;     // id de setInterval del cronómetro

  function clearExamTimer() { if (examTimer) { clearInterval(examTimer); examTimer = null; } }

  // construir el set de ítems: mezcla MCQ (del pool de quiz) + ejercicios abiertos
  function buildExamItems(nItems, us) {
    var mcqPool = shuffle(bancoMcq(us));
    var openPool = shuffle(bancoAbierto(us));

    // proporción ~60% MCQ / 40% abiertos, acotada por lo disponible
    var nOpen = Math.min(openPool.length, Math.max(1, Math.round(nItems * 0.4)));
    var nMcq = Math.min(mcqPool.length, nItems - nOpen);
    // si faltan abiertos, completar con MCQ y viceversa
    if (nMcq + nOpen < nItems) nOpen = Math.min(openPool.length, nItems - nMcq);

    var items = [];
    mcqPool.slice(0, nMcq).forEach(function (q) {
      items.push({
        kind: "mcq",
        q: q.q,
        opts: q.texOpts ? q.texOpts.map(katexSafe) : q.options.map(function (o) { return rich(o); }),
        correct: q.correct,
        explain: q.explain || "",
        slug: q.slug,
        answer: null,   // índice elegido
      });
    });
    openPool.slice(0, nOpen).forEach(function (e) {
      items.push({
        kind: "open",
        id: e.id, titulo: e.titulo, unidad: e.unidad, coleccion: e.coleccion,
        tags: e.tags || [],
        enunciadoHtml: e.enunciadoHtml || "", resolucionHtml: e.resolucionHtml || "",
        revealed: false,
        self: null,     // 'ok' | 'half' | 'no'
      });
    });
    return shuffle(items);
  }

  A.registerView("parcial", function (main, arg) {
    // [bundle] el título de la pestaña lo compone el ANFITRIÓN: la vista pide
    // un rótulo y la plataforma le agrega el nombre de la materia.
    if (A.setTitle) A.setTitle("Simulador de parcial");
    if (arg === "resultado" && examSession && examSession.finished) { drawExamResults(main); return; }
    if (examSession && !examSession.finished) { drawExamItem(main); return; }
    // setup
    clearExamTimer();
    examSession = null;
    drawExamSetup(main);
  });

  // ---------- setup ----------
  function drawExamSetup(main) {
    var us = unidadesPedidas();
    var nOpen = bancoAbierto(us).length;
    var nMcq = bancoMcq(us).length;
    // sin material del tramo pedido no hay simulacro que armar: se avisa y se
    // ofrece el programa completo, en vez de tomar un parcial de otra unidad
    var sinMaterial = us.length && !nOpen && !nMcq;
    var avisoU = us.length
      ? '<div class="exam-units-note">' + icon("layers", 13) + " " +
        (sinMaterial
          ? "No hay material de " + escapeHtml(us.map(A.unitShort).join(", ")) + " para armar un parcial."
          : "Solo entran ítems de " + escapeHtml(us.map(A.unitShort).join(", ")) + ".") +
        ' <a href="#/parcial" data-nav>Tomar todo el programa</a></div>'
      : "";

    main.innerHTML =
      '<h1 class="section-title">Simulador de parcial</h1>' +
      '<p class="section-sub">Opción múltiple + ejercicios abiertos, cronometrado. Si el reloj llega a cero, se entrega solo.</p>' +
      avisoU +
      '<div class="exam-setup">' +
        '<div class="card exam-setup-card">' +
          '<div class="eyebrow">Duración</div>' +
          '<div class="seg" id="examDur" role="group" aria-label="Duración">' +
            durBtn(30, false) + durBtn(60, true) + durBtn(90, false) +
          "</div>" +
        "</div>" +
        '<div class="card exam-setup-card">' +
          '<div class="eyebrow">Cantidad de ítems</div>' +
          '<div class="seg" id="examLen" role="group" aria-label="Cantidad de ítems">' +
            lenBtn(5, false) + lenBtn(8, true) + lenBtn(12, false) +
          "</div>" +
          '<div class="exam-setup-hint">' + icon("layers", 13) + " ~60% opción múltiple · ~40% ejercicios abiertos.</div>" +
        "</div>" +
      "</div>" +
      '<div class="exam-bank-note">Banco disponible: <b>' + nMcq + "</b> preguntas de opción múltiple · <b>" + nOpen + "</b> ejercicios abiertos." +
        (!nOpen && nMcq ? " Con este recorte el simulacro sale entero de opción múltiple." : "") + "</div>" +
      '<div style="margin-top:22px"><button class="btn primary" data-action="exam-start"' + (sinMaterial ? " disabled" : "") +
        ' style="font-size:15px;padding:12px 22px">' +
        icon("play", 17) + " Empezar el parcial</button></div>";

    // seg toggles
    bindSeg($("#examDur"));
    bindSeg($("#examLen"));
  }
  function durBtn(m, on) { return '<button data-dur="' + m + '"' + (on ? ' class="on"' : "") + ">" + m + " min</button>"; }
  function lenBtn(n, on) { return '<button data-len="' + n + '"' + (on ? ' class="on"' : "") + ">" + n + " ítems</button>"; }
  function bindSeg(group) {
    if (!group) return;
    $$("button", group).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", group).forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
      });
    });
  }

  A.registerAction("exam-start", function () {
    var durEl = $("#examDur button.on"), lenEl = $("#examLen button.on");
    var minutes = durEl ? +durEl.dataset.dur : 60;
    var nItems = lenEl ? +lenEl.dataset.len : 8;
    var us = unidadesPedidas();
    var items = buildExamItems(nItems, us);
    if (!items.length) { A.toast("No hay material suficiente para el parcial."); return; }
    examSession = {
      items: items, i: 0, unidades: us,
      total: minutes * 60,
      remaining: minutes * 60,
      finished: false,
      startedAt: Date.now(),
    };
    startExamTimer();
    drawExamItem($("#main"));
  });

  function startExamTimer() {
    clearExamTimer();
    examTimer = setInterval(function () {
      if (!examSession || examSession.finished) { clearExamTimer(); return; }
      examSession.remaining--;
      if (examSession.remaining <= 0) {
        examSession.remaining = 0;
        updateTimerDisplay();
        finishExam(true);
        return;
      }
      updateTimerDisplay();
    }, 1000);
  }

  function fmtClock(secs) {
    secs = Math.max(0, secs | 0);
    var m = Math.floor(secs / 60), s = secs % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }
  function updateTimerDisplay() {
    var el = $("#examClock"); if (!el || !examSession) return;
    el.textContent = fmtClock(examSession.remaining);
    var bar = examSession.remaining / examSession.total;
    el.parentElement.classList.toggle("low", examSession.remaining <= 60);
    el.parentElement.classList.toggle("mid", examSession.remaining > 60 && bar <= 0.25);
    var fill = $("#examTimeFill"); if (fill) fill.style.width = (bar * 100) + "%";
  }

  // ---------- ítem en curso ----------
  function drawExamItem(main) {
    var s = examSession;
    if (!s) { A.go("#/parcial"); return; }
    var it = s.items[s.i];

    var head =
      '<div class="exam-bar">' +
        '<div class="exam-timer' + (s.remaining <= 60 ? " low" : "") + '">' + icon("timer", 16) +
          ' <span id="examClock">' + fmtClock(s.remaining) + "</span></div>" +
        '<div class="exam-time-track"><i id="examTimeFill" style="width:' + (s.remaining / s.total * 100) + '%"></i></div>' +
        '<button class="btn sm danger" data-action="exam-submit-confirm">' + icon("check", 14) + " Entregar</button>" +
      "</div>" +
      '<div class="exam-progress-row">' +
        '<span class="exam-prog-label">' + progLabel(s) + "</span>" +
        '<div class="exam-dots">' + s.items.map(function (item, idx) {
          var cls = "exam-dot";
          if (idx === s.i) cls += " cur";
          if (itemAnswered(item)) cls += " done";
          return '<button class="' + cls + '" data-examgo="' + idx + '"' +
            (idx === s.i ? ' aria-current="true"' : "") +
            ' aria-label="' + dotLabel(item, idx, s.items.length) + '"></button>';
        }).join("") + "</div>" +
      "</div>";

    var body = it.kind === "mcq" ? examMcqHtml(it, s.i) : examOpenHtml(it, s.i);

    var nav =
      '<div class="exam-nav">' +
        '<button class="btn ghost" data-action="exam-prev"' + (s.i === 0 ? " disabled" : "") + ">" + icon("chev", 14) + " Anterior</button>" +
        (s.i + 1 < s.items.length
          ? '<button class="btn primary" data-action="exam-next">Siguiente ' + icon("arrowright", 14) + "</button>"
          : '<button class="btn primary" data-action="exam-submit-confirm">' + icon("check", 14) + " Entregar parcial</button>") +
      "</div>";

    // El estado del examen queda declarado en el contenedor: la mezcla de ítems es
    // aleatoria, así que el primero puede ser de opción múltiple y no montar ningún
    // enunciado. data-exam-kind dice qué se está mostrando sin tener que adivinarlo.
    main.innerHTML = '<div class="exam-stage" data-exam-ready="1" data-exam-kind="' + it.kind +
      '" data-exam-open="' + examMix(s).open + '">' +
      head + '<div class="exam-item card">' + body + "</div>" + nav + "</div>";

    bindExamItem(it, s.i);
    updateTimerDisplay();
  }

  function itemAnswered(it) {
    return it.kind === "mcq" ? it.answer != null : it.self != null;
  }
  // Composición del examen ya armado. Se muestra siempre porque el reparto entre
  // opción múltiple y ejercicios abiertos depende de lo que haya en el banco del
  // tramo pedido: un simulacro sin ejercicios abiertos es un resultado válido y
  // conviene que se lea, en vez de parecer que los enunciados no cargaron.
  function examMix(s) {
    var open = s.items.filter(function (it) { return it.kind === "open"; }).length;
    return { open: open, mcq: s.items.length - open };
  }
  function progLabel(s) {
    var ans = s.items.filter(itemAnswered).length;
    var m = examMix(s);
    return "Ítem " + (s.i + 1) + " / " + s.items.length + " · " + ans + " respondido" + (ans === 1 ? "" : "s") +
      " · " + m.mcq + " de opción múltiple y " + m.open + " abierto" + (m.open === 1 ? "" : "s");
  }
  // El punto es el único salto directo a un ítem del examen: sin rótulo no se
  // puede usar con lector de pantalla ni se sabe cuál falta contestar.
  function dotLabel(item, idx, total) {
    return "Ítem " + (idx + 1) + " de " + total + (itemAnswered(item) ? ", respondido" : ", sin responder");
  }

  function examMcqHtml(it, idx) {
    return '<div class="exam-kind">' + icon("quiz", 14) + " Opción múltiple</div>" +
      '<div class="quiz-q">' + rich(it.q) + "</div>" +
      '<div class="quiz-opts" id="examOpts">' +
        it.opts.map(function (o, i) {
          var sel = it.answer === i ? " selected-ans" : "";
          return '<button class="quiz-opt' + sel + '" data-examopt="' + i + '"><span class="mark">' + String.fromCharCode(65 + i) + "</span><span>" + o + "</span></button>";
        }).join("") +
      "</div>";
  }

  function examOpenHtml(it, idx) {
    var um = unitMeta(it.unidad);
    var selBtns =
      '<div class="exam-self">' +
        '<div class="exam-self-q">¿Cómo le fue?</div>' +
        '<div class="exam-self-btns">' +
          selfBtn(it, "ok", "Bien", "grade-easy") +
          selfBtn(it, "half", "A medias", "grade-hard") +
          selfBtn(it, "no", "Mal", "grade-again") +
        "</div></div>";
    return '<div class="exam-kind">' + icon("pencil", 14) + " Ejercicio abierto" +
        '<span class="badge" style="margin-left:8px"><span class="dot" style="background:' + um.color + '"></span>' + A.unitShort(it.unidad) + "</span></div>" +
      '<h3 class="exo-title">' + rich(it.titulo) + "</h3>" +
      '<div class="exo-prompt ej-doc ej-enunciado" data-ej-enun="' + idx + '" style="--ucol:' + um.color + '"></div>' +
      (esSimbolico(it) ? notaSimbolicaHtml() : "") +
      '<button class="btn sm" data-action="exam-reveal"' + (it.revealed ? " hidden" : "") + ' style="margin-top:8px">' + icon("eye", 15) + " Ver solución</button>" +
      '<div class="exam-sol' + (it.revealed ? " show" : "") + '" id="examSol">' +
        '<div class="exam-sol-label">' + icon("lightbulb", 14) + " Solución</div>" +
        '<div class="exo-sol ej-doc" data-sol-de="' + idx + '"></div>' +
        '<div style="margin-top:10px"><a class="chip-btn" href="' + ejHref(it) + '" data-nav>' + icon("link", 14) + " Ver en Ejercicios</a></div>" +
        selBtns +
      "</div>";
  }
  function selfBtn(it, val, label, cls) {
    return '<button class="btn ' + cls + (it.self === val ? " on" : "") + '" data-examself="' + val + '">' + escapeHtml(label) + "</button>";
  }

  function bindExamItem(it, idx) {
    // dots de navegación
    $$("[data-examgo]").forEach(function (b) {
      b.addEventListener("click", function () { gotoExamItem(+b.dataset.examgo); });
    });
    if (it.kind === "mcq") {
      $$("#examOpts [data-examopt]").forEach(function (b) {
        b.addEventListener("click", function () {
          it.answer = +b.dataset.examopt;
          $$("#examOpts .quiz-opt").forEach(function (x) { x.classList.remove("selected-ans"); });
          b.classList.add("selected-ans");
          refreshExamDots();
        });
      });
    } else {
      var stage = $(".exam-item");
      // el enunciado se pinta siempre; la resolución, al revelarla: KaTeX mide
      // mal dentro de un contenedor con display:none
      pintarEnunciados(stage, examSession ? examSession.items : []);
      var sol = $("#examSol"), pintada = false;
      function pintarSol() {
        if (pintada) return;
        pintada = true;
        pintarEj($("[data-sol-de]", sol), it.resolucionHtml, it);
      }
      var revealBtn = $('[data-action="exam-reveal"]');
      if (revealBtn) {
        revealBtn.addEventListener("click", function () {
          it.revealed = true;
          sol.classList.add("show");
          revealBtn.hidden = true;
          pintarSol();
        });
      }
      if (it.revealed) pintarSol();
      $$("[data-examself]").forEach(function (b) {
        b.addEventListener("click", function () {
          it.self = b.dataset.examself;
          $$("[data-examself]").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          refreshExamDots();
        });
      });
    }
  }
  function refreshExamDots() {
    var s = examSession; if (!s) return;
    var dots = $$(".exam-dot");
    s.items.forEach(function (item, idx) {
      if (!dots[idx]) return;
      dots[idx].classList.toggle("done", itemAnswered(item));
      dots[idx].setAttribute("aria-label", dotLabel(item, idx, s.items.length));
    });
    var lbl = $(".exam-prog-label");
    if (lbl) lbl.textContent = progLabel(s);
  }

  function gotoExamItem(idx) {
    if (!examSession || idx < 0 || idx >= examSession.items.length) return;
    examSession.i = idx;
    drawExamItem($("#main"));
  }
  A.registerAction("exam-next", function () { if (examSession) gotoExamItem(examSession.i + 1); });
  A.registerAction("exam-prev", function () { if (examSession) gotoExamItem(examSession.i - 1); });
  A.registerAction("exam-reveal", function () {}); // manejado en bindExamItem

  // confirmación de entrega
  A.registerAction("exam-submit-confirm", function () {
    var s = examSession; if (!s) return;
    var pending = s.items.filter(function (it) { return !itemAnswered(it); }).length;
    var msg = pending
      ? "Quedan " + pending + " ítem" + (pending === 1 ? "" : "s") + " sin responder. ¿Entregar igual?"
      : "¿Entregar el parcial?";
    if (window.confirm(msg)) finishExam(false);
  });

  function finishExam(auto) {
    var s = examSession; if (!s || s.finished) return;
    clearExamTimer();
    s.finished = true;
    s.usedSecs = s.total - s.remaining;
    s.auto = !!auto;
    A.markActivity();
    if (auto) A.toast("Se acabó el tiempo. Parcial entregado.");
    // [bundle] la ruta del SPA no es un hash: se pregunta por `A.parseRoute()`,
    // que devuelve la vista y el argumento con la gramática del baseline.
    var rr = A.parseRoute();
    if (rr.view === "parcial" && rr.arg === "resultado") drawExamResults($("#main"));
    else A.go("#/parcial/resultado");
  }

  // ---------- resultados ----------
  function examScore(s) {
    var mcq = s.items.filter(function (it) { return it.kind === "mcq"; });
    var mcqCorrect = mcq.filter(function (it) { return it.answer === it.correct; }).length;
    var open = s.items.filter(function (it) { return it.kind === "open"; });
    // puntos abiertos: ok=1, half=0.5, no/sin autoeval=0
    var openPts = open.reduce(function (a, it) { return a + (it.self === "ok" ? 1 : it.self === "half" ? 0.5 : 0); }, 0);
    var totalPts = mcqCorrect + openPts;
    var maxPts = s.items.length;
    var pct = maxPts ? Math.round((totalPts / maxPts) * 100) : 0;
    return { mcq: mcq, mcqCorrect: mcqCorrect, open: open, openPts: openPts, totalPts: totalPts, maxPts: maxPts, pct: pct };
  }

  function drawExamResults(main) {
    var s = examSession;
    if (!s || !s.finished) { drawExamSetup(main); return; }
    var sc = examScore(s);
    // nota sobre 10
    var nota = Math.round(sc.pct / 10 * 10) / 10;

    var hero =
      '<div class="exam-result-hero card">' +
        '<div class="ring" style="--pct:' + sc.pct + ';--col:' + ringColor(sc.pct) + ';width:108px;height:108px"><b style="font-size:24px">' + sc.pct + "%</b></div>" +
        '<div class="exam-result-meta">' +
          "<h2>" + (sc.pct >= 60 ? "Aprobado" : "A repasar") + "</h2>" +
          '<p>' + quizVerdictMsg(sc.pct) + (s.auto ? " <b>Se entregó por tiempo.</b>" : "") + "</p>" +
          '<div class="stat-pills">' +
            '<span class="pill">Nota ≈ <b>' + nota + "/10</b></span>" +
            '<span class="pill">' + icon("quiz", 13) + " Opción múltiple <b>" + sc.mcqCorrect + "/" + sc.mcq.length + "</b></span>" +
            (sc.open.length ? '<span class="pill">' + icon("pencil", 13) + " Abiertos <b>" + (Math.round(sc.openPts * 10) / 10) + "/" + sc.open.length + "</b></span>" : "") +
            '<span class="pill">' + icon("clock", 13) + " Tiempo <b>" + fmtClock(s.usedSecs) + "</b></span>" +
          "</div>" +
        "</div>" +
      "</div>";

    var review = '<h2 class="subsection-title" style="margin-top:30px">' + icon("list", 16) + " Repaso ítem por ítem</h2>";
    review += '<div class="exam-review">' + s.items.map(function (it, idx) {
      return it.kind === "mcq" ? reviewMcq(it, idx) : reviewOpen(it, idx);
    }).join("") + "</div>";

    var foot = '<div class="exam-nav" style="margin-top:26px;justify-content:center">' +
      '<button class="btn primary" data-action="exam-restart">' + icon("refresh", 15) + " Otro parcial</button>" +
      '<button class="btn" data-nav="#/quiz">Ir al quiz</button>' +
      "</div>";

    main.innerHTML = '<h1 class="section-title">Resultado del parcial</h1>' + hero + review + foot;

    // enunciados y soluciones del repaso, con el tratamiento de ejercicios.js
    var rev = $(".exam-review");
    pintarEnunciados(rev, s.items);
    pintarResoluciones(rev, s.items);
  }

  function reviewMcq(it, idx) {
    var ok = it.answer === it.correct;
    var unanswered = it.answer == null;
    var tag = unanswered
      ? '<span class="exam-rev-tag skip">Sin responder</span>'
      : ok ? '<span class="exam-rev-tag ok">Correcta</span>' : '<span class="exam-rev-tag bad">Incorrecta</span>';
    var yours = unanswered ? "—" : String.fromCharCode(65 + it.answer) + ". " + it.opts[it.answer];
    var right = String.fromCharCode(65 + it.correct) + ". " + it.opts[it.correct];
    var slugLink = (it.slug && BY_SLUG[it.slug]) ? ' · <a href="#/p/' + it.slug + '" data-nav>wiki →</a>' : "";
    return '<div class="exam-rev-item">' +
      '<div class="exam-rev-head"><span class="exam-rev-n">' + (idx + 1) + "</span>" + tag + '<span class="exam-rev-kind">' + icon("quiz", 12) + " opción múltiple</span></div>" +
      '<div class="exam-rev-q">' + rich(it.q) + "</div>" +
      '<div class="exam-rev-ans">' +
        '<div class="' + (ok ? "ra-good" : "ra-bad") + '"><span>Su respuesta:</span> ' + yours + "</div>" +
        (ok ? "" : '<div class="ra-good"><span>Correcta:</span> ' + right + "</div>") +
      "</div>" +
      (it.explain ? '<div class="exam-rev-explain">' + rich(it.explain) + slugLink + "</div>" : (slugLink ? '<div class="exam-rev-explain">' + slugLink.replace(/^ · /, "") + "</div>" : "")) +
      "</div>";
  }

  function reviewOpen(it, idx) {
    var tag = it.self === "ok" ? '<span class="exam-rev-tag ok">Bien</span>'
      : it.self === "half" ? '<span class="exam-rev-tag mid">A medias</span>'
      : it.self === "no" ? '<span class="exam-rev-tag bad">Mal</span>'
      : '<span class="exam-rev-tag skip">Sin autoevaluar</span>';
    return '<div class="exam-rev-item">' +
      '<div class="exam-rev-head"><span class="exam-rev-n">' + (idx + 1) + "</span>" + tag + '<span class="exam-rev-kind">' + icon("pencil", 12) + " ejercicio abierto</span></div>" +
      '<div class="exam-rev-q"><b>' + rich(it.titulo) + "</b></div>" +
      '<div class="exo-prompt ej-doc ej-enunciado" data-ej-enun="' + idx + '" style="margin-top:6px;--ucol:' + A.unitMeta(it.unidad).color + '"></div>' +
      (esSimbolico(it) ? notaSimbolicaHtml() : "") +
      '<div class="exam-rev-sol"><div class="exam-sol-label">' + icon("lightbulb", 13) + " Solución</div>" +
        '<div class="exo-sol ej-doc" data-ej-reso="' + idx + '"></div>' +
        '<div style="margin-top:8px"><a class="chip-btn" href="' + ejHref(it) + '" data-nav>' + icon("link", 13) + " Ver en Ejercicios</a></div>" +
      "</div></div>";
  }

  // "Otro parcial" conserva el tramo del programa con el que se armó este
  A.registerAction("exam-restart", function () {
    var us = (examSession && examSession.unidades) || [];
    clearExamTimer(); examSession = null;
    A.go("#/parcial" + (us.length ? "?u=" + encodeURIComponent(us.join(",")) : ""));
  });
  // ============================================================
  //  TECLADO DEL EXAMEN
  //  [bundle] El baseline recibía un evento global `app:key` que despachaba
  //  `core.js`. La plataforma no lo tiene, así que el módulo ata su propio
  //  `keydown` en `document` —los puntos de progreso y las opciones no son
  //  focusables, así que un listener sobre el contenedor no llegaría— y lo
  //  filtra por la vista en curso, exactamente como hacía `curView()`.
  //  Se retira con el bundle (`A.onTeardown`): sin eso se acumularía un
  //  listener por cada entrada a la materia.
  // ============================================================
  function curView() { return A.parseRoute().view; }

  function onKey(e) {
    if (!e || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    // Escribir en un campo no puede mover el examen.
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ""))) return;
    if (curView() !== "parcial" || !examSession || examSession.finished) return;

    if (e.key === "ArrowRight") { e.preventDefault(); gotoExamItem(examSession.i + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); gotoExamItem(examSession.i - 1); }
    else {
      var it = examSession.items[examSession.i];
      if (it && it.kind === "mcq" && /^[1-9]$/.test(e.key)) {
        var oi = +e.key - 1;
        if (oi < it.opts.length) {
          e.preventDefault();
          it.answer = oi;
          $$("#examOpts .quiz-opt").forEach(function (x, i) { x.classList.toggle("selected-ans", i === oi); });
          refreshExamDots();
        }
      }
    }
  }
  document.addEventListener("keydown", onKey);
  if (A.onTeardown) {
    A.onTeardown(function () {
      document.removeEventListener("keydown", onKey);
      clearExamTimer();
      examSession = null;
    });
  }
})();
