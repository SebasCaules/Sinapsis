---
tipo: guia
unidad: 1
orden: 6
tema: Explain Plan — EXPLAIN, EXPLAIN ANALYZE e índices en MySQL
resumen: "TP5 resuelto: EXPLAIN vs. EXPLAIN ANALYZE, el plan de cada consulta del ejercicio 2 con cada combinación de PK, UNIQUE e índice no único, y el ejercicio 3 con los CSV importados; todos los planes son reales, corridos en MySQL 9.7.2."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 5 Explain Plan.pdf"
  - "raw/Unidad-01/Practica/materia.csv"
  - "raw/Unidad-01/Practica/inscripto.csv"
estado: procesado
---

# Guía TP05 — Explain Plan

## Resumen general

El TP5 enseña a leer el plan de ejecución de MySQL y a predecir cómo cambia cuando se agregan
restricciones. El método nunca fuerza el plan: se cambian las restricciones de la tabla (ninguna, PK
simple, PK compuesta, `UNIQUE`, índice no único) y se observa qué hace el optimizador. Se trabaja con
dos tablas mínimas, `materia(codigo, nombre)` e `inscripto(legajo, codigo)`, primero con 6 y 4 filas y
después con los CSV de 500 y 250 filas.

Se necesitan tres cosas. Primero, la diferencia entre `EXPLAIN` (estima sin ejecutar) y
`EXPLAIN ANALYZE` (ejecuta y agrega tiempos y filas reales). Segundo, la sintaxis de índices de MySQL:
`ALTER TABLE … ADD PRIMARY KEY`, `CREATE [UNIQUE] INDEX n ON t (cols)`, `DROP INDEX n ON t` y
`ALTER TABLE … DROP PRIMARY KEY`. Tercero, la teoría de *Seven Databases* cap. 2.2: toda PK y todo
`UNIQUE` crean un índice B-tree; el B-tree sirve para igualdad, rangos y orden, y el hash solo para
igualdad.

Trampas: en InnoDB, `USING HASH` se acepta pero se ignora (crea un B-tree); la PK es el índice
clustered, así que cualquier índice secundario lleva la PK adentro y puede "cubrir" la consulta; un
índice compuesto sirve solo por su prefijo izquierdo, y un `OR` con una rama sin índice obliga a
recorrer todo. Con tablas chicas los tiempos son ruido: lo que se compara es el tipo de acceso, las
filas estimadas y el costo.

Para el parcial: reconocer en un árbol TREE los nodos `Table scan`, `Filter`, `Index lookup`,
`Covering index lookup`, `Single-row index lookup`, `Rows fetched before execution`, `Sort`,
`Inner hash join` y `Nested loop inner join`, y deducir qué índice existe a partir del plan.

## Setup

Todo lo que sigue se corrió en un contenedor `mysql:9.7.2`. En 9.7 el formato TREE ya es el
predeterminado; el `SET` del enunciado igual se ejecuta.

```sql
CREATE TABLE materia (
  codigo INT,
  nombre VARCHAR(40)
);

INSERT INTO materia (codigo, nombre) VALUES
  (10, 'Introduccion a la Computacion'),
  (20, 'Programacion I'),
  (30, 'Estructura de Datos y Algoritmos'),
  (40, 'Base de Datos I'),
  (50, 'Programación IV'),
  (60, 'Base de Datos II');
```

(nota) Las tildes se copian tal cual el enunciado ("Programacion I" sin tilde, "Programación IV" con
tilde): los `WHERE nombre = …` dependen de eso.

Sintaxis de índices que el enunciado no da y que todo el ejercicio 2 necesita:

```sql
ALTER TABLE materia ADD PRIMARY KEY (codigo);          -- PK
ALTER TABLE materia DROP PRIMARY KEY;                  -- borrar PK
CREATE UNIQUE INDEX ux_codigo ON materia (codigo);     -- índice único
CREATE INDEX ix_codigo ON materia (codigo);            -- índice no único
DROP INDEX ux_codigo ON materia;                       -- borrar índice
SHOW INDEX FROM materia;                               -- ver qué hay
```

## Ejercicio 1

### 1.a

