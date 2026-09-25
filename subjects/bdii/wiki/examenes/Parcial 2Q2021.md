---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - Búsqueda fonética/difusa en SQL
  - Agrupamiento en MongoDB
  - Estructuras clave-valor en Redis
  - Distancia y proximidad geoespacial
  - Modelado de grafos en Neo4j
fecha: 2021-10-26
cuatrimestre: 2Q2021
temario: anterior
fuentes:
  - raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2021.pdf
  - raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/2Q2021 - Datasets.pdf
estado: procesado
resumen: "Parcial domiciliario 2Q2021 (26/10/2021, 6h): tweets del debate presidencial en TN y GPS de una flota, a importar en PostgreSQL/MongoDB/CouchDB/ElasticSearch/Redis/Neo4j. Sin solucionario; el vault resuelve en MySQL y MongoDB con datos de juguete y marca el resto como no dictado o fuera del temario."
aliases:
  - Parcial 2Q2021
  - 2Q2021
  - Parcial octubre 2021
  - Parcial del debate
---

# Parcial 2Q2021 — tweets del debate y GPS en seis motores distintos

## Resumen general

Parcial domiciliario del segundo cuatrimestre de 2021 (26/10/2021), individual, con 6 h de plazo
(15:00 a 21:00) y entrega por mail a los docentes en PDF. Se aprueba con 5 de los 10 puntos totales,
en diez ejercicios sobre dos datasets: una muestra de 8.897 tweets posteriores al debate presidencial
televisado en TN ("A dos voces", con los hashtags `#DebateBuenosAires` y `#DebateBsAs`) y la misma
actividad GPS de una flota de vehículos del parcial 1Q2021 (VAST Challenge 2021, 685.169 filas). El
dataset de tweets se importa en PostgreSQL, MongoDB, CouchDB, ElasticSearch y Redis, con un ejercicio
por motor más tres de Neo4j sobre el subconjunto de retweets; el GPS se importa "en el motor que
recomendamos durante las clases que tratamos el tema de datos espaciales/geográficos" — sin nombrarlo
explícitamente en el enunciado.

Es, igual que el 1Q2021, un examen **sin solucionario**: todo lo etiquetado "Resolución del vault" es
producción propia sobre datos de juguete, nunca del dataset real (que no está en el vault). El
`Datasets.pdf` que acompaña al enunciado aporta un ejemplo completo de documento de tweet y aclara un
detalle que el enunciado principal no explicita: el campo `is_rt` **no** hay que usarlo en ninguna
consulta para detectar retweets — hay que mirar si `text` empieza con `"RT @"`. El temario es
**anterior** al de la cursada 2026 (PostgreSQL en vez de MySQL, más CouchDB, ElasticSearch, Redis y
Neo4j, ninguno de los cuatro en el programa 2026 antes del parcial del 13/10). Lo transferible al
parcial 2026 es, otra vez, el patrón de cada ejercicio en MySQL y MongoDB: búsqueda fonética
aproximada, agrupamiento con exclusión de un subconjunto (aquí, los retweets) y cálculo de distancias
geoespaciales.

> [!info] Fuente
> - `2Q2021.pdf` — enunciado principal, 3 páginas. Publicado por la cátedra (Aizemberg/Rodríguez) en
>   el repositorio de exámenes viejos de estudiantes; no es material oficial archivado en el campus
>   de 2026. Aporta el enunciado, la tabla de puntajes y la nota al pie sobre `friends_count` y
>   `followers_count` como máximos ("¹max", "²max" en la pregunta 5).
> - `2Q2021 - Datasets.pdf` — 2 páginas, con el detalle de los dos datasets: los hashtags recuperados,
>   un ejemplo completo de documento de tweet (campo por campo, con la aclaración de no usar `is_rt`),
>   las URLs de descarga y la instrucción de modelado para Neo4j (`Usuario1 (generador) → tweet → Usuario2
>   (retuiteador)`). No trae respuestas ni capturas: es una ampliación de la consigna, no un
>   solucionario.

## Formato

- **Diez ejercicios**, todos de resolución práctica.
- **Puntaje total: 10 puntos** (aprueba con 5), repartidos `1, 1, 1, 1, 1, 0.5, 0.5, 1, 2, 1` en los
  ejercicios 1 a 10.
