---
tipo: teorica
clase: 14
deck: "BD2_Clase 14 - MongoDB Features.pdf"
unidad: 2
tema: "Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción a MongoDB · MongoDB: Enfoque embebido vs Normalizado · Ejemplos con MongoDB"
resumen: "Visita guiada por MongoDB: documentos BSON y ObjectId, mongosh y mongoimport, CRUD y consultas, índices con explain, aggregation pipeline, MapReduce, replica sets y sharding, más cuatro handouts. Como el deck mezcla shell legado y API deprecada, un cuadro traduce los comandos a mongosh 6.0+."
fecha: 2026-09-14
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 14
  - Clase 14 — MongoDB Features
  - MongoDB Features
  - Clase 14 — MongoDB
  - mongosh
  - ObjectId
  - mongoimport
  - CRUD en MongoDB
  - Aggregation pipeline
  - MapReduce en MongoDB
  - Replica sets
  - Sharding
  - Consigna MONGO DB
  - Diferencia Sharding Replication
  - Ejemplo MapReduce
fuentes:
  - "raw/Unidad-02/Teorica/BD2_Clase 14 - MongoDB Features.pdf"
  - "raw/Unidad-02/Teorica/Consigna MONGO DB.pdf"
  - "raw/Unidad-02/Teorica/Consigna MONGO DB (solucion).pdf"
  - "raw/Unidad-02/Teorica/Diferencia_Sharding_Replication_MongoDB.pdf"
  - "raw/Unidad-02/Teorica/Ejemplo_MapReduce_MongoDB.pdf"
estado: procesado
---

# Clase 14 — MongoDB: shell, CRUD, índices, agregación, MapReduce, replica sets y sharding

## Resumen general

Deck de 45 slides, casi sin texto propio, que recorre MongoDB con la consola como hilo: documentos
JSON almacenados como BSON, el campo `_id` y la anatomía del `ObjectId`, el shell `mongosh`,
`mongoimport`, CRUD con `find`/`insertOne`/`updateOne`/`deleteOne`, los operadores `$all`, `$nin`,
`$or`, `$set` y `$elemMatch`, índices con `explain()`, el *aggregation pipeline* (`$match`, `$group`,
`$sort`, `$project`), MapReduce, funciones en `system.js`, `pymongo`, replica sets y sharding. Sigue
el orden del capítulo 4 de *Seven Databases* (2ª ed.) y cita sus páginas sin nombrar el libro. Es
el motor de la segunda mitad de la cursada y el del TP 9 (Parte I, martes 15/09), y MongoDB entra
al parcial del 13/10. Cuatro handouts sin número de clase, documentados al final, agregan una
consigna de agregaciones sobre un *ecommerce* con su solución oficial, la comparativa sharding vs.
replication y un ejemplo de MapReduce.

Reglas y trampas que hay que saber:

- El deck mezcla tres épocas: `mongosh` (6.0.5), el shell legado `mongo` (eliminado en 6.0) y API
  deprecada (`insert`, `update`, `count`, `ensureIndex`, `mapReduce`). El cuadro de bolsillo traduce
  cada comando a `mongosh` 6.0+.
- Dos claves en el mismo filtro son `AND`; `OR` se pide con `$or`. `$nin` también devuelve los
  documentos donde el campo no existe: un nombre de campo mal escrito no da error, devuelve todo o
  nada.
- `update` sin `$set` reemplaza el documento entero. `$elemMatch` exige que un mismo elemento del
  arreglo cumpla todas las condiciones.
- En `$group`, `_id` es la clave de agrupación y `"$campo"` referencia un campo; `$match` antes de
  `$group` reduce el trabajo y usa índices. `mapReduce` está deprecado desde 5.0 y se traduce a
  `$group` (+ `$out`).
- Replicación copia los mismos datos (disponibilidad; un primario elegido por mayoría, de ahí el
  número impar de nodos); sharding reparte datos distintos (escala; shard key, `mongos` y config
  servers).

Para el parcial: la tabla SQL → pipeline del slide 33, el patrón `$unwind` + `$lookup` + `$unwind`
de la solución complementaria (dos operadores que el deck no enseña) y la frase «replicación copia,
sharding reparte».

## Fuente, motor y origen del deck

> [!info] Fuente
> `raw/Unidad-02/Teorica/BD2_Clase 14 - MongoDB Features.pdf` · **45 slides** · **23 imágenes
> embebidas** *(PDF generado con PowerPoint 2010 el **22/09/2023**; `Title` interno genérico
> "Presentación de PowerPoint")*. El slide 1 es la portada y el 45 el cierre; **no hay slide de
> agenda ni de bibliografía**, aunque el deck cita tres veces páginas de un libro sin nombrarlo
> *(ver el callout sobre* Seven Databases*)*.
> Dictado en la **teórica del lunes 14/09**, junto con la [[Clase 12 - Introduccion a NoSQL]] y la
> [[Clase 13 - NoSQL-EmbebidosVSNormalizado]]: **tres decks numerados 12, 13 y 14 para una sola fecha
> del [[_cronograma]]**, cuyo tema oficial es *"Introducción a las Bases de Datos NoSQL y Tipos de
> Bases NoSQL · Introducción a MongoDB · MongoDB: Enfoque embebido vs Normalizado · Ejemplos con
> MongoDB"*. Este deck es la parte de *"Ejemplos con MongoDB"*.
> La unidad es `2` porque el archivo está en `raw/Unidad-02/`: las Clases 12–14 y el TP9 son el
> primer material fuera de la U1, justo en el corte relacional → NoSQL *(la Clase 11 y el TP8 quedaron
> en U1; el registro archivo → clase está en [[_index-clases]])*.
> Se practica con el **TP 9 - MongoDB Parte I** del martes 15/09 → [[Práctica 2026-09-15]].
> Bibliografía: [[_index-bibliografia]] › Clase 14.
>
> El § *Material complementario del 14/09* documenta además los **cuatro PDF sin número de clase**
> archivados junto al deck: la consigna de agregación sobre un *ecommerce*, su solución oficial, la
> comparativa *sharding vs. replication* y el ejemplo de MapReduce. **No son clases** y por eso no
> tienen página propia.

> [!important] Motor: **MongoDB**, el de la práctica — sin motor ajeno
> Como las [[Clase 12 - Introduccion a NoSQL|Clases 12]] y [[Clase 13 - NoSQL-EmbebidosVSNormalizado|13]]
> del mismo lunes, el deck está escrito en el motor de la práctica: el [[Práctica 2026-09-15|TP9]]
> corre sobre MongoDB con `mongosh`. *(Los decks relacionales con sintaxis de PostgreSQL u Oracle
> están inventariados en [[PostgreSQL]] § *Inventario*; el primer deck relacional en el motor de la
> práctica fue la [[Clase 11 - Seguridad-Transacciones|Clase 11]], en MySQL.)*
>
> Lo que sí hay es **desfasaje de versión y de shell**: el deck mezcla tres épocas.
>
> | Época | Evidencia textual | Slides |
> | --- | --- | --- |
> | **`mongosh`** *(shell actual, desde 2020; el único soportado desde 6.0, y se instala aparte del servidor)* | *"levantando el servicio y entrando al shell (**mongosh**)"* · `$ mongosh --host localhost --port 27017` · `insertOne` · `countDocuments()` · `deleteOne` | 9, 10, 14, 27 |
> | **`mongo`** *(shell legado, eliminado en 6.0)* | pantalla de `help` con *"quit the **mongo** shell"* y `DBQuery.shellBatchSize` · `$ **mongo** localhost:27011` · `WriteResult({ "nMatched" … })` | 11, 25, 41 |
> | **API deprecada** | `db.usuarios.insert(…)` · `db.towns.update(…)` · `db.countries.count()` · `ensureIndex(…)` · `{ background : 1 }` · `db.system.js.save(…)` · `db.runCommand({ mapReduce … })` | 12, 20, 23, 25, 27, 29, 34, 36, 38 |
>
> El slide 2 fija la referencia: *"Stable release: **6.0.5** / 2023-03-13"*. En 6.0 el shell `mongo`
> **ya no se distribuye** —el recuadro del slide 10 lo dice: *"The MongoDB Shell (mongosh) is not
> installed with MongoDB Server"*— y `mongosh` acepta `insert`, `update`, `count` y `ensureIndex`
> **con aviso de deprecación**, así que casi todo corre. La traducción legado → actual está en el
> § *Cuadro de bolsillo*; lo que sea de motor va a [[MongoDB]].

> [!note] El deck es, en su mayor parte, el **capítulo 4 de *Seven Databases*** — y cita las páginas de la **2ª edición**
> El deck no nombra el libro, pero lo cita **tres veces por número de página** y una vez por sus
> archivos de código:
>
> | Slide | Cita del deck | Dónde cae en *Seven Databases* 2ª ed. *(verificado contra el PDF)* |
> | :---: | --- | --- |
> | 36 | *"ejemplo de la página **120**"* + `media.pragprog.com/titles/**pwrdata**/code/mongo/{distinctDigits,map1,reduce1}.js` | § *Mapreduce (and Finalize)*, impresas **119–123**: el texto del slide 35 es la página 120 literal, los tres `.js` están en 120–121 y el `runCommand` en 121 |
> | 41 | *"pag. **124** (example)"* | § *Replica Sets*, impresas **124–127**: `mkdir ./mongo1 …` y `--replSet book` están en 124, `rs.initiate` en 125 |
> | 44 | *"Seguir el ejemplo, de la pag. **127**"* | § *Sharding*, impresas **127–130**: el párrafo del slide es el primero de la sección |
>
> Los tres números coinciden con la paginación de la **2ª edición** *(cap. 4 = impresas 93–133)* y
> `pwrdata` es el código de esa edición. También son del libro: el documento de Portland del slide 6
> *(adaptado: la 2ª ed. usa `famousFor`/`lastCensus` con `ISODate` y `country: { $ref: "countries",
> $id: "us" }`, impresas 95–96 y 106; el slide trae `famous_for`/`last_census` como string y un
> `$id: ObjectId(…)`)*, `famousFor` con `$all`/`$nin` *(slide 22 ← impresa 100)*, `badBacon` con
> `$elemMatch` *(27 ← 107)*, `ensureIndex` sobre `phones` con 100.000 documentos *(29 ← 111–112)*, la
> **tabla de herramientas CLI** *(30 ← impresa **114**, como imagen)*, `averagePopulation` *(34 ←
> 116)*, `getLast` en `system.js` *(38 ← 119)*, el diagrama de `mongos`/`reduce` *(37 ← 122)* y la
> **tira cómica** *(40 ← impresa 124)*. Lo que **no** es del libro: los slides 1–5 *(ranking,
> creadores)*, 7–9 *(el tuit, `egresados`, `testing`)*, 12–19 *(`internos`, las GUIs)*, 21 *(`/^P/`,
> `pop_range`)*, 26 *(pymongo sobre `elecciones-2019`)*, 33 *(`hospitales`)* y 43 *(elecciones del
> replica set, de la documentación oficial)*. El mapeo fino va en [[_index-bibliografia]] › Clase 14.

> [!warning] El título promete *"Features"* y varias features centrales **no aparecen**
> Ni **transacciones multi-documento**, ni **`$lookup`**, ni **`$unwind`**, ni **validación de
> esquema**, ni **índices compuestos, multikey, de texto o TTL**, ni **GridFS**, ni **consultas
> geoespaciales**, ni **write concern / read preference**, ni **change streams** *(tabla en § *Lo
> que el deck no trae*)*. Importa porque **la solución oficial del ejercicio complementario usa
> `$unwind` y `$lookup` en los cuatro pipelines que escribe** *(la pregunta 4 reutiliza el de la
> pregunta 1 con un `$limit`)*, dos operadores que este deck no enseña.

---

## Slide 1 · Portada

> [!quote] Textual, completo
> *(logo de MongoDB)*
> *"document database"*
> *"performance"*
> *"ease data access"*
> *"no-schema"*

Cuatro palabras y ningún título de clase: **la promesa del producto**, no un temario. *Performance*
solo se ve en el `explain()` del slide 29 *(61 ms → 0 ms)*; *no-schema* aparece literal únicamente
en la portada: el slide 23 lo enuncia con otras palabras *("The records do not necessarily have the
same structure")* y los slides 15 y 16 lo muestran sin declararlo. La frase *"MongoDB Features"* del
nombre del archivo no está en ninguno de los 45 slides.

## Slides 2–5 · Ranking, versión, creadores y géneros

> [!quote] Slide 2, textual
> **DB Ranking**
> *"#5 Overall"* · *"#1 Document stores"* · `https://db-engines.com/en/system/MongoDB`
> *"Initial release: **2009**"*
> *"Stable release: 6.0.5 / 2023-03-13"*
> *"repository: github.com/mongodb/mongo"*

> [!note] La versión data el deck: **septiembre de 2023**
> `6.0.5` era la estable el 13/03/2023 y el PDF se generó el 22/09/2023. En septiembre de 2026 la
> rama estable es **8.x** *(8.0 salió en octubre de 2024)*. Nada de lo que enseña el deck cambió de
> forma sustancial entre 6.0 y 8.0, **salvo el estatus de lo que ya estaba deprecado** *(ver el
> cuadro de bolsillo)*. El [[Práctica 2026-09-15|TP9]] instala con `docker pull mongo`, que trae la
> última estable, no 6.0.5.

**Slide 3** es una **captura** de la tabla de db-engines *("414 systems in ranking, April 2023")*:
**Oracle** 1228.28 · **MySQL** 1157.78 · **Microsoft SQL Server** 918.52 · **PostgreSQL** 608.41 ·
**MongoDB** 441.90 *(−16.89 en el mes, −41.48 en el año; fila resaltada en amarillo)* · Redis 173.55 ·
IBM Db2 145.49 · Elasticsearch 141.08 · SQLite 134.54 · Microsoft Access 131.37. Los relacionales del
top 4 figuran como *"Relational, Multi-model"*; MongoDB como *"Document, Multi-model"*. MongoDB es #5
**con un tercio del puntaje de PostgreSQL** y **en baja** en abril de 2023, lo que contrasta con el
gráfico de empleo del slide 5, donde supera a PostgreSQL: db-engines mide *popularidad* por menciones
y búsquedas; LinkedIn mide demanda laboral. El deck no las concilia.

> [!quote] Slide 4, textual
> **los creadores de mongodb**
> *(dos tarjetas de contribuidores de GitHub, con histograma de commits 2008–2020)*
> **erh** *#1* — *"6,179 commits · 981,350 ++ · 566,247 −−"*
> **dwight** *#2* — *"3,477 commits · 876,158 ++ · 793,237 −−"*
> *"Eliot Horowitz · https://github.com/erh · @eliothorowitz · https://en.wikipedia.org/wiki/Eliot_Horowitz"*
> *"Dwight Merriman · https://github.com/dwight · https://en.wikipedia.org/wiki/Dwight_Merriman"*
> *"17/03/2020: https://www.mongodb.com/blog/post/hasta-la-vista"*

El link final es el anuncio de la salida de Horowitz de la empresa *(marzo de 2020)*; los dos
histogramas concentran la actividad entre 2009 y 2014.

**Slide 5** son **dos imágenes sin texto**: el **diagrama de burbujas de géneros** de *Seven
Databases* 2ª ed. *(RELATIONAL → PostgreSQL · WIDE COLUMN → HBase · DOCUMENT → **MongoDB** y CouchDB ·
GRAPH → Neo4j · KEY-VALUE → Redis · MULTI-MODEL DOCUMENT → DynamoDB; la burbuja de MongoDB es la
mayor)* y un gráfico de barras *"Job offers in the United States (source: LinkedIn)"*, sin fecha:
MongoDB ≈ 12.800, PostgreSQL ≈ 10.000, Redis ≈ 6.500, HBase ≈ 5.000, DynamoDB ≈ 4.200, Neo4j ≈ 1.000
y CouchDB ≈ 600 *(valores leídos del eje)*. Las dos imágenes son mudas para `pdftotext`.

## Slides 6–7 · El documento: JSON almacenado como BSON

> [!quote] Slide 6, textual
> *"**MongoDB** is a **JSON** document database (though technically data is stored in a binary form
> of JSON known as **BSON**)"*