**Consigna:** crear `materia` con `codigo` entero y `nombre` `varchar(40)`, cargar las seis tuplas,
ejecutar `SET @@explain_format=TREE;`, `EXPLAIN SELECT * FROM materia;` y
`EXPLAIN ANALYZE SELECT * FROM materia;`, e identificar las diferencias.

**Resolución:** tabla y datos en § *Setup*. Salidas reales:

```sql
SET @@explain_format=TREE;

EXPLAIN SELECT * FROM materia;
-- -> Table scan on materia  (cost=0.85 rows=6)

EXPLAIN ANALYZE SELECT * FROM materia;
-- -> Table scan on materia  (cost=0.85 rows=6) (actual time=0.00908..0.0115 rows=6 loops=1)
```

| | `EXPLAIN` | `EXPLAIN ANALYZE` |
| --- | --- | --- |
| ¿Ejecuta la consulta? | ✗ solo la planifica | ✓ la ejecuta (descarta el resultado) |
| Qué muestra | plan + estimaciones del optimizador: `cost`, `rows` | lo mismo + lo medido: `actual time=primera..última fila` (ms), `rows` reales, `loops` |
| Formatos | `TRADITIONAL` (tabla), `JSON`, `TREE` | solo `TREE` |
| Riesgo | ninguno | si la sentencia es lenta, tarda lo mismo que ejecutarla |

(clave) Comparar `rows` estimadas contra `rows` reales es la forma de detectar estadísticas
desactualizadas. En formato `TRADITIONAL` el mismo plan se ve como `type = ALL` (full scan) y no trae
costo por nodo; por eso el TP pide `TREE`.

## Ejercicio 2

### 2.a Lectura: índices, PK, B-tree y hash

**Consigna:** leer *Seven Databases* pp. 18–21 (*Fast Lookups with Indexing*) y el manual de MySQL
§ 10.3.9 (*Comparison of B-Tree and Hash Indexes*).

**Resolución:**

- Un índice es una estructura auxiliar que evita recorrer toda la tabla para encontrar un valor.
- Al definir una **PRIMARY KEY**, el motor crea automáticamente un índice **B-tree** sobre esas
  columnas; `UNIQUE` también crea uno. En InnoDB, además, la PK **es** el índice clustered: las filas
  se guardan en las hojas del B-tree de la PK, y cada índice secundario guarda la PK como puntero.
- Una `FOREIGN KEY` exige índice en la columna referenciante (MySQL lo crea si falta).
- **B-tree:** claves ordenadas. Sirve para `=`, `<`, `>`, `BETWEEN`, `LIKE 'abc%'` y para dar el
  orden de un `ORDER BY`. Un índice compuesto se usa por su **prefijo izquierdo**.
- **Hash:** solo `=` y `<=>`; no sirve para rangos ni para ordenar, y debe usar la clave completa.
  En MySQL solo lo implementa el motor `MEMORY`. En InnoDB, `USING HASH` se acepta y se ignora:

```sql
CREATE INDEX ix_h ON inscripto (legajo) USING HASH;
-- Note 3502: This storage engine does not support the HASH index algorithm,
--            storage engine default was used instead.   (queda BTREE)
```

### 2.b `SELECT nombre FROM materia WHERE codigo = 10;`

**Consigna:** plan sin restricciones, con `codigo` PK, con PK compuesta `(codigo, nombre)`; repetir
los dos casos con índices `UNIQUE` y después con índices no únicos. ¿Se ven cambios?

**Resolución:** planes reales (TREE y, entre paréntesis, `type` / `Extra` del formato tradicional).

