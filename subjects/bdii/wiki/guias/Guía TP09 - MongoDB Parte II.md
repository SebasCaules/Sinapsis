---
tipo: guia
unidad: 2
orden: 11
tema: "TP9 - MongoDB Parte II"
resumen: "TP9 Parte II resuelto en mongosh: towns y los Do del cap. 4 de Seven Databases, índice por defecto y automático, explain() frente a EXPLAIN de MySQL, mongoimport y $group sobre egresados, índice 2d con consulta por radio, dos SQL traducidos a MongoDB, fortalezas y CAP."
fuentes:
  - "raw/Unidad-02/Practica/ITBA TP 9 - MongoDB Parte II.pdf"
  - "raw/Unidad-02/Practica/egresados.csv"
  - "raw/Unidad-02/Practica/mongoCities_fixed.json"
estado: procesado
---

# Guía TP09 — MongoDB Parte II

## Resumen general

El TP9 Parte II tiene ocho ejercicios y se apoya en el capítulo 4 (MongoDB) de *Seven Databases in
Seven Weeks*, 2ª edición: crear la colección `towns` del libro y resolver los ejercicios Do.2 a Do.5
del *Day 1*; responder qué índice usa MongoDB por defecto y cuál crea solo; comparar `explain()` con
el `EXPLAIN` de MySQL; importar `egresados.csv` con `mongoimport` y agruparlo con `aggregate`;
importar las ciudades del libro, crear un índice `2d` y resolver una búsqueda por radio; traducir dos
consultas SQL sobre la colección `bandas` de la Parte I; y cerrar con fortalezas, debilidades y la
clasificación CAP de MongoDB.

Se necesita el mismo contenedor de la Parte I (con `bandas` y la vista `bandas_resumen` todavía
cargadas) y los dos archivos de datos copiados adentro. Todas las salidas de esta guía son reales
(MongoDB 8.3.11, `mongosh` 2.11.1; MySQL 9.7.2 para el lado SQL del ejercicio 3).

Trampas: el libro usa métodos viejos (`insert`, `ensureIndex`, `dropDups`) que hoy están deprecados
o no hacen nada; `egresados.csv` no tiene columna `carrera` (la carrera es `titulo`); las coordenadas
de `mongoCities_fixed.json` no siguen un orden único (Londres está como `[longitud, latitud]`); y en
el ejercicio 6 el resultado depende de si se corrió el `$inc` del ejercicio 4 de la Parte I. Para el
parcial: B-tree como índice por defecto, `_id` indexado siempre, `$match` + `$group` + `$sort` como
traducción de `WHERE` + `GROUP BY` + `ORDER BY`, y MongoDB como **CP**.

## Setup

```bash
docker cp egresados.csv Mymongo:/egresados.csv
docker cp mongoCities_fixed.json Mymongo:/mongoCities_fixed.json
docker exec Mymongo mongoimport --db academica --collection egresados --type csv --headerline --file /egresados.csv
#   8223 document(s) imported successfully. 0 document(s) failed to import.
docker exec Mymongo mongoimport --db lab --collection cities --file /mongoCities_fixed.json
#   99838 document(s) imported successfully. 0 document(s) failed to import.
```

---

## Ejercicio 1

### 1.a
**Consigna:** crear la colección `towns` como en las pp. 95, 97 y 98 del libro y hacer el Do.2:
buscar una ciudad con una regex insensible a mayúsculas que contenga *new*.
**Resolución:**
```javascript
use lab
db.towns.insertOne({ name: "New York", population: 22200000, lastCensus: ISODate("2016-07-01"),
  famousFor: [ "the MOMA", "food", "Derek Jeter" ], mayor: { name: "Bill de Blasio", party: "D" } })
db.towns.insertOne({ name: "Punxsutawney", population: 6200, lastCensus: ISODate("2016-01-31"),
  famousFor: [ "Punxsutawney Phil" ], mayor: { name: "Richard Alexander" } })
db.towns.insertOne({ name: "Portland", population: 582000, lastCensus: ISODate("2016-09-20"),
  famousFor: [ "beer", "food", "Portlandia" ], mayor: { name: "Ted Wheeler", party: "D" } })

db.towns.find({ name: { $regex: "new", $options: "i" } })   // o: db.towns.find({ name: /new/i })
```
Devuelve **New York**.
(atención) El libro usa `db.towns.insert(...)`: deprecado, imprime
`DeprecationWarning: Collection.insert() is deprecated. Use insertOne, insertMany, or bulkWrite.`

