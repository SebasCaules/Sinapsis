---
tipo: motor
resumen: "Motor de los decks, no de la cursada: PostgreSQL no se instala ni se usa en ningún TP, pero buena parte de la teórica de la U1 está escrita contra él. Sirve para identificar, deck por deck, qué del material es PostgreSQL y no confundirlo con lo que se escribe en MySQL, cuya página da la traducción."
motor: PostgreSQL
rol: motor del material, NO de la cursada
paradigma: relacional
clases: [01, 03, 04, 05, 06, 07, 08, 09, 10, 11]
tps: []
aliases:
  - PostgreSQL
  - Postgres
  - psql
  - pgAdmin
  - Arquitectura de PostgreSQL
  - Postmaster
  - PL/pgSQL
  - CREATE DOMAIN
  - Sintaxis PostgreSQL de triggers
  - refcursor
  - RETURNS TABLE
  - dollar quoting
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 01 - Introducción_BasesDeDatos.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 03 - Derivación a Esquema Lógico.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 04 - AlteraciónActualizaciónTablas.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 1.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 07 - Vistas-Parte 2.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 08 - Explicando el plan(1).pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 09 - Restricciones integridad-Parte 1.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 10 - Restricciones integridad-Parte 2.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 11 - Seguridad-Transacciones.pdf"
  - "raw/Material_Catedra/programa/Cronograma 2026-2C.pdf"
estado: procesado
---

# PostgreSQL — el motor del material, no el de la cursada

## Resumen general

Esta página identifica, deck por deck, qué partes del material de teórica de la Unidad 1 están
escritas contra PostgreSQL en lugar del motor real de la cursada, MySQL. El programa oficial promete
*"PostgreSQL avanzado"*, pero el cronograma lo desmiente: PostgreSQL no se instala, no se usa en
ningún TP y no es el motor del parcial. Aparece en los decks porque buena parte de la teórica fue
heredada de una versión anterior de la materia — en las Clases 01, 03, 04, 05 (Parte 1), 07, 08, 09 y
10, con la Clase 11 como excepción parcial (solo un ejemplo rotulado). Importa para no confundir lo
que hay que tipear con lo que solo se lee: si una sentencia de un slide no corre en un TP, el criterio
es revisar la tabla de inventario de esta página y buscar la traducción a MySQL en [[MySQL]].

Cinco reglas gobiernan la lectura del material: ante cualquier conflicto de tema o motor gana
[[_cronograma]], nunca el programa oficial; lo evaluable de los slides de PostgreSQL es la estructura
conceptual —despachador, proceso por conexión, buffer cache, WAL, plan de ejecución—, no los nombres
propios, aunque eso sigue siendo duda abierta; el deck 08 (Explain Plan, 22 slides) y ocho slides del
deck 10 (PL/pgSQL) son los más afectados y no corren tal cual en ningún TP; la Clase 11 es el primer
deck de la unidad escrito en MySQL por defecto; y el TP5 ya confirmó que se corre sobre MySQL, cerrando
la duda para la práctica, aunque sigue abierta para el parcial.

Para el parcial conviene llevarse la tabla de inventario y saber distinguir, deck por deck, qué es
PostgreSQL puro, qué es Oracle o T-SQL disfrazado de PostgreSQL, y qué corre igual en MySQL sin
traducción, como el `BEGIN` / `SELECT … FOR UPDATE` de la Clase 11.

## Qué motor es este, y por qué aparece

> [!warning] No se estudia de acá para rendir
> **La cursada corre sobre [[MySQL]].** PostgreSQL no se instala, no se usa en ningún TP y no es el
> motor del parcial. Aparece porque una parte grande de los decks de la teórica está escrita contra
> PostgreSQL, arrastrada de una versión anterior de la materia.
>
> Esta página identifica qué del material es PostgreSQL para no confundirlo con lo que hay que
> tipear: si una sentencia de un slide no corre en el TP, el primer lugar donde mirar es el
> § *Inventario* de abajo; la traducción está en [[MySQL]].
>
> Lo **evaluable** de estos slides es la **estructura conceptual** (despachador · proceso por conexión ·
> buffer cache · WAL · fsync · plan de ejecución · costos), **no los nombres propios de PostgreSQL** —
> salvo que la cátedra diga lo contrario, que es una duda abierta.

---

## Qué dice el material sobre PostgreSQL

Los **dos únicos slides** de todo el vault que presentan a PostgreSQL como motor son el 12 y el 13 del
deck `BD2_Clase 01 - Introducción_BasesDeDatos.pdf`
→ [[Clase 01 - Introducción_BasesDeDatos]].

### Slide 12 · "Qué es PostgreSQL?"

> [!bug] El título del slide no lleva `¿` de apertura
> Textual: *"QUÉ ES POSTGRESQL?"*. Se transcribe así.

Los seis ítems, textuales (el slide lleva además el logo del elefante abajo a la derecha):

| Ítem | Textual del slide |
| --- | --- |
| **Tipo** | *"Sistema de Gestión de Base de Datos **Open-Source**"* |
| **Origen** | *"'**Proyecto Ingres**' en Universidad de **Berkeley**"* |
| **Primera versión** | *"Primera versión de PostgreSQL liberó en **1997**"* |
| **Portabilidad** | *"**Cross-Platform**"* |
| **Lenguaje** | *"Escrito en **C**"* |
| **Usuarios** | *"Utilizada por organizaciones tales como"* → **Yahoo · MySpace · Skype** |

