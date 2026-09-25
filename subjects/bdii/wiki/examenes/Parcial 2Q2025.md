---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - Vistas con WITH CHECK OPTION (CASCADED/LOCAL)
  - Integridad referencial y acciones referenciales (RESTRICT/CASCADE, MATCH simple)
  - EXPLAIN y plan de ejecución en MySQL
  - CHECK, ASSERTION y triggers
  - Privilegios (GRANT/REVOKE, WITH GRANT OPTION, CASCADE)
  - Teorema CAP y arquitecturas distribuidas
  - MongoDB — CRUD, aggregation pipeline, MapReduce, índices
  - Persistencia políglota, sharding y replicación
  - Cassandra (no dictado aún en 2026 2C)
  - Neo4j (no dictado aún en 2026 2C)
cuatrimestre: 2025-2C
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Parciales viejos/Parcial_BDII_2Q2025_reconstruido(1).pdf"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Parciales viejos/Parcial_BDII_2Q2025_reconstruido.pdf"
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Parcial 2Q2025.docx"
estado: procesado
resumen: "Parcial del 2Q2025, el modelo más cercano al del 13/10/2026: 33 preguntas sobre SQL/MySQL (vistas, RI, EXPLAIN, CHECK, privilegios), CAP y MongoDB, más Cassandra/Neo4j (no dictados aún). Tres fuentes cruzadas y corridas reales en MySQL y MongoDB."
aliases:
  - Parcial 2Q2025
  - 2Q2025
  - Parcial segundo cuatrimestre 2025
  - Parcial octubre 2025
---

# Parcial 2Q2025 — el modelo más cercano al parcial del 13/10/2026

## Resumen general

Parcial del segundo cuatrimestre de 2025, la instancia más reciente del vault y la que mejor predice
el formato del parcial del 13/10/2026: mismo temario (SQL avanzado sobre MySQL en la primera mitad,
CAP y MongoDB en la segunda), a diferencia de los parciales 2020-2021 que evalúan PostgreSQL/CouchDB/
ElasticSearch. Son 33 preguntas —opción múltiple simple y de varias correctas, verdadero/falso,
coincidencia y ensayo— rendidas en una plataforma online autocalificada para los primeros cuatro
tipos. El [[Parcial XC-202X|Parcial XC-202X]] es casi el mismo examen en formato de desarrollo y el
[[Parcial 2Q-2023|Parcial 2Q-2023]] comparte cinco ejercicios (§ *Relación con otras instancias*).

La confiabilidad de las respuestas es alta: se cruzan **tres fuentes** (§ *Fuente*) que en
general concuerdan — un reconstruido con solucionario, 41 capturas del examen real corregidas por
la plataforma y el vault mismo—, contra el que se contrasta cada
pregunta y sobre el que se corrieron en MySQL 9.7.2 y MongoDB 8.3.11 todas las de vistas
(`CHECK OPTION` y actualizabilidad), acciones referenciales, `CHECK` de tabla y MongoDB. El solucionario y las capturas no se contradicen en las 22
preguntas autocalificadas; en las 11 de ensayo la captura solo muestra el puntaje manual, no el
texto del alumno, así que para esas once la fuente es el solucionario.

Qué enseña para el 13/10/2026: el peso de `WITH CHECK OPTION` y sus dos variantes, las
acciones referenciales con `MATCH simple` (MySQL acepta `MATCH FULL/PARTIAL` pero los ignora, así que el
examen las pide de lápiz y papel), la lectura de un `EXPLAIN` mostrando `Unique Index Scan` vs. `Full
Scan`, el teorema CAP por motor con la clasificación **del deck**, y que Cassandra y Neo4j entran al
examen aunque en 2026 2C todavía no se dictaron: según [[_cronograma]], Cassandra empieza el 28/09 y
Neo4j el 19/10.

> [!info] Fuente
> - **`Parcial_BDII_2Q2025_reconstruido(1).pdf`** (texto) — examen reconstruido por
>   estudiantes, "sin soluciones" en la portada, con un **solucionario completo al final** (las 33
>   preguntas). Es la fuente más completa y estructurada: da el enunciado literal y una explicación
>   razonada de cada respuesta. No es material oficial de la cátedra.
> - **`Parcial_BDII_2Q2025_reconstruido.pdf`** — misma reconstrucción, en versión con imágenes;
>   se usó para cotejar tablas y esquemas (el DER de `OBRA`/`CONSTRUCTOR` de las
>   preguntas 16 y 27) contra el texto extraído. Trae además marcas de quien la completó, no
>   necesariamente la misma persona de las capturas del examen real: opciones encerradas en círculo
>   (preguntas 12 A y C, 13 A y B, 14 F, 17 D, 28 F), una respuesta manuscrita a la pregunta 15
>   (*"Cuánto se paga en efectivo en un día"*), una consulta tipeada en la pregunta 16 (`CASE WHEN
>   op.id_obra IS NOT NULL THEN op.arquitecto WHEN oc.id_obra IS NOT NULL THEN oc.ingeniero_resp ELSE
>   NULL END AS Resp_obra`, sin el `WHERE anio_finalizacion IS NULL` del enunciado) y una definición
>   tipeada en la pregunta 27 (`CREATE VIEW ContructorVip` con `NATURAL JOIN` y `count(o.id_obra)`, sin
>   `HAVING`), más anotaciones sueltas ("DEADASS" en la 17, "Peer-to-Peer" en la 28). Se citan como
>   dato adicional de resolución (útil para contrastar variantes de consulta), no como una segunda
>   fuente autorizada de qué es correcto.
> - **`BDII - Parcial 2Q2025.docx`** (41 imágenes) — capturas de
>   pantalla del **examen real** rendido en una plataforma online (probablemente la del campus),
>   encabezadas por *"Aclaración: No son mías las respuestas"* (quien las subió no es quien las
>   respondió). Muestran, pregunta por pregunta: el enunciado tal como lo vio el alumno, la opción
>   marcada, si la plataforma la corrigió como correcta o incorrecta, la opción correcta señalada, y
>   el puntaje obtenido (incluye crédito parcial negativo en las preguntas que lo declaran). Es la
>   fuente más confiable para "qué es correcto según la cátedra", porque la corrección la hizo la
>   plataforma de la cátedra, no un estudiante.
> - **Instancias hermanas.** El cuaderno manuscrito `BDII - Parciales Viejos.pdf` trae el
>   [[Parcial XC-202X|Parcial XC-202X]], casi el mismo examen con respuestas a desarrollar, y el
>   [[Parcial 2Q-2023|Parcial 2Q-2023]], del que se reciclan cinco ejercicios. Se documentan en sus
>   páginas; aquí solo se enlazan.

## Formato

- **33 preguntas**, de cinco tipos: opción múltiple simple, opción múltiple de varias correctas (con
  **crédito parcial y negativo**, declarado explícitamente en el enunciado de esas preguntas),
  verdadero/falso, coincidencia (*matching*, también con crédito parcial y negativo) y ensayo
  (respuesta libre, corregida a mano — sus capturas no muestran el texto que escribió el alumno, solo
  el puntaje obtenido).
- Rendido en una **plataforma online autocalificada** para opción múltiple, V/F y coincidencia: las
  capturas muestran el puntaje de cada pregunta (p. ej. `0/2`, `1/1`, `3/3`, `0,99/3`) y, en las de
  varias correctas, el desglose de puntos por opción marcada (p. ej. `33,33 %` por cada acierto,
  `-33,33 %` por cada distractor marcado).
- **Puntaje total, condición de aprobación, duración y modalidad:** ninguna de las tres fuentes lo
  dice explícitamente. El campo `Fecha:` del encabezado del reconstruido está en blanco (para que lo
  complete el alumno), así que no hay fecha exacta de la instancia — de ahí que `fecha` no figure en
  el frontmatter de esta página.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1 | Vistas con `WITH CASCADED/LOCAL CHECK OPTION`, cadena de tres vistas | [[1.06.01 - Vistas\|Vistas]] | Clase 06 · [[Práctica 2026-08-11\|TP4]] |
| 2 | `EXPLAIN` vs. `EXPLAIN ANALYZE` en MySQL | [[1.08.01 - Plan de ejecución\|Plan de ejecución]] | Clase 08 · [[Práctica 2026-08-18\|TP5]] |
| 3 | Teorema CAP — todos los nodos aceptan lectura y escritura | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 |
| 4 | Neo4j HA — propagación de escrituras entre nodos | Neo4j — texto plano *(no dictado aún; se dicta el 19–20/10)* | — |
| 5 | Persistencia políglota vs. programación políglota | [[2.12.03 - Persistencia políglota\|Persistencia políglota]] | Clase 12 · [[Práctica 2026-08-04]] |
| 6 | MapReduce en MongoDB | [[2.14.03 - MapReduce\|MapReduce]] | Clase 14 |
| 7 | Cassandra — Keyspace/Column Family/Cluster vs. equivalentes relacionales | Cassandra — texto plano *(no dictado aún; se dicta el 28/09–06/10)* | — |
| 8 | Componentes de un nodo Cassandra (SSTable, Memtable, Commit Log) | Cassandra — texto plano *(no dictado aún)* | — |
| 9 | Índice por defecto de MongoDB (`_id`, B-Tree) | [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] | Clase 14 |
| 10 | MongoDB en el teorema CAP | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 · Clase 14 |
| 11 | Vista materializada en MySQL — performance | [[1.06.01 - Vistas\|Vistas]] § *Virtual vs. materializada* | Clase 06/07 |
| 12 | Lectura de un plan `EXPLAIN` (Unique Index Scan vs. Full Scan) | [[1.08.01 - Plan de ejecución\|Plan de ejecución]] · [[1.08.02 - Índices\|Índices]] | Clase 08 |
| 13 | Bases de datos en configuración CA | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 |
| 14 | Cassandra — SSTable en memoria o en disco | Cassandra — texto plano *(no dictado aún)* | — |
| 15 | Interpretar un `aggregate` de MongoDB (`$match`+`$group`) | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 12 · [[Práctica 2026-09-15\|TP9]] |
| 16 | Consulta MySQL con `COALESCE` sobre jerarquía exclusiva (`OBRA`/`OBRA_PRIVADA`/`OBRA_CIVIL`) | [[1.05.01 - SQL — consultas\|SQL — consultas]] | Clase 05 |
| 17 | RI — `UPDATE` sobre `Carrera` con dos RIR (`restrict`/`cascade`) | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 · [[Práctica 2026-08-25\|TP6]] |
| 18 | Vistas con `WITH LOCAL CHECK OPTION` — `INSERT` que no satisface la vista base | [[1.06.01 - Vistas\|Vistas]] | Clase 06 · [[Práctica 2026-08-11\|TP4]] |
| 19 | RI — `INSERT` con FK compuesta y un componente `NULL` (`MATCH simple`) | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 · [[Práctica 2026-08-25\|TP6]] |
| 20 | Neo4j — Cypher, restricción de unicidad | Neo4j — texto plano *(no dictado aún)* | — |
| 21 | Diferencia entre replicación y sharding | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | Clase 12 |
| 22 | Neo4j — traducir una consulta Cypher a lenguaje natural | Neo4j — texto plano *(no dictado aún)* | — |
| 23 | Cassandra — `WHERE` sin la clave de partición | Cassandra — texto plano *(no dictado aún)* | — |
| 24 | Restricción de tabla: SQL estándar vs. MySQL | [[1.09.03 - CHECK, DOMAIN y ASSERTION\|CHECK, DOMAIN y ASSERTION]] | Clase 09/10 |
| 25 | `CHECK` de tabla — qué hace, de qué tipo es, si aplica a datos ya cargados | [[1.09.03 - CHECK, DOMAIN y ASSERTION\|CHECK, DOMAIN y ASSERTION]] | Clase 09/10 |
| 26 | Cassandra — fórmula del QUORUM | Cassandra — texto plano *(no dictado aún)* | — |
| 27 | Vista `ConstructorVIP` con agregación — actualizabilidad | [[1.06.01 - Vistas\|Vistas]] | Clase 06/07 |
| 28 | Cassandra — arquitectura Master-Slave o peer-to-peer | Cassandra — texto plano *(no dictado aún)* | — |
| 29 | Cassandra — Primary Key: partition key y clustering columns | Cassandra — texto plano *(no dictado aún)* | — |
| 30 | RI — `DELETE` sobre `Carrera` con RIR `restrict` | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 · [[Práctica 2026-08-25\|TP6]] |
| 31 | Modelo embebido vs. no embebido en MongoDB | [[2.13.01 - Documentos embebidos vs. referencias\|Documentos embebidos vs. referencias]] | Clase 13 |
| 32 | Cadena de `GRANT`/`REVOKE ... CASCADE` en SQL estándar | [[1.11.02 - Usuarios, privilegios y roles\|Usuarios, privilegios y roles]] | Clase 11 · [[Práctica 2026-09-08\|TP8]] |
| 33 | Motor que delega la coordinación de nodos en una herramienta externa | [[2.12.04 - Teorema CAP\|Teorema CAP]] *(arquitecturas)* + Neo4j *(no dictado aún)* | Clase 12 |

