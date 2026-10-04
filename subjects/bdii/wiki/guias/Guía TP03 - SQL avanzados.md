---
tipo: guia
unidad: 1
orden: 4
tema: "TP3 - SQL avanzados"
resumen: "TP3 SQL avanzados resuelto en MySQL sobre esq_peliculas.sql: ocho consultas con JOIN, IN/EXISTS y agrupamiento, y la tabla DistribuidorNac con INSERT … SELECT, ALTER TABLE y UPDATE con join. Todas corridas y coincidentes con la salida del enunciado."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 3 SQL avanzados.pdf"
  - "raw/Unidad-01/Practica/esq_peliculas.sql"
estado: procesado
---

# Guía TP03 — SQL avanzados

## Resumen general

El TP3 SQL avanzados es la segunda parte del TP3 y trabaja sobre el mismo esquema de películas del TP3
SQL simples (`esq_peliculas.sql`: películas, entregas, videoclubs, distribuidores nacionales e
internacionales, departamentos, empleados y tareas). Tiene dos ejercicios. El **1** son ocho consultas:
cinco con `JOIN` y anidamiento (`IN`, `NOT IN`, `EXISTS`, `NOT EXISTS`) y tres con agrupamiento. El
**2** crea una tabla nueva, `DistribuidorNac`, la llena con `INSERT … SELECT`, le agrega una columna con
`ALTER TABLE` y la completa con un `UPDATE` que cruza contra otra tabla.

Todas las consultas de esta guía se corrieron en MySQL 9.7.2 y dan, fila por fila, la salida de
referencia que trae el enunciado. El 1.h da vacío, igual que en el enunciado: el dataset tiene solo
siete empleados.

Trampas que conviene llevarse al parcial: en el **1.b**, "supere el 50 %" es `>` estricto, y con `>=`
el resultado cambia; en el **1.e**, "jefe" se lee por `empleado.id_jefe` (quién tiene personal a cargo),
no por `departamento.jefe_departamento`; "la menor cantidad de tablas posible" (1.c y 1.d) se logra
filtrando por `distribuidor.tipo = 'N'` sin sumar la tabla `nacional`; `pelicula.idioma` guarda
`'English'`, no `'Ingles'`; y el `GROUP BY` del 1.g tiene que incluir la PK de `entrega` para cumplir
`ONLY_FULL_GROUP_BY`. En el ejercicio 2, el enunciado usa tipos de PostgreSQL/estándar
(`character varying`, `numeric`) que en MySQL se escriben `VARCHAR` y `DECIMAL`, y el `UPDATE` con join
tiene sintaxis propia de MySQL (`UPDATE t JOIN u ON … SET …`).

## Setup

```bash
docker run -d --name mysql-bd2 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=peliculas mysql:9
docker exec -i mysql-bd2 mysql -uroot -proot peliculas < raw/Unidad-01/Practica/esq_peliculas.sql
docker exec -it mysql-bd2 mysql -uroot -proot peliculas
```

El script crea las 13 tablas del diagrama de la página 1 y carga un dataset chico (7 distribuidores,
7 videoclubs, 7 entregas, 7 empleados), todo con fechas de 2022.

---

## Ejercicio 1 — JOINs y anidamiento

### 1.a
**Consigna:** listar los videoclubs con entregas de películas en idioma inglés durante 2022, en orden
alfabético.
**Resolución:**
```sql
SELECT DISTINCT v.razon_social
FROM video v
  JOIN entrega e          ON v.id_video = e.id_video
  JOIN renglon_entrega re ON e.nro_entrega = re.nro_entrega
  JOIN pelicula p         ON re.codigo_pelicula = p.codigo_pelicula
WHERE p.idioma = 'English' AND YEAR(e.fecha_entrega) = 2022
ORDER BY v.razon_social;
```
Variante anidada, mismo resultado:
```sql
SELECT v.razon_social
FROM video v
WHERE EXISTS (
  SELECT 1 FROM entrega e
  WHERE e.id_video = v.id_video
    AND YEAR(e.fecha_entrega) = 2022
    AND EXISTS (SELECT 1
                FROM renglon_entrega re JOIN pelicula p ON re.codigo_pelicula = p.codigo_pelicula
                WHERE re.nro_entrega = e.nro_entrega AND p.idioma = 'English'))
ORDER BY v.razon_social;
```
Resultado: `VideoClub 1` a `VideoClub 7` (7 filas). El `DISTINCT` evita repetir un videoclub por cada
renglón de la entrega. El valor guardado es `'English'`: filtrar por `'Ingles'` devuelve vacío sin error.

