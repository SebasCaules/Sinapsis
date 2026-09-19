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

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 3.pdf` · **16 slides**
> Dictado el **lunes 03/08**, de forma **asincrónica**. Tercera y última parte de la **Clase 05**,
> que es una sola clase repartida en tres archivos (`Parte 1`, `Parte 2`, `Parte 3`).
> El `05` del nombre del archivo **es el número de clase**: la numeración de la cátedra
> (`BD2_Clase NN` → Clase NN) es la única que vale → mapa completo en [[_index-clases]].
> Parte anterior: [[Clase 05 - Consultas de Datos–Parte 2]] · clase siguiente: [[Clase 06 - Vistas-Parte 1]].
> Bibliografía: [[_index-bibliografia]].
>
> El deck **no tiene slide de título ni de cierre**: los 16 slides son 16 fichas de sintaxis. No hay
> una por cláusula: el título **`CASE en SQL` se repite en los slides 5 y 6** y el título
> **`Manejo de fechas` se repite en los slides 11 a 16** (seis slides, una función cada uno). Casi
> todos con el mismo formato — título azul oscuro, fondo celeste, la definición en una o dos líneas y
> abajo el ejemplo; la excepción son los slides **5 y 6, que no traen definición** y arrancan directo
> con la consulta.
> **No hay diagramas, capturas de pantalla ni salidas de consola en ningún slide.** Lo único parecido
> a un resultado son las **anotaciones en texto plano al costado de los ejemplos** de los slides 14,
> 15 y 16 (*"retorna el mes actual"*, *"retorna 365 (días)"*).

> [!missing] Este deck **no** cubre funciones de agregación
> A pesar de ser la parte 3 de "Consultas de Datos", acá **no aparecen `SUM`, `COUNT`, `AVG`, `MIN`,
> `MAX`, `GROUP BY` ni `HAVING`**. La única función de agregación que se ve en todo el deck es el
> `sum(importe * cantidad)` del slide 3, y está ahí de relleno para ilustrar el **alias de columna**,
> no para explicar `SUM`. Si la Clase 05 las trata, están en la **Parte 1** o en la
> [[Clase 05 - Consultas de Datos–Parte 2|Parte 2]] — verificar ahí antes del parcial.

---

## Resumen

Dieciséis fichas de sintaxis SQL, sin hilo conductor más allá del orden: primero **cosmética del
`SELECT`** (comentarios, concatenación, alias), después **deduplicar, clasificar, filtrar y recortar
el resultado** (`DISTINCT`, `CASE`, `LIKE`, `IN`, `TOP`, `LIMIT`) y al final **seis funciones de
fecha** (`DAY`, `MONTH`, `YEAR`, `DATEPART`, `DATENAME`, `DATEDIFF`), más `getdate()` que aparece de
apoyo en los ejemplos sin ficha propia.

| Slide | Tema | Palabra clave | Dialecto real |
| --- | --- | --- | --- |
| 1 | Comentarios en SQL | `/* … */` | portable |
| 2 | Concatenar campos | `CONCAT()` | MySQL / SQL Server |
| 3 | Alias de columna **y** de tabla | `AS` | portable |
| 4 | Sentencia DISTINCT | `DISTINCT` | portable |
| 5 | CASE en SQL — rangos de precio | `CASE … WHEN … END` | **T-SQL** (el alias) |
| 6 | CASE en SQL — signo del total | `CASE … WHEN … END` | **MySQL** (los backticks) |
| 7 | Sentencia LIKE | `LIKE '…%'`, `[nm]` | **T-SQL** (los corchetes) |
| 8 | Sentencia IN | `IN(…)` | portable |
| 9 | Sentencia TOP | `SELECT top 3 …` | **T-SQL / Access** |
| 10 | Sentencia LIMIT | `LIMIT 0 , 30` | **MySQL** |
| 11 | Manejo de fechas — día | `DAY(date)` | MySQL / SQL Server |
| 12 | Manejo de fechas — mes | `MONTH(date)` | MySQL / SQL Server |
| 13 | Manejo de fechas — año | `YEAR(date)` | MySQL / SQL Server |
| 14 | Manejo de fechas — parte genérica | `DATEPART(parte, fecha)` | **T-SQL** |
| 15 | Manejo de fechas — nombre de la parte | `DATENAME(parte, fecha)` | **T-SQL** |
| 16 | Manejo de fechas — diferencia | `DATEDIFF(parte, f1, f2)` | **T-SQL** |

> [!warning] El deck es un **patchwork de dialectos**, y el problema no es PostgreSQL
> El punto abierto conocido del vault es que `BD2_Clase 04` está escrito en **PostgreSQL** mientras la
> cursada corre sobre **MySQL**. **Este deck tiene otro problema, distinto:** mezcla **T-SQL
> (SQL Server)** con **MySQL**, a veces en slides consecutivos.
>
> - **Slides 9 y 10** presentan `TOP` y `LIMIT` uno detrás del otro **sin decir que son de motores
>   distintos y mutuamente excluyentes**. `TOP` **no existe en MySQL**.
> - **Slides 14, 15 y 16** (`DATEPART`, `DATENAME`, `DATEDIFF` con 3 argumentos, `getdate()` — el deck
>   lo escribe siempre en minúsculas) son
>   funciones **de SQL Server**. **Ninguna de las tres corre en MySQL tal como está escrita.**
> - **Slide 7**: los corchetes `[nm]` de `LIKE` son de SQL Server; **MySQL los toma como caracteres
>   literales**.
> - **Slide 5**: `"alias" = expresión` es la sintaxis de alias de T-SQL. En MySQL se lee como una
>   **comparación**, no como un alias.
> - Al mismo tiempo, **slides 6, 10, 11, 12 y 13** usan **backticks** (`` `ventas` ``, `` `fecha` ``)
>   que son exclusivamente **MySQL**, y el slide 10 usa `LIMIT o , c`, que también lo es.
>
> El detalle de qué reemplaza a qué está en [[#Traducción a MySQL]] al final de la página.
> **Confirmar en clase con qué motor se corrigen los TPs de esta clase.**

> [!bug] Comillas tipográficas copiadas de PowerPoint
> Varios ejemplos traen **comillas curvas** (`‘ ’`) en vez de apóstrofos rectos (`'`), y en el slide 7
> están **mezcladas dentro del mismo patrón**. Tal cual salen del PDF: slide 1 (`‘Maradona’`), slide 7
> (`'Garcia%‘` ← abre recta y cierra curva · `‘%Garcia‘` · `‘%G%‘`, mientras que `'A[nm]%'` y
> `'[-acfi]%'` sí llevan rectas las dos) y slide 8 (`IN(‘Fernet’,’Coca Cola’,’Hielo’)`).
> En los bloques de código de esta página están **normalizadas a `'` recta** para que se puedan
> copiar. **Copiadas y pegadas tal cual del deck en un cliente MySQL fallan**
> con error de sintaxis: hay que reescribirlas con `'`. Es un artefacto del deck, no sintaxis.

