---
tipo: teorica
clase: 5
deck: "BD2_Clase 05 - Consultas de Datos–Parte 1.pdf"
unidad: 1
tema: "SQL: SELECT, WHERE, LIKE, fechas, NULL, ORDER BY"
resumen: "El SELECT cláusula por cláusula sobre el esquema Voluntarios, de DISTINCT y WHERE hasta GROUP BY y HAVING, en un deck que mezcla Oracle y PostgreSQL; la cursada usa MySQL. Claves: los nulos solo se testean con IS NULL, AND y OR mezclados exigen paréntesis y los agregados van en HAVING, no en WHERE."
fecha: 2026-08-03
modalidad: virtual, lunes 19:00–22:00 — asincrónico
aliases:
  - BD2_Clase 05 Parte 1
  - Clase 05 — Consultas de Datos (Parte 1)
  - Consultas de Datos Parte 1
  - SELECT FROM WHERE
  - Chuleta SQL básico
  - Funciones de agregación GROUP BY HAVING
  - Esquema Voluntarios
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 1.pdf"
estado: procesado
---

# Clase 05 — Consultas de Datos (Parte 1)

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 1.pdf` · **36 slides**
> Dictada el **lunes 03/08**, de forma **asincrónica**. El `05` del nombre del archivo **es el número
> de clase**: la numeración de la cátedra (`BD2_Clase NN` → Clase NN) es la única que vale.
> La **Clase 05 es una sola clase repartida en tres archivos**, y esta página es la **parte 1 de 3**:
> sigue en [[Clase 05 - Consultas de Datos–Parte 2]] y cierra en [[Clase 05 - Consultas de Datos–Parte 3]].
> Clase anterior: [[Clase 04 - AlteraciónActualizaciónTablas]]. Índice general: [[_index-clases]].
> Se practica con `ITBA TP 3 SQL simples.pdf` sobre `esq_peliculas.sql` →
> [[Práctica 2026-08-04]]. Bibliografía: [[_index-bibliografia]].

> [!warning] Este deck **no** cubre fechas ni funciones de string
> A pesar de que el cronograma anuncia *"Repaso de SQL, SQL avanzado, manejo de fechas"* para esta
> clase, la **parte 1 no toca fechas** más allá de usar `MAX`/`MIN` sobre `fecha_nacimiento`
> (slide 25), y **no toca funciones de string**. Tampoco hay `JOIN`, ni subconsultas, ni `IN`.
> Todo eso tiene que estar en las partes 2 y 3.
> A cambio, la parte 1 **sí** llega hasta **funciones de agregación, `GROUP BY` y `HAVING`**
> (slides 23–35), que uno esperaría en la parte 2.

## Resumen

`SELECT` es **EL QUE**, `FROM` es **DE DONDE**. El deck recorre la sentencia cláusula por cláusula en
el orden en que se escribe, sobre un esquema de ejemplo de **voluntarios** que arrastra durante los 36
slides. Cierra con la familia de agregación.

| Tema | Cláusula / operador | Slides |
| --- | --- | --- |
| Dónde cae `SELECT` dentro de SQL | DDL vs. DML | 2 |
| Forma básica y cierre relacional | `SELECT … FROM` | 3 |
| Convenciones de escritura | mayúsculas, sangría, `;` | 4 |
| **Esquema de ejemplo** (se usa en todos los ejemplos) | BD Voluntarios | 5 |
| Proyección de todo vs. de algunas columnas | `SELECT *` · lista de columnas | 6–7 |
| Duplicados | `DISTINCT` | 8–9 |
| Selección de filas | `WHERE` + comparación + lógicos | 10–11 |
| Lógica del resultado de una comparación | T / F / **U** | 12 |
| Rangos | `[NOT] BETWEEN x AND y` | 13 |
| Patrones de texto | `[NOT] LIKE` con `%` y `_` | 14 |
| Nulos | `IS [NOT] NULL` | 15–16 |
| Condiciones compuestas y **precedencia** | `AND` · `OR` · `NOT` · paréntesis | 17–19 |
| Orden del resultado | `ORDER BY … ASC/DESC` | 20 |
| Paginado *(PostgreSQL)* | `LIMIT` · `OFFSET` | 21–22 |
| Funciones de agregación | `SUM AVG STDDEV MAX MIN COUNT` | 23–26 |
| Agregación y nulos | `COALESCE` | 27 |
| Alias | `AS`, alias de tabla | 28 |
| Agrupamiento | `GROUP BY` | 29–32 |
| Filtro sobre grupos | `HAVING` | 33–34 |
| Error clásico | agregado en `WHERE` | 35 |
| Cierre | *"Para Recordar!!!"* | 36 |

> [!important] Los tres motores mezclados en un solo deck
> El **DDL del esquema está en sintaxis Oracle** (`VARCHAR2`, `NUMBER(p,s)`), el slide 21–22 dice
> literalmente **`LIMIT and OFFSET (PostgreSQL)`**, el mensaje de error del slide 35 es de
> **PostgreSQL** (`ERROR: aggregates not allowed in WHERE clause`), y **la cursada corre sobre
> MySQL**. Traducción cláusula por cláusula en [[#PostgreSQL/Oracle → MySQL]] al final.

---

## Slide 2 · Dónde cae `SELECT` dentro del estándar SQL

El slide muestra una imagen —*"Algunas funciones del estandar SQL"*— con `SELECT` **rodeado en rojo**:

| Sublenguaje | Función | Sentencias |
| --- | --- | --- |
| **DDL** | Definición de datos | Creación de objetos (`CREATE`) · Modificación de objetos definidos (`ALTER`) · Eliminación de objetos definidos (`DROP`) |
| **DML** | Actualización de los datos | Inserción (`INSERT`) · Actualización (`UPDATE`) · Eliminación (`DELETE`) |
| **DML** | **Consulta de datos** ← el círculo rojo | **Selección (`SELECT`)** |

> *"Los objetos pueden ser: tablas, vistas, índices, dominios, etc."*

El DDL y el `INSERT`/`UPDATE`/`DELETE` son la [[Clase 04 - AlteraciónActualizaciónTablas]] (`BD2_Clase 04`); esta clase es
solo la última línea del cuadro.

## Slide 3 · Forma básica del `SELECT`

Para la recuperación de los datos a partir de tablas cargadas en la base de datos se utiliza la
sentencia `SELECT`. **El formato más simple y básico es:**

```sql
SELECT * | { [DISTINCT] columna | expresion [alias],...}
FROM  <lista tablas>
```

- *"En una consulta se especifica **qué** información se requiere, sin especificar **cómo** obtenerla,
  no le especificamos métodos de acceso a los datos."* ← SQL es **declarativo**.
- **`SELECT` identifica las columnas a recuperar – EL QUE**
- **`FROM` identifica la tabla – DE DONDE obtener los datos**
- *"El resultado de una consulta es una **tabla** (si es un número, se considera como una tabla con una
  fila y una columna)."* ← es la **propiedad de cierre** del modelo relacional: la salida de una
  consulta es del mismo tipo que su entrada, y por eso se puede anidar.

> [!note] Cómo leer el diagrama de sintaxis — **razonamiento propio, el deck no explica la notación**
> `|` = alternativa · `{ }` = agrupación · `[ ]` = opcional · `,...` = repetible.
> O sea: o ponés `*`, o ponés una lista de columnas/expresiones, cada una con un alias opcional,
> y `DISTINCT` opcional adelante de toda la lista.

## Slide 4 · Escritura de sentencias SQL

| Regla del slide | Consecuencia práctica |
| --- | --- |
| **NO** son sensibles a mayúsculas/minúsculas | `select`, `SELECT` y `SeLeCt` son lo mismo |
| Pueden ocupar **una o más líneas** | el `;` es lo que cierra, no el salto de línea |
| Las palabras clave **NO** se pueden abreviar ni dividir entre líneas | no existe `SEL`, ni `SEL\nECT` |
| Las cláusulas suelen colocarse **en líneas separadas y con sangría** | legibilidad |
| Se estila **MAYÚSCULAS** para las palabras reservadas y **minúsculas** para el resto | convención de la cátedra |

```sql
SELECT mi_atributo
FROM   mi_tabla;
```

> [!warning] "No son sensibles a mayúsculas/minúsculas" vale para las **palabras clave**
> El slide no distingue, pero la insensibilidad es de las palabras reservadas. **Los identificadores
> (nombres de tablas y columnas) sí dependen del motor y del sistema de archivos**, y **los datos**
> comparados con `=` o `LIKE` dependen de la *collation*. Ver [[#PostgreSQL/Oracle → MySQL]].

## Slide 5 · Esquema de ejemplo — BD Voluntarios

El slide se titula **"Esquema Ejemplo DERE BD Voluntarios"** y muestra el diagrama con las 7 tablas,
sus tipos y su nulabilidad. **Los atributos en rojo son las claves foráneas**; el compartimento de
arriba de cada caja es la **clave primaria**. Transcripción literal de los tipos:

| Tabla | Columna | Tipo declarado en el diagrama | Rol |
| --- | --- | --- | --- |
| **CONTINENTE** | `id_continente` | `NUMBER NOT NULL` | **PK** |
| | `nombre_continente` | `VARCHAR2(25) NULL` | |
| **PAIS** | `id_pais` | `CHAR(2) NOT NULL` | **PK** |
| | `nombre_pais` | `VARCHAR2(40) NULL` | |
| | `id_continente` | `NUMBER NOT NULL` | **FK** → `CONTINENTE` |
| **DIRECCION** | `id_direccion` | `NUMBER(4) NOT NULL` | **PK** |
| | `calle` | `VARCHAR2(40) NULL` | |
| | `codigo_postal` | `VARCHAR2(12) NULL` | |
| | `ciudad` | `VARCHAR2(30) NOT NULL` | |
| | `provincia` | `VARCHAR2(25) NULL` | |
| | `id_pais` | `CHAR(2) NOT NULL` | **FK** → `PAIS` |
| **INSTITUCION** | `id_institucion` | `NUMBER(4) NOT NULL` | **PK** |
| | `nombre_institucion` | `VARCHAR2(60) NOT NULL` | |
| | `id_director` | `NUMBER(6) NULL` | **FK** → `VOLUNTARIO` |
| | `id_direccion` | `NUMBER(4) NULL` | **FK** → `DIRECCION` |
| **VOLUNTARIO** | `nro_voluntario` | `NUMBER(6) NOT NULL` | **PK** |
| | `nombre` | `VARCHAR2(20) NULL` | |
| | `apellido` | `VARCHAR2(25) NOT NULL` | |
| | `e_mail` | `VARCHAR2(25) NOT NULL` | |
| | `telefono` | `VARCHAR2(20) NULL` | |
| | `fecha_nacimiento` | `DATE NOT NULL` | |
| | `id_tarea` | `VARCHAR2(10) NOT NULL` | **FK** → `TAREA` |
| | `horas_aportadas` | `NUMBER(8,2) NULL` | |
| | `porcentaje` | `NUMBER(2,2) NULL` | |
| | `id_institucion` | `NUMBER(4) NULL` | **FK** → `INSTITUCION` |
| | `id_coordinador` | `NUMBER(6) NULL` | **FK** → `VOLUNTARIO` *(recursiva)* |
| **TAREA** | `id_tarea` | `VARCHAR2(10) NOT NULL` | **PK** |
| | `nombre_tarea` | `VARCHAR2(35) NOT NULL` | |
| | `min_horas` | `NUMBER(6) NULL` | |
| | `max_horas` | `NUMBER(6) NULL` | |
| **HISTORICO** | `fecha_inicio` | `DATE NOT NULL` | **PK** (parte 1) |
| | `nro_voluntario` | `NUMBER(6) NOT NULL` | **PK** (parte 2) + **FK** → `VOLUNTARIO` |
| | `fecha_fin` | `DATE NOT NULL` | |
| | `id_tarea` | `VARCHAR2(10) NOT NULL` | **FK** → `TAREA` |
| | `id_institucion` | `NUMBER(4) NULL` | **FK** → `INSTITUCION` |

Tres cosas del esquema que después explican los ejemplos:

1. **`id_coordinador` es una FK recursiva a `VOLUNTARIO`** y es **`NULL`able** → hay voluntarios sin
   coordinador (el jefe de todos). De ahí sale el ejemplo de `IS NULL` del slide 15.
2. **`porcentaje` es `NUMBER(2,2)`** — en Oracle eso es precisión 2, escala 2, o sea **valores
   menores que 1 con dos decimales**. Por eso el slide 16 filtra `porcentaje <= 0.1` y no `<= 10`.
3. **`HISTORICO` tiene PK compuesta** `(fecha_inicio, nro_voluntario)`.

> [!note] Es el esquema HR de Oracle renombrado — razonamiento propio, no está en el deck
> `voluntario` ← *employees*, `institucion` ← *departments*, `tarea` ← *jobs*, `direccion` ←
> *locations*, `pais` ← *countries*, `continente` ← *regions*, `historico` ← *job_history*. Los datos
> de los screenshots lo confirman: **Steven King**, **Alexander Hunold**, **Neena Kochhar**,
> **Lex De Haan**, y códigos de tarea `AD_PRES`, `ST_MAN`, `ST_CLERK`, `PU_CLERK`, `SA_MAN`.
> Sirve saberlo: los ejemplos del deck se pueden reproducir contra cualquier instalación del schema
> HR. **El TP 3 no usa este esquema sino `esq_peliculas.sql`.**

> [!bug] El deck le dice "horas_aportadas" a lo que en HR era el sueldo
> Los valores de `horas_aportadas` que muestran los screenshots son `24000.00`, `13500.00`,
> `3300.00`, `2500.00` — son sueldos de HR, no horas. `SUM(horas_aportadas)` de todos da
> `691400.00` (slide 23). No cambia nada de la sintaxis, pero los resultados **no tienen sentido
> semántico**: no interpretar los números.

## Slides 6–7 · Proyección

**Slide 6 — todas las columnas.** *Ejemplo: selección de los datos completos de las instituciones.*

```sql
SELECT *
FROM   institucion;
```

> `*` *"Se usa para especificar la recuperación de todos los datos de la/s tabla/s"*

El slide deja **una pregunta en rojo, sin responder**:

> [!question] *"Porque se recomienda **evitar** su uso? Y en su lugar seleccionar **SOLO** los campos necesarios…"*
> **Razonamiento propio, no está en el deck:** (a) transfiere columnas que no se usan → más I/O y más
> red; (b) impide que un índice sea *covering*, forzando ir a la tabla; (c) **rompe el código si
> alguien agrega, saca o reordena una columna**, porque el consumidor accede por posición; (d) hace
> ilegible qué necesita realmente la consulta. **Confirmar en clase** — esto se retoma cuando entren
> índices y explain plan en [[Clase 08 - Explicando el plan]].

Salida transcrita del slide (**27 fila(s)**, columnas en el orden en que las muestra el screenshot):

```
nombre_institucion                                  | id_director | id_direccion | id_institucion
CASA DE LA PROVIDENCIA                              |         200 |         1700 |             10
CORPORACION URRACAS DE EMAUS                        |         201 |         1800 |             20
FUNDACION CIVITAS                                   |         114 |         1700 |             30
FUNDACION LAS ROSAS DE AYUDA FRATERNA               |         203 |         2400 |             40
FUNDACION HOGAR DE CRISTO                           |         121 |         1500 |             50
FUNDACION MI CASA                                   |         103 |         1400 |             60
CORPORACION SOLIDARIDAD Y DESARROLLO                |         204 |         2700 |             70
FUNDACION REGAZO                                    |         145 |         2500 |             80
FUNDACION ALERTA BOSQUES                            |         100 |         1700 |             90
BOSQUEDUCA                                          |         108 |         1700 |            100
COMITE NACIONAL PRO DEFENSA DE LA FLORA Y LA FAUNA  |         205 |         1700 |            110
CONSEJO ECOLOGICO COMUNAL                           |        NULL |         1700 |            120
CORPORACION AMBIENTAL                               |        NULL |         1700 |            130
FUNDACION VIDA RURAL                                |        NULL |         1700 |            140
CENTRO DE AYUDA MAPUCHE                             |        NULL |         1700 |            150
SIERRAS PROTEGIDAS                                  |        NULL |         1700 |            160
CENTRO DE EDUCACION AMBIENTAL                       |        NULL |         1700 |            170
RENACE- RED DE ACCION ECOLOGICA                     |        NULL |         1700 |            180
Contracting                                         |        NULL |         1700 |            190
CONSEJO NACIONAL DE LA JUVENTUD                     |        NULL |         1700 |            200
DEFENSA DE LOS DERECHOC DEL NIÑO                    |        NULL |         1700 |            210
FUNDACION CHILDREN                                  |        NULL |         1700 |            220
CORPORACION ANGLICANA                               |        NULL |         1700 |            230
CORPORACION EVANGELICA                              |        NULL |         1700 |            240
CENTRO ECUMENICO                                    |        NULL |         1700 |            250
…
Ademas:27 fila(s)
Tiempo total de ejecución: 2.589 ms
SQL ejecutada.
```

> [!tip] Ese footer es información, no decoración — **razonamiento propio, no está en el deck**
> `27 fila(s)` + `Tiempo total de ejecución: 2.589 ms` es lo que hay que mirar cuando llegue el
> **explain plan** ([[Clase 08 - Explicando el plan]]): la misma consulta con proyección chica tarda distinto.
> Y `SELECT *` acá devuelve las columnas **en un orden que no es el del diagrama del slide 5**
> (`nombre_institucion` primero, `id_institucion` último): otra razón para no usarlo.

**Slide 7 — solo algunas columnas.** *Ejemplo: seleccionar el código y el nombre de las instituciones.*

```sql
SELECT id_institucion, nombre_institucion
FROM   institucion;
```

Ahora **el orden de las columnas del resultado es el que yo pedí**, no el de la tabla:

```
id_institucion | nombre_institucion
            10 | CASA DE LA PROVIDENCIA
            20 | CORPORACION URRACAS DE EMAUS
            30 | FUNDACION CIVITAS
            40 | FUNDACION LAS ROSAS DE AYUDA FRATERNA
            50 | FUNDACION HOGAR DE CRISTO
            60 | FUNDACION MI CASA
            70 | CORPORACION SOLIDARIDAD Y DESARROLLO
            80 | FUNDACION REGAZO
            90 | FUNDACION ALERTA BOSQUES
           100 | BOSQUEDUCA
           110 | COMITE NACIONAL PRO DEFENSA DE LA FLORA Y LA FAUNA
           120 | CONSEJO ECOLOGICO COMUNAL
           130 | CORPORACION AMBIENTAL
           140 | FUNDACION VIDA RURAL
           150 | CENTRO DE AYUDA MAPUCHE
           160 | SIERRAS PROTEGIDAS
           170 | CENTRO DE EDUCACION AMBIENTAL
           180 | RENACE- RED DE ACCION ECOLOGICA
           190 | Contracting