## Relación con otras instancias

| Pregunta del 2Q2025 | Reaparece en | Diferencia |
| --- | --- | --- |
| 1 y 18 — cadena `MovimientoUSDT` | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 1 | umbrales `valor < 1100` y `comision < 20`; seis `INSERT` a justificar |
| 2 — `EXPLAIN ANALYZE` | [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 7 | tres incisos V/F, con PostgreSQL de fondo |
| 8 y 14 — nodo de Cassandra | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 7 | esquema a dibujar |
| 13 y 20 — Neo4j: CA y restricción de unicidad | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 3 | las dos cosas en un ejercicio de desarrollo |
| 15 — `aggregate` de `orders` | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 10a | idéntica |
| 16 — `COALESCE` sobre `OBRA_PRIVADA`/`OBRA_CIVIL` | [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 1B | obras con supervisor en vez de obras en ejecución |
| 17, 19 y 30 — `UPDATE`, `INSERT` y `DELETE` sobre `Carrera`/`Materia` | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 2 (b, c, a) · [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 8 (8.2, 8.3, 8.1) | a desarrollar; en los dos, el estudiante da el `UPDATE` por procedente |
| 21 — replicación vs. sharding | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 9 | idéntica salvo la opción d |
| 22 — traducir Cypher | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 4 · [[Práctica subida por la cátedra\|Práctica subida por la cátedra]] Ej. 8 | otra consulta: amigos a dos o tres saltos de Mary |
| 24 — restricción de tabla → `TRIGGER` | [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 4A | restricción global: `ASSERTION` en el estándar |
| 27 — `ConstructorVIP` | [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 4B | `SUM` sin `COUNT` ni filtro a obras privadas |
| 28 — Cassandra master-slave | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 8d | V/F justificado |
| 32 — cadena `GRANT`/`REVOKE … CASCADE` | [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 6 | `EMPLEADO` y las vistas ES y ESJ |

## Dataset y corridas — vistas y RI en MySQL

Todas las preguntas de vistas con `CHECK OPTION` y de acciones referenciales se recrearon y corrieron
en MySQL 9.7.2:

```sql
CREATE TABLE Movimiento (
  id_usuario VARCHAR(10), moneda VARCHAR(20), fecha DATE,
  tipo CHAR(1), comision DECIMAL(10,2), valor DECIMAL(10,2)
);

CREATE VIEW MovimientoUSDT AS
  SELECT id_usuario, moneda, fecha, tipo, comision, valor
  FROM Movimiento WHERE moneda LIKE '%USDT%';

CREATE VIEW MovUSDTValor AS
  SELECT * FROM MovimientoUSDT WHERE valor < 1200
  WITH LOCAL CHECK OPTION;

CREATE VIEW MovUSDTValorComi AS
  SELECT * FROM MovUSDTValor WHERE comision < 25
  WITH CASCADED CHECK OPTION;
```

```sql
CREATE TABLE Facultad (idFac VARCHAR(10) PRIMARY KEY);
CREATE TABLE Carrera (
  idCarr INT, idFac VARCHAR(10), PRIMARY KEY (idCarr, idFac),
  CONSTRAINT R1 FOREIGN KEY (idFac) REFERENCES Facultad(idFac)
    ON DELETE RESTRICT ON UPDATE RESTRICT
);
CREATE TABLE Materia (
  idM VARCHAR(10) PRIMARY KEY, carrera INT NULL, facultad VARCHAR(10) NULL, nom VARCHAR(30),
  CONSTRAINT R2 FOREIGN KEY (carrera, facultad) REFERENCES Carrera(idCarr, idFac)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
-- Facultad: ('F1'), ('F2') · Carrera: (1,'F1'), (2,'F2'), (1,'F2')
-- Materia: ('M1',1,'F1',…), ('M2',1,'F1',…), ('M3',2,'F2',…)
```

Para MongoDB se usó MongoDB 8.3.11, con la colección
`orders` de la pregunta 6/15 (`laptop`/2/1000, `mouse`/5/50, `laptop`/1/1000, `keyboard`/3/80, con
`payment_method` y `order_date` agregados para poder correr la 15).

---

## Sección A — Vistas con `WITH CHECK OPTION`

### Pregunta 1 — vistas con `WITH CHECK OPTION` en cadena (Opción Múltiple)

Dadas las siguientes definiciones de vistas en MySQL:

```sql
CREATE VIEW MovimientoUSDT AS
SELECT id_usuario, moneda, fecha, tipo, comision, valor
FROM Movimiento
WHERE moneda LIKE '%USDT%';

CREATE VIEW MovUSDTValor AS
SELECT * FROM MovimientoUSDT
WHERE valor < 1200
WITH LOCAL CHECK OPTION;

CREATE VIEW MovUSDTValorComi AS
SELECT * FROM MovUSDTValor
WHERE comision < 25
WITH CASCADED CHECK OPTION;
```

> Para la siguiente sentencia, considerando la existencia de la tabla `Movimiento` y suponiendo que
> está inicialmente vacía y que los datos que se pretende insertar satisfacen las restricciones de
> integridad referencial definidas. Indique si cada operación procede o no:
>
> ```sql
> INSERT INTO MovUSDTValorComi (id_usuario, moneda, fecha, tipo, comision, valor)
> VALUES ('2', 'EURO', to_date('2020-02-02', 'yyyy-MM-dd'), 'E', 20, 1000);
> ```
>
> A. Procede · B. No procede

**Respuesta de la fuente:** solucionario reconstruido y captura del examen real coinciden: **B — No
procede**. El solucionario explica: `MovUSDTValorComi` usa `WITH CASCADED CHECK OPTION`, así que el
`INSERT` debe satisfacer las condiciones de **toda la cadena**, incluyendo `moneda LIKE '%USDT%'` de
la vista base `MovimientoUSDT`, que `'EURO'` no cumple. La captura del examen real muestra que el
alumno marcó "Procede" y fue corregido como incorrecto (`0/2`), con "No procede" señalada como
respuesta correcta.

**Resolución del vault:** corrida real en MySQL 9.7.2:

```sql
INSERT INTO MovUSDTValorComi (id_usuario, moneda, fecha, tipo, comision, valor)
VALUES ('2', 'EURO', '2020-02-02', 'E', 20, 1000);
```

```
ERROR 1369 (HY000): CHECK OPTION failed 'parcial2q2025.MovUSDTValorComi'
```

Coincide exactamente con la fuente: MySQL rechaza el `INSERT` con el error de `CHECK OPTION`
propagado por la cadena `CASCADED`. Consistente con [[1.06.01 - Vistas|Vistas]] § *`WITH CHECK
OPTION`*: *"`CASCADED` (el default) chequea también las vistas subyacentes"*.

> [!figura] lab-check-option
> La cadena `MovimientoUSDT` → `MovUSDTValor` → `MovUSDTValorComi` de las preguntas 1 y 18, precargada: cambie los valores del `INSERT` y vea por qué uno se rechaza y el otro procede.

### Pregunta 18 — `WITH LOCAL CHECK OPTION` con una vista base que no se cumple (Opción Múltiple)

Mismas tres vistas de la Pregunta 1.

> ```sql
> INSERT INTO MovUSDTValor (id_usuario, moneda, fecha, tipo, comision, valor)
> VALUES ('3', 'BITCOIN', to_date('2020-03-03', 'yyyy-MM-dd'), 'S', 30, 700);
> ```
>
> A. Procede · B. No procede

**Respuesta de la fuente:** ambas fuentes coinciden en **A — Procede**. El solucionario: *"La vista de
destino es `MovUSDTValor`, definida con `WITH LOCAL CHECK OPTION`. `LOCAL` solo verifica la condición
local (`valor < 1200`), no las de las vistas base. `700 < 1200` se cumple; no se verifica `moneda LIKE
'%USDT%'`, así que procede aunque `'BITCOIN'` no la satisfaga."* La captura muestra que el alumno
marcó "No procede" y fue corregida como incorrecta; "Procede" está señalada como respuesta correcta.

**Resolución del vault:** (atención) la respuesta A es correcta, pero la justificación del
solucionario (*"`LOCAL` solo verifica la condición local"*) es incorrecta como regla general: se
explica abajo. Corrida real en MySQL 9.7.2 —

```sql
INSERT INTO MovUSDTValor (id_usuario, moneda, fecha, tipo, comision, valor)
VALUES ('3', 'BITCOIN', '2020-03-03', 'S', 30, 700);
```

procede sin error. La fila queda en `Movimiento` pero **no aparece** ni en `SELECT * FROM
MovimientoUSDT` ni en `SELECT * FROM MovUSDTValor` (porque `'BITCOIN'` no matchea `LIKE '%USDT%'`).

Esta corrida por sí sola **no** dice qué chequea `LOCAL` en general: aquí procede porque
`MovimientoUSDT` (la vista subyacente de `MovUSDTValor`) **no tiene `WITH CHECK OPTION` propio**, así
que no hay nada que `LOCAL` deba propagarle. Verificación adicional en MySQL 9.7.2, con vistas de juguete donde la subyacente **sí** tiene su propio WCO:

```sql
CREATE TABLE t (a INT, b INT);
CREATE VIEW v1 AS SELECT * FROM t WHERE a > 0 WITH CHECK OPTION;
CREATE VIEW v2 AS SELECT * FROM v1 WHERE b > 0 WITH LOCAL CHECK OPTION;
INSERT INTO v2 VALUES (-1, 5);
```

```
ERROR 1369 (HY000): CHECK OPTION failed 'corr2q2025verif.v2'
```

`v2` solo declara `LOCAL`, pero el `INSERT` con `a=-1` falla igual porque `v1` tiene su propio WCO. Es
decir: **MySQL 9.7.2 chequea con `LOCAL` la condición propia más las de las vistas subyacentes que
tengan su propio `WITH CHECK OPTION`** — la lectura del estándar SQL, no la versión "`LOCAL` = solo
la propia, nunca las subyacentes" del solucionario. Coincide, de
hecho, con el "razonamiento propio" que ya registra [[1.06.01 - Vistas|Vistas]] § *`CASCADED` vs.
`LOCAL`*: *"en el estándar SQL, `LOCAL` chequea la condición de la vista más las [condiciones de las
vistas subyacentes que tengan su propio WCO]"* — esa página lo marcaba (crítico) como sin verificar en
MySQL; esta corrida lo confirma. Sobre la Pregunta 18 puntual, la respuesta (Procede) sigue siendo
correcta, pero por la razón específica de que `MovimientoUSDT` no tiene WCO propio, no por una regla
general de que `LOCAL` ignore a las vistas subyacentes.

*(nota)* El inciso b del [[Parcial XC-202X|Parcial XC-202X]] § *Pregunta 1* es esta misma pregunta con
otros montos (`25, 800`) y otro umbral (`valor < 1100`): procede y la fila queda invisible en las dos
vistas, por la misma razón.

### Pregunta 11 — vista materializada en MySQL (Verdadero/Falso)

> La vista materializada en MySQL provee un nivel de abstracción, pero NO trae ninguna mejora en la
> performance vs. ejecutar el mismo `SELECT` que la define.
>
> V. Verdadero · F. Falso

**Respuesta de la fuente:** ambas fuentes coinciden en **Falso**. El solucionario: *"Una vista
materializada sí mejora la performance comparada con ejecutar el `SELECT` que la define, porque
almacena los resultados precomputados en disco. Lo que no mejora la performance es una vista normal
(no materializada)."* La captura muestra `1/1`, con "Falso" marcada por el alumno y señalada como
correcta.

**Resolución del vault:** (atención) la respuesta de la fuente (Falso) vale como **teoría general de
SQL** (PostgreSQL, Oracle y SQL Server guardan el resultado y evitan recomputar el `SELECT`), pero en
el motor de la cursada el enunciado se cumple literalmente. MySQL 9.7.2 acepta `CREATE MATERIALIZED
VIEW` sin error ni warning, pero no materializa: la trata como una vista común y recalcula en cada
`SELECT`. Corrida real en MySQL 9.7.2:

```sql
CREATE TABLE t (id INT PRIMARY KEY, val INT);
INSERT INTO t VALUES (1,10),(2,20);
CREATE MATERIALIZED VIEW mv AS SELECT SUM(val) AS s FROM t;   -- sin error ni warning
SELECT * FROM mv;             -- 30
INSERT INTO t VALUES (3,30);
SELECT * FROM mv;             -- 60: recalcula, no guardó el resultado
```

`SHOW CREATE VIEW mv` devuelve `CREATE ALGORITHM=UNDEFINED MATERIALIZED /*(BY ENGINE=UNKNOWN)*/ …
VIEW`, e `information_schema.TABLES` la clasifica con `TABLE_TYPE = VIEW`. En MySQL no hay, entonces,
mejora de performance que medir. La misma verificación está en [[Final 1Dic2023|Final 1Dic2023]] §
*Pregunta 3*. [[1.06.01 - Vistas|Vistas]] § *Virtual vs. materializada* recoge el slide 20 de la
Clase 07 (*"`CREATE MATERIALIZED VIEW` — MySQL no las admite"*): lo que MySQL no admite es la
materialización, no la sintaxis.

Esta pregunta es evidencia para una duda abierta del vault: [[Clase 06 - Vistas-Parte 1]] § *Dudas
abiertas* pregunta *"¿Las vistas materializadas entran en el parcial? Aparecen en los slides 3 y 8 y
MySQL no las soporta."* — en 2025 entraron como pregunta de teoría general (V/F), aunque el motor de
la cursada no las materialice. Es un indicio de 2025, no confirma el parcial del 13/10/2026.

### Pregunta 27 — vista `ConstructorVIP` con agregación: ¿es actualizable? (Ensayo)

> Considerando el siguiente esquema de BD *(`CONSTRUCTOR`, `OBRA`, `EJECUTA`, `OBRA_PRIVADA`,
> `OBRA_CIVIL`, con `OBRA` en jerarquía exclusiva privada/civil)*: definir en MySQL la vista
> `ConstructorVIP` conteniendo el identificador del constructor, la cantidad de obras privadas
> actualmente en ejecución y el monto total de los presupuestos de dichas obras, sólo si superan el
> millón de dólares. ¿La vista es actualizable? Justifique brevemente su respuesta.

**Respuesta de la fuente (solucionario reconstruido):**

```sql
CREATE VIEW ConstructorVIP AS
SELECT
  e.tipo_doc, e.nro_doc,
  COUNT(*) AS cant_obras,
  SUM(e.presupuesto) AS total_presupuesto
FROM EJECUTA e
JOIN OBRA o ON e.id_obra = o.id_obra
JOIN OBRA_PRIVADA op ON o.id_obra = op.id_obra
WHERE o.anio_finalizacion IS NULL
GROUP BY e.tipo_doc, e.nro_doc
HAVING SUM(e.presupuesto) > 1000000;
```

*No, no es actualizable*, porque contiene funciones de agregación (`COUNT`, `SUM`), `GROUP BY` y
`HAVING`, además de `JOIN` entre varias tablas: no hay correspondencia 1 a 1 entre filas de la vista y
de las tablas base. Puntaje real de esta pregunta en la captura: `4/8` (parcial — probablemente por la
consulta, con la justificación de actualizabilidad completa).

**Resolución del vault:** corrida real en MySQL 9.7.2 con datos de juguete (`OBRA`/`EJECUTA`
con una obra privada de presupuesto `1.500.000` y otra civil de `2.000.000`):

```sql
SELECT * FROM ConstructorVIP;
-- tipo_doc | nro_doc | cant_obras | total_presupuesto
-- CUI      | 1       | 1          | 1500000.00

INSERT INTO ConstructorVIP (tipo_doc, nro_doc, cant_obras, total_presupuesto)
VALUES ('CUI', 2, 1, 1200000);
```

```
ERROR 1471 (HY000): The target table ConstructorVIP of the INSERT is not insertable-into
```

Confirma la fuente y [[1.06.01 - Vistas|Vistas]] § *Resumen general*: *"vistas σ-π (una tabla) o
σ-π-⋈ (joins por FK → PK) que conservan la clave primaria, sin agregación (...); con join, cada
sentencia solo puede tocar la tabla que preserva la clave"* — `ConstructorVIP` tiene `GROUP BY` +
funciones de agregación, así que no preserva clave y MySQL la rechaza explícitamente como no
insertable (`ERROR 1471`, registrado también en [[1.06.01 - Vistas|Vistas]] § *En los exámenes*).

*(nota)* El Ejercicio 4B del [[Parcial 2Q-2023|Parcial 2Q-2023]] pide la misma vista
(`SUM(presupuesto) > 1000000`, sin `COUNT` ni el filtro a obras privadas) y llega a la misma
conclusión; corrida en MySQL 9.7.2: `ERROR 1288` en `UPDATE`/`DELETE` y `ERROR 1471` en `INSERT`.

### Pregunta 16 — consulta MySQL con `COALESCE` sobre jerarquía exclusiva `OBRA_PRIVADA`/`OBRA_CIVIL` (Ensayo)

> Considerando el siguiente esquema de BD *(el mismo `CONSTRUCTOR`/`OBRA`/`EJECUTA`/`OBRA_PRIVADA`/
> `OBRA_CIVIL` de la Pregunta 27, con `OBRA` en jerarquía exclusiva privada/civil)*: provea una
> consulta en MySQL que devuelva una lista con los datos de aquellas obras en ejecución junto con una
> columna denominada `Resp_obra` donde figure el arquitecto o ingeniero responsable de la obra, según
> sea su tipo.

**Respuesta de la fuente (solucionario reconstruido):** una solución posible con `LEFT JOIN` sobre las
dos tablas hijas y `COALESCE` para elegir el responsable según el tipo:

```sql
SELECT
    o.id_obra, o.superficie, o.direccion, o.anio_inicio, o.tipo_o,
    COALESCE(op.arquitecto, oc.ingeniero_resp) AS Resp_obra
FROM OBRA o
LEFT JOIN OBRA_PRIVADA op ON o.id_obra = op.id_obra
LEFT JOIN OBRA_CIVIL oc ON o.id_obra = oc.id_obra
WHERE o.anio_finalizacion IS NULL; -- "en ejecución"
```

Alternativa con `UNION` (una rama por cada `JOIN` a la tabla hija, sin `LEFT JOIN` ni `COALESCE`):

```sql
SELECT o.id_obra, o.superficie, o.direccion, o.anio_inicio, o.tipo_o, op.arquitecto AS Resp_obra
FROM OBRA o JOIN OBRA_PRIVADA op ON o.id_obra = op.id_obra
WHERE o.anio_finalizacion IS NULL
UNION
SELECT o.id_obra, o.superficie, o.direccion, o.anio_inicio, o.tipo_o, oc.ingeniero_resp AS Resp_obra
FROM OBRA o JOIN OBRA_CIVIL oc ON o.id_obra = oc.id_obra
WHERE o.anio_finalizacion IS NULL;
```

Captura del examen real: `0/5` (ensayo, corrección manual, sin ver el texto del alumno). La versión
con imágenes del reconstruido (`Parcial_BDII_2Q2025_reconstruido.pdf`, p. 6 — ver § *Fuente*) muestra
además una consulta tipeada por quien la completó: `SELECT o.*, CASE WHEN op.id_obra IS NOT NULL THEN
op.arquitecto WHEN oc.id_obra IS NOT NULL THEN oc.ingeniero_resp ELSE NULL END AS Resp_obra FROM OBRA
o LEFT JOIN OBRA_PRIVADA op ON o.id_obra = op.id_obra LEFT JOIN OBRA_CIVIL oc on oc.id_obra =
o.id_obra` — la misma idea de `CASE`/`COALESCE` sobre el mismo `LEFT JOIN`, pero **sin el `WHERE
o.anio_finalizacion IS NULL`** que pide el enunciado ("obras en ejecución"); probable causa de que no
sea la respuesta que se puntuó con crédito.

**Resolución del vault:** corrida real en MySQL 9.7.2, con el esquema
completo de la Pregunta 27 y datos de juguete (obra 1: privada, en ejecución, arquitecto `Arq1`; obra
2: civil, en ejecución, ingeniero `Ing2`; obra 3: privada, ya finalizada, sin registro en
`OBRA_PRIVADA`/`OBRA_CIVIL` en esta corrida):

```sql
SELECT o.id_obra, o.superficie, o.direccion, o.anio_inicio, o.tipo_o,
       COALESCE(op.arquitecto, oc.ingeniero_resp) AS Resp_obra
FROM OBRA o
LEFT JOIN OBRA_PRIVADA op ON o.id_obra = op.id_obra
LEFT JOIN OBRA_CIVIL oc ON o.id_obra = oc.id_obra
WHERE o.anio_finalizacion IS NULL;
```

```
id_obra | superficie | direccion          | anio_inicio | tipo_o | Resp_obra
1       | 1500.00    | Calle Falsa 123    | 2024        | P      | Arq1
2       | 2000.00    | Av Siempreviva 742 | 2023        | C      | Ing2
```

Confirma la consulta del solucionario: la obra 3 (finalizada) queda fuera por el `WHERE`, y `COALESCE`
toma `arquitecto` para la obra privada (1) e `ingeniero_resp` para la civil (2), sin necesitar `CASE`.
Consistente con [[1.05.01 - SQL — consultas|SQL — consultas]] y con la técnica de `LEFT JOIN` +
`COALESCE` para resolver jerarquías exclusivas (subtipos disjuntos de una tabla padre), el mismo
patrón `OBRA_PRIVADA`/`OBRA_CIVIL` de la Pregunta 27.

---

## Sección B — Integridad referencial y acciones referenciales

Las tres preguntas de este bloque comparten el mismo esquema:

> R1: `Carrera(idFac) ≪ Facultad(idFac)`: `[restrict, restrict]`
> R2: `Materia(carrera, facultad) ≪ Carrera(idCarr, idFac)`: `[restrict, cascade]`
> *Nota: respecto de la RIR R2, suponga que los atributos `carrera` y `facultad` admiten nulos.*
>
> | `Materia` | idM | carrera | facultad | nom |
> | --- | --- | --- | --- | --- |
> | | M1 | 1 | F1 | nom1 |
> | | M2 | 1 | F1 | nom2 |
> | | M3 | 2 | F2 | nom3 |
>
> | `Carrera` | idCarr | idFac |
> | --- | --- | --- |
> | | 1 | F1 |
> | | 2 | F2 |
> | | 1 | F2 |
>
> | `Facultad` | idFac |
> | --- | --- |
> | | F1 |
> | | F2 |

### Pregunta 17 — `UPDATE` sobre `Carrera` (Opción Múltiple)

> `UPDATE carrera SET idFac = 'F1' WHERE idFac = 'F2';`
>
> A. Procede · B. No procede por RIR R1 · C. No procede por RIR R2 · D. No procede por restricción
> de unicidad · E. No procede por restricción de integridad referencial

**Respuesta de la fuente:** ambas fuentes coinciden en **D — No procede por restricción de unicidad**.
El solucionario: *"Si se ejecutara el `UPDATE`, `Carrera` quedaría con dos filas con `idFac='F1'`: la
fila `(1,F1)` existente y la fila `(1,F2)` que pasaría a `(1,F1)`. Viola la unicidad de la PK
`(idCarr, idFac)`."* La captura muestra que el alumno marcó "No procede por RIR R2" y fue corregido
como incorrecto; "No procede por restricción de unicidad" está señalada como correcta.

**Resolución del vault:** corrida real —

```sql
UPDATE Carrera SET idFac='F1' WHERE idFac='F2';
```

```
ERROR 1062 (23000): Duplicate entry '1-F1' for key 'Carrera.PRIMARY'
```

Confirma exactamente la fuente: el error real de MySQL es de clave primaria duplicada, no de FK. Es
una trampa deliberada de la pregunta —dos RIR en el enunciado invitan a responder "No procede por RIR
R1/R2"— cuando el motivo real es una restricción distinta, la unicidad de la PK compuesta de
`Carrera`. No hay concepto dedicado a esta interacción en el vault; se sostiene con
[[1.03.02 - DDL — creación y alteración de tablas|DDL]] § *`PRIMARY KEY`* (unicidad de la clave) y
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] (para descartar
R1 y R2 como causa).

### Pregunta 19 — `INSERT` en `Materia` con un componente `NULL` (Opción Múltiple)

> `INSERT INTO Materia (idM, carrera, facultad, nom) VALUES ('M4', 3, null, 'nom4');`
>
> A. Procede · B. No procede por RIR R1 · C. No procede por RIR R2 · D. Procede con MATCH simple ·
> E. Procede con MATCH parcial · F. Procede con MATCH full · G. No procede por restricción de
> unicidad

**Respuesta de la fuente:** ambas fuentes coinciden en **D — Procede con MATCH simple**. El
solucionario: *"La RIR R2 referencia `Carrera(idCarr, idFac)`. Como `facultad` es `NULL`, bajo la
regla `MATCH simple` (default en el estándar y en MySQL) la verificación de integridad referencial se
considera satisfecha sin verificar el otro atributo. Procede sin necesidad de buscar `(3, null)` en
`Carrera`."* La captura muestra que el alumno marcó "Procede" (sin letra específica resaltada) y fue
corregido como incorrecto; "Procede con MATCH simple" está señalada como correcta.

**Resolución del vault:** corrida real —

```sql
INSERT INTO Materia (idM, carrera, facultad, nom) VALUES ('M4', 3, null, 'nom4');
```

procede sin error (la fila queda insertada con `carrera=3, facultad=NULL`), aun cuando `idCarr=3` **no
existe** en `Carrera` (que solo tiene `idCarr` 1 y 2). Coincide exactamente con
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] § *Tipos de
matching* § *La tabla de decisión*, fila `(C, null)`: *"`SIMPLE` ✓ / `PARTIAL` ✗ / `FULL` ✗ — mezcla;
`TipoA='C'` no aparece"* — con un nulo alcanza para que `SIMPLE` (el único que MySQL implementa: acepta
`MATCH FULL` y `MATCH PARTIAL` sin error ni warning, pero los ignora — `SHOW CREATE TABLE` omite la
cláusula y, con `MATCH FULL`, un `INSERT` de `(2, 9, NULL)` procede igual; verificado en MySQL 9.7.2) dé por satisfecha la referencia, sin que
`carrera=3` necesite existir en `Carrera`. Esta pregunta también **resuelve, en parte,** la duda
(crítico) de [[Clase 09 - Restricciones integridad-Parte 1]] § *Dudas abiertas*: *"¿El parcial toma la
sintaxis del estándar o la de MySQL? `MATCH FULL/PARTIAL` no existen en MySQL"* — el parcial 2Q2025
pregunta por `MATCH simple/parcial/full` como **teoría del estándar** aplicada sobre una tabla creada
en MySQL, confirmando la hipótesis del vault de que la cátedra pide las dos capas (concepto del
estándar + comportamiento real del motor).

### Pregunta 30 — `DELETE` sobre `Carrera` (Opción Múltiple)

> `DELETE FROM Carrera WHERE idCarr = 2;`
>
> A. Procede · B. No procede por RIR R1 · C. No procede por RIR R2

**Respuesta de la fuente:** ambas fuentes coinciden en **C — No procede por RIR R2**. El solucionario:
*"R2 es `[restrict, cascade]`: la acción ante baja es `restrict`. Existen filas en `Materia` que
referencian a `Carrera(idCarr=2, idFac=F2)` (la fila M3), así que `restrict` impide eliminar la fila
padre."* La captura muestra que el alumno marcó "No procede por RIR R1" y fue corregido como
incorrecto; "No procede por RIR R2" está señalada como correcta.

**Resolución del vault:** corrida real —

```sql
DELETE FROM Carrera WHERE idCarr = 2;
```

```
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails
(`parcial2q2025`.`Materia`, CONSTRAINT `R2` FOREIGN KEY (`carrera`, `facultad`)
REFERENCES `Carrera` (`idCarr`, `idFac`) ON DELETE RESTRICT ON UPDATE CASCADE)
```

Confirma la fuente: el error real de MySQL nombra explícitamente `R2` como la restricción que falla.
Consistente con [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]]
§ *Las cinco acciones referenciales*: `RESTRICT`/`NO ACTION` rechazan la baja si queda alguna fila
referenciante — acá `M3` referencia exactamente a `(2, F2)`.

> [!figura] lab-acciones-referenciales
> El esquema `Facultad`/`Carrera`/`Materia` de las preguntas 17, 19 y 30, para probar variantes.

---

## Sección C — EXPLAIN, plan de ejecución e índices

### Pregunta 2 — `EXPLAIN ANALYZE` en MySQL (Verdadero/Falso)

> En MySQL, el `EXPLAIN ANALYZE <sql>` muestra los tiempos de planificación, pero no ejecuta la
> sentencia `<sql>`.
>
> V. Verdadero · F. Falso

**Respuesta de la fuente:** ambas fuentes coinciden en **Falso**. El solucionario: *"`EXPLAIN ANALYZE`
en MySQL ejecuta efectivamente la sentencia y muestra los tiempos reales de planificación y
ejecución. Lo que no ejecuta la sentencia es `EXPLAIN` (sin `ANALYZE`), que solo muestra el plan
estimado."* Captura: `1/1`, "Falso" marcada y correcta.

**Resolución del vault:** sin discrepancia. [[1.08.01 - Plan de ejecución|Plan de ejecución]] §
*`EXPLAIN` vs. `EXPLAIN ANALYZE`* lo documenta en los mismos términos: *"`EXPLAIN ANALYZE` (explica y
ejecuta): corre la consulta de verdad y agrega los números reales"*, con la advertencia (atención)
propia de esa página: *"Un `EXPLAIN ANALYZE DELETE …` borra."* No corrida aparte: es exactamente el
comportamiento que ya está verificado en esa página del vault.

