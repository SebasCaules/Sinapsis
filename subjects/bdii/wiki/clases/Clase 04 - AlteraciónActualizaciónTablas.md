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

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 04 - AlteraciónActualizaciónTablas.pdf` · **9 slides**
> Dictado en la **teórica del lunes 03/08**. El `04` del nombre del archivo **es el número de clase**:
> la numeración de la cátedra es la única que vale, y cada deck `BD2_Clase NN` es una clase propia.
> El 03/08 se dictaron varias: las Clases 01–05.
> Clase anterior: [[Clase 03 - Derivación a Esquema Lógico]] (derivación a esquema lógico).
> Clase siguiente: la **Clase 05**, repartida en **tres archivos** —
> [[Clase 05 - Consultas de Datos–Parte 1]] · [[Clase 05 - Consultas de Datos–Parte 2]] ·
> [[Clase 05 - Consultas de Datos–Parte 3]].
> Se practica con `ITBA TP 2 Creates.pdf` y `ITBA TP 3 SQL simples.pdf` → [[Práctica 2026-08-04]].
> Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]].

> [!warning] Este es el deck del problema de motor
> El slide 3 dice **textualmente**: *"La sintaxis de **PostgreSQL**"*. La cursada corre sobre
> **MySQL** ([[_cronograma]] § Diferencias con el programa oficial). No es una diferencia cosmética:
> **dos de las siete sentencias del slide 3 no compilan en MySQL** — la del cambio de tipo y la de
> nulidad, que el slide escribe en una sola línea con corchetes (`[SET NOT NULL | DROP NOT NULL]`) y
> que por lo tanto son **tres operaciones** distintas.
> Toda la página traduce cada sentencia; el resumen operativo está en
> [[#Tabla maestra de traducción PostgreSQL → MySQL]].

## Resumen

Nueve slides, cuatro temas: **cómo se modifica una tabla ya creada** (`ALTER TABLE`), **cómo se
borra** (`DROP TABLE`), **cómo se cargan y modifican datos** (`INSERT` / `UPDATE` / `DELETE`) y un
slide suelto de **ejercicios** con dos DER.

> [!note] Razonamiento propio, no está en el deck
> Es el cierre natural de la [[Clase 03 - Derivación a Esquema Lógico|Clase 03]]: aquella deriva el DER a `CREATE TABLE`,
> esta clase muestra qué hacer cuando la tabla ya existe y el modelo cambió.

| Slide | Tema | Qué hay que retener |
| --- | --- | --- |
| 1 | Portada | — |
| 2 | **Ejercicios**: dos DER (`AUTOR`/`LIBRO`, `EJEMPLAR`/`LIBRO`) | notación `(D)` para derivado, entidad débil |
| 3 | **`ALTER TABLE`** — las 7 formas | declara sintaxis **PostgreSQL** |
| 4 | Ejemplos I: `ADD COLUMN`, `DROP COLUMN`, `ADD CONSTRAINT`, `DROP CONSTRAINT` | `DROP CONSTRAINT` ≠ MySQL |
| 5 | Ejemplos II: `SET/DROP DEFAULT`, `SET/DROP NOT NULL`, cambio de tipo | `SET NOT NULL` ≠ MySQL |
| 6 | Ejemplos III: `ADD CONSTRAINT … PRIMARY KEY` / `… FOREIGN KEY` | idéntico en MySQL |
| 7 | **`DROP TABLE`** con `CASCADE \| RESTRICT` | en MySQL las dos palabras **no hacen nada** |
| 8 | **DML**: plantillas de `INSERT`, `DELETE`, `UPDATE` | idénticas en MySQL |
| 9 | Ejemplos de DML | `DELETE` sin `WHERE` borra todo |

**Razonamiento propio, no está en el deck:** la división es la clásica **DDL vs DML** → [[DDL vs DML]]:
slides 3–7 alteran el *esquema*, slides 8–9 alteran los *datos*. El deck **solo nombra el DML**
—slide 8, *"Sentencias del DML para agregar, modificar y eliminar datos de tablas"*— y nunca escribe
la sigla DDL.

---

## Tabla maestra de traducción PostgreSQL → MySQL

> [!important] Esta es la tabla que hay que tener al lado cuando se hace el TP
> Columna izquierda: **lo que dice el slide** (PostgreSQL). Columna derecha: **lo que hay que tipear**
> en MySQL. Donde dice **`verificar`** es porque no tengo certeza y hay que confirmarlo contra la
> documentación o en clase — no está inventado ni adivinado.

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
| `DROP CONSTRAINT` genérico | `ALTER TABLE t DROP CONSTRAINT n;` | **`verificar`** — existe en MySQL 8 moderno, pero no me consta desde qué versión; usar las tres formas específicas de arriba, que sí son seguras |
| Borrar tabla | `DROP TABLE t CASCADE;` / `RESTRICT` | MySQL **acepta las dos palabras y las ignora**: no hay borrado en cascada de objetos dependientes |
| `INSERT` / `UPDATE` / `DELETE` | tal cual el slide 8 | **idénticos** |

> [!note] Sobre el nombre de la PK en MySQL
> MySQL acepta `ADD CONSTRAINT Pk_Alumno PRIMARY KEY (…)`, pero internamente la clave primaria se
> llama siempre `PRIMARY`, así que el nombre que uno le ponga se pierde. Consecuencia práctica: una PK
> no se borra por nombre, se borra con `DROP PRIMARY KEY`. **Verificar en clase** si a la cátedra le
> importa el nombre o no.

---

## Slide 1 · Portada

`Bases de Datos II` · **ALTERACIÓN Y ACTUALIZACIÓN DE TABLAS**. Mismo template gris/naranja que el
resto de los decks de la teórica.

## Slide 2 · Ejercicios — dos DER

El slide se titula **`Ejercicios`** y **no trae ninguna consigna escrita**: son dos diagramas y nada
más. Está pegado inmediatamente después de la portada, antes de todo el contenido de la clase.

> [!bug] Slide huérfano
> Un slide titulado *"Ejercicios"* sin enunciado, colocado **antes** de la teoría que supuestamente
> se ejercita, y cuyo contenido (dos DER en notación de cátedra) es materia de la
> **[[Clase 03 - Derivación a Esquema Lógico|Clase 03]]** —derivación a esquema lógico—, no de `ALTER TABLE`. Lo más
> probable es que sea un slide arrastrado del deck anterior. **Preguntar en clase cuál es la
> consigna.**
> **Hipótesis, razonamiento propio:** derivar los dos DER a `CREATE TABLE` (Clase 03) y después
> escribir los `ALTER TABLE` que faltan (esta clase).

**DER izquierdo — `AUTOR` / `ES_AUTOR` / `LIBRO`:**

```
   ┌─────────┐ ┌─ ● CodAutor            ● = identificador principal
   │  AUTOR  │─┼─ ○ Apellido            ○ = descriptor
   └────┬────┘ ├─ ○ Nombre             ┈┈ = línea punteada → atributo OPCIONAL
        │      └┈┈ ○ Nacionalidad       ◇ = ROMBO → relación (así está dibujado en el slide)
      (1,N)
        │
   ◇────┴─────◇      (0,N)      ┌───────┐ ┌─ ● ISBN
   ◇ ES_AUTOR ◇──────────────── │ LIBRO │─┼─ ○ Titulo
   ◇──────────◇                 └───────┘ ├─ ○ Edicion ─┬─ ○ FechaEdicion
                                          │             ├─ ○ NumeroEdicion
                                          │             └─ ○ LugarEdicion
                                          ├─ ○ NombreGenero
                                          └┈┈ ○ NombreSubgenero
