---
tipo: teorica
clase: 13
deck: "BD2_Clase 13 - NoSQL-EmbebidosVSNormalizado(1).pdf"
unidad: 2
tema: "Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción a MongoDB · MongoDB: Enfoque embebido vs Normalizado · Ejemplos con MongoDB"
resumen: "Diseño del modelo de datos en MongoDB: cuándo embeber documentos y cuándo referenciarlos, con los patrones 1:1 y 1:N, las cotas de BSON (16 MB, 100 niveles) y $lookup como left outer join. La decisión la fija la carga: cómo se lee, cómo crece y cuánto se duplica el dato."
fecha: 2026-09-14
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 13
  - Clase 13 — MongoDB, diseño del modelo de datos
  - NoSQL-EmbebidosVSNormalizado
  - Embebido vs. normalizado
  - Documentos embebidos
  - Modelo de datos normalizado en MongoDB
  - One-to-One en MongoDB
  - One-to-Many en MongoDB
  - $lookup
  - Límite de 16 MB
  - BSON
fuentes:
  - "raw/Unidad-02/Teorica/BD2_Clase 13 - NoSQL-EmbebidosVSNormalizado(1).pdf"
estado: procesado
---

# Clase 13 — MongoDB: diseño del modelo de datos (embebido vs. normalizado)

## Resumen general

En MongoDB, elegido el modelo de documentos, la única decisión estructural es si los datos
relacionados van **embebidos** en el documento *("desnormalizado")* o en documentos aparte unidos
por una **referencia** *("normalizado")*. Cuatro bloques: la decisión y sus dos polos
*(slides 2–8)*, los patrones por cardinalidad *(1:1 en slides 9–12, 1:N en 13–20)*, agregaciones y
`$lookup` *(slides 21–25)* y tres ejemplos sueltos *(slides 26–28)*. Se dictó el lunes 14/09, entre
las Clases 12 y 14, y se practica en el TP 9 del 15/09; MongoDB es el motor de la segunda mitad de
la cursada. El código es del shell `mongo` legacy: en `mongosh`, `insert()` está deprecado y
`.pretty()` no hace nada.

Lo que hay que saber:

- Embeber cuando la relación es *"contiene"* o es 1:N con los "muchos" leídos **siempre** en el
  contexto del "uno": una lectura y una escritura **atómica** por documento.
- Referenciar cuando embeber duplicaría datos sin ganancia de lectura, para N:M y jerarquías
  grandes; cuesta viajes de ida y vuelta.
- Dos cotas de BSON: **16 MB** por documento y **100 niveles** de anidamiento.
- Con referencias, el **crecimiento** decide de qué lado va la referencia: sin cota en los "muchos",
  el id del "uno" va en cada uno *(`publisher_id` en cada libro)*.
- `$lookup` es un *left outer join* que devuelve documentos con un **arreglo** adentro, no filas.
- La proyección `{ campo: 1 }` de `find()` incluye siempre `_id`, salvo `_id: 0`.

Para el parcial: los tres ejemplos *(usuario–dirección, usuario–direcciones, editor–libros)*, el
cuadro de bolsillo y el contraste con la derivación relacional: normalizar en MongoDB es aplicar la
regla relacional sin `FOREIGN KEY`; embeber es guardar adentro el multivaluado que la 1FN prohíbe.
El criterio no es la forma normal sino cómo se lee, cómo crece y cuánto se duplica el dato.

## Fuente, motor y origen del deck

> [!info] Fuente
> `raw/Unidad-02/Teorica/BD2_Clase 13 - NoSQL-EmbebidosVSNormalizado(1).pdf` · **28 slides** ·
> **18 imágenes embebidas** en 15 páginas *(verificado con `pdfimages -list`: una imagen en los
> slides 4, 7, 10, 12, 13, 15, 17, 19, 20, 23, 24, 27 y 28, y dos en el 22)*. **Todos los documentos
> JSON, el `$lookup`, el resultado del join, el snippet de "Lógica de control" y el `explain()` están
> en imagen**: `pdftotext` los pierde, y esta página los transcribe de los PNG. El slide 1 es la
> **portada**; el 25 es el único con un link; **no hay slide de agenda, de bibliografía ni de
> cierre**: el deck termina en seco en el 28 con un `explain()`. La plantilla *(fondo blanco con ola
> celeste, título en azul petróleo, cuerpo en Cambria)* es distinta a la de los decks de la U1 y la
> misma de la [[Clase 12 - Introduccion a NoSQL]].
> Dictado en la **teórica del lunes 14/09**, el **mismo lunes** que la
> [[Clase 12 - Introduccion a NoSQL]] *(antes)* y la [[Clase 14 - MongoDB Features]] *(después)*.
> El `(1)` del nombre es un artefacto de descarga *(como en [[Clase 08 - Explicando el plan]])*: la
> página va **sin** el `(1)` y el `deck:` del frontmatter lo lleva **con** el `(1)`, que es lo que
> hace que el PDF se encuentre en `raw/`.
> Se practica con el **TP 9 - MongoDB Parte I** del martes 15/09 → [[Práctica 2026-09-15]].
> Bibliografía: [[_index-bibliografia]] › Clase 13.

> [!warning] (crítico) El deck tiene **tres nombres**, y ninguno coincide con otro
> | Dónde | Qué dice |
> | --- | --- |
> | **Nombre del archivo** | `NoSQL-EmbebidosVSNormalizado` |
> | **Portada** *(Slide 1)* | *"**MongoDB: Diseño del Modelo de Datos** · Bases de Datos II"* |
> | **Metadato `Title` del PDF** *(`pdfinfo`)* | *"Introducción a Bases de Datos NoSQL"* — **el mismo `Title` que el PDF de la [[Clase 12 - Introduccion a NoSQL]]** |
>
> Los decks 12 y 13 salieron del mismo archivo de PowerPoint *(o de una copia con el mismo título
> interno)*: el 12 fue exportado el **14/04/2024** y el 13 el **28/04/2024**, ambos con PowerPoint
> 2010. **El material es de abril de 2024**, y eso explica el dominio `docs.mongodb.com`, el
> `insert()` con arreglo y el `.pretty()`. Es una clase de diseño de esquema, no de introducción a
> NoSQL: el nombre del archivo resume el contenido, no lo titula.
>
> Para el `tema:` del frontmatter manda el [[_cronograma]]: la fila del **14/09** dice
> *"Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción a MongoDB ·
> **MongoDB: Enfoque embebido vs Normalizado** · Ejemplos con MongoDB"*. Este deck es el **tercer**
> ítem de esa fila y parte del cuarto *(los "ejemplos" son los slides 21–28)*.

> [!important] Motor: **MongoDB, el motor de la cursada** — sin motor ajeno, pero con **shell legacy**
> Es el **primer deck teórico del vault sin desfasaje de motor**: todo el código es de MongoDB, que
> es lo que dice el [[_cronograma]] y lo que usa el [[Práctica 2026-09-15|TP9]]. Verificado sobre
> los 28 PNG: **cero SQL** *(el único "join" es el `$lookup` del slide 23)*. Lo que sí tiene es
> **sintaxis del shell `mongo` legacy**, deprecada o sin efecto en **`mongosh`** *(el shell actual;
> el `mongo` legacy se retiró con MongoDB 6.0)*:
>
> | Slide | Lo que trae el deck | Estado hoy |
> | --- | --- | --- |
> | **22** | `db.orders.insert([ … ])` con un arreglo | `insert()` está **deprecado** en `mongosh` a favor de `insertOne()` / `insertMany()`. Sigue funcionando, con aviso |
> | **26** | `.find(…).pretty()` | En `mongosh` **no hace nada**: la salida ya viene formateada. No falla |
> | **25** | `https://docs.mongodb.com/manual/…` | El dominio **redirige** a `www.mongodb.com/docs/manual/…` desde 2022. El link sigue abriendo |
> | **27** | `printjson(doc)` dentro de un `forEach` | Vigente en `mongosh` |
> | **28** | `.explain("executionStats")` | Vigente |
>
> Ninguna de las tres es un error: `insert()` y el dominio `docs.mongodb.com` son **los mismos que
> usa *Seven Databases* 2ª ed.**, escrita contra **MongoDB 3.6** *(ficha, Apéndice A1)*; `.pretty()`
> **no está en el cap. 4 del libro**. El link del slide 25 es **exactamente** el que el libro cita en
> cap. 4 › *Day 2* › § *Aggregated Queries* *(impresa 115, nota 3)*. Conviene saberlo antes de
> pegarlo en `mongosh` y ver un `DeprecationWarning`. Detalle en [[MongoDB]] *(página pendiente)*.

> [!note] De dónde sale el deck — **hipótesis**, porque el deck no lo cita
> Los ejemplos —`_id: "joe"` / `"Joe Bookreader"` / `"123 Fake Street"` / `"Faketon"`,
> `"MongoDB: The Definitive Guide"` / `"O'Reilly Media"` / `founded: 1980`, `orders` / `inventory`
> con `"almonds"` y `"pecans"`, y el `db.products.find(…).explain("executionStats")`— son, palabra
> por palabra, los de la **documentación oficial de MongoDB** *(*Data Model Design*, *Model
> One-to-One / One-to-Many Relationships with Embedded Documents*, *Model One-to-Many Relationships
> with Document References*, `$lookup` y `cursor.explain()`)*, y el texto de los slides 2, 3, 5, 7,
> 8, 9, 11, 14, 16, 18 y 20 es **una traducción de esas páginas**. El único link del deck *(slide 25)*
> apunta a la referencia de operadores del *aggregation pipeline*, no a esas páginas. No está
> verificado contra la documentación, que no forma parte del vault; lo que importa para estudiar es
> que **la fuente primaria de este deck es la documentación**, no un libro → § *Bibliografía verificada*.

