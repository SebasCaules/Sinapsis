---
tipo: motor
resumen: "Motor documental de la segunda mitad (Clases 12 a 14, TP9): setup con Docker y mongosh, versión sin fijar (el deck declara 6.0.5; docker pull mongo sin tag trae 8.x) y la tabla que traduce la API legada del shell mongo (insert, count, ensureIndex, mapReduce) a lo que hay que tipear hoy."
motor: MongoDB
rol: motor documental de la segunda mitad de la cursada
version: "sin fijar por la cátedra — el deck 14 declara 6.0.5; `docker pull mongo` sin tag trae la rama 8.x (8.3.11 el 16/09/2026, verificado en Docker Hub)"
paradigma: documental (NoSQL)
clases: [12, 13, 14]
tps: [TP9]
aliases:
  - MongoDB
  - Mongo
  - mongosh
  - mongod
  - Setup MongoDB
  - MongoDB en Docker
  - Shell legacy vs mongosh
  - Traducción mongo a mongosh
  - Motor de la segunda mitad
fuentes:
  - "raw/Unidad-02/Teorica/BD2_Clase 12 - Introduccion a NoSQL.pdf"
  - "raw/Unidad-02/Teorica/BD2_Clase 13 - NoSQL-EmbebidosVSNormalizado(1).pdf"
  - "raw/Unidad-02/Teorica/BD2_Clase 14 - MongoDB Features.pdf"
  - "raw/Unidad-02/Teorica/Consigna MONGO DB.pdf"
  - "raw/Unidad-02/Teorica/Consigna MONGO DB (solucion).pdf"
  - "raw/Unidad-02/Teorica/Diferencia_Sharding_Replication_MongoDB.pdf"
  - "raw/Unidad-02/Teorica/Ejemplo_MapReduce_MongoDB.pdf"
  - "raw/Unidad-02/Practica/ITBA TP 9 - MongoDB Parte I.pdf"
  - "raw/Material_Catedra/bibliografia/obligatoria/Perkins, Redmond y Wilson - Seven Databases in Seven Weeks (2ed, 2018).pdf"
  - "raw/Material_Catedra/bibliografia/papers/Corbellini et al (2017) - Persisting big-data, The NoSQL landscape.pdf"
  - "raw/Material_Catedra/programa/Cronograma 2026-2C.pdf"
estado: procesado
---

# MongoDB — el motor documental de la segunda mitad

## Resumen general

MongoDB es el motor documental de la segunda mitad de la cursada: lo enseñan las Clases 12, 13
y 14 (lunes 14/09) y lo trabaja el TP9 (Parte I el 15/09, Parte II el 22/09), en `mongosh`. Es el
primer motor de la materia sin desfasaje entre lo que enseña el deck y lo que pide la práctica —a
diferencia de toda la Unidad-01, donde once de trece archivos estaban escritos en PostgreSQL,
Oracle o T-SQL— y el mejor cubierto por la bibliografía obligatoria (*Seven Databases in Seven
Weeks* cap. 4 y Corbellini § 6). Importa para el parcial del 13/10, porque abre la unidad NoSQL, y
para el TPO, porque MongoDB suele ser candidato de comparación de motores.

El problema de esta página no es de motor sino de versión y de shell: los tres decks y el TP
transcriben la API del shell legado `mongo` (`insert`, `count`, `update({multi:true})`, `remove`,
`ensureIndex`, `.pretty()`, `mapReduce`), mientras que lo que se ejecuta hoy es `mongosh`, que
acepta casi todo eso con `DeprecationWarning` y rechaza un puñado de casos. El deck 14 declara la
versión estable 6.0.5, pero `docker pull mongo` sin tag trae la rama 8.x. Para el parcial y el TP
conviene recordar: `.pretty()` ya no hace nada; `count()` sin filtro puede ser aproximado
(`countDocuments()` es la forma exacta); `ensureIndex` no está en la referencia actual
(`createIndex` es su reemplazo mecánico); el binario `mongo` fue retirado en la versión 6.0; y la
atomicidad es siempre por documento, aunque existan transacciones multi-documento desde 4.0/4.2.
Anotar `db.version()` al empezar cualquier ejercicio es el hábito que evita la mayoría de las
sorpresas.

---

## Por qué MongoDB no tiene desfasaje de motor

Programa oficial y cronograma coinciden en este motor, a diferencia del caso MySQL/PostgreSQL de
la primera mitad. La fila `2026-09-14` del [[_cronograma]] da las tres teóricas de MongoDB, la
`2026-09-15` el **TP9 Parte I** y la `2026-09-22` la **Parte II**; el enunciado del TP hace
`docker pull mongo` y trabaja en `mongosh` → [[Práctica 2026-09-15]]. La Clase 12 desarrolla
MongoDB en sus slides 29–52 (`insert`, `find`, `$group`, `$lookup`, `createView`, en API legada).

> [!note] Estos tres decks **no entran** en el inventario de [[PostgreSQL]]
> Ese inventario registra los decks relacionales escritos contra un motor distinto del de la
> cursada *(11 de 13 archivos de la U1 tienen algo de PostgreSQL, Oracle o T-SQL)*. Las Clases 12,
> 13 y 14 no tienen motor ajeno: el único rastro relacional es el `CREATE TABLE` del slide 32 de la
> Clase 12, que mezcla `MEDIUMINT … AUTO_INCREMENT` *(MySQL)* con `age Number` *(Oracle)* porque
> viene copiado del *SQL to MongoDB Mapping Chart* de la documentación oficial. Es un ejemplo
> ilustrativo, no una sentencia para ejecutar, y no cambia el veredicto.

> [!warning] El desfasaje que sí existe: **cuatro épocas de MongoDB en el mismo material**
> Cada fuente de la semana está escrita contra una versión distinta, y ninguna contra la que baja
> el TP:
>
> | Fuente | Versión que refleja | Evidencia |
> | --- | --- | --- |
> | [[Clase 12 - Introduccion a NoSQL\|Clase 12]] | **anterior a 2.6** *(2014)* en sus capturas de código | slide 47: `aggregate` devuelve `{ "result" : [ … ], "ok" : 1 }`, el formato previo al cursor; slide 29: *"modo maestro-esclavo"*, eliminado en 4.0; pero `$lookup` *(3.2)* y `createView` *(3.4)* también están: capturas de al menos dos épocas |
> | *Seven Databases* 2ª ed. | **3.6** *(2018)* | ficha, Apéndice A1, callout de versiones; usa `insert()`, `ensureIndex`, el shell `mongo` y el dominio `docs.mongodb.com` |
> | [[Clase 13 - NoSQL-EmbebidosVSNormalizado\|Clase 13]] | shell `mongo` *(sin versión declarada; PDF de abril de 2024)* | slide 22 `insert([…])`, slide 26 `.pretty()` |
> | [[Clase 14 - MongoDB Features\|Clase 14]] | **6.0.5** declarada, API de 2.x–3.x enseñada | slide 2 vs. slides 11, 25, 29, 36, 38, 41 |
> | [[Práctica 2026-09-15\|TP9]] | **API de `mongosh`** con dos reliquias | `insertOne`, `updateOne`, `deleteMany`, `countDocuments`; pero `ensureIndex` *(pasos 30, 32, 33)* y `find().count()` *(paso 27)* |
> | Lo que se instala | **8.x** *(`latest` el 16/09/2026 = 8.3.11)* | Docker Hub, ver § Versión |
>
> La consecuencia práctica es la tabla de § *Diferencias: lo que muestra el slide vs. lo que hay
> que tipear*, más abajo.

