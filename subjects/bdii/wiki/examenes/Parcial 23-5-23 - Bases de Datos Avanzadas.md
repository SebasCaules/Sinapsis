---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - Teorema CAP
  - Persistencia políglota
  - Taxonomía NoSQL
  - MongoDB
  - PostgreSQL — EXPLAIN ANALYZE y vistas
  - Modelado multidimensional y data warehousing
  - HBase
  - CouchDB
  - Neo4j
  - Redis
  - DynamoDB
  - ElasticSearch
  - PostGIS
fecha: 2023-05-23
temario: anterior
fuentes:
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Parciales viejos/parcial.pdf"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Parciales viejos/parcial(1).pdf"
estado: procesado
resumen: "Parcial del 23/05/2023 de otra materia (Bases de Datos Avanzadas, 32 preguntas, aprobación con 16). Vigente para BDII 2026: CAP, persistencia políglota, MongoDB. No vigente: CouchDB, HBase, ElasticSearch, PostGIS, data warehousing."
aliases:
  - Parcial Bases de Datos Avanzadas 23-5-23
  - Parcial 23/05/2023 BDA
  - BDA 23-5-23
---

# Parcial 23-5-23 - Bases de Datos Avanzadas — parcial de otra materia con temario NoSQL general

## Resumen general

Este parcial no es de 72.41 Base de Datos II: es el parcial del 23 de mayo de 2023 de una materia
distinta, *Bases de Datos Avanzadas*, que un estudiante de BDII conservó entre sus exámenes viejos
porque el temario se superpone con esta cursada en varios puntos. Tiene 32 preguntas de opción
múltiple, verdadero/falso y completar espacios en blanco, con aprobación en 16 respuestas correctas
(el 50 %); el documento no indica duración ni modalidad de toma. Al final trae un solucionario
elaborado por el mismo estudiante a partir de, según su propia nota, "dos intentos del mismo examen"
(22,5/32 y 28,5/32 puntos), con un comentario de justificación por pregunta: es trabajo de estudio
propio, no una fuente oficial de ninguna cátedra, y así se etiqueta en cada pregunta de esta página.

Las 32 respuestas del solucionario se verificaron una por una contra la bibliografía del vault
(*Seven Databases in Seven Weeks* 2.ª ed. y Corbellini et al.) y, donde correspondía, contra
MongoDB 8.3.11: todas resultaron correctas, con matices menores que se señalan en su
pregunta (ninguno cambia la opción marcada). El temario mezcla motores que no forman parte de BDII
2026 —CouchDB, HBase, ElasticSearch, PostGIS— con otros centrales de la segunda mitad de esta
cursada —teorema CAP, persistencia políglota, taxonomía NoSQL, MongoDB— y algunos que 2026 dicta más
adelante en el cuatrimestre —Neo4j, Redis, DynamoDB—; Cassandra no aparece en ninguna pregunta. Sirve
para el parcial del 13/10/2026 sobre todo en las preguntas de CAP, persistencia políglota y MongoDB,
reutilizables casi literalmente; el resto funciona como repaso de vocabulario NoSQL general, útil
pero no examinable en su forma exacta en esta cursada.

> [!warning] Otra materia, otra edición — no todo lo que sigue entra en el parcial 2026
> *Bases de Datos Avanzadas* no es 72.41 Base de Datos II, y 2023 no es 2026 2C. El **temario:
> anterior** de este frontmatter marca eso, no un error del documento. Cada pregunta abajo dice si su
> tema está dictado, no dictado aún o fuera del temario de esta cursada.

> [!info] Fuente
> - `parcial.pdf` y `parcial(1).pdf` — el mismo examen: coinciden palabra por palabra y solo difieren
>   en la codificación de las flechas dentro de la tabla de comentarios del solucionario (`→` en uno,
>   `æ` mal codificado en el otro). Ambos guardados por un estudiante de Base de Datos II entre sus
>   parciales viejos, pero el documento en sí pertenece a otra cátedra: **Bases de Datos Avanzadas**,
>   parcial del 23/05/2023. Nada de esto es material oficial de 72.41.
> - Aportan: el enunciado completo de las 32 preguntas (con la tabla y el diagrama de la Pregunta 21
>   transcritos tal cual del PDF) y, en sus últimas dos páginas, un **solucionario** con la respuesta
>   marcada y un comentario breve de justificación por pregunta — trabajo del estudiante, verificado
>   contra dos intentos propios del mismo examen, no una corrección de la cátedra.

## Formato