Debajo, un documento de la colección `towns` del libro, con la llave *"JSON document"* al costado:

```json
{
  "_id" : ObjectId("4d0b6da3bb30773266f39fea"),
  "country" : {
  "$ref" : "countries",
  "$id" : ObjectId("4d0e6074deb8995216a8309e")
  },
  "famous_for" : [ "beer", "food" ],
  "last_census" : "Sun Jan 07 2018 00:00:00 GMT -0700 (PDT)",
  "mayor" : { "name" : "Ted Wheeler", "party" : "D" },
  "name" : "Portland",
  "population" : 582000,
  "state" : "OR"
}
```

> [!tip] El ejemplo trae, sin nombrarlas, **las tres formas de anidar** que el deck va a usar
> - **Subdocumento**: `mayor` es un objeto dentro del objeto.
> - **Arreglo**: `famous_for` es una lista de escalares *(`exports.foods` del slide 23 será una lista
> de subdocumentos)*.
> - **Referencia**: `country` es un **DBRef** —`{ $ref: <colección>, $id: <ObjectId> }`—, la
> convención de MongoDB para apuntar a un documento de otra colección: el *"normalizado"* de la
> [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] *(en* Seven Databases*, § *References*, impresas
> 106–107)*. **`$lookup`, la manera de seguir esa referencia en una consulta, no aparece en el
> deck.**
>
> `last_census` es un **string**, no una fecha: el libro lo carga como `lastCensus: ISODate(…)`
> *(impresas 95–96)* y MongoDB tiene un tipo `Date` *(el `ISODate` del slide 8 y de la consigna
> complementaria)*. Y el campo cambia de nombre dentro del deck: `famous_for` aquí, `famousFor` en el
> slide 22 *(§ *Contradicciones*)*.

> [!quote] Slide 7, textual
> **Ejemplo de un tuit en formato JSON**
> `https://gist.github.com/aaizemberg/c297e70f46a57affee76d8886a607298`

Sigue el volcado, en sintaxis **de diccionario de Python** *(comillas simples, `None` en lugar de
`null`)*, de un tuit de `@aaizemberg` del 1 de septiembre de 2019: `created_at: 'Sun Sep 01 19:05:54
+0000 2019'`, `entities.hashtags: []`, y un `entities.media[0]` con `id` *(`1168238539403943944`,
número)*, `id_str` *(el mismo, string)* y `sizes` con cuatro subdocumentos
`large`/`medium`/`small`/`thumb`. Es el argumento de *"ease data access"*: la API de Twitter
devuelve **este** objeto y MongoDB lo guarda **tal cual**, con tres niveles de anidamiento, sin
diseñar seis tablas; la pareja `id` / `id_str` *(para clientes sin enteros de 64 bits)* es una
redundancia que un esquema normalizado no aceptaría. Y muestra que **JSON ≠ dict de Python**: los
slides 26 y 39 vuelven a Python; los demás están en sintaxis de shell *(JavaScript)*.

## Slides 8–9 · El campo `_id`: `ObjectId` o valor del usuario

> [!quote] Slide 8, textual
> **"_id" → ObjectId o generado por el usuario**
> ```
> > db.egresados.findOne()
> {
> "_id" : ObjectId("5d712e759bec0f1238869a1a"),
> "Legajo" : "53213",
> "Apellido" : "Freddo",
> "Nombre" : "Ramiro",
> "Título" : "Ingeniero en Informática",
> "promedio_lineal" : 6.68
> }
> > db.egresados.findOne()._id
> ObjectId("5d712e759bec0f1238869a1a")
> > db.egresados.findOne()._id.getTimestamp()
> ISODate("2019-09-05T15:49:09Z")
> > db.egresados.findOne()._id.toString()
> ObjectId("5d712e759bec0f1238869a1a")
> > db.egresados.findOne()._id.valueOf()
> 5d712e759bec0f1238869a1a
> ```

El `ObjectId` es un valor de **12 bytes**: los primeros 4 son un **timestamp Unix en segundos**
—por eso `getTimestamp()` responde sin consultar nada: `0x5d712e75` = 1 567 698 549 s =
**2019-09-05 15:49:09 UTC**, lo que imprime el slide—, los otros 8 son un valor aleatorio por
proceso *(5 bytes)* y un contador *(3 bytes)*. La misma cuenta fecha las capturas del deck:
`5e95cbbf…` *(slide 9)* → 14/04/2020; `5f4e8167…` *(slide 15, `internos`)* → 01/09/2020;
`5bb50d1f…` *(slide 16, Robomongo)* → 03/10/2018, el mismo día del `mongoimport` del slide 14;
`4d0b6da3…` *(slide 6, Portland)* → 17/12/2010. **El deck se armó con capturas de al menos cuatro
años distintos.**

> [!warning] `toString()` **no** devuelve el hexadecimal
> En el slide, `toString()` devuelve `ObjectId("…")` *(la representación de shell)* y **`valueOf()`**
> el string de 24 caracteres hexadecimales: al revés de lo esperable en JavaScript, y fuente de
> errores al comparar ids con strings. En `mongosh` actual, `toString()` devuelve el hexadecimal a
> secas y `toHexString()` es la forma explícita: otro punto donde la captura *(shell legado)* y el
> shell del TP difieren. **A verificar en el TP9.**

> [!quote] Slide 9, textual
> **"_id" → ObjectId o generado por el usuario**
> ```
> > db.testing.insertOne({"_id": 1, "value": 10})
> { "acknowledged" : true, "insertedId" : 1 }
>
> > db.testing.insertOne({"_id": "2", "value": 20})
> { "acknowledged" : true, "insertedId" : "2" }
>
> > db.testing.insertOne({"value": 30})
> { "acknowledged" : true, "insertedId" : ObjectId("5e95cbbf8d72de7f0b97e4bd") }
>
> > db.testing.find()
> { "_id" : 1, "value" : 10 }
> { "_id" : "2", "value" : 20 }
> { "_id" : ObjectId("5e95cbbf8d72de7f0b97e4bd"), "value" : 30 }
> ```
> `https://docs.mongodb.com/manual/reference/method/ObjectId/`

Tres inserciones, tres tipos de `_id` **en la misma colección**. Lo que enseña sin decirlo:

| Regla | Dónde se ve |
| --- | --- |
| `_id` es **obligatorio y único** por colección *(lo impone el índice del slide 28)* | los tres documentos lo tienen |
| Si el cliente no lo manda, **el driver lo genera** como `ObjectId` | tercera inserción |
| Puede ser **de cualquier tipo** salvo arreglo | `1`, `"2"`, `ObjectId` |
| **El tipo es parte del valor**: `1` y `"1"` serían dos ids distintos | `"_id": "2"` va entre comillas |
| `insertOne` devuelve el `insertedId`, sea cual sea | las tres respuestas |

Es la primera aparición de `insertOne` en el deck, tres slides *antes* de que el slide 12 use el
`insert()` deprecado.

## Slides 10–11 · Levantar el servicio y entrar al shell

> [!quote] Slide 10, textual
> **levantando el servicio y entrando al shell (mongosh)**
> ```
> # prender y apagar el servicio
> #
> $ sudo service mongod start
> $ sudo service mongod stop
>
> # levantar el shell
> #
> $ mongosh --host localhost --port 27017  # es equivalente a
> $ mongosh  # esta otra instrucción
>
> > show dbs
> # mostrar las bases de datos
> ```
> Recuadro *(captura de la documentación)*: *"**MongoDB Shell, mongosh** — The MongoDB Shell
> (mongosh) is not installed with MongoDB Server. You need to follow the mongosh installation
> instructions to download and install mongosh separately."*

**`mongod`** es el servidor *(el "demonio", el que se enciende con `service`)* y **`mongosh`** el
cliente. Los valores por defecto —`localhost` y puerto **27017**— son los que el slide 41 tendrá que
evitar al levantar tres servidores en la misma máquina. En el [[Práctica 2026-09-15|TP9]] el servidor
corre en **Docker** *(`docker run --name Mymongo -p 27017:27017 -d mongo`)* y el shell se abre
**dentro del contenedor** *(`docker exec -it Mymongo bash` y después `mongosh`)*: encender y apagar
es `docker start/stop Mymongo`, no `service`.

**Slide 11** es una **captura de terminal** con la salida de `> help` del **shell legado `mongo`**:

```
> help
  db.help()  help on db methods
  db.mycoll.help()  help on collection methods
  sh.help()  sharding helpers
  rs.help()  replica set helpers
  help admin  administrative help
  help connect  connecting to a db help
  help keys  key shortcuts
  help misc  misc things to know
  help mr  mapreduce

  show dbs  show database names
  show collections  show collections in current database
  show users  show users in current database
  show profile  show most recent system.profile entries with time >= 1ms
  show logs  show the accessible logger names
  show log [name]  prints out the last segment of log in memory, 'global' is default
  use <db_name> set current database
  db.mycoll.find()  list objects in collection mycoll
  db.mycoll.find( { a : 1 } )  list objects in mycoll where a == 1
  it  result of the last line evaluated; use to further iterate
  DBQuery.shellBatchSize = x  set default number of items to display on shell
  exit  quit the mongo shell
```

> [!bug] El slide 10 dice `mongosh` y el slide 11 muestra la ayuda de **`mongo`**
> *"quit the **mongo** shell"*, `DBQuery.shellBatchSize` y `help mr` *(mapreduce)* son del shell
> legado; en `mongosh` la ayuda lista `use`, `show`, `exit` y los helpers `db.help()`, `rs.help()`,
> `sh.help()`, y el tamaño de lote se cambia con `config.set("displayBatchSize", x)`. Sigue igual
> `it` para seguir iterando el cursor.

## Slides 12–13 · `use`, `createCollection`, `insert` y "¿colecciones o tablas?"

> [!quote] Slide 12, textual
> **insertando un registro**
> ```
> # usar una base de datos
> #
> use test
>
> # crear una colección (o tabla)
> #
> db.createCollection("usuarios")
>
> # insertando 1 registro
> #
> db.usuarios.insert({"nombre": "Ariel", "apellido": "Aizemberg", "username": "aaizemberg"})
> ```

> [!quote] Slide 13, textual
> **colecciones o tablas?**
> *"probar estas 3 instrucciones"*
> 1. `> show collections`
> 2. `> show tables`
> 3. `> db.getCollectionNames()`
>
> `> show dbs  // para listar las bases de datos`

El vocabulario, puesto en limpio, porque el deck lo usa de forma intercambiable *("colección (o
tabla)", "registro")*:

| Relacional | MongoDB | Observación |
| --- | --- | --- |
| base de datos | **database** | `use test` la crea si no existe |
| tabla | **collection** | `show tables` es un **alias** de `show collections` en el shell — por eso el slide 13 pide probar las dos |
| fila / registro | **document** | el deck dice "registro" |
| columna | **field** | no hay lista fija de campos |
| PK | **`_id`** | siempre presente |

> [!tip] `db.createCollection("usuarios")` **no hace falta**, y el TP9 lo dice
> La colección se crea sola con el primer `insert`; el enunciado del [[Práctica 2026-09-15|TP9]] lo
> explicita: *"No es necesario crear un esquema para la colección, puede simplemente insertar un
> nuevo documento en la nueva colección"*. `createCollection` sirve para pasar **opciones**
> *(colección *capped*, validación de esquema, *collation*)*. Lo mismo `use test`: `test` es la base
> que abre `mongosh` por defecto.

**`insert()`** está **deprecado** desde 3.2 en favor de `insertOne` / `insertMany`; `mongosh` lo
acepta con un `DeprecationWarning`. El slide 9 ya había usado la forma nueva.

## Slides 14–15 · `mongoimport` de un TSV y `findOne()`

> [!quote] Slide 14, textual
> **Importando un archivo .tsv (mongoimport)**
> ```
> $ mongoimport --headerline --db test --collection internos --type tsv < internos.tsv
>
> connected to: 127.0.0.1
> 2018-10-03T15:40:31.471-0300 check 9 290
> 2018-10-03T15:40:31.472-0300 imported 289 objects
>
> > db.internos.count()  ← en gris claro
> > db.internos.countDocuments()
> 289
> ```
> *(Una flecha va desde `--headerline` hasta el `290` de la línea `check`.)*

