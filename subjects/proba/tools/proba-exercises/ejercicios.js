/* ============================================================
   ejercicios.js — vista "Ejercicios": el corpus resuelto de la materia
   (guía de TP, propuestos de Lutzio y evaluaciones) presentado como
   documento continuo, con estado de resolución por ejercicio.

   Datos: window.EJERCICIOS (estudio/ejercicios-data.js, generado por
   build-ejercicios.py desde archivos LOCALES del proyecto: contenido de
   confianza, no entrada de usuario). El enunciado y la resolución son HTML
   con matemática cruda en $…$; se insertan con A.renderMathHtml(html) — que
   resuelve la math ANTES de que el HTML entre al documento, para que los '<'
   que viven dentro de la math no rompan el árbol — y después se pasa
   A.enhanceDoc por las tablas. Dos arreglos sobre los datos, aquí y no en la
   vista de cada campo: joinInlineMath() une las líneas dentro de un par $…$
   (el regex inline de core.js no cruza saltos) y texify() delimita el TeX que
   algunas notas de los anexos traen suelto.

   COLECCIONES (cuatro por unidad, en este orden y solo las que tienen ítems)
     guia       Ejercicios de la guía
     lutzio     Propuestos de Lutzio
     parciales  Ejercicios de parciales   (parcial, parcialito, recuperatorio)
     finales    Ejercicios de finales
   Los datos traen una sola colección 'examen' para las evaluaciones; el grupo
   sale de item.grupo y, si el campo no está, de derivar el nombre del examen
   (/final/i → finales, si no parciales). La misma derivación vive en los tres
   módulos que leen el corpus.

   RUTAS
     #/ejercicios                → índice: una tarjeta por unidad
     #/ejercicios/<u>            → corrige el hash a la primera colección
     #/ejercicios/<u>/<col>      → unidad + colección (documento continuo)
     El hash siempre nombra la colección que se muestra: la ruta sin colección y
     la colección que la unidad no tiene se corrigen con A.go replace, y la ruta
     vieja '#/ejercicios/<u>/examen' termina en la colección del ejercicio
     pedido con ?ej=, y si no en /parciales.
     query: ?estado=0|1|2|3  filtra por estado · ?q=…  busca por texto
            ?ej=<id>         deja ese ejercicio a la vista (ancla #ej-<id>);
                             al volver con Atrás manda el scroll memorizado

   BARRA DE UNIDAD: si reader.js expone A.unitStripHtml / A.wireUnitStrip, la
   vista de colección abre con la misma barra que el lector, con la clave
   virtual 'ej:<coleccion>' como posición actual. Si no los expone, no se
   dibuja nada (la vista no depende de reader.js para funcionar).

   ASPECTO: documento continuo con la piel LaTeX compartida (latex.css). La
   lista entera es un .tex-doc, la cabecera un \maketitle (.tex-title) y cada
   ejercicio un <article> sin tarjeta, separado del anterior por un filete
   doble. El artículo NO lleva título ni línea de metadatos: abre con el
   enunciado, cuyo primer párrafo empieza con el run-in «Ejercicio N.». Título y
   metadatos siguen vivos en aria-label / data-titulo del artículo, y la
   búsqueda ?q= los sigue encontrando porque lee los datos, no el DOM.
   Los incisos que la fuente trae en corrido («… (a) … (b) …») pasan a renglones
   propios con partirIncisos(): cada uno en un <span class="ej-inciso">.

   RENDER: el enunciado se arma EAGER dentro del HTML del artículo (medido: 7 ms
   en la colección más larga). La resolución sigue siendo perezosa —se llena en
   el primer evento 'toggle' del <details>, nunca antes, porque KaTeX mide mal
   dentro de un contenedor oculto— y arrastra consigo la caja de respuesta y los
   anexos de Lutzio, de modo que hay un solo desplegable por ejercicio.
   Imprimir tiene su propio botón porque el navegador no espera promesas: arma
   el documento entero, espera a los diagramas y solo entonces llama a print().

   ESTADO PERSISTENTE
     pe.exEstado = { v:1, m: { "<id>": { e:1|2|3, t:"YYYY-MM-DD" } } }
       1 resuelto solo · 2 con poca ayuda · 3 con mucha ayuda
       0 (sin resolver) es la ausencia de la clave: no se guardan ceros.
     pe.exUltimo = { u, col, id }   última posición, para "seguir donde estaba"
     pe.exReso   = 'open' | 'closed'   preferencia GLOBAL del interruptor
       "Mostrar las resoluciones" (abre o cierra toda la colección).
     pe.exPractica = 'on' | 'off'   preferencia GLOBAL del interruptor
       "Ocultar respuestas" (por omisión 'off'). Con el modo activo, cada
       ejercicio tapa su caja «Respuesta» y los bloques de resultado embebidos
       en la resolución hasta que se le marca un estado del semáforo distinto
       de "Sin resolver"; entonces queda revelado para el resto de la sesión,
       aunque después se cambie ese estado. Convive con "Mostrar las
       resoluciones": el desarrollo se puede leer sin ver el resultado. La
       impresión ignora el modo y sale completa.

   SEMÁFORO: los cuatro botones del encabezado se pintan de peor a mejor
   (0 sin resolver → 3 mucha ayuda → 2 poca ayuda → 1 solo). Es únicamente el
   orden de pintado: los códigos guardados y la forma de pe.exEstado no cambian,
   porque reader.js los lee.

   NÚMERO DE EJERCICIO: manda 'numeroGuia' cuando el dato lo trae (TP5 y TP7,
   cuyos PDF de resolución renumeran respecto de la guía). Es el número que se
   muestra, el que ordena la colección y el que busca "n25".

   CONTRATO QUE EXPONE (lo usa study.js para el simulador de parcial)
     App.pintarEjercicio(host, html, item)  → Promise   pinta un .ej-doc
     App.ejercicioHref(item | id)           → hash de la ficha del ejercicio
     App.ejPartirIncisos(html)              → html con los incisos en renglones
       propios (<span class="ej-inciso">). Función PURA, expuesta para poder
       probarla desde fuera del navegador (.claude/workforce-cambios/tools/
       incisos.test.mjs); nadie más la usa todavía.

   IIFE sin dependencias externas; mermaid se carga perezosamente desde
   vendor/ solo cuando se abre una resolución con diagrama, y se vuelve a
   dibujar al cambiar de tema (el svg trae los colores incrustados).
   ============================================================ */
