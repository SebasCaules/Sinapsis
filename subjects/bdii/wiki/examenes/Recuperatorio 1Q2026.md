---
tipo: examen
unidad: eval
instancia: recuperatorio
tema:
  - SQL en MySQL — subconsulta correlacionada con clave compuesta y ensamble externo
  - ASSERTION y restricción de tabla (SQL estándar vs. MySQL)
  - NULL en NOT IN
  - Vistas con WITH CHECK OPTION (LOCAL y CASCADED)
  - Índices hash vs. B-tree
  - Transacciones — bloqueos, dirty read, niveles de aislamiento
  - MongoDB — JOIN traducido con $lookup, MapReduce, CAP
  - Neo4j — Cypher, HA, restricción de unicidad
  - Redis — elección de motor, seguridad, AOF, MSET, Sentinel, ZUNIONSTORE
  - Cassandra — terminología tabular, SSTable, niveles de consistencia de escritura
cuatrimestre: 2026-1C
temario: actual
fuentes:
  - "raw/Examenes_Viejos/1C-26/Recu/WhatsApp Video 2026-09-29 at 11.06.33.mp4"
  - "raw/Unidad-01/Practica/esq_peliculas.sql"
estado: procesado
resumen: "Recuperatorio del 1C 2026, instancia de máximo peso del vault: 36 preguntas de SQL/MySQL, transacciones, MongoDB, Neo4j, Redis y Cassandra. El alumno sacó 67,88/100 (nota 5). Cada error queda corregido y las respuestas se verificaron en MySQL, MongoDB o Cassandra cuando se pudo."
aliases:
  - Recuperatorio 1Q2026
  - Recu 1C-26
  - Recuperatorio 1C 2026
  - Recuperatorio primer cuatrimestre 2026
---

# Recuperatorio 1Q2026 — el examen corregido más reciente, de máximo peso para el parcial

## Resumen general

Recuperatorio del primer cuatrimestre de 2026, rendido en Blackboard con la cátedra y la plataforma
actuales. Junto con el [[Parcial 1Q2026]] es la instancia de **mayor peso** del vault: es la más
reciente y, con ese parcial, la única en la que se ve qué marcó la plataforma, qué corrigió a mano
el docente y cuánto valía cada pregunta. Son 36 preguntas sobre 100 puntos que recorren toda la
materia: SQL sobre MySQL (subconsultas, `ASSERTION`, `NOT IN` con `NULL`, vistas con `CHECK
OPTION`, índices), transacciones, MongoDB, Neo4j, Redis y Cassandra.

El alumno obtuvo **67,88/100**, que la tabla del encabezado convierte en **nota 5**: aprobado con
nota baja. Perdió 32,12 puntos, y más de la mitad salió de Redis: dejó en blanco la Pregunta 33
(`ZUNIONSTORE`, 7,5 puntos, la de mayor valor del examen), eligió MongoDB para una tabla de
posiciones (4 puntos), falló dos de las tres de Sentinel y sacó 0,49 de 3 en la de `appendfsync`. El
resto se fue en la traducción a MongoDB con `$lookup`, en tres preguntas de SQL (la clave compuesta
de usuario, el índice hash y la redacción de la `ASSERTION`), en MapReduce frente al aggregation
pipeline, en dos consultas Cypher (la publicación como relación y un filtro olvidado) y en los
niveles de consistencia de Cassandra.

La página resuelve cada pregunta y corrige cada error; las de SQL, MongoDB y Cassandra se corrieron
en MySQL 9.7.2, MongoDB 8.3.11 y Cassandra 5.0.9. Dos lecciones generales: **22 de las 36 preguntas
ya aparecen, casi textuales, en otras instancias del vault**, y la clave de la plataforma puede estar
mal (Pregunta 6, que el docente corrigió a mano).

> [!info] Fuente
> - **`WhatsApp Video 2026-09-29 at 11.06.33.mp4`** (105,6 s, 832×464, sin audio): un celular filma
>   la pantalla de revisión de Blackboard mientras se desplaza desde el recuadro de instrucciones
>   hasta la Pregunta 36. No se ven el título de la evaluación, la fecha, el total ni la nota: el
>   total sale de sumar las pastillas de puntaje y la nota, de aplicarle la tabla del encabezado. Es
>   la revisión del propio alumno, no material oficial.
> - El texto chico (el código de las preguntas 4, 13 y 18, la pastilla de la 6 y la respuesta de la
>   29) se leyó sobre apilados de frames nativos del video. Lo que no se lee con certeza va como
>   `[dudoso: …]`.
> - El DER de la Pregunta 3 es el esquema de películas de la práctica,
>   `raw/Unidad-01/Practica/esq_peliculas.sql`: de ahí salen las columnas exactas.
> - Instancia hermana: [[Parcial 1Q2026]], del mismo cuatrimestre (35 preguntas, desaprobado).

## Formato

- **36 preguntas, 100 puntos**, en cinco tipos:

  | Tipo | Preguntas | Cantidad | Puntos |
  | --- | --- | --- | --- |
  | Opción múltiple, una correcta | 1, 2, 4, 5, 6, 7, 8, 25 | 8 | 2 cada una; la 25 vale 4 · total 18 |
  | Opción múltiple, varias correctas | 26, 28, 36 | 3 | 3 cada una · total 9 |
  | Verdadero/falso | 9–12, 14–17, 19, 23, 27, 30–32, 35 | 15 | 2 cada una · total 30 |
  | Ensayo (texto o código) | 3, 13, 18, 20, 21, 22, 24, 29, 33 | 9 | de 3 a 7,5 · total 40,5 |
  | Coincidencia | 34 | 1 | 2,5 |

- **Crédito parcial y negativo:** las preguntas 28 y 36 lo declaran en un recuadro (*"Es posible que
  se hayan deducido puntos por respuestas incorrectas"*); la 26 muestra porcentajes negativos sin el
  recuadro. Cada opción correcta suma su porcentaje y cada distractor marcado resta el suyo.
- **Ensayos corregidos a mano**, con comentario del docente cuando descuenta (preguntas 3, 13, 18 y
  24). El docente también puede corregir la clave automática (Pregunta 6).
- **Orden por bloques:** SQL sobre MySQL (1–8), transacciones (9–12), MongoDB (13–17), Neo4j
  (18–24), elección de motor y CAP (25–26), Redis (27–33), Cassandra (34–36).
- **Condición de aprobación** (encabezado, literal): *"nota 4, debe contestar correctamente como
  mínimo el 60% de las preguntas formuladas"*. La tabla del encabezado convierte puntaje en nota:

  | Puntaje: | 0-59 | 60-63 | 64-69 | 70-76 | 77-83 | 84-89 | 90-96 | 97-100 |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | Nota: | Desaprobado | 4 | 5 | 6 | 7 | 8 | 9 | 10 |

- **Duración:** 2 horas y 30 minutos (encabezado).
- Rótulos de la plataforma: en opción múltiple, la opción elegida lleva `Correcta:` (verde) o
  `Incorrecta:` (rojo) y la clave, la leyenda `Respuesta correcta`; en V/F, la elegida correcta va
  en verde sin rótulo y la incorrecta, con `Incorrecto:`.

## Puntaje

| Pregunta | Tipo | Tema | Puntaje | Resultado |
| --- | --- | --- | --- | --- |
| 1 | opción múltiple | identificador compuesto en la subconsulta | 0/2 | ✗ |
| 2 | opción múltiple | ¿ensamble externo? | 2/2 | ✓ |
| 3 | ensayo | qué controla una `ASSERTION` | 3/4 | parcial |
| 4 | opción múltiple | `NOT IN` con `NULL` | 2/2 | ✓ |
| 5 | opción múltiple | `INSERT` por una vista `LOCAL` | 2/2 | ✓ |
| 6 | opción múltiple | `INSERT` por una vista `CASCADED` | 2/2 | ✓ (ícono ✗; puntos asignados por el docente) |
| 7 | opción múltiple | índice para `UserID` | 0/2 | ✗ |
| 8 | opción múltiple | restricción de tabla: estándar y MySQL | 2/2 | ✓ |
| 9 | V/F | shared lock | 2/2 | ✓ |
| 10 | V/F | dirty read | 2/2 | ✓ |
| 11 | V/F | control de concurrencia | 2/2 | ✓ |
| 12 | V/F | read uncommitted | 2/2 | ✓ |
| 13 | ensayo | JOIN traducido a MongoDB | 3/6 | parcial |
| 14 | V/F | MapReduce frente al pipeline | 0/2 | ✗ |
| 15 | V/F | `map` emite pares clave-valor | 2/2 | ✓ |
| 16 | V/F | MapReduce en paralelo | 2/2 | ✓ |
| 17 | V/F | ¿MongoDB es AP? | 2/2 | ✓ |
| 18 | ensayo | Cypher: personas, vinos y publicaciones | 5/6 | parcial |
| 19 | V/F | dirección de las relaciones | 2/2 | ✓ |
| 20 | ensayo | Neo4j HA | 4/4 | ✓ |
| 21 | ensayo | Cypher a lenguaje natural | 3/3 | ✓ |
| 22 | ensayo | restricción de unicidad | 3/3 | ✓ |
| 23 | V/F | `DETACH DELETE` | 2/2 | ✓ |
| 24 | ensayo | amigos de amigos | 3/4 | parcial |
| 25 | opción múltiple | motor para una tabla de posiciones | 0/4 | ✗ |
| 26 | varias correctas | motores CA | 3/3 | ✓ |
| 27 | V/F | seguridad por comandos en Redis | 2/2 | ✓ |
| 28 | varias correctas | valores de `appendfsync` | 0,49/3 | parcial |
| 29 | ensayo | tres títulos con un solo comando | 3/3 | ✓ |
| 30 | V/F | ¿quién inicia el failover? | 0/2 | ✗ |
| 31 | V/F | Sentinel monitorea | 2/2 | ✓ |
| 32 | V/F | Sentinel como proveedor de configuración | 0/2 | ✗ |
| 33 | ensayo | `ZUNIONSTORE … WEIGHTS` | 0/7,5 | ✗ (en blanco) |
| 34 | coincidencia | terminología tabular vs. RDBMS | 2,5/2,5 | ✓ |
| 35 | V/F | ¿SSTable en memoria? | 2/2 | ✓ |
| 36 | varias correctas | niveles de consistencia de escritura | 0,89/3 | parcial |
| **Total** | | | **67,88/100** | **nota 5** (rango 64–69) |

Por bloque:

| Bloque | Preguntas | Obtenido | Máximo | Perdido |
| --- | --- | --- | --- | --- |
| SQL sobre MySQL | 1–8 | 13 | 18 | 5 |
| Transacciones | 9–12 | 8 | 8 | 0 |
| MongoDB | 13–17 | 9 | 14 | 5 |
| Neo4j | 18–24 | 22 | 24 | 2 |
| Elección de motor y CAP | 25–26 | 3 | 7 | 4 |
| Redis | 27–33 | 7,49 | 21,5 | 14,01 |
| Cassandra | 34–36 | 5,39 | 7,5 | 2,11 |
| **Total** | | **67,88** | **100** | **32,12** |

Contando la Pregunta 25 (la respuesta era Redis), Redis explica **18,01** de los 32,12 puntos
perdidos. Si el docente no hubiera corregido la Pregunta 6, el total habría sido 65,88: la nota
seguía siendo 5.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP 2026 |
| --- | --- | --- | --- |
| 1 | Subconsulta correlacionada con `NOT EXISTS` sobre una clave compuesta | [[1.05.01 - SQL — consultas\|SQL — consultas]] · [[1.03.01 - Derivación de MER a esquema relacional\|Derivación a esquema relacional]] (entidad débil) | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05 P2]] · [[Clase 03 - Derivación a Esquema Lógico\|Clase 03]] · [[Práctica 2026-08-11]] |
| 2 | Ensamble interno vs. externo dentro de un `NOT EXISTS` | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05 P2]] · [[Práctica 2026-08-11]] |
| 3 | Leer una `ASSERTION` con `NATURAL JOIN` | [[1.09.03 - CHECK, DOMAIN y ASSERTION\|CHECK, DOMAIN y ASSERTION]] · [[1.09.04 - Triggers\|Triggers]] | [[Clase 09 - Restricciones integridad-Parte 1\|Clase 09]] · [[Clase 10 - Restricciones integridad-Parte 2\|Clase 10]] · [[Práctica 2026-08-25]] · [[Práctica 2026-09-01]] |
| 4 | `NOT IN` con un `NULL` en la subconsulta | [[1.05.01 - SQL — consultas\|SQL — consultas]] § 11.4 | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05 P2]] |
| 5–6 | `INSERT` por vistas con `WITH LOCAL` / `CASCADED CHECK OPTION` | [[1.06.01 - Vistas\|Vistas]] | [[Clase 06 - Vistas-Parte 1\|Clase 06]] · [[Clase 07 - Vistas-Parte 2\|Clase 07]] · [[Práctica 2026-08-11]] |
| 7 | Índice hash vs. B-tree para un *lookup* por igualdad | [[1.08.02 - Índices\|Índices]] | [[Clase 11 - Seguridad-Transacciones\|Clase 11]] (slides 32, 36–38) · [[Práctica 2026-08-18]] |
| 8 | Restricción de tabla: estándar y MySQL | [[1.09.03 - CHECK, DOMAIN y ASSERTION\|CHECK, DOMAIN y ASSERTION]] | [[Clase 09 - Restricciones integridad-Parte 1\|Clase 09]] · [[Práctica 2026-08-25]] |
| 9–12 | Bloqueos, dirty read, control de concurrencia, `READ UNCOMMITTED` | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | [[Clase 11 - Seguridad-Transacciones\|Clase 11]] (slides 21–28) |
| 13 | `JOIN … ORDER BY` traducido a `$lookup` + `$unwind` + `$sort` | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | [[Clase 12 - Introduccion a NoSQL\|Clase 12]] · [[Clase 13 - NoSQL-EmbebidosVSNormalizado\|Clase 13]] · [[Práctica 2026-09-15]] |
| 14–16 | MapReduce: deprecación, `map`, paralelismo | [[2.14.03 - MapReduce\|MapReduce]] | [[Clase 14 - MongoDB Features\|Clase 14]] |
| 17 | MongoDB en CAP | [[2.12.04 - Teorema CAP\|Teorema CAP]] | [[Clase 12 - Introduccion a NoSQL\|Clase 12]] |
| 18–24 | Neo4j: Cypher, dirección, HA, unicidad, borrado | Neo4j — texto plano *(se dicta el 19/10; TP11 el 20/10)* | — |
| 25 | Elección de motor para un ranking de alto *throughput* | [[2.12.03 - Persistencia políglota\|Persistencia políglota]] · Redis (texto plano) | [[Clase 12 - Introduccion a NoSQL\|Clase 12]] · [[Práctica 2026-08-04]] |
| 26 | Motores en configuración CA | [[2.12.04 - Teorema CAP\|Teorema CAP]] | [[Clase 12 - Introduccion a NoSQL\|Clase 12]] |
| 27–33 | Redis: seguridad, AOF, `MSET`, Sentinel, sorted sets | Redis — texto plano *(se dicta el 26/10; TP12 el 27/10)* | — |
| 34 | Terminología tabular vs. RDBMS | [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases de datos tabulares]] | [[Clase 15 - Introduccion a Cassandra\|Clase 15]] · [[Práctica 2026-09-29]] |
| 35 | MemTable en memoria, SSTable en disco | [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura en Cassandra]] | [[Clase 15 - Introduccion a Cassandra\|Clase 15]] |
| 36 | Niveles de consistencia de escritura | [[3.15.05 - Niveles de consistencia y QUORUM\|Niveles de consistencia y QUORUM]] | [[Clase 15 - Introduccion a Cassandra\|Clase 15]] · [[Práctica 2026-09-29]] |

