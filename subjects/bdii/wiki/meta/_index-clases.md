---
tipo: referencia
resumen: "Registro de qué archivo de raw/ pertenece a qué clase: las 14 teóricas con deck, fecha y síntesis, las prácticas por fecha, el reparto observado de unidades y punteros a dudas y contradicciones. Regla: la clase la numera la cátedra en el nombre del deck; la unidad se observa, no se predice."
formato: indice
---

# Índice de clases — Base de Datos II (72.41)

Mapa de la cursada. Las **fuentes** viven en `raw/` (las curás vos); las **síntesis** viven en
`wiki/clases/` (las escribo yo). El calendario, con fechas y temas, está en **[[_cronograma]]**.

Esta página es **el registro**: dice qué archivo de `raw/` pertenece a qué clase. Es el único lugar
del vault donde ese dato existe.

> [!important] El modelo: **clase**, **unidad**, **práctica** son tres cosas distintas
> - **Clase** — la numera **la cátedra**, en el nombre del deck: `BD2_Clase NN` → **Clase NN**. No la
>   invento yo ni la deduce el cronograma.
> - **Unidad** — es la **carpeta de `raw/` donde archivaste**, y **agrupa varias clases**: hoy
>   `raw/Unidad-01/` tiene las **Clases 01 a 11** *(13 archivos de teórica: la 05 va en tres partes)*
>   y `raw/Unidad-02/` las **Clases 12 a 14** *(3 decks, más 4 handouts sin número de clase)*.
>   La unidad la decidís vos al archivar; yo la registro después de verla.
> - **Práctica** — **no se numera**: se identifica por **fecha**. La cátedra numera solo las
>   teóricas, así que cada práctica se titula por el martes en que se dio
>   (`Práctica 2026-08-04`, `Práctica 2026-08-11`, …).
>
> De ahí se siguen dos cosas que rompen la intuición: **varias clases pueden dictarse el mismo día**
> —las Clases 01–05 fueron todas del 03/08— y **alguna puede ser asincrónica** —la Clase 05—.
> Una clase **no** es un día de calendario, y **el path no dice a qué clase pertenece un archivo:
> lo dice esta página.**

> [!warning] Corrección — antes acá decía que los decks `BD2_Clase NN` eran "bloques", no clases
> Durante varios días el vault sostuvo que los siete decks `01`–`05` eran *cinco bloques A–E de una
> sola teórica* (la del 03/08) y los `06`–`08` *tres bloques de otra*. **Era una invención mía.**
>
> El error viene de leer mal el cronograma. El PDF tiene **exactamente cuatro columnas**
> —`Fecha`, `Día y hora`, `Modalidad`, `Tema`— y **ninguna se llama "Clase": el cronograma no numera
> clases.** Yo numeré las **filas** de esa tabla 01–17, tomé ese índice por una numeración oficial y,
> como el 03/08 era una sola fila, colapsé siete decks dentro de una sola clase.
>
> La numeración real es la de la cátedra, y estaba a la vista en el nombre de cada archivo.
> **Un deck `BD2_Clase NN` = la Clase NN.** El cronograma sigue siendo autoridad para *fechas y
> temas*; no lo es para *numerar clases*.

## Cómo está organizado `raw/`

```
raw/
├── Unidad-NN/
│   ├── Teorica/     ← lunes 19–22, virtual   (decks BD2_Clase NN)
│   └── Practica/    ← martes 16–19, presencial (deck del día + TPs)
├── Material_Catedra/{programa,bibliografia}/
└── tp/              ← solo el índice; los enunciados van con su unidad
```

Una unidad puede contener **muchas clases**, y todas comparten el mismo `Teorica/` y el mismo
`Practica/`. Cuando entra material de una unidad que ya tiene archivos, hay que anotar acá a qué
clase corresponde cada uno o se pierde el dato. Para arrancar una nota hay plantillas en
`_templates/`.

> [!important] El reparto `unidad → clases` se **observa**, no se predice
> Vos sos el dueño de `raw/`: qué clases van a parar a cada carpeta de unidad lo decidís vos al
> archivar, y yo lo registro acá **después de verlo**. El [[_cronograma]] es autoridad para decir de
> qué **fecha y tema** es un material, pero **no** para decir en qué carpeta de unidad vive.
>
> La tabla de § *Unidades* es una **previsión mía**, útil para orientarse y nada
> más. Ya falló **cuatro veces** *(cuenta al 02/09)*: la primera, yo predecía que la teórica del 10/08 caía en
> `Unidad-02` y las Clases 06–08 fueron a parar a `Unidad-01`; las otras tres son el material del
> 24–25/08, el del 31/08 y el del 01/09, que yo esperaba en `Unidad-03` y volvió a caer en la U1.
> Cada previsión se confirma o se corrige cuando entra el material.
>
> **Actualización del 18/09**: van **siete pruebas — una acertó y seis fallaron**. Las dos últimas
> (`Unidad-04` = seguridad, `Unidad-05` = NoSQL) fallaron el 15/09: la Clase 11 y el TP8 fueron a la
> `Unidad-01`, y las Clases 12–14 y el TP9 abrieron la `Unidad-02`. Lo que sí quedó confirmado con
> ese corte es la hipótesis *"la Unidad-01 es todo lo relacional"* — detalle en § *Unidades*.

## Clases con material

**Catorce** clases, **todas sintetizadas**: las **01 a 11** archivadas en `raw/Unidad-01/Teorica/`
*(13 archivos: la 05 va en tres partes)* y las **12 a 14** en `raw/Unidad-02/Teorica/` *(3 decks, más
los 4 handouts sin número de clase de la tabla siguiente)*.

| # | Unidad | Deck | Slides | Fecha | Tema | Síntesis |
| --- | --- | --- | ---: | --- | --- | --- |
| **01** | U1 | `BD2_Clase 01 - Introducción_BasesDeDatos.pdf` | 14 | 03/08 | Introducción a las Bases de Datos | ✅ [[Clase 01 - Introducción_BasesDeDatos]] |
| **02** | U1 | `BD2_Clase 02 - Modelo Entidad-Relacion.pdf` | 36 | 03/08 | Modelo de Entidades y Relaciones | ✅ [[Clase 02 - Modelo Entidad-Relacion]] |
| **03** | U1 | `BD2_Clase 03 - Derivación a Esquema Lógico.pdf` | 24 | 03/08 | Derivación a esquema lógico relacional | ✅ [[Clase 03 - Derivación a Esquema Lógico]] |
| **04** | U1 | `BD2_Clase 04 - AlteraciónActualizaciónTablas.pdf` | 9 | 03/08 | Alteración y actualización de tablas | ✅ [[Clase 04 - AlteraciónActualizaciónTablas]] |
| **05** | U1 | `BD2_Clase 05 - Consultas de Datos–Parte 1.pdf`<br>`… – Parte 2.pdf`<br>`… – Parte 3.pdf` | 36<br>36<br>16 | 03/08<br>**asincrónico** | Consultas de datos — SELECT/WHERE/NULL/ORDER BY · joins, GROUP BY, subconsultas · alias, CONCAT, agregación | ✅ [[Clase 05 - Consultas de Datos–Parte 1]]<br>✅ [[Clase 05 - Consultas de Datos–Parte 2]]<br>✅ [[Clase 05 - Consultas de Datos–Parte 3]] |
| **06** | U1 | `BD2_Clase 06 - Vistas-Parte 1.pdf` | 18 | 10/08 | Vistas — concepto, `CREATE VIEW`, esquema externo | ✅ [[Clase 06 - Vistas-Parte 1]] |
| **07** | U1 | `BD2_Clase 07 - Vistas-Parte 2.pdf` | 22 | 10/08 | Vistas — actualizabilidad, `CHECK OPTION`, materializadas | ✅ [[Clase 07 - Vistas-Parte 2]] |
| **08** | U1 | `BD2_Clase 08 - Explicando el plan(1).pdf` | 22 | 10/08 | Índices y plan de ejecución — `EXPLAIN` | ✅ [[Clase 08 - Explicando el plan]] |
| **09** | U1 | `BD2_Clase 09 - Restricciones integridad-Parte 1.pdf` | 39 | 24/08 | Restricciones de integridad — RIRS, acciones referenciales, matching, `CHECK`/`DOMAIN`/`ASSERTION` y **triggers** | ✅ [[Clase 09 - Restricciones integridad-Parte 1]] |
| **10** | U1 | `BD2_Clase 10 - Restricciones integridad-Parte 2.pdf` | 20 | 31/08 | **SQL procedural** — stored procedures, funciones, **cursores** · los cuatro niveles de restricción (atributo, fila, tabla, `ASSERTION`) | ✅ [[Clase 10 - Restricciones integridad-Parte 2]] |
| **11** | U1 | `BD2_Clase 11 - Seguridad-Transacciones.pdf` | 38 | 07/09 | **Seguridad** — amenazas, autenticación/autorización, cifrado; usuarios `'u'@'h'`, `GRANT`/`REVOKE`, roles · **transacciones ACID**, estados, concurrencia, locking/OCC/timestamps, niveles de aislamiento · **índices** *(slides 31–38, un tercer bloque que ni el nombre ni el cronograma anuncian)* | ✅ [[Clase 11 - Seguridad-Transacciones]] |
| **12** | **U2** | `BD2_Clase 12 - Introduccion a NoSQL.pdf` | 52 | 14/09 | **Introducción a NoSQL** — por qué surge, propiedades, teorema CAP, BASE, taxonomía (clave-valor, documental, columnar, grafos) · **introducción a MongoDB**: arquitectura, CRUD en el shell, operadores, `aggregate`, `$lookup`, vistas | ✅ [[Clase 12 - Introduccion a NoSQL]] |
| **13** | U2 | `BD2_Clase 13 - NoSQL-EmbebidosVSNormalizado(1).pdf` | 28 | 14/09 | **MongoDB: diseño del modelo de datos** — documentos embebidos vs. referencias, relaciones 1:1, 1:N y N:M, `$lookup`, `find` con proyección, `explain` | ✅ [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] *(el `(1)` es artefacto de descarga: se cae del nombre de la página, no del `deck:`)* |
| **14** | U2 | `BD2_Clase 14 - MongoDB Features.pdf` | 45 | 14/09 | **MongoDB Features** — `ObjectId`, `mongosh` y herramientas de línea de comando, `mongoimport`, CRUD, índices, aggregation pipeline, **MapReduce**, `system.js`, pymongo, **replica sets** y **sharding** | ✅ [[Clase 14 - MongoDB Features]] *(incluye § *Material complementario del 14/09*: los 4 handouts)* |

> [!note] 14/09 — **tres clases en un solo lunes**, y la 11 sola el 07/09
> El cronograma tiene **una fila** para el 14/09 y la cátedra numeró **tres decks** para esa fila:
> `BD2_Clase 12`, `13` y `14`. El deck 12 cubre los dos primeros tramos del tema oficial *(intro
> NoSQL y tipos · intro a MongoDB)*, el 13 el tercero *(embebido vs. normalizado)* y el 14 el cuarto
> *(ejemplos con MongoDB)*. Es el mismo patrón del 03/08 y del 10/08: **una fila del cronograma no es
> una clase**. El 07/09, en cambio, fue una sola: la **Clase 11**.
>
> Y la Clase 11 repite lo del deck 10: el nombre —*"Seguridad-Transacciones"*— y el tema del
> cronograma **no anuncian los ocho slides de índices** (31–38, el 21 % del deck), cuatro de los
> cuales llevan el encabezado *"Transacciones en Base de Datos"* por copia y pega. Son **la teoría de
> índices que la Clase 08 no dio**, cuatro semanas después; [[1.08.02 - Índices|Índices]] ya la
> incorpora.

### Material sin número de clase

Cuatro archivos de `raw/Unidad-02/Teorica/` **no son decks de clase**: no traen `BD2_Clase NN` en
el nombre, son texto puro *(cero imágenes)* y están generados en **mayo de 2025** *(tres con PyFPDF
1.7.2 y uno con Word 2010)*. Se registran como **material complementario de la teórica del 14/09** y
están documentados, transcriptos y verificados a mano en [[Clase 14 - MongoDB Features]] § *Material
complementario del 14/09*. **No son clases** y no reciben número.

