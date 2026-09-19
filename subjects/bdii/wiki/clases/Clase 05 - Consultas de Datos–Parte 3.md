---
tipo: teorica
clase: 5
deck: "BD2_Clase 05 - Consultas de Datos–Parte 3.pdf"
unidad: 1
tema: "SQL: comentarios, alias, CONCAT, funciones de agregación"
resumen: "Dieciséis fichas de sintaxis: comentarios, CONCAT, alias, DISTINCT, CASE, LIKE, IN, TOP, LIMIT y seis funciones de fecha. El deck mezcla T-SQL con MySQL: TOP, DATEPART, DATENAME y los corchetes de LIKE no corren en MySQL, y DATEDIFF existe con otra firma; la sintaxis se fija contra MySQL."
fecha: 2026-08-03
modalidad: virtual, lunes 19:00–22:00 — asincrónico
aliases:
  - BD2_Clase 05 Parte 3
  - Consultas de Datos Parte 3
  - Manejo de fechas SQL
  - CASE LIKE IN TOP LIMIT
  - DATEPART DATENAME DATEDIFF
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 3.pdf"
estado: procesado
---

# Clase 05 — Consultas de Datos (Parte 3)

## Resumen general

Tercera y última parte de la Clase 05, asincrónica, del lunes 03/08: dieciséis fichas de sintaxis
SQL sin más hilo que el orden. Primero la cosmética del `SELECT` (comentarios `/* … */`, `CONCAT`,
alias con `AS`), después cómo deduplicar, clasificar, filtrar y recortar el resultado (`DISTINCT`,
`CASE`, `LIKE`, `IN`, `TOP`, `LIMIT`) y al final seis funciones de fecha (`DAY`, `MONTH`, `YEAR`,
`DATEPART`, `DATENAME`, `DATEDIFF`), con `getdate()` de apoyo. No aparecen `SUM`, `COUNT`, `AVG`,
`GROUP BY` ni `HAVING`: hay que buscarlos en las Partes 1 y 2.

Importa porque la cursada corre sobre MySQL y el deck es un patchwork de T-SQL (SQL Server) y
MySQL: los conceptos son portables, pero la sintaxis hay que fijarla contra MySQL antes del TP y del
parcial. Las trampas:

- `TOP` no existe en MySQL: el equivalente es `LIMIT` al final de la consulta, y en `LIMIT 0 , 30`
  el primer número es el offset.
- `DATEPART`, `DATENAME` y `getdate()` son de SQL Server; en MySQL van `EXTRACT(unidad FROM fecha)`,
  `MONTHNAME()` / `DAYNAME()` y `NOW()`.
- `DATEDIFF` existe en MySQL pero con otra firma: dos argumentos, siempre en días y calcula
  `f1 − f2`. El reemplazo uno a uno es `TIMESTAMPDIFF(unidad, f1, f2)`.
- Los corchetes `[nm]` de `LIKE` son literales en MySQL, que solo conoce `%` y `_`; la clase de
  caracteres va con `REGEXP '^A[nm]'`.
- `"alias" = expresión` (slide 5) es T-SQL: en MySQL corre como comparación y devuelve `0`. El
  alias va detrás, con `AS`.
- `NULL` contagia: `CONCAT` con un argumento `NULL` da `NULL`, un `CASE` sin `ELSE` da `NULL` si
  ningún `WHEN` matchea y `NOT IN` con un `NULL` en la lista no devuelve filas.

Para el parcial: la tabla resumen y la traducción a MySQL del final, y no copiar las comillas curvas
del deck.