La flecha es el detalle del slide: el archivo tiene **290 líneas**, se importaron **289
documentos**, y la diferencia es la **cabecera**, que `--headerline` consume como nombres de campo.

| Flag | Qué hace |
| --- | --- |
| `--headerline` | la primera línea del archivo da los **nombres de campo** |
| `--db test --collection internos` | destino; los dos se crean si no existen |
| `--type tsv` | separador tabulación; el default es JSON, y también acepta `csv` |
| `< internos.tsv` | el archivo entra por **stdin**; el equivalente explícito es `--file internos.tsv` |

> [!important] El slide corrige un deprecado **en cámara**: `count()` → `countDocuments()`
> Es la única vez en el deck que un método viejo y su reemplazo se muestran juntos. `count()` sin
> filtro **puede devolver un número aproximado** *(usa metadatos; en un replica set después de un
> apagado abrupto puede estar desactualizado)*; desde 4.0 se recomienda `countDocuments()` *(exacto,
> acepta filtro)* o `estimatedDocumentCount()` *(rápido, sin filtro)*. **Los slides 27, 29 y 34
> vuelven a `count()`.**

> [!quote] Slide 15, textual
> **Mostrando el primer registro (pretty print)**
> ```
> > db.internos.findOne()
> {
> "_id" : ObjectId("5f4e8167587f8b5c6d24ec31"),
> "nombre" : "Aguiar Andrea",
> "user" : "aaguiar",
> "int" : 4741,
> "area" : "Calidad Educativa",
> "sector" : "Calidad Educativa",
> "sede" : "Central"
> }
> ```

`findOne()` devuelve **un** documento *(el primero en orden natural)* indentado; en el shell legado
`find()` devolvía una línea por documento y había que encadenar `.pretty()`; en `mongosh`, `find()`
también imprime indentado. **El campo `int` es entero** *(4741, sin comillas)*: `mongoimport`
infiere tipos numéricos por defecto, y `nombre` entró como *"Apellido Nombre"*, tal como venía el
TSV.

## Slides 16–19 · Cuatro GUIs

> [!quote] Slide 16, textual
> **Robomongo (GUI) → Robo 3T (Studio $)**

Captura de **Robomongo 0.9.0-RC9** conectado a `localhost:27017`, base `test`, con la consulta
`db.getCollection('internos').find({'apellido':'Aizemberg'})` *(0.002 s)* y el resultado en vista de
árbol: `_id ObjectId("5bb50d1f68b6ed0c97283d49")`, `apellido Aizemberg`, `nombre Ariel`, `interno
6050` *(Int32)*, `sede Distrito Tecnológico`, `ubicacion SDT`, `usuario aaizemberg`, `area
Ingeniería Informática`.

> [!bug] La colección `internos` del slide 16 **no tiene los mismos campos** que la del slide 15
> Slide 15: `nombre` / `user` / `int` / `area` / `sector` / `sede`. Slide 16: `apellido` / `nombre` /
> `interno` / `sede` / `ubicacion` / `usuario` / `area`. Los `ObjectId` lo explican: la del slide 16
> es de **octubre de 2018** *(la importación del slide 14)* y la del 15 de **septiembre de 2020**:
> **dos archivos TSV distintos importados en dos años distintos** en la misma colección. Es el mejor
> ejemplo de *no-schema* que trae el deck, y no lo comenta.

**Slide 17 — MongoDB Compass.** Captura de **Compass 4.0.8 Community** *(datos de julio de 2018)*
conectado a `localhost:27017`, base **`7dbs`** *(otra vez *Seven Databases*; colecciones `internos`,
`narda`, `neighborhoods`, `restaurants`)*, pestaña **Schema** de `narda`: 104 documentos, 24.8 KB,
promedio 244 B, 1 índice de 16.0 KB; `date` es `string` y `fav` es `int32`. Compass **infiere** el
esquema muestreando documentos y reporta, por campo, qué tipos aparecen y con qué frecuencia: es la
herramienta con la que se descubre una colección heredada como la `internos` doble de los slides 15–16.
El banner *"CREATE FREE ATLAS CLUSTER — Includes 512 MB of data storage"* de su barra lateral
es una de las dos apariciones de Atlas en el deck.

**Slide 18 — DataGrip.** Título con link: *"DataGrip — a great database IDE to work with MongoDB
Atlas"*. Tres líneas —`let query = {year: 1982};` · `let projection = {year: 1, title: 1, _id: 0};`
· `db.movies.find(query, projection).limit(10);`— y una grilla con nueve títulos de 1982. La
colección `movies` es el dataset de ejemplo `sample_mflix` de **Atlas**, la única mención textual del
docente al servicio en la nube. DataGrip es la GUI que el [[Práctica 2026-09-15|TP9]] recomienda
primero.

**Slide 19 — NoSQLBooster.** *"NoSQLBooster for MongoDB - MongoBooster"* *(link)*. Árbol de conexión
`localhost_40017` → `test (13 | 1.8GB)` *(entre otras, `testCollection (11.0M | 1.8GB)`)*, un popup
de autocompletado sobre `db`, y el panel *Samples* con *"MongoDB Basic CRUD Operations"*, *"MongoDB
Basic Query Operators"* y el tutorial *"Fluent Query API → aggregation pipeline"*.

| GUI | Estado hoy | En el TP9 |
| --- | --- | --- |
| Robomongo → **Robo 3T** | absorbido por Studio 3T; el TP dice *"Robo 3T is now Studio 3T Free"* | opción |
| **Compass** | la GUI **oficial**, gratuita; trae el *aggregation pipeline builder* | opción; **la consigna complementaria pide resolver "usando MongoDB (Compass)"** |
| **DataGrip** | JetBrains, pago *(gratis con licencia de estudiante)* | **la primera que nombra el TP** |
| **NoSQLBooster** | comercial con versión gratuita | no la nombra |

## Slide 20 · CRUD and Nesting — el resumen de comandos

> [!quote] Textual
> **CRUD and Nesting**
> ```
> use DATABASE_NAME  # crea o usa una DB
> show dbs  # muestra las
> db  # te informa en que DB estas
> show collections
> db.towns.insert( <JSON> )  # inserta un registro
> db.town.findOne()  # busca 1 registro
> db.town.find()
> ```
> *"Se puede ver cómo está implementada una función, si la llamamos sin los parentesis, ej:
> db.town.findOne"* **[sic: "parentesis", "estas", "que" sin tilde]**

El título es el del **Day 1** del libro *(§ *Day 1: CRUD and Nesting*, impresas 94–110)*. **`db`
solo** imprime el nombre de la base actual *(el comentario *"# muestra las"* quedó cortado por la
maquetación)*. **La función sin paréntesis** devuelve su **código fuente**: `db.town.findOne`
imprime el JavaScript de `findOne`, porque en el shell una función es un valor; el TP9 lo repite:
*"si ejecuta un comando y omite los paréntesis (), se mostrará el cuerpo del método"*.

> [!bug] `db.towns.insert` y `db.town.findOne()` — la colección cambia de nombre a mitad del slide
> `towns` en el insert, `town` en las dos lecturas. En MongoDB **eso no da error**: `db.town.find()`
> sobre una colección inexistente devuelve vacío. Un esquema relacional lo atajaría *(tabla
> inexistente)*; aquí pasa en silencio, el mismo problema que el slide 22 advierte para los nombres
> de campo. Transcripto `[sic]`.

## Slides 21–22 · Consultas: proyección, regex, rangos, `$all` y `$nin`

> [!quote] Slide 21, textual
> **buscando con expresiones regulares y rangos**
> ```
> > db.towns.find( { name : /^P/ }, { _id: 0, name : 1, population : 1 } )
> { "name" : "Punxsutawney", "population" : 6200 }
> { "name" : "Portland", "population" : 582000 }
>
> > db.towns.find( { name : /^P/ , population : { $lt : 10000 } }, { _id: 0, name : 1, population : 1 } )
> { "name" : "Punxsutawney", "population" : 6200 }
>
> > var pop_range = { $lt: 1000000, $gt: 10000 }
> > db.towns.find( { name : /^P/ , population : pop_range}, { _id: 0, name : 1, population : 1 } )
>
> > db.internos.find({nombre: /aiz.*/i})
> ```

Anatomía de `find(filtro, proyección)`, que el slide da por sabida:

| Pieza | Sintaxis en el slide | Equivalente SQL |
| --- | --- | --- |
| **Filtro** | primer argumento, `{ campo : valor }` | `WHERE` |
| **Proyección** | segundo argumento, `{ _id: 0, name : 1, population : 1 }` | lista del `SELECT` |
| Regex | `/^P/` *(literal JavaScript)*; `/aiz.*/i` con flag de mayúsculas | `LIKE 'P%'` / `ILIKE '%aiz%'` |
| Rango | `{ $lt : 10000 }`; `{ $lt: 1000000, $gt: 10000 }` | `< 10000`; `BETWEEN` abierto |
| Dos condiciones en el mismo objeto | `{ name : /^P/ , population : {…} }` | `AND` implícito *(lo dice el slide 24)* |
| Filtro guardado en una variable | `var pop_range = {…}` y después `population : pop_range` | — *(es JavaScript)* |

> [!note] `_id: 0` es el único `0` que se puede mezclar con `1` en una proyección
> Una proyección es **de inclusión** *(campos en `1`)* **o de exclusión** *(campos en `0`)*, nunca
> las dos, con **una excepción**: `_id`, que se incluye por defecto y se puede apagar en una
> proyección de inclusión. Por eso `{ _id: 0, name : 1, population : 1 }` vale y `{ name: 1,
> state: 0 }` no. Es la primera trampa al copiar las proyecciones del deck.

> [!quote] Slide 22, textual
> **$all & $nin** *(los dos con link)*
> ```
> > db.towns.find( { famousFor : { $all : [ 'food' , 'beer' ] } }, { _id : 0, name:1, famousFor:1 } )
>
> > db.towns.find( { famousFor : { $nin : [ 'food' , 'beer' ] } }, { _id : 0, name:1, famousFor:1 } )
> ```
> *"$nin selects the documents where:*
> *- the field value is not in the specified array or*
> *- the field does not exist. **# Be careful, do not misspell the field. Remember that the fields
> are case sensitive.**"*

Los dos operadores son **sobre arreglos** *(`famousFor` de Portland es `["beer", "food",
"Portlandia"]` en el libro)*:

| Operador | Verdadero cuando … | Portland `["beer","food","Portlandia"]` | Punxsutawney `["Punxsutawney Phil"]` |
| --- | --- | :---: | :---: |
| `$all : ['food','beer']` | el arreglo contiene **todos** los valores listados | ✓ | ✗ |
| `$in : ['food','beer']` *(no está en el slide)* | contiene **alguno** | ✓ | ✗ |
| `$nin : ['food','beer']` | **no** contiene ninguno, **o el campo no existe** | ✗ | ✓ |

> [!warning] La segunda mitad de `$nin` es la que causa errores: *"or the field does not exist"*
> Consecuencia directa del *no-schema*: si se escribe `famousfor` en lugar de `famousFor`, **ningún
> documento tiene ese campo**, así que `$nin` los devuelve **a todos** y `$all`, `$in` o una
> igualdad devuelven **ninguno**, sin error de "columna inexistente". Vale también para el
> `town`/`towns` del slide 20. Los slides no muestran la salida; con los datos del libro, la primera
> consulta devuelve Portland y la segunda Punxsutawney.

## Slides 23–24 · Documentos heterogéneos, `AND` implícito y `$or`

> [!quote] Slide 23, textual
> **The records do not necessarily have the same structure**
> ```
> db.countries.insert({_id : "us" ,name : "United States",
> exports : {foods : [{ name : "bacon" , tasty : true }, { name : "burgers" }]}})
>
> db.countries.insert({_id : "ca" ,name : "Canada" ,
> exports : {foods : [{ name : "bacon" , tasty : false },{ name : "syrup" , tasty : true }]}})
>
> db.countries.insert({_id : "mx" ,name : "Mexico" ,
> exports : {foods : [{ name : "salsa" , tasty : true , condiment : true }]}})
> ```

Tres documentos, tres formas distintas dentro del mismo `exports.foods`: en `us`, `burgers` **no
tiene `tasty`**; en `ca` los dos alimentos tienen `tasty` y ninguno `condiment`; en `mx`, `salsa`
tiene el campo extra **`condiment`**. Los tres usan **`_id` puesto por el usuario** *(`"us"`,
`"ca"`, `"mx"`)*, como anticipó el slide
9. Es la colección sobre la que trabajan los slides 24, 27 y 39.

> [!quote] Slide 24, textual
> **operadores (and implícito y or)**
> ```
> > db.countries.find( { _id : "mx", name : "United States" }, { _id:1, name:1 } )
> # no retorna nada
>
> > db.countries.find( { $or : [ { _id : "mx" }, { name : "United States" } ] }, { _id:1, name:1 } )
> { "_id" : "us", "name" : "United States" }
> { "_id" : "mx", "name" : "Mexico" }
> ```

La regla, en una línea: **dos claves en el mismo objeto de filtro es `AND`; `OR` hay que pedirlo con
`$or` y un arreglo de condiciones.** Existe `$and` explícito *(hace falta para repetir la misma
clave dos veces, que un objeto JSON no permite)* y `$nor`; el deck no los muestra.

## Slides 25–26 · `update` con `$set`, y `updateOne` desde Python

> [!quote] Slide 25, textual
> **update**
> ```
> > db.towns.update( { name : "Portland" }, { $set : { "state" : "OR" } } )
> WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
>
> > db.towns.find({},{"_id":0, name:1, state:1})
> { "name" : "New York" }
> { "name" : "Punxsutawney" }
> { "name" : "Portland", "state" : "OR" }
> ```
> *(`$set` está en **rojo**.)*

