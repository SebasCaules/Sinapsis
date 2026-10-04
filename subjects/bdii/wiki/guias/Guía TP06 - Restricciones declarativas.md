---
tipo: guia
unidad: 1
orden: 7
tema: Restricciones declarativas — RIR, acciones referenciales, matching, CHECK y ASSERTION
resumen: "TP6 resuelto: ALTER TABLE de las RIR, traza de cada operación con RESTRICT, CASCADE y SET NULL, matching simple, parcial y full, y la clasificación de nueve restricciones en CHECK o ASSERTION con su versión MySQL; trazas y CHECK verificados en MySQL 9.7.2."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 6 Restricciones Declarativas.pdf"
estado: procesado
---

# Guía TP06 — Restricciones declarativas

## Resumen general

El TP6 trabaja las restricciones de integridad que se declaran en el esquema, sin código: las de
integridad referencial (RIR, es decir, `FOREIGN KEY` con sus acciones) y las de `CHECK` y `ASSERTION`.
Los ejercicios 1 y 2 son trazas de lápiz y papel sobre dos esquemas gemelos, cada uno con dos FK hacia
la misma tabla; el ejercicio 3 clasifica nueve restricciones y las escribe en SQL estándar y en MySQL.

Se necesita la notación del enunciado (`R` = `RESTRICT`, `C` = `CASCADE`, `N` = `SET NULL`) y tres
preguntas para cada operación: ¿la operación es sobre la tabla referenciante (entonces solo se chequea
que la FK nueva exista) o sobre la referenciada? ¿Hay filas que referencien lo que se toca, en ese
momento? Si intervienen varias reglas y una es `RESTRICT`, gana ella, porque se evalúa antes que las
acciones reparadoras.

Trampas: en el ejercicio 1 las operaciones no son acumulativas y en el 2 sí, lo que cambia el
veredicto de dos operaciones; `SET NULL` en una modificación deja la referencia huérfana para siempre;
en matching, `SIMPLE` ignora la FK si hay algún nulo, `PARTIAL` chequea los valores no nulos y `FULL`
prohíbe mezclar nulos con no nulos. En el ejercicio 3 la regla es contar: una columna o una fila es
`CHECK`; varias filas de una tabla es `CHECK` con subconsulta; más de una tabla es `ASSERTION`. MySQL
soporta solo las dos primeras (sin subconsultas ni `ASSERTION`) y además ignora la cláusula `MATCH`. El
`_` de `LIKE 'S_%'` es comodín y hay que escaparlo.

Para el parcial: la traza con nombre de regla, la tabla de matching y la clasificación de restricciones.

## Setup

Los diagramas no dan tipos de dato; estos son elección propia y bastan para correr las trazas. Las FK
del ejercicio 1 se agregan en 1.a.

```sql
CREATE TABLE EMPLEADO (
  TipoE CHAR(1) NOT NULL, NroE INT NOT NULL,
  Nombre VARCHAR(40) NOT NULL, Cargo VARCHAR(40) NOT NULL,
  PRIMARY KEY (TipoE, NroE));
CREATE TABLE PROYECTO (
  IdProy INT NOT NULL PRIMARY KEY, NombreProy VARCHAR(40) NOT NULL,
  AnioComienzo INT NOT NULL, AnioFinal INT NULL);
CREATE TABLE TRABAJA_EN (
  TipoE CHAR(1) NOT NULL, NroE INT NOT NULL, IdProy INT NOT NULL,
  Anio INT NOT NULL, Mes INT NOT NULL,
  cant_horas INT NOT NULL, tarea VARCHAR(40) NOT NULL,
  PRIMARY KEY (TipoE, NroE, IdProy, Anio, Mes));
CREATE TABLE AUSPICIO (
  IdProy INT NOT NULL, NombreAuspiciante VARCHAR(40) NOT NULL,
  TipoE CHAR(1) NULL, NroE INT NULL,
  PRIMARY KEY (IdProy, NombreAuspiciante));
```

