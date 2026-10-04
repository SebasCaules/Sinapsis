---
tipo: examen
unidad: eval
instancia: repaso
tema:
  - Mapa de los 16 exámenes viejos del vault, con el Parcial y el Recuperatorio 1Q2026 como los de mayor peso
  - Formato real del parcial de la cátedra actual (Blackboard, 1C 2026)
  - Frecuencia de temas y preguntas que se repiten entre exámenes
  - Dónde se pierden los puntos y trampas recurrentes de examen
  - Priorización de estudio para el parcial del 13/10/2026 y el recuperatorio del 03/11/2026
temario: actual
fuentes:
  - "raw/Examenes_Viejos/1C-26/Parcial/BDII Parcial - 1Q2026.pdf"
  - "raw/Examenes_Viejos/1C-26/Recu/WhatsApp Video 2026-09-29 at 11.06.33.mp4"
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
resumen: "Síntesis de los 16 exámenes viejos del vault. Mandan el Parcial y el Recuperatorio 1Q2026 (Blackboard, cátedra actual): formato real, qué se tomó y dónde se pierden los puntos. Suma frecuencia de temas, preguntas repetidas, trampas y qué estudiar para el parcial del 13/10/2026."
aliases:
  - Mapa de exámenes
  - Mapa examenes
  - Qué estudiar para el parcial
  - Guía de exámenes viejos
---

# Mapa de exámenes — síntesis de los 16 exámenes viejos

## Resumen general

Esta página cruza los 16 exámenes viejos del vault para responder qué conviene estudiar para el
parcial del 13/10/2026 y con qué prioridad. Mandan las dos instancias del cuatrimestre anterior, el
[[Parcial 1Q2026]] y el [[Recuperatorio 1Q2026]]: misma cátedra, misma plataforma (Blackboard) y la
corrección real a la vista. Con ellas el formato deja de ser una conjetura: 35 o 36 preguntas por 100
puntos, entre verdadero/falso, opción múltiple (las de varias correctas, con crédito negativo),
coincidencia y ensayos corregidos a mano, que en el parcial suman 53 puntos; el 4 se alcanza con 60 y
hay 2 h 30 min. El [[Parcial 2Q2025]] queda segundo: quince preguntas del parcial 1C-26 son casi
textuales de ese examen, y 22 de las 36 del recuperatorio ya estaban en otra instancia. La cátedra
recicla su banco.

El 1C-26 tomó vistas con `CHECK OPTION`, acciones referenciales, `CHECK`, `EXPLAIN`,
`GRANT`/`REVOKE`, aislamiento, CAP, MongoDB y Cassandra; el parcial sumó Neo4j y el recuperatorio,
Neo4j y Redis. Los puntos se pierden en los ensayos: el parcial se desaprobó por 1,51 puntos, y tres
ensayos —partition y clustering key, QUORUM con RF 5 y el *phantom read*— se llevaron 17 de sus 19
puntos. En las cerradas restan los distractores con crédito negativo y las trampas del esquema
`Carrera`/`Materia`.

Los otros catorce exámenes son ocho del temario actual y seis del anterior (2020-2021 y uno de otra
materia), con motores que la cursada 2026 no dicta. Según [[_cronograma]], el 13/10 entran lo
relacional, MongoDB y Cassandra; Neo4j y Redis, recién en el recuperatorio del 03/11. *Qué estudiar*
cruza ese calendario con los puntos del 1C-26 y la frecuencia del historial.

## Qué exámenes hay

★★ marca las dos instancias de mayor peso (cátedra, plataforma y corrección del 1C 2026); ★, la
segunda en peso. El resto va con el temario actual primero.

| Página | Instancia | Año/cuatrimestre | Formato | Temario | Confiabilidad de las respuestas |
| --- | --- | --- | --- | --- | --- |
| ★★ [[Parcial 1Q2026]] | parcial | 2026 1C | 35 preguntas en Blackboard, 100 puntos: 9 V/F, 11 OM simples, 3 OM de varias correctas, 1 coincidencia, 10 ensayos (53 puntos) y una no visible; 2 h 30 y aprobación con 60 (encabezado del recuperatorio) | actual | **Muy alta** — fotos de la revisión real: respuesta del alumno, clave, pastilla de puntaje y comentarios del docente; todo corrido en MySQL 9.7.2, MongoDB 8.3.11 y Cassandra 5.0.9. El alumno sacó 58,49: desaprobado. La Pregunta 35 no está fotografiada |
| ★★ [[Recuperatorio 1Q2026]] | recuperatorio | 2026 1C | 36 preguntas en Blackboard, 100 puntos: 15 V/F, 8 OM simples, 3 OM de varias correctas, 1 coincidencia, 9 ensayos (40,5 puntos); 2 h 30, tabla puntaje → nota en el encabezado | actual | **Muy alta** — video de la revisión real, con una clave que el docente corrigió a mano (P6); SQL, MongoDB y Cassandra corridos; Neo4j y Redis sin motor en el vault. El alumno sacó 67,88: nota 5 |
| ★ [[Parcial 2Q2025]] | parcial | 2025 2C | 33 preguntas (OM simple/varias correctas, V/F, coincidencia, ensayo) en plataforma online autocalificada | actual | **Alta** — 3 fuentes cruzadas (solucionario, capturas del examen real corregido, corridas propias en MySQL 9.7.2/MongoDB 8.3.11), más el cotejo con [[Parcial XC-202X\|XC-202X]] y [[Parcial 2Q-2023\|2Q-2023]] |
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

El formato de la cátedra actual está documentado por las dos instancias del 1C 2026, rendidas en
Blackboard y registradas en su pantalla de revisión (fotos del parcial, video del recuperatorio).

| | ★★ [[Parcial 1Q2026]] | ★★ [[Recuperatorio 1Q2026]] |
| --- | --- | --- |
| Preguntas y total | 35, 100 puntos | 36, 100 puntos |
| Verdadero/falso | 9, de 1 punto (9 puntos) | 15, de 2 puntos (30 puntos) |
| Opción múltiple simple | 11, de 1 a 5 puntos (24 puntos) | 8, de 2 puntos y una de 4 (18 puntos) |
| Opción múltiple, varias correctas | 3, de 3 o 4 puntos (10 puntos) | 3, de 3 puntos (9 puntos) |
| Coincidencia | 1, de 3 puntos | 1, de 2,5 puntos |
| Ensayo (texto o código) | 10, de 3 a 8 puntos: **53 puntos** | 9, de 3 a 7,5 puntos: 40,5 puntos |
| No visible | 1 (1 punto) | — |
| Comentarios del docente | preguntas 7, 14 y 23 | preguntas 3, 13, 18 y 24, más la corrección de la clave de la 6 |
| Orden de las preguntas | temas mezclados | por bloques: SQL, transacciones, MongoDB, Neo4j, elección de motor y CAP, Redis, Cassandra |

- **Corrección automática de las cerradas.** V/F, opción múltiple y coincidencia se corrigen solas.
  La revisión muestra la opción elegida con `Correcta:` o `Incorrecta:` (en V/F, la fila verde sin
  rótulo o `Incorrecto:`), la clave con la leyenda `Respuesta correcta` y una pastilla de puntaje
  por pregunta.