> [!important] (crítico) Lo que el deck **no** trae, y se nota
> - **Ningún ejemplo de N:M.** El slide 8 manda las relaciones *"de muchos a muchos"* a referencias y
> **no hay un solo documento** que lo muestre; las tres cardinalidades con ejemplo son 1:1 y dos 1:N.
> En relacional la N:M es **la** relación que genera tabla
> *([[1.03.01 - Derivación de MER a esquema relacional|regla del slide 13 del deck 03]])*.
> - **Cuatro de las cinco etapas del slide 21 no tienen slide** *(`Sort`, `Match`, `Unwind`,
> `Project`)*, y **`$group`**, la etapa que hace de `GROUP BY`, **no está en la lista**. La
> [[Clase 12 - Introduccion a NoSQL]] *(slides 46–49)* ya trae `$group` con `$sum` y un `$lookup`
> completo sobre `posts`/`comments`; la [[Clase 14 - MongoDB Features]] lo retoma.
> - **Nada de transacciones multidocumento.** El slide 5 promete *"una sola operación de escritura
> atómica"* para el embebido y **no dice qué pasa con el normalizado**, donde escribir `user` y
> `contact` son **dos** operaciones. Corbellini § 6 *(p. 15–16)* registra *"operaciones atómicas por
> documento"*; las transacciones multidocumento existen desde la 4.0 y el deck no las nombra.
> - **Ningún patrón con nombre** *(extended reference, subset, bucket, outlier…)* ni **`DBRef`**: las
> referencias del deck son siempre un campo suelto *(`user_id`, `patron_id`, `publisher_id`,
> `books: [ids]`)*, lo que la documentación llama *manual references*. *Seven Databases* cap. 4 ›
> *Day 1* › § *References* *(impresas 106–107)* muestra la otra forma, `{ $ref: "collection", $id: … }`.
> - **Qué es `ObjectId`.** Los slides 4 y 7 usan `<ObjectId1>` como marcador y nunca lo explican.

---

## Slide 2 · Introducción — la única decisión

> [!quote] Textual
> *"Los modelos de datos efectivos satisfacen las necesidades de su aplicación. La consideración
> clave para la estructura de sus documentos es la decisión de **embeberlos** o **utilizar
> referencias**."*

Dos frases, y las dos son el marco del deck. *"Satisfacen las necesidades de su aplicación"*: **el
esquema se diseña desde las consultas**, no desde las entidades, el reverso del método de la U1,
donde el MER sale del dominio y las consultas vienen después
*([[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]])*. *"Embeberlos o utilizar
referencias"*: es **una decisión por relación**, no por base; en un mismo documento conviven un
subdocumento embebido y un campo con referencia *(slide 20: `author: [ … ]` embebido y
`publisher_id` referenciado en el mismo libro)*.

> [!important] (clave) Punto de contacto con [[1.03.01 - Derivación de MER a esquema relacional|la derivación relacional]]
> En la U1 la pregunta *"¿esto va en la misma tabla o en otra?"* no existía: la respondía la regla de
> derivación *(entidad → tabla; multivaluado → tabla nueva; N:M → tabla nueva)* y después la
> normalización. **Aquí esa pregunta es la única que hay**, y no tiene regla sino **criterios**
> *(slides 5 y 8)* que dependen de cómo se lee y cómo crece el dato → § *Contraste con la derivación
> relacional*.

## Slides 3–4 · Enfoque de documentos embebidos — qué es

> [!quote] Textual del slide 3
> - *"Con MongoDB, puede embeber datos relacionados en una única estructura o documento"*
> - *"Estos esquemas generalmente se conocen como modelos **"desnormalizados"** y aprovechan los
> documentos de MongoDB"*
> - *"Considere el siguiente diagrama:"*

**Las comillas de *"desnormalizados"* son del slide.** En la U1 *desnormalizar* era **una anomalía**
*(redundancia, riesgo de inconsistencia en el `UPDATE`)*; aquí es **el nombre del enfoque
recomendado por defecto**. *Seven Databases* 2ª ed. lo dice sin comillas: *Day 1 Wrap-Up* *(impresa
109)* habla de *"complex, denormalized documents"* y *Mongo's Weaknesses* *(impresa 133)* advierte
que *"Mongo encourages denormalization of schemas (by not having any) and that can be a bit too much
for some to swallow"*.

El diagrama del slide 4 *("Esquema de ejemplo", imagen de 741×408 px)* es un documento con dos
subdocumentos, con dos llaves verdes rotuladas *"Embedded sub-document"*:

```javascript
{
  _id: <ObjectId1>,
  username: "123xyz",
  contact: {
  phone: "123-456-7890",
  email: "xyz@example.com"
  },  // ← Embedded sub-document
  access: {
  level: 5,
  group: "dev"
  }  // ← Embedded sub-document
}
```

Tres cosas que el diagrama dice y el texto no:

1. **`_id: <ObjectId1>`** es un marcador: el deck usa `<ObjectId1>`, `<ObjectId2>`, `<ObjectId3>` en
  los slides 4 y 7 para hablar de identidades sin escribir un `ObjectId("…")` real, y **no explica
  qué es un `ObjectId`** *(12 bytes generados por el driver: timestamp, aleatorio, contador)*.
2. **Los subdocumentos no tienen `_id` propio.** `contact` y `access` son valores del documento
  padre: no existen fuera de él ni se pueden referenciar desde otra colección. Eso cambia en el
  slide 7.
3. **`level: 5`** es un número, no un string: BSON tipa los valores.

> [!tip] Cómo se lee esto contra la U1
> El equivalente relacional son **tres tablas** —`USER`, `CONTACT`, `ACCESS`— con `user_id` como FK
> en las dos últimas, o **una tabla** `USER` con seis columnas, que es lo que produce la regla del
> **atributo compuesto** de [[1.03.01 - Derivación de MER a esquema relacional|la derivación]]
> *(slide 7 del deck 03: el compuesto "se despliega en sus partes componentes")*. **El subdocumento
> embebido es un atributo compuesto que no se despliega.**

## Slide 5 · Enfoque de documentos embebidos — cuándo

> [!quote] Textual, completo *(el slide más denso del deck)*
> - *"Los modelos de datos embebidos permiten que las aplicaciones almacenen información relacionada
> en el mismo registro de la base de datos. Como resultado, es posible que las aplicaciones deban
> emitir **menos consultas y actualizaciones** para completar las operaciones comunes"*
> - *"En general, utilice modelos de datos **incrustados** cuando:"*
> - *"Tenga relaciones **"contiene"** entre las entidades"*
> - *"Tenga relaciones de **uno a muchos** entre entidades. En estas relaciones, los "muchos" o
> documentos secundarios **siempre aparecen con o se ven en el contexto de** "uno" o documentos
> principales"*
> - *"En general, los documentos embebidos proporcionan un **mejor rendimiento para las operaciones
> de lectura**, así como la capacidad de solicitar y recuperar datos relacionados **en una sola
> operación de base de datos**. Los modelos de datos embebidos permiten actualizar los datos
> relacionados **en una sola operación de escritura atómica**"*

Son **dos criterios** para embeber y **tres beneficios**:

| | Qué dice | Lectura |
| --- | --- | --- |
| **Criterio 1** | relaciones *"contiene"* | **composición**: la parte no tiene sentido sin el todo *(`contact` sin su `user`)*. En el MER de la U1 es la **entidad débil** o el **atributo compuesto** |
| **Criterio 2** | 1:N donde los "muchos" **siempre** se ven en el contexto del "uno" | la palabra clave es ***siempre***: si alguna consulta necesita los "muchos" **sin** pasar por el "uno" *("todas las direcciones de Boston")*, embeber obliga a barrer la colección de padres |
| **Beneficio 1** | menos consultas y actualizaciones | una lectura trae el documento completo |
| **Beneficio 2** | mejor rendimiento de **lectura** | de lectura, **no de escritura**: reescribir un documento grande por cambiar un subdocumento tiene costo |
| **Beneficio 3** | escritura **atómica** en una sola operación | **la unidad de atomicidad es el documento**: lo que está adentro se escribe todo o nada; lo que está en otro documento, no |

> [!important] (clave) El beneficio 3 es **la razón técnica** detrás de la regla
> En MongoDB **una operación sobre un documento es atómica** *(Corbellini § 6, p. 15–16)*. Si el
> todo y la parte se escriben siempre juntos, tenerlos en un documento hace **la escritura atómica
> gratis**. Con referencias son dos operaciones y la atomicidad **hay que comprarla con una
> transacción multidocumento** *(desde MongoDB 4.0; el deck no la nombra)*: el problema que en la U1
> resolvía `COMMIT` *([[Clase 11 - Seguridad-Transacciones]])*.

Vocabulario: el slide dice *"embebidos"* en el primer y tercer punto e ***"incrustados"*** en el
segundo, y el deck vuelve a *"incrustar"* en los slides 11 y 14. Se conserva `[sic]`.

