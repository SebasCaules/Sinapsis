---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - MongoDB — aggregate, $group, $addFields, $out
  - Neo4j — Cypher, grafos
  - DynamoDB — teorema CAP, tablas y llaves
  - CouchDB — vistas map/reduce
  - Redis — GEOADD, sorted sets
  - PostgreSQL — similitud de texto (fuzzystrmatch, Levenshtein)
cuatrimestre: 1Q2020
temario: anterior
fuentes:
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/1Q2020 - RESUELTO (no chequeado).pdf"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/1Q2020 - RESUELTO (no chequeado).docx"
estado: procesado
resumen: "Parcial práctico domiciliario de 1Q2020 (sin fecha registrada): seis ejercicios de un día sobre MongoDB, Neo4j, DynamoDB, CouchDB, Redis y PostgreSQL, resueltos por un estudiante y no chequeados por la cátedra."
aliases:
  - Parcial 1Q2020
  - Parcial Bases de Datos II 1Q2020
  - 1Q2020 - RESUELTO (no chequeado)
---

# Parcial 1Q2020 — parcial práctico domiciliario, seis motores en un día

## Resumen general

Este es el parcial práctico del primer cuatrimestre de 2020, resuelto por un estudiante y archivado
con el rótulo "RESUELTO (no chequeado)": nadie de la cátedra revisó esta resolución, y no hay
enunciado en blanco ni solucionario oficial con el que contrastarla. La fuente no trae fecha, solo
los horarios de inicio y fin de cada ejercicio (de 9:23 a 15:34, con una hora larga de almuerzo entre
CouchDB y Redis), lo que confirma el formato: un examen domiciliario de un día completo, no una
evaluación de aula con tiempo fijo. Evalúa seis motores distintos en seis ejercicios independientes
— MongoDB (aggregation pipeline), Neo4j (Cypher sobre un grafo de comercio minorista), DynamoDB
(clasificación CAP y diseño de tabla con llave compuesta), CouchDB (vistas map/reduce con
JavaScript), Redis (comandos geoespaciales sobre sorted sets) y PostgreSQL (búsqueda difusa con
`fuzzystrmatch`) — con instrucciones de comando por comando y capturas de resultado, típico de un
examen "mostrar el procedimiento" más que de una evaluación de opción múltiple.

El formato es completamente distinto al parcial 2026 (13/10/2026, sobre MySQL para la parte
relacional y con el temario actual de NoSQL): este parcial pertenece a una cursada donde se dictaban
siete motores NoSQL/relacionales en paralelo (Neo4j, DynamoDB, CouchDB, Redis, ElasticSearch, además
de PostgreSQL y MongoDB), varios de los cuales el programa 2026 dicta más tarde en el cuatrimestre o
no dicta en absoluto. Lo que sigue vigente es la lógica de MongoDB (aggregation pipeline) y los
fundamentos del teorema CAP; lo demás sirve como panorama de motores, no como práctica directa para
el 13/10/2026.

> [!info] Fuente
> `1Q2020 - RESUELTO (no chequeado).pdf` y su `.docx` gemelo (mismo contenido, dos imágenes embebidas:
> un diagrama entidad-relación de las tablas Categories/Products/Suppliers del dataset Northwind —que
> también aparece renderizado en la página 4 del PDF, dentro del enunciado del Ejercicio 2— y la vista
> de CouchDB en Fauxton).
> Autor: un estudiante de una cursada anterior de 72.41, identificable por rutas propias
> (`/home/lkarpovich/Bases/...`) en los comandos. **No es material oficial de la cátedra**: es una
> entrega ya corregida y calificada, pero archivada sin la nota ni comentarios del docente. El rótulo
> "no chequeado" es de la fuente misma — el propio estudiante marca que no revisó la resolución antes
> de entregarla.

## Formato