### Pregunta 12 — lectura de un `EXPLAIN` (Opción Múltiple, varias correctas)

> ¿A qué se puede deber la siguiente salida al ejecutar el `EXPLAIN`:
>
> | Operation | Rows | Total Cost | Raw Desc |
> | --- | --- | --- | --- |
> | Nested Loops (Nested loop inner join) | 4 | 2.05 | |
> | Full Scan (Table scan) *(tabla: `inscripto`)* | 4 | 0.65 | |
> | Unique Index Scan (Single-row index lookup) *(tabla: `materia`)* | 1 | 0.275 | `codigo=inscripto.codigo` |
>
> sobre la siguiente consulta en MySQL?
>
> ```sql
> SELECT * FROM materia INNER JOIN inscripto ON materia.codigo = inscripto.codigo;
> ```
>
> A. `codigo` en Materia es PK · B. `codigo` en Inscripto es PK · C. `codigo` en Materia tiene un
> índice UNIQUE · D. `codigo` en Inscripto tiene un índice UNIQUE · E. Ninguna de las opciones

**Respuesta de la fuente:** ambas fuentes coinciden en **A y C**. El solucionario: *"El plan muestra un
`Unique Index Scan` sobre `materia` con 1 fila estimada: solo es posible si `codigo` en `materia`
tiene un índice único, ya sea porque es PK (que implica índice único automáticamente) o porque tiene
un `UNIQUE` explícito. Sobre `inscripto` se hace `Full Scan`, descartando que `codigo` sea PK o
`UNIQUE` en esa tabla."* Captura: `0/4` (crédito parcial y negativo). La plataforma marca A y C como
"Respuesta correcta" **sin ícono de selección** (el alumno no las marcó) y D como "Incorrecta" (sí
marcada por el alumno, `-33,33%`); B no aparece marcada. El alumno marcó **únicamente D**, sin marcar
A ni C — con solo D marcada la penalización de `-33,33%` explica el `0/4` (el sistema no da puntaje
negativo neto).