## El deck

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 3.pdf` · **16 slides** · lunes
> **03/08**, **asincrónico**. Tercera parte de la **Clase 05**, una sola clase en tres archivos
> (`Parte 1`, `Parte 2`, `Parte 3`); mapa en [[_index-clases]]. Parte anterior:
> [[Clase 05 - Consultas de Datos–Parte 2]] · clase siguiente: [[Clase 06 - Vistas-Parte 1]] ·
> bibliografía: [[_index-bibliografia]].
>
> Sin slide de título ni de cierre: 16 fichas con definición breve y ejemplo. El título
> `CASE en SQL` se repite en los slides 5 y 6 (sin definición) y `Manejo de fechas` en los slides 11
> a 16 (una función por slide). No hay diagramas, capturas ni salidas de consola; lo único parecido a
> un resultado son las anotaciones en texto plano al costado de los ejemplos de los slides 14, 15 y
> 16 (*"retorna el mes actual"*, *"retorna 365 (días)"*).

> [!missing] No cubre funciones de agregación
> No aparecen `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`, `GROUP BY` ni `HAVING`; el
> `sum(importe * cantidad)` del slide 3 solo ilustra el alias de columna. Si la Clase 05 las trata,
> están en la Parte 1 o en la [[Clase 05 - Consultas de Datos–Parte 2|Parte 2]].

> [!warning] Patchwork de dialectos: T-SQL (SQL Server) mezclado con MySQL
> Distinto del deck `BD2_Clase 04`, escrito en PostgreSQL. Aquí:
>
> - **Slides 9 y 10**: `TOP` y `LIMIT` uno detrás del otro, sin decir que son de motores distintos y
> mutuamente excluyentes.
> - **Slides 14, 15 y 16**: `DATEPART`, `DATENAME`, `DATEDIFF` con 3 argumentos y `getdate()`
> (siempre en minúsculas en el deck) son de SQL Server; ninguna corre en MySQL tal como está escrita.
> - **Slide 7**: los corchetes `[nm]` de `LIKE` son de SQL Server; MySQL los toma como literales.
> - **Slide 5**: `"alias" = expresión` es alias de T-SQL; en MySQL es una comparación.
> - En cambio, los **slides 6, 10, 11, 12 y 13** usan backticks (`` `ventas` ``, `` `fecha` ``),
> exclusivos de MySQL, y el slide 10 usa `LIMIT o , c`, también de MySQL.
>
> Qué reemplaza a qué: [[#Traducción a MySQL]]. **Confirmar en clase con qué motor se corrigen los
> TPs.**

> [!bug] Comillas tipográficas copiadas de PowerPoint
> Varios ejemplos traen comillas curvas (`‘ ’`) en vez de `'`, en el slide 7 mezcladas dentro del
> mismo patrón. Tal cual salen del PDF: slide 1 (`‘Maradona’`), slide 7 (`'Garcia%‘` ← abre recta y
> cierra curva · `‘%Garcia‘` · `‘%G%‘`; `'A[nm]%'` y `'[-acfi]%'` sí llevan rectas) y slide 8
> (`IN(‘Fernet’,’Coca Cola’,’Hielo’)`). En esta página están normalizadas a `'` recta; copiadas tal
> cual del deck en un cliente MySQL fallan con error de sintaxis.

> [!note] Convención
> Lo marcado **(propio)** es razonamiento del vault: no figura en el deck.

---

## Slide 1 · Comentarios en SQL

> *"/\* sirve para realizar comentarios en SQL \*/"*

```sql
SELECT *
FROM personas
/* WHERE apellido = 'Maradona'*/
```

El único uso que muestra el deck es **comentar una cláusula para desactivarla**: la consulta corre
como `SELECT * FROM personas`, sin filtro.

**(propio)** MySQL soporta además dos comentarios de **una línea**: `-- ` (guión-guión **seguido de
un espacio**, obligatorio en MySQL) y `#`. El de bloque es el único de los tres portable a todos los
motores.

## Slide 2 · Concatenar campos

Dos consultas contrapuestas, sin más texto que el título:

```sql
SELECT apellido, nombre
FROM personas
```

```sql
SELECT CONCAT(apellido, ' ', nombre)
FROM personas
```

La primera devuelve **dos** columnas; la segunda, **una sola** con los dos valores pegados y el
literal `' '` en el medio (sin él saldría `MaradonaDiego`).

> [!warning] Dos cosas que el slide no dice **(propio)**
> 1. **`CONCAT` en MySQL devuelve `NULL` si *cualquiera* de sus argumentos es `NULL`**: la fila
> entera sale `NULL`, no el apellido solo. Para saltear los `NULL` está
> `CONCAT_WS(' ', apellido, nombre)`, que además pone el separador una sola vez.
> 2. La columna resultante **se llama `CONCAT(apellido, ' ', nombre)`**, el texto entero de la
> expresión; por eso el slide siguiente es el de los alias.
>
> El operador del **estándar SQL** es `||` (el de PostgreSQL), pero en **MySQL `||` es OR lógico**
> por defecto: `apellido || nombre` devuelve 0 o 1. Por eso el deck usa `CONCAT`.

