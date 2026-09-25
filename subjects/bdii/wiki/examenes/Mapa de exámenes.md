---
tipo: examen
unidad: eval
instancia: repaso
tema:
  - Mapa de los 14 exámenes viejos del vault
  - Formato del parcial 2026 (comparado con los domiciliarios 2020-2021)
  - Frecuencia de temas y preguntas que se repiten entre exámenes
  - Trampas recurrentes de examen
  - Priorización de estudio para el parcial del 13/10/2026
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Parciales Viejos.pdf"
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Parcial 2Q2025.docx"
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Finales Viejos.docx"
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Final 1Dic2025.docx"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Copia de BDII - Finales Viejos.docx"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Repaso Final BD 2.docx"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Parciales viejos/Parcial_BDII_2Q2025_reconstruido(1).pdf"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Parciales viejos/Parcial_BDII_2Q2025_reconstruido.pdf"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Parciales viejos/parcial.pdf"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Parciales viejos/parcial(1).pdf"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/1Q2020 - RESUELTO (no chequeado).pdf"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/1Q2020 - RESUELTO (no chequeado).docx"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2020 - Resuelto (10 puntos).pdf"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2020 - Resuelto (10 puntos).docx"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2020 - Resuelto (10 puntos)(1).docx"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/Recuperatorio 2Q2020.pdf"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/1Q2021.pdf"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/1Q2021.docx"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2021.pdf"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2021 - Datasets.pdf"
estado: procesado
resumen: "Síntesis de los 14 exámenes viejos del vault: formato de cada uno, temas que se repiten y con qué frecuencia, preguntas casi textuales entre exámenes, trampas recurrentes y una priorización de estudio para el parcial del 13/10/2026."
aliases:
  - Mapa de exámenes
  - Mapa examenes
  - Qué estudiar para el parcial
  - Guía de exámenes viejos
---

# Mapa de exámenes — síntesis de los 14 exámenes viejos

## Resumen general

Esta página cruza los 14 exámenes viejos que el vault tiene procesados en `wiki/examenes/` para
responder una sola pregunta: qué conviene estudiar para el parcial del 13/10/2026 y con qué prioridad.
Se dividen en dos grupos por su temario. Ocho son del **temario actual** —[[Parcial 2Q2025]],
[[Parcial XC-202X|Parcial XC-202X]], [[Parcial 2Q-2023|Parcial 2Q-2023]], [[Final 1Jul2025]],
[[Final 1Dic2023]], [[Final 1Dic2025]], [[Repaso Final BD 2]] y
[[Práctica subida por la cátedra|Práctica subida por la cátedra]]— y evalúan SQL avanzado sobre un
motor relacional, CAP y persistencia políglota, MongoDB y, en menor medida, Cassandra, Neo4j, Redis y
DynamoDB. Seis son del **temario anterior** —[[Parcial 1Q2020]], [[Parcial 2Q2020]],
[[Recuperatorio 2Q2020]], [[Parcial 1Q2021]], [[Parcial 2Q2021]] y
[[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]], este último de otra materia— y evalúan
motores NoSQL que la cursada 2026 no dicta (CouchDB, ElasticSearch, HBase, PostGIS).

El formato cambió: los parciales de 2020-2021 eran domiciliarios de varias horas, con seis a diez
ejercicios de correr comandos; el 2Q2025 fue una plataforma online con 33 preguntas cerradas y de
ensayo; el XC-202X y el 2Q-2023, exámenes impresos de unos diez ejercicios de desarrollo. Los tres
comparten ejercicios casi textuales (la cadena de vistas `MovimientoUSDT`, el esquema
`Carrera`/`Materia`, la vista `ConstructorVIP`), así que reconocer las trampas conceptuales importa más
que memorizar comandos: `LOCAL` vs. `CASCADED`, la PK compuesta que decide un `UPDATE`, el `NULL` en
un `NOT IN`, `EXPLAIN` vs. `EXPLAIN ANALYZE`, la clasificación CAP por motor. Por cantidad de preguntas
del temario actual lideran Redis, Cassandra, CAP y Vistas, seguidos de SQL — consultas y Neo4j; Redis
y Neo4j se dictan después del 13/10 según [[_cronograma]], y Cassandra antes (28/09 y 05/10). La
sección *Qué estudiar* cruza esa frecuencia con el cronograma.

## Qué exámenes hay