- **Duración:** 6 h, de 15:00 a 21:00 del 26/10/2021 — media hora menos que el 1Q2021.
- **Modalidad:** domiciliario e individual, entrega por mail a los docentes (a diferencia del
  1Q2021, que se entregaba por Campus). Mismo requisito de capturas de pantalla y horarios de inicio
  y fin por ejercicio, que no aplica a esta página por resolver sobre datos de juguete.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1 | Búsqueda fonética de texto (`metaphone`, PostgreSQL) | [[1.05.01 - SQL — consultas\|SQL — consultas]] *(funciones de texto; la fonética no se dicta)* | Clase 05 |
| 2 | Búsqueda difusa (*fuzzy search*) | ElasticSearch — texto plano *(fuera del temario 2026)* | — |
| 3 | Agrupamiento con exclusión de subconjunto, top-N en MongoDB | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 14 · [[Práctica 2026-09-15\|TP9 Parte I]] |
| 4 | Vista de conteo sin orden en CouchDB | CouchDB — texto plano *(fuera del temario 2026)* | — |
| 5 | Máximos por clave en Redis | Redis — texto plano *(tema no dictado aún; se dicta el 26–27/10)* | — |
| 6 | Conteo de nodos y relaciones en un grafo | Neo4j — texto plano *(tema no dictado aún; se dicta el 19–20/10)* | — |
| 7 | Detección de generadores de contenido original | Neo4j — texto plano *(tema no dictado aún)* | — |
| 8 | Detección de auto-retweets | Neo4j — texto plano *(tema no dictado aún)* | — |
| 9 | Distancia recorrida por vehículo, ordenada | [[2.14.02 - Índices en MongoDB\|geoespacial en MongoDB]] | [[Práctica 2026-09-22\|TP9 Parte II]] |
| 10 | Proximidad a un punto WKT | [[2.14.02 - Índices en MongoDB\|geoespacial en MongoDB]] | [[Práctica 2026-09-22\|TP9 Parte II]] |

## Dataset 1 — tweets del debate (TN, "A dos voces")

Columnas: `date`, `screen_name`, `text`, `fav`, `retweet`, `url`, `is_rt`, `followers_count`,
`friends_count`. 8.897 filas, unión de los hashtags `#DebateBuenosAires` y `#DebateBsAs`. El
`Datasets.pdf` aclara: **no usar el campo `is_rt` en ninguna consulta** — un tweet es retweet si
`text` empieza con `"RT @"`, y el usuario originador es lo que sigue a `"RT @"` hasta `": "`.

### Pregunta 1 — búsqueda fonética con `metaphone` (PostgreSQL)

> PostgreSQL — (1 PUNTO) Buscar los tweets diferentes donde aparezca la palabra que suene parecido a
> "Ajuste", proyectando el usuario que hizo el tuit y el texto.

**Respuesta de la fuente:** no hay — el examen no trae solucionario.

**Resolución del vault — MySQL**, con el mismo criterio que en [[Parcial 1Q2021]]: `metaphone()` no
existe en MySQL, así que se resuelve con `SOUNDEX()` sobre cada palabra del texto del tweet.

*(propuesta propia)* — datos de juguete: 7 tweets construidos a partir del ejemplo del `Datasets.pdf`
(`SimonciniPocho` retuiteando a `FrenteDeTodos`), con la palabra "Ajuste" repetida en distintos
tweets y usuarios, más dos tweets de control sin la palabra.

```sql
WITH RECURSIVE seq AS (SELECT 0 n UNION ALL SELECT n+1 FROM seq WHERE n<15),
palabras AS (
  SELECT DISTINCT t.id, t.screen_name, t.text_,
         TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(t.text_, ' ', s.n+1), ' ', -1)) AS palabra
  FROM tweets t JOIN seq s
  WHERE s.n < (LENGTH(t.text_) - LENGTH(REPLACE(t.text_,' ',''))+1)
)
SELECT DISTINCT p.screen_name, p.text_
FROM palabras p
WHERE SOUNDEX(p.palabra) = SOUNDEX('Ajuste');
```

Salida real (MySQL 9.7.2, tabla `tweets`):

```
screen_name      text_
SimonciniPocho   RT @FrenteDeTodos: Tenemos que ir hacia adelante, sin Ajuste #DebateBuenosAires
FrenteDeTodos    El modelo de Ajuste no va mas #DebateBuenosAires
juanperez        Estamos en contra del Ajuste permanente #DebateBsAs
juanperez        RT @FrenteDeTodos: El modelo de Ajuste no va mas #DebateBuenosAires
juanperez        No hay Ajuste que alcance sin plan economico #DebateBuenosAires
```

