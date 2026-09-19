---
tipo: referencia
resumen: "Registro de qué archivo de raw/ pertenece a qué clase: las 14 teóricas con deck, fecha y síntesis, las prácticas por fecha, el reparto observado de unidades y punteros a dudas y contradicciones. Regla: la clase la numera la cátedra en el nombre del deck; la unidad se observa, no se predice."
formato: indice
---

# Índice de clases — Base de Datos II (72.41)

## Resumen general

Esta página es el registro central de la cursada: qué archivo de `raw/` corresponde a qué clase, y
es el único lugar del vault donde esa correspondencia queda escrita. Reúne tres piezas
independientes: la **clase** (numerada por la cátedra en el nombre del deck, `BD2_Clase NN`), la
**unidad** (la carpeta de `raw/` donde se archivó el material, que agrupa varias clases) y la
**práctica** (identificada por fecha, no por número). Importa para toda la cursada porque documenta
el desfasaje de motor que atraviesa la primera mitad: la materia corre sobre **MySQL**, pero once de
los trece decks teóricos de la `Unidad-01` traen sintaxis de PostgreSQL, Oracle o T-SQL, y la
traducción sintaxis por sintaxis vive en [[MySQL]] y [[PostgreSQL]]. También documenta la
`Unidad-02` (MongoDB), donde el desfasaje es de shell (`mongo` legado vs. `mongosh`) y de versión
(`mapReduce` deprecado desde 5.0).

Reglas clave para no perderse: (1) el número de clase sale siempre del nombre del deck, nunca del
cronograma ni de la fecha; (2) una clase puede repartirse en varias partes (Clase 05, tres archivos)
sin dejar de ser una sola clase, salvo que la cátedra le cambie el número (la "Parte 2" de la
Clase 09 resultó ser la Clase 10, con número propio); (3) varias clases pueden compartir fecha
(01–05, todas el 03/08) o ser asincrónicas (la 05); (4) el reparto unidad → clases se observa
después de que el material llega, nunca se predice con anticipación; (5) los cuatro handouts sin
número del 14/09 no son clases y se documentan como material complementario de esa fecha.

Para el parcial conviene tener presente: qué deck usa qué motor ajeno (tabla de la sección de
desfasaje PostgreSQL/MySQL), el método reiterado de la cátedra de dar la teoría en el estándar SQL
y advertir en el enunciado cuando MySQL no la soporta (TP6 a TP8), y las contradicciones internas
documentadas por clase — en particular las de la Clase 09 (`:new`/`:old` de Oracle filtrado en
PL/pgSQL) y la Clase 11 (estados de transacción según Silberschatz vs. Elmasri-Navathe, aislamiento
real de InnoDB frente al modelo del slide).

## Modelo de la cursada

Mapa de la cursada. Las **fuentes** viven en `raw/` (las cura el humano); las **síntesis** viven en
`wiki/clases/` (las escribe el LLM). El calendario, con fechas y temas, está en **[[_cronograma]]**.

> [!important] El modelo: **clase**, **unidad**, **práctica** son tres cosas distintas
> - **Clase** — la numera **la cátedra**, en el nombre del deck: `BD2_Clase NN` → **Clase NN**. No se
> inventa ni la deduce el cronograma.
> - **Unidad** — es la **carpeta de `raw/` donde se archivó**, y **agrupa varias clases**: hoy
> `raw/Unidad-01/` tiene las **Clases 01 a 11** *(13 archivos de teórica: la 05 va en tres partes)*
> y `raw/Unidad-02/` las **Clases 12 a 14** *(3 decks, más 4 handouts sin número de clase)*.
> Se decide al archivar; se registra después de verla.
> - **Práctica** — **no se numera**: se identifica por **fecha**. La cátedra numera solo las
> teóricas, así que cada práctica se titula por el martes en que se dio
> (`Práctica 2026-08-04`, `Práctica 2026-08-11`, …).
>
> De ahí se siguen dos cosas que rompen la intuición: **varias clases pueden dictarse el mismo día**
> —las Clases 01–05 fueron todas del 03/08— y **alguna puede ser asincrónica** —la Clase 05—.
> Una clase **no** es un día de calendario, y **el path no dice a qué clase pertenece un archivo:
> lo dice esta página.**

## Cómo está organizado `raw/`

```
raw/
├── Unidad-NN/
│  ├── Teorica/  ← lunes 19–22, virtual  (decks BD2_Clase NN)
│  └── Practica/  ← martes 16–19, presencial (deck del día + TPs)
├── Material_Catedra/{programa,bibliografia}/
└── tp/  ← solo el índice; los enunciados van con su unidad
```

Una unidad puede contener **muchas clases**, y todas comparten el mismo `Teorica/` y el mismo
`Practica/`. Cuando entra material de una unidad que ya tiene archivos, hay que anotar acá a qué
clase corresponde cada uno o se pierde el dato. Para arrancar una nota hay plantillas en
`_templates/`.

> [!important] El reparto `unidad → clases` se **observa**, no se predice
> Qué clases van a parar a cada carpeta de unidad lo decide el humano al archivar; el LLM lo registra
> después de verlo. El [[_cronograma]] es autoridad para decir de qué **fecha y tema** es un
> material, pero **no** para decir en qué carpeta de unidad vive. La tabla de § *Unidades* de abajo es
> una previsión útil para orientarse, y su historial de aciertos y fallos está documentado ahí mismo.

## Clases con material

**Catorce** clases, **todas sintetizadas**: las **01 a 11** archivadas en `raw/Unidad-01/Teorica/`
*(13 archivos: la 05 va en tres partes)* y las **12 a 14** en `raw/Unidad-02/Teorica/` *(3 decks, más
los 4 handouts sin número de clase de la tabla siguiente)*.

| # | Unidad | Deck | Slides | Fecha | Tema | Síntesis |
| --- | --- | --- | ---: | --- | --- | --- |
| **01** | U1 | `BD2_Clase 01 - Introducción_BasesDeDatos.pdf` | 14 | 03/08 | Introducción a las Bases de Datos | ✓ [[Clase 01 - Introducción_BasesDeDatos]] |
| **02** | U1 | `BD2_Clase 02 - Modelo Entidad-Relacion.pdf` | 36 | 03/08 | Modelo de Entidades y Relaciones | ✓ [[Clase 02 - Modelo Entidad-Relacion]] |
| **03** | U1 | `BD2_Clase 03 - Derivación a Esquema Lógico.pdf` | 24 | 03/08 | Derivación a esquema lógico relacional | ✓ [[Clase 03 - Derivación a Esquema Lógico]] |
| **04** | U1 | `BD2_Clase 04 - AlteraciónActualizaciónTablas.pdf` | 9 | 03/08 | Alteración y actualización de tablas | ✓ [[Clase 04 - AlteraciónActualizaciónTablas]] |
| **05** | U1 | `BD2_Clase 05 - Consultas de Datos–Parte 1.pdf`<br>`… – Parte 2.pdf`<br>`… – Parte 3.pdf` | 36<br>36<br>16 | 03/08<br>**asincrónico** | Consultas de datos — SELECT/WHERE/NULL/ORDER BY · joins, GROUP BY, subconsultas · alias, CONCAT, agregación | ✓ [[Clase 05 - Consultas de Datos–Parte 1]]<br>✓ [[Clase 05 - Consultas de Datos–Parte 2]]<br>✓ [[Clase 05 - Consultas de Datos–Parte 3]] |
| **06** | U1 | `BD2_Clase 06 - Vistas-Parte 1.pdf` | 18 | 10/08 | Vistas — concepto, `CREATE VIEW`, esquema externo | ✓ [[Clase 06 - Vistas-Parte 1]] |
| **07** | U1 | `BD2_Clase 07 - Vistas-Parte 2.pdf` | 22 | 10/08 | Vistas — actualizabilidad, `CHECK OPTION`, materializadas | ✓ [[Clase 07 - Vistas-Parte 2]] |
| **08** | U1 | `BD2_Clase 08 - Explicando el plan(1).pdf` | 22 | 10/08 | Índices y plan de ejecución — `EXPLAIN` | ✓ [[Clase 08 - Explicando el plan]] |
| **09** | U1 | `BD2_Clase 09 - Restricciones integridad-Parte 1.pdf` | 39 | 24/08 | Restricciones de integridad — RIRS, acciones referenciales, matching, `CHECK`/`DOMAIN`/`ASSERTION` y **triggers** | ✓ [[Clase 09 - Restricciones integridad-Parte 1]] |
| **10** | U1 | `BD2_Clase 10 - Restricciones integridad-Parte 2.pdf` | 20 | 31/08 | **SQL procedural** — stored procedures, funciones, **cursores** · los cuatro niveles de restricción (atributo, fila, tabla, `ASSERTION`) | ✓ [[Clase 10 - Restricciones integridad-Parte 2]] |
| **11** | U1 | `BD2_Clase 11 - Seguridad-Transacciones.pdf` | 38 | 07/09 | **Seguridad** — amenazas, autenticación/autorización, cifrado; usuarios `'u'@'h'`, `GRANT`/`REVOKE`, roles · **transacciones ACID**, estados, concurrencia, locking/OCC/timestamps, niveles de aislamiento · **índices** *(slides 31–38, un tercer bloque que ni el nombre ni el cronograma anuncian)* | ✓ [[Clase 11 - Seguridad-Transacciones]] |
| **12** | **U2** | `BD2_Clase 12 - Introduccion a NoSQL.pdf` | 52 | 14/09 | **Introducción a NoSQL** — por qué surge, propiedades, teorema CAP, BASE, taxonomía (clave-valor, documental, columnar, grafos) · **introducción a MongoDB**: arquitectura, CRUD en el shell, operadores, `aggregate`, `$lookup`, vistas | ✓ [[Clase 12 - Introduccion a NoSQL]] |
| **13** | U2 | `BD2_Clase 13 - NoSQL-EmbebidosVSNormalizado(1).pdf` | 28 | 14/09 | **MongoDB: diseño del modelo de datos** — documentos embebidos vs. referencias, relaciones 1:1, 1:N y N:M, `$lookup`, `find` con proyección, `explain` | ✓ [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] *(el `(1)` es artefacto de descarga: se cae del nombre de la página, no del `deck:`)* |
| **14** | U2 | `BD2_Clase 14 - MongoDB Features.pdf` | 45 | 14/09 | **MongoDB Features** — `ObjectId`, `mongosh` y herramientas de línea de comando, `mongoimport`, CRUD, índices, aggregation pipeline, **MapReduce**, `system.js`, pymongo, **replica sets** y **sharding** | ✓ [[Clase 14 - MongoDB Features]] *(incluye § *Material complementario del 14/09*: los 4 handouts)* |