```

El screenshot corta en la fila 190 — **no muestra las 27 filas**, aunque la consulta las devuelve
igual que en el slide 6.

## Slides 8–9 · Filas duplicadas y `DISTINCT`

> *"Por defecto, ante una consulta, se recuperan todas las filas, **incluidas** las filas duplicadas."*

Este es **el punto donde SQL se separa del álgebra relacional**: una tabla SQL es un *multiconjunto*
(bag), no un conjunto.

*Ejemplo: seleccionar los voluntarios que son coordinadores.*

```sql
SELECT id_coordinador
FROM   voluntario;
```

*Ejemplo: seleccionar los **distintos** voluntarios que son coordinadores.*

```sql
SELECT DISTINCT id_coordinador
FROM   voluntario;
```

Los dos resultados, uno al lado del otro en el slide:

```
sin DISTINCT              con DISTINCT
──────────────            ──────────────
NULL                      NULL
100                       205
100                       122
102                       120
103                       101
103                       103
103                       108
103                       145
101                       100
108                       201
108                       124
108                       114
108                       121
108                       123
100                       102
114                       146
114                       147
114                       148
114                       149
114
100
100
100
100
100
120
120
120
120
…
```

La columna de la izquierda muestra **29 filas y sigue** (el slide corta con `…`); la de la derecha
muestra **19 valores** y ahí termina.

> [!important] Tres cosas que se leen en esa comparación
> 1. **`DISTINCT` conserva una fila `NULL`.** Para `DISTINCT` (y para `GROUP BY`) **todos los nulos son
>    "el mismo valor"**, aunque `NULL = NULL` no sea verdadero. Es la excepción a la regla del
>    slide 12.
> 2. **`DISTINCT` no ordena.** El resultado sale `NULL, 205, 122, 120, …` — desordenado. Si querés
>    orden, `ORDER BY` (slide 20).
> 3. La consulta se lee *"los voluntarios que son coordinadores"*, pero devuelve **la columna
>    `id_coordinador` de la tabla `voluntario`**: son los **coordinadores referenciados**, sacados de
>    la FK recursiva. La fila `NULL` no es un coordinador, es *"hay voluntarios sin coordinador"*.

**Slide 9 — `DISTINCT` se aplica a la lista entera, no a una columna.**

> *"La cláusula `DISTINCT` se aplica a **todas** las columnas de la lista en el `SELECT`."*

*Ejemplo: seleccionar los voluntarios coordinadores y las distintas instituciones de los empleados
coordinados.*

```sql
SELECT DISTINCT id_institucion,
                id_coordinador
