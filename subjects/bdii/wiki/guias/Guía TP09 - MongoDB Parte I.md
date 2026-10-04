---
tipo: guia
unidad: 2
orden: 10
tema: "TP9 - MongoDB Parte I"
resumen: "TP9 Parte I resuelto en mongosh: los 34 pasos guiados sobre players con su resultado real (CRUD, selectores, $regex, upsert, proyección, índices, explain) y los once ejercicios de bandas, con la vista bandas_resumen y las agregaciones por grupo."
fuentes:
  - "raw/Unidad-02/Practica/ITBA TP 9 - MongoDB Parte I.pdf"
estado: procesado
---

# Guía TP09 — MongoDB Parte I

## Resumen general

El TP9 Parte I es la primera práctica NoSQL de la cursada y se resuelve entero en `mongosh`. Tiene dos
mitades. La primera es un recorrido guiado de **34 pasos** sobre la colección `players` de la base
`lab`: comandos básicos, selectores (`$gt`, `$exists`, `$or`), expresiones regulares, actualizaciones
(`$set`, `$inc`, `$push`, upsert, `updateMany`), proyección, `sort`/`limit`/`skip`, conteo, documentos
embebidos, índices y `explain()`. La segunda son **once ejercicios** sobre una tabla de bandas de
músicos: modelar la colección y escribir diez consultas, incluida una **vista** y dos agregaciones con
`$group` que los pasos guiados no enseñan.

Para correrlo solo hace falta un contenedor `mongo` y `mongosh`. Los resultados de esta guía son la
salida real de MongoDB 8.3.11 con `mongosh` 2.11.1, corriendo los pasos en orden.

Trampas que conviene tener presentes: **los pasos son acumulativos** (el 9 borra los dos primeros
jugadores, el 16 sube el peso de Messi, el 18 agrega un hobby a Silva, y eso cambia los resultados de
los pasos 26 y 27); `{campo: valor}` sobre un arreglo significa "contiene"; las igualdades y las
regex distinguen mayúsculas; `new Date(1987,2,14)` usa meses con base 0 (2 = marzo); y el ejercicio 4
**modifica los datos** que después promedia el ejercicio 10. Dos métodos del enunciado están
deprecados (`ensureIndex` y `find().count()`): corren, pero la forma actual es `createIndex` y
`countDocuments`. Para el parcial, llevarse la sintaxis de CRUD, la proyección, el patrón
`$group` + `$sort` y el criterio para embeber (los discos dentro de la banda).

## Setup

```bash
docker run --name Mymongo -p 27017:27017 -d mongo:8   # el PDF dice "mongo" sin tag (latest)
docker exec -it Mymongo mongosh                        # directo al shell, sin pasar por bash
```

(nota) Para correr un archivo `.js` entero: `docker cp tp9.js Mymongo:/tp9.js` y
`docker exec Mymongo mongosh lab /tp9.js`. Dentro de un archivo, `use lab` no es válido: se escribe
`db = db.getSiblingDB('lab')`.

---

## Pasos 1–10 — Comandos básicos

### Paso 1
**Consigna:** probar `db.stats()`.
**Resolución:**
```javascript
db.stats()
// { db: 'test', collections: 0, objects: 0, ..., ok: 1 }
```
Recién conectado, la base activa es `test` y está vacía. Sin paréntesis (`db.stats`) se imprime el
cuerpo del método, no se ejecuta.

### Paso 2
**Consigna:** seleccionar la base `lab`.
**Resolución:**
```javascript
use lab   // switched to db lab
```
La base no existe hasta que se inserta el primer documento.

### Paso 3
**Consigna:** listar las colecciones de `lab`.
**Resolución:** `db.getCollectionNames()` → `[]`.

### Paso 4
**Consigna:** insertar un jugador con `insertOne`.
**Resolución:**
```javascript
db.players.insertOne({name:'Aaron Appindangoye', height: 182, weight:187})
// { acknowledged: true, insertedId: ObjectId('...') }
```
La colección se crea con el primer insert: no hay DDL.

### Paso 5
**Consigna:** volver a listar las colecciones.
**Resolución:** `db.getCollectionNames()` → `[ 'players' ]`.

