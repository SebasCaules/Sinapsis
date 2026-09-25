---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - Vistas con WITH CHECK OPTION (LOCAL/CASCADED) en cadena
  - Integridad referencial y acciones referenciales (RESTRICT/CASCADE, FK compuesta con NULL)
  - Neo4j — restricción de unicidad en Cypher, lectura de Cypher y CAP (no dictado aún en 2026 2C)
  - Redis — inserción con un comando, CAP, RDB vs. AOF (no dictado aún en 2026 2C)
  - Cassandra — componentes de un nodo y V/F de arquitectura (no dictado aún en 2026 2C)
  - MongoDB — replicación vs. sharding y aggregation pipeline
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Parciales Viejos.pdf"
estado: procesado
resumen: "Parcial de fecha desconocida (rótulo XC-202X), gemelo del 2Q2025: diez ejercicios de desarrollo sobre vistas con CHECK OPTION, acciones referenciales, Neo4j, Redis, Cassandra y MongoDB, con respuestas manuscritas de un estudiante contrastadas con corridas reales en MySQL y MongoDB."
aliases:
  - XC-202X
  - Parcial XC-202X
  - Parcial manuscrito XC-202X
---

# Parcial XC-202X — el gemelo de desarrollo del 2Q2025, resuelto a mano por un estudiante

## Resumen general

Parcial de la materia con el mismo temario que la cursada 2026 (SQL avanzado sobre MySQL y NoSQL),
conocido solo por el rótulo "XC-202X" que le pone el estudiante que lo resolvió: la fuente no trae
fecha ni cuatrimestre. Ocupa las páginas 2 a 4 de `BDII - Parciales Viejos.pdf`; la página 1 es una
portada sin contenido y en la 5 empieza el [[Parcial 2Q-2023|Parcial 2Q-2023]]. Son **diez
ejercicios** que suman 100 puntos, casi todos de desarrollo: una cadena de tres vistas con
`WITH CHECK OPTION` (seis `INSERT` acumulativos), tres operaciones sobre el esquema
`Facultad`/`Carrera`/`Materia`, dos de Neo4j, dos de Redis, dos de Cassandra y dos de MongoDB.

Es **casi el mismo examen que el [[Parcial 2Q2025|Parcial 2Q2025]]** en formato de desarrollo:
comparte el esquema de RI con datos idénticos, la cadena de vistas con otros umbrales (`valor < 1100`
y `comision < 20`), la pregunta de replicación vs. sharding (idéntica salvo la redacción de la
opción d) y el mismo
`aggregate` a interpretar. Cada coincidencia se señala en su ejercicio.

Las respuestas son de un estudiante, no de la cátedra, y hay que leerlas con cuidado: acierta la
cadena de vistas (con una justificación equivocada en el inciso e), pero **se equivoca en el
`UPDATE` del Ejercicio 2**, que MySQL rechaza por la clave primaria duplicada (la misma trampa que la
plataforma corrigió en 2Q2025), y deja sin resolver los dos de Redis ("No entra"). Todo lo de SQL se
corrió en MySQL 9.7.2 y lo de MongoDB en 8.3.11; Neo4j, Redis y Cassandra se resuelven con Seven
Databases 2ª ed., Corbellini y la documentación oficial.

Para el 13/10/2026: la cadena de vistas y las acciones referenciales son los ejercicios de más
puntaje, y las trampas son de frontera (desigualdades estrictas) y de restricción equivocada (PK en
lugar de FK).

> [!info] Fuente
> - **`BDII - Parciales Viejos.pdf`** (13 páginas, manuscrito digital sobre fondo cuadriculado),
>   páginas **2–4**: capturas fotográficas del **enunciado impreso** (con puntaje por ejercicio) y,
>   debajo de cada una, la **respuesta manuscrita de un estudiante**. Nada es oficial de la cátedra:
>   no hay corrección ni puntaje obtenido. Aporta el enunciado completo de los diez ejercicios
>   (fechas parcialmente cortadas en los incisos c y e del Ejercicio 1, que no afectan la resolución)
>   y una respuesta para ocho de ellos; en los ejercicios 5 y 6 (Redis) el estudiante escribió en
>   rojo *"No entra."*. Las páginas 5 en adelante son otras instancias:
>   [[Parcial 2Q-2023|Parcial 2Q-2023]] y [[Práctica subida por la cátedra|Práctica subida por la cátedra]].

## Formato

- **Diez ejercicios, 100 puntos**, con el puntaje impreso en cada uno: Ej. 1 (12), Ej. 2 (9),
  Ej. 3 (10), Ej. 4 (9), Ej. 5 (10), Ej. 6 (10), Ej. 7 (10), Ej. 8 (10), Ej. 9 (5), Ej. 10 (15).
- Nueve son de **desarrollo** (justificar, escribir Cypher o una consulta de MongoDB, dibujar un
  esquema, V/F justificado) y uno de **opción múltiple** (Ej. 9).
- Examen **impreso en papel** (la primera captura muestra el número de página `1` al pie), a
  diferencia del 2Q2025, rendido en una plataforma online.
- Condición de aprobación, duración y modalidad: la fuente no las dice.
- El enunciado usa `to_date('2020-01-01','yyyy-mm-dd')`, función de Oracle y PostgreSQL que **no
  existe en MySQL** (verificado: `ERROR 1305 (42000): FUNCTION parcialxc202x.to_date does not
  exist`). En las corridas se usó el literal `'2020-01-01'` o `STR_TO_DATE`.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1 a–f | Cadena de tres vistas con `WITH LOCAL` y `WITH CASCADED CHECK OPTION` | [[1.06.01 - Vistas\|Vistas]] | [[Clase 06 - Vistas-Parte 1\|Clase 06]] · [[Clase 07 - Vistas-Parte 2\|Clase 07]] · [[Práctica 2026-08-11\|TP4]] |