**Resolución del vault:** corrida real en MySQL 9.7.2, con `materia(codigo INT PRIMARY KEY, nombre)`
cargada con 2000 filas, `inscripto(legajo, codigo)` con 4 filas y `ANALYZE TABLE` sobre las dos:

```
EXPLAIN FORMAT=TREE SELECT * FROM materia INNER JOIN inscripto ON materia.codigo = inscripto.codigo;

-> Nested loop inner join  (cost=2.05 rows=4)
    -> Filter: (inscripto.codigo is not null)  (cost=0.65 rows=4)
        -> Table scan on inscripto  (cost=0.65 rows=4)
    -> Single-row index lookup on materia using PRIMARY (codigo = inscripto.codigo)  (cost=0.275 rows=1)
```

Son las mismas cifras del examen (2.05, 0.65, 0.275; 4, 4 y 1 filas). Con `codigo` como `UNIQUE` en
lugar de PK (`NOT NULL` o nullable) sale el mismo plan, `using uq` en vez de `using PRIMARY`: el
motor confirma A y C. (nota) Con tablas muy chicas el optimizador elige otro plan: con 3 filas en
`materia` da `Inner hash join` con `Table scan` en las dos tablas. Consistente con
[[1.08.01 - Plan de ejecución|Plan de ejecución]] y [[1.08.02 - Índices|Índices]]: un *"Unique Index
Scan (Single-row index lookup)"* con `Rows: 1` es la marca de un acceso por clave única —PK o
`UNIQUE`—, mientras que un *"Full Scan (Table scan)"* descarta cualquier índice utilizable del lado de
`inscripto` para esa condición. La distinción PK-vs-`UNIQUE` (A y C, no solo A) es la trampa: ambas
producen el mismo plan, así que el plan por sí solo no permite descartar ninguna de las dos.

