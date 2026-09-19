---
tipo: teorica
clase: 12
deck: "BD2_Clase 12 - Introduccion a NoSQL.pdf"
unidad: 2
tema: "Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción a MongoDB · MongoDB: Enfoque embebido vs Normalizado · Ejemplos con MongoDB"
resumen: "Origen y propiedades de NoSQL, teorema CAP, BASE y los cuatro géneros, más una introducción a MongoDB: arquitectura, CRUD en el shell, operadores, $group, $lookup y vistas. La mitad conceptual no envejeció; la de código usa la API vieja del shell mongo y hay que leerla traducida a mongosh."
fecha: 2026-09-14
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 12
  - Clase 12 — Introducción a NoSQL
  - Introduccion a NoSQL
  - Introducción a Bases de Datos NoSQL
  - Taxonomía NoSQL
  - Introducción a MongoDB
fuentes:
  - "raw/Unidad-02/Teorica/BD2_Clase 12 - Introduccion a NoSQL.pdf"
estado: procesado
---

# Clase 12 — Introducción a las bases de datos NoSQL

> [!info] Fuente
> `raw/Unidad-02/Teorica/BD2_Clase 12 - Introduccion a NoSQL.pdf` · **52 slides** · PowerPoint 2010,
> título interno del archivo *"Introducción a Bases de Datos NoSQL"*.
> El slide 1 es la **portada**; el recorrido de abajo arranca en el 2 y llega al 52, que es el último
> ejemplo de vistas. **No hay slide de agenda, no hay slide de cierre ni de "preguntas", y no hay
> slide de bibliografía** *(la [[Clase 09 - Restricciones integridad-Parte 1]] tenía uno; la
> [[Clase 10 - Restricciones integridad-Parte 2]] cerraba con dos links; éste termina en seco)*.
> Dictado en la **teórica del lunes 14/09**, junto con las dos clases hermanas
> [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] y [[Clase 14 - MongoDB Features]]: **tres decks
> numerados para una sola fila del [[_cronograma]]**, la del 14/09, cuyo tema oficial es *"Introducción
> a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción a MongoDB · MongoDB: Enfoque
> embebido vs Normalizado · Ejemplos con MongoDB"*. El `12` del nombre del archivo **es el número de
> clase**: la cátedra numera sus decks y ésa es la única numeración de clases que existe.
> Clase anterior: [[Clase 11 - Seguridad-Transacciones]] *(del 07/09, la última de la mitad relacional)*.
> Se practica con el **TP 9 MongoDB Parte I** del martes 15/09 → [[Práctica 2026-09-15]].
> Bibliografía: [[_index-bibliografia]] › Clase 12.

> [!success] 🎯 Es el **primer archivo de `raw/Unidad-02/`**, y con él se cierran dos previsiones a la vez
> Hasta el 08/09, `raw/Unidad-02/` estaba vacía y la `Unidad-01` había absorbido **once clases y ocho
> TPs**. [[_index-clases]] y [[_cronograma]] § *Unidades* preveían que NoSQL/MongoDB caería en una
> **`Unidad-05`**. **Falló**: el humano archivó las Clases 12, 13 y 14 y el TP9 en **`Unidad-02`**.
> Es la **séptima** previsión de unidad puesta a prueba y la **sexta** que falla, y falla igual que
> las cinco anteriores: yo esperaba una unidad que el material no usa.
>
> Lo que **sí** se confirmó, y por primera vez con evidencia de corte y no solo de acumulación, es la
> hipótesis alternativa que [[_index-clases]] dejaba anotada desde el 25/08: *"la `Unidad-01` es «todo
> lo relacional» y el corte va a caer recién en NoSQL"*. La Clase 11 (seguridad y ACID, 07/09) fue a
> `Unidad-01`; la Clase 12 (NoSQL, 14/09) fue a `Unidad-02`. **El corte cayó exactamente entre la
> mitad relacional y la mitad NoSQL.** La unidad sale del path, no de la expectativa — y el path,
> esta vez, tenía una lógica legible.
>
> Consecuencia para los nombres de concepto: los conceptos que nacen en este deck llevan prefijo
> **`2.12.NN`** *(unidad 2, clase 12)*, no `5.12.NN`.

> [!warning] 🔴 Motor: el deck es de **MongoDB** —el motor correcto de esta mitad— pero escrito en la **API vieja del shell `mongo`**
> Con esta clase el vault deja de traducir de PostgreSQL a [[MySQL]] y empieza a traducir de
> **[[MongoDB]] viejo a MongoDB actual**. Es un desfasaje de **versión**, no de motor, pero muerde
> igual: el **TP9** ([[Práctica 2026-09-15]]) manda a usar **`mongosh`** —el shell que reemplazó a
> `mongo` en la versión 5.0 (2021) y que **marca como deprecados los helpers viejos** *(`insert`,
> `update`, `remove`, `count` siguen ejecutándose, pero con `DeprecationWarning`)*— y trabaja con
> `insertOne`, `deleteMany` y `getCollectionNames`. Evidencia textual de este deck, slide por slide:
>
> | Lo que escribe el deck | Dónde | Qué pasa hoy en `mongosh` |
> | --- | --- | --- |
> | `db.myCollection.insert({…})`, `db.mycol.insert({…})`, `db.post.insert([…])`, `db.users.insert(…)` | slides **32, 37, 38, 39** | `insert()` está **deprecado desde 3.2**; en `mongosh` **sigue ejecutándose con `DeprecationWarning`** → `insertOne()` / `insertMany()` |
> | `db.users.count()` · `db.users.find().count()` | slide **32** | `count()` deprecado → `countDocuments()` / `estimatedDocumentCount()` |
> | `db.users.update({…}, {$set: …}, {multi: true})` | slide **32** | `update()` deprecado → `updateMany()` *(el `{multi:true}` es justamente lo que `updateMany` reemplaza)* |
> | `db.users.remove({…})` | slide **32** | `remove()` deprecado → `deleteMany()` / `deleteOne()` |
> | `ObjectId(7df78ad8902c)` | slides **38, 40, 42, 43, 44, 46** | **No corre en ninguna versión**: `ObjectId` toma un *string* de **24** dígitos hexadecimales entre comillas; esto son 12 sin comillas → `SyntaxError` |
> | `aggregate(…)` que devuelve `{ "result" : [ … ], "ok" : 1 }` | slide **47** | Es el formato de salida **anterior a MongoDB 2.6** (2014): desde entonces `aggregate` devuelve un **cursor**, y el shell imprime los documentos sueltos |
> | *"Puede trabajar en modo **maestro-esclavo**"* | slide **29** | La replicación *master-slave* fue **eliminada en 4.0** (2018); lo que existe son los **replica sets** *(que el propio slide 30 dibuja sin nombrarlos)* |
> | `find().pretty()` | slides 40, 41, 44 | Sigue existiendo, pero en `mongosh` es un *no-op*: la salida ya viene formateada |
>
> Lo que **sí** está vigente tal cual: `use`, `db`, `show dbs`, `db.dropDatabase()`,
> `db.createCollection()`, `drop()`, `find()`, los operadores `$lt`/`$lte`/`$gt`/`$gte`/`$ne`,
> `$and`/`$or`, `sort()`, `aggregate` con `$group`/`$sum`, **`$lookup`** *(3.2+)* y
> **`db.createView`** *(3.4+)*. O sea: **la mitad conceptual del deck (2–31) no envejeció; la mitad
> de código (32–52) hay que leerla con la tabla de arriba al lado.** La traducción completa va a
> vivir en [[MongoDB]].
>
> Y hay un rastro de **motor relacional ajeno** metido en el único `CREATE TABLE` del deck: el
> **slide 32** escribe `id MEDIUMINT NOT NULL AUTO_INCREMENT` *(MySQL)* **y** `age Number` *(Oracle)*
> **en la misma sentencia**. No es un error de la cátedra: es una copia literal del *SQL to MongoDB
> Mapping Chart* de la documentación oficial de MongoDB, que ya viene así. Ver § *Slide 32*.

> [!note] El deck es **casi todo imagen**, y la capa de texto engaña
> `pdfimages -list`: **39 imágenes embebidas**. Tres son adornos de la portada; las otras **36 están
> repartidas en 33 slides** *(el 48, el 50 y el 51 llevan dos cada uno)*. Los **18 slides restantes**
> son texto vivo: 2, 3, 4, 10, 11, 12, 14, 15, 16, 17, 20, 22, 26, 31, 35, 36, 37 y 45. `pdftotext`
> devuelve **929 palabras** para las 52 páginas, y de la segunda mitad del deck *(32–52)* recupera
> **solo los títulos**, los comentarios *"En SQL: …"* y los comandos de los **cuatro slides de texto
> vivo** *(35, 36, 37 y 45)*: **el código de los otros 17 slides de ejemplos está en captura de
> pantalla**, igual que la tabla de comparación del 32, el diagrama E-R
> del 33, el diagrama de Venn de CAP (13 y 18), la taxonomía (21), los cuatro ejemplos de géneros
> (23, 24, 25, 27) y la tabla *SQL vs. NoSQL* del 28. Todo lo que sigue sale de haber mirado los 52
> PNG renderizados, no del `.txt`.

> [!important] 🎯 Qué relación tiene este deck con las dos clases hermanas del mismo lunes
> Los tres decks del 14/09 se reparten la fila del cronograma **sin superponerse**:
>
> | Tramo del tema oficial | Deck | Qué cubre |
> | --- | --- | --- |
> | *"Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL"* | **éste, slides 2–28** | por qué surge, propiedades, CAP, BASE, los cuatro géneros, SQL vs. NoSQL |
> | *"Introducción a MongoDB"* | **éste, slides 29–52** | características, arquitectura, CRUD, operadores, `aggregate`, `$lookup`, vistas |
> | *"MongoDB: Enfoque embebido vs Normalizado"* | [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] | embeber vs. referenciar, el límite de 16 MB y los 100 niveles |
> | *"Ejemplos con MongoDB"* | [[Clase 14 - MongoDB Features]] + el material complementario | `_id`/`ObjectId`, features, sharding vs. replication, MapReduce, consigna de e-commerce |
>
> Los **slides 33–34** de este deck *(el E-R de `post`/`comments`/`tag_list` convertido en un solo
> documento con arreglos embebidos)* son **la introducción de una página** al tema que el deck 13
> desarrolla en 28 slides. Conviene leerlos como puente.

---

## Resumen

El deck abre la segunda mitad de la cursada y cambia el eje del vault: durante once clases la pregunta
fue *"cómo se hace esto en SQL"*; a partir de aquí la pregunta es **"qué motor conviene para este
problema"**, que es el objetivo declarado del programa —*"aprender a tomar buenas decisiones a la hora
de elegir una base de datos para resolver un problema concreto"*— y que la [[Práctica 2026-08-04]] ya
había adelantado bajo el nombre de **persistencia políglota**.

Se arma en tres bloques de tamaño muy desigual:

1. **Qué es NoSQL y por qué existe** *(slides 2–11)*. Origen (web en tiempo real, volúmenes grandes),
   cinco motivos por los que el relacional no alcanza, definición negativa del modelo no relacional,
   cuatro propiedades ilustradas *(sin esquema, velocidad, distribución, escalabilidad horizontal)*,
   seis ventajas y cuatro desventajas.
2. **El marco teórico: CAP y BASE** *(slides 12–20)*. El teorema de Brewer enunciado, cada letra
   definida en un slide, las tres combinaciones *CP / AP / CA*, la clasificación de motores en el
   triángulo, y BASE como el contrapeso de ACID.
3. **La taxonomía y MongoDB** *(slides 21–52)*. Los cuatro géneros con un slide de definición y uno
   de ejemplo cada uno *(grafos, familia de columnas, clave-valor, documentos)*, el cuadro *"¿Cuándo
   usar SQL o NoSQL?"*, y después **24 slides de MongoDB**: características, auto-sharding,
   arquitectura *(mongod / mongos / GridFS)*, la tabla de equivalencias SQL ↔ MongoDB, la migración de
   un E-R a un documento, y un recorrido de shell: bases, colecciones, `insert`, `find`, operadores de
   comparación, `$and`/`$or`, `sort`, `aggregate` con `$group`, `$lookup` y vistas.

| Bloque | Qué establece | Slides |
| --- | --- | --- |
| **Portada** | *"Introducción a Bases de Datos NoSQL"* | 1 |
| **Introducción** | Surge por exceso de datos, indexado de documentos, web en tiempo real | 2 |
| **Por qué surgen** | Cinco motivos: eficiencia, lecturas/escrituras, transacciones, sentencias, escalabilidad | 3 |
| **Modelo no relacional** | Definición por negación: no cumple E-R, no impone estructura, formatos distintos | 4 |
| **Motores conocidos** | Siete logos: CouchDB, Redis, Neo4j, Cassandra, MongoDB, membase, riak | 5 |
| **Propiedades** | Sin esquema *(join materializado en JSON)* · velocidad · distribución *(hash → nodo)* · escalabilidad *(vertical ✗ / horizontal ✓)* | 6–9 |
| **Ventajas / desventajas** | Escalabilidad horizontal, clusters baratos / inmadurez, sin ACID, compatibilidad | 10–11 |
| **Teorema CAP** | Enunciado, C, A, P, las tres combinaciones, Venn con motores | 12–18 |
| **BASE** | *Basically Available · Soft-State · Eventual Consistency*; ACID sacrifica disponibilidad, BASE sacrifica consistencia | 19–20 |
| **Taxonomía** | Cuatro categorías con tres logos cada una | 21 |
| **Grafos** | Nodos, *"ya está normalizada"*, Neo4j, HyperGraphDB; ejemplo de red social | 22–23 |
| **Familia de columnas** | Almacenamiento por columnas; fila vs. columna con multivalor y null | 24 |
| **Clave-valor** | Duplas, contenedores, validación en el cliente; tabla hash | 25 |
| **Documentos** | Clave → documento, sin esquema estricto, campos distintos; Pepe y María | 26–27 |
| **¿Cuándo SQL o NoSQL?** | Volumen, previsibilidad del proceso, picos de uso | 28 |
| **MongoDB** | Seis características; auto-sharding + replicación; mongod / mongos / GridFS | 29–31 |
| **SQL ↔ MongoDB** | Tabla de ocho equivalencias | 32 |
| **Migrar SQL → NoSQL** | E-R de blog → un documento con `tags[]` y `comments[]` | 33–34 |
| **Shell: bases y colecciones** | `use`, `db`, `show dbs`, `dropDatabase`, `createCollection`, `drop` | 35–37 |
| **Inserción** | Un documento, varios documentos con arreglo y comentario embebido | 38–39 |
| **Consultas** | `find().pretty()`, seis operadores de comparación, `$and`, `$or`, ambos, `sort` | 40–45 |
| **Agregación** | Tres documentos → `$group` + `$sum` = `GROUP BY` | 46–47 |
| **`$lookup`** | Dos colecciones → *join* en el pipeline | 48–49 |
| **Vistas** | `createCollection` con `viewOn` · `createView`; ejemplo `survey` → `managementFeedback` | 50–52 |

> [!important] 🎯 Lo que este deck **no** trae, y conviene saberlo antes de buscarlo
> - **Ni una versión de MongoDB.** No dice qué versión usa, y la sintaxis delata una anterior a 2.6
>   *(ver el callout de motor)*. La [[Clase 14 - MongoDB Features]] sí trae número de versión.
> - **Ni una definición de "documento", "colección" ni "BSON"** más allá de nombrarlos: el slide 26
>   dice que los datos van *"en documentos"* y el 29 que MongoDB está *"basada en esquemas BSON"*. Qué
>   es un `ObjectId`, qué es `_id`, cuánto puede pesar un documento: todo eso está en los decks 13 y 14.
> - **Ni `insertOne`, ni `updateOne`, ni `deleteOne`**: la API con la que el TP9 hace trabajar.
> - **Ni índices en MongoDB** *(el slide 29 dice "soporte de índices" y no vuelve sobre el tema)*, ni
>   *replica sets* por su nombre, ni *MapReduce*, ni `$match`/`$project` dentro del pipeline *(salvo
>   el `$project` del ejemplo de vistas, slide 51)*.
> - **Ni una palabra sobre transacciones en MongoDB.** El slide 11 dice que NoSQL *"no trata con datos
>   críticos que requieren ACID"* y lo deja ahí. Ver § *Contradicciones* y § *Dudas abiertas*.

---

## Slide 1 · La portada

> [!quote] Textual, completo
> *"**Introducción a Bases de Datos NoSQL**"*
> *"Bases de Datos II"*

Fondo azul del tema *"Flujo"* de PowerPoint 2010 y logo del ITBA. **Es una plantilla distinta de la
de los decks 01–11** *(aquéllos usaban el fondo blanco con banda superior; éste usa el tema con la onda
celeste en todos los slides)*. No es un dato menor: sugiere **otra autoría u otra época** para el
material NoSQL, y es coherente con que el código sea de una versión vieja de MongoDB.

**Sin subtítulo, sin fecha, sin nombre de docente.**

## Slide 2 · Introducción

> [!quote] Textual
> - *"Surge para perfeccionar las BD con exceso de datos, que necesitan un gran indexado de documentos"*
> - *"Con el crecimiento de la web en tiempo real existía una necesidad de proporcionar información
>   procesada a partir de grandes volúmenes de datos"*