> [!warning] Dos datos históricos del slide, a verificar en clase
> El linaje habitual es **Ingres → POSTGRES ("post-Ingres") → Postgres95 → PostgreSQL**; el slide dice
> *"'Proyecto Ingres' en Universidad de Berkeley"*, que salta el eslabón POSTGRES: PostgreSQL desciende
> de POSTGRES, sucesor de Ingres, no de Ingres mismo. Y **1997** es el año en que el proyecto **pasa a
> llamarse PostgreSQL**, no su primera versión (hubo versiones previas como POSTGRES y Postgres95).
> Depende de qué se cuente como "primera versión"; no hay fuente en el vault que lo confirme ni lo
> desmienta.

> [!note] La lista de usuarios está fechada
> **MySpace** y **Skype** son referencias de fines de los 2000, indicio de que el bloque viene de una
> versión vieja del deck — coherente con que la cursada ya no use PostgreSQL.

### Slide 13 · Arquitectura de PostgreSQL

Slide de una sola imagen, sin texto explicativo: un diagrama de bloques con **Cliente** (arriba) y
**Servidor** (abajo). Reconstrucción, según la lectura hecha en
[[Clase 01 - Introducción_BasesDeDatos|la Clase 01]]:

```
┌─ CLIENTE ─────────────────────────────────────────────────────┐
│  ┌──────────────┐  │
│  │  Aplicación  │  │
│  └──────┬───────┘  │
│  ▲▼  │
│  ┌──────────────┐  │
│  │  LIBPG  │  │
│  └──┬────────┬──┘  │
└───────────────────────│────────│──────────────────────────────┘
  Conexión inicial  ▲▼  ▲▼  Autenticación, consultas y resultados
┌─ SERVIDOR ────────────│────────│──────────────────────────────┐
│  ┌ postgresql.conf ┐  │  │  │
│  ├ pg_hba.conf  ┤  │  │  (sin flecha en el dibujo)  │
│  └ pg_ident.conf  ┘  ▼  ▼  │
│  ┌────────────┐  ┌──────────┐  │
│  │ Postmaster │───▶│ Postgres │┐  │
│  └────────────┘  └──────────┘│┐  ← 3 cajas  │
│  └──────────┘│  apiladas  │
│  └──────────┘  │
│  ▲▼  ▲▼  FSYNC  │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ PostgreSQL Share  │  │ Write-ahead log  │  │
│  │ Buffer Cache  │  │ (WAL)  │  │
│  └──────────┬───────────┘  └──────────┬───────────┘  │
│  ▲▼  FSYNC ▲▼  │
│  ┌─────────────────────────────────────────────┐  │
│  │  Kernel disk buffer cache  │  │
│  └──────────────────┬──────────────────────────┘  │
│  ▲▼  FSYNC  │
│  ╭─────────╮  │
│  │  Disk  │  ← en gris muy claro  │
│  │  Disco  │  │
│  ╰─────────╯  │
└───────────────────────────────────────────────────────────────┘
```

Pieza por pieza, tal como se lee en el slide:

| Elemento | Dónde | Qué se lee |
| --- | --- | --- |
| **Aplicación** | Cliente | caja en cursiva; flecha **bidireccional** hacia LIBPG |
| **LIBPG** | Cliente | caja destacada; de ella salen las dos flechas que cruzan al servidor |
| *Conexión inicial* | flecha cliente→servidor | llega al **Postmaster** |
| *Autenticación, consultas y resultados* | flecha cliente↔servidor | va contra los procesos **Postgres** |
| `postgresql.conf`, `pg_hba.conf`, `pg_ident.conf` | Servidor, izquierda | tres cajas **punteadas** pegadas al borde del Postmaster. **Sin ninguna flecha** que las conecte |
| **Postmaster** | Servidor | recibe la *Conexión inicial* y tiene flecha propia hacia el primer proceso Postgres |
| **Postgres** | Servidor | **tres cajas superpuestas y escalonadas**; la flecha de consultas llega a la de arriba |
| **PostgreSQL Share Buffer Cache** | Servidor | bidireccional con los procesos Postgres y con el kernel cache |
| **Write-ahead log (WAL)** | Servidor | la flecha que lo une a los procesos Postgres lleva el rótulo **FSYNC** |
| **Kernel disk buffer cache** | Servidor | caja ancha por debajo de las dos anteriores; bidireccional con ambas y con el disco |
| **Disco** | Servidor | cilindro, con *"Disk"* en gris muy claro arriba de *"Disco"* |

**Los tres `FSYNC`**: (1) `Postgres` ↔ `WAL`; (2) `WAL` ↔ `Kernel disk buffer cache`; (3) `Kernel disk
buffer cache` ↔ `Disco`. **Ninguno cuelga de la rama del *Share Buffer Cache*.**

> [!note] Qué se lee en la estructura — inferencias sobre el dibujo, a verificar en clase
> Un proceso por conexión: el `Postmaster` recibe la conexión inicial y hay una flecha suya hacia
> `Postgres`, que aparece triplicado. Dos capas de caché encadenadas: la del motor (*Share Buffer
> Cache*) y la del sistema operativo (*Kernel disk buffer cache*), sin paso directo del motor al
> disco. Y el camino rotulado `FSYNC` es el del WAL, no el del buffer cache de datos.

