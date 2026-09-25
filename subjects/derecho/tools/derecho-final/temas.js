/* ============================================================
   temas.js — vista «Temas y tracker de dominio».

   Portada de study-app/public/js/views/temas.js (PLAN §6 B4) al runtime de
   Sinapsis (BUNDLE.md, unidad `temas`). Dos pantallas dentro de una sola vista
   registrada:

     tablero   (arg vacío)     filtros + contadores por tier + tabla maestra
     detalle   (arg = slug)    ficha de estudio de un tema, con sus tres hitos

   DATOS: App.DATA.kit.temas — cada tema trae tier, fracción, unidades, señal
   2025-26, ficha (slug|null), madres (slugs), esqueleto, seguro,
   desarrolloMd/procedimientoMd/trampasMd/baseDetalleMd (markdown con
   wikilinks ya válidos), comoCayo y numerosOro. App.DATA.kit.confundibles
   trae los pares confundibles ({ seccion, par, diferencia, donde, temaSlug,
   ficha }); en el detalle se muestran los que coinciden por temaSlug o,
   cuando el tema tiene ficha propia, también por ficha (la mayoría del
   corpus real solo trae `ficha`, no `temaSlug`). Ningún dato jurídico nuevo:
   todo el texto de estudio sale de kit.json (BUNDLE.md §6.7); lo único propio
   de este archivo son los rótulos de interfaz.

   ESQUELETO: la pestaña homónima del detalle trae un cronómetro de recitado
   de 3 minutos (un solo setInterval por montaje, liberado en el cleanup que
   devuelve la vista) y un botón que oculta el esqueleto (desenfoque, sin
   depender solo del color) para practicar de memoria antes de revelarlo.

   POR QUÉ NO SE ARMA HTML A MANO. Todo el marcado se construye con
   `document.createElement` + `textContent`/atributos: no hay una sola cadena
   de HTML concatenada con datos. Lo único que entra como HTML es lo que
   devuelve `A.renderMarkdown`, y pasa por `fragmento()` (DOMParser aparte +
   poda de `script`/`on*`/`javascript:`), igual que en
   subjects/cripto/tools/cripto-parciales/parciales.js.

   TRACKER: A.LS clave "tracker" — { [slugTema]: { esq, dev, sim, updated } }.
   La escribe esta vista (tablero y detalle) y la lee también `simulador`
   (BUNDLE.md §4). "Practicar este tema" navega a `#/simulador/tema:<slug>`.

   RUTAS
     #/temas            tablero
     #/temas/<slug>      detalle del tema
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || !A.registerView) return;

  var TIERS = ["A", "B", "C"];
  var ESTADOS = ["pendiente", "en curso", "dominado"];
  var ESTADO_LABEL = { pendiente: "Pendiente", "en curso": "En curso", dominado: "Dominado" };
  var CAMPOS = ["esq", "dev", "sim"];
  /* Un solo mapa de rótulos para el <th> de la tabla, el aria-label de cada
     casillero y la etiqueta de cada hito del detalle: así los tres textos no
     pueden divergir entre sí. */
  var CAMPO_LABEL = {
    esq: "Esqueleto volcado en frío",
    dev: "Desarrollo de 12 minutos escrito",
    sim: "Punto en simulacro",
  };
  var CAMPO_LABEL_CORTA = { esq: "Esqueleto", dev: "Desarrollo", sim: "Simulacro" };

  /* ---------- datos del kit ---------- */

  function kit() {
    return (A.DATA && (A.DATA.kit || A.DATA["data/kit.json"])) || {};
  }

  function temasData() {
    var k = kit();
    return Array.isArray(k.temas) ? k.temas : [];
  }

  /** "N finales fechados" para la nota al pie: sale de los datos, no se inventa. */
  function totalFinales() {
    var k = kit();
    if (Array.isArray(k.finales) && k.finales.length) return k.finales.length;
    var temas = temasData();
    for (var i = 0; i < temas.length; i += 1) {
      if (typeof temas[i].den === "number") return temas[i].den;
    }
    return null;
  }

  /* ---------- tracker (A.LS) ---------- */

  function tracker() {
    return A.LS && typeof A.LS.getObj === "function" ? A.LS.getObj("tracker") : {};
  }

  function setTrackerCampo(slug, campo, checked) {
    var actual = tracker();
    var siguiente = {};
    Object.keys(actual || {}).forEach(function (k) {
      siguiente[k] = actual[k];
    });
    var previo = siguiente[slug] || { esq: false, dev: false, sim: false };
    var entrada = { esq: !!previo.esq, dev: !!previo.dev, sim: !!previo.sim };
    entrada[campo] = !!checked;
    entrada.updated = new Date().toISOString();
    siguiente[slug] = entrada;
    if (A.LS && typeof A.LS.set === "function") A.LS.set("tracker", siguiente);
  }

  /* ---------------------------------------------------------------------
     Lógica pura (sin DOM): filtrado, orden, resumen por tier y la fila de
     markdown que arma "Copiar tracker en markdown". Se prueban aparte,
     copiadas a un script temporal, contra data/kit.json (BUNDLE.md §7).
     --------------------------------------------------------------------- */

  function normalizarTexto(value) {
    return String(value == null ? "" : value)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  }

  /** dominado = esqueleto Y desarrollo; en curso = alguno de los tres; si no, pendiente. */
  function estadoTema(entry) {
    var esq = !!(entry && entry.esq);
    var dev = !!(entry && entry.dev);
    var sim = !!(entry && entry.sim);
    if (esq && dev) return "dominado";
    if (esq || dev || sim) return "en curso";
    return "pendiente";
  }

  function filtrarTemas(temas, trackerObj, filtros) {
    filtros = filtros || {};
    var tier = filtros.tier;
    var unidad = filtros.unidad;
    var estado = filtros.estado;
    var texto = normalizarTexto(filtros.texto).trim();
    var unidadNum =
      unidad !== undefined && unidad !== null && unidad !== "" && unidad !== "todos" ? Number(unidad) : null;

    return (Array.isArray(temas) ? temas : []).filter(function (tema) {
      if (tier && tier !== "todos" && tema.tier !== tier) return false;
      if (unidadNum !== null && !isNaN(unidadNum)) {
        var unidades = Array.isArray(tema.unidades) ? tema.unidades : [];
        if (unidades.indexOf(unidadNum) === -1) return false;
      }
      if (estado && estado !== "todos") {
        var entry = trackerObj ? trackerObj[tema.slug] : null;
        if (estadoTema(entry) !== estado) return false;
      }
      if (texto) {
        var nombre = normalizarTexto(tema.nombre);
        var slug = normalizarTexto(tema.slug);
        if (nombre.indexOf(texto) === -1 && slug.indexOf(texto) === -1) return false;
      }
      return true;
    });
  }

  /** Orden por defecto de la tabla maestra: n descendente, tier como desempate. */
  function ordenarTemas(temas) {
    return (Array.isArray(temas) ? temas : []).slice().sort(function (a, b) {
      var na = typeof a.n === "number" ? a.n : 0;
      var nb = typeof b.n === "number" ? b.n : 0;
      if (nb !== na) return nb - na;
      var ta = TIERS.indexOf(a.tier);
      var tb = TIERS.indexOf(b.tier);
      return (ta < 0 ? TIERS.length : ta) - (tb < 0 ? TIERS.length : tb);
    });
  }

  /** Conteo de dominados/total por tier (A, B, C). */
  function resumenPorTier(temas, trackerObj) {
    var out = { A: { dominados: 0, total: 0 }, B: { dominados: 0, total: 0 }, C: { dominados: 0, total: 0 } };
    (Array.isArray(temas) ? temas : []).forEach(function (tema) {
      if (!out[tema.tier]) return;
      out[tema.tier].total += 1;
      var entry = trackerObj ? trackerObj[tema.slug] : null;
      if (estadoTema(entry) === "dominado") out[tema.tier].dominados += 1;
    });
    return out;
  }

  /** Unidades presentes en los datos, en orden — no se asume un rango fijo. */
  function unidadesDisponibles(temas) {
    var set = {};
    (Array.isArray(temas) ? temas : []).forEach(function (tema) {
      (Array.isArray(tema.unidades) ? tema.unidades : []).forEach(function (u) {
        set[u] = true;
      });
    });
    return Object.keys(set)
      .map(Number)
      .sort(function (a, b) {
        return a - b;
      });
  }

  /** Tabla en markdown: solo temas A y B, tier como grupo y n descendente dentro de él. */
  function trackerToMarkdown(temas, trackerObj) {
    var soloAB = (Array.isArray(temas) ? temas : []).filter(function (t) {
      return t.tier === "A" || t.tier === "B";
    });
    var ordenados = soloAB.slice().sort(function (a, b) {
      var ta = a.tier === "A" ? 0 : 1;
      var tb = b.tier === "A" ? 0 : 1;
      if (ta !== tb) return ta - tb;
      var na = typeof a.n === "number" ? a.n : 0;
      var nb = typeof b.n === "number" ? b.n : 0;
      return nb - na;
    });
    var lines = [
      "| Tema | Esqueleto volcado en frío | Desarrollo 12 min escrito | Punto en simulacro |",
      "|---|---|---|---|",
    ];
    ordenados.forEach(function (tema) {
      var entry = trackerObj ? trackerObj[tema.slug] : null;
      var esq = entry && entry.esq ? "☑" : "☐";
      var dev = entry && entry.dev ? "☑" : "☐";
      var sim = entry && entry.sim ? "☑" : "☐";
      lines.push("| " + tema.slug + " (" + tema.tier + ") | " + esq + " | " + dev + " | " + sim + " |");
    });
    return lines.join("\n");
  }

  /* ---------------------------------------------------------------------
     Helpers de DOM
     --------------------------------------------------------------------- */

  /** Nodo con atributos (incluye onXxx como listener) e hijos variádicos. */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k === "class") node.className = v;
      else if (k === "checked") node.checked = !!v;
      else if (k === "disabled") node.disabled = !!v;
      else if (k.indexOf("on") === 0 && typeof v === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v === true) node.setAttribute(k, "");
      else node.setAttribute(k, String(v));
    });
    for (var i = 2; i < arguments.length; i += 1) apendice(node, arguments[i]);
    return node;
  }

  function apendice(node, hijo) {
    if (hijo === undefined || hijo === null || hijo === false) return;
    if (Array.isArray(hijo)) {
      hijo.forEach(function (h) {
        apendice(node, h);
      });
      return;
    }
    if (typeof hijo === "string" || typeof hijo === "number") {
      node.appendChild(document.createTextNode(String(hijo)));
      return;
    }
    node.appendChild(hijo);
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
   * El markdown ya compuesto por A.renderMarkdown, como nodos. Se parsea en un
   * documento aparte —donde nada se ejecuta ni se carga— y se poda antes de
   * adjuntarlo (mismo criterio que cripto-parciales/parciales.js, ampliado
   * tras la auditoría final: más etiquetas peligrosas podadas enteras y las
   * URL normalizadas y validadas por esquema, no solo por el prefijo
   * "javascript:").
   */
  function fragmento(markdown, slugActual) {
    var html = A.renderMarkdown ? A.renderMarkdown(markdown || "", slugActual) : "";
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

  function mdBlock(markdown, slugActual, clase) {
    var wrap = el("div", { class: clase || "df-md" });
    wrap.appendChild(fragmento(markdown, slugActual));
    return wrap;
  }

  /** Enlace a una página de la wiki por slug: lo intercepta el delegado de `data-go`. */
  function pageLink(slug, texto, clase) {
    return el("a", { class: clase, href: "#/p/" + slug, "data-go": slug }, texto);
  }

  /** Enlace a otra sección de esta misma herramienta (`#/temas`, `#/simulador/tema:x`). */
  function toolLink(hash, texto, clase) {
    return el("a", { class: clase, href: hash, "data-nav": hash }, texto);
  }

  function copiarTexto(texto, mensajeOk) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(texto)
        .then(function () {
          if (A.toast) A.toast(mensajeOk, "ok");
        })
        .catch(function () {
          if (A.toast) A.toast("No se pudo copiar al portapapeles.", "bad");
        });
    } else if (A.toast) {
      A.toast("El portapapeles no está disponible en este navegador.", "bad");
    }
  }

  /* ---------------------------------------------------------------------
     Tablero (arg vacío)
     --------------------------------------------------------------------- */

  function renderTablero(main) {
    main.replaceChildren();
    if (A.setCrumbs) A.setCrumbs([{ label: "Temas y tracker" }]);

    var temas = temasData();
    var unidades = unidadesDisponibles(temas);
    var filtros = { tier: "todos", unidad: "todos", estado: "todos", texto: "" };

    var raiz = el("div", { class: "df-temas" });
    raiz.appendChild(el("h1", {}, "Temas y tracker de dominio"));

    var tierSel = el(
      "select",
      { class: "df-select", "aria-label": "Tier" },
      el("option", { value: "todos" }, "Todos los tiers"),
      TIERS.map(function (t) {
        return el("option", { value: t }, "Tier " + t);
      }),
    );

    var unidadSel = el(
      "select",
      { class: "df-select", "aria-label": "Unidad" },
      el("option", { value: "todos" }, "Todas las unidades"),
      unidades.map(function (u) {
        return el("option", { value: String(u) }, "Unidad " + u);
      }),
    );

    var estadoSel = el(
      "select",
      { class: "df-select", "aria-label": "Estado" },
      el("option", { value: "todos" }, "Todos los estados"),
      ESTADOS.map(function (e) {
        return el("option", { value: e }, ESTADO_LABEL[e]);
      }),
    );

    var textoInput = el("input", {
      class: "df-input df-buscar",
      type: "search",
      placeholder: "Buscar por nombre o slug…",
      "aria-label": "Buscar",
    });

    var filtroBar = el(
      "div",
      { class: "df-filtros" },
      el("label", { class: "df-campo" }, "Tier", tierSel),
      el("label", { class: "df-campo" }, "Unidad", unidadSel),
      el("label", { class: "df-campo" }, "Estado", estadoSel),
      el("label", { class: "df-campo df-campo-texto" }, "Buscar", textoInput),
    );
    raiz.appendChild(filtroBar);

    var resultados = el("div", { class: "df-resultados" });
    raiz.appendChild(resultados);

    var copiarBtn = el("button", { class: "df-btn df-btn-ghost", type: "button" }, "Copiar tracker en markdown");
    raiz.appendChild(el("div", { class: "df-acciones" }, copiarBtn));

    var totalF = totalFinales();
    var notaTexto = totalF
      ? "Las fracciones son sobre " + totalF + " finales fechados (matriz de frecuencias)."
      : "Las fracciones son sobre los finales fechados de la matriz de frecuencias.";
    raiz.appendChild(el("p", { class: "df-nota" }, notaTexto));

    main.appendChild(raiz);

    function chk(tema, entry, campo) {
      var id = tema.slug + "|" + campo;
      var input = el("input", {
        type: "checkbox",
        checked: !!entry[campo],
        "aria-label": tema.nombre + " — " + CAMPO_LABEL_CORTA[campo],
        "data-chk": id,
        onChange: function (evt) {
          setTrackerCampo(tema.slug, campo, evt.target.checked);
          construir(id);
        },
      });
      return el("label", { class: "df-chk-label" }, input);
    }

    function construir(focoId) {
      var trk = tracker();
      var filtrados = filtrarTemas(temas, trk, filtros);
      var ordenados = ordenarTemas(filtrados);
      var resumen = resumenPorTier(temas, trk);

      resultados.replaceChildren();

      var resumenRow = el("div", { class: "df-resumen" });
      TIERS.forEach(function (t) {
        var r = resumen[t];
        resumenRow.appendChild(
          el(
            "div",
            { class: "df-resumen-item df-tier-" + t.toLowerCase() },
            el("span", { class: "df-resumen-tier" }, "Tier " + t),
            el("span", { class: "df-resumen-count" }, r.dominados + " / " + r.total + " dominados"),
          ),
        );
      });
      resultados.appendChild(resumenRow);

      if (!ordenados.length) {
        resultados.appendChild(el("p", { class: "df-empty" }, "Ningún tema coincide con los filtros aplicados."));
        return;
      }

      var tbody = el("tbody", {});
      ordenados.forEach(function (tema) {
        var entry = trk[tema.slug] || { esq: false, dev: false, sim: false };
        var fichaCell = tema.ficha
          ? el(
              "a",
              {
                href: "#/p/" + tema.ficha,
                "data-go": tema.ficha,
                title: "Abrir ficha",
                "aria-label": "Abrir la ficha de " + tema.nombre,
              },
              "✓",
            )
          : el("span", { class: "df-muted" }, "—");
        var senal = tema.senal2025 && tema.senal2025 !== "—" ? tema.senal2025 : "—";
        var hashDetalle = "#/temas/" + encodeURIComponent(tema.slug);

        tbody.appendChild(
          el(
            "tr",
            {},
            el("td", {}, toolLink(hashDetalle, tema.nombre)),
            el("td", {}, el("span", { class: "df-pill df-tier-" + tema.tier.toLowerCase() }, "Tier " + tema.tier)),
            el("td", { class: "df-num" }, tema.fraccion || "—"),
            el("td", { class: "df-num" }, Array.isArray(tema.unidades) ? tema.unidades.join(", ") : "—"),
            el("td", { class: "df-senal" }, senal),
            el("td", { class: "df-ficha-cell" }, fichaCell),
            el("td", { class: "df-chk-cell" }, chk(tema, entry, "esq")),
            el("td", { class: "df-chk-cell" }, chk(tema, entry, "dev")),
            el("td", { class: "df-chk-cell" }, chk(tema, entry, "sim")),
          ),
        );
      });

      var tabla = el(
        "table",
        { class: "df-tabla" },
        el(
          "thead",
          {},
          el(
            "tr",
            {},
            el("th", { scope: "col" }, "Tema"),
            el("th", { scope: "col" }, "Tier"),
            el("th", { scope: "col" }, "Fracción"),
            el("th", { scope: "col" }, "Unidades"),
            el("th", { scope: "col" }, "Señal 2025-26"),
            el("th", { scope: "col" }, "Ficha"),
            el("th", { scope: "col", title: CAMPO_LABEL.esq }, CAMPO_LABEL_CORTA.esq),
            el("th", { scope: "col", title: CAMPO_LABEL.dev }, CAMPO_LABEL_CORTA.dev),
            el("th", { scope: "col", title: CAMPO_LABEL.sim }, CAMPO_LABEL_CORTA.sim),
          ),
        ),
        tbody,
      );
      resultados.appendChild(el("div", { class: "df-table-wrap" }, tabla));

      if (focoId) {
        var destino = resultados.querySelector('input[data-chk="' + focoId + '"]');
        if (destino && typeof destino.focus === "function") destino.focus({ preventScroll: true });
      }
    }

    tierSel.addEventListener("change", function () {
      filtros.tier = tierSel.value;
      construir();
    });
    unidadSel.addEventListener("change", function () {
      filtros.unidad = unidadSel.value;
      construir();
    });
    estadoSel.addEventListener("change", function () {
      filtros.estado = estadoSel.value;
      construir();
    });

    var buscarTimer = null;
    textoInput.addEventListener("input", function () {
      if (buscarTimer) clearTimeout(buscarTimer);
      buscarTimer = setTimeout(function () {
        filtros.texto = textoInput.value;
        construir();
      }, 200);
    });

    copiarBtn.addEventListener("click", function () {
      copiarTexto(trackerToMarkdown(temas, tracker()), "Tracker copiado como markdown.");
    });

    construir();

    return function cleanup() {
      if (buscarTimer) clearTimeout(buscarTimer);
    };
  }

  /* ---------------------------------------------------------------------
     Detalle (arg = slug del tema)
     --------------------------------------------------------------------- */

  function buscarTema(temas, slug) {
    for (var i = 0; i < temas.length; i += 1) {
      if (temas[i].slug === slug) return temas[i];
    }
    return null;
  }

  function buildHitos(tema) {
    var entry = tracker()[tema.slug] || { esq: false, dev: false, sim: false };
    var row = el("div", { class: "df-hitos" });
    CAMPOS.forEach(function (campo) {
      var id = "df-temas-hito-" + tema.slug + "-" + campo;
      var input = el("input", {
        type: "checkbox",
        id: id,
        checked: !!entry[campo],
        onChange: function (evt) {
          setTrackerCampo(tema.slug, campo, evt.target.checked);
        },
      });
      row.appendChild(el("label", { for: id, class: "df-hito" }, input, CAMPO_LABEL[campo]));
    });
    return row;
  }

  function seccion(titulo) {
    var sec = el("section", { class: "df-seccion" });
    sec.appendChild(el("h2", { class: "df-seccion-titulo" }, titulo));
    return sec;
  }

  function seccionComoCayo(tema) {
    var sec = seccion("Cómo cayó en finales");
    var filas = Array.isArray(tema.comoCayo) ? tema.comoCayo : [];
    if (!filas.length) {
      sec.appendChild(el("p", { class: "df-empty" }, "Sin registros de “cómo cayó” para este tema."));
      return sec;
    }
    var tbody = el("tbody", {});
    filas.forEach(function (r) {
      tbody.appendChild(
        el(
          "tr",
          {},
          el("td", {}, fragmento(r.consigna || "", tema.slug)),
          el("td", { class: "df-muted df-num" }, r.fecha || ""),
          el("td", {}, fragmento(r.enfasis || "", tema.slug)),
        ),
      );
    });
    var tabla = el(
      "table",
      { class: "df-tabla-detalle" },
      el(
        "thead",
        {},
        el("tr", {}, el("th", { scope: "col" }, "Consigna"), el("th", { scope: "col" }, "Fecha"), el("th", { scope: "col" }, "Énfasis")),
      ),
      tbody,
    );
    sec.appendChild(el("div", { class: "df-table-wrap" }, tabla));
    return sec;
  }

  /** Etiquetas y orden de "Consignas del banco", igual que en la study-app
   *  (study-app/public/js/views/temas.js, renderBancoPane). */
  var BANCO_ORDEN = ["final", "senal", "tipica", "virtual", "nota"];
  var BANCO_ETIQUETAS = { final: "Finales", senal: "Señales", tipica: "Típicas", virtual: "Virtuales", nota: "Notas", otro: "Otras" };

  function consignasDeTema(tema) {
    var banco = kit().banco;
    if (!Array.isArray(banco)) return [];
    return banco.filter(function (b) {
      return b && b.tema === tema.slug;
    });
  }

  /**
   * "Consignas del banco": todas las consignas del banco de preguntas que
   * corresponden a este tema, agrupadas por tipo con los mismos rótulos que
   * la study-app. Cada consigna lleva "Practicar esta consigna", que abre esa
   * consigna puntual en el simulador con su cronómetro
   * (BUNDLE.md §5, formato "tema:<slug>:<idConsigna>").
   */
  function seccionBanco(tema) {
    var sec = seccion("Consignas del banco");
    var items = consignasDeTema(tema);
    if (!items.length) {
      sec.appendChild(el("p", { class: "df-empty" }, "No hay consignas del banco para este tema."));
      return sec;
    }
    var grupos = {};
    items.forEach(function (it) {
      var clave = BANCO_ORDEN.indexOf(it.tipo) !== -1 ? it.tipo : "otro";
      (grupos[clave] = grupos[clave] || []).push(it);
    });
    BANCO_ORDEN.concat(["otro"]).forEach(function (clave) {
      var lista = grupos[clave];
      if (!lista || !lista.length) return;
      sec.appendChild(el("h3", { class: "df-banco-grupo" }, BANCO_ETIQUETAS[clave] + " (" + lista.length + ")"));
      var ul = el("ul", { class: "df-banco-list" });
      lista.forEach(function (it) {
        var meta = [it.fecha, it.fuente].filter(Boolean).join(" · ");
        ul.appendChild(
          el(
            "li",
            { class: "df-banco-item" },
            el("div", { class: "df-banco-consigna" }, it.consigna || ""),
            meta ? el("div", { class: "df-muted" }, meta) : null,
            toolLink("#/simulador/tema:" + tema.slug + ":" + it.id, "Practicar esta consigna", "df-btn df-btn-ghost df-banco-practicar"),
          ),
        );
      });
      sec.appendChild(ul);
    });
    return sec;
  }

  /** mm:ss a partir de segundos enteros (siempre ≥ 0). */
  function formatoTiempo(seg) {
    var s = Math.max(0, Math.floor(seg));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }

  /**
   * Pestaña "Esqueleto": el bloque preformateado, el botón de ocultar/mostrar
   * para recitar de memoria, y un cronómetro de 3 minutos. Un solo
   * `setInterval`, creado recién cuando se pulsa "Iniciar" y nunca recreado
   * mientras corre; `cleanupFns` acumula el liberador que se llama al
   * desmontar la vista (BUNDLE.md §6.4).
   */
  function seccionEsqueleto(tema, cleanupFns) {
    var sec = seccion("Esqueleto");
    var pre = el("pre", { class: "df-esqueleto" }, tema.esqueleto || "Sin esqueleto memorizable registrado.");

    var hideBtn = el("button", { class: "df-btn df-btn-ghost", type: "button" }, "Ocultar y recitar");
    var showBtn = el("button", { class: "df-btn df-btn-ghost", type: "button", hidden: true }, "Mostrar");
    hideBtn.addEventListener("click", function () {
      pre.classList.add("df-esqueleto-oculto");
      hideBtn.hidden = true;
      showBtn.hidden = false;
    });
    showBtn.addEventListener("click", function () {
      pre.classList.remove("df-esqueleto-oculto");
      showBtn.hidden = true;
      hideBtn.hidden = false;
    });

    var TOTAL_SEG = 180;
    var restante = TOTAL_SEG;
    var intervalId = null;

    var contador = el("span", { class: "df-timer-contador", "aria-live": "polite" }, "Tiempo restante: " + formatoTiempo(restante));

    function actualizarContador() {
      contador.textContent = "Tiempo restante: " + formatoTiempo(restante);
    }

    function detener() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function tick() {
      restante -= 1;
      if (restante <= 0) {
        restante = 0;
        actualizarContador();
        detener();
        if (A.toast) A.toast("Se cumplieron los 3 minutos de recitado.", "ok");
        return;
      }
      actualizarContador();
    }

    var iniciarBtn = el("button", { class: "df-btn df-btn-ghost", type: "button" }, "Iniciar 3 min");
    var pausarBtn = el("button", { class: "df-btn df-btn-ghost", type: "button" }, "Pausar");
    var reiniciarBtn = el("button", { class: "df-btn df-btn-ghost", type: "button" }, "Reiniciar");

    iniciarBtn.addEventListener("click", function () {
      if (intervalId !== null || restante <= 0) return;
      intervalId = setInterval(tick, 1000);
    });
    pausarBtn.addEventListener("click", detener);
    reiniciarBtn.addEventListener("click", function () {
      detener();
      restante = TOTAL_SEG;
      actualizarContador();
    });

    if (Array.isArray(cleanupFns)) cleanupFns.push(detener);

    var timerRow = el("div", { class: "df-timer-row" }, iniciarBtn, pausarBtn, reiniciarBtn, contador);

    sec.appendChild(el("div", { class: "df-esqueleto-controles" }, hideBtn, showBtn));
    sec.appendChild(pre);
    sec.appendChild(timerRow);
    return sec;
  }

  function seccionSeguro(tema) {
    var sec = seccion("Seguro anti-cero");
    if (!tema.seguro) {
      sec.appendChild(el("p", { class: "df-empty" }, "No hay seguro anti-cero registrado para este tema."));
      return sec;
    }
    sec.appendChild(mdBlock(tema.seguro, tema.slug, "df-md df-prosa"));
    return sec;
  }

  function seccionDesarrollo(tema) {
    var sec = seccion("Desarrollo y procedimiento");
    var partes = [];
    if (tema.desarrolloMd) partes.push(tema.desarrolloMd);
    if (tema.procedimientoMd) partes.push(tema.procedimientoMd);
    var combinado = partes.join("\n\n---\n\n");
    if (!combinado) {
      sec.appendChild(el("p", { class: "df-empty" }, "No hay desarrollo modelo registrado para este tema."));
      return sec;
    }
    sec.appendChild(mdBlock(combinado, tema.slug, "df-md"));
    return sec;
  }

  function seccionTrampas(tema) {
    var sec = seccion("Trampas y confundibles");
    if (!tema.trampasMd) {
      sec.appendChild(el("p", { class: "df-empty" }, "Sin trampas ni confundibles registrados para este tema."));
      return sec;
    }
    sec.appendChild(mdBlock(tema.trampasMd, tema.slug, "df-md"));
    return sec;
  }

  function seccionNumerosOro(tema) {
    var sec = seccion("Números de oro");
    var filas = Array.isArray(tema.numerosOro) ? tema.numerosOro : [];
    if (!filas.length) {
      sec.appendChild(el("p", { class: "df-empty" }, "Sin números de oro registrados para este tema."));
      return sec;
    }
    var tbody = el("tbody", {});
    filas.forEach(function (r) {
      tbody.appendChild(
        el("tr", {}, el("td", {}, fragmento(r.dato || "", tema.slug)), el("td", { class: "df-muted" }, fragmento(r.fuente || "", tema.slug))),
      );
    });
    var tabla = el(
      "table",
      { class: "df-tabla-detalle" },
      el("thead", {}, el("tr", {}, el("th", { scope: "col" }, "Dato"), el("th", { scope: "col" }, "Fuente"))),
      tbody,
    );
    sec.appendChild(el("div", { class: "df-table-wrap" }, tabla));
    return sec;
  }

  function seccionBaseDetalle(tema) {
    var sec = seccion("Base de detalle");
    if (!tema.baseDetalleMd) {
      sec.appendChild(el("p", { class: "df-empty" }, "Sin base de detalle registrada para este tema."));
      return sec;
    }
    sec.appendChild(mdBlock(tema.baseDetalleMd, tema.slug, "df-md df-base-detalle"));
    return sec;
  }

  /**
   * Pares confundibles del tema: coinciden por `temaSlug` o, si el tema tiene
   * ficha propia, también por `ficha` (la mayoría del corpus real solo trae
   * `ficha`, sin `temaSlug` — coordinación del orquestador, no un supuesto
   * propio). Sin duplicar: cada entrada de `confundibles` se evalúa una sola
   * vez, así que un par que cumpla las dos condiciones no se repite.
   */
  function confundiblesDeTema(tema) {
    var lista = kit().confundibles;
    if (!Array.isArray(lista)) return [];
    return lista.filter(function (c) {
      if (c.temaSlug === tema.slug) return true;
      if (tema.ficha && c.ficha === tema.ficha) return true;
      return false;
    });
  }

  /** Solo se agrega al detalle si hay pares para este tema (devuelve null si no). */
  function seccionConfundibles(tema) {
    var filas = confundiblesDeTema(tema);
    if (!filas.length) return null;
    var sec = seccion("Confundibles");
    var tbody = el("tbody", {});
    filas.forEach(function (r) {
      tbody.appendChild(
        el(
          "tr",
          {},
          el("td", {}, fragmento(r.par || "", tema.slug)),
          el("td", {}, fragmento(r.diferencia || "", tema.slug)),
          el("td", { class: "df-muted" }, fragmento(r.donde || "", tema.slug)),
        ),
      );
    });
    var tabla = el(
      "table",
      { class: "df-tabla-detalle" },
      el(
        "thead",
        {},
        el("tr", {}, el("th", { scope: "col" }, "Par"), el("th", { scope: "col" }, "Diferencia"), el("th", { scope: "col" }, "Dónde cayó")),
      ),
      tbody,
    );
    sec.appendChild(el("div", { class: "df-table-wrap" }, tabla));
    return sec;
  }

  function seccionMadres(tema) {
    var sec = seccion("Páginas madre");
    var ids = Array.isArray(tema.madres) ? tema.madres : [];
    if (!ids.length) {
      sec.appendChild(el("p", { class: "df-empty" }, "Ninguna página madre está registrada para este tema."));
      return sec;
    }
    var porSlug = A.BY_SLUG || {};
    var lista = el("div", { class: "df-madre-list" });
    ids.forEach(function (id) {
      var pagina = porSlug[id];
      var tarjeta = el("div", { class: "df-madre-item" });
      tarjeta.appendChild(pageLink(id, pagina && pagina.title ? pagina.title : id, "df-madre-title"));
      if (pagina && pagina.summary) tarjeta.appendChild(el("p", { class: "df-muted" }, pagina.summary));
      lista.appendChild(tarjeta);
    });
    sec.appendChild(lista);
    return sec;
  }

  function renderDetalle(main, slug) {
    main.replaceChildren();
    var temas = temasData();
    var tema = buscarTema(temas, slug);

    if (!tema) {
      if (A.setCrumbs) A.setCrumbs([{ label: "Temas y tracker", hash: "#/temas" }, { label: "Tema no encontrado" }]);
      main.appendChild(
        el(
          "div",
          { class: "df-temas df-vacio" },
          el("p", {}, "No se encontró el tema “" + slug + "”."),
          toolLink("#/temas", "Volver al tablero", "df-btn df-btn-ghost"),
        ),
      );
      return undefined;
    }

    var cleanupFns = [];

    if (A.setCrumbs) A.setCrumbs([{ label: "Temas y tracker", hash: "#/temas" }, { label: tema.nombre }]);

    var raiz = el("div", { class: "df-temas df-detalle" });

    var pills = [el("span", { class: "df-pill df-tier-" + tema.tier.toLowerCase() }, "Tier " + tema.tier)];
    if (tema.fraccion) pills.push(el("span", { class: "df-pill" }, tema.fraccion));
    var unidades = Array.isArray(tema.unidades) ? tema.unidades : [];
    if (unidades.length) {
      pills.push(el("span", { class: "df-pill" }, (unidades.length > 1 ? "Unidades " : "Unidad ") + unidades.join(", ")));
    }
    if (tema.senal2025 && tema.senal2025 !== "—") {
      pills.push(el("span", { class: "df-pill df-pill-senal" }, tema.senal2025));
    }
    raiz.appendChild(el("div", { class: "df-header" }, el("h1", {}, tema.nombre), el("div", { class: "df-pills" }, pills)));

    raiz.appendChild(buildHitos(tema));

    var botones = el("div", { class: "df-botones" });
    if (tema.ficha) {
      botones.appendChild(pageLink(tema.ficha, "Ficha completa", "df-btn df-btn-primary"));
    } else {
      botones.appendChild(
        el(
          "div",
          { class: "df-sin-ficha" },
          el("span", {}, "Sin ficha propia: el esqueleto está tomado de "),
          pageLink("esqueletos-todos", "esqueletos-todos", "df-link"),
          el("span", {}, "."),
        ),
      );
    }
    botones.appendChild(toolLink("#/simulador/tema:" + tema.slug, "Practicar este tema", "df-btn df-btn-ghost"));
    botones.appendChild(toolLink("#/temas", "Volver al tablero", "df-btn df-btn-ghost"));
    raiz.appendChild(botones);

    raiz.appendChild(seccionComoCayo(tema));
    raiz.appendChild(seccionBanco(tema));
    raiz.appendChild(seccionEsqueleto(tema, cleanupFns));
    raiz.appendChild(seccionSeguro(tema));
    raiz.appendChild(seccionDesarrollo(tema));
    raiz.appendChild(seccionTrampas(tema));
    raiz.appendChild(seccionNumerosOro(tema));
    raiz.appendChild(seccionBaseDetalle(tema));
    raiz.appendChild(seccionMadres(tema));
    var confSec = seccionConfundibles(tema);
    if (confSec) raiz.appendChild(confSec);

    main.appendChild(raiz);

    return function cleanup() {
      cleanupFns.forEach(function (fn) {
        try {
          fn();
        } catch (err) {
          /* no-op: liberar lo que se pueda, un timer roto no debe frenar el resto */
        }
      });
    };
  }

  /* ---------------------------------------------------------------------
     Lectura de `arg` (BUNDLE.md §5, como `estado(arg)` de cripto-parciales)
     --------------------------------------------------------------------- */

  function estadoArg(arg) {
    var crudo = arg === undefined || arg === null ? "" : String(arg);
    if (!crudo && typeof location !== "undefined") {
      var qs = String(location.search || "").replace(/^\?/, "");
      var match = qs.match(/(?:^|&)arg=([^&]*)/);
      if (match) crudo = decodeURIComponent(match[1] || "");
    }
    return crudo.trim();
  }

  A.registerView("temas", function (main, arg) {
    /* El anfitrión remonta la vista al cambiar de tema claro/oscuro salvo que
       la vista registre su propio redibujo; como este bundle solo usa tokens
       CSS (nada que redibujar), basta un redibujo vacío para que el cambio de
       tema no reinicie lo que esté en curso (el cronómetro de recitado del
       detalle). */
    if (typeof A.setRedraw === "function") A.setRedraw(function () {});

    var slug = estadoArg(arg);
    var cleanup = slug ? renderDetalle(main, slug) : renderTablero(main);

    return function cleanupVista() {
      if (typeof A.setRedraw === "function") A.setRedraw(null);
      if (typeof cleanup === "function") cleanup();
    };
  });
})();
