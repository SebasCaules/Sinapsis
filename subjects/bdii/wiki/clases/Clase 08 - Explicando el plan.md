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

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 08 - Explicando el plan(1).pdf` · **22 slides**
> Dictada el **lunes 10/08**, virtual, 19:00–22:00. El `08` del nombre del archivo **es el número de
> clase**: la numeración de la cátedra (`BD2_Clase NN`) es la única que existe, y cada deck es su
> propia clase. Ese mismo lunes se dictaron también las Clases 06 y 07
> → [[Clase 06 - Vistas-Parte 1]] · [[Clase 07 - Vistas-Parte 2]].
> Se practica en el **TP5 Explain Plan**, martes **18/08** → [[Práctica 2026-08-18]] — que corre
> sobre **MySQL**, confirmado por su enunciado.
> Bibliografía: [[_index-bibliografia]].

> [!info] Esta clase vive en `raw/Unidad-01/Teorica/`
> No es un error de archivado: **la Unidad-01 agrupa las Clases 01 a 08**, y una carpeta de unidad
> puede contener varias clases. El path no dice a qué clase pertenece un archivo — eso lo registra
> [[_index-clases]].

> [!important] Este deck es **PostgreSQL puro** — la cursada corre sobre **MySQL**
> Es la **tercera** vez que aparece el desfasaje motor-material (ya estaba documentado para los decks
> `BD2_Clase 01` y `BD2_Clase 04`). Todo lo que sigue es de PostgreSQL y **nada de esto existe igual en
> MySQL**:
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

## Resumen

El deck es **una transcripción de sesión de consola**: casi no hay teoría escrita, hay comandos y
salidas. El argumento se construye con cuatro bases de datos reales, y siempre es el mismo: *la misma
consulta cuesta órdenes de magnitud distintos según cómo esté escrita y qué índices haya*.

| Slides | Base de ejemplo | Qué demuestra |
| --- | --- | --- |
| **1** | — | Qué es `EXPLAIN`, `EXPLAIN ANALYZE`, `BEGIN…ROLLBACK`, `pg_class` |
| **2** | `radiocut` → tabla `t` | Primer plan completo; la **estimación de filas puede errar** (112965 vs 100000) |
| **3–6** | `radiocut` → `audiocut` | `min(id)` **con** índice vs `min(play)` **sin** índice: 0.48 vs 22392 de costo; después `GROUP BY`+`ORDER BY`+`LIMIT` |
| **6–8** | `ar_amba_points` | `EXPLAIN` vs `ANALYZE` vs `VERBOSE`; el comando `ANALYZE` recolecta estadísticas |
| **8–9** | — | Parámetros `enable_*`, constantes de costo y la **fórmula simple del costo** |
| **10** | `audiocut` | Link a **GEQO**; `BUFFERS`: `shared hit` vs `read`; un índice nuevo baja `min(play)` de 22392 a 6131 |
| **11–17** | `CovidCases` (30 M) | Caso real: `LIKE '%'` de un ORM; 933897 → 654531 → 534935 → 511017 de costo |
| **17–21** | `graduados` (8532) | Laboratorio de índices: sin índice, simple, compuesto, y el orden de las columnas |
| **22** | — | Link a *Performance Tips > Using EXPLAIN* |

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

Las dos únicas definiciones del deck, y las dos importan para el parcial:

| Sentencia | Qué hace |
| --- | --- |
| `EXPLAIN` | **Solo estima.** Muestra el plan que el planner eligió, sin correr la consulta. |
| `EXPLAIN ANALYZE` | **Explica y ejecuta.** Corre la consulta de verdad y agrega los números reales. |

> [!warning] `EXPLAIN ANALYZE` **ejecuta**: cuidado con lo que le pasás
> Es exactamente el problema del recuadro siguiente del slide.

### `BEGIN` y `ROLLBACK` para no tocar los datos

> [!quote] Textual del slide
> *"Si queremos hacer un EXPLAIN ANALYZE sobre un INSERT, UPDATE, DELETE, CREATE TABLE AS, o EXECUTE
> sentencias sin que esto afecte a nuestros datos en la base, hay que usar BEGIN y ROLLBACK."*

```sql
BEGIN;
EXPLAIN ANALYZE ...;
ROLLBACK;
```

> [!quote] La explicación de `BEGIN`, textual y en inglés en el slide
> *"BEGIN initiates a transaction block, that is, all statements after a BEGIN command will be executed
> in a single transaction until an explicit COMMIT or ROLLBACK is given. By default (without BEGIN),
> PostgreSQL executes transactions in "autocommit" mode, that is, each statement is executed in its own
> transaction and a commit is implicitly performed at the end of the statement (if execution was
> successful, otherwise a rollback is done)."*

Traducido a lo que hay que saber:

| Modo | Cuándo | Qué pasa |
| --- | --- | --- |
| **autocommit** (default, sin `BEGIN`) | cada sentencia suelta | Cada sentencia es su propia transacción; al terminar se hace `COMMIT` implícito (o `ROLLBACK` si falló). **No hay vuelta atrás.** |
| **bloque de transacción** (con `BEGIN`) | desde `BEGIN` | Todo se acumula hasta un `COMMIT` o `ROLLBACK` **explícito**. Con `ROLLBACK` el `EXPLAIN ANALYZE` se ejecutó, midió, y no dejó rastro. |

El tema de transacciones se ve completo en la **Clase 06 (ACID)** → [[1.11.03 - Transacciones y ACID|Transacciones ACID]].

### `pg_class`: páginas y tuplas

> [!quote] Textual del slide
> *"The number of pages and rows is looked up in pg_class"*

```sql
SELECT relpages, reltuples FROM pg_class WHERE relname = 'table';
```

```
 relpages | reltuples
----------+-----------
      358 |     10000
```

> [!quote] Slide 2, primer recuadro
> *"La tabla pg_class del catálogo, contiene entre otras cosas cuantas páginas y cuantas tuplas tiene
> una tabla."*

| Columna | Qué es |
| --- | --- |
| `relpages` | cuántas **páginas** (bloques de disco) ocupa la tabla |
| `reltuples` | cuántas **tuplas** (filas) tiene, **estimadas** |

Estas dos columnas son literalmente los dos insumos de la fórmula de costo del slide 9. El planner
**no cuenta las filas**: las lee del catálogo, y el catálogo se actualiza con `ANALYZE` (slide 7).

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
   ->  Seq Scan on t  (cost=0.00..1572.65 rows=112965 width=0) (actual time=0.010..5.581 rows=100000 loops=1)
 Planning time: 0.053 ms
 Execution time: 10.088 ms
(4 rows)

Time: 11.798 ms
```

Tres cosas del setup:

- `CREATE TABLE t AS SELECT * FROM generate_series(1,100000)` crea una tabla de **100.000 filas de una
  sola columna entera**, sin escribir un solo `INSERT`.
- `\timing` prende el cronómetro de `psql` → *"Timing is on."*. A partir de ahí cada sentencia imprime
  su `Time:`.
- El `Time:` de `psql` (11.798 ms) **no es** el `Execution time:` del plan (10.088 ms). *(Por qué:
  **razonamiento propio, el slide solo imprime los dos números** — el `Time:` incluye la ida y vuelta
  cliente-servidor y el planning; el `Execution time:` es lo que midió el motor adentro.)*

### Anatomía de una línea del plan

Esta es la línea que hay que saber leer de memoria:

```
Seq Scan on t  (cost=0.00..1572.65 rows=112965 width=0) (actual time=0.010..5.581 rows=100000 loops=1)
└──────┬─────┘  └───────┬────────┘ └──────┬─────┘ └──┬──┘ └──────────┬────────────┘ └─────┬──────┘ └──┬──┘
     nodo             costo             filas       bytes         tiempo real          filas reales  veces
                 inicio..total        estimadas    /fila       inicio..fin (ms)                    ejecutado
```

| Campo | Qué significa | Aparece con |
| --- | --- | --- |
| `cost=inicio..total` | **inicio** = costo acumulado hasta poder emitir la **primera** fila. **total** = costo hasta emitir la **última**. | siempre |
| `rows=` | filas que el planner **estima** que va a emitir ese nodo | siempre |
| `width=` | ancho promedio **en bytes** de cada fila que emite el nodo | siempre |
| `actual time=inicio..fin` | milisegundos reales hasta la primera y hasta la última fila | solo `ANALYZE` |
| `rows=` (en `actual`) | filas **realmente** emitidas, **por cada loop** | solo `ANALYZE` |
| `loops=` | cuántas veces se ejecutó ese nodo | solo `ANALYZE` |
| `Planning time` / `Execution time` | cuánto tardó **planificar** vs. **ejecutar** | `Planning` con ambos; `Execution` solo con `ANALYZE` |

> [!important] El costo **no** son milisegundos
> Es una **unidad arbitraria** del planner, y se ve en este mismo ejemplo: costo total 1855.07 contra
> 10.088 ms reales. No hay ninguna proporción entre los dos números — el costo sirve **para comparar
> planes entre sí**, no para predecir tiempo. La unidad está fijada por `seq_page_cost = 1`
> (slide 9): el costo se mide **en lecturas secuenciales de página**.

> [!note] La estimación erró por 13%: `rows=112965` estimadas vs `rows=100000` reales
> El deck no lo comenta, pero es el número más informativo del slide: la tabla se acaba de crear con
> `CREATE TABLE AS` y **nunca corrió `ANALYZE`**, así que `pg_class` todavía no tiene estadísticas
> buenas y el planner estima por tamaño de archivo. **Razonamiento propio, no está en el deck.**
> Confirmar en clase — y ver que el slide 7 introduce justamente `ANALYZE` para arreglar esto.

> [!tip] La fórmula del slide 9 cierra exacto acá — **razonamiento propio**
> `(páginas × seq_page_cost) + (tuplas × cpu_tuple_cost)` con `seq_page_cost=1` y `cpu_tuple_cost=0.01`:
> `1572.65 = páginas + 112965 × 0.01` → **páginas = 443**. Da entero, o sea que la fórmula del deck es
> literalmente la que usó el planner. Lo mismo verificado con otra tabla más abajo (`ar_amba_points`).

---

## Slides 3–4 · `audiocut`: el mismo `min()` con índice y sin índice

Es **el ejemplo central del deck sobre índices**. Dos consultas idénticas salvo por la columna.

Estructura de la tabla, con `\d`:

```
radiocut=> \d audiocut;
              Table "public.audiocut"
   Column    |           Type           | Modifiers
-------------+--------------------------+-----------
 id          | numeric                  | not null
 slug        | text                     |
 radio_id    | text                     |
 radio_name  | text                     |
 show_id     | text                     |
 show_name   | text                     |
 start       | timestamp with time zone |
 length      | numeric                  |
 username    | text                     |
 description | text                     |
 title       | text                     |
 created     | timestamp with time zone |
 play        | numeric                  |
Indexes:
    "audiocut_pk" PRIMARY KEY, btree (id)
    "idx_audiocut_id" UNIQUE, btree (id)
```

> [!note] Hay **dos índices sobre la misma columna** `id`
> `audiocut_pk` (PK, btree) e `idx_audiocut_id` (UNIQUE, btree) indexan exactamente `id`. El deck no lo
> comenta. **Razonamiento propio:** es un índice redundante — ocupa disco y encarece cada `INSERT`
> sin agregar caminos de acceso. Buen ejemplo de "más índices no es mejor". **Verificar en clase** si
> es intencional o un descuido de la base de ejemplo.

**Caso A — `min(id)`, columna indexada:**

```
radiocut=> explain select min(id) from audiocut;
                                              QUERY PLAN
-------------------------------------------------------------------------------------------------------
 Result  (cost=0.47..0.48 rows=1 width=0)
   InitPlan 1 (returns $0)
     ->  Limit  (cost=0.42..0.47 rows=1 width=6)
           ->  Index Only Scan using audiocut_pk on audiocut  (cost=0.42..8775.32 rows=185994 width=6)
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
   ->  Seq Scan on audiocut  (cost=0.00..21927.94 rows=185994 width=5)
(2 rows)

Time: 2.364 ms
```

| | `min(id)` | `min(play)` |
| --- | --- | --- |
| ¿Hay índice sobre la columna? | **sí** (`audiocut_pk`) | **no** |
| Plan | `Result` + `InitPlan` + `Limit` + `Index Only Scan` | `Aggregate` + `Seq Scan` |
| **Costo total** | **0.48** | **22392.93** |
| Filas que toca | **1** (se corta con `Limit`) | **185994** (todas) |

> [!important] Por qué la diferencia es de ~**46.650×** — *el factor lo calculo yo, el deck no lo dice*
> `22392.93 / 0.48 ≈ 46.652`. **Razonamiento propio de acá en adelante:**
> Un índice **btree está ordenado**. Para el mínimo de una columna indexada, PostgreSQL reescribe la
> consulta como *"andá al primer elemento no nulo del índice y frená"* — de ahí el `Limit` y el
> `Index Cond: (id IS NOT NULL)`. Sin índice no hay orden: hay que leer **las 185.994 filas** con un
> `Seq Scan` y quedarse con la más chica.
>
> Ojo con el `cost=0.42..8775.32` del `Index Only Scan`: el **total** (8775.32) es lo que costaría
> recorrer el índice **entero**; como arriba hay un `Limit`, solo se paga hasta la primera fila, o sea
> casi el **inicio** (0.42). **Es el caso donde el costo de inicio manda y el total es una fantasía.**

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

Su resultado, los 10 usuarios que más reproducciones acumulan (la tabla del deck está **cortada entre
dos slides**: las cinco primeras filas en el 4, las cinco últimas en el 5):

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

Y su plan (así, con comillas por línea: es un copy-paste desde **pgAdmin**, que devuelve el plan como
filas de texto):

```
QUERY PLAN

"Limit  (cost=23551.53..23551.56 rows=10 width=17)"
"  ->  Sort  (cost=23551.53..23568.29 rows=6703 width=17)"
"        Sort Key: (sum(play)) DESC"
"        ->  HashAggregate  (cost=23322.90..23406.68 rows=6703 width=17)"
"              Group Key: username"
"              ->  Seq Scan on audiocut  (cost=0.00..21927.94 rows=185994 width=17)"
```

El slide 5 muestra además un **screenshot de la barra de herramientas de pgAdmin** con el botón cuyo
tooltip dice **"Explain query"** — el equivalente gráfico de escribir `EXPLAIN`.

El slide 6 dibuja el mismo plan como un **pipeline de izquierda a derecha**, con un tooltip flotante
sobre el último nodo:

```
 audiocut  ──▶  HashAggregate  ──▶  Sort  ──▶  Limit
   tabla         Σ agrupa por      ordena por    corta
                  username        sum(play) DESC  en 10

                                    ┌──────────────────────────────────────┐
                                    │ Limit                                │
                                    │ (cost=23551.53..23551.56 rows=10     │
                                    │  width=17)                           │
                                    └──────────────────────────────────────┘
```

> [!important] Este es **el slide que enseña a leer un plan**
> El texto del `EXPLAIN` está anidado con `->` y sangría, y se lee **del más profundo al menos
> profundo** = de abajo hacia arriba. El dibujo del slide 6 es esa misma lista **dada vuelta**: el nodo
> más sangrado (`Seq Scan on audiocut`) es el **primero** que se ejecuta, y el menos sangrado (`Limit`)
> es el **último**. La flecha `->` apunta al hijo, y el hijo alimenta al padre.

Cómo se leen los costos de este plan, nodo por nodo:

| Nodo | Costo | Qué dice el par `inicio..total` |
| --- | --- | --- |
| `Seq Scan on audiocut` | `0.00..21927.94` | **inicio 0**: un scan secuencial emite la primera fila enseguida |
| `HashAggregate` | `23322.90..23406.68` | **inicio ≈ total**: tiene que consumir *todo* el scan para armar la tabla de hash antes de emitir nada |
| `Sort` | `23551.53..23568.29` | idem: no se puede emitir la primera fila ordenada sin haber visto todas |
| `Limit` | `23551.53..23551.56` | **hereda el inicio del `Sort`** y suma casi nada, porque solo pide 10 filas |

> [!tip] Regla que se desprende de esta tabla
> **Un nodo bloqueante** (`Sort`, `HashAggregate`) tiene `inicio ≈ total`. **Un nodo en streaming**
> (`Seq Scan`, `Index Scan`, `Limit`) tiene `inicio ≪ total`. Por eso `LIMIT` **no** ayuda cuando abajo
> hay un `Sort`: el ordenamiento ya pagó todo.

También hay que mirar `rows=6703` en el `HashAggregate`: son los **usuarios distintos** estimados,
contra las `185994` filas de la tabla. Y `width=17`: cada fila de salida pesa ~17 bytes
(`username` + `count` + `sum`), contra `width=0` de los `count(*)` de antes — cuando no hay que
devolver columnas, el ancho es 0.

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

> [!important] *"pero si lo volvemos a correr, puede dar otros valores"*
> Es el argumento por el cual **no alcanza con cronometrar**: el tiempo de pared depende de la caché,
> de la carga de la máquina y del disco. El **costo del plan es estable**; el reloj no. Por eso se
> estudia el plan y no solo el `Time:`.

**Variante 1 — `EXPLAIN` (solo estima):**

```
EXPLAIN select count(*) from ar_amba_points
"Aggregate  (cost=11099.16..11099.17 rows=1 width=0)"
"  ->  Seq Scan on ar_amba_points  (cost=0.00..9767.33 rows=532733 width=0)"
```

**Variante 2 — `EXPLAIN ANALYZE` (estima + ejecuta + mide):**

```
EXPLAIN ANALYZE select count(*) from ar_amba_points
"Aggregate  (cost=11099.16..11099.17 rows=1 width=0) (actual time=103.080..103.080 rows=1 loops=1)"
"  ->  Seq Scan on ar_amba_points  (cost=0.00..9767.33 rows=532733 width=0) (actual time=0.014..58.494
rows=532733 loops=1)"
"Total runtime: 103.128 ms"
```

**Variante 3 — `EXPLAIN VERBOSE` (agrega `Output`: qué columnas emite cada nodo):**

```
EXPLAIN VERBOSE select count(*) from ar_amba_points
"Aggregate  (cost=11099.16..11099.17 rows=1 width=0)"
"  Output: count(*)"
"  ->  Seq Scan on public.ar_amba_points  (cost=0.00..9767.33 rows=532733 width=0)"
"        Output: id, geom"
```

**Variante 4 — `EXPLAIN ANALYZE VERBOSE` (todo junto):**

```
EXPLAIN ANALYZE VERBOSE select count(*) from ar_amba_points
"Aggregate  (cost=11099.16..11099.17 rows=1 width=0) (actual time=99.387..99.387 rows=1 loops=1)"
"  Output: count(*)"
"  ->  Seq Scan on public.ar_amba_points  (cost=0.00..9767.33 rows=532733 width=0) (actual time=0.012..56.671
rows=532733 loops=1)"
"        Output: id, geom"
"Total runtime: 99.427 ms"
```

| Variante | Ejecuta | Da tiempos reales | Da columnas de salida | Califica el nombre de esquema |
| --- | :---: | :---: | :---: | :---: |
| `EXPLAIN` | no | no | no | no (`ar_amba_points`) |
| `EXPLAIN ANALYZE` | **sí** | **sí** | no | no |
| `EXPLAIN VERBOSE` | no | no | **sí** (`Output:`) | **sí** (`public.ar_amba_points`) |
| `EXPLAIN ANALYZE VERBOSE` | **sí** | **sí** | **sí** | **sí** |

> [!note] Dos corridas de lo mismo dan 103.128 ms y 99.427 ms
> Las variantes 2 y 4 son la misma consulta y difieren un 4%. Refuerza lo del `\timing`: **la
> estimación no cambió ni un decimal** (`11099.16..11099.17` en las cuatro), el reloj sí.

> [!tip] `Total runtime:` vs. `Execution time:`
> El slide 2 imprime `Planning time:` + `Execution time:`, y este imprime `Total runtime:`. Son
> **versiones distintas de PostgreSQL**: `Total runtime` es la etiqueta vieja, `Planning/Execution
> time` la nueva. **Razonamiento propio, no está en el deck** — el material está armado con capturas
> de varios años. Verificar contra la versión que se use en clase.

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
> | | Qué es | Qué hace |
> | --- | --- | --- |
> | `EXPLAIN ANALYZE consulta` | modificador de `EXPLAIN` | **ejecuta** la consulta y reporta los tiempos reales |
> | `ANALYZE tabla` | **comando propio** | **recolecta estadísticas** de la tabla y las guarda en el catálogo |
>
> El segundo es el que hace que el primero mienta menos: sin `ANALYZE`, las `rows=` estimadas están
> desactualizadas (como en el slide 2, `112965` vs `100000`).

Qué informa el `VERBOSE` del `ANALYZE`, campo por campo:

| Campo de la salida | Significado |
| --- | --- |
| `scanned 4440 of 4440 pages` | leyó **todas** las páginas de la tabla (tabla chica; en tablas grandes muestrea) |
| `532733 live rows` | filas vivas |
| `0 dead rows` | filas borradas todavía no recuperadas por `VACUUM` |
| `30000 rows in sample` | tamaño de la **muestra estadística** |
| `532733 estimated total rows` | la estimación final que va a `pg_class.reltuples` |

Se puede pedir por columna: `ANALYZE VERBOSE ar_amba_points(geom)` recalcula solo esa columna. En este
caso las tres corridas dan el mismo resumen porque la tabla no cambió; lo que cambia es el tiempo
(81 → 71 → 41 ms). Las dos últimas corridas están en el **slide 8**.

> [!note] De dónde sale el `30000` de la muestra — **razonamiento propio, no está en el deck**
> Es `default_statistics_target × 300`, con el default `100`. El slide solo imprime el número.
> **Verificar en clase** si hace falta saberlo.