```

**DER derecho — `EJEMPLAR` / `POSEE` / `LIBRO`:**

```
   ╔══════════════╗ ┌─ ● NumeroEjemplar      ╔══╗ = doble rectángulo → ENTIDAD DÉBIL
   ║  EJEMPLAR    ║─┼─ ○ EsPrestable          ‖  = línea doble → relación con entidad débil
   ╚══════╤═══════╝ └─ ○ (D)EstaDisponible   (D) = prefijo → atributo DERIVADO
        (1,N)          ↑ un solo tronco       ◇  = ROMBO → relación
          ‖              para los tres
   ◇──────┴──────◇
   ◇    POSEE    ◇
   ◇──────┬──────◇
        (1,1)
          │
   ┌──────┴──────┐
   │    LIBRO    │  ● ISBN · ○ Titulo · ○ Edicion (FechaEdicion, NumeroEdicion,
   └─────────────┘  LugarEdicion) · ○ NombreGenero · ┈ ○ NombreSubgenero
```

`LIBRO` aparece **con exactamente los mismos atributos en los dos diagramas**: es la misma entidad
vista dos veces, no dos entidades distintas.

Lectura de los atributos, contra la notación fijada en [[Clase 02 - Modelo Entidad-Relacion]]:

| Atributo | Entidad | Qué dice la notación |
| --- | --- | --- |
| `CodAutor` · `ISBN` · `NumeroEjemplar` | AUTOR · LIBRO · EJEMPLAR | bolita **rellena** → identificador principal |
| `Nacionalidad` · `NombreSubgenero` | AUTOR · LIBRO | línea **punteada** → atributo **opcional** |
| `Edicion` | LIBRO | **compuesto**: cuelgan `FechaEdicion`, `NumeroEdicion`, `LugarEdicion` |
| `EstaDisponible` | EJEMPLAR | prefijo **`(D)`** → atributo **derivado** |
| `EJEMPLAR` | — | **doble rectángulo** → entidad **débil**, dependiente de `LIBRO` |

> [!tip] Este slide completa un hueco de notación de la Clase 02
> La tabla de notación de la [[Clase 02 - Modelo Entidad-Relacion|Clase 02]] cerraba con *"**Origen**
> (nativo/derivado) → **sin símbolo** — el
> deck define el concepto y nada más"*. Acá aparece el símbolo que faltaba: **se prefija `(D)` al
> nombre del atributo**. Hay que agregarlo a [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

> [!note] No hay ninguna línea entre `EsPrestable` y `(D)EstaDisponible`
> A baja resolución parece que del atributo `EsPrestable` bajara una línea hasta
> `(D)EstaDisponible`. Ampliando el slide se ve que **no**: los tres atributos de `EJEMPLAR` cuelgan
> de **un solo tronco vertical** que sale del rectángulo, y lo que parece una línea extra es el
> **codo inferior de ese tronco** —dibujado con una curva— al entrar en `(D)EstaDisponible`.
> El deck **no indica de qué atributo se deriva** `EstaDisponible`.

**Cardinalidades.** Aplicando la lectura **Look-Across** de la Clase 02 —el par `(mín,máx)` pegado a una
entidad cuenta ejemplares de *esa* entidad por cada ejemplar de la *otra*:

| Diagrama | Par | Se lee |
| --- | --- | --- |
| izq. | `(1,N)` pegado a `AUTOR` | cada **libro** tiene entre **1 y N autores** |
| izq. | `(0,N)` pegado a `LIBRO` | cada **autor** puede tener **0 o N libros** |
| der. | `(1,N)` pegado a `EJEMPLAR` | cada **libro** tiene entre **1 y N ejemplares** |
| der. | `(1,1)` pegado a `LIBRO` | cada **ejemplar** pertenece a **exactamente 1 libro** |

> [!note] Razonamiento propio, no está en el deck: esto confirma el look-across otra vez
> Con la lectura **min-max** (la de Merise/UML, que se escribe igual) el diagrama derecho diría *"cada
> libro tiene exactamente un ejemplar"* y *"cada ejemplar pertenece a 1..N libros"*, lo cual es
> **imposible para una entidad débil**: su identificación depende de **una sola** entidad fuerte. El
> `(1,1)` del lado fuerte es exactamente el patrón `(1,1):(*,N)` que la Clase 02 fijó en su slide 34.
> Los dos diagramas son consistentes con **look-across** y solo con esa lectura.

## Slide 3 · Modificación de tablas — las siete formas de `ALTER TABLE`

Texto de cabecera, transcripto tal cual:

> [!quote] Slide 3
> *"Una vez creada una tabla es posible realizar algunas modificaciones en su definición (ej, agregar
> o quitar columnas, especificar valores por defecto, incorporar restricciones o quitarlas, etc.*
> **La sintaxis de PostgreSQL**"

*(El paréntesis que abre en "(ej," **nunca se cierra**, y la frase en negrita arranca en la misma
línea, después del "etc.", sin separador y sin punto final propio — es así en el slide.)*

Las siete sentencias, exactamente como figuran:

```sql
ALTER TABLE tabla ADD COLUMN columna tipo;                      -- → Agrega columna

