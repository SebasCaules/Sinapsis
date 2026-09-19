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

> [!info] Fuente
> `raw/Unidad-02/Teorica/BD2_Clase 13 - NoSQL-EmbebidosVSNormalizado(1).pdf` · **28 slides** ·
> **18 imágenes embebidas** en 15 páginas *(verificado con `pdfimages -list`: fuera del adorno de
> plantilla y el logo del ITBA en la portada, hay una imagen en los slides 4, 7, 10, 12, 13, 15, 17,
> 19, 20, 23, 24, 27 y 28, y dos en el 22)*. **Todos los documentos JSON, el `$lookup`, el
> resultado del join, el snippet de "Lógica de control" y el `explain()` están en imagen**: el texto
> extraído con `pdftotext` los pierde por completo, y esta página los transcribe de los PNG.
> El slide 1 es la **portada**; el 25 es el único con un link; **no hay slide de agenda, de
> bibliografía ni de cierre**: el deck termina en seco en el 28 con un `explain()`.
> Dictado en la **teórica del lunes 14/09**, el **mismo lunes** que la
> [[Clase 12 - Introduccion a NoSQL]] *(antes)* y la [[Clase 14 - MongoDB Features]] *(después)*.
> El `13` del nombre del archivo **es el número de clase**: la cátedra numera sus decks y ésa es la
> única numeración de clases que existe.
> Se practica con el **TP 9 - MongoDB Parte I** del martes 15/09 → [[Práctica 2026-09-15]].
> Bibliografía: [[_index-bibliografia]] › Clase 13.

> [!note] El `(1)` del nombre del archivo es un artefacto de descarga, **no parte del nombre**
> Mismo caso que `BD2_Clase 08 - Explicando el plan(1).pdf` → [[Clase 08 - Explicando el plan]].
> La página se llama `Clase 13 - NoSQL-EmbebidosVSNormalizado.md` **sin** el `(1)`, y el `deck:`
> del frontmatter lo lleva **con** el `(1)`, porque es lo que hace que el PDF se encuentre en
> `raw/`. Regla de [[CLAUDE]] § *Convenciones*.

> [!warning] 🔴 El deck tiene **tres nombres**, y ninguno coincide con otro
> | Dónde | Qué dice |
> | --- | --- |
> | **Nombre del archivo** | `NoSQL-EmbebidosVSNormalizado` |
> | **Portada** *(slide 1)* | *"**MongoDB: Diseño del Modelo de Datos** · Bases de Datos II"* |
> | **Metadato `Title` del PDF** *(`pdfinfo`)* | *"Introducción a Bases de Datos NoSQL"* — **el mismo `Title` que el PDF de la [[Clase 12 - Introduccion a NoSQL]]** |
>
> El metadato dice que **los decks 12 y 13 salieron del mismo archivo de PowerPoint** *(o de una
> copia con el mismo título interno)*: el 12 fue exportado el **14/04/2024** y el 13 el
> **28/04/2024**, los dos con PowerPoint 2010. Es decir que **el material es de abril de 2024**, y
> eso explica varias cosas que se ven adentro *(el dominio `docs.mongodb.com`, el `insert()` con
> arreglo, el `.pretty()` — ver el callout de motor)*.
>
> Para el `tema:` del frontmatter manda el [[_cronograma]]: la fila del **14/09** dice
> *"Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción a MongoDB ·
> **MongoDB: Enfoque embebido vs Normalizado** · Ejemplos con MongoDB"*. Este deck es el **tercer**
> ítem de esa fila, y parte del cuarto *(los "ejemplos" son los slides 21–28)*.

> [!success] 🎯 Una previsión del vault **acertó** y otra **falló**, las dos el mismo día
> - **Acertó**: la hipótesis de [[_index-clases]] de que *"la `Unidad-01` es «todo lo relacional» y
>   el corte cae recién en NoSQL"*. El humano archivó este deck en **`raw/Unidad-02/Teorica/`**:
>   `Unidad-02` **dejó de estar vacía** con el primer material NoSQL, y la Clase 11 *(seguridad y
>   ACID, todavía relacional)* fue a la U1. El corte cayó exactamente donde la hipótesis decía.
> - **Falló**: la tabla § *Unidades* de [[_cronograma]] preveía *"`Unidad-05` = Tipos de bases NoSQL,
>   MongoDB"* y *"`Unidad-04` = Seguridad, ACID"*. **Cayeron en U2 y U1.** Es la sexta y séptima
>   previsión de unidad que falla, y otra vez del mismo modo: una estructura derivada por el LLM
>   *(una unidad por tema del programa)* tratada como si fuera la del humano.
>
> La unidad sale del path: `raw/Unidad-02/` → `unidad: 2`. Y por primera vez los conceptos nuevos
> van a llevar prefijo `2.NN.NN`.

> [!important] Motor: **MongoDB, el motor de la cursada** — sin motor ajeno, pero con **shell legacy**
> Es el **primer deck teórico del vault que no tiene desfasaje de motor**: todo el código es de
> MongoDB, y MongoDB es lo que dice el [[_cronograma]] y lo que usa el [[Práctica 2026-09-15|TP9]].
> Verificado sobre los 28 PNG: **cero SQL** *(ni una sola sentencia; el único "join" es el
> `$lookup` del slide 23)*.
>
> Lo que sí tiene es **sintaxis del shell `mongo` legacy**, deprecada o ya sin efecto en
> **`mongosh`** *(el shell actual; el `mongo` legacy se retiró con MongoDB 6.0)*:
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
> usa *Seven Databases* 2ª ed.**, escrito contra **MongoDB 3.6** *(ficha, Apéndice A1, callout de
> versiones)*; `.pretty()` **no está en el cap. 4 del libro**. Y el link del slide 25 es
> **exactamente** el que el libro cita en cap. 4 › *Day 2* › § *Aggregated Queries* *(impresa 115,
> nota 3)*. Pero conviene saberlo antes de pegarlo en `mongosh` y ver un `DeprecationWarning`.
> Detalle en [[MongoDB]] *(página pendiente)*.

> [!note] De dónde sale el deck — **hipótesis**, porque el deck no lo cita
> Los ejemplos —`_id: "joe"` / `"Joe Bookreader"` / `"123 Fake Street"` / `"Faketon"`,
> `"MongoDB: The Definitive Guide"` / `"O'Reilly Media"` / `founded: 1980`, `orders` / `inventory`
> con `"almonds"` y `"pecans"`, y el `db.products.find(…).explain("executionStats")`— son, palabra
> por palabra, los de la **documentación oficial de MongoDB** *(las páginas *Data Model Design*,
> *Model One-to-One / One-to-Many Relationships with Embedded Documents*, *Model One-to-Many
> Relationships with Document References*, `$lookup` y `cursor.explain()`)*, y el texto de los
> slides 2, 3, 5, 7, 8, 9, 11, 14, 16, 18 y 20 es **una traducción de esas páginas**. El único link
> del deck *(slide 25)* apunta a la referencia de operadores del *aggregation pipeline*, no a esas
> páginas. **Se registra como hipótesis**: no está verificado contra la documentación, que no forma
> parte del vault. Lo que importa para estudiar es que **la fuente primaria de este deck es la
> documentación**, no un libro de la bibliografía → § *Bibliografía verificada*.

---

## Resumen

El deck contesta **la única pregunta de diseño que MongoDB deja abierta y el modelo relacional no**:
una vez que se decidió usar documentos, **¿los datos relacionados van adentro del documento o en otro
documento con una referencia?** El slide 2 lo dice en una frase: *"la consideración clave para la
estructura de sus documentos es la decisión de **embeberlos** o **utilizar referencias**"*. Todo lo
demás son consecuencias.

Se arma en cuatro bloques:

1. **La decisión y sus dos polos** *(slides 2–8)*. Documentos **embebidos** *("desnormalizados")*:
   una sola lectura, una sola escritura atómica, mejor rendimiento de lectura; se usan para relaciones
   *"contiene"* y **1:N donde los "muchos" siempre se ven en el contexto del "uno"**. Documentos
   **referenciados** *("normalizados")*: cuando embeber duplicaría datos sin ganancia de lectura,
   para **N:M** y para **jerarquías grandes**; cuestan **viajes de ida y vuelta**. Entre medio, las
   **dos cotas físicas de BSON**: **16 MB por documento** y **100 niveles de anidamiento**.