### 1.b
**Consigna:** departamentos (identificador y nombre) que no tengan empleados cuya diferencia entre
sueldo máximo y mínimo de su tarea supere el 50 % del sueldo máximo real de todos los empleados.
**Resolución:**
```sql
SELECT d.id_departamento, d.id_distribuidor, d.nombre_departamento
FROM departamento d
WHERE NOT EXISTS (
  SELECT 1
  FROM empleado e JOIN tarea t ON e.id_tarea = t.id_tarea
  WHERE e.id_departamento = d.id_departamento
    AND e.id_distribuidor = d.id_distribuidor
    AND (t.sueldo_maximo - t.sueldo_minimo) > 0.5 * (SELECT MAX(sueldo) FROM empleado)
)
ORDER BY d.id_departamento, d.id_distribuidor;
```

| id_departamento | id_distribuidor | nombre_departamento |
| --- | --- | --- |
| 1 | 1 | Ventas |
| 1 | 3 | Ventas |
| 1 | 5 | Ventas |
| 1 | 7 | Ventas |
| 4 | 4 | Recursos Humanos |
| 6 | 6 | Marketing |

(clave) La PK de `departamento` es compuesta `(id_distribuidor, id_departamento)`: la correlación usa
las dos columnas. El "sueldo máximo real" es `MAX(empleado.sueldo)` = 8000, no `tarea.sueldo_maximo`;
el umbral es 4000. El departamento `(1,1)` tiene una diferencia de exactamente 4000 y entra porque
`4000 > 4000` es falso; con `>=` quedaría afuera. El `(2,2)` sale porque tiene un empleado con tarea
T004 (10000 − 5500 = 4500).

### 1.c
**Consigna:** cantidad total de películas entregadas en 2022 por un distribuidor nacional, con la
menor cantidad de tablas posible.
**Resolución:**
```sql
SELECT SUM(re.cantidad) AS total_peliculas
FROM entrega e
  JOIN renglon_entrega re ON re.nro_entrega = e.nro_entrega
WHERE YEAR(e.fecha_entrega) = 2022
  AND e.id_distribuidor IN (SELECT id_distribuidor FROM distribuidor WHERE tipo = 'N');
```
Resultado: `total_peliculas = 30`. `distribuidor.tipo = 'N'` ya identifica a los nacionales: no hace
falta la tabla `nacional`. Se suma `cantidad` porque se piden unidades entregadas.

### 1.d
**Consigna:** nombre de las películas que nunca fueron entregadas por un distribuidor nacional, con la
menor cantidad de tablas posible.
**Resolución:**
```sql
SELECT p.titulo
FROM pelicula p
WHERE NOT EXISTS (
  SELECT 1
  FROM renglon_entrega re
    JOIN entrega e      ON re.nro_entrega = e.nro_entrega
    JOIN distribuidor d ON d.id_distribuidor = e.id_distribuidor
  WHERE re.codigo_pelicula = p.codigo_pelicula AND d.tipo = 'N'
);
```
Resultado: `The Dark Knight`, `Pulp Fiction`. La forma con `NOT IN (SELECT re.codigo_pelicula …)` da
lo mismo porque `codigo_pelicula` nunca es nulo; aun así, `NOT EXISTS` es la forma segura: un `NULL`
en la subconsulta de un `NOT IN` deja el resultado vacío.

