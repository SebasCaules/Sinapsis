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

> [!warning] No se estudia de acá para rendir
> **La cursada corre sobre [[MySQL]].** PostgreSQL no se instala, no se usa en ningún TP y no es el
> motor del parcial. Aparece porque **una parte grande de los decks de la teórica está escrita contra
> PostgreSQL**, arrastrada de una versión anterior de la materia.
>
> Esta página está para **identificar qué del material es PostgreSQL** y no confundirlo con lo que hay
> que tipear. Cada vez que una sentencia de un slide no corra en el TP, el primer lugar donde mirar es
> el § *Inventario* de abajo; la traducción está en [[MySQL]].
>
> Lo **evaluable** de estos slides es la **estructura conceptual** (despachador · proceso por conexión ·
> buffer cache · WAL · fsync · plan de ejecución · costos), **no los nombres propios de PostgreSQL** —
> salvo que la cátedra diga lo contrario, que es una duda abierta.

## Resumen

| | |
| --- | --- |
| **Rol real** | Motor de **los decks**, no de la práctica. Cero TPs, cero instalación |
| **Rol según el programa oficial** | *"PostgreSQL avanzado"* — **el cronograma lo desmiente** |
| **Dónde aparece** | Clases **01**, **03**, **04** y **05-P1**; más **Vistas P2** (Clase 07), **Índices / Explain Plan** (Clase 08), **Restricciones de integridad** (Clase 09) y **SQL procedural** (Clase **10**). En **Seguridad-Transacciones** (Clase **11**) solo como **un ejemplo rotulado** *(slide 30)* dentro de un deck escrito en MySQL |
| **Deck más afectado** | `BD2_Clase 08 - Explicando el plan(1).pdf` — **PostgreSQL puro, 22 slides**. **Segundo por densidad, el `BD2_Clase 10`: ocho de sus veinte slides son PL/pgSQL de punta a punta**, y son los que hay que reescribir enteros para el TP7. Tercero el `BD2_Clase 09`, cuyo slide 27 se titula literalmente ***"SINTAXIS PostgreSQL"*** |
| **Autoridad que resuelve el conflicto** | [[_cronograma]] § *Diferencias con el programa oficial* |

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

> [!warning] Dos datos históricos del slide que conviene verificar
> **Razonamiento propio, no está en el deck.** Se transcriben como los dice el slide, pero:
> - *"'Proyecto Ingres' en Universidad de Berkeley"* — el linaje que se cuenta habitualmente es
>   **Ingres → POSTGRES ("post-Ingres") → Postgres95 → PostgreSQL**, todos en Berkeley. Llamar
>   *Proyecto Ingres* al origen salta un eslabón: PostgreSQL desciende de **POSTGRES**, que fue el
>   **sucesor** de Ingres, no de Ingres mismo.
> - *"Primera versión … 1997"* — 1997 es la fecha en que el proyecto **pasa a llamarse PostgreSQL**;
>   hubo versiones previas bajo los nombres POSTGRES y Postgres95.
>
> Las dos dependen de qué se cuente como "primera versión". **Verificar en clase**; no hay fuente en el
> vault que las respalde ni las desmienta.

> [!note] La lista de usuarios está fechada
> **Razonamiento propio:** **MySpace** y **Skype** son referencias de fines de los 2000. Es un indicio
> de que este bloque viene arrastrado de una versión vieja del deck — lo que encaja con que la cursada
> ya no use PostgreSQL.

### Slide 13 · Arquitectura de PostgreSQL

Slide de **una sola imagen**, con el título en vertical sobre el margen izquierdo y **ninguna línea de
texto explicativo**. Es un diagrama de bloques partido en dos cajas, **Cliente** (arriba) y **Servidor**
(abajo). Reconstrucción, según la lectura hecha en [[Clase 01 - Introducción_BasesDeDatos|la Clase 01]]:

