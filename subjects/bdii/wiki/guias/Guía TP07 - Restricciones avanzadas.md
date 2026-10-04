---
tipo: guia
unidad: 1
orden: 8
tema: TP7 Restricciones avanzadas — triggers y stored procedures
resumen: "Guía resuelta del TP7: log de auditoría con triggers, la traza FOR EACH ROW frente a FOR EACH STATEMENT, un histórico de empleados con triggers y procedure, y el contador TEXTOSPORAUTOR. Todo el SQL corrido en MySQL 9.7.2."
fuentes:
  - "raw/Unidad-01/Practica/ITBA TP 7 Restricciones Avanzadas.pdf"
  - "raw/Unidad-01/Practica/esq_peliculas.sql"
estado: procesado
---

# Guía TP07 — Restricciones avanzadas (triggers, funciones y stored procedures)

## Resumen general

El TP7 ejercita triggers y stored procedures en MySQL sobre dos esquemas ya conocidos: el de
Películas del TP3 (ejercicios 1 y 3) y el esquema A del TP6 (ejercicio 4); el ejercicio 2 usa dos
tablas inventadas en el enunciado. Hace falta saber la sintaxis de `CREATE TRIGGER` (evento, momento
`BEFORE`/`AFTER`, `NEW`/`OLD`), `DELIMITER` en el cliente `mysql` y `CREATE PROCEDURE`.

Las reglas que deciden el TP son cuatro. Primera: MySQL solo tiene `FOR EACH ROW`, y exige un trigger
por evento y por tabla; `FOR EACH STATEMENT` se responde según la teoría (un disparo por sentencia,
aunque afecte cero filas). Segunda: un trigger de fila que consulta un agregado sobre su propia tabla
da resultados que dependen del orden de inserción (ejercicio 2: 435/535 con el orden del enunciado,
contra 485/585 con `STATEMENT`). Tercera: un trigger no ve el pasado; toda tabla derivada mantenida
por triggers necesita además una carga inicial (3.e y 4.a). Cuarta: recalcular el agregado completo
en cada disparo es más caro que incrementar, pero se autocorrige y no falla cuando una fecha baja.

En MySQL un trigger puede leer la tabla que lo dispara (los ejercicios 2, 3 y 4 lo hacen y corren);
lo prohibido es modificarla (error 1442). Para el parcial: saber trazar el ejercicio 2 a mano,
distinguir fila y sentencia, y responder qué pasa con los datos preexistentes al crear un trigger.

## Setup

Los ejercicios 1 y 3 corren sobre `raw/Unidad-01/Practica/esq_peliculas.sql` cargado tal cual
(7 entregas, 11 renglones, 7 empleados). El ejercicio 4 necesita la tabla `ARTICULO` del esquema A
del TP6, que el TP6 da solo como imagen:

```sql
CREATE TABLE articulo (
  id_articulo  INT          PRIMARY KEY,
  titulo       VARCHAR(200) NOT NULL,
  autor        VARCHAR(100) NOT NULL,
  nacionalidad VARCHAR(20)  NOT NULL,
  fecha_pub    DATE         NOT NULL
);
```

(nota) En el cliente `mysql`, todo trigger o procedure con `BEGIN … END` va entre
`DELIMITER $$` y `DELIMITER ;`.

## Ejercicio 1

### 1.a

**Consigna.** Crear `HIS_ENTREGA` con al menos `id_log`, fecha de la operación, operación (insert,
update o delete) y usuario.

**Resolución.**

```sql
CREATE TABLE his_entrega (
  id_log          BIGINT       NOT NULL AUTO_INCREMENT,
  fecha_op        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  operacion       ENUM('INSERT','UPDATE','DELETE') NOT NULL,
  usuario         VARCHAR(288) NOT NULL,
  tabla_afectada  ENUM('ENTREGA','RENGLON_ENTREGA') NOT NULL,
  nro_entrega     NUMERIC(10,0) NULL,
  codigo_pelicula NUMERIC(5,0)  NULL,   -- solo para RENGLON_ENTREGA
  PRIMARY KEY (id_log)
);
```

El "por lo menos" se usa: sin `tabla_afectada` y la clave de la fila (`nro_entrega`,
`codigo_pelicula`) el log no dice qué se tocó. Sin FK a propósito: el registro de un `DELETE` tiene
que sobrevivir a la fila borrada.