> [!note] 14/09 — **tres clases en un solo lunes**, y la 11 sola el 07/09
> El cronograma tiene **una fila** para el 14/09 y la cátedra numeró **tres decks** para esa fila:
> `BD2_Clase 12`, `13` y `14`. El deck 12 cubre los dos primeros tramos del tema oficial *(intro
> NoSQL y tipos · intro a MongoDB)*, el 13 el tercero *(embebido vs. normalizado)* y el 14 el cuarto
> *(ejemplos con MongoDB)*: **una fila del cronograma no es una clase**, mismo patrón del 03/08 y del
> 10/08. El 07/09, en cambio, fue una sola: la **Clase 11**.
>
> La Clase 11 repite lo del deck 10: el nombre —*"Seguridad-Transacciones"*— y el tema del
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
> Los cuatro son de mayo de 2025, no de este cuatrimestre. Pendiente preguntar al humano si se
> repartieron ese día o vienen de otra cursada, y si la solución se discutió en clase con sus
> respuestas incompletas → [[Clase 14 - MongoDB Features]] § *Dudas abiertas*.

> [!warning] La Clase 10 se llama *"Restricciones integridad-Parte 2"* y **su portada dice otra cosa**
> El nombre del archivo hereda el de la Parte 1, pero el **slide 1 dice literalmente
> *"Base de Datos II · SQL PROCEDURAL · Triggers, Stored Procedures"***, y **doce de sus veinte
> slides son eso — los 2 a 13**: el marco conceptual del SQL procedural *(2–5)* y PL/pgSQL de punta a
> punta *(6–13: `CREATE FUNCTION`, variables, cursores, `RETURNS TABLE`)*. Las restricciones vuelven
> recién en los slides 14–19, y **son la jerarquía de la Clase 09 con otro vocabulario** *(atributo ·
> fila · tabla · generales)*, no material nuevo. Por eso el tema de la fila es *SQL procedural* y no
> *restricciones*: el nombre del archivo se conserva —es la regla del vault— pero **no describe el
> contenido**.
>
> Y a la inversa: **el deck no trae ni un solo `CREATE TRIGGER`**. Se titula *"Triggers"* y
> **presupone** el vocabulario que dio la Clase 09 en sus slides 25–38, sin repetirlo.

> [!note] El sufijo `Parte N` **no dice nada sobre identidad de clase**
> La Clase 09 anunciaba una "Parte 2" propia; llegó con número nuevo — es la **Clase 10**. La regla de
> `CLAUDE.md` *"un deck partido en varios archivos es una sola clase"* sigue siendo correcta, pero lo
> que la hace verdadera en `BD2_Clase 05 Parte 1/2/3` es que **el número es el mismo**, no que diga
> *"Parte"*: la premisa siempre es el `NN`, nunca el sufijo.

> [!note] La Clase 05 es **una clase repartida en tres archivos**, no tres clases
> `Parte 1/2/3` son partes del mismo deck `BD2_Clase 05`: son **88 slides**, más que las Clases 01–04
> juntas. Tienen una página cada una porque el volumen lo pide, pero la clase es una sola, y fue
> **asincrónica**. La secuencia 02 → 03 → 04 → 05 es **modelar → derivar a tablas → modificar →
> consultar**.

