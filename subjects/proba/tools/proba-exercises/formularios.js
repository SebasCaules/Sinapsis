/* ============================================================
   formularios.js — vista "Formularios"

   Un APUNTE en LaTeX por unidad, no una grilla: portada \maketitle,
   secciones numeradas (4.1, 4.2…), y cada fórmula compuesta como una
   ecuación en display centrada a todo el ancho, con su rótulo run-in encima,
   su número de ecuación «(4.3)» contra el margen derecho y su nota debajo.
   Las familias de distribuciones siguen yendo en tablas booktabs, que es lo
   que hace el apunte impreso del proyecto. Toda la piel tipográfica viene de
   estudio/latex.css (clases .tex-*): aquí solo se arma el documento.

   Fuente de datos: window.FORMULAS (estudio/formulas-data.js, generado por
   build-formulas.py desde wiki/formularios/*.md). Es contenido LOCAL del
   proyecto, no entrada de usuario; aun así todo lo que se inyecta pasa por
   A.escapeHtml / A.rich / A.katex, que escapan.

   RUTAS
     #/formularios            todo el programa, unidad por unidad
     #/formularios/<unidad>   una sola unidad
     ?q=<texto>               filtro de búsqueda (queda en el hash)
     ?sel=1                   modo "mi hoja": solo las fórmulas marcadas
     ?f=<id>                  ancla: desplaza hasta esa fórmula y la resalta.
                              Vale tanto para una ecuación (.tex-eq[data-id])
                              como para una fila de tabla (tr[data-ids~=id]).
                              El parámetro se CONSERVA en el hash, igual que
                              ?ej= en la vista de ejercicios; si la búsqueda
                              activa esconde la fórmula pedida, se limpia la
                              búsqueda y se vuelve a componer el documento.

   ESTADO
     A.LS 'pe.formSel'  {idDeFormula: 1}   selección de "mi hoja" (persistente).
                        Al leerla se migra una sola vez: los ids que
                        build-formulas.py renombró se traducen con SEL_MIGRA y
                        los que ya no existen en el dataset se descartan.
     A.viewState("formularios").esenciales toggle "Solo esenciales" (de sesión)

   ACCIONES
     form-sel        alterna una fórmula o una fila de tabla en "mi hoja"
                     (data-ids: uno o varios ids separados por espacio)
     form-clear-sel  vacía "mi hoja" y sale del modo hoja
     form-print      imprime el documento visible (espera a que esté compuesto)
     form-print-all  va a #/formularios y lo imprime entero (ídem)

   DETALLES QUE NO SE VEN
     · Componer las 433 fórmulas lleva varios cuadros. Imprimir antes de que
       termine saca las fórmulas sin --fp, o sea a escala 1 y más anchas que la
       caja A4: por eso toda impresión pasa por whenReady().
     · La búsqueda distingue término largo (subcadena) de sigla o término de
       hasta tres letras (palabra entera). Sin eso, "IC" coincidía dentro de
       "estadístico", "binomial" y "condicional" y devolvía 193 de 433.
     · Las migas son las que arma core (crumbsFor): esta vista no las pisa,
       salvo cuando el argumento de la ruta no es una unidad.
     · Con la ecuación a todo el ancho, nueve de cada diez fórmulas entran sin
       tocar nada. Para el resto queda una sola red de seguridad: se mide el
       ancho natural una vez y se le baja el CUERPO a la caja (no se la
       deforma con transform: un transform no se descuenta del área
       desplazable y dejaba a .tex-eq, que la piel declara overflow-x:auto,
       con scrollWidth mayor que clientWidth). Se calculan DOS factores, --fs
       (pantalla, contra el ancho medido) y --fp (papel, contra la caja A4
       corregida por la diferencia de cuerpo entre pantalla y papel), porque
       el navegador no vuelve a ejecutar JS al imprimir.
     · El ajuste separa LECTURA de ESCRITURA: primero se limpian todas las
       cajas, después se miden todas de corrido y recién al final se escriben
       los factores. Medir y escribir de a una fórmula costaba un reflow por
       fórmula (más de mil layouts forzados en «todo el programa»).
     · La segunda pasada de ajuste (la que corre después de document.fonts.
       ready, porque KaTeX carga sus tipografías tarde y cambian los anchos) se
       saltea cuando las fuentes ya estaban cargadas y su cantidad no cambió:
       en una visita repetida no hay nada que remedir.
     · Las fórmulas que en realidad son prosa con matemática intercalada se
       componen como párrafo (.tex-para) y no como ecuación: partirlas es lo
       que hace un apunte, encogerlas las volvía ilegibles.
     · Las tablas de distribuciones se detectan solas: un tramo de fórmulas
       consecutivas donde todas tienen 'variante' y los pares nombre x variante
       forman una grilla completa se compone como tabla booktabs. Una tabla no
       se escala fórmula por fórmula: se le baja el cuerpo a TODA la tabla
       hasta que entra, lo que además la deja pareja.
     · "ver en el wiki" usa .wikilink[data-slug][data-anchor] (core.js), no un
       href con dos '#': el router no entiende un segundo '#' en el hash. El
       ancla la resuelve build-formulas.py contra los headings reales de la
       página destino; aquí solo se valida que exista y que NO sea un h1 (un h1
       es el principio de la página y el reader lo deja tapado por la barra).
     · La clase .print-emulate en <html> aplica las mismas reglas que
       @media print (formularios.css las repite en espejo) y estrecha la hoja
       a 178 mm: sirve para verificar la impresión desde una captura.
   ============================================================ */