El `$set` en rojo es el punto del slide, y es el error clásico de MongoDB: **sin `$set`, el segundo
argumento reemplaza el documento entero**. `db.towns.update({ name : "Portland" }, { "state" :
"OR" })` dejaría a Portland con **un solo campo** *(más `_id`)*. Con `$set` se agrega o modifica
solo `state`, y los demás documentos siguen sin tenerlo, como muestra la proyección: **el campo
existe únicamente donde se lo puso**.

| Del slide | Hoy en `mongosh` |
| --- | --- |
| `db.towns.update(filtro, cambio)` | **deprecado** → `updateOne` *(el primero que matchea)* o `updateMany`. `update()` modifica **uno solo** por defecto, igual que `updateOne`, salvo `{ multi: true }` |
| `WriteResult({ "nMatched", "nUpserted", "nModified" })` | `{ acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }` — otra salida del **shell legado** |

> [!quote] Slide 26, textual
> **updateOne** *(link)* **(desde python)**
> ```python
> import pymongo
> from pymongo import MongoClient
>
> client = MongoClient('mongodb://<usuario>:<password>@<host>:<port>/'elecciones-2019')
> db = client['elecciones-2019']
> news_collection = db['news']
>
> aa_key = '***************************************'
> cursor = db.news.find({"engagement": None})
> for entry in cursor:
> id  = entry['_id']
> link = entry['link']
> engagement = sharedcount_fb_engagement( link )
> myquery = { "_id": id }
> newvalues = { "$set": { "engagement": engagement } }
> news_collection.update_one(myquery, newvalues)
> print('{0} {1}'.format(link, engagement))
> ```

Script real del docente: recorre las noticias de `elecciones-2019` que **todavía no tienen
`engagement`** *(`None` en Python = `null` en el filtro, que también matchea **campo ausente**)*,
consulta un servicio externo *(`sharedcount_fb_engagement` no está definida en el slide; `aa_key`
es su clave, enmascarada)* y guarda el resultado documento por documento con **`update_one` +
`$set`**: el patrón *"enriquecer una colección con datos de una API"*.

> [!bug] La cadena de conexión tiene las comillas rotas
> `'mongodb://<usuario>:<password>@<host>:<port>/'elecciones-2019'` cierra el string antes del nombre
> de la base y lo vuelve a abrir después: **no es Python válido** tal como está impreso. Lo
> correcto es `'mongodb://<usuario>:<password>@<host>:<port>/elecciones-2019'`. Transcripto `[sic]`.
> Además, la variable `id` **pisa la función incorporada `id` de Python**, y `db.news` y
> `news_collection` son la misma colección con dos nombres.

`pymongo` usa `snake_case` *(`update_one`, `insert_one`, `find_one`)*; filtros y operadores *(`$set`)*
son idénticos porque son datos, no código. Y `find()` devuelve un **cursor** que en Python se itera
como una lista, como señala la [[Práctica 2026-09-15]].

## Slide 27 · `delete` con `$elemMatch`

> [!quote] Textual
> **delete**
> ```
> > db.countries.count()
> 3
> > var badBacon = { 'exports.foods' : { $elemMatch : { name : 'bacon', tasty : false } } }
>
> > db.countries.find(badBacon)
> { "_id" : "ca", "name" : "Canada", "exports" : { "foods" : [ { "name" : "bacon", "tasty" : false }, { "name" : "syrup", "tasty" : true } ] } }
> > db.countries.deleteOne(badBacon)
> > db.countries.count()
> 2
> ```

Tres ideas en un slide:

1. **Notación de punto** para entrar a un subdocumento: `'exports.foods'` *(entre comillas porque
  lleva un punto)*.
2. **`$elemMatch`**: pide que **un mismo elemento** del arreglo cumpla **todas** las condiciones.
  Sin él, `{ 'exports.foods.name': 'bacon', 'exports.foods.tasty': false }` se evalúa **elemento
  por elemento por separado**: un país con `{ bacon, tasty: true }` y `{ syrup, tasty: false }`
  **matchearía**. Con los tres países del slide 23 las dos formas dan lo mismo *(solo Canadá)*, por
  eso el slide no muestra la diferencia; el libro sí, en § *elemMatch* *(impresas 101–103)*.
3. **Buena práctica**: `find(badBacon)` **antes** de `deleteOne(badBacon)`, con el mismo filtro
  guardado en una variable.

El libro usa `remove(badBacon)`; el deck lo actualizó a **`deleteOne`** *(y existe `deleteMany`)*,
pero mantuvo `count()`, que el slide 14 acababa de reemplazar.

## Slides 28–29 · Índices

> [!quote] Slide 28, textual
> **indexing**
> *"default _id index"*
> *"MongoDB creates a unique index on the _id field during the creation of a collection. The _id
> index prevents clients from inserting two documents with the same value for the _id field. You
> cannot drop this index on the _id field."*
> *"By default, all collections have an index on the _id field."*
> ```javascript
> // Show all indexes of the current database
> db.getCollectionNames().forEach(function(collection) {
> print("Indexes for the " + collection + " collection:");
> printjson(db[collection].getIndexes());
> });
> ```

El texto es de la documentación oficial; el script, del libro *(impresa 111)*. La **unicidad de
`_id`** que el slide 9 daba por hecha **es un índice**, creado con la colección y que no se puede
borrar. El script muestra que el shell es JavaScript completo: `forEach`, concatenación,
`db[collection]` como acceso dinámico.

> [!quote] Slide 29, textual
> **single field indexes**
> ```
> > db.phones.count()
> 100,000 rows
>
> > db.phones.find({display: "+1 800-5650001"}).explain()  → 61 ms
> > db.phones.ensureIndex( { display : 1 }, { unique : true } )
> > db.phones.find({display: "+1 800-5650001"}).explain()  → 0 ms
>
> // index on nested values
> > db.phones.ensureIndex({ "components.area": 1 }, { background : 1 })
> ```
> *"+info: https://docs.mongodb.com/manual/core/index-single/"*

