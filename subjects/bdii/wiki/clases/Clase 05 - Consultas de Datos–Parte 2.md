---
tipo: teorica
clase: 5
unidad: 1
deck: "BD2_Clase 05 - Consultas de Datos–Parte 2.pdf"
tema: "SQL: joins, GROUP BY, HAVING, subconsultas — consultas multitabla, ensambles internos y
  externos, subconsultas (IN/EXISTS/ANY/ALL), subconsultas correlacionadas, nulos y lógica
  trivaluada"
resumen: "Ensambles internos y externos, subconsultas (IN, EXISTS, ANY, ALL, correlacionadas) y el NULL con su lógica trivaluada, con la regla central de que NOT IN y NOT EXISTS no son sinónimos porque un NULL en la lista vacía el NOT IN. El deck está en Oracle: FULL JOIN no existe en MySQL."
fecha: 2026-08-03
modalidad: virtual, lunes 19:00–22:00 — asincrónico
aliases:
  - BD2_Clase 05 Parte 2
  - Consultas de Datos Parte 2
  - Ensambles internos y externos
  - Outer join
  - IN vs EXISTS
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 2.pdf"
estado: procesado
---

# Clase 05 — Consultas de Datos (Parte 2)

## Resumen general

Segunda parte de la Clase 05: consultas sobre varias tablas y lo que el `NULL` les hace. Los slides 2–22 cubren los ensambles internos (`INNER JOIN`, equi-join, `NATURAL JOIN`) y externos (`LEFT`, `RIGHT`, `FULL`) y las subconsultas (`IN`, `EXISTS`, `ANY`, `ALL`, correlacionadas); los slides 23–36, la información faltante, los seis tipos de nulo, la lógica trivaluada y las dos alternativas al `NULL` (valores por defecto y partición de tablas). Es el SQL de los TPs y del parcial; la cursada corre sobre MySQL, pero el deck está escrito en Oracle. No cubre `GROUP BY`, `HAVING` ni las operaciones de conjunto.

Reglas clave. Una consulta multitabla lleva *tablas − 1* condiciones de ensamble; si falta una, sale un producto cartesiano. Una subconsulta que devuelve varias filas no admite `=` (error de ejecución): hay que usar `IN`, `ANY`, `ALL` o `EXISTS`. `IN` y `EXISTS` dan lo mismo, pero `NOT IN` y `NOT EXISTS` no: un solo `NULL` en la lista del `NOT IN` vacía el resultado, porque `x <> NULL` da `UNKNOWN`, el `AND` lo propaga y el `WHERE` solo deja pasar `TRUE`; ante la duda, `NOT EXISTS`. Los agregados ignoran los nulos, `COUNT(*)` no, y para `DISTINCT` un nulo es duplicado de otro. El outer join fabrica nulos; filtrar por `IS NULL` la clave del lado opuesto da el anti-join.

Trampas de motor: `FULL JOIN` no existe en MySQL (se emula con `LEFT JOIN … UNION … RIGHT JOIN`), los `LEFT`/`RIGHT JOIN` sin `ON` del slide 20 son error de sintaxis, y "null es el mayor" en `ORDER BY` es Oracle: MySQL ordena los nulos primero en `ASC`. Para el parcial: las tres tablas de verdad, la tabla del `NOT IN` con nulos, los siete patrones de Venn del slide 22 y el criterio del slide 36.

## Fuente, alcance y motor

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 2.pdf` · **36 slides** · dictado el
> **lunes 03/08**, de forma **asincrónica**. Es la **parte 2 de 3** de la Clase 05:
> [[Clase 05 - Consultas de Datos–Parte 1]] · [[Clase 05 - Consultas de Datos–Parte 3]].
> Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]].

> [!warning] Lo que el deck **no** cubre
> No explica `GROUP BY` ni `HAVING` (aparecen en la sintaxis del slide 2 y en un ejemplo del slide 10, sin
> definición), no da el orden de evaluación de las cláusulas ni compara `WHERE` con `HAVING`, no trata
> `UNION`, `INTERSECT` ni `EXCEPT`/`MINUS`, y no nombra `CROSS JOIN` ni el término *self-join* (hace uno
> en el slide 18). Si esos temas están en la Clase 05, tienen que estar en la parte 1 o en la parte 3.

> [!important] El deck está escrito para **Oracle**, no para MySQL
> El esquema del slide 4 usa `NUMBER(n)`, `VARCHAR2(n)` y `DATE`; el vocabulario *single-row /
> multiple-row operators* y el "error de ejecución" del slide 10 son de Oracle; y el `FULL JOIN` de los
> slides 19, 21, 22 y 31 **no existe en MySQL**. Tabla de traducción en
> [[#Motor: qué hay que traducir a MySQL]].

> [!note] El deck mezcla dos fuentes
> Los slides 19–22 y 17 son **capturas de imagen** de otro material (el 22 lleva la firma *"© C.L.
> Moffatt, 2008"*); el resto son slides nativos. Por eso el *outer join* aparece dos veces, en el
> slide 19 (imagen) y en el slide 31 (nativo), con el mismo contenido.

---

## El esquema de ejemplo (slide 4)

Casi todos los ejemplos corren sobre este esquema de **voluntariado**, que los slides asumen sin volver a
mostrarlo.

**`DIRECCION`**

| Columna | Tipo | Nulabilidad |
| --- | --- | --- |
| `id_direccion` | `NUMBER(4)` | `NOT NULL` |
| `calle` | `VARCHAR2(40)` | `NULL` |
| `codigo_postal` | `VARCHAR2(12)` | `NULL` |
| `ciudad` | `VARCHAR(30)` | `NOT NULL` |
| `provincia` | `VARCHAR(25)` | `NULL` |
| `id_pais` | `CHAR(2)` | `NOT NULL` |

> [!bug] `VARCHAR` vs. `VARCHAR2` en la misma tabla
> `calle` y `codigo_postal` son `VARCHAR2`, pero `ciudad: VARCHAR(30)` y `provincia: VARCHAR(25)` van
> **sin el `2`**, transcripto tal cual. En Oracle `VARCHAR` es un sinónimo deprecado de `VARCHAR2`, así
> que el esquema funciona; la inconsistencia es del diagrama y es el único lugar del deck con `VARCHAR`
> a secas.

**`INSTITUCION`**

| Columna | Tipo | Nulabilidad |
| --- | --- | --- |
| `id_institucion` | `NUMBER(4)` | `NOT NULL` |
| `nombre_institucion` | `VARCHAR2(60)` | `NOT NULL` |
| `id_director` | `NUMBER(6)` | `NULL` |
| `id_direccion` | `NUMBER(4)` | `NULL` |

**`VOLUNTARIO`**

| Columna | Tipo | Nulabilidad |
| --- | --- | --- |
| `nro_voluntario` | `NUMBER(6)` | `NOT NULL` |
| `nombre` | `VARCHAR2(20)` | `NULL` |
| `apellido` | `VARCHAR2(25)` | `NOT NULL` |
| `e_mail` | `VARCHAR2(25)` | `NOT NULL` |
| `telefono` | `VARCHAR2(20)` | `NULL` |
| `fecha_nacimiento` | `DATE` | `NOT NULL` |
| `id_tarea` | `VARCHAR2(10)` | `NOT NULL` |
| `horas_aportadas` | `NUMBER(8,2)` | `NULL` |
| `porcentaje` | `NUMBER(2,2)` | `NULL` |
| `id_institucion` | `NUMBER(4)` | `NULL` |
| `id_coordinador` | `NUMBER(6)` | `NULL` |

**Cómo leer el diagrama:** las columnas **en rojo** son las **claves foráneas** (`id_tarea`,
`id_institucion`, `id_coordinador` en `VOLUNTARIO`; `id_director`, `id_direccion` en `INSTITUCION`;
`id_pais` en `DIRECCION`). Un óvalo rojo encierra juntas las dos últimas líneas de `DIRECCION`
(`provincia` **y** `id_pais`), marca que reaparece en el slide 8. Los conectores usan **pata de gallo**
(1:N), con `0..1` del lado de `DIRECCION` y `0..N` del lado de `INSTITUCION`.

> [!warning] Tablas que los ejemplos usan y el diagrama no define
> - **`tarea`**: slides 12 y 15. De los queries se deduce `tarea(id_tarea, nombre_tarea)`.
> - **`esq_vol_tarea`**: una sola vez, en el `NOT EXISTS` del slide 16, sin definición en ningún lado.
>
> Los slides 20 y 21 además cambian de dominio (`entrega`/`video`, `empresa_productora`/`pelicula`,
> `nacional`/`internacional`): son los ejemplos originales de la fuente de la que se copiaron esas
> imágenes.

> [!note] `porcentaje NUMBER(2,2)` — razonamiento propio, no está en el deck
> En Oracle `NUMBER(p,s)` con `p = s = 2` admite solo valores de **módulo menor que 1** con dos decimales
> (`0.05`, `0.99`), no `85`. Si la intención era un porcentaje de 0 a 100, el tipo está mal. **Verificar
> en clase.**

---

## Slide 2 · La sintaxis del `SELECT`

> *"La sentencia del lenguaje empleada para la recuperación de datos: **SELECT**."*

Textual del recuadro:

```sql
SELECT * | { [DISTINCT] columna | expresion [alias],...}
FROM  lista de tablas
[WHERE condiciones]
[GROUP BY expresión de agrupamiento]
[HAVING condición de grupo]
[ORDER BY lista de columnas [ASC|DESC]]
```

Lo único **obligatorio** son `SELECT` y `FROM`; lo que va entre `[ ]` es opcional. El deck no dice nada
más sobre `GROUP BY`, `HAVING` ni `ORDER BY`.

> [!question] El orden de evaluación no está en el deck
> El slide da el orden **sintáctico**, no el de evaluación. **Razonamiento propio, no está en el deck:**
> el orden lógico es `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY`, y de ahí sale que `WHERE`
> filtra **filas** antes de agrupar (sin funciones de agregado) y `HAVING` filtra **grupos** después de
> agrupar (con ellas).

## Slides 3–5 · Consultas de más de una tabla

> *"Tenemos que revisar desde el esquema las condiciones de ensamble entre las distintas tablas."*

El enunciado que se resuelve en todo el deck es, en el slide 3, *"seleccionar el nombre y apellido de
los voluntarios **de instituciones** del estado (provincia) de Texas"*; los slides 5 y 7 lo abrevian a
*"…de los voluntarios del estado (provincia) de Texas"*, pero el query sigue pasando por `institucion`:
no cambia la consigna.

Forma clásica (slide 5), con la lista de tablas en el `FROM` y las condiciones de ensamble en el `WHERE`:

```sql
SELECT nombre, apellido
FROM voluntario v, institucion i, direccion d

