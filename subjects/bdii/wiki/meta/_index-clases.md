---
tipo: referencia
resumen: "Registro de qué archivo de raw/ es de qué clase: las 14 teóricas con sus decks, el material sin número, las prácticas por fecha, los exámenes viejos, el reparto de unidades y punteros a dudas. La clase la numera la cátedra en el nombre del deck; la unidad se observa, no se predice."
formato: indice
---

# Índice de clases — Base de Datos II (72.41)

## Resumen general

Esta página es el único registro de qué archivo de `raw/` corresponde a qué clase. Separa
tres piezas: la **clase**, que numera la cátedra en el nombre del deck (`BD2_Clase NN`); la
**unidad**, que es la carpeta donde el humano archivó el material; y la **práctica**, identificada
por fecha. También registra el material sin número de clase y qué archivo de `raw/Examenes_Viejos/`
usa cada página de exámenes *(cruzadas con el cronograma en
[[Mapa de exámenes|Mapa de exámenes]])*.

Importa porque documenta el desfasaje de motor de la primera mitad: la cursada corre sobre
**MySQL**, pero once de los trece primeros decks de la `Unidad-01` traen PostgreSQL, Oracle o
T-SQL; la traducción vive en [[MySQL|MySQL]] y [[PostgreSQL|PostgreSQL]]. En la `Unidad-02`
(MongoDB) el desfasaje es de shell y de versión.

Reglas clave: (1) el número de clase sale del nombre del deck, nunca del cronograma ni de la fecha;
(2) una clase puede tener varios archivos —la 05 en tres partes, la 11 en dos decks el 07/09— sin
dejar de ser una, salvo que la cátedra cambie el número (la "Parte 2" de la 09 fue la Clase 10);
(3) varias clases pueden compartir fecha (01–05, el 03/08) o ser asincrónicas (la 05); (4) el reparto de unidades se observa,
no se predice; (5) el material sin número —cuatro handouts del 14/09 y seis archivos de la
`Unidad-01`— no son clases: se documentan en la clase que acompañan.

Para el parcial: qué deck usa qué motor ajeno, el método de la cátedra de dar la teoría en el
estándar y avisar cuando MySQL no la soporta (TP6 a TP8), y las contradicciones internas de cada
deck, sobre todo las de la Clase 09 (`:new`/`:old`) y la Clase 11 (estados de transacción,
aislamiento real de InnoDB).

## Modelo de la cursada

Mapa de la cursada. Las **fuentes** viven en `raw/` (las cura el humano); las **síntesis** viven en
`wiki/clases/` (las escribe el LLM). El calendario, con fechas y temas, está en **[[_cronograma]]**.

> [!important] El modelo: **clase**, **unidad**, **práctica** son tres cosas distintas
> - **Clase** — la numera **la cátedra**, en el nombre del deck: `BD2_Clase NN` → **Clase NN**. No se
> inventa ni la deduce el cronograma.
> - **Unidad** — es la **carpeta de `raw/` donde se archivó**, y **agrupa varias clases**: hoy
> `raw/Unidad-01/` tiene las **Clases 01 a 11** *(14 decks de teórica: la 05 va en tres partes y
> la 11 en dos decks; más 6 archivos sin número de clase)*
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
├── Examenes_Viejos/  ← exámenes de otras cursadas, en tres carpetas de Drive (ver § Exámenes viejos)
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
*(14 decks: la 05 va en tres partes y la 11 en dos —`Clase 11` y `Clase 11(B)`—, más los 6 archivos
sin número de clase de la tabla siguiente)* y las **12 a 14** en `raw/Unidad-02/Teorica/` *(3 decks,
más los 4 handouts sin número de clase)*.

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
| **11** *(B)* | U1 | `BD2_Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL.pdf` | 14 | 07/09 | **Recovery** — el *buffer pool* volátil y la A y la D de ACID, la regla de oro del *write-ahead logging*, anatomía de un *log record* (`LSN`), **ARIES** (*analysis · redo · undo*), el WAL de PostgreSQL *(sin undo log: lo reemplaza MVCC)* frente a InnoDB *(redo log, undo log, doublewrite buffer, binlog)* y la trampa **redo log ≠ binlog** | ✓ [[Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL\|Clase 11(B)]] *(segundo deck de la Clase 11: `clase: 11`)* |
| **12** | **U2** | `BD2_Clase 12 - Introduccion a NoSQL.pdf` | 52 | 14/09 | **Introducción a NoSQL** — por qué surge, propiedades, teorema CAP, BASE, taxonomía (clave-valor, documental, columnar, grafos) · **introducción a MongoDB**: arquitectura, CRUD en el shell, operadores, `aggregate`, `$lookup`, vistas | ✓ [[Clase 12 - Introduccion a NoSQL]] |
| **13** | U2 | `BD2_Clase 13 - NoSQL-EmbebidosVSNormalizado(1).pdf` | 28 | 14/09 | **MongoDB: diseño del modelo de datos** — documentos embebidos vs. referencias, relaciones 1:1, 1:N y N:M, `$lookup`, `find` con proyección, `explain` | ✓ [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] *(el `(1)` es artefacto de descarga: se cae del nombre de la página, no del `deck:`)* |
| **14** | U2 | `BD2_Clase 14 - MongoDB Features.pdf` | 45 | 14/09 | **MongoDB Features** — `ObjectId`, `mongosh` y herramientas de línea de comando, `mongoimport`, CRUD, índices, aggregation pipeline, **MapReduce**, `system.js`, pymongo, **replica sets** y **sharding** | ✓ [[Clase 14 - MongoDB Features]] *(incluye § *Material complementario del 14/09*: los 4 handouts)* |