## Slide 3 · Alias de una columna y alias de una tabla

Un solo slide con dos títulos.

**Alias de una columna:** *"La sentencia AS sirve para cambiarle el nombre de los resultados de una
columna."*

```sql
SELECT sum(importe * cantidad) AS total
```

Tal cual figura, la consulta **no tiene `FROM`**: es un fragmento ilustrativo, no ejecutable.

**Alias de una tabla:** *"Un alias de tabla se puede asignar con o sin la palabra clave AS."*

```sql
SELECT * FROM personas AS p
SELECT * FROM personas p
```

> [!tip] Para qué sirve realmente el alias de tabla **(propio)**
> No es solo abreviatura: es **obligatorio** en el *join* de una tabla consigo misma (hay que
> distinguir las dos copias) y en las subconsultas que se refieren a la tabla externa; ambos entran
> en la [[Clase 05 - Consultas de Datos–Parte 2|Parte 2]]. El `AS` de columna **también es opcional
> en MySQL** (`SELECT sum(x) total` funciona), aunque el slide solo lo diga para tablas.

## Slide 4 · Sentencia DISTINCT

> *"Con la cláusula "distinct" se especifica que los registros con ciertos datos duplicados sean
> obviadas en el resultado."*

```sql
SELECT autor FROM libros
```

```sql
SELECT distinct(autor) FROM libros
```

La primera devuelve **una fila por libro** (con el autor repetido); la segunda, **una fila por autor
distinto**.

> [!warning] `DISTINCT` es una cláusula, no una función: los paréntesis engañan **(propio)**
> `distinct(autor)` parece una función aplicada a una columna, pero **`DISTINCT` se aplica a *toda*
> la lista del `SELECT`**; los paréntesis solo agrupan la expresión `autor`. Con dos columnas se
> nota: `SELECT DISTINCT(autor), titulo FROM libros` deduplica por el **par** `(autor, titulo)` y,
> como el título cambia en cada libro, no elimina nada. Costumbre segura:
> `SELECT DISTINCT autor FROM libros`, sin paréntesis.

## Slide 5 · CASE en SQL — clasificar por rangos

```sql
SELECT producto, "rango de precios" =
CASE
  WHEN precio =  0 THEN 'Producto free'
  WHEN precio < 50 THEN 'menor a 50'
  WHEN precio >= 50 and precio < 250 THEN 'entre 50 y 250'
  WHEN precio >= 250 and precio < 1000 THEN 'entre 250 y 1000'
  ELSE 'mayor a 1000'
END
FROM productos
ORDER BY producto
```

Solo la consulta: el slide no define `CASE` ni nombra `WHEN`, `THEN` o `ELSE`.

**(propio)** `CASE` **de búsqueda**: cada `WHEN` lleva una condición completa, se evalúan **en orden**
y **gana la primera verdadera** (por eso `WHEN precio < 50` puede ir después de `WHEN precio = 0`);
el `ELSE` atrapa el resto. Dos bordes: `precio = 1000` cae en el `ELSE` como `'mayor a 1000'` aunque
sea igual, y un precio negativo sale como `'menor a 50'`.

> [!bug] `"rango de precios" =` es sintaxis de **SQL Server**, y en MySQL hace otra cosa
> Es la forma de alias de T-SQL. En MySQL:
>
> - **Con la configuración por defecto**, las comillas dobles delimitan una **cadena**:
> `"rango de precios" = CASE … END` es una **comparación de igualdad** entre ese texto y el resultado
> del `CASE`. La consulta corre, pero devuelve una columna de **`0`** (falso) llamada literalmente
> `"rango de precios" = CASE…END`, no las etiquetas.
> - **Con `sql_mode = ANSI_QUOTES`**, las comillas dobles son un **identificador** y el motor corta
> con `Unknown column 'rango de precios' in 'field list'`.
>
> Forma correcta en MySQL: el alias **detrás**, con `AS`, como en el slide 3:
> `` CASE … END AS `rango de precios` `` (backticks porque tiene espacios). **Verificar en clase cuál
> se acepta en el TP.**

## Slide 6 · CASE en SQL — signo del total

```sql
SELECT total,
CASE
  WHEN total <0 THEN  'negativo'
  WHEN total >=0 THEN  'positivo'
END
FROM  `ventas`
```