Examen práctico domiciliario, individual, con captura de horario de inicio y fin por ejercicio (no
hay un límite de tiempo único documentado en esta fuente: compárese con el 2Q2020, que sí especifica
3.5 horas corridas). Seis ejercicios, uno por motor, cada uno con varias consignas encadenadas
(a, b, c, …). No hay opción múltiple ni V/F: todas las consignas piden ejecutar un comando o consulta
y mostrar el resultado. No se documenta puntaje ni condición de aprobación en esta fuente (a
diferencia del 2Q2020, que sí trae una fila de puntos "1 2 3 4 5 6 Nota").

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1.a | `$group` + `$sort` por año | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 12–14 / Práctica 2026-09-15 |
| 1.b | `$addFields` + `$out` | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 12–14 |
| 1.c | `$group` con `$sum` sobre un campo | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 12–14 |
| 2.a–d | Cypher: `MATCH`/`RETURN`, relaciones | Neo4j — texto plano *(tema no dictado aún; se dicta el 19–20/10)* | — |
| 3.1 | Teorema CAP aplicado a DynamoDB | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 (concepto) |
| 3.2 | Tabla con llave compuesta (hash + range) | DynamoDB — texto plano *(tema no dictado aún; se dicta el 02/11)* | — |
| 4.1–2 | Vista map/reduce en JavaScript | CouchDB — texto plano *(fuera del temario 2026)* | — |
| 5.1–5 | `GEOADD`/`GEORADIUS` sobre sorted sets | Redis — texto plano *(tema no dictado aún; se dicta el 26/10)* | — |
| 6.1 | DDL/DML básico (`CREATE TABLE`, `INSERT`) | [[1.03.02 - DDL — creación y alteración de tablas\|DDL — creación y alteración de tablas]] | Clase 03–04 (dictado, en MySQL) |
| 6.2 | Similitud difusa: `fuzzystrmatch`, Levenshtein | PostgreSQL — texto plano *(fuera del temario 2026)* | — |

## Preguntas

### Pregunta 1 — MongoDB: aggregation pipeline sobre `albumlist.csv`

**Enunciado literal:**

> Importe el archivo `albumlist.csv` (o su versión RAW) a una colección. Este archivo cuenta con el
> top 500 del álbumes musicales de todos los tiempos según la revista Rolling Stones.
>
> a. Cuente la cantidad de álbumes por año y ordénelos de manera descendente (mostrando los años con
> mayor cantidad de álbumes al principio).
>
> b. A cada documento, agregarle un nuevo atributo llamado `score` que sea `501-Number`.
>
> c. Realice una consulta que muestre el `score` de cada artista.

**Respuesta de la fuente** (resolución de estudiante, documento resuelto no chequeado):

Importación desde Docker:

```bash
docker start Mymongo
sudo docker cp /home/lkarpovich/Bases/albumlist.csv Mymongo:/albumlist.csv
sudo docker exec -it Mymongo bash
mongoimport --host localhost:27017 --db music --collection albums --headerline --type csv albumlist.csv
mongo music
db.albums.count()
```

a.

```javascript
db.albums.aggregate([
  { $group: { _id: "$Year", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

Resultado (primeras filas): `{ "_id" : 1970, "count" : 26 }`, `1972 → 24`, `1973 → 23`, `1969 → 22`,
`1968 → 21`, `1971 → 21`, `1967 → 20`, hasta llegar a los años con un solo álbum (1955, 1958, 1961,
2008, 2010, 2011).

b.

```javascript
db.albums.aggregate([
  { $addFields: { "score": { $subtract: [501, "$Number"] } } },
  { $out: "albums" }
])
db.albums.find({ Number: 1 })
```

Resultado: `{ "Number" : 1, "Year" : 1967, "Album" : "Sgt. Pepper's Lonely Hearts Club Band",
"Artist" : "The Beatles", "score" : 500 }` — el álbum 1 queda con `score` 500, como se espera de
`501 - 1`.

c.

```javascript
db.albums.aggregate([{ $group: { _id: "$Artist", count: { $sum: "$score" } } }])
```

Resultado (muestra): `Frank Sinatra → 593`, `Ramones → 863`, `The Doors → 688`, `Creedence Clearwater
Revival → 634`, etc.

**Resolución del vault** (verificado con datos de juguete en MongoDB 8.3.11,
mongosh 2.11.1):

```javascript
db.albums.insertMany([
  {Number:1, Year:1967, Album:"Sgt Pepper", Artist:"The Beatles"},
  {Number:2, Year:1967, Album:"Album2", Artist:"Frank Sinatra"},
  {Number:3, Year:1970, Album:"Album3", Artist:"The Beatles"},
  {Number:4, Year:1970, Album:"Album4", Artist:"Frank Sinatra"},
  {Number:5, Year:1970, Album:"Album5", Artist:"Lou Reed"}
]);
db.albums.aggregate([{$group:{_id:"$Year", count:{$sum:1}}},{$sort:{count:-1}}])
// [ { _id: 1970, count: 3 }, { _id: 1967, count: 2 } ]

