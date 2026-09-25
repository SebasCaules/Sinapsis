---
tipo: examen
unidad: eval
instancia: recuperatorio
tema:
  - MongoDB — aggregate, $group, $addFields
  - DynamoDB — teorema CAP, tablas y llaves
  - CouchDB — vistas map/reduce
  - Redis — geolocalización
  - PostgreSQL + PostGIS — distancia geográfica
fecha: 2020-11-03
cuatrimestre: 2Q2020
temario: anterior
fuentes:
  - "raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/Recuperatorio 2Q2020.pdf"
estado: procesado
resumen: "Recuperatorio del 03/11/2020, 3 horas: cuatro ejercicios sobre MongoDB, DynamoDB, CouchDB y un ejercicio combinado Redis+PostgreSQL/PostGIS de geolocalización. Solo se conserva el enunciado, sin resolución de ningún estudiante."
aliases:
  - Recuperatorio 2Q2020
  - Recuperatorio Bases de Datos II 2Q2020
---

# Recuperatorio 2Q2020 — enunciado sin resolución, cuatro ejercicios

## Resumen general

Recuperatorio del segundo cuatrimestre de 2020, dictado el 3 de noviembre de 2020 (fecha en el
encabezado de la fuente), con una duración fija de 3 horas (18:30 a 21:30) y la misma modalidad
domiciliaria que el resto de la familia de exámenes de esta época: entrega por GoogleDoc exportado a
PDF, con capturas de pantalla de comandos y resultados. A diferencia de los dos parciales de la misma
carpeta (1Q2020 y 2Q2020), de este recuperatorio **solo se conservó el enunciado**: no hay ningún
`.docx` resuelto asociado, ni capturas de una resolución de estudiante — únicamente el PDF de tres
páginas con las consignas. Esto significa que no hay ninguna "Respuesta de la fuente" que transcribir
en esta página: todo lo que sigue es enunciado literal más la resolución propia del vault, marcada
como tal.

