/* ============================================================
   bdii-lab / aislamiento.js — "Transacciones concurrentes y niveles de
   aislamiento"

   Motor puro: App.bdiiLab.engines["aislamiento"]
     Dos transacciones (T1, T2) ejecutan, en el orden que arma el
     estudiante, una secuencia de pasos sobre una tabla chica ("cuentas":
     id, titular, saldo). Cada paso es BEGIN · SELECT (de una fila, de un
     rango, o FOR UPDATE) · UPDATE (valor fijo, o relativo a lo último que
     esa transacción leyó — el patrón "la app lee y después escribe") ·
     INSERT · COMMIT · ROLLBACK.

     Dos semánticas:
       - "estandar": locking clásico (GMUW 18.3–18.4, el slide 25 de la
         Clase 11). S/X con matriz de compatibilidad; READ COMMITTED
         libera el S al terminar la sentencia, REPEATABLE READ y
         SERIALIZABLE lo retienen hasta el commit; SERIALIZABLE además
         toma un lock de RANGO sobre el predicado (evita phantoms
         bloqueando el INSERT ajeno). Nunca hay lectura sucia salvo en
         READ UNCOMMITTED, que no toma ningún lock de lectura.
       - "mysql": MVCC de InnoDB. Una lectura SIMPLE (sin FOR UPDATE)
         nunca toma lock —salvo en SERIALIZABLE, donde se promueve a una
         lectura con bloqueo compartido—; ve una instantánea distinta según
         el nivel: READ UNCOMMITTED ve lo no confirmado de la otra
         transacción, READ COMMITTED relee el commit vigente en cada
         sentencia, REPEATABLE READ fija su instantánea en la PRIMERA
         lectura de la transacción (de ahí que ni el non-repeatable read
         ni el phantom se vean con lecturas simples bajo RR, aunque el
         estándar diga que sí). SELECT ... FOR UPDATE y las escrituras
         siempre leen el valor CONFIRMADO más reciente ("current read") y
         toman bloqueo exclusivo, esperando si otra transacción sin
         confirmar ya lo tiene; bajo REPEATABLE READ/SERIALIZABLE una
         lectura CON bloqueo sobre un rango también evita el INSERT ajeno
         que caería adentro (gap lock, simplificado a un lock de rango).
     Deadlocks: se detectan cuando dos transacciones de dos se esperan en
     círculo (simplificación válida solo para 2 transacciones) y se aborta
     una. InnoDB (manual § 17.7.5.2) prefiere abortar la transacción "más
     chica"; esta herramienta lo APROXIMA contando cuántos UPDATE/INSERT
     aplicó cada una (empate: la que pide el lock en ese momento). Es una
     aproximación, no una réplica exacta: InnoDB pesa también las
     estructuras de lock tomadas, y verificado contra MySQL 9.7.2 hay casos
     de conteo desparejo donde el motor real elige la víctima contraria a
     la que predice este conteo. Se aplica igual en semántica "estandar",
     como simplificación didáctica declarada.

   Fuentes del vault (ver `sources` del tool() más abajo): 1.11.03, 1.11.04
   (anomalías, mecanismos, niveles SQL-92, InnoDB real), Clase 11 slides
   21–30, Repaso Final BD 2 § Bloque 3, Final 1Dic2025 pregunta 3.
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

  var NIVELES = ["read-uncommitted", "read-committed", "repeatable-read", "serializable"];
  var NIVEL_LABEL = {
    "read-uncommitted": "READ UNCOMMITTED",
    "read-committed": "READ COMMITTED",
    "repeatable-read": "REPEATABLE READ",
    "serializable": "SERIALIZABLE",
  };

  function otherTx(tx) { return tx === "T1" ? "T2" : "T1"; }

  function cloneRow(r) { return r ? { id: r.id, titular: r.titular, saldo: r.saldo } : r; }
  function cloneRowMap(map) {
    var out = {};
    Object.keys(map).forEach(function (k) { out[k] = cloneRow(map[k]); });
    return out;
  }

  // ---------- estado de la simulación ----------

  function crearEstado(filasIniciales) {
    var committed = {};
    filasIniciales.forEach(function (r) { committed[r.id] = cloneRow(r); });
    return {
      committed: committed, // id -> fila (verdad confirmada)
      pendientes: { T1: {}, T2: {} }, // id -> fila (escrituras sin commit de cada tx)
      snapshotRR: { T1: null, T2: null }, // instantánea tomada en la primera lectura simple bajo RR (mysql)
      rowLocks: {}, // id -> { S: [tx,...], X: tx|null }
      rangeLocks: [], // { tx, campo, comp, valor } — activos hasta el commit/rollback del dueño
      estadoTx: { T1: "no-iniciada", T2: "no-iniciada" },
      lastRead: { T1: {}, T2: {} }, // id -> último valor de saldo leído por una lectura SIMPLE (o FOR UPDATE) de esa tx
      lecturasFila: { T1: {}, T2: {} }, // id -> [{valor, paso}], solo lecturas simples (no FOR UPDATE)
      lecturasRango: { T1: [], T2: [] }, // [{campo,comp,valor,ids:[...],paso}], solo lecturas simples
      bloqueado: { T1: null, T2: null }, // { paso, op, esperando } cuando la tx está esperando un lock
      colaBloqueada: { T1: [], T2: [] }, // pasos encolados detrás del bloqueo (misma tx no puede emitir el siguiente)
      escrituras: { T1: 0, T2: 0 }, // cuenta de UPDATE/INSERT aplicados (para elegir víctima de deadlock)
    };
  }

  // ---------- bloqueos ----------

  function lockDe(state, id) {
    if (!state.rowLocks[id]) state.rowLocks[id] = { S: [], X: null };
    return state.rowLocks[id];
  }

  /** Intenta tomar un lock de fila. Devuelve {ok:true} o {ok:false, heldBy:tx}. */
  function intentarLockFila(state, tx, id, modo) {
    var L = lockDe(state, id);
    if (modo === "X") {
      if (L.X && L.X !== tx) return { ok: false, heldBy: L.X };
      var otrosS = L.S.filter(function (t) { return t !== tx; });
      if (otrosS.length) return { ok: false, heldBy: otrosS[0] };
      L.X = tx;
      return { ok: true };
    }
    // S
    if (L.X && L.X !== tx) return { ok: false, heldBy: L.X };
    if (L.S.indexOf(tx) === -1) L.S.push(tx);
    return { ok: true };
  }

  function liberarLocksDeStmt(state, tx, ids) {
    // libera solo los S que esta tx tiene sobre `ids` (no toca X propios)
    ids.forEach(function (id) {
      var L = lockDe(state, id);
      if (L.X !== tx) L.S = L.S.filter(function (t) { return t !== tx; });
    });
  }

  function liberarTodosLosLocks(state, tx) {
    Object.keys(state.rowLocks).forEach(function (id) {
      var L = state.rowLocks[id];
      L.S = L.S.filter(function (t) { return t !== tx; });
      if (L.X === tx) L.X = null;
    });
    state.rangeLocks = state.rangeLocks.filter(function (rl) { return rl.tx !== tx; });
  }

  // ---------- predicados de rango ----------

  function cumple(fila, campo, comp, valor) {
    var v = fila[campo];
    if (comp === ">") return v > valor;
    if (comp === "<") return v < valor;
    if (comp === ">=") return v >= valor;
    if (comp === "<=") return v <= valor;
    return v === valor; // "="
  }

  function predicadoLabel(campo, comp, valor) { return campo + " " + comp + " " + valor; }

  /**
   * ¿Bloquea `rl` un INSERT de `fila`? `all: true` = escaneo completo sin índice
   * (todas las filas y todos los huecos). `gap: true` = el hueco real del índice de
   * la clave primaria entre la clave anterior y la siguiente a una clave buscada que
   * no existía (`low`/`high` en null = ínfimo/supremo): solo bloquea los INSERT
   * cuya clave cae adentro de ese intervalo abierto. Si no, lock de predicado.
   */
  function rangeLockBloquea(rl, fila) {
    if (rl.all) return true;
    if (rl.gap) {
      var k = String(fila.id);
      return (rl.low === null || k > rl.low) && (rl.high === null || k < rl.high);
    }
    return cumple(fila, rl.campo, rl.comp, rl.valor);
  }

  /**
   * Hueco del índice de la clave primaria alrededor de `id` (que no existe): la
   * clave existente inmediatamente anterior y la inmediatamente siguiente. El
   * índice contiene también los registros sin confirmar de las dos transacciones.
   * Orden: el de las claves como texto (id es VARCHAR en la tabla "cuentas").
   */
  function gapAlrededor(state, id) {
    var claves = {};
    [state.committed, state.pendientes.T1, state.pendientes.T2].forEach(function (m) {
      Object.keys(m).forEach(function (k) { claves[k] = true; });
    });
    var low = null, high = null;
    Object.keys(claves).forEach(function (k) {
      if (k < id && (low === null || k > low)) low = k;
      if (k > id && (high === null || k < high)) high = k;
    });
    return { low: low, high: high };
  }

  /**
   * Lock que protege una búsqueda por clave de una fila que NO existe (para que
   * nadie la inserte). MySQL/InnoDB: el gap lock sobre el hueco real (verificado en
   * MySQL 9.7.2, REPEATABLE READ: SELECT … WHERE id='9' FOR UPDATE con claves 1–3
   * bloquea el INSERT de '5' y de '9', no el de '0'). Estándar: lock de predicado
   * sobre id = clave.
   */
  function lockClaveInexistente(state, tx, modo, id) {
    if (modo !== "mysql") return { tx: tx, campo: "id", comp: "=", valor: id };
    var g = gapAlrededor(state, id);
    return {
      tx: tx, gap: true, low: g.low, high: g.high,
      motivo: "gap (" + (g.low === null ? "ínfimo" : "'" + g.low + "'") + ", " + (g.high === null ? "supremo" : "'" + g.high + "'") +
        ") alrededor de la fila " + id + ", que no existía",
    };
  }

  /**
   * ¿Necesita esta lectura CON bloqueo (FOR UPDATE, o lectura simple promovida en
   * SERIALIZABLE) protección de tipo gap contra un INSERT ajeno? Estándar: solo
   * SERIALIZABLE toma el lock de rango del slide 25. MySQL/InnoDB: FOR UPDATE toma
   * gap locks en REPEATABLE READ y SERIALIZABLE (manual § 17.7.1); una lectura
   * simple recién se promueve a bloqueo en SERIALIZABLE.
   */
  function necesitaGapProteccion(modo, nivel, forUpdate) {
    if (modo === "estandar") return nivel === "serializable";
    if (forUpdate) return nivel === "repeatable-read" || nivel === "serializable";
    return nivel === "serializable";
  }

  // ---------- vistas de lectura ----------

  /** Devuelve {vista, sucia} con lo que vería `tx` en una lectura SIMPLE (sin FOR UPDATE). */
  function vistaLecturaSimple(state, tx, modo, nivel) {
    var base;
    if (modo === "mysql" && nivel === "repeatable-read") {
      if (!state.snapshotRR[tx]) state.snapshotRR[tx] = cloneRowMap(state.committed);
      base = state.snapshotRR[tx];
    } else {
      base = state.committed; // estandar (el S evita ver algo no confirmado) · mysql RC/RU (confirmado al instante)
    }
    var vista = cloneRowMap(base);
    Object.keys(state.pendientes[tx]).forEach(function (id) { vista[id] = state.pendientes[tx][id]; });
    var esSucia = false;
    if (nivel === "read-uncommitted") {
      var otro = otherTx(tx);
      Object.keys(state.pendientes[otro]).forEach(function (id) {
        if (state.pendientes[tx][id] === undefined) { vista[id] = state.pendientes[otro][id]; esSucia = true; }
      });
    }
    return { vista: vista, sucia: esSucia };
  }

  /** Vista de "lectura actual" (current read): la que usan FOR UPDATE y las escrituras. Siempre confirmada + propia, nunca la instantánea RR. */
  function vistaLecturaActual(state, tx) {
    var vista = cloneRowMap(state.committed);
    Object.keys(state.pendientes[tx]).forEach(function (id) { vista[id] = state.pendientes[tx][id]; });
    return vista;
  }

  function politicaLecturaSimple(modo, nivel) {
    if (modo === "estandar") {
      if (nivel === "read-uncommitted") return { lock: null };
      if (nivel === "read-committed") return { lock: "S", liberaAlTerminarStmt: true, rango: false };
      if (nivel === "repeatable-read") return { lock: "S", liberaAlTerminarStmt: false, rango: false };
      return { lock: "S", liberaAlTerminarStmt: false, rango: true }; // serializable
    }
    // mysql: la snapshot MVCC alcanza para RU/RC/RR sin ningún lock; SERIALIZABLE
    // promueve la lectura simple a una lectura con bloqueo compartido.
    if (nivel === "serializable") return { lock: "S", liberaAlTerminarStmt: false, rango: true };
    return { lock: null };
  }

  // ---------- ejecutar un paso ----------

  function ejecutarSelect(state, tx, modo, nivel, op, paso) {
    var forUpdate = !!op.forUpdate;
    var esRango = op.scope === "rango";
    var otro = otherTx(tx);

    if (forUpdate) {
      // lectura CON bloqueo exclusivo (SELECT ... FOR UPDATE): siempre "current read".
      var vistaPrevia = vistaLecturaActual(state, tx);
      var idsObjetivo;
      var claveFila = String(op.id);
      if (esRango) {
        // Sin índice en `saldo`: bajo semántica MySQL, un escaneo real recorre (y
        // bloquea) TODA la tabla, no solo las filas que cumplen el predicado. El
        // estándar bloquea únicamente el predicado (lock de rango abstracto).
        idsObjetivo = modo === "mysql"
          ? Object.keys(vistaPrevia)
          : Object.keys(vistaPrevia).filter(function (id) { return cumple(vistaPrevia[id], op.campo, op.comp, op.valor); });
      } else if (vistaPrevia[claveFila] || state.pendientes[otro][claveFila]) {
        // La fila existe (o la otra transacción la insertó sin confirmar: su
        // registro ya está en el índice y el lock implícito hace esperar).
        idsObjetivo = [claveFila];
      } else {
        // Clave inexistente: no hay registro que bloquear. InnoDB no toma lock de
        // fila (verificado en MySQL 9.7.2 READ COMMITTED: el INSERT ajeno de esa
        // clave pasa al instante); en RR/SERIALIZABLE queda solo el gap lock.
        idsObjetivo = [];
      }
      // READ COMMITTED / READ UNCOMMITTED en InnoDB: el escaneo bloquea cada fila
      // para evaluarla (y espera si otra transacción la tiene), pero suelta enseguida
      // las que NO cumplen el WHERE (manual § 17.7.2.1). Verificado en MySQL 9.7.2
      // (RC): con T1 en SELECT … WHERE saldo > 150 FOR UPDATE, el UPDATE ajeno de la
      // fila 1 (saldo 100) pasa al instante y el de la fila 3 (saldo 200) espera; y
      // si la otra transacción ya tenía la fila 1, el SELECT … FOR UPDATE espera.
      var sueltaNoCumplen = esRango && modo === "mysql" && (nivel === "read-committed" || nivel === "read-uncommitted");
      for (var i = 0; i < idsObjetivo.length; i++) {
        var idObj = idsObjetivo[i];
        var yaTeniaX = lockDe(state, idObj).X === tx;
        var r = intentarLockFila(state, tx, idObj, "X");
        if (!r.ok) return { status: "esperando", esperando: { recurso: "fila " + idObj, modoLock: "X", heldBy: r.heldBy } };
        if (sueltaNoCumplen && !yaTeniaX && !state.pendientes[tx][idObj] && !cumple(vistaPrevia[idObj], op.campo, op.comp, op.valor)) {
          lockDe(state, idObj).X = null;
        }
      }
      if (necesitaGapProteccion(modo, nivel, true)) {
        if (esRango) {
          state.rangeLocks.push(modo === "mysql"
            ? { tx: tx, all: true, motivo: "escaneo completo (sin índice en saldo)" }
            : { tx: tx, campo: op.campo, comp: op.comp, valor: op.valor });
        } else if (!idsObjetivo.length) {
          // gap lock: protege contra el INSERT ajeno en el hueco de la fila buscada que no existía.
          state.rangeLocks.push(lockClaveInexistente(state, tx, modo, claveFila));
        }
      }
      var vistaFinal = vistaLecturaActual(state, tx);
      var valores;
      if (esRango) {
        var idsMatch = Object.keys(vistaFinal).filter(function (id) { return cumple(vistaFinal[id], op.campo, op.comp, op.valor); });
        valores = idsMatch.map(function (id) { return cloneRow(vistaFinal[id]); });
        valores.forEach(function (f) { state.lastRead[tx][f.id] = f.saldo; });
      } else {
        var f2 = vistaFinal[op.id];
        valores = f2 ? [cloneRow(f2)] : [];
        if (f2) state.lastRead[tx][op.id] = f2.saldo;
      }
      return { status: "ok", tipo: "select", forUpdate: true, scope: op.scope, filas: valores, sucia: false, currentRead: true };
    }

    // lectura SIMPLE (sin bloqueo salvo estandar RC/RR/SERIALIZABLE y mysql SERIALIZABLE)
    var pendienteAjena = esRango
      ? Object.keys(state.pendientes[otro]).some(function (id) { return cumple(state.pendientes[otro][id], op.campo, op.comp, op.valor); })
      : state.pendientes[otro][op.id] !== undefined;

    var pol = politicaLecturaSimple(modo, nivel);
    var idsParaLock = [];
    var vistaComprometida = cloneRowMap(state.committed);
    if (pol.lock === "S") {
      if (esRango) {
        // Sin índice en `saldo`: bajo semántica MySQL, la promoción a SELECT ...
        // FOR SHARE de SERIALIZABLE escanea (y bloquea) TODA la tabla.
        idsParaLock = modo === "mysql"
          ? Object.keys(vistaComprometida)
          : Object.keys(vistaComprometida).filter(function (id) { return cumple(vistaComprometida[id], op.campo, op.comp, op.valor); });
      } else if (vistaComprometida[String(op.id)] || state.pendientes[tx][String(op.id)] || state.pendientes[otro][String(op.id)]) {
        idsParaLock = [String(op.id)];
      } else {
        idsParaLock = []; // clave inexistente: sin lock de fila (el hueco lo cubre el lock de rango de abajo, si corresponde)
      }
      for (var j = 0; j < idsParaLock.length; j++) {
        var r2 = intentarLockFila(state, tx, idsParaLock[j], "S");
        if (!r2.ok) return { status: "esperando", esperando: { recurso: "fila " + idsParaLock[j], modoLock: "S", heldBy: r2.heldBy } };
      }
      if (pol.rango) {
        if (esRango) {
          state.rangeLocks.push(modo === "mysql"
            ? { tx: tx, all: true, motivo: "escaneo completo (sin índice en saldo)" }
            : { tx: tx, campo: op.campo, comp: op.comp, valor: op.valor });
        } else if (!idsParaLock.length) {
          state.rangeLocks.push(lockClaveInexistente(state, tx, modo, String(op.id)));
        }
      }
    }

    var res = vistaLecturaSimple(state, tx, modo, nivel);
    var vista2 = res.vista;
    var valores2, sucia = res.sucia;
    if (esRango) {
      var idsMatch2 = Object.keys(vista2).filter(function (id) { return cumple(vista2[id], op.campo, op.comp, op.valor); });
      valores2 = idsMatch2.map(function (id) { return cloneRow(vista2[id]); });
      valores2.forEach(function (f) { state.lastRead[tx][f.id] = f.saldo; });
      state.lecturasRango[tx].push({ campo: op.campo, comp: op.comp, valor: op.valor, ids: idsMatch2.slice().sort(), paso: paso, sucia: sucia });
    } else {
      var f3 = vista2[op.id];
      valores2 = f3 ? [cloneRow(f3)] : [];
      if (f3) {
        state.lastRead[tx][op.id] = f3.saldo;
        state.lecturasFila[tx][op.id] = state.lecturasFila[tx][op.id] || [];
        state.lecturasFila[tx][op.id].push({ valor: f3.saldo, paso: paso, sucia: sucia });
      }
    }

    if (pol.lock === "S" && pol.liberaAlTerminarStmt) liberarLocksDeStmt(state, tx, idsParaLock);

    return { status: "ok", tipo: "select", forUpdate: false, scope: op.scope, filas: valores2, sucia: sucia, pendienteAjenaEnLectura: pendienteAjena, currentRead: false };
  }

  function ejecutarUpdate(state, tx, modo, nivel, op) {
    var id = String(op.id);

    // El UPDATE siempre intenta el lock primero (como una búsqueda por clave real):
    // si otra transacción tiene un INSERT pendiente sobre este id, se espera a que
    // termine antes de decidir si la fila existe o no.
    var r = intentarLockFila(state, tx, id, "X");
    if (!r.ok) return { status: "esperando", esperando: { recurso: "fila " + id, modoLock: "X", heldBy: r.heldBy } };

    var vistaActual = vistaLecturaActual(state, tx);
    var filaActual = vistaActual[id];
    if (!filaActual) return { status: "ok", tipo: "update", afectadas: 0, mensaje: "0 filas afectadas: no existe la fila " + id + "." };
    var valorAlEscribir = filaActual.saldo;
    var huboLectura = Object.prototype.hasOwnProperty.call(state.lastRead[tx], id);
    var valorLeido = huboLectura ? state.lastRead[tx][id] : null;

    var nuevoValor = op.modo === "fijo" ? op.valor : (huboLectura ? valorLeido : valorAlEscribir) + op.delta;
    var pisaCambioAjeno = huboLectura && valorLeido !== valorAlEscribir;

    var nuevaFila = { id: filaActual.id, titular: filaActual.titular, saldo: nuevoValor };
    state.pendientes[tx][id] = nuevaFila;
    state.escrituras[tx]++;
    state.lastRead[tx][id] = nuevoValor; // la propia tx ya "sabe" lo que escribió

    return {
      status: "ok", tipo: "update", afectadas: 1, id: id,
      valorAnterior: valorAlEscribir, valorNuevo: nuevoValor,
      huboLectura: huboLectura, valorLeido: valorLeido, pisaCambioAjeno: pisaCambioAjeno,
    };
  }

  function ejecutarInsert(state, tx, op) {
    var id = String(op.id);
    var otro = otherTx(tx);
    var nuevaFila = { id: id, titular: op.titular, saldo: op.saldo };

    // 1. ¿Algún gap/rango ajeno protege esta clave (SERIALIZABLE, o un FOR UPDATE con gap)?
    var bloqueanteRango = state.rangeLocks.filter(function (rl) { return rl.tx === otro && rangeLockBloquea(rl, nuevaFila); })[0];
    if (bloqueanteRango) {
      return {
        status: "esperando",
        esperando: { recurso: "rango (" + (bloqueanteRango.motivo || predicadoLabel(bloqueanteRango.campo, bloqueanteRango.comp, bloqueanteRango.valor)) + ")", modoLock: "insert-intention", heldBy: otro },
      };
    }

    // 2. ¿La clave primaria está tomada por un X ajeno? Un INSERT pendiente y sin
    //    confirmar de la otra transacción es invisible, pero SIGUE bloqueando: el
    //    chequeo de clave duplicada de InnoDB toma un lock sobre ese registro y
    //    espera (manual § 17.7.1), no falla al instante.
    var L = lockDe(state, id);
    if (L.X && L.X !== tx) {
      return { status: "esperando", esperando: { recurso: "fila " + id + " (verificación de clave duplicada)", modoLock: "S", heldBy: L.X } };
    }

    // 3. Sin conflicto de lock: si la fila ya existe de verdad (confirmada, o propia
    //    pendiente), es un error de clave duplicada inmediato, sin esperar nada.
    if (state.committed[id] || state.pendientes[tx][id]) {
      return { status: "ok", tipo: "insert", ok: false, mensaje: "ERROR 1062 (23000): entrada duplicada '" + id + "' para la clave PRIMARY." };
    }

    intentarLockFila(state, tx, id, "X");
    state.pendientes[tx][id] = nuevaFila;
    state.escrituras[tx]++;
    return { status: "ok", tipo: "insert", ok: true, fila: cloneRow(nuevaFila) };
  }

  function attemptOp(state, tx, modo, nivel, op, paso) {
    if (op.type === "BEGIN") {
      if (state.estadoTx[tx] === "confirmada" || state.estadoTx[tx] === "abortada") {
        // Nueva transacción en la misma "sesión": MySQL sí admite abrir una
        // transacción nueva después de terminar la anterior, así que arranca con
        // su propia historia de lecturas (no arrastra lo que leyó/escribió antes).
        state.lastRead[tx] = {};
        state.lecturasFila[tx] = {};
        state.lecturasRango[tx] = [];
        state.escrituras[tx] = 0;
      }
      state.estadoTx[tx] = "activa";
      return { status: "ok", tipo: "begin" };
    }
    if (state.estadoTx[tx] === "no-iniciada") state.estadoTx[tx] = "activa"; // autocomienzo defensivo

    if (op.type === "SELECT") return ejecutarSelect(state, tx, modo, nivel, op, paso);
    if (op.type === "UPDATE") return ejecutarUpdate(state, tx, modo, nivel, op);
    if (op.type === "INSERT") return ejecutarInsert(state, tx, op);
    if (op.type === "COMMIT") return { status: "ok", tipo: "commit" };
    if (op.type === "ROLLBACK") return { status: "ok", tipo: "rollback" };
    return { status: "ok", tipo: "desconocido" };
  }

  // ---------- simulación completa (con espera, resolución y deadlocks) ----------

  function elegirVictima(state, tx, otro) {
    // Aproximación al criterio de InnoDB (manual 9.7 § 17.7.5.2: "InnoDB tries to
    // pick small transactions to roll back, where the size of a transaction is
    // determined by the number of rows inserted, updated, or deleted"). Esta
    // herramienta mide "tamaño" contando UPDATE/INSERT aplicados, más simple que
    // lo que InnoDB pesa de verdad (entradas de undo + estructuras de lock
    // tomadas): verificado contra MySQL 9.7.2, un caso con conteos de escritura
    // desparejos (una transacción con 1 escritura contra otra con 0) el motor real
    // abortó igual la que esta cuenta tiene MÁS escrituras — la aproximación no
    // es exacta en todos los casos, solo una guía didáctica. Empate: pierde quien
    // pide el lock ahora (tx) — se aplica igual en semántica "estandar" como
    // simplificación declarada.
    if (state.escrituras[tx] < state.escrituras[otro]) return tx;
    if (state.escrituras[otro] < state.escrituras[tx]) return otro;
    return tx;
  }

  var modoGlobal, nivelGlobal; // por simplicidad, closure de la corrida en curso

  function abortarPorDeadlock(state, victima, resultados) {
    state.pendientes[victima] = {};
    state.estadoTx[victima] = "abortada";
    liberarTodosLosLocks(state, victima);
    state.snapshotRR[victima] = null;
    if (state.bloqueado[victima]) {
      resultados[state.bloqueado[victima].paso].status = "abortada-deadlock";
      resultados[state.bloqueado[victima].paso].deadlock = { victima: victima, nota: "Abortada por deadlock: esta herramienta la eligió como víctima por contar menos escrituras aplicadas (aproximación al criterio de InnoDB, no siempre exacta — ver \"Simplificaciones\")." };
      state.bloqueado[victima] = null;
    }
    state.colaBloqueada[victima].forEach(function (item) {
      resultados[item.paso] = resultados[item.paso] || { tx: victima, op: item.op };
      resultados[item.paso].status = "no-ejecuta";
      resultados[item.paso].mensaje = "No se ejecuta: la transacción ya fue abortada por deadlock.";
    });
    state.colaBloqueada[victima] = [];
  }

  function resolverBloqueado(state, tx, pasoActual, resultados, modo, nivel) {
    while (state.bloqueado[tx]) {
      var info = state.bloqueado[tx];
      state.bloqueado[tx] = null;
      var res = attemptOp(state, tx, modo, nivel, info.op, info.paso);
      res.tx = tx; res.op = info.op;
      if (res.status === "esperando") {
        state.bloqueado[tx] = { paso: info.paso, op: info.op, esperando: res.esperando };
        resultados[info.paso] = res;
        return;
      }
      res.resueltoEn = pasoActual;
      resultados[info.paso] = res;
      if (res.tipo === "commit" || res.tipo === "rollback") { finalizarTx(state, tx, res.tipo, info.paso, resultados); return; }
      if (!state.colaBloqueada[tx].length) return;
      var next = state.colaBloqueada[tx].shift();
      var res2 = attemptOp(state, tx, modo, nivel, next.op, next.paso);
      res2.tx = tx; res2.op = next.op;
      if (res2.status === "esperando") {
        state.bloqueado[tx] = { paso: next.paso, op: next.op, esperando: res2.esperando };
        resultados[next.paso] = res2;
        return;
      }
      res2.resueltoEn = pasoActual;
      resultados[next.paso] = res2;
      if (res2.tipo === "commit" || res2.tipo === "rollback") { finalizarTx(state, tx, res2.tipo, next.paso, resultados); return; }
      // sigue el while: puede haber más pasos encolados
    }
  }

  function finalizarTx(state, tx, tipo, paso, resultados) {
    if (tipo === "commit") {
      Object.keys(state.pendientes[tx]).forEach(function (id) { state.committed[id] = state.pendientes[tx][id]; });
      state.pendientes[tx] = {};
      state.estadoTx[tx] = "confirmada";
    } else {
      state.pendientes[tx] = {};
      state.estadoTx[tx] = "abortada";
    }
    liberarTodosLosLocks(state, tx);
    state.snapshotRR[tx] = null;
    resolverBloqueado(state, otherTx(tx), paso, resultados, modoGlobal, nivelGlobal);
  }

  function detectarYResolverDeadlock(state, tx, otro, resultados) {
    var b = state.bloqueado[otro];
    if (!b) return false;
    if (b.esperando.heldBy !== tx) return false; // no hay ciclo: `otro` no está esperando algo que tiene `tx`
    var victima = elegirVictima(state, tx, otro);
    var sobreviviente = victima === tx ? otro : tx;
    abortarPorDeadlock(state, victima, resultados);
    // Liberar los locks de la víctima puede haber destrabado al sobreviviente,
    // sea que ya estuviera esperando desde antes o que su pedido recién ahora
    // haya quedado libre.
    resolverBloqueado(state, sobreviviente, state.__pasoActual, resultados, modoGlobal, nivelGlobal);
    return true;
  }

  function fotografiarLocks(state) {
    var rowLocks = {};
    Object.keys(state.rowLocks).forEach(function (id) {
      var L = state.rowLocks[id];
      if (L.X || L.S.length) rowLocks[id] = { S: L.S.slice(), X: L.X };
    });
    return {
      rowLocks: rowLocks,
      rangeLocks: state.rangeLocks.map(function (rl) {
        if (rl.all) return { tx: rl.tx, all: true, motivo: rl.motivo };
        if (rl.gap) return { tx: rl.tx, gap: true, low: rl.low, high: rl.high, motivo: rl.motivo };
        return { tx: rl.tx, campo: rl.campo, comp: rl.comp, valor: rl.valor };
      }),
    };
  }

  function fotografiar(state) {
    return {
      committed: cloneRowMap(state.committed),
      pendientes: { T1: cloneRowMap(state.pendientes.T1), T2: cloneRowMap(state.pendientes.T2) },
      estadoTx: { T1: state.estadoTx.T1, T2: state.estadoTx.T2 },
      bloqueado: { T1: state.bloqueado.T1 ? Object.assign({}, state.bloqueado.T1) : null, T2: state.bloqueado.T2 ? Object.assign({}, state.bloqueado.T2) : null },
      locks: fotografiarLocks(state),
    };
  }

  /**
   * @param {{nivel:string, modo:'estandar'|'mysql', filas:Array, pasos:Array}} config
   * `pasos`: [{tx:'T1'|'T2', op:{type,...}}]. Ver los presets más abajo para la forma de `op`.
   */
  function simular(config) {
    var state = crearEstado(config.filas);
    var modo = config.modo, nivel = config.nivel;
    modoGlobal = modo; nivelGlobal = nivel;
    var resultados = [];
    var snapshots = [fotografiar(state)]; // snapshots[0] = estado inicial, antes del paso 0

    config.pasos.forEach(function (step, i) {
      state.__pasoActual = i;
      (function procesarPaso() {
        var tx = step.tx;
        if (step.op.type !== "BEGIN" && (state.estadoTx[tx] === "confirmada" || state.estadoTx[tx] === "abortada")) {
          resultados[i] = { status: "no-ejecuta", tx: tx, op: step.op, mensaje: "No se ejecuta: " + tx + " ya terminó (" + state.estadoTx[tx] + ")." };
          return;
        }
        if (state.bloqueado[tx]) {
          state.colaBloqueada[tx].push({ paso: i, op: step.op });
          resultados[i] = { status: "esperando", tx: tx, op: step.op, encolado: true, mensaje: tx + " sigue esperando desde el paso " + (state.bloqueado[tx].paso + 1) + ": este paso todavía no se emite." };
          return;
        }
        var res = attemptOp(state, tx, modo, nivel, step.op, i);
        res.tx = tx; res.op = step.op;
        resultados[i] = res;
        if (res.status === "esperando") {
          var otro = otherTx(tx);
          if (res.esperando.heldBy === otro) {
            state.bloqueado[tx] = { paso: i, op: step.op, esperando: res.esperando };
            detectarYResolverDeadlock(state, tx, otro, resultados);
          }
          return;
        }
        if (res.tipo === "commit" || res.tipo === "rollback") finalizarTx(state, tx, res.tipo, i, resultados);
      })();
      snapshots.push(fotografiar(state));
    });

    return { resultados: resultados, estadoFinal: cloneRowMap(state.committed), state: state, snapshots: snapshots };
  }

  // ---------- diagnóstico: ¿qué anomalías ocurrieron / pudieron ocurrir? ----------

  function diagnosticar(out) {
    var resultados = out.resultados, state = out.state;
    var d = {
      dirtyRead: { oportunidad: false, ocurrio: false, detalle: [] },
      nonRepeatableRead: { oportunidad: false, ocurrio: false, detalle: [] },
      phantomRead: { oportunidad: false, ocurrio: false, detalle: [] },
      lostUpdate: { oportunidad: false, ocurrio: false, detalle: [] },
    };

    resultados.forEach(function (r, i) {
      if (!r || r.tipo !== "select" || r.forUpdate) return;
      if (r.sucia) {
        d.dirtyRead.ocurrio = true; d.dirtyRead.oportunidad = true;
        d.dirtyRead.detalle.push("Paso " + (i + 1) + " (" + r.tx + "): leyó un valor escrito por " + otherTx(r.tx) + " sin confirmar.");
      } else if (r.pendienteAjenaEnLectura) {
        // Hubo una escritura ajena sin confirmar en el momento de leer, pero no se
        // vio: instantánea (MVCC) o bloqueo la evitaron. Es "no ocurrió", no "sin
        // oportunidad" — es exactamente el caso que esta herramienta quiere mostrar.
        d.dirtyRead.oportunidad = true;
        d.dirtyRead.detalle.push("Paso " + (i + 1) + " (" + r.tx + "): leyó mientras " + otherTx(r.tx) + " tenía una escritura sin confirmar sobre la misma fila, pero no la vio.");
      } else if (r.resueltoEn !== undefined) {
        d.dirtyRead.oportunidad = true;
        d.dirtyRead.detalle.push("Paso " + (i + 1) + " (" + r.tx + "): tuvo que esperar (se liberó en el paso " + (r.resueltoEn + 1) + ") en vez de leer sucio.");
      }
    });

    ["T1", "T2"].forEach(function (tx) {
      Object.keys(state.lecturasFila[tx]).forEach(function (id) {
        var entries = state.lecturasFila[tx][id];
        if (entries.length < 2) return;
        d.nonRepeatableRead.oportunidad = true;
        for (var i = 1; i < entries.length; i++) {
          if (entries[i].valor !== entries[i - 1].valor) {
            d.nonRepeatableRead.ocurrio = true;
            d.nonRepeatableRead.detalle.push(tx + " leyó la fila " + id + ": " + entries[i - 1].valor + " (paso " + (entries[i - 1].paso + 1) + ") y después " + entries[i].valor + " (paso " + (entries[i].paso + 1) + ").");
          }
        }
      });
      var porPredicado = {};
      state.lecturasRango[tx].forEach(function (lr) {
        var key = lr.campo + lr.comp + lr.valor;
        (porPredicado[key] = porPredicado[key] || []).push(lr);
      });
      Object.keys(porPredicado).forEach(function (key) {
        var entries = porPredicado[key];
        if (entries.length < 2) return;
        d.phantomRead.oportunidad = true;
        for (var j = 1; j < entries.length; j++) {
          var a = entries[j - 1].ids.join(","), b = entries[j].ids.join(",");
          if (a !== b) {
            d.phantomRead.ocurrio = true;
            d.phantomRead.detalle.push(tx + " leyó " + entries[j - 1].campo + " " + entries[j - 1].comp + " " + entries[j - 1].valor +
              ": {" + a + "} (paso " + (entries[j - 1].paso + 1) + ") y después {" + b + "} (paso " + (entries[j].paso + 1) + ").");
          }
        }
      });
    });

    // Oportunidad de lost update: ambas transacciones LEYERON la misma fila con una
    // lectura simple, sin importar si las dos llegaron a confirmar su UPDATE (un
    // deadlock puede haber abortado a una antes de pisar el cambio de la otra, y
    // eso también es "hubo oportunidad, no ocurrió", no "sin oportunidad").
    var idsLeidosPorAmbas = {};
    ["T1", "T2"].forEach(function (tx) {
      Object.keys(state.lecturasFila[tx]).forEach(function (id) {
        (idsLeidosPorAmbas[id] = idsLeidosPorAmbas[id] || {})[tx] = true;
      });
    });
    Object.keys(idsLeidosPorAmbas).forEach(function (id) {
      if (idsLeidosPorAmbas[id].T1 && idsLeidosPorAmbas[id].T2) d.lostUpdate.oportunidad = true;
    });

    var porFila = {};
    resultados.forEach(function (r, i) {
      if (!r || r.tipo !== "update" || r.afectadas !== 1 || !r.huboLectura) return;
      (porFila[r.id] = porFila[r.id] || []).push({ tx: r.tx, paso: i, r: r });
    });
    Object.keys(porFila).forEach(function (id) {
      var writers = porFila[id];
      var txs = {}; writers.forEach(function (w) { txs[w.tx] = true; });
      if (Object.keys(txs).length >= 2) d.lostUpdate.oportunidad = true;
      writers.forEach(function (w) {
        if (w.r.pisaCambioAjeno && state.estadoTx[w.tx] === "confirmada") {
          d.lostUpdate.ocurrio = true;
          d.lostUpdate.detalle.push(w.tx + " escribió la fila " + id + " en el paso " + (w.paso + 1) +
            " basándose en " + w.r.valorLeido + ", pero el valor confirmado ya era " + w.r.valorAnterior + ": pisó un cambio ajeno.");
        }
      });
    });
    if (d.lostUpdate.oportunidad && !d.lostUpdate.ocurrio) {
      var victimaTx = state.estadoTx.T1 === "abortada" ? "T1" : (state.estadoTx.T2 === "abortada" ? "T2" : null);
      if (victimaTx) {
        d.lostUpdate.detalle.push("Un deadlock abortó a " + victimaTx + " antes de que pisara el cambio ajeno: la anomalía se evitó, pero por el deadlock, no por el nivel de aislamiento.");
      }
    }

    return d;
  }

  // ---------- tablas de referencia ----------

  var TABLA_ESTANDAR = [
    { nivel: "read-uncommitted", dirty: "permite", noRep: "permite", phantom: "permite" },
    { nivel: "read-committed", dirty: "evita", noRep: "permite", phantom: "permite" },
    { nivel: "repeatable-read", dirty: "evita", noRep: "evita", phantom: "permite" },
    { nivel: "serializable", dirty: "evita", noRep: "evita", phantom: "evita" },
  ];

  var TABLA_INNODB = [
    { nivel: "read-uncommitted", nota: "lectura simple = dirty read real (sin lock, sin instantánea)." },
    { nivel: "read-committed", nota: "lectura simple = instantánea nueva en cada sentencia (nunca sucia; non-repeatable/phantom posibles)." },
    { nivel: "repeatable-read", nota: "lectura simple = instantánea fija desde la primera lectura de la transacción: ni non-repeatable ni phantom se VEN — aunque el escritor no espera y el dato cambia por debajo. Con SELECT … FOR UPDATE (current read) sí se ve lo último, y hay gap locks que evitan el INSERT ajeno." },
    { nivel: "serializable", nota: "autocommit apagado: toda lectura simple se promueve a SELECT … FOR SHARE (bloqueo + gap lock). Se comporta como el SERIALIZABLE del estándar." },
  ];

  App.bdiiLab.engines["aislamiento"] = {
    NIVELES: NIVELES, NIVEL_LABEL: NIVEL_LABEL,
    crearEstado: crearEstado, simular: simular, cumple: cumple, diagnosticar: diagnosticar,
    TABLA_ESTANDAR: TABLA_ESTANDAR, TABLA_INNODB: TABLA_INNODB,
  };

  // ==================================================================
  // Escenarios precargados
  // ==================================================================

  var FILAS_INICIALES = [
    { id: "1", titular: "A", saldo: 100 },
    { id: "2", titular: "B", saldo: 50 },
    { id: "3", titular: "C", saldo: 200 },
  ];

  function op(type, extra) { return Object.assign({ type: type }, extra || {}); }
  function paso(tx, o) { return { tx: tx, op: o }; }

  var PRESETS = [
    {
      id: "dirty-read",
      label: "Dirty read — T2 escribe, T1 lee, T2 deshace",
      origen: "1.11.04 § 2 (definición de dirty read) · Final 1Dic2025, pregunta 3.C",
      pasos: [
        paso("T1", op("BEGIN")),
        paso("T2", op("BEGIN")),
        paso("T2", op("UPDATE", { id: "1", modo: "fijo", valor: 200 })),
        paso("T1", op("SELECT", { scope: "fila", id: "1" })),
        paso("T2", op("ROLLBACK")),
        paso("T1", op("SELECT", { scope: "fila", id: "1" })),
        paso("T1", op("COMMIT")),
      ],
    },
    {
      id: "non-repeatable",
      label: "Non-repeatable read — T1 relee la misma fila",
      origen: "1.11.04 § 6.1, experimento con dos sesiones (adaptado a esta herramienta)",
      pasos: [
        paso("T1", op("BEGIN")),
        paso("T1", op("SELECT", { scope: "fila", id: "2" })),
        paso("T2", op("BEGIN")),
        paso("T2", op("UPDATE", { id: "2", modo: "fijo", valor: 80 })),
        paso("T2", op("COMMIT")),
        paso("T1", op("SELECT", { scope: "fila", id: "2" })),
        paso("T1", op("COMMIT")),
      ],
    },
    {
      id: "phantom",
      label: "Phantom read — T2 inserta una fila que cumple el rango",
      origen: "1.11.04 § 2, slide 24 (el COUNT que cambia entre dos lecturas)",
      pasos: [
        paso("T1", op("BEGIN")),
        paso("T1", op("SELECT", { scope: "rango", campo: "saldo", comp: ">", valor: 80 })),
        paso("T2", op("BEGIN")),
        paso("T2", op("INSERT", { id: "4", titular: "D", saldo: 150 })),
        paso("T2", op("COMMIT")),
        paso("T1", op("SELECT", { scope: "rango", campo: "saldo", comp: ">", valor: 80 })),
        paso("T1", op("COMMIT")),
      ],
    },
    {
      id: "lost-update",
      label: "Lost update — dos transacciones leen y escriben el mismo saldo",
      origen: "1.11.04 § 2, fila \"Race condition\" (dos transacciones actualizando el mismo saldo)",
      pasos: [
        paso("T1", op("BEGIN")),
        paso("T2", op("BEGIN")),
        paso("T1", op("SELECT", { scope: "fila", id: "1" })),
        paso("T2", op("SELECT", { scope: "fila", id: "1" })),
        paso("T1", op("UPDATE", { id: "1", modo: "relativo", delta: -10 })),
        paso("T1", op("COMMIT")),
        paso("T2", op("UPDATE", { id: "1", modo: "relativo", delta: -20 })),
        paso("T2", op("COMMIT")),
      ],
    },
    {
      id: "for-update",
      label: "Lectura con FOR UPDATE — el mismo caso, corregido",
      origen: "1.11.04 § 5, slides 29–30 (SELECT … FOR UPDATE) y § 6.1",
      pasos: [
        paso("T1", op("BEGIN")),
        paso("T2", op("BEGIN")),
        paso("T1", op("SELECT", { scope: "fila", id: "1", forUpdate: true })),
        paso("T2", op("SELECT", { scope: "fila", id: "1", forUpdate: true })),
        paso("T1", op("UPDATE", { id: "1", modo: "relativo", delta: -10 })),
        paso("T1", op("COMMIT")),
        paso("T2", op("UPDATE", { id: "1", modo: "relativo", delta: -20 })),
        paso("T2", op("COMMIT")),
      ],
    },
  ];

  function clonarPasos(pasos) {
    return pasos.map(function (p) { return { tx: p.tx, op: Object.assign({}, p.op) }; });
  }

  // ==================================================================
  // Retos
  // ==================================================================

  var RETOS = [
    {
      id: "provocar-dirty-read",
      titulo: "Provocar un dirty read real",
      enunciado: "Arme una secuencia (o parta del preset y edítelo) y elija nivel y semántica de manera " +
        "que T1 llegue a leer un valor que T2 escribió y todavía no confirmó.",
      fuente: "1.11.04 § 2 (definición de dirty read) · Final 1Dic2025, pregunta 3.C",
      check: function (config) {
        var out = simular(config);
        var d = diagnosticar(out);
        return {
          pass: d.dirtyRead.ocurrio,
          detail: d.dirtyRead.ocurrio
            ? "Correcto: hubo una lectura sucia. " + d.dirtyRead.detalle.join(" ")
            : "Todavía no se ve un dirty read. Hace falta READ UNCOMMITTED (en cualquiera de las dos " +
              "semánticas: es el único nivel que no evita esta anomalía) y que una transacción lea una fila " +
              "que la otra escribió sin confirmar todavía.",
        };
      },
    },
    {
      id: "trampa-repeatable-read",
      titulo: "Reproducir la trampa de REPEATABLE READ en InnoDB",
      enunciado: "Arme una secuencia con una lectura repetida (de una fila o de un rango) tal que, en " +
        "semántica MySQL con nivel REPEATABLE READ, la anomalía NO se vea — aunque el estándar diría que sí.",
      fuente: "1.11.04 § 6, tabla \"la trampa del parcial\"",
      check: function (config) {
        if (config.modo !== "mysql" || config.nivel !== "repeatable-read") {
          return { pass: false, detail: "Elija semántica MySQL y nivel REPEATABLE READ para este reto." };
        }
        var out = simular(config);
        var d = diagnosticar(out);
        var huboOportunidad = d.nonRepeatableRead.oportunidad || d.phantomRead.oportunidad;
        var sinAnomalia = !d.nonRepeatableRead.ocurrio && !d.phantomRead.ocurrio;
        return {
          pass: huboOportunidad && sinAnomalia,
          detail: huboOportunidad && sinAnomalia
            ? "Correcto: hubo una lectura repetida (de fila o de rango) con un cambio confirmado de la otra " +
              "transacción en el medio, y la instantánea de REPEATABLE READ la ocultó."
            : (huboOportunidad
              ? "Hay una lectura repetida, pero la anomalía SÍ se vio: revise que la segunda lectura sea " +
                "simple (sin FOR UPDATE) y del mismo predicado que la primera."
              : "Todavía no hay una lectura repetida (de la misma fila o del mismo rango) por la misma " +
                "transacción con una escritura ajena confirmada en el medio."),
        };
      },
    },
    {
      id: "for-update-evita-lost-update",
      titulo: "Evitar el lost update con FOR UPDATE",
      enunciado: "Arme una secuencia donde dos transacciones lean y escriban el mismo saldo usando " +
        "SELECT … FOR UPDATE en vez de un SELECT simple, de manera que ninguna pierda su cambio y las dos confirmen.",
      fuente: "1.11.04 § 5 (SELECT … FOR UPDATE evita el lost update)",
      check: function (config) {
        var out = simular(config);
        var d = diagnosticar(out);
        var ambasConfirmaron = out.state.estadoTx.T1 === "confirmada" && out.state.estadoTx.T2 === "confirmada";
        var pass = d.lostUpdate.oportunidad && !d.lostUpdate.ocurrio && ambasConfirmaron;
        return {
          pass: pass,
          detail: pass
            ? "Correcto: las dos transacciones escribieron la misma fila a partir de una lectura propia, " +
              "las dos confirmaron, y ninguna pisó el cambio de la otra."
            : "Todavía no se cumplen las tres condiciones: dos UPDATE de la misma fila basados en una " +
              "lectura previa (idealmente SELECT … FOR UPDATE), ninguno pisando el cambio ajeno, y ambas " +
              "transacciones confirmadas.",
        };
      },
    },
  ];

  // ==================================================================
  // Interfaz
  // ==================================================================

  function formatoOp(p) {
    var o = p.op;
    if (o.type === "BEGIN") return "START TRANSACTION;";
    if (o.type === "COMMIT") return "COMMIT;";
    if (o.type === "ROLLBACK") return "ROLLBACK;";
    if (o.type === "SELECT") {
      var forUpd = o.forUpdate ? " FOR UPDATE" : "";
      if (o.scope === "fila") return "SELECT * FROM cuentas WHERE id = " + o.id + forUpd + ";";
      return "SELECT * FROM cuentas WHERE " + o.campo + " " + o.comp + " " + o.valor + forUpd + ";";
    }
    if (o.type === "UPDATE") {
      if (o.modo === "fijo") return "UPDATE cuentas SET saldo = " + o.valor + " WHERE id = " + o.id + ";  -- valor fijo";
      var signo = o.delta >= 0 ? "+" : "-";
      return "UPDATE cuentas SET saldo = <leído> " + signo + " " + Math.abs(o.delta) + " WHERE id = " + o.id + ";  -- relativo a lo que la app leyó";
    }
    if (o.type === "INSERT") return "INSERT INTO cuentas VALUES (" + o.id + ", '" + o.titular + "', " + o.saldo + ");";
    return "?";
  }

  function estadoLabel(e) {
    return { "no-iniciada": "sin iniciar", "activa": "activa", "confirmada": "confirmada", "abortada": "abortada" }[e] || e;
  }

  lab.tool(
    {
      id: "aislamiento",
      title: "Transacciones concurrentes y niveles de aislamiento",
      subtitle: "Arme una secuencia de pasos para dos transacciones (T1/T2) y vea, nivel por nivel, qué " +
        "lee cada lectura, cuándo hay que esperar, cuándo hay un deadlock, y si ocurrió la anomalía — " +
        "según el estándar SQL-92 y según lo que hace de verdad MySQL/InnoDB.",
      sources: [
        { stem: "1.11.03 - Transacciones y ACID", label: "Transacciones y ACID" },
        { stem: "1.11.04 - Control de concurrencia y niveles de aislamiento", label: "Control de concurrencia" },
        { stem: "Clase 11 - Seguridad-Transacciones", label: "Clase 11" },
      ],
      figure: { id: "lab-aislamiento", caption: "Dos transacciones, una tabla chica, cuatro niveles de aislamiento: qué lee cada lectura y qué la hace esperar.", height: 460 },
    },
    function mount(body, mountCtx) {
      var h = lab.h;
      var engine = App.bdiiLab.engines["aislamiento"];
      var compact = mountCtx.mode === "figure";

      var state = {
        nivel: "read-committed",
        modo: "estandar",
        filas: FILAS_INICIALES.map(function (f) { return Object.assign({}, f); }),
        pasos: clonarPasos(PRESETS[0].pasos),
        builder: { tx: "T1", tipo: "SELECT", scope: "fila", id: "1", campo: "saldo", comp: ">", valor: 80, forUpdate: false, modoUpdate: "fijo", valorFijo: 0, delta: -10, insId: "4", insTitular: "D", insSaldo: 0 },
      };

      function aplicarPreset(preset) {
        state.nivel = state.nivel; // el nivel/semántica los elige el estudiante, no el preset
        state.filas = FILAS_INICIALES.map(function (f) { return Object.assign({}, f); });
        state.pasos = clonarPasos(preset.pasos);
        renderTodo();
      }

      // ---------- config: nivel, semántica, preset ----------

      var nivelCtrl = lab.segmented({
        label: "Nivel de aislamiento",
        options: engine.NIVELES.map(function (n) { return { value: n, label: engine.NIVEL_LABEL[n] }; }),
        value: state.nivel,
        onChange: function (v) { state.nivel = v; renderTodo(); },
      });

      var modoCtrl = lab.segmented({
        label: "Semántica",
        options: compact
          ? [{ value: "estandar", label: "Estándar SQL-92" }, { value: "mysql", label: "MySQL InnoDB" }]
          : [{ value: "estandar", label: "Estándar SQL-92: qué anomalías permite" }, { value: "mysql", label: "MySQL InnoDB: qué pasa de verdad" }],
        value: state.modo,
        onChange: function (v) { state.modo = v; renderTodo(); },
      });

      var presetCtrl = lab.presetPicker({
        label: "Escenario precargado",
        presets: PRESETS,
        value: 0, // state.pasos comienza con PRESETS[0]
        onPick: function (preset) { aplicarPreset(preset); },
      });

      // ---------- editor de pasos ----------

      var pasosList = h("div", { class: "lab-ais-pasos-list" });

      function moverPaso(i, delta) {
        var j = i + delta;
        if (j < 0 || j >= state.pasos.length) return;
        var tmp = state.pasos[i]; state.pasos[i] = state.pasos[j]; state.pasos[j] = tmp;
        renderTodo();
      }

      function renderPasosList() {
        pasosList.replaceChildren();
        if (!state.pasos.length) {
          pasosList.appendChild(lab.callout("info", "Sin pasos todavía", "Agregue uno con el constructor de abajo, o cargue un escenario."));
          return;
        }
        state.pasos.forEach(function (p, i) {
          pasosList.appendChild(
            h("div", { class: "lab-ais-paso" },
              h("span", { class: "lab-ais-paso-idx" }, "" + (i + 1)),
              lab.badge(p.tx, p.tx === "T1" ? "info" : "warn"),
              lab.code(formatoOp(p), "sql"),
              h("div", { class: "lab-ais-paso-btns" },
                h("button", { class: "bdii-btn bdii-btn--ghost", type: "button", "aria-label": "Subir paso " + (i + 1), disabled: i === 0, on: { click: function () { moverPaso(i, -1); } } }, "↑"),
                h("button", { class: "bdii-btn bdii-btn--ghost", type: "button", "aria-label": "Bajar paso " + (i + 1), disabled: i === state.pasos.length - 1, on: { click: function () { moverPaso(i, 1); } } }, "↓"),
                h("button", { class: "bdii-btn bdii-btn--ghost", type: "button", "aria-label": "Quitar paso " + (i + 1), on: { click: function () { state.pasos.splice(i, 1); renderTodo(); } } }, "Quitar"),
              ),
            ),
          );
        });
      }

      // Figura: la secuencia como lista de solo lectura; el paso que muestra el
      // recorrido se marca con "▶" (texto, no solo color) y aria-current.
      var pasosFigList = h("ol", { class: "lab-ais-fig-pasos" });
      function renderPasosFig() {
        pasosFigList.replaceChildren();
        state.pasos.forEach(function (p) {
          pasosFigList.appendChild(h("li", {},
            h("span", { class: "lab-ais-fig-marca", "aria-hidden": "true" }),
            lab.badge(p.tx, p.tx === "T1" ? "info" : "warn"), " ",
            h("code", { class: "bdii-mono" }, formatoOp(p))));
        });
      }
      function marcarPasoFig(i) {
        Array.prototype.forEach.call(pasosFigList.children, function (li, idx) {
          var actual = idx === i - 1;
          li.classList.toggle("is-current", actual);
          if (actual) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
          li.firstChild.textContent = actual ? "▶" : "";
        });
      }

      // ---------- constructor de paso ----------

      var txCtrl = lab.segmented({ label: "Transacción", options: [{ value: "T1", label: "T1" }, { value: "T2", label: "T2" }], value: state.builder.tx, onChange: function (v) { state.builder.tx = v; } });
      var tipoCtrl = lab.select({
        label: "Operación",
        options: [
          { value: "BEGIN", label: "BEGIN" }, { value: "SELECT", label: "SELECT" }, { value: "UPDATE", label: "UPDATE" },
          { value: "INSERT", label: "INSERT" }, { value: "COMMIT", label: "COMMIT" }, { value: "ROLLBACK", label: "ROLLBACK" },
        ],
        value: state.builder.tipo,
        onChange: function (v) { state.builder.tipo = v; renderExtras(); },
      });

      var extras = h("div", { class: "lab-ais-extra" });

      function inputId(label, value, onChange) {
        return lab.text({ label: label, value: String(value), mono: true, onChange: onChange });
      }

      function renderExtras() {
        extras.replaceChildren();
        var b = state.builder;
        if (b.tipo === "SELECT") {
          var scopeCtrl = lab.segmented({
            label: "Alcance", options: [{ value: "fila", label: "una fila" }, { value: "rango", label: "un rango" }],
            value: b.scope, onChange: function (v) { b.scope = v; renderExtras(); },
          });
          extras.appendChild(scopeCtrl.el);
          if (b.scope === "fila") {
            extras.appendChild(inputId("id de la fila", b.id, function (v) { b.id = v.trim() || "1"; }).el);
          } else {
            extras.appendChild(lab.select({ label: "Campo", options: [{ value: "saldo", label: "saldo" }], value: "saldo", onChange: function () {} }).el);
            extras.appendChild(lab.select({
              label: "Comparación", options: [">", "<", ">=", "<=", "="].map(function (c) { return { value: c, label: c }; }),
              value: b.comp, onChange: function (v) { b.comp = v; },
            }).el);
            extras.appendChild(lab.number({ label: "Valor", value: b.valor, onChange: function (v) { b.valor = v; } }).el);
          }
          extras.appendChild(lab.toggle({ label: "FOR UPDATE (lectura con bloqueo)", checked: b.forUpdate, onChange: function (v) { b.forUpdate = v; } }).el);
        } else if (b.tipo === "UPDATE") {
          extras.appendChild(inputId("id de la fila", b.id, function (v) { b.id = v.trim() || "1"; }).el);
          var modoUpdCtrl = lab.segmented({
            label: "Valor a escribir", options: [{ value: "fijo", label: "fijo" }, { value: "relativo", label: "relativo a lo que la app leyó" }],
            value: b.modoUpdate, onChange: function (v) { b.modoUpdate = v; renderExtras(); },
          });
          extras.appendChild(modoUpdCtrl.el);
          if (b.modoUpdate === "fijo") {
            extras.appendChild(lab.number({ label: "Nuevo valor de saldo", value: b.valorFijo, onChange: function (v) { b.valorFijo = v; } }).el);
          } else {
            extras.appendChild(lab.number({ label: "Delta (+/-) sobre la última lectura de esta transacción", value: b.delta, onChange: function (v) { b.delta = v; } }).el);
          }
        } else if (b.tipo === "INSERT") {
          extras.appendChild(inputId("id nuevo", b.insId, function (v) { b.insId = v.trim() || "4"; }).el);
          extras.appendChild(lab.text({ label: "Titular", value: b.insTitular, onChange: function (v) { b.insTitular = v; } }).el);
          extras.appendChild(lab.number({ label: "Saldo", value: b.insSaldo, onChange: function (v) { b.insSaldo = v; } }).el);
        }
      }

      var agregarBtn = lab.button({
        label: "Agregar paso", kind: "primary",
        onClick: function () {
          var b = state.builder;
          var o;
          if (b.tipo === "BEGIN" || b.tipo === "COMMIT" || b.tipo === "ROLLBACK") o = op(b.tipo);
          else if (b.tipo === "SELECT") {
            o = b.scope === "fila" ? op("SELECT", { scope: "fila", id: b.id, forUpdate: b.forUpdate }) : op("SELECT", { scope: "rango", campo: "saldo", comp: b.comp, valor: b.valor, forUpdate: b.forUpdate });
          } else if (b.tipo === "UPDATE") {
            o = b.modoUpdate === "fijo" ? op("UPDATE", { id: b.id, modo: "fijo", valor: b.valorFijo }) : op("UPDATE", { id: b.id, modo: "relativo", delta: b.delta });
          } else if (b.tipo === "INSERT") {
            o = op("INSERT", { id: b.insId, titular: b.insTitular || "?", saldo: b.insSaldo });
          }
          state.pasos.push(paso(b.tx, o));
          renderTodo();
        },
      });
      var vaciarBtn = lab.button({ label: "Vaciar pasos", kind: "ghost", onClick: function () { state.pasos = []; renderTodo(); } });

      // ---------- stepper ----------

      var stepperHost = h("div", { class: "lab-ais-stepper-host" });
      var stepperCtrl = null;

      function tablaConfirmada(snap) {
        var rows = Object.keys(snap.committed).sort().map(function (id) { return snap.committed[id]; });
        return lab.table({
          caption: "Confirmado en la base",
          columns: [{ key: "id", label: "id", mono: true }, { key: "titular", label: "titular" }, { key: "saldo", label: "saldo", align: "right", mono: true }],
          rows: rows,
        });
      }

      function tablaPendiente(snap, tx) {
        var pend = snap.pendientes[tx];
        var ids = Object.keys(pend);
        if (!ids.length) return h("p", { class: "lab-ais-sin-pendiente" }, tx + ": sin escrituras pendientes.");
        return lab.table({
          caption: tx + " — escrituras sin confirmar (visibles solo para " + tx + ")",
          columns: [{ key: "id", label: "id", mono: true }, { key: "titular", label: "titular" }, { key: "saldo", label: "saldo", align: "right", mono: true }],
          rows: ids.sort().map(function (id) { return pend[id]; }),
        });
      }

      function tablaLocks(snap) {
        var ids = Object.keys(snap.locks.rowLocks);
        var filas = ids.sort().map(function (id) {
          var L = snap.locks.rowLocks[id];
          return { fila: id, compartido: L.S.length ? L.S.join(", ") : "—", exclusivo: L.X || "—" };
        });
        var rangoTxt = snap.locks.rangeLocks.length
          ? snap.locks.rangeLocks.map(function (rl) {
              return rl.tx + ": " + ((rl.all || rl.gap) ? (rl.motivo || "toda la tabla (gap)") : (rl.campo + " " + rl.comp + " " + rl.valor));
            }).join(" · ")
          : "ninguno";
        return h("div", {},
          filas.length
            ? lab.table({ caption: "Locks de fila vigentes", columns: [{ key: "fila", label: "fila", mono: true }, { key: "compartido", label: "S (compartido)" }, { key: "exclusivo", label: "X (exclusivo)" }], rows: filas })
            : h("p", { class: "lab-ais-sin-locks" }, "Sin locks de fila vigentes."),
          h("p", { class: "lab-ais-rangelocks" }, "Locks de rango vigentes: ", rangoTxt),
        );
      }

      /** Figura: lo mismo que las tres tablas y los locks, en tres líneas de texto. */
      function estadoEnLineas(snap) {
        function filasTxt(obj) {
          var ids = Object.keys(obj).sort();
          return ids.length ? ids.map(function (id) { return "id " + id + " = " + obj[id].saldo; }).join(" · ") : "—";
        }
        var lineas = [h("li", {}, h("strong", {}, "Confirmado: "), filasTxt(snap.committed))];
        ["T1", "T2"].forEach(function (tx) {
          if (Object.keys(snap.pendientes[tx]).length) lineas.push(h("li", {}, h("strong", {}, tx + " sin confirmar (solo lo ve " + tx + "): "), filasTxt(snap.pendientes[tx])));
        });
        var locks = Object.keys(snap.locks.rowLocks).sort().map(function (id) {
          var L = snap.locks.rowLocks[id];
          var partes = [];
          if (L.S.length) partes.push("S de " + L.S.join(", "));
          if (L.X) partes.push("X de " + L.X);
          return "fila " + id + ": " + partes.join(" y ");
        });
        snap.locks.rangeLocks.forEach(function (rl) {
          locks.push(rl.tx + ": " + ((rl.all || rl.gap) ? (rl.motivo || "toda la tabla (gap)") : (rl.campo + " " + rl.comp + " " + rl.valor)));
        });
        lineas.push(h("li", {}, h("strong", {}, "Locks: "), locks.length ? locks.join(" · ") : "ninguno"));
        return h("ul", { class: "lab-ais-fig-estado" }, lineas);
      }

      function estadosTxPanel(snap) {
        return h("p", { class: "lab-ais-estados" },
          "T1: ", lab.badge(estadoLabel(snap.estadoTx.T1), snap.estadoTx.T1 === "abortada" ? "bad" : (snap.estadoTx.T1 === "confirmada" ? "ok" : "neutral")),
          snap.bloqueado.T1 ? " (esperando " + snap.bloqueado.T1.esperando.recurso + ")" : "",
          " · T2: ", lab.badge(estadoLabel(snap.estadoTx.T2), snap.estadoTx.T2 === "abortada" ? "bad" : (snap.estadoTx.T2 === "confirmada" ? "ok" : "neutral")),
          snap.bloqueado.T2 ? " (esperando " + snap.bloqueado.T2.esperando.recurso + ")" : "",
        );
      }

      function resultadoDelPaso(out, i) {
        // i es 1-based dentro del stepper (0 = estado inicial); resultados es 0-based
        var r = out.resultados[i - 1];
        if (!r) return null;
        var partes = [];
        if (r.status === "esperando" && r.resueltoEn === undefined) {
          partes.push(lab.callout("warn", (r.tx || "") + " queda ESPERANDO", (r.mensaje || "") + (r.esperando ? " Recurso: " + r.esperando.recurso + " (lo tiene " + r.esperando.heldBy + ")." : "")));
        } else if (r.status === "abortada-deadlock") {
          partes.push(lab.callout("bad", "Deadlock: " + r.tx + " es la víctima", (r.deadlock && r.deadlock.nota) || ""));
        } else if (r.status === "no-ejecuta") {
          partes.push(lab.callout("info", "No se ejecuta", r.mensaje || ""));
        } else {
          var nota = (r.resueltoEn !== undefined && r.resueltoEn !== i - 1) ? " (esperó hasta el paso " + (r.resueltoEn + 1) + ")" : "";
          if (r.tipo === "select") {
            var vals = r.filas.map(function (f) { return "id " + f.id + " = " + f.saldo; }).join(" · ") || "sin filas";
            partes.push(lab.callout(r.sucia ? "warn" : "ok", (r.tx || "") + " lee: " + vals + nota, r.sucia ? "Lectura sucia: ve un valor que " + otherTx(r.tx) + " todavía no confirmó." : (r.forUpdate ? "Lectura con bloqueo (current read): ve lo último confirmado, sin usar ninguna instantánea." : "Lectura simple.")));
          } else if (r.tipo === "update") {
            if (r.afectadas === 0) partes.push(lab.callout("info", (r.tx || "") + ": " + r.mensaje, ""));
            else partes.push(lab.callout(r.pisaCambioAjeno ? "warn" : "ok", (r.tx || "") + " escribe saldo = " + r.valorNuevo + nota,
              (r.huboLectura ? "Basado en su última lectura (" + r.valorLeido + ")." : "Sin lectura previa: usó el valor confirmado actual (" + r.valorAnterior + ").") +
              (r.pisaCambioAjeno ? " El valor confirmado ya era " + r.valorAnterior + ": esta escritura pisa un cambio ajeno." : "")));
          } else if (r.tipo === "insert") {
            partes.push(r.ok ? lab.callout("ok", (r.tx || "") + " inserta la fila " + r.fila.id + nota, "") : lab.callout("bad", (r.tx || "") + ": " + r.mensaje, ""));
          } else if (r.tipo === "begin") {
            partes.push(lab.callout("info", (r.tx || "") + " abre una transacción", ""));
          } else if (r.tipo === "commit") {
            partes.push(lab.callout("ok", (r.tx || "") + " confirma" + nota, "Sus escrituras pasan a la base y libera todos sus locks."));
          } else if (r.tipo === "rollback") {
            partes.push(lab.callout("bad", (r.tx || "") + " deshace" + nota, "Descarta sus escrituras pendientes y libera todos sus locks."));
          }
        }
        // ¿algo se destrabó justo en este paso?
        var destrabados = out.resultados.filter(function (rr, idx) { return rr && rr.resueltoEn === i - 1 && idx !== i - 1; });
        if (destrabados.length) {
          partes.push(lab.callout("info", "Aquí se liberó el bloqueo", destrabados.map(function (rr) { return (rr.tx || "") + ": " + formatoOp({ tx: rr.tx, op: rr.op }); }).join(" · ")));
        }
        return partes;
      }

      function renderStepper() {
        stepperHost.replaceChildren();
        if (!state.pasos.length) { stepperHost.appendChild(lab.callout("info", "Sin pasos", "Agregue pasos para ver la ejecución.")); return; }
        var out = engine.simular({ nivel: state.nivel, modo: state.modo, filas: state.filas, pasos: state.pasos });
        state.__ultimoOut = out;
        if (stepperCtrl) stepperCtrl.destroy();
        stepperCtrl = lab.stepper({
          count: out.snapshots.length,
          label: "Paso",
          render: function (i) {
            var snap = out.snapshots[i];
            var cont = h("div", { class: "lab-ais-frame" });
            cont.appendChild(h("p", { class: "lab-ais-frame-titulo" }, i === 0 ? "Estado inicial" : "Paso " + i + " de " + (out.snapshots.length - 1) + ": " + formatoOp(state.pasos[i - 1]) + " (" + state.pasos[i - 1].tx + ")"));
            if (i > 0) {
              var res = resultadoDelPaso(out, i);
              if (res) res.forEach(function (n) { cont.appendChild(n); });
            }
            cont.appendChild(estadosTxPanel(snap));
            if (compact) {
              marcarPasoFig(i);
              cont.appendChild(estadoEnLineas(snap));
              return cont;
            }
            cont.appendChild(lab.grid(3, tablaConfirmada(snap), tablaPendiente(snap, "T1"), tablaPendiente(snap, "T2")));
            cont.appendChild(tablaLocks(snap));
            return cont;
          },
        });
        stepperHost.appendChild(stepperCtrl.el);
      }

      // ---------- resultado explicado (diagnóstico final) ----------

      var diagnosticoHost = h("div", { class: "lab-ais-diagnostico", "aria-live": "polite" });

      function filaDiag(nombre, d, regla) {
        var kind = d.ocurrio ? "warn" : (d.oportunidad ? "ok" : "info");
        var titulo = nombre + ": " + (d.ocurrio ? "ocurrió" : (d.oportunidad ? "no ocurrió" : "sin oportunidad en esta secuencia"));
        return lab.callout(kind, titulo, h("div", {},
          h("p", {}, regla),
          d.detalle.length ? h("ul", { class: "lab-ais-diag-detalle" }, d.detalle.map(function (t) { return h("li", {}, t); })) : null,
        ));
      }

      function filaDiagFig(nombre, d) {
        var marca = d.ocurrio ? "(atención) " + nombre + ": ocurrió" : (d.oportunidad ? "✓ " + nombre + ": no ocurrió" : "(nota) " + nombre + ": sin oportunidad en esta secuencia");
        return h("li", { class: "lab-ais-fig-diag lab-ais-fig-diag--" + (d.ocurrio ? "warn" : (d.oportunidad ? "ok" : "info")) },
          h("strong", {}, marca), d.detalle.length ? " — " + d.detalle.join(" ") : "");
      }

      function renderDiagnostico() {
        diagnosticoHost.replaceChildren();
        var out = state.__ultimoOut;
        if (!out) return;
        var d = engine.diagnosticar(out);
        if (compact) {
          diagnosticoHost.appendChild(h("ul", { class: "lab-ais-fig-diags" },
            filaDiagFig("Dirty read", d.dirtyRead), filaDiagFig("Non-repeatable read", d.nonRepeatableRead),
            filaDiagFig("Phantom read", d.phantomRead), filaDiagFig("Lost update", d.lostUpdate)));
          return;
        }
        var reglaModo = state.modo === "estandar" ? "estándar SQL-92, nivel " + engine.NIVEL_LABEL[state.nivel] : "MySQL/InnoDB, nivel " + engine.NIVEL_LABEL[state.nivel];
        var idsFinal = Object.keys(out.estadoFinal).sort(function (a, b) { return Number(a) - Number(b); });
        var estadoFinalTxt = idsFinal.length
          ? idsFinal.map(function (id) { return "id " + id + " = " + out.estadoFinal[id].saldo; }).join(", ")
          : "sin filas";
        diagnosticoHost.appendChild(h("p", {}, "Semántica aplicada: ", lab.badge(reglaModo, "neutral"), " · estado final: " + estadoFinalTxt + "."));
        diagnosticoHost.appendChild(filaDiag("Dirty read", d.dirtyRead, "Regla: solo READ UNCOMMITTED, en cualquiera de las dos semánticas, deja leer un valor sin confirmar."));
        diagnosticoHost.appendChild(filaDiag("Non-repeatable read", d.nonRepeatableRead, "Regla (estándar): RU y RC la permiten, RR y SERIALIZABLE la evitan. En InnoDB, RR también la evita para lecturas simples — pero por instantánea (MVCC), no por bloqueo."));
        diagnosticoHost.appendChild(filaDiag("Phantom read", d.phantomRead, "Regla (estándar): solo SERIALIZABLE la evita (con un lock de rango). En InnoDB, una lectura simple bajo RR tampoco la muestra, por la misma instantánea — aunque el INSERT ajeno no esperó nada."));
        diagnosticoHost.appendChild(filaDiag("Lost update", d.lostUpdate, "No está en la tabla del estándar SQL-92 (el deck la llama \"race condition\"). SELECT … FOR UPDATE la evita siempre; un SELECT simple seguido de un UPDATE con el valor que la app leyó puede perderla incluso en REPEATABLE READ de InnoDB."));
      }

      // ---------- tabla resumen ----------

      function tablaResumen() {
        var filasEstandar = engine.TABLA_ESTANDAR.map(function (r) {
          return { nivel: engine.NIVEL_LABEL[r.nivel], dirty: r.dirty, noRep: r.noRep, phantom: r.phantom };
        });
        var tablaEst = lab.table({
          caption: "Estándar SQL-92 — qué anomalía permite cada nivel",
          columns: [{ key: "nivel", label: "Nivel" }, { key: "dirty", label: "Dirty read" }, { key: "noRep", label: "Non-repeatable" }, { key: "phantom", label: "Phantom" }],
          rows: filasEstandar,
          rowClass: function (r) { return r.nivel === engine.NIVEL_LABEL[state.nivel] ? "lab-ais-row-current" : ""; },
        });
        var filasInno = engine.TABLA_INNODB.map(function (r) { return { nivel: engine.NIVEL_LABEL[r.nivel], nota: r.nota }; });
        var tablaInno = lab.table({
          caption: "MySQL/InnoDB — qué hace de verdad (lecturas simples vs. FOR UPDATE)",
          columns: [{ key: "nivel", label: "Nivel" }, { key: "nota", label: "Qué pasa" }],
          rows: filasInno,
          rowClass: function (r) { return r.nivel === engine.NIVEL_LABEL[state.nivel] ? "lab-ais-row-current" : ""; },
        });
        return h("div", {}, tablaEst, tablaInno);
      }

      // ---------- retos ----------

      var retosHost = h("div", { class: "lab-ais-retos" });
      function renderRetos() {
        retosHost.replaceChildren();
        RETOS.forEach(function (reto) {
          var out = h("div", { "aria-live": "polite" });
          var btn = lab.button({
            label: "Comprobar", kind: "primary",
            onClick: function () {
              var config = { nivel: state.nivel, modo: state.modo, filas: state.filas, pasos: state.pasos };
              var res = reto.check(config);
              out.replaceChildren(lab.callout(res.pass ? "ok" : "bad", res.pass ? "Correcto" : "Todavía no", res.detail));
            },
          });
          retosHost.appendChild(lab.panel(reto.titulo, h("p", {}, reto.enunciado), h("p", { class: "lab-ais-reto-fuente" }, "Fuente: ", reto.fuente), btn.el, out));
        });
      }

      // ---------- montaje ----------

      var resumenHost = null; // se crea más abajo solo en modo vista (no en figura)
      function renderResumen() {
        if (resumenHost) resumenHost.replaceChildren(tablaResumen());
      }

      function renderTodo() {
        nivelCtrl.set(state.nivel);
        modoCtrl.set(state.modo);
        if (compact) renderPasosFig(); else renderPasosList();
        renderStepper();
        renderDiagnostico();
        renderResumen();
      }

      renderExtras();

      var enlaces = h("p", { class: "lab-ais-links" },
        "Ver también: ", lab.pageLink("1.11.04 - Control de concurrencia y niveles de aislamiento", "Control de concurrencia"),
        " · ", lab.pageLink("1.11.03 - Transacciones y ACID", "Transacciones y ACID"),
        " · ", lab.pageLink("MySQL", "MySQL"));

      var configPanel = lab.panel("Configuración", presetCtrl.el, nivelCtrl.el, modoCtrl.el);
      var editorPanel = lab.panel("Pasos, en orden de ejecución", pasosList);
      var builderPanel = lab.panel("Agregar paso", h("div", { class: "lab-ais-builder-grid" }, txCtrl.el, tipoCtrl.el, extras), h("div", {}, agregarBtn.el, " ", vaciarBtn.el));
      var stepperPanel = lab.panel("Recorrido paso a paso", stepperHost);
      var resultadoPanel = lab.panel("Resultado explicado", diagnosticoHost, enlaces);

      if (compact) {
        // Figura: escenario, nivel y semántica; la secuencia de solo lectura con el
        // recorrido paso a paso; y el diagnóstico en una línea por anomalía. El
        // editor de pasos, la tabla resumen y los retos quedan en el laboratorio.
        body.appendChild(lab.panel(null, lab.grid(2, presetCtrl.el, modoCtrl.el), nivelCtrl.el));
        body.appendChild(lab.panel("Recorrido paso a paso", pasosFigList, stepperHost));
        body.appendChild(lab.panel("Resultado", diagnosticoHost));
      } else {
        body.appendChild(lab.grid(2, configPanel, builderPanel));
        body.appendChild(editorPanel);
        body.appendChild(stepperPanel);
        body.appendChild(resultadoPanel);
        resumenHost = h("div", { class: "lab-ais-resumen-host" });
        body.appendChild(lab.panel("Tabla resumen: qué anomalía permite cada nivel", resumenHost));
        renderRetos();
        body.appendChild(lab.panel("Retos", retosHost));
        body.appendChild(lab.callout("info", "Simplificaciones de esta herramienta", h("ul", { class: "lab-ais-simplif" },
          h("li", {}, "Los gap locks reales de InnoDB cubren rangos continuos del índice. La tabla \"cuentas\" de esta herramienta no tiene índice en saldo: por eso una lectura de RANGO con bloqueo en MySQL recorre y bloquea toda la tabla, como un escaneo sin índice de verdad. En REPEATABLE READ y SERIALIZABLE retiene todas las filas y todos los huecos hasta el COMMIT; en READ COMMITTED y READ UNCOMMITTED suelta, al terminar la sentencia, las filas que no cumplen el WHERE y no toma gap locks. Una búsqueda por clave de una fila que no existe no bloquea ninguna fila: en RR/SERIALIZABLE deja un gap lock sobre el hueco entre la clave anterior y la siguiente (las claves se ordenan como texto), y en RC/RU no bloquea nada."),
          h("li", {}, "El deadlock se detecta y resuelve igual en las dos semánticas contando cuántos UPDATE/INSERT aplicó cada transacción, como aproximación al criterio de InnoDB (manual § 17.7.5.2: prefiere abortar la transacción \"más chica\"); no es una réplica exacta — InnoDB pesa además las estructuras de lock tomadas, así que en algunos casos la víctima real puede ser la otra transacción. El estándar SQL-92 solo dice que el motor \"aborta una de las dos\"."),
          h("li", {}, "Solo se modelan BEGIN, SELECT (fila, rango o FOR UPDATE), UPDATE, INSERT, COMMIT y ROLLBACK sobre una tabla \"cuentas\" de tres columnas — no hay DELETE ni múltiples tablas."),
        )));
      }

      renderTodo();

      return function cleanup() {
        if (stepperCtrl) stepperCtrl.destroy();
      };
    },
  );
})();