> [!tip] Acá se puede **verificar la fórmula del costo con datos del propio deck** — razonamiento propio
> `ANALYZE` dice **4440 páginas** y **532733 filas**. La fórmula del slide 9:
> `4440 × 1 + 532733 × 0.01 = 4440 + 5327.33 = ` **`9767.33`** — que es **exactamente** el costo total
> del `Seq Scan on ar_amba_points`. La fórmula del deck no es aproximada: es la que corre el planner.

---

## Slides 8–9 · Cómo el planner elige, y cuánto cuesta cada cosa

El deck cita dos páginas de la documentación:

- **How the Planner Uses Statistics** → `https://www.postgresql.org/docs/current/static/planner-stats-details.html`
- **Query Planning** → `https://www.postgresql.org/docs/current/static/runtime-config-query.html`

### Los `enable_*`: prender y apagar estrategias

> [!quote] Textual del slide 8
> *"Los siguientes parámetros, por default están prendidos."*

Los tres primeros están en el **slide 8**; los otros nueve, en el **slide 9**.

> [!warning] El deck **solo lista los nombres**
> La columna "Estrategia que habilita" de la tabla siguiente **no está en el slide**: son
> **agregados propios** para poder leer los nombres de nodo que aparecen en los planes del deck.
> **Verificar en clase** cuáles hay que saber.

| Parámetro | Estrategia que habilita |
| --- | --- |
| `enable_bitmapscan` | **Bitmap Heap/Index Scan** — junta muchos punteros del índice y después va al heap ordenado |
| `enable_gathermerge` | **Gather Merge** — junta resultados ya ordenados de workers paralelos |
| `enable_hashagg` | **HashAggregate** — `GROUP BY` por tabla de hash (el del slide 5) |
| `enable_hashjoin` | **Hash Join** — join construyendo una tabla de hash con el lado chico |
| `enable_indexscan` | **Index Scan** — recorre el índice y va al heap por cada fila |
| `enable_indexonlyscan` | **Index Only Scan** — se responde **solo con el índice**, sin tocar el heap |
| `enable_material` | **Materialize** — materializa un resultado intermedio para reusarlo |
| `enable_mergejoin` | **Merge Join** — join de dos entradas ordenadas |
| `enable_nestloop` | **Nested Loop** — por cada fila del lado externo, busca en el interno |
| `enable_seqscan` | **Seq Scan** — barrido secuencial de toda la tabla |
| `enable_sort` | **Sort** — ordenamiento explícito |
| `enable_tidscan` | **Tid Scan** — acceso directo por `ctid` (dirección física de la fila) |

> [!success] ✅ Verificado: **las estrategias de join sí hacen falta** — lo cierra el TP5
> `Nested Loop`, `Hash Join` y `Merge Join` figuran en el deck **solo como nombres** de esta lista
> `enable_*`, y **ninguna consulta del deck tiene un `JOIN`** — por eso estaban rotuladas como
> ampliación. El **TP5** le dedica **un ejercicio entero al `INNER JOIN`** entre `materia` e
> `inscripto`, con **tres variantes de indexación** (sin índices → PK en `materia` → PK también en
> `inscripto`), y es el **único** ejercicio donde el enunciado pide ver el árbol en Workbench —
> señal de que el plan es más complejo que los anteriores. Detalle en [[Práctica 2026-08-18]]
> § *Bloque D*.
>
> Lo que **sigue faltando es la teoría** de las estrategias: cómo funciona cada una y cómo se llaman
> en MySQL. No está en el deck ni en ninguna página del vault.

> [!quote] Textual del slide
> *"Si queremos forzar a que no tome una estrategia, lo podemos apagar (temporalmente y sólo para
> nuestra sesión) de la siguiente manera:"*

```sql
set enable_seqscan = off;
```

> [!tip] Para qué sirve apagarlos en la práctica
> **Razonamiento propio, no está en el deck:** no es para "optimizar", es para **diagnosticar**. Si
> apagás `enable_seqscan` y el plan alternativo con índice resulta más barato *y* más rápido, sabés
> que el planner se está equivocando por estadísticas viejas. Es un experimento, no una configuración
> de producción. Notar que `off` **no prohíbe** la estrategia: le pone un costo altísimo. Si no hay
> otro camino, la usa igual.

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

| Constante | Valor | Qué mide |
| --- | --- | --- |
| `seq_page_cost` | **1** | leer **una página** secuencialmente. **Es la unidad**: todo el resto se mide contra esto |
| `cpu_tuple_cost` | **0.01** | procesar **una fila** en CPU. O sea: procesar 100 filas cuesta lo mismo que leer 1 página |

> [!note] Verificación de la fórmula con los tres `Seq Scan` del deck — razonamiento propio
> | Tabla | Costo total del `Seq Scan` | `rows` | Páginas despejadas | ¿Verificado? |
> | --- | ---: | ---: | ---: | --- |
> | `t` | 1572.65 | 112965 | **443** | entero ✔ |
> | `ar_amba_points` | 9767.33 | 532733 | **4440** | ✔ **coincide con el `ANALYZE VERBOSE`** |
> | `audiocut` | 21927.94 | 185994 | **20068** | entero ✔ |
>
> La fórmula es exacta para un `Seq Scan` sin filtros. Los nodos de arriba (`Aggregate`) suman un
> costo adicional por fila que el deck **no** menciona (`cpu_operator_cost`, 0.0025 por defecto):
> `11099.16 − 9767.33 = 1331.83 = 532733 × 0.0025`. **Verificar en clase** si entra en el parcial.

---

## Slide 10 · GEQO y `BUFFERS`

### GEQO

El slide abre con un recuadro que tiene **solo un título y un link**:

- **Genetic Query Optimization (GEQO) in PostgreSQL** →
  `https://www.postgresql.org/docs/current/static/geqo-pg-intro.html`

El deck **no lo explica**. *(Contexto no dicho en el slide: cuando una consulta junta muchas tablas,
evaluar todos los órdenes de join posibles es intratable, y PostgreSQL pasa a una búsqueda genética
aproximada. **Razonamiento propio — verificar en clase** cuánto se espera saber de esto.)*

### `BUFFERS`: qué se leyó de caché y qué de disco

El recuadro de abajo se titula **`BUFFERS hit & read`**.

El deck pega la definición **textual de la documentación**, en inglés. Lo que hay que retener:

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

Dos reglas del final de la definición, que son las que se olvidan:

- *"The number of blocks shown for an upper-level node includes those used by all its child nodes."* →
  los buffers de un nodo padre **incluyen** los de sus hijos.
- *"In text format, only non-zero values are printed. This parameter may only be used when ANALYZE is
  also enabled. It defaults to FALSE."* → **`BUFFERS` requiere `ANALYZE`**, y los ceros no se imprimen.

Ejemplo del slide:

```
EXPLAIN (ANALYZE,BUFFERS) select min(play) from audiocut;
"Aggregate  (cost=6131.31..6131.32 rows=1 width=5) (actual time=74.741..74.742 rows=1 loops=1)"
"  Buffers: shared hit=716"
"  ->  Index Only Scan using idx_audiocut_id_play on audiocut  (cost=0.42..5666.33 rows=185994 width=5) (actual
time=0.058..39.626 rows=185994 loops=1)"
"        Heap Fetches: 0"
"        Buffers: shared hit=716"
"Planning time: 0.521 ms"
"Execution time: 74.815 ms"
```