db.albums.aggregate([{$addFields:{score:{$subtract:[501,"$Number"]}}},{$out:"albums"}]);
db.albums.findOne({Number:1})
// { Number: 1, Year: 1967, Album: 'Sgt Pepper', Artist: 'The Beatles', score: 500 }

db.albums.aggregate([{$group:{_id:"$Artist", count:{$sum:"$score"}}}])
// [ { _id: 'Lou Reed', count: 496 }, { _id: 'The Beatles', count: 998 }, { _id: 'Frank Sinatra', count: 996 } ]
```

Las tres etapas corren igual hoy en un servidor 8.3.11: `$group`/`$sort`/`$addFields`/`$out` son
sintaxis estable del aggregation pipeline (ver
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]]). Lo que **no** corre igual es el
procedimiento de importación: `mongo music` invoca el shell legado, eliminado desde MongoDB 6.0 (ver
[[2.14.01 - mongosh y herramientas de línea de comando|mongosh]]); hoy es `mongosh music`.
`mongoimport --headerline --type csv` sigue siendo la sintaxis correcta de las Database Tools.
`$out: "albums"` sobrescribiendo la propia colección de origen funciona (se verificó), pero es una
práctica de riesgo: si el pipeline falla a mitad de camino no hay forma de recuperar los documentos
sin score. Un `$out` a una colección nueva (`albums_scored`) sería la alternativa más segura, aunque
la consigna original pide agregar el campo "a cada documento", que es justamente lo que hace
sobrescribir la colección.

### Pregunta 2 — Neo4j: grafo Northwind (Cypher)

**Enunciado literal:**

> 1) Importar un dataset provisto por los desarrolladores de Neo4j que contiene productos, categorías
> y proveedores simulando ser una base de datos de un comercio minorista o almacén. Ejecutar el
> comando `:play northwind-graph` desde la interfaz web de Neo4J (con los `:` antes del play). Al
> ejecutarlo dirigirse a la página 2 [...] correr los primeros tres [comandos], que cargan la base a
> través de un `LOAD CSV`. Continuar en la página 3 y ejecutar los únicos 2 comandos disponibles, que
> cargan las relaciones.
>
> 2) Con la base ya cargada, responder:
> a. ¿Cuántos productos hay en la base?
> b. ¿Cuánto cuesta el "Queso Cabrales"?
> c. ¿Cuántos productos pertenecen a la categoría "Condiments"?
> d. Del conjunto de productos que ofrecen los proveedores de "UK", ¿cuál es el nombre y el precio
> unitario de los tres productos más caros?

**Respuesta de la fuente** (resolución de estudiante; incluye una captura del asistente `:play
northwind-graph` en el navegador de Neo4j):

```cypher
// arranque local, y limpieza de datos previos de las prácticas
// $ sudo neo4j start console
MATCH (n) DETACH DELETE n;

// a) cantidad de productos
MATCH (p:Product) RETURN count(p);
// 77

// b) precio del Queso Cabrales
MATCH (p:Product {productName: "Queso Cabrales"}) RETURN p.unitPrice
// 21.0

// c) productos de la categoría Condiments
MATCH (p:Product)-[:PART_OF]-(c:Category {categoryName: "Condiments"}) RETURN count(p);
// 12