| 2 a | `DELETE` en `Carrera` con RIR `restrict` en baja | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | [[Clase 09 - Restricciones integridad-Parte 1\|Clase 09]] · [[Práctica 2026-08-25\|TP6]] |
| 2 b | `UPDATE` en `Carrera`: `cascade` en modificación frente a la unicidad de la PK | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] · [[1.03.02 - DDL — creación y alteración de tablas\|DDL]] | Clase 09 · TP6 |
| 2 c | `INSERT` en `Materia` con FK compuesta y un componente `NULL` (`MATCH SIMPLE`) | [[1.09.02 - Integridad referencial y acciones referenciales\|Integridad referencial]] | Clase 09 · TP6 |
| 3 | Neo4j: restricción de unicidad en Cypher y clasificación CAP | Neo4j (sin página) · [[2.12.04 - Teorema CAP\|Teorema CAP]] | no dictado aún (Neo4j: 19/10) |
| 4 | Neo4j: traducir a lenguaje natural un `MATCH` de amigos de amigos | Neo4j (sin página) | no dictado aún (19/10) |
| 5 | Redis: insertar tres títulos con un solo comando y clasificación CAP | Redis (sin página) · [[2.12.04 - Teorema CAP\|Teorema CAP]] | no dictado aún (Redis: 26/10) |
| 6 | Redis: persistencia RDB vs. AOF | Redis (sin página) · [[1.11.05 - Recovery y write-ahead logging (WAL)\|Recovery y WAL]] | no dictado aún (26/10) |
| 7 | Cassandra: esquema de un nodo (MemTable, SSTable, commit log) | Cassandra (sin página) | no dictado aún (Cassandra: 28/09 y 05/10) |
| 8 a–e | Cassandra: V/F sobre CQL, niveles de consistencia, replicación, master-slave y tipo de base | Cassandra (sin página) · [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | no dictado aún (28/09 y 05/10) |
| 9 | MongoDB: diferencia entre replicación y sharding | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | [[Clase 12 - Introduccion a NoSQL\|Clase 12]] |
| 10 a | MongoDB: interpretar un `aggregate` con `$match` y `$group` | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 12 · [[Práctica 2026-09-15\|TP9]] |
| 10 b | MongoDB: traducir un `GROUP BY ... ORDER BY COUNT(*) DESC` | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 12 · TP9 |

---

## Sección A — Vistas con `WITH CHECK OPTION`

### Pregunta 1 — cadena de vistas `MovimientoUSDT` (12 puntos)

> **Ejercicio 1 (12 puntos).** Dadas las siguientes definiciones de vistas:
>
> ```sql
> CREATE VIEW MovimientoUSDT AS
> SELECT usuario, moneda, fecha, tipo, comision, valor
> FROM Movimiento
> WHERE moneda LIKE '%USDT%';
>
> CREATE VIEW MovUSDTValor AS
> SELECT * FROM MovimientoUSDT
> WHERE valor < 1100
> WITH LOCAL CHECK OPTION;
>
> CREATE VIEW MovUSDTValorComi AS
> SELECT * FROM MovUSDTValor
> WHERE comision < 20
> WITH CASCADED CHECK OPTION;
> ```
>
> Para las siguientes sentencias ejecutadas en el orden dado (acumulativas), considerando la
> existencia de la tabla Movimiento y suponiendo que está inicialmente vacía y que los datos que se
> pretende insertar satisfacen las restricciones de integridad referencial definidas, **indique y
> justifique si cada operación procede o no:**
>
> ```sql
> a) INSERT INTO MovimientoUSDT (usuario, moneda, fecha, tipo, comision, valor) VALUES ('1', 'EURO', to_date('2020-01-01','yyyy-mm-dd'), 'E', 15, 1300);
> b) INSERT INTO MovUSDTValor (usuario, moneda, fecha, tipo, comision, valor) VALUES ('3', 'BITCOIN', to_date('2020-03-03','yyyy-mm-dd'), 'S', 25, 800);
> c) INSERT INTO MovUSDTValor (usuario, moneda, fecha, tipo, comision, valor) VALUES ('4', 'USDT', to_date('20…-04','yyyy-mm-dd'), 'E', 20, 1700);
> d) INSERT INTO MovUSDTValorComi (usuario, moneda, fecha, tipo, comision, valor) VALUES ('2', 'USDT', to_date('2020-02-02','yyyy-mm-dd'), 'E', 20, 1000);
> e) INSERT INTO MovUSDTValor (usuario, moneda, fecha, tipo, comision, valor) VALUES ('5', 'USDT', to_date('2020-…-07','yyyy-mm-dd'), 'S', 33, 1100);
> f) INSERT INTO MovUSDTValorComi (usuario, moneda, fecha, tipo, comision, valor) VALUES ('3', 'EURO', to_date('2020-02-02','yyyy-mm-dd'), 'E', 15, 900);
> ```
>
> *(En la captura, las fechas de c y e quedan cortadas por el borde de la hoja: `…` marca lo
> ilegible. La fecha no interviene en ninguna condición de las vistas.)*

**Relación con el [[Parcial 2Q2025|Parcial 2Q2025]]:** es la misma cadena que sus Preguntas 1 y 18,
con **otros umbrales** (`valor < 1100` y `comision < 20` aquí; `valor < 1200` y `comision < 25` en
2025) y la columna `usuario` en lugar de `id_usuario`. El inciso **b** es la Pregunta 18 con otros
montos (`25, 800` frente a `30, 700`), con el mismo resultado. El inciso **d** usa los valores de la
Pregunta 1 (`'2', …, 'E', 20, 1000`) pero con moneda `'USDT'` en lugar de `'EURO'`: allí falla por la
moneda; aquí, por la comisión (`20 < 20` es falso; con el umbral de 2025, `20 < 25`, habría
procedido). El inciso **f** reproduce el razonamiento de la Pregunta 1: `'EURO'` rechazada por la
cadena `CASCADED`.

**Respuesta de la fuente (nota manuscrita, de estudiante):**

> a) Procede a insertarse en la tabla, pero no se va a mostrar en la vista, porque no está usando WCO.
> b) Se va a insertar en la tabla porque cumple con el check local, pero luego no se va a mostrar en
> MovimientoUSDT y por ende tampoco en MovUSDTValor.
> c) No se va a insertar, porque no se cumple con la condición de valor < 1100, y tiene WCO.
> d) No se va a insertar, porque no se cumple con la condición de comision < 20, y tiene WCO.
> e) No se va a insertar, porque tiene WCO CASCADED y valor < 1100 no se cumple.
> f) No se inserta, ídem que el ítem anterior pero ahora no se cumple moneda LIKE '%USDT%'.

**Resolución del vault:** corrida real en MySQL 9.7.2 (base `parcialxc202x`, `Movimiento` vacía al
empezar, fechas como literales):

