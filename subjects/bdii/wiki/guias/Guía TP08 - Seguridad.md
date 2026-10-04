---
tipo: guia
unidad: 1
orden: 9
tema: TP8 Seguridad — GRANT, REVOKE y roles
resumen: "Guía resuelta del TP8: grafo de permisos, REVOKE en cascada, PUBLIC y roles, con la respuesta según la teoría y lo que hace MySQL en cada ítem. Todas las sentencias corridas en MySQL 9.7.2 con cuentas separadas."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 8 Seguridad.pdf"
estado: procesado
---

# Guía TP08 — Seguridad

## Resumen general

El TP8 trata el control de acceso discrecional: `GRANT`, `REVOKE`, `WITH GRANT OPTION`, privilegios
por columna, `PUBLIC` y roles, sobre tres esquemas propios (experimento lingüístico, Voluntarios y la
tabla `USUARIO`). El enunciado pide resolver en MySQL y, donde MySQL no alcanza, "desde la teoría";
por eso cada ítem lleva dos respuestas: **Teoría** (SQL estándar y el grafo de permisos de GMUW
10.1.5–10.1.6) y **MySQL** (lo que hace el motor, corrido en 9.7.2).

El grafo de permisos tiene un nodo por (usuario, privilegio); `**` marca al owner y `*` el grant
option. Un usuario solo puede otorgar un privilegio que tiene con `*` o `**`, y tras un
`REVOKE … CASCADE` sobrevive solo lo que conserva un camino hasta el owner. La idea que aparece en los
tres ejercicios: **tener un privilegio no es poder cederlo**.

MySQL difiere en cuatro puntos que cambian respuestas: no hay owner (crear una tabla no da
privilegios sobre ella), no hay `PUBLIC`, no hay `CASCADE` (un `REVOKE` nunca se propaga) y el
`GRANT OPTION` es una marca por (cuenta, tabla), no por privilegio. Con eso, la sentencia que falla
en la teoría en el ejercicio 1 pasa en MySQL. Además, los usuarios deben existir antes del `GRANT`
(error 1410) y un rol otorgado no está activo hasta `SET DEFAULT ROLE` o `SET ROLE`. Para el parcial:
dibujar el grafo, aplicar la regla del camino al owner y contestar primero según la teoría.

## Setup

En MySQL hay que crear antes las cuentas (`CREATE USER 'adm'@'%' IDENTIFIED BY '…'`, y así con
`db_exp`, `doc`, `U1`–`U3`, `A`–`D`) y simular al owner otorgándole todo sobre su base:

```sql
GRANT ALL PRIVILEGES ON experimento.* TO 'db_exp'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON A.*           TO 'A'@'%'      WITH GRANT OPTION;
```

Tablas mínimas (los diagramas no traen tipos; los tipos son elección propia y no afectan los
`GRANT`):

```sql
-- Ej. 1 (base experimento)
CREATE TABLE alumno  (id_alumno INT PRIMARY KEY, nombre_apellido VARCHAR(80), pais VARCHAR(40),
                      fecha_nacimiento DATE, sexo CHAR(1));
CREATE TABLE parrafo (id_alumno INT NOT NULL, nro_parrafo INT NOT NULL, tiempo DECIMAL(8,2),
                      diccion VARCHAR(20), PRIMARY KEY (id_alumno, nro_parrafo),
                      FOREIGN KEY (id_alumno) REFERENCES alumno (id_alumno));
-- Ej. 2 (base voluntarios): las tres tablas que se usan
CREATE TABLE tarea (id_tarea VARCHAR(10) PRIMARY KEY, nombre_tarea VARCHAR(35) NOT NULL,
                    min_horas DECIMAL(6,0), max_horas DECIMAL(6,0));
CREATE TABLE institucion (id_institucion DECIMAL(4,0) PRIMARY KEY,
                          nombre_institucion VARCHAR(60) NOT NULL,
                          id_director DECIMAL(6,0), id_direccion DECIMAL(4,0));
CREATE TABLE voluntario (nro_voluntario DECIMAL(6,0) PRIMARY KEY, nombre VARCHAR(20),
  apellido VARCHAR(25) NOT NULL, e_mail VARCHAR(25) NOT NULL, telefono VARCHAR(20),
  fecha_nacimiento DATE NOT NULL, id_tarea VARCHAR(10) NOT NULL,
  horas_aportadas DECIMAL(8,2), porcentaje DECIMAL(2,2),
  id_institucion DECIMAL(4,0), id_coordinador DECIMAL(6,0),
  FOREIGN KEY (id_tarea) REFERENCES tarea (id_tarea),
  FOREIGN KEY (id_institucion) REFERENCES institucion (id_institucion),
  FOREIGN KEY (id_coordinador) REFERENCES voluntario (nro_voluntario));
-- Ej. 3 (base A, creada por el usuario A)
CREATE TABLE usuario (nro_u VARCHAR(10) PRIMARY KEY, nombre VARCHAR(40), tarea VARCHAR(40));
```