## Slide 6 · Documentos BSON — las dos cotas

> [!quote] Textual, completo
> - *"El tamaño máximo del documento BSON es de **16 megabytes**"*
> - *"MongoDB no admite más de **100 niveles de anidamiento** para documentos BSON"*

Es el **único slide con límites numéricos del motor** *(las imágenes de los slides 17, 19, 22, 24 y
28 traen cifras de ejemplo: `pages: 216`, `founded: 1980`, `instock: 120`, `$gt: 50`)*. Son
**límites físicos** que ponen techo a "embeber todo", y el slide está **entre** el "cuándo embeber"
y el "cuándo referenciar" por eso: una colección puede tener terabytes, **un documento no puede pasar
de 16 MB**. Si un dato relacionado crece sin cota, hay que sacarlo a otra colección, que es lo que
los slides 18–20 hacen con los libros del editor.

| Cota | Qué limita | A qué patrón le pega |
| --- | --- | --- |
| **16 MB** por documento | cuánto se puede embeber en total | al **arreglo que crece sin cota** *(slide 18: "arreglos mutables y en crecimiento")*. Un `user` con todas sus direcciones cabe; un `publisher` con todos sus libros embebidos, o un `post` con todos sus comentarios, **en algún momento no** |
| **100 niveles** de anidamiento | qué tan profundo | a las **jerarquías** *(slide 8: "grandes conjuntos de datos jerárquicos" → referencias)*. Un árbol embebido como `children: [{ children: [ … ] }]` tiene techo de profundidad |

> [!note] Dónde está esto en la bibliografía
> **Corbellini § 6, pp. 15–16** cubre *"BSON y su límite de 16 MB"*. *Seven Databases* 2ª ed.
> nombra los 16 MB **dos veces, y ninguna como límite de documento**: en el recuadro *Mongo's Many
> Useful CLI Tools* *(impresa 114)*, a propósito de `mongofiles` — *"GridFS is a specification for
> BSON files exceeding 16 MB"*— y en § *Mapreduce (and Finalize)* *(impresa 122)*, como límite del
> resultado `inline` de un MapReduce. **Los 100 niveles no están en ninguna fuente del vault**: sale
> de la documentación oficial → `—`.

## Slide 7 · Modelo de datos normalizado — qué es

> [!quote] Textual
> *"Los modelos de datos normalizados describen relaciones usando **referencias entre documentos**"*

El diagrama *(imagen de 726×416 px)* es el documento del slide 4 partido en tres cajas,
`user document` a la izquierda y `contact document` / `access document` a la derecha, con **dos
flechas verdes** que salen de los campos `user_id` *(resaltados en verde)* y apuntan al `_id` del
`user`:

```javascript
// user document
{
  _id: <ObjectId1>,
  username: "123xyz"
}

// contact document
{
  _id: <ObjectId2>,
  user_id: <ObjectId1>,  // ← resaltado, flecha hacia user._id
  phone: "123-456-7890",
  email: "xyz@example.com"
}

// access document
{
  _id: <ObjectId3>,
  user_id: <ObjectId1>,  // ← resaltado, flecha hacia user._id
  level: 5,
  group: "dev"
}
```

| | Slide 4 *(embebido)* | Slide 7 *(normalizado)* |
| --- | --- | --- |
| Documentos | **1** | **3**, en *(presumiblemente)* tres colecciones |
| `_id` | uno | **tres**: `contact` y `access` pasan a tener identidad propia |
| La relación | **implícita** en la estructura | **explícita** en un campo: `user_id` |
| Dirección de la referencia | — | **del hijo al padre**: `contact` apunta a `user`, no al revés |
| Lecturas para "todo el usuario" | 1 | **3** *(o 1 con `$lookup`, slide 23)* |
| Escritura de `phone` | reescribe el documento `user` | toca solo `contact` |

> [!important] (clave) **La flecha va del hijo al padre**, y eso es exactamente la regla relacional
> `user_id` en `contact` es **una clave foránea**: la clave del lado "1" como columna en el lado "N",
> la **regla de la binaria 1:N** del slide 11 del deck 03
> *([[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]])*.
> Por eso el deck lo llama *"normalizado"*: **es el esquema relacional escrito en JSON**. Lo que
> MongoDB **no** tiene es la restricción: `user_id` no es un `FOREIGN KEY`, nadie verifica que
> `<ObjectId1>` exista, y borrar el `user` deja dos huérfanos sin que ningún `ON DELETE` se entere
> *([[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]])*. **El deck
> no lo dice en ningún slide**, y es la diferencia práctica más grande entre "normalizado en MongoDB"
> y "normalizado en MySQL" → § *Dudas abiertas*.

## Slide 8 · Modelo de datos normalizado — cuándo

> [!quote] Textual, completo
> - *"En general, utilice modelos de datos normalizados:"*
> - *"cuando la incorporación resultaría en una **duplicación de datos** pero no proporcionaría
> suficientes ventajas de rendimiento de lectura para superar las implicaciones de la
> duplicación"*
> - *"para representar relaciones más complejas de **muchos a muchos**"*
> - *"para modelar **grandes conjuntos de datos jerárquicos**"*
> - *"Las referencias proporcionan **más flexibilidad** que el modelo embebido. Sin embargo, las
> aplicaciones del lado del cliente deben emitir **consultas de seguimiento** para resolver las
> referencias. En otras palabras, los modelos de datos normalizados pueden requerir **más viajes de
> ida y vuelta al servidor**"*

Son **tres criterios** para referenciar y **un costo**:

| Criterio | Qué caso cubre | Ejemplo del deck |
| --- | --- | --- |
| **Duplicación sin ganancia** | el mismo dato embebido en N documentos: si se actualiza hay que tocar los N, y si nadie lee "el padre con sus hijos" seguido, no se gana nada a cambio | **editor–libros** *(slide 17: `publisher` repetido en cada libro)* |
| **Muchos a muchos** | ningún lado "contiene" al otro | **ninguno** — el deck lo nombra y no lo muestra |
| **Jerarquías grandes** | árboles y grafos profundos o anchos | **ninguno** — chocan con los 100 niveles y los 16 MB del slide 6 |
| **Costo** | *round-trips*: cada referencia es otra consulta *(o un `$lookup`)* | el slide 11 lo dice del 1:1: *"debe emitir varias consultas para resolver la referencia"* |