| Página | Instancia | Año/cuatrimestre | Formato | Temario | Confiabilidad de las respuestas |
| --- | --- | --- | --- | --- | --- |
| [[Parcial 2Q2025]] | parcial | 2025 2C | 33 preguntas (OM simple/varias correctas, V/F, coincidencia, ensayo) en plataforma online autocalificada | actual | **Alta** — 3 fuentes cruzadas (solucionario, capturas del examen real corregido, corridas propias en MySQL 9.7.2/MongoDB 8.3.11), más el cotejo con [[Parcial XC-202X\|XC-202X]] y [[Parcial 2Q-2023\|2Q-2023]] |
| [[Parcial XC-202X\|Parcial XC-202X]] | parcial | fecha desconocida (rótulo del estudiante: "XC-202X") | 10 ejercicios impresos, 100 puntos: 9 de desarrollo y 1 de opción múltiple | actual | Media — respuestas manuscritas de un estudiante, sin corrección; SQL corrido en MySQL 9.7.2 y MongoDB en 8.3.11: se equivoca en el `UPDATE` del Ej. 2 y en la justificación del Ej. 1e, y deja Redis sin resolver |
| [[Parcial 2Q-2023\|Parcial 2Q-2023]] | parcial | 2023 2C (rótulo "2Q-2023"), sin fecha exacta | 10 ejercicios impresos, sin puntaje: consultas a desarrollar, opción múltiple, completar huecos, ensayo, V/F | actual | Media — resolución manuscrita de un estudiante (8 de 10 ejercicios), corrida en MySQL 9.7.2; cuatro salvedades, la mayor el `UPDATE` del Ej. 8.2 |
| [[Final 1Jul2025]] | final | rótulo de la fuente, sin fecha exacta | 6 preguntas de desarrollo/opción múltiple, sin corrección oficial visible | actual | Media — 2 copias de estudiante, discrepan en 1 de 6 preguntas (motor a elegir para escritura masiva) |
| [[Final 1Dic2023]] | final | rótulo de la fuente, sin fecha exacta | 5 preguntas V/F y opción múltiple | actual | Media — 2 copias con cobertura despareja (la larga solo responde 2 de las 5 preguntas, la corta las 5); una de las respuestas (vistas materializadas) generó un hallazgo nuevo del vault |
| [[Final 1Dic2025]] | final | rótulo de la fuente, sin fecha exacta | 5 preguntas; la fuente se abre aclarando que es reconstruido "de memoria" | actual | Media-baja — una copia sin ninguna respuesta, la otra con desarrollo parcial y remisiones a otro final |
| [[Repaso Final BD 2]] | repaso | sin fecha (guía de estudiantes) | 32 ejercicios: prácticos de consola (Redis, DynamoDB), desarrollo y V/F; transcribe además los tres finales de arriba | actual | Dispar — SQL y concurrencia corridas y correctas; Redis/DynamoDB no verificables sin esos motores; algunas resoluciones con errores propios señalados `(atención)` |
| [[Práctica subida por la cátedra\|Práctica subida por la cátedra]] | repaso | sin fecha | 9 ejercicios de desarrollo tipo parcial; el rótulo "subida por la cátedra" es del estudiante | actual | Media-baja — resolución manuscrita sin corregir; cuatro respuestas fallan al correrlas en MySQL 9.7.2 y MongoDB 8.3.11 |
| [[Parcial 1Q2020]] | parcial | 1Q2020, sin fecha exacta | 6 ejercicios prácticos domiciliarios (un motor por ejercicio), sin límite de tiempo documentado | anterior | Baja — resuelto por un estudiante que rotuló su propia resolución "no chequeado" (no revisó su trabajo antes de subirlo); nadie de la cátedra la revisó |
| [[Parcial 2Q2020]] | parcial | 2Q2020, 13/10/2020 | 6 ejercicios prácticos domiciliarios, 3.5 h | anterior | Media — rotulado "10 puntos" por quien lo archivó, sin corrección docente visible |
| [[Recuperatorio 2Q2020]] | recuperatorio | 2Q2020, 03/11/2020 | 4 ejercicios prácticos domiciliarios, 3 h | anterior | — (solo enunciado; no hay ninguna resolución de estudiante, toda respuesta es del vault) |
| [[Parcial 1Q2021]] | parcial | 1Q2021, 18/05/2021 | 10 ejercicios prácticos domiciliarios, 6 h 30, aprueba con 5/10 | anterior | — (sin solucionario; el vault resuelve sobre datos de juguete donde el motor lo permite) |
| [[Parcial 2Q2021]] | parcial | 2Q2021, 26/10/2021 | 10 ejercicios prácticos domiciliarios, 6 h, aprueba con 5/10 | anterior | — (sin solucionario; ídem) |
| [[Parcial 23-5-23 - Bases de Datos Avanzadas]] | parcial (otra materia) | 23/05/2023 | 32 preguntas OM/V-F/completar, con solucionario propio, aprueba con 16/32 | anterior | Alta para lo vigente (trae solucionario), pero **no es un examen de 72.41** — otra materia con temario NoSQL solapado |

## Formato del parcial

El indicio de formato más reciente con fecha es el [[Parcial 2Q2025]] (preguntas cerradas en
plataforma), pero el [[Parcial XC-202X|Parcial XC-202X]] y el [[Parcial 2Q-2023|Parcial 2Q-2023]]
muestran exámenes impresos de desarrollo con los mismos ejercicios: ningún examen de otro año fija el
formato de 2026. Lo que sí queda descartado es el domiciliario largo de 2020-2021. El [[Parcial 23-5-23 - Bases de Datos Avanzadas]] (de otra materia) aporta solo un dato
comparable, la cantidad y el tipo de preguntas: su propia página no documenta duración ni modalidad de
toma, así que no puede usarse para confirmar que compartió la misma plataforma online, crédito parcial
o preguntas de desarrollo del 2Q2025.

- **Cantidad y tipo de preguntas:** el 2Q2025 trae 33; el de Bases de Datos Avanzadas, 32. El 2Q2025
  mezcla opción múltiple simple, opción múltiple de varias correctas (con **crédito parcial y
  penalización negativa** declarados explícitamente en el enunciado de esas preguntas), verdadero/
  falso, coincidencia/completar y una porción de preguntas de desarrollo o ensayo corregidas a mano; el
  de Bases de Datos Avanzadas mezcla opción múltiple simple y de varias correctas, verdadero/falso y
  completar, sin preguntas de desarrollo o ensayo, y su solucionario no aclara si las de "varias
  correctas" llevan crédito parcial o penalización (solo dice, para una pregunta puntual, que "marcar
  solo una de las dos resta puntos", sin dar la regla general).
- **Condición de aprobación:** el 2Q2025 no la documenta en ninguna de sus cuatro fuentes; el de
  Bases de Datos Avanzadas exige 16 de 32 (50 %) — cifra de otra materia, útil solo como referencia de
  orden de magnitud, no como dato confirmado para BDII 2026.
- **Autocalificación:** en el 2Q2025, opción múltiple, V/F y coincidencia se corrigen automáticamente
  (las capturas muestran el puntaje de cada pregunta al instante); las de desarrollo/ensayo se corrigen
  a mano y las capturas nunca muestran el texto que escribió el alumno, solo el puntaje final. El de
  Bases de Datos Avanzadas no documenta su mecanismo de corrección.
- **Otro formato del mismo temario: impreso y de desarrollo.** El [[Parcial XC-202X|Parcial XC-202X]]
  (sin fecha) y el [[Parcial 2Q-2023|Parcial 2Q-2023]] son exámenes en papel de diez ejercicios; el
  XC-202X suma 100 puntos con el puntaje impreso en cada ejercicio (el más alto, 15, para el
  `aggregate`) y es casi el mismo examen que el 2Q2025 con respuestas a desarrollar. Ninguno de los dos
  documenta duración ni condición de aprobación.
- **Qué no hay:** a diferencia de 2020-2021, **no hay prácticos largos multi-motor para resolver en
  casa con capturas de pantalla**. Los parciales domiciliarios de esa época ([[Parcial 1Q2020]],
  [[Parcial 2Q2020]], [[Parcial 1Q2021]], [[Parcial 2Q2021]]) pedían seis a diez ejercicios, cada uno
  sobre un motor NoSQL distinto (CouchDB, ElasticSearch, Redis, Neo4j, PostGIS), con entrega de
  capturas de comandos reales; el plazo documentado va de 3.5 a 6.5 horas en tres de los cuatro (el
  1Q2020 no trae duración fija, solo los horarios de inicio y fin del estudiante que lo resolvió) y la
  entrega fue por GoogleDoc exportado a PDF en dos de ellos y por mail en el 2Q2021. Ese formato no
  aparece en ningún examen del temario actual. Según [[_cronograma]], el
  parcial 2026 es presencial; si sigue al 2Q2025, serían preguntas cerradas con un tercio de ensayo
  (11 de 33); si sigue al XC-202X o al 2Q-2023, unos diez ejercicios de desarrollo en papel. En ningún
  caso un práctico domiciliario extenso.

