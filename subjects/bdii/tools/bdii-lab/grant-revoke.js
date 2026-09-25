/* ============================================================
   bdii-lab / grant-revoke.js — "GRANT, REVOKE y el grafo de privilegios"

   Motor puro: App.bdiiLab.engines["grant-revoke"]
     - Modelo del estándar (GMUW 10.1.2–10.1.6): un nodo por (usuario,
       privilegio, columnas, tabla, marca). Con y sin opción de concesión
       son NODOS DISTINTOS (1.11.02 § 6, regla 3): "U·P" y "U·P*"; "**" =
       owner. Una arista va del nodo del otorgante (siempre con "*" o "**")
       al del receptor ("*" si fue WITH GRANT OPTION). REVOKE ... CASCADE
       borra las aristas del que revoca hacia los dos nodos del revocado y
       después todo nodo sin camino a un nodo owner; RESTRICT rechaza la
       sentencia si eso pasaría. REVOKE GRANT OPTION FOR cambia la arista
       hacia "V·P*" por una hacia "V·P" (GMUW 10.1.6, regla 6).
     - Revocar una columna a quien tiene el privilegio de tabla (TP8 ej.
       1.b) es un punto abierto del vault: config.columnRevoke elige la
       lectura ("atomica" = no hay nada que revocar; "descomponer" = el
       privilegio de tabla se parte y se retira la columna, en cascada).
     - Modelo de MySQL 9.7: por (tabla, usuario) hay un conjunto de
       privilegios y UNA marca "Grant" compartida por todos ellos (no por
       privilegio); MySQL no registra quién otorgó qué, así que REVOKE
       nunca propaga y CASCADE/RESTRICT son error de sintaxis.

   Fuentes del vault (ver sources del tool() más abajo): 1.11.01, 1.11.02,
   Clase 11 § Material complementario del 07/09, Práctica 2026-09-08 (TP8)
   ejercicios 1 y 3, GMUW cap. 10.1, MySQL.md.
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

  var PRIVS = ["SELECT", "INSERT", "UPDATE", "DELETE"];

  /** "a, b ,c" → ["a","b","c"] ordenado; "" / null → null (toda la tabla). */
  function parseCols(text) {
    if (!text) return null;
    var arr = String(text)
      .split(",")
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    if (!arr.length) return null;
    arr.sort();
    return arr;
  }

  /*
   * Columnas de un nodo: null = toda la tabla; array = esas columnas;
   * { except: [...] } = toda la tabla salvo esas (solo aparece al
   * descomponer un privilegio de tabla, lectura "descomponer").
   */
  function isExcept(cols) { return !!(cols && !Array.isArray(cols) && cols.except); }

  function colsLabel(cols) {
    if (!cols) return "";
    if (isExcept(cols)) return "(todas salvo " + cols.except.join(", ") + ")";
    return "(" + cols.join(", ") + ")";
  }

  function colsKey(cols) {
    if (!cols) return "";
    if (isExcept(cols)) return "(todas salvo " + cols.except.join(",") + ")";
    return "(" + cols.join(",") + ")";
  }

  /** ¿El nodo con columnas `have` cubre lo pedido en `want` (null = toda la tabla)? */
  function colsCover(have, want) {
    if (want === null || want === undefined) return have === null || have === undefined;
    if (have === null || have === undefined) return true;
    var i;
    if (isExcept(have)) {
      for (i = 0; i < want.length; i++) if (have.except.indexOf(want[i]) !== -1) return false;
      return true;
    }
    for (i = 0; i < want.length; i++) if (have.indexOf(want[i]) === -1) return false;
    return true;
  }

  function sameCols(a, b) { return colsKey(a) === colsKey(b); }

  /** Columnas de `cols` menos las de `remove` (lista); null si no queda ninguna. */
  function minusCols(cols, remove) {
    if (!cols) return { except: remove.slice().sort() };
    if (isExcept(cols)) {
      var ex = cols.except.slice();
      remove.forEach(function (c) { if (ex.indexOf(c) === -1) ex.push(c); });
      ex.sort();
      return { except: ex };
    }
    var rest = cols.filter(function (c) { return remove.indexOf(c) === -1; });
    return rest.length ? rest : null;
  }

  /** Marca del nodo: "" sin opción, "*" con opción de concesión, "**" owner. */
  function nodeKey(user, priv, cols, table, star) {
    return user + "·" + priv + colsKey(cols) + (star || "") + "@" + table;
  }

  // ---------- modelo del estándar (GMUW 10.1) ----------

  function runStandard(config, statements) {
    var owner = config.owner;
    var decompose = config.columnRevoke === "descomponer";
    var nodes = {}; // id -> {id,user,priv,cols,table,star,owner,grantOption}
    var edges = []; // {from,to,stmtIndex,revoked}
    var log = [];

    function ensureNode(user, priv, cols, table, star) {
      var id = nodeKey(user, priv, cols, table, star);
      if (!nodes[id]) {
        nodes[id] = {
          id: id, user: user, priv: priv, cols: cols, table: table, star: star || "",
          owner: star === "**", grantOption: star === "*" || star === "**",
        };
      }
      return nodes[id];
    }

    function addEdge(fromId, toId, idx) {
      var exists = edges.some(function (e) { return !e.revoked && e.from === fromId && e.to === toId; });
      if (!exists) edges.push({ from: fromId, to: toId, stmtIndex: idx, revoked: false });
    }

    function reach() {
      var r = {};
      Object.keys(nodes).forEach(function (id) { if (nodes[id].owner) r[id] = true; });
      var changed = true;
      while (changed) {
        changed = false;
        edges.forEach(function (e) {
          if (e.revoked) return;
          if (r[e.from] && nodes[e.from].grantOption && !r[e.to]) { r[e.to] = true; changed = true; }
        });
      }
      return r;
    }

    function lostBetween(before, after) {
      return Object.keys(before).filter(function (id) { return before[id] && !after[id]; });
    }

    function snapshot() {
      return { edges: edges.map(function (e) { return Object.assign({}, e); }), ids: Object.keys(nodes) };
    }
    function restore(s) {
      edges = s.edges;
      Object.keys(nodes).forEach(function (id) { if (s.ids.indexOf(id) === -1) delete nodes[id]; });
    }

    /** Nodo del actor desde el que puede otorgar: con "*" o "**", alcanzable, que cubra las columnas. */
    function findGrantingNode(actor, priv, cols, table, r) {
      if (actor === owner) return { ok: true, id: null };
      var hasAny = false;
      var ids = Object.keys(nodes);
      for (var i = 0; i < ids.length; i++) {
        var n = nodes[ids[i]];
        if (n.user !== actor || n.priv !== priv || n.table !== table) continue;
        if (!r[ids[i]]) continue;
        if (!colsCover(n.cols, cols)) continue;
        hasAny = true;
        if (n.grantOption) return { ok: true, id: ids[i] };
      }
      return { ok: false, hasPrivWithoutOption: hasAny };
    }

    /** Aristas activas del actor hacia nodos del revocado (priv, tabla) que cumplen `pred(nodo)`. */
    function actorEdgesTo(actor, target, priv, table, pred) {
      return edges.filter(function (e) {
        if (e.revoked) return false;
        var f = nodes[e.from], t = nodes[e.to];
        return f.user === actor && t.user === target && t.priv === priv && t.table === table && pred(t);
      });
    }

    /**
     * Lectura "descomponer" (Práctica 2026-09-08 § 1.b): la arista del actor
     * hacia V·P(C) se reemplaza por una hacia V·P(C − R); todo nodo que quede
     * sin camino al dueño se reemplaza, a su vez, por su versión sin R, colgado
     * del reemplazo de su otorgante. Devuelve [{from, to}] de los reemplazos.
     */
    function decomposeRevoke(initialEdges, R, idx) {
      var replacement = {}; // id viejo -> id nuevo (o null si no queda nada)
      var steps = [];
      var before = reach();
      initialEdges.forEach(function (e) {
        e.revoked = true;
        var n = nodes[e.to];
        var rest = minusCols(n.cols, R);
        var nn = rest ? ensureNode(n.user, n.priv, rest, n.table, n.star) : null;
        if (nn) addEdge(e.from, nn.id, idx);
        if (!(n.id in replacement)) { replacement[n.id] = nn ? nn.id : null; steps.push({ from: n.id, to: nn ? nn.id : null }); }
      });
      var guard = 0;
      var changed = true;
      while (changed && guard++ < 200) {
        changed = false;
        var r = reach();
        var lost = lostBetween(before, r);
        lost.forEach(function (id) {
          var repl = replacement[id];
          if (!repl) return;
          edges.forEach(function (e) {
            if (e.revoked || e.from !== id || e.rewired) return;
            e.rewired = true;
            var m = nodes[e.to];
            var restM = minusCols(m.cols, R);
            var mm = restM ? ensureNode(m.user, m.priv, restM, m.table, m.star) : null;
            if (mm) addEdge(repl, mm.id, idx);
            if (!(m.id in replacement)) {
              replacement[m.id] = mm ? mm.id : null;
              if (!sameCols(m.cols, restM)) steps.push({ from: m.id, to: mm ? mm.id : null });
            }
            changed = true;
          });
        });
      }
      edges.forEach(function (e) { delete e.rewired; });
      return steps;
    }

    statements.forEach(function (stmt, idx) {
      var entry = { index: idx, stmt: stmt, ok: false, reason: "", removedNodes: [] };
      var cols = parseCols(stmt.cols);
      var r = reach();

      if (stmt.kind === "GRANT") {
        var check = findGrantingNode(stmt.actor, stmt.priv, cols, stmt.table, r);
        if (!check.ok) {
          entry.reason = check.hasPrivWithoutOption
            ? "\"" + stmt.actor + "\" tiene " + stmt.priv + colsLabel(cols) + " sobre " + stmt.table +
              " pero SIN opción de concesión: tener un privilegio no habilita a cederlo (GMUW 10.1.4)."
            : "\"" + stmt.actor + "\" no tiene " + stmt.priv + colsLabel(cols) + " sobre " + stmt.table + ".";
        } else {
          var fromId = stmt.actor === owner
            ? ensureNode(owner, stmt.priv, cols, stmt.table, "**").id
            : check.id;
          var targetNode = ensureNode(stmt.target, stmt.priv, cols, stmt.table, stmt.withGrantOption ? "*" : "");
          addEdge(fromId, targetNode.id, idx);
          entry.ok = true;
          entry.nodeId = targetNode.id;
          entry.reason = "Concedido: arista " + fromId + " → " + targetNode.id +
            (stmt.withGrantOption ? " (nodo con opción de concesión)." : " (nodo sin opción de concesión).");
        }
        log.push(entry);
        return;
      }

      // ---------- REVOKE ----------
      var plainId = nodeKey(stmt.target, stmt.priv, cols, stmt.table, "");
      var starId = nodeKey(stmt.target, stmt.priv, cols, stmt.table, "*");
      var exact = function (t) { return sameCols(t.cols, cols); };

      if (!nodes[plainId] && !nodes[starId]) {
        var covering = cols && !stmt.grantOptionFor ? actorEdgesTo(stmt.actor, stmt.target, stmt.priv, stmt.table, function (t) {
          return !sameCols(t.cols, cols) && colsCover(t.cols, cols);
        }) : [];
        if (covering.length && decompose) {
          var snap = snapshot();
          var before = reach();
          var steps = decomposeRevoke(covering, cols, idx);
          var after = reach();
          var lost = lostBetween(before, after);
          var lostOthers = lost.filter(function (id) { return nodes[id].user !== stmt.target; });
          if (stmt.cascadeMode === "RESTRICT" && lostOthers.length) {
            restore(snap);
            entry.reason = "RESTRICT (lectura \"descomponer\"): retirar " + stmt.priv + colsLabel(cols) +
              " le quitaría una parte del privilegio a " + lostOthers.join("; ") + ". Se rechaza la sentencia.";
          } else {
            entry.ok = true;
            entry.removedNodes = lost;
            entry.reason = "Lectura \"descomponer\" (Práctica 2026-09-08 § 1.b, punto abierto): " +
              steps.map(function (s) { return s.from + " pasa a " + (s.to || "nada"); }).join("; ") + ".";
          }
        } else if (covering.length) {
          entry.reason = "Lectura \"no hay nada que revocar\": no existe el nodo " + plainId + " ni " + starId +
            ". El grafo no descompone un privilegio de tabla en uno de columna (GMUW 10.1.6 solo trabaja el caso " +
            "inverso, Ej. 10.6), y MySQL tampoco (ERROR 1147). Punto abierto en el vault: Práctica 2026-09-08 § 1.b " +
            "da como respuesta principal la descomposición; 1.11.02 § 6 dice que esa lectura no sale del libro. " +
            "Cambie el selector \"Revocar una columna de un privilegio de tabla\" para ver la otra lectura.";
        } else {
          entry.reason = "\"" + stmt.target + "\" no tiene " + stmt.priv + colsLabel(cols) + " sobre " + stmt.table +
            " (no existe el nodo " + plainId + "): no hay nada que revocar.";
        }
        log.push(entry);
        return;
      }

      if (stmt.grantOptionFor) {
        var goEdges = actorEdgesTo(stmt.actor, stmt.target, stmt.priv, stmt.table, function (t) {
          return t.star === "*" && exact(t);
        });
        if (!nodes[starId]) {
          entry.reason = "\"" + stmt.target + "\" tiene " + stmt.priv + colsLabel(cols) +
            " sin opción de concesión (solo existe el nodo " + plainId + "): no hay opción que revocar.";
        } else if (!goEdges.length) {
          entry.reason = "\"" + stmt.actor + "\" no le otorgó a \"" + stmt.target + "\" este privilegio con opción " +
            "de concesión: no puede quitársela (GMUW 10.1.6).";
        } else {
          var snapGO = snapshot();
          var beforeGO = reach();
          goEdges.forEach(function (e) {
            e.revoked = true;
            var plain = ensureNode(stmt.target, stmt.priv, cols, stmt.table, "");
            addEdge(e.from, plain.id, idx);
          });
          var afterGO = reach();
          var lostGO = lostBetween(beforeGO, afterGO);
          var lostGOothers = lostGO.filter(function (id) { return id !== starId; });
          if (stmt.cascadeMode === "RESTRICT" && lostGOothers.length) {
            restore(snapGO);
            entry.reason = "RESTRICT: quitar la opción de concesión dejaría sin camino al dueño a: " +
              lostGOothers.join("; ") + ". Se rechaza la sentencia.";
          } else {
            entry.ok = true;
            entry.removedNodes = lostGO;
            entry.reason = "La arista hacia " + starId + " pasa a " + plainId + ": \"" + stmt.target + "\" conserva " +
              stmt.priv + colsLabel(cols) + " pero pierde la opción de concesión que le dio \"" + stmt.actor + "\"" +
              (afterGO[starId] ? " (la sigue teniendo por otro otorgante)." : ".") +
              (lostGOothers.length ? " Cae en cascada: " + lostGOothers.join(", ") + "." : "");
          }
        }
        log.push(entry);
        return;
      }

      var revEdges = actorEdgesTo(stmt.actor, stmt.target, stmt.priv, stmt.table, exact);
      if (!revEdges.length) {
        entry.reason = "\"" + stmt.actor + "\" no otorgó este privilegio a \"" + stmt.target +
          "\": el estándar solo permite revocar a quien otorgó (GMUW 10.1.6).";
        log.push(entry);
        return;
      }
      var snapR = snapshot();
      var beforeR = reach();
      revEdges.forEach(function (e) { e.revoked = true; });
      var afterR = reach();
      var lostR = lostBetween(beforeR, afterR);
      // GMUW 10.1.6: RESTRICT solo bloquea si la cascada le quita privilegios a OTROS nodos porque
      // el objetivo se los había pasado (Ej. 10.6, impresa 434: revocarle a V su único camino no
      // impide la sentencia, aun con RESTRICT, si V no le había pasado el privilegio a nadie más).
      // Los dos nodos del propio objetivo (con y sin "*") no cuentan como la cascada de terceros.
      var lostOthersR = lostR.filter(function (id) { return id !== plainId && id !== starId; });
      if (stmt.cascadeMode === "RESTRICT" && lostOthersR.length) {
        restore(snapR);
        entry.reason = "RESTRICT: la revocación dejaría sin camino al dueño, además del propio objetivo, a: " +
          lostOthersR.join("; ") + " (a quienes \"" + stmt.target + "\" les había pasado el privilegio). Se rechaza la sentencia (GMUW 10.1.6).";
      } else {
        entry.ok = true;
        entry.removedNodes = lostR;
        var keeps = [plainId, starId].filter(function (id) { return afterR[id]; });
        entry.reason = (lostOthersR.length
          ? "Revocado. Cae en cascada: " + lostOthersR.join(", ") + "."
          : "Revocado. Nadie más se ve afectado" + (stmt.cascadeMode === "CASCADE" ? " (no había nada más que arrastrar)." : ".")) +
          (keeps.length ? " \"" + stmt.target + "\" conserva " + keeps.join(" y ") + " por otro otorgante." : "");
      }
      log.push(entry);
    });

    var finalReach = reach();
    var nodeList = Object.keys(nodes).map(function (id) {
      var n = nodes[id];
      return { id: id, user: n.user, priv: n.priv, cols: n.cols, table: n.table, star: n.star, owner: n.owner, grantOption: n.grantOption, active: !!finalReach[id] };
    });
    return { nodes: nodeList, edges: edges.slice(), log: log };
  }

  // ---------- modelo de MySQL ----------

  function runMysql(config, statements) {
    var owner = config.owner;
    var state = {}; // table -> user -> {privs:{priv:true}, grantOption:bool, columnPrivs:{priv:[cols]}}
    var log = [];

    function row(table, user) {
      if (!state[table]) state[table] = {};
      if (!state[table][user]) state[table][user] = { privs: {}, grantOption: false, columnPrivs: {} };
      return state[table][user];
    }

    function actorAuthorized(table, actor) {
      if (actor === owner) return true;
      return row(table, actor).grantOption === true;
    }

    statements.forEach(function (stmt, idx) {
      var entry = { index: idx, stmt: stmt, ok: false, reason: "" };
      var cols = parseCols(stmt.cols);

      if (stmt.kind === "REVOKE" && (stmt.cascadeMode === "CASCADE" || stmt.cascadeMode === "RESTRICT")) {
        entry.reason = "ERROR 1064 (42000): error de sintaxis cerca de '" + stmt.cascadeMode +
          "' — MySQL no tiene REVOKE ... CASCADE/RESTRICT. La sentencia no se ejecuta.";
        log.push(entry);
        return;
      }

      if (stmt.kind === "GRANT") {
        if (!actorAuthorized(stmt.table, stmt.actor)) {
          entry.reason = "\"" + stmt.actor + "\" no tiene la marca Grant sobre " + stmt.table + " en MySQL.";
          log.push(entry);
          return;
        }
        var hasPriv;
        if (stmt.actor === owner) {
          hasPriv = true;
        } else {
          var ra = row(stmt.table, stmt.actor);
          if (cols) {
            var haveCols = ra.columnPrivs[stmt.priv] || [];
            hasPriv = !!ra.privs[stmt.priv] || cols.every(function (c) { return haveCols.indexOf(c) !== -1; });
          } else {
            hasPriv = !!ra.privs[stmt.priv];
          }
        }
        if (!hasPriv) {
          entry.reason = "\"" + stmt.actor + "\" no tiene " + stmt.priv + colsLabel(cols) + " sobre " + stmt.table + " en MySQL.";
          log.push(entry);
          return;
        }
        var tr = row(stmt.table, stmt.target);
        if (cols) {
          var have2 = tr.columnPrivs[stmt.priv] || [];
          cols.forEach(function (c) { if (have2.indexOf(c) === -1) have2.push(c); });
          tr.columnPrivs[stmt.priv] = have2;
        } else {
          tr.privs[stmt.priv] = true;
        }
        if (stmt.withGrantOption) tr.grantOption = true;
        entry.ok = true;
        entry.reason = "Otorgado en mysql.tables_priv" + (cols ? "/mysql.columns_priv" : "") +
          " para \"" + stmt.target + "\"" + (stmt.withGrantOption ? " (marca Grant activada)." : ".");
        log.push(entry);
        return;
      }

      // REVOKE sin CASCADE/RESTRICT. MySQL 9.7.2 exige al que revoca (1) la marca Grant sobre la
      // tabla y (2), salvo en REVOKE GRANT OPTION, el privilegio que revoca, sea de tabla o de
      // alguna columna: sin él da ERROR 1142 "<PRIV> command denied" (verificado en el contenedor).
      if (!actorAuthorized(stmt.table, stmt.actor)) {
        entry.reason = "ERROR 1142 (42000): GRANT command denied — \"" + stmt.actor + "\" no tiene la marca Grant sobre " +
          stmt.table + " en MySQL.";
        log.push(entry);
        return;
      }
      if (!stmt.grantOptionFor && stmt.actor !== owner) {
        var ar = row(stmt.table, stmt.actor);
        var actorHas = !!ar.privs[stmt.priv] || !!(ar.columnPrivs[stmt.priv] && ar.columnPrivs[stmt.priv].length);
        if (!actorHas) {
          entry.reason = "ERROR 1142 (42000): " + stmt.priv + " command denied to user '" + stmt.actor + "' for table '" +
            stmt.table + "' — para revocar un privilegio hay que tenerlo, además de la marca Grant.";
          log.push(entry);
          return;
        }
      }
      var trg = row(stmt.table, stmt.target);
      if (stmt.grantOptionFor) {
        if (!trg.grantOption) {
          entry.reason = "ERROR 1147 (42000): \"" + stmt.target + "\" no tiene la marca Grant en " + stmt.table + ": no hay opción que revocar.";
        } else {
          trg.grantOption = false;
          entry.ok = true;
          entry.reason = "\"" + stmt.target + "\" pierde la marca Grant en " + stmt.table +
            ". No afecta lo que ya haya re-otorgado: MySQL no propaga.";
        }
        log.push(entry);
        return;
      }
      if (cols) {
        var haveC = trg.columnPrivs[stmt.priv] || [];
        var missing = cols.filter(function (c) { return haveC.indexOf(c) === -1; });
        if (missing.length) {
          entry.reason = "ERROR 1147: no existe ese privilegio de columna para revocar (" + missing.join(", ") + ").";
        } else {
          trg.columnPrivs[stmt.priv] = haveC.filter(function (c) { return cols.indexOf(c) === -1; });
          entry.ok = true;
          entry.reason = "Revocado. No afecta a otros usuarios: MySQL no registra quién otorgó qué.";
        }
      } else {
        // REVOKE de nivel tabla: se lleva el privilegio de tabla Y los de columna de ese privilegio
        // (MySQL 9.7.2: GRANT UPDATE(tiempo) …; REVOKE UPDATE ON … corre sin error y SHOW GRANTS
        // ya no muestra UPDATE(tiempo)). ERROR 1147 solo si no tiene ninguno de los dos.
        var hadCols = trg.columnPrivs[stmt.priv] && trg.columnPrivs[stmt.priv].length ? trg.columnPrivs[stmt.priv].slice() : null;
        if (!trg.privs[stmt.priv] && !hadCols) {
          entry.reason = "ERROR 1147 (42000): There is no such grant defined for user '" + stmt.target + "' on table '" +
            stmt.table + "' — no tiene " + stmt.priv + " ni de tabla ni de columna.";
        } else {
          delete trg.privs[stmt.priv];
          delete trg.columnPrivs[stmt.priv];
          entry.ok = true;
          entry.reason = "Revocado" + (hadCols ? " (también " + stmt.priv + "(" + hadCols.join(", ") + "): un REVOKE de tabla se lleva los privilegios de columna)" : "") +
            ". No afecta a otros usuarios: MySQL no registra quién otorgó qué.";
        }
      }
      log.push(entry);
    });

    var rows = [];
    Object.keys(state).forEach(function (table) {
      Object.keys(state[table]).forEach(function (user) {
        var r = state[table][user];
        var privList = Object.keys(r.privs);
        var colPrivs = {};
        var hasColPrivs = false;
        Object.keys(r.columnPrivs).forEach(function (p) {
          if (r.columnPrivs[p] && r.columnPrivs[p].length) { colPrivs[p] = r.columnPrivs[p].slice(); hasColPrivs = true; }
        });
        if (!privList.length && !hasColPrivs && !r.grantOption) return;
        rows.push({ table: table, user: user, privs: privList, columnPrivs: colPrivs, grantOption: r.grantOption });
      });
    });
    return { rows: rows, log: log };
  }

  function compareModes(config, statements) {
    var std = runStandard(config, statements);
    var my = runMysql(config, statements);
    var diffs = [];
    statements.forEach(function (stmt, idx) {
      var e1 = std.log[idx], e2 = my.log[idx];
      if (e1.ok !== e2.ok) {
        diffs.push({ index: idx, stmt: stmt, standardOk: e1.ok, mysqlOk: e2.ok, standardReason: e1.reason, mysqlReason: e2.reason });
      } else if (e1.ok && e2.ok && e1.removedNodes && e1.removedNodes.length) {
        diffs.push({
          index: idx, stmt: stmt, standardOk: true, mysqlOk: true,
          note: "En el estándar esta sentencia arrastra en cascada: " + e1.removedNodes.join(", ") +
            ". En MySQL nadie más pierde nada (no hay CASCADE).",
        });
      }
    });
    return { standard: std, mysql: my, diffs: diffs };
  }

  // ---------- presets ----------

  function stmt(actor, kind, priv, cols, table, target, wgo, goFor, cascade) {
    return { actor: actor, kind: kind, priv: priv, cols: cols || "", table: table, target: target, withGrantOption: !!wgo, grantOptionFor: !!goFor, cascadeMode: cascade || "CASCADE" };
  }

  var PRESETS = [
    {
      id: "gmuw-handout",
      label: "Grafo de GMUW — handout de seguridad del 07/09",
      origen: "raw/Unidad-01/Teorica/ejemplo Seguridad BD.png, vía Clase 11 § Material complementario",
      owner: "User0",
      users: ["User1", "User2", "", "", "", ""],
      mode: "estandar",
      statements: [
        stmt("User0", "GRANT", "INSERT", "", "T1", "User1", true),
        stmt("User0", "GRANT", "UPDATE", "", "V2", "User2", false),
        stmt("User0", "GRANT", "DELETE", "", "V2", "User2", false),
        stmt("User1", "GRANT", "INSERT", "", "T1", "User2", false),
        stmt("User0", "REVOKE", "INSERT", "", "T1", "User1", false, false, "CASCADE"),
      ],
    },
    {
      id: "tp8-ej1",
      label: "TP8 ejercicio 1 — PARRAFO (db_exp, adm, doc)",
      origen: "Práctica 2026-09-08 (TP8), ejercicio 1",
      owner: "db_exp",
      users: ["adm", "doc", "", "", "", ""],
      mode: "estandar",
      statements: [
        stmt("db_exp", "GRANT", "SELECT", "", "parrafo", "adm", true),
        stmt("db_exp", "GRANT", "UPDATE", "", "parrafo", "adm", true),
        stmt("db_exp", "GRANT", "DELETE", "", "parrafo", "adm", false),
        stmt("adm", "GRANT", "SELECT", "", "parrafo", "doc", false),
        stmt("adm", "GRANT", "UPDATE", "tiempo,diccion", "parrafo", "doc", true),
        stmt("adm", "GRANT", "DELETE", "", "parrafo", "doc", false),
        stmt("db_exp", "REVOKE", "SELECT", "", "parrafo", "adm", false, false, "CASCADE"),
        stmt("db_exp", "REVOKE", "UPDATE", "tiempo", "parrafo", "adm", false, false, "CASCADE"),
      ],
    },
    {
      id: "dos-caminos",
      label: "Dos caminos — un privilegio que sobrevive a un CASCADE",
      origen: "construido a partir de Práctica 2026-09-08 § Ejercicio 1 (nota final) y § Ejercicio 3",
      owner: "propietario",
      users: ["u1", "u2", "u3", "", "", ""],
      mode: "estandar",
      statements: [
        stmt("propietario", "GRANT", "SELECT", "", "tabla", "u1", true),
        stmt("u1", "GRANT", "SELECT", "", "tabla", "u3", false),
        stmt("propietario", "GRANT", "SELECT", "", "tabla", "u3", false),
        stmt("propietario", "REVOKE", "SELECT", "", "tabla", "u1", false, false, "CASCADE"),
      ],
    },
  ];

  // ---------- retos ----------

  var RETOS = [
    {
      id: "tener-no-es-ceder",
      titulo: "Tener no es poder ceder",
      enunciado: "Arme una secuencia en la que un usuario reciba un privilegio SIN opción de concesión " +
        "y luego intente cedérselo a un tercero. En modo estándar esa sentencia tiene que fallar.",
      fuente: "Práctica 2026-09-08 (TP8), ejercicio 1.a, sentencia 6 · GMUW 10.1.4",
      check: function (config, statements) {
        var res = runStandard(config, statements);
        var found = res.log.some(function (e) { return e.stmt.kind === "GRANT" && !e.ok && /opción de concesión/.test(e.reason); });
        return {
          pass: found,
          detail: found
            ? "Correcto: hay una sentencia GRANT que el modo estándar rechaza por falta de opción de concesión."
            : "Todavía no hay ninguna GRANT que falle por falta de opción de concesión. Otorgue un privilegio " +
              "sin WITH GRANT OPTION y haga que ese mismo usuario intente re-otorgarlo.",
        };
      },
    },
    {
      id: "dos-caminos-sobrevive",
      titulo: "Un privilegio con dos otorgantes",
      enunciado: "Construya un grafo donde un mismo usuario reciba el mismo privilegio de DOS otorgantes " +
        "distintos, y revoque uno de esos caminos con CASCADE. El privilegio tiene que sobrevivir por el otro camino.",
      fuente: "Práctica 2026-09-08 § Ejercicio 1 (nota final) y § Ejercicio 3 · GMUW 10.1.6",
      check: function (config, statements) {
        var res = runStandard(config, statements);
        var byId = {};
        res.nodes.forEach(function (n) { byId[n.id] = n; });
        var pass = res.nodes.some(function (n) {
          if (!n.active) return false;
          var parents = {};
          res.edges.forEach(function (e) { if (e.to === n.id) parents[e.from] = true; });
          var parentIds = Object.keys(parents);
          if (parentIds.length < 2) return false;
          var hasInactiveParent = parentIds.some(function (pid) { return byId[pid] && !byId[pid].active; });
          var hasActiveParent = parentIds.some(function (pid) { return byId[pid] && byId[pid].active; });
          return hasInactiveParent && hasActiveParent;
        });
        return {
          pass: pass,
          detail: pass
            ? "Correcto: hay un nodo activo con dos otorgantes distintos, uno de ellos ya inactivo, y sobrevive por el otro camino."
            : "Todavía no hay un nodo con dos otorgantes donde uno haya quedado inactivo y el privilegio sobreviva por el otro.",
        };
      },
    },
    {
      id: "mysql-no-propaga",
      titulo: "MySQL no recuerda quién otorgó qué",
      enunciado: "En modo MySQL, arme una secuencia donde un usuario B le otorgue un privilegio a un " +
        "usuario C, y luego se le revoque ese privilegio a B. C tiene que conservarlo: MySQL no propaga.",
      fuente: "1.11.02 § 7 · Práctica 2026-09-08 § 1.b y § 3.b (\"MySQL no provee la opción CASCADE\")",
      check: function (config, statements) {
        var res = runMysql(config, statements);
        var pass = false;
        statements.forEach(function (s1, i) {
          if (s1.kind !== "GRANT" || s1.actor === config.owner || !res.log[i].ok) return;
          for (var j = i + 1; j < statements.length; j++) {
            var s2 = statements[j];
            if (s2.kind === "REVOKE" && !s2.grantOptionFor && s2.target === s1.actor &&
                s2.table === s1.table && s2.priv === s1.priv && res.log[j].ok) {
              var stillHas = res.rows.some(function (r) {
                return r.table === s1.table && r.user === s1.target &&
                  (r.privs.indexOf(s1.priv) !== -1 || (r.columnPrivs[s1.priv] && r.columnPrivs[s1.priv].length));
              });
              if (stillHas) pass = true;
            }
          }
        });
        return {
          pass: pass,
          detail: pass
            ? "Correcto: en MySQL, revocarle el privilegio al otorgante intermedio no se lo quita a quien ya lo recibió."
            : "Todavía no se ve la brecha: otorgue algo de B a C, revóqueselo a B, y compruebe que C lo conserva en modo MySQL.",
        };
      },
    },
  ];

  App.bdiiLab.engines["grant-revoke"] = {
    PRIVS: PRIVS,
    parseCols: parseCols,
    colsCover: colsCover,
    colsLabel: colsLabel,
    nodeKey: nodeKey,
    runStandard: runStandard,
    runMysql: runMysql,
    compareModes: compareModes,
    PRESETS: PRESETS,
    RETOS: RETOS,
  };

  // ==================================================================
  // Interfaz
  // ==================================================================

  lab.tool(
    {
      id: "grant-revoke",
      title: "GRANT, REVOKE y el grafo de privilegios",
      subtitle: "Arme sentencias GRANT/REVOKE en orden y vea el grafo de concesiones: quién puede " +
        "otorgar qué, y qué se cae cuando se revoca — según el estándar y según MySQL.",
      sources: [
        { stem: "1.11.01 - Seguridad en bases de datos", label: "Seguridad en bases de datos" },
        { stem: "1.11.02 - Usuarios, privilegios y roles", label: "Usuarios, privilegios y roles" },
        { stem: "Clase 11 - Seguridad-Transacciones", label: "Clase 11" },
        { stem: "Práctica 2026-09-08", label: "Práctica 2026-09-08 (TP8)" },
        { stem: "MySQL", label: "MySQL" },
      ],
      figure: { id: "lab-grant-revoke", caption: "Grafo de concesiones: GRANT/REVOKE, estándar vs. MySQL.", height: 420 },
    },
    function mount(body, mountCtx) {
      var h = lab.h;
      var svg = lab.svg;
      var engine = App.bdiiLab.engines["grant-revoke"];
      var compact = mountCtx.mode === "figure";

      var state = {
        mode: "estandar",
        columnRevoke: "atomica",
        owner: "db_exp",
        users: ["adm", "doc", "", "", "", ""],
        statements: PRESETS_clone(engine.PRESETS[1].statements),
        builder: { actor: "", kind: "GRANT", priv: "SELECT", cols: "", table: "parrafo", target: "", withGrantOption: false, grantOptionFor: false, cascadeMode: "CASCADE" },
      };

      function PRESETS_clone(list) { return list.map(function (s) { return Object.assign({}, s); }); }

      function activeUsers() { return state.users.filter(function (u) { return u; }); }
      function actorOptions() {
        var opts = [{ value: state.owner, label: state.owner + " (propietario)" }];
        activeUsers().forEach(function (u) { opts.push({ value: u, label: u }); });
        return opts;
      }
      function targetOptions() {
        return activeUsers().map(function (u) { return { value: u, label: u }; });
      }

      function applyPreset(preset) {
        state.owner = preset.owner;
        state.users = preset.users.slice();
        state.statements = PRESETS_clone(preset.statements);
        state.mode = preset.mode || "estandar";
        state.builder.actor = state.owner;
        state.builder.target = activeUsers()[0] || "";
        state.builder.table = preset.statements.length ? preset.statements[0].table : "tabla";
        syncConfigControls();
        renderBuilderExtras();
        renderAll();
      }

      // ---------- controles de configuración ----------

      var ownerCtrl = lab.text({ label: "Propietario (dueño de las tablas)", value: state.owner, onChange: function (v) { state.owner = v || "db_exp"; renderAll(); } });
      var userCtrls = [0, 1, 2, 3, 4, 5].map(function (i) {
        return lab.text({
          label: "Usuario " + (i + 1) + (i > 2 ? " (opcional)" : ""),
          value: state.users[i],
          placeholder: i > 2 ? "sin usar" : "",
          onChange: function (v) { state.users[i] = v.trim(); renderAll(); },
        });
      });

      var modeCtrl = lab.segmented({
        label: "Semántica",
        options: [{ value: "estandar", label: "Estándar (GMUW 10.1)" }, { value: "mysql", label: "MySQL" }],
        value: state.mode,
        onChange: function (v) { state.mode = v; renderBuilderExtras(); renderAll(); },
      });

      // El estado inicial es el preset del TP8 (índice 1): el selector lo muestra elegido.
      var presetCtrl = lab.presetPicker({
        label: "Escenario precargado",
        presets: engine.PRESETS,
        value: 1,
        onPick: function (preset) { applyPreset(preset); },
      });

      // Punto abierto del vault (TP8 ej. 1.b): no se elige una lectura por defecto sin decirlo;
      // cuando las dos lecturas dan resultados distintos, el panel de resultado muestra la otra.
      var columnRevokeCtrl = lab.segmented({
        label: "Revocar una columna de un privilegio de tabla (punto abierto, solo en el estándar)",
        options: [
          { value: "atomica", label: "No hay nada que revocar (1.11.02 § 6)" },
          { value: "descomponer", label: "Descomponer (Práctica 2026-09-08 § 1.b)" },
        ],
        value: state.columnRevoke,
        onChange: function (v) { state.columnRevoke = v; renderAll(); },
      });

      function syncConfigControls() {
        ownerCtrl.set(state.owner);
        userCtrls.forEach(function (c, i) { c.set(state.users[i]); });
        modeCtrl.set(state.mode);
        columnRevokeCtrl.set(state.columnRevoke);
      }

      // ---------- constructor de sentencias ----------

      var actorWrap = h("div", { class: "lab-grr-actor-wrap" });
      var targetWrap = h("div", { class: "lab-grr-target-wrap" });
      var actorCtrl = null;
      var targetCtrl = null;

      function rebuildActorTarget() {
        var aOpts = actorOptions();
        var tOpts = targetOptions();
        if (!aOpts.some(function (o) { return o.value === state.builder.actor; })) state.builder.actor = aOpts[0] ? aOpts[0].value : "";
        if (!tOpts.some(function (o) { return o.value === state.builder.target; })) state.builder.target = tOpts[0] ? tOpts[0].value : "";
        actorCtrl = lab.select({ label: "Quién ejecuta", options: aOpts, value: state.builder.actor, onChange: function (v) { state.builder.actor = v; } });
        targetCtrl = lab.select({ label: "Sobre quién (receptor / revocado)", options: tOpts, value: state.builder.target, onChange: function (v) { state.builder.target = v; } });
        actorWrap.replaceChildren(actorCtrl.el);
        targetWrap.replaceChildren(targetCtrl.el);
      }

      var kindCtrl = lab.segmented({
        label: "Sentencia", options: [{ value: "GRANT", label: "GRANT" }, { value: "REVOKE", label: "REVOKE" }],
        value: state.builder.kind, onChange: function (v) { state.builder.kind = v; renderBuilderExtras(); },
      });
      var privCtrl = lab.select({ label: "Privilegio", options: engine.PRIVS.map(function (p) { return { value: p, label: p }; }), value: state.builder.priv, onChange: function (v) { state.builder.priv = v; } });
      var colsCtrl = lab.text({ label: "Columnas (opcional; vacío = toda la tabla)", value: state.builder.cols, mono: true, onChange: function (v) { state.builder.cols = v; } });
      var tableCtrl = lab.text({ label: "Tabla", value: state.builder.table, mono: true, onChange: function (v) { state.builder.table = v || "tabla"; } });
      var wgoCtrl = lab.toggle({ label: "WITH GRANT OPTION", checked: state.builder.withGrantOption, onChange: function (v) { state.builder.withGrantOption = v; } });
      var goForCtrl = lab.toggle({ label: "GRANT OPTION FOR (quitar solo la opción)", checked: state.builder.grantOptionFor, onChange: function (v) { state.builder.grantOptionFor = v; } });

      // El segmentado "Al revocar" depende del modo: el estándar exige CASCADE o RESTRICT (GMUW
      // 10.1.6), pero MySQL no tiene ninguna de las dos cláusulas — un REVOKE simple ahí no lleva
      // nada, y agregar CASCADE/RESTRICT a propósito es lo que dispara el error de sintaxis. Sin una
      // tercera opción "(ninguna)" era imposible construir, en modo MySQL, el REVOKE simple que sí
      // corre en el motor real.
      var cascadeWrap = h("div", {});
      var cascadeCtrl = null;
      function rebuildCascadeCtrl() {
        var opts = state.mode === "mysql"
          ? [
              { value: "", label: "(ninguna — MySQL no tiene CASCADE/RESTRICT)" },
              { value: "CASCADE", label: "CASCADE (error de sintaxis en MySQL)" },
              { value: "RESTRICT", label: "RESTRICT (error de sintaxis en MySQL)" },
            ]
          : [{ value: "CASCADE", label: "CASCADE" }, { value: "RESTRICT", label: "RESTRICT" }];
        if (!opts.some(function (o) { return o.value === state.builder.cascadeMode; })) {
          state.builder.cascadeMode = opts[0].value;
        }
        cascadeCtrl = lab.segmented({
          label: "Al revocar", options: opts, value: state.builder.cascadeMode,
          onChange: function (v) { state.builder.cascadeMode = v; },
        });
        cascadeWrap.replaceChildren(cascadeCtrl.el);
      }

      var builderExtras = h("div", { class: "lab-grr-extra" });
      function renderBuilderExtras() {
        builderExtras.replaceChildren();
        if (state.builder.kind === "GRANT") {
          builderExtras.appendChild(wgoCtrl.el);
        } else {
          rebuildCascadeCtrl();
          builderExtras.appendChild(goForCtrl.el);
          builderExtras.appendChild(cascadeWrap);
        }
      }

      var addBtn = lab.button({
        label: "Agregar sentencia", kind: "primary",
        onClick: function () {
          if (!state.builder.actor || !state.builder.target) return;
          state.statements.push({
            actor: state.builder.actor, kind: state.builder.kind, priv: state.builder.priv,
            cols: state.builder.cols, table: state.builder.table, target: state.builder.target,
            withGrantOption: state.builder.withGrantOption, grantOptionFor: state.builder.grantOptionFor,
            cascadeMode: state.builder.cascadeMode,
          });
          renderAll();
        },
      });
      var clearBtn = lab.button({ label: "Vaciar sentencias", kind: "ghost", onClick: function () { state.statements = []; renderAll(); } });

      // ---------- panel de sentencias ----------

      var statementsList = h("div", { class: "lab-grr-stmt-list" });
      var resultado = h("div", { class: "lab-grr-resultado", "aria-live": "polite" });
      var retosPanel = h("div", { class: "lab-grr-retos" });
      var diffPanel = h("div", { class: "lab-grr-diff" });

      function sqlFor(stmt, mode) {
        var cols = engine.parseCols(stmt.cols);
        var colsTxt = cols ? "(" + cols.join(", ") + ")" : "";
        if (mode === "estandar") {
          if (stmt.kind === "GRANT") {
            return "GRANT " + stmt.priv + colsTxt + " ON " + stmt.table + " TO " + stmt.target + (stmt.withGrantOption ? " WITH GRANT OPTION" : "") + ";";
          }
          return "REVOKE " + (stmt.grantOptionFor ? "GRANT OPTION FOR " : "") + stmt.priv + colsTxt +
            " ON " + stmt.table + " FROM " + stmt.target + " " + (stmt.cascadeMode || "CASCADE") + ";";
        }
        // mysql
        var actorHost = "'" + stmt.actor + "'@'%'";
        var targetHost = "'" + stmt.target + "'@'%'";
        if (stmt.kind === "GRANT") {
          return "-- ejecuta " + actorHost + "\nGRANT " + stmt.priv + colsTxt + " ON db." + stmt.table + " TO " + targetHost +
            (stmt.withGrantOption ? " WITH GRANT OPTION" : "") + ";";
        }
        var withCascadeMy = stmt.cascadeMode ? " " + stmt.cascadeMode : "";
        if (stmt.grantOptionFor) {
          // MySQL sí acepta (y rechaza) CASCADE/RESTRICT después de esta forma: el texto tiene que
          // mostrar la misma cláusula que evalúa runMysql(), o el error citaría una palabra que no
          // está en el SQL mostrado.
          return "-- ejecuta " + actorHost + "\nREVOKE GRANT OPTION ON db." + stmt.table + " FROM " + targetHost + withCascadeMy + ";";
        }
        return "-- ejecuta " + actorHost + "\nREVOKE " + stmt.priv + colsTxt + " ON db." + stmt.table + " FROM " + targetHost + withCascadeMy + ";";
      }

      function renderStatements(cmp) {
        statementsList.replaceChildren();
        if (!state.statements.length) {
          statementsList.appendChild(lab.callout("info", "Sin sentencias todavía", "Agregue una con el constructor de arriba, o cargue un escenario."));
          return;
        }
        state.statements.forEach(function (stmt, i) {
          var eStd = cmp.standard.log[i];
          var eMy = cmp.mysql.log[i];
          var current = state.mode === "estandar" ? eStd : eMy;
          // En la figura del wiki: sin botón Quitar (no hay constructor) y el motivo solo si la
          // sentencia falla o arrastra algo; el detalle completo queda en el laboratorio.
          var showReason = !compact || !current.ok;
          if (compact) {
            var sqlLine = sqlFor(stmt, state.mode).split("\n").pop();
            statementsList.appendChild(h(
              "div",
              { class: "lab-grr-stmt lab-grr-stmt--compact " + (current.ok ? "lab-grr-stmt--ok" : "lab-grr-stmt--bad") },
              h("div", { class: "lab-grr-stmt-head" },
                h("span", { class: "lab-grr-stmt-idx" }, "" + (i + 1)),
                lab.badge(current.ok ? "✓" : "✗ falla", current.ok ? "ok" : "bad"),
                h("code", { class: "lab-grr-stmt-inline" }, sqlLine)),
              showReason ? h("p", { class: "lab-grr-stmt-reason" }, current.reason.split(/\. (?=[A-ZÁÉÍÓÚ"])/)[0].replace(/\.?$/, ".")) : null,
            ));
            return;
          }
          var rowEl = h(
            "div",
            { class: "lab-grr-stmt " + (current.ok ? "lab-grr-stmt--ok" : "lab-grr-stmt--bad") },
            h("div", { class: "lab-grr-stmt-head" },
              h("span", { class: "lab-grr-stmt-idx" }, "" + (i + 1)),
              lab.badge(current.ok ? "✓ corre" : "✗ falla", current.ok ? "ok" : "bad"),
              h("button", {
                class: "bdii-btn bdii-btn--ghost lab-grr-stmt-remove", type: "button",
                "aria-label": "Quitar sentencia " + (i + 1),
                on: { click: function () { state.statements.splice(i, 1); renderAll(); } },
              }, "Quitar"),
            ),
            lab.code(sqlFor(stmt, state.mode), "sql"),
            h("p", { class: "lab-grr-stmt-reason" }, current.reason),
          );
          statementsList.appendChild(rowEl);
        });
      }

      // ---------- diagrama del grafo (modo estándar) ----------

      function buildGraphSvg(res) {
        var tables = {};
        res.nodes.forEach(function (n) { (tables[n.table] = tables[n.table] || []).push(n); });
        var tableNames = Object.keys(tables);
        if (!tableNames.length) return h("p", { class: "lab-grr-empty" }, "Sin nodos todavía.");

        var wrap = h("div", { class: "lab-grr-graphs" });
        tableNames.forEach(function (table) {
          var nodesT = tables[table];
          var idsT = {}; nodesT.forEach(function (n) { idsT[n.id] = true; });
          var edgesT = res.edges.filter(function (e) { return idsT[e.from] && idsT[e.to]; });

          // profundidad BFS desde los nodos owner de esta tabla (con cualquier arista, activa o no)
          var depth = {};
          nodesT.forEach(function (n) { if (n.owner) depth[n.id] = 0; });
          var changed = true;
          while (changed) {
            changed = false;
            edgesT.forEach(function (e) {
              if (depth[e.from] !== undefined) {
                var d = depth[e.from] + 1;
                if (depth[e.to] === undefined || d < depth[e.to]) { depth[e.to] = d; changed = true; }
              }
            });
          }
          nodesT.forEach(function (n) { if (depth[n.id] === undefined) depth[n.id] = 1; });

          var byDepth = {};
          nodesT.forEach(function (n) { (byDepth[depth[n.id]] = byDepth[depth[n.id]] || []).push(n); });
          var maxDepth = 0;
          Object.keys(byDepth).forEach(function (d) { maxDepth = Math.max(maxDepth, +d); });

          // NODE_H deja lugar a la tercera línea "(revocado)" sin pisar el borde inferior.
          var COL_W = 250, ROW_H = 70, NODE_W = 220, NODE_H = 56;
          var pos = {};
          var maxRows = 1;
          Object.keys(byDepth).forEach(function (d) {
            byDepth[d].forEach(function (n, i) { pos[n.id] = { x: 20 + (+d) * COL_W, y: 20 + i * ROW_H }; });
            maxRows = Math.max(maxRows, byDepth[d].length);
          });
          var width = 20 + (maxDepth + 1) * COL_W;
          var height = 20 + maxRows * ROW_H;

          var svgEl = svg("svg", {
            viewBox: "0 0 " + width + " " + height, width: "100%",
            // Por debajo de ~80 % de su tamaño el texto de los nodos deja de leerse: el bloque
            // pasa a scroll horizontal en lugar de encoger el dibujo (a 375 px quedaba ilegible).
            style: { minWidth: Math.round(width * 0.8) + "px" },
            // En la figura, sin alto fijo: el alto sale de la proporción del viewBox y no
            // queda una franja vacía arriba y abajo del dibujo.
            height: compact ? null : Math.min(height, 420), role: "img",
            "aria-label": "Grafo de concesiones de la tabla " + table,
          });

          svgEl.appendChild(svg("defs", {},
            svg("marker", { id: "grr-arrow-" + table.replace(/[^a-zA-Z0-9]/g, ""), viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" },
              svg("path", { d: "M0,0 L10,5 L0,10 z", class: "lab-grr-arrowhead" }))));
          var markerId = "grr-arrow-" + table.replace(/[^a-zA-Z0-9]/g, "");

          edgesT.forEach(function (e) {
            var p1 = pos[e.from], p2 = pos[e.to];
            if (!p1 || !p2) return;
            var x1 = p1.x + NODE_W, y1 = p1.y + NODE_H / 2;
            var x2 = p2.x, y2 = p2.y + NODE_H / 2;
            svgEl.appendChild(svg("line", {
              x1: x1, y1: y1, x2: x2, y2: y2,
              class: "lab-grr-edge" + (e.revoked ? " lab-grr-edge--revoked" : ""),
              "marker-end": "url(#" + markerId + ")",
            }));
          });

          nodesT.forEach(function (n) {
            var p = pos[n.id];
            var cls = "lab-grr-node" + (n.owner ? " lab-grr-node--owner" : "") + (!n.active ? " lab-grr-node--removed" : "") + (n.active && n.grantOption ? " lab-grr-node--go" : "");
            var g = svg("g", { class: cls, transform: "translate(" + p.x + "," + p.y + ")" });
            g.appendChild(svg("rect", { width: NODE_W, height: NODE_H, rx: 8, class: "lab-grr-node-rect" }));
            g.appendChild(svg("text", { x: 10, y: 18, class: "lab-grr-node-user" }, n.user + (n.owner ? " (dueño)" : "")));
            g.appendChild(svg("text", { x: 10, y: 34, class: "lab-grr-node-priv" }, n.priv + colsLabel(n.cols) + (n.star ? " " + n.star : "")));
            if (!n.active) g.appendChild(svg("text", { x: 10, y: 49, class: "lab-grr-node-removed-label" }, "(revocado)"));
            svgEl.appendChild(g);
          });

          wrap.appendChild(h("div", { class: "lab-grr-graph-block" },
            h("h4", { class: "lab-grr-graph-title" }, "Tabla: ", h("code", {}, table)),
            svgEl,
          ));
        });
        return wrap;
      }

      function nodeTable(res) {
        var rows = res.nodes.map(function (n) {
          return {
            nodo: n.user + " · " + n.priv + colsLabel(n.cols) + (n.star ? " " + n.star : ""),
            tabla: n.table,
            marca: n.owner ? "** (dueño)" : (n.grantOption ? "* (opción de concesión)" : "—"),
            estado: n.active ? "activo" : "revocado",
          };
        });
        return lab.table({
          caption: "Nodos del grafo (usuario · privilegio)",
          columns: [
            { key: "nodo", label: "Nodo", mono: true },
            { key: "tabla", label: "Tabla", mono: true },
            { key: "marca", label: "Marca" },
            { key: "estado", label: "Estado", align: "center" },
          ],
          rows: rows,
          rowClass: function (row) { return row.estado === "revocado" ? "lab-grr-row-removed" : ""; },
        });
      }

      function mysqlTable(my) {
        if (!my.rows.length) return h("p", { class: "lab-grr-empty" }, "Sin privilegios otorgados todavía.");
        var rows = my.rows.map(function (r) {
          var colTxt = Object.keys(r.columnPrivs).map(function (p) { return p + "(" + r.columnPrivs[p].join(",") + ")"; }).join(", ");
          return {
            usuario: "'" + r.user + "'@'%'",
            tabla: r.table,
            privilegios: r.privs.join(", ") || "—",
            columnas: colTxt || "—",
            grant: r.grantOption ? "sí" : "no",
          };
        });
        return lab.table({
          caption: "mysql.tables_priv / mysql.columns_priv resultante",
          columns: [
            { key: "usuario", label: "Usuario", mono: true },
            { key: "tabla", label: "Tabla", mono: true },
            { key: "privilegios", label: "Privilegios (tabla)" },
            { key: "columnas", label: "Privilegios (columna)" },
            { key: "grant", label: "Marca Grant", align: "center" },
          ],
          rows: rows,
        });
      }

      /** Si la otra lectura del punto abierto (TP8 ej. 1.b) cambia el resultado, lo muestra al lado. */
      function otherReading(stdRes) {
        var other = state.columnRevoke === "descomponer" ? "atomica" : "descomponer";
        var altRes = engine.runStandard({ owner: state.owner, columnRevoke: other }, state.statements);
        function activeSet(res) {
          var m = {};
          res.nodes.forEach(function (n) { if (n.active && !n.owner) m[n.id] = true; });
          return m;
        }
        var a = activeSet(stdRes), b = activeSet(altRes);
        var soloAqui = Object.keys(a).filter(function (id) { return !b[id]; });
        var soloOtra = Object.keys(b).filter(function (id) { return !a[id]; });
        if (!soloAqui.length && !soloOtra.length) return null;
        var names = { atomica: "\"no hay nada que revocar\"", descomponer: "\"descomponer\"" };
        if (compact) {
          return lab.callout("warn", "Punto abierto del vault",
            h("p", {}, "Con la lectura " + names[other] + " (TP8 ej. 1.b) el resultado cambia: altérnela arriba, en \"Revocar una columna\", para comparar."));
        }
        return lab.callout("warn", "Punto abierto del vault: la otra lectura da otro resultado",
          h("p", {}, compact
            ? "Con la lectura " + names[other] + " (TP8 ej. 1.b):"
            : "Revocar una columna a quien tiene el privilegio de toda la tabla (TP8 ej. 1.b) no está resuelto: " +
              "Práctica 2026-09-08 § 1.b da como respuesta principal la descomposición y 1.11.02 § 6 dice que no sale de " +
              "GMUW. Arriba se ve la lectura " + names[state.columnRevoke] + "; con la lectura " + names[other] + ":"),
          h("ul", { class: "lab-grr-diff-list" },
            soloOtra.length ? h("li", {}, "quedarían activos: " + soloOtra.join(", ")) : null,
            soloAqui.length ? h("li", {}, "dejarían de estar activos: " + soloAqui.join(", ")) : null));
      }

      function renderResultado(cmp) {
        resultado.replaceChildren();
        if (state.mode === "estandar") {
          if (!compact) resultado.appendChild(lab.callout("info", "Modelo del estándar — GMUW 10.1",
            "Nodo por (usuario, privilegio, columnas); con y sin opción de concesión son nodos distintos: " +
            "\"*\" = con opción de concesión, \"**\" = dueño (1.11.02 § 6, regla 3). Una arista va del otorgante " +
            "al receptor. CASCADE borra todo nodo sin camino al dueño; RESTRICT rechaza la sentencia si eso " +
            "le quitaría algo a un tercero."));
          resultado.appendChild(buildGraphSvg(cmp.standard));
          var alt = otherReading(cmp.standard);
          if (alt) resultado.appendChild(alt);
          if (!compact) resultado.appendChild(nodeTable(cmp.standard));
        } else {
          if (!compact) resultado.appendChild(lab.callout("info", "Modelo de MySQL 9.7",
            "Por (tabla, usuario) hay un conjunto de privilegios y UNA marca Grant compartida " +
            "(mysql.tables_priv.Table_priv). MySQL no registra quién otorgó qué: REVOKE nunca se " +
            "propaga, y CASCADE/RESTRICT son error de sintaxis."));
          resultado.appendChild(mysqlTable(cmp.mysql));
        }

        diffPanel.replaceChildren();
        if (cmp.diffs.length) {
          var items = cmp.diffs.map(function (d) {
            var txt = d.note || ("Sentencia " + (d.index + 1) + ": " + (d.standardOk ? "corre en el estándar" : "falla en el estándar") +
              ", " + (d.mysqlOk ? "corre en MySQL" : "falla en MySQL") + ".");
            return h("li", {}, txt);
          });
          diffPanel.appendChild(lab.callout("warn", "Dónde diverge de la otra semántica", h("ul", { class: "lab-grr-diff-list" }, items)));
        }
      }

      function renderRetos() {
        retosPanel.replaceChildren();
        engine.RETOS.forEach(function (reto) {
          var out = h("div", { "aria-live": "polite" });
          var btn = lab.button({
            label: "Comprobar", kind: "primary",
            onClick: function () {
              var res = reto.check({ owner: state.owner, columnRevoke: state.columnRevoke }, state.statements);
              out.replaceChildren(lab.callout(res.pass ? "ok" : "bad", res.pass ? "Correcto" : "Todavía no", res.detail));
            },
          });
          retosPanel.appendChild(
            lab.panel(
              reto.titulo,
              h("p", {}, reto.enunciado),
              h("p", { class: "lab-grr-reto-fuente" }, "Fuente: ", reto.fuente),
              btn.el,
              out,
            ),
          );
        });
      }

      function renderAll() {
        rebuildActorTarget();
        var cmp = engine.compareModes({ owner: state.owner, columnRevoke: state.columnRevoke }, state.statements);
        renderStatements(cmp);
        renderResultado(cmp);
      }

      renderBuilderExtras();
      state.builder.actor = state.owner;
      state.builder.target = activeUsers()[0] || "";
      rebuildActorTarget();
      renderRetos();

      var enlaces = h("p", { class: "lab-grr-links" },
        "Ver también: ", lab.pageLink("1.11.02 - Usuarios, privilegios y roles", "Usuarios, privilegios y roles"),
        " · ", lab.pageLink("Práctica 2026-09-08", "TP8 completo"));

      var configPanel = compact
        ? lab.panel(null, lab.grid(2, presetCtrl.el, modeCtrl.el), columnRevokeCtrl.el)
        : lab.panel(
            "Configuración del escenario",
            presetCtrl.el, modeCtrl.el, columnRevokeCtrl.el, ownerCtrl.el,
            h("div", { class: "lab-grr-users-grid" }, userCtrls.map(function (c) { return c.el; })),
          );

      var builderPanel = lab.panel(
        "Agregar sentencia",
        h("div", { class: "lab-grr-builder-grid" },
          actorWrap, kindCtrl.el, privCtrl.el, colsCtrl.el, tableCtrl.el, targetWrap, builderExtras,
        ),
        h("div", {}, addBtn.el, " ", clearBtn.el),
      );

      var statementsPanel = lab.panel("Sentencias, en orden de ejecución", statementsList);
      // En la figura, sin el panel de divergencias ni los enlaces (quedan en el laboratorio completo).
      var resultadoPanel = compact ? lab.panel("Resultado explicado", resultado) : lab.panel("Resultado explicado", resultado, diffPanel, enlaces);

      if (compact) {
        body.appendChild(configPanel);
        body.appendChild(statementsPanel);
        body.appendChild(resultadoPanel);
      } else {
        body.appendChild(lab.grid(2, configPanel, builderPanel));
        body.appendChild(statementsPanel);
        body.appendChild(resultadoPanel);
        body.appendChild(lab.panel("Retos", retosPanel));
        body.appendChild(lab.callout("info", "Simplificaciones de esta herramienta",
          h("ul", { class: "lab-grr-diff-list" },
            h("li", {}, "Los usuarios ya existen (no hace falta CREATE USER); el host en MySQL siempre es '%'."),
            h("li", {}, "Solo se modelan SELECT, INSERT, UPDATE y DELETE (los que trae el deck y el TP8), no los nueve del estándar."),
            h("li", {}, "RESTRICT (GMUW 10.1.6, Ej. 10.6) solo rechaza la sentencia si OTRO nodo —al que el objetivo le había pasado el privilegio— quedaría sin camino al dueño; que el propio objetivo pierda su privilegio no cuenta, porque eso pasa en cualquier REVOKE."),
            h("li", {}, "Revocar un privilegio de columna a quien tiene el privilegio de toda la tabla (TP8 ej. 1.b, segundo REVOKE) es un punto abierto en el vault: Práctica 2026-09-08 § 1.b llama a la descomposición \"la respuesta principal\", y 1.11.02 § 6 dice que esa lectura no sale de GMUW y que el grafo sugiere \"no hay nada que revocar\" (lo mismo que hace MySQL: ERROR 1147). El selector permite ver las dos, y el resultado muestra la otra cuando difieren. Al descomponer, \"UPDATE(todas salvo tiempo)\" abrevia las columnas restantes de la tabla."))));
      }

      renderAll();

      return function cleanup() {};
    },
  );
})();