2. **Los patrones por cardinalidad** *(slides 9–20)*, cada uno con su ejemplo de la documentación
   oficial: **1:1 usuario–dirección** *(referencia → embebido, slides 9–12)*, **1:N usuario–direcciones**
   *(dos documentos referenciados → **un arreglo embebido**, slides 13–15)* y **1:N editor–libros**
   *(embebido repite al editor → arreglo de referencias en el "uno", que **crece sin cota** → la
   referencia va en el "muchos", slides 16–20)*.
3. **Agregaciones** *(slides 21–25)*: la lista de cinco etapas *(`Lookup`, `Sort`, `Match`,
   `Unwind`, `Project`)*, de las que **solo `$lookup` se desarrolla** —como *left outer join*
   entre `orders` e `inventory`—, y el link a la referencia de operadores.
4. **Tres ejemplos sueltos** *(slides 26–28)*: un `find()` con proyección y `.pretty()`, un
   `find().forEach()` con `printjson` *(titulado "Lógica de control")* y un
   `explain("executionStats")`.

| Bloque | Qué establece | Slides |
| --- | --- | --- |
| **Portada** | *"MongoDB: Diseño del Modelo de Datos"* | 1 |
| **La decisión** | embeber **o** referenciar: es *la* consideración clave | 2 |
| **Embebido — qué es** | *"desnormalizado"*; subdocumentos `contact` y `access` | 3–4 |
| **Embebido — cuándo** | relaciones *"contiene"*, 1:N con los "muchos" en contexto del "uno"; lectura en una operación, escritura atómica | 5 |
| **Cotas de BSON** | **16 MB** por documento · **100 niveles** de anidamiento | 6 |
| **Normalizado — qué es** | referencias `user_id` entre documentos | 7 |
| **Normalizado — cuándo** | duplicación sin ganancia · N:M · jerarquías grandes; cuesta *round-trips* | 8 |
| **1:1** usuario–dirección | referencia `patron_id` → subdocumento `address` | 9–12 |
| **1:N** usuario–direcciones | dos documentos referenciados → arreglo `addresses` | 13–15 |
| **1:N** editor–libros | embebido duplica → arreglo `books` mutable → `publisher_id` en el libro | 16–20 |
| **Agregaciones** | cinco etapas nombradas, `$lookup` desarrollado, link a la referencia | 21–25 |
| **Ejemplos** | `find` + proyección, `forEach` + `printjson`, `explain` | 26–28 |

> [!important] 🔴 Lo que el deck **no** trae, y se nota
> - **Ningún ejemplo de N:M.** El slide 8 dice *"para representar relaciones más complejas de muchos a
>   muchos"* use referencias, y **no hay un solo documento** que lo muestre. Las tres cardinalidades
>   con ejemplo son 1:1 y dos 1:N. En el modelo relacional la N:M es **la** relación que genera tabla
>   *([[1.03.01 - Derivación de MER a esquema relacional|regla del slide 13 del deck 03]])*; aquí queda
>   nombrada y sin patrón → § *Dudas abiertas*.
> - **Cuatro de las cinco etapas del slide 21 no tienen slide.** `Sort`, `Match`, `Unwind` y
>   `Project` se listan y desaparecen. Y **`$group`**, la etapa que hace de `GROUP BY`, **ni siquiera
>   está en la lista**. La [[Clase 12 - Introduccion a NoSQL]] *(dictada antes, mismo lunes; slides
>   46–49)* ya trae `$group` con `$sum` y un `$lookup` completo sobre `posts`/`comments`, y la
>   [[Clase 14 - MongoDB Features]] *(mismo lunes)* la retoma.
> - **Nada de transacciones multidocumento.** El slide 5 promete *"una sola operación de escritura
>   atómica"* para el modelo embebido y **no dice qué pasa con el normalizado**: la escritura que toca
>   `user` y `contact` es **dos** operaciones. Corbellini § 6 *(p. 15–16)* registra que MongoDB tiene
>   *"operaciones atómicas por documento"*; las transacciones multidocumento existen desde la 4.0 y el
>   deck no las nombra.
> - **Ningún patrón con nombre** *(extended reference, subset, bucket, outlier…)*: el deck se queda en
>   la dicotomía embebido/referencia. **`DBRef`** tampoco aparece: las referencias del deck son
>   siempre un campo suelto *(`user_id`, `patron_id`, `publisher_id`, `books: [ids]`)*, que es lo
>   que la documentación llama *manual references*. *Seven Databases* cap. 4 › *Day 1* › § *References*
>   *(impresas 106–107)* muestra la otra forma, `{ $ref: "collection", $id: … }` → § *Bibliografía*.
> - **Qué es `ObjectId`.** Los slides 4 y 7 usan `<ObjectId1>` como marcador y nunca se explica.

---

## Slide 1 · La portada

> [!quote] Textual, completo
> *"**MongoDB: Diseño del Modelo de Datos**"*
> *"Bases de Datos II"*

Fondo azul del tema de PowerPoint, logo del ITBA. Es el slide que fija la identidad del deck —**es
una clase de diseño de esquema, no de introducción a NoSQL**— y el que muestra que el nombre del
archivo (*EmbebidosVSNormalizado*) es un resumen del contenido, no el título. Ver el callout de los
tres nombres.

**Plantilla distinta a la de los decks de la U1**: fondo blanco con ola celeste arriba, título en
azul petróleo, cuerpo en serif *(Cambria)*. Es la misma plantilla de la
[[Clase 12 - Introduccion a NoSQL]], lo que es coherente con que los dos PDF tengan el mismo `Title`
interno.

## Slide 2 · Introducción — la única decisión

> [!quote] Textual
> *"Los modelos de datos efectivos satisfacen las necesidades de su aplicación. La consideración
> clave para la estructura de sus documentos es la decisión de **embeberlos** o **utilizar
> referencias**."*

Dos frases, y las dos son el marco del deck:

| Frase | Qué establece |
| --- | --- |
| *"satisfacen las necesidades de su aplicación"* | **El esquema se diseña desde las consultas**, no desde las entidades. Es el reverso exacto del método de la U1, donde el MER se diseña desde el dominio y las consultas vienen después *([[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]])* |
| *"embeberlos o utilizar referencias"* | Es **una decisión por relación**, no por base: en un mismo documento puede haber un subdocumento embebido y un campo con referencia *(el slide 20 lo muestra: `author: [ … ]` embebido y `publisher_id` referenciado en el mismo libro)* |

> [!important] 🎯 Este es el punto de contacto con [[1.03.01 - Derivación de MER a esquema relacional|la derivación relacional]]
> En la U1 la pregunta *"¿esto va en la misma tabla o en otra?"* **no existía**: la respondía la
> regla de derivación *(entidad → tabla; multivaluado → tabla nueva; N:M → tabla nueva)* y después
> la normalización. **Aquí la misma pregunta es la única que hay**, y no tiene regla: tiene
> **criterios** *(slides 5 y 8)* que dependen de cómo se lee y cómo crece el dato. Toda la sección
> § *Contraste con la derivación relacional* de esta página desarrolla ese paralelo.

## Slides 3–4 · Enfoque de documentos embebidos — qué es

> [!quote] Textual del slide 3
> - *"Con MongoDB, puede embeber datos relacionados en una única estructura o documento"*
> - *"Estos esquemas generalmente se conocen como modelos **"desnormalizados"** y aprovechan los
>   documentos de MongoDB"*
> - *"Considere el siguiente diagrama:"*

**Las comillas de *"desnormalizados"* son del slide.** Es una elección de vocabulario que conviene
leer con cuidado: en la U1 *desnormalizar* era **una anomalía** *(redundancia, riesgo de
inconsistencia en el `UPDATE`)*; aquí es **el nombre del enfoque recomendado por defecto**. La
*Seven Databases* 2ª ed. lo dice sin comillas: en el *Day 1 Wrap-Up* *(impresa 109)* habla de
*"complex, denormalized documents"*, y en *Mongo's Weaknesses* *(impresa 133)* advierte que
*"Mongo encourages denormalization of schemas (by not having any) and that can be a bit too much for
some to swallow"* → § *Bibliografía verificada*.