### 1.b

**Consigna.** Triggers que mantengan `HIS_ENTREGA` ante insert, update y delete en `ENTREGA` y
`RENGLON_ENTREGA`.

**Resolución.** 3 eventos × 2 tablas = 6 triggers (MySQL no admite `INSERT OR UPDATE OR DELETE` en un
solo trigger).

```sql
DELIMITER $$
CREATE TRIGGER tr_entrega_ai AFTER INSERT ON entrega FOR EACH ROW
  INSERT INTO his_entrega (operacion, usuario, tabla_afectada, nro_entrega)
  VALUES ('INSERT', USER(), 'ENTREGA', NEW.nro_entrega)$$
CREATE TRIGGER tr_entrega_au AFTER UPDATE ON entrega FOR EACH ROW
  INSERT INTO his_entrega (operacion, usuario, tabla_afectada, nro_entrega)
  VALUES ('UPDATE', USER(), 'ENTREGA', OLD.nro_entrega)$$
CREATE TRIGGER tr_entrega_ad AFTER DELETE ON entrega FOR EACH ROW
  INSERT INTO his_entrega (operacion, usuario, tabla_afectada, nro_entrega)
  VALUES ('DELETE', USER(), 'ENTREGA', OLD.nro_entrega)$$

CREATE TRIGGER tr_renglon_ai AFTER INSERT ON renglon_entrega FOR EACH ROW
  INSERT INTO his_entrega (operacion, usuario, tabla_afectada, nro_entrega, codigo_pelicula)
  VALUES ('INSERT', USER(), 'RENGLON_ENTREGA', NEW.nro_entrega, NEW.codigo_pelicula)$$
CREATE TRIGGER tr_renglon_au AFTER UPDATE ON renglon_entrega FOR EACH ROW
  INSERT INTO his_entrega (operacion, usuario, tabla_afectada, nro_entrega, codigo_pelicula)
  VALUES ('UPDATE', USER(), 'RENGLON_ENTREGA', OLD.nro_entrega, OLD.codigo_pelicula)$$
CREATE TRIGGER tr_renglon_ad AFTER DELETE ON renglon_entrega FOR EACH ROW
  INSERT INTO his_entrega (operacion, usuario, tabla_afectada, nro_entrega, codigo_pelicula)
  VALUES ('DELETE', USER(), 'RENGLON_ENTREGA', OLD.nro_entrega, OLD.codigo_pelicula)$$
DELIMITER ;
```

`AFTER` registra solo lo que efectivamente pasó (un `BEFORE` loguearía operaciones que después fallan
por PK o FK). `USER()` da quién se conectó; `CURRENT_USER()` podría devolver al definidor del trigger.

### 1.c

**Consigna.** Diferencia entre `FOR EACH ROW` y `FOR EACH STATEMENT` (según la teoría; MySQL no tiene
la segunda).

**Resolución.**

| | `FOR EACH ROW` | `FOR EACH STATEMENT` |
| --- | --- | --- |
| Disparos ante una sentencia que afecta *n* filas | *n* | 1 |
| Filas que deja en `HIS_ENTREGA` | *n*, una por fila | 1 |
| Acceso a `NEW`/`OLD` | ✓ | ✗ (solo con tablas de transición `REFERENCING NEW TABLE AS`) |
| Qué registra | qué fila cambió | que hubo una operación, quién y cuándo |
| Sentencia que afecta 0 filas | no dispara | dispara igual, una vez |
| En MySQL | ✓ única opción | ✗ no existe |

Corrido sobre el esquema: `UPDATE renglon_entrega SET cantidad = cantidad + 1 WHERE nro_entrega = 7`
deja **4 filas** en `HIS_ENTREGA` (renglones 10002, 10005, 10007, 10008); el mismo `UPDATE` con
`nro_entrega = 999` no deja ninguna. Con `STATEMENT` serían 1 y 1. Como el enunciado pide registrar
"quién y cuándo", alcanzaría con uno de sentencia; si se quiere saber qué filas, hace falta el de fila.

## Ejercicio 2