```sql
CREATE TABLE Movimiento (usuario VARCHAR(10), moneda VARCHAR(20), fecha DATE,
                         tipo CHAR(1), comision DECIMAL(10,2), valor DECIMAL(10,2));
-- las tres vistas del enunciado, tal cual
INSERT INTO MovimientoUSDT    (...) VALUES ('1','EURO',   '2020-01-01','E',15,1300);  -- a
INSERT INTO MovUSDTValor      (...) VALUES ('3','BITCOIN','2020-03-03','S',25, 800);  -- b
INSERT INTO MovUSDTValor      (...) VALUES ('4','USDT',   '2020-04-04','E',20,1700);  -- c
INSERT INTO MovUSDTValorComi  (...) VALUES ('2','USDT',   '2020-02-02','E',20,1000);  -- d
INSERT INTO MovUSDTValor      (...) VALUES ('5','USDT',   '2020-07-07','S',33,1100);  -- e
INSERT INTO MovUSDTValorComi  (...) VALUES ('3','EURO',   '2020-02-02','E',15, 900);  -- f
```

```
a) Query OK
b) Query OK
c) ERROR 1369 (HY000): CHECK OPTION failed 'parcialxc202x.MovUSDTValor'
d) ERROR 1369 (HY000): CHECK OPTION failed 'parcialxc202x.MovUSDTValorComi'
e) ERROR 1369 (HY000): CHECK OPTION failed 'parcialxc202x.MovUSDTValor'
f) ERROR 1369 (HY000): CHECK OPTION failed 'parcialxc202x.MovUSDTValorComi'
```

Estado final (`SELECT * FROM Movimiento`), con las tres vistas vacías (`COUNT(*) = 0` en cada una):

```
+---------+---------+------------+------+----------+---------+
| usuario | moneda  | fecha      | tipo | comision | valor   |
+---------+---------+------------+------+----------+---------+
| 1       | EURO    | 2020-01-01 | E    |    15.00 | 1300.00 |
| 3       | BITCOIN | 2020-03-03 | S    |    25.00 |  800.00 |
+---------+---------+------------+------+----------+---------+
```

| Inciso | Vista destino (opción) | Qué se chequea | Resultado | Manuscrito |
| --- | --- | --- | --- | --- |
| a | `MovimientoUSDT` (sin WCO) | nada | ✓ procede; la fila no se ve en la vista (`EURO`) | ✓ |
| b | `MovUSDTValor` (`LOCAL`) | `valor < 1100` (800 ✓); `MovimientoUSDT` no tiene WCO propio, así que su `LIKE` no se chequea | ✓ procede; invisible en las dos vistas | ✓ |
| c | `MovUSDTValor` (`LOCAL`) | `valor < 1100` (1700 ✗) | ✗ | ✓ |
| d | `MovUSDTValorComi` (`CASCADED`) | toda la cadena: `comision < 20` (20 ✗), `valor < 1100` (1000 ✓), `LIKE '%USDT%'` ✓ | ✗ por la comisión | ✓ |
| e | `MovUSDTValor` (`LOCAL`) | `valor < 1100` (1100 ✗) | ✗ | ✓ la conclusión; ✗ la justificación |
| f | `MovUSDTValorComi` (`CASCADED`) | `comision < 20` (15 ✓), `valor < 1100` (900 ✓), `LIKE '%USDT%'` (`EURO` ✗) | ✗ por la moneda | ✓ |

(atención) **Inciso e: la conclusión es correcta pero la justificación no.** El `INSERT` va contra
`MovUSDTValor`, que es `LOCAL`; el `CASCADED` de `MovUSDTValorComi` no interviene porque la
sentencia no pasa por esa vista. Falla porque `1100 < 1100` es falso en la condición **propia** de
`MovUSDTValor`. Corrida de control: el mismo `INSERT` con `valor = 1099` y `comision = 33` **procede**
y la fila aparece en `MovUSDTValor` (no en `MovUSDTValorComi`), lo que demuestra que la comisión no se
chequea al insertar por esa vista:

```
+---------+--------+------------+------+----------+---------+
| usuario | moneda | fecha      | tipo | comision | valor   |
+---------+--------+------------+------+----------+---------+
| 5b      | USDT   | 2020-07-07 | S    |    33.00 | 1099.00 |
+---------+--------+------------+------+----------+---------+
```

El inciso **f** es el que discrimina `CASCADED` de `LOCAL`: la fila cumple las dos condiciones
propias de la cadena más cercana (comisión y valor) y solo falla la de `MovimientoUSDT`, vista sin WCO
propio. Que MySQL la rechace confirma que `CASCADED` chequea también las condiciones de las vistas
subyacentes aunque ellas no declaren `CHECK OPTION`. La regla completa (`LOCAL` = condición propia
más las subyacentes que tengan su propio WCO) está en [[1.06.01 - Vistas|Vistas]] y se verificó en
la Pregunta 18 del [[Parcial 2Q2025|Parcial 2Q2025]].

---

## Sección B — Integridad referencial y acciones referenciales

### Pregunta 2 — RIR sobre `Carrera`/`Materia`/`Facultad` (9 puntos)

> **Ejercicio 2 (9 puntos).** Considere las tablas a continuación con sus atributos y datos
> relevantes, con sus claves primarias, sus restricciones de integridad referencial (RIR) y acciones
> referenciales de [baja, modificación]:
>
> R1: Carrera (idFac) → Facultad (idFac): [restrict, restrict]
> R2: Materia (carrera, facultad) → Carrera (idCarr, idFac): [restrict, cascade]
>
> | Materia: idM | carrera | facultad | nom |
> | --- | --- | --- | --- |
> | M1 | 1 | F1 | nom1 |
> | M2 | 1 | F1 | nom2 |
> | M3 | 2 | F2 | nom3 |
>
> | Carrera: idCarr | idFac | … |
> | --- | --- | --- |
> | 1 | F1 | … |
> | 2 | F2 | … |
> | 1 | F2 | … |
>
> | Facultad: idFac | … |
> | --- | --- |
> | F1 | … |
> | F2 | … |
>
> *(En la captura están subrayados, como clave primaria, `idM` en `Materia`, `idCarr` e `idFac` en
> `Carrera` e `idFac` en `Facultad`.)*
>
> Nota: respecto de la RIR R2, suponga que los atributos carrera y facultad admiten nulos.
>
> Determine el resultado de la ejecución de las siguientes operaciones y justifique su respuesta. En
> cada caso considere el efecto sobre la instancia original de la BD, los resultados no son
> acumulativos.
>
> ```sql
> c) INSERT INTO Materia (idM, carrera, facultad, nom) VALUES ('M4', 3, null, 'nom4');
> b) UPDATE Carrera SET idFac = 'F1' WHERE idFac = 'F2';
> a) DELETE FROM Carrera WHERE idCarr = 2;
> ```
>
> *(Los incisos están impresos en ese orden, de c a a.)*