> [!warning] El desfasaje **PostgreSQL / MySQL** no es un caso aislado del deck 04
> Once de los trece decks de teórica traen marcas de otro motor, **uno no trae ninguna** —la Clase
> 02— y **uno trae sólo una atribución histórica** —la Clase 06—. Una fila por archivo: el *"no hay"*
> también es dato. **Los decks 12–14 no entran en esta tabla**: son MongoDB, el motor correcto de la
> segunda mitad; su desfasaje es de *shell* y de versión, no de motor *(ver la nota al pie)*.
>
> | Archivo | Motor ajeno | Evidencia verificada — slide y cita textual |
> | --- | --- | --- |
> | `BD2_Clase 01` | **PostgreSQL** | Slide 12, título *"QUÉ ES POSTGRESQL?"*, viñeta *"Primera versión de PostgreSQL liberó en 1997"*. Slide 13, *"ARQUITECTURA DE POSTGRESQL"* — el diagrama es **imagen**, y renderizado muestra `Postmaster` → `Postgres`, con `postgresql.conf`, `pg_hba.conf`, `pg_ident.conf`, *"PostgreSQL Share Buffer Cache"*, *"Write-ahead log (WAL)"* y flechas `FSYNC`. Es **identidad de motor, no sintaxis**: el deck no trae **una sola** sentencia SQL. Contrapunto MySQL en el slide 2, *"Herramientas"*: *"MySQL Workbench Community Edition"* · *"XAMPP"* · *"MongoDB"* |
> | `BD2_Clase 02` | — | **Verificado que no hay.** Cero coincidencias de motor y **cero SQL** en toda la capa de texto: es DER puro. El slide 6, el único de texto fino, renderizado es el diagrama *"ETAPAS EN EL DISEÑO DE DATOS"* (UdeD → Diseño Conceptual → Diseño Lógico → Esquema Físico), sin tipos de datos |
> | `BD2_Clase 03` | **PostgreSQL** | Slide 10, *"TIPOS DE DATOS"*, cuerpo: *"Tipos de datos Postgresql"* + `https://www.postgresql.org/docs/9.5/static/datatype.html`. Slide 23, *"SENTENCIA CREATE TABLE"*: el *synopsis* es el de PostgreSQL — `UNIQUE index_parameters \| PRIMARY KEY index_parameters`, `DEFAULT default_expr`, `REFERENCES reftable [ ( refcolumn ) ]`. **`index_parameters` no existe en la gramática de MySQL** |
> | `BD2_Clase 04` | **PostgreSQL** | El más explícito del vault sobre su propio motor. Slide 3, declarado **en el cuerpo**: *"…incorporar restricciones o quitarlas, etc. **La sintaxis de PostgreSQL**"*, y debajo `ALTER TABLE tabla ALTER COLUMN columna [SET DEFAULT value \| DROP DEFAULT]` y `[SET NOT NULL \| DROP NOT NULL]`. Slide 7: `DROP TABLE nombre_tabla [CASCADE \| RESTRICT]` |
> | `BD2_Clase 05` **Parte 1** | **PostgreSQL + Oracle** | **PostgreSQL** en el *título* de dos slides: 21 y 22, *"LIMIT and OFFSET (PostgreSQL)"* — el 21 da `[LIMIT {numero \| ALL}] [OFFSET numero];` y el 22 el ejemplo `LIMIT ALL` / `OFFSET 15;`, que **no compilan en MySQL**. Slide 35, screenshot: `ERROR:  aggregates not allowed in WHERE clause at character 105` — redacción de PostgreSQL. (clave) **ORACLE**: el slide 5, *"Esquema Ejemplo DERE BD Voluntarios"*, es **una imagen que `pdftotext` no lee**; renderizada, declara `nombre_continente: VARCHAR2(25) NULL`, `id_direccion: NUMBER(4) NOT NULL`, `horas_aportadas: NUMBER(8,2) NULL`, `porcentaje: NUMBER(2,2) NULL`, `id_tarea: VARCHAR2(10) NOT NULL`, `nombre_institucion: VARCHAR2(60) NOT NULL` |
> | `BD2_Clase 05` **Parte 2** | **Oracle** | (clave) **Slides 4 y 8, imágenes** — los dos traen un **recorte del mismo diagrama** *"Esquema Ejemplo DERE BD Voluntarios"* del slide 5 de la Parte 1, con sus tipos de **Oracle**: `id_direccion: NUMBER(4) NOT NULL`, `calle: VARCHAR2(40) NULL`, `codigo_postal: VARCHAR2(12) NULL`, `id_pais: CHAR(2) NOT NULL`, `nombre_institucion: VARCHAR2(60) NOT NULL`, `horas_aportadas: NUMBER(8,2) NULL`, `porcentaje: NUMBER(2,2) NULL`. En el texto del deck **no se nombra ningún motor**: el único backtick del archivo es **tipográfico** —slide 29, *"a menos que éste sea `` `*´ ``"*—. Y las dos cosas que no corren igual en MySQL son SQL estándar y **no delatan motor**: slide 29, *"Para ORDER BY, null es el 'mayor'"* (en MySQL los `NULL` van **primero** en `ASC`), y **`FULL JOIN`**, que MySQL no tiene — slide 31 lo lista, y el 21 (imagen, renderizado) trae `FROM nacional N FULL JOIN internacional I ON (…)` |
> | `BD2_Clase 05` **Parte 3** | **T-SQL/SQL Server + MySQL** | **No** Oracle ni PostgreSQL: cero apariciones de las dos, y el archivo **no tiene ninguna imagen embebida**, así que la capa de texto es exhaustiva. **T-SQL**: slide 9, *"Sentencia TOP"* con `SELECT top 3 nombre, apellido`; slide 14 `DATEPART(partedefecha,fecha)` con `SELECT datepart(month,getdate())`; slide 15 `DATENAME`; slide 16 `DATEDIFF (partedelafecha,fecha1,fecha2)` — **firma de tres argumentos**, la de MySQL toma dos; slide 5, alias asignado con `=` (`SELECT producto, "rango de precios" = CASE …`); slide 7, `LIKE 'A[nm]%'` y `LIKE '[-acfi]%'` — clases de caracteres que **sólo existen en SQL Server**. **MySQL**: backticks de *quoting* (slide 6 `` FROM `ventas` ``, slide 10 `` ORDER BY `fecha` ``) y slide 10 `LIMIT 0 , 30`, la forma `LIMIT offset,count` que **no existe en PostgreSQL** |
> | `BD2_Clase 06` | *(sólo histórica)* | **Sin sintaxis de otro motor.** La única aparición de un motor en todo el deck es el slide 11, y es **atribución histórica, no sintaxis**: *"Este concepto ha sido explicado por distintos autores (ej: Date), aplicado por el estándar SQL como forma de operar, y **popularizado por Oracle** que lo implementó y denominó propiedad 'key-preserved'"* |
> | `BD2_Clase 07` | **PostgreSQL** *(+ `:new` de Oracle)* | Slide 21, título *"Vistas Materializadas - **PostgreSQL**"*, con `CREATE MATERIALIZED VIEW view_name AS query WITH [NO] DATA;` y la glosa *"view_name is the name of your materialized view **in Postgres**"*. Slide 12, cierre: *"(en **PostgreSQL** la función podría implementar el comportamiento para todos los eventos)"* — y su trigger, **rotulado en el propio slide como *"sintaxis SQL estándar"***, escribe `:new.nro_al` / `:new.id_tutor`, que son de **Oracle** *(el mismo choque que el deck 09 § contradicciones)*. Contrapunto MySQL: slides 13–16, *"Vistas Actualizables en MySQL"* |
> | `BD2_Clase 08` | **PostgreSQL puro** | Slide 1: `EXPLAIN ANALYZE`, el link `https://www.postgresql.org/docs/current/sql-explain.html`, *"By default (without BEGIN), **PostgreSQL** executes transactions in 'autocommit' mode"* y `SELECT relpages, reltuples FROM pg_class WHERE relname = 'table';`. Slide 9: `seq_page_cost = 1` y `(páginas * seq_page_cost) + (tuplas_a_retornar * cpu_tuple_cost)`. **Veintidós slides, y `EXPLAIN` aparece en diecinueve**: no está en el **8**, el **9** ni el **11** —sin imagen embebida, capa de texto exhaustiva—; en el **5** no está en el texto pero **sí dentro de la imagen**, el tooltip *"Explain query"* de pgAdmin |
> | `BD2_Clase 09` | **PostgreSQL** | Slide 12: *"MATCH SIMPLE (Opción por defecto para SQL estandar **y PostgreSQL**)"*. Slide 27, título: ***"TRIGGERS – SINTAXIS PostgreSQL"***. Slide 36 es **PL/pgSQL**: `CREATE FUNCTION cant_total_empleados ( ) RETURNS trigger AS $body$` con `TG_OP`. Slide 39, primera fuente de la bibliografía: *"Capitulo 36 del Manual de POstgreSQL . www.postgresql.org"* |
> | `BD2_Clase 10` | **PostgreSQL + Oracle** | (clave) **El más denso del vault**, y el único donde el motor ajeno **es el contenido**, no un ejemplo suelto: **ocho slides —del 6 al 13— se titulan *"Procedimientos/Funciones en Postgres"***. Slide 6, cuerpo: *"Para **Postgres** todos son funciones, sólo que hay funciones que devuelven void ( Procedimientos )"*, con `RETURNS tipo AS $$ … $$ LANGUAGE plpgsql ;`. Slide 8: `ALIAS FOR $1`, `CONSTANT`, `voluntario%rowtype`, `voluntario.nombre%type`. Slides 9–11: *"Todo el acceso a cursores en **PL/pgSQL** … del tipo de datos especial **refcursor**"*, y la variable `FOUND`. Slides 12–13: `RETURNS TABLE(…)`, `RETURN QUERY`, `RETURN NEXT`, `record`. Slide 20: `postgresqltutorial.com` y `postgresql.com` *(sic — el sitio es `.org`)*. (nota) **ORACLE** en el slide 17: `having avg( **months_between ( sysdate**, fecha_nacimiento ) )` — ninguna de las dos existe en PostgreSQL ni en MySQL —, y en el slide 9 `curs3 CURSOR (key int) **IS** SELECT …`, donde el `IS` es PL/SQL y **contradice la gramática que el mismo slide da cuatro líneas más arriba** (`… CURSOR [ ( argumentos ) ] **FOR** select_query ;`) |
> | `BD2_Clase 11` | **MySQL por defecto** *(+ SQL Server y PostgreSQL, **rotulados**)* | (clave) **Primer deck de la U1 escrito en el motor de la cursada.** Slide 7, título *"Mecanismos de Seguridad (MySQL)"*; slide 8, *"Un usuario MySQL se define…"* y *"El superusuario se denomina ROOT"*; slides 9, 11 y 13, cuentas `'usuario'@'host'` con el comodín `'%'`; slide 11, los roles de MySQL 8.0+ copiados del manual § *Using Roles* (`dev1`/`dev1pass`/`app_developer`); slides 12–13, `FLUSH PRIVILEGES;` *(solo MySQL)*; slides 36–37, la § 10.3.9 del *MySQL Reference Manual* *(Comparison of B-Tree and Hash Indexes)* traducida a medias con el operador `<=>`, que solo existe en MySQL; slide 38, *"Ejemplo en MySQL: `CREATE INDEX MYINDEX ON USERS (DNI) USING HASH;`"*. **El motor ajeno son dos ejemplos que el propio deck rotula**: slide 29, *"-- Ejemplo de bloqueo en SQL Server"* (`BEGIN TRANSACTION; SELECT * FROM productos WITH (UPDLOCK); … COMMIT TRANSACTION;`) y slide 30, *"-- Ejemplo de control de versiones en PostgreSQL"* (`BEGIN; SELECT * FROM productos FOR UPDATE; … COMMIT;`) — este último **corre en MySQL sin cambios**. Sin rótulo y **no corre en MySQL**: slide 35, `drop index <nombre-índice>` sin `ON tabla`, e identificadores con guion *(`índice-s`, `nombre-sucursal`)* sin backticks |
>
> **Recuento verificado slide por slide.** Deck 10 *(20 renders)*: 10 PostgreSQL · 2 Oracle *(9 y
> 17)* · 8 estándar o sin motor · **0 MySQL** —cero backticks, cero `DELIMITER`, cero `SIGNAL`—; sus
> imágenes son decoración y tres diagramas *(16, 18)* sin tipos de dato. (clave) El slide 2 advierte
> *"cada proveedor de BD tiene su propio lenguaje procedural"* y **los once slides siguientes enseñan
> el de un proveedor que la cursada no usa**. Deck 11 *(38 renders)*: 10 MySQL explícito *(7 a 13, 36
> a 38)* · 1 SQL Server *(29)* · 1 PostgreSQL *(30)* · 26 estándar o sin motor — **primer deck donde
> el motor ajeno es un ejemplo rotulado y no el contenido**. Lo grave del deck 11 es otra cosa:
> **cero transacciones en MySQL** —ni `START TRANSACTION`, ni `ROLLBACK`, ni `autocommit`, ni
> `SET TRANSACTION ISOLATION LEVEL`, ni el dato de que InnoDB arranca en `REPEATABLE READ`—; eso vive
> en [[MySQL]] § *8 · Transacciones*.
>
> **Los decks 12–14 (MongoDB) quedan fuera del inventario**: el motor es el correcto; lo que traen es
> la **API legacy del shell `mongo`** (`insert`, `count`, `update({multi:true})`, `remove`,
> `ensureIndex`, `.pretty()`), `mapReduce` **deprecado desde 5.0**, `ObjectId` de 12 hex inválidos en
> el deck 12 y un deck 14 fechado en septiembre de 2023 con *"Stable release 6.0.5"*. El deck 12
> trae un `CREATE TABLE` que mezcla MySQL (`MEDIUMINT`, `AUTO_INCREMENT`) y Oracle (`Number`)
> —heredado del *SQL to MongoDB Mapping Chart* oficial— y el 13 es **el primer deck teórico del vault
> sin ninguna marca de motor ajeno**. Detalle en [[MongoDB]].
>
> **Los enunciados de práctica nombran el desfasaje por escrito, y cada vez con más peso.** TP6 3.b/3.c
> pide las sentencias primero *"en SQL estándar"* y después *"las que puedan ser soportadas por
> MySQL"*. TP7 1.c y 2.b: *"aunque MySQL no soporta esta última opción/no lo soporta, resuelva/responda
> según la teoría"* — cero apariciones de PostgreSQL, Oracle o SQL Server en las dos páginas. TP8
> 1.b y ej. 2: *"ya que MySQL no provee la opción CASCADE"* / *"si MySQL no provee la funcionalidad
> pedida, resuélvalo desde la teoría"* — acá el desfasaje ya es **de modelo de seguridad**, no de una
> cláusula: MySQL no tiene *owner*, ni `PUBLIC`, ni `CASCADE`, y trata `GRANT OPTION` como marca por
> (cuenta, nivel). **Tres TPs consecutivos con el mismo dispositivo son método de la cátedra**: teoría
> en el estándar, implementación en MySQL, brecha nombrada en el enunciado. El **TP9**, en cambio, es
> el **primer TP donde enunciado y motor coinciden**: escrito para `mongosh`, se corre en `mongosh`,
> sin *"desde la teoría"* porque no hay brecha que nombrar; el desfasaje que queda ahí es de
> **versión** (`ensureIndex`, `find().count()` deprecados). Detalle en [[Práctica 2026-09-01]],
> [[Práctica 2026-09-08]], [[Práctica 2026-09-15]]. **Del parcial no hay confirmación de qué motor
> toma** → ver § *Dudas abiertas*.
>
> Evidencia mínima de la Clase 07 (slide 21 y slide 12), verificable con un `grep` sobre la capa de
> texto —sin renderizar nada—, y el mismo diagrama de Voluntarios de la Parte 1 reaparece recortado en
> las **slides 4** y 8 de la Parte 2:
>
> ```
> $ pdftotext -layout "BD2_Clase 07 - Vistas-Parte 2.pdf" - | grep -i postgres
> (en PostgreSQL la función podría implementar el comportamiento para todos los eventos)
> Vistas Materializadas - PostgreSQL
> •  view_name is the name of your materialized view in Postgres
> •  … If we need it while creating a Postgres materialized view, we specify the WITH DATA parameter
> ```
>
> La cursada corre sobre **MySQL** y `esq_peliculas.sql` usa `DROP FOREIGN KEY`, que es MySQL.
> El inventario completo de qué es de cada motor está en [[PostgreSQL]]; la traducción, en [[MySQL]].
> Mapeo de bibliografía en [[_index-bibliografia]] § 2.