---

## Versión — lo que declara el deck y lo que baja el `pull`

El slide 2 de la [[Clase 14 - MongoDB Features|Clase 14]] es la única declaración de versión de
toda la semana:

> [!quote] Clase 14, slide 2, textual
> *"Initial release: **2009**"* · *"Stable release: **6.0.5** / 2023-03-13"* ·
> *"repository: github.com/mongodb/mongo"* · `https://db-engines.com/en/system/MongoDB`

Es la versión estable de marzo de 2023, coherente con la fecha de creación del PDF *(22/09/2023,
según `pdfinfo`)*. Pero el TP no la instala:

> [!important] `docker pull mongo` sin tag = `latest`, y `latest` **cambia con el tiempo**
> Verificado el **16/09/2026** en la página de la imagen oficial `mongo` de Docker Hub: la fila de
> tags dice `8.3.11`, `8.3`, `8`, `latest` → `8.3.11-noble`, y las otras ramas mantenidas son
> **8.0.32** y **7.0.43**. Quien hizo el `pull` el 15/09 tiene MongoDB **8.3**, dos ramas mayores
> por encima del 6.0.5 del deck. *(Lectura de la web, no una ejecución de `docker` desde esta
> página: la versión efectiva de cada máquina hay que leerla con `db.version()`.)*
>
> Dos consecuencias: **(1) reproducibilidad** — dos alumnos que hagan el `pull` en fechas distintas
> pueden tener versiones distintas, y la forma de la salida de `explain()` *(paso 34 del TP9)*
> cambia entre ramas mayores; conviene fijar al menos la rama, `docker pull mongo:8` *(propuesta
> propia, la cátedra no lo pide)*. **(2) compatibilidad hacia atrás** — todo lo deprecado que
> enseñan los decks *(`insert`, `count`, `update`, `remove`, `ensureIndex`, `mapReduce`)* sigue
> existiendo en 8.x con advertencia; lo que **no** existe es el binario `mongo` *(ver § 7 de la
> tabla de diferencias)*.

> [!note] La documentación actual de `mongosh` declara soporte para servidores **7.0 o superiores**
> La página de instalación de `mongosh` dice hoy *"You can use the MongoDB Shell to connect to
> MongoDB version 7.0 or greater"* *(verificado el 16/09/2026)*. El **6.0.5 del deck queda por
> debajo del mínimo soportado por el shell actual**: no es que falle, es que ya no está en la
> matriz de soporte.

```javascript
// Lo primero que se anota en la entrega del TP9, antes de cualquier comando
db.version()  // versión del servidor mongod
version()  // versión de mongosh (función del shell, no de db)
```

---

## Setup, tal como lo da la práctica

> [!info] Fuente
> Todo este apartado sale de `raw/Unidad-02/Practica/ITBA TP 9 - MongoDB Parte I.pdf`, p. 1,
> secciones *"Instalación del motor"* e *"Instalación del cliente"* → [[Práctica 2026-09-15]].
> **Los comandos y las URLs son los del enunciado, transcritos, no inventados.**

La cátedra da dos caminos para el servidor: contenedor **Docker** *(primera opción)* o
**MongoDB Community Edition** instalado en la máquina.

### Levantar el motor con Docker

Los ocho pasos del enunciado, tal como hay que tipearlos:

```bash
docker pull mongo
docker run --name Mymongo -p 27017:27017 -d mongo
docker exec -it Mymongo bash  # y adentro: mongosh
docker stop Mymongo
docker start Mymongo
docker ps -a
docker cp <filename> Mymongo:/<filename>
```

> [!tip] El atajo que el TP no menciona: `mongosh` directo, sin `bash` intermedio
> La imagen oficial `mongo` **trae `mongosh` adentro**. Alcanza con:
>
> ```bash
> docker exec -it Mymongo mongosh
> ```
>
> No contradice el recuadro que la Clase 14 copia de la documentación —*"The MongoDB Shell (mongosh)
> is not installed with MongoDB Server"*—: ese aviso vale para la **instalación nativa**, donde el
> shell se baja aparte; la imagen Docker lo incluye. El `docker cp` de la lista sirve para lo que
> este TP todavía no pide: copiar un `.json`/`.tsv` al contenedor e importarlo con `mongoimport`.

### Instalación local