WHERE v.id_institucion = i.id_institucion
  AND i.id_direccion = d.id_direccion

  AND d.provincia = 'Texas'
```

> [!important] La regla que hay que memorizar
> El slide encierra en un óvalo rojo la primera condición y anota al margen, textual: *"Condiciones de
> ensamble"* / *"(cantidad de tablas – 1)"*. Tres tablas → dos condiciones de ensamble. Es el chequeo
> rápido para no olvidar una y terminar en un **producto cartesiano** *(el deck enuncia la regla; no la
> justifica ni nombra al producto cartesiano)*.

En el `FROM` se declaran **alias de tabla** (`v`, `i`, `d`), y la tercera condición,
`d.provincia = 'Texas'`, **no es de ensamble sino de selección**: el deck la separa con un renglón en
blanco, fuera del óvalo.

## Slides 6–7 · Ensambles internos

> *"Por medio del operador **JOIN** podemos combinar dos tablas según una condición para obtener
> tuplas compuestas por atributos de las dos relaciones combinadas. Existen diferentes maneras
> hacerlo"*

| Variante | Definición **textual** del slide 6 |
| --- | --- |
| **`INNER JOIN`** *(De equivalencia o Equi-join)* | *"Es un caso particular de INNER JOIN en el que la condición que acota el resultado es una comparación de igualdad."* |
| **`NATURAL JOIN`** | *"Es un caso especial de equi-join en el que en el caso de existir columnas con el mismo nombre en las relaciones que se combinan, sólo se incluirá una de ellas en el resultado de la combinación."* |

Regla operativa: *"Si los nombres de columnas se repiten, hay que anteponer el nombre de la tabla para
evitar ambigüedades."*

> [!bug] La definición de `INNER JOIN` es circular
> Dice que el `INNER JOIN` *"es un caso particular de INNER JOIN"*. Por el rótulo entre paréntesis, lo
> que quiso decir es que el **equi-join** es el caso particular: el `INNER JOIN` general admite
> cualquier predicado (`>`, `<`, `BETWEEN`…) y el equi-join compara **por igualdad**. **Verificar en
> clase.**

**Slide 7 — el mismo query de Texas, con `JOIN` explícito** (el slide encierra en óvalos rojos las dos
líneas de ensamble: lo que antes estaba en el `WHERE`):

```sql
SELECT nombre, apellido

FROM voluntario v INNER JOIN institucion i
  ON (v.id_institucion = i.id_institucion)

  NATURAL JOIN direccion d
WHERE d.provincia = 'Texas'
```

| | Slide 5 (lista en `FROM`) | Slide 7 (`JOIN` explícito) |
| --- | --- | --- |
| Dónde va el ensamble | en el `WHERE` | en el `FROM`, con `ON` |
| Dónde va el filtro | en el `WHERE`, mezclado | en el `WHERE`, solo |
| `direccion` | condición explícita `i.id_direccion = d.id_direccion` | **implícita**: `NATURAL JOIN` la deduce del nombre `id_direccion` |

> [!tip] Por qué el `NATURAL JOIN` funciona acá
> `institucion` y `direccion` comparten **exactamente una** columna homónima, `id_direccion`; el
> `NATURAL JOIN` ensambla por ella y la deja una sola vez en el resultado.
>
> **Razonamiento propio, no está en el deck:** por eso mismo es frágil: depende de los **nombres** de
> columna, no del esquema. Si alguien agrega a `direccion` una columna que ya exista en `institucion`
> (un `nombre`, por ejemplo), el join **cambia de significado en silencio**. En producción se prefiere
> `INNER JOIN … ON` o `USING`.

## Slides 8–10 · Consultas anidadas y subconsultas de una fila

> *"La cláusula `WHERE` puede contener un `SELECT` anidado o subconsulta. Como una consulta en 2
> pasos."*

Enunciado de los slides 8 y 9, textual: *"seleccionar el nombre de la/s instituciones del estado
(provincia) de Texas."* El `la/s` ya anticipa que el resultado puede ser más de uno, que es el problema
que plantea el slide 9.

**Slide 8 — la versión "a mano", en dos pasos** (el slide repite a la derecha el fragmento
`DIRECCION`/`INSTITUCION` del diagrama, con el mismo óvalo rojo):

```sql
SELECT id_direccion
FROM direccion d
WHERE d.provincia = 'Texas';
```

```
Resultado = 1400
```

```sql
SELECT nombre_institucion
FROM institucion i
WHERE i.id_direccion = 1400;
```

**Slide 9 — la misma consulta, anidada:**

```sql
SELECT nombre_institucion
FROM institucion i
WHERE i.id_direccion = (SELECT id_direccion
  FROM direccion d
  WHERE d.provincia = 'Texas');