- **Crédito parcial y negativo.** En las de varias correctas y en la coincidencia, cada opción suma o
  resta un porcentaje del puntaje (*"Crédito parcial y negativo — Es posible que se hayan deducido
  puntos por respuestas incorrectas"*). Un distractor marcado puede costar más que una correcta sin
  marcar: en la P28 del recuperatorio, `everyminutes` restó 50 % y dejó la pregunta en 0,49/3.
- **Ensayos corregidos a mano**, con comentario del docente cuando descuenta, breve y dirigido al
  hueco: *"b) no responde a la consitencia"* (P14 del parcial), *"Faltó filtrar por Ana."* (P24 del
  recuperatorio). En el parcial valen más de la mitad del examen, y la Pregunta 14 sola vale 8.
- **El docente puede anular la clave automática.** En la P6 del recuperatorio la plataforma tenía la
  clave invertida; el docente comentó *"Está mal configurada la pregunta. La respuesta correcta es No
  Procede."* y asignó 2/2 aunque el ícono quedara en ✗.
- **Aprobación y escala** (encabezado del recuperatorio, literal): *"nota 4, debe contestar
  correctamente como mínimo el 60% de las preguntas formuladas"*, con esta tabla:

| Puntaje: | 0-59 | 60-63 | 64-69 | 70-76 | 77-83 | 84-89 | 90-96 | 97-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nota: | Desaprobado | 4 | 5 | 6 | 7 | 8 | 9 | 10 |

- **Duración:** 2 horas y 30 minutos (encabezado del recuperatorio; el del parcial no está
  fotografiado, y su página toma de ahí la tabla y la duración).
- **Qué aportan los demás.** El [[Parcial 2Q2025]] fue en una plataforma online con la misma mecánica
  (33 preguntas, crédito parcial y negativo, ensayos corregidos a mano) y comparte quince preguntas
  casi textuales con el parcial 1C-26. El [[Parcial XC-202X|Parcial XC-202X]] y el
  [[Parcial 2Q-2023|Parcial 2Q-2023]], impresos y de desarrollo, sirven como banco de ejercicios, no
  como modelo de formato. El domiciliario de 2020-2021 ([[Parcial 1Q2020]], [[Parcial 2Q2020]],
  [[Parcial 1Q2021]], [[Parcial 2Q2021]]: seis a diez prácticos sobre motores que no se dictan, con
  capturas, de 3,5 a 6,5 horas) no reaparece en ningún examen del temario actual. El
  [[Parcial 23-5-23 - Bases de Datos Avanzadas]] es de otra materia: su 50 % para aprobar no aplica.
- **Para 2026 2C**, [[_cronograma]] fija el parcial el martes 13/10, presencial, y el recuperatorio el
  martes 03/11.

## Temas por frecuencia

Conteo por pregunta sobre los 16 exámenes: las 194 filas de las tablas *Mapa de temas* de los catorce
exámenes anteriores más las 71 preguntas del 1C-26 (35 del [[Parcial 1Q2026]] y 36 del
[[Recuperatorio 1Q2026]]), 265 en total. La Pregunta 35 del parcial, sin enunciado visible, no entra
en ningún tema. Una pregunta puede tocar más de un motor y entonces cuenta en más de un bucket; una
pregunta sobre un motor según CAP cuenta en el del motor y en el de CAP; y una de elección de motor
cuenta en ese bucket y en el del motor que responde. En el 1C-26 cuentan doble la P17 del
recuperatorio (MongoDB en CAP) y la P25 (tabla de posiciones → Redis). Las copias de los tres finales
que trae el [[Repaso Final BD 2]] (Ejercicios 21–32) se cuentan como filas propias, igual que en la
tabla de esa página. "Temario actual" son las preguntas de los dos exámenes 1C-26, [[Parcial 2Q2025]],
[[Parcial XC-202X|Parcial XC-202X]], [[Parcial 2Q-2023|Parcial 2Q-2023]], [[Final 1Jul2025]],
[[Final 1Dic2023]], [[Final 1Dic2025]], [[Repaso Final BD 2]] y
[[Práctica subida por la cátedra|Práctica subida por la cátedra]]; "temario anterior", las de los
cinco exámenes de 2020-2021 y el de *Bases de Datos Avanzadas*. La fila de Vistas cuenta solo vistas SQL
(`CREATE VIEW`/`CREATE MATERIALIZED VIEW`, actualizabilidad, `WITH CHECK OPTION`): las vistas
map/reduce de CouchDB de los exámenes 2020-2021 van en la fila de CouchDB, no en esta, aunque
compartan la palabra "vista" con el enunciado. La columna *1C-26* dice cuántas de las del temario
actual salen del parcial y del recuperatorio 1Q2026.

| Tema | Preguntas (temario actual) | de ellas, 1C-26 (parcial + recu) | Preguntas (temario anterior) | Concepto(s) del vault | Clase/TP 2026 |
| --- | --- | --- | --- | --- | --- |
| Redis | 25 | 8 (0 + 8) | 7 | — (sin página de motor propia) | no dictado aún: 26–27/10, después del parcial y antes del recuperatorio |
| Cassandra | 23 | 9 (6 + 3) | 0 | [[Cassandra]] · [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases de datos tabulares]] · [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura de Cassandra]] · [[3.15.03 - CQL y modelado orientado a consultas\|CQL]] · [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura]] · [[3.15.05 - Niveles de consistencia y QUORUM\|QUORUM]] · [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] | [[Clase 15 - Introduccion a Cassandra\|Clase 15]] (28/09) · [[Práctica 2026-09-29]] · teórica del 05/10 y TP10 Parte II — **entra al parcial** |
| Neo4j | 21 | 11 (4 + 7) | 10 | — (sin página de motor propia) | no dictado aún: 19–20/10, después del parcial y antes del recuperatorio |
| Vistas (incl. materializadas, solo SQL) | 18 | 7 (5 + 2) | 2 | [[1.06.01 - Vistas\|Vistas]] | Clase 06–07 |
| MongoDB (CRUD, aggregation, índices, MapReduce, embebido) | 18 | 11 (6 + 5) | 14 | [[2.12.07 - CRUD y consultas en MongoDB\|CRUD MongoDB]] · [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] · [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] · [[2.14.03 - MapReduce\|MapReduce]] · [[2.13.01 - Documentos embebidos vs. referencias\|Documentos embebidos]] | Clase 12–14 |
| Teorema CAP | 14 | 3 (1 + 2) | 5 | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 |
| SQL — consultas / DDL / búsqueda fonética | 13 | 3 (0 + 3) | 4 | [[1.05.01 - SQL — consultas\|SQL — consultas]] · [[1.03.02 - DDL — creación y alteración de tablas\|DDL]] | Clase 05 |
| Transacciones y control de concurrencia | 11 | 7 (3 + 4) | 0 | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] · [[1.11.03 - Transacciones y ACID\|Transacciones y ACID]] | Clase 11 |
| Integridad referencial y acciones referenciales | 10 | 3 (3 + 0) | 0 | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 |
| Plan de ejecución / índices | 9 | 3 (2 + 1) | 1 | [[1.08.01 - Plan de ejecución\|Plan de ejecución]] · [[1.08.02 - Índices\|Índices]] | Clase 08 (el índice hash, en los slides de índices de la Clase 11) |
| DynamoDB | 7 | 0 | 8 | — (sin página de motor propia) | no dictado aún: 02/11, la víspera del recuperatorio |
| `CHECK`, `ASSERTION` y triggers | 6 | 3 (1 + 2) | 0 | [[1.09.03 - CHECK, DOMAIN y ASSERTION\|CHECK, DOMAIN y ASSERTION]] · [[1.09.04 - Triggers\|Triggers]] | Clase 09/10 |
| Elección de motor (CAP + escalabilidad + patrón de acceso) | 5 | 1 (0 + 1) | 1 | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] · [[2.12.03 - Persistencia políglota\|Persistencia políglota]] | Clase 12 |
| Persistencia políglota / escalabilidad horizontal (fuera de "elección de motor") | 5 | 2 (2 + 0) | 1 | [[2.12.03 - Persistencia políglota\|Persistencia políglota]] · [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | Clase 12 |
| Privilegios (`GRANT`/`REVOKE`) | 4 | 1 (1 + 0) | 0 | [[1.11.02 - Usuarios, privilegios y roles\|Usuarios, privilegios y roles]] | Clase 11 |
| HBase | 3 | 0 | 5 | — | fuera del temario 2026 |
| Taxonomía NoSQL | 2 | 0 | 0 | [[2.12.01 - NoSQL — origen, propiedades y taxonomía\|Taxonomía NoSQL]] | Clase 12 |
| Modelo relacional / SGBD / modelo conceptual | 1 | 0 | 1 | [[1.01.01 - Sistema gestor de bases de datos\|Sistema gestor de bases de datos]] · [[1.02.02 - Modelo Entidad-Relación\|Modelo Entidad-Relación]] · [[1.03.01 - Derivación de MER a esquema relacional\|Derivación de MER]] | Clase 01–03 |
| ElasticSearch | 0 | 0 | 6 | — | fuera del temario 2026 |
| PostGIS / geoespacial | 0 | 0 | 5 | [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] cubre el equivalente en MongoDB | PostGIS fuera del temario 2026; el equivalente en MongoDB, Clase 14 |
| CouchDB | 0 | 0 | 10 | — | fuera del temario 2026 |
| Data warehousing (esquemas multidimensionales) | 0 | 0 | 2 | — | fuera del temario 2026 |

Dentro del 1C-26 el orden cambia: lideran MongoDB y Neo4j (11 preguntas cada uno), Cassandra (9) y
Redis (8), seguidos de Vistas y de transacciones (7). Por **puntos**, que es lo que decide la nota, el
parcial 1C-26 pone primero a Cassandra (23 de 100) y a MongoDB (21): el reparto completo está en
*Qué estudiar*.

## Preguntas que se repiten

Preguntas que aparecen, casi textuales, en más de un examen (mismo enunciado o misma metáfora, con
variaciones menores de nombres o cifras); cuando lo que se repite es el molde con otros datos, se
dice. Cada par se comprobó abriendo las dos preguntas. El banco se recicla: quince preguntas del
[[Parcial 1Q2026]] son casi textuales del [[Parcial 2Q2025]], y 22 de las 36 del
[[Recuperatorio 1Q2026]] ya estaban en otra instancia del vault.

### Con el 1C-26, de temas que entran el 13/10

- **La cadena `MovimientoUSDT` con `LOCAL` y `CASCADED`.** ★★ [[Parcial 1Q2026]] preguntas 4, 5 y 30
  (incisos a, d y f) y ★★ [[Recuperatorio 1Q2026]] preguntas 5 y 6; [[Parcial 2Q2025]] preguntas 1 y
  18 (opción múltiple) y [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 1 (seis `INSERT` acumulativos,
  desarrollo): la misma cadena de tres vistas. El 1C-26 y el 2Q2025 usan `valor < 1200` y
  `comision < 25`; el XC-202X, `valor < 1100` y `comision < 20`. La P5 del recuperatorio es la P18 del
  2Q2025 (`BITCOIN` por la vista `LOCAL`: procede) y la P6, la P1 (`EURO` por la `CASCADED`: no
  procede), esta vez con la clave de la plataforma invertida y corregida a mano por el docente. En el
  XC-202X deciden las desigualdades estrictas (`20 < 20`, `1100 < 1100`); corrido en MySQL 9.7.2.
- **`Carrera`/`Materia`/`Facultad`: el mismo `DELETE`, `UPDATE` e `INSERT` en cuatro exámenes.**
  ★★ [[Parcial 1Q2026]] preguntas 10, 19 y 21; [[Parcial 2Q2025]] preguntas 30, 17 y 19;
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 2 (a, b, c) y [[Parcial 2Q-2023|Parcial 2Q-2023]]
  Ejercicio 8 (8.1, 8.2, 8.3; allí el `DELETE` es de `idCarr = 1` y el `INSERT` usa `M5`), con esquema
  y datos idénticos. Respuesta: el `DELETE` no procede (`ERROR 1451`, R2 `restrict` ante baja); el
  `UPDATE` no procede porque duplica la PK compuesta (`ERROR 1062`); el `INSERT` con un componente
  `NULL` procede (`MATCH SIMPLE`). El `UPDATE` es el que más se falla: el alumno del 1C-26 lo atribuyó
  a R1, el del 2Q2025 a R2 y los dos manuscritos lo dan por procedente; el del 1C-26 falló además el
  `DELETE`.
- **`EXPLAIN ANALYZE`: ¿ejecuta la sentencia?** ★★ [[Parcial 1Q2026]] pregunta 1 y [[Parcial 2Q2025]]
  pregunta 2, idénticas (*"En MySQL, el 'EXPLAIN ANALYZE \<sql\>' muestra los tiempos de planificación,
  pero no ejecuta la sentencia"*: Falso); [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 7 (tres
  incisos V/F, con PostgreSQL de fondo) y [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]]
  pregunta 17. Respuesta: sí ejecuta; PostgreSQL muestra por separado el tiempo de planificación y el
  de ejecución, MySQL da `actual time` por iterador.
- **Leer el `EXPLAIN` de `materia` ⋈ `inscripto`.** ★★ [[Parcial 1Q2026]] pregunta 29 y
  [[Parcial 2Q2025]] pregunta 12, idénticas salvo el orden de las opciones. Respuesta: el *Single-row
  index lookup* sobre `materia` sale de que `codigo` sea PK **o** `UNIQUE` en `materia`; van las dos.
  El alumno del 2Q2025 marcó solo "`UNIQUE` en Inscripto" (0/4); el del 1C-26, las dos correctas (4/4).
- **Vista `ConstructorVIP`: definirla y decir si es actualizable.** ★★ [[Parcial 1Q2026]] pregunta 22
  (umbral de medio millón), [[Parcial 2Q2025]] pregunta 27 (un millón) y
  [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 4B. Respuesta: el umbral va sobre el total, en
  `HAVING SUM(e.presupuesto) > …`, y la vista no es actualizable por la agregación; MySQL 9.7.2 da
  `ERROR 1288` en `UPDATE`/`DELETE` y `ERROR 1471` en `INSERT`.
- **Vistas materializadas — ¿mejoran la performance?** ★★ [[Parcial 1Q2026]] pregunta 32 (sin motor
  nombrado: Verdadero), [[Parcial 2Q2025]] pregunta 11 (la negación, "en MySQL … NO trae ninguna
  mejora": Falso), [[Final 1Dic2023]] pregunta 3 (PostgreSQL, 4 incisos, copiada en
  [[Repaso Final BD 2]] Ejercicio 28) y [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]]
  pregunta 29 (PostgreSQL) hacen la misma pregunta de teoría general con distintos motores de fondo.
  Respuesta consistente: sí mejoran la performance porque persisten el resultado en disco — pero
  **MySQL no las implementa como objeto funcional** (acepta la sintaxis `CREATE MATERIALIZED VIEW`
  pero recalcula en cada `SELECT`, verificado en MySQL 9.7.2), así que la pregunta es de teoría de SQL
  estándar. El alumno del 1C-26 respondió Falso y perdió el punto. (La pregunta 30 del examen de
  *Bases de Datos Avanzadas* toca otro tema —si siempre se puede escribir a través de una vista— y
  corresponde a la trampa de actualizabilidad, no a esta.)
- **`CHECK` de tupla sueldo/comisión: qué hace, de qué tipo es, si valida lo existente.** ★★
  [[Parcial 1Q2026]] pregunta 12 (`Vendedor`, umbral 5.000.000, 6 puntos) y [[Parcial 2Q2025]]
  pregunta 25 (`Empleado`, umbral 5000, 7 puntos): las mismas tres preguntas sobre la misma
  restricción. Respuesta: con sueldo mayor al umbral la comisión debe ser 0; es un `CHECK` de registro
  o tupla (*"A nivel de Fila"* en la Clase 10); y al agregarlo con `ALTER TABLE` MySQL valida las
  filas existentes (`ERROR 3819`). (atención) El solucionario de estudiantes del 2Q2025 lo llama "a
  nivel de tabla"; manda el deck.
- **Restricción de tabla: `CHECK` en el estándar, `TRIGGER` en MySQL.** ★★ [[Recuperatorio 1Q2026]]
  pregunta 8 y [[Parcial 2Q2025]] pregunta 24, idénticas salvo una opción agregada (*"Ninguna opción
  es correcta"*). Clave en las dos: "1. CHECK 2. TRIGGER". El alumno del 2Q2025 marcó "1. ASSERTION
  2. CHECK" (0/2). Mismo tema, otro molde: leer una `ASSERTION` que cruza dos tablas
  (★★ [[Recuperatorio 1Q2026]] pregunta 3) o escribirla ([[Parcial 2Q-2023|Parcial 2Q-2023]]
  Ejercicio 4A).
- **Cadena de `GRANT`/`REVOKE … CASCADE` entre U0 y U3.** ★★ [[Parcial 1Q2026]] pregunta 3
  (`INVESTIGADOR` y las vistas IJ, IH e IS), [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 6
  (`EMPLEADO` y las vistas ES y ESJ) y [[Parcial 2Q2025]] pregunta 32 (`CLIENTE` y las vistas CS y
  CSV): el mismo molde de ocho pasos; el 1C-26 suma un `UPDATE` por columnas, un `INSERT` que falla
  sobre una vista y un `SELECT` final. Respuesta: con el grafo de permisos, un privilegio sobrevive si
  le queda otro camino hasta el administrador, y un privilegio sobre la tabla no da privilegio sobre
  sus vistas. El Ejercicio 6 de [[Práctica subida por la cátedra|Práctica subida por la cátedra]]
  practica la escritura de una cadena parecida.
- **`NOT IN` con un `NULL` en la subconsulta (`JUGO`/`SABOR`).** ★★ [[Recuperatorio 1Q2026]]
  pregunta 4 y [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 10, idénticas y con los mismos datos; en
  2023 el enunciado decía PostgreSQL y en el recuperatorio, MySQL. Respuesta: 0 filas es lo esperado,
  por el `NULL` de `SABOR` (no el de `JUGO`).
- **Índice para el login → hash.** ★★ [[Recuperatorio 1Q2026]] pregunta 7 (opción múltiple, clave
  Hash), [[Final 1Jul2025]] pregunta 1 (desarrollo) y su copia en [[Repaso Final BD 2]] Ejercicio 21.
  Respuesta de la cátedra: hash, porque el login es igualdad pura. En InnoDB, `USING HASH` crea un
  B-tree con la nota 3502 (verificado en MySQL 9.7.2).
- **Concurrencia en V/F: el mismo banco de afirmaciones.** Shared Lock que *"permite tanto lectura
  como escritura concurrente"* (Falso): ★★ [[Parcial 1Q2026]] pregunta 13, ★★ [[Recuperatorio 1Q2026]]
  pregunta 9 y [[Final 1Dic2025]] pregunta 3, inciso D. Objetivo del control de concurrencia
  (Verdadero): ★★ [[Parcial 1Q2026]] pregunta 11 y ★★ [[Recuperatorio 1Q2026]] pregunta 11, idénticas,
  y con la redacción del slide 21 de la Clase 11 en [[Final 1Dic2025]] pregunta 3, inciso A. *Dirty
  read* (Verdadero): ★★ [[Recuperatorio 1Q2026]] pregunta 10 y [[Final 1Dic2025]] pregunta 3, inciso
  C. Los incisos del final están copiados en [[Repaso Final BD 2]] Ejercicio 30. Mismo bloque, otro
  molde: el ensayo del *phantom read* (★★ [[Parcial 1Q2026]] pregunta 23) y el V/F de
  `READ UNCOMMITTED` (★★ [[Recuperatorio 1Q2026]] pregunta 12).
- **CAP — "todos los nodos aceptan lecturas y escrituras" → AP.** ★★ [[Parcial 1Q2026]] pregunta 2,
  [[Parcial 2Q2025]] pregunta 3 y [[Parcial 23-5-23 - Bases de Datos Avanzadas]] pregunta 1 usan
  **el mismo enunciado** (*"Suponga que tiene una base de datos distribuida en varios nodos y todos
  los nodos aceptan lecturas y escrituras"*), de dos materias distintas. Respuesta en las tres: **AP**
  — se prioriza disponibilidad y tolerancia a particiones, sacrificando consistencia inmediata.
- **CAP por motor: MongoDB no es AP; MySQL y Neo4j son CA.** ★★ [[Recuperatorio 1Q2026]] pregunta 17
  y [[Parcial 2Q2025]] pregunta 10, idénticas (*"MongoDB es AP según el teorema CAP"*: Falso, es CP
  en el slide 18 de la Clase 12). ★★ [[Recuperatorio 1Q2026]] pregunta 26 y [[Parcial 2Q2025]]
  pregunta 13, idénticas salvo el orden de las opciones: clave MySQL y Neo4j. Neo4j no está en el
  slide 18; la clave sigue a *Seven Databases* 2ª ed. apéndice A2 (impresa 317). El
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 3 pide la clasificación de Neo4j a desarrollar.
- **Persistencia políglota vs. programación políglota.** ★★ [[Parcial 1Q2026]] pregunta 6,
  [[Parcial 2Q2025]] pregunta 5 y [[Parcial 23-5-23 - Bases de Datos Avanzadas]] pregunta 3 son el
  mismo ejercicio de emparejar definición con término. Respuesta: usar distintos motores según la
  necesidad de cada parte de una aplicación = persistencia políglota; codificar en distintos lenguajes
  = programación políglota. El alumno del 1C-26 cometió el mismo error que el del 2Q2025: eligió
  "Programación múltiple" para el ítem 2 (1,5/3 en los dos).
- **Replicación vs. sharding, opción múltiple idéntica.** ★★ [[Parcial 1Q2026]] pregunta 15,
  [[Parcial 2Q2025]] pregunta 21 y [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 9, iguales salvo el
  orden de las opciones. Respuesta: "la replicación busca garantizar que siempre haya copias de los
  datos disponibles, mientras que el sharding permite escalar" (C en el 1C-26, B en los otros dos). El
  alumno del 1C-26 eligió "persiguen exactamente lo mismo" (0/2).
- **Índice por defecto de MongoDB.** ★★ [[Parcial 1Q2026]] pregunta 9 (5 puntos),
  [[Parcial 2Q2025]] pregunta 9 y [[Parcial 23-5-23 - Bases de Datos Avanzadas]] pregunta 32 preguntan
  lo mismo casi palabra por palabra (tipo de índice, si hay uno por defecto, sobre qué campo).
  Respuesta: **B-Tree, sí, sobre `_id`**, verificado con `getIndexes()` en MongoDB 8.3.11. Las
  letras cambian entre instancias (F en el 1C-26, A en el 2Q2025): conviene recordar el texto.
- **Modelo embebido vs. referencias: ventajas y desventajas.** ★★ [[Parcial 1Q2026]] pregunta 20 y
  [[Parcial 2Q2025]] pregunta 31, idénticas (ensayo de 6 puntos). Respuesta: las dos columnas
  (lectura en una sola consulta y escritura atómica, frente a duplicación y el techo de 16 MB por
  documento) más el criterio de cuándo embeber. El alumno del 1C-26 dio una sola ventaja (1/6); el
  del 2Q2025 sacó 4/6.
- **Interpretar un `aggregate` sobre `orders` (`$match` + `$group`).** ★★ [[Parcial 1Q2026]]
  pregunta 27 (filtra `size` y `status`, agrupa por `type`), [[Parcial 2Q2025]] pregunta 15 y
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 10a (estas dos, idénticas: filtran
  `payment_method: "cash"` y agrupan por `order_date`): el mismo molde con otro filtro. Respuesta:
  filtra, agrupa y suma `quantity` por grupo; equivale a un `SELECT … WHERE … GROUP BY`.
- **Contar por grupo y ordenar de mayor a menor en MongoDB.** ★★ [[Parcial 1Q2026]] pregunta 28
  (proyectos por investigador), [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 10b y
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 7 (estas dos, idénticas:
  `SELECT tipo, COUNT(*) FROM hospitales GROUP BY tipo ORDER BY COUNT(*) DESC`). Respuesta:
  `$group: { _id: "$campo", cantidad: { $sum: 1 } }` → `$sort: { cantidad: -1 }`, sobre el nombre
  exacto de la colección. Las tres respuestas de estudiantes fallan en algo: una consulta la colección
  inexistente `hospitals` (devuelve vacío sin error), otra escribe `_id='tipo'` y `$sort: -1`, y la del
  1C-26 usa `db.proyectos` por `Proyectos` (4/5). Un escalón más arriba, ★★ [[Recuperatorio 1Q2026]]
  pregunta 13 pide traducir un `JOIN … ORDER BY` de dos columnas: `$lookup` + `$unwind` + `$sort` con
  dos claves, primera vez en un examen del vault.
- **MapReduce en V/F.** ★★ [[Parcial 1Q2026]] preguntas 8 y 17 y ★★ [[Recuperatorio 1Q2026]]
  preguntas 16 y 15, idénticas de a pares: *"Map-Reduce procesa datos en paralelo"* y *"La función map
  de Map-Reduce, genera pares clave-valor"*, Verdadero las dos. El alumno falló la del paralelismo en
  el parcial y la acertó en el recuperatorio. La P14 del recuperatorio agrega que MongoDB **no**
  recomienda MapReduce (deprecado desde 5.0), y la P6 del [[Parcial 2Q2025]] pedía escribir un
  `mapReduce` (mismo tema, otro formato).
- **Cassandra: componentes del nodo, master-slave y la SSTable.** ★★ [[Parcial 1Q2026]] pregunta 26 =
  [[Parcial 2Q2025]] pregunta 8 (componentes: commit log, MemTable y SSTable); ★★
  [[Recuperatorio 1Q2026]] pregunta 35 = [[Parcial 2Q2025]] pregunta 14 (la SSTable **no** está en
  memoria); ★★ [[Parcial 1Q2026]] pregunta 24 = [[Parcial 2Q2025]] pregunta 28 (*"La arquitectura de
  Cassandra es Master-Slave"*, Falso), que reaparece negada como inciso d del Ejercicio 8 del
  [[Parcial XC-202X|Parcial XC-202X]] (*"Cassandra no utiliza el mecanismo de master-slave"*,
  Verdadero); el Ejercicio 7 del XC-202X pide dibujar el nodo. Conceptos:
  [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]]
  y [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]].
- **Cassandra: terminología tabular vs. RDBMS.** ★★ [[Recuperatorio 1Q2026]] pregunta 34 =
  [[Parcial 2Q2025]] pregunta 7 (coincidencia): keyspace = base de datos, column family = tabla, fila,
  columna, cluster = instancia (Clase 15, slide 4) →
  [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Bases de datos tabulares]].
- **Cassandra: partition key y clustering key.** ★★ [[Parcial 1Q2026]] pregunta 7 (ensayo de 5
  puntos: qué función cumple cada una) y [[Parcial 2Q2025]] pregunta 29 (ensayo de 6: cómo se
  constituye la PK, con ejemplos). Respuesta: la partition key distribuye las filas entre nodos (por
  el token) y la clustering key las ordena dentro de la partición. Los dos alumnos sacaron 0 →
  [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]].
- **Cassandra: la tabla `blogs` y el `WHERE` sin la partition key completa.** ★★ [[Parcial 1Q2026]]
  pregunta 34 y [[Parcial 2Q2025]] pregunta 23: misma tabla y misma consulta
  (`WHERE time1 = 1418306451235`), varias correctas con crédito negativo. En 2025 la PK es
  `(blogId, time1, time2)` y una opción ofrece `ALLOW FILTERING` (clave B, C y D); en 2026 es
  `((blogId, time1), time2)` y la opción nueva es el motivo del error, *"impredecible la performance"*
  (clave C, D y E). Los dos alumnos marcaron solo parte de la clave (0,99/3 y 1,99/3). (atención) El
  literal no entra en un `int`: Cassandra 5.0.9 falla antes con `Unable to make int from
  '1418306451235'`.
- **Cassandra: QUORUM y niveles de consistencia, en tres escalones.** [[Parcial 2Q2025]] pregunta 26
  (la fórmula, `(rf/2)+1`), ★★ [[Parcial 1Q2026]] pregunta 14 (RF 5: cuántas réplicas confirman, si
  hay consistencia fuerte, qué pasa con datos viejos y qué los repara; ensayo de 8 puntos) y ★★
  [[Recuperatorio 1Q2026]] pregunta 36 (niveles de escritura válidos). El
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 8b pregunta si el nivel se elige por consulta →
  [[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]].
- **Cassandra: `CREATE KEYSPACE`.** ★★ [[Parcial 1Q2026]] pregunta 31 =
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 9. Respuesta:
  `CREATE KEYSPACE nombre WITH replication = {'class': 'SimpleStrategy', 'replication_factor': N};`,
  con `=` antes del mapa →
  [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]].

### Con el 1C-26, de Neo4j y Redis (recuperatorio del 03/11 y final)

- **Tabla de posiciones de un videojuego con `UserID` y `Score` → Redis.** ★★
  [[Recuperatorio 1Q2026]] pregunta 25 (1.000.000 transacciones/s, opción múltiple de 4 puntos) y
  [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]] pregunta 10 (100.000
  transacciones/s), casi textuales: clave **Redis** en las dos (*sorted sets* en memoria). El
  [[Final 1Jul2025]] pregunta 4 (10⁹ escrituras/s, desarrollo; copiada en [[Repaso Final BD 2]]
  Ejercicio 24) no habla de tabla de posiciones: allí la copia larga responde Cassandra y la corta
  Redis, y el vault sostiene Cassandra porque el peso está en la escritura. El [[Parcial 2Q2020]]
  (pregunta V) pide el mismo leaderboard como práctico con un *sorted set*. *(Redis se dicta el
  26/10)*
- **Redis Sentinel.** ★★ [[Recuperatorio 1Q2026]] preguntas 30 a 32, [[Final 1Jul2025]] pregunta 6 y
  [[Final 1Dic2023]] pregunta 5 son las mismas tres afirmaciones V/F, copiadas además en
  [[Repaso Final BD 2]] Ejercicio 26 (el Ejercicio 9 del Repaso pide leer sobre Sentinel, sin los
  incisos). Respuesta: proveedor de configuración (Verdadero), monitorea masters y réplicas
  (Verdadero), el failover lo inicia un administrador (Falso: es automático, por mayoría de
  Sentinels). El alumno del recuperatorio falló dos de las tres.
- **Redis: tres títulos con un solo comando.** ★★ [[Recuperatorio 1Q2026]] pregunta 29 =
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 5 (que agrega la clasificación CAP). Respuesta:
  `MSET pelicula:1 … pelicula:2 … pelicula:3 …`, o `SADD`/`RPUSH` con los tres títulos. Mismo tema,
  otro molde: persistencia (★★ [[Recuperatorio 1Q2026]] pregunta 28, valores de `appendfsync`;
  [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 6, RDB vs. AOF).
- **Neo4j HA: qué ve el tercer nodo.** ★★ [[Recuperatorio 1Q2026]] pregunta 20 = [[Parcial 2Q2025]]
  pregunta 4: los dos nodos creados, con la salvedad de que el clúster es eventualmente consistente.
- **Cypher a lenguaje natural (`ACTED_IN`, títulos con "T").** ★★ [[Recuperatorio 1Q2026]]
  pregunta 21 = [[Parcial 2Q2025]] pregunta 22.
- **Cypher: amigos de amigos.** [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 4 y
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 8 traen la misma
  consulta de amigos a dos o tres saltos de Mary para leer; ★★ [[Recuperatorio 1Q2026]] pregunta 24
  pide escribirla (*"amigos de amigos de 'Ana'"*: el descuento fue por no filtrar a Ana), y
  [[Parcial 2Q2025]] pregunta 22 pide otra traducción a lenguaje natural.
- **Neo4j: restricción de unicidad en Cypher.** ★★ [[Recuperatorio 1Q2026]] pregunta 22,
  [[Parcial 2Q2025]] pregunta 20 y [[Parcial XC-202X|Parcial XC-202X]] Ejercicio 3 (junto con la
  clasificación CAP). Respuesta: `CREATE CONSTRAINT … FOR (n:Label) REQUIRE n.prop IS UNIQUE`; en el
  recuperatorio la cátedra aceptó la forma del libro, `ON … ASSERT`, eliminada en Neo4j 5.0.
- **Neo4j: coordinación de nodos delegada en una herramienta externa.** ★★ [[Parcial 1Q2026]]
  pregunta 16 = [[Parcial 2Q2025]] pregunta 33: Neo4j (el HA clásico, con ZooKeeper).
- **Neo4j: relaciones con dirección y propiedades.** ★★ [[Parcial 1Q2026]] pregunta 18 (*"las
  relaciones son bidireccionales por defecto y no pueden tener propiedades"*: Falso) y ★★
  [[Recuperatorio 1Q2026]] pregunta 19 (se crean con dirección y se consultan en ambos sentidos:
  Verdadero): las dos caras de la misma regla.

### Sin el 1C-26

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
  Apache Cassandra: Corbellini no nombra la compactación) — no Redis ni DynamoDB. El contraste con la
  tabla de posiciones del recuperatorio 1C-26 está en la sección anterior.
- **`COALESCE` sobre la jerarquía `OBRA_PRIVADA`/`OBRA_CIVIL`.** [[Parcial 2Q-2023|Parcial 2Q-2023]]
  Ejercicio 1B (obras con supervisor) y [[Parcial 2Q2025]] pregunta 16 (obras en ejecución).
  Respuesta: dos `LEFT JOIN` a las tablas hijas y `COALESCE(arquitecto, ingeniero_resp)`. El
  Ejercicio 2B de [[Práctica subida por la cátedra|Práctica subida por la cátedra]] aplica el mismo
  patrón a `Audio`/`Imagen`.
- **Vistas sobre Investigadores con `HAVING COUNT(DISTINCT …) >= 3`.**
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 1 y
  [[Repaso Final BD 2]] Ejercicio 20 son la misma consigna (incisos A, B y C). (atención) Las dos
  resoluciones del vault difieren en C: la del Repaso usa `JOIN`; la de la práctica, `LEFT JOIN` con la
  fecha en el `ON`, porque la consigna pide *"todos los investigadores"*.
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

## Trampas recurrentes

### Las del 1C-26

- **El orden del par `[baja, modificación]`.** ★★ [[Parcial 1Q2026]] pregunta 10: con R2
  `[restrict, cascade]`, el `DELETE` de una carrera referenciada no procede, porque ante **baja** la
  acción es `restrict` (`ERROR 1451`); el alumno leyó el `cascade`, que es la acción ante
  modificación, y respondió "Procede" (0/2). Para cada RIR: ¿la operación toca la tabla referenciada?,
  ¿hay filas que la referencian?, ¿cuál es la acción de **esa** operación en el par? Concepto:
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]].
- **Unicidad de la PK disfrazada de RIR.** ★★ [[Parcial 1Q2026]] pregunta 19 y [[Parcial 2Q2025]]
  pregunta 17: el `UPDATE Carrera SET idFac='F1' WHERE idFac='F2'` parece violar una regla de
  integridad referencial, pero falla por unicidad de la clave primaria compuesta (verificado:
  `ERROR 1062`, no un error de FK). Enunciados con dos RIR definidas invitan a responder "no procede
  por RIR", y así cayeron el alumno del 1C-26 (R1) y el del 2Q2025 (R2); en el
  [[Parcial XC-202X|Parcial XC-202X]] (Ejercicio 2b) y en el [[Parcial 2Q-2023|Parcial 2Q-2023]]
  (Ejercicio 8.2), los estudiantes respondieron que procede en cascada. Antes de mirar las RIR,
  verificar la PK y los `UNIQUE` de la tabla que se modifica. Concepto:
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]].
- **El umbral sobre un total va en `HAVING`, no en `WHERE`.** ★★ [[Parcial 1Q2026]] pregunta 22:
  *"el monto total de los presupuestos de dichas obras, sólo si superan el medio millón"* pide
  `HAVING SUM(e.presupuesto) > 500000`. El `WHERE e.presupuesto > 500000` del alumno descarta obras
  antes de agrupar y cambia las dos cifras: en la corrida en MySQL 9.7.2, su vista pierde a un
  constructor con dos obras de 300.000 y le informa a otro una obra y 600.000 en lugar de dos y
  700.000 (4/6). Conceptos: [[1.05.01 - SQL — consultas|SQL — consultas]] ·
  [[1.06.01 - Vistas|Vistas]].