## Temas por frecuencia

Conteo hecho sobre las 194 filas de las tablas *Mapa de temas* de los 14 exámenes (una fila por
pregunta), agrupando por tema; una pregunta puede tocar más de un motor y entonces cuenta en más de un
bucket, y una pregunta sobre un motor según CAP cuenta en el del motor y en el de CAP. Las copias de
los tres finales que trae el [[Repaso Final BD 2]] (Ejercicios 21–32) se cuentan como filas propias,
igual que en la tabla de esa página. "Temario actual" son las preguntas de [[Parcial 2Q2025]],
[[Parcial XC-202X|Parcial XC-202X]], [[Parcial 2Q-2023|Parcial 2Q-2023]], [[Final 1Jul2025]],
[[Final 1Dic2023]], [[Final 1Dic2025]], [[Repaso Final BD 2]] y
[[Práctica subida por la cátedra|Práctica subida por la cátedra]]; "temario anterior", las de los
cinco exámenes de 2020-2021 y el de *Bases de Datos Avanzadas*. La fila de Vistas cuenta solo vistas SQL
(`CREATE VIEW`/`CREATE MATERIALIZED VIEW`, actualizabilidad, `WITH CHECK OPTION`): las vistas
map/reduce de CouchDB de los exámenes 2020-2021 van en la fila de CouchDB, no en esta, aunque
compartan la palabra "vista" con el enunciado.

| Tema | Preguntas (temario actual) | Preguntas (temario anterior) | Concepto(s) del vault | Clase/TP 2026 |
| --- | --- | --- | --- | --- |
| Redis | 17 | 7 | — (sin página de motor propia) | no dictado aún (26–27/10, después del parcial) |
| Cassandra | 14 | 0 | — (sin página de motor propia) | Clase 28/09 y 05/10 — **entra antes del parcial** |
| Teorema CAP | 11 | 5 | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 |
| Vistas (incl. materializadas, solo SQL) | 11 | 2 | [[1.06.01 - Vistas\|Vistas]] | Clase 06–07 |
| SQL — consultas / DDL / búsqueda fonética | 10 | 4 | [[1.05.01 - SQL — consultas\|SQL — consultas]] · [[1.03.02 - DDL — creación y alteración de tablas\|DDL]] | Clase 05 |
| Neo4j | 10 | 10 | — (sin página de motor propia) | no dictado aún (19–20/10) |
| DynamoDB | 7 | 8 | — (sin página de motor propia) | no dictado aún (02/11) |
| Integridad referencial y acciones referenciales | 7 | 0 | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 |
| MongoDB (CRUD, aggregation, índices, MapReduce, embebido) | 7 | 14 | [[2.12.07 - CRUD y consultas en MongoDB\|CRUD MongoDB]] · [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] · [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] · [[2.14.03 - MapReduce\|MapReduce]] · [[2.13.01 - Documentos embebidos vs. referencias\|Documentos embebidos]] | Clase 12–14 |
| Plan de ejecución / índices | 6 | 1 | [[1.08.01 - Plan de ejecución\|Plan de ejecución]] · [[1.08.02 - Índices\|Índices]] | Clase 08 |
| Elección de motor (CAP + escalabilidad + patrón de acceso) | 4 | 1 | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] · [[2.12.03 - Persistencia políglota\|Persistencia políglota]] | Clase 12 |
| Transacciones y control de concurrencia | 4 | 0 | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | Clase 11 |
| `CHECK`, `ASSERTION` y triggers | 3 | 0 | [[1.09.03 - CHECK, DOMAIN y ASSERTION\|CHECK, DOMAIN y ASSERTION]] · [[1.09.04 - Triggers\|Triggers]] | Clase 09/10 |
| Privilegios (`GRANT`/`REVOKE`) | 3 | 0 | [[1.11.02 - Usuarios, privilegios y roles\|Usuarios, privilegios y roles]] | Clase 11 |
| Persistencia políglota / escalabilidad horizontal (fuera de "elección de motor") | 3 | 1 | [[2.12.03 - Persistencia políglota\|Persistencia políglota]] · [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | Clase 12 |
| HBase | 3 | 5 | — | fuera del temario 2026 |
| Taxonomía NoSQL | 2 | 0 | [[2.12.01 - NoSQL — origen, propiedades y taxonomía\|Taxonomía NoSQL]] | Clase 12 |
| Modelo relacional / SGBD / modelo conceptual | 1 | 1 | [[1.01.01 - Sistema gestor de bases de datos\|Sistema gestor de bases de datos]] · [[1.02.02 - Modelo Entidad-Relación\|Modelo Entidad-Relación]] · [[1.03.01 - Derivación de MER a esquema relacional\|Derivación de MER]] | Clase 01–03 |
| ElasticSearch | 0 | 6 | — | fuera del temario 2026 |
| PostGIS / geoespacial | 0 | 5 | [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] cubre el equivalente en MongoDB | PostGIS fuera del temario 2026; el equivalente en MongoDB, Clase 14 |
| CouchDB | 0 | 10 | — | fuera del temario 2026 |
| Data warehousing (esquemas multidimensionales) | 0 | 2 | — | fuera del temario 2026 |

## Preguntas que se repiten

Preguntas que aparecen, casi textuales, en más de un examen (mismo enunciado o misma metáfora, con
variaciones menores de nombres o cifras):

- **CAP — "todos los nodos aceptan lecturas y escrituras" → AP.** [[Parcial 2Q2025]] pregunta 3
  y [[Parcial 23-5-23 - Bases de Datos Avanzadas]] pregunta 1 usan **el mismo enunciado**
  ("Suponga que tiene una base de datos distribuida en varios nodos y todos los nodos aceptan
  lecturas y escrituras"), de dos materias distintas. Respuesta en ambas: **B) AP** — se prioriza
  disponibilidad y tolerancia a particiones, sacrificando consistencia inmediata.
- **CAP — el náufrago.** [[Final 1Jul2025]] pregunta 5, [[Final 1Dic2023]] pregunta 1,
  [[Final 1Dic2025]] pregunta 1 y [[Repaso Final BD 2]] Ejercicio 25 (copia del Final 1Jul2025) son la
  misma metáfora (un náufrago aislado que recibe noticias atrasadas del mundo), con los mismos cinco
  incisos V/F. Respondida en Final 1Jul2025, Final 1Dic2023 (versión corta) y el Repaso; en
  Final 1Dic2025 la fuente no responde. Respuesta: A verdadero
  (aislado = particionado), B falso (responder con un dato de hace años no es "consistente"),
  C verdadero (puede responder aunque el dato esté viejo = disponible), D verdadero mientras sigan
  llegando actualizaciones (consistencia eventual, no una actualización única), E verdadero (sigue
  disponible). La metáfora sale de *Seven Databases* 2ª ed. apéndice A2, *A CAP Adventure* (impresas
  316–317), como documenta [[Final 1Jul2025]] § Pregunta 5.
- **Redis Sentinel.** [[Final 1Jul2025]] pregunta 6 y [[Final 1Dic2023]] pregunta 5 son el mismo
  enunciado de tres incisos V/F, copiado en [[Repaso Final BD 2]] Ejercicio 26 (el Ejercicio 9 del
  Repaso pide leer sobre Sentinel, sin los incisos). Respuesta en ambas: A y B verdaderas (Sentinel es *configuration
  provider* y monitorea masters/réplicas), C falsa — el failover es automático y por consenso de
  quórum entre instancias de Sentinel, nunca lo dispara un administrador humano.
- **Persistencia políglota vs. programación políglota.** [[Parcial 2Q2025]] pregunta 5 y
  [[Parcial 23-5-23 - Bases de Datos Avanzadas]] pregunta 3 son el mismo ejercicio de emparejar
  definición con término. Respuesta en ambas: usar distintos motores según la necesidad de cada parte
  de una aplicación = persistencia políglota; codificar en distintos lenguajes = programación
  políglota (la trampa es confundir ambos términos).
- **Por qué Neo4j no la usan las grandes redes sociales.** [[Final 1Jul2025]] pregunta 3 e
  [[Final 1Dic2025]] pregunta 4 (copiadas en [[Repaso Final BD 2]] Ejercicios 23 y 31) preguntan lo mismo (cambian solo los nombres de las redes citadas:
  X/LinkedIn/Instagram/Facebook vs. Instagram/Twitter). Respuesta: Neo4j HA no fragmenta subgrafos
  (*Seven Databases* 2ª ed. cap. 6), así que el grafo completo tiene que copiarse entero a cada réplica
  — no escala horizontalmente para el volumen de esas plataformas.
- **Motor de escritura masiva y distribuida (videojuego / sensores IoT) → Cassandra.**
  [[Final 1Jul2025]] pregunta 4 (10⁹ escrituras/seg de un videojuego) e [[Final 1Dic2025]] pregunta 5
  (2.000 datos/seg por sensor de una flota logística), copiadas en [[Repaso Final BD 2]] Ejercicios 24
  y 32, son el mismo patrón de pregunta con distinto disfraz. Respuesta consistente en el vault: **Cassandra** — AP por diseño, *auto-sharding* real,
  almacenamiento optimizado para escritura (SSTables + *compaction*, según la documentación oficial de
  Apache Cassandra: Corbellini no nombra la compactación) — no Redis ni DynamoDB.
- **Índice por defecto de MongoDB.** [[Parcial 2Q2025]] pregunta 9 y
  [[Parcial 23-5-23 - Bases de Datos Avanzadas]] pregunta 32 preguntan lo mismo casi palabra por
  palabra (tipo de índice, si hay uno por defecto, sobre qué campo). Respuesta en ambas: **B-Tree, sí,
  sobre `_id`**, verificado con `getIndexes()` en MongoDB 8.3.11.
- **Vistas materializadas — ¿mejoran la performance?** [[Parcial 2Q2025]] pregunta 11 (MySQL),
  [[Final 1Dic2023]] pregunta 3 (PostgreSQL, 4 incisos, copiada en [[Repaso Final BD 2]] Ejercicio 28)
  y [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]] pregunta 29 (PostgreSQL) hacen la misma pregunta de teoría general con distintos
  motores de fondo. Respuesta consistente: sí mejoran la performance porque persisten el resultado en
  disco — pero **MySQL no las implementa como objeto funcional** (acepta la sintaxis `CREATE
  MATERIALIZED VIEW` pero recalcula en cada `SELECT`, verificado en MySQL 9.7.2), así que la pregunta
  es de teoría de SQL estándar: en el motor de esta cursada la sintaxis corre, pero no mejora nada. (La pregunta 30 del mismo
  examen de *Bases de Datos Avanzadas* toca un tema distinto —si siempre se puede escribir a través de
  una vista— y corresponde a la trampa de actualizabilidad, no a esta.)
- **Aggregation pipeline de MongoDB sobre el mismo dataset de álbumes.** [[Parcial 1Q2020]] pregunta 1
  y [[Recuperatorio 2Q2020]] pregunta I.1 son el mismo ejercicio (`$group`, `$sort`, `$addFields`,
  `$out` sobre `albumlist.csv`) — evidencia de que la cátedra reutilizaba ejercicios entre instancias
  del mismo período.
- **`create` de HBase a partir del diagrama `color`/`shape`.** [[Final 1Dic2023]] pregunta 4 (tabla
  `formas`, *column families* `colores`/`figura`) y [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]]
  pregunta 21 (tabla `figures`, `color`/`shape`) son el mismo ejemplo de *Seven Databases* 2ª ed.
  cap. 3 § *Creating a Table*. Respuesta en ambas: tabla más sus *column families*, sin la row key
  (`create 'formas', 'colores', 'figura'` es la A del final; `create 'figures', 'color', 'shape'`, la D
  del parcial). *(fuera del temario 2026)*