*"La incorporación"* es *embedding* mal traducido *(en el original, *"when embedding would result
in duplication of data"*)*: *incorporación*, *embebido* e *incrustado* son **la misma palabra** en
tres slides distintos. Se conserva `[sic]`.

> [!important] (clave) El criterio 1 es **la normalización relacional, dicha al revés**
> En la U1 la duplicación era **siempre** una anomalía a eliminar *(2FN/3FN: el `publisher` que
> depende de `title` vía `publisher_id` es una dependencia transitiva de manual)*. Aquí la
> duplicación **se tolera si compra rendimiento de lectura** y se elimina si no. **El criterio ya no
> es la forma normal: es la relación costo/beneficio de la consulta.** Es la frase más importante del
> deck para el objetivo declarado de la materia — *"tomar buenas decisiones a la hora de elegir una
> base de datos"* *([[CLAUDE]])*—: la misma relación 1:N se modela de dos formas **según cómo se la
> lee**, y la decisión la toma la carga de trabajo, no el modelo de datos.

---

## Slides 9–12 · Relación *one-to-one* con documentos embebidos

> [!quote] Textual del slide 9, completo
> - *"Considere el siguiente ejemplo que mapea las relaciones de **usuario y dirección**"*
> - *"El ejemplo ilustra la ventaja de embeber sobre las referencias si necesita **ver una entidad de
> datos en el contexto de la otra**"*
> - *"En esta relación de *one-to-one* entre el usuario y los datos de la dirección, **la dirección
> pertenece al usuario**"*
> - *"En el modelo de datos normalizado, **el documento de dirección contiene una referencia al
> documento del usuario**"*

*"La dirección pertenece al usuario"* es el criterio 1 del slide 5 *("contiene")* aplicado, y la
última frase fija la dirección de la referencia: **del hijo al padre**, como en el slide 7.

### Slide 10 · *"Ejemplo"* — la versión normalizada *(imagen, 272×310 px)*

```javascript
{
  _id: "joe",
  name: "Joe Bookreader"
}

{
  patron_id: "joe",
  street: "123 Fake Street",
  city: "Faketon",
  state: "MA",
  zip: "12345"
}
```

Tres detalles que solo se ven en la imagen: **`_id: "joe"`** no es un `ObjectId` sino un string
elegido por la aplicación *(**`_id` puede ser cualquier tipo BSON salvo arreglo**)*, lo que hace que
la referencia `patron_id: "joe"` se lea de un vistazo; **el documento de dirección no muestra
`_id`**, MongoDB se lo agrega al insertar; y **`patron_id`**, no `user_id`: el vocabulario es el de
una **biblioteca** *(patron = socio, Joe Bookreader)*, el mismo del ejemplo editor–libros, señal de
que los slides 9–20 salen de una misma fuente.

### Slide 11 · *"Ejemplo (cont)"* — el argumento

> [!quote] Textual
> - *"Si los datos de la dirección se recuperan con frecuencia con la información del nombre y luego
> con la referencia, su aplicación debe emitir **varias consultas** para resolver la referencia"*
> - *"El mejor modelo de datos sería **incrustar** los datos de dirección en los datos del usuario,
> como en el siguiente documento:"*

La condición está en el *"si"*: **si se recuperan con frecuencia juntos**, el criterio 2 del slide 5
para el caso 1:1. Si la aplicación leyera direcciones sin usuarios *(un reporte por código postal)*,
el argumento no aplicaría. *"Y luego con la referencia"* es traducción torpe de *"and then with the
reference"*: el sentido es **dos consultas**. Se conserva `[sic]`.

### Slide 12 · *"Ejemplo (cont)"* — la versión embebida *(imagen, 363×242 px)*

```javascript
{
  _id: "joe",
  name: "Joe Bookreader",
  address: {
  street: "123 Fake Street",
  city: "Faketon",
  state: "MA",
  zip: "12345"
  }
}
```

Con una caja celeste al pie, textual: *"Con el modelo de datos embebidos, su aplicación puede
recuperar la información completa del usuario **con una consulta**"*. **Desapareció `patron_id`**,
porque la relación está en la estructura; y el subdocumento se llama **`address`** en singular, que
en el slide 15 será `addresses` en plural y un arreglo: **el nombre del campo lleva la cardinalidad**.

> [!important] (clave) El deck 03 **no dio regla para la binaria 1:1**; este deck da **dos**
> [[1.03.01 - Derivación de MER a esquema relacional|La tabla de reglas del vault]] registra
> *"Binaria 1:1 — el deck no la trata en ningún slide"*. En MongoDB la 1:1 tiene **dos formas**
> *(slides 10 y 12)* y **una recomendación clara**: embeber, salvo que la dirección se lea sola. En
> relacional la respuesta análoga habría sido "una sola tabla `USER` con las columnas de dirección"
> *(el atributo compuesto desplegado)* → § *Dudas abiertas*.

## Slides 13–15 · Relación *one-to-many* con documentos embebidos

> [!quote] Textual del slide 13
> *"En base al ejemplo anterior:"*

### Slide 13 · El punto de partida *(imagen, 310×484 px)* — **es la versión referenciada**

```javascript
{
  _id: "joe",
  name: "Joe Bookreader"
}

{
  patron_id: "joe",
  street: "123 Fake Street",
  city: "Faketon",
  state: "MA",
  zip: "12345"
}

{
  patron_id: "joe",
  street: "1 Some Other Street",
  city: "Boston",
  state: "MA",
  zip: "12345"
}
```

> [!warning] El título del slide 13 dice *"con documentos embebidos"* y **lo que muestra es el modelo con referencias**
> Es el "antes": el usuario del slide 10 con **dos** direcciones referenciadas por `patron_id`. El
> título es el del bloque *(slides 13–15)*; **el modelo embebido recién aparece en el 15**.

Lo único nuevo respecto del slide 10 es la **tercera caja**, un segundo documento con el mismo
`patron_id: "joe"`: en relacional, la tabla `ADDRESS` con FK `patron_id` y dos filas, la **regla de
la binaria 1:N** del deck 03. Las dos direcciones tienen `zip: "12345"` aunque una esté en *Faketon*
y la otra en *Boston*: dato de juguete heredado de la fuente, `[sic]`.

### Slide 14 · El argumento — **es el slide 11 con dos palabras cambiadas**

> [!quote] Textual, completo
> - *"Si su aplicación recupera con frecuencia los datos de la dirección con la información del
> nombre, entonces su aplicación debe emitir varias consultas para resolver las referencias"*
> - *"Un esquema **más óptimo** sería incrustar las **entidades** de datos de dirección en los datos
> del usuario, como en el siguiente documento:"*

Diferencias con el slide 11: *"la referencia"* → *"las referencias"* *(son dos)*, *"el mejor
modelo"* → *"un esquema más óptimo"* **[sic]** *(traducción literal de "a more optimal schema")*, y
*"los datos"* → *"las entidades de datos"*. **El argumento es el mismo**: la cardinalidad no cambia el
criterio, solo la estructura resultante.

### Slide 15 · La versión embebida *(imagen, 423×438 px)* — **aparece el arreglo**

```javascript
{
  _id: "joe",
  name: "Joe Bookreader",
  addresses: [
  {
  street: "123 Fake Street",
  city: "Faketon",
  state: "MA",
  zip: "12345"
  },
  {
  street: "1 Some Other Street",
  city: "Boston",
  state: "MA",
  zip: "12345"
  }
  ]
}
```

**Sin caja de comentario** *(a diferencia del slide 12)* **ni cuerpo de texto**: solo el título del
bloque y la imagen. Lo que muestra, y el deck no dice con palabras:

| | Slide 12 *(1:1)* | Slide 15 *(1:N)* |
| --- | --- | --- |
| Campo | `address` | `addresses` |
| Tipo del valor | **subdocumento** `{ … }` | **arreglo de subdocumentos** `[ { … }, { … } ]` |
| Cuántos | uno | cero o más |
| Consulta para "usuarios en Boston" | `{ "address.city": "Boston" }` | `{ "addresses.city": "Boston" }` — **la misma notación de punto**, MongoDB busca en cada elemento |

> [!important] (clave) **El arreglo embebido es lo que el modelo relacional no puede hacer**
> La 1FN prohíbe atributos multivaluados: por eso la regla 7 del deck 03 manda **crear una tabla
> nueva** *(`TELEF_ALUM`, `MAILS_ALUM`)* para cada uno
> *([[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] §
> *Entidades y atributos*)*. El slide 15 es **ese atributo multivaluado, guardado adentro**:
> `addresses` es a `USER` lo que `TELEF_ALUM` era a `ALUMNO`, sin la tabla, sin la FK y sin el join.
> **Toda la ventaja del modelo documental para relaciones 1:N "contenidas" está en este slide**, y
> toda su desventaja está en el 18: el arreglo puede crecer sin cota.

## Slides 16–20 · Relación *one-to-many* con referencias de documentos

Es el bloque más largo *(slides 16–20)* y el único que **argumenta en contra de embeber**; también
el único que muestra **las dos direcciones posibles de una referencia** y elige una.

### Slide 16 · El planteo

> [!quote] Textual, completo
> - *"Considere el siguiente ejemplo que mapea relaciones de **editor y libro**. El ejemplo ilustra
> la ventaja de hacer referencia sobre documentos embebidos para **evitar la repetición** de la
> información del editor"*
> - *"Embeber el documento del editor dentro del documento del libro llevaría a la **repetición de
> los datos del editor**, como muestran los siguientes documentos:"*

El criterio invocado es el **1 del slide 8**: duplicación sin ganancia. El editor es el "uno" y el
libro el "muchos", pero **el documento natural para consultar es el libro**. Por eso embeber va "al
revés" de los slides 12 y 15: no se embeben los "muchos" en el "uno" sino **el "uno" en cada uno de
los "muchos"**, y ahí está la repetición.

### Slide 17 · Los dos libros con el editor embebido *(imagen, 499×602 px — ocupa el slide entero, sin título)*

```javascript
{
  title: "MongoDB: The Definitive Guide",
  author: [ "Kristina Chodorow", "Mike Dirolf" ],
  published_date: ISODate("2010-09-24"),
  pages: 216,
  language: "English",
  publisher: {  // ← resaltado en amarillo
  name: "O'Reilly Media",
  founded: 1980,
  location: "CA"
  }
}

{
  title: "50 Tips and Tricks for MongoDB Developer",
  author: "Kristina Chodorow",
  published_date: ISODate("2011-05-06"),
  pages: 68,
  language: "English",
  publisher: {  // ← resaltado en amarillo
  name: "O'Reilly Media",
  founded: 1980,
  location: "CA"
  }
}
```

**Los dos bloques `publisher` están resaltados en amarillo**: es el dato repetido. Cuatro cosas que
solo se ven en la imagen, y el deck no comenta:

1. **`author` es un arreglo en el primer libro y un string en el segundo**: **esquema flexible en
  acción**, dos documentos de la misma colección con **tipos distintos en el mismo campo**. En MySQL
  sería imposible; en MongoDB es legal, y `{ author: "Kristina Chodorow" }` **encuentra a los dos**
  *(sobre un arreglo, la igualdad busca el valor entre los elementos)*. Primer campo polimórfico del
  vault.
2. **`ISODate("2010-09-24")`** es el tipo fecha de BSON, con su constructor del shell: no es un
  string. Primera aparición en el vault.
3. **Ninguno de los dos libros tiene `_id`** aquí; lo tendrán en el 19 y el 20, cuando haga falta
  referenciarlos.
4. **`pages: 216`, `pages: 68`, `founded: 1980`, `location: "CA"`**: los dos libros existen;
  O'Reilly se fundó en 1978, pero `1980` es lo que dice el ejemplo y se conserva `[sic]`.

> [!tip] La repetición del slide 17, en términos de la U1
> `title → publisher.name → publisher.founded` es una **dependencia transitiva**: en la U1 **viola
> 3FN** y la corrección es obligatoria. Aquí la corrección *(slides 18–20)* **se justifica por el
> costo de mantenimiento**: si O'Reilly se muda, hay que actualizar N libros; si nadie actualiza
> editores nunca, el slide 8 permitiría dejarlo así. Mismo diagnóstico, distinta autoridad.

### Slide 18 · La regla del crecimiento

> [!quote] Textual, completo
> - *"Para evitar la repetición de los datos del editor, use referencias y mantenga la información
> del editor en una **colección separada** de la colección de libros"*
> - *"Cuando se usan referencias, **el crecimiento de las relaciones determina dónde almacenar la
> referencia**. Si el número de libros por editor es pequeño con un crecimiento limitado, a veces
> puede ser útil almacenar la referencia del libro dentro del documento del editor. De lo contrario,
> si el número de libros por editor **no tiene límites**, este modelo de datos llevaría a **arreglos
> mutables y en crecimiento**, como en el siguiente ejemplo:"*

Es el slide **más importante del bloque** y trae la única regla nueva del deck que no estaba en los
slides 5 y 8:

> **Con referencias hay que decidir de qué lado va la referencia, y lo decide el crecimiento.**

| Dónde va la referencia | Cuándo | Qué se obtiene | Qué se arriesga |
| --- | --- | --- | --- |
| **En el "uno"** *(arreglo de ids de libros dentro del editor)* | *"pequeño, con crecimiento limitado"* | "todos los libros de este editor" en una lectura | un **arreglo que crece sin cota**, hasta pegar contra los **16 MB** del slide 6; y cada libro nuevo **reescribe** el documento del editor |
| **En el "muchos"** *(id del editor dentro de cada libro)* | siempre que el número no tenga cota | documentos de tamaño fijo; agregar un libro no toca al editor | "todos los libros de este editor" es una consulta sobre la colección `books` *(con índice en `publisher_id`, barata)* |

> [!important] (clave) Esta regla **no tiene equivalente relacional**, y por eso es la que hay que estudiar
> En la U1 la FK va **siempre** en el lado N: "la lista de libros" en la fila del editor es un
> multivaluado y la 1FN lo prohíbe. **MongoDB sí lo admite** *(slide 19)*, y por eso necesita un
> criterio que el relacional nunca necesitó: el **crecimiento**. Acotado → puede ir en el "uno"; no
> acotado → va en el "muchos", que es la solución relacional.

### Slide 19 · La referencia en el "uno" — el arreglo que crece *(imagen, 484×587 px — slide entero, sin título)*

```javascript
{
  name: "O'Reilly Media",
  founded: 1980,
  location: "CA",
  books: [123456789, 234567890, ...]  // ← resaltado en amarillo
}

{
  _id: 123456789,
  title: "MongoDB: The Definitive Guide",
  author: [ "Kristina Chodorow", "Mike Dirolf" ],
  published_date: ISODate("2010-09-24"),
  pages: 216,
  language: "English"
}

{
  _id: 234567890,
  title: "50 Tips and Tricks for MongoDB Developer",
  author: "Kristina Chodorow",
  published_date: ISODate("2011-05-06"),
  pages: 68,
  language: "English"
}
```

**`books: [123456789, 234567890, ...]` está resaltado en amarillo**, y los tres puntos son del
ejemplo: "y sigue creciendo". Respecto del slide 17, los libros **ganaron `_id`** *(numéricos, no
`ObjectId`)* y **perdieron `publisher`**; el editor **apareció como documento propio** con un arreglo
de ids y **no muestra `_id`**: todavía nadie lo referencia. Es el modelo *"anti-relacional"*, **la FK
multivaluada en el lado 1**, que el slide 18 limita a arreglos con cota; para un editor, no la hay.

### Slide 20 · La referencia en el "muchos" — la solución *(imagen, 461×529 px, **recortada al pie**)*

> [!quote] Textual
> *"Para evitar arreglos crecientes y mutables, almacene la referencia del editor dentro del
> documento del libro:"*

```javascript
{
  _id: "oreilly",
  name: "O'Reilly Media",
  founded: 1980,
  location: "CA"
}

{
  _id: 123456789,
  title: "MongoDB: The Definitive Guide",
  author: [ "Kristina Chodorow", "Mike Dirolf" ],
  published_date: ISODate("2010-09-24"),
  pages: 216,
  language: "English",
  publisher_id: "oreilly"  // ← resaltado en amarillo
}

{
  _id: 234567890,
  title: "50 Tips and Tricks for MongoDB Developer",
  author: "Kristina Chodorow",
  published_date: ISODate("2011-05-06"),
  // … el slide se corta aquí: la imagen está recortada en el borde inferior
}
```

> [!note] La imagen del slide 20 está **recortada**: el tercer documento termina en `published_date`
> Por simetría con el segundo libro, lo que falta es
> `pages: 68, language: "English", publisher_id: "oreilly" }`. **Es deducción**, no transcripción:
> el PNG no lo muestra.

Respecto del slide 19: el editor **ganó `_id: "oreilly"`** *(string, como `"joe"`)* y **perdió
`books`**; cada libro **ganó `publisher_id: "oreilly"`**. **Es el slide 7 otra vez**: la referencia
del hijo al padre, la FK en el lado N.

> [!success] (clave) El bloque 16–20 termina exactamente donde empezó la U1
> `publisher_id` en `books` es la **regla de la binaria 1:N** del deck 03, escrita en JSON. El deck
> dio la vuelta completa: embebido *(17)* → referencia en el "uno" *(19)* → referencia en el
> "muchos" *(20)*, y la última es la que MySQL habría producido sin pensar. **Lo que MongoDB agrega
> no es una solución nueva: es que el caso se decide, en lugar de venir decidido.** Lo que quita es
> la restricción: nada impide un libro con `publisher_id: "penguin"` que no exista → § *Dudas abiertas*.

---

## Slides 21–25 · Agregaciones y `$lookup`

### Slide 21 · La lista

> [!quote] Textual, completo
> *"**Agregaciones**"*
> - *"Lookup"*
> - *"Sort"*
> - *"Match"*
> - *"Unwind"*
> - *"Project"*

Cinco etapas del *aggregation pipeline*, sin `$`, sin descripción, sin orden particular. **El deck
desarrolla una**: `Lookup`, en los slides 22–24. Las otras cuatro no vuelven a aparecer, y **`Group`
no está** en la lista.

| Etapa | Qué hace | Equivalente SQL de la U1 | ¿En este deck? |
| --- | --- | --- | --- |
| `$lookup` | *left outer join* con otra colección de la misma base | `LEFT JOIN` | **slides 22–24** |
| `$sort` | ordena los documentos del pipeline | `ORDER BY` | solo nombrado |
| `$match` | filtra documentos | `WHERE` *(o `HAVING`, según dónde esté)* | solo nombrado |
| `$unwind` | **desarma un arreglo**: un documento por elemento | no tiene *(es el inverso de embeber: convierte `addresses: [a, b]` en dos documentos)* | solo nombrado |
| `$project` | elige y renombra campos, calcula expresiones | `SELECT` | solo nombrado |
| `$group` | agrupa y acumula | `GROUP BY` + funciones de agregación | **ausente** |

> [!tip] `$unwind` es **la etapa que conecta las dos mitades del deck**
> Todo el bloque 3–20 decide si un dato va en un arreglo embebido o en otra colección. `$unwind` es
> lo que hace que **la decisión de embeber no cueste consultas**: un arreglo embebido se
> "desnormaliza hacia afuera" en el pipeline —un documento por dirección— y se agrupa, filtra y
> cuenta como si fueran filas. `$lookup` junta lo que está separado; `$unwind` separa lo que está
> junto. La [[Clase 14 - MongoDB Features]] lo desarrolla.

*Seven Databases* 2ª ed. presenta el pipeline en cap. 4 › *Day 2* › § *Aggregated Queries*
*(impresas 115–117)* con `$match`, `$group`, `$sort` y `$project` sobre `cities`, y la analogía de
la tabla: *"Think of `aggregate()` as a combination of `WHERE`, `GROUP BY`, and `ORDER BY` clauses
in SQL"*. **`$lookup` no aparece en el libro** *(verificado sobre el texto del cap. 4: cero
ocurrencias)* → § *Bibliografía verificada*.

### Slide 22 · `Lookup` — los datos *(dos imágenes: 579×137 px y 679×237 px)*

```javascript
db.orders.insert([
  { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
  { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
  { "_id" : 3  }
])
```

```javascript
db.inventory.insert([
  { "_id" : 1, "sku" : "almonds", description: "product 1", "instock" : 120 },
  { "_id" : 2, "sku" : "bread", description: "product 2", "instock" : 80 },
  { "_id" : 3, "sku" : "cashews", description: "product 3", "instock" : 60 },
  { "_id" : 4, "sku" : "pecans", description: "product 4", "instock" : 70 },
  { "_id" : 5, "sku": null, description: "Incomplete" },
  { "_id" : 6 }
])
```

**El ejemplo está armado para mostrar tres casos** antes del join:

| Documento | Qué tiene de particular | Para qué está |
| --- | --- | --- |
| `orders._id: 3` | **no tiene `item`** | una orden sin clave de join: ¿con qué se junta? |
| `inventory._id: 5` | `sku: null`, explícito | un valor **nulo** en el campo de join |
| `inventory._id: 6` | **no tiene `sku`** | el campo de join **ausente** |
| `inventory._id: 2, 3` | `bread`, `cashews`: nadie los ordena | filas del lado derecho sin pareja: no salen en un *left* join desde `orders` |

Transcripción: las claves van entre comillas *(`"_id"`, `"item"`)* **salvo `description`**, sin
comillas en los cinco documentos que lo tienen; en JavaScript son equivalentes, en JSON estricto no.
Se conserva tal cual. **`insert()` con arreglo** es shell legacy: en `mongosh` es
`insertMany([...])`; `insert` sigue existiendo como deprecado.

### Slide 23 · `Lookup: Left outer join` *(imagen, 305×283 px)*

**No es la primera vez que aparece `$lookup`:** la [[Clase 12 - Introduccion a NoSQL]] *(slides
48–49)* ya lo mostró sobre `posts`/`comments`; este deck repite el patrón con `orders`/`inventory`.

```javascript
db.orders.aggregate([
  {
  $lookup:
  {
  from: "inventory",
  localField: "item",
  foreignField: "sku",
  as: "inventory_docs"
  }
  }
])
```

Los cuatro parámetros, contra el `JOIN` de la U1 *([[1.05.01 - SQL — consultas|SQL — consultas]])*:

| Parámetro | Valor | En SQL sería |
| --- | --- | --- |
| *(colección sobre la que se agrega)* | `orders` | `FROM orders` — **el lado izquierdo, el que se conserva entero** |
| `from` | `"inventory"` | `LEFT JOIN inventory` |
| `localField` | `"item"` | la mitad izquierda del `ON`: `orders.item` |
| `foreignField` | `"sku"` | la mitad derecha del `ON`: `inventory.sku` |
| `as` | `"inventory_docs"` | **no tiene equivalente**: el resultado del join **se embebe como arreglo** dentro de cada documento de `orders`, no se aplana en columnas |

> [!important] (clave) `$lookup` **no devuelve filas: devuelve documentos con un arreglo adentro**
> En SQL el join produce **una fila por pareja** *(una orden con tres productos sale tres veces)*.
> `$lookup` produce **un documento por orden, con `inventory_docs: [ … ]` que contiene todas las
> parejas**: **el join reconstruye, al vuelo, el modelo embebido** a partir del normalizado. Para
> filas al estilo SQL hay que agregar `$unwind: "$inventory_docs"` después, la etapa del slide 21 que
> el deck no desarrolla.
>
> Restricciones que el título omite: `from` tiene que ser una colección **de la misma base de
> datos**, y `$lookup` **no corre sobre colecciones *sharded*** en versiones viejas *(la restricción
> se levantó en la 5.1)*. Es el precio de un join en un motor que, como dice *Seven Databases* cap. 4
> › § *References* *(impresa 106)*, *"isn't built to perform joins"*.

### Slide 24 · `Resultado` *(imagen, 730×473 px, **recortada al pie**)*

```javascript
{
  "_id" : 1,
  "item" : "almonds",
  "price" : 12,
  "quantity" : 2,
  "inventory_docs" : [
  { "_id" : 1, "sku" : "almonds", "description" : "product 1", "instock" : 120 }
  ]
}
{
  "_id" : 2,
  "item" : "pecans",
  "price" : 20,
  "quantity" : 1,
  "inventory_docs" : [
  { "_id" : 4, "sku" : "pecans", "description" : "product 4", "instock" : 70 }
  ]
}
{
  "_id" : 3,
  // … la imagen se corta aquí
```

> [!warning] (crítico) El slide se corta **justo antes del caso interesante**
> La imagen termina en `"_id" : 3,` — la orden **sin `item`**. Lo que sigue en la fuente, y **el deck
> no muestra**, es:
>
> ```javascript
> {
> "_id" : 3,
> "inventory_docs" : [
> { "_id" : 5, "sku" : null, "description" : "Incomplete" },
> { "_id" : 6 }
> ]
> }
> ```
>
> **Razonamiento, verificado en MongoDB 8.3.11 con los datos del slide 22:** para `$lookup`, **un
> campo ausente se compara como `null`**, y `null` es igual a `null`. La orden 3 no tiene `item`
> → su `localField` vale `null` → empareja con `inventory` 5 *(`sku: null`)* **y** con 6 *(sin
> `sku`)*. Es la semántica opuesta a SQL, donde `NULL = NULL` **no es verdadero** y una fila con
> `item NULL` saldría del `LEFT JOIN` con el lado derecho vacío. **Los tres documentos raros del
> slide 22 están puestos para mostrar esto, y el recorte se lo comió.** (ok) Corrida real
> (`insertMany` con los datos del slide 22 y el `$lookup` del slide 23): la orden 3 sale con
> `inventory_docs: [ { _id: 5, sku: null, description: 'Incomplete' }, { _id: 6 } ]`, exactamente
> el bloque de arriba. Una orden con `item: null` explícito empareja con los mismos dos documentos.

Lo que sí se ve: las órdenes 1 y 2 salen con **un arreglo de un elemento**; `bread` y `cashews` no
aparecen *(no están del lado izquierdo)*; y `description` sale **entre comillas** porque el shell
imprime todas las claves con comillas, en el mismo orden de campos del `insert` del slide 22.

### Slide 25 · Link de referencia

> [!quote] Textual
> *"`https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/`"*

**Único link del deck.** Apunta a la **referencia de etapas del pipeline**, no a las páginas de
diseño de modelo de las que salen los slides 2–20. El dominio `docs.mongodb.com` **redirige** hoy a
`www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/` *(no verificado en esta
sesión: el vault no navega)*.

---

## Slide 26 · Ejemplo — `find()` con proyección

> [!quote] Textual, completo
> - *"Obtener el teléfono y el número de cliente del cliente con nombre “Wanda” y apellido “Baker”"*
> - *`db.cliente.find({nombre: "Wanda", apellido: "Baker"}, {codigo_area: 1, nro_telefono:1}).pretty()`*

Es texto vivo *(no imagen)* y **el único slide del deck con un esquema en español**: `cliente`,
`nombre`, `apellido`, `codigo_area`, `nro_telefono`. No es el de ningún ejemplo anterior, y
**tampoco aparece en el [[Práctica 2026-09-15|TP9]] ni en la *Consigna MONGO DB*** archivados en
`raw/` *(verificado: ninguno trae `cliente`, `codigo_area`, `nro_telefono`, "Wanda" ni "Baker")*.
Origen no identificado → § *Dudas abiertas*.

| Parte | Qué es | En SQL |
| --- | --- | --- |
| `db.cliente` | la colección | `FROM cliente` |
| `{nombre: "Wanda", apellido: "Baker"}` | **filtro** — dos condiciones en un mismo objeto son un `AND` implícito | `WHERE nombre = 'Wanda' AND apellido = 'Baker'` |
| `{codigo_area: 1, nro_telefono: 1}` | **proyección** — `1` incluye | `SELECT codigo_area, nro_telefono` |
| `.pretty()` | formatea la salida en el shell legacy | — |

> [!warning] La consulta **no devuelve lo que la consigna pide**, por dos razones que el slide no ve
> 1. La consigna pide *"el teléfono y **el número de cliente**"*; la proyección pide `codigo_area` y
> `nro_telefono`: **el número de cliente no está en la lista**, salvo que sea el `_id`, que…
> 2. …**sale igual**: la proyección con `1` incluye lo pedido **más `_id`**, siempre, salvo que se lo
> excluya con `_id: 0`. La salida es `_id`, `codigo_area` y `nro_telefono`. Si el número de cliente
> **es** `_id`, la consulta está bien por accidente; si es un campo `nro_cliente`, falta. El slide 27
> muestra justo el `_id: 0`.
>
> Es el tipo de detalle que en el parcial cuesta un punto: **la proyección inclusiva de MongoDB no
> es un `SELECT`**, porque `_id` viaja siempre.

## Slide 27 · *"Lógica de control"* — `forEach` y `printjson` *(imagen, 1008×1228 px, fondo oscuro)*

```javascript
db.ideal.find(
{
  fullyManaged: true,
  security: 'built-in',
  cloud:
  {
  $in: ['AWS', 'Azure', 'GCP']
  }
},
{
  _id: 0,
  try: 1
}).forEach((doc) =>
{
  printjson(doc);
});

{
  'try': 'MongoDB Atlas Today'
}
```

> [!note] Es **el snippet de portada del sitio de MongoDB**, no un ejemplo didáctico
> Una **pieza de marketing de Atlas** *(la "base ideal": totalmente administrada, seguridad
> incorporada, en las tres nubes)*, con la salida como chiste: `{ 'try': 'MongoDB Atlas Today' }`. El
> deck lo trae con fondo oscuro, tal cual la captura del sitio. **No hay colección `ideal` en ningún
> esquema de la cursada.**

Lo que el slide sí enseña, si se lo lee como código:

| Construcción | Qué hace | Primera vez en el vault |
| --- | --- | --- |
| `$in: [ … ]` | el campo vale **alguno** de los de la lista | sí — `IN (…)` de SQL |
| `_id: 0, try: 1` | **proyección con exclusión de `_id`** — la respuesta al problema del slide 26 | sí |
| `.forEach((doc) => { … })` | **itera el cursor** que `find()` devuelve, un documento por vez, con una *arrow function* de JavaScript | sí — es el equivalente de un [[1.10.03 - Cursores\|cursor]] de la U1, solo que aquí **todo `find()` devuelve un cursor** |
| `printjson(doc)` | imprime el documento como JSON en el shell | sí |

> [!important] (clave) Por qué el slide se llama *"Lógica de control"*
> Porque **el shell de MongoDB es JavaScript** y tiene `forEach`, `if`, `for`, `while`, funciones y
> variables **sin un lenguaje procedural aparte**. Es la respuesta de MongoDB al problema del slide 2
> de la [[Clase 10 - Restricciones integridad-Parte 2]] —*"cada proveedor de BD tiene su propio
> lenguaje procedural"*—: el lenguaje procedural de MongoDB **es el del shell**, y el `forEach` sobre
> el cursor es lo que en PL/pgSQL era `OPEN` / `FETCH` / `CLOSE`. *Seven Databases* lo trata en
> cap. 4 › *Day 1* › § *Command-Line Fun* › *JavaScript* *(impresas 96–98)* y en § *Reading with
> Code* *(impresas 108–109)*.

## Slide 28 · `Explain` *(imagen, 760×189 px — captura de la documentación)*

> [!quote] Textual de la captura *(en inglés, tal cual)*
> *"The following example runs `cursor.explain()` in `"executionStats"` verbosity mode to return
> the query planning and execution information for the specified `db.collection.find()` operation:"*
>
> ```javascript
> db.products.find(
> { quantity: { $gt: 50 }, category: "apparel" }
> ).explain("executionStats")
> ```

**Último slide del deck**: sin resultado ni cierre; la captura tiene incluso el ícono de "copiar" de
la página de documentación. Lo que trae, contra la [[Clase 08 - Explicando el plan]]:

| | MySQL *(U1)* | MongoDB *(este slide)* |
| --- | --- | --- |
| Cómo se pide | `EXPLAIN SELECT …` | `.explain()` **encadenado al cursor** |
| Niveles | `EXPLAIN` / `EXPLAIN ANALYZE` | `"queryPlanner"` *(default)* / **`"executionStats"`** / `"allPlansExecution"` |
| Qué muestra `executionStats` | — | el plan **y** la ejecución real: `totalDocsExamined`, `nReturned`, `executionTimeMillis`, y si hubo `COLLSCAN` o `IXSCAN` |
| Para qué se usa en la cursada | ver si un `WHERE` usa índice | ver si un filtro usa índice — **mismo uso**, [[1.08.01 - Plan de ejecución\|Plan de ejecución]] |

`$gt: 50` es el segundo operador de comparación del deck *(después del `$in` del slide 27)*:
`quantity > 50 AND category = 'apparel'`. *Seven Databases* 2ª ed. usa **exactamente**
`explain("executionStats")` en cap. 4 › *Day 2* › § *Indexing: When Fast Isn't Fast Enough*
*(impresas 111–112)*: corre un `find` sobre `phones` sin índice
*(`executionTimeMillisEstimate: 58`)*, crea el índice y lo vuelve a correr *(`0`)*, con la
observación *"scanned objects dropped from 109999 to 1"*. Es el mismo experimento que el TP5 pedía
en MySQL.

---

## Contraste con la derivación relacional — el mapa completo

La [[1.03.01 - Derivación de MER a esquema relacional|tabla de reglas del deck 03]] convierte cada
constructo del MER en tablas **sin decisión**. Este deck reemplaza cada regla por **una decisión con
criterio**:

| Constructo | Regla relacional *(deck 03)* | En MongoDB *(este deck)* | Criterio que decide | Slides |
| --- | --- | --- | --- | --- |
| **Atributo compuesto** *(dirección = calle + ciudad + …)* | se **despliega** en columnas; el compuesto desaparece | **subdocumento embebido** `address: { … }`; la estructura se conserva | siempre embebido *(criterio "contiene")* | 4, 12 |
| **Atributo multivaluado** *(teléfonos, direcciones)* | **tabla nueva** con PK compuesta y FK *(regla 7)* | **arreglo embebido** `addresses: [ … ]` | embebido si tiene cota y se lee con el padre; si no, colección aparte | 15, 18 |
| **Binaria 1:1** | **el deck 03 no da regla** | embebido *(`address`)* **o** referencia hijo→padre *(`patron_id`)* | embebido si se leen juntos | 9–12 |
| **Binaria 1:N, los "muchos" contenidos** | FK en el lado N | **arreglo embebido en el "uno"** | *"siempre en el contexto del uno"* | 13–15 |
| **Binaria 1:N, el "uno" compartido** *(editor)* | FK en el lado N | referencia en el "muchos": `publisher_id` | duplicación sin ganancia + crecimiento sin cota | 16–20 |
| **Binaria 1:N, arreglo de refs en el "uno"** | **prohibido** *(1FN)* | `books: [ids]` en el editor | solo si el número es *"pequeño con crecimiento limitado"* | 18–19 |
| **Binaria N:M** | **tabla nueva** con dos FK | referencias — **el deck no muestra cómo** | *"relaciones más complejas de muchos a muchos"* | 8 |
| **Jerarquía / árbol** | jerarquía ES-UN: una tabla por nodo | referencias | *"grandes conjuntos de datos jerárquicos"* + 100 niveles / 16 MB | 6, 8 |
| **Integridad referencial** | `FOREIGN KEY` + `ON DELETE` / `ON UPDATE` | **no existe**: `user_id`, `patron_id`, `publisher_id` son campos comunes | — *(la aplicación)* | 7, 20 |
| **Join** | `JOIN … ON` produce filas | `$lookup` produce **documentos con un arreglo**; `$unwind` los aplana | — | 23–24 |
| **Atomicidad** | la transacción *([[Clase 11 - Seguridad-Transacciones]])* | **el documento** — lo embebido se escribe atómico; lo referenciado, no | — | 5 |

> [!important] (clave) La lectura que conviene llevarse
> **Normalizar en MongoDB es aplicar la regla relacional; embeber es no aplicarla.** El criterio es
> siempre el mismo con tres caras: **cómo se lee** *(¿juntos?)*, **cómo crece** *(¿con cota?)* y
> **cómo se duplica** *(¿se actualiza?)*. Ninguno es una propiedad del dato: **son propiedades de la
> aplicación**. En la U1 el esquema salía del dominio; aquí sale de la carga.

---

## Cuadro de bolsillo — todo el deck en una pantalla

| Pregunta | Embeber | Referenciar |
| --- | --- | --- |
| ¿La parte tiene sentido sin el todo? | no → **embeber** | sí |
| ¿Los "muchos" se leen siempre con el "uno"? | sí → **embeber** | no |
| ¿El dato se repetiría en muchos documentos y cambia? | no | sí → **referenciar** |
| ¿Es N:M? | — | **referenciar** |
| ¿Es una jerarquía grande o profunda? | — | **referenciar** *(100 niveles, 16 MB)* |
| ¿El arreglo crece sin cota? | no | sí → **referencia en el "muchos"** |
| Lecturas | **1** | varias, o `$lookup` |
| Escritura del conjunto | **atómica** | varias operaciones |
| Costo típico | documento grande, reescritura | *round-trips* |
| Nombre que le da el deck | *"desnormalizado"* | *"normalizado"* |

**Los tres ejemplos, en una línea cada uno:**

- **Usuario–dirección (1:1)**: `patron_id` en la dirección → `address: { … }` en el usuario.
- **Usuario–direcciones (1:N contenido)**: dos documentos con `patron_id` → `addresses: [ … ]`.
- **Editor–libros (1:N compartido)**: `publisher: { … }` repetido → `books: [ids]` que crece →
  `publisher_id` en cada libro.

**Sintaxis que aparece por primera vez en el vault** *(nueva respecto de la
[[Clase 12 - Introduccion a NoSQL]], dictada antes el mismo lunes)*: `ISODate(…)`, `$in`, la
proyección como segundo argumento de `find()` —`{ campo: 1 }` y `{ _id: 0 }`—, `.forEach()` sobre
el cursor, `printjson()` y `.explain("executionStats")`.
**Ya vista en la Clase 12** *(slides 39–49)* y que este deck repite: `$gt`, `.pretty()`,
`insert([ … ])`, `aggregate([ … ])` y `$lookup` con `from` / `localField` / `foreignField` / `as`.

---

## Bibliografía verificada

Todo lo de abajo está verificado **contra las fichas** de `raw/Material_Catedra/bibliografia/` y,
donde se cita texto, contra el PDF. `—` = verificado que no está. El mapeo fino lo hace
[[_index-bibliografia]] › Clase 13.

| Tema del deck | *Seven Databases* 2ª ed. *(cap. 4 MongoDB, impresas 93–133)* | Corbellini et al. 2017 | Otros |
| --- | --- | --- | --- |
| Documentos anidados, subdocumentos | cap. 4 › *Day 1: CRUD and Nesting* *(94–110)*, en particular § *Digging Deep* *(100–104)* | § 6, pp. 15–16 *(documentos JSON/BSON, schemaless)* | — |
| *"Desnormalizado"* como naturaleza del modelo | *Day 1 Wrap-Up* *(109)*: *"complex, denormalized documents"* · *Mongo's Weaknesses* *(133)*: *"Mongo encourages denormalization of schemas"* | — | — |
| Referencias entre documentos | cap. 4 › *Day 1* › § *References* *(106–107)*: *"Mongo isn't built to perform joins"*; forma `{ $ref, $id }` | — | — |
| Límite de **16 MB** | recuadro *Mongo's Many Useful CLI Tools* *(114)* y § *Mapreduce (and Finalize)* *(122)* — **no como límite de documento** | **§ 6, pp. 15–16** *(BSON y su límite de 16 MB)* | — |
| **100 niveles** de anidamiento | — | — | — *(documentación oficial)* |
| Atomicidad por documento | — | § 6, pp. 15–16 *(operaciones atómicas por documento; sin MVCC)* | GMUW cap. 6.6 y Date cap. 15 para el concepto de transacción, no para MongoDB |
| *Aggregation pipeline* | cap. 4 › *Day 2* › § *Aggregated Queries* *(115–117)*: `$match`, `$group`, `$sort`, `$project` | — | — |
| **`$lookup`** | **—** *(cero ocurrencias en el cap. 4)* | — | — *(documentación oficial: el link del slide 25)* |
| `explain("executionStats")` | cap. 4 › *Day 2* › § *Indexing: When Fast Isn't Fast Enough* *(111–112)* | — | — |
| Cursor, `forEach`, JavaScript en el shell | cap. 4 › *Day 1* › § *Command-Line Fun* › *JavaScript* *(96–98)*; § *Reading with Code* *(108–109)* | § 6 *(la API `find()` y los cursores)* | — |
| Patrones 1:1 / 1:N / N:M con nombre | — | — | — *(documentación oficial: *Data Model Design*)* |

> [!warning] Los `4.N` **no se usan** en esta página, a propósito
> La ficha de *Seven Databases* advierte que los `4.1`–`4.5` de su tabla son *"extrapolación de la
> convención, no citas existentes"*. Por eso las citas van por **título de sección y página
> impresa**. Cuando [[_index-bibliografia]] fije la convención para el cap. 4, se reemplazan.

**Lectura mínima sugerida** *(propuesta; la fija la etapa de bibliografía)*: *Seven Databases* cap. 4
› *Day 1* completo *(impresas 94–110, 17 páginas)* — anidamiento, `find` con proyección, referencias
y el shell JavaScript — más § *Aggregated Queries* *(115–117)* y las dos páginas de `explain`
*(111–112)*. **Corbellini § 6** *(pp. 14–16)* para el marco. Total: **~25 páginas**. Para embebido
vs. referenciado con sus tres patrones **no hay libro en el vault**: la fuente es la documentación
oficial de MongoDB, y este deck es su traducción.

---

## Contradicciones internas del deck y erratas

Dieciocho, todas documentadas en la sección del slide correspondiente, y **ninguna es un error
conceptual**: tres nombres para el deck *(1)*; *embebido* / *incrustado* / *incorporación* para
*embedded* *(5, 8, 11, 14)*; título ≠ contenido *(13, 27)*; *"más óptimo"* y *"y luego con la
referencia"* *(14, 11)*; `author` arreglo en un libro y string en el otro *(17; no es error, es
esquema flexible que el deck no señala)*; datos de juguete *(`founded: 1980`, dos
`zip: "12345"`)*; dos imágenes recortadas *(20, 24, y la 24 se come el caso que el ejemplo está
armado para mostrar)*; cinco etapas listadas y una desarrollada, con `$group` ausente *(21)*;
comillas inconsistentes en el `insert`
*(22)*; consulta ≠ consigna *(26)*; shell legacy y dominio viejo *(22, 25, 26)*; y un cierre
inexistente *(28)*. El deck es una traducción cuidadosa de la documentación; lo que se le cae son los
bordes.