Relaciones: R1 `TRABAJA_EN(TipoE, NroE)` → `EMPLEADO`; R2 `TRABAJA_EN(IdProy)` → `PROYECTO`; R3
`AUSPICIO(IdProy)` → `PROYECTO`; R4 `AUSPICIO(TipoE, NroE)` → `EMPLEADO` (no identificante, admite
nulos).

## Ejercicio 1

Acciones: R1 borrado `C` / modificación `R`; R2 `R` / `C`; R3 `R` / `R`; R4 `N` / `R`.
Instancia: `EMPLEADO` (A,1) (B,2) (A,2) · `PROYECTO` 1, 2, 3 · `TRABAJA_EN` (A,1,1,…) (A,2,2,…) ·
`AUSPICIO` (2, Arcor, A, 2).

### 1.a

**Consigna:** escribir las `ALTER TABLE` que incorporan las cuatro RIR.

**Resolución:** la `ALTER TABLE` va siempre sobre la tabla referenciante.

```sql
ALTER TABLE TRABAJA_EN ADD CONSTRAINT R1
  FOREIGN KEY (TipoE, NroE) REFERENCES EMPLEADO (TipoE, NroE)
  ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE TRABAJA_EN ADD CONSTRAINT R2
  FOREIGN KEY (IdProy) REFERENCES PROYECTO (IdProy)
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE AUSPICIO ADD CONSTRAINT R3
  FOREIGN KEY (IdProy) REFERENCES PROYECTO (IdProy)
  ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE AUSPICIO ADD CONSTRAINT R4
  FOREIGN KEY (TipoE, NroE) REFERENCES EMPLEADO (TipoE, NroE)
  ON DELETE SET NULL ON UPDATE RESTRICT;
```

R4 puede ser `SET NULL` porque `AUSPICIO.TipoE` y `NroE` admiten nulos y no son parte de la PK.

### 1.b

**Consigna:** resultado de cada operación sobre la instancia original (no acumulativas); si se
rechaza, qué regla y por qué.

**Resolución:** las seis se corrieron en MySQL 9.7.2, cada una sobre la instancia original; el
resultado coincide con la traza.

| # | Operación | Resultado | Por qué |
| --- | --- | --- | --- |
| i | `DELETE FROM PROYECTO WHERE IdProy = 3;` | ✓ aceptada | Nadie referencia al proyecto 3 (`TRABAJA_EN` tiene 1 y 2; `AUSPICIO`, 2). `PROYECTO` queda {1, 2} |
| ii | `UPDATE PROYECTO SET IdProy = 7 WHERE IdProy = 3;` | ✓ aceptada | Mismo motivo. `PROYECTO` queda {1, 2, 7} |
| iii | `DELETE FROM PROYECTO WHERE IdProy = 1;` | ✗ rechazada por **R2** | `TRABAJA_EN (A,1,1,…)` referencia al proyecto 1 y R2 es `ON DELETE RESTRICT`. R3 no interviene |
| iv | `DELETE FROM EMPLEADO WHERE TipoE = 'A' AND NroE = 2;` | ✓ aceptada | **R1 `CASCADE`** borra `TRABAJA_EN (A,2,2,…)`; **R4 `SET NULL`** deja `AUSPICIO (2, Arcor, NULL, NULL)` |
| v | `UPDATE TRABAJA_EN SET IdProy = 3 WHERE IdProy = 1;` | ✓ aceptada | Es la tabla **referenciante**: no se dispara ninguna acción, solo se chequea R2 (el proyecto 3 existe) y la PK (no choca). `TRABAJA_EN` queda (A,1,3,…) (A,2,2,…) |
| vi | `UPDATE PROYECTO SET IdProy = 5 WHERE IdProy = 2;` | ✗ rechazada por **R3** | R2 querría propagar en cascada a `TRABAJA_EN (A,2,2,…)`, pero `AUSPICIO (2, …)` lo referencia y R3 es `ON UPDATE RESTRICT`. `RESTRICT` se evalúa antes que `CASCADE`: no se modifica nada |