### 1.b
**Consigna:** Do.3 — ciudades cuyo nombre contenga una *e* y que sean famosas por comida o cerveza.
**Resolución:**
```javascript
db.towns.find({ name: { $regex: "e" }, famousFor: { $in: ["food", "beer"] } })
```
Devuelve **New York**. Punxsutawney tiene *e* pero no es famosa por comida ni cerveza; Portland es
famosa por las dos pero no tiene *e*. `$in` sobre un arreglo = "contiene alguno de".

### 1.c
**Consigna:** Do.4 — crear la base `blogger` con una colección `articles` e insertar un artículo con
nombre y email del autor, fecha de creación y texto.
**Resolución:**
```javascript
use blogger
db.articles.insertOne({
  author: "Ana Gomez",
  email: "ana.gomez@example.com",
  created: new Date("2026-09-22"),
  text: "Primer articulo de prueba para el TP9 Parte II."
})
// { acknowledged: true, insertedId: ObjectId('...') }
```
La base y la colección nacen con este primer insert.

### 1.d
**Consigna:** Do.5 — actualizar el artículo con un arreglo de comentarios, cada uno con autor y texto.
**Resolución:**
```javascript
db.articles.updateOne(
  { author: "Ana Gomez" },
  { $set: { comments: [ { author: "Ayudante", text: "Buen resumen." } ] } }
)
// { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
```
Para sumar comentarios después: `{ $push: { comments: { author: "...", text: "..." } } }`.

## Ejercicio 2

### 2.a
**Consigna:** ¿cuál es el tipo de índice por defecto de MongoDB?
**Resolución:** **B-tree**. `createIndex({campo: 1})` sin opciones crea un índice B-tree (ascendente
con `1`, descendente con `-1`); es la misma estructura que usa MySQL/InnoDB. Los demás tipos se piden
explícitamente: `2d` y `2dsphere` (geoespaciales), `text`, `hashed`; y un índice sobre un arreglo es
*multikey*.

### 2.b
**Consigna:** ¿hay índices creados automáticamente, como en MySQL?
**Resolución:** **Sí: el de `_id`.** Toda colección nueva tiene un índice único sobre `_id`, que no se
puede borrar:
```javascript
db.towns.getIndexes()
// [ { v: 2, key: { _id: 1 }, name: '_id_' } ]
```
Es el equivalente del índice que MySQL crea para la `PRIMARY KEY`. La diferencia: MySQL también
indexa solo cada `UNIQUE` y cada `FOREIGN KEY`; MongoDB no tiene FK, y fuera de `_id` todo índice se
crea a mano. (nota) El libro dice que se ven en `system.indexes`; esa colección ya no existe, se usa
`getIndexes()`.

## Ejercicio 3

### 3.a
**Consigna:** semejanzas y diferencias entre el `EXPLAIN` de MySQL y el `explain()` de MongoDB.
**Resolución:** comparación corrida sobre una tabla/colección `towns` de 3 filas con índice único en
`name`:

| Caso | MySQL (`EXPLAIN FORMAT=TRADITIONAL`) | MongoDB (`explain("executionStats")`) |
| --- | --- | --- |
| `name = 'Portland'` (con índice) | `type: const`, `key: name_1`, `rows: 1` | `stage: 'EXPRESS_IXSCAN'`, `indexName: 'name_1'`, `totalKeysExamined: 1`, `totalDocsExamined: 1` |
| `population > 500000` (sin índice) | `type: ALL`, `key: NULL`, `rows: 3`, `Extra: Using where` | `stage: 'COLLSCAN'`, `totalDocsExamined: 3`, `nReturned: 2` |

**Semejanzas:**
- Los dos dicen si se usó un índice o se recorrió todo: `type` (`const`/`ref`/`range` contra `ALL`)
  en MySQL; `stage` (`IXSCAN` contra `COLLSCAN`) en MongoDB.
- Los dos nombran el índice elegido (`key` en MySQL, `indexName` en MongoDB).
- Los dos tienen un modo que solo planifica y otro que ejecuta: `EXPLAIN` / `EXPLAIN ANALYZE` en
  MySQL; `explain("queryPlanner")` (por defecto) / `explain("executionStats")` en MongoDB.
- Los dos informan filas examinadas frente a filas devueltas.

**Diferencias:**
- Formato: MySQL devuelve una tabla (o un árbol de texto, que es el formato por defecto en 9.x);
  MongoDB devuelve un documento anidado (`queryPlanner.winningPlan...`).
- MongoDB separa `totalKeysExamined` (entradas del índice) de `totalDocsExamined` (documentos
  leídos); MySQL da una sola cifra, `rows`, y además un porcentaje `filtered`.
- MySQL muestra un costo estimado por nodo; MongoDB no expone costos, solo conteos y tiempos.
- MongoDB muestra los planes descartados con `explain("allPlansExecution")` (`rejectedPlans`); en
  MySQL hace falta el *optimizer trace*.