FROM   voluntario;
```

```
id_institucion | id_coordinador
            90 | NULL
           110 |            101
           100 |            101
            40 |            101
            80 |            100
           110 |            205
           100 |            108
            30 |            100
            50 |            100
            80 |            147
            80 |            148
            60 |            102
            30 |            114
            50 |            124
            80 |            149
            50 |            121
            50 |            123
            80 |            146
            60 |            103
            20 |            100
            20 |            201
            90 |            100
            70 |            101
            80 |            145
            10 |            101
            50 |            122
          NULL |            149
            50 |            120
```

En esas 28 filas `id_coordinador = 100` aparece **cinco veces** (con instituciones 80, 30, 50, 20 y
90) y `id_institucion = 80` aparece **seis** (con coordinadores 100, 147, 148, 149, 146 y 145): lo
que se deduplica es **el par completo**, no cada columna. No existe
*"`DISTINCT` de una sola columna"*.

## Slides 10–11 · `WHERE`

> *"La cláusula `WHERE` se usa para realizar las restricciones."*
> *"Las filas recuperadas son aquellas cuyos datos satisfacen **todas** la/s condición/es lógicas."*

Una cláusula `WHERE` contiene condiciones lógicas que utilizan:

| Familia | Operadores, textual del slide |
| --- | --- |
| **operadores de comparación** | `<`, `>`, `=`, `<=`, `>=`, `<>`, `!=` |
| **operadores lógicos** | `AND`, `OR`, `NOT` |

Sintaxis acumulada hasta acá:

```sql
SELECT * | { [DISTINCT] columna | expresion [alias],...}
FROM  <lista tablas>
 [WHERE condicion/es];
```

*Ejemplo: recuperar el nro de voluntario, nombre y apellido de los voluntarios que trabajan en la
institución cuyo identificador es 60.*

```sql
SELECT nro_voluntario, nombre, apellido
FROM   voluntario
WHERE id_institucion= 60;
```

```
Resultado de la consulta
nro_voluntario | nombre    | apellido
           103 | Alexander | Hunold
           104 | Bruce     | Ernst
           105 | David     | Austin
           106 | Valli     | Pataballa
           107 | Diana     | Lorentz
```

> [!note] `<>` y `!=` son sinónimos
> El slide los lista como dos operadores. **`<>` es el estándar SQL**; `!=` lo aceptan MySQL,
> PostgreSQL y Oracle por igual. Para el parcial, cualquiera de los dos.

## Slide 12 · Condiciones de comparación y lógica trivaluada

> *"Al utilizar los operadores de comparación el resultado puede ser: **Verdadero (T)** ·
> **Falso (F)** · **Desconocido (U)**"*

Y a continuación, con la frase *"si se comparan valores nulos"* **subrayada en rojo**:

> [!quote] Textual del slide
> *"Tener presente que si se comparan valores nulos usando los operadores de comparación el resultado
> será siempre **FALSO** porque un valor nulo no puede ser igual, mayor, distinto, etc. a otro valor."*

Los dos ejemplos que acompañan, uno al lado del otro:

```sql
SELECT nombre, apellido,               SELECT nombre, apellido,
        e-mail                                 e-mail