32 preguntas: opción múltiple de respuesta única, opción múltiple de selección múltiple ("seleccione
todas las que correspondan"), verdadero/falso y completar (emparejar definición con término, sobre
una tabla de dos columnas). Condición de aprobación: 16 de 32 preguntas bien (50 %). El documento no
especifica duración ni si la modalidad fue presencial o virtual, con o sin material.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP 2026 |
| --- | --- | --- | --- |
| 1 | Teorema CAP — caso AP | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 |
| 2 | Map/reduce en CouchDB — mediana | CouchDB (texto plano) | fuera del temario 2026 |
| 3 | Persistencia políglota vs. programación políglota | [[2.12.03 - Persistencia políglota\|Persistencia políglota]] | Clase 12 (y [[Práctica 2026-08-04]]) |
| 4 | Sigla CAP | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 |
| 5 | DynamoDB — partition key y sort key | DynamoDB (texto plano) | no dictado aún (02/11) |
| 6 | Bloom filter — qué motores lo usan | HBase, Redis (texto plano) | fuera del temario 2026 / no dictado aún (26/10) |
| 7 | Neo4j — lenguaje de consulta (Cypher) | Neo4j (texto plano) | no dictado aún (19/10) |
| 8 | MongoDB — jerarquía database/collection/document | [[2.12.06 - Modelo de documentos — JSON, BSON y ObjectId\|Modelo de documentos]] | Clase 12 / 14 |
| 9 | CAP y consistencia eventual | [[2.12.05 - BASE y consistencia eventual\|BASE y consistencia eventual]] | Clase 12 |
| 10 | Elección de motor — leaderboard de alto throughput | [[2.12.03 - Persistencia políglota\|Persistencia políglota]] · Redis (texto plano) | Clase 12 (factores) / no dictado aún (26/10) |
| 11 | ElasticSearch sobre Apache Lucene | ElasticSearch (texto plano) | fuera del temario 2026 |
| 12 | Esquemas multidimensionales (star/snowflake/constellation) | — (data warehousing, texto plano) | fuera del temario 2026 |
| 13 | HBase — nodos mínimos de un clúster | HBase (texto plano) | fuera del temario 2026 |
| 14 | Data warehouse / data mart / data lake | — (texto plano) | fuera del temario 2026 |
| 15 | HBase — escala de diseño | HBase (texto plano) | fuera del temario 2026 |
| 16 | DynamoDB — PK vs. clave primaria relacional | DynamoDB (texto plano) | no dictado aún (02/11) |
| 17 | PostgreSQL — `EXPLAIN ANALYZE` | [[1.08.01 - Plan de ejecución\|Plan de ejecución]] | Clase 08 (motor ajeno: PostgreSQL) |
| 18 | RDBMS — esquema previo vs. flexibilidad de consulta | [[1.01.01 - Sistema gestor de bases de datos\|Sistema gestor de bases de datos]] | Clase 01 |
| 19 | DynamoDB — ANSI SQL | DynamoDB (texto plano) | no dictado aún (02/11) |
| 20 | PostGIS — `ST_Distance` en metros | PostGIS (texto plano) | fuera del temario 2026 |
| 21 | HBase — sentencia `create` a partir de un diagrama | HBase (texto plano) | fuera del temario 2026 |
| 22 | Campos automáticos — `_id`, `_id`+`_rev`, `id` | [[2.12.06 - Modelo de documentos — JSON, BSON y ObjectId\|Modelo de documentos]] · CouchDB, Neo4j (texto plano) | Clase 14 / fuera y no dictado |
| 23 | ElasticSearch — mapping dinámico vs. explícito | ElasticSearch (texto plano) | fuera del temario 2026 |
| 24 | Versionado de datos por motor | HBase (texto plano) | fuera del temario 2026 |
| 25 | DynamoDB — despliegue local | DynamoDB (texto plano) | no dictado aún (02/11) |
| 26 | CouchDB — jerarquía database/document | CouchDB (texto plano) | fuera del temario 2026 |
| 27 | CouchDB — rango de escala soportado | CouchDB (texto plano) | fuera del temario 2026 |
| 28 | PostGIS vs. MongoDB — funciones espaciales | [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] · PostGIS (texto plano) | Clase 14 / fuera del temario 2026 |
| 29 | PostgreSQL — vista materializada, persistencia en disco | [[1.06.01 - Vistas\|Vistas]] | Clase 06–07 (motor ajeno: PostgreSQL) |
| 30 | PostgreSQL — vistas actualizables | [[1.06.01 - Vistas\|Vistas]] | Clase 06–07 (motor ajeno: PostgreSQL) |
| 31 | Kibana para visualizar ElasticSearch | ElasticSearch (texto plano) | fuera del temario 2026 |
| 32 | MongoDB — índice por defecto (B-tree sobre `_id`) | [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] | Clase 14 |

### Pregunta 1 — Teorema CAP

> Suponga que tiene una base de datos distribuida en varios nodos y todos los nodos aceptan lecturas
> y escrituras. ¿En qué situación del teorema CAP estaríamos?
>
> A) CP
> B) AP
> C) Ninguna de las anteriores
> D) CA

**Respuesta de la fuente** (solucionario reconstruido): **B) AP** — "Si todos los nodos aceptan
lecturas y escrituras se prioriza Disponibilidad y Tolerancia a Particiones, sacrificando
Consistencia."

**Resolución del vault**: correcta. Si todos los nodos del sistema aceptan lecturas y escrituras sin
coordinarse antes, el sistema no puede garantizar que todas las lecturas vean la última escritura
—eso es lo que define renunciar a la Consistencia fuerte— y por lo tanto cae en el cuadrante **AP**:
disponible y tolerante a particiones. Corresponde exactamente a la definición de
[[2.12.04 - Teorema CAP|Teorema CAP]]: ante una partición de red, un sistema AP sigue aceptando
operaciones en ambos lados de la partición a costa de la consistencia.

### Pregunta 2 — Map/reduce en CouchDB (fuera del temario 2026)

> En CouchDB es posible calcular la mediana de una serie numérica utilizando una vista (Map reduce).
> (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "La mediana no es calculable de forma incremental con
map/reduce (no es una función conmutativa/asociativa sobre subconjuntos)."

**Resolución del vault** *(tema fuera del temario 2026: CouchDB no se dicta en esta cursada)*:
correcta, y la justificación es un principio general de map/reduce que sí es material de examen en
2026, aunque aplicado a MongoDB en vez de a CouchDB. El concepto
[[2.14.03 - MapReduce|MapReduce]] del vault exige exactamente esa propiedad: la función `reduce`
"debe ser asociativa, conmutativa e idempotente" porque corre por lotes parciales que después se
vuelven a combinar. La mediana no se puede recalcular así: el resultado de fusionar dos medianas
parciales no es la mediana del conjunto completo (a diferencia de una suma o un conteo, que sí se
recombinan). Esto vale igual en CouchDB (map/reduce sobre vistas, *Seven Databases* cap. 5, *Day 2:
Creating and Querying Views*) que en MongoDB: la pregunta cambia de motor, la respuesta no.

### Pregunta 3 — Persistencia políglota / programación políglota

> Elija la respuesta correcta de acuerdo a la definición dada.
>
> | Mensaje | Respuesta |
> | --- | --- |
> | Usar diferentes tipos de base de datos para almacenar datos, de acuerdo a las distintas necesidades de almacenamiento, que requiera una aplicación de software en particular. | ........................... |
> | Aplicaciones pueden ser codificadas en una mezcla de diferentes lenguajes de programación, para aprovechar el uso del lenguaje más adecuado para resolver la necesidad requerida. | ........................... |
>
> Opciones disponibles: Persistencia políglota | Programación políglota

**Respuesta de la fuente**: **Persistencia políglota / Programación políglota**, en ese orden —
"Persistencia = distintas BDs según necesidad de almacenamiento. Programación = distintos lenguajes
en una misma app."

**Resolución del vault**: correcta y coincide casi textual con la definición del vault. Según
[[2.12.03 - Persistencia políglota|Persistencia políglota]], persistencia políglota es "usar
distintos motores de base de datos dentro de un mismo sistema, cada uno para el tipo de dato que
resuelve mejor". El vault introduce el concepto en [[Práctica 2026-08-04]] (slides 3–6) y lo retoma
en la Clase 12; la fuente de este examen usa casi la misma redacción que la de la cátedra de BDII, lo
que sugiere que ambas materias citan la misma definición estándar del área.

### Pregunta 4 — Sigla CAP

> CAP significa...
>
> A) Consistencia, Durabilidad, Tolerancia a Particiones
> B) Consistencia, Disponibilidad, Partición
> C) Consistency, Availability, Partition tolerance