```
┌─ CLIENTE ─────────────────────────────────────────────────────┐
│                    ┌──────────────┐                           │
│                    │  Aplicación  │                           │
│                    └──────┬───────┘                           │
│                           ▲▼                                  │
│                    ┌──────────────┐                           │
│                    │    LIBPG     │                           │
│                    └──┬────────┬──┘                           │
└───────────────────────│────────│──────────────────────────────┘
      Conexión inicial  ▲▼       ▲▼  Autenticación, consultas y resultados
┌─ SERVIDOR ────────────│────────│──────────────────────────────┐
│  ┌ postgresql.conf ┐  │        │                              │
│  ├ pg_hba.conf     ┤  │        │  (sin flecha en el dibujo)   │
│  └ pg_ident.conf   ┘  ▼        ▼                              │
│                 ┌────────────┐    ┌──────────┐                │
│                 │ Postmaster │───▶│ Postgres │┐               │
│                 └────────────┘    └──────────┘│┐  ← 3 cajas   │
│                                    └──────────┘│    apiladas  │
│                                     └──────────┘              │
│                        ▲▼                  ▲▼  FSYNC          │
│         ┌──────────────────────┐  ┌──────────────────────┐    │
│         │ PostgreSQL Share     │  │ Write-ahead log      │    │
│         │ Buffer Cache         │  │ (WAL)                │    │
│         └──────────┬───────────┘  └──────────┬───────────┘    │
│                    ▲▼                  FSYNC ▲▼               │
│         ┌─────────────────────────────────────────────┐       │
│         │        Kernel disk buffer cache             │       │
│         └──────────────────┬──────────────────────────┘       │
│                            ▲▼      FSYNC                      │
│                        ╭─────────╮                            │
│                        │  Disk   │  ← en gris muy claro       │
│                        │  Disco  │                            │
│                        ╰─────────╯                            │
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

> [!note] Qué se lee en la estructura — razonamiento propio, el slide es solo la imagen
> 1. **Un proceso por conexión.** El `Postmaster` recibe la conexión inicial y hay una flecha suya
>    hacia `Postgres`, que aparece triplicado.
> 2. **Dos capas de caché encadenadas**: la del motor (*Share Buffer Cache*) y la del sistema operativo
>    (*Kernel disk buffer cache*). Los datos no van del motor al disco directamente.
> 3. **El camino rotulado `FSYNC` es el del WAL**, no el del buffer cache de datos.
>
> Las tres son inferencias sobre el dibujo: **verificar en clase**.

> [!bug] Dos nombres del diagrama parecen tipeos
> - Dice **`LIBPG`**; la librería cliente en C de PostgreSQL se llama **`libpq`** (con `q`, de *query*).
> - Dice **"PostgreSQL Share Buffer Cache"**; el parámetro y el componente se llaman **`shared_buffers`**
>   / *shared buffer cache*.
>
> **Se transcriben como están en el slide.** Verificar en clase si a la cátedra le importa.

> [!warning] Nada de este diagrama se traslada a MySQL sin traducción
> Lo que **sí** se traslada es la **forma** del problema: todo motor relacional tiene un despachador,
> un proceso o hilo por conexión, una caché de páginas en memoria, un log de escritura anticipada y un
> `fsync` al disco. En MySQL/InnoDB los nombres son otros y **no los escribo acá porque no los tengo
> verificados contra ninguna fuente del vault**.

---

## Lo específico de PostgreSQL que aparece en el deck de Explain Plan

`BD2_Clase 08 - Explicando el plan(1).pdf` · **22 slides** · el caso más extremo del desfasaje: es una
transcripción de sesión de `psql` de punta a punta. Página completa:
[[Clase 08 - Explicando el plan]].

> [!warning] 🎯 Confirmado el 18/08: **el TP5 corre sobre MySQL**, así que este deck no se puede correr
> El enunciado del TP5 arranca *"Antes de comenzar, es necesario **levantar MySQL** en la PC que vayan
> a utilizar para este práctico"* → [[Práctica 2026-08-18]]. Era la duda abierta más repetida del
> vault y quedó cerrada **a favor de MySQL**.
>
> **Consecuencia para esta página:** todo lo que sigue —`psql`, `pg_class`, `\timing`, `\d`,
> `generate_series`, `BEGIN`/`ROLLBACK`, los `enable_*`, `seq_page_cost`/`cpu_tuple_cost`, los nombres
> de nodo del planner— es **material de lectura, no de tipeo**. Ninguno de los ejemplos del deck 08
> corre tal cual en la cursada: **hay que rehacerlos todos**. La traducción está en
> [[MySQL]] § *4 · Índices y plan de ejecución*.
>
> Lo que **sí** se transfiere es la estructura conceptual: el plan como **árbol**, estimación ≠
> realidad, full scan vs. acceso por índice, el orden de las columnas en un índice compuesto.
>
> ⚠️ Se cerró la mitad **TP5**, **no la mitad parcial**: el enunciado no dice nada del parcial.

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
      358 |     10000
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
| **5** | `BD2_Clase 05` — Consultas, Partes 2 y 3 | **Nada de PostgreSQL en ninguna de las dos** — y los dialectos ajenos **no son el mismo**, que es lo que esta fila decía mal hasta el 25/08. **Parte 2 → Oracle**, pero **solo dentro de imágenes**: los slides **4 y 8** llevan un recorte del DER de la Parte 1 con `VARCHAR2(40)`, `NUMBER(4)`, `NUMBER(8,2)`, `CHAR(2)`, `DATE`; el **texto** del deck no nombra ningún motor. **Parte 3 → T-SQL/SQL Server**, sin una sola marca de Oracle ni de PostgreSQL: `SELECT top 3` (s9), `datepart(month,getdate())` (s14), `DATENAME` (s15), `DATEDIFF` de tres argumentos (s16) — y **MySQL genuino** conviviendo, con backticks (s6, s10–13) y `LIMIT 0 , 30` (s10). *(El `FULL JOIN` y el "null es el mayor" del `ORDER BY` que esta fila listaba como Oracle **son SQL estándar** y no delatan motor.)* | baja | [[Clase 05 - Consultas de Datos–Parte 2]] · [[Clase 05 - Consultas de Datos–Parte 3]] |
| **6** | `BD2_Clase 06` — Vistas, Parte 1 | `DROP VIEW … RESTRICT \| CASCADE` con la semántica del estándar, que **PostgreSQL implementa de verdad y MySQL ignora**. El bloque de vistas materializadas es teórico para MySQL | media | [[Clase 06 - Vistas-Parte 1]] |
| **7** | `BD2_Clase 07` — Vistas, Parte 2 | Slide **21**: `CREATE MATERIALIZED VIEW … WITH [NO] DATA`, **sintaxis de PostgreSQL**, con las viñetas en inglés hablando de *"a Postgres materialized view"*. Slide **12**: el comentario *"en PostgreSQL la función podría implementar el comportamiento para todos los eventos"* sobre triggers `INSTEAD OF` | **alta**: MySQL **no tiene** vistas materializadas — lo dice el propio slide 20 | [[Clase 07 - Vistas-Parte 2]] |
| **8** | `BD2_Clase 08` — Explicando el plan | **PostgreSQL puro, los 22 slides.** `psql`, `pg_class`, `\timing`, `\d`, `generate_series`, `BEGIN/ROLLBACK`, `enable_*`, `seq_page_cost` / `cpu_tuple_cost`, `pgAdmin`, GEQO, `BUFFERS`, `JIT`, todos los nombres de nodo del planner, y **seis links a la doc de PostgreSQL y ninguna otra fuente** | **máxima**, y ahora **confirmada**: el TP5 es sobre este deck y **corre en MySQL** | [[Clase 08 - Explicando el plan]] · [[Práctica 2026-08-18]] |
| **9** | `BD2_Clase 09` — Restricciones de integridad | **El deck lo declara cuatro veces.** Slide **27**: el título es ***"TRIGGERS – SINTAXIS PostgreSQL"***. Slide **12**: *"MATCH SIMPLE (Opción por defecto para SQL estandar **y PostgreSQL**)"*. Slide **36**: la función de ejemplo es **PL/pgSQL** (`RETURNS trigger AS $body$ … LANGUAGE 'plpgsql'`, con `TG_OP`). Slide **39**: la primera fuente que cita es *"Capitulo 36 del **Manual de PostgreSQL**"*. Más `CREATE DOMAIN`, `CREATE ASSERTION`, `MATCH FULL/PARTIAL`, `SET DEFAULT`, `FOR EACH STATEMENT`, `INSTEAD OF` y `WHEN` — **nada de eso existe en MySQL** | **alta**: de los cuatro recursos declarativos que enseña, MySQL tiene **uno y medio**; y de las ocho cláusulas del `CREATE TRIGGER` del slide 27, **ninguna igual** | [[Clase 09 - Restricciones integridad-Parte 1]] · [[Práctica 2026-08-25]] |
| **10** | `BD2_Clase 10` — Restricciones de integridad, Parte 2 *(su portada dice **"SQL PROCEDURAL"**)* | **Ocho slides de PL/pgSQL puro, del 6 al 13**, los ocho titulados *"Procedimientos/Funciones en **Postgres**"*. Slide **6**, textual: *"Para **Postgres** todos son funciones, sólo que hay funciones que devuelven **void** ( Procedimientos )"*, con `RETURNS tipo AS $$ … END; $$ LANGUAGE plpgsql;` — **`$$` y `plpgsql` marcados en rojo en el slide**. Slide **7**: `CREATE OR REPLACE FUNCTION Sumador(integer)` con `RETURN $1 + 1`. Slide **8**: `ALIAS FOR $1` · `CONSTANT` · `%rowtype` · `%type`. Slides **9–11**: *"todo el acceso a cursores en **PL/pgSQL** es a través de … el tipo de datos especial **refcursor**"*, `nombre CURSOR [ ( argumentos ) ] FOR select_query`, y la variable **`FOUND`**. Slides **12–13**: `RETURNS TABLE(…)`, `LANGUAGE plpgsql AS $$`, **`RETURN QUERY`**, **`RETURN NEXT`**, `record`, `FOR … IN (SELECT …) LOOP`. Slide **17**, textual: *"**Postgres NO implementa este tipo de checks**"*. Slide **20**: **los dos únicos links de todo el deck** son `postgresqltutorial.com` y **`postgresql.com`** *(sic — el sitio oficial es `postgresql.org`)* | **máxima**: MySQL sí tiene *stored programs*, pero de las ~20 construcciones del deck **ninguna se tipea igual** y **siete no tienen sustituto** — `%rowtype`, `%type`, `record`, `refcursor`, cursor parametrizado, `FOR`-sobre-resultado y `RETURNS TABLE`. ⚠️ **Y el deck trae además Oracle**: ver el callout de abajo | [[Clase 10 - Restricciones integridad-Parte 2]] · [[Práctica 2026-09-01]] · [[MySQL]] § *6* |
| **11** | `BD2_Clase 11` — Seguridad-Transacciones | **El primer deck de la U1 escrito en MySQL por defecto** *(slide **7**: *"Mecanismos de Seguridad **(MySQL)**"*; slide **38**: *"Ejemplo en **MySQL**"*)*, y **su motor ajeno son dos ejemplos rotulados por el propio deck**, no el contenido. Slide **30**, textual: `-- Ejemplo de control de versiones en PostgreSQL` → `BEGIN; SELECT * FROM productos FOR UPDATE; … UPDATE productos SET stock = stock - 1 WHERE id = 1; COMMIT;`. Slide **29**, textual: `-- Ejemplo de bloqueo en SQL Server` → `BEGIN TRANSACTION; SELECT * FROM productos WITH (UPDLOCK); … COMMIT TRANSACTION;`. Y un tercer lugar **sin rótulo**: el slide **35** da `drop index <nombre-índice>` sin `ON <tabla>`, la forma del estándar y de PostgreSQL. Detalle en el callout de abajo | **baja**, y es la primera fila de la tabla en la que el código PostgreSQL **corre en MySQL sin cambiar una letra**: `BEGIN` es alias de `START TRANSACTION` y `SELECT … FOR UPDATE` existe con la misma sintaxis *(manual 9.7, § 15.3.1 *START TRANSACTION, COMMIT, and ROLLBACK Statements* y § 17.7.2.4 *Locking Reads*, ambas verificadas el 16/09)*. Lo que **no** corre es el slide 29 *(`WITH (UPDLOCK)` y `… TRANSACTION` son T-SQL)* y el `drop index` del 35 *(en MySQL el `ON tbl_name` es obligatorio — § 15.1.32 *DROP INDEX Statement*)* | [[Clase 11 - Seguridad-Transacciones]] · [[Práctica 2026-09-08]] · [[MySQL]] |
| **12** | `esq_peliculas.sql` *(no es un deck)* | El script **es MySQL** (`DROP FOREIGN KEY`), pero conserva rastros de un **dump de PostgreSQL**: tipos escritos `character varying(n)` / `numeric(p,s)` y nombres de FK con la convención automática `<tabla>_<columna>_fkey` | baja: corre igual | [[Práctica 2026-08-04]] · [[MySQL]] |
| **13** | *Seven Databases* cap. **2.2** *(bibliografía, no es material propio de la cátedra)* | **El desfasaje también llegó a la bibliografía.** El TP5 asigna como teoría de índices el § *Fast Lookups with Indexing* — que es el **capítulo 2, el de PostgreSQL** (pp. **18–21 impresas**): sintaxis `CREATE INDEX … USING hash (…)` y el mensaje `PRIMARY KEY will create implicit index "events_pkey"`. La cátedra lo aclara en el enunciado: *"si bien el libro hace mención a PostgreSQL, **también aplica para MySQL**"* | baja: lo pedido es el **concepto** —una PK crea un índice automáticamente, y es un **B-tree**—, no la sintaxis | [[Práctica 2026-08-18]] · [[_index-bibliografia]] |

Los decks `BD2_Clase 06`, `07`, `08`, `09`, `10` y `11` son las **Clases 06 a 11** —la cátedra las numera
en el nombre del archivo— y viven en `raw/Unidad-01/Teorica/`: la **Unidad-01 agrupa las Clases 01 a 11**
*(y los TP1 a TP8)*, y el path no dice a qué clase pertenece un archivo — eso lo registra
[[_index-clases]].

> [!note] 02/09 — la fila nueva **renumeró las dos últimas**
> La tabla ordena **decks por número de clase y después los artefactos que no son decks**, así que la
> Clase 10 se intercaló como **10** y empujó `esq_peliculas.sql` a **11** y *Seven Databases* a **12**.
> *(La alternativa era apendarla como 12 y no tocar nada, pero eso rompía el orden de la tabla. Se deja
> dicho para que sea una decisión visible y no un descuido.)*

> [!note] 16/09 — la Clase 11 *(archivada por el humano el 15/09)* volvió a renumerar las dos últimas, con el mismo criterio
> La Clase 11 se intercaló como **11** y empujó `esq_peliculas.sql` a **12** y *Seven Databases* a
> **13**. Ninguna otra página del vault citaba esas dos filas por número *(se comprobó con `grep`
> antes de renumerar)*; las únicas referencias externas a filas numeradas son la de [[MySQL]] a la
> fila **10** y la de [[_index-clases]] a la fila **5** *(en un párrafo tachado, histórico)*, y ninguna
> de las dos se movió.
>
> **Los decks 12, 13 y 14 —Clases 12 a 14, del 14/09— no entran en este inventario**: están escritos
> en **MongoDB**, que es el motor correcto de la segunda mitad de la cursada, así que no hay desfasaje
> que registrar. Viven en `raw/Unidad-02/Teorica/` y su página de motor es [[MongoDB]].

> [!success] 🎯 16/09 — la Clase 11 es **el primer deck de la U1 con MySQL como motor por defecto**
> Once decks después, la cursada tiene por primera vez un deck cuyo motor de referencia es el que
> corre en la práctica. La evidencia está verificada slide por slide en
> [[Clase 11 - Seguridad-Transacciones]] § *Motor*: el slide **7** se titula *"Mecanismos de Seguridad
> **(MySQL)**"*, el **38** *"Ejemplo en **MySQL**"*, y entre ambos hay `CREATE USER 'u'@'host'`, el
> comodín `'%'`, `CREATE ROLE`, `FLUSH PRIVILEGES` y el operador `<=>` — **diez slides con MySQL
> explícito, uno con SQL Server, uno con PostgreSQL y veintiséis estándar o sin motor**.
>
> **Por qué entra igual en la tabla.** El criterio del inventario —*"trae sintaxis de otro motor"*— es
> el mismo que aplican [[_index-clases]] y [[MySQL]], y el deck lo cumple: el slide **29** es T-SQL y
> el **30** está rotulado PostgreSQL. **Lo que cambia es la naturaleza del desfasaje, no el conteo**:
> en los decks 08, 09 y 10 el motor ajeno *era el contenido* *(ocho slides de PL/pgSQL en el 10)*; aquí
> son **dos ejemplos de cinco líneas, ambos con rótulo de motor** — es la primera vez en la U1 que un
> deck dice de qué motor es el código ajeno en vez de presentarlo como si fuera el de la cursada.
>
> **El ejemplo PostgreSQL del slide 30 corre en MySQL tal cual.** No es una traducción: `BEGIN` está
> documentado como alias de `START TRANSACTION` *(manual 9.7, § 15.3.1 *START TRANSACTION, COMMIT,
> and ROLLBACK Statements*: "BEGIN and BEGIN WORK are supported as aliases of START TRANSACTION")* y
> `SELECT … FOR UPDATE` es la lectura con bloqueo de InnoDB *(§ 17.7.2.4 *Locking Reads*)*. Es la
> **única pieza de código ajeno de toda la unidad que no hace falta reescribir**, y el deck no lo
> dice. El rótulo, eso sí, está mal: `FOR UPDATE` adquiere un bloqueo, no es *"control de versiones"*
> → [[Clase 11 - Seguridad-Transacciones]] § *Slides 29–30* y
> [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]].
>
> **Lo que sí muerde del deck, en MySQL, no está rotulado.** Dos cosas:
> - El **slide 35** escribe `drop index <nombre-índice>` a secas —la forma del estándar y de
>   PostgreSQL— y MySQL exige `DROP INDEX nombre ON tabla` *(§ 15.1.32 *DROP INDEX Statement*: el
>   `ON tbl_name` no va entre corchetes en el sinopsis)*. Es la discrepancia que muerde en el TP5.
> - El **slide 38**, que sí es MySQL, promete un índice hash con `CREATE INDEX MYINDEX ON USERS (DNI)
>   USING HASH;` y sobre InnoDB crea un **B-tree**: la Table 15.1 *Index Types Per Storage Engine* de
>   § 15.1.18 *CREATE INDEX Statement* admite solo `BTREE` para InnoDB, y el texto agrega que si el
>   tipo pedido no es válido para el motor pero hay otro que puede usarse sin afectar los resultados,
>   se usa ése. **La sentencia no falla.** Sobre si avisa: el párrafo general de § 15.1.18 no menciona
>   ningún warning; el que lo documenta es su nota sobre índices multivaluados, textual: *"As with
>   other indexes on columns of InnoDB tables, a multi-valued index cannot be created with USING
>   HASH; attempting to do so results in a warning: This storage engine does not support the HASH
>   index algorithm, storage engine default was used instead"*. Ese *"as with other indexes"* es lo
>   que permite esperar el mismo warning para el índice del slide 38 — pero **ni el `SHOW WARNINGS`
>   ni el `SHOW INDEX FROM USERS` → `Index_type = BTREE` se corrieron en el contenedor: sin
>   verificar**. Por eso [[Clase 11 - Seguridad-Transacciones]] § *Slide 38*, [[MySQL]] § *8* y
>   [[1.08.02 - Índices|Índices]] escriben que el `USING HASH` *"se ignora en silencio"*: las cuatro
>   páginas coinciden en lo verificado *(no hay error y el índice es un B-tree, por la Table 15.1)* y
>   difieren solo en lo que nadie corrió. La sección del manual se abrió y se verificó el 16/09.
>
> **Y la ausencia más grave no es sintaxis ajena: el deck no muestra ni una transacción en MySQL.**
> Sus únicos `BEGIN … COMMIT` son el de SQL Server y el de PostgreSQL. `START TRANSACTION`,
> `ROLLBACK`, `autocommit`, `SET TRANSACTION ISOLATION LEVEL` y el dato de que InnoDB arranca en
> `REPEATABLE READ` quedan para [[MySQL]] § *8 · Transacciones* y para
> [[1.11.03 - Transacciones y ACID|Transacciones y ACID]].
>
> **El TP8 confirma el patrón desde la práctica**: su enunciado escribe *"Resuelva el ejercicio desde
> la teoría, ya que MySQL no provee la opción CASCADE"* *(ej. 1.b)*. Lo que el TP pide —`REVOKE …
> CASCADE`, un *owner* de la tabla, `PUBLIC`— es el modelo de GMUW 10.1, que **PostgreSQL implementa
> y MySQL no** *(la página `sql-revoke.html` de la documentación de PostgreSQL, abierta el 16/09, trae
> `[ CASCADE | RESTRICT ]` en el sinopsis, define `PUBLIC` como "the implicitly defined group of all
> roles" y dice que "all privileges ultimately come from the object owner")*; el detalle, ítem por
> ítem, está en [[Práctica 2026-09-08]] § *Qué de este TP no se puede correr en MySQL* y en
> [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]]. **Es el TP donde el
> desfasaje es más nítido en la dirección inversa** *(razonamiento propio de esta página, no del
> enunciado)*: no un deck en PostgreSQL que hay que traducir a MySQL, sino una consigna escrita contra
> el modelo de GMUW 10.1, que PostgreSQL implementa y que MySQL no alcanza. No es la primera: [[MySQL]]
> § *Por qué MySQL* lo encuadra como el **tercer TP consecutivo** con consignas *"desde la teoría"*
> que MySQL no cubre *(TP6 → TP7 → TP8)*; lo que cambia en el TP8 es que la brecha es de modelo, no
> de una cláusula.

> [!bug] 🔶 El slide **17** del deck 10 **no es PostgreSQL: es Oracle** — y es un hallazgo en sí mismo
> Es un **tercer motor dentro del mismo deck**, y esta página tiene que decirlo explícitamente para no
> hacer lo contrario de lo que existe para hacer. La línea, textual:
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
> 🎯 **Y lo mejor del slide es lo que dice abajo, en el mismo slide**:
> *"**Postgres NO implementa este tipo de checks**, Postgres no permite un `select` dentro de un
> constraint…. ☹"*. O sea que **el deck escribe en Oracle un ejemplo que declara, en la línea
> siguiente, que su propio motor de referencia no soporta**. Consecuencia para el vault: el `CHECK` con
> subconsulta **no es una carencia de MySQL frente a PostgreSQL** —no lo tiene ninguno de los dos, igual
> que `CREATE ASSERTION`—, y por eso se corrigió la tabla de [[MySQL]] § *5*, que lo insinuaba.
>
> El otro rastro de Oracle del deck es más chico y está en el **slide 9**:
> `curs3 CURSOR (key int) IS SELECT …`, donde el **`IS`** es PL/SQL — **el mismo slide da la gramática
> con `FOR` cuatro líneas más arriba**, así que se contradice solo.

> [!success] ~~`pendiente` · las tres listas del vault no coinciden~~ — **resuelto el 25/08 releyendo los once decks**
> Este callout registraba que **cuatro** listas del vault daban cuentas distintas —esta tabla **8**,
> [[MySQL]] **7**, [[_index-clases]] **6**— y decía, con razón, que *"resolverlo exige releer los
> decks, no comparar las listas entre sí"*. **Se releyeron los once**, y las cuatro quedaron
> alineadas:
>
> | Cuenta | Cuáles |
> | --- | --- |
> | **PostgreSQL: 7 decks** | `01` · `03` · `04` · `05-P1` · `07` · `08` · `09` |
> | **con algún motor ajeno: 9 archivos de 11** | los siete de arriba **+ `05-P2`** *(Oracle)* **+ `05-P3`** *(T-SQL)* |
> | **limpios: `02`** | ni una sentencia SQL en todo el deck |
> | **caso aparte: `06`** | su única mención de Oracle *(slide 11)* es **atribución histórica** del término *key-preserved*, no sintaxis. Por eso esta tabla lo cuenta —trae `DROP VIEW … RESTRICT\|CASCADE`, que PostgreSQL implementa y MySQL ignora— y [[MySQL]] no: **son dos criterios distintos, no un desacuerdo** |
>
> **Las dos discrepancias de fondo las ganó [[MySQL]]:** el deck **07** sí trae PostgreSQL *(slide 21,
> `CREATE MATERIALIZED VIEW … WITH [NO] DATA`)*, y el desfasaje del **05** empieza en la **Parte 1**,
> no en las 2–3.
>
> **02/09 — los conteos suben, y el callout no se reescribe.** Lo de arriba es el registro fechado de
> la pasada del 25/08 **sobre once archivos**, y como tal se conserva. Con la **Clase 10** archivada,
> el estado al **02/09** es:
>
> | Cuenta | 25/08 | **02/09** | Qué cambió |
> | --- | :---: | :---: | --- |
> | **decks PostgreSQL** | 7 | **8** | entra el **`10`** — `01` · `03` · `04` · `05-P1` · `07` · `08` · `09` · **`10`** |
> | **archivos con algún motor ajeno** | 9 de 11 | **10 de 12** | el `10` es el archivo nuevo, y trae **PostgreSQL + Oracle** |
> | **decks con Oracle** | 2 *(`05-P1`, `05-P2`)* | **3** | el **`10`**, slides **9** y **17** — ver el callout 🔶 de arriba |
> | **limpios** | `02` | `02` | sin cambios |
> | **caso aparte** | `06` | `06` | sin cambios |
>
> El `10` **no reabre la discusión metodológica**: su PostgreSQL está en la **capa de texto**
> *(`Postgres` ×11, `postgresql` ×2, `plpgsql` ×5, `refcursor` ×3, `%rowtype` ×2)* y su Oracle también
> *(`sysdate`, `months_between`)*, así que se verifica con un `grep` y no depende de renderizar
> imágenes. Se renderizaron igual los 20 slides: **sus imágenes son decoración de plantilla más tres
> diagramas de entidad sin un solo tipo de dato**, así que no esconden un cuarto motor.
>
> **16/09 — los conteos suben una vez más, con la Clase 11** *(archivada el 15/09, verificada el 16/09)*.
> Mismo procedimiento: lo de arriba se conserva como registro fechado, y el estado al **16/09** es:
>
> | Cuenta | 02/09 | **16/09** | Qué cambió |
> | --- | :---: | :---: | --- |
> | **decks PostgreSQL** | 8 | 8 | **sin cambios**: el `11` **no es un deck PostgreSQL**, es un deck MySQL con un ejemplo PostgreSQL rotulado adentro *(el slide 30)* — misma cuenta que [[MySQL]] § *Por qué MySQL* *(`01` · `03` · `04` · `05-P1` · `07` · `08` · `09` · `10`)* |
> | **decks con un ejemplo PostgreSQL rotulado** | 0 | **1** | el **`11`**, slide **30** *(`-- Ejemplo de control de versiones en PostgreSQL`)* — entra en la tabla del inventario por el criterio *"trae sintaxis de otro motor"*, no en la cuenta de decks PostgreSQL |
> | **archivos con algún motor ajeno** | 10 de 12 | **11 de 13** | el `11` es el archivo nuevo, y trae **PostgreSQL + SQL Server**, un slide de cada uno |
> | **decks con Oracle** | 3 | 3 | sin cambios |
> | **decks con T-SQL / SQL Server** | 1 *(`05-P3`)* | **2** | el **`11`**, slide **29** *(`WITH (UPDLOCK)`)* |
> | **decks con MySQL como motor por defecto** | 0 | **1** | el **`11`** — ver el callout 🎯 del 16/09, más arriba *(el que sigue a la tabla del inventario)* |
> | **limpios** | `02` | `02` | sin cambios |
> | **caso aparte** | `06` | `06` | sin cambios |
>
> Los dos motores ajenos del `11` viven en la **capa de texto** *(`PostgreSQL` ×1, `SQL Server` ×1,
> `UPDLOCK` ×1, `FOR UPDATE` ×1)*: se verifican con `grep` y se confirmaron además sobre los PNG de los
> slides 29 y 30. Sus siete imágenes son adornos, salvo el diagrama de estados del slide 20, que no
> tiene una línea de SQL. **La `Unidad-01` cierra aquí**: la Clase 11 es la última teórica relacional,
> y los decks que siguen son de MongoDB y no entran en esta cuenta.
>
> > [!bug] Por qué las listas se habían desalineado, y es la misma causa de siempre
> > **Los tipos Oracle del `05` viven dentro de imágenes.** El slide **5 de la Parte 1** y los slides
> > **4 y 8 de la Parte 2** son recortes del DER, y `pdftotext` **no ve nada de eso** — del slide 4 de
> > la Parte 2 devuelve exactamente *"Consultas de más de una tabla"* y punto. Cada lista los ubicó
> > donde le pareció, y ninguna podía verificarse con la herramienta que se estaba usando.
> > Es **el mismo error que con Date**: tomar una limitación de la herramienta por una propiedad de la
> > fuente. La corrección es la misma: **renderizar el slide y mirarlo**. Y la primera pasada de esta
> > relectura **volvió a caer**: dio la Parte 2 por limpia, y lo agarró la verificación adversarial.

### La contradicción interna del deck de introducción

El caso 1 es especial porque el deck **se contradice a sí mismo**: el slide 2 manda a bajar **MySQL
Workbench** y **XAMPP**, y diez slides después explica el `Postmaster` de PostgreSQL. Los dos no pueden
ser verdaderos a la vez. La resolución, según las reglas del vault, es que **gana el cronograma**:
la cursada es MySQL, y los slides 12–13 se estudian como **ejemplo de arquitectura de un SGBD
relacional**.

---

## Dudas abiertas

> [!note] 02/09 — dos citas al *"bloque A"* traducidas a **Clase 01**
> Eran los últimos restos **en esta página** de la nomenclatura propia que el vault descartó —el número
> de clase sale del nombre del deck, no de un esquema A–E inventado— y convivían con los
> `[[Clase NN …]]` de los párrafos vecinos, así que la página se contradecía consigo misma. El mapeo
> `Bloque A → Clase 01` **ya estaba comprobado contra el PDF** el 25/08, en [[MySQL]] § *Tabla de
> diferencias*; acá sólo se aplicó. Estaban en el § *Slide 13 · Arquitectura de PostgreSQL* y en el
> primer ítem de esta lista.

- [ ] **¿Los slides 12–13 de la [[Clase 01 - Introducción_BasesDeDatos|Clase 01]] son evaluables**, o
      quedaron de una versión anterior del deck? Es la diferencia entre memorizar `pg_hba.conf` o no.
- [x] ~~**¿El TP5 (Explain Plan) corre sobre MySQL o sobre PostgreSQL?**~~ **Resuelto: MySQL**, y lo
      dice la primera línea del enunciado del 18/08 → [[Práctica 2026-08-18]]. **Consecuencia para
      esta página: hay que rehacer todos los ejemplos del deck 08**, porque las salidas no se parecen
      en nada. Lo de acá se lee, no se tipea. *(Se cerró la mitad TP5; la mitad **parcial** sigue
      abierta — ver el último ítem de esta lista.)*
- [ ] ¿*"Proyecto Ingres"* y *"primera versión en 1997"* (slide 12) son precisos, o simplificaciones?
- [ ] ¿`LIBPG` y `Share Buffer Cache` del diagrama son tipeos por `libpq` y *shared buffer cache*?
- [ ] ¿Qué relación tienen los tres `.conf` con el `Postmaster`? En el diagrama están apoyados contra su
      caja **sin ninguna flecha**.
- [ ] ¿Cuál es el equivalente en **MySQL/InnoDB** de cada pieza del diagrama (postmaster, proceso por
      conexión, share buffer cache, WAL)? No lo escribo sin verificar.
- [ ] **¿Qué versión de PostgreSQL usa el material?** El deck 08 mezcla `Total runtime:` (etiqueta
      vieja) con `Planning time:` / `Execution time:` (nueva), y el deck 03 linkea la **9.5**, que ya no
      tiene soporte. Las capturas son de varios años distintos.
- [ ] ¿Cuánto hay que saber de **GEQO**? El slide 10 del deck 08 pone el título y el link, y nada más.
- [ ] Si en el parcial cae una consigna escrita en sintaxis PostgreSQL, **¿se responde en PostgreSQL o
      se traduce a MySQL?** Es la duda que engloba a todas las anteriores. **El TP5 es evidencia a
      favor de MySQL** —su enunciado obliga a levantar MySQL—, pero **habla del práctico, no del
      parcial**: esta sigue sin respuesta.
      **🎯 Actualización del 25/08 — el TP6 aporta lo más informativo hasta ahora, y no es un veredicto
      sino un *método*:** su ejercicio 3 pide las sentencias **dos veces**, primero *"en SQL estándar"*
      (3.b) y después *"las que puedan ser soportadas por **MySQL**"* (3.c). O sea que la cátedra
      **sabe** que el material está escrito contra otro motor y **trata las dos cosas como preguntas
      separadas**. Si el parcial sigue el mismo patrón, la respuesta completa es *"en el estándar se
      escribe así, y en MySQL hay que hacer esto otro"* — que es exactamente lo que hacen esta página
      y [[MySQL]]. **Sigue sin confirmarse para el parcial** → [[Práctica 2026-08-25]].
- [ ] **¿`CREATE DOMAIN`, `CREATE ASSERTION` y `MATCH FULL/PARTIAL` entran al parcial?** Son del
      estándar, PostgreSQL tiene el primero, **MySQL no tiene ninguno** y `ASSERTION` no la tiene
      nadie. El deck de la Clase 09 les dedica ocho slides → [[Clase 09 - Restricciones integridad-Parte 1]].
      **🎯 02/09 — sube la probabilidad: ya no es un deck, son dos.** La **Clase 10 vuelve sobre las
      dos cosas** en su bloque final: el slide **18** repite que *"ninguna base de datos comercial
      implementa Assertions"* y muestra un `Create Assertion`, y el **17** vuelve sobre el `CHECK` con
      subconsulta *(y aclara que **PostgreSQL tampoco lo implementa**)*. Que la cátedra insista en dos
      teóricas seguidas con un tema que **ningún motor implementa** es lo más informativo que hay sobre
      cuánto le importa → [[Clase 10 - Restricciones integridad-Parte 2]].
- [ ] **¿Entra `PL/pgSQL` al parcial, o alcanza con el concepto de SQL procedural?** El deck 10 le
      dedica **ocho slides** —`$$`, `LANGUAGE plpgsql`, `refcursor`, `%rowtype`, `RETURN QUERY`,
      `RETURN NEXT`— y **nada de eso se puede tipear en MySQL**. Es la misma pregunta que el deck 08
      dejó abierta para `psql` y `pg_class`, pero peor: acá lo que no se transfiere **es el lenguaje
      entero**, no un puñado de nombres. La traducción, construcción por construcción, está en
      [[MySQL]] § *6*.

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
