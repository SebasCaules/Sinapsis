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

## Resumen general

Primer deck de la mitad NoSQL: 52 slides del lunes 14/09, junto con las Clases 13 y 14, ejercitados
en el TP 9 MongoDB Parte I del martes 15/09. Tres bloques: qué es NoSQL y por qué existe
*(slides 2–11)*, CAP y BASE *(slides 12–20)*, géneros y MongoDB *(slides 21–52)*. La mitad conceptual
no envejeció; la de código usa la API vieja del shell `mongo` y se lee traducida a `mongosh`, el shell
del TP9.

Para el parcial: NoSQL surge por volumen y latencia web y se define por negación —sin esquema
impuesto por el motor, distribuido *(hash → nodo)*, escalable horizontalmente en máquinas baratas—.
En CAP la tolerancia a particiones no se elige: la decisión real es C o A, CA describe un sistema no
distribuido y la esquina de un motor depende de su configuración *(el deck: MongoDB y Redis en CP;
Corbellini Table 2: MongoDB en AP y CP, Redis en AP)*. BASE *(Basically Available, Soft-State,
Eventual Consistency)* es lo que queda al elegir AP. Cuatro géneros: grafo, familia de columnas,
clave-valor y documento. Criterio SQL vs. NoSQL: ¿cabe en un servidor y va a seguir cabiendo?
¿Necesita ACID?

Trampas: el slide 6 ilustra un join materializado *(desnormalización)*, no ausencia de esquema; el
schemaless real es el slide 27. El slide 24 dibuja un column store, no una familia de columnas
*(Cassandra)*. *"Maestro-esclavo"* fue eliminado en MongoDB 4.0: hoy son replica sets. En el shell,
`insert`, `update({multi:true})`, `remove` y `count` están deprecados *(→ `insertOne/Many`,
`updateMany`, `deleteMany`, `countDocuments`)*; `ObjectId(7df78ad8902c)` no corre en ninguna versión
y la salida `{result: […], ok: 1}` es anterior a 2.6. No hay `CREATE`: base y colección nacen con el
primer documento. `$group` es el `GROUP BY`, `$lookup` el `LEFT JOIN` y las vistas, pipelines de solo
lectura.

## Fuente, motor y alcance

> [!info] Fuente
> `raw/Unidad-02/Teorica/BD2_Clase 12 - Introduccion a NoSQL.pdf` · **52 slides** · PowerPoint 2010,
> título interno *"Introducción a Bases de Datos NoSQL"*. El slide 1 es la portada; el recorrido va
> del 2 al 52. **No hay slide de agenda, de cierre ni de bibliografía** *(la
> [[Clase 09 - Restricciones integridad-Parte 1]] tenía uno; la
> [[Clase 10 - Restricciones integridad-Parte 2]] cerraba con dos links)*.
> Dictado en la **teórica del lunes 14/09**, junto con [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] y
> [[Clase 14 - MongoDB Features]]: **tres decks numerados para una sola fila del [[_cronograma]]**,
> cuyo tema oficial es *"Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción
> a MongoDB · MongoDB: Enfoque embebido vs Normalizado · Ejemplos con MongoDB"*. El `12` del nombre del
> archivo es el número de clase. Clase anterior: [[Clase 11 - Seguridad-Transacciones]] *(07/09, la
> última relacional)*. Se practica con el **TP 9 MongoDB Parte I** del martes 15/09 →
> [[Práctica 2026-09-15]]. Bibliografía: [[_index-bibliografia]] › Clase 12.
>
> Es el **primer archivo de `raw/Unidad-02/`**: el corte entre unidades cayó exactamente entre la
> mitad relacional *(Clase 11 → `Unidad-01`)* y la mitad NoSQL *(Clase 12 → `Unidad-02`)*, la hipótesis
> que [[_index-clases]] anotaba desde el 25/08. Los conceptos que nacen en este deck llevan prefijo
> **`2.12.NN`**.

> [!warning] (crítico) Motor: el deck es de **MongoDB** —el motor correcto de esta mitad— pero escrito en la **API vieja del shell `mongo`**
> Con esta clase el vault deja de traducir de PostgreSQL a [[MySQL]] y pasa a traducir de
> **[[MongoDB]] viejo a MongoDB actual**: un desfasaje de **versión**, no de motor. El **TP9**
> ([[Práctica 2026-09-15]]) usa **`mongosh`** —el shell que reemplazó a `mongo` en la versión 5.0
> (2021) y que **marca como deprecados los helpers viejos** *(`insert`, `update`, `remove`, `count`
> siguen ejecutándose, con `DeprecationWarning`)*— y trabaja con `insertOne`, `deleteMany` y
> `getCollectionNames`. Evidencia slide por slide:
>
> | Lo que escribe el deck | Dónde | Qué pasa hoy en `mongosh` |
> | --- | --- | --- |
> | `db.myCollection.insert({…})`, `db.mycol.insert({…})`, `db.post.insert([…])`, `db.users.insert(…)` | slides **32, 37, 38, 39** | `insert()` está **deprecado desde 3.2**; en `mongosh` **sigue ejecutándose con `DeprecationWarning`** → `insertOne()` / `insertMany()` |
> | `db.users.count()` · `db.users.find().count()` | slide **32** | `count()` deprecado → `countDocuments()` / `estimatedDocumentCount()` |
> | `db.users.update({…}, {$set: …}, {multi: true})` | slide **32** | `update()` deprecado → `updateMany()` *(el `{multi:true}` es justamente lo que `updateMany` reemplaza)* |
> | `db.users.remove({…})` | slide **32** | `remove()` deprecado → `deleteMany()` / `deleteOne()` |
> | `ObjectId(7df78ad8902c)` | slides **38, 40, 42, 43, 44, 46** | **No corre en ninguna versión**: `ObjectId` toma un *string* de **24** dígitos hexadecimales entre comillas; esto son 12 sin comillas → `SyntaxError` |
> | `aggregate(…)` que devuelve `{ "result" : [ … ], "ok" : 1 }` | slide **47** | Formato de salida **anterior a MongoDB 2.6** (2014): desde entonces `aggregate` devuelve un **cursor** y el shell imprime los documentos sueltos |
> | *"Puede trabajar en modo **maestro-esclavo**"* | slide **29** | La replicación *master-slave* fue **eliminada en 4.0** (2018); lo que existe son los **replica sets** *(que el slide 30 dibuja sin nombrarlos)* |
> | `find().pretty()` | slides 40, 41, 44 | Sigue existiendo, pero en `mongosh` es un *no-op*: la salida ya viene formateada |
>
> Vigente tal cual: `use`, `db`, `show dbs`, `db.dropDatabase()`, `db.createCollection()`, `drop()`,
> `find()`, los operadores `$lt`/`$lte`/`$gt`/`$gte`/`$ne`, `$and`/`$or`, `sort()`, `aggregate` con
> `$group`/`$sum`, **`$lookup`** *(3.2+)* y **`db.createView`** *(3.4+)*. La mitad conceptual (2–31) no
> envejeció; la mitad de código (32–52) se lee con la tabla de arriba al lado. La traducción completa
> vive en [[MongoDB]].
>
> Además, el único `CREATE TABLE` del deck *(slide 32)* mezcla `id MEDIUMINT NOT NULL AUTO_INCREMENT`
> *(MySQL)* con `age Number` *(Oracle)* en la misma sentencia: copia literal del *SQL to MongoDB Mapping
> Chart* de la documentación oficial, que ya viene así. Ver § *Slide 32*.

> [!note] El deck es **casi todo imagen**
> `pdfimages -list`: **39 imágenes embebidas**, tres de adorno en la portada y **36 repartidas en 33
> slides** *(el 48, el 50 y el 51 llevan dos)*. Solo **18 slides** son texto vivo: 2, 3, 4, 10, 11, 12,
> 14, 15, 16, 17, 20, 22, 26, 31, 35, 36, 37 y 45. `pdftotext` devuelve **929 palabras** y, de la
> segunda mitad *(32–52)*, solo los títulos, los comentarios *"En SQL: …"* y los comandos de los cuatro
> slides de texto vivo *(35, 36, 37 y 45)*: el código de los otros 17 slides de ejemplos, la tabla del
> 32, el E-R del 33, los Venn de CAP (13 y 18), la taxonomía (21), los ejemplos de géneros (23, 24, 25,
> 27) y la tabla del 28 están en captura. Todo lo que sigue sale de los 52 PNG renderizados.

> [!important] (clave) Reparto con las dos clases hermanas del mismo lunes
> | Tramo del tema oficial | Deck | Qué cubre |
> | --- | --- | --- |
> | *"Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL"* | **éste, slides 2–28** | por qué surge, propiedades, CAP, BASE, los cuatro géneros, SQL vs. NoSQL |
> | *"Introducción a MongoDB"* | **éste, slides 29–52** | características, arquitectura, CRUD, operadores, `aggregate`, `$lookup`, vistas |
> | *"MongoDB: Enfoque embebido vs Normalizado"* | [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] | embeber vs. referenciar, el límite de 16 MB y los 100 niveles |
> | *"Ejemplos con MongoDB"* | [[Clase 14 - MongoDB Features]] + el material complementario | `_id`/`ObjectId`, features, sharding vs. replication, MapReduce, consigna de e-commerce |
>
> Los **slides 33–34** *(el E-R de `post`/`comments`/`tag_list` convertido en un documento con arreglos
> embebidos)* son la introducción de una página al tema que el deck 13 desarrolla en 28 slides.

> [!important] (clave) Lo que este deck **no** trae
> - **Ninguna versión de MongoDB**; la sintaxis delata una anterior a 2.6. La
> [[Clase 14 - MongoDB Features]] sí trae número de versión.
> - **Ninguna definición de "documento", "colección" ni "BSON"** más allá de nombrarlos *(slides 26 y
> 29)*. `ObjectId`, `_id` y el peso máximo de un documento están en los decks 13 y 14.
> - **Ni `insertOne`, ni `updateOne`, ni `deleteOne`**: la API con la que el TP9 hace trabajar.
> - **Ni índices en MongoDB** *(el slide 29 dice "soporte de índices" y no vuelve)*, ni *replica sets*
> por su nombre, ni *MapReduce*, ni `$match`/`$project` en el pipeline *(salvo el `$project` de la
> vista del slide 51)*.
> - **Ni una palabra sobre transacciones en MongoDB**: el slide 11 dice que NoSQL *"no trata con datos
> críticos que requieren ACID"* y lo deja ahí. Ver § *Contradicciones* y § *Dudas abiertas*.

---

## Slide 1 · La portada

> [!quote] Textual, completo
> *"**Introducción a Bases de Datos NoSQL**"*
> *"Bases de Datos II"*

Fondo azul del tema *"Flujo"* de PowerPoint 2010 y logo del ITBA: **plantilla distinta de la de los
decks 01–11** *(fondo blanco con banda superior)*, lo que sugiere otra autoría u otra época para el
material NoSQL, coherente con la versión vieja de MongoDB del código. **Sin subtítulo, sin fecha, sin
nombre de docente.**

## Slide 2 · Introducción

> [!quote] Textual
> - *"Surge para perfeccionar las BD con exceso de datos, que necesitan un gran indexado de documentos"*
> - *"Con el crecimiento de la web en tiempo real existía una necesidad de proporcionar información
> procesada a partir de grandes volúmenes de datos"*