(nota) En el enunciado, `TipoE = A` va sin comillas; debe ser `'A'`.

Errores que devolvió MySQL:

```text
iii: ERROR 1451 … CONSTRAINT `R2` FOREIGN KEY (`IdProy`) REFERENCES `PROYECTO` (`IdProy`) ON DELETE RESTRICT …
vi:  ERROR 1451 … CONSTRAINT `R3` FOREIGN KEY (`IdProy`) REFERENCES `PROYECTO` (`IdProy`) … ON UPDATE RESTRICT
```

### 1.c

**Consigna:** qué `INSERT` se aceptan o rechazan en `AUSPICIO` según el matching de R4 sea simple,
parcial o full.

**Resolución:** la FK es `(TipoE, NroE)` y `EMPLEADO` = {(A,1), (B,2), (A,2)}. Todos los `IdProy`
existen (R3 ✓) y ninguna PK choca, así que lo único que decide es R4.

| # | `INSERT INTO AUSPICIO VALUES (…)` | FK | Simple | Parcial | Full |
| --- | --- | --- | :---: | :---: | :---: |
| i | `(1, 'Dell', 'B', NULL)` | (B, NULL) | ✓ | ✓ | ✗ |
| ii | `(2, 'Oracle', NULL, NULL)` | (NULL, NULL) | ✓ | ✓ | ✓ |
| iii | `(3, 'Google', 'A', 3)` | (A, 3) | ✗ | ✗ | ✗ |
| iv | `(1, 'HP', NULL, 3)` | (NULL, 3) | ✓ | ✗ | ✗ |

- **Simple:** si alguna columna de la FK es nula, no se chequea; si ninguna lo es, el par debe existir.
- **Parcial:** los valores no nulos deben coincidir con alguna fila referenciada. En i, `B` existe en
  (B,2) ✓; en iv, ningún empleado tiene `NroE = 3` ✗.
- **Full:** o todas nulas o todas no nulas y existentes; mezclar es inválido (i y iv).
- iii falla en los tres: `A` existe y `3` no, y lo que se busca es el **par** (A,3) en una misma fila.

(atención) MySQL acepta `MATCH FULL` / `MATCH SIMPLE` en la sintaxis y lo ignora
(`information_schema.REFERENTIAL_CONSTRAINTS.MATCH_OPTION = NONE`): siempre se comporta como simple.
Corrido con `MATCH FULL` declarado, aceptó i, ii y iv, y rechazó iii.

## Ejercicio 2

Acciones: R1 `INSTALACION → CLIENTE` `C` / `R`; R2 `INSTALACION → SERVICIO` `R` / `R`; R3
`REFERENCIA → SERVICIO` `R` / `C`; R4 `REFERENCIA → CLIENTE` `R` / `N`.

