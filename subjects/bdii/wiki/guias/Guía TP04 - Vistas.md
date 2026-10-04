---
tipo: guia
unidad: 1
orden: 5
tema: "TP4 - Vistas"
resumen: "TP4 de vistas resuelto y corrido en MySQL 9.7.2: actualizabilidad (σ-π, σ-π-⋈, clave preservada), efecto de WITH CHECK OPTION en INSERT y UPDATE, LOCAL vs. CASCADED en cadena con la matriz completa, y los tres casos de vistas de ensamble según dónde cae la FK."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 4 Vistas.pdf"
  - "raw/Unidad-01/Practica/esq_peliculas.sql"
estado: procesado
---

# Guía TP04 — Vistas

## Resumen general

El TP4 trabaja la actualizabilidad de vistas y la opción `WITH CHECK OPTION` (WCO). Los ejercicios 1 y
2 usan un esquema propio de proveedores, artículos y envíos que hay que crear a mano (el enunciado solo
lo da como diagrama); los ejercicios 3, 4 y 5 reutilizan el esquema de películas del TP3
(`esq_peliculas.sql`). Todo lo de esta guía se corrió en MySQL 9.7.2.

La regla de la cátedra (estándar SQL): una vista es actualizable si es **σ-π** sobre una tabla y
**conserva la clave**, sin agregación, `DISTINCT` ni subconsultas en el `SELECT`; una vista **σ-π-⋈**
lo es respecto de la tabla cuya clave se preserva. Que una vista sea actualizable no garantiza que la
operación proceda: las restricciones de la tabla base (PK, FK, `NOT NULL`, `CHECK`) siguen valiendo. La
WCO rechaza solo lo que haría **migrar** una fila fuera de la vista.

Trampas del TP: un `INSERT` por una vista que no proyecta una columna `NOT NULL` sin `DEFAULT` falla
aunque la vista sea actualizable (2.a, 3.a); `Departamento_dist_200` deja afuera media clave compuesta;
en el 3.b la respuesta es la violación de unicidad, no la falta de actualizabilidad; la palabra clave es
`CASCADED` (con D) y va como `WITH CASCADED CHECK OPTION`; el 4.e del enunciado escribe
`nro_incripcion` (la columna es `nro_inscripcion`); y los sufijos `_1` / `_2` del ejercicio 5 no son
números de caso.

(atención) MySQL es **más permisivo** que el criterio de la cátedra: marca como actualizables vistas
que no conservan la clave (`DETALLE_ENVIOS`, `Departamento_dist_200`) y vistas con `JOIN`, siempre que
cada sentencia toque una sola tabla base. En el parcial se responde con el criterio de la cátedra; esta
guía indica, además, qué hace el motor.

## Setup

Esquema de los ejercicios 1 y 2 (transcripto del diagrama de la página 1), con dos proveedores y dos
artículos para que los `INSERT` del ejercicio 1 no fallen por FK:

```sql
CREATE TABLE PROVEEDOR (
  id_proveedor VARCHAR(10) NOT NULL,
  nombre       VARCHAR(30) NOT NULL,
  rubro        VARCHAR(15) NOT NULL,
  ciudad       VARCHAR(30) NOT NULL,
  PRIMARY KEY (id_proveedor)
);
CREATE TABLE ARTICULO (
  id_articulo VARCHAR(10)  NOT NULL,
  descrip     VARCHAR(30)  NOT NULL,
  peso        NUMERIC(5,2) NOT NULL,
  ciudad      VARCHAR(30)  NOT NULL,
  PRIMARY KEY (id_articulo)
);
CREATE TABLE ENVIO (
  id_proveedor VARCHAR(10)  NOT NULL,
  id_articulo  VARCHAR(10)  NOT NULL,
  cantidad     NUMERIC(5,0) NOT NULL,
  PRIMARY KEY (id_proveedor, id_articulo),
  FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor),
  FOREIGN KEY (id_articulo)  REFERENCES ARTICULO(id_articulo)
);
INSERT INTO PROVEEDOR VALUES ('P1','Prov Uno','Alimentos','Tandil'), ('P2','Prov Dos','Agro','Azul');
INSERT INTO ARTICULO  VALUES ('A1','Tornillo',1.50,'Tandil'), ('A2','Tuerca',0.50,'Azul');
```

Para los ejercicios 3 a 5, cargar `raw/Unidad-01/Practica/esq_peliculas.sql` como en la
[[Guía TP03 - SQL avanzados|Guía TP03 — SQL avanzados]]. En MySQL, la columna `IS_UPDATABLE` de
`information_schema.VIEWS` dice qué vistas acepta el motor como actualizables.

