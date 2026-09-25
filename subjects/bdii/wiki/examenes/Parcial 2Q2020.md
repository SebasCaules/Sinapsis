---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - PostgreSQL — importación CSV, similitud de texto (fuzzystrmatch, pg_trgm)
  - MongoDB — find, update masivo, aggregate
  - CouchDB — vistas map/reduce, STATS
  - Neo4j — Cypher sobre grafo social
  - Redis — sorted sets, TTL
  - ElasticSearch — bulk import, match query
fecha: 2020-10-13
cuatrimestre: 2Q2020
temario: anterior
fuentes:
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2020 - Resuelto (10 puntos).pdf"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2020 - Resuelto (10 puntos).docx"
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2020 - Resuelto (10 puntos)(1).docx"
estado: procesado
resumen: "Parcial práctico domiciliario del 13/10/2020, 3.5 horas: seis ejercicios sobre PostgreSQL, MongoDB, CouchDB, Neo4j, Redis y ElasticSearch, resueltos por un estudiante que sacó 10 puntos según el rótulo de la fuente."
aliases:
  - Parcial 2Q2020
  - Parcial Bases de Datos II 2Q2020
  - 2Q2020 - Resuelto (10 puntos)
---

# Parcial 2Q2020 — parcial práctico domiciliario, seis motores, 3.5 horas

## Resumen general

Parcial práctico del segundo cuatrimestre de 2020, dictado el 13 de octubre de 2020 (la fuente trae
la fecha en el encabezado), con una duración fija de 3.5 horas (18:00 a 21:30), a entregar en un
GoogleDoc compartido con los docentes y exportado a PDF por Campus. El rótulo de archivo
"Resuelto (10 puntos)" indica que esta resolución sacó la nota máxima, según quien archivó el
material, aunque no hay corrección docente visible en la fuente que lo confirme de forma
independiente. Evalúa seis motores en seis ejercicios de varias consignas cada uno: PostgreSQL
(importar CSV y encontrar nombres fonéticamente similares), MongoDB (filtro con regex, actualización
masiva y `aggregate`), CouchDB (vista map/reduce y estadísticas), Neo4j (Cypher sobre un grafo social
de Twitter), Redis (estructura de datos para un leaderboard, con TTL) y ElasticSearch (bulk import y
conteo de coincidencias de una frase). El formato — comando por comando, con capturas de pantalla y
horario de inicio/fin por ejercicio — es el mismo que el resto de la familia de parciales viejos de
esta cátedra, y muy distinto del parcial 2026 (13/10/2026, sobre MySQL en la mitad relacional).

De los seis motores, solo **MongoDB** sigue dictándose igual en 2026; el resto o todavía no se dictó
(Neo4j, Redis) o quedó definitivamente fuera del temario actual (CouchDB, ElasticSearch), y
PostgreSQL aparece acá por una función de similitud de texto (`fuzzystrmatch`) que tampoco forma
parte de la cursada 2026. Lo más aprovechable para el 13/10/2026 es el ejercicio de MongoDB completo
y, en menor medida, la lógica de agrupamiento con `aggregate` del ejercicio de CouchDB (aunque en un
motor distinto).

> [!info] Fuente
> Tres archivos del mismo examen: `2Q2020 - Resuelto (10 puntos).pdf`, su `.docx` y una segunda copia
> del `.docx` con el sufijo `(1)`. Autor: un estudiante de una cursada anterior de 72.41 (no
> identificado por nombre en el texto). **No es material oficial**: es una entrega ya corregida, con
> el rótulo "10 puntos" puesto por quien archivó el material, no una devolución docente visible en el
> documento. Las dos variantes del `.docx` tienen el mismo texto y las mismas 16 capturas de pantalla
> (`image1.png` + `image11.png` a `image25.png`), solo que Pandoc las extrajo con distinta numeración
> interna de archivo entre una variante y otra: es un artefacto de la extracción, no una diferencia de
> contenido. La única diferencia real de contenido encontrada: la variante `(1)` transcribe como
> texto el comando `cat gnews.tsv | couchimport --url http://admin:password@localhost:5984 --db
> noticias` antes de la captura de pantalla del ejercicio de CouchDB, mientras que la variante base
> deja ese mismo paso solo como imagen, sin transcribir el comando. El PDF coincide con la variante
> que sí transcribe el comando como texto.