Es el experimento del libro *(§ *Indexing: When Fast Isn't Fast Enough*, impresas 110–114)*
comprimido a cinco líneas: 100.000 documentos, una búsqueda por igualdad **sin índice** hace un
*collection scan* completo *(61 ms)*, se crea un índice **B-tree** sobre `display`, y la misma
búsqueda pasa a **0 ms** porque camina el árbol y lee un solo documento. El libro reporta 52 ms con
`explain("executionStats")` *(`executionTimeMillis` 52 → 0; objetos escaneados de 109.999 a 1)*.

| Del slide | Qué es | Hoy |
| --- | --- | --- |
| `ensureIndex(claves, opciones)` | crea el índice | **deprecado desde 3.0** → `createIndex` *(mismos argumentos)*. `mongosh` lo acepta con aviso. **El TP9 también dice `ensureIndex`** |
| `{ display : 1 }` | índice ascendente sobre un campo; `-1` sería descendente | igual |
| `{ unique : true }` | rechaza duplicados de `display` | igual |
| `"components.area"` | índice sobre un **campo anidado**, con notación de punto | igual |
| `{ background : 1 }` | construir sin bloquear la colección | **ignorado desde 4.2**: todos los índices se construyen con el mecanismo nuevo, que no bloquea |
| `.explain()` | muestra el plan | igual; con `"executionStats"` da los tiempos |

> [!tip] Lo que este slide comparte con la [[Clase 08 - Explicando el plan]]
> Es el mismo experimento del [[1.08.02 - Índices|concepto de índices]] hecho en MySQL con `EXPLAIN`:
> **medir antes, indexar, medir después**. Cambia la sintaxis y no la idea, ni el costo: el libro
> avisa, en la impresa 114, que crear un índice sobre una colección grande es lento y que *"cuestan
> más"* en Mongo que en Postgres por la falta de esquema; el deck omite ese párrafo. Tampoco trae
> índices **compuestos** *(`{a:1, b:1}`, que el TP9 sí pide)*, **multikey** *(sobre arreglos)*, de
> **texto**, **geoespaciales** ni **TTL**.

## Slide 30 · Las herramientas de línea de comando

Es una **imagen sin título**: la tabla del recuadro *"Mongo's Many Useful CLI Tools"* de *Seven
Databases* *(impresa **114**)*, reproducida entera. Transcripción:

| Command | Description *(textual del libro)* |
| --- | --- |
| `mongodump` | Exports data from Mongo into `.bson` files. That can mean entire collections or databases, filtered results based on a supplied query, and more. |
| `mongofiles` | Manipulates large **GridFS** data files (GridFS is a specification for BSON files exceeding 16 MB). |
| `mongooplog` | Polls operation logs from MongoDB replication operations. |
| `mongorestore` | Restores MongoDB databases and collections from backups created using `mongodump`. |
| `mongostat` | Displays basic MongoDB server stats. |
| `mongoexport` | Exports data from Mongo into CSV (comma-separated value) and JSON files. As with `mongodump`, that can mean entire databases and collections or just some data chosen on the basis of query parameters. |
| `mongoimport` | Imports data into Mongo from JSON, CSV, or TSV (term-separated value) files. We'll use this tool on Day 3. |
| `mongoperf` | Performs user-defined performance tests against a MongoDB server. |
| `mongos` | Short for "MongoDB shard," this tool provides a service for properly routing data into a sharded MongoDB cluster (which we will not cover in this chapter). |
| `mongotop` | Displays usage stats for each collection stored in a Mongo database. |
| `bsondump` | Converts BSON files into other formats, such as JSON. |

> [!note] Tres cosas que la tabla deja dichas de paso
> - **GridFS y el límite de 16 MB** —la única mención a GridFS en el deck—: un documento BSON no
> puede superar 16 MB; los archivos más grandes se guardan **partidos en chunks** en `fs.files` y
> `fs.chunks`, y `mongofiles` es el cliente. Corbellini § 6 lo cubre.
> - **`mongos`** reaparece como cabecera del diagrama del slide 37 y es el *query router* del
> sharding del slide 44.
> - `mongodump` / `mongorestore` *(binario, BSON)* vs. `mongoexport` / `mongoimport` *(texto)*: el
> par para backup y el par para intercambio. El slide 14 usó el segundo.
>
> Desde 4.4 estas herramientas se distribuyen **aparte del servidor** como *MongoDB Database
> Tools*, igual que `mongosh`; `mongooplog` y `mongoperf` **ya no forman parte del paquete actual**
> *(a verificar contra la lista de Database Tools de la versión que instale el TP)*.

## Slides 31–34 · Aggregated Queries: el pipeline

**Slide 31** es el **diagrama de la documentación oficial** del *aggregation pipeline*, con el
título *"Aggregated Queries"* agregado:

```javascript
db.orders.aggregate( [
  { $match: { status: "A" } },  // $match stage
  { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }  // $group stage
] )
```

| Colección `orders` *(entrada)* | después de `$match` | `Results` *(después de `$group`)* |
| --- | --- | --- |
| `{ cust_id: "A123", amount: 500, status: "A" }` | ✓ | `{ _id: "A123", total: 750 }` |
| `{ cust_id: "A123", amount: 250, status: "A" }` | ✓ | ↑ |
| `{ cust_id: "B212", amount: 200, status: "A" }` | ✓ | `{ _id: "B212", total: 200 }` |
| `{ cust_id: "A123", amount: 300, status: "D" }` | ✗ *(status D)* | — |

> [!important] La gramática del pipeline, que el diagrama muestra y ningún slide enuncia
> - `aggregate` recibe **un arreglo de etapas**; cada etapa es un objeto con **una sola clave**
> `$<etapa>`.
> - Los documentos **fluyen** de una etapa a la siguiente, en orden. `$match` primero **reduce** lo
> que `$group` tiene que procesar *(y puede usar índices; después de un `$group` ya no)*.
> - En `$group`, **`_id` es la clave de agrupación** *(obligatoria; `null` para agrupar todo)* y las
> demás claves son **acumuladores** *(`$sum`, `$avg`, `$max`, `$min`, `$push`, `$first`, …)*.
> - **`"$campo"` con `$` adelante** es una *referencia a un campo del documento*; `campo` sin `$` es
> un nombre nuevo del documento de salida. `{ $sum: "$amount" }` suma el campo; `{ $sum: 1 }`
> *(slide 33)* cuenta documentos.

**Slide 32** es un slide de bibliografía disfrazado: la tapa del libro gratuito *"Practical MongoDB
Aggregations — By Paul Done"* y el link `https://www.practical-mongodb-aggregations.com/`. Es la
única fuente en formato libro que el deck **sí** nombra *(la otra fuente nombrada es el paper de
Dean & Ghemawat del slide 35)*, y no está en las fichas del vault → [[_index-bibliografia]].

> [!quote] Slide 33, textual
> **Aggregated Queries**
> ```sql
> SELECT tipo, Count(*)
> FROM hospitales
> GROUP BY tipo
> ORDER BY Count(*) DESC
> ```
> ```javascript
> db.hospitales.aggregate([
> { $group : {_id: "$properties.TIPO", count:{$sum:1} } },
> { $sort : { count : -1 } }
> ])
> ```
> ```
> { "_id" : "Hospital especializado", "count" : 20 }
> { "_id" : "Hospital de agudos", "count" : 13 }
> { "_id" : "Hospital de niños", "count" : 3 }
> ```

Es la **tabla de traducción SQL → pipeline** más útil del deck, en un solo ejemplo:

| SQL | Etapa del pipeline | Nota |
| --- | --- | --- |
| `WHERE` | `$match` | *(no hay en este ejemplo; slide 34)* |
| `GROUP BY tipo` | `$group : { _id: "$properties.TIPO" }` | la clave de grupo va en `_id` |
| `Count(*)` | `count : { $sum : 1 }` | sumar `1` por documento |
| `ORDER BY … DESC` | `$sort : { count : -1 }` | `-1` descendente |
| `SELECT` *(lista de columnas)* | `$project` | *(slide 34)* |
| `HAVING` | un segundo `$match` **después** del `$group` | *(no está en el deck)* |
| `LIMIT` | `$limit` | *(solo en la solución complementaria)* |
| `JOIN` | `$lookup` | *(no está en el deck; sí en la solución complementaria)* |

`"$properties.TIPO"` delata el dataset: un **GeoJSON** *(cada hospital es un `Feature` con
`properties` y `geometry`)*, el de hospitales de la Ciudad de Buenos Aires. Que el campo esté anidado
no cambia nada: la notación de punto vale dentro de `$group`.

> [!quote] Slide 34, textual
> **Aggregated Queries**
> ```javascript
> db.phones.count({'components.number': { $gt : 5599999 } } )
>
> db.phones.distinct('components.number',{'components.number': { $lt : 5550005 } } )
>
> db.cities.aggregate([ { $match: { 'timezone': { $eq: 'Europe/London' } } },
> { $group: { _id: 'averagePopulation', avgPop: { $avg: '$population' } } }
> ])
>
> db.cities.aggregate([
> { $match: { 'timezone': { $eq: 'Europe/London' } } },
> { $sort: { population: -1 } },
> { $project: { _id: 0, name: 1, population: 1 } }
> ])
> ```

Cuatro consultas del libro *(§ *Aggregated Queries*, impresas 115–117)*:

| Consulta | Qué muestra | SQL |
| --- | --- | --- |
| `count(filtro)` | contar **con filtro** — hoy `countDocuments(filtro)` | `SELECT COUNT(*) … WHERE` |
| `distinct(campo, filtro)` | valores únicos de un campo, opcionalmente filtrados; devuelve un **arreglo**, no documentos | `SELECT DISTINCT … WHERE` |
| `$match` → `$group` con `_id: 'averagePopulation'` | agrupar **todo** bajo una clave constante *(equivale a `_id: null` con etiqueta)*; `$avg` | `SELECT AVG(population) … WHERE timezone = …` |
| `$match` → `$sort` → `$project` | pipeline **sin agrupación**: filtrar, ordenar y proyectar es también trabajo del pipeline | `SELECT name, population … WHERE … ORDER BY population DESC` |

La tercera **colapsa** N documentos en uno; la cuarta **transforma** N documentos en N *(en SQL, una
consulta sin `GROUP BY`; `find(filtro, proyección).sort({…})` da lo mismo y es más corto)*. El
pipeline vale la pena al **encadenar** y cuando hace falta `$lookup` o `$unwind`, que `find` no
tiene. `{ $eq: 'Europe/London' }` es la forma explícita de `'timezone': 'Europe/London'`.

## Slides 35–37 · MapReduce

> [!quote] Slide 35, textual
> **MapReduce**
> *"In MongoDB, the map step involves creating a mapper function that calls an `emit()` function. The
> benefit of this approach is you can emit more than once per document. The `reduce()` function
> accepts a single key and a list of values that were emitted to that key. Finally, Mongo provides an
> optional third step called `finalize()`, which is executed only once per mapped value after the
> reducers are run. This allows you to perform any final calculations or cleanup you may need."*
> *"[2004] MapReduce: Simplified Data Processing on Large Clusters"* *(link)*
> `https://en.wikipedia.org/wiki/MapReduce`

El párrafo es la impresa **120** del libro, palabra por palabra. Las tres funciones:

| Función | Firma | Qué hace |
| --- | --- | --- |
| **map** | `function() { emit(clave, valor) }` — `this` es el documento | por cada documento, emite **cero, uno o varios** pares clave/valor |
| **reduce** | `function(clave, valores) { return valor }` | recibe **todos los valores emitidos para una clave** y los reduce a uno. Debe ser **asociativa, conmutativa e idempotente**, porque puede llamarse varias veces sobre resultados parciales *(slide 37)* y **no se llama** si una clave tiene un solo valor |
| **finalize** *(opcional)* | `function(clave, valorReducido) { return valor }` | una vez por clave, después de los reduce; para promedios, redondeos, limpieza |

El link *[2004]* es el paper de Dean y Ghemawat *(Google)* que dio nombre al modelo; MongoDB lo
implementa con **funciones JavaScript ejecutadas en el servidor**.

> [!warning] (crítico) `mapReduce` está **deprecado desde MongoDB 5.0**, y el deck no lo dice
> Desde 5.0 la documentación oficial marca `mapReduce` como *deprecated* y remite al **aggregation
> pipeline**: `$group` con acumuladores reemplaza al par `map`/`reduce`, `$project` o `$addFields`
> reemplazan a `finalize`, `$out` y `$merge` reemplazan a `out`, y para lo que no cabe en operadores
> existe `$accumulator` y `$function` *(JavaScript dentro del pipeline, desde 4.4)*. El comando sigue
> existiendo en 6.0 y en 8.0 *(a verificar en la versión que instale el TP)*, pero es **código que no
> hay que escribir nuevo**. El ejemplo del handout `Ejemplo_MapReduce_MongoDB.pdf` **se traduce a
> `$group` en cuatro líneas** → § *Material complementario*, (c).

> [!quote] Slide 36, textual
> **MapReduce**
> *"ejemplo de la página 120"*
> 1. `https://media.pragprog.com/titles/pwrdata/code/mongo/distinctDigits.js`
> 2. `https://media.pragprog.com/titles/pwrdata/code/mongo/map1.js`
> 3. `https://media.pragprog.com/titles/pwrdata/code/mongo/reduce1.js`
> ```javascript
> results = db.runCommand({
> mapReduce: 'phones',
> map: map,
> reduce: reduce,
> out: 'phones.report' })
> ```
> ```
> {"result" : "phones.report",
> "timeMillis" : 2464,
> "counts" : {
> "input" : 100000,
> "emit" : 100000,
> "reduce" : 25719,
> "output" : 3479
> },  "ok" : 1 }
> ```

El slide **no muestra `map` ni `reduce`**: los delega a los tres archivos del libro *(impresas
120–121)*: `distinctDigits(phone)` devuelve el arreglo de dígitos distintos de un número; `map` emite
`{ digits, country }` como clave y `{ count: 1 }` como valor; `reduce` suma los `count`. La salida
es el dato pedagógico: **100.000 documentos de entrada, 100.000 `emit`** *(uno por documento)*,
**25.719 llamadas a `reduce`** y **3.479 claves de salida**: `reduce` **se llama por lotes y sobre
resultados parciales**, la razón de que deba ser asociativa. Y `out: 'phones.report'` **materializa
el resultado en una colección** *(el libro la llama *materialized view*)* que después se consulta con
`find`.

**Slide 37** es el **diagrama del libro** *(impresa 122)*: `db.runCommand({'mapReduce'...})` entra a
**`mongos`**, que tiene su propio `reduce`; abajo, **`mongod 1`** y **`mongod 2`**, cada uno con tres
`map` que alimentan un `reduce` local, cuyos resultados suben al `reduce` de `mongos`. Es la primera
vez que el deck dibuja un **cluster shardeado**: cada shard reduce lo suyo, el router combina. *(En
el pipeline, `$group` se ejecuta por shard y se fusiona en `mongos` sin que el usuario escriba
nada.)*

## Slide 38 · Funciones definidas por el usuario en `system.js`

> [!quote] Textual
> **user-defined functions in system.js**
> *"any JavaScript function can be stored in a special collection named system.js"*
> ```javascript
> > db.system.js.save({
> _id: 'getLast',
> value: function(collection) {
> return collection.find({}).sort({'_id':-1}).limit(1)[0]; }
> })
>
> > use book
> > db.loadServerScripts()
> > getLast(db.phones).display
>
> +8 800-5649989
> ```

Del libro, § *Server-Side Commands* *(impresa 119)*. `getLast` devuelve el **último documento
insertado** ordenando por `_id` descendente *(funciona porque el `ObjectId` empieza con el
timestamp)*; se guarda como documento en `system.js`, y `loadServerScripts()` la trae al shell como
función global.

> [!warning] Es lo más parecido a un *stored procedure* que tiene MongoDB, y **está en retirada**
> Es el pariente de la [[1.10.02 - Stored procedures y funciones|Clase 10]] del lado NoSQL, con
> diferencias grandes: la función **no corre en el servidor** cuando se la invoca desde el shell
> *(`loadServerScripts` la copia al cliente)*; solo corre en el servidor si la usa un `mapReduce` o
> un `$where`. La documentación desaconseja guardar lógica de aplicación en la base, `db.eval`
> **se eliminó en 4.2**, y `save` está **deprecado desde 4.2** *(hoy sería `db.system.js.insertOne`
> o `replaceOne`)*. **A verificar** si `db.loadServerScripts()` sigue disponible en el `mongosh` del
> TP.

## Slide 39 · MongoDB desde Python

> [!quote] Textual
> **accessing mongoDB from python**
> ```
> $ pip install pymongo
> ```
> ```python
> import pymongo
> from pymongo import MongoClient
> client = MongoClient()  # client = MongoClient('localhost', 27017)
> # client = MongoClient('mongodb://localhost:27017/')
>
> db = client['book']
> collection = db.countries
> for c in collection.find({},{'name':1}):
> print c['name']
>
> United States
> Canada
> Mexico
> ```

Las tres formas de `MongoClient()` son equivalentes *(sin argumentos usa `localhost:27017`)*; la
tercera es la **URI de conexión**, la que el slide 26 usa con usuario y contraseña. `db['book']` y
`db.countries` son las dos sintaxis de acceso, y el `find` con proyección devuelve los tres países
del slide 23 *(el `_id` viaja aunque no se lo imprima)*.

> [!bug] `print c['name']` es **Python 2**; el slide 26 usaba `print(…)` de **Python 3**
> El slide 39 no corre en ningún Python actual *(`print` es función desde 3.0; Python 2 no recibe
> soporte desde 2020)*. Lo correcto es `print(c['name'])`. Transcripto `[sic]`.

## Slides 40–43 · Replica sets

**Slide 40** — título *"Replica sets"* y una **tira cómica** de tres viñetas firmada *"©2012 Eric
Redmond · crudcomic.com"* *(Redmond es coautor del libro; impresa 124)*: en la convención de MongoDB
entregan dos tazas, una se rompe, *"INCASE ONE BREAKS [sic]. Ever hear of **redundancy**?"*. Es
toda la motivación que el deck da: **replicar es tener más de una copia por si una se rompe.**

> [!quote] Slide 41, textual
> **Replica Sets (rs)**
> *"Mongo's default port is 27017, so we'll start up each server on other ports."*
> ```
> $ mkdir ./mongo1 ./mongo2 ./mongo3
> $ mongod --replSet book --dbpath ./mongo1 --port 27011
> $ mongod --replSet book --dbpath ./mongo2 --port 27012
> $ mongod --replSet book --dbpath ./mongo3 --port 27013
>
> $ mongo localhost:27011
> > rs.initiate({ _id: 'book', members: [
> {_id: 1, host: 'localhost:27011'},
> {_id: 2, host: 'localhost:27012'},
> {_id: 3, host: 'localhost:27013'} ] })
> > rs.status().ok
> ```
> *"pag. 124 (example)"*

Del libro, impresas 124–125. Paso a paso:

| Paso | Comando | Qué hace |
| :---: | --- | --- |
| 1 | `mkdir ./mongo1 ./mongo2 ./mongo3` | un **directorio de datos por nodo**: tres `mongod` no pueden compartir `--dbpath` |
| 2 | `mongod --replSet book --dbpath … --port 2701N` ×3 | tres servidores en la misma máquina, en puertos distintos, todos declarando pertenecer al set **`book`**. Cada uno es un proceso aparte *(el libro los abre en tres terminales)* |
| 3 | `mongo localhost:27011` | conectarse a **cualquiera** de los tres |
| 4 | `rs.initiate({ _id: 'book', members: [...] })` | **configurar** el set: nombre *(debe coincidir con `--replSet`)* y lista de miembros |
| 5 | `rs.status().ok` | `1` si el set está funcionando; `rs.status()` completo muestra quién es **PRIMARY** y quién **SECONDARY** |

> [!bug] `$ mongo localhost:27011` — tercera aparición del shell legado
> El slide 10 enseñó `mongosh`; este slide, copiado del libro de 2018, conecta con `mongo`. En una
> instalación 6.0+ ese binario **no existe**; el comando es `mongosh localhost:27011` o `mongosh
> --port 27011`.

> [!important] Por qué **tres** y no dos — lo que el deck omite y el libro explica en la página siguiente
> La razón está en *Seven Databases* impresas 126–127, § *The Problem with Even Nodes* y recuadro
> *Voting and Arbiters*: la elección de un nuevo primario *(slide 43)* necesita **mayoría estricta**
> de votos. Con **5** nodos, una partición 3–2 deja al fragmento de tres con mayoría; con **4**, una
> partición 2–2 deja **los dos lados sin mayoría** y el sistema entero cae. *(Razonamiento propio a
> partir de esa regla: con 3 nodos, si uno cae quedan 2 de 3 —mayoría—; con 2, si uno cae queda 1 de
> 2, que no es mayoría, y el sobreviviente se degrada a secundario: el set queda sin primario y no
> acepta escrituras. Ojo: el propio libro, en la impresa 126, apaga el primario con dos `mongod`
> corriendo y dice que "the last remaining node is implicitly the master", lo que contradice su
> propia regla; ver [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad
> horizontal]] § Dudas abiertas.)* Por eso se recomienda **número impar** o un **árbitro**
> *(`arbiterOnly: true`: vota pero no guarda datos)*. Y el libro cierra con la frase que ubica a
> MongoDB en el CAP de la [[Clase 12 - Introduccion a NoSQL]]: *"Because it's a CP system, Mongo
> always knows the most recent value"*: un solo primario, nunca *multi-master*.

**Slide 42** — *"Viewing the replica set from Robo3T"*. Captura de **Robo 3T 1.2** con la conexión
**`ReplicaSet (3)`** → *"Replica Set (3 nodes)"*: **`localhost:27011 [Secondary]`**,
**`localhost:27012 [Primary]`**, **`localhost:27013 [Secondary]`**. La consulta
`db.getCollection('echo').find({})` sobre `test` devuelve tres documentos, el primero con **`say:
"HELLO!"`**: el `db.echo.insert({ say : 'HELLO!' })` del libro *(impresa 125)*, insertado en el
primario y visible desde cualquier nodo *(el `ObjectId` da 08/10/2018, la fecha de la captura)*.
Dos observaciones: **el primario no es el primer nodo** *(es 27012: la elección no respeta el orden
de la lista)*, y **hay una sola copia lógica de los datos** aunque haya tres procesos, a diferencia
del sharding del slide 44.