---

## Dudas abiertas

- [ ] **N:M sin ejemplo.** ¿Arreglo de ids en **los dos** lados? ¿Colección intermedia como la tabla
  del deck 03? ¿Cuál enseña la cátedra? Es la pregunta más obvia para el parcial. Preguntar en la
  práctica.
  - (nota) Evidencia de exámenes viejos: la Pregunta 31 de [[Parcial 2Q2025|Parcial 2Q2025]] (ensayo: ventajas y
    desventajas del embebido) confirma que el tema se evalúa. Su solucionario de estudiantes manda a
    usar referencias en *"relaciones N-N"*, pero no dice **cómo** referenciar un N:M: ni arreglo en
    los dos lados ni colección intermedia. La forma sigue sin respuesta.
- [ ] **Integridad referencial.** Nadie valida `user_id` / `publisher_id`. ¿El TPO maneja huérfanos
  desde la aplicación? ¿Se menciona el *schema validation* *(`$jsonSchema`)* en alguna clase?
- [x] ~~**El resultado recortado del slide 24.** Verificar en `mongosh` con los datos del slide 22 que
  la orden 3 *(sin `item`)* empareja con `inventory` 5 *(`sku: null`)* **y** 6 *(sin `sku`)*; si es
  así, escribirlo en [[MongoDB]] como la diferencia `null = null` con SQL.~~ (ok) Verificado en
  MongoDB 8.3.11: un `localField` ausente o `null` empareja con `foreignField: null` y con
  `foreignField` ausente *(la orden 3 trae `inventory` 5 y 6)* → § *Slide 24*.