- **Nombrar la anomalía con el vocabulario de concurrencia.** ★★ [[Parcial 1Q2026]] pregunta 23: si la
  misma consulta, repetida dentro de una transacción, devuelve un **conjunto** de filas distinto porque
  otra insertó y confirmó en el medio, es un *phantom read*, y lo evita `SERIALIZABLE`. "Anomalía de
  inserción" es un término de normalización y valió 0/6; además faltó escribir la sentencia
  `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`. (atención) En InnoDB, `REPEATABLE READ` (el default)
  ya evita ese fantasma en lecturas comunes (corrido en MySQL 9.7.2 con dos sesiones); la respuesta de
  examen es la del estándar y la del docente. Concepto:
  [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]].
- **Un `CHECK` agregado con `ALTER TABLE` valida lo existente.** ★★ [[Parcial 1Q2026]] pregunta 12: si
  una fila ya cargada viola la condición, el `ALTER` falla con `ERROR 3819` y la restricción no se
  crea (MySQL 9.7.2); solo `NOT ENFORCED` lo evita, y entonces tampoco controla lo nuevo. El tipo es
  `CHECK` de registro o tupla, no "de inserción": controla cada `INSERT` y cada `UPDATE` (2/6).
  Concepto: [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]].
- **La clave compuesta olvidada en una subconsulta correlacionada.** ★★ [[Recuperatorio 1Q2026]]
  pregunta 1: la PK de `USUARIO` es `(nroUsuario, zona)` (entidad débil de `ZONA`), y la subconsulta
  correlaciona solo por `nroUsuario`; un usuario queda excluido por el descuento de **otro** usuario
  con el mismo número en otra zona (corrido en MySQL 9.7.2). La afirmación *"se ha considerado
  erróneamente el identificador de usuario"* era correcta; el alumno respondió "Incorrecto" (0/2).
  Mirar la PK en el DER antes de evaluar la correlación. Conceptos:
  [[1.05.01 - SQL — consultas|SQL — consultas]] ·
  [[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]].
