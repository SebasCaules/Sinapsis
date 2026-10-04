---
tipo: guia
unidad: 1
orden: 3
tema: Consultas SQL simples sobre una tabla
resumen: "TP3 SQL simples resuelto: once consultas sobre una sola tabla del esquema de películas (SELECT, WHERE, LIKE, DISTINCT, ORDER BY, CONCAT, alias, IS NULL, GROUP BY, HAVING), corridas en MySQL 9.7.2 y contrastadas con las salidas del enunciado."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 3 SQL simples.pdf"
  - "raw/Unidad-01/Practica/esq_peliculas.sql"
estado: procesado
---

# Guía TP03 — Consultas SQL simples

## Resumen general

Primera parte del TP3: once consultas sobre **una sola tabla** del esquema de un centro de distribución
de películas (productoras, películas, distribuidores nacionales e internacionales, departamentos,
empleados, tareas, videoclubs y entregas). El script `esq_peliculas.sql` de la cátedra crea las 13
tablas y carga datos de ejemplo; el enunciado muestra debajo de cada ítem la salida esperada, y todas
las resoluciones de esta página reproducen esa salida en MySQL 9.7.2.

Lo que se ejercita es el `SELECT` básico de la [[Clase 05 - Consultas de Datos–Parte 1|Clase 05]]:
proyección, filtros con `WHERE` y `LIKE`, `DISTINCT`, `ORDER BY` por varias columnas, columnas
calculadas con `CONCAT`, `DAY()` y `MONTH()`, alias con espacios entre comillas, `IS NULL`, y
agregación con `GROUP BY` / `HAVING`.

Trampas: en el **g**, "no cobran comisión" en estos datos es `porc_comision = 0`, no `NULL` (con solo
`IS NULL` la consulta vuelve vacía); en el **h** el resultado esperado es **vacío**, porque ningún
distribuidor internacional tiene el teléfono en `NULL`, y eso es correcto; en el **e** hay que ordenar
por **mes y día** del nacimiento, no por la fecha completa (el año desordenaría); en el **k** se cuentan
entregas, no unidades: es `COUNT(*)` sobre `renglon_entrega`, nunca `SUM(cantidad)`.

Para el parcial: distinguir `WHERE` (filtra filas) de `HAVING` (filtra grupos), recordar que con
`GROUP BY` solo se proyectan columnas agrupadas o agregados, y que `= NULL` nunca es verdadero.

## Setup

Con el contenedor de la [[Práctica 2026-08-04|Práctica del 04/08]] (`mydb` creada), cargar el script
desde la carpeta del TP:

```bash
docker exec -i MyMySql mysql -u root -p mydb < esq_peliculas.sql
```

Columnas que usa este TP: `departamento (id_distribuidor, id_departamento, nombre_departamento, …)`,
`empleado (id_empleado, nombre, apellido, porc_comision, sueldo, e_mail, fecha_nacimiento, telefono,
id_tarea, id_departamento, id_distribuidor, id_jefe)`, `distribuidor (id_distribuidor, nombre,
direccion, telefono, tipo)` con `tipo` `'N'` nacional / `'I'` internacional, `pelicula (…, idioma, …)`
y `renglon_entrega (nro_entrega, codigo_pelicula, cantidad)`.

## Ejercicio 1

### 1.a

**Consigna.** Identificador de distribuidor, identificador de departamento y nombre de todos los
departamentos.

**Resolución.**

```sql
SELECT id_distribuidor, id_departamento, nombre_departamento
FROM departamento;
```

Salida: 7 filas (`1,1,Ventas` · `2,2,Contabilidad` · `3,1,Ventas` · `4,4,Recursos Humanos` ·
`5,1,Ventas` · `6,6,Marketing` · `7,1,Ventas`). La PK de `departamento` es
`(id_distribuidor, id_departamento)`: el `id_departamento` 1 se repite en distintos distribuidores.

### 1.b

**Consigna.** Apellidos, nombres y emails de los empleados con cuenta de gmail y sueldo superior a
$1000.

**Resolución.**

```sql
SELECT apellido, nombre, e_mail
FROM empleado
WHERE e_mail LIKE '%@gmail.com'
  AND sueldo > 1000;
```

Salida: `Garcia | Laura | lauragarcia@gmail.com`. "Superior" es `>` estricto.

### 1.c

**Consigna.** Los distintos identificadores de tarea que se usan en la tabla `empleado`.

**Resolución.**

```sql
SELECT DISTINCT id_tarea
FROM empleado;
```

Salida: `T001`, `T002`, `T004`, `T006`. Se consulta `empleado`, no `tarea`: la tabla `tarea` tiene
siete tareas y no todas están asignadas.

### 1.d

**Consigna.** Nombre, apellido y teléfono de los empleados con `id_tarea = 'T001'`, ordenados por
apellido y luego por nombre.

**Resolución.**

```sql
SELECT nombre, apellido, telefono
FROM empleado
WHERE id_tarea = 'T001'
ORDER BY apellido, nombre;
```

Salida: Luis Hernandez · Pedro Lopez · Carlos Martinez · Juan Perez. `id_tarea` es `VARCHAR`: el valor
va entre comillas.