---

## Slide 1 · Comentarios en SQL

> *"/\* sirve para realizar comentarios en SQL \*/"*

```sql
SELECT *
FROM personas
/* WHERE apellido = 'Maradona'*/
```

El único uso que muestra el deck es **comentar una cláusula para desactivarla**: la consulta corre
como `SELECT * FROM personas` sin filtro, porque el `WHERE` quedó adentro del comentario.

**Razonamiento propio, no está en el deck:** el deck solo enseña el comentario de bloque
`/* … */`. MySQL soporta además dos comentarios de **una línea**: `-- ` (guión-guión **seguido de un
espacio**, obligatorio en MySQL) y `#`. El de bloque es el único de los tres que es portable a todos
los motores.

## Slide 2 · Concatenar campos

Dos consultas contrapuestas, sin texto explicativo más que el título:

```sql
SELECT apellido, nombre
FROM personas
```

```sql
SELECT CONCAT(apellido, ' ', nombre)
FROM personas
```

La diferencia es **cuántas columnas devuelve el resultado**: la primera devuelve **dos** columnas
(`apellido` y `nombre`), la segunda devuelve **una sola** con los dos valores pegados y un espacio en
el medio. El `' '` del medio es un **literal**.

**Razonamiento propio, no está en el deck:** sin ese literal, `CONCAT(apellido, nombre)` pegaría los
dos valores sin separador — `MaradonaDiego`. El deck no muestra ni ese caso ni ningún dato de
ejemplo de la tabla `personas`.

> [!warning] Dos cosas que el slide no dice
> **Razonamiento propio, no está en el deck:**
> 1. **`CONCAT` en MySQL devuelve `NULL` si *cualquiera* de sus argumentos es `NULL`.** Si `nombre`
>    está vacío en el sentido de `NULL`, la fila entera sale `NULL`, no sale el apellido solo. Para
>    saltear los `NULL` está `CONCAT_WS(' ', apellido, nombre)`, que además pone el separador una sola
>    vez.
> 2. La columna resultante **se llama `CONCAT(apellido, ' ', nombre)`** — el texto entero de la
>    expresión. Por eso el slide siguiente es el de los alias: van juntos en la práctica.
>
> El operador de concatenación del **estándar SQL** es `||` (y es el que usa PostgreSQL). En **MySQL
> `||` significa OR lógico** por defecto, así que `apellido || nombre` **no concatena**: devuelve 0 o
> 1. Por eso el deck usa `CONCAT`, que es lo correcto para MySQL.