> [!bug] Dos nombres del diagrama parecen tipeos
> Dice **`LIBPG`**; la librería cliente en C de PostgreSQL se llama **`libpq`** (con `q`, de *query*).
> Y dice **"PostgreSQL Share Buffer Cache"**; el parámetro y componente real se llaman
> **`shared_buffers`** / *shared buffer cache*. Se transcriben como están en el slide; verificar en
> clase si a la cátedra le importa.

> [!warning] Nada de este diagrama se traslada a MySQL sin traducción
> Lo que **sí** se traslada es la **forma** del problema: todo motor relacional tiene un despachador,
> un proceso o hilo por conexión, una caché de páginas en memoria, un log de escritura anticipada y un
> `fsync` al disco. En MySQL/InnoDB los nombres son otros y no están acá por no tenerlos verificados
> contra ninguna fuente del vault.

---

## Lo específico de PostgreSQL que aparece en el deck de Explain Plan

`BD2_Clase 08 - Explicando el plan(1).pdf` · **22 slides** · el caso más extremo del desfasaje: es una
transcripción de sesión de `psql` de punta a punta. Página completa:
[[Clase 08 - Explicando el plan]].

> [!warning] (clave) Confirmado el 18/08: **el TP5 corre sobre MySQL**, así que este deck no se puede correr
> El enunciado del TP5 arranca *"Antes de comenzar, es necesario **levantar MySQL** en la PC que vayan
> a utilizar para este práctico"* → [[Práctica 2026-08-18]]. Todo lo que sigue —`psql`, `pg_class`,
> `\timing`, `\d`, `generate_series`, `BEGIN`/`ROLLBACK`, los `enable_*`,
> `seq_page_cost`/`cpu_tuple_cost`, los nombres de nodo del planner— es **material de lectura, no de
> tipeo**: hay que rehacerlos todos. La traducción está en [[MySQL]] § *4 · Índices y plan de
> ejecución*.
>
> Lo que **sí** se transfiere es la estructura conceptual: el plan como **árbol**, estimación ≠
> realidad, full scan vs. acceso por índice, el orden de las columnas en un índice compuesto.
>
> (atención) Se cerró la mitad **TP5**, **no la mitad parcial**: el enunciado no dice nada del parcial.

### Cliente y catálogo

| Del deck | Qué es | En MySQL |
| --- | --- | --- |
| `psql -U radiocut radiocut` | cliente de línea de comandos de PostgreSQL | cliente `mysql` |
| `pgAdmin` *(screenshot del botón "Explain query")* | GUI de PostgreSQL | MySQL Workbench: *Visual Explain* **y** *Form Editor* — el TP5 pide textualmente *"Elegir la opción "Form Editor" en MySQL Workbench para ver el árbol"*. **No se reemplaza uno por el otro**; cómo se combinan: **verificar** |
| `\timing` → *"Timing is on."* | meta-comando de `psql`: cronómetro por sentencia | el cliente `mysql` ya lo imprime |
| `\d audiocut` | meta-comando: estructura e índices de una tabla | `DESCRIBE` / `SHOW CREATE TABLE` / `SHOW INDEX` |
| `pg_class` (`relpages`, `reltuples`) | tabla del **catálogo**: páginas y tuplas de cada tabla | `information_schema.TABLES` |
| `generate_series(1,100000)` | función generadora | **no existe** → `WITH RECURSIVE` |

```sql
SELECT relpages, reltuples FROM pg_class WHERE relname = 'table';
```

```
 relpages | reltuples
----------+-----------
  358 | 10000
```

### `BEGIN` / `ROLLBACK` para medir sin ensuciar

> [!quote] Textual del slide 1
> *"Si queremos hacer un EXPLAIN ANALYZE sobre un INSERT, UPDATE, DELETE, CREATE TABLE AS, o EXECUTE
> sentencias sin que esto afecte a nuestros datos en la base, hay que usar BEGIN y ROLLBACK."*

```sql
BEGIN;
EXPLAIN ANALYZE ...;
ROLLBACK;
```

> [!warning] Este truco **no funciona en MySQL** para DDL
> En PostgreSQL el DDL es **transaccional**: un `CREATE TABLE AS` dentro de `BEGIN … ROLLBACK`
> desaparece. En **MySQL el DDL hace `COMMIT` implícito**, así que el `CREATE TABLE AS` del slide 2
> quedaría creado igual y además cerraría la transacción. Es una diferencia de **fondo** entre los dos
> motores, no de sintaxis. Queda como duda abierta cómo se hace el equivalente en MySQL.

### El modelo de costos

Los **doce parámetros `enable_*`** que lista el deck (`enable_seqscan`, `enable_indexscan`,
`enable_indexonlyscan`, `enable_bitmapscan`, `enable_hashagg`, `enable_hashjoin`, `enable_mergejoin`,
`enable_nestloop`, `enable_sort`, `enable_material`, `enable_gathermerge`, `enable_tidscan`) son
**parámetros de sesión de PostgreSQL**, todos prendidos por defecto:

```sql
set enable_seqscan = off;
```

> [!quote] Textual del slide
> *"Si queremos forzar a que no tome una estrategia, lo podemos apagar (temporalmente y sólo para
> nuestra sesión)"* · *"También se pueden cambiar los costos (yo no los cambiaría)"*

Las dos constantes que da el deck, y la fórmula:

```
cpu_tuple_cost = 0.01
seq_page_cost  = 1

(páginas * seq_page_cost) + (tuplas_a_retornar * cpu_tuple_cost)
```

