---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - EXPLAIN y EXPLAIN ANALYZE en MySQL, lectura de un plan
  - Vistas con WITH CHECK OPTION (LOCAL/CASCADED), vista con agregación y vista materializada
  - Integridad referencial y acciones referenciales (RESTRICT/CASCADE, MATCH simple)
  - CHECK de tupla sobre datos existentes
  - Privilegios (GRANT/REVOKE … CASCADE, privilegios por columna)
  - Control de concurrencia, bloqueos compartidos y phantom read
  - Teorema CAP, persistencia políglota, replicación y sharding
  - MongoDB — índices, MapReduce, aggregation pipeline, embebido vs. referencias
  - Cassandra — clave primaria, QUORUM, componentes del nodo, keyspace, ALLOW FILTERING
  - Neo4j — ACID, relaciones, coordinación de nodos
cuatrimestre: 2026-1C
temario: actual
fuentes:
  - "raw/Examenes_Viejos/1C-26/Parcial/BDII Parcial - 1Q2026.pdf"
  - "raw/Examenes_Viejos/1C-26/Recu/WhatsApp Video 2026-09-29 at 11.06.33.mp4"
estado: procesado
resumen: "Parcial del 1C 2026 en Blackboard, de máximo peso para practicar: misma cátedra y plataforma. 35 preguntas, 100 puntos; el alumno sacó 58,49 (desaprobado). Cada pregunta, resuelta y corrida en MySQL, MongoDB o Cassandra, con los errores del alumno explicados y corregidos."
aliases:
  - Parcial 1Q2026
  - 1Q2026
  - Parcial 1C 2026
  - Parcial primer cuatrimestre 2026
---

# Parcial 1Q2026 — el examen de la cátedra actual, con la revisión del alumno corregida

## Resumen general

Parcial del primer cuatrimestre de 2026, rendido en Blackboard y fotografiado en su pantalla de
revisión. Con el [[Recuperatorio 1Q2026]], es la instancia de **mayor peso del vault** para ejercitar
el parcial: la misma cátedra, la misma plataforma y el cuatrimestre inmediatamente anterior. Son 35
preguntas por 100 puntos: 9 de verdadero/falso, 11 de opción múltiple simple, 3 de varias correctas, 1
de coincidencia, 10 de ensayo que suman 53 puntos y una última que no se ve. Mezcla la primera mitad
(vistas con `CHECK OPTION`, acciones referenciales, `CHECK`, `EXPLAIN`, `GRANT`/`REVOKE`, aislamiento)
con NoSQL: CAP, MongoDB, Cassandra y Neo4j.

El alumno obtuvo **58,49/100**. Según la tabla del encabezado del recuperatorio (misma plataforma),
eso es **desaprobado**: le faltaron 1,51 puntos para el 4. Perdió 29 de sus 41,51 puntos en los
ensayos: la función de la *partition key* y la *clustering key* (0/5), el QUORUM con RF 5 (2/8), el
*phantom read* (0/6), el modelo embebido de MongoDB (1/6) y el `CHECK` sobre datos existentes (2/6).
En las cerradas, los errores fueron dos de acciones referenciales, MapReduce en paralelo, Neo4j
ACID, replicación vs. sharding y la vista materializada, más dos parciales: programación políglota
(P6) y la opción D de la P34.

Cada pregunta separa lo que respondió el alumno, la corrección de la plataforma y la resolución del
vault, corrida en MySQL 9.7.2, MongoDB 8.3.11 o Cassandra 5.0.9 cuando se puede. Tres correcciones
no cierran contra el motor y van marcadas (atención): el `CREATE KEYSPACE` con dos puntos que recibió
puntaje completo (P31), la vista materializada que MySQL no materializa (P32) y el literal fuera del
rango de `int` de la P34. Quince preguntas reaparecen casi textuales en el [[Parcial 2Q2025]]: la
cátedra recicla su banco.

> [!info] Fuente
> - **`BDII Parcial - 1Q2026.pdf`** — 15 páginas con **29 fotos** de la pantalla de revisión de
>   Blackboard (`img-000` … `img-028`). Muestran, pregunta por pregunta, el enunciado, la opción
>   marcada o el texto de ensayo del alumno, el rótulo `Correcta:`/`Incorrecta:`, la leyenda
>   `Respuesta correcta` de la clave y la pastilla de puntaje. Hay comentarios del docente en las
>   preguntas 7, 14 y 23. Ninguna foto muestra el nombre del alumno.
> - **Lo que no se ve.** El encabezado (título, fecha, duración, condiciones de aprobación, tabla de
>   notas) no está fotografiado, y de la **Pregunta 35** solo se ven el título, el ícono ✗ y media
>   pastilla (`0/1`, dudoso). Después de las preguntas 10 y 21 quedan dos tramos sin fotografiar,
>   justo donde iría un eventual comentario del docente.
> - **Tabla puntaje → nota y duración**: salen del encabezado del [[Recuperatorio 1Q2026]] (video de
>   la misma plataforma, frame `s-000`) y se rotulan así.
> - Material de estudiantes, no oficial. La corrección, en cambio, es la de la plataforma y el
>   docente de la cátedra: la fuente más confiable del vault sobre qué se considera correcto.

## Formato

- **35 preguntas, 100 puntos** (suma de las pastillas; la plataforma no muestra el total en las
  fotos). Sin fecha visible, así que la página no lleva `fecha`.

| Tipo | Preguntas | Puntos c/u | Total | Cómo se corrige |
| --- | --- | --- | --- | --- |
| Verdadero/falso | 1, 8, 11, 13, 17, 18, 24, 25, 32 | 1 | 9 | automática |
| Opción múltiple simple | 2, 4, 5, 9, 10, 15, 16, 19, 21, 30, 33 | 1 a 5 | 24 | automática |
| Opción múltiple, varias correctas | 26, 29, 34 | 3 o 4 | 10 | automática, porcentaje por opción con negativos |
| Coincidencia | 6 | 3 | 3 | automática, *"Crédito parcial y negativo"* |
| Ensayo | 3, 7, 12, 14, 20, 22, 23, 27, 28, 31 | 3 a 8 | 53 | manual, con comentario opcional del docente |
| No visible | 35 | 1 | 1 | — |

- **Los ensayos valen más de la mitad del examen** (53 de 100), y la Pregunta 14 sola vale 8.
- **Condición de aprobación y escala** *(del encabezado del [[Recuperatorio 1Q2026]])*: *"nota 4,
  debe contestar correctamente como mínimo el 60% de las preguntas formuladas"*.

| Puntaje: | 0-59 | 60-63 | 64-69 | 70-76 | 77-83 | 84-89 | 90-96 | 97-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nota: | Desaprobado | 4 | 5 | 6 | 7 | 8 | 9 | 10 |

- **Duración** *(del encabezado del recuperatorio)*: 2 horas y 30 minutos.
- **Rótulos de la plataforma.** En las V/F, la opción elegida correcta va en verde **sin rótulo** y la
  incorrecta, en rojo con `Incorrecto:`. En las de opción múltiple y en la coincidencia, la elegida
  lleva `Correcta:` (verde) o `Incorrecta:` (rojo). La clave es la opción con la leyenda
  `Respuesta correcta`. Cada pregunta indica el rótulo que muestra la foto.

## Puntaje

| P | Tipo | Obtenido / máximo | | P | Tipo | Obtenido / máximo | |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | V/F | 1/1 | ✓ | 19 | OM | 0/2 | ✗ |
| 2 | OM | 1/1 | ✓ | 20 | ensayo | 1/6 | parcial |
| 3 | ensayo | 5/5 | ✓ | 21 | OM | 2/2 | ✓ |
| 4 | OM | 2/2 | ✓ | 22 | ensayo | 4/6 | parcial |
| 5 | OM | 2/2 | ✓ | 23 | ensayo | 0/6 | ✗ |
| 6 | coincidencia | 1,5/3 | parcial | 24 | V/F | 1/1 | ✓ |
| 7 | ensayo | 0/5 | ✗ | 25 | V/F | 0/1 | ✗ |
| 8 | V/F | 0/1 | ✗ | 26 | OM varias | 3/3 | ✓ |
| 9 | OM | 5/5 | ✓ | 27 | ensayo | 3/3 | ✓ |
| 10 | OM | 0/2 | ✗ | 28 | ensayo | 4/5 | parcial |
| 11 | V/F | 1/1 | ✓ | 29 | OM varias | 4/4 | ✓ |
| 12 | ensayo | 2/6 | parcial | 30 | OM | 2/2 | ✓ |
| 13 | V/F | 1/1 | ✓ | 31 | ensayo | 3/3 | ✓ |
| 14 | ensayo | 2/8 | parcial | 32 | V/F | 0/1 | ✗ |
| 15 | OM | 0/2 | ✗ | 33 | OM | 2/2 | ✓ |
| 16 | OM | 2/2 | ✓ | 34 | OM varias | 1,99/3 | parcial |
| 17 | V/F | 1/1 | ✓ | 35 | no visible | [dudoso: 0/1] | ✗ |
| 18 | V/F | 1/1 | ✓ | | | | |

**Total: 58,49 / 100 → Desaprobado** (tramo 0-59). Aun si la P35 valiera 1/1, el total sería 59,49:
también desaprobado. Por tipo: V/F 6/9 · OM simple 18/24 · OM varias 8,99/10 · coincidencia 1,5/3 ·
ensayo 24/53. Los ensayos concentran el 70 % de lo perdido; con la mitad de lo que se perdió en las
preguntas 7, 14 y 23 (Cassandra y transacciones) el examen quedaba aprobado.

## Mapa de temas

| P | Tema | Concepto del vault | Clase/TP 2026 |
| --- | --- | --- | --- |
| 1 | `EXPLAIN ANALYZE` en MySQL | [[1.08.01 - Plan de ejecución\|Plan de ejecución]] | Clase 08 · [[Práctica 2026-08-18]] |
| 2 | CAP con lectura y escritura en todos los nodos | [[2.12.04 - Teorema CAP\|Teorema CAP]] | Clase 12 |
| 3 | Cadena de `GRANT`/`REVOKE … CASCADE` sobre `INVESTIGADOR` | [[1.11.02 - Usuarios, privilegios y roles\|Usuarios, privilegios y roles]] | Clase 11 · [[Práctica 2026-09-08]] |
| 4 | `INSERT` en vista sin `CHECK OPTION` | [[1.06.01 - Vistas\|Vistas]] | Clase 06 · [[Práctica 2026-08-11]] |
| 5 | `INSERT` en vista con `LOCAL CHECK OPTION` | [[1.06.01 - Vistas\|Vistas]] | Clase 06 · [[Práctica 2026-08-11]] |
| 6 | Persistencia políglota vs. programación políglota | [[2.12.03 - Persistencia políglota\|Persistencia políglota]] | Clase 12 · [[Práctica 2026-08-04]] |
| 7 | Función de la partition key y de la clustering key | [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria en Cassandra]] | Clase 15 · [[Práctica 2026-09-29]] |
| 8 | MapReduce procesa en paralelo | [[2.14.03 - MapReduce\|MapReduce]] | Clase 14 |
| 9 | Índice por defecto de MongoDB | [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] | Clase 14 · [[Práctica 2026-09-22]] |
| 10 | `DELETE` en `Carrera` con R2 `restrict` | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 · [[Práctica 2026-08-25]] |
| 11 | Objetivo del control de concurrencia | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | Clase 11 |
| 12 | `CHECK` de tupla: qué hace, tipo, datos existentes | [[1.09.03 - CHECK, DOMAIN y ASSERTION\|CHECK, DOMAIN y ASSERTION]] | Clase 10 · [[Práctica 2026-08-25]] |
| 13 | Bloqueo compartido | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | Clase 11 |
| 14 | QUORUM con RF 5: consistencia fuerte y reparación | [[3.15.05 - Niveles de consistencia y QUORUM\|Niveles de consistencia y QUORUM]] · [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura en Cassandra]] | Clase 15 |
| 15 | Replicación vs. sharding | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | Clase 12 |
| 16 | Motor que delega la coordinación de nodos | Neo4j (texto plano) | Neo4j: 19–20/10 en 2026 2C |
| 17 | La función `map` emite pares clave-valor | [[2.14.03 - MapReduce\|MapReduce]] | Clase 14 |
| 18 | Relaciones de Neo4j: dirección y propiedades | Neo4j (texto plano) | Neo4j: 19–20/10 |
| 19 | `UPDATE` en `Carrera` que viola la PK | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 · [[Práctica 2026-08-25]] |
| 20 | Modelo embebido vs. referencias en MongoDB | [[2.13.01 - Documentos embebidos vs. referencias\|Documentos embebidos vs. referencias]] | Clase 13 · [[Práctica 2026-09-15]] |
| 21 | `INSERT` con FK compuesta y un `NULL` (`MATCH simple`) | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 · [[Práctica 2026-08-25]] |
| 22 | Vista `ConstructorVIP` con agregación; actualizabilidad | [[1.06.01 - Vistas\|Vistas]] · [[1.05.01 - SQL — consultas\|SQL — consultas]] | Clases 06–07 · [[Práctica 2026-08-11]] |
| 23 | Phantom read y `SERIALIZABLE` | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | Clase 11 |
| 24 | Cassandra no es master-slave | [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura de Cassandra]] | Clase 15 |
| 25 | Neo4j y ACID | Neo4j (texto plano) · [[1.11.03 - Transacciones y ACID\|Transacciones y ACID]] | Neo4j: 19–20/10 |
| 26 | Componentes de un nodo de Cassandra | [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura en Cassandra]] | Clase 15 |
| 27 | Interpretar `$match` + `$group` | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 14 · [[Práctica 2026-09-22]] |
| 28 | Proyectos por investigador, ordenados | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 14 · [[Práctica 2026-09-22]] |
| 29 | Leer un `EXPLAIN`: PK o `UNIQUE` en `materia` | [[1.08.01 - Plan de ejecución\|Plan de ejecución]] · [[1.08.02 - Índices\|Índices]] | Clase 08 · [[Práctica 2026-08-18]] |
| 30 | `INSERT` en vista con `CASCADED CHECK OPTION` | [[1.06.01 - Vistas\|Vistas]] | Clase 06 · [[Práctica 2026-08-11]] |
| 31 | `CREATE KEYSPACE` en CQL | [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Keyspaces]] · [[3.15.03 - CQL y modelado orientado a consultas\|CQL]] | Clase 15 · [[Práctica 2026-09-29]] |
| 32 | Vista materializada y performance | [[1.06.01 - Vistas\|Vistas]] | Clase 07 |
| 33 | Qué es Neo4j | Neo4j (texto plano) | Neo4j: 19–20/10 |
| 34 | `WHERE` con parte de la partition key | [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria en Cassandra]] | Clase 15 · [[Práctica 2026-09-29]] |
| 35 | no visible | pendiente | pendiente |