**Relación con el [[Parcial 2Q2025|Parcial 2Q2025]]:** esquema y datos **idénticos**, y las tres
operaciones son las mismas: a = Pregunta 30 (`DELETE`), b = Pregunta 17 (`UPDATE`), c = Pregunta 19
(`INSERT`). La diferencia es el formato: allí eran de opción múltiple con la opción correcta
señalada por la plataforma; aquí hay que justificar por escrito.

**Respuesta de la fuente (nota manuscrita, de estudiante):**

> a) No se ejecuta, porque hay un restrict en la acción de baja para R2, y hay tuplas en materia que
> referencian a idCarr = 2.
> b) Se ejecuta. Sobre R1 no hay problema pues existe idFac = 'F2'. Sobre R2 hay un CASCADE sobre el
> update, se actualiza también la tabla Materia.
> c) Se ejecuta, pues la FK es compuesta y tiene una de sus componentes null.

**Resolución del vault:** corrida real en MySQL 9.7.2, cada operación sobre la instancia original:

```sql
CREATE TABLE Facultad (idFac VARCHAR(10) PRIMARY KEY);
CREATE TABLE Carrera (idCarr INT, idFac VARCHAR(10), PRIMARY KEY (idCarr, idFac),
  CONSTRAINT R1 FOREIGN KEY (idFac) REFERENCES Facultad(idFac)
    ON DELETE RESTRICT ON UPDATE RESTRICT);
CREATE TABLE Materia (idM VARCHAR(10) PRIMARY KEY, carrera INT NULL, facultad VARCHAR(10) NULL,
  nom VARCHAR(30),
  CONSTRAINT R2 FOREIGN KEY (carrera, facultad) REFERENCES Carrera(idCarr, idFac)
    ON DELETE RESTRICT ON UPDATE CASCADE);
-- datos del enunciado
```

**a) `DELETE FROM Carrera WHERE idCarr = 2;`** — no procede:

```
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails
(`parcialxc202x`.`Materia`, CONSTRAINT `R2` FOREIGN KEY (`carrera`, `facultad`)
REFERENCES `Carrera` (`idCarr`, `idFac`) ON DELETE RESTRICT ON UPDATE CASCADE)
```

✓ Coincide con el manuscrito: `M3` referencia a `(2, F2)` y R2 es `restrict` en la baja. Precisión:
lo que se referencia es el par `(idCarr, idFac) = (2, F2)`, no solo `idCarr = 2`.

**b) `UPDATE Carrera SET idFac = 'F1' WHERE idFac = 'F2';`** — (crítico) **no procede, al revés de
lo que dice el manuscrito**:

```
ERROR 1062 (23000): Duplicate entry '1-F1' for key 'Carrera.PRIMARY'
```

La sentencia toca dos filas: `(2, F2) → (2, F1)` y `(1, F2) → (1, F1)`. La segunda choca con la fila
`(1, F1)` que ya existe, y la PK de `Carrera` es el par `(idCarr, idFac)`. MySQL revierte la
sentencia entera: después del error, `Carrera` y `Materia` quedan como al principio. El manuscrito
mira solo las dos RIR y pasa por alto la unicidad de la clave primaria, que es exactamente la
trampa: en la Pregunta 17 del [[Parcial 2Q2025|Parcial 2Q2025]] la plataforma de la cátedra corrigió
como correcta *"No procede por restricción de unicidad"*. Además, el argumento sobre R1 está mal
planteado: el `UPDATE` modifica la columna hija `Carrera.idFac`, así que lo que R1 exige es que el
**nuevo** valor, `'F1'`, exista en `Facultad` (existe); que exista `'F2'` no es lo relevante.

Lo que el manuscrito describe (el `CASCADE` de R2 propagado a `Materia`) sí ocurre cuando no hay
choque de PK. Corrida de control, actualizando solo la fila `(2, F2)`:

```sql
UPDATE Carrera SET idFac = 'F1' WHERE idCarr = 2 AND idFac = 'F2';
SELECT * FROM Materia;
```

```
+-----+---------+----------+------+
| idM | carrera | facultad | nom  |
+-----+---------+----------+------+
| M1  |       1 | F1       | nom1 |
| M2  |       1 | F1       | nom2 |
| M3  |       2 | F1       | nom3 |
+-----+---------+----------+------+
```

**c) `INSERT INTO Materia … VALUES ('M4', 3, null, 'nom4');`** — procede:

```
+-----+---------+----------+------+
| idM | carrera | facultad | nom  |
+-----+---------+----------+------+
| M1  |       1 | F1       | nom1 |
| M2  |       1 | F1       | nom2 |
| M3  |       2 | F2       | nom3 |
| M4  |       3 | NULL     | nom4 |
+-----+---------+----------+------+
```

✓ Coincide con el manuscrito, aunque le falta nombrar la regla: con `MATCH SIMPLE` (el default del
estándar y el único comportamiento de MySQL, que acepta `MATCH FULL`/`PARTIAL` pero los ignora) un
componente `NULL` basta para dar la referencia por satisfecha, aunque `idCarr = 3` no exista en
`Carrera`. Con `MATCH FULL` sería rechazado (mezcla de nulo y no nulo) y con `MATCH PARTIAL` también
(no hay ninguna `Carrera` con `idCarr = 3`). La tabla de decisión está en
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]]; en 2025 la
plataforma pedía justamente la opción *"Procede con MATCH simple"*.

---

## Sección C — Neo4j *(tema no dictado aún)*

Neo4j se dicta el 19/10/2026 según el [[_cronograma|cronograma]], después del parcial. Las
consultas de esta sección no se corrieron (no verificado en el motor).

### Pregunta 3 — restricción de unicidad y CAP (10 puntos)

> **Ejercicio 3 (10 puntos). Neo4j.** Muestre mediante Cypher cómo es posible crear una restricción
> de unicidad en el modelo de datos. Clasifique a Neo4j según el teorema CAP.

**Relación con el [[Parcial 2Q2025|Parcial 2Q2025]]:** la primera mitad es su Pregunta 20 (allí,
sobre `Publication.name`) y la segunda toca la Pregunta 13 (Neo4j como CA).

**Respuesta de la fuente (nota manuscrita, de estudiante):**