- **Qué motor da versionado de datos → HBase.** [[Final 1Dic2023]] pregunta 2 (copiada en
  [[Repaso Final BD 2]] Ejercicio 27) y [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]]
  pregunta 24. Respuesta de la fuente en los tres: **HBase**. Diferencia: el parcial de 2023 incluye
  DynamoDB entre las opciones, y el Apéndice A1 de *Seven Databases* (impresa 313) también le marca
  *Versioning* = Yes; esa página lo registra como (atención). En el final, DynamoDB no es opción.
  *(fuera del temario 2026)*
- **DynamoDB según el teorema CAP.** [[Parcial 1Q2020]] pregunta 3.1, [[Recuperatorio 2Q2020]]
  pregunta II.1 y [[Repaso Final BD 2]] Ejercicio 17. Solo el 1Q2020 trae respuesta de la fuente:
  *"AP o CP en ciertos casos (CP cuando dicho modo está habilitado)"*. En los otros dos la fuente no
  responde y la resolución del vault es AP, con lectura fuertemente consistente elegible por operación
  → [[2.12.04 - Teorema CAP|Teorema CAP]]. *(tema no dictado aún: DynamoDB se dicta el 02/11)*
- **Tabla de posiciones de un videojuego con `userID` y `score`.** [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]]
  pregunta 10 (100.000 transacciones/seg, opción múltiple) y [[Final 1Jul2025]] pregunta 4
  (10⁹ escrituras/seg, desarrollo; copiada en [[Repaso Final BD 2]] Ejercicio 24). Las respuestas
  difieren: el parcial de 2023 da **Redis** (*sorted sets* en memoria); en el final, la copia larga
  responde **Cassandra** y la corta **Redis**, y el vault sostiene Cassandra porque el enunciado pone
  el peso en el volumen de **escritura**. El [[Parcial 2Q2020]] (pregunta V) pide el mismo leaderboard
  como ejercicio práctico con un *sorted set* de Redis. *(temas no dictados aún)*