(function () {
  "use strict";
  var A = window.App;
  if (!A) return;

  var DATA = (window.FORMULAS && window.FORMULAS.items) || [];
  var SEL_KEY = "pe.formSel";
  // Renombres de ids de fórmula: build-formulas.py cambió el sufijo de 16 filas
  // y fusionó una más (la nota «denominador n-1» de la varianza muestral). Sin
  // esta tabla, una «mi hoja» guardada con los ids viejos quedaba vacía. La
  // migración corre una sola vez por carga, dentro de getSel().
  var SEL_MIGRA = {
    "12-estadistica-descriptiva--desvio-formula": "12-estadistica-descriptiva--desvio-2",
    "12-estadistica-descriptiva--desvio-abs-medio-formula": "12-estadistica-descriptiva--desvio-abs-medio",
    "12-estadistica-descriptiva--iqr-formula": "12-estadistica-descriptiva--iqr",
    "12-estadistica-descriptiva--mad-formula": "12-estadistica-descriptiva--mad",
    "12-estadistica-descriptiva--media-formula-sin-agrupar": "12-estadistica-descriptiva--media-sin-agrupar",
    "12-estadistica-descriptiva--mediana-formula-sin-agrupar": "12-estadistica-descriptiva--mediana-sin-agrupar",
    "12-estadistica-descriptiva--rango-formula": "12-estadistica-descriptiva--rango",
    "12-estadistica-descriptiva--varianza-muestral-formula": "12-estadistica-descriptiva--varianza-muestral",
    "fractiles-de-uso-frecuente--0-01-1-cola": "fractiles-de-uso-frecuente--001-1-cola",
    "fractiles-de-uso-frecuente--0-01-2-colas": "fractiles-de-uso-frecuente--001-2-colas",
    "fractiles-de-uso-frecuente--0-025-1-cola": "fractiles-de-uso-frecuente--0025-1-cola",
    "fractiles-de-uso-frecuente--0-025-2-colas": "fractiles-de-uso-frecuente--0025-2-colas",
    "fractiles-de-uso-frecuente--0-05-1-cola": "fractiles-de-uso-frecuente--005-1-cola",
    "fractiles-de-uso-frecuente--0-05-2-colas": "fractiles-de-uso-frecuente--005-2-colas",
    "fractiles-de-uso-frecuente--0-10-1-cola": "fractiles-de-uso-frecuente--010-1-cola",
    "fractiles-de-uso-frecuente--0-10-2-colas": "fractiles-de-uso-frecuente--010-2-colas"
  };
  var selMigrado = false;
  var esc = A.escapeHtml;

  // Geometría del papel, en px de CSS (96 dpi). @page A4 con márgenes 14/16 mm.
  var MM = 96 / 25.4;
  var PAGE_W = (210 - 32) * MM;          // ancho útil de la caja de texto
  var PRINT_FS = 11 * 96 / 72;           // cuerpo del documento impreso, en px
  // Tope de encogido. La regla dura es que NADA desborde, así que el tope es
  // solo una red de seguridad contra un cálculo absurdo: manda el ajuste.
  // El peor caso medido (la Erlang, 1242 px de ancho natural) necesita 0.54
  // contra la caja A4.
  var MIN_FIT = 0.5;
  // Piso de legibilidad de las tablas EN PANTALLA. Con la tabla ancha sangrada
  // hasta el borde de la hoja, el peor caso medido (la tabla de la unidad 4 en
  // claustro, a 1280 px) necesita 0.718, así que el piso no llega a morder y
  // ninguna tabla desborda; si alguna lo pidiera, el piso manda y el
  // contenedor la desplaza en horizontal en vez de bajarla a 10 px.
  var SCREEN_MIN_FIT = 0.7;
  // Piso de legibilidad de una ECUACIÓN en pantalla. Por debajo de este factor
  // no se sigue encogiendo a ciegas: primero se intenta partir la fórmula en
  // renglones por sus \qquad o por las filas de su \begin{cases} (splitParts)
  // y, si no ofrece corte seguro, hacerla fluir como párrafo.
  var SPLIT_MIN = 0.7;
  var FLOW_RATIO = 1.6;                  // por encima de esto se intenta fluir
  var PROSE_MIN = 30;                    // letras de texto para componer como párrafo
  var CHUNK_TEX = 40;                    // fórmulas por cuadro al componer
  var BATCH_FROM = 60;                   // por debajo de esto se hace de una vez
  var NARROW = 760;                      // por debajo, las tablas pasan a filas

  // ---------------------------------------------------------------
  //  Normalización y búsqueda
  // ---------------------------------------------------------------
  // Normalización compartida con core.js (contrato público A.normText /
  // A.texPlain): minúsculas sin diacríticos, y texto buscable de una fórmula
  // sin barras, llaves ni \dfrac, para que "sqrt n" u "overline x" encuentren
  // la expresión aunque esté escrita en LaTeX. Antes había una copia local
  // idéntica; las dos normalizaciones tienen que envejecer juntas.
  var norm = A.normText, texPlain = A.texPlain;
  // Índice en dos niveles. El "propio" describe a la fórmula misma; el "amplio"
  // agrega los títulos de sección, que son frases largas compartidas por
  // decenas de fórmulas y solo sirven como respaldo cuando nada más coincide.
  var HAY = {}, HAY_W = {}, TOK = {}, TOK_W = {};
  function haystack(f) {
    if (HAY[f.id]) return HAY[f.id];
    var parts = [f.nombre, f.variante || "", f.cuando || "", (f.tags || []).join(" "),
      (f.condiciones || []).join(" "), texPlain(f.tex)];
    return (HAY[f.id] = norm(parts.join(" ")));
  }
  function haystackWide(f) {
    if (HAY_W[f.id]) return HAY_W[f.id];
    return (HAY_W[f.id] = haystack(f) + " " + norm((f.seccion || "") + " " + (f.subseccion || "")));
  }
  // Palabras sueltas del texto buscable, para las siglas (ver `terms`).
  var WORDSEP = /[^a-z0-9]+/;
  function tokset(h) {
    var set = {}, parts = h.split(WORDSEP), i;
    for (i = 0; i < parts.length; i++) if (parts[i]) set[parts[i]] = 1;
    return set;
  }
  function tokens(f) { return TOK[f.id] || (TOK[f.id] = tokset(haystack(f))); }
  function tokensWide(f) { return TOK_W[f.id] || (TOK_W[f.id] = tokset(haystackWide(f))); }

  // Un término corto ("IC", "z", "MV") o escrito como sigla en mayúsculas se
  // busca como PALABRA ENTERA: por subcadena, "ic" aparece dentro de
  // "estadístico", "binomial", "típica" y "condicional", y devolvía 193 de las
  // 434 fórmulas. Los términos largos siguen buscándose por subcadena, que es
  // lo que hace útil escribir media parte de una palabra.
  var SIGLA = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9]*$/;
  function terms(q) {
    var raw = String(q == null ? "" : q).split(/\s+/), out = [], i;
    for (i = 0; i < raw.length; i++) {
      if (!raw[i]) continue;
      var t = norm(raw[i]);
      if (!t) continue;
      out.push({ t: t, whole: t.length <= 3 || SIGLA.test(raw[i]) });
    }
    return out;
  }
  function matchesIn(h, toks, ts) {
    for (var i = 0; i < ts.length; i++) {
      if (ts[i].whole) { if (!toks[ts[i].t]) return false; }
      else if (h.indexOf(ts[i].t) < 0) return false;
    }
    return true;
  }
  function matchesF(f, ts, wide) {
    if (!ts.length) return true;
    return wide ? matchesIn(haystackWide(f), tokensWide(f), ts)
      : matchesIn(haystack(f), tokens(f), ts);
  }
  // Resalta las coincidencias sobre texto plano; devuelve HTML ya escapado.
  // Los términos de palabra entera solo se marcan en un límite de palabra.
  function isWordChar(c) { return !!c && !WORDSEP.test(c); }
  function hl(text, ts) {
    var t = String(text == null ? "" : text);
    if (!ts || !ts.length) return esc(t);
    var n = norm(t);
    if (n.length !== t.length) return esc(t);   // normalizar movió índices: no arriesgar
    var out = "", i = 0;
    while (i < n.length) {
      var best = -1, bl = 0;
      for (var k = 0; k < ts.length; k++) {
        var p = i;
        for (;;) {
          p = n.indexOf(ts[k].t, p);
          if (p < 0) break;
          if (!ts[k].whole ||
              (!isWordChar(n.charAt(p - 1)) && !isWordChar(n.charAt(p + ts[k].t.length)))) break;
          p += 1;
        }
        if (p < 0) continue;
        if (best < 0 || p < best || (p === best && ts[k].t.length > bl)) { best = p; bl = ts[k].t.length; }
      }
      if (best < 0) break;
      out += esc(t.slice(i, best)) + '<mark class="fm-hl">' + esc(t.slice(best, best + bl)) + "</mark>";
      i = best + bl;
    }
    return out + esc(t.slice(i));
  }
  // El nombre puede traer $matemática$: en ese caso se renderiza con rich() y no
  // se resalta (no se puede marcar dentro del HTML de KaTeX sin romperlo).
  function richOrHl(text, ts) {
    return /\$/.test(String(text || "")) ? A.rich(text) : hl(text, ts);
  }

  // ---------------------------------------------------------------
  //  Unidades
  // ---------------------------------------------------------------
  var COUNT_BY_UNIT = {};
  DATA.forEach(function (f) { COUNT_BY_UNIT[f.unidad] = (COUNT_BY_UNIT[f.unidad] || 0) + 1; });
  // Las nueve unidades del programa más Complementos, tenga o no fórmulas:
  // la fila de pestañas refleja el programa, no lo que hay cargado.
  var ALWAYS = { "0": 1 };
  var UNIT_KEYS = A.UNITS.map(function (u) { return u.key; })
    .filter(function (k) { return k !== "eval" && (COUNT_BY_UNIT[k] || ALWAYS[k]); });
  var IS_UNIT = {};
  UNIT_KEYS.forEach(function (k) { IS_UNIT[k] = 1; });

  function unitLabel(k) { return k === "otras" ? "Transversales" : A.unitMeta(k).name; }
  function unitTab(k) { return k === "0" ? "Complementos" : k === "otras" ? "Transv." : "U" + k; }
  // El título de pestaña y del dock usa el MISMO nombre que el H1 y la miga:
  // «Complementos Matemáticos» venía en minúscula y discrepaba de A.unitMeta.
  function unitTitle(k) {
    return k === "0" ? A.unitMeta("0").name
      : k === "otras" ? "Transversales" : "Unidad " + k;
  }
  // Numeral que encabeza secciones y ecuaciones: «4.1», «(4.3)». Complementos
  // y Transversales no tienen número de unidad, así que llevan una letra.
  function unitNum(k) { return k === "0" ? "C" : k === "otras" ? "T" : String(k); }

  // ---------------------------------------------------------------
  //  Anclas del enlace "→ wiki"
  //  build-formulas.py ya resuelve el ancla contra los headings REALES de la
  //  página destino (tiene data.js a mano) y deja "" cuando no hay ninguno
  //  razonable. Aquí solo se valida: el ancla tiene que existir en la página y
  //  ser de nivel 2 o más. Un h1 es el principio de la página —no aporta— y
  //  además el reader lo desplaza bajo el encabezado fijo, que lo tapa.
  // ---------------------------------------------------------------
  var ANCHOR_CACHE = {};
  function resolveAnchor(page, ancla) {
    if (!ancla || !page || !page.headings || !page.headings.length) return "";
    var key = page.slug + " " + ancla;
    if (ANCHOR_CACHE[key] != null) return ANCHOR_CACHE[key];
    var hs = page.headings, i, ok = "";
    for (i = 0; i < hs.length; i++) {
      if (hs[i].id === ancla && (hs[i].level == null || hs[i].level >= 2)) { ok = hs[i].id; break; }
    }
    return (ANCHOR_CACHE[key] = ok);
  }
  function wikiLink(f) {
    var page = f.slug && A.BY_SLUG[f.slug] ? A.BY_SLUG[f.slug] : null;
    if (!page) return "";
    var anchor = resolveAnchor(page, f.ancla);
    return '<a class="fm-wiki wikilink no-print" href="#/p/' + esc(f.slug) + '" data-slug="' + esc(f.slug) + '"' +
      (anchor ? ' data-anchor="' + esc(anchor) + '"' : "") + ' title="Ver en el wiki">&rarr; wiki</a>';
  }

  // ---------------------------------------------------------------
  //  Selección ("mi hoja")
  // ---------------------------------------------------------------
  // Devuelve la selección ya migrada: traduce los ids renombrados y descarta
  // los que ya no existen en el dataset. Solo se graba si algo cambió.
  function getSel() {
    var sel = A.LS.getObj(SEL_KEY);
    if (selMigrado) return sel;
    selMigrado = true;
    var vivos = {}, hayVivos = false;
    DATA.forEach(function (f) { vivos[f.id] = 1; hayVivos = true; });
    var cambio = false;
    Object.keys(sel).forEach(function (k) {
      var nuevo = SEL_MIGRA[k];
      if (nuevo) {
        delete sel[k];
        if (!(nuevo in sel) && (!hayVivos || vivos[nuevo])) sel[nuevo] = 1;
        cambio = true;
      } else if (hayVivos && !vivos[k]) {
        delete sel[k];
        cambio = true;
      }
    });
    if (cambio) setSel(sel);
    return sel;
  }
  function setSel(o) { A.LS.set(SEL_KEY, o); }
  function selCount() { return Object.keys(getSel()).length; }
  // Una fila de tabla se marca entera (sus 4-5 columnas son 4-5 fórmulas), así
  // que un clic puede sumar 5 al contador. Se cuentan también las ENTRADAS
  // marcadas para poder aclararlo en el rótulo.
  function selEntries(sel) {
    var seen = {}, n = 0;
    DATA.forEach(function (f) {
      if (!sel[f.id]) return;
      var k = f.variante
        ? (f.unidad + "|" + f.seccion + "|" + f.subseccion + "|" + f.nombre) : f.id;
      if (seen[k]) return;
      seen[k] = 1; n++;
    });
    return n;
  }

  // ---------------------------------------------------------------
  //  Prosa con matemática: componerla como párrafo, no como ecuación
  //  Unos pocos ítems del dataset son una frase larga en \text{...} con
  //  expresiones intercaladas. Como una fórmula en display no corta línea,
  //  escalarla es la única salida y quedan ilegibles. Se parten en fragmentos
  //  (texto como texto, matemática como KaTeX en línea) y fluyen en varias
  //  líneas. Si el corte no es seguro se devuelve "" y no se toca nada.
  // ---------------------------------------------------------------
  var TEXCMD = /^\\(text|textbf|textit|textrm|mathrm)\{/;
  var FLOW_CACHE = {}, FLOW_N = {};
  function unescapeText(t) {
    return String(t)
      .replace(/\\[ ,;!]/g, " ").replace(/~/g, " ")
      .replace(/\\([%&$#_{}])/g, "$1");
  }
  // Un entorno (\begin{cases}…), una alineación (&, \\) o una llave grande
  // no sobreviven al corte: cada fragmento se compone por separado y a KaTeX
  // le llega LaTeX incompleto. Esas expresiones no se parten nunca.
  var NOSPLIT = /\\begin\{|\\end\{|\\\\|&/;
  function flowSegs(tex) {
    var s = String(tex || ""), out = [], i = 0, buf = "", depth = 0, ld = 0;
    if (NOSPLIT.test(s)) return null;
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === "\\") {
        var rest = s.slice(i);
        var lr = /^\\(left|right)\b/.exec(rest);
        if (lr) { ld += lr[1] === "left" ? 1 : -1; buf += lr[0]; i += lr[0].length; continue; }
        var m = TEXCMD.exec(rest);
        if (m && depth === 0 && ld === 0) {
          var j = i + m[0].length, d = 1;
          while (j < s.length && d > 0) {
            var ch = s.charAt(j);
            if (ch === "\\") { j += 2; continue; }
            if (ch === "{") d++; else if (ch === "}") d--;
            j++;
          }
          if (d !== 0) return null;                       // llaves desbalanceadas
          var inner = s.slice(i + m[0].length, j - 1);
          // el texto solo puede traer escapes simples: si hay comandos, no se toca
          if (/[{}]/.test(inner) || /\\[^ ,;!%&$#_{}]/.test(inner)) return null;
          if (buf.trim()) out.push({ t: "m", v: buf });
          buf = "";
          out.push({ t: "t", v: unescapeText(inner), b: m[1] === "textbf" });
          i = j; continue;
        }
        buf += s.charAt(i) + (s.charAt(i + 1) || ""); i += 2; continue;
      }
      if (c === "{") depth++; else if (c === "}") depth--;
      buf += c; i++;
    }
    if (buf.trim()) out.push({ t: "m", v: buf });
    return out;
  }
  function flowHtml(tex) {
    if (!tex) return "";
    if (FLOW_CACHE[tex] != null) return FLOW_CACHE[tex];
    var segs = flowSegs(tex);
    var html = "", chars = 0;
    if (segs && segs.length > 1) {
      segs.forEach(function (g) { if (g.t === "t") chars += g.v.replace(/\s+/g, "").length; });
      if (chars >= 18) {
        html = segs.map(function (g) {
          if (g.t === "t") {
            var txt = esc(g.v).replace(/^ /, "&nbsp;").replace(/ $/, "&nbsp;");
            return g.b ? "<b>" + txt + "</b>" : txt;
          }
          return A.katex(g.v, false);
        }).join("");
      }
    }
    FLOW_N[tex] = chars;
    return (FLOW_CACHE[tex] = html);
  }
  // Un ítem se compone DIRECTAMENTE como párrafo cuando es sobre todo prosa:
  // en un apunte una frase con matemática intercalada no es una ecuación en
  // display, es un párrafo. El resto se compone como ecuación y solo fluye si
  // al medir no entra (red de seguridad, ver applyFit).
  function proseHtml(tex) {
    var h = flowHtml(tex);
    return (h && (FLOW_N[tex] || 0) >= PROSE_MIN) ? h : "";
  }

  // ---------------------------------------------------------------
  //  Corte en renglones (red de seguridad de ancho, ANTES de encoger)
  //  En pantalla angosta unas pocas ecuaciones no entran ni encogidas a un
  //  cuerpo legible: dos \boxed{} separados por \qquad, una cadena de
  //  igualdades con \qquad, o un \begin{cases} de tres filas. En vez de
  //  bajarlas a 9 px se parten por donde la fórmula YA trae una separación:
  //  los \qquad/\quad de primer nivel, o las filas del cases (a cada fila se
  //  le repite lo que venía antes de la llave, que es lo que un apunte
  //  escribiría al desarmarla). Cada renglón se compone como su propia
  //  ecuación en display y no se parte solo (formularios.css le pone
  //  white-space: nowrap), así que el corte cae donde tiene sentido y nunca a
  //  mitad de un término. Si la fórmula no ofrece ningún punto de corte
  //  seguro se devuelve null y manda el encogido de siempre.
  // ---------------------------------------------------------------
  var SPLIT_CACHE = {};
  var SPACE_CMD = /^\\(qquad|quad)(?![a-zA-Z])/;
  var LEFTRIGHT = /^\\(left|right)(?![a-zA-Z])/;

  // Tramos separados por \qquad/\quad de PRIMER nivel (fuera de llaves y de
  // un par \left…\right). Un entorno no se toca: sus filas las parte casesParts.
  function spaceParts(tex) {
    var s = String(tex || "");
    if (/\\begin\{|\\end\{/.test(s)) return null;
    var out = [], buf = "", depth = 0, ld = 0, i = 0, m;
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === "\\") {
        var rest = s.slice(i);
        m = SPACE_CMD.exec(rest);
        if (m && depth === 0 && ld === 0) { out.push(buf); buf = ""; i += m[0].length; continue; }
        m = LEFTRIGHT.exec(rest);
        if (m) { ld += m[1] === "left" ? 1 : -1; buf += m[0]; i += m[0].length; continue; }
        buf += c + (s.charAt(i + 1) || ""); i += 2; continue;
      }
      if (c === "{") depth++; else if (c === "}") depth--;
      buf += c; i++;
    }
    out.push(buf);
    out = out.map(trimTex).filter(Boolean);
    return out.length > 1 ? out : null;
  }
  function trimTex(t) { return String(t).replace(/^[\s]+|[\s]+$/g, ""); }

  // Corta una cadena por un separador de primer nivel (\\ para las filas del
  // cases, & para sus columnas), respetando llaves y \left…\right.
  function topSplit(s, re) {
    var out = [], buf = "", depth = 0, ld = 0, i = 0, m;
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === "\\") {
        var rest = s.slice(i);
        m = re.exec(rest);
        if (m && depth === 0 && ld === 0) { out.push(buf); buf = ""; i += m[0].length; continue; }
        m = LEFTRIGHT.exec(rest);
        if (m) { ld += m[1] === "left" ? 1 : -1; buf += m[0]; i += m[0].length; continue; }
        buf += c + (s.charAt(i + 1) || ""); i += 2; continue;
      }
      if (c === "&" && depth === 0 && ld === 0 && re === AMP) { out.push(buf); buf = ""; i++; continue; }
      if (c === "{") depth++; else if (c === "}") depth--;
      buf += c; i++;
    }
    out.push(buf);
    return out;
  }
  var ROW_SEP = /^\\\\(\s*\[[^\]]*\])?/;   // «\\» de fila, con su espaciado opcional
  var AMP = /^$/;                          // marcador: topSplit corta por «&»

  var CASES = /^([\s\S]*?)\\begin\{cases\}([\s\S]*)\\end\{cases\}([\s\S]*)$/;
  function casesParts(tex) {
    var m = CASES.exec(String(tex || ""));
    if (!m) return null;
    var pre = trimTex(m[1]), post = trimTex(m[3]);
    // Lo de afuera de la llave se repite en cada renglón: tiene que ser simple.
    if (/\\begin\{|\\end\{|&|\\\\/.test(pre + post)) return null;
    var rows = topSplit(m[2], ROW_SEP).map(trimTex).filter(Boolean);
    if (rows.length < 2) return null;
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var cols = topSplit(rows[i], AMP).map(trimTex);
      if (cols.length > 2) return null;                 // fila que no es «valor & condición»
      var t = pre + cols[0] + (cols[1] ? "\\quad " + cols[1] : "");
      if (i === rows.length - 1) t += post;
      out.push(trimTex(t));
    }
    return out;
  }

  // Cadena de igualdades: «V(X)=σ²=E[…]=∫…≥0» se parte por sus relaciones de
  // primer nivel y cada renglón EMPIEZA con la relación, como se escribe una
  // ecuación larga en un apunte. Es el último corte que se intenta, porque es
  // el que más cambia el aspecto de la fórmula. Aquí los paréntesis y
  // corchetes también cuentan como nivel: sin eso, el «>» de «P(X > x)» se
  // tomaba por relación de primer nivel.
  var REL_CMD = /^\\(le|leq|ge|geq|ne|neq|approx|equiv|Rightarrow|Leftrightarrow|implies|iff|propto|sim)(?![a-zA-Z])/;
  var REL_CHAR = /[=<>]/;
  function relParts(tex) {
    var s = String(tex || "");
    if (/\\begin\{|\\end\{|&|\\\\/.test(s)) return null;
    var out = [], buf = "", depth = 0, ld = 0, i = 0, m;
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === "\\") {
        var rest = s.slice(i);
        m = REL_CMD.exec(rest);
        if (m && depth === 0 && ld === 0 && buf.trim()) {
          out.push(buf); buf = m[0]; i += m[0].length; continue;
        }
        m = LEFTRIGHT.exec(rest);
        if (m) { ld += m[1] === "left" ? 1 : -1; buf += m[0]; i += m[0].length; continue; }
        buf += c + (s.charAt(i + 1) || ""); i += 2; continue;
      }
      if (REL_CHAR.test(c) && depth === 0 && ld === 0 && buf.trim()) {
        out.push(buf); buf = c; i++; continue;
      }
      if (c === "{" || c === "(" || c === "[") depth++;
      else if (c === "}" || c === ")" || c === "]") depth--;
      buf += c; i++;
    }
    out.push(buf);
    out = out.map(trimTex).filter(Boolean);
    // Un tramo de uno o dos caracteres («= 0») no es un renglón: si aparece,
    // el corte no vale la pena.
    if (out.length < 2) return null;
    for (i = 0; i < out.length; i++) if (out[i].length < 3) return null;
    return out;
  }

  function splitParts(tex) {
    if (SPLIT_CACHE[tex] === undefined) {
      SPLIT_CACHE[tex] = spaceParts(tex) || casesParts(tex) || relParts(tex) || null;
    }
    return SPLIT_CACHE[tex];
  }
  // Cada renglón guarda su propio LaTeX: si al medirlo sigue sin entrar, se lo
  // vuelve a partir (una fila de cases larga todavía puede ceder por el \quad
  // que separa el valor de su condición).
  // Cada tramo tiene que ser LaTeX válido POR SÍ SOLO: KaTeX no lanza (va con
  // throwOnError:false) sino que pinta el error en rojo, así que se lo busca
  // en el html. Si alguno falla, el corte no vale y devuelve "" (manda el
  // camino de siempre: fluir o encoger).
  function splitHtml(parts) {
    var html = "", one, i;
    for (i = 0; i < parts.length; i++) {
      one = A.katex(parts[i], true);
      if (one.indexOf("katex-error") >= 0) return "";
      html += '<span class="fm-row" data-t="' + esc(parts[i]) + '">' + one + "</span>";
    }
    return html;
  }

  // ---------------------------------------------------------------
  //  Composición: agrupar en unidades, secciones y subsecciones
  // ---------------------------------------------------------------
  // Los títulos de sección del formulario maestro vienen con su propio número
  // ("3 · Distribuciones discretas"). Se lo quita y se renumera por unidad.
  var SECNUM = new RegExp("^\\s*\\d+\\s*·\\s*");
  function cleanSec(s) { return String(s || "").replace(SECNUM, ""); }

  function groupUnits(items) {
    var map = {}, out = [];
    items.forEach(function (f) {
      var u = map[f.unidad];
      if (!u) { u = map[f.unidad] = { unidad: f.unidad, secs: [], byName: {}, n: 0 }; out.push(u); }
      u.n++;
      var s = u.byName[f.seccion];
      if (!s) {
        s = u.byName[f.seccion] = { titulo: cleanSec(f.seccion), subs: [], bySub: {} };
        u.secs.push(s);
      }
      var subKey = f.subseccion || "";
      var sub = s.bySub[subKey];
      if (!sub) { sub = s.bySub[subKey] = { titulo: subKey, items: [] }; s.subs.push(sub); }
      sub.items.push(f);
    });
    out.sort(function (a, b) {
      var ua = A.unitOrder[a.unidad], ub = A.unitOrder[b.unidad];
      return (ua == null ? 99 : ua) - (ub == null ? 99 : ub);
    });
    return out;
  }

  // Un tramo de fórmulas consecutivas, todas con 'variante', cuyos pares
  // nombre x variante forman una grilla casi completa se compone como tabla.
  var PROSA = /\\text(bf|it|rm)?\{[^{}]{16,}/;
  function tableOf(run) {
    if (run.length < 4) return null;
    var names = [], vars = [], cell = {}, i, f;
    for (i = 0; i < run.length; i++) {
      f = run[i];
      if (!f.variante) return null;
      if (names.indexOf(f.nombre) < 0) names.push(f.nombre);
      if (vars.indexOf(f.variante) < 0) vars.push(f.variante);
      var key = f.nombre + " " + f.variante;
      if (cell[key]) return null;                       // par repetido: no es grilla
      cell[key] = f;
    }
    if (vars.length < 2 || vars.length > 5) return null;
    if (names.length < 2 && vars.length < 3) return null;
    if (run.length / (names.length * vars.length) < 0.75) return null;
    // Una celda con una frase larga no entra en una columna estrecha: si el
    // tramo es sobre todo prosa, se compone como ecuaciones sueltas.
    var prosa = 0;
    for (i = 0; i < run.length; i++) if (PROSA.test(run[i].tex)) prosa++;
    if (prosa / run.length > 0.3) return null;
    return { names: names, vars: vars, cell: cell };
  }

  // Parte los ítems de una subsección en bloques: tablas y ecuaciones sueltas.
  function blocksOf(items) {
    var out = [], run = [], loose = [];
    function flushLoose() {
      if (loose.length) { out.push({ kind: "filas", items: loose.slice() }); loose = []; }
    }
    function flushRun() {
      if (!run.length) return;
      var t = tableOf(run);
      if (t) { flushLoose(); out.push({ kind: "tabla", tabla: t }); }
      else loose = loose.concat(run);
      run = [];
    }
    items.forEach(function (f) {
      if (f.variante) { run.push(f); return; }
      flushRun();
      loose.push(f);
    });
    flushRun();
    flushLoose();
    return out;
  }

  // ---------------------------------------------------------------
  //  Vista
  // ---------------------------------------------------------------
  var ctx = null;      // contexto del render actual
  var TEX = [];        // fórmulas pendientes de componer, por índice
  var EQN = 0;         // numerador correlativo de ecuaciones, por unidad
  var raf = 0;

  // ---------------------------------------------------------------
  //  "Documento listo"
  //  Componer y medir 433 fórmulas por lotes lleva varios cuadros. Quien
  //  imprima antes se lleva las fórmulas SIN --fp, o sea a escala 1: casi un
  //  centenar más anchas que la caja A4. Cualquiera que dispare window.print()
  //  espera aquí.
  // ---------------------------------------------------------------
  var docReady = false, readyCbs = [];
  function markBusy() { docReady = false; }
  function markReady() {
    docReady = true;
    var cbs = readyCbs; readyCbs = [];
    cbs.forEach(function (f) { try { f(); } catch (e) {} });
  }
  // El tope de seguridad evita que un fallo al medir deje el botón mudo.
  function whenReady(fn, ms) {
    if (docReady) { fn(); return; }
    var done = false;
    function once() { if (done) return; done = true; fn(); }
    readyCbs.push(once);
    setTimeout(once, ms || 5000);
  }
  function printWhenReady() {
    whenReady(function () { try { window.print(); } catch (e) {} });
  }

  A.registerView("formularios", function (main, arg) {
    var r = A.parseRoute();
    var unitArg = String(arg || "").split("/")[0];
    var unit = IS_UNIT[unitArg] ? unitArg : "";
    var vs = A.viewState("formularios");

    ctx = {
      main: main,
      unit: unit,
      q: r.query.q || "",
      sel: r.query.sel === "1",
      esenciales: !!vs.esenciales,
      vs: vs
    };

    // [bundle] el título de la pestaña lo compone el ANFITRIÓN (herr-10).
    if (A.setTitle) A.setTitle(unit ? "Formulario · " + unitTitle(unit) : "Formularios");
    // Las migas por omisión de core ya son las correctas y las mismas que en el
    // resto de la app: «Inicio › Consultar › Formularios» y, con unidad,
    // «Inicio › Formularios › U8 · Inferencia Estadística». Solo se pisan
    // cuando el argumento de la ruta no es una unidad, porque ahí core
    // mostraría el texto crudo del argumento.
    // [bundle] `A.crumbsFor` es del core del baseline (conoce su navegación
    // entera) y no está en el runtime: las dos migas que hacían falta acá se
    // escriben a mano, con la misma forma que las demás vistas del bundle.
    // [bundle] con unidad, el anfitrión solo sabe llegar hasta «Formularios»:
    // el tramo de la unidad («U5 · Función de V.A. y Bidimensionales», que el
    // core del baseline agregaba solo) lo escribe la vista, que es la única que
    // sabe qué unidad está mostrando.
    if (unit) {
      A.setCrumbs([
        { label: "Inicio", hash: "#/inicio" },
        { label: "Formularios", hash: "#/formularios" },
        { label: (unit === "otras" ? "Transv." : A.unitShort(unit)) + " · " + unitLabel(unit) },
      ]);
    } else if (arg) {
      A.setCrumbs([{ label: "Inicio", hash: "#/inicio" }, { label: "Formularios" }]);
    }

    main.innerHTML =
      '<div class="fm">' +
        '<nav class="fm-bar no-print" aria-label="Formularios">' + barHtml() + "</nav>" +
        '<div class="fm-doc" id="fmDoc"></div>' +
      "</div>";

    wireBar();
    renderDoc();

    var target = r.query.f || "";
    if (target) {
      // Dos intentos: uno apenas compuesto el HTML (la fórmula ya existe en el
      // DOM aunque la matemática todavía no esté puesta) y otro cuando el
      // documento terminó de medirse, porque el ajuste mueve el alto.
      irAFormula(target);
      whenReady(function () { irAFormula(target); }, 6000);
    }
  });

  // ------------------------------ barra ------------------------------
  function tabCount(n) {
    return '<span class="fm-tab-n">' + n + "</span>";
  }
  function tabTitle(k) {
    var n = COUNT_BY_UNIT[k] || 0;
    var t = unitTitle(k), l = unitLabel(k);
    return (norm(t) === norm(l) ? t : t + " · " + l) + " · " +
      (n ? n + (n === 1 ? " fórmula" : " fórmulas") : "sin fórmulas todavía");
  }
  function barHtml() {
    var tabs = UNIT_KEYS.map(function (k) {
      var on = ctx.unit === k, n = COUNT_BY_UNIT[k] || 0;
      return '<a class="fm-tab' + (on ? " on" : "") + (n ? "" : " zero") +
        '" href="' + esc(unitHref(k)) + '" data-nav' + (on ? ' aria-current="page"' : "") +
        (n ? "" : ' aria-disabled="true"') +
        ' title="' + esc(tabTitle(k)) + '">' + esc(unitTab(k)) + tabCount(n) + "</a>";
    }).join("");

    return '<div class="fm-tabs">' + tabs +
        '<a class="fm-tab all' + (ctx.unit ? "" : " on") + '" href="' + esc(unitHref("")) + '" data-nav' +
          (ctx.unit ? "" : ' aria-current="page"') +
          ' title="' + esc("Todo el programa · " + DATA.length + " fórmulas") + '">Todo el programa' +
          tabCount(DATA.length) + "</a>" +
      "</div>" +
      '<div class="fm-tools">' +
        '<label class="fm-q"><span class="fm-q-ico">' + A.icon("search", 14) + "</span>" +
          '<input type="search" id="fmQ" placeholder="Buscar fórmula" autocomplete="off" ' +
            'spellcheck="false" aria-label="Buscar fórmulas" value="' + esc(ctx.q) + '" /></label>' +
        '<label class="fm-ess"><input type="checkbox" id="fmEss"' + (ctx.esenciales ? " checked" : "") +
          " /><span>Solo esenciales</span></label>" +
      "</div>";
  }

  // Los enlaces de unidad conservan la búsqueda y el modo "mi hoja".
  function unitHref(k) {
    var qs = [];
    if (ctx.q) qs.push("q=" + encodeURIComponent(ctx.q));
    if (ctx.sel) qs.push("sel=1");
    return "#/formularios" + (k ? "/" + k : "") + (qs.length ? "?" + qs.join("&") : "");
  }

  function wireBar() {
    var input = document.getElementById("fmQ");
    var ess = document.getElementById("fmEss");
    if (input) {
      var t = 0;
      input.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () { applyQuery(input.value); }, 170);
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.preventDefault(); input.value = ""; applyQuery(""); }
      });
    }
    if (ess) ess.addEventListener("change", function () {
      ctx.esenciales = !!ess.checked;
      ctx.vs.esenciales = ctx.esenciales;
      renderDoc();
    });
  }

  function applyQuery(v) {
    var val = String(v || "").trim();
    if (val === ctx.q) return;
    ctx.q = val;
    A.setQuery({ q: val || null });
    updateTabHrefs();
    renderDoc();
  }

  function updateTabHrefs() {
    A.$$(".fm-tab", ctx.main).forEach(function (a, i) {
      a.setAttribute("href", unitHref(i < UNIT_KEYS.length ? UNIT_KEYS[i] : ""));
    });
  }

  // ---------------------------- documento ----------------------------
  // withEss=false devuelve el recorte SIN el filtro "Solo esenciales": es el
  // denominador honesto del contador ("10 de 55", no "10 de 10").
  function baseItems(withEss) {
    var sel = ctx.sel ? getSel() : null;
    return DATA.filter(function (f) {
      if (ctx.unit && f.unidad !== ctx.unit) return false;
      if (sel && !sel[f.id]) return false;
      if (withEss !== false && ctx.esenciales && !f.esencial) return false;
      return true;
    });
  }

  // ¿Hay que recurrir al respaldo por título de sección? Se decide una sola vez
  // por render, sobre todo el dataset.
  function wideNeeded(ts) {
    if (!ts.length) return false;
    var sel = ctx.sel ? getSel() : null;
    for (var i = 0; i < DATA.length; i++) {
      var f = DATA[i];
      if (sel && !sel[f.id]) continue;
      if (ctx.esenciales && !f.esencial) continue;
      if (matchesIn(haystack(f), tokens(f), ts)) return false;
    }
    return true;
  }

  function isNarrow() { return window.innerWidth < NARROW; }

  function renderDoc() {
    var host = document.getElementById("fmDoc");
    if (!host) return;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    markBusy();
    TEX = [];

    var ts = terms(ctx.q);
    var wide = wideNeeded(ts);
    var all = baseItems();
    var shown = ts.length ? all.filter(function (f) { return matchesF(f, ts, wide); }) : all;
    // Cuando algo está filtrado, una tabla mostraría solo parte de su grilla:
    // en ese caso todo se compone como ecuaciones sueltas. Lo mismo en pantalla
    // angosta, donde una columna de tabla no da ni para encoger la expresión.
    var partial = ts.length > 0 || ctx.esenciales || ctx.sel || isNarrow();
    var units = groupUnits(shown);
    var sel = getSel();
    var total = baseItems(false).length;

    var html;
    if (!shown.length) {
      // Con la portada fuera (no hay documento), sin esta barra el modo «mi
      // hoja» vacío dejaba al usuario sin ningún camino de vuelta.
      html = '<div class="fm-acts no-print">' + actionsHtml() + "</div>" +
        '<div class="fm-empty">' + emptyHtml() + "</div>";
    } else {
      html = units.map(function (u, i) {
        return sheetHtml(u, ts, sel, partial, i === 0, shown.length, total, wide);
      }).join("");
    }
    host.innerHTML = html;
    host.classList.toggle("picking", ctx.sel);
    wasNarrow = isNarrow();

    if (!shown.length) { markReady(); return; }
    composeTex(host);
  }

  // Enlace de salida del modo «mi hoja» / de la búsqueda, conservando la unidad.
  function allHref() {
    return "#/formularios" + (ctx.unit ? "/" + ctx.unit : "");
  }
  function emptyHtml() {
    if (ctx.sel) return A.emptyState("Su hoja está vacía.",
      "Marque la casilla del margen en las fórmulas que quiera llevar al parcial. " +
      '<a href="' + esc(allHref()) + '" data-nav>Ver todas las fórmulas</a>.');
    // emptyState NO escapa: el texto de la búsqueda se escapa aquí antes de pasarlo.
    if (ctx.q) return A.emptyState("Ninguna fórmula coincide con la búsqueda «" + esc(ctx.q) + "».",
      "Pruebe con menos palabras, con el nombre de la distribución o con parte de la expresión (por ejemplo: sqrt n).");
    if (ctx.esenciales) return A.emptyState("No hay fórmulas esenciales en este recorte.",
      "Desactive «Solo esenciales» para ver el resto.");
    if (ctx.unit) return A.emptyState("Todavía no hay fórmulas para " + unitLabel(ctx.unit) + ".",
      "Esta unidad aún no tiene su formulario en el wiki.");
    return A.emptyState("No hay fórmulas para mostrar.",
      "Todavía no hay ningún formulario cargado en el wiki.");
  }

  // ------------------------------ documento por unidad ------------------------------
  function sheetHtml(u, ts, sel, partial, first, n, total, wide) {
    var k = u.unidad;
    EQN = 0;                                   // la numeración arranca en cada unidad
    var secs = u.secs.map(function (s, i) {
      return sectionHtml(s, unitNum(k) + "." + (i + 1), ts, sel, partial, k);
    }).join("");

    return '<article class="fm-sheet sheet tex-doc" lang="es" style="--ucol:' +
        A.unitMeta(k).color + '" data-unit="' + esc(k) + '">' +
      toolsHtml(u, first, n, total, ts, wide) +
      titleHtml(u) +
      '<div class="fm-body">' + secs + "</div>" +
      '<footer class="fm-foot">93.24 Probabilidad y Estadística · Formulario · ' +
        esc(unitTitle(k)) + " · " + esc(A.localToday()) + "</footer>" +
    "</article>";
  }

  // Portada \maketitle: antetítulo en versalitas, título de la unidad, la
  // materia como subtítulo y la línea de metadatos con el recuento y la fecha.
  function titleHtml(u) {
    var k = u.unidad;
    var meta = u.n + (u.n === 1 ? " fórmula" : " fórmulas") + " · " + A.localToday();
    return '<header class="tex-title">' +
      '<div class="tex-kicker">Formulario · ' + esc(unitTitle(k)) + "</div>" +
      "<h1>" + esc(unitLabel(k)) + "</h1>" +
      '<div class="tex-sub">93.24 Probabilidad y Estadística</div>' +
      '<div class="tex-meta">' + esc(meta) + "</div>" +
    "</header>";
  }

  // Controles y contador: no son parte del apunte, van fuera de la portada y
  // no se imprimen.
  function toolsHtml(u, first, n, total, ts, wide) {
    // En "mi hoja" el denominador ya está recortado: "3 de 3" no dice nada.
    var filtered = !!(ts.length || ctx.esenciales);
    var meta = (filtered && first)
      ? n + " de " + total + (total === 1 ? " fórmula" : " fórmulas") : "";
    var nota = (wide && n) ? " · ninguna fórmula coincide por su nombre o su expresión: " +
      "se muestran las secciones cuyo título coincide" : "";
    var scope = ctx.sel ? " · mi hoja" : "";
    // La casilla «a mi hoja» vive en el margen y es discreta: si la hoja está
    // vacía, la única instrucción que hay del formulario se dice aquí.
    var pista = (first && !ctx.sel && !selCount())
      ? "Marque la casilla del margen izquierdo de una fórmula para llevarla a su hoja" : "";
    var linea = (meta + scope + nota + (pista ? " · " + pista : "")).replace(/^ · /, "");
    var soloPista = pista && !meta && !scope && !nota;

    return (first ? '<div class="fm-acts no-print">' + actionsHtml() + "</div>" : "") +
      (linea ? '<div class="fm-meta no-print"' + (soloPista ? ' data-pista="1"' : "") + ">" +
        esc(linea) + "</div>" : "");
  }

  function actionsHtml() {
    var sel = getSel(), n = selCount(), e = selEntries(sel);
    var tip = n && e !== n
      ? n + " fórmulas en " + e + (e === 1 ? " entrada" : " entradas") +
        " (una fila de tabla lleva una fórmula por columna)"
      : "";
    var out = [];
    if (ctx.unit) out.push('<button type="button" class="fm-act" data-action="form-print">Imprimir unidad</button>');
    out.push('<button type="button" class="fm-act" data-action="form-print-all">Imprimir todo el programa</button>');
    out.push('<a class="fm-act' + (ctx.sel ? " on" : "") + '" href="' + esc(sheetHref()) + '" data-nav' +
      (tip ? ' title="' + esc(tip) + '"' : "") + ">" +
      (ctx.sel ? "Ver todo" : "Mi hoja (" + n + ")") + "</a>");
    // «Vaciar» es destructivo y comparte estilo y vecindad con «Mi hoja»: se
    // aparta al extremo de la barra y queda en el gris del texto secundario.
    // Una vez vaciada, la misma posición ofrece deshacerlo.
    if (n) out.push('<button type="button" class="fm-act fm-act-danger" ' +
      'data-action="form-clear-sel" title="Quita las ' + n +
      ' fórmulas de su hoja (podrá deshacerlo)">Vaciar</button>');
    else if (undoSel) out.push('<button type="button" class="fm-act fm-act-undo" ' +
      'data-action="form-undo-clear">Deshacer el vaciado (' + undoCount + ')</button>');
    return out.join("");
  }

  function sheetHref() {
    var qs = [];
    if (ctx.q) qs.push("q=" + encodeURIComponent(ctx.q));
    if (!ctx.sel) qs.push("sel=1");
    return "#/formularios" + (ctx.unit ? "/" + ctx.unit : "") + (qs.length ? "?" + qs.join("&") : "");
  }

  // ----------------------------- sección -----------------------------
  function sectionHtml(s, num, ts, sel, partial, k) {
    var sub_i = 0;
    var inner = s.subs.map(function (sub) {
      var withHead = !!(sub.titulo && norm(sub.titulo) !== norm(s.titulo));
      sub_i++;
      var head = withHead
        ? "<h3><span class=\"tex-n\">" + num + "." + sub_i + "</span>" + A.rich(sub.titulo) + "</h3>" : "";
      // Con el h3 puesto, repetir el mismo texto como rótulo de la ecuación es
      // ruido: la ecuación queda sin rótulo, como en un apunte.
      var dup = withHead ? norm(sub.titulo) : "";
      var blocks = partial ? [{ kind: "filas", items: sub.items }] : blocksOf(sub.items);
      return head + blocks.map(function (b) {
        return b.kind === "tabla" ? tableHtml(b, ts, sel) : eqsHtml(b.items, ts, sel, dup, k);
      }).join("");
    }).join("");

    return '<section class="tex-sec fm-sec">' +
      '<h2><span class="tex-n">' + esc(num) + "</span>" + A.rich(s.titulo) + "</h2>" +
      inner +
    "</section>";
  }

  // ------------------------------ ecuaciones ------------------------------
  function noteHtml(f, ts) {
    var cuando = f.cuando ? hl(f.cuando, ts) : "";
    var conds = (f.condiciones || []).length
      ? "(" + (f.condiciones || []).map(function (c) { return hl(c, ts); }).join(" · ") + ")" : "";
    if (!cuando && !conds) return "";
    return '<div class="tex-note">' + cuando + (cuando && conds ? " " : "") + conds + "</div>";
  }

  function pickHtml(ids, on) {
    return '<label class="fm-pick no-print" title="Agregar a mi hoja">' +
      '<input type="checkbox" data-action="form-sel" data-ids="' + esc(ids) + '"' +
      (on ? " checked" : "") + ' aria-label="A mi hoja" /></label>';
  }

  function texSlot(tex, cls) {
    var i = TEX.length;
    TEX.push(tex);
    return '<div class="' + cls + '" data-k="' + i + '"></div>';
  }

  // La variante va entre paréntesis, salvo cuando ya trae los suyos: el dato
  // llegó a mostrar «Media (Fórmula (sin agrupar))».
  function varHtml(variante, mudo) {
    if (!variante) return "";
    var v = String(variante).trim();
    // Con el nombre callado la variante ES el rótulo del bloque, así que toma
    // el estilo run-in del apunte en vez de quedar como una palabra suelta.
    if (mudo) return '<span class="tex-label">' + A.rich(capFirst(v)) + (PUNCT.test(v) ? "" : ".") + "</span>";
    var par = !(v.charAt(0) === "(" && v.charAt(v.length - 1) === ")");
    return ' <i class="fmx-var">' + (par ? "(" : "") + A.rich(v) + (par ? ")" : "") + "</i>";
  }

  // El rótulo run-in de LaTeX termina en punto: «Esperanza.»
  var PUNCT = /[.:;,!?)]$/;

  // …y empieza en mayúscula. El dataset trae algunos nombres en minúscula
  // («esperanza», «varianza») y, entre rótulos capitalizados y en versalitas,
  // la inicial baja se lee como un error de composición. Solo se toca la
  // primera letra si ES una letra: un rótulo que arranca en matemática o en
  // símbolo queda tal cual.
  function capFirst(t) {
    var c = String(t || "").charAt(0);
    return c && c !== c.toUpperCase() && c.toLowerCase() === c
      ? c.toUpperCase() + String(t).slice(1) : String(t || "");
  }

  function labelHtml(f, ts, mudo) {
    if (mudo) return "";
    var raw = String(f.nombre || "").trim();
    var nm = richOrHl(capFirst(raw), ts);
    return '<span class="tex-label">' + nm + (PUNCT.test(raw) ? "" : ".") + "</span>";
  }

  // Cada fórmula, en el bloque atómico del apunte: rótulo, ecuación en display
  // a todo el ancho con su número al margen derecho, y nota debajo.
  function eqsHtml(items, ts, sel, dup, k) {
    return items.map(function (f) {
      var on = !!sel[f.id];
      // Con el h3 puesto, repetir el mismo texto como rótulo es ruido, PERO
      // solo se calla cuando queda otra etiqueta (la variante): sin ella el
      // bloque se quedaba sin encabezado y se leía como algo sin terminar.
      var mudo = !!(dup && f.variante && norm(f.nombre) === dup);
      var lab = labelHtml(f, ts, mudo) + varHtml(f.variante, mudo) + " " + wikiLink(f);
      var prosa = proseHtml(f.tex);
      var cuerpo;
      if (prosa) {
        // Prosa con matemática intercalada: párrafo, no ecuación centrada.
        cuerpo = '<div class="tex-para fmx-prosa">' + prosa + "</div>";
      } else {
        EQN++;
        cuerpo = '<div class="tex-eq" data-id="' + esc(f.id) + '">' +
          texSlot(f.tex, "fmx-tex fm-fit") +
          '<span class="tex-eqn">(' + esc(unitNum(k) + "." + EQN) + ")</span>" +
        "</div>";
      }
      return '<div class="fmx-item' + (on ? " picked" : "") + '" data-id="' + esc(f.id) + '">' +
        '<div class="fmx-lab">' + pickHtml(f.id, on) + lab + "</div>" +
        cuerpo +
        noteHtml(f, ts) +
      "</div>";
    }).join("");
  }

  // ------------------------------ tabla ------------------------------
  // Las familias de distribuciones van en tabla booktabs: es lo que hace el
  // apunte impreso y lo único legible para 141 celdas donde el mismo nombre
  // («Bernoulli(p)») encabeza cinco expresiones de dos caracteres.
  function tableHtml(b, ts, sel) {
    var t = b.tabla;
    var head = "<tr><th></th>" + t.vars.map(function (v) {
      return '<th scope="col">' + A.rich(v) + "</th>";
    }).join("") + "</tr>";

    var body = t.names.map(function (nm) {
      var ids = [], first = null;
      t.vars.forEach(function (v) {
        var f = t.cell[nm + " " + v];
        if (f) { ids.push(f.id); if (!first) first = f; }
      });
      var on = ids.length > 0 && ids.every(function (id) { return !!sel[id]; });
      var conds = first && (first.condiciones || []).length
        ? '<span class="fmx-tcond">(' + (first.condiciones || []).map(function (c) {
            return hl(c, ts); }).join(" · ") + ")</span>" : "";
      var cells = t.vars.map(function (v) {
        var f = t.cell[nm + " " + v];
        return "<td>" + (f ? texSlot(f.tex, "fmx-tex fmx-cell") : '<span class="fmx-dash">&mdash;</span>') + "</td>";
      }).join("");
      return '<tr' + (on ? ' class="picked"' : "") + ' data-ids="' + esc(ids.join(" ")) + '">' +
        '<th scope="row" class="fmx-tname">' + pickHtml(ids.join(" "), on) +
          '<span class="fmx-nm">' + richOrHl(nm, ts) + "</span>" +
          (first ? " " + wikiLink(first) : "") + conds +
        "</th>" + cells + "</tr>";
    }).join("");

    return '<div class="tex-tabwrap fmx-tabwrap"><table class="tex-tab midrules fmx-tab">' +
      "<thead>" + head + "</thead><tbody>" + body + "</tbody></table></div>";
  }

  // ---------------------------------------------------------------
  //  Composición de la matemática, por lotes
  // ---------------------------------------------------------------
  function composeTex(host) {
    var slots = A.$$(".fmx-tex[data-k]", host);
    if (!slots.length) { markReady(); return; }
    var i = 0;
    var big = slots.length > BATCH_FROM;
    function step() {
      var end = big ? Math.min(i + CHUNK_TEX, slots.length) : slots.length;
      for (; i < end; i++) {
        var el = slots[i];
        el.innerHTML = A.katex(TEX[+el.getAttribute("data-k")] || "", true);
      }
      if (i < slots.length) { raf = requestAnimationFrame(step); return; }
      raf = 0;
      fitAll(host);
    }
    if (big) raf = requestAnimationFrame(step); else step();
  }

  // ---------------------------------------------------------------
  //  Ajuste de ancho
  //  --fs se mide contra el ancho real en pantalla; --fp se calcula contra la
  //  caja A4, porque en papel no vuelve a correr JS. El ajuste va en tres
  //  fases separadas —limpiar, medir todo, escribir todo— para que el
  //  navegador haga UN reflow por fase y no uno por fórmula.
  // ---------------------------------------------------------------
  // Ancho REAL de la expresión. Medirlo tiene dos trampas: en modo display
  // tanto .katex como .katex-html son BLOQUES (miden el ancho del contenedor,
  // no el del contenido), y scrollWidth solo cuenta el desborde de la derecha
  // mientras la expresión va centrada, o sea que reporta la mitad. Se mide la
  // unión de las cajas hijas de .katex-html y, como respaldo, el desborde que
  // informa scrollWidth.
  // Una ecuación partida en renglones (.fm-row) mide lo que mide su renglón
  // más ancho: es ese el que tiene que entrar en la caja.
  function katexW(el) {
    if (el.classList.contains("split")) {
      var rows = el.children, w = 0, n;
      for (n = 0; n < rows.length; n++) w = Math.max(w, katexOneW(rows[n]));
      return w || el.scrollWidth;
    }
    return katexOneW(el);
  }
  function katexOneW(el) {
    var k = el.querySelector(".katex");
    if (!k) return el.scrollWidth;
    var h = k.querySelector(".katex-html") || k;
    var kids = h.children, L = Infinity, R = -Infinity, i, r;
    for (i = 0; i < kids.length; i++) {
      r = kids[i].getBoundingClientRect();
      if (!r.width && !r.height) continue;
      if (r.left < L) L = r.left;
      if (r.right > R) R = r.right;
    }
    var union = (R > L) ? R - L : 0;
    // Respaldo por scrollWidth SOLO si hay desborde: sin desborde scrollWidth
    // es el ancho de la CAJA, y tomarlo por ancho de la expresión encogía al
    // 77 % fórmulas que entraban de sobra.
    var content = k.scrollWidth > k.clientWidth ? k.scrollWidth : 0;
    return Math.max(union, content) || el.scrollWidth;
  }

  // Ancho útil, con 1 px de resguardo para el redondeo del navegador y el
  // canal de la etiqueta «(4.3)», que va en posición absoluta sobre el margen
  // derecho: sin reservarlo, una expresión que ocupa toda la medida se le
  // encima.
  var EQN_GUTTER = 46;
  var EQN_STATIC = 720;                  // por debajo, el número va en su renglón
  // La ecuación va CENTRADA en la caja: el margen libre a la derecha es
  // (ancho − natural)/2, así que reservar el canal una sola vez dejaba que una
  // fórmula «que entra» se metiera igual debajo del número. Se descuenta por
  // los dos lados. Por debajo de EQN_STATIC el número deja de ser absoluto
  // (regla espejo en formularios.css) y no consume canal.
  function eqnGutter() { return window.innerWidth <= EQN_STATIC ? 0 : EQN_GUTTER; }
  function availW(el) {
    return Math.max(0, el.getBoundingClientRect().width - 1 - 2 * eqnGutter());
  }

  // FASE 1 — escritura: deshacer el ajuste anterior.
  function clearFit(el) {
    el.style.removeProperty("--fs");
    el.style.removeProperty("--fp");
    el.classList.remove("wrapped");
    if (el.classList.contains("flowed") || el.classList.contains("split")) {
      el.classList.remove("flowed");                // volver al render en display
      el.classList.remove("split");
      el.innerHTML = A.katex(TEX[+el.getAttribute("data-k")] || "", true);
    }
  }

  // FASE 2b — escritura: partir la ecuación en renglones si la fórmula ofrece
  // un punto de corte seguro. Devuelve si se partió.
  function trySplit(el) {
    var parts = splitParts(TEX[+el.getAttribute("data-k")] || "");
    var html = parts && splitHtml(parts);
    if (!html) return false;
    el.innerHTML = html;
    el.classList.add("split");
    return true;
  }

  // FASE 2d — lectura: ancho de cada renglón de una ecuación ya partida.
  function rowWidths(el) {
    var rows = el.children, out = [], i;
    for (i = 0; i < rows.length; i++) out.push(katexOneW(rows[i]));
    return out;
  }

  // FASE 2d — escritura: parte de nuevo los renglones que no entran en `av`.
  function resplit(el, anchos, av) {
    var rows = el.children, cambio = false, i, sub;
    for (i = rows.length - 1; i >= 0; i--) {
      if (!(anchos[i] > av)) continue;
      sub = splitParts(rows[i].getAttribute("data-t") || "");
      var html = sub && splitHtml(sub);
      if (!html) continue;
      rows[i].outerHTML = html;
      cambio = true;
    }
    return cambio;
  }

  // FASE 3 — escritura: fijar los dos factores.
  // `ratio` corrige la diferencia de cuerpo entre pantalla y papel: la medición
  // se hace con el cuerpo de pantalla (16.5 px, 17.5 en claustro) y el papel usa
  // 11 pt, así que la caja A4 «rinde» ratio veces más de lo que mide en px.
  function applyFit(m, ratio) {
    var el = m.el;
    if (!m.nat || !m.av) return;
    // Red de seguridad: si ni escalando entra con holgura y la expresión se
    // puede partir en prosa, se la deja fluir. Una ecuación ya partida en
    // renglones (fase 2b) no fluye: el corte ya está hecho.
    if (!el.classList.contains("split") &&
        (m.nat / m.av > FLOW_RATIO || m.av / m.nat < SPLIT_MIN)) {
      var fh = flowHtml(TEX[+el.getAttribute("data-k")] || "");
      if (fh) {
        el.innerHTML = fh;
        el.classList.add("flowed");
        el.style.setProperty("--fs", "1");
        el.style.setProperty("--fp", "1");
        return;
      }
    }
    var f = Math.min(1, m.av / m.nat);
    // Último recurso: la fórmula no entra, no ofrece dónde cortar y no es
    // prosa. Antes que dejarla en un cuerpo ilegible se le devuelve al
    // navegador el permiso de envolver, que latex.css le quita a .tex-eq. Es
    // el peor de los tres caminos —el corte cae donde KaTeX puede, no donde
    // conviene— y por eso se intenta el último, pero es legible.
    if (f < SPLIT_MIN) { el.classList.add("wrapped"); f = SPLIT_MIN; }
    el.style.setProperty("--fs", Math.max(MIN_FIT, f).toFixed(3));
    el.style.setProperty("--fp", Math.max(MIN_FIT, Math.min(1, PAGE_W * ratio / m.nat)).toFixed(3));
  }

  // Cuerpo real del documento, para pasar de px de pantalla a px de papel.
  function printRatio(host) {
    var doc = host.querySelector(".tex-doc");
    var fs = doc ? parseFloat(getComputedStyle(doc).fontSize) : 16.5;
    return (fs > 0 ? fs : 16.5) / PRINT_FS;
  }

  // Una tabla no se ajusta celda por celda: se le baja el cuerpo a TODA la
  // tabla hasta que entra. Así queda pareja y, sobre todo, la tabla deja de
  // desbordar su contenedor (que es lo que produciría scroll horizontal).
  // Se procesan todas las tablas a la vez: una lectura y una escritura por
  // pasada, no una por tabla.
  function fitTables(host, ratio) {
    var tables = A.$$("table.fmx-tab", host);
    if (!tables.length) return;
    bleedWideTables(tables);
    fitTableSet(tables, "--fs", null, SCREEN_MIN_FIT);
    fitTableSet(tables, "--fp", PAGE_W * ratio, MIN_FIT);
  }

  // En pantalla, la tabla que no entra en la medida del texto sangra hasta el
  // borde de la hoja antes de medirse: primero se le da ancho, y solo después
  // se le baja el cuerpo. Una lectura y una escritura por pasada, no una por
  // tabla.
  function bleedWideTables(tables) {
    var st = tables.map(function (t) { return { t: t, w: t.parentNode }; });
    st.forEach(function (s) {                                   // escritura
      if (s.w && s.w.classList) s.w.classList.remove("fmx-bleed");
      s.t.style.width = "max-content";
      s.t.style.maxWidth = "none";
      s.t.style.setProperty("--tf", "1");
    });
    st.forEach(function (s) {                                   // lectura
      s.av = s.w ? s.w.getBoundingClientRect().width : 0;
      s.nat = s.t.getBoundingClientRect().width;
    });
    st.forEach(function (s) {                                   // escritura
      s.t.style.removeProperty("width");
      s.t.style.removeProperty("max-width");
      s.t.style.removeProperty("--tf");
      if (s.w && s.w.classList && s.av && s.nat > s.av) s.w.classList.add("fmx-bleed");
    });
  }

  // `floor` es el piso del factor. En pantalla hay un piso de legibilidad: por
  // debajo de él la tabla desborda y el contenedor la desplaza en horizontal,
  // que se lee mejor que una matemática de 10 px. En papel no hay scroll, así
  // que el papel conserva el piso mínimo.
  function fitTableSet(tables, prop, fixedAvail, floor) {
    var min = floor || MIN_FIT;
    var st = tables.map(function (t) { return { t: t, f: 1, av: 0, done: false }; });
    // escritura: se mide con ancho natural, sin el tope del contenedor
    st.forEach(function (s) {
      s.t.style.width = "max-content";
      s.t.style.maxWidth = "none";
      s.t.style.setProperty("--tf", "1");
    });
    for (var pass = 0; pass < 4; pass++) {
      var any = false;
      st.forEach(function (s) {                                   // lectura
        if (s.done) return;
        if (!s.av) {
          var wrap = s.t.parentNode;
          s.av = fixedAvail != null ? fixedAvail
            : Math.max(80, (wrap ? wrap.getBoundingClientRect().width : 0) - 1);
        }
        var w = s.t.getBoundingClientRect().width;
        if (w <= s.av || s.f <= min) { s.done = true; return; }
        s.f = Math.max(min, s.f * s.av / w);
        any = true;
      });
      if (!any) break;
      st.forEach(function (s) {                                   // escritura
        if (!s.done) s.t.style.setProperty("--tf", s.f.toFixed(3));
      });
    }
    st.forEach(function (s) {                                     // escritura final
      s.t.style.removeProperty("--tf");
      s.t.style.removeProperty("width");
      s.t.style.removeProperty("max-width");
      s.t.style.setProperty(prop, s.f.toFixed(3));
    });
  }

  function doFit(host) {
    var eqs = A.$$(".fm-fit[data-k]", host);
    eqs.forEach(clearFit);                                        // fase 1
    var ratio = printRatio(host);
    var m = eqs.map(function (el) {                               // fase 2
      return { el: el, nat: katexW(el), av: availW(el) };
    });
    // FASE 2b (escritura) y 2c (lectura) — partir en renglones lo que no
    // llegaría al piso de legibilidad y remedirlo. Son un puñado de fórmulas,
    // pero se hacen todas juntas para no pagar un reflow por fórmula.
    var partidas = [];
    m.forEach(function (x) {
      if (x.nat && x.av && x.av / x.nat < SPLIT_MIN && trySplit(x.el)) partidas.push(x);
    });
    partidas.forEach(function (x) { x.nat = katexW(x.el); });
    // FASE 2d — segunda vuelta: el renglón que TODAVÍA no entra se parte otra
    // vez por sus propios \quad. Lectura y escritura siguen separadas.
    var otra = partidas.filter(function (x) { return x.av && x.av / x.nat < SPLIT_MIN; });
    if (otra.length) {
      var anchos = otra.map(function (x) { return rowWidths(x.el); });   // lectura
      var tocadas = [];
      otra.forEach(function (x, i) { if (resplit(x.el, anchos[i], x.av)) tocadas.push(x); });
      tocadas.forEach(function (x) { x.nat = katexW(x.el); });           // lectura
    }
    m.forEach(function (x) { applyFit(x, ratio); });               // fase 3
    verifyFit(m);                                                 // fases 4 y 5
    fitTables(host, ratio);
  }

  // FASE 4 (lectura) y 5 (escritura) — verificación. Unas pocas expresiones no
  // encogen en proporción al cuerpo: KaTeX reparte el contenido de otra manera
  // y quedan más anchas de lo previsto, encimándose con el número «(4.3)». Se
  // remide lo ya ajustado y se corrige solo el factor de pantalla de las que
  // siguen pasadas. Dos rondas en bloque (una lectura y una escritura cada
  // una): con una sola quedaba una fórmula de «todo el programa» sin cerrar.
  function verifyFit(m) {
    verifyRound(m);
    verifyRound(m);
  }

  function verifyRound(m) {
    var over = m.map(function (x) {
      if (!x.nat || !x.av) return 0;
      // La que fluye o la que se dejó envolver ya se acomoda sola al ancho:
      // remedirla solo conseguiría encogerla de nuevo sin motivo.
      if (x.el.classList.contains("flowed") || x.el.classList.contains("wrapped")) return 0;
      // El desborde REAL de la caja manda sobre el ancho medido: la unión de
      // las cajas de KaTeX se queda corta por un par de píxeles en unas pocas
      // expresiones (un \text al final, el redondeo del navegador) y esas
      // quedaban con la barra de desplazamiento latente de .tex-eq.
      var caja = x.el.parentNode;
      var sc = (caja && caja.scrollWidth > caja.clientWidth) ? caja.scrollWidth - caja.clientWidth : 0;
      return Math.max(katexW(x.el) - x.av, sc);
    });
    m.forEach(function (x, i) {
      if (over[i] <= 1) return;
      var f = parseFloat(x.el.style.getPropertyValue("--fs")) || 1;
      x.el.style.setProperty("--fs",
        Math.max(MIN_FIT, f * x.av / (x.av + over[i])).toFixed(3));
    });
  }

  // Cuántas tipografías conoce el documento. Si al terminar document.fonts.
  // ready el número no cambió y el estado ya era 'loaded', no se cargó nada
  // nuevo y la segunda pasada de ajuste no tiene nada que corregir.
  function fontCount() {
    return (document.fonts && typeof document.fonts.size === "number") ? document.fonts.size : -1;
  }
  function fontsSettled() {
    return !!(document.fonts && document.fonts.status === "loaded");
  }

  // Huella de la medición: ancho de la CAJA y ancho de la primera EXPRESIÓN.
  // Las dos se mueven tarde y por motivos distintos: la caja porque la medida
  // del documento va en em, y la expresión porque KaTeX pide sus tipografías
  // recién cuando pinta la matemática (document.fonts puede decir «loaded»
  // antes de eso, y entonces la segunda pasada se salteaba con el ajuste ya
  // calculado contra una expresión más angosta: tres fórmulas de «todo el
  // programa» terminaban pisando su número).
  function measureFp(host) {
    var el = host.querySelector(".fm-fit[data-k]");
    if (!el) return "";
    return Math.round(el.getBoundingClientRect().width) + "x" + Math.round(katexW(el));
  }

  function fitAll(host) {
    var before = fontCount(), settled = fontsSettled();
    doFit(host);
    var fonts = (document.fonts && document.fonts.ready && document.fonts.ready.then)
      ? document.fonts.ready : null;
    if (!fonts) { markReady(); return; }
    fonts.then(function () {
      if (!document.body.contains(host)) { markReady(); return; }
      // KaTeX carga sus tipografías tarde y al llegar cambian los anchos: hay
      // que remedir. En una visita repetida ya estaban cargadas y esa segunda
      // pasada era trabajo tirado (unos 600 layouts y 180 ms por visita).
      if (!(settled && fontsSettled() && fontCount() === before)) doFit(host);
      // Vigilancia corta: se rehace el ajuste solo si la huella cambió. Son
      // tres lecturas de una sola fórmula, no un ajuste completo.
      var fp = measureFp(host), esperas = [220, 700];
      function revisar(i) {
        if (!document.body.contains(host)) return;
        var ahora = measureFp(host);
        if (ahora !== fp) { doFit(host); fp = measureFp(host); }
        if (i < esperas.length) setTimeout(function () { revisar(i + 1); }, esperas[i]);
      }
      requestAnimationFrame(function () { revisar(0); markReady(); });
    });
  }

  var rzT = 0, wasNarrow = null;
  function onResize() {
    var host = document.getElementById("fmDoc");
    if (!host) return;
    clearTimeout(rzT);
    rzT = setTimeout(function () {
      // cruzar el umbral cambia la composición (tablas ⇄ ecuaciones): hay que rehacer
      var n = isNarrow();
      if (ctx && wasNarrow !== null && n !== wasNarrow) { wasNarrow = n; renderDoc(); return; }
      wasNarrow = n;
      doFit(host);
    }, 220);
  }
  window.addEventListener("resize", onResize);
  // [bundle] el listener es del BUNDLE: se retira al descargarlo (herr-04).
  if (A.onTeardown) {
    A.onTeardown(function () { window.removeEventListener("resize", onResize); clearTimeout(rzT); });
  }

  // ---------------------------------------------------------------
  //  Ancla ?f=<id>
  //  Deja la fórmula a la vista y la resalta. Se corrige cuadro a cuadro
  //  hasta que la posición se queda quieta: el ajuste y las tipografías de
  //  KaTeX mueven el documento cientos de píxeles después del primer pintado.
  // ---------------------------------------------------------------
  function anclaOffset() {
    var cs = getComputedStyle(document.documentElement);
    var h = parseFloat(cs.getPropertyValue("--header-h")) || 0;
    var c = parseFloat(cs.getPropertyValue("--crumbs-h")) || 0;
    var bar = document.querySelector(".fm-bar");
    var bh = 0;
    if (bar) {
      var pos = getComputedStyle(bar).position;
      if (pos === "sticky" || pos === "fixed") bh = bar.getBoundingClientRect().height;
    }
    return h + c + bh + 14;
  }

  // [bundle] Primer ancestro con desbordamiento vertical propio: en la
  // plataforma el que scrollea es un contenedor del shell y no la ventana.
  // `null` = scrollea la ventana (el caso del baseline).
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

  function findFormula(id) {
    var host = document.getElementById("fmDoc");
    if (!host || !id) return null;
    var q = String(id).replace(/["\\]/g, "\\$&");
    var eq = host.querySelector('.tex-eq[data-id="' + q + '"]');
    if (eq) return eq.closest(".fmx-item") || eq;
    var item = host.querySelector('.fmx-item[data-id="' + q + '"]');
    if (item) return item;
    return host.querySelector('tr[data-ids~="' + q + '"]');
  }

  var targetTimer = 0;
  function irAFormula(id) {
    if (!id) return;
    var el = findFormula(id);
    // La búsqueda o «solo esenciales» pueden estar escondiendo la fórmula
    // pedida: el enlace manda sobre el filtro.
    if (!el && ctx && (ctx.q || ctx.esenciales)) {
      ctx.q = "";
      ctx.esenciales = false;
      ctx.vs.esenciales = false;
      var input = document.getElementById("fmQ");
      if (input) input.value = "";
      var ess = document.getElementById("fmEss");
      if (ess) ess.checked = false;
      A.setQuery({ q: null });
      updateTabHrefs();
      renderDoc();
      el = findFormula(id);
    }
    if (!el) return;

    A.$$(".is-target", document.getElementById("fmDoc")).forEach(function (p) {
      p.classList.remove("is-target");
    });
    el.classList.add("is-target");

    // [bundle] En el baseline scrolleaba `window`; en la plataforma scrollea un
    // contenedor del shell. `scrollerDe` lo busca y devuelve `null` cuando el
    // que scrollea es la ventana, que es el caso del baseline.
    var sc = scrollerDe(el);
    var cortado = false, estables = 0, t0 = Date.now();
    function fin() {
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (ev) {
        window.removeEventListener(ev, soltar);
      });
    }
    function soltar() { cortado = true; fin(); }   // si la persona se mueve, mandan sus manos
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (ev) {
      window.addEventListener(ev, soltar, { passive: true });
    });
    function ubicar() {
      if (cortado || !document.body.contains(el)) { fin(); return; }
      var base = sc ? sc.getBoundingClientRect().top : 0;
      var y0 = sc ? sc.scrollTop : (window.pageYOffset || 0);
      var y = Math.max(0, Math.round(el.getBoundingClientRect().top - base + y0 - anclaOffset()));
      if (Math.abs(y - y0) > 1) { if (sc) sc.scrollTop = y; else window.scrollTo(0, y); estables = 0; }
      else estables++;
      if (estables < 8 && Date.now() - t0 < 2000) requestAnimationFrame(ubicar);
      else fin();
    }
    requestAnimationFrame(ubicar);

    // El resalte se apaga solo al primer gesto de la persona, no por tiempo:
    // así sigue visible mientras lee y desaparece en cuanto toca algo.
    clearTimeout(targetTimer);
    function apagar() {
      el.classList.remove("is-target");
      ["pointerdown", "keydown"].forEach(function (ev) {
        window.removeEventListener(ev, apagar);
      });
    }
    ["pointerdown", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, apagar, { passive: true });
    });
  }

  // ---------------------------------------------------------------
  //  Acciones
  // ---------------------------------------------------------------
  function refreshActs() {
    var box = document.querySelector(".fm-acts");
    if (box && ctx) box.innerHTML = actionsHtml();
    // La pista de la casilla sobra en cuanto hay algo marcado: se apaga sin
    // rehacer el documento.
    var meta = document.querySelector(".fm-meta");
    if (meta && meta.getAttribute("data-pista") === "1") {
      meta.hidden = !!selCount();
    }
  }

  A.registerAction("form-sel", function (el) {
    var raw = el.getAttribute("data-ids") || el.getAttribute("data-id") || "";
    var ids = raw.split(/\s+/).filter(Boolean);
    if (!ids.length) return;
    var sel = getSel();
    var on = el.tagName === "INPUT" ? !!el.checked : !ids.every(function (id) { return !!sel[id]; });
    ids.forEach(function (id) { if (on) sel[id] = 1; else delete sel[id]; });
    setSel(sel);
    var holder = el.closest(".fmx-item") || el.closest("tr");
    if (holder) holder.classList.toggle("picked", on);
    refreshActs();
  });

  // Última hoja vaciada, para el «Deshacer» de la barra. Vive en memoria: es
  // una red para el clic equivocado, no un historial.
  var undoSel = null, undoCount = 0;

  A.registerAction("form-clear-sel", function () {
    undoSel = getSel();
    undoCount = selCount();
    setSel({});
    A.$$(".fm-doc .picked").forEach(function (p) {
      p.classList.remove("picked");
      var cb = p.querySelector('input[data-action="form-sel"]');
      if (cb) cb.checked = false;
    });
    // Quedarse en «mi hoja» con la hoja vacía dejaba al usuario encerrado: las
    // pestañas de unidad conservaban ?sel=1 y todas mostraban el estado vacío.
    if (ctx && ctx.sel) {
      ctx.sel = false;
      A.setQuery({ sel: null });
      updateTabHrefs();
      renderDoc();
    } else refreshActs();
    A.toast("Su hoja quedó vacía. Puede deshacerlo desde la barra.");
  });

  A.registerAction("form-undo-clear", function () {
    if (!undoSel) return;
    setSel(undoSel);
    undoSel = null; undoCount = 0;
    renderDoc();                       // vuelve a marcar las casillas y las filas
    A.toast("Se restauró su hoja.");
  });

  A.registerAction("form-print", printWhenReady);

  A.registerAction("form-print-all", function () {
    if (ctx && !ctx.unit) { printWhenReady(); return; }
    markBusy();                       // el render nuevo la vuelve a levantar
    A.go("#/formularios" + (ctx && ctx.sel ? "?sel=1" : ""));
    printWhenReady();
  });
  // ---------------------------------------------------------------
  //  [bundle] PALETA ⌘K — grupo «Fórmulas»
  // ---------------------------------------------------------------
  // En el baseline la paleta armaba su propio índice de las 643 fórmulas
  // (core.js:2106-2141) y el destino era `#/formularios/<u>?f=<id>`, que esta
  // vista resuelve con `irAFormula`. En la plataforma la paleta es del shell,
  // así que el bundle APORTA sus resultados con `A.registerSearchProvider` y el
  // shell decide si los muestra. Mientras la paleta no consuma los proveedores,
  // esto no hace nada y no cuesta nada: el índice es perezoso.
  if (A.registerSearchProvider) {
    A.registerSearchProvider(function (q) {
      var ts = terms(q);
      if (!ts.length) return [];
      var out = [], i;
      for (i = 0; i < DATA.length && out.length < 8; i++) {
        var f = DATA[i];
        if (!matchesF(f, ts, false)) continue;
        out.push({
          label: f.nombre + (f.variante ? " · " + f.variante : ""),
          sub: unitTitle(f.unidad) + (f.seccion ? " · " + f.seccion : ""),
          target: "#/formularios/" + f.unidad + "?f=" + encodeURIComponent(f.id),
          group: "Fórmulas",
        });
      }
      return out;
    });
  }
})();