`SOUNDEX('Ajuste') = 'A230'`. (atención) — vale la pena notar el límite de `SOUNDEX` frente a
`metaphone` aquí: `SOUNDEX('ajustes')` (plural) da `'A232'`, un código *distinto* de `'A230'`. Con
`SOUNDEX`, una palabra que "suene parecido" pero difiera en la terminación puede no matchear; el
enunciado no pide manejar plurales, pero es una trampa a tener presente si se reutiliza este patrón.
La consulta no filtra los retweets (el enunciado de este ejercicio no lo pide, a diferencia de la
pregunta 3).

### Pregunta 2 — búsqueda difusa en ElasticSearch

> ElasticSearch — (1 PUNTO) Buscar los tweets que mencionan la palabra "Ajuste" utilizando búsqueda
> difusa (fuzzy search). ¿Cuántos tweets encontraron?

**Respuesta de la fuente:** no hay.

**Resolución del vault — ElasticSearch fuera del temario 2026.** No se corre (no
verificado en el motor). Mismo enfoque que en el parcial 1Q2021, `match` con
`fuzziness: AUTO` sobre el campo `text`:

```json
GET /tweets/_search
{
  "query": { "match": { "text": { "query": "Ajuste", "fuzziness": "AUTO" } } }
}
```

La cantidad de tweets encontrados sería `hits.total.value` de la respuesta — no se reporta un número
porque no hay un índice de ElasticSearch real corriendo sobre el que ejecutar la consulta. Fuente:
documentación oficial, *Fuzziness* — <https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#fuzziness>.

### Pregunta 3 — agrupamiento en MongoDB, excluyendo retweets

> MongoDB — (1 PUNTO) Realizar una consulta de agrupación, donde muestre el top 5 de usuarios
> (screen_name) que mayor cantidad de tweets publicaron, no cuentan los RTs.

**Respuesta de la fuente:** no hay.

**Resolución del vault:** *(propuesta propia)* — los mismos 7 tweets de juguete de la pregunta 1,
importados como documentos. Siguiendo la aclaración del `Datasets.pdf`, el filtro de retweet es por
`text` (`$not: /^RT @/`), **no** por `is_rt`:

```js
db.tweets.aggregate([
  { $match: { text: { $not: /^RT @/ } } },
  { $group: { _id: "$screen_name", tweets: { $sum: 1 } } },
  { $sort: { tweets: -1 } },
  { $limit: 5 }
])
```

Salida real (MongoDB 8.3.11, colección `tweets`):

```
{ _id: 'juanperez', tweets: 2 }
{ _id: 'mariagomez', tweets: 1 }
{ _id: 'FrenteDeTodos', tweets: 1 }
```

De los 7 tweets de juguete, 3 son retweets (empiezan con `"RT @"`) y quedan excluidos: los 4 tweets
originales restantes se reparten en 3 usuarios, todos por debajo del `$limit: 5`.

### Pregunta 4 — vista de conteo en CouchDB

> CouchDB — (1 PUNTO) Lo mismo que en el punto anterior, pero no hace falta que estén ordenados, la
> vista debe mostrar todos los usuarios y la cantidad de tweets publicados.

**Respuesta de la fuente:** no hay.

**Resolución del vault — CouchDB fuera del temario 2026.** No se corre. El `map` tiene que
replicar el mismo filtro de retweet que la pregunta 3 (por `text`, no por `is_rt`) antes de emitir:

```js
function (doc) {
  if (!doc.text.match(/^RT @/)) {
    emit(doc.screen_name, 1);
  }
}
// reduce
_count
```

Consultada con `?group=true`, da un documento por `screen_name` con la cantidad de tweets originales,
sin orden garantizado. Referencia: *Seven Databases in Seven Weeks* (2ª ed.) cap. 5 *(CouchDB)*, *Day
2: Creating and Querying Views*, impresas 145–158.

### Pregunta 5 — máximos de amigos y seguidores en Redis

> Redis — (1 PUNTO) Realizar una consulta (o dos) para identificar el top10 en los usuarios
> (screen_name) que tienen más amigos (friends_count) y seguidores (followers_count), mostrar la
> lista de usuarios con la cantidad de amigos y seguidores.

**Respuesta de la fuente:** no hay.