ALTER TABLE tabla DROP COLUMN columna;                          -- → Elimina columna

ALTER TABLE tabla RENAME COLUMN
     Columna_vieja TO columna_nueva;                            -- → renombra una columna

ALTER TABLE tabla columna TYPE nuevo_tipo;                      -- → cambia tipo de dato

ALTER TABLE tabla ALTER COLUMN columna
  [SET DEFAULT value | DROP DEFAULT]                            -- → Asigna o elimina valor por defecto

ALTER TABLE tabla ALTER COLUMN columna
  [SET NOT NULL | DROP NOT NULL]                                -- → Asigna o elimina rest. nulidad

ALTER TABLE tabla ADD CONSTRAINT name constraint-definition     -- → incorpora restricción
```

> [!bug] La cuarta sentencia está mal escrita en el slide
> Dice `ALTER TABLE tabla columna TYPE nuevo_tipo;` — **le falta el `ALTER COLUMN`**. No es válida en
> ningún motor. En PostgreSQL la forma correcta es:
> ```sql
> ALTER TABLE tabla ALTER COLUMN columna TYPE nuevo_tipo;
> ```
> El mismo error se repite en el slide 5 (`ALTER TABLE Alumno condicion TYPE VARCHAR(30);`), o sea
> que **no es un typo aislado del renderizado**: está mal en los dos lugares. **Verificar en clase.**

> [!warning] En MySQL no hay `ALTER COLUMN … TYPE` ni `SET/DROP NOT NULL`
> De las siete sentencias del slide, las que **no compilan** en MySQL son **dos**: la cuarta (cambio
> de tipo) y la sexta, que agrupa en una sola línea con corchetes las **dos** operaciones de nulidad.
> Son **tres operaciones** en total, y MySQL las resuelve todas con `MODIFY COLUMN`, que
> **redeclara la columna entera**:
> ```sql
> -- cambiar el tipo
> ALTER TABLE Alumno MODIFY COLUMN condicion VARCHAR(30);
> -- poner NOT NULL (hay que repetir el tipo, aunque no cambie)
> ALTER TABLE Alumno MODIFY COLUMN tutor VARCHAR(50) NOT NULL;
> -- quitar NOT NULL
> ALTER TABLE Alumno MODIFY COLUMN tutor VARCHAR(50) NULL;
> ```
> **Trampa de `MODIFY`:** como redeclara la columna completa, **todo atributo que no se vuelva a
> escribir se pierde** (el `DEFAULT`, por ejemplo). Si la columna tenía `DEFAULT 'Regular'` y se hace
> `MODIFY COLUMN condicion VARCHAR(30)` a secas, **el default desaparece**.

Las otras cuatro (`ADD COLUMN`, `DROP COLUMN`, `RENAME COLUMN`, `ADD CONSTRAINT`) y el par
`SET/DROP DEFAULT` funcionan igual en los dos motores.

> [!note] El slide 3 omite el `;` en las últimas tres sentencias
> Las tres que llevan corchetes de opcionalidad (`[SET DEFAULT … ]`, `[SET NOT NULL … ]`,
> `ADD CONSTRAINT name constraint-definition`) van sin punto y coma. Los corchetes son **notación de
> sintaxis** ("elegí una de estas alternativas"), no se tipean.

## Slide 4 · Ejemplos I — columnas y restricciones

```sql
ALTER TABLE Alumno
   ADD COLUMN condicion VARCHAR(10) DEFAULT   ´Regular´;
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