Dos viñetas y dos ideas: **volumen** *(exceso de datos, grandes volúmenes)* y **latencia** *(web en
tiempo real, información procesada)*. Es la misma motivación con la que abre
[[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini § 1]] *(pp. 1–4)*: los RDBMS no
alcanzaron para la escala web —terabytes por día, baja latencia—. El paper además da lo que el slide
no: **el origen del término**, acuñado por Carlo Strozzi en 1998 para otra cosa y resucitado en 2009
por Eric Evans para el sentido actual.

> [!note] *"gran indexado de documentos"* es una pista de qué género tiene en mente el deck
> De los cuatro géneros que va a presentar en el slide 21, la frase describe **al documental** *(y en
> particular a MongoDB, que es el que ocupa los últimos 24 slides)*. Un clave-valor puro no "indexa
> documentos"; un grafo tampoco. El deck se llama "Introducción a NoSQL" pero su primer slide ya está
> pensando en MongoDB.

## Slide 3 · Por qué surgen las bases NoSQL

> [!quote] Textual — los cinco motivos
> - *"Poca eficiencia en aplicaciones en las BD relacionales"*
> - *"Aumento de operaciones de lectura y escritura"*
> - *"Gran conjunto de transacciones"*
> - *"Sentencias complejas"*
> - *"Dificultades en la escalabilidad del sistema"*

Los cinco son **síntomas del mismo diagnóstico**: el relacional, tal como se lo dictó en la primera
mitad —esquema fijo, `JOIN`, transacciones ACID, un servidor—, **no escala horizontalmente sin
esfuerzo**. Conviene leerlos en pareja con los motivos que sí están fundamentados en la bibliografía:

| Motivo del slide | Qué hay detrás | Dónde se desarrolla |
| --- | --- | --- |
| *"poca eficiencia"*, *"sentencias complejas"* | los `JOIN` de un esquema normalizado se pagan en cada lectura; en un grafo, *"un join por arista"* | Corbellini § 7 *(p. 16)*; [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] |
| *"aumento de lectura y escritura"* | el cuello de botella es el **servidor único** → escalar hacia afuera | slide 9 de este deck; Corbellini § 1 *(Scalability)* |
| *"gran conjunto de transacciones"* | ACID sobre muchos nodos exige **2PC**, que multiplica la indisponibilidad | Corbellini § 3.2 *(pp. 5–7)* |
| *"dificultades en la escalabilidad"* | el relacional escala **verticalmente**; NoSQL, horizontalmente | slides 9–10 |

> [!warning] El slide hace un diagnóstico **sin decir contra qué escala**
> Ninguna de las cinco viñetas cuantifica nada. Corbellini § 8 *(pp. 19–20)* pone el matiz que este
> deck no pone: **en escala baja o media, un RDBMS alcanza** —*"no es el martillo de Maslow"*— y
> RDBMS y NoSQL son **complementarios, no competidores**. Lo mismo dice el cuadro del **slide 28** de
> este deck, pero recién veinticinco slides después. Para el parcial conviene tener las dos mitades
> del argumento: *por qué* NoSQL, y *cuándo no*.

**Detalle de redacción:** *"Poca eficiencia en aplicaciones en las BD relacionales"* — dos *"en"*
seguidos; se transcribe tal cual.

## Slide 4 · Modelo no relacional

> [!quote] Textual — la definición, por negación
> - *"Sistema de almacenamiento de información"*
> - *"No cumple con el esquema entidad-relación"*
> - *"No impone una estructura de datos"*
> - *"Almacena los datos en diferentes formatos"*

Cuatro viñetas, **tres de ellas negativas**. Es la definición que el propio nombre *"NoSQL"* impone:
se define por lo que no es. Lo que el slide llama *"esquema entidad-relación"* es el
[[1.02.02 - Modelo Entidad-Relación|MER]] de la Clase 02 más su derivación a tablas de la Clase 03
([[1.03.01 - Derivación de MER a esquema relacional|derivación]]): el modelo no relacional **no pasa
por esa etapa** de [[1.02.01 - Etapas del diseño de datos|diseño]] —o la pasa de otra forma, como va a
mostrar el slide 33 con un E-R que se convierte en **un solo documento**—.

> [!important] *"No impone una estructura de datos"* **no significa "sin estructura"**
> Es la afirmación que más malentendidos genera de todo el deck. Todos los ejemplos que siguen
> **tienen** estructura —el JSON del slide 6, los nodos y aristas del 23, las columnas del 24, las
> duplas del 25, los documentos del 27—: lo que **no hay** es una estructura **declarada de antemano
> y validada por el motor** *(el `CREATE TABLE` de la [[1.03.02 - DDL — creación y alteración de tablas|Clase 03]])*.
> La estructura se mueve **del motor a la aplicación**, y el slide 25 lo va a decir textualmente para
> clave-valor: *"validación de los datos en la aplicación cliente"*. Seven Databases cap. 1 § *The
> Genres* *(impresas 3–8)* lo formula como que cada género "se adapta a distintos tipos de problemas",
> no como ausencia de forma.

**"Almacena los datos en diferentes formatos"** es la única viñeta afirmativa, y anticipa el slide 21:
*columna, documento, clave-valor, grafo* son cuatro **formatos** distintos, no cuatro variantes de uno.

## Slide 5 · ¿Qué bases NoSQL conocen?

> [!quote] Textual
> *"Qué bases NoSQL conocen?"* *(sin el signo de apertura)*

Slide de participación: el título es una pregunta a la sala y el cuerpo es **una sola imagen** con
**siete logos**, dispuestos así:

| Posición | Logo | Género *(según el slide 21 y las fichas)* |
| --- | --- | --- |
| arriba izq. | **CouchDB** *(con el lema "relax")* | documental |
| arriba centro | **Redis** | clave-valor |
| arriba der. | **Neo4j** *("the graph database")* | grafos |
| centro der. | **Cassandra** *(con el ojo)* | familia de columnas |
| centro | **mongoDB** *(en grande, con la hoja)* | documental |
| abajo izq. | **membase** | clave-valor *(hoy Couchbase)* |
| abajo der. | **riak** | clave-valor |

**Cinco de los siete están en la cursada o en la bibliografía**: MongoDB, Cassandra, Neo4j y Redis se
dictan *(cronograma: 14/09 → 06/10, 19/10, 26/10, según [[_cronograma]])*; CouchDB está en el
programa y en Seven Databases cap. 5 pero **no se dicta**. Los otros dos son piezas de museo: **Riak**
fue eliminado de la 2ª edición de Seven Databases *(recuadro *No More Riak?*, impresa 5)* y
**membase** se fusionó en Couchbase en 2011. La imagen delata la fecha del material tanto como la
sintaxis del shell.

> [!tip] El slide es un buen ejercicio de clasificación
> Ninguno de los siete logos trae etiqueta de género. Ponérsela a cada uno —con la taxonomía del
> slide 21 y la Table 1 de Corbellini *(p. 3)*— es exactamente el tipo de pregunta que puede aparecer
> en el parcial y que este deck no responde en el mismo slide.

## Slides 6–9 · Propiedades

Cuatro slides con el mismo título, *"Propiedades"*, **una propiedad por slide y una imagen por
propiedad**. Las cuatro juntas son la definición positiva que el slide 4 no daba:

| Slide | Propiedad *(textual)* | Cómo la ilustra |
| --- | --- | --- |
| 6 | *"Ausencia de esquema en los registros de datos"* | dos tablas relacionales **+** un `=` **→** un documento JSON |
| 7 | *"Alta velocidad de respuesta a peticiones"* | cronómetro, un cilindro de base, flecha hacia un grupo de laptops |
| 8 | *"Estructura distribuida"* | tres datos → *función hash* → tres claves → nodos en una nube |
| 9 | *"Escalabilidad"* | *Vertical* ✗ vs. *Horizontal* ✓ |

### Slide 6 · Ausencia de esquema — el ejemplo, transcripto entero

**La imagen es una tabla doble que `pdftotext` no lee**, y contiene el único ejemplo relacional del
bloque conceptual. Transcripción completa:

**Info. Usuario**

| ID | Nombre | Apellido | Id_CArea |
| :---: | --- | --- | :---: |
| **1** | **Frank** | **Lara** | **2** |
| 2 | Ana | Guzmán | 3 |
| 3 | Pedro | López | 2 |

**+** **Info. Dirección**

| Id_CArea | Ciudad | Estado | Cod_Area |
| :---: | --- | --- | :---: |
| 1 | MBO | ZL | 0261 |
| **2** | **CCS** | **DC** | **0212** |
| 3 | LAS | NE | 0295 |

**=** *(el documento resultante, en una hoja con la esquina doblada)*:

```json
{
  "ID": 1,
  "Nombre": "Frank",
  "Apellido": "Lara",
  "Cod_Area": "0212",
  "Ciudad": "CCS",
  "Estado": "DC"
}
```

La fila **1** de *Usuario* y la fila **2** de *Dirección* están recuadradas en la imagen: son las dos
que el `=` combina. *(Los códigos son venezolanos: CCS/DC = Caracas, Distrito Capital, área 0212;
MBO/ZL = Maracaibo, Zulia, 0261; LAS/NE = La Asunción, Nueva Esparta, 0295. Es la misma procedencia
que las direcciones del slide 27, "Guarenas" y el teléfono "0212-…".)*

> [!warning] 🔴 Lo que el ejemplo muestra **no es "ausencia de esquema": es un `JOIN` materializado**
> El título dice *ausencia de esquema*; la imagen muestra **dos tablas normalizadas** —`Usuario` con
> clave foránea `Id_CArea` hacia `Dirección`— y **el resultado de unirlas**, guardado como un solo
> documento. Eso tiene nombre en la cursada y no es "sin esquema": es **desnormalización** o
> **embebido**, y es **el tema entero de la [[Clase 13 - NoSQL-EmbebidosVSNormalizado]]**. El
> documento resultante tiene, además, **un esquema perfectamente definido**: seis campos con nombre.
>
> Lo que sí ilustraría "ausencia de esquema" es el **slide 27**: dos documentos de la **misma**
> colección con **campos distintos**. Este slide y aquél están intercambiados respecto de sus títulos.
> Para el parcial conviene tener las dos ideas separadas:
> - **Sin esquema** *(schemaless)*: el motor no exige que todos los registros tengan los mismos campos.
> - **Desnormalizado / embebido**: un registro guarda lo que en relacional serían varias tablas unidas.
>
> Corbellini § 6 *(pp. 14–16)* las trata como dos cosas: los documentos son *"semiestructurados"*
> **y** *"schemaless"*, y aparte da el ejemplo de un JSON que **evoluciona** agregando campos —que es
> el sentido correcto de "sin esquema"—.

**Un detalle del documento:** `"ID": 1` va **sin comillas** *(número)* y `"Cod_Area": "0212"` va
**con** comillas *(string, para conservar el cero inicial)*. Es la primera vez que el material distingue
tipos dentro de un documento, y es una decisión correcta: un `0212` numérico perdería el cero.

### Slide 7 · Alta velocidad de respuesta

**Solo imagen, sin texto más allá del título y la viñeta.** Un cronómetro grande a la izquierda, un
cilindro de base de datos del que "sube" una columna de ceros y unos, y una flecha curva azul hacia un
grupo de cuatro laptops y un servidor dentro de una nube. **No hay número, no hay comparación, no hay
argumento**: la velocidad se afirma, no se explica.

> [!note] De dónde sale la velocidad, que el slide no dice
> Las tres fuentes de la ventaja de latencia están **en los otros tres slides de propiedades**, no en
> éste: **sin `JOIN`** *(slide 6: el dato ya está unido)*, **repartido entre nodos** *(slide 8: cada uno
> atiende una fracción)* y **con más máquinas** *(slide 9)*. La velocidad no es una propiedad
> independiente; es la consecuencia de las otras tres. Corbellini § 2 *(p. 4)* cita el único dato duro
> del vault al respecto: en el benchmark de Todurica & Bucur, **Cassandra y HBase mantienen la
> latencia constante** a carga alta, mientras que **MySQL y Sherpa la aumentan**.

### Slide 8 · Estructura distribuida — el diagrama, transcripto

La imagen tiene dos columnas de rótulos —*Data* y *Clave*— y tres filas:

| Data *(caja roja)* | → | *(caja ocre)* | → | Clave *(caja verde)* | → |
| --- | :---: | --- | :---: | --- | --- |
| *Zorro* | ➜ | *Función Hash* | ➜ | `DFCD3454` | ➜ nodo en la nube |
| *El zorro **corre** por el hielo* | ➜ | *Función Hash* | ➜ | `52ED879E` | ➜ nodo |
| *El zorro rojo **camina** por el hielo* | ➜ | *Función Hash* | ➜ | `46042841` | ➜ nodo |

A la derecha, una nube con **tres servidores** y, abajo, un cilindro de base de datos al que llegan
flechas desde los tres. *(Las palabras "corre" y "camina" van subrayadas en la imagen: son las que
cambian entre el segundo y el tercer dato, y aun así los hashes no se parecen en nada — la ilustración
clásica de una función hash criptográfica, tomada de Wikipedia.)*

> [!important] Es la **primera aparición del sharding por hash en la cursada**, sin la palabra
> El diagrama muestra exactamente el mecanismo de **partición por hash de la clave**: se calcula un
> hash del dato, y el hash decide **en qué nodo vive**. Es lo que Corbellini § 4 *(pp. 7–8)* describe
> como *"tablas hash distribuidas"* con `get(key)` / `put(key, value)`, y lo que § 4.1 *(p. 8)* refina
> como **consistent hashing** —el anillo de claves `[0, K)` con rangos por nodo— para que agregar o
> quitar un nodo no obligue a remapear todo. La palabra **"sharding"** recién aparece en el **slide 30**,
> y ahí el reparto es **por rango de clave** (`0…25`, `26…50`, …), no por hash: **el deck muestra las
> dos estrategias de particionado sin nombrar ninguna**. El nombre y la comparación quedan para
> [[2.12.02 - Escalabilidad horizontal — sharding y replicación|el concepto]] y para el material
> complementario de la [[Clase 14 - MongoDB Features]].

### Slide 9 · Escalabilidad — vertical ✗, horizontal ✓

La imagen son dos paneles. **Izquierda, "Vertical", con una ✗ amarilla**: un servidor que crece
—pequeño → mediano → un rack grande oscuro—, y abajo el detalle: *Servidor* `CPU · 1 GB RAM` →
*Escala* → *Servidor* `CPU · CPU · 1 GB RAM · 1 GB RAM`. **Derecha, "Horizontal", con una ✓ verde**: un
servidor → dos → **doce** iguales, y abajo: *Servidor* `CPU · 1 GB RAM` → *Escala* → **tres**
servidores separados, `CPU · 1 GB RAM`, `CPU · 4 GB RAM`, `CPU · 2 GB RAM`.

| | Vertical *(scale up)* | Horizontal *(scale out)* |
| --- | --- | --- |
| Qué se agranda | **la misma máquina**: más CPU, más RAM | **la cantidad de máquinas** |
| Límite | físico y de precio: hay un servidor más grande, hasta que no lo hay | el software: hay que **repartir** los datos *(slide 8)* y **replicarlos** *(slide 30)* |
| Falla | un solo punto | tolerada, si hay réplicas |
| Veredicto del deck | ✗ | ✓ |

> [!tip] El detalle de los `4 GB` y `2 GB` no es casual
> Los tres servidores del panel horizontal son **distintos entre sí** *(1, 4 y 2 GB)*. Es la viñeta
> *"se ejecutan en clusters de máquinas baratas"* del slide 10 dibujada: no hace falta hardware
> uniforme ni de alta gama. El panel vertical, en cambio, termina en un **rack oscuro** que es
> visualmente "el servidor caro".

Este slide es la respuesta a la última viñeta del slide 3 *("dificultades en la escalabilidad")* y la
premisa de la primera del slide 10.

## Slide 10 · Ventajas

> [!quote] Textual — las seis
> - *"Estos sistemas responden a las necesidades de **escalabilidad horizontal** que tienen cada vez
>   más empresas"*
> - *"Pueden manejar enormes cantidades de datos"*
> - *"No generan cuellos de botella"*
> - *"Escalamiento sencillo"*
> - *"Diferentes DBs NoSQL para diferentes proyectos"*
> - *"Se ejecutan en clusters de máquinas baratas"*

Cuatro de las seis son **la misma ventaja dicha cuatro veces** *(escalabilidad horizontal, enormes
cantidades, sin cuellos de botella, escalamiento sencillo)*. Las otras dos son distintas y valen más:

- **"Diferentes DBs NoSQL para diferentes proyectos"** es **persistencia políglota** con otras
  palabras — el marco conceptual entero de la [[Práctica 2026-08-04]] § *Marco conceptual*: *"cada vez
  es más común ver varios tipos de bases usados en conjunto"*. Ahí ya estaban los seis factores de
  decisión *(tipo, durabilidad, disponibilidad, consistencia, escalabilidad, seguridad)*; este deck va a
  dar el fundamento de tres de ellos —disponibilidad, consistencia, escalabilidad— en los slides
  12–20. Seven Databases cap. 1 § *Polyglot* *(impresas 7–8)* y Corbellini § 8 *(capas híbridas,
  pp. 19–20)* son las fuentes.