| Archivo (`raw/Unidad-02/Teorica/`) | Págs. | Qué es | Dónde está documentado |
| --- | ---: | --- | --- |
| `Consigna MONGO DB.pdf` | 2 | Consigna: un *ecommerce* (`clientes` / `productos` / `ordenes`) con **cinco preguntas de agregación**; el único ejemplo **N:M** de toda la cursada (`ordenes.items[].producto_id`) | [[Clase 14 - MongoDB Features]] § *Material complementario* **(a)** |
| `Consigna MONGO DB (solucion).pdf` | 4 | Solución oficial de la consigna, con `$lookup` y `$unwind` en los cinco pipelines *(que el deck 14 no enseña)*. Numeración corrida en uno respecto de la consigna; las preguntas **2, 4 y 5** tienen problemas *(ver el callout de contradicciones)* | ídem **(a)** |
| `Diferencia_Sharding_Replication_MongoDB.pdf` | 2 | Tabla comparativa *sharding* vs. *replication*: agrega *read preference*, *shard key*, `mongos` y *config servers*, que el deck no nombra | ídem **(b)** |
| `Ejemplo_MapReduce_MongoDB.pdf` | 2 | Ejemplo de `db.orders.mapReduce(...)` —total vendido por producto—, **deprecado desde MongoDB 5.0**; la página da el equivalente `$group` + `$out` | ídem **(c)** |

> [!question] ¿Se entregaron el 14/09?
> Los cuatro son de mayo de 2025, no de este cuatrimestre. Si se repartieron en la teórica del 14/09 o
> vienen de otra cursada, y si la solución se discutió en clase con sus respuestas incompletas, es una
> pregunta para el humano → [[Clase 14 - MongoDB Features]] § *Dudas abiertas*.

> [!warning] La Clase 10 se llama *"Restricciones integridad-Parte 2"* y **su portada dice otra cosa**
> El nombre del archivo hereda el de la Parte 1, pero el **slide 1 dice literalmente
> *"Base de Datos II · SQL PROCEDURAL · Triggers, Stored Procedures"***, y **doce de sus veinte
> slides son eso — los **2 a 13**, contados contra el PDF**: el marco conceptual del SQL procedural
> *(2–5)* y PL/pgSQL de punta a punta *(6–13: `CREATE FUNCTION`, variables, cursores,
> `RETURNS TABLE`)*. Las restricciones vuelven recién en los slides
> 14–19, y **son la jerarquía de la Clase 09 con otro vocabulario** *(atributo · fila · tabla ·
> generales)*, no material nuevo. Por eso el tema de la fila es *SQL procedural* y no *restricciones*:
> el nombre del archivo se conserva —es la regla del vault— pero **no describe el contenido**.
>
> Y a la inversa: **el deck no trae ni un solo `CREATE TRIGGER`**. Se titula *"Triggers"* y
> **presupone** el vocabulario que dio la Clase 09 en sus slides 25–38, sin repetirlo.

> [!failure] 02/09 — la previsión *"la Parte 2 es la misma Clase 09"* **erró, y hay que decirlo**
> [[Clase 09 - Restricciones integridad-Parte 1]] anunciaba: *"Hay una Parte 2 que todavía no está en
> `raw/`. Cuando llegue, es la **misma Clase 09** (`Parte 1/2` = un deck partido, no dos clases)
> **salvo que la cátedra le ponga otro número**."* **La cátedra le puso otro número: `BD2_Clase 10`.**
> La salvedad estaba bien puesta; la previsión principal, no.
>
> Lo que hay que extraer, y no estaba escrito en ningún lado: **el sufijo `Parte N` no dice nada sobre
> identidad de clase.** La regla de `CLAUDE.md` —*"un deck partido en varios archivos es una sola
> clase"*— sigue siendo correcta, pero lo que la hace verdadera en `BD2_Clase 05 Parte 1/2/3` es que
> **el número es el mismo**, no que diga *"Parte"*. Yo leí el `Parte 1` como premisa cuando la premisa
> siempre fue el `NN`. Es el mismo patrón que `CLAUDE.md` ya registra dos veces: **una estructura que
> yo deduje, tratada como autoridad sobre el material.**

> [!note] La Clase 05 es **una clase repartida en tres archivos**, no tres clases
> `Parte 1/2/3` son partes del mismo deck `BD2_Clase 05`: son **88 slides**, más que las Clases 01–04
> juntas. Tienen una página cada una porque el volumen lo pide, pero la clase es una sola, y fue
> **asincrónica**. La secuencia 02 → 03 → 04 → 05 es **modelar → derivar a tablas → modificar →
> consultar**.