> [!important] La fórmula es exacta, y es de PostgreSQL
> Verificada contra tres `Seq Scan` del propio deck: `4440 × 1 + 532733 × 0.01 = 9767.33`, que es
> exactamente el costo del `Seq Scan on ar_amba_points`. **MySQL tiene otro modelo de costos**
> (configurable en `mysql.server_cost` y `mysql.engine_cost`) y su `EXPLAIN` clásico ni siquiera
> imprime un costo por nodo. Detalle en [[Clase 08 - Explicando el plan]].

### Nodos del planner que solo existen con ese nombre en PostgreSQL

`Seq Scan` · `Parallel Seq Scan` · `Index Scan` · `Index Only Scan` · `Parallel Index Only Scan` ·
`Aggregate` · `Partial Aggregate` / `Finalize Aggregate` · `HashAggregate` · `Sort` · `Limit` ·
`Gather` · `Result` + `InitPlan`.

Y sus anotaciones: `Index Cond:` · `Filter:` · `Rows Removed by Filter:` · `Heap Fetches:` ·
`Sort Key:` / `Group Key:` · `Output:` · `Buffers: shared hit=/read=` · `Workers Planned/Launched:` ·
`JIT:`.

Más lo que el deck menciona sin explicar: **GEQO** (*Genetic Query Optimization*), el comando
**`ANALYZE tabla`** (que **no** es `EXPLAIN ANALYZE`), y la opción **`BUFFERS`** con su
`shared hit` / `read` / `dirtied` / `written`.

### Los seis links de documentación del deck

El deck de explain plan **no cita un solo libro**: cita seis páginas de la documentación de PostgreSQL.

- `https://www.postgresql.org/docs/current/sql-explain.html` — **EXPLAIN**
- `https://www.postgresql.org/docs/current/static/planner-stats-details.html` — *How the Planner Uses Statistics*
- `https://www.postgresql.org/docs/current/static/runtime-config-query.html` — *Query Planning*
- `https://www.postgresql.org/docs/current/static/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS` — *Planner Cost Constants*
- `https://www.postgresql.org/docs/current/static/geqo-pg-intro.html` — *Genetic Query Optimization*
- `https://www.postgresql.org/docs/current/using-explain.html` — *Performance Tips > Using EXPLAIN*

---

## Inventario: qué partes del material están en PostgreSQL

> [!important] Ésta es la tabla operativa de la página
> Si una sentencia del slide no corre en el TP, buscá acá de qué deck viene; la traducción a MySQL está
> en **[[MySQL]] § Tabla de diferencias**.