- **"Clusters de máquinas baratas"** es el argumento económico: *commodity hardware*. Es lo que hace
  viable el panel derecho del slide 9.

> [!warning] *"No generan cuellos de botella"* es una **sobreafirmación**
> Ningún sistema "no genera cuellos de botella"; lo que hace un sistema distribuido es **moverlos**:
> del servidor único a la **red** *(que es justamente el problema que el teorema CAP formaliza dos
> slides más adelante)*. El propio slide 17 va a decir que cuando *"se pierde la comunicación entre
> nodos"* hay que resignar consistencia o disponibilidad. Conviene no repetir la viñeta tal cual en un
> examen sin ese matiz.

## Slide 11 · Desventajas

> [!quote] Textual — las cuatro
> - *"No son suficientemente maduros para algunas empresas"*
> - *"Falta de experiencia"*
> - *"No trata con datos críticos que requieren ACID"*
> - *"Problemas de compatibilidad"*

Dos son de mercado *(madurez, experiencia)*, una es de interoperabilidad *(compatibilidad: cada motor
tiene su API y su lenguaje —el `find()` de MongoDB, el CQL de Cassandra, el Cypher de Neo4j— y no hay
un SQL común)* y **una es técnica y es la que importa**: *"no trata con datos críticos que requieren
ACID"*.

