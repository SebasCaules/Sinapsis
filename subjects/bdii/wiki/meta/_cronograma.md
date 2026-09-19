---
tipo: referencia
resumen: "Transcripción del calendario oficial 2026 2C, una fila por encuentro con fecha, modalidad y tema: autoridad del vault para tema y fecha, pero no numera clases ni define unidades. Reúne parcial, recuperatorio y TPO, las diferencias con el programa (MySQL, Cassandra) y cómo ubicar un archivo nuevo."
formato: cronograma
cuatrimestre: 2026 2C
inicio: 2026-08-01
fin: 2026-11-28
fuente: "raw/Material_Catedra/programa/Cronograma 2026-2C.pdf"
---

# Cronograma 2026 2C — Base de Datos II

Transcripción de `raw/Material_Catedra/programa/Cronograma 2026-2C.pdf`. **Es la autoridad para el
tema y la fecha** de cada encuentro: no numera clases y no dice nada de unidades.

> [!important] Qué es una "clase" — la premisa correcta
> Una **clase** es una unidad de contenido que **numera la cátedra** en el nombre del deck
> (`BD2_Clase NN`). **No es un día de calendario:** el **03/08** se dictaron **cinco clases** (01–05),
> el **10/08**, tres (06–08), el **24/08**, una sola (la 09), el **31/08**, una sola (la 10), el
> **07/09**, una sola (la 11), y el **14/09**, **tres** (12, 13 y 14) para una única fila del
> calendario. Tampoco todas se dictan en vivo: la **Clase 05 fue asincrónica**.
>
> Y **`Parte 2` no implica "misma clase"**: `Restricciones integridad-Parte 1` es la **Clase 09** y
> `-Parte 2` es la **Clase 10**. Manda el número del nombre del deck, no el "Parte N" del título.
>
> Las **prácticas no se numeran**: se identifican por **fecha** — `Práctica 2026-08-04`,
> `Práctica 2026-08-11`, …
>
> El registro real de qué archivo pertenece a qué clase está en [[_index-clases]].

> [!warning] El PDF dice "1er cuatrimestre"
> Es un error de la planilla: las fechas van del **1-Aug-2026 al 28-Nov-2026**, o sea el **2º
> cuatrimestre**. Se ignora la etiqueta y se usan las fechas.

## Ritmo de la cursada

| | Día | Horario | Modalidad |
| --- | --- | --- | --- |
| **Teórica** | Lunes | 19:00–22:00 | Virtual |
| **Práctica** | Martes | 16:00–19:00 | Presencial |

Cada fila del calendario es **un encuentro**, no una clase. Un encuentro teórico puede cubrir varias
clases de la cátedra, y una clase puede repartirse en varios archivos (`Parte 1/2/3`).

## Calendario

Las cuatro primeras columnas son la transcripción literal del PDF: **fecha · día y hora · modalidad ·
tema**. La quinta **no está en el PDF**: la completo yo, y **solo donde vi el material**. `pendiente`
significa *todavía no se verificó*, no *no hay*.

