---
tipo: teorica
clase: 4
deck: "BD2_Clase 04 - AlteraciónActualizaciónTablas.pdf"
unidad: 1
tema: ALTER TABLE, INSERT, UPDATE, DELETE
resumen: "ALTER TABLE, DROP TABLE y el DML básico (INSERT, UPDATE, DELETE) en un deck escrito en PostgreSQL para una cursada sobre MySQL: el cambio de tipo y SET/DROP NOT NULL no compilan en MySQL y se resuelven con MODIFY COLUMN; CASCADE y RESTRICT se ignoran."
fecha: 2026-08-03
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 04
  - Clase 04 — Alteración y actualización de tablas
  - ALTER TABLE
  - DROP TABLE
  - INSERT UPDATE DELETE
  - Modificación de tablas
  - PostgreSQL vs MySQL (sintaxis DDL)
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 04 - AlteraciónActualizaciónTablas.pdf"
estado: procesado
---

# Clase 04 — Alteración y actualización de tablas

## Resumen general

Nueve slides sobre qué hacer con una tabla que ya existe: modificarla (`ALTER TABLE`, siete formas
en el slide 3), borrarla (`DROP TABLE` con `CASCADE | RESTRICT`, slide 7) y cargar o cambiar sus
datos (`INSERT`, `UPDATE`, `DELETE`, slides 8–9), más un slide de ejercicios con dos DER que es
materia de la Clase 03. Continúa aquella clase: la 03 deriva el DER a `CREATE TABLE`, esta corrige
la tabla cuando el modelo cambia.

El problema central es el motor. El slide 3 declara «la sintaxis de PostgreSQL», pero la cursada
corre sobre MySQL y el script del TP (`esq_peliculas.sql`) ya usa sintaxis MySQL. El cambio de tipo
y `SET/DROP NOT NULL` no compilan en MySQL: se resuelven con `MODIFY COLUMN`, que redeclara la
columna entera y descarta lo que no se vuelva a escribir, el `DEFAULT` incluido. Una FK se suelta
con `DROP FOREIGN KEY`, la PK con `DROP PRIMARY KEY` (MySQL la llama siempre `PRIMARY`) y una
`UNIQUE` con `DROP INDEX`. MySQL acepta `CASCADE` y `RESTRICT` en `DROP TABLE` y los ignora: borrar
una tabla referenciada falla, y la salida es soltar la FK antes o desactivar `FOREIGN_KEY_CHECKS`.
`DELETE` y `UPDATE` sin `WHERE` tocan toda la tabla, y Workbench los rechaza con el error 1175 salvo
que se apague `SQL_SAFE_UPDATES`. El DDL de MySQL hace commit implícito: no se deshace con `ROLLBACK`.

Trampas de transcripción: las comillas del deck son acentos agudos o tipográficas, y la sentencia de
cambio de tipo está mal escrita en los slides 3 y 5 (falta `ALTER COLUMN`). Los ejemplos no forman un
script: el slide 4 borra `encargado`, que el slide 9 actualiza. Para el parcial: la tabla de
traducción, las plantillas DML del slide 8 y la duda de si se toma PostgreSQL o MySQL.