> [!important] 🔴 *"No trata con datos críticos que requieren ACID"* — leerlo con fecha
> Es **la afirmación con más carga de todo el deck** y la que más envejeció. Está escrita en
> **singular** —*"no trata"*, como si NoSQL fuera un solo sistema— y sin fecha. Lo que hay que saber:
>
> - **Es la posición clásica**, y es la que fundamenta el slide 20 *("los sistemas ACID fuerzan la
>   consistencia… BASE gana disponibilidad perdiendo parte de la consistencia")*. Corbellini § 3.2
>   *(pp. 5–7)* la explica con el costo de **2PC**: un commit sobre dos nodos al 99,9 % de
>   disponibilidad cada uno da **99,8 %**, y de ahí que los sistemas distribuidos relajen ACID.
> - **Ya no es cierta para MongoDB en general.** La tabla A1-6 de Seven Databases *(impresa 314,
>   versión 3.6 de 2018)* lo tabula con `Transactions: No`; **desde 4.0 (2018) MongoDB tiene
>   transacciones multi-documento** y desde 4.2 también sobre clusters *sharded*. Lo que sí sigue
>   valiendo, y desde siempre, es la **atomicidad por documento** *(Corbellini § 6, p. 15: "operaciones
>   atómicas por documento")* — que es justamente por qué embeber importa tanto en la
>   [[Clase 13 - NoSQL-EmbebidosVSNormalizado]]: lo que va en un documento se escribe atómicamente.
> - Lo que la Clase 11 dictó como ACID ([[1.11.03 - Transacciones y ACID|Transacciones y ACID]]) es el
>   **contraste** que este slide da por sabido. El deck no define ACID en ningún lado: lo nombra aquí y
>   en el slide 20.
>
> Va a § *Dudas abiertas*: hay que preguntar **cómo quiere la cátedra que se responda** "¿MongoDB
> soporta transacciones?" en el parcial — con el deck o con la versión actual.

## Slide 12 · Teorema CAP

> [!quote] Textual
> - *"Un compromiso fundamental que afecta a cualquier sistema distribuido obliga a los diseñadores de
>   bases de datos a elegir solo dos de estas tres propiedades:"*
>   - *"consistencia de datos"*
>   - *"disponibilidad del sistema"*
>   - *"o tolerancia a las particiones de red"*
> - *"Esta limitación intrínseca de los sistemas distribuidos se conoce como Teorema CAP o teorema de
>   Brewer:"*
>   - *"Es imposible garantizar simultáneamente **lo siguientes** propiedades en un sistema
>     distribuido:"* **[sic]**

**Concepto totalmente nuevo en el vault**, y el más importante del deck para el objetivo de la
materia. El slide lo enuncia **dos veces** —*"elegir solo dos de tres"* y *"es imposible garantizar
las tres"*— y termina con dos puntos que **no llevan a nada**: la lista de las tres propiedades que
debería seguir a *"lo siguientes propiedades"* no está en este slide, sino repartida en los tres que
siguen *(14, 15, 16)*. Es un resto de edición.

| Letra | Propiedad *(nombre del slide)* | Slide que la define |
| :---: | --- | :---: |
| **C** | consistencia de datos | 14 |
| **A** | disponibilidad del sistema | 15 |
| **P** | tolerancia a las particiones de red | 16 |

**Atribución:** *"teorema de Brewer"*. Corbellini § 3.1 *(pp. 4–5)* lo precisa: **conjetura** de Eric
Brewer en 2000, **formalizada como teorema** por Gilbert y Lynch. Seven Databases lo trata en
el **apéndice A2** *(impresas 315–318)*, que es *"el único tratamiento sistemático de CAP en la
bibliografía obligatoria"* según la ficha. Ninguna de las dos fuentes usa la palabra "compromiso"; el
deck traduce *trade-off*.

**Erratas:** *"lo siguientes propiedades"* *(concordancia)*; y en el título del slide 17, *"garatiza"*
por *"garantiza"*. Se conservan.

## Slide 13 · CAP gráficamente

**Solo imagen.** Un diagrama de Venn de tres círculos sobre el fondo de papel de los slides 6–9:

- Arriba, rojo: **Consistency** *(Consistencia)*.
- Abajo izquierda, verde: **Availability** *(Disponibilidad)*.
- Abajo derecha, ocre: **Partition Tolerance** *(Tolerancia a Partición)*.
- En las intersecciones de a dos: **CA** *(Consistency ∩ Availability)*, **CP** *(Consistency ∩
  Partition)* y, para *Availability ∩ Partition*, las letras **A** / **P** apiladas en vertical *(no
  hay un rótulo "AP" escrito como tal)*. La intersección central de los tres no lleva rótulo.
- **Tres flechas salen del diagrama**: de **CA** hacia un cartel **`RDBMS`**; de **CP** hacia un
  cartel **`NoSQL`**; de las letras **A / P** hacia otro cartel **`NoSQL`**, abajo.

> [!important] 🎯 El mensaje del diagrama, en una línea: **relacional = CA; NoSQL = CP o AP**
> Es la primera clasificación del deck, y es de **familias**, no de motores. La de motores viene en el
> slide 18. Las dos son coherentes entre sí y **las dos tienen el mismo problema**, que se discute ahí:
> "CA" como categoría real.

## Slide 14 · Consistencia

> [!quote] Textual
> *"Si se cumple este atributo, se garantiza que una vez que se escriben los datos están disponibles y
> actualizados para cada usuario que utilice el sistema"*

**Es la C de CAP, y no es la C de ACID.** Vale escribirlo porque el deck usa la misma palabra para las
dos en cinco slides de distancia *(11 y 20 hablan de ACID; 12–18 de CAP)*:

| | **C de ACID** *([[1.11.03 - Transacciones y ACID\|Clase 11]])* | **C de CAP** *(este slide)* |
| --- | --- | --- |
| Qué garantiza | que una transacción lleva la base de un estado **válido** a otro válido *(restricciones, invariantes)* | que **todos los nodos ven el mismo dato** después de una escritura |
| Contra qué | escrituras que violan reglas | **réplicas desactualizadas** |
| Ámbito | una base, una transacción | un sistema **distribuido** |

La definición del slide es la de **consistencia fuerte** *(o lineal)*: *"una vez que se escriben los
datos están… actualizados para cada usuario"*. El contrapeso —**consistencia eventual**— aparece en el
slide 20. Corbellini § 3.1 *(p. 4)* y Seven Databases A2 *(apertura, impresas 315–316)* dan la misma
definición.

## Slide 15 · Disponibilidad

> [!quote] Textual
> *"Esta propiedad se refiere a ofrecer el servicio ininterrumpidamente y sin degradación dentro de un
> cierto porcentaje de tiempo"*

*"Dentro de un cierto porcentaje de tiempo"* es la mitad honesta de la definición: la disponibilidad
se mide en **nueves** *(99,9 %, 99,99 %)*, no en absoluto. Es exactamente la cuenta que Corbellini
§ 3.2 *(pp. 5–7)* hace para mostrar el costo de 2PC *(0,999 × 0,999 = 0,998)*: dos nodos que **tienen que
estar los dos** para responder son **menos disponibles** que cualquiera de ellos solo. De ahí que
"elegir A" signifique responder **aunque falte un nodo** — con el dato que se tenga.

**Lo que el slide no dice, y CAP formal sí:** en la formulación de Gilbert y Lynch, *available*
significa que **todo pedido a un nodo vivo recibe respuesta** *(no error, no timeout)*. Es más fuerte
que "un cierto porcentaje": es **cada** pedido.

## Slide 16 · Tolerancia a la partición

> [!quote] Textual
> *"Si el sistema cumple con esta propiedad entonces una operación puede ser completada incluso cuando
> alguna parte de la red falla"*

**"Partición"** aquí no es la partición de tablas ni el sharding: es una **partición de la red**, es
decir, dos grupos de nodos que **siguen vivos pero no pueden hablarse**. Es la única de las tres
propiedades que **no se elige**: en un sistema distribuido real la red **se va a partir**, y la única
forma de "no tolerar particiones" es tener **un solo nodo**.

> [!important] 🎯 Por eso la elección real es **C o A**, no "dos de tres"
> Corbellini § 3.1 y Table 2 *(p. 5)* lo dicen con todas las letras: la columna **AC** de su tabla
> *"está casi vacía"* porque **resignar P equivale a suponer que la red nunca se parte**, lo cual no es
> viable. Seven Databases A2 dice lo mismo de CA: *"que básicamente significa no distribuido"*. Lo
> que el diseñador elige es **qué hacer cuando la red se parte**: seguir respondiendo con datos
> posiblemente viejos *(AP)* o rechazar pedidos hasta que vuelva la comunicación *(CP)*. El slide 17
> lo describe correctamente para CP y AP; el problema es la tercera viñeta.

## Slide 17 · El teorema sólo garatiza *[sic]*

> [!quote] Textual — las tres combinaciones
> - ***CP (Consistency & Partition):** El sistema aplicará los cambios de forma **consistente** y
>   aunque se pierda la comunicación entre nodos ocasionando el **particionado**, no se asegura que
>   haya disponibilidad*
> - ***AP (Availability & Partition):** El sistema siempre estará **disponible** a las peticiones
>   aunque se pierda la comunicación entre los nodos ocasionando el **particionado**, y en consecuencia
>   por la pérdida de comunicación existirá inconsistencia porque no todos los nodos serán iguales*
> - ***CA (Consistency & Availability):** El sistema siempre estará **disponible** respondiendo las
>   peticiones y los datos procesados serán **consistentes**. En este caso no se puede permitir el
>   particionado*

Es el slide más denso del bloque CAP, y el que hay que saber redactar en un parcial.

| | Qué sacrifica | Qué pasa cuando la red se parte | Ejemplos *(slide 18)* |
| --- | --- | --- | --- |
| **CP** | disponibilidad | los nodos que no pueden confirmar con la mayoría **dejan de responder** *(o responden error)* | MongoDB, HBase, Redis, Memcache |
| **AP** | consistencia | todos responden, con lo que tienen; **las réplicas divergen** hasta que se reconcilien | Riak, Cassandra, CouchDB, DynamoDB |
| **CA** | tolerancia a particiones | *"no se puede permitir el particionado"* — o sea, **no hay red que partir** | MySQL, PostgreSQL |

> [!warning] 🔴 La tercera viñeta describe un sistema que **no es distribuido**, y el slide no lo dice
> *"En este caso no se puede permitir el particionado"* es una forma elegante de decir que **CA es un
> único nodo** *(o un cluster que asume que la red no falla nunca)*. El slide 12 abrió diciendo que CAP
> *"afecta a cualquier sistema distribuido"*; **un sistema CA no es un sistema distribuido**, así que
> la tercera combinación cae fuera del enunciado. Las dos fuentes del vault lo advierten *(ver slide
> 16)*. El slide 18 después va a poner a **MySQL y PostgreSQL** en CA, que es correcto **para una
> instancia única** y engañoso para cualquier despliegue con réplicas —que es como se los usa en
> producción—.

**Errata en el título:** *"garatiza"*. Y *"sólo"* con tilde, grafía anterior a la Ortografía de 2010;
se conserva.

## Slide 18 · Clasificación según CAP

**Solo imagen**: el diagrama de Venn clásico —blanco, con íconos— que circula en decenas de
presentaciones sobre NoSQL. Transcripción completa:

- Círculo superior **Consistency** *(dos estrellas y dos nodos unidos)*; inferior izquierdo
  **Availability** *(dos nodos unidos y dos flechas verdes hacia arriba)*; inferior derecho
  **Partition tolerance** *(dos nodos con la conexión tachada en rojo)*.
- Intersecciones: **CA** *(azul)*, **CP** *(rojo)*, **AP** *(verde)*; centro amarillo sin rótulo.

| Combinación | Rótulo de la imagen | Motores listados |
| --- | --- | --- |
| **CA** | *Consistency & Availability* | **MySQL** · **PostgreSQL** |
| **CP** | *Consistency & Partition tolerance* | **HBase** · **MongoDB** · **Redis** · **Memcache** |
| **AP** | *Availability & Partition tolerance* | **Riak** · **Cassandra** · **CouchDB** · **DynamoDB** |

> [!warning] 🔴 Esta clasificación **contradice a Corbellini en dos motores**, y hay que saber cuál se toma
> La **Table 2** de Corbellini *(p. 5, transcripta en su ficha)* clasifica **por configuración**, no
> por etiqueta, y difiere:
>
> | Motor | Slide 18 | Corbellini Table 2 | Comentario |
> | --- | :---: | :---: | --- |
> | **MongoDB** | CP | **AP y CP** | el paper lo pone en las dos columnas porque *"can be configured to provide full consistency guarantees… or eventual consistency"*. Con lecturas en el primario es CP; con lecturas en secundarios, AP |
> | **Redis** | CP | **AP** | el paper lo lista solo en AP *(replicación master-slave asíncrona → consistencia eventual)*. La etiqueta CP del slide es discutible: Redis pierde escrituras confirmadas si el master cae antes de replicar |
> | **CouchDB** | AP | AP | coinciden |
> | **Cassandra** | AP | AP | coinciden *(y es el único wide-column en AP en el paper)* |
> | **HBase** | CP | CP | coinciden |
> | **Riak** | AP | AP | coinciden |
> | **DynamoDB** | AP | — | **la palabra "DynamoDB" no aparece en el paper** *(sí Dynamo, § 4.3)*. Seven Databases cap. 7, recuadro *DynamoDB's Consistency Model* *(impresa 215)*, es la fuente |
> | **Memcache** | CP | — | no es una base de datos: es una caché en memoria sin persistencia; el paper la **excluye explícitamente** *(§ 4.4)* por eso |
> | **MySQL / PostgreSQL** | CA | — | el paper no los clasifica; su columna AC está *"casi vacía"* y solo tiene a Infinispan |
>
> **Lección:** la esquina de CAP **no es una propiedad del motor sino de cómo se lo configura**, y
> **MongoDB es el ejemplo de manual de eso**. Para el parcial: si la pregunta es "¿en qué esquina está
> MongoDB?", la respuesta corta es *CP* **por defecto** *(y es lo que dice el deck)*, y la respuesta
> completa es *"CP con lecturas en el primario; AP si se habilitan lecturas en secundarios"*. Seven
> Databases A2 § *CAP in the Wild* *(impresa 317)* ubica cada motor del libro con la misma cautela —
> **y da una tercera respuesta para Redis**: textual, *"Redis, PostgreSQL, and Neo4J are consistent
> and available (CA); they don't distribute data and so partitioning is not an issue"*. O sea que
> Redis es **CP** para el slide, **AP** para Corbellini y **CA** para Seven Databases: tres fuentes,
> tres esquinas, y la lección de arriba vale doble.

## Slide 19 · Transacciones BASE

**Solo imagen**, sobre el fondo de papel: cuatro esferas —**B** roja, **A** ocre, **S** verde oliva,
**E** verde— alrededor de un cubo azul rotulado **"Teorema CAP"**, con flechas curvas entre ellas. A la
derecha, la expansión:

> [!quote] Textual *(de la imagen)*
> - ***B**assically **A**vailable.* **[sic: "Bassically"]** *(Básicamente Disponible)*
> - ***S**oft-State.* *(Estado suave)*
> - ***E**ventual Consistency.* *(Consistencia eventual)*

El acrónimo está construido para **rimar con ACID** *(ácido / base)*: es un juego de palabras de Brewer,
no una sigla técnica. Corbellini § 3.2 *(pp. 5–7)* lo desarrolla como *Basically Available, Soft
State, Eventually Consistent* y es **la única fuente del vault que trata ACID y BASE juntos** —la
ficha lo marca explícitamente: *"no está en ningún otro texto del vault"*—.

| Letra | Qué promete | Lo que renuncia respecto de ACID |
| :---: | --- | --- |
| **BA** | el sistema **responde** siempre, aunque sea con datos parciales o viejos | la atomicidad global: una escritura puede haber llegado a algunos nodos y a otros no |
| **S** | el estado del sistema **puede cambiar sin nuevas escrituras** *(las réplicas se van poniendo al día)* | la durabilidad "instantánea": lo que se lee ahora puede no ser lo último |
| **E** | **con el tiempo**, y sin más escrituras, todas las réplicas convergen al mismo valor | la consistencia inmediata *(la C de CAP)* |

**El cubo "Teorema CAP" en el centro es el argumento:** BASE es lo que queda cuando se elige **AP**.

## Slide 20 · Propiedad BASE

> [!quote] Textual *(el rojo es del slide)*
> - *"Disponibilidad todo el tiempo, un estado flexible y consistencia eventual, por lo que en preciso
>   momento puede que no sea consistente pero a lo largo del tiempo será <span style="color:red">eventualmente
>   consistente</span>"*
> - *"En conclusión los sistemas ACID fuerzan la consistencia de la base de datos en todo momento
>   sacrificando parte de la disponibilidad. Sin embargo <span style="color:red">BASE gana
>   disponibilidad</span> perdiendo parte de la consistencia, otorgando un estado de los datos
>   <span style="color:red">más flexible</span>"*

Es la conclusión del bloque teórico *(12–20)*, y las tres frases en rojo son la síntesis para el
parcial: **eventualmente consistente · BASE gana disponibilidad · estado más flexible**.

> [!important] 🎯 La segunda viñeta es la **tabla de decisión** de toda la segunda mitad
> | | Fuerza | Sacrifica | Esquina CAP | Motores *(slide 18)* |
> | --- | --- | --- | :---: | --- |
> | **ACID** | consistencia en todo momento | parte de la disponibilidad | **CP** *(o CA si no es distribuido)* | MySQL, PostgreSQL *(y MongoDB por defecto)* |
> | **BASE** | disponibilidad todo el tiempo | parte de la consistencia | **AP** | Cassandra, DynamoDB, CouchDB, Riak |
>
> Y es donde se cierra la [[Práctica 2026-08-04]]: sus factores *disponibilidad* y *consistencia*
> **no son independientes** — CAP dice que, bajo partición, uno se paga con el otro.

**Lo que el slide no da y Corbellini sí:** *cómo* se implementa la consistencia eventual. Corbellini
§ 3.2 *(pp. 6–7)* y Table 3 *(p. 6)* dan el modelo **N / W / R** *(réplicas, escrituras confirmadas,
lecturas consultadas)*: `W + R > N` ⇒ consistencia fuerte; `W + R ≤ N` ⇒ débil; quórum típico
`N/2 + 1`. Y las tres políticas de reparación de Cassandra *(read-repair, write-repair,
asynchronous-repair)*. Es lo que va a hacer falta cuando llegue Cassandra el 28/09, y **este deck no
lo anticipa**.

**Errata:** *"en preciso momento"* — falta el artículo *("en un preciso momento")*. Se conserva.

---

## Slide 21 · Taxonomía: cuatro categorías principales

**Solo imagen**: una grilla de **4 columnas × 3 logos**, con el nombre de la categoría arriba de cada
columna. Transcripción:

| **Columna** | **Documento** | **Clave-valor** | **Grafo** |
| --- | --- | --- | --- |
| **cassandra** *(el ojo)* | **mongoDB** | **Amazon DynamoDB** *(en una nube AWS)* | **Neo4j** *(the graph database)* |
| **Apache HBase** *(con el elefante de Hadoop)* | **Couchbase** | **redis** | **OrientDB** |
| **accumulo** | **MarkLogic** | **riak** | **Virtuoso** *(Universal Server)* |

Son **las cuatro categorías canónicas**, con el mismo reparto que Corbellini § 1 *(p. 2)*: *Key-Value
· Wide Column / Column Families · Document-oriented · Graph-oriented*, cada una con su sección propia
en el paper *(§§ 4, 5, 6, 7)*. Seven Databases cap. 1 § *The Genres* *(impresas 3–8)* lista **cinco**
géneros porque agrega el **relacional** como primero — y cap. 9 § *Genres Redux* *(impresas 305–309)*
cierra el libro con un *Good For / Not-So-Good For* por género que es la mejor guía de elección que hay
en el vault.

| Categoría *(slide)* | Nombre en Corbellini | Nombre en Seven Databases | Motor de la cursada | Slides de detalle |
| --- | --- | --- | --- | :---: |
| Columna | Wide Column / Column Families *(§ 5)* | Columnar | **Cassandra** *(28/09, 05/10)* | 24 |
| Documento | Document-oriented *(§ 6)* | Document | **MongoDB** *(14/09, 22/09)* | 26–27 |
| Clave-valor | Key-Value *(§ 4)* | Key-Value | **Redis** *(26/10)* · **DynamoDB** *(02/11)* | 25 |
| Grafo | Graph-oriented *(§ 7)* | Graph | **Neo4j** *(19/10)* | 22–23 |

> [!note] Dos motores de la grilla son **multi-modelo**, y el slide los encasilla
> **OrientDB** y **Virtuoso** aparecen bajo *Grafo*, pero Corbellini § 1 *(pp. 1–4)* los nombra
> explícitamente como bases **multi-layout** *(documento + grafo, RDF + relacional)*. Y **Couchbase**,
> bajo *Documento*, es el descendiente del *membase* clave-valor del slide 5. La taxonomía es útil como
> primer mapa y **no es una partición estricta**: el propio slide 21 lo demuestra sin querer.

> [!note] El orden de la grilla no es el orden de la cursada ni el del deck
> El slide va *Columna → Documento → Clave-valor → Grafo*; los slides de detalle van **Grafo (22–23) →
> Columna (24) → Clave-valor (25) → Documento (26–27)**; la cursada va *Documento → Columna → Grafo →
> Clave-valor*. Ninguno de los tres órdenes es "el" orden: no hay jerarquía entre géneros.

## Slides 22–23 · BD orientadas a grafos

> [!quote] Textual *(slide 22)*
> - *"La información es representada en nodos"*
> - *"Ya está normalizada"*
> - *"No es necesario definir cantidad de atributos"*
> - *"Registros de longitud variable"*
> - *"Algunas bases: Neo4j, HyperGraphDB"*

**Es el primer género que el deck desarrolla**, y el único del que dice *"ya está normalizada"*. La
frase es correcta y sorprendente en un deck que acaba de vender la desnormalización *(slide 6)*: en un
grafo **cada entidad es un nodo y cada relación es una arista**, así que no hay redundancia — es la
forma "más normalizada" que existe, y por eso los grafos son buenos para lo que en relacional pide
muchos `JOIN` encadenados *(Corbellini § 7, p. 16: recorrer un grafo en un RDBMS cuesta "un join por
arista")*.

**Los dos motores nombrados** están los dos en Corbellini § 7 *(pp. 17–18)* y en su Table 7
*(p. 17)*: **Neo4J** *(índices Lucene, MVCC read-committed, sharding manual, SPARQL/Gremlin/Java API — Cypher,
su lenguaje propio, no aparece en el paper; Seven Databases cap. 6 sí lo usa)* y
**HypergraphDB** *(que el paper escribe de tres formas distintas, según anota la ficha)*. Seven
Databases cap. 6 es Neo4j entero.

### Slide 23 · Ejemplo — la red social, transcripta

**Solo imagen**, sobre fondo de papel. Un grafo dirigido con **rótulos en las aristas** *(cajas
punteadas)* y nodos de tres colores:

| Origen | Arista | Destino |
| --- | --- | --- |
| **Carolina** *(rojo)* | *Amigo de* | **Carlos** *(ocre)* |
| **Carolina** | *Amigo de* | **Sara** *(ocre)* |
| **Carolina** | *Amigo de* | **Ana** *(ocre)* |
| **Carlos** | *Amigo de* | **Sara** |
| **Ana** | *Amigo de* | **Sara** |
| **Sara** | *Últ.* | **Mensaje** *(verde, el primero)* |
| **Mensaje** *(primero)* | *Ant.* | **Mensaje** *(verde, el segundo)* |
| **Carlos** | *Me gusta* | **Mensaje** *(segundo)* |
| **Ana** | *Me gusta* | **Mensaje** *(primero)* |

Lectura: Carolina es amiga de tres personas; dos de ellas *(Carlos y Ana)* son a su vez amigas de la
tercera *(Sara)*; Sara tiene una **lista enlazada de mensajes** *(`Últ.` → el último, `Ant.` → el
anterior)*, y los amigos marcan *"Me gusta"* en mensajes distintos.

> [!tip] Por qué este ejemplo es de grafo y no de documento
> La pregunta *"¿qué mensajes les gustaron a los amigos de los amigos de Carolina?"* es **un recorrido
> de tres saltos** *(Carolina → Amigo de → Amigo de → Me gusta)*. En relacional son tres `JOIN` sobre
> la misma tabla de amistades; en un documento habría que embeber amigos dentro de amigos *(y romper
> el límite de anidamiento de la Clase 13)*; en un grafo es **seguir tres aristas**. El ejemplo está
> elegido para eso, aunque el slide no lo diga. Y **nótese la asimetría**: las aristas *Amigo de* son
> **dirigidas** *(Carolina → Carlos, no al revés)* — el deck no discute si la amistad es simétrica.

## Slide 24 · BD Familia de Columnas

> [!quote] Textual
> - *"Guarda los valores en columnas"*
> - *"Los datos son almacenados como secciones de las columnas de datos"*

Y una imagen rotulada **"Ejemplo:"**, con dos representaciones de los mismos datos:

**Orientado a Fila *(Modelo RDBMS)***

| Id | Nombre | Edad | Intereses |
| :---: | --- | :---: | --- |
| 1 | Ricky | | Fútbol, Cine, Béisbol ← *(globo: **Multivalor**)* |
| 2 | Pedro | 20 | ← *(globo: **Null**)* |
| 3 | Juan | 25 | Música |

**Orientado a Columnas** *(tres tablas separadas)*

| Id | Nombre | | Id | Edad | | Id | Intereses |
| :---: | --- | --- | :---: | :---: | --- | :---: | --- |
| 1 | Ricky | | 2 | 20 | | 1 | Fútbol |
| 2 | Pedro | | 3 | 25 | | 1 | Cine |
| 3 | Juan | | | | | 1 | Béisbol |
| | | | | | | 3 | Música |

**Lo que muestra el ejemplo, y que vale la pena decir en voz alta:** al partir por columnas
**desaparecen los nulos** *(Ricky no tiene fila en `Edad`; Pedro no tiene fila en `Intereses`)* y
**desaparecen los multivalores** *(los tres intereses de Ricky son tres filas con `Id = 1`)*. Son
exactamente los dos problemas que en la [[Clase 03 - Derivación a Esquema Lógico]] obligaban a crear
tablas aparte para atributos multivaluados: el almacenamiento columnar los resuelve **sin diseñar**.

> [!warning] 🔶 El ejemplo ilustra un **column store**, no una **familia de columnas** — y el título dice lo segundo
> Hay dos cosas distintas que se llaman parecido, y el slide las funde:
>
> | | *Column store* *(lo que dibuja el slide)* | *Column family / wide-column* *(lo que dice el título y lo que es Cassandra)* |
> | --- | --- | --- |
> | Idea | guardar **cada columna de una tabla relacional por separado** en disco *(mejor compresión, mejor para agregar una columna sobre millones de filas)* | cada **fila** tiene su propia **lista de columnas**, agrupadas en **familias**; filas distintas pueden tener columnas distintas; cada celda lleva **timestamp** |
> | Ejemplos | Vertica, Redshift, MonetDB; el motor columnar de MariaDB | **BigTable**, **HBase**, **Cassandra** *(las tres de la columna "Columna" del slide 21)* |
> | Fuente en el vault | — | Corbellini § 5.1 *(pp. 11–12)*: *"arrays de bytes indexados por fila, columna y timestamp; column families (`course:Biology`)"* |
>
> La confusión no es del deck solo: es un clásico de las introducciones a NoSQL. Pero importa **para
> Cassandra**, que llega el 28/09 y cuyo modelo *(partition key, clustering columns, familias)* es el
> de la derecha, no el de la izquierda. Seven Databases cap. 1 § *Columnar* *(impresa 6)* y cap. 3
> *(HBase)* describen el de la derecha. **Anotado en § *Dudas abiertas*.**

**Los dos motores en la bibliografía:** Cassandra *(Corbellini § 5.2, p. 13 — la única fuente del
vault, y el punto abierto #1 de [[CLAUDE]])* y HBase *(Corbellini § 5.2 y Seven Databases cap. 3)*.

## Slide 25 · BD Clave-Valor

> [!quote] Textual
> - *"Conjunto de duplas (Clave, Valor)"*
> - *"Existen contenedores"*
> - *"Permite variar la estructura de la información"*
> - *"Validación de los datos en la aplicación Cliente"*

Y una imagen: la **tabla hash** de manual. A la izquierda, tres **Claves** en cajas verdes —*John
Smith*, *Lisa Smith*, *Sam Doe*—; a la derecha, la columna de **Valores**: una lista de *buckets*
numerados en ocre *(`000`, `001`, `002`, ⋮, `200`, `201`, `202`, ⋮, `886`, `887`, `889` — el dibujo saltea el `888`)* y,
al lado de tres de ellos, un valor en rojo: `754375` *(junto a `001`)*, `854575` *(junto a `202`)*,
`345435` *(junto a `887`)*. **Las flechas de las dos primeras claves se cruzan**: *John Smith* apunta
al bucket `202` y *Lisa Smith* al `001`; *Sam Doe* va derecho al `887`.

> [!note] Las flechas cruzadas son el punto del dibujo
> Un hash **no conserva el orden** de las claves: "John" no cae antes que "Lisa" por empezar con J. Es
> la misma idea del slide 8 *(tres textos parecidos, tres hashes sin relación)*, ahora aplicada a
> **dónde se guarda el valor** en lugar de en qué nodo. Un clave-valor distribuido es exactamente la
> composición de los dos dibujos: hash de la clave → bucket → nodo. Corbellini § 4 *(pp. 7–8)*:
> *"tablas hash distribuidas: `get(key)` / `put(key, value)`"*.

**Las cuatro viñetas, comentadas:**

| Viñeta | Qué significa | Motor de ejemplo |
| --- | --- | --- |
| duplas (Clave, Valor) | la API entera son dos operaciones: `get`, `put` *(y `delete`)* | todos |
| *"existen contenedores"* | un espacio de nombres para las claves: los *buckets* de Riak, las bases numeradas de Redis, las **tablas** de DynamoDB | Riak, Redis, DynamoDB |
| *"permite variar la estructura"* | el valor es **opaco** para el motor: un string, un JSON, una imagen | todos |
| *"validación en la aplicación cliente"* | **consecuencia de lo anterior**: si el motor no mira adentro del valor, no puede validarlo | todos |

La última viñeta es la formulación más honesta de *"no impone una estructura"* *(slide 4)*: la
estructura **existe, pero la conoce el cliente**. Y es lo que separa clave-valor de documental: en
MongoDB el motor **sí** mira adentro del valor *(por eso se puede consultar por campo, slide 41)*.

**Los tres motores del slide 21 en la bibliografía:** Redis *(Corbellini § 4.4, p. 10; Seven Databases
cap. 8)*, Riak *(Corbellini § 4.4; eliminado de Seven Databases 2ª ed.)*, DynamoDB *(Seven Databases
cap. 7; en Corbellini solo su antecesor Dynamo, § 4.3)*. Redis, además, **no es un clave-valor puro**:
sus valores son estructuras *(listas, hashes, sets, sorted sets)* — Seven Databases lo llama *"data
structure server"* *(cap. 8, título del bloque de apertura)*.

## Slides 26–27 · BD orientada a documentos

> [!quote] Textual *(slide 26)*
> - *"Almacena los datos en documentos"*
> - *"Son duplas Clave-(Valor => documento)"*
> - *"No existe un esquema estricto"*
> - *"Los documentos dentro de una colección pueden tener campos diferentes"*

La segunda viñeta es la **definición por herencia**: un documental es un clave-valor **cuyo valor es un
documento que el motor entiende**. Todo lo que MongoDB agrega sobre Redis *(consultas por campo,
índices secundarios, agregación, `$lookup`)* sale de esa diferencia. Corbellini § 6 *(p. 14)* dice lo
mismo: documentos **semiestructurados** *(XML / JSON / BSON)*, *schemaless*, consultables por campo e
indexables. Y advierte algo que este deck no: a diferencia de BigTable para columnas y Dynamo para
clave-valor, **la familia documental no tiene un diseño de referencia**; cada motor es su propio
modelo.

**La cuarta viñeta es la que el slide 6 debería haber ilustrado** *(ver el callout de ese slide)*, y la
ilustra el 27.

### Slide 27 · El ejemplo — Pepe y María, transcriptos

**Solo imagen.** Un recuadro rojo redondeado rotulado con un globo azul **"Contenedor"** *(= la
colección)*, que contiene **dos hojas** *(= dos documentos)*, cada una con un globo verde con su ID:

**ID: 84678**

```json
{
  Nombre: "Pepe",
  Dirección: "C/ San Juan 15",
  Hijos: [
    { Nombre: "Ana",   Edad: 10 },
    { Nombre: "Pedro", Edad: 8 },
    { Nombre: "Juan",  Edad: 5 },
    { Nombre: "Félix", Edad: 2 }
  ]
}
```

**ID: 23532**

```json
{
  Nombre: "María",
  Dirección: "Guarenas",
  Fecha_Nac: "20/06/1980",
  Teléfono: "0212-2515025",
  Hijos: [
    { Nombre: "Luís", Edad: 15 }
  ]
}
```

*(Transcripción fiel: las claves van sin comillas en la imagen, `"Luís"` lleva tilde en la i, y los
IDs están fuera del documento, en el globo. Todo eso se conserva.)*

**Lo que el ejemplo enseña, campo por campo:**

| Observación | Qué ilustra |
| --- | --- |
| María tiene `Fecha_Nac` y `Teléfono`; Pepe no | **"campos diferentes en la misma colección"** — la viñeta 4 del slide 26. Éste es el "sin esquema" real |
| `Hijos` es un **arreglo de documentos** *(cuatro en uno, uno en el otro)* | la relación **1 : N embebida** — lo que en relacional sería una tabla `Hijo` con clave foránea. Es el puente directo a la [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] |
| el ID está **afuera** del documento | en MongoDB va **adentro**, como campo `_id` *(slide 38 y [[Clase 14 - MongoDB Features]])*. El dibujo es genérico, no de MongoDB |
| `Fecha_Nac: "20/06/1980"` es un **string** | en MongoDB debería ser un `Date` *(el slide 39 usa `new Date(…)`)*. Guardar fechas como texto impide ordenarlas y compararlas |
| `Edad` como dato **almacenado** | dato **derivado** de la fecha de nacimiento, y por lo tanto **envejece**: el año que viene es falso. Es el mismo problema de datos derivados que discutía la [[Práctica 2026-09-01]] ej. 4, ahora sin trigger que lo mantenga |

> [!tip] Contraste con el slide 6, para el parcial
> - Slide 6: **un** documento que **materializa un join** → desnormalización.
> - Slide 27: **dos** documentos con **campos distintos** y **arreglos embebidos** → schemaless + embebido.
> Si la pregunta es *"dé un ejemplo de ausencia de esquema"*, el de aquí es el correcto.

## Slide 28 · ¿Cuándo usar SQL o NoSQL?

**Solo imagen**: dos carteles azules con un **pulgar arriba**, *SQL* a la izquierda y *NoSQL* a la
derecha, tres criterios cada uno. Transcripción literal *(con las erratas de la imagen)*:

| 👍 **SQL** | 👍 **NoSQL** |
| --- | --- |
| *"Cuando el volumen de mis datos no crece o lo hace poco a poco."* | *"Cuando el volumen de mis datos crece muy rápidamente en momentos puntuales."* |
| *"Cuando las necesidades de proceso se pueden asumir en un sólo servidor."* | *"Cuando las necesidades de proceso no se pueden **preveer**."* **[sic]** |
| *"Cuando no tenemos picos de uso del sistema por parte de los usuarios más **allás** de los previstos."* **[sic]** | *"Cuando tenemos picos de uso del sistema por parte de los usuarios en múltiples ocasiones."* |

Los tres criterios son **el mismo eje leído tres veces**: *volumen*, *capacidad de proceso*, *picos*
— o sea, **¿cabe en un servidor, y va a seguir cabiendo?** Si sí, SQL; si no, NoSQL. Es la reducción
del slide 9 *(vertical vs. horizontal)* a una regla de decisión.

> [!important] 🎯 Es el único slide del deck que dice **cuándo NO usar NoSQL**, y es la mitad del argumento que el parcial va a pedir
> El slide 3 dio los motivos a favor; éste da los tres criterios en contra, y **ninguno de los tres es
> "porque los datos son relacionales"**. Lo que falta —y que sí está en la bibliografía— es el criterio
> **de consistencia**: Corbellini § 8 *(pp. 19–20)* pone el ejemplo de **cuentas de usuario en RDBMS +
> mensajería en NoSQL** *(capas híbridas: lo que necesita ACID en relacional, lo que necesita escala
> en NoSQL)*, y Seven Databases cap. 9 § *Making a Choice* *(impresa 309)* da el criterio general. Los
> dos coinciden en que la respuesta correcta suele ser **las dos** — que es la persistencia políglota
> de la [[Práctica 2026-08-04]].
>
> Y el propio slide 11 ya dio el cuarto criterio pro-SQL sin ponerlo aquí: *"datos críticos que
> requieren ACID"*.

**Erratas de la imagen:** *"preveer"* *(por "prever")*, *"más allás"* *(por "más allá")*, *"un sólo
servidor"* *(tilde anterior a 2010)*. Las tres son de la imagen original; se conservan.

---

## Slide 29 · MongoDB

> [!quote] Textual — las seis características
> - *"Escalable, alto rendimiento y disponibilidad"*
> - *"Puede trabajar en modo maestro-esclavo"*
> - *"Basada en esquemas BSON (**Binary JSON** )"* `[sic]` *(espacio antes del paréntesis de cierre)*
> - *"Posee un rico y sencillo sistema de consulta"*
> - *"Soporte de índices"*
> - *"Replicación y soporte a prueba de fallos"*

Con el logo *mongoDB* *(hoja verde)* arriba a la derecha. **Aquí empieza la segunda mitad del deck**:
24 slides sobre un solo motor, el de los TP9 *(I y II)*. Las seis viñetas son el índice de lo que va a
venir, y de lo que va a quedar para los decks 13 y 14:

| Viñeta | Dónde se desarrolla |
| --- | --- |
| escalable, rendimiento, disponibilidad | slide 30 *(auto-sharding, replicación)* |
| **maestro-esclavo** | slide 30 *(el dibujo)*; [[Clase 14 - MongoDB Features]] y `Diferencia_Sharding_Replication_MongoDB.pdf` |
| **BSON** | **en ningún lado de este deck**: [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] *(16 MB, 100 niveles)* y [[Clase 14 - MongoDB Features]] |
| sistema de consulta | slides 40–49 |
| índices | **en ningún lado de este deck**; se desarrollan en [[Clase 14 - MongoDB Features]] *(índice `_id` por defecto, `getIndexes()`, single-field indexes)* |
| replicación, tolerancia a fallos | slide 30; [[Clase 14 - MongoDB Features]] |

> [!warning] 🔴 *"Puede trabajar en modo maestro-esclavo"* está **desactualizado desde 2018**
> La replicación *master-slave* de MongoDB fue **deprecada en 3.2 y eliminada en 4.0**. Lo que existe
> desde 1.6 y es lo único que existe hoy son los **replica sets**: un **primario** y N **secundarios**
> con **elección automática** de nuevo primario si el primario cae *(Seven Databases cap. 4 § *Replica
> Sets*, impresas 124–127, incluido el recuadro *Voting and Arbiters* de la 127 y § *The Problem with
> Even Nodes*)*. El propio slide 30 dibuja `mongod` replicados sin usar la palabra. Corbellini
> Table 6 *(p. 15)* ya lo tabulaba en 2016 como *"Replica Sets (conjuntos de Master–Slaves) o
> Master–Slave simple"* — lo segundo ya no aplica. Es el mismo problema que el `insert()`: **el deck
> describe un MongoDB de alrededor de 2013.**

> [!note] *"Basada en esquemas BSON"* — BSON no es un esquema
> BSON *(Binary JSON)* es el **formato de serialización** con el que MongoDB guarda y transmite los
> documentos: JSON binario con tipos que JSON no tiene *(`Date`, `ObjectId`, enteros de 32 y 64 bits,
> binarios)*. Decir "esquemas BSON" en un deck que acaba de afirmar *"no existe un esquema estricto"*
> *(slide 26)* es una tensión de vocabulario, no una contradicción real: quiere decir "documentos en
> formato BSON". Corbellini § 6 *(p. 15)*: *"BSON y su límite de 16 MB"*. El detalle va en
> [[MongoDB]].

## Slide 30 · Propiedades — auto-sharding y replicación

> [!quote] Textual
> - *"Escalabilidad horizontal (**Auto-Sharding**)"*
> - *"Replicación para alta disponibilidad"*

Y **el diagrama**, sobre fondo de papel, que es lo que importa. Tres etapas de izquierda a derecha,
unidas por flechas azules, y abajo una flecha larga rotulada **"Escalabilidad para Escribir"**:

| Etapa | Cajas verdes `mongod` | *Rango de Clave* de cada una |
| :---: | :---: | --- |
| 1 | **1** | `0…100` |
| 2 | **2** | `0…50` · `51…100` |
| 3 | **4** | `0…25` · `26…50` · `51…75` · `76…100` |

Cada caja lleva el rótulo **`mongod`** y arriba su rango de clave; en cada etapa el rótulo *"Rango de
Clave"* está una sola vez con flechas a todas las cajas.

**Lo que el diagrama enseña:**

- **Sharding = partir el espacio de claves en rangos y darle un rango a cada `mongod`.** Es
  particionado **por rango** *(range-based)*, a diferencia del **hash** del slide 8. MongoDB soporta
  los dos *(`ranged` y `hashed` sharding)*; el deck no lo dice.
- **"Auto"** = MongoDB **reparte y rebalancea solo**: cuando un rango crece, lo divide *(chunk split)*
  y lo migra. El diagrama muestra exactamente eso: `0…100` → `0…50 | 51…100` → cuatro cuartos.
- **"Escalabilidad para Escribir"**: el rótulo es preciso. El sharding escala **las escrituras**
  *(cada shard recibe solo las suyas)*; la **replicación** escala las **lecturas** y da disponibilidad.
  Son dos mecanismos **ortogonales** —Corbellini § 1 *(p. 2)* los presenta así— y el slide los junta
  en dos viñetas sin decir que son distintos. La diferencia es el tema entero del complementario
  `Diferencia_Sharding_Replication_MongoDB.pdf` de la [[Clase 14 - MongoDB Features]].

> [!important] El diagrama muestra sharding y **no** muestra replicación, aunque la viñeta la nombre
> Las cuatro cajas de la etapa 3 tienen **rangos disjuntos**: son cuatro **shards**, no cuatro
> réplicas. Una réplica tendría **el mismo rango** que su primario. Para dibujar las dos cosas haría
> falta, por cada shard, un *replica set* de tres `mongod` con el mismo rango — que es la arquitectura
> real de un cluster de MongoDB *(Seven Databases cap. 4 § *Sharding*, impresas 127–130, y el recuadro
> *mongos vs. mongoconfig* de la 129)*. El slide 31 nombra al `mongos` que hace falta para eso.

**Bibliografía verificada:** Seven Databases cap. 4 *Day 3: Replica Sets, Sharding, GeoSpatial, and
GridFS* *(`4.4`, impresas 124–132)* es exactamente este slide y el siguiente; Corbellini § 6
*(pp. 15–16)* cubre *replica sets* y el sharding "por campo — cualquier campo de una colección" *(Table
6)*.

## Slide 31 · Arquitectura de MongoDB

> [!quote] Textual
> *"Los principales componentes de MongoDB son los siguientes:"*
> - *"**Mongod** (Núcleo de la base de datos)"*
> - *"**Mongos** (Controlador de particionamiento)"*
> - *"**GridFS** (Función de almacenamiento)"*

Tres nombres, tres paréntesis, ningún diagrama. Vale expandir cada uno porque el slide no lo hace:

| Componente | Qué es | Cuándo aparece |
| --- | --- | --- |
| **`mongod`** | el **proceso servidor**: el que guarda datos, atiende consultas, replica. Es la caja verde del slide 30. Un despliegue mínimo es **un** `mongod` — es lo que levanta el `docker run … mongo` del TP9 | siempre |
| **`mongos`** | el **router de un cluster sharded**: recibe la consulta del cliente, mira en los *config servers* qué shard tiene qué rango, y la manda a donde corresponde. **Sin sharding no hace falta.** El deck lo llama "controlador de particionamiento", que es una traducción razonable | solo con sharding |
| **GridFS** | **no es un proceso**: es una **convención** para guardar archivos **mayores a 16 MB** *(el límite de un documento BSON)* partiéndolos en *chunks* de 255 KB en dos colecciones *(`fs.files`, `fs.chunks`)*. El deck lo pone al mismo nivel que los dos procesos, y no lo es | solo con archivos grandes |

> [!warning] La lista mezcla **dos procesos y una convención de almacenamiento**, y omite el tercer proceso
> Los componentes de un cluster de MongoDB son **`mongod`, `mongos` y los `mongod` de configuración**
> *(config servers, que guardan el mapa de shards)*. GridFS **no es un componente de la arquitectura**:
> es una forma de usar colecciones. El deck omite los config servers y mete GridFS en su lugar. Seven
> Databases cap. 4 lo separa bien: § *Sharding* *(impresas 127–130)* con el recuadro *mongos vs.
> mongoconfig* *(129)* para los procesos, y § *GridFS* *(131–132)* aparte. Corbellini § 6 nombra a
> GridFS como **persistencia** *("objetos BSON, o GridFS para archivos grandes", Table 6)* y al router
> como *"Mongo"* [sic] en su texto.

**Nada de esto se usa en el TP9 Parte I**, que corre contra un solo `mongod` con `mongosh`. Entra en
juego recién en la [[Clase 14 - MongoDB Features]] *(sharding vs. replication)*.

## Slide 32 · Comparación entre SQL y MongoDB

**Solo imagen: una tabla de dos columnas y ocho filas**, con encabezado verde. Es una copia del *SQL to
MongoDB Mapping Chart* de la documentación oficial *(en su versión anterior a 3.2)*. Transcripción
literal, **con los artefactos de la imagen conservados**:

| **SQL** | **MongoDB** |
| --- | --- |
| `CREATE TABLE users ( id MEDIUMINT NOT NULL AUTO_INCREMENT, user_id Varchar(30), age Number, status char(1), PRIMARY KEY (id));` | `db.users.insert({user_id: "abc123", age: 55, status: "A"})odb.createCollection("users")` **[sic]** |
| `DROP TABLE users` | `db.users.drop()` |
| `INSERT INTO users(user_id,age, status) VALUES ("bcd001", 45, "A")` | `db.users.insert( { user_id: "bcd001", age: 45, status: "A" } )` |
| `SELECT * FROM users` | `db.users.find()` |
| `SELECT COUNT(*) FROM users` | `db.users.count()odb.users.find().count()` **[sic]** |
| `SELECT * FROM users WHERE status = "A" ORDER BY user_id DESC` | `db.users.find( { status: "A" } ). sort( { user_id: -1 } )` |
| `UPDATE users SET status = "C" WHERE age > 25` | `db.users.update( { age: { $gt: 25 } }, { $set: { status: "C" } }, { multi: true })` |
| `DELETE FROM users WHERE status = "D"` | `db.users.remove( { status: "D" } )` |

> [!bug] El *"odb."* de las filas 1 y 5 es un **"o"** *(disyunción)* pegado al comando siguiente
> En la tabla original de la documentación, esas dos celdas tienen **dos alternativas separadas por
> la palabra *or* en su propia línea**: *"`db.users.insert(…)` **or** `db.createCollection("users")`"*
> y *"`db.users.count()` **or** `db.users.find().count()`"*. Al copiar la tabla, el *"or"* se tradujo
> a *"o"* y perdió el salto de línea. **No es un comando `odb`.** Se transcribe `[sic]` y se explica.

> [!important] 🎯 Lo que la primera fila enseña, y que ningún otro slide dice: **en MongoDB no hay `CREATE TABLE`**
> La celda derecha ofrece dos formas de "crear la tabla" y **la primera es un `insert`**: en MongoDB
> **la colección se crea sola con el primer documento**. `db.createCollection("users")` es la forma
> explícita, y hace falta solo para opciones *(colecciones *capped*, validación, y las **vistas** del
> slide 50)*. El TP9 lo explota en su paso 4: *"No es necesario crear un esquema para la colección,
> puede simplemente insertar un nuevo documento"*.
>
> Y nótese que el `CREATE TABLE` de la izquierda tiene **cuatro columnas** *(`id`, `user_id`, `age`,
> `status`)* y el `insert` de la derecha **tres**: el `id MEDIUMINT AUTO_INCREMENT` **desaparece**
> porque MongoDB lo reemplaza por el **`_id` automático** *(`ObjectId`)*, que el deck recién muestra en
> el slide 38 y desarrolla la [[Clase 14 - MongoDB Features]].

> [!warning] 🔶 El único `CREATE TABLE` del deck mezcla **MySQL y Oracle** en una sentencia
> `MEDIUMINT` y `AUTO_INCREMENT` son **de [[MySQL]]** *(ni PostgreSQL ni Oracle los tienen)*; `Number`
> es el tipo numérico **de Oracle** *(en MySQL no existe; en PostgreSQL es `numeric`)*. **No corre en
> ningún motor tal cual.** Viene así del *mapping chart* oficial, que es un ejemplo ilustrativo y no
> SQL ejecutable. Para el inventario de motores ajenos de [[PostgreSQL]] § *Inventario*: es el
> **primer deck con marca de Oracle sin PostgreSQL**, y la marca es heredada de una fuente externa.

### La tabla, traducida a la API de `mongosh` que usa el TP9

| Fila | Deck *(shell `mongo` legacy)* | **`mongosh` / MongoDB ≥ 5** *(propuesta propia)* |
| :---: | --- | --- |
| 1 | `db.users.insert({…})` · `db.createCollection("users")` | `db.users.insertOne({user_id: "abc123", age: 55, status: "A"})` · `db.createCollection("users")` |
| 2 | `db.users.drop()` | igual |
| 3 | `db.users.insert( {…} )` | `db.users.insertOne( { user_id: "bcd001", age: 45, status: "A" } )` |
| 4 | `db.users.find()` | igual |
| 5 | `db.users.count()` · `find().count()` | `db.users.countDocuments()` *(exacto)* · `db.users.estimatedDocumentCount()` *(rápido, por metadatos)* |
| 6 | `find( { status: "A" } ).sort( { user_id: -1 } )` | igual |
| 7 | `update( {…}, {$set: …}, { multi: true })` | `db.users.updateMany( { age: { $gt: 25 } }, { $set: { status: "C" } } )` |
| 8 | `db.users.remove( {…} )` | `db.users.deleteMany( { status: "D" } )` |

**Cuatro de las ocho filas cambian.** La regla mnemotécnica: todo helper "genérico" del shell viejo
*(`insert`, `update`, `remove`, `count`)* se partió en un par **`…One` / `…Many`** *(o en dos
`count…` distintos)* para que la cardinalidad sea **explícita en el nombre** en lugar de en una
opción como `{multi: true}`. Es el mismo espíritu de la crítica que la [[Práctica 2026-09-01]] hacía al
`UPDATE` sin `WHERE`: que la sentencia diga cuántas filas toca.

## Slides 33–34 · Migrando de SQL a NoSQL

### Slide 33 · El E-R de partida

**Solo imagen**: un diagrama de tres tablas al estilo del diseñador de MySQL Workbench / Access, con
llaves amarillas en las claves primarias y líneas de cardinalidad `1 — ∞`. Transcripción:

| **comments** | | **post** | | **tag_list** |
| --- | :---: | --- | :---: | --- |
| 🔑 `comment_id` *(resaltado)* | ∞ — 1 | 🔑 `id` | 1 — ∞ | 🔑 `id` |
| `post_id` | | `title` | | `post_id` |
| `by_user` | | `description` | | `tag` |
| `message` | | `url` | | |
| `data_time` **[sic]** | | `likes` | | |
| `likes` | | `post_by` | | |

Un blog: **un `post` tiene muchos `comments` y muchos `tag_list`**; las dos tablas satélite llevan
`post_id` como clave foránea. Es el esquema relacional canónico de la
[[1.03.01 - Derivación de MER a esquema relacional|Clase 03]] para dos relaciones 1:N: tabla hija con
FK. *(Erratas de la imagen: `data_time` por `date_time`; `post_by` donde el documento del slide 34 va
a decir `by`. El ejemplo es el de la sección "Data Modeling" de tutorialspoint.)*

### Slide 34 · En MongoDB

**Solo imagen: el documento**, en una caja gris con coloreado de sintaxis. Transcripción literal:

```js
{
   _id: POST_ID
   title: TITLE_OF_POST,
   description: POST_DESCRIPTION,
   by: POST_BY,
   url: URL_OF_POST,
   tags: [TAG1, TAG2, TAG3],
   likes: TOTAL_LIKES,
   comments: [
      {
         user:'COMMENT_BY',
         message: TEXT,
         dateCreated: DATE_TIME,
         like: LIKES
      },
      {
         user:'COMMENT_BY',
         message: TEXT,
         dateCreated: DATE_TIME,
         like: LIKES
      }
   ]
}
```

*(Fiel al slide: falta la coma después de `POST_ID`; `'COMMENT_BY'` es lo único entre comillas; los
demás valores son marcadores en mayúsculas.)*

> [!important] 🎯 **Tres tablas → un documento.** Es la tesis de toda la mitad NoSQL, en un slide
> | En SQL *(slide 33)* | En el documento *(slide 34)* | Cómo |
> | --- | --- | --- |
> | tabla `post` | el documento raíz | 1 : 1 |
> | tabla `tag_list` *(id, post_id, tag)* | `tags: [TAG1, TAG2, TAG3]` | **arreglo de escalares**: se pierden `id` y `post_id`, que solo existían para hacer el `JOIN` |
> | tabla `comments` *(seis columnas)* | `comments: [ {user, message, dateCreated, like}, … ]` | **arreglo de subdocumentos**: se pierden `comment_id` y `post_id` por la misma razón |
> | `post.post_by` | `by` | renombrado |
> | `comments.by_user` | `user` | renombrado |
> | `comments.data_time` | `dateCreated` | renombrado *(y corregida la errata)* |
> | `comments.likes` | `like` | renombrado *(en singular, sin motivo aparente)* |
>
> **Lo que se gana:** un post con sus tags y sus comentarios se lee con **un solo `find`**, sin
> `JOIN`; y se escribe **atómicamente**, porque la atomicidad de MongoDB es por documento. **Lo que se
> pierde:** ya no se puede consultar "todos los comentarios de un usuario" sin recorrer todos los posts
> *(no hay tabla `comments` que indexar por `user`)*, y si los comentarios crecen sin límite el
> documento choca con los **16 MB**. **Ésa es exactamente la discusión de la
> [[Clase 13 - NoSQL-EmbebidosVSNormalizado]]** —cuándo embeber y cuándo referenciar— y este par de
> slides es su prólogo.

**Los cuatro renombres** no se explican en el deck y no tienen por qué: en MongoDB los nombres de
campo son libres. Pero vale notarlos para no buscar `post_by` en el slide 38, donde el documento real
usa `by`.

## Slides 35–37 · Bases de datos y colecciones en el shell

Tres slides de texto vivo, los primeros comandos del deck.

### Slide 35 · Creación de base de datos

> [!quote] Textual
> - `use DATABASE_NAME`
> - *"Para chequear la base seleccionada:"* — `> db`
> - *"Mostrar bases de datos corriendo:"* — `> show dbs`

**El título dice "creación" y el comando es `use`**: en MongoDB **no hay `CREATE DATABASE`**. `use`
selecciona una base que **puede no existir todavía**; se crea físicamente **cuando se inserta el
primer documento** en alguna colección. Consecuencia que muerde: después de `use lab`, `show dbs`
**no muestra `lab`** hasta que haya un documento. El TP9 lo dice con todas las letras en su paso 2:
*"No importa si la base de datos no existe aún, de hecho la primera colección que crearemos generará
efectivamente la base de datos"*.

*"Mostrar bases de datos **corriendo**"* es una traducción imprecisa: `show dbs` lista las bases
**existentes** *(con su tamaño)*, no las "en ejecución". Los tres comandos siguen vigentes en `mongosh`.

### Slide 36 · Borrar base de datos

> [!quote] Textual
> `db.dropDatabase()`

Un comando, un slide. Borra **la base seleccionada** *(la de `db`)* con todas sus colecciones, **sin
confirmación**. Vigente en `mongosh`. Es el equivalente del `DROP DATABASE` de la
[[1.03.02 - DDL — creación y alteración de tablas|Clase 03]], con la diferencia de que aquí **no se
nombra la base**: se borra la actual, así que hay que mirar `db` antes.

### Slide 37 · Colecciones

> [!quote] Textual
> - `db.createCollection("myCollection")`
> - `{ "ok": 1 }`
> - `db.myCollection.insert({"name" : "tutorial"})`
> - *"Borrar Colección"*
>   - `db.myCollection.drop()`

Las **comillas tipográficas** *(`“myCollection”`, `“ok”`)* de las dos primeras líneas son un artefacto
de PowerPoint: en el shell van rectas. El `{ "ok": 1 }` es la **respuesta** de `createCollection`,
pegada como si fuera un comando.

| Comando | Vigente en `mongosh` | Comentario |
| --- | :---: | --- |
| `db.createCollection("myCollection")` | ✅ | opcional, salvo para opciones *(capped, validator, **vistas**)* |
| `db.myCollection.insert({…})` | ⚠️ | deprecado: corre, pero con `DeprecationWarning` → `insertOne({…})`. Y crea la colección si no existía: la línea de arriba era innecesaria |
| `db.myCollection.drop()` | ✅ | devuelve `true` |

**`db.getCollectionNames()`**, que el TP9 usa en sus pasos 3 y 5 para ver la lista, **no está en el
deck**. Tampoco `show collections`.

## Slides 38–39 · Inserción de documentos

### Slide 38 · Un documento

**Solo imagen** *(captura de consola con coloreado)*. Transcripción literal:

```js
>db.mycol.insert({
   _id: ObjectId(7df78ad8902c),
   title: 'MongoDB Overview',
   description: 'MongoDB is no sql database',
   by: 'tutorials point',
   url: 'http://www.tutorialspoint.com',
   tags: ['mongodb', 'database', 'NoSQL'],
   likes: 100
})
```

Es el documento del slide 34 con valores reales, y **es el documento con el que trabajan los ocho
slides siguientes** *(40–47: cada `find` devuelve éste)*. Cinco tipos de valor en siete campos:
`ObjectId`, cuatro strings, un **arreglo de strings**, un número.

> [!bug] 🔴 `ObjectId(7df78ad8902c)` **no corre en ninguna versión de MongoDB**
> Dos errores en una línea: **(1)** el argumento va **entre comillas** —es un string—, y **(2)** tiene
> que tener **24 dígitos hexadecimales** *(12 bytes)*, no 12. Así como está, `7df78ad8902c` es un
> identificador de JavaScript inválido y el shell devuelve `SyntaxError`. La forma correcta sería
> `ObjectId("507f1f77bcf86cd799439011")`, o, más simple, **omitir `_id`** y dejar que MongoDB lo
> genere *(que es lo que hace el TP9 en todos sus inserts)*. **El mismo `ObjectId` inválido se repite
> en las salidas de los slides 40, 42, 43, 44 y 46**, con `…902d` y `…902e` para los otros dos
> documentos: es un error de la fuente *(tutorialspoint)* copiado íntegro. Qué es un `ObjectId` de
> verdad —12 bytes: timestamp + valor aleatorio + contador— lo explica la
> [[Clase 14 - MongoDB Features]] con `getTimestamp()`.

### Slide 39 · Múltiples documentos

**Solo imagen.** Transcripción literal *(el arreglo de dos documentos)*:

```js
>db.post.insert([
   {
      title: 'MongoDB Overview',
      description: 'MongoDB is no sql database',
      by: 'tutorials point',
      url: 'http://www.tutorialspoint.com',
      tags: ['mongodb', 'database', 'NoSQL'],
      likes: 100
   },

   {
      title: 'NoSQL Database',
      description: "NoSQL database doesn't have tables",
      by: 'tutorials point',
      url: 'http://www.tutorialspoint.com',
      tags: ['mongodb', 'database', 'NoSQL'],
      likes: 20,
      comments: [
         {
            user:'user1',
            message: 'My first comment',
            dateCreated: new Date(2013,11,10,2,35),
            like: 0
         }
      ]
   }
])
```

Tres cosas que este slide agrega sobre el anterior:

| Novedad | Dónde | Comentario |
| --- | --- | --- |
| **Insertar un arreglo** = varios documentos en una llamada | `insert([ {…}, {…} ])` | en `mongosh` es `insertMany([…])` |
| **Documentos distintos en la misma colección**: el primero no tiene `comments`, el segundo sí | | es el "campos diferentes" del slide 26, ahora en código |
| **`new Date(2013,11,10,2,35)`** — una fecha como tipo `Date`, no como string | comentario embebido | el mes es **0-indexado en JavaScript**: `11` es **diciembre**. Es la misma trampa que el TP9 va a poner en sus `new Date(1987,2,14,…)` *(= 14 de marzo)* |
| `"NoSQL database doesn't have tables"` con **comillas dobles** | `description` del 2.º | porque el string lleva un apóstrofo; los demás van con simples. Es JavaScript: da lo mismo |
| Sin `_id` explícito | los dos | MongoDB lo genera. Es la forma correcta, y contradice de hecho el slide 38 |

**Nótese que la colección cambió**: el slide 38 insertaba en `mycol`; éste inserta en **`post`**. Los
slides 40–47 vuelven a `mycol`, y el 49 usa `posts` *(plural)*. El deck usa **cuatro nombres de
colección** para lo que conceptualmente es la misma: `mycol`, `post`, `posts`, `myCollection`.

## Slides 40–45 · Consultas

### Slide 40 · `find().pretty()`

**Solo imagen.** Transcripción:

```js
>db.mycol.find().pretty()
{
   "_id": ObjectId(7df78ad8902c),
   "title": "MongoDB Overview",
   "description": "MongoDB is no sql database",
   "by": "tutorials point",
   "url": "http://www.tutorialspoint.com",
   "tags": ["mongodb", "database", "NoSQL"],
   "likes": "100"
}
>
```

`find()` sin argumento = `SELECT *`. `.pretty()` indenta la salida *(en `mongosh` es innecesario: ya
sale indentada)*.

> [!bug] `"likes": "100"` — el slide 38 insertó **el número** `100` y el 40 devuelve **el string** `"100"`
> No es posible: MongoDB conserva el tipo. Es una inconsistencia de la fuente copiada *(la salida fue
> escrita a mano, no capturada)*. Importa porque **el slide 41 va a comparar `likes` con `$gt: 50`**, y
> **en MongoDB una comparación numérica no matchea un string**: si `likes` fuera `"100"`, `{likes:
> {$gt: 50}}` **no lo devolvería** *(los tipos distintos no se comparan entre sí; el orden BSON pone
> todos los números antes que todos los strings)*. Es un buen ejemplo de por qué "sin esquema"
> **no** significa "sin tipos".

### Slide 41 · Consultas con "Where" — la tabla de operadores

**Solo imagen: una tabla de cuatro columnas y seis filas**, copiada de tutorialspoint. Transcripción:

| Operation | Syntax | Example | RDBMS Equivalent |
| --- | --- | --- | --- |
| Equality | `{<key>: <value>}` | `db.mycol.find({"by":"tutorials point"}).pretty()` | `where by = 'tutorials point'` |
| Less Than | `{<key>: {$lt: <value>}}` | `db.mycol.find({"likes": {$lt:50}}).pretty()` | `where likes < 50` |
| Less Than Equals | `{<key>: {$lte: <value>}}` | `db.mycol.find({"likes": {$lte:50}}).pretty()` | `where likes <= 50` |
| Greater Than | `{<key>: {$gt: <value>}}` | `db.mycol.find({"likes": {$gt:50}}).pretty()` | `where likes > 50` |
| Greater Than Equals | `{<key>: {$gte: <value>}}` | `db.mycol.find({"likes": {$gte:50}}).pretty()` | `where likes >= 50` |
| Not Equals | `{<key>: {$ne: <value>}}` | `db.mycol.find({"likes": {$ne:50}}).pretty()` | `where likes != 50` |

**Es la tabla de referencia del TP9** y de todo lo que sigue en MongoDB. La gramática que enseña:

- **El `WHERE` es un documento** *(el "filtro" o *query document*)*: `find({ campo: valor })`.
- **Igualdad** es la forma corta `{campo: valor}`; **todo lo demás** va como
  `{campo: {$operador: valor}}` — un documento anidado con la clave con `$`.
- Los seis operadores del slide son los de comparación. **Faltan** `$in` / `$nin` *(pertenencia a
  lista)*, `$exists` *(¿tiene el campo?, esencial en colecciones sin esquema)*, `$regex`, `$size`
  *(largo de un arreglo)* y `$elemMatch` *(condición sobre elementos de un arreglo de subdocumentos)*.
  El TP9 los va a necesitar; Seven Databases cap. 4 § *Digging Deep* y § *elemMatch* *(impresas
  100–104)* los cubren.

> [!tip] La analogía con SQL que vale la pena tener escrita
> `find(filtro, proyección)` ≈ `SELECT proyección FROM colección WHERE filtro`. **El deck nunca muestra
> el segundo argumento** *(la proyección: `{title: 1, _id: 0}`)*; el único `$project` del deck está
> dentro de la vista del slide 51. Sin proyección, `find` es siempre `SELECT *`.

### Slides 42–43 · `$and` y `$or`

**Solo imagen, los dos.** Transcripción del comando de cada uno *(la salida es, en ambos, el mismo
documento del slide 40, con `"likes": "100"` incluido)*:

```js
// Slide 42
>db.mycol.find({$and:[{"by":"tutorials point"},{"title": "MongoDB Overview"}]})
```

> [!quote] Slide 42, al pie
> *"EN SQL: **where by = 'tutorials point' AND title = 'MongoDB Overview‘**"* `[sic]`

```js
// Slide 43
>db.mycol.find({$or:[{"by":"tutorials point"},{"title": "MongoDB Overview"}]})
```

> [!quote] Slide 43, al pie
> *"EN SQL: **where by = 'tutorials point' OR title = 'MongoDB Overview‘**"* `[sic]`

**La gramática:** `$and` y `$or` toman un **arreglo de filtros**, y el arreglo es lo que permite
combinar condiciones sobre **el mismo campo** *(`{$or: [{likes: {$lt: 10}}, {likes: {$gt: 100}}]}`,
que sin `$or` sería imposible porque un documento no puede tener dos claves `likes`)*.

> [!note] El `$and` del slide 42 es **redundante**, y es bueno saber por qué
> `find({by: "tutorials point", title: "MongoDB Overview"})` —dos claves en el mismo documento de
> filtro— **ya es un AND implícito**. `$and` explícito hace falta solo cuando las dos condiciones son
> sobre el **mismo campo** con el mismo operador, o para anidar con `$or`. El slide 44 lo muestra sin
> decirlo: su filtro tiene `likes` y `$or` **al mismo nivel**, y eso es un AND.

**Detalle de transcripción:** en los slides 42 y 43 el comando **no lleva `.pretty()`** pero la salida
aparece indentada; en el 44 sí lo lleva. Cosmético.

### Slide 44 · AND y OR juntos

**Solo imagen.** Transcripción:

```js
>db.mycol.find({"likes": {$gt:10}, $or: [{"by": "tutorials point"},
   {"title": "MongoDB Overview"}]}).pretty()
```

> [!quote] Al pie
> *"En SQL: **where likes>10 AND (by = 'tutorials point' OR title = 'MongoDB Overview')**"*

Es el patrón **más útil de los tres**: el AND es el documento exterior *(dos claves, `likes` y
`$or`)*, y el OR va adentro como arreglo. Los paréntesis del SQL equivalente **son el anidamiento del
JSON**. Salida: el mismo documento *(100 > 10 ✓ y `by` matchea ✓)*.

### Slide 45 · Ordenamiento

> [!quote] Textual *(texto vivo)*
> `>db.myCollection.find().sort({name: 1, surname: -1})`

Un comando, un slide. `sort` toma un documento **ordenado** de campos: `1` ascendente, `-1`
descendente; el orden de las claves es el orden de prioridad *(primero por `name`, empates por
`surname` invertido)*. Equivale a `ORDER BY name ASC, surname DESC`. Vigente en `mongosh`.

**Cambio de colección otra vez**: `myCollection`, cuyos documentos *(slide 37)* tienen `name` y no
`surname`. Los campos del ejemplo no existen en ninguna colección del deck; es sintaxis suelta.

> [!note] Un detalle que en MongoDB importa y en SQL no: **el orden de las claves del documento**
> `{name: 1, surname: -1}` y `{surname: -1, name: 1}` son **ordenamientos distintos**. En JSON puro el
> orden de las claves no es semántico; en BSON **sí** —y `sort`, `$group` y los índices compuestos
> dependen de él—. Es la primera vez en el deck que eso aparece, y no se comenta.

## Slides 46–47 · Función de agregación

### Slide 46 · Los datos

**Solo imagen: tres documentos**, que son el dataset del `$group` siguiente. Transcripción:

```js
{
   _id: ObjectId(7df78ad8902c)
   title: 'MongoDB Overview',
   description: 'MongoDB is no sql database',
   by_user: 'tutorials point',
   url: 'http://www.tutorialspoint.com',
   tags: ['mongodb', 'database', 'NoSQL'],
   likes: 100
},
{
   _id: ObjectId(7df78ad8902d)
   title: 'NoSQL Overview',
   description: 'No sql database is very fast',
   by_user: 'tutorials point',
   url: 'http://www.tutorialspoint.com',
   tags: ['mongodb', 'database', 'NoSQL'],
   likes: 10
},
{
   _id: ObjectId(7df78ad8902e)
   title: 'Neo4j Overview',
   description: 'Neo4j is no sql database',
   by_user: 'Neo4j',
   url: 'http://www.neo4j.com',
   tags: ['neo4j', 'database', 'NoSQL'],
   likes: 750
},
```

*(Fiel: sin coma después de cada `_id`, coma final después del tercer documento, y **el campo se llama
`by_user`**, no `by` como en los slides 38–44.)* Dos autores: *tutorials point* con dos documentos y
*Neo4j* con uno.

### Slide 47 · `$group`

**Solo imagen.** Transcripción:

```js
> db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : 1}}}])
{
   "result" : [
      {
         "_id" : "tutorials point",
         "num_tutorial" : 2
      },
      {
         "_id" : "Neo4j",
         "num_tutorial" : 1
      }
   ],
   "ok" : 1
}
>
```

> [!quote] Al pie
> *"En SQL: **select by_user, count(*) from mycol group by by_user**."*

**Es el primer *aggregation pipeline* de la cursada**, y el slide lo presenta como *"función de
agregación"*, que es el nombre de SQL. La gramática, que el deck no explica:

| Pieza | Qué es | Equivalente SQL |
| --- | --- | --- |
| `aggregate([ … ])` | un **pipeline**: arreglo de etapas, cada una un documento `{$etapa: …}`; la salida de una es la entrada de la siguiente | la consulta entera |
| `{$group: {…}}` | la etapa de agrupamiento | `GROUP BY` + las funciones agregadas |
| `_id: "$by_user"` | **la clave de agrupamiento**; el `$` delante del nombre significa *"el valor del campo `by_user`"* | `GROUP BY by_user` |
| `num_tutorial: {$sum: 1}` | un **acumulador**: suma 1 por documento del grupo | `count(*) AS num_tutorial` |

**Por qué `_id`:** en la salida de `$group`, el campo que identifica cada grupo se llama
**obligatoriamente `_id`** —es una convención del operador, no el `ObjectId`—. Por eso el resultado
dice `"_id" : "tutorials point"`.

> [!warning] 🔴 La salida `{ "result" : [ … ], "ok" : 1 }` es de **MongoDB < 2.6** y es la evidencia más precisa de la edad del deck
> Hasta la versión 2.4, `aggregate` devolvía **un solo documento** con el arreglo `result` adentro
> *(y por eso tenía un límite de 16 MB para todo el resultado)*. **Desde 2.6 (abril de 2014)
> devuelve un cursor**, y el shell imprime los documentos del resultado sueltos, uno por línea,
> igual que `find`. La captura es anterior a eso: el material de MongoDB de este deck tiene **más de
> doce años**. Junto con `insert()`, `remove()`, `{multi:true}`, *maestro-esclavo* y los logos de
> membase y riak, forma un cuadro coherente. **Es el hallazgo estructural de la segunda mitad del
> deck**, y va a [[MongoDB]] y a [[_index-clases]].

**Bibliografía verificada:** Seven Databases cap. 4 § *Aggregated Queries* *(impresas 115–117, dentro
del *Day 2*)* es este slide; y en la misma sección el libro presenta `count` y `distinct` antes de
`aggregate`. Corbellini Table 6 *(p. 15)* lista como *query method* de MongoDB *"consultas por campo,
cursores y MapReduce"* — **no** el pipeline, que en 2016 ya existía pero el paper no menciona.

> [!note] `mapReduce` **no está en este deck**, y es una buena noticia
> El deck enseña la agregación directamente con el **pipeline**, que es la forma vigente. `mapReduce`
> —**deprecado desde 5.0**— aparece en el material complementario `Ejemplo_MapReduce_MongoDB.pdf` de
> la [[Clase 14 - MongoDB Features]], que es donde corresponde señalarlo.

## Slides 48–49 · Ensamble de colecciones — `$lookup`

### Slide 48 · Las dos colecciones

**Dos imágenes** *(las únicas dos de un mismo slide, junto con el 50 y el 51)*, cada una con su
título en serif. Transcripción:

**post collection**

```js
{
   "title" : "my first post",
   "author" : "Jim",
   "likes" : 5
},
{
   "title" : "my second post",
   "author" : "Jim",
   "likes" : 2
},
{
   "title" : "hello world",
   "author" : "Joe",
   "likes" : 3
}
```

**comment collection**

```js
{
   "postTitle" : "my first post",
   "comment" : "great read",
   "likes" : 3
},
{
   "postTitle" : "my second post",
   "comment" : "good info",
   "likes" : 0
},
{
   "postTitle" : "my second post",
   "comment" : "i liked this post",
   "likes" : 12
},
```

**Es el modelo *normalizado*** —comentarios en su propia colección, referenciando al post por
`postTitle`— o sea **lo contrario del slide 34**, que embebía los comentarios dentro del post. El
deck muestra las dos opciones en quince slides de distancia **sin decir que son las dos opciones**: ése
es el trabajo de la [[Clase 13 - NoSQL-EmbebidosVSNormalizado]].

**Nótese la "clave foránea"**: `postTitle` referencia a `title`, un **string**, no a un `_id`. Funciona
para el ejemplo y es una mala idea en general *(dos posts con el mismo título rompen el join)*. El
patrón correcto es referenciar el `_id`. Seven Databases cap. 4 § *References* *(impresas 106–107)*
lo discute.

### Slide 49 · El `$lookup`

**Solo imagen.** Transcripción literal:

```js
db.posts.aggregate([
    { $lookup:
        {
           from: "comments",
           localField: "title",
           foreignField: "postTitle",
           as: "comments"
        }
    }
])
```

**Es el `LEFT OUTER JOIN` de MongoDB**, como etapa del pipeline:

| Parámetro | Valor | En SQL |
| --- | --- | --- |
| *(colección base)* | `db.posts` | `FROM posts` |
| `from` | `"comments"` | `LEFT JOIN comments` |
| `localField` | `"title"` | `ON posts.title` |
| `foreignField` | `"postTitle"` | `= comments.postTitle` |
| `as` | `"comments"` | el nombre del **arreglo** donde se guardan los comentarios que matchean |

**La salida que el slide no muestra** *(propuesta propia, derivada del slide 48)*: tres documentos de
`posts`, cada uno con un campo nuevo `comments` que es un **arreglo**: el primero con **un** comentario
*("great read")*, el segundo con **dos**, y *"hello world"* con **un arreglo vacío** `[]` — porque es
un *left* join: los posts sin comentarios también salen. **El resultado tiene la forma del slide 34**:
`$lookup` convierte, en tiempo de consulta, el modelo normalizado en el embebido.

> [!bug] Los nombres de colección **no coinciden** entre el slide 48 y el 49
> El 48 titula *"post collection"* y *"comment collection"* *(singular)*; el 49 consulta **`db.posts`**
> y `from: "comments"` *(plural)*. Con los nombres del 48, el comando del 49 devuelve **vacío**
> *(colecciones inexistentes no dan error en MongoDB: dan cero documentos)*. Es un detalle de copia,
> pero es exactamente el tipo de error silencioso que "sin esquema" habilita.

**Versión mínima:** `$lookup` existe **desde MongoDB 3.2** (diciembre de 2015). Es, junto con las
vistas *(3.4)*, **lo más nuevo del deck** — y contrasta con el `{result: […]}` del slide 47, que es de
antes de 2.6. **El deck mezcla capturas de al menos dos épocas**. Seven Databases cap. 4 *(2018,
MongoDB 3.6)* no dedica sección a `$lookup`; Corbellini tampoco. **Fuente: la documentación oficial**
*(`$lookup (aggregation)`)*.

## Slides 50–52 · Vistas en MongoDB

### Slide 50 · Creación de vistas — las dos sintaxis

> [!quote] Textual
> *"Creación de vistas"*

Y **dos imágenes** lado a lado, capturas de la documentación oficial *(fondo cuadriculado)*.
Transcripción:

```js
// Forma 1 — createCollection con viewOn
db.createCollection(
  "<viewName>",
  {
    "viewOn" : "<source>",
    "pipeline" : [<pipeline>],
    "collation" : { <collation> }
  }
)
```

```js
// Forma 2 — createView
db.createView(
  "<viewName>",
  "<source>",
  [<pipeline>],
  {
    "collation" : { <collation> }
  }
)
```

**Una vista en MongoDB es una colección de solo lectura definida por un pipeline de agregación sobre
otra colección** *(o sobre otra vista)*. Las dos formas son equivalentes; `createView` es azúcar
sintáctica sobre `createCollection` con `viewOn`. Los tres parámetros: **nombre**, **fuente** y
**pipeline**; `collation` es opcional *(reglas de comparación de strings: mayúsculas, acentos)*.

> [!important] 🎯 Es la **vuelta de un concepto de la primera mitad**, y conviene cruzarlo
> [[1.06.01 - Vistas|Vistas]] *(Clases 06–07)* dio la vista relacional: `CREATE VIEW v AS SELECT …`,
> actualizable bajo condiciones, con `WITH CHECK OPTION`, y las materializadas de PostgreSQL. La vista
> de MongoDB comparte lo esencial —**una consulta con nombre, evaluada al leer**— y difiere en tres
> cosas que valen para el parcial:
>
> | | Vista relacional *(Clases 06–07)* | Vista de MongoDB *(slide 50)* |
> | --- | --- | --- |
> | Se define con | una consulta `SELECT` | un **pipeline de agregación** *(`$match`, `$project`, `$lookup`, …)* |
> | Actualizable | sí, bajo las reglas del deck 07 *(y de MySQL)* | **nunca**: son de solo lectura, sin `INSTEAD OF` ni nada parecido |
> | Materializada | opcional en PostgreSQL *(`CREATE MATERIALIZED VIEW`)*; no en MySQL | **no existe** como tal; el equivalente es `$out` / `$merge` al final de un pipeline, que escribe una colección real |
> | Índices | sobre las tablas base | sobre la colección **fuente**; la vista no tiene índices propios |
> | Desde | SQL-86 | **MongoDB 3.4** (2016) |
>
> Y el uso canónico es el mismo que la Clase 06 daba para las vistas: **seguridad** —exponer un
> subconjunto de campos sin dar acceso a la colección base—, que es exactamente lo que hace el
> ejemplo del slide 51 *(mostrar `management` y ocultar `environment`)*.

### Slide 51 · Ejemplo de vistas

**Dos imágenes**: la colección de origen y el comando. Transcripción:

> [!quote] Rótulo
> *"Collection: Survey"*

```js
{ _id: 1, empNumber: "abc123", feedback: { management: 3, environment: 3 }, department: "A" }
{ _id: 2, empNumber: "xyz987", feedback: { management: 2, environment: 3 }, department: "B" }
{ _id: 3, empNumber: "ijk555", feedback: { management: 3, environment: 4 }, department: "A" }
```

Una flecha azul hacia abajo, y:

> [!quote] Rótulo
> *"View: managementFeedback"*

```js
db.createView(
   "managementFeedback",
   "survey",
   [ { $project: { "management": "$feedback.management", department: 1 } } ]
)
```

Es el ejemplo de `db.createView` de la documentación oficial, literal. Lo que enseña:

- **`$project`** es la primera aparición de la etapa de proyección en el deck: elige qué campos salen.
  `department: 1` = "incluir"; `"management": "$feedback.management"` = **campo nuevo calculado** con
  el valor de un **subcampo** *(notación de punto)*. `_id` sale siempre salvo que se lo excluya con
  `_id: 0`.
- **`empNumber` y `feedback.environment` no salen**: eso es lo que la vista oculta.
- **Documentos anidados**: `feedback` es un subdocumento; `"$feedback.management"` lo desanida. Es la
  primera vez que el deck accede a un campo interno.

> [!bug] `"Survey"` con mayúscula en el rótulo, `"survey"` con minúscula en el comando
> **Los nombres de colección en MongoDB distinguen mayúsculas.** Si la colección se llamara `Survey`,
> `createView("managementFeedback", "survey", …)` crearía una vista **sobre una colección
> inexistente**, sin error, y `find()` devolvería vacío. El rótulo es prosa y el comando es código;
> vale el código.

### Slide 52 · Uso de la vista

**Solo imagen** *(captura de la documentación, con su texto en inglés)*. Transcripción:

```js
db.managementFeedback.find()
```

> [!quote] Texto intermedio de la captura
> *"The operation returns the following documents:"*

```js
{ "_id" : 1, "department" : "A", "management" : 3 }
{ "_id" : 2, "department" : "B", "management" : 2 }
{ "_id" : 3, "department" : "A", "management" : 3 }
```

**Una vista se consulta exactamente como una colección**: `db.<vista>.find()`, con filtros, `sort`,
incluso `aggregate` encima. El pipeline de la vista se ejecuta **cada vez** *(no está materializada)*
y se **antepone** al de la consulta. Los tres documentos tienen los tres campos previstos y nada más.

**Con esto termina el deck.** Sin slide de cierre, sin bibliografía, sin "preguntas". El último
contenido es una captura de la documentación de MongoDB.

---

## Cuadro de bolsillo — todo el deck en una pantalla

| Tema | Lo que hay que saber decir | Slide |
| --- | --- | :---: |
| **Por qué NoSQL** | volumen + latencia web; el relacional escala vertical y no alcanza | 2–3, 9 |
| **Qué es** | no E-R, no esquema impuesto por el motor, distintos formatos | 4 |
| **Cuatro propiedades** | sin esquema · velocidad · distribuido *(hash → nodo)* · escalable horizontalmente | 6–9 |
| **Ventajas** | escala horizontal en máquinas baratas; un motor por problema *(políglota)* | 10 |
| **Desventajas** | inmadurez, experiencia, compatibilidad, **sin ACID** *(con fecha)* | 11 |
| **CAP** | C = todos ven lo mismo · A = siempre responde · P = sigue andando con la red partida; **P no se elige** → la elección real es **C o A** | 12–17 |
| **CP / AP / CA** | CP sacrifica A · AP sacrifica C · CA = no distribuido | 17 |
| **Motores en CAP** | CA: MySQL, PostgreSQL · CP: MongoDB, HBase, Redis · AP: Cassandra, CouchDB, Riak, DynamoDB *(MongoDB y Redis son discutibles: ver slide 18)* | 13, 18 |
| **BASE** | *Basically Available · Soft-State · Eventual Consistency*; ACID fuerza C y paga A; BASE gana A y paga C | 19–20 |
| **Cuatro géneros** | columna *(Cassandra, HBase)* · documento *(MongoDB)* · clave-valor *(Redis, DynamoDB, Riak)* · grafo *(Neo4j)* | 21 |
| **Grafo** | nodos + aristas; "ya normalizado"; bueno para recorridos de N saltos | 22–23 |
| **Columna** | valores por columna; sin nulos ni multivalores *(ojo: column store ≠ column family)* | 24 |
| **Clave-valor** | `get`/`put`; valor opaco → validación en el cliente | 25 |
| **Documento** | clave-valor cuyo valor el motor entiende; campos distintos en la misma colección; arreglos embebidos | 26–27 |
| **SQL o NoSQL** | ¿cabe en un servidor y va a seguir cabiendo? *(+ ¿necesita ACID?)* | 28, 11 |
| **MongoDB** | documental, BSON, índices, replicación, **auto-sharding por rango**; `mongod` · `mongos` · GridFS | 29–31 |
| **Sin `CREATE`** | la base y la colección se crean con el primer `insert` | 32, 35, 37 |
| **Tres tablas → un documento** | arreglos de escalares *(tags)* y de subdocumentos *(comments)* | 33–34 |
| **CRUD** | `insertOne/Many` · `find(filtro)` · `updateMany` · `deleteMany` *(el deck usa los nombres viejos)* | 32, 38–39 |
| **Filtros** | `{campo: valor}` · `{campo: {$gt: v}}` · `$lt $lte $gt $gte $ne` · `{$and: […]}` `{$or: […]}` · AND implícito entre claves | 41–44 |
| **`sort`** | `{campo: 1 \| -1, …}`, el orden de las claves importa | 45 |
| **Pipeline** | `aggregate([{$group: {_id: "$campo", n: {$sum: 1}}}])` = `GROUP BY` | 46–47 |
| **`$lookup`** | `{from, localField, foreignField, as}` = `LEFT JOIN` que devuelve un arreglo | 48–49 |
| **Vistas** | `createView(nombre, fuente, [pipeline])`; solo lectura; `$project` | 50–52 |

---

## Erratas y artefactos del deck — inventario completo

Todo conservado `[sic]` en las transcripciones de arriba. Se listan para que nadie las "corrija" al
citar el deck.

| Slide | Errata / artefacto | Qué debería decir |
| :---: | --- | --- |
| 5 | *"Qué bases NoSQL conocen?"* | falta el `¿` de apertura |
| 12 | *"lo siguientes propiedades"* | *"las siguientes"* |
| 12 | los dos puntos finales no llevan a nada | la lista está en los slides 14–16 |
| 17 | *"El teorema sólo **garatiza**"* | *"garantiza"* |
| 19 | *"**Bassically** Available"* *(imagen)* | *"Basically"* |
| 20 | *"en preciso momento"* | *"en un preciso momento"* |
| 28 | *"preveer"*, *"más allás"* *(imagen)* | *"prever"*, *"más allá"* |
| 17, 28 | *"sólo"* con tilde | grafía anterior a 2010; no es error del deck |
| 32 | `…"A"})odb.createCollection(…)` · `count()odb.users.find()…` | un *"o"* de disyunción pegado; son dos alternativas |
| 32 | `MEDIUMINT … AUTO_INCREMENT` + `age Number` en un mismo `CREATE TABLE` | mezcla MySQL + Oracle heredada del *mapping chart* |
| 33 | `data_time` *(imagen)* | `date_time` |
| 34 | falta la coma después de `_id: POST_ID` | |
| 38, 40, 42–44, 46 | `ObjectId(7df78ad8902c)` *(y `…902d`, `…902e`)* | `ObjectId("<24 hex>")` — o nada, y que lo genere el motor |
| 40, 42, 43, 44 | `"likes": "100"` *(string)* en la salida de un documento insertado con `likes: 100` *(número)* | `"likes": 100` |
| 46 | falta la coma después de cada `_id` | |
| 47 | salida `{ "result": […], "ok": 1 }` | formato anterior a 2.6; hoy salen los documentos sueltos |
| 48 vs. 49 | *"post collection"* / *"comment collection"* vs. `db.posts` / `from: "comments"` | los nombres tienen que coincidir |
| 51 | *"Collection: Survey"* vs. `"survey"` en el comando | los nombres distinguen mayúsculas |
| 37 | comillas tipográficas `“ ”` en código | comillas rectas |
| 42, 43 | `'MongoDB Overview‘`: comilla tipográfica de apertura `‘` como cierre | comilla recta `'` |
| 29 | `(Binary JSON )`: espacio antes del paréntesis de cierre | `(Binary JSON)` |

## Contradicciones internas del deck

1. **Slide 6 vs. su propio título.** *"Ausencia de esquema"* ilustrado con un **join materializado**
   entre dos tablas normalizadas. Lo que muestra es desnormalización; lo que promete es
   schemalessness, que está en el slide 27. Los dos ejemplos están intercambiados respecto de sus
   rótulos.
2. **Slide 12 vs. slide 17.** El 12 dice que CAP *"afecta a cualquier sistema distribuido"*; el 17
   ofrece **CA** como tercera opción y la define como *"no se puede permitir el particionado"* — es
   decir, **un sistema no distribuido**. La tercera combinación cae fuera del enunciado del teorema, y
   el deck no lo señala. *(Corbellini Table 2 y Seven Databases A2 sí.)*
3. **Slide 18 vs. Corbellini Table 2.** MongoDB *(CP en el slide; AP **y** CP en el paper)* y Redis
   *(CP en el slide; **AP** en el paper)*. No es una contradicción del deck consigo mismo, pero es una
   contradicción **con la bibliografía obligatoria de la cátedra**, y hay que saber cuál se toma.
4. **Slide 26 vs. slide 29.** *"No existe un esquema estricto"* y, tres slides después, *"basada en
   **esquemas** BSON"*. BSON es un formato, no un esquema; la tensión es de vocabulario.
5. **Slide 34 vs. slide 48.** El 34 **embebe** los comentarios en el post; el 48 los pone en **otra
   colección** y el 49 los junta con `$lookup`. Son los dos modelos —embebido y normalizado— del
   tema oficial de la fecha, mostrados **sin decir que son alternativas** ni cuándo va cada uno. La
   [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] es la respuesta.
6. **Slide 38 vs. slide 39.** El 38 inserta con `_id` explícito *(y roto)*; el 39 inserta **sin
   `_id`** y funciona. El deck nunca dice que la segunda es la forma normal.
7. **Slide 38 vs. slide 46.** El campo autor se llama `by` en el 38 *(y en 42–44)* y **`by_user`** en
   el 46–47. El `GROUP BY by_user` del 47 **no funcionaría** sobre los documentos del 38.
8. **Slide 11 vs. slide 29.** El 11 dice que NoSQL *"no trata con datos críticos que requieren ACID"*;
   el 29 promete de MongoDB *"replicación y soporte a prueba de fallos"* y el 30 *"alta
   disponibilidad"*. No es contradicción estricta *(durabilidad ≠ ACID)*, pero el deck deja al lector
   con la idea de que MongoDB no sirve para datos críticos, y no define qué es "crítico".
9. **Slide 30 vs. su viñeta.** La viñeta dice *"replicación"*; el diagrama muestra **solo sharding**
   *(rangos disjuntos)*. No hay una sola réplica dibujada en todo el deck.
10. **Cuatro nombres de colección** para un mismo ejemplo: `mycol` *(38, 40–44, 46–47)*, `post`
    *(39)*, `posts` *(49)*, `myCollection` *(37, 45)*. El código de ningún slide corre sobre los datos
    del anterior sin renombrar.

## Dudas abiertas

- [ ] 🔴 **¿Cómo quiere la cátedra que se responda "¿MongoDB soporta transacciones ACID?"** El slide 11
      dice que NoSQL *"no trata con datos críticos que requieren ACID"*; Seven Databases A1 *(2018)*
      tabula `Transactions: No`; **MongoDB tiene transacciones multi-documento desde 4.0** *(2018)*.
      ¿Se responde con el deck, con el libro o con la versión actual? Afecta directamente al TPO, donde
      hay que justificar la elección de motor. **Preguntar en la práctica del 22/09.**
- [ ] 🔴 **¿En qué esquina de CAP hay que poner a MongoDB y a Redis en el parcial?** El slide 18 dice
      CP para los dos; Corbellini Table 2 dice **AP y CP** para MongoDB y **AP** para Redis. La
      respuesta técnica es *"depende de la configuración"*, pero un parcial de opción múltiple no admite
      eso. Ver § *Slide 18*.
- [ ] 🔴 **¿Qué versión de MongoDB corre la cursada, y se acepta la sintaxis vieja del deck?** El deck
      usa `insert()`, `count()`, `update({multi:true})`, `remove()` y muestra salidas de antes de 2.6;
      el TP9 usa `mongosh` *(≥ 5.0)*, donde **`insert()` está deprecado** *(corre, con
      `DeprecationWarning`)*. Si un alumno copia el slide 38 en `mongosh`, **falla una vez, por el
      `ObjectId` inválido**; el `insert` pasa con advertencia. Conviene saber si en el parcial se corrige
      `insert()` o se acepta.
- [ ] 🔴 **¿"Familia de columnas" se dicta como column store o como wide-column?** El slide 24
      dibuja un column store *(tabla partida por columnas)* y el título dice *familia de columnas*
      *(BigTable/Cassandra)*. Cassandra llega el 28/09 con el modelo wide-column; si la cátedra usa
      "columnar" para las dos cosas, hay que tenerlo claro antes.
- [ ] **¿Entra la implementación de la consistencia eventual (N/W/R, quórum, read-repair)?** El deck
      da BASE como concepto y nada de mecanismo; Corbellini § 3.2 y Table 3 lo dan entero. Es material
      con forma de pregunta de parcial y no está en ningún slide de este deck.
- [ ] **¿Hasta dónde llegan los índices de MongoDB en la cursada?** El slide 29 dice *"soporte de
      índices"* y es la única mención en 52 slides; el 13 no los toca y la
      [[Clase 14 - MongoDB Features]] sí los desarrolla *(índice `_id` por defecto, `getIndexes()`,
      single-field indexes)*. Falta saber si el TP9 Parte II *(22/09)* los ejercita y si entran
      compuestos o de texto. Complemento: Seven Databases cap. 4 § *Indexing: When Fast Isn't Fast
      Enough* *(impresas 110–114)* y [[1.08.02 - Índices|Índices]].
- [ ] **¿Qué operadores de consulta, además de los seis del slide 41, se dan por sabidos?** `$in`,
      `$exists`, `$regex`, `$elemMatch`, `$size` y la **proyección** *(segundo argumento de `find`)*
      no aparecen en el deck y el TP9 los va a necesitar. Confirmar en [[Práctica 2026-09-15]] cuáles
      pide el enunciado.
- [ ] **¿Se toma `$lookup` como "el join de MongoDB", o se enseña que hacer joins es señal de mal
      modelado?** El slide 49 lo presenta sin juicio; la doctrina de MongoDB *(y la Clase 13)* es que
      si se necesita `$lookup` a menudo, probablemente había que embeber.
- [ ] **¿Por qué el deck no trae bibliografía, versión ni fecha?** Es el primer deck del vault con
      **cero** referencias. La [[Clase 09 - Restricciones integridad-Parte 1]] citaba el manual de
      PostgreSQL; éste no cita ni la documentación de MongoDB de la que copia cuatro capturas. Afecta al
      mapeo de [[_index-bibliografia]] › Clase 12: todo lo que se cite es propuesta del vault.
- [ ] **Persistencia políglota**: el slide 10 *("diferentes DBs NoSQL para diferentes proyectos")* y
      el 28 son el mismo argumento de la [[Práctica 2026-08-04]], y la página
      [[2.12.03 - Persistencia políglota|Persistencia políglota]] que esa práctica enlaza **sigue sin existir**. ¿Se crea como concepto
      de la U1 *(donde se dictó, 04/08)* o como `2.12.NN`? Es una decisión de la etapa de conceptos.

## Enlaces

- Clase anterior: [[Clase 11 - Seguridad-Transacciones]] *(07/09 — la última relacional; su ACID es el
  contraste de los slides 11 y 20)* · clases hermanas del mismo lunes 14/09:
  [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] *(el desarrollo de los slides 6, 27, 34 y 48)* ·
  [[Clase 14 - MongoDB Features]] *(`_id`/`ObjectId`, sharding vs. replication, MapReduce, y el
  material complementario)*
- Práctica de esa semana (martes 15/09): **[[Práctica 2026-09-15]]** — TP 9 MongoDB Parte I *(con
  `mongosh`, `insertOne`, `deleteMany`: la API que este deck no usa)*
- Conceptos que **nacen** en esta clase *(nombres propuestos; los fija la etapa de conceptos)*:
  [[2.12.01 - NoSQL — origen, propiedades y taxonomía|NoSQL]] ·
  [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal, sharding y replicación]] ·
  [[2.12.04 - Teorema CAP|Teorema CAP]] ·
  [[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]] ·
  [[2.12.06 - Modelo de documentos — JSON, BSON y ObjectId|Modelo de documentos]] ·
  [[2.12.07 - CRUD y consultas en MongoDB|Consultas en MongoDB]] ·
  [[2.12.08 - Aggregation pipeline|Aggregation pipeline]]
- Conceptos de la primera mitad que esta clase **reencuadra**:
  [[1.06.01 - Vistas|Vistas]] *(la vista de MongoDB, slides 50–52)* ·
  [[1.11.03 - Transacciones y ACID|Transacciones y ACID]] *(el contraste con BASE)* ·
  [[1.02.02 - Modelo Entidad-Relación|MER]] y
  [[1.03.01 - Derivación de MER a esquema relacional|derivación]] *(lo que el slide 4 niega y el 33–34
  reemplaza)* · [[1.03.02 - DDL — creación y alteración de tablas|DDL]] *(sin `CREATE TABLE`)* ·
  [[1.08.02 - Índices|Índices]] *(nombrados en el slide 29, no desarrollados)* ·
  [[1.05.01 - SQL — consultas|SQL — consultas]] *(los "En SQL:" de los slides 41–47)*
- Marco previo: [[Práctica 2026-08-04]] § *Persistencia políglota* *(los seis factores de decisión, de
  los que este deck fundamenta disponibilidad, consistencia y escalabilidad)* ·
  [[2.12.03 - Persistencia políglota|Persistencia políglota]] *(pendiente)*
- Motores: [[MongoDB]] *(a crear: la traducción `mongo` → `mongosh` y el detalle de BSON, replica sets,
  sharding)* · [[MySQL]] § *(MEDIUMINT / AUTO_INCREMENT del slide 32)* · [[PostgreSQL]] § *Inventario*
  *(fila del deck 12: Oracle heredado, sin PostgreSQL)*
- Bibliografía verificada contra las fichas: [[Seven Databases in Seven Weeks — ficha|Seven Databases]]
  cap. 1 § *The Genres* *(impresas 3–8)* · cap. 4 *(MongoDB, 93–133: `4.2` CRUD and Nesting, `4.3`
  Aggregated Queries 115–117, `4.4` Replica Sets 124–127 y Sharding 127–130, GridFS 131–132)* ·
  cap. 9 § *Genres Redux* y § *Making a Choice* *(305–309)* · A1 *(311–314)* · **A2 The CAP Theorem**
  *(315–318)* — [[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini]] § 1 *(pp. 1–4)*,
  **§ 3.1 CAP** *(4–5)*, **§ 3.2 ACID y BASE** *(5–7)*, Table 2 *(5)*, Table 3 *(6)*, § 4 y § 4.1
  *(7–8)*, § 5 y § 5.1 *(11–12)*, § 6 *(14–16)*, § 7 *(16–19)*, § 8 *(19–20)* —
  [[Database Systems The Complete Book — ficha|GMUW]] cap. 20.3 *Distributed Databases* *(impresa
  997)* y 20.3.3 *Data Replication* *(999)* como fundamento relacional de la distribución, y 11.1
  *Semistructured Data* *(483)* para el modelo de documentos —
  [[Date - An Introduction to Database Systems — ficha|Date]] cap. 21 *Distributed Databases*
  *(647)*, § 21.3 *The Twelve Objectives* *(652)* — [[Silberschatz - Fundamentos de Bases de Datos Cap 1 — ficha|Silberschatz cap. 1]]: **—**
  *(su índice, § 1.1–1.11, no tiene ninguna sección sobre NoSQL ni sistemas distribuidos; la ficha
  registra que la última época que trata es "finales de los 90")*
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]] · reglas: [[CLAUDE]]
