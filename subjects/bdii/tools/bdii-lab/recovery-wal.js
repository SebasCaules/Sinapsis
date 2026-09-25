/* ============================================================
   bdii-lab / recovery-wal.js — "Recovery: write-ahead logging y ARIES".

   Motor puro (App.bdiiLab.engines["recovery-wal"]): un log de registros con
   LSN + eventos de sistema (FLUSH de página, fsync del log) se procesan en
   orden para producir, en cada paso, el estado de tres zonas — buffer pool
   (RAM), páginas en disco y log en disco — y detectar violaciones de la
   regla de oro del WAL. Elegido un punto de crash, se simula la pérdida del
   buffer pool y de todo lo no fsyncado, y se corre la recuperación ARIES
   (Analysis → Redo → Undo) sobre lo que sobrevive, con una variante
   "PostgreSQL" que se salta la fase de Undo (MVCC la reemplaza).

   Fuente: wiki/clases/Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL.md (slides
   3-12). Términos que el deck no nombra por su nombre técnico (recLSN, CLR,
   tabla de páginas sucias) están marcados "(ampliación)" en la interfaz: no
   están en ningún libro de la bibliografía del vault (solo en el paper de
   Mohan et al. 1992), ver 1.11.06 § 7.6 y § Bibliografía verificada.
   ============================================================ */
