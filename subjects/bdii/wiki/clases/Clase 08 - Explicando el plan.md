---
tipo: teorica
clase: 8
deck: "BD2_Clase 08 - Explicando el plan(1).pdf"
unidad: 1
tema: "Índices y plan de ejecución: EXPLAIN, costos, estadísticas"
resumen: "Cómo leer un plan de ejecución con EXPLAIN y EXPLAIN ANALYZE: costo, estadísticas, Index Cond frente a Filter, índices simples, compuestos y que cubren la consulta. La misma consulta cuesta órdenes de magnitud distintos según cómo se escriba y qué índices haya; el deck es PostgreSQL y el TP5, MySQL."
fecha: 2026-08-10
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 08
  - Explicando el plan
  - EXPLAIN
  - EXPLAIN ANALYZE
  - Explain Plan
  - Plan de ejecución (clase)
  - Clase 08 — Explain Plan
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 08 - Explicando el plan(1).pdf"
estado: procesado
---

# Clase 08 — Índices y Explain Plan

## Resumen general

Cómo leer un plan de ejecución con `EXPLAIN` y `EXPLAIN ANALYZE`, y qué le cambia un índice. El deck
(22 slides, PostgreSQL puro) transcribe sesiones de consola sobre cuatro bases reales —`radiocut`,
`ar_amba_points`, `CovidCases` con 30 millones de filas y `graduados` con 8532— y demuestra una idea: la
misma consulta cuesta órdenes de magnitud distintos según cómo esté escrita y qué índices haya. La
cursada corre sobre MySQL: el TP5 Explain Plan (martes 18/08) rehace todo ahí, con
`SET @@explain_format=TREE` como primera sentencia, y la tabla PostgreSQL vs. MySQL de esta página
traduce cada comando.

`EXPLAIN` solo estima; `EXPLAIN ANALYZE` ejecuta, así que sobre `INSERT`, `UPDATE`, `DELETE` o
`CREATE TABLE AS` va entre `BEGIN` y `ROLLBACK`. `EXPLAIN ANALYZE consulta` y `ANALYZE tabla` son cosas
distintas: el segundo recolecta las estadísticas (`pg_class.relpages`, `reltuples`) con las que estima el
planner; sin él, las `rows=` mienten. El costo es una unidad arbitraria (`seq_page_cost = 1`,
`cpu_tuple_cost = 0.01`): compara planes de la misma consulta, no predice milisegundos. El plan es un
árbol y se lee del nodo más sangrado hacia afuera; con `loops > 1`, filas y tiempos de `actual` son por
loop. `Index Cond` acota lo que se lee; `Filter` se evalúa sobre filas ya leídas y
`Rows Removed by Filter` mide el desperdicio. En un índice compuesto manda el orden de las columnas
(prefijo izquierdo), no el de las condiciones del `WHERE`; un índice que contiene todas las columnas
pedidas da `Index Only Scan` (`Heap Fetches: 0`).

Para el parcial: distinguir full scan de acceso por índice, leer `Index Cond` frente a `Filter`, explicar
qué cuesta el `LIKE '%'` de un ORM (933897 → 654531 → 534935 → 511017 → 1202 en `CovidCases`) y por qué
`min(id)` con índice cuesta 0.48 y `min(play)` sin índice, 22392.