## Ejercicio 1

**Consigna general.** `db_exp` es owner de `PARRAFO`. `db_exp` ejecuta: (1) `GRANT SELECT … TO adm
WITH GRANT OPTION`, (2) `GRANT UPDATE … TO adm WITH GRANT OPTION`, (3) `GRANT DELETE … TO adm`. Luego
`adm` ejecuta: (4) `GRANT SELECT … TO doc`, (5) `GRANT UPDATE(tiempo,diccion) … TO doc WITH GRANT
OPTION`, (6) `GRANT DELETE … TO doc`.

### 1.a

**Consigna.** Grafo de permisos de las seis sentencias; analizar cada una y si alguna da error.

**Resolución — Teoría.**

| # | Quién | ¿Puede? | Por qué | Nodo creado |
| :---: | --- | :---: | --- | --- |
| 1 | `db_exp` | ✓ | owner, `SELECT**` | `adm·SELECT*` |
| 2 | `db_exp` | ✓ | owner, `UPDATE**` | `adm·UPDATE*` (todas las columnas) |
| 3 | `db_exp` | ✓ | owner; se otorga sin grant option | `adm·DELETE` |
| 4 | `adm` | ✓ | tiene `SELECT*` | `doc·SELECT` |
| 5 | `adm` | ✓ | `UPDATE*` de tabla incluye cada columna con `*`; puede ceder un subconjunto | `doc·UPDATE(tiempo,diccion)*` |
| 6 | `adm` | ✗ **error** | tiene `DELETE` sin grant option: puede borrar, no autorizar a otro | ninguno |

```
db_exp·SELECT** ──(1)──► adm·SELECT* ──(4)──► doc·SELECT
db_exp·UPDATE** ──(2)──► adm·UPDATE* ──(5)──► doc·UPDATE(tiempo,diccion)*
db_exp·DELETE** ──(3)──► adm·DELETE  ──(6)──✗ (no se crea doc·DELETE)
```

**Resolución — MySQL.** Las seis sentencias pasan, sin error (✓ corrido). El `GRANT OPTION` es una
marca por (cuenta, tabla): la sentencia 1 se la da a `adm` sobre `parrafo`, y con esa marca `adm`
puede ceder cualquier privilegio que tenga ahí, incluido `DELETE`. Estado resultante:

```
GRANT SELECT, UPDATE, DELETE ON experimento.parrafo TO 'adm'@'%' WITH GRANT OPTION
GRANT SELECT, UPDATE (diccion, tiempo), DELETE ON experimento.parrafo TO 'doc'@'%' WITH GRANT OPTION
```

Por la misma razón, `doc` puede re-otorgar el `SELECT` que recibió sin grant option (✓ corrido).

### 1.b

**Consigna.** Qué permisos conserva `doc` si `db_exp` ejecuta `REVOKE SELECT ON parrafo FROM adm
CASCADE;` y `REVOKE UPDATE(tiempo) ON parrafo FROM adm CASCADE;` (desde la teoría).

**Resolución — Teoría.**