> [!important] Este slide es, calladamente, **el mejor ejemplo de índices de todo el deck**
> Es **la misma consulta del slide 4** — `select min(play) from audiocut` — pero apareció un índice
> nuevo, `idx_audiocut_id_play`, que **no estaba** en el `\d audiocut` del slide 3.
>
> | | Slide 4 (sin el índice) | Slide 10 (con `idx_audiocut_id_play`) |
> | --- | --- | --- |
> | Nodo de acceso | `Seq Scan on audiocut` | `Index Only Scan using idx_audiocut_id_play` |
> | Costo total | **22392.93** | **6131.32** |
> | Reducción | — | **−72.6%** |
>
> El nombre del índice dice que es **compuesto sobre `(id, play)`**. Como `play` está *adentro* del
> índice, PostgreSQL puede responder **sin tocar la tabla**: eso es un **Index Only Scan**, y lo
> confirma `Heap Fetches: 0` (cero visitas al heap). Y `shared hit=716` con `read` ausente significa
> que **las 716 páginas del índice estaban todas en caché, cero lecturas a disco**.
>
> **Razonamiento propio, no está en el deck:** el índice no se creó explícitamente en ningún slide.
> **Verificar en clase** cuál fue el `CREATE INDEX` exacto.

> [!missing] El deck **no** compara los tiempos de las dos versiones
> Del `min(play)` **sin** índice (slide 4) solo hay un `EXPLAIN` a secas, así que **no existe un
> `Execution time` para comparar**: el `Time: 2.364 ms` de ese slide es lo que tardó *planificar*, no
> ejecutar. Los únicos tiempos reales de la consulta son los de **este** plan
> (`Execution time: 74.815 ms`, con el `Index Only Scan` aportando 39.626 ms de los 74.741 del
> `Aggregate`). Conclusión que **sí** se sostiene: la mejora de **costo** está medida
> (22392.93 → 6131.32), la mejora de **tiempo** no está medida en ningún slide. **Razonamiento propio,
> no está en el deck.**

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

> [!note] Notación de números
> El deck usa el **punto como separador de miles** en todo este tramo: `66.483 ms` son 66.483
> milisegundos = **66 segundos**, y `29.971.992` son casi 30 millones. En las salidas de consola
> pegadas de `psql`, en cambio, el punto es **decimal** (`Time: 62728.394 ms`). No confundirlos.

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
   ->  Gather  (cost=933897.35..933897.56 rows=2 width=8)
         Workers Planned: 2
         ->  Partial Aggregate  (cost=932897.35..932897.36 rows=1 width=8)
               ->  Parallel Seq Scan on "CovidCases"  (cost=0.00..901691.48 rows=12482348 width=0)
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
   ->  Gather  (cost=933897.35..933897.56 rows=2 width=8) (actual time=75228.525..75236.985 rows=3 loops=1)
         Workers Planned: 2
         Workers Launched: 2
         ->  Partial Aggregate  (cost=932897.35..932897.36 rows=1 width=8) (actual
time=75190.589..75190.589 rows=1 loops=3)
               ->  Parallel Seq Scan on "CovidCases"  (cost=0.00..901691.48 rows=12482348 width=0) (actual
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

Nodos nuevos que aparecen acá:

| Nodo / campo | Qué significa |
| --- | --- |
| `Parallel Seq Scan` | scan secuencial repartido entre varios procesos: cada uno lee una porción |
| `Partial Aggregate` | cada proceso cuenta **su** porción |
| `Gather` | el proceso líder **junta** los resultados parciales de los workers |
| `Finalize Aggregate` | suma los parciales y produce el resultado único |
| `Workers Planned: 2` / `Workers Launched: 2` | cuántos procesos auxiliares **planeó** y cuántos **arrancaron** |
| `JIT:` | PostgreSQL **compiló** expresiones a código máquina; `Timing:` dice cuánto tardó en compilar |

> [!important] Cómo se lee `loops=3` — **es la trampa de lectura más común**
> El `Parallel Seq Scan` dice `rows=9990664 loops=3`. **Las filas de `actual` son POR LOOP.** El total
> real es `9990664 × 3 = 29.971.992` = exactamente el `count`. Los 3 loops son **2 workers + el
> proceso líder**, que también colabora. Y por eso el `Gather` reporta `rows=3`: recibió **3 filas
> parciales**, una por cada `Partial Aggregate`.
>
> Lo mismo vale para el tiempo: `actual time=...74537.711` es el tiempo **de un loop**, no la suma.

> [!note] El `EXPLAIN ANALYZE` tardó **más** que la consulta sola
> `62728 ms` la consulta pelada contra `75908 ms` con `EXPLAIN ANALYZE`. La instrumentación (y en este
> caso los **247 ms de compilación JIT**) cuesta. **Razonamiento propio, no está en el deck:** por eso
> `EXPLAIN ANALYZE` sobrestima consultas con muchísimos nodos y muchísimas filas.

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

> [!tip] Truco de diagnóstico que el slide menciona al pasar
> Activar el **log de consultas lentas** (las que duran más de 1 segundo) para descubrir qué SQL manda
> realmente la aplicación. Con un ORM en el medio, el SQL que se ejecuta **no es** el que escribiste.

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

> [!note] Siete índices compuestos, muy solapados entre sí
> El deck los lista sin comentarlos. **Razonamiento propio:** el 7 es el 1 con `id_evento_caso`
> agregado al final, el 4 es el 2 con lo mismo. Cada `INSERT` en una tabla de 30 M paga los siete.
> Es el precio de que **el índice acelera la lectura y encarece la escritura**.

### Las cuatro mediciones, en orden

**(a) La consulta que manda el ORM, con todo** — slides 14–15. El slide repite el mismo SQL de arriba
precedido de `EXPLAIN`, y la salida arranca con su propio encabezado:

```
QUERY_PLAN
==========
 Finalize Aggregate  (cost=654531.00..654531.01 rows=1 width=8)
   ->  Gather  (cost=654530.79..654531.00 rows=2 width=8)
         Workers Planned: 2
         ->  Partial Aggregate  (cost=653530.79..653530.80 rows=1 width=8)
               ->  Parallel Index Only Scan using "CountIndex" on "CovidCases"   (cost=0.56..623631.96
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
> | | Qué es | Consecuencia |
> | --- | --- | --- |
> | **`Index Cond`** | condición que el motor puede **resolver dentro del índice** | **acota qué se lee**: no se tocan las filas que no cumplen |
> | **`Filter`** | condición que se aplica **después**, sobre cada fila ya leída | **no acota nada**: se leen todas y se descartan las que no cumplen |
>
> Acá el filtro de fechas cayó en `Index Cond` (bien) y los cuatro `LIKE '%'` cayeron en `Filter`
> (puro overhead). Cuando `Filter` aparece con muchas filas descartadas, **falta un índice**.
>
> Detalle a mirar en la salida: `~~` es el operador interno de `LIKE` en PostgreSQL, y `::text` son los
> casts que agrega el motor.

**(b) Solo el filtro de fechas** — slide 15. Lo introduce con *"Si solo miramos el control adicional
de las fechas."*:

```sql
EXPLAIN SELECT count(*) AS "count" FROM "CovidCases" AS "CovidCases" WHERE "CovidCases"."fecha_apertura" >= '2000-01-01'
AND "CovidCases"."fecha_apertura" <= '2100-01-01';
```

```
 Finalize Aggregate  (cost=534935.68..534935.69 rows=1 width=8)
   ->  Gather  (cost=534935.47..534935.68 rows=2 width=8)
         Workers Planned: 2
         ->  Partial Aggregate  (cost=533935.47..533935.48 rows=1 width=8)
               ->  Parallel Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..504036.64 rows=11959532
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
   ->  Gather  (cost=511016.41..511016.62 rows=2 width=8)
         Workers Planned: 2
         ->  Partial Aggregate  (cost=510016.41..510016.42 rows=1 width=8)
               ->  Parallel Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..480117.58 rows=11959532
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
> `511017 / 933897 = 0.547` → el costo **disminuyó** un 45.3%, no se incrementó. La palabra
> *"incrementó"* está mal; el porcentaje está bien. Los dos casos anteriores dicen *"disminuyó"* con
> la misma cuenta. **Verificar en clase**, porque cambia la moraleja del slide.

Resumen de los cuatro planes:

| Consulta | Acceso | Costo total | vs. 933897 |
| --- | --- | ---: | ---: |
| `count(*)` sin `WHERE` | `Parallel Seq Scan` | **933897** | — |
| ORM completa (fechas + 4 `LIKE '%'`) | `Parallel Index Only Scan` (`Index Cond` + `Filter`) | **654531** | −30% |
| solo fechas | `Parallel Index Only Scan` (`Index Cond`) | **534935** | −43% |
| solo `LIKE '%'` | `Parallel Index Only Scan` (`Filter`) | **511017** | −45.3% |

> [!important] La conclusión contraintuitiva del tramo
> **Agregar un `WHERE` inútil salió más barato que no poner nada.** El `WHERE` es lo que le permitió al
> planner usar `CountIndex` en vez del `Parallel Seq Scan` de la tabla entera: el índice es más chico
> que la tabla, así que recorrerlo cuesta menos. Pero la comparación que importa es **entre las tres
> variantes con índice**: la ORM completa (654531) es la **más cara** de las tres justamente porque
> paga el `Index Cond` *y* el `Filter`.
>
> Textual del slide: *"Por lo tanto, hay que tener cuidado con el LIKE % o con otros controles
> adicionales (el de las fechas), que nunca fue solicitado."*

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
   ->  Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..1086.56 rows=46300 width=0)
         Index Cond: ((fallecido = 'SI'::text) AND (clasificacion_resumen = 'Confirmado'::text))