| Fecha | Día y hora | Modalidad | Tema | Clases de la cátedra |
| --- | --- | --- | --- | --- |
| 2026-08-03 | Lunes, 19:00–22:00, Teórica | Virtual | Cronograma. Bibliografía. Evaluaciones. Grupos (máx X) · Introducción a las Bases de Datos. Repaso modelo DER. Repaso implementación del esquema de BD · Repaso de SQL, SQL Avanzado, Manejo de fechas de SQL → **Asincrónico** | **Clases 01–05** *(la 05, asincrónica)* |
| 2026-08-04 | Martes, 16:00–19:00, Práctica | Presencial | Persistencia políglota. Docker, Instalación MySQL · TP 1 - Modelos · TP 2 - Creates · TP 3 - SQLs simples | [[Práctica 2026-08-04]] |
| 2026-08-10 | Lunes, 19:00–22:00, Teórica | Virtual | Vistas · Índices / Explain Plan | **Clases 06–08** |
| 2026-08-11 | Martes, 16:00–19:00, Práctica | Presencial | TP 3 - SQLs avanzados · TP 4 - Vistas | [[Práctica 2026-08-11]] |
| 2026-08-17 | Lunes, 19:00–22:00, Teórica | Virtual | 🚫 **FERIADO** | — |
| 2026-08-18 | Martes, 16:00–19:00, Práctica | Presencial | TP 5 - Explain Plan | [[Práctica 2026-08-18]] |
| 2026-08-24 | Lunes, 19:00–22:00, Teórica | Virtual | Restricciones de Integridad | **Clase 09** |
| 2026-08-25 | Martes, 16:00–19:00, Práctica | Presencial | TP 6 - Restricciones declarativas | [[Práctica 2026-08-25]] |
| 2026-08-31 | Lunes, 19:00–22:00, Teórica | Virtual | Triggers y SQL Procedural | **Clase 10** |
| 2026-09-01 | Martes, 16:00–19:00, Práctica | Presencial | TP 7 - Restricciones avanzadas | [[Práctica 2026-09-01]] |
| 2026-09-07 | Lunes, 19:00–22:00, Teórica | Virtual | Seguridad en Bases de Datos. Transacciones ACID · Implementación de matriz de roles y permisos | **Clase 11** *(el deck suma ocho slides de índices que el tema no anuncia)* |
| 2026-09-08 | Martes, 16:00–19:00, Práctica | Presencial | TP 8 - Seguridad | [[Práctica 2026-09-08]] |
| 2026-09-14 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción a MongoDB · MongoDB: Enfoque embebido vs Normalizado · Ejemplos con MongoDB | **Clases 12–14** *(las tres el mismo lunes; más cuatro handouts sin número)* |
| 2026-09-15 | Martes, 16:00–19:00, Práctica | Presencial | TP 9 - MongoDB Parte I | [[Práctica 2026-09-15]] |
| 2026-09-21 | Lunes, 19:00–22:00, Teórica | Virtual | 🚫 **Día del Estudiante** | — |
| 2026-09-22 | Martes, 16:00–19:00, Práctica | Presencial | TP 9 - MongoDB Parte II | pendiente |
| 2026-09-28 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción a Cassandra | pendiente |
| 2026-09-29 | Martes, 16:00–19:00, Práctica | Presencial | TP 10 - Cassandra Parte I | pendiente |
| 2026-10-05 | Lunes, 19:00–22:00, Teórica | Virtual | Conceptos teóricos de Cassandra | pendiente |
| 2026-10-06 | Martes, 16:00–19:00, Práctica | Presencial | TP 10 - Cassandra Parte II | pendiente |
| 2026-10-12 | Lunes, 19:00–22:00, Teórica | Virtual | 🚫 **FERIADO** | — |
| **2026-10-13** | Martes, 16:00–19:00, Práctica | Presencial | 🎯 **Parcial** | — |
| 2026-10-19 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción a Neo4j | pendiente |
| 2026-10-20 | Martes, 16:00–19:00, Práctica | Presencial | TP 11 - Neo4j | pendiente |
| 2026-10-26 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción a Redis | pendiente |
| 2026-10-27 | Martes, 16:00–19:00, Práctica | Presencial | TP 12 - Redis · **Revisión Parcial** | pendiente |
| 2026-11-02 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción Amazon DynamoDB | pendiente |
| **2026-11-03** | Martes, 16:00–19:00, Práctica | Presencial | 🎯 **Recuperatorio Parcial** | — |
| 2026-11-09 | Lunes, 19:00–22:00, Teórica | Virtual | **Enunciado TPO** · Clase de consulta/repaso | pendiente |
| 2026-11-10 | Martes, 16:00–19:00, Práctica | Presencial | **Entrega TPO virtual (domingo 15/11 al final del día)** · **Revisión Recuperatorio Parcial** · TP 13 - Amazon DynamoDB | pendiente |
| 2026-11-16 | Lunes, 19:00–22:00, Teórica | Virtual | 🎯 Presentación/Defensa TPO (X grupos) | — |
| 2026-11-17 | Martes, 16:00–19:00, Práctica | **Virtual** | 🎯 Presentación/Defensa TPO (X grupos) | — |
| 2026-11-23 | Lunes, 19:00–22:00, Teórica | Virtual | 🚫 **FERIADO** | — |
| 2026-11-24 | Martes, 16:00–19:00, Práctica | **Virtual** | 🎯 Presentación/Defensa TPO (X grupos) | — |