## Formato

Examen práctico domiciliario, individual, con duración fija de **3.5 horas** (18:00–21:30) y entrega
por GoogleDoc exportado a PDF. Seis ejercicios (I a VI), cada uno con varias consignas (a, b, c, …).
Todas las consignas piden ejecutar comandos o consultas y mostrar el procedimiento y el resultado
(capturas de pantalla o texto plano según el caso); no hay opción múltiple ni V/F. No se documenta un
esquema de puntaje por ejercicio en el enunciado (a diferencia del recuperatorio del mismo
cuatrimestre, que sí pondera un ejercicio "x2").

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| I.a | Importar CSV a PostgreSQL (`COPY`) | PostgreSQL (texto plano) | Clase 02–05 (concepto DDL/DML, en MySQL) |
| I.b | Similitud fonética: `metaphone`, `levenshtein`, `pg_trgm` | PostgreSQL — texto plano *(fuera del temario 2026)* | — |
| II.a | Importar JSON a MongoDB (`mongoimport`) | [[2.14.01 - mongosh y herramientas de línea de comando\|mongosh]] | Clase 14 / Práctica 2026-09-15 |
| II.b | `find` con `$regex` y `$gt` sobre campo anidado | [[2.12.07 - CRUD y consultas en MongoDB\|CRUD en MongoDB]] | Clase 12–14 |
| II.c | Actualización masiva documento por documento | [[2.12.07 - CRUD y consultas en MongoDB\|CRUD en MongoDB]] | Clase 12–14 |
| II.d | `aggregate` con `$group`/`$sort` | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 12–14 |
| III.a–d | Vistas map/reduce, `STATS` | CouchDB — texto plano *(fuera del temario 2026)* | — |
| IV.a–c | Cypher sobre grafo social (`FOLLOWS`, `POSTS`) | Neo4j — texto plano *(tema no dictado aún; se dicta el 19–20/10)* | — |
| V.a–e | Sorted set como leaderboard, `EXPIRE` | Redis — texto plano *(tema no dictado aún; se dicta el 26/10)* | — |
| VI.a–c | Bulk import y `match` con `min_score` | ElasticSearch — texto plano *(fuera del temario 2026)* | — |

## Preguntas

### Pregunta I — PostgreSQL: importar Panama Papers y buscar nombres similares

**Enunciado literal:**

> I. Postgresql
> a. Importar el siguiente archivo a la base de datos (mostrar los comandos utilizados o una captura
> de pantalla en caso de usar una IDE)
> b. Suponga que está implementando un mecanismo de búsqueda y el usuario escribe con errores, se
> pide buscar los 10 primeros nombres distintos que suenen parecido a "franccisscco". Mostrar los
> nombres en minúscula. (Nota: esta consulta dejarla en texto plano, no una captura de pantalla.
> Mostrar también el resultado de la ejecución)

**Respuesta de la fuente** (resolución de estudiante, "10 puntos" según el rótulo del archivo):

```sql
CREATE TABLE papers (
  node_id INT PRIMARY KEY,
  name varchar(255),
  country_code varchar(32),
  country varchar(255),
  sourceId text,
  valid_until text,
  note text
);

COPY papers FROM '/Users/gonzalo/Desktop/Parcial_1_BD2/panama_papers.nodes.officer.csv'
  DELIMITER ',' CSV HEADER;
```

```sql
CREATE EXTENSION fuzzystrmatch;
CREATE EXTENSION tablefunc;
CREATE EXTENSION dict_xsyn;
CREATE EXTENSION pg_trgm;

SELECT LOWER(name)
FROM (SELECT DISTINCT(LOWER(name)) AS name FROM papers GROUP BY LOWER(name)) AS aux
WHERE metaphone(aux.name, 10) % metaphone('franccisscco', 10)
ORDER BY levenshtein(LOWER('franccisscco'), LOWER(aux.name))
LIMIT 10;
```