| Variante | DDL | Plan TREE | type · Extra |
| --- | --- | --- | --- |
| Sin restricciones | — | `Filter: (materia.codigo = 10)` ← `Table scan on materia (cost=0.85 rows=6)` | `ALL` · Using where |
| PK `codigo` | `ALTER TABLE materia ADD PRIMARY KEY (codigo);` | `Rows fetched before execution (cost=0..0 rows=1)` | `const` |
| PK `(codigo, nombre)` | `ALTER TABLE materia DROP PRIMARY KEY, ADD PRIMARY KEY (codigo, nombre);` | `Covering index lookup on materia using PRIMARY (codigo = 10) (cost=0.35 rows=1)` | `ref` · Using index |
| `UNIQUE (codigo)` | `ALTER TABLE materia DROP PRIMARY KEY; CREATE UNIQUE INDEX ux_codigo ON materia (codigo);` | `Rows fetched before execution (cost=0..0 rows=1)` | `const` |
| `UNIQUE (codigo, nombre)` | `DROP INDEX ux_codigo ON materia; CREATE UNIQUE INDEX ux_codigo_nombre ON materia (codigo, nombre);` | `Covering index lookup on materia using ux_codigo_nombre (codigo = 10) (cost=0.35 rows=1)` | `ref` · Using index |
| `INDEX (codigo)` no único | `DROP INDEX ux_codigo_nombre ON materia; CREATE INDEX ix_codigo ON materia (codigo);` | `Index lookup on materia using ix_codigo (codigo = 10) (cost=0.35 rows=1)` | `ref` |
| `INDEX (codigo, nombre)` no único | `DROP INDEX ix_codigo ON materia; CREATE INDEX ix_codigo_nombre ON materia (codigo, nombre);` | `Covering index lookup on materia using ix_codigo_nombre (codigo = 10) (cost=0.35 rows=1)` | `ref` · Using index |

Por qué:

- **Sin índice**, full scan y la condición como filtro posterior.
- **PK simple:** igualdad sobre una clave única con una constante → a lo sumo una fila; MySQL la lee
  durante la optimización (`const`) y el plan ya no tiene accesos: *Rows fetched before execution*.
- **PK compuesta:** `codigo` es el prefijo izquierdo, así que el índice sirve; pero `codigo = 10` ya no
  garantiza una sola fila (la unicidad es del par), entonces pasa a `ref`. Como el índice contiene
  `nombre`, **cubre** la consulta (*Covering*, *Using index*).
- **`UNIQUE` vs. PK:** ✗ no hay cambios; el plan es idéntico, solo cambia el nombre del índice.
- **No único:** la versión simple pasa de `const` a `ref` (*Index lookup*: puede haber varias filas) y
  tiene que ir a la tabla a buscar `nombre`; la compuesta no cambia: ya era `ref` y cubre.

### 2.c `SELECT nombre FROM materia WHERE codigo = 60 AND nombre = 'Base de Datos II';`

**Consigna:** plan sin restricciones; con PK `(codigo, nombre)`; con dos índices `UNIQUE` separados,
uno sobre `codigo` y otro sobre `nombre`.

**Resolución:**

```sql
-- Sin restricciones
-- -> Filter: ((materia.nombre = 'Base de Datos II') and (materia.codigo = 60))  (cost=0.85 rows=1)
--     -> Table scan on materia  (cost=0.85 rows=6)                        [ALL · Using where]

ALTER TABLE materia ADD PRIMARY KEY (codigo, nombre);
-- -> Rows fetched before execution  (cost=0..0 rows=1)                    [const · key_len 166 · ref const,const]

ALTER TABLE materia DROP PRIMARY KEY;
CREATE UNIQUE INDEX ux_codigo ON materia (codigo);
CREATE UNIQUE INDEX ux_nombre ON materia (nombre);
-- -> Rows fetched before execution  (cost=0..0 rows=1)                    [const · possible_keys ux_codigo,ux_nombre · key ux_codigo]
```

- Con la **PK compuesta**, las dos condiciones son igualdades sobre la clave completa: una fila
  garantizada, `const`.
- Con los **dos `UNIQUE`**, el plan TREE es el mismo, pero el tradicional muestra que el optimizador
  consideró los dos (`possible_keys`) y **eligió uno solo**, `ux_codigo` (clave de 4 bytes contra 163
  de `nombre`). La otra condición se verifica sobre la fila leída. MySQL no combina índices para un
  `AND` cuando uno solo ya da `const`.

### 2.d `SELECT * FROM materia ORDER BY codigo;`

**Consigna:** plan sin restricciones y con `codigo` PK.

**Resolución:**

```sql
-- Sin restricciones
-- -> Sort: materia.codigo  (cost=0.85 rows=6)
--     -> Table scan on materia  (cost=0.85 rows=6)                        [ALL · Using filesort]

ALTER TABLE materia ADD PRIMARY KEY (codigo);
-- -> Index scan on materia using PRIMARY  (cost=0.85 rows=6)              [index]
```

