---
tipo: teorica
clase: 9
deck: "BD2_Clase 09 - Restricciones integridad-Parte 1.pdf"
unidad: 1
tema: "Restricciones de integridad"
resumen: "Restricciones de integridad: la integridad referencial con sus cinco acciones y tres tipos de matching, la jerarquía atributo→tupla→tabla→BD (DOMAIN, CHECK, ASSERTION) y los triggers cuando lo declarativo no alcanza. Criterio: contar tablas y filas; de ámbito tabla para arriba se va a trigger."
fecha: 2026-08-24
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 09
  - Clase 09 — Restricciones de integridad
  - Restricciones de integridad
  - RI
  - RIRS
  - Integridad referencial
  - Acciones referenciales
  - Tipos de matching
  - MATCH FULL
  - MATCH PARTIAL
  - MATCH SIMPLE
  - CREATE DOMAIN
  - CREATE ASSERTION
  - CHECK
  - Triggers
  - Disparadores
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 09 - Restricciones integridad-Parte 1.pdf"
  - "raw/Unidad-01/Teorica/Ejercicios de RI/Ejercicio 1 - RIR.png"
  - "raw/Unidad-01/Teorica/Ejercicios de RI/Ejercicio 2 - RIR.png"
estado: procesado
---

# Clase 09 — Restricciones de integridad (Parte 1)

## Resumen general

Una **restricción de integridad (RI)** es una condición que los datos deben cumplir para que la
instancia de la base sea *legal*: el DBA la declara y el SGBD la fuerza, rechazando la operación o
reparándola. El deck (39 slides, teórica del 24/08) recorre tres capas: clasificación de RI
*(slides 2–5)*; las RI ya usadas sin nombrarlas —`NOT NULL`, `UNIQUE`, `PRIMARY KEY`— y la
**integridad referencial**, con cinco acciones y tres tipos de matching *(slides 6–14)*; y la
jerarquía declarativa **atributo → tupla → tabla → base de datos**, con `CREATE DOMAIN`, `CHECK` de
registro, `CHECK` de tabla y `CREATE ASSERTION` *(slides 15–24)*. El tercio final *(slides 16, 25–38)* es **triggers**, que el cronograma ubica una semana después: el
TP6 del 25/08, *Restricciones declarativas*, no los usa.

Las acciones referenciales se disparan sobre la tabla **referenciada**, nunca sobre la
referenciante; `RESTRICT` se evalúa antes de las reparaciones y
`NO ACTION` al final, y ante dos reglas en conflicto manda la restrictiva. El matching solo importa
con una FK **compuesta y nullable**: `SIMPLE` acepta con un solo nulo, `PARTIAL` exige que los no
nulos coincidan y `FULL` prohíbe la mezcla. El ámbito se decide **contando tablas y filas**: una
tabla-una fila es tupla; una tabla-varias filas es tabla; varias tablas es assertion. Un `CHECK`
se cumple con VERDADERO **o DESCONOCIDO** —`NULL` pasa—; el `WHEN` de un trigger dispara solo con
VERDADERO. Un trigger **no es una RI** ni valida lo ya cargado: se usa cuando lo declarativo no
alcanza.

El deck es de **PostgreSQL**; en **MySQL** no existen `CREATE DOMAIN`, `MATCH`, `SET DEFAULT`,
`FOR EACH STATEMENT`, `INSTEAD OF` ni `WHEN`. El corte del TP6 3.c vale en cualquier motor: **de
ámbito tabla para arriba se va a trigger**, porque ninguno acepta subconsulta en `CHECK` ni
implementa `ASSERTION`.

## Fuente, alcance y motor

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 09 - Restricciones integridad-Parte 1.pdf` · **39 slides**.
> El slide 1 es la **portada** (*"Bases de Datos II · RESTRICCIONES DE INTEGRIDAD"*), el 39 la
> bibliografía; no hay slide de agenda. Dictado en la **teórica del lunes 24/08**.
> Clase anterior: [[Clase 08 - Explicando el plan]] *(del 10/08 — el lunes 17/08 fue feriado)*.
> Se practica con el **TP6 Restricciones declarativas** del martes 25/08 → [[Práctica 2026-08-25]].
> Bibliografía: [[_index-bibliografia]] › Clase 09. Qué archivo es de qué clase: [[_index-clases]].
> El § *Material complementario del 25/08* documenta además los **dos PNG sin número de clase**
> archivados junto al deck: dos ejercicios de restricciones (`Ejercicio 1 - RIR.png`,
> `Ejercicio 2 - RIR.png`). No son clases y por eso no tienen página propia.

> [!warning] (crítico) Un tercio del deck son triggers, y la *Parte 2* es **otra clase**
> **13 de los 39 slides** (el 16 y los 25 a 38) son **triggers**: sintaxis, granularidad,
> `:new`/`:old`, cascadas, ejemplos en PL/pgSQL y el modelo de ejecución SQL-99. El [[_cronograma]]
> pone *"Triggers y SQL Procedural"* en la teórica del **lunes 31/08**: el deck se adelanta a su
> propio cronograma. El **TP6 del martes 25/08 no toca triggers** (sus tres ejercicios son RIR,
> `CHECK` y `ASSERTION`): para el TP6 alcanza con los slides 2–24.
>
> La *Parte 2* llegó como `BD2_Clase 10 - Restricciones integridad-Parte 2.pdf` (20 slides, dictado
> el 31/08) y **es la [[Clase 10 - Restricciones integridad-Parte 2]]**, no la misma clase: el
> número de la cátedra manda sobre el sufijo `Parte N`. Y **no repite los slides 25–38**: no trae
> una sola sentencia `CREATE TRIGGER`, ni granularidad, ni `:new`/`:old`, ni cascadas; sus slides 17
> y 19 **presuponen** ese vocabulario. **La sintaxis de triggers se estudia aquí**; el lenguaje
> procedural del cuerpo —funciones, stored procedures, cursores—, allá.
> Página de concepto: [[1.09.04 - Triggers|Triggers]].

> [!warning] El deck está escrito contra **PostgreSQL**
> Es el séptimo deck de la U1 con motor ajeno (`01`, `03`, `04`, `05-P1`, `07`, `08` y `09`; la
> [[Clase 10 - Restricciones integridad-Parte 2|Clase 10]] es el octavo), y lo dice con todas las
> letras: **Slide 27**, título *"TRIGGERS – **SINTAXIS PostgreSQL**"*; **Slide 12**, *"MATCH SIMPLE
> (Opción por defecto para SQL estandar **y PostgreSQL**)"*; **Slide 36**, función de ejemplo en
> **PL/pgSQL** (`RETURNS trigger AS $body$ … LANGUAGE 'plpgsql'`); **Slide 39**, primera fuente
> *"Capitulo 36 del Manual de PostgreSQL"*.
>
> La cursada corre sobre **[[MySQL]]** y el propio **TP6 lo asume**: su ejercicio 3.c pide *"las
> restricciones que puedan ser soportadas por MySQL"*. Traducción sentencia por sentencia en
> [[MySQL]] § *5 · Restricciones e integridad*; inventario de qué deck es de qué motor en
> [[PostgreSQL]].

> [!quote] La bibliografía que declara el deck (slide 39)
> - *"Capitulo 36 del Manual de **POstgreSQL**"* — `www.postgresql.org` *(sic: la mayúscula
> descolocada está en el slide)*
> - Date, C., *"An Introduction to Database Systems"*. **7º ed.**, Addison Wesley, **2000**
> - Elmasri, R., Navathe, S., *"Fundamentals of Database Systems"*, Addison Wesley, 2011
> - Silberschatz, A., Korth, H, Sudarshan, S., *"Database System Concepts"*, McGraw Hill, 2001
> - Sumathi S., Esakkirajan S., *Fundamentals of Relational Database Management Systems*, 2007
>
> (1) El deck cita la **7ª edición de Date (2000)**; el vault tiene la **8ª (2004)**, donde el
> capítulo de integridad es el **9** (verificado contra el índice del PDF, [[_index-bibliografia]] ›
> Clase 09): **citar siempre por la 8ª**. (2) **Sumathi & Esakkirajan sigue sin estar en el vault**;
> también la reclama el slide 2 de la [[Clase 06 - Vistas-Parte 1]].

---

## Slide 2 · Concepto de RI

> [!quote] La frase con la que abre el deck
> *"Un SGBD debe ayudar a prevenir el ingreso incorrecto de datos"*

Definición textual: las RI son *"condiciones que restringen los valores en la BD"*, una
*"descripción de estados correctos en tiempo de diseño"* que *"previenen inconsistencias"*; y
*"forzar las RI → garantizar **instancias legales** de la BD"*. **Instancia legal** —la que satisface
todas las RI declaradas— es el mismo sentido de "consistente" que la **C de ACID**.

### Los tres ejemplos del slide

Cada uno es de un tipo distinto:

| Ejemplo (textual) | Qué tipo de RI es | Cómo se implementa |
| --- | --- | --- |
| *"Los nombres y apellidos de los voluntarios no pueden ser nulos"* | de **atributo**, de estado | `NOT NULL` |
| *"Un voluntario no puede aportar más de 10 horas semanales."* | de **tupla** o de **tabla** según el modelo, de estado | `CHECK` |
| *"Un voluntario puede cambiar de tarea o de institución solamente dos veces al año."* | de **transición de estados** | (atención) **no es declarativa** → trigger |

> [!tip] El tercer ejemplo es la trampa del slide
> *"cambiar … solamente dos veces al año"* **no se puede escribir con un `CHECK`**: compara el estado
> nuevo contra el **historial**, y `CHECK` solo ve la fila que se inserta o actualiza. Es la
> **RI de transición de estados** del slide 4, y el caso con el que el slide 25 justifica los
> triggers.

## Slide 3 · Cómo se mantiene la integridad

| Actor | Qué hace | Cómo |
| --- | --- | --- |
| **DBA** | *"especifica las RI sobre los datos"* | → *"código en las aplicaciones que acceden a los datos"*<br>→ *"restricciones (reglas o chequeos) **EN** la BD que interpreta el SGBD"* |
| **SGBD** | *"evita actualizaciones en los datos que no cumplan las RI"* | → *"rechazando la operación (insert, delete, update)"*<br>→ *"realizando acciones reparadoras extras"* |

> *"ambas respuestas deben dejar la BD en un estado consistente"*

> [!important] Las dos vías del DBA **no son equivalentes**, y esto se pregunta
> | | RI en el **código de la aplicación** | RI **en la BD** |
> | --- | --- | --- |
> | Alcance | solo las operaciones que pasan por esa app | **todas**, incluida la consola y otra app |
> | Duplicación | una copia por aplicación | una sola |
> | Datos ya cargados | no los revisa | la RI declarativa **sí** *(slide 37)* |
> | Quién la mantiene | el equipo de desarrollo | el DBA, en un solo lugar |
>
> Es el argumento de **Silberschatz § 1.2** para abandonar los sistemas de archivos: *"Problemas de
> integridad … es difícil cambiar los programas para hacer cumplir esas restricciones …
> especialmente cuando las restricciones implican diferentes elementos de datos de diferentes
> archivos"*. Ver [[_index-bibliografia]] › Clase 09.

## Slides 4–5 · Clasificación de las RI

Dos clasificaciones ortogonales: toda RI tiene un valor en cada eje.

### Eje 1 — según su naturaleza *(slide 4)*

| Tipo | Textual del slide | Ejemplo |
| --- | --- | --- |
| **Inherente** | *"se asumen por definición del modelo de datos y no se requiere especificaciones adicionales"* | en el modelo relacional: no hay filas duplicadas; los atributos son atómicos (1FN) |
| **Implícita** | *"provienen del modelo de datos (representada en el esquema) y se especifican durante la creación del esquema"* | `PRIMARY KEY`, `FOREIGN KEY`, el tipo de dato de la columna |
| **Explícita** | *"establecen restricciones adicionales y se pueden incorporar a la BD. **Declarativa o Procedural**"* | `CHECK`, `ASSERTION` (declarativas) · triggers (procedural) |

> [!note] **"Declarativa o Procedural"**, al final de la fila *Explícita*, estructura el deck: los
> slides 15–24 son la rama **declarativa** y los 25–38 la **procedural**. El TP6 (*"Restricciones
> **declarativas**"*) cae enteramente del lado izquierdo.

### Eje 2 — según los estados involucrados *(slide 4)*

| Tipo | Textual del slide | Qué mira |
| --- | --- | --- |
| **RI de estado** | *"restringe los valores que pueden tomar los datos en un momento"* | **una** instancia |
| **RI de transición de estados** | *"restringe los posibles cambios de valores entre estados sucesivos de los datos"* | el par (instancia vieja, instancia nueva) |

> [!important] Solo las **de estado** son declarables con `CHECK`/`ASSERTION`
> Una `CHECK` evalúa la fila resultante y **no puede mirar el valor anterior**. *"No puede bajar"*,
> *"solo se puede cambiar N veces"*, *"la fecha nueva debe ser posterior a la vieja"* son **de
> transición** y necesitan un trigger, que sí tiene `:old` y `:new` *(slide 30)*. El ejemplo estrella
> del slide 34 —*"Verificar que el sueldo de un empleado **no se reduzca**"*, con
> `WHEN (:old.sueldo > :new.sueldo)`— es una RI de transición, y por eso es ése.

### Slide 5 · Las cinco RI de estado

| RI | Textual del slide |
| --- | --- |
| **Unicidad** | *"no puede haber claves repetidas"* |
| **No Nulidad** | *"el valor de un atributo no puede ser nulo"* |
| **Dominio** | *"los valores de un atributo deben pertenecer a un conjunto (dominio) definido"* |
| **Cardinalidad de una relación** | *"el número de veces que una entidad participa de una relación"* — ej.: *"Los empleados sólo pueden participar en un máximo de 5 proyectos"* |
| **Participación en una relación** | *"participación obligatoria u opcional en una relación"* — ej.: *"Un empleado debe (o puede) estar vinculado a un área"* |

> [!tip] Las dos últimas vienen del [[1.02.02 - Modelo Entidad-Relación|MER]] como anotaciones del
> diagrama; aquí se las nombra como RI, y queda claro cómo se fuerza cada una en el esquema:
>
> | Del DER | Cómo se fuerza en el esquema |
> | --- | --- |
> | participación **parcial** (0,N) | FK que **admite nulos** |
> | participación **total** (1,N) | FK **`NOT NULL`** |
> | cardinalidad **máx. 1** | FK + `UNIQUE`, o la FK dentro de la PK |
> | cardinalidad **máx. N**, N>1 | (atención) **no hay forma declarativa simple** → `CHECK` de tabla con subconsulta, `ASSERTION` o trigger |
>
> La cuarta fila es el ejemplo *"máximo de 5 proyectos"* del propio slide 5 y el ejercicio **3.B.6
> del TP6** (*"Cada proveedor no puede proveer más de 20 productos"*), ver [[Práctica 2026-08-25]].
> La notación de participación total/parcial sigue sin definirse (duda abierta desde
> [[Clase 02 - Modelo Entidad-Relacion]]).

## Slide 6 · Restricciones de no-nulidad y de unicidad

Gramática textual del slide *(`{}` = repetición, `[]` = opcional)*:

```sql
CREATE TABLE NombreTabla
( { nom_col TipoDato [NOT NULL] [DEFAULT valorDefecto], … }
  [ [CONSTRAINT PK_nom] PRIMARY KEY (lista_col_PK),]
  { [ [CONSTRAINT nom_restr] UNIQUE (lista_col),] }
... );
```

```sql
ALTER TABLE NombreTabla
  ADD [CONSTRAINT PK_nom] PRIMARY KEY (lista_col_PK);