## Slide 3 · Alias de una columna y alias de una tabla

Un solo slide con **dos títulos**, uno arriba del otro.

**Alias de una columna:**

> *"La sentencia AS sirve para cambiarle el nombre de los resultados de una columna."*

```sql
SELECT sum(importe * cantidad) AS total
```

> [!note] El ejemplo está incompleto en el slide
> Tal cual figura, la consulta **no tiene `FROM`** ni menciona de qué tabla salen `importe` y
> `cantidad`: es un fragmento ilustrativo, no una consulta ejecutable.
> **Razonamiento propio, no está en el deck:** completa sería algo como
> `SELECT sum(importe * cantidad) AS total FROM ventas` — la tabla es una suposición, el slide no la
> nombra.

**Alias de una tabla:**

> *"Un alias de tabla se puede asignar con o sin la palabra clave AS."*

```sql
SELECT * FROM personas AS p
SELECT * FROM personas p
```

| | Con `AS` | Sin `AS` |
| --- | --- | --- |
| **Columna** | `SELECT sum(importe * cantidad) AS total` | *el deck no lo menciona* |
| **Tabla** | `SELECT * FROM personas AS p` | `SELECT * FROM personas p` |

> [!tip] Para qué sirve realmente el alias de tabla
> **Razonamiento propio, no está en el deck:** el slide lo presenta como una abreviatura cosmética,
> pero el alias de tabla es **obligatorio** en dos casos: cuando una consulta hace **join de una tabla
> consigo misma** (hay que distinguir las dos copias) y cuando hay **subconsultas** que necesitan
> referirse a la tabla externa. Eso se ve en la [[Clase 05 - Consultas de Datos–Parte 2|Parte 2]], que es
> donde entran los joins y las subconsultas.
>
> Además, el `AS` de columna **también es opcional en MySQL** (`SELECT sum(x) total` funciona), aunque
> el slide solo diga que lo es para tablas.

## Slide 4 · Sentencia DISTINCT

> *"Con la cláusula "distinct" se especifica que los registros con ciertos datos duplicados sean
> obviadas en el resultado."*

```sql
SELECT autor FROM libros
```

```sql
SELECT distinct(autor) FROM libros
```

El slide contrapone las dos consultas y no dice nada más.

**Razonamiento propio, no está en el deck:** la primera devuelve **una fila por libro** (con el autor
repetido tantas veces como libros tenga); la segunda, **una fila por autor distinto**.

> [!warning] `DISTINCT` es una cláusula, no una función — los paréntesis engañan
> **Razonamiento propio, no está en el deck:** escrito `distinct(autor)` parece una función que se
> aplica a una columna, pero **`DISTINCT` se aplica a *toda* la lista del `SELECT`**. Los paréntesis
> son solo agrupación de la expresión `autor` y no cambian nada mientras haya una única columna.
>
> Con dos columnas la ilusión se rompe: `SELECT DISTINCT(autor), titulo FROM libros` **no** devuelve
> un autor por fila — deduplica por el **par** `(autor, titulo)`, y como el título es distinto en cada
> libro, no elimina nada. Costumbre segura: escribir `SELECT DISTINCT autor FROM libros`, sin
> paréntesis, que es lo que realmente significa.

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

El slide es **solo la consulta**: no tiene ni una línea de explicación, ni define `CASE`, ni nombra
`WHEN`, `THEN` o `ELSE`.

**Razonamiento propio, no está en el deck:** es un `CASE` **de búsqueda** (cada `WHEN` lleva una
condición completa, no un valor a comparar). Las condiciones se evalúan **en orden** y **gana la
primera que da verdadera**: por eso `WHEN precio < 50` puede ir después de `WHEN precio = 0` sin
pisarlo — cuando llega ahí, ya se sabe que el precio no es 0. El `ELSE` es la red que atrapa todo lo
que no matcheó ningún `WHEN`. La tabla que sigue es esa evaluación aplicada a valores inventados; el
slide no da ninguno:

| `precio` | Rama que gana | Valor devuelto |
| --- | --- | --- |
| `0` | 1ª | `'Producto free'` |
| `10` | 2ª | `'menor a 50'` |
| `50` | 3ª | `'entre 50 y 250'` |
| `250` | 4ª | `'entre 250 y 1000'` |
| `1000` | `ELSE` | `'mayor a 1000'` |
| `-5` | 2ª | `'menor a 50'` ← ver abajo |