**Consigna.** Trigger `autoDecremento AFTER INSERT ON empleado_1 FOR EACH ROW UPDATE empleado_2 SET
sueldo = sueldo - (SELECT min(sueldo)*0.05 FROM empleado_1)`. `EMPLEADO_2` = {(100, 500), (200, 600)}
(id, sueldo). Con un solo `INSERT … SELECT` se cargan en `EMPLEADO_1` (1, 700), (2, 300), (3, 700).
Estado final de `EMPLEADO_2`.

Supuestos: `EMPLEADO_1` arranca vacía y las filas entran en el orden listado. El trigger es `AFTER`,
así que en el disparo *i* el `min` ve las filas 1..*i*. El `UPDATE` no tiene `WHERE` ni usa `NEW`:
cada disparo descuenta lo mismo a todas las filas de `EMPLEADO_2`.

### 2.a

**Consigna.** Si el trigger es `FOR EACH ROW`.

**Resolución.**

| Disparo | Fila insertada | `EMPLEADO_1` visible | `min` | Descuento (`min` × 0,05) | `EMPLEADO_2` |
| :---: | --- | --- | :---: | :---: | --- |
| — | — | {} | — | — | (100, 500) · (200, 600) |
| 1 | (1, 700) | {700} | 700 | 35 | (100, 465) · (200, 565) |
| 2 | (2, 300) | {700, 300} | 300 | 15 | (100, 450) · (200, 550) |
| 3 | (3, 700) | {700, 300, 700} | 300 | 15 | (100, 435) · (200, 535) |

**`EMPLEADO_2` = {(100, 435), (200, 535)}** (descuento total 65, no 3 × 15). ✓ Corrido en MySQL 9.7.2.

El resultado depende del orden de inserción, que `INSERT … SELECT` no garantiza (corrido en MySQL):

| Orden | Descuentos | Final |
| --- | --- | --- |
| 700, 300, 700 (el del enunciado) | 35 + 15 + 15 = 65 | (100, 435) · (200, 535) |
| 700, 700, 300 | 35 + 35 + 15 = 85 | (100, 415) · (200, 515) |
| 300, 700, 700 | 15 + 15 + 15 = 45 | (100, 455) · (200, 555) |

### 2.b

**Consigna.** Si el trigger es `FOR EACH STATEMENT` (según la teoría).

**Resolución.** Un solo disparo, al terminar la sentencia, con las tres filas ya en `EMPLEADO_1`:
`min` = 300, descuento 15. **`EMPLEADO_2` = {(100, 485), (200, 585)}**, sea cual sea el orden.

## Ejercicio 3

**Consigna general.** Sobre Películas, mantener `HIS_EMPLEADO` con, por empleado, el tiempo total
desde su alta y el tiempo promedio de permanencia por departamento (iguales si trabajó en uno solo).

### 3.a

**Consigna.** Cambios necesarios en el esquema.

**Resolución.** El esquema no tiene fecha de alta (la única fecha de `EMPLEADO` es
`fecha_nacimiento`) y guarda solo el departamento actual, que se pisa en cada traslado. Hay que
agregar las fechas y una tabla con la historia de estadías:

```sql
ALTER TABLE empleado
  ADD COLUMN fecha_alta DATE NULL AFTER fecha_nacimiento,
  ADD COLUMN fecha_baja DATE NULL AFTER fecha_alta;

CREATE TABLE empleado_departamento (
  id_empleado     NUMERIC(6,0) NOT NULL,
  id_distribuidor NUMERIC(5,0) NOT NULL,
  id_departamento NUMERIC(4,0) NOT NULL,
  fecha_desde     DATE NOT NULL,
  fecha_hasta     DATE NULL,                 -- NULL = estadía vigente
  PRIMARY KEY (id_empleado, id_distribuidor, id_departamento, fecha_desde),
  CONSTRAINT fk_ed_empleado FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado),
  CONSTRAINT fk_ed_departamento FOREIGN KEY (id_distribuidor, id_departamento)
    REFERENCES departamento (id_distribuidor, id_departamento),
  CONSTRAINT chk_ed_rango CHECK (fecha_hasta IS NULL OR fecha_hasta >= fecha_desde)
);
```

La FK a `DEPARTAMENTO` es compuesta porque su PK es `(id_distribuidor, id_departamento)`. Para que
"total = promedio" con un solo departamento, las estadías deben cubrir el alta sin huecos ni
solapamientos; eso no es declarable con `CHECK` y queda a cargo de la aplicación o de otro trigger.