## Pregunta 1 — el identificador de usuario en la subconsulta correlacionada (OM, 2 puntos)

**Enunciado.**

> Considere el siguiente esquema correspondiente a un sistema de gestión de planes de servicios a
> usuarios. De los planes disponibles se registra su identificador, nombre, importe y año de
> inicio. Cada plan puede ser ofrecido para particulares y/o para empresas. De los usuarios se
> almacena su número, zona y datos personales. Se lleva registro de las asignaciones de planes a los
> usuarios, indicando desde cuándo y hasta cuándo estará asignado y el número de dispositivos
> habilitados.

DER (imagen en la plataforma; `N` = admite nulos):

| Tabla | Columna | Tipo | Marcas |
| --- | --- | --- | --- |
| PLAN | cod_plan | int | PK |
| PLAN | [dudoso: nombre] | varchar(50) | |
| PLAN | [dudoso: anio_inicio] | int | |
| PLAN | importe | int | |
| PLAN_PART | cod_plan | int | PK FK |
| PLAN_PART | caracteristica | varchar(80) | |
| PLAN_EMPR | cod_plan | int | PK FK |
| PLAN_EMPR | condicion | varchar(80) | |
| PLAN_EMPR | descuento | decimal(5,2) | |
| ASIGNACION | nroUsuario | int | PK FK |
| ASIGNACION | zona | char(2) | PK FK |
| ASIGNACION | cod_plan | int | PK FK |
| ASIGNACION | fecha_desde | date | |
| ASIGNACION | fecha_hasta | date | N |
| ASIGNACION | num_dispositivos | int | |
| USUARIO | nroUsuario | int | PK |
| USUARIO | zona | char(2) | PK FK |
| USUARIO | apell_nombre | varchar(50) | |
| USUARIO | ciudad | varchar(20) | |
| USUARIO | fecha_nacim | date | |
| ZONA | cod_zona | char(2) | PK |
| ZONA | nombre | varchar(30) | |

```
PLAN        ─┼──────○<  ASIGNACION   (uno ─ cero o muchos)
ASIGNACION  >○──────┼─  USUARIO      (cero o muchos ─ uno)
PLAN        ─┼──────○   PLAN_PART    (uno ─ cero o uno)
PLAN        ─┼──────○   PLAN_EMPR    (uno ─ cero o uno)
USUARIO     >○──────┼─  ZONA         (cero o muchos ─ uno)
```

> Se ha planteado la siguiente consulta en **MySQL** a fin de listar los datos de los usuarios de
> zona A1 o D1 menores de 30 años, con algún plan para empresas asignado, pero ninguno con descuento:
>
> ```sql
> SELECT * FROM usuario u
> WHERE zona IN ('A1', 'D1') AND age (fecha_nacim) <= 30
> AND NOT EXISTS (
>                 SELECT 1 FROM asignacion a JOIN plan_empr p ON a.cod_plan = p.cod_plan
>                 WHERE a.nroUsuario = u.nroUsuario AND descuento > 0 );
> ```
>
> Evalúe la siguiente afirmación e indique si es correcta o no: "se ha considerado erróneamente el
> identificador de usuario"
>
> A. Correcto · B. Incorrecto

**Lo que respondió el alumno.** B · Incorrecto.

**Corrección de la plataforma.** 0/2 ✗. Clave: **A · Correcto**. Sin comentario del docente.

**Resolución del vault.** **A · Correcto.** La PK de `USUARIO` es **compuesta**, `(nroUsuario, zona)`:
`USUARIO` es una entidad débil de `ZONA` (clave parcial `nroUsuario` más la clave de la fuerte, que
además es FK; [[1.03.01 - Derivación de MER a esquema relacional|Derivación a esquema relacional]] §
*Entidad débil*). El mismo número se repite en zonas distintas y lo que identifica a un usuario es
el par; por eso `ASIGNACION` hereda las dos columnas como `PK FK`. La subconsulta correlaciona solo
`a.nroUsuario = u.nroUsuario`: mezcla las asignaciones de todos los usuarios que comparten número, y
un usuario puede quedar excluido por el descuento de **otro** usuario de otra zona. La correlación
correcta iguala la clave completa: `a.nroUsuario = u.nroUsuario AND a.zona = u.zona`.

Corrida en MySQL 9.7.2 (base `recupage`), con las seis tablas del DER y cinco usuarios armados para
ejercitar cada caso: `(1, A1)` y `(1, D1)` comparten número; el primero tiene solo un plan de
empresa con descuento 0,00 y el segundo, uno con descuento 15,00; `(2, A1)` no tiene planes;
`(3, A1)` cumple 30 años hoy; `(4, D1)` tiene solo un plan particular.

La consulta tal cual:

```
ERROR 1305 (42000) at line 3: FUNCTION recupage.age does not exist
```

Con `age(fecha_nacim)` reemplazada por `TIMESTAMPDIFF(YEAR, fecha_nacim, CURDATE())` y todo lo demás
igual:

```
+------------+------+----------------------------+------+
| nroUsuario | zona | apell_nombre               | edad |
+------------+------+----------------------------+------+
|          2 | A1   | Caro (2,A1) sin planes     |   22 |
|          3 | A1   | Dani (3,A1) 30 anios       |   30 |
|          4 | D1   | Eva (4,D1) solo particular |   21 |
+------------+------+----------------------------+------+
```

La única fila que debía salir, `(1, A1)`, **no sale**: la excluye el plan con descuento de
`(1, D1)`. Es exactamente el error que nombra la afirmación. Las otras tres filas salen por errores
que la afirmación no pregunta, pero que conviene saber señalar:

| Fila que sale mal | Causa | Arreglo |
| --- | --- | --- |
| `(2, A1)`, sin planes, y `(4, D1)`, solo con un plan particular | falta la condición *"con algún plan para empresas asignado"*: el `NOT EXISTS` solo pide que no haya planes con descuento | agregar un `EXISTS` con el mismo `JOIN` y sin el filtro de descuento |
| `(3, A1)`, de 30 años | *"menores de 30"* es `< 30`, no `<= 30` | `< 30` |
| (ninguna: la consulta no corre) | `age()` es una función de PostgreSQL; MySQL no la tiene. Tampoco corre tal cual en PostgreSQL: `age()` devuelve un `interval` y `age(fecha_nacim) <= 30` falla con `ERROR: operator does not exist: interval <= integer` (PostgreSQL 16.13) | en MySQL, `TIMESTAMPDIFF(YEAR, fecha_nacim, CURDATE())`; en PostgreSQL, `EXTRACT(YEAR FROM age(fecha_nacim)) < 30` |

Consulta corregida y su salida:

```sql
SELECT u.nroUsuario, u.zona, u.apell_nombre, TIMESTAMPDIFF(YEAR, u.fecha_nacim, CURDATE()) AS edad
FROM usuario u
WHERE u.zona IN ('A1', 'D1')
  AND TIMESTAMPDIFF(YEAR, u.fecha_nacim, CURDATE()) < 30
  AND EXISTS (SELECT 1 FROM asignacion a JOIN plan_empr p ON a.cod_plan = p.cod_plan
              WHERE a.nroUsuario = u.nroUsuario AND a.zona = u.zona)
  AND NOT EXISTS (SELECT 1 FROM asignacion a JOIN plan_empr p ON a.cod_plan = p.cod_plan
              WHERE a.nroUsuario = u.nroUsuario AND a.zona = u.zona AND p.descuento > 0);
```

```
+------------+------+--------------+------+
| nroUsuario | zona | apell_nombre | edad |
+------------+------+--------------+------+
|          1 | A1   | Ana (1,A1)   |   25 |
+------------+------+--------------+------+
```

*(nota)* Si *"asignado"* se lee como *asignación vigente*, las dos subconsultas agregan
`(a.fecha_hasta IS NULL OR a.fecha_hasta >= CURDATE())`; el enunciado no lo aclara. Regla general
de subconsultas correlacionadas: [[1.05.01 - SQL — consultas|SQL — consultas]] § 10.3–10.4.

**Qué estuvo mal:** responder *Incorrecto* es dar por buena la correlación `a.nroUsuario =
u.nroUsuario`, como si `nroUsuario` identificara solo a un usuario. El DER marca `zona` como `PK FK`
en `USUARIO` y en `ASIGNACION`: la afirmación es correcta, y la prueba es la fila `(1, A1)`, que
desaparece por el descuento de otro usuario.

**Para el parcial.** Antes de evaluar una subconsulta correlacionada, mire la PK en el DER; si es
compuesta, la correlación tiene que igualar **todas** sus columnas.

## Pregunta 2 — ¿hace falta un ensamble externo entre `asignacion` y `plan_empr`? (OM, 2 puntos)

**Enunciado.** El mismo texto, DER y consulta de la Pregunta 1, con otra afirmación:

> Evalúe la siguiente afirmación e indique si es correcta o no: *"se debe aplicar un ensamble
> externo entre asignacion y plan_empr"*
>
> A. Correcto · B. Incorrecto

**Lo que respondió el alumno.** B · Incorrecto.

**Corrección de la plataforma.** 2/2 ✓. Clave: **B · Incorrecto**.

**Resolución del vault.** ✓ **B · Incorrecto.** La subconsulta busca asignaciones de **planes para
empresas** con descuento: el ensamble interno conserva exactamente las asignaciones cuyo plan está
en `PLAN_EMPR`, que es lo que hace falta. Un `LEFT JOIN` agregaría las asignaciones de planes
particulares con `descuento = NULL`; `NULL > 0` da *desconocido* y el `WHERE` las descarta, así que
el resultado no cambia: solo se hace trabajo de más. Corrida con los datos de la Pregunta 1 y
`LEFT JOIN` en la subconsulta: devuelve las mismas tres filas que el enunciado (`(2, A1)`, `(3, A1)`
y `(4, D1)`). Las filas del `LEFT JOIN`, antes del `WHERE` (respecto del ensamble interno solo agrega
la última, la del plan particular de `(4, D1)`, con `descuento` en `NULL`):

```
+------------+------+----------+-----------+-------------------+
| nroUsuario | zona | cod_plan | descuento | descuento_mayor_0 |
+------------+------+----------+-----------+-------------------+
|          1 | A1   |       10 |      0.00 |                 0 |
|          3 | A1   |       10 |      0.00 |                 0 |
|          1 | D1   |       20 |     15.00 |                 1 |
|          4 | D1   |       30 |      NULL |              NULL |
+------------+------+----------+-----------+-------------------+
```

Un ensamble externo sirve para **conservar** filas sin pareja (listar todos los usuarios con su plan
de empresa, si lo tienen). Aquí sería incluso peligroso en el `EXISTS` que le falta a la consulta:
contaría un plan particular como *"algún plan para empresas"*.
[[1.05.01 - SQL — consultas|SQL — consultas]] § 2.3 (ensambles externos).