- [ ] **Transacciones multidocumento.** ¿La cátedra llega a `session.startTransaction()` para el
  normalizado, o la respuesta es "embeba lo que necesite atómico"? Cruza con
  [[Clase 11 - Seguridad-Transacciones]].
  - (nota) Evidencia de exámenes viejos: el solucionario de la Pregunta 31 de [[Parcial 2Q2025|Parcial 2Q2025]] cuenta
    la *"atomicidad a nivel de documento"* como ventaja del embebido, en la línea de "embeba lo que
    necesite atómico". Ningún examen del vault pregunta por `session.startTransaction()` ni por
    transacciones multidocumento.
- [ ] **`Sort`, `Match`, `Unwind`, `Project` y `Group`.** Confirmar que la
  [[Clase 14 - MongoDB Features]] las desarrolla *(su texto extraído tiene `aggregate` con
  `$match`)*. Si tampoco trae `$unwind`, es un hueco de la cursada, no del deck.
- [ ] **El esquema `cliente` del slide 26.** No está en el [[Práctica 2026-09-15|TP9]] ni en la
  *Consigna MONGO DB*. ¿`nro_cliente` existe como campo *(proyección incompleta)* o es el `_id`
  *(bien por accidente)*?
- [ ] **Versión de MongoDB de la cursada.** El deck es de abril de 2024 y usa shell legacy; el TP9
  debería decir qué versión o imagen de Docker se usa. Si es 6.0 o superior, todo corre en `mongosh`
  con avisos de deprecación de `insert()`.
  - (nota) Ni la Parte I ni la Parte II del TP9 fijan versión. La Parte II remite a *"la opción de
    instalación que hayan elegido en el TP anterior"* y avisa que varios métodos del libro pueden estar
    deprecados. Corrido en MongoDB 8.3.11 / `mongosh` 2.11.1: `insert()` funciona con
    `DeprecationWarning` → [[Práctica 2026-09-22|Práctica 2026-09-22]] § *Qué del TP está deprecado*.