```

> [!important] *"Muy importante…..que ocurriría si hay más de un resultado para Texas?"*
> *(así en el slide: `que` sin tilde y sin `¿` de apertura)*
> - *"Usar operadores de fila única o **single-rows (=, >, <, <>, >=, <=)** para subconsultas que
> retornan una fila"*
> - *"Usar operadores de múltiples filas o **multiple-rows** (**IN, ANY, ALL**) para subqueries que
> retornan varias filas"*
>
> El slide 9 lista como *multiple-rows* solo `IN`, `ANY` y `ALL`; la tabla del slide 11 agrega `EXISTS`.
> Si en el parcial preguntan cuáles son, el deck da dos listas distintas.

**Slide 10 — dos ejemplos más, y la advertencia:**

```sql
SELECT nombre, apellido
FROM  voluntario
WHERE horas_aportadas = (SELECT MIN(horas_aportadas)
  FROM voluntario);
```

```sql
SELECT id_tarea, MIN(horas_aportadas)
  FROM voluntario
 GROUP BY id_tarea
HAVING MIN(horas_aportadas) > (SELECT AVG(horas_aportadas)
  FROM voluntario);
```

> *"Es responsabilidad de quien escribe el `SELECT` asegurar que la subconsulta devolverá una sola
> fila. Si el subquery devuelve más de una fila, dará <u>error de ejecución</u>"* *(la segunda oración
> va en rojo en el slide, con solo `error de ejecución` subrayado)*

El segundo ejemplo es el **único query con `GROUP BY` y `HAVING`** del deck, y llega sin explicación de
ninguna de las dos cláusulas. Lo que sí muestra: una subconsulta **puede ir dentro del `HAVING`**, y la
interna (`AVG` sobre toda la tabla) **no está correlacionada** con el grupo.

## Slides 11–13 · Subconsultas de varias filas: `IN`, `EXISTS`, `ANY`, `ALL`

Tabla del slide 11, textual:

| Operador | Significado |
| --- | --- |
| **`IN`** | Retorna `TRUE` si el valor está incluido en los valores retornados por la subconsulta |
| **`EXISTS`** | Retorna `TRUE` si el *subquery* devuelve al menos una fila. `FALSE` si devuelve 0 filas |
| **`ANY`** | Retorna `TRUE` si la comparación es `TRUE` para **al menos un** valor retornado por el *subquery* |
| **`ALL`** | Retorna `TRUE` si la comparación es `TRUE` para **todos** los valores retornados por el *subquery* |

> [!missing] `ANY` y `ALL` no tienen ni un ejemplo
> El deck los define en esta tabla y no vuelve a mencionarlos: no hay un solo query con `> ANY (…)` ni
> `>= ALL (…)`. Tampoco menciona el sinónimo `SOME` ni la relación `= ANY ≡ IN` / `<> ALL ≡ NOT IN`.
> Hay que buscarlo fuera del deck.

**Slide 12 — operador `[NOT] IN`:** *"Permite determinar si los valores de una columna, o conjunto de
ellas, están contenidos (o no) en una lista definida o dentro de otra tabla (subconsulta)."*

Enunciado textual: **"Seleccionar el nro., nombre y apellido de los voluntarios que realizan tareas cuyo
nombre comienza con ORG"**

```sql
SELECT nro_voluntario, nombre, apellido
FROM voluntario
WHERE id_tarea IN
  (SELECT id_tarea
  FROM tarea
  WHERE nombre_tarea LIKE 'ORG%');
```

> *"De igual manera se pueden seleccionar los voluntarios que no realizan dicha tarea con `NOT IN`
> **(si `nombre_tarea` no permite nulos)**"*

Ese paréntesis es la primera aparición del problema que desarrolla el slide 30: **`NOT IN` sobre una
lista con nulos no devuelve nada**.

**Slide 13 — `Operador IN`, la equivalencia con `OR`:** *"La condición del operador `IN` puede
plantearse indicando **la lista de valores dada por extensión**, entonces"*

```
IN (v1, v2, …., vn) es equivalente a
  ((x=v1) or (x=v2) …or (x=vn))
```

> *"De igual manera el operador"*

```
NOT IN (v1, v2, …., vn) es equivalente a
  NOT ((x=v1) or (x=v2) …or (x=vn))
```

> [!important] Alcance de la equivalencia
> El slide la enuncia **para la lista dada por extensión**, no para la forma con subconsulta; igual es
> la que usa el slide 30 para explicar el `NOT IN` con nulos. **Razonamiento propio, no está en el
> deck:** el slide 30 no agrega ninguna regla nueva, solo aplica las tablas de verdad del slide 27 a
> esta reescritura.

## Slides 14–16 · `[NOT] EXISTS`

> *"Se refiere únicamente a la determinación de si la subconsulta devuelve alguna fila. Si devuelve
> una o más filas, el predicado se evalúa como verdadero; de lo contrario, el predicado se evalúa como
> falso. **Tiene la forma de una consulta correlacionada**"*

Plantilla del slide 14:

```sql
SELECT lista de atributos
FROM tabla_externa E
WHERE EXISTS
  (SELECT 1
  FROM tabla_interna I
  WHERE E.atributo1 = I.atributo1
  …..
  AND E.atributoN = I.atributoN);
```

**Razonamiento propio, no está en el deck:** el `SELECT 1` es deliberado: a `EXISTS` **no le importa qué
columnas devuelve** la subconsulta, solo **si devuelve filas**, así que se pone la constante más barata.
El deck lo usa en los slides 14, 15, 16 y 18 sin comentarlo.

**Slide 15 — cómo se ejecuta `EXISTS`.** Segunda definición, distinta de la del 14: *"El operador
`EXISTS` **comprueba la existencia de filas** en el conjunto de filas del resultado de la
subconsulta."* Y, textual: si se encuentra un valor de fila de la subconsulta, se coloca la condición
como **verdadera** y **la búsqueda no continúa** en la consulta interna; si no se encuentra, se coloca
como **falsa** y la búsqueda **continúa** en la consulta interna para el siguiente valor de la tabla
externa. Es decir: **corta al primer match** (*short-circuit*), fila externa por fila externa.

Enunciado textual: **"Seleccionar el nro., nombre y apellido de los voluntarios que realizan tareas cuyo
código comienza con ORG"**

```sql
SELECT nro_voluntario, nombre, apellido
FROM voluntario V
WHERE EXISTS
  (SELECT 1
  FROM tarea T
  WHERE V.id_tarea = T.id_tarea
  AND nombre_tarea LIKE 'ORG%');
```

**Slide 16 — `NOT EXISTS`:** *"De igual forma el para `NOT EXISTS` comprueba que no existan filas en el
conjunto de filas del resultado de la subconsulta interna."* *(el "el para" es del slide)*

Enunciado textual: **"Seleccionar el nro., nombre y apellido de los voluntarios que NO realizan tareas
cuyo nombre comienza con ORG"** *(el `NO` va en mayúsculas en el slide)*

```sql
SELECT nro_voluntario, nombre, apellido
FROM voluntario V
WHERE NOT EXISTS
  (SELECT 1
  FROM esq_vol_tarea T
  WHERE V.id_tarea = T.id_tarea
  AND nombre_tarea LIKE 'ORG%');
