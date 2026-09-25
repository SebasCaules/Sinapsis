/* ============================================================
   bdii-lab / check-option.js — "Vistas y WITH CHECK OPTION"

   Motor puro: App.bdiiLab.engines["check-option"]
     Modela una tabla base y una cadena de hasta 3 vistas apiladas
     (T -> V1 -> V2 -> V3), cada una un filtro WHERE (una o más
     condiciones unidas por AND) con una opción de chequeo propia:
     sin CHECK OPTION, WITH LOCAL CHECK OPTION o WITH CASCADED CHECK OPTION.

     Semántica "mysql" — CONFIRMADA en el contenedor bdii-verify-mysql
     (MySQL 9.7.2), no es una lectura de la documentación: al escribir a
     través de Vk, el motor recorre TODA la cadena hacia la tabla base.
     En cada nivel evalúa (y exige VERDADERO en) su propia condición si:
     (a) ese nivel declara CHECK OPTION propio (de cualquier tipo), o
     (b) llegó "forzado" desde un nivel de arriba que declaró CASCADED.
     Una vez que un CASCADED fuerza el chequeo, la obligación se propaga
     hacia abajo sin cortarse, aunque los niveles intermedios no declaren
     ninguna opción. Un nivel SIN CHECK OPTION propio y sin llegar forzado
     nunca se evalúa — pero el recorrido igual sigue buscando más abajo
     otro nivel con opción propia (por eso una vista LOCAL puede terminar
     rechazando por la condición de una vista dos niveles más abajo, si
     esa vista SÍ declara su propio CHECK OPTION). Esto se verificó con
     10 corridas reales (ver TOOLS_BRIEF § protocolo de pruebas, y
     `contraste_motor_real` en la respuesta de esta tarea): entre ellas,
     un caso de 3 niveles LOCAL->ninguno->CASCADED-por-defecto que
     RECHAZA por el nivel más profundo aunque el nivel intermedio no
     declare nada — un resultado que NINGUNA fuente del vault documenta
     todavía (ni 1.06.01, ni el Parcial 2Q2025 lo necesitan: sus cadenas
     tienen a lo sumo un "hueco" de un nivel sin opción, nunca dos
     opciones propias separadas por uno sin opción).

     Semántica "deck" — la lectura LITERAL del slide 15 del deck 06
     (transcripta en 1.06.01 § WITH CHECK OPTION): "LOCAL: sólo se
     chequean contra las condiciones definidas en la MISMA vista". Leída
     al pie de la letra, un nivel LOCAL sin forzar nunca mira más abajo de
     sí mismo (ni siquiera para encontrar un CHECK OPTION propio en una
     vista más abajo): en cuanto el recorrido pasa por un nivel LOCAL sin
     que venga forzado por un CASCADED de arriba, se corta ahí. Un nivel
     SIN opción propia (ni LOCAL ni CASCADED) no corta nada en ninguna
     lectura: es transparente y el recorrido sigue buscando más abajo,
     igual que en "mysql" — el deck no dice nada sobre estos niveles, solo
     sobre lo que hace un LOCAL. Por eso las dos lecturas SOLO pueden
     diferir en una cadena que tenga, en el camino de escritura, una vista
     LOCAL que no llegue forzada: ahí (y solo ahí) el deck corta antes de
     llegar a una condición propia más abajo que MySQL sí exige. Verificado
     en bdii-verify-mysql (1.06.01 § Dudas abiertas, v1 WITH CHECK OPTION
     -> v2 WITH LOCAL CHECK OPTION: un INSERT que cumple la condición de v2
     pero no la de v1 se rechaza igual en MySQL, contra la simplificación
     del slide). El selector "Semántica" de la herramienta muestra las dos
     lecturas y en qué casos difieren (ver Reto 3).

   Fuentes del vault (ver `sources` del tool() más abajo): 1.06.01 - Vistas
   (todo el bloque WITH CHECK OPTION), Clase 06 - Vistas-Parte 1 (slides
   14-17), Clase 07 - Vistas-Parte 2 (slide 10 y la duda de LOCAL),
   Práctica 2026-08-11 (TP4, ejercicio 1 y 4.c), Parcial 2Q2025 (preguntas
   1 y 18), MySQL.
   ============================================================ */