Mismo título que el slide 5 y, otra vez, solo la consulta. Tres diferencias: **no le pone alias**
al resultado, **no tiene `ELSE`** y escribe la tabla con **backticks de MySQL** (`` FROM `ventas` ``)
donde el 5 escribía `FROM productos`.

> [!warning] Sin `ELSE`, un `CASE` que no matchea devuelve `NULL` **(propio)**
> `total < 0` y `total >= 0` parecen cubrir todo, pero **no cubren `total IS NULL`**: comparar `NULL`
> da *unknown*, ningún `WHEN` matchea y, sin `ELSE`, el `CASE` devuelve `NULL`. Una venta con `total`
> nulo sale sin etiqueta. Además, sin alias **la columna se llama con el texto entero del `CASE`**;
> el slide 3 ya dio la herramienta y este slide no la usa.

## Slide 7 · Sentencia LIKE

> *"Se utiliza para realizar búsquedas en cadenas de texto"*

Los cinco ejemplos del slide, textuales:

| Patrón | Qué busca *(texto del slide)* |
| --- | --- |
| `LIKE 'Garcia%'` | *"busca cadenas que comiencen Garcia"* |
| `LIKE 'A[nm]%'` | *"busca cadenas que comiencen con 'An' o 'Am'"* |
| `LIKE '[-acfi]%'` | *"busca cadenas que comiencen con -,a,c,f ó i"* |
| `LIKE '%Garcia'` | *"busca cadenas que terminan con Garcia"* |
| `LIKE '%G%'` | *"busca cadenas que tienen una letra G en cualquier parte del texto"* |

El slide no define `%`. **(propio)** `%` matchea **cualquier cantidad de caracteres, incluida
ninguna**; al final = "empieza con", al principio = "termina con", de los dos lados = "contiene".

> [!bug] Los corchetes `[nm]` **no funcionan en MySQL**
> `[…]` como clase de caracteres es una extensión de **SQL Server / MS Access**. En **MySQL el `LIKE`
> solo conoce `%` y `_`**; todo lo demás se compara **literalmente**: `LIKE 'A[nm]%'` busca cadenas
> que empiecen con los cinco caracteres `A[nm]` y **no devuelve nada**; `LIKE '[-acfi]%'` busca el
> texto literal `[-acfi]`.
>
> **Equivalente en MySQL**: `REGEXP` (sinónimo: `RLIKE`), donde `^` ancla al inicio:
>
> ```sql
> WHERE apellido REGEXP '^A[nm]'  -- las que empiezan con An o Am
> WHERE apellido REGEXP '^[-acfi]'  -- las que empiezan con -, a, c, f o i
> ```
>
> En **PostgreSQL** tampoco andan: van con `SIMILAR TO` o con el operador `~`. **Verificar en clase
> si los ejercicios usan corchetes.**

> [!missing] El deck no menciona el otro comodín **(propio)**
> `_` matchea **exactamente un carácter** (`LIKE 'G_rcia'` matchea `Garcia` y `Gorcia`, no `Grcia`).
> Tampoco aparece `ESCAPE`, la forma de buscar un `%` o un `_` literales.

## Slide 8 · Sentencia IN

> *"La sentencia IN sirve para comparar un campo con un conjunto de datos"*

```sql
SELECT * FROM personas WHERE dni IN(30,40,50)
```

```sql
SELECT *
FROM productos
WHERE nombre IN('Fernet','Coca Cola','Hielo')
```

Un ejemplo con conjunto numérico y otro con cadenas. **(propio)** `IN` es la forma compacta de una
cadena de `OR`: el segundo equivale a
`WHERE nombre = 'Fernet' OR nombre = 'Coca Cola' OR nombre = 'Hielo'`.

> [!warning] `NOT IN` con `NULL` en la lista no devuelve nada **(propio)**
> `campo NOT IN (1, 2, NULL)` devuelve **cero filas siempre**: la comparación con `NULL` da *unknown*
> y nunca llega a ser verdadera. Con `IN` a secas el `NULL` simplemente nunca matchea. Es el error
> clásico cuando la lista del `IN` viene de una subconsulta.

## Slide 9 · Sentencia TOP

> *"La sentencia TOP sirve para limitar las filas de los resultados de una consulta"*

```sql
SELECT top 3 nombre, apellido
FROM personas
ORDER BY nombre
```