### 3.b

**Consigna.** Crear `HIS_EMPLEADO` con los campos requeridos.

**Resolución.** Unidad elegida: días (`DATEDIFF`).

```sql
CREATE TABLE his_empleado (
  id_empleado        NUMERIC(6,0)  NOT NULL,
  dias_totales       INT           NULL,      -- desde fecha_alta hasta baja u hoy
  cant_departamentos INT           NULL,
  dias_prom_x_depto  DECIMAL(12,2) NULL,
  fecha_calculo      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_empleado),
  CONSTRAINT fk_hisemp_empleado FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado)
);
```

`fecha_calculo` dice a qué día corresponde el dato: el tiempo de un empleado activo cambia solo.

### 3.c

**Consigna.** Implementar el requerimiento con triggers.

**Resolución.** Los triggers llaman al procedure de cálculo del 3.d (se define antes), para no copiar
la fórmula seis veces.

```sql
DELIMITER $$
-- Sobre las estadías: un traslado cambia la cantidad de deptos y la suma
CREATE TRIGGER tr_ed_ai AFTER INSERT ON empleado_departamento FOR EACH ROW
BEGIN
  CALL sp_recalcular_his_empleado(NEW.id_empleado);
END$$
CREATE TRIGGER tr_ed_au AFTER UPDATE ON empleado_departamento FOR EACH ROW
BEGIN
  CALL sp_recalcular_his_empleado(NEW.id_empleado);
  IF NOT (OLD.id_empleado <=> NEW.id_empleado) THEN
    CALL sp_recalcular_his_empleado(OLD.id_empleado);
  END IF;
END$$
CREATE TRIGGER tr_ed_ad AFTER DELETE ON empleado_departamento FOR EACH ROW
BEGIN
  CALL sp_recalcular_his_empleado(OLD.id_empleado);
END$$

-- Sobre EMPLEADO: alta, cambio de fechas y baja física
CREATE TRIGGER tr_empleado_ai AFTER INSERT ON empleado FOR EACH ROW
BEGIN
  CALL sp_recalcular_his_empleado(NEW.id_empleado);
END$$
CREATE TRIGGER tr_empleado_au AFTER UPDATE ON empleado FOR EACH ROW
BEGIN
  IF NOT (OLD.fecha_alta <=> NEW.fecha_alta) OR NOT (OLD.fecha_baja <=> NEW.fecha_baja) THEN
    CALL sp_recalcular_his_empleado(NEW.id_empleado);
  END IF;
END$$
CREATE TRIGGER tr_empleado_bd BEFORE DELETE ON empleado FOR EACH ROW
BEGIN
  DELETE FROM his_empleado WHERE id_empleado = OLD.id_empleado;
END$$
DELIMITER ;
```

`<=>` es la comparación NULL-safe (`fecha_baja` suele ser `NULL`). ✓ Corrido: el trigger sobre
`empleado` puede llamar a un procedure que lee `empleado`; MySQL solo prohíbe modificarla.
Prueba: alta 2020-01-01, baja 2026-01-01, estadías en dos departamentos de 1096 días cada una →
`dias_totales` = 2192, `cant_departamentos` = 2, `dias_prom_x_depto` = 1096.

### 3.d

**Consigna.** Un stored procedure que haga estos cálculos.

**Resolución.** `PROCEDURE` y no `FUNCTION`: devuelve varios valores y escribe una tabla.