---

## Ejercicio 1 — ENVIOS500 y derivadas

### 1.a
**Consigna:** vista `ENVIOS500` con los envíos de 500 unidades o más (desde `ENVIO`); ¿es
actualizable?
**Resolución:**
```sql
CREATE VIEW ENVIOS500 AS
SELECT * FROM ENVIO
WHERE cantidad >= 500;
```
✓ Actualizable: σ-π sobre una sola tabla, conserva la PK compuesta `(id_proveedor, id_articulo)`, sin
agregación, `DISTINCT` ni subconsultas.

### 1.b
**Consigna:** vista `ENVIOS500_999` con los envíos de entre 500 y 999 unidades, a partir de
`ENVIOS500`; ¿es actualizable?
**Resolución:**
```sql
CREATE VIEW ENVIOS500_999 AS
SELECT * FROM ENVIOS500
WHERE cantidad < 1000;
```
✓ Actualizable: en una cadena `T → V1 → V2`, V2 es actualizable si V1 lo es y V2 cumple las mismas
condiciones sobre V1. Aquí las dos cumplen.

### 1.c
**Consigna:** vista `DETALLE_ENVIOS` con, para cada envío de más de 500 unidades, descripción y peso
del artículo, nombre del proveedor y cantidad (desde `PROVEEDOR`, `ARTICULO` y `ENVIOS500`); ¿es
actualizable?
**Resolución:**
```sql
CREATE VIEW DETALLE_ENVIOS AS
SELECT A.descrip, A.peso, P.nombre, E.cantidad
FROM ENVIOS500 E
  JOIN ARTICULO  A ON E.id_articulo  = A.id_articulo
  JOIN PROVEEDOR P ON E.id_proveedor = P.id_proveedor
WHERE E.cantidad > 500;
```
✗ No actualizable (criterio de la cátedra): es σ-π-⋈ pero no proyecta `id_proveedor` ni
`id_articulo`, así que no conserva la clave de ninguna tabla base. El motivo es la clave perdida, no
el join.
(atención) MySQL la marca `IS_UPDATABLE = YES`: un `UPDATE DETALLE_ENVIOS SET cantidad = 600`
procede y modifica `ENVIO`. El `INSERT` falla: sin lista de columnas, `ERROR 1394 Can not insert
into join view … without fields list`; con lista (`INSERT INTO DETALLE_ENVIOS (cantidad) …`),
`ERROR 1423 … doesn't have a default value`, porque no puede llenar la PK de `ENVIO`.

### 1.i a 1.iv — efecto de las operaciones sobre ENVIOS500

**Consigna:** determinar el efecto de cada operación sobre `ENVIOS500`, sin y con `WITH CHECK OPTION`.
**Resolución:** para la versión con WCO:
```sql
CREATE OR REPLACE VIEW ENVIOS500 AS
SELECT * FROM ENVIO WHERE cantidad >= 500
WITH CHECK OPTION;
```

| # | Operación | Sin WCO | Con WCO |
| --- | --- | --- | --- |
| i | `INSERT INTO ENVIOS500 VALUES ('P1','A1',500);` | ✓ procede; la fila se ve en la vista | ✓ procede |
| ii | `INSERT INTO ENVIOS500 VALUES ('P2','A2',300);` | ✓ procede: la fila queda en `ENVIO` pero no se ve en la vista | ✗ `ERROR 1369 CHECK OPTION failed` |
| iii | `UPDATE ENVIOS500 SET cantidad=1000 WHERE id_proveedor='P1';` | ✓ procede; la fila sigue en la vista | ✓ procede |
| iv | `UPDATE ENVIOS500 SET cantidad=100 WHERE id_proveedor='P1';` | ✓ procede; la fila sale de la vista | ✗ `ERROR 1369 CHECK OPTION failed` |

La WCO solo rechaza lo que deja la fila fuera de la condición de la vista (ii y iv). Sin WCO, la fila
del ii "desaparece": se insertó a través de la vista pero no pertenece a ella. Si `P1`, `A1`, `P2` o
`A2` no existieran en las tablas padre, los `INSERT` fallarían antes por FK (`ERROR 1452`), con o sin
WCO.

---

## Ejercicio 2 — buenos_proveedores

```sql
CREATE VIEW buenos_proveedores (prov, rub, ciudad) AS
SELECT id_proveedor, rubro, ciudad
FROM PROVEEDOR
WHERE rubro IN ('Alimentos', 'Agro', 'Salud', 'Farmacia')
WITH CHECK OPTION;
```
Es actualizable (σ-π, conserva la PK como `prov`), requisito para usar WCO. Sin opción explícita, la
WCO es `CASCADED`.