```sql
SELECT top 3 *
FROM personas
ORDER BY nombre
```

`top N` va **pegado al `SELECT`, antes de la lista de columnas**; los dos ejemplos difieren solo en
lista explícita vs. `*`, y ambos llevan `ORDER BY nombre`. **(propio)** Sin `ORDER BY`, "las
primeras 3" son 3 filas arbitrarias: una tabla no tiene orden garantizado.

> [!bug] `TOP` **no existe en MySQL**
> Es sintaxis de **SQL Server (T-SQL)** y de **MS Access**. En MySQL **no compila**: `top` no es
> palabra reservada, el parser lo lee como **una columna llamada `top`** y corta con error de
> sintaxis en el `3`.
>
> **Equivalente exacto en MySQL**: el `LIMIT` del slide siguiente, al **final** de la consulta:
>
> ```sql
> SELECT nombre, apellido
> FROM personas
> ORDER BY nombre
> LIMIT 3
> ```
>
> En **PostgreSQL** también es `LIMIT` (o el `FETCH FIRST 3 ROWS ONLY` del estándar). Los slides 9 y
> 10 son **la misma cosa en dos motores**, presentada como dos cláusulas sin decirlo; para la cursada
> **la que importa es `LIMIT`**.

## Slide 10 · Sentencia LIMIT

> *"Limita la cantidad de filas de una consulta"*

```sql
SELECT *
FROM  `ventas`
ORDER BY  `fecha`
LIMIT 0 , 30
```

`LIMIT` va **al final de la consulta**, después del `ORDER BY`. El slide muestra solo
`LIMIT 0 , 30`, sin explicar cada número. **(propio)** La forma es `LIMIT offset , cantidad`; solo la
primera fila es el ejemplo del slide:

| Escrito | Offset | Cantidad | Qué devuelve |
| --- | --- | --- | --- |
| `LIMIT 0 , 30` | 0 | 30 | filas 1 a 30 |
| `LIMIT 30 , 30` | 30 | 30 | filas 31 a 60 |
| `LIMIT 30` | 0 *(implícito)* | 30 | filas 1 a 30 |

> [!important] Primero el offset, después la cantidad **(propio)**
> `LIMIT 0 , 30` **no** significa "de la 0 a la 30": significa "saltear 0 filas y devolver 30". Es la
> forma canónica de **paginar**. La forma con coma es **específica de MySQL** (y MariaDB); la
> **portable**, que MySQL también acepta, es `LIMIT 30 OFFSET 0`, y **PostgreSQL solo acepta esta
> segunda**.
>
> **Sospecha, no confirmada:** los backticks de `` `ventas` `` y `` `fecha` `` más los espacios
> alrededor de la coma son el estilo con el que **phpMyAdmin** genera sus consultas, así que el
> ejemplo parece copiado de ahí. El deck no lo dice. **A confirmar en clase.**

## Slides 11–13 · Manejo de fechas — `DAY`, `MONTH`, `YEAR`

Tres slides con la misma estructura: función, definición de una línea (las tres dicen **entero**) y
un ejemplo sobre `` `ventas` `` que pone la función **junto a la columna `fecha` original**, útil para
verificar a ojo qué extrajo.

| Slide | Función | Definición del slide | Ejemplo |
| --- | --- | --- | --- |
| 11 | `DAY (date)` | *"Devuelve un entero que representa el día de la fecha especificada."* | ``SELECT DAY( fecha ), fecha FROM `ventas` `` |
| 12 | `MONTH (date)` | *"Devuelve un entero que representa el mes de la fecha especificada."* | ``SELECT MONTH( fecha ), fecha FROM `ventas` `` |
| 13 | `YEAR (date)` | *"Devuelve un entero que representa el **mes** de la fecha especificada."* | ``SELECT YEAR( fecha ), fecha FROM `ventas` `` |

> [!bug] El slide 13 dice "mes" donde debería decir "año"
> Textual: *"YEAR (date) — Devuelve un entero que representa el **mes** de la fecha especificada."*
> Copy-paste del slide 12 sin corregir: `YEAR` devuelve el **año** (p. ej. `2026`). Se transcribe
> tal cual; no hay ambigüedad real.