> [!note] Detalles de la transcripción
> - Las tres últimas prácticas (17/11 y 24/11) figuran como **Virtual**, no presencial: son defensas.
> - La **entrega del TPO** está anotada en la fila del **martes 10/11**, aunque la fecha real de
>   entrega es el **domingo 15/11**.
> - En las filas de feriado, parcial y defensas, la columna de clases va `—`: no hay contenido nuevo
>   de la cátedra que numerar, no es que falte verificar.

## Fechas que importan

| Qué | Cuándo |
| --- | --- |
| **Parcial** | martes **13/10**, presencial |
| **Recuperatorio** | martes **03/11**, presencial |
| **Enunciado del TPO** | lunes **09/11** |
| **Entrega del TPO** | domingo **15/11**, al final del día, virtual |
| **Defensas del TPO** | 16/11 · 17/11 · 24/11 *(por grupos)* |
| Feriados | 17/08 · 12/10 · 23/11 *(todos lunes: se pierden teóricas)* |
| Día del Estudiante | 21/09 *(lunes: se pierde teórica)* |

Las tres teóricas de feriado más el Día del Estudiante hacen **4 lunes perdidos**. La práctica del
martes nunca cae en feriado.

## Unidades

El cronograma **no habla de "unidades"**: las carpetas `Unidad-NN` son la organización de `raw/`, y
`raw/` es del humano. **Una unidad agrupa varias clases**, y cuáles son se sabe **mirando dónde quedó
archivado el material**, no deduciéndolo de los temas.

> [!warning] Esta tabla mezcla lo observado con lo previsto — no confundir
> Las filas ✅ son **hechos**: se verificó qué hay en la carpeta. Las demás son una **agrupación
> temática tentativa mía**, para orientarse. Ya falló: yo preveía `Unidad-02 = Clases 02–03`, y las
> Clases 02 a 10 están todas en `raw/Unidad-01/Teorica/` *(hoy, 02 a 11; la `Unidad-02` recién se
> abrió el 15/09 con las Clases 12–14)*. **Donde la previsión choque con dónde está el archivo, gana
> el archivo.** El registro real, archivo por archivo, está en [[_index-clases]].

| Unidad | Clases | Tema |
| --- | --- | --- |
| `Unidad-01` | ✅ **01 a 11** | Intro a las BD, DER, esquema lógico, DDL/alteración de tablas, consultas SQL · vistas · índices / explain plan · **restricciones de integridad** · **SQL procedural: triggers, stored procedures y cursores** · **seguridad (usuarios, `GRANT`/`REVOKE`, roles), transacciones ACID, concurrencia y niveles de aislamiento, e índices** *(Clase 11, 07/09)* · persistencia políglota, Docker, MySQL · enunciados **TP1 a TP8** *(falta el del TP3 SQLs avanzados)* y las seis prácticas del 04, 11, 18 y 25/08 más las del 01 y 08/09. **Es todo lo relacional**: 13 archivos de teórica |
| `Unidad-02` | ✅ **12 a 14** | **NoSQL**: por qué surge, propiedades, CAP, BASE, taxonomía · **MongoDB**: modelo de documentos, CRUD, `aggregate`, `$lookup`, vistas · **embebido vs. normalizado**, relaciones 1:1 / 1:N / N:M · **MongoDB Features**: `mongosh` y herramientas, índices, aggregation pipeline, MapReduce, replica sets, sharding *(las tres clases el 14/09)* · **cuatro handouts sin número de clase** *(consigna ecommerce + solución, sharding vs. replication, ejemplo MapReduce — documentados en la Clase 14)* · enunciado **TP9 Parte I** y la práctica del 15/09. Abierta el **15/09** |
| `Unidad-03` | *(previsto — ❌ **falló entero**: restricciones (Clase 09, TP6) **y también triggers y SQL procedural (Clase 10, TP7)** fueron a `Unidad-01`)* | triggers y SQL procedural *(ya se dictó, y quedó en `Unidad-01`)* |
| `Unidad-04` | *(previsto — ❌ **falló**: seguridad y ACID (Clase 11, TP8) fueron a `Unidad-01`)* | Seguridad, roles y permisos, ACID *(ya se dictó, y quedó en `Unidad-01`)* |
| `Unidad-05` | *(previsto — ❌ **falló**: NoSQL y MongoDB (Clases 12–14, TP9) fueron a `Unidad-02`)* | Tipos de bases NoSQL, MongoDB *(ya se dictó, y quedó en `Unidad-02`)* |
| `Unidad-06` | *(previsto)* | Cassandra |
| `Unidad-07` | *(previsto)* | Neo4j |
| `Unidad-08` | *(previsto)* | Redis |
| `Unidad-09` | *(previsto)* | DynamoDB |
| `Unidad-10` | *(previsto)* | Enunciado, entrega y defensas del TPO |