> [!note] 14/09 — **tres clases en un solo lunes**, y el 07/09 **una clase con dos decks**
> El cronograma tiene **una fila** para el 14/09 y la cátedra numeró **tres decks** para esa fila:
> `BD2_Clase 12`, `13` y `14`. El deck 12 cubre los dos primeros tramos del tema oficial *(intro
> NoSQL y tipos · intro a MongoDB)*, el 13 el tercero *(embebido vs. normalizado)* y el 14 el cuarto
> *(ejemplos con MongoDB)*: **una fila del cronograma no es una clase**, mismo patrón del 03/08 y del
> 10/08.
>
> El 07/09 es el caso inverso: **una sola clase, la 11, con dos decks**. `BD2_Clase 11 -
> Seguridad-Transacciones.pdf` *(38 slides)* y `BD2_Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL.pdf`
> *(14 slides)*, publicados en el campus el mismo día. El número del segundo lo da **el nombre del
> deck en el campus** —el archivo bajó como `Recovery_WAL_PostgreSQL_MySQL.pptx.pdf`, sin número—, y
> su tema (atomicidad y durabilidad) es el bloque *"Transacciones ACID"* de la misma fila del
> [[_cronograma|cronograma]]. Son **dos páginas con `clase: 11`**, como las tres partes de la Clase 05, no dos
> clases.
>
> La Clase 11 repite lo del deck 10: el nombre —*"Seguridad-Transacciones"*— y el tema del
> cronograma **no anuncian los ocho slides de índices** (31–38, el 21 % del deck), cuatro de los
> cuales llevan el encabezado *"Transacciones en Base de Datos"* por copia y pega. Son **la teoría de
> índices que la Clase 08 no dio**, cuatro semanas después; [[1.08.02 - Índices|Índices]] ya la
> incorpora.

### Material sin número de clase

Diez archivos de teórica **no son decks de clase**: seis de `raw/Unidad-01/Teorica/` y cuatro de
`raw/Unidad-02/Teorica/`. Ninguno trae `BD2_Clase NN` en el nombre ni recibe página propia: cada uno
se documenta en la sección *Material complementario* de la clase que acompaña, y esta tabla es el
único lugar donde queda escrito a qué clase se asignó.

#### `Unidad-01`

| Archivo (`raw/Unidad-01/Teorica/`) | Tamaño | Qué es | Clase | Dónde está documentado |
| --- | --- | --- | --- | --- |
| `Ejercicios de RI/Ejercicio 1 - RIR.png` | imagen | Enunciado: `CUENTA(numero, tipo, saldo, limiteDescubierto)` con cuatro reglas según el tipo *(caja de ahorro sin saldo negativo, cuenta corriente hasta el límite de descubierto)*. Es un `CHECK` **de registro** *(nivel 2)*, sin ninguna FK | **09** *(publicado en el campus el 25/08, carpeta* Ejercicios de RI*)* | [[Clase 09 - Restricciones integridad-Parte 1\|Clase 09]] § *Material complementario del 25/08* **(a)** |
| `Ejercicios de RI/Ejercicio 2 - RIR.png` | imagen | Enunciado: `PROYECTO` / `ASIGNACION`, *"no más de tres proyectos activos"* por empleado, y si alcanza con `NOT NULL`, `UNIQUE` o un `CHECK` de MySQL. Es un `CHECK` **de tabla** *(nivel 3)* | **09** *(ídem)* | ídem **(b)** |
| `Ejercicio_Stored_Procedure_BDII.pdf` | 3 págs. | Enunciado: `PROCEDURE RegistrarEntrega` que inserta la entrega de un TP si llega a término y aborta con `SIGNAL` si no, más una ampliación opcional *(registrarla marcada fuera de término)*. El `INSERT` del PDF omite `id_entrega` y no insertaría | **10** *(por tema)* | [[Clase 10 - Restricciones integridad-Parte 2\|Clase 10]] § *Material complementario* **(a)** |
| `ejercicio de SP.sql` | 179 líneas | Script del mismo ejercicio *(esquema, carga y procedimiento, en un schema `SP`)*: agrega un quinto parámetro `p_id_en` que el PDF no tiene, y sus dos filas de carga de `Entrega` fallan por FK *(`ERROR 1452`)* en MySQL 9.7.2 | **10** *(por tema)* | ídem **(a)** |
| `ejercicio de teoria de PosgreSQL hecho en MySQL.sql` | 60 líneas | Traducción a MySQL de la función `voluntarioscadax` *(PL/pgSQL, slide 13 de la Clase 10: una de cada `x` filas)* | **10** *(por tema)* | ídem **(b)** |
| `ejemplo Seguridad BD.png` | imagen | Grafo de permisos: `GRANT … WITH GRANT OPTION`, un `GRANT` encadenado y `REVOKE … CASCADE`, con el estado final tachado *(GMUW cap. 10.1.5–10.1.6)* | **11** *(publicado el 07/09 junto a la actividad* Ejercicio de seguridad en BD*)* | [[Clase 11 - Seguridad-Transacciones\|Clase 11]] § *Material complementario del 07/09* |

> [!warning] La asignación de los tres archivos de *stored procedures* a la Clase 10 es **por tema**
> Para los PNG de RI *(25/08)* y el de seguridad *(07/09)* la clase sale de la fecha en que el campus
> los publicó. Para `Ejercicio_Stored_Procedure_BDII.pdf`, `ejercicio de SP.sql` y `ejercicio de
> teoria de PosgreSQL hecho en MySQL.sql` esa fecha no se pudo leer: se asignan a la **Clase 10**
> porque los tres son SQL procedural en MySQL, lo que enseñan sus slides 6–13. Si el humano confirma
> otra fecha, la fila cambia.

> [!note] Los PNG de *Ejercicios de RI* no son de acciones referenciales
> Pese al nombre de la carpeta, los dos piden un `CHECK` *(slides 15–22 de la Clase 09)*, no trazar
> `CASCADE`/`SET NULL` *(slides 7–14)*. Si esa carpeta del campus tiene un tercer archivo, no está en
> el vault → [[Clase 09 - Restricciones integridad-Parte 1|Clase 09]] § *Dudas abiertas*.

#### `Unidad-02`

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
> *"Parte"*: la premisa siempre es el `NN`, nunca el sufijo. Lo mismo vale para el `(B)` de
> `BD2_Clase 11(B)`: el número es `11`, así que es la Clase 11.

> [!note] La Clase 05 es **una clase repartida en tres archivos**, no tres clases
> `Parte 1/2/3` son partes del mismo deck `BD2_Clase 05`: son **88 slides**, más que las Clases 01–04
> juntas. Tienen una página cada una porque el volumen lo pide, pero la clase es una sola, y fue
> **asincrónica**. La secuencia 02 → 03 → 04 → 05 es **modelar → derivar a tablas → modificar →
> consultar**.