**Para el parcial.** Un ensamble externo solo cambia el resultado si las filas sin pareja sobreviven
al `WHERE`; con una condición sobre una columna de la tabla opcional (`descuento > 0`) no sobreviven
nunca.

## Pregunta 3 — qué controla una `ASSERTION` sobre `tarea` y `empleado` (ensayo, 4 puntos)

**Enunciado.**

> Considerando el esquema de Películas:
>
> [DER: imagen exportada de Vertabelo, 13 tablas; ver la tabla de abajo]

DER de la pregunta. En el video se leen los 13 nombres de tabla y la forma de cada una, no los tipos
ni las marcas; coincide tabla por tabla con `raw/Unidad-01/Practica/esq_peliculas.sql`, de donde
salen las columnas, los tipos (`varchar` = `character varying`), las PK y las FK:

| Tabla | Columnas y tipos | PK | FK |
| --- | --- | --- | --- |
| `pelicula` | `codigo_pelicula numeric(5,0)`, `titulo varchar(60)`, `idioma varchar(20)`, `formato varchar(20)`, `genero varchar(30)`, `codigo_productora varchar(6)` | `codigo_pelicula` | `codigo_productora` → `empresa_productora` |
| `renglon_entrega` | `nro_entrega numeric(10,0)`, `codigo_pelicula numeric(5,0)`, `cantidad numeric(5,0)` | `(nro_entrega, codigo_pelicula)` | `nro_entrega` → `entrega`; `codigo_pelicula` → `pelicula` |
| `video` | `id_video numeric(5,0)`, `razon_social varchar(60)`, `direccion varchar(80)`, `telefono varchar(15)`, `propietario varchar(60)` | `id_video` | — |
| `empresa_productora` | `codigo_productora varchar(6)`, `nombre_productora varchar(60)`, `id_ciudad numeric(6,0)` | `codigo_productora` | `id_ciudad` → `ciudad` |
| `empleado` | `id_empleado numeric(6,0)`, `nombre varchar(30)`, `apellido varchar(30)`, `porc_comision numeric(6,2)`, `sueldo numeric(8,2)`, `e_mail varchar(120)`, `fecha_nacimiento date`, `telefono varchar(20)`, `id_tarea varchar(10)`, `id_departamento numeric(4,0)`, `id_distribuidor numeric(5,0)`, `id_jefe numeric(6,0)` | `id_empleado` | `id_tarea` → `tarea`; `(id_distribuidor, id_departamento)` → `departamento`; `id_jefe` → `empleado` |
| `nacional` | `id_distribuidor numeric(5,0)`, `nro_inscripcion numeric(8,0)`, `encargado varchar(60)`, `id_distrib_mayorista numeric(5,0)` | `id_distribuidor` | `id_distribuidor` → `distribuidor`; `id_distrib_mayorista` → `internacional` |
| `pais` | `id_pais char(2)`, `nombre_pais varchar(40)` | `id_pais` | — |
| `tarea` | `id_tarea varchar(10)`, `nombre_tarea varchar(35)`, `sueldo_maximo numeric(6,0)`, `sueldo_minimo numeric(6,0)` | `id_tarea` | — |
| `entrega` | `nro_entrega numeric(10,0)`, `fecha_entrega date`, `id_video numeric(5,0)`, `id_distribuidor numeric(5,0)` | `nro_entrega` | `id_video` → `video`; `id_distribuidor` → `distribuidor` |
| `internacional` | `id_distribuidor numeric(5,0)`, `codigo_pais varchar(5)` | `id_distribuidor` | `id_distribuidor` → `distribuidor` (`ON DELETE CASCADE`) |
| `ciudad` | `id_ciudad numeric(6,0)`, `nombre_ciudad varchar(100)`, `id_pais char(2)` | `id_ciudad` | `id_pais` → `pais` |
| `departamento` | `id_departamento numeric(4,0)`, `id_distribuidor numeric(5,0)`, `nombre_departamento varchar(30)`, `calle varchar(40)`, `numero numeric(6,0)`, `id_ciudad numeric(6,0)`, `jefe_departamento numeric(6,0)` | `(id_distribuidor, id_departamento)` | `id_distribuidor` → `distribuidor`; `id_ciudad` → `ciudad`; `jefe_departamento` → `empleado` |
| `distribuidor` | `id_distribuidor numeric(5,0)`, `nombre varchar(80)`, `direccion varchar(120)`, `telefono varchar(20)`, `tipo char(1)` | `id_distribuidor` | — |

Además, `esq_peliculas.sql` agrega restricciones `CHECK (... IS NOT NULL)` sobre varias columnas; en
las dos tablas de la aserción: `id_tarea`, `nombre_tarea`, `sueldo_maximo` y `sueldo_minimo` en
`tarea`; `id_empleado`, `apellido`, `e_mail`, `fecha_nacimiento` e `id_tarea` en `empleado`.

> ¿Qué busca el siguiente chequeo?
>
> ```sql
> CREATE ASSERTION ASS_emp_s
>         CHECK (NOT EXISTS (SELECT 1 FROM tarea NATURAL JOIN empleado WHERE sueldo > 0.75*sueldo_minimo
>                 AND porc_comision > 90) );
> ```

**Lo que respondió el alumno.**

> Chequea que no exista una tarea que cuente con empleados cuyo sueldo sea mayor al 75% del sueldo
> minimo y que su porc_comision sea mayor a 90.

**Corrección de la plataforma.** 3/4, parcial. Comentario del docente: *"Del sueldo minimo de la
tarea."*

**Resolución del vault.** Se lee de adentro hacia afuera:

1. **`NATURAL JOIN`** une por todas las columnas de igual nombre. Entre `tarea` y `empleado` hay una
   sola, `id_tarea` (verificado en `information_schema` sobre el esquema cargado en MySQL), así que
   cada empleado queda emparejado con **su** tarea.
2. **La consulta interna encuentra las violaciones:** empleados cuyo sueldo supera el 75 % del sueldo
   mínimo **de la tarea que desempeñan** y que además tienen un porcentaje de comisión mayor a 90.
3. **`NOT EXISTS`** exige que no haya ninguna.
4. **Tipo:** es una `ASSERTION`, restricción general o de base de datos (nivel 4), porque la condición
   cruza dos tablas. Debe verificarse ante un `INSERT` o `UPDATE` en `empleado` (`sueldo`,
   `porc_comision`, `id_tarea`) y ante un `UPDATE` de `sueldo_minimo` en `tarea`. Si `porc_comision`
   o `sueldo` es `NULL`, la condición da *desconocido* y la fila no cuenta como violación
   (`sueldo_minimo` no puede serlo: el esquema le pone `CHECK (sueldo_minimo IS NOT NULL)`).

**Qué faltó:** la respuesta pone a la tarea como sujeto y deja abierto de quién es el sueldo mínimo:
es lo que marca el docente. La fila que viola es el **empleado**, y la comparación es contra el
mínimo de **su propia tarea**, unida por `id_tarea`. Redacción para el puntaje completo:

> Controla que ningún empleado tenga un sueldo mayor al 75 % del sueldo mínimo de la tarea que tiene
> asignada (el `NATURAL JOIN` une `empleado` y `tarea` por `id_tarea`) y, a la vez, un porcentaje de
> comisión mayor a 90. Dicho en positivo: todo empleado que gane más del 75 % del mínimo de su tarea
> debe tener una comisión de 90 % o menos. Es una `ASSERTION` (restricción global, de base de
> datos) porque involucra dos tablas; se viola tanto al insertar o modificar un empleado como al
> bajar el sueldo mínimo de una tarea.

**En MySQL** no existe `CREATE ASSERTION` (ningún motor comercial la implementa; deck 10, slide 18,
citado en [[Práctica 2026-09-01]]):

```
ERROR 1064 (42000) at line 4: You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near 'ASSERTION ASS_emp_s ...
```

Sobre los datos del TP (siete empleados), la consulta interna devuelve 0 filas: la aserción se
cumpliría. El reemplazo son triggers en **las dos** tablas; corridos en MySQL 9.7.2 (base
`recupagepel`, con `esq_peliculas.sql` cargado):

```sql
CREATE TRIGGER tr_ass_emp_s_ins BEFORE INSERT ON empleado FOR EACH ROW
BEGIN
  IF NEW.porc_comision > 90
     AND NEW.sueldo > 0.75 * (SELECT sueldo_minimo FROM tarea WHERE id_tarea = NEW.id_tarea) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ASS_emp_s violada (empleado)';
  END IF;
END;
-- tr_ass_emp_s_upd: el mismo cuerpo, BEFORE UPDATE ON empleado
CREATE TRIGGER tr_ass_emp_s_tarea BEFORE UPDATE ON tarea FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM empleado e
             WHERE e.id_tarea = NEW.id_tarea AND e.porc_comision > 90
               AND e.sueldo > 0.75 * NEW.sueldo_minimo) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ASS_emp_s violada (tarea)';
  END IF;
END;
```

| Operación (tarea `T001`, sueldo mínimo 4000, umbral 3000) | Resultado |
| --- | --- |
| alta de un empleado con sueldo 5000 y comisión 95 | `ERROR 1644 (45000): ASS_emp_s violada (empleado)` |
| alta de un empleado con sueldo 2500 y comisión 95 | ✓ (2500 no supera 3000) |
| bajar el mínimo de `T001` a 3000 (umbral 2250 < 2500) | `ERROR 1644 (45000): ASS_emp_s violada (tarea)` |

La tercera fila es la que se olvida: con un trigger solo en `empleado`, la restricción se rompe desde
`tarea`. [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] § 4 ·
[[1.09.04 - Triggers|Triggers]].

**Para el parcial.** Una `ASSERTION` se lee así: la consulta interna describe las filas prohibidas y
el `NOT EXISTS` dice que no puede haber ninguna. Nombre quién es la fila que viola y contra qué se
compara.

## Pregunta 4 — `NOT IN` con un `NULL` en la subconsulta (OM, 2 puntos)

**Enunciado.**

> Considere que se crean las siguientes tablas en **MySQL** y se insertan los siguientes datos:
>
> ```sql
> CREATE TABLE JUGO (                 CREATE TABLE SABOR (
>    id INT PRIMARY KEY,                 id INT PRIMARY KEY,
>    [dudoso: marca] VARCHAR(16),        marca VARCHAR(16),
>    codigo_ean INT );                   sabor VARCHAR(8) NOT NULL );
>
> INSERT INTO JUGO VALUES (1, [dudoso: 'RINDE2'], [dudoso: 1151354787]), (2, 'TANG', 222353464), (3, 'ADES', NULL), (4, NULL, [dudoso: 542136499]);
> INSERT INTO SABOR VALUES (1, 'TANG', 'NARANJA'), (2, 'ADES', 'POMELO'), (3, 'BAGGIO', 'NARANJA'), (4, NULL,
> 'MANZANA');
> ```
>
> Al ejecutar la consulta a continuación se obtiene como resultado: **0 rows**.
>
> ```sql
> SELECT marca
> FROM jugo
> WHERE marca NOT IN (SELECT marca
>                     FROM sabor);
> ```
>
> ¿El comportamiento de la consulta es el esperado? Seleccione su respuesta, entre las opciones
> disponibles
>
> A. No, la sentencia escrita en MySQL debe retornar las marcas de jugos que no tengan registrados
> sabores en la base de datos.
> B. Sí, debido a que el valor NULL de la columna marca de la tabla SABOR fuerza a que la
> comparación dé como resultado desconocido, entonces no se listará ninguna tupla.
> C. Sí, ya que no hay marcas de jugos de los cuales no haya sabores registrados.
> D. Sí, debido a que el valor NULL de la columna marca de la tabla JUGO fuerza a que la comparación
> dé como resultado desconocido, entonces no se listará ninguna tupla.

*(nota)* Los cuatro `[dudoso]` quedan confirmados fuera del video: la columna `marca` la nombra la
consulta, y el Ejercicio 10 del [[Parcial 2Q-2023|Parcial 2Q-2023]] trae los mismos datos, legibles
(`'RINDE2'`, `1151354787`, `542136499`).

**Lo que respondió el alumno.** B.

**Corrección de la plataforma.** 2/2 ✓. Clave: **B**.

**Resolución del vault.** ✓ **B.** `x NOT IN (a, b, c, NULL)` equivale a `x <> a AND x <> b AND x <> c AND
x <> NULL`, y la última comparación es siempre *desconocida*. Corrida en MySQL 9.7.2:

```
-- consulta del enunciado
filas: 0
-- valor del predicado fila por fila
+--------+--------+
| marca  | not_in |
+--------+--------+
| RINDE2 |   NULL |
| TANG   |      0 |
| ADES   |      0 |
| NULL   |   NULL |
+--------+--------+
-- NOT IN (SELECT marca FROM SABOR WHERE marca IS NOT NULL)      → RINDE2
-- NOT EXISTS (SELECT 1 FROM SABOR s WHERE s.marca = j.marca)   → RINDE2, NULL
```