(clave) Desaparece el `Sort`: el B-tree de la PK ya tiene las filas en orden de `codigo`, así que
basta recorrerlo de punta a punta. Sigue leyendo las 6 filas (no hay filtro), pero sin ordenar.

### 2.e `SELECT * FROM materia INNER JOIN inscripto ON materia.codigo = inscripto.codigo;`

**Consigna:** crear y cargar `inscripto`; plan sin restricciones en `materia`, con `codigo` PK de
`materia` y además con `codigo` PK de `inscripto`. (El enunciado sugiere el *Form Editor* de
Workbench para ver el árbol: la salida TREE es una sola celda multilínea.)

**Resolución:**

```sql
CREATE TABLE inscripto (legajo INT, codigo INT);
INSERT INTO inscripto VALUES (100, 20);
INSERT INTO inscripto VALUES (200, 10);
INSERT INTO inscripto VALUES (300, 30);
INSERT INTO inscripto VALUES (400, 40);

ALTER TABLE materia DROP PRIMARY KEY;           -- sin restricciones
-- -> Inner hash join (materia.codigo = inscripto.codigo)  (cost=3.3 rows=4)
--     -> Table scan on materia  (cost=0.0875 rows=6)
--     -> Hash
--         -> Table scan on inscripto  (cost=0.65 rows=4)

ALTER TABLE materia ADD PRIMARY KEY (codigo);   -- PK en materia
-- -> Nested loop inner join  (cost=2.05 rows=4)
--     -> Filter: (inscripto.codigo is not null)  (cost=0.65 rows=4)
--         -> Table scan on inscripto  (cost=0.65 rows=4)
--     -> Single-row index lookup on materia using PRIMARY (codigo = inscripto.codigo)  (cost=0.275 rows=1)

ALTER TABLE inscripto ADD PRIMARY KEY (codigo); -- PK también en inscripto
-- -> Nested loop inner join  (cost=2.05 rows=4)
--     -> Table scan on inscripto  (cost=0.65 rows=4)
--     -> Single-row index lookup on materia using PRIMARY (codigo = inscripto.codigo)  (cost=0.275 rows=1)
```

- **Sin índices:** *hash join*. Se construye una tabla hash con la tabla chica (`inscripto`, nodo
  `Hash`) y se recorre `materia` buscando en ella. Costo 3.3.
- **PK en `materia`:** *nested loop*. Por cada fila de `inscripto` (tabla externa), una búsqueda por
  PK en `materia` (`eq_ref`, *Single-row index lookup*). Costo 2.05. El `Filter: is not null` aparece
  porque un `NULL` en `inscripto.codigo` nunca matchea y se descarta antes de buscar.
- **PK también en `inscripto`:** cambio mínimo, mismo costo. Solo desaparece el `Filter is not null`
  (una PK es `NOT NULL`); `inscripto` sigue siendo la tabla externa porque es la más chica y se lee
  entera de todos modos.

### 2.f `SELECT * FROM inscripto WHERE legajo = 100 OR codigo = 10;`

**Consigna:** plan sin restricciones en `inscripto` y con PK compuesta `(legajo, codigo)`.

**Resolución:**

```sql
ALTER TABLE inscripto DROP PRIMARY KEY;          -- sin restricciones
-- -> Filter: ((inscripto.legajo = 100) or (inscripto.codigo = 10))  (cost=0.65 rows=1.75)
--     -> Table scan on inscripto  (cost=0.65 rows=4)                     [ALL · Using where]

ALTER TABLE inscripto ADD PRIMARY KEY (legajo, codigo);
-- -> Filter: ((inscripto.legajo = 100) or (inscripto.codigo = 10))  (cost=0.65 rows=1.75)
--     -> Covering index scan on inscripto using PRIMARY  (cost=0.65 rows=4)   [index · Using where; Using index]
```

(clave) La PK compuesta **no ayuda**: la rama `legajo = 100` podría usarla (prefijo izquierdo), pero
la rama `codigo = 10` no (segunda columna sin la primera), y el `OR` necesita las filas de cualquiera
de las dos. Resultado: recorre el índice entero y filtra. Mismo costo que sin índice. Para que el `OR`
use índices, cada rama necesita el suyo; ver § 3, consulta 7.

