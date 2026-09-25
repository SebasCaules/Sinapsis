/* ============================================================
   bdii-lab / sharding.js — "Sharding y replica sets en MongoDB".

   Dos paneles independientes, con motor puro propio cada uno:

   1. Sharding: reparte un conjunto de documentos entre 2–6 shards por rango
      o por hash, simulando chunks e inserciones por lotes (como hace
      `sh.shardCollection` + el balancer real), y rutea una consulta.
   2. Replica set: primario + secundarios (+ árbitro opcional), con
      escritura (w:1 / w:majority), lectura (por readPreference), caída del
      primario, corte de red a un miembro y reconexión — con elección por
      mayoría y rollback de escrituras no replicadas.

   Vault: 2.12.02 (Escalabilidad horizontal — sharding y replicación),
   2.14.02 (Índices en MongoDB, la shard key lleva índice), Clase 14 -
   MongoDB Features (slides 40-44 y el handout Diferencia_Sharding_
   Replication), Clase 12 - Introduccion a NoSQL (slides 8, 9, 30, 31),
   motor MongoDB.md.
   ============================================================ */
(function () {
  "use strict";

  var App = window.App;
  if (!App) return;
  var lab = App.bdiiLab;
  if (!lab) return; // lib.js no se cargó antes: nada que hacer

  // ================================================================
  // Motor puro — sin DOM, testeable en Node. App.bdiiLab.engines.sharding
  // ================================================================

  // ---------- utilidades de clave ----------

  /** Hash didáctico: FNV-1a de 32 bits + un finalizador de mezcla (estilo
   *  MurmurHash3) porque los bits bajos de FNV-1a solo, sobre claves cortas
   *  y secuenciales (legajos, fechas), quedan mal distribuidos — se
   *  comprobó al probar el motor: sin el finalizador, cuatro shards podían
   *  quedar 3242/166/408/184 en vez de parejos. MongoDB usa un hash de 64
   *  bits derivado de MD5: esto solo sirve para mostrar "reparto uniforme
   *  por construcción", no reproduce el hash real. */
  function hashValue(str) {
    var s = String(str);
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b) >>> 0;
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35) >>> 0;
    h ^= h >>> 16;
    return h >>> 0;
  }

  function keyOf(doc, fields) {
    return fields.map(function (f) { return doc[f]; });
  }

  function compareValues(a, b) {
    if (a === b) return 0;
    if (typeof a === "number" && typeof b === "number") return a - b;
    var as = String(a), bs = String(b);
    return as < bs ? -1 : as > bs ? 1 : 0;
  }

  function compareKeys(a, b) {
    for (var i = 0; i < a.length; i++) {
      var c = compareValues(a[i], b[i]);
      if (c !== 0) return c;
    }
    return 0;
  }

  function keysEqual(a, b) {
    return compareKeys(a, b) === 0;
  }

  function compositeOf(key) {
    return key.map(String).join("\u0001");
  }

  function hashedShard(key, numShards) {
    return hashValue(compositeOf(key)) % numShards;
  }

  /** ¿La secuencia de claves no decrece nunca? (la condición que crea un
   *  "shard caliente" con sharding por rango: TODA escritura nueva cae en
   *  el chunk más a la derecha.) */
  function isMonotonic(keys) {
    for (var i = 1; i < keys.length; i++) {
      if (compareKeys(keys[i], keys[i - 1]) < 0) return false;
    }
    return true;
  }

  // ---------- sharding por rango: chunks ----------

  function findChunkIndex(chunks, key) {
    for (var i = 0; i < chunks.length; i++) {
      var c = chunks[i];
      var geMin = c.min === null || compareKeys(key, c.min) >= 0;
      var ltMax = c.max === null || compareKeys(key, c.max) < 0;
      if (geMin && ltMax) return i;
    }
    return chunks.length - 1;
  }

  function chunkCountByShard(chunks, numShards) {
    var counts = [];
    for (var s = 0; s < numShards; s++) counts.push(0);
    chunks.forEach(function (c) { counts[c.shard] += 1; });
    return counts;
  }

  /** El balancer real mueve chunks de a poco según su tamaño; aquí se
   *  simplifica a igualar la CANTIDAD de chunks por shard (desempate: el
   *  shard de menor índice). */
  function leastLoadedShard(chunks, numShards) {
    var counts = chunkCountByShard(chunks, numShards);
    var best = 0;
    for (var s = 1; s < numShards; s++) if (counts[s] < counts[best]) best = s;
    return best;
  }

  /** Divide el chunk `idx` en dos rangos [min, corte) y [corte, max).
   *  El corte tiene que caer ENTRE dos valores distintos de la shard key:
   *  un mismo valor nunca queda repartido en dos chunks (si no, el ruteo
   *  "targeted" de ese valor apuntaría a uno solo y perdería documentos).
   *  Si todos los documentos del chunk tienen la MISMA clave, no hay dónde
   *  cortar: MongoDB lo marca como chunk "jumbo" y lo deja crecer (es el
   *  costo de una shard key de baja cardinalidad). Devuelve true si dividió. */
  function splitChunkAt(chunks, idx, numShards) {
    var chunk = chunks[idx];
    var sorted = chunk.docs.slice().sort(function (a, b) { return compareKeys(a.key, b.key); });
    var cut = -1;
    var mid = Math.floor(sorted.length / 2);
    // el borde entre valores distintos más cercano a la mitad (primero hacia adelante)
    for (var j = Math.max(1, mid); j < sorted.length; j++) {
      if (!keysEqual(sorted[j].key, sorted[j - 1].key)) { cut = j; break; }
    }
    if (cut === -1) {
      for (var k = Math.min(mid, sorted.length - 1); k >= 1; k--) {
        if (!keysEqual(sorted[k].key, sorted[k - 1].key)) { cut = k; break; }
      }
    }
    if (cut === -1) return false;
    var midKey = sorted[cut].key;
    var left = { min: chunk.min, max: midKey, shard: chunk.shard, docs: sorted.slice(0, cut) };
    chunks.splice(idx, 1, left);
    var rightShard = leastLoadedShard(chunks, numShards);
    var right = { min: midKey, max: chunk.max, shard: rightShard, docs: sorted.slice(cut) };
    chunks.splice(idx + 1, 0, right);
    return true;
  }

  /** ¿El chunk superó la capacidad y no se puede dividir (un solo valor de clave)? */
  function isJumbo(chunk, chunkCapacity) {
    if (chunk.docs.length <= chunkCapacity) return false;
    for (var i = 1; i < chunk.docs.length; i++) if (!keysEqual(chunk.docs[i].key, chunk.docs[0].key)) return false;
    return true;
  }

  /** Inserta `docs` (en orden) en un cluster de rango, en lotes de
   *  `batchSize`, y devuelve una foto del estado después de cada lote:
   *  chunks (con sus rangos y su shard), reparto por shard y si hay shard
   *  caliente en ese momento. */
  function simulateRangeSharding(docs, shardKeyFields, numShards, chunkCapacity, batchSize) {
    var chunks = [{ min: null, max: null, shard: 0, docs: [] }];
    var keysSoFar = [];
    var snapshots = [];
    for (var start = 0; start < docs.length; start += batchSize) {
      var batch = docs.slice(start, start + batchSize);
      var perDoc = [];
      batch.forEach(function (doc) {
        var key = keyOf(doc, shardKeyFields);
        keysSoFar.push(key);
        var idx = findChunkIndex(chunks, key);
        chunks[idx].docs.push({ key: key, doc: doc });
        var split = false;
        var jumbo = false;
        if (chunks[idx].docs.length > chunkCapacity) {
          split = splitChunkAt(chunks, idx, numShards);
          jumbo = !split;
          idx = findChunkIndex(chunks, key);
        }
        perDoc.push({ doc: doc, key: key, shard: chunks[idx].shard, split: split, jumbo: jumbo });
      });
      var openChunk = null;
      for (var i = 0; i < chunks.length; i++) if (chunks[i].max === null) { openChunk = chunks[i]; break; }
      var monotonic = isMonotonic(keysSoFar);
      var hot = monotonic && keysSoFar.length > batchSize; // hace falta más de un lote para que "caliente" signifique algo
      var shardCounts = [];
      for (var s = 0; s < numShards; s++) shardCounts.push(0);
      chunks.forEach(function (c) { shardCounts[c.shard] += c.docs.length; });
      snapshots.push({
        batchDocs: batch,
        perDoc: perDoc,
        chunks: chunks.map(function (c) { return { min: c.min, max: c.max, shard: c.shard, count: c.docs.length, jumbo: isJumbo(c, chunkCapacity) }; }),
        shardCounts: shardCounts,
        monotonic: monotonic,
        hot: hot,
        hotShard: hot && openChunk ? openChunk.shard : null,
      });
    }
    return snapshots;
  }

  /** Reparto hashed: no hay chunks que mirar (el hash ya mezcla el orden);
   *  se calcula directo, también en lotes para que el histograma se pueda
   *  animar igual que el de rango. */
  function simulateHashedSharding(docs, shardKeyFields, numShards, batchSize) {
    var snapshots = [];
    var shardCounts = [];
    for (var s = 0; s < numShards; s++) shardCounts.push(0);
    for (var start = 0; start < docs.length; start += batchSize) {
      var batch = docs.slice(start, start + batchSize);
      var perDoc = batch.map(function (doc) {
        var key = keyOf(doc, shardKeyFields);
        var shard = hashedShard(key, numShards);
        shardCounts[shard] += 1;
        return { doc: doc, key: key, shard: shard };
      });
      snapshots.push({
        batchDocs: batch,
        perDoc: perDoc,
        chunks: null,
        shardCounts: shardCounts.slice(),
        monotonic: false,
        hot: false,
        hotShard: null,
      });
    }
    return snapshots;
  }

  function simulateInsert(docs, opts) {
    var batchSize = Math.max(1, opts.batchSize || Math.max(2, Math.ceil(docs.length / 6)));
    if (opts.strategy === "hashed") {
      return simulateHashedSharding(docs, opts.shardKeyFields, opts.numShards, batchSize);
    }
    return simulateRangeSharding(docs, opts.shardKeyFields, opts.numShards, opts.chunkCapacity || 3, batchSize);
  }

  /** Rutea una consulta: por la shard key completa → un solo shard
   *  (targeted); por cualquier otro campo → todos los shards
   *  (scatter-gather). */
  function routeQuery(model) {
    var allShards = [];
    for (var s = 0; s < model.numShards; s++) allShards.push(s);
    if (!model.byShardKey) {
      return { type: "scatter-gather", shards: allShards };
    }
    if (model.strategy === "hashed") {
      return { type: "targeted", shards: [hashedShard(model.keyValue, model.numShards)] };
    }
    var idx = findChunkIndex(model.chunks, model.keyValue);
    return { type: "targeted", shards: [model.chunks[idx].shard] };
  }

  // ================================================================
  // Motor puro — replica set
  // ================================================================

  function buildReplicaSet(n, hasArbiter) {
    var members = [];
    for (var i = 0; i < n; i++) {
      var isArbiter = hasArbiter && i === n - 1;
      members.push({
        id: i,
        role: isArbiter ? "ARBITER" : (i === 0 ? "PRIMARY" : "SECONDARY"),
        term: i === 0 && !isArbiter ? 1 : 0,
        up: true,
        isolated: false,
        catchingUp: false,
        oplog: isArbiter ? null : [],
      });
    }
    return {
      members: members,
      term: 1,
      nextSeq: 1,
      totalCount: n,
      dataCount: hasArbiter ? n - 1 : n,
      log: [],
      rollbacks: [],
    };
  }

  function electionMajority(state) { return Math.floor(state.totalCount / 2) + 1; }
  /** Mayoría necesaria para confirmar una escritura w:majority: el MENOR
   *  entre la mayoría de TODOS los miembros votantes (incluye árbitros en
   *  el denominador) y la cantidad de miembros con datos — porque un
   *  árbitro nunca puede confirmar una escritura (documentación oficial de
   *  MongoDB, "Write Concern": Calculated Majority = MIN(floor(miembros
   *  votantes/2)+1, miembros votantes con datos). Con árbitro y una
   *  cantidad IMPAR de nodos con datos, esto exige más nodos con datos que
   *  la cuenta ingenua floor(dataCount/2)+1 — por ejemplo, 3 nodos con
   *  datos + 1 árbitro necesitan que confirmen los 3, no 2. */
  function writeMajorityNeeded(state) {
    return Math.min(Math.floor(state.totalCount / 2) + 1, state.dataCount);
  }

  function reconcile(state) {
    // Un primario que ya no puede alcanzar una mayoría de miembros
    // votantes se retira (steps down) solo, igual que en un replica set
    // real tras electionTimeoutMillis — sea porque él mismo quedó aislado
    // (entonces no ve a nadie más, ni siquiera al resto del cluster que sí
    // se ve entre sí) o porque el grupo al que sigue perteneciendo no
    // alcanza la mayoría.
    state.members.forEach(function (m) {
      if (m.role !== "PRIMARY" || !m.up) return;
      var ownGroup = m.isolated
        ? [m]
        : state.members.filter(function (x) { return x.up && !x.isolated; });
      if (ownGroup.length < electionMajority(state)) {
        state.log.push("M" + m.id + " pierde contacto con la mayoría (" + ownGroup.length + "/" + state.totalCount + "): se retira como primario.");
        m.role = "SECONDARY";
      }
    });
    var cluster = state.members.filter(function (m) { return m.up && !m.isolated; });
    var primaryInCluster = cluster.filter(function (m) { return m.role === "PRIMARY"; })[0];
    if (primaryInCluster) return state;
    if (cluster.length >= electionMajority(state)) {
      var candidates = cluster.filter(function (m) { return m.role !== "ARBITER"; });
      if (!candidates.length) return state;
      candidates.sort(function (a, b) {
        var la = a.oplog ? a.oplog.length : 0, lb = b.oplog ? b.oplog.length : 0;
        return lb - la || a.id - b.id;
      });
      var winner = candidates[0];
      state.term += 1;
      winner.role = "PRIMARY";
      winner.term = state.term;
      cluster.forEach(function (m) { if (m.id !== winner.id && m.role !== "ARBITER") m.role = "SECONDARY"; });
      state.log.push("Elección: mayoría (" + cluster.length + "/" + state.totalCount + ") elige a M" + winner.id + " como primario (término " + state.term + ").");
    } else {
      state.log.push("Sin mayoría (" + cluster.length + "/" + state.totalCount + " nodos se comunican entre sí): no se puede elegir primario. El conjunto no acepta escrituras.");
    }
    return state;
  }

  function syncCatchingUp(state) {
    var primary = state.members.filter(function (m) { return m.role === "PRIMARY" && m.up && !m.isolated; })[0];
    if (!primary) return state;
    state.members.forEach(function (m) {
      if (m.catchingUp && m.up && !m.isolated) {
        m.oplog = primary.oplog.slice();
        m.catchingUp = false;
        state.log.push("M" + m.id + " terminó de sincronizar su oplog (" + m.oplog.length + " operación(es)).");
      }
    });
    return state;
  }

  function applyWrite(state, targetId, value, writeConcern) {
    var target = state.members[targetId];
    if (!target || target.role !== "PRIMARY" || !target.up) {
      state.log.push("Escritura rechazada: M" + targetId + " no es un primario activo.");
      return { ok: false, reason: "M" + targetId + " no es un primario activo." };
    }
    var op = { seq: state.nextSeq++, value: value, term: target.term };
    target.oplog.push(op);
    var reachableSecondaries = state.members.filter(function (m) {
      return m.id !== target.id && m.role !== "ARBITER" && m.up && !m.isolated && !target.isolated && !m.catchingUp;
    });
    reachableSecondaries.forEach(function (s) { s.oplog.push(op); });
    var ackCount = 1 + reachableSecondaries.length;
    var needed = writeMajorityNeeded(state);
    var majorityOk = ackCount >= needed;
    var confirmed = writeConcern === "w1" ? true : majorityOk;
    var atRisk = writeConcern === "w1" && !majorityOk;
    state.log.push(
      "Escritura \"" + value + "\" en M" + target.id + " (" + writeConcern + "): " +
      (confirmed ? "confirmada al cliente" : "pendiente — esperando mayoría") +
      ", replicada a " + ackCount + "/" + state.dataCount + " nodo(s) con datos" +
      (atRisk ? " — en riesgo: si M" + target.id + " se aísla o cae ahora, se puede perder" : "") + "."
    );
    syncCatchingUp(state);
    return { ok: true, confirmed: confirmed, atRisk: atRisk, ackCount: ackCount, needed: needed, op: op, targetId: target.id };
  }

  function applyRead(state, readPreference) {
    var reachable = state.members.filter(function (m) { return m.up && !m.isolated && m.role !== "ARBITER"; });
    var candidates;
    if (readPreference === "primary") {
      candidates = reachable.filter(function (m) { return m.role === "PRIMARY"; });
    } else if (readPreference === "primaryPreferred") {
      candidates = reachable.filter(function (m) { return m.role === "PRIMARY"; });
      if (!candidates.length) candidates = reachable.filter(function (m) { return m.role === "SECONDARY"; });
    } else if (readPreference === "secondary") {
      candidates = reachable.filter(function (m) { return m.role === "SECONDARY"; });
    } else {
      candidates = reachable.slice(); // "nearest": simplificación didáctica — cualquier nodo alcanzable
    }
    if (!candidates.length) {
      state.log.push("Lectura (" + readPreference + ") rechazada: ningún nodo disponible.");
      return { ok: false, reason: "Ningún nodo disponible para " + readPreference + "." };
    }
    var target = candidates[0];
    var stale = target.catchingUp === true;
    var count = target.oplog ? target.oplog.length : 0;
    var lastValue = count ? target.oplog[count - 1].value : null;
    state.log.push("Lectura (" + readPreference + ") en M" + target.id + " (" + target.role + "): " + count + " operación(es)" + (stale ? ", DATOS ATRASADOS (todavía sincronizando)" : "") + ".");
    var result = { ok: true, memberId: target.id, role: target.role, value: lastValue, count: count, stale: stale };
    syncCatchingUp(state);
    return result;
  }

  function isolateMember(state, id) {
    var m = state.members[id];
    if (!m) return state;
    m.isolated = true;
    state.log.push("Se corta la red a M" + m.id + ": queda aislado del resto del set.");
    reconcile(state);
    return state;
  }

  function crashMember(state, id) {
    var m = state.members[id];
    if (!m) return state;
    m.up = false;
    // Un primario caído deja de ser primario: no puede quedar "PRIMARY" al
    // lado del que elija el resto (rs.status() lo muestra como no alcanzable).
    if (m.role === "PRIMARY") m.role = "SECONDARY";
    state.log.push("M" + m.id + " se cae.");
    reconcile(state);
    return state;
  }

  /** Rol visible de un miembro: un nodo caído no tiene rol vigente. */
  function displayRole(m) {
    return m.up ? m.role : "NO ALCANZABLE";
  }

  /** El driver manda cada escritura al primario VIGENTE (lo descubre solo
   *  tras una elección); si el set no tiene primario, no hay a quién. */
  function writeToPrimary(state, value, writeConcern) {
    var primary = state.members.filter(function (m) { return m.role === "PRIMARY" && m.up && !m.isolated; })[0];
    if (!primary) {
      state.log.push("Escritura \"" + value + "\" rechazada: el set no tiene primario (ningún grupo reúne la mayoría de votos).");
      return { ok: false, reason: "El set no tiene primario: ningún grupo de miembros reúne la mayoría de votos, así que no acepta escrituras." };
    }
    return applyWrite(state, primary.id, value, writeConcern);
  }

  function reconnectMember(state, id) {
    var m = state.members[id];
    if (!m) return state;
    m.up = true;
    m.isolated = false;
    if (m.role === "ARBITER") {
      state.log.push("M" + m.id + " (árbitro) vuelve a votar.");
      reconcile(state);
      return state;
    }
    var currentPrimary = state.members.filter(function (x) { return x.role === "PRIMARY" && x.up && !x.isolated && x.id !== m.id; })[0];
    if (currentPrimary && (m.role !== "PRIMARY" || m.term < currentPrimary.term)) {
      var commonLen = 0;
      while (commonLen < m.oplog.length && commonLen < currentPrimary.oplog.length &&
             m.oplog[commonLen].seq === currentPrimary.oplog[commonLen].seq) commonLen++;
      var lost = m.oplog.slice(commonLen);
      // Cualquier operación que el nodo tiene y el primario vigente no, se
      // deshace (ROLLBACK), sea cual sea el rol con el que vuelve: un ex
      // primario que se retiró al quedar aislado ya es SECONDARY cuando
      // se reconecta, y aun así tiene que descartar lo que nunca llegó a la
      // mayoría.
      if (lost.length) {
        state.rollbacks.push({ memberId: m.id, lostOps: lost, atTerm: lost[0].term, newTerm: currentPrimary.term });
        state.log.push(
          "ROLLBACK en M" + m.id + ": se descartan " + lost.length + " operación(es) que nunca llegaron a la mayoría (" +
          lost.map(function (o) { return "\"" + o.value + "\""; }).join(", ") + ")."
        );
      }
      m.role = "SECONDARY";
      m.oplog = currentPrimary.oplog.slice(0, commonLen);
      m.catchingUp = commonLen < currentPrimary.oplog.length;
      state.log.push("M" + m.id + " se reincorpora como secundario" + (m.catchingUp ? " y se está poniendo al día." : "."));
    } else {
      state.log.push("M" + m.id + " se reincorpora.");
    }
    reconcile(state);
    return state;
  }

  // ---------- registro del motor ----------

  App.bdiiLab.engines.sharding = {
    hashValue: hashValue,
    keyOf: keyOf,
    compareKeys: compareKeys,
    keysEqual: keysEqual,
    isMonotonic: isMonotonic,
    hashedShard: hashedShard,
    findChunkIndex: findChunkIndex,
    simulateInsert: simulateInsert,
    simulateRangeSharding: simulateRangeSharding,
    simulateHashedSharding: simulateHashedSharding,
    routeQuery: routeQuery,
    buildReplicaSet: buildReplicaSet,
    electionMajority: electionMajority,
    writeMajorityNeeded: writeMajorityNeeded,
    reconcile: reconcile,
    applyWrite: applyWrite,
    applyRead: applyRead,
    isolateMember: isolateMember,
    crashMember: crashMember,
    reconnectMember: reconnectMember,
    writeToPrimary: writeToPrimary,
    displayRole: displayRole,
  };

  // ================================================================
  // Datos de ejemplo (presets)
  // ================================================================

  var EGRESADOS_DOCS = [
    { legajo: 50233, titulo: "Ingeniero Industrial", colacion: 58 },
    { legajo: 59587, titulo: "Lic.en Administración y Sistemas", colacion: 58 },
    { legajo: 58064, titulo: "Ingeniero Industrial", colacion: 58 },
    { legajo: 57020, titulo: "Ingeniero Industrial", colacion: 58 },
    { legajo: 57498, titulo: "Ingeniero Electrónico", colacion: 57 },
    { legajo: 56331, titulo: "Ingeniero Industrial", colacion: 57 },
    { legajo: 56470, titulo: "Ingeniero en Petróleo", colacion: 57 },
    { legajo: 55387, titulo: "Ingeniero Industrial", colacion: 57 },
    { legajo: 57042, titulo: "Ingeniero en Informática", colacion: 57 },
    { legajo: 55364, titulo: "Bioingeniero", colacion: 57 },
    { legajo: 54110, titulo: "Ingeniero en Informática", colacion: 57 },
    { legajo: 57046, titulo: "Ingeniero en Informática", colacion: 56 },
    { legajo: 54828, titulo: "Ingeniero Mecánico", colacion: 56 },
    { legajo: 55770, titulo: "Ingeniero Industrial", colacion: 56 },
    { legajo: 55749, titulo: "Ingeniero en Informática", colacion: 56 },
    { legajo: 56646, titulo: "Lic.en Administración y Sistemas", colacion: 56 },
    { legajo: 54623, titulo: "Ingeniero en Informática", colacion: 55 },
    { legajo: 55063, titulo: "Ingeniero Industrial", colacion: 55 },
    { legajo: 55093, titulo: "Ingeniero Industrial", colacion: 55 },
    { legajo: 54088, titulo: "Ingeniero Industrial", colacion: 55 },
  ];

  var PEDIDOS_DOCS = (function () {
    var clientes = [3, 7, 1, 5, 2, 8, 4, 6, 3, 7, 1, 5, 2, 8, 4, 6, 3, 7, 1, 5];
    var out = [];
    for (var i = 0; i < clientes.length; i++) {
      var d = i + 1;
      var fecha = "2026-08-" + (d < 10 ? "0" + d : String(d));
      out.push({ fecha: fecha, cliente_id: clientes[i] });
    }
    return out;
  })();

  var SHARDING_PRESETS = [
    {
      id: "egresados",
      label: "Egresados ITBA",
      origen: "TP9 Parte II — muestra de egresados.csv (legajo, título, colación)",
      docs: EGRESADOS_DOCS,
      fields: ["legajo", "titulo", "colacion"],
      shardKeyOptions: [
        { value: "legajo", label: "legajo (sin orden particular en el archivo)", fields: ["legajo"] },
        { value: "colacion", label: "colación (pocos valores distintos: 55-58)", fields: ["colacion"] },
        { value: "titulo", label: "título (categórico, varios valores)", fields: ["titulo"] },
        { value: "colacion+titulo", label: "colación + título (compuesta)", fields: ["colacion", "titulo"] },
      ],
    },
    {
      id: "pedidos",
      label: "Pedidos con fecha de alta creciente (sintético)",
      origen: "conjunto sintético para este laboratorio — ningún dataset del vault trae una clave temporal creciente; fecha de alta ascendente (típica de un _id autoincremental) y cliente_id",
      docs: PEDIDOS_DOCS,
      fields: ["fecha", "cliente_id"],
      shardKeyOptions: [
        { value: "fecha", label: "fecha de alta (creciente — el caso de shard key monótona)", fields: ["fecha"] },
        { value: "cliente_id", label: "cliente_id", fields: ["cliente_id"] },
        { value: "fecha+cliente_id", label: "fecha + cliente_id (compuesta)", fields: ["fecha", "cliente_id"] },
      ],
    },
  ];

  // ================================================================
  // Interfaz
  // ================================================================

  var SHARD_COLOR_CLASSES = ["lab-sharding-c0", "lab-sharding-c1", "lab-sharding-c2", "lab-sharding-c3", "lab-sharding-c4", "lab-sharding-c5"];

  function fieldValueText(v) {
    return v === null || v === undefined ? "—" : String(v);
  }

  function keyLabel(key, isMin) {
    if (key === null) return isMin ? "MinKey" : "MaxKey";
    return key.map(fieldValueText).join(" · ");
  }

  lab.tool(
    {
      id: "sharding",
      title: "Sharding y replica sets en MongoDB",
      subtitle: "Reparta documentos entre shards (por rango o por hash) y pruebe la elección y el failover de un replica set.",
      sources: [
        { stem: "2.12.02 - Escalabilidad horizontal — sharding y replicación", label: "Escalabilidad horizontal — sharding y replicación" },
        { stem: "2.14.02 - Índices en MongoDB", label: "Índices en MongoDB" },
        { stem: "Clase 14 - MongoDB Features", label: "Clase 14" },
        { stem: "Clase 12 - Introduccion a NoSQL", label: "Clase 12" },
        { stem: "MongoDB", label: "MongoDB (motor)" },
      ],
      figure: { id: "lab-sharding", caption: "Sharding por rango vs. hashed: reparto por shard y ruteo de una consulta.", height: 420 },
    },
    function mount(body, info) {
      var mode = info.mode;
      var compact = mode === "figure";
      var h = lab.h;

      // ------------------------------------------------------------
      // Estado compartido
      // ------------------------------------------------------------
      var engine = App.bdiiLab.engines.sharding;
      var sh = {
        preset: SHARDING_PRESETS[0],
        shardKeyOptIdx: 0,
        numShards: 3,
        strategy: "range",
        snapshots: [],
        stepIdx: 0,
        queryField: null,
        queryValueIdx: 0,
      };
      var repl = {
        state: engine.buildReplicaSet(3, false),
        n: 3,
        arbiter: false,
        target: 0,
        writeConcern: "w1",
        readPreference: "primary",
        writeValue: "pedido-1",
        lastWrite: null,
        lastRead: null,
      };

      var stepperCtrl = null;

      // ------------------------------------------------------------
      // Panel 1 · Sharding
      // ------------------------------------------------------------

      function currentShardKeyOpt() { return sh.preset.shardKeyOptions[sh.shardKeyOptIdx]; }
      function currentShardKeyFields() { return currentShardKeyOpt().fields; }

      var shardingResult = h("div", { "aria-live": "polite", class: "lab-sharding-result" });
      var stepperHost = h("div", {});

      function rebuildSharding() {
        var fields = currentShardKeyFields();
        sh.snapshots = engine.simulateInsert(sh.preset.docs, {
          shardKeyFields: fields,
          numShards: sh.numShards,
          strategy: sh.strategy,
          chunkCapacity: 3,
        });
        sh.stepIdx = sh.snapshots.length - 1;
        if (stepperCtrl) stepperCtrl.destroy();
        stepperHost.replaceChildren();
        if (!compact) {
          stepperCtrl = lab.stepper({
            count: sh.snapshots.length,
            label: "Lote",
            render: function (i) {
              sh.stepIdx = i;
              return renderBatchNote(sh.snapshots[i], i);
            },
          });
          stepperHost.appendChild(stepperCtrl.el);
        } else {
          stepperCtrl = null;
        }
        // el ruteo de consultas usa siempre el estado final
        rebuildQueryFieldOptions();
        renderSharding();
      }

      function renderBatchNote(snap, i) {
        var parts = [
          h("p", {}, "Lote " + (i + 1) + ": se insertan " + snap.batchDocs.length + " documento(s)."),
        ];
        var anySplit = snap.perDoc.some(function (d) { return d.split; });
        if (anySplit && sh.strategy === "range") {
          parts.push(h("p", {}, "Al menos un chunk superó la capacidad (3 documentos) y se dividió; el balancer asignó la mitad nueva al shard con menos chunks."));
        }
        var anyJumbo = snap.perDoc.some(function (d) { return d.jumbo; });
        if (anyJumbo && sh.strategy === "range") {
          parts.push(h("p", {}, "(atención) Un chunk superó la capacidad pero no se pudo dividir: todos sus documentos tienen el mismo valor de shard key, y un mismo valor nunca se reparte entre dos chunks. MongoDB lo marca como chunk jumbo."));
        }
        if (snap.hot) {
          parts.push(lab.callout("warn", "Shard caliente", h("p", {}, "La clave crece siempre: cada documento nuevo cae en el chunk abierto (MaxKey), en el shard " + snap.hotShard + ". Los demás shards no reciben escrituras nuevas hasta que ese chunk se divida y el balancer reparta.")));
        }
        return h("div", {}, parts);
      }

      function rebuildQueryFieldOptions() {
        var fields = currentShardKeyFields();
        var keyLabelTxt = fields.join(" + ");
        var otherFields = sh.preset.fields.filter(function (f) { return fields.indexOf(f) === -1; });
        sh.queryFieldOptions = [{ value: "__key__", label: "la shard key completa (" + keyLabelTxt + ")" }]
          .concat(otherFields.map(function (f) { return { value: f, label: f + " (no es la shard key)" }; }));
        sh.queryField = "__key__";
        sh.queryValueIdx = 0;
      }

      function distinctKeyValues() {
        var seen = {};
        var out = [];
        var fields = currentShardKeyFields();
        sh.preset.docs.forEach(function (doc) {
          var key = engine.keyOf(doc, fields);
          var k = key.join("\u0001");
          if (!seen[k]) { seen[k] = true; out.push(key); }
        });
        return out;
      }

      // ---- controles ----

      var presetCtrl = lab.presetPicker({
        label: "Escenario de partida",
        presets: SHARDING_PRESETS,
        value: 0, // sh.preset comienza en SHARDING_PRESETS[0]
        onPick: function (preset) {
          sh.preset = preset;
          sh.shardKeyOptIdx = 0;
          replaceSelectOptions(
            shardKeySelect,
            preset.shardKeyOptions.map(function (o) { return { value: o.value, label: o.label }; }),
            preset.shardKeyOptions[0].value,
          );
          rebuildSharding();
        },
      });

      var shardKeySelect = lab.select({
        label: "Clave de shard",
        options: sh.preset.shardKeyOptions.map(function (o, idx) { return { value: o.value, label: o.label + "" }; }),
        value: sh.preset.shardKeyOptions[0].value,
        onChange: function (v) {
          var opts = sh.preset.shardKeyOptions;
          for (var i = 0; i < opts.length; i++) if (opts[i].value === v) { sh.shardKeyOptIdx = i; break; }
          rebuildSharding();
        },
      });

      var numShardsCtrl = lab.slider({
        label: "Número de shards",
        min: 2, max: 6, step: 1, value: sh.numShards,
        onChange: function (v) { sh.numShards = Math.round(v); rebuildSharding(); },
      });

      var strategyCtrl = lab.segmented({
        label: "Estrategia",
        options: [{ value: "range", label: "Por rangos" }, { value: "hashed", label: "Hashed" }],
        value: sh.strategy,
        onChange: function (v) { sh.strategy = v; rebuildSharding(); },
      });

      var queryFieldCtrl = lab.select({
        label: "Consultar por",
        options: [{ value: "__key__", label: "la shard key completa" }],
        value: "__key__",
        onChange: function (v) { sh.queryField = v; sh.queryValueIdx = 0; queryValueCtrl.set("0"); renderSharding(); },
      });

      var queryValueCtrl = lab.select({
        label: "Valor (solo si se consulta por la shard key)",
        options: [{ value: "0", label: "—" }],
        value: "0",
        onChange: function (v) { sh.queryValueIdx = parseInt(v, 10) || 0; renderSharding(); },
      });

      function refreshQueryControls() {
        queryFieldCtrl.set(sh.queryField);
        var fieldOpts = sh.queryFieldOptions || [{ value: "__key__", label: "la shard key completa" }];
        // reconstruir opciones reales del select de campo
        replaceSelectOptions(queryFieldCtrl, fieldOpts, sh.queryField);
        if (sh.queryField === "__key__") {
          var values = distinctKeyValues();
          var opts = values.map(function (key, idx) { return { value: String(idx), label: keyLabel(key, true) }; });
          replaceSelectOptions(queryValueCtrl, opts.length ? opts : [{ value: "0", label: "—" }], String(sh.queryValueIdx));
        } else {
          replaceSelectOptions(queryValueCtrl, [{ value: "0", label: "(cualquier valor: siempre es scatter-gather)" }], "0");
        }
      }

      /** lib.js no permite reemplazar las `options` de un `select()` ya
       *  creado: se reconstruye el <select> nativo a mano, conservando el
       *  wrapper y el listener de `change` que ya trae (el estado real lo
       *  llevan `sh.queryField`/`sh.queryValueIdx`/`repl.target`, no el
       *  `get()` del control, que quedaría con las opciones viejas). */
      function replaceSelectOptions(ctrl, options, value) {
        var selectEl = ctrl.el.querySelector("select");
        if (!selectEl) return;
        selectEl.replaceChildren();
        options.forEach(function (opt) {
          selectEl.appendChild(h("option", { value: String(opt.value) }, opt.label));
        });
        selectEl.value = String(value);
      }

      function renderSharding() {
        refreshQueryControls();
        var finalSnap = sh.snapshots[sh.snapshots.length - 1];
        shardingResult.replaceChildren();
        shardingResult.appendChild(buildHistogram(finalSnap));
        if (sh.strategy === "range" && finalSnap.chunks) {
          shardingResult.appendChild(buildChunkTable(finalSnap.chunks));
          if (finalSnap.chunks.some(function (c) { return c.jumbo; })) {
            shardingResult.appendChild(lab.callout("warn", "Chunks jumbo: la clave tiene pocos valores distintos",
              h("p", {}, "Un chunk que contiene un único valor de shard key no se puede dividir (el corte tiene que caer entre dos valores distintos), así que crece sin límite y el balancer no puede repartirlo: es el costo de una clave de baja cardinalidad, como colación (4 valores). MongoDB lo marca como chunk jumbo (documentación oficial, \"Jumbo Chunks\"); el vault no lo trata.")));
          }
        } else {
          shardingResult.appendChild(lab.callout("info", "Sharding hashed", h("p", {}, "El reparto sale de hashear la clave: no hay rangos que mostrar. Aviso: el hash usado aquí es didáctico (una mezcla de bits simple); MongoDB usa un hash de 64 bits derivado de MD5. El reparto ES uniforme por construcción, pero los valores de shard concretos no coinciden con los del motor real.")));
        }
        if (finalSnap.hot) {
          shardingResult.appendChild(lab.callout("warn", "Shard caliente al final de la carga", h("p", {}, "La clave elegida crece siempre en el orden de inserción: todo lo nuevo sigue cayendo en el shard " + finalSnap.hotShard + ". Con hashed no pasaría (el hash no respeta el orden).")));
        }
        shardingResult.appendChild(buildRoutingResult(finalSnap));
      }

      function buildHistogram(snap) {
        var max = Math.max.apply(null, snap.shardCounts.concat([1]));
        var rows = snap.shardCounts.map(function (count, s) {
          var pct = Math.round((count / max) * 100);
          return h("div", { class: "lab-sharding-hist-row" },
            h("span", { class: "lab-sharding-hist-label" }, "Shard " + s),
            h("div", { class: "lab-sharding-hist-track" },
              h("div", { class: "lab-sharding-hist-fill " + (SHARD_COLOR_CLASSES[s % SHARD_COLOR_CLASSES.length]), style: { width: pct + "%" } })),
            h("span", { class: "lab-sharding-hist-count" }, lab.fmtInt(count)));
        });
        return lab.panel("Reparto por shard (tras " + sh.preset.docs.length + " documentos)", h("div", { class: "lab-sharding-hist" }, rows));
      }

      function buildChunkTable(chunks) {
        return lab.table({
          caption: "Chunks (rangos de la shard key)",
          columns: [
            { key: "rango", label: "Rango [min, max)", mono: true },
            { key: "shard", label: "Shard", align: "center" },
            { key: "count", label: "Documentos", align: "right" },
          ],
          rows: chunks.map(function (c) {
            return { rango: "[" + keyLabel(c.min, true) + ", " + keyLabel(c.max, false) + ")", shard: c.shard, count: c.count + (c.jumbo ? " (jumbo)" : "") };
          }),
        });
      }

      function buildRoutingResult(finalSnap) {
        var byKey = sh.queryField === "__key__";
        var model = {
          strategy: sh.strategy,
          numShards: sh.numShards,
          byShardKey: byKey,
          keyValue: null,
          chunks: finalSnap.chunks,
        };
        var explainValue = null;
        if (byKey) {
          var values = distinctKeyValues();
          var key = values[sh.queryValueIdx] || values[0];
          model.keyValue = key;
          explainValue = keyLabel(key, true);
        }
        var route = engine.routeQuery(model);
        var kind = route.type === "targeted" ? "ok" : "warn";
        var title = route.type === "targeted"
          ? "Consulta dirigida (targeted): va a un solo shard"
          : "Scatter-gather: la consulta se manda a TODOS los shards";
        var detail = route.type === "targeted"
          ? "mongos conoce, por los config servers, en qué shard vive " + explainValue + " y consulta solo el shard " + route.shards[0] + "."
          : "el filtro no incluye la shard key, así que mongos no sabe en qué shard puede estar la respuesta: consulta los " + route.shards.length + " shards y reúne los resultados.";
        return lab.panel("Ruteo de la consulta", lab.callout(kind, title, h("p", {}, detail)));
      }

      // ------------------------------------------------------------
      // Panel 2 · Replica set
      // ------------------------------------------------------------

      var replResult = h("div", { "aria-live": "polite", class: "lab-sharding-result" });

      function rebuildReplica() {
        repl.state = engine.buildReplicaSet(repl.n, repl.arbiter);
        repl.target = 0;
        repl.lastWrite = null;
        repl.lastRead = null;
        renderReplica();
      }

      function memberLabel(m) {
        var status = !m.up ? "caído" : m.isolated ? "aislado" : "conectado";
        return "M" + m.id + " — " + engine.displayRole(m) + " (" + status + ")";
      }

      function refreshTargetOptions() {
        var opts = repl.state.members.map(function (m) { return { value: String(m.id), label: memberLabel(m) }; });
        replaceSelectOptions(targetCtrl, opts, String(repl.target));
      }

      var memberCountCtrl = lab.segmented({
        label: "Miembros",
        options: [{ value: 3, label: "3" }, { value: 4, label: "4" }, { value: 5, label: "5" }],
        value: repl.n,
        onChange: function (v) { repl.n = v; rebuildReplica(); },
      });

      var arbiterCtrl = lab.toggle({
        label: "Incluir árbitro (vota, sin datos)",
        checked: repl.arbiter,
        onChange: function (v) { repl.arbiter = v; rebuildReplica(); },
      });

      var targetCtrl = lab.select({
        label: "Miembro objetivo (para cortar la red o reconectar)",
        options: [{ value: "0", label: "M0" }],
        value: "0",
        onChange: function (v) { repl.target = parseInt(v, 10) || 0; },
      });

      var writeValueCtrl = lab.text({ label: "Valor a escribir", value: repl.writeValue, mono: true, onChange: function (v) { repl.writeValue = v; } });

      var writeConcernCtrl = lab.segmented({
        label: "Write concern",
        options: [{ value: "w1", label: "w:1" }, { value: "wmajority", label: "w:majority" }],
        value: repl.writeConcern === "w1" ? "w1" : "wmajority",
        onChange: function (v) { repl.writeConcern = v === "w1" ? "w1" : "majority"; },
      });

      var readPrefCtrl = lab.segmented({
        label: "Read preference",
        options: [
          { value: "primary", label: "primary" },
          { value: "primaryPreferred", label: "primaryPreferred" },
          { value: "secondary", label: "secondary" },
          { value: "nearest", label: "nearest" },
        ],
        value: repl.readPreference,
        onChange: function (v) { repl.readPreference = v; },
      });

      var writeBtn = lab.button({
        label: "Escribir en el primario", kind: "primary",
        onClick: function () {
          // Como el driver: la escritura va siempre al primario vigente.
          repl.lastWrite = engine.writeToPrimary(repl.state, writeValueCtrl.get() || "(vacío)", repl.writeConcern);
          renderReplica();
        },
      });

      var readBtn = lab.button({
        label: "Leer", kind: "ghost",
        onClick: function () { repl.lastRead = engine.applyRead(repl.state, repl.readPreference); renderReplica(); },
      });

      var crashPrimaryBtn = lab.button({
        label: "Caer el primario", kind: "ghost",
        onClick: function () {
          var p = repl.state.members.filter(function (m) { return m.role === "PRIMARY" && m.up; })[0];
          if (p) engine.crashMember(repl.state, p.id);
          renderReplica();
        },
      });

      var isolateBtn = lab.button({
        label: "Cortar la red al miembro objetivo", kind: "ghost",
        onClick: function () { engine.isolateMember(repl.state, repl.target); renderReplica(); },
      });

      var reconnectBtn = lab.button({
        label: "Reconectar el miembro objetivo", kind: "ghost",
        onClick: function () { engine.reconnectMember(repl.state, repl.target); renderReplica(); },
      });

      var resetReplBtn = lab.button({
        label: "Reiniciar replica set", kind: "ghost",
        onClick: function () { rebuildReplica(); },
      });

      function memberCard(m) {
        var cls = "lab-sharding-member";
        if (m.role === "PRIMARY" && m.up) cls += " lab-sharding-member--primary";
        if (!m.up) cls += " lab-sharding-member--down";
        if (m.isolated) cls += " lab-sharding-member--isolated";
        var count = m.oplog ? m.oplog.length : null;
        return h("div", { class: cls },
          h("div", { class: "lab-sharding-member-role" }, "M" + m.id + " — " + engine.displayRole(m)),
          h("div", {}, !m.up ? "caído" : m.isolated ? "aislado (sin red)" : m.catchingUp ? "conectado, sincronizando" : "conectado"),
          m.role !== "ARBITER" ? h("div", {}, lab.fmtInt(count) + " " + lab.plural(count, "operación", "operaciones")) : h("div", {}, "sin datos (solo vota)"));
      }

      function renderReplica() {
        refreshTargetOptions();
        replResult.replaceChildren();
        var members = h("div", { class: "lab-sharding-members" }, repl.state.members.map(memberCard));
        replResult.appendChild(lab.panel("Miembros", members));

        if (repl.lastWrite) {
          var w = repl.lastWrite;
          if (!w.ok) {
            replResult.appendChild(lab.callout("bad", "Escritura rechazada", h("p", {}, w.reason)));
          } else if (w.confirmed && !w.atRisk) {
            replResult.appendChild(lab.callout("ok", "Escritura confirmada y durable", h("p", {}, "Replicada a " + w.ackCount + "/" + w.needed + " nodos necesarios para " + (repl.writeConcern === "w1" ? "w:1" : "w:majority") + ".")));
          } else if (w.confirmed && w.atRisk) {
            replResult.appendChild(lab.callout("warn", "Escritura confirmada pero EN RIESGO (w:1)", h("p", {}, "El cliente ya recibió \"éxito\", pero solo llegó a " + w.ackCount + "/" + w.needed + " nodos. Si el primario se aísla o cae ahora, esta escritura se puede perder (rollback) al reelegir primario.")));
          } else {
            replResult.appendChild(lab.callout("warn", "Escritura pendiente (w:majority)", h("p", {}, "Solo replicó a " + w.ackCount + "/" + w.needed + " nodos: con w:majority el cliente NO recibe confirmación hasta alcanzar mayoría — a diferencia de w:1, nunca le dice \"éxito\" de una escritura que puede perderse.")));
          }
        }

        if (repl.lastRead) {
          var r = repl.lastRead;
          if (!r.ok) {
            replResult.appendChild(lab.callout("bad", "Lectura rechazada", h("p", {}, r.reason)));
          } else {
            replResult.appendChild(lab.callout(
              r.stale ? "warn" : "ok",
              "Lectura en M" + r.memberId + " (" + r.role + ")" + (r.stale ? " — dato posiblemente viejo" : ""),
              h("p", {}, "Último valor visto: ", lab.badge(r.value === null ? "(sin datos)" : String(r.value), r.stale ? "warn" : "ok"), " · " + r.count + " operación(es) aplicadas."),
              r.stale ? h("p", {}, "Este nodo estaba aislado y todavía no terminó de ponerse al día: puede faltarle la última escritura.") : null,
            ));
          }
        }

        if (repl.state.rollbacks.length) {
          replResult.appendChild(lab.callout("bad", "Historial de rollbacks", h("ul", {},
            repl.state.rollbacks.map(function (r) { return h("li", {}, "M" + r.memberId + " perdió " + r.lostOps.length + " operación(es) al reincorporarse (término " + r.atTerm + " → " + r.newTerm + ")."); }))));
        }

        var majorityInfo = h("p", {}, "Mayoría para elegir primario: " + engine.electionMajority(repl.state) + "/" + repl.state.totalCount + " votos. Mayoría para w:majority: " + engine.writeMajorityNeeded(repl.state) + "/" + repl.state.dataCount + " nodos con datos.");
        replResult.appendChild(lab.panel("Reglas aplicadas", majorityInfo));

        var logLines = repl.state.log.slice(-12).map(function (line) { return h("div", {}, line); });
        replResult.appendChild(lab.panel("Registro", h("div", { class: "lab-sharding-log" }, logLines.length ? logLines : [h("div", {}, "(sin eventos todavía)")])));
      }

      // ------------------------------------------------------------
      // Retos
      // ------------------------------------------------------------

      function buildRetoResult(ok, textOk, textBad) {
        return lab.callout(ok ? "ok" : "bad", ok ? "Correcto" : "Todavía no", h("p", {}, ok ? textOk : textBad));
      }

      function buildRetos() {
        var out1 = h("div", { "aria-live": "polite" });
        var reto1 = lab.panel(
          "Reto 1 — Parcial 2Q2025, pregunta 21 (opción múltiple)",
          h("p", {}, "¿Qué diferencia existe entre replicación y sharding? A. El sharding busca garantizar que siempre haya copias de los datos disponibles y permite escalar una base de datos distribuida horizontalmente. La replicación persigue exactamente lo mismo. · B. La replicación busca garantizar que siempre haya copias de los datos disponibles, mientras que el sharding permite escalar una base de datos distribuida horizontalmente. · C. El sharding busca garantizar que siempre haya copias de los datos disponibles, mientras que la replicación permite escalar una base de datos distribuida horizontalmente. · D. Ninguna de las opciones."),
          lab.button({ label: "Ver respuesta", kind: "ghost", onClick: function () {
            out1.replaceChildren(buildRetoResult(true, "Opción B. Replicación = copias para disponibilidad; sharding = partición horizontal para escalar. Verificado contra la fuente del examen y contra 2.12.02 § 1 (\"replicación copia; sharding reparte\").", ""));
          } }).el,
          out1,
        );

        var out2 = h("div", { "aria-live": "polite" });
        var reto2 = lab.panel(
          "Reto 2 — provocar el shard caliente",
          h("p", {}, "En el panel de Sharding: elija el escenario \"Pedidos con fecha de alta creciente\", la estrategia \"Por rangos\" y la clave \"fecha de alta\". Comprobar."),
          lab.button({ label: "Comprobar", kind: "primary", onClick: function () {
            var finalSnap = sh.snapshots[sh.snapshots.length - 1];
            var ok = sh.preset.id === "pedidos" && sh.strategy === "range" &&
              currentShardKeyFields().length === 1 && currentShardKeyFields()[0] === "fecha" &&
              !!finalSnap && finalSnap.hot === true;
            out2.replaceChildren(buildRetoResult(
              ok,
              "Con la fecha (creciente) como shard key por rango, todo lo nuevo cae en el chunk abierto: shard " + (finalSnap ? finalSnap.hotShard : "?") + " caliente. Regla: 2.12.02 § 2.4 — una clave monótona con sharding por rango concentra las escrituras nuevas en el último rango.",
              "Todavía no: elija el escenario \"Pedidos\", estrategia \"Por rangos\" y clave \"fecha de alta\" en el panel de Sharding.",
            ));
          } }).el,
          out2,
        );

        var out3 = h("div", { "aria-live": "polite" });
        var reto3 = lab.panel(
          "Reto 3 — el problema de los nodos pares",
          h("p", {}, "En el panel de Replica set: arme un set de 4 miembros sin árbitro, corte la red a dos miembros distintos (dejando 2 de 4 conectados entre sí) e intente escribir. Comprobar."),
          lab.button({ label: "Comprobar", kind: "primary", onClick: function () {
            var isolatedCount = repl.state.members.filter(function (m) { return m.isolated; }).length;
            var noReachablePrimary = repl.state.members.filter(function (m) { return m.role === "PRIMARY" && m.up && !m.isolated; }).length === 0;
            var ok = repl.n === 4 && !repl.arbiter && isolatedCount >= 2 && noReachablePrimary;
            out3.replaceChildren(buildRetoResult(
              ok,
              "Con 4 miembros la mayoría necesaria es 3. Si se aíslan 2, ningún grupo alcanzable llega a 3 votos: nadie puede ser elegido primario y el set no acepta escrituras — el \"problema de los nodos pares\" de Seven Databases (impresas 126-127), citado en 2.12.02 § 3.3 y en la nota del slide 41 de la Clase 14. Con número impar (o un árbitro) esto no pasa.",
              "Todavía no: en el panel de Replica set elija 4 miembros, sin árbitro, y corte la red a dos miembros (use el selector \"Miembro objetivo\" dos veces).",
            ));
          } }).el,
          out3,
        );

        return h("div", {}, h("h2", {}, "Retos"), reto1, reto2, reto3);
      }

      // ------------------------------------------------------------
      // Composición
      // ------------------------------------------------------------

      var shardingControls = lab.panel(
        "Controles — Sharding",
        presetCtrl.el, shardKeySelect.el, numShardsCtrl.el, strategyCtrl.el,
        h("hr", { class: "lab-sharding-hr" }),
        queryFieldCtrl.el, queryValueCtrl.el,
      );
      var shardingPanel = h("div", {}, lab.grid(2, shardingControls, lab.panel("Resultado — Sharding", shardingResult)), compact ? null : lab.panel("Inserción por lotes", stepperHost));

      if (compact) {
        body.appendChild(shardingPanel);
        rebuildSharding();
        return function cleanup() { if (stepperCtrl) stepperCtrl.destroy(); };
      }

      var replicaControls = lab.panel(
        "Controles — Replica set",
        memberCountCtrl.el, arbiterCtrl.el, targetCtrl.el,
        h("hr", { class: "lab-sharding-hr" }),
        writeValueCtrl.el, writeConcernCtrl.el, h("div", {}, writeBtn.el),
        h("hr", { class: "lab-sharding-hr" }),
        readPrefCtrl.el, h("div", {}, readBtn.el),
        h("hr", { class: "lab-sharding-hr" }),
        h("div", {}, crashPrimaryBtn.el, " ", isolateBtn.el, " ", reconnectBtn.el, " ", resetReplBtn.el),
      );
      var replicaPanel = h("div", {}, lab.grid(2, replicaControls, lab.panel("Resultado — Replica set", replResult)));

      var panelHost = h("div", {});
      var activePanel = "sharding";
      var panelSwitch = lab.segmented({
        label: "Panel",
        options: [{ value: "sharding", label: "1. Sharding" }, { value: "replica", label: "2. Replica set" }],
        value: "sharding",
        onChange: function (v) { activePanel = v; updateVisibility(); },
      });

      function updateVisibility() {
        shardingPanel.style.display = activePanel === "sharding" ? "" : "none";
        replicaPanel.style.display = activePanel === "replica" ? "" : "none";
      }

      panelHost.appendChild(shardingPanel);
      panelHost.appendChild(replicaPanel);

      body.appendChild(panelSwitch.el);
      body.appendChild(panelHost);
      body.appendChild(buildRetos());

      rebuildSharding();
      rebuildReplica();
      updateVisibility();

      return function cleanup() {
        if (stepperCtrl) stepperCtrl.destroy();
      };
    },
  );
})();