## Fuente y mapa del deck

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 04 - AlteraciónActualizaciónTablas.pdf` · **9 slides** (el
> **Slide 1** es la portada) · teórica del lunes **03/08**, junto con las Clases 01–05.
> Anterior: [[Clase 03 - Derivación a Esquema Lógico]] · siguiente: la Clase 05, en tres archivos —
> [[Clase 05 - Consultas de Datos–Parte 1]] · [[Clase 05 - Consultas de Datos–Parte 2]] ·
> [[Clase 05 - Consultas de Datos–Parte 3]].
> Práctica: `ITBA TP 2 Creates.pdf` y `ITBA TP 3 SQL simples.pdf` → [[Práctica 2026-08-04]] ·
> índice: [[_index-clases]] · bibliografía: [[_index-bibliografia]].

> [!warning] Deck escrito en PostgreSQL
> El slide 3 dice textualmente *"La sintaxis de **PostgreSQL**"*; la cursada corre sobre **MySQL**
> ([[_cronograma]] § Diferencias con el programa oficial). Traducción completa en
> [[#Tabla maestra de traducción PostgreSQL → MySQL]].

La división es la clásica **DDL vs DML** → [[DDL vs DML]]: los slides 3–7 alteran el *esquema*, los
slides 8–9 los *datos*. El deck solo nombra el DML (slide 8) y nunca escribe la sigla DDL
(razonamiento propio).

---

## Tabla maestra de traducción PostgreSQL → MySQL

> [!important] Para tener al lado en el TP
> Izquierda, lo que dice el slide (PostgreSQL); derecha, lo que hay que tipear en MySQL.
> **`verificar`** marca lo no confirmado contra la documentación o en clase.

| Operación | PostgreSQL — *lo que dice el slide* | MySQL — *lo que hay que tipear en el TP* |
| --- | --- | --- |
| Agregar columna | `ALTER TABLE t ADD COLUMN c tipo;` | **igual** (`COLUMN` es opcional en los dos) |
| Eliminar columna | `ALTER TABLE t DROP COLUMN c;` | **igual** |
| Renombrar columna | `ALTER TABLE t RENAME COLUMN vieja TO nueva;` | **igual** en MySQL 8.0+. En versiones previas: `ALTER TABLE t CHANGE vieja nueva tipo;` (hay que repetir el tipo) |
| **Cambiar tipo de dato** | `ALTER TABLE t ALTER COLUMN c TYPE nuevo_tipo;` *(el slide lo escribe mal, ver slide 3)* | `ALTER TABLE t MODIFY COLUMN c nuevo_tipo;` — **sin `TYPE`** |
| Asignar valor por defecto | `ALTER TABLE t ALTER COLUMN c SET DEFAULT v;` | **igual** |
| Quitar valor por defecto | `ALTER TABLE t ALTER COLUMN c DROP DEFAULT;` | **igual** |
| **Poner `NOT NULL`** | `ALTER TABLE t ALTER COLUMN c SET NOT NULL;` | **no existe.** Hay que redeclarar la columna entera: `ALTER TABLE t MODIFY COLUMN c tipo NOT NULL;` |
| **Quitar `NOT NULL`** | `ALTER TABLE t ALTER COLUMN c DROP NOT NULL;` | **no existe.** `ALTER TABLE t MODIFY COLUMN c tipo NULL;` |
| Agregar restricción `UNIQUE` | `ALTER TABLE t ADD CONSTRAINT n UNIQUE (c);` | **igual** |
| Agregar `PRIMARY KEY` | `ALTER TABLE t ADD CONSTRAINT n PRIMARY KEY (c);` | **igual** (sintaxis aceptada; sobre el nombre `n`, ver nota abajo) |
| Agregar `FOREIGN KEY` | `ALTER TABLE t ADD CONSTRAINT n FOREIGN KEY (c) REFERENCES t2 (c2);` | **igual** (requiere InnoDB) |
| **Eliminar una FK** | `ALTER TABLE t DROP CONSTRAINT n;` | `ALTER TABLE t DROP FOREIGN KEY n;` ← **es la forma que usa `esq_peliculas.sql`** |
| Eliminar una PK | *(no en el deck)* | `ALTER TABLE t DROP PRIMARY KEY;` |
| Eliminar una `UNIQUE` | *(no en el deck)* | `ALTER TABLE t DROP INDEX n;` *(en MySQL una `UNIQUE` es un índice)* |
| `DROP CONSTRAINT` genérico | `ALTER TABLE t DROP CONSTRAINT n;` | **`verificar`** — existe en MySQL 8 moderno, pero no consta desde qué versión; usar las tres formas específicas de arriba, que sí son seguras |
| Borrar tabla | `DROP TABLE t CASCADE;` / `RESTRICT` | MySQL **acepta las dos palabras y las ignora**: no hay borrado en cascada de objetos dependientes |
| `INSERT` / `UPDATE` / `DELETE` | tal cual el slide 8 | **idénticos** |

> [!note] Sobre el nombre de la PK en MySQL
> MySQL acepta `ADD CONSTRAINT Pk_Alumno PRIMARY KEY (…)`, pero la clave primaria se llama siempre
> `PRIMARY`: el nombre se pierde y la PK se borra con `DROP PRIMARY KEY`. **Verificar en clase** si a
> la cátedra le importa el nombre.

---

## Slide 2 · Ejercicios — dos DER

Titulado **`Ejercicios`** y sin consigna: dos diagramas, antes de todo el contenido de la clase.

> [!bug] Slide huérfano
> Dos DER en notación de cátedra son materia de la
> **[[Clase 03 - Derivación a Esquema Lógico|Clase 03]]**, no de `ALTER TABLE`; probablemente sea un
> slide arrastrado del deck anterior. **Preguntar la consigna en clase.** Hipótesis propia: derivar
> los DER a `CREATE TABLE` y después escribir los `ALTER TABLE` que faltan.

**DER izquierdo — `AUTOR` / `ES_AUTOR` / `LIBRO`:**

```
  ┌─────────┐ ┌─ ● CodAutor  ● = identificador principal
  │  AUTOR  │─┼─ ○ Apellido  ○ = descriptor
  └────┬────┘ ├─ ○ Nombre  ┈┈ = línea punteada → atributo OPCIONAL
  │  └┈┈ ○ Nacionalidad  ◇ = ROMBO → relación (así está dibujado en el slide)
  (1,N)
  │
  ◇────┴─────◇  (0,N)  ┌───────┐ ┌─ ● ISBN
  ◇ ES_AUTOR ◇──────────────── │ LIBRO │─┼─ ○ Titulo
  ◇──────────◇  └───────┘ ├─ ○ Edicion ─┬─ ○ FechaEdicion
  │  ├─ ○ NumeroEdicion
  │  └─ ○ LugarEdicion
  ├─ ○ NombreGenero
  └┈┈ ○ NombreSubgenero