FROM  voluntario                       FROM  voluntario
WHERE id_tarea= 'ST_MAN';              WHERE id_tarea != 'ST_MAN';
```

> [!bug] El slide escribe `e-mail`, y la columna se llama `e_mail`
> En el esquema del slide 5 la columna es **`e_mail`** (guión bajo). Los slides 12 y 13 la escriben
> **`e-mail`** con guión medio: eso **no compila** — el parser lo lee como la resta `e - mail`, y
> falla con "columna `e` inexistente". Los slides 14, 15 y 16 la escriben bien. Copiar los ejemplos
> de los slides 12 y 13 tal cual **da error**; hay que reescribir `e_mail`.

> [!bug] El slide se contradice a sí mismo, y esto entra en el parcial
> **Arriba dice que el resultado puede ser `U` (Desconocido); abajo dice que comparar contra nulo da
> "siempre FALSO". Las dos cosas no pueden ser ciertas.** Lo correcto es lo primero: comparar
> cualquier cosa contra `NULL` da **UNKNOWN**, que es un tercer valor lógico, no `FALSE`.
>
> **Por qué importa la diferencia (razonamiento propio, no está en el deck):** `WHERE` devuelve la
> fila **solo si la condición es `TRUE`** — descarta tanto `FALSE` como `UNKNOWN`, y por eso a simple
> vista "se comporta como falso". Pero se rompe apenas aparece la negación:
>
> | Expresión | Si `x IS NULL` | Con la regla del slide ("es FALSE") |
> | --- | --- | --- |
> | `x = 5` | `UNKNOWN` → fila descartada | `FALSE` → fila descartada ✓ |
> | `NOT (x = 5)` | `NOT UNKNOWN` = **`UNKNOWN`** → fila **descartada** | `NOT FALSE` = `TRUE` → fila devuelta ✗ |
> | `x != 5` | **`UNKNOWN`** → fila descartada | `TRUE` → fila devuelta ✗ |
>
> **La consecuencia práctica es la que muestran los dos ejemplos del slide:** las filas con
> `id_tarea IS NULL` **no aparecen en ninguna de las dos consultas**. `=` y `!=` no parten el
> universo en dos: dejan afuera a los nulos las dos veces. Ese es el error clásico del TP.
> **Verificar en clase** cuál de las dos formulaciones toma la cátedra en el parcial.

Tablas de verdad de la lógica trivaluada, **agregadas por mí, no están en el deck**:

| `AND` | T | F | U |     | `OR` | T | F | U |     | `NOT` | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **T** | T | F | U |     | **T** | T | T | T |     | **T** | F |
| **F** | F | F | F |     | **F** | T | F | U |     | **F** | T |
| **U** | U | F | U |     | **U** | T | U | U |     | **U** | **U** |

Las dos celdas que hay que memorizar: **`F AND U = F`** y **`T OR U = T`** — el nulo se "absorbe"
cuando el otro operando ya decide el resultado.

## Slide 13 · `[NOT] BETWEEN`

> *"Además de los operadores de comparación está disponible un operador especial `[NOT] BETWEEN`"*
> *"`BETWEEN` trata a los valores de los extremos **incluidos** dentro del rango."*

| Forma | Equivalencia textual del slide |
| --- | --- |
| `a BETWEEN x AND y` | `a >= x AND a <= y` |
| `a NOT BETWEEN x AND y` | `a < x OR a > y` |

*Ejemplo: seleccionar las voluntarios cuyo número se encuentra entre 100 y 120.*

```sql
SELECT nombre, apellido, e-mail
FROM   voluntario
WHERE  nro_voluntario BETWEEN 100 AND 120;
```

> [!warning] `BETWEEN` es inclusivo **y el orden de los extremos importa**
> El deck dice lo primero. Lo segundo **no lo dice**: `BETWEEN 120 AND 100` **no devuelve nada**,
> porque se traduce a `a >= 120 AND a <= 100`. Siempre el menor primero.
> **Razonamiento propio:** por la equivalencia del slide, `BETWEEN` hereda el comportamiento con
> nulos de `>=` y `<=` → si `a IS NULL`, da `UNKNOWN`.

## Slide 14 · `[NOT] LIKE`

> *"No siempre se conoce el valor exacto a buscar. Se puede buscar coincidencias con un patrón de
> caracteres mediante el operador `LIKE`. También se emplea en la forma negativa `NOT LIKE`."*

**Comodines**, textual del slide:

| Comodín | Significado |
| --- | --- |
| `%` | *"cualquier secuencia de **cero o más** caracteres"* |
| `_` | *"denota **un solo** carácter"* |

*Ejemplo: seleccionar los voluntarios cuya segunda letra del nombre sea `a` y luego tenga una `n` como
carácter final.*

```sql
SELECT nombre, apellido, e_mail
FROM   voluntario
WHERE  nombre LIKE '_a%n';
```

Lectura del patrón `_a%n`: **1 carácter cualquiera + `a` + cualquier cosa (o nada) + `n` al final.**
Salida del slide:

```
nombre | apellido   | e_mail   | telefono            | fecha_nacimiento | id_tarea | nro_voluntario | horas_aportadas
Karen  | Colmenares | KCOLMENA | 515.127.4566        | 1999-08-10       | PU_CLERK |            119 |         2500.00
Jason  | Mallin     | JMALLIN  | 650.127.1934        | 1996-06-14       | ST_CLERK |            133 |         3300.00
Karen  | Partners   | KPARTNER | 011.44.1344.467268  | 1997-01-05       | SA_MAN   |            146 |        13500.00
…
```

`K-a-r-e-n` ✓ · `J-a-s-o-n` ✓ — segunda letra `a`, última letra `n`.

> [!bug] Dos defectos del slide
> 1. **El screenshot no corresponde a la consulta.** La consulta proyecta tres columnas
>    (`nombre, apellido, e_mail`) y el resultado muestra ocho. El screenshot es de un `SELECT *`.
>    Pasa igual en el slide 15.
> 2. **Las comillas del patrón son tipográficas** (`'_a%n'` con comillas curvas en el PDF).
>    Copiadas y pegadas **no compilan**: hay que reescribirlas como comillas simples rectas.

> [!tip] Trampas de `LIKE` que el deck no menciona
> - **`_a%n` no encuentra `Ana`**: `_` exige exactamente un carácter antes de la `a`, y `Ana` empieza
>   con `A` mayúscula seguida de `n`. `%` sí matchea vacío, `_` no.
> - **Sensibilidad a mayúsculas: depende del motor.** En **MySQL con la collation por defecto
>   (`utf8mb4_..._ci`, *case-insensitive*), `LIKE 'a%'` matchea también `Ana`**; en **PostgreSQL
>   `LIKE` es sensible** y hay que usar `ILIKE`. El deck no lo aclara: en el TP 3 sobre MySQL, contar
>   con la insensibilidad **solo si se verificó la collation**.
> - Para buscar un `%` o un `_` **literales** hace falta `ESCAPE`. Fuera del deck.

## Slides 15–16 · `IS [NOT] NULL`

**Slide 15 — qué es un `NULL`:**

> - *"Si una columna en particular carece de un valor se dice que contiene un `NULL`."*
> - *"`NULL` es un valor **inaccesible, sin valor, desconocido o inaplicable**."*
> - *"**No representa ni un cero ni un espacio en blanco** (el cero es un número y el espacio en blanco
>   es un caracter). SOLO testean valores que son nulos."*

*Ejemplo: listar los voluntarios que no tengan coordinador.*

```sql
SELECT nombre, apellido, e_mail
FROM   voluntario
WHERE  id_coordinador IS NULL;
```

```
nombre | apellido | e_mail | telefono     | fecha_nacimiento | id_tarea | nro_voluntario | horas_aportadas | porcentaje
Steven | King     | SKING  | 515.123.4567 | 1987-06-17       | AD_PRES  |            100 |        24000.00 | NULL
```

Una sola fila: el voluntario 100 es el único sin coordinador — la raíz de la jerarquía recursiva.

**Slide 16 — cómo incluir los nulos a propósito:**

> *"Si se comparan valores nulos usando los otros operadores (`=`, `>`, etc.) el resultado será siempre
> FALSO […]. Si se desea incluir en el resultado los datos de aquellas columnas que tengan nulos hay
> que hacerlo **explícitamente**."*

*Ejemplo listar los datos de los voluntarios sea menor o igual que 0,10.*
> ✓ *"Algunos porcentajes pueden ser nulos"* · ✓ *"Si deseo incluirlos en el resultado debo explicitar
> `IS NULL`."*

```sql
SELECT * FROM voluntario
WHERE  porcentaje<=0.1
   OR  porcentaje IS NULL;
```

> [!warning] La frase del ejemplo está incompleta en el slide
> Dice *"listar los datos de los voluntarios **sea menor o igual que 0,10**"* — falta *"cuyo
> porcentaje"*. Y escribe el umbral como **`0,10`** en el texto pero **`0.1`** en la consulta: en SQL
> el separador decimal es siempre el **punto**, la coma separa argumentos.

> [!important] Este es el operador que hay que memorizar
> **`IS NULL` / `IS NOT NULL` son la única forma de testear un nulo.** `= NULL` y `!= NULL` **no
> fallan** — compilan y devuelven `UNKNOWN` para todas las filas, o sea **cero resultados sin ningún
> mensaje de error**. Es el bug más silencioso del TP.

## Slides 17–19 · Condiciones compuestas y el problema de los paréntesis

**Slide 17 — los tres operadores lógicos:**

> *"Un operador lógico combina los resultados de dos condiciones para producir un único resultado
> basado en ellos, o invertir el resultado de una condición."*

> *"Los operadores `AND` y `OR` se pueden usar para componer expresiones lógicas."*

| Operador | Definición textual del slide |
| --- | --- |
| **`AND`** | *"retorna VERDADERO si **ambas** condiciones evaluadas son VERDADERAS"* |
| **`OR`** | *"retorna VERDADERO si **alguna** de las condiciones es VERDADERA"* |
| **`NOT`** | *"invierte el resultado de la expresión"* |

**Slide 18 — la consulta correcta.** *Ejemplo: seleccionar los voluntarios que son coordinados por los
voluntarios nro 100 o 124 y están trabajando para la institución cuyo código es 50.*

```sql
SELECT nro_voluntario, apellido,
        id_institucion, id_coordinador
FROM voluntario
WHERE (id_coordinador=100
  OR id_coordinador=124)
  AND id_institucion=50;
```

> **Importante:** — Indentar las cláusulas — Uso de paréntesis en las condiciones

```
nro_voluntario | apellido | id_institucion | id_coordinador
           120 | Weiss    |             50 |            100
           121 | Fripp    |             50 |            100
           122 | Kaufling |             50 |            100
           123 | Vollman  |             50 |            100
           124 | Mourgos  |             50 |            100
           141 | Rajs     |             50 |            124
           142 | Davies   |             50 |            124
           143 | Matos    |             50 |            124
           144 | Vargas   |             50 |            124
           196 | Walsh    |             50 |            124
           197 | Feeney   |             50 |            124
           198 | OConnell |             50 |            124
           199 | Grant    |             50 |            124