Tres cosas del slide que hay que mirar:

> [!bug] El comentario del segundo ejemplo dice la tabla equivocada
> `ALTER TABLE **Instituto** DROP COLUMN encargado;` con el comentario *"elimina la columna encargado
> de **Alumno**"*. La sentencia toca `Instituto`; el comentario dice `Alumno`. **Manda la sentencia.**
> *(Y el comentario del **primer** ejemplo dice "con **um** valor por defecto" — `um` en vez de `un`.
> **Conjetura propia:** es el "un" portugués.)*

> [!warning] Las comillas del slide no son comillas
> `DEFAULT ´Regular´` usa **acentos agudos** (`´`), no apóstrofes. Copiado y pegado tal cual **falla
> en cualquier motor**. Lo mismo pasa en el slide 5 con `‘Libre’` (comillas tipográficas curvas) y en
> el slide 9, que mezcla las dos formas en el mismo slide. Hay que retipear a mano:
> ```sql
> ALTER TABLE Alumno ADD COLUMN condicion VARCHAR(10) DEFAULT 'Regular';
> ```

> [!warning] `DROP CONSTRAINT` sobre una FK no es MySQL
> El cuarto ejemplo es el caso que más se va a usar en el TP. En MySQL:
> ```sql
> ALTER TABLE Ofrece DROP FOREIGN KEY Fk_Ofrece_Cur;
> ```
> Es exactamente la forma que aparece en `raw/Unidad-01/Practica/esq_peliculas.sql`, en el bloque de
> `drop` comentado del encabezado:
> ```sql
> alter table empleado drop foreign key empleado_id_distribuidor_fkey;
> ```
> O sea: **el deck enseña la sintaxis de un motor y el script del TP usa la del otro.** Ver
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