> [!warning] El desfasaje **PostgreSQL / MySQL** no es un caso aislado del deck 04
> Releídos los **once archivos** uno por uno el **25/08**, sumado el **doceavo el 02/09** y el
> **decimotercero el 18/09** *(la Clase 11)*: **once de trece traen marcas de otro motor**, **uno no
> trae ninguna** —la Clase 02— y **uno trae sólo una atribución histórica** —la Clase 06—. Una fila
> por archivo — el *"no hay"* también es dato, y es lo que faltaba para cerrar las discrepancias de
> abajo. **Los decks 12–14 no entran en esta tabla**: son MongoDB, el motor correcto de la segunda
> mitad; su desfasaje es de *shell* y de versión, no de motor *(ver la nota al pie de la tabla)*.
>
> | Archivo | Motor ajeno | Evidencia verificada — slide y cita textual |
> | --- | --- | --- |
> | `BD2_Clase 01` | **PostgreSQL** | Slide 12, título *"QUÉ ES POSTGRESQL?"*, viñeta *"Primera versión de PostgreSQL liberó en 1997"*. Slide 13, *"ARQUITECTURA DE POSTGRESQL"* — el diagrama es **imagen**, y renderizado muestra `Postmaster` → `Postgres`, con `postgresql.conf`, `pg_hba.conf`, `pg_ident.conf`, *"PostgreSQL Share Buffer Cache"*, *"Write-ahead log (WAL)"* y flechas `FSYNC`. Es **identidad de motor, no sintaxis**: el deck no trae **una sola** sentencia SQL. Contrapunto MySQL en el slide 2, *"Herramientas"*: *"MySQL Workbench Community Edition"* · *"XAMPP"* · *"MongoDB"* |
> | `BD2_Clase 02` | — | **Verificado que no hay.** Cero coincidencias de motor y **cero SQL** en toda la capa de texto: es DER puro. El slide 6, el único de texto fino, renderizado es el diagrama *"ETAPAS EN EL DISEÑO DE DATOS"* (UdeD → Diseño Conceptual → Diseño Lógico → Esquema Físico), sin tipos de datos |
> | `BD2_Clase 03` | **PostgreSQL** | Slide 10, *"TIPOS DE DATOS"*, cuerpo: *"Tipos de datos Postgresql"* + `https://www.postgresql.org/docs/9.5/static/datatype.html`. Slide 23, *"SENTENCIA CREATE TABLE"*: el *synopsis* es el de PostgreSQL — `UNIQUE index_parameters \| PRIMARY KEY index_parameters`, `DEFAULT default_expr`, `REFERENCES reftable [ ( refcolumn ) ]`. **`index_parameters` no existe en la gramática de MySQL** |
> | `BD2_Clase 04` | **PostgreSQL** | El más explícito del vault sobre su propio motor. Slide 3, declarado **en el cuerpo**: *"…incorporar restricciones o quitarlas, etc. **La sintaxis de PostgreSQL**"*, y debajo `ALTER TABLE tabla ALTER COLUMN columna [SET DEFAULT value \| DROP DEFAULT]` y `[SET NOT NULL \| DROP NOT NULL]`. Slide 7: `DROP TABLE nombre_tabla [CASCADE \| RESTRICT]` |
> | `BD2_Clase 05` **Parte 1** | **PostgreSQL + Oracle** | **PostgreSQL** en el *título* de dos slides: 21 y 22, *"LIMIT and OFFSET (PostgreSQL)"* — el 21 da `[LIMIT {numero \| ALL}] [OFFSET numero];` y el 22 el ejemplo `LIMIT ALL` / `OFFSET 15;`, que **no compilan en MySQL**. Slide 35, screenshot: `ERROR:  aggregates not allowed in WHERE clause at character 105` — redacción de PostgreSQL. 🎯 **ORACLE**: el slide 5, *"Esquema Ejemplo DERE BD Voluntarios"*, es **una imagen que `pdftotext` no lee**; renderizada, declara `nombre_continente: VARCHAR2(25) NULL`, `id_direccion: NUMBER(4) NOT NULL`, `horas_aportadas: NUMBER(8,2) NULL`, `porcentaje: NUMBER(2,2) NULL`, `id_tarea: VARCHAR2(10) NOT NULL`, `nombre_institucion: VARCHAR2(60) NOT NULL` |
> | `BD2_Clase 05` **Parte 2** | **Oracle** | 🎯 **Slides 4 y 8, imágenes** — los dos traen un **recorte del mismo diagrama** *"Esquema Ejemplo DERE BD Voluntarios"* del slide 5 de la Parte 1, con sus tipos de **Oracle**: `id_direccion: NUMBER(4) NOT NULL`, `calle: VARCHAR2(40) NULL`, `codigo_postal: VARCHAR2(12) NULL`, `id_pais: CHAR(2) NOT NULL`, `nombre_institucion: VARCHAR2(60) NOT NULL`, `horas_aportadas: NUMBER(8,2) NULL`, `porcentaje: NUMBER(2,2) NULL`. Lo que sí vale del *"no hay"* viejo es que **en el texto del deck no se nombra ningún motor**: el único backtick del archivo es **tipográfico** —slide 29, *"a menos que éste sea `` `*´ ``"*—, no *quoting* de MySQL. Y las dos cosas que **no corren o no se comportan igual** en MySQL son SQL estándar y **no delatan motor**: slide 29, *"Para ORDER BY, null es el 'mayor'"* (en MySQL los `NULL` van **primero** en `ASC`), y **`FULL JOIN`**, que MySQL no tiene — slide 31 lo lista, y el 21 (imagen, renderizado) trae `FROM nacional N FULL JOIN internacional I ON (…)` |
> | `BD2_Clase 05` **Parte 3** | **T-SQL/SQL Server + MySQL** | **No** Oracle ni PostgreSQL: cero apariciones de las dos. El archivo **no tiene ninguna imagen embebida**, así que la capa de texto es exhaustiva y el *"no hay"* es firme. **T-SQL**: slide 9, *"Sentencia TOP"* con `SELECT top 3 nombre, apellido`; slide 14 `DATEPART(partedefecha,fecha)` con `SELECT datepart(month,getdate())`; slide 15 `DATENAME`; slide 16 `DATEDIFF (partedelafecha,fecha1,fecha2)` — **firma de tres argumentos**, la de MySQL toma dos; slide 5, alias asignado con `=` (`SELECT producto, "rango de precios" = CASE …`); slide 7, `LIKE 'A[nm]%'` y `LIKE '[-acfi]%'` — clases de caracteres que **sólo existen en SQL Server**. **MySQL**: backticks de *quoting* (slide 6 `` FROM `ventas` ``, slide 10 `` ORDER BY `fecha` ``) y slide 10 `LIMIT 0 , 30`, la forma `LIMIT offset,count` que **no existe en PostgreSQL** |
> | `BD2_Clase 06` | *(sólo histórica)* | **Sin sintaxis de otro motor.** La única aparición de un motor en todo el deck es el slide 11, y es **atribución histórica, no sintaxis**: *"Este concepto ha sido explicado por distintos autores (ej: Date), aplicado por el estándar SQL como forma de operar, y **popularizado por Oracle** que lo implementó y denominó propiedad 'key-preserved'"* |
> | `BD2_Clase 07` | **PostgreSQL** *(+ `:new` de Oracle)* | ✅ **Sí tiene marcas** — resuelve la discrepancia (a). Slide 21, título *"Vistas Materializadas - **PostgreSQL**"*, con `CREATE MATERIALIZED VIEW view_name AS query WITH [NO] DATA;` y la glosa *"view_name is the name of your materialized view **in Postgres**"*. Slide 12, cierre: *"(en **PostgreSQL** la función podría implementar el comportamiento para todos los eventos)"* — y su trigger, **rotulado en el propio slide como *"sintaxis SQL estándar"***, escribe `:new.nro_al` / `:new.id_tutor`, que son de **Oracle** *(el mismo choque que el deck 09 § contradicciones)*. Contrapunto MySQL: slides 13–16, *"Vistas Actualizables en MySQL"* |
> | `BD2_Clase 08` | **PostgreSQL puro** | Slide 1: `EXPLAIN ANALYZE`, el link `https://www.postgresql.org/docs/current/sql-explain.html`, *"By default (without BEGIN), **PostgreSQL** executes transactions in 'autocommit' mode"* y `SELECT relpages, reltuples FROM pg_class WHERE relname = 'table';`. Slide 9: `seq_page_cost = 1` y `(páginas * seq_page_cost) + (tuplas_a_retornar * cpu_tuple_cost)`. **Veintidós slides, y `EXPLAIN` aparece en diecinueve**: no está en el **8**, el **9** ni el **11** —los tres **sin imagen embebida**, así que ahí la capa de texto es exhaustiva y el *"no aparece"* es firme—; en el **5** no está en el texto pero **sí dentro de la imagen**, el tooltip *"Explain query"* de pgAdmin |
> | `BD2_Clase 09` | **PostgreSQL** | Slide 12: *"MATCH SIMPLE (Opción por defecto para SQL estandar **y PostgreSQL**)"*. Slide 27, título: ***"TRIGGERS – SINTAXIS PostgreSQL"***. Slide 36 es **PL/pgSQL**: `CREATE FUNCTION cant_total_empleados ( ) RETURNS trigger AS $body$` con `TG_OP`. Slide 39, primera fuente de la bibliografía: *"Capitulo 36 del Manual de POstgreSQL . www.postgresql.org"* |
> | `BD2_Clase 10` *(02/09)* | **PostgreSQL + Oracle** | 🎯 **El más denso del vault**, y el único donde el motor ajeno **es el contenido**, no un ejemplo suelto: **ocho slides —del 6 al 13— se titulan *"Procedimientos/Funciones en Postgres"***. Slide 6, cuerpo: *"Para **Postgres** todos son funciones, sólo que hay funciones que devuelven void ( Procedimientos )"*, con `RETURNS tipo AS $$ … $$ LANGUAGE plpgsql ;`. Slide 8: `ALIAS FOR $1`, `CONSTANT`, `voluntario%rowtype`, `voluntario.nombre%type`. Slides 9–11: *"Todo el acceso a cursores en **PL/pgSQL** … del tipo de datos especial **refcursor**"*, y la variable `FOUND`. Slides 12–13: `RETURNS TABLE(…)`, `RETURN QUERY`, `RETURN NEXT`, `record`. Slide 20, **los dos únicos links del deck**: `postgresqltutorial.com` y `postgresql.com` *(sic — el sitio es `.org`)*. 🔶 **ORACLE** en el slide 17: `having avg( **months_between ( sysdate**, fecha_nacimiento ) )` — ninguna de las dos existe en PostgreSQL ni en MySQL —, y en el slide 9 `curs3 CURSOR (key int) **IS** SELECT …`, donde el `IS` es PL/SQL y **contradice la gramática que el mismo slide da cuatro líneas más arriba** (`… CURSOR [ ( argumentos ) ] **FOR** select_query ;`) |
> | `BD2_Clase 11` *(18/09)* | **MySQL por defecto** *(+ SQL Server y PostgreSQL, **rotulados**)* | 🎯 **Primer deck de la U1 escrito en el motor de la cursada.** Slide 7, título *"Mecanismos de Seguridad (MySQL)"*; slide 8, *"Un usuario MySQL se define…"* y *"El superusuario se denomina ROOT"*; slides 9, 11 y 13, cuentas `'usuario'@'host'` con el comodín `'%'`; slide 11, los roles de MySQL 8.0+ copiados del manual § *Using Roles* (`dev1`/`dev1pass`/`app_developer`); slides 12–13, `FLUSH PRIVILEGES;` *(solo MySQL)*; slides 36–37, la § 10.3.9 del *MySQL Reference Manual* *(Comparison of B-Tree and Hash Indexes)* traducida a medias —dos viñetas quedaron en inglés— con el operador `<=>`, que solo existe en MySQL; slide 38, *"Ejemplo en MySQL: `CREATE INDEX MYINDEX ON USERS (DNI) USING HASH;`"*. **El motor ajeno son dos ejemplos que el propio deck rotula**: slide 29, *"-- Ejemplo de bloqueo en SQL Server"* (`BEGIN TRANSACTION; SELECT * FROM productos WITH (UPDLOCK); … COMMIT TRANSACTION;`) y slide 30, *"-- Ejemplo de control de versiones en PostgreSQL"* (`BEGIN; SELECT * FROM productos FOR UPDATE; … COMMIT;`) — este último **corre en MySQL sin cambios**. Sin rótulo y **no corre en MySQL**: slide 35, `drop index <nombre-índice>` sin `ON tabla`, e identificadores con guion (`índice-s`, `nombre-sucursal`) sin backticks |
>
> **Recuento del deck 11, verificado slide por slide (texto + los 38 renders):** 10 slides con MySQL
> explícito *(7 a 13, 36 a 38)* · 1 con SQL Server *(29)* · 1 con PostgreSQL *(30)* · 26 estándar o
> sin motor. Con el criterio del inventario, la U1 pasa de **10 de 12 a 11 de 13** archivos con motor
> ajeno — **pero por primera vez el motor ajeno es un ejemplo rotulado y no el contenido**. Lo grave
> del deck es otra cosa: **cero transacciones en MySQL** —ni `START TRANSACTION`, ni `ROLLBACK`, ni
> `autocommit`, ni `SET TRANSACTION ISOLATION LEVEL`, ni el dato de que InnoDB arranca en
> `REPEATABLE READ`—; eso vive en [[MySQL]] § *8 · Transacciones*.
>
> **Los decks 12–14 (MongoDB) quedan fuera del inventario, y conviene decir por qué**: el motor es
> el correcto; lo que traen es la **API legacy del shell `mongo`** (`insert`, `count`,
> `update({multi:true})`, `remove`, `ensureIndex`, `.pretty()`), `mapReduce` **deprecado desde 5.0**,
> `ObjectId` de 12 hex inválidos en el deck 12 y un deck 14 fechado en septiembre de 2023 con
> *"Stable release 6.0.5"*. El deck 12 sí trae un `CREATE TABLE` que mezcla MySQL (`MEDIUMINT`,
> `AUTO_INCREMENT`) y Oracle (`Number`) —heredado del *SQL to MongoDB Mapping Chart* oficial— y el
> 13 es **el primer deck teórico del vault sin ninguna marca de motor ajeno**. Detalle en [[MongoDB]].
>
> **Recuento del deck 10, verificado slide por slide (texto + los 20 renders):** 10 slides con
> PostgreSQL · 2 con Oracle *(el 9 y el 17)* · 8 estándar o sin motor · **0 con MySQL** —cero
> backticks, cero `DELIMITER`, cero `SIGNAL`—. Las imágenes embebidas son decoración de plantilla más
> tres diagramas de entidad *(slides 16 y 18)* que **no traen tipos de dato**: acá el `—` es
> *verificado que no hay*, no *"no lo miré"*. 🎯 **La ironía vale registrarla**: el slide 2 advierte
> *"cada proveedor de BD tiene su propio lenguaje procedural"* y **los once slides siguientes enseñan
> el de un proveedor que la cursada no usa**.
>
> **Contrapunto del 08/09:** el **TP 8 nombra a MySQL tres veces, dos de ellas para declarar que no
> alcanza** — ej. 1.b *"Resuelva el ejercicio desde la teoría, **ya que MySQL no provee la opción
> CASCADE**"* y ej. 2 *"En el caso de que MySQL no provee la funcionalidad pedida, resuelvalo desde
> la teoría"*. Tercer TP consecutivo con la fórmula. Y el **TP 9** es el **primer TP donde enunciado
> y motor coinciden**: escrito para `mongosh`, se corre en `mongosh` → [[Práctica 2026-09-08]],
> [[Práctica 2026-09-15]].
>
> **Contrapunto, y es el más fuerte del vault:** el **TP 7 es MySQL declarado**. Dos veces por escrito
> —ej. 1.c *"(aunque **MySQL** no soporta esta última opción, resuelvalo según la teoría)"* y ej. 2.b
> *"for each statement (aunque **MySQL** no lo soporta, responda según la teoría)"*—, y **cero
> apariciones** de PostgreSQL, Oracle o SQL Server en sus dos páginas. Es la **segunda** vez que la
> cátedra reconoce el desfasaje en un enunciado *(la primera fue el TP6 3.b/3.c)*: deja de ser
> anécdota y pasa a ser **método** — la teoría en el estándar, la implementación en MySQL, y la brecha
> nombrada. Detalle en [[Práctica 2026-09-01]].
>
> La cursada corre sobre **MySQL** y `esq_peliculas.sql` usa `DROP FOREIGN KEY`, que es MySQL.
> El inventario completo de qué es de cada motor está en [[PostgreSQL]]; la traducción, en [[MySQL]].
> Mapeo de bibliografía en [[_index-bibliografia]] § 2.

> [!warning] 25/08 — las **listas del vault no coincidían**: se releyeron los decks, y **falta propagar**
> El vault lleva **cuatro** inventarios de "qué deck trae otro motor" y **decían cosas distintas**.
> Antes de esta pasada: esta página e `index.md` listaban **seis** casos — `01`, `03`, `04`,
> `05` *partes 2–3*, `08`, `09` —; [[MySQL]] listaba **siete** — `01`, `03`, `04`, `05-P1`,
> **`07`**, `08`, `09` —; y [[PostgreSQL]] § *Inventario* listaba **ocho**, sumando el `06`.
> De ahí las dos discrepancias abiertas. **La (a) la ganó [[MySQL]]; la (b) no la ganó ninguna
> de las dos** —el reparto real no era el de ninguna—:
>
> | Discrepancia | Decía acá | Verificado en el deck |
> | --- | --- | --- |
> | **(a)** ¿La Clase 07 tiene marcas de otro motor? | **No figuraba** en la tabla | **Sí tiene.** Slide 21 titulado *"Vistas Materializadas - PostgreSQL"*; slide 12, *"(en PostgreSQL la función podría…)"* + `:new` de Oracle |
> | **(b)** ¿En qué parte de la Clase 05 está el motor ajeno? | *"partes 2–3 … Oracle y T-SQL"* | **Está en las tres partes, y la atribución vieja acertaba a medias.** El **Oracle** (`VARCHAR2`, `NUMBER(p,s)`) está en la **Parte 1** —slide 5, imagen— **y en la Parte 2** —slides 4 y 8, imágenes—: en la **P2 la atribución vieja tenía razón**. El **T-SQL** (`TOP`, `DATEPART`) está en la **Parte 3**. Lo que erraba es haber puesto el **Oracle en la Parte 3** —ese deck no tiene **ni una imagen** y su texto no nombra ningún motor: cero Oracle y cero PostgreSQL— y haberlo **omitido en la Parte 1** |
>
> El error de **(b)** tiene la forma conocida: la página wiki de la Parte 1 **ya tenía los tipos
> Oracle transcriptos en su § *Slide 5***, y esta tabla igual se los atribuía sólo a las partes
> 2–3. **La fuente decía una cosa y el índice otra; ganó la fuente.** Y el 25/08, en la primera
> corrección, esta tabla erró **al revés**: puso `—` en la Parte 2 sin haber renderizado sus
> slides 4 y 8, que traen el mismo diagrama de Voluntarios con tipos de Oracle. **La misma
> evidencia con la que se le atribuye Oracle a la Parte 1 se resolvió aquí en contra**, y como
> el `—` de este vault significa *"verificado que no hay"*, no era una omisión: era una
> **afirmación positiva falsa**. Corregido.
>
> Y el de **(a)** es de método: el slide 5 de la Parte 1 y el diagrama del slide 13 de la Clase 01
> son **imágenes**, invisibles para `pdftotext`. Un *"no hay"* que sale sólo de la capa de texto
> **no es un "no hay"**: los slides de texto fino hay que **renderizarlos**. Los de esta tabla se
> renderizaron.
>
> **Las listas NO quedan alineadas. Son cuatro, y hoy están así:**
>
> | Lista | Estado al 25/08 |
> | --- | --- |
> | **esta página** | ✅ **nueve archivos**: `01` · `03` · `04` · `05` *(P1, P2 y P3)* · `07` · `08` · `09`. Es la tabla de arriba |
> | [[MySQL]] § *Por qué MySQL* | ✅ alineada, pero **no "ya estaba bien"**: se corrigió el 25/08 en la misma pasada —su propio callout 🐛 dice *"esta fila decía `05-P1`"*—. Hoy lista **las tres partes** del `05`, o sea los mismos nueve archivos |
> | `index.md` | ⚠️ se corrigió el 25/08 y llegó por su cuenta al `VARCHAR2` del slide 5 de la P1 y a la Clase 07 faltante, **pero quedó en *"son ocho, no seis"***: ese conteo es el de antes de verificar la Parte 2 |
> | [[PostgreSQL]] § *Inventario* | ✅ **alineada al cierre del 25/08.** Era la última que faltaba. Su fila 5 ahora separa **P2 → Oracle, solo en imágenes** de **P3 → T-SQL + MySQL, sin Oracle ni PostgreSQL**, y su callout `pendiente` pasó a resuelto con las cuatro cuentas conciliadas. Sigue contando al **`06`**, y está bien que lo haga: es **otro criterio** *(`DROP VIEW … RESTRICT\|CASCADE`, que PostgreSQL implementa y MySQL ignora)*, no un desacuerdo |
>
> ~~**Pendiente de propagación**, entonces: el *"ocho"* de `index.md` y el callout `pendiente` + la
> fila 5 de [[PostgreSQL]]. Hasta que eso se toque, la discrepancia entre listas **sigue abierta**~~
> → **propagado; ver el callout de abajo, del 02/09.** Lo que sigue valiendo de este párrafo es lo
> otro: **la tabla de arriba es la verificada slide por slide.**
>
> *(Nota para la próxima lectura: `index.md` § pendientes decía que **esta** página seguía
> desalineada. Ya no: las cuatro coinciden.)*