### El diagrama del slide 4 — *"Esquema de ejemplo"* — contenido que el texto extraído perdió entero

Es una imagen *(741×408 px)*: un documento con dos subdocumentos, con dos llaves verdes a la derecha
rotuladas *"Embedded sub-document"*.

```javascript
{
  _id: <ObjectId1>,
  username: "123xyz",
  contact: {
              phone: "123-456-7890",
              email: "xyz@example.com"
           },                              // ← Embedded sub-document
  access: {
             level: 5,
             group: "dev"
          }                                // ← Embedded sub-document
}
```

Tres cosas que el diagrama dice y el texto no:

1. **`_id: <ObjectId1>`** es un marcador, no un valor: el deck usa `<ObjectId1>`, `<ObjectId2>`,
   `<ObjectId3>` en los slides 4 y 7 para hablar de identidades sin escribir un `ObjectId("…")`
   real. **No explica qué es un `ObjectId`** *(12 bytes generados por el driver: timestamp,
   aleatorio, contador)*.
2. **Los subdocumentos no tienen `_id` propio.** `contact` y `access` son valores del documento
   padre: no existen fuera de él, no se pueden referenciar desde otra colección. Esto es lo que va
   a cambiar en el slide 7.
3. **`level: 5`** es un número, no un string: BSON tipa los valores *(a diferencia de un `VARCHAR`
   que guarda `'5'`)*. El slide no lo comenta.

> [!tip] Cómo se lee esto contra la U1
> El equivalente relacional de este documento son **tres tablas** —`USER`, `CONTACT`, `ACCESS`— con
> `user_id` como FK en las dos últimas, o bien **una tabla** `USER` con seis columnas
> *(`phone`, `email`, `level`, `group` desplegadas)*. La segunda es lo que la regla del
> **atributo compuesto** de [[1.03.01 - Derivación de MER a esquema relacional|la derivación]]
> produce *(slide 7 del deck 03: el compuesto *"se despliega en sus partes componentes"* y desaparece)*.
> **El subdocumento embebido es un atributo compuesto que no se despliega**: conserva la
> estructura. Es la primera diferencia concreta entre los dos modelos que el deck muestra, aunque no
> la nombre.

## Slide 5 · Enfoque de documentos embebidos — cuándo

> [!quote] Textual, completo *(el slide más denso del deck)*
> - *"Los modelos de datos embebidos permiten que las aplicaciones almacenen información relacionada
>   en el mismo registro de la base de datos. Como resultado, es posible que las aplicaciones deban
>   emitir **menos consultas y actualizaciones** para completar las operaciones comunes"*
> - *"En general, utilice modelos de datos **incrustados** cuando:"*
>   - *"Tenga relaciones **"contiene"** entre las entidades"*
>   - *"Tenga relaciones de **uno a muchos** entre entidades. En estas relaciones, los "muchos" o
>     documentos secundarios **siempre aparecen con o se ven en el contexto de** "uno" o documentos
>     principales"*
> - *"En general, los documentos embebidos proporcionan un **mejor rendimiento para las operaciones
>   de lectura**, así como la capacidad de solicitar y recuperar datos relacionados **en una sola
>   operación de base de datos**. Los modelos de datos embebidos permiten actualizar los datos
>   relacionados **en una sola operación de escritura atómica**"*

Son **dos criterios** para embeber y **tres beneficios**:

| | Qué dice | Lectura |
| --- | --- | --- |
| **Criterio 1** | relaciones *"contiene"* | **composición**: la parte no tiene sentido sin el todo *(`contact` sin su `user`)*. En el MER de la U1 es la **entidad débil** o el **atributo compuesto** |
| **Criterio 2** | 1:N donde los "muchos" **siempre** se ven en el contexto del "uno" | la palabra clave es ***siempre***: si alguna consulta necesita los "muchos" **sin** pasar por el "uno" *(p. ej. "todas las direcciones de Boston")*, embeber obliga a barrer la colección de padres |
| **Beneficio 1** | menos consultas y actualizaciones | una lectura trae el documento completo |
| **Beneficio 2** | mejor rendimiento de **lectura** | el deck lo dice de lectura, **no de escritura**: reescribir un documento grande por cambiar un subdocumento tiene costo |
| **Beneficio 3** | escritura **atómica** en una sola operación | **la unidad de atomicidad es el documento**: lo que está adentro se escribe todo o nada. Lo que está en otro documento, no |

> [!important] 🎯 El beneficio 3 es **la razón técnica** detrás de la regla, y el deck no la desarrolla
> En MongoDB **una operación sobre un documento es atómica** *(Corbellini § 6, p. 15–16, lo lista
> entre las características del motor)*. Por eso "contiene" y "siempre en contexto" son criterios
> para embeber: si el todo y la parte se escriben siempre juntos, tenerlos en un documento hace que
> **la escritura sea atómica gratis**. Con referencias, la misma escritura son dos operaciones y la
> atomicidad **hay que comprarla con una transacción multidocumento** *(desde MongoDB 4.0; el deck
> no la nombra)*. Es exactamente el problema que en la U1 resolvía `COMMIT` sin pensar
> *([[Clase 11 - Seguridad-Transacciones]])*.

**Errata de vocabulario:** el mismo slide dice *"embebidos"* en el primer y tercer punto e
***"incrustados"*** en el segundo. Son dos traducciones de *embedded* conviviendo; el deck vuelve a
*"incrustar"* en los slides 11 y 14. Se conserva `[sic]`, no se corrige.

## Slide 6 · Documentos BSON — las dos cotas

> [!quote] Textual, completo
> - *"El tamaño máximo del documento BSON es de **16 megabytes**"*
> - *"MongoDB no admite más de **100 niveles de anidamiento** para documentos BSON"*

Es el slide más corto y **el único con límites numéricos del motor** del deck *(las imágenes de los
slides 17, 19, 22, 24 y 28 traen cifras de ejemplo: `pages: 216`, `founded: 1980`, `instock: 120`,
`$gt: 50`)*. Los dos son **límites físicos** que ponen
techo a la estrategia "embeber todo":

| Cota | Qué limita | A qué patrón le pega |
| --- | --- | --- |
| **16 MB** por documento | cuánto se puede embeber en total | al **arreglo que crece sin cota** *(slide 18: "arreglos mutables y en crecimiento")*. Un `user` con todas sus direcciones cabe; un `publisher` con todos sus libros embebidos, o un `post` con todos sus comentarios, **en algún momento no** |
| **100 niveles** de anidamiento | qué tan profundo | a las **jerarquías** *(slide 8: "grandes conjuntos de datos jerárquicos" → referencias)*. Un árbol de categorías embebido como `children: [{ children: [ … ] }]` tiene un techo de profundidad |

> [!note] Dónde está esto en la bibliografía
> **Corbellini § 6, pp. 15–16** cubre *"BSON y su límite de 16 MB"* *(ficha del paper, tabla de
> motores)*. *Seven Databases* 2ª ed. nombra los 16 MB **dos veces, y ninguna como límite de
> documento**: en el recuadro *Mongo's Many Useful CLI Tools* *(impresa 114)*, a propósito de
> `mongofiles` — *"GridFS is a specification for BSON files exceeding 16 MB"*— y en § *Mapreduce
> (and Finalize)* *(impresa 122)*, como límite del resultado `inline` de un MapReduce. **Los 100
> niveles no están en ninguna fuente del vault**: sale de la documentación oficial → `—`.

> [!tip] Por qué importa que el límite sea del *documento* y no de la *colección*
> Es la diferencia entre embeber y referenciar llevada al extremo: una colección puede tener
> terabytes, **un documento no puede pasar de 16 MB**. Si un dato relacionado crece sin cota, tarde
> o temprano hay que sacarlo a otra colección — y eso es lo que los slides 18–20 hacen con los
> libros del editor. El slide 6 está puesto **entre** el "cuándo embeber" y el "cuándo referenciar"
> por eso: es el argumento físico que separa los dos.

## Slide 7 · Modelo de datos normalizado — qué es

> [!quote] Textual
> *"Los modelos de datos normalizados describen relaciones usando **referencias entre documentos**"*

### El diagrama — el mismo documento del slide 4, partido en tres