`RINDE2` es la única marca sin sabor, pero su predicado da *desconocido* y el `WHERE` solo deja pasar
lo verdadero. D es el distractor: el `NULL` de `JUGO` elimina solo **su propia** fila. C es falsa
(RINDE2 no tiene sabor) y A describe lo que se quería, no lo que el estándar hace. Los dos arreglos
son filtrar los nulos de la subconsulta o usar `NOT EXISTS`, que además devuelve el jugo de marca
`NULL`. [[1.05.01 - SQL — consultas|SQL — consultas]] § 10.5 y § 11.4.

*(nota)* La consulta escribe `jugo` y `sabor` en minúscula. En MySQL sobre Linux
(`lower_case_table_names = 0`, el caso del contenedor) los nombres de tabla distinguen mayúsculas y
la consulta literal falla con `ERROR 1146 (42S02): Table 'recupage.jugo' doesn't exist`; en Windows
y macOS no. La corrida de arriba usa `JUGO` y `SABOR`; el examen da los nombres por equivalentes.

**Para el parcial.** Un solo `NULL` en la lista de un `NOT IN` vacía el resultado; `NOT EXISTS` no
tiene ese problema.

## Pregunta 5 — `INSERT` por una vista `WITH LOCAL CHECK OPTION` (OM, 2 puntos)

**Enunciado.**

> Dadas las siguientes definiciones de vistas:
>
> ```sql
> CREATE VIEW MovimientoUSDT AS
> SELECT id_usuario, moneda, fecha, tipo, comision, valor
> FROM Movimiento
> WHERE moneda LIKE '%USDT%';
>
> CREATE VIEW MovUSDTValor AS
> SELECT * FROM MovimientoUSDT
> WHERE valor < 1200
> WITH LOCAL CHECK OPTION;
>
> CREATE VIEW MovUSDTValorComi AS
> SELECT * FROM MovUSDTValor
> WHERE comision < 25
> WITH CASCADED CHECK OPTION;
> ```
>
> Para la siguiente sentencia, considerando la existencia de la tabla *Movimiento* y suponiendo que
> está inicialmente vacía y que los datos que se pretende insertar satisfacen las restricciones de
> integridad referencial definidas. Indique si cada operación procede o no:
>
> ```sql
> INSERT INTO MovUSDTValor (id_usuario, moneda, fecha, tipo, comision, valor) VALUES ('3', 'BITCOIN', to_date('2020-03-03','yyyy-MM-dd'), 'S', 30, 700);
> ```
>
> A. Procede · B. No procede

**Lo que respondió el alumno.** A · Procede.

**Corrección de la plataforma.** 2/2 ✓. Clave: **A · Procede**.

**Resolución del vault.** ✓ **A · Procede.** `MovUSDTValor` es `LOCAL`: chequea su condición propia
(`valor < 1200`: 700 ✓) y las de las vistas subyacentes **que tengan su propio `WITH CHECK
OPTION`**. `MovimientoUSDT` no lo tiene, así que su `moneda LIKE '%USDT%'` no se controla y
`'BITCOIN'` pasa. La fila queda en `Movimiento`, invisible en las tres vistas. Corrida en MySQL
9.7.2:

```
-- con to_date, tal como está el enunciado
ERROR 1305 (42000) at line 19: FUNCTION recupage.to_date does not exist
-- con STR_TO_DATE('2020-03-03','%Y-%m-%d')
filas_insertadas: 1
-- estado final
+------------+---------+------------+------+----------+--------+
| id_usuario | moneda  | fecha      | tipo | comision | valor  |
+------------+---------+------------+------+----------+--------+
| 3          | BITCOIN | 2020-03-03 | S    |    30.00 | 700.00 |
+------------+---------+------------+------+----------+--------+
en_MovimientoUSDT: 0 · en_MovUSDTValor: 0 · en_MovUSDTValorComi: 0
```

*(atención)* `to_date` es de Oracle y PostgreSQL; en MySQL la fecha se escribe como literal o con
`STR_TO_DATE`. La fecha no interviene en ninguna condición de las vistas, así que el examen la da por
válida. La regla completa de `LOCAL` (propia más las subyacentes con WCO propio) está verificada en
[[1.06.01 - Vistas|Vistas]] § *`CASCADED` vs. `LOCAL`*.

**Para el parcial.** `LOCAL` no es *"solo la condición propia"*: es la propia más la de las vistas de
abajo que tengan su propio `CHECK OPTION`. Aquí procede porque la de abajo no lo tiene.

## Pregunta 6 — `INSERT` por una vista `WITH CASCADED CHECK OPTION`, con la clave mal configurada (OM, 2 puntos)

**Enunciado.** Las mismas tres vistas y el mismo párrafo de la Pregunta 5, con esta sentencia:

> ```sql
> INSERT INTO MovUSDTValorComi (id_usuario, moneda, fecha, tipo, comision, valor) VALUES ('2', 'EURO', to_date('2020-02-02','yyyy-MM-dd'), 'E', 20, 1000);
> ```
>
> A. No procede · B. Procede

**Lo que respondió el alumno.** A · No procede.

**Corrección de la plataforma.** 2/2, con ícono ✗ y rótulo `Incorrecta:` en la opción elegida;
clave automática **B · Procede**. Comentario del docente: *"Está mal configurada la pregunta. La
respuesta correcta es No Procede."*

**Resolución del vault.** ✓ **No procede — el alumno tenía razón.** `MovUSDTValorComi` es `CASCADED`:
chequea su condición y las de **todas** las vistas de abajo, tengan o no `CHECK OPTION`:
`comision < 25` (20 ✓), `valor < 1200` (1000 ✓) y `moneda LIKE '%USDT%'` (`'EURO'` ✗). Corrida en
MySQL 9.7.2 (fecha con `STR_TO_DATE`):

```
ERROR 1369 (HY000) at line 24: CHECK OPTION failed 'recupage.MovUSDTValorComi'
```

Control: la misma fila con `moneda = 'USDT'` procede y aparece en `MovUSDTValorComi`, así que lo único
que la rechaza es la moneda.

(atención) **La clave de la plataforma está invertida y manda el docente.** Tres cosas lo respaldan:
el estándar (`CASCADED` propaga a toda la cadena), el motor (error 1369) y el
[[Parcial 2Q2025|Parcial 2Q2025]], cuya Pregunta 1 es **este mismo `INSERT`** con la clave correcta,
*No procede*. La pastilla 2/2 muestra que el docente asignó los puntos a mano; el ícono ✗ y el rótulo
`Incorrecta:` quedaron de la corrección automática. [[1.06.01 - Vistas|Vistas]] § *`WITH CHECK
OPTION`*.

**Para el parcial.** `CASCADED` controla todo lo que está debajo, aunque las vistas de abajo no
tengan `CHECK OPTION`. Si la plataforma corrige distinto, la corrida en el motor es el argumento
para el reclamo.

## Pregunta 7 — qué índice usar para `UserID` en el login (OM, 2 puntos)

**Enunciado.**

> Suponga que estamos usando **MySQL** y queremos implementar una aplicación que será utilizada por
> miles de usuarios. Si se pretende agilizar la entrada a la aplicación, ¿qué tipo de índice
> utilizarías para el campo UserID?
>
> A. B-Tree · B. GIS · C. Ninguna de las opciones · D. Hash

**Lo que respondió el alumno.** A · B-Tree.

**Corrección de la plataforma.** 0/2 ✗. Clave: **D · Hash**.

**Resolución del vault.** **D · Hash.** Entrar a la aplicación es buscar un usuario por **igualdad
exacta** (`WHERE UserID = ?`), sin rangos ni orden. El deck de la
[[Clase 11 - Seguridad-Transacciones|Clase 11]] separa índices ordenados (B-tree) de asociativos
(hash) en el slide 32 y dice en el 37: *"Las Hashes se utilizan únicamente para comparaciones de
igualdad que utilizan los operadores = o <=> (pero son muy rápidos)"*. Su último slide, el 38, es
justamente un índice hash sobre una tabla de usuarios: `CREATE INDEX MYINDEX ON USERS (DNI) USING
HASH;`. Un B-tree también resuelve la igualdad, pero en O(log n) y con ventajas (rangos, `ORDER BY`,
prefijo izquierdo) que un login no usa; el hash la resuelve en un acceso. GIS es un índice espacial,
para datos geográficos: distractor.

**Qué estuvo mal:** B-Tree es la respuesta *por defecto* de MySQL, no la que pide la pregunta, que
es de criterio: igualdad pura → hash.

(atención) **En el motor, la respuesta de la cátedra no se ejecuta tal cual.** InnoDB acepta
`USING HASH` pero construye un B-tree; solo el motor `MEMORY` da un hash real. Corrida en MySQL 9.7.2:

```
-- CREATE UNIQUE INDEX ix_userid ON usuarios_app (UserID) USING HASH;   (InnoDB)
Note 3502: This storage engine does not support the HASH index algorithm, storage engine default was used instead.
+------------------+------------+------------+
| TABLE_NAME       | INDEX_NAME | INDEX_TYPE |
+------------------+------------+------------+
| usuarios_app     | ix_userid  | BTREE      |
| usuarios_app_mem | ix_userid  | HASH       |   <- misma sentencia, ENGINE=MEMORY
+------------------+------------+------------+
```

En el examen manda la clave, que coincide con el deck; si la pregunta fuera de desarrollo, conviene
responder *hash* y agregar esta salvedad. Detalle en [[1.08.02 - Índices|Índices]] § *Slide 38* y
[[Final 1Jul2025]] § *Pregunta 1*.

**Para el parcial.** Igualdad pura → hash; rangos, `ORDER BY` o prefijos → B-tree.

## Pregunta 8 — restricción de tabla: SQL estándar y MySQL (OM, 2 puntos)

**Enunciado.**

> Si tuvieras que especificar una restricción de tabla, ¿cómo lo implementarías teniendo en cuenta
> **SQL estándar** primero y luego **MySQL**?
>
> A. 1. CHECK 2. CHECK · B. 1. ASSERTION 2. CHECK · C. 1. CHECK 2. ASSERTION · D. 1. TRIGGER 2.
> TRIGGER · E. Ninguna opción es correcta · F. 1. CHECK 2. TRIGGER

**Lo que respondió el alumno.** F.

**Corrección de la plataforma.** 2/2 ✓. Clave: **F · 1. CHECK 2. TRIGGER**.

**Resolución del vault.** ✓ **F.** Una restricción *de tabla* involucra varias filas de la misma tabla
(nivel 3 de la jerarquía de [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]]). En
el estándar se escribe como `CHECK` de tabla **con subconsulta**; MySQL no admite subconsultas en un
`CHECK`, así que se implementa con un trigger. Corrida en MySQL 9.7.2, con el `CHECK` de tabla del
deck de la [[Clase 09 - Restricciones integridad-Parte 1|Clase 09]] (*"No puede haber más de 30
empleados por area"*):

```
-- CHECK (NOT EXISTS (SELECT 1 FROM empleado GROUP BY tipoA, idArea HAVING COUNT(*) > 30))
ERROR 1111 (HY000): Invalid use of group function
-- una subconsulta sin agregación tampoco se acepta:
-- CHECK (NOT EXISTS (SELECT 1 FROM empleado e WHERE e.sueldo > 100000))
ERROR 3815 (HY000): An expression of a check constraint 'chk_sub' contains disallowed function.
-- CHECK (comision <= sueldo), dos columnas de la misma fila (nivel tupla): sí existe y se aplica
ERROR 3819 (HY000): Check constraint 'chk_fila' is violated.
```

B confunde niveles: `ASSERTION` es para condiciones que cruzan **varias tablas** (Pregunta 3), y el
`CHECK` de MySQL solo alcanza una fila. Es la misma pregunta que la 24 del
[[Parcial 2Q2025|Parcial 2Q2025]].

**Para el parcial.** Atributo o tupla → `CHECK` en los dos; tabla → `CHECK` con subconsulta en el
estándar y trigger en MySQL; varias tablas → `ASSERTION` en el estándar y triggers en MySQL.

## Pregunta 9 — ¿el shared lock permite escribir? (V/F, 2 puntos)

**Enunciado.**

> Los bloqueos compartidos (Shared Lock) permiten tanto lectura como escritura concurrente sobre un
> dato.

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Falso**.

**Resolución del vault.** ✓ **Falso.** Slide 25 de la [[Clase 11 - Seguridad-Transacciones|Clase 11]]: el
Shared Lock *"permite que múltiples transacciones lean un dato, pero ninguna pueda modificarlo hasta
que se libere el bloqueo"*. S es compatible con S y no con X. Corrida en MySQL 9.7.2 con dos
sesiones: A toma `SELECT … FOR SHARE` y espera 5 s; mientras tanto B toma otro `FOR SHARE` sin
esperar, pero su `UPDATE` queda bloqueado:

```
B: otra lectura FOR SHARE   saldo 100        (inmediata)
B: intenta UPDATE
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction   (innodb_lock_wait_timeout = 1)
```

[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] § 3.1.

**Para el parcial.** Shared = varios leen, nadie escribe; exclusive = uno lee y escribe.

## Pregunta 10 — dirty read (V/F, 2 puntos)

**Enunciado.**

> El fenómeno de Dirty Read ocurre cuando una transacción accede a datos modificados por otra que aún
> no ha sido confirmada.

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Verdadero**.

**Resolución del vault.** ✓ **Verdadero.** Es la definición del slide 23 (*"una transacción lee datos
modificados por otra transacción que aún no ha sido confirmada"*). Corrida en MySQL 9.7.2: la
sesión A hace `UPDATE cuenta SET saldo = 999` sin confirmar; la sesión B lee:

```
+------------------+-------+
| nivel_B          | saldo |
+------------------+-------+
| READ-UNCOMMITTED |   999 |   <- dirty read: 999 nunca se confirmó
+------------------+-------+
| READ-COMMITTED   |   100 |
+------------------+-------+
-- A hace ROLLBACK; el saldo queda en 100
```

[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] § 2.

**Para el parcial.** Dirty read = leer lo no confirmado; si el otro deshace, se usó un valor que
nunca existió.

## Pregunta 11 — objetivo del control de concurrencia (V/F, 2 puntos)

**Enunciado.**

> El control de concurrencia busca garantizar que la ejecución simultánea de transacciones no
> comprometa la consistencia de la base de datos.

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Verdadero**.

**Resolución del vault.** ✓ **Verdadero.** Slide 21: *"El esquema de control de concurrencia de un DBMS
controla la interacción entre las transacciones concurrentes para evitar que se destruya la
consistencia de la base de datos"*.
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] § *Qué es*.

**Para el parcial.** El objetivo es la serializabilidad: ejecutar en paralelo con el resultado de
alguna ejecución en serie.

## Pregunta 12 — `READ UNCOMMITTED` (V/F, 2 puntos)

**Enunciado.**

> El nivel de aislamiento Read Uncommitted permite leer datos que aún no han sido confirmados.

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Verdadero**.

**Resolución del vault.** ✓ **Verdadero.** Slide 28: *"permite lecturas de datos no confirmados (dirty
reads)"*. La corrida de la Pregunta 10 lo muestra: en `READ-UNCOMMITTED` la sesión B lee el 999 sin
confirmar; en `READ-COMMITTED`, el 100.
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] § 4.