> [!bug] `"rango de precios" =` es sintaxis de **SQL Server**, y en MySQL hace otra cosa
> El slide asigna el alias con `"alias" = expresión`, que es la forma de T-SQL. En MySQL:
>
> - **Con la configuración por defecto**, las comillas dobles delimitan una **cadena**, así que
>   `"rango de precios" = CASE … END` se lee como una **comparación de igualdad** entre el texto
>   `rango de precios` y el resultado del `CASE`. La consulta corre, pero devuelve una columna de
>   **`0`** (falso) llamada literalmente `"rango de precios" = CASE…END`, no las etiquetas.
> - **Con `sql_mode = ANSI_QUOTES`**, las comillas dobles pasan a ser un **identificador** y el motor
>   corta con `Unknown column 'rango de precios' in 'field list'`.
>
> Forma correcta en MySQL: poner el alias **detrás**, con `AS`, como enseña el slide 3 —
> `` CASE … END AS `rango de precios` `` (backticks porque el alias tiene espacios).
> **Verificar en clase cuál se acepta en el TP.**

> [!note] Dos bordes que el slide deja pasar — razonamiento propio
> - **`precio = 1000` cae en el `ELSE`** y se etiqueta `'mayor a 1000'`, aunque no sea mayor a 1000
>   sino igual. La escalera de rangos deja ese único valor mal rotulado.
> - **Un precio negativo** cae en `WHEN precio < 50` y sale como `'menor a 50'`, que técnicamente es
>   cierto pero probablemente no era la intención.

## Slide 6 · CASE en SQL — signo del total

```sql
SELECT total,
CASE
    WHEN total <0 THEN  'negativo'
    WHEN total >=0 THEN  'positivo'
END
FROM  `ventas`
```

Segundo slide con el mismo título (`CASE en SQL`) y, otra vez, **sin una sola línea de texto**: solo
la consulta. Tres diferencias con el slide 5 que conviene registrar:

| | Slide 5 | Slide 6 |
| --- | --- | --- |
| **Alias del resultado** | intenta ponerlo (`"rango de precios" =`) | **no le pone alias** |
| **`ELSE`** | sí | **no** |
| **Quoting de la tabla** | `FROM productos` | `` FROM `ventas` `` ← **backticks de MySQL** |

> [!warning] Sin `ELSE`, un `CASE` que no matchea devuelve `NULL`
> **Razonamiento propio, no está en el deck:** las dos condiciones `total < 0` y `total >= 0` parecen
> cubrir todos los casos, pero **no cubren `total IS NULL`**: comparar `NULL` con cualquier cosa da
> *unknown*, no verdadero, así que **ninguno de los dos `WHEN` matchea** y el `CASE` — al no tener
> `ELSE` — devuelve `NULL`. Una venta con `total` nulo sale sin etiqueta, ni `'negativo'` ni
> `'positivo'`.
>
> Al no llevar alias, además, **la columna se llama con el texto entero del `CASE`**, que es
> ilegible en el resultado. El slide 3 ya dio la herramienta para arreglarlo y este slide no la usa.

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

El slide arranca con *"Ejemplos:"* y no define en ningún lado qué significa `%`: se deduce de las
cinco descripciones.

**Razonamiento propio, no está en el deck:** `%` matchea **cualquier cantidad de caracteres, incluida
ninguna**, y su posición es todo — al final = "empieza con", al principio = "termina con", de los dos
lados = "contiene". Es exactamente el patrón que muestran los cinco ejemplos.

> [!bug] Los corchetes `[nm]` **no funcionan en MySQL**
> `[…]` como clase de caracteres es una extensión de **SQL Server / MS Access**. En **MySQL el `LIKE`
> solo conoce dos comodines: `%` y `_`** — cualquier otro carácter, corchetes incluidos, se compara
> **literalmente**. O sea que en MySQL:
>
> - `LIKE 'A[nm]%'` busca cadenas que empiecen con la secuencia de cinco caracteres `A[nm]`, no con
>   `An` o `Am`. **No va a devolver nada.**
> - `LIKE '[-acfi]%'` idem: busca el texto literal `[-acfi]`.
>
> **Equivalente en MySQL** — se resuelve con `REGEXP` (sinónimo: `RLIKE`), donde `^` ancla al inicio:
>
> ```sql
> WHERE apellido REGEXP '^A[nm]'      -- las que empiezan con An o Am
> WHERE apellido REGEXP '^[-acfi]'    -- las que empiezan con -, a, c, f o i
> ```
>
> En **PostgreSQL** tampoco andan los corchetes con `LIKE`: van con `SIMILAR TO` o con el operador
> `~`. **Verificar en clase si los ejercicios usan corchetes.**

> [!missing] El deck **no menciona el otro comodín**
> `_` (guión bajo) matchea **exactamente un carácter**, y es el complemento natural de `%`
> (`LIKE 'G_rcia'` matchea `Garcia` y `Gorcia` pero no `Grcia`). Tampoco aparece la cláusula `ESCAPE`,
> que es la forma de buscar un `%` o un `_` literales. **Razonamiento propio, no está en el deck.**

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

Un ejemplo con **conjunto numérico** y otro con **conjunto de cadenas**. El slide no agrega nada más.