(3 rows)

covid-api=# explain analyze select count(*) from "CovidCases" where fallecido = 'SI' and clasificacion_resumen =
'Confirmado';
                                            QUERY PLAN
---------------------------------------------------------------------------------------------------
 Aggregate  (cost=1202.31..1202.32 rows=1 width=8) (actual time=26.789..26.789 rows=1 loops=1)
   ->  Index Only Scan using "CountIndex" on "CovidCases"  (cost=0.56..1086.56 rows=46300 width=0) (actual
time=0.051..17.203 rows=127759 loops=1)
         Index Cond: ((fallecido = 'SI'::text) AND (clasificacion_resumen = 'Confirmado'::text))
         Heap Fetches: 0
 Planning Time: 0.085 ms
 Execution Time: 26.806 ms
(6 rows)
```

Lo que hay que ver:

- **Costo 1202 contra 933897**: un factor de **777×**. Y ya no hay paralelismo — con tan pocas filas
  no vale la pena repartir el trabajo.
- **`fallecido` y `clasificacion_resumen` son las dos primeras columnas de `CountIndex`.** Por eso las
  dos condiciones entran como `Index Cond`. Esta es la regla del **prefijo izquierdo** de un índice
  compuesto, y se demuestra a fondo en el laboratorio de `graduados`.
- **`Heap Fetches: 0`**: no tocó la tabla ni una vez, todo salió del índice.
- **`Execution Time: 26.806 ms`** contra los **62 segundos** del `count(*)` completo.

> [!bug] El número `391421` no aparece en ningún plan del deck
> El slide 17 dice que contar todos los registros cuesta **391421**, pero el `EXPLAIN` del slide 12
> mostró **933897**, y ninguna de las cuatro variantes da 391421. Puede ser un valor de otra corrida
> (con menos filas: el texto habla del 25/03/2022 con 28.688.491 registros, mientras que el resto del
> tramo es del 9/08/2022 con 29.971.992). **Verificar en clase** cuál es el número correcto — el
> contraste conceptual se sostiene igual.

> [!warning] La estimación vuelve a errar, y feo: `rows=46300` estimadas vs. `rows=127759` reales
> Casi **3× de subestimación**. El deck no lo comenta. **Razonamiento propio:** con dos predicados el
> planner multiplica selectividades asumiendo **independencia** entre `fallecido` y
> `clasificacion_resumen`, y acá están correlacionadas (casi todo fallecido es "Confirmado"). Es la
> causa típica de subestimación en `AND` de columnas correlacionadas, y la razón por la cual el plan
> elegido a veces es malo. **Verificar en clase.**

---

## Slides 17–21 · Laboratorio de índices: la tabla `graduados`

El tramo final es el que **el cronograma anuncia como "Índices"**. Tabla chica y controlada: **8532
graduados**, columnas `titulo`, `apellido`, `nombre`. El `select count(*) from graduados` aparece dos
veces: al pie del **slide 17** y otra vez arriba del **18**.

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

Y dos datos de **cardinalidad** que el deck pone recién al final (slide 21) pero que explican todo:

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

> [!note] El deck escribe `explain analyse` (con **s**) en todo el tramo de `graduados`
> Está transcrito tal cual. **Razonamiento propio, no está en el deck:** PostgreSQL acepta las dos
> grafías, `ANALYZE` y `ANALYSE`, así que no es un error. **Verificar** si MySQL también.

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
> `apellido = 'Lugones'` (1 emitida + 1 descartada); el `Filter` sobre `nombre` descartó **1**.
> Este contador es el que dice **cuánto trabajo desperdiciado** hay: si es grande, al índice le falta
> una columna (o falta otro índice).

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
> Con el índice compuesto desaparecen el `Filter` y el `Rows Removed by Filter`: el índice ya
> discrimina por las dos columnas. El **costo estimado no cambió** (`0.29..8.30` en los dos), pero el
> tiempo real bajó de 0.177 a 0.108 ms. **Este es el argumento a favor de los índices compuestos.**

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
> para filtrar solo por `nombre`. Un btree compuesto está ordenado **primero** por `apellido`; si no
> das `apellido`, el índice no acota nada, igual que buscar en la guía telefónica por nombre de pila.
>
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
> Aunque la columna esté indexada, `LIKE '%'` no es una condición de rango: no acota nada, así que va a
> `Filter` y el plan sigue siendo `Seq Scan`. Es la versión de laboratorio del problema del ORM de
> `CovidCases`.

> [!tip] Cuánto cuesta **exactamente** el `LIKE '%'` inútil — razonamiento propio
> Comparando los dos `Seq Scan`: con un solo predicado, **187.65**; agregando `apellido LIKE '%'`,
> **208.98**. La diferencia es **21.33 = 8532 × 0.0025**, o sea **un `cpu_operator_cost` extra por cada
> fila de la tabla**. El overhead de una condición inútil es exactamente eso: evaluarla 8532 veces.
> El deck da la fórmula "simple" (solo `seq_page_cost` y `cpu_tuple_cost`) y no menciona
> `cpu_operator_cost`. **Verificar en clase.**

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
> Mismo nodo, mismo índice, mismo costo, mismo `Index Cond`, mismo `Filter`. SQL es **declarativo**: el
> planner reordena por su cuenta. Lo que sí importa es el **orden de las columnas dentro del índice**
> (experimento 4). **Esta pareja de slides es exactamente la que separa las dos cosas.**

> [!question] ¿Por qué eligió `graduados_n_idx` y no `graduados_a_idx`?
> `apellido` es **más selectivo** (6332 distintos contra 4318), así que la intuición dice que debería
> haber usado el índice de `apellido`. Los dos índices dan **el mismo costo estimado**
> (`cost=0.29..8.30 rows=1`), así que para el planner es un **empate** y desempata por criterios
> internos. **Razonamiento propio, no está en el deck. Verificar en clase** — es una buena pregunta de
> parcial.

### El ejercicio que el deck deja sin resolver

```sql
select nombre, apellido, length(nombre) from graduados order by 3 limit 10