**Respuesta de la fuente**: **C) Consistency, Availability, Partition tolerance** — "Definición
original en inglés."

**Resolución del vault**: correcta. `[[2.12.04 - Teorema CAP|Teorema CAP]]` registra exactamente esta
forma como alias canónico ("Consistency, Availability, Partition tolerance"). La opción B es una
traducción libre e incompleta (le falta "tolerancia"), y la A confunde "Durabilidad" —una propiedad
de ACID, no de CAP— con Disponibilidad.

### Pregunta 5 — DynamoDB, claves al crear tabla (tema no dictado aún)

> En Amazon DynamoDB, al momento de crear una tabla... (seleccione todas las que correspondan)
>
> A) Se puede definir una partition key más una range key
> B) Se puede definir una partition key

**Respuesta de la fuente**: **A y B** — "Se puede definir solo partition key, o partition key + sort/
range key. Marcar solo una de las dos resta puntos."

**Resolución del vault** *(tema no dictado aún: DynamoDB se dicta el 02/11/2026)*: correcta según
*Seven Databases* cap. 7, § *Two Key Types, Many Possibilities* (impresas 223–227): DynamoDB admite
una **clave primaria simple** (solo partition/hash key) o una **clave primaria compuesta** (partition
key + sort/range key). Como el enunciado pregunta qué es posible definir "al momento de crear una
tabla" y ambas formas son válidas, las dos opciones son correctas — B es siempre cierta (toda tabla
necesita al menos partition key) y A describe la variante compuesta.

### Pregunta 6 — Bloom filter (HBase fuera del temario; Redis no dictado aún)

> ¿Qué bases de datos utilizan Bloom Filter? (seleccione todas las que correspondan)
>
> A) CouchDB · B) Amazon DynamoDB · C) MongoDB · D) HBase · E) ElasticSearch · F) Neo4J · G) PostgreSQL · H) Redis

**Respuesta de la fuente** *(marcada con \* en el documento: "requirió cruce de ambos intentos")*:
**D) HBase y H) Redis** — "Ambas usan Bloom Filters internamente: HBase para los HFiles y Redis vía
RedisBloom."

**Resolución del vault** *(HBase: fuera del temario 2026 · Redis: no dictado aún, se dicta el
26/10/2026)*: la parte de HBase es correcta y está en la bibliografía: *Seven Databases* cap. 3
cubre § *Compression and Bloom Filters* (impresas 71–72) con el recuadro *How Do Bloom Filters Work?*
justo para explicar cómo HBase evita lecturas de disco innecesarias en sus HFiles. Para Redis hay una
precisión: el libro no presenta un Bloom filter nativo ni el módulo RedisBloom, sino una sección
propia, *Bloom Filters* (cap. 8, impresas 285–288), que enseña a **construir uno a mano** con los
comandos `SETBIT`/`GETBIT` sobre un bitmap. El comentario de la fuente que dice "vía RedisBloom" no
es (atención) incorrecto para Redis en general —el módulo existe y hace lo mismo—, pero no es lo que
enseña la bibliografía del vault; la vía que sí está documentada es la manual con `SETBIT`/`GETBIT`.
La opción marcada (D y H) no cambia.

### Pregunta 7 — Lenguaje de consulta de Neo4j (tema no dictado aún)

> ¿Cuál es el lenguaje más utilizado para consultar un grafo en Neo4J?
>
> A) Ninguno de los anteriores · B) Gremlin · C) API REST · D) Cypher

**Respuesta de la fuente**: **D) Cypher** — "Lenguaje declarativo nativo de Neo4j."

**Resolución del vault** *(tema no dictado aún: Neo4j se dicta el 19/10/2026)*: correcta. *Seven
Databases* cap. 6 dedica su *Day 1* completo a "Graphs, Cypher, and CRUD" (impresas 179–189) y
presenta Cypher como el lenguaje declarativo propio de Neo4j, distinto de Gremlin (lenguaje de
recorrido genérico para grafos, usado por otros motores) y de la API REST (una vía de acceso, no un
lenguaje de consulta).

### Pregunta 8 — Jerarquía de MongoDB

> MongoDB gestiona base de datos, colecciones o tablas y documentos. (Verdadero / Falso)

**Respuesta de la fuente**: **Verdadero** — "MongoDB tiene databases → collections → documents."

**Resolución del vault**: correcta. Confirmado en el motor: `db.createCollection(...)` crea
colecciones dentro de una base (comando documentado en [[MongoDB]]), y cada colección almacena
documentos BSON — verificado de nuevo en MongoDB 8.3.11: `createCollection` seguido de `insertOne`
deja el documento dentro de la colección de la base activa. *(atención)* Corbellini § 6 (pp. 14–16)
describe el modelo documental de MongoDB (documentos semiestructurados, *schemaless*, formato BSON),
pero **no** usa el término "collections" ni presenta esta jerarquía database → collections →
documents: verificado con búsqueda de texto completo sobre las 23 páginas del PDF, la única mención
de "collection" en todo el paper es "document collection" en el § de CouchDB (p. 15), sin relación
con MongoDB. La jerarquía es correcta y está documentada en [[MongoDB]] y en la documentación oficial
del motor, no en esta fuente. El enunciado dice "colecciones **o tablas**" porque en MongoDB el
término "tabla" no es propio del motor, pero es la analogía habitual con el modelo relacional.

### Pregunta 9 — CAP y consistencia eventual

> Las bases de datos distribuidas deben ser tolerantes a particiones, por lo que la elección entre la
> disponibilidad y la consistencia puede ser difícil. Sin embargo, mientras que CAP dicta que si
> elige la disponibilidad, no puede tener una verdadera consistencia, aún puede proporcionarse
> consistencia eventual. (Verdadero / Falso)

**Respuesta de la fuente**: **Verdadero** — "Sistemas AP típicamente ofrecen consistencia eventual."