Imagen *(726×416 px)*: tres cajas, `user document` a la izquierda y `contact document` /
`access document` a la derecha, con **dos flechas verdes** que salen de los campos `user_id`
*(resaltados en verde)* y apuntan al `_id` del `user`.

```javascript
// user document
{
  _id: <ObjectId1>,
  username: "123xyz"
}

// contact document
{
  _id: <ObjectId2>,
  user_id: <ObjectId1>,          // ← resaltado, flecha hacia user._id
  phone: "123-456-7890",
  email: "xyz@example.com"
}

// access document
{
  _id: <ObjectId3>,
  user_id: <ObjectId1>,          // ← resaltado, flecha hacia user._id
  level: 5,
  group: "dev"
}
```

Lo que cambió respecto del slide 4, punto por punto:

| | Slide 4 *(embebido)* | Slide 7 *(normalizado)* |
| --- | --- | --- |
| Documentos | **1** | **3**, en *(presumiblemente)* tres colecciones |
| `_id` | uno | **tres**: `contact` y `access` pasan a tener identidad propia |
| La relación | **implícita** en la estructura *(el subdocumento está adentro)* | **explícita** en un campo: `user_id` |
| Dirección de la referencia | — | **del hijo al padre**: `contact` apunta a `user`, no al revés |
| Lecturas para "todo el usuario" | 1 | **3** *(o 1 con `$lookup`, slide 23)* |
| Escritura de `phone` | reescribe el documento `user` | toca solo `contact` |

> [!important] 🎯 **La flecha va del hijo al padre**, y eso es exactamente la regla relacional
> `user_id` en `contact` es **una clave foránea**: la clave del lado "1" puesta como columna en el
> lado "N". Es, literal, la **regla de la binaria 1:N** del slide 11 del deck 03
> *([[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]])*.
> Por eso el deck llama a esto *"normalizado"*: **es el esquema relacional escrito en JSON**. Lo que
> MongoDB **no** tiene es la restricción: `user_id` no es un `FOREIGN KEY`, nadie verifica que
> `<ObjectId1>` exista, y borrar el `user` deja dos huérfanos sin que ningún `ON DELETE` se entere
> *([[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]])*. **El deck
> no lo dice en ningún slide**, y es la diferencia práctica más grande entre "normalizado en MongoDB"
> y "normalizado en MySQL" → § *Dudas abiertas*.

## Slide 8 · Modelo de datos normalizado — cuándo

> [!quote] Textual, completo
> - *"En general, utilice modelos de datos normalizados:"*
>   - *"cuando la incorporación resultaría en una **duplicación de datos** pero no proporcionaría
>     suficientes ventajas de rendimiento de lectura para superar las implicaciones de la
>     duplicación"*
>   - *"para representar relaciones más complejas de **muchos a muchos**"*
>   - *"para modelar **grandes conjuntos de datos jerárquicos**"*
> - *"Las referencias proporcionan **más flexibilidad** que el modelo embebido. Sin embargo, las
>   aplicaciones del lado del cliente deben emitir **consultas de seguimiento** para resolver las
>   referencias. En otras palabras, los modelos de datos normalizados pueden requerir **más viajes de
>   ida y vuelta al servidor**"*

Son **tres criterios** para referenciar y **un costo**:

| Criterio | Qué caso cubre | Ejemplo del deck |
| --- | --- | --- |
| **Duplicación sin ganancia** | el mismo dato embebido en N documentos; si se actualiza, hay que tocar los N; y si nadie lee "el padre con sus hijos" seguido, no se gana nada a cambio | **editor–libros** *(slide 17: `publisher` repetido en cada libro)* |
| **Muchos a muchos** | ningún lado "contiene" al otro | **ninguno** — el deck lo nombra y no lo muestra |
| **Jerarquías grandes** | árboles y grafos profundos o anchos | **ninguno** — chocan con los 100 niveles y los 16 MB del slide 6 |
| **Costo** | *round-trips*: cada referencia es otra consulta *(o un `$lookup`)* | el slide 11 lo dice del 1:1: *"debe emitir varias consultas para resolver la referencia"* |

> [!note] *"La incorporación"* es *embedding* mal traducido
> El primer criterio dice *"cuando la **incorporación** resultaría en una duplicación"*. En el
> original es *"when embedding would result in duplication of data"*; *incorporación*, *embebido*
> e *incrustado* son **la misma palabra** en tres slides distintos. Se conserva `[sic]`.

> [!important] 🎯 El criterio 1 es **la normalización relacional, dicha al revés**
> En la U1 la duplicación era **siempre** una anomalía a eliminar *(2FN/3FN: el `publisher` que
> depende de `title` vía `publisher_id` es una dependencia transitiva de manual)*. Aquí la
> duplicación **se tolera si compra rendimiento de lectura** y se elimina si no. **El criterio ya no
> es la forma normal: es la relación costo/beneficio de la consulta.** Es la frase más importante del
> deck para el objetivo declarado de la materia — *"tomar buenas decisiones a la hora de elegir una
> base de datos"* *([[CLAUDE]])*—: la misma relación 1:N se modela de dos formas distintas **según
> cómo se la lee**, y la decisión no la toma el modelo de datos, la toma la carga de trabajo.

---

## Slides 9–12 · Relación *one-to-one* con documentos embebidos

> [!quote] Textual del slide 9, completo
> - *"Considere el siguiente ejemplo que mapea las relaciones de **usuario y dirección**"*
> - *"El ejemplo ilustra la ventaja de embeber sobre las referencias si necesita **ver una entidad de
>   datos en el contexto de la otra**"*
> - *"En esta relación de *one-to-one* entre el usuario y los datos de la dirección, **la dirección
>   pertenece al usuario**"*
> - *"En el modelo de datos normalizado, **el documento de dirección contiene una referencia al
>   documento del usuario**"*

*"La dirección pertenece al usuario"* es el criterio 1 del slide 5 *("contiene")* aplicado. Y la
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

Tres detalles que solo se ven en la imagen:

1. **`_id: "joe"`** — el `_id` **no es un `ObjectId`**: es un string elegido por la aplicación. El
   deck pasa sin comentario de los `<ObjectId1>` de los slides 4 y 7 a esto. **`_id` puede ser
   cualquier tipo BSON salvo arreglo**, y el ejemplo lo aprovecha para que la referencia
   *(`patron_id: "joe"`)* se lea sin mirar dos veces.
2. **El documento de dirección no muestra `_id`.** MongoDB se lo agrega solo al insertar; el ejemplo
   lo omite porque no importa para el argumento.
3. **`patron_id`**, no `user_id`: el vocabulario del ejemplo es el de una **biblioteca**
   *(patron = socio, Joe Bookreader)*, el mismo que sigue en el ejemplo editor–libros. Es una pista
   de que los slides 9–20 salen de una misma fuente.

### Slide 11 · *"Ejemplo (cont)"* — el argumento

> [!quote] Textual
> - *"Si los datos de la dirección se recuperan con frecuencia con la información del nombre y luego
>   con la referencia, su aplicación debe emitir **varias consultas** para resolver la referencia"*
> - *"El mejor modelo de datos sería **incrustar** los datos de dirección en los datos del usuario,
>   como en el siguiente documento:"*

La condición está en el *"si"*: **si se recuperan con frecuencia juntos**. Es el criterio 2 del
slide 5 *("siempre en el contexto del uno")* dicho para el caso 1:1. Si la aplicación leyera
direcciones sin usuarios *(un reporte por código postal)*, el argumento no aplicaría — el deck no
lo dice, pero es la consecuencia directa de la frase.

**Errata:** *"y luego con la referencia"* es una traducción torpe de *"and then with the
reference"*; el sentido es "primero el nombre y después, con la referencia, la dirección" — o sea
**dos consultas**. Se conserva `[sic]`.

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
recuperar la información completa del usuario **con una consulta**"*.

Lo que cambió: **desapareció `patron_id`**. La relación ya no necesita un campo porque está en la
estructura. Y el subdocumento se llama **`address`** en singular — en el slide 15 va a ser
`addresses` en plural y un arreglo: **el nombre del campo lleva la cardinalidad**.