- **La clave de la plataforma puede estar mal.** ★★ [[Recuperatorio 1Q2026]] pregunta 6: la clave
  automática decía "Procede" para un `INSERT` de `'EURO'` por la vista `CASCADED`, que MySQL 9.7.2
  rechaza (`ERROR 1369`); el docente la corrigió a mano. Ante una discrepancia, la corrida en el motor
  y la pregunta gemela del [[Parcial 2Q2025]] (P1, con la clave correcta) son el argumento del reclamo.
- **Nombres de colección con mayúscula.** ★★ [[Parcial 1Q2026]] pregunta 28: la colección es
  `Proyectos`; `db.proyectos` es otra, vacía, y el `aggregate` devuelve `[]` sin error (MongoDB
  8.3.11). Es con toda probabilidad el punto que se descontó (4/5). Lo mismo pasa con los nombres de
  tabla en MySQL sobre Linux (`lower_case_table_names = 0`). Concepto:
  [[2.12.08 - Aggregation pipeline|Aggregation pipeline]].
- **`$lookup`, `$unwind` y `$sort` bien escritos.** ★★ [[Recuperatorio 1Q2026]] pregunta 13 (3/6,
  *"Era lookup. Falta la tabla para joinear. Sort incorrecto."*): `$lookup` lleva `from`,
  `localField`, `foreignField` y `as`, sin `$` en las opciones; `$unwind` recibe `"$<as>"`; `$sort` es
  un documento (`{ a: 1, b: -1 }`), nunca `-1` solo (`the $sort key specification must be an object`,
  MongoDB 8.3.11). El mismo `$sort: -1` aparece en
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 7. Concepto:
  [[2.12.08 - Aggregation pipeline|Aggregation pipeline]].