Resultado: `francisco caro`, `franco olmo`, `francois frote`, `franco sarli`, `francois calldo`,
`francois cadet`, `franco canzi`, `franc dreu`, `franco rossi`, `franco sanchez`.

**Resolución del vault — PostgreSQL/`fuzzystrmatch` y `pg_trgm` (fuera del temario 2026).** No
verificado en el motor (no se corrió en PostgreSQL), y el dataset (`panama_papers.nodes
.officer.csv`, el volcado de los Panama Papers) no está en `raw/`. La lógica es correcta: `%` es el
operador de similitud de `pg_trgm` (trigramas), y usarlo junto a `metaphone(...) % metaphone(...)`
filtra primero por semejanza fonética (haciendo trigramas sobre la codificación fonética, no sobre el
nombre literal) y después ordena por distancia de edición real con `levenshtein`, que es una
combinación razonable para tolerancia a errores de tipeo. El nombre buscado
("franccisscco") tiene errores de tipeo deliberados (letras dobladas) sobre "francisco", y el primer
resultado ("francisco caro") es plausible como más cercano. La cursada actual no cubre
`fuzzystrmatch`, `pg_trgm` ni comparación fonética/difusa en ningún motor. El `COPY ... FROM` con una
ruta absoluta del sistema de archivos del servidor es
sintaxis de PostgreSQL server-side (requiere que el archivo sea legible por el proceso `postgres`, no
por el cliente); el equivalente cliente-side sería `\copy` desde `psql`, distinción que la fuente no
menciona.

### Pregunta II — MongoDB: `restaurants.json`

**Enunciado literal:**

> II. MongoDB
> a. Importar el archivo `restaurant.json`
> b. Listar los restaurantes (solo mostrar los atributos: name y address) que cumplan las siguientes
> condiciones: que el campo 'name' que contenga la cadena 'mon' y el score sea mayor a 25.
> c. Realizar una actualización masiva del atributo 'borough' llevándolo a mayúscula (sin alterar el
> resto del documento)
> d. Mostrar la cantidad de restaurantes por vecindario (atributo: borough), ordenados de mayor a
> menor.

**Respuesta de la fuente:**

```bash
docker start 8106f883582b
docker cp restaurants.json mongodb:/restaurants.json
sudo docker exec -it mongodb bash
mongoimport --db restaurants --collection restaurants --type json restaurants.json
mongo restaurants
db.restaurants.count()
```

```javascript
// b)
db.restaurants.find(
  { $and: [
    { 'name': { $regex: 'mon', $options: 'i' } },
    { 'grades.score': { $gt: 25 } }
  ] },
  { "name": 1, "address": 1, "_id": 0 }
);
```

Resultado (7 restaurantes, entre ellos): `Lb Spumoni Gardens`, `Bamonte'S Restaurant`, `Omonia Cafe`,
`Monte'S`, `Delmonico Gourmet`, `Harmonie Club`, `Neil Simon Theatre`.

```javascript
// c)
db.restaurants.find().forEach(function (doc) {
  var upperDistrict = doc.borough.toUpperCase();
  doc.borough = upperDistrict;
  db.restaurants.save(doc);
});
```

```javascript
// d)
db.restaurants.aggregate([
  { $group: { _id: '$borough', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

Resultado: `MANHATTAN → 1883`, `QUEENS → 738`, `BROOKLYN → 684`, `BRONX → 309`,
`STATEN ISLAND → 158`.

**Resolución del vault** (verificado con datos de juguete en MongoDB 8.3.11, mongosh 2.11.1):

```javascript
db.restaurants.insertMany([
  {name:"Bamontes Restaurant", borough:"brooklyn", address:{building:"32",street:"Withers St"}, grades:[{score:30},{score:10}]},
  {name:"Monte Cafe", borough:"queens", address:{building:"5",street:"Main St"}, grades:[{score:10}]},
  {name:"Pizza Place", borough:"brooklyn", address:{building:"7",street:"2nd Ave"}, grades:[{score:5}]},
  {name:"Harmonie Club", borough:"manhattan", address:{building:"4",street:"E 60"}, grades:[{score:40}]}
]);

