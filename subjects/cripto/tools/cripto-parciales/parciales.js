/* ============================================================
   parciales.js — vista «Parciales resueltos».

   Los ejercicios de los parciales que circulan, presentados como un documento:
   «Ejercicio 1.» con su enunciado, y la resolución debajo, plegada. Se puede
   intentar el ejercicio antes de ver la respuesta, que es para lo que sirve un
   parcial viejo.

   DATOS: window.CRIPTO_PARCIALES (data/parciales-data.js), generado desde
   wiki/catedra/parciales-viejos.md. Enunciado y resolución son markdown con
   matemática en $…$ y wikilinks; los compone A.renderMarkdown, que es el mismo
   renderizador del lector.

   POR QUÉ NO SE ARMA HTML A MANO. Todo el marcado de esta vista se construye
   con `document.createElement` y `textContent`: no hay una sola cadena de HTML
   concatenada, así que no hay forma de que un dato termine interpretado como
   marcado. Lo único que llega como HTML es lo que devuelve `A.renderMarkdown`,
   y entra por `fragmento()`, que lo parsea aparte y le saca cualquier `script`
   o atributo `on*` antes de adjuntarlo.

   DOS ORDENAMIENTOS
     por tipo     (default)  agrupa por el tema que la cátedra repite
     por parcial             agrupa por examen, del más nuevo al más viejo

   FILTRO POR INSTANCIA: 1P · 2P · Final. Hoy el vault solo tiene primeros
   parciales; las otras dos quedan a la vista, en gris, para que se note que
   faltan y no que no existen.

   RUTAS
     #/parciales · ?orden=parcial · ?inst=1P · ?q=texto
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || !A.registerView) return;

  var ITEMS = (window.CRIPTO_PARCIALES || []).slice();

  /** Las tres instancias evaluatorias de la materia, en orden. */
  var INSTANCIAS = [
    { id: "1P", label: "Primer parcial" },
    { id: "2P", label: "Segundo parcial" },
    { id: "final", label: "Final" },
  ];

  /* ---------- construcción del DOM ---------- */

  function el(tag, clase, texto) {
    var nodo = document.createElement(tag);
    if (clase) nodo.className = clase;
    if (texto !== undefined && texto !== null) nodo.textContent = String(texto);
    return nodo;
  }

  function enlace(clase, url, texto) {
    var a = el("a", clase, texto);
    a.setAttribute("href", url);
    a.setAttribute("data-nav", "");
    return a;
  }

  /**
   * El markdown ya compuesto, como nodos. Se parsea en un documento aparte
   * —donde nada se ejecuta ni se carga— y se poda antes de adjuntarlo.
   */
  function fragmento(markdown) {
    var html = A.renderMarkdown ? A.renderMarkdown(markdown || "", "parciales-viejos") : "";
    var doc = new DOMParser().parseFromString("<body>" + html + "</body>", "text/html");
    doc.body.querySelectorAll("script, style, iframe, object, embed").forEach(function (n) {
      n.remove();
    });
    doc.body.querySelectorAll("*").forEach(function (n) {
      Array.prototype.slice.call(n.attributes).forEach(function (at) {
        var nombre = at.name.toLowerCase();
        var valor = String(at.value || "").trim().toLowerCase();
        if (nombre.indexOf("on") === 0) n.removeAttribute(at.name);
        else if ((nombre === "href" || nombre === "src") && valor.indexOf("javascript:") === 0) {
          n.removeAttribute(at.name);
        }
      });
    });
    var frag = document.createDocumentFragment();
    while (doc.body.firstChild) frag.appendChild(doc.body.firstChild);
    return frag;
  }

  /* ---------- lectura de la ruta ---------- */

  /**
   * El estado sale del `arg` que pasa el anfitrión y, si viene vacío, de la
   * query de la URL: `App.go("#/parciales?orden=parcial")` deja los parámetros
   * en `location.search`, no en `arg`.
   */
  function estado(arg) {
    var crudo = String(arg || "");
    if (!crudo && typeof location !== "undefined") {
      crudo = String(location.search || "").replace(/^\?/, "");
      // `?arg=…` es la forma que arma el anfitrión con una ruta `#/vista/valor`.
      var m = /(?:^|&)arg=([^&]*)/.exec(crudo);
      if (m) crudo = decodeURIComponent(m[1] || "");
    }
    var q = {};
    crudo
      .replace(/^\?/, "")
      .split("&")
      .forEach(function (par) {
        if (!par) return;
        var i = par.indexOf("=");
        var k = i < 0 ? par : par.slice(0, i);
        q[decodeURIComponent(k)] = i < 0 ? "" : decodeURIComponent(par.slice(i + 1));
      });
    return {
      orden: q.orden === "parcial" ? "parcial" : "tipo",
      inst: INSTANCIAS.some(function (i) { return i.id === q.inst; }) ? q.inst : "",
      q: (q.q || "").trim(),
    };
  }

  function href(st, cambio) {
    var s = { orden: st.orden, inst: st.inst, q: st.q };
    Object.keys(cambio || {}).forEach(function (k) { s[k] = cambio[k]; });
    var partes = [];
    if (s.orden === "parcial") partes.push("orden=parcial");
    if (s.inst) partes.push("inst=" + encodeURIComponent(s.inst));
    if (s.q) partes.push("q=" + encodeURIComponent(s.q));
    return "#/parciales" + (partes.length ? "?" + partes.join("&") : "");
  }

  /* ---------- filtrado y agrupado ---------- */

  function filtrar(st) {
    var texto = st.q.toLowerCase();
    return ITEMS.filter(function (e) {
      if (st.inst && e.instancia !== st.inst) return false;
      if (!texto) return true;
      return (e.titulo + " " + e.tipo + " " + e.examen + " " + e.enunciado)
        .toLowerCase()
        .indexOf(texto) >= 0;
    });
  }

  /** Grupos en el orden pedido: por tipo (alfabético) o por parcial (del más nuevo). */
  function agrupar(lista, orden) {
    var mapa = {};
    lista.forEach(function (e) {
      var k = orden === "parcial" ? e.examen : e.tipo;
      (mapa[k] = mapa[k] || []).push(e);
    });
    var claves = Object.keys(mapa);
    if (orden === "parcial") claves.sort(function (a, b) { return a < b ? 1 : a > b ? -1 : 0; });
    else claves.sort(function (a, b) { return a.localeCompare(b, "es"); });
    return claves.map(function (k) {
      var items = mapa[k].slice().sort(function (a, b) {
        if (orden === "parcial") return a.n - b.n;
        return a.examen < b.examen ? 1 : a.examen > b.examen ? -1 : a.n - b.n;
      });
      return { clave: k, items: items };
    });
  }

  /* ---------- dibujo ---------- */

  function numeroDe(e) {
    return e.numeros && e.numeros.length > 1 ? e.numeros.join(" y ") : String(e.n);
  }

  function ejercicioNodo(e, orden) {
    var art = el("article", "pv-ejercicio");
    art.id = "ej-" + e.id;

    var h = el("h3", "pv-titulo");
    h.appendChild(el("span", "pv-numero", "Ejercicio " + numeroDe(e) + "."));
    if (e.titulo) h.appendChild(el("span", "pv-nombre", e.titulo));
    h.appendChild(el("span", "pv-contexto", orden === "parcial" ? e.tipo : e.examen));
    art.appendChild(h);

    var enunciado = el("div", "pv-enunciado");
    enunciado.appendChild(fragmento(e.enunciado));
    art.appendChild(enunciado);

    if (e.resolucion) {
      var det = el("details", "pv-solucion");
      det.appendChild(el("summary", null, "Resolución"));
      var cuerpo = el("div", "pv-solucion-cuerpo");
      cuerpo.appendChild(fragmento(e.resolucion));
      det.appendChild(cuerpo);
      art.appendChild(det);
    } else {
      art.appendChild(el("p", "pv-sin-solucion", "Sin resolución en el vault."));
    }
    return art;
  }

  function controlesNodo(st, total, mostrados) {
    var caja = el("div", "pv-controles");

    var tabs = el("div", "pv-tabs");
    tabs.setAttribute("role", "group");
    tabs.setAttribute("aria-label", "Cómo se ordenan");
    [
      { id: "tipo", label: "Por tipo" },
      { id: "parcial", label: "Por parcial" },
    ].forEach(function (t) {
      var activo = st.orden === t.id;
      var a = enlace("pv-tab" + (activo ? " is-on" : ""), href(st, { orden: t.id }), t.label);
      if (activo) a.setAttribute("aria-current", "true");
      tabs.appendChild(a);
    });
    caja.appendChild(tabs);

    var chips = el("div", "pv-chips");
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "Instancia");
    INSTANCIAS.forEach(function (i) {
      var hay = ITEMS.some(function (e) { return e.instancia === i.id; });
      if (!hay) {
        var muerto = el("span", "pv-chip is-off", i.label);
        muerto.title = "Todavía no hay ejercicios de esta instancia en el vault";
        chips.appendChild(muerto);
        return;
      }
      var activo = st.inst === i.id;
      chips.appendChild(
        enlace("pv-chip" + (activo ? " is-on" : ""), href(st, { inst: activo ? "" : i.id }), i.label),
      );
    });
    caja.appendChild(chips);

    caja.appendChild(
      el("div", "pv-cuenta", mostrados === total ? total + " ejercicios" : mostrados + " de " + total),
    );
    return caja;
  }

  A.registerView("parciales", function (main, arg) {
    var st = estado(arg);
    if (A.setCrumbs) {
      A.setCrumbs([{ label: "Inicio", hash: "#/inicio" }, { label: "Parciales resueltos" }]);
    }

    var lista = filtrar(st);
    var grupos = agrupar(lista, st.orden);

    var raiz = el("div", "pv");

    var head = el("header", "pv-head");
    head.appendChild(el("p", "eyebrow", "Evaluación"));
    head.appendChild(el("h1", null, "Parciales resueltos"));
    head.appendChild(
      el(
        "p",
        "pv-bajada",
        "Los ejercicios de los parciales que circulan, con su resolución verificada contra el wiki. " +
          "El enunciado primero; la resolución se abre a pedido.",
      ),
    );
    raiz.appendChild(head);
    raiz.appendChild(controlesNodo(st, ITEMS.length, lista.length));

    if (!grupos.length) {
      var vacio = el("p", "pv-vacio", "Ningún ejercicio coincide con el filtro.");
      raiz.appendChild(vacio);
    }
    grupos.forEach(function (g) {
      var sec = el("section", "pv-grupo");
      var t = el("h2", "pv-grupo-t", g.clave);
      t.appendChild(el("span", "pv-grupo-n", String(g.items.length)));
      sec.appendChild(t);
      g.items.forEach(function (e) { sec.appendChild(ejercicioNodo(e, st.orden)); });
      raiz.appendChild(sec);
    });

    main.replaceChildren(raiz);
    if (A.enhanceDoc) A.enhanceDoc(main);
  });
})();