> [!important] 🎯 El deck 03 **no dio regla para la binaria 1:1**; este deck da **dos**
> [[1.03.01 - Derivación de MER a esquema relacional|La tabla de reglas del vault]] registra
> *"Binaria 1:1 — el deck no la trata en ningún slide"*. En MongoDB la 1:1 tiene **dos formas**
> *(slides 10 y 12)* y **una recomendación clara**: embeber, salvo que la dirección se lea sola. En
> relacional la respuesta análoga habría sido "una sola tabla `USER` con las columnas de dirección"
> *(el atributo compuesto desplegado)*, y el vault no la tenía escrita. Vale llevar el paralelo a la
> página del concepto → § *Dudas abiertas*.

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
> Es el "antes": el mismo usuario del slide 10 con **dos** direcciones referenciadas por
> `patron_id`. El título es el del bloque *(slides 13–15)*, no del contenido del slide. No es una
> contradicción, pero leído suelto confunde: **el modelo embebido recién aparece en el 15**.

Lo único nuevo respecto del slide 10 es la **tercera caja**: un segundo documento con el mismo
`patron_id: "joe"`. En relacional esto es, exacto, la tabla `ADDRESS` con FK `patron_id` y dos
filas — la **regla de la binaria 1:N** del deck 03.

**Errata del ejemplo, heredada de la fuente:** las dos direcciones tienen `zip: "12345"` aunque una
esté en *Faketon* y la otra en *Boston*. Es un dato de juguete; se conserva `[sic]`.

### Slide 14 · El argumento — **es el slide 11 con dos palabras cambiadas**

> [!quote] Textual, completo
> - *"Si su aplicación recupera con frecuencia los datos de la dirección con la información del
>   nombre, entonces su aplicación debe emitir varias consultas para resolver las referencias"*
> - *"Un esquema **más óptimo** sería incrustar las **entidades** de datos de dirección en los datos
>   del usuario, como en el siguiente documento:"*

Diferencias con el slide 11: *"la referencia"* → *"las referencias"* *(plural: son dos)*, *"el
mejor modelo"* → *"un esquema más óptimo"*, y *"los datos de dirección"* → *"las entidades de datos
de dirección"*. **El argumento es el mismo**: la cardinalidad no cambia el criterio, solo la
estructura resultante.

**Errata:** *"más óptimo"* **[sic]** — *óptimo* ya es superlativo. Traducción literal de *"a more
optimal schema"*.

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

**Sin caja de comentario** *(a diferencia del slide 12)* y **sin cuerpo de texto**: solo el título
del bloque *("Modelo de relaciones one-to-many con documentos embebidos")* y la imagen.

Lo que muestra, y el deck no dice con palabras:

| | Slide 12 *(1:1)* | Slide 15 *(1:N)* |
| --- | --- | --- |
| Campo | `address` | `addresses` |
| Tipo del valor | **subdocumento** `{ … }` | **arreglo de subdocumentos** `[ { … }, { … } ]` |
| Cuántos | uno | cero o más |
| Consulta para "usuarios en Boston" | `{ "address.city": "Boston" }` | `{ "addresses.city": "Boston" }` — **la misma notación de punto**, MongoDB busca en cada elemento |