- **`=` en `CREATE KEYSPACE`.** ★★ [[Parcial 1Q2026]] pregunta 31: la forma es `WITH replication =
  { 'class': …, 'replication_factor': N }`; con dos puntos (`replication :`), Cassandra 5.0.9 responde
  `SyntaxException … no viable alternative at input ':'`. La corrección manual la aceptó (3/3), pero
  conviene escribir la que compila. Concepto:
  [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]].
- **La partition key compuesta se da completa en el `WHERE`.** ★★ [[Parcial 1Q2026]] pregunta 34: con
  `PRIMARY KEY ((blogId, time1), time2)`, filtrar solo por `time1` (o solo por `blogId`) falla con el
  mensaje *"… may have unpredictable performance … use ALLOW FILTERING"* (Cassandra 5.0.9), y esa
  opción, la D, también era correcta: el alumno marcó C y E y sacó 1,99/3. Concepto:
  [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]].
- **Distractores con crédito negativo.** ★★ [[Recuperatorio 1Q2026]] preguntas 28 (`everyminutes`,
  −50 %: 0,49/3) y 36 (`Global Quorum`, −20 %: 0,89/3). En las de varias correctas, una opción dudosa
  sin marcar cuesta menos que una marcada mal; `NONE` y `GLOBAL_QUORUM` no existen en Cassandra
  (`Improper CONSISTENCY command` en cqlsh 5.0.9). Concepto:
  [[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]].