> [!warning] El deck 08 no da teoría de índices
> El cronograma anuncia *"Índices / Explain Plan"*, pero el deck es **una transcripción de sesión de
> consola sobre `EXPLAIN`**: los índices aparecen solo por evidencia empírica. No hay B-tree por
> dentro, ni tipos de índice, ni criterios de cuándo crear uno. Está documentado arriba de todo en
> [[1.08.02 - Índices|Índices]].
>
> **La teoría llegó cuatro semanas después, sin anuncio.** Los slides 31–38 de la
> [[Clase 11 - Seguridad-Transacciones]] traen B-tree vs. hash, índices con y sin agrupación,
> multinivel y `CREATE INDEX` / `DROP INDEX`; [[1.08.02 - Índices|Índices]] ya los incorpora
> (`clases: [8, 11]`). Siguen sin darse bitmap, índices multidimensionales, el criterio de selección
> y el costo en escrituras.

## Prácticas

Indexadas **por fecha**, no por número: la cátedra no las numera. Las del 04/08 al 08/09 están en
`raw/Unidad-01/Practica/`; la del **15/09** es la **primera de la `Unidad-02`**, en
`raw/Unidad-02/Practica/`.

| Fecha | Material | TPs | Síntesis |
| --- | --- | --- | --- |
| **martes 04/08** | `BDD II - Clase I.pdf` · `esq_peliculas.sql` · `Resoluciones/` (`TP1.md`, `image.png` — propios del humano) | TP1 Modelos · TP2 Creates · TP3 SQLs simples | ✓ [[Práctica 2026-08-04]] |
| **martes 11/08** | `ITBA TP 4 Vistas.pdf` | TP3 SQLs avanzados *(sin archivo todavía)* · TP4 Vistas | ✓ [[Práctica 2026-08-11]] |
| **martes 18/08** | `ITBA TP 5 Explain Plan.pdf` · `materia.csv` · `inscripto.csv` | TP5 Explain Plan | ✓ [[Práctica 2026-08-18]] |
| **martes 25/08** | `ITBA TP 6 Restricciones Declarativas.pdf` *(5 págs., sin dataset)* | TP6 Restricciones declarativas | ✓ [[Práctica 2026-08-25]] |
| **martes 01/09** | `ITBA TP 7 Restricciones Avanzadas.pdf` *(2 págs., sin dataset nuevo — **reusa `esq_peliculas.sql`**)* | TP7 Restricciones avanzadas | ✓ [[Práctica 2026-09-01]] |
| **martes 08/09** | `ITBA TP 8 Seguridad.pdf` *(3 págs., **sin dataset** — **tres esquemas propios**, dos como imagen y uno como línea de texto; no reusa `esq_peliculas.sql`)* | TP8 Seguridad | ✓ [[Práctica 2026-09-08]] |
| **martes 15/09** | `ITBA TP 9 - MongoDB Parte I.pdf` *(7 págs., **`raw/Unidad-02/Practica/`** — los datos van **dentro del PDF**: 12 `insert` como comandos en pp. 2–3 y la tabla de bandas del ej. 1 **solo como imagen** en p. 7)* | TP9 MongoDB Parte I | ✓ [[Práctica 2026-09-15]] |

Los enunciados de los TPs están en la carpeta de la unidad, junto al deck del día; `raw/tp/` guarda
solo el índice. La semana del 18/08 **no tiene teórica**: el lunes 17/08 es feriado.

**Ninguna de las prácticas del 11/08, 18/08, 25/08 ni 01/09 trae deck de slides**: la cátedra entregó
solo el enunciado —y, el 18/08, además los dos CSV—. El único deck de práctica del vault sigue siendo
`BDD II - Clase I.pdf`, del 04/08. Tampoco las del **08/09** ni el **15/09** traen deck: el TP8 son
tres páginas de enunciado y el TP9, siete páginas con los datos adentro.

> [!note] El TP6 es el primero que **no necesita motor**
> Los TP4 y TP5 se resolvían tipeando. El **TP6 no trae ningún `.sql` ni CSV**, sus tres esquemas
> están **solo como imagen**, y sus dos primeros ejercicios piden *"indique el resultado"* — razonar
> la traza, no ejecutarla. Buena parte de lo que pide **no corre en MySQL**: los tipos de matching se
> ignoran y `CREATE ASSERTION` no existe. **Solo el ejercicio 3.c es ejecutable.** Detalle en
> [[Práctica 2026-08-25]].

> [!note] El TP7 vuelve al motor y reusa `esq_peliculas.sql`
> Sus ejercicios 1 y 3 arrancan *"Según el esquema de Películas, del TP 3 - SQL Simples"*, y el 4 usa
> *"el esquema A del ejercicio 3 del TP 6"*: no trae dataset nuevo, pero sí tiene qué ejecutar. Los dos
> puntos que quedan de lápiz y papel son **1.c y 2.b** (`FOR EACH STATEMENT`), y esta vez el enunciado
> avisa que MySQL no lo tiene. Detalle en [[Práctica 2026-09-01]].

> [!note] El TP8 vuelve al lápiz y papel, **por decisión del enunciado**
> **No trae dataset** y es el segundo TP seguido que no toca `esq_peliculas.sql`: sus tres esquemas
> son propios —dos como imagen y uno como línea de texto—, y el del ej. 2 es exactamente el ERD de
> Voluntarios del slide 5 de la Clase 05. De sus **18 ítems**, tres son *"desde la teoría"* por el
> propio enunciado *(1.b, 2.d, 2.f)*, uno es inejecutable como está *(2.h, rol `ins_prov` que nunca
> se creó)*, uno usa `REVOKE … CASCADE` sin aviso *(3.b.2)* y el 1.a da un resultado distinto en
> MySQL que en la teoría. Detalle en [[Práctica 2026-09-08]].