El TP ofrece también instalar **MongoDB Community Edition** local, con un hipervínculo *("Instalar
MongoDB Community Edition - Manual de base de datos - MongoDB Docs")* cuyo destino no se ve en el
PDF — por el título, sería `https://www.mongodb.com/docs/manual/installation/` *(URL supuesta, no
la del PDF)*. En la instalación nativa **hay que instalar `mongosh` aparte** *(recuadro del
slide 10 de la Clase 14)* y el servicio se enciende como muestra ese mismo slide:

```bash
# Clase 14, slide 10 — Linux con service
$ sudo service mongod start
$ sudo service mongod stop
$ mongosh --host localhost --port 27017  # es equivalente a
$ mongosh  # esta otra instrucción
```

### Conectarse y parámetros

El TP ofrece `mongosh` como cliente de línea de comandos y **DataGrip** como primera opción de
GUI, con MongoDB Compass y Studio 3T Free como alternativas *(tabla de clientes, más abajo)*.

| Parámetro | Valor |
| --- | --- |
| Imagen | `mongo` *(sin tag → `latest`)* |
| Nombre del contenedor | `Mymongo` |
| Host | `localhost` / `127.0.0.1` |
| Puerto | `27017` *(el puerto por defecto de `mongod`; el slide 41 de la Clase 14 lo evita al levantar tres nodos)* |
| Base del TP | `lab` *(`use lab`; se crea con la primera inserción)* |
| Usuario / password | **no hay**: el `run` no define credenciales y el servidor arranca sin autenticación |
| Cadena de conexión | `mongodb://localhost:27017` *(la forma que usa el slide 39 de la Clase 14 desde `pymongo`: `MongoClient('mongodb://localhost:27017/')`)* |
| Volumen | **no hay `-v` con nombre**: la imagen oficial declara `VOLUME /data/db /data/configdb`, así que Docker crea un volumen anónimo; `stop`/`start` conservan los datos, `docker rm Mymongo` deja `lab` en un volumen huérfano *(inaccesible por nombre, no borrado)* y `docker rm -v` lo borra. Para persistencia con nombre: `-v mongo_data:/data/db` *(ampliación propia; el `VOLUME` verificado contra el Dockerfile de `docker-library/mongo` el 18/09/2026)* |

Clientes que propone el material, con lo que cada fuente dice de ellos:

| Cliente | Tipo | Quién lo nombra | Comentario |
| --- | --- | --- | --- |
| **`mongosh`** | CLI, JavaScript | TP9 p. 1 · Clase 14 slide 10 | **Todo el TP está escrito para él.** Es el shell actual; el `mongo` legado no viene en la imagen |
| **DataGrip** | GUI (JetBrains) | TP9 *(primera opción)* · Clase 14 slide 18 | El mismo cliente que la cursada usa para MySQL desde la [[Práctica 2026-08-04]]: *"configurando el data source correspondiente"* |
| **MongoDB Compass** | GUI oficial | TP9 · Clase 14 slide 17 | `https://www.mongodb.com/products/tools/compass`. Gratuito, con `mongosh` embebido; la consigna complementaria del 14/09 dice *"Usando MongoDB (Compass)"* |
| **Studio 3T Free** *(ex Robo 3T)* | GUI | TP9 · Clase 14 slides 16 y 42 | `https://robomongo.org/download`. Cambio de nombre: *"Robo 3T is now Studio 3T Free"*; capturas de Robomongo 0.9.0-RC9 y Robo 3T 1.2 en el deck 14 |
| NoSQLBooster | GUI | solo Clase 14 slide 19 | El TP no lo lista |

### Comandos de referencia del contenedor

```bash
docker ps -a  # lista contenedores, incluidos los detenidos
docker stop Mymongo
docker start Mymongo
docker exec -it Mymongo mongosh  # shell directo (atajo)
docker exec -it Mymongo bash  # como dice el TP; adentro: mongosh, mongoimport, mongodump…
```

> [!note] Misma mecánica que MySQL, con tres diferencias
> Comparado con el `docker run` de la [[Práctica 2026-08-04]] *(`mysql:9.7.2`, con `-e` de
> credenciales)*: no se fija tag, no hay usuario ni contraseña, y no hay `-v` *(volumen anónimo,
> ver tabla de parámetros)*. Las tres son decisiones del enunciado, no defectos del motor:
> `-e MONGO_INITDB_ROOT_USERNAME`/`PASSWORD` y `-v mongo_data:/data/db` existen en la imagen
> oficial *(ampliación propia)*.

---

## Qué TPs corren sobre MongoDB

Serie real según [[_cronograma]] y `raw/tp/_index.md`:

| TP | Tema | Práctica donde se da | Teóricas que lo sustentan | ¿Toca MongoDB? |
| --- | --- | --- | --- | --- |
| **TP9 Parte I** | MongoDB Parte I | **[[Práctica 2026-09-15]]** | Clases **12**, **13** y **14** *(lunes 14/09)* | ✓ **entero**, en `mongosh`. 34 pasos guiados *(CRUD, selectores, `$regex`, `$set`/`$inc`/`$push`, upsert, proyección, `sort`/`limit`/`skip`, subdocumentos, índices, `explain`)* + 11 ejercicios sobre `bandas`. Los ejercicios **10 y 11** piden `createView` y `$group`, que los 34 pasos no enseñan |
| **TP9 Parte II** | MongoDB Parte II | martes 22/09 *(sin teórica el lunes 21/09, Día del Estudiante)* | pendiente | ✓ presumiblemente; **el enunciado no está en `raw/`** y esta página no predice su contenido |
| Consigna *ecommerce* *(sin número de TP)* | agregaciones sobre `clientes` / `productos` / `ordenes` | material complementario del 14/09 | Clase 14 | ✓ cinco preguntas de `aggregate`; la solución oficial usa `$lookup` y `$unwind`, que el deck 14 no enseña *(`$lookup` está en las Clases 12 —slide 49— y 13 —slides 22–24—; `$unwind` solo se nombra en la lista del slide 21 de la Clase 13)* → [[Clase 14 - MongoDB Features]] § Material complementario |
| **TP10**–**TP13** | Cassandra · Neo4j · Redis · DynamoDB | segunda mitad | pendiente | ✗ otros motores |

> [!warning] El TP9 no trae dataset: los datos se tipean
> Los 12 documentos de `players` están como comandos `insertOne` en las pp. 2–3 del PDF, y la
> tabla de bandas del ejercicio 1 está **solo como imagen** en la p. 7 — quinta vez que un TP manda
> tipear el esquema o los datos a mano *(TP4, TP5, TP6 y TP7 según `raw/tp/_index.md`)* y tercera
> que da algo solo como imagen. La transcripción celda por celda y los `insertMany` ejecutables
> están en [[Práctica 2026-09-15]] § Ejercicio 1.

### El dataset de la teórica

La Clase 14 trabaja con colecciones que **no vienen en el vault**: `towns` *(Portland, New York,
Punxsutawney — del libro)*, `phones` *(100.000 documentos generados con un script del libro)*,
`internos` *(importada con `mongoimport … --type tsv < internos.tsv`, 289 documentos)*,
`egresados`, `testing`, `hospitales` y `elecciones-2019`. Ninguno está en `raw/`; los ejemplos se
leen, no se reproducen, salvo el experimento de índices del slide 29, replicable con cualquier
colección grande → [[2.14.02 - Índices en MongoDB|Índices en MongoDB]].

---

## Diferencias: lo que muestra el slide vs. lo que hay que tipear

> [!important] Esta es la tabla que hay que tener al lado cuando se hace el TP
> Verificado contra la página de compatibilidad de `mongosh`
> *(`https://www.mongodb.com/docs/mongodb-shell/reference/compatibility/`, § *Deprecated
> Methods*, consultada el 16/09/2026)* y contra las páginas de referencia del manual que se citan
> en cada fila. **Deprecado ≠ eliminado**: los métodos de las filas (atención) corren en `mongosh` y
> emiten `DeprecationWarning`; los de las filas ✗ fallan.

### 1 · CRUD — los *helpers* genéricos se partieron en `…One` / `…Many`

| Como está en el material | Dónde | Estado | Como se escribe hoy |
| --- | --- | :---: | --- |
| `db.users.insert({user_id: "abc123", age: 55, status: "A"})` · `db.myCollection.insert({"name" : "tutorial"})` · `db.mycol.insert({…})` · `db.usuarios.insert({…})` · `db.towns.insert( <JSON> )` | Clase 12 slides 32, 37, 38 · Clase 14 slides 12, 20, 23 | (atención) deprecado | `insertOne({…})` |
| `db.post.insert([ {…}, {…} ])` · `db.orders.insert([ … ])` · `db.inventory.insert([ … ])` | Clase 12 slide 39 · Clase 13 slide 22 | (atención) deprecado | `insertMany([ … ])` |
| `db.users.update( { age: { $gt: 25 } }, { $set: { status: "C" } }, { multi: true })` | Clase 12 slide 32 | (atención) deprecado | `updateMany( { age: { $gt: 25 } }, { $set: { status: "C" } } )` — la cardinalidad va en el nombre, no en `{multi: true}` |
| `db.towns.update( { name : "Portland" }, { $set : { "state" : "OR" } } )` → `WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })` | Clase 14 slide 25 | (atención) deprecado; la salida `WriteResult` es del shell legado | `updateOne(…)` → `{ acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }` |
| *"especificar un tercer parámetro en true"* *(upsert, prosa)* | TP9 paso 19 | (atención) describe la firma legada `update(q, u, true)` | `updateOne(q, u, {upsert: true})` — como el paso 20 del mismo TP ya lo escribe |
| `db.users.remove( { status: "D" } )` | Clase 12 slide 32 | (atención) deprecado | `deleteMany( { status: "D" } )` / `deleteOne(…)` |
| `db.users.count()` · `db.users.find().count()` · `db.internos.count()` · `db.countries.count()` · `db.players.find({hobbies:'Swimming'}).count()` | Clase 12 slide 32 · Clase 14 slides 14, 27, 29, 34 · TP9 paso 27 | (atención) deprecado *(sin filtro puede devolver un valor aproximado, por metadatos)* | `countDocuments(filtro)` *(exacto)* · `estimatedDocumentCount()` *(rápido, sin filtro)*. El slide 14 de la Clase 14 muestra la corrección: `count()` en gris, `countDocuments()` debajo |
| `db.system.js.save({…})` + `db.loadServerScripts()` | Clase 14 slide 38 | (atención) `save()` deprecado | `db.system.js.insertOne({…})`; el mecanismo entero está en retirada *(ver [[2.14.01 - mongosh y herramientas de línea de comando\|mongosh y herramientas]])* |

Lo que **ya está en la API vigente** y no hay que tocar: `insertOne` *(Clase 14 slide 9, TP9)*,
`deleteOne` *(Clase 14 slide 27)*, `updateOne` / `updateMany` / `deleteMany` / `countDocuments`
*(TP9)*, `findOne` / `find` *(todos)*.

### 2 · Consultas y salida del shell

| Como está en el material | Dónde | Estado | Hoy |
| --- | --- | :---: | --- |
| `db.mycol.find().pretty()` · `db.cliente.find({…}, {…}).pretty()` | Clase 12 slides 40, 41, 44 · Clase 13 slide 26 | ✓ existe, **sin efecto** | `find()` ya imprime indentado en `mongosh`; `.pretty()` es un *no-op* |
| `aggregate([…])` que devuelve `{ "result" : [ … ], "ok" : 1 }` | Clase 12 slide 47 | ✗ formato **anterior a 2.6** *(2014)* | desde 2.6 `aggregate` devuelve un **cursor** y el shell imprime los documentos sueltos, uno por línea |
| `"likes" : "100"` en las salidas *(el insert puso el número `100`)* | Clase 12 slides 40, 42, 43, 44 | ✗ salida escrita a mano | el shell imprime `likes: 100`; con el string, el `$gt: 50` del slide 41 no matchearía |
| `DBQuery.shellBatchSize = x` | Clase 14 slide 11 *(help del shell `mongo`)* | (atención) deprecado | `config.set("displayBatchSize", x)` *(verificado en la página de compatibilidad)* |
| `it` para seguir iterando el cursor | Clase 14 slide 11 | ✓ | igual |
| `show tables` | Clase 14 slide 13 | ✓ alias | `show collections` |
| `printjson(doc)` dentro de `forEach` | Clase 13 slide 27 · Clase 14 slide 28 | ✓ | igual |
| `find({…}).explain()` · `.explain("executionStats")` | Clase 13 slide 28 · Clase 14 slide 29 · TP9 paso 34 | ✓ | igual; la **forma** de la salida cambia entre ramas mayores *(ver [[1.08.01 - Plan de ejecución\|Plan de ejecución]] § MongoDB)* |

### 3 · Índices

| Como está en el material | Dónde | Estado | Hoy |
| --- | --- | :---: | --- |
| `db.phones.ensureIndex( { display : 1 }, { unique : true } )` · `db.players.ensureIndex({name:1})` · `ensureIndex({name:1},{unique:true})` · `ensureIndex({name:1, weight:1})` | Clase 14 slide 29 · TP9 pasos 30, 32, 33 | (atención) **fuera de la lista de métodos del manual** *(la referencia `js-collection` lista `createIndex`, `createIndexes`, `dropIndex`, `dropIndexes`, `getIndexes`, `hideIndex`, `unhideIndex`, `reIndex`; `ensureIndex` no aparece — verificado 16/09/2026)*. Alias deprecado desde 3.0 | `createIndex(claves, opciones)`, mismos argumentos. **Si en la consola falla con `is not a function`, la corrección es mecánica** |
| `db.phones.ensureIndex({ "components.area": 1 }, { background : 1 })` | Clase 14 slide 29 | (atención) `background` **ignorado desde 4.2** | `createIndex({ "components.area": 1 })` — todos los índices se construyen sin bloquear |
| `db.players.dropIndex({name:1})` | TP9 paso 31 | ✓ | igual; también por nombre `'name_1'` |
| `db[collection].getIndexes()` | Clase 14 slide 28 | ✓ | igual |

### 4 · Agregación y MapReduce

| Como está en el material | Dónde | Estado | Hoy |
| --- | --- | :---: | --- |
| `db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : 1}}}])` | Clase 12 slide 47 | ✓ *(solo la salida está vieja)* | igual |
| `db.posts.aggregate([{ $lookup: { from: "comments", localField: "title", foreignField: "postTitle", as: "comments" } }])` | Clase 12 slide 49 *(posts/comments)*. La Clase 13 slide 23 trae el mismo operador con otro ejemplo: `db.orders.aggregate([{ $lookup: { from: "inventory", localField: "item", foreignField: "sku", as: "inventory_docs" } }])` | ✓ *(desde 3.2)* | igual. **No está en *Seven Databases* cap. 4** *(cero ocurrencias, verificado en la Clase 13)* |
| `db.runCommand({ mapReduce: 'phones', map: map, reduce: reduce, out: 'phones.report' })` · `db.orders.mapReduce(…)` | Clase 14 slide 36 · handout `Ejemplo_MapReduce_MongoDB.pdf` | (atención) **deprecado desde 5.0** *(manual: "Starting in MongoDB 5.0, map-reduce is deprecated … you should use an aggregation pipeline" — verificado 16/09/2026)* | `aggregate([{ $group: … }, { $out: … }])`; para lo que no cabe en operadores, `$accumulator` y `$function`. La traducción del handout está en [[Clase 14 - MongoDB Features]] § (c) y en [[2.14.03 - MapReduce\|MapReduce]] |
| `db.createView("managementFeedback", "survey", [ { $project: { "management": "$feedback.management", department: 1 } } ])` · `db.createCollection("<viewName>", { "viewOn": …, "pipeline": … })` | Clase 12 slides 50–51 | ✓ *(desde 3.4)* | igual; las vistas son **de solo lectura** *(manual: "Views act as read-only collections, and are computed on demand during read operations")* y su pipeline **no puede llevar `$out` ni `$merge`** |

### 5 · Replica set — el shell cambia, `rs.*` no

| Como está en el material | Dónde | Estado | Hoy |
| --- | --- | :---: | --- |
| `$ mongod --replSet book --dbpath ./mongo1 --port 27011` *(×3)* | Clase 14 slide 41 | ✓ | igual |
| `$ mongo localhost:27011` | Clase 14 slide 41 | ✗ **binario `mongo` retirado en 6.0** *(verificado, ver callout al final del § 7)* | `mongosh localhost:27011` · `mongosh --port 27011` |
| `rs.initiate({ _id: 'book', members: [ {_id: 1, host: 'localhost:27011'}, … ] })` · `rs.status().ok` | Clase 14 slide 41 | ✓ | igual |
| `rs.secondaryOk` | *(no está en el material; era el paso habitual para leer de un secundario)* | (atención) ya no hace falta | `Mongo.setReadPref()` *(página de compatibilidad)* |

### 6 · `ObjectId` — lo inválido y lo que cambió

| Como está en el material | Dónde | Estado | Hoy |
| --- | --- | :---: | --- |
| `_id: ObjectId(7df78ad8902c)` *(12 hex, sin comillas)* | Clase 12 slides 38, 40, 42, 43, 44, 46 *(y `…902d`, `…902e`)* | ✗ **no corre en ninguna versión**: `SyntaxError` | `ObjectId("507f1f77bcf86cd799439011")` *(string de **24** hex)* — o, más simple, **omitir `_id`** y dejar que el driver lo genere, como hace el TP9 en todos sus inserts. El error viene copiado de tutorialspoint |
| `db.egresados.findOne()._id.toString()` → `ObjectId("5d712e759bec0f1238869a1a")` | Clase 14 slide 8 | ✗ **cambió**: es el comportamiento del shell legado | en `mongosh`, `toString()` devuelve el **hexadecimal a secas** *(manual, página `ObjectId`: `ObjectId("507f191e810c19729de860ea").toString()` → `507f191e810c19729de860ea` — verificado 16/09/2026)*. `valueOf()` y `getTimestamp()` siguen como en el slide |
| `ObjectId` de 12 bytes: 4 de timestamp + 5 aleatorios por proceso + 3 de contador | Clase 14 slide 8 *(prosa de la página)* | ✓ | igual *(manual, página `ObjectId`)* |

### 7 · El shell y el servicio

| Como está en el material | Dónde | Estado | Hoy |
| --- | --- | :---: | --- |
| `$ mongosh --host localhost --port 27017` · `$ mongosh` | Clase 14 slide 10 · TP9 p. 1 | ✓ | igual |
| `> help` con *"quit the **mongo** shell"*, `help mr` | Clase 14 slide 11 | ✗ es la ayuda del shell legado | en `mongosh`, `help` lista `use`, `show`, `exit`; los *helpers* son `db.help()`, `rs.help()`, `sh.help()` |
| `$ sudo service mongod start` / `stop` | Clase 14 slide 10 | ✓ en instalación nativa Linux | en Docker: `docker start Mymongo` / `docker stop Mymongo` |
| *"The MongoDB Shell (mongosh) is not installed with MongoDB Server"* | Clase 14 slide 10 *(captura de la documentación)* | ✓ para la instalación nativa | la imagen Docker **sí** trae `mongosh` |
| `use DATABASE_NAME` · `db` · `show dbs` · `db.dropDatabase()` · `db.createCollection("myCollection")` · `db.myCollection.drop()` | Clase 12 slides 35–37 · Clase 14 slides 12–13 | ✓ | igual. `use` dentro de un archivo `.js` **no es JavaScript válido**: en un script es `db = db.getSiblingDB('lab')` → [[Práctica 2026-09-15]] § Todo el TP en un script |

> [!note] Cuándo se retiró el shell `mongo` — verificado contra las notas de compatibilidad
> Las páginas de las Clases 12 y 14 y el concepto [[2.14.01 - mongosh y herramientas de línea de comando|mongosh]]
> afirman que `mongosh` reemplazó a `mongo` en 5.0 y que el binario `mongo` **dejó de distribuirse
> en 6.0**. Verificado el 18/09/2026 en el manual: *Compatibility Changes in MongoDB 5.0*
> § *Shell Changes* dice *"The mongo shell has been deprecated in MongoDB v5.0. The replacement
> shell is mongosh"*, y *Compatibility Changes in MongoDB 6.0* § *Legacy mongo Shell Removed* dice
> *"The mongo shell is removed from MongoDB 6.0. The replacement is mongosh"*
> *(`docs/v6.0/release-notes/6.0-compatibility/`)*. La página de compatibilidad de `mongosh`
> consultada el 16/09 confirma además la tabla de métodos deprecados.

---

## Lo que el material dice y ya no es cierto

Tres afirmaciones de la [[Clase 12 - Introduccion a NoSQL|Clase 12]] envejecieron, y las tres
pueden aparecer en el parcial:

| Afirmación del material | Dónde | Qué pasó después | Fuente verificada |
| --- | --- | --- | --- |
| *"No trata con datos críticos que requieren ACID"* *(NoSQL, en singular)* | Clase 12 slide 11 | **MongoDB tiene transacciones multi-documento desde 4.0** *(replica sets)* **y 4.2** *(clusters sharded)*. Lo que siempre valió y sigue valiendo es la **atomicidad por documento**: *"In MongoDB, an operation on a single document is atomic"* | manual, `core/transactions/` *(tabla de `featureCompatibilityVersion` mínima: Replica Set `4.0`, Sharded Cluster `4.2`)* — verificado 16/09/2026. *Seven Databases* A1 tabla 6 *(impresa 314, versión 3.6)* todavía dice `Transactions: No`; Corbellini § 6, p. 16: atomicidad por documento *(la frase «atomic» de la p. 15 es la de CouchDB)* |
| *"Puede trabajar en modo maestro-esclavo"* | Clase 12 slide 29 | La replicación *master-slave* fue **eliminada en 4.0**; lo que existe es el **replica set** *(primario + secundarios con elección automática)*, que es lo que la Clase 14 configura en su slide 41 | afirmado por las páginas de clase; Corbellini Table 6 *(p. 15)* ya lo tabulaba en 2016 como *"Replica Sets … o Master–Slave simple"* |
| `aggregate` devuelve `{ "result" : [ … ], "ok" : 1 }` | Clase 12 slide 47 | Desde **2.6** devuelve un cursor | afirmado por las páginas de clase *(es la evidencia más precisa de la edad de las capturas del deck 12)* |

> [!warning] Y dos límites que el material trae bien, verificados en el manual
> *"El tamaño máximo del documento BSON es de 16 megabytes"* y *"no admite más de 100 niveles de
> anidamiento"* *(Clase 13, slide 6)*: el manual dice **16 mebibytes** y **100 levels of nesting**
> *(*"Each object or array adds a level"*)*, y remite a **GridFS** para archivos mayores *(página
> `reference/limits/`, verificada 16/09/2026)*. Los 16 MB están en Corbellini § 6 *(p. 15)*; los 100
> niveles **no están en ninguna fuente del vault** → `—` en el mapeo de bibliografía.

---

## Replica set y sharding — los comandos exactos del deck 14

Es el único bloque del material con comandos de administración. El TP9 Parte I **no lo usa**
*(corre contra un solo `mongod`)*; queda aquí por si la Parte II o el parcial lo piden. La teoría
está en [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal — sharding y replicación]].