- **La cadena `MovimientoUSDT` con `LOCAL` y `CASCADED`.** [[Parcial 2Q2025]] preguntas 1 y 18
  (opción múltiple) y [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 1 (seis `INSERT` acumulativos,
  desarrollo): la misma cadena de tres vistas con otros umbrales (`valor < 1200` y `comision < 25` en
  2025; `valor < 1100` y `comision < 20` en el XC-202X). En el XC-202X deciden las desigualdades
  estrictas (`20 < 20`, `1100 < 1100`); corrido en MySQL 9.7.2.
- **`Carrera`/`Materia`/`Facultad`: el mismo `DELETE`, `UPDATE` e `INSERT` en tres exámenes.**
  [[Parcial 2Q2025]] preguntas 30, 17 y 19; [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 2 (a, b, c)
  y [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 8 (8.1, 8.2, 8.3; allí el `DELETE` es de
  `idCarr = 1` y el `INSERT` usa `M5`), con esquema y datos idénticos. Respuesta: el `DELETE` no
  procede (`ERROR 1451`, R2 `restrict`); el `UPDATE` no procede porque duplica la PK compuesta
  (`ERROR 1062`); el `INSERT` con un componente `NULL` procede (`MATCH SIMPLE`). En los dos manuscritos
  el estudiante da el `UPDATE` por procedente.
- **Replicación vs. sharding, opción múltiple idéntica.** [[Parcial 2Q2025]] pregunta 21 y
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 9, iguales salvo la redacción de la opción d.
  Respuesta: **B**.
- **El `aggregate` de `orders` (`$match` en efectivo + `$group` por fecha).** [[Parcial 2Q2025]]
  pregunta 15 y [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 10a, idénticas. Respuesta: suma de
  `quantity` por `order_date` de las órdenes pagadas en efectivo.
- **Traducir `SELECT tipo, COUNT(*) FROM hospitales GROUP BY tipo ORDER BY COUNT(*) DESC`.**
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 10b y
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 7, idénticas. Respuesta:
  `$group: { _id: "$tipo", count: { $sum: 1 } }` → `$sort: { count: -1 }`. Las dos respuestas
  manuscritas fallan: una consulta la colección inexistente `hospitals` (devuelve vacío sin error) y la
  otra escribe `_id='tipo'` y `$sort: -1`.
- **Cypher: amigos a dos o tres saltos de Mary que no son amigos directos.**
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 4 y
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 8 traen la misma
  consulta; [[Parcial 2Q2025]] pregunta 22 pide la misma traducción a lenguaje natural con otra
  consulta. *(tema no dictado aún: Neo4j se dicta el 19/10)*
- **Neo4j: restricción de unicidad en Cypher y clasificación CAP.** [[Parcial 2Q2025]] preguntas 20
  (restricción) y 13 (Neo4j como CA), y [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 3 (las dos cosas
  juntas). Respuesta: `CREATE CONSTRAINT … FOR (n:Label) REQUIRE n.prop IS UNIQUE`; en CAP, CA como
  instancia única (Seven Databases A2) y AP con HA (cap. 6). *(tema no dictado aún)*
- **Componentes de un nodo de Cassandra.** [[Parcial 2Q2025]] preguntas 8 y 14 y
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 7 (esquema a dibujar): commit log y SSTables en disco,
  MemTable en memoria. La pregunta 28 del 2Q2025 (*"La arquitectura de Cassandra es Master-Slave"*,
  Falso) reaparece negada como inciso d del Ejercicio 8 del XC-202X (*"Cassandra no utiliza el
  mecanismo de master-slave"*, Verdadero): la arquitectura es peer-to-peer. *(tema no dictado aún:
  Cassandra se dicta el 28/09 y el 05/10)*
- **`COALESCE` sobre la jerarquía `OBRA_PRIVADA`/`OBRA_CIVIL`.** [[Parcial 2Q-2023|Parcial 2Q-2023]]
  Ejercicio 1B (obras con supervisor) y [[Parcial 2Q2025]] pregunta 16 (obras en ejecución).
  Respuesta: dos `LEFT JOIN` a las tablas hijas y `COALESCE(arquitecto, ingeniero_resp)`. El
  Ejercicio 2B de [[Práctica subida por la cátedra|Práctica subida por la cátedra]] aplica el mismo
  patrón a `Audio`/`Imagen`.
- **Vista `ConstructorVIP`: ¿es actualizable?** [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 4B y
  [[Parcial 2Q2025]] pregunta 27. Respuesta: no; con `GROUP BY` y agregación, MySQL 9.7.2 da
  `ERROR 1288` en `UPDATE`/`DELETE` y `ERROR 1471` en `INSERT`.
- **`EXPLAIN ANALYZE`: ¿ejecuta la sentencia?** [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 7 (tres
  incisos V/F, con PostgreSQL de fondo), [[Parcial 2Q2025]] pregunta 2 (el inciso a, "en MySQL") y
  [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]] pregunta 17. Respuesta: sí ejecuta;
  PostgreSQL muestra por separado el tiempo de planificación y el de ejecución, MySQL da `actual time`
  por iterador.
- **Cadena de `GRANT`/`REVOKE … CASCADE` entre U0 y U3.** [[Parcial 2Q-2023|Parcial 2Q-2023]]
  Ejercicio 6 (`EMPLEADO` y las vistas ES y ESJ) y [[Parcial 2Q2025]] pregunta 32 (`CLIENTE` y las
  vistas CS y CSV). Respuesta: con el grafo de permisos, un privilegio sobrevive si le queda otro camino
  hasta el administrador. El Ejercicio 6 de
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] practica la escritura de una cadena
  parecida.
- **Vistas sobre Investigadores con `HAVING COUNT(DISTINCT …) >= 3`.**
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 1 y
  [[Repaso Final BD 2]] Ejercicio 20 son la misma consigna (incisos A, B y C). (atención) Las dos
  resoluciones del vault difieren en C: la del Repaso usa `JOIN`; la de la práctica, `LEFT JOIN` con la
  fecha en el `ON`, porque la consigna pide *"todos los investigadores"*.

## Trampas recurrentes

- **`WITH LOCAL CHECK OPTION` vs. `WITH CASCADED CHECK OPTION` en una cadena de vistas.**
  [[Parcial 2Q2025]] preguntas [[Parcial 2Q2025#Pregunta 1 — vistas con `WITH CHECK OPTION` en cadena (Opción Múltiple)|1]]
  y [[Parcial 2Q2025#Pregunta 18 — `WITH LOCAL CHECK OPTION` con una vista base que no se cumple (Opción Múltiple)|18]]
  reutilizan la misma cadena de tres vistas y solo cambian la vista destino del `INSERT`. Concepto:
  [[1.06.01 - Vistas|Vistas]]. `CASCADED` (el default) chequea toda la cadena; `LOCAL` chequea la
  condición propia **más** las de las vistas subyacentes que tengan su propio `WITH CHECK OPTION` — si
  la subyacente no tiene WCO propio, `LOCAL` no tiene nada que propagarle. Verificado con corridas
  reales en MySQL 9.7.2. El [[Parcial XC-202X|Parcial XC-202X]] (Ejercicio 1) pide la misma cadena
  como desarrollo; su inciso e muestra el error típico de justificación: invocar el `CASCADED` de una
  vista por la que la sentencia no pasa.
- **Acciones referenciales con FK compuesta y un componente `NULL` (`MATCH simple`).**
  [[Parcial 2Q2025#Pregunta 19 — `INSERT` en `Materia` con un componente `NULL` (Opción Múltiple)|Pregunta 19]]
  del [[Parcial 2Q2025]], el inciso c del Ejercicio 2 del [[Parcial XC-202X|Parcial XC-202X]] y el
  8.3 del [[Parcial 2Q-2023|Parcial 2Q-2023]]. Concepto:
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]]. Con
  `MATCH simple` (el único que MySQL implementa: acepta `MATCH FULL`/`PARTIAL` sin
  error ni warning, pero los ignora; verificado en MySQL 9.7.2), basta
  con que **un** componente de la FK compuesta sea `NULL` para que la referencia se dé por satisfecha,
  sin verificar si el resto existe en la tabla referenciada.
- **Una restricción "obvia" de RIR que en realidad es otra restricción.**
  [[Parcial 2Q2025#Pregunta 17 — `UPDATE` sobre `Carrera` (Opción Múltiple)|Pregunta 17]] del
  [[Parcial 2Q2025]]: un `UPDATE` que parece violar una regla de integridad referencial en realidad
  falla por unicidad de la clave primaria compuesta (verificado: `ERROR 1062`, no un error de FK).
  Enunciados con dos RIR definidas invitan a responder "no procede por RIR", cuando la causa real es
  otra restricción. La misma operación está en el [[Parcial XC-202X|Parcial XC-202X]] (Ejercicio 2b) y
  en el [[Parcial 2Q-2023|Parcial 2Q-2023]] (Ejercicio 8.2), y en los dos el estudiante que los
  resolvió respondió que procede en cascada.
- **La clasificación CAP de un motor depende de qué fuente se use, y las fuentes discrepan.**
  MongoDB: el deck de la cátedra lo marca CP y Corbellini lo marca distinto según la tabla — ver
  [[Parcial 2Q2025#Pregunta 10 — ¿MongoDB es AP? (Verdadero/Falso)|Pregunta 10]] del
  [[Parcial 2Q2025]]. Neo4j: el mismo slide 18 no lo incluye en ninguna columna, pero
  [[Parcial 2Q2025#Pregunta 13 — bases de datos en configuración CA (Opción Múltiple, varias correctas)|Pregunta 13]]
  lo evalúa como CA, y *Seven Databases* 2ª ed. se contradice a sí mismo entre el apéndice (CA) y el
  capítulo 6 (Neo4j HA como AP). Redis: en disputa entre el deck (CP), Corbellini (AP) y *Seven
  Databases* (CA), sin resolver — ver [[Repaso Final BD 2]] Ejercicio 12. Concepto:
  [[2.12.04 - Teorema CAP|Teorema CAP]]. La apuesta más segura para el parcial es la clasificación
  textual del slide 18 de la Clase 12, cuando el motor esté en ese slide.
- **`EXPLAIN` vs. `EXPLAIN ANALYZE`: cuál ejecuta la sentencia.**
  [[Parcial 2Q2025#Pregunta 2 — `EXPLAIN ANALYZE` en MySQL (Verdadero/Falso)|Pregunta 2]] del
  [[Parcial 2Q2025]] (MySQL) y la pregunta 17 del [[Parcial 23-5-23 - Bases de Datos Avanzadas]]
  (PostgreSQL). Concepto: [[1.08.01 - Plan de ejecución|Plan de ejecución]]. `EXPLAIN` solo, no
  ejecuta; `EXPLAIN ANALYZE` sí ejecuta la sentencia de verdad — con la advertencia de que en
  PostgreSQL un `EXPLAIN ANALYZE DELETE …` borra datos reales (MySQL 9.7.2 no admite `EXPLAIN ANALYZE`
  sobre un `DELETE` de una sola tabla y no borra nada). El [[Parcial 2Q-2023|Parcial 2Q-2023]]
  (Ejercicio 7) pregunta además si muestra el tiempo de planificación: sí en PostgreSQL; MySQL 9.7.2 da
  `actual time` por iterador, sin un tiempo de planificación separado.
- **Índice HASH para igualdad pura: correcto en teoría, no ejecutable en InnoDB.**
  [[Final 1Jul2025#Pregunta 1 — índice para el login en MySQL|Pregunta 1]] del [[Final 1Jul2025]].
  Concepto: [[1.08.02 - Índices|Índices]]. `CREATE INDEX … USING HASH` no da error en una tabla
  InnoDB: emite la nota 3502 (*"This storage engine does not support the HASH index algorithm,
  storage engine default was used instead."*, visible con `SHOW WARNINGS`) y crea un B-tree
  (`INDEX_TYPE = BTREE`, verificado en MySQL 9.7.2); el índice HASH real solo existe con
  `ENGINE=MEMORY`.
- **El shell legado de MongoDB (`mongo`) y `.save()` ya no existen en `mongosh`.**
  Ejercicios II.a y II.c del [[Parcial 2Q2020]]. Concepto:
  [[2.14.01 - mongosh y herramientas de línea de comando|mongosh y herramientas de línea de comando]].
  Cualquier resolución de examen
  viejo con `mongo <db>` o `db.collection.save(doc)` hay que traducirla a `mongosh` y a
  `updateOne`/`replaceOne` antes de repetirla — verificado con `TypeError` real en MongoDB 8.3.11.
- **Vista con agregación: parece consultable, no es actualizable.**
  [[Parcial 2Q2025#Pregunta 27 — vista `ConstructorVIP` con agregación: ¿es actualizable? (Ensayo)|Pregunta 27]]
  del [[Parcial 2Q2025]] y la pregunta 30 del [[Parcial 23-5-23 - Bases de Datos Avanzadas]] (¿siempre
  se puede `UPDATE`/`INSERT`/`DELETE` sobre una vista?). Concepto: [[1.06.01 - Vistas|Vistas]]. Una
  vista con `GROUP BY` + funciones de agregación no preserva la clave primaria de la tabla base: MySQL
  rechaza el `INSERT` como no insertable (`ERROR 1471`) y el `UPDATE` o el `DELETE` como no
  actualizable (`ERROR 1288`), aunque el `SELECT` funcione sin problema. Reaparece en el
  [[Parcial 2Q-2023|Parcial 2Q-2023]] (Ejercicio 4B) y en la
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] (Ejercicio 1), donde la vista
  definida sobre otra con agregación hereda la no actualizabilidad.
- **`NULL` dentro de un `NOT IN`.** [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicios 9 (opción B) y 10:
  con un solo `NULL` en la subconsulta, `NOT IN` no devuelve ninguna fila; `NOT EXISTS` no tiene ese
  problema. En el mismo Ejercicio 9, la opción E (`id_director <> null`) descarta todo: los nulos se
  testean con `IS [NOT] NULL`. Concepto: [[1.05.01 - SQL — consultas|SQL — consultas]]. Verificado en
  MySQL 9.7.2.
- **Agregados sobre una columna toda `NULL`.**
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 3: `SUM` devuelve `NULL`,
  no 0; `COUNT(col)` da 0 y `COUNT(*)` cuenta filas. Concepto:
  [[1.05.01 - SQL — consultas|SQL — consultas]]. Verificado en MySQL 9.7.2.
- **El filtro de un `LEFT JOIN` puesto en el `WHERE`.**
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicios 1C y 2A: en el `WHERE`,
  el filtro sobre la tabla opcional elimina las filas sin coincidencia y el `LEFT JOIN` vuelve a ser un
  `JOIN`; "todos" y "a lo sumo 3" piden el filtro en el `ON`. Concepto:
  [[1.05.01 - SQL — consultas|SQL — consultas]].
- **Restricción global vs. restricción de tabla.** [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 4A
  (la condición cruza `EJECUTA` y `OBRA`: `ASSERTION`) frente a [[Parcial 2Q2025]] pregunta 24 (una sola
  tabla: `CHECK`). En MySQL las dos terminan en triggers. Concepto:
  [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]].
- **Sintaxis de otro motor en el enunciado.** [[Parcial XC-202X|Parcial XC-202X]] (`to_date`),
  [[Parcial 2Q-2023|Parcial 2Q-2023]] (`GRANT … ON ES, ESJ`, `REVOKE … CASCADE`, tablas creadas "en
  PostgreSQL") y [[Práctica subida por la cátedra|Práctica subida por la cátedra]]
  (`INTERVAL '30 years'`): en MySQL 9.7.2 fallan o cambian. Hay que responder la teoría y, si se pide,
  dar la forma de MySQL → [[MySQL|MySQL]].
- **`$group` con `_id` sin `$`.** [[Práctica subida por la cátedra|Práctica subida por la cátedra]]
  Ejercicio 7: `_id: 'tipo'` agrupa todos los documentos en un único grupo con la cadena constante; la
  ruta de campo es `"$tipo"`. Concepto: [[2.12.08 - Aggregation pipeline|Aggregation pipeline]].
  Verificado en MongoDB 8.3.11.

## Qué estudiar para el parcial del 13/10/2026

Prioridad cruzando la frecuencia de la tabla de arriba con lo que [[_cronograma]] confirma como ya
dictado o por dictarse antes del 13/10 (hoy, 25/09/2026: dictado hasta la Clase 14; Cassandra entra el
28/09 y el 05/10, **antes** del parcial; Neo4j el 19–20/10, Redis el 26–27/10 y DynamoDB el 02/11,
todos **después**).

- ★★★ **Teorema CAP**, por motor y con la clasificación del slide 18 de la Clase 12 como primera
  respuesta. Con 11 preguntas del temario actual, empata con Vistas como segundo tema entre lo que
  entra al parcial (detrás de Cassandra, 14; Redis, con 17, se dicta después) y aparece en casi todos los formatos
  (metáfora V/F, opción múltiple, coincidencia).
- ★★★ **Vistas**: `WITH CHECK OPTION` (`LOCAL` vs. `CASCADED`), actualizabilidad, y la trampa de
  vistas materializadas en MySQL (sintaxis aceptada, sin efecto real). Empata con CAP en preguntas
  entre lo que entra al parcial (11, detrás de Cassandra), y la cadena `MovimientoUSDT` aparece casi
  textual en dos exámenes distintos (2Q2025 y XC-202X).
- ★★★ **Integridad referencial y acciones referenciales**, con FK simples y compuestas, componentes
  `NULL` y `MATCH simple`, y la trampa de confundir una restricción de unicidad con una RIR. Suma 7
  preguntas: las mismas tres operaciones sobre `Carrera`/`Materia` aparecen en el 2Q2025, el XC-202X y
  el 2Q-2023.
- ★★★ **SQL — consultas**: `NOT IN` frente a `NOT EXISTS` con nulos, `<> NULL` frente a `IS NULL`,
  agregados sobre columnas nulas, `LEFT JOIN` con el filtro en el `ON`, `COALESCE` sobre una jerarquía
  y `GROUP BY`/`HAVING`. Suma 10 preguntas del temario actual; nueve salen del
  [[Parcial 2Q-2023|Parcial 2Q-2023]] y de la
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]], así que su peso depende de esas dos
  fuentes, pero es materia de la Clase 05 y entra con seguridad.
- ★★ **Plan de ejecución e índices**: lectura de un `EXPLAIN` (Unique Index Scan vs. Full Scan),
  `EXPLAIN` vs. `EXPLAIN ANALYZE`, y HASH vs. B-tree en InnoDB.
- ★★ **MongoDB**: aggregation pipeline (`$match`, `$group`, `$sort`), CRUD con `mongosh` (no el shell
  legado), índices por defecto, `MapReduce` (deprecado pero preguntado), embebido vs. referencias.
- ★★ **Cassandra**: entra al cronograma **antes** del parcial (28/09 y 05/10), y en el temario actual
  ya acumula 14 preguntas. Diez son de definición o sintaxis (las siete del [[Parcial 2Q2025]], el
  esquema de un nodo y el V/F de arquitectura del [[Parcial XC-202X|Parcial XC-202X]] y el
  `CREATE KEYSPACE` de la [[Práctica subida por la cátedra|Práctica subida por la cátedra]]); las otras
  cuatro son de razonamiento aplicado — elegir Cassandra como motor para
  un caso de escritura masiva ([[Final 1Jul2025]] pregunta 4, [[Final 1Dic2025]] pregunta 5 y sus
  copias en [[Repaso Final BD 2]] Ejercicios 24 y 32) —, así
  que conviene repasar también el argumento de *por qué* Cassandra y no otro motor, no solo la
  terminología. Sin bibliografía obligatoria propia: repasar con Corbellini § 5 y la documentación
  oficial de Apache Cassandra.
- ★ **Transacciones y control de concurrencia**: anomalías (dirty read, non-repeatable read, phantom
  read, lost update), niveles de aislamiento, locking (shared/exclusive), control de versiones,
  timestamp ordering.
- ★ **`CHECK`, `ASSERTION` y triggers**: en SQL estándar, `ASSERTION`/`CHECK` con subconsulta; en
  MySQL, de nivel tabla para arriba se resuelve con triggers (3 preguntas: dos del 2Q2025 y la
  `ASSERTION` del Ejercicio 4A del 2Q-2023, que en MySQL se traduce a triggers).
- ★★ **Privilegios**: `GRANT`/`REVOKE ... CASCADE` en SQL estándar (MySQL no cascadea `REVOKE`), y el
  grafo de concesiones independientes por (usuario, privilegio). La cadena U0–U3 con vistas aparece en
  el 2Q2025 y en el 2Q-2023, y la práctica pide escribir otra (3 preguntas).
- ★ **Persistencia políglota, escalabilidad horizontal y taxonomía NoSQL**: sharding vs. replicación,
  la distinción persistencia políglota / programación políglota, géneros de motores NoSQL.
- Sin historial en los exámenes viejos, pero dictados antes del 13/10: SQL procedural, stored
  procedures y cursores ([[Clase 10 - Restricciones integridad-Parte 2|Clase 10]]), recovery con WAL
  y ARIES ([[Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL|Clase 11(B)]]) y seguridad y roles más allá
  de las cadenas de `GRANT`/`REVOKE` del 2Q2025, el 2Q-2023 y la práctica. Que no tengan preguntas registradas no los
  saca del parcial.
- *(prioridad baja para este parcial, aunque concentran una porción considerable del historial)*
  **Neo4j, Redis y DynamoDB** se dictan después del 13/10 según el cronograma vigente: en los
  exámenes viejos suman juntos casi un tercio de las 194 filas del historial (59: Redis 24,
  Neo4j 20, DynamoDB 15 entre ambos temarios), así que valen para el recuperatorio del 03/11 y el
  final, no para esta fecha — salvo que la cátedra adelante contenido antes del 13/10.

## Dudas abiertas

- (abierto) **Formato del parcial 2026.** El [[Parcial 2Q2025]] fue en plataforma, con preguntas
  cerradas y de ensayo; el [[Parcial XC-202X|Parcial XC-202X]] y el [[Parcial 2Q-2023|Parcial 2Q-2023]],
  impresos y de desarrollo, con los mismos ejercicios. Son indicios de otros años en los dos sentidos:
  el formato del 13/10/2026 lo confirma la cátedra.
- (abierto) El slide 18 de la Clase 12 —la fuente que el vault documenta como "la clasificación CAP
  que toma el parcial"— no incluye a Neo4j en ninguna columna (sí incluye a Redis, en la columna CP,
  junto con HBase/MongoDB/Memcache), pero exámenes viejos de ambos temarios evalúan a Neo4j en
  preguntas de CAP. Sin una fuente de cátedra 2026 que lo clasifique explícitamente, la apuesta de
  examen queda sin resolver del todo para ese motor. El [[Parcial XC-202X|Parcial XC-202X]]
  (Ejercicio 3) suma un criterio de estudiante de tres casos (instancia única → CA, HA → AP,
  distribuido con particiones → CP) cuyo caso CP no tiene respaldo en la bibliografía del vault.
- (abierto) La clasificación CAP de Redis sigue en disputa entre tres fuentes del propio vault (CP el
  deck, AP el paper de Corbellini, CA *Seven Databases*) — ver [[2.12.04 - Teorema CAP|Teorema CAP]] §
  *Dudas abiertas*. El [[Parcial XC-202X|Parcial XC-202X]] (Ejercicio 5) la pregunta y el estudiante la
  deja sin resolver (*"No entra"*).
- (abierto) No hay forma de anticipar si las preguntas de Cassandra del parcial 2026 seguirán el
  patrón de definición pura que muestra [[Parcial 2Q2025]] (terminología, componentes, fórmulas) o si,
  al ser la primera cohorte que la cursa completa antes del parcial, la cátedra suba el nivel a
  preguntas de razonamiento aplicado como las que ya usa para MongoDB.
- (ok) [[Clase 06 - Vistas-Parte 1]], [[Práctica 2026-08-11]] y
  [[Clase 09 - Restricciones integridad-Parte 1]] llevan la nota de evidencia del [[Parcial 2Q2025]].
  El comportamiento de `LOCAL CHECK OPTION` y de `MATCH` se verificó en MySQL 9.7.2; qué entra al
  parcial 2026 sigue abierto en esas páginas.

## Enlaces

[[Parcial 2Q2025]] · [[Final 1Jul2025]] · [[Final 1Dic2023]] · [[Final 1Dic2025]] ·
[[Repaso Final BD 2]] · [[Parcial XC-202X|Parcial XC-202X]] · [[Parcial 2Q-2023|Parcial 2Q-2023]] ·
[[Práctica subida por la cátedra|Práctica subida por la cátedra]] · [[Parcial 1Q2020]] · [[Parcial 2Q2020]] · [[Recuperatorio 2Q2020]] ·
[[Parcial 1Q2021]] · [[Parcial 2Q2021]] · [[Parcial 23-5-23 - Bases de Datos Avanzadas]] ·
[[_cronograma]] · [[_index-clases]] · [[1.06.01 - Vistas|Vistas]] ·
[[1.08.01 - Plan de ejecución|Plan de ejecución]] · [[1.08.02 - Índices|Índices]] ·
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
[[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] ·
[[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] ·
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] ·
[[2.12.01 - NoSQL — origen, propiedades y taxonomía|Taxonomía NoSQL]] ·
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
[[2.12.03 - Persistencia políglota|Persistencia políglota]] ·
[[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.07 - CRUD y consultas en MongoDB|CRUD MongoDB]] ·
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
[[2.13.01 - Documentos embebidos vs. referencias|Documentos embebidos]] ·
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]] · [[2.14.03 - MapReduce|MapReduce]] ·
[[1.05.01 - SQL — consultas|SQL — consultas]] · [[1.09.04 - Triggers|Triggers]]