**Razonamiento propio, no está en el deck:** `IN` es la forma compacta de una cadena de `OR` — el
segundo ejemplo equivale a
`WHERE nombre = 'Fernet' OR nombre = 'Coca Cola' OR nombre = 'Hielo'`.

> [!warning] `NOT IN` con `NULL` en la lista no devuelve nada
> **Razonamiento propio, no está en el deck:** si el conjunto contiene un `NULL`,
> `campo NOT IN (1, 2, NULL)` devuelve **cero filas siempre**, porque la comparación con `NULL` da
> *unknown* y nunca llega a ser verdadera. Con `IN` a secas el problema no aparece (el `NULL`
> simplemente nunca matchea). Es el error clásico cuando la lista del `IN` viene de una subconsulta.

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

`top N` va **pegado al `SELECT`, antes de la lista de columnas**, y los dos ejemplos del slide se
diferencian solo en eso: lista explícita de columnas vs. `*`. Los dos llevan `ORDER BY nombre`.

**Razonamiento propio, no está en el deck:** el `ORDER BY` es lo que le da sentido al recorte — sin
él, "las primeras 3" son 3 filas arbitrarias, porque una tabla no tiene orden garantizado. El slide
lo pone en los dos ejemplos pero no lo justifica.

> [!bug] `TOP` **no existe en MySQL**
> Es sintaxis de **SQL Server (T-SQL)** y de **MS Access**. En MySQL la consulta **no compila**: como
> `top` no es palabra reservada, el parser lo lee como **una columna llamada `top`** y espera que lo
> que sigue sea su **alias** — se come el `3` como alias inválido y corta con error de sintaxis ahí.
>
> **Equivalente exacto en MySQL** — es el `LIMIT` del slide siguiente, al **final** de la consulta:
>
> ```sql
> SELECT nombre, apellido
> FROM personas
> ORDER BY nombre
> LIMIT 3
> ```
>
> En **PostgreSQL** también se usa `LIMIT` (o el `FETCH FIRST 3 ROWS ONLY` del estándar).
> **Sospecha razonable, a confirmar en clase:** los slides 9 y 10 son **la misma cosa en dos
> motores**, y el deck los presenta como dos cláusulas distintas sin decirlo. Para la cursada, que
> corre sobre MySQL, **la que importa es `LIMIT`**.

## Slide 10 · Sentencia LIMIT

> *"Limita la cantidad de filas de una consulta"*

```sql
SELECT *
FROM  `ventas`
ORDER BY  `fecha`
LIMIT 0 , 30
```

`LIMIT` va **al final de la consulta**, después del `ORDER BY`. El slide muestra **un solo caso**,
`LIMIT 0 , 30`, y **no explica qué significa cada número**.

**Razonamiento propio, no está en el deck:** con dos argumentos la forma es
`LIMIT offset , cantidad`. Solo la primera fila de esta tabla es el ejemplo del slide; las otras dos
son extrapolación:

| Escrito | Offset | Cantidad | Qué devuelve |
| --- | --- | --- | --- |
| `LIMIT 0 , 30` | 0 | 30 | filas 1 a 30 |
| `LIMIT 30 , 30` | 30 | 30 | filas 31 a 60 |
| `LIMIT 30` | 0 *(implícito)* | 30 | filas 1 a 30 |

> [!important] El orden de los dos números es contraintuitivo
> **Razonamiento propio, no está en el deck:** **primero el offset, después la cantidad** — al revés
> de lo que sugiere leerlo como "límite 0, 30". `LIMIT 0 , 30` **no** significa "de la 0 a la 30":
> significa "salteá 0 filas y devolvé 30". Es la forma canónica de **paginar**.
>
> **Sospecha, no confirmada:** los backticks alrededor de `` `ventas` `` y `` `fecha` `` más los
> espacios alrededor de la coma son el estilo con el que **phpMyAdmin** genera sus consultas, así que
> el ejemplo parece copiado de ahí. **A confirmar en clase**, el deck no lo dice.

> [!warning] La forma con coma es **específica de MySQL**
> **Razonamiento propio, no está en el deck:** `LIMIT offset, cantidad` la entienden MySQL y MariaDB.
> La forma **portable**, que MySQL **también** acepta, es `LIMIT 30 OFFSET 0`. **PostgreSQL solo
> acepta esta segunda.** Si el objetivo es escribir SQL que sobreviva a un cambio de motor, conviene
> `LIMIT … OFFSET …`.

## Slides 11–13 · Manejo de fechas — `DAY`, `MONTH`, `YEAR`

Tres slides con la misma estructura: función, una línea de definición, un ejemplo sobre `` `ventas` ``.

