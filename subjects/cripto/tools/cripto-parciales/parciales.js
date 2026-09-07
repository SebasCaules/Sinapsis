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

   CADA GRUPO ES UN BLOQUE. Los diecinueve ejercicios vienen de familias muy
   distintas, así que el grupo no puede ser una versalita más: lleva una
   cabecera propia —rótulo, contador y una línea que dice qué es esa familia o
   de qué parcial se trata—, sobre `--surface-2` y con un filete de 2 px en el
   color del grupo. El color sale de `--ucol` puesto en el `style` de la
   sección, que es el canal por el que la plataforma deriva `--uink` (la misma
   convención que usan las unidades). Y el aire entre grupos duplica al aire
   entre ejercicios del mismo grupo: la separación se ve antes de leer.

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

  /**
   * Qué es cada familia de ejercicios, en una línea. Es lo que convierte el
   * rótulo del grupo en información: no alcanza con decir «Analizar un
   * protocolo», hay que decir que ése es el Ejercicio 1 de los cuatro parciales.
   */
  var DESCRIPCION_TIPO = {
    "Analizar un protocolo":
      "El Ejercicio 1 de los cuatro parciales, sin excepción: qué construye el protocolo y qué problema tiene.",
    "¿Es válido este esquema de bloque?":
      "Un esquema de cifrado en bloque inventado: si es válido, si es CPA-seguro y cómo propaga errores contra CBC, CTR y OFB.",
    "Verdadero o Falso, con corrección":
      "El último ejercicio: no alcanza con marcar falso, hay que reescribir la sentencia e identificar el cambio.",
    "Secreto perfecto, demostrado":
      "Demostrar si el criptosistema tiene secreto perfecto y bajo qué condiciones sobre los parámetros.",
    "Criptoanálisis clásico":
      "Romper un cifrado clásico a mano, con la tabla de frecuencias del castellano a la vista.",
    "MAC, hash e integridad":
      "Un esquema armado con hash o MAC: si da integridad, si da autenticación y si da no repudio.",
  };

  var CUATRIMESTRE = { "1": "primer cuatrimestre", "2": "segundo cuatrimestre" };

  /**
   * Los colores de división de la plataforma, en el orden en que se reparten
   * entre los grupos. Nunca un literal: sólo el nombre del token, que se
   * publica como `--ucol` en el `style` de la sección.
   */
  var COLORES = [
    "var(--u1)", "var(--u2)", "var(--u3)", "var(--u4)", "var(--u5)",
    "var(--u6)", "var(--u7)", "var(--u8)", "var(--u9)",
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
    /* Las tablas de los enunciados —los pasos de un protocolo, la tabla de
       frecuencias— no tienen fila de encabezado en el examen, pero markdown
       obliga a escribir una. Si queda vacía se saca, para que no aparezca una
       banda en blanco arriba de la tabla. */
    doc.body.querySelectorAll("table > thead").forEach(function (cabecera) {
      var celdas = cabecera.querySelectorAll("th, td");
      var vacia = Array.prototype.every.call(celdas, function (c) {
        return !(c.textContent || "").trim();
      });
      if (vacia) cabecera.remove();
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

  /** `2C-2025` → `2C25`: el rótulo corto con el que se identifica un parcial. */
  function examenCorto(examen) {
    var m = /^(\d)C-(\d{2})(\d{2})$/.exec(String(examen || ""));
    return m ? m[1] + "C" + m[3] : String(examen || "");
  }

  /**
   * El rótulo del ejercicio. Agrupado por tipo, los ejercicios de cuatro
   * parciales distintos quedan mezclados, así que el número lleva el parcial
   * adelante —`2C25 - Ejercicio 3`— y se sabe de cuál es sin buscar. Agrupado
   * por parcial eso ya lo dice el encabezado del grupo.
   */
  function rotuloDe(e, orden) {
    var base = "Ejercicio " + numeroDe(e) + ".";
    return orden === "parcial" ? base : examenCorto(e.examen) + " - " + base;
  }

  function ejercicioNodo(e, orden) {
    var art = el("article", "pv-ejercicio");
    art.id = "ej-" + e.id;

    var h = el("h3", "pv-titulo");
    h.appendChild(el("span", "pv-numero", rotuloDe(e, orden)));
    if (e.titulo) h.appendChild(el("span", "pv-nombre", e.titulo));
    /* Agrupado por tipo el parcial ya va en el rótulo; a la derecha sobra. */
    if (orden === "parcial") h.appendChild(el("span", "pv-contexto", e.tipo));
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

  /** `2C-2025` + `1P` → «Primer parcial, segundo cuatrimestre de 2025». */
  function descripcionExamen(examen, instancia) {
    var etiqueta = "";
    INSTANCIAS.forEach(function (i) { if (i.id === instancia) etiqueta = i.label; });
    var m = String(examen || "").match(/^(\d)C-(\d{4})$/);
    if (!m) return etiqueta;
    var fecha = (CUATRIMESTRE[m[1]] || "") + " de " + m[2];
    return etiqueta ? etiqueta + ", " + fecha : fecha.charAt(0).toUpperCase() + fecha.slice(1);
  }

  /** La línea que explica el grupo: qué familia es, o de qué parcial se trata. */
  function descripcionGrupo(g, orden) {
    if (orden !== "parcial") return DESCRIPCION_TIPO[g.clave] || "";
    var primero = g.items[0];
    return descripcionExamen(g.clave, primero ? primero.instancia : "");
  }

  /**
   * El grupo, como bloque: cabecera con rótulo, contador y línea descriptiva,
   * y el cuerpo con sus ejercicios. El color va en `--ucol` para que el filete
   * y el contador lo tomen desde el CSS sin literales.
   */
  function grupoNodo(g, orden, indice) {
    var sec = el("section", "pv-grupo");
    sec.style.setProperty("--ucol", COLORES[indice % COLORES.length]);

    var cab = el("header", "pv-grupo-head");
    var linea = el("div", "pv-grupo-linea");
    linea.appendChild(el("h2", "pv-grupo-t", g.clave));
    var n = g.items.length;
    linea.appendChild(el("span", "pv-grupo-n", n + (n === 1 ? " ejercicio" : " ejercicios")));
    cab.appendChild(linea);
    var sub = descripcionGrupo(g, orden);
    if (sub) cab.appendChild(el("p", "pv-grupo-sub", sub));
    sec.appendChild(cab);

    var cuerpo = el("div", "pv-grupo-cuerpo");
    g.items.forEach(function (e) { cuerpo.appendChild(ejercicioNodo(e, orden)); });
    sec.appendChild(cuerpo);
    return sec;
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
      /* Tooltip de la plataforma (data-tip-*), no el nativo del navegador. */
      a.setAttribute("data-tip-title", t.label);
      a.setAttribute("data-tip-text", t.id === "parcial"
        ? "Agrupa los ejercicios por el parcial del que salieron, del más reciente al más viejo."
        : "Agrupa los ejercicios por familia (protocolos, modos, secreto perfecto…), sin importar el parcial.");
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
        muerto.setAttribute("tabindex", "0");
        muerto.setAttribute("data-tip-title", i.label);
        muerto.setAttribute("data-tip-text", "Todavía no hay ejercicios de esta instancia en el vault.");
        chips.appendChild(muerto);
        return;
      }
      var activo = st.inst === i.id;
      var cuantos = ITEMS.filter(function (e) { return e.instancia === i.id; }).length;
      var chip = enlace("pv-chip" + (activo ? " is-on" : ""), href(st, { inst: activo ? "" : i.id }), i.label);
      chip.setAttribute("data-tip-title", i.label);
      chip.setAttribute("data-tip-text", cuantos + (cuantos === 1 ? " ejercicio" : " ejercicios") + (activo ? " · clic para quitar el filtro" : " · clic para ver solo esta instancia"));
      chips.appendChild(chip);
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
    grupos.forEach(function (g, i) {
      raiz.appendChild(grupoNodo(g, st.orden, i));
    });

    main.replaceChildren(raiz);
    if (A.enhanceDoc) A.enhanceDoc(main);
  });
})();