```

> [!bug] Dos erratas en el par de ejemplos
> - El ejemplo positivo (slide 15) consulta **`tarea T`** y el negativo (slide 16) **`esq_vol_tarea T`**,
> tabla que no aparece en el esquema del slide 4 ni en ningún otro slide. Se presentan como el mismo
> ejemplo en versión afirmativa y negativa, así que lo más probable es un copy-paste de otro material.
> **Verificar en clase cuál es la tabla correcta.**
> - El enunciado del slide 15 dice *"tareas cuyo <u>código</u> comienza con ORG"*, pero el predicado
> filtra por `nombre_tarea LIKE 'ORG%'`, lo mismo que pide el slide 12, donde el enunciado sí dice
> *"nombre"*. El enunciado del 15 está mal.

El cierre del slide 16 es **la frase más examinable de la clase**:

> [!important] `IN` ≡ `EXISTS`, pero `NOT IN` ≢ `NOT EXISTS`
> > *"La sintaxis de `IN` y `EXISTS` deberían dar los mismos registros si la consulta está bien
> > construída, aunque la ejecución sean diferente."*
> >
> > *"**`NOT IN` y `NOT EXISTS` no son sinónimos. El valor `NULL` determina la diferencia.**"*
>
> **Razonamiento propio, no está en el deck** (que enuncia la diferencia acá y la explica recién en el
> slide 30): si la subconsulta interna devuelve **aunque sea un `NULL`**, `x NOT IN (…)` nunca puede
> evaluar a `TRUE` —queda en `UNKNOWN`— y la consulta externa **devuelve cero filas**. `NOT EXISTS` no
> compara valores, solo cuenta filas, así que **no se ve afectado**. Regla práctica: **ante la duda,
> `NOT EXISTS`.**

## Slides 17–18 · Subconsultas correlacionadas

**Slide 17 — definición y ciclo de ejecución** (imagen pegada de otra fuente): *"Se utilizan para el
procesamiento **fila a fila**. Cada subconsulta se ejecuta **una vez para cada fila** de la consulta
externa."*

```
  ┌──────────────────────────────────────────────┐
  │  │
  ▼  │
┌──────────────────────────────────────────┐  │
│ OBTENER  │  │
│ posible fila de consulta externa  │  │
└──────────────────┬───────────────────────┘  │
  ▼  │
┌──────────────────────────────────────────┐  │
│ EJECUTAR  │  │
│ consulta interna utilizando valor de  │  │
│ posible fila  │  │
└──────────────────┬───────────────────────┘  │
  ▼  │
┌──────────────────────────────────────────┐  │
│ UTILIZAR  │  │
│ valores de la consulta interna para  │──────┘
│ considerar posible fila  │
└──────────────────────────────────────────┘
```

Plantilla del mismo slide (transcripta con sus erratas: `columa1`, `intera` son del original):

```sql
SELECT columna1, columna2, ...
FROM  tabla1 externa
WHERE  columna1 <operador>
  (SELECT  columa1, columna2
  FROM  tabla2 intera
  WHERE  expr1 =
  externa.expr2);
```

El slide **recuadra en rojo** las dos apariciones de `externa`: el alias declarado en el `FROM` externo y
su uso **dentro** de la subconsulta. **Esa referencia hacia afuera es lo que hace que la subconsulta
sea correlacionada.**

> [!tip] Correlacionada vs. no correlacionada — la regla operativa
> **Razonamiento propio, no está en el deck:** si la subconsulta se puede **copiar, pegar sola en el
> editor y ejecutar**, es **no correlacionada**: se evalúa una vez y su resultado se reutiliza (caso de
> los slides 9, 10 y 12). Si ejecutada sola falla porque referencia un alias que no existe, es
> **correlacionada**: se evalúa una vez por fila externa (caso de los slides 14 a 18).

**Slide 18 — `EXISTS` sobre la misma tabla dos veces.** *Seleccionar el nro., nombre y apellido de los
voluntarios que son* **[que no son]** *coordinadores*; el `[que no son]` y el `[NOT]` van **en rojo**,
marcando que un mismo query resuelve las dos consignas:

```sql
SELECT nro_voluntario, nombre, apellido
FROM voluntario V1
WHERE [NOT] EXISTS
  (SELECT 1
  FROM voluntario V2
  WHERE V1.nro_voluntario = V2.id_coordinador);