## Ficha del deck

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 08 - Explicando el plan(1).pdf` · **22 slides** · dictada el
> **lunes 10/08**, virtual, 19:00–22:00, el mismo día que [[Clase 06 - Vistas-Parte 1]] y
> [[Clase 07 - Vistas-Parte 2]]. Se practica en el **TP5 Explain Plan**, martes **18/08** →
> [[Práctica 2026-08-18]], que corre sobre **MySQL** (lo confirma su enunciado). Qué archivo es de qué
> clase: [[_index-clases]]. Bibliografía: [[_index-bibliografia]].

> [!important] Este deck es **PostgreSQL puro** — la cursada corre sobre **MySQL**
> El mismo desfasaje motor-material de los decks `BD2_Clase 01` y `BD2_Clase 04`. Todo lo que sigue es
> de PostgreSQL y **nada de esto existe igual en MySQL**:
>
> | Del deck | Qué es |
> | --- | --- |
> | `https://www.postgresql.org/docs/current/sql-explain.html` | primer link: el deck cita **6** páginas de la doc de PostgreSQL y ninguna otra |
> | `psql -U radiocut radiocut` | cliente de línea de comandos de PostgreSQL |
> | `pg_class` (`relpages`, `reltuples`) | tabla del **catálogo** de PostgreSQL |
> | `\timing`, `\d tabla` | meta-comandos de `psql` |
> | `generate_series(1,100000)` | función generadora de PostgreSQL |
> | `Seq Scan`, `Index Only Scan`, `HashAggregate`, `Gather`… | nombres de nodos del **planner de PostgreSQL** |
> | `enable_seqscan`, `seq_page_cost`, `cpu_tuple_cost` | parámetros de sesión de PostgreSQL |
> | `pgAdmin` | GUI de PostgreSQL (aparece un screenshot del botón *Explain query*) |
>
> MySQL tiene su **propio** `EXPLAIN`, con otra salida (columnas `type`, `key`, `rows`, `Extra`), otro
> catálogo (`information_schema`) y otro modelo de costos. Traducción completa en
> [§ PostgreSQL vs. MySQL](#postgresql-vs-mysql--traducción-del-deck).

---

## Slide 1 · Qué es `EXPLAIN`

> [!quote] Textual del slide
> **EXPLAIN — *show the execution plan of a statement***
>
> *"La sentencia EXPLAIN no está definida en el SQL estándar, pero muchos motores la implementan."*
>
> **EXPLAIN ANALYZE (explica y ejecuta)**
>
> `https://www.postgresql.org/docs/current/sql-explain.html`

| Sentencia | Qué hace |
| --- | --- |
| `EXPLAIN` | **Solo estima**: muestra el plan que el planner eligió, sin correr la consulta. |
| `EXPLAIN ANALYZE` | **Explica y ejecuta**: corre la consulta de verdad y agrega los números reales. |

### `BEGIN` y `ROLLBACK` para no tocar los datos

> [!quote] Textual del slide
> *"Si queremos hacer un EXPLAIN ANALYZE sobre un INSERT, UPDATE, DELETE, CREATE TABLE AS, o EXECUTE
> sentencias sin que esto afecte a nuestros datos en la base, hay que usar BEGIN y ROLLBACK."*

```sql
BEGIN;
EXPLAIN ANALYZE ...;
ROLLBACK;
```

El slide pega, en inglés, la definición de `BEGIN` de la documentación: sin `BEGIN`, PostgreSQL corre
en **autocommit** (cada sentencia es su propia transacción y termina en `COMMIT` implícito, o
`ROLLBACK` si falló: no hay vuelta atrás); con `BEGIN` todo se acumula hasta un `COMMIT` o `ROLLBACK`
**explícito**, y con `ROLLBACK` el `EXPLAIN ANALYZE` se ejecutó, midió y no dejó rastro. Transacciones
completas en la Clase 06 (ACID) → [[1.11.03 - Transacciones y ACID|Transacciones ACID]].

### `pg_class`: páginas y tuplas

> [!quote] Textual (slide 1 y primer recuadro del slide 2)
> *"The number of pages and rows is looked up in pg_class"* · *"La tabla pg_class del catálogo, contiene
> entre otras cosas cuantas páginas y cuantas tuplas tiene una tabla."*

```sql
SELECT relpages, reltuples FROM pg_class WHERE relname = 'table';
```

```
 relpages | reltuples
----------+-----------
  358 | 10000
```

`relpages` es cuántas **páginas** (bloques de disco) ocupa la tabla; `reltuples`, cuántas **tuplas** tiene,
**estimadas**. Son los dos insumos de la fórmula de costo del slide 9: el planner **no cuenta las
filas**, las lee del catálogo, que se actualiza con `ANALYZE` (slide 7).

---

## Slide 2 · Primer plan completo — la tabla `t` en `radiocut`

Sesión de `psql` transcrita tal cual:

```
psql -U radiocut radiocut

radiocut=> CREATE TABLE t AS SELECT * FROM generate_series(1,100000);
radiocut=> \timing
Timing is on.

radiocut=> SELECT COUNT(*) FROM t;
 count
--------
 100000
(1 row)

Time: 12.232 ms

radiocut=> EXPLAIN ANALYZE SELECT COUNT(*) FROM t;

  QUERY PLAN
--------------------------------------------------------------------------------------------------------------
Aggregate  (cost=1855.06..1855.07 rows=1 width=0) (actual time=10.035..10.035 rows=1 loops=1)
  -> Seq Scan on t  (cost=0.00..1572.65 rows=112965 width=0) (actual time=0.010..5.581 rows=100000 loops=1)
 Planning time: 0.053 ms
 Execution time: 10.088 ms
(4 rows)

Time: 11.798 ms
```

`CREATE TABLE t AS SELECT * FROM generate_series(1,100000)` crea **100.000 filas de una sola columna
entera** sin un solo `INSERT`; `\timing` prende el cronómetro de `psql` y cada sentencia imprime su
`Time:`. Ese `Time:` (11.798 ms) **no es** el `Execution time:` del plan (10.088 ms): incluye la ida y
vuelta cliente-servidor y el planning (razonamiento propio; el slide solo imprime los dos números).

### Anatomía de una línea del plan

La línea que hay que saber leer de memoria:

```
Seq Scan on t  (cost=0.00..1572.65 rows=112965 width=0) (actual time=0.010..5.581 rows=100000 loops=1)
└──────┬─────┘  └───────┬────────┘ └──────┬─────┘ └──┬──┘ └──────────┬────────────┘ └─────┬──────┘ └──┬──┘
  nodo  costo  filas  bytes  tiempo real  filas reales  veces
  inicio..total  estimadas  /fila  inicio..fin (ms)  ejecutado
```

| Campo | Qué significa | Aparece con |
| --- | --- | --- |
| `cost=inicio..total` | **inicio**: costo acumulado hasta emitir la **primera** fila; **total**: hasta emitir la **última** | siempre |
| `rows=` | filas que el planner **estima** que va a emitir ese nodo | siempre |
| `width=` | ancho promedio **en bytes** de cada fila emitida | siempre |
| `actual time=inicio..fin` | milisegundos reales hasta la primera y hasta la última fila | solo `ANALYZE` |
| `rows=` (en `actual`) | filas **realmente** emitidas, **por cada loop** | solo `ANALYZE` |
| `loops=` | cuántas veces se ejecutó ese nodo | solo `ANALYZE` |
| `Planning time` / `Execution time` | cuánto tardó **planificar** vs. **ejecutar** | `Execution` solo con `ANALYZE` |

> [!important] El costo **no** son milisegundos
> Es una **unidad arbitraria** del planner: costo total 1855.07 contra 10.088 ms reales, sin proporción
> entre los dos. Sirve **para comparar planes entre sí**, no para predecir tiempo. La unidad la fija
> `seq_page_cost = 1` (slide 9): el costo se mide en lecturas secuenciales de página.

> [!note] La estimación erró por 13%: `rows=112965` estimadas vs `rows=100000` reales
> El deck no lo comenta. **Razonamiento propio:** la tabla se acaba de crear con `CREATE TABLE AS` y
> **nunca corrió `ANALYZE`**, así que el planner estima por tamaño de archivo; el slide 7 introduce
> `ANALYZE` justamente para eso. Confirmar en clase.

---

## Slides 3–4 · `audiocut`: el mismo `min()` con índice y sin índice

**El ejemplo central del deck sobre índices**: dos consultas idénticas salvo por la columna. Estructura
de la tabla, con `\d`:

```
radiocut=> \d audiocut;
  Table "public.audiocut"
  Column  | Type  | Modifiers
-------------+--------------------------+-----------
 id  | numeric  | not null
 slug  | text  |
 radio_id  | text  |
 radio_name  | text  |
 show_id  | text  |
 show_name  | text  |
 start  | timestamp with time zone |
 length  | numeric  |
 username  | text  |
 description | text  |
 title  | text  |
 created  | timestamp with time zone |
 play  | numeric  |
Indexes:
  "audiocut_pk" PRIMARY KEY, btree (id)
  "idx_audiocut_id" UNIQUE, btree (id)
```

> [!note] Hay **dos índices sobre la misma columna** `id`
> `audiocut_pk` (PK) e `idx_audiocut_id` (UNIQUE), los dos btree sobre `id`; el deck no lo comenta.
> **Razonamiento propio:** es un índice redundante, ocupa disco y encarece cada `INSERT` sin agregar
> caminos de acceso. **Verificar en clase** si es intencional o un descuido de la base de ejemplo.

**Caso A — `min(id)`, columna indexada:**

```
radiocut=> explain select min(id) from audiocut;
  QUERY PLAN
-------------------------------------------------------------------------------------------------------
 Result  (cost=0.47..0.48 rows=1 width=0)
  InitPlan 1 (returns $0)
  -> Limit  (cost=0.42..0.47 rows=1 width=6)
  -> Index Only Scan using audiocut_pk on audiocut  (cost=0.42..8775.32 rows=185994 width=6)
  Index Cond: (id IS NOT NULL)
(5 rows)

Time: 1.451 ms
```

**Caso B — `min(play)`, columna sin índice:**

```
radiocut=> explain select min(play) from audiocut;
  QUERY PLAN
-----------------------------------------------------------------------
 Aggregate  (cost=22392.92..22392.93 rows=1 width=5)
  -> Seq Scan on audiocut  (cost=0.00..21927.94 rows=185994 width=5)
(2 rows)

Time: 2.364 ms
```

| | `min(id)` | `min(play)` |
| --- | --- | --- |
| ¿Hay índice sobre la columna? | **sí** (`audiocut_pk`) | **no** |
| Plan | `Result` + `InitPlan` + `Limit` + `Index Only Scan` | `Aggregate` + `Seq Scan` |
| **Costo total** | **0.48** | **22392.93** |
| Filas que toca | **1** (se corta con `Limit`) | **185994** (todas) |

> [!important] Por qué la diferencia es de ~**46.650×** (`22392.93 / 0.48`; el factor es cálculo propio)
> **Razonamiento propio:** un índice **btree está ordenado**. Para el mínimo de una columna indexada,
> PostgreSQL va al primer elemento no nulo del índice y frena — de ahí el `Limit` y el
> `Index Cond: (id IS NOT NULL)`. Sin índice no hay orden: hay que leer **las 185.994 filas** con un
> `Seq Scan`. Y el `cost=0.42..8775.32` del `Index Only Scan` es lo que costaría recorrer el índice
> **entero**; con un `Limit` arriba solo se paga hasta la primera fila, casi el **inicio** (0.42): es
> el caso donde el costo de inicio manda.

---

## Slides 4–6 · `GROUP BY` + `ORDER BY` + `LIMIT`: un plan de cuatro pisos

La consulta (resaltada en naranja en el slide):

```sql
EXPLAIN
  SELECT username, count(*), sum(play)
  FROM audiocut
  GROUP BY username
  ORDER BY sum(play) DESC
  LIMIT 10
```

Su resultado, los 10 usuarios con más reproducciones (la tabla del deck está **cortada entre los
slides 4 y 5**):

| username | count(*) | sum(play) |
| --- | ---: | ---: |
| RadioDelPlata | 3487 | 906673 |
| RadioAM750 | 3095 | 403449 |
| TVShowUru1 | 94 | 317516 |
| Eldestape | 170 | 258478 |
| detrasdeloquevemos | 1295 | 196837 |
| magustina | 16 | 174438 |
| monderosama | 845 | 171611 |
| LB24 | 2164 | 156872 |
| josedelaradio | 1070 | 142548 |
| RADIONEF | 3706 | 134944 |

Su plan, con comillas por línea porque es un copy-paste desde **pgAdmin**, que devuelve el plan como
filas de texto (el slide 5 muestra además el botón **"Explain query"** de su barra de herramientas):

```
QUERY PLAN

"Limit  (cost=23551.53..23551.56 rows=10 width=17)"
"  -> Sort  (cost=23551.53..23568.29 rows=6703 width=17)"
"  Sort Key: (sum(play)) DESC"
"  -> HashAggregate  (cost=23322.90..23406.68 rows=6703 width=17)"
"  Group Key: username"
"  -> Seq Scan on audiocut  (cost=0.00..21927.94 rows=185994 width=17)"
```

El slide 6 dibuja el mismo plan como un **pipeline de izquierda a derecha**, con un tooltip sobre el
último nodo:

```
 audiocut  ──▶  HashAggregate  ──▶  Sort  ──▶  Limit
  tabla  Σ agrupa por  ordena por  corta
  username  sum(play) DESC  en 10

  ┌──────────────────────────────────────┐
  │ Limit  │
  │ (cost=23551.53..23551.56 rows=10  │
  │  width=17)  │
  └──────────────────────────────────────┘
```

> [!important] Este es **el slide que enseña a leer un plan**
> El texto del `EXPLAIN` está anidado con `->` y sangría, y se lee **de abajo hacia arriba**: el nodo
> más sangrado (`Seq Scan on audiocut`) se ejecuta **primero**, el menos sangrado (`Limit`), **último**.
> El dibujo del slide 6 es esa misma lista **dada vuelta**: la flecha `->` apunta al hijo, y el hijo
> alimenta al padre.

Los costos, nodo por nodo:

| Nodo | Costo | Qué dice el par `inicio..total` |
| --- | --- | --- |
| `Seq Scan on audiocut` | `0.00..21927.94` | **inicio 0**: un scan secuencial emite la primera fila enseguida |
| `HashAggregate` | `23322.90..23406.68` | **inicio ≈ total**: consume *todo* el scan para armar la tabla de hash antes de emitir nada |
| `Sort` | `23551.53..23568.29` | idem: no hay primera fila ordenada sin haber visto todas |
| `Limit` | `23551.53..23551.56` | **hereda el inicio del `Sort`** y suma casi nada: solo pide 10 filas |

> [!tip] Regla que se desprende de esta tabla
> **Un nodo bloqueante** (`Sort`, `HashAggregate`) tiene `inicio ≈ total`; **uno en streaming**
> (`Seq Scan`, `Index Scan`, `Limit`), `inicio ≪ total`. Por eso `LIMIT` **no** ayuda cuando abajo hay
> un `Sort`: el ordenamiento ya pagó todo.

`rows=6703` en el `HashAggregate` son los **usuarios distintos** estimados, contra las `185994` filas de
la tabla; `width=17` es el ancho de cada fila de salida (`username` + `count` + `sum`), contra `width=0`
de los `count(*)`, que no devuelven columnas.

---

## Slides 6–8 · `ar_amba_points`: las cuatro variantes de `EXPLAIN`

Arranca con una advertencia sobre `\timing` y una observación sobre la varianza de las mediciones:

```
\timing
-- solo en el psql, no sirve en el pgAdmin

select count(*) from ar_amba_points
-- 532,733 registros
-- 31 msec
-- pero si lo volvemos a correr, puede dar otros valores, por ej. 61, 41, 30, … ms
```

*"pero si lo volvemos a correr, puede dar otros valores"*: **no alcanza con cronometrar**. El tiempo de
pared depende de la caché, de la carga de la máquina y del disco; el **costo del plan es estable**.

**Variante 1 — `EXPLAIN` (solo estima):**

```
EXPLAIN select count(*) from ar_amba_points
"Aggregate  (cost=11099.16..11099.17 rows=1 width=0)"
"  -> Seq Scan on ar_amba_points  (cost=0.00..9767.33 rows=532733 width=0)"
```

**Variante 2 — `EXPLAIN ANALYZE` (estima + ejecuta + mide):**

```
EXPLAIN ANALYZE select count(*) from ar_amba_points
"Aggregate  (cost=11099.16..11099.17 rows=1 width=0) (actual time=103.080..103.080 rows=1 loops=1)"
"  -> Seq Scan on ar_amba_points  (cost=0.00..9767.33 rows=532733 width=0) (actual time=0.014..58.494
rows=532733 loops=1)"
"Total runtime: 103.128 ms"
```

**Variante 3 — `EXPLAIN VERBOSE` (agrega `Output`: qué columnas emite cada nodo):**

```
EXPLAIN VERBOSE select count(*) from ar_amba_points
"Aggregate  (cost=11099.16..11099.17 rows=1 width=0)"
"  Output: count(*)"
"  -> Seq Scan on public.ar_amba_points  (cost=0.00..9767.33 rows=532733 width=0)"
"  Output: id, geom"
```

**Variante 4 — `EXPLAIN ANALYZE VERBOSE` (todo junto):**

```
EXPLAIN ANALYZE VERBOSE select count(*) from ar_amba_points
"Aggregate  (cost=11099.16..11099.17 rows=1 width=0) (actual time=99.387..99.387 rows=1 loops=1)"
"  Output: count(*)"
"  -> Seq Scan on public.ar_amba_points  (cost=0.00..9767.33 rows=532733 width=0) (actual time=0.012..56.671
rows=532733 loops=1)"
"  Output: id, geom"
"Total runtime: 99.427 ms"
```

| Variante | Ejecuta | Da tiempos reales | Da columnas de salida | Califica el nombre de esquema |
| --- | :---: | :---: | :---: | :---: |
| `EXPLAIN` | no | no | no | no (`ar_amba_points`) |
| `EXPLAIN ANALYZE` | **sí** | **sí** | no | no |
| `EXPLAIN VERBOSE` | no | no | **sí** (`Output:`) | **sí** (`public.ar_amba_points`) |
| `EXPLAIN ANALYZE VERBOSE` | **sí** | **sí** | **sí** | **sí** |

Las variantes 2 y 4 son la misma consulta: los tiempos difieren un 4% (103.128 vs 99.427 ms) y **la
estimación no cambió ni un decimal** (`11099.16..11099.17` en las cuatro). `Total runtime:` (acá) y
`Planning time:` + `Execution time:` (slide 2) son etiquetas de **versiones distintas de PostgreSQL**:
el material mezcla capturas de varios años (razonamiento propio; verificar contra la versión que se
use en clase).

### El comando `ANALYZE` (que **no** es `EXPLAIN ANALYZE`)

```
ANALYZE [ VERBOSE ] [ table [ ( column [, ...] ) ] ]
```

```
ANALYZE VERBOSE ar_amba_points;
INFO:  analyzing "public.ar_amba_points"
INFO:  "ar_amba_points": scanned 4440 of 4440 pages, containing 532733 live rows and 0 dead rows; 30000 rows in
sample, 532733 estimated total rows
Query returned successfully with no result in 81 msec.

ANALYZE VERBOSE ar_amba_points(geom);
INFO:  analyzing "public.ar_amba_points"
INFO:  "ar_amba_points": scanned 4440 of 4440 pages, containing 532733 live rows and 0 dead rows; 30000 rows in
sample, 532733 estimated total rows
Query returned successfully with no result in 71 msec.

ANALYZE VERBOSE ar_amba_points(id);
INFO:  analyzing "public.ar_amba_points"
INFO:  "ar_amba_points": scanned 4440 of 4440 pages, containing 532733 live rows and 0 dead rows; 30000 rows in
sample, 532733 estimated total rows
Query returned successfully with no result in 41 msec.
```

> [!warning] **La misma palabra, dos cosas distintas** — trampa clásica de parcial
> `EXPLAIN ANALYZE consulta` es un modificador de `EXPLAIN`: **ejecuta** la consulta y reporta los
> tiempos reales. `ANALYZE tabla` es un **comando propio**: **recolecta estadísticas** de la tabla y las
> guarda en el catálogo. El segundo hace que el primero mienta menos: sin `ANALYZE`, las `rows=`
> estimadas están desactualizadas (slide 2, `112965` vs `100000`).

Qué informa el `VERBOSE`: `scanned 4440 of 4440 pages` (leyó **todas** las páginas; en tablas grandes
muestrea), `532733 live rows`, `0 dead rows` (filas borradas todavía no recuperadas por `VACUUM`),
`30000 rows in sample` (la **muestra estadística**: `default_statistics_target × 300` con el default
`100`, razonamiento propio) y `532733 estimated total rows`, la estimación que va a
`pg_class.reltuples`. Se puede pedir por columna (`ANALYZE VERBOSE ar_amba_points(geom)`); las tres
corridas dan el mismo resumen porque la tabla no cambió y solo cambia el tiempo (81 → 71 → 41 ms; las
dos últimas están en el **slide 8**).

---

## Slides 8–9 · Cómo el planner elige, y cuánto cuesta cada cosa

El deck cita dos páginas de la documentación, *How the Planner Uses Statistics* y *Query Planning*
(URLs en § Enlaces).

### Los `enable_*`: prender y apagar estrategias

> [!quote] Textual del slide 8
> *"Los siguientes parámetros, por default están prendidos."*

Los tres primeros están en el **slide 8**; los otros nueve, en el **slide 9**. El deck **solo lista los
nombres**: la estrategia de cada uno es un **agregado propio** para poder leer los nodos de los planes
(**verificar en clase** cuáles hay que saber).

| Parámetro | Estrategia que habilita |
| --- | --- |
| `enable_bitmapscan` | **Bitmap Heap/Index Scan**: junta punteros del índice y después va al heap ordenado |
| `enable_gathermerge` | **Gather Merge**: junta resultados ya ordenados de workers paralelos |
| `enable_hashagg` | **HashAggregate**: `GROUP BY` por tabla de hash (el del slide 5) |
| `enable_hashjoin` | **Hash Join**: join construyendo una tabla de hash con el lado chico |
| `enable_indexscan` | **Index Scan**: recorre el índice y va al heap por cada fila |
| `enable_indexonlyscan` | **Index Only Scan**: se responde **solo con el índice**, sin tocar el heap |
| `enable_material` | **Materialize**: materializa un resultado intermedio para reusarlo |
| `enable_mergejoin` | **Merge Join**: join de dos entradas ordenadas |
| `enable_nestloop` | **Nested Loop**: por cada fila del lado externo, busca en el interno |
| `enable_seqscan` | **Seq Scan**: barrido secuencial de toda la tabla |
| `enable_sort` | **Sort**: ordenamiento explícito |
| `enable_tidscan` | **Tid Scan**: acceso directo por `ctid` (dirección física de la fila) |

> [!success] ✓ **Las estrategias de join sí hacen falta**: lo cierra el TP5
> `Nested Loop`, `Hash Join` y `Merge Join` figuran en el deck **solo como nombres** de esta lista, y
> **ninguna consulta del deck tiene un `JOIN`**. El **TP5** dedica un ejercicio entero al `INNER JOIN`
> entre `materia` e `inscripto`, con tres variantes de indexación (sin índices → PK en `materia` → PK
> también en `inscripto`), el único donde el enunciado pide ver el árbol en Workbench →
> [[Práctica 2026-08-18]] § *Bloque D*. La **teoría** de cada estrategia (cómo funciona, cómo se llama
> en MySQL) no está en el deck ni en el vault.

> [!quote] Textual del slide
> *"Si queremos forzar a que no tome una estrategia, lo podemos apagar (temporalmente y sólo para
> nuestra sesión) de la siguiente manera:"*