### Replica set de tres nodos *(Clase 14, slide 41 — del libro, impresas 124–125)*

> [!quote] Slide 41, textual
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

Versión ejecutable hoy *(un solo cambio: `mongo` → `mongosh`)*:

```bash
mkdir ./mongo1 ./mongo2 ./mongo3
mongod --replSet book --dbpath ./mongo1 --port 27011  # una terminal por nodo
mongod --replSet book --dbpath ./mongo2 --port 27012
mongod --replSet book --dbpath ./mongo3 --port 27013
mongosh localhost:27011
```

```javascript
rs.initiate({ _id: 'book', members: [
  {_id: 1, host: 'localhost:27011'},
  {_id: 2, host: 'localhost:27012'},
  {_id: 3, host: 'localhost:27013'} ] })
rs.status().ok  // 1 si el set funciona; rs.status() completo muestra PRIMARY / SECONDARY
```

| Paso | Qué hace |
| --- | --- |
| tres `--dbpath` distintos | tres `mongod` no pueden compartir directorio de datos |
| `--replSet book` en los tres | el nombre del set; debe coincidir con el `_id` de `rs.initiate` |
| `rs.initiate` desde cualquier nodo | configura el set; los tres negocian quién es **PRIMARY** *(la captura del slide 42 muestra que salió `27012`, no el primero de la lista)* |
| **tres** y no dos | la elección necesita **mayoría estricta**: el libro desarrolla los casos de 5 nodos *(partición 3–2)* y 4 *(partición 2–2, sin mayoría en ningún lado)*. Número impar o un árbitro *(`arbiterOnly: true`)* → *Seven Databases* impresas 126–127, § *The Problem with Even Nodes* y recuadro *Voting and Arbiters*; hay una contradicción del libro sobre el caso de 2 nodos, registrada en [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] § Dudas abiertas |