| # | Deck | Qué hay de PostgreSQL | Gravedad | Página |
| --- | --- | --- | --- | --- |
| **1** | `BD2_Clase 01` — Introducción | Slides **12–13**: *"Qué es PostgreSQL?"* y *"Arquitectura de PostgreSQL"* — el slide institucional de *"qué motor usamos"*, en la **primera clase** | **de fondo**: es identidad de motor, no sintaxis | [[Clase 01 - Introducción_BasesDeDatos]] |
| **2** | `BD2_Clase 03` — Derivación a Esquema Lógico | Slide **10**: link al catálogo de tipos de **PostgreSQL 9.5**. Slides **23–24**: la gramática de `CREATE TABLE` es el *synopsis* de PostgreSQL (`index_parameters`, `DEFAULT default_expr`, `REFERENCES` como *column_constraint*) | media: los `CREATE TABLE` de ejemplo son estándar y corren igual | [[Clase 03 - Derivación a Esquema Lógico]] |
| **3** | `BD2_Clase 04` — Alteración de Tablas | Slide **3**, textual: ***"La sintaxis de PostgreSQL"***. **Tres operaciones no compilan en MySQL**: cambio de tipo (`ALTER COLUMN … TYPE`) y las dos de nulidad (`SET`/`DROP NOT NULL`). Más `DROP CONSTRAINT` sobre una FK y el `DROP TABLE … CASCADE\|RESTRICT` | **alta**: rompe el TP2 al tipear | [[Clase 04 - AlteraciónActualizaciónTablas]] |
| **4** | `BD2_Clase 05` — Consultas, Parte 1 | Título de slide **literal**: `LIMIT and OFFSET (PostgreSQL)`. `LIMIT ALL`, `OFFSET` sin `LIMIT`, el mensaje de error `ERROR: aggregates not allowed in WHERE clause`, el *case folding* de alias | media | [[Clase 05 - Consultas de Datos–Parte 1]] |
| **5** | `BD2_Clase 05` — Consultas, Partes 2 y 3 | Nada de PostgreSQL en ninguna de las dos partes. **Parte 2 → Oracle**, pero solo dentro de imágenes: el slide 4 y el slide 8 llevan un recorte del DER con `VARCHAR2(40)`, `NUMBER(4)`, `NUMBER(8,2)`, `CHAR(2)`, `DATE` (el DER original está en el slide 5 de la Parte 1); el texto no nombra motor. **Parte 3 → T-SQL/SQL Server**: `SELECT top 3` (s9), `datepart(month,getdate())` (s14), `DATENAME` (s15), `DATEDIFF` de tres argumentos (s16), conviviendo con **MySQL genuino** (backticks s6, s10–13; `LIMIT 0 , 30` s10). *(El `FULL JOIN` y el "null es el mayor" del `ORDER BY` son SQL estándar y no delatan motor.)* | baja | [[Clase 05 - Consultas de Datos–Parte 2]] · [[Clase 05 - Consultas de Datos–Parte 3]] |
| **6** | `BD2_Clase 06` — Vistas, Parte 1 | `DROP VIEW … RESTRICT \| CASCADE` con la semántica del estándar, que **PostgreSQL implementa de verdad y MySQL ignora**. El bloque de vistas materializadas es teórico para MySQL | media | [[Clase 06 - Vistas-Parte 1]] |
| **7** | `BD2_Clase 07` — Vistas, Parte 2 | Slide **21**: `CREATE MATERIALIZED VIEW … WITH [NO] DATA`, **sintaxis de PostgreSQL**, con las viñetas en inglés hablando de *"a Postgres materialized view"*. Slide **12**: el comentario *"en PostgreSQL la función podría implementar el comportamiento para todos los eventos"* sobre triggers `INSTEAD OF` | **alta**: MySQL **no tiene** vistas materializadas — lo dice el propio slide 20 | [[Clase 07 - Vistas-Parte 2]] |
| **8** | `BD2_Clase 08` — Explicando el plan | **PostgreSQL puro, los 22 slides.** `psql`, `pg_class`, `\timing`, `\d`, `generate_series`, `BEGIN/ROLLBACK`, `enable_*`, `seq_page_cost` / `cpu_tuple_cost`, `pgAdmin`, GEQO, `BUFFERS`, `JIT`, todos los nombres de nodo del planner, y **seis links a la doc de PostgreSQL y ninguna otra fuente** | **máxima**, y confirmada: el TP5 es sobre este deck y **corre en MySQL** | [[Clase 08 - Explicando el plan]] · [[Práctica 2026-08-18]] |
| **9** | `BD2_Clase 09` — Restricciones de integridad | **El deck lo declara cuatro veces.** Slide **27**: el título es ***"TRIGGERS – SINTAXIS PostgreSQL"***. Slide **12**: *"MATCH SIMPLE (Opción por defecto para SQL estandar **y PostgreSQL**)"*. Slide **36**: la función de ejemplo es **PL/pgSQL** (`RETURNS trigger AS $body$ … LANGUAGE 'plpgsql'`, con `TG_OP`). Slide **39**: la primera fuente que cita es *"Capitulo 36 del **Manual de PostgreSQL**"*. Más `CREATE DOMAIN`, `CREATE ASSERTION`, `MATCH FULL/PARTIAL`, `SET DEFAULT`, `FOR EACH STATEMENT`, `INSTEAD OF` y `WHEN` — **nada de eso existe en MySQL** | **alta**: de los cuatro recursos declarativos que enseña, MySQL tiene **uno y medio**; y de las ocho cláusulas del `CREATE TRIGGER` del slide 27, **ninguna igual** | [[Clase 09 - Restricciones integridad-Parte 1]] · [[Práctica 2026-08-25]] |
| **10** | `BD2_Clase 10` — Restricciones de integridad, Parte 2 *(su portada dice **"SQL PROCEDURAL"**)* | **Ocho slides de PL/pgSQL puro, del 6 al 13**, los ocho titulados *"Procedimientos/Funciones en **Postgres**"*. Slide **6**, textual: *"Para **Postgres** todos son funciones, sólo que hay funciones que devuelven **void** ( Procedimientos )"*, con `RETURNS tipo AS $$ … END; $$ LANGUAGE plpgsql;` — **`$$` y `plpgsql` marcados en rojo en el slide**. Slide **7**: `CREATE OR REPLACE FUNCTION Sumador(integer)` con `RETURN $1 + 1`. Slide **8**: `ALIAS FOR $1` · `CONSTANT` · `%rowtype` · `%type`. Slides **9–11**: *"todo el acceso a cursores en **PL/pgSQL** es a través de … el tipo de datos especial **refcursor**"*, `nombre CURSOR [ ( argumentos ) ] FOR select_query`, y la variable **`FOUND`**. Slides **12–13**: `RETURNS TABLE(…)`, `LANGUAGE plpgsql AS $$`, **`RETURN QUERY`**, **`RETURN NEXT`**, `record`, `FOR … IN (SELECT …) LOOP`. Slide **17**, textual: *"**Postgres NO implementa este tipo de checks**"*. Slide **20**: **los dos únicos links de todo el deck** son `postgresqltutorial.com` y **`postgresql.com`** *(sic — el sitio oficial es `postgresql.org`)* | **máxima**: MySQL sí tiene *stored programs*, pero de las ~20 construcciones del deck **ninguna se tipea igual** y **siete no tienen sustituto** — `%rowtype`, `%type`, `record`, `refcursor`, cursor parametrizado, `FOR`-sobre-resultado y `RETURNS TABLE`. (atención) El deck trae además Oracle: ver el callout de abajo | [[Clase 10 - Restricciones integridad-Parte 2]] · [[Práctica 2026-09-01]] · [[MySQL]] § *6* |
| **11** | `BD2_Clase 11` — Seguridad-Transacciones | **El primer deck de la U1 escrito en MySQL por defecto** *(slide **7**: *"Mecanismos de Seguridad **(MySQL)**"*; slide **38**: *"Ejemplo en **MySQL**"*)*, y **su motor ajeno son dos ejemplos rotulados por el propio deck**, no el contenido. Slide **30**, textual: `-- Ejemplo de control de versiones en PostgreSQL` → `BEGIN; SELECT * FROM productos FOR UPDATE; … UPDATE productos SET stock = stock - 1 WHERE id = 1; COMMIT;`. Slide **29**, textual: `-- Ejemplo de bloqueo en SQL Server` → `BEGIN TRANSACTION; SELECT * FROM productos WITH (UPDLOCK); … COMMIT TRANSACTION;`. Y un tercer lugar **sin rótulo**: el **slide 35** da `drop index <nombre-índice>` sin `ON <tabla>`, la forma del estándar y de PostgreSQL. Detalle en el callout de abajo | **baja**: es la primera fila de la tabla en la que el código PostgreSQL **corre en MySQL sin cambiar una letra** (`BEGIN` es alias de `START TRANSACTION` y `SELECT … FOR UPDATE` existe igual, manual 9.7 § 15.3.1 y § 17.7.2.4). Lo que **no** corre es el slide 29 (T-SQL) y el `drop index` del 35 (en MySQL el `ON tbl_name` es obligatorio, § 15.1.32) | [[Clase 11 - Seguridad-Transacciones]] · [[Práctica 2026-09-08]] · [[MySQL]] |
| **12** | `esq_peliculas.sql` *(no es un deck)* | El script **es MySQL** (`DROP FOREIGN KEY`), pero conserva rastros de un **dump de PostgreSQL**: tipos escritos `character varying(n)` / `numeric(p,s)` y nombres de FK con la convención automática `<tabla>_<columna>_fkey` | baja: corre igual | [[Práctica 2026-08-04]] · [[MySQL]] |
| **13** | *Seven Databases* cap. **2.2** *(bibliografía, no es material propio de la cátedra)* | **El desfasaje también llegó a la bibliografía.** El TP5 asigna como teoría de índices el § *Fast Lookups with Indexing* — que es el **capítulo 2, el de PostgreSQL** (pp. **18–21 impresas**): sintaxis `CREATE INDEX … USING hash (…)` y el mensaje `PRIMARY KEY will create implicit index "events_pkey"`. La cátedra lo aclara en el enunciado: *"si bien el libro hace mención a PostgreSQL, **también aplica para MySQL**"* | baja: lo pedido es el **concepto** —una PK crea un índice automáticamente, y es un **B-tree**—, no la sintaxis | [[Práctica 2026-08-18]] · [[_index-bibliografia]] |