> [!caution] La numeración de clases y la de unidades son independientes
> `Unidad-01` contiene **once** clases y `Unidad-02`, **tres**. Nada garantiza que las demás unidades
> contengan una o dos: **no se puede predecir el número de clase a partir de la unidad, ni al
> revés.**

> [!failure] Van **siete** previsiones puestas a prueba: **una acertó y seis fallaron** — y las seis igual
> | Fecha | Yo preveía | Dónde quedó | |
> | --- | --- | --- | --- |
> | teórica del **10/08** *(Clases 06–08)* | `Unidad-02` | `Unidad-01` | ❌ |
> | práctica del **18/08** *(TP5)* | `Unidad-01` | `Unidad-01` | ✅ |
> | teórica del **24/08** y práctica del **25/08** *(Clase 09, TP6)* | `Unidad-03` | `Unidad-01` | ❌ |
> | teórica del **31/08** *(Clase 10)* | `Unidad-03` | `Unidad-01` | ❌ |
> | práctica del **01/09** *(TP7)* | `Unidad-03` | `Unidad-01` | ❌ |
> | teórica del **07/09** y práctica del **08/09** *(Clase 11, TP8)* | `Unidad-04` | `Unidad-01` | ❌ |
> | teórica del **14/09** y práctica del **15/09** *(Clases 12–14, handouts, TP9)* | `Unidad-05` | **`Unidad-02`** | ❌ |
>
> *(Cuenta al 02/09:)* Las cuatro que fallaron lo hicieron **del mismo modo**: yo esperaba una unidad
> nueva y el material siguió cayendo en la U1. Hoy `Unidad-01` lleva **las Clases 01–10 y los
> TP1–TP7, en cinco semanas**, y `Unidad-02` sigue vacía.
>
> Se puede leer como que la `Unidad-01` es *"todo lo relacional"* y el corte cae recién en NoSQL —
> **pero eso es otra previsión mía**, y vale exactamente lo mismo que las dos que fallaron. Lo único
> que es hecho es dónde están los archivos hoy. **Por eso la tabla de arriba lleva la advertencia que
> lleva.**
>
> **Actualización del 18/09 — sexta y séptima prueba, fallaron las dos, y la lectura de arriba
> quedó confirmada.** El material del 07–08/09 y del 14–15/09 se archivó el **15/09**: lo relacional
> *(Clase 11, TP8)* siguió en `Unidad-01`, y lo NoSQL *(Clases 12, 13 y 14, cuatro handouts y el TP9
> Parte I)* **abrió la `Unidad-02`**. Las seis previsiones fallidas asignaban una unidad por tema del
> cronograma; el corte real fue **relacional / NoSQL**. Hoy `Unidad-01` = **Clases 01–11 y TP1–TP8**
> *(13 archivos de teórica)*, `Unidad-02` = **Clases 12–14, 4 handouts y TP9**. Cómo se reparten
> Cassandra, Neo4j, Redis y DynamoDB **se observa cuando llegue el material del 28/09**, no antes.
> Detalle y la tabla completa de las siete pruebas en [[_index-clases]] § *Unidades*.

## Diferencias con el programa oficial

El cronograma es lo que **realmente se dicta**; el programa es el documento formal. No coinciden.

