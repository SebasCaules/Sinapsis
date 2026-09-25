---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - Consultas SQL (JOIN, LEFT JOIN, COALESCE, GROUP BY/HAVING, subconsultas)
  - NULL en NOT IN vs. NOT EXISTS
  - CHECK, ASSERTION y su alternativa con triggers
  - Vistas actualizables y WITH CHECK OPTION
  - Privilegios (GRANT/REVOKE, WITH GRANT OPTION, CASCADE)
  - EXPLAIN ANALYZE
  - Integridad referencial y acciones referenciales (MATCH simple)
cuatrimestre: 2023-2C
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Parciales Viejos.pdf"
estado: procesado
resumen: "Parcial del 2Q-2023 (10 ejercicios, todo SQL relacional): consultas con COALESCE y GROUP BY, ASSERTION, vista ConstructorVIP, WITH CHECK OPTION, GRANT/REVOKE, EXPLAIN ANALYZE, acciones referenciales y NULL en NOT IN. Resolución manuscrita de un estudiante, corrida en MySQL 9.7.2."
aliases:
  - Parcial 2Q-2023
  - 2Q-2023
  - Parcial segundo cuatrimestre 2023
---

# Parcial 2Q-2023 — diez ejercicios de SQL relacional, varios reciclados en 2025

## Resumen general

Parcial del segundo cuatrimestre de 2023 de Base de Datos II, conservado como fotos del enunciado
impreso intercaladas con la resolución manuscrita de un estudiante (páginas 5 a 9 del cuaderno
`BDII - Parciales Viejos.pdf`, bajo el rótulo "2Q-2023"). Son **diez ejercicios**, todos de la primera
mitad de la materia: consultas con `JOIN`, `LEFT JOIN` + `COALESCE` y `GROUP BY`/`HAVING`,
subconsultas sobre la base de voluntarios, una `ASSERTION`, la vista `ConstructorVIP`,
`WITH CHECK OPTION`, una cadena de `GRANT`/`REVOKE … CASCADE`, `EXPLAIN ANALYZE`, acciones referenciales
y la trampa del `NULL` dentro de un `NOT IN`. No hay NoSQL.

La resolución disponible es de un estudiante y **no es oficial**. Resuelve ocho de los diez ejercicios;
salta el 3 y no entiende el 9. Donde responde, en general acierta, con cuatro salvedades que esta página
marca con (atención): un `COUNT(o.obra)` sobre una columna inexistente (Ej. 1A), la abreviatura
`c.ing_resp` por `ingeniero_resp` (Ej. 1B), el nombre `fecha_finalizacion` en lugar de `anio_finalizacion` (Ej. 4) y, la más importante, el Ej. 8.2, donde
afirma que el `UPDATE` procede en cascada cuando en realidad **falla por clave primaria duplicada**.
Todo el SQL reconstruible se corrió en MySQL 9.7.2.

Para el parcial del 13/10/2026, lo más útil es que **la cátedra recicla ejercicios**: `ConstructorVIP`,
la consulta con `COALESCE` sobre `OBRA_PRIVADA`/`OBRA_CIVIL`, las tres operaciones sobre
`Carrera`/`Materia`, el V/F de `EXPLAIN ANALYZE` y la cadena de `GRANT` reaparecen casi iguales en el
[[Parcial 2Q2025|Parcial 2Q2025]], con cambios menores (otra tabla, "en ejecución" en vez de "con
supervisor", `M4` en vez de `M5`). La otra lección es que el `NULL` en `NOT IN` aparece **dos veces** en
el mismo examen (Ej. 9 y Ej. 10).

> [!info] Fuente
> - **`BDII - Parciales Viejos.pdf`**, páginas 5 a 9 (manuscrito digital de 13 páginas, generado en iOS
>   el 20/10/2025). Un estudiante pegó **fotos del enunciado impreso** y escribió debajo su resolución.
>   El mismo cuaderno incluye otras dos instancias, [[Parcial XC-202X|Parcial XC-202X]] y
>   [[Práctica subida por la cátedra|Práctica subida por la cátedra]]. **Nada de esto es material oficial de la cátedra.**
> - Las fotos del enunciado traen además **marcas de otra mano**, probablemente de quien rindió el
>   examen impreso: la opción *a* encerrada en el Ej. 2 y en el Ej. 10, los huecos del Ej. 3 completados
>   y después tachados (*"Reescrito en otra hoja"*), casillas tapadas con blanco en los Ej. 7 y 9, y
>   tildes sueltas (Ej. 1B, 2 y 7). No se sabe si esas tildes son de la corrección.
> - Aporta: el **enunciado completo** de los diez ejercicios, con los dos DER (constructores/obras y
>   voluntarios), y la **resolución manuscrita**, que en esta página se cita como *nota manuscrita*.
>   No trae fecha, puntaje ni nota.

## Formato

- **Diez ejercicios** numerados, de varios tipos: consulta SQL a desarrollar (Ej. 1A, 1B, 4A, 4B),
  opción múltiple simple (Ej. 2 y 10), completar huecos de una consulta eligiendo de una lista (Ej. 3,
  pero la lista no aparece en la foto), ensayo con ejemplo (Ej. 5), estado final de privilegios con
  justificación (Ej. 6), verdadero/falso de tres incisos (Ej. 7), resultado de tres operaciones sobre
  una instancia (Ej. 8) y selección de una o más opciones con justificación de las descartadas (Ej. 9).
- Es un **examen impreso** (el pie de la foto del Ej. 4 dice "2", es decir, página 2). **Puntaje,
  condición de aprobación, duración y fecha:** la fuente no los trae. Por eso el frontmatter no lleva
  `fecha`. El cuatrimestre sale del rótulo "2Q-2023".
- Indicios de motor: el Ej. 10 dice *"se crean las siguientes tablas en PostgreSQL"* y el Ej. 2 consulta
  `unc_esq_peliculas.empleado`, la notación esquema.tabla de PostgreSQL. La cursada 2026 usa
  [[MySQL|MySQL]], y cada corrida de abajo señala lo que cambia en ese motor.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1A | `JOIN` + `GROUP BY`/`HAVING` + `ORDER BY` (constructores con ≥ 3 obras en ejecución) | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 1\|Clase 05]] · [[Práctica 2026-08-11\|TP3 SQLs avanzados]] |
| 1B | `LEFT JOIN` + `COALESCE` sobre la jerarquía `OBRA_PRIVADA`/`OBRA_CIVIL` | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05]] |
| 2 | Interpretar `GROUP BY` de dos columnas con `HAVING SUM(…)` | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 1\|Clase 05]] · [[Práctica 2026-08-04\|TP3 SQLs simples]] |
| 3 | Subconsultas `IN` anidadas, edad a partir de la fecha, "los 3 más jóvenes" | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05]] |
| 4A | Restricción global declarativa (`ASSERTION`) y su reemplazo por triggers | [[1.09.03 - CHECK, DOMAIN y ASSERTION\|CHECK, DOMAIN y ASSERTION]] · [[1.09.04 - Triggers\|Triggers]] | [[Clase 09 - Restricciones integridad-Parte 1\|Clase 09]] · [[Clase 10 - Restricciones integridad-Parte 2\|Clase 10]] · [[Práctica 2026-09-01\|TP7]] |
| 4B | Vista con agregación: ¿es actualizable? | [[1.06.01 - Vistas\|Vistas]] | [[Clase 06 - Vistas-Parte 1\|Clase 06]] · [[Clase 07 - Vistas-Parte 2\|Clase 07]] · [[Práctica 2026-08-11\|TP4]] |
| 5 | `WITH CHECK OPTION` vs. sin él | [[1.06.01 - Vistas\|Vistas]] | [[Clase 06 - Vistas-Parte 1\|Clase 06]] · [[Práctica 2026-08-11\|TP4]] |
| 6 | Cadena de `GRANT`/`REVOKE … CASCADE` con U0–U3 | [[1.11.02 - Usuarios, privilegios y roles\|Usuarios, privilegios y roles]] | [[Clase 11 - Seguridad-Transacciones\|Clase 11]] · [[Práctica 2026-09-08\|TP8]] |
| 7 | `EXPLAIN ANALYZE`: ¿planifica, ejecuta, qué tiempos muestra? | [[1.08.01 - Plan de ejecución\|Plan de ejecución]] | [[Clase 08 - Explicando el plan\|Clase 08]] · [[Práctica 2026-08-18\|TP5]] |
| 8 | Acciones referenciales `restrict`/`cascade`, FK compuesta con `NULL` | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | [[Clase 09 - Restricciones integridad-Parte 1\|Clase 09]] · [[Práctica 2026-08-25\|TP6]] |
| 9 | Anti-join: `NOT IN` vs. `NOT EXISTS` vs. `<> NULL` | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05]] |
| 10 | `NOT IN` con un `NULL` en la subconsulta | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05]] |

