/* ============================================================
   simulacros.js — vista «simulacros» del bundle derecho-final.

   Port de `study-app/public/js/views/simulacros.js` (rutas /simulacros/:id?
   y /registro de la study-app) a una única vista de herramienta de Sinapsis
   contra window.App. Dos secciones que conviven en un mismo registerView,
   distinguidas por `arg`:

     ""        lista de los 7 simulacros del kit (S0-S6), tipo, fecha y
               último resultado guardado.
     "S0".."S6" runner del simulacro: responder (con cronómetro) → corrección
               oculta hasta terminar → resumen → guardar en el registro.
     "registro" tabla de todos los resultados guardados (incluidos los que
               agregue la vista «simulador», tipo "generado") con «copiar
               fila en markdown».

   DATOS: App.DATA["data/kit.json"].simulacros / .temas / .reglas (§2 del
   contrato del bundle). Los slugs de página ya son el identificador final
   (a diferencia de la study-app, que usaba rutas con carpeta): no hace
   falta basename().

   ESTADO COMPARTIDO (A.LS, §4 del contrato):
     "simulacros" → { results: [...] }  (leer-modificar-escribir; también la
                     escribe la vista «simulador»)
     "ajustes"    → { minutosPorPregunta: 12 }  (la escribe «simulador»)

   CRONÓMETRO: un solo setInterval por sesión de runner, creado una única
   vez al entrar a la fase "responder" (crearTemporizador más abajo), nunca
   recreado por un re-render posterior (alternar "responder en papel" solo
   reconstruye las consignas, no el reloj), y liberado en el cleanup que
   devuelve registerView.

   Nada de HTML concatenado con datos: todo el marcado se arma con
   document.createElement / el() propio; lo único que entra como HTML es lo
   que devuelve A.renderMarkdown, pasado por fragmento() (DOMParser + poda
   de script/estilo/handlers), igual que en el ejemplo de referencia
   subjects/cripto/tools/cripto-parciales/parciales.js.
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || !A.registerView) return;

  // ----------------------------------------------------------------------
  // PURAS — sin DOM. Se copian tal cual a un script de Node para el smoke
  // test del §7 del contrato (umbral, formato de fila markdown).
  // ----------------------------------------------------------------------

  function fmtFechaDDMMYYYY(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    // Getters UTC: `at` siempre se guarda con toISOString() (sufijo "Z"), así
    // el resultado no depende de la zona horaria de quien mira el registro.
    var dd = String(d.getUTCDate()).padStart(2, "0");
    var mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    var yyyy = d.getUTCFullYear();
    return dd + "/" + mm + "/" + yyyy;
  }

  function puntajeCell(p) {
    if (p === null || p === undefined) return "—";
    if (p === 0.5) return "½";
    return String(p);
  }

  function esFallado(p) {
    return p === null || p === undefined || p < 1;
  }

  /** umbral(puntajes) → al menos 1 punto pleno (no ½) en 4 de las 5 preguntas. */
  function umbral(puntajes) {
    if (!Array.isArray(puntajes)) return false;
    var n = 0;
    for (var i = 0; i < puntajes.length; i += 1) {
      if (puntajes[i] === 1) n += 1;
    }
    return n >= 4;
  }

  /**
   * filaMarkdown(result, simulacrosById, temasBySlug) → fila de tabla para
   * pegar en wiki/final-completo/registro-simulacros.md:
   * "| dd/mm/aaaa | [[simulacro-1]] | 1 | ½ | 0 | 1 | 1 | ✓ | [[ficha-a]], [[ficha-b]] |"
   * - tipo "generado" → "simulador (gen)" en vez del wikilink al simulacro.
   * - el resultado guardado no lleva el slug de página (no está en el
   *   esquema del contrato): se resuelve contra `simulacrosById` por `id`.
   * - fichas: la del tema de cada consigna fallada (puntaje < 1 o sin
   *   puntuar), en el orden de aparición, sin duplicados.
   */
  function filaMarkdown(result, simulacrosById, temasBySlug) {
    var r = result || {};
    var porId = simulacrosById || {};
    var porSlug = temasBySlug || {};
    var fecha = fmtFechaDDMMYYYY(r.at);

    var simCol;
    if (r.tipo === "generado") {
      simCol = "simulador (gen)";
    } else {
      var sim = porId[r.id];
      var slugPagina = sim && sim.pagina ? sim.pagina : r.id || "";
      simCol = "[[" + slugPagina + "]]";
    }

    var puntajes = Array.isArray(r.puntajes) ? r.puntajes : [];
    var celdas = [0, 1, 2, 3, 4].map(function (i) {
      return puntajeCell(puntajes[i]);
    });
    var pasa = typeof r.umbral === "boolean" ? r.umbral : umbral(puntajes);
    var marca = pasa ? "✓" : "✗";

    var consignas = Array.isArray(r.consignas) ? r.consignas : [];
    var fichas = [];
    consignas.forEach(function (c, i) {
      if (!esFallado(puntajes[i])) return;
      var slug = c && c.temaSlug;
      if (!slug) return;
      var tema = porSlug[slug];
      if (!tema || !tema.ficha) return;
      var link = "[[" + tema.ficha + "]]";
      if (fichas.indexOf(link) === -1) fichas.push(link);
    });
    var fichasCol = fichas.length ? fichas.join(", ") : "—";

    return "| " + fecha + " | " + simCol + " | " + celdas.join(" | ") + " | " + marca + " | " + fichasCol + " |";
  }

  /** temasFallados(results) → [{slug, veces}] ordenado desc por veces. */
  function temasFallados(results) {
    var counts = {};
    var orden = [];
    (Array.isArray(results) ? results : []).forEach(function (r) {
      var puntajes = Array.isArray(r.puntajes) ? r.puntajes : [];
      var consignas = Array.isArray(r.consignas) ? r.consignas : [];
      consignas.forEach(function (c, i) {
        var slug = c && c.temaSlug;
        if (!slug) return;
        if (!esFallado(puntajes[i])) return;
        if (!Object.prototype.hasOwnProperty.call(counts, slug)) {
          counts[slug] = 0;
          orden.push(slug);
        }
        counts[slug] += 1;
      });
    });
    return orden
      .map(function (slug) {
        return { slug: slug, veces: counts[slug] };
      })
      .sort(function (a, b) {
        return b.veces - a.veces || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
      });
  }

  /** consecutivosConUmbral(results) → racha final (cronológica) con umbral cumplido. */
  function consecutivosConUmbral(results) {
    var lista = Array.isArray(results) ? results.slice() : [];
    lista.sort(function (a, b) {
      return new Date(a.at).getTime() - new Date(b.at).getTime();
    });
    var racha = 0;
    for (var i = lista.length - 1; i >= 0; i -= 1) {
      var r = lista[i];
      var puntajes = Array.isArray(r.puntajes) ? r.puntajes : [];
      var pasa = typeof r.umbral === "boolean" ? r.umbral : umbral(puntajes);
      if (!pasa) break;
      racha += 1;
    }
    return racha;
  }

  function ultimoResultado(results, simulacroId) {
    var propios = (Array.isArray(results) ? results : []).filter(function (r) {
      return r.id === simulacroId;
    });
    if (!propios.length) return null;
    return propios
      .slice()
      .sort(function (a, b) {
        return new Date(b.at).getTime() - new Date(a.at).getTime();
      })[0];
  }

  // ----------------------------------------------------------------------
  // Constantes
  // ----------------------------------------------------------------------

  var TIPO_LABEL = {
    diagnostico: "Diagnóstico",
    real: "Real",
    sintetico: "Sintético",
    generado: "Generado",
  };

  // ----------------------------------------------------------------------
  // Helpers de DOM — sin concatenar HTML con datos (regla dura §6.2)
  // ----------------------------------------------------------------------

  function agregarHijo(node, hijo) {
    if (hijo === null || hijo === undefined || hijo === false) return;
    if (Array.isArray(hijo)) {
      hijo.forEach(function (h) {
        agregarHijo(node, h);
      });
      return;
    }
    if (hijo.nodeType) node.appendChild(hijo);
    else node.appendChild(document.createTextNode(String(hijo)));
  }

  function el(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") {
        node.className = v;
      } else if (k === "dataset") {
        Object.keys(v).forEach(function (dk) {
          node.dataset[dk] = v[dk];
        });
      } else if (k.slice(0, 2) === "on" && typeof v === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v === true) {
        node.setAttribute(k, "");
      } else {
        node.setAttribute(k, String(v));
      }
    });
    for (var i = 2; i < arguments.length; i += 1) agregarHijo(node, arguments[i]);
    return node;
  }

  /* Etiquetas que se podan enteras del HTML renderizado: activas (script,
     estilo, formularios, medios embebidos) o que pueden introducir su propio
     árbol de atributos/espacio de nombres (svg, math) sin aportar nada al
     contenido de estudio. */
  var ETIQUETAS_PODADAS = [
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "form",
    "base",
    "link",
    "meta",
    "svg",
    "math",
    "input",
    "textarea",
    "select",
    "button",
  ];

  /* Atributos que pueden portar una URL: se sanean aparte de los "on*". */
  var ATRIBUTOS_URL = ["href", "src", "action", "formaction", "xlink:href", "data", "poster", "srcset", "background"];

  /**
   * Función pura (sin DOM): decide si el valor de un atributo de URL es
   * seguro para dejar en el HTML saneado. Normaliza quitando los caracteres
   * \u0000-  (tabs, saltos de línea y demás espacios en blanco que
   * permiten disfrazar "javascript:" como "jav\tascript:") y pasa a
   * minúsculas; solo se admite sin esquema (ruta relativa, "#…" o "/…") o
   * con esquema http:, https: o mailto:. Se prueba aparte con node contra
   * casos conocidos (BUNDLE.md §7).
   */
  function urlPermitida(valorCrudo) {
    var valor = String(valorCrudo == null ? "" : valorCrudo)
      .replace(/[\u0000- ]/g, "")
      .toLowerCase();
    var esquema = /^[a-z][a-z0-9+.-]*:/.exec(valor);
    if (!esquema) return true;
    return esquema[0] === "http:" || esquema[0] === "https:" || esquema[0] === "mailto:";
  }

  /**
   * El markdown ya compuesto (A.renderMarkdown), como nodos: se parsea en un
   * documento aparte —donde nada se ejecuta ni se carga— y se poda antes de
   * adjuntarlo. Igual que fragmento() en el ejemplo de referencia de cripto,
   * ampliado tras la auditoría final: más etiquetas peligrosas podadas
   * enteras y las URL normalizadas y validadas por esquema, no solo por el
   * prefijo "javascript:".
   */
  function fragmento(md, slugActual) {
    var html = A.renderMarkdown ? A.renderMarkdown(md || "", slugActual) : "";
    var doc = new DOMParser().parseFromString("<body>" + html + "</body>", "text/html");
    doc.body.querySelectorAll(ETIQUETAS_PODADAS.join(", ")).forEach(function (n) {
      n.remove();
    });
    doc.body.querySelectorAll("*").forEach(function (n) {
      Array.prototype.slice.call(n.attributes).forEach(function (at) {
        var nombre = at.name.toLowerCase();
        if (nombre.indexOf("on") === 0) {
          n.removeAttribute(at.name);
          return;
        }
        if (ATRIBUTOS_URL.indexOf(nombre) !== -1 && !urlPermitida(at.value)) {
          n.removeAttribute(at.name);
        }
      });
    });
    var frag = document.createDocumentFragment();
    while (doc.body.firstChild) frag.appendChild(doc.body.firstChild);
    return frag;
  }

  function irA(clase, ruta, texto) {
    // href + data-nav con la ruta (por si el runtime mira uno u otro) para
    // que el clic navegue sin recargar, sin listener propio (contrato §3).
    return el("a", { class: clase, href: ruta, "data-nav": ruta }, texto);
  }

  function irAPagina(clase, slug, texto) {
    return el("a", { class: clase, href: "#/p/" + slug, "data-go": slug }, texto);
  }

  function copiarTexto(texto, mensajeOk) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(texto).then(
        function () {
          if (A.toast) A.toast(mensajeOk, "ok");
        },
        function () {
          if (A.toast) A.toast("No se pudo copiar automáticamente.", "bad");
        },
      );
    } else if (A.toast) {
      A.toast("No se pudo copiar automáticamente.", "bad");
    }
  }

  // ----------------------------------------------------------------------
  // Datos y estado compartido
  // ----------------------------------------------------------------------

  function kitData() {
    return (A.DATA && (A.DATA.kit || A.DATA["data/kit.json"])) || {};
  }

  function temasBySlugMap(kit) {
    var out = {};
    (Array.isArray(kit.temas) ? kit.temas : []).forEach(function (t) {
      if (t && t.slug) out[t.slug] = t;
    });
    return out;
  }

  function simulacrosByIdMap(kit) {
    var out = {};
    (Array.isArray(kit.simulacros) ? kit.simulacros : []).forEach(function (s) {
      if (s && s.id) out[s.id] = s;
    });
    return out;
  }

  function leerAjustes() {
    var raw = A.LS && typeof A.LS.get === "function" ? A.LS.get("ajustes", {}) : {};
    var minutos = raw && typeof raw.minutosPorPregunta === "number" && raw.minutosPorPregunta > 0 ? raw.minutosPorPregunta : 12;
    return { minutosPorPregunta: minutos };
  }

  function leerSimulacrosLS() {
    var raw = A.LS && typeof A.LS.get === "function" ? A.LS.get("simulacros", { results: [] }) : { results: [] };
    if (!raw || !Array.isArray(raw.results)) return { results: [] };
    return raw;
  }

  function guardarEnRegistro(nuevo) {
    var actual = leerSimulacrosLS();
    var siguiente = { results: actual.results.concat([nuevo]) };
    if (A.LS && typeof A.LS.set === "function") A.LS.set("simulacros", siguiente);
    return siguiente;
  }

  // ----------------------------------------------------------------------
  // Lectura del argumento de ruta (como estado(arg) del ejemplo de cripto)
  // ----------------------------------------------------------------------

  function argActual(arg) {
    var crudo = arg === null || arg === undefined ? "" : String(arg);
    if (!crudo && typeof location !== "undefined") {
      var qs = String(location.search || "").replace(/^\?/, "");
      var m = /(?:^|&)arg=([^&]*)/.exec(qs);
      if (m) crudo = decodeURIComponent(m[1] || "");
    }
    return crudo;
  }

  // ----------------------------------------------------------------------
  // Cronómetro — un solo setInterval, creado una vez, liberado en cleanup
  // ----------------------------------------------------------------------

  function crearTemporizador(segundosTotal, onFin) {
    var restante = segundosTotal;
    var intervalId = null;
    var nodo = el("span", {
      class: "df-simc-cifra",
      role: "timer",
      "aria-live": "polite",
      "aria-atomic": "true",
    });

    function pintar() {
      var s = Math.max(restante, 0);
      var m = Math.floor(s / 60);
      var seg = s % 60;
      nodo.textContent = (m < 10 ? "0" + m : String(m)) + ":" + (seg < 10 ? "0" + seg : String(seg));
    }

    function detener() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function tick() {
      restante -= 1;
      pintar();
      if (restante <= 0) {
        detener();
        if (typeof onFin === "function") onFin();
      }
    }

    function iniciar() {
      if (intervalId !== null) return;
      intervalId = setInterval(tick, 1000);
    }

    pintar();
    return {
      el: nodo,
      iniciar: iniciar,
      pausar: detener,
      get restante() {
        return restante;
      },
    };
  }

  // ----------------------------------------------------------------------
  // Vista: lista (arg === "")
  // ----------------------------------------------------------------------

  function tarjetaSimulacro(s, temasMap, results) {
    var card = el(
      "article",
      { class: "df-simc-card" },
      el(
        "div",
        { class: "df-simc-card-top" },
        el("h2", {}, s.titulo || s.id),
        el("span", { class: "df-simc-badge" }, TIPO_LABEL[s.tipo] || s.tipo || "—"),
      ),
    );

    if (s.fecha) card.appendChild(el("p", { class: "df-simc-fecha" }, s.fecha));

    var notas = [];
    if (s.id === "S0") notas.push("Conviene resolverlo antes de estudiar.");
    if (s.id === "S6") notas.push("Es el termómetro más fiel: el final real más reciente.");
    if (notas.length) card.appendChild(el("p", { class: "df-simc-nota" }, notas.join(" ")));

    var pillRow = el("div", { class: "df-simc-pills" });
    (Array.isArray(s.consignas) ? s.consignas : []).slice(0, 5).forEach(function (c) {
      if (!c || !c.temaSlug) {
        pillRow.appendChild(el("span", { class: "df-simc-pill" }, "—"));
        return;
      }
      var tema = temasMap[c.temaSlug];
      var tier = tema ? tema.tier : null;
      var pill = el("span", { class: "df-simc-pill" + (tier ? " df-simc-pill-" + tier : "") });
      if (tema) {
        pill.appendChild(document.createTextNode(tema.nombre + " · "));
        pill.appendChild(el("span", { class: "df-simc-sr-only" }, "Tier "));
        pill.appendChild(document.createTextNode(tier || "?"));
      } else {
        pill.appendChild(document.createTextNode(c.temaSlug));
      }
      pillRow.appendChild(pill);
    });
    card.appendChild(pillRow);

    var ultimo = ultimoResultado(results, s.id);
    if (ultimo) {
      var puntajesTxt = (ultimo.puntajes || []).map(puntajeCell).join(" · ");
      var pasa = typeof ultimo.umbral === "boolean" ? ultimo.umbral : umbral(ultimo.puntajes);
      card.appendChild(
        el(
          "p",
          { class: "df-simc-ultimo" },
          "Último intento: " + puntajesTxt + " ",
          el("span", { class: "df-simc-badge " + (pasa ? "df-simc-badge-ok" : "df-simc-badge-bad") }, pasa ? "Cumple el umbral" : "No cumple el umbral"),
        ),
      );
    } else {
      card.appendChild(el("p", { class: "df-simc-ultimo df-simc-muted" }, "Todavía no tiene intentos."));
    }

    card.appendChild(irA("df-simc-btn df-simc-btn-primario df-simc-btn-block", "#/simulacros/" + s.id, "Iniciar"));
    return card;
  }

  function renderLista(main, kit, temasMap) {
    var raiz = el(
      "div",
      { class: "df-simc" },
      el(
        "header",
        { class: "df-simc-header" },
        el("h1", {}, "Simulacros reales"),
        el(
          "p",
          { class: "df-simc-lead" },
          "Los siete simulacros del kit del final (S0 a S6). Cada uno reúne cinco consignas reales, con corrección oculta hasta terminar.",
        ),
      ),
    );

    var simulacros = Array.isArray(kit.simulacros) ? kit.simulacros : [];
    if (!simulacros.length) {
      raiz.appendChild(el("p", { class: "df-simc-vacio" }, "El kit todavía no trae simulacros."));
      main.replaceChildren(raiz);
      return;
    }

    var results = leerSimulacrosLS().results;
    var grid = el("div", { class: "df-simc-grid" });
    simulacros.forEach(function (s) {
      grid.appendChild(tarjetaSimulacro(s, temasMap, results));
    });
    raiz.appendChild(grid);

    raiz.appendChild(el("p", { class: "df-simc-registro-link" }, irA("df-simc-link", "#/simulacros/registro", "Ver el registro de resultados")));

    main.replaceChildren(raiz);
  }

  // ----------------------------------------------------------------------
  // Vista: runner (arg === "S0".."S6")
  // ----------------------------------------------------------------------

  function renderRunner(main, kit, temasMap, id) {
    var simulacros = Array.isArray(kit.simulacros) ? kit.simulacros : [];
    var simulacro = null;
    for (var i = 0; i < simulacros.length; i += 1) {
      if (simulacros[i].id === id) {
        simulacro = simulacros[i];
        break;
      }
    }

    if (!simulacro) {
      var raizErr = el(
        "div",
        { class: "df-simc" },
        el("p", { class: "df-simc-vacio" }, 'No existe el simulacro "' + id + '".'),
        irA("df-simc-btn", "#/simulacros", "Volver a la lista"),
      );
      main.replaceChildren(raizErr);
      return function cleanupVacio() {};
    }

    var consignas = Array.isArray(simulacro.consignas) ? simulacro.consignas : [];
    var ajustes = leerAjustes();
    var segundosTotal = Math.max(1, Math.round(ajustes.minutosPorPregunta * 5 * 60));

    var sesion = {
      respondoAMano: true,
      textos: {},
      terminadas: {},
      puntajes: consignas.map(function () {
        return null;
      }),
      elapsedSeg: 0,
    };
    var temporizador = null;

    var raiz = el("div", { class: "df-simc" });
    main.replaceChildren(raiz);

    function encabezado(extra) {
      var cont = el(
        "div",
        { class: "df-simc-runner-header" },
        irA("df-simc-btn df-simc-btn-fantasma", "#/simulacros", "← Volver a la lista"),
        el("h1", {}, simulacro.titulo || simulacro.id),
      );
      var reglaMd = kit.reglas ? kit.reglas.aprobacion || "" : "";
      if (reglaMd) {
        var reglaBox = el("div", { class: "df-simc-reglas df-simc-md" });
        reglaBox.appendChild(fragmento(reglaMd, simulacro.pagina));
        cont.appendChild(reglaBox);
      }
      if (extra) cont.appendChild(extra);
      return cont;
    }

    function detenerTemporizador() {
      if (temporizador) temporizador.pausar();
    }

    function faseResponder() {
      raiz.replaceChildren();

      var timerHandle = crearTemporizador(segundosTotal, function onFin() {
        if (A.toast) A.toast("Se acabó el tiempo del simulacro.", "ok");
        irCorreccion();
      });
      temporizador = timerHandle;

      var pausarBtn = el(
        "button",
        {
          class: "df-simc-btn df-simc-btn-fantasma",
          type: "button",
          dataset: { estado: "corriendo" },
          onclick: function (evt) {
            var btn = evt.currentTarget;
            if (btn.dataset.estado === "pausado") {
              timerHandle.iniciar();
              btn.dataset.estado = "corriendo";
              btn.textContent = "Pausar";
            } else {
              timerHandle.pausar();
              btn.dataset.estado = "pausado";
              btn.textContent = "Reanudar";
            }
          },
        },
        "Pausar",
      );

      var timerRow = el(
        "div",
        { class: "df-simc-timer-row" },
        el("span", { class: "df-simc-timer-label" }, "Tiempo restante"),
        timerHandle.el,
        pausarBtn,
      );

      raiz.appendChild(encabezado(timerRow));

      var toggleInput = document.createElement("input");
      toggleInput.type = "checkbox";
      toggleInput.checked = sesion.respondoAMano;
      var toggle = el("label", { class: "df-simc-toggle" }, toggleInput, " Responder en papel (sin escribir la respuesta en este cuadro)");
      toggleInput.addEventListener("change", function () {
        sesion.respondoAMano = toggleInput.checked;
        reconstruirConsignas();
      });
      raiz.appendChild(toggle);

      var consignasWrap = el("div", { class: "df-simc-consignas" });
      raiz.appendChild(consignasWrap);

      function reconstruirConsignas() {
        consignasWrap.replaceChildren();
        consignas.forEach(function (c) {
          var textoBox = el("div", { class: "df-simc-md" });
          textoBox.appendChild(fragmento(c.texto || "", simulacro.pagina));

          var bloque = el("div", { class: "df-simc-consigna" }, el("div", { class: "df-simc-consigna-n" }, "Pregunta " + c.n), textoBox);

          if (sesion.respondoAMano) {
            var cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = !!sesion.terminadas[c.n];
            cb.addEventListener("change", function () {
              sesion.terminadas[c.n] = cb.checked;
            });
            bloque.appendChild(el("label", { class: "df-simc-terminada" }, cb, " Consigna resuelta"));
          } else {
            var ta = document.createElement("textarea");
            ta.className = "df-simc-textarea";
            ta.placeholder = "Escriba su respuesta aquí.";
            ta.value = sesion.textos[c.n] || "";
            ta.addEventListener("input", function () {
              sesion.textos[c.n] = ta.value;
            });
            bloque.appendChild(ta);
          }
          consignasWrap.appendChild(bloque);
        });
      }
      reconstruirConsignas(); // no recrea el temporizador: solo esta función se vuelve a llamar al alternar el toggle

      var terminarBtn = el(
        "button",
        {
          class: "df-simc-btn df-simc-btn-primario df-simc-terminar",
          type: "button",
          onclick: function () {
            if (timerHandle.restante > 0) {
              var seguir = window.confirm("Todavía queda tiempo. ¿Desea terminar el simulacro de todos modos?");
              if (!seguir) return;
            }
            irCorreccion();
          },
        },
        "Terminar",
      );
      raiz.appendChild(terminarBtn);

      timerHandle.iniciar();
    }

    function irCorreccion() {
      var restante = temporizador ? Math.max(temporizador.restante, 0) : segundosTotal;
      detenerTemporizador();
      sesion.elapsedSeg = segundosTotal - restante;
      faseCorreccion();
    }

    function faseCorreccion() {
      raiz.replaceChildren();
      raiz.appendChild(encabezado());
      raiz.appendChild(
        el(
          "p",
          { class: "df-simc-instruccion" },
          "Corrija cada consigna contra el desarrollo esperado y elija el puntaje obtenido. Es obligatorio puntuar las cinco.",
        ),
      );

      consignas.forEach(function (c, idx) {
        var textoBox = el("div", { class: "df-simc-consigna-texto df-simc-md" });
        textoBox.appendChild(fragmento(c.texto || "", simulacro.pagina));

        var correccionBox = el("div", { class: "df-simc-md" });
        correccionBox.appendChild(fragmento(c.correccionMd || "", simulacro.pagina));

        var card = el("div", { class: "df-simc-correccion" }, el("h2", {}, "Pregunta " + c.n), textoBox, correccionBox);

        if (!sesion.respondoAMano && sesion.textos[c.n]) {
          card.appendChild(
            el(
              "div",
              { class: "df-simc-respuesta" },
              el("div", { class: "df-simc-respuesta-titulo" }, "Su respuesta"),
              el("div", { class: "df-simc-respuesta-texto" }, sesion.textos[c.n]),
            ),
          );
        }

        var select = document.createElement("select");
        select.className = "df-simc-select";
        [
          { value: "", label: "Elija un puntaje…" },
          { value: "1", label: "1 punto" },
          { value: "0.5", label: "½ punto" },
          { value: "0", label: "0 puntos" },
        ].forEach(function (o) {
          var opt = document.createElement("option");
          opt.value = o.value;
          opt.textContent = o.label;
          select.appendChild(opt);
        });
        select.value = sesion.puntajes[idx] === null || sesion.puntajes[idx] === undefined ? "" : String(sesion.puntajes[idx]);
        select.addEventListener("change", function () {
          sesion.puntajes[idx] = select.value === "" ? null : Number(select.value);
        });
        card.appendChild(el("label", { class: "df-simc-puntaje-label" }, "Puntaje obtenido", select));

        raiz.appendChild(card);
      });

      var verResumenBtn = el(
        "button",
        {
          class: "df-simc-btn df-simc-btn-primario",
          type: "button",
          onclick: function () {
            var faltaAlguno = sesion.puntajes.some(function (p) {
              return p === null || p === undefined;
            });
            if (faltaAlguno) {
              if (A.toast) A.toast("Falta elegir el puntaje de alguna consigna.", "bad");
              return;
            }
            faseResumen();
          },
        },
        "Ver resumen",
      );
      raiz.appendChild(verResumenBtn);
    }

    function faseResumen() {
      raiz.replaceChildren();
      var pasa = umbral(sesion.puntajes);
      raiz.appendChild(encabezado());

      var tabla = el("div", { class: "df-simc-resumen-puntajes" });
      consignas.forEach(function (c, idx) {
        tabla.appendChild(el("div", { class: "df-simc-resumen-item" }, el("span", {}, "P" + c.n), el("strong", {}, puntajeCell(sesion.puntajes[idx]))));
      });

      var resumenCard = el(
        "div",
        { class: "df-simc-resumen" },
        el("h2", {}, "Resumen"),
        tabla,
        el(
          "p",
          {},
          "Regla 4 de 5: ",
          el("span", { class: "df-simc-badge " + (pasa ? "df-simc-badge-ok" : "df-simc-badge-bad") }, pasa ? "Cumple el umbral" : "No cumple el umbral"),
        ),
      );

      var acciones = el("div", { class: "df-simc-resumen-acciones" });
      var guardado = false;
      var guardarBtn = el(
        "button",
        {
          class: "df-simc-btn df-simc-btn-primario",
          type: "button",
          onclick: function () {
            if (guardado) return;
            guardado = true;
            guardarBtn.disabled = true;
            guardarResultado(pasa);
            guardarBtn.textContent = "Guardado";
          },
        },
        "Guardar en el registro",
      );
      acciones.appendChild(guardarBtn);
      if (simulacro.pagina) acciones.appendChild(irAPagina("df-simc-btn", simulacro.pagina, "Ver la página del simulacro"));
      acciones.appendChild(irA("df-simc-btn df-simc-btn-fantasma", "#/simulacros", "Volver a la lista"));
      resumenCard.appendChild(acciones);

      raiz.appendChild(resumenCard);
    }

    function guardarResultado(pasa) {
      var nuevo = {
        id: simulacro.id,
        tipo: simulacro.tipo,
        at: new Date().toISOString(),
        consignas: consignas.map(function (c) {
          return { n: c.n, texto: c.texto, temaSlug: c.temaSlug || null };
        }),
        puntajes: sesion.puntajes.slice(),
        umbral: pasa,
        respuestas: sesion.respondoAMano
          ? null
          : consignas.map(function (c) {
              return sesion.textos[c.n] || "";
            }),
        duracionSeg: sesion.elapsedSeg,
      };
      guardarEnRegistro(nuevo);
      if (A.toast) A.toast("Resultado guardado en el registro.", "ok");
    }

    faseResponder();

    return function cleanupRunner() {
      detenerTemporizador();
    };
  }

  // ----------------------------------------------------------------------
  // Vista: registro (arg === "registro")
  // ----------------------------------------------------------------------

  function renderRegistro(main, kit, temasMap) {
    var simulacrosMap = simulacrosByIdMap(kit);

    /* Se identifica la fila a borrar por (id, at) — "at" es el timestamp de
       guardado con precisión de milisegundos, único en la práctica para cada
       resultado — y se guarda con el mismo patrón leer-modificar-escribir que
       usa guardarEnRegistro(). */
    function eliminarResultado(id, at) {
      var actual = leerSimulacrosLS();
      var siguiente = {
        results: actual.results.filter(function (x) {
          return !(x.id === id && x.at === at);
        }),
      };
      if (A.LS && typeof A.LS.set === "function") A.LS.set("simulacros", siguiente);
    }

    function pintar() {
      var results = leerSimulacrosLS().results;

      var raiz = el("div", { class: "df-simc" }, el("header", { class: "df-simc-header" }, el("h1", {}, "Registro de simulacros")));

      if (!results.length) {
        raiz.appendChild(
          el(
            "p",
            { class: "df-simc-vacio" },
            "Todavía no hay resultados guardados. Realice un simulacro desde «Simulacros reales» y guárdelo al terminar.",
          ),
        );
        raiz.appendChild(irA("df-simc-btn", "#/simulacros", "Ir a los simulacros"));
        main.replaceChildren(raiz);
        return;
      }

      var ordenados = results.slice().sort(function (a, b) {
        return new Date(b.at).getTime() - new Date(a.at).getTime();
      });

      var copiarTodoBtn = el(
        "button",
        {
          class: "df-simc-btn",
          type: "button",
          onclick: function () {
            var texto = ordenados
              .map(function (r) {
                return filaMarkdown(r, simulacrosMap, temasMap);
              })
              .join("\n");
            copiarTexto(texto, "Se copiaron todas las filas.");
          },
        },
        "Copiar todo (markdown)",
      );
      raiz.appendChild(el("div", { class: "df-simc-toolbar" }, copiarTodoBtn));

      var thead = el(
        "thead",
        {},
        el.apply(
          null,
          ["tr", {}].concat(
            ["Fecha", "Simulacro", "P1", "P2", "P3", "P4", "P5", "Umbral", "Temas a repasar", "Acciones"].map(function (h) {
              return el("th", { scope: "col" }, h);
            }),
          ),
        ),
      );
      var tbody = el("tbody", {});

      ordenados.forEach(function (r) {
        var puntajes = Array.isArray(r.puntajes) ? r.puntajes : [];
        var pasa = typeof r.umbral === "boolean" ? r.umbral : umbral(puntajes);

        var consignas = Array.isArray(r.consignas) ? r.consignas : [];
        var enlacesTemas = [];
        consignas.forEach(function (c, i) {
          if (!esFallado(puntajes[i])) return;
          var slug = c && c.temaSlug;
          if (!slug) return;
          if (
            enlacesTemas.some(function (t) {
              return t.slug === slug;
            })
          ) {
            return;
          }
          var tema = temasMap[slug];
          enlacesTemas.push({ slug: slug, label: tema ? tema.nombre : slug });
        });

        var tdTemas = el("td", {});
        if (enlacesTemas.length) {
          enlacesTemas.forEach(function (t, idx) {
            tdTemas.appendChild(irA("df-simc-link", "#/temas/" + t.slug, t.label));
            if (idx < enlacesTemas.length - 1) tdTemas.appendChild(document.createTextNode(", "));
          });
        } else {
          tdTemas.textContent = "—";
        }

        var sim = simulacrosMap[r.id];
        var etiquetaSimulacro = r.tipo === "generado" ? "Simulador" : (sim && sim.pagina) || r.id || "—";

        var celdasPuntaje = [0, 1, 2, 3, 4].map(function (i) {
          return el("td", {}, puntajeCell(puntajes[i]));
        });

        var idResultado = r.id;
        var atResultado = r.at;

        var copiarFilaBtn = el(
          "button",
          {
            class: "df-simc-btn df-simc-btn-fantasma",
            type: "button",
            onclick: function () {
              copiarTexto(filaMarkdown(r, simulacrosMap, temasMap), "Se copió la fila.");
            },
          },
          "Copiar fila (markdown)",
        );

        var eliminarBtn = el(
          "button",
          {
            class: "df-simc-btn df-simc-btn-fantasma",
            type: "button",
            onclick: function () {
              if (!window.confirm("¿Elimina este resultado del registro? No se puede deshacer.")) return;
              eliminarResultado(idResultado, atResultado);
              if (A.toast) A.toast("Resultado eliminado del registro.", "ok");
              pintar();
            },
          },
          "Eliminar",
        );

        var tr = el.apply(
          null,
          ["tr", {}, el("td", {}, fmtFechaDDMMYYYY(r.at)), el("td", {}, etiquetaSimulacro)]
            .concat(celdasPuntaje)
            .concat([
              el("td", {}, el("span", { class: "df-simc-badge " + (pasa ? "df-simc-badge-ok" : "df-simc-badge-bad") }, pasa ? "Cumple" : "No cumple")),
              tdTemas,
              el("td", {}, el("div", { class: "df-simc-acciones-cell" }, copiarFilaBtn, eliminarBtn)),
            ]),
        );
        tbody.appendChild(tr);
      });

      var table = el("table", { class: "df-simc-table" }, thead, tbody);
      raiz.appendChild(el("div", { class: "df-simc-table-wrap" }, table));
      raiz.appendChild(el("p", { class: "df-simc-nota-registro" }, "Copie las filas y péguelas en wiki/final-completo/registro-simulacros.md."));

      var fallados = temasFallados(results);
      var dosOMas = fallados.filter(function (f) {
        return f.veces >= 2;
      });
      var unaVez = fallados.filter(function (f) {
        return f.veces === 1;
      });
      var racha = consecutivosConUmbral(results);

      var resumenCard = el(
        "div",
        { class: "df-simc-panel-resumen" },
        el("h2", {}, "Resumen"),
        el("p", {}, "Intentos guardados: ", el("strong", {}, String(results.length))),
        el("p", {}, "Racha de simulacros consecutivos con umbral cumplido: ", el("strong", {}, String(racha))),
        el("p", { class: "df-simc-prioridad" }, "Prioridad absoluta (fallados dos o más veces)"),
      );

      if (dosOMas.length) {
        var ul1 = el("ul", {});
        dosOMas.forEach(function (f) {
          var tema = temasMap[f.slug];
          ul1.appendChild(el("li", {}, irA("df-simc-link", "#/temas/" + f.slug, tema ? tema.nombre : f.slug), " (" + f.veces + " veces)"));
        });
        resumenCard.appendChild(ul1);
      } else {
        resumenCard.appendChild(el("p", { class: "df-simc-muted" }, "Ninguno todavía."));
      }

      resumenCard.appendChild(el("p", { class: "df-simc-muted" }, "Fallados una vez"));
      if (unaVez.length) {
        var ul2 = el("ul", {});
        unaVez.forEach(function (f) {
          var tema = temasMap[f.slug];
          ul2.appendChild(el("li", {}, irA("df-simc-link", "#/temas/" + f.slug, tema ? tema.nombre : f.slug)));
        });
        resumenCard.appendChild(ul2);
      } else {
        resumenCard.appendChild(el("p", { class: "df-simc-muted" }, "Ninguno."));
      }

      raiz.appendChild(resumenCard);
      main.replaceChildren(raiz);
    }

    pintar();
  }

  // ----------------------------------------------------------------------
  // Registro de la vista
  // ----------------------------------------------------------------------

  A.registerView("simulacros", function (main, arg) {
    /* El anfitrión remonta la vista al cambiar de tema claro/oscuro salvo que
       la vista registre su propio redibujo; este bundle solo usa tokens CSS
       (nada que redibujar), pero sin este redibujo vacío el remontaje borra
       el runner en curso (cronómetro y respuestas sin guardar). */
    if (typeof A.setRedraw === "function") A.setRedraw(function () {});

    var kit = kitData();
    var temasMap = temasBySlugMap(kit);
    var valor = argActual(arg);

    if (A.setCrumbs) {
      if (!valor) {
        A.setCrumbs([{ label: "Simulacros" }]);
      } else if (valor === "registro") {
        A.setCrumbs([{ label: "Simulacros", hash: "#/simulacros" }, { label: "Registro" }]);
      } else {
        var sim = simulacrosByIdMap(kit)[valor];
        A.setCrumbs([{ label: "Simulacros", hash: "#/simulacros" }, { label: sim ? sim.titulo || sim.id : valor }]);
      }
    }

    var cleanup;
    if (!valor) {
      renderLista(main, kit, temasMap);
      cleanup = function cleanupLista() {};
    } else if (valor === "registro") {
      renderRegistro(main, kit, temasMap);
      cleanup = function cleanupRegistro() {};
    } else {
      cleanup = renderRunner(main, kit, temasMap, valor);
    }

    return function cleanupVista() {
      if (typeof A.setRedraw === "function") A.setRedraw(null);
      if (typeof cleanup === "function") cleanup();
    };
  });
})();