Los decks `BD2_Clase 06`, `07`, `08`, `09`, `10` y `11` son las **Clases 06 a 11** —la cátedra las numera
en el nombre del archivo— y viven en `raw/Unidad-01/Teorica/`: la **Unidad-01 agrupa las Clases 01 a 11**
*(y los TP1 a TP8)*, y el path no dice a qué clase pertenece un archivo — eso lo registra
[[_index-clases]].

> [!success] (clave) Conteo final, verificado el 16/09 sobre los trece archivos de la Unidad 1
> **Decks en PostgreSQL: 8** — `01` · `03` · `04` · `05-P1` · `07` · `08` · `09` · `10` (coincide con
> [[MySQL]] § *Por qué MySQL*). **Con algún motor ajeno: 11 de 13** — los ocho anteriores más `05-P2`
> (Oracle, dentro de imágenes) y `05-P3` (T-SQL), más el `11` (un ejemplo PostgreSQL rotulado en el
> slide 30 y uno T-SQL en el 29). **Limpio: `02`**, ni una sentencia SQL en todo el deck. **Caso
> aparte: `06`**, cuya única mención de Oracle (slide 11) es atribución histórica del término
> *key-preserved*, no sintaxis — por eso esta tabla lo cuenta (trae `DROP VIEW … RESTRICT|CASCADE`,
> que PostgreSQL implementa y MySQL ignora) y [[MySQL]] no: son dos criterios distintos, no un
> desacuerdo. **Decks con Oracle: 3** (`05-P1`, `05-P2`, y `10` en los slides 9 y 17). **Con MySQL como
> motor por defecto: 1**, la Clase 11. Los decks `12`–`14` (Clases 12 a 14, del 14/09) no entran en
> este inventario: están escritos en **MongoDB**, el motor correcto de la segunda mitad, y viven en
> `raw/Unidad-02/Teorica/`; su página de motor es [[MongoDB]]. (Coincide con que el deck 07 sí trae
> PostgreSQL, en el slide 21, y que el desfasaje del 05 arranca en la Parte 1, no en las 2–3.)
>
> El PostgreSQL y el Oracle del deck 10 viven en la **capa de texto**, verificable con `grep`
> (`Postgres` ×11, `postgresql` ×2, `plpgsql` ×5, `refcursor` ×3, `%rowtype` ×2, y `sysdate` /
> `months_between` para el Oracle), y no dependen de renderizar imágenes: se renderizaron igual los 20
> slides, y sus imágenes son decoración de plantilla más tres diagramas de entidad sin un solo tipo de
> dato, así que no esconden un cuarto motor.