## Datasets y corridas

Todo se corrió en **MySQL 9.7.2** sobre una base propia (`parcial2q2023`) con datos de juguete, salvo
el Ej. 2, que usa el `esq_peliculas.sql` de la práctica (base `parcial2q2023pel`). Los esquemas salen
de los DER de las fotos; los datos son inventados y se rotulan así.

**DER de los Ejercicios 1 y 4** (transcripto de la foto):

| Tabla | Columnas |
| --- | --- |
| `CONSTRUCTOR` | `tipo_doc char(3)` PK · `nro_doc int` PK · `nombre varchar(30)` · `apellido varchar(30)` · `antiguedad integer` |
| `EJECUTA` | `id_obra int` PK FK · `tipo_doc varchar(10)` PK FK · `nro_doc int` PK FK · `presupuesto decimal(12,2)` |
| `OBRA` | `id_obra int` PK · `superficie decimal(6,2)` · `direccion varchar(30)` · `anio_inicio int` · `anio_finalizacion int` N · `tipo_o char(1)` · `tipo_doc char(3)` N FK · `nro_doc int` N FK |
| `OBRA_PRIVADA` | `id_obra int` PK FK · `arquitecto varchar(40)` |
| `OBRA_CIVIL` | `id_obra int` PK FK · `ingeniero_resp varchar(40)` |

Nota del diagrama: *"Cada obra puede ser civil o privada, y puede tener un constructor que la
supervise, externo a los constructores que la ejecutan"*. El par `OBRA.(tipo_doc, nro_doc)` es ese
**supervisor**, y `EJECUTA` es quién la construye. El DER declara `EJECUTA.tipo_doc` como
`varchar(10)` contra el `char(3)` de `CONSTRUCTOR`, y MySQL 9.7.2 acepta esa FK sin error.

```sql
-- datos de juguete (propuesta propia)
INSERT INTO constructor VALUES
 ('DNI',1,'Ana','Alvarez',15), ('DNI',2,'Bruno','Benitez',12), ('DNI',3,'Carla','Castro',5), ('DNI',9,'Diego','Diaz',20);
INSERT INTO obra VALUES
 (1,100,'Calle 1',2024,NULL,'P','DNI',9), (2,200,'Calle 2',2024,NULL,'C',NULL,NULL),
 (3,300,'Calle 3',2023,NULL,'P','DNI',9), (4,400,'Calle 4',2020,2022,'C','DNI',9),
 (5,500,'Calle 5',2025,NULL,'C',NULL,NULL);
INSERT INTO obra_privada VALUES (1,'Arq Uno'),(3,'Arq Tres');
INSERT INTO obra_civil VALUES (2,'Ing Dos'),(4,'Ing Cuatro'),(5,'Ing Cinco');
INSERT INTO ejecuta VALUES
 (1,'DNI',1,400000),(2,'DNI',1,500000),(3,'DNI',1,300000),(4,'DNI',1,900000),
 (1,'DNI',2,200000),(2,'DNI',2,100000),(4,'DNI',2,5000000),
 (1,'DNI',3,100000),(2,'DNI',3,100000),(3,'DNI',3,100000);
```

La prueba de los triggers del Ej. 4A agrega después dos obras más, la 6 y la 7 (civiles, en ejecución y
sin supervisor). La corrida está en esa sección. Sin ellas, los `INSERT`/`UPDATE` con `id_obra = 6`
fallan por la FK (`ERROR 1452`) antes de llegar al trigger.

> [!warning] (atención) En el contenedor, MySQL distingue mayúsculas en los nombres de tabla
> `@@lower_case_table_names = 0` (Linux): `Institucion` y `institucion` son tablas distintas, igual
> que `carrera` y `Carrera`. El enunciado mezcla las dos formas (Ej. 3 y Ej. 8) y en PostgreSQL da lo
> mismo, porque los identificadores sin comillas pasan a minúscula. En MySQL sobre Linux, en cambio,
> `FROM Institucion I` da `ERROR 1146 … doesn't exist` si la tabla se creó en minúscula. Por eso las
> tablas se crearon en minúscula, como las escribe el manuscrito.

**DER de voluntarios (Ejercicios 3 y 9)**. Es el esquema `unc_esq_voluntario` de los decks de la
[[Clase 05 - Consultas de Datos–Parte 2|Clase 05]] y de la
[[Clase 10 - Restricciones integridad-Parte 2|Clase 10]], la misma tabla `voluntario` de `voluntarioscadax`:
`voluntario(nombre, apellido, e_mail, telefono, fecha_nacimiento, id_tarea FK, nro_voluntario PK,
horas_aportadas, porcentaje, id_institucion N FK, id_coordinador N FK)` ·
`tarea(nombre_tarea, min_horas, id_tarea PK, max_horas)` · `institucion(nombre_institucion,
id_director N FK, id_direccion N FK, id_institucion PK)` · `direccion(calle, codigo_postal, ciudad,
provincia, id_pais FK, id_direccion PK)` · `pais(nombre_pais, id_continente FK, id_pais PK)` ·
`continente(nombre_continente, id_continente PK)` · `historico(fecha_inicio PK, nro_voluntario PK FK,
fecha_fin, id_tarea FK, id_institucion N FK)`. `institucion.id_director` referencia a
`voluntario.nro_voluntario`: **los directores son voluntarios**.

Datos de juguete del Ej. 3 y el Ej. 9 (propuesta propia): seis voluntarios (101–106) y seis
instituciones. NY (director 101), Chicago (102), SF (104) y Boston (105) están en Estados Unidos, y
CABA (103) en Argentina. Hay además una institución sin director. SF, Boston y la institución sin
director **no tienen voluntarios**, y los voluntarios 105 y 106 tienen `id_institucion = NULL`.

---

## Ejercicio 1 — consultas sobre constructores y obras

> **Ejercicio 1.** Considerando el siguiente esquema de BD *(el DER de arriba)*
>
> A. Provea una consulta SQL que permita obtener el identificador y apellido de los constructores con
> más de 10 años de antigüedad que tengan al menos 3 obras en ejecución. Ordénelos por apellido.
>
> B. Provea una consulta SQL que devuelva una lista con los datos de aquellas obras que cuentan con
> supervisor junto con una columna denominada "Resp_obra" donde figure el arquitecto o ingeniero
> responsable de la obra, según sea su tipo.

### Pregunta 1A — `JOIN` + `GROUP BY`/`HAVING`

**Respuesta de la fuente (nota manuscrita):**

```sql
SELECT c.tipo_doc, c.nro_doc, c.apellido
FROM constructor AS c
  JOIN ejecuta AS e ON c.tipo_doc = e.tipo_doc AND c.nro_doc = e.nro_doc
  JOIN obra AS o ON e.id_obra = o.id_obra
WHERE c.antiguedad > 10 AND o.anio_finalizacion IS NULL
GROUP BY c.tipo_doc, c.nro_doc, c.apellido
HAVING COUNT(o.obra) >= 3
ORDER BY apellido;
```

**Resolución del vault:** (atención) la estructura es correcta, pero `o.obra` no existe en `OBRA`.
Corrida tal cual:

```
ERROR 1054 (42S22) at line 2: Unknown column 'o.obra' in 'having clause'
```

Con `COUNT(*)` alcanza, porque la PK de `EJECUTA` es `(id_obra, tipo_doc, nro_doc)` y cada fila del
grupo es una obra distinta del constructor. `COUNT(o.id_obra)` da lo mismo.

```sql
HAVING COUNT(*) >= 3
ORDER BY c.apellido;
```