```sql
set enable_seqscan = off;
```

Apagarlos sirve para **diagnosticar**, no para optimizar (razonamiento propio, no está en el deck): si
con `enable_seqscan` apagado el plan con índice resulta más barato *y* más rápido, el planner se está
equivocando por estadísticas viejas. `off` **no prohíbe** la estrategia: le pone un costo altísimo y, si
no hay otro camino, la usa igual.

### Constantes de costo y la fórmula

> [!quote] Textual del slide
> *"También se pueden cambiar los costos (yo no los cambiaría)"*
>
> **Planner Cost Constants →**
> `https://www.postgresql.org/docs/current/static/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS`
>
> *"Algunos costos que mencionamos durante la clase:"*

```
cpu_tuple_cost = 0.01
seq_page_cost = 1
```

> [!important] Fórmula (simple) para calcular el costo — resaltada en verde en el slide
> ```
> (páginas * seq_page_cost) + (tuplas_a_retornar * cpu_tuple_cost)
> ```

`seq_page_cost = 1` es leer **una página** secuencialmente y **es la unidad** contra la que se mide todo
lo demás; `cpu_tuple_cost = 0.01` es procesar **una fila** en CPU: procesar 100 filas cuesta lo mismo
que leer 1 página.

> [!note] Verificación de la fórmula con los tres `Seq Scan` del deck — razonamiento propio
> | Tabla | Costo total del `Seq Scan` | `rows` | Páginas despejadas | ¿Verificado? |
> | --- | ---: | ---: | ---: | --- |
> | `t` | 1572.65 | 112965 | **443** | entero ✓ |
> | `ar_amba_points` | 9767.33 | 532733 | **4440** | ✓ **coincide con el `ANALYZE VERBOSE`** (4440 páginas, 532733 filas) |
> | `audiocut` | 21927.94 | 185994 | **20068** | entero ✓ |
>
> La fórmula es exacta para un `Seq Scan` sin filtros: es literalmente la que usa el planner. Los nodos
> de arriba (`Aggregate`) suman un costo por fila que el deck **no** menciona (`cpu_operator_cost`,
> 0.0025 por defecto): `11099.16 − 9767.33 = 1331.83 = 532733 × 0.0025`. **Verificar en clase** si
> entra en el parcial.

---

## Slide 10 · GEQO y `BUFFERS`

**GEQO.** El slide abre con un recuadro de solo título y link —**Genetic Query Optimization (GEQO) in
PostgreSQL** → `https://www.postgresql.org/docs/current/static/geqo-pg-intro.html`— y no lo explica.
(Contexto propio, no del slide: con muchas tablas, evaluar todos los órdenes de join posibles es
intratable y PostgreSQL pasa a una búsqueda genética aproximada. **Verificar en clase** cuánto se espera
saber.)