- MySQL `EXPLAIN` se antepone a la sentencia; en MongoDB `explain()` es un método que se encadena al
  cursor (`find(...).explain()`).

## Ejercicio 4

### 4.a
**Consigna:** crear la base `academica` e importar `egresados.csv` con `mongoimport`.
**Resolución:** ver § Setup (`--type csv --headerline`): **8223** documentos importados, 0 fallidos.
Columnas: `legajo, nivel, titulo, colacion, promedio, promedio_lineal`. `mongoimport` infiere el tipo
valor por valor (`colacion` queda numérica, salvo un documento con `""`).

### 4.b
**Consigna:** cuántos egresados hay por carrera.
**Resolución:**
```javascript
use academica
db.egresados.aggregate([
  { $group: { _id: "$titulo", cantidad: { $sum: 1 } } },
  { $sort: { cantidad: -1 } }
])
```
(atención) No hay columna `carrera`: la carrera es `titulo`.

| Carrera (`titulo`) | Egresados |
| --- | ---: |
| Ingeniero Industrial | 3847 |
| Ingeniero Electrónico | 1099 |
| Ingeniero Químico | 635 |
| Ingeniero Mecánico | 589 |
| Lic.en Administración y Sistemas | 544 |
| Ingeniero en Informática | 533 |
| Ingeniero en Petróleo | 347 |
| Licenciado en Oceanografía | 115 |
| Licenciado en Análisis de Sistemas | 110 |
| Ingeniero Naval | 99 |
| Licenciado en Informática | 88 |
| Bioingeniero | 79 |
| Ingeniero Electricista | 75 |
| Ingeniero en Armas | 30 |
| Licenciado en Hidrografía | 16 |
| Ingeniero Metalúrgico | 7 |
| Licenciatura en Gestión de Negocios | 5 |
| Licenciatura en Analítica Empresarial y Social | 4 |
| Licenciado en Ciencias Meteorológicas | 1 |

19 carreras, 8223 en total.

### 4.c
**Consigna:** cuántos egresados hay por colación, de mayor a menor.
**Resolución:**
```javascript
db.egresados.aggregate([
  { $group: { _id: "$colacion", cantidad: { $sum: 1 } } },
  { $sort: { cantidad: -1 } }
])
```
59 grupos (58 colaciones y un `_id: ""` de un egresado sin colación):

57: 342 · 51: 309 · 48: 306 · 56: 282 · 53: 271 · 50: 259 · 55: 258 · 54: 257 · 49: 247 · 47: 242 ·
52: 235 · 46: 227 · 32: 222 · 37: 211 · 58: 208 · 39: 207 · 33: 204 · 30: 193 · 31: 190 · 40: 188 ·
29, 35 y 44: 187 · 38: 185 · 45: 183 · 36: 182 · 34 y 43: 166 · 41: 154 · 22: 137 · 42: 131 ·
27: 101 · 25 y 28: 86 · 23: 81 · 17 y 19: 78 · 24: 77 · 18: 75 · 20: 74 · 16: 71 · 26: 67 · 14: 64 ·
12: 56 · 15 y 21: 51 · 10 y 13: 47 · 6: 43 · 4: 39 · 5: 37 · 11: 33 · 7: 32 · 8: 30 · 1 y 9: 27 ·
2: 25 · 3: 16 · `""`: 1.

El orden entre empates no está definido; para fijarlo, `{ $sort: { cantidad: -1, _id: 1 } }`.

## Ejercicio 5

### 5.a
**Consigna:** cargar las ciudades de `mongoCities_fixed.json`, crear el índice `2d` sobre `location`
(p. 130) y hacer el Do.1 del *Day 3*: ciudades a menos de 50 millas del centro de Londres.
**Resolución:**
```javascript
use lab
db.cities.createIndex({ location: "2d" })   // 'location_2d'

db.cities.find(
  { location: { $geoWithin: { $centerSphere: [ [-0.1276, 51.5072], 50 / 3963.2 ] } } },
  { _id: 0, name: 1, location: 1 }
)
```
**297 ciudades**, entre ellas Basingstoke, Alton, Petersfield, Hook, Odiham, Bordon y Liphook. El
radio va en radianes: millas / 3963,2 (radio terrestre en millas).
(atención) El libro escribe `ensureIndex({ location: "2d" })` y ubica los puntos como
`[latitud, longitud]`; en este archivo Londres y sus vecinas están como `[longitud, latitud]`
(`London: [-0.12574, 51.50853]`), así que el centro se pasa en ese orden. El archivo no es uniforme:
París o Tokio están al revés, lo que importa si se consulta otra ciudad.

## Ejercicio 6

Sobre la colección `bandas` y la vista `bandas_resumen` de la
[[Guía TP09 - MongoDB Parte I|Parte I]] (campos `nombre`, `genero`, `estilo`, `fecha_inscripcion`,
`discos`, `barrio`, `integrantes`).