### Paso 6
**Consigna:** ver los documentos de `players`.
**Resolución:**
```javascript
db.players.find()
// [ { _id: ObjectId('...'), name: 'Aaron Appindangoye', height: 182, weight: 187 } ]
```
Todo documento tiene un `_id` único; si no se da, MongoDB genera un `ObjectId`.

### Paso 7
**Consigna:** insertar a Cavani, con fecha de nacimiento.
**Resolución:**
```javascript
db.players.insertOne({name:'Edinson Cavani', height: 182, dob: new Date(1987,2,14,0,0)})
```
(atención) En JavaScript el mes va de 0 a 11: `new Date(1987,2,14)` guarda **14/03/1987**
(`ISODate('1987-03-14T00:00:00.000Z')` en el contenedor, que corre en UTC). Para una fecha exacta:
`new Date('1987-02-14')`.

### Paso 8
**Consigna:** volver a ejecutar `find()`.
**Resolución:** dos documentos: Aaron (con `weight`, sin `dob`) y Cavani (con `dob`, sin `weight`).
Misma colección, campos distintos: no hay esquema.

### Paso 9
**Consigna:** borrar todos los documentos de `players`.
**Resolución:**
```javascript
db.players.deleteMany({})   // { acknowledged: true, deletedCount: 2 }
```
Selector vacío = todos. La colección sigue existiendo (vacía); `deleteMany` no es `drop()`.

### Paso 10
**Consigna:** cargar los doce jugadores.
**Resolución:**
```javascript
db.players.insertOne({name:'Luka Modric', height: 180, weight:143, dob: new Date(1985,9,9,0,0), preferred_foot: 'right', hobbies:['Playing football','Watching TV series','Swimming']});
db.players.insertOne({name:'Harry Kane', weight:143, dob: new Date(1993,7,28,0,0), preferred_foot: 'right', hobbies:['Watching Movies','Swimming']});
db.players.insertOne({name:'Neymar', height: 175, weight:150, dob: new Date(1992,2,5,0,0), preferred_foot: 'right', hobbies:['Video games','Watching TVseries','Swimming']});
db.players.insertOne({name:'David Silva', height: 170, weight:148, dob: new Date(1986,8,1,0,0), preferred_foot: 'left', hobbies:['Playing football', 'Watching Movies']});
db.players.insertOne({name:'Eden Hazard', height: 172, weight:163, dob: new Date(1991,1,7,0,0), preferred_foot: 'right', hobbies:['Watching Movies','Video games','Watching TV series']});
db.players.insertOne({name:'Antoine Griezmann', height: 175, weight:148, dob: new Date(1991,3,21,0,0), preferred_foot: 'left', hobbies:['Video games','Swimming']});
db.players.insertOne({name:'Lionel Messi', height: 170, weight:159, dob: new Date(1987,6,24,0,0), preferred_foot: 'left', hobbies:['Watching Movies','Video games','Watching TV series','Swimming']});
db.players.insertOne({name:'Cristiano Ronaldo', height: 185, weight:176, dob: new Date(1985,2,5,0,0), preferred_foot: 'left', hobbies:['Video games','Swimming']});
db.players.insertOne({name:'Toni Kroos', height: 182, weight:172, dob: new Date(1990,1,4,0,0), preferred_foot: 'right', hobbies:['Watching Movies','Video games','Watching TV series']});
db.players.insertOne({name:'Sergio Ramos', height: 182, weight:165, dob: new Date(1986,3,30,0,0), preferred_foot: 'right', hobbies:['Video games','Watching TV series']});
db.players.insertOne({name:'Samuel Umtiti', height: 180, weight:165, dob: new Date(1993,11,14,0,0), preferred_foot: 'left', hobbies:['Playing football','Swimming']});
db.players.insertOne({name:'Paulo Dybala', height: 175, weight:161, dob: new Date(1993,11,15,0,0), preferred_foot: 'left', hobbies:['Playing football','Watching TV series','Swimming']});
db.players.countDocuments()   // 12
```
Datos que deciden los pasos siguientes: **Harry Kane no tiene `height`**; `'Watching TVseries'` de
Neymar (sin espacio, errata del PDF) no es igual a `'Watching TV series'`; `hobbies` es un arreglo.