### `BUFFERS`: qué se leyó de caché y qué de disco

El recuadro **`BUFFERS hit & read`** pega la definición textual de la documentación, en inglés.

> [!quote] El núcleo de la definición
> *"A hit means that a read was avoided because the block was found already in cache when needed."*

| Concepto de `BUFFERS` | Qué es |
| --- | --- |
| `shared` blocks | bloques de **tablas e índices normales** |
| `local` blocks | bloques de **tablas e índices temporales** |
| `temp` blocks | datos de trabajo de corta vida: **sorts, hashes, nodos `Materialize`** |
| `hit` | se **evitó** una lectura: el bloque ya estaba en caché |
| `read` | hubo que **leerlo** de verdad |
| `dirtied` | bloques antes limpios que **esta consulta modificó** |
| `written` | bloques ya sucios **desalojados** de la caché por este backend |

Dos reglas del final de la definición, que son las que se olvidan: los buffers de un nodo padre
**incluyen** los de sus hijos, y **`BUFFERS` requiere `ANALYZE`** (*"This parameter may only be used
when ANALYZE is also enabled. It defaults to FALSE."*) y no imprime los ceros.

Ejemplo del slide:

```
EXPLAIN (ANALYZE,BUFFERS) select min(play) from audiocut;
"Aggregate  (cost=6131.31..6131.32 rows=1 width=5) (actual time=74.741..74.742 rows=1 loops=1)"
"  Buffers: shared hit=716"
"  -> Index Only Scan using idx_audiocut_id_play on audiocut  (cost=0.42..5666.33 rows=185994 width=5) (actual
time=0.058..39.626 rows=185994 loops=1)"
"  Heap Fetches: 0"
"  Buffers: shared hit=716"
"Planning time: 0.521 ms"
"Execution time: 74.815 ms"
```

> [!important] Este slide es, calladamente, **el mejor ejemplo de índices de todo el deck**
> Es **la misma consulta del slide 4** —`select min(play) from audiocut`— con un índice nuevo,
> `idx_audiocut_id_play`, que **no estaba** en el `\d audiocut` del slide 3 y cuyo `CREATE INDEX` no
> aparece en ningún slide (**verificar en clase** la definición exacta).
>
> | | Slide 4 (sin el índice) | Slide 10 (con `idx_audiocut_id_play`) |
> | --- | --- | --- |
> | Nodo de acceso | `Seq Scan on audiocut` | `Index Only Scan using idx_audiocut_id_play` |
> | Costo total | **22392.93** | **6131.32** |
> | Reducción | — | **−72.6%** |
>
> El nombre indica un índice **compuesto sobre `(id, play)`**: como `play` está *adentro* del índice,
> PostgreSQL responde **sin tocar la tabla** (`Index Only Scan`, confirmado por `Heap Fetches: 0`), y
> `shared hit=716` sin `read` significa que **las 716 páginas del índice estaban en caché, cero
> lecturas a disco**.

> [!missing] El deck **no** compara los tiempos de las dos versiones
> Del `min(play)` **sin** índice (slide 4) solo hay un `EXPLAIN` a secas: su `Time: 2.364 ms` es lo que
> tardó *planificar*, no ejecutar. La mejora de **costo** está medida (22392.93 → 6131.32); la de
> **tiempo**, no: el único `Execution time` (74.815 ms, con el `Index Only Scan` aportando 39.626 ms de
> los 74.741 del `Aggregate`) es el de este plan.

---

## Slides 11–17 · Caso real: `SELECT COUNT(*)` sobre 30 millones de filas

> [!quote] Cómo lo plantea el slide 11
> *"Voy a analizar ahora otro caso, la base de datos con los casos de covid que tenemos alojada en el
> ITBA tiene al 9/08/2022 casi 30 millones de registros, una consulta simple puede llegar a tardar
> mucho y es importante que analicemos porque está pasando eso."*
>
> `https://covid19api.it.itba.edu.ar/api/v0.4.0/swagger/#/counter/countCases`
> `https://covid19api.it.itba.edu.ar:443/api/v0.4.0/count` → `{ "count": 29.971.992}`
>
> *"**La consulta tardó más de 1 minuto (66.483 ms)** en contar todos los registros con la API, pero
> debería tardar menos de 1 segundo, ¿qué estamos haciendo mal?"*

Notación: en el texto del deck el punto separa **miles** (`66.483 ms` son 66 segundos; `29.971.992`,
casi 30 millones); en las salidas de consola pegadas de `psql` es **decimal** (`Time: 62728.394 ms`).

**Paso 1 — medir:**

```
covid-api=# \timing
Timing is on.

covid-api=# select count(*) from "CovidCases";
  count
----------
 29.971.992 (29.9 millones de registros)
(1 row)

Time: 62728.394 ms (01:02.728)
```

**Paso 2 — `EXPLAIN` (slide 12):**

```
covid-api=# explain select count(*) from "CovidCases";

  QUERY PLAN
---------------------------------------------------------------------------------------------------
 Finalize Aggregate  (cost=933897.57..933897.58 rows=1 width=8)
  -> Gather  (cost=933897.35..933897.56 rows=2 width=8)
  Workers Planned: 2
  -> Partial Aggregate  (cost=932897.35..932897.36 rows=1 width=8)
  -> Parallel Seq Scan on "CovidCases"  (cost=0.00..901691.48 rows=12482348 width=0)
 JIT:
  Functions: 4
  Options: Inlining true, Optimization true, Expressions true, Deforming true
(8 rows)

Time: 1.966 ms
```

**Paso 3 — `EXPLAIN ANALYZE` (slides 12–13):**

```
covid-api=# explain analyze select count(*) from "CovidCases";

  QUERY PLAN
------------------------------------------------------------------------------------------------------
Finalize Aggregate  (cost=933897.57..933897.58 rows=1 width=8) (actual time=75228.534..75236.991 rows=1
loops=1)
  -> Gather  (cost=933897.35..933897.56 rows=2 width=8) (actual time=75228.525..75236.985 rows=3 loops=1)
  Workers Planned: 2
  Workers Launched: 2
  -> Partial Aggregate  (cost=932897.35..932897.36 rows=1 width=8) (actual
time=75190.589..75190.589 rows=1 loops=3)
  -> Parallel Seq Scan on "CovidCases"  (cost=0.00..901691.48 rows=12482348 width=0) (actual
time=9.189..74537.711 rows=9990664 loops=3)
 Planning Time: 0.354 ms
 JIT:
  Functions: 8
  Options: Inlining true, Optimization true, Expressions true, Deforming true
  Timing: Generation 0.564 ms, Inlining 161.943 ms, Optimization 72.129 ms, Emission 12.635 ms, Total
247.271 ms
 Execution Time: 75908.713 ms
(12 rows)

Time: 75929.583 ms (01:15.930)
```

Nodos nuevos:

| Nodo / campo | Qué significa |
| --- | --- |
| `Parallel Seq Scan` | scan secuencial repartido entre varios procesos: cada uno lee una porción |
| `Partial Aggregate` | cada proceso cuenta **su** porción |
| `Gather` | el proceso líder **junta** los resultados parciales de los workers |
| `Finalize Aggregate` | suma los parciales y produce el resultado único |
| `Workers Planned: 2` / `Workers Launched: 2` | cuántos procesos auxiliares **planeó** y cuántos **arrancaron** |
| `JIT:` | PostgreSQL **compiló** expresiones a código máquina; `Timing:` dice cuánto tardó en compilar |

> [!important] Cómo se lee `loops=3` — **la trampa de lectura más común**
> El `Parallel Seq Scan` dice `rows=9990664 loops=3`. **Las filas de `actual` son POR LOOP**: el total
> real es `9990664 × 3 = 29.971.992`, exactamente el `count`. Los 3 loops son **2 workers + el proceso
> líder**, que también colabora; por eso el `Gather` reporta `rows=3`, una fila parcial por cada
> `Partial Aggregate`. Lo mismo vale para el tiempo: `actual time=...74537.711` es de **un loop**, no
> la suma.

El `EXPLAIN ANALYZE` tardó **más** que la consulta sola (`75908 ms` contra `62728 ms`): la
instrumentación y los **247 ms de compilación JIT** cuestan, y por eso sobrestima consultas con
muchísimos nodos y filas (razonamiento propio, no está en el deck).

### El pecado del ORM: `LIKE '%'`

> [!quote] Slide 13, textual
> *"Pero la aplicación a través de la API está haciendo este Query (que lo pude ver, porque active el
> log de las consultas que duran más de 1 segundo)"*

```sql
SELECT count(*) AS "count" FROM "CovidCases" AS "CovidCases" WHERE "CovidCases"."cuidado_intensivo" LIKE
'%' AND "CovidCases"."fallecido" LIKE '%' AND "CovidCases"."asistencia_respiratoria_mecanica" LIKE '%' AND
"CovidCases"."clasificacion_resumen" LIKE '%' AND ("CovidCases"."fecha_apertura" >= '2000-01-01' AND
"CovidCases"."fecha_apertura" <= '2100-01-01');
```

> [!quote] Cómo sigue el slide 13, textual
> *"Así que vamos a ver que dice el EXPLAIN con esta sentencia SQL."*
>
> *"Los LIKE '%' no hacen falta y el filtro de fechas válidas tampoco, cual es el overhead que se
> agrega con estos LIKEs y este control con las fechas?"*

Truco de diagnóstico que el slide menciona al pasar: activar el **log de consultas lentas** (más de
1 segundo) para descubrir qué SQL manda realmente la aplicación; con un ORM en el medio, no es el que se
escribió.

Los **siete índices** de `"CovidCases"`, transcritos del slide 14:

| # | Nombre | Columnas (todos `btree`) |
| --- | --- | --- |
| 1 | **`CountIndex`** | `fallecido, clasificacion_resumen, cuidado_intensivo, asistencia_respiratoria_mecanica, fecha_apertura` |
| 2 | **`ProvinceCountIndex`** | `carga_provincia_nombre, fallecido, clasificacion_resumen, cuidado_intensivo, asistencia_respiratoria_mecanica, fecha_apertura` |
| 3 | `"ProvinceStatsIndex"` | `carga_provincia_nombre, fallecido, clasificacion_resumen, id_evento_caso` |
| 4 | **`ProvinceSummaryIndex`** | `carga_provincia_nombre, fallecido, clasificacion_resumen, cuidado_intensivo, asistencia_respiratoria_mecanica, fecha_apertura, id_evento_caso` |
| 5 | **`RawSummaryIndex`** | `fecha_apertura, id_evento_caso` |
| 6 | **`StatsIndex`** | `fallecido, clasificacion_resumen, carga_provincia_nombre, id_evento_caso` |
| 7 | **`SummaryIndex`** | `fallecido, clasificacion_resumen, cuidado_intensivo, asistencia_respiratoria_mecanica, fecha_apertura, id_evento_caso` |

Están muy solapados (el 7 es el 1 con `id_evento_caso` al final; el 4, el 2 con lo mismo) y cada
`INSERT` en una tabla de 30 M paga los siete: **el índice acelera la lectura y encarece la escritura**
(razonamiento propio; el deck los lista sin comentarlos).

### Las cuatro mediciones, en orden

**(a) La consulta que manda el ORM, con todo** — slides 14–15. El slide repite el mismo SQL de arriba
precedido de `EXPLAIN`:

```
QUERY_PLAN
==========
 Finalize Aggregate  (cost=654531.00..654531.01 rows=1 width=8)
  -> Gather  (cost=654530.79..654531.00 rows=2 width=8)
  Workers Planned: 2
  -> Partial Aggregate  (cost=653530.79..653530.80 rows=1 width=8)
  -> Parallel Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..623631.96
rows=11959532 width=0)
  Index Cond: ((fecha_apertura >= '2000-01-01'::text) AND (fecha_apertura <=
'2100-01-01'::text))
  Filter: (((cuidado_intensivo)::text ~~ '%'::text) AND ((fallecido)::text ~~ '%'::text)
AND ((asistencia_respiratoria_mecanica)::text ~~ '%'::text) AND ((clasificacion_resumen)::text ~~
'%'::text))
 JIT:
  Functions: 6
  Options: Inlining true, Optimization true, Expressions true, Deforming true
(10 rows)
```

> [!quote] Slide 15, textual
> **"El costo pasó de 933897 a 654531, es decir disminuyó un 30%"**

> [!important] `Index Cond` vs. `Filter` — la distinción que hay que saber
> **`Index Cond`** es una condición que el motor **resuelve dentro del índice** y **acota qué se lee**:
> no se tocan las filas que no cumplen. **`Filter`** se aplica **después, sobre cada fila ya leída**, y
> **no acota nada**. Acá el filtro de fechas cayó en `Index Cond` (bien) y los cuatro `LIKE '%'` en
> `Filter` (puro overhead). Cuando `Filter` aparece con muchas filas descartadas, **falta un índice**.
> En la salida, `~~` es el operador interno de `LIKE` en PostgreSQL y `::text` son casts que agrega el
> motor.

**(b) Solo el filtro de fechas** — slide 15. Lo introduce con *"Si solo miramos el control adicional
de las fechas."*:

```sql
EXPLAIN SELECT count(*) AS "count" FROM "CovidCases" AS "CovidCases" WHERE "CovidCases"."fecha_apertura" >= '2000-01-01'
AND "CovidCases"."fecha_apertura" <= '2100-01-01';
```

```
 Finalize Aggregate  (cost=534935.68..534935.69 rows=1 width=8)
  -> Gather  (cost=534935.47..534935.68 rows=2 width=8)
  Workers Planned: 2
  -> Partial Aggregate  (cost=533935.47..533935.48 rows=1 width=8)
  -> Parallel Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..504036.64 rows=11959532
width=0)
  Index Cond: ((fecha_apertura >= '2000-01-01'::text) AND (fecha_apertura <= '2100-01-01'::text))
 JIT:
  Functions: 5
  Options: Inlining true, Optimization true, Expressions true, Deforming true
(9 rows)
```

> [!quote] Slide 16, textual
> **"El costo pasó de 933897 a 534935, es decir disminuyó un 43%"**

**(c) Solo los `LIKE '%'`** — slide 16. Lo introduce con *"Si solo ponemos en el WHERE el LIKE %"*:

```sql
EXPLAIN SELECT count(*) AS "count" FROM "CovidCases" AS "CovidCases" WHERE "CovidCases"."cuidado_intensivo" LIKE '%' AND
"CovidCases"."fallecido" LIKE '%' AND "CovidCases"."asistencia_respiratoria_mecanica" LIKE '%' AND
"CovidCases"."clasificacion_resumen" LIKE '%';
```

```
 Finalize Aggregate  (cost=511016.62..511016.63 rows=1 width=8)
  -> Gather  (cost=511016.41..511016.62 rows=2 width=8)
  Workers Planned: 2
  -> Partial Aggregate  (cost=510016.41..510016.42 rows=1 width=8)
  -> Parallel Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..480117.58 rows=11959532
width=0)
  Filter: (((cuidado_intensivo)::text ~~ '%'::text) AND ((fallecido)::text ~~ '%'::text) AND
((asistencia_respiratoria_mecanica)::text ~~ '%'::text) AND ((clasificacion_resumen)::text ~~ '%'::text))
 JIT:
  Functions: 5
  Options: Inlining true, Optimization true, Expressions true, Deforming true
(9 rows)
```

> [!quote] Slide 16, textual
> **"El costo pasó de 933897 a 511017, es decir se incrementó un 45.3%"**

> [!bug] El slide se contradice: `511017` es **menos** que `933897`
> `511017 / 933897 = 0.547`: el costo **disminuyó** un 45.3%, no se incrementó. La palabra
> *"incrementó"* está mal; el porcentaje está bien (los dos casos anteriores dicen *"disminuyó"* con la
> misma cuenta). **Verificar en clase**, porque cambia la moraleja del slide.

Resumen de los cuatro planes:

| Consulta | Acceso | Costo total | vs. 933897 |
| --- | --- | ---: | ---: |
| `count(*)` sin `WHERE` | `Parallel Seq Scan` | **933897** | — |
| ORM completa (fechas + 4 `LIKE '%'`) | `Parallel Index Only Scan` (`Index Cond` + `Filter`) | **654531** | −30% |
| solo fechas | `Parallel Index Only Scan` (`Index Cond`) | **534935** | −43% |
| solo `LIKE '%'` | `Parallel Index Only Scan` (`Filter`) | **511017** | −45.3% |

> [!important] La conclusión contraintuitiva del tramo
> **Agregar un `WHERE` inútil salió más barato que no poner nada**: el `WHERE` le permitió al planner
> usar `CountIndex`, más chico que la tabla, en vez del `Parallel Seq Scan` de la tabla entera. Pero la
> comparación que importa es **entre las tres variantes con índice**: la ORM completa (654531) es la
> **más cara** justamente porque paga el `Index Cond` *y* el `Filter`. Textual del slide: *"Por lo
> tanto, hay que tener cuidado con el LIKE % o con otros controles adicionales (el de las fechas), que
> nunca fue solicitado."*

### El contraste final: una consulta selectiva

> [!quote] Cierre del slide 16, textual
> *"Por otro lado, si hacemos una consulta más específica, por ej. cuántos casos tengo que fallecieron
> por COVID19, al 25/03/2022 son 127.759 de 28.688.491, esa consulta se realiza en 26 milisegundos."*

> [!quote] Apertura del slide 17, textual
> *"Si miramos el costo, es de 1202 frente a 391421 que cuesta contar TODOS los registros de la tabla
> "CovidCases"."*

```
covid-api=# explain select count(*) from "CovidCases" where fallecido = 'SI' and clasificacion_resumen = 'Confirmado';
  QUERY PLAN
---------------------------------------------------------------------------------------------------
 Aggregate  (cost=1202.31..1202.32 rows=1 width=8)
  -> Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..1086.56 rows=46300 width=0)
  Index Cond: ((fallecido = 'SI'::text) AND (clasificacion_resumen = 'Confirmado'::text))
(3 rows)

covid-api=# explain analyze select count(*) from "CovidCases" where fallecido = 'SI' and clasificacion_resumen =
'Confirmado';
  QUERY PLAN
---------------------------------------------------------------------------------------------------
 Aggregate  (cost=1202.31..1202.32 rows=1 width=8) (actual time=26.789..26.789 rows=1 loops=1)
  -> Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..1086.56 rows=46300 width=0) (actual
time=0.051..17.203 rows=127759 loops=1)
  Index Cond: ((fallecido = 'SI'::text) AND (clasificacion_resumen = 'Confirmado'::text))
  Heap Fetches: 0
 Planning Time: 0.085 ms
 Execution Time: 26.806 ms
(6 rows)
```

Lo que hay que ver: **costo 1202 contra 933897**, un factor de **777×**, y ya sin paralelismo porque con
tan pocas filas no vale la pena repartir el trabajo; **`fallecido` y `clasificacion_resumen` son las
dos primeras columnas de `CountIndex`**, por eso las dos condiciones entran como `Index Cond` (la regla
del **prefijo izquierdo**, demostrada a fondo en `graduados`); **`Heap Fetches: 0`**, todo salió del
índice; y **`Execution Time: 26.806 ms`** contra los **62 segundos** del `count(*)` completo.

> [!bug] El número `391421` no aparece en ningún plan del deck
> El slide 17 dice que contar todos los registros cuesta **391421**, pero el `EXPLAIN` del slide 12
> mostró **933897** y ninguna de las cuatro variantes da 391421. Puede ser de otra corrida con menos
> filas (el texto habla del 25/03/2022 con 28.688.491 registros; el resto del tramo es del 9/08/2022
> con 29.971.992). **Verificar en clase**; el contraste conceptual se sostiene igual.