### 2.a
**Consigna:** `INSERT INTO buenos_proveedores (prov, rub, ciudad) VALUES ('10','Farmacia','Paris');`
**Resolución:** ✗ falla con `ERROR 1423: Field of view 'buenos_proveedores' underlying table doesn't
have a default value`. No es la WCO (`'Farmacia'` está en la lista): la vista no proyecta `nombre`, que
es `NOT NULL` sin `DEFAULT`, y el `INSERT` no tiene con qué llenarla.

### 2.b
**Consigna:** repetir el `INSERT` después de hacer que `nombre` acepte nulos.
**Resolución:**
```sql
ALTER TABLE PROVEEDOR MODIFY nombre VARCHAR(30) NULL;
INSERT INTO buenos_proveedores (prov, rub, ciudad) VALUES ('10','Farmacia','Paris');
```
✓ Procede: `PROVEEDOR` queda con la fila `('10', NULL, 'Farmacia', 'Paris')`, visible en la vista.

### 2.c
**Consigna:** `UPDATE buenos_proveedores SET rub = 'Educación' WHERE prov = '10';`
**Resolución:** ✗ `ERROR 1369 CHECK OPTION failed`. `'Educación'` no está en la lista: la fila
dejaría de pertenecer a la vista (migraría), y la WCO lo impide.

### 2.d
**Consigna:** `INSERT INTO buenos_proveedores (prov, rub, ciudad) VALUES ('8','Deportes','Roma');`
**Resolución:** ✗ `ERROR 1369 CHECK OPTION failed`. `'Deportes'` no cumple la condición: la fila
insertada no sería visible en la vista. Como `nombre` ya acepta nulos, el rechazo es solo de la WCO.

---

## Ejercicio 3 — esquema de películas

```sql
CREATE VIEW Distribuidor_200 AS
SELECT id_distribuidor, nombre, tipo
FROM distribuidor
WHERE id_distribuidor > 200;

CREATE VIEW Departamento_dist_200 AS
SELECT id_departamento, nombre_departamento, id_ciudad, jefe_departamento
FROM departamento
WHERE id_distribuidor > 200;
```

### 3.a
**Consigna:** discutir si las vistas son actualizables y justificar.
**Resolución:**

| Vista | PK de la tabla base | ¿Conserva la clave? | Veredicto |
| --- | --- | --- | --- |
| `Distribuidor_200` | `(id_distribuidor)` | ✓ | ✓ actualizable (σ-π) |
| `Departamento_dist_200` | `(id_distribuidor, id_departamento)` | ✗ falta `id_distribuidor` | ✗ no actualizable |

(clave) La diferencia es la PK compuesta: `Departamento_dist_200` proyecta `id_departamento` pero no
`id_distribuidor`, y varias filas quedan indistinguibles (en el dataset, `id_departamento = 1` aparece
para los distribuidores 1, 3, 5 y 7).
`Distribuidor_200` es actualizable, pero un `INSERT` por ella falla igual
(`ERROR 3819 Check constraint 'distribuidor_direccion_check' is violated`): no proyecta `direccion`,
que tiene `CHECK (direccion IS NOT NULL)`. `UPDATE` y `DELETE` proceden.
(atención) MySQL marca `Departamento_dist_200` como actualizable: con dos departamentos `(300,1)` y
`(301,1)`, `UPDATE Departamento_dist_200 SET nombre_departamento='Cambiado' WHERE id_departamento=1`
modificó las **dos** filas, que desde la vista no se pueden distinguir. Es justamente el problema que
el criterio de clave preservada evita.

### 3.b
**Consigna:** con `distribuidor` conteniendo 1049 y 1050, y la vista
`Distribuidor_1000` (`SELECT * FROM distribuidor WHERE id_distribuidor > 1000`), ¿qué pasa con
`INSERT INTO Distribuidor_1000 VALUES (1050,'NuevoDistribuidor 1050','Montiel 340','569842-2643','N');`?
**Resolución:** ✓ opción correcta: **falla porque, si bien la vista es actualizable, viola una
restricción de integridad de unicidad.** Corrido: `ERROR 1062 Duplicate entry '1050' for key
'distribuidor.PRIMARY'`.

| Opción | Veredicto |
| --- | --- |
| Falla porque la vista no es actualizable | ✗ `SELECT *` sobre una tabla: σ-π, conserva la PK |
| Falla por integridad referencial | ✗ `distribuidor` no tiene FK salientes |
| Falla por integridad de unicidad | ✓ `id_distribuidor` es PK y 1050 ya existe |
| Procede exitosamente | ✗ |