```

**DER derecho — `EJEMPLAR` / `POSEE` / `LIBRO`:**

```
  ╔══════════════╗ ┌─ ● NumeroEjemplar  ╔══╗ = doble rectángulo → ENTIDAD DÉBIL
  ║  EJEMPLAR  ║─┼─ ○ EsPrestable  ‖  = línea doble → relación con entidad débil
  ╚══════╤═══════╝ └─ ○ (D)EstaDisponible  (D) = prefijo → atributo DERIVADO
  (1,N)  ↑ un solo tronco  ◇  = ROMBO → relación
  ‖  para los tres
  ◇──────┴──────◇
  ◇  POSEE  ◇
  ◇──────┬──────◇
  (1,1)
  │
  ┌──────┴──────┐
  │  LIBRO  │  ● ISBN · ○ Titulo · ○ Edicion (FechaEdicion, NumeroEdicion,
  └─────────────┘  LugarEdicion) · ○ NombreGenero · ┈ ○ NombreSubgenero
```

`LIBRO` tiene **los mismos atributos en los dos diagramas**: es la misma entidad vista dos veces.
Lectura contra la notación de [[Clase 02 - Modelo Entidad-Relacion]]:

| Atributo | Entidad | Qué dice la notación |
| --- | --- | --- |
| `CodAutor` · `ISBN` · `NumeroEjemplar` | AUTOR · LIBRO · EJEMPLAR | bolita **rellena** → identificador principal |
| `Nacionalidad` · `NombreSubgenero` | AUTOR · LIBRO | línea **punteada** → atributo **opcional** |
| `Edicion` | LIBRO | **compuesto**: cuelgan `FechaEdicion`, `NumeroEdicion`, `LugarEdicion` |
| `EstaDisponible` | EJEMPLAR | prefijo **`(D)`** → atributo **derivado** |
| `EJEMPLAR` | — | **doble rectángulo** → entidad **débil**, dependiente de `LIBRO` |

> [!tip] Completa un hueco de notación de la Clase 02
> La tabla de notación de la [[Clase 02 - Modelo Entidad-Relacion|Clase 02]] dejaba el origen
> (nativo/derivado) **sin símbolo**; acá aparece: **prefijo `(D)`** en el nombre del atributo. Falta
> agregarlo a [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

> [!note] No hay línea entre `EsPrestable` y `(D)EstaDisponible`
> Ampliando el slide, los tres atributos de `EJEMPLAR` cuelgan de **un solo tronco vertical**; la
> aparente línea extra es el codo inferior de ese tronco. El deck **no indica de qué atributo se
> deriva** `EstaDisponible`.

**Cardinalidades**, con la lectura **Look-Across** de la Clase 02 (el par `(mín,máx)` pegado a una
entidad cuenta ejemplares de *esa* entidad por cada ejemplar de la *otra*):

| Diagrama | Par | Se lee |
| --- | --- | --- |
| izq. | `(1,N)` pegado a `AUTOR` | cada **libro** tiene entre **1 y N autores** |
| izq. | `(0,N)` pegado a `LIBRO` | cada **autor** puede tener **0 o N libros** |
| der. | `(1,N)` pegado a `EJEMPLAR` | cada **libro** tiene entre **1 y N ejemplares** |
| der. | `(1,1)` pegado a `LIBRO` | cada **ejemplar** pertenece a **exactamente 1 libro** |

> [!note] Confirma el look-across (razonamiento propio, no está en el deck)
> Con la lectura **min-max** (Merise/UML, que se escribe igual) el diagrama derecho diría *"cada libro
> tiene exactamente un ejemplar"* y *"cada ejemplar pertenece a 1..N libros"*: **imposible para una
> entidad débil**, que depende de **una sola** entidad fuerte. El `(1,1)` del lado fuerte es el patrón
> `(1,1):(*,N)` del slide 34 de la Clase 02.

## Slide 3 · Modificación de tablas — las siete formas de `ALTER TABLE`

> [!quote] Slide 3
> *"Una vez creada una tabla es posible realizar algunas modificaciones en su definición (ej, agregar
> o quitar columnas, especificar valores por defecto, incorporar restricciones o quitarlas, etc.*
> **La sintaxis de PostgreSQL**"

Las siete sentencias, tal cual figuran (las tres últimas sin `;`; los corchetes son notación de
sintaxis y no se tipean):

```sql
ALTER TABLE tabla ADD COLUMN columna tipo;  -- → Agrega columna