(function () {
  "use strict";
  var A = window.App;
  if (!A) return;

  var $ = A.$, $$ = A.$$;
  var esc = A.escapeHtml, icon = A.icon, rich = A.rich;

  // [bundle] id del bundle y nombre del archivo de mermaid: los usa la carga
  // perezosa de los diagramas (ver `loadMermaid`).
  var BUNDLE_ID = "proba-exercises";
  var MERMAID_FILE = "vendor/mermaid.min.js.txt";

  var DATA = window.EJERCICIOS || {};
  var ITEMS = DATA.items || [];

  var BY_ID = {}; ITEMS.forEach(function (it) { BY_ID[it.id] = it; });

  // ---------------- las cuatro colecciones ----------------
  // El orden de este arreglo es el orden de las pestañas y de los conteos del
  // índice. Los nombres son los de la vista: los de window.EJERCICIOS.colecciones
  // describen el origen de los datos ('Evaluaciones', una sola bolsa), no lo que
  // se lee en pantalla.
  var COL_DEF = [
    { id: "guia", nombre: "Ejercicios de la guía", corto: "Guía" },
    { id: "lutzio", nombre: "Propuestos de Lutzio", corto: "Lutzio" },
    { id: "parciales", nombre: "Ejercicios de parciales", corto: "Parciales" },
    { id: "finales", nombre: "Ejercicios de finales", corto: "Finales" }
  ];
  var COL_BY_ID = {}; COL_DEF.forEach(function (c) { COL_BY_ID[c.id] = c; });
  var COL_EXAMEN = { parciales: 1, finales: 1 };   // colecciones agrupadas por examen

  // Derivación compartida con los otros módulos que leen el corpus: 'grupo' si
  // el dato lo trae, y si no el nombre del examen ('parciales' cubre parcial,
  // parcialito y recuperatorio).
  function grupoDe(it) {
    if (it.grupo && COL_BY_ID[it.grupo]) return it.grupo;
    return /final/i.test(it.examen || "") ? "finales" : "parciales";
  }
  function colDe(it) { return it.coleccion === "examen" ? grupoDe(it) : it.coleccion; }

  // ---------------- índices por unidad y colección ----------------
  var BUCKET = {};          // "u|col" → [items]
  var BY_UNIT = {};         // u → [items]
  ITEMS.forEach(function (it) {
    var k = it.unidad + "|" + colDe(it);
    (BUCKET[k] = BUCKET[k] || []).push(it);
    (BY_UNIT[it.unidad] = BY_UNIT[it.unidad] || []).push(it);
  });
  // Número que se lee en pantalla. Los PDF de resolución de TP5 y TP7 renumeran
  // sus ejercicios ("Ejercicio 24 (= Ej. 25 de la guía)"): 'numero' es el del
  // PDF y 'numeroGuia' el de la guía, que es el único con el que se busca el
  // enunciado. Los propuestos de la misma lista ya vienen numerados como la
  // guía, así que la colección entera queda con una sola numeración.
  function numDe(it) { return (it && it.numeroGuia != null) ? it.numeroGuia : ((it && it.numero) || 0); }
  function renumerado(it) { return !!it && it.numeroGuia != null && it.numeroGuia !== it.numero; }

  // orden de lectura dentro de una colección: por número de guía, con el id como
  // desempate estable (en 'guia' se intercalan los oficiales y los propuestos)
  Object.keys(BUCKET).forEach(function (k) {
    BUCKET[k].sort(function (a, b) {
      if (numDe(a) !== numDe(b)) return numDe(a) - numDe(b);
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
  });
  // unidades con ejercicios, en el orden del programa
  var UNIT_KEYS = Object.keys(BY_UNIT).sort(function (a, b) {
    var oa = A.unitOrder[a] != null ? A.unitOrder[a] : 99;
    var ob = A.unitOrder[b] != null ? A.unitOrder[b] : 99;
    return oa - ob;
  });
  function itemsOf(u, col) { return BUCKET[u + "|" + col] || []; }
  // una colección solo existe para una unidad si tiene al menos un ejercicio ahí
  function colsOf(u) { return COL_DEF.filter(function (c) { return itemsOf(u, c.id).length; }); }

  // ---------------- estado por ejercicio ----------------
  var LS_ESTADO = "pe.exEstado", LS_ULTIMO = "pe.exUltimo";
  var EST_LABEL = ["Sin resolver", "Resuelto solo", "Con poca ayuda", "Con mucha ayuda"];
  // Rótulos cortos del filtro, que hace de leyenda del semáforo. «Solo» a secas
  // se leía como «únicamente»; «Sin ayuda» nombra el estado sin ambigüedad.
  var EST_CORTO = ["Sin resolver", "Sin ayuda", "Poca ayuda", "Mucha ayuda"];
  // Orden VISUAL, de peor a mejor: gris → rojo → ámbar → verde. Lo comparten el
  // semáforo, el filtro por estado y los segmentos de la barra de progreso, para
  // que no convivan dos escalas opuestas en la misma pantalla. Los CÓDIGOS
  // guardados siguen siendo 0/1/2/3: esto solo cambia el orden de pintado.
  var EST_ORDEN = [0, 3, 2, 1];
  // Preferencia global del interruptor "Mostrar las resoluciones".
  var LS_RESO = "pe.exReso";
  function resoPref() { return A.LS.get(LS_RESO, "closed") === "open" ? "open" : "closed"; }
  // Preferencia global del interruptor "Ocultar respuestas" (modo práctica).
  var LS_PRACTICA = "pe.exPractica";
  function practicaPref() { return A.LS.get(LS_PRACTICA, "off") === "on" ? "on" : "off"; }

  // Ojo tachado del modo "Ocultar respuestas". A.icon no tiene este glifo, y el
  // estado no puede quedar librado al color: el trazo cruzado distingue por
  // FORMA el modo activo del inactivo, además del rótulo y de aria-pressed.
  function ojoTachado(size) {
    var sz = size || 14;
    return '<svg class="ej-ojo" viewBox="0 0 24 24" width="' + sz + '" height="' + sz + '"' +
      ' fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"' +
      ' stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M3.2 3.2 20.8 20.8"/>' +
      '<path d="M10.6 6.2A9.8 9.8 0 0 1 12 6.1c6 0 10 5.9 10 5.9a17.4 17.4 0 0 1-3.3 3.8"/>' +
      '<path d="M6.6 8.2A17.4 17.4 0 0 0 2 12s4 5.9 10 5.9c1.3 0 2.5-.2 3.6-.7"/>' +
      '<path d="M9.9 10.1a3 3 0 0 0 4.1 4.2"/></svg>';
  }
  // Rótulo del interruptor de modo práctica. En la barra de herramientas el
  // botón es solo icono, así que el rótulo viaja en title y aria-label: cambia
  // con el estado, para que el modo se lea sin depender del color de fondo.
  function practicaLabel(on) {
    return on ? "Respuestas ocultas · pulse para mostrarlas" : "Ocultar respuestas";
  }

  // Chevrón del interruptor "Mostrar las resoluciones": hacia abajo cuando
  // están plegadas (pulsar abre) y hacia arriba cuando están abiertas. El
  // estado se lee por la FORMA, no solo por el fondo del botón.
  function chevIcon(dir) {
    return '<svg class="ej-ic ej-ic-' + dir + '" viewBox="0 0 24 24" width="15" height="15"' +
      ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
      ' stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' +
      (dir === "on" ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6") + '"/></svg>';
  }

  // Marcador de «Respuesta oculta» del modo práctica. Se dibuja DOS veces por
  // ejercicio y la hoja de estilo muestra una sola según el estado de la
  // resolución: con la resolución plegada, el de «fuera», bajo el enunciado (que
  // es lo único visible); con la resolución abierta, el de «dentro», en el
  // hueco exacto que deja la caja «Respuesta», para que se lea dónde va a
  // aparecer. Los dos revelan igual: el delegado de clic escucha [data-ej-ver].
  function marcadorOculta(donde) {
    return '<button type="button" class="ej-oculta ej-oculta-' + donde + '" data-ej-ver>' +
      ojoTachado(14) +
      "<span>Respuesta oculta · marque cómo lo resolvió para verla</span></button>";
  }

  // Glifos del semáforo. A.icon solo emite trazos sin relleno (core.js), así que
  // los cuatro círculos van escritos inline: el estado se lee por relleno, por
  // color y por glifo, para que no dependa del color solo.
  //
  // El elegido es el círculo LLENO y los demás quedan como anillo, todos a color
  // pleno. Antes los no elegidos se atenuaban con opacidad .35, lo que dejaba el
  // contraste en ~1,5:1 (por debajo del 3:1 que pide WCAG 1.4.11) y borraba los
  // glifos: el estado dejaba de leerse sin color.
  var SEM_GLIFO = [
    '<path d="M8 12h8" stroke-width="1.9"/>',
    '<path d="M7.5 12.4l2.9 3.1L16.7 8.3" stroke-width="2.7"/>',
    '<path d="M7.5 12.4l2.9 3.1L16.7 8.3" stroke-width="1.5"/>',
    '<path d="M9.5 9.7a2.5 2.5 0 1 1 3.4 2.4c-.8.4-1 .8-1 1.7M12 16.7h.01" stroke-width="1.9"/>'
  ];
  // El relleno lo decide la hoja de estilo (`.on` → círculo lleno; el resto,
  // anillo), para que el icono siga al botón cuando el filtro cambia de elegido
  // sin volver a dibujar el SVG.
  function semSvg(k, size) {
    var sz = size || 20;
    return '<svg class="ej-sem-i" viewBox="0 0 24 24" width="' + sz + '" height="' + sz + '" aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="12" r="9.1" stroke="currentColor" stroke-width="1.7"/>' +
      '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      SEM_GLIFO[k] + "</g></svg>";
  }
  // Radiogroup con roving tabindex: solo el elegido queda tabulable, y siempre
  // hay uno elegido porque 0 ("sin resolver") es un estado más.
  function semHtml(e, etiqueta) {
    return '<div class="ej-sem" role="radiogroup" aria-label="' + esc(etiqueta || "Cómo resolvió el ejercicio") + '">' +
      EST_ORDEN.map(function (k) {
        var on = e === k;
        return '<button type="button" role="radio" class="ej-sem-b ej-k' + k + (on ? " on" : "") + '"' +
          ' data-ej-set="' + k + '" aria-checked="' + (on ? "true" : "false") + '"' +
          ' tabindex="' + (on ? "0" : "-1") + '"' +
          ' title="' + esc(EST_LABEL[k]) + '" aria-label="' + esc(EST_LABEL[k]) + '">' +
          semSvg(k) + "</button>";
      }).join("") + "</div>";
  }

  var ESTADO = (function () {
    var o = A.LS.getObj(LS_ESTADO);
    if (o.v !== 1 || !o.m || typeof o.m !== "object") o = { v: 1, m: {} };
    return o;
  })();
  function getEstado(id) { var r = ESTADO.m[id]; return (r && +r.e) || 0; }
  function setEstado(id, e) {
    if (!e) delete ESTADO.m[id];
    else ESTADO.m[id] = { e: e, t: A.localToday() };
    A.LS.set(LS_ESTADO, ESTADO);
    // [bundle] la barra de progreso de la unidad cuenta cada ejercicio como un
    // paso (N0-61): el anfitrión tiene que enterarse de que este cambió.
    if (typeof A.progressChanged === "function") A.progressChanged();
  }
  function statsOf(list) {
    var s = [0, 0, 0, 0];
    list.forEach(function (it) { s[getEstado(it.id)]++; });
    return s;
  }
  function hechos(s) { return s[1] + s[2] + s[3]; }

  function getUltimo() {
    var o = A.LS.getObj(LS_ULTIMO);
    return (o && o.u && BY_UNIT[o.u]) ? o : null;
  }
  function setUltimo(u, col, id) {
    var prev = A.LS.getObj(LS_ULTIMO);
    var keep = (prev.u === u && prev.col === col) ? (prev.id || "") : "";
    A.LS.set(LS_ULTIMO, { u: u, col: col, id: id || keep });
  }

  // ---------------- utilidades ----------------
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function haystack(it) {
    if (it.__hs == null) {
      it.__hs = norm([it.titulo, (it.tags || []).join(" "), it.examen || "",
        "n" + numDe(it), "n" + it.numero].join(" "));
    }
    return it.__hs;
  }
  // tags estructurales: no aportan tema, no se muestran como chip
  var TAG_OMITIR = {
    "multi-inciso": 1, "con-tabla": 1, "con-diagrama": 1, "parametrizado": 1,
    "formula": 1, "propiedad": 1, "teorema": 1, "definicion": 1, "distribucion": 1
  };
  // Los tags del corpus son slugs sin tildes ni ñ ("hipergeometrica",
  // "tamano-muestra"): en pantalla tienen que leerse en español correcto.
  // TAG_PALABRA acentúa palabra por palabra; TAG_FRASE cubre los pocos casos en
  // los que la unión palabra a palabra no da una etiqueta natural.
  var TAG_PALABRA = {
    aprox: "aprox.", asimetria: "asimetría", bayes: "Bayes", bernoulli: "Bernoulli",
    cdf: "CDF", chapman: "Chapman", coef: "coef.", correccion: "corrección",
    desvio: "desvío", distribucion: "distribución", ecuacion: "ecuación",
    erlang: "Erlang", estadistica: "estadística", estadistico: "estadístico",
    estimacion: "estimación", estocastico: "estocástico", exitos: "éxitos",
    fda: "FDA", funcion: "función", geometrica: "geométrica",
    hipergeometrica: "hipergeométrica", hipotesis: "hipótesis", ic: "IC", iqr: "IQR",
    kolmogorov: "Kolmogorov", laplace: "Laplace", markov: "Markov", maximo: "máximo",
    metodo: "método", minimo: "mínimo", monotona: "monótona", morgan: "Morgan",
    multiplicacion: "multiplicación", normalizacion: "normalización", pmf: "PMF",
    poisson: "Poisson", prob: "prob.", proporcion: "proporción",
    reflexion: "reflexión", region: "región", repeticion: "repetición",
    simbolica: "simbólica", simetria: "simetría", student: "Student", tamano: "tamaño", tcl: "TCL",
    afin: "afín", transformacion: "transformación", transicion: "transición", union: "unión",
    va: "v.a.", venn: "Venn"
  };
  var TAG_FRASE = {
    "de-morgan": "De Morgan",
    "t-student": "t de Student",
    "chapman-kolmogorov": "Chapman-Kolmogorov",
    "coef-asimetria": "Coef. de asimetría",
    "coef-curtosis": "Coef. de curtosis",
    "matriz-transicion": "Matriz de transición",
    "propiedad-markov": "Propiedad de Markov",
    "markov-desigualdad": "Desigualdad de Markov",
    "tamano-muestra": "Tamaño de muestra",
    "prueba-hipotesis": "Prueba de hipótesis",
    "intervalo-confianza": "Intervalo de confianza",
    "ruina-jugador": "Ruina del jugador",
    "suma-de-va": "Suma de v.a.",
    "valor-p": "Valor p",
    "region-rechazo-media-z": "Región de rechazo (media, z)",
    "region-rechazo-media-t": "Región de rechazo (media, t)"
  };
  function tagLabel(t) {
    var k = String(t);
    if (TAG_FRASE[k]) return TAG_FRASE[k];
    var s = k.split("-").map(function (w) { return TAG_PALABRA[w] || w; }).join(" ");
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ---------------- matemática que viene partida en los datos ----------------
  // A.renderMathHtml resuelve la math inline con /\$([^$\n]+?)\$/: por diseño no
  // cruza saltos de línea, así que la matemática que el generador dejó partida en
  // dos líneas mostraría los '$' y los comandos en crudo. Aquí se unen las líneas
  // dentro de cada par $…$ antes de renderizar; los $$…$$ se copian tal cual y
  // \$ se respeta. Se deja intacto el par larguísimo o con etiquetas HTML: eso
  // sería un '$' suelto emparejado por casualidad, no matemática.
  function joinInlineMath(html) {
    var s = String(html || "");
    if (s.indexOf("$") < 0 || s.indexOf("\n") < 0) return s;
    var out = "", i = 0, n = s.length;
    while (i < n) {
      var ch = s.charAt(i);
      if (ch === "\\") { out += s.substr(i, 2); i += 2; continue; }
      if (ch !== "$") { out += ch; i++; continue; }
      if (s.charAt(i + 1) === "$") {                       // display: sin tocar
        var end = s.indexOf("$$", i + 2);
        if (end < 0) { out += s.slice(i); break; }
        out += s.slice(i, end + 2); i = end + 2; continue;
      }
      var j = i + 1, close = -1;
      while (j < n) {
        var c = s.charAt(j);
        if (c === "\\") { j += 2; continue; }
        if (c === "$") { close = j; break; }
        j++;
      }
      if (close < 0) { out += s.slice(i); break; }
      var body = s.slice(i + 1, close);
      if (body.indexOf("\n") >= 0 && body.length <= 400 &&
          body.indexOf("</") < 0 && body.indexOf("<p") < 0) {
        body = body.replace(/\s*\n\s*/g, " ");
      }
      out += "$" + body + "$";
      i = close + 1;
    }
    return out;
  }

  // Algunas notas y nombres de los anexos traen TeX sin delimitar ("Con proceso:
  // \lambda\to\lambda t."), de modo que se leerían los comandos literales. Aquí se
  // encierra en $…$ el tramo matemático: se agrupan las palabras contiguas que
  // son notación (con al menos un comando \… entre ellas) y queda fuera la
  // puntuación de la prosa. Si el texto ya trae '$', se respeta tal cual.
  var PROSA_1L = { a: 1, e: 1, o: 1, u: 1, y: 1 };
  var TOK_RE = /^(\(*)([\s\S]*?)([.,;:)]*)$/;
  function cuenta(s, c) {
    var k = 0;
    for (var i = 0; i < s.length; i++) if (s.charAt(i) === c) k++;
    return k;
  }
  function esMathTok(w) {
    if (!w) return false;
    if (w.indexOf("\\") >= 0) return true;
    if (!/^[A-Za-z0-9^_{}()[\]|+\-*/=<>'!]+$/.test(w)) return false;
    if (w.length === 1) return !PROSA_1L[w.toLowerCase()];
    return /[\^_=<>|+*/]/.test(w);
  }
  function texify(s) {
    var txt = String(s || "");
    if (!txt || txt.indexOf("$") >= 0 || !/\\[a-zA-Z]/.test(txt)) return txt;
    var out = [], run = [], runTex = false, pre = "";
    function cerrar(cola) {
      if (run.length) out.push(pre + (runTex ? "$" + run.join(" ") + "$" : run.join(" ")) + cola);
      else if (pre || cola) out.push(pre + cola);
      run = []; runTex = false; pre = "";
    }
    txt.split(" ").forEach(function (tok) {
      var m = tok.match(TOK_RE);
      var abre = m[1], core = m[2], cola = m[3];
      // el paréntesis de cierre que equilibra la fórmula vuelve adentro
      while (cola.charAt(0) === ")" && cuenta(core, "(") > cuenta(core, ")")) {
        core += ")"; cola = cola.slice(1);
      }
      // el de apertura sin su cierre es prosa, no parte de la fórmula
      var dentro = (core + cola).indexOf(")") >= 0 ? abre : "";
      var fuera = abre.slice(dentro.length);
      if (core && esMathTok(core)) {
        if (fuera && run.length) cerrar("");
        if (!run.length) pre = fuera;
        run.push(dentro + core);
        if (core.indexOf("\\") >= 0) runTex = true;
        if (cola) cerrar(cola);                 // la puntuación corta el tramo
      } else {
        cerrar("");
        out.push(tok);
      }
    });
    cerrar("");
    return out.join(" ");
  }
  function tagsVisibles(it) {
    return (it.tags || []).filter(function (t) { return !TAG_OMITIR[t]; }).slice(0, 3);
  }
  function tiene(it, tag) { return (it.tags || []).indexOf(tag) >= 0; }
  function flag(it, f) { return (it.flags || []).indexOf(f) >= 0; }
  function colNombre(id) { return (COL_BY_ID[id] && COL_BY_ID[id].nombre) || id; }
  // Etiqueta de la colección para el antetítulo de la portada: «Guía TP3»,
  // «Propuestos de Lutzio», «Parciales» o «Finales». El número del TP sale del
  // slug de la fuente ("tp3-variables-aleatorias-discretas") y, si el dato no
  // lo trae, del número de unidad, que es con el que coincide en toda la guía.
  // «Unidad 3» en el antetítulo: A.unitShort() abrevia a «U3», demasiado seco
  // para una portada. Las claves que no son un número (Complementos,
  // Evaluaciones) conservan la abreviatura de la app.
  function unidadLarga(u) { return /^\d+$/.test(String(u)) ? "Unidad " + u : A.unitShort(u); }
  var COL_KICKER = { lutzio: "Propuestos de Lutzio", parciales: "Parciales", finales: "Finales" };
  function colKicker(u, col) {
    if (COL_KICKER[col]) return COL_KICKER[col];
    if (col !== "guia") return colNombre(col);
    var tp = 0;
    itemsOf(u, "guia").some(function (it) {
      var m = /^tp(\d+)/i.exec((it.fuente && it.fuente.wikiSlug) || "");
      if (m) { tp = +m[1]; return true; }
      return false;
    });
    return "Guía TP" + (tp || u);
  }
  function colCorto(id) { return (COL_BY_ID[id] && COL_BY_ID[id].corto) || id; }

  // ---------------- instancia y unidades secundarias ----------------
  // 'instancia' viene en los datos; mientras no esté, se lee del nombre del
  // examen. El orden importa: "Recuperatorio Primer Parcial" es recuperatorio y
  // "Parcialito TP1 y TP2" es parcialito, no parcial.
  var INSTANCIAS = [
    [/recuperatorio/i, "Recuperatorio"],
    [/parcialito/i, "Parcialito"],
    [/final/i, "Final"],
    [/parcial/i, "Parcial"]
  ];
  // el campo del dato viene en minúscula ('parcial'); en pantalla va capitalizado
  function instanciaLabel(s) {
    var k = String(s || "");
    for (var i = 0; i < INSTANCIAS.length; i++) if (INSTANCIAS[i][0].test(k)) return INSTANCIAS[i][1];
    return k ? k.charAt(0).toUpperCase() + k.slice(1) : "";
  }
  function instanciaDe(it) {
    return instanciaLabel(it.instancia || it.examen || "");
  }
  // unidades que el ejercicio toca además de la suya
  function unidadesSecDe(it) {
    return (it.unidadesSec || []).filter(function (k) { return k && k !== it.unidad; });
  }

  // ---------------- orden de los exámenes ----------------
  // Fecha legible en el nombre: "… · 2025-10-25", "Final 05/12/2025 …",
  // "Recuperatorio … 2019 (2º cuat.)". Se normaliza a un entero AAAAMMDD para
  // poder comparar; el año suelto queda en AAAA0000 y ordena antes que los días
  // de ese mismo año.
  var RE_ISO = /(20\d{2})-(\d{1,2})-(\d{1,2})/;
  var RE_DMY = /(\d{1,2})\/(\d{1,2})\/((?:19|20)\d{2})/;
  var RE_ANIO = /\b(?:19|20)\d{2}\b/;
  function fechaDe(nombre) {
    var s = String(nombre || ""), m;
    if ((m = s.match(RE_ISO))) return +m[1] * 10000 + +m[2] * 100 + +m[3];
    if ((m = s.match(RE_DMY))) return +m[3] * 10000 + +m[2] * 100 + +m[1];
    if ((m = s.match(RE_ANIO))) return +m[0] * 10000;
    return 0;
  }
  // Agrupa por examen. Cronológico entre los que traen fecha en el nombre; los
  // que no la traen conservan el orden de los datos y van al final.
  function gruposDe(list) {
    var orden = [], por = {}, pos = {};
    list.forEach(function (it) {
      var k = it.examen || "Evaluaciones";
      if (!por[k]) { por[k] = []; pos[k] = orden.length; orden.push(k); }
      por[k].push(it);
    });
    orden.sort(function (a, b) {
      var fa = fechaDe(a), fb = fechaDe(b);
      if (!fa !== !fb) return fa ? -1 : 1;
      if (fa && fa !== fb) return fa - fb;
      return pos[a] - pos[b];
    });
    return orden.map(function (k) { return { nombre: k, items: por[k] }; });
  }

  // ---------------- barra de progreso de 4 segmentos ----------------
  function pctW(n, total) { return (total ? (100 * n / total) : 0).toFixed(2) + "%"; }
  // los cuatro segmentos, en el mismo orden que el semáforo
  function barHtml(s, total) {
    return '<div class="ej-bar" id="ejBar" role="img" aria-label="Progreso de la colección">' +
      EST_ORDEN.map(function (k) {
        return '<i class="s' + k + '" style="width:' + pctW(s[k], total) + '"></i>';
      }).join("") + "</div>";
  }
  // La mini barra de la barra de herramientas muestra «3/24»: el rótulo largo
  // («3 de 24 ejercicios resueltos») queda en el title del grupo.
  function progTitulo(s, total) {
    return "Resueltos: " + hechos(s) + " de " + total;
  }
  var EST_DESGLOSE = ["sin resolver", "solo", "poca ayuda", "mucha ayuda"];
  function desgloseHtml(s) {
    return '<div class="eic-break">' + EST_ORDEN.map(function (k) {
      return '<span class="ej-k' + k + '"><i></i><b>' + s[k] + "</b> " + EST_DESGLOSE[k] + "</span>";
    }).join("") + "</div>";
  }

  // ============================================================
  //  MERMAID  (carga perezosa, una sola vez por sesión)
  // ============================================================
  var mermaidPromise = null, diagN = 0;
  // Diagramas ya dibujados: el svg de mermaid trae los colores incrustados, así
  // que un cambio de tema obliga a volver a dibujarlos.
  var DIBUJADOS = [];
  // Al imprimir, el papel es blanco aunque la aplicación esté en un tema oscuro.
  var forzarClaro = false;
  function temaOscuro() {
    var t = document.documentElement.getAttribute("data-theme");
    return t === "claustro" || t === "dark";
  }
  function temaMermaid() { return (!forzarClaro && temaOscuro()) ? "dark" : "neutral"; }
  // [bundle] En el baseline mermaid era un archivo del sitio («vendor/…») y el
  // script se insertaba con esa ruta relativa. Acá los archivos del bundle los
  // sirve el API bajo su propia base, y el manifiesto NO tiene ranura para un
  // archivo que se carga PEREZOSAMENTE: declararlo en `scripts` cargaría 3,3 MB
  // en cada entrada a cualquiera de las tres vistas. Viaja entonces como archivo
  // suelto (`vendor/mermaid.min.js.txt`, que el CLI sube porque no es código
  // declarado) y se convierte en script con un blob: el API lo sirve como
  // text/plain con `nosniff`, así que un <script src> directo quedaría
  // bloqueado. `A.toolFileUrl` solo resuelve mientras corren los scripts del
  // bundle: por eso la URL se calcula ACÁ, al evaluarse el módulo, y no adentro.
  var MERMAID_URL = (A.toolFileUrl && A.toolFileUrl(MERMAID_FILE)) || MERMAID_FILE;
  function loadMermaid() {
    if (mermaidPromise) return mermaidPromise;
    mermaidPromise = new Promise(function (res, rej) {
      if (window.mermaid) return res(window.mermaid);
      fetch(MERMAID_URL, { credentials: "same-origin" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      }).then(function (code) {
        var url = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
        var s = document.createElement("script");
        s.src = url;
        s.setAttribute("data-bundle", BUNDLE_ID);
        s.onload = function () {
          URL.revokeObjectURL(url);
          window.mermaid ? res(window.mermaid) : rej(new Error("mermaid no se registró"));
        };
        s.onerror = function () { URL.revokeObjectURL(url); rej(new Error("no se pudo evaluar mermaid")); };
        document.head.appendChild(s);
      }).catch(function (e) { rej(e); });
    });
    return mermaidPromise;
  }
  // initialize() va ANTES de cada render, no una sola vez: el tema de la
  // aplicación pudo cambiar desde el diagrama anterior y es una llamada barata.
  function svgDe(m, d) {
    m.initialize({ startOnLoad: false, theme: temaMermaid(), securityLevel: "loose" });
    return Promise.resolve().then(function () { return m.render("ejmmd" + (diagN++), d.code); })
      .then(function (r) { return (r && r.svg) || String(r || ""); });
  }
  function figuraDe(d, svg) {
    var fig = document.createElement("figure");
    fig.className = "ej-diag";
    var box = document.createElement("div");
    box.className = "ej-diag-svg";
    box.innerHTML = svg;
    fig.appendChild(box);
    if (d.caption) {
      var c = document.createElement("figcaption");
      c.innerHTML = A.renderMathHtml(d.caption);
      fig.appendChild(c);
    }
    return fig;
  }
  // Vuelve a dibujar con el tema actual los diagramas que siguen en el documento.
  function redibujarDiagramas() {
    DIBUJADOS = DIBUJADOS.filter(function (x) { return x.el && x.el.isConnected; });
    var t = temaMermaid();
    var pend = DIBUJADOS.filter(function (x) { return x.tema !== t; });
    if (!pend.length) return Promise.resolve();
    return loadMermaid().then(function (m) {
      return Promise.all(pend.map(function (x) {
        return svgDe(m, x.d).then(function (svg) {
          if (!x.el.isConnected) return;
          var fig = figuraDe(x.d, svg);
          x.el.replaceWith(fig);
          x.el = fig; x.tema = t;
        }).catch(function () {});
      }));
    }).catch(function () {});
  }
  // el tema se conmuta en el atributo data-theme del <html> (core.js; en la
  // plataforma, el shell). [bundle] el observador se desconecta con el bundle:
  // si no, quedaría uno vivo por cada entrada a la materia.
  if (window.MutationObserver) {
    var temaObs = new MutationObserver(function () { redibujarDiagramas(); });
    temaObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (A.onTeardown) A.onTeardown(function () { temaObs.disconnect(); });
  }
  // si mermaid no está o el diagrama no compila, queda el código a la vista
  function diagFallback(slot, d) {
    if (!slot || !slot.parentNode) return;
    var fig = document.createElement("figure");
    fig.className = "ej-diag";
    // queda anotado de qué diagrama es: si el respaldo se puso solo para
    // imprimir, al cerrar el diálogo se vuelve a intentar el dibujo
    fig.dataset.diag = slot.dataset.diag || "";
    fig.dataset.fallback = "1";
    var pre = document.createElement("pre");
    pre.className = "code";
    pre.textContent = (d && d.code) || "";
    fig.appendChild(pre);
    if (d && d.caption) {
      var c = document.createElement("figcaption");
      c.innerHTML = A.renderMathHtml(d.caption);
      fig.appendChild(c);
    }
    slot.replaceWith(fig);
  }
  // Devuelve la promesa de todos los diagramas del contenedor: quien imprime
  // necesita esperarla antes de llamar a print().
  function mountDiagrams(host, it) {
    var slots = $$(".diag-slot", host);
    if (!slots.length) return Promise.resolve();
    var ds = it.diagrams || [];
    slots.forEach(function (s) { s.textContent = "Dibujando el diagrama…"; });
    return loadMermaid().then(function (m) {
      // Un diagrama por cuadro, en cadena y no con Promise.all: mermaid dibuja
      // de forma sincrónica por dentro, y los dos o tres diagramas de un mismo
      // ejercicio caían en la misma tarea (244 ms medidos). La carga perezosa
      // del script no cambia: sigue siendo una sola vez por sesión.
      return slots.reduce(function (cad, slot) {
        return cad.then(function () {
          var d = ds[+slot.dataset.diag];
          if (!d || !d.code) { diagFallback(slot, d); return null; }
          return enCuadro().then(function () { return svgDe(m, d); }).then(function (svg) {
            if (!slot.parentNode) return;
            var fig = figuraDe(d, svg);
            slot.replaceWith(fig);
            DIBUJADOS.push({ el: fig, d: d, tema: temaMermaid() });
          }).catch(function () { diagFallback(slot, d); });
        });
      }, Promise.resolve());
    }).catch(function () {
      slots.forEach(function (slot) { diagFallback(slot, ds[+slot.dataset.diag]); });
    });
  }

  // ============================================================
  //  PINTADO POR BLOQUES  (cola global con presupuesto por cuadro)
  // ============================================================
  // El cuerpo de una resolución se pinta en fragmentos de nivel superior
  // (párrafos, matemática en display, tablas, figuras) en vez de una sola
  // asignación de innerHTML: KaTeX sobre el ejercicio más pesado de la
  // colección de Lutzio de la unidad 6 costaba una tarea de 656-856 ms medidos.
  // Todas las pinturas en vuelo comparten UNA cola: si cada ejercicio llevara
  // su propio presupuesto, abrir la colección entera los volvería a juntar.
  var PRESUPUESTO_MS = 12;
  var COLA = [], colaEnMarcha = false;
  function ahora() {
    return (window.performance && performance.now) ? performance.now() : Date.now();
  }
  // Se cede con un cuadro y no con requestIdleCallback: mientras el periodo
  // ocioso no se agota, el navegador encadena varias devoluciones de rIC DENTRO
  // de la misma tarea y los pasos se vuelven a juntar en una tarea larga.
  function cedeCuadro(fn) {
    if (window.requestAnimationFrame) requestAnimationFrame(function () { fn(); });
    else setTimeout(fn, 0);
  }
  // Promesa que resuelve en el cuadro siguiente: sirve para separar en tareas
  // distintas trabajos sincrónicos que no pasan por la cola (los diagramas).
  function enCuadro() { return new Promise(function (r) { cedeCuadro(r); }); }

  // ------------------------------------------------------------
  // [bundle] EL SCROLLER
  // ------------------------------------------------------------
  // El baseline daba por sentado que el documento entero scrolleaba (`window`).
  // En la plataforma el que scrollea es un contenedor del shell, así que el
  // ancla `?ej=` tiene que preguntar cuál es. Se sube desde la raíz de la vista
  // hasta el primer ancestro con desbordamiento vertical propio; `null` quiere
  // decir «scrollea la ventana», que es el comportamiento del baseline.
  function scrollerDe(desde) {
    var n = desde || (A.viewRoot && A.viewRoot()) || null;
    while (n && n.nodeType === 1 && n !== document.body && n !== document.documentElement) {
      var ov = "";
      try { ov = getComputedStyle(n).overflowY; } catch (e) { ov = ""; }
      if (/(auto|scroll|overlay)/.test(ov) && n.scrollHeight > n.clientHeight + 1) return n;
      n = n.parentElement;
    }
    return null;
  }
  function scrollYDe(sc) { return sc ? sc.scrollTop : (window.pageYOffset || 0); }
  function irA(sc, y) { if (sc) sc.scrollTop = y; else window.scrollTo(0, y); }
  // Una tarea de la cola recibe el instante límite del cuadro y devuelve true
  // cuando terminó; si devuelve false se la vuelve a llamar (en este cuadro si
  // queda presupuesto, y si no en el siguiente).
  function encolar(tarea) {
    COLA.push(tarea);
    if (colaEnMarcha) return;
    colaEnMarcha = true;
    cedeCuadro(function ciclo() {
      var lim = ahora() + PRESUPUESTO_MS;
      while (COLA.length) {
        if (COLA[0](lim)) COLA.shift();
        if (ahora() >= lim) break;
      }
      if (COLA.length) cedeCuadro(ciclo); else colaEnMarcha = false;
    });
  }
  // Ejecuta fn como un paso mas de la cola: asi el trabajo que sigue a una
  // pintura no se suma a la tarea del cuadro que la termino.
  function enTurno(fn) {
    return new Promise(function (res) {
      encolar(function () { try { fn(); } catch (e) {} res(); return true; });
    });
  }
  // Termina de golpe lo que quede pendiente. La impresión no puede esperar
  // promesas, así que antes de armar el documento se vacía la cola.
  function vaciarCola() {
    for (var g = 0; COLA.length && g < 20000; g++) {
      if (COLA[0](Infinity)) COLA.shift();
    }
  }

  var VACIOS = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1,
                 link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1 };
  // Parte un HTML ya unido por joinInlineMath en sus elementos de nivel
  // superior. Trabaja sobre el TEXTO, no sobre el árbol del documento: el HTML
  // crudo no se puede insertar (los '<' que viven dentro de la matemática lo
  // romperían), así que se cuenta la profundidad de etiquetas salteando la
  // matemática y los '\$' escapados. Devuelve null ante cualquier duda — html
  // desbalanceado, matemática sin cerrar, trozos que no reconstruyen el
  // original —, y en ese caso se pinta de una sola vez como antes.
  function partirBloques(s) {
    if (!s) return null;
    var out = [], depth = 0, ini = 0, i = 0, n = s.length, abrio = false;
    while (i < n) {
      var c = s.charAt(i);
      if (c === "\\" && s.charAt(i + 1) === "$") { i += 2; continue; }
      if (c === "$") {
        var disp = s.charAt(i + 1) === "$";
        var k = i + (disp ? 2 : 1), cierre = -1;
        while (k < n) {
          var cc = s.charAt(k);
          if (cc === "\\") { k += 2; continue; }
          if (!disp && cc === "\n") break;          // el inline de core.js no cruza saltos
          if (cc === "$" && (!disp || s.charAt(k + 1) === "$")) { cierre = k; break; }
          k++;
        }
        if (cierre < 0) { i++; continue; }          // '$' suelto: es texto
        i = cierre + (disp ? 2 : 1);
        continue;
      }
      if (c !== "<") { i++; continue; }
      if (s.substr(i, 4) === "<!--") {
        var fc = s.indexOf("-->", i);
        if (fc < 0) return null;
        i = fc + 3; continue;
      }
      var mm = s.substr(i, 40).match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
      if (!mm) { i++; continue; }
      var j = i + 1, q = "";
      while (j < n) {                                // fin de la etiqueta, respetando comillas
        var ch = s.charAt(j);
        if (q) { if (ch === q) q = ""; }
        else if (ch === '"' || ch === "'") q = ch;
        else if (ch === ">") break;
        j++;
      }
      if (j >= n) return null;
      if (s.charAt(i + 1) === "/") { if (depth > 0) depth--; }   // cierre huérfano: lo tira el parser
      else if (s.charAt(j - 1) !== "/" && !VACIOS[mm[1].toLowerCase()]) { depth++; abrio = true; }
      i = j + 1;
      if (depth === 0 && abrio) { out.push(s.slice(ini, i)); ini = i; abrio = false; }
      }
    if (depth !== 0) return null;
    if (ini < n) {                                   // cola suelta: va con el último bloque
      var resto = s.slice(ini);
      if (out.length) out[out.length - 1] += resto; else out.push(resto);
    }
    if (out.join("") !== s) return null;
    return out;
  }

  // Agrega un trozo ya renderizado al final del contenedor. Si el documento que
  // crece quedó entero por encima de la ventana, se corrige el scroll por lo que
  // creció, para que no se mueva lo que se está leyendo más abajo.
  function agregarTrozo(host, listo) {
    var sc = document.scrollingElement || document.documentElement;
    var r = null;
    try { r = host.getBoundingClientRect(); } catch (e) {}
    var arriba = !!(r && r.bottom <= 0 && sc);
    var y0 = arriba ? sc.scrollTop : 0, b0 = arriba ? r.bottom : 0;
    host.insertAdjacentHTML("beforeend", listo);
    // La lectura de después NO es decorativa: fuerza el maquetado aquí, dentro
    // del presupuesto del cuadro. Sin ella el trabajo pesado —maquetar KaTeX,
    // no generarlo: 77 ms de JavaScript contra 999 ms de maquetado medidos—
    // se acumulaba y caía junto al final del cuadro, en una sola tarea larga.
    var b1 = 0;
    try { b1 = host.getBoundingClientRect().bottom; } catch (e) { return; }
    if (!arriba) return;
    var d = b1 - b0;
    if (d > 0.5) sc.scrollTop = y0 + d;
  }

  // Inserta por bloques un HTML que YA trae la matemática resuelta (los anexos
  // la traen desde takeawayHtml/eqinfosHtml). Misma cola y mismo presupuesto que
  // el cuerpo; aquí no se vuelve a pasar por KaTeX.
  function pintarHtmlListo(host, html) {
    var bloques = partirBloques(html);
    if (!bloques || bloques.length < 2) {
      host.innerHTML = html;
      try { A.enhanceDoc(host); } catch (e) {}
      return Promise.resolve();
    }
    host.innerHTML = "";
    var i = 0, cerrando = false;
    return new Promise(function (res) {
      encolar(function (lim) {
        if (!cerrando) {
          do { agregarTrozo(host, bloques[i++]); }
          while (i < bloques.length && ahora() < lim);
          if (i < bloques.length) return false;
          cerrando = true;
          return false;
        }
        try { A.enhanceDoc(host); } catch (e) {}
        res();
        return true;
      });
    });
  }

  // ============================================================
  //  RENDER DE UN EJERCICIO
  // ============================================================
  // Pinta el HTML de un ejercicio (enunciado, resolución o anexo) dentro de un
  // .ej-doc: matemática resuelta, tablas y callouts de enhanceDoc y diagramas de
  // mermaid. 'it' puede ser el ítem del corpus o una copia suya —basta con que
  // traiga el id—: los diagramas se leen siempre del dato original. Devuelve la
  // promesa de los diagramas.
  // Con opts.sync en true pinta todo de una, sin pasar por la cola: lo necesita
  // la impresión, que no puede esperar promesas. Sin él, el cuerpo entra por
  // bloques y la promesa resuelve recién cuando está pintado ENTERO.
  var pintaSeq = 0;
  function pintarDoc(host, html, it, opts) {
    if (!host) return Promise.resolve();
    var src = (it && BY_ID[it.id]) || it;
    var s = joinInlineMath(String(html == null ? "" : html));
    // Cada pintura se queda con el contenedor: la anterior, si sigue en la cola,
    // se abandona en su próximo paso en vez de mezclar dos documentos.
    var mio = host.__pinta = ++pintaSeq;
    function diagramas() {
      if (host.__pinta !== mio) return Promise.resolve();
      if (src && src.diagrams && src.diagrams.length) return mountDiagrams(host, src);
      return Promise.resolve();
    }
    var bloques = (opts && opts.sync) ? null : partirBloques(s);
    if (!bloques || bloques.length < 2) {
      host.innerHTML = A.renderMathHtml(s);
      try { A.enhanceDoc(host); } catch (e) {}
      return diagramas();
    }
    host.innerHTML = "";
    var i = 0, cerrando = false;
    return new Promise(function (res) {
      encolar(function (lim) {
        if (host.__pinta !== mio) { res(); return true; }
        if (!cerrando) {
          // De a un bloque por vuelta: cada uno se inserta y se maquetó antes
          // de mirar el reloj, así el presupuesto mide el costo real.
          do { agregarTrozo(host, A.renderMathHtml(bloques[i++])); }
          while (i < bloques.length && ahora() < lim);
          if (i < bloques.length) return false;
          cerrando = true;          // enhanceDoc va en su propio paso de la cola
          return false;
        }
        try { A.enhanceDoc(host); } catch (e) {}
        res();
        return true;
      });
    }).then(diagramas);
  }

  // Enlace a la ficha del ejercicio dentro de esta vista. Acepta el id o el
  // ítem (o una copia con id): la colección sale siempre del dato original, así
  // que nadie más tiene que derivar parciales/finales.
  function ejercicioHref(x) {
    var it = (typeof x === "string") ? BY_ID[x] : ((x && BY_ID[x.id]) || x);
    if (!it || !it.unidad) return "#/ejercicios";
    return "#/ejercicios/" + it.unidad + "/" + colDe(it) + "?ej=" + encodeURIComponent(it.id);
  }

  // Contrato con study.js (simulador de parcial), que muestra ejercicios del
  // mismo corpus fuera de esta vista.
  A.pintarEjercicio = pintarDoc;
  A.ejercicioHref = ejercicioHref;

  // ============================================================
  //  LLENADO DE LA RESOLUCIÓN E IMPRESIÓN  (a nivel de módulo)
  // ============================================================
  // Estos dos listeners de window se registran UNA sola vez. Registrarlos por
  // render dejaba un par vivo por cada visita a la vista (fuga medida: +88
  // listeners en 10 ciclos), así que la lista se lee del DOM en el momento del
  // evento en vez de quedar capturada en un cierre.
  function listaActual() { return document.getElementById("ejList"); }
  function detsDe(le) { return le ? $$("details", le) : []; }

  // Llena la resolución en el primer 'toggle': el cuerpo, la caja de respuesta
  // (cuando el ítem la trae aparte) y los anexos de Lutzio como sub-rótulos,
  // todo dentro del mismo desplegable.
  // Los anexos de Lutzio (fórmulas usadas y derivación paso a paso) se llenan
  // en un paso aparte: son la mitad del costo de armar un ejercicio y no se
  // leen hasta después de la resolución, así que abrir la colección entera no
  // tiene por qué pagarlos en el mismo cuadro.
  function fillAnexos(d, sync) {
    if (!d || d.dataset.anx) return;
    var an = $("[data-anexos]", d); if (!an) return;
    var art = d.closest(".ej-item");
    var it = art && BY_ID[art.dataset.ej]; if (!it) return;
    d.dataset.anx = "1";
    // Primero los rótulos y las cajas vacías; el contenido de cada caja se pinta
    // aparte. Metido de una sola vez, el anexo era UN bloque de nivel superior
    // y la lista de «de dónde sale cada paso» volvía a costar una tarea de
    // 265 ms medidos, esta vez de maquetado.
    var html = "", partes = [];
    if (it.takeaway && it.takeaway.length) {
      html += '<div class="tex-rule sub"><span>Fórmulas y teoremas usados</span></div>' +
        '<div class="ej-anexo ej-doc" data-anx="formulas"></div>';
      partes.push(['[data-anx="formulas"]', takeawayHtml(it)]);
    }
    if (it.eqinfos && it.eqinfos.length) {
      html += '<div class="tex-rule sub"><span>De dónde sale cada paso</span></div>' +
        '<div class="ej-anexo ej-doc" data-anx="pasos"></div>';
      partes.push(['[data-anx="pasos"]', eqinfosHtml(it)]);
    }
    if (!html) return;
    an.innerHTML = html;
    partes.forEach(function (p) {
      var caja = $(p[0], an);
      if (!caja) return;
      if (sync) {
        caja.innerHTML = p[1];
        try { A.enhanceDoc(caja); } catch (e) {}
      } else {
        pintarHtmlListo(caja, p[1]);
      }
    });
  }

  // Con `diferir` en true llena solo el cuerpo y la respuesta; los anexos quedan
  // para una pasada posterior (ver fillAnexos). Con `sync` en true no se usa la
  // cola: todo queda pintado antes de devolver, como necesita la impresión.
  function fillDetails(d, diferir, sync) {
    // Si hay una pintura por bloques a medio hacer y piden modo sincrónico, se
    // rehace entera: el papel no espera a la cola.
    if (d.dataset.enh && !(sync && d.__pend)) return d.__prom || Promise.resolve();
    d.dataset.enh = "1";
    d.__pend = true;
    var art = d.closest(".ej-item");
    var it = art && BY_ID[art.dataset.ej];
    var host = it && $("[data-body]", d);
    if (!host) { d.__pend = false; return Promise.resolve(); }
    var base;
    if ((it.resolucionHtml || "").trim()) {
      base = pintarDoc(host, it.resolucionHtml, it, { sync: sync });
    } else {
      host.innerHTML = ""; host.__pinta = ++pintaSeq; base = Promise.resolve();
    }
    var tok = host.__pinta;   // una pintura posterior invalida esta continuación
    // La respuesta solo se muestra DENTRO de la resolución: enseñarla junto al
    // enunciado plegado adelantaría el resultado.
    var rh = (it.respuestaHtml || "").trim();
    function ponerRespuesta() {
      if (host.__pinta !== tok) return;
      // El texto de la fuente arranca con su propio encabezado («Respuesta de
      // la guía.»), que repetía el rótulo de la caja. Se lo saca del cuerpo y
      // pasa a ser el título, así la caja no dice dos veces lo mismo.
      var tit = "Respuesta";
      var cuerpo = rh.replace(
        /^(\s*<p>)?\s*<(b|strong)>\s*(Respuestas?(?: oficiales)? de la (?:guía|fuente))\.?\s*<\/\2>\s*/i,
        function (todo, p, tag, t) { tit = t.charAt(0).toUpperCase() + t.slice(1); return p || ""; });
      var box = document.createElement("div");
      box.className = "tex-box resp";
      box.innerHTML = '<span class="tex-boxtitle">' + esc(tit) + "</span>" +
        A.renderMathHtml(joinInlineMath(cuerpo));
      try { A.enhanceDoc(box); } catch (e) {}
      host.appendChild(box);
      host.insertAdjacentHTML("beforeend", marcadorOculta("dentro"));
    }
    // Sin caja «Respuesta» separada, lo que se tapa es el bloque de resultado
    // embebido en la resolución: el marcador va detrás del último.
    function ponerMarcaEmbebida() {
      if (host.__pinta !== tok) return;
      var bloques = $$(".ej.resultado", host);
      if (!bloques.length) return;
      bloques[bloques.length - 1]
        .insertAdjacentHTML("afterend", marcadorOculta("dentro"));
    }
    var fin = base;
    if (!rh) {
      fin = fin.then(function () {
        if (sync) { ponerMarcaEmbebida(); return; }
        return enTurno(ponerMarcaEmbebida);
      });
    }
    if (rh) {
      fin = fin.then(function () {
        if (sync) { ponerRespuesta(); return; }
        return enTurno(ponerRespuesta);
      });
    }
    if (!diferir) {
      fin = fin.then(function () {
        if (sync) { fillAnexos(d, true); return; }
        return enTurno(function () { fillAnexos(d); });
      });
    }
    d.__prom = fin.then(function () { d.__pend = false; });
    return d.__prom;
  }

  // Qué desplegables estaban abiertos antes de imprimir: al cerrar el diálogo el
  // documento vuelve como estaba, en vez de quedar con todos abiertos.
  var abiertosPrevios = null;
  function prepararImpresion() {
    var le = listaActual(); if (!le) return Promise.resolve();
    vaciarCola();   // lo que se estaba pintando por bloques se termina aquí
    var ds = detsDe(le);
    if (!abiertosPrevios) abiertosPrevios = ds.map(function (d) { return d.open; });
    // En papel el documento sale completo: aquí sí se pagan los anexos, incluso
    // en los desplegables que ya se habían llenado en diferido.
    return Promise.all(ds.map(function (d) {
      d.open = true;
      return fillDetails(d, false, true).then(function () { fillAnexos(d, true); });
    }));
  }
  function restaurarAbiertos() {
    var le = listaActual();
    if (le && abiertosPrevios) {
      detsDe(le).forEach(function (d, i) { d.open = !!abiertosPrevios[i]; });
    }
    abiertosPrevios = null;
  }
  // El navegador no espera promesas entre 'beforeprint' y la instantánea de la
  // página: lo que no llegó a dibujarse se reemplaza por el código del diagrama,
  // que al menos se lee. El botón "Imprimir" sí espera y llama a print() después.
  function onBeforePrint() {
    var le = listaActual(); if (!le) return;
    prepararImpresion();
    $$(".diag-slot", le).forEach(function (slot) {
      var art = slot.closest(".ej-item");
      var it = art && BY_ID[art.dataset.ej];
      diagFallback(slot, it && (it.diagrams || [])[+slot.dataset.diag]);
    });
  }
  // cerrado el diálogo, el código de respaldo vuelve a ser un diagrama
  function onAfterPrint() {
    var le = listaActual(); if (!le) return;
    restaurarAbiertos();
    var hosts = [];
    $$(".ej-diag[data-fallback]", le).forEach(function (fig) {
      var host = fig.parentNode && fig.closest(".ej-doc");
      var art = fig.closest(".ej-item");
      if (!host || !art || !BY_ID[art.dataset.ej]) return;
      var slot = document.createElement("div");
      slot.className = "diag-slot";
      slot.dataset.diag = fig.dataset.diag;
      fig.replaceWith(slot);
      if (hosts.indexOf(host) < 0) hosts.push(host);
    });
    hosts.forEach(function (host) {
      var art = host.closest(".ej-item");
      mountDiagrams(host, BY_ID[art.dataset.ej]);
    });
  }
  window.addEventListener("beforeprint", onBeforePrint);
  window.addEventListener("afterprint", onAfterPrint);
  // [bundle] los dos listeners son del BUNDLE, no de la página: se retiran al
  // descargarlo (salir de la materia), como pide `App.onTeardown` (herr-04).
  if (A.onTeardown) {
    A.onTeardown(function () {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    });
  }

  function takeawayHtml(it) {
    return '<div class="ej-take">' + (it.takeaway || []).map(function (t) {
      return '<div class="ej-take-it">' +
        '<div class="ej-take-n">' + rich(texify(t.nombre || t.key || "")) + "</div>" +
        (t.tex ? '<div class="ej-take-f">' + A.katex(t.tex, true) + "</div>" : "") +
        (t.nota ? '<p class="ej-take-note">' + rich(texify(t.nota)) + "</p>" : "") +
        "</div>";
    }).join("") + "</div>";
  }
  function eqinfosHtml(it) {
    return (it.eqinfos || []).map(function (q) {
      return '<div class="ej-eq">' +
        (q.titulo ? '<div class="ej-eq-t">' + rich(q.titulo) + "</div>" : "") +
        A.renderMathHtml(joinInlineMath(q.html)) +
        "</div>";
    }).join("");
  }

  // ============================================================
  //  ENUNCIADO: RÓTULO RUN-IN E INCISOS EN RENGLONES PROPIOS
  // ============================================================
  // El artículo ya no lleva título ni línea de metadatos: abre con el enunciado
  // y el run-in «Ejercicio N.». Como 214 de los 289 ítems traen un primer
  // <strong>Enunciado.</strong>, ese rótulo se quita del render (repetiría lo
  // que ya dice el run-in).
  // 209 ítems lo traen en negrita y otros 9 como texto pelado; el «Enunciado
  // (resumen):» de los pocos que resumen la fuente se conserva, porque ahí el
  // paréntesis dice algo.
  var RE_ROT_FUERTE = /^(\s*<p\b[^>]*>)?\s*<(b|strong)>\s*Enunciados?\s*(?:\(\s*[^()<>]{1,24}\s*\))?\s*[.:]?\s*<\/\2>\s*[.:]?\s*/i;
  // Tercera forma del corpus: el rótulo viene como <span class="box-tit">, que
  // la piel pinta en bloque (ejercicios.css, .ej-doc .box-tit) y por lo tanto
  // partía el párrafo del run-in en tres renglones.
  var RE_ROT_SPAN = /^(\s*<p\b[^>]*>)?\s*<span\b[^>]*\bclass\s*=\s*"[^"]*\bbox-tit\b[^"]*"[^>]*>\s*Enunciados?\s*[.:]?\s*<\/span>\s*[.:]?\s*/i;
  // La variante en texto plano admite además una aclaración entre paréntesis
  // («Enunciado (resumen):», «Enunciado (Ej. 4).»): el rótulo se saca igual,
  // que es lo que pidió P-27 —el artículo abre con el enunciado, no con la
  // palabra «Enunciado».
  var RE_ROT_PLANO = /^(\s*<p\b[^>]*>)?\s*Enunciados?\s*(?:\(\s*[^()<>]{1,24}\s*\))?\s*[.:]\s*/i;
  function quitarRotuloEnunciado(html) {
    var s = String(html || "");
    var res = [RE_ROT_FUERTE, RE_ROT_SPAN, RE_ROT_PLANO];
    for (var i = 0; i < res.length; i++) {
      var r = s.replace(res[i], function (todo, p) { return p || ""; });
      if (r !== s) return r;
    }
    return s;
  }

  // Pone el run-in dentro del primer <p> del enunciado. Si el enunciado no
  // arranca con un párrafo (tabla, lista o figura), el rótulo va en un párrafo
  // propio antes.
  function conRunIn(html, runIn) {
    var s = String(html || "");
    var m = /^\s*<p\b([^>]*)>/i.exec(s);
    if (m) {
      var attrs = / class\s*=\s*"/i.test(m[1])
        ? m[1].replace(/ class\s*=\s*"/i, ' class="ej-lead ')
        : m[1] + ' class="ej-lead"';
      return s.slice(0, m.index) + "<p" + attrs + ">" + runIn + s.slice(m.index + m[0].length);
    }
    return '<p class="ej-lead">' + runIn + "</p>" + s;
  }

  // ---------------- incisos ----------------
  // Los enunciados traen los incisos en corrido dentro de un mismo párrafo
  // («… (a) Agrupar en tabla … (b) Media, varianza …»). partirIncisos() los pasa
  // a renglones propios: cada inciso queda envuelto en un <span class="ej-inciso">
  // de bloque, con sangría colgante. Es una función PURA sobre el HTML del
  // enunciado y no toca nada más.
  //
  // Qué evita los falsos positivos:
  //   · se busca sobre una copia ENMASCARADA del HTML —etiquetas, comentarios y
  //     matemática $…$ reemplazados carácter a carácter—, de modo que el «a)» de
  //     $P(a)$ o el de un atributo nunca es candidato;
  //   · el marcador tiene que venir precedido por el arranque del párrafo, por
  //     un punto, un punto y coma, dos puntos, un cierre de paréntesis o un
  //     <br>/cierre de bloque, y seguido de un espacio;
  //   · solo se parte cuando hay al menos DOS marcadores CONSECUTIVOS de la
  //     misma serie desde el primero (a, b, c… · i, ii, iii… · 1, 2, 3…), así que
  //     «la letra a)» suelta en la prosa no dispara nada;
  //   · los marcadores tienen que estar todos a profundidad 0 de etiquetas: si
  //     alguno vive dentro de un <strong> o de un <li>, se deja el párrafo como
  //     está antes que romper el anidamiento.
  var MASCARA = "\u0001";
  var VOID_INC = VACIOS;
  // Devuelve { mask, depth }: 'mask' con la misma longitud que la entrada y las
  // zonas que no son texto tapadas; 'depth' con la profundidad de etiquetas en
  // cada posición.
  function analizarHtml(s) {
    var n = s.length, mask = s.split(""), depth = new Array(n), d = 0, i = 0, k;
    function tapar(a, b) { for (var q = a; q < b && q < n; q++) mask[q] = MASCARA; }
    function marcar(a, b, v) { for (var q = a; q < b && q < n; q++) depth[q] = v; }
    while (i < n) {
      var c = s.charAt(i);
      if (c === "\\" && i + 1 < n) { marcar(i, i + 2, d); tapar(i, i + 2); i += 2; continue; }
      if (c === "$") {
        var disp = s.charAt(i + 1) === "$";
        var j = i + (disp ? 2 : 1), cierre = -1;
        while (j < n) {
          var cc = s.charAt(j);
          if (cc === "\\") { j += 2; continue; }
          if (!disp && cc === "\n") break;      // el inline de core.js no cruza saltos
          if (cc === "$" && (!disp || s.charAt(j + 1) === "$")) { cierre = j; break; }
          j++;
        }
        if (cierre < 0) { depth[i] = d; i++; continue; }   // '$' suelto: es texto
        var finM = cierre + (disp ? 2 : 1);
        marcar(i, finM, d); tapar(i, finM); i = finM; continue;
      }
      if (c === "<") {
        if (s.substr(i, 4) === "<!--") {
          var fc = s.indexOf("-->", i);
          var finC = fc < 0 ? n : fc + 3;
          marcar(i, finC, d); tapar(i, finC); i = finC; continue;
        }
        var mm = s.substr(i, 40).match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
        if (!mm) { depth[i] = d; i++; continue; }
        var j2 = i + 1, q = "";
        while (j2 < n) {
          var ch = s.charAt(j2);
          if (q) { if (ch === q) q = ""; }
          else if (ch === '"' || ch === "'") q = ch;
          else if (ch === ">") break;
          j2++;
        }
        if (j2 >= n) { marcar(i, n, d); tapar(i, n); break; }
        var esCierre = s.charAt(i + 1) === "/";
        var solo = s.charAt(j2 - 1) === "/" || VOID_INC[mm[1].toLowerCase()];
        if (esCierre && d > 0) d--;
        marcar(i, j2 + 1, d); tapar(i, j2 + 1);
        if (!esCierre && !solo) d++;
        i = j2 + 1; continue;
      }
      depth[i] = d; i++;
    }
    for (k = 0; k < n; k++) if (depth[k] == null) depth[k] = 0;
    return { mask: mask.join(""), depth: depth };
  }

  var SERIE_ROMANA = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  var LETRAS_INC = "abcdefghijkl";
  var RE_MARCA = /(\(?)([a-z]{1,4}|\d{1,2})([).])/g;
  var RE_ABRE_BLOQUE = /^<(?:br|\/p|\/li|\/div|\/ul|\/ol|\/blockquote)\b/i;
  // valor esperado de la serie 'kind' en la posición 'n' (0 = primero)
  function valorSerie(kind, n) {
    if (kind === "N") return String(n + 1);
    if (kind === "R") return SERIE_ROMANA[n] || "\u0000";
    return LETRAS_INC.charAt(n) || "\u0000";
  }
  function serieDe(txt) {
    if (txt === "1") return "N";
    if (txt === "i") return "R";
    if (txt === "a") return "L";
    return "";
  }
  // ¿El marcador que empieza en 'p' está donde puede empezar un inciso?
  // 'paren' distingue la forma «(a)» de la forma «a)»: la primera es inequívoca
  // —un paréntesis con una sola letra adentro no aparece en la prosa— y por eso
  // le alcanza con venir separada por un espacio; muchos enunciados la traen
  // enumerando dentro de la frase («Calcular (a) …, (b) …»). La forma «a)», en
  // cambio, exige arranque de párrafo o final de oración.
  var FIN_ORACION = { ".": 1, ";": 1, ":": 1, ")": 1, "?": 1, "!": 1 };
  // Espacio duro escrito como entidad: los frags separan así dos incisos que van
  // en el mismo renglón («… $E(X)$. &nbsp;<strong>b)</strong> …»). La máscara no
  // toca el texto plano, de modo que sin esto el marcador queda «pegado» al «;»
  // de la entidad y se descarta.
  var RE_ESP_DURA = /(&nbsp;|&#160;|&#xa0;)$/i;
  var RE_COLA_SEP = /(?:\s|&nbsp;|&#160;|&#xa0;)+$/i;
  // Devuelve 2 (arranque inequívoco), 1 (marcador dentro de la frase: solo vale
  // si abre una serie de tres o más) o 0 (no es un inciso).
  function arranqueValido(s, mask, p, paren) {
    if (p === 0) return 2;
    var j = p - 1, huboEsp = false, ent;
    for (;;) {
      if (j >= 0 && /\s/.test(mask.charAt(j))) { j--; huboEsp = true; continue; }
      ent = j >= 5 ? RE_ESP_DURA.exec(mask.slice(j - 5, j + 1)) : null;
      if (ent) { j -= ent[1].length; huboEsp = true; continue; }
      break;
    }
    if (j < 0) return 2;                           // solo espacios por delante
    var c = mask.charAt(j);
    if (c === MASCARA) {                           // viene de un tramo tapado
      var ini = j;
      while (ini > 0 && mask.charAt(ini - 1) === MASCARA) ini--;
      var frag = s.slice(ini, ini + 14);
      if (RE_ABRE_BLOQUE.test(frag)) return 2;
      // Una ecuación en DISPLAY cierra la oración igual que un punto: los
      // enunciados dan los datos en $$…$$ y arrancan los incisos justo después.
      // La matemática en línea ($…$) no cuenta: ahí el marcador suele ser parte
      // de la frase.
      return (huboEsp && frag.slice(0, 2) === "$$") ? 2 : 0;
    }
    if (!huboEsp) return 0;                        // pegado a la palabra anterior
    if (paren || FIN_ORACION[c]) return 2;         // arranque inequívoco
    // Marcador dentro de la frase («Calcular a) …; b) …»): solo vale si la serie
    // que abre tiene al menos tres miembros. Con dos («con confianza a) 95%,
    // b) 99%») el corte parte una oración al medio y se prefiere no tocarla.
    return 1;
  }
  function partirParrafo(s) {
    if (!s || s.indexOf(")") < 0 && s.indexOf(".") < 0) return s;
    var an = analizarHtml(s), mask = an.mask, depth = an.depth;
    var cands = [], m;
    RE_MARCA.lastIndex = 0;
    while ((m = RE_MARCA.exec(mask))) {
      var p = m.index, fin = p + m[0].length, corte = p;
      if (m[1] === "(" && m[3] !== ")") continue;          // «(a.» no es un marcador
      if (depth[p] !== 0) {
        // Los propuestos de Lutzio traen el marcador en negrita
        // («<strong>a)</strong> $P(…)$»): vale, siempre que la etiqueta envuelva
        // al marcador y a nada más. El corte va antes de la apertura.
        var ini = p - 1;
        if (ini < 0 || mask.charAt(ini) !== MASCARA) continue;
        while (ini > 0 && mask.charAt(ini - 1) === MASCARA) ini--;
        var ma = /^<(strong|b|em|i)>$/i.exec(s.slice(ini, p));
        if (!ma || depth[ini] !== 0) continue;
        var tagFin = "</" + ma[1] + ">";
        if (s.substr(fin, tagFin.length).toLowerCase() !== tagFin.toLowerCase()) continue;
        corte = ini; fin += tagFin.length;
      }
      if (fin < mask.length && !/\s/.test(mask.charAt(fin))) continue;
      var fuerza = arranqueValido(s, mask, corte, m[1] === "(");
      if (!fuerza) continue;
      cands.push({ p: corte, abre: m[1], txt: m[2], cierre: m[3], fuerza: fuerza });
    }
    if (cands.length < 2) return s;
    // se elige la primera serie que arranque en a / i / 1 y se la sigue en orden
    var elegidos = null;
    for (var a = 0; a < cands.length && !elegidos; a++) {
      var kind = serieDe(cands[a].txt);
      if (!kind) continue;
      var firma = cands[a].abre + cands[a].cierre;
      var lista = [cands[a]], esperado = 1;
      for (var b = a + 1; b < cands.length; b++) {
        var c2 = cands[b];
        if (c2.abre + c2.cierre !== firma) continue;
        if (c2.txt !== valorSerie(kind, esperado)) continue;
        lista.push(c2); esperado++;
      }
      if (lista.length >= (cands[a].fuerza === 1 ? 3 : 2)) elegidos = lista;
    }
    if (!elegidos) return s;
    var out = s.slice(0, elegidos[0].p);
    for (var i = 0; i < elegidos.length; i++) {
      var desde = elegidos[i].p;
      var hasta = (i + 1 < elegidos.length) ? elegidos[i + 1].p : s.length;
      // El separador que quedaba entre dos incisos (espacios o un &nbsp;) ya no
      // separa nada una vez que cada uno tiene su renglón: se recorta para que
      // no deje un espacio duro colgando al final de la línea.
      out += '<span class="ej-inciso">' +
        s.slice(desde, hasta).replace(RE_COLA_SEP, "") + "</span>";
    }
    return out;
  }
  function partirIncisos(html) {
    var s = String(html || "");
    if (!s) return s;
    if (!/<p\b/i.test(s)) return partirParrafo(s);
    return s.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, function (todo, attrs, inner) {
      var nuevo = partirParrafo(inner);
      return nuevo === inner ? todo : "<p" + attrs + ">" + nuevo + "</p>";
    });
  }
  // se expone para la prueba unitaria
  // (node .claude/workforce-cambios/tools/incisos.test.mjs)
  A.ejPartirIncisos = partirIncisos;

  function itemHtml(it) {
    var e = getEstado(it.id);
    var um = A.unitMeta(it.unidad);
    var inst = instanciaDe(it);
    var usec = unidadesSecDe(it);

    // Metadatos del ejercicio (cátedra/propuesta, instancia, unidades
    // secundarias y temas). Ya NO se dibujan: el artículo abre directamente con
    // el enunciado. Siguen armados porque son la etiqueta accesible del
    // artículo — la búsqueda, en cambio, no depende de esto: lee los datos
    // (haystack) y no el DOM, así que sigue encontrando por título y por tema.
    var meta = [
      it.oficial ? "Cátedra" : "Propuesta",
      inst,
      usec.length ? "también " + usec.map(A.unitShort).join(", ") : "",
      tagsVisibles(it).map(tagLabel).join(" · ")
    ].filter(Boolean).join(" · ");

    // Avisos de fiabilidad: lo que la fuente no cierra tiene que leerse ANTES de
    // intentar el cálculo, no adentro de la resolución.
    var avisos = [];
    if (tiene(it, "parametrizado")) {
      avisos.push(A.renderMathHtml(
        "<span>Enunciado parametrizado por $K$: los valores finales dependen del $K$ asignado en el examen.</span>"));
    }
    if (flag(it, "enunciado-incompleto")) {
      avisos.push("<span>El enunciado original remite a una figura que no está transcripta: " +
        "de este ejercicio se muestra el método, no el resultado numérico.</span>");
    }
    if (flag(it, "verificar-resultado") || flag(it, "recalcular-en-parcial")) {
      avisos.push("<span>Resolución propuesta, no oficial: conviene rehacer las cuentas.</span>");
    }
    var aviso = avisos.map(function (a) {
      return '<div class="ej-aviso">' + icon("flag", 14) + a + "</div>";
    }).join("");

    var origen = it.verEnunciadoDe && BY_ID[it.verEnunciadoDe];
    var mismo = origen
      ? '<p class="ej-mismo">Mismo enunciado que <a href="#/ejercicios/' + esc(origen.unidad) + "/" + esc(colDe(origen)) +
        "?ej=" + encodeURIComponent(origen.id) + '" data-nav>' +
        "n.º " + esc(String(numDe(origen))) + " — " + rich(origen.titulo) + "</a>.</p>"
      : "";

    // El enunciado va armado en el propio HTML del artículo (render eager):
    // medido en la Fase 0, llenar la colección más larga cuesta 7 ms, así que el
    // observador que lo difería no compraba nada y en cambio obligaba a
    // prellenar la lista antes de saltar a un ancla.
    //
    // El artículo abre con él: se le quita el «Enunciado.» redundante, se pasan
    // los incisos a renglones propios y se le antepone el run-in «Ejercicio N.».
    var rotulo = "Ejercicio " + numDe(it) + ".";
    // La nota de renumeración es una pista visual (title + borde punteado), pero
    // un <strong> no recibe foco y el title no llega a un lector de pantalla:
    // se repite el mismo texto en un rótulo oculto que sí se lee (WCAG 3.3.2).
    var notaNum = renumerado(it)
      ? "N.º " + numDe(it) + " de la guía; el PDF de resolución lo numera como " + it.numero
      : "";
    var runIn = '<strong class="ej-n"' + (notaNum ? ' title="' + esc(notaNum) + '"' : "") +
      ">" + esc(rotulo) + "</strong>" +
      (notaNum ? '<span class="sr-only"> (' + esc(notaNum) + ")</span>" : "") + " ";
    var cuerpoEnun = quitarRotuloEnunciado(it.enunciadoHtml || "").trim();
    // El chip «Respuesta simbólica» desapareció con la línea de metadatos; el
    // aviso, que sí hace falta antes de calcular, queda como nota del enunciado.
    if (tiene(it, "respuesta-simbolica")) {
      cuerpoEnun += '<p class="ej-simb"><em>(respuesta simbólica: se pide una expresión en los parámetros)</em></p>';
    }
    var enun = '<div class="ej-enunciado ej-doc">' +
      A.renderMathHtml(joinInlineMath(conRunIn(partirIncisos(cuerpoEnun), runIn))) + "</div>";

    // Un solo desplegable por ejercicio, con aspecto de rótulo de sección: la
    // resolución se lleva adentro la respuesta y los anexos. Sigue plegado por
    // omisión porque abrir de golpe una colección de Lutzio costaba 2,4 s.
    var hayReso = !!(it.resolucionHtml || "").trim();
    var hayResp = !!(it.respuestaHtml || "").trim();

    // Marcador del modo "Ocultar respuestas". Solo se dibuja en los ejercicios
    // que traen algo que tapar: la caja «Respuesta» o un bloque de resultado
    // embebido en la resolución. Queda en el cuerpo del ejercicio, debajo del
    // enunciado, de modo que se lee sin abrir la resolución. La hoja de estilo
    // lo muestra únicamente con el modo activo y el ejercicio sin revelar.
    var hayOculta = hayResp || /class="ej resultado"/.test(it.resolucionHtml || "");
    var oculta = hayOculta ? marcadorOculta("fuera") : "";

    var reso = (hayReso || hayResp)
      ? '<details class="ej-reso" data-reso>' +
          '<summary class="ej-reso-sum"><span class="ej-reso-lbl">' + (hayReso ? "Resolución" : "Respuesta") + "</span>" +
          '<i class="ej-chev" aria-hidden="true">' + icon("chevdown", 14) + "</i></summary>" +
          '<div class="ej-reso-body">' +
            '<div class="ej-doc" data-body></div>' +
            '<div data-anexos></div>' +
            // Segundo semáforo al pie de la resolución: con ella abierta, el
            // final del ejercicio queda a varias pantallas del encabezado, y
            // marcar el estado obligaba a volver arriba. El delegado de clic
            // sincroniza los dos grupos del artículo.
            '<div class="ej-sem-foot">' + semHtml(e, "Cómo resolvió el ejercicio (al pie de la resolución)") + "</div>" +
          "</div>" +
        "</details>"
      : "";

    // Título y metadatos ya no se dibujan, pero no se pierden: nombran el
    // artículo para quien lo recorre con lector de pantalla y quedan en
    // data-titulo para quien los necesite (la barra de unidad, por ejemplo).
    var etiqueta = rotulo + " " + String(it.titulo || "").replace(/\$/g, "") +
      (meta ? " · " + meta : "");

    // 'ej-rev' revela la respuesta en el modo práctica: la traen ya puesta los
    // ejercicios con un estado marcado de una sesión anterior.
    return '<article class="ej-item' + (e ? " ej-rev" : "") + '" id="ej-' + esc(it.id) + '" data-ej="' + esc(it.id) + '" data-estado="' + e + '"' +
        ' aria-label="' + esc(etiqueta) + '" data-titulo="' + esc(it.titulo || "") + '"' +
        ' style="--ucol:' + um.color + '">' +
      // El artículo ya es una región con nombre; el encabezado oculto agrega la
      // navegación por encabezados, que es como se recorre un documento largo.
      '<h3 class="sr-only">' + esc(rotulo + " " + (it.titulo || "")).trim() + "</h3>" +
      // El semáforo se alinea con la primera línea del enunciado: fila flexible
      // con el cuerpo del ejercicio a la izquierda y los cuatro botones a la
      // derecha. La resolución, en cambio, ocupa el ancho entero.
      '<div class="ej-head">' +
        '<div class="ej-cuerpo">' + aviso + mismo + enun + oculta + "</div>" +
        semHtml(e) +
      "</div>" +
      reso +
      "</article>";
  }

  // ============================================================
  //  VISTA
  // ============================================================
  A.registerView("ejercicios", function (main, arg) {
    var parts = String(arg || "").split("/").filter(Boolean);
    if (!parts.length) { drawIndice(main); return; }
    var u = parts[0];
    if (!BY_UNIT[u]) {
      // La ruta no existe; «Sin resultados» describiría una búsqueda vacía. Se
      // usa el mismo rótulo que el core para una ruta desconocida.
      // [bundle] el título de la pestaña lo compone el ANFITRIÓN (herr-10).
      if (A.setTitle) A.setTitle("No encontrado");
      A.setCrumbs([{ label: "Inicio", hash: "#/inicio" }, { label: "Ejercicios", hash: "#/ejercicios" }, { label: "No encontrado" }]);
      main.innerHTML = A.backBar("#/ejercicios", "Ejercicios") +
        A.emptyState("No hay ejercicios en esa unidad.", "Elija una unidad del índice.");
      return;
    }
    // El hash tiene que nombrar la colección que se está mostrando. Se corrige,
    // reemplazando la entrada del historial (una ruta a medias no tiene que
    // quedar como paso del botón Atrás), en dos casos:
    //   · '#/ejercicios/<u>' sin colección, para que el tramo 'U<u>' de las
    //     migas deje de apuntar a la ruta en la que ya se está;
    //   · una colección que la unidad no tiene, incluida la ruta vieja
    //     '/examen' (las evaluaciones eran una sola colección).
    // En los dos casos manda el ejercicio pedido con ?ej=: se abre SU colección.
    if (!parts[1] || !itemsOf(u, parts[1]).length) {
      var r = A.parseRoute();
      var pedido = BY_ID[(r.query || {}).ej || ""];
      var destino = (pedido && pedido.unidad === u) ? colDe(pedido)
        : (parts[1] === "examen") ? "parciales" : "";
      if (!itemsOf(u, destino).length) destino = ((colsOf(u)[0] || {}).id || "");
      if (destino) {
        A.go("#/ejercicios/" + u + "/" + destino + (r.qs ? "?" + r.qs : ""), { replace: true });
        return;
      }
    }
    drawUnidad(main, u, parts[1] || "");
  });

  // ---------------- índice ----------------
  function drawIndice(main) {
    if (A.setTitle) A.setTitle("Ejercicios");
    A.setCrumbs([{ label: "Inicio", hash: "#/inicio" }, { label: "Practicar" }, { label: "Ejercicios" }]);

    var total = ITEMS.length;
    var glob = statsOf(ITEMS);

    var last = getUltimo();
    var resume = "";
    if (last) {
      var lu = A.unitMeta(last.u);
      // manda el ejercicio guardado: su colección es la que hay que abrir. Así
      // una marca vieja (cuando las evaluaciones eran una sola colección) sigue
      // llevando al ejercicio y no a otra colección de la misma unidad.
      var lit = (last.id && BY_ID[last.id]) || null;
      if (lit && lit.unidad !== last.u) lit = null;
      var lcol = lit ? colDe(lit)
        : (last.col && itemsOf(last.u, last.col).length) ? last.col
        : ((colsOf(last.u)[0] || {}).id || "");
      var href = "#/ejercicios/" + last.u + (lcol ? "/" + lcol : "") + (lit ? "?ej=" + encodeURIComponent(lit.id) : "");
      resume =
        '<div class="ej-resume">' +
          '<span class="eyebrow">Seguir donde estaba</span>' +
          '<div class="ej-resume-t"><b>' + esc(A.unitShort(last.u) + " · " + lu.name) + "</b>" +
            (lcol ? " · " + esc(colNombre(lcol)) : "") +
            (lit ? " · n.º " + esc(String(numDe(lit))) + " " + rich(lit.titulo) : "") + "</div>" +
          '<a class="btn primary" href="' + href + '" data-nav>' + icon("play", 15) + " Continuar</a>" +
        "</div>";
    }

    var cards = UNIT_KEYS.map(function (u) {
      var list = BY_UNIT[u];
      var s = statsOf(list);
      var pct = list.length ? Math.round(100 * hechos(s) / list.length) : 0;
      var um = A.unitMeta(u);
      return '<a class="ej-index-card" href="#/ejercicios/' + esc(u) + '" data-nav>' +
        '<div class="ring" style="--pct:' + pct + ";--col:" + um.color + '"><b>' + pct + "%</b></div>" +
        '<div class="eic-body">' +
          '<div class="eic-unit">' + esc(A.unitShort(u)) + "</div>" +
          "<h3>" + esc(um.name) + "</h3>" +
          '<div class="eic-cols">' + colsOf(u).map(function (c) {
            return '<span class="badge"><span class="dot" style="background:' + um.color + '"></span>' +
              esc(colCorto(c.id)) + " " + itemsOf(u, c.id).length + "</span>";
          }).join("") + "</div>" +
          desgloseHtml(s) +
        "</div></a>";
    }).join("");

    main.innerHTML =
      '<h1 class="section-title">Ejercicios</h1>' +
      '<p class="section-sub">' + total + " ejercicios resueltos de la guía de trabajos prácticos, los propuestos y las evaluaciones. " +
        "Marque cómo salió cada uno para ver dónde conviene insistir.</p>" +
      resume +
      '<div class="stat-row ej-stats" style="margin-top:0">' +
        '<div class="stat"><div class="n">' + hechos(glob) + '</div><div class="l">resueltos de ' + total + "</div></div>" +
        '<div class="stat"><div class="n">' + glob[1] + '</div><div class="l">solo</div></div>' +
        '<div class="stat"><div class="n">' + glob[2] + '</div><div class="l">poca ayuda</div></div>' +
        '<div class="stat"><div class="n">' + glob[3] + '</div><div class="l">mucha ayuda</div></div>' +
        '<div class="stat"><div class="n">' + glob[0] + '</div><div class="l">sin resolver</div></div>' +
      "</div>" +
      '<div class="ej-index-grid">' + cards + "</div>";
  }

  // ---------------- unidad + colección ----------------
  function drawUnidad(main, u, col) {
    var cols = colsOf(u);
    if (!col || !itemsOf(u, col).length) col = (cols[0] || {}).id || "";
    var list = itemsOf(u, col);
    var um = A.unitMeta(u);

    var titulo = colNombre(col) + " · " + A.unitShort(u);
    if (A.setTitle) A.setTitle(titulo);
    A.setCrumbs([
      { label: "Inicio", hash: "#/inicio" },
      { label: "Ejercicios", hash: "#/ejercicios" },
      { label: A.unitShort(u), hash: "#/ejercicios/" + u },
      { label: colNombre(col) }
    ]);
    setUltimo(u, col, "");

    var q0 = A.parseRoute().query || {};
    var fEstado0 = /^[0-3]$/.test(q0.estado || "") ? q0.estado : "";
    var fQ0 = q0.q || "";

    var s = statsOf(list);

    // ---------------- barra de herramientas, una sola fila ----------------
    // Colecciones, filtro por estado, búsqueda, progreso y acciones comparten
    // ahora una única fila pegajosa. Antes ocupaban tres filas (171 px medidos
    // a 1280 px) por encima del documento. Los rótulos completos no se pierden:
    // viajan en title y aria-label de cada control.
    var segCols = '<div class="seg ej-cols-seg" role="group" aria-label="Colección">' +
      cols.map(function (c) {
        // aria-pressed acompaña a la clase .on: el estado del grupo segmentado
        // tiene que llegar también a un lector de pantalla (WCAG 4.1.2).
        var n = itemsOf(u, c.id).length;
        var rot = c.nombre + " (" + n + ")";
        return '<button type="button" class="' + (c.id === col ? "on" : "") +
          '" aria-pressed="' + (c.id === col ? "true" : "false") +
          '" title="' + esc(rot) + '" aria-label="' + esc(rot) + '"' +
          ' data-nav="#/ejercicios/' + esc(u) + "/" + esc(c.id) + '">' +
          esc(c.corto) + "<i>" + n + "</i></button>";
      }).join("") + "</div>";

    // El filtro por estado es a la vez la leyenda del semáforo: mismos cuatro
    // iconos y mismo orden, para que no se lean dos escalas opuestas. Aquí van
    // solo los iconos; el nombre del estado está en title y aria-label de cada
    // botón, y el grupo entero lleva la leyenda de los cuatro en su title.
    var segEst = '<div class="seg ej-seg-est" role="group"' +
      ' aria-label="Filtrar por estado (leyenda del semáforo)" title="' +
      esc(EST_ORDEN.map(function (k) { return EST_CORTO[k]; }).join(" · ")) + '">' +
      '<button type="button" data-ej-filtro="" class="ej-est-todos' + (fEstado0 === "" ? " on" : "") +
        '" aria-pressed="' + (fEstado0 === "" ? "true" : "false") +
        '" title="Todos los estados" aria-label="Todos los estados">Todos</button>' +
      EST_ORDEN.map(function (k) {
        return '<button type="button" data-ej-filtro="' + k + '" class="ej-k' + k +
          (fEstado0 === String(k) ? " on" : "") + '" aria-pressed="' +
          (fEstado0 === String(k) ? "true" : "false") +
          '" title="' + esc(EST_LABEL[k]) + '" aria-label="' + esc(EST_LABEL[k]) + '">' +
          semSvg(k, 14) + "</button>";
      }).join("") + "</div>";

    var busca = '<div class="ej-buscar">' +
      '<input class="ej-search" id="ejQ" type="search" placeholder="Buscar por título o tema…" value="' +
        esc(fQ0) + '" aria-label="Buscar ejercicios" />' +
      '<span class="ej-count" id="ejCount"></span>' +
      "</div>";

    var prog = '<div class="ej-prog" title="' + esc(progTitulo(s, list.length)) + '">' +
      barHtml(s, list.length) +
      '<span class="ej-bar-txt" id="ejBarTxt"><b>' + hechos(s) + "</b>/" + list.length + "</span>" +
      "</div>";

    var resoOn = resoPref() === "open";
    var pracOn = practicaPref() === "on";
    var acciones = '<div class="ej-acts" role="group" aria-label="Acciones de la colección">' +
      '<button type="button" class="ej-ib ej-prac-b' + (pracOn ? " on" : "") +
        '" id="ejPractica" aria-pressed="' + (pracOn ? "true" : "false") + '"' +
        ' title="' + esc(practicaLabel(pracOn)) + '" aria-label="' + esc(practicaLabel(pracOn)) + '">' +
        ojoTachado(15) + "</button>" +
      '<label class="ej-ib ej-toggle' + (resoOn ? " on" : "") + '" title="Mostrar las resoluciones">' +
        '<input type="checkbox" id="ejResoAll"' + (resoOn ? " checked" : "") +
        ' aria-label="Mostrar las resoluciones" />' + chevIcon("off") + chevIcon("on") + "</label>" +
      '<button type="button" class="ej-ib" id="ejLookup" title="Valores z / t / χ²"' +
        ' aria-label="Valores z / t / χ²">' + icon("gauge", 15) + "</button>" +
      '<button type="button" class="ej-ib ej-print" id="ejPrint"' +
        ' title="Imprimir: abre todas las resoluciones, dibuja los diagramas y manda la colección al papel"' +
        ' aria-label="Imprimir la colección">' + icon("printer", 15) + "</button>" +
      "</div>";

    var toolbar = '<div class="ej-toolbar">' + segCols + segEst + busca + prog + acciones + "</div>";

    var cuerpo;
    if (COL_EXAMEN[col]) {
      // los ejercicios de evaluación se agrupan por examen, no por número
      cuerpo = gruposDe(list).map(function (g) {
        return '<section class="ej-group"><h2>' + esc(g.nombre) +
          '<span class="ej-group-n">' + g.items.length + " ejercicio" + (g.items.length === 1 ? "" : "s") + "</span></h2>" +
          g.items.map(itemHtml).join("") + "</section>";
      }).join("");
    } else {
      cuerpo = '<section class="ej-group">' + list.map(itemHtml).join("") + "</section>";
    }

    // barra de unidad del lector, con la colección como posición actual. Solo
    // si reader.js la expone: la vista tiene que servir igual sin ella.
    var strip = "";
    if (A.unitStripHtml) {
      try { strip = A.unitStripHtml({ unidad: u, current: "ej:" + col }) || ""; } catch (e) { strip = ""; }
    }

    main.innerHTML =
      '<div class="ej-wrap">' +
        A.backBar("#/ejercicios", "Todas las unidades") +
        (strip ? '<div class="ej-strip">' + strip + "</div>" : "") +
        // Una sola fila pegajosa con todo el navegador y el filtrador. En el
        // teléfono (≤ 640 px) deja de ser pegajosa: envuelve en varias líneas y
        // adentro se llevaba buena parte de los 740 px de alto de la pantalla.
        toolbar +
        // La colección es un documento LaTeX y va sobre la misma hoja que usan el
        // lector y los formularios (.sheet): las tres vistas comparten piel, y
        // sin la hoja la guía quedaba apoyada sobre el fondo de la página.
        '<div class="ej-list sheet tex-doc' + (practicaPref() === "on" ? " ej-practica" : "") +
          '" id="ejList" lang="es" style="--ucol:' + um.color + '">' +
          // Portada del documento, dentro de la hoja: es el mismo orden que usan
          // el lector y los formularios (chrome de navegación arriba, título
          // como primer elemento del documento).
          '<div class="tex-title">' +
            '<div class="tex-kicker">Ejercicios · ' + esc(unidadLarga(u)) + " · " + esc(colKicker(u, col)) + "</div>" +
            "<h1>" + esc(um.name) + "</h1>" +
            // El nombre de la colección solo vivía en el antetítulo, que no es un
            // encabezado: sin esto el árbol de accesibilidad tenía un único H.
            '<h2 class="sr-only">' + esc(colNombre(col)) + "</h2>" +
            '<div class="tex-sub">' + list.length + " ejercicio" + (list.length === 1 ? "" : "s") +
              " · " + hechos(s) + " resuelto" + (hechos(s) === 1 ? "" : "s") + "</div>" +
          "</div>" +
          (cuerpo || A.emptyState("No hay ejercicios en esta colección.", "")) + "</div>" +
        '<div class="ej-nores" id="ejVacio" hidden>' +
          A.emptyState("Ningún ejercicio coincide con el filtro.",
            "Pruebe con otro estado o borre lo escrito en el buscador.") +
          '<button type="button" class="btn" id="ejLimpiar">Quitar los filtros</button>' +
        "</div>" +
      "</div>";

    // el popover "¿Qué sigue?" y los tooltips de la barra los ata reader.js
    if (strip && A.wireUnitStrip) {
      try { A.wireUnitStrip(main, { unidad: u, current: "ej:" + col }); } catch (e) {}
    }

    bindUnidad(main, u, col, list, fEstado0, fQ0);
  }

  // ---------------- interacción ----------------
  function bindUnidad(main, u, col, list, fEstado, fQ) {
    var listEl = $("#ejList", main);
    if (!listEl) return;

    var arts = $$(".ej-item", listEl);
    var barEl = $("#ejBar", main), txtEl = $("#ejBarTxt", main), countEl = $("#ejCount", main);
    var vacioEl = $("#ejVacio", main);
    var inputQ = $("#ejQ", main);

    // El enunciado ya viene armado en el HTML de cada artículo: aquí solo falta
    // la pasada de enhanceDoc (tablas y callouts). Va ejercicio por ejercicio y
    // NO sobre la lista entera: enhanceDoc envuelve en .exercise-plate el primer
    // título que empieza con "Ejercicio", y sobre la lista se comía el
    // encabezado de cada artículo.
    $$(".ej-enunciado", listEl).forEach(function (h) { try { A.enhanceDoc(h); } catch (e) {} });

    // --- la resolución sigue siendo perezosa: se llena en el primer 'toggle' ---
    var dets = $$("details", listEl);
    dets.forEach(function (d) {
      // Al abrir uno solo se paga todo de una: son unos pocos milisegundos, y
      // así se recupera el anexo de los que quedaron a medias cuando se canceló
      // el llenado por lotes (fillAnexos es idempotente).
      d.addEventListener("toggle", function () {
        // El artículo lleva el estado del desplegable para que el modo práctica
        // pueda elegir cuál de los dos marcadores de «Respuesta oculta» muestra.
        var artD = d.closest(".ej-item");
        if (artD) artD.classList.toggle("ej-reso-abierta", d.open);
        if (!d.open) return;
        fillDetails(d, true).then(function () { return enTurno(function () { fillAnexos(d); }); });
      });
    });

    // --- interruptor "Mostrar las resoluciones" ---
    // Abre o cierra toda la colección y se acuerda de la elección (pe.exReso).
    // El llenado va por la cola de pintado del módulo, con presupuesto por
    // cuadro: abrir de una las resoluciones de una colección de Lutzio costaba
    // una sola tarea de 1843 ms medidos.
    function idle(fn) {
      if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 120 });
      else requestAnimationFrame(fn);
    }
    // Token de cancelación del llenado por lotes. Sin él, desmarcar el
    // interruptor mientras el bucle está en vuelo cerraba las resoluciones ya
    // abiertas pero el bucle seguía abriendo las que faltaban: el documento
    // terminaba contradiciendo al control y a la preferencia guardada. Cada
    // 'change' incrementa la generación, de modo que el lote pendiente se
    // detiene en el siguiente paso y un nuevo marcado arranca su propio bucle.
    var resoGen = 0;
    function abrirTodasProgresivo() {
      var gen = ++resoGen;
      var pend = dets.slice();
      // Abrir el desplegable y encargar su cuerpo es barato: el pintado real va
      // por la cola global del módulo, que reparte KaTeX y enhanceDoc en
      // fragmentos bajo presupuesto por cuadro. Aun así se cede el hilo cada
      // 40 ms, porque abrir un <details> invalida el diseño de toda la lista.
      (function paso() {
        if (gen !== resoGen) return;   // el interruptor cambió: se abandona
        if (!pend.length) return encargarAnexos();
        var t0 = ahora();
        do {
          var d = pend.shift();
          d.open = true;
          fillDetails(d, true);
        } while (pend.length && ahora() - t0 < 40);
        if (pend.length) { cedeCuadro(paso); return; }
        encargarAnexos();
      })();
      // Los anexos se encargan al final de la cola: primero queda pintada toda
      // la colección y recién después las «fórmulas usadas» y la derivación.
      function encargarAnexos() {
        dets.forEach(function (d) {
          enTurno(function () { if (gen === resoGen) fillAnexos(d); });
        });
      }
    }
    var resoChk = $("#ejResoAll", main);
    if (resoChk) {
      resoChk.addEventListener("change", function () {
        resoGen++;   // cancela el bucle en vuelo, tanto al marcar como al desmarcar
        A.LS.set(LS_RESO, resoChk.checked ? "open" : "closed");
        // el <label> lleva el estado en una clase: el chevrón y el fondo del
        // botón de icono se pintan sin depender de :has()
        var lbl = resoChk.closest(".ej-toggle");
        if (lbl) lbl.classList.toggle("on", resoChk.checked);
        if (resoChk.checked) abrirTodasProgresivo();
        else dets.forEach(function (d) { d.open = false; });
      });
      if (resoChk.checked && dets.length) idle(abrirTodasProgresivo);
    }

    // --- impresión ---
    // El documento tiene que salir completo: los desplegables armados (el evento
    // 'toggle' es asíncrono, así que el contenido se pinta a mano) y los
    // diagramas DIBUJADOS. Dibujarlos es asíncrono —mermaid se descarga la
    // primera vez— y el navegador no espera promesas entre 'beforeprint' y la
    // instantánea de la página. De ahí las dos vías: el botón "Imprimir" prepara
    // todo, espera y solo entonces llama a print(); Ctrl+P cae en onBeforePrint,
    // que al menos deja el código del diagrama a la vista. Las dos funciones
    // viven a nivel de módulo, con sus listeners registrados una sola vez.
    var printBtn = $("#ejPrint", main);
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        if (printBtn.disabled) return;
        printBtn.disabled = true;
        var texto = printBtn.title;
        printBtn.classList.add("is-busy");
        printBtn.title = "Preparando la impresión…";
        function imprimir() {
          printBtn.disabled = false;
          printBtn.classList.remove("is-busy");
          printBtn.title = texto;
          try { window.print(); } catch (e) {}
          restaurarAbiertos();
        }
        prepararImpresion()
          .then(function () { forzarClaro = true; return redibujarDiagramas(); })
          .then(function () {
            imprimir();
            // window.print() bloquea hasta que se cierra el diálogo: al volver,
            // los diagramas vuelven a la paleta del tema en pantalla
            forzarClaro = false;
            return redibujarDiagramas();
          })
          .catch(function () { forzarClaro = false; imprimir(); });
      });
    }

    var lookupBtn = $("#ejLookup", main);
    if (lookupBtn) {
      lookupBtn.addEventListener("click", function () { if (A.quickLookup) A.quickLookup.open(); });
    }

    // --- interruptor "Ocultar respuestas" (modo práctica, pe.exPractica) ---
    // Tapa la caja «Respuesta» y los bloques de resultado de cada ejercicio
    // hasta que se le marca un estado del semáforo. Es independiente de
    // "Mostrar las resoluciones": con las dos activas se lee el desarrollo sin
    // que el resultado quede a la vista. Todo el trabajo lo hace una clase en
    // la lista, así que no obliga a repintar los ejercicios.
    var pracBtn = $("#ejPractica", main);
    function pintarPractica(on) {
      listEl.classList.toggle("ej-practica", on);
      if (!pracBtn) return;
      pracBtn.classList.toggle("on", on);
      pracBtn.setAttribute("aria-pressed", on ? "true" : "false");
      // botón de icono: el rótulo viaja en title y aria-label
      pracBtn.title = practicaLabel(on);
      pracBtn.setAttribute("aria-label", practicaLabel(on));
    }
    if (pracBtn) {
      pracBtn.addEventListener("click", function () {
        var on = pracBtn.getAttribute("aria-pressed") !== "true";
        A.LS.set(LS_PRACTICA, on ? "on" : "off");
        pintarPractica(on);
      });
    }

    // Revela la respuesta de un ejercicio y la deja revelada: marcar el
    // semáforo es lo que la descubre, y volver después a "Sin resolver" no la
    // vuelve a tapar (ya se la vio). La transición breve la hace la hoja de
    // estilo con la clase pasajera 'ej-revelando'.
    function revelar(art) {
      if (!art || art.classList.contains("ej-rev")) return;
      art.classList.add("ej-rev");
      art.classList.add("ej-revelando");
      setTimeout(function () { art.classList.remove("ej-revelando"); }, 420);
    }

    // --- semáforo: estado por ejercicio ---
    listEl.addEventListener("click", function (ev) {
      var t = ev.target;
      // El marcador de respuesta oculta no revela nada por sí solo: lleva el
      // foco al semáforo del ejercicio, que es el que la descubre.
      var ver = (t && t.closest) ? t.closest("[data-ej-ver]") : null;
      if (ver && listEl.contains(ver)) {
        // El foco va al semáforo más cercano al marcador que se tocó: el del
        // encabezado si el marcador está bajo el enunciado, el del pie de la
        // resolución si estaba adentro. Así no salta la página al marcar.
        var artV = ver.closest(".ej-item");
        var zona = ver.closest(".ej-reso") ? ".ej-sem-foot" : ".ej-head";
        var foco = artV && ($(zona + " .ej-sem-b.on", artV) || $(zona + " .ej-sem-b", artV) ||
          $(".ej-head .ej-sem-b.on", artV) || $(".ej-head .ej-sem-b", artV));
        if (foco) foco.focus();
        return;
      }
      var b = (t && t.closest) ? t.closest("[data-ej-set]") : null;
      if (!b || !listEl.contains(b)) return;
      var art = b.closest(".ej-item"); if (!art) return;
      var id = art.dataset.ej, e = +b.dataset.ejSet || 0;
      // Volver a tocar el activo lo desmarca, pero SOLO con el puntero
      // (ev.detail > 0). Espacio y Enter llegan aquí como clics sintéticos con
      // detail 0, y en un radiogroup confirman el elegido: desmarcarlo ahí
      // contradecía el patrón ARIA y dejaba el foco en un botón no tabulable.
      if (ev.detail > 0 && getEstado(id) === e && e !== 0) e = 0;
      setEstado(id, e);
      A.markActivity();
      art.dataset.estado = String(e);
      if (e) revelar(art);
      $$("[data-ej-set]", art).forEach(function (x) {
        var on = (+x.dataset.ejSet) === e;
        x.classList.toggle("on", on);
        x.setAttribute("aria-checked", on ? "true" : "false");
        x.tabIndex = on ? 0 : -1;                  // roving tabindex: uno solo tabula
      });
      setUltimo(u, col, id);
      refresh();                                   // barra y contadores, in place
    });

    // Teclado del semáforo: las flechas mueven la selección dentro del grupo,
    // como en un radiogroup; Espacio y Enter los confirma el propio <button>.
    listEl.addEventListener("keydown", function (ev) {
      var b = (ev.target && ev.target.closest) ? ev.target.closest("[data-ej-set]") : null;
      if (!b || !listEl.contains(b)) return;
      var paso = (ev.key === "ArrowRight" || ev.key === "ArrowDown") ? 1
        : (ev.key === "ArrowLeft" || ev.key === "ArrowUp") ? -1 : 0;
      if (!paso) return;
      ev.preventDefault();
      var bs = $$("[data-ej-set]", b.parentNode);
      var n = bs[(bs.indexOf(b) + paso + bs.length) % bs.length];
      if (!n) return;
      n.focus();
      n.click();
    });

    // --- barra y contadores, sin volver a renderizar la vista ---
    function refresh() {
      var s = statsOf(list);
      if (barEl) {
        var segs = $$("i", barEl);
        EST_ORDEN.map(function (k) { return s[k]; }).forEach(function (n, i) {
          if (segs[i]) segs[i].style.width = pctW(n, list.length);
        });
      }
      if (txtEl) {
        txtEl.innerHTML = "<b>" + hechos(s) + "</b>/" + list.length;
        // el rótulo largo vive en el title del grupo, no en la mini barra
        var progEl = txtEl.parentNode;
        if (progEl && progEl.classList.contains("ej-prog")) progEl.title = progTitulo(s, list.length);
      }
      aplicarFiltro();
    }

    function aplicarFiltro() {
      var nq = norm(fQ), visibles = 0;
      arts.forEach(function (art) {
        var it = BY_ID[art.dataset.ej];
        var ok = true;
        if (fEstado !== "" && getEstado(art.dataset.ej) !== +fEstado) ok = false;
        if (ok && nq && it && haystack(it).indexOf(nq) < 0) ok = false;
        art.hidden = !ok;
        if (ok) visibles++;
      });
      // un grupo sin ejercicios visibles se oculta entero, título incluido
      $$(".ej-group", listEl).forEach(function (g) {
        g.hidden = !$$(".ej-item", g).some(function (a) { return !a.hidden; });
      });
      var filtrando = (fEstado !== "" || !!nq);
      if (countEl) {
        // dentro del campo de búsqueda hay lugar para «5/24» y no para la frase
        // entera, que se conserva en el title
        countEl.textContent = filtrando ? visibles + "/" + list.length : "";
        countEl.title = filtrando
          ? visibles + " de " + list.length + " ejercicio" + (list.length === 1 ? "" : "s") +
            " a la vista"
          : "";
      }
      if (vacioEl) vacioEl.hidden = !(filtrando && !visibles);
    }

    // Marca el botón del estado pedido y desmarca el resto, en la clase y en
    // aria-pressed: los dos tienen que moverse juntos.
    function marcarEstado(val) {
      $$("[data-ej-filtro]", main).forEach(function (x) {
        var on = x.dataset.ejFiltro === val;
        x.classList.toggle("on", on);
        x.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    function limpiarFiltros() {
      fEstado = ""; fQ = "";
      if (inputQ) inputQ.value = "";
      marcarEstado("");
      A.setQuery({ estado: null, q: null });
      aplicarFiltro();
    }
    var limpiarBtn = $("#ejLimpiar", main);
    if (limpiarBtn) limpiarBtn.addEventListener("click", limpiarFiltros);

    $$("[data-ej-filtro]", main).forEach(function (b) {
      b.addEventListener("click", function () {
        fEstado = b.dataset.ejFiltro;
        marcarEstado(fEstado);
        A.setQuery({ estado: fEstado === "" ? null : fEstado });
        aplicarFiltro();
      });
    });
    if (inputQ) {
      var timer = 0;
      inputQ.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          fQ = inputQ.value;
          A.setQuery({ q: fQ ? fQ : null });
          aplicarFiltro();
        }, 140);
      });
    }

    aplicarFiltro();

    // --- ancla ?ej=<id>: dejar el ejercicio a la vista, no sólo desplazar ---
    // Con el enunciado armado eager la lista ya no crece al desplazarse, así que
    // no hace falta prellenar nada: queda solo el corrimiento por la carga de
    // las tipografías, que se corrige repitiendo el ajuste unos cuadros y otra
    // vez cuando document.fonts.ready resuelve.
    function anclaOffset() {
      var cs = getComputedStyle(document.documentElement);
      var h = parseFloat(cs.getPropertyValue("--header-h")) || 0;
      var c = parseFloat(cs.getPropertyValue("--crumbs-h")) || 0;
      var st = $(".ej-toolbar", main);
      // en el teléfono la barra no es pegajosa: entonces no tapa nada
      var pega = 0;
      if (st) {
        try { pega = getComputedStyle(st).position === "sticky" ? st.getBoundingClientRect().height : 0; }
        catch (e) { pega = st.getBoundingClientRect().height; }
      }
      return h + c + pega + 14;
    }
    function irAlAncla(id) {
      var el = document.getElementById("ej-" + id);
      if (!el || !listEl.contains(el)) return;
      // el enlace manda sobre el filtro: si el ejercicio pedido está filtrado
      // (o su grupo entero está oculto) no se lo puede mostrar a medias
      var grupo = el.closest(".ej-group");
      if (el.hidden || (grupo && grupo.hidden)) limpiarFiltros();
      el.classList.add("is-target");

      // [bundle] En el baseline scrolleaba `window`. En la plataforma quien
      // scrollea es un contenedor del shell, así que hay que buscarlo: se sube
      // desde la raíz de la vista hasta el primer ancestro con desbordamiento
      // vertical propio; si no hay ninguno, se cae en `window` (baseline).
      var sc = scrollerDe(main);
      var cortado = false, estables = 0, t0 = Date.now();
      function fin() {
        ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.removeEventListener(ev, soltar); });
      }
      function soltar() { cortado = true; fin(); }   // si la persona se mueve, mandan sus manos
      ["wheel", "touchstart", "keydown"].forEach(function (ev) {
        window.addEventListener(ev, soltar, { passive: true });
      });
      // se corrige cuadro a cuadro hasta que la posición se queda quieta: las
      // tipografías de KaTeX terminan de cargar después del primer pintado y
      // mueven el documento varios cientos de píxeles
      function ubicar() {
        if (cortado || !document.body.contains(el)) { fin(); return; }
        var base = sc ? sc.getBoundingClientRect().top : 0;
        var y0 = scrollYDe(sc);
        var y = Math.max(0, Math.round(el.getBoundingClientRect().top - base + y0 - anclaOffset()));
        if (Math.abs(y - y0) > 1) { irA(sc, y); estables = 0; }
        else estables++;
        if (estables < 8 && Date.now() - t0 < 2000) requestAnimationFrame(ubicar);
        else fin();
      }
      requestAnimationFrame(ubicar);
      if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
        document.fonts.ready.then(function () {
          if (cortado) return;
          estables = 0; t0 = Date.now();
          ["wheel", "touchstart", "keydown"].forEach(function (ev) {
            window.addEventListener(ev, soltar, { passive: true });
          });
          requestAnimationFrame(ubicar);
        });
      }

      // El resalte es la única pista de dónde quedó el ejercicio dentro de un
      // documento largo: se mantiene hasta que la persona toca algo.
      setTimeout(function () {
        function apagar() {
          el.classList.remove("is-target");
          document.removeEventListener("pointerdown", apagar, true);
          document.removeEventListener("keydown", apagar, true);
        }
        document.addEventListener("pointerdown", apagar, true);
        document.addEventListener("keydown", apagar, true);
      }, 900);
    }
    // Después del render la vista restaura su scroll (core.js), así que el ancla
    // va después. El ?ej= se DEJA en el hash: es la dirección del ejercicio, y
    // borrarla hacía que copiar la URL de la barra, recargar o compartir el
    // enlace perdiera el destino. Para que Atrás siga bien, el ancla se aplica
    // sólo cuando la llegada es nueva: si core.js tiene un scroll guardado para
    // este hash estamos volviendo con Atrás y manda la lectura restaurada.
    var target = (A.parseRoute().query || {}).ej;
    // [bundle] sin argumento, `A.scrollFor()` pregunta por la ruta ACTUAL: en
    // la plataforma la dirección no viaja en el hash (`location.hash` es "").
    var vuelta = A.scrollFor() != null;
    if (target && !vuelta) setTimeout(function () { irAlAncla(target); }, 0);
  }

  // ---------------------------------------------------------------
  //  [bundle] PROGRESO DE LA UNIDAD — todos los ejercicios cuentan (N0-61)
  // ---------------------------------------------------------------
  // La barra de cada unidad suma las páginas leídas y los pasos que declaran
  // los bundles. Acá cada ejercicio de la unidad es un paso —los de la guía,
  // los de Lutzio, los de parciales y los de finales—, y está hecho cuando su
  // estado es 1, 2 o 3 (resuelto solo, con poca ayuda o con mucha), que es el
  // mismo criterio de `hechos()` en el resto de la vista.
  //
  // El destino de cada grupo es la ruta REAL del SPA de la colección: el
  // argumento de la vista viaja en `?arg=<unidad>/<coleccion>`, que es como lo
  // lee el anfitrión (`ToolHost`). El manifiesto declara `progress: true` para
  // que el bundle se cargue al entrar en la materia y la barra cuente aunque
  // nadie abra esta vista.
  //
  // Con un runtime viejo (sin `registerProgressProvider`) no se registra nada y
  // el bundle sigue funcionando igual: el progreso vuelve a ser solo páginas.
  if (typeof A.registerProgressProvider === "function") {
    var SLUG = (A.SUBJECT && A.SUBJECT.slug) || "";
    A.registerProgressProvider({
      id: "ejercicios",
      label: "ejercicios",
      stepsOf: function (u) {
        var pasos = [];
        colsOf(u).forEach(function (c) {
          var destino = "/m/" + SLUG + "/t/ejercicios?arg=" + encodeURIComponent(u + "/" + c.id);
          itemsOf(u, c.id).forEach(function (it) {
            pasos.push({
              id: it.id,
              label: "n.º " + numDe(it) + " · " + colCorto(c.id),
              done: getEstado(it.id) >= 1,
              group: colCorto(c.id),
              to: destino
            });
          });
        });
        return pasos;
      }
    });
  }
})();