```
+----------+---------+----------+
| tipo_doc | nro_doc | apellido |
+----------+---------+----------+
| DNI      |       1 | Alvarez  |
+----------+---------+----------+
```

Ana tiene 15 años de antigüedad y tres obras sin `anio_finalizacion` (la 4 está terminada). Bruno
queda afuera porque tiene 2 obras en ejecución, y Carla porque tiene 5 años de antigüedad. "En ejecución" se
lee como `anio_finalizacion IS NULL`, la única columna del DER que lo expresa. El filtro va en el `WHERE`
(por fila) y el conteo en el `HAVING` (por grupo): [[1.05.01 - SQL — consultas|SQL — consultas]] §
*`WHERE` vs. `HAVING`*.

### Pregunta 1B — `LEFT JOIN` + `COALESCE` sobre la jerarquía

**Respuesta de la fuente (nota manuscrita):**

```sql
SELECT o.*, COALESCE(p.arquitecto, c.ing_resp) AS "Resp_Obra"
FROM obra AS o
  LEFT JOIN obra_privada AS p ON p.id_obra = o.id_obra
  LEFT JOIN obra_civil AS c ON c.id_obra = o.id_obra
WHERE o.tipo_doc IS NOT NULL AND o.nro_doc IS NOT NULL;
```

**Resolución del vault:** correcta en la lógica, con una (atención) de nombre de columna: el
manuscrito abrevia `c.ing_resp`, pero en el DER la columna es `ingeniero_resp`. Tal cual, da
`ERROR 1054 (42S22) at line 1: Unknown column 'c.ing_resp' in 'field list'`. Corrida con
`c.ingeniero_resp`:

```
+---------+------------+-----------+-------------+-------------------+--------+----------+---------+------------+
| id_obra | superficie | direccion | anio_inicio | anio_finalizacion | tipo_o | tipo_doc | nro_doc | Resp_Obra  |
+---------+------------+-----------+-------------+-------------------+--------+----------+---------+------------+
|       1 |     100.00 | Calle 1   |        2024 |              NULL | P      | DNI      |       9 | Arq Uno    |
|       3 |     300.00 | Calle 3   |        2023 |              NULL | P      | DNI      |       9 | Arq Tres   |
|       4 |     400.00 | Calle 4   |        2020 |              2022 | C      | DNI      |       9 | Ing Cuatro |
+---------+------------+-----------+-------------+-------------------+--------+----------+---------+------------+
```

La lectura de "cuentan con supervisor" como `OBRA.(tipo_doc, nro_doc) IS NOT NULL` es la que sostiene
la nota del DER. Como la jerarquía es exclusiva, una obra tiene fila en una sola de las dos tablas
hijas, y `COALESCE` toma el único valor no nulo. Dos detalles menores: el enunciado pide la columna
`Resp_obra`, no `Resp_Obra`, y el alias entre comillas dobles funciona en MySQL como literal de alias.
**Es el mismo ejercicio que la Pregunta 16 del [[Parcial 2Q2025|Parcial 2Q2025]]**, donde el filtro cambia
a "obras en ejecución" (`anio_finalizacion IS NULL`). Una alternativa equivalente usa `CASE` sobre `tipo_o`.

---

## Pregunta 2 — `GROUP BY` de dos columnas con `HAVING` (opción múltiple)

> **Ejercicio 2.** ¿Cuál es el resultado de la siguiente consulta realizada sobre el esquema de
> Películas (unc_esq_peliculas)?
>
> ```sql
> SELECT id_jefe, id_tarea, SUM(sueldo) AS "Suma"
> FROM unc_esq_peliculas.empleado
> GROUP BY id_jefe, id_tarea HAVING SUM(sueldo) > 10000;
> ```
>
> Seleccione una:
> a. Lista la suma de sueldos de los empleados por cada jefe en cada tarea si dicha suma supera los 10000.
> b. Lista la suma de sueldos de los jefes por tarea que sean mayores a 10000 por cada empleado.
> c. Ninguna de las otras propuestas.
> d. Lista la suma de sueldos para los jefes por tarea que tengan más de 10000 empleados.
> e. Da error porque está mal expresada.

**Respuesta de la fuente (nota manuscrita y marcas en la foto del examen):** **a**. Debajo de la foto,
el manuscrito responde *"a."*. En la foto, la opción *a* está encerrada en un círculo y con una tilde,
las opciones *b*, *c* y *e* están tachadas con una cruz y la *d* tiene una marca parcial.

**Resolución del vault:** **a**, correcta. Cada grupo es un par (jefe, tarea), `SUM(sueldo)` suma los
sueldos **de los empleados** de ese grupo y `HAVING` descarta los grupos cuya suma no supera 10000. La
opción *d* confunde `SUM` con `COUNT`, y la *e* no aplica porque las dos columnas no agregadas están en el
`GROUP BY`. Corrida real sobre `esq_peliculas.sql` (7 empleados, todos con `id_jefe = 2`):

```
-- los cuatro grupos, sin HAVING
+---------+----------+----------+---+
| id_jefe | id_tarea | Suma     | n |
+---------+----------+----------+---+
|       2 | T001     | 26200.00 | 4 |
|       2 | T002     |  8000.00 | 1 |
|       2 | T004     |  6700.00 | 1 |
|       2 | T006     |  5000.00 | 1 |
+---------+----------+----------+---+
-- con HAVING SUM(sueldo) > 10000: queda solo (2, T001, 26200.00)
```

El grupo que pasa tiene **4 empleados**, no 10000, lo que descarta la *d* con datos reales. En MySQL,
`unc_esq_peliculas.empleado` significa "la base `unc_esq_peliculas`", no un esquema dentro de la
base: ver [[Clase 10 - Restricciones integridad-Parte 2|Clase 10]] § *Slide 12*.

---

## Pregunta 3 — completar huecos: los 3 directores más jóvenes de instituciones de EE.UU.

> **Ejercicio 3.** Considere la base de datos de Voluntarios. Se requiere listar el identificador,
> apellido, nombre de la tarea que realiza y edad de los 3 directores más jóvenes de aquellas
> instituciones asentadas en Estados Unidos. *(DER de voluntarios)*
>
> Tome como base el siguiente esquema de consulta SQL y complete adecuadamente los espacios en blanco,
> seleccionando de la lista correspondiente en cada caso:
>
> ```sql
> SELECT nro.voluntario, apellido, ________, ________
> FROM voluntario v JOIN ________
> WHERE ________ IN (SELECT ________ FROM Institucion I
>     WHERE ________ IN (SELECT ________
>     FROM dirección d JOIN ________ ________
>     WHERE p.nombre_pais='Estados Unidos'))
> ________;
> ```

Las listas de opciones **no aparecen en la foto**. El `nro.voluntario` con punto está así en el impreso,
aunque la columna es `nro_voluntario`.

**Respuesta de la fuente:** el manuscrito dice **"Skip"**. En la foto, quien rindió completó los huecos a
mano y después los tachó con la nota *"Reescrito en otra hoja"*: `t.nombre_tarea`,
`datediff('Year', …, v.fecha_n…)` (parcialmente tachado), `tarea as t on t.id_tarea = v.id_tarea`,
`nro_voluntario IN (SELECT id_director …`, `I.id_direccion IN (SELECT id_direccion …`,
`pais as p on d.id_pais = p.id_pais` y, al final, algo como `order by … limit 3`.

**Resolución del vault (propuesta propia, corrida en MySQL 9.7.2):** los tachones de la foto apuntan en
la dirección correcta. Completo:

```sql
SELECT nro_voluntario, apellido, t.nombre_tarea,
       TIMESTAMPDIFF(YEAR, v.fecha_nacimiento, CURDATE()) AS edad
FROM voluntario v JOIN tarea t ON t.id_tarea = v.id_tarea
WHERE nro_voluntario IN (SELECT id_director FROM institucion I
    WHERE I.id_direccion IN (SELECT id_direccion
    FROM direccion d JOIN pais p ON d.id_pais = p.id_pais
    WHERE p.nombre_pais='Estados Unidos'))
ORDER BY v.fecha_nacimiento DESC
LIMIT 3;
```