> [!warning] El desfasaje **PostgreSQL / MySQL** no es un caso aislado del deck 04
> Once de los trece decks de teórica traen marcas de otro motor, **uno no trae ninguna** —la Clase
> 02— y **uno trae sólo una atribución histórica** —la Clase 06—. El segundo deck de la Clase 11,
> `BD2_Clase 11(B)`, queda fuera de ese recuento: nombra PostgreSQL y MySQL en su propio título y les
> dedica una sección a cada uno, así que no presenta ningún motor ajeno como genérico; su fila va igual
> en la tabla. Una fila por archivo: el *"no hay"*
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
> | `BD2_Clase 11(B)` | **PostgreSQL + MySQL, rotulados en el título** | Slide 1: *"Write-Ahead Logging (WAL) y su implementación en PostgreSQL y MySQL"*. Sección 04 *(slides 8–9)*, *"El WAL de PostgreSQL"*: `pg_wal/` *(antes `pg_xlog/`)*, `wal_level`, `checkpoint_timeout`, `synchronous_commit`, *"sin undo log separado"* gracias a MVCC. Sección 05 *(slides 10–11)*, MySQL/InnoDB: `ib_logfile` / `#innodb_redo`, *undo log*, *doublewrite buffer* y *binlog*. Comparativa lado a lado en el slide 12. **Ningún motor ajeno presentado como genérico**: la única asimetría es de orden *(PostgreSQL va primero)* → [[Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL\|Clase 11(B)]] § *El desfasaje de motor* |
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
`raw/Unidad-02/Practica/`, y la del **22/09** es la segunda.

| Fecha | Material | TPs | Síntesis |
| --- | --- | --- | --- |
| **martes 04/08** | `BDD II - Clase I.pdf` · `esq_peliculas.sql` · `Resoluciones/` (`TP1.md`, `image.png` — propios del humano) | TP1 Modelos · TP2 Creates · TP3 SQLs simples | ✓ [[Práctica 2026-08-04]] |
| **martes 11/08** | `ITBA TP 3 SQL avanzados.pdf` *(3 págs., reusa `esq_peliculas.sql`)* · `ITBA TP 4 Vistas.pdf` | TP3 SQLs avanzados *(archivado y resuelto: ejercicio 1 a–h y 2 a–c, corridos en MySQL 9.7.2 → § *TP3 SQLs avanzados*)* · TP4 Vistas | ✓ [[Práctica 2026-08-11]] |
| **martes 18/08** | `ITBA TP 5 Explain Plan.pdf` · `materia.csv` · `inscripto.csv` | TP5 Explain Plan | ✓ [[Práctica 2026-08-18]] |
| **martes 25/08** | `ITBA TP 6 Restricciones Declarativas.pdf` *(5 págs., sin dataset)* | TP6 Restricciones declarativas | ✓ [[Práctica 2026-08-25]] |
| **martes 01/09** | `ITBA TP 7 Restricciones Avanzadas.pdf` *(2 págs., sin dataset nuevo — **reusa `esq_peliculas.sql`**)* | TP7 Restricciones avanzadas | ✓ [[Práctica 2026-09-01]] |
| **martes 08/09** | `ITBA TP 8 Seguridad.pdf` *(3 págs., **sin dataset** — **tres esquemas propios**, dos como imagen y uno como línea de texto; no reusa `esq_peliculas.sql`)* | TP8 Seguridad | ✓ [[Práctica 2026-09-08]] |
| **martes 15/09** | `ITBA TP 9 - MongoDB Parte I.pdf` *(7 págs., **`raw/Unidad-02/Practica/`** — los datos van **dentro del PDF**: 12 `insert` como comandos en pp. 2–3 y la tabla de bandas del ej. 1 **solo como imagen** en p. 7)* | TP9 MongoDB Parte I | ✓ [[Práctica 2026-09-15]] |
| **martes 22/09** | `ITBA TP 9 - MongoDB Parte II.pdf` *(2 págs., 8 ejercicios; seis citan páginas de* Seven Databases *cap. 4 y el 6 y el 8 no)* · `egresados.csv` · `mongoCities_fixed.json` *(los tres en **`raw/Unidad-02/Practica/`**)* | TP9 MongoDB Parte II *(resuelto y corrido en MongoDB 8.3.11)* | ✓ [[Práctica 2026-09-22\|Práctica 2026-09-22]] |

Los enunciados de los TPs están en la carpeta de la unidad, junto al deck del día; `raw/tp/` guarda
solo el índice. La semana del 18/08 **no tiene teórica**: el lunes 17/08 es feriado. Tampoco la del
22/09: el lunes 21/09 es el Día del Estudiante, así que el TP9 Parte II se apoya en las Clases 12
a 14.

**Ninguna de las prácticas del 11/08, 18/08, 25/08 ni 01/09 trae deck de slides**: la cátedra entregó
solo el enunciado —y, el 18/08, además los dos CSV—. El único deck de práctica del vault sigue siendo
`BDD II - Clase I.pdf`, del 04/08. Tampoco las del **08/09** ni el **15/09** traen deck: el TP8 son
tres páginas de enunciado y el TP9, siete páginas con los datos adentro. La del **22/09** tampoco:
dos páginas de enunciado y dos datasets.

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

> [!note] El TP9 Parte II trae los datos en archivo y remite al libro
> Es el primer TP de la `Unidad-02` con datasets propios *(`egresados.csv`, para agregar con
> `$group`, y `mongoCities_fixed.json`, para el índice `2d` y una consulta geoespacial). A diferencia
> de la Parte I, no trae comandos listos: seis de sus ocho ejercicios citan páginas de *Seven
> Databases* 2ª ed. cap. 4; el 6 *(traducir dos SQL sobre `bandas`)* y el 8 *(clasificar MongoDB según
> CAP)* no remiten al libro. Trabaja sobre la colección `bandas` de la Parte I *(ejercicio 6)* y compara `explain()` con
> el `EXPLAIN` de MySQL *(ejercicio 3)*. Detalle en [[Práctica 2026-09-22|Práctica 2026-09-22]].

> [!missing] Falta `Clase I.md`, nota propia del humano de la primera semana
> Estaba en la vieja `Clases/…/Clase-01/Teorica/` y no aparece en `raw/Unidad-01/`. Sus definiciones
> de **programación políglota** y **persistencia políglota** quedaron citadas dentro de
> [[Práctica 2026-08-04]] § *Marco conceptual*, así que el contenido no se perdió, pero el original
> sí. Si se recupera, va en `raw/Unidad-01/Practica/`, que es donde cae ese tema.

## Unidades

Dos unidades tienen material y se observan: **`Unidad-01` = Clases 01 a 11 + TP1 a TP8** *(14
decks de teórica —la 11 en dos— y 6 archivos sin número de clase)* y **`Unidad-02` = Clases 12 a 14 +
los 4 handouts + TP9 Parte I y Parte II**, abierta el **15/09**. `raw/Unidad-03` … `raw/Unidad-10`
**todavía no existen**: la carpeta de unidad (con su `Teorica/` y `Practica/`) la crea el humano
cuando archiva el primer material. `raw/Examenes_Viejos/` **no es una unidad**: sus páginas llevan
`unidad: eval` *(§ Exámenes viejos)*.