```

Cierra con la pregunta **en rojo**: *"Qué sucede si se eliminan ()?"*

**Slide 19 — la respuesta: `…al eliminar ()`.** El slide **no reescribe la consulta**: muestra
directamente el resultado. La condición sin paréntesis sería (**reconstrucción propia**, no está
impresa en el slide):

```sql
WHERE id_coordinador=100 OR id_coordinador=124 AND id_institucion=50
```

y aparecen filas de más, **marcadas con óvalos rojos** en el slide:

```
nro_voluntario | apellido  | id_institucion | id_coordinador
           101 | Kochhar   |             90 |            100   ← ⬅ de más
           102 | De Haan   |             90 |            100   ← ⬅ de más
           114 | Raphaely  |             30 |            100   ← ⬅ de más
           120 | Weiss     |             50 |            100
           121 | Fripp     |             50 |            100
           122 | Kaufling  |             50 |            100
           123 | Vollman   |             50 |            100
           124 | Mourgos   |             50 |            100
           141 | Rajs      |             50 |            124
           142 | Davies    |             50 |            124
           143 | Matos     |             50 |            124
           144 | Vargas    |             50 |            124
           145 | Russell   |             80 |            100   ← ⬅ de más
           146 | Partners  |             80 |            100   ← ⬅ de más
           147 | Errazuriz |             80 |            100   ← ⬅ de más
           148 | Cambrault |             80 |            100   ← ⬅ de más
           149 | Zlotkey   |             80 |            100   ← ⬅ de más
           196 | Walsh     |             50 |            124
           197 | Feeney    |             50 |            124
           198 | OConnell  |             50 |            124
           199 | Grant     |             50 |            124
           201 | Hartstein |             20 |            100   ← ⬅ de más
```

> [!quote] Textual del slide
> *"Estas filas no corresponden a la institución cuyo identificador es 50!! **No es válida la consulta
> sin los paréntesis en la condición!!!**"*

> [!warning] El tercer óvalo del slide encierra una fila de más de la cuenta
> Los óvalos rojos son tres: `101-102-114`, `145-146-147-148-149` y el último, que abarca
> **`199 Grant` y `201 Hartstein`**. Pero `199 Grant` **sí corresponde** (institución 50,
> coordinador 124) y aparece también en el resultado correcto del slide 18. La fila sobrante es
> **solo la 201**. Son 9 filas de más, no 10.

> [!warning] "No es válida" es impreciso — la consulta **es válida**, está **mal**
> **Razonamiento propio, no está en el deck:** sin paréntesis, SQL aplica la **precedencia de
> operadores** —`NOT` > `AND` > `OR`— y la condición se agrupa así:
>
> ```sql
> WHERE id_coordinador = 100
>    OR (id_coordinador = 124 AND id_institucion = 50)
> ```
>
> O sea: **todos** los coordinados por el 100 sea cual sea su institución, **más** los coordinados por
> el 124 que además estén en la 50. Por eso las **9** filas de más —101, 102, 114, 145, 146, 147,
> 148, 149 y 201— son todas de `id_coordinador = 100` con `id_institucion` ≠ 50.
> **El motor no da error**: ejecuta perfecto y devuelve el conjunto equivocado.
> Regla de oro: **si en un `WHERE` conviven `AND` y `OR`, poner paréntesis siempre**, aunque sean
> redundantes.

## Slide 20 · `ORDER BY`

> - *"El orden de las filas listadas en una consulta es **indefinido**, se puede utilizar la cláusula
>   `ORDER BY` para ordenar las filas, y **se debe colocar como última cláusula del `SELECT`**."*
> - *"Por defecto si no se especifica el orden es ascendente (`ASC`), pero se puede especificar también
>   `DESC` **luego del nombre de la columna**, para especificar un orden descendente."*
> - *"Se puede ordenar el resultado de una consulta por **más de una columna** (pueden ser todas las de
>   la tabla)."*

*Ejemplo: listar los apellidos ordenados descendentemente y nombres de los voluntarios que son
coordinados por el voluntario 124.*

```sql
SELECT apellido, nombre
 FROM voluntario
WHERE  id_coordinador=124
ORDER BY apellido DESC, nombre;
```

```
apellido | nombre
Walsh    | Alana
Vargas   | Peter
Rajs     | Trenna
OConnell | Donald
Matos    | Randall
Grant    | Douglas
Feeney   | Kevin
Davies   | Curtis
```

> [!important] `ASC`/`DESC` se aplican **por columna**, no a todo el `ORDER BY`
> En `ORDER BY apellido DESC, nombre` el `DESC` afecta **solo a `apellido`**; `nombre` queda en `ASC`
> por defecto. Para descendente en las dos hay que escribir `ORDER BY apellido DESC, nombre DESC`.
> Es el error más común de la cláusula.

> [!note] "El orden es indefinido" es literal, no una advertencia retórica
> Sin `ORDER BY`, el motor puede devolver las filas en cualquier orden y **cambiarlo entre dos
> ejecuciones de la misma consulta** si cambia el plan o los índices. Si el enunciado del TP dice
> "listar ordenado por…", falta `ORDER BY` aunque el resultado *parezca* ordenado.

> [!bug] "última cláusula del SELECT" choca con el slide siguiente
> El slide 20 dice que `ORDER BY` va **última**; el 21 muestra `LIMIT` y `OFFSET` **después** de
> `ORDER BY`. Lo correcto es que `ORDER BY` es la última de las cláusulas *lógicas* de la consulta
> (`SELECT`/`FROM`/`WHERE`/`GROUP BY`/`HAVING`/`ORDER BY`), y `LIMIT`/`OFFSET` van detrás de todas.

## Slides 21–22 · `LIMIT` y `OFFSET` — **el slide dice PostgreSQL**

> [!warning] El título del slide es literalmente `LIMIT and OFFSET (PostgreSQL)`
> Es la primera vez en toda la Clase 05 que el deck **declara el motor**. La cursada corre sobre
> **MySQL** → equivalencias abajo y en [[#PostgreSQL/Oracle → MySQL]].

> *"Permiten recuperar solamente un subconjunto de filas del total de la consulta."*

```sql
SELECT lista de atributos
 FROM tabla/s
 [ORDER BY ... ]
 [LIMIT {numero | ALL}]
 [OFFSET numero];
```

- *"**Debe ser usado siempre con la cláusula `ORDER BY`**."*
- *"La cláusula `LIMIT` limita la cantidad de filas a retornar."*
- *"La cláusula `OFFSET` determina a partir de que fila del resultado se retorna."*

*Ejemplo: seleccionar los datos de los voluntarios que corresponden a los 10 primeros voluntarios.*

```sql
SELECT apellido, nombre
FROM   voluntario
ORDER BY nro_voluntario
LIMIT 10;
```

*Ejemplo: seleccionar los datos de los voluntarios a partir del 15TO voluntario.*

```sql
SELECT apellido, nombre
FROM   voluntario
ORDER BY nro_voluntario
LIMIT ALL
OFFSET 15;
```

> [!tip] Por qué "siempre con `ORDER BY`"
> **Razonamiento propio:** sin `ORDER BY` el orden es indefinido (slide 20), así que *"los 10
> primeros"* no significa nada — el motor puede devolver diez filas cualesquiera, y **distintas en
> cada corrida**. `LIMIT` sin `ORDER BY` es un resultado no determinístico.

> [!warning] `LIMIT ALL` **no existe en MySQL**
> `LIMIT ALL` es sintaxis de PostgreSQL y significa "sin tope". **En MySQL:**
> - `LIMIT 10` → **igual en los dos motores**.
> - `LIMIT n OFFSET m` → **igual en los dos**. MySQL además acepta la forma corta `LIMIT m, n`
>   (ojo: ahí el **primer** número es el offset).
> - `LIMIT ALL OFFSET 15` → **no compila en MySQL**. MySQL exige un `LIMIT` numérico cuando hay
>   `OFFSET`; la documentación de MySQL recomienda poner un número enorme
>   (`LIMIT 18446744073709551615 OFFSET 15`) para "desde la fila 15 hasta el final".
>
> `OFFSET 15` **salta 15 filas y empieza por la 16ª**: el enunciado *"a partir del 15TO voluntario"*
> es ambiguo respecto de si el 15º entra o no. **Verificar en clase.**

---

# Funciones de agregación

## Slides 23–24 · Qué son

Título del slide 23: **"¿Qué son Funciones de Grupo o Agregación?"**

> *"Estas funciones operan sobre **conjuntos de filas** para proporcionar **un resultado por grupo**."*

El slide 23 lo dibuja: una tabla de muchas filas de `voluntario` colapsando, por un embudo rotulado
*"Cantidad de horas aportadas por todos los voluntarios"*, en una sola celda:

```
total_de_horas_aportadas
               691400.00
```

> [!note] La tabla de origen del embudo usa `coordinador`, no `id_coordinador`
> Los screenshots de los slides 23, 30 y 33 muestran una tabla con las columnas
> `nro_voluntario | apellido | id_institucion | coordinador`. En el esquema del slide 5 la columna
> se llama **`id_coordinador`**, y así la usan todas las consultas del deck. Es un renombre del
> screenshot, no una columna distinta.

**Slide 24 — el catálogo completo.** Encabeza con *"Permiten resumir el resultado de una consulta:"* y
después el catálogo, textual:

| Función | Definición del slide |
| --- | --- |
| **`SUM( )`** | sumatoria de la columna especificada |
| **`AVG( )`** | promedio de la columna especificada |
| **`STDDEV( )`** | desvío estándar de la columna especificada |
| **`MAX( )`** | valor máximo de la columna especificada |
| **`MIN ( )`** | valor mínimo de la columna especificada |
| **`COUNT ( )`** | cantidad de tuplas |

```sql
SELECT   [columna, ...] funcion de grupo(columna), ...
FROM tabla/s
[WHERE condicion/es]
```

## Slide 25 · Cuáles aceptan qué tipo de dato

> **`AVG`, `SUM` y `STDDEV` se usan para datos numéricos.**

```sql
SELECT SUM(horas_aportadas),
       AVG(horas_aportadas),
       MAX(horas_aportadas),
       MIN(horas_aportadas)