---

## Sección D — `CHECK`, `ASSERTION` y triggers

### Pregunta 24 — restricción de tabla: SQL estándar vs. MySQL (Opción Múltiple)

> Si tuvieras que especificar una restricción de tabla, ¿cómo lo implementarías teniendo en cuenta SQL
> estándar primero y luego MySQL?
>
> A. 1. CHECK 2. CHECK · B. 1. CHECK 2. ASSERTION · C. 1. ASSERTION 2. CHECK · D. 1. CHECK 2. TRIGGER
> · E. 1. TRIGGER 2. TRIGGER

**Respuesta de la fuente:** ambas fuentes coinciden en **D — 1. CHECK 2. TRIGGER**. El solucionario:
*"En SQL estándar, las restricciones de tabla se implementan con `ASSERTION` o `CHECK` con
subconsultas. En MySQL, los `CHECK` a nivel de tabla con subconsultas no se aplican, por lo cual se
implementa con `TRIGGER`."* Captura: `0/2`, alumno marcó "1. ASSERTION 2. CHECK" (incorrecto); D
señalada como correcta.

**Resolución del vault:** coincide exactamente con
[[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] § *Los cuatro niveles*, fila
**tabla**: *"varias filas de la misma tabla → `CHECK` de tabla (con subconsulta) → ningún motor lo
soporta → de ámbito tabla para arriba se va a triggers"*. El resumen de esa página lo dice en una
frase: *"como ningún motor admite subconsultas en un `CHECK` ni assertions, de tabla para arriba se
va a triggers."* No hay discrepancia; la pregunta pide exactamente lo que esa página documenta como
su regla central.

### Pregunta 25 — `CHECK` de tabla sobre `Empleado` (Ensayo)

> Imagine que tiene una tabla `Empleado` en MySQL y alguien agrega posteriormente a la creación la
> siguiente restricción:
>
> ```sql
> ALTER TABLE Empleado ADD CONSTRAINT chk_sueldo_comision
> CHECK ((sueldo > 5000 AND comision = 0) OR (sueldo <= 5000));
> ```
>
> 1. ¿Podría indicar qué hace la siguiente restricción? · 2. ¿De qué tipo es? · 3. ¿Aplica a datos ya
> almacenados o solo a datos que se inserten luego de haber creado la restricción?

**Respuesta de la fuente (solucionario reconstruido):** 1. Exige que se cumpla `sueldo > 5000 AND
comision = 0`, o `sueldo <= 5000` (con cualquier comisión): en otras palabras, los empleados con
sueldo mayor a 5000 no pueden cobrar comisión. 2. Es una restricción `CHECK` a nivel de tabla,
declarada con `ALTER TABLE … ADD CONSTRAINT`. 3. Sí aplica a datos ya almacenados: MySQL verifica los
datos existentes al crear el `CHECK`, y si alguno lo viola, falla la creación de la restricción; una
vez creada, también aplica a los registros futuros. Captura: `4/7` (crédito parcial en la corrección
manual).

**Resolución del vault:** corrida real —

```sql
INSERT INTO Empleado VALUES (1, 6000, 500);  -- viola la futura restricción
ALTER TABLE Empleado ADD CONSTRAINT chk_sueldo_comision
CHECK ((sueldo > 5000 AND comision = 0) OR (sueldo <= 5000));
```

```
ERROR 3819 (HY000): Check constraint 'chk_sueldo_comision' is violated.
```

Al borrar la fila conflictiva, el `ALTER TABLE` se ejecuta sin error, y un `INSERT` posterior que
viola la condición (`7000, 100`) también falla con el mismo error. Confirma exactamente el punto 3 del
solucionario: MySQL valida los datos existentes al crear un `CHECK` (a diferencia de un `TRIGGER`, que
solo actúa sobre operaciones futuras). Consistente con
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] § *En MySQL*
(tabla de soporte de MySQL/InnoDB frente al estándar) y con
[[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] para la clasificación de nivel
(fila, porque relaciona dos columnas de la misma fila, `sueldo` y `comision`, sin cruzar tablas ni
filas — la pregunta la llama "restricción de tabla" en sentido amplio de "restricción declarada con
`ALTER TABLE`", pero por el criterio de esa página es de **nivel fila**, no de nivel tabla).

---

## Sección E — Privilegios

### Pregunta 32 — cadena de `GRANT`/`REVOKE … CASCADE` en SQL estándar (Ensayo)

> *U0 es admin; `Cliente` es una tabla; `CS`: `ClienteSub-30`, `CSV`: `ClienteSub-30Vip`, ambas son
> vistas.*
>
> ```sql
> U0: GRANT SELECT ON CS, CSV TO U1;
> U0: GRANT INSERT, UPDATE ON CLIENTE TO U1 WITH GRANT OPTION;
> U0: UPDATE CS SET Tipo = "Vip" WHERE Nombre = "Esteban Gonzalez";
> U0: GRANT SELECT ON CLIENTE TO U1, U2 WITH GRANT OPTION;
> U1: GRANT SELECT ON CLIENTE TO U3 WITH GRANT OPTION;
> U3: GRANT SELECT ON CLIENTE TO U2;
> U0: GRANT SELECT ON CSV TO U2;
> U1: REVOKE SELECT ON CLIENTE FROM U3 CASCADE;
> ```
>
> Decir cuáles son los privilegios y sobre qué objetos los conservan U0, U1, U2 y U3 al final.

**Respuesta de la fuente (solucionario reconstruido):** estado final —
- **U0** (admin): conserva todos los privilegios sobre todos los objetos.
- **U1:** `SELECT` sobre `CS` y `CSV`; `INSERT`/`UPDATE` sobre `CLIENTE` con WGO; `SELECT` sobre
  `CLIENTE` con WGO.
- **U2:** `SELECT` sobre `CLIENTE` con WGO (**directo de U0**, cadena independiente); `SELECT` sobre
  `CSV`.
- **U3:** ningún privilegio — su único `SELECT` sobre `CLIENTE` venía de U1 (paso 5) y se revocó en
  cascada en el paso 8; el que U3 le había pasado a U2 (paso 6) también cae, pero U2 conserva el suyo
  porque lo recibió **directamente** de U0 en el paso 4, una concesión independiente.

Captura: `6/6` — puntaje completo, la única pregunta de ensayo de todo el examen con crédito total.

**Resolución del vault:** consistente con
[[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] § *`REVOKE` y `FLUSH
PRIVILEGES`*: *"El estándar cierra todo `REVOKE` con `CASCADE` o `RESTRICT` (GMUW 10.1.6; Date
17.6)"* — y la pregunta lo pide explícitamente **en SQL estándar**, no en MySQL, donde esa página
documenta como (crítico) que *"`REVOKE` no cascadea en MySQL: `CASCADE` es error de sintaxis y la
revocación nunca se propaga"*. No hay discrepancia porque el enunciado ya distingue las dos capas. El
punto fino que separa U2 de U3 —dos concesiones independientes del mismo privilegio, una directa de
U0 y otra vía U3, y que revocar la segunda no toca la primera— es la aplicación práctica de que el
grafo de permisos del estándar (que [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y
roles]] describe con *"un nodo por (usuario, privilegio)"*) tiene una arista por cada concesión, no
una por usuario.

---

## Sección F — Teorema CAP y arquitecturas distribuidas

### Pregunta 3 — CAP con lecturas y escrituras en todos los nodos (Opción Múltiple)

> Suponga que tiene una base de datos distribuida en varios nodos y todos los nodos aceptan lecturas y
> escrituras. ¿En qué situación del teorema CAP estaríamos?
>
> A. CP · B. AP · C. CA · D. Ninguna de las anteriores

**Respuesta de la fuente:** ambas fuentes coinciden en **B — AP**. El solucionario: *"Si todos los
nodos aceptan lecturas y escrituras, se prioriza Disponibilidad y Tolerancia a particiones,
sacrificando la consistencia inmediata (dos nodos pueden tener datos diferentes en un instante dado:
consistencia eventual)."* Captura: `1/1`, "AP" marcada y correcta.

**Resolución del vault:** consistente con [[2.12.04 - Teorema CAP|Teorema CAP]] § *Qué es*: *"la
decisión real es qué hacer bajo partición: responder con datos posiblemente viejos (A) o dejar de
responder hasta garantizar el dato correcto (C)"*. Un sistema donde **todos** los nodos aceptan
lecturas y escrituras sin coordinación central es, por definición, uno que prioriza disponibilidad
sobre consistencia inmediata (AP), tal como describe esa página en su tabla de combinaciones
(*"AP: disponible; ante partición, responde datos viejos y converge"*).

### Pregunta 10 — ¿MongoDB es AP? (Verdadero/Falso)

> MongoDB es AP según el teorema CAP.
>
> V. Verdadero · F. Falso

**Respuesta de la fuente:** ambas fuentes coinciden en **Falso**. El solucionario: *"MongoDB es
generalmente considerado CP: ante una partición de red, los secundarios no aceptan escrituras y solo
el primario lo hace. Si el primario cae, hay un período sin escrituras hasta elegir otro."* Captura:
`1/1`, "Falso" marcada y correcta.

**Resolución del vault:** sin discrepancia — coincide con
[[2.12.04 - Teorema CAP|Teorema CAP]] § *5 · En el motor de la cursada: MongoDB*: *"MongoDB es CP por
defecto (escrituras y lecturas al primario); AP si se leen secundarios"* y con el slide 18 del deck
(*"CP"* para MongoDB), que la propia página adopta como respuesta del parcial. (nota) Es un indicio de 2025 para
la duda abierta de [[Clase 12 - Introduccion a NoSQL]] § *Dudas abiertas* (*"¿En qué esquina de CAP
van MongoDB y Redis en el parcial?"*): en 2025 la plataforma tomó la clasificación del deck (CP), no
la de Corbellini. No fija qué toma el parcial del 13/10/2026; la duda sigue abierta allí y en
[[2.12.04 - Teorema CAP|Teorema CAP]].

### Pregunta 13 — bases de datos en configuración CA (Opción Múltiple, varias correctas)

> Elija ejemplos de las bases de datos vistas en clase que funcionan bajo la configuración CA.
>
> A. MySQL · B. Neo4j · C. Cassandra · D. MongoDB · E. Ninguna de las opciones

**Respuesta de la fuente:** ambas fuentes coinciden en **A y B (MySQL y Neo4j)**. El solucionario:
*"MySQL y Neo4j, en su configuración estándar (no distribuida), priorizan Consistencia y
Disponibilidad. Cassandra es AP y MongoDB es CP, así que no aplican como ejemplos de CA."* Captura:
`1/3` (crédito parcial y negativo), A y B marcadas como correctas (`50%` cada una), C y D marcadas por
el alumno como incorrectas (`-33,33%` cada una).

**Resolución del vault:** (atención) discrepancia parcial. Para **MySQL**, no hay problema:
[[2.12.04 - Teorema CAP|Teorema CAP]] § *4.2 · Slide 18* lista **MySQL y PostgreSQL** en la columna
CA, textual del deck de la cursada. Para **Neo4j** la respuesta es menos sólida de lo que el
solucionario da a entender: el slide 18 del propio deck (la fuente que el resto de la página usa como
autoridad para "la respuesta que toma el parcial") **no incluye a Neo4j** en ninguna de sus tres
columnas — solo MySQL/PostgreSQL (CA), HBase/MongoDB/Redis/Memcache (CP) y Riak/Cassandra/CouchDB/
DynamoDB (AP). Y la bibliografía obligatoria se contradice a sí misma sobre Neo4j:
[[2.12.04 - Teorema CAP|Teorema CAP]] § *4.3* documenta que **Seven Databases A2** lo pone en **CA**
(no distribuido) pero su **cap. 6 § *Neo4j on CAP*** dice que *"Neo4j HA es AP y eventualmente
consistente"* — *"el libro se contradice"*, en palabras de esa misma página. La respuesta B como "correcta" no está en ningún slide citado por el vault, pero tampoco carece de respaldo: *Seven Databases* A2 pone a Neo4j en CA como
instancia única, y el Ejercicio 3 del [[Parcial XC-202X|Parcial XC-202X]] trae un criterio de
estudiante de tres casos (instancia única → CA, HA → AP, distribuido con particiones → CP) que explica
por qué esta pregunta (instancia sin distribuir) y la Pregunta 4 (clúster HA) piden esquinas distintas
del mismo motor. (atención) El caso CP de ese criterio no aparece en ninguna fuente del vault.

### Pregunta 33 — coordinación de nodos delegada a una herramienta externa (Opción Múltiple)

> ¿Cuál de las siguientes bases delega el mecanismo de coordinación de nodos en una herramienta
> externa? Por ejemplo, el reemplazo de nodo maestro caído por un nodo esclavo preparado.
>
> A. MySQL · B. Cassandra · C. Neo4j · D. MongoDB · E. Ninguna de las opciones

**Respuesta de la fuente:** ambas fuentes coinciden en **C — Neo4j**. El solucionario: *"Neo4j (en su
modalidad clásica HA / Causal Cluster) delega buena parte de la coordinación de elección de líder y
reemplazo de nodos en herramientas externas (originalmente Apache ZooKeeper; en versiones más
recientes, el protocolo Raft propio del Causal Cluster). Cassandra y MongoDB tienen mecanismos
internos (gossip / replica set elections), y MySQL tradicional tampoco delega esa coordinación."*
Captura: `2/2`, "Neo4j" marcada y correcta.

**Resolución del vault:** *(tema no dictado aún)* — Neo4j se dicta recién el 19–20/10/2026 según
[[_cronograma]]. La atribución a **Apache ZooKeeper** sí está verificada contra la bibliografía
obligatoria: Seven Databases 2ª ed. cap. 6, *Day 3: Distributed High Availability*, impresa 203 (PDF
214): *"Previously, Neo4j clusters relied on ZooKeeper as an external coordination mechanism, which
worked well but required a lot of additional administration [...] Now, Neo4j clusters are
self-managing and self-coordinating."* Confirma que ZooKeeper fue, en versiones anteriores de Neo4j
HA, el mecanismo externo de coordinación de nodos que pide el enunciado — aunque el propio libro
aclara que versiones más recientes ya no lo necesitan (coherente con la aclaración "Raft propio del
Causal Cluster" del solucionario). Lo que sí es consistente con lo ya documentado sin depender de esa
cita: [[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini § 5.2, p. 13]] describe a
**Cassandra** como arquitectura *peer-to-peer* con coordinación interna por *gossip protocol*, y
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] § *3.3 ·
Failover* describe a **MongoDB** con elecciones de réplica internas (*replica set elections*,
mecanismo propio del *replica set*) — lo que descarta B y D por el mismo argumento que el
solucionario, con respaldo directo en el vault.

### Pregunta 4 — Neo4j HA: propagación de escrituras (Ensayo)

> Imagine en ambiente HA en Neo4j, donde se levantan 3 nodos:
>
> ```
> $ neo4j-1.local/bin/neo4j start
> $ neo4j-2.local/bin/neo4j start
> $ neo4j-3.local/bin/neo4j start
> ```
>
> Se ingresa al shell del servidor 2 y se ejecuta lo siguiente:
>
> ```
> $ neo4j-2.local/bin/cypher-shell
> neo4j> CREATE (p:Person {name: "Homero"});
> neo4j> :exit
> ```
>
> Se ingresa al servidor 3 y se ejecuta lo siguiente:
>
> ```
> $ neo4j-3.local/bin/cypher-shell
> neo4j> CREATE (p:Person {name: "Bart"});
> neo4j> MATCH (n) RETURN n;
> ```
>
> ¿Cuál es el resultado del query?

**Respuesta de la fuente (solucionario reconstruido):** se devuelven **ambos** nodos —
`Person{name:"Homero"}` y `Person{name:"Bart"}`. En un clúster HA de Neo4j, las escrituras se
propagan a todos los nodos: al crear a Homero en el nodo 2, se replica a 1 y 3; el `MATCH` ejecutado
en el nodo 3 ve ambos, ya almacenados localmente. Captura: `3/3` — puntaje completo.

**Resolución del vault:** *(tema no dictado aún)* — sin página propia de Neo4j en el vault (no está
en la lista canónica de `wiki/motores/`). El escenario es casi literal el ejemplo de **Seven Databases
2ª ed. cap. 6**, *Day 3: Distributed High Availability* (impresas 204–205, PDF 215–216): el libro
arranca tres nodos (`$ neo4j-1.local/bin/neo4j start`, ídem `-2` y `-3`), crea un nodo en el shell de
uno (`$ neo4j-1.local/bin/cypher-shell`, `CREATE (p:Person {name: "Weird Al Yankovic"});`) y lo lee
desde otro nodo (`MATCH (n) RETURN n;`), confirmando: *"Our data has been successfully replicated
across nodes."* — el mismo patrón que pregunta el examen (escribir en un nodo, leer en otro y ver el
dato replicado), con dos escrituras en vez de una. El libro agrega una salvedad que ni el solucionario
ni este vault verifican con una corrida propia (no verificado en el motor): el clúster HA descrito *"is only eventually consistent"* (impresa 206) — así que, en
rigor, nada garantiza que la propagación entre el nodo 2 y el nodo 3 haya terminado en el instante
exacto del `MATCH`; la respuesta del solucionario (se ven ambos nodos) es la lectura de manual del
libro, no una garantía absoluta de un HA eventualmente consistente. *(atención)* Consistente además
con el modelo general de
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] (una
escritura aceptada en un nodo se propaga al resto del clúster antes de considerarse durable), aunque
esa página no cubre Neo4j específicamente.