**Para el parcial.** De los cuatro niveles, solo `READ UNCOMMITTED` admite dirty reads; el default de
InnoDB es `REPEATABLE READ`.

## Pregunta 13 — traducir un `JOIN` con `ORDER BY` a MongoDB (ensayo, 6 puntos)

**Enunciado.**

> Traduzca a **MongoDB** la siguiente query:
>
> ```sql
> SELECT P.nombre, PCIA.nombre
> FROM PAIS P JOIN PROVINCIA PCIA
> ON P.id=PCIA.pais
> ORDER BY P.nombre, PCIA.nombre DESC;
> ```
>
> Suponga que existe una colección **Pais** que almacena documentos de esta forma:
>
> ```
> [{_id:"Argentina", "cant_habitantes(MM)":47, "superficie(MMkm2)":2.78},
> [dudoso: {{]_id:"España", "cant_habitantes(MM)":47.78, "superficie(MMkm2)":0.5[dudoso: }]]
> ```
>
> Y una colección **Provincia** que almacena documentos de esta forma:
>
> ```
> [{_id:"San Juan", "cant_habitantes(MM)":0.73, "pais":"Argentina"},
> [dudoso: {{]_id:"Catalunya", "cant_habitantes(MM)":7.5, "pais":"España"[dudoso: }]]
> ```

**Lo que respondió el alumno.**

> ```
> db.Pais.aggregate([
> {
>   $foreign:{
>     $localfield:"_id"
>     $foreignfield:"pais"
>     $equals:1
> },
> {
>   $unwind:"Provincia"
> },
> {
>   $sort:-1
> },
> {
>   $project:{_id:0, nombre_pais:"$Pais._id", nombre_provincia:"$Provincia._id"};
> }
> ]);
> ```

**Corrección de la plataforma.** 3/6, parcial. Comentario del docente: *"Era lookup. Falta la tabla
para joinear. Sort incorrecto."*

**Resolución del vault.** En estos documentos el nombre del país y de la provincia es el `_id`, y la
FK es `Provincia.pais`. El `JOIN` es `$lookup`, el paso de arreglo a una fila por pareja es
`$unwind`, y el `ORDER BY` de dos columnas con sentidos distintos es un `$sort` con dos claves:

```js
db.Pais.aggregate([
  { $lookup: { from: "Provincia", localField: "_id", foreignField: "pais", as: "provincias" } },
  { $unwind: "$provincias" },
  { $sort: { _id: 1, "provincias._id": -1 } },
  { $project: { _id: 0, pais: "$_id", provincia: "$provincias._id" } }
]);
```

Corrida en MongoDB 8.3.11 (base `recupage`), con los documentos del enunciado más `Mendoza`,
`Andalucía` y un país sin provincias (`Uruguay`) para que el orden y el `JOIN` interno se vean:

```
{"pais":"Argentina","provincia":"San Juan"}
{"pais":"Argentina","provincia":"Mendoza"}
{"pais":"España","provincia":"Catalunya"}
{"pais":"España","provincia":"Andalucía"}
```

Es la misma salida que el `SELECT` original en MySQL 9.7.2 con los mismos datos. `Uruguay` no sale
porque `$unwind` descarta los arreglos vacíos, como el `JOIN` interno descarta un país sin
provincias (con `preserveNullAndEmptyArrays: true` sería un `LEFT JOIN`). Partir de `Provincia` es
igual de válido: `$lookup` con `from: "Pais", localField: "pais", foreignField: "_id"`, `$unwind`,
`$sort: { "p._id": 1, _id: -1 }` y la misma proyección; da la misma salida.

**Qué estuvo mal**, error por error, con el mensaje real de MongoDB 8.3.11 cuando lo hay:

| En la respuesta | Problema | Mensaje del motor | Corrección |
| --- | --- | --- | --- |
| `$foreign` | la etapa no existe | `Unrecognized pipeline stage name: '$foreign'` | `$lookup` |
| sin `from` ni `as` | falta la colección a unir (el *"falta la tabla para joinear"* del docente) y el campo destino | sin `from`: `must specify 'pipeline' when 'from' is empty`; sin `as`: `BSON field '$lookup.as' is missing but a required field` | `from: "Provincia"`, `as: "provincias"` |
| `$localfield`, `$foreignfield` | los nombres de opción no llevan `$` y distinguen mayúsculas | `BSON field '$lookup.$localfield' is an unknown field.` (y sin el `$`, `'$lookup.localfield'`: tampoco sirve en minúscula) | `localField`, `foreignField` |
| `$equals:1` | no existe esa opción; la igualdad ya la dan `localField`/`foreignField` | `BSON field '$lookup.$equals' is an unknown field.` | quitarla |
| `$unwind:"Provincia"` | el camino lleva `$` y nombra el campo del `as` (si el `as` fuera `"Provincia"`, `"$Provincia"` serviría) | `path option to $unwind stage should be prefixed with a '$': Provincia` | `$unwind: "$provincias"` |
| `$sort:-1` | `$sort` recibe un documento `{campo: 1 o -1}`; además hay dos criterios | `the $sort key specification must be an object` | `{ _id: 1, "provincias._id": -1 }` |
| `"$Pais._id"` | no hay campo `Pais`: en un `aggregate` sobre `Pais`, el país está en la raíz | sin error: `nombre_pais` desaparece de la salida (`{"nombre_provincia":"San Juan"}`) | `"$_id"` y `"$provincias._id"` |
| comas y llaves | faltan comas entre propiedades, la primera etapa no cierra y hay un `;` dentro del arreglo | la respuesta tal cual no llega al servidor: `SyntaxError: Unexpected token, expected "," (5:4)`, en la línea de `$foreignfield` (mongosh 2.11.1) | la consulta corregida de arriba |

Lo que sí estaba bien y explica los 3 puntos: partir de `aggregate` sobre `Pais`, desarmar el arreglo
con `$unwind` y proyectar sin `_id`. El mismo `$sort: -1` inválido aparece en la nota de
[[Práctica subida por la cátedra]] § *Ejercicio 7*.
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] § 3 (`$lookup`), § 4 (`$unwind`) y § 5 (traducción SQL → pipeline).

**Para el parcial.** `JOIN` → `$lookup` (`from`, `localField`, `foreignField`, `as`) + `$unwind:
"$<as>"`; `ORDER BY a, b DESC` → `$sort: { a: 1, b: -1 }`.

## Pregunta 14 — ¿MongoDB recomienda MapReduce antes que el aggregation pipeline? (V/F, 2 puntos)

**Enunciado.**

> **MongoDB** recomienda Map-Reduce para analytics modernos antes que Aggregation Pipeline.

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 0/2 ✗, rótulo `Incorrecto:`. Clave: **Falso**.

**Resolución del vault.** **Falso.** Es al revés: `mapReduce` está **deprecado desde MongoDB 5.0** y la
documentación oficial remite al aggregation pipeline. El propio `mongosh` lo avisa al usarlo; corrida
en MongoDB 8.3.11 (provincias por país):

```
DeprecationWarning: Collection.mapReduce() is deprecated. Use an aggregation instead.
See https://mongodb.com/docs/manual/core/map-reduce for details.
[ { _id: 'España', value: 2 }, { _id: 'Argentina', value: 2 } ]
-- lo mismo con aggregate([{ $group: { _id: "$pais", value: { $sum: 1 } } }, { $sort: { _id: 1 } }])
{"_id":"Argentina","value":2}
{"_id":"España","value":2}
```

**Qué estuvo mal:** marcar Verdadero, que invierte la recomendación oficial. El deck de la
[[Clase 14 - MongoDB Features|Clase 14]] presenta `mapReduce` sin decir que está deprecado, y eso
induce el error; el vault lo registra en
[[2.14.03 - MapReduce|MapReduce]] § 6 como (crítico).

**Para el parcial.** Hoy todo `mapReduce` se escribe como pipeline (`$group` + `$out`); `mapReduce`
solo sirve para leer código viejo.

## Pregunta 15 — la función `map` emite pares clave-valor (V/F, 2 puntos)

**Enunciado.**

> La función map de Map-Reduce, genera pares clave-valor

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Verdadero**.

**Resolución del vault.** ✓ **Verdadero.** `map` recorre cada documento y llama a `emit(clave, valor)`; el
motor agrupa los valores por clave y `reduce` los combina (en la corrida de la Pregunta 14,
`emit(this.pais, 1)`). [[2.14.03 - MapReduce|MapReduce]] § 1.

**Para el parcial.** `map` emite pares; `reduce` recibe una clave y la lista de sus valores, y debe
poder aplicarse sobre resultados parciales.

## Pregunta 16 — MapReduce procesa en paralelo (V/F, 2 puntos)

**Enunciado.**

> Map-Reduce procesa datos en paralelo.

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Verdadero**.

**Resolución del vault.** ✓ **Verdadero.** El modelo reparte el `map` entre los nodos que tienen los datos
y combina los parciales con `reduce`: por eso `reduce` tiene que ser asociativa.
[[2.14.03 - MapReduce|MapReduce]] § 4 (el diagrama del slide 37 de la Clase 14).

**Para el parcial.** Paralelismo es la razón de ser de MapReduce y el origen de la regla de
asociatividad.

## Pregunta 17 — ¿MongoDB es AP? (V/F, 2 puntos)

**Enunciado.**

> **MongoDB** es AP según el teorema CAP

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Falso**.

**Resolución del vault.** ✓ **Falso.** El slide 18 de la [[Clase 12 - Introduccion a NoSQL|Clase 12]] lo
pone en **CP**: con un solo primario que acepta escrituras, ante una partición la minoría deja de
escribir. Es la Pregunta 10 del [[Parcial 2Q2025|Parcial 2Q2025]], con la misma clave.
[[2.12.04 - Teorema CAP|Teorema CAP]] § 4.2 y § 5.

**Para el parcial.** Clasificación del deck: MySQL CA, MongoDB CP, Cassandra AP.

## Pregunta 18 — Cypher: personas a las que les gusta un vino tinto con rating de 95 o más (ensayo, 6 puntos)

**Enunciado.**

> Suponga que en la base de datos de **Neo4j** existen nodos de tipo `Person` y `Wine`.
>
> Queremos crear una consulta en **Cypher** que encuentre todas las personas que **les gusta algún
> vino** de tipo "red wine" con una puntuación (`rating`) **mayor o igual a 95**, según alguna
> publicación (`Publication`). Devuelva el nombre de la persona, el nombre del vino y el nombre de la
> publicación ordenados por el rating de mayor a menor.

**Lo que respondió el alumno.**

> ```cypher
> MATCH (p:Person)-[pub:PUBLICATION]->(w:Wine)
> WHERE w.type = "red wine" AND pub.rating >=95
> RETURN p.name AS person_name, w.name AS wine_name, pub.name AS publication_name
> ORDER BY pub.rating DESC;
> ```

**Corrección de la plataforma.** 5/6, parcial. Comentario del docente: *"Publication es un nodo, no
una relación."*

**Resolución del vault.** *(Neo4j se dicta el 19/10; no verificado en el motor.)* El enunciado no da
los nombres de las relaciones; el modelo de referencia es el del libro obligatorio, *Seven Databases
in Seven Weeks* 2ª ed. cap. 6, *Day 1*: `Publication` es un **nodo** (impresa 181), se conecta con el
vino por la relación `reported_on` (impresa 182), el puntaje es una **propiedad de esa relación**
(impresa 183: `CREATE (p)-[r:reported_on {rating: 97}]->(w)`), la persona se conecta con el vino por
`likes` (impresa 185) y el tipo de vino es la propiedad `style` (impresa 181). Con ese modelo:

```cypher
MATCH (p:Person)-[:likes]->(w:Wine)<-[r:reported_on]-(pub:Publication)
WHERE w.style = "red wine" AND r.rating >= 95
RETURN p.name AS persona, w.name AS vino, pub.name AS publicacion
ORDER BY r.rating DESC;
```

**Qué estuvo mal:** la respuesta usa la publicación como relación entre persona y vino. Con eso se
pierden dos cosas: la relación *"le gusta"* entre la persona y el vino, y el nodo publicación, cuyo
nombre hay que devolver. El patrón correcto tiene **dos** relaciones que llegan al mismo vino: la
persona que lo quiere y la publicación que lo puntúa. Si se usan otros nombres de relación o de
propiedad, conviene declararlos (*"supongo `(:Person)-[:LIKES]->(:Wine)` y
`(:Publication)-[:RATED {rating}]->(:Wine)`"*).

**Para el parcial.** En Cypher los sustantivos son nodos y los verbos, relaciones; el dato del vínculo
(el rating que una publicación le da a un vino) va como propiedad de la relación.

## Pregunta 19 — relaciones con dirección, consultables en ambos sentidos (V/F, 2 puntos)

**Enunciado.**

> Una relación en **Neo4j** puede tener **dirección** (por ejemplo, (:Person)-[:likes]->(:Wine)),
> pero también puede consultarse en ambos sentidos con el operador [dudoso: --]

*(nota)* El operador final se ve como un trazo del ancho de dos guiones, `--`; podría ser un guion
medio puesto por el autocorrector.

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Verdadero**.

**Resolución del vault.** ✓ **Verdadero** *(no verificado en el motor)*. Toda relación se guarda con
dirección, pero un patrón sin flecha la encuentra en cualquier sentido: `(a)--(b)` o
`(a)-[:likes]-(b)`. El libro usa `-->` en la impresa 186 y el patrón sin flecha
`(fof:Person)-[:friends]-(f:Person)` en la 187 (*Seven Databases* 2ª ed. cap. 6). Es el complemento de
la Pregunta 18 del [[Parcial 1Q2026]] (*"las relaciones son bidireccionales por defecto y no pueden
tener propiedades"*: Falso).

**Para el parcial.** Se crea con flecha; se consulta con o sin ella.

## Pregunta 20 — Neo4j HA: qué devuelve el `MATCH` en el nodo 3 (ensayo, 4 puntos)

**Enunciado.**

> Imagine en ambiente HA en **Neo4J**, donde se levantan 3 nodos:
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
> neo4j> match (n) return n;
> ```
>
> **¿Cuál es el resultado del query?**

**Lo que respondió el alumno.**

> Deberia devolver ambos
> (p:Person {name: "Homero"})
> (p:Person {name: "Bart"})

**Corrección de la plataforma.** 4/4 ✓.

**Resolución del vault.** ✓ **Los dos nodos** *(no verificado en el motor)*. En un clúster HA las
escrituras se replican a todos los nodos, así que el `MATCH` del nodo 3 ve a Homero (creado en el
nodo 2) y a Bart (creado en el propio nodo 3). El mecanismo, según el libro: los esclavos aceptan
escrituras, *"Slave writes will synchronize with the master node, which will then propagate those
changes to the other slaves"* (*Seven Databases* 2ª ed. cap. 6, *Day 3*, impresa 203). Es casi literal el ejemplo de *Seven Databases* 2ª
ed. cap. 6, *Day 3*: tres nodos arrancados igual (impresa 205), un `CREATE` en un nodo y el
`MATCH (n) RETURN n;` en otro, con *"Our data has been successfully replicated across nodes"*
(impresa 206). La misma página agrega que el clúster *"is only eventually consistent"*: en rigor, el
nodo de Homero podría no haber llegado todavía al nodo 3; la respuesta esperada es *los dos*. Es la
Pregunta 4 del [[Parcial 2Q2025|Parcial 2Q2025]].

**Para el parcial.** HA replica en todos los nodos; si pide justificar, mencione que es
eventualmente consistente (AP, impresa 208).

## Pregunta 21 — Cypher a lenguaje natural (ensayo, 3 puntos)

**Enunciado.**

> Redacte en lenguaje natural la pregunta que le solicitan responder, para construir la siguiente
> consulta en **Neo4j**:
>
> ```cypher
> MATCH (actor:Person)-[:ACTED_IN]->(movie:Movie)
> WHERE movie.title STARTS WITH "T"
> RETURN movie.title AS title, count(actor.name) AS cant
> ORDER BY title ASC LIMIT 10;
> ```

**Lo que respondió el alumno.**

> Cuantos actores actuaron en cada pelicula cuyo titulo comienza por T, Ordenado ascendentemente por
> titulo con maximo 10 resultados

**Corrección de la plataforma.** 3/3 ✓.

**Resolución del vault.** ✓ *(No verificado en el motor.)* La respuesta es correcta y completa: filtro
(`STARTS WITH "T"`), agrupamiento implícito por título (en Cypher, las columnas no agregadas del
`RETURN` son la clave de grupo), cuenta de actores, orden y límite. Matiz para un 10: `count(actor.name)`
cuenta los nombres no nulos, como `COUNT(col)` en SQL. Es la Pregunta 22 del
[[Parcial 2Q2025|Parcial 2Q2025]].

**Para el parcial.** Nombre las cinco piezas: qué se filtra, por qué se agrupa, qué se cuenta, cómo
se ordena y cuántos se devuelven.

## Pregunta 22 — restricción de unicidad en Cypher (ensayo, 3 puntos)

**Enunciado.**

> Escriba la sentencia en **Cypher** que permita crear una restricción de unicidad en el modelo de
> datos de una base **Neo4j**.
>
> Tome como ejemplo un nodo *Publication* que tiene una propiedad llamada *name* a la cual queremos
> agregarle la restricción de unicidad.

**Lo que respondió el alumno.**

> ```cypher
> CREATE CONSTRAINT ON (p:Publication)
> ASSERT p.name IS UNIQUE;
> ```

**Corrección de la plataforma.** 3/3 ✓.

**Resolución del vault.** ✓ *(No verificado en el motor.)* Correcta con la sintaxis del libro, *Seven
Databases* 2ª ed. cap. 6 (impresa 187: `CREATE CONSTRAINT ON (w:Wine) ASSERT w.name IS UNIQUE;`,
escrito para Neo4j 3.1). (atención) Esa forma se **eliminó en Neo4j 5.0**; la vigente es:

```cypher
CREATE CONSTRAINT publication_name IF NOT EXISTS
FOR (p:Publication) REQUIRE p.name IS UNIQUE;
```

(documentación oficial, *Cypher Manual 5*, § *Deprecations, additions and removals*: `CREATE
CONSTRAINT ON ... ASSERT ...` reemplazado por `CREATE CONSTRAINT FOR ... REQUIRE ...`). Aquí la
cátedra aceptó la del libro; la Pregunta 20 del [[Parcial 2Q2025|Parcial 2Q2025]] trae la nueva. Lo
seguro es escribir la nueva y mencionar la vieja.

**Para el parcial.** `FOR … REQUIRE … IS UNIQUE` (Neo4j 5+); `ON … ASSERT` es la del libro.

## Pregunta 23 — ¿`DETACH DELETE` conserva las relaciones? (V/F, 2 puntos)

**Enunciado.**

> El comando MATCH (n) DETACH DELETE n de Cypher en **Neo4j**: borra todos los nodos pero mantiene
> las relaciones existentes.

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Falso**.

**Resolución del vault.** ✓ **Falso** *(no verificado en el motor)*. `DETACH DELETE` borra el nodo **y
todas sus relaciones**; una relación no puede quedar sin sus dos extremos. Sin `DETACH`, el borrado
de un nodo con relaciones falla: el libro lo dice (*"you can't delete a node that still has
relationships associated with it"*) y, para vaciar el grafo, usa `MATCH (n) OPTIONAL MATCH (n)-[r]-()
DELETE n, r` (*Seven Databases* 2ª ed. cap. 6, impresa 184). `MATCH (n) DETACH DELETE n` es la forma
corta de lo mismo: deja el grafo vacío.

**Para el parcial.** `DELETE` falla si el nodo tiene relaciones; `DETACH DELETE` se las lleva.

## Pregunta 24 — amigos de amigos de "Ana" (ensayo, 4 puntos)

**Enunciado.**

> Dado el siguiente modelo en **Neo4j**:
>
> ```
> (Person)-[:FRIEND]->(Person)
> (Person)-[:LIKES]->(Movie)
> ```
>
> Escriba la consulta en Cypher para: **Obtener los amigos de amigos de "Ana".**

**Lo que respondió el alumno.**

> ```cypher
> MATCH (ana:Person)-[:FRIEND]->(f:Person)-[:FRIEND]->(ff:Person)
> RETURN ff.name AS name
> ```

**Corrección de la plataforma.** 3/4, parcial. Comentario del docente: *"Faltó filtrar por Ana."*

**Resolución del vault.** *(No verificado en el motor.)* Hay que fijar a Ana por su propiedad
`name`:

```cypher
MATCH (ana:Person {name: "Ana"})-[:FRIEND]->(:Person)-[:FRIEND]->(fof:Person)
WHERE fof <> ana
RETURN DISTINCT fof.name AS name;
```

El `{name: "Ana"}` es lo que pedía el docente. `DISTINCT` evita repetir a quien se alcanza por dos
amigos distintos, y `fof <> ana` excluye a Ana si hay un ciclo; si además se quieren excluir los
amigos directos, `AND NOT (ana)-[:FRIEND]->(fof)`. Si la amistad se modela como simétrica, el patrón
va sin flecha (`-[:FRIEND]-`). El libro trae la misma consulta para Patty, con el filtro y sin
flecha: `MATCH (fof:Person)-[:friends]-(f:Person)-[:friends]-(p:Person {name: "Patty"}) RETURN
fof.name;` (*Seven Databases* 2ª ed. cap. 6, impresa 187).

**Qué estuvo mal:** llamar `ana` a la variable no filtra nada: el patrón recorre a **todas** las
personas y devuelve los amigos de amigos de cualquiera. El resto del patrón (dos saltos `FRIEND` con
flecha y `RETURN` del nombre) estaba bien, y el docente descontó 1 de 4 puntos con ese único
comentario.

**Para el parcial.** El nombre de una variable no es un filtro; el filtro va en `{propiedad: valor}`
o en el `WHERE`.

## Pregunta 25 — motor para una tabla de posiciones de un juego masivo (OM, 4 puntos)

**Enunciado.**

> Se necesita implementar una tabla de posiciones para un juego muy popular de éxito mundial, con los
> atributos *UserID* y *Score*. Se esperan alrededor de 1.000.000 de transacciones por segundo.
> ¿Qué base de datos NoSQL utilizaría?
>
> A. Redis · B. Neo4j · C. MongoDB · D. HBase · E. Cassandra

**Lo que respondió el alumno.** C · MongoDB.

**Corrección de la plataforma.** 0/4 ✗. Clave: **A · Redis**.

**Resolución del vault.** **A · Redis** *(Redis se dicta el 26/10; no verificado en el motor)*. Una
tabla de posiciones es un **ranking por puntaje**, y Redis tiene la estructura exacta: el *sorted
set*, un conjunto de miembros únicos ordenados por *score*, en memoria, con inserción en O(log N) y
lectura por rango ya ordenada (*Seven Databases* 2ª ed. cap. 8, § *Sorted Sets*, impresas 268–271). Con `UserID` como
miembro y `Score` como puntaje:

```
ZADD ranking 1500 user:42          -- alta o actualización del puntaje
ZINCRBY ranking 25 user:42         -- sumar puntos
ZREVRANGE ranking 0 9 WITHSCORES   -- top 10
ZREVRANK ranking user:42           -- posición de un jugador
```

**Qué estuvo mal y por qué no las otras:** MongoDB (la elegida) guarda documentos en disco y tendría que mantener un
índice sobre `Score` y ordenar para cada ranking, con un único primario por *shard* que recibe todas
las escrituras: no es el caso de uso. Cassandra y HBase escriben muy rápido, pero ordenan solo **dentro
de una partición**: un ranking global exige poner a todos los jugadores en la misma partición, un
punto caliente
([[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]]). Neo4j es un grafo: no hay relaciones que recorrer. El
[[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]] (Pregunta 10) trae la misma tabla de
posiciones con 100.000 transacciones/s y la misma respuesta; en cambio, el [[Final 1Jul2025]]
(Pregunta 4) pide 10⁹ **escrituras**/s sobre `userID` y `score` sin hablar de tabla de posiciones, y
ahí el vault sostiene Cassandra (las dos copias de esa fuente se contradicen: una dice Cassandra y la
otra, Redis). Lo que decide es *"tabla de posiciones"*, no solo el volumen. Criterio general en
[[2.12.03 - Persistencia políglota|Persistencia políglota]].

**Para el parcial.** Ranking, top-N o *leaderboard* → Redis con sorted sets; escritura masiva sin
ranking global → Cassandra.

## Pregunta 26 — bases de datos en configuración CA (OM varias, 3 puntos)

**Enunciado.**

> Elija ejemplos de las bases de datos vistas en clase que funcionan bajo la configuración CA.
>
> A. MySQL · B. Neo4j · C. Ninguna de las opciones es correcta · D. MongoDB · E. Cassandra

**Lo que respondió el alumno.** A y B.

**Corrección de la plataforma.** 3/3 ✓. Clave: **A (50 %) y B (50 %)**; C −33,34 %, D y E −33,33 %.

**Resolución del vault.** ✓ **A y B.** MySQL está en la columna CA del slide 18 de la
[[Clase 12 - Introduccion a NoSQL|Clase 12]]. Neo4j **no** figura en ese slide: la clave sigue a
*Seven Databases* 2ª ed. apéndice A2, § *CAP in the Wild* (impresa 317): *"Redis, PostgreSQL, and
Neo4J are consistent and available (CA); they don't distribute data"*. MongoDB es CP y Cassandra, AP.
(atención) El mismo libro pone a Neo4j **HA** en AP (cap. 6, impresa 208): CA vale para una instancia
sin distribuir, que es lo que la plataforma toma. Es la Pregunta 13 del [[Parcial 2Q2025|Parcial 2Q2025]],
con la misma clave. [[2.12.04 - Teorema CAP|Teorema CAP]] § 4.3.

**Para el parcial.** CA = no distribuido: MySQL y Neo4j en instancia única.

## Pregunta 27 — ¿Redis no tiene seguridad a nivel de comandos? (V/F, 2 puntos)

**Enunciado.**

> **Redis** no provee ningún mecanismo de seguridad a nivel de comandos.

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Falso**.

**Resolución del vault.** ✓ **Falso** *(no verificado en el motor)*. El libro lo dice con esas palabras:
*"Redis provides command-level security through obscurity"*, con `rename-command` en `redis.conf`
para renombrar un comando peligroso (`FLUSHALL`) o anularlo con `""` (*Seven Databases* 2ª ed. cap. 8,
§ *Security*, impresa 280). Desde Redis 6 hay además **ACL**, que limita por usuario los comandos que
puede ejecutar y las claves que puede tocar (documentación oficial:
<https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/>).

**Para el parcial.** `rename-command` (libro) y ACL por usuario (Redis 6+).

## Pregunta 28 — valores de `appendfsync` del AOF (OM varias, 3 puntos)

**Enunciado.** Con el recuadro de crédito parcial y negativo.

> ¿Cuáles son las posibles configuraciones que puede tener la propiedad fsync de AOF en **Redis**?
>
> A. always · B. everyminutes · C. sometimes · D. no · E. everysec

**Lo que respondió el alumno.** B, D y E.

**Corrección de la plataforma.** 0,49/3, parcial. Clave: **A (33,34 %), D (33,33 %) y E (33,33 %)**;
B y C, −50 % cada una. Cuenta: 33,33 + 33,33 − 50 = 16,66 % de 3 = 0,4998 → 0,49.

**Resolución del vault.** **A, D y E** *(no verificado en el motor)*. Las tres políticas de
`appendfsync` son `always` (cada comando; la más durable y la más lenta), `everysec` (una vez por
segundo; el default: se pierde a lo sumo un segundo) y `no` (el sistema operativo decide cuándo)
(*Seven Databases* 2ª ed. cap. 8, § *Durability*, impresas 279–280). `everyminutes` y `sometimes` no
existen.

**Qué estuvo mal:** marcar `everyminutes`, que restó 50 % —más de lo que habría perdido dejando
`always` sin marcar—, y omitir `always`.

**Para el parcial.** `always` · `everysec` · `no`. En preguntas con crédito negativo, una opción
dudosa sin marcar cuesta menos que una marcada mal.

## Pregunta 29 — tres títulos de películas con un solo comando (ensayo, 3 puntos)

**Enunciado.**

> Escriba el comando **(solo 1 comando)** necesario para insertar 3 títulos de películas en una base
> de datos **Redis**.

**Lo que respondió el alumno.**

> ```
> MSET pelicula 1 "Bob Esponja" pelicula:2 "Cars" pelicula:3 "Los Increibles"
> ```

*(nota)* Entre `pelicula` y `1` se ve un espacio, no dos puntos; los `:` de `pelicula:2` y
`pelicula:3` se leen nítidos en la misma imagen. No se distingue si *Increibles* lleva tilde.

**Corrección de la plataforma.** 3/3 ✓.

**Resolución del vault.** *(No verificado en el motor.)* La intención es correcta: `MSET` asigna
varias claves en una sola llamada (*Seven Databases* 2ª ed. cap. 8, impresa 261).
(atención) Tal como quedó escrito, con el espacio, `MSET` recibe siete argumentos
(`pelicula`, `1`, `"Bob Esponja"`, …): necesita pares clave-valor, y con un número impar Redis
rechaza el comando por cantidad incorrecta de argumentos. El docente lo leyó como `pelicula:1`. Tres
formas correctas de un solo comando:

```
MSET pelicula:1 "Bob Esponja" pelicula:2 "Cars" pelicula:3 "Los Increibles"
SADD peliculas "Bob Esponja" "Cars" "Los Increibles"
RPUSH peliculas "Bob Esponja" "Cars" "Los Increibles"
```

`MSET` crea tres claves string; `SADD`, un set sin orden ni duplicados (lo más natural para un
catálogo de títulos); `RPUSH`, una lista que conserva el orden. Comparación en
[[Parcial XC-202X|Parcial XC-202X]] § *Pregunta 5*, que pide lo mismo.

**Para el parcial.** `MSET clave valor [clave valor …]` va siempre en pares; revise la cantidad de
argumentos.

## Pregunta 30 — ¿el failover de Sentinel lo inicia el administrador? (V/F, 2 puntos)

**Enunciado.**

> Cuando el nodo master queda aislado, el administrador de **Redis** Sentinel tiene que intervenir
> para iniciar el proceso de failover (una réplica se promueve a master).

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 0/2 ✗, rótulo `Incorrecto:`. Clave: **Falso**.

**Resolución del vault.** **Falso** *(no verificado en el motor)*. El failover de Sentinel es
**automático**: los Sentinels detectan la caída del master (el *quorum* configurado solo sirve para
detectarla), uno de ellos se elige líder con el voto de la **mayoría** de los procesos Sentinel,
promueve una réplica, reconfigura las demás y avisa a los clientes la nueva dirección. Documentación
oficial (<https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/>): *"Automatic
failover. If a master is not working as expected, Sentinel can start a failover process where a
replica is promoted to master…"*. El libro solo lo deja como tarea (*Seven Databases* 2ª ed. cap. 8,
*Day 2 Homework*, impresa 289).

**Qué estuvo mal:** confundir *notification* (Sentinel **avisa** al administrador) con *failover*
(Sentinel **actúa** solo). Las mismas tres afirmaciones de las preguntas 30–32 están en
[[Final 1Jul2025]] § *Pregunta 6* y [[Final 1Dic2023]] § *Pregunta 5*.

**Para el parcial.** Sentinel hace cuatro cosas: monitorea, notifica, hace failover automático y
provee la configuración.

## Pregunta 31 — Sentinel monitorea master y réplicas (V/F, 2 puntos)

**Enunciado.**

> **Redis** Sentinel permite monitorear regularmente el estado del nodo master y de las réplicas.

**Lo que respondió el alumno.** Verdadero.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Verdadero**.

**Resolución del vault.** ✓ **Verdadero** *(no verificado en el motor)*. Es la primera función de la lista
oficial: *"Monitoring. Sentinel constantly checks if your master and replica instances are working as
expected."*

**Para el parcial.** Monitoreo es la base de las otras tres funciones.

## Pregunta 32 — Sentinel como proveedor de configuración (V/F, 2 puntos)

**Enunciado.**

> **Redis** Sentinel puede funcionar como proveedor de configuración, brindándole a los clientes la
> dirección del nodo master.

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 0/2 ✗, rótulo `Incorrecto:`. Clave: **Verdadero**.

**Resolución del vault.** **Verdadero** *(no verificado en el motor)*. Es la cuarta función oficial:
*"Configuration provider. Sentinel acts as a source of authority for clients service discovery:
clients connect to Sentinels in order to ask for the address of the current Redis master responsible
for a given service. If a failover occurs, Sentinels will report the new address."*

**Qué estuvo mal:** es justamente lo que permite que el failover sea transparente: el cliente no
guarda la dirección del master, se la pregunta a Sentinel.

**Para el parcial.** Las cuatro funciones de Sentinel entran enteras en un V/F; conviene saberlas de
memoria.

## Pregunta 33 — qué guarda `out` después de `ZUNIONSTORE … WEIGHTS 2 3` (ensayo, 7,5 puntos)

**Enunciado.**

> Explique qué almacena la estructura **out** de **Redis** al final de la ejecución de la siguiente
> rutina de comandos:
>
> ```
> redis> ZADD zset1 1 "one"
> (integer) 1
> redis> ZADD zset1 2 "two"
> (integer) 1
> redis> ZADD zset2 1 "one"
> (integer) 1
> redis> ZADD zset2 2 "two"
> (integer) 1
> redis> ZADD zset2 3 "three"
> (integer) 1
> redis> ZUNIONSTORE out 2 zset1 zset2 WEIGHTS 2 3
> (integer) 3
> redis> ZRANGE out 0 -1 WITHSCORES
> ```

**Lo que respondió el alumno.** Nada (recuadro en blanco).

**Corrección de la plataforma.** 0/7,5 ✗. Es la pregunta de mayor puntaje del examen.

**Resolución del vault.** *(No verificado en el motor; el enunciado es el ejemplo de la documentación
oficial de `ZUNIONSTORE`, que publica la misma salida.)* `ZUNIONSTORE destino numkeys clave …
WEIGHTS …` calcula la **unión** de los sorted sets, **multiplica** cada score por el peso de su
conjunto y, por defecto, **suma** los scores de un miembro presente en varios conjuntos (`AGGREGATE
SUM`); guarda el resultado en `destino` y lo sobrescribe si existía (*Seven Databases* 2ª ed. cap. 8,
§ *Sorted Sets*, *Unions*, impresa 270; <https://redis.io/docs/latest/commands/zunionstore/>). Aquí
`numkeys = 2`, el peso de `zset1` es 2 y el de `zset2`, 3:

| Miembro | en `zset1` (× 2) | en `zset2` (× 3) | score en `out` |
| --- | --- | --- | --- |
| `one` | 1 × 2 = 2 | 1 × 3 = 3 | **5** |
| `two` | 2 × 2 = 4 | 2 × 3 = 6 | **10** |
| `three` | — | 3 × 3 = 9 | **9** |

El `(integer) 3` es la cantidad de elementos de `out`. `ZRANGE … WITHSCORES` devuelve por score
ascendente (impresas 268–269):

```
1) "one"
2) "5"
3) "three"
4) "9"
5) "two"
6) "10"
```

Redacción para el puntaje completo:

> `out` es un sorted set con la unión de `zset1` y `zset2`: sus miembros son `one`, `two` y `three`
> (por eso `ZUNIONSTORE` devuelve 3). Cada score se multiplica por el peso de su conjunto (×2 para
> `zset1`, ×3 para `zset2`) y, como no se indica `AGGREGATE`, los de un mismo miembro se suman:
> `one` = 1·2 + 1·3 = 5, `two` = 2·2 + 2·3 = 10, `three` = 3·3 = 9. `ZRANGE out 0 -1 WITHSCORES`
> los lista de menor a mayor score: `one` 5, `three` 9, `two` 10.

**Qué estuvo mal:** dejarla en blanco. Aun sin recordar `WEIGHTS`, la unión y la suma de scores daban
puntaje parcial.

**Para el parcial.** `WEIGHTS` multiplica, `AGGREGATE` combina (`SUM` por defecto, `MIN`, `MAX`), el
entero devuelto es la cantidad de miembros y `ZRANGE` ordena de menor a mayor.

## Pregunta 34 — terminología tabular vs. RDBMS (coincidencia, 2,5 puntos)

**Enunciado.**

> Acomodar las correspondencias de acuerdo a la terminología Tabular vs RDBMS

Dos columnas en la plataforma: *Mensajes* (1. Keyspace · 2. Column Family · 3. Fila · 4. Columna ·
5. Cluster) y *Respuestas*.

**Lo que respondió el alumno.**

| Mensajes | Respuesta del alumno | Rótulo |
| --- | --- | --- |
| 1. Keyspace | Base de datos | `Correcta:` ✓ |
| 2. Column Family | Tabla | `Correcta:` ✓ |
| 3. Fila | Fila | `Correcta:` ✓ |
| 4. Columna | Columna | `Correcta:` ✓ |
| 5. Cluster | Instancia | `Correcta:` ✓ |

**Corrección de la plataforma.** 2,5/2,5 ✓ (los cinco pares con `Correcta:`; la plataforma no
muestra una clave aparte).

**Resolución del vault.** ✓ Correcta. Es la tabla del slide 4 de la
[[Clase 15 - Introduccion a Cassandra|Clase 15]] (Instancia ↔ Cluster, Base de Dato ↔ KeySpace, Tabla ↔
Familia de Columnas, Fila ↔ Fila, Columna ↔ *"Columna (distinto por cada fila)"*); el slide 51 agrega
que el clúster son *"las máquinas (nodos) de una instancia de Cassandra"*. Es la Pregunta 7 del
[[Parcial 2Q2025|Parcial 2Q2025]].
[[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Bases de datos tabulares]].

**Para el parcial.** Cluster = instancia, keyspace = base de datos, familia de columnas = tabla; la
columna puede variar de fila en fila.

## Pregunta 35 — ¿la SSTable está en memoria? (V/F, 2 puntos)

**Enunciado.**

> En **Cassandra** *SSTable* es una estructura de datos residente en la memoria

**Lo que respondió el alumno.** Falso.

**Corrección de la plataforma.** 2/2 ✓. Clave: **Falso**.

**Resolución del vault.** ✓ **Falso.** La trampa invierte los papeles del slide 30 de la
[[Clase 15 - Introduccion a Cassandra|Clase 15]]: la estructura *"residente en la memoria"* es la
**MemTable**; la SSTable es *"un archivo de disco en donde se guarda el contenido de la MemTable
cuando alcanza un valor determinado"*, inmutable una vez creado. Corrida en Cassandra 5.0.9
(keyspace `recupage`): dos filas insertadas quedan en la MemTable y un `nodetool flush` las pasa a
una SSTable en disco:

```
-- antes del flush                  -- después de nodetool flush recupage sst
SSTable count: 0                    SSTable count: 1
Space used (live): 0                Space used (live): 5078
Memtable cell count: 2              Memtable cell count: 0
Memtable data size: 100             Memtable data size: 0
                                    /var/lib/cassandra/data/recupage/sst-…/nb-1-big-Data.db
                                    (más Index, Filter, Summary, Statistics, …)