ALTER TABLE tabla DROP COLUMN columna;  -- → Elimina columna

ALTER TABLE tabla RENAME COLUMN
  Columna_vieja TO columna_nueva;  -- → renombra una columna

ALTER TABLE tabla columna TYPE nuevo_tipo;  -- → cambia tipo de dato

ALTER TABLE tabla ALTER COLUMN columna
  [SET DEFAULT value | DROP DEFAULT]  -- → Asigna o elimina valor por defecto

ALTER TABLE tabla ALTER COLUMN columna
  [SET NOT NULL | DROP NOT NULL]  -- → Asigna o elimina rest. nulidad

ALTER TABLE tabla ADD CONSTRAINT name constraint-definition  -- → incorpora restricción
```

> [!bug] La cuarta sentencia está mal escrita en el slide
> `ALTER TABLE tabla columna TYPE nuevo_tipo;` — **falta el `ALTER COLUMN`**; no vale en ningún
> motor. En PostgreSQL:
> ```sql
> ALTER TABLE tabla ALTER COLUMN columna TYPE nuevo_tipo;
> ```
> Se repite en el slide 5 (`ALTER TABLE Alumno condicion TYPE VARCHAR(30);`, el único ejemplo de ese
> slide sin comentario): **no es un typo aislado**. **Verificar en clase.**

> [!warning] En MySQL no hay `ALTER COLUMN … TYPE` ni `SET/DROP NOT NULL`
> La cuarta sentencia (tipo) y la sexta (las **dos** de nulidad) no compilan: **tres operaciones** que
> MySQL resuelve con `MODIFY COLUMN`, que **redeclara la columna entera**:
> ```sql
> -- cambiar el tipo
> ALTER TABLE Alumno MODIFY COLUMN condicion VARCHAR(30);
> -- poner NOT NULL (hay que repetir el tipo, aunque no cambie)
> ALTER TABLE Alumno MODIFY COLUMN tutor VARCHAR(50) NOT NULL;
> -- quitar NOT NULL
> ALTER TABLE Alumno MODIFY COLUMN tutor VARCHAR(50) NULL;
> ```
> **Trampa de `MODIFY`:** **todo atributo que no se vuelva a escribir se pierde**. Con
> `DEFAULT 'Regular'` previo, `MODIFY COLUMN condicion VARCHAR(30)` a secas **borra el default**.

Las otras cuatro (`ADD COLUMN`, `DROP COLUMN`, `RENAME COLUMN`, `ADD CONSTRAINT`) y el par
`SET/DROP DEFAULT` funcionan igual en los dos motores.

## Slide 4 · Ejemplos I — columnas y restricciones

```sql
ALTER TABLE Alumno
  ADD COLUMN condicion VARCHAR(10) DEFAULT  ´Regular´;
  -- → Incorpora una nueva columna en Alumno con um valor por defecto