> [!warning] La estimación vuelve a errar, y feo: `rows=46300` estimadas vs. `rows=127759` reales
> Casi **3× de subestimación**; el deck no lo comenta. **Razonamiento propio:** con dos predicados el
> planner multiplica selectividades asumiendo **independencia** entre `fallecido` y
> `clasificacion_resumen`, y acá están correlacionadas (casi todo fallecido es "Confirmado"). Es la
> causa típica de subestimación en `AND` de columnas correlacionadas. **Verificar en clase.**

---

## Slides 17–21 · Laboratorio de índices: la tabla `graduados`

El tramo que el cronograma anuncia como "Índices". Tabla chica y controlada: **8532 graduados**,
columnas `titulo`, `apellido`, `nombre` (el `select count(*) from graduados` aparece al pie del
**slide 17** y otra vez arriba del **18**).

```
select count(*) from graduados
-- 8532

select * from graduados limit 10
```

| titulo | apellido | nombre |
| --- | --- | --- |
| Ingeniero Industrial | Moreyra Maida | Solange Micaela |
| Ingeniero en Petróleo | Gilardone | Agustina |
| Ingeniero Electrónico | Burna Macol | Daniel |
| Ingeniero Industrial | Schojet | Maya |
| Ingeniero Industrial | **Lugones** | **Facundo Lorenzo** |
| .. | .. | .. |

*(El slide marca `Lugones` / `Facundo Lorenzo` en naranja: es la fila que se busca en todos los
experimentos.)*

Dos datos de **cardinalidad** que el deck pone recién al final (slide 21) pero que explican todo:

```
select count(*) from (select distinct apellido from graduados) as foo
-- 6.332

select count(*) from (select distinct nombre from graduados) as foo
-- 4.318
```

| Columna | Valores distintos | Filas por valor (promedio) | Selectividad |
| --- | ---: | ---: | --- |
| `apellido` | **6332** de 8532 | 1.35 | **más selectiva** |
| `nombre` | **4318** de 8532 | 1.98 | menos selectiva |

El deck escribe `explain analyse` (con **s**) en todo el tramo y está transcrito tal cual: PostgreSQL
acepta las dos grafías, `ANALYZE` y `ANALYSE` (razonamiento propio; **verificar** si MySQL también).

### Experimento 1 — sin ningún índice

```sql
explain analyse
  select *
  from graduados
  where apellido = 'Lugones' and nombre = 'Facundo Lorenzo'
-- sin indice
```

```
Seq Scan on graduados  (cost=0.00..208.98 rows=1 width=43) (actual time=0.022..2.099 rows=1 loops=1)
Planning Time: 0.104 ms
Execution Time: 2.115 ms
```

### Experimento 2 — índice sobre `apellido`

El `CREATE INDEX` cierra el slide 18; el `explain analyse` y su salida abren el 19.

```sql
CREATE INDEX graduados_a_idx ON graduados (apellido);

explain analyse
  select *
  from graduados
  where apellido = 'Lugones' and nombre = 'Facundo Lorenzo'
```

```
Index Scan using graduados_a_idx on graduados  (cost=0.29..8.30 rows=1 width=43) (actual time=0.131..0.158
rows=1 loops=1)
  Index Cond: (apellido = 'Lugones'::text)
  Filter: (nombre = 'Facundo Lorenzo'::text)
  Rows Removed by Filter: 1
Planning Time: 1.270 ms
Execution Time: 0.177 ms
```

> [!important] `Rows Removed by Filter: 1`
> **Razonamiento propio, no está en el deck:** el índice encontró **2 filas** con
> `apellido = 'Lugones'` (1 emitida + 1 descartada) y el `Filter` sobre `nombre` descartó **1**. Este
> contador mide **el trabajo desperdiciado**: si es grande, al índice le falta una columna o falta otro
> índice.

### Experimento 3 — índice **compuesto** `(apellido, nombre)`

```sql
CREATE INDEX graduados_an_idx ON graduados (apellido, nombre);

explain analyse
  select *
  from graduados
  where apellido = 'Lugones' and nombre = 'Facundo Lorenzo'
```

```
Index Scan using graduados_an_idx on graduados  (cost=0.29..8.30 rows=1 width=43) (actual time=0.083..0.084
rows=1 loops=1)
  Index Cond: ((apellido = 'Lugones'::text) AND (nombre = 'Facundo Lorenzo'::text))
Planning Time: 0.605 ms
Execution Time: 0.108 ms
```

> [!important] **Las dos condiciones subieron de `Filter` a `Index Cond`**
> Desaparecen el `Filter` y el `Rows Removed by Filter`: el índice ya discrimina por las dos columnas.
> El **costo estimado no cambió** (`0.29..8.30` en los dos), pero el tiempo real bajó de 0.177 a
> 0.108 ms. **Este es el argumento a favor de los índices compuestos.**

### Experimento 4 — buscar por `nombre` cuando el índice es por `apellido`

```sql
explain analyse
  select *
  from graduados
  where
  nombre = 'Facundo Lorenzo'
-- no usa ningun indice, hace un escaneo secuencial
```

```
 Seq Scan on graduados  (cost=0.00..187.65 rows=1 width=43) (actual time=0.022..2.033 rows=1 loops=1)
  Filter: (nombre = 'Facundo Lorenzo'::text)
  Rows Removed by Filter: 8531
Planning Time: 0.147 ms
Execution Time: 2.048 ms
```

> [!important] **La regla del prefijo izquierdo**
> Existen `graduados_a_idx (apellido)` y `graduados_an_idx (apellido, nombre)`, y **ninguno sirve**
> para filtrar solo por `nombre`: un btree compuesto está ordenado **primero** por `apellido`, y sin
> `apellido` no acota nada, igual que buscar en la guía telefónica por nombre de pila.
> `Rows Removed by Filter: 8531` es la firma del desastre: leyó **las 8532 filas** y tiró 8531.
>
> **Corolario para el TP y el parcial: en un índice compuesto, el ORDEN de las columnas importa.**

### Experimento 5 — el `LIKE '%'` otra vez, ahora en chiquito

```sql
explain analyse
  select *
  from graduados
  where apellido like '%' and nombre = 'Facundo Lorenzo'
```

```
Seq Scan on graduados  (cost=0.00..208.98 rows=1 width=43) (actual time=0.040..2.418 rows=1 loops=1)
  Filter: ((apellido ~~ '%'::text) AND (nombre = 'Facundo Lorenzo'::text))
  Rows Removed by Filter: 8531
Planning Time: 0.202 ms
Execution Time: 2.527 ms
```

> [!important] `apellido LIKE '%'` **no** habilita el índice sobre `apellido`
> `LIKE '%'` no es una condición de rango: no acota nada, va a `Filter` y el plan sigue siendo
> `Seq Scan`. Es la versión de laboratorio del problema del ORM de `CovidCases`. Cuánto cuesta
> exactamente (razonamiento propio): con un solo predicado el `Seq Scan` cuesta **187.65**; con
> `apellido LIKE '%'`, **208.98**. La diferencia, **21.33 = 8532 × 0.0025**, es un `cpu_operator_cost`
> por cada fila de la tabla: evaluar la condición 8532 veces. El deck da la fórmula "simple" y no
> menciona esa constante. **Verificar en clase.**

### Experimento 6 — qué pasa cuando hay dos índices simples y ninguno compuesto

```sql
CREATE INDEX graduados_n_idx ON graduados (nombre);

drop index graduados_an_idx
```

Quedan `graduados_a_idx (apellido)` y `graduados_n_idx (nombre)`, sin el compuesto:

```
explain analyse
  select *
  from graduados
  where apellido = 'Lugones' and nombre = 'Facundo Lorenzo'

Index Scan using graduados_n_idx on graduados  (cost=0.29..8.30 rows=1 width=43) (actual time=0.193..0.197
rows=1 loops=1)
  Index Cond: (nombre = 'Facundo Lorenzo'::text)
  Filter: (apellido = 'Lugones'::text)
Planning Time: 2.369 ms
Execution Time: 0.240 ms
```

Y con las **dos condiciones dadas vuelta** en el `WHERE` (slide 21):

```
explain analyse
  select *
  from graduados
  where nombre = 'Facundo Lorenzo' and apellido = 'Lugones'

Index Scan using graduados_n_idx on graduados  (cost=0.29..8.30 rows=1 width=43) (actual time=0.060..0.063
rows=1 loops=1)
  Index Cond: (nombre = 'Facundo Lorenzo'::text)
  Filter: (apellido = 'Lugones'::text)
Planning Time: 0.326 ms
Execution Time: 0.105 ms
```

> [!important] **El orden de las condiciones en el `WHERE` no cambia el plan**
> Mismo nodo, mismo índice, mismo costo, mismo `Index Cond`, mismo `Filter`: SQL es **declarativo** y
> el planner reordena por su cuenta. Lo que sí importa es el **orden de las columnas dentro del
> índice** (experimento 4).

> [!question] ¿Por qué eligió `graduados_n_idx` y no `graduados_a_idx`?
> `apellido` es **más selectivo** (6332 distintos contra 4318), pero los dos índices dan **el mismo
> costo estimado** (`cost=0.29..8.30 rows=1`): para el planner es un **empate** y desempata por
> criterios internos. **Razonamiento propio, no está en el deck. Verificar en clase** — es una buena
> pregunta de parcial.

### El ejercicio que el deck deja sin resolver

```sql
select nombre, apellido, length(nombre) from graduados order by 3 limit 10

explain analyse
  select *
  from graduados
  where nombre = 'Luz' and apellido = 'Wetzler Malbrán'
```