| | Programa | Cronograma *(lo que se dicta)* |
| --- | --- | --- |
| Motor relacional | **PostgreSQL** avanzado | **MySQL** |
| **HBase** | Contenido + TP2 | ❌ **no aparece** |
| **CouchDB** | TP4 | ❌ **no aparece** |
| **Cassandra** | Contenido, sin TP | ✅ **se dicta, con TP10 en dos clases** |
| Primera mitad | por motor, desde el TP1 PostgreSQL | **SQL avanzado sobre MySQL**: vistas, índices, explain plan, integridad, triggers, seguridad, ACID |
| Cantidad de TPs | 7 + TP Especial | **13 + TPO** |
| TP Especial | "TP Especial" | **TPO**, con enunciado el 09/11 y defensa oral |

> [!important] Esto cierra la duda de "Cassandra vs. CouchDB"
> Yo había concluido, a partir del texto del programa, que la unidad "Cassandra" era en realidad
> **CouchDB** — el texto de Contenidos describe capítulo por capítulo el de CouchDB de *Seven
> Databases*. **Estaba equivocado en cuanto a qué se dicta.** El cronograma tiene dos teóricas de
> Cassandra y un TP10 en dos partes, y CouchDB no aparece en ningún lado.
>
> Lo que sigue siendo cierto es que **el texto del programa está copiado del capítulo de CouchDB**.
> O sea: la etiqueta del programa acierta ("Cassandra") y su descripción está mal copiada.
>
> Consecuencia práctica: **ninguna edición de *Seven Databases* cubre Cassandra.** La fuente para la
> unidad de Cassandra es [[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini § 5]] más
> documentación de Apache Cassandra. Ver [[_index-bibliografia]] § 3.

## Cómo ubico un archivo nuevo

1. **El número de clase lo da el nombre del deck**, no el cronograma: `BD2_Clase 07 - Vistas-Parte
   2.pdf` → **Clase 07**. Si el deck **no** trae número —o es una práctica, que no se numeran—, se
   identifica por **fecha**: `Práctica 2026-08-11`. Si no hay ni número ni fecha clara,
   **preguntarle al humano**; no inventar una numeración.
2. **El cronograma da el tema y la fecha**, y sirve para confirmar que el deck cae donde parece. Para
   esto sí es autoridad — pero **no dice cuántas clases hay ese día ni cómo se numeran**.
3. **La unidad no se deduce: se lee del path.** El archivo ya está en alguna `raw/Unidad-NN/`, porque
   lo archivaste vos. Esa es la unidad, sin discusión — y si contiene clases que yo no esperaba ahí,
   el que estaba equivocado era yo.
4. `Teorica/` o `Practica/` lo dice el propio path, que también elegiste vos.
5. Registrar en [[_index-clases]] **a qué clase pertenece el archivo** —que la ruta no lo dice— y, si
   la unidad resultó tener una clase nueva, actualizar la tabla de § *Unidades* de acá arriba.
   Después, mapear la bibliografía en [[_index-bibliografia]] § 2.

> [!bug] Los errores que hay que no repetir
> **1. Confundir unidad con clase** *(11/08)*. Tomé la tabla de § *Unidades* —que la había derivado
> yo de los temas— como si dictara **dónde debe vivir** cada archivo, y declaré "mal archivados" tres
> decks que estaban perfectamente bien.
>
> **2. Numerar yo lo que la cátedra ya numeraba** *(12/08)*. Esta misma página tenía una columna
> `Clase` con valores 01–17 que **inventé yo**: era el **índice de fila** de la tabla del PDF, que
> tiene exactamente cuatro columnas —fecha, día y hora, modalidad, tema— y **no numera clases**. Con
> esa numeración falsa colapsé los diez decks `BD2_Clase 01`–`08` en dos "clases" de cinco y tres
> "bloques", inventando una estructura que la cátedra nunca usó.
>
> Son el mismo error dos veces: **tomar una inferencia mía por un dato de la fuente.** La regla que
> queda: **el nombre del deck decide la clase; el path decide la unidad; el cronograma decide el tema
> y la fecha, y nada más.**