**Resolución del vault — Redis (tema no dictado aún; se dicta el 26–27/10, después del parcial
del 13/10).** No se corre (no verificado en el motor). El `Datasets.pdf` aclara el
objetivo exacto: para cada `screen_name`, guardar solo el **máximo** de `friends_count` y de
`followers_count` vistos (no la suma ni el último valor). El enfoque natural en Redis son dos
*sorted sets*, uno por métrica, usando `ZADD … GT` para que cada `ZADD` solo actualice el score si el
nuevo valor es mayor al existente:

```
ZADD top_friends GT  956 SimonciniPocho
ZADD top_followers GT 361 SimonciniPocho
-- por cada tweet del dataset, un ZADD GT por métrica
ZREVRANGE top_friends 0 9 WITHSCORES    -- top 10 por amigos
ZREVRANGE top_followers 0 9 WITHSCORES  -- top 10 por seguidores
```

`GT` (disponible desde Redis 6.2) hace que el comando sea idempotente frente a re-ejecuciones y evite
un `GET` + comparación + `SET` manual. Referencia: *Seven Databases in Seven Weeks* (2ª ed.) cap. 8
*(Redis)*, *Day 1: CRUD and Datatypes* (sorted sets), impresas 260–274; comando `ZADD` con `GT`:
documentación oficial — <https://redis.io/docs/latest/commands/zadd/>.

### Pregunta 6 — nodos y relaciones del grafo de retweets

> Neo4J — (0.5 PUNTOS) ¿Cuántos nodos de tipo "Usuario" tiene el grafo? ¿Cuántos nodos o ejes del tipo
> "Tweets" tiene el grafo?

**Respuesta de la fuente:** no hay.

**Resolución del vault — Neo4j (tema no dictado aún; se dicta el 19–20/10).** No se corre (no
verificado en el motor). Modelo que pide el `Datasets.pdf` para las preguntas 6 a 8 —solo
se importan los tweets que empiezan con `"RT @"`, con `Usuario1 (generador) → [:RETWEETEO] →
Usuario2 (retuiteador)`, guardando la URL del tweet en la relación—: los "nodos o ejes del tipo
Tweets" de la pregunta son justamente esas relaciones `:RETWEETEO`, no nodos aparte:

```cypher
MATCH (u:Usuario) RETURN count(u) AS usuarios;
MATCH ()-[r:RETWEETEO]->() RETURN count(r) AS retweets;
```

El dataset de juguete de las preguntas 1 y 3 ya incluye un caso de auto-retweet (`mariagomez`
retuiteando su propio tweet), pensado para la pregunta 8, pero al no correr en un motor Neo4j real no
se reporta el resultado de la consulta — solo el patrón Cypher. Referencia: *Seven Databases in Seven
Weeks* (2ª ed.) cap. 6 *(Neo4J)*, *Day 1: Graphs, Cypher, and CRUD*, impresas 179–189.

### Pregunta 7 — generadores de contenido original

> Neo4J — (0.5 PUNTOS) Realizar una consulta que identifique los usuarios generadores de contenido
> original.

**Respuesta de la fuente:** no hay.

**Resolución del vault — Neo4j (tema no dictado aún).** Con el mismo modelo de la pregunta 6,
un "generador de contenido original" es un `:Usuario` que fue retuiteado pero nunca retuiteó a nadie:

```cypher
MATCH (generador:Usuario)<-[:RETWEETEO]-(:Usuario)
WHERE NOT (generador)-[:RETWEETEO]->()
RETURN DISTINCT generador.screen_name;
```

Referencia: *Seven Databases in Seven Weeks* (2ª ed.) cap. 6 *(Neo4J)*, *Day 1: Graphs, Cypher, and
CRUD*, impresas 179–189.

### Pregunta 8 — usuarios que se retuitean a sí mismos

> Neo4J — (1 PUNTO) Encontrar a los usuarios que se retuitean a sí mismos.

**Respuesta de la fuente:** no hay.

**Resolución del vault — Neo4j (tema no dictado aún).** Con el mismo modelo, un auto-retweet es
una relación `:RETWEETEO` de un nodo `:Usuario` hacia sí mismo:

```cypher
MATCH (u:Usuario)-[:RETWEETEO]->(u)
RETURN u.screen_name;
```

Sobre el dataset de juguete de la pregunta 6, el caso construido es `mariagomez`, pero sin correrlo en
un motor Neo4j real no se reporta el resultado — solo el patrón Cypher. Referencia: *Seven Databases
in Seven Weeks* (2ª ed.) cap. 6 *(Neo4J)*, *Day 1: Graphs, Cypher, and CRUD*, impresas 179–189.