```

> [!quote] Al costado del bloque de `CONSTRAINT nom` el slide dice **"Recomendable!"**
> **Nombrar siempre las restricciones**: una sin nombre no se puede borrar sin ir a buscar al
> catálogo el nombre autogenerado. El TP6 lo asume: su ejercicio 1.a manda
> `ALTER TABLE … ADD CONSTRAINT R1 …`, con los nombres `R1`–`R4` puestos por la cátedra.

> [!note] `NOT NULL`, `DEFAULT`, `PRIMARY KEY` y `UNIQUE` ya se dieron en la
> [[Clase 03 - Derivación a Esquema Lógico]] como sintaxis de `CREATE TABLE`. La novedad es el
> **nombre del concepto** —RI implícitas de estado— y su lugar en la jerarquía del slide 15. La hoja
> de sintaxis sigue siendo [[1.03.02 - DDL — creación y alteración de tablas|DDL]].

---

## Slides 7–8 · Integridad referencial (RIRS)

### La definición *(slide 7)*

> [!quote] Textual
> *"Una **clave extranjera** (FOREIGN KEY en SQL) de una tabla A (**referenciante**) es un conjunto no
> vacío de columnas cuyos valores coinciden con los valores de otro conjunto de columnas, que son
> clave de otra tabla B (**referenciada**)"*
>
> *"Nota: A y B podrían ser la misma tabla."*
>
> *"Las claves extranjeras (FOREIGN KEY) especifican relaciones entre tablas y permiten mantener la
> consistencia entre registros de esas tablas"*

> [!important] La regla de integridad referencial, textual del recuadro del slide 7
> *"El conjunto de valores de la clave extranjera de una tabla A debe coincidir al menos con un valor
> de la clave primaria de la tabla B, a la que hace referencia, **o bien ser nulo**"*

Las tres palabras que importan:

- **"clave"**, no *"clave primaria"*, en la definición: el estándar admite referenciar cualquier clave
  candidata (`UNIQUE`). El recuadro dice *"clave primaria"*: simplificación del deck.
- **"al menos"**: la FK no exige unicidad del lado referenciante; muchas filas de A pueden apuntar a
  la misma de B, y eso es lo que modela un 1:N.
- **"o bien ser nulo"**: abre el tema de **matching** de los slides 12–14. Con FK de **una** columna,
  *nulo* es inequívoco; con **varias**, hay que decidir qué pasa cuando **algunas** son nulas.

**RIRS** es la sigla del deck para *Restricciones de Integridad Referencial*; la `S` final aparece
solo en los títulos y no se explica. El TP6 usa **RIR**.

### La sintaxis *(slide 8)*

```sql
CREATE TABLE NombreTabla
( { nombre_columna TipoDato [NOT NULL] … }
  [ [CONSTRAINT PK_nom] PRIMARY KEY (lista_columnasPK),]
  { [ [CONSTRAINT U_nom] UNIQUE (lista_columnas),] }
  { [ [CONSTRAINT FK_nom] FOREIGN KEY (lista_columnasFK)
  REFERENCES nombreTablaRef [(lista_columnasRef)]
  [ MATCH {FULL | PARTIAL | SIMPLE}]
  [ON UPDATE AccionRef]
  [ON DELETE AccionRef] ] } ….. );
```

```sql
ALTER TABLE NombreTabla
  ADD CONSTRAINT FK_nom FOREIGN KEY (lista_columnasFK) …;
```

> [!quote] La lista de acciones, textual del pie del slide
> `AccionRef = NO ACTION | CASCADE | SET NULL | SET DEFAULT | RESTRICT`

**Cinco** acciones, dos eventos (`ON UPDATE`, `ON DELETE`) y **tres** tipos de matching: todo el
espacio de diseño de una FK, y el TP6 lo recorre entero.

> [!warning] Cuatro cosas de esta gramática **no funcionan igual en MySQL**
> | Del slide | En **MySQL/InnoDB** |
> | --- | --- |
> | `MATCH {FULL\|PARTIAL\|SIMPLE}` | se **parsea y se ignora**: InnoDB siempre se comporta como `MATCH SIMPLE` |
> | `SET DEFAULT` | InnoDB **rechaza la definición de la tabla**: no la implementa |
> | `NO ACTION` ≠ `RESTRICT` | InnoDB los trata **igual**, porque no tiene chequeo diferido |
> | `REFERENCES` *inline* en la columna | se acepta sintácticamente pero **no crea la FK** |
>
> Detalle y nivel de certeza en [[MySQL]] § *5 · Restricciones e integridad*. Las dos primeras filas
> rompen el TP6: **los ejercicios 1.c y 2.b de matching no se pueden correr en MySQL**; son de lápiz
> y papel.

---

## Slides 9–10 · Acciones referenciales

Misma estructura, distinto evento. La pregunta de cada uno, textual:

- *Slide 9* — *"¿Qué sucede si se intenta **borrar (delete)** un registro en la Tabla_B que está
  siendo referenciada en la Tabla_A por la FK?"*
- *Slide 10* — *"¿Qué sucede si se intenta **modificar (update) la clave primaria** de un registro en
  la Tabla_B que está siendo referenciada en Tabla_A por la FK?"*

> [!important] La pregunta es siempre sobre la tabla **referenciada** (B), nunca sobre la A
> Las acciones referenciales se disparan solo cuando se toca la fila **apuntada**. Si se inserta o
> modifica una fila de la **referenciante** (A) no hay acción referencial: hay un **chequeo** (el
> valor nuevo existe en B, o es nulo). Es el error nº 1 del TP6: su ejercicio **1.b.v**,
> `UPDATE TRABAJA_EN SET IdProy = 3 WHERE IdProy = 1`, es sobre la **referenciante** y ninguna
> acción referencial aplica. Ver [[Práctica 2026-08-25]].

### Las cinco acciones, en las dos familias del deck

#### Familia 1 — *"Rechazo de la operación"*

| Acción | Textual del slide |
| --- | --- |
| **`NO ACTION`** | *"no permite borrar un registro cuya clave primaria está siendo referenciada por un registro en la Tabla_A (**es la opción por defecto**)"* |
| **`RESTRICT`** | *"misma semántica que NO ACTION, pero **se chequea antes de las otras RI**"* |

#### Familia 2 — *"Acepta la operación y realiza acciones reparadoras adicionales"*

Línea común del slide: *"borra el registro en la Tabla_B **y** …"*

| Acción | Textual del slide |
| --- | --- |
| **`CASCADE`** | *"se propaga el borrado a todos los registros que referencian a dicha clave primaria mediante la FK en la Tabla_A"* |
| **`SET NULL`** | *"les coloca nulos en la FK de los registros que referencian a dicha clave primaria en la Tabla_A (**sólo si admite nulos**)"* |
| **`SET DEFAULT`** | *"les coloca el valor por defecto en la FK de los registros que referencian a dicha clave primaria en la Tabla_A"* |

### `NO ACTION` vs. `RESTRICT`

El deck lo contesta dos veces: el slide 9/10 (*"misma semántica … pero **se chequea antes de las
otras RI**"*) y el diagrama del slide 38, con tres cajas en este orden: `Apply RESTRICT Rules` →
`Apply CASCADE, SET NULL, SET DEFAULT Rules` → `Apply NO ACTION Rules and Evaluate Constraints`.

> [!important] La diferencia operativa
> **`RESTRICT` corta antes de que pase nada**: aborta apenas ve una fila referenciante, antes de las
> reparaciones de las otras FKs. **`NO ACTION` corta al final**: deja ejecutar las otras acciones
> referenciales y después mira si quedó alguna violación; si una reparación eliminó la fila
> conflictiva, la operación **pasa**. Por eso `NO ACTION` es compatible con el **chequeo diferido**
> (`SET CONSTRAINTS … DEFERRED`) y `RESTRICT` no.
>
> (atención) **Nada de esto se ve en MySQL**: InnoDB no tiene chequeo diferido y trata las dos
> palabras igual. La distinción es **de parcial, no de TP**.

> [!note] Dos reglas sobre la misma fila: **manda la restrictiva**
> Si una FK dice `CASCADE` y otra `RESTRICT` sobre la misma fila referenciada, la operación se
> **rechaza** y la cascada nunca ocurre: `RESTRICT` se evalúa **primero** (slide 38). Es el ejercicio
> **1.b.vi** del TP6 (`UPDATE PROYECTO SET IdProy = 5 WHERE IdProy = 2`, con R2 `ON UPDATE CASCADE`
> y R3 `ON UPDATE RESTRICT`), resuelto en [[Práctica 2026-08-25]].

## Slide 11 · El ejemplo de acciones referenciales

DER y esquema del slide:

```
  (0,N)  (0,1)
 EMPLEADO ──────────── R ──────────── AREA

 EMPLEADO(idE, nombre, .., AreaT)  AREA(idArea, … )
```

```sql
CREATE TABLE Empleado (…);
CREATE TABLE Area (…);
ALTER TABLE Empleado
  ADD CONSTRAINT FK_R
  FOREIGN KEY (AreaT) REFERENCES Area
  ON UPDATE ….
  ON DELETE ….;