---

## Sección G — MongoDB

### Pregunta 6 — MapReduce en MongoDB (Ensayo)

> Supongamos una colección `orders` en una instancia de MongoDB:
>
> ```
> {"_id": 1, "product": "laptop", "quantity": 2, "price": 1000}
> {"_id": 2, "product": "mouse", "quantity": 5, "price": 50}
> {"_id": 3, "product": "laptop", "quantity": 1, "price": 1000}
> {"_id": 4, "product": "keyboard", "quantity": 3, "price": 80}
> ```
>
> Calcular el total vendido por `product` usando la estrategia Map-Reduce.

**Respuesta de la fuente (solucionario reconstruido):**

```javascript
db.orders.mapReduce(
  function() { emit(this.product, this.quantity * this.price); },
  function(key, values) { return Array.sum(values); },
  { out: "total_por_producto" }
);
```

Resultado esperado: `laptop: 2·1000 + 1·1000 = 3000` · `mouse: 5·50 = 250` · `keyboard: 3·80 = 240`.
Captura: `0/4` (ensayo, corrección manual — no se ve el texto que escribió el alumno).

**Resolución del vault:** corrida real en MongoDB 8.3.11:

```javascript
db.orders.mapReduce(
  function() { emit(this.product, this.quantity * this.price); },
  function(key, values) { return Array.sum(values); },
  { out: "total_por_producto" }
);
db.total_por_producto.find().sort({_id:1});
```

```
DeprecationWarning: Collection.mapReduce() is deprecated. Use an aggregation instead.
[
  { _id: 'keyboard', value: 240 },
  { _id: 'laptop', value: 3000 },
  { _id: 'mouse', value: 250 }
]
```

Coincide exactamente con la fuente (`laptop: 3000`, `mouse: 250`, `keyboard: 240`), y confirma también
lo que ya documenta [[2.14.03 - MapReduce|MapReduce]]: MongoDB 8.3.11 sigue aceptando `mapReduce()`
pero lo marca deprecado desde la versión 5.0, tal como recoge el "Puntos abiertos #2" de `CLAUDE.md`
(*"`mapReduce` deprecado desde 5.0"*). El equivalente moderno sugerido en
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] sería
`db.orders.aggregate([{$group: {_id: "$product", total: {$sum: {$multiply: ["$quantity",
"$price"]}}}}])`.

### Pregunta 9 — índice por defecto de MongoDB (Opción Múltiple)

> ¿Cuál es el tipo de índice default que maneja MongoDB? ¿Hay índices creados por default como
> ocurría en MySQL? Si la respuesta a la 2da pregunta es afirmativa, ¿sobre qué campo lo aplica?
>
> A. B-Tree · Sí · `_id` · B. Hash index · Sí · `_id` · C. B-Tree · No · D. Hash index · No · E. 2d
> index · Sí · `_id` · F. 2d index · No