ALTER TABLE Instituto
  DROP COLUMN encargado;
  -- → elimina la columna encargado de Alumno

ALTER TABLE Curso
  ADD CONSTRAINT  U_tit  UNIQUE (titulo);
  -- → define una restricción de unicidad para el título del Curso

ALTER TABLE Ofrece
  DROP CONSTRAINT Fk_Ofrece_Cur;
  -- → elimina la restricción de clave extranjera en Ofrece
```

> [!bug] Comentarios del slide
> El segundo dice *"elimina la columna encargado de **Alumno**"*, pero la sentencia toca `Instituto`:
> **manda la sentencia**. El primero dice "con **um** valor por defecto".

> [!warning] Las comillas del slide no son comillas
> `DEFAULT ´Regular´` usa **acentos agudos** (`´`); el slide 5 usa comillas tipográficas (`‘Libre’`) y
> el slide 9 mezcla las dos. Copiado tal cual **falla en cualquier motor**; hay que retipear:
> ```sql
> ALTER TABLE Alumno ADD COLUMN condicion VARCHAR(10) DEFAULT 'Regular';
> ```

> [!warning] `DROP CONSTRAINT` sobre una FK no es MySQL
> El caso que más se usa en el TP. En MySQL:
> ```sql
> ALTER TABLE Ofrece DROP FOREIGN KEY Fk_Ofrece_Cur;
> ```
> Es la forma de `raw/Unidad-01/Practica/esq_peliculas.sql`, en el bloque de `drop` comentado del
> encabezado:
> ```sql
> alter table empleado drop foreign key empleado_id_distribuidor_fkey;
> ```
> **El deck enseña la sintaxis de un motor y el script del TP usa la del otro.** Ver
> [[Práctica 2026-08-04]].

## Slide 5 · Ejemplos II — `DEFAULT`, `NOT NULL` y cambio de tipo

```sql
ALTER TABLE Alumno ALTER COLUMN condicion
  SET DEFAULT ‘Libre’;
  -- → Define un valor por defecto para una columna

ALTER TABLE Alumno ALTER COLUMN condicion
  DROP DEFAULT;
  -- → Elimina la definición del valor por defecto para una columna

ALTER TABLE Alumno ALTER COLUMN tutor
  SET NOT NULL;
  -- → Define una restricción de nulidad para la columna (OJO)!!!

ALTER TABLE Alumno ALTER COLUMN tutor
  DROP NOT NULL;
  -- → Elimina una restricción de nulidad para la columna

ALTER TABLE Alumno condicion TYPE VARCHAR(30);
```

Los ejemplos 1 y 2 son **iguales** en MySQL. Los 3, 4 y 5 se escriben con
`MODIFY COLUMN tutor <tipo> NOT NULL`, `MODIFY COLUMN tutor <tipo> NULL` y
`MODIFY COLUMN condicion VARCHAR(30)` (código en la sección del slide 3).

> [!important] El `(OJO)!!!` del tercer ejemplo
> El deck no explica el aviso. Razonamiento propio: `SET NOT NULL` sobre una columna que **ya tiene
> filas con `NULL`** hace fallar la sentencia entera; hay que rellenar los nulos con un `UPDATE` antes
> del `ALTER`. Además, `tutor` era el ejemplo de atributo **opcional** de `ALUMNO` en la Clase 02:
> hacerlo obligatorio contradice el modelo conceptual. **Confirmar en clase cuál de las dos cosas es
> el "OJO".**

## Slide 6 · Ejemplos III — clave primaria y clave extranjera

```sql
ALTER TABLE Alumno
  ADD  CONSTRAINT Pk_Alumno PRIMARY KEY (LIBRETA)  ;
-- → Incorpora la restricción de clave primaria a la tabla Alumno;

ALTER TABLE Alumno
  ADD  CONSTRAINT Fk_Alumno_Univ  FOREIGN KEY (nom_univ)
  REFERENCES Universidad (nom_univ)  ;