> Supongamos que queremos que dos nodos no puedan tener el mismo nombre:
>
> ```cypher
> CREATE CONSTRAINT
> FOR (p:Person)
> REQUIRE p.nome IS UNIQUE;
> ```
>
> Para Neo4j se tienen distintos casos en cuanto al modelo CAP:
> - Si se trabaja de manera distribuida con particiones → CP
> - Si se trabaja con una única instancia → CA
> - Si se trabaja en un contexto de alta disponibilidad (con HA) → AP

**Resolución del vault** *(tema no dictado aún)*:

*Restricción.* La sintaxis del manuscrito es la actual. La documentación oficial
(https://neo4j.com/docs/cypher-manual/current/constraints/syntax/) da
`CREATE CONSTRAINT [constraint_name] [IF NOT EXISTS] FOR (n:LabelName) REQUIRE n.propertyName IS [NODE] UNIQUE`:
el nombre es opcional (si falta, se genera uno) y se recomienda darlo. Forma recomendada:

```cypher
CREATE CONSTRAINT person_name_unique IF NOT EXISTS
FOR (p:Person) REQUIRE p.name IS UNIQUE;
```

(nota) El manuscrito escribe `p.nome`: es sintácticamente válido, pero la restricción queda sobre
una propiedad `nome`, no sobre el `name` que dice querer proteger. Seven Databases 2ª ed. cap. 6,
*Day 1*, § *Indexes, Constraints, and "Schemas" in Cypher* (impresas 187–188) usa la **sintaxis
anterior**, `CREATE CONSTRAINT ON (w:Wine) ASSERT w.name IS UNIQUE;`, y agrega dos datos útiles:
al crear la restricción Neo4j verifica los nodos existentes, y crea automáticamente un índice sobre
ese par etiqueta/propiedad. Si el examen acepta la forma `ON … ASSERT` del libro no se sabe; la
`FOR … REQUIRE` es la que documenta hoy Neo4j.

*CAP.* Las fuentes del vault no coinciden (detalle en [[2.12.04 - Teorema CAP|Teorema CAP]]):

| Fuente | Clasificación de Neo4j |
| --- | --- |
| Slide 18 de la [[Clase 12 - Introduccion a NoSQL\|Clase 12]] | no lo incluye |
| Seven Databases 2ª ed. apéndice A2, § *CAP in the Wild* (impresa 317) | **CA**: no distribuye datos |
| Seven Databases 2ª ed. cap. 6, § *Neo4j on CAP* (impresas 208–209) | **AP**: *Neo4j HA* es disponible y tolerante a particiones, eventualmente consistente |
| Corbellini Table 2 (p. 5) | AP |
| Plataforma de la cátedra, [[Parcial 2Q2025\|Parcial 2Q2025]] P13 | aceptó **CA** |

Los casos CA (instancia única) y AP (HA) del manuscrito tienen respaldo directo en el libro. (atención)
El caso **CP** ("distribuido con particiones") no aparece en ninguna fuente del vault: lo repiten
otros apuntes de estudiantes, pero no el libro ni el deck. Respuesta propuesta: *"Una instancia
única no distribuye datos: CA (Seven Databases A2). En cluster de alta disponibilidad, cada réplica
responde con lo que tiene y converge después: AP (cap. 6, Neo4j on CAP)"*.

### Pregunta 4 — traducir una consulta Cypher (9 puntos)

> **Ejercicio 4 (9 puntos). Neo4j.** Redacte en lenguaje natural la pregunta que le solicitan
> responder para construir la siguiente consulta:
>
> ```cypher
> MATCH (:User {name: 'Mary'})-[:FRIENDS_WITH*2..3]-(friend_of_friend:User)
> WHERE NOT (:User {name: 'Mary'})-[:FRIENDS_WITH]-(friend_of_friend)
> RETURN DISTINCT friend_of_friend.name
> ```

**Relación con el [[Parcial 2Q2025|Parcial 2Q2025]]:** mismo tipo de ejercicio que la Pregunta 22,
con otra consulta (allí, actores y películas).

**Respuesta de la fuente (nota manuscrita, de estudiante):**

> La consulta busca obtener los *[nombres de]* amigos de amigos y los amigos de amigos de amigos de
> Mary, pero que no sean amigos directos suyos.

(*"nombres de"* está agregado con una flecha sobre el texto.)

**Resolución del vault** *(tema no dictado aún)*: la respuesta es correcta. Pregunta propuesta:
*"¿Cuáles son los nombres, sin repetir, de los usuarios que están a dos o tres saltos de amistad de
Mary y que no son amigos directos de ella?"*. Cómo se lee cada parte:

- `*2..3` es un camino de longitud variable, de 2 a 3 relaciones: amigos de amigos y amigos de
  amigos de amigos.
- El patrón no tiene flecha (`-[…]-`): la amistad se recorre en ambos sentidos.
- `WHERE NOT (…)-[:FRIENDS_WITH]-(friend_of_friend)` descarta a quien tenga una relación directa con
  Mary.
- `DISTINCT` evita repetir a alguien alcanzable por varios caminos: el manuscrito no lo menciona.

(nota) Un detalle que ni el enunciado ni el manuscrito consideran: en un camino de largo 3, Cypher no
repite relaciones pero sí nodos, así que si Mary forma un triángulo con dos amigos
(`Mary–A–B–Mary`), la propia Mary aparece en el resultado (no es amiga directa de sí misma). Es un
razonamiento propio sobre la semántica de Cypher, no verificado en el motor. El patrón "amigos de
amigos" es el ejemplo de Seven Databases 2ª ed. cap. 6, *Day 1* (impresa 187), que lo escribe con
dos saltos explícitos: `MATCH (fof:Person)-[:friends]-(f:Person)-[:friends]-(p:Person {name: "Patty"}) RETURN fof.name;`.

---

## Sección D — Redis *(tema no dictado aún)*

Redis se dicta el 26/10/2026 según el [[_cronograma|cronograma]]. Los comandos de esta sección no
se corrieron (no verificado en el motor). El estudiante dejó los dos ejercicios
sin resolver con la anotación en rojo *"No entra."*: para su cursada, Redis quedaba fuera del
parcial, como pasará en 2026 si se mantiene el cronograma (Redis se dicta después del 13/10).

### Pregunta 5 — insertar tres títulos con un solo comando y CAP (10 puntos)

> **Ejercicio 5 (10 puntos). Redis.** Muestre el comando (<u>solo 1 comando</u>) necesario para
> insertar en la BD REDIS 3 títulos de películas. Clasifique a REDIS según el teorema CAP.

**Respuesta de la fuente (nota manuscrita, de estudiante):** sin resolver: *"No entra."*

**Resolución del vault** *(tema no dictado aún)*: los tres comandos que aceptan varios valores en una
sola llamada, todos en Seven Databases 2ª ed. cap. 8, *Day 1*:

```
SADD peliculas "Titanic" "Matrix" "Alien"
RPUSH peliculas "Titanic" "Matrix" "Alien"
MSET pelicula:1 "Titanic" pelicula:2 "Matrix" pelicula:3 "Alien"
```

| Comando | Estructura | Cuándo conviene | Libro |
| --- | --- | --- | --- |
| `SADD` | set: sin orden, sin duplicados | un catálogo de títulos únicos (la opción más natural) | § *Sets* (impresas 266–267) |
| `RPUSH` | lista: conserva el orden, admite duplicados | si importa el orden de carga | § *Lists* (impresa 264) |
| `MSET` | tres claves string independientes | si cada título necesita su propia clave | § *Getting Started* (impresa 261) |

*CAP.* Es la duda abierta del vault sobre Redis ([[2.12.04 - Teorema CAP|Teorema CAP]] § *Dudas
abiertas*): el slide 18 de la [[Clase 12 - Introduccion a NoSQL|Clase 12]] lo pone en **CP**,
Seven Databases 2ª ed. apéndice A2, § *CAP in the Wild* (impresa 317) en **CA** (una instancia no
distribuye datos) y Corbellini Table 2 en **AP** (su Table 4 le asigna replicación master-slave y
consistencia eventual). Ningún examen corregido por la cátedra lo pregunta, y la página del teorema
aconseja **preguntar a la cátedra** qué esquina espera. *(propuesta propia)* Si hay que responder
sin esa aclaración: dar la del deck (CP) y explicar que un Redis de una sola instancia es CA y que
con réplicas y consistencia eventual se comporta como AP.

### Pregunta 6 — RDB vs. AOF (10 puntos)

> **Ejercicio 6 (10 puntos). Redis.** Explique la diferencia entre RDB y AOF.

**Respuesta de la fuente (nota manuscrita, de estudiante):** sin resolver: *"No entra."*

**Resolución del vault** *(tema no dictado aún)*: son los dos mecanismos de persistencia de Redis.
Seven Databases 2ª ed. cap. 8, *Day 2*, § *Durability* (impresas 278–280) los describe sin usar la
sigla RDB (habla de *snapshotting*); la documentación oficial
(https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/) usa las dos siglas.

| | **RDB** (*Redis Database*, snapshotting) | **AOF** (*Append Only File*) |
| --- | --- | --- |
| Qué guarda | una foto del dataset completo en un instante, en un archivo binario (`dump.rdb`) | un registro de **cada operación de escritura**, que se vuelve a ejecutar al arrancar |
| Cuándo escribe | cada N segundos si hubo al menos M cambios (`save 900 1`, `save 300 10`, `save 60 10000` son los defaults del libro), o a pedido con `SAVE`/`BGSAVE` | en cada escritura, con `fsync` según `appendfsync`: `always`, `everysec` (default) o `no` |
| Se activa con | viene activo por defecto | `appendonly yes` en `redis.conf` |
| Pérdida ante una caída | todo lo posterior al último snapshot (típicamente minutos) | con `everysec`, a lo sumo un segundo |
| A favor | archivo compacto, ideal para backups; reinicio más rápido con datasets grandes | mucho más durable; el log es solo de agregado y se puede reparar (`redis-check-aof`) |
| En contra | necesita `fork()` seguido, costoso con datasets grandes | archivo más grande; puede ser más lento según la política de `fsync`; se compacta con `BGREWRITEAOF` |

Se pueden **combinar** en la misma instancia; en ese caso, al reiniciar Redis reconstruye desde el
AOF, porque es el más completo (documentación oficial). El libro compara el AOF con el
*write-ahead logging* (impresa 279): es la misma idea que el WAL de
[[1.11.05 - Recovery y write-ahead logging (WAL)|Recovery y WAL]], registrar la operación antes de
darla por durable y rehacerla al recuperar.

---

## Sección E — Cassandra *(tema no dictado aún)*

Cassandra se dicta el 28/09 y el 05/10/2026 según el [[_cronograma|cronograma]], antes del parcial del 13/10.
Ninguna edición de Seven Databases la cubre; el respaldo es
[[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini]] § 5.1.2 (componentes de los
*tablet servers* de BigTable, cuyo modelo hereda Cassandra) y § 5.2 (p. 13), más la documentación
oficial de Apache Cassandra (no verificado en el motor).

### Pregunta 7 — esquema de un nodo (10 puntos)

> **Ejercicio 7 (10 puntos). Apache Cassandra.** Realice un esquema donde se pueda ver la
> composición de un nodo en Cassandra, y explique brevemente la funcionalidad de cada componente.

**Relación con el [[Parcial 2Q2025|Parcial 2Q2025]]:** son sus Preguntas 8 (componentes: SSTable,
Memtable, Commit Log) y 14 (la SSTable no está en memoria), pedidas como desarrollo.

**Respuesta de la fuente (nota manuscrita, de estudiante):** un dibujo de un recuadro *Nodo* con dos
compartimentos: *Memoria*, que contiene la **MemTable**, y *Disco*, que contiene el **commit log** y
la **SSTable**. Debajo:

> - Commit log: archivo secuencial en disco que garantiza la durabilidad, ya que si el sistema falla,
>   se puede recuperar de ahí.
> - MemTable: estructura en memoria organizada por familia de columnas. Almacena datos temporalmente
>   para responder consultas de manera rápida y reducir las escrituras al disco.
> - SSTable: archivo inmutable en disco donde se vuelca la información una vez que la MemTable
>   alcanza su tamaño límite.

**Resolución del vault** *(tema no dictado aún)*: la respuesta es correcta y completa en lo que
pide. El esquema, con el camino de una escritura:

```
escritura ──┬──▶ Commit log   (disco; solo agregar; se rehace al reiniciar)
            └──▶ MemTable     (memoria; una por tabla; ordenada)
                    │ flush al llegar al límite
                    ▼
                 SSTable, SSTable, …   (disco; inmutables; la compactación las fusiona)

lectura ◀── MemTable + SSTables
```

Coincide con Corbellini § 5.1.2 (commit log, memtable, vista fusionada de SSTables y memtable, y
*flush* de la memtable a SSTable) y con la documentación oficial
(https://cassandra.apache.org/doc/latest/cassandra/architecture/storage-engine.html): el commit log
es un log de solo agregado en disco que registra cada escritura antes de aceptarla y se rehace al
arrancar; la memtable es un caché de escritura en memoria, normalmente una por tabla, que también
sirve lecturas sin ir a disco; las SSTables son archivos inmutables que no se vuelven a escribir
después del *flush* y se combinan por compactación. Lo que le falta al manuscrito es la
**compactación** y que una lectura combina memtable y SSTables.

### Pregunta 8 — verdadero o falso sobre Cassandra (10 puntos)

> **Ejercicio 8 (10 puntos). Apache Cassandra.** Indique Verdadero o Falso. Justifique sus
> respuestas.
>
> a) El lenguaje de consulta de Cassandra sólo soporta INSERT.
> b) Cassandra no utiliza nivel de consistencia a nivel de query.
> c) Cassandra utiliza métodos para almacenar datos de forma redundante en múltiples nodos.
> d) Cassandra no utiliza el mecanismo de master-slave.
> e) Cassandra es una base NoSQL del tipo key-value.
>
> *(Junto al inciso e hay una "F" a lápiz sobre el enunciado.)*