FROM   voluntario;
```

> **`MIN` y `MAX` se pueden usar para cualquier tipo de dato.**

*Ejemplo: seleccionar el voluntario mas joven y el mas viejo.*

```sql
SELECT MAX(fecha_nacimiento) AS voluntario_mas_joven,
       MIN(fecha_nacimiento) AS voluntario_mas_viejo
FROM   voluntario;
```

> [!tip] Por qué `MAX` es el **más joven**
> Porque la **fecha de nacimiento más grande es la más reciente**, y nacer más tarde = ser más joven.
> Es una inversión que se pregunta seguido. Y esta consulta **no devuelve al voluntario**: devuelve
> **dos fechas**. Para saber *quién* es hace falta subconsulta o `ORDER BY … LIMIT 1` — nada de eso
> está en la parte 1.

## Slide 26 · `COUNT(*)` vs. `COUNT(expr)`

| Forma | Definición textual del slide |
| --- | --- |
| **`COUNT(*)`** | *"devuelve el **número de filas** de una tabla"* |
| **`COUNT(expr)`** | *"devuelve el número de filas con **valores no nulos** para `expr`"* |

```sql
SELECT COUNT(*)
FROM   voluntario;
```

*Ejemplo: liste el número de ciudades en la tabla dirección, excluyendo los valores nulos.*

```sql
SELECT COUNT(ciudad) AS cantidad__de_ciudades
FROM   direccion;
```

> [!note] El alias del slide tiene **doble guión bajo**: `cantidad__de_ciudades`
> Transcrito tal cual. Es un tipeo del deck, no una convención.

> [!important] La distinción `COUNT(*)` / `COUNT(col)` es la pregunta de parcial de este tema
> `COUNT(*)` cuenta **filas** (una fila enteramente `NULL` igual cuenta). `COUNT(col)` cuenta
> **valores no nulos de esa columna**. Si `col` no admite nulos los dos dan lo mismo; si admite,
> **`COUNT(col) ≤ COUNT(*)` siempre**, y la diferencia es exactamente la cantidad de nulos.
> El deck **no menciona `COUNT(DISTINCT col)`**, que es la tercera forma.

## Slide 27 · Funciones de grupo y valores nulos → `COALESCE`

> *"Las funciones de grupo **ignoran** los valores nulos del atributo."*

```sql
SELECT AVG(porcentaje) AS Porcentaje_promedio
FROM   voluntario;
```

```
porcentaje_promedio
0.22285714285714285714
```

> *"La función **`COALESCE(columna, valor_reemplazo)`** en fuerzan a las funciones de grupo a que
> incluyan valores nulos, retornando un valor en ocurrencia de un nulo."* ← *sic*, la frase del slide
> está mal redactada ("en fuerzan").

```sql
SELECT AVG(COALESCE(porcentaje, 0)) AS Porcentaje_promedio
FROM   voluntario;
```

```
porcentaje_promedio
0.07289719626168224299
```

> [!important] Los dos números explican todo el tema
> **Razonamiento propio, no está en el deck.** `AVG` = suma ÷ **cantidad de valores no nulos**.
> De los dos resultados se deduce el dato oculto: la suma de `porcentaje` es **7,8** y hay
> **35 voluntarios con porcentaje no nulo** (7,8 / 35 = 0,222857…). El `COUNT(*)` de la tabla es
> **107** (slide 28), y 7,8 / 107 = 0,072897… — exactamente el segundo resultado.
>
> Es decir: **`COALESCE` no cambia el numerador, cambia el denominador.** Convierte 72 nulos en 72
> ceros, que sí entran en la cuenta. **Cuál de los dos promedios es "el correcto" es una decisión
> semántica**, no técnica: ¿"promedio de los que tienen porcentaje" o "promedio sobre todos"?

## Slide 28 · Alias de columna y alias de tabla

Tres ejemplos con sus resultados, y dos rótulos: **"Alias de columna"** y **"Alias de tabla"**.

```sql
SELECT COUNT(*) AS cantidad_de_voluntarios
FROM   voluntario;
```
```
cantidad_de_voluntarios
                    107
```

```sql
SELECT SUM(horas_aportadas) AS Horas_trabajadas
FROM voluntario v
WHERE v.id_coordinador=120;
```
```
horas_trabajadas
        22100.00
```

```sql
SELECT MAX(horas_aportadas) maximo,
       MIN(horas_aportadas) minimo,
       MAX(horas_aportadas) -
       MIN(horas_aportadas) diferencia
FROM voluntario v
WHERE v.id_coordinador=120;
```
```
maximo  | minimo  | diferencia
3200.00 | 2200.00 |    1000.00
```

| Tipo de alias | Dónde va | En los ejemplos |
| --- | --- | --- |
| **de columna** | después de la expresión del `SELECT`, con `AS` **o sin `AS`** | `AS cantidad_de_voluntarios` · `maximo` (sin `AS`) |
| **de tabla** | después del nombre de tabla en el `FROM` | `FROM voluntario v` → habilita `v.id_coordinador` |

> [!tip] Tres cosas que muestran estos ejemplos y el deck no dice
> 1. **`AS` es opcional** para el alias de columna: `MAX(...) maximo` y `MAX(...) AS maximo` son lo
>    mismo. Para el alias de tabla **nunca** se usa `AS` en la práctica.
> 2. **Se puede operar entre agregados**: `MAX(x) - MIN(x)` es una expresión válida en el `SELECT`.
> 3. **El alias de columna se muestra en minúsculas** en la salida (`Horas_trabajadas` →
>    `horas_trabajadas`): es el *case folding* de PostgreSQL para identificadores sin comillas.
>    En MySQL el alias conserva las mayúsculas que se escribieron.

## Slides 29–32 · `GROUP BY`

> - *"Si se usa la cláusula `GROUP BY` en una sentencia `SELECT`, se **dividen las filas de la tabla
>   consultada en grupos**."*
> - *"Se aplica las funciones en la lista `SELECT` a cada grupo de filas y retorna **una única fila por
>   cada grupo**."*
> - *"La clausula `GROUP BY` especifica **como se deben agrupar** las filas seleccionadas."* (en rojo)

```sql
SELECT  lista columnas, función de grupo (columna)
FROM  <lista tablas>
[ WHERE  condición ]
[GROUP BY expresión de grupo | lista columnas
[ ORDER BY  <lista atributos orden> ];
```

> [!bug] El diagrama de sintaxis del slide 29 está roto
> Le **falta el `]` de cierre** del `GROUP BY`, y sobre todo **omite `HAVING`**, que el propio deck
> introduce cuatro slides después. La forma completa está en la
> [[#Tabla resumen de sintaxis — Parte 1]].

**Slide 30 — el ejemplo canónico.** Pregunta en rojo: **¿Cuántos voluntarios tiene cada Institución?**

```sql
SELECT id_institucion, COUNT(*) AS cantidad_voluntarios
FROM   voluntario
GROUP BY id_institucion;
```

```
id_institucion | cantidad_voluntarios
            90 |                    3
          NULL |                    1
            20 |                    2
           100 |                    6
            40 |                    1
           110 |                    2
            80 |                   34
            70 |                    1
            50 |                   45
            60 |                    5
            30 |                    6
            10 |                    1