## Pasos 11–13 — Selectores

### Paso 11
**Consigna:** zurdos que pesen más de 170 libras.
**Resolución:**
```javascript
db.players.find({preferred_foot: 'left', weight:{$gt:170}})
```
**Cristiano Ronaldo** (176). Dos condiciones en el mismo documento = AND implícito.

### Paso 12
**Consigna:** jugadores sin el campo `height`.
**Resolución:**
```javascript
db.players.find({height:{$exists:false}})
```
**Harry Kane**. (nota) `{height: null}` traería además los que tengan `height: null`; `$exists: false`
solo los que no tienen el campo.

### Paso 13
**Consigna:** diestros que jueguen al fútbol, o jueguen videojuegos, o pesen menos de 150.
**Resolución:**
```javascript
db.players.find({preferred_foot:'right',
                 $or:[{hobbies:'Playing football'}, {hobbies:'Video games'}, {weight:{$lt:150}}]})
```
Los **6 diestros**: Modric, Kane, Neymar, Hazard, Kroos, Ramos. `{hobbies: 'Video games'}` sobre un
arreglo matchea si **algún elemento** es igual.

## Pasos 14–15 — Expresiones regulares

### Paso 14
**Consigna:** jugadores cuyo nombre empieza con S.
**Resolución:** `db.players.find({name: { $regex: "^S"}})` → **Sergio Ramos, Samuel Umtiti**.
Distingue mayúsculas: para ignorarlas, `{$regex: "^s", $options: "i"}` o `/^s/i`.

### Paso 15
**Consigna:** jugadores cuyo nombre termina en o.
**Resolución:** `db.players.find({name: { $regex: "o$"}})` → **Cristiano Ronaldo** (único).

## Pasos 16–22 — Comandos de actualización

### Paso 16
**Consigna:** actualizar el peso de Messi a 180.
**Resolución:**
```javascript
db.players.updateOne({name: 'Lionel Messi'},{$set:{weight:180}})
// { acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }
```
Desde aquí Messi es el más pesado: cambia el resultado del paso 26.

### Paso 17
**Consigna:** corregir la altura de Modric de 180 a 175 con `$inc`.
**Resolución:**
```javascript
db.players.updateOne({name: 'Luka Modric'},{$inc:{height:-5}})   // matchedCount: 1, modifiedCount: 1
```
`$inc` con valor negativo decrementa.

### Paso 18
**Consigna:** ver los hobbies de David Silva y agregarle `'Swimming'`.
**Resolución:**
```javascript
db.players.find({name: 'David Silva'})   // hobbies: [ 'Playing football', 'Watching Movies' ]
db.players.updateOne({name: 'David Silva'},{$push:{hobbies:'Swimming'}})   // modifiedCount: 1
```
`$push` admite duplicados si se repite; `$addToSet` agrega solo si no está.

### Paso 19
**Consigna:** contador de visitas sin upsert.
**Resolución:**
```javascript
db.hits.updateOne({page: 'players'}, {$inc:{hits:1}})
// { acknowledged: true, matchedCount: 0, modifiedCount: 0, upsertedCount: 0 }
```
No encuentra nada y no inserta: la colección `hits` ni siquiera se crea.
(atención) "Tercer parámetro en true" es la firma legacy `update(q, u, true)`; en `updateOne` el
tercer parámetro es un documento `{upsert: true}`. `updateOne(q, u, true)` no da error, pero **ignora**
el `true` y no hace upsert (verificado).

### Paso 20
**Consigna:** el mismo contador con upsert.
**Resolución:**
```javascript
db.hits.updateOne({page: 'players'}, {$inc:{hits:1}}, {upsert:true})
// { acknowledged: true, insertedId: ObjectId('...'), matchedCount: 0, modifiedCount: 0, upsertedCount: 1 }
```
Como no existe, inserta `{page: 'players', hits: 1}`.

### Paso 21
**Consigna:** repetir el upsert y verificar los hits.
**Resolución:** la segunda ejecución da `matchedCount: 1, modifiedCount: 1` y
`db.hits.find()` → `{ page: 'players', hits: 2 }`; cada nueva ejecución suma 1.