**Respuesta de la fuente (nota manuscrita, de estudiante):**

> a) Falso, soporta SELECT, UPDATE, INSERT, DELETE, etc. similar a SQL.
> b) Falso, el nivel de consistencia se define por operación con ONE, QUORUM, ALL, etc.
> c) Verdadero, utiliza un mecanismo de replicación que garantiza la alta disponibilidad y la
> tolerancia a fallos.
> d) Verdadero, es peer-to-peer y utiliza el protocolo gossip.
> e) Falso, es NoSQL pero es wide-column (familias de columnas).

**Resolución del vault** *(tema no dictado aún)*: las cinco respuestas son correctas.

| Inciso | Respuesta | Respaldo |
| --- | --- | --- |
| a | F | CQL es *SQL-like* (Corbellini § 5.2, p. 13); la documentación oficial de CQL describe `SELECT`, `INSERT`, `UPDATE`, `DELETE` y `BATCH` (https://cassandra.apache.org/doc/latest/cassandra/developing/cql/dml.html) |
| b | F | *"Cassandra supports a per-operation tradeoff between consistency and availability through Consistency Levels"*, con `ONE`, `TWO`, `THREE`, `QUORUM`, `ALL`, `LOCAL_QUORUM`, `EACH_QUORUM`, `LOCAL_ONE` y `ANY` (https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html) |
| c | V | factor de replicación por keyspace (con `RF=3`, tres réplicas); Corbellini Table 5: replicación en anillo (*next N−1*) |
| d | V | arquitectura **peer-to-peer**, sin punto único de falla, coordinada por *gossip* (Corbellini § 5.2, p. 13); es la Pregunta 28 del [[Parcial 2Q2025\|Parcial 2Q2025]] (*"La arquitectura de Cassandra es Master-Slave"*: Falso) |
| e | F | Corbellini la clasifica como **wide-column** (Table 1 y § 5): modelo de columnas y *column families* de BigTable con mecanismos de almacenamiento de Dynamo |

(nota) El inciso e admite discusión: Cassandra toma de Dynamo, un almacén clave-valor, el
particionado por *consistent hashing*, y a veces se la describe como clave-valor particionado. Para
el examen, la clasificación de la bibliografía es wide-column, como responde el manuscrito.

---

## Sección F — MongoDB

### Pregunta 9 — replicación vs. sharding (5 puntos)

> **Ejercicio 9 (5 puntos). MongoDB.** ¿Qué diferencia existe entre Replicación y Sharding?
>
> a) El sharding busca garantizar que siempre haya copias de los datos disponibles y permite escalar
> una base de datos distribuida horizontalmente. La replicación persigue exactamente lo mismo.
> b) La replicación busca garantizar que siempre haya copias de los datos disponibles, mientras que
> el sharding permite escalar una base de datos distribuida horizontalmente
> c) El sharding busca garantizar que siempre haya copias de los datos disponibles, mientras que la
> replicación permite escalar una base de datos distribuida horizontalmente
> d) Ninguna de las anteriores