Traducción a MySQL, ejemplo por ejemplo:

| # | Slide (PostgreSQL) | MySQL |
| --- | --- | --- |
| 1 | `ALTER TABLE Alumno ALTER COLUMN condicion SET DEFAULT 'Libre';` | **igual** |
| 2 | `ALTER TABLE Alumno ALTER COLUMN condicion DROP DEFAULT;` | **igual** |
| 3 | `ALTER TABLE Alumno ALTER COLUMN tutor SET NOT NULL;` | `ALTER TABLE Alumno MODIFY COLUMN tutor <tipo> NOT NULL;` |
| 4 | `ALTER TABLE Alumno ALTER COLUMN tutor DROP NOT NULL;` | `ALTER TABLE Alumno MODIFY COLUMN tutor <tipo> NULL;` |
| 5 | `ALTER TABLE Alumno condicion TYPE VARCHAR(30);` *(mal escrito)* | `ALTER TABLE Alumno MODIFY COLUMN condicion VARCHAR(30);` |

> [!important] El `(OJO)!!!` del tercer ejemplo
> El deck marca `SET NOT NULL` con *"(OJO)!!!"* y **no explica por qué**.
> **Razonamiento propio, no está en el deck:** poner `NOT NULL` sobre una columna que **ya tiene
> filas con `NULL`** hace fallar la sentencia entera — el motor no puede satisfacer la restricción
> retroactivamente. Hay que hacer primero un `UPDATE` que rellene los nulos, y recién después el
> `ALTER`. Encima, `tutor` es justamente el atributo que la Clase 02 usaba como ejemplo de atributo
> **opcional** en la entidad `ALUMNO`: hacerlo obligatorio contradice el modelo conceptual.
> **Confirmar en clase cuál de las dos cosas es el "OJO".**

> [!note] El quinto ejemplo no lleva comentario
> Es el único de los cinco sin flecha explicativa, y encima es el que está mal escrito (mismo error
> que el slide 3). Da la impresión de haber quedado a medio hacer.

## Slide 6 · Ejemplos III — clave primaria y clave extranjera

```sql
ALTER TABLE Alumno
    ADD   CONSTRAINT Pk_Alumno PRIMARY KEY (LIBRETA)  ;
-- → Incorpora la restricción de clave primaria a la tabla Alumno;

ALTER TABLE Alumno
    ADD   CONSTRAINT Fk_Alumno_Univ  FOREIGN KEY (nom_univ)
               REFERENCES Universidad (nom_univ)  ;
-- → Incorpora la restricción de clave extranjera a la tabla Alumno
--   que referencia a la tabla Universidad;
```