### Paso 22
**Consigna:** actualizar todos los documentos a la vez.
**Resolución:**
```javascript
db.players.updateMany({}, {$set:{active:true}})   // matchedCount: 12, modifiedCount: 12
```
Agrega el campo `active` a los 12: es un `ALTER TABLE ADD COLUMN` sin DDL.

## Pasos 23–27 — Selección de campos

### Paso 23
**Consigna:** obtener solo los nombres.
**Resolución:** `db.players.find({},{name:1})` → 12 documentos `{ _id: ObjectId('...'), name: '...' }`.

### Paso 24
**Consigna:** excluir el `_id`.
**Resolución:** `db.players.find({},{name:1, _id:0})` → `{ name: 'Luka Modric' }`, ...
(nota) `_id` es el único campo que se puede excluir en una proyección de inclusión: `{name: 1, weight: 0}` da error.

### Paso 25
**Consigna:** jugadores ordenados del más alto al más bajo.
**Resolución:**
```javascript
db.players.find({},{name:1, height:1,_id:0}).sort({height:-1})
```

| `height` | `name` |
| :---: | --- |
| 185 | Cristiano Ronaldo |
| 182 | Toni Kroos, Sergio Ramos |
| 180 | Samuel Umtiti |
| 175 | Luka Modric (ya corregido en el paso 17), Neymar, Antoine Griezmann, Paulo Dybala |
| 172 | Eden Hazard |
| 170 | David Silva, Lionel Messi |
| (sin campo) | Harry Kane, último |

Un campo ausente ordena como `null`, por debajo de cualquier número.

### Paso 26
**Consigna:** el segundo y el tercer jugador más pesado.
**Resolución:**
```javascript
db.players.find().sort({weight:-1}).limit(2).skip(1)
```
**Cristiano Ronaldo (176) y Toni Kroos (172)**: el primero es Messi (180, por el paso 16). El servidor
aplica siempre `sort → skip → limit`, así que `.limit(2).skip(1)` equivale a `.skip(1).limit(2)`.

### Paso 27
**Consigna:** contar los jugadores que tienen `'Swimming'` entre sus hobbies.
**Resolución:**
```javascript
db.players.countDocuments({hobbies:'Swimming'})   // 9
```
9 = Modric, Kane, Neymar, Silva (por el paso 18), Griezmann, Messi, Ronaldo, Umtiti, Dybala.
(atención) `db.players.find({hobbies:'Swimming'}).count()` da lo mismo pero está deprecado: usar `countDocuments`.

## Pasos 28–29 — Documentos embebidos

### Paso 28
**Consigna:** agregarle a Cristiano Ronaldo un subdocumento con su equipo.
**Resolución:**
```javascript
db.players.updateOne({name: 'Cristiano Ronaldo'},
                     {$set:{team:{ team_long_name: 'Juventus', team_short_name: 'JUV'}}})   // modifiedCount: 1
```

### Paso 29
**Consigna:** buscar por un campo del subdocumento.
**Resolución:**
```javascript
db.players.find({'team.team_short_name': 'JUV'})
// Cristiano Ronaldo, con team: { team_long_name: 'Juventus', team_short_name: 'JUV' }
```
La clave con punto va entre comillas. Embeber evita el join al leer, a costa de duplicar el dato si
varios jugadores comparten equipo.

## Pasos 30–34 — Índices y administración

### Paso 30
**Consigna:** crear un índice sobre `name`.
**Resolución:**
```javascript
db.players.createIndex({name: 1})   // 'name_1'
```
(atención) El PDF usa `ensureIndex({name:1})`: deprecado y fuera de la documentación; en `mongosh`
2.11.1 todavía corre sin aviso y devuelve `[ 'name_1' ]`.

### Paso 31
**Consigna:** borrar ese índice.
**Resolución:**
```javascript
db.players.dropIndex({name:1})   // { nIndexesWas: 2, ok: 1 }   (también vale dropIndex('name_1'))
```
El `2` cuenta el índice automático de `_id`, que no se puede borrar.