**Relación con el [[Parcial 2Q2025|Parcial 2Q2025]]:** **idéntica** a su Pregunta 21 salvo la
redacción de la opción d (aquí *"Ninguna de las anteriores"*, allí *"Ninguna de las opciones."*);
la plataforma dio por correcta la B.

**Respuesta de la fuente (nota manuscrita, de estudiante):** **b)** (encerrada en un círculo sobre
el enunciado y escrita a mano debajo de la captura).

**Resolución del vault:** ✓ correcta. Replicación = copias de los mismos datos en varios nodos, para
disponibilidad y tolerancia a fallas; sharding = partición horizontal de los datos entre nodos, para
escalar almacenamiento y carga
([[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]]). La A
atribuye lo mismo a los dos mecanismos y la C invierte los roles.

### Pregunta 10 — aggregation pipeline (15 puntos)

> **Ejercicio 10 (15 puntos). MongoDB.**
>
> a) Interprete y explique con sus palabras qué hace la siguiente query de MongoDB:
>
> ```javascript
> db.orders.aggregate( [
> { $match: { payment_method: "cash" }
> },
> { $group: { _id: "$order_date", totalQuantity: { $sum: "$quantity" } }
> }] )
> ```
>
> b) Traduzca a MongoDB la siguiente query:
>
> ```sql
> SELECT tipo, Count(*)
> FROM hospitales
> GROUP BY tipo
> ORDER BY Count(*) DESC
> ```

**Relación con el [[Parcial 2Q2025|Parcial 2Q2025]]:** el inciso a es **idéntico** a su Pregunta 15.
El inciso b no aparece allí.

**Respuesta de la fuente (nota manuscrita, de estudiante):**

> a) La query toma los pagos en efectivo, los agrupa por fecha de orden y suma la cantidad.
>
> b)
> ```javascript
> db.hospitals.aggregate([
>     {$group: {_id: "$tipo", count: {$sum: 1}}},
>     {$sort: {count: -1}},
> ]);
> ```

(En el manuscrito, las llaves externas de cada etapa se leen como corchetes; se transcriben como
llaves, que es lo que corresponde.)