### 1.e
**Consigna:** jefes (sean o no jefes de departamento) que tienen personal a cargo y cuyos
departamentos están en España.
**Resolución:**
```sql
SELECT DISTINCT e.nombre, e.apellido
FROM empleado e
  JOIN departamento d ON e.id_departamento = d.id_departamento
                     AND e.id_distribuidor = d.id_distribuidor
  JOIN ciudad c       ON d.id_ciudad = c.id_ciudad
  JOIN pais pa        ON c.id_pais = pa.id_pais
WHERE pa.nombre_pais = 'España'
  AND EXISTS (SELECT 1 FROM empleado sub WHERE sub.id_jefe = e.id_empleado);
```
Resultado: `Maria Gonzalez`. "Tener personal a cargo" es que algún empleado lo tenga en `id_jefe`
(FK reflexiva). `departamento.jefe_departamento` es otra cosa: quién encabeza el departamento.

---

## Ejercicio 1 — Agrupamiento

### 1.f
**Consigna:** cantidad total de películas entregadas en los últimos 5 años (cuentan todas las copias),
por género, de mayor a menor.
**Resolución:**
```sql
SELECT p.genero, SUM(re.cantidad) AS cantidad_total
FROM entrega e
  JOIN renglon_entrega re ON re.nro_entrega = e.nro_entrega
  JOIN pelicula p         ON p.codigo_pelicula = re.codigo_pelicula
WHERE e.fecha_entrega >= CURDATE() - INTERVAL 5 YEAR
GROUP BY p.genero
ORDER BY cantidad_total DESC;
```

| genero | cantidad_total |
| --- | --- |
| Drama | 15 |
| Crime | 7 |
| Romance | 6 |
| Action | 4 |
| Sci-Fi | 4 |

"No importa que se haya entregado más de una copia" significa sumar `cantidad`, no
`COUNT(DISTINCT …)`: solo la suma reproduce la salida del enunciado.
(atención) La ventana es relativa al día de la corrida y todo el dataset es de 2022: a partir de
enero de 2027 la consulta empieza a perder filas. Para una ventana fija:
`WHERE YEAR(e.fecha_entrega) BETWEEN 2018 AND 2022`.

### 1.g
**Consigna:** resumen de entregas diarias con el videoclub y la cantidad entregada, ordenado por fecha.
**Resolución:**
```sql
SELECT e.fecha_entrega, v.razon_social, SUM(re.cantidad) AS cantidad_total
FROM entrega e
  JOIN video v            ON v.id_video = e.id_video
  JOIN renglon_entrega re ON re.nro_entrega = e.nro_entrega
GROUP BY e.nro_entrega, e.fecha_entrega, v.razon_social
ORDER BY e.fecha_entrega;
```

| fecha_entrega | razon_social | cantidad_total |
| --- | --- | --- |
| 2022-01-15 | VideoClub 1 | 5 |
| 2022-02-20 | VideoClub 2 | 3 |
| 2022-03-05 | VideoClub 3 | 4 |
| 2022-04-10 | VideoClub 4 | 2 |
| 2022-05-15 | VideoClub 5 | 6 |
| 2022-06-20 | VideoClub 6 | 3 |
| 2022-07-25 | VideoClub 7 | 13 |

Se agrupa también por `nro_entrega` (PK de `entrega`) para que cada columna no agregada dependa
funcionalmente del grupo y MySQL no rechace la consulta por `ONLY_FULL_GROUP_BY`.