```sql
CREATE TABLE CLIENTE (Zona CHAR(1) NOT NULL, NroC INT NOT NULL,
  Nombre VARCHAR(40) NOT NULL, Ciudad VARCHAR(10) NOT NULL, PRIMARY KEY (Zona, NroC));
CREATE TABLE SERVICIO (IdServ VARCHAR(5) NOT NULL PRIMARY KEY, NombreServ VARCHAR(40) NOT NULL,
  AnioComienzo INT NOT NULL, AnioFinal INT NULL);
CREATE TABLE INSTALACION (Zona CHAR(1) NOT NULL, NroC INT NOT NULL, IdServ VARCHAR(5) NOT NULL,
  Mes INT NOT NULL, Anio INT NOT NULL, CantHoras INT NOT NULL, Tarea VARCHAR(10) NOT NULL,
  PRIMARY KEY (Zona, NroC, IdServ, Mes, Anio),
  CONSTRAINT R1 FOREIGN KEY (Zona, NroC) REFERENCES CLIENTE (Zona, NroC)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT R2 FOREIGN KEY (IdServ) REFERENCES SERVICIO (IdServ)
    ON DELETE RESTRICT ON UPDATE RESTRICT);
CREATE TABLE REFERENCIA (IdServ VARCHAR(5) NOT NULL, Motivo VARCHAR(20) NOT NULL,
  Zona CHAR(1) NULL, NroC INT NULL, PRIMARY KEY (IdServ, Motivo),
  CONSTRAINT R3 FOREIGN KEY (IdServ) REFERENCES SERVICIO (IdServ)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT R4 FOREIGN KEY (Zona, NroC) REFERENCES CLIENTE (Zona, NroC)
    ON DELETE RESTRICT ON UPDATE SET NULL);

INSERT INTO CLIENTE VALUES ('A',1,'Juan Ro','C1'), ('A',2,'Alberto Efe','C1'),
  ('B',1,'Esteban Hache','C1'), ('C',2,'José Ge','C3'), ('D',3,'Luis Ene','C2');
INSERT INTO SERVICIO VALUES ('S1','Serv 1',2010,2012), ('S2','Serv 2',2012,2012), ('S3','Serv 3',2009,NULL);
INSERT INTO INSTALACION VALUES ('A',1,'S1',5,2011,5,'T1'), ('B',1,'S2',5,2012,7,'T1'),
  ('C',2,'S1',4,2010,9,'T2'), ('A',2,'S3',8,2009,6,'T2');
INSERT INTO REFERENCIA VALUES ('S1','Puntualidad','D',3), ('S2','Calidad inst.','C',2),
  ('S3','Costo','C',2), ('S1','Atención','D',3);
```

(nota) El diagrama dice `AnioFin` y la tabla de datos `AnioFinal`; no cambia ninguna respuesta.

### 2.a

**Consigna:** resultado de cada operación, ejecutadas en orden y **acumulativas**. Justificar.

**Resolución:** corrida en secuencia en MySQL 9.7.2; filas afectadas y errores coinciden con la traza.

| # | Operación | Resultado | Por qué |
| --- | --- | --- | --- |
| i | `DELETE FROM CLIENTE WHERE NroC = 1;` | ✓ aceptada (2 clientes) | Borra (A,1) y (B,1). **R1 `CASCADE`** borra `INSTALACION (A,1,S1,…)` y `(B,1,S2,…)`. R4 es `RESTRICT`, pero ninguna `REFERENCIA` apunta a (A,1) ni (B,1) |
| ii | `UPDATE INSTALACION SET IdServ = 'S5' WHERE IdServ = 'S2';` | ✓ aceptada, **0 filas** | La única instalación con S2 la borró la cascada de i. (Sobre la instancia original se rechazaría por R2: `S5` no existe en `SERVICIO`) |
| iii | `UPDATE CLIENTE SET Zona = 'Z' WHERE Zona = 'D';` | ✓ aceptada | (D,3) pasa a (Z,3). R1 `RESTRICT` no actúa (no hay instalaciones de (D,3)). **R4 `SET NULL`**: las dos `REFERENCIA` de (D,3) quedan con `Zona` y `NroC` en `NULL` |
| iv | `DELETE FROM SERVICIO WHERE IdServ = 'S3';` | ✗ rechazada por **R2 y R3** | `INSTALACION (A,2,S3,…)` lo referencia (R2 `RESTRICT`) y `REFERENCIA (S3, Costo, …)` también (R3 `RESTRICT`). No cambia nada |
| v | `UPDATE SERVICIO SET IdServ = 'S5' WHERE IdServ = 'S2';` | ✓ aceptada | R2 es `RESTRICT`, pero tras i ninguna instalación usa S2. **R3 `CASCADE`**: `REFERENCIA (S2, Calidad inst., C, 2)` pasa a S5. (Sobre la instancia original se rechazaría por R2) |

Estado final:

| Tabla | Filas |
| --- | --- |
| `CLIENTE` | (A,2,Alberto Efe,C1) · (C,2,José Ge,C3) · (Z,3,Luis Ene,C2) |
| `SERVICIO` | (S1,Serv 1,2010,2012) · (S3,Serv 3,2009,NULL) · (S5,Serv 2,2012,2012) |
| `INSTALACION` | (C,2,S1,4,2010,9,T2) · (A,2,S3,8,2009,6,T2) |
| `REFERENCIA` | (S1,Puntualidad,NULL,NULL) · (S1,Atención,NULL,NULL) · (S3,Costo,C,2) · (S5,Calidad inst.,C,2) |