### 1.e

**Consigna.** Listado de cumpleaños: nombre y apellido concatenados con coma, y el día y mes de
nacimiento, ordenado por mes y día ascendente.

**Resolución.**

```sql
SELECT CONCAT(nombre, ', ', apellido) AS nombre_apellido,
       CONCAT(DAY(fecha_nacimiento), '-', MONTH(fecha_nacimiento)) AS dia_mes_cumple
FROM empleado
ORDER BY MONTH(fecha_nacimiento), DAY(fecha_nacimiento);
```

Salida: `Juan, Perez 15-1` · `Carlos, Martinez 28-1` · `Maria, Gonzalez 23-3` · `Ana, Ramirez 20-5` ·
`Pedro, Lopez 10-8` · `Luis, Hernandez 12-9` · `Laura, Garcia 30-11`. Equivalente:
`DATE_FORMAT(fecha_nacimiento, '%e-%c')`. Ordenar por `dia_mes_cumple` estaría mal: ordena como texto
(`10-8` antes que `15-1`).

### 1.f

**Consigna.** Apellido y nombre concatenados con coma, y email, de los empleados cuyo teléfono empieza
con 600. Encabezados: 'Apellido y Nombre' y 'Dirección de mail'.

**Resolución.**

```sql
SELECT CONCAT(apellido, ', ', nombre) AS 'Apellido y Nombre',
       e_mail AS 'Dirección de mail'
FROM empleado
WHERE telefono LIKE '600%';
```

Salida: `Ramirez, Ana | anaramirez@email.com`. Un alias con espacios va entre comillas (o backticks).

### 1.g

**Consigna.** Apellido e identificador de los empleados que no cobran porcentaje de comisión.

**Resolución.**

```sql
SELECT apellido, id_empleado
FROM empleado
WHERE porc_comision IS NULL OR porc_comision = 0;
```

Salida: `Martinez | 7`. (atención) En `esq_peliculas.sql` nadie tiene `porc_comision` en `NULL`:
Martinez tiene `0.00`. Con solo `IS NULL` la consulta devuelve 0 filas; la salida del enunciado
(Martinez, 7) exige incluir el `= 0`. Cubrir los dos casos es lo correcto para "no cobra".

### 1.h

**Consigna.** Datos de los distribuidores internacionales sin ningún teléfono registrado, usando una
sola tabla.

**Resolución.**

```sql
SELECT id_distribuidor, nombre, direccion
FROM distribuidor
WHERE tipo = 'I'
  AND telefono IS NULL;
```

Salida: **vacía**, igual que en el enunciado (solo encabezados): los tres internacionales (2, 4, 6)
tienen teléfono. "Usar solo 1 tabla" es usar el discriminador `tipo = 'I'` de `distribuidor` en lugar
de cruzar con `internacional`. `telefono = NULL` sería un error: nunca es verdadero.

### 1.i

**Consigna.** Cantidad de películas registradas por idioma.

**Resolución.**

```sql
SELECT idioma, COUNT(*) AS cant_peliculas
FROM pelicula
GROUP BY idioma;
```

Salida: `English 7` · `Spanish 1`.

### 1.j

**Consigna.** Cantidad de empleados por departamento.

**Resolución.**

```sql
SELECT id_departamento, id_distribuidor, COUNT(*) AS cant_empleados
FROM empleado
GROUP BY id_departamento, id_distribuidor;
```

Salida: `1 | 1 | 3` · `2 | 2 | 4`. Se agrupa por **las dos** columnas porque un departamento se
identifica por el par `(id_distribuidor, id_departamento)`; agrupar solo por `id_departamento` mezclaría
departamentos de distintos distribuidores.

### 1.k

**Consigna.** Códigos de película con entre 3 y 5 entregas (cantidad de entregas, no de películas por
entrega).

**Resolución.**

```sql
SELECT codigo_pelicula, COUNT(*) AS cant_entregas
FROM renglon_entrega
GROUP BY codigo_pelicula
HAVING COUNT(*) BETWEEN 3 AND 5;
```

Salida: `10005 | 3` (entregas 5, 6 y 7). Cada fila de `renglon_entrega` es una película dentro de una
entrega, y la PK `(nro_entrega, codigo_pelicula)` impide que la misma película se repita en una
entrega: contar filas es contar entregas. `SUM(cantidad)` daría unidades (11 para la 10005), que es lo
que el enunciado pide **no** contar. La condición sobre el agregado va en `HAVING`, no en `WHERE`.

## Enlaces

- Práctica donde se dio el TP: [[Práctica 2026-08-04|Práctica del 04/08]] · segunda parte (SQL
  avanzados) en [[Práctica 2026-08-11|Práctica del 11/08]] y [[Guía TP03 - SQL avanzados|Guía TP03 avanzados]]
- Teoría: [[Clase 05 - Consultas de Datos–Parte 1|Clase 05 — Consultas, parte 1]] ·
  [[Clase 05 - Consultas de Datos–Parte 2|parte 2]] · [[Clase 05 - Consultas de Datos–Parte 3|parte 3]] ·
  [[1.05.01 - SQL — consultas|SQL — consultas]]
- Motor: [[MySQL]]