explain analyse
    select *
    from graduados
    where nombre = 'Luz' and apellido = 'Wetzler Malbrán'
```

> [!question] Slide 21: el último `explain analyse` **no tiene salida en el deck**
> Queda como ejercicio. **Razonamiento propio:** el `order by 3` ordena por la **tercera columna de la
> proyección**, `length(nombre)`, o sea busca los nombres **más cortos** — de ahí sale `'Luz'`. La
> apuesta es que el plan sea otra vez `Index Scan using graduados_n_idx` con `Index Cond: (nombre =
> 'Luz')` y `Filter: (apellido = ...)`, y que `Rows Removed by Filter` sea **mayor** que en el caso de
> `Facundo Lorenzo`, porque `'Luz'` es un nombre mucho más frecuente.
>
> ➖ **El TP5 no lo reproduce.** Esto es PostgreSQL sobre `graduados`, y el TP5 corre sobre **MySQL**
> con otras tablas (`materia`, `inscripto`). El experimento **equivalente** ahí es el bloque
> `SELECT nombre FROM materia WHERE codigo = 60 AND nombre = 'Base de Datos II';` con sus tres
> variantes de indexación —sin constraints · PK compuesta · dos `UNIQUE` separados—, que es el
> § *Bloque B* de [[Práctica 2026-08-18]]. **Este `explain analyse` queda sin correr.**

---

## Slide 22 · El único link de cierre

El deck termina con un slide que tiene **dos líneas y nada más**:

> [!quote] Textual del slide 22
> Performance Tips > Using EXPLAIN
> `https://www.postgresql.org/docs/current/using-explain.html`

---

## Nodos del plan que aparecen en el deck

Todos los que hay que reconocer, con el slide donde aparecen:

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

Y las **anotaciones** que pueden colgar de un nodo:

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

Es el tema que el [[_cronograma]] pone en la teórica del 10/08, y aunque el deck no lo declara
como sección, está entero. Resumido en una tabla de decisión:

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

Las cinco reglas que se desprenden:

1. **El índice sirve si el motor puede meter la condición en `Index Cond`.** Si termina en `Filter`, se
   leyó todo igual.
2. **En un índice compuesto, el orden de las columnas manda** — hay que dar el prefijo izquierdo.
   `(apellido, nombre)` sirve para `apellido`, y para `apellido AND nombre`; **no** sirve para `nombre`.
3. **El orden de las condiciones en el `WHERE` no importa.** El planner reordena.
4. **Un índice que cubre todas las columnas pedidas evita la tabla** → `Index Only Scan`,
   `Heap Fetches: 0`. Es el caso más rápido.
5. **Más índices no es mejor**: `audiocut` tiene dos índices idénticos sobre `id`, `"CovidCases"`
   tiene siete muy solapados. Cada uno se paga en cada escritura.

---

## PostgreSQL vs. MySQL — traducción del deck

La cursada corre sobre **MySQL** y el deck es PostgreSQL. Traducción de cada cosa, **con el nivel de
certeza declarado**:

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
| — | ⚠️ **pero en MySQL el DDL hace `COMMIT` implícito**: un `CREATE TABLE AS` **no** se puede envolver en `BEGIN…ROLLBACK` como propone el slide 1 | **seguro** — y es una diferencia que cambia el consejo del deck |
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
| `psql` / `pgAdmin` | cliente `mysql` / **MySQL Workbench**, que tiene *Visual Explain* (equivalente al dibujo del slide 6). El TP5 pide además el **"Form Editor"** del grid de resultados: *"Elegir la opción "Form Editor" en MySQL Workbench para ver el árbol"* → [[Práctica 2026-08-18]] | *Visual Explain*: **seguro**. Que el *Form Editor* **no lo reemplaza sino que lo complementa** —*Visual Explain* dibuja el plan; el *Form Editor* muestra formateado el valor multilínea de una celda, que es donde cae la salida `TREE`—: **razonamiento propio, verificar** |
| `Parallel Seq Scan`, `Gather`, `Workers` | InnoDB tiene lectura paralela limitada (`innodb_parallel_read_threads`), no un `Gather` general | **verificar** |
| `JIT:` | **no existe** en MySQL | **razonablemente seguro** |

> [!important] Qué **sí** se transfiere entero a MySQL
> La sintaxis cambia; **los conceptos no**. Estos siete valen igual en los dos motores y son los que
> van a caer en el parcial:
> 1. El plan es un **árbol** y se lee **de adentro hacia afuera**.
> 2. **Estimación ≠ realidad**: el optimizador estima a partir de **estadísticas**, y las estadísticas
>    se actualizan con `ANALYZE`.
> 3. **Full scan vs. acceso por índice** es la decisión central.
> 4. Una condición que **acota el acceso** (`Index Cond` / `key`) no es lo mismo que una que
>    **filtra después** (`Filter` / `Using where`).
> 5. En un índice **compuesto**, el **orden de las columnas** decide qué consultas puede servir.
> 6. Un índice que **cubre** la consulta evita ir a la tabla.
> 7. Condiciones inútiles (`LIKE '%'`, rangos de fecha que abarcan todo) **cuestan**, y las meten los
>    ORMs sin que nadie las pida.

---

## Guía de lectura de un plan

El método, en el orden en que conviene aplicarlo. Sirve para el TP5 y para el parcial.

### Paso 0 — ¿`EXPLAIN` o `EXPLAIN ANALYZE`?

- Si la consulta es un `SELECT` barato → `EXPLAIN ANALYZE` directo, querés los números reales.
- Si es un `INSERT` / `UPDATE` / `DELETE` / `CREATE TABLE AS` / `EXECUTE` → **`BEGIN; … ROLLBACK;`**.
- Si la consulta puede tardar minutos (como el `count(*)` de 30 M) → empezá con `EXPLAIN` a secas:
  cuesta 2 ms y ya te dice si va a hacer un full scan.

### Paso 1 — leer **de adentro hacia afuera**

El nodo **más sangrado** es el que se ejecuta **primero**. Cada `->` apunta a un hijo, y el hijo
alimenta al padre. Ejemplo del slide 5, con el orden real de ejecución:

```
"Limit                       ← 4º  corta en 10
"  ->  Sort                  ← 3º  ordena por sum(play) DESC
"        ->  HashAggregate   ← 2º  agrupa por username
"              ->  Seq Scan  ← 1º  ¡acá empieza todo!
```