> [!note] En Docker, el replica set del slide es otra cosa
> El `docker run` del TP levanta **un** `mongod` sin `--replSet`. Reproducir el slide 41 en Docker
> exige tres contenedores en una misma red y hosts que se resuelvan entre sí; no está en el
> material y esta página no lo desarrolla. Las **transacciones multi-documento** requieren un
> replica set, así que con el contenedor del TP tal cual **no se pueden probar** *(ampliación
> propia)*.

### Sharding — un slide, sin comandos

> [!quote] Clase 14, slide 44, textual
> *"One of the core goals of Mongo is to provide safe and quick handling of very large datasets. The
> clearest method of achieving this is through horizontal sharding by value ranges - or just
> sharding for brevity."* · *"mongoDB: allows sharding from version 1.6"* ·
> `https://docs.mongodb.com/manual/sharding/` · *"Seguir el ejemplo, de la pag. 127"*

El deck no escribe ni un comando de sharding; delega en *Seven Databases* § *Sharding* *(impresas
127–130)*. Las piezas, para poder leer ese capítulo y el handout:

| Pieza | Qué es | Dónde asoma en el material |
| --- | --- | --- |
| **shard** | un `mongod` *(en producción, un replica set)* que guarda **una parte** de los datos | Clase 12 slide 30: cuatro `mongod` con rangos `0…25` · `26…50` · `51…75` · `76…100` |
| **shard key** | el campo por cuyo valor se reparte, por rango o por hash | handout *Diferencia_Sharding_Replication*: *"Se usa una shard key para distribuir los datos"* |
| **`mongos`** | el *query router*: el cliente se conecta a él | Clase 12 slide 31 *("Controlador de particionamiento")* · Clase 14 slides 30 y 37 |
| **config servers** | guardan el mapa rango → shard | handout: *"Se requiere un mongos (query router) y config servers para coordinar"*; la Clase 12 los omite |
| `sh.help()` · `sh.addShard` · `sh.enableSharding` · `sh.shardCollection` | los *helpers* del shell | solo el `sh.help()` del `help` del slide 11 |