La fila cumple `1050 > 1000`, así que la condición de la vista no interviene.
(nota) El dataset tiene distribuidores 1 a 7: para reproducirlo hay que insertar antes 1049 y 1050.

---

## Ejercicio 4 — crear y clasificar vistas

### 4.a
**Consigna:** vista `EMPLEADO_DIST_20` con `id_empleado`, nombre, apellido, sueldo y
`fecha_nacimiento` de los empleados del distribuidor 20.
**Resolución:**
```sql
CREATE VIEW EMPLEADO_DIST_20 AS
SELECT id_empleado, nombre, apellido, sueldo, fecha_nacimiento
FROM empleado
WHERE id_distribuidor = 20;
```
σ-π, ✓ actualizable: una tabla, conserva la PK `id_empleado`. El `INSERT` falla igual
(`ERROR 3819`, `empleado_e_mail_check`): `e_mail` e `id_tarea` tienen `CHECK … IS NOT NULL` y quedan
fuera de la proyección.

### 4.b
**Consigna:** sobre `EMPLEADO_DIST_20`, vista `EMPLEADO_DIST_20_80` con los nacidos entre 1980 y 1989.
**Resolución:**
```sql
CREATE VIEW EMPLEADO_DIST_20_80 AS
SELECT * FROM EMPLEADO_DIST_20
WHERE fecha_nacimiento BETWEEN '1980-01-01' AND '1989-12-31';
```
σ-π, ✓ actualizable: se apoya en una vista actualizable y conserva su clave.

### 4.c
**Consigna:** controles y comportamiento ante actualizaciones si las vistas tienen `WITH CHECK OPTION`
`LOCAL` o `CASCADED`; evaluar todas las alternativas.
**Resolución:** la sintaxis correcta es `WITH LOCAL CHECK OPTION` / `WITH CASCADED CHECK OPTION`
(el enunciado escribe "CASCADE"). Reglas:

- **`CASCADED`** (default): chequea la condición de la vista **y la de todas las vistas de abajo**,
  tengan o no WCO propia.
- **`LOCAL`**: chequea la condición de la vista; de las vistas de abajo, solo las que tienen WCO
  propia.
- **Sin WCO**: la vista no chequea nada propio; las de abajo chequean según su propia opción.

Matriz corrida en MySQL (V1 = `EMPLEADO_DIST_20`, condición `id_distribuidor = 20`; V2 =
`EMPLEADO_DIST_20_80`, condición década del 80). ✓ = procede, ✗ = `ERROR 1369`:

| V1 | V2 | Por V2, viola década | Por V2, viola distribuidor | Por V1, viola distribuidor | Por V1, viola década |
| --- | --- | --- | --- | --- | --- |
| sin WCO | sin WCO | ✓ | ✓ | ✓ | ✓ |
| sin WCO | `LOCAL` | ✗ | ✓ | ✓ | ✓ |
| sin WCO | `CASCADED` | ✗ | ✗ | ✓ | ✓ |
| `LOCAL` | sin WCO | ✓ | ✗ | ✗ | ✓ |
| `LOCAL` | `LOCAL` | ✗ | ✗ | ✗ | ✓ |
| `LOCAL` | `CASCADED` | ✗ | ✗ | ✗ | ✓ |
| `CASCADED` | sin WCO | ✓ | ✗ | ✗ | ✓ |
| `CASCADED` | `LOCAL` | ✗ | ✗ | ✗ | ✓ |
| `CASCADED` | `CASCADED` | ✗ | ✗ | ✗ | ✓ |

Lectura: por V2, la condición de la década se controla solo si V2 tiene WCO; la del distribuidor se
controla si V2 es `CASCADED` o si V1 tiene WCO propia (`LOCAL` o `CASCADED`). Por V1, la década nunca
se controla: V1 no conoce la condición de V2.
Cómo se viola cada condición: la década, con un `UPDATE … SET fecha_nacimiento = '1975-01-01'`; el
distribuidor, solo con un `INSERT`, porque `id_distribuidor` no está proyectada y queda en `NULL`
(`NULL = 20` no es verdadero).
(atención) Sobre el `empleado` real, todo `INSERT` por estas vistas falla antes por el `CHECK` de
`e_mail` (`ERROR 3819`), así que en la práctica solo se observa la fila de los `UPDATE`. La matriz se
corrió sobre una copia de `empleado` sin esos `CHECK`, para aislar el efecto de la WCO.