```sql
DELIMITER $$
CREATE PROCEDURE sp_recalcular_his_empleado (IN p_id NUMERIC(6,0))
BEGIN
  DECLARE v_dias_totales INT DEFAULT NULL;
  DECLARE v_suma         INT DEFAULT 0;
  DECLARE v_cant         INT DEFAULT 0;

  SELECT DATEDIFF(COALESCE(fecha_baja, CURDATE()), fecha_alta)
    INTO v_dias_totales
    FROM empleado WHERE id_empleado = p_id;

  SELECT COALESCE(SUM(DATEDIFF(COALESCE(ed.fecha_hasta, e.fecha_baja, CURDATE()),
                               ed.fecha_desde)), 0),
         COUNT(DISTINCT ed.id_distribuidor, ed.id_departamento)
    INTO v_suma, v_cant
    FROM empleado_departamento ed JOIN empleado e ON e.id_empleado = ed.id_empleado
   WHERE ed.id_empleado = p_id;

  INSERT INTO his_empleado (id_empleado, dias_totales, cant_departamentos,
                            dias_prom_x_depto, fecha_calculo)
  VALUES (p_id, v_dias_totales, v_cant,
          CASE WHEN v_cant = 0 THEN NULL ELSE v_suma / v_cant END, NOW()) AS nuevo
  ON DUPLICATE KEY UPDATE
    dias_totales       = nuevo.dias_totales,
    cant_departamentos = nuevo.cant_departamentos,
    dias_prom_x_depto  = nuevo.dias_prom_x_depto,
    fecha_calculo      = NOW();
END$$

-- Recalcula a todos: sirve de carga inicial y de recálculo periódico
CREATE PROCEDURE sp_recalcular_his_empleado_todos ()
BEGIN
  DECLARE fin  INT DEFAULT 0;
  DECLARE v_id NUMERIC(6,0);
  DECLARE cur CURSOR FOR SELECT id_empleado FROM empleado;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET fin = 1;
  OPEN cur;
  bucle: LOOP
    FETCH cur INTO v_id;
    IF fin = 1 THEN LEAVE bucle; END IF;
    CALL sp_recalcular_his_empleado(v_id);
  END LOOP;
  CLOSE cur;
END$$
DELIMITER ;
```

`COUNT(DISTINCT a, b)` cuenta departamentos distintos (la PK es compuesta), no estadías: volver a un
departamento no suma uno más.

### 3.e

**Consigna.** ¿Ambos enfoques garantizan la información actualizada en todo momento? ¿Qué pasa con
los datos preexistentes al incorporar el trigger o el procedimiento?

**Resolución.** **No, ninguno.**

- **Trigger:** reacciona solo a `INSERT`/`UPDATE`/`DELETE`. El tiempo de un empleado activo crece con
  el calendario, y el paso del tiempo no es un evento: si nadie toca la fila, el dato queda viejo.
- **Procedure:** está al día solo en el instante en que se ejecuta; es una foto. Habría que
  programarlo (por ejemplo, con el `EVENT` scheduler de MySQL una vez por día) o calcular el tiempo en
  una vista en lugar de materializarlo.
- **Datos preexistentes:** un trigger no ve el pasado. Los 7 empleados cargados antes de crearlo no
  disparan nada y `HIS_EMPLEADO` nace vacía (✓ corrido: 0 filas). Hace falta una carga inicial,
  `CALL sp_recalcular_his_empleado_todos();`. Y aun así, `fecha_alta` nace `NULL` para esos 7
  empleados y no hay ningún dato del que derivarla: la carga deja `dias_totales = NULL` (✓ corrido)
  hasta que alguien informe las fechas reales.

## Ejercicio 4

**Consigna general.** Sobre el esquema A del TP6, crear `TEXTOSPORAUTOR(autor, cant_textos,
fecha_ultima_public)`.

```sql
CREATE TABLE textosporautor (
  autor               VARCHAR(100) NOT NULL PRIMARY KEY,
  cant_textos         INT          NOT NULL DEFAULT 0,
  fecha_ultima_public DATE         NULL
);
```

`autor` es texto libre (no hay entidad AUTOR), así que no puede ser FK.

### 4.a

**Consigna.** Medio más apropiado para completar la tabla inicialmente a partir de los datos
existentes, con la sintaxis completa.

**Resolución.** Un `INSERT … SELECT` con agregación: una sola sentencia, atómica, que hace el motor.

```sql
INSERT INTO textosporautor (autor, cant_textos, fecha_ultima_public)
SELECT autor, COUNT(*), MAX(fecha_pub)
FROM articulo
GROUP BY autor;
```

Un cursor en un procedure haría lo mismo fila por fila, más lento. Una vista
(`CREATE VIEW … AS SELECT autor, COUNT(*), MAX(fecha_pub) … GROUP BY autor`) nunca se desactualiza y
evitaría el 4.b, pero el enunciado pide una tabla. Una vista materializada sería el medio ideal, y
MySQL no la tiene.

### 4.b

**Consigna.** Triggers para mantener la tabla consistente ante insert, update y delete sobre
`ARTICULO`.