> [!note] Compatibilidad **(propio)**
> `DAY()`, `MONTH()` y `YEAR()` **sí existen en MySQL** (y en SQL Server): son los únicos slides de
> fechas que corren tal cual en la cursada. En MySQL `DAY()` es sinónimo de `DAYOFMONTH()`.
> **PostgreSQL no las tiene**: ahí es `EXTRACT(DAY FROM fecha)`.

## Slide 14 · Manejo de fechas — `DATEPART`

```
DATEPART(partedefecha,fecha)
```

> *"Retorna la parte específica de una fecha, el año, trimestre, día, hora, etc."*
> *"Los valores para "partedefecha" pueden ser: year (año), quarter (cuarto), month (mes), day (dia),
> week (semana), hour (hora), minute (minuto), second (segundo) y millisecond (milisegundo)."*

Nueve valores admitidos; el slide traduce `quarter` como **cuarto** dos líneas después de llamarlo
*trimestre*.

Los tres ejemplos con su anotación, que en el slide va **en texto plano** al costado, no como
comentario SQL: el `--` lo agrega esta página. No hay punto y coma en ninguna línea.

```sql
SELECT datepart(month,getdate())  -- retorna el mes actual
SELECT datepart(day,getdate())  -- retorna el día actual
SELECT datepart(hour,getdate())  -- retorna la hora actual
```

**(propio)** `getdate()` no se define, solo se usa: es la fecha y hora **del momento en que corre la
consulta**. La firma admite una columna en el segundo argumento, pero **el deck no da ningún ejemplo
sobre una columna**.

> [!bug] `DATEPART` y `GETDATE()` **no existen en MySQL**
> Las dos son de **SQL Server**: `SELECT datepart(month, getdate())` falla con
> `FUNCTION …datepart does not exist`.
>
> **Equivalentes en MySQL:**
>
> | Slide (T-SQL) | MySQL |
> | --- | --- |
> | `getdate()` | `NOW()` — fecha y hora · `CURDATE()` — solo la fecha |
> | `datepart(month, X)` | `MONTH(X)` o `EXTRACT(MONTH FROM X)` |
> | `datepart(day, X)` | `DAY(X)` o `EXTRACT(DAY FROM X)` |
> | `datepart(hour, X)` | `HOUR(X)` o `EXTRACT(HOUR FROM X)` |
> | `datepart(quarter, X)` | `QUARTER(X)` |
> | `datepart(week, X)` | `WEEK(X)` |
>
> La genérica de MySQL es **`EXTRACT(unidad FROM fecha)`**, también la del estándar SQL y de
> PostgreSQL. **La unidad no va entre comillas ni es un argumento**: va con `FROM` adentro del
> paréntesis.

## Slide 15 · Manejo de fechas — `DATENAME`

```
DATENAME (partedefecha,fecha)
```

> *"Retorna el nombre de una parte específica de una fecha."*
> *"Los valores para "partedefecha" pueden ser los mismos que se explicaron anteriormente"*

```sql
SELECT datename(month,getdate())  -- retorna el nombre del mes actual
```

Un solo ejemplo, con la anotación en texto plano al costado como en el slide 14. **(propio)** La
diferencia con `DATEPART` es **entero vs. texto**: para agosto, `DATEPART` devuelve `8` y `DATENAME`
devuelve `August` o `Agosto` según el idioma del servidor. El slide no muestra ningún valor devuelto.

> [!bug] `DATENAME` tampoco existe en MySQL
> **Equivalentes en MySQL:** no hay una función genérica, hay una por parte: **`MONTHNAME(fecha)`**
> para el nombre del mes y **`DAYNAME(fecha)`** para el del día de la semana. Las demás partes (año,
> hora) no tienen "nombre", así que la generalidad de `DATENAME` no tiene contrapartida directa.

## Slide 16 · Manejo de fechas — `DATEDIFF`

```
DATEDIFF (partedelafecha,fecha1,fecha2)
```

> *"Calcula el intervalo de tiempo (según el primer argumento) entre las 2 fechas. El resultado es un
> valor entero que corresponde a **fecha2-fecha1**. Los valores de "partedelafecha" pueden ser los
> mismos que se especificaron anteriormente."*

Los dos ejemplos con su resultado; en el deck el *"retorna…"* va en la línea de abajo, en texto
plano, y el `--` lo agrega esta página. El **primer ejemplo lleva un espacio entre `datediff` y el
paréntesis y el segundo no**: así está en el slide.