(nota) En iv, MySQL informa solo la primera FK que falla (R2); borrando antes la instalación de S3,
el mismo `DELETE` falla por R3. Hay que nombrar las dos.

### 2.b

**Consigna:** proponer `INSERT` sobre `REFERENCIA` que cubran los casos de nulos en R4 y dar el
resultado con matching full, parcial y simple, sobre los datos iniciales.

**Resolución:** `CLIENTE` = {(A,1), (A,2), (B,1), (C,2), (D,3)}. Los cinco casos posibles de una FK
de dos columnas:

| # | `INSERT INTO REFERENCIA VALUES (…)` | FK | Caso | Simple | Parcial | Full |
| --- | --- | --- | --- | :---: | :---: | :---: |
| 1 | `('S1', 'Rapidez', 'A', 1)` | (A, 1) | sin nulos, existe | ✓ | ✓ | ✓ |
| 2 | `('S1', 'Precio', 'A', 3)` | (A, 3) | sin nulos, no existe | ✗ | ✗ | ✗ |
| 3 | `('S2', 'Trato', NULL, NULL)` | (NULL, NULL) | todo nulo | ✓ | ✓ | ✓ |
| 4 | `('S2', 'Garantía', NULL, 2)` | (NULL, 2) | mezcla, el no nulo existe | ✓ | ✓ | ✗ |
| 5 | `('S3', 'Limpieza', 'E', NULL)` | (E, NULL) | mezcla, el no nulo no existe | ✓ | ✗ | ✗ |

- 1: el par (A,1) existe (Juan Ro).
- 2: `A` existe como zona y `3` como número, pero no en la misma fila; sin nulos los tres matchings
  exigen el par completo.
- 3: todo nulo se acepta en los tres.
- 4: simple ignora la FK por el nulo; parcial busca `NroC = 2` y lo encuentra en (A,2) y (C,2); full
  prohíbe la mezcla.
- 5: simple la acepta; parcial busca `Zona = 'E'` y no hay ningún cliente; full prohíbe la mezcla.

Chequeo: en cada fila, simple ⊇ parcial ⊇ full; un ✓ a la derecha de un ✗ es un error. En MySQL
(siempre simple) se aceptaron 1, 3, 4 y 5 y se rechazó 2 (`ERROR 1452`).

## Ejercicio 3

Esquema A: `ARTICULO(id_articulo, titulo, autor, nacionalidad, fecha_pub)`,
`PALABRA(idioma, cod_palabra, descripcion)`, `CONTIENE(id_articulo, idioma, cod_palabra, nro_seccion)`.
Esquema B: `PRODUCTO(cod_producto, presentacion, descripcion, tipo)`,
`PROVEEDOR(nro_prov, nombre, direccion, localidad, fecha_nac)`, `SUCURSAL(cod_suc, nombre, localidad)`,
`PROVEE(cod_producto, nro_prov, cod_suc)` con `cod_suc` fuera de la PK y opcional.

### 3.a

**Consigna:** tabla de restricciones: tablas, atributos, tipo (atributo, tupla, tabla, global) y
recurso SQL-1999 (`CHECK` o `ASSERTION`) para las nueve restricciones.

**Resolución:** criterio: ¿cuánto hay que mirar para saber si se cumple? Una columna → atributo; varias
columnas de la misma fila → tupla; varias filas de una tabla → tabla; más de una tabla → global.