// d) tres productos más caros de proveedores de UK
MATCH (n:Supplier {country: "UK"})-[:SUPPLIES]-(p:Product)
RETURN p.productName, p.unitPrice ORDER BY p.unitPrice DESC LIMIT 3
// "Chang" 19.0 · "Chai" 18.0 · "Aniseed Syrup" 10.0
```

**Resolución del vault — Neo4j (tema no dictado aún; se dicta el 19–20/10/2026).** Esta
resolución no se verificó en el motor: **no se pudo correr**. La consulta es plausible por
sí sola: `MATCH ... RETURN count(p)` y `ORDER BY ... LIMIT` son Cypher estándar y coherentes con el
dataset Northwind que el propio tutorial `:play northwind-graph` de Neo4j distribuye (77 productos,
8 categorías, incluido "Condiments"), documentado también en Seven Databases 2ª ed. cap. 6 (impresas
177–209, PDF 188–220), que cubre `MATCH`, patrones de relación y `RETURN` con el mismo dataset de
ejemplo del libro (grafo de actores/películas, no Northwind, pero la sintaxis de patrón es la misma).
El punto d. hace un `MATCH` con patrón no dirigido (`-[:SUPPLIES]-` sin flecha) en vez de dirigido
(`<-[:SUPPLIES]-` o `-[:SUPPLIES]->`): funciona porque Neo4j permite omitir la dirección y recorre la
relación en cualquier sentido, pero es menos preciso que fijarla — con un dataset más grande podría
traer falsos positivos si existiera la relación inversa con otro significado.

### Pregunta 3 — DynamoDB: teorema CAP y diseño de tabla

**Enunciado literal:**

> 1. ¿Cómo se clasifica DynamoDB según el teorema CAP? Justifique brevemente.
> 2. Supongamos que tenemos la siguiente tabla:
>
> | username | high_score | date |
> | --- | --- | --- |
> | mauriciomacri | 100 | 2009-10-31 01:48:52 |
> | alferdez | 200 | 2009-11-11 02:32:12 |
> | RLavagna | 300 | 2010-12-12 01:21:36 |
>
> a. ¿Cuál es la sintaxis para crear la tabla que permita realizar búsquedas por rango para el
> atributo `high_score`? Defina correctamente los tipos de datos.

**Respuesta de la fuente** (respuesta del documento, en prosa):

> "La respuesta depende. Para empezar, garantiza partition tolerance (P) sí o sí. Por un lado está
> orientado a high availability como su predecesor Dynamo entonces podríamos decir que es AP pero,
> también ofrece un modo de 'consistencia fuerte', y como vimos, una consistencia fuerte pierde
> availability. Entonces podemos decir que DynamoDB es AP o CP en ciertos casos (CP cuando dicho modo
> está habilitado)."

```bash
aws dynamodb create-table \
  --table-name Players \
  --attribute-definitions AttributeName=username,AttributeType=S \
    AttributeName=high_score,AttributeType=N \
  --key-schema AttributeName=username,KeyType=HASH \
    AttributeName=high_score,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
```

**Resolución del vault — DynamoDB (tema no dictado aún; se dicta el 02/11/2026).** No hay
entorno DynamoDB disponible para correr el comando: no se verificó en ningún motor. La clasificación
CAP de la fuente es correcta y coincide con el criterio de
[[2.12.04 - Teorema CAP|Teorema CAP]]: P no se elige (todo sistema distribuido la necesita), así que
la decisión real es C o A bajo partición, y DynamoDB expone ambos modos según la operación
(`ConsistentRead` fuerte = CP en ese momento; lectura eventual por defecto = AP). El diseño de tabla
del punto 2 también es correcto: llave primaria compuesta (`HASH` = partition key, `RANGE` = sort
key) es la única forma de habilitar búsquedas por rango en DynamoDB, y los tipos (`S` string, `N`
number) están bien elegidos para `username`/`high_score`. Seven Databases 2ª ed. cap. 7 (impresas 211–257, PDF
221–267) cubre el mismo mecanismo de llave compuesta hash+range y el modelo de consistencia
configurable de DynamoDB, con más detalle que esta respuesta.

### Pregunta 4 — CouchDB: vista map/reduce

**Enunciado literal:**

> 1. Importar el archivo `best_games.json` que contiene los juegos considerados como los mejores
> juegos de cada año desde 1972.
> 2. Crear una vista para devolver los nombres de los juegos que comienzan con las letras T, U, V y W
> y que hayan salido en un año par. a. Mostrar el código fuente de la vista. b. Mostrar la URL que
> devuelve los registros solicitados.

**Respuesta de la fuente** (incluye una captura de la vista creada en Fauxton):

```bash
curl -H "Content-Type: application/json" -X POST -d @best_games.json \
  http://admin:admin@localhost:5984/best_games/_bulk_docs