### Paso 32
**Consigna:** crear un índice único sobre `name`.
**Resolución:**
```javascript
db.players.createIndex({name: 1}, {unique: true})   // 'name_1'
```
Funciona porque los 12 nombres son distintos; con un duplicado fallaría con `E11000 duplicate key
error`. Es la única restricción declarativa de MongoDB (no hay `NOT NULL`, `CHECK` ni FK).

### Paso 33
**Consigna:** índices sobre campos embebidos, arreglos y compuestos.
**Resolución:**
```javascript
db.players.createIndex({name: 1, weight: 1})              // 'name_1_weight_1' (compuesto, el del PDF)
db.players.createIndex({'team.team_short_name': 1})       // campo embebido
db.players.createIndex({hobbies: 1})                      // arreglo: índice multikey, una entrada por elemento
```
El compuesto sirve para filtrar por `name` o por `name + weight`, no por `weight` solo (regla del prefijo).

### Paso 34
**Consigna:** verificar con `explain()` qué índice usa la búsqueda de Messi.
**Resolución:**
```javascript
db.players.find({name: 'Lionel Messi'}).explain()
// winningPlan: { stage: 'EXPRESS_IXSCAN', keyPattern: '{ name: 1 }', indexName: 'name_1' }
```
Usa `name_1` (el único del paso 32). Con `explain('executionStats')`: `nReturned: 1`,
`totalKeysExamined: 1`, `totalDocsExamined: 1`. Sin índice el plan sería `COLLSCAN` y examinaría los 12.
(nota) En versiones anteriores a la 8 el mismo plan aparece como `FETCH` → `IXSCAN`; lo que importa es
índice (`IXSCAN`) contra recorrido completo (`COLLSCAN`).

---

## Ejercicio 1

**Consigna:** construir la o las colecciones para representar la tabla de bandas (nombre del
solista, género, estilo, fecha de inscripción, discos con año, barrio, integrantes), pensando en las
consultas pedidas.

**Resolución:** una sola colección `bandas`, con los **discos embebidos** como arreglo de
`{titulo, anio}`. Ninguna consulta pide nada "por disco": los discos solo se filtran por año desde la
banda (ejercicios 7 y 8), así que embeberlos evita un `$lookup`. Decisiones: `fecha_inscripcion`
como `Date` (un string `dd/mm/aaaa` no ordena), `anio` numérico, sin campo `estilo` ni `discos`
cuando la tabla los deja vacíos, valores en mayúsculas como en la tabla, y `EFECTO ALFONS` como
**dos documentos** (la tabla lo trae dos veces, con fecha y disco distintos).