## Dataset 2 — GPS de la flota (VAST Challenge 2021)

Mismas columnas y mismo dataset que el parcial 1Q2021: `Timestamp`, `id`, `lat`, `long`, 685.169
filas. A diferencia del 1Q2021 (motor libre), aquí el enunciado pide "el motor que recomendamos
durante las clases que tratamos el tema de datos espaciales/geográficos" — sin nombrarlo. En la
cursada 2026 ese contenido es **MongoDB**: la cursada vio el índice `2d` sobre pares de coordenadas
([[Práctica 2026-09-22|TP9 Parte II]], `mongoCities_fixed.json`), así que estas dos preguntas se
resuelven en MongoDB. La resolución con `2dsphere` y `$geoNear` sobre GeoJSON es contexto del motor,
no material dictado ([[2.14.02 - Índices en MongoDB|Índices en MongoDB]] § *3.6*, `2d` vs. `2dsphere`).

### Pregunta 9 — distancia recorrida, ordenada

> (2 PUNTOS) ¿Qué distancia recorrió cada empleado con su vehículo (en km)? Entregar todas las
> consultas que tuvieron que hacer para llegar a este resultado. Ordenar la lista de manera
> descendente, según los km recorridos.

**Respuesta de la fuente:** no hay.

**Resolución del vault — MongoDB.** *(propuesta propia)* — los mismos 8 puntos de juguete de dos
vehículos usados en [[Parcial 1Q2021]] preguntas 5 y 6, ahora como documentos `GeoJSON Point` con
índice `2dsphere`. MongoDB no tiene un `LAG()` directo como SQL, pero `$setWindowFields` con `$shift`
cumple la misma función: trae el punto anterior dentro de la partición por vehículo, ordenada por
tiempo. La distancia entre dos puntos se calcula con la fórmula de Haversine expresada como operadores
de agregación (`$degreesToRadians`, `$sin`, `$cos`, `$atan2`):

```js
db.gps.aggregate([
  { $sort: { id: 1, Timestamp: 1 } },
  { $setWindowFields: {
      partitionBy: "$id", sortBy: { Timestamp: 1 },
      output: { prevLoc: { $shift: { output: "$loc.coordinates", by: -1 } } }
  }},
  { $match: { prevLoc: { $ne: null } } },
  { $addFields: {
      lon1: { $arrayElemAt: ["$prevLoc", 0] }, lat1: { $arrayElemAt: ["$prevLoc", 1] },
      lon2: { $arrayElemAt: ["$loc.coordinates", 0] }, lat2: { $arrayElemAt: ["$loc.coordinates", 1] }
  }},
  { $addFields: {
      dLat: { $degreesToRadians: { $subtract: ["$lat2", "$lat1"] } },
      dLon: { $degreesToRadians: { $subtract: ["$lon2", "$lon1"] } },
      rLat1: { $degreesToRadians: "$lat1" }, rLat2: { $degreesToRadians: "$lat2" }
  }},
  { $addFields: {
      a: { $add: [
        { $pow: [{ $sin: { $divide: ["$dLat", 2] } }, 2] },
        { $multiply: [{ $cos: "$rLat1" }, { $cos: "$rLat2" },
                       { $pow: [{ $sin: { $divide: ["$dLon", 2] } }, 2] }] }
      ]}
  }},
  { $addFields: {
      distancia_m: { $multiply: [2, 6371000,
        { $atan2: [{ $sqrt: "$a" }, { $sqrt: { $subtract: [1, "$a"] } }] }] }
  }},
  { $group: { _id: "$id", km_recorridos: { $sum: { $divide: ["$distancia_m", 1000] } } } },
  { $sort: { km_recorridos: -1 } }
])
```

Salida real (MongoDB 8.3.11, colección `gps`):

```
{ _id: 35, km_recorridos: 5.210555876324268 }
{ _id: 42, km_recorridos: 0.548359608393984 }
```

Los valores coinciden, hasta el redondeo, con los `5.211` y `0.548` km que dio la resolución en MySQL
de la misma pregunta en el [[Parcial 1Q2021]] sobre el mismo dataset de juguete — la fórmula de
distancia esférica es la misma, solo cambia el motor. La lista ya sale ordenada descendente por el
`$sort` final, como pide el enunciado.

### Pregunta 10 — vehículos cerca de un punto WKT