**Resolución del vault**: correcta. Es exactamente la relación que describe
[[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]]: un sistema que prioriza
Disponibilidad (AP) no ofrece consistencia fuerte en todo momento, pero puede converger a un estado
consistente si se detienen las escrituras — eso es la consistencia eventual, la salida práctica al
"no puede tener una verdadera consistencia" del enunciado.

### Pregunta 10 — Elección de motor para un leaderboard de alto throughput (Redis no dictado aún)

> Se necesita implementar una tabla de posiciones para un juego muy popular de éxito mundial, con los
> atributos UserID y Score. Se esperan cerca de 100.000 transacciones por segundo. ¿Qué base de datos
> utilizaría?
>
> A) Amazon DynamoDB · B) CouchDB · C) MongoDB · D) PostgreSQL · E) Redis · F) HBase · G) ElasticSearch · H) Neo4j

**Respuesta de la fuente** *(marcada con \*)*: **E) Redis** — "Leaderboard con altísimo throughput →
sorted sets en memoria. DynamoDB no es la respuesta esperada."

**Resolución del vault** *(tema no dictado aún: Redis se dicta el 26/10/2026, pero el criterio de
decisión sí está dictado en [[2.12.03 - Persistencia políglota|Persistencia políglota]])*: correcta y
es el ejemplo de manual del propio libro obligatorio. *Seven Databases* cap. 8 dedica toda la sección
*Sorted Sets* (impresas 268–271) a esta estructura de datos: un conjunto ordenado por *score*, con
inserción y consulta de rango en tiempo logarítmico, todo en memoria — el caso de uso canónico es
justamente un ranking de jugadores por puntaje. La documentación oficial de Redis lo confirma bajo el
mismo nombre (`ZADD`/`ZRANGE`, *sorted sets* como estructura de leaderboards,
`https://redis.io/docs/latest/develop/data-types/sorted-sets/`). El comentario de la fuente sobre
DynamoDB es razonable como descarte relativo —soporta ese throughput con aprovisionamiento adecuado,
pero no está optimizado para el patrón de "leer el top-N ordenado por score" sin un índice secundario
adicional—, aunque no es un error absoluto de DynamoDB: es una comparación de *fit*, no de
capacidad bruta.

### Pregunta 11 — ElasticSearch sobre Lucene (fuera del temario 2026)

> ElasticSearch proporciona un sistema distribuido sobre Apache Lucene. (Verdadero / Falso)

**Respuesta de la fuente**: **Verdadero** — "Elasticsearch está construido sobre Lucene como motor
distribuido."

**Resolución del vault** *(tema fuera del temario 2026: ElasticSearch no se dicta en esta cursada, y
ningún libro obligatorio ni el paper de Corbellini lo cubren)*: correcta según la documentación
oficial de Elastic: Elasticsearch es una capa distribuida (sharding, replicación, API REST/JSON)
construida sobre la librería de búsqueda de texto completo Apache Lucene
(`https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html`).

### Pregunta 12 — Esquemas del modelado multidimensional (fuera del temario 2026)

> En el caso de requerir diseñar una base de datos siguiendo los lineamientos del modelado
> multidimensional, ¿cuáles son los tipos de esquema que podemos elegir? (seleccione todas las que
> correspondan)
>
> A) Snowflake schema · B) Constellation schema · C) Star schema · D) Snake schema

**Respuesta de la fuente**: **A, B y C** — "Snowflake, Constellation y Star son esquemas
multidimensionales válidos. Snake schema no existe."

**Resolución del vault** *(tema fuera del temario 2026: el modelado multidimensional / data
warehousing no aparece en el cronograma 2026 2C ni en la bibliografía obligatoria del vault; la
cátedra de BDII no lo dicta este cuatrimestre)*: correcta según la literatura estándar de diseño
dimensional (Kimball): **star schema** (una tabla de hechos rodeada de dimensiones desnormalizadas),
**snowflake schema** (las dimensiones del star schema, normalizadas en subtablas) y **constellation
schema** o *galaxy schema* (varias tablas de hechos que comparten dimensiones) son los tres esquemas
reconocidos. "Snake schema" no es un término establecido en la bibliografía del área: es un distractor.

### Pregunta 13 — Nodos mínimos de un clúster HBase (fuera del temario 2026)

> Si vas a implementar un cluster con HBase, ¿cuántos nodos utilizarías como mínimo?
>
> A) 5 · B) 6 · C) 3 · D) 4 · E) 7

**Respuesta de la fuente**: **A) 5** — "HBase requiere mínimo: HMaster + ZooKeeper +
RegionServers + HDFS NameNode/DataNodes → 5 nodos."

**Resolución del vault** *(tema fuera del temario 2026: HBase no se dicta en esta cursada)*: **(nota)
no verificado contra un pasaje específico de la bibliografía del vault.** *Seven Databases* cap. 3
cubre la configuración de HBase (§ *Configuring HBase*, impresas 56–57) y el despliegue en la nube (§
*Day 3: Taking It to the Cloud*, impresas 82–88), pero la ficha del vault no registra un número
mínimo de nodos explícito en esas páginas. El razonamiento de la fuente —HMaster, un ensamble
ZooKeeper (que en producción se recomienda impar, típicamente 3 o 5), RegionServers y los nodos de
HDFS— es la lógica operativa estándar que suele citarse para un clúster HBase de producción mínimamente
tolerante a fallas, pero es una cifra de referencia de la industria, no un dato verificable palabra por
palabra en los libros del vault. Se deja la respuesta de la fuente sin objeción, con esta salvedad.

### Pregunta 14 — Data warehouse / data mart / data lake (fuera del temario 2026)

> Elija la respuesta correcta de acuerdo a la definición dada.
>
> | Mensaje | Respuesta |
> | --- | --- |
> | Es un repositorio integrado de datos estructurados que se construye a nivel total compañía para soportar la toma de decisiones corporativas. | ..................... |
> | Es un subconjunto lógico y físico de un repositorio integrado de datos estructurados, especialmente enfocado en un área en particular para responder una pregunta específica del negocio. | ..................... |
> | Es un repositorio centralizado para almacenar, procesar grandes cantidades de datos estructurados, semi-estructurados y no estructurados. | ..................... |
>
> Opciones disponibles: Data warehouse | Data mart | Data lake