| Slide | Función | Definición del slide | Ejemplo |
| --- | --- | --- | --- |
| 11 | `DAY (date)` | *"Devuelve un entero que representa el día de la fecha especificada."* | ``SELECT DAY( fecha ), fecha FROM `ventas` `` |
| 12 | `MONTH (date)` | *"Devuelve un entero que representa el mes de la fecha especificada."* | ``SELECT MONTH( fecha ), fecha FROM `ventas` `` |
| 13 | `YEAR (date)` | *"Devuelve un entero que representa el **mes** de la fecha especificada."* | ``SELECT YEAR( fecha ), fecha FROM `ventas` `` |

Las tres definiciones del slide dicen **entero**, no texto, y las tres consultas ponen la función
**junto a la columna `fecha` original** en el `SELECT`.

**Razonamiento propio, no está en el deck:** mostrar la función al lado de la columna cruda es un
patrón útil para verificar a ojo qué extrajo cada una; el deck lo hace en los tres slides pero no lo
comenta.

> [!bug] El slide 13 dice "mes" donde debería decir "año"
> Textual: *"YEAR (date) — Devuelve un entero que representa el **mes** de la fecha especificada."*
> Es evidentemente un **copy-paste del slide 12** que quedó sin corregir: `YEAR` devuelve el **año**
> (p. ej. `2026`). Se transcribe tal cual porque así está en el deck, pero **no hay ambigüedad real**.

> [!note] Compatibilidad — razonamiento propio
> `DAY()`, `MONTH()` y `YEAR()` **sí existen en MySQL** (y también en SQL Server), así que estos tres
> slides son los únicos de la sección de fechas que corren tal cual en la cursada. En MySQL `DAY()` es
> sinónimo de `DAYOFMONTH()`. **PostgreSQL no las tiene**: ahí es `EXTRACT(DAY FROM fecha)`.

## Slide 14 · Manejo de fechas — `DATEPART`

```
DATEPART(partedefecha,fecha)
```

> *"Retorna la parte específica de una fecha, el año, trimestre, día, hora, etc."*
> *"Los valores para "partedefecha" pueden ser: year (año), quarter (cuarto), month (mes), day (dia),
> week (semana), hour (hora), minute (minuto), second (segundo) y millisecond (milisegundo)."*

Los nueve valores admitidos de `partedefecha`, tal como los lista el slide:

| Valor | Traducción del slide |
| --- | --- |
| `year` | año |
| `quarter` | **cuarto** ← el mismo slide lo llama *trimestre* dos líneas antes |
| `month` | mes |
| `day` | dia |
| `week` | semana |
| `hour` | hora |
| `minute` | minuto |
| `second` | segundo |
| `millisecond` | milisegundo |

Los tres ejemplos del slide, con la anotación que cada uno lleva a la derecha:

```sql
SELECT datepart(month,getdate())   -- retorna el mes actual
SELECT datepart(day,getdate())     -- retorna el día actual
SELECT datepart(hour,getdate())    -- retorna la hora actual
```

> [!note] Sobre la transcripción
> En el slide esas anotaciones están **en texto plano, al costado de cada consulta**, no como
> comentarios SQL: el `--` lo agrega esta página para que el bloque se pueda copiar entero. Tampoco
> hay punto y coma al final de ninguna línea, ni en el slide ni acá.

**Razonamiento propio, no está en el deck:** el slide no dice qué es `getdate()`, solo lo usa. Es la
fecha y hora **del momento en que corre la consulta**, así que los tres ejemplos muestran `DATEPART`
aplicado a "ahora"; la firma `DATEPART(partedefecha,fecha)` admite igual una columna en el segundo
argumento, pero **el deck no da ningún ejemplo sobre una columna**.

> [!bug] `DATEPART` y `GETDATE()` **no existen en MySQL**
> Las dos son de **SQL Server**. `SELECT datepart(month, getdate())` en MySQL falla con
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
> La función genérica de MySQL es **`EXTRACT(unidad FROM fecha)`**, que es además la del estándar SQL
> y la que usa PostgreSQL. Ojo: **la unidad no va entre comillas y no es un argumento**, va con la
> palabra `FROM` adentro del paréntesis.

## Slide 15 · Manejo de fechas — `DATENAME`

```
DATENAME (partedefecha,fecha)
```

> *"Retorna el nombre de una parte específica de una fecha."*
> *"Los valores para "partedefecha" pueden ser los mismos que se explicaron anteriormente"*

```sql
SELECT datename(month,getdate())   -- retorna el nombre del mes actual
```

El slide trae **un solo ejemplo** y, como el 14, la anotación va en texto plano al costado.

**Razonamiento propio, no está en el deck:** la diferencia con `DATEPART` es **entero vs. texto** —
para agosto, `DATEPART` devuelve `8` y `DATENAME` devuelve `August` o `Agosto` según la configuración
de idioma del servidor. El slide dice *"el nombre"* pero no muestra ningún valor devuelto.