db.restaurants.find(
  {$and: [{name:{$regex:"mon",$options:"i"}}, {"grades.score":{$gt:25}}]},
  {name:1, address:1, _id:0}
).toArray()
// [ { name: 'Bamontes Restaurant', address: {...} }, { name: 'Harmonie Club', address: {...} } ]
```

El filtro b. corre igual y da el resultado esperado (dos de los cuatro documentos de juguete
cumplen). Punto (atención): el paso c. de la fuente usa `db.restaurants.save(doc)`, que en
`mongosh` 2.11.1 **ya no existe** —

```
TypeError: db.restaurants.save is not a function
```

— confirmado al intentar reproducirlo tal cual. `save()` es un método del driver legado que MongoDB
retiró; el equivalente vigente es `updateOne`/`replaceOne`:

```javascript
db.restaurants.find().forEach(function (doc) {
  db.restaurants.updateOne({ _id: doc._id }, { $set: { borough: doc.borough.toUpperCase() } });
});
db.restaurants.find({}, { name: 1, borough: 1, _id: 0 }).toArray()
// [ { name: 'Bamontes Restaurant', borough: 'BROOKLYN' }, { name: 'Monte Cafe', borough: 'QUEENS' },
//   { name: 'Pizza Place', borough: 'BROOKLYN' }, { name: 'Harmonie Club', borough: 'MANHATTAN' } ]