**Resolución.** La lógica común va a un procedure que recalcula al autor desde cero; los tres
triggers lo llaman.

```sql
DELIMITER $$
CREATE PROCEDURE sp_recalcular_autor (IN p_autor VARCHAR(100))
BEGIN
  DECLARE v_cant INT  DEFAULT 0;
  DECLARE v_max  DATE DEFAULT NULL;
  SELECT COUNT(*), MAX(fecha_pub) INTO v_cant, v_max
    FROM articulo WHERE autor = p_autor;
  IF v_cant = 0 THEN
    DELETE FROM textosporautor WHERE autor = p_autor;
  ELSE
    INSERT INTO textosporautor (autor, cant_textos, fecha_ultima_public)
    VALUES (p_autor, v_cant, v_max) AS nuevo
    ON DUPLICATE KEY UPDATE cant_textos         = nuevo.cant_textos,
                            fecha_ultima_public = nuevo.fecha_ultima_public;
  END IF;
END$$
DELIMITER ;
```

#### 4.b.i

**Consigna.** `INSERT`: incrementar en 1 `cant_textos` y recalcular la fecha máxima.

**Resolución.**

```sql
DELIMITER $$
CREATE TRIGGER tr_articulo_ai AFTER INSERT ON articulo FOR EACH ROW
BEGIN
  CALL sp_recalcular_autor(NEW.autor);
END$$
DELIMITER ;
```

"Incrementar en 1" no alcanza si el autor todavía no tiene fila: hace falta un *upsert*
(`ON DUPLICATE KEY UPDATE`), que el procedure ya hace.

#### 4.b.ii

**Consigna.** `UPDATE`: considerar cambios en `autor` y en `fecha_pub`.

**Resolución.**

```sql
DELIMITER $$
CREATE TRIGGER tr_articulo_au AFTER UPDATE ON articulo FOR EACH ROW
BEGIN
  IF NOT (OLD.autor <=> NEW.autor) OR NOT (OLD.fecha_pub <=> NEW.fecha_pub) THEN
    CALL sp_recalcular_autor(NEW.autor);
    IF NOT (OLD.autor <=> NEW.autor) THEN
      CALL sp_recalcular_autor(OLD.autor);
    END IF;
  END IF;
END$$
DELIMITER ;
```

| Qué cambia | Efecto |
| --- | --- |
| solo `fecha_pub` | un autor: misma cantidad, se recalcula el `MAX` (si la fecha bajó, `GREATEST` no sirve) |
| solo `autor` | dos autores: el viejo pierde 1 (o desaparece), el nuevo gana 1 (o nace) |
| los dos | se recalculan ambos autores |
| ninguno de los dos | no hace nada |

#### 4.b.iii

**Consigna.** `DELETE`: decrementar en 1 y recalcular la fecha máxima.

**Resolución.**

```sql
DELIMITER $$
CREATE TRIGGER tr_articulo_ad AFTER DELETE ON articulo FOR EACH ROW
BEGIN
  CALL sp_recalcular_autor(OLD.autor);
END$$
DELIMITER ;
```

Va `AFTER`: la fila ya no está y el `COUNT`/`MAX` sale sin ella. Si el autor queda en 0 se borra su
fila, coherente con el 4.a, que no genera filas en 0.

✓ Corrido en MySQL 9.7.2 con cuatro artículos de prueba: insert de autor existente y nuevo, `UPDATE`
que baja la fecha máxima (vuelve a la anterior), `UPDATE` de autor (el viejo desaparece) y `DELETE`;
en cada paso la tabla coincide con el `SELECT autor, COUNT(*), MAX(fecha_pub) … GROUP BY autor`.

## Enlaces

- Análisis largo: [[Práctica 2026-09-01|Práctica del 01/09 — TP7]]
- Esquema A del ejercicio 4: [[Práctica 2026-08-25|Práctica del 25/08 — TP6]]
- Teóricas: [[Clase 09 - Restricciones integridad-Parte 1|Clase 09]] (sintaxis de triggers) ·
  [[Clase 10 - Restricciones integridad-Parte 2|Clase 10]] (procedures, funciones, cursores)
- Conceptos: [[1.09.04 - Triggers|Triggers]] ·
  [[1.10.02 - Stored procedures y funciones|Stored procedures y funciones]]
- Motor: [[MySQL]]
