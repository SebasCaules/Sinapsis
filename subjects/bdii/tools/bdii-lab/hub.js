/* Portada del laboratorio: una sola entrada en el rail que reúne las nueve
   herramientas del bundle, agrupadas como la cursada (relacional / NoSQL). */
(function () {
  "use strict";
  var App = window.App;
  var lab = App && App.bdiiLab;
  if (!lab || typeof lab.tool !== "function") return;
  var h = lab.h;

  var GRUPOS = [
    {
      titulo: "Relacional — MySQL (Unidad 1)",
      items: [
        { id: "check-option", nombre: "Vistas y WITH CHECK OPTION",
          que: "Apile hasta tres vistas, elija LOCAL o CASCADED y vea qué predicados se chequean al insertar o actualizar, y dónde queda visible la fila.",
          pagina: "1.06.01 - Vistas", etiqueta: "Vistas" },
        { id: "acciones-referenciales", nombre: "Integridad referencial: acciones y MATCH",
          que: "Borre o actualice filas con RESTRICT, NO ACTION, CASCADE, SET NULL o SET DEFAULT y siga la cascada paso a paso; FK compuestas con NULL y MATCH.",
          pagina: "1.09.02 - Integridad referencial y acciones referenciales", etiqueta: "Integridad referencial" },
        { id: "indices-plan", nombre: "Índices y plan de ejecución",
          que: "Cambie filas, selectividad y tipo de índice y vea cuándo conviene el índice, qué dice un EXPLAIN y cómo crece un árbol B+.",
          pagina: "1.08.02 - Índices", etiqueta: "Índices" },
        { id: "aislamiento", nombre: "Transacciones concurrentes y niveles de aislamiento",
          que: "Dos transacciones en una línea de tiempo: dirty read, non-repeatable read, phantom y lost update en cada nivel, según el estándar y según InnoDB.",
          pagina: "1.11.04 - Control de concurrencia y niveles de aislamiento", etiqueta: "Aislamiento" },
        { id: "grant-revoke", nombre: "GRANT, REVOKE y el grafo de privilegios",
          que: "Otorgue y revoque privilegios con y sin GRANT OPTION y compare el grafo del estándar (CASCADE/RESTRICT) con lo que hace MySQL.",
          pagina: "1.11.02 - Usuarios, privilegios y roles", etiqueta: "Privilegios" },
        { id: "recovery-wal", nombre: "Recovery: write-ahead logging y ARIES",
          que: "Elija un escenario de log, hasta dónde llega el fsync y el punto del crash, y recorra análisis, redo y undo; InnoDB frente a PostgreSQL.",
          pagina: "1.11.06 - ARIES — análisis, redo y undo", etiqueta: "ARIES" },
      ],
    },
    {
      titulo: "NoSQL — MongoDB y distribución (Unidad 2)",
      items: [
        { id: "cap-quorum", nombre: "Réplicas, particiones y quórums",
          que: "Mueva N, W y R, parta la red y vea cuándo una lectura es fresca, qué se rechaza y qué se reconcilia: CAP y consistencia eventual.",
          pagina: "2.12.04 - Teorema CAP", etiqueta: "Teorema CAP" },
        { id: "sharding", nombre: "Sharding y replica sets en MongoDB",
          que: "Elija la shard key y la estrategia, reparta documentos entre shards y provoque un failover con distintos write concerns.",
          pagina: "2.12.02 - Escalabilidad horizontal — sharding y replicación", etiqueta: "Sharding y replicación" },
        { id: "aggregation", nombre: "Aggregation pipeline paso a paso",
          que: "Arme un pipeline sobre egresados, bandas, ciudades o el ecommerce y vea la salida de cada etapa, contrastada con MongoDB real.",
          pagina: "2.12.08 - Aggregation pipeline", etiqueta: "Aggregation pipeline" },
      ],
    },
  ];

  lab.tool(
    {
      id: "laboratorio",
      title: "Laboratorio de Base de Datos II",
      subtitle: "Nueve herramientas para entender jugando con datos y parámetros. Cada una trae escenarios de TPs y de exámenes viejos, y las mismas figuras aparecen dentro de las páginas del wiki.",
      sources: [{ stem: "Mapa de exámenes", label: "Mapa de exámenes" }],
    },
    function mount(body) {
      GRUPOS.forEach(function (g) {
        var tarjetas = g.items.map(function (it) {
          return lab.panel(
            null,
            h("h3", { class: "lab-hub-nombre" }, lab.toolLink(it.id, it.nombre)),
            h("p", { class: "lab-hub-que" }, it.que),
            h("p", { class: "lab-hub-pagina" }, "En el wiki: ", lab.pageLink(it.pagina, it.etiqueta))
          );
        });
        body.appendChild(h("section", { class: "lab-hub-grupo" },
          h("h2", null, g.titulo),
          lab.grid.apply(null, [2].concat(tarjetas))));
      });
    }
  );
})();