```
+----------------+----------+--------------+------+
| nro_voluntario | apellido | nombre_tarea | edad |
+----------------+----------+--------------+------+
|            102 | Brizuela | Logistica    |   26 |
|            104 | Duarte   | Coordinacion |   31 |
|            101 | Alvarez  | Coordinacion |   36 |
+----------------+----------+--------------+------+
```

(corrida con `CURDATE() = 2026-09-25`). De los cuatro directores de instituciones de EE.UU., queda
afuera Espinoza (105, nacida en 1970). Tres claves:

- **El director es un voluntario.** Por eso el primer hueco del `WHERE` es `nro_voluntario IN (SELECT
  id_director …)`.
- **"Los más jóvenes" son los de fecha de nacimiento más reciente.** Por eso se ordena por
  `fecha_nacimiento DESC` antes del `LIMIT 3`. Ordenar por la edad calculada da el mismo orden, pero con
  empates por año.
- (atención) **La edad depende del motor.** `datediff('Year', …)` sigue el estilo de `DATEDIFF` de T-SQL (SQL Server),
  aunque en T-SQL la unidad va sin comillas (`DATEDIFF(year, …)`). La Clase
  05 Parte 3 está escrita en T-SQL ([[1.05.01 - SQL — consultas|SQL — consultas]] § *Funciones de
  fecha*). En MySQL es `TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE())`. `DATEDIFF` de MySQL devuelve
  días y recibe solo dos argumentos. `LIMIT` sí es MySQL/PostgreSQL; T-SQL usaría `TOP 3`.

---

## Ejercicio 4 — restricción global y vista `ConstructorVIP`

> **Ejercicio 4.** Sea el siguiente DER del Ejercicio 1:
>
> A. Se desea controlar que un mismo constructor no esté ejecutando más de 4 obras en simultáneo.
> Implemente en SQL la restricción anterior de manera declarativa. Indique qué tipo de restricción es.
>
> B. Definir la vista "ConstructorVIP" conteniendo el identificador del constructor y la suma total de
> los presupuestos de todas sus obras en ejecución, sólo si superan el millón de dólares. ¿La vista es
> actualizable?

### Pregunta 4A — `ASSERTION max_obras`

**Respuesta de la fuente (nota manuscrita):** *"Lo hacemos con un ASSERTION."*

```sql
CREATE ASSERTION max_obras CHECK (NOT EXISTS (
    SELECT 1 FROM ejecuta AS e
        JOIN obra AS o ON o.id_obra = e.id_obra
    WHERE o.fecha_finalizacion IS NULL
    GROUP BY e.tipo_doc, e.nro_doc
    HAVING COUNT(*) > 4
));
```

*"Es una restricción de integridad global (a nivel BD)."*

**Resolución del vault:** la respuesta es correcta en lo conceptual, con una (atención) de nombre de
columna: en el DER la columna es `anio_finalizacion`, no `fecha_finalizacion`. La condición cruza
**dos tablas** (`EJECUTA` y `OBRA`), así que no alcanza con un `CHECK` de tabla y el nivel es el 4,
*generales (ASSERTIONS)*, de ámbito base de datos. El molde es el canónico del vault: escribir la
consulta que **encuentra las violaciones** y envolverla en `NOT EXISTS`
([[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] § *`CHECK` de tabla* y §
*`ASSERTION`*; GMUW cap. 7.4).

`CREATE ASSERTION` **no existe en MySQL** ni en ningún motor comercial. Corrida real:

```
ERROR 1064 (42000) at line 1: You have an error in your SQL syntax; check the manual that corresponds
to your MySQL server version for the right syntax to use near 'ASSERTION max_obras CHECK (NOT EXISTS (
  SELECT 1 FROM ejecuta AS e JOIN obra A' at line 1
```

**Alternativa en MySQL: triggers en las dos tablas** *(resolución del vault)*, como piden los slides 18
y 19 de la [[Clase 10 - Restricciones integridad-Parte 2|Clase 10]]. Hay que cubrir **cada evento que
puede violar la restricción**: dar de alta o cambiar una fila de `EJECUTA`, y **reabrir** una obra
terminada en `OBRA` (pasar `anio_finalizacion` de un valor a `NULL`). Un `DELETE` nunca la viola,
porque solo baja el conteo.

```sql
DELIMITER //
CREATE TRIGGER max_obras_ins BEFORE INSERT ON ejecuta
FOR EACH ROW
BEGIN
  IF (SELECT anio_finalizacion IS NULL FROM obra WHERE id_obra = NEW.id_obra)
     AND (SELECT COUNT(*) FROM ejecuta e JOIN obra o ON o.id_obra = e.id_obra
          WHERE o.anio_finalizacion IS NULL
            AND e.tipo_doc = NEW.tipo_doc AND e.nro_doc = NEW.nro_doc) >= 4 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'max_obras: el constructor ya ejecuta 4 obras en simultaneo';
  END IF;
END//
CREATE TRIGGER max_obras_upd BEFORE UPDATE ON ejecuta
FOR EACH ROW
BEGIN
  IF (SELECT anio_finalizacion IS NULL FROM obra WHERE id_obra = NEW.id_obra)
     AND (SELECT COUNT(*) FROM ejecuta e JOIN obra o ON o.id_obra = e.id_obra
          WHERE o.anio_finalizacion IS NULL
            AND e.tipo_doc = NEW.tipo_doc AND e.nro_doc = NEW.nro_doc
            AND NOT (e.id_obra = OLD.id_obra AND e.tipo_doc = OLD.tipo_doc AND e.nro_doc = OLD.nro_doc)) >= 4 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'max_obras: el constructor ya ejecuta 4 obras en simultaneo';
  END IF;
END//
CREATE TRIGGER max_obras_reabre BEFORE UPDATE ON obra
FOR EACH ROW
BEGIN
  IF OLD.anio_finalizacion IS NOT NULL AND NEW.anio_finalizacion IS NULL
     AND EXISTS (SELECT 1 FROM ejecuta e
                 WHERE e.id_obra = NEW.id_obra
                   AND (SELECT COUNT(*) FROM ejecuta e2 JOIN obra o2 ON o2.id_obra = e2.id_obra
                        WHERE o2.anio_finalizacion IS NULL
                          AND e2.tipo_doc = e.tipo_doc AND e2.nro_doc = e.nro_doc) >= 4) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'max_obras: reabrir la obra deja a un constructor con mas de 4';
  END IF;
END//
DELIMITER ;
```

Corrida real sobre los datos de juguete de § *Datasets y corridas*, más dos obras nuevas en
ejecución (la 6 y la 7). Ana pasa a tener 4 obras en ejecución, lo que está permitido, y cada intento de
llegar a 5 falla. Las cinco primeras líneas son un solo script (de ahí el `at line 5`), y cada una de
las tres sentencias siguientes se corrió aparte (`at line 1`):

```sql
INSERT INTO obra VALUES (6,600,'Calle 6',2026,NULL,'C',NULL,NULL),(7,700,'Calle 7',2026,NULL,'C',NULL,NULL);
INSERT INTO obra_civil VALUES (6,'Ing Seis'),(7,'Ing Siete');
INSERT INTO ejecuta VALUES (5,'DNI',1,100000);                    -- 4.a obra de Ana: procede
SELECT e.tipo_doc, e.nro_doc, COUNT(*) AS en_ejecucion FROM ejecuta e JOIN obra o ON o.id_obra = e.id_obra
  WHERE o.anio_finalizacion IS NULL GROUP BY e.tipo_doc, e.nro_doc;  -- Ana 4 · Bruno 2 · Carla 3
INSERT INTO ejecuta VALUES (6,'DNI',1,100000);                    -- 5.a
UPDATE obra SET anio_finalizacion = NULL WHERE id_obra = 4;        -- reabre una obra de Ana
UPDATE ejecuta SET id_obra = 6 WHERE id_obra = 4 AND nro_doc = 1;  -- cambia una terminada por una en curso
INSERT INTO ejecuta VALUES (6,'DNI',2,100000);                    -- Bruno (3.a obra): procede
```

```
ERROR 1644 (45000) at line 5: max_obras: el constructor ya ejecuta 4 obras en simultaneo
ERROR 1644 (45000) at line 1: max_obras: reabrir la obra deja a un constructor con mas de 4
ERROR 1644 (45000) at line 1: max_obras: el constructor ya ejecuta 4 obras en simultaneo
```

(atención) La traducción **no es equivalente**. Un trigger no valida los datos ya cargados, y cualquier
evento que no tenga trigger deja una puerta abierta: [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK,
DOMAIN y ASSERTION]] § *En MySQL* y [[1.09.04 - Triggers|Triggers]]. La
[[Clase 09 - Restricciones integridad-Parte 1|Clase 09]] y la
[[Práctica 2026-09-01|Práctica 2026-09-01 (TP7)]] trabajan el mismo patrón. La
Pregunta 24 del [[Parcial 2Q2025|Parcial 2Q2025]] es la variante de nivel **tabla**: su respuesta es
*1. `CHECK` 2. `TRIGGER`*. Comparte con el 4A solo la mitad MySQL → `TRIGGER`. El 4A cruza dos tablas y
en el estándar va con `ASSERTION`, no con `CHECK`.