Evalúa cuatro ejercicios: MongoDB (el mismo dataset de álbumes de Rolling Stone que aparece también
en el parcial 1Q2020, con las mismas tres consignas de `aggregate`), DynamoDB (la misma pregunta de
clasificación CAP y diseño de tabla con llave de rango que 1Q2020, pero con un dataset de ejemplo
distinto), CouchDB (una vista similar a la de 1Q2020, con un rango de letras y paridad de año
distintos) y un ejercicio combinado de geolocalización que vale doble ("Redis & Postgresql+PostGIS,
vale x2"): calcular cuántas personas viven a 50 km de La Matanza, primero con Redis y después con
PostgreSQL+PostGIS. Este último ejercicio es el único de toda esta tanda de exámenes viejos que
menciona PostGIS explícitamente. Nada de este recuperatorio tiene equivalente directo en el parcial
2026 salvo el ejercicio de MongoDB.

> [!info] Fuente
> `Recuperatorio 2Q2020.pdf`, tres páginas, solo enunciado. **No es material oficial de la cátedra**
> en el sentido de solucionario — es la copia del enunciado que circuló entre estudiantes de una
> cursada anterior de 72.41 —, pero al no traer ninguna resolución adjunta, tampoco arrastra el
> problema de confiabilidad de una resolución "no chequeada": simplemente no hay resolución que
> evaluar. No hay imágenes más allá del PDF de texto: las tres páginas se leyeron completas y no
> aportan tablas ni diagramas fuera de lo transcripto abajo.

## Formato

Examen práctico domiciliario, individual, duración fija de **3 horas** (18:30–21:30), entrega por
GoogleDoc exportado a PDF. Cuatro ejercicios (I a IV), con una fila de puntaje en el encabezado
("1 · 2 · 3 · 4 redis · 4 postgis · Nota") que muestra que el ejercicio IV se evalúa en dos columnas
separadas — Redis y PostgreSQL+PostGIS por separado, aunque el enunciado dice "vale x2" para el
ejercicio como conjunto — y no en una sola. No hay opción múltiple ni V/F: todas las consignas piden
procedimiento y resultado.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| I.1.a–c | `$group`/`$sort`/`$addFields` sobre `albumlist.csv` | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 12–14 / Práctica 2026-09-15 |
| II.1 | Teorema CAP aplicado a DynamoDB | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 (concepto) |
| II.2.a | Tabla con llave de rango (hash + range) | DynamoDB — texto plano *(tema no dictado aún; se dicta el 02/11)* | — |
| III.1–3 | Vista map/reduce, filtro por rango de letras | CouchDB — texto plano *(fuera del temario 2026)* | — |
| IV.1 | Importar datos con tipo geoespacial | Redis — texto plano *(tema no dictado aún; se dicta el 26/10)* / PostgreSQL+PostGIS — texto plano *(fuera del temario 2026)* | — |
| IV.2.a | Personas a 50 km, con Redis | Redis — texto plano *(tema no dictado aún; se dicta el 26/10)* | — |
| IV.2.b | Personas a 50 km, con PostgreSQL+PostGIS | PostgreSQL+PostGIS — texto plano *(fuera del temario 2026)* | — |

## Preguntas

### Pregunta I — MongoDB: `albumlist.csv` (mismo dataset que 1Q2020)

**Enunciado literal:**

> I. MongoDB
> 1. Importe el archivo `albumlist.csv` (o su versión RAW) a una colección. Este archivo cuenta con
> el top 500 de álbumes musicales de todos los tiempos según la revista Rolling Stones.
> a. Cuente la cantidad de álbumes por año y ordénelos de manera descendente (mostrando los años con
> mayor cantidad de álbumes al principio)
> b. A cada documento, agregarle un nuevo atributo llamado 'score' con el valor: 501 - Number.
> c. Realice una consulta que muestre el 'score' de cada artista.

**Respuesta de la fuente:** no hay (solo se conservó el enunciado, sin resolución de estudiante para
este examen).

**Resolución del vault:** esta consigna es **textualmente la misma** que la Pregunta 1 de
[[Parcial 1Q2020]] (mismo dataset, mismas tres subconsignas a/b/c), así que la resolución ya
verificada ahí aplica directamente acá. Se repite la verificación con datos de juguete en
MongoDB 8.3.11 (mongosh 2.11.1), que ya está documentada en esa página:

```javascript
db.albums.aggregate([{$group:{_id:"$Year", count:{$sum:1}}}, {$sort:{count:-1}}])
// [ { _id: 1970, count: 3 }, { _id: 1967, count: 2 } ]  (con 5 documentos de juguete)

db.albums.aggregate([{$addFields:{score:{$subtract:[501,"$Number"]}}}, {$out:"albums"}]);
db.albums.findOne({Number:1})
// { Number: 1, Year: 1967, Album: 'Sgt Pepper', Artist: 'The Beatles', score: 500 }

db.albums.aggregate([{$group:{_id:"$Artist", count:{$sum:"$score"}}}])
// [ { _id: 'Lou Reed', count: 496 }, { _id: 'The Beatles', count: 998 }, { _id: 'Frank Sinatra', count: 996 } ]
```

`$group`, `$sort`, `$addFields` y `$out` son sintaxis estable del aggregation pipeline y corren igual
en MongoDB 8.3.11 (ver [[2.12.08 - Aggregation pipeline|Aggregation
pipeline]]). Para el procedimiento de importación, la sintaxis vigente es `mongoimport --headerline
--type csv` seguido de `mongosh` (no `mongo`, el shell legado eliminado en MongoDB 6.0; ver
[[2.14.01 - mongosh y herramientas de línea de comando|mongosh]]).

### Pregunta II — DynamoDB: teorema CAP y tabla con llave de rango

**Enunciado literal:**

> II. DynamoDB
> 1. ¿Cómo calificaría a DynamoDB según el teorema CAP? Justifique brevemente.
> 2. Supongamos que tenemos la siguiente tabla:
>
> | username | score | date |
> | --- | --- | --- |
> | Pokemon | 100 | 2009-10-31 |
> | Pokemon | 150 | 2009-11-21 |
> | Luigi | 200 | 2009-11-11 |
> | Mario | 300 | 2010-12-12 |
>
> a. ¿Cuál es la sintaxis para crear la tabla que permita realizar búsquedas por rango para el
> atributo `score`? Defina correctamente los tipos de datos.

**Respuesta de la fuente:** no hay.

**Resolución del vault — DynamoDB (tema no dictado aún; se dicta el 02/11/2026).** Para el
punto 1, aplica el mismo criterio que
[[2.12.04 - Teorema CAP|Teorema CAP]] desarrolla y que [[Parcial 1Q2020]] ya resolvió para esta
misma pregunta: P no se elige en un sistema distribuido, así que la clasificación real depende del
modo de consistencia configurado en cada operación — DynamoDB es AP con lectura eventual (el modo por
defecto, priorizando disponibilidad) y puede comportarse como CP cuando se pide `ConsistentRead`
fuerte, que sacrifica disponibilidad ante una partición. Para el punto 2, a diferencia de la tabla
del parcial 1Q2020 (`username` + `high_score`), acá la tabla tiene **tres columnas** y el ejemplo
muestra que `username` se repite ("Pokemon" aparece dos veces con `score` distinto): eso confirma que
`username` no puede ser la única llave, y que la llave primaria compuesta debe ser
`username` (partition key, tipo `S`) + `score` (sort key, tipo `N`), igual que en 1Q2020:

```bash
aws dynamodb create-table \
  --table-name Scores \
  --attribute-definitions AttributeName=username,AttributeType=S \
    AttributeName=score,AttributeType=N \
  --key-schema AttributeName=username,KeyType=HASH \
    AttributeName=score,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
```

*(propuesta propia, no verificada en el motor.)* El atributo `date` de la tabla de ejemplo queda fuera de la llave primaria
en esta propuesta: si se necesitara también buscar por fecha, DynamoDB resolvería eso con un índice
secundario global (GSI), tema que ni esta fuente ni el parcial 1Q2020 piden.

### Pregunta III — CouchDB: vista con rango de letras y paridad

**Enunciado literal:**

> III. CouchDB
> 1. Importar el archivo `best_games.json` que contiene los juegos considerados como los mejores
> juegos de cada año desde 1972.
> 2. Crear una vista para devolver los nombres de los juegos que comienzan con las letras entre la C
> y la F y que hayan salido en un año impar.
> 3. Mostrar la URL que devuelve los registros solicitados.

**Respuesta de la fuente:** no hay.

**Resolución del vault — CouchDB (fuera del temario 2026).** Esta propuesta no se verificó en
ningún motor. Es la misma estructura de ejercicio que la
Pregunta 4 de [[Parcial 1Q2020]] (mismo dataset `best_games.json`, misma estructura de vista), con
dos parámetros distintos: rango de letra inicial (C–F en vez de T/U/V/W) y paridad de año (impar en
vez de par). *(propuesta propia)*:

```javascript
function(doc) {
  var rege = new RegExp("^[C-Fc-f]");
  if ('name' in doc && 'year' in doc) {
    var odd = (doc.year % 2 !== 0);
    if (rege.test(doc.name) && odd) {
      emit(doc.name, doc.name);
    }
  }
}
```

```bash
curl "http://admin:admin@localhost:5984/best_games/_design/games/_view/rango_letra_impar"
```

La función usa una clase de caracteres `[C-Fc-f]` en vez de cuatro alternativas `RegExp` como hace la
resolución de 1Q2020 para T/U/V/W — ambas formas son válidas en JavaScript, la de rango es más corta
cuando las letras son consecutivas (C, D, E, F) que cuando no lo son (T, U, V, W ya son consecutivas
también, así que ahí `[T-W]` habría sido igual de válido: la fuente de 1Q2020 eligió la forma más
larga sin necesidad).

### Pregunta IV — Redis & PostgreSQL+PostGIS: personas a 50 km de La Matanza (vale x2)

**Enunciado literal:**

> IV. Redis & Postgresql+PostGIS (vale x2)
> 1. Importar el siguiente archivo (utilizando un tipo de datos apropiado, para resolver el problema
> que se plantea en el punto 2).
> 2. Se quiere saber cuántas personas viven a 50 kilómetros de La Matanza.
> a. Usando Redis.
> b. Usando Postgresql + PostGIS.

**Respuesta de la fuente:** no hay. El archivo a importar no está adjunto ni referenciado por nombre
en esta fuente (a diferencia del `bataxi.csv` de la Pregunta 5 de [[Parcial 1Q2020]], que sí lo
nombra): solo se sabe que trae ubicaciones de personas, sin más detalle sobre sus columnas.

**Resolución del vault — Redis (tema no dictado aún; se dicta el 26/10/2026) y PostgreSQL+PostGIS
(fuera del temario 2026).** Ninguna de las dos partes se verificó en el motor; lo que sigue es una propuesta de
enfoque, no una resolución verificada. PostGIS no aparece en el programa dictado ni en el cronograma.

*(propuesta propia)* Con Redis, el mismo patrón que la Pregunta 5 de [[Parcial 1Q2020]] ya usa para
"viajes a 1 km de un punto" (`GEOADD` para cargar las coordenadas, `GEOSEARCH`/`GEORADIUS ... 50 km`
centrado en las coordenadas de La Matanza) resuelve directamente esta consigna, cambiando solo el
radio (1 km → 50 km) y el punto de referencia:

```
GEOADD personas <lon> <lat> <id_persona>   # una vez por persona
GEOSEARCH personas FROMLONLAT -58.6217 -34.7681 BYRADIUS 50 km COUNT 1000
```

(`GEOSEARCH` es el comando moderno que reemplaza a `GEORADIUS`, marcado como *deprecated* desde Redis
6.2; la sintaxis con `GEORADIUS ... WITHDIST` de 1Q2020, como la de esta propuesta, sigue funcionando
pero ya no es la recomendada — otro caso, igual que `db.collection.save()` en MongoDB, de sintaxis de
examen viejo que conviene actualizar antes de repetirla, aunque acá no se verificó en el motor.)

Con PostgreSQL+PostGIS, el enfoque estándar es una columna `geography(Point, 4326)` y
`ST_DWithin`, que calcula distancia sobre el elipsoide (más preciso que una caja de coordenadas
planas) y puede usar un índice espacial GiST:

```sql
CREATE EXTENSION postgis;

CREATE TABLE personas (
  id serial PRIMARY KEY,
  nombre text,
  ubicacion geography(Point, 4326)
);

CREATE INDEX personas_ubicacion_idx ON personas USING GIST (ubicacion);

SELECT count(*)
FROM personas
WHERE ST_DWithin(
  ubicacion,
  ST_MakePoint(-58.6217, -34.7681)::geography,
  50000  -- metros
);
```

(-58.6217, -34.7681 son coordenadas aproximadas del partido de La Matanza, Buenos Aires; no vienen de
la fuente, que no adjunta el dataset.) `ST_DWithin` con el tipo `geography` es preferible a calcular
distancia con `ST_Distance` sobre `geometry` en grados y comparar contra un umbral, porque evalúa la
distancia real en metros sobre el elipsoide terrestre, no en un plano cartesiano de longitud/latitud.

## Qué enseña para el parcial 2026

- Este recuperatorio comparte literalmente la Pregunta I (MongoDB) con la Pregunta 1 de
  [[Parcial 1Q2020]]: es evidencia de que la cátedra reutilizaba ejercicios de un examen a otro
  dentro del mismo período, así que ver una consigna en una fuente vieja no garantiza que sea
  exclusiva de esa fecha.
- La ausencia total de resolución en esta fuente es un caso límite útil: cuando no hay
  "Respuesta de la fuente" que transcribir, la página igual debe completarse con una resolución del
  vault propia, rotulada como tal y sin inventar una salida de motor que no se corrió.
- El ejercicio combinado Redis + PostgreSQL/PostGIS (el único de esta tanda que nombra PostGIS)
  muestra el patrón típico de "resolver el mismo problema geoespacial con dos motores distintos",
  que reaparece en la Pregunta 5 de [[Parcial 1Q2020]] (Redis solo) — útil como panorama, aunque
  PostGIS no forma parte del temario 2026 y Redis todavía no se dictó.

## Dudas abiertas

- (abierto) No se pudo determinar el nombre ni el formato exacto del archivo de personas y
  coordenadas de la Pregunta IV: la fuente lo menciona como "el siguiente archivo" sin adjuntarlo ni
  nombrarlo.
- (abierto) No hay forma de saber, sin una resolución de estudiante o un solucionario oficial, si el
  criterio de "un tipo de datos apropiado" del punto IV.1 apuntaba a un tipo geoespacial nativo de
  Redis (comandos `GEO*`) o a guardar longitud/latitud como dos campos numéricos comunes y calcular
  distancia manualmente, como hace la resolución de la Pregunta 5 de [[Parcial 1Q2020]] con
  `GEORADIUS ... WITHDIST` sumado a mano.

## Enlaces

- [[_cronograma]]
- [[Clase 12 - Introduccion a NoSQL]] · [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] · [[Clase 14 - MongoDB Features]] · [[Práctica 2026-09-15]]
- [[2.12.04 - Teorema CAP|Teorema CAP]] · [[2.12.08 - Aggregation pipeline|Aggregation pipeline]] · [[2.14.01 - mongosh y herramientas de línea de comando|mongosh]]
- [[Parcial 1Q2020]] · [[Parcial 2Q2020]]
- [[Mapa de exámenes]]