| Restricción | Tabla/s | Atributo/s | Tipo | Recurso |
| --- | --- | --- | --- | --- |
| A.1 nacionalidades válidas | ARTICULO | nacionalidad | De atributo | CHECK |
| A.2 fecha ≥ 2010 | ARTICULO | fecha_pub | De atributo | CHECK |
| A.3 los de 2017, solo argentinos | ARTICULO | fecha_pub, nacionalidad | De tupla | CHECK |
| A.4 máx. 10 palabras por artículo | CONTIENE | id_articulo | De tabla | CHECK (con subconsulta) |
| A.5 argentinos con 11 a 15 palabras | ARTICULO, CONTIENE | nacionalidad, id_articulo | Global | ASSERTION |
| B.6 máx. 20 productos por proveedor | PROVEE | nro_prov | De tabla | CHECK (con subconsulta) |
| B.7 `cod_suc` empieza con `S_` | SUCURSAL | cod_suc | De atributo | CHECK |
| B.8 descripción y presentación no ambas nulas | PRODUCTO | descripcion, presentacion | De tupla | CHECK |
| B.9 sucursales de la localidad del proveedor | PROVEE, PROVEEDOR, SUCURSAL | cod_suc, nro_prov, localidad | Global | ASSERTION |

(clave) A.4 y B.6 tienen un `COUNT … GROUP BY`, pero sobre **una sola tabla**: son de tabla, no
globales.

(atención) A.4 y A.5 se contradicen tal como están escritas: A.4 pide como máximo 10 palabras para
todo artículo y A.5 exige más de 10 para los argentinos, así que ningún artículo argentino sería
válido. Si A.5 se lee como excepción, A.4 pasa a "máximo 10 para los **no** argentinos", que mira
`ARTICULO.nacionalidad` y se vuelve global (`ASSERTION`). Abajo se escriben tal cual el enunciado.

### 3.b

**Consigna:** las sentencias en SQL estándar (`ALTER TABLE` o `CREATE ASSERTION`) para cada
restricción.

**Resolución:**

```sql
-- A.1
ALTER TABLE ARTICULO ADD CONSTRAINT ck_articulo_nacionalidad
  CHECK (nacionalidad IN ('Argentino','Español','Inglés','Alemán','Chileno'));

-- A.2
ALTER TABLE ARTICULO ADD CONSTRAINT ck_articulo_fecha_pub
  CHECK (fecha_pub >= DATE '2010-01-01');

-- A.3
ALTER TABLE ARTICULO ADD CONSTRAINT ck_articulo_2017_argentino
  CHECK (EXTRACT(YEAR FROM fecha_pub) <> 2017 OR nacionalidad = 'Argentino');

-- A.4
ALTER TABLE CONTIENE ADD CONSTRAINT ck_contiene_max_10
  CHECK (NOT EXISTS (SELECT 1 FROM CONTIENE
                     GROUP BY id_articulo
                     HAVING COUNT(*) > 10));

-- A.5
CREATE ASSERTION as_articulo_argentino_palabras
  CHECK (NOT EXISTS (
    SELECT 1 FROM ARTICULO A
    WHERE A.nacionalidad = 'Argentino'
      AND (SELECT COUNT(*) FROM CONTIENE C
           WHERE C.id_articulo = A.id_articulo) NOT BETWEEN 11 AND 15));

-- B.6
ALTER TABLE PROVEE ADD CONSTRAINT ck_provee_max_20
  CHECK (NOT EXISTS (SELECT 1 FROM PROVEE
                     GROUP BY nro_prov
                     HAVING COUNT(*) > 20));

-- B.7  (el _ es comodín de LIKE: hay que escaparlo)
ALTER TABLE SUCURSAL ADD CONSTRAINT ck_sucursal_cod
  CHECK (cod_suc LIKE 'S\_%' ESCAPE '\');

-- B.8
ALTER TABLE PRODUCTO ADD CONSTRAINT ck_producto_desc_o_pres
  CHECK (descripcion IS NOT NULL OR presentacion IS NOT NULL);

-- B.9
CREATE ASSERTION as_provee_misma_localidad
  CHECK (NOT EXISTS (
    SELECT 1
    FROM PROVEE PV
    JOIN PROVEEDOR P ON P.nro_prov = PV.nro_prov
    JOIN SUCURSAL  S ON S.cod_suc  = PV.cod_suc
    WHERE S.localidad <> P.localidad));
```