> [!question] Slide 21: el último `explain analyse` **no tiene salida en el deck**
> **Razonamiento propio:** `order by 3` ordena por la **tercera columna de la proyección**,
> `length(nombre)`, o sea busca los nombres **más cortos**: de ahí sale `'Luz'`. La apuesta es otra vez
> `Index Scan using graduados_n_idx` con `Index Cond: (nombre = 'Luz')`, `Filter: (apellido = ...)` y
> un `Rows Removed by Filter` **mayor** que con `Facundo Lorenzo`, porque `'Luz'` es un nombre mucho
> más frecuente.
>
> **El TP5 no lo reproduce**: corre sobre **MySQL** con otras tablas (`materia`, `inscripto`). El
> experimento **equivalente** ahí es
> `SELECT nombre FROM materia WHERE codigo = 60 AND nombre = 'Base de Datos II';` con sus tres variantes
> de indexación —sin constraints · PK compuesta · dos `UNIQUE` separados—, § *Bloque B* de
> [[Práctica 2026-08-18]]. Este `explain analyse` queda sin correr.

---

## Slide 22 · El único link de cierre

El deck termina con un slide de dos líneas:

> [!quote] Textual del slide 22
> Performance Tips > Using EXPLAIN
> `https://www.postgresql.org/docs/current/using-explain.html`

---

## Nodos del plan que aparecen en el deck

| Nodo | Qué hace | Slides |
| --- | --- | --- |
| `Seq Scan` | lee la tabla **entera**, fila por fila | 2, 4, 5, 6, 7, 18, 20 |
| `Parallel Seq Scan` | idem, repartido entre varios procesos | 12, 13 |
| `Index Scan` | recorre el índice **y va al heap** a buscar cada fila | 19, 20, 21 |
| `Index Only Scan` | se responde **solo con el índice** (`Heap Fetches: 0`) | 3, 10, 17 |
| `Parallel Index Only Scan` | idem, en paralelo | 14, 15, 16 |
| `Aggregate` | calcula `count`, `sum`, `min`… sobre todo el input | 2, 4, 6, 7, 10, 17 |
| `Partial Aggregate` / `Finalize Aggregate` | agregación en dos pasos para el paralelismo | 12, 13, 14, 15, 16 |
| `HashAggregate` | `GROUP BY` armando una tabla de hash (`Group Key:`) | 5 |
| `Sort` | ordena; muestra `Sort Key:` | 5 |
| `Limit` | corta las primeras N filas | 3, 5, 6 |
| `Gather` | el líder junta los resultados de los workers | 12, 13, 14, 15, 16 |
| `Result` + `InitPlan` | subplán que se evalúa una vez y devuelve un escalar (`$0`) | 3 |

Anotaciones que pueden colgar de un nodo:

| Anotación | Qué dice |
| --- | --- |
| `Index Cond:` | condición resuelta **dentro** del índice → acota lo que se lee |
| `Filter:` | condición aplicada **después** de leer → no acota nada |
| `Rows Removed by Filter:` | cuántas filas se leyeron **al pedo** |
| `Heap Fetches:` | cuántas veces un `Index Only Scan` tuvo que ir igual a la tabla (`0` es lo ideal) |
| `Sort Key:` / `Group Key:` | por qué expresión ordena / agrupa |
| `Output:` | qué columnas emite el nodo (solo con `VERBOSE`) |
| `Buffers: shared hit=/read=` | bloques servidos de caché / leídos de disco (solo con `BUFFERS`) |
| `Workers Planned:` / `Workers Launched:` | paralelismo planeado vs. real |
| `JIT:` | compilación de expresiones; `Timing:` dice cuánto tardó compilar |

---

## Qué enseña el deck sobre índices

Es el tema que el [[_cronograma]] pone en la teórica del 10/08; el deck no lo declara como sección,
pero está entero. Tabla de decisión:

| Situación | Plan que sale | Evidencia en el deck |
| --- | --- | --- |
| Columna **sin** índice | `Seq Scan` sobre toda la tabla | `min(play)`: costo **22392** (slide 4) |
| Columna **con** índice, buscando el mínimo | `Index Only Scan` + `Limit` | `min(id)`: costo **0.48** (slide 3) |
| Índice **simple**, dos condiciones | `Index Scan` + `Filter` + `Rows Removed by Filter` | `graduados_a_idx` (slide 19) |
| Índice **compuesto** que cubre las dos condiciones | `Index Scan` con las dos en `Index Cond` | `graduados_an_idx` (slide 19) |
| Filtrar por la **2ª** columna de un compuesto, sin la 1ª | **`Seq Scan`** — el índice no sirve | `nombre` solo (slide 20) |
| Índice que **contiene todas** las columnas pedidas | `Index Only Scan`, `Heap Fetches: 0` | `idx_audiocut_id_play` (slide 10), `CountIndex` (slide 17) |
| Condición `LIKE '%'` sobre columna indexada | `Filter`, **el índice no se usa** | slides 16 y 20 |
| Consulta muy **selectiva** sobre tabla enorme | `Index Only Scan`, sin paralelismo | 1202 vs 933897 (slide 17) |
| Consulta **no selectiva** sobre tabla enorme | `Parallel Seq Scan` | `count(*)` en `CovidCases` (slide 12) |

Las reglas que se desprenden valen igual en PostgreSQL y en MySQL: la sintaxis cambia, los conceptos
no.

1. **El plan es un árbol** y se lee **de adentro hacia afuera**.
2. **Estimación ≠ realidad**: el optimizador estima a partir de **estadísticas**, que se actualizan con
  `ANALYZE`.
3. **Full scan vs. acceso por índice** es la decisión central.
4. **El índice sirve si el motor puede meter la condición en `Index Cond`** (`key` en MySQL). Si termina
  en `Filter` (`Using where`), se leyó todo igual.
5. **En un índice compuesto, el orden de las columnas manda**: hay que dar el prefijo izquierdo.
  `(apellido, nombre)` sirve para `apellido` y para `apellido AND nombre`; **no** sirve para `nombre`.
6. **El orden de las condiciones en el `WHERE` no importa.** El planner reordena.
7. **Un índice que cubre todas las columnas pedidas evita la tabla** → `Index Only Scan`,
  `Heap Fetches: 0`. Es el caso más rápido.
8. **Condiciones inútiles cuestan** (`LIKE '%'`, rangos de fecha que abarcan todo), y las meten los
  ORMs sin que nadie las pida.
9. **Más índices no es mejor**: `audiocut` tiene dos índices idénticos sobre `id`, `"CovidCases"` tiene
  siete muy solapados. Cada uno se paga en cada escritura.

---

## PostgreSQL vs. MySQL — traducción del deck

Traducción de cada cosa del deck, **con el nivel de certeza declarado**:

| Del deck (PostgreSQL) | En MySQL | Certeza |
| --- | --- | --- |
| `EXPLAIN consulta` | `EXPLAIN consulta` (también `DESCRIBE` / `DESC` como sinónimos) | **seguro** |
| — | `EXPLAIN FORMAT=JSON` (muestra `query_cost`) y `EXPLAIN FORMAT=TREE` (salida anidada, parecida a la de PG) | **seguro** que existen; la **versión** desde la que están, verificar |
| — | **`SET @@explain_format=TREE;`** — **variable de sesión** (con **dos** `@`), fija el formato para toda la sesión en vez de repetir `FORMAT=TREE` en cada sentencia. Es la **primera sentencia del TP5** | **seguro**: transcrito del enunciado → [[Práctica 2026-08-18]] |
| `EXPLAIN ANALYZE` | `EXPLAIN ANALYZE` — creo que desde **MySQL 8.0.18**, con salida en formato árbol | existe: **seguro**; el **número de versión**: verificar |
| `EXPLAIN VERBOSE` | no hay equivalente directo; lo más cercano es `FORMAT=JSON` | **verificar** |
| `EXPLAIN (ANALYZE, BUFFERS)` | no hay equivalente directo | **verificar** — mirar `SHOW STATUS LIKE 'Handler%'` y `performance_schema` |
| `pg_class.relpages / reltuples` | `information_schema.TABLES` → `TABLE_ROWS`, `DATA_LENGTH`, `AVG_ROW_LENGTH`; también `SHOW TABLE STATUS` | **seguro** que existen; en InnoDB `TABLE_ROWS` es **estimado**, igual que `reltuples` |
| `ANALYZE VERBOSE tabla` | `ANALYZE TABLE tabla` (recalcula estadísticas de índices) | **seguro** |
| `\timing` | no existe: el cliente `mysql` **ya imprime** el tiempo de cada consulta (`1 row in set (0.01 sec)`) | **seguro** |
| `\d tabla` | `DESCRIBE tabla` / `SHOW CREATE TABLE tabla`; índices con `SHOW INDEX FROM tabla` | **seguro** |
| `generate_series(1,100000)` | **no existe**. Se emula con un `WITH RECURSIVE` (MySQL 8+) | **seguro** que no existe; el CTE recursivo: **seguro** que está en 8.0 |
| `BEGIN; … ROLLBACK;` | igual (`BEGIN` o `START TRANSACTION`, `COMMIT`, `ROLLBACK`); `autocommit=1` por defecto | **seguro** |
| — | (atención) **pero en MySQL el DDL hace `COMMIT` implícito**: un `CREATE TABLE AS` **no** se puede envolver en `BEGIN…ROLLBACK` como propone el slide 1 | **seguro** — y es una diferencia que cambia el consejo del deck |
| `set enable_seqscan = off` | no hay equivalente exacto. Está la variable `optimizer_switch` (otras estrategias) y los **hints de índice** `USE INDEX` / `FORCE INDEX` / `IGNORE INDEX` | los hints: **seguro**. La equivalencia fina: **verificar** |
| `seq_page_cost`, `cpu_tuple_cost` | MySQL tiene un modelo de costos configurable en las tablas `mysql.server_cost` y `mysql.engine_cost` | **verificar** los nombres exactos de las constantes |
| `Seq Scan` | columna `type = ALL` en el `EXPLAIN` clásico | **razonablemente seguro** |
| `Index Scan` | `type = ref` / `range` / `eq_ref` / `const`, con `key` = índice usado | **razonablemente seguro** |
| `Index Only Scan` | `Extra: Using index` (covering index) | **razonablemente seguro** |
| `Filter` | `Extra: Using where` | **razonablemente seguro** |
| `Sort` | `Extra: Using filesort` | **razonablemente seguro** |
| `HashAggregate` | `Extra: Using temporary` (`GROUP BY` con tabla temporal) | **verificar** |
| `cost=inicio..total` en cada nodo | **no aparece** en el `EXPLAIN` clásico. Sí en `FORMAT=JSON` (`query_cost`) y en `FORMAT=TREE` | **razonablemente seguro** |
| `rows=` estimadas | columna `rows` (+ `filtered`, el % estimado que sobrevive al `WHERE`) | **seguro** |
| `psql` / `pgAdmin` | cliente `mysql` / **MySQL Workbench**, que tiene *Visual Explain* (equivalente al dibujo del slide 6). El TP5 pide además el **"Form Editor"** del grid de resultados: *"Elegir la opción "Form Editor" en MySQL Workbench para ver el árbol"* → [[Práctica 2026-08-18]] | *Visual Explain*: **seguro**. Que el *Form Editor* **complementa** y no reemplaza a *Visual Explain* (uno dibuja el plan; el otro muestra formateado el valor multilínea de una celda, donde cae la salida `TREE`): **razonamiento propio, verificar** |
| `Parallel Seq Scan`, `Gather`, `Workers` | InnoDB tiene lectura paralela limitada (`innodb_parallel_read_threads`), no un `Gather` general | **verificar** |
| `JIT:` | **no existe** en MySQL | **razonablemente seguro** |