> [!success] 02/09 — la discrepancia de listas **está cerrada, y la ganó [[MySQL]]**. El que quedó atrás es `CLAUDE.md`
> `CLAUDE.md` § *Puntos abiertos* #2 dice hoy: *"Los documentados hasta hoy: `BD2_Clase 01`, `03`,
> `04`, `05` y `08` (inventario en [[_index-clases]]; [[MySQL]] suma el `07` — **la discrepancia entre
> las dos listas está sin resolver**)"*. **Está resuelta desde el 25/08**, y encima esa frase congela
> una lista que omite el `09`, que ya figuraba en las cuatro páginas.
>
> **Veredicto: tenía razón [[MySQL]]** — y no por comparar listas, que es exactamente el error que
> `CLAUDE.md` advierte, sino contra el PDF. La lista que omitía el `07` era **falsable con un `grep`**:
>
> ```
> $ pdftotext -layout "BD2_Clase 07 - Vistas-Parte 2.pdf" - | grep -i postgres
>       (en PostgreSQL la función podría implementar el comportamiento para todos los eventos)
>       Vistas Materializadas - PostgreSQL
>    •  view_name is the name of your materialized view in Postgres
>    •  … If we need it while creating a Postgres materialized view, we specify the WITH DATA parameter
> ```
>
> Cuatro apariciones **en la capa de texto**, sin renderizar nada. Estado de las cuatro listas,
> verificado hoy archivo por archivo:
>
> | Lista | Dice | ¿Coincide? |
> | --- | --- | :---: |
> | **esta página** | nueve archivos con motor ajeno *(antes de sumar el `10`)* | ✅ |
> | [[MySQL]] § *Por qué MySQL* | los mismos nueve | ✅ |
> | `index.md` | *"con motor ajeno son **nueve**, no seis"* | ✅ |
> | [[PostgreSQL]] § *Inventario* | *"9 archivos de 11"*, más el `06` **por otro criterio declarado** | ✅ |
>
> **Lo que la Clase 10 abre de nuevo es el conteo, no la discrepancia**: con el deck 10 adentro son
> **diez archivos de doce**, y **las cuatro listas ya están propagadas al 02/09**:
>
> | Lista | Dice hoy |
> | --- | --- |
> | **esta página** | diez archivos de doce |
> | [[MySQL]] § *Por qué MySQL* | *"ajeno de **9 de 11 a 10 de 12**"* |
> | [[PostgreSQL]] § *Inventario* | *"**archivos con algún motor ajeno** \| 9 de 11 \| **10 de 12**"* |
> | `index.md` | *"el inventario pasa de **nueve archivos con motor ajeno sobre once** a **diez sobre doce**"* |
>
> **Actualización del 18/09**: con la Clase 11 el conteo es **once de trece** — esta página,
> [[MySQL]] § *Por qué MySQL*, [[PostgreSQL]] § *Inventario* e `index.md` ya lo dicen. Los decks
> 12–14 son MongoDB y **no entran** en el conteo.
>
> **Lo único que falta para cerrarla del todo: que vos corrijas `CLAUDE.md` § *Puntos abiertos* #2** —
> **es configuración del proyecto y esa la mirás vos**, no la toco por mi cuenta—. El texto propuesto:
> *"Verificado slide por slide: **diez archivos de doce** traen motor ajeno — `01`, `03`, `04`, `05`
> (P1, P2 y P3), `07`, `08`, `09` y `10` —; limpio sólo el `02`, y el `06` con una atribución
> histórica. La discrepancia entre listas **se resolvió el 25/08 a favor de [[MySQL]]**."*
>
> Y una cosa más, que es la del patrón conocido: acá **el desactualizado era `CLAUDE.md` respecto de
> sus propias páginas**. Misma forma que registra su callout `[!bug]` —una estructura derivada tratada
> como autoridad sobre el material—, sólo que esta vez el "material" son las páginas del vault.

> [!warning] El deck 08 no da teoría de índices
> El cronograma anuncia *"Índices / Explain Plan"*, pero el deck es **una transcripción de sesión de
> consola sobre `EXPLAIN`**: los índices aparecen solo por evidencia empírica. No hay B-tree por
> dentro, ni tipos de índice, ni criterios de cuándo crear uno. Está documentado arriba de todo en
> [[1.08.02 - Índices|Índices]].
>
> **Actualización del 18/09 — la teoría llegó, cuatro semanas después y sin anuncio.** Los slides
> 31–38 de la [[Clase 11 - Seguridad-Transacciones]] traen B-tree vs. hash, índices con y sin
> agrupación, multinivel y `CREATE INDEX` / `DROP INDEX`; [[1.08.02 - Índices|Índices]] ya los
> incorpora (`clases: [8, 11]`). Siguen sin darse bitmap, índices multidimensionales, el criterio de
> selección y el costo en escrituras.

## Prácticas

Indexadas **por fecha**, no por número: la cátedra no las numera. Las del 04/08 al 08/09 están en
`raw/Unidad-01/Practica/`; la del **15/09** es la **primera de la `Unidad-02`**, en
`raw/Unidad-02/Practica/`.

| Fecha | Material | TPs | Síntesis |
| --- | --- | --- | --- |
| **martes 04/08** | `BDD II - Clase I.pdf` · `esq_peliculas.sql` · `Resoluciones/` (`TP1.md`, `image.png` — tuyos) | TP1 Modelos · TP2 Creates · TP3 SQLs simples | ✅ [[Práctica 2026-08-04]] |
| **martes 11/08** | `ITBA TP 4 Vistas.pdf` | TP3 SQLs avanzados *(sin archivo todavía)* · TP4 Vistas | ✅ [[Práctica 2026-08-11]] |
| **martes 18/08** | `ITBA TP 5 Explain Plan.pdf` · `materia.csv` · `inscripto.csv` | TP5 Explain Plan | ✅ [[Práctica 2026-08-18]] |
| **martes 25/08** | `ITBA TP 6 Restricciones Declarativas.pdf` *(5 págs., sin dataset)* | TP6 Restricciones declarativas | ✅ [[Práctica 2026-08-25]] |
| **martes 01/09** | `ITBA TP 7 Restricciones Avanzadas.pdf` *(2 págs., sin dataset nuevo — **reusa `esq_peliculas.sql`**)* | TP7 Restricciones avanzadas | ✅ [[Práctica 2026-09-01]] |
| **martes 08/09** | `ITBA TP 8 Seguridad.pdf` *(3 págs., **sin dataset** — **tres esquemas propios**, dos como imagen y uno como línea de texto; no reusa `esq_peliculas.sql`)* | TP8 Seguridad | ✅ [[Práctica 2026-09-08]] |
| **martes 15/09** | `ITBA TP 9 - MongoDB Parte I.pdf` *(7 págs., **`raw/Unidad-02/Practica/`** — los datos van **dentro del PDF**: 12 `insert` como comandos en pp. 2–3 y la tabla de bandas del ej. 1 **solo como imagen** en p. 7)* | TP9 MongoDB Parte I | ✅ [[Práctica 2026-09-15]] |

Los enunciados de los TPs están en la carpeta de la unidad, junto al deck del día; `raw/tp/` guarda
solo el índice. La semana del 18/08 **no tiene teórica**: el lunes 17/08 es feriado, así que esa
semana aporta práctica y ningún deck `BD2_Clase`.

**Ninguna de las prácticas del 11/08, 18/08, 25/08 ni 01/09 trae deck de slides**: la cátedra entregó
solo el enunciado —y, el 18/08, además los dos CSV—. El único deck de práctica del vault sigue siendo
`BDD II - Clase I.pdf`, del 04/08. Tampoco las del **08/09** ni el **15/09** traen deck: el TP8 son
tres páginas de enunciado y el TP9, siete páginas con los datos adentro.

> [!note] El TP6 es el primero que **no necesita motor**
> Los TP4 y TP5 se resolvían tipeando. El **TP6 no trae ningún `.sql` ni CSV**, sus tres esquemas
> están **solo como imagen**, y sus dos primeros ejercicios piden *"indique el resultado"* — razonar
> la traza, no ejecutarla. Además, buena parte de lo que pide **no corre en MySQL**: los tipos de
> matching se ignoran y `CREATE ASSERTION` no existe. **Solo el ejercicio 3.c es ejecutable.**
> Detalle en [[Práctica 2026-08-25]].

> [!note] El TP7 vuelve al motor, y es el **primero desde el TP4 que reusa `esq_peliculas.sql`**
> Sus ejercicios 1 y 3 arrancan *"Según el esquema de Películas, del TP 3 - SQL Simples"*, y el 4 usa
> *"el esquema A del ejercicio 3 del TP 6"*: **no trae dataset nuevo, pero sí tiene qué ejecutar**, al
> revés que el TP6. Lo que queda de lápiz y papel son los dos puntos que piden `FOR EACH STATEMENT`
> —**1.c y 2.b**—, y esta vez **el enunciado avisa** que MySQL no lo tiene. Detalle en
> [[Práctica 2026-09-01]].

> [!note] El TP8 vuelve al lápiz y papel, **por decisión del enunciado**
> **No trae dataset** y es el segundo TP seguido que no toca `esq_peliculas.sql`: sus tres esquemas
> son propios —dos como imagen y uno como línea de texto—, y el del ej. 2 es exactamente el ERD de
> Voluntarios del slide 5 de la Clase 05. De sus **18 ítems**, tres son *"desde la teoría"* por el
> propio enunciado *(1.b, 2.d, 2.f)*, uno es inejecutable como está *(2.h, rol `ins_prov` que nunca
> se creó)*, uno usa `REVOKE … CASCADE` sin aviso *(3.b.2)* y el 1.a da un resultado distinto en
> MySQL que en la teoría. El desfasaje ya no es de una cláusula sino **de modelo de seguridad**: MySQL
> no tiene *owner*, ni `PUBLIC`, ni `CASCADE`, y trata el `GRANT OPTION` como marca por (cuenta,
> nivel). Detalle en [[Práctica 2026-09-08]].

> [!note] El TP9 es el **primero fuera de MySQL** y el **primero donde enunciado y motor coinciden**
> Está escrito para **`mongosh`** y se corre en `mongosh`: no hay traducción de sintaxis que hacer.
> El desfasaje pasa a ser **de versión** —`ensureIndex` *(deprecado, fuera del manual)*,
> `find().count()` *(deprecado en mongosh)*, la prosa del *upsert* con la firma legacy— y
> `docker pull mongo` va **sin tag** *(la práctica del 04/08 fijaba `mysql:9.7.2`)*. Los datos no
> vienen aparte: **sexta vez que hay que tipearlos a mano** *(TP4, TP5, TP6, TP7, TP8, TP9)* y cuarta
> en que hay datos o esquemas **solo como imagen** *(TP4, TP6, TP8, TP9)* — el conteo es el de
> `raw/tp/_index.md`. Los ejercicios 10–11 piden `createView` y
> `aggregate`, que ninguno de los 34 pasos guiados enseña. Detalle en [[Práctica 2026-09-15]].