**Respuesta de la fuente:** ambas fuentes coinciden en **A — B-Tree, Sí, `_id`**. El solucionario:
*"MongoDB utiliza por defecto índices del tipo B-Tree. Sí crea un índice por defecto, sobre el campo
`_id` de cada colección, único y no eliminable."* Captura: `0/4`, alumno marcó "B-Tree · No"
(incorrecto); A señalada como correcta.

**Resolución del vault:** corrida real —

```javascript
db.orders.getIndexes();
// [ { v: 2, key: { _id: 1 }, name: '_id_' } ]
```

Confirma que toda colección nueva trae, sin pedirlo, un único índice sobre `_id`. Consistente con
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]]: el motor de almacenamiento por defecto
(WiredTiger) estructura sus índices como B-Tree, igual que la mayoría de los índices de MySQL/InnoDB.

### Pregunta 15 — interpretar un `aggregate` (Ensayo)

> Interprete y explique con sus palabras qué hace la siguiente query de MongoDB:
>
> ```javascript
> db.orders.aggregate([
>   { $match: { payment_method: "cash" } },
>   { $group: { _id: "$order_date", totalQuantity: { $sum: "$quantity" } } }
> ])
> ```

**Respuesta de la fuente (solucionario reconstruido):** filtra las órdenes pagadas en efectivo,
agrupa por `order_date` y suma `quantity` en `totalQuantity` por cada fecha. Captura: `3/3` —
puntaje completo.

**Resolución del vault:** corrida real, con `payment_method`/`order_date` agregados a los cuatro
documentos de la Pregunta 6 (dos `cash` del `2025-01-01`, uno `card` y uno `cash` del `2025-01-02`):

```
[
  { _id: '2025-01-01', totalQuantity: 7 },
  { _id: '2025-01-02', totalQuantity: 3 }
]
```

Confirma el patrón de dos etapas que describe
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]]: `$match` filtra antes de agrupar (más
eficiente que agrupar todo y filtrar después) y `$group` con `_id` en un campo agrupa por ese valor,
acumulando con `$sum`. Los números de esta corrida son de datos propios del vault (no de la fuente,
que no da datos concretos para esta pregunta), así que no verifican una cifra de la fuente, solo el
comportamiento de la consulta.

### Pregunta 31 — modelo embebido vs. no embebido en MongoDB (Ensayo)

> Explique las ventajas y desventajas de implementar un modelo embebido vs. no hacerlo en MongoDB.

**Respuesta de la fuente (solucionario reconstruido):** ventajas del embebido — acceso rápido en una
sola lectura, atomicidad a nivel de documento, mejor performance al evitar joins (`$lookup`),
localidad de datos. Desventajas — posible duplicación de datos, límite de 16 MB por documento,
dificultad para consultar el subdocumento de forma independiente, mal ajuste si la relación es N:M o
el subdocumento cambia muy seguido. Regla: embeber en 1:1 o 1:pocos con acceso conjunto; referenciar en
N:N o acceso independiente. Captura: `4/6` (crédito parcial en la corrección manual).

**Resolución del vault:** sin discrepancia — coincide punto por punto con
[[2.13.01 - Documentos embebidos vs. referencias|Documentos embebidos vs. referencias]]: *"Beneficios:
menos consultas, mejor lectura, escritura atómica en una operación"* y *"la atomicidad es del
documento: lo embebido se escribe todo o nada, lo referenciado no"*, más las dos cotas de BSON (16 MB
por documento, 100 niveles de anidamiento) que la fuente solo menciona parcialmente (cita los 16 MB,
no los 100 niveles). La regla de decisión de la fuente (1:1/1:pocos → embeber; N:M → referenciar)
coincide con el § *La regla de decisión, en una tabla* de esa página del vault.

---

## Sección H — Persistencia políglota y escalabilidad

### Pregunta 5 — persistencia políglota vs. programación políglota (Coincidencia)

> 1. Usar diferentes tipos de base de datos para almacenar datos, de acuerdo a las distintas
> necesidades de almacenamiento, que requiera una aplicación de software en particular. · 2.
> Aplicaciones pueden ser codificadas en una mezcla de diferentes lenguajes de programación, para
> aprovechar el uso del lenguaje más adecuado para resolver la necesidad requerida. · Opciones:
> Persistencia políglota / Programación políglota / Programación múltiple.

**Respuesta de la fuente:** 1 → Persistencia políglota, 2 → Programación políglota; ambas fuentes
coinciden. Captura: `1,5/3` (crédito parcial y negativo) — el alumno acertó el ítem 1 y erró el 2
(marcó "Programación múltiple", con `50%` de penalización parcial).

**Resolución del vault:** sin discrepancia — coincide con la definición de
[[2.12.03 - Persistencia políglota|Persistencia políglota]] (usar distintos motores según la necesidad
de cada parte de una aplicación). "Programación políglota" no tiene página propia en el vault (no está
en la lista canónica de conceptos), pero es un término estándar de la industria, distinto y a menudo
confundido con "persistencia políglota" — exactamente la trampa que arma esta pregunta.

### Pregunta 21 — diferencia entre replicación y sharding (Opción Múltiple)

> ¿Qué diferencia existe entre Replicación y Sharding?
>
> A. El sharding busca garantizar que siempre haya copias de los datos disponibles y permite escalar
> una base de datos distribuida horizontalmente. La replicación persigue exactamente lo mismo. ·
> B. La replicación busca garantizar que siempre haya copias de los datos disponibles, mientras que
> el sharding permite escalar una base de datos distribuida horizontalmente. · C. El sharding busca
> garantizar que siempre haya copias de los datos disponibles, mientras que la replicación permite
> escalar una base de datos distribuida horizontalmente. · D. Ninguna de las opciones.

**Respuesta de la fuente:** ambas fuentes coinciden en **B**. Captura: `2/2`, "B" marcada y correcta.

**Resolución del vault:** sin discrepancia — coincide literalmente con
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]]: replicación
= copias para disponibilidad y tolerancia a fallas; sharding = partición horizontal para escalar
almacenamiento y carga. La opción A repite, para ambos mecanismos, la descripción de disponibilidad
que solo corresponde a la replicación; la C invierte exactamente los roles de B (sharding =
disponibilidad, replicación = escalar). Es la trampa clásica de confundir cuál definición corresponde
a cada mecanismo, que [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad
horizontal]] ya distingue con precisión.

---

## Sección I — Cassandra *(tema no dictado aún en 2026 2C)*

Cassandra se dicta el 28/09–06/10/2026 según [[_cronograma]] (hoy, 25/09/2026, todavía no se cursó).
Ninguna edición de *Seven Databases in Seven Weeks* cubre Cassandra en profundidad de examen (el vault
ya lo anota en "Puntos abiertos #1" de `CLAUDE.md`); el respaldo bibliográfico disponible es
[[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini § 5.2, p. 13]] (modelo BigTable con
mecanismos de Dynamo: *consistent hashing*, *read-repair*, *vector clocks*, *gossip protocol*) más
documentación oficial de Apache Cassandra para el detalle de CQL que Corbellini no cubre
(`https://cassandra.apache.org/doc/stable/cassandra/cql/`).

### Pregunta 7 — Cassandra vs. bases relacionales (Coincidencia)

> Asocie: 1. Keyspace · 2. Column Family · 3. Fila · 4. Columna · 5. Cluster. Opciones: Base de
> datos, Tabla, Fila, Columna, Instancia.

**Respuesta de la fuente:** 1→Base de datos, 2→Tabla, 3→Fila, 4→Columna, 5→Instancia. Captura: los
cinco ítems marcados "Correcta" con "Parcial: 20 %" cada uno; la imagen no muestra un encabezado con
el puntaje total, así que `5/5` se infiere de sumar los cinco parciales, no se ve directamente.

**Resolución del vault:** *(tema no dictado aún)*. Consistente con Corbellini § 5.2: un *keyspace* es
el contenedor de nivel superior de Cassandra (equivalente a una base de datos), una *column family* es
lo que CQL llama tabla desde la versión que adoptó sintaxis SQL-like.

### Pregunta 8 — componentes de un nodo Cassandra (Opción Múltiple, varias correctas)

> Los componentes de un nodo de Cassandra son:
>
> A. SSTable · B. Memtable · C. Commit Log · D. Memory space · E. Disk table · F. Ninguna de las
> opciones

**Respuesta de la fuente:** ambas fuentes coinciden en **A, B, C**. Captura: `3/3`, las tres marcadas
y correctas (`33,33%` cada una).

**Resolución del vault:** *(tema no dictado aún)*. Consistente con Corbellini § 5.1.2 (componentes de los
*tablet servers* de BigTable, cuyo modelo hereda Cassandra: *memtable* en memoria, *commit log* en
disco para durabilidad, *SSTable* inmutable resultado del *flush*) y § 5.2 (Cassandra combina el
modelo de BigTable con los mecanismos de Dynamo). D y E son distractores sin respaldo en ninguna fuente del vault.

### Pregunta 14 — SSTable, ¿en memoria? (Verdadero/Falso)

> En Cassandra, SSTable es una estructura de datos residente en la memoria.
>
> V. Verdadero · F. Falso

**Respuesta de la fuente:** ambas fuentes coinciden en **Falso**. Captura: `0/1`, alumno marcó
"Verdadero" (incorrecto).

**Resolución del vault:** *(tema no dictado aún)*. La *Memtable* es la estructura en memoria; la
*SSTable* ("Sorted String Table") es el archivo **inmutable en disco** al que se vuelca la Memtable al
llenarse — la relación inversa a la que plantea la pregunta como trampa.

### Pregunta 23 — `WHERE` sin la clave de partición (Opción Múltiple, varias correctas)

> Imagine el siguiente esquema en Cassandra:
>
> ```sql
> CREATE TABLE blogs (blogId int, time1 int, time2 int, author text, content text,
>   PRIMARY KEY (blogId, time1, time2));
> ```
>
> ¿Qué sucede si ejecutamos la siguiente query?
>
> ```sql
> SELECT * FROM blogs WHERE time1 = 1418306451235;
> ```
>
> A. Obtenemos los datos de blogs que se cargaron en el `time1 = 1418306451235`. · B. Falla porque no
> se puede filtrar por `time1` solamente. · C. Falla porque no incluye `blogId` en el `WHERE`. ·
> D. Obtenemos los datos de blogs que se cargaron en el `time1 = 1418306451235` siempre y cuando
> agreguemos la palabra reservada `ALLOW FILTERING`. · E. Ninguna de las opciones.

**Respuesta de la fuente:** ambas fuentes coinciden en **B, C y D**. Captura: `0,99/3` (crédito
parcial y negativo). La plataforma marca B como "Correcta" (seleccionada por el alumno, `33,33%`) y C
y D como "Respuesta correcta" **sin ícono de selección** (no marcadas por el alumno); A no aparece
marcada. El alumno marcó **únicamente B**, sin marcar C ni D (33,33 % de 3 ≈ `0,99/3`, consistente con
una sola opción correcta marcada y ninguna incorrecta).