```

La instancia, y las cinco operaciones a analizar *(textual: "considerar la instancia dada para las
tablas y result. **individuales, no acumulativos**")*:

| EMPLEADO | | | |
| --- | --- | --- | --- |
| **IdE** | Nombre | … | **AreaT** |
| 1 | E1 | … | 101 |
| 2 | E2 | … | 101 |

| AREA | |
| --- | --- |
| **IdArea** | … |
| 101 | … |
| 102 | … |

```sql
DELETE FROM Area WHERE IdArea = 101;
DELETE FROM Area WHERE IdArea = 102;
DELETE FROM Area;
UPDATE Area SET IdArea = 201 WHERE IdArea = 101;
UPDATE Area SET IdArea = 202 WHERE IdArea = 102;
```

> [!bug] En el PDF, la columna `AreaT` de `EMPLEADO` está **tapada por un recuadro** violeta: no se
> lee ni el encabezado ni los valores. **La capa de texto del PDF sí los tiene**: `101` para los dos
> empleados. Sin esa columna el ejercicio no se puede resolver.

### La resolución, acción por acción

Razonamiento propio (el slide plantea el ejercicio y no lo resuelve). Los dos empleados apuntan a
`101`; **`102` no está referenciada por nadie**.

| Operación | `NO ACTION` / `RESTRICT` | `CASCADE` | `SET NULL` | `SET DEFAULT` |
| --- | --- | --- | --- | --- |
| `DELETE … IdArea = 101` | ✗ rechaza | ✓ borra el área **y los dos empleados** | ✓ `AreaT = NULL` en los dos | ✓ `AreaT = <default>` en los dos |
| `DELETE … IdArea = 102` | ✓ pasa | ✓ pasa | ✓ pasa | ✓ pasa |
| `DELETE FROM Area;` *(las dos filas)* | ✗ rechaza *(por la 101)* | ✓ borra **todo**: 2 áreas y 2 empleados | ✓ `AreaT = NULL` en los dos | ✓ `AreaT = <default>` en los dos |
| `UPDATE … IdArea = 201 WHERE IdArea = 101` | ✗ rechaza | ✓ los dos empleados pasan a `AreaT = 201` | ✓ `AreaT = NULL` en los dos | ✓ `AreaT = <default>` |
| `UPDATE … IdArea = 202 WHERE IdArea = 102` | ✓ pasa | ✓ pasa | ✓ pasa | ✓ pasa |

> [!warning] Tres trampas de esta tabla
> 1. **`SET NULL` solo funciona si `AreaT` admite nulos** (*"sólo si admite nulos"*, slide 9). Con
> `NOT NULL`, la acción falla y la operación se rechaza: un `SET NULL` que se comporta como
> `RESTRICT`. Aquí `AreaT` **es** nullable: el DER dice `(0,1)`.
> 2. **`SET DEFAULT`**: sin `DEFAULT` declarado, el default es `NULL` y se reduce al caso anterior;
> con uno, **ese valor tiene que existir en `AREA`** o la operación también falla. Por eso InnoDB
> no lo implementa.
> 3. **`SET NULL` sobre `UPDATE`**: el empleado **pierde el área**, no la sigue. `CASCADE` mantiene
> el vínculo, `SET NULL` lo rompe; tiene sentido en `ON DELETE`, no en `ON UPDATE`.

> [!figura] lab-acciones-referenciales
> Pruebe las operaciones del slide con cada acción referencial y compare el resultado con esta tabla.

---

## Slides 12–14 · Tipos de matching

### Cuándo importa *(slide 12)*

> [!quote] Textual
> *"Los tipos de matching afectan cuando las FK se definen **sobre varios atributos**, y pueden
> contener valores nulos"*
>
> *"Indican los requisitos que deben cumplir los conjuntos de valores de atributos de la FK en R,
> respecto de los correspondientes en la clave referenciada en R´"*
>
> - *"MATCH SIMPLE (**Opción por defecto** para SQL estandar y PostgreSQL)"*
> - *"MATCH PARTIAL"*
> - *"MATCH FULL"*

> [!important] **`MATCH` solo hace algo si (a) la FK es compuesta y (b) admite nulos.** Con una FK
> de una sola columna, o con todas sus columnas `NOT NULL`, las tres opciones son indistinguibles.
> Un ejercicio de matching en el parcial tendrá una FK de dos o más columnas y nullable, como los
> dos primeros del TP6.

### Las tres reglas *(slide 13)*

> [!quote] Textual del slide, respetando su estructura
> *"La integridad referencial se satisface si para cada tupla en la tabla referenciante se verifica lo
> siguiente:*
>
> *Ninguna de las columnas de la FK es NULL y existe una tupla en la tabla referenciada cuyos valores
> de clave coinciden con los de tales columnas, **o***
> - *Al menos una de las columnas en la FK es NULL (**MATCH SIMPLE**) y puede o no el resto hacer
> referencia a la PK*
> - *Los valores de los atributos no nulos de la FK se corresponden con los correspondientes valores
> de la clave, al menos en una tupla de la tabla referenciada (**MATCH PARTIAL**)*
> - *Todas las columnas de la FK son NULL (**MATCH FULL**) o hacen referencia a la PK completa"*

Reescrito como reglas operativas, la forma en que conviene tenerlo para el TP y el parcial:

| Estado de la FK | `SIMPLE` | `PARTIAL` | `FULL` |
| --- | :---: | :---: | :---: |
| **Ningún** valor nulo, y la combinación **existe** en la referenciada | ✓ | ✓ | ✓ |
| **Ningún** valor nulo, y la combinación **no existe** | ✗ | ✗ | ✗ |
| **Todos** los valores nulos | ✓ | ✓ | ✓ |
| **Algunos** nulos, y los no nulos **coinciden** con alguna tupla | ✓ | ✓ | ✗ |
| **Algunos** nulos, y los no nulos **no coinciden** con ninguna | ✓ | ✗ | ✗ |

> [!tip] Mnemotecnia: **cuántos nulos hacen falta para zafar**
> - **`SIMPLE`** — *"con un nulo alcanza"*: un solo nulo y el chequeo se saltea entero. El más
> permisivo, y el default.
> - **`PARTIAL`** — *"los nulos zafan; el resto tiene que coincidir"*: ignora las columnas nulas pero
> **exige que las no nulas machen** contra alguna tupla.
> - **`FULL`** — *"todo o nada"*: o todas nulas, o ninguna nula y coincidiendo. **Prohíbe la mezcla.**
>
> De más a menos permisivo: **`SIMPLE` ⊇ `PARTIAL` ⊇ `FULL`**. **Nunca puede haber un `ok` en `FULL`
> con una `X` en `SIMPLE`**: es el chequeo de sanidad.

> [!note] `FULL` es el que se **quiere** casi siempre, y `SIMPLE` el que se **tiene**
> Una FK compuesta a medio llenar —*"sé la zona pero no el número de cliente"*— es un dato a medio
> cargar, y `MATCH FULL` lo prohíbe. Pero el default del estándar es `SIMPLE`, y **MySQL solo tiene
> `SIMPLE`**: para tener `FULL` en MySQL hay que agregarlo a mano con un `CHECK` *(razonamiento
> propio; fuerza el "todo o nada", la coincidencia con la PK ya la da la FK)*:
>
> ```sql
> CHECK ( (Zona IS NULL AND NroC IS NULL)
> OR (Zona IS NOT NULL AND NroC IS NOT NULL) )
> ```

### El ejemplo del slide 14

DER del slide: `EMPLEADO ──(0,N)── Pertenece ──(0,1)── AREA`, con `IdEmp` como clave de EMPLEADO y
**`CodArea` compuesta por `TipoA` + `IdArea`** en AREA. La FK de EMPLEADO es `(TipoA, IdArea)`:
**compuesta y nullable**, la condición de entrada del slide 12.

> [!quote] La consigna, textual
> *"Analizar la posibilidad de alta de las sig. tuplas en T-EMPLEADO según los distintos tipos de
> matching (suponiendo que la FK admita nulos)"*

**AREA** *(las filas relevantes; el slide antepone un `…`)*:

| TipoA | IdArea |
| --- | --- |
| A | 1 |
| B | 1 |
| B | 2 |

**Las cinco altas y su veredicto, tal cual el slide:**

| IdEmp | TipoA | IdArea | Simple | Parcial | Full |
| ---: | --- | --- | :---: | :---: | :---: |
| 1 | `A` | `1` | ok | ok | ok |
| 2 | `A` | `2` | ✗ | ✗ | ✗ |
| 3 | `null` | `null` | ok | ok | ok |
| 4 | `null` | `1` | ok | ok | ✗ |
| 5 | `C` | `null` | ok | ✗ | ✗ |

**Por qué cada una** *(el slide da la tabla sin justificar; reconstrucción propia)*:

| # | Razón |
| --- | --- |
| **1** | Sin nulos y `(A,1)` **está** en AREA → pasa las tres. |
| **2** | Sin nulos y `(A,2)` **no está**. (atención) **Existe `A` como TipoA y existe `2` como IdArea, pero no juntos.** Es la trampa central del tema: el matching es **por combinación**, no columna por columna. |
| **3** | Todo nulo → pasa las tres, incluida `FULL`. |
| **4** | Mezcla. `SIMPLE`: hay un nulo, listo. `PARTIAL`: el no nulo es `IdArea = 1`, y **hay** tuplas con `IdArea = 1` — `(A,1)` y `(B,1)` —, así que pasa. `FULL`: mezcla → rechaza. |
| **5** | Mezcla. `SIMPLE`: hay un nulo, pasa. `PARTIAL`: el no nulo es `TipoA = 'C'`, y **no hay ninguna** tupla con `TipoA = 'C'` → rechaza. `FULL`: mezcla → rechaza. |

> [!important] Las filas 4 y 5 son las que distinguen `PARTIAL` de `FULL` y de `SIMPLE`
> Tienen la **misma forma** —un nulo y un no nulo— y **dan distinto en `PARTIAL`** según si el valor
> no nulo aparece en alguna tupla de la referenciada. Si un ejercicio de matching tiene una sola fila
> interesante, es una de estas dos. El TP6 lo repite calcado: sus casos **1.c.i** `(B, null)` y
> **1.c.iv** `(null, 3)` son las filas 5 y 4 de este slide. Ver [[Práctica 2026-08-25]].

---

## Slides 15–16 · Las otras restricciones declarativas

### La jerarquía *(slide 15)*

> [!quote] Textual
> *"Además de las anteriores, se puede requerir otras RI específicas sobre los datos según la
> estrategia de funcionamiento de la organización"*
>
> *"La especificación declarativa de RI sigue la **estructura jerárquica del modelo relacional
> (atributo→tupla→tabla→BD)**:"*
>
> - *"RI **Dominio** (DOMAIN)"*
> - *"RI de tabla asociada a uno ó más atributos (**CHECK de registro**)"*
> - *"RI de tabla asociada a varias tuplas (**CHECK de tabla**)"*
> - *"RI generales de la base de datos (**ASSERTION**)"*
>
> *"Se activan siempre que se realice alguna operación sobre los datos afectados por la restricción"*
> · *"Su incumplimiento promueve el **rechazo** de la operación"*

> [!important] La tabla que hay que saber de memoria: es el ejercicio 3.a del TP6
> El TP6 pide clasificar nueve restricciones en estas cuatro categorías y elegir el recurso. La regla
> de decisión, en una pregunta: **¿cuántas cosas hay que mirar para saber si se cumple?**
>
> | Ámbito | Alcanza con mirar… | Recurso SQL-1999 | Cómo se reconoce |
> | --- | --- | --- | --- |
> | **atributo / dominio** | **una columna** de una fila | `CREATE DOMAIN` + `CHECK`, o `CHECK` en la columna | *"el sueldo debe ser > 0"*, *"la nacionalidad debe estar en esta lista"* |
> | **registro / tupla** | **varias columnas de la misma fila** | `CHECK` de tabla *(sin subconsulta)* | *"la fecha de ascenso debe ser posterior a la de ingreso"* |
> | **tabla** | **varias filas de la misma tabla** | `CHECK` de tabla *(con subconsulta)* | *"no más de 30 empleados por área"* — hay un **conteo** o un **agregado** |
> | **base de datos** | **más de una tabla** | `CREATE ASSERTION` | *"el sueldo no puede superar al del gerente de su área"* |
>
> **Contar tablas y contar filas.** Una tabla y una fila → tupla. Una tabla y varias filas → tabla.
> Varias tablas → assertion.

> [!warning] La palabra **"tabla"** del deck confunde
> El slide llama a las dos del medio *"RI de tabla asociada a…"* porque las dos se escriben con
> `CHECK` en un `ALTER TABLE`, pero **el ámbito es distinto** y el TP6 pide el ámbito, no el recurso.
> En la columna *Tipo de restricción* del TP va **"de registro/tupla"** o **"de tabla"** según
> cuántas filas mire, no según la sentencia.

### La otra alternativa *(slide 16)*

> [!quote] Textual
> *"Otra alternativa para especificar RI → **SQL Procedural**: **DISPARADORES (TRIGGERS)** → Es una
> pieza de código almacenada en la BD que "se dispara" automáticamente ante la ocurrencia de algún
> evento · **PROCEDIMIENTOS** · **FUNCIONES**"*
>
> *"Recurso útil ante la **imposibilidad de definir en los DBMS**:"*
> - *"restricciones complejas en forma declarativa"*
> - *"ciertas acciones referenciales"*
> - *"acciones específicas de reparación"*

Primera mención de triggers; la justificación completa vuelve en el slide 25.

---

## Slides 17–19 · RI de dominio / atributo

### Qué son *(slide 17)*

> [!quote] Textual
> - *"Permiten definir el conjunto de los valores válidos de un atributo"*
> - *"Casos particulares: **NOT NULL, DEFAULT, PRIMARY KEY, UNIQUE**"*
> - *"Ámbito de la restricción: **atributo**"*
> - *"Se pueden especificar las RI del atributo en la sentencia CREATE TABLE **o definirlas en un
> dominio** y declarar el atributo perteneciente al dominio"*

```sql
CREATE DOMAIN NomDominio
AS TipoDato [ DEFAULT ValorDefecto ]
[ [CONSTRAINT NomRestriccion] CHECK (condición);
```

> [!quote] El recuadro que aparece **tres veces** en el deck (slides 17, 20 y 23)
> *"La condición debe evaluar como **VERDADERA o DESCONOCIDA**"*

> [!important] La regla de `NULL` en los `CHECK` es contraintuitiva
> Un `CHECK` **no rechaza** cuando su condición da `UNKNOWN`, solo cuando da `FALSE`. Consecuencia:
> **`CHECK (sueldo > 0)` acepta `sueldo = NULL`**, porque `NULL > 0` es `UNKNOWN`. Si el atributo no
> debe ser nulo, hay que decirlo aparte con `NOT NULL`. Es el reverso exacto del `WHERE`, que **sí**
> descarta las filas `UNKNOWN`: la misma expresión da resultados opuestos en las dos cláusulas, y cae
> en el parcial. Lógica trivaluada en [[1.05.01 - SQL — consultas|SQL — consultas]] § 11.
>
> (atención) **`WITH CHECK OPTION`** de las vistas —[[Clase 06 - Vistas-Parte 1]] slide 15— usa la
> **misma palabra** `CHECK` y **no** la misma regla de nulos.

> [!bug] El paréntesis de la sintaxis del slide 17 **no cierra**
> `[ [CONSTRAINT NomRestriccion] CHECK (condición);` abre `[` dos veces y cierra ninguna. La gramática
> correcta es `[ [CONSTRAINT nombre] CHECK (condición) ]`.

### Los tipos de condición *(slide 18)*

| Tipo | Operadores | Ejemplo del slide |
| --- | --- | --- |
| **Comparación simple** | `=` `<` `>` `<=` `>=` `<>` | `Sueldo > 0` |
| **Rango** | `[NOT] BETWEEN` *("incluye extremos")* | `nota BETWEEN 0 AND 10` |
| **Pertenencia** | `[NOT] IN` | `Area IN ('Académica', 'Posgrado', 'Extensión')` |
| **Semejanza de patrones** | `[NOT] LIKE` — `%` *(0 o más caracteres)*, `_` *(un carácter)* | `LIKE 's%'` · `LIKE 's_'` |
| **Test de nulidad** | `IS [NOT] NULL` | `FechaIngreso IS NOT NULL` |

> *"AND, OR se utilizan para concatenar distintas condiciones"* · *"Se antepone NOT para negarlas"*

> [!bug] Las comillas del slide 18 están rotas
> Textual: `Area IN („Académica‟, Posgrado‟, „Extensión‟)`: comillas tipográficas mal convertidas,
> **y a `Posgrado` le falta la de apertura**. En SQL: `IN ('Académica', 'Posgrado', 'Extensión')`.

> [!tip] El `_` de `LIKE` es un comodín, y el TP6 lo cobra
> Para buscar un guion bajo literal hay que escaparlo. El ejercicio 3.B.7 del TP6 pide *"Los códigos
> de sucursal deben comenzar con el string `'S_'`"*: el `CHECK` ingenuo `LIKE 'S_%'` acepta `SX123`,
> porque `_` matchea cualquier carácter. La forma correcta es `LIKE 'S\_%'`. Ver
> [[Práctica 2026-08-25]].

### El ejemplo *(slide 19)*

> *"El sueldo de un empleado es un valor no nulo, mayor a 0 e inferior a 50000, y con 2 decimales"* ·
> `EMPLEADO(idE, .., sueldo)`

Las **tres** formas que da el slide, en orden:

```sql
-- (1) con dominio
CREATE DOMAIN SueldoValido
AS Numeric (7,2) NOT NULL
CHECK (value BETWEEN 0 AND 50000);

CREATE TABLE Empleado
( …. ,
  sueldo SueldoValido, ... );
```

```sql
-- (2) sin dominio, con CHECK en la columna
CREATE TABLE Empleado
( …. ,
  sueldo Numeric (7,2) NOT NULL
  CHECK (sueldo BETWEEN 0 AND 50000),
  …. );
```

> [!note] `value` es la palabra clave del `CREATE DOMAIN`: dentro de un dominio no hay nombre de
> columna, así que el estándar usa la palabra reservada **`value`**. En el `CHECK` de columna se
> escribe el nombre de la columna (`sueldo`). El slide muestra las dos y no lo explica.

> [!bug] El enunciado dice *"mayor a 0"* y el `CHECK` escribe `BETWEEN 0 AND 50000`
> **`BETWEEN` incluye los extremos** —lo dice el propio slide 18—, así que ese `CHECK` acepta
> `sueldo = 0` y `sueldo = 50000`, que el enunciado prohíbe. Lo correcto sería
> `CHECK (value > 0 AND value < 50000)`. El TP6 tiene el mismo patrón: su A.2 pide *"fechas
> posteriores **o iguales** al 2010"*, y ahí `>=` sí es lo correcto.

> [!warning] `CREATE DOMAIN` **no existe en MySQL**
> PostgreSQL sí lo tiene. Los sustitutos en MySQL son el tipo `ENUM` (para el caso `IN (…)`) o
> repetir el `CHECK` en cada columna. Detalle en [[MySQL]] § *5*.

## Slides 20–21 · `CHECK` de registro

### Qué es *(slide 20)*

> [!quote] Textual
> - *"Representa una restricción específica sobre los valores que puede tomar **una combinación de
> atributos en una tupla**"*
> - *"Ámbito de la restricción: **tupla** (la RI se comprueba para cada fila que se inserta o
> actualiza en la tabla)"*

```sql
CREATE TABLE NombreTabla
( …..
 { [[CONSTRAINT nom_restr] CHECK (condición) ] } );
```

```sql
ALTER TABLE NombreTabla
  ADD [CONSTRAINT nom_restr] CHECK (condición);
```

> [!note] El ámbito dice **"que se inserta o actualiza"** y omite el `DELETE`: un `CHECK` de tupla
> **solo se evalúa sobre la fila que se toca**, así que un `DELETE` nunca lo puede violar. Un `CHECK`
> de tabla del tipo *"al menos un empleado por área"* **sí** se puede violar borrando, y ahí es donde
> los motores flaquean.

### El ejemplo *(slide 21)*

> *"Un empleado o bien no ha ascendido o, si ha ascendido, la fecha de ascenso no puede ser anterior a
> la fecha de ingreso"* · `EMPLEADO(idE, .., FechaAscenso, FechaIngreso)`

```sql
ALTER TABLE Empleado
  ADD CONSTRAINT Ascenso
  CHECK ( (FechaAscenso IS NULL)
  OR (FechaIngreso < FechaAscenso ));
```

> [!tip] La forma `(col IS NULL) OR (condición)` es **el patrón** de las RI opcionales
> Reaparece en el TP6 (ejercicio 3.A.3: *"los artículos publicados en 2017 deben ser de nacionalidad
> 'Argentino'"* → `CHECK (YEAR(fecha_pub) <> 2017 OR nacionalidad = 'Argentino')`). Razonamiento
> propio: el `IS NULL` explícito **es redundante** —con `FechaAscenso` nula, `FechaIngreso <
> FechaAscenso` da `UNKNOWN` y el `CHECK` acepta igual—, pero escribirlo explícito es la práctica
> correcta: hace visible la intención en vez de apoyarse en la lógica trivaluada.

## Slide 22 · `CHECK` de tabla

> [!quote] Textual
> - *"Representa una restricción que afecta **diferentes tuplas de una misma tabla**"*
> - *"Ámbito de la restricción: **tabla**"*
> - *"Casos particulares: **PRIMARY KEY, UNIQUE** (a nivel tabla)"*

> *"No puede haber más de 30 empleados por area"*

```sql
ALTER TABLE Empleado
ADD CONSTRAINT area_max
 CHECK ( NOT EXISTS (SELECT 1 FROM Empleado
  GROUP BY TipoA, IdArea
  HAVING count(*) > 30));
```

> [!important] El patrón `NOT EXISTS (SELECT … HAVING …)` es **la forma canónica**
> SQL no tiene cuantificador universal (*"para todo grupo, count ≤ 30"*): se escribe siempre como su
> **negación existencial**, *"no existe ningún grupo con count > 30"*; el slide 24 lo dice para las
> assertions y vale igual aquí. Receta: (1) escribir la consulta que **encuentra las violaciones**;
> (2) envolverla en `NOT EXISTS`; (3) ése es el `CHECK`. Resuelve los ejercicios **3.A.4**, **3.A.5**,
> **3.B.6** y **3.B.9** del TP6.

> [!warning] (crítico) Este `CHECK` **no compila**, y es el corte que define el TP6
> **MySQL prohíbe subconsultas dentro de un `CHECK`**, y **PostgreSQL también**: el slide 17 de la
> [[Clase 10 - Restricciones integridad-Parte 2]] lo dice textual —*"**Postgres NO implementa este
> tipo de checks, Postgres no permite un select dentro de un constraint…. :(**"*—. Y `ASSERTION` no
> existe en ningún motor. El corte no es de MySQL: **de ámbito tabla para arriba se va a trigger en
> cualquier motor**, porque el `CHECK` con subconsulta es una promesa del estándar que nadie cumple.
> Es la respuesta al ejercicio **3.c** del TP6:
>
> | Ámbito | ¿Se puede declarar? |
> | --- | --- |
> | atributo / dominio | ✓ con `CHECK` de columna *(sin `CREATE DOMAIN` en MySQL)* |
> | registro / tupla | ✓ con `CHECK` de tabla |
> | **tabla** | ✗ necesita subconsulta → **trigger** |
> | **base de datos** | ✗ necesita `ASSERTION` → **trigger** |
>
> **La jerarquía del slide 15 es el mapa de lo que se puede declarar**: el corte cae entre *tupla* y
> *tabla*. Los slides 14–19 de la Clase 10 son la respuesta canónica al 3.c. *(Los `CHECK` de MySQL
> recién **se hacen cumplir desde 8.0.16**; antes se parseaban y se ignoraban en silencio. La cursada
> corre 9.7. Ver [[MySQL]] § 5.)*

## Slides 23–24 · `ASSERTION`

### Qué es *(slide 23)*

> [!quote] Textual
> - *"Permiten definir restricciones sobre un **número arbitrario de atributos** de un **número
> arbitrario de tablas**"*
> - *"Ámbito de la restricción: **base de datos**"*
> - *"**No están asociadas a un elemento** (tabla o dominio) en particular"*
> - *"Su activación se daría ante actualizaciones sobre las tablas involucradas"*
> - *"Requerirían **alto costo** para comprobación y mantenimiento"*
> - → ***"los DBMS comerciales no soportan ASSERTIONS !"***

```sql
CREATE ASSERTION NomAssertion CHECK (condición);
```

> [!important] El deck usa el **potencial** a propósito
> *"Su activación **se daría**"*, *"**Requerirían** alto costo"*: **no hay implementación**.
> `CREATE ASSERTION` está en SQL-92 y ningún motor mainstream la tiene —ni MySQL, ni PostgreSQL, ni
> Oracle, ni SQL Server; la palabra *mainstream* y el listado son razonamiento propio: la cátedra
> dice *"comerciales"*, aquí y en el slide 18 de la [[Clase 10 - Restricciones integridad-Parte 2]]
> (*"Ninguna base de datos **comercial** implementa Assertions"*)—. La Clase 10 agrega el **remedio**
> que este deck no da: *"Se deberá controlar la restricción con **triggers en varias tablas**"*; con
> un solo trigger sobre `EMPLEADO`, cambiar el jefe en `DEPARTAMENTO` no despertaría nada (su slide
> 19).
>
> **Por qué**: una assertion no cuelga de ninguna tabla, así que el motor tendría que decidir, para
> cada `INSERT`/`UPDATE`/`DELETE` de **cualquier** tabla, si esa operación puede violarla, y
> reevaluar una consulta que puede recorrer varias tablas enteras. Ésa es la razón del *"alto costo"*.
>
> **Para el TP6:** el ejercicio 3.b pide las sentencias *"en SQL estándar"*, incluidas las
> `CREATE ASSERTION`. Se escriben aunque no corran en ningún lado, y por eso el 3.c pregunta aparte
> cuáles **sí** soporta MySQL.

### El ejemplo *(slide 24)*

> *"El sueldo de los empleados de un área no puede ser mayor al sueldo del gerente de esa área"*
> `EMPLEADO (idE, .., sueldo, AreaT)` · `AREA (IdArea, …., gerente)`

```sql
CREATE ASSERTION salario_valido
CHECK ( NOT EXISTS ( SELECT 1 FROM Empleado E, Empleado G, Area A
  WHERE E.sueldo > G.sueldo
  AND E.AreaT = A.IdArea
  AND G.IdE = A.gerente ) );
```

> [!quote] La regla que el slide deja escrita al pie — **es la que hay que retener**
> *"SQL no proporciona un mecanismo para expresar la condición «**para todo X, P(X)**» (P=predicado) →
> se debe utilizar su equivalente «**no existe X tal que no P(X)**»"*

> [!note] El self-join `Empleado E, Empleado G` es lo que hace funcionar el ejemplo: `E` es el
> empleado cualquiera y `G` el gerente, el mismo recurso de la
> [[Clase 05 - Consultas de Datos–Parte 2]] aplicado a una restricción. Y —razonamiento propio— tiene
> **un hueco**: si un área no tiene gerente (`A.gerente IS NULL`), el join no produce filas y la
> restricción **se satisface vacuamente**: los empleados de un área sin gerente pueden cobrar lo que
> quieran. Correcto según lo escrito, probablemente no lo que se quería.

---

## Slides 25–38 · Triggers

> [!warning] Recordatorio: este bloque **se adelanta al cronograma**
> *"Triggers y SQL Procedural"* es la teórica del **31/08** y el TP6 del 25/08 **no los usa**. Está
> aquí porque el material es de esta clase; la [[Clase 10 - Restricciones integridad-Parte 2]] no lo
> repite (ver el callout inicial).

### Slide 25 · La motivación

> [!quote] Los tres motivos, textuales
> - *"imposibilidad de utilizar assertions en DBMS"*
> - *"carencia de implementación de ciertas acciones referenciales"*
> - *"no disponibilidad de acciones específicas diferentes al rechazo y la reparación estándar"*
>
> → *"necesidad de una herramienta útil para escribir aserciones, restricciones complejas, acciones
> específicas de reparación, etc."* → ***"Triggers (disparadores)"***

Los tres motivos son cosas que el deck ya mostró que faltan:

| Motivo del slide 25 | Dónde apareció el problema |
| --- | --- |
| assertions no implementadas | slide 23, *"los DBMS comerciales no soportan ASSERTIONS !"* |
| acciones referenciales que faltan | slide 8 lista cinco; **InnoDB no implementa `SET DEFAULT`** |
| solo hay rechazo y reparación estándar | slides 9–10: las cinco acciones y ninguna más |

### Slide 26 · Qué es un trigger

> [!quote] Textual
> - *"**Trigger**: pieza de código (**no declarativo**) almacenada que "se dispara" automáticamente
> ante la ocurrencia de un evento sobre la base de datos"*
> - *"Puede considerarse una regla **evento-condición-acción (ECA)**"*
> - *"Es persistente y accesible para todas las operaciones de la BD (según se haya definido)"*

| | |
| --- | --- |
| **Evento** | *"sentencia o situación que dispara su ejecución"* |
| **Condición** | *"expresión booleana que debe evaluar en VERDADERO para que el trigger se active. Si evalúa en FALSO o DESCONOCIDO no se ejecuta. **Solo para Triggers a nivel fila**"* |
| **Acción** | *"procedimiento que contiene las sentencias SQL a ser ejecutadas"* |

> [!important] La regla de `NULL` aquí es **la opuesta** a la de los `CHECK`
> - `CHECK` *(slides 17, 20 y 23)*: se cumple con **VERDADERO o DESCONOCIDO**. `UNKNOWN` **acepta**.
> - `WHEN` de un trigger *(slide 26)*: se activa **solo** con VERDADERO. `UNKNOWN` **no dispara**.
>
> La misma expresión booleana con `NULL` adentro da comportamientos contrarios en las dos cláusulas
> del mismo deck: es el tipo de detalle que se pregunta.

### Slide 27 · La sintaxis *(PostgreSQL)*

> [!warning] El título del slide es literal: ***"TRIGGERS – SINTAXIS PostgreSQL"***. Lo que sigue
> **no es SQL estándar ni MySQL**.

```sql
CREATE [ CONSTRAINT ] TRIGGER nombre_del_trigger
{ BEFORE | AFTER | INSTEAD OF }  -- tiempo de activación
{ INSERT [ OR ] UPDATE [ OF nombre_columna [, ... ] ] -- EVENTO
  [ OR ] DELETE [ OR ] TRUNCATE }
  ON nombre_tabla_o_vista
  [ FOR [ EACH ] { ROW | STATEMENT } ]  -- granularidad
  [ WHEN ( condición ) ]  -- CONDICIÓN
  EXECUTE PROCEDURE nombre_función;  -- ACCIÓN
```

> *"Para eliminación de un trigger existente: `DROP TRIGGER <nombre trigger>`"*
> *"La función que se invoca debe ser de tipo **ttrigger**"*

> [!bug] **`ttrigger`** con doble `t` es un tipeo: el tipo se llama `trigger` (`RETURNS trigger`,
> como escribe el propio slide 36).

> [!note] Dos detalles de PostgreSQL que el slide no marca *(razonamiento propio; verificar contra la
> doc si hiciera falta citarlo)*
> - **`EXECUTE PROCEDURE`** está **deprecado** desde PostgreSQL 11 en favor de `EXECUTE FUNCTION`.
> Sigue aceptándose: el slide no está mal, está viejo, como el resto del material, que linkea la doc
> de PostgreSQL 9.5.
> - **`TRUNCATE`** como evento es propio de PostgreSQL y **solo admite `FOR EACH STATEMENT`**.

> [!warning] Casi nada de esta sintaxis sobrevive el pasaje a MySQL
> | Del slide | En **MySQL** |
> | --- | --- |
> | `INSTEAD OF` | ✗ no existe — solo `BEFORE` / `AFTER` |
> | `INSERT OR UPDATE OR DELETE` combinados | ✗ **un evento por trigger** |
> | `UPDATE OF columna` | ✗ no existe — se chequea a mano con `IF NEW.c <> OLD.c` |
> | `TRUNCATE` como evento | ✗ no existe |
> | `FOR EACH STATEMENT` | ✗ **solo `FOR EACH ROW`** |
> | `WHEN (condición)` | ✗ no existe — se pone un `IF` adentro del cuerpo |
> | `EXECUTE PROCEDURE fn()` | ✗ el cuerpo va **inline**, entre `BEGIN … END` |
> | `ON` una **vista** | ✗ solo sobre **tablas** |
>
> **De ocho cláusulas del slide, MySQL no tiene ninguna igual.** La forma MySQL completa está en
> [[MySQL]] § *5*.

### Slide 28 · Eventos y tiempo de activación

| **EVENTO** *(sobre la tabla o vista asociada)* | **TIEMPO DE ACTIVACIÓN** |
| --- | --- |
| Inserción (`INSERT`) | *"antes de la sentencia disparadora (`BEFORE`)"* |
| Actualización (`UPDATE`) — *"se puede especificar columna/s"* | *"después de la sentencia disparadora (`AFTER`)"* |
| Eliminación (`DELETE`) | *"en lugar de la sentencia disparadora (`INSTEAD OF`)"* |

> [!tip] Cuándo usar cada tiempo *(razonamiento propio; el slide solo los enumera)*
> - **`BEFORE`** — para **validar o corregir** el valor antes de que se escriba. Es el único que puede
> modificar `NEW` y abortar la operación limpiamente.
> - **`AFTER`** — para **propagar**: mantener un contador, escribir un log, tocar otra tabla. Los
> datos ya están escritos y las RI declarativas ya se chequearon *(slide 38)*.
> - **`INSTEAD OF`** — solo sobre **vistas**, para hacer escribible una vista que no es actualizable.
> Es el mecanismo que menciona el slide 12 de [[Clase 07 - Vistas-Parte 2]], y **MySQL no lo tiene**.

### Slide 29 · Granularidad

> *"**FOR EACH ROW**: se ejecuta una vez por cada fila afectada"*
> *"**FOR EACH STATEMENT**: se ejecuta una vez para la sentencia SQL disparadora, independientemente
> de la cantidad de filas que afecte"*
> *"(Por defecto → **FOR EACH STATEMENT**)"*

> [!warning] El default sorprende, y en MySQL no existe
> Casi todo el mundo escribe triggers `FOR EACH ROW`, así que el default `STATEMENT` del estándar es
> contraintuitivo, **y es exactamente lo que se pregunta**. En **MySQL `FOR EACH ROW` es
> obligatorio** y no hay statement-level: la pregunta solo tiene sentido en el terreno del
> estándar/PostgreSQL. Se conecta con el slide 26: la condición `WHEN` es *"Solo para Triggers a
> nivel fila"*, o sea que el trigger del default (`STATEMENT`) es justamente el que **no** puede tener
> condición.

### Slide 30 · Referencias a los valores

> [!quote] Textual
> *"La sentencia `INSERT` manipula una **nueva fila** (si el trigger es FOR EACH ROW) o un **nuevo
> conjunto de filas** (si es FOR EACH STATEMENT)"*
>
> *"`DELETE` manipula una **fila vieja** (para triggers a nivel fila) o un conjunto de filas o tabla
> vieja (para triggers de sentencia)"*
>
> *"`UPDATE` manipula estados viejos y nuevos, tanto de filas como de conjuntos de filas, según
> corresponda"*
>
> *"Corresponde referirse a estos elementos como **`:new` y `:old`** dentro del cuerpo de la función
> trigger"*

Qué está disponible en cada evento (el slide no lo da en tabla):

| Evento | `:old` | `:new` |
| --- | :---: | :---: |
| `INSERT` | ✗ | ✓ |
| `UPDATE` | ✓ | ✓ |
| `DELETE` | ✓ | ✗ |

> [!bug] (crítico) **`:new` / `:old` con dos puntos es sintaxis de Oracle, no de PostgreSQL, y el propio deck lo desmiente seis slides después**
> El slide 30 dice `:new` y `:old`; **el slide 36, la función PL/pgSQL de ejemplo, escribe `new.AreaT`
> y `old.AreaT`, sin dos puntos.** Tiene razón el slide 36: en PL/pgSQL las variables son `NEW` y
> `OLD`, sin prefijo. Los dos puntos son de **PL/SQL de Oracle**, y solo dentro del cuerpo de un
> trigger: en la cláusula `WHEN` de Oracle sí van, en PostgreSQL nunca. El slide **34** repite el
> error —`WHEN (:old.sueldo > :new.sueldo)`— en un deck cuyo slide 27 se titula *"SINTAXIS
> PostgreSQL"*; en PostgreSQL sería `WHEN (OLD.sueldo > NEW.sueldo)`.
>
> **En MySQL también van sin dos puntos**: `NEW.col` / `OLD.col`. La forma del slide 30 no corre ni en
> el motor que el deck declara ni en el de la cursada: **es Oracle infiltrado**, el mismo dialecto de
> las partes 2 y 3 de la [[Clase 05 - Consultas de Datos–Parte 2]].

### Slide 31 · La acción

> [!quote] Textual
> - *"La acción consiste en una sentencia SQL aislada o un conjunto de sentencias, delimitadas en un
> bloque `BEGIN . . . END`"*
> - *"Puede referirse a valores anteriores y nuevos que se modifican, nuevos que se insertan, o
> anteriores que se eliminaron, según el evento que desencadenó la acción"*
> - *"Pueden incluir **sentencias de control** (`IF … ELSE`, `FOR`, `WHILE`, …)"*
> - *"**No pueden incluir sentencias del DDL** (`CREATE`, `ALTER`, `DROP`)"*
> - *"Un trigger `BEFORE` **no debería** contener sentencias SQL que alteren datos (`INSERT`, `UPDATE`,
> `DELETE`): esto puede disparar otros triggers BEFORE (sus acciones van quedando pendientes)"*
> - *"La acción del trigger es un **procedimiento atómico** → Si cualquier sentencia del cuerpo del
> trigger falla, la acción completa del trigger se deshace, **incluyendo las correspondientes a la
> sentencia que lo disparó**"*

> [!important] La última viñeta es lo que hace usable un trigger como RI
> **Si el trigger falla, se deshace todo, incluida la sentencia original.** Sin esa garantía un
> trigger podría rechazar a medias y dejar la base inconsistente. Es la **atomicidad** de la A de
> ACID aplicada al par (sentencia, trigger), y lo que permite el patrón *"rechazo"* del slide 34: el
> trigger llama a algo que falla a propósito y con eso aborta la operación entera. En MySQL, eso se
> escribe **`SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '…'`**.

> [!note] *"Pueden incluir sentencias de control"* es lo que separa lo declarativo de lo procedural:
> un `CHECK` es una **expresión booleana** (sin `IF`, sin bucles, sin orden de ejecución); un trigger
> es **código**. Es la diferencia entre las dos ramas del slide 4, y por eso el slide 37 pide
> preferir lo declarativo: el `CHECK` es analizable por el motor, el trigger es una caja negra.

### Slide 32 · Comportamiento y cascadas

> [!quote] Textual
> - *"Ante un cierto evento sobre una tabla → **pueden activarse varios triggers**!"*
> - *"Se puede producir una **activación de triggers en cascada** → Si la activación de un trigger T1
> dispara otro trigger T2: **se suspende** la ejecución de T1, se ejecuta el trigger anidado T2 y
> luego **se retoma** la ejecución de T1"*
> - *"→ esto podría dar lugar a una cadena "**infinita**" de activaciones!"*
> - *"Los DBMS suelen **limitar la longitud** de las cadenas de disparadores"*

El ejemplo del slide, en su diagrama:

```
SQL statement  UPDATE_T1 Trigger
UPDATE T1 SET …;  ───▶  BEFORE UPDATE ON T1
  FOR EACH ROW  INSERT_T2 Trigger
  INSERT INTO T2 VALUES (...); ───▶ BEFORE INSERT ON T2
  FOR EACH ROW
  INSERT INTO ... VALUES (...);
```

> [!warning] Este ejemplo es **el que el slide 31 dice que no hay que escribir**: un `BEFORE UPDATE`
> que hace `INSERT` y dispara otro `BEFORE INSERT` que hace otro `INSERT`. No es una contradicción:
> el 32 muestra **por qué** el 31 lo desaconseja.

> [!note] La cascada es LIFO —*"se suspende T1, se ejecuta T2, se retoma T1"* es una **pila**—, y
> MySQL agrega una restricción que el deck no menciona: **un trigger no puede modificar una tabla
> que ya está siendo usada por la sentencia que lo invocó** (error 1442). Impide el caso más obvio
> de recursión, y también muchos triggers legítimos. *(Razonamiento propio; ver [[MySQL]] § 5.)*

### Slide 33 · Para qué sirven

> [!quote] Los cinco usos, textuales
> - *"**Mantener datos derivados** - Generación automática de datos"*
> - *"**Forzado de reglas de integridad o del negocio complejas** (Ej. cuando no es posible incluirlas
> declarativamente) o con acciones específicas de reparación (diferentes al rechazo y la reparación
> estándar)"*
> - *"**Propagación de actualizaciones**"*
> - *"**Generación de logs** para soporte de auditoría de las acciones de la base de datos y chequeos
> de seguridad"*
> - *"**Mantener vistas actualizadas** (cuando el DBMS no provee capacidades para hacerlo)"*

> [!tip] El quinto uso cierra un cabo suelto de la [[Clase 07 - Vistas-Parte 2|Clase 07]]
> *"Mantener vistas actualizadas cuando el DBMS no provee capacidades"* es lo que hay que hacer en
> MySQL para **simular una vista materializada** —que MySQL no tiene, slide 20 de la Clase 07—: una
> tabla real más triggers sobre las tablas base que la mantengan al día. Era una duda abierta de esa
> clase; ésta es la respuesta.

### Slides 34–36 · Los ejemplos

#### Forzado de reglas de integridad *(slide 34)*

La plantilla que da el slide:

```sql
create trigger <nombre>
before <operación crítica sobre la BD>
when <condición por la que una RI es incumplida>
< acción(es) del trigger > -- → rechazo (acción pasiva) / reparación (acción activa)
```

Y el ejemplo — *"Verificar que el sueldo de un empleado no se reduzca"*:

```sql
CREATE TRIGGER sueldo_no_se_reduce
  BEFORE UPDATE OF sueldo ON Empleado
  FOR EACH ROW
  WHEN (:old.sueldo > :new.sueldo)
  EXECUTE PROCEDURE funcion_error();
```

> [!important] Éste es **el ejemplo canónico de RI de transición de estados**
> Compara `:old` contra `:new`: **ningún `CHECK` puede hacer eso.** Cierra el arco que abrió el
> slide 2 con *"un voluntario puede cambiar de tarea solamente dos veces al año"* y que el slide 4
> nombró *RI de transición de estados*. Si en el parcial hay que justificar por qué una restricción
> necesita un trigger, la respuesta casi siempre es ésta: porque mira el estado anterior.
>
> Los `:` de `:old` / `:new` son de Oracle; en PostgreSQL: `WHEN (OLD.sueldo > NEW.sueldo)` (ver el
> slide 30). Y el nombre `funcion_error()` dice cómo se implementa el rechazo: la *"acción pasiva"*
> es una función que **lanza un error a propósito** —`RAISE EXCEPTION` en PL/pgSQL,
> `SIGNAL SQLSTATE '45000'` en MySQL—, y por la atomicidad del slide 31 ese error deshace también el
> `UPDATE` que disparó el trigger.

#### Actualización de datos derivados *(slides 35–36)*

*"Mantener automáticamente la cantidad total de empleados del Area (ante altas, bajas o
modificaciones en Empleado)"*
`EMPLEADO(idE, nombre, .., AreaT)` · `AREA(idArea, … CantEmp)`

```sql
CREATE TRIGGER Incrementar_EmpArea
AFTER INSERT OR UPDATE OF AreaT OR DELETE
ON Empleado
FOR EACH ROW
EXECUTE PROCEDURE cant_total_empleados();
```

```sql
CREATE FUNCTION cant_total_empleados ( )
RETURNS trigger AS $body$
BEGIN
  IF TG_OP = 'INSERT' THEN
  UPDATE area set CantEmp = CantEmp + 1 where IdArea = new.AreaT;
  RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' THEN
  UPDATE area set CantEmp = CantEmp - 1 where IdArea = old.AreaT;
  UPDATE area set CantEmp = CantEmp + 1 where IdArea = new.AreaT;
  RETURN NEW;
  END IF;
  IF TG_OP = 'DELETE' THEN
  UPDATE area set CantEmp = CantEmp - 1 where IdArea = old.AreaT;
  RETURN OLD;
  END IF;
END; $body$
LANGUAGE 'plpgsql'
```

Cuatro cosas que este ejemplo enseña y el slide no comenta:

| | |
| --- | --- |
| **`TG_OP`** | variable de PL/pgSQL con el evento que disparó (`'INSERT'`/`'UPDATE'`/`'DELETE'`). Permite **un solo trigger para los tres eventos**. En MySQL, donde cada evento necesita su propio trigger, no existe |
| **`RETURN NEW` / `RETURN OLD`** | una función trigger de PostgreSQL **tiene que devolver algo**. En un `AFTER` el valor se ignora; en un `BEFORE ROW` devolver `NULL` **cancela la operación** |
| **`AFTER`, no `BEFORE`** | correcto: se cuenta lo que **ya** pasó. Con `BEFORE` el contador se adelantaría a una operación que las RI declarativas todavía podrían rechazar *(slide 38, paso 2b)* |
| **el `UPDATE` hace resta y suma** | y **no chequea si `old.AreaT = new.AreaT`**. Si el `UPDATE` no cambia el área, resta y suma sobre la misma: funciona por casualidad, no por diseño |

> [!bug] El ejemplo tiene **dos bugs reales** *(razonamiento propio; el slide lo da como correcto)*
> 1. **No maneja `NULL` en `AreaT`.** Si un empleado no tiene área, `where IdArea = NULL` no matchea
> nada y el contador queda desfasado en silencio. Y el DER del slide 11 dice `(0,1)`: `AreaT`
> **puede** ser nulo.
> 2. **No hay `RETURN` fuera de los tres `IF`.** Si `TG_OP` fuera otra cosa —`TRUNCATE`—, la función
> termina sin `RETURN` y PL/pgSQL da error en tiempo de ejecución.
>
> Y un concepto: **el contador `CantEmp` es dato derivado**, o sea **redundancia deliberada**. Se
> acepta a cambio de no recontar; el precio es mantenerla, y de ahí el trigger. Es el trade-off de la
> **vista materializada** de la [[Clase 07 - Vistas-Parte 2|Clase 07]], hecho a mano.

### Slide 37 · Triggers vs. RI declarativas

> [!quote] Textual — **las tres frases más importantes del bloque de triggers**
> - *"Triggers → permiten definir y forzar reglas de integridad, pero **NO son una restricción de
> integridad**"*
> - *"Un trigger definido para forzar una RI **no verifica su cumplimiento para los datos ya
> almacenados** en la BD (una RI declarativa verifica la carga existente en la BD)"*
> - *"Los triggers **deberían usarse sólo cuando una RI no puede ser expresada mediante una cláusula
> declarativa**"*

> [!important] La segunda es la diferencia práctica que más se cobra
> Con `ALTER TABLE … ADD CONSTRAINT CHECK (…)` el motor **valida las filas que ya están**: si alguna
> no cumple, el `ALTER` falla. Con `CREATE TRIGGER` **no pasa nada con lo ya cargado**: el trigger
> mira recién a partir de la próxima operación. Una base "protegida" solo por triggers puede tener
> datos que violan la regla sin que nadie se entere; si hay que migrar una RI a trigger, la validación
> del histórico es un paso aparte y manual.
>
> **Es lo que hace caro el ejercicio 3.c del TP6:** las restricciones de ámbito *tabla* y *base de
> datos* van a trigger, y con eso **pierden la validación del histórico**. No es una traducción
> equivalente: es una degradación.

### Slide 38 · El modelo de ejecución SQL-99

El slide combina un diagrama —tomado de *"Semantic Integrity Support in SQL-99 and Commercial
(Object-)Relational Database Management Systems"*, de **Türker y Gertz**— con la lista de pasos en
castellano.

**El diagrama, de arriba abajo:**

```
  SQL-Statement
  │
  ┌─────────────▼─────────────┐
  │ Determine Set of  │
  │ Affected Rows  │
  └─────────────┬─────────────┘
  ┌─────────────▼─────────────┐
  │ Execute BEFORE Triggers  │──▶ Error
  └─────────────┬─────────────┘
  ╔══════════════ ▼ ══════════════════╗
  ║  Enforcement of Declarative  ║
  ║  Constraints  ║
  ║  ┌─────────────────────────────┐  ║
  ║  │ Apply RESTRICT Rules  │──╫▶ Error
  ║  └─────────────┬───────────────┘  ║
  ║  ┌─────────────▼───────────────┐  ║
  ║  │ Apply CASCADE, SET NULL,  │──╫▶ Error
  ║  │ SET DEFAULT Rules  │  ║
  ║  └─────────────┬───────────────┘  ║
  ║  ┌─────────────▼───────────────┐  ║
  ║  │ Apply NO ACTION Rules  │──╫▶ Error
  ║  │ and Evaluate Constraints  │  ║
  ║  └─────────────┬───────────────┘  ║
  ╚══════════════ ▼ ══════════════════╝
  ┌───────────────────────────┐
  │ Execute AFTER Trigger  │──▶ Error
  └───────────────────────────┘
```

**Y la lista de pasos, textual del slide:**

> 1. *"Ejecuta todos los triggers **BEFORE-statement**"*
> 2. *"Realiza un ciclo por todas las filas afectadas por la sentencia SQL"*
> a. *"Ejecuta todos los triggers **BEFORE-row**"*
> b. *"Bloquea y actualiza cada fila y ejecuta los chequeos de integridad declarat. (**El bloqueo
> no se levanta hasta el final de la transacción**)"*
> c. *"Ejecuta todos los triggers **AFTER-row**"*
> 3. *"Completa las acciones correspondientes a la **verificación diferida** de integridad expresada
> declarativamente"*
> 4. *"Ejecuta todos los triggers **AFTER-statement**"*

> [!important] El slide que cierra el deck contesta tres preguntas anteriores
> 1. **Por qué `RESTRICT` ≠ `NO ACTION`** *(slide 9)*: cajas distintas, y `RESTRICT` va **primero**,
> antes de las reparaciones; `NO ACTION` va **último**, junto con *"Evaluate Constraints"*.
> 2. **Por qué un trigger `BEFORE` no debería alterar datos** *(slide 31)*: corre **antes** de los
> chequeos declarativos, así que lo que escriba puede terminar deshecho.
> 3. **Por qué el contador del slide 35 va en un `AFTER`**: el `AFTER-row` corre en el paso 2c,
> **después** de que la fila fue escrita y validada.
>
> Y agrega una cuarta: **el bloqueo se toma en el paso 2b y no se suelta hasta el `COMMIT`**. Eso es
> concurrencia, tema que todavía no se dictó.

> [!warning] Los pasos 1, 3 y 4 **no existen en MySQL**
> | Paso del slide | En MySQL |
> | --- | --- |
> | 1 · `BEFORE-statement` | ✗ no hay triggers de sentencia |
> | 2a–2c · por fila | ✓ es lo único que hay |
> | 3 · **verificación diferida** | ✗ **no existe chequeo diferido** — todo es inmediato |
> | 4 · `AFTER-statement` | ✗ no hay triggers de sentencia |
>
> El paso 3 ausente es lo que colapsa `NO ACTION` con `RESTRICT` en InnoDB: **sin diferido, no hay
> "al final" donde evaluar.**

---

## Cuadro de bolsillo — todo el deck en una pantalla

| Pregunta | Respuesta |
| --- | --- |
| ¿Qué es una RI? | Condición que restringe los valores; forzarla garantiza **instancias legales** |
| ¿Quién la declara / quién la fuerza? | El **DBA** la declara; el **SGBD** la fuerza |
| Clasificación por naturaleza | **inherente** · **implícita** · **explícita** *(declarativa o procedural)* |
| Clasificación por estados | **de estado** · **de transición de estados** ← ésta necesita trigger |
| Las 5 RI de estado | unicidad · no nulidad · dominio · cardinalidad · participación |
| Regla de integridad referencial | la FK coincide con una clave de la referenciada **o es nula** |
| Las 5 acciones referenciales | `NO ACTION` *(default)* · `RESTRICT` · `CASCADE` · `SET NULL` · `SET DEFAULT` |
| `NO ACTION` vs. `RESTRICT` | misma semántica; **`RESTRICT` se chequea antes** *(slide 38)* |
| ¿Sobre qué tabla se disparan? | sobre la **referenciada**, nunca sobre la referenciante |
| Dos reglas en conflicto | manda la **restrictiva**: `RESTRICT` se evalúa primero |
| Los 3 matchings | `SIMPLE` *(un nulo alcanza — default)* · `PARTIAL` *(los no nulos deben machear)* · `FULL` *(todo o nada)* |
| ¿Cuándo importa el matching? | FK **compuesta** y **nullable**. Si no, las tres son iguales |
| La jerarquía declarativa | **atributo → tupla → tabla → base de datos** |
| Los 4 recursos | `CREATE DOMAIN` · `CHECK` de registro · `CHECK` de tabla · `CREATE ASSERTION` |
| Cómo se elige | **contar tablas y filas**: 1 tabla 1 fila → tupla; 1 tabla N filas → tabla; N tablas → assertion |
| Regla de `NULL` en un `CHECK` | se cumple con **VERDADERO o DESCONOCIDO**. `NULL` **acepta** |
| Regla de `NULL` en un `WHEN` de trigger | se activa **solo con VERDADERO**. `NULL` **no dispara** |
| ¿Por qué no hay `ASSERTION`? | *"Requerirían alto costo"* → *"los DBMS comerciales no soportan ASSERTIONS !"* |
| ¿Cómo se escribe "para todo"? | como **«no existe X tal que no P(X)»** → `NOT EXISTS (…)` |
| ¿Qué es un trigger? | regla **evento-condición-acción**, código **no declarativo**, persistente |
| Granularidad, y default | `FOR EACH ROW` · `FOR EACH STATEMENT` — **default: STATEMENT** |
| ¿Trigger = RI? | **No.** Y **no valida los datos ya cargados**; la RI declarativa sí |
| ¿Cuándo usar trigger? | **solo** cuando la RI no se puede expresar declarativamente *(slide 37)* |
| El corte — y **no es solo de MySQL** | atributo y tupla ✓ · tabla y BD ✗ *(nadie admite subconsulta en un `CHECK`: **PostgreSQL tampoco**, Clase 10 slide 17. Y `ASSERTION` no existe en ningún motor)* |

---

## Material complementario del 25/08 (sin número de clase)

> [!info] Dos PNG archivados junto al deck, **sin `BD2_Clase NN` en el nombre**
> `raw/Unidad-01/Teorica/Ejercicios de RI/Ejercicio 1 - RIR.png` y `Ejercicio 2 - RIR.png`, en una
> carpeta *Ejercicios de RI* publicada en el campus el **25/08**, la fecha de esta clase. No son
> clases: no llevan número de la cátedra ni portada. Se documentan aquí, junto al deck de la fecha
> con la que se publicaron.
>
> (atención) Pese al nombre de la carpeta —*RI*, y el propio deck usa la sigla **RIR**—, **ninguno de
> los dos ejercicios traza acciones referenciales** (`CASCADE` / `SET NULL` / …): los dos piden un
> `CHECK`, uno de fila y otro de tabla — el tema de los **slides 15–22 de esta misma clase**, no el de
> los slides 7–14. El ejercicio clásico de trazar `RESTRICT`/`CASCADE`/`SET NULL` sobre FKs ya está
> resuelto, con dos esquemas completos, en **[[Práctica 2026-08-25]]** (TP6, ejercicios 1 y 2).

### (a) `Ejercicio 1 - RIR.png` — CUENTA: restricción de fila según el tipo

> [!quote] Enunciado, textual
> *"Una aplicación bancaria registra cuentas:"*
> ```
> CUENTA(
>   numero,
>   tipo,
>   saldo,
>   limiteDescubierto
> )
> ```
> *"Los tipos posibles son:"* `CAJA_AHORRO` · `CUENTA_CORRIENTE`
>
> *"Reglas:"*
> - *"Toda cuenta debe tener saldo."*
> - *"Una caja de ahorro no puede tener saldo negativo."*
> - *"Una cuenta corriente puede tener saldo negativo hasta el límite de descubierto especificado."*
> - *"`limiteDescubierto` nunca puede ser negativo."*

Las cuatro reglas miran **una sola fila**, nunca comparan contra otra tupla ni agregan sobre la
tabla: caen en el **nivel 2** de la jerarquía de esta clase (`CHECK` de registro, slide 20). **No hay
ninguna FK en el enunciado** — es, de los dos, el que más se aleja de lo que el nombre de la carpeta
sugiere.

**Resolución del vault**, corrida en MySQL 9.7.2 (*(propuesta propia, tipos de
dato incluidos: el enunciado no los da, igual que el ejemplo del slide 11)*):

```sql
CREATE TABLE cuenta (
  numero INT PRIMARY KEY,
  tipo ENUM('CAJA_AHORRO','CUENTA_CORRIENTE') NOT NULL,
  saldo DECIMAL(12,2) NOT NULL,
  limiteDescubierto DECIMAL(12,2),
  CONSTRAINT chk_limite_no_negativo
    CHECK (limiteDescubierto IS NULL OR limiteDescubierto >= 0),
  CONSTRAINT chk_saldo_segun_tipo
    CHECK (
      (tipo = 'CAJA_AHORRO' AND saldo >= 0)
      OR (tipo = 'CUENTA_CORRIENTE' AND saldo >= -limiteDescubierto)
    )
);
```

`saldo NOT NULL` resuelve *"toda cuenta debe tener saldo"*; las otras tres reglas quedan en los dos
`CHECK`. Siete inserciones de prueba, con el resultado **real** del motor:

| # | Insert | Resultado real |
| ---: | --- | --- |
| 1 | Caja de ahorro, saldo 500 | ✓ acepta |
| 2 | Caja de ahorro, saldo −50 | ✗ `Check constraint 'chk_saldo_segun_tipo' is violated` |
| 3 | Cuenta corriente, saldo −200, límite 300 | ✓ acepta |
| 4 | Cuenta corriente, saldo −400, límite 300 | ✗ rechaza — excede el límite |
| 5 | Cuenta corriente, límite −10 | ✗ `Check constraint 'chk_limite_no_negativo' is violated` |
| 6 | Cuenta corriente, saldo −100, límite `NULL` | ✓ acepta |
| 7 | Caja de ahorro, saldo 0 | ✓ acepta |

Estado final de la tabla (las cuatro que pasaron):

```
numero  tipo              saldo    limiteDescubierto
1       CAJA_AHORRO       500.00   NULL
3       CUENTA_CORRIENTE  -200.00  300.00
6       CUENTA_CORRIENTE  -100.00  NULL
7       CAJA_AHORRO       0.00     NULL
```

> [!warning] El caso 6 es el que hay que saber explicar
> Una cuenta corriente con saldo negativo y **sin** `limiteDescubierto` **es aceptada**: con
> `limiteDescubierto IS NULL`, `saldo >= -limiteDescubierto` evalúa `DESCONOCIDO`, y un `CHECK` pasa
> con VERDADERO **o** DESCONOCIDO — la misma regla de nulos de esta clase (slide 17: *"la condición
> debe evaluar como VERDADERA o DESCONOCIDA"*). El enunciado dice *"hasta el límite… especificado"*, y
> sin límite especificado la restricción, tal como está escrita, no frena nada. Si la intención es
> exigir el límite antes de permitir saldo negativo, hace falta agregar
> `AND limiteDescubierto IS NOT NULL` a la rama de cuenta corriente — *(propuesta propia; el
> enunciado no lo aclara)*.

### (b) `Ejercicio 2 - RIR.png` — PROYECTO/ASIGNACION: restricción de tabla (cardinalidad)

> [!quote] Enunciado, textual
> *"Se dispone de:"*
> ```
> PROYECTO(
>   idProyecto,
>   nombre
> )
>
> ASIGNACION(
>   idEmpleado,
>   idProyecto,
>   fechaDesde,
>   fechaHasta
> )
> ```
> *"Una asignación se considera activa cuando:"* `fechaHasta IS NULL`
>
> *"La organización establece: Un empleado no puede participar simultáneamente en más de tres
> proyectos activos."*
>
> *"Preguntas: 1. ¿Puede resolverse con `NOT NULL`? 2. ¿Puede resolverse con `UNIQUE`? 3. ¿Puede
> resolverse mediante un `CHECK` convencional de MySQL?"*

A diferencia de (a), aquí **sí** hay una FK — `ASIGNACION.idProyecto → PROYECTO.idProyecto` —, pero lo
que se pregunta no es sobre ella: es *"no más de 3 activas por empleado"*, el mismo patrón que *"no
más de 30 empleados por área"* del slide 22 de esta clase. Mira **varias filas de una sola tabla**
(`ASIGNACION`): **nivel 3**, `CHECK` de tabla con subconsulta.

**Respuesta a las tres preguntas del enunciado:**

| Pregunta | Respuesta | Por qué |
| --- | --- | --- |
| 1. ¿`NOT NULL`? | No | es una RI de **atributo**: fuerza que un valor esté presente, no cuenta filas |
| 2. ¿`UNIQUE`? | No | `UNIQUE(idEmpleado, idProyecto)` evita **repetir** una combinación, no limita **cuántas** distintas tiene un empleado a la vez |
| 3. ¿`CHECK` convencional de MySQL? | No | necesita `SELECT … GROUP BY … HAVING COUNT(*) > 3` — una subconsulta —, y MySQL (como PostgreSQL, slide 22) no la admite dentro de un `CHECK` |

Cae en el corte exacto del slide 22 de esta clase: *"de ámbito tabla para arriba se va a trigger en
cualquier motor"*. **Resolución del vault**: un trigger sobre `INSERT` y otro sobre `UPDATE` —
reabrir una asignación cerrada también puede violar la regla, y un solo trigger `BEFORE INSERT` no lo
vería:

```sql
CREATE TABLE proyecto (idProyecto INT PRIMARY KEY, nombre VARCHAR(100) NOT NULL);
CREATE TABLE asignacion (
  idEmpleado INT NOT NULL, idProyecto INT NOT NULL,
  fechaDesde DATE NOT NULL, fechaHasta DATE NULL,
  PRIMARY KEY (idEmpleado, idProyecto, fechaDesde),
  CONSTRAINT fk_asignacion_proyecto FOREIGN KEY (idProyecto) REFERENCES proyecto(idProyecto)
);

DELIMITER $$
CREATE TRIGGER trg_max3_activos_ins BEFORE INSERT ON asignacion
FOR EACH ROW
BEGIN
  DECLARE activos INT;
  IF NEW.fechaHasta IS NULL THEN
    SELECT COUNT(*) INTO activos FROM asignacion
      WHERE idEmpleado = NEW.idEmpleado AND fechaHasta IS NULL;
    IF activos >= 3 THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Un empleado no puede participar simultaneamente en mas de tres proyectos activos';
    END IF;
  END IF;
END$$

-- segundo trigger, misma lógica, cubre el caso "reabrir" (fechaHasta pasa de NOT NULL a NULL):
-- BEFORE INSERT no lo ve, porque la fila ya existía antes del UPDATE.
CREATE TRIGGER trg_max3_activos_upd BEFORE UPDATE ON asignacion
FOR EACH ROW
BEGIN
  DECLARE activos INT;
  IF NEW.fechaHasta IS NULL AND OLD.fechaHasta IS NOT NULL THEN
    SELECT COUNT(*) INTO activos FROM asignacion
      WHERE idEmpleado = NEW.idEmpleado AND fechaHasta IS NULL;
    IF activos >= 3 THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Un empleado no puede participar simultaneamente en mas de tres proyectos activos';
    END IF;
  END IF;
END$$
DELIMITER ;
```

Corrido en MySQL 9.7.2 (los dos triggers activos), con resultado real:

| Caso | Operación | Resultado real |
| --- | --- | --- |
| 1 | Empleado 1: tres altas activas (proyectos 1, 2, 3) | ✓ acepta las tres |
| 2 | Empleado 1: cuarta alta activa (proyecto 4) | ✗ `Un empleado no puede participar simultaneamente en mas de tres proyectos activos` |
| 3 | Cerrar la asignación al proyecto 1 (`UPDATE … SET fechaHasta = …`) y reintentar la cuarta | ✓ acepta — ya hay solo dos activas |
| 4 | Empleado 2: una cerrada + tres activas | ✓ acepta — la cerrada no cuenta |
| 5 | Reabrir (`fechaHasta = NULL`) la asignación cerrada del empleado 1, que ya tiene tres activas | ✗ mismo error, disparado por el trigger de `UPDATE` |
| 6 | `DELETE FROM proyecto WHERE idProyecto = 2` (referenciada, sin `ON DELETE` explícito) | ✗ `Cannot delete or update a parent row: a foreign key constraint fails` |

> [!tip] Por qué la pregunta 2 (`UNIQUE`) es la trampa
> `UNIQUE(idEmpleado, idProyecto)` parece una respuesta razonable porque también "limita" algo, pero
> limita la **combinación**, no la **cantidad**: con `UNIQUE`, un empleado sigue pudiendo tener
> cuatro, cinco o cien asignaciones activas, mientras cada una sea a un proyecto distinto. Es el
> mismo error de categoría que confundir "de tupla" con "de tabla" en la tabla del slide 15.

> [!note] El caso 6 confirma la acción por defecto de la FK
> Sin `ON DELETE` explícito, InnoDB rechaza el borrado de la fila referenciada: el default es
> `NO ACTION` (que en InnoDB se comporta como `RESTRICT`), tal como registra
> [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial y acciones
> referenciales]] § *Cuadro de bolsillo*. Es la única acción referencial que este ejercicio ejercita
> — el resto de su restricción no es de FK, es de cardinalidad.

## Dudas abiertas

- [x] **¿Qué es la *Parte 2*?** Cerrada el 02/09: es la
  [[Clase 10 - Restricciones integridad-Parte 2]] *(20 slides, teórica del 31/08, "Triggers y SQL
  Procedural" en el [[_cronograma]])*, con número propio. No repite los slides 25–38: trae el
  lenguaje procedural —funciones, stored procedures, **cursores**— y seis slides (14–19) que
  reencuadran la jerarquía de restricciones en **cuatro niveles** *(atributo · fila · tabla ·
  generales)*, los del slide 15 con otro vocabulario.
- [ ] (crítico) **¿El parcial toma la sintaxis del estándar o la de MySQL?** `CREATE DOMAIN`,
  `CREATE ASSERTION`, `MATCH FULL/PARTIAL`, `SET DEFAULT`, `FOR EACH STATEMENT`, `INSTEAD OF` y
  `WHEN` no existen en MySQL. Dos indicios de que la cátedra pide las dos —el estándar para el
  concepto, MySQL para la implementación—: el 3.c del TP6 pregunta cuáles soporta MySQL, y el
  **TP7** lo dice textual dos veces (*"aunque MySQL no soporta esta última opción, **resuelvalo
  según la teoría**"*, ej. 1.c; *"aunque MySQL no lo soporta, **responda según la teoría**"*, ej.
  2.b → [[Práctica 2026-09-01]]). Además, la Clase 10 omite `CREATE DOMAIN` en sus slides 14–19 e
  implementa el nivel de atributo con un `CHECK` de columna, que sí corre en MySQL. **Confirmarlo.**
  - (nota) Evidencia de exámenes viejos: el [[Parcial 2Q2025]] pide las dos capas. La Pregunta 24
    (§ *Sección D*) pide implementar una restricción de tabla *"teniendo en cuenta SQL estándar
    primero y luego MySQL"*, y la respuesta de la plataforma es `CHECK` en el estándar y `TRIGGER` en
    MySQL. La 19 (§ *Sección B*) pide razonar `MATCH` simple, parcial y full sobre una FK compuesta
    con un `NULL`, cláusula que MySQL no tiene. La 17 y la 30 usan el mismo esquema con
    `[restrict, cascade]`: la 30 pide la traza de `restrict` y la 17 es la trampa de unicidad de la
    PK (*"No procede por restricción de unicidad"*).
    Es un examen de 2025: refuerza la hipótesis, no confirma el parcial del 13/10/2026.
- [ ] (crítico) **`:new` / `:old` (slide 30) vs. `new.` / `old.` (slide 36)**: el deck se contradice y
  la forma correcta para PostgreSQL y MySQL es la del 36. ¿Cuál se corrige? El slide 17 de la Clase
  10 vuelve a meter Oracle —`months_between(sysdate, fecha_nacimiento)`— en un deck de PostgreSQL:
  dos decks consecutivos con el mismo fenómeno (`CLAUDE.md` § *Puntos abiertos #2*).
- [ ] **El slide 11 tiene la columna `AreaT` tapada por un recuadro.** ¿Es así en la versión que se
  proyectó?
- [ ] **El `CHECK` del slide 19 no coincide con su enunciado** (`BETWEEN 0 AND 50000` incluye los
  extremos). ¿Es intencional?
- [ ] **¿`RESTRICT` y `NO ACTION` se toman como distintos en el parcial**, sabiendo que InnoDB los
  trata igual?
- [ ] **¿Qué se espera cuando `SET NULL` choca contra una FK `NOT NULL`?** ¿Se rechaza la operación,
  o la definición de la FK ya era ilegal?
- [ ] **`MATCH PARTIAL`**: ni PostgreSQL ni MySQL lo implementan. ¿Es solo teoría?
  - (nota) Evidencia de exámenes viejos: la Pregunta 19 de [[Parcial 2Q2025]] § *Sección B* ofrece
    *"Procede con MATCH simple / parcial / full"* como opciones separadas; la correcta es la de
    `SIMPLE` (con un componente `NULL`, la FK no se verifica). Se evalúa como teoría del estándar, de
    lápiz y papel; en MySQL 9.7.2 el mismo `INSERT` procede, porque el motor se comporta como
    `SIMPLE`. Indicio de 2025, no respuesta para el parcial de 2026.
- [ ] **¿La `S` final de "RIRS" quiere decir algo?** El TP6 usa `RIR`.
- [ ] **¿Qué abarca "RIR" en los nombres de la carpeta *Ejercicios de RI*?** `Ejercicio 1 - RIR.png` y
  `Ejercicio 2 - RIR.png` son ejercicios de `CHECK` de fila y de tabla, no de acciones referenciales
  (§ *Material complementario del 25/08*). ¿La cátedra usa la sigla en un sentido más amplio que el
  de este deck, o esa carpeta del campus tiene un tercer archivo, con acciones referenciales, que no
  está en el vault? Preguntarle al humano.
- [ ] **Participación total vs. parcial**: el slide 5 la nombra como RI, pero sigue sin definirse la
  notación (desde [[Clase 02 - Modelo Entidad-Relacion]]).
- [ ] **Sumathi & Esakkirajan (slide 39) sigue sin estar en el vault**; ya la citan dos decks
  *(éste y la [[Clase 06 - Vistas-Parte 1]])*.
- [ ] El deck cita **Date 7ª ed. (2000)** y el vault tiene la **8ª (2004)**: el capítulo de
  integridad es el **9** en la 8ª; en la 7ª puede ser otro. Si la cátedra da páginas, pedir la
  edición.

## Enlaces

- Clase anterior: [[Clase 08 - Explicando el plan]] · clase siguiente:
  **[[Clase 10 - Restricciones integridad-Parte 2]]** *(la del 31/08 — SQL procedural: funciones,
  stored procedures, cursores, y los cuatro niveles de restricción)*
- Práctica de esa semana (martes 25/08): **[[Práctica 2026-08-25]]** — TP6 Restricciones declarativas
- Conceptos: [[1.09.01 - Restricciones de integridad|Restricciones de integridad]] ·
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
  [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] ·
  [[1.09.04 - Triggers|Triggers]]
- Conceptos que esta clase reencuadra: [[1.03.02 - DDL — creación y alteración de tablas|DDL]] ·
  [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] ·
  [[1.05.01 - SQL — consultas|SQL — consultas]] § 11 *(lógica trivaluada)* ·
  [[1.06.01 - Vistas|Vistas]] *(`WITH CHECK OPTION`, `INSTEAD OF`, materializadas)*
- Motores: [[MySQL]] § *5 · Restricciones e integridad* · [[PostgreSQL]] § *Inventario*
- Material complementario del 25/08: § arriba — dos ejercicios de `CHECK` (fila y tabla), corridos en
  MySQL. El ejercicio clásico de acciones referenciales con FKs está en **[[Práctica 2026-08-25]]**
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
- Exámenes viejos: [[Mapa de exámenes]] *(acciones referenciales, `MATCH` y `CHECK` vs. `TRIGGER`)*
