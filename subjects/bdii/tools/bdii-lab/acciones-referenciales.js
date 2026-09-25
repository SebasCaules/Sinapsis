/* ============================================================
   bdii-lab / acciones-referenciales.js — "Integridad referencial: acciones y MATCH"

   Motor puro: App.bdiiLab.engines["acciones-referenciales"]
     - Hasta 3 tablas con FKs (simples o compuestas) entre ellas. Cada FK
       tiene ON DELETE / ON UPDATE en NO_ACTION | RESTRICT | CASCADE |
       SET_NULL | SET_DEFAULT, y MATCH en SIMPLE | PARTIAL | FULL.
     - `runStatement` ejecuta un DELETE/UPDATE/INSERT sobre una fila y
       devuelve una traza completa paso a paso (SQL-99, slide 38 de la
       Clase 09: RESTRICT se chequea de inmediato; CASCADE/SET NULL/
       SET DEFAULT reparan; NO ACTION se chequea al final, ya con las
       reparaciones aplicadas) más el estado final del esquema.
     - Semántica "estándar" implementa el algoritmo de la Clase 09 tal
       cual. Semántica "mysql" simplifica lo verificado en
       bdii-verify-mysql 9.7.2: RESTRICT y NO ACTION se comportan igual
       (chequeo inmediato, sin diferido), MATCH se ignora (siempre
       SIMPLE), SET DEFAULT no aplica el reparo en tiempo de ejecución
       (se comporta como RESTRICT, aunque la tabla SÍ se puede crear con
       esa cláusula — corrección a lo que asumía MySQL.md, ver nota en la
       herramienta), y la cascada tiene un tope de profundidad de 15
       niveles (`ERROR 3008`, verificado).

   Fuentes del vault (ver sources del tool() más abajo): 1.09.01, 1.09.02,
   Clase 09 - Restricciones integridad-Parte 1 (slides 7-14, 38),
   Práctica 2026-08-25 (TP6, ejercicios 1 y 2), Parcial 2Q2025 § Sección B,
   MySQL.md § 5.1.
   ============================================================ */