(nota) Cuatro preguntas son de Neo4j (16, 18, 25, 33). Según [[_cronograma]], en 2026 2C Neo4j se
dicta el 19/10, **después** del parcial del 13/10; en el 1C 2026 entró al parcial.

## Corridas

Todas las salidas de esta página son de corridas reales en contenedores desechables:

- **MySQL 9.7.2**, base `parcial1q26`: la cadena `Movimiento`/`MovimientoUSDT`/`MovUSDTValor`/
  `MovUSDTValorComi` (P4, P5, P30), `Facultad`/`Carrera`/`Materia` con las RIR R1 y R2 y los datos
  del enunciado (P10, P19, P21), `Vendedor` (P12), el esquema `CONSTRUCTOR`/`OBRA`/`EJECUTA`/
  `OBRA_PRIVADA`/`OBRA_CIVIL` con datos de prueba (P22), `pedidos` con dos sesiones concurrentes
  (P23), `materia` con 2000 filas e `inscripto` con 4 (P29), `INVESTIGADOR` con las vistas `IJ`, `IH`
  e `IS` y tres cuentas de prueba U1–U3 (P3).
- **MongoDB 8.3.11**, base `parcial1q26`: `orders` (P9, P27), `Proyectos` e `Investigadores` (P28),
  un documento de más de 16 MB (P20).
- **Cassandra 5.0.9** (nodo único): keyspaces `parcial1q26` (tabla `blogs`, P7 y P34),
  `parcial1q26_rf5` (RF 5, P14) y `parcial1q26_p31` (P31).
- **MySQL 9.7.2**, base `auditorexamenes` (verificación): el orden del ensamble en el `EXPLAIN
  ANALYZE DELETE` multitabla (P1) y los costos del plan con PK, `UNIQUE`, `UNIQUE` nulable e índice
  no único, antes y después de un `ALTER TABLE` (P29).

(nota) El contenedor de MySQL corre en Linux con `lower_case_table_names = 0`: los nombres de tabla
distinguen mayúsculas, así que `UPDATE carrera` falla con `ERROR 1146 … Table 'parcial1q26.carrera'
doesn't exist` si la tabla se creó como `Carrera`. En Windows y macOS (el default de instalación) no
pasa. Las corridas usan el nombre con que se creó cada tabla.

---

## Pregunta 1 — `EXPLAIN ANALYZE` en MySQL (V/F, 1 punto)

**Enunciado.**

> En **MySQL**, el 'EXPLAIN ANALYZE \<sql\>' muestra los tiempos de planificación, pero no ejecuta la
> sentencia \<sql\>.
>
> Verdadero · Falso

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 1/1 ✓, sin rótulo (fila verde). Clave: Falso.

**Resolución del vault.** ✓ **Falso**, por dos razones. `EXPLAIN` muestra el plan estimado sin
ejecutar; `EXPLAIN ANALYZE` **ejecuta** la consulta y agrega los tiempos y filas reales de cada paso
([[1.08.01 - Plan de ejecución|Plan de ejecución]]). Y los *"tiempos de planificación"* son la salida
de PostgreSQL (`Planning Time` / `Execution Time`); MySQL no los muestra. Corrida con una función que
deja rastro en `t_log` cada vez que se evalúa:

```sql
EXPLAIN FORMAT=TREE SELECT id FROM t_explain WHERE registra(v) > 0;
SELECT COUNT(*) FROM t_log;          -- 0: EXPLAIN no ejecutó nada
EXPLAIN ANALYZE SELECT id FROM t_explain WHERE registra(v) > 0;
SELECT COUNT(*) FROM t_log;          -- 3: la consulta corrió, una vez por fila
```

```
-> Filter: (registra(t_explain.v) > 0)  (cost=0.55 rows=3) (actual time=0.495..0.616 rows=3 loops=1)
    -> Table scan on t_explain  (cost=0.55 rows=3) (actual time=0.0236..0.029 rows=3 loops=1)
```

(atención) Con DML el comportamiento es otro en MySQL 9.7.2: `EXPLAIN ANALYZE DELETE`/`UPDATE` sobre
una sola tabla responde `-> <not executable by iterator executor>`, y en la forma multitabla recorre
las filas (`rows=2` en el join) pero **no modifica nada** (`Delete from t_explain (immediate)` o
`(buffered)`, según el orden del ensamble, con `rows=0`; la tabla conserva sus tres filas). Para el
parcial alcanza con la regla del `SELECT`.

**Para el parcial.** `EXPLAIN` estima; `EXPLAIN ANALYZE` ejecuta y mide. "Tiempo de planificación"
es vocabulario de PostgreSQL.

## Pregunta 2 — CAP con lectura y escritura en todos los nodos (OM, 1 punto)

**Enunciado.**

> Suponga que tiene una base de datos distribuida en varios nodos y todos los nodos aceptan lecturas y
> escrituras. ¿En qué situación del teorema CAP estaríamos?
>
> A. CA · B. AP · C. CP · D. Ninguna de las anteriores

**Lo que respondió el alumno.** B · AP.

**Corrección de la plataforma.** 1/1 ✓, rótulo `Correcta:`. Clave: B.

**Resolución del vault.** ✓ **AP.** Si cualquier nodo acepta escrituras sin coordinarse con un
primario, ante una partición cada lado sigue respondiendo (disponibilidad) y las réplicas divergen
hasta converger después (consistencia eventual). Es el perfil que [[2.12.04 - Teorema CAP|Teorema CAP]] asigna a Cassandra: la Clase 15 lo dice en el slide 11 (*"tolerancia a particiones y
disponibilidad, pero a cambio de ser eventualmente consistente"*). CA no aplica a un sistema
distribuido que debe tolerar particiones, y CP exigiría rechazar escrituras de los nodos aislados.

**Para el parcial.** "Todos los nodos escriben" = multi-master = AP.

## Pregunta 3 — cadena de `GRANT`/`REVOKE … CASCADE` sobre `INVESTIGADOR` (ensayo, 5 puntos)

**Enunciado.**

> Dada la siguiente secuencia de cesión, revocación de privilegios y operaciones, decir cuáles son los
> privilegios y sobre qué objetos los conservan U1, U2 y U3 al final de la ejecución. Notifique si
> alguna operación falla.
> Asuma que U0 es el administrador.
> **Nota:** IJ: *InvestigadoresJovenes*, IH: *InvestigadoresHistoricos*, IS: *InvestigadoresSenior*

```sql
U0: GRANT SELECT ON IJ, IH TO U1;
U0: GRANT INSERT, UPDATE (IdInvest, nombre) ON INVESTIGADOR TO U1 WITH GRANT OPTION;
U0: INSERT INTO IS (IdInvest, nombre, fec_nac) VALUES (34, “Jorge López”, “01/10/1960”);
U0: GRANT SELECT ON INVESTIGADOR TO U1, U3 WITH GRANT OPTION;
U1: GRANT SELECT ON INVESTIGADOR TO U2 WITH GRANT OPTION;
U2: GRANT SELECT ON INVESTIGADOR TO U3; U0: GRANT SELECT ON IJ TO U3;
U1: REVOKE SELECT ON INVESTIGADOR FROM U2 CASCADE;
U1: INSERT INTO IS (IdInvest, nombre, fec_nac) VALUES (35, “Juan Álvarez”, “01/12/1965”);
U3: SELECT * FROM INVESTIGADOR WHERE IdInvest > 40;
```

(Las comillas de los literales son tipográficas en la pantalla. La sexta línea trae dos sentencias,
de U2 y de U0.)

**Lo que respondió el alumno.**

> U1: tiene privilegios de SELECT sobre IJ, IH e INVESTIGADOR con posibilidad de otorgar este ultimo.
> tiene tambien privilegios de INSERT y UPDATE sobre los campos IdInvest y nombre de la tabla
> investigador con la posibilidad de otorgarlos.
>
> U2: no tiene privilegios
> U3: tiene privilegios de SELECT sobre IJ y INVESTIGADOR con la posibilidad de otorgar este ultimo.
>
> La anteultima operacion falla ya que U1 no tiene permisos de incersion sobre IS.

**Corrección de la plataforma.** 5/5 ✓, sin comentario.

**Resolución del vault.** En SQL estándar, con el grafo de permisos (GMUW 10.1.5–10.1.6; [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]]), cada concesión es una arista del
otorgante al receptor, y `REVOKE … CASCADE` borra además todo lo que quede sin camino desde el
administrador:

| Paso | Efecto |
| --- | --- |
| 1 | U1: `SELECT` en `IJ` y en `IH` |
| 2 | U1: `INSERT` sobre **toda** la tabla y `UPDATE (IdInvest, nombre)`, los dos con opción de concesión (WGO) |
| 3 | procede: U0 es administrador |
| 4 | U1 y U3: `SELECT` WGO en `INVESTIGADOR`, **de U0** |
| 5 | U2: `SELECT` WGO, de U1 |
| 6 | U3: `SELECT` (sin WGO) de U2, redundante con el del paso 4 · U3: `SELECT` en `IJ`, de U0 |
| 7 | cae U1 → U2; U2 queda sin camino al administrador y en cascada cae U2 → U3. U3 conserva el suyo porque viene directo de U0 |
| 8 | **falla**: U1 tiene `INSERT` sobre la tabla `INVESTIGADOR`, no sobre la vista `IS`; los privilegios de una vista son independientes de los de su tabla base |
| 9 | procede: U3 conserva `SELECT` sobre `INVESTIGADOR` (de las filas que inserta la secuencia solo quedó la 34, que no cumple `> 40`; el enunciado no dice qué más hay en la tabla) |

Estado final: **U1** `SELECT` en `IJ` e `IH`; `SELECT`, `INSERT` y `UPDATE (IdInvest, nombre)` en
`INVESTIGADOR`, los tres con WGO · **U2** ninguno · **U3** `SELECT` WGO en `INVESTIGADOR` y `SELECT`
en `IJ`. Falla solo el paso 8.

La respuesta del alumno es correcta. Una precisión que no le costó puntos: en `GRANT INSERT, UPDATE
(IdInvest, nombre)` la lista de columnas acompaña solo a `UPDATE`; cada privilegio lleva la suya. El
`INSERT` es sobre toda la tabla.

**Corrida en MySQL 9.7.2** (U0 = `root`; U1–U3 = cuentas `p1q26_u1..3`; `IJ`, `IH` e `IS` son vistas
de prueba por fecha de nacimiento). Las diferencias con el estándar:

```
GRANT SELECT ON IJ, IH TO p1q26_u1;
ERROR 1064 (42000): … near ', IH TO p1q26_u1'            -- un GRANT, un objeto: hay que partirlo
INSERT INTO IS (IdInvest, nombre, fec_nac) VALUES (34, 'Jorge López', '1960-10-01');
ERROR 1064 (42000): … near 'IS (IdInvest, …'             -- IS es palabra reservada: `IS`
[U1] REVOKE SELECT ON INVESTIGADOR FROM p1q26_u2 CASCADE;
ERROR 1064 (42000): … near 'CASCADE'                     -- MySQL no tiene REVOKE … CASCADE
[U1] INSERT INTO `IS` (IdInvest, nombre, fec_nac) VALUES (35, 'Juan Álvarez', '1965-12-01');
ERROR 1142 (42000): INSERT command denied to user 'p1q26_u1'@'localhost' for table 'IS'
[U1] UPDATE INVESTIGADOR SET fec_nac = '2001-01-01' WHERE IdInvest = 50;
ERROR 1143 (42000): UPDATE command denied to user 'p1q26_u1'@'localhost' for column 'fec_nac' in table 'INVESTIGADOR'
```

El paso 8 falla igual que en el estándar, y la última línea confirma que el `UPDATE` quedó limitado a
las dos columnas mientras el `INSERT` de U1 en la tabla base (con `fec_nac`) procedió. Estado final,
con el `REVOKE` sin `CASCADE`:

```
+----------+--------------+--------------------+---------------------+-------------+
| User     | Table_name   | Grantor            | Table_priv          | Column_priv |
+----------+--------------+--------------------+---------------------+-------------+
| p1q26_u1 | IH           | root@localhost     | Select              |             |
| p1q26_u1 | IJ           | root@localhost     | Select              |             |
| p1q26_u1 | INVESTIGADOR | root@localhost     | Select,Insert,Grant | Update      |
| p1q26_u2 | INVESTIGADOR | p1q26_u1@localhost | Grant               |             |
| p1q26_u3 | IJ           | root@localhost     | Select              |             |
| p1q26_u3 | INVESTIGADOR | p1q26_u2@localhost | Select,Grant        | Update      |
+----------+--------------+--------------------+---------------------+-------------+
```