> [!success] (clave) La Clase 11 es el primer deck de la U1 con MySQL como motor por defecto
> Diez slides con MySQL explícito (slide **7** *"Mecanismos de Seguridad **(MySQL)**"*, slide **38**
> *"Ejemplo en **MySQL**"*, más `CREATE USER 'u'@'host'`, el comodín `'%'`, `CREATE ROLE`,
> `FLUSH PRIVILEGES`, el operador `<=>`), uno con SQL Server (slide 29, T-SQL) y uno con PostgreSQL
> (slide 30); el resto, estándar o sin motor.
>
> **El ejemplo PostgreSQL del slide 30 corre en MySQL tal cual, sin traducción**: `BEGIN` está
> documentado como alias de `START TRANSACTION` *(manual 9.7, § 15.3.1 *START TRANSACTION, COMMIT, and
> ROLLBACK Statements*)* y `SELECT … FOR UPDATE` es la lectura con bloqueo de InnoDB *(§ 17.7.2.4
> *Locking Reads*)*. Es la única pieza de código ajeno de toda la unidad que no hace falta reescribir;
> el deck no lo dice, y el rótulo *"control de versiones"* está mal — `FOR UPDATE` adquiere un bloqueo
> → [[Clase 11 - Seguridad-Transacciones]] § *Slides 29–30* y
> [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]].
>
> Dos cosas sí muerden en MySQL y no están rotuladas: el **slide 35** escribe `drop index
> <nombre-índice>` a secas —forma del estándar y de PostgreSQL— y MySQL exige `DROP INDEX nombre ON
> tabla` *(§ 15.1.32 *DROP INDEX Statement*)*; y el **slide 38** promete un índice hash con `USING
> HASH` sobre InnoDB, que solo admite `BTREE` *(Table 15.1, § 15.1.18 *CREATE INDEX Statement*)*: la
> sentencia no falla, pero el `USING HASH` se ignora en silencio —el warning documentado es el de
> índices multivaluados; no se corrió `SHOW WARNINGS` en el contenedor para confirmarlo sobre este caso
> puntual—, y se confirmó igual sobre los PNG de los **slides 29** y 30 → [[Clase 11 -
> Seguridad-Transacciones]] § *Slide 38*. Coincide con [[MySQL]] § *8* y [[1.08.02 - Índices|Índices]].
> Los dos motores ajenos del `11` viven en la **capa de texto** (`PostgreSQL` ×1, `SQL Server` ×1,
> `UPDLOCK` ×1, `FOR UPDATE` ×1), verificable con `grep`; sus otras siete imágenes son adornos, salvo
> el diagrama de estados del slide 20, que no tiene una sola línea de SQL.
>
> Y la ausencia más grave no es sintaxis ajena: **el deck no muestra ni una transacción en MySQL**
> (sus únicos `BEGIN … COMMIT` son el de SQL Server y el de PostgreSQL). `START TRANSACTION`,
> `ROLLBACK`, `autocommit` y que InnoDB arranca en `REPEATABLE READ` quedan para [[MySQL]] § *8 ·
> Transacciones* y [[1.11.03 - Transacciones y ACID|Transacciones y ACID]].
>
> El **TP8** confirma el patrón desde la práctica: *"Resuelva el ejercicio desde la teoría, ya que
> MySQL no provee la opción CASCADE"* *(ej. 1.b)*. Lo que pide —`REVOKE … CASCADE`, un *owner* de la
> tabla, `PUBLIC`— es el modelo de GMUW 10.1, que PostgreSQL implementa *(`sql-revoke.html`: sinopsis
> con `[ CASCADE | RESTRICT ]`, `PUBLIC` como "the implicitly defined group of all roles")* y MySQL no.
> Detalle en [[Práctica 2026-09-08]] § *Qué de este TP no se puede correr en MySQL* y en
> [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]]. Es el **tercer TP
> consecutivo** *([[MySQL]] § *Por qué MySQL*: TP6 → TP7 → TP8)* con consignas *"desde la teoría"* que
> MySQL no cubre.