> [!important] 🎯 **El arreglo embebido es lo que el modelo relacional no puede hacer**, y es el corazón del contraste
> La 1FN prohíbe atributos multivaluados: por eso la regla 7 del deck 03 manda **crear una tabla
> nueva** *(`TELEF_ALUM`, `MAILS_ALUM`)* para cada uno
> *([[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] §
> *Entidades y atributos*)*. El slide 15 es **exactamente ese atributo multivaluado, guardado adentro**:
> `addresses` es a `USER` lo que `TELEF_ALUM` era a `ALUMNO`, sin la tabla, sin la FK y sin el join.
> **Toda la ventaja del modelo documental para relaciones 1:N "contenidas" está en este slide**, y
> toda su desventaja está en el 18: el arreglo puede crecer sin cota.

## Slides 16–20 · Relación *one-to-many* con referencias de documentos

Es el bloque más largo *(cinco slides)* y el único que **argumenta en contra de embeber**. También
es el único que muestra **las dos direcciones posibles de una referencia** y elige una.

### Slide 16 · El planteo

> [!quote] Textual, completo
> - *"Considere el siguiente ejemplo que mapea relaciones de **editor y libro**. El ejemplo ilustra
>   la ventaja de hacer referencia sobre documentos embebidos para **evitar la repetición** de la
>   información del editor"*
> - *"Embeber el documento del editor dentro del documento del libro llevaría a la **repetición de
>   los datos del editor**, como muestran los siguientes documentos:"*

El criterio invocado es el **1 del slide 8**: duplicación sin ganancia. Y la dirección de la
relación importa: el editor es el "uno", el libro es el "muchos" — pero **el documento natural para
consultar es el libro**, no el editor. Por eso embeber va "al revés" de los slides 12 y 15: no se
embeben los "muchos" en el "uno" sino **el "uno" en cada uno de los "muchos"**, y ahí está la
repetición.

### Slide 17 · Los dos libros con el editor embebido *(imagen, 499×602 px — ocupa el slide entero, sin título)*

```javascript
{
   title: "MongoDB: The Definitive Guide",
   author: [ "Kristina Chodorow", "Mike Dirolf" ],
   published_date: ISODate("2010-09-24"),
   pages: 216,
   language: "English",
   publisher: {                        // ← resaltado en amarillo
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
   publisher: {                        // ← resaltado en amarillo
                name: "O'Reilly Media",
                founded: 1980,
                location: "CA"
              }
}
```

**Los dos bloques `publisher` están resaltados en amarillo** en la imagen: es el dato repetido.

Cuatro cosas que solo se ven en la imagen, y el deck no comenta:

1. **`author` es un arreglo en el primer libro y un string en el segundo.** `[ "Kristina Chodorow",
   "Mike Dirolf" ]` contra `"Kristina Chodorow"`. **Es esquema flexible en acción**: dos documentos
   de la misma colección con **tipos distintos en el mismo campo**. En MySQL sería imposible; en
   MongoDB es legal y una consulta `{ author: "Kristina Chodorow" }` **encuentra a los dos**
   *(sobre un arreglo, la igualdad busca el valor entre los elementos)*. Es el primer ejemplo del
   vault de un campo polimórfico.
2. **`ISODate("2010-09-24")`** es el tipo fecha de BSON, con su constructor del shell: no es un
   string. Primera aparición en el vault.
3. **Ninguno de los dos libros tiene `_id`** en este slide. Van a tenerlo en el 19 y el 20, porque
   ahí hace falta referenciarlos.
4. **`published_date`, `pages: 216`, `pages: 68`, `founded: 1980`, `location: "CA"`**: los datos
   son reales *(los dos libros existen; O'Reilly se fundó en 1978, en realidad, pero `1980` es lo
   que dice el ejemplo y se conserva `[sic]`)*.

> [!tip] La repetición del slide 17, en términos de la U1
> `title → publisher.name → publisher.founded` es una **dependencia transitiva**: `founded` depende
> de `name`, no del libro. En la U1 esto **viola 3FN** y la corrección es obligatoria. Aquí la
> corrección *(slides 18–20)* **se justifica por el costo de mantenimiento**, no por la forma
> normal: si O'Reilly se muda, hay que actualizar N libros. Y si nadie actualiza editores nunca, el
> slide 8 permitiría dejarlo así. Mismo diagnóstico, distinta autoridad.

### Slide 18 · La regla del crecimiento

> [!quote] Textual, completo
> - *"Para evitar la repetición de los datos del editor, use referencias y mantenga la información
>   del editor en una **colección separada** de la colección de libros"*
> - *"Cuando se usan referencias, **el crecimiento de las relaciones determina dónde almacenar la
>   referencia**. Si el número de libros por editor es pequeño con un crecimiento limitado, a veces
>   puede ser útil almacenar la referencia del libro dentro del documento del editor. De lo contrario,
>   si el número de libros por editor **no tiene límites**, este modelo de datos llevaría a **arreglos
>   mutables y en crecimiento**, como en el siguiente ejemplo:"*

Es el slide **más importante del bloque** y el que trae la única regla nueva del deck que no estaba
en los slides 5 y 8:

> **Con referencias hay que decidir de qué lado va la referencia, y lo decide el crecimiento.**

| Dónde va la referencia | Cuándo | Qué se obtiene | Qué se arriesga |
| --- | --- | --- | --- |
| **En el "uno"** *(arreglo de ids de libros dentro del editor)* | *"pequeño, con crecimiento limitado"* | "todos los libros de este editor" en una lectura | un **arreglo que crece sin cota**, hasta pegar contra los **16 MB** del slide 6; y cada libro nuevo **reescribe** el documento del editor |
| **En el "muchos"** *(id del editor dentro de cada libro)* | siempre que el número no tenga cota | documentos de tamaño fijo; agregar un libro no toca al editor | "todos los libros de este editor" es una consulta sobre la colección `books` *(con índice en `publisher_id`, barata)* |

> [!important] 🎯 Esta regla **no tiene equivalente relacional**, y por eso es la que hay que estudiar
> En la U1 la FK va **siempre** en el lado N: la regla del slide 11 del deck 03 no admite
> alternativa, porque poner "la lista de libros" en la fila del editor es un multivaluado y la 1FN
> lo prohíbe. **MongoDB sí lo admite** *(es el slide 19)*, y por eso necesita un criterio para
> elegir que el relacional nunca necesitó. El criterio es el **crecimiento**: acotado → puede ir en el
> "uno"; no acotado → va en el "muchos", que es la solución relacional.

### Slide 19 · La referencia en el "uno" — el arreglo que crece *(imagen, 484×587 px — slide entero, sin título)*

```javascript
{
   name: "O'Reilly Media",
   founded: 1980,
   location: "CA",
   books: [123456789, 234567890, ...]      // ← resaltado en amarillo
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

**El campo `books: [123456789, 234567890, ...]` está resaltado en amarillo**, y los tres puntos
son del ejemplo: es la forma de decir "y sigue creciendo".

Lo que cambió respecto del slide 17: los libros **ganaron `_id`** *(numéricos, no `ObjectId`)* y
**perdieron `publisher`**; el editor **apareció como documento propio** con un arreglo de ids. El
editor **no muestra `_id`**: todavía nadie lo referencia.

Es el modelo *"anti-relacional"*: **la FK multivaluada en el lado 1**. Y el slide 18 acaba de decir
que sirve solo si el arreglo tiene cota. Para un editor, no la tiene.

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
   publisher_id: "oreilly"              // ← resaltado en amarillo
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
> Se ve `published_date: ISODate("2011-05-06"),` y el borde del slide. Por simetría con el segundo
> libro, lo que falta es `pages: 68, language: "English", publisher_id: "oreilly" }`. **Es
> deducción**, no transcripción: el PNG no lo muestra.

Lo que cambió respecto del slide 19: el editor **ganó `_id: "oreilly"`** *(string, como `"joe"`)* y
**perdió `books`**; cada libro **ganó `publisher_id: "oreilly"`**. **Es el slide 7 otra vez**: la
referencia del hijo al padre, la FK en el lado N. Y es, por fin, **la regla relacional**.

> [!success] 🎯 El bloque 16–20 termina exactamente donde empezó la U1
> `publisher_id` en `books` es la **regla de la binaria 1:N** del deck 03, escrita en JSON. El deck
> dio la vuelta completa: embebido *(17)* → referencia en el "uno" *(19)* → referencia en el
> "muchos" *(20)*, y la última es la que MySQL habría producido sin pensar. **Lo que MongoDB agrega
> no es una solución nueva para este caso: es que el caso se decide, en lugar de venir decidido.**
> Y lo que quita es la restricción: nada impide un libro con `publisher_id: "penguin"` que no exista
> → § *Dudas abiertas*.

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

Cinco etapas del *aggregation pipeline*, sin `$`, sin descripción, sin orden particular. **De las
cinco, el deck desarrolla una**: `Lookup`, en los slides 22–24. Las otras cuatro no vuelven a
aparecer. Y **`Group` no está** en la lista, aunque sea la etapa que hace de `GROUP BY` y la razón de
ser habitual de un pipeline → callout *"Lo que el deck no trae"*.

| Etapa | Qué hace | Equivalente SQL de la U1 | ¿En este deck? |
| --- | --- | --- | --- |
| `$lookup` | *left outer join* con otra colección de la misma base | `LEFT JOIN` | **slides 22–24** |
| `$sort` | ordena los documentos del pipeline | `ORDER BY` | solo nombrado |
| `$match` | filtra documentos | `WHERE` *(o `HAVING`, según dónde esté)* | solo nombrado |
| `$unwind` | **desarma un arreglo**: un documento por elemento | no tiene *(es el inverso de embeber: convierte `addresses: [a, b]` en dos documentos)* | solo nombrado |
| `$project` | elige y renombra campos, calcula expresiones | `SELECT` | solo nombrado |
| `$group` | agrupa y acumula | `GROUP BY` + funciones de agregación | **ausente** |

> [!tip] `$unwind` es **la etapa que conecta las dos mitades del deck**, y el deck no lo dice
> Todo el bloque 3–20 decide si un dato va en un arreglo embebido o en otra colección. `$unwind` es
> lo que hace que **la decisión de embeber no cueste consultas**: un arreglo embebido se puede
> "desnormalizar hacia afuera" en el pipeline —un documento por dirección— y agrupar, filtrar y
> contar como si fueran filas. Es el `$lookup` del embebido: `$lookup` junta lo que está separado,
> `$unwind` separa lo que está junto. La [[Clase 14 - MongoDB Features]] lo desarrolla.

*Seven Databases* 2ª ed. presenta el pipeline en cap. 4 › *Day 2* › § *Aggregated Queries*
*(impresas 115–117)* con `$match`, `$group`, `$sort` y `$project` sobre `cities`, y la analogía
que la tabla de arriba usa: *"Think of `aggregate()` as a combination of `WHERE`, `GROUP BY`, and
`ORDER BY` clauses in SQL"*. **`$lookup` no aparece en el libro** *(verificado sobre el texto del
cap. 4: cero ocurrencias)* → § *Bibliografía verificada*.

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

Lo que hay que ver antes del join, porque **el ejemplo está armado para mostrar tres casos**:

| Documento | Qué tiene de particular | Para qué está |
| --- | --- | --- |
| `orders._id: 3` | **no tiene `item`** | una orden sin clave de join: ¿con qué se junta? |
| `inventory._id: 5` | `sku: null`, explícito | un valor **nulo** en el campo de join |
| `inventory._id: 6` | **no tiene `sku`** | el campo de join **ausente** |
| `inventory._id: 2, 3` | `bread`, `cashews`: nadie los ordena | filas del lado derecho sin pareja: no salen en un *left* join desde `orders` |

**Detalle de transcripción:** las claves están entre comillas *(`"_id"`, `"item"`)* **salvo
`description`**, que va sin comillas en los cinco documentos que lo tienen *(el sexto, `{ "_id" : 6 }`,
no lo trae)*. En JavaScript las dos formas son
equivalentes; en JSON estricto, no. Es el copiado de dos fuentes con estilos distintos, y se
conserva tal cual.

**`insert()` con arreglo**: sintaxis del shell legacy. En `mongosh` es `insertMany([...])`; `insert`
sigue existiendo como deprecado *(ver el callout de motor)*.

### Slide 23 · `Lookup: Left outer join` *(imagen, 305×283 px)*

**No es la primera vez que aparece `$lookup`:** la [[Clase 12 - Introduccion a NoSQL]] *(slides
48–49)* ya lo mostró sobre `posts`/`comments`; este deck repite el mismo patrón con
`orders`/`inventory`.

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

> [!important] 🎯 `$lookup` **no devuelve filas: devuelve documentos con un arreglo adentro**
> Es la diferencia de fondo con el `LEFT JOIN`. En SQL el join produce **una fila por pareja**
> *(y una orden con tres productos sale tres veces)*. `$lookup` produce **un documento por orden,
> con `inventory_docs: [ … ]` que contiene todas las parejas**. O sea: **el join reconstruye, al
> vuelo, el modelo embebido** a partir del normalizado. Si se quieren filas al estilo SQL, hay que
> agregar `$unwind: "$inventory_docs"` después — que es justo la etapa del slide 21 que el deck no
> desarrolla.
>
> Y la restricción que el título omite: `from` tiene que ser una colección **de la misma base de
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

> [!warning] 🔴 El slide se corta **justo antes del caso interesante**
> La imagen termina en `"_id" : 3,` — el tercer documento, la orden **sin `item`**. Lo que sigue en
> la fuente, y **el deck no muestra**, es:
>
> ```javascript
> {
>    "_id" : 3,
>    "inventory_docs" : [
>       { "_id" : 5, "sku" : null, "description" : "Incomplete" },
>       { "_id" : 6 }
>    ]
> }
> ```
>
> **Razonamiento, verificable en `mongosh` con los datos del slide 22:** para `$lookup`, **un
> campo ausente se compara como `null`**, y `null` es igual a `null`. La orden 3 no tiene `item`
> → su `localField` vale `null` → empareja con `inventory` 5 *(`sku: null`)* **y** con 6 *(sin
> `sku`)*. Es la semántica opuesta a SQL, donde `NULL = NULL` **no es verdadero** y una fila con
> `item NULL` saldría del `LEFT JOIN` con el lado derecho vacío. **Los tres documentos raros del
> slide 22 están puestos exactamente para mostrar esto, y el recorte se lo comió.** Va a
> § *Dudas abiertas* y es un candidato a probar en el [[Práctica 2026-09-15|TP9]].

Lo que sí se ve: las órdenes 1 y 2 salen con **un arreglo de un elemento**; `bread` y `cashews` no
aparecen *(no están del lado izquierdo)*; y `description` sale **entre comillas** porque el shell
imprime todas las claves con comillas — el orden de los campos de `inventory` *(`_id`, `sku`,
`description`, `instock`)* es el mismo del `insert` del slide 22.

### Slide 25 · Link de referencia

> [!quote] Textual
> *"`https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/`"*

**Único link del deck.** Apunta a la **referencia de etapas del pipeline** —no a las páginas de
diseño de modelo de las que salen los slides 2–20—. El dominio `docs.mongodb.com` **redirige** hoy a
`www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/`; el link sigue funcionando
*(no verificado en esta sesión: el vault no navega)*.

---

## Slide 26 · Ejemplo — `find()` con proyección

> [!quote] Textual, completo
> - *"Obtener el teléfono y el número de cliente del cliente con nombre “Wanda” y apellido “Baker”"*
> - *`db.cliente.find({nombre: "Wanda", apellido: "Baker"}, {codigo_area: 1, nro_telefono:1}).pretty()`*

Es texto vivo *(no imagen)* y **es el único slide del deck con un esquema en español**: `cliente`,
`nombre`, `apellido`, `codigo_area`, `nro_telefono`. No es el de ningún ejemplo anterior del deck, y
**tampoco aparece en el [[Práctica 2026-09-15|TP9]] ni en la *Consigna MONGO DB*** archivados en
`raw/` *(verificado: ninguno de los dos trae `cliente`, `codigo_area`, `nro_telefono`, "Wanda" ni
"Baker")*. Es un ejemplo suelto del deck, de origen no identificado → § *Dudas abiertas*.

Anatomía, contra la U1:

| Parte | Qué es | En SQL |
| --- | --- | --- |
| `db.cliente` | la colección | `FROM cliente` |
| `{nombre: "Wanda", apellido: "Baker"}` | **filtro** — dos condiciones en un mismo objeto son un `AND` implícito | `WHERE nombre = 'Wanda' AND apellido = 'Baker'` |
| `{codigo_area: 1, nro_telefono: 1}` | **proyección** — `1` incluye | `SELECT codigo_area, nro_telefono` |
| `.pretty()` | formatea la salida en el shell legacy | — |

> [!warning] La consulta **no devuelve lo que la consigna pide**, por dos razones que el slide no ve
> 1. La consigna dice *"el teléfono y **el número de cliente**"*. La proyección pide `codigo_area` y
>    `nro_telefono`: **el número de cliente no está en la lista**. Salvo que "número de cliente" sea
>    el `_id`, que…
> 2. …**`_id` sale igual**: la proyección con `1` incluye lo pedido **más `_id`**, siempre, salvo que
>    se lo excluya explícitamente con `_id: 0`. Así que la salida es `_id`, `codigo_area` y
>    `nro_telefono`. Si el número de cliente **es** `_id`, la consulta está bien por accidente; si
>    es un campo `nro_cliente`, falta. El slide 27 —el siguiente— muestra justo el `_id: 0`.
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
> `db.ideal.find({ fullyManaged: true, security: 'built-in', cloud: { $in: [ 'AWS', 'Azure',
> 'GCP' ] } })` es una **pieza de marketing de Atlas** *(la "base ideal": totalmente administrada,
> seguridad incorporada, en las tres nubes)*, y la salida es el chiste: `{ 'try': 'MongoDB Atlas
> Today' }`. El deck lo trae con fondo oscuro y coloreado, tal cual la captura del sitio. **No hay
> colección `ideal` en ningún esquema de la cursada.**

Lo que el slide sí enseña, si se lo lee como código:

| Construcción | Qué hace | Primera vez en el vault |
| --- | --- | --- |
| `$in: [ … ]` | el campo vale **alguno** de los de la lista | sí — `IN (…)` de SQL |
| `_id: 0, try: 1` | **proyección con exclusión de `_id`** — la respuesta al problema del slide 26 | sí |
| `.forEach((doc) => { … })` | **itera el cursor** que `find()` devuelve, un documento por vez, con una *arrow function* de JavaScript | sí — es el equivalente de un [[1.10.03 - Cursores|cursor]] de la U1, solo que aquí **todo `find()` devuelve un cursor** |
| `printjson(doc)` | imprime el documento como JSON en el shell | sí |

> [!important] 🎯 Por qué el slide se llama *"Lógica de control"*
> Porque **el shell de MongoDB es JavaScript** y por lo tanto tiene `forEach`, `if`, `for`, `while`,
> funciones y variables **sin necesidad de un lenguaje procedural aparte**. Es la respuesta de MongoDB
> al problema del slide 2 de la [[Clase 10 - Restricciones integridad-Parte 2]] —*"cada proveedor de
> BD tiene su propio lenguaje procedural"*—: el lenguaje procedural de MongoDB **es el del shell**, y
> el `forEach` sobre el cursor es lo que en PL/pgSQL era `OPEN` / `FETCH` / `CLOSE`. *Seven Databases*
> lo trata en cap. 4 › *Day 1* › § *Command-Line Fun* › *JavaScript* *(impresas 96–98)* y en
> § *Reading with Code* *(impresas 108–109)*.

## Slide 28 · `Explain` *(imagen, 760×189 px — captura de la documentación)*

> [!quote] Textual de la captura *(en inglés, tal cual)*
> *"The following example runs `cursor.explain()` in `"executionStats"` verbosity mode to return
> the query planning and execution information for the specified `db.collection.find()` operation:"*
>
> ```javascript
> db.products.find(
>    { quantity: { $gt: 50 }, category: "apparel" }
> ).explain("executionStats")
> ```

**Último slide del deck, y termina aquí**: sin resultado, sin cierre, sin "preguntas". La captura
tiene incluso el ícono de "copiar" de la página de documentación arriba a la derecha.

Lo que trae, contra la [[Clase 08 - Explicando el plan]]:

| | MySQL *(U1)* | MongoDB *(este slide)* |
| --- | --- | --- |
| Cómo se pide | `EXPLAIN SELECT …` | `.explain()` **encadenado al cursor** |
| Niveles | `EXPLAIN` / `EXPLAIN ANALYZE` | `"queryPlanner"` *(default)* / **`"executionStats"`** / `"allPlansExecution"` |
| Qué muestra `executionStats` | — | el plan **y** la ejecución real: `totalDocsExamined`, `nReturned`, `executionTimeMillis`, y si hubo `COLLSCAN` o `IXSCAN` |
| Para qué se usa en la cursada | ver si un `WHERE` usa índice | ver si un filtro usa índice — **mismo uso**, [[1.08.01 - Plan de ejecución|Plan de ejecución]] |

`$gt: 50` es el segundo operador de comparación del deck *(después del `$in` del slide 27)*:
`quantity > 50 AND category = 'apparel'`.

*Seven Databases* 2ª ed. usa **exactamente** `explain("executionStats")` en cap. 4 › *Day 2* ›
§ *Indexing: When Fast Isn't Fast Enough* *(impresas 111–112)*: corre un `find` sobre `phones` sin
índice *(`executionTimeMillisEstimate: 58`)*, crea el índice y lo vuelve a correr *(`0`)*, con la
observación *"scanned objects dropped from 109999 to 1"*. Es la lectura que sostiene este slide, y
el mismo experimento que el TP5 pedía en MySQL → § *Bibliografía verificada*.

---

## Contraste con la derivación relacional — el mapa completo

La [[1.03.01 - Derivación de MER a esquema relacional|tabla de reglas del deck 03]] convierte cada
constructo del MER en tablas **sin decisión**: la regla es única. Este deck reemplaza cada una de esas
reglas por **una decisión con criterio**. Poner las dos columnas una al lado de la otra es la forma
más corta de estudiar las dos clases juntas.

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

> [!important] 🎯 La lectura que conviene llevarse
> **Normalizar en MongoDB es aplicar la regla relacional; embeber es no aplicarla.** El deck da
> criterios para saber cuándo conviene cada cosa, y el criterio es siempre el mismo con tres caras:
> **cómo se lee** *(¿juntos?)*, **cómo crece** *(¿con cota?)* y **cómo se duplica** *(¿se
> actualiza?)*. Ninguno de los tres es una propiedad del dato: **son propiedades de la aplicación**.
> Por eso el slide 2 empieza diciendo *"los modelos de datos efectivos satisfacen las necesidades de
> su aplicación"*. En la U1 el esquema salía del dominio; aquí sale de la carga.

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
> convención, no citas existentes"*. Por eso las citas de arriba van por **título de sección y
> página impresa**, que es lo que está verificado. Cuando [[_index-bibliografia]] fije la convención
> para el cap. 4, se reemplazan.

**Lectura mínima sugerida** *(propuesta; la fija la etapa de bibliografía)*: *Seven Databases* cap. 4
› *Day 1* completo *(impresas 94–110, 17 páginas)* — cubre anidamiento, `find` con proyección,
referencias y el shell JavaScript — más § *Aggregated Queries* *(115–117)* y las dos páginas de
`explain` *(111–112)*. **Corbellini § 6** *(pp. 14–16)* para el marco. Total: **~25 páginas**.
Para embebido vs. referenciado con sus tres patrones **no hay libro en el vault**: la fuente es la
documentación oficial de MongoDB, y este deck es su traducción.

---

## Contradicciones internas del deck y erratas

| # | Slide | Qué | Tipo |
| --- | --- | --- | --- |
| 1 | 1 vs. archivo vs. metadato | Tres nombres: *"MongoDB: Diseño del Modelo de Datos"* / `NoSQL-EmbebidosVSNormalizado` / `Introducción a Bases de Datos NoSQL` | identidad |
| 2 | 5, 8, 11, 14 | *embebido* / *incrustado* / *incorporación* para la misma palabra *(embedded)* | traducción |
| 3 | 13 | Título *"con documentos embebidos"* sobre un slide que muestra **el modelo con referencias** | título ≠ contenido |
| 4 | 14 | *"más óptimo"* **[sic]** | errata |
| 5 | 11 | *"y luego con la referencia"* — traducción torpe; el sentido es "dos consultas" | traducción |
| 6 | 17 | `author` es arreglo en un libro y string en el otro | **no es error**: es esquema flexible, pero el deck no lo señala |
| 7 | 17, 19, 20 | `founded: 1980` para O'Reilly *(fundada en 1978)* | dato de juguete, `[sic]` |
| 8 | 13, 15 | Dos direcciones en ciudades distintas con el mismo `zip: "12345"` | dato de juguete, `[sic]` |
| 9 | 20 | Imagen **recortada**: el tercer libro se corta en `published_date` | recorte |
| 10 | 24 | Imagen **recortada** justo antes de la orden 3 — **el caso que el ejemplo está armado para mostrar** | recorte, y le cuesta el contenido |
| 11 | 21 vs. 22–25 | Cinco etapas listadas, **una** desarrollada; `$group` ausente | promesa incumplida |
| 12 | 22 | `insert([ … ])`: deprecado en `mongosh` | shell legacy |
| 13 | 22 | `"_id"`, `"sku"` entre comillas y `description` sin comillas, en los cinco documentos que lo tienen | inconsistencia de estilo, `[sic]` |
| 14 | 26 | La consigna pide *"el número de cliente"* y la proyección no lo incluye *(y `_id` sale igual)* | consulta ≠ consigna |
| 15 | 26 | `.pretty()` — sin efecto en `mongosh` | shell legacy |
| 16 | 27 | *"Lógica de control"* titula un snippet de marketing de Atlas *(`db.ideal`)* | título ≠ contenido |
| 17 | 25 | `docs.mongodb.com` — dominio viejo, redirige | link envejecido |
| 18 | 28 | El deck termina en una captura de la documentación, sin resultado ni cierre | estructura |

**Ninguna de las 18 es un error conceptual.** El deck es una traducción cuidadosa de la
documentación; lo que se le cae son los bordes: dos imágenes recortadas, cuatro etapas sin
desarrollar y un cierre inexistente.

---

## Dudas abiertas

- [ ] **N:M sin ejemplo.** El slide 8 lo manda a referencias y no muestra cómo. ¿Arreglo de ids en
      **los dos** lados? ¿Colección intermedia como la tabla del deck 03? ¿Cuál enseña la cátedra?
      Es la pregunta más obvia para el parcial y el deck no la contesta. Preguntar en la práctica.
- [ ] **Integridad referencial.** El deck llama *"normalizado"* al modelo con `user_id` /
      `publisher_id` y nunca dice que **nadie valida la referencia**. ¿Se espera que el TPO maneje
      huérfanos desde la aplicación? ¿Se menciona el *schema validation* de MongoDB *(`$jsonSchema`)*
      en alguna clase?
- [ ] **El resultado recortado del slide 24.** Verificar en `mongosh` con los datos del slide 22 que
      la orden 3 *(sin `item`)* empareja con `inventory` 5 *(`sku: null`)* **y** 6 *(sin `sku`)*.
      Si es así, es la diferencia `null = null` con SQL más clara de toda la cursada, y conviene
      escribirla en la página de [[MongoDB]].
- [ ] **Transacciones multidocumento.** El slide 5 vende la atomicidad del embebido; ¿la cátedra
      llega a `session.startTransaction()` para el normalizado, o la respuesta de la materia es
      "embeba lo que necesite atómico"? Cruza con [[Clase 11 - Seguridad-Transacciones]].
- [ ] **`Sort`, `Match`, `Unwind`, `Project` y `Group`.** Confirmar que la
      [[Clase 14 - MongoDB Features]] las desarrolla *(su texto extraído tiene `aggregate` con
      `$match`)* y que la Clase 13 solo las anuncia. Si el 14 tampoco trae `$unwind`, es un hueco
      de la cursada, no del deck.
- [ ] **El esquema `cliente` del slide 26.** No aparece en el [[Práctica 2026-09-15|TP9]] ni en la
      *Consigna MONGO DB* documentada en la Clase 14: no se sabe de dónde sale. Preguntar al docente
      si `nro_cliente` existe como campo *(entonces la proyección del slide está incompleta)* o si
      es el `_id` *(entonces está bien por accidente)*.
- [ ] **Versión de MongoDB de la cursada.** El deck es de abril de 2024 y usa shell legacy; el TP9
      debería decir qué versión / qué imagen de Docker se usa. Si es 6.0 o superior, `mongo` no
      existe y todo corre en `mongosh` con los avisos de deprecación de `insert()`.
- [ ] **Regla para 1:1 en relacional.** El paralelo con el deck 03 dejó a la vista que
      [[1.03.01 - Derivación de MER a esquema relacional]] no tiene regla para la binaria 1:1
      *(el deck 03 no la trató)*. ¿Vale agregar la respuesta estándar *(FK con `UNIQUE` en uno de los
      dos lados, o fusión de tablas)* como razonamiento propio en esa página?
- [ ] **Patrones con nombre.** ¿La cátedra usa el vocabulario de la documentación *(extended
      reference, subset, bucket, computed, outlier, polymorphic)* en alguna clase o en el TPO? El
      deck se queda en embebido/referencia.
- [ ] **`DBRef` vs. referencia manual.** El deck usa solo campos sueltos; *Seven Databases*
      *(impresa 106)* muestra `{ $ref, $id }`. ¿Cuál se espera en el TP?

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