### Pregunta 4B — vista `ConstructorVIP`

**Respuesta de la fuente (nota manuscrita):**

```sql
CREATE VIEW ConstructorVIP AS
SELECT e.tipo_doc, e.nro_doc, SUM(e.presupuesto) AS suma
FROM ejecuta AS e
    JOIN obra AS o ON o.id_obro = e.id_obra
WHERE o.fecha_finalizacion IS NULL
GROUP BY e.tipo_doc, e.nro_doc
HAVING SUM(e.presupuesto) > 1.000.000;
```

*"Esta vista no es actualizable porque contiene funciones de agregación (no hay mapeo 1-a-1 a filas
base)."*

**Resolución del vault:** correcta, con tres erratas de transcripción a corregir para que corra:
`o.id_obro` → `o.id_obra`, `fecha_finalizacion` → `anio_finalizacion` y `1.000.000` → `1000000`.
Corrida con esas correcciones, después de los inserts del 4A:

```
+----------+---------+------------+
| tipo_doc | nro_doc | suma       |
+----------+---------+------------+
| DNI      |       1 | 1300000.00 |
+----------+---------+------------+
```

`information_schema.VIEWS.IS_UPDATABLE = NO`, y las tres operaciones fallan:

```
ERROR 1288 (HY000) at line 1: The target table ConstructorVIP of the UPDATE is not updatable
ERROR 1471 (HY000) at line 1: The target table ConstructorVIP of the INSERT is not insertable-into
ERROR 1288 (HY000) at line 1: The target table ConstructorVIP of the DELETE is not updatable
```

Bruno no aparece. Su obra de 5.000.000 está terminada y el `WHERE` la descarta antes de agrupar. La
justificación de la fuente es la del vault: con `GROUP BY` y funciones de agregación no se preserva la
clave, y cada fila de la vista resume varias filas base ([[1.06.01 - Vistas|Vistas]] § *La pregunta que
importa: ¿esta vista es actualizable?*; GMUW cap. 8.2.2). **Es la Pregunta 27 del [[Parcial 2Q2025|Parcial 2Q2025]]**,
donde se agrega `COUNT(*)` y el filtro a obras privadas.

---

## Pregunta 5 — `WITH CHECK OPTION` vs. sin él (ensayo)

> **Ejercicio 5.** Explique la diferencia de utilizar WITH CHECK OPTION y no usarla. Proponga un
> ejemplo donde se vea claramente esa diferencia.

**Respuesta de la fuente (nota manuscrita):** *"Al usar WCO en las actualizaciones de una vista, se
garantiza que estas procedan si se satisfacen las condiciones de consulta que la definen. Tomemos el
siguiente caso:"*

```sql
CREATE VIEW mayores AS
SELECT nombre, edad FROM personas
WHERE edad > 18;
```

*"Si ahora hago un insert sobre la vista de Fernando con 16 años, se va a insertar en la tabla
personas pero no se va a mostrar en la vista."*

**Resolución del vault:** la definición es correcta, pero el ejemplo muestra **solo la mitad sin WCO**.
Para que se vea "claramente la diferencia", falta la misma operación sobre la vista con WCO.
Corrida real, completando el ejemplo (`personas` con Lucía 30 y Martín 22):

```sql
INSERT INTO mayores VALUES ('Fernando', 16);   -- sin WCO: procede
```

```
+---------------+--------+------+        +----------------+----------+------+
| origen        | nombre | edad |        | origen         | nombre   | edad |
+---------------+--------+------+        +----------------+----------+------+
| vista mayores | Lucia  |   30 |        | tabla personas | Lucia    |   30 |
| vista mayores | Martin |   22 |        | tabla personas | Martin   |   22 |
+---------------+--------+------+        | tabla personas | Fernando |   16 |
                                         +----------------+----------+------+
```

```sql
CREATE VIEW mayores_wco AS
SELECT nombre, edad FROM personas WHERE edad > 18
WITH CHECK OPTION;
INSERT INTO mayores_wco VALUES ('Fernando', 16);
UPDATE mayores_wco SET edad = 17 WHERE nombre = 'Lucia';
```

```
ERROR 1369 (HY000) at line 1: CHECK OPTION failed 'parcial2q2023.mayores_wco'
ERROR 1369 (HY000) at line 1: CHECK OPTION failed 'parcial2q2023.mayores_wco'
```

El mismo `UPDATE` por `mayores` (sin WCO) procede, y Lucía **migra fuera** de la vista: después
`SELECT * FROM mayores` devuelve solo a Martín. Ese es el problema que el deck 06 llama **migración de
tuplas**. El WCO rechaza el `INSERT` o el `UPDATE` cuya fila resultante no satisface el `WHERE` de la
vista ([[1.06.01 - Vistas|Vistas]] § *`WITH CHECK OPTION`*). Una respuesta completa suma la variante
`CASCADED` (default) vs. `LOCAL`, que es lo que el [[Parcial 2Q2025|Parcial 2Q2025]] pregunta en sus
Preguntas 1 y 18.

---

## Pregunta 6 — cadena de `GRANT`/`REVOKE … CASCADE`

> **Ejercicio 6.** Dada la siguiente secuencia de cesión, revocación de privilegios y operaciones, decir
> cuáles son los privilegios y sobre qué objetos los conservan U1, U2 y U3 al final. Indique en cada
> caso el por qué.
>
> Nota: U0 es admin, ES: *EmpleadoSub-20*, ESJ: *EmpleadoSub-20Jefe*, ES y ESJ son vistas.
>
> ```sql
> U0: GRANT SELECT ON ES, ESJ TO U1;
> U0: GRANT INSERT, UPDATE ON EMPLEADO TO U1 WITH GRANT OPTION;
> U0: UPDATE ES SET Cargo="Jefe" WHERE Nombre="Jorge López";
> U0: GRANT SELECT ON EMPLEADO TO U1, U3 WITH GRANT OPTION;
> U1: GRANT SELECT ON EMPLEADO TO U2 WITH GRANT OPTION;
> U2: GRANT SELECT ON EMPLEADO TO U3;
> U0: GRANT SELECT ON ESJ TO U3;
> U1: REVOKE SELECT ON EMPLEADO FROM U2 CASCADE;
> ```

**Respuesta de la fuente (nota manuscrita)**, paso a paso, con quién otorgó cada privilegio (WGO = with
grant option):

| Paso | Estado que anota |
| --- | --- |
| 1 | U1 → ES (SELECT) de U0 · ESJ (SELECT) de U0 |
| 2 | U1 → + EMPLEADO (INSERT-WGO, UPDATE-WGO) de U0 |
| 3 | *"ídem → ejecuta U0 que es admin"* |
| 4 | U1 → + EMPLEADO (SELECT-WGO) de U0 · U3 → EMPLEADO (SELECT-WGO) de U0 |
| 5 | U2 → EMPLEADO (SELECT-WGO) de U1 |
| 6 | U3 → EMPLEADO (SELECT-WGO) de U0/U2 |
| 7 | U3 → + ESJ (SELECT) de U0 |
| 8 | U2 tachado. U3 conserva EMPLEADO (SELECT-WGO) de U0, con el U2 tachado y la nota *"no afecta porque era redundante"*, más ESJ (SELECT) |