> [!tip] En una frase, para el parcial *(del handout, transcrito en la Clase 14)*
> **Replicación copia; sharding reparte.** Replica set = los mismos datos en varios nodos →
> alta disponibilidad y *failover* automático. Sharding = datos distintos en varios nodos →
> escalabilidad horizontal. *"En sistemas grandes, ambos se pueden combinar: shards que sean
> replica sets"* — la topología real es N shards × M réplicas.

---

## Bibliografía de MongoDB

> [!success] Es el motor mejor cubierto por la bibliografía obligatoria
> A diferencia de MySQL *(que no tiene libro en el vault)* y de Cassandra *(que no está en ninguna
> edición de *Seven Databases*)*, MongoDB tiene un capítulo entero del libro de la cátedra y una
> sección del paper. Verificado contra las fichas de `raw/Material_Catedra/bibliografia/`.

### *Seven Databases in Seven Weeks*, 2ª ed. — cap. 4 MongoDB *(impresas 93–133; PDF 106–146, offset +13)*

| Sección | Impresas | Qué cubre de la cursada |
| --- | --- | --- |
| Hu(mongo)us | 93–94 | presentación del motor |
| **Day 1: CRUD and Nesting** | **94–110** | recorrido guiado del TP9: § *Command-Line Fun* 95–98 · § *Digging Deep* 100–104 *(`elemMatch`, `Boolean Ops`)* · § *Updating* 104–106 · § *References* 106–107 *("Mongo isn't built to perform joins")* · § *Deleting* 107–108 · § *Reading with Code* 108–109 |
| **Day 2: Indexing, Aggregating, Mapreduce** | **110–123** | § *Indexing* 110–114 *(experimento del slide 29; `explain("executionStats")` 111–112)* · § *Aggregated Queries* 115–117 *(pipeline, `$group`)* · § *Server-Side Commands* 117–119 *(`system.js`, slide 38)* · § *Mapreduce (and Finalize)* 119–123 *(slides 35–37)* |
| **Day 3: Replica Sets, Sharding, GeoSpatial, and GridFS** | **124–132** | § *Replica Sets* 124–127 *(slide 41; § *The Problem with Even Nodes* 126–127)* · § *Sharding* 127–130 · § *GeoSpatial Queries* 130–131 *(no se dicta)* · § *GridFS* 131–132 |
| Wrap-Up | 132–133 | *Mongo's Strengths* / *Weaknesses* 133 — para el "cuándo elegirlo" del TPO |