```

```javascript
// función de la vista (map)
function(doc) {
  var rege = new RegExp("(^T)|(^W)|(^U)|(^V)");
  if ('name' in doc && 'year' in doc) {
    var name = doc.name;
    var even = (doc.year % 2 == 0);
    if (rege.test(name) && even) {
      emit(doc.name, doc.name);
    }
  }
}
```

```bash
curl "http://admin:admin@localhost:5984/best_games/_design/games/_view/very_specific_view"
```

**Resolución del vault — CouchDB (fuera del temario 2026).** No aparece en el cronograma ni en
el programa dictado (ver [[_cronograma]] § *Diferencias con el programa*). No se verificó en el
motor: no se corrió esta importación ni la vista. La función `map` es
correcta como JavaScript de vista de CouchDB: usa `emit(key, value)` para producir un par por
documento que cumple el filtro, que es el mismo patrón de map/reduce que MongoDB deprecó como comando
propio a favor de `$group` (ver [[2.14.03 - MapReduce|MapReduce]]) — la analogía es conceptual, no de
sintaxis: en CouchDB el `map` de una vista es el mecanismo normal y permanente de indexado, no un
comando alternativo a `aggregate`. Seven Databases 2ª ed. cap. 5 (impresas 135–175, PDF 147–187)
desarrolla vistas de CouchDB con el mismo patrón `function(doc) { ... emit(...) }`.

### Pregunta 5 — Redis: geolocalización con `GEOADD`

**Enunciado literal:**

> 1. Se pone a disposición un archivo csv (con los viajes realizados por los taxistas que usan la app
> BAtaxi) para importarlo en Redis utilizando el comando `GEOADD`, considerando los siguientes
> atributos: key → "bataxi", longitude → `origen_viaje_x`, latitude → `origen_viaje_y`, member →
> `id_viaje_r`.
> 2. Dada una lista de tres lugares con sus coordenadas, ¿cuántos viajes se generaron a 1 km de
> distancia de estos 3 lugares?
> 3. ¿Cuántas KEYS hay en la base de datos Redis?
> 4. ¿Cuántos miembros tiene la key `bataxi`?
> 5. ¿Sobre qué estructura de Redis trabaja el `GeoADD`?

**Respuesta de la fuente:**

```bash
docker cp /home/lkarpovich/Bases/bataxi.csv Myredis:/bataxi.csv
docker exec -it Myredis bash
redis-cli
flushall
cat bataxi.csv | awk -F "," '{print $1" "$6" "$7}' | xargs -n3 sh -c 'redis-cli GEOADD bataxi $2 $3 $1' sh
```

```
GEORADIUS bataxi -58.479258 -34.582497 1 km WITHDIST   # Parque Chas → 339
GEORADIUS bataxi -58.468606 -34.658304 1 km WITHDIST   # UTN → 9
GEORADIUS bataxi -58.367862 -34.602938 1 km WITHDIST   # ITBA Madero → 242
# total: 590

KEYS *      # → 1 (bataxi)
ZRANGE bataxi 0 -1   # → 19148 miembros
```

Respuesta a 3 (la fuente da dos lecturas para la ambigüedad de la pregunta): "Asumiendo que la
pregunta es cuántas keys tengo en la db que creé: 1 (bataxi) (`$> keys *`) — si la pregunta era
cuántas puede manejar: 2^32 keys".

Respuesta a 5: "sorted sets".

**Resolución del vault — Redis (tema no dictado aún; se dicta el 26/10/2026).** No se
verificó en el motor: no se pudo correr. La respuesta de la fuente es
conceptualmente correcta: los comandos `GEO*` de Redis (`GEOADD`, `GEORADIUS`, `GEOHASH`) están
implementados sobre un sorted set, donde el score codifica la posición geográfica como un geohash de
52 bits — por eso "sobre qué estructura trabaja `GEOADD`" responde "sorted set" y no "una estructura
geoespacial nueva". Punto (atención): el punto 2 suma manualmente los tres resultados de `GEORADIUS`
en vez de usar `GEOSEARCH`/`GEORADIUS` con una unión, así que si un mismo viaje cae dentro del radio
de dos lugares a la vez (posible con Parque Chas y otros puntos cercanos de Buenos Aires), el total de
590 lo cuenta dos veces; la fuente no aclara si verificó que los tres círculos de 1 km no se
solaparan. Seven Databases 2ª ed. cap. 8 (impresas 259–304, PDF 268–313) cubre sorted sets como
estructura (impresas 268–271) pero no los comandos geoespaciales específicamente, que son una
extensión posterior de Redis sobre el mismo tipo de dato.

### Pregunta 6 — PostgreSQL: búsqueda difusa con `fuzzystrmatch`

**Enunciado literal:**

> 1. En la siguiente URL, vas a encontrar un conjunto de apellidos. a. Crear una tabla con estos
> registros.
> 2. Realizar una consulta que encuentre los apellidos (de más de 4 caracteres) que sean similares
> utilizando la función de distancia de Levenshtein. ¿Cuáles son los 2 apellidos que más se parecen?

**Respuesta de la fuente:**

```sql
CREATE DATABASE parcial;
\c parcial

CREATE TABLE alumnos (
  id INTEGER PRIMARY KEY,
  apellido VARCHAR(255)
);