```javascript
use lab
db.bandas.insertMany([
  { nombre: 'VER K BITCH', genero: 'INSTRUMENTAL', fecha_inscripcion: new Date('2018-01-20'),
    discos: [ { titulo: 'DIOS AGUJERO NEGRO', anio: 2008 }, { titulo: 'APICHONADOS', anio: 2007 },
              { titulo: 'MERIDIANO', anio: 2006 }, { titulo: 'CAUSALIDADES', anio: 2005 },
              { titulo: 'PLANETA ESMERALDA', anio: 2001 } ],
    barrio: 'VERSALLES', integrantes: 1 },
  { nombre: 'TROTAMUNDOS', genero: 'INDIE', fecha_inscripcion: new Date('2017-11-30'),
    discos: [ { titulo: 'HECHO BOLITA', anio: 2014 } ], barrio: 'VILLA LURO', integrantes: 4 },
  { nombre: 'EFECTO ALFONS', genero: 'ROCK', estilo: 'POWER TRIO', fecha_inscripcion: new Date('2017-11-27'),
    discos: [ { titulo: 'EFECTO ALFONS', anio: 2000 } ], barrio: 'BARRACAS', integrantes: 3 },
  { nombre: 'MARCELO GIULLITTI', genero: 'SOLISTA', fecha_inscripcion: new Date('2017-11-26'),
    barrio: 'AGRONOMIA', integrantes: 1 },
  { nombre: 'AFTERLIFE', genero: 'ROCK', estilo: 'ROCK ALTERNATIVO', fecha_inscripcion: new Date('2017-11-14'),
    barrio: 'BALVANERA', integrantes: 5 },
  { nombre: 'VIRGINIA FERREYRA', genero: 'ROCK', estilo: 'ROCK POP', fecha_inscripcion: new Date('2017-11-14'),
    barrio: 'VILLA DEL PARQUE', integrantes: 1 },
  { nombre: 'LMV', genero: 'POP', fecha_inscripcion: new Date('2017-11-10'),
    barrio: 'LA LUCILA', integrantes: 6 },
  { nombre: 'EFECTO ALFONS', genero: 'ROCK', estilo: 'POWER TRIO', fecha_inscripcion: new Date('2017-11-06'),
    discos: [ { titulo: 'EFECTO ALFONS', anio: 1995 } ], barrio: 'BARRACAS', integrantes: 3 },
  { nombre: 'TANTAS PREGUNTAS', genero: 'PUNK', estilo: 'PUNK ROCK', fecha_inscripcion: new Date('2017-10-27'),
    discos: [ { titulo: 'DESPUES DE TODO', anio: 2006 }, { titulo: 'LIBRE ALBEDRIO', anio: 2006 } ],
    barrio: 'MORENO', integrantes: 3 },
  { nombre: 'TAL VEZ DE PASO', genero: 'POP', estilo: 'POP ROCK', fecha_inscripcion: new Date('2017-10-26'),
    barrio: 'PUERTO MADERO', integrantes: 4 },
  { nombre: 'LA SURTIDA FOLCK', genero: 'FOLKLORE', fecha_inscripcion: new Date('2017-10-25'),
    barrio: 'BERAZATEGUI', integrantes: 7 },
  { nombre: 'JAYDEE M', genero: 'HIP HOP / RAP', fecha_inscripcion: new Date('2017-10-24'),
    barrio: 'BARRACAS', integrantes: 1 }
])
db.bandas.countDocuments()   // 12
```

(atención) Las igualdades distinguen mayúsculas: con `'ROCK'` cargado, `{genero: 'Rock'}` no devuelve
nada. Se consulta igual que como se cargó.

## Ejercicio 2

**Consigna:** todas las bandas de menor a mayor número de integrantes.
**Resolución:**
```javascript
db.bandas.find({}, {_id: 0, nombre: 1, integrantes: 1}).sort({integrantes: 1, nombre: 1})
```
JAYDEE M 1 · MARCELO GIULLITTI 1 · VER K BITCH 1 · VIRGINIA FERREYRA 1 · EFECTO ALFONS 3 · EFECTO
ALFONS 3 · TANTAS PREGUNTAS 3 · TAL VEZ DE PASO 4 · TROTAMUNDOS 4 · AFTERLIFE 5 · LMV 6 · LA SURTIDA
FOLCK 7. El `nombre: 1` desempata alfabéticamente; el enunciado no lo exige.

## Ejercicio 3

**Consigna:** las dos bandas con más integrantes.
**Resolución:**
```javascript
db.bandas.find({}, {_id: 0, nombre: 1, integrantes: 1}).sort({integrantes: -1}).limit(2)
```
**LA SURTIDA FOLCK (7) y LMV (6).**

## Ejercicio 4

**Consigna:** sumar un integrante a todas las bandas.
**Resolución:**
```javascript
db.bandas.updateMany({}, {$inc: {integrantes: 1}})
// { acknowledged: true, matchedCount: 12, modifiedCount: 12, upsertedCount: 0 }
```
(atención) Modifica los datos: desde aquí cada banda tiene un integrante más (total 39 → 51), y el
ejercicio 10 promedia los valores nuevos. Correrlo dos veces suma 2.

## Ejercicio 5

**Consigna:** bandas de género Rock.
**Resolución:**
```javascript
db.bandas.find({genero: 'ROCK'}, {_id: 0, nombre: 1, estilo: 1})
```
4 documentos: EFECTO ALFONS (x2), AFTERLIFE, VIRGINIA FERREYRA.

## Ejercicio 6