**Slide 43** — *"Replica Set Elections"*. Diagrama de la documentación oficial: un **Primary tachado
con una cruz roja**; *"Election for New Primary"*: dos **Secondary** intercambiando **Heartbeat**;
*"New Primary Elected"*: un **Primary** que envía **Replication** a un **Secondary**, con el
**Heartbeat** de ida y vuelta entre ambos.

> [!tip] Los tres mecanismos del diagrama, nombrados
> - **Heartbeat**: cada nodo hace *ping* a los demás cada pocos segundos; si el primario deja de
> responder *(por defecto, 10 s)*, los secundarios lo dan por caído.
> - **Election**: los secundarios votan; gana el que tenga los datos más recientes y consiga
> **mayoría** *(de ahí la regla del número impar)*. Desde 3.2 el protocolo es una variante de
> **Raft**. La elección tarda segundos, y en ese lapso **no hay escrituras**.
> - **Replication**: el nuevo primario recibe todas las escrituras y los secundarios las copian
> leyendo su **oplog** *(la colección `local.oplog.rs`; `mongooplog` del slide 30 la consultaba)*.
> Es replicación **asíncrona**: un secundario puede estar atrasado.
>
> Lo que **no** dice el deck: las **lecturas** van por defecto al primario *(`readPreference`
> permite mandarlas a secundarios, aceptando leer datos viejos)* y el **write concern**
> *(`w: "majority"`)* espera a que la mayoría confirme antes de responder. El handout
> `Diferencia_Sharding_Replication` toca lo primero de pasada → § *Material complementario*, (b).

## Slide 44 · Sharding

> [!quote] Textual
> **Sharding**
> *"One of the core goals of Mongo is to provide safe and quick handling of very large datasets. The
> clearest method of achieving this is through horizontal sharding by value ranges - or just sharding
> for brevity."*
> *"mongoDB: allows sharding from version 1.6"*
> `https://docs.mongodb.com/manual/sharding/`
> - *"Seguir el ejemplo, de la pag. 127 o mirar este video "Sharding a MongoDB Collection""* *(link)*
> - *"De donde viene el termino SHARD → https://en.wikipedia.org/wiki/Shard_(database_architecture)"*
> **[sic: "De donde", "termino" sin tilde]**

**Un solo slide**, sin comando ni diagrama, para el tema que en el libro ocupa cuatro páginas
*(§ *Sharding*, impresas 127–130)*; el deck lo delega: *"seguir el ejemplo"* o *"mirar este video"*.
Lo mínimo para que el slide se sostenga solo:

| Pieza | Qué es | Dónde asoma en el deck |
| --- | --- | --- |
| **Shard** | un servidor *(en producción, **un replica set**)* que guarda **una parte** de los datos | el diagrama del slide 37 tiene dos: `mongod 1` y `mongod 2` |
| **Shard key** | el campo por cuyo valor se reparte: *"by value ranges"* *(o por hash)* | — |
| **`mongos`** | el *query router*: el cliente se conecta a él, y él sabe en qué shard está cada rango | tabla del slide 30; cabecera del slide 37 |
| **Config servers** | guardan el mapa rango → shard | recuadro *mongos vs. mongoconfig*, impresa 129 |
| `sh.help()` | los helpers de shell *(`sh.addShard`, `sh.enableSharding`, `sh.shardCollection`)* | listado en el `help` del slide 11 |

*"from version 1.6"* es agosto de 2010: la replicación es más vieja que el sharding en la historia
del producto. **La etimología:** *shard* es "esquirla, fragmento"; el artículo de Wikipedia lo hace
remontar a un juego en línea de 1997.

> [!important] Replicación y sharding resuelven **problemas distintos**, y el deck los pone juntos sin contrastarlos
> Replica set = **los mismos** datos en varios nodos → **disponibilidad**. Sharding = **distintos**
> datos en varios nodos → **escala**. Se combinan: cada shard es un replica set. El handout
> `Diferencia_Sharding_Replication_MongoDB.pdf` es exactamente esa tabla → § *Material
> complementario*, (b). El diagrama del slide 37 ya los había mezclado: `mongod 1` y `mongod 2`
> son shards, no réplicas.

## Slide 45 · Cierre

> [!quote] Textual
> **more info**
> *"Documentación sitio oficial MongoDB - https://www.mongodb.com/docs/manual/reference/"*
> *(logo de MongoDB)*

Con los links del interior, el deck trae cuatro links a la documentación oficial *(slides 9, 29,
44 y 45)*, uno a `practical-mongodb-aggregations.com` *(32)*, tres citas de página del libro
*(36, 41, 44)* y los tres `.js` del slide
36, **sin nombrar nunca al libro**. El dominio `docs.mongodb.com` hoy redirige a
`www.mongodb.com/docs/`, que es el del slide 45.

---

## Lo que el deck no trae, ordenado por lo que cuesta no tenerlo

| Feature ausente | Desde | Por qué importa aquí |
| --- | --- | --- |
| **`$lookup`** *(join en el pipeline)* | 3.2 | la solución oficial de la consigna complementaria lo usa **seis veces** en los cuatro pipelines que escribe *(la pregunta 4 reutiliza el de la 1)*; es la forma de seguir el `$ref` del slide 6 |
| **`$unwind`** *(desarmar un arreglo en N documentos)* | 2.2 | ídem: aparece en **los cuatro pipelines escritos** de la solución; sin él no se puede agrupar por elementos de `items` |
| **Transacciones multi-documento** | 4.0 *(replica set)*, 4.2 *(sharded)* | es la contraparte NoSQL de la [[Clase 11 - Seguridad-Transacciones]] del lunes anterior; el deck no menciona ACID ni una vez |
| **Índices compuestos, multikey, texto, TTL, geoespaciales** | — | el TP9 pide `ensureIndex({name:1, weight:1})`, que es compuesto |
| **Validación de esquema** *(`$jsonSchema`)* | 3.6 | es la respuesta a "*no-schema* no significa *sin reglas*" |
| **GridFS** | — | solo la fila `mongofiles` del slide 30 |
| **Consultas geoespaciales** *(`2dsphere`, `$near`)* | — | el Day 3 del libro las trae; el deck salta de sharding al cierre. Y el dataset de `hospitales` del slide 33 **es GeoJSON** |
| **Read preference / write concern / read concern** | — | sin ellos, el replica set de los slides 40–43 queda a mitad de explicación |
| **Change streams** | 3.6 | — |
| **Atlas** *(nube)* | — | una mención en el título del slide 18 y el banner de Compass en la captura del slide 17 |

---

## Cuadro de bolsillo — el deck traducido a `mongosh` 6.0+

| Slide | Como está en el deck | Como se escribe hoy | Estado del original |
| :---: | --- | --- | --- |
| 10 | `mongosh --host localhost --port 27017` | igual | ✓ |
| 11, 41 | `mongo …` / `help` del shell `mongo` | `mongosh …` | **binario eliminado en 6.0** |
| 12, 20, 23 | `db.col.insert({…})` | `insertOne({…})` / `insertMany([…])` | deprecado; corre con aviso |
| 12 | `db.createCollection("usuarios")` | innecesario salvo con opciones | ✓ |
| 13 | `show tables` | `show collections` | alias; sigue funcionando |
| 14 | `--type tsv < archivo` | igual, o `--file archivo` | ✓ *(Database Tools aparte)* |
| 14, 27, 29, 34 | `count()` / `count(filtro)` | `countDocuments(filtro)` / `estimatedDocumentCount()` | deprecado |
| 8 | `_id.toString()` → `ObjectId("…")` | `toString()` devuelve el hex; `toHexString()` explícito | **cambió** |
| 25 | `update(f, {$set})` → `WriteResult` | `updateOne(f, {$set})` → `{ acknowledged, matchedCount, modifiedCount }` | deprecado |
| 27 | `deleteOne(f)` | igual | ✓ |
| 29 | `ensureIndex(k, o)` | `createIndex(k, o)` | deprecado desde 3.0; alias con aviso |
| 29 | `{ background : 1 }` | *(omitir)* | ignorado desde 4.2 |
| 33, 34 | `aggregate([...])`, `distinct` | igual | ✓ |
| 36 | `db.runCommand({ mapReduce })` | `aggregate([{ $group }, { $out }])` | **deprecado desde 5.0** |
| 38 | `db.system.js.save({…})` + `loadServerScripts()` | `db.system.js.insertOne` + *(verificar)* | `save` deprecado 4.2; `db.eval` eliminado 4.2 |
| 39 | `print c['name']` | `print(c['name'])` | Python 2 |
| 41 | `rs.initiate({ _id, members })`, `rs.status()` | igual | ✓ |

---

## Material complementario del 14/09 (sin número de clase)

> [!info] Cuatro PDF archivados junto al deck, **sin `BD2_Clase NN` en el nombre**
> Están en `raw/Unidad-02/Teorica/`, en la misma tanda que los decks 12–14. **No son clases**: no
> llevan número de la cátedra, no tienen portada ni fecha, y tres de los cuatro fueron generados con
> **PyFPDF 1.7.2** en mayo de 2025 *(la solución el 12/05/2025, los otros dos el 18/05/2025)*; la
> consigna sola viene de Word 2010, también del 12/05/2025. Son **handouts** de un cuatrimestre
> anterior que acompañan a la teórica de MongoDB. Los cuatro son texto puro; sus textos extraídos se
> transcriben completos. La [[Práctica 2026-09-15]] dice si alguno se usó en el TP9.

### (a) `Consigna MONGO DB.pdf` + `Consigna MONGO DB (solucion).pdf` — agregaciones en un *ecommerce*

> [!quote] Consigna, textual *(2 páginas)*
> *"Imagine que tiene una base de datos llamada ecommerce, con las siguientes colecciones: clientes,
> productos y ordenes. Usando MongoDB (Compass), resolver las siguientes preguntas:*
> 1. *¿Cuál es el total de dinero gastado por cada cliente? (Mostrar nombre, email, total gastado y
> ordenarlo de mayor a menor)*
> 2. *¿Cuál es el producto más vendido y cuántas unidades se vendieron?*
> 3. *¿Cuánto se vendió por categoría de producto? (Sumar las cantidades vendidas y el ingreso total
> por categoría)*
> 4. *Listar el top 5 de clientes que más gastaron, indicando nombre, país y monto total.*
> 5. *(Opcional avanzado): Para cada cliente, listar sus órdenes incluyendo el nombre de los
> productos comprados. (Requiere $lookup entre ordenes → productos)"*

**Los datos** *(textuales; las tres colecciones)*:

```javascript
db.clientes.insertMany([
  { _id: ObjectId("000000000000000000000001"), nombre: "Juan Pérez",  email: "juan.perez@email.com",  pais: "Argentina" },
  { _id: ObjectId("000000000000000000000002"), nombre: "María Gómez", email: "maria.gomez@email.com", pais: "México" },
  { _id: ObjectId("000000000000000000000003"), nombre: "Carlos Díaz", email: "carlos.diaz@email.com", pais: "Chile" }
]);

db.productos.insertMany([
  { _id: ObjectId("100000000000000000000001"), nombre: "Auriculares Bluetooth", categoria: "Electrónica", precio: 4500 },
  { _id: ObjectId("100000000000000000000002"), nombre: "Libro MongoDB",  categoria: "Libros",  precio: 3000 },
  { _id: ObjectId("100000000000000000000003"), nombre: "Mouse Gamer",  categoria: "Electrónica", precio: 5200 }
]);

db.ordenes.insertMany([
  { _id: ObjectId("200000000000000000000001"), cliente_id: ObjectId("000000000000000000000001"), fecha: ISODate("2023-10-10"),
  items: [ { producto_id: ObjectId("100000000000000000000001"), cantidad: 2 },
  { producto_id: ObjectId("100000000000000000000002"), cantidad: 1 } ] },
  { _id: ObjectId("200000000000000000000002"), cliente_id: ObjectId("000000000000000000000002"), fecha: ISODate("2023-10-11"),
  items: [ { producto_id: ObjectId("100000000000000000000002"), cantidad: 2 } ] },
  { _id: ObjectId("200000000000000000000003"), cliente_id: ObjectId("000000000000000000000003"), fecha: ISODate("2023-10-12"),
  items: [ { producto_id: ObjectId("100000000000000000000001"), cantidad: 1 },
  { producto_id: ObjectId("100000000000000000000003"), cantidad: 1 } ] }
]);
```

> [!note] El modelo es el **normalizado** de la [[Clase 13 - NoSQL-EmbebidosVSNormalizado]], con una excepción
> `ordenes` **referencia** a `clientes` *(`cliente_id`)* y a `productos` *(`items[].producto_id`)* en
> lugar de embeber nombre y precio; los **items sí están embebidos** en la orden. Los `ObjectId` son
> artificiales *(`0000…01`, `1000…01`, `2000…01`: el prefijo dice la colección)*, legales —24
> caracteres hexadecimales— y cómodos de leer. Y el precio vive **solo en `productos`**, así que
> **todo total de dinero exige un `$lookup`**: el costo de normalizar que la Clase 13 discute, hecho
> ejercicio.

**Los totales, calculados a mano** — lo que cualquier solución tiene que devolver:

| Orden | Cliente | Ítems | Cuenta | Total |
| :---: | --- | --- | --- | ---: |
| `…01` | Juan Pérez | 2 × Auriculares (4500) + 1 × Libro (3000) | 9000 + 3000 | **12 000** |
| `…02` | María Gómez | 2 × Libro (3000) | 6000 | **6 000** |
| `…03` | Carlos Díaz | 1 × Auriculares (4500) + 1 × Mouse (5200) | 4500 + 5200 | **9 700** |

| Producto | Unidades | Ingreso |
| --- | :---: | ---: |
| Auriculares Bluetooth | 2 + 1 = **3** | 13 500 |
| Libro MongoDB | 1 + 2 = **3** | 9 000 |
| Mouse Gamer | **1** | 5 200 |

| Categoría | Unidades | Ingreso |
| --- | :---: | ---: |
| Electrónica | 3 + 1 = **4** | 13 500 + 5 200 = **18 700** |
| Libros | **3** | **9 000** |