> [!note] El TP9 es el **primero fuera de MySQL**, y el datos-a-mano llega a seis TPs seguidos
> Está escrito para **`mongosh`** y se corre en `mongosh`: no hay traducción de sintaxis que hacer.
> `docker pull mongo` va **sin tag** *(la práctica del 04/08 fijaba `mysql:9.7.2`)*. **Sexta vez que
> hay que tipear los datos a mano** *(TP4 a TP9)* y cuarta con datos o esquemas **solo como imagen**
> *(TP4, TP6, TP8, TP9)* — conteo de `raw/tp/_index.md`. Los ejercicios 10–11 piden `createView` y
> `aggregate`, que ninguno de los 34 pasos guiados enseña. Detalle en [[Práctica 2026-09-15]].

> [!missing] Falta `Clase I.md`, nota propia del humano de la primera semana
> Estaba en la vieja `Clases/…/Clase-01/Teorica/` y no aparece en `raw/Unidad-01/`. Sus definiciones
> de **programación políglota** y **persistencia políglota** quedaron citadas dentro de
> [[Práctica 2026-08-04]] § *Marco conceptual*, así que el contenido no se perdió, pero el original
> sí. Si se recupera, va en `raw/Unidad-01/Practica/`, que es donde cae ese tema.

## Unidades

Dos unidades tienen material y se observan: **`Unidad-01` = Clases 01 a 11 + TP1 a TP8** *(13
archivos de teórica)* y **`Unidad-02` = Clases 12 a 14 + los 4 handouts + TP9 Parte I**, abierta el
**15/09**. `raw/Unidad-03` … `raw/Unidad-10` **todavía no existen**: la carpeta de unidad (con su
`Teorica/` y `Practica/`) la crea el humano cuando archiva el primer material.

| Unidad | Temas previstos | Cuándo |
| --- | --- | --- |
| `Unidad-01` | ✓ **observado**: Clases **01 a 11** *(todo lo relacional: intro, DER, DDL, SQL, vistas, índices/explain, restricciones, SQL procedural, **seguridad, transacciones ACID e índices**)* · TP1 a **TP8** | 03/08 → 08/09 |
| `Unidad-02` | ✓ **observado**: Clases **12 a 14** *(NoSQL, CAP/BASE, MongoDB: embebido vs. normalizado, features)* · 4 handouts sin número · **TP9 Parte I** | 14/09 → 15/09 *(y previsión: TP9 Parte II el 22/09)* |
| `Unidad-03` a `Unidad-05` | Sin nada previsto: los temas que se les había asignado *(restricciones/TP6, triggers-SQL procedural/TP7, seguridad-ACID/TP8, NoSQL-MongoDB/TP9)* cayeron todos en `Unidad-01` o `Unidad-02` — ver tabla de predicciones abajo | — |
| `Unidad-06` | *(previsión)* Cassandra · TP10 (I y II) · (clave) **parcial el 13/10** | 28/09 · 05/10 |
| `Unidad-07` | *(previsión)* Neo4j · TP11 | 19/10 |
| `Unidad-08` | *(previsión)* Redis · TP12 | 26/10 |
| `Unidad-09` | *(previsión)* Amazon DynamoDB · TP13 · (clave) **recuperatorio el 03/11** | 02/11 |
| `Unidad-10` | *(previsión)* TPO: enunciado 09/11 · entrega 15/11 · defensas 16, 17 y 24/11 | 09/11 → 24/11 |