> [!success] Este slide **sí** es portable
> Las dos sentencias funcionan igual en MySQL. Es además **el patrón que usa `esq_peliculas.sql`**:
> primero todos los `CREATE TABLE`, después un bloque de `ALTER TABLE … ADD CONSTRAINT … PRIMARY KEY`
> y por último otro de `ALTER TABLE … ADD CONSTRAINT … FOREIGN KEY … REFERENCES …`. Ejemplo real del
> script del TP:
> ```sql
> ALTER TABLE ciudad
>     ADD CONSTRAINT pk_ciudad PRIMARY KEY (id_ciudad);
>
> ALTER TABLE ciudad
>     ADD CONSTRAINT ciudad_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES pais(id_pais);
> ```

> [!tip] Por qué se declaran las FK aparte y no dentro del `CREATE TABLE`
> **Razonamiento propio, no está en el deck:** porque una FK solo puede apuntar a una tabla que ya
> exista. Si se declaran dentro del `CREATE`, hay que crear las tablas en orden topológico, y con
> ciclos (`empleado.id_jefe → empleado`, o `departamento.jefe_departamento → empleado` mientras
> `empleado.(id_distribuidor, id_departamento) → departamento`) **no hay orden posible**. Sacando las FK a `ALTER TABLE`
> el orden de creación deja de importar. `esq_peliculas.sql` tiene los dos ciclos.

**Convención de nombres del deck** (útil porque el TP la sigue): `Pk_<Tabla>` para primarias,
`Fk_<Tabla>_<TablaReferenciada>` para extranjeras, `U_<algo>` para unicidad. El script del TP mezcla
esa convención con la que genera PostgreSQL automáticamente (`<tabla>_<columna>_fkey`).

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

Y el cierre: **→ *"tener precaución en su uso"***.

> [!warning] En MySQL `CASCADE` y `RESTRICT` no hacen nada
> MySQL **acepta las dos palabras clave** —están para facilitar el porteo de scripts— pero **las
> ignora**: no existe el borrado en cascada de objetos dependientes. En MySQL, `DROP TABLE` sobre una
> tabla referenciada por una FK **falla**, y las salidas son dos:
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
> La opción (a) es la que usa `esq_peliculas.sql` en su encabezado comentado: borra en orden inverso y
> mete un `alter table empleado drop foreign key …` en el medio, justo para romper el ciclo.

> [!bug] Hay un rectángulo negro en el slide
> **A la derecha** de *"tener precaución en su uso"*, a la misma altura y algo más alto que la línea
> de texto, hay un **recuadro negro sólido** más alto que ancho. Parece una imagen rota o tapada al
> exportar a PDF. **Preguntar si falta contenido ahí.**

> [!note] `DROP TABLE` vs. `DELETE FROM` vs. `TRUNCATE` — fuera del deck
> El deck **no menciona `TRUNCATE`**. La distinción entra en el parcial con frecuencia:
> `DROP TABLE` elimina **definición + datos**; `DELETE FROM t` (slide 9) elimina **datos, fila por
> fila, y se puede filtrar con `WHERE`**; `TRUNCATE TABLE t` elimina todos los datos de golpe pero
> conserva la tabla. **Razonamiento propio: verificar si la cátedra lo toma.**

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

> [!success] Todo el slide 8 es idéntico en MySQL
> Es SQL estándar. Los corchetes son notación: la lista de columnas del `INSERT` es opcional, y el
> `WHERE` del `DELETE` y del `UPDATE` **también** — y ahí está el peligro (slide 9).

| Sentencia | Sin la parte opcional | Consecuencia |
| --- | --- | --- |
| `INSERT` sin `lista_columnas` | hay que dar **un valor por cada columna, en el orden de la tabla** | si cambia el orden de columnas, el script se rompe en silencio |
| `DELETE` sin `WHERE` | borra **todas** las filas | irreversible fuera de una transacción |
| `UPDATE` sin `WHERE` | actualiza **todas** las filas | ídem |

## Slide 9 · Ejemplos de DML