db.restaurants.aggregate([{$group:{_id:"$borough", count:{$sum:1}}}, {$sort:{count:-1}}]).toArray()
// [ { _id: 'BROOKLYN', count: 2 }, { _id: 'QUEENS', count: 1 }, { _id: 'MANHATTAN', count: 1 } ]
```

Este es el hallazgo más útil de este examen para 2026: cualquier resolución vieja que use
`.save(doc)` sobre una colección hay que reescribirla con `updateOne`/`replaceOne` antes de
entregarla — es exactamente el tipo de sintaxis de shell legado que
[[2.14.01 - mongosh y herramientas de línea de comando|mongosh]] advierte que cambió. El resto (`find`
con `$regex`/`$options: 'i'`, `aggregate` con `$group`/`$sort`) corre sin cambios.

### Pregunta III — CouchDB: vista de conteo de palabras y `STATS`

**Enunciado literal:**

> III. CouchDB
> a. Importar el siguiente archivo de noticias
> b. Crear una vista para ver cuántas veces se menciona cada una de las palabras que aparecen en los
> títulos. Tomar únicamente palabras formadas por letras mayúsculas o minúsculas (con o sin tilde),
> case insensitive, eliminando cualquier otro caracter especial que pueda aparecer.
> c. ¿Cuántas veces aparece la palabra "dólar" en los títulos?
> d. ¿Cuál es el valor máximo del atributo 'Size' usando una vista de CouchDB?

**Respuesta de la fuente:**

```bash
docker cp gnews.tsv my-couchdb:/gnews.tsv
sudo docker exec -it my-couchdb bash
export COUCH_ROOT_URL=http://admin:password@localhost:5984
cat gnews.tsv | couchimport --url http://admin:password@localhost:5984 --db noticias
curl "${COUCH_ROOT_URL}/noticias/"
# "doc_count": 640
```

```javascript
// _design/titles/_view/by_word — Mapper
function (doc) {
  var words = doc.Title.toLowerCase()
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚ ]+/g, "")
    .toLowerCase()
    .split(" ");
  for (var word in words) {
    if (words[word] !== "") {
      emit(words[word], 1);
    }
  }
}
// Reducer (custom)
function (key, values, rereduce) {
  return sum(values);
}
```

```bash
curl "${COUCH_ROOT_URL}/noticias/_design/titles/_view/by_word?group=true&key=%22d%C3%B3lar%22"
# {"rows":[{"key":"dólar","value":8}]}
```

```javascript
// _design/news/_view/stats — Mapper
function (doc) { emit("stats", parseInt(doc.Size, 10)); }
// Reducer: STATS (built-in)
```

```bash
curl "${COUCH_ROOT_URL}/noticias/_design/news/_view/stats?group=true&limit=10"
# {"rows":[{"key":"stats","value":{"sum":79825,"count":640,"min":1,"max":4852,"sumsqr":119677057}}]}
# máximo: 4852
```

**Resolución del vault — CouchDB (fuera del temario 2026).** No se verificó en el motor: no
se pudo correr. La vista `by_word` es correcta como patrón map/reduce: el `replace` con la clase de
caracteres `[^a-zA-ZáéíóúÁÉÍÓÚ ]+` en efecto deja pasar solo letras (con o sin tilde) y espacios, y el
reducer `sum(values)` es el reducer estándar para contar ocurrencias por clave — equivalente
conceptual a `$group`/`$sum` en MongoDB (ver [[2.12.08 - Aggregation pipeline|Aggregation pipeline]]),
aunque la implementación (vista persistente indexada incrementalmente vs. pipeline ejecutado por
consulta) es distinta. El uso del reducer incorporado `STATS` para el punto d. es la forma idiomática
de CouchDB de obtener min/max/sum/count en una sola pasada, sin tener que escribir un reducer propio.
Seven Databases 2ª ed. cap. 5 (impresas 135–175, PDF 147–187) cubre vistas y reducers de CouchDB con
el mismo patrón.

### Pregunta IV — Neo4j: grafo social (proyecto Twitter)

**Enunciado literal:**

> IV. Neo4J. Usando el Sandbox de Neo4J, con el proyecto de Twitter:
> a. Encontrar las 10 cuentas que seguís con más seguidores, ordenadas de mayor a menor cantidad de
> seguidores. Mostrar sólo el nombre de la cuenta como "account" y la cantidad de followers como
> "followers".
> b. Encontrar quienes de las cuentas que seguís te siguen. Mostrar sólo el nombre como "user".
> c. Encontrar tu tweet más exitoso (que tiene más favorites). Mostrar el contenido (text) del tweet
> como "content" y la cantidad de favoritos como "likes".

**Respuesta de la fuente:**

```cypher
// a)
MATCH (follower:User)<-[:FOLLOWS]-(u:User:Me)
RETURN follower.screen_name AS account, follower.followers AS followers
ORDER BY followers DESC
LIMIT 10
```

Resultado (top 3): `YouTube → 72207586`, `CNN → 50073487`, `nytimes → 47507087`.

```cypher
// b)
MATCH (me:User:Me)-[:FOLLOWS]->(f)
WHERE (f)-[:FOLLOWS]->(me)
WITH f.screen_name AS user
RETURN user
```

Resultado: `aaizemberg`, `JuliTallar` (dos seguidores mutuos; nótese que uno de los dos es la cuenta
de una de las docentes de la materia según el correo de contacto del enunciado del parcial).

```cypher
// c)
MATCH (me:User:Me)-[:POSTS]->(t)
WITH t.favorites AS likes, t.text AS content
ORDER BY likes DESC
RETURN content, likes
LIMIT 1
```

**Resolución del vault — Neo4j (tema no dictado aún; se dicta el 19–20/10/2026).** No se
verificó en el motor: no se pudo correr. La query a. tiene un
detalle (atención) a marcar: usa el patrón `(follower)<-[:FOLLOWS]-(u:User:Me)`, es decir, relaciones
que **apuntan hacia** `u:Me` — eso son las cuentas que siguen a "mí", no las que "yo" sigo. Para "las
cuentas que seguís" (como pide el enunciado) el patrón correcto sería
`(me:User:Me)-[:FOLLOWS]->(follower:User)`, con la flecha en sentido contrario. Es posible que en el
dataset real de ese sandbox de Twitter la relación `FOLLOWS` esté modelada al revés de lo esperable
(de seguidor hacia seguido en vez de de seguidor hacia seguido), en cuyo caso la consulta de la fuente
sí sería correcta para ese modelo puntual — pero sin poder correrla contra el dataset original no se
puede confirmar cuál de las dos lecturas es la real, y la fuente no lo aclara. La query b., en
cambio, sí es internamente consistente (usa la misma dirección en el `MATCH` y en el `WHERE`), así
que sea cual sea la convención del dataset, a. y b. deberían usar la misma dirección de flecha entre
sí — y no la usan, lo que sostiene la duda. Seven Databases 2ª ed. cap. 6 (impresas 177–209, PDF
188–220) cubre el mismo patrón `MATCH ... WHERE ... RETURN` con `WITH` intermedio.

### Pregunta V — Redis: leaderboard de Fortnite con TTL

**Enunciado literal:**

> V. Redis. Se quiere llevar contabilización de los partidos ganados de los mejores jugadores del
> Fortnite (esta tabla tiene los siguientes atributos: player_name, player_url, player_wins,
> player_matches).
> a. ¿Qué estructura de datos vas a utilizar para cargar esta tabla de posiciones? Solo interesa los
> partidos ganados, no la cantidad de veces que jugaron.
> b. Cargar estos datos y mostrar el procedimiento utilizado.
> c. Sumarle 10 partidos ganados al jugador Mixer Ship y 20 a zRotation
> d. Obtener el podio ganador (top 3)
> e. Juego terminado. Queremos que este `fortnite_leaderboard` se mantenga activo durante dos minutos
> más y luego se elimine automáticamente. Ejecute el comando correspondiente.

**Respuesta de la fuente** (con una nota propia del estudiante sobre el orden real en que trabajó):

> "NOTA: Tardé mucho porque tenía problemas para importar el CSV, y pasé al de Elasticsearch para no
> atrasarme."

```bash
docker start 0d35eed45afd
docker cp fortnite.csv redis:/fortnite.csv
sudo docker exec -it redis bash
mv fortnite.csv data/
cat fortnite.csv | awk -F "," '{print "ZADD scores " $3 " \"" $1 "\""}' | redis-cli --pipe
```

```
ZINCRBY scores 10 "Mixer Ship"
ZINCRBY scores 20 "zRotation"

