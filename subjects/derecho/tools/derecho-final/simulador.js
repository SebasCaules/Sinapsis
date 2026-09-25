// simulador.js — vista «simulador» del bundle tools/derecho-final.
//
// Porta a Sinapsis las dos rutas de la study-app local (study-app/public/js/views/banco.js):
// /banco (banco de consignas reales con filtros) y /simulador (armado de un final de cinco
// preguntas, cronómetro, autocorrección 0/½/1 y umbral 4 de 5). Acá conviven como DOS
// SECCIONES de una sola vista registrada con el id "simulador" (ver BUNDLE.md §1 y §5).
//
// DATOS: (A.DATA && (A.DATA.kit || A.DATA["data/kit.json"])) || {} — nunca se lee sin esa guarda. El
// contrato de datos (BUNDLE.md §2) es el mismo que el de la study-app salvo que las
// referencias entre páginas son slugs directos (tema.ficha, banco[].tema) y no rutas.
//
// CERO NÚMEROS NUEVOS: esta vista no redacta contenido jurídico. Consignas, esqueletos,
// seguros anti-cero, trampas y números de oro se muestran tal cual llegan del kit; lo único
// propio son los rótulos de interfaz. Todo texto de la wiki que se inserta como marcado pasa
// por A.renderMarkdown + fragmento() (que sanea el HTML resultante); el resto se arma con
// document.createElement/textContent, nunca concatenando cadenas de HTML con datos.
//
// CRONÓMETRO (regla dura, BUNDLE.md §6.4): un único setInterval por sesión, creado una sola
// vez en empezarSimulacro() y nunca recreado por un re-render — "Revelar tema" y los botones
// de puntaje vuelven a llamar renderizarPaso(), que reconstruye la tarjeta de tiempo pero
// REUTILIZA el mismo nodo del contador (moverlo con appendChild no lo reinicia ni duplica el
// intervalo). Se libera siempre en el cleanup que devuelve el registerView.
//
// ARGUMENTOS (BUNDLE.md §5): "" o "banco" → sección Banco; "sim" → configurar un final
// realista; "tier:A" | "tier:B" | "tier:C" → final restringido a ese tier; "tema:<slug>" →
// práctica de una sola consigna de ese tema. Los primeros cuatro modos de generación
// (realista, solo-a, tier-bc, flojos, un-tema) son los de la study-app; "tier" es un modo
// nuevo que pide el contrato (BUNDLE.md §5) y no existía allá: restringe el final completo a
// un único tier a elección, generalizando lo que "solo-a" hacía solo para el tier A.
(function () {
  "use strict";

  var A = window.App;
  if (!A || !A.registerView) return;

  // ---------------------------------------------------------------------------
  // 1. Utilidades de texto y DOM
  // ---------------------------------------------------------------------------

  function foldAccents(value) {
    return String(value === null || value === undefined ? "" : value)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function normStr(value) {
    return foldAccents(value).toLowerCase().trim();
  }

  /** Nodo con atributos (incl. onEvento) e hijos, sin concatenar marcado. */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "class") {
        node.className = v;
        return;
      }
      if (k.indexOf("on") === 0 && typeof v === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), v);
        return;
      }
      if (v === true) {
        node.setAttribute(k, "");
        return;
      }
      node.setAttribute(k, String(v));
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return node;
  }

  // Etiquetas que se podan enteras (con su contenido): ademas de las peligrosas de
  // ejecucion (script/style/iframe/object/embed) se suman las que pueden reintroducir
  // un vector de navegacion o de formulario (form/base/link/meta) y las que no tienen
  // sentido dentro de markdown de wiki renderizado (svg/math/input/textarea/select/
  // button). Podarlas ENTERAS evita tener que sanear por separado cada atributo propio
  // de esas etiquetas (p. ej. xlink:href dentro de un <svg><a>).
  var ETIQUETAS_PODADAS =
    "script, style, iframe, object, embed, form, base, link, meta, svg, math, input, textarea, select, button";

  // Atributos que pueden llevar una URL navegable/ejecutable.
  var ATRIBUTOS_URL = ["href", "src", "action", "formaction", "xlink:href", "data", "poster", "srcset", "background"];

  // Unicos esquemas de URL que se dejan pasar. Todo lo demas (incl. "javascript:",
  // "data:", "vbscript:") se quita, salvo que el valor sea una ruta relativa, un
  // ancla "#..." o una ruta absoluta "/...".
  var ESQUEMAS_URL_PERMITIDOS = ["http:", "https:", "mailto:"];

  /**
   * Normaliza un valor de atributo-URL para decidir si es seguro: le saca todo
   * caracter de control o espacio (asi se detecta "jav\tascript:", que es lo que
   * queda tras parsear "jav&#x09;ascript:") y lo pasa a minusculas. Funcion pura,
   * no toca el DOM: es la que se prueba con node en el smoke test.
   */
  function normalizarValorUrl(valor) {
    return String(valor === null || valor === undefined ? "" : valor)
      .replace(/[\u0000- ]+/g, "")
      .toLowerCase();
  }

  /**
   * true si el valor (ya normalizado) es un esquema permitido, una ruta relativa
   * sin esquema, un ancla "#..." o una ruta absoluta "/...". Funcion pura,
   * testeable sin DOM.
   */
  function esValorUrlSeguro(valorOriginal) {
    var valor = normalizarValorUrl(valorOriginal);
    if (!valor) return true; // atributo vacio: nada peligroso que bloquear
    if (valor.charAt(0) === "#" || valor.charAt(0) === "/") return true;
    var mEsquema = /^[a-z][a-z0-9+.-]*:/.exec(valor);
    if (!mEsquema) return true; // ruta relativa sin esquema explicito ("img/x.png")
    return ESQUEMAS_URL_PERMITIDOS.indexOf(mEsquema[0]) >= 0;
  }

  /** Aplica la poda de etiquetas y el saneado de atributos sobre un documento ya
   * parseado (doc.body). Funcion separada de fragmento() para poder probarla con
   * un DOM minimo sin pasar por A.renderMarkdown. */
  function sanearDocumento(doc) {
    var nodosPodados = doc.body.querySelectorAll(ETIQUETAS_PODADAS);
    Array.prototype.slice.call(nodosPodados).forEach(function (n) {
      n.remove();
    });
    doc.body.querySelectorAll("*").forEach(function (n) {
      Array.prototype.slice.call(n.attributes).forEach(function (at) {
        var nombre = at.name.toLowerCase();
        if (nombre.indexOf("on") === 0) {
          n.removeAttribute(at.name);
          return;
        }
        if (ATRIBUTOS_URL.indexOf(nombre) >= 0 && !esValorUrlSeguro(at.value)) {
          n.removeAttribute(at.name);
        }
      });
    });
  }

  /**
   * El markdown ya compuesto por A.renderMarkdown, como nodos. Se parsea en un
   * documento aparte —donde nada se ejecuta ni se carga— y se poda antes de
   * adjuntarlo. Mismo mecanismo que el bundle de referencia (cripto-parciales),
   * con el saneador reforzado (ver sanearDocumento).
   */
  function fragmento(markdown, slugActual) {
    var html = A.renderMarkdown ? A.renderMarkdown(markdown || "", slugActual || null) : "";
    var doc = new DOMParser().parseFromString("<body>" + html + "</body>", "text/html");
    sanearDocumento(doc);
    var frag = document.createDocumentFragment();
    while (doc.body.firstChild) frag.appendChild(doc.body.firstChild);
    return frag;
  }

  /** Bloque cuyo contenido es markdown de la wiki ya renderizado y saneado. */
  function nodoMarkdown(tag, clase, markdown, slugActual, id) {
    var attrs = clase ? { class: clase } : {};
    if (id) attrs.id = id;
    var node = el(tag, attrs, []);
    node.appendChild(fragmento(markdown, slugActual));
    return node;
  }

  function debounce(fn, wait) {
    var t = null;
    return function () {
      var args = arguments;
      var ctx = this;
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  function avisar(mensaje, ok) {
    if (A.toast) A.toast(mensaje, ok ? "ok" : "bad");
  }

  function formatearTiempo(segundos) {
    var s = Math.max(segundos, 0);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (m < 10 ? "0" + m : String(m)) + ":" + (r < 10 ? "0" + r : String(r));
  }

  // ---------------------------------------------------------------------------
  // 2. Logica pura -- filtrado y agrupamiento del banco (sin DOM, testeable con node)
  // ---------------------------------------------------------------------------

  function filtrarBanco(banco, temasList, filtros) {
    var items = Array.isArray(banco) ? banco : [];
    var temaBySlugLocal = {};
    (Array.isArray(temasList) ? temasList : []).forEach(function (t) {
      temaBySlugLocal[t.slug] = t;
    });
    var f = filtros || {};
    var textoNorm = f.texto ? normStr(f.texto) : "";

    return items.filter(function (b) {
      if (f.tipo && f.tipo !== "todos" && b.tipo !== f.tipo) return false;
      if (f.tier) {
        var tema = temaBySlugLocal[b.tema];
        if (!tema || tema.tier !== f.tier) return false;
      }
      if (f.unidad !== undefined && f.unidad !== null && f.unidad !== "") {
        if (Number(b.unidad) !== Number(f.unidad)) return false;
      }
      if (f.tema && b.tema !== f.tema) return false;
      if (f.anio !== undefined && f.anio !== null && f.anio !== "") {
        if (Number(b.anio) !== Number(f.anio)) return false;
      }
      if (textoNorm) {
        var haystack = normStr((b.consigna || "") + " " + (b.nota || "") + " " + (b.fuente || "") + " " + (b.tema || ""));
        if (haystack.indexOf(textoNorm) < 0) return false;
      }
      return true;
    });
  }

  function agruparPorTema(banco, temasList) {
    var items = Array.isArray(banco) ? banco : [];
    var list = Array.isArray(temasList) ? temasList : [];
    return list
      .map(function (tema) {
        return {
          slug: tema.slug,
          nombre: tema.nombre,
          tier: tema.tier,
          fraccion: tema.fraccion,
          items: items.filter(function (b) {
            return b.tema === tema.slug;
          }),
        };
      })
      .filter(function (g) {
        return g.items.length > 0;
      });
  }

  // agruparPorFinal(): misma heuristica de matching banco[] contra finales[] que la
  // study-app (fecha compatible por anio/mes/dia, desempate por superposicion de tokens de
  // fecha+fuente contra fecha+archivo, y un refuerzo final con temas[].apariciones para
  // senales/notas sin fecha propia). El kit de Sinapsis (BUNDLE.md parrafo 2) no declara el
  // campo temas[].apariciones, asi que ese ultimo refuerzo queda inerte por ausencia de
  // dato, no por error: los items que dependian de el terminan igual que en la study-app
  // cuando esa reserva no alcanzaba, en el grupo "Sin fecha / señal". No es una regresion
  // funcional: el propio campo nunca viajo en el contrato de datos de esta vista.

  var MESES = {
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8,
    setiembre: 9, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
  };

  function dateParts(raw) {
    var s = normStr(raw);
    var m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return { day: Number(m[1]), month: Number(m[2]), year: Number(m[3]) };
    m = s.match(/(\d{1,2})\/(\d{4})/);
    if (m) return { day: null, month: Number(m[1]), year: Number(m[2]) };
    var nombresMes = Object.keys(MESES);
    for (var i = 0; i < nombresMes.length; i += 1) {
      var name = nombresMes[i];
      if (s.indexOf(name) >= 0) {
        var y = s.match(/(\d{4})/);
        return { day: null, month: MESES[name], year: y ? Number(y[1]) : null };
      }
    }
    var y2 = s.match(/(\d{4})/);
    if (y2) return { day: null, month: null, year: Number(y2[1]) };
    return { day: null, month: null, year: null };
  }

  function dateCompatible(a, b) {
    if (a.year === null || b.year === null) return false;
    if (a.year !== b.year) return false;
    if (a.day && b.day && a.day !== b.day) return false;
    if (a.month && b.month && a.month !== b.month) return false;
    return true;
  }

  var STOPWORDS = { de: true, la: true, el: true, en: true, y: true, pdf: true, txt: true, doc: true, jpg: true };

  function tokens(value) {
    return normStr(value)
      .split(/[^a-z0-9]+/)
      .filter(function (t) {
        return t && !STOPWORDS[t] && (t.length >= 2 || /^[0-9]$/.test(t));
      });
  }

  function toSet(arr) {
    var s = {};
    arr.forEach(function (x) {
      s[x] = true;
    });
    return s;
  }

  function tokenScore(itemTokens, finalTokenSet) {
    var score = 0;
    for (var i = 0; i < itemTokens.length; i += 1) {
      if (finalTokenSet[itemTokens[i]]) score += 1;
    }
    return score;
  }

  function agruparPorFinal(banco, finalesList, temasList) {
    var items = Array.isArray(banco) ? banco : [];
    var finales = Array.isArray(finalesList) ? finalesList : [];
    var temaBySlugLocal = {};
    (Array.isArray(temasList) ? temasList : []).forEach(function (t) {
      temaBySlugLocal[t.slug] = t;
    });

    var info = finales.map(function (f) {
      return { f: f, dp: dateParts(f.fecha), toks: toSet(tokens(f.fecha).concat(tokens(f.archivo))) };
    });

    var buckets = {};
    var sinFecha = [];

    items.forEach(function (item) {
      var idp = dateParts(item.fecha);
      var cands = info.filter(function (fi) {
        return dateCompatible(idp, fi.dp);
      });

      if (cands.length > 1) {
        var itoksArr = tokens(item.fecha).concat(tokens(item.fuente));
        var best = [];
        var bestScore = -1;
        cands.forEach(function (c) {
          var sc = tokenScore(itoksArr, c.toks);
          if (sc > bestScore) {
            bestScore = sc;
            best = [c];
          } else if (sc === bestScore) {
            best.push(c);
          }
        });
        cands = best;
      }

      if (cands.length === 0 && item.tipo === "final") {
        var tema = temaBySlugLocal[item.tema];
        if (tema && Array.isArray(tema.apariciones) && tema.apariciones.length === 1) {
          var f = finales.filter(function (x) {
            return x.fid === tema.apariciones[0];
          })[0];
          if (f) {
            var fdp = dateParts(f.fecha);
            var yearConflict = idp.year !== null && fdp.year !== null && idp.year !== fdp.year;
            if (!yearConflict) cands = [{ f: f }];
          }
        }
      }

      if (cands.length === 0) {
        sinFecha.push(item);
        return;
      }

      var chosen = cands[0].f;
      if (!buckets[chosen.fid]) {
        buckets[chosen.fid] = { fid: chosen.fid, fecha: chosen.fecha, archivo: chosen.archivo, items: [] };
      }
      buckets[chosen.fid].items.push(item);
    });

    var ordered = finales
      .map(function (f) {
        return buckets[f.fid];
      })
      .filter(Boolean);
    if (sinFecha.length) ordered.push({ fid: null, fecha: null, archivo: null, items: sinFecha });
    return ordered;
  }

  // ---------------------------------------------------------------------------
  // 3. Logica pura -- generacion de un final (misma que la study-app + modo "tier" nuevo)
  // ---------------------------------------------------------------------------

  var TIER_WEIGHT = { A: 3, B: 2, C: 1 };

  // Muestreo ponderado sin reemplazo: en cada paso se recalculan los pesos sobre lo que
  // queda del pool y se elige un punto al azar en [0, pesoTotal) con rnd() (inyectable
  // para tests deterministas).
  function weightedSample(pool, weightFn, count, rnd) {
    var remaining = pool.slice();
    var picked = [];
    for (var i = 0; i < count && remaining.length; i += 1) {
      var weights = remaining.map(function (item) {
        return Math.max(weightFn(item), 0.0001);
      });
      var total = weights.reduce(function (a, b) {
        return a + b;
      }, 0);
      var point = rnd() * total;
      var idx = weights.length - 1;
      for (var j = 0; j < weights.length; j += 1) {
        if (point < weights[j]) {
          idx = j;
          break;
        }
        point -= weights[j];
      }
      picked.push(remaining[idx]);
      remaining.splice(idx, 1);
    }
    return picked;
  }

  function uniformSample(pool, count, rnd) {
    return weightedSample(
      pool,
      function () {
        return 1;
      },
      count,
      rnd,
    );
  }

  function pickConsignaFinal(kit, temaSlug, rnd) {
    var candidatas = (kit.banco || []).filter(function (b) {
      return b.tema === temaSlug && b.tipo === "final";
    });
    if (!candidatas.length) return null;
    var idx = Math.min(candidatas.length - 1, Math.floor(rnd() * candidatas.length));
    return candidatas[idx];
  }

  function buildPregunta(n, tema, kit, rnd, bancoId) {
    var exacta = bancoId
      ? (kit.banco || []).filter(function (b) {
          return b.id === bancoId;
        })[0]
      : null;
    var elegida = exacta || pickConsignaFinal(kit, tema.slug, rnd);
    if (elegida) {
      return {
        n: n,
        temaSlug: tema.slug,
        consigna: elegida.consigna,
        fecha: elegida.fecha || null,
        fuente: elegida.fuente || null,
        generica: false,
      };
    }
    return {
      n: n,
      temaSlug: tema.slug,
      consigna: "Desarrolle el tema: " + tema.nombre,
      fecha: null,
      fuente: null,
      generica: true,
    };
  }

  function generarFinal(kit, opts, rnd) {
    var random = typeof rnd === "function" ? rnd : Math.random;
    var datos = kit || {};
    var temasList = Array.isArray(datos.temas) ? datos.temas : [];
    var options = opts || {};
    var modo = options.modo || "realista";

    if (modo === "un-tema") {
      var temaUno = temasList.filter(function (t) {
        return t.slug === options.tema;
      })[0];
      if (!temaUno) return [];
      return [buildPregunta(1, temaUno, datos, random, options.bancoId)];
    }

    var tierA = temasList.filter(function (t) {
      return t.tier === "A";
    });
    var tierB = temasList.filter(function (t) {
      return t.tier === "B";
    });
    var tierC = temasList.filter(function (t) {
      return t.tier === "C";
    });

    var elegidos = [];

    if (modo === "tier") {
      // Modo nuevo (BUNDLE.md parrafo 5, argumento "tier:A|B|C"): generaliza "solo-a" a
      // cualquiera de los tres tiers, restringiendo el final completo a ese pool.
      var tierElegido = options.tier === "B" ? tierB : options.tier === "C" ? tierC : tierA;
      elegidos = uniformSample(tierElegido, 5, random);
    } else if (modo === "solo-a") {
      elegidos = uniformSample(tierA, 5, random);
    } else if (modo === "tier-bc") {
      elegidos = uniformSample(tierB.concat(tierC), 5, random);
    } else if (modo === "flojos") {
      var tracker = options.tracker || {};
      var pesoFn = function (t) {
        return TIER_WEIGHT[t.tier] || 1;
      };
      var flojos = temasList.filter(function (t) {
        return !(tracker[t.slug] && tracker[t.slug].sim);
      });
      elegidos = weightedSample(flojos, pesoFn, 5, random);
      if (elegidos.length < 5) {
        var yaElegidos = {};
        elegidos.forEach(function (t) {
          yaElegidos[t.slug] = true;
        });
        var restantes = temasList.filter(function (t) {
          return !yaElegidos[t.slug];
        });
        elegidos = elegidos.concat(weightedSample(restantes, pesoFn, 5 - elegidos.length, random));
      }
    } else {
      // "realista" (default): 3 de tier A + 1 de tier B + 1 mas (A/B/C) con peso n+1.
      var tresA = uniformSample(tierA, 3, random);
      var usados = {};
      tresA.forEach(function (t) {
        usados[t.slug] = true;
      });
      var poolB = tierB.filter(function (t) {
        return !usados[t.slug];
      });
      var unaB = uniformSample(poolB, 1, random);
      unaB.forEach(function (t) {
        usados[t.slug] = true;
      });
      var poolBonus = temasList.filter(function (t) {
        return !usados[t.slug];
      });
      var bonus = weightedSample(
        poolBonus,
        function (t) {
          return (t.n || 0) + 1;
        },
        1,
        random,
      );
      elegidos = tresA.concat(unaB, bonus);
    }

    return elegidos.slice(0, 5).map(function (tema, i) {
      return buildPregunta(i + 1, tema, datos, random);
    });
  }

  // umbral(): regla 4-de-5 (>= 1 punto en al menos 4 de las 5 preguntas; null cuenta 0).
  function umbral(puntajes) {
    var arr = Array.isArray(puntajes) ? puntajes : [];
    var aprobadas = arr.filter(function (p) {
      return (typeof p === "number" ? p : 0) >= 1;
    }).length;
    return aprobadas >= 4;
  }

  // ---------------------------------------------------------------------------
  // 4. Lectura del argumento de la vista
  // ---------------------------------------------------------------------------

  // estado(arg): el parametro de la funcion y, si viene vacio, ?arg= de location.search
  // (BUNDLE.md parrafo 5, mismo patron que el bundle de referencia cripto-parciales).
  function estado(arg) {
    var raw = String(arg || "");
    if (!raw && typeof location !== "undefined") {
      var qs = String(location.search || "").replace(/^\?/, "");
      var m = /(?:^|&)arg=([^&]*)/.exec(qs);
      if (m) raw = decodeURIComponent(m[1] || "");
    }
    raw = raw.trim();

    if (!raw || raw === "banco") return { seccion: "banco" };
    if (raw === "sim") return { seccion: "simulador", modo: "realista" };

    var mTier = /^tier:(A|B|C)$/i.exec(raw);
    if (mTier) return { seccion: "simulador", modo: "tier", tier: mTier[1].toUpperCase() };

    // "tema:<slug>" practica el tema en general (una consigna cualquiera de tipo
    // "final" de ese tema); "tema:<slug>:<bancoId>" practica la consigna EXACTA del
    // banco identificada por bancoId (la que emite la tarjeta de consigna al hacer
    // clic en "Practicar este tema" desde el banco). generarFinal ya soportaba
    // options.bancoId en el modo "un-tema"; lo unico que faltaba era propagarlo.
    var mTema = /^tema:([^:]+)(?::(.+))?$/.exec(raw);
    if (mTema) {
      return { seccion: "simulador", modo: "un-tema", temaSlug: mTema[1], bancoId: mTema[2] || null };
    }

    // Argumento desconocido: se decide lo mas conservador (BUNDLE.md parrafo 8) y se cae
    // al banco, en vez de fallar en blanco.
    return { seccion: "banco" };
  }

  // ---------------------------------------------------------------------------
  // 5. Helpers de interfaz compartidos por las dos secciones
  // ---------------------------------------------------------------------------

  function etiquetaCampo(texto, control, extraClase) {
    return el("label", { class: "df-sim-campo" + (extraClase ? " " + extraClase : "") }, [
      el("span", {}, [texto]),
      control,
    ]);
  }

  function selectorSimple(opciones, valorActual, alCambiar) {
    return el(
      "select",
      {
        class: "df-select",
        onchange: function (e) {
          alCambiar(e.target.value);
        },
      },
      opciones.map(function (o) {
        return el("option", { value: o.value, selected: o.value === valorActual }, [o.label]);
      }),
    );
  }

  // Pildora de tier: la letra es siempre texto visible (nunca solo color), con un prefijo
  // solo-lectura para quien usa lector de pantalla (BUNDLE.md regla 8: nada depende solo
  // del color).
  function pastillaTier(tier) {
    var t = tier === "A" || tier === "B" || tier === "C" ? tier : null;
    return el("span", { class: "df-sim-pill df-sim-pill-" + (t || "x") }, [
      el("span", { class: "df-sr-only" }, ["Tier "]),
      t || "?",
    ]);
  }

  function bloqueColapsable(titulo, contenidoNode) {
    var details = el("details", { class: "df-sim-bloque" }, []);
    details.appendChild(el("summary", {}, [titulo]));
    details.appendChild(contenidoNode);
    return details;
  }

  function tablaNumerosOro(numerosOro, slugCtx) {
    if (!Array.isArray(numerosOro) || !numerosOro.length) {
      return el("p", { class: "df-sim-muted" }, ["Sin números de oro registrados."]);
    }
    var wrapTabla = el("div", { class: "df-table-wrap" }, []);
    var table = el("table", {}, []);
    var tbody = el("tbody", {}, []);
    numerosOro.forEach(function (fila) {
      var tdDato = el("td", {}, []);
      tdDato.appendChild(fragmento(fila.dato || "", slugCtx));
      var tdFuente = el("td", {}, []);
      tdFuente.appendChild(fragmento(fila.fuente || "", slugCtx));
      var tr = el("tr", {}, []);
      tr.appendChild(tdDato);
      tr.appendChild(tdFuente);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrapTabla.appendChild(table);
    return wrapTabla;
  }

  // construirPestanas(): el conmutador Banco/Simulador de la cabecera. Durante el examen o
  // la correccion se bloquea (BUNDLE.md regla del cronometro + decision conservadora propia,
  // ver diferenciasConLaStudyApp): la study-app tenia /banco y /simulador como rutas
  // separadas y nunca corria este riesgo; aca las dos secciones comparten una vista, asi que
  // cambiar de pestana en medio de un simulacro cronometrado tiraria el progreso sin avisar.
  function construirPestanas(seccionActual, bloquear) {
    var nav = el("nav", { class: "df-sim-tabs", "aria-label": "Secciones del simulador de final" }, []);
    var esBanco = seccionActual === "banco";

    var linkBanco = el("a", { class: "df-sim-tab" + (esBanco ? " is-on" : "") }, ["Banco"]);
    var linkSim = el("a", { class: "df-sim-tab" + (!esBanco ? " is-on" : "") }, ["Simulador"]);

    if (esBanco) linkBanco.setAttribute("aria-current", "true");
    else linkSim.setAttribute("aria-current", "true");

    [
      [linkBanco, "#/simulador"],
      [linkSim, "#/simulador/sim"],
    ].forEach(function (par) {
      var nodo = par[0];
      var destino = par[1];
      if (bloquear) {
        nodo.setAttribute("aria-disabled", "true");
        nodo.classList.add("is-disabled");
        nodo.setAttribute("title", "Termine el simulacro en curso para cambiar de sección.");
      } else {
        nodo.setAttribute("href", destino);
        nodo.setAttribute("data-nav", destino);
      }
    });

    nav.appendChild(linkBanco);
    nav.appendChild(linkSim);
    return nav;
  }

  var TIPOS_BANCO = [
    { id: "final", label: "Final" },
    { id: "senal", label: "Señal" },
    { id: "tipica", label: "Típica" },
    { id: "virtual", label: "Virtual" },
    { id: "nota", label: "Nota" },
    { id: "todos", label: "Todos" },
  ];

  var MODOS_SIMULADOR = [
    { id: "realista", label: "Realista (3 A + 1 B + 1 al azar)" },
    { id: "solo-a", label: "Solo tier A" },
    { id: "tier-bc", label: "Tier B y C combinados" },
    { id: "tier", label: "Un tier a elección" },
    { id: "flojos", label: "Mis temas flojos (sin punto en simulacro)" },
    { id: "un-tema", label: "Un solo tema" },
  ];

  // ---------------------------------------------------------------------------
  // 6. Registro de la vista
  // ---------------------------------------------------------------------------

  A.registerView("simulador", function (main, arg) {
    // Los estilos de esta vista son solo tokens CSS (BUNDLE.md regla 5): no hay
    // nada propio que redibujar al cambiar de tema claro/oscuro. Aun asi hay que
    // registrar un redibujo vacio: si la vista no registra ninguno, el anfitrion
    // interpreta que no sabe reaccionar al cambio de tema y remonta la vista entera
    // desde cero, lo que borraria un simulacro en curso (timer, respuestas,
    // puntajes). Un no-op alcanza para evitar ese remontaje.
    if (typeof A.setRedraw === "function") A.setRedraw(function () {});

    var st = estado(arg);
    var kit = (A.DATA && (A.DATA.kit || A.DATA["data/kit.json"])) || {};
    var temas = Array.isArray(kit.temas) ? kit.temas.slice() : [];
    var temaBySlug = {};
    temas.forEach(function (t) {
      temaBySlug[t.slug] = t;
    });
    var temasOrdenados = temas.slice().sort(function (a, b) {
      return String(a.nombre).localeCompare(String(b.nombre), "es");
    });

    if (A.setCrumbs) {
      A.setCrumbs([{ label: st.seccion === "banco" ? "Banco de preguntas" : "Simulador de final" }]);
    }

    // Cronometro (BUNDLE.md regla 4): un unico setInterval por sesion de la vista, vivo
    // solo mientras la seccion simulador esta en el paso "examen". Vive en este alcance
    // -no dentro de montarSimulador- para que el cleanup que se devuelve al final siempre
    // pueda liberarlo, sea cual sea la seccion o el paso en que se encontraba al desmontar.
    var timerId = null;
    var disposed = false;
    function limpiarTimer() {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    var raiz = el("div", { class: "df-sim" }, []);
    main.replaceChildren(raiz);

    // -------------------------------------------------------------------------
    // Seccion "Banco de preguntas"
    // -------------------------------------------------------------------------

    function montarBanco() {
      var filtros = { tipo: "final", tier: "", unidad: "", tema: "", anio: "", texto: "" };
      var modoAgrupacion = "tema"; // "tema" | "final"

      var tabsEl = construirPestanas("banco", false);
      var contadorEl = el("span", { class: "df-sim-contador", "aria-live": "polite" }, [""]);
      var encabezado = el("div", { class: "df-sim-encabezado" }, [
        el("h1", { class: "df-sim-titulo" }, ["Banco de preguntas"]),
        el("p", { class: "df-sim-subtitulo" }, ["Consignas reales de finales, señales, típicas y notas de cátedra."]),
        contadorEl,
      ]);
      var filtrosEl = el("div", { class: "df-sim-filtros" }, []);
      var modoEl = el("div", { class: "df-sim-modo" }, []);
      var bodyEl = el("div", { class: "df-sim-body" }, []);

      raiz.appendChild(tabsEl);
      raiz.appendChild(encabezado);
      raiz.appendChild(filtrosEl);
      raiz.appendChild(modoEl);
      raiz.appendChild(bodyEl);

      function construirFiltros() {
        filtrosEl.replaceChildren();
        var unidades = [{ value: "", label: "Todas" }];
        for (var u = 1; u <= 9; u += 1) unidades.push({ value: String(u), label: "Unidad " + u });

        var grupoAlcance = el("div", { class: "df-sim-grupo", role: "group", "aria-label": "Filtros de alcance" }, [
          etiquetaCampo(
            "Tipo",
            selectorSimple(
              TIPOS_BANCO.map(function (t) {
                return { value: t.id, label: t.label };
              }),
              filtros.tipo,
              function (v) {
                filtros.tipo = v;
                actualizar();
              },
            ),
          ),
          etiquetaCampo(
            "Tier",
            selectorSimple(
              [
                { value: "", label: "Todos" },
                { value: "A", label: "A" },
                { value: "B", label: "B" },
                { value: "C", label: "C" },
              ],
              filtros.tier,
              function (v) {
                filtros.tier = v;
                actualizar();
              },
            ),
          ),
          etiquetaCampo(
            "Unidad",
            selectorSimple(unidades, filtros.unidad, function (v) {
              filtros.unidad = v;
              actualizar();
            }),
          ),
        ]);

        var temaOpciones = [{ value: "", label: "Todos" }].concat(
          temasOrdenados.map(function (t) {
            return { value: t.slug, label: t.nombre };
          }),
        );
        var inputAnio = el("input", {
          class: "df-input",
          type: "number",
          value: filtros.anio || "",
          placeholder: "Año",
          onchange: function (e) {
            filtros.anio = e.target.value;
            actualizar();
          },
        }, []);
        var inputTexto = el("input", {
          class: "df-input",
          type: "search",
          value: filtros.texto || "",
          placeholder: "Buscar texto",
          oninput: debounce(function (e) {
            filtros.texto = e.target.value;
            actualizar();
          }, 250),
        }, []);

        var grupoBusqueda = el("div", { class: "df-sim-grupo", role: "group", "aria-label": "Búsqueda concreta" }, [
          etiquetaCampo(
            "Tema",
            selectorSimple(temaOpciones, filtros.tema, function (v) {
              filtros.tema = v;
              actualizar();
            }),
          ),
          etiquetaCampo("Año", inputAnio),
          etiquetaCampo("Buscar texto", inputTexto, "df-sim-campo-texto"),
        ]);

        filtrosEl.appendChild(grupoAlcance);
        filtrosEl.appendChild(grupoBusqueda);
      }

      function construirModo() {
        modoEl.replaceChildren();
        modoEl.appendChild(
          el(
            "button",
            {
              class: "df-btn " + (modoAgrupacion === "tema" ? "df-btn-primary" : "df-btn-ghost"),
              type: "button",
              "aria-pressed": modoAgrupacion === "tema" ? "true" : "false",
              onclick: function () {
                modoAgrupacion = "tema";
                actualizar();
              },
            },
            ["Por tema"],
          ),
        );
        modoEl.appendChild(
          el(
            "button",
            {
              class: "df-btn " + (modoAgrupacion === "final" ? "df-btn-primary" : "df-btn-ghost"),
              type: "button",
              "aria-pressed": modoAgrupacion === "final" ? "true" : "false",
              onclick: function () {
                modoAgrupacion = "final";
                actualizar();
              },
            },
            ["Por final"],
          ),
        );
      }

      function tarjetaConsigna(item, temaOpt) {
        var tema = temaOpt || temaBySlug[item.tema];
        var nombreTema = tema ? tema.nombre : item.tema;
        var card = el("article", { class: "df-sim-item" }, []);

        var metaLine = el("div", { class: "df-sim-item-meta" }, []);
        if (!temaOpt) {
          metaLine.appendChild(pastillaTier(tema && tema.tier));
          metaLine.appendChild(el("span", {}, [" " + nombreTema + " · "]));
        }
        if (item.fecha) metaLine.appendChild(el("span", {}, [item.fecha]));
        if (item.fuente) {
          metaLine.appendChild(el("span", {}, [item.fecha ? " · " + item.fuente : item.fuente]));
        }
        card.appendChild(metaLine);

        card.appendChild(nodoMarkdown("div", "df-sim-item-consigna", item.consigna || "", tema && tema.ficha));

        if (item.nota) {
          card.appendChild(nodoMarkdown("div", "df-sim-item-nota", item.nota, tema && tema.ficha));
        }

        var acciones = el("div", { class: "df-sim-item-acciones" }, []);
        if (tema && tema.ficha) {
          acciones.appendChild(
            el("a", { class: "df-btn df-btn-ghost", href: "#/p/" + encodeURIComponent(tema.ficha), "data-go": tema.ficha }, ["Ficha"]),
          );
        }
        var destinoPracticar =
          "#/simulador/tema:" + encodeURIComponent(item.tema) + (item.id ? ":" + encodeURIComponent(item.id) : "");
        acciones.appendChild(
          el("a", { class: "df-btn df-btn-ghost", href: destinoPracticar, "data-nav": destinoPracticar }, ["Practicar este tema"]),
        );
        card.appendChild(acciones);
        return card;
      }

      function construirCuerpo() {
        bodyEl.replaceChildren();
        var filtrados = filtrarBanco(kit.banco, temas, filtros);
        contadorEl.textContent = filtrados.length + " consigna" + (filtrados.length === 1 ? "" : "s");

        if (!filtrados.length) {
          bodyEl.appendChild(el("p", { class: "df-sim-vacio" }, ["No hay consignas con estos filtros."]));
          return;
        }

        if (modoAgrupacion === "tema") {
          agruparPorTema(filtrados, temas).forEach(function (grupo) {
            var tema = temaBySlug[grupo.slug];
            var titulo = el("h2", { class: "df-sim-grupo-titulo" }, []);
            titulo.appendChild(pastillaTier(grupo.tier));
            titulo.appendChild(el("span", {}, [" " + grupo.nombre + " "]));
            if (grupo.fraccion) titulo.appendChild(el("span", { class: "df-sim-muted" }, ["(" + grupo.fraccion + ")"]));
            var section = el("section", { class: "df-sim-grupo-consignas" }, [titulo]);
            grupo.items.forEach(function (item) {
              section.appendChild(tarjetaConsigna(item, tema));
            });
            bodyEl.appendChild(section);
          });
        } else {
          agruparPorFinal(filtrados, kit.finales, temas).forEach(function (grupo) {
            var tituloTxt = grupo.fid ? grupo.fid + " — " + (grupo.fecha || "s/f") : "Sin fecha / señal";
            var titulo = el("h2", { class: "df-sim-grupo-titulo" }, [tituloTxt]);
            if (grupo.archivo) titulo.appendChild(el("span", { class: "df-sim-muted" }, [" · " + grupo.archivo]));
            var section = el("section", { class: "df-sim-grupo-consignas" }, [titulo]);
            grupo.items.forEach(function (item) {
              section.appendChild(tarjetaConsigna(item));
            });
            bodyEl.appendChild(section);
          });
        }
      }

      function actualizar() {
        construirFiltros();
        construirModo();
        construirCuerpo();
      }

      actualizar();
    }

    // -------------------------------------------------------------------------
    // Seccion "Simulador de final"
    // -------------------------------------------------------------------------

    function montarSimulador() {
      var ajustesGuardados = A.LS ? A.LS.get("ajustes", {}) : {};
      var minutosInicial =
        ajustesGuardados && typeof ajustesGuardados.minutosPorPregunta === "number" && ajustesGuardados.minutosPorPregunta > 0
          ? ajustesGuardados.minutosPorPregunta
          : 12;

      var sim = {
        step: "config", // "config" | "examen" | "correccion"
        modo: st.modo || "realista",
        tier: st.tier || "A",
        temaSlug: st.temaSlug || "",
        bancoId: st.bancoId || null,
        minutos: minutosInicial,
        preguntas: [],
        revelados: {},
        aMano: {},
        respuestas: [],
        puntajes: [],
        inicioAt: null,
        totalSeg: 0,
        duracionSeg: 0,
        // Contador de "Revelar tema" del simulacro en curso. Solo vive en memoria de
        // esta sesion de la vista, igual que en la study-app (banco.js): no es una de
        // las claves de A.LS (BUNDLE.md §4), asi que no se persiste ni se guarda en
        // el registro.
        pistas: 0,
        guardado: false,
      };

      var remaining = 0;
      var countdownEl = null;
      var avisoEl = null;

      var tabsEl = el("nav", {}, []);
      var cuerpoEl = el("div", { class: "df-sim-cuerpo" }, []);
      raiz.appendChild(tabsEl);
      raiz.appendChild(cuerpoEl);

      function actualizarTabs() {
        var bloquear = sim.step === "examen" || sim.step === "correccion";
        var nuevo = construirPestanas("simulador", bloquear);
        raiz.replaceChild(nuevo, tabsEl);
        tabsEl = nuevo;
      }

      function textoAviso(rem) {
        var base = sim.minutos + " min por pregunta · " + sim.preguntas.length + " pregunta" + (sim.preguntas.length === 1 ? "" : "s");
        var perQ = sim.minutos * 60;
        if (!perQ || !sim.preguntas.length) return base;
        var elapsed = Math.max(sim.totalSeg - rem, 0);
        var idxActual = Math.min(sim.preguntas.length - 1, Math.floor(elapsed / perQ));
        var restanteEnPregunta = perQ - (elapsed % perQ);
        if (restanteEnPregunta <= 60) {
          return "Quedan " + restanteEnPregunta + "s del tiempo sugerido para la pregunta " + (idxActual + 1) + " · " + base;
        }
        return base;
      }

      function empezarSimulacro() {
        var opts = { modo: sim.modo, tracker: A.LS ? A.LS.get("tracker", {}) : {} };
        if (sim.modo === "un-tema") {
          opts.tema = sim.temaSlug;
          opts.bancoId = sim.bancoId;
        }
        if (sim.modo === "tier") opts.tier = sim.tier;

        var preguntas = generarFinal(kit, opts, Math.random);
        if (!preguntas.length) {
          avisar("No se pudo generar el simulacro: revise la configuración elegida.", false);
          return;
        }

        sim.preguntas = preguntas;
        sim.revelados = {};
        sim.aMano = {};
        sim.respuestas = preguntas.map(function () {
          return "";
        });
        sim.puntajes = preguntas.map(function () {
          return null;
        });
        sim.inicioAt = Date.now();
        sim.step = "examen";

        // Un unico setInterval, creado aca y solo aca (BUNDLE.md regla 4): "Revelar tema" y
        // los botones de puntaje disparan renderizarPaso(), que reconstruye la tarjeta del
        // cronometro pero REUTILIZA este mismo countdownEl/avisoEl (se reparentan con
        // appendChild, no se recrean), asi que el intervalo de abajo nunca se duplica ni se
        // reinicia por un re-render.
        limpiarTimer();
        sim.totalSeg = sim.minutos * 60 * sim.preguntas.length;
        remaining = sim.totalSeg;
        countdownEl = el(
          "span",
          { class: "df-sim-timer-num", role: "timer", "aria-live": "polite", "aria-atomic": "true" },
          [formatearTiempo(remaining)],
        );
        avisoEl = el("span", { class: "df-sim-timer-aviso" }, [textoAviso(remaining)]);
        timerId = setInterval(function () {
          remaining -= 1;
          if (countdownEl) countdownEl.textContent = formatearTiempo(Math.max(remaining, 0));
          if (avisoEl) avisoEl.textContent = textoAviso(remaining);
          if (remaining <= 0) {
            limpiarTimer();
            if (!disposed) {
              avisar("Se acabó el tiempo. Se cierra el simulacro.", true);
              terminarExamen();
            }
          }
        }, 1000);

        renderizarPaso();
      }

      function terminarExamen() {
        limpiarTimer();
        sim.duracionSeg = sim.inicioAt ? Math.round((Date.now() - sim.inicioAt) / 1000) : 0;
        sim.step = "correccion";
        renderizarPaso();
      }

      function alTerminarClic() {
        if (remaining > 0) {
          var sigue = window.confirm("Todavía queda tiempo. ¿Terminar el simulacro ahora?");
          if (!sigue) return;
        }
        terminarExamen();
      }

      function volverAConfig() {
        limpiarTimer();
        sim.step = "config";
        renderizarPaso();
      }

      function guardarResultado(aprueba) {
        // Idempotente: un segundo clic (o una segunda llamada por la razon que sea)
        // no debe agregar una segunda entrada al registro. El boton que la llama ya
        // queda disabled tras el primer guardado, pero la guarda va aca tambien.
        if (!A.LS || sim.guardado) return;
        var nowIso = new Date().toISOString();
        var registro = {
          id: "gen-" + nowIso,
          tipo: "generado",
          at: nowIso,
          consignas: sim.preguntas.map(function (p) {
            return { n: p.n, texto: p.consigna, temaSlug: p.temaSlug };
          }),
          puntajes: sim.puntajes.slice(),
          umbral: aprueba,
          respuestas: sim.respuestas.slice(),
          duracionSeg: sim.duracionSeg,
        };
        var actual = A.LS.get("simulacros", { results: [] });
        if (!actual || !Array.isArray(actual.results)) actual = { results: [] };
        actual.results.push(registro);
        A.LS.set("simulacros", actual);
        sim.guardado = true;
        avisar("Simulacro guardado en el registro.", true);
      }

      // --- paso 1: configuracion ---------------------------------------------

      function renderConfig() {
        var wrap = el("div", { class: "df-sim-config-wrap" }, [
          el("div", { class: "df-sim-encabezado" }, [
            el("h1", { class: "df-sim-titulo" }, ["Simulador de final"]),
            el("p", { class: "df-sim-subtitulo" }, [
              "Arma un final de cinco consignas a partir del banco real, con cronómetro y autocorrección.",
            ]),
          ]),
        ]);

        var form = el("div", { class: "df-sim-config" }, [el("h2", {}, ["Configurar simulacro"])]);

        form.appendChild(
          etiquetaCampo(
            "Modo",
            selectorSimple(
              MODOS_SIMULADOR.map(function (m) {
                return { value: m.id, label: m.label };
              }),
              sim.modo,
              function (v) {
                sim.modo = v;
                renderizarPaso();
              },
            ),
          ),
        );

        if (sim.modo === "tier") {
          form.appendChild(
            etiquetaCampo(
              "Tier",
              selectorSimple(
                [
                  { value: "A", label: "A" },
                  { value: "B", label: "B" },
                  { value: "C", label: "C" },
                ],
                sim.tier,
                function (v) {
                  sim.tier = v;
                },
              ),
            ),
          );
        }

        if (sim.modo === "un-tema") {
          var opcionesTema = [{ value: "", label: "Elija un tema…" }].concat(
            temasOrdenados.map(function (t) {
              return { value: t.slug, label: t.nombre };
            }),
          );
          form.appendChild(
            etiquetaCampo(
              "Tema",
              selectorSimple(opcionesTema, sim.temaSlug, function (v) {
                sim.temaSlug = v;
              }),
            ),
          );
        }

        var minutosInput = el("input", {
          class: "df-input",
          type: "number",
          min: "1",
          value: String(sim.minutos),
          onchange: function (e) {
            var v = Math.round(Number(e.target.value));
            if (v > 0) {
              sim.minutos = v;
              // "ajustes" lo escribe esta vista y lo lee "simulacros" (BUNDLE.md tabla de
              // claves de A.LS): a diferencia de la study-app -donde los minutos elegidos
              // eran efimeros, solo de esa sesion- aca se persisten para que el resto del
              // bundle vea el mismo valor.
              if (A.LS) A.LS.set("ajustes", { minutosPorPregunta: v });
            }
            e.target.value = String(sim.minutos);
          },
        }, []);
        form.appendChild(etiquetaCampo("Minutos por pregunta", minutosInput));

        form.appendChild(
          el(
            "button",
            { class: "df-btn df-btn-primary", type: "button", onclick: function () { empezarSimulacro(); } },
            ["Comenzar simulacro"],
          ),
        );

        wrap.appendChild(form);
        return wrap;
      }

      // --- paso 2: examen ------------------------------------------------------

      function renderExamen() {
        var wrap = el("div", { class: "df-sim-examen" }, [
          el("div", { class: "df-sim-encabezado" }, [
            el("h1", { class: "df-sim-titulo" }, ["Simulacro en curso"]),
            el("p", { class: "df-sim-subtitulo" }, ["Consignas de desarrollo. Umbral de aprobación: 4 de 5."]),
          ]),
        ]);

        var barra = el("div", { class: "df-sim-timer-barra" }, [
          el("span", { class: "df-sim-timer-label" }, ["Tiempo restante:"]),
        ]);
        if (countdownEl) barra.appendChild(countdownEl);
        if (avisoEl) barra.appendChild(avisoEl);
        barra.appendChild(
          el("button", { class: "df-btn df-btn-primary", type: "button", onclick: function () { alTerminarClic(); } }, ["Terminar"]),
        );
        wrap.appendChild(barra);

        sim.preguntas.forEach(function (p, idx) {
          var revelado = !!sim.revelados[idx];
          var aMano = !!sim.aMano[idx];
          var tema = temaBySlug[p.temaSlug];
          var consignaId = "df-sim-consigna-" + idx;

          var card = el("div", { class: "df-sim-pregunta" }, [
            el("h2", { class: "df-sim-pregunta-num" }, ["Pregunta " + p.n]),
          ]);
          card.appendChild(nodoMarkdown("div", "df-sim-pregunta-consigna", p.consigna || "", tema && tema.ficha, consignaId));
          if (p.generica) {
            card.appendChild(
              el("p", { class: "df-sim-aviso" }, ["Consigna genérica: no hay pregunta de final registrada para este tema."]),
            );
          }

          var temaLine = el("div", { class: "df-sim-pregunta-tema" }, []);
          if (revelado) {
            temaLine.appendChild(pastillaTier(tema && tema.tier));
            temaLine.appendChild(el("span", {}, [" " + ((tema && tema.nombre) || p.temaSlug)]));
          } else {
            temaLine.appendChild(
              el(
                "button",
                {
                  class: "df-btn df-btn-ghost",
                  type: "button",
                  onclick: function () {
                    sim.revelados[idx] = true;
                    sim.pistas += 1;
                    renderizarPaso();
                  },
                },
                ["Revelar tema"],
              ),
            );
          }
          card.appendChild(temaLine);

          var textarea = el("textarea", {
            class: "df-textarea",
            placeholder: "Escriba su respuesta…",
            "aria-labelledby": consignaId,
            hidden: aMano,
            oninput: function (e) {
              sim.respuestas[idx] = e.target.value;
            },
          }, []);
          textarea.value = sim.respuestas[idx] || "";

          // El checkbox "a mano" solo alterna la visibilidad del textarea de ESTA tarjeta,
          // sin llamar a renderizarPaso(): si reconstruyera las cinco tarjetas se perderian
          // el foco y el cursor de cualquier campo que el alumno este completando en ese
          // momento (mismo cuidado que el cronometro, aplicado aca al formulario).
          var checkbox = el("input", {
            type: "checkbox",
            checked: aMano,
            onchange: function (e) {
              sim.aMano[idx] = e.target.checked;
              textarea.hidden = e.target.checked;
            },
          }, []);
          var aManoLabel = el("label", { class: "df-sim-amano" }, [checkbox, el("span", {}, [" Respondo a mano (en papel)"])]);

          card.appendChild(aManoLabel);
          card.appendChild(textarea);
          wrap.appendChild(card);
        });

        return wrap;
      }

      // --- paso 3: correccion ---------------------------------------------------

      function selectorPuntaje(idx) {
        var opciones = [
          { v: 0, label: "0" },
          { v: 0.5, label: "½" },
          { v: 1, label: "1" },
        ];
        var wrapSel = el("div", { class: "df-sim-puntaje" }, []);
        opciones.forEach(function (op) {
          var activo = sim.puntajes[idx] === op.v;
          wrapSel.appendChild(
            el(
              "button",
              {
                class: "df-btn " + (activo ? "df-btn-primary" : "df-btn-ghost"),
                type: "button",
                "aria-pressed": activo ? "true" : "false",
                onclick: function () {
                  sim.puntajes[idx] = op.v;
                  renderizarPaso();
                },
              },
              [op.label],
            ),
          );
        });
        return wrapSel;
      }

      function renderCorreccion() {
        var wrap = el("div", { class: "df-sim-correccion" }, [
          el("div", { class: "df-sim-encabezado" }, [
            el("h1", { class: "df-sim-titulo" }, ["Corrección del simulacro"]),
            el("p", { class: "df-sim-subtitulo" }, [
              "Puntúe cada consigna 0, ½ o 1 con el esqueleto y el seguro anti-cero a la vista.",
            ]),
          ]),
        ]);

        sim.preguntas.forEach(function (p, idx) {
          var tema = temaBySlug[p.temaSlug];
          var card = el("div", { class: "df-sim-pregunta" }, [el("h2", { class: "df-sim-pregunta-num" }, ["Pregunta " + p.n])]);
          card.appendChild(nodoMarkdown("div", "df-sim-pregunta-consigna", p.consigna || "", tema && tema.ficha));

          var temaLine = el("div", { class: "df-sim-pregunta-tema" }, [
            pastillaTier(tema && tema.tier),
            el("span", {}, [" " + ((tema && tema.nombre) || p.temaSlug) + " "]),
          ]);
          if (tema && tema.ficha) {
            temaLine.appendChild(
              el("a", { class: "df-btn df-btn-ghost", href: "#/p/" + encodeURIComponent(tema.ficha), "data-go": tema.ficha }, ["Ver ficha"]),
            );
          }
          card.appendChild(temaLine);

          if (sim.aMano[idx]) {
            card.appendChild(el("p", { class: "df-sim-nota-mano" }, ["Respuesta escrita en papel (no registrada)."]));
          } else if (sim.respuestas[idx]) {
            card.appendChild(
              el("div", { class: "df-sim-respuesta" }, [
                el("div", { class: "df-sim-respuesta-label" }, ["Su respuesta:"]),
                el("div", { class: "df-sim-respuesta-texto" }, [sim.respuestas[idx]]),
              ]),
            );
          }

          if (tema) {
            card.appendChild(bloqueColapsable("Esqueleto memorizable", el("pre", { class: "df-sim-esqueleto" }, [tema.esqueleto || ""])));
            card.appendChild(
              bloqueColapsable("Seguro anti-cero", nodoMarkdown("div", "df-sim-markdown", tema.seguro || "", tema.ficha)),
            );
            card.appendChild(bloqueColapsable("Números de oro", tablaNumerosOro(tema.numerosOro, tema.ficha)));
            if (tema.trampasMd) {
              card.appendChild(
                bloqueColapsable("Trampas y confundibles", nodoMarkdown("div", "df-sim-markdown", tema.trampasMd, tema.ficha)),
              );
            }
          } else {
            card.appendChild(el("p", { class: "df-sim-sin-ficha" }, ["Sin ficha de tema para autocorregir."]));
          }

          card.appendChild(el("div", { class: "df-sim-puntaje-label" }, ["Autocorrección:"]));
          card.appendChild(selectorPuntaje(idx));

          wrap.appendChild(card);
        });

        var total = sim.puntajes.reduce(function (acc, p) {
          return acc + (typeof p === "number" ? p : 0);
        }, 0);
        var aprueba = umbral(sim.puntajes);
        var resumen = el("div", { class: "df-sim-resumen" }, [
          el("h2", {}, ["Resumen"]),
          el("p", { class: "df-sim-resumen-total" }, ["Total: " + total + " de " + sim.puntajes.length]),
        ]);
        if (sim.puntajes.length >= 5) {
          resumen.appendChild(
            el("span", { class: "df-badge " + (aprueba ? "df-badge-ok" : "df-badge-bad") }, [
              aprueba ? "Aprueba (4 de 5)" : "No aprueba (4 de 5)",
            ]),
          );
        }
        resumen.appendChild(el("p", { class: "df-sim-muted" }, ["Autoevaluación contra la ficha: la cátedra corrige distinto."]));
        resumen.appendChild(el("p", { class: "df-sim-muted" }, ["Pistas usadas: " + sim.pistas]));

        var acciones = el("div", { class: "df-sim-resumen-acciones" }, []);
        acciones.appendChild(
          el(
            "button",
            {
              class: "df-btn df-btn-primary",
              type: "button",
              disabled: sim.guardado,
              onclick: function () {
                guardarResultado(aprueba);
                renderizarPaso();
              },
            },
            [sim.guardado ? "Guardado" : "Guardar en el registro"],
          ),
        );
        acciones.appendChild(
          el("button", { class: "df-btn df-btn-ghost", type: "button", onclick: function () { volverAConfig(); } }, ["Otro simulacro"]),
        );
        resumen.appendChild(acciones);

        wrap.appendChild(resumen);
        return wrap;
      }

      function renderizarPaso() {
        actualizarTabs();
        cuerpoEl.replaceChildren();
        var nodo;
        if (sim.step === "config") nodo = renderConfig();
        else if (sim.step === "examen") nodo = renderExamen();
        else nodo = renderCorreccion();
        cuerpoEl.appendChild(nodo);
      }

      // El paso 1 SIEMPRE se muestra primero, incluso llegando con "tier:X" o "tema:slug"
      // preseleccionados: asi los minutos por pregunta quedan editables antes de arrancar
      // (mismo criterio documentado en la study-app). El alumno confirma con "Comenzar
      // simulacro".
      renderizarPaso();
    }

    if (st.seccion === "banco") {
      montarBanco();
    } else {
      montarSimulador();
    }

    return function cleanup() {
      disposed = true;
      limpiarTimer();
      if (typeof A.setRedraw === "function") A.setRedraw(null);
    };
  });
})();