- **"Tabla de posiciones" → Redis; "escritura masiva" → Cassandra.** ★★ [[Recuperatorio 1Q2026]]
  pregunta 25: para un ranking de `UserID` y `Score` con 1.000.000 de transacciones por segundo la
  clave es Redis (*sorted sets*); el alumno eligió MongoDB (0/4). Cassandra ordena solo dentro de una
  partición, así que no sirve para un ranking global; sí para escritura masiva sin ranking
  ([[Final 1Jul2025]] pregunta 4, [[Final 1Dic2025]] pregunta 5). Lo que decide es el patrón de
  acceso, no solo el volumen. Concepto:
  [[2.12.03 - Persistencia políglota|Persistencia políglota]].

### De los demás exámenes

- **`WITH LOCAL CHECK OPTION` vs. `WITH CASCADED CHECK OPTION` en una cadena de vistas.**
  [[Parcial 2Q2025]] preguntas [[Parcial 2Q2025#Pregunta 1 — vistas con `WITH CHECK OPTION` en cadena (Opción Múltiple)|1]]
  y [[Parcial 2Q2025#Pregunta 18 — `WITH LOCAL CHECK OPTION` con una vista base que no se cumple (Opción Múltiple)|18]]
  reutilizan la misma cadena de tres vistas y solo cambian la vista destino del `INSERT`; la cadena
  vuelve en ★★ [[Parcial 1Q2026]] preguntas 4, 5 y 30 y ★★ [[Recuperatorio 1Q2026]] preguntas 5 y 6.
  Concepto: [[1.06.01 - Vistas|Vistas]]. `CASCADED` (el default) chequea toda la cadena; `LOCAL` chequea
  la condición propia **más** las de las vistas subyacentes que tengan su propio `WITH CHECK OPTION` — si
  la subyacente no tiene WCO propio, `LOCAL` no tiene nada que propagarle. Verificado con corridas
  reales en MySQL 9.7.2. El [[Parcial XC-202X|Parcial XC-202X]] (Ejercicio 1) pide la misma cadena
  como desarrollo; su inciso e muestra el error típico de justificación: invocar el `CASCADED` de una
  vista por la que la sentencia no pasa.
- **Acciones referenciales con FK compuesta y un componente `NULL` (`MATCH simple`).**
  [[Parcial 2Q2025#Pregunta 19 — `INSERT` en `Materia` con un componente `NULL` (Opción Múltiple)|Pregunta 19]]
  del [[Parcial 2Q2025]], ★★ [[Parcial 1Q2026]] pregunta 21, el inciso c del Ejercicio 2 del
  [[Parcial XC-202X|Parcial XC-202X]] y el 8.3 del [[Parcial 2Q-2023|Parcial 2Q-2023]]. Concepto:
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]]. Con
  `MATCH simple` (el único que MySQL implementa: acepta `MATCH FULL`/`PARTIAL` sin
  error ni warning, pero los ignora; verificado en MySQL 9.7.2), basta
  con que **un** componente de la FK compuesta sea `NULL` para que la referencia se dé por satisfecha,
  sin verificar si el resto existe en la tabla referenciada. En el 1C-26 la opción *"Procede si la FK
  se declaró con MATCH simple"* es la clave, aunque en MySQL también sería cierta la opción "Procede".
- **La clasificación CAP de un motor depende de qué fuente se use, y las fuentes discrepan.**
  MongoDB: el deck de la cátedra lo marca CP y Corbellini lo marca distinto según la tabla — ver
  [[Parcial 2Q2025#Pregunta 10 — ¿MongoDB es AP? (Verdadero/Falso)|Pregunta 10]] del
  [[Parcial 2Q2025]]. Neo4j: el mismo slide 18 no lo incluye en ninguna columna, pero
  [[Parcial 2Q2025#Pregunta 13 — bases de datos en configuración CA (Opción Múltiple, varias correctas)|Pregunta 13]]
  lo evalúa como CA, y *Seven Databases* 2ª ed. se contradice a sí mismo entre el apéndice (CA) y el
  capítulo 6 (Neo4j HA como AP). Redis: en disputa entre el deck (CP), Corbellini (AP) y *Seven
  Databases* (CA), sin resolver — ver [[Repaso Final BD 2]] Ejercicio 12. Concepto:
  [[2.12.04 - Teorema CAP|Teorema CAP]]. La apuesta más segura para el parcial es la clasificación
  textual del slide 18 de la Clase 12, cuando el motor esté en ese slide; para Neo4j, la clave de la
  plataforma es CA en el 2Q2025 y en el ★★ [[Recuperatorio 1Q2026]] (pregunta 26).
- **`EXPLAIN` vs. `EXPLAIN ANALYZE`: cuál ejecuta la sentencia.**
  [[Parcial 2Q2025#Pregunta 2 — `EXPLAIN ANALYZE` en MySQL (Verdadero/Falso)|Pregunta 2]] del
  [[Parcial 2Q2025]] y ★★ [[Parcial 1Q2026]] pregunta 1 (MySQL), y la pregunta 17 del
  [[Parcial 23-5-23 - Bases de Datos Avanzadas]] (PostgreSQL). Concepto:
  [[1.08.01 - Plan de ejecución|Plan de ejecución]]. `EXPLAIN` solo, no
  ejecuta; `EXPLAIN ANALYZE` sí ejecuta la sentencia de verdad — con la advertencia de que en
  PostgreSQL un `EXPLAIN ANALYZE DELETE …` borra datos reales (MySQL 9.7.2 no admite `EXPLAIN ANALYZE`
  sobre un `DELETE` de una sola tabla y no borra nada). El [[Parcial 2Q-2023|Parcial 2Q-2023]]
  (Ejercicio 7) pregunta además si muestra el tiempo de planificación: sí en PostgreSQL; MySQL 9.7.2 da
  `actual time` por iterador, sin un tiempo de planificación separado.
- **Índice HASH para igualdad pura: correcto en teoría, no ejecutable en InnoDB.**
  [[Final 1Jul2025#Pregunta 1 — índice para el login en MySQL|Pregunta 1]] del [[Final 1Jul2025]] y
  ★★ [[Recuperatorio 1Q2026]] pregunta 7 (allí la clave es Hash y el alumno eligió B-Tree, 0/2).
  Concepto: [[1.08.02 - Índices|Índices]]. `CREATE INDEX … USING HASH` no da error en una tabla
  InnoDB: emite la nota 3502 (*"This storage engine does not support the HASH index algorithm,
  storage engine default was used instead."*, visible con `SHOW WARNINGS`) y crea un B-tree
  (`INDEX_TYPE = BTREE`, verificado en MySQL 9.7.2); el índice HASH real solo existe con
  `ENGINE=MEMORY`. En opción múltiple, manda la clave: Hash.
- **El shell legado de MongoDB (`mongo`) y `.save()` ya no existen en `mongosh`.**
  Ejercicios II.a y II.c del [[Parcial 2Q2020]]. Concepto:
  [[2.14.01 - mongosh y herramientas de línea de comando|mongosh y herramientas de línea de comando]].
  Cualquier resolución de examen
  viejo con `mongo <db>` o `db.collection.save(doc)` hay que traducirla a `mongosh` y a
  `updateOne`/`replaceOne` antes de repetirla — verificado con `TypeError` real en MongoDB 8.3.11.
- **Vista con agregación: parece consultable, no es actualizable.**
  [[Parcial 2Q2025#Pregunta 27 — vista `ConstructorVIP` con agregación: ¿es actualizable? (Ensayo)|Pregunta 27]]
  del [[Parcial 2Q2025]], ★★ [[Parcial 1Q2026]] pregunta 22 y la pregunta 30 del
  [[Parcial 23-5-23 - Bases de Datos Avanzadas]] (¿siempre se puede `UPDATE`/`INSERT`/`DELETE` sobre
  una vista?). Concepto: [[1.06.01 - Vistas|Vistas]]. Una
  vista con `GROUP BY` + funciones de agregación no preserva la clave primaria de la tabla base: MySQL
  rechaza el `INSERT` como no insertable (`ERROR 1471`) y el `UPDATE` o el `DELETE` como no
  actualizable (`ERROR 1288`), aunque el `SELECT` funcione sin problema. Reaparece en el
  [[Parcial 2Q-2023|Parcial 2Q-2023]] (Ejercicio 4B) y en la
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] (Ejercicio 1), donde la vista
  definida sobre otra con agregación hereda la no actualizabilidad. La razón principal es la
  agregación: una vista de `JOIN` sin agregación es actualizable en MySQL 9.7.2 para `UPDATE` e
  `INSERT` sobre una sola tabla, aunque la Clase 07 (slide 13) liste los ensambles entre las causas
  (corrida en [[Parcial 1Q2026]] § *Pregunta 22*).
- **`NULL` dentro de un `NOT IN`.** [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicios 9 (opción B) y 10, y
  ★★ [[Recuperatorio 1Q2026]] pregunta 4 (el mismo Ejercicio 10, ahora en MySQL): con un solo `NULL`
  en la subconsulta, `NOT IN` no devuelve ninguna fila; `NOT EXISTS` no tiene ese problema. En el
  mismo Ejercicio 9, la opción E (`id_director <> null`) descarta todo: los nulos se testean con
  `IS [NOT] NULL`. Concepto: [[1.05.01 - SQL — consultas|SQL — consultas]]. Verificado en MySQL 9.7.2.
- **Agregados sobre una columna toda `NULL`.**
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicio 3: `SUM` devuelve `NULL`,
  no 0; `COUNT(col)` da 0 y `COUNT(*)` cuenta filas. Concepto:
  [[1.05.01 - SQL — consultas|SQL — consultas]]. Verificado en MySQL 9.7.2.
- **El filtro de un `LEFT JOIN` puesto en el `WHERE`.**
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] Ejercicios 1C y 2A: en el `WHERE`,
  el filtro sobre la tabla opcional elimina las filas sin coincidencia y el `LEFT JOIN` vuelve a ser un
  `JOIN`; "todos" y "a lo sumo 3" piden el filtro en el `ON`. La otra cara, en ★★
  [[Recuperatorio 1Q2026]] pregunta 2: con `descuento > 0` en el `WHERE`, un ensamble externo entre
  `asignacion` y `plan_empr` no cambia el resultado, así que no hace falta. Concepto:
  [[1.05.01 - SQL — consultas|SQL — consultas]].
- **Restricción global vs. restricción de tabla.** [[Parcial 2Q-2023|Parcial 2Q-2023]] Ejercicio 4A
  y ★★ [[Recuperatorio 1Q2026]] pregunta 3 (la condición cruza dos tablas: `ASSERTION`) frente a
  [[Parcial 2Q2025]] pregunta 24 y ★★ [[Recuperatorio 1Q2026]] pregunta 8 (varias filas de una sola
  tabla: `CHECK` con subconsulta en el estándar). En MySQL las dos terminan en triggers. Concepto:
  [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]].
- **Sintaxis de otro motor en el enunciado.** [[Parcial XC-202X|Parcial XC-202X]] (`to_date`),
  [[Parcial 2Q-2023|Parcial 2Q-2023]] (`GRANT … ON ES, ESJ`, `REVOKE … CASCADE`, tablas creadas "en
  PostgreSQL"), [[Práctica subida por la cátedra|Práctica subida por la cátedra]]
  (`INTERVAL '30 years'`) y el 1C-26, que dice "en MySQL" y usa `to_date` (★★ [[Parcial 1Q2026]]
  preguntas 4, 5 y 30; ★★ [[Recuperatorio 1Q2026]] preguntas 5 y 6) y `age()` (recuperatorio,
  pregunta 1): en MySQL 9.7.2 fallan o cambian (`ERROR 1305`). Hay que responder la teoría y, si se
  pide, dar la forma de MySQL → [[MySQL|MySQL]].
- **`$group` con `_id` sin `$`.** [[Práctica subida por la cátedra|Práctica subida por la cátedra]]
  Ejercicio 7: `_id: 'tipo'` agrupa todos los documentos en un único grupo con la cadena constante; la
  ruta de campo es `"$tipo"`. Concepto: [[2.12.08 - Aggregation pipeline|Aggregation pipeline]].
  Verificado en MongoDB 8.3.11.

## Qué estudiar para el parcial del 13/10/2026

El modelo es el ★★ [[Parcial 1Q2026]]: misma cátedra, misma plataforma, 100 puntos. Esta sección
cruza sus puntos, y los del ★★ [[Recuperatorio 1Q2026]], con la frecuencia del historial y con lo que
[[_cronograma]] confirma como dictado antes del 13/10. Hoy, 29/09/2026, está dictado hasta la
[[Clase 15 - Introduccion a Cassandra|Clase 15]] y la [[Práctica 2026-09-29]] (TP10 Parte I); Cassandra
sigue el 05/10 (*Conceptos teóricos de Cassandra*) y el 06/10 (TP10 Parte II), **antes** del parcial;
Neo4j llega el 19–20/10, Redis el 26–27/10 y DynamoDB el 02/11, todos **después**.

### Dónde se jugaron los puntos en el 1C-26

Puntos obtenidos por el alumno sobre los puntos en juego, por tema (suma de las pastillas de cada
página; en el recuperatorio, la P17 va con MongoDB y la P25, tabla de posiciones, con CAP y elección
de motor):

| Tema | ★★ Parcial 1Q2026 | ★★ Recuperatorio 1Q2026 | ¿Entra el 13/10? |
| --- | --- | --- | --- |
| Cassandra | 10,99 / **23** | 5,39 / 7,5 | ✓ |
| MongoDB (índices, MapReduce, aggregation, embebido) | 14 / **21** | 9 / 14 | ✓ |
| Vistas | 10 / 13 | 4 / 4 | ✓ |
| Transacciones y control de concurrencia | 2 / 8 | 8 / 8 | ✓ |
| `CHECK`, `ASSERTION` y triggers | 2 / 6 | 5 / 6 | ✓ |
| Integridad referencial | 2 / 6 | — | ✓ |
| Plan de ejecución e índices | 5 / 5 | 0 / 2 | ✓ |
| Privilegios | 5 / 5 | — | ✓ |
| SQL — consultas | — | 4 / 6 | ✓ |
| CAP, persistencia políglota, escalabilidad y elección de motor | 2,5 / 6 | 3 / 7 | ✓ (la tabla de posiciones del recuperatorio, 4 puntos, es de Redis) |
| Neo4j | 5 / 6 | 22 / 24 | ✗ (19/10) |
| Redis | — | 7,49 / 21,5 | ✗ (26/10) |
| No visible (P35) | 0 / 1 | — | — |
| **Total** | **58,49 / 100** (desaprobado) | **67,88 / 100** (nota 5) | |

**Qué decidió el desaprobado.** Al parcial le faltaron 1,51 puntos. Tres ensayos —la partition key y
la clustering key (P7, 0/5), el QUORUM con RF 5 (P14, 2/8) y el *phantom read* (P23, 0/6)— se llevaron
17 de sus 19 puntos: con la mitad de eso el examen quedaba aprobado. Los ensayos concentran el 70 % de
lo perdido. El recuperatorio se aprobó con nota 5 aunque Redis se llevó 18,01 de los 32,12 puntos
perdidos, contando la tabla de posiciones.

**Qué del 1C-26 no entra el 13/10.** Según [[_cronograma]], en 2026 2C Neo4j se dicta el 19/10 y Redis
el 26/10, después del parcial. Del parcial 1C-26 quedan fuera las cuatro preguntas de Neo4j (P16, P18,
P25 y P33: 6 puntos); en el 1C 2026 Neo4j sí entró al parcial. Del recuperatorio quedan fuera las siete
de Neo4j (P18–P24, 24 puntos) y las de Redis (P25 y P27–P33, 25,5 puntos). Las dos **pueden entrar al
recuperatorio del 03/11**, que cae después de ambas teóricas, como pasó en el recuperatorio 1C-26.
DynamoDB se dicta el 02/11, la víspera del recuperatorio, y el 1C-26 no la preguntó.

### Prioridad

- ★★★ **Cassandra** — el bloque más pesado del parcial 1C-26 (23 de 100 puntos, seis preguntas; el
  alumno perdió 12) y el segundo tema del historial (23 preguntas). Se evalúa: qué hace la partition
  key (distribuye) y qué hace la clustering key (ordena dentro de la partición)
  ([[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]]);
  QUORUM = ⌊RF/2⌋ + 1, consistencia fuerte si R + W > RF, *digest* y *read repair* para los datos
  viejos ([[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]],
  [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura]]);
  los componentes del nodo y la SSTable en disco; la arquitectura peer-to-peer
  ([[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura]]);
  `CREATE KEYSPACE` con `=` ([[3.15.03 - CQL y modelado orientado a consultas|CQL]]); el `WHERE` con
  la partition key completa y `ALLOW FILTERING`; los niveles de consistencia de escritura válidos y la
  terminología tabular
  ([[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Bases de datos tabulares]]).
  Los ensayos piden **justificar**: el docente descontó *"no responde a la consitencia"* a un "sí, ya
  que se utiliza QUORUM". Fuentes: [[Clase 15 - Introduccion a Cassandra|Clase 15]],
  [[Práctica 2026-09-29]], [[Cassandra]] y la teórica del 05/10; sin bibliografía obligatoria
  (Corbellini § 5 y la documentación oficial de Apache Cassandra).
- ★★★ **Transacciones y control de concurrencia** — 8 puntos en cada instancia del 1C-26 y siete de
  sus preguntas; el ensayo del *phantom read* (6 puntos, 0/6) pesó en el desaprobado. Anomalías
  (*dirty read*, *non-repeatable read*, *phantom read*, *lost update*), qué nivel de aislamiento evita
  cada una, la sentencia `SET TRANSACTION ISOLATION LEVEL …`, bloqueos S y X, y el objetivo del control
  de concurrencia. Los V/F se repiten casi textuales (ver *Preguntas que se repiten*) →
  [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]].
- ★★★ **MongoDB** — 21 puntos del parcial 1C-26 (el alumno perdió 7) y 14 del recuperatorio: índice
  por defecto (5 puntos), embebido vs. referencias (ensayo de 6), interpretar y escribir un `aggregate`
  (`$match`, `$group`, `$sort`; `$lookup` y `$unwind` en el recuperatorio) y MapReduce (paralelo,
  `map` emite pares, deprecado desde 5.0), con `mongosh` y no el shell legado. 18 preguntas en el
  historial.
- ★★★ **Vistas** — 13 puntos del parcial 1C-26: la cadena `MovimientoUSDT` (`LOCAL` vs. `CASCADED`,
  tres incisos), `ConstructorVIP` con `HAVING` y no actualizable, y la vista materializada (Verdadero
  en teoría; MySQL acepta la sintaxis sin materializar). 18 preguntas en el historial; la cadena
  `MovimientoUSDT` sola reaparece en cuatro exámenes.
- ★★ **Integridad referencial** — 6 puntos del parcial 1C-26, 4 perdidos: `Carrera`/`Materia`/
  `Facultad` aparece en cuatro exámenes con las mismas tres operaciones. Leer el par
  `[baja, modificación]`, verificar la PK antes que las RIR, `MATCH simple` con FK compuesta y un
  `NULL`.
- ★★ **`CHECK`, `ASSERTION` y triggers** — 6 puntos en cada instancia del 1C-26: el `CHECK` de tupla
  que valida lo existente, leer una `ASSERTION` nombrando la fila que viola y contra qué se compara, y
  la restricción de tabla (`CHECK` con subconsulta en el estándar, `TRIGGER` en MySQL).
- ★★ **Plan de ejecución e índices** — 5 puntos del parcial 1C-26 (el `EXPLAIN` de
  `materia`/`inscripto` vale 4) y 2 del recuperatorio (hash para el login): *Single-row index lookup* =
  PK o `UNIQUE`; `EXPLAIN` vs. `EXPLAIN ANALYZE`; hash vs. B-tree en InnoDB.
- ★★ **Privilegios** — un ensayo de 5 puntos en el parcial 1C-26 (la cadena U0–U3, que ya estaba en
  el 2Q2025 y el 2Q-2023): grafo de concesiones, `REVOKE … CASCADE` en el estándar (MySQL no lo
  tiene) y privilegios de una vista independientes de los de su tabla.
- ★★ **SQL — consultas** — 6 puntos del recuperatorio: subconsulta correlacionada con clave compuesta,
  ensamble externo innecesario y `NOT IN` con `NULL`; del historial, `<> NULL` frente a `IS NULL`,
  agregados sobre nulos, `LEFT JOIN` con el filtro en el `ON`, `COALESCE` sobre una jerarquía y
  `GROUP BY`/`HAVING` ([[Parcial 2Q-2023|Parcial 2Q-2023]] y
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]]).
- ★ **CAP, persistencia políglota, replicación y sharding** — 6 puntos del parcial 1C-26, 3,5 perdidos
  en definiciones (programación políglota, replicación vs. sharding). La clasificación del slide 18 de
  la Clase 12 (MySQL CA, MongoDB CP, Cassandra AP; Neo4j CA según la clave de la plataforma) y "todos
  los nodos escriben" = AP resuelven casi todo.
- Sin historial en los exámenes viejos, pero dictados antes del 13/10: SQL procedural, stored
  procedures y cursores ([[Clase 10 - Restricciones integridad-Parte 2|Clase 10]]), recovery con WAL
  y ARIES ([[Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL|Clase 11(B)]]) y seguridad y roles más allá
  de las cadenas de `GRANT`/`REVOKE`. Que no tengan preguntas registradas no los saca del parcial.
- *(no entra el 13/10; sí al recuperatorio del 03/11)* **Neo4j y Redis**: en el recuperatorio 1C-26
  sumaron 49,5 de 100 puntos (Neo4j 24, Redis 21,5 y la tabla de posiciones 4), y en el historial, 46
  preguntas del temario actual. Para el 03/11: Redis (*sorted sets* y `ZUNIONSTORE … WEIGHTS`, que valía
  7,5 puntos y quedó en blanco; Sentinel; `appendfsync`; `MSET`; tabla de posiciones) y Cypher (patrón
  con nodo intermedio, filtro por propiedad, unicidad con `FOR … REQUIRE`, HA). DynamoDB (02/11, 7
  preguntas en el historial) no apareció en el 1C-26.

### Cómo se juega el formato

- **Justificar con la regla** en los ensayos (R + W > RF, la PK compuesta, `HAVING` sobre el total): el
  docente descuenta la respuesta sin el porqué.
- **Responder todas las partes.** Un ítem en blanco vale 0: el d de la P14 del parcial y la P33 del
  recuperatorio (7,5 puntos) quedaron así.
- **En las de varias correctas, marcar solo lo seguro**: el crédito negativo castiga más el distractor
  marcado que la correcta omitida.
- **Escribir la sintaxis que compila** y el nombre exacto de tablas y colecciones: la corrección manual
  a veces lo perdona (P31 del parcial), pero no siempre: la P28 perdió, con toda probabilidad, un punto
  por `db.proyectos`.

## Dudas abiertas

- (ok) **Formato del parcial 2026.** El [[Parcial 1Q2026]] y el [[Recuperatorio 1Q2026]] documentan el
  de la cátedra actual (Blackboard, 35–36 preguntas, 100 puntos, ensayos corregidos a mano, 60 para el
  4, 2 h 30 min). Queda por confirmar que el 13/10 lo repita; [[_cronograma]] solo dice que es
  presencial.
- (abierto) **Condición de aprobación.** El encabezado habla del *"60% de las preguntas formuladas"* y
  la tabla, de puntaje; con puntajes distintos por pregunta no son lo mismo. Las páginas del 1C-26
  toman la tabla (60 puntos = 4).
- (abierto) **Qué ocupa el lugar de Neo4j el 13/10.** El parcial 1C-26 dedicó 6 puntos a Neo4j, que en
  2026 2C se dicta después. No hay fuente que diga si se reemplazan por Cassandra (con dos teóricas
  antes del parcial) o por la primera mitad.
- (abierto) **Qué entra al recuperatorio del 03/11.** El recuperatorio 1C-26 incluyó Neo4j y Redis; en
  2026 2C los dos se dictan antes del 03/11, y DynamoDB la víspera. Es plausible que entren, pero
  ninguna fuente lo confirma.
- (abierto) **Qué mira la corrección manual.** La P31 del parcial recibió 3/3 con un `CREATE KEYSPACE`
  que Cassandra rechaza, y la P29 del recuperatorio, 3/3 con un `MSET` de siete argumentos: no se sabe
  si el docente corrige la idea o la sintaxis exacta.
- (ok) **¿`REPEATABLE READ` evita el *phantom read*?** El docente corrigió la P23 del
  [[Parcial 1Q2026]] con el estándar (*"phantom read/serializable"*): el fantasma lo evita
  `SERIALIZABLE`. Que InnoDB lo evite en `REPEATABLE READ` para lecturas consistentes es una aclaración
  de motor ([[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]]
  § 6.2), no la respuesta de examen.
- (abierto) **Vista con `JOIN`: ¿actualizable?** En MySQL 9.7.2 una vista de ensamble sin agregación
  es actualizable para `UPDATE` e `INSERT` sobre una sola tabla; el `JOIN` impide el `DELETE` y las
  escrituras en dos tablas ([[1.06.01 - Vistas|Vistas]] § *Tabla de decisión*). Falta saber qué
  criterio corrige la cátedra: en la P22 del [[Parcial 1Q2026]], *"no es actualizable ya que tiene
  JOINs y GROUP BY"* sacó 4/6 sin comentario.
- (abierto) La Pregunta 35 del [[Parcial 1Q2026]] no está fotografiada: falta un punto del mapa.
- (ok, para el examen) **Neo4j en CAP.** El slide 18 de la Clase 12 —la fuente que el vault documenta
  como "la clasificación CAP que toma el parcial"— no incluye a Neo4j, pero la clave de la plataforma
  lo toma como CA en dos instancias idénticas ([[Parcial 2Q2025]] pregunta 13 y
  [[Recuperatorio 1Q2026]] pregunta 26), siguiendo a *Seven Databases* apéndice A2. La tensión de la
  bibliografía (el mismo libro pone a Neo4j HA en AP, cap. 6) sigue en
  [[2.12.04 - Teorema CAP|Teorema CAP]]. El criterio de estudiante del
  [[Parcial XC-202X|Parcial XC-202X]] (Ejercicio 3), con un caso CP, no tiene respaldo en la
  bibliografía del vault.
- (abierto) La clasificación CAP de Redis sigue en disputa entre tres fuentes del propio vault (CP el
  deck, AP el paper de Corbellini, CA *Seven Databases*) — ver [[2.12.04 - Teorema CAP|Teorema CAP]] §
  *Dudas abiertas*. El [[Parcial XC-202X|Parcial XC-202X]] (Ejercicio 5) la pregunta y el estudiante la
  deja sin resolver (*"No entra"*); el 1C-26 no la pregunta.
- (ok) **Cassandra: ¿definición o razonamiento?** La cátedra actual pregunta las dos cosas: definición
  en V/F y opción múltiple (master-slave, componentes, terminología, niveles válidos) y razonamiento
  aplicado en ensayos y en varias correctas (QUORUM con RF 5, 8 puntos; función de la partition key y
  de la clustering key; la consulta de `blogs` sin la partition key completa).
- (ok) [[Clase 06 - Vistas-Parte 1]], [[Práctica 2026-08-11]] y
  [[Clase 09 - Restricciones integridad-Parte 1]] llevan la nota de evidencia del [[Parcial 2Q2025]].
  El comportamiento de `LOCAL CHECK OPTION` y de `MATCH` se verificó en MySQL 9.7.2; qué entra al
  parcial 2026 sigue abierto en esas páginas.

## Enlaces

[[Parcial 1Q2026]] · [[Recuperatorio 1Q2026]] · [[Parcial 2Q2025]] · [[Final 1Jul2025]] ·
[[Final 1Dic2023]] · [[Final 1Dic2025]] · [[Repaso Final BD 2]] · [[Parcial XC-202X|Parcial XC-202X]] ·
[[Parcial 2Q-2023|Parcial 2Q-2023]] ·
[[Práctica subida por la cátedra|Práctica subida por la cátedra]] · [[Parcial 1Q2020]] · [[Parcial 2Q2020]] · [[Recuperatorio 2Q2020]] ·
[[Parcial 1Q2021]] · [[Parcial 2Q2021]] · [[Parcial 23-5-23 - Bases de Datos Avanzadas]] ·
[[_cronograma]] · [[_index-clases]] · [[Clase 15 - Introduccion a Cassandra]] ·
[[Práctica 2026-09-29]] · [[Cassandra]] · [[MySQL]] · [[1.06.01 - Vistas|Vistas]] ·
[[1.08.01 - Plan de ejecución|Plan de ejecución]] · [[1.08.02 - Índices|Índices]] ·
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
[[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] ·
[[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] ·
[[1.11.03 - Transacciones y ACID|Transacciones y ACID]] ·
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] ·
[[2.12.01 - NoSQL — origen, propiedades y taxonomía|Taxonomía NoSQL]] ·
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
[[2.12.03 - Persistencia políglota|Persistencia políglota]] ·
[[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.07 - CRUD y consultas en MongoDB|CRUD MongoDB]] ·
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
[[2.13.01 - Documentos embebidos vs. referencias|Documentos embebidos]] ·
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]] · [[2.14.03 - MapReduce|MapReduce]] ·
[[1.05.01 - SQL — consultas|SQL — consultas]] · [[1.09.04 - Triggers|Triggers]] ·
[[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] ·
[[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Bases de datos tabulares]] ·
[[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]] ·
[[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]] ·
[[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]] ·
[[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]] ·
[[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]]