> [!bug] `DATENAME` tampoco existe en MySQL
> **Equivalentes en MySQL:** no hay una función genérica, hay una por parte —
> **`MONTHNAME(fecha)`** para el nombre del mes y **`DAYNAME(fecha)`** para el nombre del día de la
> semana. Las demás partes (año, hora) no tienen "nombre", así que la generalidad de `DATENAME` no
> tiene contrapartida directa.

## Slide 16 · Manejo de fechas — `DATEDIFF`

```
DATEDIFF (partedelafecha,fecha1,fecha2)
```

> *"Calcula el intervalo de tiempo (según el primer argumento) entre las 2 fechas. El resultado es un
> valor entero que corresponde a **fecha2-fecha1**. Los valores de "partedelafecha" pueden ser los
> mismos que se especificaron anteriormente."*

Los dos ejemplos con su resultado, tal como los da el slide — en el deck el *"retorna…"* va en la
línea de abajo, en texto plano; el `--` lo agrega esta página. Notar que el **primer ejemplo lleva un
espacio entre `datediff` y el paréntesis y el segundo no**: así está en el slide.

```sql
SELECT datediff (day,'2005/10/28','2006/10/28')
-- retorna 365 (días)

SELECT datediff(month,'2005/10/28','2006/11/29')
-- retorna 13 (meses)
```

| Ejemplo | Unidad | `fecha1` | `fecha2` | Resultado |
| --- | --- | --- | --- | --- |
| 1 | `day` | `2005/10/28` | `2006/10/28` | **365** |
| 2 | `month` | `2005/10/28` | `2006/11/29` | **13** |

**El orden importa:** el slide lo dice textual — el resultado *"corresponde a fecha2-fecha1"*.

**Razonamiento propio, no está en el deck:** de ahí que **la fecha más nueva vaya segunda** para
obtener un número positivo; al revés da negativo. Los dos resultados cierran: el primero son 365 días
porque el tramo 2005→2006 **no incluye ningún 29 de febrero**, y el segundo cuenta 13 cambios de mes
entre octubre de 2005 y noviembre de 2006. Las fechas van con **barras** (`'2005/10/28'`), no con
guiones — así están en el slide.

> [!bug] `DATEDIFF` **existe en MySQL pero es otra función**
> Este es el caso más traicionero del deck, porque el nombre coincide y el comportamiento no:
>
> | | T-SQL *(el del slide)* | **MySQL** |
> | --- | --- | --- |
> | **Argumentos** | 3 — `(unidad, f1, f2)` | **2 — `(f1, f2)`** |
> | **Unidad** | la que se pida | **siempre días** |
> | **Cuenta** | `f2 − f1` | **`f1 − f2`** ← *orden invertido* |
>
> O sea que `DATEDIFF('2005/10/28','2006/10/28')` en MySQL devuelve **−365**, no 365: para obtener
> 365 hay que escribir `DATEDIFF('2006-10-28','2005-10-28')`.
>
> **Equivalente en MySQL para el ejemplo con unidad:**
>
> ```sql
> SELECT TIMESTAMPDIFF(MONTH, '2005-10-28', '2006-11-29');  -- 13
> SELECT TIMESTAMPDIFF(DAY,   '2005-10-28', '2006-10-28');  -- 365
> ```
>
> `TIMESTAMPDIFF(unidad, f1, f2)` sí acepta unidad **y** cuenta `f2 − f1`, igual que el `DATEDIFF` del
> slide: es el reemplazo uno-a-uno. **Verificar en clase cuál se espera en el TP** — escribir
> `DATEDIFF(day, …)` en MySQL da error, y escribir `DATEDIFF(f1, f2)` da el signo cambiado.

---

## Tabla resumen

Cheat sheet de los 16 slides. La columna **Motor** dice dónde corre **tal como está escrito en el
deck**; la última columna, qué hay que escribir para que corra en **MySQL**, que es el motor de la
cursada.