> [!missing] Falta `Clase I.md`, tu nota propia de la primera semana
> Estaba en la vieja `Clases/…/Clase-01/Teorica/` y no aparece en `raw/Unidad-01/`. Sus definiciones
> de **programación políglota** y **persistencia políglota** quedaron citadas dentro de
> [[Práctica 2026-08-04]] § *Marco conceptual*, así que el contenido no se perdió, pero el original
> sí. Si lo recuperás, va en `raw/Unidad-01/` — en `Practica/` si es de la del 04/08, que es donde
> cae ese tema.

## Unidades

Dos unidades tienen material y se observan: **`Unidad-01` = Clases 01 a 11 + TP1 a TP8** *(13
archivos de teórica)* y **`Unidad-02` = Clases 12 a 14 + los 4 handouts + TP9 Parte I**, abierta el
**15/09**. `raw/Unidad-03` … `raw/Unidad-10` **todavía no existen**: la carpeta de unidad (con su
`Teorica/` y `Practica/`) la crea el humano cuando archiva el primer material, como pasó con
`raw/Unidad-02/` el 15/09 a las 23:36 *(verificado con `ls raw/` el 18/09: solo `Material_Catedra`,
`Unidad-01`, `Unidad-02` y `tp`)*.

> [!warning] Esto son **temas previstos**, no un reparto de clases
> Sale de agrupar los temas del [[_cronograma]] — **no de ver dónde archivaste nada**, y **no lleva
> números de clase**: las clases futuras las va a numerar la cátedra en el nombre del deck, y recién
> ahí se sabe cuáles son. Cada fila se confirma o se corrige cuando entra el material.
>
> Las dos filas ✅ son lo **observado** en `raw/` y sí llevan número porque la cátedra ya lo puso en
> el nombre de cada deck; las demás siguen siendo previsión, sin números de clase.

| Unidad | Temas previstos | Cuándo |
| --- | --- | --- |
| `Unidad-01` | ✅ **observado**: Clases **01 a 11** *(todo lo relacional: intro, DER, DDL, SQL, vistas, índices/explain, restricciones, SQL procedural, **seguridad, transacciones ACID e índices**)* · TP1 a **TP8** | 03/08 → 08/09 |
| `Unidad-02` | ✅ **observado**: Clases **12 a 14** *(NoSQL, CAP/BASE, MongoDB: embebido vs. normalizado, features)* · 4 handouts sin número · **TP9 Parte I** | 14/09 → 15/09 *(y previsión: TP9 Parte II el 22/09)* |
| `Unidad-03` | ~~Restricciones de integridad · TP6~~ *(25/08)* · ~~triggers y SQL procedural · TP7~~ *(02/09)* → **las dos fueron a `Unidad-01`** *(ver abajo)*. **No queda nada previsto acá** | — |
| `Unidad-04` | ~~Seguridad, matriz de roles y permisos, transacciones ACID · TP8~~ *(15/09)* → **fue a `Unidad-01`** *(Clase 11, TP8)*. **Nada previsto** | — |
| `Unidad-05` | ~~Tipos de bases NoSQL · MongoDB, embebido vs. normalizado · TP9 (I y II)~~ *(15/09)* → **fue a `Unidad-02`** *(Clases 12–14, TP9 Parte I)*. **Nada previsto** | — |
| `Unidad-06` | *(previsión)* Cassandra · TP10 (I y II) · 🎯 **parcial el 13/10** | 28/09 · 05/10 |
| `Unidad-07` | *(previsión)* Neo4j · TP11 | 19/10 |
| `Unidad-08` | *(previsión)* Redis · TP12 | 26/10 |
| `Unidad-09` | *(previsión)* Amazon DynamoDB · TP13 · 🎯 **recuperatorio el 03/11** | 02/11 |
| `Unidad-10` | *(previsión)* TPO: enunciado 09/11 · entrega 15/11 · defensas 16, 17 y 24/11 | 09/11 → 24/11 |

> [!warning] Las filas de previsión que quedan valen lo mismo que las que fallaron
> Seis de siete fallaron, y todas por lo mismo: la cátedra no reparte una unidad por tema del
> cronograma. Con dos unidades observadas la lectura más simple es *"una unidad por motor"*
> *(U1 relacional, U2 MongoDB)*, lo que haría caer Cassandra en la `Unidad-03` y no en la `Unidad-06`
> — **pero eso es otra previsión mía**, y se sabe el 28/09 cuando entre el deck.

> [!success] Confirmado el 18/08 — la práctica del `TP5 Explain Plan` cayó en `raw/Unidad-01/`
> Acá decía, como previsión, que la práctica del **18/08** era continuación temática de las Clases
> 06–08 y que por eso *"puede caer también en `raw/Unidad-01/`: se ve cuando llegue el enunciado"*.
> El enunciado llegó —`ITBA TP 5 Explain Plan.pdf`, `materia.csv` e `inscripto.csv`, el 18/08 a las
> 16:45— y quedó archivado en **`raw/Unidad-01/Practica/`**. Ya no es previsión: es **hecho
> observado**.
>
> Es el **segundo** caso registrado de una previsión puesta a prueba por el material que entra. El
> primero fue la teórica del 10/08, y **falló**: yo la esperaba en `Unidad-02` y las Clases 06–08
> fueron a `Unidad-01`. Una acertó y la otra no — que es exactamente por qué el reparto
> `unidad → clases` **se observa, no se predice**.

> [!failure] 25/08 — **tercera prueba, y volvió a fallar**: restricciones también cayó en `raw/Unidad-01/`
> La tabla de arriba predecía `Unidad-03 = Restricciones de integridad · triggers · TP6, TP7`, para el
> **24/08 y el 31/08**. El material del 24 y del 25 llegó —`BD2_Clase 09 - Restricciones
> integridad-Parte 1.pdf` e `ITBA TP 6 Restricciones Declarativas.pdf`, los dos el **25/08 a las
> 10:51**— y quedó archivado en **`raw/Unidad-01/Teorica/`** y **`raw/Unidad-01/Practica/`**.
>
> Van **tres previsiones puestas a prueba: una acertó y dos fallaron** *(cuenta al 25/08 — hoy son
> siete, ver los callouts de abajo)*, y las dos que fallaron lo hicieron **del mismo modo** — yo esperaba
> una unidad nueva y el material siguió cayendo en la U1.
>
> **La `Unidad-01` llevaba al 25/08 las Clases 01 a 09 y los TP1 a TP6, en cuatro semanas de cursada,
> y `Unidad-02` seguía vacía.** Ya no parece un accidente: parece que la `Unidad-01` es *"todo lo
> relacional"*, y que el corte va a caer recién en NoSQL. **Pero eso es otra previsión mía** y vale
> exactamente lo mismo que las anteriores: se confirma cuando entre el material del 31/08, no antes.
> Lo único que es hecho es dónde están los archivos hoy.

> [!failure] 02/09 — **cuarta y quinta prueba, y fallaron las dos**: triggers y el TP7 también cayeron en `raw/Unidad-01/`
> Era la última previsión que le quedaba a la `Unidad-03` —*"triggers y SQL procedural · TP7,
> 31/08 · 01/09"*, la parte que el callout de arriba daba por en pie—. El material llegó el **02/09 a
> las 19:28** —`BD2_Clase 10 - Restricciones integridad-Parte 2.pdf` e
> `ITBA TP 7 Restricciones Avanzadas.pdf`— y quedó archivado en **`raw/Unidad-01/Teorica/`** y
> **`raw/Unidad-01/Practica/`**. La fila de `Unidad-03` **se queda sin nada previsto**.
>
> **Van cinco previsiones puestas a prueba: una acertó y cuatro fallaron.** Las cuatro, del mismo
> modo — yo esperaba una unidad nueva y el material siguió cayendo en la U1:
>
> | # | Previsión | Material que la puso a prueba | Dónde cayó | Resultado |
> | :---: | --- | --- | --- | :---: |
> | 1 | teórica del **10/08** → `Unidad-02` | Clases 06, 07 y 08 | `Unidad-01` | ❌ **falló** |
> | 2 | práctica del **18/08** → *"puede caer también en `Unidad-01`"* | TP5 + los dos CSV | `Unidad-01` | ✅ **acertó** |
> | 3 | teórica y práctica del **24–25/08** → `Unidad-03` | Clase 09 · TP6 | `Unidad-01` | ❌ **falló** |
> | 4 | teórica del **31/08** → `Unidad-03` | **Clase 10** | `Unidad-01` | ❌ **falló** |
> | 5 | práctica del **01/09** → `Unidad-03` | **TP7** | `Unidad-01` | ❌ **falló** |
>
> **La `Unidad-01` lleva hoy las Clases 01 a 10 y los TP1 a TP7, en cinco semanas de cursada, y
> `Unidad-02` sigue vacía.**
>
> 🎯 **Y acá sí hay algo nuevo: la hipótesis del 25/08 pasó su primera prueba.** Aquel callout decía
> *"parece que la `Unidad-01` es «todo lo relacional» … se confirma cuando entre el material del
> 31/08, no antes"*. Entró el del 31/08 **y el del 01/09**, y volvió a caer en la U1. **Sigue siendo
> una previsión mía** —vale lo mismo que las cuatro que fallaron— pero ya no es sólo plausible: es la
> única que hasta ahora acertó dos veces seguidas. La prueba de fuego es el **07/09** *(seguridad y
> ACID: todavía relacional)* y, sobre todo, el **14/09** *(NoSQL y MongoDB)*, que es donde el corte
> tendría que caer si la hipótesis es buena.
>
> Lo único que es hecho es dónde están los archivos hoy.

> [!failure] 15/09 — **sexta y séptima prueba, y fallaron las dos**: `Unidad-04` y `Unidad-05` no recibieron nada
> La tabla preveía `Unidad-04 = seguridad, roles, ACID · TP8` para el 07–08/09 y
> `Unidad-05 = NoSQL, MongoDB · TP9` para el 14–15/09. El material llegó el **15/09 a las 23:36** y
> quedó archivado así: `BD2_Clase 11 - Seguridad-Transacciones.pdf` e `ITBA TP 8 Seguridad.pdf` en
> **`raw/Unidad-01/`**; `BD2_Clase 12`, `13`, `14`, los cuatro handouts e
> `ITBA TP 9 - MongoDB Parte I.pdf` en **`raw/Unidad-02/`**, que **dejó de estar vacía** ese día.
>
> **Van siete previsiones puestas a prueba: una acertó y seis fallaron.**
>
> | # | Previsión | Material que la puso a prueba | Dónde cayó | Resultado |
> | :---: | --- | --- | --- | :---: |
> | 1 | teórica del **10/08** → `Unidad-02` | Clases 06, 07 y 08 | `Unidad-01` | ❌ **falló** |
> | 2 | práctica del **18/08** → *"puede caer también en `Unidad-01`"* | TP5 + los dos CSV | `Unidad-01` | ✅ **acertó** |
> | 3 | teórica y práctica del **24–25/08** → `Unidad-03` | Clase 09 · TP6 | `Unidad-01` | ❌ **falló** |
> | 4 | teórica del **31/08** → `Unidad-03` | Clase 10 | `Unidad-01` | ❌ **falló** |
> | 5 | práctica del **01/09** → `Unidad-03` | TP7 | `Unidad-01` | ❌ **falló** |
> | 6 | teórica y práctica del **07–08/09** → `Unidad-04` *(seguridad, ACID, TP8)* | **Clase 11** · **TP8** | **`Unidad-01`** | ❌ **falló** |
> | 7 | teórica y práctica del **14–15/09** → `Unidad-05` *(NoSQL, MongoDB, TP9)* | **Clases 12, 13 y 14** · 4 handouts · **TP9 Parte I** | **`Unidad-02`** | ❌ **falló** |
>
> Las seis fallidas tienen la misma forma: yo asignaba una unidad **por tema del cronograma** y la
> cátedra archiva con otro criterio. Hoy **`Unidad-01` = Clases 01–11 + TP1–TP8** *(13 archivos de
> teórica)* y **`Unidad-02` = Clases 12–14 + 4 handouts + TP9**.

> [!success] 15/09 — la hipótesis *"la `Unidad-01` es todo lo relacional"* **quedó confirmada con el corte**
> Anotada el 25/08 como *"otra previsión mía"*, pasó su primera prueba el 02/09 y tenía fijada su
> prueba de fuego: *"el 07/09 (seguridad y ACID: todavía relacional) y, sobre todo, el 14/09 (NoSQL y
> MongoDB), que es donde el corte tendría que caer"*. **Cayó exactamente ahí**: lo relacional
> —Clase 11, TP8— fue a la `Unidad-01`, y lo NoSQL —Clases 12–14, TP9— abrió la `Unidad-02`. Es la
> única previsión de este vault que acertó tres veces seguidas y la única que explica las siete
> pruebas a la vez.
>
> Lo que **no** dice es cómo se reparten las unidades que vienen: Cassandra, Neo4j, Redis y DynamoDB
> pueden ser cuatro unidades, una sola, o seguir en la U2. **Se observa cuando llegue el material del
> 28/09.** Lo único que es hecho es dónde están los archivos hoy.

