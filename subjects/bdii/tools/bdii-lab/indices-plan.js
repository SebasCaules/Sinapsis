/* ============================================================
   bdii-lab / indices-plan.js — "Índices y plan de ejecución"

   Dos paneles:
     (1) ¿Índice o recorrido completo? — dado N, filas/página, fanout del
         B+tree, tipo de índice (ninguno / B+tree sobre A / B+tree compuesto
         (A,B) / hash sobre A), si es clustered (PK de InnoDB) o secundario,
         y la consulta (7 formas), decide si el índice sirve (regla del
         prefijo izquierdo, hash solo igualdad, LIKE con comodín inicial),
         estima páginas leídas (índice vs. recorrido completo), dibuja la
         curva de costo contra selectividad con el punto de cruce, y arma
         una fila estilo EXPLAIN de MySQL (type/possible_keys/key/rows/Extra).
     (2) Árbol B+ en miniatura — orden m (3-6) elegible, inserta una lista de
         claves de a una (con los splits resaltados vía stepper), resalta el
         camino de búsqueda de una clave y el recorrido por hojas de un rango.

   Motor puro: App.bdiiLab.engines["indices-plan"]
     - sirveIndice(tipoIndice, consulta): regla del prefijo izquierdo, hash
       solo igualdad, LIKE con comodín inicial. Ver 1.08.02 - Índices.
     - alturaArbol, paginasFullScan, estimarPaginasIndice, curvaCosto,
       puntoDeCruce, explainRow: modelo de costo DIDÁCTICO (páginas leídas),
       con aviso explícito de que MySQL usa estadísticas y su propio modelo.
     - bplus.*: B+tree genérico (inserción con splits, camino de búsqueda,
       recorrido de rango por el encadenamiento de hojas, aplanado a
       {nodes, edges, leafChain} para dibujar).

   Fuentes (ver también `sources` de lab.tool() más abajo): 1.08.01 - Plan de
   ejecución, 1.08.02 - Índices, Clase 08 - Explicando el plan, Clase 11 -
   Seguridad-Transacciones (slides 31-38), Práctica 2026-08-18 (TP5), Final
   1Jul2025 (pregunta 1, índice hash para el login), MySQL.md.
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

  var TIPOS_INDICE = [
    { id: "none", label: "Ninguno" },
    { id: "btree_a", label: "B+tree sobre A" },
    { id: "btree_ab", label: "B+tree compuesto (A, B)" },
    { id: "hash_a", label: "Hash sobre A" },
  ];

  var CONSULTAS = [
    { id: "eq_a", label: "A = c" },
    { id: "between_a", label: "A BETWEEN c1 AND c2" },
    { id: "eq_b", label: "B = c (sin A)" },
    { id: "eq_ab", label: "A = c AND B = c" },
    { id: "order_a", label: "ORDER BY A" },
    { id: "like_prefix", label: "A LIKE 'x%'" },
    { id: "like_suffix", label: "A LIKE '%x'" },
  ];

  var REGLAS_CITAS = {
    "sin-indice": { stem: "1.08.01 - Plan de ejecución", label: "Plan de ejecución § Guía operativa" },
    "prefijo-izquierdo": { stem: "1.08.02 - Índices", label: "Índices § 3 (regla del prefijo izquierdo)" },
    "btree-rango-e-igualdad": { stem: "1.08.02 - Índices", label: "Índices § Slides 36-37 (B-tree vs. hash)" },
    "like-prefijo-constante": { stem: "1.08.02 - Índices", label: "Índices § Slide 36" },
    "like-comodin-inicial": { stem: "1.08.02 - Índices", label: "Índices § 6 (LIKE '%' no usa el índice)" },
    "orden-ya-dado": { stem: "1.08.01 - Plan de ejecución", label: "Plan de ejecución § nodos bloqueantes (Sort)" },
    "hash-igualdad": { stem: "1.08.02 - Índices", label: "Índices § Slide 32 y 37" },
    "hash-solo-igualdad": { stem: "1.08.02 - Índices", label: "Índices § Slide 37" },
  };

  /**
   * ¿El tipo de índice sirve para esta consulta? Devuelve
   * { usaIndice, cobertura: "total"|"parcial"|"ninguna", regla, explicacion }.
   * "parcial" = la primera columna entra en Index Cond, la segunda condición
   * (si la hay) queda como Filter después.
   */
  function sirveIndice(tipoIndice, consulta) {
    if (tipoIndice === "none") {
      return {
        usaIndice: false, cobertura: "ninguna", regla: "sin-indice",
        explicacion: "No hay índice creado: cualquier condición se evalúa leyendo la tabla entera.",
      };
    }

    if (tipoIndice === "hash_a") {
      if (consulta === "eq_a") {
        return {
          usaIndice: true, cobertura: "total", regla: "hash-igualdad",
          explicacion: "A = c es una igualdad con la clave completa del hash: un acceso al cajón (bucket) alcanza.",
        };
      }
      if (consulta === "eq_ab") {
        return {
          usaIndice: true, cobertura: "parcial", regla: "hash-igualdad",
          explicacion: "El hash resuelve A = c con un acceso; B = c se evalúa después como Filter, porque B no forma parte de este índice.",
        };
      }
      return {
        usaIndice: false, cobertura: "ninguna", regla: "hash-solo-igualdad",
        explicacion: "Un índice hash solo sirve para igualdad con la clave completa: no tiene orden, así que no sirve para rangos, ORDER BY ni LIKE.",
      };
    }

    if (tipoIndice === "btree_a") {
      if (consulta === "eq_a" || consulta === "between_a") {
        return {
          usaIndice: true, cobertura: "total", regla: "btree-rango-e-igualdad",
          explicacion: "El B+tree está ordenado por A: sirve tanto para igualdad como para un rango sobre A.",
        };
      }
      if (consulta === "order_a") {
        return {
          usaIndice: true, cobertura: "total", regla: "orden-ya-dado",
          explicacion: "El B+tree ya mantiene las claves de A en orden: recorrer las hojas de izquierda a derecha da el ORDER BY sin ordenar aparte.",
        };
      }
      if (consulta === "like_prefix") {
        return {
          usaIndice: true, cobertura: "total", regla: "like-prefijo-constante",
          explicacion: "'x%' es un prefijo constante: equivale a un rango [x, x\\uFFFF) sobre el índice ordenado, así que el B+tree lo resuelve.",
        };
      }
      if (consulta === "eq_ab") {
        return {
          usaIndice: true, cobertura: "parcial", regla: "prefijo-izquierdo",
          explicacion: "El índice resuelve A = c (Index Cond); B = c se filtra después porque B no está en este índice.",
        };
      }
      if (consulta === "eq_b") {
        return {
          usaIndice: false, cobertura: "ninguna", regla: "prefijo-izquierdo",
          explicacion: "El índice es sobre A: sin una condición sobre A, no hay por dónde entrar al árbol. B = c no acota nada.",
        };
      }
      return {
        usaIndice: false, cobertura: "ninguna", regla: "like-comodin-inicial",
        explicacion: "'%x' empieza con comodín: no hay prefijo constante que acote el B+tree, así que se lee la tabla entera.",
      };
    }

    // tipoIndice === "btree_ab"
    if (consulta === "eq_a" || consulta === "between_a") {
      return {
        usaIndice: true, cobertura: "total", regla: "prefijo-izquierdo",
        explicacion: "A es la primera columna del compuesto: por el prefijo izquierdo, sirve igual que un índice simple sobre A.",
      };
    }
    if (consulta === "order_a") {
      return {
        usaIndice: true, cobertura: "total", regla: "orden-ya-dado",
        explicacion: "El compuesto (A, B) está ordenado primero por A: recorrer las hojas da el ORDER BY A sin ordenar aparte.",
      };
    }
    if (consulta === "like_prefix") {
      return {
        usaIndice: true, cobertura: "total", regla: "like-prefijo-constante",
        explicacion: "'x%' es un rango sobre A, la primera columna del compuesto: el prefijo izquierdo lo permite.",
      };
    }
    if (consulta === "eq_ab") {
      return {
        usaIndice: true, cobertura: "total", regla: "prefijo-izquierdo",
        explicacion: "A y B entran juntas en Index Cond: el compuesto (A, B) cubre las dos condiciones por el prefijo izquierdo.",
      };
    }
    if (consulta === "eq_b") {
      return {
        usaIndice: false, cobertura: "ninguna", regla: "prefijo-izquierdo",
        explicacion: "B es la segunda columna del compuesto: sin A, el índice no acota nada (como buscar en la guía telefónica por nombre de pila).",
      };
    }
    return {
      usaIndice: false, cobertura: "ninguna", regla: "like-comodin-inicial",
      explicacion: "'%x' no da un prefijo constante en ninguna columna del compuesto: no hay Index Cond posible.",
    };
  }

  /** Altura del B+tree: ⌈log_fanout(N)⌉, con un piso de 1 nivel. */
  function alturaArbol(N, fanout) {
    var f = Math.max(2, fanout || 2);
    var n = Math.max(1, N || 1);
    if (n <= 1) return 1;
    return Math.max(1, Math.ceil(Math.log(n) / Math.log(f)));
  }

  /** Páginas para leer la tabla entera. */
  function paginasFullScan(N, filasPorPagina) {
    return Math.max(1, Math.ceil(Math.max(1, N || 1) / Math.max(1, filasPorPagina || 1)));
  }

  /**
   * Estima páginas leídas por el camino del índice (modelo didáctico):
   * altura (o 1 acceso, si es hash) + hojas del índice que hay que recorrer
   * + heap fetches (una lectura por fila, en el peor caso) si el índice NO
   * es clustered — si es clustered, la hoja ya es la fila.
   */
  function estimarPaginasIndice(opts) {
    var v = sirveIndice(opts.tipoIndice, opts.consulta);
    var N = Math.max(1, opts.N || 1);
    var filasPorPagina = Math.max(1, opts.filasPorPagina || 1);
    var full = paginasFullScan(N, filasPorPagina);
    var altura = alturaArbol(N, opts.fanout);

    if (!v.usaIndice) {
      return { paginas: full, full: full, veredicto: v, filasExaminadas: N, viaIndice: false, altura: altura, paginasHojas: 0, heapFetches: 0 };
    }

    var esHash = opts.tipoIndice === "hash_a";
    var esOrderA = opts.consulta === "order_a";
    var sel = opts.selectividad == null ? 1 : opts.selectividad;
    var filasIndexCond = esOrderA ? N : Math.max(1, Math.round(sel * N));
    // ORDER BY sin WHERE recorre TODAS las hojas de punta a punta: el único
    // descenso a la raíz es un costo fijo, insignificante frente a leer todas
    // las hojas, y no se suma aparte (si se sumara, en tablas chicas/medianas
    // la altura del árbol —proporcionalmente grande frente a un recorrido
    // corto— empujaba el costo del índice por encima del margen del 10% de
    // `explainRow` aun en el caso clustered, donde el motor real jamás
    // abandona el índice para un ORDER BY sobre la PK. Verificado en MySQL
    // 9.7.2: ORDER BY sobre PK da type=index/Extra=NULL sin importar el
    // tamaño de la tabla (500 o 100.000 filas).
    var costoTraversal = esOrderA ? 0 : (esHash ? 1 : altura);
    var paginasHojas = Math.max(1, Math.ceil(filasIndexCond / filasPorPagina));
    // Índice de cobertura: si todas las columnas pedidas están en el índice, no
    // hay que ir a la tabla (verificado en MySQL 9.7.2: SELECT a FROM big_a
    // ORDER BY a -> type=index, Extra=Using index; sin cobertura -> ALL).
    var cubre = !!opts.cobertura && v.cobertura === "total";
    var heapFetches = (opts.clustered || cubre) ? 0 : filasIndexCond;
    var paginas = costoTraversal + paginasHojas + heapFetches;

    return {
      paginas: Math.max(1, Math.round(paginas)), full: full,
      veredicto: v, filasExaminadas: filasIndexCond, viaIndice: true,
      altura: altura, paginasHojas: paginasHojas, heapFetches: heapFetches,
    };
  }

  /** Puntos {selectividad, indice, fullscan} para el gráfico, en escala log. */
  function curvaCosto(opts, n) {
    n = n || 26;
    var N = Math.max(1, opts.N || 1);
    var full = paginasFullScan(N, opts.filasPorPagina);
    var selMin = Math.max(1 / N, 0.000001);
    var logMin = Math.log(selMin);
    var logMax = Math.log(1);
    var pts = [];
    for (var i = 0; i < n; i++) {
      var t = n > 1 ? i / (n - 1) : 0;
      var sel = Math.exp(logMin + t * (logMax - logMin));
      var est = estimarPaginasIndice({
        N: opts.N, filasPorPagina: opts.filasPorPagina, fanout: opts.fanout,
        tipoIndice: opts.tipoIndice, consulta: opts.consulta, selectividad: sel,
        clustered: opts.clustered, unico: opts.unico,
      });
      pts.push({ selectividad: sel, indice: est.paginas, fullscan: full });
    }
    return pts;
  }

  /**
   * Selectividad donde el costo del índice iguala al del recorrido completo
   * (aproximación lineal, sin los `ceil` del modelo de páginas). Devuelve
   * { selectividad, siempre } — `siempre` es "indice" | "fullscan" | null
   * cuando no hay cruce dentro de [0,1] (uno de los dos gana siempre).
   */
  function puntoDeCruce(opts) {
    var v = sirveIndice(opts.tipoIndice, opts.consulta);
    if (!v.usaIndice || opts.consulta === "order_a") return { selectividad: null, siempre: null };
    var N = Math.max(1, opts.N || 1);
    var filasPorPagina = Math.max(1, opts.filasPorPagina || 1);
    var altura = alturaArbol(N, opts.fanout);
    var esHash = opts.tipoIndice === "hash_a";
    var costoTraversal = esHash ? 1 : altura;
    var full = paginasFullScan(N, filasPorPagina);
    var cubre = !!opts.cobertura && v.cobertura === "total";
    var coefSel = (N / filasPorPagina) + ((opts.clustered || cubre) ? 0 : N);
    if (coefSel <= 0) return { selectividad: null, siempre: "indice" };
    var sel = (full - costoTraversal) / coefSel;
    if (sel <= 0) return { selectividad: null, siempre: "fullscan" };
    if (sel >= 1) return { selectividad: null, siempre: "indice" };
    return { selectividad: sel, siempre: null };
  }

  function nombreIndice(tipoIndice) {
    if (tipoIndice === "btree_a") return "idx_a";
    if (tipoIndice === "btree_ab") return "idx_ab";
    if (tipoIndice === "hash_a") return "idx_a_hash";
    return null;
  }

  // Constantes del modelo de costos de MySQL 9.7.2 (tablas mysql.server_cost y
  // mysql.engine_cost, valores por omisión verificados en el motor):
  // row_evaluate_cost = 0.1 por fila evaluada, memory_block_read_cost = 0.25 por
  // página que ya está en el buffer pool.
  var COSTO_FILA_MYSQL = 0.1;
  var COSTO_PAGINA_MYSQL = 0.25;

  /**
   * Modelo de costo "estilo MySQL" para decidir entre el índice y el recorrido
   * completo (aproximación con las constantes de arriba, suponiendo las páginas
   * en memoria): recorrido = 0,25·páginas + 0,1·N; índice = 0,25·(descenso +
   * hojas) + 0,1·filas + 0,25·filas si cada fila exige ir a la tabla (índice
   * secundario sin cobertura). Con un índice secundario sin cobertura el cruce
   * queda cerca del 29 % de las filas estimadas, casi sin depender del ancho de
   * la fila: es lo que mide el motor real (MySQL 9.7.2, 100.000 filas: pasa de
   * range a ALL con ~28.900–29.700 filas estimadas, tanto con ~150 como con ~40
   * filas por página). Devuelve { scan, indice, selectividadCruce }.
   */
  function costoMysql(opts) {
    var v = sirveIndice(opts.tipoIndice, opts.consulta);
    var N = Math.max(1, opts.N || 1);
    var filasPorPagina = Math.max(1, opts.filasPorPagina || 1);
    var full = paginasFullScan(N, filasPorPagina);
    var scan = COSTO_PAGINA_MYSQL * full + COSTO_FILA_MYSQL * N;
    if (!v.usaIndice) return { scan: scan, indice: null, selectividadCruce: null };
    var esOrderA = opts.consulta === "order_a";
    var sel = esOrderA ? 1 : (opts.selectividad == null ? 1 : opts.selectividad);
    var filas = esOrderA ? N : Math.max(1, Math.round(sel * N));
    var cubre = !!opts.cobertura && v.cobertura === "total";
    var vaALaTabla = !opts.clustered && !cubre;
    var descenso = esOrderA ? 0 : (opts.tipoIndice === "hash_a" ? 1 : alturaArbol(N, opts.fanout));
    var hojas = Math.max(1, Math.ceil(filas / filasPorPagina));
    var porFila = COSTO_FILA_MYSQL + (vaALaTabla ? COSTO_PAGINA_MYSQL : 0);
    var indice = COSTO_PAGINA_MYSQL * (descenso + hojas) + porFila * filas;
    // selectividad donde indice == scan (aproximación lineal, sin los ceil)
    var coef = N * (porFila + COSTO_PAGINA_MYSQL / filasPorPagina);
    var selCruce = coef > 0 ? (scan - COSTO_PAGINA_MYSQL * descenso) / coef : null;
    if (selCruce != null && (selCruce <= 0 || selCruce >= 1)) selCruce = null;
    return { scan: scan, indice: indice, selectividadCruce: esOrderA ? null : selCruce };
  }

  /** Fila estilo EXPLAIN de MySQL: {type, possible_keys, key, rows, extra}. */
  function explainRow(opts) {
    var v = sirveIndice(opts.tipoIndice, opts.consulta);
    var est = estimarPaginasIndice(opts);
    // Un índice clustered ES la PK de InnoDB: el nombre que aparece en
    // possible_keys/key es siempre "PRIMARY", nunca el nombre inventado del
    // índice secundario (verificado en MySQL 9.7.2: acceso por PK simple o
    // compuesta da key=PRIMARY, jamás "idx_a"/"idx_ab").
    var nombre = opts.clustered ? "PRIMARY" : nombreIndice(opts.tipoIndice);
    var N = Math.max(1, opts.N || 1);
    var esOrder = opts.consulta === "order_a";
    var cubre = !!opts.cobertura && v.cobertura === "total";

    // B = c con un compuesto (A, B) secundario y cobertura: el prefijo izquierdo
    // impide el acceso clásico, pero MySQL recorre el índice entero en vez de la
    // tabla (verificado en MySQL 9.7.2: SELECT a,b FROM big_ab WHERE b=3 -> type=
    // index, key=idx_ab, "Using where; Using index"); si A tiene pocos valores
    // distintos usa skip scan (8.0.13+: type=range, "Using where; Using index for
    // skip scan", verificado con A de 5 valores). Con SELECT * da ALL.
    if (!v.usaIndice && opts.tipoIndice === "btree_ab" && opts.consulta === "eq_b" && opts.cobertura && !opts.clustered) {
      return {
        type: "index", possible_keys: nombre, key: nombre, rows: N, extra: "Using where; Using index",
        veredicto: v, estimacion: est, skipScan: true,
      };
    }

    if (!v.usaIndice) {
      var extraNo = esOrder ? "Using filesort" : "Using where";
      return { type: "ALL", possible_keys: null, key: null, rows: N, extra: extraNo, veredicto: v, estimacion: est };
    }

    // El índice "serviría" por la regla del prefijo izquierdo, pero el modelo de
    // costo estilo MySQL (costoMysql) dice que sale más caro que el recorrido
    // completo: pasa con un índice secundario sin cobertura y una selectividad
    // alta (cada fila exige ir a la tabla). El índice queda listado en
    // possible_keys, salvo en ORDER BY sin WHERE, donde possible_keys es NULL
    // porque no hay condición que lo proponga (verificado en MySQL 9.7.2).
    var cm = costoMysql(opts);
    if (cm.indice != null && cm.indice > cm.scan) {
      return {
        type: "ALL", possible_keys: esOrder ? null : nombre, key: null, rows: N,
        extra: esOrder ? "Using filesort" : "Using where",
        veredicto: v, estimacion: est, avisoCruce: true, costo: cm,
      };
    }

    var type;
    if (esOrder) {
      type = "index";
    } else if (opts.consulta === "between_a" || opts.consulta === "like_prefix") {
      type = "range";
    } else {
      var esUnico = !!opts.unico || !!opts.clustered;
      type = (esUnico && est.filasExaminadas <= 1) ? "const" : "ref";
    }

    // Extra, según lo que da MySQL 9.7.2 (tablas de 100.000 filas):
    //   range secundario sin cobertura  -> Using index condition (ICP)
    //   range sobre la PK (clustered)   -> Using where
    //   range con cobertura             -> Using where; Using index
    //   ref/const con cobertura         -> Using index
    //   ref con condición fuera del índice (A = c AND B = c con índice sobre A)
    //                                   -> Using where
    //   index (ORDER BY) con cobertura  -> Using index; sobre la PK -> NULL
    // "Using index" depende de si las columnas PEDIDAS (opts.cobertura, el toggle
    // de la interfaz) están todas dentro del índice usado, no de si es clustered.
    var extra = null;
    if (type === "range") {
      extra = cubre ? "Using where; Using index" : (opts.clustered ? "Using where" : "Using index condition");
    } else {
      var extraParts = [];
      if (v.cobertura === "parcial") extraParts.push("Using where");
      if (cubre) extraParts.push("Using index");
      extra = extraParts.length ? extraParts.join("; ") : null;
    }

    // ORDER BY sin WHERE: no hay condición que proponga un candidato, así que
    // possible_keys es NULL aunque key use el índice (verificado en MySQL 9.7.2:
    // materia con PK(codigo), ORDER BY codigo -> possible_keys NULL, key PRIMARY).
    return { type: type, possible_keys: esOrder ? null : nombre, key: nombre, rows: est.filasExaminadas, extra: extra, veredicto: v, estimacion: est, costo: cm };
  }

  // ------------------------------------------------------------------
  // B+tree genérico
  // ------------------------------------------------------------------

  var bplus = {};
  bplus.ORDEN_MIN = 3;
  bplus.ORDEN_MAX = 6;

  bplus.crear = function (orden) {
    return { orden: orden, nodes: { 0: { id: 0, leaf: true, keys: [], children: null, next: null } }, rootId: 0, nextId: 1 };
  };

  function clonarArbol(tree) { return JSON.parse(JSON.stringify(tree)); }
  function nuevoId(tree) { var id = tree.nextId; tree.nextId += 1; return id; }

  function insertarOrdenado(arr, v) {
    var i = 0;
    while (i < arr.length && arr[i] < v) i++;
    arr.splice(i, 0, v);
  }

  function encontrarCaminoHoja(tree, key) {
    var path = [];
    var id = tree.rootId;
    while (true) {
      path.push(id);
      var node = tree.nodes[id];
      if (node.leaf) break;
      var idx = 0;
      while (idx < node.keys.length && key >= node.keys[idx]) idx++;
      id = node.children[idx];
    }
    return path;
  }

  function dividirHoja(tree, leaf) {
    var m = tree.orden;
    var leftCount = Math.ceil(m / 2);
    var allKeys = leaf.keys;
    var leftKeys = allKeys.slice(0, leftCount);
    var rightKeys = allKeys.slice(leftCount);
    var rightId = nuevoId(tree);
    tree.nodes[rightId] = { id: rightId, leaf: true, keys: rightKeys, children: null, next: leaf.next };
    leaf.keys = leftKeys;
    leaf.next = rightId;
    return { sepKey: rightKeys[0], rightId: rightId };
  }

  function insertarEnInterno(node, sepKey, rightId) {
    var idx = 0;
    while (idx < node.keys.length && sepKey > node.keys[idx]) idx++;
    node.keys.splice(idx, 0, sepKey);
    node.children.splice(idx + 1, 0, rightId);
  }

  function dividirInterno(tree, node) {
    var midIndex = Math.floor(node.keys.length / 2);
    var sepKey = node.keys[midIndex];
    var leftKeys = node.keys.slice(0, midIndex);
    var rightKeys = node.keys.slice(midIndex + 1);
    var leftChildren = node.children.slice(0, midIndex + 1);
    var rightChildren = node.children.slice(midIndex + 1);
    var rightId = nuevoId(tree);
    tree.nodes[rightId] = { id: rightId, leaf: false, keys: rightKeys, children: rightChildren };
    node.keys = leftKeys;
    node.children = leftChildren;
    return { sepKey: sepKey, rightId: rightId };
  }

  /** Inserta `key`; divide hojas/internos en cascada si hace falta. */
  bplus.insertar = function (tree, key) {
    var m = tree.orden;
    var path = encontrarCaminoHoja(tree, key);
    var leafId = path[path.length - 1];
    var leaf = tree.nodes[leafId];
    if (leaf.keys.indexOf(key) !== -1) return { duplicate: true, path: path, splitIds: [] };

    insertarOrdenado(leaf.keys, key);
    var splitIds = [];
    var carry = null;
    if (leaf.keys.length > m - 1) { carry = dividirHoja(tree, leaf); splitIds.push(leaf.id); }

    for (var i = path.length - 2; i >= 0 && carry; i--) {
      var parent = tree.nodes[path[i]];
      insertarEnInterno(parent, carry.sepKey, carry.rightId);
      if (parent.keys.length > m - 1) { carry = dividirInterno(tree, parent); splitIds.push(parent.id); }
      else { carry = null; }
    }

    if (carry) {
      var newRootId = nuevoId(tree);
      var oldRootId = tree.rootId;
      tree.nodes[newRootId] = { id: newRootId, leaf: false, keys: [carry.sepKey], children: [oldRootId, carry.rightId] };
      tree.rootId = newRootId;
      splitIds.push(newRootId);
    }

    return { duplicate: false, path: path, splitIds: splitIds };
  };

  /** Inserta cada clave de a una; devuelve un snapshot del árbol por paso. */
  bplus.construirPasos = function (orden, claves) {
    var m = Math.max(bplus.ORDEN_MIN, Math.min(bplus.ORDEN_MAX, orden || bplus.ORDEN_MIN));
    var tree = bplus.crear(m);
    var pasos = [];
    (claves || []).forEach(function (k) {
      var res = bplus.insertar(tree, k);
      pasos.push({ key: k, duplicate: res.duplicate, splitIds: res.splitIds, tree: clonarArbol(tree) });
    });
    return pasos;
  };

  bplus.caminoBusqueda = function (tree, key) {
    var path = encontrarCaminoHoja(tree, key);
    var leaf = tree.nodes[path[path.length - 1]];
    return { path: path, found: leaf.keys.indexOf(key) !== -1, leafId: leaf.id };
  };

  /** Recorre las hojas desde `lo` hasta pasar `hi`, por el encadenamiento. */
  bplus.recorridoRango = function (tree, lo, hi) {
    if (hi < lo) { var t = lo; lo = hi; hi = t; }
    var path = encontrarCaminoHoja(tree, lo);
    var leafId = path[path.length - 1];
    var leaves = [];
    var keys = [];
    var guard = 0;
    while (leafId != null && guard < 100000) {
      guard++;
      var leaf = tree.nodes[leafId];
      leaves.push(leafId);
      leaf.keys.forEach(function (k) { if (k >= lo && k <= hi) keys.push(k); });
      var maxKey = leaf.keys.length ? leaf.keys[leaf.keys.length - 1] : null;
      if (maxKey != null && maxKey >= hi) break;
      leafId = leaf.next;
    }
    return { leaves: leaves, keys: keys };
  };

  /** Aplana el árbol a {nodes:[{id,leaf,keys,level,x}], edges, leafChain}. */
  bplus.aplanar = function (tree) {
    var order = [];
    function dfsLeaves(id) {
      var node = tree.nodes[id];
      if (node.leaf) { order.push(id); return; }
      node.children.forEach(dfsLeaves);
    }
    dfsLeaves(tree.rootId);
    var leafX = {};
    order.forEach(function (id, i) { leafX[id] = i; });

    var levels = {};
    function computeLevel(id, lvl) {
      levels[id] = lvl;
      var node = tree.nodes[id];
      if (!node.leaf) node.children.forEach(function (c) { computeLevel(c, lvl + 1); });
    }
    computeLevel(tree.rootId, 0);

    var xPos = {};
    function computeX(id) {
      var node = tree.nodes[id];
      if (node.leaf) { xPos[id] = leafX[id]; return leafX[id]; }
      var xs = node.children.map(computeX);
      var avg = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length;
      xPos[id] = avg;
      return avg;
    }
    computeX(tree.rootId);

    var nodes = Object.keys(tree.nodes).map(function (k) {
      var node = tree.nodes[k];
      return { id: node.id, leaf: node.leaf, keys: node.keys.slice(), level: levels[node.id], x: xPos[node.id] };
    });
    var edges = [];
    Object.keys(tree.nodes).forEach(function (k) {
      var node = tree.nodes[k];
      if (!node.leaf) node.children.forEach(function (c) { edges.push({ from: node.id, to: c }); });
    });
    var leafChain = [];
    order.forEach(function (id, i) { if (i < order.length - 1) leafChain.push({ from: id, to: order[i + 1] }); });

    var maxLevel = 0;
    Object.keys(levels).forEach(function (k) { if (levels[k] > maxLevel) maxLevel = levels[k]; });

    return { nodes: nodes, edges: edges, leafChain: leafChain, maxLevel: maxLevel, leafCount: Math.max(1, order.length) };
  };

  App.bdiiLab.engines["indices-plan"] = {
    TIPOS_INDICE: TIPOS_INDICE,
    CONSULTAS: CONSULTAS,
    REGLAS_CITAS: REGLAS_CITAS,
    sirveIndice: sirveIndice,
    alturaArbol: alturaArbol,
    paginasFullScan: paginasFullScan,
    estimarPaginasIndice: estimarPaginasIndice,
    curvaCosto: curvaCosto,
    puntoDeCruce: puntoDeCruce,
    nombreIndice: nombreIndice,
    explainRow: explainRow,
    costoMysql: costoMysql,
    bplus: bplus,
  };

  // ==================================================================
  // Datos: escenarios precargados (origen rotulado, ver TOOLS_BRIEF.md)
  // ==================================================================

  var PRESETS_CONSULTA = [
    {
      label: "TP5 ej. 2 bloque A — materia.codigo con PK simple (consulta del ej. 2 sobre el dataset del ej. 3: materia.csv, 500 filas)",
      origen: "Práctica 2026-08-18 (TP5), ejercicio 2, bloque A",
      N: 500, filasPorPagina: 50, fanout: 200,
      tipoIndice: "btree_a", consulta: "eq_a", selectividad: 1 / 500,
      clustered: true, unico: true, cobertura: false,
    },
    {
      label: "TP5 ej. 2 bloque B — PK compuesta (codigo, nombre) (consulta del ej. 2 sobre el dataset del ej. 3: materia.csv, 500 filas)",
      origen: "Práctica 2026-08-18 (TP5), ejercicio 2, bloque B",
      N: 500, filasPorPagina: 50, fanout: 200,
      tipoIndice: "btree_ab", consulta: "eq_ab", selectividad: 1 / 500,
      clustered: true, unico: true, cobertura: true,
    },
    {
      label: "TP5 ej. 2 bloque C — ORDER BY codigo con PK (consulta del ej. 2 sobre el dataset del ej. 3: materia.csv, 500 filas)",
      origen: "Práctica 2026-08-18 (TP5), ejercicio 2, bloque C",
      N: 500, filasPorPagina: 50, fanout: 200,
      tipoIndice: "btree_a", consulta: "order_a", selectividad: 1,
      clustered: true, unico: true, cobertura: false,
    },
    {
      label: "Índices § 3 — graduados, filtrando solo por nombre",
      origen: "1.08.02 - Índices § 3, experimento inverso (deck Clase 08)",
      N: 8532, filasPorPagina: 60, fanout: 250,
      tipoIndice: "btree_ab", consulta: "eq_b", selectividad: 1 / 4318,
      clustered: false, unico: false, cobertura: false,
    },
    {
      label: "Índices § 6 — comodín inicial, caso análogo a graduados apellido LIKE '%'",
      origen: "1.08.02 - Índices § 6 (deck Clase 08, slide 16) — mismo patrón: comodín al inicio del LIKE",
      N: 8532, filasPorPagina: 60, fanout: 250,
      tipoIndice: "btree_a", consulta: "like_suffix", selectividad: 1,
      clustered: false, unico: false, cobertura: false,
    },
    {
      label: "Final 1Jul2025 — índice para el login por userID",
      origen: "Final 1Jul2025, pregunta 1",
      N: 5000000, filasPorPagina: 200, fanout: 400,
      tipoIndice: "hash_a", consulta: "eq_a", selectividad: 1 / 5000000,
      clustered: false, unico: true, cobertura: false,
    },
  ];

  var PRESETS_ARBOL = [
    {
      label: "TP5 ej. 1 — códigos de materia (INSERT del enunciado)",
      origen: "Práctica 2026-08-18 (TP5), ejercicio 1",
      orden: 3, claves: [10, 20, 30, 40, 50, 60],
    },
    {
      label: "TP5 ej. 2 — legajos de inscripto (INSERT del enunciado)",
      origen: "Práctica 2026-08-18 (TP5), ejercicio 2",
      orden: 3, claves: [100, 200, 300, 400],
    },
    {
      label: "Ilustración con varios splits (orden 3)",
      origen: "elaboración propia, no es un caso del vault",
      orden: 3, claves: [5, 15, 25, 35, 45, 55, 65, 75, 85],
    },
  ];

  // ==================================================================
  // Interfaz
  // ==================================================================

  var h = lab.h;
  var svg = lab.svg;
  var engine = App.bdiiLab.engines["indices-plan"];

  function niceLogTicks(min, max) {
    var lo = Math.floor(Math.log(Math.max(min, 1e-9)) / Math.LN10);
    var hi = Math.ceil(Math.log(Math.max(max, min * 1.0001)) / Math.LN10);
    var ticks = [];
    for (var e = lo; e <= hi; e++) {
      var v = Math.pow(10, e);
      if (v >= min * 0.999 && v <= max * 1.001) ticks.push(v);
    }
    if (!ticks.length) ticks = [min, max];
    return ticks;
  }

  /** Código en línea dentro de una oración (lab.code() devuelve un bloque <pre>, que no va dentro de <p>). */
  function codigoEnLinea(texto) { return h("code", { class: "bdii-mono lab-indices-plan-inlinecode" }, texto); }

  /** Rótulo corto del eje X (porcentaje): 0,001 % · 0,1 % · 1 % · 100 %. */
  function formatEjeSelectividad(v) {
    var pct = v * 100;
    if (pct >= 1) return lab.fmtInt(Math.round(pct)) + " %";
    var dec = Math.min(6, Math.max(1, Math.ceil(-Math.log(pct) / Math.LN10 - 1e-9)));
    return lab.fmtNum(pct, dec) + " %";
  }

  function formatSelectividad(v) {
    return v >= 0.01 ? lab.fmtNum(v * 100, 2) + "%" : "1 de " + lab.fmtInt(Math.round(1 / v));
  }

  /** Gráfico costo (páginas, escala log) vs. selectividad (escala log). */
  function renderChart(points, cruce, fullVal) {
    // viewBox chico (400 unidades) y rótulos de 15 unidades: escalado a la
    // columna de resultado (~310 px a 375 de ancho, ~420 px a 1280) el texto
    // queda en ~11,5-16 px, legible.
    var W = 400, H = 240;
    var margin = { l: 66, r: 14, t: 12, b: 36 };
    var plotW = W - margin.l - margin.r;
    var plotH = H - margin.t - margin.b;

    var selVals = points.map(function (p) { return p.selectividad; });
    var minSel = Math.min.apply(null, selVals), maxSel = Math.max.apply(null, selVals);
    var allY = [];
    points.forEach(function (p) { allY.push(p.indice, p.fullscan); });
    var minY = Math.max(1, Math.min.apply(null, allY));
    var maxY = Math.max.apply(null, allY);
    if (maxY <= minY) maxY = minY + 1;
    if (maxSel <= minSel) maxSel = minSel * 10;

    function xPix(sel) {
      var t = (Math.log(sel) - Math.log(minSel)) / (Math.log(maxSel) - Math.log(minSel));
      return margin.l + t * plotW;
    }
    function yPix(val) {
      var v = Math.max(1, val);
      var t = (Math.log(v) - Math.log(minY)) / (Math.log(maxY) - Math.log(minY));
      return margin.t + (1 - t) * plotH;
    }
    function pathFor(key) {
      return points.map(function (p, i) {
        return (i === 0 ? "M" : "L") + xPix(p.selectividad).toFixed(1) + "," + yPix(p[key]).toFixed(1);
      }).join(" ");
    }

    var children = [];
    children.push(svg("line", { x1: margin.l, y1: margin.t, x2: margin.l, y2: margin.t + plotH, class: "lab-indices-plan-axis" }));
    children.push(svg("line", { x1: margin.l, y1: margin.t + plotH, x2: margin.l + plotW, y2: margin.t + plotH, class: "lab-indices-plan-axis" }));

    niceLogTicks(minY, maxY).forEach(function (v) {
      var y = yPix(v);
      children.push(svg("line", { x1: margin.l, y1: y, x2: margin.l + plotW, y2: y, class: "lab-indices-plan-gridline" }));
      children.push(svg("text", { x: margin.l - 6, y: y + 3, class: "lab-indices-plan-axistext", "text-anchor": "end" }, lab.fmtInt(v)));
    });
    niceLogTicks(minSel, maxSel).forEach(function (v) {
      var x = xPix(v);
      children.push(svg("text", { x: x, y: margin.t + plotH + 20, class: "lab-indices-plan-axistext", "text-anchor": "middle" }, formatEjeSelectividad(v)));
    });

    children.push(svg("path", { d: pathFor("fullscan"), class: "lab-indices-plan-line lab-indices-plan-line--full" }));
    children.push(svg("path", { d: pathFor("indice"), class: "lab-indices-plan-line lab-indices-plan-line--idx" }));

    if (cruce && cruce.selectividad != null) {
      var cx = xPix(cruce.selectividad);
      children.push(svg("line", { x1: cx, y1: margin.t, x2: cx, y2: margin.t + plotH, class: "lab-indices-plan-crossline" }));
      children.push(svg("circle", { cx: cx, cy: yPix(fullVal), r: 4, class: "lab-indices-plan-crossdot" }));
    }

    return svg("svg", {
      viewBox: "0 0 " + W + " " + H, class: "lab-indices-plan-chart", role: "img",
      "aria-label": "Páginas leídas según selectividad: índice contra recorrido completo",
    }, children);
  }

  /** Dibuja el árbol aplanado; opts: {pathIds, splitIds, rangeLeafIds, foundKey}. */
  function renderArbolSVG(flat, opts) {
    opts = opts || {};
    var levelH = 90, leafGap = 84, nodeH = 34, keyW = 34, minPad = 40;
    var leafCount = Math.max(1, flat.leafCount);
    var W = Math.max(360, leafCount * leafGap + minPad * 2);
    var H = (flat.maxLevel + 1) * levelH + nodeH + 20;

    var byId = {};
    flat.nodes.forEach(function (n) { byId[n.id] = n; });

    function nodeWidth(n) { return Math.max(keyW, n.keys.length * keyW) + 12; }
    function nodeCenterX(n) {
      var span = leafCount > 1 ? leafCount - 1 : 1;
      var t = leafCount > 1 ? n.x / span : 0.5;
      return minPad + t * (W - minPad * 2);
    }
    function nodeCenterY(n) { return 18 + n.level * levelH + nodeH / 2; }

    var edgeEls = flat.edges.map(function (e) {
      var a = byId[e.from], b = byId[e.to];
      return svg("line", {
        x1: nodeCenterX(a), y1: nodeCenterY(a) + nodeH / 2,
        x2: nodeCenterX(b), y2: nodeCenterY(b) - nodeH / 2,
        class: "lab-indices-plan-edge",
      });
    });

    var chainEls = flat.leafChain.map(function (e) {
      var a = byId[e.from], b = byId[e.to];
      return svg("line", {
        x1: nodeCenterX(a) + nodeWidth(a) / 2, y1: nodeCenterY(a),
        x2: nodeCenterX(b) - nodeWidth(b) / 2, y2: nodeCenterY(b),
        class: "lab-indices-plan-chain",
      });
    });

    var pathIds = opts.pathIds || [];
    var splitIds = opts.splitIds || [];
    var rangeLeafIds = opts.rangeLeafIds || [];

    var nodeEls = flat.nodes.map(function (n) {
      var cx = nodeCenterX(n), cy = nodeCenterY(n);
      var w = nodeWidth(n);
      var classes = ["lab-indices-plan-node", n.leaf ? "is-leaf" : "is-internal"];
      if (pathIds.indexOf(n.id) !== -1) classes.push("is-path");
      if (splitIds.indexOf(n.id) !== -1) classes.push("is-split");
      if (rangeLeafIds.indexOf(n.id) !== -1) classes.push("is-range");

      var cellW = w / Math.max(1, n.keys.length);
      var cellEls = [];
      n.keys.forEach(function (k, i) {
        var kx = cx - w / 2 + cellW * i;
        var found = opts.foundKey != null && n.leaf && k === opts.foundKey;
        if (i > 0) cellEls.push(svg("line", { x1: kx, y1: cy - nodeH / 2, x2: kx, y2: cy + nodeH / 2, class: "lab-indices-plan-celldiv" }));
        cellEls.push(svg("rect", { x: kx, y: cy - nodeH / 2, width: cellW, height: nodeH, class: "lab-indices-plan-cell" + (found ? " is-found" : "") }));
        cellEls.push(svg("text", { x: kx + cellW / 2, y: cy + 4, "text-anchor": "middle", class: "lab-indices-plan-keytext" }, String(k)));
      });

      return svg("g", { class: classes.join(" ") },
        svg("rect", { x: cx - w / 2, y: cy - nodeH / 2, width: w, height: nodeH, class: "lab-indices-plan-nodebox" }),
        cellEls);
    });

    return svg("svg", {
      viewBox: "0 0 " + W + " " + H, class: "lab-indices-plan-tree", role: "img", "aria-label": "Árbol B+ en miniatura",
    }, edgeEls, chainEls, nodeEls);
  }

  lab.tool(
    {
      id: "indices-plan",
      title: "Índices y plan de ejecución",
      subtitle: "Cuándo un índice acorta la lectura y cuándo el motor prefiere leer la tabla entera; y cómo se arma un B+tree por dentro.",
      sources: [
        { stem: "1.08.01 - Plan de ejecución", label: "Plan de ejecución" },
        { stem: "1.08.02 - Índices", label: "Índices" },
        { stem: "Clase 08 - Explicando el plan", label: "Clase 08" },
        { stem: "Clase 11 - Seguridad-Transacciones", label: "Clase 11 (índices, slides 31-38)" },
        { stem: "Práctica 2026-08-18", label: "TP5 Explain Plan" },
        { stem: "Final 1Jul2025", label: "Final 1Jul2025" },
        { stem: "MySQL", label: "MySQL" },
      ],
      figure: { id: "lab-indices-plan", caption: "Índice o recorrido completo: qué predice el EXPLAIN según el tipo de índice, la consulta y la selectividad.", height: 460 },
    },
    function mount(body, ctx) {
      var compact = ctx.mode === "figure";
      var cleanupFns = [];

      // Comienza con el primer escenario precargado (y el selector lo muestra elegido).
      var p0 = PRESETS_CONSULTA[0];
      var state = {
        N: p0.N, filasPorPagina: p0.filasPorPagina, fanout: p0.fanout,
        tipoIndice: p0.tipoIndice, consulta: p0.consulta, selectividad: p0.selectividad,
        clustered: p0.clustered, unico: p0.unico, cobertura: !!p0.cobertura,
      };

      var resultado = h("div", { "aria-live": "polite", class: "lab-indices-plan-resultado" });

      var presetCtrl = lab.presetPicker({ label: "Escenario de partida", presets: PRESETS_CONSULTA, value: 0, onPick: function (p) { aplicarPreset(p); } });

      var nCtrl = lab.slider({
        label: "N filas", min: 100, max: 100000000, log: true, value: state.N,
        format: function (v) { return lab.fmtInt(Math.round(v)) + " " + lab.plural(Math.round(v), "fila"); },
        onChange: function (v) { state.N = Math.round(v); render(); },
      });
      var filasPagCtrl = lab.number({
        label: "Filas por página", min: 1, max: 2000, step: 1, value: state.filasPorPagina,
        onChange: function (v) { state.filasPorPagina = v; render(); },
      });
      var fanoutCtrl = lab.slider({
        label: "Fanout del B+tree (hijos por nodo)", min: 2, max: 2000, step: 1, value: state.fanout,
        format: function (v) { return lab.fmtInt(Math.round(v)); },
        onChange: function (v) { state.fanout = Math.round(v); render(); },
      });
      var tipoCtrl = lab.segmented({
        label: "Tipo de índice",
        options: TIPOS_INDICE.map(function (t) { return { value: t.id, label: t.label }; }),
        value: state.tipoIndice,
        onChange: function (v) { state.tipoIndice = v; sincronizarClusteredUnico(); render(); },
      });
      var consultaCtrl = lab.select({
        label: "Consulta",
        options: CONSULTAS.map(function (c) { return { value: c.id, label: c.label }; }),
        value: state.consulta,
        onChange: function (v) { state.consulta = v; actualizarSelectividadDisabled(); render(); },
      });
      var selCtrl = lab.slider({
        label: "Selectividad de la condición", min: 0.00001, max: 1, log: true, value: state.selectividad,
        format: formatSelectividad,
        onChange: function (v) { state.selectividad = v; render(); },
      });
      var clusteredCtrl = lab.toggle({
        label: "Clustered (PK de InnoDB)", checked: state.clustered,
        onChange: function (v) { state.clustered = v; sincronizarClusteredUnico(); render(); },
      });
      var unicoCtrl = lab.toggle({
        label: "Único (PK / UNIQUE)", checked: state.unico,
        onChange: function (v) { state.unico = v; render(); },
      });
      var coberturaCtrl = lab.toggle({
        label: "La consulta solo pide columnas del índice (posible cobertura)", checked: state.cobertura,
        onChange: function (v) { state.cobertura = v; render(); },
      });

      function sincronizarClusteredUnico() {
        if (state.clustered) { state.unico = true; unicoCtrl.set(true); }
        var input = unicoCtrl.el.querySelector("input");
        if (input) input.disabled = state.clustered;
      }
      function actualizarSelectividadDisabled() {
        var disabled = state.consulta === "order_a";
        var input = selCtrl.el.querySelector("input");
        if (input) input.disabled = disabled;
        selCtrl.el.classList.toggle("lab-indices-plan-dim", disabled);
      }
      function aplicarPreset(p) {
        state.N = p.N; state.filasPorPagina = p.filasPorPagina; state.fanout = p.fanout;
        state.tipoIndice = p.tipoIndice; state.consulta = p.consulta; state.selectividad = p.selectividad;
        state.clustered = p.clustered; state.unico = p.unico; state.cobertura = !!p.cobertura;
        nCtrl.set(state.N); filasPagCtrl.set(state.filasPorPagina); fanoutCtrl.set(state.fanout);
        tipoCtrl.set(state.tipoIndice); consultaCtrl.set(state.consulta); selCtrl.set(state.selectividad);
        clusteredCtrl.set(state.clustered); unicoCtrl.set(state.unico); coberturaCtrl.set(state.cobertura);
        sincronizarClusteredUnico(); actualizarSelectividadDisabled(); render();
      }

      function optsFromState() {
        return {
          N: state.N, filasPorPagina: state.filasPorPagina, fanout: state.fanout,
          tipoIndice: state.tipoIndice, consulta: state.consulta, selectividad: state.selectividad,
          clustered: state.clustered, unico: state.unico, cobertura: state.cobertura,
        };
      }

      /** Figura: veredicto, EXPLAIN en una fila y el gráfico de costo, lado a lado. */
      function renderCompact() {
        var opts = optsFromState();
        var v = engine.sirveIndice(state.tipoIndice, state.consulta);
        var full = engine.paginasFullScan(state.N, state.filasPorPagina);
        var explain = engine.explainRow(opts);
        var cruce = engine.puntoDeCruce(opts);
        var cita = REGLAS_CITAS[v.regla];
        var izq = [
          lab.callout(
            v.usaIndice ? (v.cobertura === "total" ? "ok" : "warn") : "bad",
            v.usaIndice ? (v.cobertura === "total" ? "El índice resuelve la consulta" : "El índice ayuda solo en parte") : "El motor recorre la tabla completa",
            h("p", {}, v.explicacion),
            cita ? h("p", {}, "Regla: ", lab.pageLink(cita.stem, cita.label)) : null),
        ];
        if (state.tipoIndice === "hash_a") {
          izq.push(lab.callout("warn", "InnoDB no tiene índices hash de usuario",
            h("p", {}, "Acepta ", codigoEnLinea("USING HASH"), " sin error, pero crea un BTREE (verificado con ", codigoEnLinea("SHOW INDEX"), " en MySQL 9.7.2).")));
        }
        if (explain.avisoCruce) {
          izq.push(lab.callout("warn", "Serviría por la regla, pero no conviene",
            h("p", {}, "Con esta selectividad, ir a la tabla por cada fila cuesta más que leerla entera: el EXPLAIN predice ALL.")));
        }
        izq.push(lab.table({
          caption: "EXPLAIN (estilo MySQL, modelo didáctico)",
          columns: [
            { key: "type", label: "type", mono: true }, { key: "key", label: "key", mono: true },
            { key: "rows", label: "rows", align: "right", mono: true }, { key: "extra", label: "Extra", mono: true },
          ],
          rows: [{ type: explain.type, key: explain.key, rows: lab.fmtInt(explain.rows), extra: explain.extra }],
        }));
        var der;
        if (state.consulta !== "order_a") {
          var croceTexto = cruce.selectividad != null
            ? "cruce ≈ " + formatSelectividad(cruce.selectividad)
            : (cruce.siempre === "indice" ? "el índice conviene en todo el rango" : (cruce.siempre === "fullscan" ? "el recorrido completo conviene en todo el rango" : "el índice no sirve: coincide con el recorrido completo"));
          der = h("div", {},
            h("div", { class: "lab-indices-plan-chartwrap" }, renderChart(engine.curvaCosto(opts, 26), cruce, full)),
            h("p", { class: "lab-indices-plan-chartleg" },
              h("span", { class: "lab-indices-plan-swatch lab-indices-plan-swatch--idx" }), " índice · ",
              h("span", { class: "lab-indices-plan-swatch lab-indices-plan-swatch--full" }), " recorrido completo (páginas leídas, escala log) · ",
              croceTexto));
        } else {
          der = lab.callout("info", "ORDER BY sin WHERE: no hay selectividad",
            h("p", {}, v.usaIndice ? "El B+tree ya mantiene las claves ordenadas: el orden sale gratis." : "Sin índice hay que leer todo y ordenar aparte (Using filesort)."));
        }
        resultado.appendChild(lab.grid(2, h("div", { class: "lab-indices-plan-figcol" }, izq), der));
      }

      function render() {
        resultado.replaceChildren();
        if (compact) { renderCompact(); return; }
        var opts = optsFromState();
        var v = engine.sirveIndice(state.tipoIndice, state.consulta);
        var est = engine.estimarPaginasIndice(opts);
        var full = engine.paginasFullScan(state.N, state.filasPorPagina);
        var explain = engine.explainRow(opts);
        var cruce = engine.puntoDeCruce(opts);
        var cita = REGLAS_CITAS[v.regla];

        resultado.appendChild(lab.callout(
          v.usaIndice ? (v.cobertura === "total" ? "ok" : "warn") : "bad",
          v.usaIndice ? (v.cobertura === "total" ? "El índice resuelve la consulta" : "El índice ayuda solo en parte") : "El motor recorre la tabla completa",
          h("p", {}, v.explicacion),
          cita ? h("p", {}, "Regla: ", lab.pageLink(cita.stem, cita.label)) : null,
        ));

        if (state.tipoIndice === "hash_a") {
          resultado.appendChild(lab.callout("warn", "InnoDB no tiene índices hash de usuario",
            h("p", {}, "Aunque se declare ", lab.badge("USING HASH", "warn"), ", InnoDB acepta la sentencia sin error pero crea un ",
              lab.badge("BTREE", "neutral"), " (verificado con ", codigoEnLinea("SHOW INDEX"), " en MySQL 9.7.2 — ver contraste con el motor real). Un hash de verdad solo existe declarado sobre tablas ", codigoEnLinea("ENGINE=MEMORY"), "."),
            h("p", {}, "Fuente: ", lab.pageLink("1.08.02 - Índices", "Índices § Slide 38"), " · ", lab.pageLink("Final 1Jul2025", "Final 1Jul2025, pregunta 1"))));

          // El BTREE real que InnoDB crea detrás de USING HASH solo rescata
          // las consultas que dependen del ORDEN de A y que además acotan la
          // lectura (rango con extremos, o prefijo constante de LIKE). Para
          // el resto (B = c sin tocar A, ORDER BY con SELECT * no cubierto,
          // LIKE con comodín inicial) el BTREE tampoco ayuda: verificado en
          // MySQL 9.7.2 que esos casos dan igual ALL que el hash conceptual
          // (ver contraste con el motor real en las pruebas de esta
          // herramienta). Por eso el aviso de discrepancia solo aparece para
          // la consulta realmente elegida, no para las siete a la vez.
          var hashBtreeAyudaAca = state.consulta === "between_a" || state.consulta === "like_prefix";
          var consultaActual = CONSULTAS.filter(function (c) { return c.id === state.consulta; })[0];
          var consultaLabel = consultaActual ? consultaActual.label : state.consulta;
          if (!v.usaIndice && hashBtreeAyudaAca) {
            resultado.appendChild(lab.callout("info", "Vault vs. motor real: aquí discrepan",
              h("p", {}, "La tabla de arriba dice \"no sirve\" porque modela el hash ", h("strong", {}, "conceptual"), " que enseña la cátedra (slides 36-37 de Clase 11: solo igualdad, sin orden). Pero como InnoDB creó un BTREE de verdad detrás de ", codigoEnLinea("USING HASH"), ", la consulta elegida (", h("strong", {}, consultaLabel), ") ", h("strong", {}, "sí"), " funciona sobre el índice real, con ", h("em", {}, "type=range"), "."),
              h("p", {}, "Verificado en MySQL 9.7.2: con ", codigoEnLinea("CREATE INDEX … USING HASH"), " sobre InnoDB (tabla no clustered, sin cobertura), un rango con extremos y un prefijo constante de LIKE sí usan el índice — algo que un hash de verdad (por ejemplo, sobre ", codigoEnLinea("ENGINE=MEMORY"), ") no podría hacer. No pasa lo mismo con las demás consultas de este panel: ORDER BY sin cobertura y LIKE con comodín inicial dan igual ", h("em", {}, "ALL"), " en el BTREE real que en el hash conceptual.")));
          } else if (!v.usaIndice) {
            resultado.appendChild(lab.callout("info", "Aquí no hay discrepancia",
              h("p", {}, "Para \"", consultaLabel, "\" tampoco ayuda el BTREE real que InnoDB crea detrás de ", codigoEnLinea("USING HASH"), ": ni B = c sin tocar A, ni ORDER BY sin cobertura, ni LIKE con comodín inicial dan un rango sobre el índice. Verificado en MySQL 9.7.2: estos casos leen la tabla entera igual que predice el modelo conceptual de arriba.")));
          }
        }

        resultado.appendChild(lab.table({
          caption: "Páginas leídas (modelo didáctico): índice vs. recorrido completo",
          columns: [
            { key: "via", label: "Camino" },
            { key: "paginas", label: "Páginas leídas", align: "right", mono: true },
            { key: "nota", label: "Nota" },
          ],
          rows: [
            {
              via: "Por el índice (altura " + lab.fmtInt(est.altura) + ")",
              paginas: v.usaIndice ? lab.fmtInt(est.paginas) : "—",
              nota: v.usaIndice ? (state.clustered ? "hoja = fila, sin heap fetch" : (state.cobertura && v.cobertura === "total" ? "índice de cobertura: sin heap fetch" : lab.fmtInt(est.heapFetches) + " " + lab.plural(est.heapFetches, "heap fetch", "heap fetches"))) : "no aplica: no sirve para esta consulta",
            },
            { via: "Recorrido completo", paginas: lab.fmtInt(full), nota: null },
          ],
          rowClass: function (row) {
            if (!v.usaIndice) return "";
            var mejor = est.paginas <= full;
            if (row.via.indexOf("índice") === 0 && mejor) return "bdii-row-current";
            return "";
          },
        }));

        if (state.consulta !== "order_a") {
          var puntos = engine.curvaCosto(opts, 26);
          resultado.appendChild(h("div", { class: "lab-indices-plan-chartwrap" }, renderChart(puntos, cruce, full)));
          var cruceMysql = engine.costoMysql(opts).selectividadCruce;
          var croceTexto = cruce.selectividad != null
            ? "cruce en páginas leídas ≈ " + formatSelectividad(cruce.selectividad) +
              (cruceMysql != null ? " · umbral del EXPLAIN (modelo de costos de MySQL) ≈ " + formatSelectividad(cruceMysql) + " de filas estimadas" : "")
            : (cruce.siempre === "indice" ? "el índice conviene en todo el rango mostrado" : (cruce.siempre === "fullscan" ? "el recorrido completo conviene en todo el rango mostrado" : "el índice no sirve para esta consulta: coincide con el recorrido completo"));
          resultado.appendChild(h("p", { class: "lab-indices-plan-chartleg" },
            h("span", { class: "lab-indices-plan-swatch lab-indices-plan-swatch--idx" }), " índice · ",
            h("span", { class: "lab-indices-plan-swatch lab-indices-plan-swatch--full" }), " recorrido completo · ",
            croceTexto));
        } else {
          resultado.appendChild(lab.callout("info", "ORDER BY sin WHERE: no hay selectividad que ajustar",
            h("p", {}, v.usaIndice
              ? "El B+tree ya mantiene las claves ordenadas: el orden sale gratis, sin nodo Sort ni filesort."
              : "Sin índice hay que leer todo y ordenar aparte: en MySQL aparece Extra = Using filesort.")));
        }

        resultado.appendChild(lab.table({
          caption: "EXPLAIN (estilo MySQL) — lo que probablemente elegiría el motor",
          columns: [{ key: "campo", label: "Campo" }, { key: "valor", label: "Valor", mono: true }],
          rows: [
            { campo: "type", valor: explain.type },
            { campo: "possible_keys", valor: explain.possible_keys },
            { campo: "key", valor: explain.key },
            { campo: "rows", valor: lab.fmtInt(explain.rows) },
            { campo: "Extra", valor: explain.extra },
          ],
        }));

        if (explain.avisoCruce) {
          resultado.appendChild(lab.callout("warn", "El índice serviría por la regla, pero el modelo de costo dice que no conviene",
            h("p", {}, "El prefijo izquierdo dice que el índice ", h("strong", {}, "podría"), " usarse para esta consulta, pero con esta selectividad el costo estimado del índice (cada fila exige ir a la tabla) supera al del recorrido completo: por eso el EXPLAIN de arriba predice ", lab.badge("ALL", "warn"), " en vez de ref/range/index."),
            h("p", {}, "Verificado contra MySQL 9.7.2 real (100.000 filas, índice secundario sin cobertura): con 2 %, 5 %, 10 % y 15 % de las filas, type=range; desde ~29.000 filas estimadas, ALL (", h("em", {}, "possible_keys"), " sigue listando el índice, pero ", h("em", {}, "key"), " queda NULL). Si la consulta solo pide columnas del índice (cobertura), no hay ida a la tabla y MySQL mantiene el índice aun con rangos amplios.")));
        }

        if (explain.skipScan) {
          resultado.appendChild(lab.callout("info", "Con cobertura, MySQL recorre el índice en vez de la tabla",
            h("p", {}, "La regla del prefijo izquierdo sigue valiendo para el acceso clásico: sin una condición sobre A no hay por dónde entrar al árbol. Pero si la consulta solo pide columnas del índice, leer el índice (A, B) entero es más barato que leer la tabla, y MySQL lo usa como cobertura."),
            h("p", {}, "Verificado en MySQL 9.7.2: ", codigoEnLinea("SELECT a, b FROM big_ab WHERE b = 3"), " con A de 1.000 valores distintos da type=index, key=idx_ab, Extra=Using where; Using index. Si A tiene pocos valores distintos (5, en la prueba), MySQL 8.0.13+ usa ", h("strong", {}, "skip scan"), ": type=range, Extra=Using where; Using index for skip scan. Con ", codigoEnLinea("SELECT *"), " da ALL, como dice la regla.")));
        }

        resultado.appendChild(lab.callout("info", "El modelo de costo es didáctico",
          h("p", {}, "La tabla y el gráfico cuentan páginas bajo supuestos simples (altura del árbol + hojas + un heap fetch por fila, como si cada uno fuera una lectura de disco): con ese criterio el índice secundario deja de convenir con muy pocas filas. El EXPLAIN, en cambio, decide con las constantes del modelo de costos de MySQL (0,1 por fila evaluada y 0,25 por página en memoria), que ubican el cruce cerca del 29 % de las filas ",
            h("em", {}, "estimadas"), ". Atención: para rangos amplios el optimizador sobreestima las filas (en la prueba, 27.932 estimadas para 15.000 reales), así que en el motor real el cambio a ALL puede aparecer antes, desde ~15 % de filas reales."),
          h("p", {}, "MySQL usa estadísticas del catálogo (",
            codigoEnLinea("information_schema"), ", ", codigoEnLinea("ANALYZE TABLE"), ") y su propio modelo de costos: puede elegir distinto, sobre todo cerca del punto de cruce."),
          h("p", {}, "Traducción completa PostgreSQL (deck) ↔ MySQL (motor real): ", lab.pageLink("1.08.01 - Plan de ejecución", "Plan de ejecución § PostgreSQL vs. MySQL"))));
      }

      var controlesFull = [
        presetCtrl.el, nCtrl.el, filasPagCtrl.el, fanoutCtrl.el, tipoCtrl.el,
        consultaCtrl.el, selCtrl.el, clusteredCtrl.el, unicoCtrl.el, coberturaCtrl.el,
      ];
      var controlesCompact = [lab.grid(2, presetCtrl.el, consultaCtrl.el), tipoCtrl.el, selCtrl.el];

      if (!compact) {
        body.appendChild(lab.callout("info", "Esta herramienta habla en términos de MySQL, el motor de la cursada",
          h("p", {}, "El deck de la Clase 08 usa PostgreSQL (Seq Scan, Index Scan, Index Cond, Filter); aquí se muestra directamente la salida estilo MySQL (type, key, possible_keys, rows, Extra). Ver la tabla completa de equivalencias en ",
            lab.pageLink("1.08.01 - Plan de ejecución", "Plan de ejecución § PostgreSQL vs. MySQL"), ".")));
      }

      if (compact) {
        // Figura: escenario, tipo de índice, consulta y selectividad arriba; el
        // resultado abajo. El árbol B+, los parámetros físicos y los retos quedan
        // en el laboratorio completo.
        body.appendChild(lab.panel(null, controlesCompact));
        body.appendChild(lab.panel("Resultado", resultado));
      } else {
        body.appendChild(lab.grid(2, lab.panel("Parámetros", controlesFull), lab.panel("Resultado", resultado)));
      }

      actualizarSelectividadDisabled();
      sincronizarClusteredUnico();
      render();

      if (!compact) {
        body.appendChild(buildPanel2());
        body.appendChild(buildRetos());
      }

      function buildPanel2() {
        var treeState = { orden: PRESETS_ARBOL[0].orden, claves: PRESETS_ARBOL[0].claves.slice() };
        var clavesTexto = treeState.claves.join(", ");

        var stepperHolder = h("div");
        var stepperCtrl = null;
        var buscarArbolHost = h("div", { class: "lab-indices-plan-treewrap" });
        var searchHost = h("div", { "aria-live": "polite" });
        var rangeHost = h("div", { "aria-live": "polite" });

        var ordenCtrl = lab.segmented({
          label: "Orden m", value: treeState.orden,
          options: [3, 4, 5, 6].map(function (m) { return { value: m, label: String(m) }; }),
          onChange: function (v) { treeState.orden = v; construir(); },
        });
        var clavesCtrl = lab.text({
          label: "Claves a insertar (separadas por coma, en orden)", value: clavesTexto, mono: true,
          onChange: function (v) { clavesTexto = v; },
        });
        var presetArbolCtrl = lab.presetPicker({
          label: "Escenario de partida", presets: PRESETS_ARBOL,
          value: 0, // treeState comienza con PRESETS_ARBOL[0]
          onPick: function (p) {
            treeState.orden = p.orden; ordenCtrl.set(p.orden);
            clavesCtrl.set(p.claves.join(", ")); clavesTexto = clavesCtrl.get();
            construir();
          },
        });
        var construirBtn = lab.button({ label: "Construir árbol", kind: "primary", onClick: construir });

        function parseClaves(text) {
          return String(text).split(",")
            .map(function (s) { return parseInt(s.trim(), 10); })
            .filter(function (n) { return !isNaN(n); });
        }

        function arbolFinal() { return treeState.pasos && treeState.pasos.length ? treeState.pasos[treeState.pasos.length - 1].tree : null; }

        function dibujarFinal(opciones) {
          buscarArbolHost.replaceChildren();
          var tree = arbolFinal();
          if (!tree) return;
          buscarArbolHost.appendChild(renderArbolSVG(engine.bplus.aplanar(tree), opciones || {}));
        }

        function construir() {
          var claves = parseClaves(clavesTexto);
          treeState.claves = claves;
          treeState.pasos = engine.bplus.construirPasos(treeState.orden, claves);
          if (stepperCtrl) stepperCtrl.destroy();
          stepperHolder.replaceChildren();
          searchHost.replaceChildren();
          rangeHost.replaceChildren();

          if (!treeState.pasos.length) {
            stepperHolder.appendChild(lab.callout("warn", "No hay claves válidas", h("p", {}, "Escriba números separados por coma.")));
            buscarArbolHost.replaceChildren();
            return;
          }

          stepperCtrl = lab.stepper({
            count: treeState.pasos.length, label: "Inserción",
            render: function (i) {
              var paso = treeState.pasos[i];
              var flat = engine.bplus.aplanar(paso.tree);
              var nota = paso.duplicate
                ? h("p", {}, "La clave ", h("strong", {}, String(paso.key)), " ya estaba: no se repite.")
                : h("p", {}, "Se insertó ", h("strong", {}, String(paso.key)),
                    paso.splitIds.length
                      ? ", con " + lab.fmtInt(paso.splitIds.length) + " " + lab.plural(paso.splitIds.length, "división", "divisiones") + " de nodo (resaltada en el árbol)."
                      : ", sin dividir ningún nodo.");
              return h("div", {}, h("div", { class: "lab-indices-plan-treewrap" }, renderArbolSVG(flat, { splitIds: paso.splitIds })), nota);
            },
          });
          stepperHolder.appendChild(stepperCtrl.el);
          dibujarFinal();
        }

        var buscarCtrl = lab.number({ label: "Buscar clave", value: treeState.claves[0] });
        var buscarBtn = lab.button({
          label: "Buscar", onClick: function () {
            var tree = arbolFinal();
            if (!tree) return;
            var key = buscarCtrl.get();
            var res = engine.bplus.caminoBusqueda(tree, key);
            dibujarFinal({ pathIds: res.path, foundKey: res.found ? key : null });
            searchHost.replaceChildren();
            searchHost.appendChild(lab.callout(res.found ? "ok" : "bad", res.found ? "Clave encontrada" : "Clave no está en el árbol",
              h("p", {}, "Camino: " + res.path.join(" → ") + " (" + lab.fmtInt(res.path.length) + " " + lab.plural(res.path.length, "nivel") + " recorridos, hoja incluida)")));
          },
        });

        var rangoDesdeCtrl = lab.number({ label: "Desde", value: treeState.claves[0] });
        var rangoHastaCtrl = lab.number({ label: "Hasta", value: treeState.claves[treeState.claves.length - 1] });
        var rangoBtn = lab.button({
          label: "Recorrer rango", onClick: function () {
            var tree = arbolFinal();
            if (!tree) return;
            var lo = rangoDesdeCtrl.get(), hi = rangoHastaCtrl.get();
            var res = engine.bplus.recorridoRango(tree, lo, hi);
            dibujarFinal({ rangeLeafIds: res.leaves });
            rangeHost.replaceChildren();
            rangeHost.appendChild(lab.callout("ok", lab.fmtInt(res.keys.length) + " " + lab.plural(res.keys.length, "clave") + " en [" + lo + ", " + hi + "]",
              h("p", {}, res.keys.length ? res.keys.join(", ") : "ninguna"),
              h("p", {}, "Se recorrieron " + lab.fmtInt(res.leaves.length) + " " + lab.plural(res.leaves.length, "hoja", "hojas") + " por el encadenamiento de hojas.")));
          },
        });

        construir();
        cleanupFns.push(function () { if (stepperCtrl) stepperCtrl.destroy(); });

        return lab.panel(
          "Árbol B+ en miniatura",
          h("p", { class: "bdii-lab-subtitle" }, "Se inserta una clave por vez; cuando un nodo se llena, se divide (el nodo dividido queda resaltado en el árbol). Orden m = cantidad máxima de hijos por nodo."),
          lab.grid(3, ordenCtrl.el, clavesCtrl.el, presetArbolCtrl.el),
          construirBtn.el,
          stepperHolder,
          h("h4", {}, "Buscar una clave"),
          lab.grid(2, buscarCtrl.el, buscarBtn.el),
          searchHost,
          h("h4", {}, "Recorrer un rango por las hojas"),
          lab.grid(3, rangoDesdeCtrl.el, rangoHastaCtrl.el, rangoBtn.el),
          rangeHost,
          buscarArbolHost,
        );
      }

      function buildRetos() {
        var items = [
          {
            enunciado: "Configure arriba un B+tree compuesto (A, B) y la consulta 'B = c (sin A)'. ¿El motor puede usar el índice para esa condición?",
            origen: "1.08.02 - Índices § 3 (experimento de graduados filtrando solo por nombre)",
            check: function () {
              if (state.tipoIndice !== "btree_ab" || state.consulta !== "eq_b") {
                return { ok: null, mensaje: "Elija 'B+tree compuesto (A, B)' como tipo de índice y 'B = c (sin A)' como consulta, arriba." };
              }
              var v = engine.sirveIndice(state.tipoIndice, state.consulta);
              return { ok: !v.usaIndice, mensaje: !v.usaIndice
                ? "Correcto: sin una condición sobre A (el prefijo del compuesto), el índice no acota nada para el acceso clásico. Es la regla del prefijo izquierdo. (Si la consulta solo pide columnas del índice, MySQL igual puede recorrerlo entero o usar skip scan: vea la nota del resultado.)"
                : "Revise la regla del prefijo izquierdo: el compuesto (A, B) no debería servir para B sola." };
            },
          },
          {
            enunciado: "Configure 'Hash sobre A' y la consulta 'A BETWEEN c1 AND c2'. ¿Sirve un índice hash para un rango?",
            origen: "1.08.02 - Índices § Slide 37 (MySQL Reference Manual § 10.3.9)",
            check: function () {
              if (state.tipoIndice !== "hash_a" || state.consulta !== "between_a") {
                return { ok: null, mensaje: "Elija 'Hash sobre A' como tipo de índice y 'A BETWEEN c1 AND c2' como consulta, arriba." };
              }
              var v = engine.sirveIndice(state.tipoIndice, state.consulta);
              return { ok: !v.usaIndice, mensaje: !v.usaIndice
                ? "Correcto: el hash solo resuelve igualdad con la clave completa; no tiene orden, así que no sirve para un rango."
                : "Revise: el hash no debería servir para BETWEEN." };
            },
          },
          {
            enunciado: "Elija 'Hash sobre A' como tipo de índice (cualquier consulta) y lea la nota de InnoDB. Según lo verificado en el motor real, ¿qué índice queda creado de verdad?",
            origen: "Final 1Jul2025, pregunta 1 — verificado con SHOW INDEX en MySQL 9.7.2",
            check: function () {
              if (state.tipoIndice !== "hash_a") {
                return { ok: null, mensaje: "Elija 'Hash sobre A' como tipo de índice, arriba, y vea la nota que aparece en el resultado." };
              }
              return { ok: true, mensaje: "InnoDB acepta USING HASH sin error, pero el índice que queda es BTREE (columna Index_type de SHOW INDEX). Un hash de verdad solo existe con ENGINE=MEMORY." };
            },
          },
        ];

        var nodos = items.map(function (item, idx) {
          var out = h("div", { "aria-live": "polite" });
          var btn = lab.button({
            label: "Comprobar", onClick: function () {
              var res = item.check();
              out.replaceChildren();
              out.appendChild(lab.callout(
                res.ok == null ? "info" : (res.ok ? "ok" : "bad"),
                res.ok == null ? "Falta configurar el escenario" : (res.ok ? "Correcto" : "Todavía no"),
                h("p", {}, res.mensaje)));
            },
          });
          return h("div", { class: "lab-indices-plan-reto" },
            h("p", {}, h("strong", {}, "Reto " + (idx + 1) + ". "), item.enunciado),
            h("p", { class: "bdii-lab-sources" }, "Origen: " + item.origen),
            btn.el, out);
        });

        return lab.panel.apply(null, ["Retos"].concat(nodos));
      }

      return function cleanup() {
        cleanupFns.forEach(function (fn) { fn(); });
      };
    },
  );
})();