| Cláusula / función | Para qué | Ejemplo del deck | Motor | En MySQL |
| --- | --- | --- | --- | --- |
| `/* … */` | Comentar / desactivar una cláusula | `/* WHERE apellido = 'Maradona'*/` | todos | igual · también `-- ` y `#` |
| `CONCAT(a, b, …)` | Unir campos en una sola columna | `CONCAT(apellido, ' ', nombre)` | MySQL · SQL Server | igual · `NULL` contagia → `CONCAT_WS` |
| `AS` *(columna)* | Renombrar una columna del resultado | `sum(importe * cantidad) AS total` | todos | igual · `AS` opcional |
| `AS` *(tabla)* | Abreviar el nombre de la tabla | `FROM personas AS p` / `FROM personas p` | todos | igual |
| `DISTINCT` | Eliminar filas duplicadas | `SELECT distinct(autor) FROM libros` | todos | igual · sin paréntesis |
| `CASE … WHEN … END` | Clasificar valores en el `SELECT` | `WHEN precio < 50 THEN 'menor a 50'` | todos | igual · **el alias va con `AS` al final** |
| `LIKE '…%'` | Búsqueda por patrón en texto | `LIKE 'Garcia%'` | todos | igual |
| `LIKE '…[nm]…'` | Clase de caracteres | `LIKE 'A[nm]%'` | **T-SQL** | ❌ → `REGEXP '^A[nm]'` |
| `IN(…)` | Comparar contra un conjunto | `WHERE dni IN(30,40,50)` | todos | igual |
| `TOP n` | Limitar filas *(al principio)* | `SELECT top 3 nombre, apellido` | **T-SQL** | ❌ → `LIMIT 3` al final |
| `LIMIT o , c` | Limitar filas *(al final)* | `LIMIT 0 , 30` | **MySQL** | igual · portable: `LIMIT 30 OFFSET 0` |
| `DAY(f)` | Día del mes, como entero | `SELECT DAY( fecha ), fecha` | MySQL · SQL Server | igual |
| `MONTH(f)` | Mes, como entero | `SELECT MONTH( fecha ), fecha` | MySQL · SQL Server | igual |
| `YEAR(f)` | Año, como entero | `SELECT YEAR( fecha ), fecha` | MySQL · SQL Server | igual |
| `DATEPART(p, f)` | Cualquier parte, como entero | `datepart(month,getdate())` | **T-SQL** | ❌ → `EXTRACT(MONTH FROM NOW())` |
| `DATENAME(p, f)` | Nombre de la parte, como texto | `datename(month,getdate())` | **T-SQL** | ❌ → `MONTHNAME()` / `DAYNAME()` |
| `DATEDIFF(p, f1, f2)` | Diferencia entre dos fechas | `datediff(day,'2005/10/28','2006/10/28')` | **T-SQL** | ⚠️ existe pero cambia → `TIMESTAMPDIFF` |
| `getdate()` | Fecha y hora actuales | `getdate()` | **T-SQL** | ❌ → `NOW()` / `CURDATE()` |

## Traducción a MySQL

Las cinco cosas del deck que **no se pueden copiar tal cual** al TP, juntas:

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

- [ ] **¿Con qué motor se corrigen los TPs de esta clase?** El deck mezcla T-SQL y MySQL; el
      cronograma dice MySQL. Si el TP acepta `TOP` o `DATEPART`, hay algo más que no cuadra.
- [ ] **¿Dónde están `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`, `GROUP BY` y `HAVING`?** No están en este
      deck. Buscarlos en la [[Clase 05 - Consultas de Datos–Parte 1|Parte 1]] y la
      [[Clase 05 - Consultas de Datos–Parte 2|Parte 2]]; si tampoco están, es un hueco
      real de la Clase 05.
- [ ] **`COUNT(*)` vs. `COUNT(columna)` y el tratamiento de `NULL` en las agregaciones:** el deck no
      lo toca en ningún slide. Es tema clásico de parcial → resolver contra bibliografía.
- [ ] ¿El `"alias" = expresión` del slide 5 se acepta en la corrección, o hay que reescribirlo con
      `AS`? (En MySQL por defecto **corre pero devuelve otra cosa** — no da error, que es lo peor.)
- [ ] ¿Los ejercicios de `LIKE` usan corchetes `[…]`? En MySQL no funcionan.
- [ ] `LIKE '%G%'`: ¿la búsqueda es **case-sensitive**? Depende del *collation* de la columna, y el
      deck no lo menciona. En MySQL con collation `_ci` por defecto, no lo es.
- [ ] ¿El slide 13 (`YEAR` descripto como "mes") es un tipeo confirmado? Se asume que sí.
- [ ] ¿Por qué el slide 14 traduce `quarter` como *"cuarto"* si dos líneas antes dice *"trimestre"*?
      Cosmético, pero conviene fijar el vocabulario.

## Enlaces

- Esta clase, partes anteriores: [[Clase 05 - Consultas de Datos–Parte 1]] · [[Clase 05 - Consultas de Datos–Parte 2]]
- Clase anterior: [[Clase 04 - AlteraciónActualizaciónTablas]] · clase siguiente: [[Clase 06 - Vistas-Parte 1]]
- Práctica correspondiente: [[Práctica 2026-08-04]]
- Motor de la cursada: [[MySQL]] · dialecto ajeno que aparece acá: [[SQL Server (T-SQL)]]
- Conceptos: [[Funciones de fecha en SQL]] · [[Dialectos de SQL]] · [[1.05.01 - SQL — consultas|NULL en SQL]]
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