**Consigna:** bandas de género Rock o cuyo estilo tenga algo de Rock.
**Resolución:**
```javascript
db.bandas.find(
  { $or: [ { genero: 'ROCK' }, { estilo: { $regex: 'ROCK', $options: 'i' } } ] },
  { _id: 0, nombre: 1, genero: 1, estilo: 1 }
)
```
6 documentos: los 4 del ejercicio 5 más TANTAS PREGUNTAS (`PUNK ROCK`) y TAL VEZ DE PASO
(`POP ROCK`). "Algo de Rock" es una subcadena: regex sin `^` ni `$`. Los documentos sin `estilo`
simplemente no matchean.

## Ejercicio 7

**Consigna:** bandas que lanzaron disco en 2006.
**Resolución:**
```javascript
db.bandas.find({'discos.anio': 2006}, {_id: 0, nombre: 1, discos: 1})
```
VER K BITCH (MERIDIANO) y TANTAS PREGUNTAS (dos discos de 2006). La notación de punto recorre el
arreglo: compara el `anio` de cada disco. Una banda con dos discos de 2006 sale **una sola vez**.

## Ejercicio 8

**Consigna:** bandas que lanzaron disco después de 2010.
**Resolución:**
```javascript
db.bandas.find({'discos.anio': {$gt: 2010}}, {_id: 0, nombre: 1, discos: 1})
```
**TROTAMUNDOS** (HECHO BOLITA, 2014). "Después del 2010" es estricto: `$gt`.

## Ejercicio 9

**Consigna:** cantidad de bandas en Barracas.
**Resolución:**
```javascript
db.bandas.countDocuments({barrio: 'BARRACAS'})   // 3
```
EFECTO ALFONS (x2) y JAYDEE M. Si se hubieran fusionado las dos filas de EFECTO ALFONS en un
documento, daría 2.

## Ejercicio 10

**Consigna:** crear la vista `bandas_resumen` (solista, género, barrio, integrantes) y, usándola, el
promedio de integrantes por género en orden alfabético.
**Resolución:**
```javascript
db.createView('bandas_resumen', 'bandas',
  [ { $project: { _id: 0, nombre: 1, genero: 1, barrio: 1, integrantes: 1 } } ])
// { ok: 1 }

db.bandas_resumen.aggregate([
  { $group: { _id: '$genero', promedio_integrantes: { $avg: '$integrantes' } } },
  { $sort:  { _id: 1 } }
])
```

| Género (`_id`) | Promedio (después del ej. 4) | Promedio (sin el ej. 4) |
| --- | :---: | :---: |
| FOLKLORE | 8 | 7 |
| HIP HOP / RAP | 2 | 1 |
| INDIE | 5 | 4 |
| INSTRUMENTAL | 2 | 1 |
| POP | 6 | 5 |
| PUNK | 4 | 3 |
| ROCK | 4 | 3 |
| SOLISTA | 2 | 1 |

La vista es un pipeline guardado: no materializa, cada lectura lo reejecuta sobre `bandas` (por eso
refleja el `$inc` del ejercicio 4). Es de solo lectura y aparece en `getCollectionInfos()` con
`type: 'view'`. `$group` es el `GROUP BY` (la clave se llama obligatoriamente `_id`) y `$avg` el `AVG`.

## Ejercicio 11

**Consigna:** cantidad de bandas por barrio, usando la vista, de los barrios más musicales a los menos.
**Resolución:**
```javascript
db.bandas_resumen.aggregate([
  { $group: { _id: '$barrio', cantidad: { $sum: 1 } } },
  { $sort:  { cantidad: -1, _id: 1 } }
])
```
**BARRACAS 3**, y después AGRONOMIA, BALVANERA, BERAZATEGUI, LA LUCILA, MORENO, PUERTO MADERO,
VERSALLES, VILLA DEL PARQUE y VILLA LURO con 1 cada uno. `$sum: 1` es el `COUNT(*)`; "más musicales"
se lee como más bandas, y `_id: 1` desempata alfabéticamente.

---

## Enlaces

- Análisis completo, deprecaciones y trampas: [[Práctica 2026-09-15|Práctica del 15/09]]
- Continúa en [[Guía TP09 - MongoDB Parte II|Guía TP09 — MongoDB Parte II]] (reutiliza `bandas` y la vista)
- Motor: [[MongoDB]]