Tres rarezas del motor, ninguna del estándar: (1) U2 pierde el `SELECT` pero **conserva la marca
`Grant`**: `REVOKE SELECT` no quita la opción de concesión. (2) La fila de U3 fusiona las concesiones
de U0 (paso 4) y de U2 (paso 6) y registra como `Grantor` solo a la última; es la fusión ya vista en el
[[Parcial 2Q-2023|Parcial 2Q-2023]] § *Pregunta 6*. (3) U3 muestra `Column_priv: Update` y `SHOW
GRANTS` dice `GRANT SELECT, UPDATE ON … INVESTIGADOR`, pero no puede actualizar ninguna columna
(`ERROR 1143 … for column 'nombre'`). Es un resto del `GRANT … TO U1, U3` del paso 4, dado en una sola
sentencia a U1, que ya tenía `UPDATE` por columna; con cuentas aparte, `GRANT SELECT ON tg TO a, b`
reproduce la marca vacía. `SHOW GRANTS` no basta para decidir quién puede qué.

**Para el parcial.** Resolver con el grafo del estándar, arista por concesión; lo que llega directo
del administrador sobrevive al `CASCADE`, y un privilegio sobre la tabla no da privilegio sobre sus
vistas.

## Pregunta 4 — `INSERT` en una vista sin `CHECK OPTION` (OM, 2 puntos)

**Enunciado.**

> Dadas las siguientes definiciones de vistas:

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

> Para la siguiente sentencia, considerando la existencia de la tabla *Movimiento* y suponiendo que
> está inicialmente vacía y que los datos que se pretende insertar satisfacen las restricciones de
> integridad referencial definidas. Indique si cada operación procede o no:
>
> a) INSERT INTO MovimientoUSDT (id_usuario, moneda, fecha, tipo, comision, valor) VALUES ('1',
> 'EURO', to_date('2020-01-01','yyyy-MM-dd'), 'E', 5, 1500);
>
> A. Procede · B. No procede

**Lo que respondió el alumno.** A · Procede.

**Corrección de la plataforma.** 2/2 ✓, rótulo `Correcta:`. Clave: A.

**Resolución del vault.** ✓ **Procede.** `MovimientoUSDT` no tiene `WITH CHECK OPTION`, así que no
controla la condición de su `WHERE`: la fila se inserta en `Movimiento` aunque `'EURO'` no cumpla
`LIKE '%USDT%'`, y queda **invisible** desde la vista ([[1.06.01 - Vistas|Vistas]] § *`WITH CHECK
OPTION`*: es la "migración de tuplas" que el WCO existe para impedir). Corrida:

```
INSERT INTO MovimientoUSDT (…) VALUES ('1', 'EURO', to_date('2020-01-01','yyyy-MM-dd'), 'E', 5, 1500);
ERROR 1305 (42000): FUNCTION parcial1q26.to_date does not exist
INSERT INTO MovimientoUSDT (…) VALUES ('1', 'EURO', STR_TO_DATE('2020-01-01','%Y-%m-%d'), 'E', 5, 1500);
-- ROW_COUNT() = 1 · SELECT * FROM Movimiento → 1 | EURO | 2020-01-01 | E | 5.00 | 1500.00
-- SELECT COUNT(*) FROM MovimientoUSDT → 0
```

(nota) `to_date` es de Oracle y PostgreSQL; en MySQL es `STR_TO_DATE`. No cambia la respuesta: el
enunciado se resuelve en papel.

**Para el parcial.** Sin WCO en la vista destino (ni en las que están debajo), todo `INSERT` válido
para la tabla procede, aunque la fila no se vea después.

## Pregunta 5 — `INSERT` en una vista con `LOCAL CHECK OPTION` (OM, 2 puntos)

**Enunciado.** Mismas tres definiciones de vistas y mismo párrafo que la Pregunta 4.

> d) INSERT INTO MovUSDTValor (id_usuario, moneda, fecha, tipo, comision, valor) VALUES (‘4’, 'USDT',
> to_date('2020-04-04','yyyy-MM-dd'), 'E', 40, 1700);
>
> A. Procede · B. No procede

**Lo que respondió el alumno.** B · No procede.

**Corrección de la plataforma.** 2/2 ✓, rótulo `Correcta:`. Clave: B.

**Resolución del vault.** ✓ **No procede.** `MovUSDTValor` tiene `LOCAL CHECK OPTION`, que controla su
propia condición: `valor < 1200` es falso para 1700. La moneda `'USDT'` cumple la condición de la vista
de abajo, y la comisión 40 no se evalúa (`comision < 25` es de `MovUSDTValorComi`, que está arriba, no
debajo). Corrida:

```
ERROR 1369 (HY000): CHECK OPTION failed 'parcial1q26.MovUSDTValor'
```

**Para el parcial.** `LOCAL` verifica la condición propia más las de las vistas de abajo que tengan su
propio WCO; nunca las de las vistas de arriba.

## Pregunta 6 — persistencia políglota vs. programación políglota (coincidencia, 3 puntos)

**Enunciado.**

> Elija la respuesta correcta de acuerdo a la definición dada.
>
> *Crédito parcial y negativo — Es posible que se hayan deducido puntos por respuestas incorrectas.*
>
> 1. Usar diferentes tipos de base de datos para almacenar datos, de acuerdo a las distintas
>    necesidades de almacenamiento, que requiera una aplicación de software en particular.
> 2. Aplicaciones pueden ser codificadas en una mezcla de diferentes lenguajes de programación, para
>    aprovechar el uso del lenguaje más adecuado para resolver la necesidad requerida

(En pantalla, dos columnas: «Mensajes», con las dos definiciones, y «Respuestas», con el término
elegido para cada una. La revisión no muestra la lista completa de términos entre los que se elegía.)

**Lo que respondió el alumno.** 1 → Persistencia políglota · 2 → **Programación múltiple**.

**Corrección de la plataforma.** 1,5/3, parcial. Ítem 1 `Correcta:`; ítem 2 `Incorrecta:`, con
*"Respuesta correcta: Programación políglota"*.

**Resolución del vault.** 1 → **Persistencia políglota** · 2 → **Programación políglota**. El ítem 2 es
casi textual el slide 4 de la práctica del 04/08: la persistencia políglota *"surge del concepto de
Polyglot programming / Programación políglota (introducido por Neal Ford en 2006)"*, que codifica las
aplicaciones *"en una mezcla de diferentes lenguajes de programación"* ([[2.12.03 - Persistencia políglota|Persistencia políglota]] § 1). "Programación múltiple" es un distractor sin respaldo en
ninguna fuente del vault. **Qué estuvo mal:** el alumno reconoció el concepto de base pero no su
origen; el par correcto usa la misma palabra, *políglota*, en los dos ítems.

**Para el parcial.** Persistencia políglota = varios motores; programación políglota = varios
lenguajes; la primera nace de la segunda.

## Pregunta 7 — partition key y clustering key (ensayo, 5 puntos)

**Enunciado.**

> Responda las siguientes preguntas:
> 1) ¿Qué función cumple la partition key?
> 2) ¿Qué función cumple la clustering key?

**Lo que respondió el alumno.**

> 1) Determinar quien va a participar de la clave
> 2) Determinar el orden de la clave

**Corrección de la plataforma.** 0/5 ✗. Comentario del docente: *"La partition key define cómo se van
a distribuir las tuplas en el cluster, mientras que la clustering key define cómo se van a ordenar
esas tuplas en la particion."*

**Resolución del vault.** **Qué estuvo mal:** las dos respuestas hablan de "la clave" en abstracto,
sin decir qué hace cada parte con los datos. La 1 no menciona distribución ni nodos; la 2 dice
"orden", pero de la clave, no de las filas dentro de la partición.

Respuesta para el puntaje completo ([[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]]; Clase 15, slides 56 y 63–67):

1. **Partition key** — la primera componente de la `PRIMARY KEY` (o el grupo entre paréntesis
   interno, si es compuesta). El particionador la convierte, por hash, en un **token** que ubica la
   partición en el anillo: **decide en qué nodo, y en qué réplicas, se guarda cada fila** (slide 12;
   en Cassandra 5.0.9, `Murmur3Partitioner`). Todas las filas con el mismo valor forman una partición
   y se guardan **físicamente juntas** (slide 56). Por eso una consulta debe dar la partition key
   completa con `=` o `IN`: es lo que le dice al coordinador a qué nodo ir.
2. **Clustering key** — las columnas que siguen. **Ordenan físicamente las filas dentro de la
   partición** (slide 56: *"determina el orden físico en el que se almacenan las filas"*), en orden
   ascendente salvo `CLUSTERING ORDER BY`, y junto con la partition key hacen única a cada fila.
   Permiten rangos (`>`, `<`) y `ORDER BY`, siempre dentro de una partición.

Corrida con la tabla de la Pregunta 34, `PRIMARY KEY ((blogId, time1), time2)`, insertando `time2`
en el orden 3, 1, 2:

```
 blogid | time1 | time2 | token_particion      | content
--------+-------+-------+----------------------+---------
      2 |   100 |     1 | -5513189696995900815 |       x
      1 |   200 |     1 | -1054698038080238620 |       y
      1 |   100 |     1 |  4005968345536564597 |       a
      1 |   100 |     2 |  4005968345536564597 |       b
      1 |   100 |     3 |  4005968345536564597 |       c
```

Las tres filas de `(1, 100)` comparten token (misma partición, mismo nodo) y salen ordenadas por
`time2` aunque se insertaron desordenadas; cada `(blogId, time1)` distinto cae en otro punto del
anillo.

**Para el parcial.** Partition key → **dónde** (qué nodo); clustering key → **en qué orden** dentro de
la partición. Nombrar las dos palabras: distribución y orden.

## Pregunta 8 — MapReduce procesa datos en paralelo (V/F, 1 punto)

**Enunciado.**

> Map-Reduce procesa datos en paralelo.
>
> Verdadero · Falso

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 0/1 ✗, rótulo `Incorrecto:`. Clave: Verdadero.

**Resolución del vault.** **Verdadero.** El modelo existe para paralelizar: *"a master controller
divides the input data into chunks, and assigns different processors to execute the map function on
each chunk"* (GMUW 20.2, *The Map-Reduce Parallelism Framework*, impresa 993). En MongoDB, cada shard
corre su `map` y su `reduce` sobre sus propios documentos y `mongos` fusiona los resultados
parciales (Seven Databases cap. 4.3, impresa 122: *"Classic divide and conquer"*; [[2.14.03 - MapReduce|MapReduce]]). Por eso `reduce` debe ser asociativa, conmutativa e idempotente: se aplica
por lotes y por partes. **Qué estuvo mal:** el alumno contestó bien la Pregunta 17 (`map` emite pares
clave-valor) pero no conectó que cada `map` es independiente y, por eso, paralelizable.

**Para el parcial.** MapReduce = dividir, mapear en paralelo, reducir por clave.

## Pregunta 9 — índice por defecto de MongoDB (OM, 5 puntos)

**Enunciado.**

> ¿Cuál es el tipo de índice default que maneja **MongoDB**?
> ¿Hay índices creados por default como ocurría en **MySQL**?
> En que la respuesta a la 2da pregunta sea afirmativa, ¿sobre qué campo lo aplica?
>
> A. B-Tree - No · B. Hash index - No · C. 2d index - Si - _id · D. 2d index - No · E. Hash index -
> Si - _id · F. B-Tree - Si - _id

**Lo que respondió el alumno.** F.

**Corrección de la plataforma.** 5/5 ✓, rótulo `Correcta:`. Clave: F.

**Resolución del vault.** ✓ **B-Tree, sí, `_id`.** Toda colección nace con un índice único sobre
`_id`, que no se puede borrar; los índices de MongoDB son B-Tree ([[2.14.02 - Índices en MongoDB|Índices en MongoDB]]). Corrida sobre una colección recién creada:

```
[ { v: 2, key: { _id: 1 }, name: '_id_' } ]
```

**Para el parcial.** Como la PK en MySQL/InnoDB, `_id` trae su índice sin pedirlo.

## Pregunta 10 — `DELETE` en `Carrera` (OM, 2 puntos)

**Enunciado.**

> Considere en **MySQL** las tablas a continuación con sus atributos y datos relevantes, con sus
> claves primarias, sus restricciones de integridad referencial (RIR) y acciones referenciales de
> [baja, modificación]:
>
> *R1: Carrera (idFac) << Facultad (idFac): [restrict, restrict]*
> *R2: Materia (carrera, facultad) << Carrera (idCarr, idFac): [restrict, cascade]*
> Nota: respecto de la RIR R2, suponga que los atributos carrera y facultad admiten nulos.

*Materia* (PK `idM`)

| idM | carrera | facultad | nom |
| --- | --- | --- | --- |
| M1 | 1 | F1 | nom1 |
| M2 | 1 | F1 | nom2 |
| M3 | 2 | F2 | nom3 |

*Carrera* (PK compuesta `idCarr`, `idFac`)

| idCarr | idFac | … |
| --- | --- | --- |
| 1 | F1 | … |
| 2 | F2 | … |
| 1 | F2 | … |

*Facultad* (PK `idFac`)

| idFac | ••• |
| --- | --- |
| F1 | … |
| F2 | … |

> Determine el resultado de la ejecución de la siguiente operación:
> **DELETE FROM Carrera WHERE idCarr = 2;**
>
> A. No procede por RIR R1 · B. No procede por RIR R2 · C. Procede

**Lo que respondió el alumno.** C · Procede.

**Corrección de la plataforma.** 0/2 ✗, rótulo `Incorrecta:`. Clave: B. Sin comentario visible: el
tramo que sigue a la opción C no está fotografiado.

**Resolución del vault.** **No procede por RIR R2.** El `DELETE` borra la fila `(2, F2)` de
`Carrera`, que es la **referenciada** por R2: `M3` apunta a `(2, F2)`. La acción de R2 ante baja es
`restrict` (el primer elemento de `[baja, modificación]`), así que la baja se rechaza. R1 no
interviene: gobierna bajas en `Facultad`, no en `Carrera`. Corrida:

```
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails
(`parcial1q26`.`Materia`, CONSTRAINT `R2` FOREIGN KEY (`carrera`, `facultad`)
REFERENCES `Carrera` (`idCarr`, `idFac`) ON DELETE RESTRICT ON UPDATE CASCADE)
```

**Qué estuvo mal:** "Procede" solo sería cierto si ninguna materia referenciara a la carrera 2, o si
R2 fuera `cascade`/`set null` ante baja. La trampa está en el orden del par: `[restrict, cascade]` es
*baja restrict, modificación cascade*; el `cascade` no aplica a un `DELETE`
([[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]]).

**Para el parcial.** Para cada RIR, preguntarse si la operación toca la tabla **referenciada**, si hay
filas que la referencian y cuál es la acción de **esa** operación en el par `[baja, modificación]`.

## Pregunta 11 — objetivo del control de concurrencia (V/F, 1 punto)

**Enunciado.**

> El control de concurrencia busca garantizar que la ejecución simultánea de transacciones no
> comprometa la consistencia de la base de datos.
>
> Verdadero · Falso

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 1/1 ✓, sin rótulo (fila verde). Clave: Verdadero.

**Resolución del vault.** ✓ **Verdadero.** Es la definición: una ejecución concurrente que no
destruye la consistencia es un *schedule* serializable, equivalente a alguna ejecución en serie (GMUW
18.1.3; [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]]).

**Para el parcial.** Control de concurrencia = la "I" de ACID, al servicio de la "C".

## Pregunta 12 — `CHECK` de tupla sobre `Vendedor` (ensayo, 6 puntos)

**Enunciado.**

> Imagine que tiene una tabla **Vendedor** en **MySQL** y alguien agrega posteriormente a la creación
> la siguiente restricción:

```sql
Alter table Vendedor add constraint chk_sueldo_comision
check ( (sueldo > 5000000 and comision = 0 ) or (sueldo <= 5000000) );
```

> Responda las siguientes preguntas:
> 1. ¿Podría explicar qué hace la siguiente restricción?
> 2. ¿De qué tipo de restricción estamos hablando?
> 3. ¿Aplica a datos ya almacenados o solo para datos que se inserten luego de haber creado la
>    restricción?

**Lo que respondió el alumno.**

> 1. Verifica que en caso de que el sueldo sea superior a 5000000 la comision sea 0
> 2. Es una restriccion de insercion
> 3. No aplica sobre los datos ya almacenados, solo para los nuevos datos que se inserten

**Corrección de la plataforma.** 2/6, parcial, sin comentario. Por el contenido, lo más probable es
que los 2 puntos correspondan al ítem 1.

**Resolución del vault.** **Qué estuvo mal:** el ítem 2 inventa una categoría ("de inserción") que no
existe: el tipo es un `CHECK`, y además no controla solo inserciones. El ítem 3 es **falso** en MySQL,
como muestra la corrida. El ítem 1 es correcto pero incompleto: le falta la otra rama.

Respuesta para el puntaje completo:

1. Cada fila debe cumplir que, si el sueldo supera 5.000.000, la comisión sea 0; con sueldo hasta
   5.000.000, la comisión es libre. Es decir: **los vendedores con sueldo mayor a 5 millones no cobran
   comisión**. Se evalúa en todo `INSERT` y en todo `UPDATE`. (nota) Un `CHECK` solo rechaza cuando
   la condición da `FALSE` (Clase 09: *"La condición debe evaluar como VERDADERA o DESCONOCIDA"*):
   con `comision` en `NULL`, la condición da `UNKNOWN` y la fila se acepta aunque el sueldo sea alto.
2. Una **restricción de integridad declarativa `CHECK` de registro o tupla**: relaciona dos columnas
   de **la misma fila**, sin mirar otras filas ni otras tablas (GMUW 7.2.3, *Tuple-Based CHECK
   Constraints*, impresa 321; [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]]). Se
   declara con `ALTER TABLE … ADD CONSTRAINT` y lleva nombre, `chk_sueldo_comision`. Es **el ejemplo
   literal de la Clase 10**, con umbral 5000, en el tipo *"2. A nivel de Fila — Involucra el control
   de una restricción entre columnas de una misma fila o tupla"*; la Clase 09 lo llama *"RI (CHECK) de
   registro"*. (atención) El solucionario de estudiantes de la misma pregunta en el [[Parcial 2Q2025]]
   (P25) dice *"a nivel de tabla"*: contradice al deck, que reserva ese nivel para restricciones entre
   **varias filas** de una tabla (*"el promedio de edad de cada Departamento…"*). Manda el deck.
3. **Aplica también a los datos ya almacenados.** Al crearla, MySQL verifica todas las filas
   existentes; si alguna la viola, el `ALTER TABLE` falla y la restricción no se crea. Una vez creada,
   controla cada `INSERT` y cada `UPDATE`. Para crearla sin validar lo existente hay que declararla
   `NOT ENFORCED`, y entonces tampoco controla lo nuevo.

Corrida con una fila `(1, 6000000, 10000)` cargada antes:

```
Alter table Vendedor add constraint chk_sueldo_comision check (…);
ERROR 3819 (HY000): Check constraint 'chk_sueldo_comision' is violated.
UPDATE Vendedor SET comision = 0 WHERE id = 1;   -- se corrige la fila
Alter table Vendedor add constraint chk_sueldo_comision check (…);   -- ahora sí se crea
INSERT INTO Vendedor VALUES (3, 7000000, 100);
ERROR 3819 (HY000): Check constraint 'chk_sueldo_comision' is violated.
UPDATE Vendedor SET sueldo = 6000000 WHERE id = 2;   -- id 2 tiene comisión 50000
ERROR 3819 (HY000): Check constraint 'chk_sueldo_comision' is violated.
INSERT INTO Vendedor VALUES (4, 9000000, NULL);   -- procede: UNKNOWN no viola
```

Con `NOT ENFORCED`, en cambio, el `ALTER` procede sobre una fila `(5, 8000000, 777)` que la viola, e
`information_schema.TABLE_CONSTRAINTS` la muestra con `ENFORCED = NO`.

**Para el parcial.** Nombrar el tipo con el vocabulario de la cátedra (`CHECK` de registro, a nivel de
fila o tupla), no por la operación ni "de tabla". Un `CHECK` agregado con `ALTER` valida lo
existente; un trigger no.

## Pregunta 13 — bloqueo compartido (V/F, 1 punto)

**Enunciado.**

> Los bloqueos compartidos (Shared Lock) permiten tanto lectura como escritura concurrente sobre un
> dato.
>
> Verdadero · Falso

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 1/1 ✓, sin rótulo (fila verde). Clave: Falso.

**Resolución del vault.** ✓ **Falso.** El bloqueo compartido (S) deja que varias transacciones **lean**
el dato a la vez, pero ninguna puede escribirlo mientras haya un S tomado: escribir exige el bloqueo
exclusivo (X), incompatible con cualquier otro ([[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]]).

**Para el parcial.** S con S, sí; S con X, no; X con nada.

## Pregunta 14 — QUORUM con RF 5 (ensayo, 8 puntos)

**Enunciado.**

> Suponga:
> - RF = 5
> - **Escritura con QUORUM**
> - **Lectura con QUORUM**
>
> **Responda las siguientes preguntas:**
> a) ¿Cuántos nodos deben confirmar?
> b) ¿Se garantiza consistencia fuerte? Justifique.
> c) ¿Qué ocurre si dos nodos tienen datos viejos?
> d) ¿Qué mecanismo corrige automáticamente el problema?

**Lo que respondió el alumno.**

> a. 3
> b. si ya que se utiliza QUORUM
> c. se actualizan
> d.

(El ítem d quedó vacío.)

**Corrección de la plataforma.** 2/8, parcial. Comentario del docente, en tres líneas:

> b) no responde a la consitencia
> c) no se menciona cómo
> d)sin hacer

El comentario no objeta el ítem a: de ahí salen, con toda probabilidad, los 2 puntos.

**Resolución del vault.** **Qué estuvo mal:** el ítem a está bien; el b repite la pregunta sin
justificar (falta la desigualdad R + W > RF); el c no dice quién detecta la diferencia ni cómo se
corrige; el d quedó en blanco.

Respuesta para el puntaje completo ([[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]]; Clase 15, slides 27–28 y 40–47):

- **a)** QUORUM = ⌊RF / 2⌋ + 1 = ⌊5 / 2⌋ + 1 = **3 réplicas**: 3 deben confirmar cada escritura y 3
  deben responder cada lectura (slides 45–46: *"(replication_factor/2)+1"*, con división entera).
- **b)** **Sí.** W + R = 3 + 3 = 6 > RF = 5. Como dos conjuntos de 3 réplicas sobre 5 **se solapan en
  al menos una** (3 + 3 − 5 = 1), toda lectura en QUORUM consulta al menos una réplica que confirmó la
  última escritura en QUORUM, y el coordinador devuelve la versión con el *timestamp* más reciente
  (slides 27 y 43). La regla W + R > N es la de consistencia fuerte de Corbellini § 3.2, p. 6
  (*"Strong Consistency is reached by fulfilling W + R > N"*, en el texto junto a la Table 3), y el
  deck lo resume en el slide 46: QUORUM *"proporciona una fuerte consistencia si se puede tolerar
  cierto nivel de fracaso"*. El sistema tolera además hasta 2 réplicas caídas sin dejar de responder.
- **c)** Si dos réplicas tienen el dato viejo, las otras tres tienen el nuevo (a lo sumo RF − W = 2
  pueden haber quedado atrás). La lectura contacta 3: al menos una trae el valor nuevo. El
  coordinador pide el dato completo a una réplica y *digests* a las demás (slides 42–43); si no
  coinciden, **toma la versión de *timestamp* más reciente, la devuelve al cliente y sobrescribe las
  réplicas viejas** (slide 42). El cliente nunca ve el valor viejo. Precisión *(documentación
  oficial, no está en el deck)*: en Cassandra 4.0 y posteriores la reparación de lectura corrige solo
  las réplicas que participaron de esa lectura; si una de las dos réplicas viejas no fue consultada,
  queda desactualizada hasta otra lectura que la incluya o hasta un `repair` (ítem d).
- **d)** La **reparación de lectura** (*read repair*, slides 28 y 42): la corrección que se dispara al
  leer. La completan dos mecanismos más: el `repair` de mantenimiento que nombra el slide 47
  (`nodetool repair`), para réplicas que nadie lee, y la reparación diferida de escrituras hacia
  réplicas caídas, que Corbellini § 3.2 llama *write-repair* *(hinted handoff en la documentación
  oficial; no está en el deck)*.

Corridas. Con RF 5 sobre el único nodo del contenedor, QUORUM pide exactamente 3 réplicas:

```
Warnings :
Your replication factor 5 for keyspace parcial1q26_rf5 is higher than the number of nodes 1
Consistency level set to QUORUM.
NoHostAvailable: … Unavailable … message="Cannot achieve consistency level QUORUM"
info={'consistency': 'QUORUM', 'required_replicas': 3, 'alive_replicas': 1}
```

Y la tabla muestra la reparación de lectura vigente:

```
    AND read_repair = 'BLOCKING'
ALTER TABLE parcial1q26_rf5.t WITH read_repair_chance = 0.1;
SyntaxException: Unknown property 'read_repair_chance'
```

(atención) El deck (slides 28, 42 y 45) la describe **en segundo plano** (*background read repair*).
Desde Cassandra 4.0 ya no existe esa variante probabilística (`read_repair_chance` es propiedad
desconocida en 5.0.9): la reparación es **bloqueante** y ocurre durante la lectura, antes de responder.
Para el examen, "reparación de lectura" es la respuesta; el detalle de versión está en [[Cassandra]].

**Para el parcial.** QUORUM con RF 5 = 3. Consistencia fuerte ⇔ R + W > RF; los datos viejos los
detecta el *digest* y los corrige el *read repair*.

## Pregunta 15 — replicación vs. sharding (OM, 2 puntos)

**Enunciado.**

> ¿Qué diferencia existe entre Replicación y Sharding?
>
> A. El sharding busca garantizar que siempre haya copias de los datos disponibles, mientras que la
> replicación permite escalar una base de datos distribuida horizontalmente.
> B. El sharding busca garantizar que siempre haya copias de los datos disponibles y permite escalar
> una base de datos distribuida horizontalmente. La replicación persigue exactamente lo mismo.
> C. La replicación busca garantizar que siempre haya copias de los datos disponibles, mientras que
> el sharding permite escalar una base de datos distribuida horizontalmente.
> D. Ninguna de las opciones.

**Lo que respondió el alumno.** B.

**Corrección de la plataforma.** 0/2 ✗, rótulo `Incorrecta:`. Clave: C.

**Resolución del vault.** **C.** La **replicación** copia los mismos datos en varios nodos: da
disponibilidad y tolerancia a fallas (y escala lecturas). El **sharding** reparte **datos distintos**
entre nodos: escala almacenamiento y escrituras ([[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]]). **Qué estuvo mal:** B dice que persiguen "exactamente lo
mismo"; se combinan (cada shard de MongoDB es un *replica set*), pero resuelven problemas distintos.
A es la trampa espejo: invierte los roles.

**Para el parcial.** Replicación = copias (disponibilidad); sharding = partes (escala).

## Pregunta 16 — coordinación de nodos delegada en una herramienta externa (OM, 2 puntos)

**Enunciado.**

> ¿Cuál de las siguientes bases delega el mecanismo de coordinación de nodos en una herramienta
> externa?
> Por ejemplo, el reemplazo de nodo maestro caído por un nodo esclavo preparado
>
> A. Ninguna de las opciones. · B. MySQL · C. Cassandra · D. Neo4j · E. MongoDB