(function () {
  "use strict";

  var App = window.App;
  if (!App) return;
  var lab = App.bdiiLab;
  if (!lab) return; // lib.js no se cargó antes: nada que hacer

  // ==================================================================
  // Motor puro
  // ==================================================================

  var ACTIONS = ["NO_ACTION", "RESTRICT", "CASCADE", "SET_NULL", "SET_DEFAULT"];
  var ACTION_LABELS = {
    NO_ACTION: "NO ACTION",
    RESTRICT: "RESTRICT",
    CASCADE: "CASCADE",
    SET_NULL: "SET NULL",
    SET_DEFAULT: "SET DEFAULT",
  };
  var MATCH_MODES = ["SIMPLE", "PARTIAL", "FULL"];
  var SEMANTICS = ["standard", "mysql"];

  function col(name, type, nullable, hasDefault, defaultValue) {
    return {
      name: name,
      type: type || "text",
      nullable: !!nullable,
      hasDefault: !!hasDefault,
      "default": hasDefault ? defaultValue : null,
    };
  }

  function findTable(schema, id) {
    for (var i = 0; i < schema.tables.length; i++) if (schema.tables[i].id === id) return schema.tables[i];
    return null;
  }
  function findColumn(table, name) {
    for (var i = 0; i < table.columns.length; i++) if (table.columns[i].name === name) return table.columns[i];
    return null;
  }
  function findFk(schema, id) {
    for (var i = 0; i < schema.fks.length; i++) if (schema.fks[i].id === id) return schema.fks[i];
    return null;
  }
  function fksFrom(schema, tableId) {
    return schema.fks.filter(function (fk) { return fk.fromTable === tableId; });
  }
  function fksTo(schema, tableId) {
    return schema.fks.filter(function (fk) { return fk.toTable === tableId; });
  }

  function cloneRow(r) {
    var o = {};
    for (var k in r) if (Object.prototype.hasOwnProperty.call(r, k)) o[k] = r[k];
    return o;
  }
  function cloneSchema(schema) {
    return {
      tables: schema.tables.map(function (t) {
        return { id: t.id, name: t.name, columns: t.columns, pk: t.pk.slice(), rows: t.rows.map(cloneRow) };
      }),
      fks: schema.fks.map(cloneRow),
      __seq: schema.__seq || 0,
    };
  }

  /** Instancia un esquema nuevo (filas con __id frescos) a partir de un preset. No muta el preset. */
  function instantiateSchema(preset) {
    var seq = 0;
    var tables = preset.tables.map(function (t) {
      return {
        id: t.id,
        name: t.name,
        columns: t.columns,
        pk: t.pk.slice(),
        rows: t.rows.map(function (r) {
          seq += 1;
          var o = cloneRow(r);
          o.__id = t.id + "#s" + seq;
          return o;
        }),
      };
    });
    var fks = preset.fks.map(cloneRow);
    return { tables: tables, fks: fks, __seq: seq };
  }

  function rowKeyVals(row, cols) {
    return cols.map(function (c) { return row[c]; });
  }

  /** ¿La fila `row` referencia exactamente `keyVals` por `cols`? Un NULL en cualquier columna la excluye. */
  function rowMatchesKey(row, cols, keyVals) {
    for (var i = 0; i < cols.length; i++) {
      var v = row[cols[i]];
      if (v === null || v === undefined) return false;
      if (v !== keyVals[i]) return false;
    }
    return true;
  }

  /**
   * Regla del slide 13 de la Clase 09 / tabla de 1.09.02 § Tipos de matching:
   * ¿el vector `vals` (valores de la FK, con posibles NULL) satisface la
   * integridad referencial contra `refRows` (filas de la tabla referenciada,
   * columnas `refCols`) bajo `matchMode`?
   */
  function matchSatisfied(vals, refRows, refCols, matchMode) {
    var nulls = 0;
    for (var i = 0; i < vals.length; i++) if (vals[i] === null || vals[i] === undefined) nulls++;
    if (nulls === vals.length) return true; // todas nulas: satisface SIMPLE, PARTIAL y FULL
    if (nulls === 0) {
      // sin nulos: tiene que existir la combinación completa (por combinación, no columna a columna)
      return refRows.some(function (r) {
        return refCols.every(function (c, i) { return r[c] === vals[i]; });
      });
    }
    // mezcla de nulos y no nulos
    if (matchMode === "SIMPLE") return true;
    if (matchMode === "FULL") return false;
    // PARTIAL: ignora las columnas nulas, exige que las no nulas coincidan en alguna fila
    var idx = [];
    for (var j = 0; j < vals.length; j++) if (vals[j] !== null && vals[j] !== undefined) idx.push(j);
    return refRows.some(function (r) {
      return idx.every(function (i2) { return r[refCols[i2]] === vals[i2]; });
    });
  }

  function effectiveMatch(declared, semantics) {
    return semantics === "mysql" ? "SIMPLE" : declared;
  }

  /** ¿Esta acción se chequea de inmediato (antes de cualquier reparación)? */
  function isImmediateCheck(action, semantics) {
    if (action === "RESTRICT") return true;
    if (semantics === "mysql" && (action === "NO_ACTION" || action === "SET_DEFAULT")) return true;
    return false;
  }
  /** ¿Esta acción se chequea al final, después de las reparaciones? (solo NO ACTION, solo estándar) */
  function isDeferredNoAction(action, semantics) {
    return action === "NO_ACTION" && semantics === "standard";
  }

  var MAX_CASCADE_DEPTH_MYSQL = 15; // verificado: ERROR 3008, "exceeds max depth of 15"

  /** Chequea las FKs SALIENTES de `table` (donde `table` es la referenciante) contra `rowValues`. */
  function checkOutgoingFks(schema, semantics, table, rowValues) {
    var fks = fksFrom(schema, table.id);
    var checks = [];
    for (var i = 0; i < fks.length; i++) {
      var fk = fks[i];
      var refTable = findTable(schema, fk.toTable);
      var vals = rowKeyVals(rowValues, fk.fromCols);
      var match = effectiveMatch(fk.match, semantics);
      var ok = matchSatisfied(vals, refTable.rows, fk.toCols, match);
      checks.push({ fk: fk.id, vals: vals, match: match, declaredMatch: fk.match, ok: ok });
      if (!ok) return { ok: false, fk: fk, checks: checks };
    }
    return { ok: true, checks: checks };
  }

  /**
   * Procesa lo que le pasa a las filas que referencian la clave `oldKey` de
   * `table` cuando esa clave se borra (`newRowOrNull === null`) o cambia a
   * `newRowOrNull`. Implementa el algoritmo SQL-99 del slide 38: Apply
   * RESTRICT Rules -> Apply CASCADE/SET NULL/SET DEFAULT Rules -> Apply
   * NO ACTION Rules and Evaluate Constraints. Muta `schema` en el lugar
   * (ya es un clon hecho por el llamador) y llama a `pushStep(step)` por
   * cada paso, para la traza.
   */
  function touchParentKey(schema, semantics, table, oldRow, newRowOrNull, opType, pushStep, visited, depth) {
    depth = depth || 0;
    // Verificado en bdii-verify-mysql 9.7.2: una cadena de 15 tablas (raíz + 14
    // niveles de cascada) se acepta; una de 16 (raíz + 15 niveles) se rechaza con
    // ERROR 3008 "exceeds max depth of 15". `depth` cuenta niveles de cascada
    // (depth 0 = la fila que toca el usuario, sin cascada todavía), así que el
    // 15º nivel (depth === MAX_CASCADE_DEPTH_MYSQL) ya excede el tope: hay que
    // rechazar con >=, no con > (que rechazaba recién en el 16º nivel).
    if (semantics === "mysql" && depth >= MAX_CASCADE_DEPTH_MYSQL) {
      pushStep({ kind: "depth-exceeded", table: table.id, depth: depth });
      return { ok: false, error: { reason: "depth-exceeded" } };
    }
    var oldKey = rowKeyVals(oldRow, table.pk);
    var visitKey = table.id + "#" + oldKey.join(",");
    if (visited[visitKey]) return { ok: true };
    visited[visitKey] = true;

    var groups = [];
    fksTo(schema, table.id).forEach(function (fk) {
      var childTable = findTable(schema, fk.fromTable);
      var rows = childTable.rows.filter(function (r) { return rowMatchesKey(r, fk.fromCols, oldKey); });
      if (rows.length) groups.push({ fk: fk, childTable: childTable, rows: rows.slice() });
    });

    if (!groups.length) {
      pushStep({ kind: "no-references", table: table.id, key: oldKey });
      return { ok: true };
    }

    /** Aplica la reparación (CASCADE / SET NULL / SET DEFAULT) de un grupo {fk, childTable, rows}. */
    function aplicarReparacion(g2, action2) {
      if (action2 === "CASCADE") {
        for (var ri = 0; ri < g2.rows.length; ri++) {
          var crow = g2.rows[ri];
          if (opType === "DELETE") {
            pushStep({ kind: "cascade-delete", fk: g2.fk.id, table: g2.childTable.id, rowId: crow.__id });
            var sub = touchParentKey(schema, semantics, g2.childTable, crow, null, "DELETE", pushStep, visited, depth + 1);
            if (!sub.ok) return sub;
            g2.childTable.rows = g2.childTable.rows.filter(function (r) { return r.__id !== crow.__id; });
            pushStep({ kind: "cascade-delete-done", fk: g2.fk.id, table: g2.childTable.id, rowId: crow.__id });
          } else {
            var newVals = {};
            g2.fk.fromCols.forEach(function (c, i) { newVals[c] = newRowOrNull[g2.fk.toCols[i]]; });
            var isKeyPart = g2.childTable.pk.some(function (c) { return g2.fk.fromCols.indexOf(c) !== -1; });
            if (isKeyPart) {
              var newChildRow = cloneRow(crow);
              for (var nk in newVals) newChildRow[nk] = newVals[nk];
              var sub2 = touchParentKey(schema, semantics, g2.childTable, crow, newChildRow, "UPDATE", pushStep, visited, depth + 1);
              if (!sub2.ok) return sub2;
            }
            pushStep({ kind: "cascade-update", fk: g2.fk.id, table: g2.childTable.id, rowId: crow.__id, newVals: newVals });
            for (var nk2 in newVals) crow[nk2] = newVals[nk2];
          }
        }
      } else if (action2 === "SET_NULL") {
        var badNullCol = null;
        for (var bi = 0; bi < g2.fk.fromCols.length; bi++) {
          if (!findColumn(g2.childTable, g2.fk.fromCols[bi]).nullable) { badNullCol = g2.fk.fromCols[bi]; break; }
        }
        if (badNullCol) {
          pushStep({ kind: "set-null-fail", fk: g2.fk.id, table: g2.childTable.id, column: badNullCol, rows: g2.rows.map(function (r) { return r.__id; }), semantics: semantics });
          return { ok: false, error: { reason: "set-null-not-nullable", fk: g2.fk.id, semantics: semantics } };
        }
        g2.rows.forEach(function (r) {
          pushStep({ kind: "set-null", fk: g2.fk.id, table: g2.childTable.id, rowId: r.__id });
          g2.fk.fromCols.forEach(function (c) { r[c] = null; });
        });
      } else if (action2 === "SET_DEFAULT") {
        // (en semántica "mysql", SET DEFAULT ya se resolvió como chequeo inmediato)
        var refTable = findTable(schema, g2.fk.toTable);
        var defaults = g2.fk.fromCols.map(function (c) {
          var cdef = findColumn(g2.childTable, c);
          return cdef.hasDefault ? cdef["default"] : null;
        });
        var invalidNull = null;
        for (var di = 0; di < g2.fk.fromCols.length; di++) {
          if (defaults[di] === null && !findColumn(g2.childTable, g2.fk.fromCols[di]).nullable) { invalidNull = g2.fk.fromCols[di]; break; }
        }
        if (invalidNull) {
          pushStep({ kind: "set-default-fail", reason: "not-null", fk: g2.fk.id, table: g2.childTable.id, column: invalidNull, rows: g2.rows.map(function (r) { return r.__id; }) });
          return { ok: false, error: { reason: "set-default-not-null", fk: g2.fk.id } };
        }
        var satisfied = matchSatisfied(defaults, refTable.rows, g2.fk.toCols, effectiveMatch(g2.fk.match, semantics));
        if (!satisfied) {
          pushStep({ kind: "set-default-fail", reason: "fk-violation", fk: g2.fk.id, table: g2.childTable.id, defaults: defaults, rows: g2.rows.map(function (r) { return r.__id; }) });
          return { ok: false, error: { reason: "set-default-fk-violation", fk: g2.fk.id } };
        }
        g2.rows.forEach(function (r) {
          pushStep({ kind: "set-default", fk: g2.fk.id, table: g2.childTable.id, rowId: r.__id, defaults: defaults });
          g2.fk.fromCols.forEach(function (c, i) { r[c] = defaults[i]; });
        });
      }
      return { ok: true };
    }

    if (semantics === "mysql") {
      // InnoDB no separa fases: recorre las FKs que referencian esta tabla en ORDEN
      // DE CREACIÓN (el orden de schema.fks) y aplica cada una cuando le toca, sobre
      // las filas que TODAVÍA referencian la clave en ese momento. RESTRICT, NO
      // ACTION y SET DEFAULT rechazan si quedan filas; una cascada anterior puede
      // haberlas quitado. Verificado en MySQL 9.7.2 con el preset P / C2 / C1: con
      // fk_c2_p (CASCADE) creada antes que fk_c1_p, DELETE FROM P WHERE id=1 pasa
      // con NO ACTION y con RESTRICT; con fk_c1_p creada primero, ERROR 1451 con
      // las dos (el nombre de la constraint no influye; el orden de creación sí).
      for (var mi = 0; mi < groups.length; mi++) {
        var gm = groups[mi];
        var actionM = opType === "DELETE" ? gm.fk.onDelete : gm.fk.onUpdate;
        var vivas = gm.childTable.rows.filter(function (r) { return rowMatchesKey(r, gm.fk.fromCols, oldKey); });
        if (!vivas.length) {
          pushStep({ kind: "mysql-turn-clear", fk: gm.fk.id, action: actionM, table: gm.childTable.id });
          continue;
        }
        if (isImmediateCheck(actionM, semantics)) {
          pushStep({
            kind: "restrict-block", fk: gm.fk.id, action: actionM, semantics: semantics,
            table: gm.childTable.id, rows: vivas.map(function (r) { return r.__id; }),
          });
          return { ok: false, error: { reason: "restrict", fk: gm.fk.id, action: actionM, semantics: semantics } };
        }
        var repM = aplicarReparacion({ fk: gm.fk, childTable: gm.childTable, rows: vivas }, actionM);
        if (!repM.ok) return repM;
      }
      return { ok: true };
    }

    // ---- Fase 1: RESTRICT (y, en MySQL, NO ACTION y SET DEFAULT) — chequeo inmediato ----
    for (var gi = 0; gi < groups.length; gi++) {
      var g = groups[gi];
      var action = opType === "DELETE" ? g.fk.onDelete : g.fk.onUpdate;
      if (isImmediateCheck(action, semantics)) {
        pushStep({
          kind: "restrict-block", fk: g.fk.id, action: action, semantics: semantics,
          table: g.childTable.id, rows: g.rows.map(function (r) { return r.__id; }),
        });
        return { ok: false, error: { reason: "restrict", fk: g.fk.id, action: action } };
      }
      pushStep({ kind: "restrict-clear", fk: g.fk.id, action: action, table: g.childTable.id });
    }

    // ---- Fase 2: CASCADE / SET NULL / SET DEFAULT — reparaciones ----
    for (var gj = 0; gj < groups.length; gj++) {
      var rep = aplicarReparacion(groups[gj], opType === "DELETE" ? groups[gj].fk.onDelete : groups[gj].fk.onUpdate);
      if (!rep.ok) return rep;
    }

    // ---- Fase 3: NO ACTION diferido (solo estándar) ----
    for (var gk = 0; gk < groups.length; gk++) {
      var g3 = groups[gk];
      var action3 = opType === "DELETE" ? g3.fk.onDelete : g3.fk.onUpdate;
      if (isDeferredNoAction(action3, semantics)) {
        var stillMatching = g3.childTable.rows.filter(function (r) { return rowMatchesKey(r, g3.fk.fromCols, oldKey); });
        if (stillMatching.length) {
          pushStep({ kind: "no-action-block", fk: g3.fk.id, table: g3.childTable.id, rows: stillMatching.map(function (r) { return r.__id; }) });
          return { ok: false, error: { reason: "no-action", fk: g3.fk.id } };
        }
        pushStep({ kind: "no-action-pass", fk: g3.fk.id, table: g3.childTable.id });
      }
    }

    return { ok: true };
  }

  function nextRowId(schema, tableId) {
    schema.__seq = (schema.__seq || 0) + 1;
    return tableId + "#n" + schema.__seq;
  }

  /**
   * Ejecuta una sentencia sobre `schema0` (no lo muta) y devuelve
   * { ok, schema, trace, error }. `schema` es el esquema resultante si
   * `ok`, o el ORIGINAL sin cambios si se rechazó (una sentencia rechazada
   * deshace TODO, incluidas las reparaciones que alcanzó a calcular).
   *
   * stmt = { type: "DELETE"|"UPDATE"|"INSERT", table, rowId, changes, values, label }
   */
  function runStatement(schema0, semantics, stmt) {
    var schema = cloneSchema(schema0);
    var trace = [];
    var table = findTable(schema, stmt.table);
    if (!table) return { ok: false, schema: schema0, trace: trace, error: { reason: "unknown-table" } };

    function pushStep(step) {
      step.snapshot = cloneSchema(schema);
      trace.push(step);
    }

    pushStep({ kind: "start", stmtType: stmt.type, table: table.id, label: stmt.label || "" });

    if (stmt.type === "INSERT") {
      var newRow = {};
      table.columns.forEach(function (c) {
        var v = stmt.values ? stmt.values[c.name] : undefined;
        if (v === undefined) {
          // Columna OMITIDA del INSERT (a diferencia de un NULL explícito): si
          // tiene DEFAULT, el motor lo aplica (verificado: MySQL 9.7.2, INSERT
          // INTO Producto (idProd) VALUES (2) -> categoria = 'Sin categoria').
          newRow[c.name] = c.hasDefault ? c["default"] : null;
        } else {
          newRow[c.name] = (v === "" || v === null) ? null : v;
        }
      });
      var badCol = table.columns.filter(function (c) { return !c.nullable && newRow[c.name] === null; })[0];
      if (badCol) {
        pushStep({ kind: "reject", reason: "not-null", column: badCol.name });
        return { ok: false, schema: schema0, trace: trace, error: { reason: "not-null", column: badCol.name } };
      }
      var newKey = rowKeyVals(newRow, table.pk);
      var clash = table.rows.some(function (r) { return table.pk.every(function (c, i) { return r[c] === newKey[i]; }); });
      if (clash) {
        pushStep({ kind: "reject", reason: "pk-duplicate" });
        return { ok: false, schema: schema0, trace: trace, error: { reason: "pk-duplicate" } };
      }
      var outCheck = checkOutgoingFks(schema, semantics, table, newRow);
      outCheck.checks.forEach(function (c) {
        pushStep({ kind: c.ok ? "fk-check-pass" : "fk-check-fail", fk: c.fk, vals: c.vals, match: c.match, declaredMatch: c.declaredMatch, table: table.id });
      });
      if (!outCheck.ok) {
        pushStep({ kind: "reject", reason: "fk-violation", fk: outCheck.fk.id });
        return { ok: false, schema: schema0, trace: trace, error: { reason: "fk-violation", fk: outCheck.fk.id } };
      }
      newRow.__id = nextRowId(schema, table.id);
      table.rows.push(newRow);
      pushStep({ kind: "commit", table: table.id, rowId: newRow.__id });
      return { ok: true, schema: schema, trace: trace };
    }

    var row = table.rows.filter(function (r) { return r.__id === stmt.rowId; })[0];
    if (!row) return { ok: false, schema: schema0, trace: trace, error: { reason: "row-not-found" } };

    if (stmt.type === "DELETE") {
      var res = touchParentKey(schema, semantics, table, row, null, "DELETE", pushStep, {}, 0);
      if (!res.ok) return { ok: false, schema: schema0, trace: trace, error: res.error };
      table.rows = table.rows.filter(function (r) { return r.__id !== row.__id; });
      pushStep({ kind: "commit", table: table.id, rowId: row.__id, deleted: true });
      return { ok: true, schema: schema, trace: trace };
    }

    if (stmt.type === "UPDATE") {
      var changes = stmt.changes || {};
      var newValues = {};
      table.columns.forEach(function (c) {
        newValues[c.name] = Object.prototype.hasOwnProperty.call(changes, c.name) ? changes[c.name] : row[c.name];
      });
      var badCol2 = table.columns.filter(function (c) {
        return Object.prototype.hasOwnProperty.call(changes, c.name) && !c.nullable && newValues[c.name] === null;
      })[0];
      if (badCol2) {
        pushStep({ kind: "reject", reason: "not-null", column: badCol2.name });
        return { ok: false, schema: schema0, trace: trace, error: { reason: "not-null", column: badCol2.name } };
      }
      var outgoingChanged = fksFrom(schema, table.id).some(function (fk) {
        return fk.fromCols.some(function (c) { return Object.prototype.hasOwnProperty.call(changes, c); });
      });
      if (outgoingChanged) {
        var outCheck2 = checkOutgoingFks(schema, semantics, table, newValues);
        outCheck2.checks.forEach(function (c) {
          pushStep({ kind: c.ok ? "fk-check-pass" : "fk-check-fail", fk: c.fk, vals: c.vals, match: c.match, declaredMatch: c.declaredMatch, table: table.id });
        });
        if (!outCheck2.ok) {
          pushStep({ kind: "reject", reason: "fk-violation", fk: outCheck2.fk.id });
          return { ok: false, schema: schema0, trace: trace, error: { reason: "fk-violation", fk: outCheck2.fk.id } };
        }
      }
      var keyChanged = table.pk.some(function (c) {
        return Object.prototype.hasOwnProperty.call(changes, c) && changes[c] !== row[c];
      });
      if (keyChanged) {
        var newKeyRow = {};
        table.columns.forEach(function (c) { newKeyRow[c.name] = newValues[c.name]; });
        var res2 = touchParentKey(schema, semantics, table, row, newKeyRow, "UPDATE", pushStep, {}, 0);
        if (!res2.ok) return { ok: false, schema: schema0, trace: trace, error: res2.error };
        var newKeyVals = rowKeyVals(newValues, table.pk);
        var clash2 = table.rows.some(function (r) {
          return r.__id !== row.__id && table.pk.every(function (c, i) { return r[c] === newKeyVals[i]; });
        });
        if (clash2) {
          pushStep({ kind: "reject", reason: "pk-duplicate" });
          return { ok: false, schema: schema0, trace: trace, error: { reason: "pk-duplicate" } };
        }
      }
      table.columns.forEach(function (c) { row[c.name] = newValues[c.name]; });
      pushStep({ kind: "commit", table: table.id, rowId: row.__id });
      return { ok: true, schema: schema, trace: trace };
    }

    return { ok: false, schema: schema0, trace: trace, error: { reason: "unknown-statement" } };
  }

  /** Todas las filas mencionadas en la traza (para resaltar en el estado final). */
  function affectedRowIds(trace) {
    var out = {}; // tableId -> { rowId: true }
    function mark(tableId, rowId) {
      if (!tableId || !rowId) return;
      if (!out[tableId]) out[tableId] = {};
      out[tableId][rowId] = true;
    }
    trace.forEach(function (step) {
      if (step.rowId) mark(step.table, step.rowId);
      if (step.rows) step.rows.forEach(function (rid) { mark(step.table, rid); });
    });
    return out;
  }

  var ENGINE = {
    ACTIONS: ACTIONS,
    ACTION_LABELS: ACTION_LABELS,
    MATCH_MODES: MATCH_MODES,
    SEMANTICS: SEMANTICS,
    MAX_CASCADE_DEPTH_MYSQL: MAX_CASCADE_DEPTH_MYSQL,
    col: col,
    findTable: findTable,
    findColumn: findColumn,
    findFk: findFk,
    fksFrom: fksFrom,
    fksTo: fksTo,
    cloneSchema: cloneSchema,
    instantiateSchema: instantiateSchema,
    matchSatisfied: matchSatisfied,
    effectiveMatch: effectiveMatch,
    rowMatchesKey: rowMatchesKey,
    runStatement: runStatement,
    affectedRowIds: affectedRowIds,
  };

  App.bdiiLab.engines["acciones-referenciales"] = ENGINE;

  // ==================================================================
  // Presets — hasta 3 tablas, tomados del vault
  // ==================================================================

  var PRESETS = [
    {
      id: "parcial2q2025",
      label: "Facultad / Carrera / Materia",
      origen: "Parcial 2Q2025, Sección B (preguntas 17, 19 y 30)",
      note: "Facultad ← Carrera ← Materia, con R2 compuesta y nullable: el escenario exacto del parcial.",
      mysqlWarning: "Variante que el parcial NO plantea (en el parcial R1 es ON UPDATE RESTRICT): si se cambia R1 a ON UPDATE CASCADE, un UPDATE de Facultad que cascadea a DOS O MÁS filas de Carrera falla en MySQL con ERROR 1452 (\"a foreign key constraint fails\", CONSTRAINT R2) y no cambia nada, aunque ninguna FK declare RESTRICT y la cascada sea de solo dos niveles. Verificado en MySQL 9.7.2 con UPDATE Facultad SET idFac='F3' WHERE idFac='F2' (cascadearía a Carrera (2,F2) y (1,F2)). Es una limitación real de InnoDB que este simulador no reproduce en modo MySQL (el motor puro sí completa la cascada): documente la corrida, no la generalice. Con una sola fila intermedia la cascada de dos niveles sí coincide con MySQL: UPDATE Facultad SET idFac='F4' WHERE idFac='F1' actualiza Carrera (1,F1) y las materias M1 y M2 (verificado). La Pregunta 17 no es una cascada: se rechaza por clave primaria duplicada (ERROR 1062, Duplicate entry '1-F1').",
      tables: [
        { id: "facultad", name: "Facultad", pk: ["idFac"], columns: [col("idFac", "text", false)], rows: [{ idFac: "F1" }, { idFac: "F2" }] },
        {
          id: "carrera", name: "Carrera", pk: ["idCarr", "idFac"],
          columns: [col("idCarr", "int", false), col("idFac", "text", false)],
          rows: [{ idCarr: 1, idFac: "F1" }, { idCarr: 2, idFac: "F2" }, { idCarr: 1, idFac: "F2" }],
        },
        {
          id: "materia", name: "Materia", pk: ["idM"],
          columns: [col("idM", "text", false), col("carrera", "int", true), col("facultad", "text", true), col("nom", "text", true)],
          rows: [
            { idM: "M1", carrera: 1, facultad: "F1", nom: "nom1" },
            { idM: "M2", carrera: 1, facultad: "F1", nom: "nom2" },
            { idM: "M3", carrera: 2, facultad: "F2", nom: "nom3" },
          ],
        },
      ],
      fks: [
        { id: "R1", fromTable: "carrera", fromCols: ["idFac"], toTable: "facultad", toCols: ["idFac"], onDelete: "RESTRICT", onUpdate: "RESTRICT", match: "SIMPLE" },
        { id: "R2", fromTable: "materia", fromCols: ["carrera", "facultad"], toTable: "carrera", toCols: ["idCarr", "idFac"], onDelete: "RESTRICT", onUpdate: "CASCADE", match: "SIMPLE" },
      ],
      demos: [
        { label: "Pregunta 17 — UPDATE Carrera idFac F2→F1 (simula solo la fila idCarr=1; el parcial actualiza también idCarr=2)", origen: "Parcial 2Q2025, P.17", table: "carrera", op: "UPDATE", find: { idCarr: 1, idFac: "F2" }, changes: { idFac: "F1" } },
        { label: "Pregunta 19 — INSERT Materia (M4, carrera=3, facultad=NULL)", origen: "Parcial 2Q2025, P.19", table: "materia", op: "INSERT", values: { idM: "M4", carrera: 3, facultad: null, nom: "nom4" } },
        { label: "Pregunta 30 — DELETE Carrera idCarr=2", origen: "Parcial 2Q2025, P.30", table: "carrera", op: "DELETE", find: { idCarr: 2, idFac: "F2" } },
      ],
    },
    {
      id: "clase09-slide11",
      label: "Empleado / Area",
      origen: "Clase 09 - Restricciones integridad-Parte 1, slide 11",
      note: "El ejemplo del deck: FK simple y nullable. Cambie la acción y compare con la tabla del slide.",
      tables: [
        { id: "area", name: "Area", pk: ["idArea"], columns: [col("idArea", "int", false)], rows: [{ idArea: 101 }, { idArea: 102 }] },
        {
          id: "empleado", name: "Empleado", pk: ["idE"],
          columns: [col("idE", "int", false), col("nombre", "text", true), col("areaT", "int", true)],
          rows: [{ idE: 1, nombre: "E1", areaT: 101 }, { idE: 2, nombre: "E2", areaT: 101 }],
        },
      ],
      fks: [
        { id: "FK_R", fromTable: "empleado", fromCols: ["areaT"], toTable: "area", toCols: ["idArea"], onDelete: "NO_ACTION", onUpdate: "NO_ACTION", match: "SIMPLE" },
      ],
      demos: [
        { label: "DELETE Area idArea=101 (referenciada por los dos empleados)", origen: "Clase 09, slide 11", table: "area", op: "DELETE", find: { idArea: 101 } },
        { label: "DELETE Area idArea=102 (nadie la referencia)", origen: "Clase 09, slide 11", table: "area", op: "DELETE", find: { idArea: 102 } },
        { label: "UPDATE Area idArea 101→201", origen: "Clase 09, slide 11", table: "area", op: "UPDATE", find: { idArea: 101 }, changes: { idArea: 201 } },
      ],
    },
    {
      id: "tp6-cascada",
      label: "Empleado / Proyecto / Trabaja_en",
      origen: "Práctica 2026-08-25 (TP6), Ejercicio 1.a/1.b",
      note: "R1 compuesta (CASCADE en baja, RESTRICT en modificación) y R2 simple (RESTRICT en baja, CASCADE en modificación). Este preset no incluye Auspicio ni R4: para el punto iv completo (con sus DOS efectos), ver el preset \"Auspicio / Empleado / Trabaja_en\".",
      tables: [
        {
          id: "empleado", name: "Empleado", pk: ["tipoE", "nroE"],
          columns: [col("tipoE", "text", false), col("nroE", "int", false), col("nombre", "text", true)],
          rows: [{ tipoE: "A", nroE: 1, nombre: "E1" }, { tipoE: "A", nroE: 2, nombre: "E2" }, { tipoE: "B", nroE: 2, nombre: "E3" }],
        },
        {
          id: "proyecto", name: "Proyecto", pk: ["idProy"],
          columns: [col("idProy", "int", false), col("nombre", "text", true)],
          rows: [{ idProy: 1, nombre: "P1" }, { idProy: 2, nombre: "P2" }, { idProy: 3, nombre: "P3" }],
        },
        {
          id: "trabaja_en", name: "Trabaja_en", pk: ["tipoE", "nroE", "idProy"],
          columns: [col("tipoE", "text", false), col("nroE", "int", false), col("idProy", "int", false)],
          rows: [{ tipoE: "A", nroE: 1, idProy: 1 }, { tipoE: "A", nroE: 2, idProy: 2 }],
        },
      ],
      fks: [
        { id: "R1", fromTable: "trabaja_en", fromCols: ["tipoE", "nroE"], toTable: "empleado", toCols: ["tipoE", "nroE"], onDelete: "CASCADE", onUpdate: "RESTRICT", match: "SIMPLE" },
        { id: "R2", fromTable: "trabaja_en", fromCols: ["idProy"], toTable: "proyecto", toCols: ["idProy"], onDelete: "RESTRICT", onUpdate: "CASCADE", match: "SIMPLE" },
      ],
      demos: [
        { label: "i — DELETE Proyecto idProy=3 (nadie lo referencia)", origen: "TP6, Ej. 1.b.i", table: "proyecto", op: "DELETE", find: { idProy: 3 } },
        { label: "iii — DELETE Proyecto idProy=1 (R2 restrict)", origen: "TP6, Ej. 1.b.iii", table: "proyecto", op: "DELETE", find: { idProy: 1 } },
        { label: "v — UPDATE Trabaja_en idProy 1→3 (referenciante, solo chequeo)", origen: "TP6, Ej. 1.b.v", table: "trabaja_en", op: "UPDATE", find: { tipoE: "A", nroE: 1, idProy: 1 }, changes: { idProy: 3 } },
      ],
    },
    {
      id: "tp6-conflicto",
      label: "Proyecto / Trabaja_en / Auspicio",
      origen: "Práctica 2026-08-25 (TP6), Ejercicio 1.b.vi",
      note: "Dos FKs sobre la misma fila de Proyecto: R2 CASCADE y R3 RESTRICT. Basta la restrictiva para que se rechace.",
      tables: [
        { id: "proyecto", name: "Proyecto", pk: ["idProy"], columns: [col("idProy", "int", false), col("nombre", "text", true)], rows: [{ idProy: 1, nombre: "P1" }, { idProy: 2, nombre: "P2" }, { idProy: 3, nombre: "P3" }] },
        { id: "trabaja_en", name: "Trabaja_en", pk: ["tipoE", "nroE", "idProy"], columns: [col("tipoE", "text", false), col("nroE", "int", false), col("idProy", "int", false)], rows: [{ tipoE: "A", nroE: 1, idProy: 1 }, { tipoE: "A", nroE: 2, idProy: 2 }] },
        { id: "auspicio", name: "Auspicio", pk: ["idProy", "nombreAuspiciante"], columns: [col("idProy", "int", false), col("nombreAuspiciante", "text", false), col("tipoE", "text", true), col("nroE", "int", true)], rows: [{ idProy: 2, nombreAuspiciante: "Arcor", tipoE: "A", nroE: 2 }] },
      ],
      fks: [
        { id: "R2", fromTable: "trabaja_en", fromCols: ["idProy"], toTable: "proyecto", toCols: ["idProy"], onDelete: "RESTRICT", onUpdate: "CASCADE", match: "SIMPLE" },
        { id: "R3", fromTable: "auspicio", fromCols: ["idProy"], toTable: "proyecto", toCols: ["idProy"], onDelete: "RESTRICT", onUpdate: "RESTRICT", match: "SIMPLE" },
      ],
      demos: [
        { label: "vi — UPDATE Proyecto idProy 2→5 (R2 CASCADE vs R3 RESTRICT)", origen: "TP6, Ej. 1.b.vi", table: "proyecto", op: "UPDATE", find: { idProy: 2 }, changes: { idProy: 5 } },
      ],
    },
    {
      id: "tp6-matching",
      label: "Auspicio / Empleado / Trabaja_en",
      origen: "Práctica 2026-08-25 (TP6), Ejercicios 1.b.iv y 1.c",
      note: "R1 y R4 apuntan las dos a Empleado, con acciones distintas (CASCADE vs. SET NULL): el punto 1.b.iv completo, con sus DOS efectos. R4 es además compuesta y nullable: el escenario de matching del punto 1.c. En MySQL, MATCH siempre da la columna SIMPLE.",
      tables: [
        { id: "empleado", name: "Empleado", pk: ["tipoE", "nroE"], columns: [col("tipoE", "text", false), col("nroE", "int", false), col("nombre", "text", true)], rows: [{ tipoE: "A", nroE: 1, nombre: "E1" }, { tipoE: "B", nroE: 2, nombre: "E3" }, { tipoE: "A", nroE: 2, nombre: "E2" }] },
        { id: "trabaja_en", name: "Trabaja_en", pk: ["tipoE", "nroE", "idProy"], columns: [col("tipoE", "text", false), col("nroE", "int", false), col("idProy", "int", false)], rows: [{ tipoE: "A", nroE: 1, idProy: 1 }, { tipoE: "A", nroE: 2, idProy: 2 }] },
        { id: "auspicio", name: "Auspicio", pk: ["idProy", "nombreAuspiciante"], columns: [col("idProy", "int", false), col("nombreAuspiciante", "text", false), col("tipoE", "text", true), col("nroE", "int", true)], rows: [{ idProy: 2, nombreAuspiciante: "Arcor", tipoE: "A", nroE: 2 }] },
      ],
      fks: [
        { id: "R1", fromTable: "trabaja_en", fromCols: ["tipoE", "nroE"], toTable: "empleado", toCols: ["tipoE", "nroE"], onDelete: "CASCADE", onUpdate: "RESTRICT", match: "SIMPLE" },
        { id: "R4", fromTable: "auspicio", fromCols: ["tipoE", "nroE"], toTable: "empleado", toCols: ["tipoE", "nroE"], onDelete: "SET_NULL", onUpdate: "RESTRICT", match: "SIMPLE" },
      ],
      demos: [
        { label: "1.b.iv — DELETE Empleado (A,2): R1 CASCADE a Trabaja_en + R4 SET NULL a Auspicio (los dos reparan)", origen: "TP6, Ej. 1.b.iv", table: "empleado", op: "DELETE", find: { tipoE: "A", nroE: 2 } },
        { label: "1.c.i — INSERT Auspicio (1,'Dell','B',NULL)", origen: "TP6, Ej. 1.c.i", table: "auspicio", op: "INSERT", values: { idProy: 1, nombreAuspiciante: "Dell", tipoE: "B", nroE: null } },
        { label: "1.c.ii — INSERT Auspicio (2,'Oracle',NULL,NULL)", origen: "TP6, Ej. 1.c.ii", table: "auspicio", op: "INSERT", values: { idProy: 2, nombreAuspiciante: "Oracle", tipoE: null, nroE: null } },
        { label: "1.c.iii — INSERT Auspicio (3,'Google','A',3) — no existe", origen: "TP6, Ej. 1.c.iii", table: "auspicio", op: "INSERT", values: { idProy: 3, nombreAuspiciante: "Google", tipoE: "A", nroE: 3 } },
        { label: "1.c.iv — INSERT Auspicio (1,'HP',NULL,3)", origen: "TP6, Ej. 1.c.iv", table: "auspicio", op: "INSERT", values: { idProy: 1, nombreAuspiciante: "HP", tipoE: null, nroE: 3 } },
      ],
    },
    {
      id: "set-default",
      label: "Categoria / Producto (SET DEFAULT)",
      origen: "Elaboración propia — TP6 y el parcial no usan SET DEFAULT; ver 1.09.02 § Las trampas de SET NULL y SET DEFAULT",
      note: "Único preset con SET DEFAULT. (atención) El vault dice que InnoDB rechaza la definición de la tabla (1.09.02 § En MySQL y MySQL.md § 5.1), pero la corrida en MySQL 9.7.2 muestra otra cosa: CREATE TABLE Producto (… FOREIGN KEY … ON DELETE SET DEFAULT) se crea sin error ni advertencia (information_schema guarda DELETE_RULE = SET DEFAULT), y el DELETE FROM Categoria WHERE nombre='Electro' no falla hasta la ejecución, con ERROR 1451: InnoDB no aplica el reparo y se comporta como RESTRICT. Vale lo que hace el motor; las páginas del vault quedan por corregir.",
      tables: [
        { id: "categoria", name: "Categoria", pk: ["nombre"], columns: [col("nombre", "text", false)], rows: [{ nombre: "Electro" }, { nombre: "Sin categoria" }] },
        { id: "producto", name: "Producto", pk: ["idProd"], columns: [col("idProd", "int", false), col("categoria", "text", true, true, "Sin categoria")], rows: [{ idProd: 1, categoria: "Electro" }] },
      ],
      fks: [
        { id: "FK_cat", fromTable: "producto", fromCols: ["categoria"], toTable: "categoria", toCols: ["nombre"], onDelete: "SET_DEFAULT", onUpdate: "CASCADE", match: "SIMPLE" },
      ],
      demos: [
        { label: "DELETE Categoria 'Electro' (dispara SET DEFAULT)", origen: "Elaboración propia", table: "categoria", op: "DELETE", find: { nombre: "Electro" } },
      ],
    },
    {
      id: "no-action-vs-restrict",
      label: "P / C2 / C1 (NO ACTION vs RESTRICT)",
      origen: "Elaboración propia — ilustra Clase 09, slides 9-10 y 38",
      note: "Escenario de ESTÁNDAR SQL: C1 referencia a P directamente (acción configurable) y también a C2, que a su vez referencia a P en CASCADE. Solo así se ve la diferencia entre RESTRICT (rechaza antes de la cascada) y NO ACTION (la cascada de C2 borra la fila de C1 antes del chequeo final).",
      standardNote: "Pensado para ver la diferencia RESTRICT / NO ACTION en modo Estándar. En MySQL, ver la nota (atención).",
      mysqlWarning: "Verificado en MySQL 9.7.2 (cuatro corridas): en esta topología (rutas de FK solapadas), lo que decide el resultado es el ORDEN en que se crearon las FKs que referencian a P, no si fk_c1_p es RESTRICT o NO ACTION (los dos dan igual). En este escenario fk_c2_p (CASCADE) se crea antes que fk_c1_p: InnoDB deja pasar el DELETE con las dos acciones, porque la cascada de fk_c2_p ya borró la fila de C1 cuando le toca el turno a fk_c1_p. Con el orden inverso (escenario \"fk_c1_p creada primero\"), InnoDB lo rechaza con ambas (ERROR 1451, CONSTRAINT fk_c1_p). El simulador, en modo MySQL, recorre las FKs en el orden en que aparecen listadas (el de creación). No generalice \"InnoDB deja pasar\" a partir de un solo orden; para comparar RESTRICT y NO ACTION, use la semántica Estándar SQL.",
      tables: [
        { id: "p", name: "P", pk: ["id"], columns: [col("id", "int", false)], rows: [{ id: 1 }, { id: 2 }] },
        { id: "c2", name: "C2", pk: ["id"], columns: [col("id", "int", false), col("pid", "int", true)], rows: [{ id: 10, pid: 1 }] },
        { id: "c1", name: "C1", pk: ["id"], columns: [col("id", "int", false), col("pid2", "int", true), col("cid", "int", true)], rows: [{ id: 100, pid2: 1, cid: 10 }] },
      ],
      fks: [
        { id: "fk_c2_p", fromTable: "c2", fromCols: ["pid"], toTable: "p", toCols: ["id"], onDelete: "CASCADE", onUpdate: "CASCADE", match: "SIMPLE" },
        { id: "fk_c1_p", fromTable: "c1", fromCols: ["pid2"], toTable: "p", toCols: ["id"], onDelete: "NO_ACTION", onUpdate: "NO_ACTION", match: "SIMPLE" },
        { id: "fk_c1_c2", fromTable: "c1", fromCols: ["cid"], toTable: "c2", toCols: ["id"], onDelete: "CASCADE", onUpdate: "CASCADE", match: "SIMPLE" },
      ],
      demos: [
        { label: "DELETE P id=1 (con fk_c1_p en NO ACTION → pasa, en Estándar y en MySQL con este orden)", origen: "Elaboración propia", table: "p", op: "DELETE", find: { id: 1 } },
      ],
    },
  ];

  // Variante con el orden de creación inverso (fk_c1_p antes que fk_c2_p): en
  // MySQL 9.7.2 el mismo DELETE da ERROR 1451 (verificado); en Estándar no cambia.
  (function () {
    var base = PRESETS[PRESETS.length - 1];
    PRESETS.push({
      id: "no-action-vs-restrict-c1-primero",
      label: "P / C2 / C1 — fk_c1_p creada primero",
      origen: base.origen,
      note: base.note,
      standardNote: base.standardNote,
      mysqlWarning: base.mysqlWarning,
      tables: base.tables,
      fks: [base.fks[1], base.fks[0], base.fks[2]],
      demos: [
        { label: "DELETE P id=1 (en MySQL, con este orden → ERROR 1451 por fk_c1_p)", origen: "Elaboración propia", table: "p", op: "DELETE", find: { id: 1 } },
      ],
    });
  })();

  function findPreset(id) {
    for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].id === id) return PRESETS[i];
    return PRESETS[0];
  }
  ENGINE.PRESETS = PRESETS;
  ENGINE.findPreset = findPreset;

  // ==================================================================
  // Interfaz
  // ==================================================================

  var ACTION_OPTIONS = ACTIONS.map(function (a) { return { value: a, label: ACTION_LABELS[a] }; });
  var MATCH_OPTIONS = MATCH_MODES.map(function (m) { return { value: m, label: m }; });
  var SEMANTICS_OPTIONS = [{ value: "standard", label: "Estándar SQL" }, { value: "mysql", label: "MySQL (InnoDB)" }];

  function fmtCell(v) { return v === null || v === undefined ? null : v; }

  function tableRowsForDisplay(table, highlight) {
    return table.rows.map(function (r) {
      var row = {};
      table.columns.forEach(function (c) { row[c.name] = fmtCell(r[c.name]); });
      row.__id = r.__id;
      return row;
    });
  }

  function tableColumnsForDisplay(table) {
    return table.columns.map(function (c) { return { key: c.name, label: c.name, mono: c.type === "int", align: c.type === "int" ? "right" : "left" }; });
  }

  /**
   * columnas/filas del estado final CON una columna de texto que marca las
   * filas afectadas — nunca solo color/negrita (regla 7 del brief).
   */
  function tableColumnsForDisplayMarked(table) {
    return tableColumnsForDisplay(table).concat([{ key: "__estado", label: "Estado" }]);
  }
  function tableRowsForDisplayMarked(table, hi) {
    return table.rows.map(function (r) {
      var row = {};
      table.columns.forEach(function (c) { row[c.name] = fmtCell(r[c.name]); });
      row.__id = r.__id;
      row.__estado = hi[r.__id] ? "(afectada)" : "";
      return row;
    });
  }

  lab.tool(
    {
      id: "acciones-referenciales",
      title: "Integridad referencial: acciones y MATCH",
      subtitle: "Elija ON DELETE / ON UPDATE y MATCH sobre FKs reales del vault y observe qué filas cascadean, se anulan o rechazan la operación.",
      sources: [
        { stem: "1.09.01 - Restricciones de integridad", label: "Restricciones de integridad" },
        { stem: "1.09.02 - Integridad referencial y acciones referenciales", label: "Integridad referencial" },
        { stem: "Clase 09 - Restricciones integridad-Parte 1", label: "Clase 09" },
        { stem: "Práctica 2026-08-25", label: "TP6" },
        { stem: "Parcial 2Q2025", label: "Parcial 2Q2025" },
        { stem: "MySQL", label: "MySQL" },
      ],
      figure: { id: "lab-acciones-referenciales", caption: "Acciones referenciales (RESTRICT/CASCADE/SET NULL/SET DEFAULT) y MATCH sobre un esquema con FKs.", height: 420 },
    },
    function mount(body, ctx) {
      var h = lab.h;
      var isFigure = ctx && ctx.mode === "figure";

      var state = {
        presetId: PRESETS[0].id,
        semantics: "standard",
        schema: instantiateSchema(PRESETS[0]),
        builder: { table: PRESETS[0].tables[0].id, op: "DELETE", rowId: null },
        lastResult: null,
        lastStmt: null,
      };

      function currentPreset() { return findPreset(state.presetId); }
      function currentTableDef(tableId) { return findTable(state.schema, tableId); }
      function fkName(fk) {
        var from = findTable(state.schema, fk.fromTable), to = findTable(state.schema, fk.toTable);
        return fk.id + " (" + (from ? from.name : fk.fromTable) + " → " + (to ? to.name : fk.toTable) + ")";
      }
      function rowSummary(table, row) {
        return table.columns.map(function (c) { return c.name + "=" + (row[c.name] === null || row[c.name] === undefined ? "NULL" : row[c.name]); }).join(", ");
      }
      function findRowByValues(table, vals) {
        return table.rows.filter(function (r) { return Object.keys(vals).every(function (k) { return r[k] === vals[k]; }); })[0] || null;
      }

      // ---------------- Zona: escenario y semántica ----------------

      var schemaZone = h("div", {});
      var builderZone = h("div", {});
      var resultZone = h("div", { "aria-live": "polite" });
      var stepperHost = h("div", {});
      var stepperCtrl = null;
      var retosZone = h("div", { class: "lab-ar-retos" });
      var mysqlWarnZone = h("div", {});

      function presetIndex(id) {
        for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].id === id) return i;
        return -1;
      }

      // presetPicker() arma su <select> con valores por ÍNDICE ("0","1",…) y
      // llama a onPick() con el preset ORIGINAL de la lista que se le pasa
      // (ver lib.js § presetPicker): por eso acá se le pasa PRESETS tal cual.
      var presetCtrl = lab.presetPicker({
        label: "Escenario",
        presets: PRESETS,
        onPick: function (p) { loadPreset(p.id); },
      });

      var semanticsCtrl = lab.segmented({
        label: "Semántica",
        options: SEMANTICS_OPTIONS,
        value: state.semantics,
        onChange: function (v) { state.semantics = v; renderAll(); },
      });

      function loadPreset(id) {
        state.presetId = id;
        state.schema = instantiateSchema(findPreset(id));
        state.builder = { table: findPreset(id).tables[0].id, op: "DELETE", rowId: null };
        state.lastResult = null;
        state.lastStmt = null;
        presetCtrl.set(String(presetIndex(id)));
        renderAll();
      }

      // ---------------- Zona: esquema (FKs configurables + tablas) ----------------

      function renderSchemaZone() {
        schemaZone.replaceChildren();
        var preset = currentPreset();

        // En la figura, los avisos largos del escenario van plegados (<details>): el
        // título se ve siempre y el texto completo se abre a pedido.
        function avisoPlegado(marca, titulo, texto) {
          return h("details", { class: "lab-ar-fig-aviso" }, h("summary", {}, marca + " " + titulo), h("p", {}, texto));
        }
        if (state.semantics === "mysql" && preset.mysqlWarning) {
          mysqlWarnZone.replaceChildren(isFigure
            ? avisoPlegado("(atención)", "Diferencia real con MySQL/InnoDB en este escenario", preset.mysqlWarning)
            : lab.callout("warn", "Diferencia real con MySQL/InnoDB en este escenario", h("p", {}, preset.mysqlWarning)));
        } else if (state.semantics === "standard" && preset.standardNote) {
          mysqlWarnZone.replaceChildren(isFigure
            ? avisoPlegado("(nota)", "Escenario de estándar SQL", preset.standardNote)
            : lab.callout("info", "Escenario de estándar SQL", h("p", {}, preset.standardNote)));
        } else {
          mysqlWarnZone.replaceChildren();
        }

        // En la figura, las acciones van en un <select> (cinco botones por acción
        // ocupan cuatro filas por FK); en la vista, como segmentado.
        var actionCtrl = isFigure ? lab.select : lab.segmented;
        var fkPanels = state.schema.fks.map(function (fk) {
          var onDeleteCtrl = actionCtrl({
            label: "ON DELETE (" + fk.id + ")", options: ACTION_OPTIONS, value: fk.onDelete,
            onChange: function (v) { fk.onDelete = v; renderAll(); },
          });
          var onUpdateCtrl = actionCtrl({
            label: "ON UPDATE (" + fk.id + ")", options: ACTION_OPTIONS, value: fk.onUpdate,
            onChange: function (v) { fk.onUpdate = v; renderAll(); },
          });
          var compound = fk.fromCols.length > 1;
          var nullable = fk.fromCols.some(function (c) {
            var t = findTable(state.schema, fk.fromTable);
            return findColumn(t, c).nullable;
          });
          var matchCtrl = null;
          var matchNode;
          if (compound && nullable) {
            matchCtrl = lab.select({ label: "MATCH (" + fk.id + ")", options: MATCH_OPTIONS, value: fk.match, onChange: function (v) { fk.match = v; renderAll(); } });
            matchNode = matchCtrl.el;
          } else {
            matchNode = h("p", { class: "lab-ar-match-na" }, "MATCH: no aplica (FK simple o sin columnas nullable).");
          }
          var fromT = findTable(state.schema, fk.fromTable), toT = findTable(state.schema, fk.toTable);
          if (isFigure) {
            // Figura: una fila por FK (nombre y definición arriba, las acciones y el MATCH en una línea).
            return h("div", { class: "lab-ar-fig-fk" },
              h("p", { class: "lab-ar-fig-fk-def" }, h("strong", {}, fkName(fk)), " ",
                h("code", {}, fromT.name + "(" + fk.fromCols.join(", ") + ") → " + toT.name + "(" + fk.toCols.join(", ") + ")")),
              h("div", { class: "lab-ar-fig-fk-ctrls" }, onDeleteCtrl.el, onUpdateCtrl.el, matchCtrl ? matchCtrl.el : null));
          }
          return lab.panel(
            fkName(fk),
            h("p", { class: "lab-ar-fk-def" }, h("code", {}, fromT.name + "(" + fk.fromCols.join(", ") + ") → " + toT.name + "(" + fk.toCols.join(", ") + ")")),
            isFigure ? lab.grid(2, onDeleteCtrl.el, onUpdateCtrl.el) : [onDeleteCtrl.el, onUpdateCtrl.el], matchNode,
          );
        });

        var tablePanels = state.schema.tables.map(function (t) {
          return lab.panel(
            t.name + " (PK: " + t.pk.join(", ") + ")",
            lab.table({ columns: tableColumnsForDisplay(t), rows: tableRowsForDisplay(t) }),
          );
        });

        schemaZone.appendChild(isFigure && preset.note && preset.note.length > 160
          ? h("details", { class: "lab-ar-fig-aviso" }, h("summary", {}, "(nota) Sobre este escenario"), h("p", {}, preset.note))
          : h("p", { class: "lab-ar-preset-note" }, preset.note));
        schemaZone.appendChild(isFigure ? h("div", { class: "lab-ar-fig-fks" }, fkPanels) : lab.grid(fkPanels.length > 1 ? 2 : 1, fkPanels));
        // En la figura las tablas se dibujan una sola vez, en "Resultado" (antes y
        // después de ejecutar), para no repetirlas.
        if (!isFigure) schemaZone.appendChild(lab.grid(tablePanels.length > 2 ? 3 : tablePanels.length, tablePanels));
      }

      // ---------------- Zona: constructor de sentencias ----------------

      function renderBuilderZone() {
        builderZone.replaceChildren();
        var preset = currentPreset();
        var tableOptions = preset.tables.map(function (t) { return { value: t.id, label: t.name }; });
        var opOptions = [{ value: "DELETE", label: "DELETE" }, { value: "UPDATE", label: "UPDATE" }, { value: "INSERT", label: "INSERT" }];

        var tableCtrl = lab.segmented({
          label: "Tabla", options: tableOptions, value: state.builder.table,
          onChange: function (v) { state.builder.table = v; state.builder.rowId = null; renderBuilderZone(); },
        });
        var opCtrl = lab.segmented({
          label: "Operación", options: opOptions, value: state.builder.op,
          onChange: function (v) { state.builder.op = v; state.builder.rowId = null; renderBuilderZone(); },
        });

        var table = currentTableDef(state.builder.table);
        var formHost = h("div", { class: "lab-ar-form" });
        var rowCtrl = null;

        if (state.builder.op !== "INSERT") {
          var rowOptions = table.rows.map(function (r) { return { value: r.__id, label: rowSummary(table, r) }; });
          if (!state.builder.rowId && rowOptions.length) state.builder.rowId = rowOptions[0].value;
          rowCtrl = lab.select({
            label: "Fila", options: rowOptions, value: state.builder.rowId,
            onChange: function (v) { state.builder.rowId = v; renderBuilderZone(); },
          });
          formHost.appendChild(rowCtrl.el);
        }

        var fieldCtrls = {}; // colName -> { value: control, nul: control|null, hasDefault, defaultValue }
        var currentRow = state.builder.op === "UPDATE" && state.builder.rowId
          ? table.rows.filter(function (r) { return r.__id === state.builder.rowId; })[0]
          : null;

        if (state.builder.op === "INSERT" || state.builder.op === "UPDATE") {
          var fieldsGrid = [];
          table.columns.forEach(function (c) {
            var initial = currentRow ? currentRow[c.name] : "";
            var label = c.name + (c.nullable ? "" : " (obligatorio)") + (c.hasDefault ? " (DEFAULT " + c["default"] + " si se deja vacío)" : "");
            var textCtrl = lab.text({ label: label, value: initial === null || initial === undefined ? "" : String(initial), mono: c.type === "int" });
            var nulCtrl = c.nullable ? lab.toggle({ label: "NULL", checked: currentRow ? currentRow[c.name] === null : false }) : null;
            fieldCtrls[c.name] = { value: textCtrl, nul: nulCtrl, type: c.type, hasDefault: c.hasDefault, defaultValue: c["default"] };
            fieldsGrid.push(h("div", { class: "lab-ar-field" }, textCtrl.el, nulCtrl ? nulCtrl.el : null));
          });
          formHost.appendChild(lab.grid(2, fieldsGrid));
        }

        var errorNode = h("p", { class: "lab-ar-error" });

        /**
         * Lee los campos del formulario. En INSERT, un campo vacío (sin tildar
         * NULL) en una columna con DEFAULT queda OMITIDO del objeto devuelto
         * (no se le asigna `null`): así el motor aplica el DEFAULT, como
         * omitir la columna en un INSERT real (verificado: MySQL 9.7.2). El
         * toggle NULL sigue forzando un NULL explícito, con o sin DEFAULT.
         */
        function readFieldValues(forInsert) {
          var out = {};
          Object.keys(fieldCtrls).forEach(function (name) {
            var fc = fieldCtrls[name];
            if (fc.nul && fc.nul.get()) { out[name] = null; return; }
            var raw = fc.value.get();
            if (raw === "") {
              if (forInsert && fc.hasDefault) return; // omitida: toma el DEFAULT en el motor
              out[name] = null;
              return;
            }
            out[name] = fc.type === "int" ? parseInt(raw, 10) : raw;
          });
          return out;
        }

        var runBtn = lab.button({
          label: state.builder.op === "DELETE" ? "Ejecutar DELETE" : state.builder.op === "UPDATE" ? "Ejecutar UPDATE" : "Ejecutar INSERT",
          kind: "primary",
          onClick: function () {
            errorNode.textContent = "";
            var stmt;
            if (state.builder.op === "DELETE") {
              if (!state.builder.rowId) { errorNode.textContent = "Elija una fila."; return; }
              var r = table.rows.filter(function (rr) { return rr.__id === state.builder.rowId; })[0];
              stmt = { type: "DELETE", table: table.id, rowId: state.builder.rowId, label: "DELETE FROM " + table.name + " WHERE " + rowSummary(table, r) };
            } else if (state.builder.op === "UPDATE") {
              if (!state.builder.rowId) { errorNode.textContent = "Elija una fila."; return; }
              var vals = readFieldValues(false);
              var badReq = table.columns.filter(function (c) { return !c.nullable && (vals[c.name] === null || (c.type === "int" && isNaN(vals[c.name]))); })[0];
              if (badReq) { errorNode.textContent = "La columna " + badReq.name + " es obligatoria y necesita un valor numérico/válido."; return; }
              var curRow = table.rows.filter(function (rr) { return rr.__id === state.builder.rowId; })[0];
              var changed = {}; // solo las columnas que de verdad cambiaron: no re-chequea FKs intactas
              table.columns.forEach(function (c) { if (vals[c.name] !== curRow[c.name]) changed[c.name] = vals[c.name]; });
              stmt = { type: "UPDATE", table: table.id, rowId: state.builder.rowId, changes: changed, label: "UPDATE " + table.name + " SET … WHERE __id=" + state.builder.rowId };
            } else {
              var vals2 = readFieldValues(true);
              var badReq2 = table.columns.filter(function (c) {
                if (c.hasDefault && vals2[c.name] === undefined) return false; // omitida a propósito: toma el DEFAULT
                return !c.nullable && (vals2[c.name] === null || (c.type === "int" && isNaN(vals2[c.name])));
              })[0];
              if (badReq2) { errorNode.textContent = "La columna " + badReq2.name + " es obligatoria y necesita un valor numérico/válido."; return; }
              stmt = { type: "INSERT", table: table.id, values: vals2, label: "INSERT INTO " + table.name + " VALUES (…)" };
            }
            execute(stmt);
          },
        });

        formHost.appendChild(errorNode);
        var restablecerBtn = lab.button({
          label: "Restablecer instancia", kind: "ghost",
          onClick: function () {
            restablecerInstancia();
            state.builder.rowId = null;
            state.lastResult = null;
            state.lastStmt = null;
            renderAll();
          },
        });
        if (isFigure) {
          formHost.appendChild(h("div", { class: "lab-ar-fig-btns" }, runBtn.el, restablecerBtn.el));
        } else {
          formHost.appendChild(runBtn.el);
          formHost.appendChild(restablecerBtn.el);
          formHost.appendChild(h("p", { class: "lab-ar-demo-nota" }, "Las operaciones que arme aquí se acumulan sobre el estado actual; \"Restablecer instancia\" vuelve a las filas originales del escenario sin tocar las acciones de las FKs."));
        }

        builderZone.appendChild(lab.grid(2, tableCtrl.el, opCtrl.el));
        builderZone.appendChild(formHost);

        if (preset.demos && preset.demos.length && !isFigure) {
          var demoBtns = preset.demos.map(function (d) {
            return h("div", { class: "lab-ar-demo" },
              lab.button({
                label: d.label, kind: "ghost",
                onClick: function () {
                  // Cada caso del vault es INDIVIDUAL (TP6 ej. 1.b y Clase 09 slide 11:
                  // "resultados individuales, no acumulativos"): parte de la instancia
                  // original del escenario, conservando las acciones y el MATCH que el
                  // estudiante haya configurado en las FKs.
                  restablecerInstancia();
                  var t = currentTableDef(d.table);
                  var stmt2;
                  if (d.op === "INSERT") {
                    stmt2 = { type: "INSERT", table: t.id, values: d.values, label: "INSERT INTO " + t.name + " (" + d.label + ")" };
                  } else {
                    var r2 = findRowByValues(t, d.find);
                    if (!r2) return;
                    stmt2 = { type: d.op, table: t.id, rowId: r2.__id, changes: d.changes, label: d.label };
                  }
                  state.builder.table = t.id;
                  state.builder.op = d.op;
                  state.builder.rowId = stmt2.rowId || null;
                  execute(stmt2);
                  renderBuilderZone();
                },
              }).el,
              h("span", { class: "lab-ar-demo-origen" }, d.origen),
            );
          });
          builderZone.appendChild(lab.panel("Casos del vault (probar y modificar)",
            h("p", { class: "lab-ar-demo-nota" }, "Resultados individuales, no acumulativos: cada caso parte de la instancia original del escenario (con las acciones que usted haya configurado en las FKs)."),
            h("div", { class: "lab-ar-demo-list" }, demoBtns)));
        }
      }

      // ---------------- Ejecutar y explicar ----------------

      /**
       * Por qué falló el matching de `step.vals` contra la tabla referenciada
       * bajo `step.match` (regla del slide 13/14: FULL prohíbe mezclar NULL con
       * no NULL; PARTIAL exige que los valores no nulos coincidan en alguna
       * fila; si no hay ningún NULL, el motivo siempre es "no existe").
       */
      function matchFailReason(vals, match) {
        var nulls = 0;
        for (var i = 0; i < vals.length; i++) if (vals[i] === null || vals[i] === undefined) nulls++;
        if (nulls === 0) return "no-existe";
        if (match === "FULL") return "mezcla-null";
        if (match === "PARTIAL") return "parcial-no-existe";
        return "no-existe";
      }

      function stepText(step) {
        var fk = step.fk ? findFk(state.schema, step.fk) : null;
        var fkLabel = fk ? fkName(fk) : step.fk;
        var t = step.table ? findTable(state.schema, step.table) : null;
        switch (step.kind) {
          case "start": return "Se ejecuta: " + step.label;
          case "no-references": return "Nadie referencia esta fila todavía: la operación no dispara ninguna acción referencial.";
          case "mysql-turn-clear": return "Turno de " + fkLabel + " (" + ACTION_LABELS[step.action] + "), en el orden de creación de las FKs: una acción anterior ya quitó las filas que referenciaban esta clave, así que no hay nada que chequear. Pasa.";
          case "restrict-clear": return fkLabel + " es " + ACTION_LABELS[step.action] + ": hay filas referenciantes, pero esta acción no rechaza de inmediato; se evalúa más adelante.";
          case "restrict-block":
            var extra = step.action === "SET_DEFAULT" ? " (InnoDB no implementa el reparo de SET DEFAULT en tiempo de ejecución: se comporta como RESTRICT)" : "";
            return "Rechazada: " + fkLabel + " es " + ACTION_LABELS[step.action] + extra + " y hay " + step.rows.length + " fila(s) en " + (t ? t.name : step.table) + " que referencian esta clave.";
          case "cascade-delete": return "CASCADE de " + fkLabel + ": se borra la fila " + step.rowId + " de " + (t ? t.name : step.table) + ".";
          case "cascade-delete-done": return "Fila " + step.rowId + " de " + (t ? t.name : step.table) + " eliminada por cascada.";
          case "cascade-update": return "CASCADE de " + fkLabel + ": la fila " + step.rowId + " de " + (t ? t.name : step.table) + " actualiza su FK.";
          case "set-null": return "SET NULL de " + fkLabel + ": la fila " + step.rowId + " de " + (t ? t.name : step.table) + " pierde la referencia (FK → NULL).";
          case "set-null-fail":
            return step.semantics === "mysql"
              ? "Rechazada: SET NULL de " + fkLabel + " necesitaría anular la columna " + step.column + ", que no admite NULL. En InnoDB esto ni siquiera llega a ejecutarse: la definición de la FK ya es ilegal (verificado: ERROR 1830 al crear la tabla, \"cannot be NOT NULL: needed in a foreign key constraint … SET NULL\")."
              : "Rechazada: SET NULL de " + fkLabel + " necesitaría anular la columna " + step.column + ", que no admite NULL.";
          case "set-default": return "SET DEFAULT de " + fkLabel + ": la fila " + step.rowId + " de " + (t ? t.name : step.table) + " toma el valor por defecto.";
          case "set-default-fail": return step.reason === "not-null"
            ? "Rechazada: SET DEFAULT de " + fkLabel + " no tiene un valor por defecto válido para " + step.column + " (NOT NULL)."
            : "Rechazada: el valor por defecto de " + fkLabel + " no existe en la tabla referenciada.";
          case "no-action-pass": return "NO ACTION de " + fkLabel + ", chequeo diferido: al final de la sentencia ya no queda ninguna fila referenciando esta clave. Pasa.";
          case "no-action-block": return "Rechazada: NO ACTION de " + fkLabel + ", chequeo diferido — todavía queda(n) " + step.rows.length + " fila(s) referenciando esta clave al final de la sentencia.";
          case "fk-check-pass": return "Chequeo de " + fkLabel + " (MATCH " + step.match + (step.match !== step.declaredMatch ? ", declarado " + step.declaredMatch + " pero MySQL lo ignora" : "") + "): satisfecho.";
          case "fk-check-fail":
            var failReason = matchFailReason(step.vals, step.match);
            var failText = failReason === "mezcla-null"
              ? "el valor mezcla columnas NULL y no NULL, y MATCH FULL exige que sean todas NULL o ninguna (regla \"todo o nada\")."
              : failReason === "parcial-no-existe"
              ? "el valor no nulo no aparece en ninguna fila de la tabla referenciada (MATCH PARTIAL ignora las columnas NULL, pero exige que las no nulas coincidan en alguna fila)."
              : "el valor no existe en la tabla referenciada.";
            return "Rechazada: " + fkLabel + " (MATCH " + step.match + "): " + failText;
          case "reject":
            if (step.reason === "not-null") return "Rechazada: la columna " + step.column + " no admite NULL.";
            if (step.reason === "pk-duplicate") return "Rechazada: choca con la clave primaria de otra fila (no es un problema de FK).";
            if (step.reason === "fk-violation") return "Rechazada por violación de FK.";
            return "Rechazada.";
          case "commit": return step.deleted ? "Operación aceptada. Fila eliminada." : "Operación aceptada.";
          case "depth-exceeded": return "Rechazada: la cascada supera la profundidad máxima de " + MAX_CASCADE_DEPTH_MYSQL + " niveles que permite InnoDB (ERROR 3008).";
          default: return step.kind;
        }
      }

      function stepKindClass(step) {
        if (step.kind === "commit") return "ok";
        if (step.kind === "reject" || step.kind === "restrict-block" || step.kind === "set-null-fail" || step.kind === "set-default-fail" || step.kind === "no-action-block" || step.kind === "fk-check-fail" || step.kind === "depth-exceeded") return "bad";
        if (step.kind === "cascade-delete" || step.kind === "cascade-delete-done" || step.kind === "cascade-update" || step.kind === "set-null" || step.kind === "set-default") return "warn";
        return "info";
      }

      function ruleExplanation(result) {
        if (!result) return null;
        if (result.ok) {
          var last = result.trace[result.trace.length - 1];
          return { kind: "ok", title: "Aceptada", body: "La sentencia se aplicó por completo (o no encontró filas que se lo impidieran).", link: lab.pageLink("1.09.02 - Integridad referencial y acciones referenciales", "Integridad referencial") };
        }
        var e = result.error || {};
        var map = {
          "restrict": { title: "Rechazada por acción restrictiva", body: e.semantics === "mysql"
            ? "En MySQL, RESTRICT, NO ACTION y SET DEFAULT rechazan si, cuando le toca el turno a esa FK, todavía queda alguna fila referenciante. InnoDB recorre las FKs en orden de creación: una cascada creada antes puede haber quitado esas filas."
            : "RESTRICT rechaza de inmediato si hay alguna fila referenciante, antes de cualquier reparación: no importa el orden de las FKs, basta una restrictiva.", link: lab.pageLink("1.09.02 - Integridad referencial y acciones referenciales", "Integridad referencial") },
          "no-action": { title: "Rechazada por NO ACTION (chequeo diferido)", body: "En el estándar, NO ACTION se evalúa al final de la sentencia; aquí seguía habiendo una fila referenciante después de las reparaciones.", link: lab.pageLink("1.09.02 - Integridad referencial y acciones referenciales", "Integridad referencial") },
          "set-null-not-nullable": {
            title: "Rechazada: SET NULL sobre columna NOT NULL",
            body: e.semantics === "mysql"
              ? "SET NULL solo funciona si la columna de la FK admite nulos. En InnoDB esta FK ni siquiera se puede crear (ERROR 1830, verificado): se rechaza la definición, no una operación puntual — responde la duda de la Clase 09 sobre si se rechaza la operación o la definición."
              : "SET NULL solo funciona si la columna de la FK admite nulos; si no, la reparación es ilegal y se rechaza como un RESTRICT.",
            link: lab.pageLink("1.09.02 - Integridad referencial y acciones referenciales", "Integridad referencial"),
          },
          "set-default-not-null": { title: "Rechazada: SET DEFAULT sin default válido", body: "Sin DEFAULT declarado, el valor por defecto es NULL; si la columna no admite NULL, la reparación falla.", link: lab.pageLink("1.09.02 - Integridad referencial y acciones referenciales", "Integridad referencial") },
          "set-default-fk-violation": { title: "Rechazada: el valor por defecto viola la FK", body: "El valor por defecto no existe en la tabla referenciada, así que SET DEFAULT dejaría una FK inválida.", link: lab.pageLink("1.09.02 - Integridad referencial y acciones referenciales", "Integridad referencial") },
          "fk-violation": {
            title: "Rechazada: violación de FK al escribir",
            body: (function () {
              var failStep = null;
              for (var i = result.trace.length - 1; i >= 0; i--) {
                if (result.trace[i].kind === "fk-check-fail") { failStep = result.trace[i]; break; }
              }
              if (!failStep) return "La fila referenciante no cumple la regla de matching contra la tabla referenciada.";
              var reason = matchFailReason(failStep.vals, failStep.match);
              if (reason === "mezcla-null") return "La fila referenciante no cumple MATCH FULL: mezcla columnas NULL y no NULL, y FULL exige que sean todas NULL o ninguna.";
              if (reason === "parcial-no-existe") return "La fila referenciante no cumple MATCH PARTIAL: el valor no nulo no aparece en ninguna fila de la tabla referenciada.";
              return "La fila referenciante no cumple la regla de matching: la combinación de valores no existe en la tabla referenciada.";
            })(),
            link: lab.pageLink("1.09.02 - Integridad referencial y acciones referenciales", "Integridad referencial"),
          },
          "not-null": { title: "Rechazada: NOT NULL", body: "La columna no admite NULL (restricción de no nulidad, no de FK).", link: lab.pageLink("1.09.01 - Restricciones de integridad", "Restricciones de integridad") },
          "pk-duplicate": { title: "Rechazada: clave primaria duplicada", body: "El motivo real no es la FK: la operación dejaría dos filas con la misma clave primaria — la misma trampa de la Pregunta 17 del Parcial 2Q2025.", link: lab.pageLink("1.03.02 - DDL — creación y alteración de tablas", "DDL") },
          "depth-exceeded": { title: "Rechazada: tope de profundidad de cascada", body: "InnoDB limita la cascada de FKs a 15 niveles (verificado: ERROR 3008 en bdii-verify-mysql 9.7.2).", link: lab.pageLink("MySQL", "MySQL") },
          "row-not-found": { title: "Fila no encontrada", body: "", link: null },
          "unknown-table": { title: "Tabla desconocida", body: "", link: null },
        };
        var m = map[e.reason] || { title: "Rechazada", body: "", link: null };
        return { kind: "bad", title: m.title, body: m.body, link: m.link };
      }

      function stepMiniTable(step) {
        if (!step.table || (!step.rowId && !step.rows)) return null;
        var t = findTable(step.snapshot, step.table);
        if (!t) return null;
        var ids = step.rows || (step.rowId ? [step.rowId] : []);
        var rows = t.rows.filter(function (r) { return ids.indexOf(r.__id) !== -1; });
        if (!rows.length) return null;
        return lab.table({ columns: tableColumnsForDisplay(t), rows: tableRowsForDisplay({ columns: t.columns, rows: rows }) });
      }

      function renderStepperStep(i, trace) {
        var step = trace[i];
        var mini = stepMiniTable(step);
        return h("div", {},
          lab.callout(stepKindClass(step), "Paso " + (i + 1) + " / " + trace.length, h("p", {}, stepText(step))),
          mini,
        );
      }

      /** Vuelve las filas a la instancia original del preset, conservando la configuración actual de las FKs. */
      function restablecerInstancia() {
        var fresh = instantiateSchema(currentPreset());
        fresh.fks = state.schema.fks.map(function (fk) { var o = {}; for (var k in fk) o[k] = fk[k]; return o; });
        state.schema = fresh;
      }

      function execute(stmt) {
        var result = runStatement(state.schema, state.semantics, stmt);
        state.lastStmt = stmt;
        state.lastResult = result;
        if (result.ok) state.schema = result.schema;
        renderAll();
      }

      function renderResultZone() {
        resultZone.replaceChildren();
        if (stepperCtrl) { stepperCtrl.destroy(); stepperCtrl = null; }
        stepperHost.replaceChildren();

        if (!state.lastResult) {
          if (isFigure) {
            // Figura: antes de ejecutar, la instancia actual (lo que la vista muestra en "Esquema y FKs").
            resultZone.appendChild(h("p", { class: "lab-ar-demo-nota" }, "Todavía no se ejecutó nada: esta es la instancia de partida."));
            resultZone.appendChild(lab.grid(state.schema.tables.length > 2 ? 3 : state.schema.tables.length, state.schema.tables.map(function (t) {
              return lab.table({ caption: t.name + " (PK: " + t.pk.join(", ") + ")", columns: tableColumnsForDisplay(t), rows: tableRowsForDisplay(t) });
            })));
            return;
          }
          resultZone.appendChild(lab.callout("info", "Sin operaciones todavía", h("p", {}, "Elija una fila y una operación, o pruebe uno de los casos del vault.")));
          return;
        }
        var result = state.lastResult;
        var expl = ruleExplanation(result);
        var affected = affectedRowIds(result.trace);

        resultZone.appendChild(
          lab.callout(expl.kind, expl.title, h("p", {}, expl.body), expl.link && !isFigure ? h("p", {}, "Ver: ", expl.link) : null),
        );

        var schemaAfter = result.ok ? result.schema : state.schema;
        var tablePanels = schemaAfter.tables.map(function (t) {
          var hi = affected[t.id] || {};
          if (isFigure) {
            return lab.table({
              caption: t.name + " — estado final",
              columns: tableColumnsForDisplayMarked(t),
              rows: tableRowsForDisplayMarked(t, hi),
              rowClass: function (row) { return hi[row.__id] ? "lab-ar-row-affected" : ""; },
            });
          }
          return lab.panel(
            t.name + " — estado final",
            lab.table({
              columns: tableColumnsForDisplayMarked(t),
              rows: tableRowsForDisplayMarked(t, hi),
              rowClass: function (row) { return hi[row.__id] ? "lab-ar-row-affected" : ""; },
            }),
          );
        });
        resultZone.appendChild(lab.grid(tablePanels.length > 2 ? 3 : tablePanels.length, tablePanels));

        if (!isFigure) {
          var trace = result.trace;
          stepperCtrl = lab.stepper({ count: trace.length, label: "Paso", render: function (i) { return renderStepperStep(i, trace); } });
          stepperHost.appendChild(lab.panel("Traza paso a paso (" + trace.length + " pasos)", stepperCtrl.el));
        }
      }

      // ---------------- Retos ----------------

      var RETOS = [
        {
          titulo: "Reto 1 — la trampa de la Pregunta 30",
          enunciado: "Con el preset \"Facultad / Carrera / Materia\", ejecute un DELETE sobre Carrera que se rechace por R2 (no por R1). Comprobar.",
          fuente: "Parcial 2Q2025, pregunta 30",
          check: function () {
            var ok = state.presetId === "parcial2q2025" && state.lastResult && !state.lastResult.ok &&
              state.lastStmt && state.lastStmt.type === "DELETE" && state.lastStmt.table === "carrera" &&
              state.lastResult.error && state.lastResult.error.reason === "restrict" && state.lastResult.error.fk === "R2";
            return { pass: !!ok, detail: ok ? "Correcto: R2 (RESTRICT) rechazó el DELETE porque una fila de Materia sigue referenciando esa Carrera." : "Todavía no: elija Carrera, DELETE, una fila que Materia referencia (por ejemplo idCarr=2, idFac=F2, que M3 referencia), y ejecute." };
          },
        },
        {
          titulo: "Reto 2 — dos reglas en conflicto",
          enunciado: "Con el preset \"Proyecto / Trabaja_en / Auspicio\", logre que una operación se rechace por dos FKs con acciones distintas en conflicto sobre la misma fila (R2 en CASCADE, R3 en RESTRICT, como el punto 1.b.vi del TP6). Comprobar.",
          fuente: "Práctica 2026-08-25 (TP6), ejercicio 1.b.vi",
          check: function () {
            var fk2 = findFk(state.schema, "R2"), fk3 = findFk(state.schema, "R3");
            var ok = state.presetId === "tp6-conflicto" && fk2 && fk3 && fk2.onUpdate === "CASCADE" && fk3.onUpdate === "RESTRICT" &&
              state.lastResult && !state.lastResult.ok && state.lastResult.error && state.lastResult.error.reason === "restrict" && state.lastResult.error.fk === "R3";
            return { pass: !!ok, detail: ok ? "Correcto: R3 (RESTRICT) rechaza antes de que la cascada de R2 llegue a aplicarse." : "Todavía no: deje R2 en CASCADE y R3 en RESTRICT (ON UPDATE), y ejecute el UPDATE de Proyecto idProy=2→5." };
          },
        },
        {
          titulo: "Reto 3 — un caso donde SIMPLE y FULL difieren",
          enunciado: "Con el preset \"Auspicio / Empleado / Trabaja_en\" en semántica Estándar SQL, inserte una fila en Auspicio donde el matching SIMPLE dé un resultado distinto de FULL (una FK con un solo NULL y el otro valor presente). Comprobar.",
          fuente: "Clase 09, slide 14 · TP6, ejercicio 1.c",
          check: function () {
            var s = state.lastStmt, r = state.lastResult;
            if (state.presetId !== "tp6-matching" || state.semantics !== "standard" || !s || s.type !== "INSERT" || s.table !== "auspicio" || !r) {
              return { pass: false, detail: "Todavía no: en semántica Estándar, inserte en Auspicio una fila con exactamente un NULL en (tipoE, nroE)." };
            }
            var vals = [s.values.tipoE, s.values.nroE];
            var nulls = vals.filter(function (v) { return v === null || v === undefined; }).length;
            if (nulls !== 1) return { pass: false, detail: "Todavía no: la fila necesita exactamente un NULL entre tipoE y nroE (no cero, no los dos)." };
            var empleado = findTable(state.schema, "empleado");
            var simple = matchSatisfied(vals, empleado.rows, ["tipoE", "nroE"], "SIMPLE");
            var full = matchSatisfied(vals, empleado.rows, ["tipoE", "nroE"], "FULL");
            var ok = simple !== full;
            return { pass: ok, detail: ok ? "Correcto: con " + JSON.stringify(vals) + ", SIMPLE da " + simple + " y FULL da " + full + " — es exactamente el caso que separa los dos matchings." : "Esta combinación da lo mismo en SIMPLE y FULL. Pruebe con un valor que sí exista en Empleado del lado no nulo (o que no exista), para que FULL rechace y SIMPLE no." };
          },
        },
      ];

      function renderRetos() {
        retosZone.replaceChildren();
        RETOS.forEach(function (reto) {
          var out = h("div", { "aria-live": "polite" });
          var btn = lab.button({
            label: "Comprobar", kind: "primary",
            onClick: function () {
              var res = reto.check();
              out.replaceChildren(lab.callout(res.pass ? "ok" : "bad", res.pass ? "Correcto" : "Todavía no", res.detail));
            },
          });
          retosZone.appendChild(lab.panel(reto.titulo, h("p", {}, reto.enunciado), h("p", { class: "lab-ar-reto-fuente" }, "Fuente: ", reto.fuente), btn.el, out));
        });
      }

      // ---------------- Montaje ----------------

      function renderAll() {
        renderSchemaZone();
        renderBuilderZone();
        renderResultZone();
      }

      body.appendChild(lab.grid(2, presetCtrl.el, semanticsCtrl.el));
      body.appendChild(mysqlWarnZone);
      body.appendChild(lab.panel("Esquema y FKs", schemaZone));
      body.appendChild(lab.panel("Ejecutar una sentencia", builderZone));
      body.appendChild(lab.panel("Resultado", resultZone));
      body.appendChild(stepperHost);
      if (!isFigure) {
        renderRetos();
        body.appendChild(lab.panel("Retos", retosZone));
        body.appendChild(h("p", { class: "lab-ar-links" },
          "Ver también: ", lab.pageLink("1.09.02 - Integridad referencial y acciones referenciales", "Integridad referencial"),
          " · ", lab.pageLink("Práctica 2026-08-25", "TP6 completo"),
          " · ", lab.pageLink("Parcial 2Q2025", "Parcial 2Q2025"),
        ));
      }

      presetCtrl.set(String(presetIndex(state.presetId)));
      renderAll();

      return function cleanup() {
        if (stepperCtrl) stepperCtrl.destroy();
      };
    },
  );
})();