- [ ] **Regla para 1:1 en relacional.** [[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] no tiene
  regla para la binaria 1:1. ¿Vale agregar la respuesta estándar *(FK con `UNIQUE` en uno de los dos
  lados, o fusión de tablas)* como razonamiento propio?
- [ ] **Patrones con nombre.** ¿La cátedra usa el vocabulario de la documentación *(extended
  reference, subset, bucket, computed, outlier, polymorphic)* en alguna clase o en el TPO?
- [ ] **`DBRef` vs. referencia manual.** *Seven Databases* *(impresa 106)* muestra `{ $ref, $id }`;
  el deck usa solo campos sueltos. ¿Cuál se espera en el TP?

---

## Enlaces

- Clase anterior: [[Clase 12 - Introduccion a NoSQL]] *(mismo lunes 14/09)* · clase siguiente:
  [[Clase 14 - MongoDB Features]] *(mismo lunes 14/09)*.
- Última clase relacional: [[Clase 11 - Seguridad-Transacciones]] *(07/09)* · y hacia atrás,
  [[Clase 10 - Restricciones integridad-Parte 2]].
- Práctica de esa semana *(martes 15/09)*: [[Práctica 2026-09-15]] *(TP 9 - MongoDB Parte I)* ·
  práctica anterior: [[Práctica 2026-09-08]] *(TP8)*.
- Conceptos de la U1 con los que contrasta:
  [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]] ·
  [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] ·
  [[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] ·
  [[1.05.01 - SQL — consultas|SQL — consultas]] ·
  [[1.08.01 - Plan de ejecución|Plan de ejecución]] ·
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
  [[1.10.03 - Cursores|Cursores]].
- Conceptos nuevos *(propuestos; el nombre definitivo lo fija la etapa de conceptos)*:
  [[2.12.01 - NoSQL — origen, propiedades y taxonomía|NoSQL]] *(de la Clase 12)* ·
  [[2.13.01 - Documentos embebidos vs. referencias|Documentos embebidos vs. referencias]] ·
  [[2.13.02 - Relaciones 1:1, 1:N y N:M en MongoDB|Relaciones 1:1, 1:N y N:M en MongoDB]] ·
  [[2.12.08 - Aggregation pipeline|Aggregation pipeline y $lookup]].
- Motores: [[MongoDB]] *(página pendiente)* · [[MySQL]] *(para el contraste)* · [[PostgreSQL]].
- Índices: [[_index-clases]] · bibliografía: [[_index-bibliografia]] · calendario: [[_cronograma]]
  · catálogo: [[index]] · reglas: [[CLAUDE]].
- Exámenes viejos: [[Mapa de exámenes|Mapa de exámenes]] · embebido vs. no embebido en [[Parcial 2Q2025|Parcial 2Q2025]] § *Sección G*
  (Pregunta 31).