### 1.h
**Consigna:** por ciudad, nombre y país con la cantidad de empleados mayores de edad que trabajan en
departamentos de esa ciudad, solo si la ciudad tiene al menos 30 empleados.
**Resolución:**
```sql
SELECT c.nombre_ciudad, c.id_pais, COUNT(*) AS total_empleados
FROM ciudad c
  JOIN departamento d ON d.id_ciudad = c.id_ciudad
  JOIN empleado e     ON e.id_departamento = d.id_departamento
                     AND e.id_distribuidor = d.id_distribuidor
WHERE TIMESTAMPDIFF(YEAR, e.fecha_nacimiento, CURDATE()) >= 18
GROUP BY c.nombre_ciudad, c.id_pais
HAVING COUNT(*) >= 30;
```
Resultado: vacío, igual que la salida del enunciado. La base tiene 7 empleados, todos en Barcelona: el
`HAVING` no se puede cumplir. La mayoría de edad va en `WHERE` (filtra filas) y el mínimo de 30 en
`HAVING` (filtra grupos).

---

## Ejercicio 2 — DistribuidorNac

**Consigna:** crear la tabla dada en el enunciado. En MySQL:
```sql
CREATE TABLE DistribuidorNac (
  id_distribuidor      DECIMAL(5,0) NOT NULL,
  nombre               VARCHAR(80)  NOT NULL,
  direccion            VARCHAR(120) NOT NULL,
  telefono             VARCHAR(20),
  nro_inscripcion      DECIMAL(8,0) NOT NULL,
  encargado            VARCHAR(60)  NOT NULL,
  id_distrib_mayorista DECIMAL(5,0),
  CONSTRAINT pk_distribuidorNac PRIMARY KEY (id_distribuidor)
);
```
(nota) MySQL acepta `numeric` y `character varying` del enunciado tal cual (los mapea a `DECIMAL` y
`VARCHAR`), pero la forma propia es la de arriba.

### 2.a
**Consigna:** llenar `DistribuidorNac` con los datos completos de todos los distribuidores nacionales.
**Resolución:**
```sql
INSERT INTO DistribuidorNac
  (id_distribuidor, nombre, direccion, telefono, nro_inscripcion, encargado, id_distrib_mayorista)
SELECT d.id_distribuidor, d.nombre, d.direccion, d.telefono,
       n.nro_inscripcion, n.encargado, n.id_distrib_mayorista
FROM distribuidor d
  JOIN nacional n ON d.id_distribuidor = n.id_distribuidor;
```
Inserta 4 filas (distribuidores 1, 3, 5 y 7). "Datos completos" obliga al join: nombre, dirección y
teléfono están en el supertipo `distribuidor`; inscripción, encargado y mayorista, en el subtipo
`nacional`.

### 2.b
**Consigna:** agregar la columna `codigo_pais` (`character varying(5) NULL`).
**Resolución:**
```sql
ALTER TABLE DistribuidorNac ADD COLUMN codigo_pais VARCHAR(5) NULL;
```

### 2.c
**Consigna:** llenar `codigo_pais` con el valor de la tabla `internacional` (el país del mayorista).
**Resolución:**
```sql
UPDATE DistribuidorNac dn
  JOIN internacional i ON dn.id_distrib_mayorista = i.id_distribuidor
SET dn.codigo_pais = i.codigo_pais;
```

| id_distribuidor | id_distrib_mayorista | codigo_pais |
| --- | --- | --- |
| 1 | 2 | FR |
| 3 | 2 | FR |
| 5 | 4 | GB |
| 7 | 6 | DE |

El cruce es por `id_distrib_mayorista`, no por `id_distribuidor`: el país pedido es el del mayorista.
`UPDATE … JOIN … SET` es sintaxis de MySQL; en PostgreSQL se escribe `UPDATE … SET … FROM …`. Forma
portable, con subconsulta correlacionada:
```sql
UPDATE DistribuidorNac dn
SET codigo_pais = (SELECT i.codigo_pais FROM internacional i
                   WHERE i.id_distribuidor = dn.id_distrib_mayorista);
```

---

## Enlaces

- Análisis completo y discusión de cada ítem: [[Práctica 2026-08-11|Práctica del 11/08]]
- Primera parte del TP3: [[Guía TP03 - SQL simples|Guía TP03 — SQL simples]]
- Hoja de referencia: [[1.05.01 - SQL — consultas|SQL — consultas]]
- Motor: [[MySQL]]