---

## Guía de lectura de un plan

El método, en el orden en que conviene aplicarlo. Sirve para el TP5 y para el parcial.

### Paso 0 — ¿`EXPLAIN` o `EXPLAIN ANALYZE`?

- `SELECT` barato → `EXPLAIN ANALYZE` directo: se quieren los números reales.
- `INSERT` / `UPDATE` / `DELETE` / `CREATE TABLE AS` / `EXECUTE` → **`BEGIN; … ROLLBACK;`**.
- Consulta que puede tardar minutos (como el `count(*)` de 30 M) → empezar con `EXPLAIN` a secas:
  cuesta 2 ms y ya dice si va a hacer un full scan.

### Paso 1 — leer **de adentro hacia afuera**

El nodo **más sangrado** se ejecuta **primero**; cada `->` apunta a un hijo, y el hijo alimenta al
padre. Ejemplo del slide 5, con el orden real de ejecución:

```
"Limit  ← 4º  corta en 10
"  -> Sort  ← 3º  ordena por sum(play) DESC
"  -> HashAggregate  ← 2º  agrupa por username
"  -> Seq Scan  ← 1º  ¡acá empieza todo!
```

### Paso 2 — mirar **la hoja**, no la raíz

El 90% de los problemas está en el nodo **más profundo**: cómo se accede a los datos.

| Lo que se ve abajo de todo | Qué significa |
| --- | --- |
| `Seq Scan` sobre una tabla grande | leyó todo. **¿Falta un índice? ¿O el `WHERE` no es selectivo?** |
| `Index Scan` / `Index Only Scan` | usó un índice. **¿Cuál?** El nombre está en la línea |
| `Index Only Scan` + `Heap Fetches: 0` | el mejor caso: ni tocó la tabla |
| `Parallel *` | la consulta era tan cara que valió la pena repartirla |

### Paso 3 — `Index Cond` vs. `Filter`

La lectura que más rinde: lo que está en `Index Cond` **acota** lo que se lee; lo que está en `Filter`
se evalúa **fila por fila sobre filas ya leídas**, cuesta y no ahorra. **`Rows Removed by Filter` es el
termómetro**: si descarta miles de filas, falta un índice o falta una columna en el que ya existe.

### Paso 4 — costo: comparar, no predecir

El **inicio** de `cost=inicio..total` importa cuando arriba hay un `LIMIT`; el **total**, cuando se
consumen todas las filas. Es una **unidad arbitraria** (`seq_page_cost = 1`), no milisegundos, y **solo
tiene sentido comparado con otro plan de la misma consulta**: todo el tramo de `CovidCases` es eso,
933897 → 654531 → 534935 → 511017 → 1202.

### Paso 5 — con `ANALYZE`, comparar **estimado contra real**

| Síntoma | Diagnóstico |
| --- | --- |
| `rows=` estimadas ≈ `rows=` reales | las estadísticas están bien; si el plan es malo, el problema es otro |
| estimadas **muy** distintas de reales | **estadísticas viejas o correlación entre columnas** → correr `ANALYZE tabla` |
| `actual time` alto en el nodo **más profundo** | el problema es el **acceso** a los datos |
| `actual time` alto **arriba** (`Sort`, `HashAggregate`) | el problema es el **procesamiento**: mucha fila intermedia |

Los tres casos de subestimación del propio deck: `112965` vs `100000` (tabla recién creada, sin
`ANALYZE`), `46300` vs `127759` (dos predicados correlacionados) y `rows=2` del `Gather` vs `rows=3`
real (el líder también trabaja).

### Paso 6 — `loops`

Si un nodo dice `loops=N` con `N > 1`, **las filas y los tiempos de `actual` son por loop**:
`9990664 × 3 = 29.971.992`.

### Paso 7 — no confiar en el cronómetro

El reloj depende de la caché y de la carga (*"pero si lo volvemos a correr, puede dar otros valores,
por ej. 61, 41, 30, … ms"*); el **costo del plan es reproducible**. Con `BUFFERS`, `shared hit` alto
significa que casi todo salió de caché, o sea que la próxima corrida en frío va a ser peor.

---

## Dudas abiertas

- [ ] **Slide 16:** *"se incrementó un 45.3%"* cuando el costo **bajó** (933897 → 511017). ¿Tipeo por
  "disminuyó", o la comparación era contra otra cosa?
- [ ] **Slide 17:** contar todos los registros, ¿cuesta 933897 o 391421? El deck usa los dos números
  con fechas de corte distintas (9/08/2022 y 25/03/2022).
- [ ] **¿De dónde sale `idx_audiocut_id_play`?** Aparece en el slide 10 pero no en el `\d audiocut`
  del slide 3, y no hay `CREATE INDEX` en ningún slide.
- [ ] **¿Por qué `audiocut` tiene dos índices btree sobre `id`** (`audiocut_pk` e `idx_audiocut_id`)?
  ¿Índice redundante a propósito o descuido?
- [ ] **Slide 20/21:** con `graduados_a_idx (apellido)` y `graduados_n_idx (nombre)`, ¿por qué el
  planner elige el de `nombre`, si `apellido` es más selectivo y los costos estimados son idénticos
  (`0.29..8.30`)?
- [ ] **Slide 21:** ¿cuál es el plan de `where nombre = 'Luz' and apellido = 'Wetzler Malbrán'`? El
  TP5 no lo reproduce (§ *Bloque B* de [[Práctica 2026-08-18]] es el equivalente en MySQL).
- [ ] **¿Entra `cpu_operator_cost` (0.0025) en el parcial?** Sin esa constante no cierran ni el
  `Aggregate` ni los `Seq Scan` con `Filter`.
- [ ] **¿Cuánto hay que saber de `GEQO`?** El **slide 10** pone el título y el link, y nada más.
- [ ] **¿La versión de PostgreSQL?** El deck mezcla `Total runtime:` con `Planning time:` /
  `Execution time:`.
- [ ] **El parcial ~~y el TP5~~, ¿es sobre MySQL o sobre PostgreSQL?** ✓ El TP5 es **MySQL** (su
  enunciado: *"Antes de comenzar, es necesario levantar **MySQL** en la PC que vayan a utilizar para
  este práctico"* → [[Práctica 2026-08-18]]), así que **sí, hay que rehacer todos los ejemplos** de este
  deck. (crítico) **La mitad parcial sigue abierta:** el enunciado del TP5 no dice nada del parcial.
- [ ] **En MySQL, ¿desde qué versión está `EXPLAIN ANALYZE`?** 8.0.18 está escrito de memoria y sin
  verificar; confirmar contra la doc oficial antes de usarlo en el TP.
- [ ] **¿Cuál es el equivalente MySQL de `EXPLAIN (ANALYZE, BUFFERS)`?** No hay uno directo.
- [ ] **En MySQL el DDL hace `COMMIT` implícito**, así que `BEGIN; EXPLAIN ANALYZE CREATE TABLE AS …;
  ROLLBACK;` del slide 1 **no funciona**. ¿Cómo se hace el equivalente?

## Enlaces

- Clase anterior: [[Clase 07 - Vistas-Parte 2]] · clase siguiente: *(todavía sin material)*
- Del mismo lunes 10/08: [[Clase 06 - Vistas-Parte 1]] · [[Clase 07 - Vistas-Parte 2]]
- Se practica en: [[Práctica 2026-08-18]] (**TP5 Explain Plan**, martes 18/08)
- Motores: [[PostgreSQL]] · [[MySQL]]
- Conceptos: [[1.08.01 - Plan de ejecución|Plan de ejecución]] · [[1.08.02 - Índices|Índices]] · [[Índice compuesto]] · [[Estadísticas del optimizador]] ·
  [[Selectividad]] · [[Costo de una consulta]] · [[1.11.03 - Transacciones y ACID|Transacciones ACID]]
- Bibliografía: [[_index-bibliografia]] · calendario: [[_cronograma]] · índice: [[_index-clases]]
- Documentación citada por el deck (toda de PostgreSQL):
  - `https://www.postgresql.org/docs/current/sql-explain.html` — **EXPLAIN**
  - `https://www.postgresql.org/docs/current/static/planner-stats-details.html` — *How the Planner Uses Statistics*
  - `https://www.postgresql.org/docs/current/static/runtime-config-query.html` — *Query Planning*
  - `https://www.postgresql.org/docs/current/static/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS` — *Planner Cost Constants*
  - `https://www.postgresql.org/docs/current/static/geqo-pg-intro.html` — *Genetic Query Optimization*
  - `https://www.postgresql.org/docs/current/using-explain.html` — *Performance Tips > Using EXPLAIN* (slide 22)