> [!bug] (nota) El slide **17** del deck 10 **no es PostgreSQL: es Oracle**
> Textual:
>
> ```sql
> having avg( months_between ( sysdate, fecha_nacimiento ) ) > (50 * 12)
> ```
>
> **Las dos funciones son de Oracle**: `months_between` no existe ni en PostgreSQL ni en MySQL, y
> `sysdate` **sin paréntesis** es la grafía de Oracle *(MySQL tiene `SYSDATE()`, con paréntesis y con
> otra semántica; PostgreSQL no la tiene)*. La traducción a MySQL —**`TIMESTAMPDIFF(MONTH, desde,
> hasta)`, con los argumentos en el orden inverso**— está en [[MySQL]] § *6.5*.
>
> (clave) El mismo slide agrega, dos líneas después: *"**Postgres NO implementa este tipo de checks**,
> Postgres no permite un `select` dentro de un constraint…. :("* — un ejemplo escrito en Oracle que
> declara, en la línea siguiente, que su propio motor de referencia no lo soporta. Consecuencia: el
> `CHECK` con subconsulta **no es una carencia de MySQL frente a PostgreSQL** —no lo tiene ninguno de
> los dos, igual que `CREATE ASSERTION`—, y por eso se corrigió la tabla de [[MySQL]] § *5*, que lo
> insinuaba.
>
> El otro rastro de Oracle está en el **slide 9**: `curs3 CURSOR (key int) IS SELECT …`, donde el
> **`IS`** es PL/SQL — el mismo slide da la gramática con `FOR` cuatro líneas más arriba, así que se
> contradice solo.

### La contradicción interna del deck de introducción

El caso 1 es especial porque el deck **se contradice a sí mismo**: el slide 2 manda a bajar **MySQL
Workbench** y **XAMPP**, y diez slides después explica el `Postmaster` de PostgreSQL. Los dos no pueden
ser verdaderos a la vez. La resolución, según las reglas del vault, es que **gana el cronograma**:
la cursada es MySQL, y los slides 12–13 se estudian como **ejemplo de arquitectura de un SGBD
relacional**.

---

## Dudas abiertas

- [ ] ¿Los slides 12–13 de la [[Clase 01 - Introducción_BasesDeDatos|Clase 01]] son evaluables, o
  quedaron de una versión anterior del deck?

> [!note] El número de clase sale siempre del nombre del deck
> No de un esquema `[[Clase NN …]]` inventado ni de una numeración propia de esta página.
- [x] ~~¿El TP5 (Explain Plan) corre sobre MySQL o sobre PostgreSQL?~~ **Resuelto: MySQL**, dicho en la
  primera línea del enunciado del 18/08 → [[Práctica 2026-08-18]]. Hay que rehacer todos los ejemplos
  del deck 08, porque las salidas no se parecen en nada. *(Se cerró la mitad TP5; la mitad **parcial**
  sigue abierta.)*
- [ ] ¿*"Proyecto Ingres"* y *"primera versión en 1997"* (slide 12) son precisos, o simplificaciones?
- [ ] ¿`LIBPG` y `Share Buffer Cache` del diagrama son tipeos por `libpq` y *shared buffer cache*?
- [ ] ¿Qué relación tienen los tres `.conf` con el `Postmaster`? En el diagrama están apoyados contra
  su caja **sin ninguna flecha**.
- [ ] ¿Cuál es el equivalente en **MySQL/InnoDB** de cada pieza del diagrama (postmaster, proceso por
  conexión, share buffer cache, WAL)?
- [ ] **¿Qué versión de PostgreSQL usa el material?** El deck 08 mezcla `Total runtime:` (etiqueta
  vieja) con `Planning time:` / `Execution time:` (nueva), y el deck 03 linkea la **9.5**, que ya no
  tiene soporte.
- [ ] ¿Cuánto hay que saber de **GEQO**? El slide 10 del deck 08 pone el título y el link, y nada más.
- [ ] Si en el parcial cae una consigna escrita en sintaxis PostgreSQL, **¿se responde en PostgreSQL o
  se traduce a MySQL?** El TP6 aporta un método, no un veredicto: su ejercicio 3 pide las sentencias
  primero *"en SQL estándar"* (3.b) y después *"las que puedan ser soportadas por **MySQL**"* (3.c) →
  [[Práctica 2026-08-25]]. Sigue sin confirmarse para el parcial.
- [ ] **¿`CREATE DOMAIN`, `CREATE ASSERTION` y `MATCH FULL/PARTIAL` entran al parcial?** Son del
  estándar: PostgreSQL tiene el primero, **MySQL no tiene ninguno** y `ASSERTION` no la tiene nadie.
  La Clase 09 les dedica ocho slides, y la Clase 10 vuelve sobre el tema (slide **18**: *"ninguna base
  de datos comercial implementa Assertions"*) → [[Clase 09 - Restricciones integridad-Parte 1]] ·
  [[Clase 10 - Restricciones integridad-Parte 2]].
- [ ] **¿Entra `PL/pgSQL` al parcial, o alcanza con el concepto de SQL procedural?** El deck 10 le
  dedica **ocho slides** —`$$`, `LANGUAGE plpgsql`, `refcursor`, `%rowtype`, `RETURN QUERY`,
  `RETURN NEXT`— que no se pueden tipear en MySQL. La traducción, construcción por construcción, está
  en [[MySQL]] § *6*.

## Enlaces

- Motor de la cursada: **[[MySQL]]** · otros motores: [[MongoDB]] · [[Cassandra]] · [[Neo4j]] ·
  [[Redis]] · [[DynamoDB]]
- Clases donde aparece PostgreSQL:
  [[Clase 01 - Introducción_BasesDeDatos]] ·
  [[Clase 03 - Derivación a Esquema Lógico]] ·
  [[Clase 04 - AlteraciónActualizaciónTablas]] ·
  [[Clase 05 - Consultas de Datos–Parte 1]] ·
  [[Clase 06 - Vistas-Parte 1]] · [[Clase 07 - Vistas-Parte 2]] ·
  [[Clase 08 - Explicando el plan]] · [[Clase 09 - Restricciones integridad-Parte 1]] ·
  [[Clase 10 - Restricciones integridad-Parte 2]] *(PL/pgSQL — y un slide de Oracle)* ·
  [[Clase 11 - Seguridad-Transacciones]] *(un slide rotulado PostgreSQL, uno SQL Server; el resto MySQL)*
- Prácticas donde muerde el desfasaje: [[Práctica 2026-08-18]] *(TP5)* · [[Práctica 2026-08-25]] *(TP6)* ·
  [[Práctica 2026-09-01]] *(TP7)* · [[Práctica 2026-09-08]] *(TP8 — en la dirección inversa)*
- Conceptos: [[1.08.01 - Plan de ejecución|Plan de ejecución]] · [[1.08.02 - Índices|Índices]] ·
  [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] · [[1.09.04 - Triggers|Triggers]] ·
  [[Costo de una consulta]] ·
  [[Estadísticas del optimizador]] · [[1.06.01 - Vistas|Vistas]] ·
  [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] ·
  [[1.11.03 - Transacciones y ACID|Transacciones y ACID]] ·
  [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] ·
  [[Sintaxis MySQL vs PostgreSQL]]
- Calendario: [[_cronograma]] § *Diferencias con el programa oficial* · índice de clases:
  [[_index-clases]] · bibliografía: [[_index-bibliografia]]