```

> [!important] Esto es un **self-join**, aunque el deck no lo llame así
> `voluntario` aparece dos veces con alias distintos (`V1` externa, `V2` interna) porque la relación
> "es coordinador de" es **reflexiva**: sale de la FK `id_coordinador → nro_voluntario` de la propia
> tabla. **Sin los alias el query es inescribible**, porque no habría forma de distinguir de qué copia
> de `voluntario` es cada columna. El deck no introduce el término *self-join* en ningún slide.

## Slides 19–22 y 31 · Ensamble externo (*outer join*)

**Slide 19 — motivación y formato** (imagen pegada):

> *"El ensamble interno (inner join) sólo se queda con las filas que tienen valores idénticos en las
> columnas de las tablas que compara."* · *"Pero….puede suceder que perdamos alguna fila interesante de
> alguna de las dos tablas; por ejemplo, porque poseen valores `NULL`….."* · *"Por esto se SQL dispone
> del ensamble externo (outer join), que nos permite obtener todos los valores de la tabla que hemos
> puesto a la derecha, los de la tabla que hemos puesto a la izquierda o los valores de ambas tablas."*
> *"Su formato es:"*

```sql
SELECT nombre_columnas_a_seleccionar
FROM t1 [NATURAL] [LEFT|RIGHT|FULL] [OUTER] JOIN t2
{ON condiciones| [USING (columna [,columna...])}
[WHERE condiciones];
```

**Slide 31** repite lo mismo en formato nativo, más compacto: *"El ensamble común (interno) de 2
relaciones combina tuplas que tienen elementos comparables. **Las tuplas sin pareja no se muestran en el
resultado!!**"* · *"El ensamble externo (outer join) **incluye las tuplas sin pareja** en el resultado y
**rellena con `NULL`** los valores inexistentes"* → `Left outer join` · `Right outer join` ·
`Full outer join`.

**Los tres ejemplos (slides 20 y 21):**

| Slide | Operador | Consigna | Query |
| --- | --- | --- | --- |
| 20 | `RIGHT JOIN` | *"Listar las entregas de peliculas y todos los videos."* | `SELECT * FROM entrega RIGHT JOIN video;` |
| 20 | `LEFT JOIN` | *"Listar todas las empresas productoras junto con las películas que producen"* | `SELECT * FROM empresa_productora LEFT JOIN pelicula;` |
| 21 | `FULL JOIN` | *"Listar todos los distribuidores nacionales e internacionales"* | `SELECT * FROM nacional N FULL JOIN internacional I ON (N.id_distrib_mayorista = I.id_distribuidor);` |

Comentario del slide 21 sobre el `FULL JOIN`: *"Listara todos los distribuidores nacionales tengan o no
distribuidor mayorista y tambien se incluiran los distribuidores internacionales que no estaban
asociados a ningun distribuidor nacional."* · *"**Nota: la cláusula `ON` la debo especificar cuando las
columnas de ensamble (join) no coinsiden en nombre**"* *(las erratas son del slide)*

> [!bug] Los dos primeros ejemplos **no compilan** en ningún motor que use la cursada
> `FROM entrega RIGHT JOIN video;` y `FROM empresa_productora LEFT JOIN pelicula;` no tienen `ON`,
> `USING` ni `NATURAL`. La nota del slide 21 sugiere que el autor asume que el `ON` se omite si las
> columnas se llaman igual (un `NATURAL LEFT JOIN` implícito). **Eso no es SQL estándar**: en MySQL
> `t1 LEFT JOIN t2` sin `ON`/`USING` es **error de sintaxis**; hay que escribir `NATURAL LEFT JOIN` o
> `LEFT JOIN … ON`. **Verificar en el motor de la cátedra** y, mientras tanto, **escribir siempre el
> `ON`.**

> [!warning] `FULL JOIN` / `FULL OUTER JOIN` **no existe en MySQL**
> El deck lo enseña en los slides 19, 21, 22 y 31, pero MySQL 8.0 **no implementa** `FULL OUTER JOIN`.
> El reemplazo estándar es unir los dos lados:
>
> ```sql
> SELECT * FROM A LEFT  JOIN B ON A.key = B.key
> UNION
> SELECT * FROM A RIGHT JOIN B ON A.key = B.key;
> ```
>
> Directamente relevante para el TP, que corre sobre MySQL (versión del motor: ver
> [[#Motor: qué hay que traducir a MySQL]]).

### Slide 22 · El diagrama de Venn — los 7 patrones

Imagen titulada **"SQL JOINS"**, firmada *"© C.L. Moffatt, 2008"*, sin texto propio de la cátedra: siete
diagramas de Venn, cada uno con su query debajo; la zona **roja** es lo que devuelve la consulta.

| # | Qué devuelve (zona roja) | Query |
| --- | --- | --- |
| 1 | Todo `A` + lo que matchee de `B` | `SELECT <select_list> FROM TableA A LEFT JOIN TableB B ON A.Key = B.Key` |
| 2 | Todo `B` + lo que matchee de `A` | `SELECT <select_list> FROM TableA A RIGHT JOIN TableB B ON A.Key = B.Key` |
| 3 | **Solo la intersección** | `SELECT <select_list> FROM TableA A INNER JOIN TableB B ON A.Key = B.Key` |
| 4 | **Solo `A`**, sin la intersección *(anti-join)* | `SELECT <select_list> FROM TableA A LEFT JOIN TableB B ON A.Key = B.Key WHERE B.Key IS NULL` |
| 5 | **Solo `B`**, sin la intersección | `SELECT <select_list> FROM TableA A RIGHT JOIN TableB B ON A.Key = B.Key WHERE A.Key IS NULL` |
| 6 | **Todo** `A` ∪ `B` | `SELECT <select_list> FROM TableA A FULL OUTER JOIN TableB B ON A.Key = B.Key` |
| 7 | **Diferencia simétrica**: todo menos la intersección | `SELECT <select_list> FROM TableA A FULL OUTER JOIN TableB B ON A.Key = B.Key WHERE A.Key IS NULL OR B.Key IS NULL` |

> [!tip] El patrón que hay que entender, no memorizar
> Los casos **4, 5 y 7** son el mismo truco: outer join y después **filtrar por `IS NULL` la clave del
> lado opuesto**. Una fila con `B.Key IS NULL` tras un `LEFT JOIN` es exactamente una fila de `A` **que
> no encontró pareja**: el `NULL` lo puso el propio join. Es el tipo 6 de nulo del slide 24
> (*"Caracteres de relleno en el ensambles externos"*): los slides 22 y 24 hablan del **mismo** `NULL`.
>
> **Cuidado (razonamiento propio):** el filtro tiene que ir sobre una columna que **no admita nulos
> propios**, típicamente la clave; si `B.Key` pudiera ser `NULL` en los datos, el patrón mezcla "no
> matcheó" con "matcheó pero tiene el campo nulo". Y los casos **6 y 7** usan `FULL OUTER JOIN`, que no
> corre en MySQL; los **1–5** sí.

---

## Slides 23–26 · Información faltante y los nulos

**Slide 23 — el problema, planteado sin SQL:** *"Información faltante fue un gran problema desde los
comienzos de las BD."* · *"Faltante, en su sentido más amplio significa **ausente**."* · *"Las razones
de la ausencia pueden ser diversas."* En un sistema **'manual', en papel**, se manejaría dejando el
espacio **en blanco**, dibujando una **línea de tachado**, colocando un **N/A** (no aplicable) o
**NS/NC** (no sabe/no contesta), u otras formas apropiadas para el caso.

**Slide 24 — `Los NULOS!!!!`**

> [!important] La definición, subrayada en el slide
> > *"`null` <u>no es un valor</u>, es la **ausencia de valor**! Esta es la noción aceptada por SQL."*
> > *"`null` significa valor desconocido o no existente… pero en realidad hay varias interpretaciones
> > más, hay diferentes tipos de información faltante"*

**Los 6 tipos de información faltante**, numerados así en el slide:

| # | Tipo | Ejemplo del deck |
| --- | --- | --- |
| 1 | **Atributos inaplicables** | `ÁreaDirigida` para un empleado que no es director de área |
| 2 | **Aplicable pero desconocido** | `Comisión`, para un alumno que aún no la tiene asignada |
| 3 | **Valor no existente** | `NroPasaporte` para quien no lo tiene |
| 4 | **Indefinido** | `NotaPromedio` para quien no ha rendido finales |
| 5 | **Valor no provisto** | `NoSabe/NoContesta` |
| 6 | **Valor resultante de una operación algebraica** | *"Caracteres de relleno en **el** ensambles externos"* ← la concordancia rota es del slide |

> [!bug] El ejemplo 2 mezcla dominios
> *"`Comisión`, para un **alumno** que aún no la tiene asignada"*: `Comisión` viene del dominio de
> empleados (el ejemplo 1 y el del slide 25 son de empleados). O quiso decir "comisión" como *división
> de un curso*, o es un copy-paste. **Verificar en clase**: cambia el ejemplo, no el concepto.

**Slide 25 — `'Valores' nulos?`** El argumento central del deck: *"Cada tipo de nulo tiene su propia
semántica, características y operatoria"* → es **antinatural** utilizar el mismo tratamiento para todos
los casos → **mal uso potencial** (la suma `Comisión + Sueldo` para un empleado que no vende dará un
valor desconocido) → si la ausencia de un valor **depende de la ausencia de otro**, **hay que definir un
`null` nuevo**: *"Si el `CodSalarioFliar` es null (no aplicable), entonces el `ValorSalarioFliar` es
null (no aplicable en consecuencia del anterior)"*; *"Si depende de dos nulls → **otro null con
semántica más elaborada!**"*

> [!note] La crítica que hay detrás (lectura propia, no está en el deck)
> Es una **reducción al absurdo**: si cada tipo de ausencia necesitara su propio `null`, y las
> dependencias entre ausencias generaran `null`s nuevos, harían falta infinitos. SQL **colapsa los 6
> tipos en un único `NULL`**, y esa simplificación es la que produce los problemas de los slides 26 a
> 30. Es la lectura que hace coherentes los slides 24, 25 y 32.

**Slide 26 — Tratamiento de los nulos:** *"Surgen complicaciones cuando los valores nulos participan en
operaciones aritméticas o de comparación **(deberían evitarse siempre que sea posible)**."* Un nulo
indica «valor desconocido o no existente», entonces:

- **cualquier operación aritmética (`+`, `–`, `*`, `/`) que los incluya debe devolver un valor nulo;**
- **cualquier comparación (como `<`, `<=`, `>`, `>=` y `!=`) que los incluya se evalúa al valor
  especial desconocido**: no se puede decir si el resultado es verdadero o falso, es el nuevo valor
  lógico **desconocido**.

> [!important] Lo que el deck **no** dice y hay que saber igual
> **Razonamiento propio, no está en el deck:** de la segunda viñeta se sigue que `campo = NULL` y
> `campo <> NULL` **nunca son verdaderos**, ni siquiera cuando el campo es nulo. Por eso SQL tiene los
> predicados **`IS NULL`** e **`IS NOT NULL`**, que sí devuelven `TRUE`/`FALSE`. El deck los usa en el
> slide 22 (`WHERE B.Key IS NULL`) pero nunca los introduce. Es el error número uno en los TPs.

## Slides 27–30 · Lógica trivaluada

**Slide 27 — las tablas de verdad.** *"Las comparaciones que incluyen nulos pueden aparecer dentro de
expresiones booleanas que incluyan operaciones AND, OR, NOT, entonces se debe definir la forma en que
estas operaciones tratan el valor lógico desconocido."*

```
LÓGICA DE TRES VALORES
  VERDADERO (TRUE) · FALSO (FALSE) · DESCONOCIDO (UNKNOWN)
```

| `& (AND)` | **T** | **U** | **F** |
| --- | --- | --- | --- |
| **T** | T | U | F |
| **U** | U | U | F |
| **F** | F | F | F |

| `I (OR)` | **T** | **U** | **F** |
| --- | --- | --- | --- |
| **T** | T | T | T |
| **U** | T | U | U |
| **F** | T | U | F |

| `~(NOT)` | |
| --- | --- |
| **T** | F |
| **U** | **U** |
| **F** | T |

> [!note] Los encabezados están transcriptos tal cual
> El slide rotula las tablas `& (AND)`, `I (OR)` y `~(NOT)`; ese `I` es una **i mayúscula**, no una
> barra vertical: presumiblemente se quiso escribir `| (OR)`. **Verificar en clase** si el parcial usa
> esa notación (`&`, `|`, `~`) o la habitual `AND` / `OR` / `NOT`.

> [!tip] Las tres casillas que hay que retener
> `F AND U = F` (el falso **absorbe**) · `T OR U = T` (el verdadero **absorbe**) ·
> **`NOT U = U`** (la negación **no rescata** un desconocido). Esa última es la que rompe el `NOT IN`
> del slide 30.

**Slide 28 — efecto sobre las operaciones relacionales:**

| Operación | Qué pasa, textual |
| --- | --- |
| **Selección** | *"se requiere que la condición evalúe en **VERDADERO**, no en FALSO ni DESCONOCIDO"* |
| **Proyección** | *"implica la eliminación de duplicados, pero `null<>null`, entonces dos tuplas aparentemente iguales no podrían ser eliminadas! (la misma tupla no debería ser igual a sí misma!) **pero eso NO ocurre en SQL**"* ← el remate está **en rojo** |

> [!important] La incoherencia que el slide 28 admite
> La teoría relacional pura **no podría** eliminar duplicados con nulos (`null<>null`), *"pero eso NO
> ocurre en SQL"*: SQL sí los elimina, y el único respaldo del deck es el slide 29 (*"Para `DISTINCT`,
> `null` es duplicado de `null`"*). **Razonamiento propio, no está en el deck:** SQL usa **dos criterios
> de igualdad según el contexto**: en el `WHERE` (selección) `null = null` da `UNKNOWN` y la fila no
> pasa; en `DISTINCT`, `GROUP BY` y `UNION` (proyección) dos nulos se consideran duplicados y se
> colapsan. Es una incoherencia del estándar SQL, no del deck. **El deck solo nombra `DISTINCT`**: que
> `GROUP BY` y `UNION` se comporten igual hay que verificarlo en el motor de la cátedra.

**Slide 29 — comportamiento concreto en SQL.** Las cinco viñetas del slide, resumidas en tabla:

| Construcción | Qué hace con los nulos |
| --- | --- |
| `SUM()`, `AVG()`, `MIN()`, `MAX()` | los **eliminan implícitamente** del cálculo |
| `COUNT(columna)` | **no cuenta** las filas con esa columna nula |
| `COUNT(*)` | cuenta **todas** las filas, sin depender de ninguna columna |
| Agregados sobre una columna **toda nula** | devuelven `null` |
| `ORDER BY` | *"null es el 'mayor'"* |
| `DISTINCT` | *"null es duplicado de null"* |

> [!warning] `ORDER BY`: *"null es el 'mayor'"* **no vale en MySQL**
> Es el comportamiento de **Oracle** (y de PostgreSQL): en un `ORDER BY … ASC` los nulos van **al
> final**. **MySQL hace lo contrario**: ordena los `NULL` **primero** en `ASC` y **últimos** en `DESC`,
> o sea los trata como **el menor**. El estándar SQL deja la decisión librada al motor. **Como el TP
> corre sobre MySQL, este slide induce al error**: probar en el motor de la cátedra con
> `SELECT ... ORDER BY columna_con_nulos;` antes de confiar en cualquiera de las dos versiones.

> [!note] Consecuencia práctica de la primera fila
> **Razonamiento propio, no está en el deck:** que `AVG()` ignore los nulos significa que `AVG(col)`
> **no es** `SUM(col)/COUNT(*)` sino `SUM(col)/COUNT(col)`. Con nulos en la columna las dos cuentas dan
> distinto: trampa clásica de parcial.

**Slide 30 — `IN` y `NOT IN` con nulos:**

> `IN (v1, v2, …., vn)` dado que se evalúa como `((x=v1) or (x=v2) …or (x=vn))`
> *"Entonces `x=NULL` evalúa a desconocido, verdadero para cualquier valor `v1...vn` y falso para el
> resto."*
>
> `NOT IN (v1, v2, …., vn)` dado que se evalúa como `((x<>v1) and (x<>v2) …and (x<>vn))`
> *"Entonces evalúa a desconocido para null, verdadero para cualquier valor distinto de `v1...vn` y
> falso para el resto. **Problema si en la lista de valores hay nulos no retorna resultado!!!!!!**"*

> [!bug] La redacción de este slide es confusa y hay que reconstruirla
> Las dos frases *"verdadero para cualquier valor v1...vn y falso para el resto"* mezclan el caso
> `x IS NULL` con el caso "x tiene valor". La **conclusión** es correcta y es la que importa.
> Reconstrucción, **razonamiento propio**:
>
> | Caso | `x IN (…)` | `x NOT IN (…)` |
> | --- | --- | --- |
> | `x` es `NULL` | `UNKNOWN` → la fila **no pasa** | `UNKNOWN` → la fila **no pasa** |
> | `x` está en la lista | `TRUE` | `FALSE` |
> | `x` no está y **la lista no tiene nulos** | `FALSE` | `TRUE` |
> | `x` no está y **la lista tiene un `NULL`** | `FALSE` *(sigue funcionando)* | **`UNKNOWN`** → la fila **no pasa** |
>
> La última fila es el bug famoso: `x <> NULL` da `UNKNOWN` y, por la tabla del `AND`,
> `TRUE AND UNKNOWN = UNKNOWN`, así que **ninguna** fila sobrevive: **el `NOT IN` devuelve el conjunto
> vacío**. **`IN` no tiene el problema**: `FALSE OR UNKNOWN = UNKNOWN`, pero un solo `TRUE` alcanza para
> salvar la expresión. Esto cierra el círculo con el paréntesis del slide 12 (*"si `nombre_tarea` no
> permite nulos"*) y con la frase del slide 16 (*"`NOT IN` y `NOT EXISTS` no son sinónimos"*).

## Slides 32–33 · Valores por defecto

**Slide 32 — la primera alternativa al `NULL`** (el deck presenta dos: valores por defecto y partición
de tablas):

- **Son una alternativa al uso de `NULL`s**: si un valor es desconocido, se rellena con **un valor en
  particular**; son valores, por lo tanto **no es necesario aplicar la Lógica Trivaluada**.
- **Suelen tener más significado que los `NULL`s**: `'ninguno'`, `'desconocido'`, `'ns/nc'`,
  `'no aplicable'`.
- **Ejemplos**: `ZZZ` para los nombres; `-1` para peso, precio, cantidad, etc.

> [!question] La pregunta que el slide deja abierta
> *"(Observar que `-1` no sería considerado accidentalmente como válido, sin embargo **que pasaría con
> una operación `UPDATE Producto SET Peso = Peso + 3` ??**)"* *(el `que` sin tilde es del slide)*
>
> **Razonamiento propio, no está en el deck:** el centinela `-1` deja de serlo: pasa a valer `2`, un
> peso perfectamente plausible, y **la marca de "faltante" se pierde de forma irreversible y
> silenciosa**. Es la diferencia clave con `NULL`, que es **absorbente** (`NULL + 3 = NULL`, slide 26):
> la ausencia **se propaga** en vez de perderse. **Confirmar la respuesta en clase.**

**Slide 33 — Problemas con valores por defecto.** *"Ya que son valores 'reales'…"*

1. **Pueden actualizarse como cualquier otro valor** ← es el caso del `UPDATE` de arriba.
2. **Se necesita encontrar un valor que no pudiese ser utilizado en ninguna circunstancia**
  (distinguible).
3. **Se corre el riesgo de una interpretación incorrecta.**
4. **En SQL los valores por defecto deben ser del mismo tipo que los valores de la columna** *"(por ej.
  **No se podría usar 'desconocido' en una columna de enteros!!**)"*.

## Slides 34–35 · Partición de tablas

**Slide 34 — la segunda alternativa:** *"`NULL`s y valores por defecto tratan de rellenar datos
faltantes con elementos dato distinguibles de los reales."* Los **`NULL`s** indican que el dato no está
usando **el mismo elemento de relleno para cualquier tipo de datos**; los **valores por defecto**
colocan un elemento dato **de la misma clase del faltante pero distinguible**. *"A menudo pueden
removerse tuplas que tienen datos faltantes"*: se pueden **separar las columnas que tienen nulos** de
manera que queden **en otra tabla**, y las subtuplas que contienen nulos **no se incluyen** en las
tablas generadas. Es decir: en vez de rellenar el hueco, **se rediseña el esquema para que el hueco no
exista**.

**Slide 35 — Problemas con partición de tablas:**

- **Se introducen nuevas tablas**: la información **se disemina** entre ellas y las consultas **se
  vuelven más complejas**, con **más ensambles**.
- **Se puede recuperar la tabla original, pero…** se necesita aplicar **outer joins**, y *"Esto
  **introduce `NULL`s**, que retrotrae a **todos los problemas ya analizados**, nuevamente!!"*

> [!important] El círculo se cierra acá (lectura propia; el slide solo dice "retrotrae…")
> La partición evita los `NULL`s **guardados**, pero para reconstruir la vista original hay que hacer
> un outer join, y el outer join **fabrica `NULL`s** (tipo 6 de la lista del slide 24). Esta segunda
> alternativa **no elimina el problema, lo mueve del almacenamiento a la consulta**. Es el argumento
> que justifica el veredicto del slide 36.

## Slide 36 · ¿Qué método usar?

> *"Puede ser una decisión personal .. pero debería tenerse en cuenta que:"*

| Recurso | Veredicto del deck |
| --- | --- |
| **Valores por defecto** | ***NO* deberían usarse cuando pueden 'confundirse' con valores reales** |
| **Partir tablas** | ***NO* debería utilizarse en demasía** pues aumentaría la cantidad de tablas en el esquema lleva a tener más ensambles a la hora de las consultas … *(sin coma y con la frase cortada así en el slide)* |
| **`NULL`s** | *"pueden ser (y **frecuentemente son**) usados cuando las otras alternativas parecen inapropiadas"* |
| **Combinarlos** | *"No es necesario utilizar siempre el mismo recurso…**se pueden combinar de forma inteligente!!**"* |

> [!quote] Las dos últimas líneas del deck, en verde azulado
> *"**Siempre tener presente donde se pueden encontrar nulos!!!**
> **Revisar en el planteo de sentencias las sentencias SELECT**"*

---

## Tabla resumen de sintaxis

Todo lo que el deck enseña, en una sola pantalla.

### Ensambles

| Qué | Sintaxis exacta del deck | Slide |
| --- | --- | --- |
| Multitabla clásico | `FROM t1 a, t2 b, t3 c WHERE a.k = b.k AND b.j = c.j` | 5 |
| Regla de control | *"Condiciones de ensamble (cantidad de tablas – 1)"* | 5 |
| Inner join | `FROM t1 a INNER JOIN t2 b ON (a.k = b.k)` | 7 |
| Equi-join | inner join cuya condición es **una igualdad** | 6 |
| Natural join | `FROM t1 a NATURAL JOIN t2 b` — ensambla por **columnas homónimas** y las deja **una sola vez** | 6–7 |
| Formato general del outer | `FROM t1 [NATURAL] [LEFT\|RIGHT\|FULL] [OUTER] JOIN t2 {ON condiciones\| [USING (columna [,columna...])}` | 19 |
| Left outer | `FROM A LEFT JOIN B ON A.Key = B.Key` — todo `A`, `NULL` donde `B` no matchea | 22, 31 |
| Right outer | `FROM A RIGHT JOIN B ON A.Key = B.Key` | 22, 31 |
| Full outer | `FROM A FULL OUTER JOIN B ON A.Key = B.Key` — (atención) **no existe en MySQL** | 19, 21, 22, 31 |
| Solo `A` *(anti-join)* | `FROM A LEFT JOIN B ON A.Key = B.Key WHERE B.Key IS NULL` | 22 |
| Solo `B` | `FROM A RIGHT JOIN B ON A.Key = B.Key WHERE A.Key IS NULL` | 22 |
| Diferencia simétrica | `FROM A FULL OUTER JOIN B ON A.Key = B.Key WHERE A.Key IS NULL OR B.Key IS NULL` | 22 |
| Self-join | misma tabla, **dos alias** (`FROM voluntario V1 … FROM voluntario V2`) | 18 |

### Subconsultas

| Qué | Sintaxis / regla | Slide |
| --- | --- | --- |
| Dónde pueden ir *(según el deck)* | en el **`WHERE`** y en el **`HAVING`** | 8, 10 |
| Devuelve **una** fila | operadores *single-row*: `=`, `>`, `<`, `<>`, `>=`, `<=` | 9 |
| Devuelve **varias** filas | operadores *multiple-row*: `IN`, `ANY`, `ALL` *(el slide 11 suma `EXISTS`)* | 9, 11 |
| Si devuelve varias y usás `=` | **error de ejecución** | 10 |
| `IN` | `WHERE col IN (SELECT …)` · equivale a `((x=v1) or … or (x=vn))` | 12–13 |
| `NOT IN` | equivale a `NOT ((x=v1) or … or (x=vn))` ≡ `((x<>v1) and … and (x<>vn))` — (atención) **vacío si la lista tiene `NULL`** | 13, 30 |
| `EXISTS` | `WHERE EXISTS (SELECT 1 FROM t2 I WHERE E.a = I.a)` — solo mira **si hay filas** | 14–15 |
| `NOT EXISTS` | idem negado — **no lo afectan los nulos** | 16 |
| `ANY` | `TRUE` si la comparación es `TRUE` para **al menos un** valor devuelto | 11 |
| `ALL` | `TRUE` si la comparación es `TRUE` para **todos** los valores devueltos | 11 |
| **Correlacionada** | la subconsulta **referencia un alias de la consulta externa** → se ejecuta **una vez por fila externa** | 17 |
| **No correlacionada** | se ejecuta **una vez**, su resultado se reutiliza | 8–10 |
| Equivalencias | `IN` ≡ `EXISTS` · **`NOT IN` ≢ `NOT EXISTS`** | 16 |

### Nulos

| Qué | Regla | Slide |
| --- | --- | --- |
| Qué es | **ausencia de valor**, no un valor | 24 |
| Aritmética | `+ − * /` con un `NULL` → **`NULL`** | 26 |
| Comparación | `< <= > >= !=` con un `NULL` → **`UNKNOWN`** | 26 |
| Lógica | `F AND U = F` · `T OR U = T` · **`NOT U = U`** | 27 |
| `WHERE` | pasa **solo** lo que evalúa a `TRUE` | 28 |
| `DISTINCT` | **`null` es duplicado de `null`** | 29 |
| `SUM/AVG/MIN/MAX` | **ignoran** los nulos; si la columna es toda nula, devuelven `NULL` | 29 |
| `COUNT(col)` | **no cuenta** las filas con `col` nula | 29 |
| `COUNT(*)` | cuenta **todas** las filas | 29 |
| `ORDER BY` | *"null es el 'mayor'"* — (atención) **al revés en MySQL** | 29 |

---

## Motor: qué hay que traducir a MySQL

El deck **no es de PostgreSQL** (el problema conocido del `BD2_Clase 04`): es de **Oracle**.

| Cosa del deck | Motor de origen | Qué pasa en **MySQL** |
| --- | --- | --- |
| `NUMBER(4)`, `NUMBER(8,2)` | Oracle | no existe → `INT` / `DECIMAL(8,2)` |
| `VARCHAR2(n)` | Oracle | no existe → `VARCHAR(n)` |
| `DATE` con hora | Oracle *(el `DATE` de Oracle incluye hora)* | `DATE` es **solo fecha**; para fecha+hora, `DATETIME` |
| `CHAR(2)` | estándar | igual |
| *"operadores single-row / multiple-row"* | vocabulario de Oracle | los operadores son los mismos, el nombre no se usa |
| *"error de ejecución"* si el subquery devuelve >1 fila (slide 10) | Oracle `ORA-01427` | también falla en ejecución; el mensaje es otro. **Verificar el texto exacto en el motor de la cátedra** |
| **`FULL JOIN` / `FULL OUTER JOIN`** | Oracle, PostgreSQL | ✗ **no existe** → emular con `LEFT JOIN … UNION … RIGHT JOIN` |
| `LEFT`/`RIGHT JOIN` **sin `ON`** (slide 20) | de ningún motor: es inválido | **error de sintaxis** → poner `ON` o usar `NATURAL LEFT JOIN` |
| `NATURAL JOIN`, `USING (…)` | estándar | ✓ soportados |
| `LEFT`/`RIGHT [OUTER] JOIN`, `INNER JOIN … ON` | estándar | ✓ soportados |
| `IN`, `NOT IN`, `EXISTS`, `ANY`, `ALL` | estándar | ✓ soportados |
| *"para `ORDER BY`, null es el 'mayor'"* | Oracle / PostgreSQL | ✗ **al revés**: MySQL pone los `NULL` **primero** en `ASC` |
| `!=` y `<>` | ambos estándar | ✓ los dos funcionan |
| Comillas tipográficas `‘ORG%’` (U+2018/U+2019) en los slides 12, 15 y 16 | artefacto de PowerPoint | ✗ copiadas tal cual **fallan en el parser** → retipear con comillas rectas `'ORG%'`. Los bloques de código SQL de esta página ya usan las rectas |

> [!warning] Confirmar la versión del motor
> Todo lo anterior asume **MySQL 8.0**. Antes de dar por buena cualquier fila de esta tabla en un TP o
> en el parcial, **verificar la versión del contenedor de la cátedra** (ver [[Práctica 2026-08-04]],
> instalación por Docker) con `SELECT VERSION();`.

## Dudas abiertas

- [ ] ¿`GROUP BY`, `HAVING`, el orden de evaluación de las cláusulas y las operaciones de conjunto
  (`UNION`, `INTERSECT`, `EXCEPT`) se dan en la parte 1 o en la parte 3 de la Clase 05? Si no están en
  ninguna, es un hueco de la clase.
- [ ] ¿`INTERSECT` y `EXCEPT` existen en el MySQL de la cátedra? MySQL **no los soportó** hasta versiones
  recientes de la rama 8.0: verificar con `SELECT VERSION();`.
- [ ] ¿Se enseñó `IS NULL` / `IS NOT NULL` explícitamente?
- [ ] ¿Cuál es la tabla correcta del `NOT EXISTS` del slide 16: `tarea` o `esq_vol_tarea`?
- [ ] ¿La definición de `INNER JOIN` del slide 6 es un tipeo por "equi-join"?
- [ ] ¿`SELECT * FROM entrega RIGHT JOIN video;` (slide 20) corre en el motor de la cátedra?
- [ ] ¿Qué ordena primero MySQL, los `NULL` o los valores? **Probarlo.**
- [ ] ¿Cuál es la respuesta a la pregunta del slide 32 sobre `UPDATE Producto SET Peso = Peso + 3`?
- [ ] ¿`porcentaje NUMBER(2,2)` en `VOLUNTARIO` es intencional?
- [ ] ¿`ciudad` y `provincia` son `VARCHAR` a propósito, y el esquema del TP lo replica?
- [ ] ¿La cátedra usa la notación `&` / `|` / `~` del slide 27 en el parcial, o `AND`/`OR`/`NOT`?
- [ ] ¿La cátedra pide justificar la elección entre `IN` y `EXISTS` por rendimiento? El slide 16 dice que
  *"la ejecución sean diferente"* sin explicar en qué.
- [ ] ¿El parcial acepta la sintaxis de lista en `FROM` (slide 5) o exige `JOIN … ON` (slide 7)?

## Enlaces

- Clase 05 completa: [[Clase 05 - Consultas de Datos–Parte 1]] ·
  **Parte 2 (esta página)** · [[Clase 05 - Consultas de Datos–Parte 3]]
- Clase anterior: [[Clase 04 - AlteraciónActualizaciónTablas]] · clase siguiente: [[Clase 06 - Vistas-Parte 1]]
- Práctica de la semana: [[Práctica 2026-08-04]]
- Conceptos: [[1.05.01 - SQL — consultas|NULL y lógica trivaluada]] · [[Ensambles (joins)]] · [[Subconsultas SQL]] ·
  [[1.05.01 - SQL — consultas|Información faltante]]
- Motores: [[MySQL]] *(la cursada)* · [[Oracle]] *(el motor de este deck)*
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