```

> [!important] Dos lecturas obligatorias de ese resultado
> 1. **`NULL` forma su propio grupo.** Hay un voluntario sin institución y aparece con su propia fila.
>    Contrasta con el slide 27: *las funciones de agregación ignoran los nulos de la columna agregada,
>    pero `GROUP BY` agrupa los nulos de la columna agrupada*. Son dos reglas distintas.
> 2. **Los grupos no salen ordenados** (`90, NULL, 20, 100, 40, …`). Hace falta `ORDER BY`.
>
> Suman **107**, que es el `COUNT(*)` de la tabla entera del slide 28: `GROUP BY` **particiona**, no
> descarta.

**Slide 31 — la regla, en rojo y centrada:**

> [!quote] Textual
> ***"Todas las columnas de la lista `SELECT`, excepto las funciones de grupo, deben estar en la
> cláusula `GROUP BY`."***

*Ejemplo: liste las diferentes instituciones y el máximo de horas aportadas a cada una de ellas.*

```sql
SELECT id_institucion, MAX(horas_aportadas)
FROM   voluntario
GROUP BY id_institucion;
```

**Slide 32 — la recíproca no vale:**

> *"Las columnas en la clausula `GROUP BY` **pueden no estar** en la lista del `SELECT`."*

*Ejemplo: determine los porcentajes promedio de los voluntarios por institución.*

```sql
SELECT AVG(porcentaje)
FROM   voluntario
GROUP BY id_institucion;
```

> [!warning] La regla es **de ida, no de vuelta** — y en MySQL tiene historia
> - **`SELECT` → `GROUP BY`: obligatorio.** Toda columna no agregada del `SELECT` va en el `GROUP BY`.
> - **`GROUP BY` → `SELECT`: opcional.** Podés agrupar por algo que no mostrás (slide 32).
>
> El ejemplo del slide 32 es **inútil en la práctica**: devuelve una columna de promedios **sin decir
> a qué institución corresponde cada uno**. Correcto sintácticamente, ilegible como resultado.
>
> **Sobre MySQL:** históricamente MySQL **permitía violar la regla** y devolvía un valor arbitrario de
> la columna suelta. **Desde MySQL 5.7 el modo `ONLY_FULL_GROUP_BY` está activo por defecto** y esas
> consultas dan error, igual que en PostgreSQL. O sea: la regla del slide 31 **se aplica tal cual en
> la cursada**. Si alguien encuentra una instalación vieja donde no falla, es esa opción desactivada.

## Slides 33–34 · `HAVING`

> *"Se puede anexar la cláusula `HAVING` para restringir grupos"*
> 1. *Las filas se agrupan por la/s columnas especificada/s*
> 2. *Se aplica la función de grupo*
> 3. *Se muestran los grupos que satisfacen la cláusula `HAVING`*

**Ese "1-2-3" es el orden de evaluación** y es lo que hay que memorizar.

Pregunta del slide, en rojo: **Coordinadores con más de 7 voluntarios**

```sql
SELECT id_coordinador, COUNT(*) AS cantidad_de_voluntarios
FROM   voluntario
GROUP BY id_coordinador
HAVING COUNT(*) > 7;
```

```
Resultado de la consulta
id_coordinador | cantidad_voluntarios
           122 |                    8
           120 |                    8
           100 |                   14
           124 |                    8
           121 |                    8
           123 |                    8
```

> [!bug] El alias de la consulta y el encabezado del resultado no coinciden
> La consulta del slide dice `AS cantidad_de_voluntarios`, pero el screenshot del resultado titula la
> columna **`cantidad_voluntarios`** (sin el `de_`). El screenshot es de otra corrida —
> la del slide 30, que sí usa `cantidad_voluntarios`. Los números del resultado son válidos igual.

## Slide 35 · Funciones de grupo **no válidas**

> - *"**No se puede utilizar la cláusula `WHERE` para restringir grupos.**"*
> - *"Se debe utilizar la cláusula `HAVING` para restingir grupos. **No se pueden utilizar funciones de
>   grupo en la cláusula `WHERE`.**"* *(sic: "restingir")*

El slide muestra la consulta **tachada con una cruz roja** y rotulada **"Sentencia NO VALIDA"**:

```sql
SELECT   id_coordinador, COUNT(*)
    AS cantidad_de_voluntarios
FROM voluntario
 WHERE COUNT(*) >7
 GROUP BY id_coordinador;
```

Y el error real del motor, en un recuadro rosa:

```
Error de SQL:
ERROR:  aggregates not allowed in WHERE clause at character 105

En la declaración:
SELECT id_coordinador, count(*) as Cantidad_voluntarios
 FROM  unc_esq_voluntario.voluntario  where  count(*) >7