-- → Incorpora la restricción de clave extranjera a la tabla Alumno
--  que referencia a la tabla Universidad;
```

> [!success] Este slide **sí** es portable
> Idéntico en MySQL, y es **el patrón de `esq_peliculas.sql`**: todos los `CREATE TABLE`, después un
> bloque de `ALTER TABLE … ADD CONSTRAINT … PRIMARY KEY` y por último otro de
> `ALTER TABLE … ADD CONSTRAINT … FOREIGN KEY … REFERENCES …`:
> ```sql
> ALTER TABLE ciudad
> ADD CONSTRAINT pk_ciudad PRIMARY KEY (id_ciudad);
>
> ALTER TABLE ciudad
> ADD CONSTRAINT ciudad_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES pais(id_pais);
> ```

> [!tip] Por qué las FK van aparte y no dentro del `CREATE TABLE` (razonamiento propio)
> Una FK solo puede apuntar a una tabla que ya exista: dentro del `CREATE` obliga a crear en orden
> topológico, y con ciclos (`empleado.id_jefe → empleado`; `departamento.jefe_departamento → empleado`
> mientras `empleado.(id_distribuidor, id_departamento) → departamento`) **no hay orden posible**. Con
> las FK en `ALTER TABLE` el orden deja de importar. `esq_peliculas.sql` tiene los dos ciclos.

**Convención de nombres del deck** (el TP la sigue): `Pk_<Tabla>` para primarias,
`Fk_<Tabla>_<TablaReferenciada>` para extranjeras, `U_<algo>` para unicidad. El script del TP la
mezcla con la automática de PostgreSQL (`<tabla>_<columna>_fkey`).

## Slide 7 · Borrado de tablas

```sql
DROP TABLE nombre_tabla [CASCADE | RESTRICT]
```

> [!quote] Slide 7
> *"Se elimina la definición de la tabla y todas las filas que contiene"*

| Opción | Qué hace, textual del slide |
| --- | --- |
| **`RESTRICT`** | *"se rechaza si hay objetos definidos a partir de la tabla"* — **es la opción por defecto** |
| **`CASCADE`** | *"se eliminan **todos** los objetos dependientes de la tabla (también los objetos que dependan a su vez de ellos)"* |

Cierre: **→ *"tener precaución en su uso"***. A su derecha hay un **recuadro negro sólido**, más alto
que ancho, aparentemente una imagen rota al exportar a PDF: **preguntar si falta contenido**.

> [!warning] En MySQL `CASCADE` y `RESTRICT` no hacen nada
> MySQL **acepta las dos palabras clave** (facilitan el porteo de scripts) pero **las ignora**: no hay
> borrado en cascada de objetos dependientes. `DROP TABLE` sobre una tabla referenciada por una FK
> **falla**; las salidas son dos:
> ```sql
> -- (a) borrar en orden inverso a las dependencias, o soltar la FK primero
> ALTER TABLE hija DROP FOREIGN KEY fk_hija_madre;
> DROP TABLE madre;
>
> -- (b) desactivar el chequeo, borrar todo, reactivarlo
> SET FOREIGN_KEY_CHECKS = 0;
> DROP TABLE madre, hija;
> SET FOREIGN_KEY_CHECKS = 1;
> ```
> La (a) es la de `esq_peliculas.sql` en su encabezado comentado: borra en orden inverso y mete un
> `alter table empleado drop foreign key …` en el medio para romper el ciclo.

> [!note] `DROP TABLE` vs. `DELETE FROM` vs. `TRUNCATE` — fuera del deck
> `DROP TABLE` elimina **definición + datos**; `DELETE FROM t` (slide 9) elimina datos **fila por fila,
> filtrable con `WHERE`**; `TRUNCATE TABLE t`, que el deck **no menciona**, vacía la tabla de golpe y
> la conserva. **Verificar si la cátedra lo toma.**

## Slide 8 · Actualización de datos (DML)

> [!quote] Slide 8
> *"Sentencias del DML para agregar, modificar y eliminar datos de tablas:"*

```sql
-- INSERT
INSERT INTO nombre_tabla [ ( lista_columnas ) ]
  VALUES (lista_valores);

-- DELETE
DELETE FROM nombre_tabla
[ WHERE (condición) ] ;