| Unidad | Temas previstos | Cuándo |
| --- | --- | --- |
| `Unidad-01` | ✓ **observado**: Clases **01 a 11** *(todo lo relacional: intro, DER, DDL, SQL, vistas, índices/explain, restricciones, SQL procedural, **seguridad, transacciones ACID e índices**, y **recovery/WAL** en el segundo deck de la 11)* · 6 archivos sin número *(ejercicios de RI, de stored procedures y de seguridad)* · TP1 a **TP8**, con el **TP3 SQLs avanzados** ya archivado | 03/08 → 08/09 |
| `Unidad-02` | ✓ **observado**: Clases **12 a 14** *(NoSQL, CAP/BASE, MongoDB: embebido vs. normalizado, features)* · 4 handouts sin número · **TP9 Parte I** y **TP9 Parte II** *(con `egresados.csv` y `mongoCities_fixed.json`)* | 14/09 → 22/09 |
| `Unidad-03` a `Unidad-05` | Sin nada previsto: los temas que se les había asignado *(restricciones/TP6, triggers-SQL procedural/TP7, seguridad-ACID/TP8, NoSQL-MongoDB/TP9)* cayeron todos en `Unidad-01` o `Unidad-02` — ver tabla de predicciones abajo | — |
| `Unidad-06` | *(previsión)* Cassandra · TP10 (I y II) · (clave) **parcial el 13/10** | 28/09 · 05/10 |
| `Unidad-07` | *(previsión)* Neo4j · TP11 | 19/10 |
| `Unidad-08` | *(previsión)* Redis · TP12 | 26/10 |
| `Unidad-09` | *(previsión)* Amazon DynamoDB · TP13 · (clave) **recuperatorio el 03/11** | 02/11 |
| `Unidad-10` | *(previsión)* TPO: enunciado 09/11 · entrega 15/11 · defensas 16, 17 y 24/11 | 09/11 → 24/11 |