Control: 12 000 + 6 000 + 9 700 = **27 700** = 18 700 + 9 000 ✓.

> [!warning] La numeración de la solución está **corrida en uno** respecto de la consigna
> El PDF de solución *("Ejercicio de MongoDB: Agregaciones en un e-commerce")* numera sus secciones
> **1 a 6**: la **1** son los datos, así que la pregunta *N* de la consigna es la sección *N+1* de la
> solución. Abajo se cita por pregunta, con la sección de la solución entre paréntesis.

#### Pregunta 1 — total gastado por cliente *(solución § 2)*

> [!quote] Solución oficial, textual
> ```javascript
> db.ordenes.aggregate([
> { $unwind: "$items" },
> { $lookup: { from: "productos", localField: "items.producto_id", foreignField: "_id", as: "producto" } },
> { $unwind: "$producto" },
> { $group: { _id: "$cliente_id", total: { $sum: { $multiply: ["$items.cantidad", "$producto.precio"] } } } },
> { $lookup: { from: "clientes", localField: "_id", foreignField: "_id", as: "cliente" } },
> { $unwind: "$cliente" },
> { $project: { _id: 0, nombre: "$cliente.nombre", email: "$cliente.email", totalGastado: "$total" } },
> { $sort: { totalGastado: -1 } }
> ]);
> ```

Etapa por etapa, con lo que sale de cada una para los datos dados:

| Etapa | Qué hace | Documentos que salen |
| --- | --- | :---: |
| `$unwind: "$items"` | una orden con 2 ítems → 2 documentos, cada uno con `items` como **subdocumento** en vez de arreglo | 5 |
| `$lookup` productos | agrega `producto: [ {…} ]` *(siempre un **arreglo**, aunque matchee uno)* | 5 |
| `$unwind: "$producto"` | desarma ese arreglo de un elemento | 5 |
| `$group` por `cliente_id` | suma `cantidad × precio` | 3 |
| `$lookup` clientes + `$unwind` | trae nombre y email | 3 |
| `$project` + `$sort` | forma final, de mayor a menor | 3 |

**Resultado:** `{ nombre: "Juan Pérez", email: "juan.perez@email.com", totalGastado: 12000 }` ·
`{ "Carlos Díaz", …, 9700 }` · `{ "María Gómez", …, 6000 }`. **Coincide con la cuenta a mano** ✓.

> [!tip] Dos cosas que la solución hace bien y vale copiar
> - **`$unwind` después de cada `$lookup`**: `$lookup` devuelve siempre un arreglo; para usar
> `$producto.precio` como escalar hay que desarmarlo.
> - **Agrupar antes de traer el cliente**: el segundo `$lookup` se hace sobre 3 documentos en vez de
> 5. Cuanto más tarde se hace un `$lookup`, menos documentos cruza.
>
> Lo que no hace: un cliente **sin órdenes** no aparece *(el pipeline arranca de `ordenes`)*. Para
> incluirlo con total 0 habría que arrancar de `clientes` y hacer el `$lookup` al revés.

#### Pregunta 2 — producto más vendido *(solución § 3)*

> [!quote] Solución oficial, textual
> ```javascript
> db.ordenes.aggregate([
> { $unwind: "$items" },
> { $group: { _id: "$items.producto_id", totalUnidades: { $sum: "$items.cantidad" } } },
> { $lookup: { from: "productos", localField: "_id", foreignField: "_id", as: "producto" } },
> { $unwind: "$producto" },
> { $project: { _id: 0, nombreProducto: "$producto.nombre", totalUnidades: 1 } },
> { $sort: { totalUnidades: -1 } },
> { $limit: 1 }
> ]);
> ```

> [!bug] (crítico) Con los datos dados **hay empate**, y la solución oficial devuelve **uno de los dos al azar**
> Auriculares Bluetooth: **3** unidades. Libro MongoDB: **3** unidades. Mouse Gamer: 1. El pipeline
> ordena solo por `totalUnidades` y corta en 1: **MongoDB no garantiza el orden entre documentos
> empatados**, así que la respuesta puede ser cualquiera de los dos y **cambiar entre corridas**. El
> pipeline es correcto en su lógica; **el dataset no tiene un máximo único**, y una solución completa
> tendría que decirlo.
>
> Para devolver **todos** los empatados *(MongoDB ≥ 5.0)*:
>
> ```javascript
> db.ordenes.aggregate([
> { $unwind: "$items" },
> { $group: { _id: "$items.producto_id", totalUnidades: { $sum: "$items.cantidad" } } },
> { $setWindowFields: { sortBy: { totalUnidades: -1 }, output: { puesto: { $rank: {} } } } },
> { $match: { puesto: 1 } },
> { $lookup: { from: "productos", localField: "_id", foreignField: "_id", as: "producto" } },
> { $unwind: "$producto" },
> { $project: { _id: 0, nombreProducto: "$producto.nombre", totalUnidades: 1 } }
> ]);
> // → Auriculares Bluetooth 3 · Libro MongoDB 3
> ```
>
> O, más modesto, agregar un criterio de desempate al `$sort` *(`{ totalUnidades: -1,
> nombreProducto: 1 }`)* para que al menos la respuesta sea **determinística**, diciendo en la
> entrega que es un desempate arbitrario. *(Propuesta propia, no verificada contra un servidor.)*

#### Pregunta 3 — ventas por categoría *(solución § 4)*

> [!quote] Solución oficial, textual
> ```javascript
> db.ordenes.aggregate([
> { $unwind: "$items" },
> { $lookup: { from: "productos", localField: "items.producto_id", foreignField: "_id", as: "producto" } },
> { $unwind: "$producto" },
> { $group: { _id: "$producto.categoria",
> totalUnidades: { $sum: "$items.cantidad" },
> totalIngresos: { $sum: { $multiply: ["$items.cantidad", "$producto.precio"] } } } },
> { $project: { categoria: "$_id", totalUnidades: 1, totalIngresos: 1, _id: 0 } }
> ]);
> ```

**Resultado:** `{ categoria: "Electrónica", totalUnidades: 4, totalIngresos: 18700 }` y
`{ categoria: "Libros", totalUnidades: 3, totalIngresos: 9000 }`. **Coincide con la cuenta a mano**
✓. Es el pipeline más limpio de los cinco: un solo `$lookup`, dos acumuladores en el mismo `$group`
*(como `SUM(cantidad), SUM(cantidad*precio)` en SQL)* y un `$project` que **renombra `_id` a
`categoria`**. No tiene `$sort`: el orden de salida no está garantizado, y la consigna no lo pide.

#### Pregunta 4 — top 5 de clientes con nombre, país y monto *(solución § 5)*

> [!quote] Solución oficial, textual — es una línea
> *"Agregar al final del pipeline del punto 2: `{ $limit: 5 }`"*

> [!bug] (crítico) La solución **no responde lo que se pregunta**: falta el **país**
> El pipeline del punto 2 *(pregunta 1)* proyecta `nombre`, `email` y `totalGastado`. La pregunta 4
> pide *"nombre, **país** y monto total"*: con `$limit: 5` salen nombre, email y monto, **el país no
> está y el email sobra**. La corrección es mínima —cambiar el `$project`—, pero tal como está
> escrita la solución **no cumple la consigna**:
>
> ```javascript
> // … las seis primeras etapas del pipeline de la pregunta 1, y después:
> { $project: { _id: 0, nombre: "$cliente.nombre", pais: "$cliente.pais", montoTotal: "$total" } },
> { $sort: { montoTotal: -1 } },
> { $limit: 5 }
> ```
>
> Resultado: Juan Pérez / Argentina / 12 000 · Carlos Díaz / Chile / 9 700 · María Gómez / México /
> 6 000. **Hay 3 clientes**, así que el `$limit: 5` no recorta nada: el ejercicio está pensado para un
> dataset más grande que el que da.

#### Pregunta 5 — para cada cliente, sus órdenes con los nombres de productos *(solución § 6)*

> [!quote] Solución oficial, textual
> ```javascript
> db.ordenes.aggregate([
> { $lookup: { from: "clientes", localField: "cliente_id", foreignField: "_id", as: "cliente" } },
> { $unwind: "$cliente" },
> { $unwind: "$items" },
> { $lookup: { from: "productos", localField: "items.producto_id", foreignField: "_id", as: "producto" } },
> { $unwind: "$producto" },
> { $group: { _id: "$cliente.nombre", productosComprados: { $push: "$producto.nombre" } } }
> ]);
> ```

**Resultado con los datos dados:** `{ _id: "Juan Pérez", productosComprados: ["Auriculares
Bluetooth", "Libro MongoDB"] }` · `{ _id: "María Gómez", productosComprados: ["Libro MongoDB"] }` ·
`{ _id: "Carlos Díaz", productosComprados: ["Auriculares Bluetooth", "Mouse Gamer"] }`.

> [!warning] Responde a medias: lista **productos por cliente**, no **órdenes por cliente**
> La consigna dice *"listar sus **órdenes** incluyendo el nombre de los productos"*. El `$group` final
> agrupa **por cliente** y aplana todos los productos en una sola lista: **se pierde la orden**
> *(su `_id`, su `fecha`)* y también la **cantidad**. Con estos datos **no se nota**, porque cada
> cliente tiene exactamente una orden; con dos órdenes del mismo cliente quedarían mezcladas. Un
> pipeline que conserva la estructura orden → productos agrupa **dos veces**, primero por orden y
> después por cliente *(propuesta propia)*:
>
> ```javascript
> db.ordenes.aggregate([
> { $unwind: "$items" },
> { $lookup: { from: "productos", localField: "items.producto_id", foreignField: "_id", as: "producto" } },
> { $unwind: "$producto" },
> { $group: { _id: "$_id", cliente_id: { $first: "$cliente_id" }, fecha: { $first: "$fecha" },
> productos: { $push: { nombre: "$producto.nombre", cantidad: "$items.cantidad" } } } },
> { $group: { _id: "$cliente_id", ordenes: { $push: { orden: "$_id", fecha: "$fecha", productos: "$productos" } } } },
> { $lookup: { from: "clientes", localField: "_id", foreignField: "_id", as: "cliente" } },
> { $unwind: "$cliente" },
> { $project: { _id: 0, cliente: "$cliente.nombre", ordenes: 1 } }
> ]);
> ```
>
> Y el detalle sintáctico: agrupar por **`$cliente.nombre`** en lugar de por `$cliente_id` fusiona
> a dos clientes homónimos, el mismo error que agrupar por nombre en SQL en lugar de por clave.

**Balance de la solución oficial:** las preguntas **1 y 3 dan bien** contra la cuenta a mano; la
**2** es correcta en lógica pero **el dataset tiene empate**; la **4 no muestra el país**; la **5**
aplana las órdenes. Como material de estudio, los cinco pipelines valen por lo que enseñan y el deck
no: **`$unwind` + `$lookup` + `$unwind`** es el patrón de join, `$multiply` dentro de `$sum` es el
"precio × cantidad", y `$push` arma arreglos al agrupar.

### (b) `Diferencia_Sharding_Replication_MongoDB.pdf` — la tabla comparativa

> [!quote] Textual, completo *(2 páginas)*
> **Diferencia entre Sharding y Replication en MongoDB**
> *"En MongoDB, sharding y replication son dos mecanismos fundamentales pero con propósitos
> distintos:"*
>
> **1. Replication (Replicación)**
> *Objetivo: Alta disponibilidad y tolerancia a fallos.*
> - *Se realiza mediante un replica set (conjunto de réplicas).*
> - *Hay un nodo primario y uno o más nodos secundarios.*
> - *Las escrituras y lecturas por defecto van al nodo primario.*
> - *Si el primario falla, uno de los secundarios se promueve automáticamente (failover automático).*
>
> *Ventajas:* — *Alta disponibilidad.* — *Recuperación automática ante fallos.* — *Lecturas
> distribuidas si se configura.*
>
> **2. Sharding (Fragmentación)**
> *Objetivo: Escalabilidad horizontal.*
> - *Los datos se dividen en múltiples servidores llamados shards.*
> - *Cada shard contiene solo una parte de los datos.*
> - *Se usa una shard key para distribuir los datos.*
> - *Se requiere un mongos (query router) y config servers para coordinar.*
>
> *Ventajas:* — *Escala la base de datos más allá de un solo servidor.* — *Mejora el rendimiento
> para bases de datos grandes.*
>
> **Comparación rápida:**
>
> | Característica | Replication | Sharding |
> | --- | --- | --- |
> | Propósito | Alta disponibilidad | Escalabilidad horizontal |
> | Cómo funciona | Copia de los mismos datos | División de los datos |
> | Componentes clave | Replica set | Shards, mongos, config servers |
> | Fallos | Soporta failover | Requiere diseño cuidadoso |
> | Lectura/Escritura | Principalmente en el primario | Distribuidas entre shards |
>
> **Combinación:** *"En sistemas grandes, ambos se pueden combinar: shards que sean replica sets,
> logrando alta disponibilidad y escalabilidad horizontal."*

Es la tabla que **el deck no tiene** y que los slides 40–44 dejan sin contrastar. Todo lo que afirma
es correcto; lo que agrega respecto del deck:

| Afirmación del handout | Dónde falta en el deck |
| --- | --- |
| *"lecturas por defecto van al primario"* y *"lecturas distribuidas si se configura"* | es el **read preference** *(`primary` por defecto; `secondaryPreferred` para repartir lecturas, a costa de leer datos atrasados)*, ausente en los slides 40–43 |
| *"shard key"* | el slide 44 dice *"by value ranges"* y nunca nombra la clave |
| *"mongos (query router) y config servers"* | `mongos` solo asoma en la tabla del slide 30 y en el diagrama del 37 |
| *"Requiere diseño cuidadoso"* | es la elección de la **shard key**, que no se puede cambiar sin costo y decide si las consultas van a un shard o a todos *(scatter-gather)* |
| *"shards que sean replica sets"* | es **la topología de producción**; desde 3.6 MongoDB exige que cada shard sea un replica set, y desde 3.4 que los config servers también lo sean *(a verificar en el manual de la versión del TP)* |