## Dudas abiertas

Esta sección **no contiene** las dudas: cada una vive en la página donde nació —§ *Dudas abiertas* en
las teóricas, § *Preguntas para el docente* en las prácticas—. Acá van solo los **punteros**, para no
tener dos copias que se desincronicen. `index.md` remite a esta lista.

| Dónde viven | Qué juntan |
| --- | --- |
| [[Clase 06 - Vistas-Parte 1]] § *Dudas abiertas* | Nombres de vista que no cierran entre slides, `PROV_COMP` con dos definiciones, la definición de `LOCAL` del slide 15 vs. la del estándar, `DROP VIEW … RESTRICT` en MySQL |
| [[Clase 07 - Vistas-Parte 2]] § *Dudas abiertas* | Actualizabilidad con `JOIN` en MySQL, `CREATE OR REPLACE VIEW`, vistas materializadas, qué criterio decide qué materializar |
| [[Clase 08 - Explicando el plan]] § *Dudas abiertas* | Los costos que no cierran de los slides 16 y 17, `EXPLAIN (ANALYZE, BUFFERS)` en MySQL, el `BEGIN…ROLLBACK` del slide 1, `GEQO` |
| [[Práctica 2026-08-11]] § *Preguntas para el docente* | TP4: qué chequea `LOCAL` en cadena (el 4.c pide las 9 combinaciones y el vault resuelve una) y el **choque de criterios** join vs. clave preservada |
| [[Práctica 2026-08-18]] § *Preguntas para el docente* | TP5: ~~🔴 la **sintaxis MySQL de `CREATE INDEX`**~~ ✅ **cerrada el 18/09** *(Clase 11, slides 35 y 38 — `CREATE INDEX` / `DROP INDEX … ON tabla`; ya está en [[1.08.02 - Índices\|Índices]] y en [[MySQL]] § 4 · Índices y plan de ejecución; queda pendiente marcarla en la página de la práctica)*, el *Form Editor* de Workbench, el índice clustered de InnoDB, si el **parcial** se rinde sobre MySQL |
| [[Clase 09 - Restricciones integridad-Parte 1]] § *Dudas abiertas* | ~~cuándo llega la **Parte 2**~~ ✅ **cerrada el 02/09** *(llegó, y es la **Clase 10**, no la misma 09)*. Siguen: si el parcial toma sintaxis del estándar o de MySQL, `:new`/`:old` vs. `new.`/`old.`, `RESTRICT` vs. `NO ACTION` en un motor que los trata igual, el `BETWEEN` del slide 19, la columna tapada del slide 11 |
| [[Práctica 2026-08-25]] § *Preguntas para el docente* | TP6: 🔴 **A.4 y A.5 se contradicen** *(juntas hacen imposible publicar un artículo argentino)*, si se clasifica por ámbito o por sentencia, el escape del `_` en `LIKE`, cuántos ejemplos pide el 2.b |
| [[Clase 10 - Restricciones integridad-Parte 2]] § *Dudas abiertas* | 🔴 si el **error 1442** frena el trigger del TP7 ej. 2, si **PL/pgSQL entra al parcial** cuando el TP se resuelve en MySQL, si los **cursores** entran y con qué bibliografía *(no tienen capítulo en GMUW ni en Date)*, **por qué el archivo se llama *"Restricciones"* si la portada dice *"SQL procedural"*** —¿falta un deck?—, y que **`INSTEAD OF` sigue sin resolverse**: el material del 31/08 que iba a cerrarlo ya llegó y no lo cierra. Más: `CREATE OR REPLACE` en MySQL 9.7, `TEXT` como variable local, si `CREATE DOMAIN` salió del temario |
| [[Práctica 2026-09-01]] § *Dudas abiertas* | TP7: 🔴 el mismo **error 1442** *(de eso depende que los ej. 2 y 4 se puedan correr)*, 🔴 si el **3.d** pide `PROCEDURE` o `FUNCTION` *(el enunciado dice "stored procedure", el título dice "funciones", y el cálculo devuelve **dos** valores)*, 🔴 si el **ej. 2** espera la respuesta única o el análisis de la dependencia del orden. Más: unidad de tiempo del ej. 3, un `HIS_ENTREGA` o dos, si el TP se entrega y en qué formato |
| [[Clase 11 - Seguridad-Transacciones]] § *Dudas abiertas* | 🔴 **qué se toma de seguridad en el parcial**: la sintaxis MySQL del deck o el grafo de permisos / `REVOKE CASCADE` de GMUW 10.1 que el TP8 ejercita *"desde la teoría"*; 🔴 **por qué los slides 31–38 son de índices y si se dieron en clase** *(preguntar al humano)*; si `REPEATABLE READ` evita *phantoms* "para la cátedra" *(el slide dice que no; InnoDB en la práctica sí)*; dónde está la *"matriz de roles y permisos"* del cronograma *(el deck no tiene ninguna)*; si se explicó `SET DEFAULT ROLE` *(sin eso el ej. 2.h del TP8 no funciona)*; si el `FOR UPDATE` del slide 30 —rotulado PostgreSQL— vale como sintaxis MySQL, y `START TRANSACTION` o `BEGIN`; si entran deadlocks, 2PL y recuperación *(no están en el deck)*; el deck no declara bibliografía y sus fuentes evidentes *(Silberschatz completo, Elmasri-Navathe)* no están en el vault; cuatro afirmaciones del manual a verificar en el contenedor *(`USING HASH` → BTREE, `'u'@'localhost'` vs. `'%'` en Docker, rol sin activar, `@@transaction_isolation`)* |
| [[Práctica 2026-09-08]] § *Preguntas para el docente* y § *Dudas abiertas* | TP8: 🔴 si el **1.a** espera la respuesta de la teoría *(la sentencia 6 falla)* o la de MySQL *(pasa)*, o las dos; 🔴 **2.h**: si `ins_prov` es errata de `ins_vol` o un rol distinto a propósito *(cambia i y j)*; **1.b**: si `REVOKE UPDATE(tiempo)` a quien tiene `UPDATE` de toda la tabla se descompone o no hay nada que revocar; **2.d**: si aceptan `mandatory_roles` como sustituto de `PUBLIC`; **3**: si `A.usuario` se reproduce en MySQL como base `A` o se contesta en papel; 🔴 si el **parcial evalúa seguridad con la semántica del estándar** *(grafo, `CASCADE`, *owner*, `PUBLIC`)* **o con la de MySQL** — dan respuestas distintas; si el TP se entrega y en qué formato; números de error y `GRANT OPTION` por nivel pendientes de verificar en `mysql:9.7.2` |
| [[Clase 12 - Introduccion a NoSQL]] § *Dudas abiertas* | 🔴 cómo responder *"¿MongoDB soporta transacciones ACID?"*: con el deck *(slide 11: no)*, con Seven Databases 2018 *(Transactions: No)* o con la versión actual *(multi-documento desde 4.0)* — afecta la justificación de motor del TPO; 🔴 **en qué esquina de CAP van MongoDB y Redis**: el slide 18 dice CP para ambos, Corbellini Table 2 AP y CP / AP, Seven Databases A2 pone a Redis en CA — **tres fuentes, tres esquinas**; qué versión corre la cursada y si se acepta la sintaxis legacy del deck *(`insert`, `count`, `update{multi}`, `remove`, `ObjectId` sin comillas — en `mongosh` el slide 38 falla dos veces)*; si *"familia de columnas"* se dicta como *column store* *(lo que dibuja el slide 24)* o como *wide-column* *(lo que es Cassandra)*; si entra la implementación de la consistencia eventual *(N/W/R, quórum)*; qué operadores además de los seis del slide 41 se dan por sabidos; si `$lookup` es "el join de MongoDB" o señal de mal modelado; por qué el deck no trae bibliografía, versión ni fecha; la página quedó en 2046 líneas *(proporcional a 52 slides)* |
| [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] § *Dudas abiertas* | **N:M sin ejemplo en el deck**: arreglo de ids en ambos lados o colección intermedia *(el único N:M de la cursada está en el handout de ecommerce)*; integridad referencial: nadie valida `user_id`/`publisher_id` — ¿`$jsonSchema` o huérfanos desde la aplicación?; verificar en `mongosh` la semántica **null = ausente** de `$lookup` con los datos del slide 22; si la cátedra llega a transacciones multidocumento o la respuesta es "embeba lo que necesite atómico"; `$unwind` **no está en el deck 14** *(lo usa el handout)*: hueco de la cursada; el esquema `cliente` del slide 26 no es de ningún ejemplo anterior; versión de MongoDB de la cursada; regla para la binaria 1:1 que [[1.03.01 - Derivación de MER a esquema relacional\|1.03.01]] no tiene; patrones con nombre de la documentación; `DBRef` vs. referencia manual |
| [[Clase 14 - MongoDB Features]] § *Dudas abiertas* | 🔴 **si `mapReduce` entra al parcial** *(deprecado desde 5.0; tres slides y un handout)*; 🔴 `$lookup` y `$unwind` no están en el deck y la solución oficial del handout los usa en los cinco pipelines: ¿se dictaron oralmente, salen de Paul Done o de la Parte II del TP9?; 🔴 **qué versión de MongoDB corre el TP** *(`docker pull mongo` sin tag resolvía a **8.3.11** el 16/09 según [[MongoDB]]; el deck es de 6.0.5 — determina si `ensureIndex`/`count`/`insert` corren con aviso o fallan)*; **si los cuatro handouts de mayo de 2025 se entregaron el 14/09** y si se discutió la solución con sus respuestas incompletas *(preguntar al humano)*; la consigna dice *"Usando MongoDB (Compass)"*: ¿pipeline builder gráfico o vale `mongosh`?; replica sets y sharding con comandos o solo como concepto; transacciones, GridFS y geoespacial *(en el libro, no en el deck)*; en qué unidad caen la Parte II del TP9 y Cassandra; `toString()` de `ObjectId` en `mongosh`; ficha para *Practical MongoDB Aggregations*; si la cátedra asume el cap. 4 de Seven Databases entero como lectura |
| [[Práctica 2026-09-15]] § *Preguntas para el docente* y § *Dudas abiertas* | TP9: 🔴 si `ensureIndex()` existe todavía en el `mongosh` de la imagen `mongo` actual *(no está en el manual)*; 🔴 qué versión baja `docker pull mongo` *(de eso dependen la salida de `explain()` del paso 34 y las advertencias)*; si la imagen corre en UTC *(los 13 `dob` van con mes 1-based en `new Date(y,m,d)`: todos un mes corridos)*; paso 34: con `name_1` y `name_1_weight_1` coexistiendo, cuál elige el planificador; 🔴 **ej. 1: si EFECTO ALFONS son dos bandas o una** *(cambia el ej. 9: 3 vs. 2, y el promedio del 10)*, una colección o dos, `discos: []` o campo ausente; ej. 10 antes o después del 4, y dónde va el `$sort`; ej. 11: "barrios más musicales" por bandas o por integrantes; qué contiene la Parte II del 22/09 *(no está en `raw/`)*; si se entrega y en qué formato |
| [[Clase 02 - Modelo Entidad-Relacion]] · [[Clase 03 - Derivación a Esquema Lógico]] · [[Clase 05 - Consultas de Datos–Parte 1]] *(y partes 2 y 3)* | DER y repaso relacional: notación del parcial, derivación de 1:1 y ternarias, `NULL`, `UNION`/`INTERSECT`/`EXCEPT` |
| [[Clase 01 - Introducción_BasesDeDatos]] · [[Clase 04 - AlteraciónActualizaciónTablas]] | Dudas sueltas de las dos clases más cortas |
| [[MySQL]] · [[PostgreSQL]] | Lo que quedó en `verificar` de la traducción entre motores |
| [[MongoDB]] | Versión real de la imagen `mongo` sin tag, `ensureIndex`/`count` en `mongosh`, `mapReduce` en 8.x, replica set y sharding sobre el `mongod` suelto del TP9, autenticación *(el contenedor arranca sin `--auth` y ninguna clase dio usuarios ni roles de MongoDB)* |