> [!warning] El libro está escrito contra **MongoDB 3.6** y con el shell `mongo`
> Ficha, Apéndice A1 *(impresa 311)*: las versiones tabuladas son las de 2018, MongoDB **3.6**. El
> libro usa `insert()`, `ensureIndex`, `mongo localhost:27011` y el dominio `docs.mongodb.com`
> —exactamente lo que los decks heredan—. **No trae `$lookup`** *(cero ocurrencias en el cap. 4)*,
> ni `createView`, ni transacciones multi-documento *(A1 tabla 6, impresa 314: `Transactions: No`)*,
> ni `mongosh`. Los `4.N` con que a veces se citan sus bloques son una convención de la ficha, no
> numeración del libro: se cita **por título de sección y página impresa**.

### Corbellini et al. (2017) — § 6 *Document-oriented databases* *(pp. 14–16)*

| Qué | Dónde |
| --- | --- |
| Documentos semiestructurados, *schemaless*, JSON que evoluciona; *"no hay diseño de referencia"* para el género | § 6, pp. 14–15 |
| MongoDB: **BSON y su límite de 16 MB**, **GridFS**, el router que el paper llama *"Mongo"*, `find()` y cursores, MapReduce, **replica sets**, **operaciones atómicas por documento**, y que **no tiene MVCC** | § 6, pp. 15–16 *(sin subsección numerada: se cita `Corbellini § 6, p. 15`)* |
| Comparación CouchDB · MongoDB · Terrastore · RavenDB en las siete dimensiones | Table 6, p. 15 |
| MongoDB en **AP y CP** a la vez *(configurable)* — contra el slide 18 de la Clase 12, que lo pone solo en CP | Table 2, p. 5 |
| Sharding y replicación como mecanismos ortogonales | § 1, p. 2; § 3.3, p. 7 |

### Lo que el material nombra y **no tiene ficha**

| Fuente | Quién la nombra | Estado |
| --- | --- | --- |
| ***Practical MongoDB Aggregations*** (Paul Done) — `https://www.practical-mongodb-aggregations.com/` | Clase 14, slide 32 | **Sin ficha** en `raw/Material_Catedra/bibliografia/`. Es el único libro que un deck de la semana nombra explícitamente; gratuito en línea. Decisión del humano si se archiva → § *Dudas abiertas* |
| *"[2004] MapReduce: Simplified Data Processing on Large Clusters"* (Dean y Ghemawat) | Clase 14, slide 35 | Sin ficha; paper de Google, referenciado como origen del modelo |

### Documentación oficial — las URLs exactas que trae el material

| URL, tal como está en el material | Dónde | Estado hoy |
| --- | --- | --- |
| `https://docs.mongodb.com/manual/reference/method/ObjectId/` | Clase 14 slide 9 | redirige a `www.mongodb.com/docs/manual/reference/method/ObjectId/` *(consultada 16/09/2026: confirma los 12 bytes y el `toString()` hexadecimal)* |
| `https://docs.mongodb.com/manual/core/index-single/` | Clase 14 slide 29 | redirige al mismo path bajo `www.mongodb.com/docs/` |
| `https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/` | Clase 13 slide 25 *(y *Seven Databases* impresa 115, nota 3)* | ídem |
| `https://docs.mongodb.com/manual/sharding/` | Clase 14 slide 44 | ídem |
| `https://www.mongodb.com/docs/manual/reference/` | Clase 14 slide 45 *(cierre)* | el dominio actual |
| `https://www.mongodb.com/products/tools/compass` | TP9 p. 1 | — |
| `https://robomongo.org/download` | TP9 p. 1 | — |
| `https://db-engines.com/en/system/MongoDB` | Clase 14 slide 2 | — |
| `https://media.pragprog.com/titles/pwrdata/code/mongo/{distinctDigits,map1,reduce1}.js` | Clase 14 slide 36 | código de la 2ª ed. del libro *(`pwrdata`)* |

Páginas del manual que **esta página** usó para verificar, y que el material no cita:

| Página | Para qué |
| --- | --- |
| `https://www.mongodb.com/docs/mongodb-shell/reference/compatibility/` § *Deprecated Methods* | la tabla de § *1 · CRUD*: `count`, `insert`, `remove`, `save`, `update`, `copyTo`, `DBQuery.shellBatchSize`, `rs.secondaryOk` |
| `https://www.mongodb.com/docs/manual/reference/command/mapReduce/` | *"Starting in MongoDB 5.0, map-reduce is deprecated"* |
| `https://www.mongodb.com/docs/manual/core/transactions/` | 4.0 / 4.2 y la atomicidad por documento |
| `https://www.mongodb.com/docs/manual/reference/method/db.createView/` | firma, solo lectura, sin `$out`/`$merge` en la vista |
| `https://www.mongodb.com/docs/manual/reference/limits/` | 16 MiB · 100 niveles |
| `https://www.mongodb.com/docs/manual/reference/method/js-collection/` | `ensureIndex` ausente de la lista |
| `https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/` | `$lookup` como *left outer join*, `from`/`localField`/`foreignField`/`as` |
| `https://hub.docker.com/_/mongo` | `latest` = 8.3.11 el 16/09/2026 |

---

## Lo que es propio de MongoDB y no está en ningún deck

> [!note] Ampliación, no está en el material
> Estas ocho cosas no las dice ningún slide ni el TP, pero aparecen apenas se ejecuta. Las que
> tienen fuente verificada la citan; las demás son razonamiento propio. **Confirmar antes de
> usarlas en el parcial.**

1. **`db.version()` y `version()`** — la primera devuelve la versión del servidor; la segunda, la
  del shell. Sin versión fijada por la cátedra, es lo primero que se anota en la entrega.

2. **Sin `$set`, `updateOne` reemplaza el documento entero.** El slide 25 de la Clase 14 lo marca
  en rojo y el paso 17 del TP9 lo dice en prosa. `updateOne({name: "Portland"}, {state: "OR"})`
  deja a Portland con **un solo campo** más `_id`.

3. **`use lab` no crea nada** hasta el primer documento insertado *(paso 2 del TP9)*.
  `db.dropDatabase()` borra la base actual sin nombrarla ni pedir confirmación: mirar `db` antes.

4. **`_id` es el único *constraint* declarativo, y el índice único el segundo.** No hay `NOT NULL`,
  `CHECK` ni claves foráneas; `createIndex({name: 1}, {unique: true})` es lo más cercano a
  `UNIQUE`. Existe `$jsonSchema` *(desde 3.6)*, que ningún deck ni TP toca. Contraste con
  [[1.09.01 - Restricciones de integridad|Restricciones de integridad]].

5. **`$lookup` y `$unwind` hacen falta para la consigna complementaria y no están en el deck 14.**
  `$lookup` está en la Clase 12 *(slide 49)* y en la 13 *(slide 23)*; `$unwind` solo se nombra en
  el slide 21 de la Clase 13, sin desarrollo → [[2.12.08 - Aggregation pipeline|Aggregation pipeline]].

