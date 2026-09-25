/* ============================================================
   bdii-lab / cap-quorum.js — "Réplicas, particiones y quórums (CAP y
   consistencia eventual)".

   Motor puro: App.bdiiLab.engines["cap-quorum"]. N réplicas en anillo,
   escritura con quórum W, lectura con quórum R, partición de red que el
   estudiante arma repartiendo réplicas en dos lados con clics, y una
   política CP/AP que decide qué hace una escritura que no junta quórum en
   su lado. Fuentes: 2.12.04 - Teorema CAP, 2.12.05 - BASE y consistencia
   eventual, 2.12.02 - Escalabilidad horizontal, Clase 12 - Introduccion a
   NoSQL, y los exámenes citados en cada preset/reto.

   Simplificación declarada (se repite en la herramienta, regla del brief):
   - La escritura contacta los primeros W ids alcanzables (orden ascendente)
     y la lectura los últimos R ids alcanzables (orden descendente desde el
     final): es una elección determinística para que la demostración sea
     reproducible, no cómo un coordinador real elige réplicas. Lo que sí es
     real es la propiedad que ilustra: dos subconjuntos de un mismo conjunto
     alcanzable con tamaños que suman más que ese conjunto SIEMPRE se
     solapan (principio del palomar) — por eso W + R > N garantiza leer lo
     último sin importar qué réplicas concretas se elijan.
   - La reconciliación al curar la partición es last-write-wins por un reloj
     lógico (orden de las operaciones en la herramienta), no un timestamp de
     pared ni vectores de versión.
   ============================================================ */