Estado final según la fuente: **U1** SELECT en ES y ESJ, INSERT/UPDATE/SELECT con WGO en EMPLEADO ·
**U2** nada · **U3** SELECT con WGO en EMPLEADO (de U0) y SELECT en ESJ.

**Resolución del vault (SQL estándar):** correcta. Con el grafo de permisos
([[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] § 6; GMUW cap. 10.1.6), el
`REVOKE … CASCADE` del paso 8 borra la arista U1 → U2·SELECT\*. U2·SELECT\* queda sin camino al admin
y cae, y con él la arista U2 → U3·SELECT. U3 conserva `SELECT*` sobre `EMPLEADO` porque lo recibió
**directamente de U0** en el paso 4, un camino independiente. Una precisión (nota) al paso 6: lo que U2
le da a U3 es `SELECT` **sin** opción de concesión. En el grafo es otro nodo, U3·SELECT, distinto de
U3·SELECT\*. No cambia el resultado final. El paso 3 no toca privilegios: U0 es admin, así que el
`UPDATE` procede, y solo mueve a Jorge López dentro de ESJ si la vista filtra por cargo. Es el mismo
esquema que la Pregunta 32 del [[Parcial 2Q2025|Parcial 2Q2025]] (allí con `CLIENTE` y las vistas
`CS`/`CSV`).

**Corrida en MySQL 9.7.2** *(U0 = `root`; U1–U3 = cuentas `p23_u1..3` creadas para la prueba y borradas
después; `ES` = `EMPLEADO WHERE Edad < 20`, `ESJ` = `ES WHERE Cargo = 'Jefe'`, definiciones de
juguete)*. Aparecen tres diferencias de motor:

```
[root] GRANT SELECT ON ES, ESJ TO 'p23_u1'@'%';
ERROR 1064 (42000) at line 1: You have an error in your SQL syntax; ... near ', ESJ TO 'p23_u1'@'%'' at line 1
[p23_u1] REVOKE SELECT ON EMPLEADO FROM 'p23_u2'@'%' CASCADE;
ERROR 1064 (42000) at line 1: You have an error in your SQL syntax; ... near 'CASCADE' at line 1
```

1. (atención) **En MySQL un `GRANT` lleva un solo objeto.** `ON ES, ESJ` es error de sintaxis y hay
   que partirlo en dos sentencias. La forma del enunciado es la de PostgreSQL, que admite una lista de
   tablas.
2. (crítico) **`REVOKE … CASCADE` no compila**, como ya documenta
   [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] § 3. Sin `CASCADE`, el
   estado final es este:

```
GRANT SELECT, INSERT, UPDATE ON `parcial2q2023`.`EMPLEADO` TO `p23_u1`@`%` WITH GRANT OPTION
GRANT SELECT ON `parcial2q2023`.`ESJ` TO `p23_u1`@`%`
GRANT SELECT ON `parcial2q2023`.`ES` TO `p23_u1`@`%`
GRANT USAGE ON `parcial2q2023`.`EMPLEADO` TO `p23_u2`@`%` WITH GRANT OPTION
GRANT SELECT ON `parcial2q2023`.`EMPLEADO` TO `p23_u3`@`%` WITH GRANT OPTION
GRANT SELECT ON `parcial2q2023`.`ESJ` TO `p23_u3`@`%`
```

```
+--------+---------------+------------+------------------+----------------------------+
| User   | Db            | Table_name | Grantor          | Table_priv                 |
+--------+---------------+------------+------------------+----------------------------+
| p23_u1 | parcial2q2023 | EMPLEADO   | root@localhost   | Select,Insert,Update,Grant |
| p23_u1 | parcial2q2023 | ES         | root@localhost   | Select                     |
| p23_u1 | parcial2q2023 | ESJ        | root@localhost   | Select                     |
| p23_u2 | parcial2q2023 | EMPLEADO   | p23_u1@localhost | Grant                      |
| p23_u3 | parcial2q2023 | EMPLEADO   | p23_u2@localhost | Select,Grant               |
| p23_u3 | parcial2q2023 | ESJ        | root@localhost   | Select                     |
+--------+---------------+------------+------------------+----------------------------+
```

3. (atención) **Mismo resultado para U3, por otra razón.** En MySQL, U3 conserva `SELECT … WITH GRANT
   OPTION` porque no hay cascada y porque `mysql.tables_priv` guarda **una sola fila por (cuenta, tabla)**.
   Las concesiones de U0 (paso 4) y de U2 (paso 6) se fusionaron, y la columna `Grantor` quedó con el
   **último** otorgante, `p23_u2`, no con `root`. Hay además un residuo que la teoría no tiene: **U2
   pierde el `SELECT` pero conserva la marca `Grant`** sobre `EMPLEADO`, visible como `GRANT USAGE …
   WITH GRANT OPTION`, porque `REVOKE SELECT` no quita la opción de concesión del nivel tabla. Para
   limpiarla hace falta `REVOKE GRANT OPTION ON EMPLEADO FROM …`.

---

## Pregunta 7 — `EXPLAIN ANALYZE` (verdadero/falso)

> **Ejercicio 7.** Verdadero o Falso.
>
> a) El 'EXPLAIN ANALYZE <SQL>' muestra los tiempos de la planificación, pero no ejecuta la sentencia <SQL>.
> b) El 'EXPLAIN ANALYZE <SQL>' solo ejecuta la sentencia <SQL> y muestra los tiempos de la ejecución.
> c) El 'EXPLAIN ANALYZE <SQL>' planifica, ejecuta y muestra los tiempos de la planificación y la ejecución.

**Respuesta de la fuente (nota manuscrita):** *"a) Falso, sí ejecuta la sentencia. b) Falso, planifica
y ejecuta, y reporta métricas. c) Verdadero."*

**Resolución del vault:** correcta **para PostgreSQL**, el motor que este examen presupone. La
documentación de PostgreSQL
(`https://www.postgresql.org/docs/current/using-explain.html`, § *EXPLAIN ANALYZE*) dice que con esa
opción *"EXPLAIN actually executes the query"* y describe por separado el `Planning time` y el
`Execution time`. Eso confirma *c*, y hace falsas a *a* (sí ejecuta) y a *b* (también planifica y
reporta el tiempo de planificación). Coincide con [[1.08.01 - Plan de ejecución|Plan de ejecución]] §
*`EXPLAIN` vs. `EXPLAIN ANALYZE`*.

(atención) **En MySQL, el inciso *c* no es literal.** Corrida real sobre la consulta del Ej. 2:

```
EXPLAIN: -> Filter: (`sum(empleado.sueldo)` > 10000)  (actual time=0.128..0.129 rows=1 loops=1)
    -> Table scan on <temporary>  (actual time=0.0493..0.0497 rows=4 loops=1)
        -> Aggregate using temporary table  (actual time=0.0488..0.0488 rows=4 loops=1)
            -> Table scan on empleado  (cost=0.95 rows=7) (actual time=0.0118..0.0145 rows=7 loops=1)
```

El `EXPLAIN FORMAT=TREE` de la misma consulta da el mismo árbol **sin** los `actual time`. MySQL
ejecuta y reporta tiempos reales **por iterador**, pero no muestra un "tiempo de planificación"
separado. El manual 9.7 (`https://dev.mysql.com/doc/refman/9.7/en/explain.html`) lo define así:
*"runs a statement and produces EXPLAIN output along with timing"*. Además, solo lo admite para
`SELECT`, `TABLE` y `UPDATE`/`DELETE` **multi-tabla**. Con un `DELETE` de una sola tabla, MySQL 9.7.2
devolvió `-> <not executable by iterator executor>` y **no borró nada** (3 filas antes y después).
Para 2026, la Pregunta 2 del [[Parcial 2Q2025|Parcial 2Q2025]] conserva solo el inciso *a*, rotulado
"en MySQL", y su respuesta sigue siendo Falso.

---

## Pregunta 8 — acciones referenciales sobre `Carrera`/`Materia`