6. **Las vistas son de solo lectura y no admiten `$out`/`$merge` en su pipeline** *(manual,
  `db.createView`)*. El ejercicio 10 del TP9 pide una vista sin haberla enseñado; el "cómo" está
  en la Clase 12 *(slides 50–52)* y en [[1.06.01 - Vistas|Vistas]] § Vistas en MongoDB.

7. **`new Date(año, mes, día)` toma el mes desde 0.** Los 12 inserts del TP9 escriben el mes
  1-based, así que los `dob` quedan un mes corridos en el motor → [[Práctica 2026-09-15]] § Paso 7.

8. **Transacciones multi-documento: existen desde 4.0, pero exigen un replica set.** Con el
  `mongod` único del TP **no se pueden ejecutar**: `session.startTransaction()` falla fuera de un
  replica set *(razonamiento propio a partir del manual, no está en el material)*.

### Cómo averiguar lo que el deck no enseña

```javascript
db.version()  // versión del servidor
db.getCollectionNames()  // colecciones (y vistas) de la base actual — TP9 pasos 3 y 5
db.getCollectionInfos()  // distingue type: 'collection' de type: 'view'
db.players.getIndexes()  // índices de una colección — Clase 14 slide 28
db.players.stats()  // tamaño, cantidad de documentos, índices
db.players.find({...}).explain("executionStats")  // plan y ejecución real — Clase 13 slide 28
db.players.findOne  // sin paréntesis: imprime el código del método — TP9 NOTA, Clase 14 slide 20
```

---

## Dudas abiertas

- [ ] (crítico) ¿Qué versión de MongoDB toma la cátedra como referencia? *(deck: 6.0.5; `pull` sin
  tag: 8.3.11 el 16/09/2026; determina la forma de `explain()`, TP9 paso 34)*
- [ ] (crítico) ¿Se acepta la sintaxis legada en la entrega? *(`ensureIndex` pasos 30, 32, 33;
  `find().count()` paso 27; `insert`/`update`/`remove` en los tres decks)*
- [ ] (crítico) ¿Cómo quiere la cátedra que se responda "¿MongoDB soporta transacciones ACID?" —
  no *(slide 11 de la Clase 12, *Seven Databases* A1)* o sí desde 4.0/4.2 *(manual actual)*?
- [ ] (crítico) ¿`mapReduce` entra al parcial, o solo el aggregation pipeline?
- [ ] ¿En qué esquina de CAP se pone a MongoDB en el parcial? *(Slide 18 de la Clase 12: CP;
  Corbellini Table 2: AP y CP; *Seven Databases* impresa 127: CP)* → [[2.12.04 - Teorema CAP|Teorema CAP]]
- [ ] ¿Qué trae la Parte II del TP9 (22/09)? ¿Reutiliza `players` y `bandas`? Si sí, **no hacer
  `dropDatabase()`** al terminar la Parte I.
- [ ] ¿Se toman replica sets y sharding con comandos o solo como concepto?
- [ ] ¿`toString()` de `ObjectId` devuelve el hexadecimal a secas en la imagen de la cátedra?
  *(verificado en el manual, falta comprobarlo en el `mongosh` real)*
- [x] ¿Desde qué versión se retiró el binario `mongo`? **6.0**, confirmado en el manual
  *(verificado 18/09/2026)*.
- [ ] ¿La imagen `mongo` corre en UTC? Define cómo se guardan los `new Date(…)` del TP9.
- [ ] ¿Se archiva una ficha para *Practical MongoDB Aggregations*? Decisión del humano.
- [ ] ¿La consigna *ecommerce* se resuelve con el *aggregation pipeline builder* de Compass o vale
  `mongosh`?
- [ ] ¿Se dicta algo de GridFS, geoespacial o `$jsonSchema`? *(el dataset `hospitales` del slide 33
  de la Clase 14 es GeoJSON)*
- [ ] ¿Qué versiones de `mongosh` y de las Database Tools trae la imagen 8.3? *(a verificar con
  `mongoimport --version` dentro del contenedor)*

## Enlaces

- Motor de la primera mitad: **[[MySQL]]** *(el `ON DUPLICATE KEY UPDATE` del TP7 vs. el upsert del
  paso 20 del TP9; el `EXPLAIN` del TP5 vs. `explain()`)* · motor del material relacional:
  [[PostgreSQL]] *(estos decks **no** entran en su inventario)* · próximos motores:
  [[Cassandra]] *(28/09)* · [[Neo4j]] · [[Redis]] · [[DynamoDB]]
- Setup y TPs: [[Práctica 2026-09-15]] *(TP9 Parte I — setup, 34 pasos, 11 ejercicios)* ·
  [[Práctica 2026-08-04]] *(Docker, la misma mecánica con `mysql:9.7.2`)* · [[Docker]] ·
  índice de enunciados en `raw/tp/_index.md`
- Clases del motor *(lunes 14/09)*: [[Clase 12 - Introduccion a NoSQL]] *(por qué NoSQL, CAP, BASE,
  géneros; MongoDB desde el slide 29, API legada)* · [[Clase 13 - NoSQL-EmbebidosVSNormalizado]]
  *(embebido vs. referencias, `$lookup`, `explain`)* · [[Clase 14 - MongoDB Features]] *(`mongosh`,
  CRUD, índices, pipeline, MapReduce, replica sets, sharding, más los cuatro handouts)*
- Conceptos de la Unidad-02: [[2.12.01 - NoSQL — origen, propiedades y taxonomía|NoSQL]] ·
  [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Sharding y replicación]] ·
  [[2.12.03 - Persistencia políglota|Persistencia políglota]] · [[2.12.04 - Teorema CAP|Teorema CAP]] ·
  [[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]] ·
  [[2.12.06 - Modelo de documentos — JSON, BSON y ObjectId|Modelo de documentos]] ·
  [[2.12.07 - CRUD y consultas en MongoDB|CRUD y consultas]] ·
  [[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
  [[2.13.01 - Documentos embebidos vs. referencias|Embebidos vs. referencias]] ·
  [[2.13.02 - Relaciones 1:1, 1:N y N:M en MongoDB|Relaciones en MongoDB]] ·
  [[2.14.01 - mongosh y herramientas de línea de comando|mongosh y herramientas]] ·
  [[2.14.02 - Índices en MongoDB|Índices en MongoDB]] · [[2.14.03 - MapReduce|MapReduce]]
- Conceptos relacionales que este motor relee desde el otro lado: [[1.06.01 - Vistas|Vistas]]
  *(§ Vistas en MongoDB)* · [[1.08.01 - Plan de ejecución|Plan de ejecución]] *(§ `explain()`)* ·
  [[1.08.02 - Índices|Índices]] · [[1.09.01 - Restricciones de integridad|Restricciones de integridad]] ·
  [[1.11.03 - Transacciones y ACID|Transacciones y ACID]] *(el contraste del slide 11 de la Clase 12)*
- Calendario: [[_cronograma]] · índice de clases: [[_index-clases]] · bibliografía:
  [[_index-bibliografia]] › Clases 12, 13 y 14