ZREVRANGEBYSCORE scores +inf -inf WITHSCORES LIMIT 0 3
# 1) "Mixer Ship" 2) "15992" 3) "efgXBL" 4) "10441" 5) "zRotation" 6) "10403"

EXPIRE scores 120
```

Respuesta a a.: "Usaría un sorted set, en donde las claves son los nombres y los scores asociados son
los partidos ganados."

**Resolución del vault — Redis (tema no dictado aún; se dicta el 26/10/2026).** No se
verificó en el motor: no se pudo correr. La elección de estructura (sorted set,
miembro = nombre del jugador, score = partidos ganados) es la correcta para un leaderboard: permite
`ZINCRBY` para sumar puntaje sin leer-modificar-escribir manualmente, y `ZREVRANGEBYSCORE`/`ZRANGE ...
REV` para el ranking ordenado en O(log N). `EXPIRE scores 120` pone un TTL de 120 segundos sobre la
**key** completa (todo el sorted set), que es lo que pide el enunciado ("que este
`fortnite_leaderboard` se mantenga activo... y luego se elimine automáticamente"): funciona sobre
cualquier tipo de dato en Redis, no es específico de sorted sets. Punto (atención) de fidelidad de la
fuente, no de la resolución: los horarios declarados de Redis (19:20–20:44) y de ElasticSearch
(20:03–20:20) se superponen — según la nota, el estudiante pasó a ElasticSearch en medio de este
ejercicio y volvió después, pero los horarios de inicio/fin transcriptos no reflejan esa
interrupción con precisión. No cambia la validez de los comandos, pero es un recordatorio de que los
timestamps de este tipo de examen domiciliario no son confiables como cronología exacta. Seven
Databases 2ª ed. cap. 8 (impresas 259–271, PDF 268–280) cubre sorted sets como estructura de datos.

### Pregunta VI — ElasticSearch: importar Shakespeare y contar coincidencias

**Enunciado literal:**

> VI. ElasticSearch. En este ejercicio vamos a analizar un dataset de las obras de Shakespeare.
> a. Importar este archivo a ElasticSearch.
> b. ¿Cuántos registros se importaron?
> c. ¿Cuántas veces aparece la frase "O Romeo" en la obra "Romeo and Juliet", sin importar quien lo
> diga? El atributo "play_name" nos indica la obra y el atributo "text_entry" nos indica el texto de
> algún diálogo. (hint: min_score sugerido = 20)

**Respuesta de la fuente:**

```bash
docker cp shakespeare_dataset.json elastic:/shakespeare_dataset.json
sudo docker exec -it elastic bash
curl -XPOST "localhost:9200/shakespeare/_doc/_bulk?pretty" -H "Content-Type: application/json" \
  --data-binary @shakespeare_dataset.json