**Lo que respondió el alumno.** D · Neo4j.

**Corrección de la plataforma.** 2/2 ✓, rótulo `Correcta:`. Clave: D.

**Resolución del vault.** ✓ **Neo4j** *(no verificado en el motor: Neo4j no tiene contenedor)*. Seven
Databases cap. 6.4 (*Day 3: Distributed High Availability*, impresa 203): *"Previously, Neo4j
clusters relied on ZooKeeper as an external coordination mechanism"*. Cassandra coordina por *gossip*
entre pares, sin maestro (Clase 15, slides 25–28), y MongoDB elige primario dentro del propio *replica
set* ([[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]]).
(atención) La misma página aclara que eso cambió: *"Now, Neo4j clusters are self-managing and
self-coordinating"*. La clave describe el Neo4j HA clásico, que es el que evalúa la cátedra.

**Para el parcial.** Neo4j HA clásico → ZooKeeper; Cassandra → *gossip*; MongoDB → elecciones del
*replica set*.

## Pregunta 17 — la función `map` emite pares clave-valor (V/F, 1 punto)

**Enunciado.**

> La función map de Map-Reduce, genera pares clave-valor
>
> Verdadero · Falso

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 1/1 ✓, sin rótulo (fila verde). Clave: Verdadero.

**Resolución del vault.** ✓ **Verdadero.** En MongoDB, `map` llama a `emit(clave, valor)` por cada
documento; `reduce` recibe cada clave con la lista de sus valores ([[2.14.03 - MapReduce|MapReduce]]).
Es la mitad que el alumno sí sabía; la Pregunta 8 es la otra.

**Para el parcial.** `map` → `emit(k, v)`; `reduce(k, [v…])` → un valor por clave.

## Pregunta 18 — relaciones en Neo4j (V/F, 1 punto)

**Enunciado.**

> En **Neo4j**, las relaciones son bidireccionales por defecto y no pueden tener propiedades.
>
> Verdadero · Falso

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 1/1 ✓, sin rótulo (fila verde). Clave: Falso.

**Resolución del vault.** ✓ **Falso**, por las dos mitades *(no verificado en el motor)*. Toda
relación se crea **con dirección** (`CREATE (p)-[r:reported_on]->(w)`), aunque una consulta puede
recorrerla en cualquier sentido con `-[r]-` o invirtiendo la flecha (Seven Databases cap. 6.2,
impresa 182, y cap. 6.3, impresa 197). Y las relaciones **sí tienen propiedades**: *"Relationships,
like nodes, can contain properties"*, con el ejemplo `SET r.rating = 97` (cap. 6.2, impresa 183).

**Para el parcial.** Relación dirigida al crearla, consultable en ambos sentidos, con propiedades.

## Pregunta 19 — `UPDATE` en `Carrera` que duplica la PK (OM, 2 puntos)

**Enunciado.** Mismo texto, mismas RIR, misma nota y mismas tres tablas que la Pregunta 10.

> Determine el resultado de la ejecución de la siguiente operación:
> **UPDATE carrera SET idFac='F1' WHERE idFac='F2';**
>
> A. No procede por restricción de unicidad · B. Procede · C. No procede por RIR R2 · D. No procede
> por restricción de integridad referencial · E. No procede por RIR R1

**Lo que respondió el alumno.** E · No procede por RIR R1.

**Corrección de la plataforma.** 0/2 ✗, rótulo `Incorrecta:`. Clave: A.

**Resolución del vault.** **No procede por restricción de unicidad.** Se modifican dos filas de
`Carrera`: `(2, F2)` → `(2, F1)` y `(1, F2)` → `(1, F1)`. La segunda choca con la `(1, F1)` que ya
existe: viola la **PK compuesta** `(idCarr, idFac)`. Las RIR no bloquean nada:

- **R1** (`Carrera.idFac` → `Facultad`) solo exige que el nuevo valor exista en `Facultad`, y `F1`
  existe. Su `[restrict, restrict]` gobierna bajas y modificaciones **en `Facultad`**, la tabla
  referenciada; aquí se modifica la que referencia.
- **R2** es `cascade` ante modificación: llevaría `M3` de `(2, F2)` a `(2, F1)`.

Corrida:

```
UPDATE Carrera SET idFac='F1' WHERE idFac='F2';
ERROR 1062 (23000): Duplicate entry '1-F1' for key 'Carrera.PRIMARY'
```

La sentencia es atómica: `Carrera` y `Materia` quedan como estaban. Sin la fila `(1, F2)`, el mismo
`UPDATE` procede y la cascada de R2 lleva `M3` a `(2, F1)` (corrida dentro de una transacción
revertida después).

**Qué estuvo mal:** el alumno aplicó el `restrict` de R1 a la tabla equivocada. Las acciones de una RIR
se disparan cuando se modifica la tabla **referenciada**; en la que referencia solo se controla que
el valor nuevo exista.

**Para el parcial.** Antes de mirar las RIR, verificar la PK y los `UNIQUE` de la tabla que se modifica:
es la trampa preferida de este esquema.

## Pregunta 20 — modelo embebido vs. referencias en MongoDB (ensayo, 6 puntos)

**Enunciado.**

> Explique las ventajas y desventajas de implementar un modelo embebido vs. no hacerlo en **MongoDB**.

**Lo que respondió el alumno.**

> al aplicar un modelo embebido, las consultas son menos costas en comparacion a si no lo hicieramos.

**Corrección de la plataforma.** 1/6, parcial, sin comentario.

**Resolución del vault.** **Qué estuvo mal:** una sola ventaja, sin justificar, y ninguna desventaja;
la pregunta pide las dos columnas y, para el puntaje completo, el criterio para elegir.

Respuesta para el puntaje completo ([[2.13.01 - Documentos embebidos vs. referencias|Documentos embebidos vs. referencias]]; Clase 13, slides 2–8):

| | Embebido (desnormalizado) | Referencias (normalizado) |
| --- | --- | --- |
| Lectura | **una consulta** trae el conjunto, sin `$lookup` ni viajes extra | varias consultas o un `$lookup` |
| Escritura | **atómica**: el documento se escribe todo o nada | cada documento por separado |
| Duplicación | se duplica el dato compartido; cambiarlo obliga a tocar cada copia | sin duplicación |
| Tamaño | techo de **16 MB por documento** y 100 niveles de anidamiento; un arreglo que crece sin cota termina por no caber | documentos pequeños |
| Acceso independiente | consultar el subdocumento solo es incómodo (`$unwind`) | cada entidad se consulta sola |

**Criterio:** embeber en relaciones *"contiene"*, 1:1 o 1:pocos que se leen juntas; referenciar en
N:M, en jerarquías grandes o crecientes, o cuando el dato embebido se comparte y se actualiza seguido.

Corridas. El techo de tamaño:

```
db.embebido.insertOne({_id: 1, comentarios: "x".repeat(16*1024*1024 + 100)})
MongoServerError: object to insert too large. size in bytes: 16777348, max size: 16777216
```

Y el mismo autor con sus libros, embebido (un `findOne` devuelve todo) frente a referenciado (hace falta
`$lookup` para armar el mismo resultado):

```js
db.autoresEmb.findOne({_id: "a1"})
// { _id: 'a1', nombre: 'Ana', libros: [ { titulo: 'L1' }, { titulo: 'L2' } ] }
db.autores.aggregate([{ $match: {_id: "a1"} },
  { $lookup: { from: "libros", localField: "_id", foreignField: "autor", as: "libros" } }])
// [ { _id: 'a1', nombre: 'Ana', libros: [ { titulo: 'L1', autor: 'a1' }, { titulo: 'L2', autor: 'a1' } ] } ]
```

**Para el parcial.** Ensayo de "ventajas y desventajas": tabla de dos columnas más el criterio de
decisión.

## Pregunta 21 — `INSERT` con FK compuesta y un `NULL` (OM, 2 puntos)

**Enunciado.** Mismo texto, mismas RIR, misma nota y mismas tres tablas que la Pregunta 10.

> Determine el resultado de la ejecución de la siguiente operación:
> **INSERT INTO Materia (idM, carrera, facultad, nom) VALUES ('M4', 3, null, 'nom4');**
>
> A. No procede por RIR R2 · B. Procede si la FK se declaró con MATCH parcial · C. Procede si la FK se
> declaró con MATCH full · D. No procede por RIR R1 · E. No procede por restricción de unicidad ·
> F. Procede · G. Procede si la FK se declaró con MATCH simple

**Lo que respondió el alumno.** G.

**Corrección de la plataforma.** 2/2 ✓, rótulo `Correcta:`. Clave: G. Sin comentario visible: el
tramo que sigue a la opción G no está fotografiado.