**Respuesta de la fuente**: **Data warehouse / Data mart / Data lake**, en ese orden — "DW =
corporativo estructurado; Data mart = subconjunto por área; Data lake = todo tipo de datos."

**Resolución del vault** *(tema fuera del temario 2026: ningún libro obligatorio del vault trata data
warehousing, y el cronograma 2026 2C no lo incluye)*: correcta según la definición estándar del área
de sistemas de soporte a decisiones (Inmon/Kimball): un **data warehouse** es el repositorio
estructurado e integrado a escala de toda la organización; un **data mart** es su recorte por área de
negocio; un **data lake** almacena datos en cualquier formato —estructurado, semiestructurado y no
estructurado— sin exigir un esquema previo. Las tres definiciones del enunciado coinciden palabra por
palabra con esa distinción canónica.

### Pregunta 15 — Escala de diseño de HBase (fuera del temario 2026)

> Apache HBase está diseñado para soportar bases de datos pequeñas como por ejemplo las que se
> utilizan en aplicaciones celulares. (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "HBase está diseñado para grandes volúmenes (Big Data), no
apps móviles pequeñas."

**Resolución del vault** *(tema fuera del temario 2026)*: correcta. *Seven Databases* cap. 3 presenta
a HBase junto con la sección § *Streaming Wikipedia* (Day 2, impresas 69–71) como ejemplo de carga de
datos masiva, y su modelo (column families, HFiles sobre HDFS) está pensado para volúmenes de "big
data" distribuidos, no para bases embebidas o de dispositivo — ese es, en cambio, el nicho al que
apunta CouchDB con PouchDB (ver Pregunta 27).

### Pregunta 16 — Partition key de DynamoDB vs. clave primaria relacional (tema no dictado aún)

> En Amazon DynamoDB la PK (Partition Key o Hash Key) no es lo mismo que la PK (Primary Key) de las
> tablas en modelo relacional. (Verdadero / Falso)

**Respuesta de la fuente**: **Verdadero** — "La PK de DynamoDB define partición física; la PK
relacional es solo identificador único."

**Resolución del vault** *(tema no dictado aún: DynamoDB se dicta el 02/11/2026)*: correcta. *Seven
Databases* cap. 7, § *Spreading the Data Around: Partitioning in DynamoDB* (impresas 227–228),
explica que la partition key determina en qué **partición física** vive el ítem —afecta rendimiento y
distribución de carga—, mientras que una clave primaria relacional (dictada en
[[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]]) solo
garantiza unicidad lógica de la fila, sin implicar nada sobre su ubicación física.

### Pregunta 17 — `EXPLAIN ANALYZE` en PostgreSQL

> En PostgreSQL el `EXPLAIN ANALYZE <sql>` muestra el plan de ejecución de una consulta SQL y los
> tiempos de ejecución de dicha consulta. (Verdadero / Falso)

**Respuesta de la fuente**: **Verdadero** — "EXPLAIN ANALYZE ejecuta la query y muestra plan +
tiempos reales."

**Resolución del vault**: correcta, y coincide con la distinción central de
[[1.08.01 - Plan de ejecución|Plan de ejecución]] entre `EXPLAIN` (solo estima, no ejecuta) y
`EXPLAIN ANALYZE` ("explica y ejecuta": corre la consulta de verdad y agrega los tiempos reales de
cada nodo). El vault cita la documentación oficial de PostgreSQL
(`https://www.postgresql.org/docs/current/sql-explain.html`) para esta misma distinción. La cursada
2026 corre sobre MySQL, no PostgreSQL —motor ajeno—, pero MySQL 8.0.18+ también implementa
`EXPLAIN ANALYZE` con el mismo comportamiento (ejecuta y agrega tiempos reales por nodo), así que el
concepto se traslada directo.

### Pregunta 18 — RDBMS: esquema previo y flexibilidad de consultas

> Las RDBMS requieren que el usuario modele los datos antes de implementar el sistema, pero permite
> flexibilidad en las consultas. (Verdadero / Falso)

**Respuesta de la fuente**: **Verdadero** — "El modelo relacional exige esquema previo, pero SQL
permite consultas flexibles."

**Resolución del vault**: correcta. El modelo relacional exige declarar el esquema (tablas, columnas,
tipos, restricciones) antes de cargar datos —cubierto en
[[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]] y
[[1.03.02 - DDL — creación y alteración de tablas|DDL]]—, pero una vez definido el esquema, SQL
permite formular consultas ad hoc arbitrarias mediante álgebra relacional (joins, agregaciones,
filtros) sin tener que predefinir el patrón de acceso. Es exactamente el contraste que traza
[[2.12.01 - NoSQL — origen, propiedades y taxonomía|taxonomía NoSQL]] al comparar el modelo relacional
con el *schemaless* de NoSQL: el relacional invierte el costo —esquema rígido, consulta flexible—
frente a NoSQL, que suele ser al revés.

### Pregunta 19 — DynamoDB y ANSI SQL (tema no dictado aún)

> Amazon DynamoDB soporta ANSI SQL de manera nativa. (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "DynamoDB usa su propia API; PartiQL ofrece SQL-like, pero no
es ANSI SQL nativo."

**Resolución del vault** *(tema no dictado aún: DynamoDB se dicta el 02/11/2026)*: correcta. DynamoDB
se consulta de forma nativa con su API de operaciones (`GetItem`, `Query`, `Scan`, etc., *Seven
Databases* cap. 7); PartiQL agrega una sintaxis con apariencia de SQL sobre esa misma API, pero no es
una implementación del estándar ANSI SQL ni soporta joins entre tablas — es SQL-*like*, no SQL nativo.

### Pregunta 20 — PostGIS y distancias en metros (fuera del temario 2026)

> En PostGIS, para que las distancias (`ST_Distance`) estén expresadas en metros, ¿cómo tienen que
> ser los objetos consultados? (seleccione todas las que correspondan)
>
> A) geography · B) geometry (EPSG:22185) · C) geometry (EPSG:4326)

**Respuesta de la fuente** *(marcada con \*)*: **A y B** — "geography mide en metros sobre el
elipsoide; geometry con CRS proyectado en metros (EPSG:22185 – POSGAR Argentina) también. EPSG:4326
está en grados."