```sql
SELECT datediff (day,'2005/10/28','2006/10/28')
-- retorna 365 (días)

SELECT datediff(month,'2005/10/28','2006/11/29')
-- retorna 13 (meses)
```

**El orden importa:** el resultado *"corresponde a fecha2-fecha1"*, textual del slide. **(propio)**
Por eso la fecha más nueva va segunda; al revés da negativo. Los resultados cierran: 365 días porque
el tramo 2005→2006 no incluye ningún 29 de febrero, y 13 cambios de mes entre octubre de 2005 y
noviembre de 2006. Las fechas van con **barras** (`'2005/10/28'`), no con guiones: así están en el
slide.

> [!bug] `DATEDIFF` **existe en MySQL pero es otra función**
> El caso más traicionero del deck: el nombre coincide y el comportamiento no.
>
> | | T-SQL *(el del slide)* | **MySQL** |
> | --- | --- | --- |
> | **Argumentos** | 3 — `(unidad, f1, f2)` | **2 — `(f1, f2)`** |
> | **Unidad** | la que se pida | **siempre días** |
> | **Cuenta** | `f2 − f1` | **`f1 − f2`** ← *orden invertido* |
>
> `DATEDIFF('2005/10/28','2006/10/28')` en MySQL devuelve **−365**; para obtener 365 hay que escribir
> `DATEDIFF('2006-10-28','2005-10-28')`.
>
> **Equivalente en MySQL para el ejemplo con unidad:**
>
> ```sql
> SELECT TIMESTAMPDIFF(MONTH, '2005-10-28', '2006-11-29');  -- 13
> SELECT TIMESTAMPDIFF(DAY,  '2005-10-28', '2006-10-28');  -- 365
> ```
>
> `TIMESTAMPDIFF(unidad, f1, f2)` acepta unidad **y** cuenta `f2 − f1`, como el `DATEDIFF` del slide:
> es el reemplazo uno a uno. **Verificar en clase cuál se espera en el TP**: `DATEDIFF(day, …)` en
> MySQL da error y `DATEDIFF(f1, f2)` da el signo cambiado.

---

## Tabla resumen

**Motor**: dónde corre tal como está escrito en el deck; **En MySQL**: qué escribir en la cursada.

| Slide | Cláusula / función | Para qué | Ejemplo del deck | Motor | En MySQL |
| --- | --- | --- | --- | --- | --- |
| 1 | `/* … */` | Comentar / desactivar una cláusula | `/* WHERE apellido = 'Maradona'*/` | todos | igual · también `-- ` y `#` |
| 2 | `CONCAT(a, b, …)` | Unir campos en una sola columna | `CONCAT(apellido, ' ', nombre)` | MySQL · SQL Server | igual · `NULL` contagia → `CONCAT_WS` |
| 3 | `AS` *(columna)* | Renombrar una columna del resultado | `sum(importe * cantidad) AS total` | todos | igual · `AS` opcional |
| 3 | `AS` *(tabla)* | Abreviar el nombre de la tabla | `FROM personas AS p` / `FROM personas p` | todos | igual |
| 4 | `DISTINCT` | Eliminar filas duplicadas | `SELECT distinct(autor) FROM libros` | todos | igual · sin paréntesis |
| 5–6 | `CASE … WHEN … END` | Clasificar valores en el `SELECT` | `WHEN precio < 50 THEN 'menor a 50'` | todos | igual · **el alias va con `AS` al final** |
| 7 | `LIKE '…%'` | Búsqueda por patrón en texto | `LIKE 'Garcia%'` | todos | igual |
| 7 | `LIKE '…[nm]…'` | Clase de caracteres | `LIKE 'A[nm]%'` | **T-SQL** | ✗ → `REGEXP '^A[nm]'` |
| 8 | `IN(…)` | Comparar contra un conjunto | `WHERE dni IN(30,40,50)` | todos | igual |
| 9 | `TOP n` | Limitar filas *(al principio)* | `SELECT top 3 nombre, apellido` | **T-SQL** | ✗ → `LIMIT 3` al final |
| 10 | `LIMIT o , c` | Limitar filas *(al final)* | `LIMIT 0 , 30` | **MySQL** | igual · portable: `LIMIT 30 OFFSET 0` |
| 11 | `DAY(f)` | Día del mes, como entero | `SELECT DAY( fecha ), fecha` | MySQL · SQL Server | igual |
| 12 | `MONTH(f)` | Mes, como entero | `SELECT MONTH( fecha ), fecha` | MySQL · SQL Server | igual |
| 13 | `YEAR(f)` | Año, como entero | `SELECT YEAR( fecha ), fecha` | MySQL · SQL Server | igual |
| 14 | `DATEPART(p, f)` | Cualquier parte, como entero | `datepart(month,getdate())` | **T-SQL** | ✗ → `EXTRACT(MONTH FROM NOW())` |
| 15 | `DATENAME(p, f)` | Nombre de la parte, como texto | `datename(month,getdate())` | **T-SQL** | ✗ → `MONTHNAME()` / `DAYNAME()` |
| 16 | `DATEDIFF(p, f1, f2)` | Diferencia entre dos fechas | `datediff(day,'2005/10/28','2006/10/28')` | **T-SQL** | (atención) existe pero cambia → `TIMESTAMPDIFF` |
| 14–16 | `getdate()` | Fecha y hora actuales | `getdate()` | **T-SQL** | ✗ → `NOW()` / `CURDATE()` |

