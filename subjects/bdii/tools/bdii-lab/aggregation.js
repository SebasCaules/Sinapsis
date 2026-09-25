/* ============================================================
   bdii-lab / aggregation.js — "Aggregation pipeline paso a paso".

   Motor puro (App.bdiiLab.engines["aggregation"]): parser de JSON relajado
   (sintaxis de mongosh: claves sin comillas, comillas simples, ObjectId(),
   ISODate()) SIN evaluación de código, y un intérprete de pipeline con las
   etapas y operadores de 2.12.08 - Aggregation pipeline.md. La interfaz
   (mount) solo llama al motor y dibuja.

   Ver TOOLS_LIB.md para la API de lib.js. Fuentes del vault citadas en los
   `sources` de cada preset y en los enlaces del encabezado.
   ============================================================ */
(function () {
  "use strict";

  var App = window.App;
  if (!App) return;
  var lab = App.bdiiLab;
  if (!lab) return;

  // ================================================================
  // 1 · Valores etiquetados — ObjectId y Date, sin usar el Date real de JS
  //     para poder serializar/comparar de forma determinística.
  // ================================================================

  function mkOid(hex) { return { $oid: String(hex).toLowerCase() }; }
  function mkDate(iso) { return { $date: iso }; }
  function isOid(v) { return !!v && typeof v === "object" && typeof v.$oid === "string" && Object.keys(v).length === 1; }
  function isDate(v) { return !!v && typeof v === "object" && typeof v.$date === "string" && Object.keys(v).length === 1; }
  function isTagged(v) { return isOid(v) || isDate(v); }
  function isPlainObject(v) { return !!v && typeof v === "object" && !Array.isArray(v) && !isTagged(v); }

  function dateMs(v) {
    if (!isDate(v)) return NaN;
    var t = Date.parse(v.$date);
    return t;
  }

  /** Normaliza una fecha "2017-11-27" o completa a ISO con horario. */
  function normalizeDateInput(s) {
    s = String(s);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s + "T00:00:00.000Z";
    var t = Date.parse(s);
    if (isNaN(t)) throw new EngineError("Fecha inválida: " + JSON.stringify(s));
    return new Date(t).toISOString();
  }

  // ================================================================
  // 2 · Errores del motor — se muestran al estudiante, nunca se ocultan
  // ================================================================

  function EngineError(message) {
    this.message = message;
    this.name = "EngineError";
  }
  EngineError.prototype = Object.create(Error.prototype);

  function UnsupportedError(message) {
    this.message = message;
    this.name = "UnsupportedError";
  }
  UnsupportedError.prototype = Object.create(Error.prototype);

  // ================================================================
  // 3 · Parser de JSON relajado (sintaxis de mongosh) — SIN eval
  // ================================================================

  var IDENT_START = /[A-Za-z_$]/;
  var IDENT_PART = /[A-Za-z0-9_$]/;

  function Parser(src) {
    this.s = src;
    this.i = 0;
    this.n = src.length;
  }

  Parser.prototype.error = function (msg) {
    var upTo = this.s.slice(0, this.i);
    var line = upTo.split("\n").length;
    var col = this.i - upTo.lastIndexOf("\n");
    throw new EngineError("Error de sintaxis (línea " + line + ", columna " + col + "): " + msg);
  };

  Parser.prototype.skipWs = function () {
    while (this.i < this.n) {
      var c = this.s[this.i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r") { this.i++; continue; }
      if (c === "/" && this.s[this.i + 1] === "/") {
        while (this.i < this.n && this.s[this.i] !== "\n") this.i++;
        continue;
      }
      if (c === "/" && this.s[this.i + 1] === "*") {
        this.i += 2;
        while (this.i < this.n && !(this.s[this.i] === "*" && this.s[this.i + 1] === "/")) this.i++;
        this.i += 2;
        continue;
      }
      break;
    }
  };

  Parser.prototype.peek = function () { return this.s[this.i]; };

  Parser.prototype.expect = function (ch) {
    this.skipWs();
    if (this.s[this.i] !== ch) this.error("se esperaba '" + ch + "'");
    this.i++;
  };

  /** Anidamiento máximo de { } y [ ]: sin tope, un texto muy anidado agota la pila de JS. */
  var MAX_DEPTH = 100;

  Parser.prototype.parseValue = function () {
    this.skipWs();
    if (this.i >= this.n) this.error("valor inesperado: fin de la entrada");
    var c = this.s[this.i];
    if (c === "{" || c === "[") {
      this.depth = (this.depth || 0) + 1;
      if (this.depth > MAX_DEPTH) this.error("demasiados niveles de anidamiento (el máximo de este laboratorio es " + MAX_DEPTH + ")");
      var nested = c === "{" ? this.parseObject() : this.parseArray();
      this.depth--;
      return nested;
    }
    if (c === '"' || c === "'") return this.parseString();
    if (c === "-" || (c >= "0" && c <= "9")) return this.parseNumber();
    if (c === "/") return this.parseRegexLiteral();
    if (IDENT_START.test(c)) return this.parseWord();
    this.error("carácter inesperado '" + c + "'");
  };

  /**
   * Literal de expresión regular de mongosh, `/patrón/flags`. Se convierte a
   * la forma documento `{ $regex: "patrón", $options: "flags" }`, que es la
   * que interpreta el motor (y la que MongoDB trata como equivalente).
   */
  Parser.prototype.parseRegexLiteral = function () {
    this.i++; // la barra de apertura
    var pattern = "";
    var inClass = false;
    while (this.i < this.n) {
      var c = this.s[this.i];
      if (c === "\n") break;
      if (c === "\\") { pattern += c + (this.s[this.i + 1] || ""); this.i += 2; continue; }
      if (c === "[") inClass = true;
      else if (c === "]") inClass = false;
      else if (c === "/" && !inClass) break;
      pattern += c;
      this.i++;
    }
    if (this.s[this.i] !== "/") this.error("expresión regular /…/ sin cerrar");
    this.i++;
    var flags = "";
    while (this.i < this.n && /[A-Za-z]/.test(this.s[this.i])) { flags += this.s[this.i]; this.i++; }
    var obj = {};
    setOwnKey(obj, "$regex", pattern);
    setOwnKey(obj, "$options", flags);
    return obj;
  };

  /** Asigna una clave como propiedad PROPIA normal, sin pasar por el prototipo
   * (una clave literal "__proto__" en el texto de la etapa no debe cambiar el
   * prototipo de `obj`: tiene que guardarse como dato, como haría mongosh). */
  function setOwnKey(obj, key, val) {
    Object.defineProperty(obj, key, { value: val, enumerable: true, configurable: true, writable: true });
  }

  Parser.prototype.parseObject = function () {
    this.expect("{");
    var obj = {};
    var order = [];
    this.skipWs();
    if (this.peek() === "}") { this.i++; Object.defineProperty(obj, "__order", { value: order, enumerable: false }); return obj; }
    for (;;) {
      this.skipWs();
      var key;
      var c = this.peek();
      if (c === '"' || c === "'") key = this.parseString();
      else if (IDENT_START.test(c)) key = this.parseBareIdent();
      else this.error("se esperaba una clave (identificador o cadena)");
      this.skipWs();
      this.expect(":");
      var val = this.parseValue();
      setOwnKey(obj, key, val);
      order.push(key);
      this.skipWs();
      var nc = this.peek();
      if (nc === ",") { this.i++; this.skipWs(); if (this.peek() === "}") { this.i++; break; } continue; }
      if (nc === "}") { this.i++; break; }
      this.error("se esperaba ',' o '}'");
    }
    Object.defineProperty(obj, "__order", { value: order, enumerable: false });
    return obj;
  };

  Parser.prototype.parseArray = function () {
    this.expect("[");
    var arr = [];
    this.skipWs();
    if (this.peek() === "]") { this.i++; return arr; }
    for (;;) {
      arr.push(this.parseValue());
      this.skipWs();
      var nc = this.peek();
      if (nc === ",") { this.i++; this.skipWs(); if (this.peek() === "]") { this.i++; break; } continue; }
      if (nc === "]") { this.i++; break; }
      this.error("se esperaba ',' o ']' en el arreglo");
    }
    return arr;
  };

  Parser.prototype.parseBareIdent = function () {
    var start = this.i;
    if (!IDENT_START.test(this.peek())) this.error("identificador inválido");
    this.i++;
    while (this.i < this.n && IDENT_PART.test(this.s[this.i])) this.i++;
    return this.s.slice(start, this.i);
  };

  Parser.prototype.parseString = function () {
    var quote = this.s[this.i];
    this.i++;
    var out = "";
    while (this.i < this.n && this.s[this.i] !== quote) {
      var c = this.s[this.i];
      if (c === "\\") {
        var next = this.s[this.i + 1];
        if (next === "n") out += "\n";
        else if (next === "t") out += "\t";
        else if (next === "r") out += "\r";
        else if (next === "\\") out += "\\";
        else if (next === "'") out += "'";
        else if (next === '"') out += '"';
        else if (next === "/") out += "/";
        else if (next === "u") {
          var hex = this.s.slice(this.i + 2, this.i + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) this.error("secuencia de escape Unicode inválida: \\u debe ir seguido de 4 dígitos hexadecimales");
          out += String.fromCharCode(parseInt(hex, 16));
          this.i += 4;
        } else out += next;
        this.i += 2;
        continue;
      }
      if (c === "\n") this.error("cadena sin cerrar");
      out += c;
      this.i++;
    }
    if (this.s[this.i] !== quote) this.error("cadena sin cerrar");
    this.i++;
    return out;
  };

  Parser.prototype.parseNumber = function () {
    var start = this.i;
    if (this.s[this.i] === "-") this.i++;
    while (this.i < this.n && this.s[this.i] >= "0" && this.s[this.i] <= "9") this.i++;
    if (this.s[this.i] === ".") { this.i++; while (this.i < this.n && this.s[this.i] >= "0" && this.s[this.i] <= "9") this.i++; }
    if (this.s[this.i] === "e" || this.s[this.i] === "E") {
      this.i++;
      if (this.s[this.i] === "+" || this.s[this.i] === "-") this.i++;
      while (this.i < this.n && this.s[this.i] >= "0" && this.s[this.i] <= "9") this.i++;
    }
    var text = this.s.slice(start, this.i);
    if (text === "" || text === "-") this.error("número inválido");
    return Number(text);
  };

  var CONSTRUCTOR_KEYWORDS = { ObjectId: 1, ISODate: 1, Date: 1, NumberInt: 1, NumberLong: 1, NumberDecimal: 1 };

  Parser.prototype.parseWord = function () {
    var word = this.parseBareIdent();
    if (word === "true") return true;
    if (word === "false") return false;
    if (word === "null") return null;
    if (word === "undefined") return undefined;
    if (word === "new") {
      this.skipWs();
      var ctor = this.parseBareIdent();
      return this.parseConstructorArgs(ctor);
    }
    if (CONSTRUCTOR_KEYWORDS[word]) return this.parseConstructorArgs(word);
    this.error("identificador no soportado: " + word + " (sin evaluación de código: solo se acepta JSON relajado, ObjectId(), ISODate(), new Date(), true/false/null)");
  };

  Parser.prototype.parseConstructorArgs = function (ctor) {
    this.skipWs();
    this.expect("(");
    this.skipWs();
    var arg;
    if (this.peek() === ")") { arg = undefined; } else { arg = this.parseValue(); this.skipWs(); }
    this.expect(")");
    if (ctor === "ObjectId") {
      if (typeof arg !== "string" || !/^[0-9a-fA-F]{24}$/.test(arg)) this.error("ObjectId(...) necesita 24 caracteres hexadecimales");
      return mkOid(arg);
    }
    if (ctor === "ISODate" || ctor === "Date") {
      if (arg === undefined) this.error(ctor + "() sin argumento no está soportado (JSON relajado, sin reloj real)");
      return mkDate(normalizeDateInput(arg));
    }
    throw new UnsupportedError(ctor + "(...) no está soportado en este laboratorio. Soportados: ObjectId(\"hex24\"), ISODate(\"AAAA-MM-DD\"), new Date(\"AAAA-MM-DD\").");
  };

  /** Parsea UNA etapa (un documento `{ $etapa: {...} }`) o un valor JSON relajado cualquiera. */
  function parseRelaxedJSON(text) {
    try {
      var p = new Parser(text == null ? "" : String(text));
      p.skipWs();
      if (p.i >= p.n) return { ok: false, error: "La etapa está vacía." };
      var value = p.parseValue();
      p.skipWs();
      if (p.i < p.n) return { ok: false, error: "Sobra texto después del valor (columna " + (p.i + 1) + ")." };
      return { ok: true, value: value };
    } catch (err) {
      return { ok: false, error: err && err.message ? err.message : String(err) };
    }
  }

  // ================================================================
  // 4 · Utilidades de valores — igualdad, orden BSON aproximado, rutas
  // ================================================================

  function deepEqual(a, b) {
    if (a === b) return true;
    if (isOid(a) && isOid(b)) return a.$oid === b.$oid;
    if (isDate(a) && isDate(b)) return dateMs(a) === dateMs(b);
    if (isTagged(a) || isTagged(b)) return false;
    if (a === null || b === null) return a === b;
    if (a === undefined || b === undefined) return a === b;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (typeof a === "object" && typeof b === "object") {
      // Como el documento BSON real: dos subdocumentos son iguales solo si
      // tienen las MISMAS claves en el MISMO orden (verificado: MongoDB 8.3.11
      // NO empareja `{ discos: { anio: 2014, titulo: "X" } }` contra un disco
      // guardado como `{ titulo: "X", anio: 2014 }`, aunque el contenido sea
      // el mismo).
      var ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (var j = 0; j < ka.length; j++) {
        if (ka[j] !== kb[j]) return false;
        if (!deepEqual(a[ka[j]], b[kb[j]])) return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Orden de tipos de MongoDB, simplificado (MinKey/MaxKey/regex/binaria no
   * soportados). "Ausente" (undefined) y `null` van en el MISMO nivel: es lo
   * que hace que $sort intercale documentos con el campo null y documentos
   * sin el campo, como hace MongoDB (verificado: ambos casos se ordenan
   * juntos por el criterio de desempate siguiente, no uno antes que el otro).
   */
  function typeRank(v) {
    if (v === undefined || v === null) return 1;
    if (typeof v === "number") return 2;
    if (typeof v === "string") return 3;
    if (isOid(v)) return 4;
    if (typeof v === "boolean") return 5;
    if (isDate(v)) return 6;
    if (Array.isArray(v)) return 7;
    if (typeof v === "object") return 8;
    return 9;
  }

  /**
   * Orden BSON aproximado (MinKey/MaxKey/regex/binaria no soportados).
   * Entre tipos distintos usa el orden de tipos de MongoDB (simplificado:
   * null < numero < string < ObjectId < boolean < date < arreglo < objeto);
   * dentro del mismo tipo, orden natural.
   */
  function compareBSON(a, b) {
    var ra = typeRank(a), rb = typeRank(b);
    if (ra !== rb) return ra < rb ? -1 : 1;
    switch (ra) {
      case 0: case 1: return 0;
      case 2: return a === b ? 0 : (a < b ? -1 : 1);
      case 3: return a === b ? 0 : (a < b ? -1 : 1);
      case 4: return a.$oid === b.$oid ? 0 : (a.$oid < b.$oid ? -1 : 1);
      case 5: { var na = a ? 1 : 0, nb = b ? 1 : 0; return na - nb; }
      case 6: { var da = dateMs(a), db = dateMs(b); return da === db ? 0 : (da < db ? -1 : 1); }
      case 7: {
        var len = Math.min(a.length, b.length);
        for (var i = 0; i < len; i++) { var c = compareBSON(a[i], b[i]); if (c !== 0) return c; }
        return a.length - b.length;
      }
      default: return 0;
    }
  }

  function splitPath(path) { return String(path).split("."); }

  /**
   * Resuelve una ruta con puntos atravesando arreglos como lo hace MongoDB:
   * si en el medio del camino aparece un arreglo y el segmento siguiente no
   * es un índice numérico, se mapea sobre cada elemento. Devuelve
   * { values: [...hojas], sawArray: bool } — `values` sirve para $match
   * (candidatos a comparar); si `sawArray` es falso y `values.length===1`,
   * ese único valor es la resolución "directa" (para expresiones).
   */
  function resolvePath(doc, path) {
    var segments = splitPath(path);
    var sawArray = false;

    function walk(cur, idx) {
      if (idx === segments.length) return [cur];
      if (cur === undefined || cur === null) return [undefined];
      if (Array.isArray(cur)) {
        var seg = segments[idx];
        if (/^\d+$/.test(seg)) {
          var n = parseInt(seg, 10);
          return walk(cur[n], idx + 1);
        }
        sawArray = true;
        var out = [];
        for (var i = 0; i < cur.length; i++) out = out.concat(walk(cur[i], idx));
        return out.length ? out : [undefined];
      }
      if (typeof cur !== "object") return [undefined];
      return walk(cur[segments[idx]], idx + 1);
    }

    var values = walk(doc, 0);
    return { values: values, sawArray: sawArray };
  }

  /**
   * Valor de "$campo.con.puntos" en contexto de EXPRESIÓN ($project/$group/
   * $addFields/$sort/acumuladores). A diferencia de `resolvePath` (para
   * $match), acá NO hay índice numérico especial (`"$items.0"` no indexa: se
   * busca la propiedad "0" en cada elemento, como hace MongoDB) y las ramas
   * sin el campo se DESCARTAN del arreglo resultante en vez de rellenarse con
   * "ausente" (verificado: `"$a.x"` sobre `[{x:1},{y:2},{x:3}]` da `[1,3]`,
   * no `[1,undefined,3]`; `"$location.0"` sobre un arreglo `[lon,lat]` da
   * `[]`, no el valor indexado).
   */
  function getExprField(doc, path) {
    var segments = splitPath(path);
    var sawArray = false;
    function walk(cur, idx) {
      if (idx === segments.length) return [cur];
      if (cur === undefined || cur === null) return [];
      if (Array.isArray(cur)) {
        sawArray = true;
        var out = [];
        for (var i = 0; i < cur.length; i++) out = out.concat(walk(cur[i], idx));
        return out;
      }
      if (typeof cur !== "object" || isTagged(cur)) return [];
      var seg = segments[idx];
      if (!Object.prototype.hasOwnProperty.call(cur, seg)) return [];
      return walk(cur[seg], idx + 1);
    }
    var values = walk(doc, 0);
    if (!sawArray) return values.length ? values[0] : undefined;
    return values;
  }

  /** Candidatos "explotados" para pruebas de $match (arreglo de hojas + elementos de arreglos-hoja). */
  function getMatchCandidates(doc, path) {
    var r = resolvePath(doc, path);
    var candidates = [];
    r.values.forEach(function (v) {
      candidates.push(v);
      if (Array.isArray(v)) v.forEach(function (el) { candidates.push(el); });
    });
    return { leaves: r.values, candidates: candidates };
  }

  /**
   * Valor "directo" de una ruta con puntos: SIN mapear sobre arreglos
   * intermedios (a diferencia de `getExprField`/`resolvePath`). Un arreglo en
   * el medio del camino hace que la ruta no exista — lo usa $unwind, que solo
   * puede desarmar un arreglo que está literalmente en esa posición
   * (verificado: `$unwind: "$discos.titulo"`, con `discos` arreglo, da 0
   * documentos en MongoDB, no "atraviesa" el arreglo).
   */
  function getDirectField(doc, path) {
    var segments = splitPath(path);
    var cur = doc;
    for (var i = 0; i < segments.length; i++) {
      if (cur === undefined || cur === null || typeof cur !== "object" || Array.isArray(cur) || isTagged(cur)) return undefined;
      cur = cur[segments[i]];
    }
    return cur;
  }

  /**
   * Pone `value` en `path` sobre `container`, atravesando arreglos de
   * subdocumentos: si un segmento intermedio es un arreglo, el resto de la
   * ruta se aplica a CADA elemento (como `$set`/`$addFields` de MongoDB sobre
   * `"discos.sello"`), en vez de reemplazar el arreglo por un objeto.
   */
  function setAt(container, segments, idx, value) {
    if (container === null || typeof container !== "object" || isTagged(container)) return;
    if (Array.isArray(container)) {
      container.forEach(function (el) { setAt(el, segments, idx, value); });
      return;
    }
    var key = segments[idx];
    if (idx === segments.length - 1) { container[key] = value; return; }
    if (container[key] === undefined || container[key] === null || typeof container[key] !== "object" || isTagged(container[key])) {
      container[key] = {};
    }
    setAt(container[key], segments, idx + 1, value);
  }

  function setPath(doc, path, value) { setAt(doc, splitPath(path), 0, value); }

  /** Contraparte de `setAt`: borra `path` de `container`, distribuyendo sobre arreglos intermedios. */
  function deleteAt(container, segments, idx) {
    if (container === null || typeof container !== "object" || isTagged(container)) return;
    if (Array.isArray(container)) {
      container.forEach(function (el) { deleteAt(el, segments, idx); });
      return;
    }
    var key = segments[idx];
    if (idx === segments.length - 1) { delete container[key]; return; }
    if (Object.prototype.hasOwnProperty.call(container, key)) deleteAt(container[key], segments, idx + 1);
  }

  function deletePath(doc, path) { deleteAt(doc, splitPath(path), 0); }

  /**
   * Arma el valor incluido de una ruta con puntos para $project en modo
   * inclusión, preservando la ESTRUCTURA (a diferencia de `getExprField`,
   * que aplana): sobre un arreglo de subdocumentos, devuelve un arreglo del
   * mismo largo con cada elemento proyectado (`{}` donde falta el campo),
   * como hace MongoDB con `{ "discos.titulo": 1 }`. Devuelve `undefined` si
   * no hay nada para incluir.
   */
  function buildIncludeAt(val, segments, idx) {
    if (idx === segments.length) return val;
    if (val === undefined || val === null) return undefined;
    if (Array.isArray(val)) {
      var out = [];
      var any = false;
      val.forEach(function (el) {
        var r = buildIncludeAt(el, segments, idx);
        if (r !== undefined) any = true;
        out.push(r === undefined ? {} : r);
      });
      return any ? out : undefined;
    }
    if (typeof val !== "object" || isTagged(val)) return undefined;
    var key = segments[idx];
    if (!Object.prototype.hasOwnProperty.call(val, key)) return undefined;
    var sub = buildIncludeAt(val[key], segments, idx + 1);
    if (sub === undefined) return undefined;
    var o = {};
    o[key] = sub;
    return o;
  }

  /** Combina dos valores incluidos por $project que comparten el mismo campo de tope (p.ej. "discos.titulo" y "discos.anio"). */
  function mergeIncludeValue(a, b) {
    if (b === undefined) return a;
    if (a === undefined) return b;
    if (Array.isArray(a) && Array.isArray(b)) {
      var len = Math.max(a.length, b.length);
      var out = [];
      for (var i = 0; i < len; i++) out.push(mergeIncludeValue(a[i], b[i]));
      return out;
    }
    if (isPlainObject(a) && isPlainObject(b)) {
      var o = {};
      Object.keys(a).forEach(function (k) { o[k] = a[k]; });
      Object.keys(b).forEach(function (k) { o[k] = Object.prototype.hasOwnProperty.call(o, k) ? mergeIncludeValue(o[k], b[k]) : b[k]; });
      return o;
    }
    return b;
  }

  function mergeIncludeInto(target, tree) {
    Object.keys(tree).forEach(function (k) {
      target[k] = Object.prototype.hasOwnProperty.call(target, k) ? mergeIncludeValue(target[k], tree[k]) : tree[k];
    });
  }

  function cloneDoc(doc) {
    if (Array.isArray(doc)) return doc.map(cloneDoc);
    if (isTagged(doc)) return doc.$oid !== undefined ? mkOid(doc.$oid) : mkDate(doc.$date);
    if (doc && typeof doc === "object") {
      var out = {};
      Object.keys(doc).forEach(function (k) { out[k] = cloneDoc(doc[k]); });
      return out;
    }
    return doc;
  }

  function isTruthyExpr(v) {
    // En expresiones de agregación son "falsy" false, null, ausente Y el
    // número 0 (verificado en MongoDB 8.3.11: { $cond: [0, "t", "f"] } da
    // "f"); la cadena vacía y el arreglo vacío son verdaderos.
    return !(v === false || v === null || v === undefined || v === 0);
  }

  function isNumeric(v) { return typeof v === "number" && isFinite(v); }
  function isMissingOrNull(v) { return v === undefined || v === null; }

  // ================================================================
  // 5 · Expresiones — "$campo", literales, y los operadores soportados
  // ================================================================

  var EXPR_OPERATORS = {
    $concat: evalConcat,
    $add: evalAdd,
    $subtract: evalSubtract,
    $multiply: evalMultiply,
    $divide: evalDivide,
    $toUpper: evalToUpper,
    $toLower: evalToLower,
    $size: evalSize,
    $round: evalRound,
    $cond: evalCond,
    $ifNull: evalIfNull,
    $eq: function (doc, a) { var p = twoArgs(doc, a, "$eq"); return exprEquals(p[0], p[1]); },
    $ne: function (doc, a) { var p = twoArgs(doc, a, "$ne"); return !exprEquals(p[0], p[1]); },
    $gt: function (doc, a) { var p = twoArgs(doc, a, "$gt"); return exprCompare(p[0], p[1]) > 0; },
    $gte: function (doc, a) { var p = twoArgs(doc, a, "$gte"); return exprCompare(p[0], p[1]) >= 0; },
    $lt: function (doc, a) { var p = twoArgs(doc, a, "$lt"); return exprCompare(p[0], p[1]) < 0; },
    $lte: function (doc, a) { var p = twoArgs(doc, a, "$lte"); return exprCompare(p[0], p[1]) <= 0; },
    $cmp: function (doc, a) { var p = twoArgs(doc, a, "$cmp"); var c = exprCompare(p[0], p[1]); return c < 0 ? -1 : (c > 0 ? 1 : 0); },
    $and: function (doc, a) { return asArgs(a).every(function (e) { return isTruthyExpr(evalExpr(doc, e)); }); },
    $or: function (doc, a) { return asArgs(a).some(function (e) { return isTruthyExpr(evalExpr(doc, e)); }); },
    $not: function (doc, a) {
      var args = asArgs(a);
      if (args.length !== 1) throw new EngineError("La expresión $not recibe exactamente 1 argumento (MongoDB: \"Expression $not takes exactly 1 arguments\").");
      return !isTruthyExpr(evalExpr(doc, args[0]));
    },
    // $literal devuelve su argumento SIN evaluarlo: { $literal: "$genero" } es la cadena "$genero".
    $literal: function (doc, a) { return a; },
  };

  /** Los dos argumentos ya evaluados de una comparación de expresión ($eq, $gt, …). */
  function twoArgs(doc, a, name) {
    if (!Array.isArray(a) || a.length !== 2) {
      throw new EngineError("La expresión " + name + " recibe exactamente 2 argumentos, como { " + name + ": [\"$campo\", valor] } (MongoDB: \"Expression " + name + " takes exactly 2 arguments\").");
    }
    return [evalExpr(doc, a[0]), evalExpr(doc, a[1])];
  }

  /**
   * Comparación de EXPRESIÓN (no de consulta): a diferencia de $match, no hay
   * "type bracketing" (compara entre tipos con el orden BSON) y el campo
   * ausente es MENOR que null (verificado en MongoDB 8.3.11:
   * { $eq: ["$estilo", null] } da false si estilo falta, { $gt: ["$estilo",
   * null] } también, y { $lte: ["$falta", null] } da true).
   */
  function exprCompare(a, b) {
    if (a === undefined || b === undefined) return a === b ? 0 : (a === undefined ? -1 : 1);
    if (deepEqual(a, b)) return 0;
    return compareBSON(a, b);
  }

  function exprEquals(a, b) {
    if (a === undefined || b === undefined) return a === b;
    return deepEqual(a, b);
  }

  function evalExpr(doc, expr) {
    if (typeof expr === "string") {
      if (expr.length && expr[0] === "$") {
        if (expr[1] === "$") throw new UnsupportedError("Las variables de sistema ($$ROOT, $$NOW, …) no están soportadas en este laboratorio.");
        return getExprField(doc, expr.slice(1));
      }
      return expr;
    }
    if (expr === null || typeof expr === "number" || typeof expr === "boolean" || expr === undefined) return expr;
    if (isTagged(expr)) return expr;
    if (Array.isArray(expr)) return expr.map(function (e) { return evalExpr(doc, e); });
    if (isPlainObject(expr)) {
      var keys = Object.keys(expr);
      if (keys.length === 1 && keys[0][0] === "$") {
        var opName = keys[0];
        var fn = EXPR_OPERATORS[opName];
        if (!fn) throw new UnsupportedError("Expresión no soportada: " + opName + ". Soportadas: " + Object.keys(EXPR_OPERATORS).join(", ") + ".");
        return fn(doc, expr[opName]);
      }
      // Documento literal de expresión: una clave cuyo valor resulta
      // "ausente" NO se escribe (verificado en MongoDB 8.3.11: { g: "$genero",
      // e: "$estilo" } sobre una banda sin estilo da { g: "…" }, sin "e").
      var out = {};
      keys.forEach(function (k) {
        var v = evalExpr(doc, expr[k]);
        if (v !== undefined) out[k] = v;
      });
      return out;
    }
    return expr;
  }

  function asArgs(v) { return Array.isArray(v) ? v : [v]; }

  function evalConcat(doc, argExpr) {
    var args = asArgs(argExpr).map(function (a) { return evalExpr(doc, a); });
    for (var i = 0; i < args.length; i++) {
      if (isMissingOrNull(args[i])) return null;
      if (typeof args[i] !== "string") throw new EngineError("$concat solo admite cadenas (o null/ausente); se recibió " + JSON.stringify(args[i]));
    }
    return args.join("");
  }

  function evalAdd(doc, exprs) {
    var args = asArgs(exprs).map(function (a) { return evalExpr(doc, a); });
    for (var i = 0; i < args.length; i++) if (isMissingOrNull(args[i])) return null;
    for (var j = 0; j < args.length; j++) if (!isNumeric(args[j])) throw new EngineError("$add solo admite números; se recibió " + JSON.stringify(args[j]));
    return args.reduce(function (a, b) { return a + b; }, 0);
  }

  function evalSubtract(doc, exprs) {
    var args = asArgs(exprs).map(function (a) { return evalExpr(doc, a); });
    if (args.length !== 2) throw new EngineError("$subtract necesita exactamente 2 argumentos");
    if (isMissingOrNull(args[0]) || isMissingOrNull(args[1])) return null;
    // Fechas (verificado en MongoDB 8.3.11): fecha - fecha da los
    // MILISEGUNDOS entre las dos; fecha - número da otra fecha (resta ms);
    // número - fecha es un error ("can't $subtract date from int").
    if (isDate(args[0]) && isDate(args[1])) return dateMs(args[0]) - dateMs(args[1]);
    if (isDate(args[0]) && isNumeric(args[1])) return mkDate(new Date(dateMs(args[0]) - args[1]).toISOString());
    if (isDate(args[1])) throw new EngineError("$subtract no puede restar una fecha de un número (MongoDB: \"can't $subtract date from int\").");
    if (!isNumeric(args[0]) || !isNumeric(args[1])) throw new EngineError("$subtract solo admite números o fechas");
    return args[0] - args[1];
  }

  function evalMultiply(doc, exprs) {
    var args = asArgs(exprs).map(function (a) { return evalExpr(doc, a); });
    for (var i = 0; i < args.length; i++) if (isMissingOrNull(args[i])) return null;
    for (var j = 0; j < args.length; j++) if (!isNumeric(args[j])) throw new EngineError("$multiply solo admite números; se recibió " + JSON.stringify(args[j]) + " (¿falta un $unwind antes?)");
    return args.reduce(function (a, b) { return a * b; }, 1);
  }

  function evalDivide(doc, exprs) {
    var args = asArgs(exprs).map(function (a) { return evalExpr(doc, a); });
    if (args.length !== 2) throw new EngineError("$divide necesita exactamente 2 argumentos");
    if (isMissingOrNull(args[0]) || isMissingOrNull(args[1])) return null;
    if (!isNumeric(args[0]) || !isNumeric(args[1])) throw new EngineError("$divide solo admite números");
    if (args[1] === 0) throw new EngineError("$divide por cero");
    return args[0] / args[1];
  }

  function evalToUpper(doc, expr) {
    var v = evalExpr(doc, expr);
    if (isMissingOrNull(v)) return "";
    if (typeof v !== "string") throw new EngineError("$toUpper espera una cadena");
    return v.toUpperCase();
  }

  function evalToLower(doc, expr) {
    var v = evalExpr(doc, expr);
    if (isMissingOrNull(v)) return "";
    if (typeof v !== "string") throw new EngineError("$toLower espera una cadena");
    return v.toLowerCase();
  }

  function evalSize(doc, expr) {
    var v = evalExpr(doc, expr);
    if (!Array.isArray(v)) throw new EngineError("$size requiere un arreglo; se recibió " + JSON.stringify(v));
    return v.length;
  }

  /**
   * "Round half to even" sobre el valor DECIMAL real del double, sin pasar
   * por `value * 10^place` (esa multiplicación puede introducir un empate
   * .5 que el double original no tenía: `2.675 * 100 === 267.5` en JS, pero
   * el double 2.675 es en realidad 2.67499999999999982…, y MongoDB 8.3.11
   * redondea a 2.67, no a 2.68). Se trabaja con `toPrecision(17)`, que
   * alcanza para representar sin ambigüedad cualquier double.
   */
  function roundHalfToEven(value, place) {
    if (!isFinite(value)) return value;
    var sign = value < 0 ? -1 : 1;
    var abs = Math.abs(value);
    var str = abs.toPrecision(17);
    if (str.indexOf("e") !== -1 || str.indexOf("E") !== -1) {
      // Notación exponencial (valores muy grandes o muy chicos): fuera del
      // rango de este laboratorio didáctico; se cae al método simple.
      var factor = Math.pow(10, place);
      return sign * Math.round(abs * factor) / factor;
    }
    var dot = str.indexOf(".");
    var intPart = dot === -1 ? str : str.slice(0, dot);
    var fracPart = dot === -1 ? "" : str.slice(dot + 1);
    var digits = intPart + fracPart;
    var pointPos = intPart.length;
    var cutAt = pointPos + place;
    if (cutAt >= digits.length) return sign * abs;
    if (cutAt < 0) return 0;
    var kept = digits.slice(0, cutAt) || "0";
    var rest = digits.slice(cutAt);
    var firstRest = rest.charCodeAt(0) - 48;
    var roundUp;
    if (firstRest > 5) roundUp = true;
    else if (firstRest < 5) roundUp = false;
    else roundUp = /[1-9]/.test(rest.slice(1)) || ((kept.charCodeAt(kept.length - 1) - 48) % 2 !== 0);
    var keptDigits = kept.split("").map(Number);
    if (roundUp) {
      var i = keptDigits.length - 1;
      while (i >= 0) {
        keptDigits[i]++;
        if (keptDigits[i] === 10) { keptDigits[i] = 0; i--; } else break;
      }
      if (i < 0) keptDigits.unshift(1);
    }
    // `keptDigits` es el valor redondeado expresado en unidades de 10^-place.
    // Con place >= 0 se ubica la coma `place` dígitos desde la derecha; con
    // place < 0 los dígitos descartados vuelven como ceros (verificado en
    // MongoDB 8.3.11: $round [1234.5678, -2] da 1200 y [15, -1] da 20).
    var kd = keptDigits.join("");
    var resultStr;
    if (place <= 0) {
      resultStr = kd + "0".repeat(-place);
    } else {
      while (kd.length <= place) kd = "0" + kd;
      resultStr = kd.slice(0, kd.length - place) + "." + kd.slice(kd.length - place);
    }
    return sign * Number(resultStr);
  }

  function evalRound(doc, exprs) {
    var args = asArgs(exprs);
    var v = evalExpr(doc, args[0]);
    var place = args.length > 1 ? evalExpr(doc, args[1]) : 0;
    if (isMissingOrNull(v)) return null;
    if (!isNumeric(v)) throw new EngineError("$round espera un número");
    return roundHalfToEven(v, place);
  }

  function evalCond(doc, spec) {
    var ifE, thenE, elseE;
    if (Array.isArray(spec)) {
      if (spec.length !== 3) throw new EngineError("$cond en forma de arreglo necesita 3 elementos [if, then, else]");
      ifE = spec[0]; thenE = spec[1]; elseE = spec[2];
    } else if (isPlainObject(spec)) {
      ifE = spec.if; thenE = spec.then; elseE = spec.else;
    } else {
      throw new EngineError("$cond necesita { if, then, else } o [if, then, else]");
    }
    var cond = evalExpr(doc, ifE);
    return isTruthyExpr(cond) ? evalExpr(doc, thenE) : evalExpr(doc, elseE);
  }

  function evalIfNull(doc, exprs) {
    var args = asArgs(exprs);
    if (args.length < 2) throw new EngineError("$ifNull necesita al menos 2 argumentos");
    for (var i = 0; i < args.length - 1; i++) {
      var v = evalExpr(doc, args[i]);
      if (!isMissingOrNull(v)) return v;
    }
    return evalExpr(doc, args[args.length - 1]);
  }

  // ================================================================
  // 6 · $match — operadores de consulta
  // ================================================================

  /**
   * $gt/$gte/$lt/$lte con "type bracketing", como MongoDB: solo comparan
   * valores del MISMO tipo BSON que el valor buscado (una cadena nunca es
   * $gt que un número, ni una fecha $lt que una cadena). Ausente/null nunca
   * participan (ya los saca `isMissingOrNull`, antes de mirar el tipo).
   */
  function bracketedCompare(cands, target, test) {
    var targetRank = typeRank(target);
    return cands.candidates.some(function (v) {
      if (isMissingOrNull(v)) return false;
      if (typeRank(v) !== targetRank) return false;
      return test(compareBSON(v, target));
    });
  }

  /**
   * Detecta cuantificadores anidados —un grupo que ya cuantifica o alterna
   * por dentro, cuantificado otra vez por fuera: (a+)+, (\\w+\\s?)+,
   * (.|.)*, (?:x*){2,}—, la forma típica del "backtracking catastrófico":
   * el motor de expresiones regulares del navegador puede tardar un tiempo
   * exponencial y congelar la pestaña. MongoDB usa PCRE, que tiene límites
   * propios; este laboratorio corre en el navegador y no puede cortar una
   * búsqueda en curso, así que esos patrones se rechazan antes de correr.
   */
  function hasNestedQuantifier(pattern) {
    var stack = [];
    var inClass = false;
    for (var i = 0; i < pattern.length; i++) {
      var c = pattern[i];
      if (c === "\\") { i++; continue; }
      if (inClass) { if (c === "]") inClass = false; continue; }
      if (c === "[") { inClass = true; continue; }
      if (c === "(") { stack.push({ quant: false, alt: false }); continue; }
      if (c === "|" && stack.length) { stack[stack.length - 1].alt = true; continue; }
      var unbounded = c === "+" || c === "*" || (c === "{" && /^\{\d*,\}/.test(pattern.slice(i)));
      if (c === ")") {
        var g = stack.pop() || { quant: false, alt: false };
        var next = pattern[i + 1];
        var outer = next === "+" || next === "*" || (next === "{" && /^\{\d*,\}/.test(pattern.slice(i + 1)));
        if (outer && (g.quant || g.alt)) return true;
        if (stack.length && (g.quant || outer)) stack[stack.length - 1].quant = true;
        continue;
      }
      if (unbounded && stack.length) stack[stack.length - 1].quant = true;
    }
    return false;
  }

  /** Quita espacios y comentarios #… fuera de clases de caracteres: la opción "x" de PCRE, que JS no tiene. */
  function stripExtended(pattern) {
    var out = "";
    var inClass = false;
    for (var i = 0; i < pattern.length; i++) {
      var c = pattern[i];
      if (c === "\\") { out += c + (pattern[i + 1] || ""); i++; continue; }
      if (inClass) { if (c === "]") inClass = false; out += c; continue; }
      if (c === "[") { inClass = true; out += c; continue; }
      if (/\s/.test(c)) continue;
      if (c === "#") { while (i < pattern.length && pattern[i] !== "\n") i++; continue; }
      out += c;
    }
    return out;
  }

  var REGEX_CACHE = {};

  /**
   * Compila un $regex con las opciones de MongoDB: i, m, s, x (y u, que en
   * MongoDB no cambia nada: ya trabaja en UTF-8). Cualquier otra, como g o y,
   * es un error, igual que en MongoDB 8.3.11 ("invalid flag in regex options").
   */
  function compileRegex(pattern, options) {
    if (typeof pattern !== "string") throw new EngineError("$regex necesita una cadena o un literal /…/");
    options = options == null ? "" : String(options);
    var key = options + "\u0000" + pattern;
    if (Object.prototype.hasOwnProperty.call(REGEX_CACHE, key)) return REGEX_CACHE[key];
    var flags = "";
    var extended = false;
    for (var i = 0; i < options.length; i++) {
      var f = options[i];
      if (f === "i" || f === "m" || f === "s") { if (flags.indexOf(f) === -1) flags += f; }
      else if (f === "x") extended = true;
      else if (f === "u") { /* sin efecto */ }
      else throw new EngineError("$regex: opción inválida \"" + f + "\" (MongoDB: \"invalid flag in regex options: " + f + "\"). Opciones válidas: i, m, s, x.");
    }
    var source = extended ? stripExtended(pattern) : pattern;
    if (hasNestedQuantifier(source)) {
      throw new EngineError("$regex con cuantificadores anidados, como (a+)+ o (.|.)*: en el navegador puede tardar un tiempo exponencial (backtracking catastrófico) y congelar la página, así que este laboratorio no la ejecuta. Reescríbala sin repetir un grupo que ya repite o alterna por dentro (por ejemplo, [ab]+ en vez de (a|b)+).");
    }
    var re;
    try { re = new RegExp(source, flags); } catch (e) { throw new EngineError("$regex inválida: " + e.message); }
    REGEX_CACHE[key] = re;
    return re;
  }

  function isRegexSpec(v) {
    return isPlainObject(v) && Object.prototype.hasOwnProperty.call(v, "$regex") &&
      Object.keys(v).every(function (k) { return k === "$regex" || k === "$options"; });
  }

  var QUERY_OPERATORS = {
    $eq: function (cands, target) {
      // { campo: null } empareja con null Y con el campo ausente, como en MongoDB.
      if (target === null) return cands.candidates.some(isMissingOrNull);
      if (Array.isArray(target)) return cands.leaves.some(function (v) { return deepEqual(v, target); });
      return cands.candidates.some(function (v) { return deepEqual(v, target); });
    },
    $ne: function (cands, target) { return !QUERY_OPERATORS.$eq(cands, target); },
    $gt: function (cands, target) { return bracketedCompare(cands, target, function (c) { return c > 0; }); },
    $gte: function (cands, target) { return bracketedCompare(cands, target, function (c) { return c >= 0; }); },
    $lt: function (cands, target) { return bracketedCompare(cands, target, function (c) { return c < 0; }); },
    $lte: function (cands, target) { return bracketedCompare(cands, target, function (c) { return c <= 0; }); },
    $in: function (cands, target) {
      if (!Array.isArray(target)) throw new EngineError("$in necesita un arreglo");
      // Igual que $eq: si el arreglo trae null, también empareja con ausente.
      var hasNull = target.some(function (t) { return t === null; });
      return cands.candidates.some(function (v) {
        if (hasNull && isMissingOrNull(v)) return true;
        return target.some(function (t) {
          // $in admite expresiones regulares entre sus valores: { $in: [/^L/, "AFTERLIFE"] }.
          if (isRegexSpec(t)) return typeof v === "string" && compileRegex(t.$regex, t.$options).test(v);
          return deepEqual(v, t);
        });
      });
    },
    $nin: function (cands, target) { return !QUERY_OPERATORS.$in(cands, target); },
    $exists: function (cands, target) {
      var any = cands.leaves.some(function (v) { return v !== undefined; });
      return target ? any : !any;
    },
    $regex: function (cands, target, options) {
      // Un literal /…/ usado como valor de $regex trae sus propias opciones.
      if (isRegexSpec(target)) { options = options || target.$options; target = target.$regex; }
      var re = compileRegex(target, options);
      return cands.candidates.some(function (v) { return typeof v === "string" && re.test(v); });
    },
    // $size: el campo es un arreglo de exactamente N elementos.
    $size: function (cands, target) {
      if (!isNumeric(target) || Math.floor(target) !== target || target < 0) throw new EngineError("$size necesita un entero no negativo, como { $size: 2 }");
      return cands.leaves.some(function (v) { return Array.isArray(v) && v.length === target; });
    },
    // $all: el campo contiene TODOS los valores (cada uno como si fuera un $eq).
    $all: function (cands, target) {
      if (!Array.isArray(target)) throw new EngineError("$all necesita un arreglo");
      if (!target.length) return false; // MongoDB: $all: [] no empareja ningún documento
      return target.every(function (t) {
        if (isPlainObject(t) && Object.prototype.hasOwnProperty.call(t, "$elemMatch")) return QUERY_OPERATORS.$elemMatch(cands, t.$elemMatch);
        return QUERY_OPERATORS.$eq(cands, t);
      });
    },
    // $elemMatch: UN MISMO elemento del arreglo cumple todas las condiciones.
    $elemMatch: function (cands, target) {
      if (!isPlainObject(target)) throw new EngineError("$elemMatch necesita un documento de condiciones");
      var keys = Object.keys(target);
      var operatorForm = keys.length > 0 && keys.every(function (k) { return k[0] === "$" && k !== "$and" && k !== "$or" && k !== "$nor"; });
      return cands.leaves.some(function (arr) {
        if (!Array.isArray(arr)) return false;
        return arr.some(function (el) {
          // { $gte: 2007, $lt: 2008 } sobre escalares: condiciones sobre el propio elemento.
          if (operatorForm) return evalFieldCondition({ v: el }, "v", target);
          // { anio: …, titulo: … } sobre subdocumentos: un filtro sobre cada elemento.
          return isPlainObject(el) && matchDocument(el, target);
        });
      });
    },
  };

  function evalFieldCondition(doc, path, cond) {
    var cands = getMatchCandidates(doc, path);
    if (isPlainObject(cond) && Object.keys(cond).every(function (k) { return k[0] === "$"; }) && Object.keys(cond).length) {
      var keys = Object.keys(cond);
      var pass = true;
      for (var i = 0; i < keys.length; i++) {
        var op = keys[i];
        if (op === "$options") {
          if (!Object.prototype.hasOwnProperty.call(cond, "$regex")) throw new EngineError("$options sin $regex (MongoDB: \"$options needs a $regex\").");
          continue;
        }
        if (op === "$not") { pass = pass && !evalFieldCondition(doc, path, cond.$not); continue; }
        if (op === "$regex") { pass = pass && QUERY_OPERATORS.$regex(cands, cond.$regex, cond.$options); continue; }
        var fn = QUERY_OPERATORS[op];
        if (!fn) throw new UnsupportedError("Operador de consulta no soportado: " + op + ". Soportados: " + Object.keys(QUERY_OPERATORS).join(", ") + ", $and, $or, $nor, $not.");
        pass = pass && fn(cands, cond[op]);
      }
      return pass;
    }
    return QUERY_OPERATORS.$eq(cands, cond);
  }

  function matchDocument(doc, filter) {
    if (!isPlainObject(filter)) throw new EngineError("$match necesita un documento de filtro");
    var keys = Object.keys(filter);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = filter[key];
      if (key === "$and") {
        if (!Array.isArray(val)) throw new EngineError("$and necesita un arreglo de filtros");
        if (!val.length) throw new EngineError("$and necesita un arreglo NO vacío de filtros (MongoDB: \"$and argument must be a non-empty array\").");
        if (!val.every(function (f) { return matchDocument(doc, f); })) return false;
        continue;
      }
      if (key === "$or") {
        if (!Array.isArray(val)) throw new EngineError("$or necesita un arreglo de filtros");
        if (!val.length) throw new EngineError("$or necesita un arreglo NO vacío de filtros (MongoDB: \"$or argument must be a non-empty array\").");
        if (!val.some(function (f) { return matchDocument(doc, f); })) return false;
        continue;
      }
      if (key === "$nor") {
        if (!Array.isArray(val)) throw new EngineError("$nor necesita un arreglo de filtros");
        if (!val.length) throw new EngineError("$nor necesita un arreglo NO vacío de filtros (MongoDB: \"$nor argument must be a non-empty array\").");
        if (val.some(function (f) { return matchDocument(doc, f); })) return false;
        continue;
      }
      if (key[0] === "$") throw new UnsupportedError("Operador lógico no soportado: " + key + ". Soportados: $and, $or, $nor.");
      if (!evalFieldCondition(doc, key, val)) return false;
    }
    return true;
  }

  // ================================================================
  // 7 · Acumuladores de $group
  // ================================================================

  var ACCUMULATORS = {
    $sum: function (docs, expr) {
      var total = 0;
      docs.forEach(function (d) { var v = evalExpr(d, expr); if (isNumeric(v)) total += v; });
      return total;
    },
    $avg: function (docs, expr) {
      var total = 0, count = 0;
      docs.forEach(function (d) { var v = evalExpr(d, expr); if (isNumeric(v)) { total += v; count++; } });
      return count === 0 ? null : total / count;
    },
    // $min/$max ignoran ausente Y null (verificado: sobre valores con
    // $ifNull a null, MongoDB 8.3.11 devuelve el mínimo/máximo de los
    // valores REALES, no null).
    $min: function (docs, expr) {
      var best;
      docs.forEach(function (d) {
        var v = evalExpr(d, expr);
        if (v === undefined || v === null) return;
        if (best === undefined || compareBSON(v, best) < 0) best = v;
      });
      return best === undefined ? null : best;
    },
    $max: function (docs, expr) {
      var best;
      docs.forEach(function (d) {
        var v = evalExpr(d, expr);
        if (v === undefined || v === null) return;
        if (best === undefined || compareBSON(v, best) > 0) best = v;
      });
      return best === undefined ? null : best;
    },
    // $push/$addToSet NO agregan nada cuando la expresión da "ausente"
    // (verificado contra MongoDB 8.3.11); un valor null explícito sí se
    // agrega.
    $push: function (docs, expr) {
      var out = [];
      docs.forEach(function (d) { var v = evalExpr(d, expr); if (v !== undefined) out.push(v); });
      return out;
    },
    $addToSet: function (docs, expr) {
      var out = [];
      docs.forEach(function (d) {
        var v = evalExpr(d, expr);
        if (v === undefined) return;
        if (!out.some(function (e) { return deepEqual(e, v); })) out.push(v);
      });
      return out;
    },
    // $first/$last sobre un campo ausente devuelven null, no "ausente"
    // (verificado en MongoDB 8.3.11).
    $first: function (docs, expr) { var v = docs.length ? evalExpr(docs[0], expr) : null; return v === undefined ? null : v; },
    $last: function (docs, expr) { var v = docs.length ? evalExpr(docs[docs.length - 1], expr) : null; return v === undefined ? null : v; },
    $count: function (docs) { return docs.length; },
  };

  function groupKeyString(v) {
    if (isOid(v)) return "oid:" + v.$oid;
    if (isDate(v)) return "date:" + v.$date;
    if (v === null) return "null";
    if (v === undefined) return "undef";
    if (Array.isArray(v)) return "[" + v.map(groupKeyString).join(",") + "]";
    if (typeof v === "object") return "{" + Object.keys(v).sort().map(function (k) { return k + ":" + groupKeyString(v[k]); }).join(",") + "}";
    return typeof v + ":" + String(v);
  }

  function runGroup(docs, spec) {
    if (!isPlainObject(spec) || !("_id" in spec)) {
      throw new EngineError("$group exige la clave \"_id\" (obligatoria; null agrupa todo el pipeline en un solo documento) — ver 2.12.08, § 2.");
    }
    var idExpr = spec._id;
    var accSpecs = Object.keys(spec).filter(function (k) { return k !== "_id"; });
    accSpecs.forEach(function (field) {
      var accDoc = spec[field];
      if (!isPlainObject(accDoc) || Object.keys(accDoc).length !== 1) {
        throw new EngineError("El campo \"" + field + "\" de $group necesita un acumulador, como { $sum: 1 } — el resto de las claves de $group son siempre acumuladores.");
      }
    });

    var order = [];
    var groups = {};
    docs.forEach(function (d) {
      var idVal = evalExpr(d, idExpr);
      // Agrupar por un campo ausente da _id: null en MongoDB, no "ausente"
      // (verificado: { $group: { _id: "$estilo", ... } } sobre documentos sin
      // "estilo" produce un grupo con _id: null, no un grupo sin _id).
      if (idVal === undefined) idVal = null;
      var key = groupKeyString(idVal);
      if (!groups[key]) { groups[key] = { id: idVal, docs: [] }; order.push(key); }
      groups[key].docs.push(d);
    });

    return order.map(function (key) {
      var g = groups[key];
      var out = { _id: g.id };
      accSpecs.forEach(function (field) {
        var accDoc = spec[field];
        var opName = Object.keys(accDoc)[0];
        var fn = ACCUMULATORS[opName];
        if (!fn) throw new UnsupportedError("Acumulador no soportado: " + opName + ". Soportados: " + Object.keys(ACCUMULATORS).join(", ") + ".");
        out[field] = fn(g.docs, accDoc[opName]);
      });
      return out;
    });
  }

  // ================================================================
  // 8 · $project / $addFields / $set
  // ================================================================

  function isPureInclusion(v) { return v === 1 || v === true; }
  function isPureExclusion(v) { return v === 0 || v === false; }

  function runProject(docs, spec) {
    if (!isPlainObject(spec) || !Object.keys(spec).length) throw new EngineError("$project necesita al menos un campo");
    var keys = Object.keys(spec);
    var idSpec = Object.prototype.hasOwnProperty.call(spec, "_id") ? spec._id : undefined;
    var otherKeys = keys.filter(function (k) { return k !== "_id"; });

    var pureInclusionKeys = otherKeys.filter(function (k) { return isPureInclusion(spec[k]); });
    var pureExclusionKeys = otherKeys.filter(function (k) { return isPureExclusion(spec[k]); });
    var exprKeys = otherKeys.filter(function (k) { return !isPureInclusion(spec[k]) && !isPureExclusion(spec[k]); });

    // Como en MongoDB: mezclar inclusión (1/expresión) y exclusión (0) en un
    // mismo $project —salvo _id— es un error, no "prioriza la inclusión"
    // (verificado: MongoDB 8.3.11 rechaza { nombre: 1, estilo: 0 } con
    // "Cannot do exclusion on field estilo in inclusion projection").
    var inclusionMode;
    if (otherKeys.length === 0) {
      // { $project: { _id: 0 } } es EXCLUSIÓN (saca solo _id, conserva el
      // resto); { $project: { _id: 1 } } o sin _id es inclusión trivial.
      inclusionMode = !isPureExclusion(idSpec);
    } else if (pureExclusionKeys.length && (pureInclusionKeys.length || exprKeys.length)) {
      var bad = pureExclusionKeys[0];
      throw new EngineError("No se puede mezclar inclusión y exclusión en un mismo $project (salvo _id) — MongoDB: \"Cannot do exclusion on field " + bad + " in inclusion projection\".");
    } else {
      inclusionMode = pureExclusionKeys.length === 0;
    }

    return docs.map(function (doc) {
      if (inclusionMode) {
        var out = {};
        // _id: 1/ausente conserva el _id original; _id: 0 lo saca; cualquier
        // otra cosa es una expresión que lo RENOMBRA (verificado: { _id:
        // "$nombre" } cambia el _id de salida, no conserva el ObjectId).
        if (idSpec === undefined || isPureInclusion(idSpec)) {
          if (doc._id !== undefined) out._id = doc._id;
        } else if (!isPureExclusion(idSpec)) {
          var idVal = evalExpr(doc, idSpec);
          if (idVal !== undefined) out._id = idVal;
        }
        // Los campos incluidos (1/true) van en el orden del DOCUMENTO
        // ORIGINAL; los calculados, en el orden del spec — como MongoDB.
        var docKeys = Object.keys(doc);
        docKeys.forEach(function (topKey) {
          pureInclusionKeys.forEach(function (k) {
            if (splitPath(k)[0] !== topKey) return;
            var tree = buildIncludeAt(doc, splitPath(k), 0);
            if (tree !== undefined) mergeIncludeInto(out, tree);
          });
        });
        exprKeys.forEach(function (k) {
          var computed = evalExpr(doc, spec[k]);
          if (computed !== undefined) setPath(out, k, computed);
        });
        return out;
      }
      var out2 = cloneDoc(doc);
      if (isPureExclusion(idSpec)) delete out2._id;
      pureExclusionKeys.forEach(function (k) { deletePath(out2, k); });
      return out2;
    });
  }

  function runAddFields(docs, spec) {
    if (!isPlainObject(spec) || !Object.keys(spec).length) throw new EngineError("$addFields/$set necesita al menos un campo");
    var keys = Object.keys(spec);
    return docs.map(function (doc) {
      var out = cloneDoc(doc);
      keys.forEach(function (k) {
        var v = evalExpr(doc, spec[k]);
        // Si la expresión da "ausente", el campo NO se agrega — y si ya
        // existía, se saca (verificado: $addFields con un campo existente
        // reasignado a una expresión ausente elimina ese campo del doc).
        if (v === undefined) deletePath(out, k); else setPath(out, k, v);
      });
      return out;
    });
  }

  // ================================================================
  // 9 · $sort / $limit / $skip / $count / $unwind / $lookup / $sortByCount
  // ================================================================

  /**
   * Valor de una ruta con puntos para $sort. A diferencia de una EXPRESIÓN
   * "$campo" ($group/$project/$addFields, `getExprField`), la clave de orden
   * de $sort se genera como la de un índice: SÍ soporta índice numérico
   * literal (verificado: `$sort: { "location.0": 1 }` ordena geográficamente
   * por longitud, tanto en `.aggregate()` como en `.find().sort()`; en
   * cambio, "$location.0" como expresión — $group/$project/$addFields — da
   * un arreglo vacío, no el valor indexado). Por eso reutiliza `resolvePath`
   * (la misma resolución que usa $match), no `getExprField`.
   */
  function getSortField(doc, path) {
    var r = resolvePath(doc, path);
    if (!r.sawArray && r.values.length === 1) return r.values[0];
    return r.values;
  }

  /**
   * Valor de una clave de $sort: si el campo es un ARREGLO, MongoDB no lo
   * compara lexicográficamente — usa el elemento MÍNIMO cuando la dirección
   * es ascendente y el MÁXIMO cuando es descendente (verificado: ordenar
   * bandas por "discos.anio" asc las ordena por el año más viejo de cada
   * una, no por el arreglo entero).
   */
  function sortKeyValue(doc, path, dir) {
    var v = getSortField(doc, path);
    if (Array.isArray(v)) {
      if (!v.length) return undefined;
      var best = v[0];
      for (var i = 1; i < v.length; i++) {
        var c = compareBSON(v[i], best);
        if (dir === 1 ? c < 0 : c > 0) best = v[i];
      }
      return best;
    }
    return v;
  }

  function runSort(docs, spec) {
    if (!isPlainObject(spec) || !Object.keys(spec).length) throw new EngineError("$sort necesita al menos un campo, como { campo: 1 } o { campo: -1 }");
    var keys = Object.keys(spec);
    keys.forEach(function (k) { if (spec[k] !== 1 && spec[k] !== -1) throw new EngineError("$sort solo admite 1 (ascendente) o -1 (descendente); se recibió " + JSON.stringify(spec[k]) + " para \"" + k + "\""); });
    var withIndex = docs.map(function (d, i) { return { d: d, i: i }; });
    withIndex.sort(function (a, b) {
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var va = sortKeyValue(a.d, k, spec[k]);
        var vb = sortKeyValue(b.d, k, spec[k]);
        var c = compareBSON(va, vb) * spec[k];
        if (c !== 0) return c;
      }
      return a.i - b.i; // orden estable
    });
    return withIndex.map(function (x) { return x.d; });
  }

  function runLimit(docs, n) {
    if (typeof n !== "number" || !isFinite(n) || n <= 0) throw new EngineError("$limit necesita un número positivo (MongoDB: \"the limit must be positive\").");
    if (Math.floor(n) !== n) throw new EngineError("$limit necesita un entero (MongoDB: \"Expected an integer\").");
    return docs.slice(0, n);
  }

  function runSkip(docs, n) {
    if (typeof n !== "number" || !isFinite(n) || n < 0) throw new EngineError("$skip necesita un número no negativo (MongoDB: \"Expected a non-negative number\").");
    if (Math.floor(n) !== n) throw new EngineError("$skip necesita un entero (MongoDB: \"Expected an integer\").");
    return docs.slice(n);
  }

  function runCount(docs, fieldName) {
    if (typeof fieldName !== "string" || !fieldName.length) throw new EngineError("$count necesita el nombre del campo de salida, como \"total\"");
    if (docs.length === 0) return []; // MongoDB: $count sobre 0 documentos no emite ningún documento
    var out = {};
    out[fieldName] = docs.length;
    return [out];
  }

  function normalizeUnwindSpec(spec) {
    if (typeof spec === "string") return { path: spec[0] === "$" ? spec.slice(1) : spec, includeArrayIndex: null, preserveNullAndEmptyArrays: false };
    if (isPlainObject(spec) && typeof spec.path === "string") {
      var p = spec.path[0] === "$" ? spec.path.slice(1) : spec.path;
      return { path: p, includeArrayIndex: spec.includeArrayIndex || null, preserveNullAndEmptyArrays: !!spec.preserveNullAndEmptyArrays };
    }
    throw new EngineError("$unwind necesita \"$campo\" o { path: \"$campo\", preserveNullAndEmptyArrays, includeArrayIndex }");
  }

  function runUnwind(docs, rawSpec) {
    var spec = normalizeUnwindSpec(rawSpec);
    var out = [];
    docs.forEach(function (doc) {
      // $unwind usa el valor DIRECTO de la ruta (sin mapear sobre arreglos
      // intermedios): "discos.titulo" con "discos" arreglo no es un arreglo
      // desarmable, es una ruta que no existe (0 documentos en MongoDB).
      var val = getDirectField(doc, spec.path);
      var wasArray = Array.isArray(val);
      if (val === undefined || val === null || (wasArray && val.length === 0)) {
        if (spec.preserveNullAndEmptyArrays) {
          var kept = cloneDoc(doc);
          // Con un arreglo VACÍO el campo desaparece del documento conservado;
          // con null o ausente queda como estaba (verificado en MongoDB 8.3.11).
          if (wasArray) deletePath(kept, spec.path);
          if (spec.includeArrayIndex) setPath(kept, spec.includeArrayIndex, null);
          out.push(kept);
        }
        return;
      }
      var items = wasArray ? val : [val];
      items.forEach(function (item, idx) {
        var clone = cloneDoc(doc);
        setPath(clone, spec.path, item);
        // Si el valor original NO era un arreglo (se desarmó como si fuera
        // uno de un elemento), el índice es null, no 0 (verificado contra
        // MongoDB 8.3.11).
        if (spec.includeArrayIndex) setPath(clone, spec.includeArrayIndex, wasArray ? idx : null);
        out.push(clone);
      });
    });
    return out;
  }

  function runLookup(collections, docs, spec) {
    if (!isPlainObject(spec) || !spec.from || !spec.localField || !spec.foreignField || !spec.as) {
      throw new EngineError("$lookup necesita { from, localField, foreignField, as }");
    }
    var foreignDocs = collections[spec.from] || [];
    if (!collections[spec.from]) {
      // Colección inexistente: MongoDB no da error, devuelve cero coincidencias (ver 2.12.08, "bug" del slide 48-49).
    }
    // Índice de la colección foránea por valor de foreignField (un Map, como
    // el índice que usaría MongoDB sobre _id): deja el $lookup en O(n + m) en
    // vez de comparar cada documento contra todos los de la otra colección.
    // Candidatos "explotados" (como en $match): si localField/foreignField
    // atraviesan un arreglo (p.ej. "items.producto_id" o "discos.anio"),
    // MongoDB empareja contra CUALQUIER elemento, no contra el arreglo
    // entero (verificado: productos → ordenes.items.producto_id).
    var index = new Map();
    foreignDocs.forEach(function (fdoc, fi) {
      var seen = {};
      getMatchCandidates(fdoc, spec.foreignField).candidates.forEach(function (fv) {
        var k = lookupKey(fv);
        if (seen[k]) return;
        seen[k] = true;
        if (!index.has(k)) index.set(k, []);
        index.get(k).push(fi);
      });
    });
    var embedded = 0;
    var matchesPerDoc = docs.map(function (doc) {
      var hit = {};
      var positions = [];
      getMatchCandidates(doc, spec.localField).candidates.forEach(function (lv) {
        (index.get(lookupKey(lv)) || []).forEach(function (fi) {
          if (!hit[fi]) { hit[fi] = true; positions.push(fi); }
        });
      });
      positions.sort(function (a, b) { return a - b; });
      embedded += positions.length;
      return positions;
    });
    if (embedded > MAX_LOOKUP_EMBEDDED) {
      throw new EngineError("Este $lookup embebería " + embedded.toLocaleString("es-AR") + " documentos en total (más de " + MAX_LOOKUP_EMBEDDED.toLocaleString("es-AR") + "). Es un límite de este laboratorio, que corre en el navegador y lo corta para no congelar la página; MongoDB sí lo ejecutaría. Agregue antes un $match o un $limit que reduzca la entrada.");
    }
    return docs.map(function (doc, i) {
      var out = cloneDoc(doc);
      setPath(out, spec.as, matchesPerDoc[i].map(function (fi) { return cloneDoc(foreignDocs[fi]); }));
      return out;
    });
  }

  /** Tope de documentos embebidos por un $lookup (suma sobre toda la salida). */
  var MAX_LOOKUP_EMBEDDED = 500000;

  /**
   * Clave de igualdad para el índice de $lookup, con la misma semántica que
   * `deepEqual` (subdocumentos con las mismas claves en el mismo orden;
   * fechas por instante) y con null y "ausente" en la misma clave: en $lookup
   * null empareja con null y con el campo ausente.
   */
  function lookupKey(v) {
    if (v === undefined || v === null) return "null";
    if (isOid(v)) return "o:" + v.$oid;
    if (isDate(v)) return "d:" + dateMs(v);
    if (Array.isArray(v)) return "[" + v.map(lookupKey).join(",") + "]";
    if (typeof v === "object") return "{" + Object.keys(v).map(function (k) { return JSON.stringify(k) + ":" + lookupKey(v[k]); }).join(",") + "}";
    if (typeof v === "string") return "s:" + JSON.stringify(v);
    return typeof v + ":" + String(v);
  }

  function runSortByCount(docs, expr) {
    var grouped = runGroup(docs, { _id: expr, count: { $sum: 1 } });
    return runSort(grouped, { count: -1 });
  }

  // ================================================================
  // 10 · Etapas — despacho
  // ================================================================

  var STAGE_NAMES = ["$match", "$project", "$addFields", "$set", "$group", "$sort", "$limit", "$skip", "$count", "$unwind", "$lookup", "$sortByCount"];

  function runStage(collections, docs, stageDoc) {
    if (!isPlainObject(stageDoc) || Object.keys(stageDoc).length !== 1) {
      throw new EngineError("Cada etapa es un documento con UNA sola clave, como { $match: { ... } }");
    }
    var name = Object.keys(stageDoc)[0];
    var arg = stageDoc[name];
    switch (name) {
      case "$match": return matchStage(docs, arg);
      case "$project": return runProject(docs, arg);
      case "$addFields": case "$set": return runAddFields(docs, arg);
      case "$group": return runGroup(docs, arg);
      case "$sort": return runSort(docs, arg);
      case "$limit": return runLimit(docs, arg);
      case "$skip": return runSkip(docs, arg);
      case "$count": return runCount(docs, arg);
      case "$unwind": return runUnwind(docs, arg);
      case "$lookup": return runLookup(collections, docs, arg);
      case "$sortByCount": return runSortByCount(docs, arg);
      default:
        throw new UnsupportedError("Etapa no soportada: " + name + ". Soportadas: " + STAGE_NAMES.join(", ") + ".");
    }
  }

  function matchStage(docs, filter) {
    return docs.filter(function (d) { return matchDocument(d, filter); });
  }

  /**
   * Corre el pipeline entero sobre `collections[baseCollection]`, etapa por
   * etapa, devolviendo el estado de CADA una (entrada/salida/error) para que
   * la interfaz pueda mostrar "qué sale de la etapa N".
   *
   * `stages`: [{ enabled: bool, text: string }]. Las deshabilitadas no
   * corren (no participan del pipeline) y se marcan como tales.
   */
  function runPipeline(collections, baseCollection, stages) {
    var base = collections[baseCollection];
    if (!base) {
      return { ok: false, error: "La colección \"" + baseCollection + "\" no existe en este dataset.", steps: [] };
    }
    var current = base.map(cloneDoc);
    var steps = [];
    var halted = false;
    var haltReason = null;

    stages.forEach(function (stage, idx) {
      var parsed = parseRelaxedJSON(stage.text);
      var step = { index: idx, enabled: !!stage.enabled, parsed: parsed, input: null, output: null, count: null, error: null, skippedReason: null };
      if (!stage.enabled) {
        step.skippedReason = "Etapa desactivada: no participa del pipeline.";
        steps.push(step);
        return;
      }
      if (halted) {
        step.skippedReason = "No se evaluó: una etapa anterior falló (" + haltReason + ").";
        steps.push(step);
        return;
      }
      if (!parsed.ok) {
        step.error = parsed.error;
        halted = true; haltReason = "error de sintaxis en la etapa " + (idx + 1);
        steps.push(step);
        return;
      }
      step.input = current;
      try {
        current = runStage(collections, current, parsed.value);
        step.output = current;
        step.count = current.length;
      } catch (err) {
        step.error = (err && err.message) ? err.message : String(err);
        halted = true; haltReason = "error en la etapa " + (idx + 1);
      }
      steps.push(step);
    });

    return { ok: !halted, error: halted ? haltReason : null, steps: steps, finalDocs: halted ? null : current };
  }

  // ================================================================
  // 11 · Formato para mostrar — mongosh-like, sin innerHTML
  // ================================================================

  function formatScalar(v) {
    if (v === undefined) return "—";
    if (v === null) return "null";
    if (isOid(v)) return "ObjectId(\"" + v.$oid + "\")";
    if (isDate(v)) return "ISODate(\"" + v.$date + "\")";
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "number") return String(v);
    if (typeof v === "boolean") return String(v);
    return null; // no escalar
  }

  function formatValue(v, indent) {
    indent = indent || 0;
    var scalar = formatScalar(v);
    if (scalar !== null) return scalar;
    var pad = "  ".repeat(indent + 1);
    var padEnd = "  ".repeat(indent);
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      return "[\n" + v.map(function (e) { return pad + formatValue(e, indent + 1); }).join(",\n") + "\n" + padEnd + "]";
    }
    if (v && typeof v === "object") {
      var keys = Object.keys(v);
      if (!keys.length) return "{}";
      return "{\n" + keys.map(function (k) { return pad + k + ": " + formatValue(v[k], indent + 1); }).join(",\n") + "\n" + padEnd + "}";
    }
    return String(v);
  }

  function formatCell(v) {
    var scalar = formatScalar(v);
    if (scalar !== null) return v === undefined ? "—" : (typeof v === "string" ? v : scalar);
    return formatValue(v).replace(/\n\s*/g, " ");
  }

  // ================================================================
  // 12 · Registro del motor puro
  // ================================================================

  App.bdiiLab.engines["aggregation"] = {
    parseRelaxedJSON: parseRelaxedJSON,
    runStage: runStage,
    runPipeline: runPipeline,
    matchDocument: matchDocument,
    evalExpr: evalExpr,
    compareBSON: compareBSON,
    deepEqual: deepEqual,
    resolvePath: resolvePath,
    formatValue: formatValue,
    formatCell: formatCell,
    formatScalar: formatScalar,
    mkOid: mkOid,
    mkDate: mkDate,
    isOid: isOid,
    isDate: isDate,
    STAGE_NAMES: STAGE_NAMES,
    QUERY_OPERATOR_NAMES: Object.keys(QUERY_OPERATORS),
    EXPR_OPERATOR_NAMES: Object.keys(EXPR_OPERATORS),
    ACCUMULATOR_NAMES: Object.keys(ACCUMULATORS),
  };

  var Engine = App.bdiiLab.engines["aggregation"];

  // ================================================================
  // 13 · Interfaz — presets, retos, y el editor de pipeline
  // ================================================================

  var STAGE_INFO = {
    $match: { sql: "WHERE (o HAVING si va después de $group)", desc: "Filtra documentos con la misma sintaxis de find()." },
    $project: { sql: "SELECT", desc: "Elige, renombra y calcula campos; 0/1 incluyen o excluyen (no se mezclan, salvo _id)." },
    $addFields: { sql: "— (SELECT *, expr AS campo)", desc: "Agrega o recalcula campos sin sacar los demás." },
    $set: { sql: "— (alias de $addFields)", desc: "Igual que $addFields: agrega o recalcula campos." },
    $group: { sql: "GROUP BY + funciones de agregación", desc: "Agrupa por _id (obligatoria; null agrupa todo) y acumula el resto de los campos." },
    $sort: { sql: "ORDER BY", desc: "Ordena; 1 ascendente, -1 descendente. Con empates, MongoDB no garantiza el orden entre ellos." },
    $limit: { sql: "LIMIT", desc: "Corta a los primeros N documentos que llegan a la etapa." },
    $skip: { sql: "OFFSET", desc: "Saltea los primeros N documentos." },
    $count: { sql: "SELECT COUNT(*)", desc: "Cuenta los documentos que llegan; si llegan 0, no emite ningún documento (no {total: 0})." },
    $unwind: { sql: "— (inverso de embeber)", desc: "Un documento de salida por elemento del arreglo; descarta los que quedan con arreglo vacío o ausente, salvo preserveNullAndEmptyArrays." },
    $lookup: { sql: "LEFT JOIN", desc: "Left outer join contra otra colección de la MISMA base; siempre agrega un ARREGLO, aunque empareje uno solo. null empareja con null y con campo ausente." },
    $sortByCount: { sql: "GROUP BY … ORDER BY COUNT(*) DESC", desc: "Atajo de { $group: { _id: expr, count: { $sum: 1 } } } + { $sort: { count: -1 } }." },
  };

  var STAGE_TEMPLATES = [
    { value: "$match", text: "{ $match: {  } }" },
    { value: "$project", text: "{ $project: { _id: 0 } }" },
    { value: "$addFields", text: "{ $addFields: {  } }" },
    { value: "$set", text: "{ $set: {  } }" },
    { value: "$group", text: "{ $group: { _id: null } }" },
    { value: "$sort", text: "{ $sort: {  } }" },
    { value: "$limit", text: "{ $limit: 10 }" },
    { value: "$skip", text: "{ $skip: 0 }" },
    { value: "$count", text: "{ $count: \"total\" }" },
    { value: "$unwind", text: "{ $unwind: \"$campo\" }" },
    { value: "$lookup", text: "{ $lookup: { from: \"coleccion\", localField: \"campo\", foreignField: \"_id\", as: \"salida\" } }" },
    { value: "$sortByCount", text: "{ $sortByCount: \"$campo\" }" },
  ];

  function stageTypeOf(text) {
    var parsed = Engine.parseRelaxedJSON(text);
    if (!parsed.ok || !parsed.value || typeof parsed.value !== "object") return null;
    var keys = Object.keys(parsed.value);
    return keys.length === 1 ? keys[0] : null;
  }

  // ---------------------------------------------------------------
  // Presets — tomados del material real del vault, con origen rotulado
  // ---------------------------------------------------------------

  var VIEW_BANDAS_RESUMEN = "{ $project: { _id: 0, nombre: 1, genero: 1, barrio: 1, integrantes: 1 } }";

  var PRESETS = [
    {
      id: "tp9i-10", label: "TP9 I ejercicio 10 — promedio de integrantes por género",
      origen: "Práctica 2026-09-15 (TP9 Parte I), ejercicio 10", collection: "bandas",
      stages: [VIEW_BANDAS_RESUMEN, "{ $group: { _id: \"$genero\", promedio_integrantes: { $avg: \"$integrantes\" } } }", "{ $sort: { _id: 1 } }"],
    },
    {
      id: "tp9i-11", label: "TP9 I ejercicio 11 — bandas por barrio, de más a menos musical",
      origen: "Práctica 2026-09-15 (TP9 Parte I), ejercicio 11", collection: "bandas",
      stages: [VIEW_BANDAS_RESUMEN, "{ $group: { _id: \"$barrio\", cantidad: { $sum: 1 } } }", "{ $sort: { cantidad: -1, _id: 1 } }"],
    },
    {
      id: "tp9ii-4b", label: "TP9 II 4.b — egresados por carrera",
      origen: "Práctica 2026-09-22 (TP9 Parte II), ejercicio 4.b", collection: "egresados",
      stages: ["{ $group: { _id: \"$titulo\", cantidad: { $sum: 1 } } }", "{ $sort: { cantidad: -1 } }"],
    },
    {
      id: "tp9ii-4c", label: "TP9 II 4.c — egresados por colación",
      origen: "Práctica 2026-09-22 (TP9 Parte II), ejercicio 4.c", collection: "egresados",
      stages: ["{ $group: { _id: \"$colacion\", cantidad: { $sum: 1 } } }", "{ $sort: { cantidad: -1 } }"],
    },
    {
      id: "tp9ii-6a", label: "TP9 II 6.a — traducir un WHERE de SQL",
      origen: "Práctica 2026-09-22 (TP9 Parte II), ejercicio 6.a", collection: "bandas",
      sql: "SELECT nombre_solista FROM bandas WHERE genero = 'ROCK' AND integrantes > 2;",
      stages: ["{ $match: { genero: 'ROCK', integrantes: { $gt: 2 } } }", "{ $project: { _id: 0, nombre: 1 } }"],
    },
    {
      id: "tp9ii-6b", label: "TP9 II 6.b — traducir un GROUP BY con WHERE de SQL",
      origen: "Práctica 2026-09-22 (TP9 Parte II), ejercicio 6.b", collection: "bandas",
      sql: "SELECT genero, AVG(integrantes) AS promedio_integrantes, count(*) AS cant_bandas\nFROM bandas\nWHERE fecha_incripcion <= '2017-11-27'\nGROUP BY genero\nORDER BY promedio_integrantes DESC;",
      stages: [
        "{ $match: { fecha_inscripcion: { $lte: new Date('2017-11-27') } } }",
        "{ $group: { _id: '$genero', promedio_integrantes: { $avg: '$integrantes' }, cant_bandas: { $sum: 1 } } }",
        "{ $sort: { promedio_integrantes: -1 } }",
      ],
    },
    {
      id: "eco-p1", label: "Ecommerce, pregunta 1 — total gastado por cliente",
      origen: "Consigna MongoDB (solución), Clase 14 § Material complementario (a), pregunta 1", collection: "ordenes",
      stages: [
        "{ $unwind: \"$items\" }",
        "{ $lookup: { from: \"productos\", localField: \"items.producto_id\", foreignField: \"_id\", as: \"producto\" } }",
        "{ $unwind: \"$producto\" }",
        "{ $group: { _id: \"$cliente_id\", total: { $sum: { $multiply: [\"$items.cantidad\", \"$producto.precio\"] } } } }",
        "{ $lookup: { from: \"clientes\", localField: \"_id\", foreignField: \"_id\", as: \"cliente\" } }",
        "{ $unwind: \"$cliente\" }",
        "{ $project: { _id: 0, nombre: \"$cliente.nombre\", email: \"$cliente.email\", totalGastado: \"$total\" } }",
        "{ $sort: { totalGastado: -1 } }",
      ],
    },
    {
      id: "eco-p2", label: "Ecommerce, pregunta 2 — producto más vendido",
      origen: "Consigna MongoDB (solución), Clase 14 § Material complementario (a), pregunta 2 — hay empate, ver el aviso", collection: "ordenes",
      nota: "Auriculares Bluetooth y Libro MongoDB venden 3 unidades cada uno: hay empate. El $sort ordena solo por totalUnidades y el $limit:1 corta sin desempatar, así que MongoDB (y este laboratorio) puede devolver cualquiera de los dos, y el ganador puede cambiar entre corridas.",
      stages: [
        "{ $unwind: \"$items\" }",
        "{ $group: { _id: \"$items.producto_id\", totalUnidades: { $sum: \"$items.cantidad\" } } }",
        "{ $lookup: { from: \"productos\", localField: \"_id\", foreignField: \"_id\", as: \"producto\" } }",
        "{ $unwind: \"$producto\" }",
        "{ $project: { _id: 0, nombreProducto: \"$producto.nombre\", totalUnidades: 1 } }",
        "{ $sort: { totalUnidades: -1 } }",
        "{ $limit: 1 }",
      ],
    },
    {
      id: "eco-p3", label: "Ecommerce, pregunta 3 — ventas por categoría",
      origen: "Consigna MongoDB (solución), Clase 14 § Material complementario (a), pregunta 3", collection: "ordenes",
      stages: [
        "{ $unwind: \"$items\" }",
        "{ $lookup: { from: \"productos\", localField: \"items.producto_id\", foreignField: \"_id\", as: \"producto\" } }",
        "{ $unwind: \"$producto\" }",
        "{ $group: { _id: \"$producto.categoria\", totalUnidades: { $sum: \"$items.cantidad\" }, totalIngresos: { $sum: { $multiply: [\"$items.cantidad\", \"$producto.precio\"] } } } }",
        "{ $project: { categoria: \"$_id\", totalUnidades: 1, totalIngresos: 1, _id: 0 } }",
      ],
    },
    {
      id: "eco-p4", label: "Ecommerce, pregunta 4 — top 5 clientes con país",
      origen: "Consigna MongoDB (solución), Clase 14 § Material complementario (a), pregunta 4 — corregida (ver callout)", collection: "ordenes",
      nota: "La consigna pide nombre, país y monto total. La solución oficial solo agrega { $limit: 5 } al pipeline de la pregunta 1 y por eso proyecta email en vez de país; este preset ya trae el $project corregido (pais en vez de email). Con solo 3 clientes, el $limit:5 no recorta nada: el ejercicio está pensado para un dataset más grande.",
      stages: [
        "{ $unwind: \"$items\" }",
        "{ $lookup: { from: \"productos\", localField: \"items.producto_id\", foreignField: \"_id\", as: \"producto\" } }",
        "{ $unwind: \"$producto\" }",
        "{ $group: { _id: \"$cliente_id\", total: { $sum: { $multiply: [\"$items.cantidad\", \"$producto.precio\"] } } } }",
        "{ $lookup: { from: \"clientes\", localField: \"_id\", foreignField: \"_id\", as: \"cliente\" } }",
        "{ $unwind: \"$cliente\" }",
        "{ $project: { _id: 0, nombre: \"$cliente.nombre\", pais: \"$cliente.pais\", montoTotal: \"$total\" } }",
        "{ $sort: { montoTotal: -1 } }",
        "{ $limit: 5 }",
      ],
    },
    {
      id: "eco-p5", label: "Ecommerce, pregunta 5 — productos comprados por cliente",
      origen: "Consigna MongoDB (solución), Clase 14 § Material complementario (a), pregunta 5", collection: "ordenes",
      stages: [
        "{ $lookup: { from: \"clientes\", localField: \"cliente_id\", foreignField: \"_id\", as: \"cliente\" } }",
        "{ $unwind: \"$cliente\" }",
        "{ $unwind: \"$items\" }",
        "{ $lookup: { from: \"productos\", localField: \"items.producto_id\", foreignField: \"_id\", as: \"producto\" } }",
        "{ $unwind: \"$producto\" }",
        "{ $group: { _id: \"$cliente.nombre\", productosComprados: { $push: \"$producto.nombre\" } } }",
      ],
    },
  ];

  // ---------------------------------------------------------------
  // Retos — 3 desafíos cortos, con "Comprobar" sobre el pipeline actual
  // ---------------------------------------------------------------

  /**
   * Compara dos resultados como CONJUNTOS de documentos (sin importar el
   * orden): hace falta para "Comprobar" un reto, porque dos pipelines
   * distintos pueden llegar al mismo conjunto de documentos en otro orden.
   */
  function sameDocSet(a, b) {
    if (a.length !== b.length) return false;
    var used = new Array(b.length).fill(false);
    return a.every(function (da) {
      for (var i = 0; i < b.length; i++) {
        if (!used[i] && Engine.deepEqual(da, b[i])) { used[i] = true; return true; }
      }
      return false;
    });
  }

  // Cada reto se verifica CONTRA SU PROPIA SOLUCIÓN DE REFERENCIA (corrida
  // con el mismo motor, sobre la misma colección), no buscando un número
  // suelto en cualquier parte del resultado: la versión anterior aprobaba el
  // Reto 1 con el pipeline precargado por omisión (que nunca filtra por
  // BARRACAS) solo porque esa cifra aparecía de casualidad en el resultado.
  var RETOS = [
    {
      enunciado: "¿Cuántas bandas están inscriptas en el barrio BARRACAS? Arme un pipeline sobre la colección bandas que lo calcule (por ejemplo, con $match + $count).",
      collection: "bandas",
      solucion: "{ $match: { barrio: 'BARRACAS' } }\n{ $count: 'total' }",
      okDetail: "Correcto: el resultado coincide con { total: 3 } — las bandas de BARRACAS (EFECTO ALFONS ×2 + JAYDEE M, ver Práctica 2026-09-15, ejercicio 9).",
    },
    {
      enunciado: "Sobre la colección ordenes: ¿cuál es el ingreso total (unidades × precio) de la categoría \"Libros\"? Va a necesitar $unwind, $lookup con productos y $group.",
      collection: "ordenes",
      solucion: "{ $unwind: \"$items\" }\n{ $lookup: { from: \"productos\", localField: \"items.producto_id\", foreignField: \"_id\", as: \"producto\" } }\n{ $unwind: \"$producto\" }\n{ $group: { _id: \"$producto.categoria\", totalIngresos: { $sum: { $multiply: [\"$items.cantidad\", \"$producto.precio\"] } } } }\n{ $match: { _id: \"Libros\" } }",
      okDetail: "Correcto: el resultado coincide con el ingreso de Libros, 9000 (Clase 14 § Material complementario, pregunta 3).",
    },
    {
      enunciado: "Sobre la colección egresados: ¿cuántos egresados tiene la carrera \"Ingeniero en Informática\"?",
      collection: "egresados",
      solucion: "{ $match: { titulo: 'Ingeniero en Informática' } }\n{ $count: 'total' }",
      okDetail: "Correcto: el resultado coincide con { total: 533 } — la tabla de egresados por carrera (Práctica 2026-09-22, ejercicio 4.b).",
    },
  ];

  // ---------------------------------------------------------------
  // mount()
  // ---------------------------------------------------------------

  var PREVIEW_LIMIT = 15;

  function buildStage(text, enabled) { return { enabled: enabled !== false, text: text }; }

  lab.tool(
    {
      id: "aggregation",
      title: "Aggregation pipeline paso a paso",
      subtitle: "Arme un pipeline de MongoDB etapa por etapa y vea qué documentos entran y salen de cada una.",
      sources: [
        { stem: "2.12.08 - Aggregation pipeline", label: "Aggregation pipeline" },
        { stem: "2.12.07 - CRUD y consultas en MongoDB", label: "CRUD y consultas en MongoDB" },
        { stem: "2.13.02 - Relaciones 1:1, 1:N y N:M en MongoDB", label: "Relaciones en MongoDB" },
        { stem: "2.14.03 - MapReduce", label: "MapReduce" },
        { stem: "Clase 14 - MongoDB Features", label: "Clase 14" },
        { stem: "Práctica 2026-09-15", label: "Práctica 2026-09-15 (TP9 I)" },
        { stem: "Práctica 2026-09-22", label: "Práctica 2026-09-22 (TP9 II)" },
      ],
      figure: { id: "lab-aggregation", caption: "Un pipeline de agregación de MongoDB, etapa por etapa: bandas agrupadas por barrio.", height: 420 },
    },
    function mount(body, ctx) {
      var h = lab.h;
      // El runtime guarda cada JSON por su nombre sin carpeta ni extensión (dataKey de
      // packages/runtime/src/loader.ts); "data/aggregation.json" queda por compatibilidad.
      var DATA = (ctx.App.DATA && (ctx.App.DATA["aggregation"] || ctx.App.DATA["data/aggregation.json"])) || {};
      var collectionNames = Object.keys(DATA);
      var compact = ctx.mode === "figure";

      // La vista comienza con el primer escenario (PRESETS[0]) cargado y elegido en el selector.
      var state = {
        collection: collectionNames.indexOf(PRESETS[0].collection) >= 0 ? PRESETS[0].collection : collectionNames[0],
        stages: PRESETS[0].stages.map(function (t) { return buildStage(t); }),
        selected: PRESETS[0].stages.length - 1,
        activeSql: PRESETS[0].sql || null,
        activeNota: PRESETS[0].nota || null,
      };

      if (!collectionNames.length) {
        body.appendChild(lab.callout("bad", "Sin datos", "No se encontró data/aggregation.json (App.DATA)."));
        return undefined;
      }

      function currentResult() {
        return Engine.runPipeline(DATA, state.collection, state.stages);
      }

      // ---------------- figura compacta ----------------
      if (compact) {
        return mountFigureCompact(body);
      }
      return mountFullView(body);

      // ================================================================
      function mountFigureCompact(body) {
        // La figura recorre un escenario por vez, etapa por etapa. Por omisión
        // es TP9 I ejercicio 11 (bandas por barrio); el selector permite pasar
        // a cualquier otro, incluidas las cinco preguntas del ecommerce de la
        // Clase 14. Para escribir un pipeline propio está el laboratorio
        // completo (enlace del encabezado).
        var intro = h("p", { class: "lab-aggregation-figintro" });
        var content = h("div", { class: "lab-aggregation-figbody" });
        var stepperCtrl = null;
        var current = 1; // TP9 I ejercicio 11

        var picker = lab.select({
          label: "Escenario",
          options: PRESETS.map(function (p, idx) { return { value: idx, label: p.label }; }),
          value: current,
          onChange: function (v) { current = v; showPreset(); },
        });

        function showPreset() {
          var preset = PRESETS[current];
          var stageTexts = preset.stages;
          var res = Engine.runPipeline(DATA, preset.collection, stageTexts.map(function (t) { return buildStage(t); }));
          intro.textContent = preset.origen + " · colección " + preset.collection + ". Para armar un pipeline propio, abra el laboratorio completo.";
          if (stepperCtrl) stepperCtrl.destroy();
          content.replaceChildren();
          stepperCtrl = lab.stepper({
            count: res.steps.length,
            label: "Etapa",
            render: function (i) {
              var step = res.steps[i];
              var type = stageTypeOf(stageTexts[i]);
              var info = STAGE_INFO[type];
              return h("div", { class: "lab-aggregation-figstep" },
                lab.code(stageTexts[i], "javascript"),
                info ? h("p", { class: "lab-aggregation-figdesc" }, info.desc) : null,
                step && step.output ? h("p", {}, "Salen ", h("strong", {}, lab.fmtInt(step.count)), " ", lab.plural(step.count, "documento")) : null,
                step && step.output && i === res.steps.length - 1 ? docsPreview(step.output) : null,
              );
            },
          });
          content.appendChild(stepperCtrl.el);
        }

        /** Resultado final, en el formato de mongosh (hasta 5 documentos). */
        function docsPreview(docs) {
          var sample = docs.slice(0, 5);
          var text = sample.map(function (d) { return Engine.formatValue(d); }).join("\n");
          if (docs.length > sample.length) text += "\n// … y " + lab.fmtInt(docs.length - sample.length) + " más";
          return h("div", {}, h("p", { class: "lab-aggregation-figdesc" }, "Resultado final:"), lab.code(text, "javascript"));
        }

        body.appendChild(picker.el);
        body.appendChild(intro);
        body.appendChild(content);
        showPreset();
        return function () { if (stepperCtrl) stepperCtrl.destroy(); };
      }

      // ================================================================
      function mountFullView(body) {
        var warnBox = h("div", { "aria-live": "polite" });
        var stageListBox = h("div", { class: "lab-aggregation-stages" });
        // El resumen corto ("Etapa 3: salen 4 documentos") es la única parte
        // que se anuncia por lector de pantalla en cada cambio; el panel
        // grande (tablas de hasta 15 filas x N columnas, entrada y salida)
        // NO es aria-live: se reconstruye en cada tecla del textarea, y
        // marcarlo vivo hacía que se leyera entero por cada tecla.
        var resultStatusBox = h("div", { "aria-live": "polite", class: "lab-aggregation-resultstatus" });
        var resultBox = h("div");
        var retosBox = h("div");

        var collectionSelect = lab.select({
          label: "Colección",
          options: collectionNames.map(function (c) { return { value: c, label: c + " (" + DATA[c].length + " documentos)" }; }),
          value: state.collection,
          onChange: function (v) { state.collection = v; state.selected = Math.min(state.selected, state.stages.length - 1); render(); },
        });

        var presetCtrl = lab.presetPicker({
          label: "Escenario de partida",
          presets: PRESETS,
          value: 0,
          onPick: function (preset) {
            state.collection = preset.collection;
            state.stages = preset.stages.map(function (t) { return buildStage(t); });
            state.selected = state.stages.length - 1;
            state.activeSql = preset.sql || null;
            state.activeNota = preset.nota || null;
            collectionSelect.set(preset.collection);
            render();
          },
        });

        var newStageType = lab.select({ label: "Nueva etapa", options: STAGE_TEMPLATES.map(function (t) { return { value: t.value, label: t.value }; }), value: "$match" });
        var addBtn = lab.button({
          label: "Agregar etapa", kind: "primary",
          onClick: function () {
            var tpl = STAGE_TEMPLATES.filter(function (t) { return t.value === newStageType.get(); })[0];
            state.stages.push(buildStage(tpl.text));
            state.selected = state.stages.length - 1;
            render();
          },
        });

        function moveStage(i, dir) {
          var j = i + dir;
          if (j < 0 || j >= state.stages.length) return;
          var tmp = state.stages[i]; state.stages[i] = state.stages[j]; state.stages[j] = tmp;
          if (state.selected === i) state.selected = j; else if (state.selected === j) state.selected = i;
          render();
        }

        var statusEls = []; // uno por etapa visible, para refrescar sin reconstruir los <textarea> (perdería el foco)
        var typeEls = []; // idem, para el nombre de la etapa ($match, $group, …) detectado en el texto

        function statusBadgeFor(step) {
          if (!step) return null;
          if (step.skippedReason) return lab.badge("inactiva", "neutral");
          if (step.error) return lab.badge("error", "bad");
          if (step.output) return lab.badge(lab.fmtInt(step.count) + " " + lab.plural(step.count, "doc.", "docs."), "ok");
          return null;
        }

        function typeBadgeFor(text) {
          var type = stageTypeOf(text);
          return type ? lab.badge(type, "neutral") : lab.badge("sin identificar", "warn");
        }

        /** Actualiza el estado (badges) de cada etapa con un resultado ya calculado, sin tocar los <textarea>. */
        function refreshAllStatuses(r) {
          r = r || currentResult();
          statusEls.forEach(function (statusEl, i) {
            statusEl.replaceChildren();
            var badge = statusBadgeFor(r.steps[i]);
            if (badge) statusEl.appendChild(badge);
          });
          typeEls.forEach(function (typeEl, i) {
            typeEl.replaceChildren();
            typeEl.appendChild(typeBadgeFor(state.stages[i].text));
          });
          return r;
        }

        function renderStageRow(stage, i, result) {
          var textareaId = "lab-agg-stage-" + i;
          var textarea = h("textarea", {
            id: textareaId, class: "lab-aggregation-textarea bdii-mono", rows: 3, spellcheck: "false",
            value: stage.text,
            on: { input: function (ev) { stage.text = ev.target.value; scheduleRecompute(); } },
          });
          textarea.value = stage.text;

          var statusEl = h("span", { class: "lab-aggregation-status" });
          var badge0 = statusBadgeFor(result.steps[i]);
          if (badge0) statusEl.appendChild(badge0);
          statusEls[i] = statusEl;

          var typeEl = h("span", { class: "lab-aggregation-typebadge" }, typeBadgeFor(stage.text));
          typeEls[i] = typeEl;

          var toggleCtrl = lab.toggle({
            label: "Activa", checked: stage.enabled,
            // No reconstruye toda la lista de etapas (eso movería el foco
            // del propio interruptor que se acaba de tocar): solo recalcula
            // el pipeline y refresca las insignias y el resultado.
            onChange: function (v) { stage.enabled = v; recomputeNow(); },
          });

          var viewBtn = lab.button({
            label: state.selected === i ? "Viendo esta etapa" : "Ver entrada/salida",
            kind: state.selected === i ? "primary" : "ghost",
            onClick: function () { state.selected = i; render(); },
          });
          var upBtn = lab.button({ label: "▲", kind: "ghost", onClick: function () { moveStage(i, -1); } });
          var downBtn = lab.button({ label: "▼", kind: "ghost", onClick: function () { moveStage(i, 1); } });
          // "▲"/"▼" no son un nombre accesible por sí solos (un lector de
          // pantalla los anuncia como "triángulo negro"): agregan qué etapa
          // mueven.
          upBtn.el.setAttribute("aria-label", "Mover la etapa " + (i + 1) + " hacia arriba");
          downBtn.el.setAttribute("aria-label", "Mover la etapa " + (i + 1) + " hacia abajo");
          var delBtn = lab.button({
            label: "Quitar", kind: "ghost",
            onClick: function () { state.stages.splice(i, 1); if (state.selected >= state.stages.length) state.selected = state.stages.length - 1; render(); },
          });

          var row = h("div", { class: "lab-aggregation-stagerow" + (state.selected === i ? " lab-aggregation-stagerow--selected" : "") },
            h("div", { class: "lab-aggregation-stagerow-head" },
              h("span", { class: "lab-aggregation-stagenum" }, "Etapa " + (i + 1)),
              typeEl,
              statusEl,
              h("div", { class: "lab-aggregation-stagerow-actions" }, upBtn.el, downBtn.el, toggleCtrl.el, delBtn.el),
            ),
            h("label", { for: textareaId, class: "bdii-field-label lab-aggregation-stage-label" }, "Texto de la etapa " + (i + 1) + " (sintaxis de mongosh)"),
            textarea,
            viewBtn.el,
          );

          return row;
        }

        function renderStageList(result) {
          stageListBox.replaceChildren();
          statusEls.length = 0;
          typeEls.length = 0;
          result = result || currentResult();
          state.stages.forEach(function (stage, i) { stageListBox.appendChild(renderStageRow(stage, i, result)); });
          if (!state.stages.length) stageListBox.appendChild(lab.callout("info", "Sin etapas", "Agregue al menos una etapa para armar el pipeline."));
        }

        function docsTable(docs) {
          var sample = docs.slice(0, PREVIEW_LIMIT);
          var cols = {};
          sample.forEach(function (d) { Object.keys(d).forEach(function (k) { cols[k] = true; }); });
          var colNames = Object.keys(cols);
          if (!colNames.length) return lab.callout("info", "Sin documentos", "Esta etapa no produce documentos.");
          return lab.table({
            caption: "Primeros " + sample.length + " de " + lab.fmtInt(docs.length) + " " + lab.plural(docs.length, "documento"),
            columns: colNames.map(function (k) { return { key: k, label: k, mono: true }; }),
            rows: sample.map(function (d) {
              var row = {};
              colNames.forEach(function (k) { row[k] = d[k] === undefined ? undefined : Engine.formatCell(d[k]); });
              return row;
            }),
          });
        }

        function docsJson(docs) {
          var sample = docs.slice(0, PREVIEW_LIMIT);
          return lab.code(sample.map(function (d) { return Engine.formatValue(d); }).join("\n"), "javascript");
        }

        function setResultStatus(text) {
          resultStatusBox.replaceChildren();
          resultStatusBox.appendChild(h("p", { class: "lab-aggregation-resultstatus-text" }, text));
        }

        function renderResult(result) {
          resultBox.replaceChildren();
          result = result || currentResult();
          if (state.activeSql) {
            resultBox.appendChild(lab.panel("SQL original", lab.code(state.activeSql, "sql")));
          }
          if (state.activeNota) {
            resultBox.appendChild(lab.callout("warn", "Nota sobre este escenario", state.activeNota));
          }
          if (!state.stages.length) { setResultStatus("Nada para mostrar: agregue una etapa."); resultBox.appendChild(lab.callout("info", "Nada para mostrar", "Agregue una etapa.")); return; }
          var idx = Math.max(0, Math.min(state.selected, state.stages.length - 1));
          var step = result.steps[idx];
          var type = stageTypeOf(state.stages[idx].text);
          var info = type && STAGE_INFO[type];

          if (!step) { setResultStatus("Sin resultado."); resultBox.appendChild(lab.callout("info", "Sin resultado", "")); return; }

          if (step.skippedReason) {
            setResultStatus("Etapa " + (idx + 1) + ": " + step.skippedReason);
            resultBox.appendChild(lab.callout("info", "Etapa " + (idx + 1) + ": " + step.skippedReason, ""));
            return;
          }
          if (step.error) {
            setResultStatus("Error en la etapa " + (idx + 1) + ": " + step.error);
            resultBox.appendChild(lab.callout("bad", "Error en la etapa " + (idx + 1), h("div", { class: "bdii-mono" }, step.error)));
            return;
          }

          var explain = [];
          if (info) explain.push(h("p", {}, h("strong", {}, type), " — equivalente SQL: ", h("span", { class: "bdii-mono" }, info.sql), ". ", info.desc));
          explain.push(h("p", {}, "Entran ", h("strong", {}, lab.fmtInt(step.input.length)), " y salen ", h("strong", {}, lab.fmtInt(step.count)), " ", lab.plural(step.count, "documento"), "."));

          setResultStatus("Etapa " + (idx + 1) + " (" + (type || "?") + "): entran " + lab.fmtInt(step.input.length) + " y salen " + lab.fmtInt(step.count) + " " + lab.plural(step.count, "documento") + ".");
          resultBox.appendChild(lab.callout("ok", "Etapa " + (idx + 1) + ": " + (type || "(?)"), explain));
          resultBox.appendChild(
            lab.grid(2,
              lab.panel("Entrada de la etapa", docsTable(step.input)),
              lab.panel("Salida de la etapa", docsTable(step.output)),
            ),
          );
          var details = h("details", { class: "lab-aggregation-details" }, h("summary", {}, "Ver como JSON"), docsJson(step.output));
          resultBox.appendChild(details);
        }

        function renderWarn() {
          warnBox.replaceChildren();
          warnBox.appendChild(lab.callout("info", "Cómo leer este laboratorio",
            h("p", {}, "El orden de $group, $unwind, $addToSet y $push sin un $sort posterior no está garantizado por MongoDB; este motor calcula por orden de llegada (primera aparición), que suele coincidir con MongoDB pero no es una garantía del estándar — ver "),
            lab.pageLink("2.12.08 - Aggregation pipeline", "Aggregation pipeline"), " § 2 y § 5.",
          ));
        }

        /**
         * Corre la solución de referencia del reto contra el MISMO motor y
         * compara el resultado actual del estudiante con ese resultado como
         * conjunto de documentos (ver `sameDocSet`), en vez de buscar un
         * número suelto en cualquier parte de la salida.
         */
        function checkReto(reto) {
          if (pendingTimer !== null) recomputeNow();
          if (state.collection !== reto.collection) {
            return { pass: false, detail: "Este reto es sobre la colección \"" + reto.collection + "\": selecciónela arriba antes de comprobar." };
          }
          var r = currentResult();
          if (!r.ok) return { pass: false, detail: "El pipeline actual no corrió sin errores." };
          var solStages = reto.solucion.split("\n").map(function (t) { return buildStage(t.trim()); });
          var expected = Engine.runPipeline(DATA, reto.collection, solStages);
          if (!expected.ok) return { pass: false, detail: "No se pudo calcular la solución de referencia (revise el reto)." };
          var ok = sameDocSet(r.finalDocs, expected.finalDocs);
          return { pass: ok, detail: ok ? reto.okDetail : "Todavía no coincide con la solución de referencia. Revise el enunciado y compare con \"Ver respuesta\"." };
        }

        function renderRetos() {
          retosBox.replaceChildren();
          RETOS.forEach(function (reto, i) {
            var feedback = h("div", { "aria-live": "polite" });
            var solBox = h("div");
            var comprobarBtn = lab.button({
              label: "Comprobar", kind: "primary",
              onClick: function () {
                var res = checkReto(reto);
                feedback.replaceChildren();
                feedback.appendChild(lab.callout(res.pass ? "ok" : "bad", res.pass ? "Correcto" : "Todavía no", res.detail));
              },
            });
            var verBtn = lab.button({
              label: "Ver respuesta", kind: "ghost",
              onClick: function () {
                solBox.replaceChildren();
                solBox.appendChild(lab.code(reto.solucion, "javascript"));
              },
            });
            retosBox.appendChild(
              lab.panel("Reto " + (i + 1),
                h("p", {}, reto.enunciado),
                h("p", { class: "bdii-mono" }, "Colección: " + reto.collection),
                h("div", {}, comprobarBtn.el, " ", verBtn.el),
                feedback, solBox,
              ),
            );
          });
        }

        function render() {
          cancelPending();
          var r = currentResult();
          renderStageList(r);
          renderResult(r);
        }

        // Al tipear en una etapa, el pipeline se recalcula UNA sola vez y
        // recién cuando se deja de tipear (300 ms): recalcularlo en cada tecla
        // congelaba la pestaña con pipelines caros (un $lookup grande, una
        // $regex lenta) a mitad de la escritura.
        var RECOMPUTE_DELAY = 300;
        var pendingTimer = null;
        function cancelPending() {
          if (pendingTimer !== null) { clearTimeout(pendingTimer); pendingTimer = null; }
        }
        function recomputeNow() {
          cancelPending();
          var r = currentResult();
          refreshAllStatuses(r);
          renderResult(r);
        }
        function scheduleRecompute() {
          cancelPending();
          pendingTimer = setTimeout(function () { pendingTimer = null; recomputeNow(); }, RECOMPUTE_DELAY);
        }

        renderWarn();
        body.appendChild(warnBox);
        body.appendChild(
          lab.panel("Escenario y colección",
            lab.grid(2, collectionSelect.el, presetCtrl.el),
            h("div", {}, newStageType.el, " ", addBtn.el),
          ),
        );
        body.appendChild(lab.panel("Pipeline", stageListBox));
        body.appendChild(lab.panel("Resultado explicado", resultStatusBox, resultBox));
        body.appendChild(h("h2", { class: "lab-aggregation-retos-title" }, "Retos"));
        body.appendChild(retosBox);
        renderRetos();
        render();

        return function () { cancelPending(); };
      }
    },
  );
})();