> [!warning] Reparto `unidad → clases`: ocho predicciones puestas a prueba, y solo dos acertaron
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
> | 8 | práctica del 22/09 → `Unidad-02` *(TP9 Parte II, junto a la Parte I)* | TP9 Parte II + `egresados.csv` + `mongoCities_fixed.json` | `Unidad-02` | ✓ acertó |
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
| [[Clase 06 - Vistas-Parte 1]] § *Dudas abiertas* | Nombres de vista que no cierran entre slides, `PROV_COMP` con dos definiciones, la definición de `LOCAL` del slide 15 vs. la del estándar *(MySQL 9.7.2 aplica la del estándar; qué espera la cátedra sigue abierto)*, `DROP VIEW … RESTRICT` en MySQL, si las vistas materializadas entran *(la Pregunta 11 de [[Parcial 2Q2025\|Parcial 2Q2025]] las toma como teoría general: indicio de 2025)*. ✓ **Cerrada**: las respuestas de los ejercicios de los slides 16 y 17, corridas en MySQL 9.7.2 |
| [[Clase 07 - Vistas-Parte 2]] § *Dudas abiertas* | Actualizabilidad con `JOIN` en MySQL *(ningún examen viejo la evalúa sin agregación)*, `CREATE OR REPLACE VIEW`, vistas materializadas *(MySQL 9.7.2 acepta `CREATE MATERIALIZED VIEW` pero recalcula en cada consulta; nueva: qué significa `ENGINE=UNKNOWN` en `SHOW CREATE VIEW`)*, el `MATERIALIZED … WITH LOCAL CHECK OPTION` del slide 21 *(`ERROR 1368` en MySQL 9.7.2)*, qué criterio decide qué materializar |
| [[Clase 08 - Explicando el plan]] § *Dudas abiertas* | Los costos que no cierran de los slides 16 y 17, `EXPLAIN (ANALYZE, BUFFERS)` en MySQL, el `BEGIN…ROLLBACK` del slide 1, `GEQO` *(ningún examen viejo lo pregunta)*; nueva: desde qué versión MySQL da el `EXPLAIN` en árbol por defecto *(9.7.2 ya lo hace)*. El [[Parcial 2Q2025\|Parcial 2Q2025]] § *Sección C* pregunta el plan **en MySQL** y sin constantes de costo |
| [[Práctica 2026-08-11]] § *Preguntas para el docente* | TP4: qué chequea `LOCAL` en cadena *(el 4.c pide las 9 combinaciones y el vault resuelve una; MySQL 9.7.2 sigue el estándar, la Pregunta 18 del [[Parcial 2Q2025\|Parcial 2Q2025]] no distingue las dos lecturas)*, el **choque de criterios** join vs. clave preservada *(ningún examen viejo lo cierra)*, si el 4.d va con `GROUP BY`; nueva del **TP3 SQLs avanzados**: si *"últimos 5 años"* (1.f) es una ventana relativa a la fecha de corrida o fija al período del dataset |
| [[Práctica 2026-08-18]] § *Preguntas para el docente* | TP5: ✓ **cerrada** la sintaxis de índices *(Clase 11, slides 35 y 38: `CREATE INDEX nombre ON tabla (col)`; en MySQL el `DROP INDEX` lleva `ON tabla` → [[1.08.02 - Índices\|Índices]])*. Siguen: el *Form Editor* de Workbench, el índice clustered de InnoDB, si el **parcial** se rinde sobre MySQL *(en el [[Parcial 2Q2025\|Parcial 2Q2025]] las preguntas de SQL nombran MySQL y las de restricciones de tabla y privilegios van por el estándar: indicio de 2025)*, si se pide leer la estrategia de join por nombre |
| [[Clase 09 - Restricciones integridad-Parte 1]] § *Dudas abiertas* | ~~cuándo llega la **Parte 2**~~ ✓ **cerrada** *(es la **Clase 10**, no la misma 09)*. Siguen: si el parcial toma sintaxis del estándar o de MySQL *(el [[Parcial 2Q2025\|Parcial 2Q2025]] pidió las dos capas: Preguntas 19 y 24; indicio de 2025)*, `:new`/`:old` vs. `new.`/`old.`, `RESTRICT` vs. `NO ACTION` en un motor que los trata igual, `SET NULL` contra una FK `NOT NULL`, si `MATCH PARTIAL` es solo teoría, el `BETWEEN` del slide 19, la columna tapada del slide 11; nueva: qué abarca *"RIR"* en la carpeta *Ejercicios de RI*, cuyos dos PNG son de `CHECK` y no de acciones referenciales |
| [[Práctica 2026-08-25]] § *Preguntas para el docente* | TP6: (crítico) **A.4 y A.5 se contradicen** *(juntas hacen imposible publicar un artículo argentino)*, si se clasifica por ámbito o por sentencia *(la Pregunta 25 del [[Parcial 2Q2025\|Parcial 2Q2025]] no lo decide)*, el escape del `_` en `LIKE`, cuántos ejemplos pide el 2.b, `MATCH PARTIAL` solo como teoría del estándar |
| [[Clase 10 - Restricciones integridad-Parte 2]] § *Dudas abiertas* | (crítico) si el **error 1442** frena el trigger del TP7 ej. 2, si **PL/pgSQL entra al parcial** cuando el TP se resuelve en MySQL, si los **cursores** entran al parcial *(la bibliografía ya está resuelta: GMUW cap. 9.3.6 y 9.4.4–9.4.6; ningún examen viejo pide código procedural ni cursores)*, por qué el archivo se llama *"Restricciones"* si la portada dice *"SQL procedural"*, y que **`INSTEAD OF` sigue sin resolverse**. Más: `CREATE OR REPLACE` en MySQL 9.7, `TEXT` como variable local, si `CREATE DOMAIN` salió del temario, el reset del *"cada x"* del slide 13 *(redundante: la traducción del material complementario da las mismas filas con y sin él)*; nueva: de quién es la corrección de `RegistrarEntrega` en `ejercicio de SP.sql` |
| [[Práctica 2026-09-01]] § *Dudas abiertas* | TP7: (crítico) el mismo **error 1442**, (crítico) si el **3.d** pide `PROCEDURE` o `FUNCTION` *(el enunciado dice "stored procedure", el título dice "funciones", y el cálculo devuelve **dos** valores; el material complementario de la Clase 10 llama* stored procedure *a un `CREATE PROCEDURE`, sin decidir el 3.d)*, (crítico) si el **ej. 2** espera la respuesta única o el análisis de la dependencia del orden. Más: unidad de tiempo del ej. 3, un `HIS_ENTREGA` o dos, si el TP se entrega y en qué formato |
| [[Clase 11 - Seguridad-Transacciones]] § *Dudas abiertas* | (crítico) **qué se toma de seguridad en el parcial** *(la Pregunta 32 del [[Parcial 2Q2025\|Parcial 2Q2025]] pidió `GRANT`/`REVOKE … CASCADE` en SQL estándar con el grafo de permisos, igual que el handout del 07/09: indicio de 2025)*; (crítico) por qué los slides 31–38 son de índices y si se dieron en clase; si `REPEATABLE READ` evita *phantoms* "para la cátedra"; la *"matriz de roles y permisos"* del cronograma; `SET DEFAULT ROLE`; el `FOR UPDATE` del slide 30 y `START TRANSACTION` o `BEGIN`; si entran deadlocks y 2PL *(la **recuperación** ya tiene deck: [[Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL\|Clase 11(B)]])*; bibliografía sin declarar; verificaciones en el contenedor, en MySQL 9.7.2: ✓ `USING HASH` → `BTREE` sobre InnoDB, ✓ el rol concedido sin `SET DEFAULT ROLE` queda inactivo *(`CURRENT_ROLE()` = `NONE`, `ERROR 1142`)* y ✓ `@@transaction_isolation` → `REPEATABLE-READ` *([[MySQL\|MySQL]] § *8.5*)*; sigue sin verificar `'u'@'localhost'` vs. `'%'` desde el host anfitrión |
| [[Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL\|Clase 11(B)]] § *Dudas abiertas* | (crítico) si **ARIES** entra por nombre *(Date cap. 15.4 lo nombra; ningún examen viejo lo pregunta)*; (crítico) lo de PostgreSQL *(`wal_level`, `checkpoint_timeout`, `synchronous_commit`, `full_page_writes`)* verificado solo contra la documentación de PostgreSQL 18, sin servidor real; cuánto detalle se pide del *two-phase commit* interno entre *redo log* y *binlog*; `full_page_writes` vs. *doublewrite buffer*. ✓ **Cerradas**: la recuperación tiene deck propio *(duda heredada de la Clase 11)* y `innodb_log_file_size` ya no existe en MySQL 9.7.2 *(`unknown variable`; solo `innodb_redo_log_capacity`)*; deadlocks y 2PL siguen sin deck |
| [[1.11.05 - Recovery y write-ahead logging (WAL)\|Recovery y WAL]] · [[1.11.06 - ARIES — análisis, redo y undo\|ARIES]] § *Dudas abiertas* | Repiten las de la Clase 11(B) *(PostgreSQL sin servidor real, *two-phase commit* interno, `full_page_writes` vs. *doublewrite buffer*, ARIES por nombre)* y suman dos de 1.11.06: si el ejemplo trabajado con un log numérico *(§ 7)* es el nivel que pide la cátedra, y si `recLSN` y `CLR` *(§ 7.6)* se mencionaron en clase o son ampliación del vault |
| [[Práctica 2026-09-08]] § *Preguntas para el docente* y § *Dudas abiertas* | TP8: (crítico) si el **1.a** espera la respuesta de la teoría *(la sentencia 6 falla)* o la de MySQL *(pasa)*; (crítico) **2.h**: si `ins_prov` es errata de `ins_vol` o un rol distinto; **1.b**: si `REVOKE UPDATE(tiempo)` a quien tiene `UPDATE` de toda la tabla se descompone; **2.d**: si aceptan `mandatory_roles` como sustituto de `PUBLIC`; **3**: si `A.usuario` se reproduce en MySQL o se contesta en papel; (crítico) si el **parcial evalúa seguridad con la semántica del estándar o con la de MySQL** *(la Pregunta 32 del [[Parcial 2Q2025\|Parcial 2Q2025]]: estándar; indicio de 2025)*; si el TP se entrega y en qué formato; números de error: ✓ `1064`, `1410`, `3523` y `1147` verificados en MySQL 9.7.2; `GRANT OPTION` por (cuenta, tabla) consistente con una corrida en MySQL 9.7.2, sin verificar la frase del manual |
| [[Clase 12 - Introduccion a NoSQL]] § *Dudas abiertas* | (crítico) cómo responder *"¿MongoDB soporta transacciones ACID?"* *(ningún examen viejo lo pregunta)*; (crítico) **en qué esquina de CAP van MongoDB y Redis**: para **MongoDB**, el [[Parcial 2Q2025\|Parcial 2Q2025]] tomó **CP**, la del slide 18 *(Pregunta 10; indicio de 2025)*; **Redis** no tiene pregunta corregida *(la guía [[Repaso Final BD 2\|Repaso Final BD 2]] lo pone en CA)*; qué versión corre la cursada y si se acepta la sintaxis legacy *(en MongoDB 8.3.11, `insert()` avisa la deprecación y `ensureIndex` no)*; *column store* o *wide-column*; si entra la consistencia eventual *(el quórum apareció en 2025, pero en la pregunta de Cassandra)*; hasta dónde llegan los índices *(el TP9 Parte II ejercita el índice por defecto, `_id`, `explain()` y `2d`)*; qué operadores se dan por sabidos; si `$lookup` es "el join de MongoDB" o señal de mal modelado; por qué el deck no trae bibliografía, versión ni fecha; nueva: por qué el slide 18 no ubica a Neo4j si el Parcial 2Q2025 lo evalúa como CA |
| [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] § *Dudas abiertas* | **N:M sin ejemplo en el deck** *(la Pregunta 31 del [[Parcial 2Q2025\|Parcial 2Q2025]] confirma que embebido vs. referencias se evalúa, pero no dice cómo referenciar un N:M)*; integridad referencial: nadie valida `user_id`/`publisher_id`; ✓ **cerrada** la semántica **null = ausente** de `$lookup`: con los datos del slide 22, en MongoDB 8.3.11, la orden sin `item` empareja con `sku: null` y con `sku` ausente; si la cátedra llega a transacciones multidocumento *(ningún examen viejo)*; `$unwind` **no está en el deck 14**; el esquema `cliente` del slide 26; versión de MongoDB de la cursada *(ninguna de las dos partes del TP9 la fija)*; regla para la binaria 1:1 que [[1.03.01 - Derivación de MER a esquema relacional\|1.03.01]] no tiene; patrones con nombre de la documentación; `DBRef` vs. referencia manual |
| [[Clase 14 - MongoDB Features]] § *Dudas abiertas* | (crítico) **si `mapReduce` entra al parcial** *(la Pregunta 6 del [[Parcial 2Q2025\|Parcial 2Q2025]] lo pidió con el ejercicio del handout (c), que en MongoDB 8.3.11 corre con `DeprecationWarning`: indicio de 2025)*; (crítico) `$lookup` y `$unwind` fuera del deck *(el TP9 Parte II no los usa; ningún examen viejo usa `$unwind`)*; (crítico) **qué versión de MongoDB corre el TP** *(referencia: 8.3.11 / `mongosh` 2.11.1 con la imagen `mongo:8`; el deck es de 6.0.5)*; si los cuatro handouts de mayo de 2025 se entregaron el 14/09; Compass o `mongosh` para la consigna; replica sets y sharding *(en 2025, solo como concepto)*; transacciones y GridFS *(el geoespacial sí entró: índice `2d` del TP9 Parte II)*; ficha para *Practical MongoDB Aggregations*; si la cátedra asume el cap. 4 de Seven Databases entero *(el TP9 Parte II lo recorre)*. Resuelto en parte: la Parte II del TP9 cayó en `Unidad-02`; Cassandra sigue sin material de clase |
| [[Práctica 2026-09-15]] § *Preguntas para el docente* y § *Dudas abiertas* | TP9: ✓ **cerradas**: `ensureIndex()` funciona sin aviso en MongoDB 8.3.11 / `mongosh` 2.11.1, qué trae la Parte II, y que la Parte II reutiliza `bandas` *(no `players`)*, y que la imagen `mongo:8` corre en UTC *(`new Date(1987,2,14,0,0)` → `1987-03-14T00:00:00.000Z`)*. Siguen: (crítico) qué versión baja `docker pull mongo` *(8.3.11 es un dato de referencia, no la respuesta)*; si `ensureIndex` se **acepta** en la entrega; paso 34: cuál índice elige el planificador; (crítico) **ej. 1: si EFECTO ALFONS son dos bandas o una** *(cambia el ej. 9: 3 vs. 2, y el promedio del 10)*, una colección o dos, `discos: []` o campo ausente; ej. 10 antes o después del 4, y dónde va el `$sort`; si se entrega y en qué formato |
| [[Práctica 2026-09-22\|Práctica 2026-09-22]] § *Preguntas para el docente* y § *Dudas abiertas* | TP9 Parte II: si el **ej. 8** espera **CP** o AP para MongoDB *(Clase 12 vs. Corbellini; el Parcial 2Q2025 tomó CP)*; si `titulo` es la columna que pide el 4.b *(`egresados.csv` no trae `carrera`)*; `ensureIndex` o `createIndex` en la entrega; en qué base va `mongoCities_fixed.json`; (crítico) el criterio de `mongoCities_fixed.json` para ordenar `location` *(`[lat, lon]` en unos países y `[lon, lat]` en otros)*; desde qué versión de MySQL 9.x el `EXPLAIN` sale en árbol; si `ensureIndex` sobrevive a la próxima versión mayor de `mongosh` |
| [[Clase 02 - Modelo Entidad-Relacion]] · [[Clase 03 - Derivación a Esquema Lógico]] · [[Clase 05 - Consultas de Datos–Parte 1]] *(y partes 2 y 3)* | DER y repaso relacional: notación del parcial, derivación de 1:1 y ternarias, `NULL`, `UNION`/`INTERSECT`/`EXCEPT` |
| [[Clase 01 - Introducción_BasesDeDatos]] · [[Clase 04 - AlteraciónActualizaciónTablas]] | Dudas sueltas de las dos clases más cortas |
| [[MySQL\|MySQL]] · [[PostgreSQL\|PostgreSQL]] | Lo que quedó en `verificar` de la traducción entre motores. En [[MySQL\|MySQL]]: ✓ `@@transaction_isolation` → `REPEATABLE-READ` y ✓ *redo log*, *undo log*, *doublewrite buffer* y *binlog* *(§ 8.5)*; siguen, entre otras, `'u'@'localhost'` vs. `'u'@'%'` desde el host *(la única que queda de las verificaciones de seguridad de § 7)*, el error 1442, `CREATE OR REPLACE PROCEDURE`, `GRANT OPTION` global y `BEGIN` vs. `START TRANSACTION`. En [[PostgreSQL\|PostgreSQL]]: (crítico) no hay servidor PostgreSQL para verificar `wal_level` y los demás parámetros del WAL; el equivalente InnoDB de cada pieza del diagrama de la Clase 01 *(la del WAL ya está documentada)* |
| [[MongoDB\|MongoDB]] | Qué versión toma la cátedra *(8.3.11 / `mongosh` 2.11.1, segunda evidencia en la rama 8.x)*; si se acepta en la entrega la sintaxis legada *(✓ `ensureIndex` y `find().count()` funcionan en `mongosh`)*; transacciones ACID; replica sets y sharding con comandos o como concepto; el orden de coordenadas de `mongoCities_fixed.json`; si en la entrega `bandas` se reutiliza o se recrea *(el ej. 6 del TP9 Parte II la supone creada; [[Práctica 2026-09-22\|Práctica 2026-09-22]] la recrea con el mismo `insertMany`)*; Compass o `mongosh` para la consigna *ecommerce*; GridFS y `$jsonSchema`; versiones de las Database Tools. Siguen abiertas, con el [[Parcial 2Q2025\|Parcial 2Q2025]] como indicio de 2025 y no como cierre: si `mapReduce` entra *(Pregunta 6)* y en qué esquina de CAP va MongoDB *(Pregunta 10: CP)*. ✓ Cerradas: el binario `mongo` se retiró en 6.0, `toString()` de `ObjectId` devuelve el hexadecimal y la imagen `mongo:8` corre en UTC |
| [[Mapa de exámenes\|Mapa de exámenes]] § *Dudas abiertas* | El formato del parcial 2026 *(plataforma, como el 2Q2025, o impreso y de desarrollo, como el [[Parcial XC-202X\|XC-202X]] y el [[Parcial 2Q-2023\|2Q-2023]])*; cómo clasifica la cátedra a Neo4j en CAP *(el slide 18 no lo ubica y los exámenes viejos lo preguntan)*; la disputa CAP de Redis *(CP el deck, AP Corbellini, CA Seven Databases)*; si las preguntas de Cassandra del parcial 2026 serán de definición, como en 2025, o de razonamiento aplicado. ✓ **Hecha** la propagación de la evidencia del Parcial 2Q2025 a [[Clase 06 - Vistas-Parte 1]], [[Práctica 2026-08-11]] y [[Clase 09 - Restricciones integridad-Parte 1]]: las tres tienen su nota *(nota) Evidencia de exámenes viejos* |
| [[1.03.02 - DDL — creación y alteración de tablas\|DDL]] · [[1.05.01 - SQL — consultas\|SQL — consultas]] · [[1.06.01 - Vistas\|Vistas]] · [[1.08.01 - Plan de ejecución\|Plan de ejecución]] · [[1.11.01 - Seguridad en bases de datos\|Seguridad]] · [[1.11.02 - Usuarios, privilegios y roles\|Usuarios y roles]] · [[1.11.03 - Transacciones y ACID\|ACID]] · [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Aislamiento]] § *Dudas abiertas* | **Motor del parcial:** abierta en Plan de ejecución, DDL, SQL — consultas y la [[Práctica 2026-08-18]]: el TP5 confirma MySQL para la práctica; la Pregunta 2 del [[Parcial 2Q2025\|Parcial 2Q2025]] nombra MySQL y el [[Parcial 2Q-2023\|Parcial 2Q-2023]] presupone PostgreSQL, indicios de otros años. **Vistas:** ✓ MySQL 9.7.2 aplica la lectura de `LOCAL` del estándar y ✓ acepta `CREATE MATERIALIZED VIEW` sin materializar; siguen (crítico) la actualizabilidad con `JOIN`, qué lectura de `LOCAL` corrige la cátedra y si entran las vistas materializadas *(las mismas de las Clases 06 y 07)*. **Plan:** las de la Clase 08 *(versión de `EXPLAIN ANALYZE`, `EXPLAIN (ANALYZE, BUFFERS)`, `cpu_operator_cost`, GEQO, estrategias de join, costos de los slides 16–17)* más `explain()` de MongoDB. **DDL** y **SQL — consultas:** las de los decks 04 y 05 *(tipeos, `(OJO)!!!`, `DROP CONSTRAINT`, `TRUNCATE`, `FALSE`/`UNKNOWN`, collation, `ANY`/`ALL`, operadores de conjunto)*. **1.11.01–1.11.04:** las de la Clase 11 *(qué capa de seguridad evalúa el parcial, `'u'@'localhost'` vs. `'%'`, phantoms en `REPEATABLE READ`, deadlocks y 2PL, transacciones en el parcial)* |
| [[2.12.01 - NoSQL — origen, propiedades y taxonomía\|Taxonomía NoSQL]] · [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] · [[2.12.04 - Teorema CAP\|Teorema CAP]] · [[2.12.05 - BASE y consistencia eventual\|BASE]] · [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] · [[2.13.01 - Documentos embebidos vs. referencias\|Embebidos]] · [[2.13.02 - Relaciones 1:1, 1:N y N:M en MongoDB\|Relaciones]] · [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] · [[2.14.03 - MapReduce\|MapReduce]] § *Dudas abiertas* | **CAP de MongoDB:** (crítico) abierta en Escalabilidad horizontal y en Teorema CAP *(indicio de 2025: CP, Pregunta 10 del Parcial 2Q2025)*, como en la Clase 12; Redis y Neo4j en CAP. Replica sets y sharding con comandos o como concepto; si entran `$lookup` y `$unwind`; si entra `mapReduce` *(como en la Clase 14)*; ✓ `db.loadServerScripts()` no existe en `mongosh` 2.11.1; índices de texto *(los geoespaciales ✓ entraron con el `2d` del TP9 Parte II)*; versión de la imagen `mongo`. Las de Taxonomía, BASE, Embebidos y Relaciones repiten las de las Clases 12 y 13: transacciones ACID, *column store* o *wide-column*, N:M, `DBRef`, `$jsonSchema`, quórum |

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
> queda es solo de versión. **Sigue sin confirmarse qué motor toma el parcial** →
> [[Práctica 2026-08-18]], [[Práctica 2026-09-01]], [[Práctica 2026-09-08]], [[Práctica 2026-09-15]].
>
> El indicio más cercano es el [[Parcial 2Q2025|Parcial 2Q2025]]: sus preguntas de SQL nombran
> **MySQL** en el enunciado (vistas, `EXPLAIN`, consultas) y las de restricciones de tabla y
> privilegios piden el **estándar** —la 24, primero el estándar y después MySQL; la 32, solo el
> estándar—. Es el mismo método de los TP6 a TP8, pero es un examen de 2025.