**Resolución del vault.** ✓ **Procede si la FK se declaró con `MATCH SIMPLE`.** Con `SIMPLE`, basta un
componente nulo para dar la referencia por satisfecha, sin buscar `(3, ·)` en `Carrera`; con
`PARTIAL`, los componentes no nulos deben coincidir con alguna fila (no hay `idCarr = 3`); con `FULL`,
o todos nulos o ninguno ([[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] § *Tipos de matching*). Corrida:

```
INSERT INTO Materia (idM, carrera, facultad, nom) VALUES ('M4', 3, null, 'nom4');
-- procede: M4 | 3 | NULL | nom4
INSERT INTO Materia (idM, carrera, facultad, nom) VALUES ('M5', 3, 'F1', 'nom5');
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (… CONSTRAINT `R2` …)
```

(atención) En MySQL la opción F también sería cierta: el motor implementa solo `SIMPLE`, acepta `MATCH
FULL` sin error y no lo aplica. Con `MATCH FULL` declarado, el mismo `INSERT` procede; `SHOW CREATE
TABLE` omite la cláusula, aunque `information_schema.REFERENTIAL_CONSTRAINTS` la registra
(`MATCH_OPTION = FULL`), y las acciones de R2 siguen vigentes (el `DELETE` de la P10 da el mismo
`ERROR 1451` y la cascada de modificación funciona). La clave es G porque la pregunta evalúa la teoría del estándar; ante
opciones así, elegir la condicionada al tipo de *matching*.

**Para el parcial.** Un `NULL` en una FK compuesta: `SIMPLE` acepta, `PARTIAL` mira el resto, `FULL`
exige todo o nada.

## Pregunta 22 — vista `ConstructorVIP` (ensayo, 6 puntos)

**Enunciado.**

> Considerando el siguiente esquema de BD:

| Tabla | Columna | Tipo | Marcas |
| --- | --- | --- | --- |
| EJECUTA | id_obra | int | PK FK |
| EJECUTA | tipo_doc | varchar(10) | PK FK |
| EJECUTA | nro_doc | int | PK FK |
| EJECUTA | presupuesto | decimal(12,2) | |
| CONSTRUCTOR | tipo_doc | char(3) | PK |
| CONSTRUCTOR | nro_doc | int | PK |
| CONSTRUCTOR | nombre | varchar(30) | |
| CONSTRUCTOR | apellido | varchar(30) | |
| CONSTRUCTOR | antiguedad | integer | |
| OBRA | id_obra | int | PK |
| OBRA | superficie | decimal(6,2) | |
| OBRA | direccion | varchar(30) | |
| OBRA | anio_inicio | int | |
| OBRA | anio_finalizacion | int | N |
| OBRA | tipo_o | char(1) | |
| OBRA | tipo_doc | char(3) | N FK |
| OBRA | nro_doc | int | N FK |
| OBRA_PRIVADA | id_obra | int | PK FK |
| OBRA_PRIVADA | arquitecto | varchar(40) | |
| OBRA_CIVIL | id_obra | int | PK FK |
| OBRA_CIVIL | ingeniero_resp | varchar(40) | |

(`N` = admite nulos. Relaciones: CONSTRUCTOR 1 — 0..N EJECUTA; OBRA 1 — 0..N EJECUTA; CONSTRUCTOR
0..1 — 0..N OBRA, por la FK nulable `tipo_doc`, `nro_doc`; OBRA 1 — 0..1 OBRA_PRIVADA; OBRA 1 — 0..1
OBRA_CIVIL.)

> Nota del diagrama: *Este esquema es parte de un sistema de construcciones de obras civiles y
> privadas donde se registran los datos de los constructores que llevan adelante cada obra. Los
> constructores se identifican por su tipo y número de documento y se registran sus datos personales y
> su antigüedad en la ejecución de obras, Cada obra puede ser civil o privada, y puede tener un
> constructor que la supervise, externo a los constructores que la ejecutan.*
>
> Definir en **MySQL** la vista “*ConstructorVIP*” conteniendo el identificador del constructor, la
> cantidad de obras privadas actualmente en ejecución y el monto total de los presupuestos de dichas
> obras, sólo si superan el medio millón de dólares.
> ¿La vista es actualizable? Justifique brevemente su respuesta.

**Lo que respondió el alumno.**

> ```sql
> -- Supongo que debo tener en cuenta unicamente los presupuestos mayores a medio millon
> -- Tambien supongo que el año de finalizacion se agrega una vez terminada la obra, que no es una prediccion del futuro.
>
> CREATE VIEW ConstructorVIP AS
> SELECT c.tipo_doc, c.nro_doc, count(op.id_obra), sum(e.presupuesto)
> FROM constructor c
> JOIN ejecuta e ON c.tipo_doc = e.tipo_doc AND c.nro_doc = e.nro_doc
> JOIN obra o ON e.id_obra = o.id_obra
> JOIN obra_privada op ON o.id_obra = op.id_obra
> WHERE o.anio_finalizacion IS NULL AND e.presupuesto > 500000
> GROUP BY c.tipo_doc, c.nro_doc;
>
> La vista no es actualizable ya que tiene JOINs y GROUP BY
> ```

**Corrección de la plataforma.** 4/6, parcial, sin comentario.

**Resolución del vault.** **Qué estuvo mal**, en orden de peso:

1. **El umbral va sobre el total, no sobre cada obra.** *"el monto total de los presupuestos de dichas
   obras, sólo si superan el medio millón"*: lo que debe superar 500.000 es la suma, así que va en
   `HAVING SUM(e.presupuesto) > 500000`. El `WHERE e.presupuesto > 500000` del alumno descarta obras
   **antes** de agrupar y cambia las dos cifras: deja fuera a quien tiene varias obras pequeñas que
   suman más de medio millón, y a quien sí aparece le cuenta y le suma solo las obras grandes. El
   verbo en plural (*"superan"*) deja lugar a la lectura del alumno, pero lo que define a un
   constructor como VIP es el total, y el solucionario de estudiantes de la misma vista en el
   [[Parcial 2Q2025]] (P27) también filtra con `HAVING SUM(e.presupuesto)`. Es, con toda
   probabilidad, lo que le costó los 2 puntos.
2. **La justificación es correcta para la cátedra, pero no es la razón de fondo.** Las dos causas
   que dio el alumno están en la lista de la Clase 07, slide 13 (*"Una vista en MySQL no es
   actualizable si: … GROUP BY … ENSAMBLES (joins)"*). (atención) El motor matiza el `JOIN`: una vista
   de ensamble sin agregación **es** actualizable en MySQL 9.7.2 (`IS_UPDATABLE = YES`) para
   `UPDATE` e `INSERT` que tocan una sola tabla; lo que el `JOIN` impide es el `DELETE` (`ERROR 1395
   … Can not delete from join view`) y escribir en dos tablas a la vez (`ERROR 1393`). Lo que hace a
   `ConstructorVIP` no actualizable para **cualquier** operación es la agregación con `GROUP BY`:
   conviene darla como razón principal y el `JOIN` como agravante.
3. Detalles menores: las columnas calculadas quedan sin alias (MySQL las llama `count(op.id_obra)` y
   `sum(e.presupuesto)`), y el `JOIN` con `CONSTRUCTOR` sobra, porque `EJECUTA` ya trae `tipo_doc` y
   `nro_doc`. Dejar escritos los supuestos, como hizo el alumno, es buena práctica.

Vista para el puntaje completo (supuesto: *"en ejecución"* = `anio_finalizacion IS NULL`):

```sql
CREATE VIEW ConstructorVIP AS
SELECT e.tipo_doc, e.nro_doc,
       COUNT(*)           AS cant_obras_privadas_en_ejecucion,
       SUM(e.presupuesto) AS total_presupuesto
FROM ejecuta e
JOIN obra o          ON o.id_obra = e.id_obra
JOIN obra_privada op ON op.id_obra = o.id_obra
WHERE o.anio_finalizacion IS NULL
GROUP BY e.tipo_doc, e.nro_doc
HAVING SUM(e.presupuesto) > 500000;
```

**No es actualizable**: tiene `GROUP BY`, `HAVING` y funciones de agregación, así que cada fila de la
vista resume varias filas de `EJECUTA` y no hay correspondencia 1 a 1 con las tablas base; no es una
vista σ-π-⋈ ([[1.06.01 - Vistas|Vistas]] § *Tabla de decisión*, filas 1 y 2).

Corrida con cuatro constructores: el 1 con dos obras privadas en ejecución de 300.000 cada una; el 2
con una de 600.000 y otra de 100.000; el 3 con una privada terminada y una civil en ejecución; el 4 con
una privada de 400.000.

```
-- vista del alumno
| tipo_doc | nro_doc | count(op.id_obra) | sum(e.presupuesto) |
| DNI      |       2 |                 1 |          600000.00 |
-- vista del vault
| tipo_doc | nro_doc | cant_obras_privadas_en_ejecucion | total_presupuesto |
| DNI      |       1 |                                2 |         600000.00 |
| DNI      |       2 |                                2 |         700000.00 |
```

```
information_schema.VIEWS → ConstructorVIP: IS_UPDATABLE = NO
UPDATE ConstructorVIP SET total_presupuesto = 1 WHERE nro_doc = 1;
ERROR 1288 (HY000): The target table ConstructorVIP of the UPDATE is not updatable
INSERT INTO ConstructorVIP (tipo_doc, nro_doc) VALUES ('DNI', 9);
ERROR 1471 (HY000): The target table ConstructorVIP of the INSERT is not insertable-into
DELETE FROM ConstructorVIP WHERE nro_doc = 1;
ERROR 1288 (HY000): The target table ConstructorVIP of the DELETE is not updatable
-- contraste: OBRA ⋈ OBRA_PRIVADA sin agregación
information_schema.VIEWS → ObraPrivadaEnEjecucion: IS_UPDATABLE = YES
UPDATE ObraPrivadaEnEjecucion SET arquitecto = 'arq1-bis' WHERE id_obra = 101;   -- ROW_COUNT() = 1
```

La vista del alumno pierde al constructor 1 (600.000 en dos obras) y le informa al 2 una obra y 600.000
en lugar de dos obras y 700.000.

**Para el parcial.** Condición sobre un agregado → `HAVING`; sobre filas → `WHERE`. No actualizable,
ante todo, por la agregación; el `JOIN`, que la Clase 07 también lista, en MySQL solo impide el
`DELETE` y las escrituras sobre dos tablas.

## Pregunta 23 — la anomalía del *schedule* de `pedidos` (ensayo, 6 puntos)

**Enunciado.**

> Considere la tabla ***pedidos(id, total)***, inicialmente con 2 pedidos, ambos con total > 1000.

| Paso | Operación |
| --- | --- |
| 1 | T1: SELECT COUNT(*) FROM pedidos WHERE total > 1000; → *devuelve 2* |
| 2 | T2: INSERT INTO pedidos VALUES (3,2000); |
| 3 | T2: COMMIT; |
| 4 | T1: SELECT COUNT(*) FROM pedidos WHERE total > 1000; → *devuelve 3* |
| 5 | T1: COMMIT; |

> Responda las siguientes 2 preguntas:
> 1. ¿Qué anomalía ocurre?
> 2. ¿Qué nivel de aislamiento lo evita? Escriba la sentencia SQL para asignar ese nivel de
>    aislamiento.

**Lo que respondió el alumno.**

> Anomalia de insercion.

**Corrección de la plataforma.** 0/6 ✗. Comentario del docente: *"phantom read/serializable"*.

**Resolución del vault.** **Qué estuvo mal:** "anomalía de inserción" es un término de **diseño**
(las anomalías de actualización que resuelve la normalización), no de concurrencia; y la segunda
pregunta, nivel y sentencia, quedó sin responder.

Respuesta para el puntaje completo ([[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]]):

1. **Lectura fantasma (*phantom read*).** T1 repite la misma consulta con el mismo predicado
   (`total > 1000`) y el **conjunto** de filas cambió: apareció una fila nueva que T2 insertó y
   confirmó en el medio. No es *dirty read* (T2 confirmó antes de la segunda lectura) ni *non-repeatable
   read* (ninguna fila ya leída cambió de valor: hay una fila **nueva**) (GMUW 18.6.3, *Phantoms and
   Handling Insertions Correctly*, impresa 926).
2. **`SERIALIZABLE`**, el único nivel del estándar que evita los fantasmas; `REPEATABLE READ` evita la
   lectura no repetible pero no el fantasma. La sentencia, antes de que T1 empiece:

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;          -- para la próxima transacción
START TRANSACTION;
-- o, para toda la sesión:
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

Corrida en MySQL 9.7.2 con dos sesiones reales (T2 comienza 1 segundo después de la primera lectura de
T1; T1 espera 3 segundos entre sus dos lecturas):

```
=== T1 en READ COMMITTED
T1 paso 1: 2  t=38.248
T2 INSERT hecho t=39.283
T1 paso 4: 3  t=41.250          ← el fantasma del enunciado
=== T1 en REPEATABLE READ
T1 paso 1: 2  t=41.475
T2 INSERT hecho t=42.486
T1 paso 4: 2  t=44.480
=== T1 en SERIALIZABLE
T1 paso 1: 2  t=44.828
T1 paso 4: 2  t=47.835
T1 commit   t=47.836
T2 INSERT hecho t=47.837        ← T2 esperó a que T1 terminara
```

(atención) En MySQL/InnoDB, `REPEATABLE READ` (el nivel por defecto) **ya evita este fantasma** en
lecturas comunes, porque la transacción lee de una foto tomada en su primera lectura; el estándar no
lo exige, y una lectura con bloqueo (`FOR SHARE`) sí ve la fila nueva
([[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] § 6.2).
`SERIALIZABLE` lo evita por bloqueo: la lectura de T1 toma bloqueos compartidos sobre el rango, y el
`INSERT` de T2 queda en espera hasta el `COMMIT` de T1. La respuesta del parcial es la
del estándar y la del docente, `SERIALIZABLE`; la diferencia de InnoDB va, si acaso, como aclaración
y no en su lugar.

**Para el parcial.** Fila que cambia → *non-repeatable*; conjunto que gana o pierde filas →
*phantom* → `SERIALIZABLE`. Escribir siempre la sentencia `SET TRANSACTION ISOLATION LEVEL …`.

## Pregunta 24 — Cassandra no es master-slave (V/F, 1 punto)

**Enunciado.**

> La arquitectura de **Cassandra** es Master-Slave
>
> Verdadero · Falso

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 1/1 ✓, sin rótulo (fila verde). Clave: Falso.

**Resolución del vault.** ✓ **Falso.** Clase 15, slide 12: *"Implementa una arquitectura Peer-to-Peer,
lo que elimina los puntos de fallo único y no sigue patrones maestro-esclavo"*; cualquier nodo puede
coordinar una consulta (slide 26). Corbellini § 5.2, p. 13, en el mismo sentido ([[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]]).

**Para el parcial.** Cassandra: anillo P2P, sin maestro, coordinador por consulta.

## Pregunta 25 — Neo4j y ACID (V/F, 1 punto)

**Enunciado.**

> **Neo4j** está diseñado para soportar transacciones ACID, garantizando seguridad y consistencia en
> los datos.
>
> Verdadero · Falso

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 0/1 ✗, rótulo `Incorrecto:`. Clave: Verdadero.

**Resolución del vault.** **Verdadero** *(no verificado en el motor)*. Seven Databases cap. 6.4,
impresa 202: *"Neo4j is an Atomic, Consistent, Isolated, Durable (ACID) transaction database, similar
to PostgreSQL"*; cada consulta es una transacción todo-o-nada, y en el shell se delimitan con
`:begin` y `:commit`. **Qué estuvo mal:** probablemente la asociación "NoSQL = BASE, sin ACID"
([[2.12.05 - BASE y consistencia eventual|BASE]]). Neo4j es la excepción de la segunda mitad: un
motor NoSQL transaccional como un relacional ([[1.11.03 - Transacciones y ACID|Transacciones y ACID]]).
(nota) El mismo libro matiza (impresa 203) que en modo HA una escritura en un esclavo no se propaga al
instante: *"HA will lose pure ACID-compliant transactions"*. La afirmación del examen es sobre el diseño
del motor y es verdadera.

**Para el parcial.** Neo4j: grafo **y** ACID. No todo NoSQL es BASE.

## Pregunta 26 — componentes de un nodo de Cassandra (OM varias, 3 puntos)

**Enunciado.**

> Los componentes de un nodo de **Cassandra** son:
>
> A. Commit Log · B. Memtable · C. Disk table · D. Memory space · E. Ninguna de las opciones. ·
> F. SSTable

**Lo que respondió el alumno.** A, B y F.

**Corrección de la plataforma.** 3/3 ✓, rótulo `Correcta:` en A, B y F. Clave: A (33,34 %),
B (33,33 %), F (33,33 %); C, D y E -33,33 % cada una.

**Resolución del vault.** ✓ **Commit Log, Memtable y SSTable.** Clase 15, slide 30: el *commit log*
registra cada escritura para recuperarse de una falla; la *MemTable* es *"una estructura de datos
residente en la memoria"*; la *SSTable*, el archivo **inmutable en disco** al que se vuelca la
MemTable cuando se llena ([[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]]). El slide nombra un cuarto elemento, los
filtros de Bloom, que la pregunta no ofrece. "Disk table" y "Memory space" no existen.

**Para el parcial.** Escritura: commit log (disco, durabilidad) → MemTable (memoria) → *flush* a
SSTable (disco, inmutable).

## Pregunta 27 — interpretar un `aggregate` (ensayo, 3 puntos)

**Enunciado.**

> Interprete y explique con sus palabras que hace la siguiente query de **MongoDB**:

```js
db.orders.aggregate([
                    { $match: { size: "medium", status: "completed" }
                     },
                    { $group: { _id: "$type", totalQuantity: { $sum: "$quantity" } }
                    }
])
```

**Lo que respondió el alumno.**

> primero verifica que se cumpla la condicion de que size sea medium y status sea completed. Luego
> agrupa por tipo y suma las cantidades por tipo en la variable totalQuantity.

**Corrección de la plataforma.** 3/3 ✓, sin comentario.

**Resolución del vault.** ✓ Correcta. Precisiones para una respuesta impecable ([[2.12.08 - Aggregation pipeline|Aggregation pipeline]]): `$match` con dos campos es un **AND** implícito; la
salida es **un documento por valor de `type`**, con el tipo en `_id` y la suma en `totalQuantity`
(un campo del documento de salida, más que una "variable"); y equivale a `SELECT type, SUM(quantity)
FROM orders WHERE size = 'medium' AND status = 'completed' GROUP BY type`. Corrida con seis órdenes
(se agrega un `$sort` solo para fijar el orden de salida, que `$group` no garantiza):

```
[ { _id: 'burger', totalQuantity: 5 }, { _id: 'pizza', totalQuantity: 5 } ]
```

La orden `large` y la `pending` quedan fuera por el `$match`; `pizza` suma 2 + 3.

**Para el parcial.** Leer un pipeline etapa por etapa y traducirlo a SQL.

## Pregunta 28 — proyectos por investigador (ensayo, 5 puntos)

**Enunciado.**

> Suponga que crean 2 colecciones en MongoDB denominadas **Proyectos** e **Investigadores**. Considere
> la siguiente creación de las colecciones:

```js
db.createCollection("Proyectos", { idProy : 17, NomProy: “Bases de Datos”, Investigador: “Alan Turing”, AñoComienzo: 2015, AñoFinal: 2020 } );
db.createCollection(“Investigadores”, {NombreInvest: “Alan Turing”, Cargo: “Senior”, CantArticulos: 35 } );
```

> Suponga que se realizan sucesivas inserciones en ambas colecciones.
>
> Realice una query para devolver la *cantidad de proyectos por Investigador ordenados de mayor
> cantidad de proyectos a menor.*

**Lo que respondió el alumno.**

> ```js
> db.proyectos.aggregate([
> {
>   $group:{ _id:'$Investigador', cantidad:{$sum:1}}
> },
> {
>   $sort: {cantidad:-1}
> }
> ]);
> ```

**Corrección de la plataforma.** 4/5, parcial, sin comentario.

**Resolución del vault.** La lógica es correcta: agrupar por `Investigador`, contar con `$sum: 1` y
ordenar descendente. **Qué estuvo mal**, lo más probable: **la colección se llama `Proyectos`**, y en
MongoDB los nombres de colección distinguen mayúsculas. `db.proyectos` es otra colección, vacía:

```
db.proyectos.aggregate([…])   // []
db.Proyectos.aggregate([…])   // [ { _id: 'Alan Turing', cantidad: 3 }, { _id: 'Grace Hopper', cantidad: 1 } ]
```

Respuesta para el puntaje completo:

```js
db.Proyectos.aggregate([
  { $group: { _id: "$Investigador", cantidad: { $sum: 1 } } },
  { $sort: { cantidad: -1 } }
]);
```

Si se quiere que aparezcan también los investigadores **sin** proyectos (el enunciado crea también
`Investigadores`, lo que admite esta lectura), se parte de esa colección con `$lookup`:

```js
db.Investigadores.aggregate([
  { $lookup: { from: "Proyectos", localField: "NombreInvest",
               foreignField: "Investigador", as: "proyectos" } },
  { $project: { _id: 0, investigador: "$NombreInvest", cantidad: { $size: "$proyectos" } } },
  { $sort: { cantidad: -1, investigador: 1 } }
]);
// [ { investigador: 'Alan Turing', cantidad: 3 },
//   { investigador: 'Grace Hopper', cantidad: 1 },
//   { investigador: 'Ada Lovelace', cantidad: 0 } ]
```

(atención) El `createCollection` del enunciado no corre: su segundo argumento son **opciones** de la
colección, no un documento.

```
IDLUnknownField: BSON field 'create.idProy' is an unknown field.
```

Hay que leerlo como "los documentos tienen esta forma" e insertarlos con `insertOne`/`insertMany`.

**Para el parcial.** `GROUP BY … ORDER BY COUNT(*) DESC` = `$group` con `$sum: 1` + `$sort: -1`, sobre
el nombre exacto de la colección.

## Pregunta 29 — leer un `EXPLAIN` (OM varias, 4 puntos)

**Enunciado.**

> ¿A qué se puede deber la siguiente salida al ejecutar el EXPLAIN:

| Operation | Params | Rows | Total Cost | … | Raw Desc |
| --- | --- | --- | --- | --- | --- |
| Select | | | | | |
| └ Nested Loops (Nested loop inner join) | | 4 | 2.05 | | |
| &nbsp;&nbsp;└ Full Scan (Table scan) | table: inscripto; | 4 | 0.65 | | |
| &nbsp;&nbsp;└ Unique Index Scan (Single-row index lookup) | table: materia; i... | 1 | 0.275 | | (codigo=inscripto.codigo) |

> sobre la siguiente consulta en **MySQL**?

```sql
SELECT *
FROM materia INNER JOIN inscripto
ON materia.codigo = inscripto.codigo;
```

> A. Ninguna de las opciones · B. codigo en Inscripto tiene definido un índice UNIQUE · C. codigo en
> Inscripto es PK · D. codigo en Materia es PK · E. codigo en Materia tiene definido un índice UNIQUE

**Lo que respondió el alumno.** D y E.

**Corrección de la plataforma.** 4/4 ✓, rótulo `Correcta:` en D y E. Clave: D (50 %) y E (50 %);
A -33,34 %, B y C -33,33 % cada una.

**Resolución del vault.** ✓ **D y E.** Un *Unique Index Scan (Single-row index lookup)* sobre
`materia` con `Rows: 1` solo es posible con un índice único sobre `materia.codigo`, venga de la PK o
de un `UNIQUE`; el *Full Scan* sobre `inscripto` descarta un índice útil de ese lado ([[1.08.01 - Plan de ejecución|Plan de ejecución]], [[1.08.02 - Índices|Índices]]). Corrida con `materia` de 2000 filas
e `inscripto` de 4:

```
-- codigo PK en materia (las mismas cifras del examen)
-> Nested loop inner join  (cost=2.05 rows=4)
    -> Filter: (inscripto.codigo is not null)  (cost=0.65 rows=4)
        -> Table scan on inscripto  (cost=0.65 rows=4)
    -> Single-row index lookup on materia using PRIMARY (codigo = inscripto.codigo)  (cost=0.275 rows=1)
-- codigo UNIQUE en materia
    -> Single-row index lookup on materia using uq_codigo (codigo = inscripto.codigo)  (cost=0.275 rows=1)
-- índice NO único en materia
    -> Index lookup on materia using ix_codigo (codigo = inscripto.codigo)  (cost=0.275 rows=1)
-- sin índice
-> Inner hash join (materia.codigo = inscripto.codigo)  (cost=802 rows=800)
```

El *single-row* es la marca de unicidad: con un índice común el paso se llama `Index lookup`, y sin
índice el optimizador cambia a *hash join*. PK y `UNIQUE` dan el mismo tipo de paso, así que el plan
no permite elegir entre D y E: van las dos. (nota) Tampoco el costo decide: con las tablas recién
cargadas, PK, `UNIQUE` (también **nulable**) e índice no único dan las mismas cifras del examen
(`cost=2.05` el *nested loop*, `cost=0.275` el paso sobre `materia`; tipo `eq_ref` en el `EXPLAIN`
tradicional para los dos únicos). El costo solo se mueve con estadísticas desactualizadas: pasar la
PK a `UNIQUE` con `ALTER TABLE` sobre la misma tabla dio `cost=0.875` en el paso *single-row*
(corrida de verificación, base `auditorexamenes`). Un `UNIQUE` que admite `NULL` alcanza para el paso
de unicidad, porque `codigo = inscripto.codigo` nunca es verdadero con `NULL`.

**Para el parcial.** *Single-row index lookup* = PK o `UNIQUE` del lado buscado; *Table scan* = sin
índice útil de ese lado.

## Pregunta 30 — `INSERT` en la vista con `CASCADED CHECK OPTION` (OM, 2 puntos)

**Enunciado.** Mismas tres definiciones de vistas y mismo párrafo que la Pregunta 4.

> f) INSERT INTO MovUSDTValorComi (usuario, moneda, fecha, tipo, comision, valor) VALUES ('6', 'EURO',
> to_date('2020-02-02','yyyy-mm-dd'), 'E', 25, 900);
>
> A. No procede · B. Procede

(Literal: la primera columna dice `usuario`, no `id_usuario`.)

**Lo que respondió el alumno.** A · No procede.

**Corrección de la plataforma.** 2/2 ✓, rótulo `Correcta:`. Clave: A.

**Resolución del vault.** ✓ **No procede.** `MovUSDTValorComi` tiene `CASCADED CHECK OPTION`: la fila
debe cumplir su condición y las de **todas** las vistas de abajo. Falla dos veces: `comision < 25` es
falso para 25 (el borde no entra) y `'EURO'` no cumple `LIKE '%USDT%'`; solo `valor < 1200` se cumple.
Corrida:

```
INSERT INTO MovUSDTValorComi (usuario, …) VALUES ('6', 'EURO', …, 'E', 25, 900);
ERROR 1054 (42S22): Unknown column 'usuario' in 'field list'
INSERT INTO MovUSDTValorComi (id_usuario, …) VALUES ('6', 'EURO', …, 'E', 25, 900);
ERROR 1369 (HY000): CHECK OPTION failed 'parcial1q26.MovUSDTValorComi'
-- con 'EURO' y comisión 20, o con 'USDT' y comisión 25: el mismo ERROR 1369
```

(nota) La columna `usuario` es un resto de la versión anterior de esta cadena, cuya vista base
proyectaba `usuario` ([[Parcial XC-202X|Parcial XC-202X]] § *Pregunta 1*). Tal como está escrito, el
`INSERT` ya falla por la columna; la respuesta es la misma.

**Para el parcial.** `CASCADED` = todas las condiciones de la cadena hacia abajo; mirar los bordes
(`<` no incluye el 25).

## Pregunta 31 — `CREATE KEYSPACE` en CQL (ensayo, 3 puntos)

**Enunciado.**

> Escriba en CQL la sentencia correcta para crear un keyspace en **Cassandra**.

**Lo que respondió el alumno.**

> CREATE KEYSPACE nombre_keyspace WITH replication : {'class':'SimpleStrategy', 'replication_factor':'1'};

(Literal: `replication :` con dos puntos, no `=`.)

**Corrección de la plataforma.** 3/3 ✓, sin comentario.

**Resolución del vault.** (atención) **La sentencia del alumno no compila**, aunque recibió puntaje
completo. Cassandra 5.0.9:

```
CREATE KEYSPACE parcial1q26_p31 WITH replication : {'class':'SimpleStrategy', 'replication_factor':'1'};
SyntaxException: line 1:49 no viable alternative at input ':' (CREATE KEYSPACE parcial1q26_p31 WITH [replication] :...)
CREATE KEYSPACE parcial1q26_p31 WITH replication = {'class':'SimpleStrategy', 'replication_factor':'1'};
DESCRIBE KEYSPACE parcial1q26_p31;
CREATE KEYSPACE parcial1q26_p31 WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;
```

Manda el motor, y coincide con el deck (Clase 15, slide 59): `CREATE KEYSPACE nombre WITH replication
= {'class':'SimpleStrategy', 'replication_factor' : 3};`. Los dos puntos van **dentro** del mapa,
entre cada clave y su valor; entre `replication` y el mapa va `=`. El factor como texto `'1'` se
acepta. Para el puntaje completo, además: el **factor de replicación** es cuántas copias de cada dato
guarda el clúster; `SimpleStrategy` sirve para un solo *data center* y `NetworkTopologyStrategy`
fija un factor por *data center* ([[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Keyspaces]], [[3.15.03 - CQL y modelado orientado a consultas|CQL]]). Es lo primero que
hace el TP10 ([[Práctica 2026-09-29]]).

**Para el parcial.** `WITH replication = { 'class': …, 'replication_factor': N }`: igual antes del mapa,
dos puntos adentro.

## Pregunta 32 — la vista materializada y la performance (V/F, 1 punto)

**Enunciado.**

> La vista materializada provee un nivel de abstracción, y trae mejoras en la performance vs. ejecutar
> el mismo select que la define.
>
> Verdadero · Falso

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 0/1 ✗, rótulo `Incorrecto:`. Clave: Verdadero.

**Resolución del vault.** **Verdadero** como teoría general: una vista materializada **guarda** el
resultado de su `SELECT`, así que leerla evita recalcularlo, a cambio de duplicar datos y tener que
refrescarlos ([[1.06.01 - Vistas|Vistas]] § *Virtual vs. materializada*; GMUW 8.5, *Materialized
Views*, impresa 359). Como toda vista, además, abstrae la consulta. **Qué estuvo mal:** el alumno
probablemente pensó en la vista **común**, que no guarda datos y no mejora nada, o en MySQL.
(atención) El enunciado no nombra motor, y en el de la cursada sería falso: la Clase 07 (slide 20) dice
que MySQL *"no las admite"*, y MySQL 9.7.2 acepta la sintaxis pero no materializa:

```
CREATE MATERIALIZED VIEW mv AS SELECT SUM(val) AS s FROM tmv;   -- sin error ni warning
SELECT * FROM mv;            -- 30
INSERT INTO tmv VALUES (3,30);
SELECT * FROM mv;            -- 60: recalculó
information_schema.TABLES → mv: TABLE_TYPE = VIEW
SHOW CREATE VIEW mv;         -- CREATE ALGORITHM=UNDEFINED MATERIALIZED /*(BY ENGINE=UNKNOWN)*/ … VIEW `mv` AS …
```

Sin motor nombrado, manda la teoría: Verdadero. Es la negación exacta de la Pregunta 11 del [[Parcial 2Q2025]] (*"en MySQL … NO trae ninguna mejora"* → Falso), con la misma clave de fondo.

**Para el parcial.** Materializada = resultado guardado = más rápida de leer, con costo de refresco.
Si la pregunta dice "en MySQL", aclarar que no existe como objeto real.

## Pregunta 33 — qué es Neo4j (OM, 2 puntos)

**Enunciado.**

> ¿Cuál de las siguientes afirmaciones describe mejor el funcionamiento de **Neo4j**?
>
> A. Es una base de datos de grafos que utiliza estructuras de nodos, relaciones y propiedades para
> representar datos. · B. Es un motor NoSQL orientado a documentos, similar a MongoDB, pero con
> soporte ACID. · C. Es un framework de análisis de grafos desarrollado en Python para bases SQL. ·
> D. Es una base de datos relacional que optimiza las operaciones de *join* mediante índices de clave
> primaria.

**Lo que respondió el alumno.** A.

**Corrección de la plataforma.** 2/2 ✓, rótulo `Correcta:`. Clave: A.

**Resolución del vault.** ✓ **A** *(no verificado en el motor)*: nodos con etiquetas, relaciones
dirigidas con tipo y propiedades en los dos (Seven Databases cap. 6.2, impresas 181–183). B mezcla el
soporte ACID, que sí tiene (Pregunta 25), con un modelo de documentos que no es el suyo.

**Para el parcial.** Neo4j = grafo de propiedades: nodos, relaciones y propiedades.

## Pregunta 34 — `WHERE` con parte de la partition key (OM varias, 3 puntos)

**Enunciado.**

> Imagine la siguiente tabla en **Cassandra**:

```sql
CREATE TABLE blogs ( blogId int, time1 int, time2 int, author text, content text, PRIMARY KEY ( (blogId, time1), time2 ) );
```

> ¿Qué sucede si ejecutamos la siguiente query y cuál/es puede/n ser la razón/es?

```sql
SELECT * FROM blogs WHERE time1 = 1418306451235;
```

> *Crédito parcial y negativo — Es posible que se hayan deducido puntos por respuestas incorrectas.*
>
> A. Obtenemos los datos de blogs que se cargaron en el time1 = 1418306451235 · B. Ninguna de las
> opciones · C. Falla porque no incluye blogId en el WHERE · D. Falla porque es impredecible la
> performance de la consulta · E. Falla porque no se puede filtrar por time1 solamente

**Lo que respondió el alumno.** C y E.

**Corrección de la plataforma.** 1,99/3, parcial, rótulo `Correcta:` en C y E. Clave: C (33,33 %),
D (33,34 %) y E (33,33 %); A y B -50 % cada una. Faltó marcar D.

**Resolución del vault.** **C, D y E.** La partition key es **compuesta**, `(blogId, time1)`: para
ubicar la partición hay que dar **sus dos componentes** con `=` o `IN` (Clase 15, slide 67: *"Si la
partition key es compuesta y se incluye en el WHERE, han de incluirse todos sus campos"*). Filtrar
solo por `time1` obligaría a recorrer todas las particiones, y Cassandra se niega salvo `ALLOW
FILTERING`. D es **el texto mismo del error**, que el deck muestra en el slide 70:

```
SELECT * FROM blogs WHERE time1 = 100;
InvalidRequest: … message="Cannot execute this query as it might involve data filtering and thus may
have unpredictable performance. If you want to execute this query despite the performance
unpredictability, use ALLOW FILTERING"
SELECT * FROM blogs WHERE blogId = 1;                     -- el mismo error: falta time1
SELECT * FROM blogs WHERE blogId = 1 AND time1 = 100;     -- 3 filas, ordenadas por time2
SELECT * FROM blogs WHERE time1 = 100 ALLOW FILTERING;    -- 4 filas (A solo con ALLOW FILTERING)
```

**Qué estuvo mal:** el alumno marcó las dos causas sintácticas y no la que Cassandra da como motivo.
Las tres dicen lo mismo desde tres ángulos: falta un componente de la partition key (C), por eso no
se puede filtrar solo por `time1` (E), y por eso la performance sería impredecible (D).

(atención) Con el literal del enunciado, Cassandra 5.0.9 falla **antes** y por otro motivo:
`1418306451235` no entra en un `int` (máximo 2.147.483.647).

```
SELECT * FROM blogs WHERE time1 = 1418306451235;
InvalidRequest: … message="Unable to make int from '1418306451235'"
```

El deck (slides 70–71) usa la misma tabla con `time1 int` y el mismo valor, y muestra el error de
filtrado. Para el examen vale el razonamiento de la clave; con cualquier valor dentro del rango, el
motor lo confirma. (nota) En el slide 70 la clave es `PRIMARY KEY (blogId, time1, time2)`, con `time1`
como clustering; el examen la cambia a `((blogId, time1), time2)`. En las dos versiones la consulta
falla.

**Para el parcial.** Partition key completa en el `WHERE`, siempre; el mensaje de error habla de
*unpredictable performance* y sugiere `ALLOW FILTERING` ([[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]]).

## Pregunta 35 — no visible (1 punto)

**Enunciado.** [ilegible: fuera de lo fotografiado]. Solo se ven el título, el ícono ✗ y la mitad
superior de la pastilla.

**Lo que respondió el alumno.** No visible.

**Corrección de la plataforma.** [dudoso: 0/1] ✗.

**Resolución del vault.** pendiente: sin enunciado no hay resolución. La barra de desplazamiento de la
última foto está al fondo y los máximos suman 100 con esta pregunta: es, con toda probabilidad, la
última del examen. El ícono ✗ indica que se respondió mal o no se respondió; qué se evaluó no se
puede saber.

**Para el parcial.** pendiente: sin enunciado no hay regla que extraer.

---

## Relación con otras instancias

| Pregunta del 1Q2026 | Reaparece en | Qué cambia |
| --- | --- | --- |
| 1 — `EXPLAIN ANALYZE` | [[Parcial 2Q2025]] P2 · [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 7 · [[Parcial 23-5-23 - Bases de Datos Avanzadas\|Parcial 23-5-23]] P17 | idéntica en 2025; en el 2Q-2023 y el 23-5-23, con PostgreSQL de fondo |
| 2 — CAP, todos los nodos escriben | [[Parcial 2Q2025]] P3 · [[Parcial 23-5-23 - Bases de Datos Avanzadas\|Parcial 23-5-23]] P1 | idéntica, opciones en otro orden |
| 3 — cadena `GRANT`/`REVOKE … CASCADE` | [[Parcial 2Q2025]] P32 (`CLIENTE`, `CS`, `CSV`) · [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 6 (`EMPLEADO`, `ES`, `ESJ`) | mismo molde de ocho pasos; aquí se suman `UPDATE` por columnas, un `INSERT` que falla sobre una vista y un `SELECT` final. El esquema de Investigadores es el de la [[Práctica subida por la cátedra\|Práctica subida por la cátedra]] Ej. 1 |
| 4, 5 y 30 — cadena `MovimientoUSDT` | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 1 (a, c, f) · [[Parcial 2Q2025]] P1 y P18 · [[Recuperatorio 1Q2026]] P5 y P6 | umbrales 1200 y 25 (el XC-202X usa 1100 y 20); cambian los valores de cada inciso |
| 6 — persistencia vs. programación políglota | [[Parcial 2Q2025]] P5 · [[Parcial 23-5-23 - Bases de Datos Avanzadas\|Parcial 23-5-23]] P3 | idéntica, mismo error del alumno de 2025 (*"Programación múltiple"*) |
| 7 — partition key y clustering key | [[Parcial 2Q2025]] P29 | allí: explicar la PK completa con ejemplos (6 puntos) |
| 8 y 17 — MapReduce V/F | [[Recuperatorio 1Q2026]] P16 y P15 · [[Parcial 2Q2025]] P6 | idénticas en el recuperatorio (donde el alumno acertó las dos); en 2025, un MapReduce a escribir |
| 9 — índice por defecto de MongoDB | [[Parcial 2Q2025]] P9 · [[Parcial 23-5-23 - Bases de Datos Avanzadas\|Parcial 23-5-23]] P32 | idéntica, opciones en otro orden (la clave es A en 2025 y F aquí) |
| 10, 19 y 21 — `Carrera`/`Materia`/`Facultad` | [[Parcial 2Q2025]] P30, P17 y P19 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 2 (a, b, c) · [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 8 | mismas tres operaciones (en el 2Q-2023 el `DELETE` es de `idCarr = 1` y el `INSERT` usa `M5`); en 2025 el alumno también dio el `UPDATE` por RIR |
| 11 y 13 — concurrencia V/F | [[Recuperatorio 1Q2026]] P11 y P9 · [[Final 1Dic2025]] P3 (incisos A y D) | idénticas en el recuperatorio; en el final, incisos de un V/F múltiple |
| 12 — `CHECK` de tupla | [[Parcial 2Q2025]] P25 | `Empleado` con umbral 5000; aquí `Vendedor` con 5.000.000 |
| 14 — QUORUM | [[Parcial 2Q2025]] P26 · [[Recuperatorio 1Q2026]] P36 | en 2025 solo la fórmula; en el recuperatorio, los niveles de escritura válidos |
| 15 — replicación vs. sharding | [[Parcial 2Q2025]] P21 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 9 | idéntica, opciones reordenadas (la clave es B en 2025 y C aquí) |
| 16 — coordinación externa | [[Parcial 2Q2025]] P33 | idéntica |
| 18 — relaciones de Neo4j | [[Recuperatorio 1Q2026]] P19 | allí: dirección y consulta en ambos sentidos |
| 20 — embebido vs. referencias | [[Parcial 2Q2025]] P31 | idéntica (allí 4/6) |
| 22 — `ConstructorVIP` | [[Parcial 2Q2025]] P27 · [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 4B | en 2025 el umbral era un millón; en 2023, sin `COUNT` ni filtro a obras privadas |
| 23 — phantom read | [[Recuperatorio 1Q2026]] P10 y P12 | allí V/F de *dirty read* y `READ UNCOMMITTED` |
| 24 — master-slave | [[Parcial 2Q2025]] P28 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 8 d | idéntica en 2025 |
| 26 — componentes del nodo | [[Parcial 2Q2025]] P8 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 7 · [[Recuperatorio 1Q2026]] P35 | idéntica en 2025; en el recuperatorio, V/F sobre la SSTable |
| 27 — `$match` + `$group` sobre `orders` | [[Parcial 2Q2025]] P15 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 10 a | otro filtro: allí `payment_method: "cash"` y agrupa por fecha |
| 28 — contar y ordenar por grupo | [[Práctica subida por la cátedra\|Práctica subida por la cátedra]] Ej. 7 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 10 b | allí `GROUP BY tipo ORDER BY COUNT(*) DESC` a traducir |
| 29 — `EXPLAIN` materia/inscripto | [[Parcial 2Q2025]] P12 | idéntica (allí 0/4) |
| 31 — `CREATE KEYSPACE` | [[Práctica subida por la cátedra\|Práctica subida por la cátedra]] Ej. 9 | idéntica |
| 32 — vista materializada | [[Parcial 2Q2025]] P11 · [[Final 1Dic2023]] P3 · [[Parcial 23-5-23 - Bases de Datos Avanzadas]] P29 | en 2025, la negación "en MySQL no mejora" (Falso); en los otros, PostgreSQL |
| 34 — `blogs` y `ALLOW FILTERING` | [[Parcial 2Q2025]] P23 | allí `PRIMARY KEY (blogId, time1, time2)` y una opción con `ALLOW FILTERING` |

De las 34 preguntas visibles, **15 reaparecen casi textuales en el [[Parcial 2Q2025]]** (1, 2, 6, 9,
10, 12, 15, 16, 19, 20, 21, 22, 24, 26 y 29) y 29 tienen gemela o el mismo molde en el 2Q2025 o en el
[[Recuperatorio 1Q2026]]. Las otras cinco son la 23 (con parientes V/F en el recuperatorio), la 25, la
33 y dos que están en la [[Práctica subida por la cátedra|Práctica subida por la cátedra]]: la 28
(también en el [[Parcial XC-202X|Parcial XC-202X]]) y la 31. Repasar esas tres páginas y esta cubre
casi todo el banco de la cátedra.

## Dudas abiertas

- (abierto) El enunciado de la **Pregunta 35** no está fotografiado. Si el humano consigue la última
  foto de la revisión, se completa.
- (abierto) **Qué se corrige como correcto en sintaxis.** La P31 recibió 3/3 con una sentencia que
  Cassandra rechaza: ¿la corrección manual de 2026 2C mira la idea o la sintaxis exacta? Conviene
  escribir la forma que compila.
- (abierto) Si en 2026 2C, donde Neo4j se dicta después del parcial ([[_cronograma]]), las cuatro
  preguntas de Neo4j (16, 18, 25, 33) se reemplazan por otras de Cassandra o de la primera mitad.
- (ok) Tabla de notas y duración: tomadas del encabezado del [[Recuperatorio 1Q2026]]; ninguna foto
  del parcial muestra el suyo.

## Enlaces

[[Mapa de exámenes]] · [[Recuperatorio 1Q2026]] · [[Parcial 2Q2025]] ·
[[Parcial XC-202X|Parcial XC-202X]] · [[Parcial 2Q-2023|Parcial 2Q-2023]] ·
[[Práctica subida por la cátedra|Práctica subida por la cátedra]] · [[_cronograma]] ·
[[MySQL]] · [[MongoDB]] · [[Cassandra]] ·
[[1.06.01 - Vistas|Vistas]] · [[1.08.01 - Plan de ejecución|Plan de ejecución]] ·
[[1.08.02 - Índices|Índices]] ·
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
[[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] ·
[[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] ·
[[1.11.03 - Transacciones y ACID|Transacciones y ACID]] ·
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] ·
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
[[2.12.03 - Persistencia políglota|Persistencia políglota]] · [[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
[[2.13.01 - Documentos embebidos vs. referencias|Documentos embebidos vs. referencias]] ·
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]] · [[2.14.03 - MapReduce|MapReduce]] ·
[[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]] ·
[[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]] ·
[[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]] ·
[[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]] ·
[[Clase 08 - Explicando el plan]] · [[Clase 09 - Restricciones integridad-Parte 1]] ·
[[Clase 11 - Seguridad-Transacciones]] · [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] ·
[[Clase 14 - MongoDB Features]] · [[Clase 15 - Introduccion a Cassandra]] · [[Práctica 2026-09-29]]