**El dibujo del slide 6 es esta lista dada vuelta.** Si te perdés, dibujá las flechas.

### Paso 2 — mirar **la hoja**, no la raíz

El 90% de los problemas está en el nodo **más profundo**: cómo se accede a los datos.

| Lo que ves abajo de todo | Qué significa |
| --- | --- |
| `Seq Scan` sobre una tabla grande | leyó todo. **¿Falta un índice? ¿O el `WHERE` no es selectivo?** |
| `Index Scan` / `Index Only Scan` | usó un índice. **¿Cuál?** El nombre está en la línea |
| `Index Only Scan` + `Heap Fetches: 0` | el mejor caso: ni tocó la tabla |
| `Parallel *` | la consulta era tan cara que valió la pena repartirla |

### Paso 3 — `Index Cond` vs. `Filter`

Esta es **la lectura que más rinde**:

- Todo lo que está en `Index Cond` **acota** lo que se lee. Bien.
- Todo lo que está en `Filter` se evalúa **fila por fila, sobre filas ya leídas**. Cuesta y no ahorra.
- **`Rows Removed by Filter` es el termómetro:** si descarta miles de filas, ahí está el problema.
  Falta un índice, o falta una columna en el índice que ya existe.

### Paso 4 — costo: comparar, no predecir

- `cost=inicio..total`. El **inicio** importa cuando arriba hay un `LIMIT`; el **total**, cuando se
  consumen todas las filas.
- Es una **unidad arbitraria**, no milisegundos: `seq_page_cost = 1` es la unidad, o sea que el costo
  se mide en "lecturas de página".
- Fórmula del deck: `(páginas × seq_page_cost) + (tuplas × cpu_tuple_cost)`, con `seq_page_cost = 1`
  y `cpu_tuple_cost = 0.01`.
- **El número solo tiene sentido comparado con otro plan de la misma consulta.** Todo el tramo de
  `CovidCases` es exactamente eso: 933897 → 654531 → 534935 → 511017 → 1202.

### Paso 5 — con `ANALYZE`, comparar **estimado contra real**

Poné los dos números uno al lado del otro:

| Síntoma | Diagnóstico |
| --- | --- |
| `rows=` estimadas ≈ `rows=` reales | las estadísticas están bien; si el plan es malo, el problema es otro |
| estimadas **muy** distintas de reales | **estadísticas viejas o correlación entre columnas** → correr `ANALYZE tabla` |
| `actual time` alto en el nodo **más profundo** | el problema es el **acceso** a los datos |
| `actual time` alto **arriba** (`Sort`, `HashAggregate`) | el problema es el **procesamiento**: mucha fila intermedia |

Los tres casos de subestimación del propio deck: `112965` vs `100000` (tabla recién creada, sin
`ANALYZE`), `46300` vs `127759` (dos predicados correlacionados), y `rows=2` del `Gather` vs `rows=3`
real (el líder también trabaja).

### Paso 6 — `loops`

Si un nodo dice `loops=N` con `N > 1`, **las filas y los tiempos de `actual` son por loop**.
Multiplicá: `9990664 × 3 = 29.971.992`.

### Paso 7 — no confiar en el cronómetro

*"pero si lo volvemos a correr, puede dar otros valores, por ej. 61, 41, 30, … ms"*. El reloj depende
de la caché y de la carga. El **costo del plan es reproducible**; el tiempo, no. Y con `BUFFERS`,
`shared hit` alto significa que casi todo salió de caché — o sea que la próxima corrida en frío va a
ser peor.

---

## Dudas abiertas

- [ ] **Slide 16: *"El costo pasó de 933897 a 511017, es decir se incrementó un 45.3%"*.** El costo
      **bajó**. ¿Es un tipeo por "disminuyó", o la comparación era contra otra cosa?
- [ ] **Slide 17: el costo de contar todos los registros, ¿es 933897 o 391421?** El deck usa los dos
      números para lo mismo, con fechas de corte distintas (9/08/2022 y 25/03/2022).
- [ ] **¿De dónde sale `idx_audiocut_id_play`?** Aparece en el plan del slide 10 pero no está en el
      `\d audiocut` del slide 3 ni hay `CREATE INDEX` en ningún slide. ¿Cuál fue la definición exacta?
- [ ] **¿Por qué `audiocut` tiene dos índices btree sobre `id`** (`audiocut_pk` PK e `idx_audiocut_id`
      UNIQUE)? ¿Es un ejemplo de índice redundante o un descuido de la base?
- [ ] **Slide 20/21: con `graduados_a_idx (apellido)` y `graduados_n_idx (nombre)` disponibles, ¿por
      qué el planner elige el de `nombre`,** si `apellido` es más selectivo (6332 vs 4318 distintos) y
      los dos costos estimados son idénticos (`0.29..8.30`)?
- [ ] **Slide 21: ¿cuál es el plan de `where nombre = 'Luz' and apellido = 'Wetzler Malbrán'`?** El
      deck deja el `explain analyse` sin salida. ➖ **El TP5 no lo reproduce**: es PostgreSQL sobre
      `graduados` y el TP corre sobre **MySQL** con otras tablas. El experimento equivalente es el
      bloque `WHERE codigo = 60 AND nombre = 'Base de Datos II'` → [[Práctica 2026-08-18]]
      § *Bloque B*. Queda sin correr.
- [ ] **¿Entra `cpu_operator_cost` (0.0025) en el parcial?** La fórmula del slide 9 solo tiene
      `seq_page_cost` y `cpu_tuple_cost`, pero sin la tercera constante no cierran ni el `Aggregate`
      ni los `Seq Scan` con `Filter`.
- [ ] **¿Cuánto hay que saber de `GEQO`?** El **slide 10** pone el título y el link, y nada más.
- [ ] **¿La versión de PostgreSQL?** El deck mezcla `Total runtime:` (etiqueta vieja) con
      `Planning time:` / `Execution time:` (nueva). ¿Qué versión se usa si se llega a usar PG?
- [ ] **El parcial ~~y el TP5~~, ¿son sobre MySQL o sobre PostgreSQL?** El cronograma dice **MySQL**,
      este deck es **PostgreSQL puro**, y las salidas de `EXPLAIN` no se parecen en nada.
      ✅ **La mitad TP5 está cerrada:** el enunciado arranca con *"Antes de comenzar, es necesario
      levantar **MySQL** en la PC que vayan a utilizar para este práctico"* → [[Práctica 2026-08-18]].
      O sea que **sí, hay que rehacer todos los ejemplos** de este deck.
      🔴 **La mitad parcial sigue abierta:** el enunciado del TP5 **no dice nada del parcial**.
- [ ] **En MySQL, ¿desde qué versión está `EXPLAIN ANALYZE`?** Escribí 8.0.18 de memoria y **no lo
      verifiqué**. Confirmar contra la doc oficial antes de usarlo en el TP.
- [ ] **¿Cuál es el equivalente MySQL de `EXPLAIN (ANALYZE, BUFFERS)`?** No encontré uno directo.
- [ ] **En MySQL el DDL hace `COMMIT` implícito**, así que el truco `BEGIN; EXPLAIN ANALYZE CREATE
      TABLE AS …; ROLLBACK;` del slide 1 **no funciona**. ¿Cómo se hace el equivalente?

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