- A.3 es una implicación ("si es de 2017, entonces argentino") escrita como `NOT p OR q`.
- B.7 sin escape (`LIKE 'S_%'`) acepta `SX01`: verificado en MySQL, el `INSERT` de `'SX01'` pasó.
- B.9: las filas con `cod_suc` nulo no entran al `JOIN` y quedan válidas, que es lo correcto.
- B.6 cuenta filas con `COUNT(*)`; equivale a contar productos porque la PK de `PROVEE` es
  `(cod_producto, nro_prov)`.

### 3.c

**Consigna:** las sentencias de alteración de tabla de las restricciones que MySQL puede soportar.

**Resolución:** MySQL soporta **A.1, A.2, A.3, B.7 y B.8** (atributo y tupla). No soporta A.4 ni B.6
(no admite subconsultas en un `CHECK`) ni A.5 ni B.9 (no existe `CREATE ASSERTION`). Las cinco,
corridas en MySQL 9.7.2:

```sql
ALTER TABLE ARTICULO ADD CONSTRAINT ck_articulo_nacionalidad
  CHECK (nacionalidad IN ('Argentino','Español','Inglés','Alemán','Chileno'));

ALTER TABLE ARTICULO ADD CONSTRAINT ck_articulo_fecha_pub
  CHECK (fecha_pub >= '2010-01-01');

ALTER TABLE ARTICULO ADD CONSTRAINT ck_articulo_2017_argentino
  CHECK (YEAR(fecha_pub) <> 2017 OR nacionalidad = 'Argentino');

ALTER TABLE SUCURSAL ADD CONSTRAINT ck_sucursal_cod
  CHECK (cod_suc LIKE 'S\_%');          -- en MySQL la \ ya es el escape por defecto

ALTER TABLE PRODUCTO ADD CONSTRAINT ck_producto_desc_o_pres
  CHECK (descripcion IS NOT NULL OR presentacion IS NOT NULL);
```

Comprobado con `INSERT` de prueba: rechazan (`ERROR 3819 Check constraint … is violated`) un artículo
chileno de 2017, uno peruano, uno de 2009, la sucursal `'SX01'` y un producto con las dos columnas
nulas; aceptan un artículo argentino de 2017, `'S_01'` y un producto con presentación.

Lo que MySQL no acepta, con el error real:

```text
CHECK ((SELECT COUNT(*) FROM PROVEE) <= 20)              → ERROR 1111 Invalid use of group function
CHECK (nro_prov IN (SELECT nro_prov FROM PROVEEDOR))     → ERROR 3815 … contains disallowed function
CREATE ASSERTION …                                       → ERROR 1064 (error de sintaxis)
CHECK (fecha_pub <= CURDATE())                           → ERROR 3814 … contains disallowed function: curdate
```

(atención) La alternativa en MySQL para A.4, B.6, A.5 y B.9 son triggers, que no equivalen: no
validan los datos ya cargados y hace falta uno por evento (y, en las globales, sobre cada tabla
involucrada). Ejemplo para B.6, corrido: con 20 productos cargados, el `INSERT` número 21 se rechaza.

```sql
DELIMITER $$
CREATE TRIGGER tr_provee_max_20_ins
BEFORE INSERT ON PROVEE
FOR EACH ROW
BEGIN
  IF (SELECT COUNT(*) FROM PROVEE WHERE nro_prov = NEW.nro_prov) >= 20 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Un proveedor no puede proveer más de 20 productos';
  END IF;
END$$
DELIMITER ;
-- INSERT número 21 → ERROR 1644 (45000): Un proveedor no puede proveer más de 20 productos
```

Haría falta otro igual `BEFORE UPDATE`.

## Enlaces

- Práctica de donde sale el análisis largo: [[Práctica 2026-08-25|Práctica del 25/08]]
- Teórica: [[Clase 09 - Restricciones integridad-Parte 1|Clase 09]] ·
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
  [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] · [[1.09.04 - Triggers|Triggers]]
- Motor: [[MySQL]]