### 4.d
**Consigna:** vista `PELICULAS_ENTREGADAS` con el código de cada película y la cantidad de unidades
entregadas.
**Resolución:**
```sql
CREATE VIEW PELICULAS_ENTREGADAS (codigo_pelicula, unidades) AS
SELECT codigo_pelicula, SUM(cantidad)
FROM renglon_entrega
GROUP BY codigo_pelicula;
```
Ni σ-π ni σ-π-⋈: tiene agregación. ✗ No actualizable: un valor de `unidades` no se puede repartir de
una sola forma entre los renglones (la película 10005 suma 11 en tres entregas). Corrido:
`IS_UPDATABLE = NO` y `UPDATE … SET unidades = 700` da `ERROR 1288 … is not updatable`.

### 4.e
**Consigna:** vista `DISTRIBUIDORAS_NACIONALES` con los datos completos de las distribuidoras
nacionales (incluir inscripción y encargado).
**Resolución:**
```sql
CREATE VIEW DISTRIBUIDORAS_NACIONALES AS
SELECT d.id_distribuidor, d.nombre, d.direccion, d.telefono, d.tipo,
       n.nro_inscripcion, n.encargado, n.id_distrib_mayorista
FROM distribuidor d
  JOIN nacional n ON d.id_distribuidor = n.id_distribuidor;
```
σ-π-⋈ por el par FK → PK `nacional.id_distribuidor → distribuidor.id_distribuidor`. Es el Caso (1),
tipo-subtipo (FK ≡ K): ✓ actualizable, con la clave preservada `id_distribuidor`. Devuelve los
distribuidores 1, 3, 5 y 7.
(atención) El enunciado escribe `nro_incripcion`: copiado así da `ERROR 1054 Unknown column`. La
columna es `nro_inscripcion`.
En MySQL, un `UPDATE` que toca columnas de una sola tabla procede (`SET encargado = 'Nuevo'`); uno que
toca las dos (`SET encargado = …, nombre = …`) da `ERROR 1393 Can not modify more than one base table
through a join view`.

---

## Ejercicio 5 — vistas de ensamble

```sql
CREATE VIEW CIUDAD_KP_1 AS
SELECT id_ciudad, nombre_ciudad, C.id_pais, nombre_pais
FROM ciudad C NATURAL JOIN pais P;

CREATE VIEW ENTREGAS_KP_2 AS
SELECT nro_entrega, re.codigo_pelicula, cantidad, titulo
FROM renglon_entrega re NATURAL JOIN pelicula P;
```
Los dos `NATURAL JOIN` unen por una sola columna común (`id_pais` y `codigo_pelicula`), así que hacen
el join esperado.

Casos según dónde cae la FK (deck 07): **(1)** FK ≡ K, tipo-subtipo; **(2)** FK en atributos no clave
(FK ∩ K = ∅), relaciones 1:1 o N:1; **(3)** FK ⊂ K, relaciones N:N o entidad débil.

### 5.a
**Consigna:** ¿a qué caso (1, 2 o 3) corresponde cada vista?
**Resolución:**
- `CIUDAD_KP_1` → **Caso (2)**: la FK `ciudad.id_pais` no forma parte de la PK `id_ciudad`
  (relación N:1 ciudad → país).
- `ENTREGAS_KP_2` → **Caso (3)**: la FK `renglon_entrega.codigo_pelicula` es parte de la PK
  `(nro_entrega, codigo_pelicula)` (relación N:N entre entrega y película).

Los sufijos `_1` y `_2` son numeración de las vistas, no el número de caso.

### 5.b
**Consigna:** clave preservada de cada vista y de qué tabla proviene.
**Resolución:**

| Vista | Clave preservada | Tabla |
| --- | --- | --- |
| `CIUDAD_KP_1` | `id_ciudad` | `ciudad` |
| `ENTREGAS_KP_2` | `(nro_entrega, codigo_pelicula)` | `renglon_entrega` |

En las dos se preserva la clave del lado que tiene la FK: cada fila de `ciudad` (o de
`renglon_entrega`) aparece a lo sumo una vez en la vista, mientras que un país (o una película) se
repite tantas veces como ciudades (o renglones) tenga. Las actualizaciones por la vista solo pueden
tocar esa tabla. En MySQL las dos figuran `IS_UPDATABLE = YES`.

---

## Enlaces

- Análisis completo y discusión de cada ítem: [[Práctica 2026-08-11|Práctica del 11/08]]
- Teóricas: [[Clase 06 - Vistas-Parte 1]] · [[Clase 07 - Vistas-Parte 2]]
- Hoja de referencia: [[1.06.01 - Vistas|Vistas]]
- Motor: [[MySQL]]