## Exámenes viejos

`raw/Examenes_Viejos/` guarda exámenes de otras cursadas en tres carpetas de Drive. **No es una
unidad ni una clase**: cada instancia tiene su página en `wiki/examenes/` *(`tipo: examen`,
`unidad: eval`)*, nombrada con el rótulo que trae la fuente. Como con los decks, esta tabla es el
registro de qué archivo usa cada página. Ninguno es material oficial del campus 2026: todos circulan
como copias de estudiantes. La mayoría son reconstrucciones, resoluciones o capturas hechas por
estudiantes; los enunciados de `1Q2021`, `2Q2021` y `Recuperatorio 2Q2020` no traen resolución, y
los dos de 2021 los publicó la cátedra de entonces *(Aizemberg/Rodríguez)*. Cada página dice qué tan
confiable es su fuente. Los veinte archivos figuran además en las `fuentes:` de
[[Mapa de exámenes|Mapa de exámenes]], que los cruza con el cronograma 2026.

| Archivo | Qué es | Página que lo usa | Temario |
| --- | --- | --- | --- |
| **`Drive 72.41 - BDII - Examenes Viejos/`** | | | |
| `BDII - Parcial 2Q2025.docx` | 41 capturas del examen real en la plataforma online, con la corrección y el puntaje de cada pregunta | [[Parcial 2Q2025\|Parcial 2Q2025]] | actual |
| `BDII - Parciales Viejos.pdf` | 13 págs. manuscritas de un estudiante: resuelve dos parciales —el rotulado "XC-202X" (págs. 2–4) y el "2Q-2023" (págs. 5–9)— y una práctica que rotula "subida por la cátedra" (págs. 10–13); la pág. 1 es una portada | [[Parcial XC-202X\|Parcial XC-202X]] · [[Parcial 2Q-2023\|Parcial 2Q-2023]] · [[Práctica subida por la cátedra\|Práctica subida por la cátedra]] *(lo enlazan además [[Parcial 2Q2025\|Parcial 2Q2025]], [[Clase 12 - Introduccion a NoSQL\|Clase 12]] y [[2.12.04 - Teorema CAP\|Teorema CAP]])* | actual |
| `BDII - Finales Viejos.docx` | Versión corta de dos finales, con una "Respuesta:" por pregunta | [[Final 1Jul2025\|Final 1Jul2025]] · [[Final 1Dic2023\|Final 1Dic2023]] | actual |
| `BDII - Final 1Dic2025.docx` | Enunciado reconstruido de memoria, sin respuestas | [[Final 1Dic2025\|Final 1Dic2025]] | actual |
| **`Drive bd2 (4to año 2Q)/`** | | | |
| `Copia de BDII - Finales Viejos.docx` | Versión larga: los tres finales en un documento, con respuestas más desarrolladas | [[Final 1Jul2025\|Final 1Jul2025]] · [[Final 1Dic2023\|Final 1Dic2023]] · [[Final 1Dic2025\|Final 1Dic2025]] | actual |
| `Repaso Final BD 2.docx` | Guía de estudiantes: 32 ejercicios *(Redis, DynamoDB, concurrencia, vistas, índices, CAP)*; transcribe también los tres finales | [[Repaso Final BD 2\|Repaso Final BD 2]] | actual |
| `Parciales viejos/Parcial_BDII_2Q2025_reconstruido(1).pdf` | Reconstrucción de estudiantes de las 33 preguntas, con solucionario al final *(texto)* | [[Parcial 2Q2025\|Parcial 2Q2025]] | actual |
| `Parciales viejos/Parcial_BDII_2Q2025_reconstruido.pdf` | La misma reconstrucción con imágenes y marcas de quien la completó | [[Parcial 2Q2025\|Parcial 2Q2025]] | actual |
| `Parciales viejos/parcial.pdf` · `parcial(1).pdf` | El mismo examen de otra materia, *Bases de Datos Avanzadas* (23/05/2023), con solucionario; difieren solo en la codificación de las flechas | [[Parcial 23-5-23 - Bases de Datos Avanzadas\|Parcial 23-5-23]] | anterior |
| **`Drive ITBA Informatica - 72.41/Parciales/`** | | | |
| `1Q2020 - RESUELTO (no chequeado).pdf` · `1Q2020 - RESUELTO (no chequeado).docx` | Domiciliario resuelto por un estudiante, que lo rotula "no chequeado" | [[Parcial 1Q2020\|Parcial 1Q2020]] | anterior |
| `2Q2020 - Resuelto (10 puntos).pdf` · `2Q2020 - Resuelto (10 puntos).docx` · `2Q2020 - Resuelto (10 puntos)(1).docx` | Domiciliario del 13/10/2020 resuelto por un estudiante; las dos variantes del `.docx` difieren en un detalle de transcripción | [[Parcial 2Q2020\|Parcial 2Q2020]] | anterior |
| `Recuperatorio 2Q2020.pdf` | Solo enunciado *(03/11/2020)*, sin resolución | [[Recuperatorio 2Q2020\|Recuperatorio 2Q2020]] | anterior |
| `1Q2021.pdf` · `1Q2021.docx` | Enunciado del domiciliario del 18/05/2021, sin respuestas | [[Parcial 1Q2021\|Parcial 1Q2021]] | anterior |
| `2Q2021.pdf` · `2Q2021 - Datasets.pdf` | Enunciado del domiciliario del 26/10/2021 y el detalle de sus dos datasets | [[Parcial 2Q2021\|Parcial 2Q2021]] | anterior |

**Temario `anterior`** marca los exámenes de 2020–2021 y el de *Bases de Datos Avanzadas*, que
evalúan motores o un formato que la cursada 2026 no usa *(CouchDB, ElasticSearch, HBase, PostGIS;
domiciliarios de varias horas)*. Los del temario `actual` —el parcial 2Q2025, los parciales XC-202X y 2Q-2023, tres finales de 2023
y 2025, una guía de repaso y una práctica de parcial— son los que [[Mapa de exámenes|Mapa de exámenes]] usa para priorizar el estudio
del parcial del 13/10.

## Evaluación

Según el programa: cursada = promedio entre parcial y TP Especial (el **TPO** del cronograma), mínimo
4 en cada uno; final con mínimo 4. Fechas concretas en [[_cronograma]].

Para preparar el **parcial del 13/10** con exámenes de otras cursadas:
[[Mapa de exámenes|Mapa de exámenes]] cruza los once exámenes viejos con el cronograma 2026 —formato, temas por frecuencia,
trampas recurrentes y qué estudiar primero—, y § *Exámenes viejos* de esta página dice de qué archivo
sale cada uno.