Dos ideas: **volumen** y **latencia**. Es la motivación con la que abre
[[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini § 1]] *(pp. 1–4)*: los RDBMS no
alcanzaron para la escala web. El paper además da el **origen del término**, acuñado por Carlo Strozzi
en 1998 para otra cosa y resucitado en 2009 por Eric Evans.

> [!note] *"gran indexado de documentos"* describe al género **documental** —y a MongoDB, que ocupa los
> últimos 24 slides—. El deck se llama "Introducción a NoSQL" pero ya está pensando en MongoDB.

## Slide 3 · Por qué surgen las bases NoSQL

> [!quote] Textual — los cinco motivos
> - *"Poca eficiencia en aplicaciones en las BD relacionales"*
> - *"Aumento de operaciones de lectura y escritura"*
> - *"Gran conjunto de transacciones"*
> - *"Sentencias complejas"*
> - *"Dificultades en la escalabilidad del sistema"*

Los cinco son síntomas del mismo diagnóstico: el relacional —esquema fijo, `JOIN`, ACID, un servidor—
**no escala horizontalmente sin esfuerzo**.

| Motivo del slide | Qué hay detrás | Dónde se desarrolla |
| --- | --- | --- |
| *"poca eficiencia"*, *"sentencias complejas"* | los `JOIN` de un esquema normalizado se pagan en cada lectura; en un grafo, *"un join por arista"* | Corbellini § 7 *(p. 16)*; [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] |
| *"aumento de lectura y escritura"* | el cuello de botella es el **servidor único** → escalar hacia afuera | slide 9 de este deck; Corbellini § 1 *(Scalability)* |
| *"gran conjunto de transacciones"* | ACID sobre muchos nodos exige **2PC**, que multiplica la indisponibilidad | Corbellini § 3.2 *(pp. 5–7)* |
| *"dificultades en la escalabilidad"* | el relacional escala **verticalmente**; NoSQL, horizontalmente | slides 9–10 |

> [!warning] El slide diagnostica **sin decir contra qué escala**
> Corbellini § 8 *(pp. 19–20)* pone el matiz: **en escala baja o media, un RDBMS alcanza** —*"no es el
> martillo de Maslow"*— y RDBMS y NoSQL son **complementarios**. El **slide 28** dice lo mismo
> veinticinco slides después. Para el parcial hacen falta las dos mitades: *por qué* NoSQL y *cuándo no*.

## Slide 4 · Modelo no relacional

> [!quote] Textual — la definición, por negación
> - *"Sistema de almacenamiento de información"*
> - *"No cumple con el esquema entidad-relación"*
> - *"No impone una estructura de datos"*
> - *"Almacena los datos en diferentes formatos"*

Tres de las cuatro viñetas son negativas: se define por lo que no es. El *"esquema entidad-relación"*
es el [[1.02.02 - Modelo Entidad-Relación|MER]] de la Clase 02 más su
[[1.03.01 - Derivación de MER a esquema relacional|derivación]] a tablas de la Clase 03: el modelo no
relacional **no pasa por esa etapa** de [[1.02.01 - Etapas del diseño de datos|diseño]], o la pasa de
otra forma *(slide 33: un E-R que se convierte en un solo documento)*. La única viñeta afirmativa
anticipa el slide 21: *columna, documento, clave-valor, grafo* son cuatro **formatos** distintos.

> [!important] *"No impone una estructura de datos"* **no significa "sin estructura"**
> Todos los ejemplos que siguen **tienen** estructura *(el JSON del slide 6, los nodos del 23, las
> columnas del 24, las duplas del 25, los documentos del 27)*: lo que no hay es una estructura
> **declarada de antemano y validada por el motor** *(el `CREATE TABLE` de la
> [[1.03.02 - DDL — creación y alteración de tablas|Clase 03]])*. La estructura se mueve **del motor a
> la aplicación**; el slide 25 lo dice textualmente para clave-valor: *"validación de los datos en la
> aplicación cliente"*. Seven Databases cap. 1 § *The Genres* *(impresas 3–8)* lo formula como que cada
> género se adapta a distintos problemas, no como ausencia de forma.

## Slide 5 · ¿Qué bases NoSQL conocen?

> [!quote] Textual
> *"Qué bases NoSQL conocen?"* *(sin el signo de apertura)*

Slide de participación: una sola imagen con **siete logos**:

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
dictan *(14/09 → 06/10, 19/10, 26/10, según [[_cronograma]])*; CouchDB está en el programa y en Seven
Databases cap. 5 pero **no se dicta**. Los otros dos son piezas de museo: **Riak** fue eliminado de la
2ª edición de Seven Databases *(recuadro *No More Riak?*, impresa 5)* y **membase** se fusionó en
Couchbase en 2011. La imagen delata la fecha del material tanto como la sintaxis del shell.

> [!tip] Ninguno de los siete logos trae etiqueta de género. Ponérsela —con el slide 21 y la Table 1 de
> Corbellini *(p. 3)*— es el tipo de pregunta que puede aparecer en el parcial.

## Slides 6–9 · Propiedades

Cuatro slides con el mismo título, **una propiedad por slide y una imagen por propiedad**: la
definición positiva que el slide 4 no daba.

| Slide | Propiedad *(textual)* | Cómo la ilustra |
| --- | --- | --- |
| 6 | *"Ausencia de esquema en los registros de datos"* | dos tablas relacionales **+** un `=` **→** un documento JSON |
| 7 | *"Alta velocidad de respuesta a peticiones"* | cronómetro, un cilindro de base, flecha hacia un grupo de laptops |
| 8 | *"Estructura distribuida"* | tres datos → *función hash* → tres claves → nodos en una nube |
| 9 | *"Escalabilidad"* | *Vertical* ✗ vs. *Horizontal* ✓ |

### Slide 6 · Ausencia de esquema — el ejemplo, transcripto entero

La imagen es una tabla doble que `pdftotext` no lee, y contiene el único ejemplo relacional del bloque
conceptual:

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

La fila **1** de *Usuario* y la fila **2** de *Dirección* están recuadradas: son las dos que el `=`
combina. *(Los códigos son venezolanos —CCS/DC Caracas 0212, MBO/ZL Maracaibo 0261, LAS/NE La
Asunción 0295—, la misma procedencia que "Guarenas" y el "0212-…" del slide 27.)* Un detalle
correcto: `"ID": 1` va sin comillas *(número)* y `"Cod_Area": "0212"` con comillas *(string, para
conservar el cero inicial)*.

> [!warning] (crítico) Lo que el ejemplo muestra **no es "ausencia de esquema": es un `JOIN` materializado**
> La imagen muestra **dos tablas normalizadas** —`Usuario` con clave foránea `Id_CArea` hacia
> `Dirección`— y **el resultado de unirlas** guardado como un documento. Eso es **desnormalización** o
> **embebido**, el tema entero de la [[Clase 13 - NoSQL-EmbebidosVSNormalizado]]; y el documento tiene
> un esquema perfectamente definido: seis campos con nombre. Lo que sí ilustra "ausencia de esquema" es
> el **slide 27**: dos documentos de la misma colección con campos distintos. Para el parcial, dos ideas
> separadas:
> - **Sin esquema** *(schemaless)*: el motor no exige que todos los registros tengan los mismos campos.
> - **Desnormalizado / embebido**: un registro guarda lo que en relacional serían varias tablas unidas.
>
> Corbellini § 6 *(pp. 14–16)* las trata como dos cosas: documentos *"semiestructurados"* **y**
> *"schemaless"*, más el ejemplo de un JSON que **evoluciona** agregando campos.

### Slide 7 · Alta velocidad de respuesta

Solo imagen: cronómetro, cilindro de base con ceros y unos, flecha hacia cuatro laptops y un servidor
en una nube. **No hay número, comparación ni argumento**: la velocidad se afirma, no se explica.

> [!note] De dónde sale la velocidad, que el slide no dice
> De los otros tres slides de propiedades: **sin `JOIN`** *(slide 6)*, **repartido entre nodos**
> *(slide 8)* y **con más máquinas** *(slide 9)*. No es una propiedad independiente sino la consecuencia
> de las otras tres. Corbellini § 2 *(p. 4)* cita el único dato duro del vault: en el benchmark de
> Todurica & Bucur, **Cassandra y HBase mantienen la latencia constante** a carga alta, mientras que
> **MySQL y Sherpa la aumentan**.

### Slide 8 · Estructura distribuida — el diagrama, transcripto

Dos columnas de rótulos —*Data* y *Clave*— y tres filas:

| Data *(caja roja)* | → | *(caja ocre)* | → | Clave *(caja verde)* | → |
| --- | :---: | --- | :---: | --- | --- |
| *Zorro* | → | *Función Hash* | → | `DFCD3454` | → nodo en la nube |
| *El zorro **corre** por el hielo* | → | *Función Hash* | → | `52ED879E` | → nodo |
| *El zorro rojo **camina** por el hielo* | → | *Función Hash* | → | `46042841` | → nodo |

A la derecha, una nube con **tres servidores** y un cilindro de base al que llegan flechas desde los
tres. *("corre" y "camina" van subrayadas: son las palabras que cambian, y aun así los hashes no se
parecen en nada — la ilustración clásica de una función hash criptográfica, tomada de Wikipedia.)*

> [!important] **Primera aparición del sharding por hash en la cursada**, sin la palabra
> El hash del dato decide **en qué nodo vive**. Es lo que Corbellini § 4 *(pp. 7–8)* describe como
> *"tablas hash distribuidas"* con `get(key)` / `put(key, value)`, y lo que § 4.1 *(p. 8)* refina como
> **consistent hashing** —el anillo de claves `[0, K)` con rangos por nodo— para que agregar o quitar un
> nodo no obligue a remapear todo. La palabra **"sharding"** recién aparece en el **slide 30**, y ahí el
> reparto es **por rango de clave** (`0…25`, `26…50`, …): **el deck muestra las dos estrategias de
> particionado sin nombrar ninguna**. La comparación queda para
> [[2.12.02 - Escalabilidad horizontal — sharding y replicación|el concepto]] y para el material
> complementario de la [[Clase 14 - MongoDB Features]].

### Slide 9 · Escalabilidad — vertical ✗, horizontal ✓

Dos paneles. **"Vertical", con ✗**: un servidor que crece hasta un rack grande oscuro; abajo,
*Servidor* `CPU · 1 GB RAM` → *Escala* → `CPU · CPU · 1 GB RAM · 1 GB RAM`. **"Horizontal", con ✓**: un
servidor → dos → **doce** iguales; abajo, **tres** servidores separados, `CPU · 1 GB RAM`,
`CPU · 4 GB RAM`, `CPU · 2 GB RAM`.

| | Vertical *(scale up)* | Horizontal *(scale out)* |
| --- | --- | --- |
| Qué se agranda | **la misma máquina**: más CPU, más RAM | **la cantidad de máquinas** |
| Límite | físico y de precio: hay un servidor más grande, hasta que no lo hay | el software: hay que **repartir** los datos *(slide 8)* y **replicarlos** *(slide 30)* |
| Falla | un solo punto | tolerada, si hay réplicas |
| Veredicto del deck | ✗ | ✓ |

Los tres servidores del panel horizontal son **distintos entre sí** *(1, 4 y 2 GB)*: es la viñeta
*"clusters de máquinas baratas"* del slide 10 dibujada, sin hardware uniforme ni de alta gama. Este
slide responde a la última viñeta del slide 3 y es la premisa de la primera del slide 10.

## Slide 10 · Ventajas