curl -XGET localhost:9200/shakespeare/_count
# 111396
```

```bash
curl -X GET "localhost:9200/shakespeare/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "min_score": 14,
  "query": {
    "bool": {
      "must": { "match": { "text_entry": "O Romeo" } },
      "filter": { "match": { "play_name.keyword": "Romeo and Juliet" } }
    }
  }
}'
# resultado: 3
```

**Resolución del vault — ElasticSearch (fuera del temario 2026).** No se verificó en el motor:
no se pudo correr. Punto (atención): el enunciado sugiere `min_score = 20`, pero la fuente usa
`min_score = 14` y lo justifica explícitamente ("Defino un score de 14 porque ninguna llega a 20"),
es decir, la resolución **se aparta a propósito del hint del enunciado** porque, según reporta,
ningún resultado alcanzaba el umbral sugerido — una discrepancia que la propia fuente documenta y
razona, no un error silencioso. Sin poder correr la consulta contra el dataset real de Shakespeare no
se puede verificar si 3 es el conteo correcto con `min_score: 14`, ni si existía una frase que sí
superara 20 con una consulta formulada de otra manera (por ejemplo, con `match_phrase` en vez de
`match`, que exige orden y adyacencia de los términos y typicamente da un `_score` más alto para una
frase exacta como "O Romeo"). `play_name.keyword` como `filter` (no `must`) es correcto: separa el
filtro exacto (no afecta el score) de la búsqueda de texto relevante (sí afecta el score), que es la
combinación estándar de `bool` query.

## Qué enseña para el parcial 2026

- El ejercicio de **MongoDB completo** (II) es el más transferible: `find` con `$regex`, filtros
  sobre campos anidados con notación de punto (`grades.score`), y `aggregate` con `$group`/`$sort`
  son exactamente el tipo de consulta que puede pedirse en 2026.
- El hallazgo de `db.collection.save()` ya no existe en el shell actual es una trampa concreta:
  cualquier resolución de examen viejo que use `.save(doc)` para persistir un documento modificado
  hay que traducirla a `updateOne`/`replaceOne` antes de repetirla.
- El patrón "filtro exacto en `filter`, texto relevante en `must`" del ejercicio de ElasticSearch —y
  su equivalente "`$match` para filtrar, agregación aparte para lo relevante"— es un principio de
  diseño de consultas que trasciende el motor puntual, aunque ElasticSearch en sí no se evalúe en
  2026.
- Verificar la dirección de una relación (`->` vs. `<-`) antes de confiar en un patrón Cypher copiado:
  el ejercicio IV.a de este examen es un caso concreto de cómo una flecha en el sentido equivocado
  cambia el significado completo de la consulta.

## Dudas abiertas

- (abierto) No se pudo confirmar contra el dataset original si la query IV.a de Neo4j usa la
  dirección correcta de la relación `FOLLOWS` para ese sandbox específico de Twitter.
- (abierto) No se pudo verificar si `min_score: 14` en la consulta de ElasticSearch da el conteo real
  de 3 menciones de "O Romeo" en "Romeo and Juliet", ni si una consulta con `match_phrase` habría
  alcanzado el `min_score: 20` que sugería el enunciado.

## Enlaces

- [[_cronograma]]
- [[Clase 12 - Introduccion a NoSQL]] · [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] · [[Clase 14 - MongoDB Features]] · [[Práctica 2026-09-15]]
- [[2.12.07 - CRUD y consultas en MongoDB|CRUD en MongoDB]] · [[2.12.08 - Aggregation pipeline|Aggregation pipeline]] · [[2.14.01 - mongosh y herramientas de línea de comando|mongosh]]
- [[Parcial 1Q2020]] · [[Recuperatorio 2Q2020]]
- [[Mapa de exámenes]]