## Ejercicio 3

### 3.a Borrar constraints e importar los CSV

**Consigna:** borrar los constraints de ambas tablas e importar `materias.csv` e `inscripto.csv`.

**Resolución:** (atención) el archivo se llama `materia.csv`, no `materias.csv`. Los códigos del CSV
(1000–1499) no chocan con las 6 tuplas originales; se trunca para trabajar solo con el dataset.

```sql
ALTER TABLE materia DROP PRIMARY KEY;
ALTER TABLE inscripto DROP PRIMARY KEY;
TRUNCATE TABLE materia;
TRUNCATE TABLE inscripto;

-- El servidor necesita local_infile=ON (SET GLOBAL local_infile = 1;) y el cliente --local-infile=1.
-- En Workbench, la alternativa es "Table Data Import Wizard".
LOAD DATA LOCAL INFILE '/ruta/materia.csv' INTO TABLE materia
  FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (codigo, nombre);
LOAD DATA LOCAL INFILE '/ruta/inscripto.csv' INTO TABLE inscripto
  FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (legajo, codigo);

ANALYZE TABLE materia, inscripto;   -- refresca estadísticas para el optimizador
```

Verificado al importar: `materia` 500 filas, `codigo` 1000–1499 único, 386 `nombre` distintos;
`inscripto` 250 filas, 185 `legajo` y 200 `codigo` distintos, los 250 pares `(legajo, codigo)` únicos.
Consecuencias: `CREATE UNIQUE INDEX … (nombre)` falla (`ERROR 1062 Duplicate entry 'Materia 654'`) y
`ADD PRIMARY KEY (codigo)` en `inscripto` también (`Duplicate entry '1439'`); la PK compuesta
`(legajo, codigo)` sí se puede.

### 3.b Consultas con y sin índices

**Consigna:** probar consultas que muestren la diferencia entre usar y no usar índices, en costo y
tiempo de `EXPLAIN` / `EXPLAIN ANALYZE`.

**Resolución:** las siete consultas se corrieron con `EXPLAIN ANALYZE` primero sin ningún índice y
después con estos:

```sql
ALTER TABLE materia ADD PRIMARY KEY (codigo);
CREATE INDEX ix_nombre ON materia (nombre);
ALTER TABLE inscripto ADD PRIMARY KEY (legajo, codigo);
ANALYZE TABLE materia, inscripto;
```

Resumen de lo medido (costo estimado; filas leídas → filas devueltas):

| # | Consulta | Sin índices | Con índices |
| --- | --- | --- | --- |
| 1 | `SELECT nombre FROM materia WHERE codigo = 1250` | Table scan + Filter · cost 50.8 · 500 → 1 | Rows fetched before execution · cost 0 · 1 |
| 2 | `SELECT * FROM materia WHERE codigo BETWEEN 1100 AND 1109` | Table scan + Filter · cost 50.8 · 500 → 10 | Index range scan on PRIMARY · cost 2.64 · 10 → 10 |
| 3 | `SELECT * FROM materia ORDER BY codigo` | Sort + Table scan · cost 50.8 | Index scan on PRIMARY, sin Sort · cost 51.9 |
| 4 | `SELECT * FROM materia m JOIN inscripto i ON m.codigo = i.codigo` | Inner hash join · cost 12526 | Nested loop + Single-row index lookup · cost 206 |
| 5 | `SELECT * FROM materia WHERE nombre = 'Materia 281'` | Table scan + Filter · cost 50.8 · 500 → 6 | Covering index lookup on ix_nombre · cost 0.875 · 6 |
| 6 | `SELECT * FROM inscripto WHERE legajo = 404` | Table scan + Filter · cost 25.2 · 250 → 1 | Covering index lookup on PRIMARY · cost 0.35 · 1 |
| 7 | `SELECT * FROM inscripto WHERE legajo = 404 OR codigo = 1339` | Table scan + Filter · cost 25.2 · 250 → 1 | Covering index scan + Filter · cost 25.2 · 250 → 1 (sin mejora) |

Salidas completas de los casos más ilustrativos:

```sql
-- 2 · rango, sin índice
-> Filter: (materia.codigo between 1100 and 1109)  (cost=50.8 rows=55.6) (actual time=0.0242..0.0844 rows=10 loops=1)
    -> Table scan on materia  (cost=50.8 rows=500) (actual time=0.00192..0.0634 rows=500 loops=1)
-- 2 · rango, con PK
-> Filter: (materia.codigo between 1100 and 1109)  (cost=2.64 rows=10) (actual time=0.0399..0.0425 rows=10 loops=1)
    -> Index range scan on materia using PRIMARY over (1100 <= codigo <= 1109)  (cost=2.64 rows=10) (actual time=0.0147..0.0168 rows=10 loops=1)

-- 4 · join, sin índices
-> Inner hash join (m.codigo = i.codigo)  (cost=12526 rows=12500) (actual time=0.0533..0.142 rows=250 loops=1)
    -> Table scan on m  (cost=0.023 rows=500) (actual time=834e-6..0.0615 rows=500 loops=1)
    -> Hash
        -> Table scan on i  (cost=25.2 rows=250) (actual time=0.00179..0.0315 rows=250 loops=1)
-- 4 · join, con PKs
-> Nested loop inner join  (cost=206 rows=250) (actual time=0.0155..0.148 rows=250 loops=1)
    -> Covering index scan on i using PRIMARY  (cost=25.2 rows=250) (actual time=0.0117..0.0212 rows=250 loops=1)
    -> Single-row index lookup on m using PRIMARY (codigo = i.codigo)  (cost=0.625 rows=1) (actual time=399e-6..418e-6 rows=1 loops=250)

-- 5 · igualdad sobre nombre, con índice no único
-> Covering index lookup on materia using ix_nombre (nombre = 'Materia 281')  (cost=0.875 rows=6) (actual time=0.00642..0.00762 rows=6 loops=1)
```

Para que el `OR` (consulta 7) use índices hay que darle uno a cada rama:

```sql
CREATE INDEX ix_ins_codigo ON inscripto (codigo);
-- -> Filter: ((inscripto.legajo = 404) or (inscripto.codigo = 1339))  (cost=1.46 rows=2) (actual time=0.0397..0.0402 rows=1 loops=1)
--     -> Deduplicate rows sorted by row ID  (cost=1.46 rows=2)
--         -> Covering index range scan on inscripto using PRIMARY over (legajo = 404)  (cost=0.36 rows=1)
--         -> Covering index range scan on inscripto using ix_ins_codigo over (codigo = 1339)  (cost=0.36 rows=1)
```

Conclusiones:

- (clave) **El costo es lo que se compara**, no el tiempo: con 500 filas todo tarda décimas de
  milisegundo y la diferencia de tiempo es ruido. El costo, en cambio, baja de 50.8 a 0–2.6 en las
  búsquedas selectivas y de 12526 a 206 en el join (el hash join se estima con 500 × 250 / 10 = 12500
  filas porque no hay estadísticas de la columna de join).
- **Selectividad:** el índice rinde cuando la consulta devuelve pocas filas. La consulta 3 lee las
  500 filas con o sin índice; el índice solo le ahorra el `Sort` (el costo estimado hasta sube un
  poco: 51.9).
- **Índice que cubre:** la consulta 5 pide `SELECT *` y aun así es *Covering*: en InnoDB el índice
  secundario `ix_nombre` guarda la PK (`codigo`), y `(nombre, codigo)` son todas las columnas.
- **`OR`:** con un solo índice compuesto no mejora; con un índice por rama, MySQL hace *index merge*
  por unión (dos range scans y deduplicación por id de fila), costo 1.46.
- **Comparar estimado vs. real:** en la consulta 1 sin índice el optimizador estimaba `rows=50` en el
  filtro y salió 1; con estadísticas de columna (histogramas) la estimación mejora, pero sin índice el
  plan no cambia.

## Enlaces

- Práctica de donde sale el análisis largo: [[Práctica 2026-08-18|Práctica del 18/08]]
- Teórica: [[Clase 08 - Explicando el plan|Clase 08]] · [[1.08.01 - Plan de ejecución|Plan de ejecución]] ·
  [[1.08.02 - Índices|Índices]]
- Motor: [[MySQL]]