> **Ejercicio 8.** Considere las tablas a continuación con sus atributos y datos relevantes, con sus
> claves primarias, sus restricciones de integridad referencial (RIR) y acciones referenciales de
> [baja, modificación a derecha]:
>
> R1: Carrera (idFac) << Facultad (idFac): [restrict, restrict]
> R2: Materia (carrera, facultad) << Carrera (idCarr, idFac): [restrict, cascade]
>
> | Materia | idM | carrera | facultad | nom |
> | --- | --- | --- | --- | --- |
> | | M1 | 1 | F1 | nom1 |
> | | M2 | 1 | F1 | nom2 |
> | | M3 | 2 | F2 | nom3 |
>
> | Carrera | idCarr | idFac |
> | --- | --- | --- |
> | | 1 | F1 |
> | | 2 | F2 |
> | | 1 | F2 |
>
> | Facultad | idFac |
> | --- | --- |
> | | F1 |
> | | F2 |
>
> Determine el resultado de la ejecución de las siguientes operaciones. En cada caso considere el
> efecto sobre la instancia original de la BD, los resultados no son acumulativos.
> Nota: respecto de la RIR R2, suponga que los atributos carrera y facultad admiten nulos.
>
> 8.1) `delete from Carrera where idCarr= 1;`
> 8.2) `update carrera set idFac='F1' where idFac='F2';`
> 8.3) `insert into Materia (idM, carrera, facultad, nom) values ('M5', 3, null, 'nom4')`

Esquema y datos idénticos a la Sección B del [[Parcial 2Q2025|Parcial 2Q2025]]. Se recrearon desde
cero antes de cada operación, con `R1` y `R2` como `ON DELETE RESTRICT ON UPDATE RESTRICT` y `ON DELETE
RESTRICT ON UPDATE CASCADE`.

**Respuesta de la fuente (nota manuscrita):** *"1. No se ejecuta por la restricción para bajas en R2.
Existe una tupla con idCarr=1. 2. Se ejecuta y se aplica el cascade a la tabla Materia. 3. Se inserta
porque la FK tiene un componente null, por lo que no se verifica la RI."*

**Resolución del vault:**

| Op. | Fuente | Motor (corrida real) | Veredicto |
| --- | --- | --- | --- |
| 8.1 | no procede por R2 | `ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails`, con la restricción `R2` nombrada en el mensaje | ✓ correcto: `(1, F1)` está referenciada por M1 y M2 |
| 8.2 | procede, cascade a `Materia` | `ERROR 1062 (23000): Duplicate entry '1-F1' for key 'Carrera.PRIMARY'` | ✗ (atención) **no procede, por unicidad de la PK** |
| 8.3 | procede, `MATCH simple` | procede; `Materia` queda con `('M5', 3, NULL, 'nom4')` aunque `idCarr = 3` no existe | ✓ correcto |

**8.2, la trampa.** El manuscrito mira las RIR y olvida la clave primaria de `Carrera`, que es
`(idCarr, idFac)`. Al pasar `F2` a `F1`, la fila `(1, F2)` se convertiría en `(1, F1)`, que ya existe.
El motor la rechaza antes de llegar a ninguna acción referencial. Es exactamente la Pregunta 17 del
[[Parcial 2Q2025|Parcial 2Q2025]], cuya respuesta correcta según la corrección de la plataforma es
*"No procede por restricción de unicidad"*. Para comprobar que el razonamiento de la fuente sí vale
**cuando no hay choque**, se borró primero `(1, F2)` y se repitió el `UPDATE`: procede, y el `cascade`
de R2 lleva M3 a `(2, F1)`.

```
Carrera: (1, F1) · (2, F1)
Materia: M1 (1, F1) · M2 (1, F1) · M3 (2, F1)
```