### 6.a
**Consigna:** `SELECT nombre_solista FROM bandas WHERE genero = 'ROCK' AND integrantes > 2;`
**Resolución:**
```javascript
db.bandas.find({ genero: 'ROCK', integrantes: { $gt: 2 } }, { _id: 0, nombre: 1 })
```
EFECTO ALFONS (x2) y AFTERLIFE. VIRGINIA FERREYRA es ROCK pero tiene 1 integrante (2 después del `$inc`
de la Parte I): no pasa el `> 2` en ningún caso. El `WHERE` es el primer argumento de `find`; el
`SELECT`, la proyección.

### 6.b
**Consigna:**
`SELECT genero, AVG(integrantes) AS promedio_integrantes, count(*) AS cant_bandas FROM bandas WHERE fecha_incripcion <= '2017-11-27' GROUP BY genero ORDER BY promedio_integrantes DESC;`
**Resolución:**
```javascript
db.bandas.aggregate([
  { $match: { fecha_inscripcion: { $lte: new Date('2017-11-27') } } },
  { $group: { _id: '$genero',
              promedio_integrantes: { $avg: '$integrantes' },
              cant_bandas: { $sum: 1 } } },
  { $sort: { promedio_integrantes: -1 } }
])
```

| `_id` (género) | `promedio_integrantes` (con el `$inc` de la Parte I) | sin el `$inc` | `cant_bandas` |
| --- | :---: | :---: | :---: |
| FOLKLORE | 8 | 7 | 1 |
| POP | 6 | 5 | 2 |
| PUNK | 4 | 3 | 1 |
| ROCK | 4 | 3 | 4 |
| SOLISTA | 2 | 1 | 1 |
| HIP HOP / RAP | 2 | 1 | 1 |

`$match` antes de `$group` es el `WHERE` (filtra bandas, no grupos); TROTAMUNDOS (30/11/2017) y VER K
BITCH (20/01/2018) quedan afuera, por eso no aparecen INDIE ni INSTRUMENTAL. La fecha se compara como
`Date`, no como string. (nota) El SQL dice `fecha_incripcion` (sin *s*): errata del enunciado.

## Ejercicio 7

### 7.a
**Consigna:** resumir fortalezas y debilidades de MongoDB y en qué situaciones usarlo (p. 133).
**Resolución:**
- **Fortalezas:** maneja grandes volúmenes de datos y de pedidos escalando horizontalmente
  (*sharding*) con replicación (*replica sets*); modelo de documentos flexible, sin esquema fijo, que
  permite anidar lo que en SQL requiere un join; consultas ricas (índices de varios tipos,
  agregación, geoespacial) con una sintaxis fácil de adoptar viniendo de SQL.
- **Debilidades:** la falta de esquema traslada a la aplicación las validaciones que en SQL hace el
  motor (no hay FK, `CHECK` ni `NOT NULL` declarativos); un error de tipeo en un campo o colección
  pasa desapercibido (crea un campo o colección nuevos sin aviso); los datos embebidos se duplican y
  los joins (`$lookup`) son caros; rinde mejor en clústeres grandes, cuya configuración y operación
  son más complejas que las de una base relacional única.
- **Cuándo usarlo:** cuando los datos se leen como agregados (un documento por objeto de la
  aplicación, como haría un ORM), cuando el esquema cambia seguido durante el desarrollo (catálogos,
  contenido, perfiles, *logs*, eventos) o cuando el volumen exige escalar horizontalmente. No conviene
  cuando el problema exige integridad referencial fuerte y transacciones entre muchas entidades
  (contabilidad, inventario relacional), que es el caso de uso de MySQL.

## Ejercicio 8

**Consigna:** clasificar MongoDB según el teorema CAP.
**Resolución:** **CP** (consistencia y tolerancia a particiones). En un *replica set* todas las
escrituras (y, por defecto, las lecturas) van al primario; si una partición deja al primario sin
mayoría, deja de aceptar escrituras hasta que se elige otro, así que ante la partición sacrifica
disponibilidad para no divergir. Es la clasificación de la Clase 12 y la que tomó el
[[Parcial 2Q2025]]. (nota) Corbellini et al. (2017) lo ubica en AP y CP según configuración: con
lecturas en secundarios (`readPreference: secondary`) se comporta como AP.

---

## Enlaces

- Análisis completo, deprecaciones y verificación: [[Práctica 2026-09-22|Práctica del 22/09]]
- Parte anterior: [[Guía TP09 - MongoDB Parte I|Guía TP09 — MongoDB Parte I]]
- Motor: [[MongoDB]] · lado SQL del ejercicio 3: [[MySQL]]