group by id_coordinador
;
```

> [!warning] Ese mensaje de error es de **PostgreSQL**
> `ERROR: aggregates not allowed in WHERE clause at character NNN` es el formato de PostgreSQL.
> En **MySQL** la misma consulta falla con `ERROR 1111 (HY000): Invalid use of group function`.
> El texto cambia; **la regla es la misma en los dos motores**.
> El nombre de esquema `unc_esq_voluntario` delata además que el deck viene de otra universidad.

> [!important] `WHERE` vs. `HAVING` — la comparación que el deck nunca hace explícita
> **Razonamiento propio, no está en el deck:**
>
> | | `WHERE` | `HAVING` |
> | --- | --- | --- |
> | **Filtra** | **filas**, antes de agrupar | **grupos**, después de agrupar |
> | **Momento** | paso 0, sobre la tabla cruda | paso 3, sobre el resultado del `GROUP BY` |
> | **¿Acepta agregados?** | **No** — error del motor | **Sí**, es su razón de ser |
> | **¿Necesita `GROUP BY`?** | No | En la práctica sí *(sin él, toda la tabla es un solo grupo)* |
> | Ejemplo | `WHERE id_institucion = 50` | `HAVING COUNT(*) > 7` |
>
> La razón por la que `WHERE COUNT(*) > 7` es imposible: **cuando `WHERE` se evalúa, los grupos
> todavía no existen**, así que no hay `COUNT(*)` que calcular. No es una prohibición arbitraria, es
> una consecuencia del orden de evaluación.
>
> Las dos se pueden usar **juntas** y hacen cosas distintas:
> `… WHERE id_institucion = 50 GROUP BY id_coordinador HAVING COUNT(*) > 7` =
> *"contando solo a los de la institución 50, qué coordinadores tienen más de 7"*.

## Slide 36 · Para Recordar!!!

Cierre textual del deck:

> - La sentencia SQL empleada para la recuperación de los datos a partir de las tablas cargadas en la
>   base de datos es el **`SELECT`**.
> - **`SELECT`** identifica las columnas a recuperar – **EL QUE**
> - **`FROM`** identifica la/s tabla/s – **DE DONDE** obtener los datos.
> - **`WHERE`** se usa para realizar las restricciones sobre los datos
> - Para eliminar los valores repetidos se debe usar la cláusula **`DISTINCT`**.
> - Los operadores de comparación se utilizan en la cláusula `WHERE` para comparar expresiones. Usar
>   paréntesis y sangrías para mejorar la legibilidad.
> - **`ORDER BY`** puede usarse para ordenar las filas, y se debe colocar como última cláusula de la
>   sentencia `SELECT`
> - Las funciones de agregación operan sobre conjuntos de filas para proporcionar un resultado por
>   grupo.
> - `GROUP BY` especifica como se deben agrupar las filas seleccionadas. Todas las columnas de la lista
>   `SELECT`, excepto las funciones de grupo, deben estar en la clausula `GROUP BY`. **No** se pueden
>   utilizar funciones de grupo en la cláusula `WHERE`.

---

## Orden de evaluación de las cláusulas

> [!note] Razonamiento propio, no está en el deck
> El deck presenta las cláusulas en el orden en que se **escriben**. El orden en que se **evalúan** es
> otro, y es lo que explica las tres reglas raras de la clase.

```
FROM  →  WHERE  →  GROUP BY  →  HAVING  →  SELECT  →  DISTINCT  →  ORDER BY  →  LIMIT/OFFSET
```

| Consecuencia | Por qué |
| --- | --- |
| `WHERE COUNT(*) > 7` **falla** | `WHERE` corre **antes** que `GROUP BY`: los grupos no existen todavía |
| `HAVING COUNT(*) > 7` **anda** | `HAVING` corre **después** del agrupamiento |
| Se puede hacer `ORDER BY` por un **alias** del `SELECT` | `ORDER BY` corre **después** de `SELECT` |
| **No** se puede usar un alias del `SELECT` en el `WHERE` | `WHERE` corre **antes** de que el alias exista |
| `LIMIT` sin `ORDER BY` es no determinístico | `LIMIT` corta lo último, sobre un orden indefinido |

**Verificar en clase**, sobre todo la del alias en el `ORDER BY`: MySQL y PostgreSQL la permiten, pero
el deck nunca la muestra.

## Tabla resumen de sintaxis — Parte 1

Forma completa del `SELECT` con todo lo del deck, **en el orden en que se escribe**:

```sql
SELECT   [DISTINCT] { * | columna | expresion [AS] [alias] , ... }
FROM     <lista tablas> [alias_tabla]
[WHERE   condicion/es]                  -- filtra FILAS, sin agregados
[GROUP BY lista columnas]               -- particiona en grupos
[HAVING  condicion sobre agregados]     -- filtra GRUPOS
[ORDER BY columna [ASC|DESC], ...]      -- última cláusula lógica
[LIMIT   {numero | ALL}]                -- PostgreSQL; en MySQL sin ALL
[OFFSET  numero];
```

| Elemento | Sintaxis exacta | Qué hace | Slide |
| --- | --- | --- | --- |
| Proyección total | `SELECT *` | todas las columnas, en orden físico | 6 |
| Proyección | `SELECT c1, c2` | solo esas, en ese orden | 7 |
| Deduplicar | `SELECT DISTINCT c1, c2` | sobre **la lista entera**; `NULL` cuenta como un valor | 8–9 |
| Alias de columna | `expr AS alias` · `expr alias` | renombra la columna del resultado | 28 |
| Alias de tabla | `FROM tabla v` | habilita `v.columna` | 28 |
| Filtro de filas | `WHERE cond` | `<`, `>`, `=`, `<=`, `>=`, `<>`, `!=` | 10–12 |
| Rango inclusivo | `a BETWEEN x AND y` | `a >= x AND a <= y` | 13 |
| Fuera de rango | `a NOT BETWEEN x AND y` | `a < x OR a > y` | 13 |
| Patrón de texto | `col LIKE '_a%n'` | `%` = 0+ caracteres · `_` = exactamente 1 | 14 |
| Patrón negado | `col NOT LIKE 'patrón'` | complemento | 14 |
| Test de nulo | `col IS NULL` · `col IS NOT NULL` | **la única forma**; `= NULL` no sirve | 15–16 |
| Conjunción | `c1 AND c2` | `T` solo si ambas `T` | 17 |
| Disyunción | `c1 OR c2` | `T` si alguna `T` | 17 |
| Negación | `NOT c` | invierte; `NOT UNKNOWN = UNKNOWN` | 17 |
| Precedencia | `NOT` > `AND` > `OR` | **poner paréntesis siempre** | 18–19 |
| Orden | `ORDER BY c1 DESC, c2` | `ASC` por defecto; `DESC` **por columna** | 20 |
| Paginado | `LIMIT n` · `OFFSET m` · `LIMIT ALL` | siempre con `ORDER BY` | 21–22 |
| Suma | `SUM(col)` | numérico; ignora nulos | 24–25 |
| Promedio | `AVG(col)` | numérico; **divide por los no nulos** | 24–25, 27 |
| Desvío | `STDDEV(col)` | numérico | 24 |
| Máximo / mínimo | `MAX(col)` · `MIN(col)` | **cualquier tipo**, incluidas fechas | 24–25 |
| Contar filas | `COUNT(*)` | todas las filas del grupo | 26 |
| Contar valores | `COUNT(col)` | solo los **no nulos** de `col` | 26 |
| Nulo → valor | `COALESCE(col, valor)` | mete los nulos en la cuenta del agregado | 27 |
| Agrupar | `GROUP BY c1, c2` | una fila por grupo; **`NULL` es un grupo** | 29–32 |
| Regla del `GROUP BY` | toda columna no agregada del `SELECT` va en el `GROUP BY` | | 31 |
| Filtro de grupos | `HAVING agregado op valor` | después de agrupar | 33–34 |
| **Prohibido** | `WHERE COUNT(*) > n` | error del motor | 35 |

## PostgreSQL/Oracle → MySQL

> [!important] El deck mezcla tres dialectos y la cursada corre uno solo
> Ver el punto abierto 2 de [[CLAUDE]] y la nota equivalente en
> [[Clase 04 - AlteraciónActualizaciónTablas]]: no es un problema de este deck solo.

| Del deck | Motor de origen | En **MySQL** | Certeza |
| --- | --- | --- | --- |
| `VARCHAR2(n)` | Oracle | `VARCHAR(n)` | segura |
| `NUMBER(p,s)` | Oracle | `DECIMAL(p,s)` (o `INT` si `s = 0`) | segura |
| `CHAR(2)`, `DATE` | Oracle | **iguales** | segura |
| `LIMIT n` | PostgreSQL | **igual** | segura |
| `LIMIT n OFFSET m` | PostgreSQL | **igual**; también `LIMIT m, n` (offset primero) | segura |
| `LIMIT ALL` | PostgreSQL | **no existe** → poner un tope enorme, `LIMIT 18446744073709551615 OFFSET m` | segura |
| `OFFSET m` solo, sin `LIMIT` | PostgreSQL | **no compila** en MySQL: `OFFSET` exige `LIMIT` | segura |
| `COALESCE(col, v)` | estándar | **igual** | segura |
| `<>` y `!=` | estándar / extensión | **los dos andan** | segura |
| `COUNT`, `SUM`, `AVG`, `MAX`, `MIN` | estándar | **iguales** | segura |
| `STDDEV(col)` | Oracle/PostgreSQL | existe en MySQL, **pero devuelve el desvío poblacional**, mientras que en PostgreSQL `STDDEV` es el **muestral** (`STDDEV_SAMP`) → **números distintos** | alta, **verificar** |
| `LIKE` sensible a mayúsculas | PostgreSQL: **sí** | MySQL: depende de la *collation*; con la default `..._ci` es **insensible** | alta, **verificar la collation del TP** |
| Alias en minúsculas en la salida | PostgreSQL (*case folding*) | MySQL **respeta** las mayúsculas del alias | alta |
| Regla `GROUP BY` del slide 31 | PostgreSQL: siempre | MySQL: **desde 5.7 igual**, por `ONLY_FULL_GROUP_BY` por defecto | alta |
| `ERROR: aggregates not allowed in WHERE clause` | PostgreSQL | MySQL: `ERROR 1111 (HY000): Invalid use of group function` | alta |

## Chuleta de trampas para el TP 3

Lo que este deck deja para el `esq_peliculas.sql` del [[Práctica 2026-08-04]], en orden de qué tan
seguido muerde:

1. **`= NULL` nunca da error y nunca devuelve nada.** Usar `IS NULL` / `IS NOT NULL`.
2. **`!=` deja afuera a los nulos.** `WHERE x != 'A'` **no** devuelve las filas con `x IS NULL`.
   Si las querés: `WHERE x != 'A' OR x IS NULL`.
3. **`AND` + `OR` en el mismo `WHERE` sin paréntesis** → resultado equivocado sin error (slide 19).
4. **`ORDER BY a DESC, b`** ordena `b` **ascendente**. `DESC` es por columna.
5. **`COUNT(*)` ≠ `COUNT(col)`** cuando `col` admite nulos.
6. **`AVG` ignora nulos** → si el enunciado dice "promedio sobre todos", va `AVG(COALESCE(col,0))`.
7. **`GROUP BY` crea un grupo `NULL`**, aunque los agregados ignoren nulos. Son reglas distintas.
8. **Toda columna no agregada del `SELECT` va en el `GROUP BY`** — MySQL lo exige.
9. **Filtro sobre un agregado → `HAVING`**, nunca `WHERE`.
10. **`BETWEEN` con el mayor primero devuelve vacío.**
11. **`DISTINCT` aplica a la lista entera**, no a una columna suelta.
12. **Sin `ORDER BY` no hay orden**, aunque el resultado parezca ordenado.
13. **Las comillas del PDF son tipográficas**: reescribir `'…'` a mano al copiar los ejemplos.
14. **Los slides 12 y 13 escriben `e-mail` en vez de `e_mail`**: copiados tal cual dan error de
    columna inexistente. Revisar los nombres de columna contra el esquema, no contra el slide.

## Dudas abiertas

- [ ] **¿Comparar contra `NULL` da `FALSE` o `UNKNOWN`?** El slide 12 afirma las dos cosas en la misma
      pantalla. La respuesta correcta es `UNKNOWN`, y cambia el resultado de `NOT` y de `!=`
      (ver el callout del slide 12). **¿Cuál toma la cátedra en el parcial?**
- [ ] **¿Por qué se recomienda evitar `SELECT *`?** El slide 6 lo pregunta en rojo y no lo responde.
      Hipótesis propia arriba; probablemente se cierre con [[Clase 08 - Explicando el plan]].
- [ ] **`LIMIT`/`OFFSET` en MySQL:** ¿el TP acepta `LIMIT m, n`, o exige la forma `LIMIT n OFFSET m`?
      Y *"a partir del 15TO voluntario"* — ¿el 15º entra o `OFFSET 15` lo saltea?
- [ ] **`STDDEV` en MySQL es poblacional y en PostgreSQL muestral.** Verificar antes de usarlo en un
      ejercicio numérico; el deck no dice cuál de los dos quiere.
- [ ] **¿`LIKE` en el TP 3 va a ser sensible a mayúsculas?** Depende de la collation de la instalación
      MySQL del TP 2. Verificar con `SHOW TABLE STATUS` o el `CREATE` de `esq_peliculas.sql`.
- [ ] **`COUNT(DISTINCT col)`** no aparece en el deck. ¿Se puede usar en el TP y en el parcial?
- [ ] **El deck no muestra `HAVING` junto con `ORDER BY`,** ni el diagrama de sintaxis completo
      (slide 29 omite `HAVING` y le falta un `]`). Confirmar el orden canónico de cláusulas.
- [ ] **¿`IN` y subconsultas entran en la parte 2 o en la 3?** La Clase 05 se anunció como
      "SQL, SQL avanzado, manejo de fechas" y la parte 1 **no toca fechas**.
- [ ] Los screenshots de los slides 14 y 15 **no corresponden a la consulta** que muestran (proyectan
      más columnas de las pedidas). ¿Hay una versión corregida del deck?

## Enlaces

- Clase anterior: [[Clase 04 - AlteraciónActualizaciónTablas]] · clase siguiente: [[Clase 06 - Vistas-Parte 1]]
- Resto de la Clase 05: [[Clase 05 - Consultas de Datos–Parte 2]] · [[Clase 05 - Consultas de Datos–Parte 3]]
- Práctica correspondiente y TP 3: [[Práctica 2026-08-04]]
- Conceptos que salen de acá: [[1.05.01 - SQL — consultas|Valores nulos y lógica trivaluada]] ·
  [[Funciones de agregación y agrupamiento]] · [[1.05.01 - SQL — consultas|Orden de evaluación de un SELECT]] ·
  [[SQL — DDL, DML y DQL]]
- Motor: [[MySQL]] · [[PostgreSQL]] — la traducción de dialectos está en
  [[#PostgreSQL/Oracle → MySQL]]
- Bibliografía: [[_index-bibliografia]] · calendario: [[_cronograma]] · catálogo: [[_index-clases]]