> (1 PUNTO) ¿Qué vehículos estuvieron cerca (a menos de 100 metros) del siguiente punto WKT_GEOM ->
> Point (24.825879 36.051030) ?

**Respuesta de la fuente:** no hay.

**Resolución del vault — MongoDB.** Con el índice `2dsphere` ya creado, `$geoNear` calcula la
distancia real (no una aproximación) desde el punto dado a cada documento y permite filtrar por
`maxDistance` en metros directamente en la etapa de agregación:

```js
db.gps.aggregate([
  { $geoNear: {
      near: { type: "Point", coordinates: [24.825879, 36.051030] },
      distanceField: "distancia_m", maxDistance: 100, spherical: true
  }},
  { $group: { _id: "$id", distancia_min_m: { $min: "$distancia_m" } } },
  { $sort: { distancia_min_m: 1 } }
])
```

Salida real:

```
{ _id: 42, distancia_min_m: 0.09000052562119504 }
{ _id: 35, distancia_min_m: 0.775500173399607 }
```

Nota importante de `$geoNear` (distinta de la pregunta 6 del 1Q2021, resuelta con `ST_Distance_Sphere`
en MySQL): **tiene que ser la primera etapa del pipeline** y requiere el índice `2dsphere`; no se
puede combinar libremente en cualquier posición como un `$match` común. Con el umbral en 100 m (el
doble que en el 1Q2021) los mismos dos vehículos de juguete siguen entrando, porque los puntos se
construyeron a menos de 1 m del punto WKT.

## Qué enseña para el parcial 2026

- El mismo par MySQL/MongoDB del 1Q2021 vuelve a resolver los ejercicios de búsqueda fonética y
  agrupamiento; lo nuevo aquí es que el agrupamiento (pregunta 3) exige **excluir** un subconjunto
  según una condición sobre texto (`text` empieza con `"RT @"`), no según un campo booleano dedicado
  — es el mismo patrón de "no confiar en el campo obvio, mirar el dato real" que aparece en varias
  trampas del vault (por ejemplo, `TP3.1.e`: jefe de departamento vs. jefe directo).
- Distancia y proximidad geoespacial (preguntas 9 y 10) se resolvieron en MongoDB con
  `$setWindowFields` + Haversine manual y con `$geoNear` + índice `2dsphere`. La resolución en MySQL
  del 1Q2021 (`ST_Distance_Sphere` + `LAG()`) da el mismo resultado numérico sobre el mismo dataset de
  juguete: es útil ver las dos formas, porque el parcial 2026 puede pedir cualquiera de las dos según
  si la consigna especifica el motor.
- Redis y Neo4j **no** están dictados todavía al 25/09/2026 (se dictan el 26–27/10 y el 19–20/10
  respectivamente, después del parcial del 13/10): los patrones de esta página (sorted sets con `GT`
  para máximos, grafos para relaciones "quién retuitea a quién") solo son relevantes para el TPO o
  el recuperatorio del 03/11, no para el parcial.
- CouchDB y ElasticSearch **no** están en el programa 2026 en ningún momento: se los documenta aquí
  solo por completitud del examen viejo, rotulados `(fuera del temario 2026)`.

## Dudas abiertas

- (abierto) El `Datasets.pdf` no aclara si "no cuentan los RTs" (pregunta 3) también debería aplicar
  a las preguntas 6-8 de Neo4j, o si ahí el subconjunto de retweets es justamente el dato de interés
  (es, de hecho, lo que pide importar el propio `Datasets.pdf` para Neo4j). Esta página asume que sí
  se aplica el mismo filtro por texto donde la pregunta lo pide explícitamente, y que en Neo4j el
  filtro es al revés (solo retweets) porque así lo dice la consigna de importación.
- (abierto) No se pudo determinar contra qué motor recomendado en clase de 2021 apuntaban realmente
  las preguntas 9 y 10 (el enunciado original de 2021 no lo nombra); la resolución en MongoDB sigue
  el reparto de motores de la cursada 2026 ([[_cronograma]]), no necesariamente lo que se enseñó en 2021.

## Enlaces

[[Mapa de exámenes]] · [[Parcial 1Q2021]] · [[_cronograma]] · [[_index-clases]] ·
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] · [[2.14.02 - Índices en MongoDB|Índices en MongoDB]] ·
[[1.05.01 - SQL — consultas|SQL — consultas]] · [[Práctica 2026-09-15]] · [[Práctica 2026-09-22]]