-- UPDATE
UPDATE nombre_tabla
SET nom_columna1= valor1 [,nom_columna2= valor2 … ]
[ WHERE (condición) ] ;
```

SQL estándar, **idéntico en MySQL**. Los corchetes son notación: sin lista de columnas, el `INSERT`
exige **un valor por columna, en el orden de la tabla** (un cambio de orden rompe el script en
silencio); sin `WHERE`, `DELETE` y `UPDATE` tocan **todas** las filas, irreversible fuera de una
transacción (slide 9).

## Slide 9 · Ejemplos de DML

```sql
INSERT INTO Curso (id_curso, titulo)
  VALUES ( 208, ‘Bases de Datos’ );
  -- → Al no especificarse el valor de duración, éste tomaría su valor por defecto (60)

INSERT INTO Curso VALUES (134, ´Comunicación de Datos´, 45);
  -- → se incorpora un nuevo curso (no se requiere el nombre de columnas
  --  porque se insertan valores para todas

UPDATE Curso SET duracion = duracion + 20;
  -- → se agregan 20 (horas) a todos los cursos

UPDATE Instituto SET encargado = ‘Juan Perez’
  WHERE cod_instituto = ‘ISBD’;
  -- → se actualiza el encargado del instituto ISBD

DELETE  FROM  Ofrece;
  -- → Elimina todas las tuplas de Ofrece!  (si es posible)

DELETE  FROM  Ofrece WHERE cod_instituto = ‘ISBD’;
  -- → Elimina los vínculos de cursos ofrecidos por el inst. ISBD
```

| Par | Contraste |
| --- | --- |
| `INSERT` 1 vs. 2 | **con** lista de columnas → las omitidas toman su `DEFAULT` (acá `duracion` = 60) · **sin** lista → hay que dar todos los valores, en orden |
| `UPDATE` 1 vs. 2 | **sin `WHERE`** → toca todas las filas; el `SET` puede usar el **valor actual de la propia columna** (`duracion = duracion + 20`) · **con `WHERE`** → solo las filas que cumplen la condición |
| `DELETE` 1 vs. 2 | **sin `WHERE`** → vacía la tabla · **con `WHERE`** → borra un subconjunto |

> [!question] El *"(si es posible)"* subrayado del `DELETE FROM Ofrece;`
> El deck no lo explica. Razonamiento propio: el borrado puede fallar si **otra tabla referencia** las
> filas de `Ofrece` con una FK sin `ON DELETE CASCADE`, o por permisos. **Verificar en clase.**

> [!warning] Los `UPDATE`/`DELETE` sin `WHERE` fallan en MySQL Workbench
> El **modo *safe updates*** viene activado: un `UPDATE` o `DELETE` que no filtre por una columna con
> índice se rechaza con el **error 1175**. `UPDATE Curso SET duracion = duracion + 20;` y
> `DELETE FROM Ofrece;` son ese caso. Para correrlos:
> ```sql
> SET SQL_SAFE_UPDATES = 0;
> ```
> Es una protección, no un bug: conviene volver a `1` después.

> [!bug] Los ejemplos no forman una secuencia coherente
> El slide 4 borra `encargado` (`ALTER TABLE Instituto DROP COLUMN encargado;`) y el slide 9 lo
> actualiza (`UPDATE Instituto SET encargado = 'Juan Perez'`). **Cada ejemplo es independiente, no un
> script**: no copiarlos en bloque en el TP.

Tipeo del slide: el comentario del segundo `INSERT` no cierra el paréntesis, y el del tercero queda
pisado en el PDF por la línea del `UPDATE Instituto`.

---

## El esquema implícito de los ejemplos

Reconstrucción propia, no está en ningún slide: el deck nunca muestra los `CREATE TABLE`, pero los
ejemplos son consistentes entre sí y dejan deducir el esquema.

| Tabla | Columnas que se deducen | De dónde sale |
| --- | --- | --- |
| `Alumno` | `LIBRETA` (PK) · `nom_univ` (FK→`Universidad`) · `tutor` · `condicion` | slides 4, 5, 6 |
| `Universidad` | `nom_univ` (PK, referenciada) | slide 6 |
| `Instituto` | `cod_instituto` · `encargado` | slides 4, 9 |
| `Curso` | `id_curso` · `titulo` (UNIQUE `U_tit`) · `duracion` (`DEFAULT 60`) | slides 4, 9 |
| `Ofrece` | `cod_instituto` · *(id de curso)* · FK `Fk_Ofrece_Cur` → `Curso` | slides 4, 9 |

`Curso` tiene **tres columnas** por el `INSERT INTO Curso VALUES (134, …, 45);` sin lista de
columnas; `duracion` tiene `DEFAULT 60` por el comentario del primer `INSERT`; `condicion` **no
existía originalmente**: el `ADD COLUMN` del slide 4 simula una migración. `Ofrece` es la tabla
intermedia de la relación **N:N entre `Instituto` y `Curso`**: borrar sus filas *"elimina los
vínculos"*, palabra textual del slide 9.

## Fuera del deck: lo que igual hay que saber para el TP

> [!important] Nada de esta sección está en los 9 slides
> Razonamiento propio y experiencia de motor. **Confirmar lo que se use en el parcial.**

1. **`ALTER TABLE` admite varias acciones en una sola sentencia**, separadas por coma:
  ```sql
  ALTER TABLE Alumno
  ADD COLUMN condicion VARCHAR(10) DEFAULT 'Regular',
  DROP COLUMN tutor;
  ```
2. **En MySQL el DDL hace *commit* implícito**: un `ALTER TABLE` o un `DROP TABLE` **no se deshace con
  `ROLLBACK`** y cierra la transacción abierta; en PostgreSQL el DDL **sí** es transaccional. Por eso
  el *"tener precaución"* del slide 7 pesa más en MySQL. Se retoma en
  [[1.11.03 - Transacciones y ACID|Transacciones ACID]].
3. **`MODIFY` vs. `CHANGE` en MySQL:** `MODIFY COLUMN c tipo` cambia la definición conservando el
  nombre; `CHANGE COLUMN viejo nuevo tipo` cambia **nombre y definición** y exige repetir el tipo;
  `RENAME COLUMN a TO b` (8.0+) es el atajo cuando solo cambia el nombre.
4. **Nombres de las restricciones antes de borrarlas** (el deck no dice cómo averiguarlos):
  `SHOW CREATE TABLE Ofrece;` imprime la definición completa con los nombres de todas las FK.

---

## Dudas abiertas

- [ ] ¿Cuál es la consigna del slide 2 (*"Ejercicios"* sin enunciado): derivar los DER a tablas o
  escribir los `ALTER`?
- [ ] ¿Se toma PostgreSQL o MySQL en el parcial? Es la duda más cara de toda la clase.
- [ ] ¿El `ALTER TABLE tabla columna TYPE nuevo_tipo;` de los slides 3 y 5 es un error de tipeo por
  `ALTER TABLE tabla ALTER COLUMN columna TYPE nuevo_tipo;`?
- [ ] ¿Qué es el **`(OJO)!!!`** del `SET NOT NULL` (slide 5): los `NULL` preexistentes o la
  contradicción con `tutor` opcional en la Clase 02?
- [ ] ¿Qué significa el ***"(si es posible)"*** del `DELETE FROM Ofrece;` (slide 9)?
- [ ] ¿Qué había en el **recuadro negro** del slide 7?
- [ ] ¿Desde qué versión soporta MySQL el `ALTER TABLE … DROP CONSTRAINT` genérico?
- [ ] ¿Entra `TRUNCATE TABLE`, que el deck no menciona?
- [ ] ¿Importa el **nombre** de una `PRIMARY KEY`, si MySQL lo descarta?

## Enlaces

- Clase anterior: [[Clase 03 - Derivación a Esquema Lógico]] · clase siguiente: [[Clase 05 - Consultas de Datos–Parte 1]]
- Práctica correspondiente: [[Práctica 2026-08-04]]
- Otras clases del mismo día (03/08): [[Clase 01 - Introducción_BasesDeDatos]] · [[Clase 02 - Modelo Entidad-Relacion]] ·
  [[Clase 03 - Derivación a Esquema Lógico]] · [[Clase 05 - Consultas de Datos–Parte 1]] · [[Clase 05 - Consultas de Datos–Parte 2]] ·
  [[Clase 05 - Consultas de Datos–Parte 3]]
- Conceptos: [[DDL vs DML]] · [[Restricciones de integridad]] · [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] ·
  [[1.11.03 - Transacciones y ACID|Transacciones ACID]]
- Motores: [[MySQL]] · [[PostgreSQL]] · comparativa de sintaxis: [[Sintaxis MySQL vs PostgreSQL]]
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