> [!quote] Textual — las seis
> - *"Estos sistemas responden a las necesidades de **escalabilidad horizontal** que tienen cada vez
> más empresas"*
> - *"Pueden manejar enormes cantidades de datos"*
> - *"No generan cuellos de botella"*
> - *"Escalamiento sencillo"*
> - *"Diferentes DBs NoSQL para diferentes proyectos"*
> - *"Se ejecutan en clusters de máquinas baratas"*

Cuatro de las seis son **la misma ventaja dicha cuatro veces** *(escalabilidad horizontal)*. Las otras
dos valen más:

- **"Diferentes DBs NoSQL para diferentes proyectos"** es **persistencia políglota**: el marco entero
  de la [[Práctica 2026-08-04]] § *Marco conceptual*, con sus seis factores de decisión *(tipo,
  durabilidad, disponibilidad, consistencia, escalabilidad, seguridad)*. Este deck da el fundamento
  de tres de ellos —disponibilidad, consistencia, escalabilidad— en los slides
  12–20. Fuentes: Seven Databases cap. 1 § *Polyglot* *(impresas 7–8)* y Corbellini § 8 *(capas
  híbridas, pp. 19–20)*.
- **"Clusters de máquinas baratas"** es el argumento económico: *commodity hardware*, lo que hace
  viable el panel derecho del slide 9.

> [!warning] *"No generan cuellos de botella"* es una **sobreafirmación**
> Un sistema distribuido no elimina los cuellos de botella: los **mueve** del servidor único a la
> **red**, que es justamente lo que el teorema CAP formaliza dos slides después. El propio slide 17 va
> a decir que cuando *"se pierde la comunicación entre nodos"* hay que resignar consistencia o
> disponibilidad. No repetir la viñeta en un examen sin ese matiz.

## Slide 11 · Desventajas

> [!quote] Textual — las cuatro
> - *"No son suficientemente maduros para algunas empresas"*
> - *"Falta de experiencia"*
> - *"No trata con datos críticos que requieren ACID"*
> - *"Problemas de compatibilidad"*

Dos son de mercado *(madurez, experiencia)*, una de interoperabilidad *(cada motor tiene su API: el
`find()` de MongoDB, el CQL de Cassandra, el Cypher de Neo4j; no hay un SQL común)* y **una es técnica y
es la que importa**: *"no trata con datos críticos que requieren ACID"*.