## Traducción a MySQL

Lo que **no se puede copiar tal cual** al TP:

| # | Slide | Lo que dice el deck | Lo que hay que escribir en MySQL |
| --- | --- | --- | --- |
| 1 | 5 | `SELECT producto, "rango de precios" = CASE … END` | ``SELECT producto, CASE … END AS `rango de precios` `` |
| 2 | 7 | `LIKE 'A[nm]%'` | `REGEXP '^A[nm]'` |
| 3 | 9 | `SELECT top 3 * FROM personas ORDER BY nombre` | `SELECT * FROM personas ORDER BY nombre LIMIT 3` |
| 4 | 14–15 | `datepart(month, getdate())` · `datename(month, getdate())` | `EXTRACT(MONTH FROM NOW())` · `MONTHNAME(NOW())` |
| 5 | 16 | `datediff(day, f1, f2)` | `TIMESTAMPDIFF(DAY, f1, f2)` |

> [!important] Qué llevarse de esto al parcial
> El deck **no es una referencia de MySQL**: es una recopilación de sintaxis de varios motores. Lo que
> sí es cierto y portable es el **concepto** de cada cláusula — filtrar por patrón, recortar filas,
> extraer partes de una fecha, clasificar con `CASE`. La sintaxis concreta hay que fijarla contra el
> motor con el que se corrige, y ese es **MySQL** según [[_cronograma]].

## Dudas abiertas

- [ ] ¿Con qué motor se corrigen los TPs de esta clase? Si aceptan `TOP` o `DATEPART`, hay algo más
  que no cuadra.
- [ ] ¿Dónde están `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`, `GROUP BY` y `HAVING`? Buscarlos en la
  [[Clase 05 - Consultas de Datos–Parte 1|Parte 1]] y la
  [[Clase 05 - Consultas de Datos–Parte 2|Parte 2]].
- [ ] `COUNT(*)` vs. `COUNT(columna)` y el `NULL` en las agregaciones: tema clásico de parcial,
  resolver contra bibliografía.
- [ ] ¿El `"alias" = expresión` del slide 5 se acepta en la corrección?
- [ ] ¿Los ejercicios de `LIKE` usan corchetes `[…]`?
- [ ] `LIKE '%G%'`: ¿es *case-sensitive*? Depende del *collation*; con `_ci` por defecto, no.
- [ ] ¿El slide 13 (`YEAR` como "mes") es un tipeo confirmado?
- [ ] ¿`quarter` es "cuarto" o "trimestre"? El slide 14 usa las dos.

## Enlaces

- Esta clase, partes anteriores: [[Clase 05 - Consultas de Datos–Parte 1]] · [[Clase 05 - Consultas de Datos–Parte 2]]
- Clase anterior: [[Clase 04 - AlteraciónActualizaciónTablas]] · clase siguiente: [[Clase 06 - Vistas-Parte 1]]
- Práctica correspondiente: [[Práctica 2026-08-04]]
- Motor de la cursada: [[MySQL]] · dialecto ajeno que aparece acá: [[SQL Server (T-SQL)]]
- Conceptos: [[Funciones de fecha en SQL]] · [[Dialectos de SQL]] · [[1.05.01 - SQL — consultas|NULL en SQL]]
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