(function () {
  "use strict";

  var App = window.App;
  if (!App) return;
  var lab = App.bdiiLab;
  if (!lab) return; // lib.js no se cargó antes: nada que hacer

  // ==================================================================
  // Motor puro — sin DOM, testeable en Node.
  // ==================================================================

  function cloneJSON(x) {
    return JSON.parse(JSON.stringify(x));
  }

  function makeEmptyPages(initialPages) {
    var pages = {};
    Object.keys(initialPages).forEach(function (p) {
      pages[p] = { value: initialPages[p], pageLSN: 0 };
    });
    return pages;
  }

  /**
   * Procesa los pasos de un escenario en orden y devuelve una entrada por
   * paso con el estado acumulado de las tres zonas (buffer pool, disco,
   * log) más las violaciones detectadas hasta ese punto.
   */
  function runTimeline(scenario) {
    var buffer = makeEmptyPages(scenario.initialPages);
    var disk = makeEmptyPages(scenario.initialPages);
    var log = [];
    var nextLsn = 1;
    var fsyncedUpTo = 0;
    var active = [];
    var violations = [];
    var entries = [];

    function assignLsn() {
      var l = nextLsn;
      nextLsn += 1;
      return l;
    }

    scenario.steps.forEach(function (step, idx) {
      var produced = [];

      if (step.type === "begin") {
        var lsnB = assignLsn();
        var recB = { lsn: lsnB, type: "begin", tx: step.tx };
        log.push(recB);
        produced.push(recB);
        if (active.indexOf(step.tx) === -1) active.push(step.tx);
      } else if (step.type === "update") {
        var lsnU = assignLsn();
        var recU = { lsn: lsnU, type: "update", tx: step.tx, page: step.page, old: step.oldVal, new: step.newVal };
        log.push(recU);
        produced.push(recU);
        buffer[step.page] = { value: step.newVal, pageLSN: lsnU };
      } else if (step.type === "commit") {
        var lsnC = assignLsn();
        var recC = { lsn: lsnC, type: "commit", tx: step.tx };
        log.push(recC);
        produced.push(recC);
        // una tx comprometida deja de estar "activa": si hay un CHECKPOINT
        // más adelante, su foto no debe incluirla como perdedora en potencia.
        active = active.filter(function (t) { return t !== step.tx; });
      } else if (step.type === "abort") {
        var lsnA = assignLsn();
        var recA = { lsn: lsnA, type: "abort", tx: step.tx };
        log.push(recA);
        produced.push(recA);
        var myUpdates = log
          .filter(function (r) { return r.type === "update" && r.tx === step.tx; })
          .sort(function (a, b) { return b.lsn - a.lsn; });
        myUpdates.forEach(function (u, k) {
          var lsnClr = assignLsn();
          // undoNextLsn: el siguiente update de la tx que falta deshacer (null = ninguno). Es lo
          // que usa la fase Undo de ARIES para no repetir lo que este CLR ya compensó.
          var nextToUndo = myUpdates[k + 1] ? myUpdates[k + 1].lsn : null;
          var clr = { lsn: lsnClr, type: "clr", tx: step.tx, page: u.page, undoesLsn: u.lsn, undoNextLsn: nextToUndo, old: u.new, new: u.old };
          log.push(clr);
          produced.push(clr);
          buffer[u.page] = { value: u.old, pageLSN: lsnClr };
        });
        var lsnEnd = assignLsn();
        var recEnd = { lsn: lsnEnd, type: "end", tx: step.tx };
        log.push(recEnd);
        produced.push(recEnd);
        active = active.filter(function (t) { return t !== step.tx; });
      } else if (step.type === "checkpoint") {
        var lsnK = assignLsn();
        var dirty = Object.keys(buffer)
          .filter(function (p) { return buffer[p].pageLSN > disk[p].pageLSN; })
          .map(function (p) {
            var recs = log.filter(function (r) {
              return (r.type === "update" || r.type === "clr") && r.page === p && r.lsn > disk[p].pageLSN;
            });
            var minLsn = recs.reduce(function (m, r) { return Math.min(m, r.lsn); }, Infinity);
            return { page: p, recLSN: minLsn };
          });
        var recK = { lsn: lsnK, type: "checkpoint", activeTx: active.slice(), dirtyPages: dirty };
        log.push(recK);
        produced.push(recK);
      } else if (step.type === "flush") {
        var pg = step.page;
        var bufPageLsn = buffer[pg] ? buffer[pg].pageLSN : 0;
        var violatesNow = bufPageLsn > fsyncedUpTo;
        if (violatesNow) {
          violations.push({
            stepIndex: idx, stepKey: step.key, kind: "flush-before-log",
            page: pg, pageLSN: bufPageLsn, fsyncedUpTo: fsyncedUpTo,
          });
        }
        disk[pg] = { value: buffer[pg] ? buffer[pg].value : disk[pg].value, pageLSN: bufPageLsn };
      } else if (step.type === "fsync") {
        var target = step.upto === "latest" ? (nextLsn - 1) : step.upto;
        fsyncedUpTo = Math.max(fsyncedUpTo, target);
      } else if (step.type === "confirm") {
        var commitRec = log.filter(function (r) { return r.type === "commit" && r.tx === step.tx; }).pop();
        var okConfirm = commitRec && commitRec.lsn <= fsyncedUpTo;
        if (!okConfirm) {
          violations.push({
            stepIndex: idx, stepKey: step.key, kind: "confirm-before-fsync",
            tx: step.tx, commitLsn: commitRec ? commitRec.lsn : null, fsyncedUpTo: fsyncedUpTo,
          });
        }
      }

      entries.push({
        index: idx,
        step: step,
        produced: produced,
        log: log.slice(),
        buffer: cloneJSON(buffer),
        disk: cloneJSON(disk),
        fsyncedUpTo: fsyncedUpTo,
        active: active.slice(),
        violations: violations.slice(),
      });
    });

    return entries;
  }

  /** Inserta un FLUSH prematuro justo después del primer UPDATE del
   * escenario (garantiza una violación de la regla del WAL), solo si
   * `allow` es verdadero. Función pura: no muta `scenario`. */
  function withViolation(scenario, allow) {
    if (!allow) return scenario;
    var steps = scenario.steps;
    var firstUpdateIdx = -1;
    for (var i = 0; i < steps.length; i += 1) {
      if (steps[i].type === "update") { firstUpdateIdx = i; break; }
    }
    if (firstUpdateIdx === -1) return scenario;
    var page = steps[firstUpdateIdx].page;
    var flushStep = { key: "injected-flush", type: "flush", page: page, injected: true };
    var newSteps = steps.slice(0, firstUpdateIdx + 1).concat([flushStep], steps.slice(firstUpdateIdx + 1));
    return { initialPages: scenario.initialPages, steps: newSteps };
  }

  function findIndexByKey(steps, key) {
    for (var i = 0; i < steps.length; i += 1) {
      if (steps[i].key === key) return i;
    }
    return steps.length - 1;
  }

  function findAdjustableFsyncIndex(steps) {
    for (var i = 0; i < steps.length; i += 1) {
      if (steps[i].type === "fsync" && steps[i].adjustable) return i;
    }
    return -1;
  }

  /** LSN más alto que existe en el momento en que se procesa el fsync
   * ajustable (tope válido para el slider que lo controla). */
  function maxAdjustableUpto(scenario) {
    var idx = findAdjustableFsyncIndex(scenario.steps);
    if (idx === -1) return 0;
    var probe = { initialPages: scenario.initialPages, steps: scenario.steps.slice() };
    probe.steps[idx] = { key: probe.steps[idx].key, type: "fsync", adjustable: true, upto: "latest" };
    var entries = runTimeline(probe);
    return entries[idx].log.length;
  }

  /** Aplica el valor elegido por el estudiante al fsync ajustable del
   * escenario (clon puro). */
  function applyFsyncValue(scenario, value) {
    var idx = findAdjustableFsyncIndex(scenario.steps);
    if (idx === -1) return scenario;
    var steps = scenario.steps.slice();
    steps[idx] = { key: steps[idx].key, type: "fsync", adjustable: true, upto: value };
    return { initialPages: scenario.initialPages, steps: steps };
  }

  /** El crash: a partir de la entrada elegida, el buffer pool se pierde y
   * el log se trunca a lo que ya estaba fsyncado. */
  function crashAt(entries, crashIndex) {
    var entry = entries[crashIndex] || entries[entries.length - 1];
    var fsyncedUpTo = entry.fsyncedUpTo;
    var survivingLog = entry.log.filter(function (r) { return r.lsn <= fsyncedUpTo; });
    var lostRecords = entry.log.filter(function (r) { return r.lsn > fsyncedUpTo; });
    return {
      crashIndex: entry.index,
      fsyncedUpTo: fsyncedUpTo,
      diskAtCrash: entry.disk,
      bufferAtCrash: entry.buffer,
      survivingLog: survivingLog,
      lostRecords: lostRecords,
      violationsUpToCrash: entry.violations,
    };
  }

  /** ARIES: Analysis → Redo → Undo (Undo se omite en modo "postgres"). */
  function ariesRecover(crashState, initialPages, mode) {
    var survivingLog = crashState.survivingLog;

    // --- Analysis ---
    var checkpoints = survivingLog.filter(function (r) { return r.type === "checkpoint"; });
    var lastCkpt = checkpoints.length ? checkpoints[checkpoints.length - 1] : null;
    var activeTable = lastCkpt ? lastCkpt.activeTx.slice() : [];
    var dpt = {};
    if (lastCkpt) {
      lastCkpt.dirtyPages.forEach(function (d) { dpt[d.page] = d.recLSN; });
    }
    var scanStart = lastCkpt ? lastCkpt.lsn : 0;
    var analysisSteps = [];
    survivingLog.forEach(function (r) {
      if (r.lsn <= scanStart) return;
      if (r.type === "begin") {
        if (activeTable.indexOf(r.tx) === -1) activeTable.push(r.tx);
        analysisSteps.push({ lsn: r.lsn, note: "Tx " + r.tx + " se agrega a la tabla de transacciones activas" });
      } else if (r.type === "commit") {
        activeTable = activeTable.filter(function (t) { return t !== r.tx; });
        analysisSteps.push({ lsn: r.lsn, note: "Tx " + r.tx + " confirmó: sale de la tabla, no es perdedora" });
      } else if (r.type === "end") {
        activeTable = activeTable.filter(function (t) { return t !== r.tx; });
        analysisSteps.push({ lsn: r.lsn, note: "Tx " + r.tx + " ya se había deshecho por completo antes del crash" });
      } else if (r.type === "update" || r.type === "clr") {
        if (!(r.page in dpt)) {
          dpt[r.page] = r.lsn;
          analysisSteps.push({ lsn: r.lsn, note: "Página " + r.page + " entra a la tabla de páginas sucias (recLSN " + r.lsn + ")" });
        }
      }
    });
    var losers = activeTable.slice();
    var dptEntries = Object.keys(dpt).map(function (p) { return { page: p, recLSN: dpt[p] }; });

    // --- Redo ---
    var disk = cloneJSON(crashState.diskAtCrash);
    Object.keys(initialPages).forEach(function (p) {
      if (!disk[p]) disk[p] = { value: initialPages[p], pageLSN: 0 };
    });
    var minRecLsn = dptEntries.length
      ? dptEntries.reduce(function (m, d) { return Math.min(m, d.recLSN); }, Infinity)
      : Infinity;
    var redoLog = [];
    survivingLog.forEach(function (r) {
      if (r.type !== "update" && r.type !== "clr") return;
      if (r.lsn < minRecLsn) return;
      var pageInDpt = r.page in dpt;
      var belowRecLsn = pageInDpt && r.lsn < dpt[r.page];
      var alreadyApplied = pageInDpt && !belowRecLsn && disk[r.page] && disk[r.page].pageLSN >= r.lsn;
      if (!pageInDpt) {
        redoLog.push({ record: r, applied: false, reason: "la página no está en la tabla de páginas sucias: ya estaba limpia" });
      } else if (belowRecLsn) {
        redoLog.push({ record: r, applied: false, reason: "anterior al recLSN de la página (" + dpt[r.page] + "): ya estaba reflejado antes del checkpoint" });
      } else if (alreadyApplied) {
        redoLog.push({ record: r, applied: false, reason: "el pageLSN en disco (" + disk[r.page].pageLSN + ") ya cubre este cambio" });
      } else {
        disk[r.page] = { value: r.new, pageLSN: r.lsn };
        redoLog.push({ record: r, applied: true, reason: null });
      }
    });

    // --- Undo (solo InnoDB / ARIES completo) ---
    // ARIES: para cada perdedora se parte de su último registro. Si es un CLR, lo
    // que compensó ya está deshecho (Redo lo repitió): se salta a su undoNextLsn sin
    // volver a deshacerlo. Si es un UPDATE, se deshace (con un CLR nuevo) y se sigue
    // por el update anterior de la misma tx. Entre perdedoras, siempre el LSN mayor.
    var undoLog = [];
    if (mode === "innodb") {
      var byLsn = {};
      survivingLog.forEach(function (r) { byLsn[r.lsn] = r; });
      var prevUpdate = function (tx, lsn) {
        var prev = null;
        survivingLog.forEach(function (r) {
          if (r.type === "update" && r.tx === tx && r.lsn < lsn && (!prev || r.lsn > prev.lsn)) prev = r;
        });
        return prev ? prev.lsn : null;
      };
      var toUndo = {};
      losers.forEach(function (tx) {
        var last = null;
        survivingLog.forEach(function (r) {
          if ((r.type === "update" || r.type === "clr") && r.tx === tx && (!last || r.lsn > last)) last = r.lsn;
        });
        if (last != null) toUndo[tx] = last;
      });
      var synthetic = survivingLog.reduce(function (m, r) { return Math.max(m, r.lsn); }, 0);
      var guard = 0;
      while (Object.keys(toUndo).length && guard++ < 1000) {
        var nextTx = null;
        Object.keys(toUndo).forEach(function (tx) { if (nextTx === null || toUndo[tx] > toUndo[nextTx]) nextTx = tx; });
        var rec = byLsn[toUndo[nextTx]];
        var follow = null;
        if (rec.type === "clr") {
          undoLog.push({ kind: "skip", lsn: null, tx: rec.tx, page: rec.page, undoesLsn: rec.undoesLsn, clrLsn: rec.lsn, undoNextLsn: rec.undoNextLsn, restored: null });
          follow = rec.undoNextLsn;
        } else {
          synthetic += 1;
          disk[rec.page] = { value: rec.old, pageLSN: synthetic };
          undoLog.push({ kind: "undo", lsn: synthetic, tx: rec.tx, page: rec.page, undoesLsn: rec.lsn, restored: rec.old });
          follow = prevUpdate(rec.tx, rec.lsn);
        }
        if (follow == null) delete toUndo[nextTx];
        else toUndo[nextTx] = follow;
      }
    }

    return {
      mode: mode,
      checkpointLsn: lastCkpt ? lastCkpt.lsn : null,
      analysisSteps: analysisSteps,
      activeAtCheckpoint: lastCkpt ? lastCkpt.activeTx : [],
      dirtyAtCheckpoint: lastCkpt ? lastCkpt.dirtyPages : [],
      dirtyPageTable: dptEntries,
      losers: losers,
      minRecLsn: minRecLsn === Infinity ? null : minRecLsn,
      redoLog: redoLog,
      undoLog: undoLog,
      finalDisk: disk,
    };
  }

  /** Valor que la página DEBERÍA tener tras recuperar: el inicial más los
   * cambios de las transacciones cuyo COMMIT sobrevivió en el log. */
  function committedValue(scenario, fullLog, survivingLog, page) {
    var committed = {};
    survivingLog.forEach(function (r) { if (r.type === "commit") committed[r.tx] = true; });
    var v = scenario.initialPages[page];
    fullLog.forEach(function (r) {
      if (r.type === "update" && r.page === page && committed[r.tx]) v = r.new;
    });
    return v;
  }

  /** Analiza qué pasó con la violación insertada por `withViolation`.
   * "irreversible" = la página terminó, tras recuperar, con un valor de una
   * transacción que no tiene COMMIT en el log sobreviviente (sea perdedora o
   * desconocida para ARIES porque no sobrevivió ni su BEGIN). */
  function analyzeInjectedViolation(scenario, entries, crashIdx, crashState, recoverResult) {
    var flushStep = null;
    for (var i = 0; i < scenario.steps.length; i += 1) {
      if (scenario.steps[i].injected) { flushStep = scenario.steps[i]; break; }
    }
    if (!flushStep) return { outcome: "no-hay-violacion" };
    var page = flushStep.page;
    var fullLog = entries[crashIdx].log;
    var firstUpdate = fullLog.filter(function (r) { return r.type === "update" && r.page === page; })[0];
    if (!firstUpdate) return { outcome: "no-hay-violacion" };
    var recordSurvived = crashState.survivingLog.some(function (r) { return r.lsn === firstUpdate.lsn; });
    var isLoser = recoverResult.losers.indexOf(firstUpdate.tx) !== -1;
    var committed = crashState.survivingLog.some(function (r) { return r.type === "commit" && r.tx === firstUpdate.tx; });
    var expected = committedValue(scenario, fullLog, crashState.survivingLog, page);
    var finalValue = recoverResult.finalDisk[page] ? recoverResult.finalDisk[page].value : null;
    var outcome;
    if (finalValue !== expected) outcome = "irreversible";
    else if (committed) outcome = "sin-consecuencia";
    else outcome = "sin-dano-esta-vez";
    return {
      outcome: outcome, page: page, tx: firstUpdate.tx, updateLsn: firstUpdate.lsn,
      recordSurvived: recordSurvived, isLoser: isLoser, committed: committed,
      expectedValue: expected, finalValue: finalValue,
    };
  }

  /** Compara el valor final de cada página con y sin la violación insertada
   * (mismo preset, mismo punto de crash). */
  function diffWithWithoutViolation(basePreset, fsyncValue, crashKey, mode) {
    function run(allow) {
      var scenario = applyFsyncValue(withViolation(basePreset, allow), fsyncValue);
      var entries = runTimeline(scenario);
      var idx = findIndexByKey(scenario.steps, crashKey);
      var crashState = crashAt(entries, idx);
      var recover = ariesRecover(crashState, scenario.initialPages, mode);
      return recover.finalDisk;
    }
    var without = run(false);
    var withV = run(true);
    var pages = {};
    Object.keys(without).forEach(function (p) { pages[p] = true; });
    Object.keys(withV).forEach(function (p) { pages[p] = true; });
    var diffs = [];
    Object.keys(pages).forEach(function (p) {
      var a = without[p] ? without[p].value : null;
      var b = withV[p] ? withV[p].value : null;
      if (a !== b) diffs.push({ page: p, sinViolacion: a, conViolacion: b });
    });
    return diffs;
  }

  // ---- retos (predicados puros, testeables) ----

  function checkReto1(entries, crashIdx, recoverResult) {
    var vs = entries[crashIdx].violations;
    return vs.some(function (v) {
      return v.kind === "confirm-before-fsync" && recoverResult.losers.indexOf(v.tx) !== -1;
    });
  }

  function checkReto2(violationOn, injectedAnalysis) {
    return violationOn === true && injectedAnalysis && injectedAnalysis.outcome === "irreversible";
  }

  // ---- escenarios precargados ----

  var PRESETS = [
    {
      id: "golden",
      label: "La regla de oro (modificar → loguear → fsync → confirmar)",
      origen: "Clase 11(B), slide 4 — caso propio con los mismos cuatro pasos",
      initialPages: { P1: 100 },
      steps: [
        { key: "b1", type: "begin", tx: "T1" },
        { key: "u1", type: "update", tx: "T1", page: "P1", oldVal: 100, newVal: 150 },
        { key: "c1", type: "commit", tx: "T1" },
        { key: "f1", type: "fsync", adjustable: true, upto: "latest" },
        { key: "k1", type: "confirm", tx: "T1" },
      ],
      defaultCrashKey: "k1",
    },
    {
      id: "checkpoint",
      label: "Con checkpoint de por medio",
      origen: "Clase 11(B), slides 6 y 11 — caso propio",
      initialPages: { P1: 100, P2: 200 },
      steps: [
        { key: "b1", type: "begin", tx: "T1" },
        { key: "u1", type: "update", tx: "T1", page: "P1", oldVal: 100, newVal: 150 },
        { key: "b2", type: "begin", tx: "T2" },
        { key: "u2", type: "update", tx: "T2", page: "P2", oldVal: 200, newVal: 250 },
        { key: "c1", type: "commit", tx: "T1" },
        { key: "f1", type: "fsync", upto: "latest" },
        { key: "k1", type: "confirm", tx: "T1" },
        { key: "ck", type: "checkpoint" },
        { key: "u3", type: "update", tx: "T2", page: "P2", oldVal: 250, newVal: 300 },
        { key: "f2", type: "fsync", adjustable: true, upto: "latest" },
        { key: "fl2", type: "flush", page: "P2" },
      ],
      defaultCrashKey: "f2",
    },
    {
      id: "abort",
      label: "Una transacción abortada antes del crash",
      origen: "Clase 11(B), slides 5-6 — caso propio",
      initialPages: { P1: 100, P2: 200 },
      steps: [
        { key: "b1", type: "begin", tx: "T1" },
        { key: "u1", type: "update", tx: "T1", page: "P1", oldVal: 100, newVal: 150 },
        { key: "b2", type: "begin", tx: "T2" },
        { key: "u2", type: "update", tx: "T2", page: "P2", oldVal: 200, newVal: 300 },
        { key: "ab1", type: "abort", tx: "T1" },
        { key: "u3", type: "update", tx: "T2", page: "P2", oldVal: 300, newVal: 350 },
        { key: "f1", type: "fsync", adjustable: true, upto: "latest" },
      ],
      defaultCrashKey: "f1",
    },
    {
      id: "nofsync",
      label: "COMMIT sin fsync",
      origen: "Clase 11(B), slides 4 y 8 (synchronous_commit) — caso propio",
      initialPages: { P1: 500 },
      steps: [
        { key: "b1", type: "begin", tx: "T1" },
        { key: "u1", type: "update", tx: "T1", page: "P1", oldVal: 500, newVal: 600 },
        { key: "c1", type: "commit", tx: "T1" },
        { key: "f1", type: "fsync", adjustable: true, upto: 2 },
        { key: "k1", type: "confirm", tx: "T1" },
      ],
      defaultCrashKey: "k1",
    },
  ];

  App.bdiiLab.engines["recovery-wal"] = {
    runTimeline: runTimeline,
    withViolation: withViolation,
    findIndexByKey: findIndexByKey,
    findAdjustableFsyncIndex: findAdjustableFsyncIndex,
    maxAdjustableUpto: maxAdjustableUpto,
    applyFsyncValue: applyFsyncValue,
    crashAt: crashAt,
    ariesRecover: ariesRecover,
    analyzeInjectedViolation: analyzeInjectedViolation,
    diffWithWithoutViolation: diffWithWithoutViolation,
    checkReto1: checkReto1,
    checkReto2: checkReto2,
    PRESETS: PRESETS,
  };

  // ==================================================================
  // Interfaz
  // ==================================================================

  var engine = App.bdiiLab.engines["recovery-wal"];

  function presetById(id) {
    for (var i = 0; i < PRESETS.length; i += 1) if (PRESETS[i].id === id) return PRESETS[i];
    return PRESETS[0];
  }

  function describeStep(step, entry) {
    var parts = [];
    entry.produced.forEach(function (rec) {
      if (rec.type === "begin") {
        parts.push("BEGIN " + rec.tx + "  (LSN " + rec.lsn + ")");
      } else if (rec.type === "update") {
        parts.push("UPDATE " + rec.tx + " página " + rec.page + ": " + rec.old + " → " + rec.new + "  (LSN " + rec.lsn + ")");
      } else if (rec.type === "commit") {
        parts.push("COMMIT " + rec.tx + "  (LSN " + rec.lsn + ")");
      } else if (rec.type === "abort") {
        parts.push("ABORT " + rec.tx + "  (LSN " + rec.lsn + ") — decide deshacer sus cambios");
      } else if (rec.type === "clr") {
        parts.push("CLR: deshace LSN " + rec.undoesLsn + " (" + rec.tx + ", " + rec.page + "): restaura " + rec.new + "  (LSN " + rec.lsn + ") — (ampliación)");
      } else if (rec.type === "end") {
        parts.push("END " + rec.tx + "  (LSN " + rec.lsn + ") — deshecha por completo");
      } else if (rec.type === "checkpoint") {
        var act = rec.activeTx.length ? rec.activeTx.join(", ") : "ninguna";
        var dp = rec.dirtyPages.length
          ? rec.dirtyPages.map(function (d) { return d.page + " (recLSN " + d.recLSN + ")"; }).join(", ")
          : "ninguna";
        parts.push("CHECKPOINT  (LSN " + rec.lsn + ") — activas: " + act + "; sucias: " + dp + " — (ampliación)");
      }
    });
    if (step.type === "flush") {
      var v = entry.violations.some(function (x) { return x.stepKey === step.key; });
      var flushedLsn = entry.disk[step.page] ? entry.disk[step.page].pageLSN : null;
      parts.push(
        "evento de sistema: FLUSH página " + step.page + " a disco (pageLSN " + flushedLsn + ")" +
          (step.injected ? " (violación insertada)" : "") +
          (v ? " — ✗ viola la regla del WAL" : " — ✓ respeta la regla"),
      );
    } else if (step.type === "fsync") {
      parts.push("evento de sistema: fsync del log hasta LSN " + entry.fsyncedUpTo);
    } else if (step.type === "confirm") {
      var vc = entry.violations.some(function (x) { return x.stepKey === step.key; });
      parts.push(
        "evento de sistema: CONFIRMAR a cliente — COMMIT " + step.tx + (vc ? " — ✗ confirmado sin fsync" : " — ✓ durable"),
      );
    }
    return parts;
  }

  lab.tool(
    {
      id: "recovery-wal",
      title: "Recovery: write-ahead logging y ARIES",
      subtitle: "Recorra un log con LSN y eventos de sistema (FLUSH, fsync), elija dónde cae el crash y vea cómo Analysis-Redo-Undo reconstruye el estado — con o sin violar la regla de oro del WAL.",
      sources: [
        { stem: "Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL", label: "Clase 11(B)" },
        { stem: "1.11.05 - Recovery y write-ahead logging (WAL)", label: "WAL" },
        { stem: "1.11.06 - ARIES — análisis, redo y undo", label: "ARIES" },
        { stem: "1.11.03 - Transacciones y ACID", label: "ACID" },
        { stem: "1.11.04 - Control de concurrencia y niveles de aislamiento", label: "MVCC" },
        { stem: "MySQL", label: "MySQL" },
        { stem: "PostgreSQL", label: "PostgreSQL" },
      ],
      figure: { id: "lab-recovery-wal", caption: "Recovery con WAL y ARIES: elija el crash y vea qué recupera el motor.", height: 320 },
    },
    function mount(body, ctxObj) {
      var h = lab.h;
      var mode = ctxObj && ctxObj.mode;
      var isFigure = mode === "figure";

      var state = {
        presetId: "golden",
        engineMode: "innodb",
        violationOn: false,
        fsyncValue: null,
        crashKey: null,
      };

      function currentBaseScenario() {
        var preset = presetById(state.presetId);
        return { initialPages: preset.initialPages, steps: preset.steps };
      }

      function currentScenario() {
        var withV = engine.withViolation(currentBaseScenario(), state.violationOn);
        return engine.applyFsyncValue(withV, state.fsyncValue);
      }

      function resetForPreset() {
        var preset = presetById(state.presetId);
        state.violationOn = false;
        var scenario = currentBaseScenario();
        var max = engine.maxAdjustableUpto(scenario);
        var idx = engine.findAdjustableFsyncIndex(scenario.steps);
        var defaultUpto = idx === -1 ? 0 : (scenario.steps[idx].upto === "latest" ? max : scenario.steps[idx].upto);
        state.fsyncValue = defaultUpto;
        state.crashKey = preset.defaultCrashKey;
      }

      // ---- controles ----

      var presetCtrl = lab.presetPicker({
        label: "Escenario precargado",
        presets: PRESETS,
        onPick: function (preset) {
          state.presetId = preset.id;
          resetForPreset();
          render();
        },
      });

      var modeCtrl = lab.segmented({
        label: "Motor",
        options: [
          { value: "innodb", label: "InnoDB (ARIES completo)" },
          { value: "postgres", label: "PostgreSQL (redo-only)" },
        ],
        value: state.engineMode,
        onChange: function (v) { state.engineMode = v; render(); },
      });

      var violationCtrl = lab.toggle({
        label: "Permitir violar la regla del WAL (bajar una página a disco antes que su log)",
        checked: state.violationOn,
        onChange: function (v) { state.violationOn = v; render(); },
      });

      var fsyncCtrl = lab.slider({
        label: "fsync del log hasta LSN n (arrastrar para simular un fsync más temprano o más tardío)",
        min: 0, max: 1, step: 1, value: 0,
        format: function (v) { return "LSN " + Math.round(v); },
        onChange: function (v) { state.fsyncValue = Math.round(v); render(); },
      });

      var stepsHost = h("div", { class: "lab-recovery-wal-steps", role: "list" });
      var zonesHost = h("div", { class: "lab-recovery-wal-zones", "aria-live": "polite" });
      var violPanelHost = h("div", { "aria-live": "polite" });
      var retosHost = h("div", {});

      // se declara ANTES del stepper: `stepper()` llama a `render(0)` de
      // forma sincrónica al construirse, y ese primer render ya necesita
      // leer `recoverCache` (con resultado nulo hasta el primer cálculo).
      var recoverCache = { scenario: null, entries: null, crashIdx: 0, crashState: null, result: null, injected: null };

      var ariesStepIdx = { value: 0 };
      var stepperCtrl = lab.stepper({
        count: 4,
        label: "Fase de recuperación",
        render: function (i) {
          ariesStepIdx.value = i;
          return renderAriesStep(i);
        },
      });

      function renderAriesStep(i) {
        var r = recoverCache.result;
        if (!r) return h("p", {}, "—");
        if (i === 0) {
          return h(
            "div", {},
            h("h4", {}, "1 · Analysis"),
            r.mode === "postgres"
              ? lab.callout("info", "Simplificación del laboratorio en modo PostgreSQL",
                h("p", {}, "PostgreSQL no construye esta fase: lee la posición del último checkpoint desde pg_control y reproduce el WAL desde ahí, sin tabla de transacciones activas ni de páginas sucias (1.11.06 § 5). Se muestra solo para comparar con InnoDB."))
              : null,
            h("p", {}, "Comienza en el último CHECKPOINT sobreviviente"
              + (r.checkpointLsn != null ? " (LSN " + r.checkpointLsn + ")" : " — no hay checkpoint en el log sobreviviente, así que parte desde el principio") + "."),
            r.checkpointLsn != null
              ? h("p", {}, "Estado que trae el checkpoint — activas: " + (r.activeAtCheckpoint.length ? r.activeAtCheckpoint.join(", ") : "ninguna")
                + "; sucias: " + (r.dirtyAtCheckpoint.length ? r.dirtyAtCheckpoint.map(function (d) { return d.page + " (recLSN " + d.recLSN + ")"; }).join(", ") : "ninguna") + ".")
              : null,
            lab.table({
              caption: "Registros procesados después del checkpoint (o desde el principio)",
              columns: [{ key: "lsn", label: "LSN", mono: true }, { key: "note", label: "Qué hace" }],
              rows: r.analysisSteps.length ? r.analysisSteps : [{ lsn: "—", note: "nada que agregar: el checkpoint ya lo tenía todo" }],
            }),
            lab.table({
              caption: "Tabla de transacciones activas al terminar Analysis — perdedoras (se deshacen)",
              columns: [{ key: "tx", label: "Transacción", mono: true }],
              rows: r.losers.length ? r.losers.map(function (t) { return { tx: t }; }) : [{ tx: "ninguna" }],
            }),
            lab.table({
              caption: "Tabla de páginas sucias (recLSN) — (ampliación: Mohan et al. 1992, sin bibliografía en el vault; ver 1.11.06 § 7.6)",
              columns: [{ key: "page", label: "Página" }, { key: "recLSN", label: "recLSN", mono: true }],
              rows: r.dirtyPageTable.length ? r.dirtyPageTable : [{ page: "ninguna", recLSN: null }],
            }),
          );
        }
        if (i === 1) {
          return h(
            "div", {},
            h("h4", {}, "2 · Redo"),
            h("p", {}, "Repite la historia desde el menor recLSN (" + (r.minRecLsn == null ? "no hay páginas sucias" : "LSN " + r.minRecLsn) + ") hasta el final del log sobreviviente: se re-aplica un registro solo si su página está sucia y su pageLSN en disco todavía no lo cubre."),
            lab.table({
              caption: "Registros recorridos por Redo",
              columns: [
                { key: "lsn", label: "LSN", mono: true },
                { key: "que", label: "Registro" },
                { key: "aplicado", label: "¿Se aplica?" },
                { key: "motivo", label: "Motivo si se omitió" },
              ],
              rows: r.redoLog.map(function (x) {
                var rec = x.record;
                var que = rec.type === "clr"
                  ? "CLR de LSN " + rec.undoesLsn + " (" + rec.tx + ", " + rec.page + ")"
                  : "UPDATE " + rec.tx + " " + rec.page + ": → " + rec.new;
                return { lsn: rec.lsn, que: que, aplicado: x.applied ? "sí" : "no (se omite)", motivo: x.reason };
              }),
              rowClass: function (row) { return row.aplicado === "sí" ? "lab-recovery-wal-row-applied" : "lab-recovery-wal-row-skipped"; },
            }),
          );
        }
        if (i === 2) {
          if (r.mode === "postgres") {
            return h(
              "div", {},
              h("h4", {}, "3 · Undo — no corre en modo PostgreSQL"),
              lab.callout(
                "info",
                "PostgreSQL no tiene una fase de Undo explícita",
                h("p", {}, "El Redo de arriba ya reaplicó físicamente los cambios de TODAS las transacciones, incluidas las perdedoras "
                  + (r.losers.length ? "(" + r.losers.join(", ") + ")" : "") + ": es el mismo mecanismo que en InnoDB. Lo que evita que se vean es que, "
                  + "gracias a MVCC, las filas que escribió una transacción que nunca comprometió no se marcan visibles para ningún lector — "
                  + "el motor simplemente 'no aplica' esos cambios en el sentido de que nadie los va a leer. Es el mismo MVCC que "),
                lab.pageLink("1.11.04 - Control de concurrencia y niveles de aislamiento", "1.11.04"),
                h("span", {}, " documenta para lecturas consistentes. (ampliación de esta herramienta: el deck lo dice a nivel abstracto — 'no se aplican los cambios' — sin bajar a bytes de página; esta simulación sí lo muestra a ese nivel.)"),
              ),
            );
          }
          return h(
            "div", {},
            h("h4", {}, "3 · Undo (InnoDB / ARIES completo)"),
            h("p", {}, "Deshace, en orden LSN descendente, los cambios de las transacciones perdedoras, escribiendo un CLR por cada uno. Si la perdedora ya había empezado a deshacerse antes del crash, sus CLR sobrevivientes dicen qué ya está compensado: Undo salta a su undoNextLSN y no repite ese trabajo (ampliación: el deck no usa el término CLR; Mohan et al. 1992, sin bibliografía en el vault — ver "),
            lab.pageLink("1.11.06 - ARIES — análisis, redo y undo", "1.11.06 § 7.6"),
            h("span", {}, ")."),
            lab.table({
              caption: "Undo: CLRs generados y CLRs sobrevivientes que evitan repetir trabajo",
              columns: [
                { key: "lsn", label: "LSN", mono: true },
                { key: "tx", label: "Tx", mono: true },
                { key: "page", label: "Página" },
                { key: "undoesLsn", label: "Deshace LSN", mono: true },
                { key: "restored", label: "Restaura" },
              ],
              rows: r.undoLog.length
                ? r.undoLog.map(function (u) {
                  if (u.kind !== "skip") return u;
                  return {
                    lsn: "— (no se escribe)", tx: u.tx, page: u.page, undoesLsn: u.undoesLsn,
                    restored: "no se repite: ya lo compensó el CLR " + u.clrLsn + " antes del crash; sigue en undoNextLSN " +
                      (u.undoNextLsn == null ? "(ninguno: " + u.tx + " no tiene más que deshacer)" : u.undoNextLsn),
                  };
                })
                : [{ lsn: "—", tx: "—", page: "—", undoesLsn: "—", restored: "no hubo perdedoras que deshacer" }],
            }),
          );
        }
        var rows = Object.keys(r.finalDisk).map(function (p) {
          var atCrash = recoverCache.crashState.diskAtCrash[p];
          return {
            page: p,
            enDiscoAlCrash: atCrash ? atCrash.value : "—",
            final: r.finalDisk[p].value,
          };
        });
        return h(
          "div", {},
          h("h4", {}, "4 · Estado final"),
          lab.table({
            caption: "Valor en disco antes de recuperar vs. después de Analysis-Redo-Undo",
            columns: [
              { key: "page", label: "Página" },
              { key: "enDiscoAlCrash", label: "En disco al crash (antes de recuperar)", mono: true },
              { key: "final", label: "Final, tras la recuperación", mono: true },
            ],
            rows: rows,
          }),
        );
      }

      function render() {
        var scenario = currentScenario();
        var entries = engine.runTimeline(scenario);
        var max = engine.maxAdjustableUpto(currentBaseScenario());
        fsyncCtrl.el.querySelector("input").max = String(max);
        fsyncCtrl.set(Math.min(state.fsyncValue == null ? max : state.fsyncValue, max));
        var presetIdx = -1;
        for (var pi = 0; pi < PRESETS.length; pi += 1) { if (PRESETS[pi].id === state.presetId) { presetIdx = pi; break; } }
        if (presetIdx !== -1) presetCtrl.set(String(presetIdx));
        modeCtrl.set(state.engineMode);
        violationCtrl.set(state.violationOn);

        if (state.presetId === "nofsync") {
          presetNoteHost.replaceChildren(
            lab.callout(
              "info",
              "Qué parámetro modela este preset: synchronous_commit / innodb_flush_log_at_trx_commit",
              h(
                "p", {},
                "El paso 'fsync del log hasta LSN n' con el slider por debajo del LSN del COMMIT es lo que produce, en PostgreSQL, ",
                h("code", {}, "synchronous_commit = off"),
                ": el COMMIT se confirma al cliente sin esperar el fsync del WAL (slide 8; ",
                lab.pageLink("1.11.05 - Recovery y write-ahead logging (WAL)", "1.11.05 § 4"),
                "). En InnoDB el parámetro equivalente es ",
                h("code", {}, "innodb_flush_log_at_trx_commit"),
                " distinto de 1: con el valor por omisión (1) el redo log se fuerza a disco en cada COMMIT, y esta simulación de un COMMIT sin fsync no podría ocurrir.",
              ),
            ),
          );
        } else {
          presetNoteHost.replaceChildren();
        }

        modeNoteHost.replaceChildren(
          h(
            "p", {},
            state.engineMode === "innodb"
              ? "InnoDB (ARIES completo: redo log + undo log). Al reiniciar, Analysis reconstruye qué estaba activo y qué páginas sucias había; Redo repite la historia entera; Undo deshace, con CLRs, lo que quedó sin comprometer."
              : "PostgreSQL: redo desde el último checkpoint (su posición se lee de pg_control), sin la fase de Analysis de ARIES ni fase de Undo: MVCC deja invisibles las versiones de las abortadas — las filas de una transacción que nunca comprometió quedan físicamente en la página, pero nunca se marcan visibles (1.11.06 § 5). El panel de Analysis de abajo es una simplificación del laboratorio en este modo.",
          ),
          lab.callout(
            "warn",
            "Gotcha de examen (slide 11): esta herramienta simula el redo log, no el binlog",
            h("p", {}, "El log con LSN de este laboratorio es el WAL/redo log — el que usa la fase Redo de ARIES para el crash recovery. El binlog de MySQL es un log lógico aparte (sentencias o filas), para replicación y PITR: no participa de esta simulación ni de la recuperación tras un crash. Mantener los dos sincronizados es lo que obliga al two-phase commit interno entre redo log y binlog que el deck describe — algo que PostgreSQL no necesita, porque tiene un único WAL."),
          ),
        );

        var crashIdx = engine.findIndexByKey(scenario.steps, state.crashKey);
        if (crashIdx < 0 || crashIdx >= entries.length) crashIdx = entries.length - 1;

        // ---- lista de pasos, clicables para elegir el crash ----
        stepsHost.replaceChildren();
        entries.forEach(function (entry, idx) {
          var isCurrent = idx === crashIdx;
          var lines = describeStep(entry.step, entry);
          var btn = h(
            "button",
            {
              type: "button",
              class: "lab-recovery-wal-step" + (isCurrent ? " lab-recovery-wal-step--current" : ""),
              "aria-pressed": isCurrent ? "true" : "false",
              on: {
                click: function () {
                  state.crashKey = entry.step.key;
                  render();
                },
              },
            },
            h("span", { class: "lab-recovery-wal-step-marker" }, isCurrent ? "✓ crash aquí" : "elegir"),
            h("div", {}, lines.map(function (t) { return h("div", {}, t); })),
          );
          stepsHost.appendChild(h("div", { role: "listitem" }, btn));
        });

        // ---- violaciones detectadas hasta el crash ----
        violPanelHost.replaceChildren();
        var vs = entries[crashIdx].violations;
        if (!vs.length) {
          violPanelHost.appendChild(lab.callout("ok", "Ninguna violación de la regla del WAL hasta este punto", h("p", {}, "Toda página bajó a disco después de que su registro estuviera fsyncado, y todo COMMIT se confirmó después del fsync.")));
        } else {
          vs.forEach(function (v) {
            if (v.kind === "flush-before-log") {
              violPanelHost.appendChild(
                lab.callout(
                  "bad",
                  "Página " + v.page + " bajó a disco antes que su registro (LSN " + v.pageLSN + ")",
                  h("p", {}, "En ese momento el log solo estaba fsyncado hasta LSN " + v.fsyncedUpTo + ". Viola la primera frase de la regla de oro (slide 4): 'antes de escribir una página modificada a disco hay que escribir primero al log, en disco, el registro que describe ese cambio'."),
                ),
              );
            } else {
              violPanelHost.appendChild(
                lab.callout(
                  "bad",
                  "Se confirmó el COMMIT de " + v.tx + " sin fsync",
                  h("p", {}, "El registro de COMMIT quedó en LSN " + v.commitLsn + ", pero el log solo estaba fsyncado hasta LSN " + v.fsyncedUpTo + " cuando se avisó al cliente. Viola el paso 3→4 de la regla de oro (slide 4): 'antes de confirmar un COMMIT al cliente, el log de esa transacción tiene que estar físicamente en disco (fsync)'."),
                ),
              );
            }
          });
        }

        var crashState = engine.crashAt(entries, crashIdx);
        var result = engine.ariesRecover(crashState, scenario.initialPages, state.engineMode);
        var injected = engine.analyzeInjectedViolation(scenario, entries, crashIdx, crashState, result);
        recoverCache = { scenario: scenario, entries: entries, crashIdx: crashIdx, crashState: crashState, result: result, injected: injected };

        if (state.violationOn && injected.outcome !== "no-hay-violacion") {
          var msg;
          var kind;
          if (injected.outcome === "irreversible") {
            kind = "bad";
            msg = "El registro que permitiría deshacer el cambio de " + injected.tx + " en la página " + injected.page
              + " (LSN " + injected.updateLsn + ") no sobrevivió al crash, y " + injected.tx + " no tiene COMMIT en el log sobreviviente"
              + (injected.isLoser ? " (terminó perdedora)" : " (ARIES ni siquiera sabe que existió: no sobrevivió ninguno de sus registros)") + ". "
              + "Resultado: un cambio no deshacible — la página queda con " + injected.finalValue + " en lugar de " + injected.expectedValue
              + ", un valor que nunca debió persistir, y ARIES no tiene con qué corregirlo.";
          } else if (injected.outcome === "sin-dano-esta-vez") {
            kind = "warn";
            msg = "Hubo una ventana en la que la página " + injected.page + " tenía en disco un cambio que el log todavía no respaldaba, "
              + "pero el registro (LSN " + injected.updateLsn + ") terminó sobreviviendo al crash de todos modos: Undo lo encontró y lo deshizo bien. "
              + "No rompió nada esta vez, pero fue cuestión de dónde cayó el crash, no de que la regla se haya respetado.";
          } else {
            kind = "info";
            msg = injected.tx + " terminó comprometida: la página " + injected.page + " debía quedar con ese valor de todos modos.";
          }
          violPanelHost.appendChild(lab.callout(kind, "Consecuencia de la violación insertada", h("p", {}, msg)));
        }

        // ---- tres zonas al momento del crash ----
        zonesHost.replaceChildren();
        var bufEntry = entries[crashIdx];
        zonesHost.appendChild(
          lab.panel(
            "Buffer pool (RAM) — se pierde entero en el crash",
            lab.table({
              columns: [{ key: "page", label: "Página" }, { key: "value", label: "Valor" }, { key: "pageLSN", label: "pageLSN", mono: true }],
              rows: Object.keys(bufEntry.buffer).map(function (p) { return { page: p, value: bufEntry.buffer[p].value, pageLSN: bufEntry.buffer[p].pageLSN }; }),
            }),
          ),
        );
        zonesHost.appendChild(
          lab.panel(
            "Páginas en disco — sobreviven",
            lab.table({
              columns: [{ key: "page", label: "Página" }, { key: "value", label: "Valor" }, { key: "pageLSN", label: "pageLSN", mono: true }],
              rows: Object.keys(bufEntry.disk).map(function (p) { return { page: p, value: bufEntry.disk[p].value, pageLSN: bufEntry.disk[p].pageLSN }; }),
            }),
          ),
        );
        zonesHost.appendChild(
          lab.panel(
            "Log en disco (fsyncado hasta LSN " + crashState.fsyncedUpTo + ")",
            lab.table({
              caption: "Sobrevive al crash",
              columns: [{ key: "lsn", label: "LSN", mono: true }, { key: "tipo", label: "Tipo" }, { key: "tx", label: "Tx" }],
              rows: crashState.survivingLog.map(function (r) { return { lsn: r.lsn, tipo: r.type, tx: r.tx || "—" }; }),
            }),
            crashState.lostRecords.length
              ? lab.callout("warn", "Se pierde en el crash (todavía en el buffer del log, no fsyncado)", lab.table({
                  columns: [{ key: "lsn", label: "LSN", mono: true }, { key: "tipo", label: "Tipo" }, { key: "tx", label: "Tx" }],
                  rows: crashState.lostRecords.map(function (r) { return { lsn: r.lsn, tipo: r.type, tx: r.tx || "—" }; }),
                }))
              : null,
          ),
        );

        stepperCtrl.go(Math.min(ariesStepIdx.value, 3));

        // ---- resumen compacto para la figura del wiki ----
        figResultHost.replaceChildren(
          h("p", {}, "Log sobreviviente: hasta LSN " + crashState.fsyncedUpTo + ". Perdedoras: "
            + (result.losers.length ? result.losers.join(", ") : "ninguna")
            + (result.undoLog.length ? " · Undo: " + result.undoLog.map(function (u) {
              return u.kind === "skip" ? "LSN " + u.undoesLsn + " ya compensado por el CLR " + u.clrLsn : "deshace LSN " + u.undoesLsn;
            }).join(", ") : "") + "."),
          lab.table({
            caption: "Valor de cada página: en disco al crash y tras la recuperación",
            columns: [
              { key: "page", label: "Página" },
              { key: "alCrash", label: "Al crash", mono: true },
              { key: "final", label: "Tras recuperar", mono: true },
            ],
            rows: Object.keys(result.finalDisk).map(function (p) {
              return { page: p, alCrash: crashState.diskAtCrash[p] ? crashState.diskAtCrash[p].value : "—", final: result.finalDisk[p].value };
            }),
          }),
        );

        // ---- retos ----
        renderRetos();
      }

      function renderRetos() {
        retosHost.replaceChildren();

        var fb1 = h("div", { class: "lab-recovery-wal-reto-feedback", "aria-live": "polite" });
        var fb2 = h("div", { class: "lab-recovery-wal-reto-feedback", "aria-live": "polite" });
        var fb3 = h("div", { class: "lab-recovery-wal-reto-feedback", "aria-live": "polite" });

        retosHost.appendChild(
          lab.panel(
            "Reto 1 — un COMMIT confirmado que igual se pierde",
            h("p", {}, "Arme un log (con cualquier preset) donde el COMMIT de una transacción se confirme al cliente y, aun así, esa transacción termine deshecha por la recuperación. Pista: preset 'COMMIT sin fsync', slider de fsync por debajo del LSN del COMMIT."),
            lab.button({
              label: "Comprobar con la configuración actual",
              kind: "primary",
              onClick: function () {
                var ok = engine.checkReto1(recoverCache.entries, recoverCache.crashIdx, recoverCache.result);
                fb1.replaceChildren(
                  lab.callout(
                    ok ? "ok" : "warn",
                    ok ? "Correcto: hay un COMMIT confirmado que igual se deshizo." : "Todavía no: con esta configuración no hay ningún COMMIT confirmado que termine perdedor.",
                    null,
                  ),
                );
              },
            }).el,
            fb1,
          ),
        );

        retosHost.appendChild(
          lab.panel(
            "Reto 2 — un cambio no deshacible",
            h("p", {}, "Active 'permitir violar la regla del WAL' y arme un crash donde esa violación produzca un cambio que ARIES no puede deshacer."),
            lab.button({
              label: "Comprobar con la configuración actual",
              kind: "primary",
              onClick: function () {
                var ok = engine.checkReto2(state.violationOn, recoverCache.injected);
                fb2.replaceChildren(
                  lab.callout(
                    ok ? "ok" : "warn",
                    ok ? "Correcto: el cambio quedó sin poder deshacerse." : "Todavía no: con esta configuración la violación no produce un cambio irreversible.",
                    null,
                  ),
                );
              },
            }).el,
            fb2,
          ),
        );

        retosHost.appendChild(
          lab.panel(
            "Reto 3 — por qué PostgreSQL no tiene fase de Undo",
            h("p", {}, "Explique con sus palabras por qué, aunque InnoDB y PostgreSQL usan MVCC, solo PostgreSQL puede saltarse la fase de Undo de ARIES."),
            lab.button({
              label: "Ver / ocultar respuesta",
              onClick: function () {
                if (fb3.childNodes.length) {
                  fb3.replaceChildren();
                  return;
                }
                fb3.appendChild(
                  lab.callout(
                    "info", "Respuesta",
                    h("p", {}, "Las dos usan MVCC para dar lecturas consistentes, pero solo PostgreSQL usa la versión vieja de la tupla, que queda en la propia tabla, como mecanismo de recovery: abortar es simplemente 'no marcar visible' esa versión nueva, no hace falta escribir encima para deshacerla. InnoDB modifica la fila in place y guarda el valor viejo aparte, en el undo log — por eso si la transacción no comprometió, alguien tiene que ir a buscar ese valor viejo y reescribirlo: eso es Undo. (Slide 8 del deck; "),
                    lab.pageLink("1.11.04 - Control de concurrencia y niveles de aislamiento", "1.11.04"),
                    h("span", {}, " § 6 documenta el mismo contraste in place vs. tabla.)"),
                  ),
                );
              },
            }).el,
            fb3,
          ),
        );
      }

      var modeNoteHost = h("div", { "aria-live": "polite" });
      var presetNoteHost = h("div", { "aria-live": "polite" });
      var figResultHost = h("div", { "aria-live": "polite" });

      if (!isFigure) {
        body.appendChild(
          lab.grid(
            2,
            lab.panel("Escenario", presetCtrl.el, modeCtrl.el, violationCtrl.el, fsyncCtrl.el, presetNoteHost),
            lab.panel("¿Qué le pasa al modo elegido?", modeNoteHost),
          ),
        );
        body.appendChild(lab.panel("Log — haga clic en un registro para elegir dónde cae el crash", stepsHost));
        body.appendChild(lab.panel("¿Se violó la regla del WAL hasta ese punto?", violPanelHost));
        body.appendChild(lab.panel("Tres zonas en el momento del crash", zonesHost));
        body.appendChild(lab.panel("Recuperación ARIES paso a paso", stepperCtrl.el));
        body.appendChild(lab.panel("Retos", retosHost));
      } else {
        // Figura del wiki: solo lo esencial (escenario, dónde cae el crash y qué queda);
        // Analysis-Redo-Undo paso a paso, violaciones y retos quedan en el laboratorio completo.
        body.appendChild(lab.panel("Escenario", presetCtrl.el, modeCtrl.el, fsyncCtrl.el));
        body.appendChild(lab.panel("Log — haga clic en un registro para elegir dónde cae el crash", stepsHost));
        body.appendChild(lab.panel("Resultado de la recuperación", figResultHost));
      }

      resetForPreset();
      render();

      return function cleanup() {
        stepperCtrl.destroy();
      };
    },
  );
})();