> [!important] (crítico) *"No trata con datos críticos que requieren ACID"* — leerlo con fecha
> Es la afirmación con más carga del deck y la que más envejeció; está en singular, como si NoSQL fuera
> un solo sistema, y sin fecha.
>
> - **Es la posición clásica**, la que fundamenta el slide 20 *("los sistemas ACID fuerzan la
> consistencia… BASE gana disponibilidad perdiendo parte de la consistencia")*. Corbellini § 3.2
> *(pp. 5–7)* la explica con el costo de **2PC**: un commit sobre dos nodos al 99,9 % de
> disponibilidad cada uno da **99,8 %**.
> - **Ya no es cierta para MongoDB en general.** La tabla A1-6 de Seven Databases *(impresa 314,
> versión 3.6 de 2018)* lo tabula con `Transactions: No`; **desde 4.0 (2018) MongoDB tiene
> transacciones multi-documento** y desde 4.2 también sobre clusters *sharded*. Lo que sigue valiendo
> desde siempre es la **atomicidad por documento** *(Corbellini § 6, p. 15)*, que es por qué embeber
> importa tanto en la [[Clase 13 - NoSQL-EmbebidosVSNormalizado]].
> - El ACID de la Clase 11 ([[1.11.03 - Transacciones y ACID|Transacciones y ACID]]) es el contraste
> que este slide da por sabido; el deck no define ACID en ningún lado, solo lo nombra aquí y en el
> slide 20. Cómo responder "¿MongoDB soporta transacciones?" en el parcial va a § *Dudas abiertas*.

## Slide 12 · Teorema CAP

> [!quote] Textual
> - *"Un compromiso fundamental que afecta a cualquier sistema distribuido obliga a los diseñadores de
> bases de datos a elegir solo dos de estas tres propiedades:"*
> - *"consistencia de datos"*
> - *"disponibilidad del sistema"*
> - *"o tolerancia a las particiones de red"*
> - *"Esta limitación intrínseca de los sistemas distribuidos se conoce como Teorema CAP o teorema de
> Brewer:"*
> - *"Es imposible garantizar simultáneamente **lo siguientes** propiedades en un sistema
> distribuido:"* **[sic]**

**Concepto nuevo en el vault**, y el más importante del deck para el objetivo de la materia. El slide
lo enuncia dos veces y termina con dos puntos que no llevan a nada: la lista de propiedades está
repartida en los slides 14, 15 y 16.

| Letra | Propiedad *(nombre del slide)* | Slide que la define |
| :---: | --- | :---: |
| **C** | consistencia de datos | 14 |
| **A** | disponibilidad del sistema | 15 |
| **P** | tolerancia a las particiones de red | 16 |

**Atribución:** *"teorema de Brewer"*. Corbellini § 3.1 *(pp. 4–5)* lo precisa: **conjetura** de Eric
Brewer en 2000, **formalizada como teorema** por Gilbert y Lynch. Seven Databases lo trata en el
**apéndice A2** *(impresas 315–318)*, *"el único tratamiento sistemático de CAP en la bibliografía
obligatoria"* según la ficha. Ninguna de las dos usa la palabra "compromiso"; el deck traduce
*trade-off*.

## Slide 13 · CAP gráficamente

**Solo imagen.** Diagrama de Venn de tres círculos sobre el fondo de papel de los slides 6–9:
**Consistency** *(rojo, arriba)*, **Availability** *(verde, abajo izquierda)*, **Partition Tolerance**
*(ocre, abajo derecha)*. En las intersecciones de a dos: **CA**, **CP** y, para *Availability ∩
Partition*, las letras **A** / **P** apiladas *(no hay un rótulo "AP" como tal)*; el centro no lleva
rótulo. **Tres flechas**: de **CA** a un cartel **`RDBMS`**; de **CP** y de **A / P** a sendos carteles
**`NoSQL`**.

> [!important] (clave) El mensaje, en una línea: **relacional = CA; NoSQL = CP o AP**
> Es una clasificación de **familias**; la de motores viene en el slide 18. Las dos tienen el mismo
> problema, que se discute ahí: "CA" como categoría real.

## Slide 14 · Consistencia

> [!quote] Textual
> *"Si se cumple este atributo, se garantiza que una vez que se escriben los datos están disponibles y
> actualizados para cada usuario que utilice el sistema"*

**Es la C de CAP, no la C de ACID**, y el deck usa la misma palabra para las dos *(11 y 20 hablan de
ACID; 12–18 de CAP)*:

| | **C de ACID** *([[1.11.03 - Transacciones y ACID\|Clase 11]])* | **C de CAP** *(este slide)* |
| --- | --- | --- |
| Qué garantiza | que una transacción lleva la base de un estado **válido** a otro válido *(restricciones, invariantes)* | que **todos los nodos ven el mismo dato** después de una escritura |
| Contra qué | escrituras que violan reglas | **réplicas desactualizadas** |
| Ámbito | una base, una transacción | un sistema **distribuido** |

La definición del slide es la de **consistencia fuerte**; el contrapeso —**consistencia eventual**—
aparece en el slide 20. Corbellini § 3.1 *(p. 4)* y Seven Databases A2 *(impresas 315–316)* dan la
misma definición.

## Slide 15 · Disponibilidad

> [!quote] Textual
> *"Esta propiedad se refiere a ofrecer el servicio ininterrumpidamente y sin degradación dentro de un
> cierto porcentaje de tiempo"*

La disponibilidad se mide en **nueves** *(99,9 %, 99,99 %)*, no en absoluto. Es la cuenta de Corbellini
§ 3.2 *(pp. 5–7)* para el costo de 2PC *(0,999 × 0,999 = 0,998)*: dos nodos que **tienen que estar los
dos** para responder son menos disponibles que cualquiera solo. "Elegir A" significa responder
**aunque falte un nodo**, con el dato que se tenga. En la formulación de Gilbert y Lynch, *available*
es más fuerte que "un cierto porcentaje": **todo pedido a un nodo vivo recibe respuesta** *(ni error
ni timeout)*.

## Slide 16 · Tolerancia a la partición

> [!quote] Textual
> *"Si el sistema cumple con esta propiedad entonces una operación puede ser completada incluso cuando
> alguna parte de la red falla"*

**"Partición"** aquí es una **partición de la red**: dos grupos de nodos vivos que no pueden hablarse;
no es la partición de tablas ni el sharding. Es la única de las tres propiedades que **no se elige**:
en un sistema distribuido real la red se va a partir, y la única forma de "no tolerar particiones" es
tener **un solo nodo**.

> [!important] (clave) Por eso la elección real es **C o A**, no "dos de tres"
> Corbellini § 3.1 y Table 2 *(p. 5)*: la columna **AC** de su tabla *"está casi vacía"* porque
> resignar P equivale a suponer que la red nunca se parte. Seven Databases A2 dice lo mismo de CA: que
> básicamente significa no distribuido. Lo que el diseñador elige es **qué hacer cuando la red se
> parte**: seguir respondiendo con datos posiblemente viejos *(AP)* o rechazar pedidos hasta que vuelva
> la comunicación *(CP)*.

## Slide 17 · El teorema sólo garatiza *[sic]*

> [!quote] Textual — las tres combinaciones
> - ***CP (Consistency & Partition):** El sistema aplicará los cambios de forma **consistente** y
> aunque se pierda la comunicación entre nodos ocasionando el **particionado**, no se asegura que
> haya disponibilidad*
> - ***AP (Availability & Partition):** El sistema siempre estará **disponible** a las peticiones
> aunque se pierda la comunicación entre los nodos ocasionando el **particionado**, y en consecuencia
> por la pérdida de comunicación existirá inconsistencia porque no todos los nodos serán iguales*
> - ***CA (Consistency & Availability):** El sistema siempre estará **disponible** respondiendo las
> peticiones y los datos procesados serán **consistentes**. En este caso no se puede permitir el
> particionado*

El slide más denso del bloque CAP, y el que hay que saber redactar en un parcial.

| | Qué sacrifica | Qué pasa cuando la red se parte | Ejemplos *(slide 18)* |
| --- | --- | --- | --- |
| **CP** | disponibilidad | los nodos que no pueden confirmar con la mayoría **dejan de responder** *(o responden error)* | MongoDB, HBase, Redis, Memcache |
| **AP** | consistencia | todos responden, con lo que tienen; **las réplicas divergen** hasta que se reconcilien | Riak, Cassandra, CouchDB, DynamoDB |
| **CA** | tolerancia a particiones | *"no se puede permitir el particionado"* — o sea, **no hay red que partir** | MySQL, PostgreSQL |

> [!warning] (crítico) La tercera viñeta describe un sistema que **no es distribuido**, y el slide no lo dice
> *"No se puede permitir el particionado"* significa que **CA es un único nodo** *(o un cluster que
> asume que la red no falla nunca)*. El slide 12 abrió diciendo que CAP *"afecta a cualquier sistema
> distribuido"*: la tercera combinación cae fuera del enunciado. El slide 18 pone a **MySQL y
> PostgreSQL** en CA, correcto **para una instancia única** y engañoso para cualquier despliegue con
> réplicas, que es como se los usa en producción.

## Slide 18 · Clasificación según CAP

**Solo imagen**: el Venn clásico con íconos que circula en decenas de presentaciones sobre NoSQL.
Círculos **Consistency**, **Availability** y **Partition tolerance**; intersecciones **CA** *(azul)*,
**CP** *(rojo)*, **AP** *(verde)*; centro amarillo sin rótulo.

| Combinación | Rótulo de la imagen | Motores listados |
| --- | --- | --- |
| **CA** | *Consistency & Availability* | **MySQL** · **PostgreSQL** |
| **CP** | *Consistency & Partition tolerance* | **HBase** · **MongoDB** · **Redis** · **Memcache** |
| **AP** | *Availability & Partition tolerance* | **Riak** · **Cassandra** · **CouchDB** · **DynamoDB** |

> [!warning] (crítico) Esta clasificación **contradice a Corbellini en dos motores**, y hay que saber cuál se toma
> La **Table 2** de Corbellini *(p. 5, transcripta en su ficha)* clasifica **por configuración**, no
> por etiqueta:
>
> | Motor | Slide 18 | Corbellini Table 2 | Comentario |
> | --- | :---: | :---: | --- |
> | **MongoDB** | CP | **AP y CP** | en las dos columnas porque *"can be configured to provide full consistency guarantees… or eventual consistency"*. Con lecturas en el primario es CP; con lecturas en secundarios, AP |
> | **Redis** | CP | **AP** | replicación master-slave asíncrona → consistencia eventual. La etiqueta CP es discutible: Redis pierde escrituras confirmadas si el master cae antes de replicar |
> | **CouchDB** | AP | AP | coinciden |
> | **Cassandra** | AP | AP | coinciden *(el único wide-column en AP en el paper)* |
> | **HBase** | CP | CP | coinciden |
> | **Riak** | AP | AP | coinciden |
> | **DynamoDB** | AP | — | **"DynamoDB" no aparece en el paper** *(sí Dynamo, § 4.3)*. Seven Databases cap. 7, recuadro *DynamoDB's Consistency Model* *(impresa 215)*, es la fuente |
> | **Memcache** | CP | — | no es una base de datos: es una caché en memoria sin persistencia; el paper la **excluye explícitamente** *(§ 4.4)* |
> | **MySQL / PostgreSQL** | CA | — | el paper no los clasifica; su columna AC está *"casi vacía"* y solo tiene a Infinispan |
>
> **Lección:** la esquina de CAP **no es una propiedad del motor sino de cómo se lo configura**, y
> MongoDB es el ejemplo de manual. Para el parcial: "¿en qué esquina está MongoDB?" → respuesta corta,
> *CP* **por defecto** *(lo que dice el deck)*; respuesta completa, *"CP con lecturas en el primario;
> AP si se habilitan lecturas en secundarios"*. Seven Databases A2 § *CAP in the Wild* *(impresa 317)*
> ubica cada motor con la misma cautela y da una **tercera respuesta para Redis**: lo pone junto a
> PostgreSQL y Neo4j en **CA**, porque no distribuyen datos y la partición no es un problema. Redis es
> **CP** para el slide, **AP** para Corbellini y **CA** para Seven Databases: tres fuentes, tres
> esquinas.

## Slide 19 · Transacciones BASE

**Solo imagen**: cuatro esferas —**B**, **A**, **S**, **E**— alrededor de un cubo rotulado **"Teorema
CAP"**, y a la derecha la expansión:

> [!quote] Textual *(de la imagen)*
> - ***B**assically **A**vailable.* **[sic: "Bassically"]** *(Básicamente Disponible)*
> - ***S**oft-State.* *(Estado suave)*
> - ***E**ventual Consistency.* *(Consistencia eventual)*

El acrónimo está construido para **rimar con ACID** *(ácido / base)*: un juego de palabras de Brewer,
no una sigla técnica. Corbellini § 3.2 *(pp. 5–7)* lo desarrolla y es **la única fuente del vault que
trata ACID y BASE juntos**, según marca su ficha.

| Letra | Qué promete | Lo que renuncia respecto de ACID |
| :---: | --- | --- |
| **BA** | el sistema **responde** siempre, aunque sea con datos parciales o viejos | la atomicidad global: una escritura puede haber llegado a algunos nodos y a otros no |
| **S** | el estado del sistema **puede cambiar sin nuevas escrituras** *(las réplicas se van poniendo al día)* | la durabilidad "instantánea": lo que se lee ahora puede no ser lo último |
| **E** | **con el tiempo**, y sin más escrituras, todas las réplicas convergen al mismo valor | la consistencia inmediata *(la C de CAP)* |

**El cubo "Teorema CAP" en el centro es el argumento:** BASE es lo que queda cuando se elige **AP**.

## Slide 20 · Propiedad BASE

> [!quote] Textual *(el rojo es del slide)*
> - *"Disponibilidad todo el tiempo, un estado flexible y consistencia eventual, por lo que en preciso
> momento puede que no sea consistente pero a lo largo del tiempo será <span style="color:red">eventualmente
> consistente</span>"*
> - *"En conclusión los sistemas ACID fuerzan la consistencia de la base de datos en todo momento
> sacrificando parte de la disponibilidad. Sin embargo <span style="color:red">BASE gana
> disponibilidad</span> perdiendo parte de la consistencia, otorgando un estado de los datos
> <span style="color:red">más flexible</span>"*

Conclusión del bloque teórico *(12–20)*; las tres frases en rojo son la síntesis para el parcial:
**eventualmente consistente · BASE gana disponibilidad · estado más flexible**.

> [!important] (clave) La segunda viñeta es la **tabla de decisión** de toda la segunda mitad
> | | Fuerza | Sacrifica | Esquina CAP | Motores *(slide 18)* |
> | --- | --- | --- | :---: | --- |
> | **ACID** | consistencia en todo momento | parte de la disponibilidad | **CP** *(o CA si no es distribuido)* | MySQL, PostgreSQL *(y MongoDB por defecto)* |
> | **BASE** | disponibilidad todo el tiempo | parte de la consistencia | **AP** | Cassandra, DynamoDB, CouchDB, Riak |
>
> Aquí se cierra la [[Práctica 2026-08-04]]: sus factores *disponibilidad* y *consistencia* **no son
> independientes** — bajo partición, uno se paga con el otro.

**Lo que el slide no da y Corbellini sí:** *cómo* se implementa la consistencia eventual. Corbellini
§ 3.2 *(pp. 6–7)* y Table 3 *(p. 6)* dan el modelo **N / W / R** *(réplicas, escrituras confirmadas,
lecturas consultadas)*: `W + R > N` ⇒ consistencia fuerte; `W + R ≤ N` ⇒ débil; quórum típico
`N/2 + 1`; y las tres políticas de reparación de Cassandra *(read-repair, write-repair,
asynchronous-repair)*. Va a hacer falta cuando llegue Cassandra el 28/09.

---

## Slide 21 · Taxonomía: cuatro categorías principales

**Solo imagen**: una grilla de **4 columnas × 3 logos**:

| **Columna** | **Documento** | **Clave-valor** | **Grafo** |
| --- | --- | --- | --- |
| **cassandra** *(el ojo)* | **mongoDB** | **Amazon DynamoDB** *(en una nube AWS)* | **Neo4j** *(the graph database)* |
| **Apache HBase** *(con el elefante de Hadoop)* | **Couchbase** | **redis** | **OrientDB** |
| **accumulo** | **MarkLogic** | **riak** | **Virtuoso** *(Universal Server)* |

Son **las cuatro categorías canónicas**, con el mismo reparto que Corbellini § 1 *(p. 2)*: *Key-Value ·
Wide Column / Column Families · Document-oriented · Graph-oriented*, cada una con sección propia *(§§ 4,
5, 6, 7)*. Seven Databases cap. 1 § *The Genres* *(impresas 3–8)* lista **cinco** géneros porque agrega
el **relacional**, y cap. 9 § *Genres Redux* *(impresas 305–309)* cierra con un *Good For / Not-So-Good
For* por género que es la mejor guía de elección del vault.

| Categoría *(slide)* | Nombre en Corbellini | Nombre en Seven Databases | Motor de la cursada | Slides de detalle |
| --- | --- | --- | --- | :---: |
| Columna | Wide Column / Column Families *(§ 5)* | Columnar | **Cassandra** *(28/09, 05/10)* | 24 |
| Documento | Document-oriented *(§ 6)* | Document | **MongoDB** *(14/09, 22/09)* | 26–27 |
| Clave-valor | Key-Value *(§ 4)* | Key-Value | **Redis** *(26/10)* · **DynamoDB** *(02/11)* | 25 |
| Grafo | Graph-oriented *(§ 7)* | Graph | **Neo4j** *(19/10)* | 22–23 |

> [!note] La taxonomía es un primer mapa, **no una partición estricta**
> **OrientDB** y **Virtuoso** aparecen bajo *Grafo*, pero Corbellini § 1 *(pp. 1–4)* los nombra como
> bases **multi-layout** *(documento + grafo, RDF + relacional)*; **Couchbase**, bajo *Documento*, es el
> descendiente del *membase* clave-valor del slide 5. Y ningún orden es "el" orden: la grilla va
> *Columna → Documento → Clave-valor → Grafo*, los slides de detalle van **Grafo (22–23) → Columna (24)
> → Clave-valor (25) → Documento (26–27)** y la cursada va *Documento → Columna → Grafo → Clave-valor*.

## Slides 22–23 · BD orientadas a grafos

> [!quote] Textual *(slide 22)*
> - *"La información es representada en nodos"*
> - *"Ya está normalizada"*
> - *"No es necesario definir cantidad de atributos"*
> - *"Registros de longitud variable"*
> - *"Algunas bases: Neo4j, HyperGraphDB"*

Es el único género del que el deck dice *"ya está normalizada"*, y es correcto en un deck que acaba de
vender la desnormalización *(slide 6)*: en un grafo **cada entidad es un nodo y cada relación una
arista**, sin redundancia; por eso los grafos son buenos para lo que en relacional pide muchos `JOIN`
encadenados *(Corbellini § 7, p. 16: recorrer un grafo en un RDBMS cuesta "un join por arista")*.

**Los dos motores nombrados** están en Corbellini § 7 *(pp. 17–18)* y su Table 7 *(p. 17)*: **Neo4J**
*(índices Lucene, MVCC read-committed, sharding manual, SPARQL/Gremlin/Java API — Cypher, su lenguaje
propio, no aparece en el paper; Seven Databases cap. 6 sí lo usa)* y **HypergraphDB** *(que el paper
escribe de tres formas distintas, según anota la ficha)*. Seven Databases cap. 6 es Neo4j entero.

### Slide 23 · Ejemplo — la red social, transcripta

**Solo imagen.** Grafo dirigido con **rótulos en las aristas** y nodos de tres colores:

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

Carolina es amiga de tres personas; Carlos y Ana son a su vez amigos de Sara; Sara tiene una **lista
enlazada de mensajes** *(`Últ.` → el último, `Ant.` → el anterior)*, y los amigos marcan *"Me gusta"*
en mensajes distintos.

> [!tip] Por qué este ejemplo es de grafo y no de documento
> *"¿Qué mensajes les gustaron a los amigos de los amigos de Carolina?"* es **un recorrido de tres
> saltos** *(Carolina → Amigo de → Amigo de → Me gusta)*. En relacional son tres `JOIN` sobre la misma
> tabla de amistades; en un documento habría que embeber amigos dentro de amigos *(y romper el límite de
> anidamiento de la Clase 13)*; en un grafo es **seguir tres aristas**. Las aristas *Amigo de* son
> **dirigidas** *(Carolina → Carlos, no al revés)*: el deck no discute si la amistad es simétrica.

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

Al partir por columnas **desaparecen los nulos** *(Ricky no tiene fila en `Edad`)* y **los multivalores**
*(los tres intereses de Ricky son tres filas con `Id = 1`)*: los dos problemas que en la
[[Clase 03 - Derivación a Esquema Lógico]] obligaban a crear tablas aparte para atributos multivaluados,
resueltos **sin diseñar**.

> [!warning] (nota) El ejemplo ilustra un **column store**, no una **familia de columnas** — y el título dice lo segundo
> | | *Column store* *(lo que dibuja el slide)* | *Column family / wide-column* *(lo que dice el título y lo que es Cassandra)* |
> | --- | --- | --- |
> | Idea | guardar **cada columna de una tabla relacional por separado** en disco *(mejor compresión, mejor para agregar una columna sobre millones de filas)* | cada **fila** tiene su propia **lista de columnas**, agrupadas en **familias**; filas distintas pueden tener columnas distintas; cada celda lleva **timestamp** |
> | Ejemplos | Vertica, Redshift, MonetDB; el motor columnar de MariaDB | **BigTable**, **HBase**, **Cassandra** *(las tres de la columna "Columna" del slide 21)* |
> | Fuente en el vault | — | Corbellini § 5.1 *(pp. 11–12)*: *"arrays de bytes indexados por fila, columna y timestamp; column families (`course:Biology`)"* |
>
> Es un clásico de las introducciones a NoSQL, pero importa **para Cassandra**, que llega el 28/09 con el
> modelo de la derecha *(partition key, clustering columns, familias)*. Seven Databases cap. 1
> § *Columnar* *(impresa 6)* y cap. 3 *(HBase)* describen ese modelo. **Anotado en § *Dudas abiertas*.**

**Los dos motores en la bibliografía:** Cassandra *(Corbellini § 5.2, p. 13 — la única fuente del
vault, y el punto abierto #1 de [[CLAUDE]])* y HBase *(Corbellini § 5.2 y Seven Databases cap. 3)*.

## Slide 25 · BD Clave-Valor

> [!quote] Textual
> - *"Conjunto de duplas (Clave, Valor)"*
> - *"Existen contenedores"*
> - *"Permite variar la estructura de la información"*
> - *"Validación de los datos en la aplicación Cliente"*

Y la **tabla hash** de manual: tres **Claves** —*John Smith*, *Lisa Smith*, *Sam Doe*— y una columna de
*buckets* numerados *(`000`, `001`, `002`, ⋮, `200`, `201`, `202`, ⋮, `886`, `887`, `889` — el dibujo
saltea el `888`)* con tres valores en rojo: `754375` *(junto a `001`)*, `854575` *(junto a `202`)*,
`345435` *(junto a `887`)*. **Las flechas de las dos primeras claves se cruzan**: *John Smith* apunta al
bucket `202` y *Lisa Smith* al `001`. El cruce es el punto del dibujo: un hash **no conserva el orden**
de las claves. Un clave-valor distribuido es la composición de este dibujo y el del slide 8: hash de
la clave → bucket → nodo. Corbellini § 4 *(pp. 7–8)*: *"tablas hash distribuidas: `get(key)` /
`put(key, value)`"*.

| Viñeta | Qué significa | Motor de ejemplo |
| --- | --- | --- |
| duplas (Clave, Valor) | la API entera son dos operaciones: `get`, `put` *(y `delete`)* | todos |
| *"existen contenedores"* | un espacio de nombres para las claves: los *buckets* de Riak, las bases numeradas de Redis, las **tablas** de DynamoDB | Riak, Redis, DynamoDB |
| *"permite variar la estructura"* | el valor es **opaco** para el motor: un string, un JSON, una imagen | todos |
| *"validación en la aplicación cliente"* | **consecuencia de lo anterior**: si el motor no mira adentro del valor, no puede validarlo | todos |

La última viñeta es la formulación más honesta de *"no impone una estructura"* *(slide 4)*: la
estructura **existe, pero la conoce el cliente**. Es lo que separa clave-valor de documental: en
MongoDB el motor **sí** mira adentro del valor *(por eso se consulta por campo, slide 41)*.

**Los tres motores del slide 21 en la bibliografía:** Redis *(Corbellini § 4.4, p. 10; Seven Databases
cap. 8)*, Riak *(Corbellini § 4.4; eliminado de Seven Databases 2ª ed.)*, DynamoDB *(Seven Databases
cap. 7; en Corbellini solo su antecesor Dynamo, § 4.3)*. Redis **no es un clave-valor puro**: sus
valores son estructuras *(listas, hashes, sets, sorted sets)*; Seven Databases lo llama *"data
structure server"* *(cap. 8)*.

## Slides 26–27 · BD orientada a documentos

> [!quote] Textual *(slide 26)*
> - *"Almacena los datos en documentos"*
> - *"Son duplas Clave-(Valor => documento)"*
> - *"No existe un esquema estricto"*
> - *"Los documentos dentro de una colección pueden tener campos diferentes"*

La segunda viñeta es la **definición por herencia**: un documental es un clave-valor **cuyo valor es un
documento que el motor entiende**. Todo lo que MongoDB agrega sobre Redis *(consultas por campo, índices
secundarios, agregación, `$lookup`)* sale de esa diferencia. Corbellini § 6 *(p. 14)*: documentos
**semiestructurados** *(XML / JSON / BSON)*, *schemaless*, consultables por campo e indexables; y
advierte que, a diferencia de BigTable para columnas y Dynamo para clave-valor, **la familia documental
no tiene un diseño de referencia**. La cuarta viñeta es la que el slide 6 debería haber ilustrado, y la
ilustra el 27.

### Slide 27 · El ejemplo — Pepe y María, transcriptos

**Solo imagen.** Un recuadro rotulado **"Contenedor"** *(= la colección)* con **dos hojas** *(= dos
documentos)*, cada una con su ID en un globo:

**ID: 84678**

```json
{
  Nombre: "Pepe",
  Dirección: "C/ San Juan 15",
  Hijos: [
  { Nombre: "Ana",  Edad: 10 },
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

*(Transcripción fiel: claves sin comillas, `"Luís"` con tilde en la i, y los IDs fuera del documento.)*

| Observación | Qué ilustra |
| --- | --- |
| María tiene `Fecha_Nac` y `Teléfono`; Pepe no | **"campos diferentes en la misma colección"** — la viñeta 4 del slide 26. Éste es el "sin esquema" real |
| `Hijos` es un **arreglo de documentos** | la relación **1 : N embebida** — en relacional, una tabla `Hijo` con clave foránea. Puente directo a la [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] |
| el ID está **afuera** del documento | en MongoDB va **adentro**, como campo `_id` *(slide 38 y [[Clase 14 - MongoDB Features]])*. El dibujo es genérico |
| `Fecha_Nac: "20/06/1980"` es un **string** | en MongoDB debería ser un `Date` *(el slide 39 usa `new Date(…)`)*; como texto no se ordena ni se compara |
| `Edad` como dato **almacenado** | dato **derivado** de la fecha de nacimiento, y por lo tanto **envejece**. El mismo problema de datos derivados de la [[Práctica 2026-09-01]] ej. 4, ahora sin trigger que lo mantenga |

> [!tip] Contraste con el slide 6, para el parcial
> - Slide 6: **un** documento que **materializa un join** → desnormalización.
> - Slide 27: **dos** documentos con **campos distintos** y **arreglos embebidos** → schemaless + embebido.
> Si la pregunta es *"dé un ejemplo de ausencia de esquema"*, el de aquí es el correcto.

## Slide 28 · ¿Cuándo usar SQL o NoSQL?

**Solo imagen**: dos carteles con un pulgar arriba, tres criterios cada uno. Transcripción literal
*(con las erratas de la imagen)*:

| **SQL** | **NoSQL** |
| --- | --- |
| *"Cuando el volumen de mis datos no crece o lo hace poco a poco."* | *"Cuando el volumen de mis datos crece muy rápidamente en momentos puntuales."* |
| *"Cuando las necesidades de proceso se pueden asumir en un sólo servidor."* | *"Cuando las necesidades de proceso no se pueden **preveer**."* **[sic]** |
| *"Cuando no tenemos picos de uso del sistema por parte de los usuarios más **allás** de los previstos."* **[sic]** | *"Cuando tenemos picos de uso del sistema por parte de los usuarios en múltiples ocasiones."* |

Los tres criterios son **el mismo eje leído tres veces** —volumen, capacidad de proceso, picos—:
**¿cabe en un servidor, y va a seguir cabiendo?** Si sí, SQL; si no, NoSQL. Es el slide 9 reducido a
una regla de decisión.

> [!important] (clave) Es el único slide que dice **cuándo NO usar NoSQL**, y es la mitad del argumento que el parcial va a pedir
> Ninguno de los tres criterios es "porque los datos son relacionales". Lo que falta es el criterio **de
> consistencia**: Corbellini § 8 *(pp. 19–20)* pone el ejemplo de **cuentas de usuario en RDBMS +
> mensajería en NoSQL** *(capas híbridas)* y Seven Databases cap. 9 § *Making a Choice* *(impresa 309)*
> da el criterio general; los dos coinciden en que la respuesta suele ser **las dos** — la persistencia
> políglota de la [[Práctica 2026-08-04]]. El propio slide 11 ya dio el cuarto criterio pro-SQL:
> *"datos críticos que requieren ACID"*.

---

## Slide 29 · MongoDB

> [!quote] Textual — las seis características
> - *"Escalable, alto rendimiento y disponibilidad"*
> - *"Puede trabajar en modo maestro-esclavo"*
> - *"Basada en esquemas BSON (**Binary JSON** )"* `[sic]` *(espacio antes del paréntesis de cierre)*
> - *"Posee un rico y sencillo sistema de consulta"*
> - *"Soporte de índices"*
> - *"Replicación y soporte a prueba de fallos"*

**Aquí empieza la segunda mitad del deck**: 24 slides sobre el motor de los TP9 *(I y II)*. Las seis
viñetas son el índice de lo que viene y de lo que queda para los decks 13 y 14:

| Viñeta | Dónde se desarrolla |
| --- | --- |
| escalable, rendimiento, disponibilidad | slide 30 *(auto-sharding, replicación)* |
| **maestro-esclavo** | slide 30 *(el dibujo)*; [[Clase 14 - MongoDB Features]] y `Diferencia_Sharding_Replication_MongoDB.pdf` |
| **BSON** | **en ningún lado de este deck**: [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] *(16 MB, 100 niveles)* y [[Clase 14 - MongoDB Features]] |
| sistema de consulta | slides 40–49 |
| índices | **en ningún lado de este deck**; [[Clase 14 - MongoDB Features]] *(índice `_id` por defecto, `getIndexes()`, single-field indexes)* |
| replicación, tolerancia a fallos | slide 30; [[Clase 14 - MongoDB Features]] |

> [!warning] (crítico) *"Puede trabajar en modo maestro-esclavo"* está **desactualizado desde 2018**
> La replicación *master-slave* fue **deprecada en 3.2 y eliminada en 4.0**. Lo que existe desde 1.6, y
> lo único que existe hoy, son los **replica sets**: un **primario** y N **secundarios** con **elección
> automática** de nuevo primario si el primario cae *(Seven Databases cap. 4 § *Replica Sets*, impresas
> 124–127, incluido el recuadro *Voting and Arbiters* de la 127 y § *The Problem with Even Nodes*)*.
> Corbellini Table 6 *(p. 15)* ya lo tabulaba en 2016 como *"Replica Sets (conjuntos de Master–Slaves)
> o Master–Slave simple"* — lo segundo ya no aplica. Como el `insert()`: **el deck describe un MongoDB
> de alrededor de 2013.**

> [!note] *"Basada en esquemas BSON"* — BSON no es un esquema
> BSON *(Binary JSON)* es el **formato de serialización** con el que MongoDB guarda y transmite los
> documentos: JSON binario con tipos que JSON no tiene *(`Date`, `ObjectId`, enteros de 32 y 64 bits,
> binarios)*. "Esquemas BSON" en un deck que acaba de decir *"no existe un esquema estricto"* *(slide
> 26)* es una tensión de vocabulario: quiere decir "documentos en formato BSON". Corbellini § 6
> *(p. 15)*: *"BSON y su límite de 16 MB"*. El detalle va en [[MongoDB]].

## Slide 30 · Propiedades — auto-sharding y replicación

> [!quote] Textual
> - *"Escalabilidad horizontal (**Auto-Sharding**)"*
> - *"Replicación para alta disponibilidad"*

Y **el diagrama**: tres etapas de izquierda a derecha, unidas por flechas, y abajo una flecha larga
rotulada **"Escalabilidad para Escribir"**:

| Etapa | Cajas verdes `mongod` | *Rango de Clave* de cada una |
| :---: | :---: | --- |
| 1 | **1** | `0…100` |
| 2 | **2** | `0…50` · `51…100` |
| 3 | **4** | `0…25` · `26…50` · `51…75` · `76…100` |

- **Sharding = partir el espacio de claves en rangos y darle un rango a cada `mongod`.** Es
  particionado **por rango** *(range-based)*, a diferencia del **hash** del slide 8. MongoDB soporta
  los dos *(`ranged` y `hashed` sharding)*; el deck no lo dice.
- **"Auto"** = MongoDB **reparte y rebalancea solo**: cuando un rango crece, lo divide *(chunk split)*
  y lo migra: `0…100` → `0…50 | 51…100` → cuatro cuartos.
- **"Escalabilidad para Escribir"** es preciso: el sharding escala **las escrituras** *(cada shard
  recibe solo las suyas)*; la **replicación** escala las **lecturas** y da disponibilidad. Son dos
  mecanismos **ortogonales** —Corbellini § 1 *(p. 2)*— que el slide junta en dos viñetas sin
  distinguirlos. La diferencia es el tema del complementario `Diferencia_Sharding_Replication_MongoDB.pdf`
  de la [[Clase 14 - MongoDB Features]].

> [!important] El diagrama muestra sharding y **no** muestra replicación, aunque la viñeta la nombre
> Las cuatro cajas de la etapa 3 tienen **rangos disjuntos**: son cuatro **shards**, no réplicas. Una
> réplica tendría **el mismo rango** que su primario. La arquitectura real de un cluster es, por cada
> shard, un *replica set* de tres `mongod` con el mismo rango *(Seven Databases cap. 4 § *Sharding*,
> impresas 127–130, y el recuadro *mongos vs. mongoconfig* de la 129)*. El slide 31 nombra al `mongos`
> que hace falta para eso.

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

| Componente | Qué es | Cuándo aparece |
| --- | --- | --- |
| **`mongod`** | el **proceso servidor**: guarda datos, atiende consultas, replica. Es la caja verde del slide 30. Un despliegue mínimo es **un** `mongod`, lo que levanta el `docker run … mongo` del TP9 | siempre |
| **`mongos`** | el **router de un cluster sharded**: recibe la consulta, mira en los *config servers* qué shard tiene qué rango y la enruta. **Sin sharding no hace falta** | solo con sharding |
| **GridFS** | **no es un proceso**: es una **convención** para guardar archivos **mayores a 16 MB** *(el límite de un documento BSON)* partiéndolos en *chunks* de 255 KB en dos colecciones *(`fs.files`, `fs.chunks`)* | solo con archivos grandes |

> [!warning] La lista mezcla **dos procesos y una convención de almacenamiento**, y omite el tercer proceso
> Los componentes de un cluster son **`mongod`, `mongos` y los `mongod` de configuración** *(config
> servers, que guardan el mapa de shards)*. El deck omite los config servers y mete GridFS en su lugar.
> Seven Databases cap. 4 lo separa: § *Sharding* *(impresas 127–130)* con el recuadro *mongos vs.
> mongoconfig* *(129)* para los procesos, y § *GridFS* *(131–132)* aparte. Corbellini § 6 nombra a
> GridFS como persistencia *("objetos BSON, o GridFS para archivos grandes", Table 6)* y al router como
> *"Mongo"* [sic].

**Nada de esto se usa en el TP9 Parte I**, que corre contra un solo `mongod` con `mongosh`. Entra en
juego en la [[Clase 14 - MongoDB Features]] *(sharding vs. replication)*.

## Slide 32 · Comparación entre SQL y MongoDB

**Solo imagen: una tabla de dos columnas y ocho filas**, copia del *SQL to MongoDB Mapping Chart* de la
documentación oficial *(versión anterior a 3.2)*. Transcripción literal, **con los artefactos
conservados**:

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
> En la tabla original esas celdas tienen **dos alternativas separadas por *or* en su propia línea**. Al
> copiarla, el *"or"* se tradujo a *"o"* y perdió el salto de línea. **No es un comando `odb`.**

> [!important] (clave) Lo que la primera fila enseña: **en MongoDB no hay `CREATE TABLE`**
> La primera forma de "crear la tabla" es un `insert`: **la colección se crea sola con el primer
> documento**. `db.createCollection("users")` es la forma explícita, necesaria solo para opciones
> *(colecciones *capped*, validación, y las **vistas** del slide 50)*. El TP9 lo explota en su paso 4:
> *"No es necesario crear un esquema para la colección, puede simplemente insertar un nuevo
> documento"*. Y el `CREATE TABLE` tiene **cuatro columnas** y el `insert` **tres**: el
> `id MEDIUMINT AUTO_INCREMENT` desaparece porque MongoDB lo reemplaza por el **`_id` automático**
> *(`ObjectId`)*, que aparece en el slide 38 y desarrolla la [[Clase 14 - MongoDB Features]].

> [!warning] (nota) El único `CREATE TABLE` del deck mezcla **MySQL y Oracle** en una sentencia
> `MEDIUMINT` y `AUTO_INCREMENT` son **de [[MySQL]]** *(ni PostgreSQL ni Oracle los tienen)*; `Number`
> es el tipo numérico **de Oracle** *(en MySQL no existe; en PostgreSQL es `numeric`)*. **No corre en
> ningún motor tal cual.** Viene así del *mapping chart* oficial, que es ilustrativo y no SQL
> ejecutable. Para el inventario de [[PostgreSQL]] § *Inventario*: **primer deck con marca de Oracle sin
> PostgreSQL**, heredada de una fuente externa.

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

**Cuatro de las ocho filas cambian.** Regla mnemotécnica: todo helper "genérico" del shell viejo
*(`insert`, `update`, `remove`, `count`)* se partió en un par **`…One` / `…Many`** *(o en dos `count…`
distintos)* para que la cardinalidad sea **explícita en el nombre** y no en una opción como
`{multi: true}`. Es el mismo espíritu de la crítica de la [[Práctica 2026-09-01]] al `UPDATE` sin
`WHERE`.

## Slides 33–34 · Migrando de SQL a NoSQL

### Slide 33 · El E-R de partida

**Solo imagen**: tres tablas al estilo de MySQL Workbench / Access, con llaves en las claves primarias
y cardinalidades `1 — ∞`:

| **comments** | | **post** | | **tag_list** |
| --- | :---: | --- | :---: | --- |
| (clave) `comment_id` *(resaltado)* | ∞ — 1 | (clave) `id` | 1 — ∞ | (clave) `id` |
| `post_id` | | `title` | | `post_id` |
| `by_user` | | `description` | | `tag` |
| `message` | | `url` | | |
| `data_time` **[sic]** | | `likes` | | |
| `likes` | | `post_by` | | |

Un blog: **un `post` tiene muchos `comments` y muchos `tag_list`**, con `post_id` como clave foránea en
las satélite. Es el esquema canónico de la
[[1.03.01 - Derivación de MER a esquema relacional|Clase 03]] para dos relaciones 1:N. *(Erratas de la
imagen: `data_time` por `date_time`; `post_by` donde el documento del slide 34 dice `by`. El ejemplo es
el de la sección "Data Modeling" de tutorialspoint.)*

### Slide 34 · En MongoDB

**Solo imagen: el documento**, con coloreado de sintaxis. Transcripción literal:

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

*(Fiel al slide: falta la coma después de `POST_ID`; `'COMMENT_BY'` es lo único entre comillas.)*

> [!important] (clave) **Tres tablas → un documento.** Es la tesis de toda la mitad NoSQL, en un slide
> | En SQL *(slide 33)* | En el documento *(slide 34)* | Cómo |
> | --- | --- | --- |
> | tabla `post` | el documento raíz | 1 : 1 |
> | tabla `tag_list` *(id, post_id, tag)* | `tags: [TAG1, TAG2, TAG3]` | **arreglo de escalares**: se pierden `id` y `post_id`, que solo existían para el `JOIN` |
> | tabla `comments` *(seis columnas)* | `comments: [ {user, message, dateCreated, like}, … ]` | **arreglo de subdocumentos**: se pierden `comment_id` y `post_id` por la misma razón |
> | `post.post_by` · `comments.by_user` · `comments.data_time` · `comments.likes` | `by` · `user` · `dateCreated` · `like` | renombrados *(los nombres de campo son libres; no buscar `post_by` en el slide 38)* |
>
> **Lo que se gana:** un post con sus tags y comentarios se lee con **un solo `find`** y se escribe
> **atómicamente** *(la atomicidad de MongoDB es por documento)*. **Lo que se pierde:** "todos los
> comentarios de un usuario" exige recorrer todos los posts, y si los comentarios crecen sin límite el
> documento choca con los **16 MB**. Ésa es la discusión de la
> [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] —cuándo embeber y cuándo referenciar—, y este par de
> slides es su prólogo.

## Slides 35–37 · Bases de datos y colecciones en el shell

Tres slides de texto vivo, los primeros comandos del deck.

### Slide 35 · Creación de base de datos

> [!quote] Textual
> - `use DATABASE_NAME`
> - *"Para chequear la base seleccionada:"* — `> db`
> - *"Mostrar bases de datos corriendo:"* — `> show dbs`

El título dice "creación" y el comando es `use`: **en MongoDB no hay `CREATE DATABASE`**. `use`
selecciona una base que puede no existir; se crea físicamente **con el primer documento** insertado.
Consecuencia que muerde: después de `use lab`, `show dbs` **no muestra `lab`** hasta que haya un
documento. El TP9 lo dice en su paso 2: *"No importa si la base de datos no existe aún, de hecho la
primera colección que crearemos generará efectivamente la base de datos"*. *"Bases de datos
corriendo"* es impreciso: `show dbs` lista las bases **existentes** con su tamaño. Los tres comandos
siguen vigentes en `mongosh`.

### Slide 36 · Borrar base de datos

> [!quote] Textual
> `db.dropDatabase()`

Borra **la base seleccionada** *(la de `db`)* con todas sus colecciones, **sin confirmación**. Vigente.
Equivale al `DROP DATABASE` de la [[1.03.02 - DDL — creación y alteración de tablas|Clase 03]], pero
**no se nombra la base**: se borra la actual, así que hay que mirar `db` antes.

### Slide 37 · Colecciones

> [!quote] Textual
> - `db.createCollection("myCollection")`
> - `{ "ok": 1 }`
> - `db.myCollection.insert({"name" : "tutorial"})`
> - *"Borrar Colección"*
> - `db.myCollection.drop()`

Las comillas tipográficas *(`“myCollection”`, `“ok”`)* son un artefacto de PowerPoint; el `{ "ok": 1 }`
es la **respuesta** de `createCollection`, pegada como si fuera un comando.

| Comando | Vigente en `mongosh` | Comentario |
| --- | :---: | --- |
| `db.createCollection("myCollection")` | ✓ | opcional, salvo para opciones *(capped, validator, **vistas**)* |
| `db.myCollection.insert({…})` | (atención) | deprecado: corre, con `DeprecationWarning` → `insertOne({…})`. Y crea la colección si no existía: la línea de arriba era innecesaria |
| `db.myCollection.drop()` | ✓ | devuelve `true` |

**`db.getCollectionNames()`**, que el TP9 usa en sus pasos 3 y 5, **no está en el deck**. Tampoco
`show collections`.

## Slides 38–39 · Inserción de documentos

### Slide 38 · Un documento

**Solo imagen** *(captura de consola)*. Transcripción literal:

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

Es el documento del slide 34 con valores reales, y **el documento con el que trabajan los ocho slides
siguientes** *(40–47)*. Cinco tipos de valor en siete campos: `ObjectId`, cuatro strings, un **arreglo
de strings**, un número.

> [!bug] (crítico) `ObjectId(7df78ad8902c)` **no corre en ninguna versión de MongoDB**
> Dos errores: **(1)** el argumento va **entre comillas** —es un string—, y **(2)** tiene que tener
> **24 dígitos hexadecimales** *(12 bytes)*, no 12. Así, `7df78ad8902c` es un identificador de
> JavaScript inválido y el shell devuelve `SyntaxError`. La forma correcta sería
> `ObjectId("507f1f77bcf86cd799439011")`, o mejor **omitir `_id`** y dejar que MongoDB lo genere *(lo que
> hace el TP9 en todos sus inserts)*. **El mismo `ObjectId` inválido se repite en los slides 40, 42, 43,
> 44 y 46**, con `…902d` y `…902e` para los otros dos documentos: error de la fuente *(tutorialspoint)*
> copiado íntegro. Qué es un `ObjectId` de verdad —12 bytes: timestamp + valor aleatorio + contador— lo
> explica la [[Clase 14 - MongoDB Features]] con `getTimestamp()`.

### Slide 39 · Múltiples documentos

**Solo imagen.** Transcripción literal:

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

| Novedad | Dónde | Comentario |
| --- | --- | --- |
| **Insertar un arreglo** = varios documentos en una llamada | `insert([ {…}, {…} ])` | en `mongosh` es `insertMany([…])` |
| **Documentos distintos en la misma colección**: el primero no tiene `comments`, el segundo sí | | el "campos diferentes" del slide 26, en código |
| **`new Date(2013,11,10,2,35)`** — una fecha como tipo `Date`, no como string | comentario embebido | el mes es **0-indexado en JavaScript**: `11` es **diciembre**. La misma trampa que el TP9 pone en sus `new Date(1987,2,14,…)` *(= 14 de marzo)* |
| `"NoSQL database doesn't have tables"` con **comillas dobles** | `description` del 2.º | porque el string lleva un apóstrofo; es JavaScript, da lo mismo |
| Sin `_id` explícito | los dos | MongoDB lo genera. Es la forma correcta, y contradice de hecho el slide 38 |

**La colección cambió**: el slide 38 insertaba en `mycol`; éste en **`post`**; los slides 40–47 vuelven
a `mycol` y el 49 usa `posts`. El deck usa **cuatro nombres de colección** para la misma cosa: `mycol`,
`post`, `posts`, `myCollection`.

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

`find()` sin argumento = `SELECT *`. `.pretty()` indenta la salida *(innecesario en `mongosh`)*.

> [!bug] `"likes": "100"` — el slide 38 insertó **el número** `100` y el 40 devuelve **el string** `"100"`
> No es posible: MongoDB conserva el tipo; la salida fue escrita a mano. Importa porque **el slide 41
> compara `likes` con `$gt: 50`** y **una comparación numérica no matchea un string**: si `likes` fuera
> `"100"`, `{likes: {$gt: 50}}` **no lo devolvería** *(el orden BSON pone todos los números antes que
> todos los strings; tipos distintos no se comparan)*. "Sin esquema" **no** significa "sin tipos".

### Slide 41 · Consultas con "Where" — la tabla de operadores

**Solo imagen: una tabla de cuatro columnas y seis filas**, copiada de tutorialspoint:

| Operation | Syntax | Example | RDBMS Equivalent |
| --- | --- | --- | --- |
| Equality | `{<key>: <value>}` | `db.mycol.find({"by":"tutorials point"}).pretty()` | `where by = 'tutorials point'` |
| Less Than | `{<key>: {$lt: <value>}}` | `db.mycol.find({"likes": {$lt:50}}).pretty()` | `where likes < 50` |
| Less Than Equals | `{<key>: {$lte: <value>}}` | `db.mycol.find({"likes": {$lte:50}}).pretty()` | `where likes <= 50` |
| Greater Than | `{<key>: {$gt: <value>}}` | `db.mycol.find({"likes": {$gt:50}}).pretty()` | `where likes > 50` |
| Greater Than Equals | `{<key>: {$gte: <value>}}` | `db.mycol.find({"likes": {$gte:50}}).pretty()` | `where likes >= 50` |
| Not Equals | `{<key>: {$ne: <value>}}` | `db.mycol.find({"likes": {$ne:50}}).pretty()` | `where likes != 50` |

**Es la tabla de referencia del TP9.** La gramática: **el `WHERE` es un documento** *(el filtro)*:
`find({ campo: valor })`. La **igualdad** es la forma corta `{campo: valor}`; todo lo demás va como
`{campo: {$operador: valor}}`. **Faltan** `$in` / `$nin` *(pertenencia a lista)*, `$exists` *(¿tiene el
campo?, esencial sin esquema)*, `$regex`, `$size` *(largo de un arreglo)* y `$elemMatch` *(condición
sobre elementos de un arreglo de subdocumentos)*. El TP9 los va a necesitar; Seven Databases cap. 4
§ *Digging Deep* y § *elemMatch* *(impresas 100–104)* los cubren.

> [!tip] `find(filtro, proyección)` ≈ `SELECT proyección FROM colección WHERE filtro`. **El deck nunca
> muestra el segundo argumento** *(`{title: 1, _id: 0}`)*; el único `$project` está dentro de la vista
> del slide 51. Sin proyección, `find` es siempre `SELECT *`.

### Slides 42–43 · `$and` y `$or`

**Solo imagen, los dos.** Comando de cada uno *(la salida es el mismo documento del slide 40, con
`"likes": "100"` incluido)*:

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

`$and` y `$or` toman un **arreglo de filtros**, lo que permite combinar condiciones sobre **el mismo
campo** *(`{$or: [{likes: {$lt: 10}}, {likes: {$gt: 100}}]}`, imposible sin `$or` porque un documento no
puede tener dos claves `likes`)*.

> [!note] El `$and` del slide 42 es **redundante**
> `find({by: "tutorials point", title: "MongoDB Overview"})` —dos claves en el mismo filtro— **ya es un
> AND implícito**. `$and` explícito hace falta solo con dos condiciones sobre el **mismo campo** con el
> mismo operador, o para anidar con `$or`. El slide 44 lo muestra sin decirlo: `likes` y `$or` **al mismo
> nivel** es un AND.

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

El patrón **más útil de los tres**: el AND es el documento exterior *(dos claves, `likes` y `$or`)*, y el
OR va adentro como arreglo. Los paréntesis del SQL **son el anidamiento del JSON**. Salida: el mismo
documento *(100 > 10 ✓ y `by` matchea ✓)*.

### Slide 45 · Ordenamiento

> [!quote] Textual *(texto vivo)*
> `>db.myCollection.find().sort({name: 1, surname: -1})`

`sort` toma un documento **ordenado** de campos: `1` ascendente, `-1` descendente; el orden de las
claves es el orden de prioridad. Equivale a `ORDER BY name ASC, surname DESC`. Vigente en `mongosh`.
**Cambio de colección otra vez**: `myCollection`, cuyos documentos *(slide 37)* tienen `name` y no
`surname`. Los campos del ejemplo no existen en ninguna colección del deck; es sintaxis suelta.

> [!note] En MongoDB **el orden de las claves del documento importa**
> `{name: 1, surname: -1}` y `{surname: -1, name: 1}` son **ordenamientos distintos**. En JSON puro el
> orden de las claves no es semántico; en BSON **sí**, y `sort`, `$group` y los índices compuestos
> dependen de él. Es la primera vez que aparece en el deck, y no se comenta.

## Slides 46–47 · Función de agregación

### Slide 46 · Los datos

**Solo imagen: tres documentos**, el dataset del `$group` siguiente:

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

**Es el primer *aggregation pipeline* de la cursada**, presentado como *"función de agregación"*, el
nombre de SQL. La gramática, que el deck no explica:

| Pieza | Qué es | Equivalente SQL |
| --- | --- | --- |
| `aggregate([ … ])` | un **pipeline**: arreglo de etapas, cada una un documento `{$etapa: …}`; la salida de una es la entrada de la siguiente | la consulta entera |
| `{$group: {…}}` | la etapa de agrupamiento | `GROUP BY` + las funciones agregadas |
| `_id: "$by_user"` | **la clave de agrupamiento**; el `$` delante del nombre significa *"el valor del campo `by_user`"* | `GROUP BY by_user` |
| `num_tutorial: {$sum: 1}` | un **acumulador**: suma 1 por documento del grupo | `count(*) AS num_tutorial` |

**Por qué `_id`:** en la salida de `$group`, el campo que identifica cada grupo se llama
**obligatoriamente `_id`** —convención del operador, no el `ObjectId`—.

> [!warning] (crítico) La salida `{ "result" : [ … ], "ok" : 1 }` es de **MongoDB < 2.6** y es la evidencia más precisa de la edad del deck
> Hasta la versión 2.4, `aggregate` devolvía **un solo documento** con el arreglo `result` adentro *(y
> por eso tenía un límite de 16 MB para todo el resultado)*. **Desde 2.6 (abril de 2014) devuelve un
> cursor**, y el shell imprime los documentos sueltos, igual que `find`. El material de MongoDB de este
> deck tiene **más de doce años**; junto con `insert()`, `remove()`, `{multi:true}`, *maestro-esclavo* y
> los logos de membase y riak, forma un cuadro coherente.

**Bibliografía verificada:** Seven Databases cap. 4 § *Aggregated Queries* *(impresas 115–117, dentro
del *Day 2*)* es este slide; en la misma sección el libro presenta `count` y `distinct` antes de
`aggregate`. Corbellini Table 6 *(p. 15)* lista como *query method* de MongoDB *"consultas por campo,
cursores y MapReduce"* — **no** el pipeline, que en 2016 ya existía.

> [!note] `mapReduce` **no está en este deck**, y es una buena noticia
> El deck enseña la agregación con el **pipeline**, la forma vigente. `mapReduce` —**deprecado desde
> 5.0**— aparece en el complementario `Ejemplo_MapReduce_MongoDB.pdf` de la
> [[Clase 14 - MongoDB Features]].

## Slides 48–49 · Ensamble de colecciones — `$lookup`

### Slide 48 · Las dos colecciones

**Dos imágenes**, cada una con su título:

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
`postTitle`—, **lo contrario del slide 34**, que los embebía. El deck muestra las dos opciones a quince
slides de distancia **sin decir que son alternativas**: ése es el trabajo de la
[[Clase 13 - NoSQL-EmbebidosVSNormalizado]]. Y la "clave foránea" `postTitle` referencia a `title`, un
**string**, no a un `_id`: funciona para el ejemplo y es una mala idea en general *(dos posts con el
mismo título rompen el join)*. Seven Databases cap. 4 § *References* *(impresas 106–107)* lo discute.

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

**La salida que el slide no muestra** *(derivada del slide 48)*: tres documentos de `posts`, cada uno
con un arreglo `comments`: el primero con **un** comentario, el segundo con **dos**, y *"hello world"*
con **un arreglo vacío** `[]`, porque es un *left* join. **El resultado tiene la forma del slide 34**:
`$lookup` convierte, en tiempo de consulta, el modelo normalizado en el embebido.

> [!bug] Los nombres de colección **no coinciden** entre el slide 48 y el 49
> El 48 titula *"post collection"* y *"comment collection"* *(singular)*; el 49 consulta **`db.posts`** y
> `from: "comments"` *(plural)*. Con los nombres del 48, el comando del 49 devuelve **vacío**: las
> colecciones inexistentes no dan error en MongoDB, dan cero documentos. Es el tipo de error silencioso
> que "sin esquema" habilita.

**Versión mínima:** `$lookup` existe **desde MongoDB 3.2** (diciembre de 2015). Junto con las vistas
*(3.4)*, es **lo más nuevo del deck**, y contrasta con el `{result: […]}` del slide 47, anterior a 2.6:
**el deck mezcla capturas de al menos dos épocas**. Seven Databases cap. 4 *(2018, MongoDB 3.6)* no
dedica sección a `$lookup`; Corbellini tampoco. **Fuente: la documentación oficial** *(`$lookup
(aggregation)`)*.

## Slides 50–52 · Vistas en MongoDB

### Slide 50 · Creación de vistas — las dos sintaxis

> [!quote] Textual
> *"Creación de vistas"*

Y **dos imágenes** lado a lado, capturas de la documentación oficial:

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
sintáctica sobre `createCollection` con `viewOn`. Tres parámetros: **nombre**, **fuente** y
**pipeline**; `collation` es opcional *(reglas de comparación de strings)*.

> [!important] (clave) Es la **vuelta de un concepto de la primera mitad**
> [[1.06.01 - Vistas|Vistas]] *(Clases 06–07)* dio la vista relacional: `CREATE VIEW v AS SELECT …`,
> actualizable bajo condiciones, con `WITH CHECK OPTION`, y las materializadas de PostgreSQL. La de
> MongoDB comparte lo esencial —**una consulta con nombre, evaluada al leer**— y difiere en:
>
> | | Vista relacional *(Clases 06–07)* | Vista de MongoDB *(slide 50)* |
> | --- | --- | --- |
> | Se define con | una consulta `SELECT` | un **pipeline de agregación** *(`$match`, `$project`, `$lookup`, …)* |
> | Actualizable | sí, bajo las reglas del deck 07 *(y de MySQL)* | **nunca**: solo lectura, sin `INSTEAD OF` ni nada parecido |
> | Materializada | opcional en PostgreSQL *(`CREATE MATERIALIZED VIEW`)*; no en MySQL | **no existe** como tal; el equivalente es `$out` / `$merge` al final de un pipeline, que escribe una colección real |
> | Índices | sobre las tablas base | sobre la colección **fuente**; la vista no tiene índices propios |
> | Desde | SQL-86 | **MongoDB 3.4** (2016) |
>
> El uso canónico es el mismo que la Clase 06 daba: **seguridad** —exponer un subconjunto de campos sin
> dar acceso a la colección base—, que es lo que hace el ejemplo del slide 51 *(mostrar `management` y
> ocultar `environment`)*.

### Slide 51 · Ejemplo de vistas

**Dos imágenes**: la colección de origen y el comando.

> [!quote] Rótulo
> *"Collection: Survey"*

```js
{ _id: 1, empNumber: "abc123", feedback: { management: 3, environment: 3 }, department: "A" }
{ _id: 2, empNumber: "xyz987", feedback: { management: 2, environment: 3 }, department: "B" }
{ _id: 3, empNumber: "ijk555", feedback: { management: 3, environment: 4 }, department: "A" }
```

> [!quote] Rótulo
> *"View: managementFeedback"*

```js
db.createView(
  "managementFeedback",
  "survey",
  [ { $project: { "management": "$feedback.management", department: 1 } } ]
)
```

Es el ejemplo de `db.createView` de la documentación oficial, literal. **`$project`** es la primera
aparición de la etapa de proyección en el deck: `department: 1` = "incluir"; `"management":
"$feedback.management"` = **campo nuevo calculado** con el valor de un **subcampo** *(notación de punto,
primera vez que el deck accede a un campo interno)*; `_id` sale siempre salvo que se excluya con
`_id: 0`. **`empNumber` y `feedback.environment` no salen**: eso es lo que la vista oculta.

> [!bug] `"Survey"` con mayúscula en el rótulo, `"survey"` con minúscula en el comando
> **Los nombres de colección en MongoDB distinguen mayúsculas.** Si la colección se llamara `Survey`,
> `createView("managementFeedback", "survey", …)` crearía una vista **sobre una colección
> inexistente**, sin error, y `find()` devolvería vacío. Vale el código.

### Slide 52 · Uso de la vista

**Solo imagen** *(captura de la documentación)*:

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
incluso `aggregate` encima. El pipeline de la vista se ejecuta **cada vez** *(no está materializada)* y
se **antepone** al de la consulta. **Con esto termina el deck**: sin cierre, sin bibliografía, sin
"preguntas".

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
| 3 | *"Poca eficiencia en aplicaciones en las BD relacionales"* | dos *"en"* seguidos |
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

1. **Slide 6 vs. su propio título.** *"Ausencia de esquema"* ilustrado con un **join materializado**;
  la schemalessness está en el slide 27. Los dos ejemplos están intercambiados respecto de sus rótulos.
2. **Slide 12 vs. slide 17.** El 12 dice que CAP *"afecta a cualquier sistema distribuido"*; el 17
  ofrece **CA** definido como *"no se puede permitir el particionado"*, es decir, un sistema no
  distribuido. *(Corbellini Table 2 y Seven Databases A2 sí lo señalan.)*
3. **Slide 18 vs. Corbellini Table 2.** MongoDB *(CP en el slide; AP **y** CP en el paper)* y Redis
  *(CP en el slide; **AP** en el paper)*: contradicción con la bibliografía obligatoria, y hay que saber
  cuál se toma.
4. **Slide 26 vs. slide 29.** *"No existe un esquema estricto"* y, tres slides después, *"basada en
  **esquemas** BSON"*. BSON es un formato, no un esquema.
5. **Slide 34 vs. slide 48.** El 34 **embebe** los comentarios; el 48 los pone en **otra colección** y
  el 49 los junta con `$lookup`. Los dos modelos del tema oficial de la fecha, mostrados sin decir que
  son alternativas. La [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] es la respuesta.
6. **Slide 38 vs. slide 39.** El 38 inserta con `_id` explícito *(y roto)*; el 39 sin `_id`, y
  funciona. El deck nunca dice que la segunda es la forma normal.
7. **Slide 38 vs. slide 46.** El campo autor es `by` en el 38 *(y en 42–44)* y **`by_user`** en el
  46–47: el `GROUP BY by_user` del 47 no funcionaría sobre los documentos del 38.
8. **Slide 11 vs. slide 29.** El 11 dice que NoSQL *"no trata con datos críticos que requieren ACID"*;
  el 29 promete *"replicación y soporte a prueba de fallos"* y el 30 *"alta disponibilidad"*.
  Durabilidad ≠ ACID, pero el deck no define qué es "crítico".
9. **Slide 30 vs. su viñeta.** La viñeta dice *"replicación"*; el diagrama muestra **solo sharding**.
  No hay una sola réplica dibujada en todo el deck.
10. **Cuatro nombres de colección** para un mismo ejemplo: `mycol` *(38, 40–44, 46–47)*, `post` *(39)*,
  `posts` *(49)*, `myCollection` *(37, 45)*. Ningún slide corre sobre los datos del anterior sin
  renombrar.

## Dudas abiertas

- [ ] (crítico) **¿Cómo quiere la cátedra que se responda "¿MongoDB soporta transacciones ACID?"**: con el
  slide 11, con Seven Databases A1 *(2018, `Transactions: No`)* o con la versión actual *(multi-documento
  desde 4.0)*. Afecta al TPO. **Preguntar en la práctica del 22/09.**
- [ ] (crítico) **¿En qué esquina de CAP van MongoDB y Redis en el parcial?** Slide 18: CP para los dos;
  Corbellini Table 2: AP y CP / AP. Ver § *Slide 18*.
- [ ] (crítico) **¿Qué versión de MongoDB corre la cursada, y se acepta la sintaxis vieja del deck?** El
  TP9 usa `mongosh` *(≥ 5.0)*, donde `insert()` corre con `DeprecationWarning` y el slide 38 falla por
  el `ObjectId` inválido. ¿Se corrige `insert()` en el parcial?
- [ ] (crítico) **¿"Familia de columnas" se dicta como column store o como wide-column?** El slide 24
  dibuja lo primero; Cassandra llega el 28/09 con lo segundo.
- [ ] **¿Entra la implementación de la consistencia eventual** *(N/W/R, quórum, read-repair; Corbellini
  § 3.2 y Table 3)*? No está en ningún slide de este deck.
- [ ] **¿Hasta dónde llegan los índices de MongoDB?** Única mención: slide 29. La
  [[Clase 14 - MongoDB Features]] los desarrolla; falta saber si el TP9 Parte II *(22/09)* los ejercita
  y si entran compuestos o de texto. Complemento: Seven Databases cap. 4 § *Indexing: When Fast Isn't
  Fast Enough* *(impresas 110–114)* y [[1.08.02 - Índices|Índices]].
- [ ] **¿Qué operadores, además de los seis del slide 41, se dan por sabidos?** `$in`, `$exists`,
  `$regex`, `$elemMatch`, `$size` y la **proyección**. Confirmar en [[Práctica 2026-09-15]].
- [ ] **¿Se toma `$lookup` como "el join de MongoDB", o hacer joins es señal de mal modelado?** El
  slide 49 lo presenta sin juicio; la doctrina de MongoDB *(y la Clase 13)* es que si se necesita
  `$lookup` a menudo, había que embeber.
- [ ] **¿Por qué el deck no trae bibliografía, versión ni fecha?** Primer deck del vault con cero
  referencias *(la [[Clase 09 - Restricciones integridad-Parte 1]] citaba el manual de PostgreSQL)*.
  Todo lo citado en [[_index-bibliografia]] › Clase 12 es propuesta del vault.
- [ ] **Persistencia políglota** *(slides 10 y 28; [[Práctica 2026-08-04]])*: la página
  [[2.12.03 - Persistencia políglota|Persistencia políglota]] sigue sin existir. ¿Se crea como concepto
  de la U1 *(04/08)* o como `2.12.NN`?

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