**Resolución del vault** *(tema fuera del temario 2026: PostGIS no se dicta en esta cursada, y ningún
libro obligatorio del vault lo cubre — *Seven Databases* trata el geoespacial de MongoDB, no
PostGIS)*: correcta según la documentación oficial de PostGIS
(`https://postgis.net/docs/ST_Distance.html`): el tipo `geography` calcula distancias en metros sobre
el elipsoide terrestre, cualquiera sea el sistema de referencia; el tipo `geometry` calcula en las
unidades de su sistema de coordenadas (CRS) — EPSG:22185 (POSGAR 94 / Argentina 5, proyección
métrica) da metros, mientras que EPSG:4326 (WGS 84, coordenadas geográficas lat/long) da grados, no
metros.

### Pregunta 21 — Creación de tabla en HBase a partir de un diagrama (fuera del temario 2026)

> Teniendo en cuenta el diagrama de la tabla **figures**, ¿cuál es la sentencia para crear la tabla en
> cuestión en HBase?
>
> | | row keys | column family "color" | column family "shape" |
> | --- | --- | --- | --- |
> | row | "first" | "red": "#F00" / "blue": "#00F" / "yellow": "#FF0" | "square": "4" |
> | row | "second" | — | "triangle": "3" / "square": "4" |
>
> A) `create 'figures', 'shape'`
> B) `create 'figures', 'key', 'color', 'shape'`
> C) `create 'figures', 'key', 'color'`
> D) `create 'figures', 'color', 'shape'`

**Respuesta de la fuente**: **D) `create 'figures', 'color', 'shape'`** — "En HBase se declaran solo
column families al crear la tabla; las row keys se especifican al insertar."

**Resolución del vault** *(tema fuera del temario 2026: HBase no se dicta en esta cursada)*: correcta
según *Seven Databases* cap. 3, § *Creating a Table* (impresas 58–60): la sintaxis del shell de HBase
es `create '<tabla>', '<column family 1>', '<column family 2>', ...` — solo se nombran las *column
families* (`color` y `shape` en el diagrama), nunca las row keys ni columnas individuales, que se
definen recién al insertar con `put`. Las opciones A y C omiten una de las dos column families, y B
agrega un cuarto argumento `'key'` que no corresponde a la sintaxis del comando.

### Pregunta 22 — Campos automáticos por motor (MongoDB dictado; CouchDB y Neo4j, no)

> ¿Qué base de datos provee de manera automática los siguientes campos?
>
> | Campo | Respuesta |
> | --- | --- |
> | `_id` | ......................................................................... |
> | `_id` & `_rev` | ......................................................................... |
> | `id` | ......................................................................... |
>
> Opciones disponibles: MongoDB | CouchDB | Neo4j

**Respuesta de la fuente**: **MongoDB / CouchDB / Neo4j**, en ese orden — "`_id` → MongoDB; `_id` +
`_rev` (revisiones) → CouchDB; `id` → Neo4j."

**Resolución del vault** *(MongoDB dictado: [[2.14.02 - Índices en MongoDB|Índices en MongoDB]] ·
CouchDB fuera del temario 2026 · Neo4j no dictado aún, 19/10/2026)*: la parte de MongoDB se verificó
en MongoDB 8.3.11:

```
mongosh --quiet --eval '
db.testcol.drop();
db.testcol.insertOne({nombre: "prueba", valor: 1});
printjson(db.testcol.getIndexes());
'
```

Salida real:

```
[ { v: 2, key: { _id: 1 }, name: '_id_' } ]
```

Todo documento insertado recibe un `_id` automático (un `ObjectId` si no se provee otro valor), y
sobre ese campo se crea de inmediato el índice `_id_` — confirmado arriba y desarrollado en
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]]. Para CouchDB, `_id` identifica el documento y
`_rev` es el número de revisión que cambia en cada escritura (mecanismo de control de concurrencia
optimista de CouchDB, *Seven Databases* cap. 5). Para Neo4j, cada nodo y relación recibe un `id`
interno asignado por el motor. Las tres asignaciones de la fuente son correctas.

### Pregunta 23 — Mapping en ElasticSearch (fuera del temario 2026)

> Mapping in ElasticSearch is the process of defining how a document, and the fields it contains, are
> stored and indexed. No conviene generar el mapeo de los tipos de datos de los campos, antes de
> subir los documentos al índice y dejar que el motor los descubra. (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "Sí conviene definir el mapping antes; el auto-mapping puede
inferir tipos incorrectos."

**Resolución del vault** *(tema fuera del temario 2026: ElasticSearch no se dicta en esta cursada)*:
correcta según la documentación oficial de Elasticsearch sobre *dynamic mapping*
(`https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-mapping.html`): dejar que
el motor infiera el mapeo automáticamente ahorra trabajo inicial, pero puede asignar tipos
inadecuados (por ejemplo, un número guardado como texto, o una fecha con formato no reconocido), lo
que después complica o impide ciertas consultas y agregaciones. La documentación recomienda
explícitamente definir un *explicit mapping* para los campos que importan al modelo de consulta.

### Pregunta 24 — Versionado de datos (fuera del temario 2026)

> ¿Qué base de datos provee la funcionalidad de versionado (no revisiones) de sus datos?
>
> A) Neo4j · B) CouchDB · C) HBase · D) ElasticSearch · E) Redis · F) Amazon DynamoDB · G) PostgreSQL · H) MongoDB

**Respuesta de la fuente**: **C) HBase** — "HBase mantiene versiones por timestamp de cada celda (no
son revisiones tipo CouchDB)."

**Resolución del vault** *(tema fuera del temario 2026: HBase no se dicta en esta cursada)*: correcta,
y la distinción que marca la fuente entre "versionado" y "revisiones" es precisa. HBase guarda varias
versiones de cada celda identificadas por *timestamp*, configurable por column family (ver la sección
de *column families* de *Seven Databases* cap. 3, impresas 65–66), lo cual es un mecanismo distinto al
de CouchDB, que usa `_rev` para detectar conflictos de escritura concurrente, no para conservar un
historial completo de valores anteriores navegable por el usuario.