1. Primer `REVOKE`: se borra `adm·SELECT*`; `doc·SELECT` queda sin camino al owner y cae en cascada.
2. Segundo `REVOKE`: el `UPDATE` de tabla de `adm` equivale al conjunto de `UPDATE` por columna; se le
   quita `tiempo` y conserva el resto con `*`. En cascada, `doc` pierde `UPDATE(tiempo)` y conserva
   `UPDATE(diccion)*`.

| Estado de `doc` | Privilegios |
| --- | --- |
| Antes | `SELECT`, `UPDATE(tiempo, diccion)*` |
| Tras el 1er `REVOKE` | `UPDATE(tiempo, diccion)*` |
| Tras el 2do `REVOKE` | **`UPDATE(diccion)` con grant option**, nada más |

`DELETE` nunca lo tuvo (la sentencia 6 falló).

**Resolución — MySQL.** `CASCADE` da `ERROR 1064` (sintaxis). Sin `CASCADE`, `REVOKE SELECT … FROM
adm` corre pero `doc` conserva su `SELECT`: MySQL no registra quién otorgó qué y no propaga. `REVOKE
UPDATE(tiempo) … FROM adm` falla con `ERROR 1147 There is no such grant defined`: MySQL no descompone
un privilegio de tabla en columnas. Resultado: `doc` conserva todo (`SELECT`, `UPDATE(tiempo,
diccion)`, `DELETE` y la marca de grant). ✓ Corrido.

## Ejercicio 2

**Consigna general.** Sobre Voluntarios, `U0` (administrador) ejecuta en orden los ítems con las
sentencias de MySQL; explicar si alguno no puede ejecutarse y resolver desde la teoría lo que MySQL no
provee. Se asume `USE voluntarios` y cuentas `'Un'@'%'`.

### 2.a

**Consigna.** A U1, todos los privilegios sobre `INSTITUCION`, con posibilidad de cederlos.

**Resolución.**

```sql
GRANT ALL PRIVILEGES ON voluntarios.institucion TO 'U1'@'%' WITH GRANT OPTION;
```

Igual en teoría y en MySQL. `ALL` no incluye el grant option: hace falta la cláusula.

### 2.b

**Consigna.** Que U2 consulte `VOLUNTARIO`.

**Resolución.**

```sql
GRANT SELECT ON voluntarios.voluntario TO 'U2'@'%';
```

### 2.c

**Consigna.** Que U2 pueda autorizar a U3 a insertar en `VOLUNTARIO`.

**Resolución.** U2 tiene que tener `INSERT` con grant option; son dos sentencias de dos usuarios:

```sql
-- U0
GRANT INSERT ON voluntarios.voluntario TO 'U2'@'%' WITH GRANT OPTION;
-- U2, en su sesión
GRANT INSERT ON voluntarios.voluntario TO 'U3'@'%';
```

**Teoría:** U2 queda con `INSERT*` y `SELECT` (sin `*`): puede ceder el `INSERT` y no el `SELECT`.
**MySQL:** U2 recibe la marca de grant sobre `voluntario` y puede ceder también el `SELECT` (✓ corrido:
`GRANT SELECT … TO 'U3'@'%'` ejecutado por U2 pasa).

### 2.d

**Consigna.** Dar a todos los usuarios inserción y actualización sobre `TAREA`. ¿Qué cambia con o sin
`WITH GRANT OPTION`?

**Resolución — Teoría.**

```sql
GRANT INSERT, UPDATE ON tarea TO PUBLIC;
```

`PUBLIC` representa a todos los usuarios, presentes y futuros. Sin `WITH GRANT OPTION`, todos pueden
insertar y actualizar, pero solo U0 decide quién más. Con la cláusula, cualquier usuario puede
otorgar esos privilegios a otros: aparecen aristas usuario → usuario en el grafo y se pierde el
control centralizado (un `REVOKE … RESTRICT` posterior fallaría por tener dependientes).

**Resolución — MySQL.** `PUBLIC` no existe: `GRANT … TO PUBLIC` lo toma como una cuenta llamada
`PUBLIC` y falla con `ERROR 1410` (✓ corrido). Sustituto equivalente, un rol obligatorio:

```sql
CREATE ROLE 'todos_tarea';
GRANT INSERT, UPDATE ON voluntarios.tarea TO 'todos_tarea';
SET PERSIST mandatory_roles = 'todos_tarea';
SET PERSIST activate_all_roles_on_login = ON;
```

✓ Corrido: U4, creada después, recibe `UPDATE ON voluntarios.tarea` por el rol. La otra opción,
`GRANT … TO 'U1'@'%', 'U2'@'%', 'U3'@'%'`, no cubre usuarios futuros.

### 2.e

**Consigna.** Retirarle a U1 el borrado sobre `INSTITUCION`.

**Resolución.**

```sql
REVOKE DELETE ON voluntarios.institucion FROM 'U1'@'%';
```

✓ Corre. U1 conserva el resto de `ALL` y el grant option (`SHOW GRANTS` pasa a listar los privilegios
sin `DELETE`). **Teoría:** si U1 hubiera cedido `DELETE`, el `REVOKE` iría con `CASCADE` (arrastra a
los beneficiarios) o `RESTRICT` (falla). **MySQL:** los beneficiarios lo conservarían.

### 2.f

**Consigna.** Quitar la inserción sobre `TAREA` a todos. ¿Quién podría insertar entonces?

**Resolución.**

```sql
-- Teoría
REVOKE INSERT ON tarea FROM PUBLIC;
-- MySQL (con el rol de 2.d)
REVOKE INSERT ON voluntarios.tarea FROM 'todos_tarea';
```

✓ Corrido: el rol queda solo con `UPDATE`. Puede insertar **solo U0** (el administrador; en la teoría,
además, el owner), porque ningún otro usuario recibió `INSERT` sobre `TAREA` por otro camino. Si 2.d
se hizo con grant option y alguien re-otorgó `INSERT`: en la teoría el `CASCADE` lo arrastra; en
MySQL esa concesión sobrevive.

### 2.g

**Consigna.** Crear el rol `ins_vol` que actualice `horas_aportadas` de `VOLUNTARIO`.

**Resolución.**

```sql
CREATE ROLE 'ins_vol';
GRANT UPDATE (horas_aportadas) ON voluntarios.voluntario TO 'ins_vol';
```

✓ Corre (privilegio por columna a un rol).

### 2.h

**Consigna.** Crear U4 y asignarle el rol `ins_prov`; también a U3.

**Resolución.** **No puede ejecutarse como está**: el rol creado en g es `ins_vol`; `ins_prov` no
existe.

```sql
CREATE USER 'U4'@'%' IDENTIFIED BY 'u4';     -- ✓
GRANT 'ins_prov' TO 'U4'@'%', 'U3'@'%';      -- ✗ ERROR 3523: Unknown authorization ID `ins_prov`@`%`
```

Para seguir hay que declarar una lectura: (A) errata, se asigna `ins_vol`; o (B) se crea antes
`CREATE ROLE 'ins_prov'` (vacío). En los dos casos, en MySQL falta activar el rol:

```sql
GRANT 'ins_prov' TO 'U4'@'%', 'U3'@'%';           -- tras CREATE ROLE (lectura B)
SET DEFAULT ROLE 'ins_prov' TO 'U4'@'%', 'U3'@'%';
```

(atención) ✓ Corrido: sin `SET DEFAULT ROLE`, `CURRENT_ROLE()` de U4 no incluye el rol y su `UPDATE`
da `ERROR 1142`. Además, un `UPDATE … WHERE nro_voluntario = …` exige `SELECT` sobre la columna del
`WHERE` (`ERROR 1143`).

### 2.i

**Consigna.** Que el rol `ins_prov` también actualice `nombre` de `VOLUNTARIO`.

**Resolución.**

```sql
GRANT UPDATE (nombre) ON voluntarios.voluntario TO 'ins_prov';
```

✓ Corre si el rol existe. Lo ven al instante todos los que tienen el rol activo. Con la lectura A el
rol queda con `UPDATE (horas_aportadas, nombre)`; con la B, solo `UPDATE (nombre)`.

### 2.j

**Consigna.** Eliminar el rol `ins_prov`. ¿Qué pasa con U3 y U4?