(function () {
  "use strict";

  var App = window.App;
  if (!App) return;
  var lab = App.bdiiLab;
  if (!lab) return; // lib.js no se cargó antes: nada que hacer
  var h = lab.h;

  // ==================================================================
  // Motor puro
  // ==================================================================

  var OPS = [
    { value: "=", label: "=" },
    { value: "<>", label: "<>" },
    { value: "<", label: "<" },
    { value: "<=", label: "<=" },
    { value: ">", label: ">" },
    { value: ">=", label: ">=" },
    { value: "like", label: "LIKE" },
    { value: "isnull", label: "IS NULL" },
    { value: "isnotnull", label: "IS NOT NULL" },
  ];

  var CHECK_OPTIONS = [
    { value: "none", label: "Sin CHECK OPTION" },
    { value: "local", label: "WITH LOCAL CHECK OPTION" },
    { value: "cascaded", label: "WITH CASCADED CHECK OPTION" },
  ];

  /** Repliega una cadena a minúsculas y sin diacríticos: aproxima la collation por
   *  omisión de MySQL 9 (utf8mb4_0900_ai_ci, insensible a mayúsculas y a acentos).
   *  Verificado en bdii-verify-mysql (con el cliente en utf8mb4): 'DÓLAR' = 'dolar',
   *  'usdt' = 'USDT', 'a' < 'B'. */
  function foldText(s) {
    s = String(s == null ? "" : s);
    try { s = s.normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) { /* sin normalize: se compara solo por mayúsculas */ }
    return s.toLowerCase();
  }

  /** patrón LIKE ('%'/'_') -> RegExp sobre texto ya replegado con foldText (ver evalTerm). */
  function likeToRegExp(pattern) {
    var esc = foldText(pattern).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    esc = esc.replace(/%/g, ".*").replace(/_/g, ".");
    return new RegExp("^" + esc + "$");
  }

  /** "AAAA-M-D" o "AAAA-MM-DD" -> entero comparable AAAAMMDD (normaliza como DATE de
   *  MySQL: '1985-5-5' y '1985-05-05' comparan igual). null si no es una fecha válida. */
  function parseDateLoose(v) {
    if (v === null || v === undefined) return null;
    var m = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/.exec(String(v));
    if (!m) return null;
    var y = parseInt(m[1], 10), mo = parseInt(m[2], 10), d = parseInt(m[3], 10);
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return y * 10000 + mo * 100 + d;
  }

  /** Evalúa un término contra una fila. Devuelve true/false/null (null = UNKNOWN, por NULL).
   *  `columns` (opcional) da el tipo declarado de la columna: sin él, se infiere por
   *  `typeof` (menos preciso, pero sirve para llamadas de prueba que no lo pasan). */
  function evalTerm(row, term, columns) {
    var v = row[term.column];
    if (term.op === "isnull") return v === null || v === undefined;
    if (term.op === "isnotnull") return !(v === null || v === undefined);
    if (v === null || v === undefined) return null; // NULL en la columna: UNKNOWN para cualquier otro operador
    if (term.op === "like") return likeToRegExp(term.value).test(foldText(v));
    var a = v, b = term.value;
    if (b === null || b === undefined) return null;
    var colDef = columns ? columnDef(columns, term.column) : null;
    var colType = colDef ? colDef.type : null;
    if (colType === "date") {
      var da = parseDateLoose(a), db = parseDateLoose(b);
      if (da !== null && db !== null) { a = da; b = db; } else { a = foldText(a); b = foldText(b); }
    } else if (colType === "number" || (colType === null && (typeof a === "number" || typeof b === "number"))) {
      a = parseFloat(a); b = parseFloat(b);
      if (isNaN(a) || isNaN(b)) return null;
    } else {
      // texto: se repliega como la collation por omisión de MySQL (ver foldText).
      a = foldText(a); b = foldText(b);
    }
    switch (term.op) {
      case "=": return a === b;
      case "<>": return a !== b;
      case "<": return a < b;
      case "<=": return a <= b;
      case ">": return a > b;
      case ">=": return a >= b;
      default: return null;
    }
  }

  /** AND de tres valores lógicos SQL (true/false/null=UNKNOWN). Sin términos: TRUE (vista sin WHERE). */
  function evalPredicate(row, terms, columns) {
    if (!terms || !terms.length) return true;
    var anyNull = false;
    for (var i = 0; i < terms.length; i++) {
      var v = evalTerm(row, terms[i], columns);
      if (v === false) return false;
      if (v === null) anyNull = true;
    }
    return anyNull ? null : true;
  }

  /**
   * Recorre la cadena [V1..Vn] (índice 0 = V1, la más pegada a la tabla
   * base) escribiendo a través de `chain[targetIndex]`, según `mode`
   * ("mysql" | "deck"). Devuelve { accepted, trace, rejectedAtIndex }.
   * `trace` queda ordenado V1..Vn (ascendente), con un registro por vista
   * DEFINIDA en la cadena hasta targetIndex inclusive. `columns` (opcional)
   * se reenvía a `evalPredicate`/`evalTerm` para tipar la comparación.
   */
  function checkChain(chain, targetIndex, row, mode, columns) {
    var trace = [];
    var rejected = false;
    var rejectedAtIndex = null;

    function level(i, forced) {
      var view = chain[i];
      var hasOwn = view.checkOption !== "none";
      var evaluated = forced || hasOwn;
      var value = null;
      var reason = "no-evaluada";
      if (evaluated) {
        value = evalPredicate(row, view.predicate, columns);
        reason = hasOwn ? "propia" : "heredada-cascaded";
        if (value !== true) { rejected = true; if (rejectedAtIndex === null) rejectedAtIndex = i; }
      }
      trace.push({ index: i, name: view.name, checkOption: view.checkOption, forced: forced, evaluated: evaluated, reason: reason, value: value });

      if (i === 0) return;

      if (mode === "deck") {
        // Lectura literal del slide 15: SOLO un LOCAL sin forzar corta el
        // recorrido (y únicamente el suyo: no dice nada de un nivel sin
        // opción propia, que es transparente en las dos lecturas). Si este
        // nivel llegó forzado, o es CASCADED (propio o no), o no tiene
        // opción propia, el recorrido sigue igual que en "mysql".
        var stopsHere = hasOwn && view.checkOption === "local" && !forced;
        if (stopsHere) return;
        var childForcedDeck = forced || (hasOwn && view.checkOption === "cascaded");
        level(i - 1, childForcedDeck);
        return;
      }
      // MySQL (confirmado): el recorrido SIEMPRE sigue hasta la tabla base;
      // CASCADED activa (y mantiene) la obligación para todo lo de abajo.
      var childForced = forced || (hasOwn && view.checkOption === "cascaded");
      level(i - 1, childForced);
    }

    level(targetIndex, false);
    trace.sort(function (a, b) { return a.index - b.index; });
    return { accepted: !rejected, trace: trace, rejectedAtIndex: rejectedAtIndex };
  }

  /** Visibilidad de `row` en cada vista de la cadena (independiente de CHECK OPTION:
   *  es la pregunta de SELECT, no la de escritura). Misma tipificación que
   *  `checkChain` vía `columns`, para que trace y visibilidad no diverjan. */
  function visibility(chain, row, columns) {
    var out = [];
    var upstream = true;
    for (var i = 0; i < chain.length; i++) {
      var v = evalPredicate(row, chain[i].predicate, columns);
      var vis = upstream && v === true;
      out.push({ index: i, name: chain[i].name, value: v, visible: vis });
      upstream = vis;
    }
    return out;
  }

  /** Todas las combinaciones de CHECK OPTION para los índices en `varyIndices`,
   *  dejando el resto de la cadena como está. Devuelve un array de
   *  { assign: {indice: opcion}, accepted, trace }. */
  function buildMatrix(chain, targetIndex, row, mode, varyIndices, columns) {
    var opts = ["none", "local", "cascaded"];
    function combos(idxs) {
      if (!idxs.length) return [{}];
      var rest = combos(idxs.slice(1));
      var out = [];
      opts.forEach(function (o) {
        rest.forEach(function (r) {
          var c = {};
          for (var k in r) if (Object.prototype.hasOwnProperty.call(r, k)) c[k] = r[k];
          c[idxs[0]] = o;
          out.push(c);
        });
      });
      return out;
    }
    return combos(varyIndices).map(function (assign) {
      var testChain = chain.map(function (v, i) {
        if (Object.prototype.hasOwnProperty.call(assign, i)) {
          return { name: v.name, predicate: v.predicate, checkOption: assign[i] };
        }
        return v;
      });
      var res = checkChain(testChain, targetIndex, row, mode, columns);
      return { assign: assign, accepted: res.accepted, trace: res.trace };
    });
  }

  // ---------- SQL equivalente ----------

  function sqlLiteral(val, colType) {
    if (val === null || val === undefined) return "NULL";
    if (val === "") return "''"; // cadena vacía: NO es NULL, aunque coerceRow guarde "" (ver evalTerm)
    if (colType === "number") return String(val);
    return "'" + String(val).replace(/'/g, "''") + "'";
  }

  function termToSql(term, columns) {
    var col = columnDef(columns, term.column);
    if (term.op === "isnull") return term.column + " IS NULL";
    if (term.op === "isnotnull") return term.column + " IS NOT NULL";
    if (term.op === "like") return term.column + " LIKE '" + String(term.value == null ? "" : term.value).replace(/'/g, "''") + "'";
    var opTxt = term.op === "<>" ? "<>" : term.op;
    return term.column + " " + opTxt + " " + sqlLiteral(term.value, col ? col.type : "text");
  }

  function predicateToSql(terms, columns) {
    if (!terms || !terms.length) return "1=1";
    return terms.map(function (t) { return termToSql(t, columns); }).join("\n     AND ");
  }

  function checkOptionSql(opt) {
    if (opt === "local") return "\n  WITH LOCAL CHECK OPTION";
    if (opt === "cascaded") return "\n  WITH CASCADED CHECK OPTION";
    return "";
  }

  function columnDef(columns, key) {
    for (var i = 0; i < columns.length; i++) if (columns[i].key === key) return columns[i];
    return null;
  }

  function sqlForChain(baseTable, columns, chain) {
    var parts = [];
    for (var i = 0; i < chain.length; i++) {
      var v = chain[i];
      var from = i === 0 ? baseTable : chain[i - 1].name;
      parts.push(
        "CREATE VIEW " + v.name + " AS\n  SELECT * FROM " + from +
        "\n  WHERE " + predicateToSql(v.predicate, columns) +
        checkOptionSql(v.checkOption) + ";"
      );
    }
    return parts.join("\n\n");
  }

  function sqlForOperation(baseTable, columns, chain, targetIndex, kind, values, originalRow) {
    var view = chain[targetIndex];
    var cols = columns.map(function (c) { return c.key; });
    if (kind === "insert") {
      var vals = cols.map(function (k) { return sqlLiteral(values[k], columnDef(columns, k).type); });
      return "INSERT INTO " + view.name + " (" + cols.join(", ") + ")\nVALUES (" + vals.join(", ") + ");";
    }
    var sets = cols
      .filter(function (k) { return values[k] !== originalRow[k]; })
      .map(function (k) { return k + " = " + sqlLiteral(values[k], columnDef(columns, k).type); });
    if (!sets.length) sets = cols.map(function (k) { return k + " = " + sqlLiteral(values[k], columnDef(columns, k).type); });
    var where = cols.map(function (k) { return k + " = " + sqlLiteral(originalRow[k], columnDef(columns, k).type); }).join(" AND ");
    return "UPDATE " + view.name + "\nSET " + sets.join(", ") + "\nWHERE " + where + ";";
  }

  function errorMessage(db, chain, targetIndex) {
    return "ERROR 1369 (HY000): CHECK OPTION failed '" + db + "." + chain[targetIndex].name + "'";
  }

  // ---------- Presets (del vault; ver `sources` del tool()) ----------

  var PRESETS = [
    {
      id: "parcial-movimiento",
      label: "Movimiento (Parcial 2Q2025)",
      origen: "Parcial 2Q2025, preguntas 1 y 18",
      db: "parcial2q2025",
      baseTable: "Movimiento",
      columns: [
        { key: "id_usuario", label: "id_usuario", type: "text" },
        { key: "moneda", label: "moneda", type: "text" },
        { key: "fecha", label: "fecha", type: "date" },
        { key: "tipo", label: "tipo", type: "text" },
        { key: "comision", label: "comisión", type: "number" },
        { key: "valor", label: "valor", type: "number" },
      ],
      rows: [],
      chain: [
        { name: "MovimientoUSDT", checkOption: "none", predicate: [{ column: "moneda", op: "like", value: "%USDT%" }] },
        { name: "MovUSDTValor", checkOption: "local", predicate: [{ column: "valor", op: "<", value: 1200 }] },
        { name: "MovUSDTValorComi", checkOption: "cascaded", predicate: [{ column: "comision", op: "<", value: 25 }] },
      ],
      operation: {
        targetIndex: 2, kind: "insert",
        values: { id_usuario: "2", moneda: "EURO", fecha: "2020-02-02", tipo: "E", comision: 20, valor: 1000 },
      },
      nota: "La tabla comienza vacía, tal como plantea el enunciado del parcial.",
    },
    {
      id: "tp4-envios",
      label: "ENVIOS500 (TP4)",
      origen: "TP4 — Práctica 2026-08-11, ejercicio 1 (deck 06 slide 17)",
      db: "tp4_vistas",
      baseTable: "ENVIO",
      columns: [
        { key: "id_proveedor", label: "id_proveedor", type: "text" },
        { key: "id_articulo", label: "id_articulo", type: "text" },
        { key: "cantidad", label: "cantidad", type: "number" },
      ],
      rows: [{ id_proveedor: "P1", id_articulo: "A1", cantidad: 900 }],
      chain: [
        { name: "ENVIOS500", checkOption: "none", predicate: [{ column: "cantidad", op: ">=", value: 500 }] },
        { name: "ENVIOS500_999", checkOption: "cascaded", predicate: [{ column: "cantidad", op: "<", value: 1000 }] },
      ],
      operation: { targetIndex: 1, kind: "update", rowIndex: 0, values: { id_proveedor: "P1", id_articulo: "A1", cantidad: 300 } },
      nota: "La opción de ENVIOS500_999 es \"la variable del experimento\" de este ejercicio (deck 06 slide 17): cambie CASCADED por LOCAL y compare. El ejercicio 4.c del TP4 usa otra cadena (EMPLEADO_DIST_20 -> EMPLEADO_DIST_20_80, con una columna no proyectada) que este laboratorio no modela, porque sus vistas son SELECT * y no pueden ocultar una columna.",
    },
    {
      id: "clase07-alumnos",
      label: "Alumnos aprobados (Clase 07)",
      origen: "Clase 07 slide 10, con la variante que trae la nota del vault (SET nota=5): simplificada, sin el JOIN a profesores, que este laboratorio no modela. El slide 10 en sí corre SET nota=10 (9,7 -> 10, la fila sigue visible)",
      db: "clase07_vistas",
      baseTable: "alumnos",
      columns: [
        { key: "documento", label: "documento", type: "text" },
        { key: "nombre", label: "nombre", type: "text" },
        { key: "nota", label: "nota", type: "number" },
      ],
      rows: [
        { documento: "30111111", nombre: "Ana Algarbe", nota: 5.1 },
        { documento: "30222222", nombre: "Bernardo Bustamante", nota: 3.2 },
        { documento: "30333333", nombre: "Carolina Conte", nota: 4.5 },
        { documento: "30444444", nombre: "Diana Dominguez", nota: 9.7 },
        { documento: "30555555", nombre: "Fabian Fuentes", nota: 8.5 },
        { documento: "30666666", nombre: "Gaston Gonzalez", nota: 9.7 },
      ],
      chain: [
        { name: "vista_nota_alumnos_aprobados", checkOption: "none", predicate: [{ column: "nota", op: ">=", value: 7 }] },
      ],
      operation: { targetIndex: 0, kind: "update", rowIndex: 3, values: { documento: "30444444", nombre: "Diana Dominguez", nota: 5 } },
      nota: "El deck no le pone WITH CHECK OPTION a esta vista: agréguesela para ver cómo habría bloqueado la migración que el propio deck deja sin mostrar.",
    },
  ];

  // ---------- Retos ----------

  function findPreset(id) { for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].id === id) return PRESETS[i]; return null; }

  var RETOS = [
    {
      id: "pregunta-1",
      titulo: "Reto 1 — Parcial 2Q2025, pregunta 1",
      enunciado: "Con las tres vistas de MovimientoUSDT/MovUSDTValor/MovUSDTValorComi (MovUSDTValor con LOCAL, " +
        "MovUSDTValorComi con CASCADED): INSERT INTO MovUSDTValorComi (id_usuario, moneda, fecha, tipo, comision, valor) " +
        "VALUES ('2', 'EURO', '2020-02-02', 'E', 20, 1000); ¿procede o no?",
      fuente: "Parcial 2Q2025, pregunta 1 — corrida real en bdii-verify-mysql: ERROR 1369 (HY000)",
      kind: "reveal",
      respuesta: "No procede. MovUSDTValorComi tiene WITH CASCADED CHECK OPTION, así que se exige también " +
        "moneda LIKE '%USDT%' de MovimientoUSDT (que no tiene CHECK OPTION propio, pero CASCADED la fuerza igual): " +
        "'EURO' no cumple esa condición. MySQL 9.7.2 lo rechaza con ERROR 1369 (HY000): CHECK OPTION failed " +
        "'parcial2q2025.MovUSDTValorComi'.",
    },
    {
      id: "pregunta-18",
      titulo: "Reto 2 — Parcial 2Q2025, pregunta 18",
      enunciado: "Con la misma cadena: arme la operación INSERT INTO MovUSDTValor (id_usuario, moneda, fecha, tipo, " +
        "comision, valor) VALUES ('3', 'BITCOIN', '2020-03-03', 'S', 30, 700); a través de MovUSDTValor (no de " +
        "MovUSDTValorComi), en semántica MySQL, y compruebe que procede.",
      fuente: "Parcial 2Q2025, pregunta 18",
      kind: "check",
      check: function (appState) {
        var op = appState.operation;
        var chain = appState.chain;
        if (appState.presetId !== "parcial-movimiento") return { pass: false, detail: "Cargue primero el escenario \"Movimiento (Parcial 2Q2025)\"." };
        if (op.kind !== "insert") return { pass: false, detail: "La operación tiene que ser un INSERT, no un UPDATE." };
        if (op.targetIndex !== 1) return { pass: false, detail: "La escritura tiene que ir a través de MovUSDTValor (V2), no de MovUSDTValorComi (V3) ni de MovimientoUSDT (V1)." };
        if (appState.semantics !== "mysql") return { pass: false, detail: "Ponga la semántica en \"MySQL\"." };
        var v = op.values;
        if (String(v.moneda) !== "BITCOIN" || Number(v.valor) !== 700) {
          return { pass: false, detail: "Los valores tienen que ser moneda='BITCOIN' y valor=700 (los de la pregunta 18)." };
        }
        var res = checkChain(chain, op.targetIndex, coerceRow(v, appState.columns), "mysql", appState.columns);
        if (!res.accepted) return { pass: false, detail: "Con esta configuración el motor puro rechaza la operación: revise que MovUSDTValor siga con LOCAL." };
        return { pass: true, detail: "Correcto: procede. LOCAL solo exige la condición propia (valor < 1200); MovimientoUSDT no tiene CHECK OPTION propio, así que su condición (moneda LIKE '%USDT%') no se evalúa. La fila queda en la tabla pero invisible en MovimientoUSDT y en MovUSDTValor." };
      },
    },
    {
      id: "divergencia",
      titulo: "Reto 3 — encontrar la divergencia MySQL / definición del deck",
      enunciado: "Arme una cadena de 3 vistas (V1 con CASCADED, V2 sin CHECK OPTION, V3 con LOCAL) y una operación " +
        "que viole solo la condición de V1. Compare las dos semánticas: tienen que dar resultados distintos.",
      fuente: "TP4 (Práctica 2026-08-11) § Ejercicio 4.c, \"evalúe todas las alternativas\" · 1.06.01 - Vistas § Dudas abiertas (\"¿la definición de LOCAL del deck coincide con la del estándar?\") · verificado en bdii-verify-mysql",
      kind: "check",
      check: function (appState) {
        var chain = appState.chain;
        if (chain.length < 3) return { pass: false, detail: "Necesita los tres niveles (V1, V2 y V3) definidos." };
        if (chain[0].checkOption !== "cascaded") return { pass: false, detail: "V1 tiene que declarar WITH CASCADED CHECK OPTION." };
        if (chain[1].checkOption !== "none") return { pass: false, detail: "V2 tiene que estar SIN CHECK OPTION." };
        if (chain[2].checkOption !== "local") return { pass: false, detail: "V3 (el destino de la escritura) tiene que declarar WITH LOCAL CHECK OPTION." };
        var op = appState.operation;
        if (op.targetIndex !== 2) return { pass: false, detail: "La operación tiene que escribir a través de V3." };
        var row = coerceRow(op.values, appState.columns);
        var v1ok = evalPredicate(row, chain[0].predicate, appState.columns) === true;
        var v2ok = evalPredicate(row, chain[1].predicate, appState.columns) === true;
        var v3ok = evalPredicate(row, chain[2].predicate, appState.columns) === true;
        if (!(v2ok && v3ok && !v1ok)) {
          return { pass: false, detail: "Los valores tienen que cumplir la condición de V2 y de V3, pero NO la de V1." };
        }
        var mysqlRes = checkChain(chain, 2, row, "mysql", appState.columns);
        var deckRes = checkChain(chain, 2, row, "deck", appState.columns);
        var pass = mysqlRes.accepted !== deckRes.accepted;
        return {
          pass: pass,
          detail: pass
            ? "Correcto: en MySQL " + (mysqlRes.accepted ? "procede" : "se rechaza") + " y en la definición del deck " +
              (deckRes.accepted ? "procede" : "se rechaza") + " — la condición de V1 solo se exige en una de las dos lecturas."
            : "Con esta configuración las dos semánticas ya coinciden. Revise los valores: V1 tiene que fallar.",
        };
      },
    },
  ];

  function coerceRow(values, columns) {
    var row = {};
    columns.forEach(function (c) {
      var raw = values[c.key];
      if (raw === "" || raw === undefined) { row[c.key] = raw === "" ? "" : null; return; }
      if (raw === null || raw === "NULL") { row[c.key] = null; return; }
      row[c.key] = c.type === "number" ? parseFloat(raw) : raw;
    });
    return row;
  }

  App.bdiiLab.engines["check-option"] = {
    OPS: OPS,
    CHECK_OPTIONS: CHECK_OPTIONS,
    evalTerm: evalTerm,
    evalPredicate: evalPredicate,
    checkChain: checkChain,
    visibility: visibility,
    buildMatrix: buildMatrix,
    sqlForChain: sqlForChain,
    sqlForOperation: sqlForOperation,
    errorMessage: errorMessage,
    coerceRow: coerceRow,
    likeToRegExp: likeToRegExp,
    PRESETS: PRESETS,
    findPreset: findPreset,
    RETOS: RETOS,
  };

  // ==================================================================
  // Interfaz
  // ==================================================================

  var engine = App.bdiiLab.engines["check-option"];

  function cloneChain(chain) {
    return chain.map(function (v) {
      return { name: v.name, checkOption: v.checkOption, predicate: v.predicate.map(function (t) { return { column: t.column, op: t.op, value: t.value }; }) };
    });
  }

  function cloneRows(rows) { return rows.map(function (r) { var c = {}; for (var k in r) c[k] = r[k]; return c; }); }

  function defaultValuesFromRow(columns, row) {
    var v = {};
    columns.forEach(function (c) { v[c.key] = row ? row[c.key] : (c.type === "number" ? 0 : ""); });
    return v;
  }

  function rowLabel(columns, row) {
    return columns.map(function (c) { return c.key + "=" + (row[c.key] === null ? "NULL" : row[c.key]); }).join(", ");
  }

  function checkOptionLabel(opt) {
    if (opt === "local") return "LOCAL";
    if (opt === "cascaded") return "CASCADED";
    return "sin opción";
  }

  lab.tool(
    {
      id: "check-option",
      title: "Vistas y WITH CHECK OPTION",
      subtitle: "Arme una cadena de vistas apiladas, escriba a través de una de ellas y vea, paso a paso, qué condición se chequea, por qué, y si la fila resultante queda visible en cada nivel.",
      sources: [
        { stem: "1.06.01 - Vistas", label: "Vistas" },
        { stem: "Clase 06 - Vistas-Parte 1", label: "Clase 06" },
        { stem: "Clase 07 - Vistas-Parte 2", label: "Clase 07" },
        { stem: "Práctica 2026-08-11", label: "TP4" },
        { stem: "Parcial 2Q2025", label: "Parcial 2Q2025" },
        { stem: "MySQL", label: "MySQL" },
      ],
      figure: { id: "lab-check-option", caption: "Cadena de vistas con WITH CHECK OPTION: qué se chequea, por qué, y si la fila queda visible en cada nivel.", height: 420 },
    },
    function mount(body, ctx) {
      var compact = ctx.mode === "figure";

      var state = {
        presetId: "parcial-movimiento",
        semantics: "mysql",
        db: "",
        baseTable: "",
        columns: [],
        rows: [],
        chain: [],
        operation: null,
        matrixMode: false,
        includeGrandparent: false,
      };

      function loadPreset(preset) {
        state.presetId = preset.id;
        state.db = preset.db;
        state.baseTable = preset.baseTable;
        state.columns = preset.columns;
        state.rows = cloneRows(preset.rows);
        state.chain = cloneChain(preset.chain);
        var op = preset.operation;
        state.operation = {
          targetIndex: op.targetIndex,
          kind: op.kind,
          rowIndex: op.kind === "update" ? op.rowIndex : null,
          values: {},
        };
        state.columns.forEach(function (c) { state.operation.values[c.key] = op.values[c.key]; });
        state.matrixMode = false;
        state.includeGrandparent = false;
      }

      loadPreset(engine.findPreset(state.presetId));

      // ---------------- controles de cabecera ----------------

      var presetCtrl = lab.presetPicker({
        label: "Escenario de partida",
        presets: engine.PRESETS.map(function (p) { return { label: p.label, origen: p.origen, id: p.id }; }),
        onPick: function (p) {
          loadPreset(engine.findPreset(p.id));
          renderAll();
          renderMatrixToggle(); // el preset nuevo resetea matrixMode/includeGrandparent: resincroniza el segmentado y la casilla
          toggleResultVisibility();
        },
      });
      // deja seleccionado el preset activo (el primero de PRESETS, cargado arriba),
      // no el placeholder "Elegir un escenario…"
      var initialPresetIdx = engine.PRESETS.map(function (p) { return p.id; }).indexOf(state.presetId);
      presetCtrl.set(initialPresetIdx >= 0 ? String(initialPresetIdx) : "");

      var semanticaCtrl = lab.segmented({
        label: "Semántica de LOCAL",
        options: [{ value: "mysql", label: "MySQL 9.7.2" }, { value: "deck", label: compact ? "Deck (slide 15)" : "Definición del deck (slide 15)" }],
        value: state.semantics,
        onChange: function (v) { state.semantics = v; renderAll(); },
      });

      // ---------------- tabla base editable ----------------

      var baseTableWrap = h("div", { class: "lab-cko-rows" });

      function renderBaseTable() {
        baseTableWrap.replaceChildren();
        // En figura (modo compacto) se editan valores pero no se agregan ni se
        // quitan filas: son controles estructurales, no "esenciales" para lo que
        // enseña la figura (TOOLS_BRIEF: la figura va compacta).
        var head = h("tr", {}, state.columns.map(function (c) { return h("th", { scope: "col" }, c.label); }).concat(compact ? [] : h("th", { scope: "col" }, "")));
        var bodyRows = state.rows.map(function (row, ri) {
          var cells = state.columns.map(function (c) {
            var input = h("input", {
              type: "text", class: "lab-cko-cell-input", value: row[c.key] === null ? "NULL" : row[c.key],
              "aria-label": c.label + " de la fila " + (ri + 1),
              on: {
                change: function (ev) {
                  var raw = ev.target.value;
                  row[c.key] = raw === "NULL" ? null : (c.type === "number" ? parseFloat(raw) : raw);
                  renderResult();
                },
              },
            });
            return h("td", {}, input);
          });
          if (compact) return h("tr", {}, cells);
          var removeBtn = h("button", {
            type: "button", class: "bdii-btn bdii-btn--ghost lab-cko-row-remove", "aria-label": "Quitar fila " + (ri + 1),
            on: {
              click: function () {
                state.rows.splice(ri, 1);
                var op = state.operation;
                if (op.kind === "update" && op.rowIndex != null) {
                  if (op.rowIndex === ri) {
                    // la fila que se estaba por actualizar es la que se quitó: cae a la primera que quede (o a nada)
                    op.rowIndex = state.rows.length ? 0 : null;
                    op.values = defaultValuesFromRow(state.columns, op.rowIndex != null ? state.rows[0] : null);
                  } else if (op.rowIndex > ri) {
                    op.rowIndex -= 1; // los índices posteriores se corrieron un lugar
                  }
                }
                renderAll();
              },
            },
          }, "Quitar");
          return h("tr", {}, cells.concat(h("td", {}, removeBtn)));
        });
        baseTableWrap.appendChild(h("div", { class: "bdii-table-wrap" }, h("table", { class: "bdii-table" }, h("thead", {}, head), h("tbody", {}, bodyRows))));
        baseTableWrap.appendChild(h("p", { class: "lab-cko-hint" }, "Escriba NULL (mayúsculas) para dejar una celda en NULL."));
        if (!compact) {
          var addBtn = h("button", {
            type: "button", class: "bdii-btn bdii-btn--ghost",
            on: { click: function () { state.rows.push(defaultValuesFromRow(state.columns, null)); renderAll(); } },
          }, "Agregar fila");
          baseTableWrap.appendChild(addBtn);
        }
      }

      // ---------------- cadena de vistas ----------------

      var chainWrap = h("div", { class: "lab-cko-chain" });

      function opsForColumn() { return engine.OPS.map(function (o) { return { value: o.value, label: o.label }; }); }

      function renderTermRow(view, term, ti, onChange) {
        var colCtrl = lab.select({
          label: "Columna", options: state.columns.map(function (c) { return { value: c.key, label: c.label }; }), value: term.column,
          onChange: function (v) { term.column = v; onChange(); },
        });
        var opCtrl = lab.select({ label: "Operador", options: opsForColumn(), value: term.op, onChange: function (v) { term.op = v; onChange(); } });
        var needsValue = term.op !== "isnull" && term.op !== "isnotnull";
        var valCtrl = needsValue ? lab.text({ label: "Valor", value: term.value == null ? "" : String(term.value), mono: true, onChange: function (v) { term.value = v; onChange(); } }) : null;
        // En figura no se agregan ni se quitan términos (control estructural, no esencial).
        var removeBtn = compact ? null : h("button", {
          type: "button", class: "bdii-btn bdii-btn--ghost", "aria-label": "Quitar término",
          on: { click: function () { view.predicate.splice(ti, 1); if (!view.predicate.length) view.predicate.push({ column: state.columns[0].key, op: "=", value: "" }); onChange(true); } },
        }, "Quitar término");
        return h("div", { class: "lab-cko-term" }, colCtrl.el, opCtrl.el, valCtrl ? valCtrl.el : h("div", { class: "bdii-field" }), removeBtn);
      }

      function renderViewCard(view, vi) {
        var predWrap = h("div", { class: "lab-cko-terms" });
        function rebuildTerms() {
          predWrap.replaceChildren();
          view.predicate.forEach(function (term, ti) {
            predWrap.appendChild(renderTermRow(view, term, ti, function (fullRebuild) { renderResult(); if (fullRebuild) rebuildTerms(); }));
            if (ti < view.predicate.length - 1) predWrap.appendChild(h("div", { class: "lab-cko-and" }, "AND"));
          });
        }
        rebuildTerms();
        var addTermBtn = compact ? null : h("button", {
          type: "button", class: "bdii-btn bdii-btn--ghost",
          on: { click: function () { view.predicate.push({ column: state.columns[0].key, op: "=", value: "" }); rebuildTerms(); renderResult(); } },
        }, "+ agregar término (AND)");

        var nameCtrl = lab.text({ label: "Nombre de la vista", value: view.name, mono: true, onChange: function (v) { view.name = v || view.name; renderResult(); renderOperation(); } });
        var optCtrl = lab.segmented({
          label: "Opción de chequeo", options: engine.CHECK_OPTIONS, value: view.checkOption,
          onChange: function (v) { view.checkOption = v; renderResult(); },
        });

        // En figura la cadena queda fija (no se agregan ni se quitan vistas): es
        // estructura, no el control esencial que enseña la figura.
        var removeViewBtn = !compact && vi === state.chain.length - 1 && state.chain.length > 1 ? h("button", {
          type: "button", class: "bdii-btn bdii-btn--ghost",
          on: { click: function () { state.chain.pop(); if (state.operation.targetIndex >= state.chain.length) state.operation.targetIndex = state.chain.length - 1; renderAll(); } },
        }, "Quitar V" + (vi + 1) + " (la más externa)") : null;

        return lab.panel(
          "V" + (vi + 1) + " — sobre " + (vi === 0 ? state.baseTable : state.chain[vi - 1].name),
          nameCtrl.el,
          h("div", { class: "lab-cko-where" }, h("span", { class: "lab-cko-where-label" }, "WHERE"), predWrap, addTermBtn),
          optCtrl.el,
          removeViewBtn,
        );
      }

      // Opciones de chequeo con rótulo corto, para la figura (una fila por vista).
      var CHECK_OPTIONS_CORTAS = [
        { value: "none", label: "Sin opción" },
        { value: "local", label: "LOCAL" },
        { value: "cascaded", label: "CASCADED" },
      ];

      /** Figura: cada vista en una fila, con su definición en texto y solo la opción de chequeo editable. */
      function renderChainCompact() {
        state.chain.forEach(function (view, vi) {
          var optCtrl = lab.segmented({
            label: "V" + (vi + 1) + " (" + view.name + ") — opción de chequeo", options: CHECK_OPTIONS_CORTAS, value: view.checkOption,
            onChange: function (v) { view.checkOption = v; renderResult(); },
          });
          chainWrap.appendChild(h("div", { class: "lab-cko-fig-view" },
            h("p", { class: "lab-cko-fig-def" },
              h("code", { class: "bdii-mono" }, view.name),
              " sobre " + (vi === 0 ? state.baseTable : state.chain[vi - 1].name) + ": WHERE ",
              h("code", { class: "bdii-mono" }, predicateToSql(view.predicate, state.columns).replace(/\n\s*/g, " "))),
            optCtrl.el));
        });
      }

      function renderChain() {
        chainWrap.replaceChildren();
        if (compact) { renderChainCompact(); return; }
        state.chain.forEach(function (view, vi) { chainWrap.appendChild(renderViewCard(view, vi)); });
        if (!compact && state.chain.length < 3) {
          var addViewBtn = h("button", {
            type: "button", class: "bdii-btn bdii-btn--primary",
            on: {
              click: function () {
                var parent = state.chain[state.chain.length - 1];
                state.chain.push({ name: "V" + (state.chain.length + 1), checkOption: "none", predicate: [{ column: state.columns[0].key, op: "=", value: "" }] });
                renderAll();
              },
            },
          }, "+ agregar V" + (state.chain.length + 1) + " sobre " + state.chain[state.chain.length - 1].name);
          chainWrap.appendChild(addViewBtn);
        }
      }

      // ---------------- operación ----------------

      var opWrap = h("div", { class: "lab-cko-op" });
      var valuesWrap = h("div", { class: "lab-cko-values" });

      function renderOperation() {
        opWrap.replaceChildren();
        var targetCtrl = lab.select({
          label: "Escribir a través de",
          options: state.chain.map(function (v, i) { return { value: i, label: "V" + (i + 1) + " (" + v.name + ")" }; }),
          value: state.operation.targetIndex,
          onChange: function (v) { state.operation.targetIndex = parseInt(v, 10); if (state.matrixMode) renderMatrix(); else renderResult(); },
        });
        var kindCtrl = lab.segmented({
          label: "Operación", options: [{ value: "insert", label: "INSERT" }, { value: "update", label: "UPDATE" }],
          value: state.operation.kind,
          onChange: function (v) {
            state.operation.kind = v;
            if (v === "update" && state.operation.rowIndex == null && state.rows.length) {
              state.operation.rowIndex = 0;
              state.operation.values = defaultValuesFromRow(state.columns, state.rows[0]);
            }
            renderOperation(); renderResult();
          },
        });
        opWrap.appendChild(h("div", { class: "lab-cko-op-grid" }, targetCtrl.el, kindCtrl.el));

        if (state.operation.kind === "update") {
          var rowCtrl = lab.select({
            label: "Fila existente a actualizar",
            options: state.rows.map(function (r, ri) { return { value: ri, label: rowLabel(state.columns, r) }; }),
            value: state.operation.rowIndex == null ? 0 : state.operation.rowIndex,
            onChange: function (v) {
              state.operation.rowIndex = parseInt(v, 10);
              state.operation.values = defaultValuesFromRow(state.columns, state.rows[state.operation.rowIndex]);
              renderOperation(); renderResult();
            },
          });
          opWrap.appendChild(rowCtrl.el);
        }

        renderValues();
        opWrap.appendChild(valuesWrap);
      }

      function renderValues() {
        valuesWrap.replaceChildren();
        state.columns.forEach(function (c) {
          var ctrl = lab.text({
            label: c.label, value: state.operation.values[c.key] === null ? "NULL" : String(state.operation.values[c.key]), mono: true,
            onChange: function (v) { state.operation.values[c.key] = v; if (state.matrixMode) renderMatrix(); else renderResult(); },
          });
          valuesWrap.appendChild(ctrl.el);
        });
      }

      // ---------------- resultado explicado ----------------

      var resultWrap = h("div", { class: "lab-cko-result", "aria-live": "polite" });
      var modeToggle;

      function currentRow() { return engine.coerceRow(state.operation.values, state.columns); }

      function reasonText(entry) {
        if (!entry.evaluated) return "no se evalúa: esta vista no declara CHECK OPTION propio y no llegó una obligación CASCADED desde una vista de más arriba";
        if (entry.reason === "propia") return "se evalúa: es la condición propia de esta vista (declara " + checkOptionLabel(entry.checkOption) + ")";
        return "se evalúa: no tiene CHECK OPTION propio, pero una vista de más arriba declaró CASCADED y fuerza el chequeo aquí";
      }

      function traceTable(trace) {
        var rows = trace.map(function (e) {
          var view = state.chain[e.index];
          return {
            vista: "V" + (e.index + 1) + " (" + e.name + ")",
            predicado: predicateToSql(view.predicate, state.columns).replace(/\n\s*/g, " "),
            opcion: checkOptionLabel(e.checkOption),
            porque: reasonText(e),
            valor: e.evaluated ? (e.value === true ? "VERDADERO" : e.value === false ? "FALSO" : "DESCONOCIDO (NULL)") : "—",
          };
        });
        if (compact) {
          return lab.table({
            caption: "Traza de chequeo (V1 = la más cercana a la tabla base)",
            columns: [
              { key: "vista", label: "Vista", mono: true },
              { key: "opcion", label: "Opción" },
              { key: "evalua", label: "¿Se evalúa?" },
              { key: "valor", label: "Valor", align: "center" },
            ],
            rows: trace.map(function (e, i) {
              var r = rows[i];
              return {
                vista: "V" + (e.index + 1), opcion: r.opcion, valor: r.valor,
                evalua: !e.evaluated ? "no" : (e.reason === "propia" ? "sí, por su opción" : "sí, forzada por CASCADED"),
              };
            }),
          });
        }
        return lab.table({
          caption: "Traza de chequeo, vista por vista (V1 = la más cercana a la tabla base)",
          columns: [
            { key: "vista", label: "Vista", mono: true },
            { key: "predicado", label: "WHERE de esa vista", mono: true },
            { key: "opcion", label: "Opción declarada" },
            { key: "porque", label: "Por qué se evaluó (o no)" },
            { key: "valor", label: "Valor", align: "center" },
          ],
          rows: rows,
        });
      }

      function visibilityTable(row) {
        var vis = engine.visibility(state.chain, row, state.columns);
        if (compact) {
          return h("p", { class: "lab-cko-hint" }, "La fila resultante queda visible en: " + state.baseTable + " ✓ · " +
            vis.map(function (e) { return "V" + (e.index + 1) + " " + (e.visible ? "✓" : "✗"); }).join(" · ") + ".");
        }
        var rows = vis.map(function (e) {
          return { vista: "V" + (e.index + 1) + " (" + e.name + ")", visible: e.visible ? "sí" : (e.value === null ? "no (condición DESCONOCIDA)" : "no") };
        });
        rows.unshift({ vista: state.baseTable + " (tabla base)", visible: "sí" });
        return lab.table({
          caption: "En qué vistas queda visible la fila resultante",
          columns: [{ key: "vista", label: "Nivel", mono: true }, { key: "visible", label: "Visible", align: "center" }],
          rows: rows,
        });
      }

      /** true si, CON SUS VALORES ACTUALES (antes del UPDATE), la fila es visible a
       *  través de la vista `targetIndex`: es la fila que un UPDATE por esa vista
       *  realmente toca. Ver nota en renderResult: si no es visible, MySQL afecta
       *  0 filas y ni siquiera llega a evaluar el CHECK OPTION (verificado en
       *  bdii-verify-mysql con alumnos/v_aprob, Clase 07). */
      function originalVisibleAtTarget(originalRow, targetIndex) {
        var vis = engine.visibility(state.chain, originalRow, state.columns);
        return !!(vis[targetIndex] && vis[targetIndex].visible);
      }

      function renderResult() {
        resultWrap.replaceChildren();
        var op = state.operation;
        var row = currentRow();
        var originalRow = op.kind === "update" ? state.rows[op.rowIndex] : null;
        var fullRow = op.kind === "update" ? Object.assign({}, originalRow || {}, row) : row;

        var sqlOp = engine.sqlForOperation(state.baseTable, state.columns, state.chain, op.targetIndex, op.kind, fullRow, op.kind === "update" ? (originalRow || {}) : {});
        var fullSql = engine.sqlForChain(state.baseTable, state.columns, state.chain) + "\n\n" + sqlOp;

        if (op.kind === "update") {
          if (!originalRow) {
            resultWrap.appendChild(lab.callout("warn", "No hay ninguna fila elegida", h("p", {}, "Elija, en “Operación”, qué fila existente actualizar.")));
            resultWrap.appendChild(lab.panel("SQL equivalente", lab.code(fullSql, "sql")));
            return;
          }
          if (!originalVisibleAtTarget(originalRow, op.targetIndex)) {
            resultWrap.appendChild(lab.callout("warn", "0 filas afectadas",
              h("p", {}, "Con sus valores actuales, esta fila no es visible a través de V" + (op.targetIndex + 1) + " (" + state.chain[op.targetIndex].name + "): un UPDATE por esa vista solo toca las filas que su SELECT devuelve. MySQL ejecuta la sentencia, afecta 0 filas y no da error — ni siquiera llega a evaluar el CHECK OPTION (verificado en bdii-verify-mysql: alumnos/v_aprob, Clase 07)."),
              h("p", { class: "lab-cko-hint" }, "Para que el UPDATE llegue a chequearse, la fila tiene que cumplir, ANTES de escribir, todos los WHERE desde V1 hasta V" + (op.targetIndex + 1) + " — pruebe con otra fila, o edítela en la tabla base.")));
            resultWrap.appendChild(lab.panel("SQL equivalente", lab.code(fullSql, "sql")));
            return;
          }
        }

        var res = engine.checkChain(state.chain, op.targetIndex, fullRow, state.semantics, state.columns);

        if (res.accepted) {
          resultWrap.appendChild(lab.callout("ok", "Procede", h("p", {}, "La operación se ejecuta sin error.")));
          resultWrap.appendChild(traceTable(res.trace));
          resultWrap.appendChild(visibilityTable(fullRow));
        } else {
          var errMsg = engine.errorMessage(state.db, state.chain, op.targetIndex);
          var label = state.semantics === "mysql"
            ? "MySQL 9.7.2 — regla y formato de error verificados en bdii-verify-mysql:"
            : "Según la definición del deck (slide 15), NO según MySQL — esta combinación de motor puro no se corrió contra el contenedor real; compare con “MySQL 9.7.2” en Semántica:";
          resultWrap.appendChild(compact
            ? lab.callout("bad", "Rechazada", h("p", {}, h("code", { class: "bdii-mono lab-cko-errline" }, errMsg)))
            : lab.callout("bad", "Rechazada", h("p", {}, label), lab.code(errMsg, "text")));
          resultWrap.appendChild(traceTable(res.trace));
          if (!compact) resultWrap.appendChild(h("p", { class: "lab-cko-hint" }, "No se modifica nada: la tabla base conserva sus valores anteriores."));
        }
        if (!compact) resultWrap.appendChild(lab.panel("SQL equivalente", lab.code(fullSql, "sql")));
      }

      // ---------------- matriz ----------------

      var matrixWrap = h("div", { class: "lab-cko-matrix" });

      function renderMatrix() {
        matrixWrap.replaceChildren();
        var t = state.operation.targetIndex;
        if (t === 0) {
          matrixWrap.appendChild(lab.callout("info", "No hay nada que variar", "V1 no tiene ninguna vista debajo: la matriz necesita al menos V1 y V2."));
          return;
        }
        var op = state.operation;
        var originalRow = op.kind === "update" ? state.rows[op.rowIndex] : null;
        if (op.kind === "update") {
          if (!originalRow) {
            matrixWrap.appendChild(lab.callout("warn", "No hay ninguna fila elegida", "Elija, en “Operación”, qué fila existente actualizar."));
            return;
          }
          if (!originalVisibleAtTarget(originalRow, t)) {
            matrixWrap.appendChild(lab.callout("warn", "0 filas afectadas, en las 9 (o 27) combinaciones",
              "Con sus valores actuales esta fila no es visible a través de V" + (t + 1) + ": ningún UPDATE por esa vista la toca, sea cual sea la opción de CHECK OPTION que se pruebe. Elija otra fila, o cambie a INSERT."));
            return;
          }
        }
        var varyIndices = [t, t - 1];
        if (t - 2 >= 0 && state.includeGrandparent) varyIndices.push(t - 2);
        var row = currentRow();
        var fullRow = op.kind === "update" ? Object.assign({}, originalRow || {}, row) : row;
        var combos = engine.buildMatrix(state.chain, t, fullRow, state.semantics, varyIndices, state.columns);
        var rows = combos.map(function (c) {
          var r = {};
          varyIndices.forEach(function (idx) { r["v" + (idx + 1)] = checkOptionLabel(c.assign[idx]); });
          r.resultado = c.accepted ? "✓ procede" : "✗ rechaza";
          return r;
        });
        var matrixColumns = varyIndices.slice().sort(function (a, b) { return a - b; }).map(function (idx) { return { key: "v" + (idx + 1), label: "Opción de V" + (idx + 1) }; });
        matrixColumns.push({ key: "resultado", label: "Resultado", align: "center" });
        matrixWrap.appendChild(lab.table({
          caption: (varyIndices.length === 3 ? "27" : "9") + " combinaciones, escribiendo a través de V" + (t + 1) + " con la fila actual",
          columns: matrixColumns,
          rows: rows,
          rowClass: function (r) { return r.resultado.indexOf("✗") === 0 ? "lab-cko-row-reject" : ""; },
        }));
      }

      // ---------------- retos ----------------

      var retosWrap = h("div", { class: "lab-cko-retos" });

      function appSnapshot() {
        return { presetId: state.presetId, semantics: state.semantics, chain: state.chain, operation: state.operation, columns: state.columns };
      }

      function renderRetos() {
        retosWrap.replaceChildren();
        engine.RETOS.forEach(function (reto) {
          var out = h("div", { "aria-live": "polite" });
          var actionBtn;
          if (reto.kind === "reveal") {
            actionBtn = lab.button({ label: "Ver respuesta", kind: "ghost", onClick: function () { out.replaceChildren(lab.callout("info", "Respuesta", h("p", {}, reto.respuesta))); } });
          } else {
            actionBtn = lab.button({
              label: "Comprobar", kind: "primary",
              onClick: function () { var r = reto.check(appSnapshot()); out.replaceChildren(lab.callout(r.pass ? "ok" : "bad", r.pass ? "Correcto" : "Todavía no", h("p", {}, r.detail))); },
            });
          }
          retosWrap.appendChild(lab.panel(reto.titulo, h("p", {}, reto.enunciado), h("p", { class: "lab-cko-hint" }, "Fuente: ", reto.fuente), actionBtn.el, out));
        });
      }

      // ---------------- ensamblado ----------------

      function renderAll() {
        renderBaseTable();
        renderChain();
        renderOperation();
        if (state.matrixMode) renderMatrix(); else renderResult();
      }

      var matrixToggleWrap = h("div", { class: "lab-cko-matrix-toggle" });
      function renderMatrixToggle() {
        matrixToggleWrap.replaceChildren();
        var seg = lab.segmented({
          label: "Vista del resultado", options: [{ value: "single", label: "Operación única" }, { value: "matrix", label: "Matriz de combinaciones" }],
          value: state.matrixMode ? "matrix" : "single",
          onChange: function (v) { state.matrixMode = v === "matrix"; if (state.matrixMode) renderMatrix(); else renderResult(); toggleResultVisibility(); },
        });
        matrixToggleWrap.appendChild(seg.el);
        if (state.chain.length === 3) {
          var gp = lab.toggle({ label: "Incluir también V1 en la matriz (27 combinaciones)", checked: state.includeGrandparent, onChange: function (v) { state.includeGrandparent = v; if (state.matrixMode) renderMatrix(); } });
          matrixToggleWrap.appendChild(gp.el);
        }
      }

      function toggleResultVisibility() {
        resultWrap.style.display = state.matrixMode ? "none" : "";
        matrixWrap.style.display = state.matrixMode ? "" : "none";
      }

      renderAll();
      if (!compact) { renderMatrixToggle(); toggleResultVisibility(); }
      if (!compact) renderRetos();

      var enlaces = h("p", { class: "lab-cko-hint" },
        "Ver también: ", lab.pageLink("1.06.01 - Vistas", "Vistas"), " · ", lab.pageLink("Práctica 2026-08-11", "TP4 completo"),
        " · ", lab.pageLink("Parcial 2Q2025", "Parcial 2Q2025"));

      var configPanel = compact ? null : lab.panel("Escenario", presetCtrl.el, semanticaCtrl.el,
        h("p", { class: "lab-cko-hint" }, "MySQL y la lectura literal del deck (slide 15) SOLO pueden diferir cuando el camino de escritura pasa por una vista WITH LOCAL CHECK OPTION que no llega forzada por un CASCADED de más arriba: ahí, la lectura del deck no mira más abajo de esa vista (ni siquiera para encontrar un CHECK OPTION propio más abajo), mientras que MySQL sí lo hace. Sin ninguna vista LOCAL en el camino, las dos lecturas dan siempre el mismo resultado. Ver Reto 3."));
      var tablePanel = compact ? null : lab.panel("Tabla base — " + state.baseTable, baseTableWrap);
      var chainPanel = lab.panel("Cadena de vistas", chainWrap);
      var opPanel = lab.panel("Operación", opWrap);
      // En figura no se ofrece el modo Matriz (control no esencial: multiplica
      // los paneles sin agregar un concepto nuevo al de la operación única).
      var resultPanel = compact
        ? lab.panel("Resultado explicado", resultWrap)
        : lab.panel("Resultado explicado", matrixToggleWrap, resultWrap, matrixWrap);

      if (compact) {
        // Figura: escenario, la cadena con su opción de chequeo, la operación y el
        // resultado. La tabla base editable, el SQL completo, la matriz y los retos
        // quedan en el laboratorio completo.
        body.appendChild(lab.grid(2, presetCtrl.el, semanticaCtrl.el));
        body.appendChild(lab.panel("Cadena de vistas", chainWrap));
        body.appendChild(opPanel);
        body.appendChild(resultPanel);
      } else {
        body.appendChild(configPanel);
        body.appendChild(h("div", { class: "lab-cko-two-col" }, tablePanel, chainPanel));
        body.appendChild(opPanel);
        body.appendChild(resultPanel);
        body.appendChild(lab.panel("Retos", retosWrap));
        body.appendChild(lab.callout("info", "Simplificaciones de esta herramienta",
          h("ul", { class: "lab-cko-diff-list" },
            h("li", {}, "Todas las vistas son SELECT * con un WHERE de una tabla o vista previa (σ puro): no modela JOINs ni columnas renombradas, así que toda vista de esta herramienta es automáticamente actualizable."),
            h("li", {}, "No modela restricciones de la tabla base (NOT NULL, FK, CHECK de tabla): una operación puede rechazarse en el motor real por esas razones aunque WITH CHECK OPTION la acepte."),
            h("li", {}, "Las comparaciones de texto (=, <>, <, <=, >, >=, LIKE) se repliegan a minúsculas y sin acentos, como la collation por omisión de MySQL 9 (utf8mb4_0900_ai_ci) — verificado en el motor."),
            h("li", {}, "No redondea según la precisión de la columna: un valor como 24.999 contra una columna DECIMAL(10,2) se compara tal cual, aunque MySQL lo redondee primero a 25.00 antes de chequear la condición."),
            h("li", {}, "La \"definición del deck\" para LOCAL es una lectura literal del slide 15, ofrecida para contrastar; el motor real siempre sigue la semántica \"MySQL\"."))));
        body.appendChild(enlaces);
      }

      return function cleanup() {};
    },
  );
})();