(function () {
  "use strict";

  var App = window.App;
  if (!App) return;
  var lab = App.bdiiLab;
  if (!lab) return; // lib.js no se cargó antes: nada que hacer

  var h = lab.h;

  // ------------------------------------------------------------------
  // Motor puro
  // ------------------------------------------------------------------

  var MIN_N = 1;
  var MAX_N = 7;

  function clampInt(v, min, max) {
    v = Math.round(Number(v));
    if (!isFinite(v)) v = min;
    if (v < min) v = min;
    if (v > max) v = max;
    return v;
  }

  function clampN(n) { return clampInt(n, MIN_N, MAX_N); }
  function clampWR(v, n) { return clampInt(v, 1, Math.max(1, n)); }

  /** Quórum típico de Corbellini (p. 7): N/2 + 1. */
  function quorumTipico(n) {
    return Math.floor(n / 2) + 1;
  }

  /** Regla de Corbellini § 3.2: consistencia fuerte cuando W + R > N. */
  function esConsistenciaFuerte(w, r, n) {
    return (w + r) > n;
  }

  /** Reparto por omisión al activar la partición: la primera mitad al lado A. */
  function defaultSideOf(n) {
    var half = Math.ceil(n / 2);
    var out = [];
    for (var i = 0; i < n; i++) out.push(i < half ? "A" : "B");
    return out;
  }

  function crearReplicas(n, valorInicial) {
    var out = [];
    for (var i = 0; i < n; i++) out.push({ id: i, value: valorInicial, version: 0 });
    return out;
  }

  /** Ids de las réplicas que el cliente puede alcanzar en `estado`, orden ascendente. */
  function reachableIds(estado) {
    var out = [];
    for (var i = 0; i < estado.n; i++) {
      if (!estado.partitioned || estado.sideOf[i] === estado.clientSide) out.push(i);
    }
    return out;
  }

  /**
   * Escribe `valor` desde el cliente de `estado`. Devuelve un resultado con
   * `replicas`/`clock` NUEVOS (no muta `estado`) más la explicación de qué
   * pasó: qué réplicas lo recibieron, si hubo quórum, y qué decidió la
   * política CP/AP cuando no lo hubo.
   */
  function escribir(estado, valor) {
    var pool = reachableIds(estado);
    var poolSize = pool.length;

    if (poolSize === 0) {
      return {
        accepted: false, confirmed: false, quorumReached: false,
        receivedBy: [], poolSize: 0, version: null,
        replicas: estado.replicas, clock: estado.clock,
        motivo: "sin-alcance",
      };
    }

    var quorumReached = poolSize >= estado.w;
    // La política CP/AP decide qué hacer cuando no se junta el quórum, haya o
    // no partición activa: si W pide más confirmaciones que réplicas
    // alcanzables (por ejemplo W > N sin partición), es el mismo caso de "no
    // hay quórum" que bajo partición, y CP tiene que rechazarlo igual.
    var politicaAplica = !quorumReached;

    if (politicaAplica && estado.policy === "CP") {
      return {
        accepted: false, confirmed: false, quorumReached: false,
        receivedBy: [], poolSize: poolSize, version: null,
        replicas: estado.replicas, clock: estado.clock,
        motivo: "sin-quorum-cp",
      };
    }

    // Con quórum: solo hacen falta W confirmaciones (las primeras W del lado
    // alcanzable). Sin quórum y política AP: mejor esfuerzo, todo lo alcanzable.
    var receivedBy = quorumReached ? pool.slice(0, estado.w) : pool.slice();
    var nuevoClock = estado.clock + 1;
    var recibioSet = {};
    receivedBy.forEach(function (id) { recibioSet[id] = true; });
    var nuevasReplicas = estado.replicas.map(function (r) {
      return recibioSet[r.id] ? { id: r.id, value: valor, version: nuevoClock } : r;
    });

    return {
      accepted: true,
      confirmed: quorumReached,
      quorumReached: quorumReached,
      receivedBy: receivedBy,
      poolSize: poolSize,
      version: nuevoClock,
      replicas: nuevasReplicas,
      clock: nuevoClock,
      motivo: quorumReached ? "quorum" : "ap-sin-quorum",
    };
  }

  /**
   * Lee desde el cliente de `estado`: contacta hasta R réplicas alcanzables
   * (las últimas R en orden ascendente de id, para separarlas de las
   * primeras W que toca una escritura — ver nota de simplificación arriba)
   * y devuelve la versión más nueva entre las contactadas.
   */
  function leer(estado) {
    var pool = reachableIds(estado);
    var poolSize = pool.length;
    var rEfectivo = Math.min(estado.r, poolSize);
    var quorumReached = poolSize >= estado.r;

    // Igual que la escritura: si no se pueden juntar R respuestas, la
    // política CP rechaza la lectura en vez de devolver un valor que puede
    // ser viejo; AP responde con lo que alcanza.
    if (poolSize > 0 && !quorumReached && estado.policy === "CP") {
      return {
        accepted: false, contactados: [], versiones: [], valor: null, version: null,
        garantizado: false, actualizado: false, quorumReached: false,
        poolSize: poolSize, rEfectivo: rEfectivo, motivo: "sin-quorum-cp",
      };
    }

    var contactados = rEfectivo > 0 ? pool.slice(poolSize - rEfectivo) : [];

    var versiones = contactados.map(function (id) {
      var rep = estado.replicas[id];
      return { id: id, value: rep.value, version: rep.version };
    });

    var maxVersion = -1, valorMax = null;
    versiones.forEach(function (v) {
      if (v.version > maxVersion) { maxVersion = v.version; valorMax = v.value; }
    });

    var globalMax = -1;
    estado.replicas.forEach(function (r) { if (r.version > globalMax) globalMax = r.version; });

    return {
      accepted: true,
      contactados: contactados,
      versiones: versiones,
      valor: valorMax,
      version: maxVersion,
      // W + R > N garantiza leer la última escritura CONFIRMADA solo si la
      // lectura efectivamente juntó sus R respuestas: con menos (partición,
      // o R > N) los dos conjuntos ya no tienen por qué solaparse.
      garantizado: esConsistenciaFuerte(estado.w, estado.r, estado.n) && quorumReached,
      formulaCumplida: esConsistenciaFuerte(estado.w, estado.r, estado.n),
      quorumReached: quorumReached,
      actualizado: versiones.length > 0 && maxVersion === globalMax,
      poolSize: poolSize,
      rEfectivo: rEfectivo,
      motivo: quorumReached ? "quorum" : "ap-sin-quorum",
    };
  }

  /** ¿Hay valores distintos entre réplicas que sí recibieron alguna escritura? */
  function hayDivergencia(replicas) {
    var vistos = {};
    for (var i = 0; i < replicas.length; i++) {
      var r = replicas[i];
      if (r.version <= 0) continue;
      vistos[r.value] = true;
    }
    return Object.keys(vistos).length > 1;
  }

  /**
   * Cura la partición: reconcilia por last-write-wins según `version`
   * (reloj lógico de la herramienta) y aplica el valor ganador a las N
   * réplicas. Devuelve también qué escrituras divergentes se pierden.
   */
  function curarParticion(estado) {
    var ganador = null;
    estado.replicas.forEach(function (r) {
      if (r.version > 0 && (!ganador || r.version > ganador.version)) ganador = r;
    });
    if (!ganador) {
      // nadie escribió nada todavía: no hay nada que reconciliar.
      return { replicas: estado.replicas, ganador: null, perdidos: [] };
    }
    var perdidosPorVersion = {};
    estado.replicas.forEach(function (r) {
      if (r.version > 0 && r.version < ganador.version && r.value !== ganador.value) {
        perdidosPorVersion[r.version] = { value: r.value, version: r.version };
      }
    });
    var perdidos = Object.keys(perdidosPorVersion).map(function (k) { return perdidosPorVersion[k]; })
      .sort(function (a, b) { return b.version - a.version; });

    var nuevasReplicas = estado.replicas.map(function (r) {
      return { id: r.id, value: ganador.value, version: ganador.version };
    });

    return { replicas: nuevasReplicas, ganador: { value: ganador.value, version: ganador.version }, perdidos: perdidos };
  }

  // ------------------------------------------------------------------
  // Presets (escenarios precargados, con origen rotulado)
  // ------------------------------------------------------------------

  var PRESETS = [
    {
      id: "n3-w2-r2",
      label: "N=3, W=2, R=2 (quórum, consistencia fuerte)",
      origen: "BASE y consistencia eventual § 3, ejemplo numérico N=3 (razonamiento propio del vault, sobre las reglas de Corbellini)",
      nota: "W + R = 4 > N = 3: cualquier lectura de 2 réplicas se solapa con las 2 que confirmaron la escritura. Sin partición: pruebe escribir y después leer.",
      n: 3, w: 2, r: 2, partitioned: false,
      sideOf: defaultSideOf(3), clientSide: "A", policy: "CP",
      replicas: crearReplicas(3, "v0"), clock: 0,
    },
    {
      id: "naufrago",
      label: "El náufrago (partición + consistencia eventual)",
      origen: "Final 1Dic2025, pregunta 1",
      nota: "Réplica 1 = el náufrago (lado A, cliente); réplica 2 = \"el resto del mundo\", simplificado a una sola réplica. El náufrago quedó desconectado (partición); hace 2 años le llegó una botella con una noticia vieja (versión 1), mientras el mundo ya está en la versión 3. Lea desde el náufrago (lado A) y compare con leer desde el mundo (lado B). (atención) la trampa del enunciado (ítem D): una sola botella detenida hace dos años, sin que sigan llegando más, es consistencia débil —puede leer un valor viejo sin garantía de converger—, no consistencia eventual sin más condición. \"Eventual\" exige la garantía de que, si siguieran llegando botellas, el náufrago terminaría actualizado.",
      n: 2, w: 1, r: 1, partitioned: true,
      sideOf: ["A", "B"], clientSide: "A", policy: "AP",
      replicas: [
        { id: 0, value: "presidente de hace 4 años (botella de hace 2)", version: 1 },
        { id: 1, value: "presidente actual", version: 3 },
      ],
      clock: 3,
    },
    {
      id: "n3-w1-r1",
      label: "N=3, W=1, R=1 (consistencia débil/eventual)",
      origen: "BASE y consistencia eventual § 3, ejemplo numérico N=3 (razonamiento propio del vault, sobre las reglas de Corbellini)",
      nota: "W + R = 2 ≤ N = 3: una lectura puede caer en una réplica que todavía no recibió la escritura. Sin partición: escriba y lea para ver si le toca una versión vieja.",
      n: 3, w: 1, r: 1, partitioned: false,
      sideOf: defaultSideOf(3), clientSide: "A", policy: "CP",
      replicas: crearReplicas(3, "v0"), clock: 0,
    },
    {
      id: "n5-particion-3-2",
      label: "N=5 con partición 3/2 (mayoría sigue, minoría se detiene)",
      origen: "Escalabilidad horizontal — sharding y replicación, § 3.3",
      nota: "Con el quórum típico N/2+1 = 3, el lado de 3 réplicas sigue aceptando operaciones (tiene mayoría) y el lado de 2 se queda sin quórum: es el argumento de por qué un replica set pide un número impar de nodos. Política CP: el lado minoritario rechaza.",
      n: 5, w: 3, r: 3, partitioned: true,
      sideOf: defaultSideOf(5), clientSide: "A", policy: "CP",
      replicas: crearReplicas(5, "v0"), clock: 0,
    },
  ];

  // ------------------------------------------------------------------
  // Retos (de TPs y exámenes del vault)
  // ------------------------------------------------------------------

  var RETOS = [
    {
      id: "reto-cp",
      enunciado: "Arme un escenario CP: active la partición, elija \"Prioriza consistencia (CP)\" y ajuste W y R para que se cumpla W + R > N (quórum estricto).",
      fuente: "BASE y consistencia eventual, § 3 (Corbellini, p. 6)",
      respuesta: "MongoDB es CP por defecto: escrituras y lecturas van al primario y el lado sin mayoría deja de aceptar escrituras. Cualquier configuración con partición activa, política CP y W + R > N sirve — por ejemplo N=3, W=2, R=2.",
      comprobar: function (estado) {
        return !!estado.partitioned && estado.policy === "CP" && esConsistenciaFuerte(estado.w, estado.r, estado.n);
      },
    },
    {
      id: "reto-ap",
      enunciado: "Arme el escenario AP típico: active la partición, elija \"Prioriza disponibilidad (AP)\", y deje W=1 y R=1 (cualquier réplica confirma sola, sin esperar a las demás).",
      fuente: "Parcial 2Q2025, pregunta 3",
      respuesta: "Si todos los nodos aceptan lecturas y escrituras sin coordinarse, se prioriza disponibilidad y tolerancia a particiones, sacrificando consistencia inmediata: es la situación AP del teorema. W=1 y R=1 con la política AP activa es exactamente eso.",
      comprobar: function (estado) {
        return !!estado.partitioned && estado.policy === "AP" && estado.w === 1 && estado.r === 1;
      },
    },
    {
      id: "reto-quorum",
      enunciado: "Con N=3 réplicas, ajuste W y R al quórum típico de Corbellini (N/2 + 1 para los dos) de forma que la lectura quede garantizada.",
      fuente: "BASE y consistencia eventual, § 3 (Corbellini, p. 7)",
      respuesta: "El quórum típico es N/2 + 1: con N=3 eso da W=2 y R=2. Cumple W + R > N (4 > 3), así que dos operaciones cualesquiera —una de escritura y una de lectura— comparten siempre al menos una réplica. Relacionado: Parcial 23-5-23, pregunta 9 (un sistema AP puede ofrecer consistencia eventual).",
      comprobar: function (estado) {
        var q = quorumTipico(estado.n);
        return estado.n === 3 && estado.w === q && estado.r === q && esConsistenciaFuerte(estado.w, estado.r, estado.n);
      },
    },
  ];

  App.bdiiLab.engines["cap-quorum"] = {
    MIN_N: MIN_N,
    MAX_N: MAX_N,
    clampN: clampN,
    clampWR: clampWR,
    quorumTipico: quorumTipico,
    esConsistenciaFuerte: esConsistenciaFuerte,
    defaultSideOf: defaultSideOf,
    crearReplicas: crearReplicas,
    reachableIds: reachableIds,
    escribir: escribir,
    leer: leer,
    hayDivergencia: hayDivergencia,
    curarParticion: curarParticion,
    PRESETS: PRESETS,
    RETOS: RETOS,
  };

  // ------------------------------------------------------------------
  // Interfaz
  // ------------------------------------------------------------------

  var CLASIFICACION_CAP = [
    {
      motor: "MongoDB", slide18: "CP", corbellini: "AP y CP", sevendb: "CP (y puede ser CA)",
      nota: "Se configura por operación: escrituras/lecturas al primario → CP; lecturas en secundarios → AP. El deck la da CP \"por defecto\".",
    },
    {
      motor: "Redis", slide18: "CP", corbellini: "AP", sevendb: "CA",
      nota: "(crítico) tres respuestas distintas según la fuente: depende de si se mira un Redis solo, con réplicas, o con Cluster.",
    },
    {
      motor: "Cassandra", slide18: "AP", corbellini: "AP", sevendb: "— (no lo cubre)",
      nota: "Único wide-column en la columna AP del paper de Corbellini. Los niveles ONE/QUORUM/ALL (el R/W de esta herramienta con nombre propio) son tema no dictado aún — se dictan el 28/09 y el 05/10.",
    },
    {
      motor: "Neo4j", slide18: "no está en el slide", corbellini: "AP (CP para InfiniteGraph)", sevendb: "CA en A2 · AP en cap. 6",
      nota: "El propio libro se contradice: el apéndice A2 lo trata como no distribuido (CA); el capítulo 6 dice que Neo4j HA es AP.",
    },
  ];

  function renderClasificacionCap() {
    return lab.panel(
      "Clasificación CAP por motor (lo que dice el vault, con sus discrepancias)",
      h("p", { class: "lab-cq-cap-note" },
        "El deck de la Clase 12 (slide 18), Corbellini (Table 2) y Seven Databases (apéndice A2) no siempre coinciden. La herramienta muestra las tres columnas: no toma partido que el vault no haya tomado. ",
        lab.pageLink("2.12.04 - Teorema CAP", "detalle completo"), "."),
      lab.table({
        caption: "MongoDB, Redis, Cassandra y Neo4j según las tres fuentes del vault",
        columns: [
          { key: "motor", label: "Motor" },
          { key: "slide18", label: "Slide 18 (deck)" },
          { key: "corbellini", label: "Corbellini Table 2" },
          { key: "sevendb", label: "Seven Databases A2" },
          { key: "nota", label: "Nota" },
        ],
        rows: CLASIFICACION_CAP.map(function (r) {
          return { motor: r.motor, slide18: r.slide18, corbellini: r.corbellini, sevendb: r.sevendb, nota: r.nota };
        }),
      }),
      lab.callout("info", "Sin entrar todavía: Cassandra con ONE / QUORUM / ALL",
        h("p", {}, "Cassandra convierte N/W/R en su API con niveles de consistencia por operación (",
          h("code", { class: "bdii-mono" }, "ONE"), ", ", h("code", { class: "bdii-mono" }, "QUORUM"), ", ", h("code", { class: "bdii-mono" }, "ALL"),
          "), casi calcados de los controles de esta herramienta. Tema (atención) no dictado aún — se dicta el 28/09 y el 05/10. Fuente: ",
          lab.pageLink("2.12.05 - BASE y consistencia eventual", "BASE y consistencia eventual"), " § \"Lo que llega el 28/09\".")),
    );
  }

  lab.tool(
    {
      id: "cap-quorum",
      title: "Réplicas, particiones y quórums (CAP y consistencia eventual)",
      subtitle: "Juegue con N réplicas, W/R y una partición de red para ver cuándo una lectura está garantizada, y qué hace CP frente a AP cuando la red se corta.",
      sources: [
        { stem: "2.12.04 - Teorema CAP", label: "Teorema CAP" },
        { stem: "2.12.05 - BASE y consistencia eventual", label: "BASE y consistencia eventual" },
        { stem: "2.12.02 - Escalabilidad horizontal — sharding y replicación", label: "Escalabilidad horizontal" },
        { stem: "Clase 12 - Introduccion a NoSQL", label: "Clase 12" },
      ],
      figure: { id: "lab-cap-quorum", caption: "Réplicas, partición y quórum W/R: cuándo una lectura está garantizada.", height: 460 },
    },
    function mount(body, mountCtx) {
      var mode = mountCtx.mode;
      var compact = mode === "figure";
      var engine = App.bdiiLab.engines["cap-quorum"];

      // ---------------- estado ----------------
      var state = null;
      function estadoDesdePreset(preset) {
        return {
          n: preset.n, w: preset.w, r: preset.r,
          partitioned: preset.partitioned,
          sideOf: preset.sideOf.slice(),
          clientSide: preset.clientSide,
          policy: preset.policy,
          replicas: preset.replicas.map(function (r) { return { id: r.id, value: r.value, version: r.version }; }),
          clock: preset.clock,
          valorEscritura: "v" + (preset.clock + 1),
          ultimaAccion: null,
          nota: preset.nota || null,
        };
      }
      state = estadoDesdePreset(PRESETS[0]); // N=3 W=2 R=2: el primer escenario, elegido en el selector

      // ---------------- nodos del DOM que se re-renderizan ----------------
      var ring = h("div", { class: "lab-cq-ring", role: "group", "aria-label": "Réplicas" });
      var clienteInfo = h("p", { class: "lab-cq-client" });
      var tablaReplicas = h("div", {});
      var resultado = h("div", { "aria-live": "polite" });
      var notaPreset = h("div", {});
      var retosBody = h("div", {});

      // ---------------- controles ----------------
      var nCtrl = lab.slider({
        label: "N — cantidad de réplicas", min: engine.MIN_N, max: engine.MAX_N, step: 1, value: state.n,
        onChange: function (v) { cambiarN(v); },
      });
      var wCtrl = lab.slider({
        label: compact ? "W — confirmaciones para escribir" : "W — confirmaciones para escribir (si pide más de N, el quórum nunca se alcanza)", min: 1, max: engine.MAX_N, step: 1, value: state.w,
        onChange: function (v) { state.w = v; render(); },
      });
      var rCtrl = lab.slider({
        label: compact ? "R — réplicas consultadas al leer" : "R — réplicas que se consultan al leer (si pide más de N, el quórum nunca se alcanza: CP rechaza la lectura y AP consulta todas las alcanzables)", min: 1, max: engine.MAX_N, step: 1, value: state.r,
        onChange: function (v) { state.r = v; render(); },
      });
      var partitionCtrl = lab.toggle({
        label: "Partición de red activa",
        checked: state.partitioned,
        onChange: function (v) {
          state.partitioned = v;
          if (v && !state.sideOf) state.sideOf = engine.defaultSideOf(state.n);
          render();
        },
      });
      var clientSideCtrl = lab.segmented({
        label: "El cliente está en",
        options: [{ value: "A", label: "Lado A" }, { value: "B", label: "Lado B" }],
        value: state.clientSide,
        onChange: function (v) { state.clientSide = v; render(); },
      });
      var policyCtrl = lab.segmented({
        label: "Ante la partición, la herramienta…",
        options: [
          { value: "CP", label: "Prioriza consistencia (CP)" },
          { value: "AP", label: "Prioriza disponibilidad (AP)" },
        ],
        value: state.policy,
        onChange: function (v) { state.policy = v; render(); },
      });
      var valorCtrl = lab.text({
        label: "Valor a escribir", value: state.valorEscritura, mono: true,
        onChange: function (v) { state.valorEscritura = v; },
      });
      var escribirBtn = lab.button({ label: "Escribir", kind: "primary", onClick: function () { accionEscribir(); } });
      var leerBtn = lab.button({ label: "Leer", kind: "ghost", onClick: function () { accionLeer(); } });
      var curarBtn = lab.button({ label: "Curar la partición", kind: "ghost", onClick: function () { accionCurar(); } });

      var presetCtrl = lab.presetPicker({
        label: "Escenario precargado",
        presets: PRESETS,
        value: 0,
        onPick: function (preset) { aplicarPreset(preset); },
      });

      function cambiarN(nuevoN) {
        nuevoN = engine.clampN(nuevoN);
        state.n = nuevoN;
        state.sideOf = engine.defaultSideOf(nuevoN);
        if (state.clientSide !== "A" && state.clientSide !== "B") state.clientSide = "A";
        state.replicas = engine.crearReplicas(nuevoN, "v0");
        state.clock = 0;
        state.valorEscritura = "v1";
        state.ultimaAccion = null;
        state.nota = null;
        valorCtrl.set(state.valorEscritura);
        render();
      }

      function aplicarPreset(preset) {
        state = estadoDesdePreset(preset);
        nCtrl.set(state.n);
        wCtrl.set(state.w);
        rCtrl.set(state.r);
        partitionCtrl.set(state.partitioned);
        clientSideCtrl.set(state.clientSide);
        policyCtrl.set(state.policy);
        valorCtrl.set(state.valorEscritura);
        render();
      }

      function accionEscribir() {
        var res = engine.escribir(state, state.valorEscritura || "v?");
        state.replicas = res.replicas;
        state.clock = res.clock;
        state.ultimaAccion = { tipo: "escribir", res: res, valor: state.valorEscritura };
        state.valorEscritura = "v" + (state.clock + 1);
        valorCtrl.set(state.valorEscritura);
        render();
      }

      function accionLeer() {
        var res = engine.leer(state);
        state.ultimaAccion = { tipo: "leer", res: res };
        render();
      }

      function accionCurar() {
        var res = engine.curarParticion(state);
        state.replicas = res.replicas;
        state.partitioned = false;
        partitionCtrl.set(false);
        state.ultimaAccion = { tipo: "curar", res: res };
        render();
      }

      function toggleLado(id) {
        if (!state.partitioned) return;
        state.sideOf[id] = state.sideOf[id] === "A" ? "B" : "A";
        render();
      }

      // ---------------- ring (anillo de réplicas, botones nativos) ----------------

      function renderRing() {
        ring.replaceChildren();
        var pool = {};
        engine.reachableIds(state).forEach(function (id) { pool[id] = true; });
        var ultimo = state.ultimaAccion;
        var recibidas = {};
        if (ultimo && ultimo.tipo === "escribir" && ultimo.res.accepted) {
          ultimo.res.receivedBy.forEach(function (id) { recibidas[id] = true; });
        }
        var contactadasLectura = {};
        if (ultimo && ultimo.tipo === "leer") {
          ultimo.res.contactados.forEach(function (id) { contactadasLectura[id] = true; });
        }

        for (var i = 0; i < state.n; i++) {
          (function (id) {
            var rep = state.replicas[id];
            var lado = state.partitioned ? state.sideOf[id] : null;
            var alcanzable = !state.partitioned || pool[id];
            var cls = "lab-cq-node";
            if (lado === "A") cls += " lab-cq-node--sideA";
            if (lado === "B") cls += " lab-cq-node--sideB";
            if (!alcanzable) cls += " lab-cq-node--unreachable";
            if (recibidas[id]) cls += " lab-cq-node--wrote";
            if (contactadasLectura[id]) cls += " lab-cq-node--read";

            var angle = (2 * Math.PI * id) / state.n - Math.PI / 2;
            var radius = 38;
            var x = 50 + radius * Math.cos(angle);
            var y = 50 + radius * Math.sin(angle);

            var etiquetaLado = lado ? ("lado " + lado) : "sin partición";
            var etiquetaAlcance = alcanzable ? "alcanzable desde el cliente" : "fuera de alcance por la partición";
            var ariaLabel = "Réplica " + (id + 1) + ", " + etiquetaLado + ", " + etiquetaAlcance +
              ", valor " + rep.value + ", versión " + rep.version +
              (state.partitioned ? ". Clic para pasarla al otro lado." : "");

            var btn = h("button", {
              type: "button",
              class: cls,
              style: { left: x + "%", top: y + "%" },
              disabled: !state.partitioned,
              "aria-label": ariaLabel,
              on: { click: function () { toggleLado(id); } },
            },
              h("span", { class: "lab-cq-node-id" }, "R" + (id + 1)),
              h("span", { class: "lab-cq-node-side" }, lado || "—"),
              h("span", { class: "lab-cq-node-ver" }, "v" + rep.version),
            );
            ring.appendChild(btn);
          })(i);
        }

        clienteInfo.replaceChildren(
          h("span", { class: "lab-cq-client-label" }, "Cliente: "),
          h("span", { class: "lab-cq-client-side" }, state.partitioned ? ("lado " + state.clientSide) : "puede llegar a todas las réplicas"));
      }

      function renderTablaReplicas() {
        var pool = {};
        engine.reachableIds(state).forEach(function (id) { pool[id] = true; });
        tablaReplicas.replaceChildren();
        tablaReplicas.appendChild(lab.table({
          caption: "Estado exacto de cada réplica",
          columns: [
            { key: "replica", label: "Réplica" },
            { key: "lado", label: "Lado" },
            { key: "alcance", label: "Alcance desde el cliente" },
            { key: "valor", label: "Valor", mono: true },
            { key: "version", label: "Versión", align: "right", mono: true },
          ],
          rows: state.replicas.map(function (r) {
            return {
              id: r.id,
              replica: "R" + (r.id + 1),
              lado: state.partitioned ? state.sideOf[r.id] : "—",
              alcance: !state.partitioned ? "✓ alcanzable" : (pool[r.id] ? "✓ alcanzable" : "✗ fuera de alcance"),
              valor: r.value,
              version: r.version,
            };
          }),
          rowClass: function (row) { return state.partitioned && !pool[row.id] ? "lab-cq-row-muted" : ""; },
        }));
      }

      // ---------------- panel de resultado explicado ----------------

      function renderResultado() {
        resultado.replaceChildren();
        var ultimo = state.ultimaAccion;

        if (!ultimo) {
          resultado.appendChild(lab.callout("info", "Todavía no se escribió ni se leyó nada", h("p", {}, "Use los botones \"Escribir\" y \"Leer\" para ver qué réplicas responden.")));
        } else if (ultimo.tipo === "escribir") {
          resultado.appendChild(renderResultadoEscritura(ultimo));
        } else if (ultimo.tipo === "leer") {
          resultado.appendChild(renderResultadoLectura(ultimo));
        } else if (ultimo.tipo === "curar") {
          resultado.appendChild(renderResultadoCurar(ultimo));
        }

        if (!state.partitioned && engine.hayDivergencia(state.replicas)) {
          resultado.appendChild(lab.callout("warn", "Quedaron valores divergentes sin reconciliar",
            h("p", {}, "La partición se desactivó sin pasar por \"Curar la partición\": las réplicas todavía no coinciden. Use ese botón para aplicar last-write-wins.")));
        }
      }

      function renderResultadoEscritura(ultimo) {
        var res = ultimo.res;
        if (!res.accepted) {
          var motivo = res.motivo === "sin-alcance"
            ? "El cliente no tiene ninguna réplica alcanzable de su lado: no hay a quién escribirle."
            : "El cliente solo alcanza " + res.poolSize + " de las " + state.n + " réplicas, y hacen falta W=" + state.w + " confirmaciones. Con la política \"Prioriza consistencia (CP)\", la escritura se rechaza en vez de aceptarse sin quórum.";
          return lab.callout("bad", "Escritura rechazada", h("div", {},
            h("p", {}, motivo),
            h("p", {}, "Regla aplicada: ", lab.pageLink("2.12.04 - Teorema CAP", "un sistema CP deja de responder cuando no puede garantizar la consistencia"), ".")));
        }
        var partes = [
          h("p", {}, "Recibieron la escritura: ", res.receivedBy.map(function (id) { return "R" + (id + 1); }).join(", "), " (", res.receivedBy.length, " de ", state.n, " réplicas)."),
        ];
        if (res.confirmed) {
          partes.push(h("p", {}, "Confirmada: se alcanzaron las W=" + state.w + " confirmaciones que hacían falta."));
        } else {
          partes.push(h("p", {}, "Aceptada SIN quórum: el cliente solo tenía " + res.poolSize + " réplica" + (res.poolSize === 1 ? "" : "s") + " alcanzable" + (res.poolSize === 1 ? "" : "s") + " y W=" + state.w + ". Con la política \"Prioriza disponibilidad (AP)\", se escribe de todos modos — sin garantía de durabilidad" + (state.partitioned ? " ni de que el otro lado converja solo" : "") + "."));
        }
        partes.push(h("p", {}, "Regla: N/W/R de Corbellini — hacen falta W confirmaciones alcanzables. Ver ", lab.pageLink("2.12.05 - BASE y consistencia eventual", "BASE y consistencia eventual"), " § 3."));
        return lab.callout(res.confirmed ? "ok" : "warn", res.confirmed ? "Escritura confirmada" : "Escritura aceptada sin quórum (AP)", h("div", {}, partes));
      }

      function renderResultadoLectura(ultimo) {
        var res = ultimo.res;
        if (res.rEfectivo === 0) {
          return lab.callout("bad", "Lectura sin respuesta", h("p", {}, "El cliente no tiene ninguna réplica alcanzable de su lado."));
        }
        if (res.accepted === false) {
          return lab.callout("bad", "Lectura rechazada (sin quórum de lectura)", h("div", {},
            h("p", {}, "El cliente solo alcanza " + res.poolSize + " de las " + state.n + " réplicas, y hacen falta R=" + state.r + " respuestas. Con la política \"Prioriza consistencia (CP)\", la lectura se rechaza en vez de devolver un valor que puede estar desactualizado."),
            h("p", {}, "Regla aplicada: ", lab.pageLink("2.12.04 - Teorema CAP", "un sistema CP deja de responder cuando no puede garantizar la consistencia"), ".")));
        }
        var partes = [
          h("p", {}, "Se consultaron: ", res.contactados.map(function (id) { return "R" + (id + 1); }).join(", "), "."),
          h("p", {}, "Versión devuelta: ", lab.badge("v" + res.version, res.actualizado ? "ok" : "warn"), " — valor ", h("code", { class: "bdii-mono" }, String(res.valor)),
            res.rEfectivo < state.r ? (" (se pidieron R=" + state.r + " réplicas, pero la partición solo dejó consultar " + res.rEfectivo + ")") : "."),
        ];
        if (res.actualizado) {
          partes.push(h("p", {}, "Es la versión más nueva que existe en el sistema: esta lectura no se perdió ninguna escritura confirmada."));
        } else {
          partes.push(h("p", {}, "NO es la versión más nueva: existe una réplica con una versión más alta que esta lectura no contactó."));
          partes.push(h("p", {}, "(atención) esto por sí solo es consistencia débil, no todavía \"eventual\": leer una versión vieja una vez no alcanza. Para llamarla eventual hace falta además la garantía de que, si dejan de llegar escrituras, todas las réplicas terminan convergiendo — un mecanismo de reparación (read-repair, write-repair, asynchronous-repair). Es la trampa del náufrago: una sola botella vieja, sin que sigan llegando más, es débil sin garantía de converger. Ver ", lab.pageLink("2.12.05 - BASE y consistencia eventual", "BASE y consistencia eventual"), " § 2."));
        }
        var garantiaTxt = res.garantizado
          ? "sí, R + W > N y se reunieron las R respuestas"
          : (res.formulaCumplida ? "no: R + W > N, pero solo se reunieron " + res.rEfectivo + " de las R=" + state.r + " respuestas" : "no, R + W ≤ N");
        partes.push(h("p", {}, "¿Estaba garantizado leer la última escritura confirmada? ", lab.badge(garantiaTxt, res.garantizado ? "ok" : "warn"),
          " (R=" + state.r + " + W=" + state.w + " ", res.formulaCumplida ? "> " : "≤ ", "N=" + state.n + "). Regla: ", lab.pageLink("2.12.05 - BASE y consistencia eventual", "N/W/R, Corbellini § 3"), "."));
        if (res.formulaCumplida && !res.quorumReached) {
          partes.push(h("p", {}, "(atención) la fórmula supone que la lectura reúne sus R respuestas. Con la partición el cliente solo llega a " + res.poolSize + " réplica" + (res.poolSize === 1 ? "" : "s") + ": la política AP responde igual, con lo que alcanza, y ese conjunto más chico puede no solaparse con las W réplicas que confirmaron la última escritura."));
        }
        if (res.garantizado && !res.actualizado) {
          partes.push(h("p", {}, "(atención) la garantía de W + R > N cubre solo las escrituras CONFIRMADAS con quórum. La versión más nueva que esta lectura no vio fue aceptada sin quórum (política AP), así que no estaba cubierta."));
        }
        return lab.callout(res.actualizado ? "ok" : "warn", res.actualizado ? "Lectura al día" : "Lectura desactualizada (stale)", h("div", {}, partes));
      }

      function renderResultadoCurar(ultimo) {
        var res = ultimo.res;
        if (!res.ganador) {
          return lab.callout("info", "Nada que reconciliar", h("p", {}, "Ninguna réplica había recibido una escritura todavía."));
        }
        var partes = [
          h("p", {}, "Partición curada: last-write-wins por versión. Gana la escritura más nueva — versión v" + res.ganador.version + ", valor ", h("code", { class: "bdii-mono" }, res.ganador.value), " — y se propaga a las " + state.n + " réplicas."),
        ];
        if (res.perdidos.length) {
          partes.push(h("p", {}, "Se pierde" + (res.perdidos.length > 1 ? "n" : "") + ": ",
            res.perdidos.map(function (p) { return "v" + p.version + " = " + p.value; }).join(", "),
            " — quedaron en un lado de la partición y la versión más nueva las pisa."));
        } else {
          partes.push(h("p", {}, "No hubo escrituras divergentes que perder: todas las réplicas con datos coincidían o estaban simplemente atrasadas con el mismo valor."));
        }
        partes.push(h("p", {}, "Es el enfoque AP: se acepta de los dos lados y se reconcilia después, en vez de bloquear como haría CP. Ver ", lab.pageLink("2.12.04 - Teorema CAP", "Teorema CAP"), " § 3."));
        return lab.callout(res.perdidos.length ? "warn" : "ok", "Partición curada", h("div", {}, partes));
      }

      // ---------------- nota del preset ----------------

      function renderNotaPreset() {
        notaPreset.replaceChildren();
        if (state.nota) {
          notaPreset.appendChild(lab.callout("info", "Sobre este escenario", h("p", {}, state.nota)));
        }
      }

      // ---------------- retos ----------------

      function renderRetos() {
        retosBody.replaceChildren();
        RETOS.forEach(function (reto) {
          var out = h("div", { "aria-live": "polite" });
          var comprobarBtn = lab.button({
            label: "Comprobar", kind: "primary",
            onClick: function () {
              var ok = reto.comprobar(state);
              out.replaceChildren(lab.callout(ok ? "ok" : "bad", ok ? "Coincide con la configuración pedida" : "Todavía no coincide",
                h("p", {}, ok ? "La configuración actual (N=" + state.n + ", W=" + state.w + ", R=" + state.r + ", partición " + (state.partitioned ? "activa" : "inactiva") + ", política " + state.policy + ") cumple lo pedido." : "Ajuste N, W, R, la partición y la política con los controles de arriba y vuelva a comprobar.")));
            },
          });
          var verBtn = lab.button({
            label: "Ver respuesta", kind: "ghost",
            onClick: function () {
              out.replaceChildren(lab.callout("info", "Respuesta", h("p", {}, reto.respuesta)));
            },
          });
          retosBody.appendChild(lab.panel(null,
            h("p", { class: "lab-cq-reto-enunciado" }, reto.enunciado),
            h("p", { class: "lab-cq-reto-fuente" }, "Fuente: ", reto.fuente, "."),
            h("div", {}, comprobarBtn.el, " ", verBtn.el),
            out,
          ));
        });
      }

      // ---------------- render general ----------------

      function render() {
        renderRing();
        renderTablaReplicas();
        renderResultado();
        renderNotaPreset();
      }

      // ---------------- armado del cuerpo ----------------

      var controlesGrid = lab.grid(2,
        nCtrl.el, presetCtrl.el,
        wCtrl.el, rCtrl.el,
        partitionCtrl.el, clientSideCtrl.el,
      );

      var accionesRow = h("div", { class: "lab-cq-actions" },
        valorCtrl.el,
        h("div", { class: "lab-cq-actions-buttons" }, escribirBtn.el, " ", leerBtn.el, " ", curarBtn.el),
      );

      if (compact) {
        // Figura: el anillo y los botones lado a lado, y el resultado debajo a todo el ancho.
        body.appendChild(lab.panel(null, controlesGrid, policyCtrl.el));
        body.appendChild(notaPreset);
        body.appendChild(lab.grid(2,
          lab.panel("Réplicas (clic en una para pasarla de lado, con la partición activa)", ring, clienteInfo),
          lab.panel("Acciones", accionesRow)));
        body.appendChild(lab.panel("Resultado", resultado));
      } else {
      body.appendChild(lab.panel("Configuración", controlesGrid, policyCtrl.el));
      body.appendChild(notaPreset);
      body.appendChild(lab.grid(2,
        lab.panel("Réplicas (clic en una para pasarla de lado, con la partición activa)", ring, clienteInfo, tablaReplicas),
        lab.panel("Acciones y resultado", accionesRow, resultado),
      ));
      }

      if (!compact) {
        body.appendChild(renderClasificacionCap());
        body.appendChild(lab.panel("Retos", retosBody));
        body.appendChild(lab.callout("info", "Simplificación de esta herramienta",
          h("p", {}, "La escritura contacta las primeras W réplicas alcanzables y la lectura las últimas R: es un orden fijo para que la demostración sea reproducible, no cómo elige nodos un coordinador real. Lo que sí es real es la garantía matemática: con W + R > N, cualquier lectura y cualquier escritura de esos tamaños comparten al menos una réplica (principio del palomar). La reconciliación al curar usa last-write-wins por el orden de las operaciones en esta herramienta, no un timestamp de pared ni vectores de versión.")));
        renderRetos();
      }

      render();

      return function cleanup() {
        // sin temporizadores ni listeners fuera de `body`: nada que limpiar.
      };
    },
  );
})();