> [!bug] Las **contradicciones internas de los decks del 10/08** (Clases 06–08)
> Son las más gruesas del vault y conviene llevarlas juntas a clase. El detalle de cada una está en
> la página que la registra; esto es el índice.
>
> 1. **¿Una vista con `JOIN` es actualizable en MySQL?** El deck 07 dice que **no** en el slide 13 y
>    hace `insert` y `update` a través de una en el slide 10 → [[Clase 07 - Vistas-Parte 2]]. El
>    **TP4 la agrava**: sus ejercicios 4.e y 5 piden analizar ensambles con el criterio SQL:1999 de
>    clave preservada, que da el resultado opuesto → [[Práctica 2026-08-11]] § *Choque de criterios*.
> 2. **Slide 16 del deck 08**: el costo *"se incrementó"* pasando de 933897 a **511017**, o sea que
>    bajó → [[Clase 08 - Explicando el plan]].
> 3. **Slide 17 del deck 08**: dos costos distintos (933897 y 391421) para la misma consulta → ídem.
> 4. **`CASCADE` vs. `CASCADED`**: el deck 07 slide 2 escribe *"opción: cascade/local"*; el deck 06
>    slide 15 escribe `CASCADED`, que es la palabra real, y la cláusula va
>    `WITH [CASCADED|LOCAL] CHECK OPTION`. **El TP4 propaga la forma incorrecta** →
>    [[Práctica 2026-08-11]].
> 5. ✅ **Cerrada** — las dos erratas del **slide 17 del deck 06** (`Envios500-999` con guion medio,
>    `FROM ENVIO500` sin la `S`). El TP4 escribe `ENVIOS500_999` *"a partir de vista ENVIOS500"* →
>    [[Práctica 2026-08-11]].

> [!bug] Las **contradicciones internas del deck del 24/08** (Clase 09)
> Menos numerosas que las del 10/08, pero una de ellas es de sintaxis pura y se corrige en un parcial.
>
> 1. 🔴 **`:new` / `:old` vs. `new.` / `old.`** — el slide **30** dice *"corresponde referirse a estos
>    elementos como `:new` y `:old`"*, y el slide **36** —la función PL/pgSQL de ejemplo— escribe
>    `new.AreaT` / `old.AreaT`, **sin dos puntos**. Los dos puntos son de **Oracle**; ni PostgreSQL ni
>    MySQL los usan. El slide **34** repite el error → [[Clase 09 - Restricciones integridad-Parte 1]].
> 2. **El `CHECK` del slide 19 no coincide con su enunciado**: dice *"mayor a 0 e inferior a 50000"* y
>    escribe `BETWEEN 0 AND 50000`, que **incluye los dos extremos** — lo dice el propio slide 18.
> 3. **El slide 31 desaconseja lo que el 32 muestra**: *"un trigger `BEFORE` no debería contener
>    sentencias que alteren datos"*, y el ejemplo siguiente es un `BEFORE UPDATE` que hace `INSERT`.
>    *(No es contradicción real: el 32 ilustra por qué el 31 lo desaconseja. Pero leídos sueltos
>    confunden.)*
> 4. **El slide 11 tiene la columna `AreaT` tapada por un recuadro** en la vista renderizada. La capa
>    de texto del PDF sí la tiene (`101` para los dos empleados); **si el slide se proyecta, el
>    ejercicio se ve incompleto**.
> 5. Erratas menores: **`ttrigger`** con doble `t` *(slide 27)*, el paréntesis sin cerrar del
>    `CREATE DOMAIN` *(slide 17)*, las comillas rotas del `IN (…)` *(slide 18)* y **"POstgreSQL"**
>    *(slide 39)*.
>
> Y del lado del TP6, una del enunciado: **A.4 y A.5 se contradicen** — juntas hacen imposible
> publicar un artículo argentino, y encadenadas con A.3, imposible publicar nada en 2017 →
> [[Práctica 2026-08-25]] § *Preguntas para el docente*.

> [!bug] Las **contradicciones internas del deck del 31/08** (Clase 10)
> Pocas pero jugosas, y dos de ellas son **el mismo slide contradiciéndose a sí mismo**. Detalle en
> [[Clase 10 - Restricciones integridad-Parte 2]]; esto es el índice.
>
> 1. 🔴 **El nombre del archivo contra su portada**: se llama *"Restricciones integridad-Parte 2"* y
>    el slide 1 dice ***"SQL PROCEDURAL · Triggers, Stored Procedures"***. Trece de veinte slides son
>    lo segundo. *(Ver el callout de la tabla de clases.)*
> 2. 🔴 **El slide 9 se desmiente cuatro líneas después de escribirse**: da la gramática
>    `nombre CURSOR [ ( argumentos ) ] **FOR** select_query ;` y el ejemplo de abajo escribe
>    `curs3 CURSOR (key int) **IS** SELECT …`. El `IS` es **Oracle**.
> 3. 🔴 **El slide 17 escribe un ejemplo en Oracle y después se queja de PostgreSQL**:
>    `having avg( months_between ( sysdate, … ) )` —las dos funciones son de Oracle— y el recuadro de
>    abajo dice *"**Postgres NO implementa este tipo de checks**, Postgres no permite un select dentro
>    de un constraint…. ☹"*. 🎯 **Esa sentencia no compila en ningún motor, por dos razones
>    distintas, y el deck nombra sólo una** — Oracle tampoco admite subconsultas en un `CHECK`.
> 4. **Se titula *"Triggers"* y no trae ni un `CREATE TRIGGER`**: cero `BEFORE`/`AFTER`, cero
>    `FOR EACH ROW`, cero ECA. Presupone el vocabulario de los slides 25–38 de la Clase 09 — que sí
>    están dados, así que **no falta nada, pero el deck no se sostiene solo**.
> 5. **El slide 2 advierte** *"cada proveedor de BD tiene su propio lenguaje procedural"* y los once
>    siguientes enseñan **PL/pgSQL**, que no es el de la cursada.
> 6. Erratas de código: **`OPEN CURSOS FOR EXECUTE`** *(por `CURSOR`, slide 10)*, el
>    `cursor cur1 for select …` **invertido** del slide 11 *(PL/pgSQL es `cur1 CURSOR FOR …`)*,
>    **`menaje`** por `mensaje` *(11)*, el cierre `$$; LANGUAGE plpgsql;` del slide 13 —el `;` sobra
>    y deja el `LANGUAGE` fuera de la sentencia, comparar con el 12, que lo pone **antes** del
>    `AS $$`—, comillas curvas `“ ”` en literales *(10, 11)*, comentarios con `//` **que no son
>    comentario en ningún motor** *(8, 9, 18)*, y el link **`postgresql.com`** del slide 20 *(el sitio
>    es `.org`)*.
>
> 🔴 **Y una que no es del deck sino del vault: `:new`/`:old` ya no es una duda de una clase.** El
> deck 09 se contradecía solo *(slide 30 Oracle vs. slide 36 PL/pgSQL)*; este suma **dos filtraciones
> más de Oracle** *(ítems 2 y 3)*. **Van tres instancias en dos decks consecutivos**, y eso cambia la
> pregunta: ya no es *"cuál de las dos formas se corrige"*, es **si la cátedra corrige dialecto o sólo
> lógica**.

> [!bug] Las **contradicciones internas del deck del 07/09** (Clase 11)
> Treinta y seis erratas en 38 slides y casi ninguna rompe código —el deck tiene poco—, pero cuatro
> son conceptuales. Detalle en [[Clase 11 - Seguridad-Transacciones]] § *Contradicciones internas*;
> esto es el índice.
>
> 1. **Slide 8 vs. 9**: *"un usuario MySQL se define en términos de un nombre de usuario y una
>    contraseña"* vs. la identidad `'usuario'@'host'` del slide 9. Gana el 9.
> 2. 🔴 **Slide 18 vs. 20**: la lista de estados *(Silberschatz: activa, parcialmente confirmada,
>    fallida, abortada, confirmada)* y el diagrama *(Elmasri-Navathe: activa, parcialmente
>    confirmada, confirmada, fallo, terminar)* no coinciden — *"Abortada"* no está en el diagrama y
>    *"Terminar"* no está en la lista.
> 3. 🔴 **Slide 26 vs. 30**: el 26 define control de versiones como *"las transacciones no utilizan
>    bloqueos"*; el 30 rotula *"Ejemplo de control de versiones en PostgreSQL"* un
>    `SELECT … FOR UPDATE`, que es un bloqueo pesimista idéntico en mecanismo al del slide 29.
> 4. **Slide 25 vs. 29–30 (y MySQL)**: *"nadie más puede leer"* con un *exclusive lock* es el modelo
>    de libro; los motores de los ejemplos e InnoDB son MVCC y las lecturas comunes no se bloquean.
> 5. **Slide 7 (agenda) vs. 8–13**: promete modificación y borrado de cuentas y *"conexiones seguras /
>    SSL"*; no hay `ALTER USER`, `DROP USER` ni una palabra de SSL.
> 6. **Slide 10 vs. 13**: el 10 da una sola granularidad (`base.tabla`); el 13 usa `midb.*` sin
>    explicarla; la granularidad de columna que usa el TP8 no está en ninguno.
> 7. 🔴 **Slide 12 vs. el manual**: *"se deben refrescar … `FLUSH PRIVILEGES`"* tras `GRANT`/`REVOKE`
>    es innecesario; solo hace falta tras editar las tablas `mysql.*` a mano.
> 8. **Slide 28 vs. InnoDB**: *"Repeatable Read … no previene las lecturas fantasma"* es el estándar;
>    en InnoDB *(nivel por defecto)* las lecturas consistentes no muestran *phantoms*.
> 9. **Nombre y tema vs. slides 31–38**: *"Seguridad-Transacciones"* y el cronograma no mencionan
>    índices; ocho slides son de índices y cuatro *(32–35)* llevan el encabezado *"Transacciones en
>    Base de Datos"* por copia y pega.
> 10. 🔴 **Slide 38 vs. InnoDB**: `USING HASH` sobre InnoDB se sustituye por un B-tree *(con
>     *warning*, según el manual § 15.1.18)*; hash real solo en `ENGINE=MEMORY`.
>
> Y del lado del **TP8**, entre el enunciado y el deck: el ej. **2.h** nombra el rol `ins_prov` que
> el ítem g creó como `ins_vol` *(ERROR 3523: h no puede ejecutarse)*; el **1.a** pregunta *"si alguna
> arroja algún error"* y la sentencia 6 falla según la teoría pero pasa en MySQL; el **3.a.2** tiene
> una comilla tipográfica que no parsea; y el deck 11 no trae **nada** de lo que el TP necesita —ni
> grafo de permisos, ni privilegios por columna, ni `REVOKE CASCADE`, ni `PUBLIC`, ni el paso
> `SET DEFAULT ROLE` sin el cual el slide 11 deja a U3/U4 sin privilegios → [[Práctica 2026-09-08]]
> § *Contradicciones internas*.