INSERT INTO alumnos VALUES
  (1, 'ASTIZ MEYER'), (2, 'AIL'), (3, 'BAADER'), (4, 'BACIGALUPO'), (5, 'BALIARDA'),
  (6, 'BENSADON'), (7, 'BERGAGNA'), (8, 'BLACKER'), (9, 'CRAVIOTTO'), (10, 'DAMM'),
  (11, 'DONATH PACCAGNINI'), (12, 'FUSTER'), (13, 'GRASSO'),
  (14, 'JARDIM GONÇALVES FREITAS OLIVAL'), (15, 'KARPOVICH'), (16, 'MARTIN'),
  (17, 'MOMESSO'), (18, 'NEGRO CAINO'), (19, 'OLIVER'), (20, 'OSEROFF'), (21, 'PAGNI'),
  (22, 'PETRIKOVICH'), (23, 'RITORTO'), (24, 'RODRIGUEZ BRIZI'),
  (25, 'TARRADELLAS DEL CAMPO'), (26, 'TERENZIANI'), (27, 'VIDAURRET');

CREATE EXTENSION fuzzystrmatch;

SELECT a1.apellido, a2.apellido
FROM (SELECT * FROM alumnos WHERE apellido LIKE '____%') AS a1
INNER JOIN (SELECT * FROM alumnos WHERE apellido LIKE '____%') AS a2
  ON a2.id > a1.id
ORDER BY levenshtein(a1.apellido, a2.apellido);
-- rta: BAADER - BLACKER
```

**Resolución del vault — PostgreSQL/`fuzzystrmatch` (fuera del temario 2026).** No verificado
en el motor (no se corrió en PostgreSQL). La consulta en sí es correcta en su
lógica: el filtro `LIKE '____%'` (cuatro guiones bajos) exige al menos 4 caracteres, el `INNER JOIN`
con `a2.id > a1.id` evita comparar una fila consigo misma y evita duplicar cada par en ambos sentidos,
y `ORDER BY levenshtein(...)` sin `LIMIT` deja el par de menor distancia primero — la respuesta
"BAADER - BLACKER" (distancia de edición baja: comparten B_A___R) es plausible a ojo, aunque sin
poder correrla no se puede confirmar que sea *el* mínimo global entre las 27 filas. La cursada 2026 no
cubre `fuzzystrmatch`, `levenshtein` ni comparación difusa de texto en ningún motor (ni en la parte
MySQL ni en la NoSQL), aunque el DDL/DML básico
(`CREATE TABLE`, `INSERT`) sí es el mismo que se dicta en Clase 03–04, solo que sobre MySQL en vez de
PostgreSQL.

## Qué enseña para el parcial 2026

- El **aggregation pipeline de MongoDB** (Pregunta 1) es el contenido más directamente reutilizable:
  `$group`, `$sort`, `$addFields` y `$out` son sintaxis estable, y el patrón "agrupar y sumar, agregar
  un campo derivado, agrupar de nuevo" es exactamente el tipo de encadenamiento de etapas que puede
  aparecer en el parcial 2026.
- El **criterio CAP** (Pregunta 3.1) — que P no se elige y la decisión real es C o A — es examinable
  tal cual está planteado en la fuente, con cualquier motor NoSQL como excusa.
- Los comandos de shell legado (`mongo`, en vez de `mongosh`) son una trampa de examen viejo: si
  aparece un comando así en una fuente de estudio, hay que traducirlo antes de repetirlo.
- El resto (Neo4j, DynamoDB, CouchDB, Redis, `fuzzystrmatch`) sirve como panorama de qué evaluaba
  esta materia antes, no como práctica directa: son temas que 2026 dicta más tarde, dicta distinto, o
  no dicta.

## Dudas abiertas

- (abierto) No se pudo confirmar si "BAADER - BLACKER" es efectivamente el par de menor distancia de
  Levenshtein entre las 27 filas: requeriría correr la consulta completa en PostgreSQL (no
  verificado en el motor).
- (abierto) El cálculo de "590 viajes a 1 km" del ejercicio de Redis no descarta el doble conteo si
  los círculos de 1 km alrededor de los tres puntos se superponen.

## Enlaces

- [[_cronograma]]
- [[Clase 12 - Introduccion a NoSQL]] · [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] · [[Clase 14 - MongoDB Features]]
- [[Práctica 2026-08-04]] (DDL/DML básico)
- [[2.12.04 - Teorema CAP|Teorema CAP]] · [[2.12.08 - Aggregation pipeline|Aggregation pipeline]] · [[2.14.01 - mongosh y herramientas de línea de comando|mongosh]] · [[2.14.03 - MapReduce|MapReduce]]
- [[Mapa de exámenes]]