**Resolución del vault:** corrida real en MongoDB 8.3.11, base `parcialxc202x`, con datos propios
(la fuente no trae datos): cuatro `orders` (dos `cash` del `2020-01-01` con cantidades 2 y 5, uno
`card` y uno `cash` del `2020-01-02` con cantidades 1 y 3) y seis `hospitales` (tres `publico`, dos
`privado`, uno `universitario`).

*a)* La pipeline del enunciado devuelve:

```
[
  { _id: '2020-01-02', totalQuantity: 3 },
  { _id: '2020-01-01', totalQuantity: 7 }
]
```

✓ El manuscrito es correcto: `$match` deja las órdenes pagadas en efectivo, `$group` arma un
documento por `order_date` (que queda en `_id`) y acumula `quantity` en `totalQuantity`. La orden
`card` del `2020-01-02` no suma. (nota) Sin `$sort`, el orden de salida de `$group` no está
garantizado: aquí salió primero la fecha más nueva. Ver
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]].

*b)* (atención) El manuscrito consulta `db.hospitals`, pero la tabla del enunciado es `hospitales`.
MongoDB no da error por una colección inexistente: devuelve vacío.

```
db.hospitals.aggregate([...])     // tal cual el manuscrito
[]
```

```
db.hospitales.aggregate([{$group: {_id: "$tipo", count: {$sum: 1}}}, {$sort: {count: -1}}])
[
  { _id: 'publico', count: 3 },
  { _id: 'privado', count: 2 },
  { _id: 'universitario', count: 1 }
]
```

Con el nombre correcto, la pipeline es correcta: `$group` por `tipo` con `{$sum: 1}` es el
`COUNT(*)` y `$sort: {count: -1}` es el `ORDER BY … DESC`. Para que la salida tenga la forma del
`SELECT` (una columna `tipo`, no `_id`), se agrega un `$project`:

```javascript
db.hospitales.aggregate([
  { $group:   { _id: "$tipo", count: { $sum: 1 } } },
  { $sort:    { count: -1 } },
  { $project: { _id: 0, tipo: "$_id", count: 1 } }
])
```

```
[
  { count: 3, tipo: 'publico' },
  { count: 2, tipo: 'privado' },
  { count: 1, tipo: 'universitario' }
]
```

`$sortByCount: "$tipo"` hace el `$group` más el `$sort` en una sola etapa y devuelve exactamente lo
mismo que la versión de dos etapas (verificado en la misma corrida).

---

## Qué enseña para el parcial 2026

- **El XC-202X y el 2Q2025 son el mismo examen en dos formatos.** El 2Q2025 lo pregunta como opción
  múltiple en plataforma; el XC-202X, como desarrollo en papel. La cadena `MovimientoUSDT`, el
  esquema `Facultad`/`Carrera`/`Materia`, replicación vs. sharding y el `aggregate` de `orders` se
  repiten casi literales: son los ejercicios más probables del 13/10.
- **Las trampas son de frontera.** `comision = 20` contra `< 20` (inciso d) y `valor = 1100` contra
  `< 1100` (inciso e): la desigualdad estricta decide. Conviene leer cada condición con el valor
  exacto antes de razonar sobre `LOCAL` o `CASCADED`.
- **Primero ubicar la vista destino.** El `CHECK OPTION` que cuenta es el de la vista a la que se
  inserta y las que están **debajo** de ella, nunca las de arriba: el error del inciso e del
  manuscrito es justificar con el `CASCADED` de una vista que la sentencia no toca.
- **Una RIR no es la única restricción en juego.** En el `UPDATE` sobre `Carrera`, las dos RIR
  invitan a razonar sobre `restrict` y `cascade`, y lo que decide es la PK compuesta duplicada. El
  estudiante cayó en la misma trampa que la plataforma corrigió en 2025.
- **Justificar con la regla, no solo con el resultado.** En la FK compuesta con `NULL` la respuesta
  completa nombra `MATCH SIMPLE` y dice qué pasaría con `MATCH FULL`/`PARTIAL`.
- **En ese examen, los temas NoSQL pesaban más de la mitad.** Neo4j (19), Redis (20) y Cassandra (20)
  sumaban 59 de los 100 puntos. En 2026, Cassandra se dicta antes del parcial del 13/10; Neo4j y
  Redis, después, y el estudiante ya había marcado Redis como *"No entra"*. Qué motores entran en
  2026 lo confirma la cátedra.
- **El enunciado usa sintaxis de otro motor** (`to_date`): si aparece, se razona igual y se
  menciona que en MySQL sería `STR_TO_DATE` o un literal de fecha.

## Dudas abiertas

- (abierto) Fecha y cuatrimestre del examen: el rótulo "XC-202X" no los da, y parece un marcador del
  estudiante más que un dato de la instancia. La inclusión de Redis como tema de parcial (marcado
  "No entra") sugiere una cursada con un cronograma distinto al de 2026.
- (abierto) Clasificación CAP de Neo4j "distribuido con particiones → CP": no tiene respaldo en la
  bibliografía obligatoria ni en el deck; solo en apuntes de estudiantes.
- (abierto) Clasificación CAP de Redis: CP (deck), CA (Seven Databases A2) o AP (Corbellini); ningún
  examen corregido por la cátedra la resuelve.
- (abierto) Si la cátedra acepta la sintaxis `CREATE CONSTRAINT ON … ASSERT` del libro o exige la
  actual `FOR … REQUIRE`.

## Enlaces

[[Mapa de exámenes|Mapa de exámenes]] · [[Parcial 2Q2025|Parcial 2Q2025]] ·
[[Parcial 2Q-2023|Parcial 2Q-2023]] · [[Práctica subida por la cátedra|Práctica subida por la cátedra]] ·
[[_cronograma|Cronograma]] · [[1.06.01 - Vistas|Vistas]] ·
[[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
[[1.03.02 - DDL — creación y alteración de tablas|DDL]] · [[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
[[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
[[1.11.05 - Recovery y write-ahead logging (WAL)|Recovery y WAL]] ·
[[Clase 06 - Vistas-Parte 1|Clase 06]] · [[Clase 07 - Vistas-Parte 2|Clase 07]] ·
[[Clase 09 - Restricciones integridad-Parte 1|Clase 09]] · [[Clase 12 - Introduccion a NoSQL|Clase 12]] ·
[[Práctica 2026-08-11|Práctica del 11/08]] · [[Práctica 2026-08-25|Práctica del 25/08]] ·
[[Práctica 2026-09-15|Práctica del 15/09]] ·
[[Seven Databases in Seven Weeks — ficha|Seven Databases]] ·
[[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini]]