> [!bug] Las **contradicciones internas de los decks del 14/09** (Clases 12–14) y de sus handouts
> Los tres decks son capturas de al menos dos épocas *(2010 a 2020, según los `ObjectId`)* y **ninguno
> trae versión, bibliografía ni slide de cierre**. Detalle en cada página § *Contradicciones
> internas*; esto es el índice.
>
> **Clase 12** → [[Clase 12 - Introduccion a NoSQL]]
> 1. **Slide 6 vs. su título**: *"Ausencia de esquema"* ilustrado con un `JOIN` materializado
>    *(desnormalización)*; el ejemplo real de *schemaless* es el slide 27. Están intercambiados.
> 2. **Slide 12 vs. 17**: CAP *"afecta a cualquier sistema distribuido"*, pero el 17 ofrece **CA** como
>    opción y la define como *"no se puede permitir el particionado"* — un sistema no distribuido.
> 3. 🔴 **Slide 18 vs. Corbellini Table 2**: MongoDB **CP** en el slide, AP y CP en el paper; Redis
>    **CP** en el slide, AP en el paper *(y CA en Seven Databases A2)*; Memcache aparece en el slide y
>    el paper lo excluye.
> 4. **Slide 26 vs. 29**: *"No existe un esquema estricto"* vs. *"Basada en esquemas BSON"* — BSON es
>    un formato de serialización, no un esquema.
> 5. **Slide 34 vs. 48–49**: comentarios embebidos en el post vs. comentarios en otra colección
>    unidos con `$lookup`: los dos modelos del tema oficial, mostrados sin decir que son alternativas.
> 6. **Slide 38 vs. 39**: el 38 inserta con `_id` explícito *(e inválido: `ObjectId(7df78ad8902c)`,
>    12 hex sin comillas, repetido en 40, 42, 43, 44 y 46)*; el 39 inserta sin `_id` y es la forma
>    correcta; el deck no lo dice.
> 7. **Slides 38–44 vs. 46–47**: el campo autor se llama `by` y después `by_user`: el `$group` del 47
>    no funciona sobre los documentos del 38.
> 8. **Slide 38 vs. 40–44**: inserta `likes: 100` *(número)* y las salidas devuelven `"likes": "100"`
>    *(string)* — imposible en MongoDB, salida escrita a mano; con string el `$gt: 50` del 41 no
>    matchearía.
> 9. **Slide 30**: la viñeta dice *"Replicación para alta disponibilidad"* y el diagrama muestra solo
>    *sharding*; no hay una réplica dibujada en todo el deck.
> 10. **Slide 48 vs. 49**: rótulos `post collection` / `comment collection` y la consulta usa
>     `db.posts` con `from: "comments"` — con los nombres del 48 el `$lookup` devuelve vacío sin
>     error. Ídem slide 51: *"Collection: Survey"* vs. `"survey"` en `createView`.
> 11. Cuatro nombres de colección para el mismo ejemplo: `mycol`, `post`, `posts`, `myCollection`.
> 12. **Slide 11** *"No trata con datos críticos que requieren ACID"* vs. 29–30 *(replicación,
>     tolerancia a fallos)*: no define "crítico" y envejeció — transacciones multi-documento desde 4.0.
>
> **Clase 13** → [[Clase 13 - NoSQL-EmbebidosVSNormalizado]]
> 1. **Tres nombres para el deck**: archivo *"NoSQL-EmbebidosVSNormalizado"*, portada *"MongoDB:
>    Diseño del Modelo de Datos"*, metadato `Title` del PDF *"Introducción a Bases de Datos NoSQL"*
>    *(idéntico al del PDF de la Clase 12)*.
> 2. 🔴 **Slide 13**: título *"one-to-many con documentos embebidos"* sobre un slide que muestra el
>    modelo **con referencias** *(dos direcciones con `patron_id`)*; el embebido recién aparece en el 15.
> 3. **Slide 21**: lista cinco etapas *(Lookup, Sort, Match, Unwind, Project)* y solo `$lookup` se
>    desarrolla *(22–24)*; `$group` no está ni en la lista.
> 4. **Slide 26**: la consigna pide *"el teléfono y el número de cliente"* y la proyección
>    `{codigo_area: 1, nro_telefono: 1}` no incluye ningún número de cliente; además `_id` sale igual
>    porque no se excluye con `_id: 0` *(que sí aparece en el 27)*.
> 5. **Slide 27** titulado *"Lógica de control"* es el snippet de marketing de MongoDB Atlas
>    *(`db.ideal.find(...)` → `{ 'try': 'MongoDB Atlas Today' }`)*, no un ejemplo de la cursada.
> 6. **Slide 5** promete *"una sola operación de escritura atómica"* para el embebido y no dice nada
>    del normalizado *(dos operaciones; transacciones multidocumento no se nombran)*.
> 7. **Slide 8** manda N:M a referencias y el deck no muestra ningún ejemplo de N:M.
> 8. Vocabulario inconsistente para *embedded*: embebido *(3, 5)*, incrustado *(5, 11, 14)*,
>    incorporación *(8)*; *"más óptimo"* [sic] *(14)*.
> 9. **Slide 17**: `author` es arreglo en un libro y string en el otro *(esquema flexible, no
>    señalado)*; `founded: 1980` para O'Reilly *(fundada en 1978)*; slides 13/15, dos ciudades con el
>    mismo `zip: "12345"`.
> 10. **Slide 22**: claves entre comillas salvo `description`, en los seis documentos.
> 11. Imágenes recortadas al pie: slide 20 *(el tercer libro se corta)* y slide 24 *(el resultado se
>     corta en `"_id" : 3,` — justo el caso null/ausente que el ejemplo está armado para mostrar)*.
> 12. El deck termina en el slide 28 con una captura de la documentación, sin resultado ni cierre.
>
> **Clase 14** → [[Clase 14 - MongoDB Features]]
> 1. 🔴 **Slide 10 vs. 11, 25 y 41**: el 10 enseña `mongosh`; los otros tres muestran el shell legado
>    `mongo` *(help de `mongo`, `WriteResult`, `$ mongo localhost:27011`)*.
> 2. **Slide 9 vs. 12, 20 y 23**: `insertOne` vs. `insert()` deprecado.
> 3. **Slide 14 vs. 27, 29 y 34**: el 14 tacha `count()` y muestra `countDocuments()`; los otros
>    vuelven a `count()`.
> 4. **Slide 20**: `db.towns.insert` vs. `db.town.findOne()` / `db.town.find()` — la colección cambia
>    de nombre.
> 5. **Slide 26 vs. 39**: Python 3 *(`print(...)`)* vs. Python 2 *(`print c['name']`)*.
> 6. 🔴 **Slide 2 vs. el resto**: declara MongoDB **6.0.5** y enseña `ensureIndex` *(deprecado 3.0)*,
>    `background: 1` *(sin efecto desde 4.2)*, `system.js.save` *(deprecado 4.2)* y `mapReduce`
>    *(deprecado 5.0)* sin marcarlos.
> 7. **Slides 15 y 16**: la misma colección `internos` con dos conjuntos de campos distintos
>    *(importaciones de 2020 y 2018 según los `ObjectId`)*, sin comentario.
> 8. **Slide 3 vs. 5**: db-engines *(MongoDB #5 y en baja)* vs. LinkedIn *(MongoDB primero en ofertas
>    de empleo)*, sin conciliar.
> 9. **Slide 8**: documenta `toString()` → `ObjectId("...")` *(shell legado)*; en `mongosh` devuelve
>    el hexadecimal.
> 10. **Slide 36**: dice *"ejemplo de la página 120"* y el `runCommand` reproducido está en la 121.
>
> **Handouts** → [[Clase 14 - MongoDB Features]] § *Material complementario del 14/09*
> 1. **Solución**: numeración corrida en uno respecto de la consigna *(sección N+1 = pregunta N)*.
> 2. 🔴 **Solución, pregunta 4**: pide nombre, país y monto; la solución devuelve nombre, **email** y
>    monto — falta el país.
> 3. **Solución, pregunta 2**: con los datos dados hay **empate** *(Auriculares 3, Libro 3)* y
>    `$sort` + `$limit: 1` devuelve uno al azar sin avisar.
> 4. 🔴 **Solución, pregunta 5**: pide órdenes por cliente con nombres de productos; el `$group` final
>    aplana los productos por cliente y pierde la orden, la fecha y la cantidad *(invisible con este
>    dataset porque cada cliente tiene una sola orden)*.
>
> **TP9** → [[Práctica 2026-09-15]] § *Trampas del enunciado*
> 1. **Paso 19 vs. 20**: la prosa dice *"especificar un tercer parámetro en true"* *(firma legacy)* y
>    el código usa `{upsert:true}`; `updateOne(q,u,true)` literal falla en `mongosh`.
> 2. **Paso 19**: *"no tendrá ningún resultado"* — sí lo tiene: `{matchedCount: 0, modifiedCount: 0,
>    upsertedCount: 0}`.
> 3. **Paso 34 vs. 33**: *"veremos el nombre del índice que es usado"* con dos índices candidatos
>    *(`name_1` y `name_1_weight_1`)*: el planificador puede elegir cualquiera.
> 4. **Ejercicio 1**: *"bandas de la Ciudad de Buenos Aires"* y la tabla incluye LA LUCILA, MORENO y
>    BERAZATEGUI; columna *"NOMBRE DEL SOLISTA"* para bandas de hasta 7 integrantes; *"SOLISTA"* como
>    género.
> 5. 🔴 **Ejercicio 1**: EFECTO ALFONS aparece **dos veces** *(fechas y discos distintos)* sin aclarar
>    si son una banda o dos; cambia el ej. 9 *(3 vs. 2)* y el promedio del 10.
> 6. **Ejercicios 10–11** piden `createView` y agrupar/promediar, y ninguno de los 34 pasos enseña
>    `createView` ni `aggregate`.
> 7. **Paso 7 y los 12 inserts del paso 10**: `new Date(año, mes, día)` con el mes 1-based — en
>    JavaScript es 0-based, así que todos los `dob` quedan un mes corridos; David Silva además con día
>    y mes invertidos.

> [!success] La duda más repetida del vault quedó **medio cerrada** el 18/08
> *"¿El TP5 y el parcial son sobre MySQL o sobre PostgreSQL?"* aparecía textualmente en
> [[Clase 08 - Explicando el plan]], [[MySQL]], [[PostgreSQL]],
> [[1.08.01 - Plan de ejecución|Plan de ejecución]] y [[1.08.02 - Índices|Índices]].
> El enunciado del TP5 abre diciendo *"Antes de comenzar, es necesario levantar **MySQL** en la PC
> que vayan a utilizar para este práctico"*: **la mitad TP5 está cerrada**.
> **La mitad parcial no**: el enunciado no lo menciona. Sigue en
> [[Práctica 2026-08-18]] § *Preguntas para el docente*.
>
> **Actualización del 25/08 — el TP6 aporta el dato más informativo hasta ahora, y no es un veredicto:
> es un método.** Su ejercicio 3 pide las sentencias **dos veces**: primero *"en SQL estándar"*
> (punto b) y después *"las que puedan ser soportadas por **MySQL**"* (punto c). O sea que la cátedra
> **sabe** que el material está escrito contra otro motor y **trata las dos cosas como preguntas
> separadas**. Si el parcial sigue el mismo patrón, la respuesta completa es *"en el estándar se
> escribe así, y en MySQL hay que hacer esto otro"*. **Sigue sin confirmarse para el parcial** →
> [[Práctica 2026-08-25]].
>
> **Actualización del 02/09 — el TP7 lo repite dos veces, y con una fórmula más explícita todavía.**
> Ej. **1.c**: *"(aunque **MySQL** no soporta esta última opción, resuelvalo según la teoría)"*.
> Ej. **2.b**: *"for each statement (aunque **MySQL** no lo soporta, responda según la teoría)"*.
> 🎯 **Dos TPs consecutivos con el mismo dispositivo dejan de ser una anécdota: es el método de la
> cátedra** — la teoría en el estándar, la implementación en MySQL, y la brecha **nombrada en el
> enunciado**. Es lo mejor que hay para anticipar cómo viene la pregunta del parcial, y **sigue sin
> decirlo del parcial** → [[Práctica 2026-09-01]].
>
> **Actualización del 08/09 — el TP8 repite el método por tercera vez, y esta vez el desfasaje es de
> modelo, no de una cláusula.** Ej. **1.b**: *"Resuelva el ejercicio desde la teoría, **ya que MySQL
> no provee la opción CASCADE**"*. Ej. **2**: *"En el caso de que MySQL no provee la funcionalidad
> pedida, resuelvalo desde la teoría"*. Tres TPs consecutivos *(TP6 3.b/3.c, TP7 1.c/2.b, TP8 1.b y
> 2)*: **ya es método de la cátedra**. Lo nuevo es que en seguridad **las dos semánticas dan
> respuestas distintas** —MySQL no tiene *owner*, ni `PUBLIC`, ni `CASCADE`, y trata `GRANT OPTION`
> como marca por (cuenta, nivel)—, así que la pregunta *"¿estándar o MySQL en el parcial?"* pasa de
> ser de forma a ser de fondo → [[Práctica 2026-09-08]].
>
> **Actualización del 15/09 — el TP9 es el primer TP donde enunciado y motor coinciden.** Está
> escrito para `mongosh` y se corre en `mongosh`: no hay *"desde la teoría"* porque no hay brecha que
> nombrar. El desfasaje que queda es **de versión** *(`ensureIndex`, `find().count()`, la prosa del
> *upsert* legacy)*, no de motor. Para la segunda mitad la duda cambia de forma: ya no es *"¿qué motor?"*
> sino *"¿qué versión, y se acepta la API legacy de los decks?"* → [[Práctica 2026-09-15]],
> [[MongoDB]]. **Del parcial sigue sin decirse nada.**

## Evaluación

Según el programa: cursada = promedio entre parcial y TP Especial (el **TPO** del cronograma), mínimo
4 en cada uno; final con mínimo 4. Fechas concretas en [[_cronograma]].