**Resolución del vault:** *(tema no dictado aún)*. Consistente con el modelo de partición de
Cassandra que documenta Corbellini § 5.2 (partición por *consistent hashing* sobre la *partition
key*): en una PK compuesta `(blogId, time1, time2)`, `blogId` es la clave de partición y `time1`/
`time2` son columnas de *clustering*; CQL exige la clave de partición completa en el `WHERE` (o
`ALLOW FILTERING`, que fuerza un escaneo de todas las particiones) — comportamiento estándar de CQL,
verificable contra la documentación oficial citada arriba, no contra una fuente del vault.

### Pregunta 26 — fórmula del QUORUM (Opción Múltiple)

> Para gestionar el nivel de consistencia en Cassandra, el QUORUM se calcula de la siguiente manera:
>
> A. `rf·2+1` · B. `rf·rf` · C. `rf/2` · D. `(rf/2)+1` · E. `rf-1+(0.5·rf)` · F. Ninguna · G. `rf·2`

**Respuesta de la fuente:** ambas fuentes coinciden en **D — `(replication_factor/2)+1`**. Captura:
`1/1`, "D" marcada y correcta.

**Resolución del vault:** *(tema no dictado aún)*. Es la fórmula estándar de quórum mayoritario de
sistemas distribuidos (mínimo de réplicas que deben confirmar una operación para garantizar
consistencia mayoritaria); no está desarrollada en ninguna página actual del vault en términos de
Cassandra específicamente, aunque el modelo general de *N/W/R* y quórum sí aparece desarrollado (no
específico de Cassandra) en [[2.12.04 - Teorema CAP|Teorema CAP]] § *6 · Lo que CAP no dice*, con la
misma fórmula de quórum mayoritario `N/2 + 1` que pide esta pregunta, citando Corbellini § 3.2 y
Table 3.

### Pregunta 28 — arquitectura Master-Slave (Verdadero/Falso)

> La arquitectura de Cassandra es Master-Slave.
>
> V. Verdadero · F. Falso

**Respuesta de la fuente:** ambas fuentes coinciden en **Falso**. Captura: `0/1`, alumno marcó
"Verdadero" (incorrecto).

**Resolución del vault:** *(tema no dictado aún)*. Consistente con
[[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini § 5.2, p. 13]] (arquitectura
**peer-to-peer**, sin nodo maestro, coordinada por *consistent hashing* + *gossip protocol*) y con
[[2.12.04 - Teorema CAP|Teorema CAP]] § *4.3*, que ubica a Cassandra como *"el único wide-column en la
columna AP del paper"* — coherente con una arquitectura sin nodo único de coordinación.

### Pregunta 29 — Primary Key en Cassandra (Ensayo)

> Explique cómo se constituye una Primary Key en Cassandra y qué función cumple cada componente.
> Incluya ejemplos.

**Respuesta de la fuente (solucionario reconstruido):** dos partes — *Partition Key* (determina el
nodo donde se almacena la fila; se hashea para el anillo de tokens) y *Clustering Columns* (ordenan
las filas dentro de la partición). Da tres ejemplos progresivos: PK simple (solo partition key), PK
compuesta (partition key + clustering column) y PK con partition key compuesta (`(pais, ciudad),
fecha`). Captura: `0/6` (corrección manual, sin ver el texto del alumno).

**Resolución del vault:** *(tema no dictado aún)*. Consistente con el modelo de *consistent hashing*
de Corbellini § 5.2: la primera componente (o el primer grupo entre paréntesis) de la PK determina el
nodo por hash; el resto ordena físicamente los datos dentro de esa partición — CQL estándar,
verificable contra la documentación oficial de Apache Cassandra citada arriba.

---

## Sección J — Neo4j *(tema no dictado aún en 2026 2C)*

Neo4j se dicta el 19–20/10/2026 según [[_cronograma]]. El vault no tiene página de motor propia para
Neo4j (no está en la lista canónica de `wiki/motores/`); se cita en texto plano.

### Pregunta 20 — restricción de unicidad en Cypher (Ensayo)

> Escriba la sentencia en Cypher que cree una restricción de unicidad sobre un nodo `Publication` con
> propiedad `name`.

**Respuesta de la fuente (solucionario reconstruido):**

```cypher
CREATE CONSTRAINT publication_name_unique
FOR (p:Publication)
REQUIRE p.name IS UNIQUE;
```

Con nota de sintaxis anterior (Neo4j 3.x): `CREATE CONSTRAINT ON (p:Publication) ASSERT p.name IS
UNIQUE;`. Captura: `1/3` (crédito parcial en la corrección manual).

**Resolución del vault:** *(tema no dictado aún)*. *(nota)* El Ejercicio 3 del
[[Parcial XC-202X|Parcial XC-202X]] pide la misma restricción y la respuesta manuscrita usa la misma
forma `CREATE CONSTRAINT … FOR … REQUIRE … IS UNIQUE`, la que documenta hoy Neo4j.

### Pregunta 22 — traducir Cypher a lenguaje natural (Ensayo)

> Redacte en lenguaje natural la pregunta que le solicitan responder para construir la siguiente
> consulta sobre una base en Neo4j:
>
> ```cypher
> MATCH (actor:Person)-[:ACTED_IN]->(movie:Movie)
> WHERE movie.title STARTS WITH "T"
> RETURN movie.title AS title, count(actor.name) AS cant
> ORDER BY title ASC LIMIT 10;
> ```

**Respuesta de la fuente (solucionario reconstruido):** *"Para las películas cuyo título empieza con
'T', mostrar el título junto con la cantidad de actores que actuaron en ella, ordenadas
alfabéticamente de forma ascendente. Limitar a las 10 primeras."* Captura: `2/3` (crédito parcial).

**Resolución del vault:** *(tema no dictado aún)*. Lectura literal y directa de la sintaxis Cypher
(`MATCH`/`WHERE`/`RETURN`/`ORDER BY`/`LIMIT` tienen equivalentes directos en SQL, aunque el patrón de
grafo `(actor)-[:ACTED_IN]->(movie)` no tiene traducción a una sola cláusula de SQL relacional); no
hay discrepancia que resolver porque no hay página del vault contra la cual contrastar.

---

## Qué enseña para el parcial 2026

- **`WITH CHECK OPTION` en cadena es un tema de examen real, no solo de TP**, y aparece dos veces
  (preguntas 1 y 18) con la misma cadena de tres vistas y solo cambia qué vista es el destino del
  `INSERT` y qué condición se viola. Memorizar la regla del estándar —verificada empíricamente en
  MySQL 9.7.2 en la Pregunta 18—: `CASCADED` chequea toda la cadena; `LOCAL` chequea la condición
  propia **más** las de las vistas subyacentes que tengan su propio `WITH CHECK OPTION` (si una
  subyacente no tiene WCO propio, como pasa en esta cadena, `LOCAL` no tiene nada que chequearle).
- **Las acciones referenciales se preguntan con un mismo esquema (`Facultad`/`Carrera`/`Materia`)
  repetido tres veces** (preguntas 17, 19 y 30), variando la operación (`UPDATE`, `INSERT`, `DELETE`)
  y la trampa (violación de unicidad disfrazada de RIR; `MATCH simple` con FK que no existe en la
  tabla referenciada; `RESTRICT` real vs. la RIR "equivocada" que parece aplicar). Conviene practicar
  las tres variantes sobre el mismo esquema, no solo memorizar la tabla de acciones.
- **`MATCH simple/parcial/full` entra en el parcial aunque MySQL ignore la cláusula** (la acepta sin error y se comporta siempre
  como `MATCH SIMPLE`): hay que
  saber razonar sobre FK compuestas con componentes `NULL` usando la tabla de decisión de
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]], no solo la
  sintaxis ejecutable.
- **El teorema CAP se pregunta con la clasificación del deck (slide 18), no con la de la
  bibliografía**: MySQL CA, MongoDB CP, Cassandra AP — pero **Neo4j como CA (pregunta 13) no está en
  ese mismo slide** y la bibliografía obligatoria se contradice sobre su clasificación en HA. Ante una
  pregunta de CAP por motor, la apuesta más segura es la clasificación textual del slide 18, aun
  cuando no cubra todos los motores que el examen pregunta.
- **Cassandra y Neo4j entran al examen con preguntas de definición pura** (componentes de un nodo,
  fórmula de QUORUM, sintaxis Cypher básica) más que de razonamiento aplicado: si para el 13/10/2026
  esas unidades ya se dictaron (Cassandra 28/09–06/10; Neo4j recién 19/10, **después** del parcial),
  conviene repasarlas con foco en vocabulario y comandos textuales del deck, no en ejercicios
  complejos.
- **Las preguntas de ensayo se corrigen a mano y con crédito parcial**: ninguna captura muestra el
  texto que escribió el alumno, solo el puntaje — así que la "fuente" real para esas preguntas es
  siempre el solucionario reconstruido, nunca la captura.

## Dudas abiertas

- (abierto) Por qué el slide 18 de la Clase 12 (la fuente que el vault documenta como "la
  clasificación CAP que toma el parcial") no incluye a Neo4j, si la Pregunta 13 sí lo evalúa como CA:
  el Ejercicio 3 del [[Parcial XC-202X|Parcial XC-202X]] trae un criterio de estudiante de tres casos
  (instancia única → CA; HA → AP; distribuido con particiones → CP, este último sin respaldo en la
  bibliografía) que explica por qué no hay contradicción entre las preguntas 4 y 13, pero sigue sin haber un slide o fuente de cátedra de 2026 que clasifique a
  Neo4j explícitamente.
- (ok) Qué chequea `LOCAL CHECK OPTION` en MySQL 9.7.2 está cerrado en [[1.06.01 - Vistas|Vistas]] §
  *Dudas abiertas* y registrado en [[Clase 06 - Vistas-Parte 1|Clase 06]] y [[Práctica 2026-08-11]]:
  la condición propia más las de las vistas subyacentes con WCO propio. Lo fija la corrida
  `v1` (WCO) → `v2` (`LOCAL`) de la Pregunta 18; la Pregunta 18 sola no distingue las dos lecturas,
  porque su vista base no tiene WCO. (abierto) Qué lectura corrige la cátedra en 2026 sigue sin fuente.

## Enlaces

[[Mapa de exámenes]] · [[Parcial XC-202X|Parcial XC-202X]] · [[Parcial 2Q-2023|Parcial 2Q-2023]] ·
[[Práctica subida por la cátedra|Práctica subida por la cátedra]] · [[_cronograma]] · [[_index-clases]] · [[1.06.01 - Vistas|Vistas]] ·
[[1.05.01 - SQL — consultas|SQL — consultas]] ·
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
[[1.08.01 - Plan de ejecución|Plan de ejecución]] ·
[[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] ·
[[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] ·
[[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
[[2.12.03 - Persistencia políglota|Persistencia políglota]] ·
[[2.13.01 - Documentos embebidos vs. referencias|Documentos embebidos vs. referencias]] ·
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]] · [[2.14.03 - MapReduce|MapReduce]] ·
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
[[Clase 06 - Vistas-Parte 1]] · [[Clase 07 - Vistas-Parte 2]] · [[Clase 08 - Explicando el plan]] ·
[[Clase 09 - Restricciones integridad-Parte 1]] · [[Clase 11 - Seguridad-Transacciones]] ·
[[Clase 12 - Introduccion a NoSQL]] · [[Práctica 2026-08-11]] · [[Práctica 2026-08-25]]