**Resolución.**

```sql
DROP ROLE 'ins_prov';
```

Los usuarios **no se borran**; el rol se revoca de todas las cuentas y pierden solo lo que les llegaba
por él (igual en teoría y en MySQL; ✓ corrido):

| Usuario | Después del `DROP ROLE` |
| --- | --- |
| U3 | conserva sus privilegios directos sobre `voluntario` (`INSERT` de 2.c; en MySQL también el `SELECT` que le cedió U2) |
| U4 | nada: `SHOW GRANTS` muestra solo `GRANT USAGE ON *.*` (puede conectarse, no puede operar) |

## Ejercicio 3

**Consigna general.** El usuario A crea `USUARIO(nro_u, nombre, tarea)` y ejecuta: `GRANT INSERT …
TO B WITH GRANT OPTION`, `GRANT SELECT … TO B WITH GRANT OPTION`, `GRANT SELECT … TO C`.

```
A·INSERT** ──► B·INSERT*
A·SELECT** ──► B·SELECT*
A·SELECT** ──► C·SELECT
```

(nota) En MySQL, `A.usuario` es "tabla `usuario` de la base `A`", no "de la cuenta A"; se reproduce
creando una base `A`.

### 3.a

**Consigna.** Quiénes pueden ejecutar: (1) `SELECT * FROM A.usuario WHERE nro_u='C'`, (2) `INSERT
INTO A.usuario VALUES ('C','Gerente','Control')`, (3) `GRANT SELECT ON A.usuario TO D`.

**Resolución.**

| # | Pueden | No pueden | Por qué |
| :---: | --- | --- | --- |
| 1 | A, B, C | D | leer solo pide `SELECT`, con o sin grant option |
| 2 | A, B | C, D | solo ellos tienen `INSERT` |
| 3 | A, B | C, D | C tiene `SELECT` sin grant option: puede leer, no ceder |

✓ Igual en MySQL (corrido con cada cuenta: C recibe `ERROR 1142 GRANT command denied`). (atención)
La comilla de `‘Control’` en el PDF es tipográfica y da `ERROR 1064`; hay que escribir `'Control'`.

### 3.b

**Consigna.** ¿Se pueden ejecutar? (1) B: `GRANT INSERT ON usuario TO D;` (2) A: `REVOKE INSERT ON
usuario FROM B CASCADE;`

**Resolución.**

1. ✓ **Sí.** B tiene `INSERT*`. Se crea `D·INSERT` desde `B·INSERT*`. (MySQL: ✓ corre.)
2. **Teoría:** ✓ **sí**; A otorgó ese `INSERT` y puede revocarlo. Se borra `B·INSERT*` y, en cascada,
   `D·INSERT`, que solo dependía de él. `B·SELECT*` no se toca. **MySQL:** ✗ `CASCADE` da
   `ERROR 1064`; sin la palabra, `REVOKE INSERT ON A.usuario FROM 'B'@'%'` corre, B pierde `INSERT` y
   **D lo conserva** (✓ corrido).

### 3.c

**Consigna.** Qué permisos conservan los usuarios después de lo anterior.

**Resolución.** (Supuesto: el `GRANT … TO D` de a.3 era hipotético y no se ejecutó.)

| Usuario | Teoría | MySQL |
| --- | --- | --- |
| A | todos, como owner | todos los de la base `A` |
| B | `SELECT*` | `SELECT` con grant option |
| C | `SELECT` | `SELECT` |
| D | nada (su `INSERT` cayó en cascada) | `INSERT` (nada lo propaga) |

```
Grafo final (teoría)
A·SELECT** ──► B·SELECT*
A·SELECT** ──► C·SELECT
```

## Enlaces

- Análisis largo: [[Práctica 2026-09-08|Práctica del 08/09 — TP8]]
- Teórica: [[Clase 11 - Seguridad-Transacciones|Clase 11]] (slides 8–13)
- Concepto: [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]]
- Motor: [[MySQL]] · [[PostgreSQL]] (tiene owner, `PUBLIC` y `REVOKE … CASCADE`)