```sql
INSERT INTO Curso (id_curso, titulo)
   VALUES ( 208, ‘Bases de Datos’ );
   -- → Al no especificarse el valor de duración, éste tomaría su valor por defecto (60)

INSERT INTO Curso VALUES (134, ´Comunicación de Datos´, 45);
   -- → se incorpora un nuevo curso (no se requiere el nombre de columnas
   --   porque se insertan valores para todas

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

Lo que enseña cada par:

| Par | Contraste |
| --- | --- |
| `INSERT` 1 vs. 2 | **con** lista de columnas → las omitidas toman su `DEFAULT` (acá `duracion` = 60) · **sin** lista → hay que dar todos los valores, en orden |
| `UPDATE` 1 vs. 2 | **sin `WHERE`** → toca todas las filas; el `SET` puede usar el **valor actual de la propia columna** (`duracion = duracion + 20`) · **con `WHERE`** → solo las filas que cumplen la condición |
| `DELETE` 1 vs. 2 | **sin `WHERE`** → vacía la tabla · **con `WHERE`** → borra un subconjunto |

> [!question] El *"(si es posible)"* subrayado del `DELETE FROM Ofrece;`
> El deck lo subraya y no lo explica.
> **Razonamiento propio, no está en el deck:** el borrado puede fallar si **otra tabla referencia**
> las filas de `Ofrece` con una FK sin `ON DELETE CASCADE`. También puede fallar por permisos.
> **Verificar en clase.**

> [!warning] Los dos `UPDATE`/`DELETE` sin `WHERE` fallan en MySQL Workbench
> Workbench viene con el **modo *safe updates*** activado por defecto: un `UPDATE` o `DELETE` que no
> filtre por una columna con índice se rechaza con el **error 1175**. `UPDATE Curso SET duracion =
> duracion + 20;` y `DELETE FROM Ofrece;` son exactamente ese caso. Para correrlos:
> ```sql
> SET SQL_SAFE_UPDATES = 0;
> ```
> Es una protección, no un bug: conviene volver a poner `1` después.

> [!bug] Los ejemplos del deck no forman una secuencia coherente
> El slide 4 hace `ALTER TABLE Instituto DROP COLUMN encargado;` y el slide 9 hace
> `UPDATE Instituto SET encargado = 'Juan Perez'`. Si se corrieran en orden, el segundo fallaría:
> la columna ya no existe. **Cada ejemplo es independiente, no un script.** Importa para el TP: no
> hay que copiarlos en bloque.

> [!bug] Dos defectos de tipeo más en este slide
> - El comentario del segundo `INSERT` abre un paréntesis y **no lo cierra**: *"(no se requiere el
>   nombre de columnas porque se insertan valores para todas"* — falta también la palabra final
>   (*"…para todas **las columnas**"*, presumiblemente).
> - El comentario *"se agregan 20 (horas) a todos los cursos"* del tercer ejemplo queda **pisado**
>   por la línea del `UPDATE Instituto`: en el PDF la palabra `cursos` se superpone con
>   `SET encargado = 'Juan Perez'`. Es un problema de layout del deck, no de contenido.

---

## El esquema implícito de los ejemplos

> [!note] Reconstrucción propia, no está en ningún slide
> El deck nunca muestra los `CREATE TABLE`, pero los ejemplos son consistentes entre sí y dejan
> deducir el esquema. Sirve para entender qué se está tocando en cada sentencia.

| Tabla | Columnas que se deducen | De dónde sale |
| --- | --- | --- |
| `Alumno` | `LIBRETA` (PK) · `nom_univ` (FK→`Universidad`) · `tutor` · `condicion` | slides 4, 5, 6 |
| `Universidad` | `nom_univ` (PK, referenciada) | slide 6 |
| `Instituto` | `cod_instituto` · `encargado` | slides 4, 9 |
| `Curso` | `id_curso` · `titulo` (UNIQUE `U_tit`) · `duracion` (`DEFAULT 60`) | slides 4, 9 |
| `Ofrece` | `cod_instituto` · *(id de curso)* · FK `Fk_Ofrece_Cur` → `Curso` | slides 4, 9 |

Que `Curso` tenga **exactamente tres columnas** se deduce del `INSERT INTO Curso VALUES (134, …, 45);`
sin lista de columnas: da tres valores. Que `duracion` tenga `DEFAULT 60` está dicho en el comentario
del primer `INSERT`. Que `condicion` **no existía originalmente** está dicho por el `ADD COLUMN` del
slide 4 — es decir, el deck simula una migración: `Alumno` se creó sin `condicion` y se la agrega
después.

`Ofrece` es la tabla intermedia de una relación **N:N entre `Instituto` y `Curso`** (un instituto
ofrece muchos cursos, un curso es ofrecido por muchos institutos) — de ahí que borrar sus filas
*"elimina los vínculos"*, palabra textual del slide 9.

## Fuera del deck: lo que igual hay que saber para el TP

> [!important] Nada de esta sección está en los 9 slides
> Es razonamiento propio y experiencia de motor. Se separa a propósito para no contaminar la
> transcripción. **Confirmar lo que se use en el parcial.**

1. **`ALTER TABLE` admite varias acciones en una sola sentencia**, separadas por coma:
   ```sql
   ALTER TABLE Alumno
     ADD COLUMN condicion VARCHAR(10) DEFAULT 'Regular',
     DROP COLUMN tutor;
   ```
2. **En MySQL el DDL hace *commit* implícito**: un `ALTER TABLE` o un `DROP TABLE` **no se puede
   deshacer con `ROLLBACK`**, y además cierra la transacción abierta. En PostgreSQL el DDL **sí** es
   transaccional. Es una diferencia de fondo entre los dos motores, no de sintaxis, y explica por qué
   el *"tener precaución"* del slide 7 pesa más en MySQL. Se retoma en [[1.11.03 - Transacciones y ACID|Transacciones ACID]].
3. **`MODIFY` vs. `CHANGE` en MySQL:** `MODIFY COLUMN c tipo` cambia la definición conservando el
   nombre; `CHANGE COLUMN viejo nuevo tipo` cambia **nombre y definición** a la vez y exige repetir el
   tipo. `RENAME COLUMN a TO b` (8.0+) es el atajo cuando solo cambia el nombre.
4. **Para saber qué restricciones tiene una tabla antes de borrarlas** —el deck da el `DROP CONSTRAINT`
   pero no cómo averiguar el nombre—, en MySQL: `SHOW CREATE TABLE Ofrece;` imprime la definición
   completa con los nombres de todas las FK.

---

## Dudas abiertas

- [ ] **¿Cuál es la consigna del slide 2?** El slide se llama *"Ejercicios"* y no tiene enunciado.
      ¿Es derivar los DER a tablas (Clase 03) o escribir los `ALTER` (esta clase)?
- [ ] **¿Se toma PostgreSQL o MySQL en el parcial?** El deck declara PostgreSQL, la cursada corre
      sobre MySQL y `esq_peliculas.sql` usa `DROP FOREIGN KEY`, que es MySQL. Es la duda más cara de
      toda la clase.
- [ ] ¿El `ALTER TABLE tabla columna TYPE nuevo_tipo;` de los slides 3 y 5 es un error de tipeo por
      `ALTER TABLE tabla ALTER COLUMN columna TYPE nuevo_tipo;`? Aparece mal **dos veces**.
- [ ] ¿Qué es el **`(OJO)!!!`** del `SET NOT NULL` (slide 5): las filas con `NULL` preexistentes, o la
      contradicción con `tutor` declarado opcional en la Clase 02?
- [ ] ¿Qué significa el ***"(si es posible)"*** subrayado del `DELETE FROM Ofrece;` (slide 9)?
- [ ] ¿Qué había en el **recuadro negro** del slide 7?
- [ ] ¿Desde qué versión soporta MySQL el `ALTER TABLE … DROP CONSTRAINT` genérico? *(Mientras tanto
      se usan `DROP FOREIGN KEY` / `DROP PRIMARY KEY` / `DROP INDEX`, que son seguras.)*
- [ ] ¿Entra `TRUNCATE TABLE`, que el deck no menciona?
- [ ] ¿Importa el **nombre** que se le da a una `PRIMARY KEY`, si MySQL lo descarta?

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