> [!warning] Reparto `unidad → clases`: siete predicciones puestas a prueba, y solo una acertó
> La previsión inicial asignaba una unidad por tema del cronograma (`Unidad-02` para el 10/08,
> `Unidad-03` para restricciones/triggers, `Unidad-04` para seguridad, `Unidad-05` para NoSQL). El
> material real fue cayendo distinto:
>
> | # | Previsión | Material que la puso a prueba | Dónde cayó | Resultado |
> | :---: | --- | --- | --- | :---: |
> | 1 | teórica del 10/08 → `Unidad-02` | Clases 06, 07 y 08 | `Unidad-01` | ✗ falló |
> | 2 | práctica del 18/08 → *"puede caer también en `Unidad-01`"* | TP5 + los dos CSV | `Unidad-01` | ✓ acertó |
> | 3 | teórica y práctica del 24–25/08 → `Unidad-03` | Clase 09 · TP6 | `Unidad-01` | ✗ falló |
> | 4 | teórica del 31/08 → `Unidad-03` | Clase 10 | `Unidad-01` | ✗ falló |
> | 5 | práctica del 01/09 → `Unidad-03` | TP7 | `Unidad-01` | ✗ falló |
> | 6 | teórica y práctica del 07–08/09 → `Unidad-04` *(seguridad, ACID, TP8)* | Clase 11 · TP8 | `Unidad-01` | ✗ falló |
> | 7 | teórica y práctica del 14–15/09 → `Unidad-05` *(NoSQL, MongoDB, TP9)* | Clases 12, 13 y 14 · 4 handouts · TP9 Parte I | `Unidad-02` | ✗ falló |
>
> Las seis fallidas tienen la misma forma: se asignaba una unidad **por tema del cronograma** y la
> cátedra archiva con otro criterio. La hipótesis que sí se sostuvo, confirmada con el corte del
> 14–15/09, es **"la `Unidad-01` es todo lo relacional"**: lo relacional (Clase 11, TP8) fue a la
> `Unidad-01`, y lo NoSQL (Clases 12–14, TP9) abrió la `Unidad-02`. Lo que **no** dice es cómo se
> reparten las unidades que vienen: Cassandra, Neo4j, Redis y DynamoDB pueden ser cuatro unidades, una
> sola, o seguir en la `Unidad-02`. Con solo dos unidades observadas, la lectura más simple —**una
> unidad por motor** (U1 relacional, U2 MongoDB)— haría caer Cassandra en `Unidad-03` y no en la
> `Unidad-06` de la tabla, pero es otra previsión: se confirma cuando entre el deck del 28/09.

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
| [[Práctica 2026-08-18]] § *Preguntas para el docente* | TP5: ~~(crítico) la **sintaxis MySQL de `CREATE INDEX`**~~ ✓ **cerrada** *(Clase 11, slides 35 y 38; ya está en [[1.08.02 - Índices\|Índices]] y en [[MySQL]] § 4)*; el *Form Editor* de Workbench, el índice clustered de InnoDB, si el **parcial** se rinde sobre MySQL |
| [[Clase 09 - Restricciones integridad-Parte 1]] § *Dudas abiertas* | ~~cuándo llega la **Parte 2**~~ ✓ **cerrada** *(es la **Clase 10**, no la misma 09)*. Siguen: si el parcial toma sintaxis del estándar o de MySQL, `:new`/`:old` vs. `new.`/`old.`, `RESTRICT` vs. `NO ACTION` en un motor que los trata igual, el `BETWEEN` del slide 19, la columna tapada del slide 11 |
| [[Práctica 2026-08-25]] § *Preguntas para el docente* | TP6: (crítico) **A.4 y A.5 se contradicen** *(juntas hacen imposible publicar un artículo argentino)*, si se clasifica por ámbito o por sentencia, el escape del `_` en `LIKE`, cuántos ejemplos pide el 2.b |
| [[Clase 10 - Restricciones integridad-Parte 2]] § *Dudas abiertas* | (crítico) si el **error 1442** frena el trigger del TP7 ej. 2, si **PL/pgSQL entra al parcial** cuando el TP se resuelve en MySQL, si los **cursores** entran y con qué bibliografía *(no tienen capítulo en GMUW ni en Date)*, por qué el archivo se llama *"Restricciones"* si la portada dice *"SQL procedural"*, y que **`INSTEAD OF` sigue sin resolverse**. Más: `CREATE OR REPLACE` en MySQL 9.7, `TEXT` como variable local, si `CREATE DOMAIN` salió del temario |
| [[Práctica 2026-09-01]] § *Dudas abiertas* | TP7: (crítico) el mismo **error 1442**, (crítico) si el **3.d** pide `PROCEDURE` o `FUNCTION` *(el enunciado dice "stored procedure", el título dice "funciones", y el cálculo devuelve **dos** valores)*, (crítico) si el **ej. 2** espera la respuesta única o el análisis de la dependencia del orden. Más: unidad de tiempo del ej. 3, un `HIS_ENTREGA` o dos, si el TP se entrega y en qué formato |
| [[Clase 11 - Seguridad-Transacciones]] § *Dudas abiertas* | (crítico) **qué se toma de seguridad en el parcial**: la sintaxis MySQL del deck o el grafo de permisos / `REVOKE CASCADE` de GMUW 10.1 que el TP8 ejercita *"desde la teoría"*; (crítico) por qué los slides 31–38 son de índices y si se dieron en clase; si `REPEATABLE READ` evita *phantoms* "para la cátedra" *(el slide dice que no; InnoDB en la práctica sí)*; dónde está la *"matriz de roles y permisos"* del cronograma *(el deck no tiene ninguna)*; si se explicó `SET DEFAULT ROLE`; si el `FOR UPDATE` del slide 30 vale como sintaxis MySQL, y `START TRANSACTION` o `BEGIN`; si entran deadlocks, 2PL y recuperación; bibliografía sin declarar; cuatro afirmaciones del manual a verificar en el contenedor *(`USING HASH` → BTREE, `'u'@'localhost'` vs. `'%'` en Docker, rol sin activar, `@@transaction_isolation`)* |
| [[Práctica 2026-09-08]] § *Preguntas para el docente* y § *Dudas abiertas* | TP8: (crítico) si el **1.a** espera la respuesta de la teoría *(la sentencia 6 falla)* o la de MySQL *(pasa)*; (crítico) **2.h**: si `ins_prov` es errata de `ins_vol` o un rol distinto; **1.b**: si `REVOKE UPDATE(tiempo)` a quien tiene `UPDATE` de toda la tabla se descompone; **2.d**: si aceptan `mandatory_roles` como sustituto de `PUBLIC`; **3**: si `A.usuario` se reproduce en MySQL o se contesta en papel; (crítico) si el **parcial evalúa seguridad con la semántica del estándar o con la de MySQL**; si el TP se entrega y en qué formato; números de error y `GRANT OPTION` por nivel pendientes de verificar en `mysql:9.7.2` |
| [[Clase 12 - Introduccion a NoSQL]] § *Dudas abiertas* | (crítico) cómo responder *"¿MongoDB soporta transacciones ACID?"*: con el deck *(slide 11: no)*, con Seven Databases 2018 *(Transactions: No)* o con la versión actual *(multi-documento desde 4.0)*; (crítico) **en qué esquina de CAP van MongoDB y Redis**: el slide 18 dice CP para ambos, Corbellini Table 2 AP y CP/AP, Seven Databases A2 pone a Redis en CA; qué versión corre la cursada y si se acepta la sintaxis legacy del deck *(`insert`, `count`, `update{multi}`, `remove`, `ObjectId` sin comillas — en `mongosh` el slide 38 falla dos veces)*; si *"familia de columnas"* se dicta como *column store* o como *wide-column*; si entra consistencia eventual *(N/W/R, quórum)*; qué operadores además de los seis del slide 41 se dan por sabidos; si `$lookup` es "el join de MongoDB" o señal de mal modelado; por qué el deck no trae bibliografía, versión ni fecha |
| [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] § *Dudas abiertas* | **N:M sin ejemplo en el deck**: arreglo de ids en ambos lados o colección intermedia *(el único N:M de la cursada está en el handout de ecommerce)*; integridad referencial: nadie valida `user_id`/`publisher_id`; verificar en `mongosh` la semántica **null = ausente** de `$lookup` con los datos del slide 22; si la cátedra llega a transacciones multidocumento; `$unwind` **no está en el deck 14** *(lo usa el handout)*; el esquema `cliente` del slide 26 no es de ningún ejemplo anterior; versión de MongoDB de la cursada; regla para la binaria 1:1 que [[1.03.01 - Derivación de MER a esquema relacional\|1.03.01]] no tiene; patrones con nombre de la documentación; `DBRef` vs. referencia manual |
| [[Clase 14 - MongoDB Features]] § *Dudas abiertas* | (crítico) **si `mapReduce` entra al parcial** *(deprecado desde 5.0)*; (crítico) `$lookup` y `$unwind` no están en el deck y la solución del handout los usa en los cinco pipelines; (crítico) **qué versión de MongoDB corre el TP** *(`docker pull mongo` sin tag resolvía a **8.3.11** el 16/09; el deck es de 6.0.5)*; si los cuatro handouts de mayo de 2025 se entregaron el 14/09; la consigna dice *"Usando MongoDB (Compass)"*: ¿pipeline builder o vale `mongosh`?; replica sets y sharding con comandos o solo como concepto; transacciones, GridFS y geoespacial *(en el libro, no en el deck)*; en qué unidad caen la Parte II del TP9 y Cassandra; ficha para *Practical MongoDB Aggregations*; si la cátedra asume el cap. 4 de Seven Databases entero como lectura |
| [[Práctica 2026-09-15]] § *Preguntas para el docente* y § *Dudas abiertas* | TP9: (crítico) si `ensureIndex()` existe todavía en el `mongosh` de la imagen `mongo` actual; (crítico) qué versión baja `docker pull mongo`; si la imagen corre en UTC *(los 13 `dob` van con mes 1-based en `new Date(y,m,d)`)*; paso 34: con `name_1` y `name_1_weight_1` coexistiendo, cuál elige el planificador; (crítico) **ej. 1: si EFECTO ALFONS son dos bandas o una** *(cambia el ej. 9: 3 vs. 2, y el promedio del 10)*, una colección o dos, `discos: []` o campo ausente; ej. 10 antes o después del 4, y dónde va el `$sort`; ej. 11: por bandas o por integrantes; qué contiene la Parte II del 22/09; si se entrega y en qué formato |
| [[Clase 02 - Modelo Entidad-Relacion]] · [[Clase 03 - Derivación a Esquema Lógico]] · [[Clase 05 - Consultas de Datos–Parte 1]] *(y partes 2 y 3)* | DER y repaso relacional: notación del parcial, derivación de 1:1 y ternarias, `NULL`, `UNION`/`INTERSECT`/`EXCEPT` |
| [[Clase 01 - Introducción_BasesDeDatos]] · [[Clase 04 - AlteraciónActualizaciónTablas]] | Dudas sueltas de las dos clases más cortas |
| [[MySQL]] · [[PostgreSQL]] | Lo que quedó en `verificar` de la traducción entre motores |
| [[MongoDB]] | Versión real de la imagen `mongo` sin tag, `ensureIndex`/`count` en `mongosh`, `mapReduce` en 8.x, replica set y sharding sobre el `mongod` suelto del TP9, autenticación *(el contenedor arranca sin `--auth` y ninguna clase dio usuarios ni roles de MongoDB)* |

> [!bug] Las **contradicciones internas de los decks del 10/08** (Clases 06–08)
> Son las más gruesas del vault y conviene llevarlas juntas a clase. El detalle de cada una está en
> la página que la registra; esto es el índice.
>
> 1. **¿Una vista con `JOIN` es actualizable en MySQL?** El deck 07 dice que **no** en el slide 13 y
> hace `insert` y `update` a través de una en el slide 10 → [[Clase 07 - Vistas-Parte 2]]. El
> **TP4 la agrava**: sus ejercicios 4.e y 5 piden analizar ensambles con el criterio SQL:1999 de
> clave preservada, que da el resultado opuesto → [[Práctica 2026-08-11]] § *Choque de criterios*.
> 2. **Slide 16 del deck 08**: el costo *"se incrementó"* pasando de 933897 a **511017**, o sea que
> bajó → [[Clase 08 - Explicando el plan]].
> 3. **Slide 17 del deck 08**: dos costos distintos (933897 y 391421) para la misma consulta → ídem.
> 4. **`CASCADE` vs. `CASCADED`**: el deck 07 slide 2 escribe *"opción: cascade/local"*; el deck 06
> slide 15 escribe `CASCADED`, que es la palabra real, y la cláusula va
> `WITH [CASCADED|LOCAL] CHECK OPTION`. **El TP4 propaga la forma incorrecta** →
> [[Práctica 2026-08-11]].
> 5. ✓ **Cerrada** — las dos erratas del **slide 17 del deck 06** (`Envios500-999` con guion medio,
> `FROM ENVIO500` sin la `S`). El TP4 escribe `ENVIOS500_999` *"a partir de vista ENVIOS500"* →
> [[Práctica 2026-08-11]].

> [!bug] Las **contradicciones internas del deck del 24/08** (Clase 09)
> Menos numerosas que las del 10/08, pero una de ellas es de sintaxis pura y se corrige en un parcial.
>
> 1. (crítico) **`:new` / `:old` vs. `new.` / `old.`** — el slide **30** dice *"corresponde referirse a estos
> elementos como `:new` y `:old`"*, y el slide **36** —la función PL/pgSQL de ejemplo— escribe
> `new.AreaT` / `old.AreaT`, **sin dos puntos**. Los dos puntos son de **Oracle**; ni PostgreSQL ni
> MySQL los usan. El slide **34** repite el error → [[Clase 09 - Restricciones integridad-Parte 1]].
> 2. **El `CHECK` del slide 19 no coincide con su enunciado**: dice *"mayor a 0 e inferior a 50000"* y
> escribe `BETWEEN 0 AND 50000`, que **incluye los dos extremos** — lo dice el propio slide 18.
> 3. **El slide 31 desaconseja lo que el 32 muestra**: *"un trigger `BEFORE` no debería contener
> sentencias que alteren datos"*, y el ejemplo siguiente es un `BEFORE UPDATE` que hace `INSERT`.
> *(No es contradicción real: el 32 ilustra por qué el 31 lo desaconseja. Pero leídos sueltos
> confunden.)*
> 4. **El slide 11 tiene la columna `AreaT` tapada por un recuadro** en la vista renderizada. La capa
> de texto del PDF sí la tiene (`101` para los dos empleados); **si el slide se proyecta, el
> ejercicio se ve incompleto**.
> 5. Erratas menores: **`ttrigger`** con doble `t` *(slide 27)*, el paréntesis sin cerrar del
> `CREATE DOMAIN` *(slide 17)*, las comillas rotas del `IN (…)` *(slide 18)* y **"POstgreSQL"**
> *(slide 39)*.
>
> Y del lado del TP6, una del enunciado: **A.4 y A.5 se contradicen** — juntas hacen imposible
> publicar un artículo argentino, y encadenadas con A.3, imposible publicar nada en 2017 →
> [[Práctica 2026-08-25]] § *Preguntas para el docente*.