*(atención)* La opción **F) Amazon DynamoDB** no queda descartada por la bibliografía: la tabla del
Apéndice A1 de *Seven Databases* 2.ª ed. (columnas *Secondary Indexes · Versioning · Bulk Load · Very
Large Files*, impresa 313) marca *Versioning* = **Yes** para HBase, CouchDB **y DynamoDB**, y **No**
para los otros cuatro (la misma tabla que usa [[Final 1Dic2023]] en su pregunta 2, donde DynamoDB no
estaba entre las opciones). CouchDB queda fuera por el "(no revisiones)" del enunciado; DynamoDB, no.
Lo que separa a HBase es que el libro **desarrolla** su versionado —cap. 3 lo presenta como parte
del modelo ("versioning is baked right in!", impresa 61) y lo configura con `VERSIONS` por *column
family*—, mientras que el cap. 7 (DynamoDB) no describe ningún mecanismo de versionado: la palabra
solo aparece en la tabla del apéndice. Por eso la opción del solucionario es la que el libro
justifica, pero una respuesta F apoyada en el Apéndice A1 es defendible, y el enunciado admite
lectura múltiple.

### Pregunta 25 — DynamoDB en un servidor local (tema no dictado aún)

> DynamoDB puede ser implementado productivamente en un servidor local. (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "DynamoDB es servicio gestionado en AWS; existe DynamoDB Local
solo para desarrollo/testing, no productivo."

**Resolución del vault** *(tema no dictado aún: DynamoDB se dicta el 02/11/2026)*: correcta. *Seven
Databases* cap. 7 dedica el recuadro § *Running DynamoDB Locally* (impresa 217) a esta herramienta y
aclara que sirve para desarrollar sin cuenta de AWS, no como reemplazo del servicio productivo:
DynamoDB en producción es un servicio administrado de AWS, sin una distribución on-premise soportada.

### Pregunta 26 — Jerarquía de CouchDB (fuera del temario 2026)

> CouchDB gestiona base de datos, colecciones o tablas y documentos. (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "CouchDB gestiona databases y documents (sin colecciones ni
tablas)."

**Resolución del vault** *(tema fuera del temario 2026: CouchDB no se dicta en esta cursada)*:
correcta. A diferencia de MongoDB (ver Pregunta 8), CouchDB no tiene un nivel intermedio de
"colección": cada *database* contiene documentos directamente. Confirmado por la estructura de
comandos de *Seven Databases* cap. 5 (`Day 1: CRUD, Fauxton, and cURL Redux`), donde las operaciones
son siempre database → documento, sin un paso de colección.

### Pregunta 27 — Escala de diseño de CouchDB (fuera del temario 2026)

> CouchDB no está diseñado para soportar, desde bases de datos pequeñas como por ejemplo las que se
> utilizan en aplicaciones celulares hasta escenarios de datacenters. (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "CouchDB sí está diseñado para ese rango (incluso tiene
PouchDB para móviles y replica a datacenter)."

**Resolución del vault** *(tema fuera del temario 2026)*: correcta. El enunciado está formulado en
negativo ("no está diseñado para soportar... desde... hasta..."), así que "Falso" equivale a afirmar
que **sí** cubre ese rango. *Seven Databases* cap. 5 dedica todo el *Day 3* a § *Watching CouchDB for
Changes* y § *Replicating Data in CouchDB* (impresas 161–173), el mecanismo que permite sincronizar
desde un dispositivo hasta un clúster de datacenter; el recuadro *Frontend-to-Backend Syncing with
PouchDB* (impresa 136) es justamente la pieza que lleva ese modelo de replicación al navegador o al
móvil — contraste directo con HBase (Pregunta 15), que sí está pensado solo para el extremo de "big
data".

### Pregunta 28 — PostGIS vs. MongoDB en datos espaciales (PostGIS fuera del temario; MongoDB dictado)

> Para implementar datos espaciales (points, linestrings, polygons), PostgreSQL & PostGIS brindan las
> mismas funciones que MongoDB. (Verdadero / Falso)

**Respuesta de la fuente** *(marcada con \*)*: **Falso** — "PostGIS tiene un set mucho más completo de
funciones espaciales que MongoDB."

**Resolución del vault** *(PostGIS: fuera del temario 2026 · MongoDB: dictado, ver
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]])*: correcta. MongoDB ofrece soporte geoespacial
limitado a índices `2dsphere`/`2d` y un puñado de operadores (`$near`, `$geoWithin`, entre otros;
usados en el TP 9 Parte II sobre el dataset `mongoCities_fixed.json`), mientras que PostGIS implementa
la especificación completa *Simple Features* de OGC —decenas de funciones de geometría, topología y
proyección (`ST_Distance`, `ST_Intersects`, `ST_Buffer`, `ST_Transform`, etc.)—. La comparación de la
fuente es correcta en dirección y magnitud.

### Pregunta 29 — Vistas materializadas en PostgreSQL

> La vista materializada de PostgreSQL no almacena en el disco el resultado de ejecutar el select que
> la define, sino que obtiene el resultado ejecutando el select al momento de consultar la vista.
> (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "Las vistas materializadas SÍ almacenan el resultado en disco;
deben refrescarse con `REFRESH MATERIALIZED VIEW`."

**Resolución del vault**: correcta y coincide con
[[1.06.01 - Vistas|Vistas]], que distingue explícitamente la vista **virtual** —la que "se genera al
operar" cada vez que se consulta, sin ocupar espacio propio— de la vista **materializada**, que sí
almacena el resultado en disco y requiere refrescarse manualmente (`REFRESH MATERIALIZED VIEW`) para
reflejar cambios en las tablas base; el vault señala además que en PostgreSQL ese refresco recalcula
la vista completa. Es una nota de motor ajeno para BDII 2026: MySQL no implementa vistas
materializadas: acepta la sintaxis `CREATE MATERIALIZED VIEW … AS SELECT …` sin error, pero crea una
vista común que recalcula en cada consulta (verificado en MySQL 9.7.2: la vista pasa de 30 a 60 tras un
`INSERT` en la tabla base, `TABLE_TYPE = VIEW`; ver [[1.06.01 - Vistas|Vistas]] § *Virtual vs.
materializada*). El comportamiento que pregunta este ítem es específico de PostgreSQL.

### Pregunta 30 — Vistas actualizables en PostgreSQL

> En PostgreSQL, siempre es posible realizar un UPDATE, INSERT y DELETE sobre los campos de una
> vista. (Verdadero / Falso)

**Respuesta de la fuente**: **Falso** — "Solo se permite sobre vistas 'simples' (updatable views);
vistas con joins, agregaciones, etc. no son actualizables directamente."

**Resolución del vault**: correcta. [[1.06.01 - Vistas|Vistas]] desarrolla en detalle la condición de
actualizabilidad del estándar SQL: una vista es actualizable cuando, entre otras condiciones, se
define usando solo selección y proyección sobre una única tabla base, preserva su clave y no incluye
agregaciones, `GROUP BY`, `DISTINCT` ni uniones que mezclen columnas de varias tablas en la escritura.
Una vista que no cumple esas condiciones no admite `UPDATE`/`INSERT`/`DELETE` directos: la vía
estándar para escribir a través de una vista así es un trigger `INSTEAD OF`, que el vault también
documenta. "Siempre" en el enunciado es lo que lo vuelve falso.

### Pregunta 31 — Kibana y ElasticSearch (fuera del temario 2026)

> Para visualizar la información almacenada en ElasticSearch, utilizamos Kibana. (Verdadero / Falso)

**Respuesta de la fuente**: **Verdadero** — "Kibana es la herramienta estándar de visualización del
stack ELK."

**Resolución del vault** *(tema fuera del temario 2026: ElasticSearch no se dicta en esta cursada)*:
correcta según la documentación oficial de Elastic: Kibana es la herramienta de visualización y
exploración del stack ELK/Elastic (Elasticsearch, Logstash, Kibana), diseñada específicamente para
consultar y graficar los datos indexados en Elasticsearch
(`https://www.elastic.co/kibana`).

### Pregunta 32 — Índice por defecto de MongoDB

> ¿Cuál es el tipo de índice default que maneja MongoDB? — ¿Hay índices creados por default como
> ocurría en PostgreSQL? — En que la respuesta a la 2da pregunta sea afirmativa, ¿sobre qué campo lo
> aplica?
>
> A) B-Tree – Sí – `_id`
> B) B-Tree – No
> C) Hash index – Sí – `_id`
> D) 2d index – Sí – `_id`
> E) Hash index – No
> F) 2d index – No