> [!tip] En una frase, para el parcial
> **Replicación copia; sharding reparte.** La primera compra disponibilidad *(y lecturas escaladas,
> si se acepta leer datos viejos)*; la segunda compra capacidad *(de datos y de escrituras)*. Se
> combinan porque resuelven problemas ortogonales, y un cluster real es **N shards × M réplicas**.

### (c) `Ejemplo_MapReduce_MongoDB.pdf` — total vendido por producto

> [!quote] Textual, completo *(2 páginas)*
> **Ejemplo de MapReduce en MongoDB**
> *"Supongamos una colección 'orders':"*
> ```
> { "_id": 1, "product": "laptop",  "quantity": 2, "price": 1000 }
> { "_id": 2, "product": "mouse",  "quantity": 5, "price": 50 }
> { "_id": 3, "product": "laptop",  "quantity": 1, "price": 1000 }
> { "_id": 4, "product": "keyboard", "quantity": 3, "price": 80 }
> ```
> *"Objetivo: Calcular el total vendido por producto."*
>
> **1. Función map:**
> ```javascript
> function() {
> emit(this.product, this.quantity * this.price);
> }
> ```
> **2. Función reduce:**
> ```javascript
> function(key, values) {
> return Array.sum(values);
> }
> ```
> **3. Comando MapReduce:**
> ```javascript
> db.orders.mapReduce(
> function() { emit(this.product, this.quantity * this.price); },
> function(key, values) { return Array.sum(values); },
> { out: "total_ventas_por_producto" }
> )
> ```
> **Resultado esperado:**
> ```
> { "_id": "laptop", "value": 3000 }
> { "_id": "mouse", "value": 250 }
> { "_id": "keyboard", "value": 240 }
> ```

**Verificación a mano** de cada paso:

| Doc | `map` emite *(clave, valor)* |
| :---: | --- |
| 1 | `("laptop", 2 × 1000 = 2000)` |
| 2 | `("mouse", 5 × 50 = 250)` |
| 3 | `("laptop", 1 × 1000 = 1000)` |
| 4 | `("keyboard", 3 × 80 = 240)` |

| Clave | Valores | `reduce` | Resultado esperado del handout | |
| --- | --- | --- | --- | :---: |
| `laptop` | `[2000, 1000]` | `Array.sum` = **3000** | 3000 | ✓ |
| `mouse` | `[250]` | *(no se llama)* → **250** | 250 | ✓ |
| `keyboard` | `[240]` | *(no se llama)* → **240** | 240 | ✓ |

**El resultado esperado es correcto.** Lo que el handout no dice: para `mouse` y `keyboard`, con
**un solo valor emitido**, MongoDB **no invoca `reduce`**; el valor pasa directo a la salida. Por
eso `reduce` tiene que devolver **el mismo tipo** que emite `map`: si `map` emitiera `{ total: 2000
}` y `reduce` devolviera un número, las claves con un solo valor saldrían con forma distinta. Es la
regla de idempotencia del slide 35, vista desde el otro lado. `Array.sum` es un *helper* del shell
de MongoDB, no de JavaScript estándar. Y el handout usa el **método** `db.orders.mapReduce(map,
reduce, opciones)` donde el deck *(slide 36)* usa el **comando** `db.runCommand({ mapReduce:
'phones', map, reduce, out })`: dos sintaxis para lo mismo; `out: "nombre"` materializa el resultado
en una colección con documentos de forma **`{ _id: clave, value: valor }`**.

> [!important] (crítico) `mapReduce` está **deprecado desde MongoDB 5.0**; el equivalente en el pipeline son **cuatro líneas**
> ```javascript
> db.orders.aggregate([
> { $group: { _id: "$product", value: { $sum: { $multiply: ["$quantity", "$price"] } } } },
> { $out: "total_ventas_por_producto" }
> ]);
> ```
> Correspondencia pieza por pieza:
>
> | MapReduce | Aggregation pipeline |
> | --- | --- |
> | `emit(this.product, …)` — la **clave** | `_id: "$product"` |
> | `this.quantity * this.price` — el **valor** | `{ $multiply: ["$quantity", "$price"] }` |
> | `Array.sum(values)` — el **reduce** | `{ $sum: … }` |
> | `out: "total_ventas_por_producto"` | `{ $out: "total_ventas_por_producto" }` *(reemplaza la colección; `$merge` para fusionar)* |
> | `finalize` *(no hay aquí)* | una etapa `$project` / `$addFields` después del `$group` |
>
> Mismo resultado, mismos nombres de campo *(`_id` y `value`)*, **sin JavaScript**, que es la razón
> de la deprecación: el pipeline se ejecuta en C++ dentro del motor, usa índices, se paraleliza por
> shard sin que el usuario escriba el `reduce` distribuido del slide 37, y no necesita el intérprete
> de JavaScript en el servidor. `$out` requiere ser la **última etapa**. *(Propuesta propia;
> equivalencia verificada a mano contra las cuatro filas, no contra un servidor.)*

---

## Contradicciones internas del deck

| # | Contradicción | Slides | Detalle |
| :---: | --- | :---: | --- |
| 1 | **`mongosh` vs. `mongo`** | 10 ↔ 11, 25, 41 | El 10 enseña `mongosh` y dice que el shell viejo ya no viene con el servidor; el 11 muestra la ayuda de `mongo` *("quit the mongo shell")*, el 25 imprime `WriteResult(…)` *(salida del shell legado)* y el 41 conecta con `$ mongo localhost:27011` |
| 2 | **`insertOne` vs. `insert`** | 9 ↔ 12, 20, 23 | El 9 usa la API actual; tres slides después vuelve la deprecada, y el slide 20 —que se titula "CRUD"— enseña `insert` |
| 3 | **`countDocuments()` vs. `count()`** | 14 ↔ 27, 29, 34 | El 14 muestra `count()` en gris y debajo `countDocuments()` en negro; los otros tres lo siguen usando |
| 4 | **`towns` vs. `town`** | 20 | La misma colección con dos nombres en tres líneas consecutivas |
| 5 | **Python 3 vs. Python 2** | 26 ↔ 39 | `print('{0} {1}'.format(…))` contra `print c['name']` |
| 6 | **Versión 6.0.5 vs. API de 2.x–3.x** | 2 ↔ 29, 36, 38 | El deck se declara de 6.0 y enseña `ensureIndex` *(deprecado en 3.0)*, `background` *(sin efecto desde 4.2)*, `system.js.save` *(deprecado en 4.2)* y `mapReduce` *(deprecado en 5.0)* sin marcar ninguno |
| 7 | **Dos `internos` distintas** | 15 ↔ 16 | Misma colección, campos distintos, sin comentario *(es *no-schema* en acción, pero el deck no lo capitaliza)* |
| 8 | **Popularidad en baja vs. líder en empleo** | 3 ↔ 5 | db-engines con deltas negativos; LinkedIn con MongoDB primero. Métricas distintas, sin conciliar |
| 9 | **`famous_for` vs. `famousFor`** | 6 ↔ 22 | El documento de Portland del 6 escribe el campo en `snake_case` *(`famous_for`, `last_census`)*; las consultas del 22 lo buscan como `famousFor` *(el nombre del libro)*. Sobre el documento del 6, el `$all` del 22 no matchearía nada — justo el error que el propio slide 22 advierte |
| 10 | **`toString()`** | 8 | Documenta el comportamiento del shell legado, que en `mongosh` cambió |
| 11 | **"página 120"** | 36 | El texto citado está en la 120; el `runCommand` reproducido está en la 121 *(menor)* |

## Erratas y detalles de transcripción

| Slide | Errata | Lo correcto |
| :---: | --- | --- |
| 7 | JSON en sintaxis de Python *(`None`, comillas simples)* | es un `dict` volcado con `print`, no JSON; el gist lo aclara |
| 20 | *"parentesis"*, *"estas"*, *"en que DB"* sin tilde | *paréntesis*, *estás*, *en qué* |
| 20 | `db.towns.insert` / `db.town.findOne()` | una sola colección |
| 20 | comentario *"# muestra las"* cortado | *"muestra las bases de datos"* |
| 26 | `'…:<port>/'elecciones-2019'` | `'…:<port>/elecciones-2019'` — comillas rotas, no es Python válido |
| 26 | variable `id` | pisa la función incorporada `id` de Python |
| 29 | `100,000 rows` como salida de `count()` | `count()` devuelve `100000`; *"rows"* es vocabulario relacional |
| 39 | `print c['name']` | `print(c['name'])` |
| 44 | *"De donde"*, *"termino"*, *"pag."* | *De dónde*, *término*, *pág.* |
| 44 | `- or just sharding` con guion simple | el libro usa raya *(—)*; menor |

**Total: 10 erratas en 45 slides**, ninguna que impida entender el comando, y **dos que impiden
ejecutarlo tal cual** *(las comillas del 26 y el `print` del 39)*. Es un deck mucho más limpio que
el de la [[Clase 10 - Restricciones integridad-Parte 2]] *(25 erratas en 20)*; su problema no son
los errores sino la **edad** de las capturas.

## Dudas abiertas

- [ ] (crítico) **¿`mapReduce` entra al parcial, o solo el aggregation pipeline?** Tres slides
  *(35–37)* y el handout (c), pero deprecado desde 5.0. **Preguntar en la práctica del 22/09.**
- [ ] (crítico) **`$lookup` y `$unwind` no están en el deck y la solución oficial del ejercicio
  complementario los usa en todos sus pipelines.** ¿Se dictaron oralmente, salen del libro de Paul
  Done *(slide 32)* o de la Parte II del TP9? Afecta qué estudiar para el parcial del 13/10.
- [ ] (crítico) **¿Qué versión de MongoDB corre en el TP?** `docker pull mongo` sin tag trae la última
  *(8.x en 2026)*; el deck es de 6.0.5. Determina si `ensureIndex`, `count()`, `insert()` y
  `db.loadServerScripts()` corren con aviso o fallan. **Verificar con `db.version()`.**
- [ ] **¿Los handouts (a), (b) y (c) se entregaron el 14/09 o son de otro cuatrimestre?** Datan de
  mayo de 2025. ¿Se discutió la solución oficial, con sus respuestas incompletas *(preguntas 4 y 5)*
  y el empate de la 2?
- [ ] **La consigna dice *"Usando MongoDB (Compass)"*.** ¿Se espera el *aggregation pipeline builder*
  gráfico de Compass, o vale `mongosh`? El TP9 nombra primero DataGrip.
- [ ] **¿Se toman replica sets y sharding en el parcial, o solo como concepto?** El handout (b)
  sugiere que el nivel esperado es la tabla comparativa, no la configuración.
- [ ] **¿Se dicta algo de transacciones, GridFS o geoespacial en MongoDB?** Están en el libro y no en
  el deck; el dataset de `hospitales` del slide 33 es GeoJSON.
- [ ] **¿En qué unidad cae la Parte II del TP9 (22/09) y Cassandra (28/09)?** Se observa cuando
  llegue el material.
- [ ] **`toString()` de `ObjectId` en `mongosh`**: el slide 8 dice que devuelve `ObjectId("…")`;
  en `mongosh` debería devolver el hexadecimal. Probar en el TP.
- [ ] **¿Existe una ficha para *Practical MongoDB Aggregations* (Paul Done)?** Es el único libro que
  el deck nombra *(slide 32)*, es gratuito en línea y no está en
  `raw/Material_Catedra/bibliografia/`. Decisión del humano.
- [ ] **Este deck no declara bibliografía**, pero cita tres páginas de *Seven Databases* 2ª ed. sin
  nombrarlo. ¿La cátedra asume el capítulo 4 entero como lectura? Afecta el mapeo de
  [[_index-bibliografia]] › Clase 14.

## Enlaces

- Clase anterior: [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] *(mismo lunes 14/09)* · antes:
  [[Clase 12 - Introduccion a NoSQL]] *(mismo lunes)* y [[Clase 11 - Seguridad-Transacciones]]
  *(07/09)* · clase siguiente: *(28/09, Introducción a Cassandra según [[_cronograma]]; el 21/09 es
  Día del Estudiante, sin teórica)*
- Práctica de esa semana (martes 15/09): **[[Práctica 2026-09-15]]** — TP 9 MongoDB Parte I
- Conceptos que **nacen** en esta clase *(nombres previstos; los fija la etapa de conceptos)*:
  [[2.12.06 - Modelo de documentos — JSON, BSON y ObjectId|ObjectId y el campo _id]] ·
  [[2.14.01 - mongosh y herramientas de línea de comando|mongosh y herramientas de línea de comando]] ·
  [[2.12.07 - CRUD y consultas en MongoDB|CRUD en MongoDB]] ·
  [[2.12.07 - CRUD y consultas en MongoDB|Operadores de consulta]] ·
  [[2.14.02 - Índices en MongoDB|Índices en MongoDB]] ·
  [[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
  [[2.14.03 - MapReduce|MapReduce]] ·
  [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Replica sets]] ·
  [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Sharding]]
- Conceptos existentes que esta clase **espeja del lado NoSQL**: [[1.08.02 - Índices|Índices]]
  *(el experimento medir–indexar–medir, ahora con `explain()` de MongoDB)* ·
  [[1.08.01 - Plan de ejecución|Plan de ejecución]] ·
  [[1.10.02 - Stored procedures y funciones|Stored procedures y funciones]] *(vs. `system.js`)* ·
  [[1.05.01 - SQL — consultas|SQL — consultas]] *(la tabla SQL → pipeline del slide 33)*
- Motores: [[MongoDB]] *(a crear)* · [[MySQL]] *(el motor de la primera mitad)* · [[PostgreSQL]]
  § *Inventario* *(este deck **no** entra: no tiene motor ajeno)*
- Bibliografía: *Seven Databases* 2ª ed. cap. **4** *(Day 1: CRUD and Nesting, impresas 94–110 ·
  Day 2: Indexing, Aggregating, Mapreduce, 110–123 · Day 3: Replica Sets, Sharding, GeoSpatial, and
  GridFS, 124–132)* · Corbellini et al. 2017 § **6** *(document-oriented, pp. 15–16, Table 6)* ·
  detalle en [[_index-bibliografia]] › Clase 14
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]] · TPs: `raw/tp/_index.md`