```

El `Filter.db` es el filtro de Bloom de esa SSTable.
[[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]]. Es la Pregunta 14 del [[Parcial 2Q2025|Parcial 2Q2025]].

**Para el parcial.** Commit log (disco, durabilidad) → MemTable (memoria) → SSTable (disco,
inmutable).

## Pregunta 36 — niveles de consistencia de escritura válidos en Cassandra (OM varias, 3 puntos)

**Enunciado.** Con el recuadro de crédito parcial y negativo.

> Elija los niveles de consistencia de escritura válidos en **Cassandra**.
>
> A. All · B. Quorum · C. Each Quorum · D. (One, Two, Three) · E. Local Quorum · F. None · G. Global
> Quorum · H. Any

**Lo que respondió el alumno.** B, C, E y G.

**Corrección de la plataforma.** 0,89/3, parcial. Clave: **A, B, C, D, E y H** (16,66 % cada una; D,
16,7 %); F y G, −20 % cada una. Cuenta: 3 × 16,66 − 20 = 29,98 % de 3 = 0,899 → 0,89.

**Resolución del vault.** **A, B, C, D, E y H.** Es la tabla *"Consistencia en escritura (Write)"* del
slide 46 de la [[Clase 15 - Introduccion a Cassandra|Clase 15]]: `ANY`, `ONE`/`TWO`/`THREE`,
`QUORUM`, `LOCAL_QUORUM`, `EACH_QUORUM` y `ALL`. `NONE` y `GLOBAL_QUORUM` no existen. Corrida en
`cqlsh` contra Cassandra 5.0.9 (keyspace `recupage`, `SimpleStrategy`, RF 1):

```
Consistency level set to ANY.            -- INSERT ✓
Consistency level set to ONE.            -- INSERT ✓
Consistency level set to TWO.
Consistency level set to THREE.
Consistency level set to QUORUM.         -- INSERT ✓
Consistency level set to LOCAL_QUORUM.   -- INSERT ✓
Consistency level set to EACH_QUORUM.    -- INSERT ✓
Consistency level set to ALL.            -- INSERT ✓
<stdin>:22:Improper CONSISTENCY command.   -- CONSISTENCY GLOBAL_QUORUM
<stdin>:23:Improper CONSISTENCY command.   -- CONSISTENCY NONE
-- SELECT con CONSISTENCY ANY:
InvalidRequest: ... message="ANY ConsistencyLevel is only supported for writes"
-- INSERT con CONSISTENCY TWO y una sola réplica:
Unavailable exception ... "Cannot achieve consistency level TWO" ... 'required_replicas': 2, 'alive_replicas': 1
```

Dos matices que la corrida muestra: `ANY` vale **solo para escritura** (por eso la pregunta dice
*"de escritura"*), y `TWO` es un nivel válido aunque con RF 1 no se pueda alcanzar. `LOCAL_ONE`
también existe, pero no estaba entre las opciones.

**Qué estuvo mal:** marcar `Global Quorum`, que no existe (−20 %), y omitir `All`, `(One, Two,
Three)` y `Any`. Faltaron tres de las seis opciones correctas.

**Para el parcial.** Escritura: `ANY`, `ONE`/`TWO`/`THREE`, `QUORUM`, `LOCAL_QUORUM`,
`EACH_QUORUM`, `ALL` (y `LOCAL_ONE`). `QUORUM = RF/2 + 1`, con división entera.
[[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]].

## Relación con otras instancias

| Pregunta del recuperatorio | Reaparece en | Qué cambia |
| --- | --- | --- |
| 3 — leer una `ASSERTION` | [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 4A · [[Parcial 1Q2026]] P12 | allí se pide escribir la aserción (`max_obras`); en el parcial, explicar un `CHECK` sobre `Vendedor` |
| 4 — `NOT IN` con `NULL` | [[Parcial 2Q-2023\|Parcial 2Q-2023]] Ej. 10 | idéntica, con los mismos datos; allí dice PostgreSQL y cambia el orden de las opciones |
| 5 — `BITCOIN` por `MovUSDTValor` | [[Parcial 2Q2025\|Parcial 2Q2025]] P18 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 1b | idéntica a la P18; en el XC, con umbral 1100 y otros montos |
| 6 — `EURO` por `MovUSDTValorComi` | [[Parcial 2Q2025\|Parcial 2Q2025]] P1 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 1f | idéntica a la P1, cuya clave era la correcta (*No procede*); aquí la clave estaba invertida |
| 5 y 6 — la misma cadena de vistas | [[Parcial 1Q2026]] P4, P5 y P30 | otros incisos de la misma cadena (a, d y f) |
| 7 — índice para `UserID` | [[Final 1Jul2025]] P1 · [[Repaso Final BD 2\|Repaso Final BD 2]] Ej. 21 | allí a desarrollar; aquí opción múltiple con clave Hash |
| 8 — restricción de tabla | [[Parcial 2Q2025\|Parcial 2Q2025]] P24 | idéntica, con la opción *"Ninguna opción es correcta"* agregada y otro orden |
| 9 — shared lock | [[Parcial 1Q2026]] P13 · [[Final 1Dic2025]] P3 D | idéntica / un inciso de un V/F múltiple |
| 10 — dirty read | [[Final 1Dic2025]] P3 C | un inciso de un V/F múltiple |
| 11 — control de concurrencia | [[Parcial 1Q2026]] P11 · [[Final 1Dic2025]] P3 A | idéntica / un inciso de un V/F múltiple |
| 12 — `READ UNCOMMITTED` | [[Parcial 1Q2026]] P23 | allí, una anomalía (phantom) y el nivel que la evita |
| 13 — SQL → pipeline | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 10b · [[Práctica subida por la cátedra]] Ej. 7 · [[Parcial 1Q2026]] P28 | allí `GROUP BY … ORDER BY COUNT(*)`; aquí un `JOIN` con `$lookup`, primera vez en un examen del vault |
| 14 — MapReduce vs. pipeline | [[Parcial 2Q2025\|Parcial 2Q2025]] P6 | allí escribir un `mapReduce`; aquí saber que está deprecado |
| 15 — `map` emite pares | [[Parcial 1Q2026]] P17 | idéntica |
| 16 — MapReduce en paralelo | [[Parcial 1Q2026]] P8 | idéntica |
| 17 — MongoDB AP | [[Parcial 2Q2025\|Parcial 2Q2025]] P10 | idéntica |
| 19 — dirección de relaciones | [[Parcial 1Q2026]] P18 | la otra cara: *"bidireccionales por defecto y sin propiedades"* (Falso) |
| 20 — Neo4j HA | [[Parcial 2Q2025\|Parcial 2Q2025]] P4 | idéntica |
| 21 — Cypher a lenguaje natural | [[Parcial 2Q2025\|Parcial 2Q2025]] P22 | idéntica; allí la respuesta del solucionario sacó 2/3 |
| 22 — unicidad en Cypher | [[Parcial 2Q2025\|Parcial 2Q2025]] P20 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 3 | idéntica; allí con la sintaxis `FOR … REQUIRE` |
| 24 — amigos de amigos | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 4 · [[Práctica subida por la cátedra]] Ej. 8 | allí leer una consulta de amigos a 2 o 3 saltos; aquí escribirla |
| 25 — tabla de posiciones | [[Parcial 23-5-23 - Bases de Datos Avanzadas\|Parcial 23-5-23]] P10 · [[Final 1Jul2025]] P4 | 100.000 transacciones/s → Redis (igual); 10⁹ escrituras/s sin ranking → Cassandra |
| 26 — motores CA | [[Parcial 2Q2025\|Parcial 2Q2025]] P13 | idéntica |
| 28 — `appendfsync` | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 6 | allí RDB vs. AOF a desarrollar |
| 29 — tres títulos, un comando | [[Parcial XC-202X\|Parcial XC-202X]] Ej. 5 | idéntica, sin la clasificación CAP que agrega el XC |
| 30–32 — Sentinel | [[Final 1Jul2025]] P6 · [[Final 1Dic2023]] P5 | las mismas tres afirmaciones, justificadas |
| 34 — terminología tabular | [[Parcial 2Q2025\|Parcial 2Q2025]] P7 | idéntica |
| 35 — SSTable | [[Parcial 2Q2025\|Parcial 2Q2025]] P14 · [[Parcial 1Q2026]] P26 | idéntica / componentes de un nodo |
| 36 — consistencia de escritura | [[Parcial 1Q2026]] P14 · [[Parcial 2Q2025\|Parcial 2Q2025]] P26 · [[Parcial XC-202X\|Parcial XC-202X]] Ej. 8b | QUORUM con RF 5 a desarrollar (8 puntos) / la fórmula del QUORUM / un V/F sobre consistencia por consulta |

Sin antecedente en el vault: las preguntas 1–2 (esquema de planes, formato *"evalúe la afirmación"*),
18 (Cypher de vinos), 23 (`DETACH DELETE`), 27 (seguridad de Redis) y 33 (`ZUNIONSTORE`).

## Dudas abiertas

- (abierto) **Qué entra en el recuperatorio del 03/11/2026.** Este recuperatorio del 1C incluye
  Neo4j y Redis. En el 2C, según [[_cronograma]], Neo4j (19/10) y Redis (26/10) se dictan
  **después** del parcial del 13/10 y **antes** del recuperatorio: es plausible que el recuperatorio
  del 2C los incluya como este, pero no hay fuente que lo confirme.
- (abierto) **Pregunta 29:** si el alumno escribió `pelicula 1` con espacio, el comando es inválido y
  el docente lo corrigió como si dijera `pelicula:1`. El video no permite descartar un `:` muy tenue.
- (abierto) **Pregunta 18:** el enunciado no da el modelo del grafo; la resolución toma el del libro
  (`likes`, `reported_on`, `rating` en la relación, `style`). Si la cátedra usa otro, cambian los
  nombres, no la estructura.
- (abierto) **Condición de aprobación:** el encabezado habla del *"60% de las preguntas"* y la tabla,
  de puntaje. Con puntajes distintos por pregunta no son lo mismo; la nota de esta página sale de la
  tabla (60 puntos = 4).
- (ok) **Pregunta 6:** la clave de la plataforma está mal y el docente la corrigió; confirmado con el
  estándar, con MySQL (error 1369) y con la Pregunta 1 del [[Parcial 2Q2025|Parcial 2Q2025]].

## Enlaces

[[Mapa de exámenes]] · [[Parcial 1Q2026]] · [[Parcial 2Q2025|Parcial 2Q2025]] ·
[[Parcial XC-202X|Parcial XC-202X]] · [[Parcial 2Q-2023|Parcial 2Q-2023]] · [[Final 1Jul2025]] ·
[[Final 1Dic2023]] · [[Final 1Dic2025]] · [[_cronograma]] ·
[[1.03.01 - Derivación de MER a esquema relacional|Derivación a esquema relacional]] ·
[[1.05.01 - SQL — consultas|SQL — consultas]] · [[1.06.01 - Vistas|Vistas]] ·
[[1.08.02 - Índices|Índices]] · [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] ·
[[1.09.04 - Triggers|Triggers]] ·
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] ·
[[2.12.03 - Persistencia políglota|Persistencia políglota]] · [[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] · [[2.14.03 - MapReduce|MapReduce]] ·
[[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Bases de datos tabulares]] ·
[[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]] ·
[[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]] ·
[[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]] ·
[[MySQL]] · [[MongoDB]] · [[Cassandra]] · [[Clase 11 - Seguridad-Transacciones]] ·
[[Clase 15 - Introduccion a Cassandra]] · [[Práctica 2026-09-29]]