**Respuesta de la fuente**: **A) B-Tree – Sí – `_id`** — "MongoDB usa B-Tree por default y crea
automáticamente un índice sobre `_id`."

**Resolución del vault**: correcta, verificada en el motor y en la bibliografía. *Seven Databases*
cap. 4, § *Indexing: When Fast Isn't Fast Enough* (impresa 110): "MongoDB provides several of the best
data structures for indexing, such as the classic B-tree", y la impresa 111 confirma que "Mongo
automatically creates an index by the `_id`". El vault lo reproduce en
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]] y se comprobó en MongoDB 8.3.11:

```
mongosh --quiet --eval '
var r = db.testcol.find({_id: db.testcol.findOne()._id}).explain("executionStats");
printjson(r.queryPlanner.winningPlan);
'
```

Salida real:

```
{ isCached: false, stage: 'EXPRESS_IXSCAN', keyPattern: '{ _id: 1 }', indexName: '_id_' }
```

La consulta por `_id` usa el índice `_id_` (`IXSCAN`/`EXPRESS_IXSCAN`, no un *collection scan*),
confirmando que el índice existe y se usa por defecto sobre ese campo.

## Qué enseña para el parcial 2026

- **CAP y persistencia políglota son las dos secciones de este examen directamente reutilizables**:
  las preguntas 1, 4 y 9 (CAP) y 3 y 10 (persistencia políglota) están formuladas casi con el mismo
  vocabulario que usa la cátedra de BDII en la Clase 12, y son un buen banco de repaso rápido antes
  del 13/10/2026.
- **Los "campos automáticos por motor" (`_id`, `_rev`, `id`) y los índices por defecto de MongoDB son
  patrones de pregunta recurrentes** en los exámenes de esta familia de materias: conviene tener a
  mano, para MongoDB, que `_id` es automático y que sobre él existe siempre un índice B-tree
  (Pregunta 32) — es exactamente lo que evalúa el TP9.
- **Distinguir el motor evaluado importa tanto como la respuesta.** Varias preguntas de este examen
  (17, 29, 30) son sobre PostgreSQL, no MySQL; los conceptos (planes de ejecución, vistas
  materializadas, vistas actualizables) sí son de BDII 2026, pero la sintaxis exacta puede no
  trasladarse sin ajuste — la traducción MySQL/PostgreSQL vive en [[MySQL]] y [[PostgreSQL]].
- **Las preguntas de verdadero/falso "en negativo"** (Pregunta 27: "CouchDB no está diseñado para...
  (V/F)") son una trampa de lectura clásica: conviene resolver primero la afirmación sin la negación y
  recién después aplicar el "no".
- **Este examen confirma, con otra fuente independiente, la distinción entre AP y CP** que ya
  documenta el vault: sistemas que aceptan lecturas/escrituras en todos los nodos sacrifican
  consistencia fuerte a cambio de disponibilidad, y "consistencia eventual" es la respuesta práctica a
  esa renuncia — vocabulario que reaparece en la Clase 12 y en el TP9.

## Dudas abiertas

- (abierto) No se pudo determinar la duración ni la modalidad de toma (presencial/virtual, con o sin
  material) de este examen: el documento no lo indica.
- (abierto) El solucionario no aclara si las preguntas de opción múltiple con "seleccione todas las
  que correspondan" (5, 6, 10 no aplica, 12, 20) tienen puntaje parcial por selección incompleta o
  penalización por selección incorrecta — solo dice, para la Pregunta 5, que "marcar solo una de las
  dos resta puntos", sin dar la regla general de puntaje de la materia.
- (abierto) Para la Pregunta 13 (nodos mínimos de un clúster HBase) no se encontró una cita textual en
  la bibliografía del vault que confirme el número 5: queda pendiente si vale la pena buscar la fuente
  original de esa cifra (documentación oficial de HBase) para dejarla mejor respaldada, dado que HBase
  no es tema de examen en BDII 2026.

## Enlaces

- [[Mapa de exámenes]]
- [[Clase 12 - Introduccion a NoSQL]] · [[Clase 14 - MongoDB Features]]
- [[Clase 06 - Vistas-Parte 1]] · [[Clase 08 - Explicando el plan]]
- [[2.12.03 - Persistencia políglota|Persistencia políglota]] ·
  [[2.12.04 - Teorema CAP|Teorema CAP]] ·
  [[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]] ·
  [[2.14.02 - Índices en MongoDB|Índices en MongoDB]] ·
  [[1.06.01 - Vistas|Vistas]] · [[1.08.01 - Plan de ejecución|Plan de ejecución]]
- [[_cronograma]]