> [!bug] Las **contradicciones internas del deck del 31/08** (Clase 10)
> Pocas pero jugosas, y dos de ellas son **el mismo slide contradiciéndose a sí mismo**. Detalle en
> [[Clase 10 - Restricciones integridad-Parte 2]]; esto es el índice.
>
> 1. (crítico) **El nombre del archivo contra su portada**: se llama *"Restricciones integridad-Parte 2"* y
> el slide 1 dice ***"SQL PROCEDURAL · Triggers, Stored Procedures"***. Trece de veinte slides son
> lo segundo. *(Ver el callout de la tabla de clases.)*
> 2. (crítico) **El slide 9 se desmiente cuatro líneas después de escribirse**: da la gramática
> `nombre CURSOR [ ( argumentos ) ] **FOR** select_query ;` y el ejemplo de abajo escribe
> `curs3 CURSOR (key int) **IS** SELECT …`. El `IS` es **Oracle**.
> 3. (crítico) **El slide 17 escribe un ejemplo en Oracle y después se queja de PostgreSQL**:
> `having avg( months_between ( sysdate, … ) )` —las dos funciones son de Oracle— y el recuadro de
> abajo dice *"**Postgres NO implementa este tipo de checks**, Postgres no permite un select dentro
> de un constraint…. :("*. (clave) **Esa sentencia no compila en ningún motor, por dos razones
> distintas, y el deck nombra sólo una** — Oracle tampoco admite subconsultas en un `CHECK`.
> 4. **Se titula *"Triggers"* y no trae ni un `CREATE TRIGGER`**: cero `BEFORE`/`AFTER`, cero
> `FOR EACH ROW`, cero ECA. Presupone el vocabulario de los slides 25–38 de la Clase 09, así que
> **no falta nada, pero el deck no se sostiene solo**.
> 5. **El slide 2 advierte** *"cada proveedor de BD tiene su propio lenguaje procedural"* y los once
> siguientes enseñan **PL/pgSQL**, que no es el de la cursada.
> 6. Erratas de código: **`OPEN CURSOS FOR EXECUTE`** *(por `CURSOR`, slide 10)*, el
> `cursor cur1 for select …` **invertido** del slide 11 *(PL/pgSQL es `cur1 CURSOR FOR …`)*,
> **`menaje`** por `mensaje` *(11)*, el cierre `$$; LANGUAGE plpgsql;` del slide 13 —el `;` sobra
> y deja el `LANGUAGE` fuera de la sentencia, comparar con el 12, que lo pone **antes** del
> `AS $$`—, comillas curvas `“ ”` en literales *(10, 11)*, comentarios con `//` **que no son
> comentario en ningún motor** *(8, 9, 18)*, y el link **`postgresql.com`** del slide 20 *(el sitio
> es `.org`)*.
>
> (crítico) **`:new`/`:old` ya no es una duda de una clase.** El deck 09 se contradecía solo *(slide 30
> Oracle vs. slide 36 PL/pgSQL)*; este suma **dos filtraciones más de Oracle** *(ítems 2 y 3)*. Con
> tres instancias en dos decks consecutivos, la pregunta ya no es *"cuál de las dos formas se
> corrige"*, es **si la cátedra corrige dialecto o sólo lógica**.

> [!bug] Las **contradicciones internas del deck del 07/09** (Clase 11)
> Treinta y seis erratas en 38 slides y casi ninguna rompe código —el deck tiene poco—, pero cuatro
> son conceptuales. Detalle en [[Clase 11 - Seguridad-Transacciones]] § *Contradicciones internas*;
> esto es el índice.
>
> 1. **Slide 8 vs. 9**: *"un usuario MySQL se define en términos de un nombre de usuario y una
> contraseña"* vs. la identidad `'usuario'@'host'` del slide 9. Gana el 9.
> 2. (crítico) **Slide 18 vs. 20**: la lista de estados *(Silberschatz: activa, parcialmente confirmada,
> fallida, abortada, confirmada)* y el diagrama *(Elmasri-Navathe: activa, parcialmente
> confirmada, confirmada, fallo, terminar)* no coinciden — *"Abortada"* no está en el diagrama y
> *"Terminar"* no está en la lista.
> 3. (crítico) **Slide 26 vs. 30**: el 26 define control de versiones como *"las transacciones no utilizan
> bloqueos"*; el 30 rotula *"Ejemplo de control de versiones en PostgreSQL"* un
> `SELECT … FOR UPDATE`, que es un bloqueo pesimista idéntico en mecanismo al del slide 29.
> 4. **Slide 25 vs. 29–30 (y MySQL)**: *"nadie más puede leer"* con un *exclusive lock* es el modelo
> de libro; los motores de los ejemplos e InnoDB son MVCC y las lecturas comunes no se bloquean.
> 5. **Slide 7 (agenda) vs. 8–13**: promete modificación y borrado de cuentas y *"conexiones seguras /
> SSL"*; no hay `ALTER USER`, `DROP USER` ni una palabra de SSL.
> 6. **Slide 10 vs. 13**: el 10 da una sola granularidad (`base.tabla`); el 13 usa `midb.*` sin
> explicarla; la granularidad de columna que usa el TP8 no está en ninguno.
> 7. (crítico) **Slide 12 vs. el manual**: *"se deben refrescar … `FLUSH PRIVILEGES`"* tras `GRANT`/`REVOKE`
> es innecesario; solo hace falta tras editar las tablas `mysql.*` a mano.
> 8. **Slide 28 vs. InnoDB**: *"Repeatable Read … no previene las lecturas fantasma"* es el estándar;
> en InnoDB *(nivel por defecto)* las lecturas consistentes no muestran *phantoms*.
> 9. **Nombre y tema vs. slides 31–38**: *"Seguridad-Transacciones"* y el cronograma no mencionan
> índices; ocho slides son de índices y cuatro *(32–35)* llevan el encabezado *"Transacciones en
> Base de Datos"* por copia y pega.
> 10. (crítico) **Slide 38 vs. InnoDB**: `USING HASH` sobre InnoDB se sustituye por un B-tree *(con
> *warning*, según el manual § 15.1.18)*; hash real solo en `ENGINE=MEMORY`.
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
> *(desnormalización)*; el ejemplo real de *schemaless* es el slide 27. Están intercambiados.
> 2. **Slide 12 vs. 17**: CAP *"afecta a cualquier sistema distribuido"*, pero el 17 ofrece **CA** como
> opción y la define como *"no se puede permitir el particionado"* — un sistema no distribuido.
> 3. (crítico) **Slide 18 vs. Corbellini Table 2**: MongoDB **CP** en el slide, AP y CP en el paper; Redis
> **CP** en el slide, AP en el paper *(y CA en Seven Databases A2)*; Memcache aparece en el slide y
> el paper lo excluye.
> 4. **Slide 26 vs. 29**: *"No existe un esquema estricto"* vs. *"Basada en esquemas BSON"* — BSON es
> un formato de serialización, no un esquema.
> 5. **Slide 34 vs. 48–49**: comentarios embebidos en el post vs. comentarios en otra colección
> unidos con `$lookup`: los dos modelos del tema oficial, mostrados sin decir que son alternativas.
> 6. **Slide 38 vs. 39**: el 38 inserta con `_id` explícito *(e inválido: `ObjectId(7df78ad8902c)`,
> 12 hex sin comillas, repetido en 40, 42, 43, 44 y 46)*; el 39 inserta sin `_id` y es la forma
> correcta; el deck no lo dice.
> 7. **Slides 38–44 vs. 46–47**: el campo autor se llama `by` y después `by_user`: el `$group` del 47
> no funciona sobre los documentos del 38.
> 8. **Slide 38 vs. 40–44**: inserta `likes: 100` *(número)* y las salidas devuelven `"likes": "100"`
> *(string)* — imposible en MongoDB, salida escrita a mano; con string el `$gt: 50` del 41 no
> matchearía.
> 9. **Slide 30**: la viñeta dice *"Replicación para alta disponibilidad"* y el diagrama muestra solo
> *sharding*; no hay una réplica dibujada en todo el deck.
> 10. **Slide 48 vs. 49**: rótulos `post collection` / `comment collection` y la consulta usa
> `db.posts` con `from: "comments"` — con los nombres del 48 el `$lookup` devuelve vacío sin
> error. Ídem slide 51: *"Collection: Survey"* vs. `"survey"` en `createView`.
> 11. Cuatro nombres de colección para el mismo ejemplo: `mycol`, `post`, `posts`, `myCollection`.
> 12. **Slide 11** *"No trata con datos críticos que requieren ACID"* vs. 29–30 *(replicación,
> tolerancia a fallos)*: no define "crítico" y envejeció — transacciones multi-documento desde 4.0.
>
> **Clase 13** → [[Clase 13 - NoSQL-EmbebidosVSNormalizado]]
> 1. **Tres nombres para el deck**: archivo *"NoSQL-EmbebidosVSNormalizado"*, portada *"MongoDB:
> Diseño del Modelo de Datos"*, metadato `Title` del PDF *"Introducción a Bases de Datos NoSQL"*
> *(idéntico al del PDF de la Clase 12)*.
> 2. (crítico) **Slide 13**: título *"one-to-many con documentos embebidos"* sobre un slide que muestra el
> modelo **con referencias** *(dos direcciones con `patron_id`)*; el embebido recién aparece en el 15.
> 3. **Slide 21**: lista cinco etapas *(Lookup, Sort, Match, Unwind, Project)* y solo `$lookup` se
> desarrolla *(22–24)*; `$group` no está ni en la lista.
> 4. **Slide 26**: la consigna pide *"el teléfono y el número de cliente"* y la proyección
> `{codigo_area: 1, nro_telefono: 1}` no incluye ningún número de cliente; además `_id` sale igual
> porque no se excluye con `_id: 0` *(que sí aparece en el 27)*.
> 5. **Slide 27** titulado *"Lógica de control"* es el snippet de marketing de MongoDB Atlas
> *(`db.ideal.find(...)` → `{ 'try': 'MongoDB Atlas Today' }`)*, no un ejemplo de la cursada.
> 6. **Slide 5** promete *"una sola operación de escritura atómica"* para el embebido y no dice nada
> del normalizado *(dos operaciones; transacciones multidocumento no se nombran)*.
> 7. **Slide 8** manda N:M a referencias y el deck no muestra ningún ejemplo de N:M.
> 8. Vocabulario inconsistente para *embedded*: embebido *(3, 5)*, incrustado *(5, 11, 14)*,
> incorporación *(8)*; *"más óptimo"* [sic] *(14)*.
> 9. **Slide 17**: `author` es arreglo en un libro y string en el otro *(esquema flexible, no
> señalado)*; `founded: 1980` para O'Reilly *(fundada en 1978)*; slides 13/15, dos ciudades con el
> mismo `zip: "12345"`.
> 10. **Slide 22**: claves entre comillas salvo `description`, en los seis documentos.
> 11. Imágenes recortadas al pie: slide 20 *(el tercer libro se corta)* y slide 24 *(el resultado se
> corta en `"_id" : 3,` — justo el caso null/ausente que el ejemplo está armado para mostrar)*.
> 12. El deck termina en el slide 28 con una captura de la documentación, sin resultado ni cierre.
>
> **Clase 14** → [[Clase 14 - MongoDB Features]]
> 1. (crítico) **Slide 10 vs. 11, 25 y 41**: el 10 enseña `mongosh`; los otros tres muestran el shell legado
> `mongo` *(help de `mongo`, `WriteResult`, `$ mongo localhost:27011`)*.
> 2. **Slide 9 vs. 12, 20 y 23**: `insertOne` vs. `insert()` deprecado.
> 3. **Slide 14 vs. 27, 29 y 34**: el 14 tacha `count()` y muestra `countDocuments()`; los otros
> vuelven a `count()`.
> 4. **Slide 20**: `db.towns.insert` vs. `db.town.findOne()` / `db.town.find()` — la colección cambia
> de nombre.
> 5. **Slide 26 vs. 39**: Python 3 *(`print(...)`)* vs. Python 2 *(`print c['name']`)*.
> 6. (crítico) **Slide 2 vs. el resto**: declara MongoDB **6.0.5** y enseña `ensureIndex` *(deprecado 3.0)*,
> `background: 1` *(sin efecto desde 4.2)*, `system.js.save` *(deprecado 4.2)* y `mapReduce`
> *(deprecado 5.0)* sin marcarlos.
> 7. **Slides 15 y 16**: la misma colección `internos` con dos conjuntos de campos distintos
> *(importaciones de 2020 y 2018 según los `ObjectId`)*, sin comentario.
> 8. **Slide 3 vs. 5**: db-engines *(MongoDB #5 y en baja)* vs. LinkedIn *(MongoDB primero en ofertas
> de empleo)*, sin conciliar.
> 9. **Slide 8**: documenta `toString()` → `ObjectId("...")` *(shell legado)*; en `mongosh` devuelve
> el hexadecimal.
> 10. **Slide 36**: dice *"ejemplo de la página 120"* y el `runCommand` reproducido está en la 121.
>
> **Handouts** → [[Clase 14 - MongoDB Features]] § *Material complementario del 14/09*
> 1. **Solución**: numeración corrida en uno respecto de la consigna *(sección N+1 = pregunta N)*.
> 2. (crítico) **Solución, pregunta 4**: pide nombre, país y monto; la solución devuelve nombre, **email** y
> monto — falta el país.
> 3. **Solución, pregunta 2**: con los datos dados hay **empate** *(Auriculares 3, Libro 3)* y
> `$sort` + `$limit: 1` devuelve uno al azar sin avisar.
> 4. (crítico) **Solución, pregunta 5**: pide órdenes por cliente con nombres de productos; el `$group` final
> aplana los productos por cliente y pierde la orden, la fecha y la cantidad *(invisible con este
> dataset porque cada cliente tiene una sola orden)*.
>
> **TP9** → [[Práctica 2026-09-15]] § *Trampas del enunciado*
> 1. **Paso 19 vs. 20**: la prosa dice *"especificar un tercer parámetro en true"* *(firma legacy)* y
> el código usa `{upsert:true}`; `updateOne(q,u,true)` literal falla en `mongosh`.
> 2. **Paso 19**: *"no tendrá ningún resultado"* — sí lo tiene: `{matchedCount: 0, modifiedCount: 0,
> upsertedCount: 0}`.
> 3. **Paso 34 vs. 33**: *"veremos el nombre del índice que es usado"* con dos índices candidatos
> *(`name_1` y `name_1_weight_1`)*: el planificador puede elegir cualquiera.
> 4. **Ejercicio 1**: *"bandas de la Ciudad de Buenos Aires"* y la tabla incluye LA LUCILA, MORENO y
> BERAZATEGUI; columna *"NOMBRE DEL SOLISTA"* para bandas de hasta 7 integrantes; *"SOLISTA"* como
> género.
> 5. (crítico) **Ejercicio 1**: EFECTO ALFONS aparece **dos veces** *(fechas y discos distintos)* sin aclarar
> si son una banda o dos; cambia el ej. 9 *(3 vs. 2)* y el promedio del 10.
> 6. **Ejercicios 10–11** piden `createView` y agrupar/promediar, y ninguno de los 34 pasos enseña
> `createView` ni `aggregate`.
> 7. **Paso 7 y los 12 inserts del paso 10**: `new Date(año, mes, día)` con el mes 1-based — en
> JavaScript es 0-based, así que todos los `dob` quedan un mes corridos; David Silva además con día
> y mes invertidos.

> [!success] La duda **"¿MySQL o el motor del deck?"** tiene método confirmado desde el TP6
> Aparecía textualmente en [[Clase 08 - Explicando el plan]], [[MySQL]], [[PostgreSQL]],
> [[1.08.01 - Plan de ejecución|Plan de ejecución]] y [[1.08.02 - Índices|Índices]]. El TP5 la cerró a
> medias: su enunciado abre *"es necesario levantar **MySQL**"* → **el TP5 corre en MySQL**, pero el
> parcial no dice nada. A partir del TP6 la cátedra establece un **método explícito**, repetido en
> tres TPs consecutivos: da la teoría en el estándar SQL y **avisa en el propio enunciado** cuándo
> MySQL no la soporta — TP6 ej. 3 (*"en SQL estándar"* / *"soportadas por MySQL"*), TP7 1.c y 2.b
> (*"aunque MySQL no soporta… resuelva según la teoría"*), TP8 1.b y ej. 2 (*"MySQL no provee…
> resuélvalo desde la teoría"*, ya con desfasaje **de modelo**, no de una cláusula). El TP9, en
> cambio, es el primero **sin brecha que nombrar**: escrito y corrido en `mongosh`, el desfasaje que
> queda es solo de versión. **Sigue sin confirmarse qué motor toma el parcial** → [[Práctica
> 2026-08-18]], [[Práctica 2026-09-01]], [[Práctica 2026-09-08]], [[Práctica 2026-09-15]].

## Evaluación

Según el programa: cursada = promedio entre parcial y TP Especial (el **TPO** del cronograma), mínimo
4 en cada uno; final con mínimo 4. Fechas concretas en [[_cronograma]].