8.3 es la regla `MATCH SIMPLE`: con un componente nulo, la FK compuesta se da por satisfecha
([[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] § *Tipos de
matching*). GMUW cap. 7.1.1 exige la correspondencia solo cuando la tupla tiene valores no nulos en
**todos** los atributos de la FK, que es la semántica de `MATCH SIMPLE`, aunque el libro no nombra los
tipos de matching. MySQL implementa solo `SIMPLE`. En el 2Q2025 la misma operación usa `'M4'`
y ofrece `MATCH simple/parcial/full` como opciones. (nota) El enunciado escribe `update carrera` en
minúscula: en el contenedor eso da `ERROR 1146 … 'parcial2q2023.carrera' doesn't exist` (ver §
*Datasets y corridas*).

---

## Pregunta 9 — instituciones con director y sin voluntarios (una o más correctas)

> **Ejercicio 9.** Usando el DER del ejercicio 3, se requiere listar los nombres de instituciones con
> director que en la actualidad no registran acción de voluntarios.
> Indique cuál/es de las siguientes soluciones permite/n obtener lo pedido y justifique de forma clara y
> concisa cada opción descartada. Seleccione una o más de una:
>
> A. Ninguna de las opciones
> B. `select nombre_institucion from institucion i where i.id_director is not null and i.id_institucion not in (select id_institucion from voluntario);`
> C. `select nombre_institucion from institucion i join voluntario v on (i.id_institucion <> v.id_institucion) where i.id_director is not null;`
> D. `select nombre_institucion from institucion i where i.id_director is not null and not exists (select 1 from voluntario v where v.id_institucion = i.id_institucion);`
> E. `select nombre_institucion from institucion i where i.id_director <> null and not exists (select 1 from voluntario v where v.id_institucion = i.id_institucion);`

**Respuesta de la fuente:** ninguna. El manuscrito dice *"No se entiende el ej. 3"*, porque este
ejercicio depende del DER del Ejercicio 3, que salteó. En la foto, las casillas de respuesta están
tapadas.

**Resolución del vault:** **solo D**. "En la actualidad" apunta a `voluntario.id_institucion`, la
institución actual de cada voluntario. `historico` guarda las pasadas. Corrida real con los datos de
juguete, donde dos voluntarios tienen `id_institucion = NULL`:

| Opción | Salida real | Veredicto |
| --- | --- | --- |
| B | *(vacío)* | ✗ `voluntario.id_institucion` admite nulos (N en el DER). Con un solo `NULL` en la subconsulta, `NOT IN` nunca da `TRUE`. Sin voluntarios con `NULL` devolvió `Inst SF` e `Inst Boston`, así que **depende de los datos** y no es solución |
| C | 16 filas: NY, Chicago, CABA, SF, Boston repetidas | ✗ `JOIN` con `<>` combina cada institución con **todo voluntario de otra** institución. Devuelve instituciones que sí tienen voluntarios, y con duplicados |
| D | `Inst SF`, `Inst Boston` | ✓ `NOT EXISTS` no compara valores, solo busca si hay filas: los `NULL` no lo afectan |
| E | *(vacío)* | ✗ `id_director <> null` es `UNKNOWN` para toda fila, así que el `WHERE` descarta todo. Se testea con `IS NOT NULL` |
| A | — | ✗ D es solución |

La "institución sin director" no aparece en D, como corresponde. Es la regla más examinable de
[[1.05.01 - SQL — consultas|SQL — consultas]] § 10.5 (*"`NOT IN` y `NOT EXISTS` no son sinónimos. El
valor `NULL` determina la diferencia."*) y § 11.4, más la de `IS [NOT] NULL` como única forma de
testear nulos (§ 3.4; GMUW cap. 6.1.7).

---

## Pregunta 10 — `NOT IN` con un `NULL` en la subconsulta (opción múltiple)

> **Ejercicio 10.** Considere que se crean las siguientes tablas en PostgreSQL:
>
> ```sql
> CREATE TABLE JUGO (
>   id INT PRIMARY KEY,
>   marca VARCHAR(16),
>   codigo_ean INT );
> CREATE TABLE SABOR (
>   id INT PRIMARY KEY,
>   marca VARCHAR(16),
>   sabor VARCHAR(8) NOT NULL );
> ```
>
> y se ingresan los siguientes datos:
>
> ```sql
> INSERT INTO JUGO VALUES (1, 'RINDE2', 1151354787), (2, 'TANG', 222353464), (3, 'ADES', NULL), (4, NULL, 542136499);
> INSERT INTO SABOR VALUES (1, 'TANG', 'NARANJA'), (2, 'ADES', 'POMELO'), (3, 'BAGGIO', 'NARANJA'), (4, NULL, 'MANZANA');
> ```
>
> Al ejecutar la consulta a continuación se obtiene como resultado: **0 rows**.
> ¿El comportamiento de la consulta es el esperado? Seleccione su respuesta, entre las opciones disponibles
>
> ```sql
> SELECT marca
> FROM JUGO
> WHERE marca NOT IN (SELECT marca
>                     FROM SABOR );
> ```
>
> a. Sí, debido a que el valor NULL de la columna marca de la tabla SABOR fuerza a que la comparación dé
> como resultado desconocido, entonces no se listará ninguna tupla.
> b. Sí, debido a que el valor NULL de la columna marca de la tabla JUGO fuerza a que la comparación dé
> como resultado desconocido, entonces no se listará ninguna tupla.
> c. No, la sentencia escrita en PostgreSQL debe retornar las marcas de jugos que no tengan registrados
> sabores en la base de datos.
> d. Sí, ya que no hay marcas de jugos de los cuales no haya sabores registrados.

**Respuesta de la fuente:** **a**, encerrada en la foto. El manuscrito agrega: *"a) El problema está
en el null de SABOR."*

**Resolución del vault:** **a**, correcta. Corrida en MySQL 9.7.2, con el mismo comportamiento que
PostgreSQL porque es lógica trivaluada del estándar:

```
-- consulta del enunciado: 0 filas (FOUND_ROWS() = 0)
-- evaluación fila por fila de marca NOT IN (SELECT marca FROM SABOR)
+--------+--------+
| marca  | not_in |
+--------+--------+
| RINDE2 |   NULL |
| TANG   |      0 |
| ADES   |      0 |
| NULL   |   NULL |
+--------+--------+
-- NOT IN (SELECT marca FROM SABOR WHERE marca IS NOT NULL) → RINDE2
-- NOT EXISTS (SELECT 1 FROM SABOR s WHERE s.marca = j.marca) → RINDE2, NULL
```

`RINDE2` es la única marca sin sabor, pero `'RINDE2' <> NULL` da `UNKNOWN`, y toda la conjunción del
`NOT IN` queda en `UNKNOWN`. La *b* es un distractor: el `NULL` de `JUGO` solo elimina **su propia
fila**, no las demás. La *d* es falsa (RINDE2 no tiene sabor), y la *c* describe lo que el autor quería,
no lo que el estándar hace. Dos arreglos: filtrar los nulos de la subconsulta, o usar `NOT EXISTS`.
Con `NOT EXISTS` sale también el jugo de marca `NULL`, porque ninguna fila de `SABOR` es igual a `NULL`.
Mismo principio que la opción B del Ej. 9: [[1.05.01 - SQL — consultas|SQL — consultas]] § 11.4.

---

## Qué enseña para el parcial 2026

- **La cátedra recicla.** Cinco de los diez ejercicios reaparecen en el [[Parcial 2Q2025|Parcial 2Q2025]]
  con cambios cosméticos: 1B → P16, 4B → P27, 6 → P32, 7a → P2, y 8.1/8.2/8.3 → P30/P17/P19. La P24
  pregunta lo mismo que el 4A, pero para una restricción de tabla (`CHECK` → `TRIGGER`), no global. Conviene dominar estos esquemas (`CONSTRUCTOR`/`OBRA`/`EJECUTA`,
  `Carrera`/`Materia`/`Facultad`, `U0…U3` con vistas) antes del 13/10.
- **`NULL` es el tema transversal**: `NOT IN` con nulos (Ej. 9 B y Ej. 10), `<> NULL` (Ej. 9 E), FK
  compuesta con un nulo (Ej. 8.3) y "en ejecución" como `IS NULL` (Ej. 1 y 4). Regla práctica:
  `NOT EXISTS` para anti-joins, e `IS [NOT] NULL` para testear nulos.
- **Las trampas son de restricciones que el enunciado no nombra.** El 8.2 invita a pensar en R1/R2 y
  falla por la PK. El 4A se puede confundir con un `CHECK` de tabla, pero cruza dos tablas y va con
  `ASSERTION`.
- **Estándar vs. MySQL.** Varias preguntas son de lápiz y papel en SQL estándar o PostgreSQL:
  `ASSERTION`, `REVOKE … CASCADE`, `GRANT` sobre dos objetos y los tiempos de planificación de
  `EXPLAIN ANALYZE`. En MySQL cada una falla o cambia. Hay que saber responder la teórica y, si se
  pide, dar el reemplazo del motor (triggers, `REVOKE` sin cascada, un `GRANT` por objeto).
- **Los detalles de columna cuestan puntos.** `COUNT(o.obra)`, `c.ing_resp`, `fecha_finalizacion` y
  `id_obro` no corren. Conviene copiar los nombres del DER.

## Dudas abiertas

- (abierto) **Listas de opciones del Ej. 3.** El enunciado dice *"seleccionando de la lista
  correspondiente"*, pero la foto no las muestra. La resolución del vault completa los huecos
  libremente y puede no coincidir con las opciones que ofrecía el examen.
- (abierto) **Fecha, puntaje y duración** del 2Q-2023: la fuente no los trae. Tampoco se sabe si las
  tildes de las fotos son de la corrección.
- (abierto) **Motor de la cursada 2023.** Los Ej. 2 y 10 apuntan a PostgreSQL. Si fue así, el inciso
  *c* del Ej. 7 es Verdadero sin reservas. Si el parcial 2026 lo preguntara "en MySQL", la respuesta
  dependería de si la cátedra toma los `actual time` por iterador como "tiempos de planificación y
  ejecución".
- (abierto) Definición exacta de las vistas `EmpleadoSub-20` y `EmpleadoSub-20Jefe` del Ej. 6: el
  enunciado solo da los nombres. La corrida usó `Edad < 20` y `Cargo = 'Jefe'`, y la respuesta no
  depende de eso.

## Enlaces

- [[Mapa de exámenes|Mapa de exámenes]] · [[Parcial 2Q2025|Parcial 2Q2025]] (versión 2025 de cinco de
  estos ejercicios) · [[Parcial XC-202X|Parcial XC-202X]] y
  [[Práctica subida por la cátedra|Práctica subida por la cátedra]] (las otras dos instancias del mismo
  cuaderno)
- Clases: [[Clase 05 - Consultas de Datos–Parte 1|Clase 05 (Parte 1)]] ·
  [[Clase 05 - Consultas de Datos–Parte 2|Clase 05 (Parte 2)]] ·
  [[Clase 05 - Consultas de Datos–Parte 3|Clase 05 (Parte 3)]] · [[Clase 06 - Vistas-Parte 1|Clase 06]] ·
  [[Clase 07 - Vistas-Parte 2|Clase 07]] · [[Clase 08 - Explicando el plan|Clase 08]] ·
  [[Clase 09 - Restricciones integridad-Parte 1|Clase 09]] ·
  [[Clase 10 - Restricciones integridad-Parte 2|Clase 10]] (base `voluntario`, `voluntarioscadax` y los
  triggers como reemplazo de assertions) · [[Clase 11 - Seguridad-Transacciones|Clase 11]]
- Prácticas: [[Práctica 2026-08-04|Práctica 2026-08-04]] · [[Práctica 2026-08-11|Práctica 2026-08-11]] ·
  [[Práctica 2026-08-18|Práctica 2026-08-18]] · [[Práctica 2026-08-25|Práctica 2026-08-25]] ·
  [[Práctica 2026-09-01|Práctica 2026-09-01]] · [[Práctica 2026-09-08|Práctica 2026-09-08]]
- Conceptos: [[1.05.01 - SQL — consultas|SQL — consultas]] · [[1.06.01 - Vistas|Vistas]] ·
  [[1.08.01 - Plan de ejecución|Plan de ejecución]] ·
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial y acciones referenciales]] ·
  [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] · [[1.09.04 - Triggers|Triggers]] ·
  [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]]
- Motores: [[MySQL|MySQL]] · [[PostgreSQL|PostgreSQL]]
- Bibliografía: [[Database Systems The Complete Book — ficha|GMUW]] (caps. 6.1.7, 7.1.1, 7.4, 8.2.2,
  10.1.6) · [[_cronograma|Cronograma]]
