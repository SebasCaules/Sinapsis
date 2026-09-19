---
tipo: teorica
clase: 10
deck: "BD2_Clase 10 - Restricciones integridad-Parte 2.pdf"
unidad: 1
tema: "Triggers y SQL Procedural"
resumen: "SQL procedural en PL/pgSQL: trigger, stored procedure y función según quién los invoca, cursores, funciones que devuelven tabla y cuatro niveles de restricción, con la regla de constraint siempre que se pueda y triggers desde el nivel tabla. En MySQL se reescribe la estructura, no las palabras."
fecha: 2026-08-31
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 10
  - Clase 10 — SQL procedural
  - Restricciones integridad-Parte 2
  - Triggers y SQL Procedural
  - Stored procedures
  - Cursores
  - refcursor
  - PL/pgSQL
  - RETURNS TABLE
  - Cuatro niveles de restricción
  - ASSERTIONS
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 10 - Restricciones integridad-Parte 2.pdf"
estado: procesado
---

# Clase 10 — SQL procedural: funciones, stored procedures y cursores

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 10 - Restricciones integridad-Parte 2.pdf` · **20 slides**
> El slide 1 es la **portada**; el recorrido de abajo arranca en el 2 y llega al 20, que es el cierre
> con links. **No hay slide de agenda y tampoco hay slide de bibliografía** *(a diferencia del 39 de
> la [[Clase 09 - Restricciones integridad-Parte 1]])*.
> Dictado en la **teórica del lunes 31/08**. El `10` del nombre del archivo **es el número de clase**:
> la cátedra numera sus decks y ésa es la única numeración de clases que existe.
> Clase anterior: [[Clase 09 - Restricciones integridad-Parte 1]] *(del 24/08)*.
> Se practica con el **TP 7 Restricciones avanzadas** del martes 01/09 → [[Práctica 2026-09-01]].
> Bibliografía: [[_index-bibliografia]] › Clase 10.

> [!warning] 🔴 El nombre del archivo dice *"Restricciones integridad-Parte 2"*; **la portada dice otra cosa**
> El **slide 1**, textual:
>
> > *"Base de Datos II · **SQL PROCEDURAL** · Triggers, Stored Procedures"*
>
> **La portada no nombra "restricciones de integridad" en ningún lado.** Y el contenido le da la
> razón a la portada: **12 de los 20 slides** *(2–13)* son SQL procedural puro —funciones,
> declaración de variables, cursores— y solo los **6 finales** *(14–19)* vuelven sobre restricciones,
> en versión condensada.
>
> El [[_cronograma]] coincide con la portada, no con el nombre del archivo: la teórica del **lunes
> 31/08** tiene como tema oficial ***"Triggers y SQL Procedural"***. Por eso el `tema:` del
> frontmatter es ése y no el del nombre del PDF.
>
> **El nombre del archivo se conserva igual** —la página lo espeja, como manda [[CLAUDE]]— porque es
> lo que permite encontrar el PDF. Lo que no hay que hacer es deducir el contenido del nombre.

> [!bug] 🔴 Una previsión de este vault **falló**, y se documenta en vez de disimularse
> La página [[Clase 09 - Restricciones integridad-Parte 1]], línea ~57, decía:
>
> > *"**Hay una Parte 2** que todavía no está en `raw/`. Cuando llegue, es la **misma Clase 09**
> > (`Parte 1/2` = un deck partido, no dos clases) salvo que la cátedra le ponga otro número."*
>
> **La cátedra le puso otro número: `BD2_Clase 10`.** La salvedad final estaba bien puesta —y es lo
> único que salvó a la afirmación de ser directamente falsa—, pero la previsión principal erró.
>
> **Qué se aprende, y no estaba escrito en ningún lado del vault:** el sufijo `Parte N`
> **no dice nada sobre la identidad de la clase**. La regla de [[CLAUDE]] (*"un deck partido en
> varios archivos es una sola clase"*) sigue siendo correcta — lo que hace verdadero el caso
> `Clase 05 Parte 1/2/3` es que **el `NN` es el mismo**, no que diga *"Parte"*. La Clase 09 leyó el
> `Parte 1` como premisa, y la premisa siempre fue el número.
>
> Es el mismo patrón que [[CLAUDE]] ya registra dos veces en su callout `[!bug]`: **una estructura
> derivada tratada como autoridad sobre el material.** Ante la discrepancia, gana el material.

> [!warning] 🔴 Y la previsión de unidades falló por **tercera** vez
> [[_cronograma]] y [[_index-clases]] preveían que *"triggers y SQL procedural · TP7"* iba a caer en
> `Unidad-03`. **Cayó otra vez en `Unidad-01`.** Hoy la Unidad-01 agrupa las **Clases 01 a 10** y los
> **TP1 a TP7**, y `Unidad-02` sigue vacía.
>
> Lo que sí se confirmó por primera vez es la hipótesis alternativa que [[_index-clases]] dejaba
> anotada: *"parece que la `Unidad-01` es «todo lo relacional»"*. Entró el material del 31/08 y del
> 01/09, y volvió a caer ahí. **La unidad sale del path, no de la expectativa.**

> [!warning] 🔴 Motor: **octavo deck** con motor ajeno, y el primero que mezcla dos en un mismo slide
> El deck está escrito contra **PostgreSQL** y tiene además **sintaxis de Oracle** infiltrada en dos
> lugares. La cursada corre sobre **[[MySQL]]**. Evidencia textual, verificada slide por slide:
>
> | Evidencia | Dónde |
> | --- | --- |
> | El título literal *"Procedimientos/Funciones en **Postgres**"* | slides **6, 7, 8, 9, 10, 11, 12, 13** — ocho slides seguidos |
> | *"Para **Postgres** todos son funciones, sólo que hay funciones que devuelven `void`"* | slide 6 |
> | `$$` *(dollar quoting)*, `LANGUAGE plpgsql`, `RETURNS tipo AS` | slides 6, 7, 12, 13 |
> | `ALIAS FOR $1`, `%rowtype`, `%type`, `CONSTANT` | slide 8 |
> | *"Todo el acceso a cursores en **PL/pgSQL** … del tipo de datos especial **`refcursor`**"* | slide 9 |
> | `OPEN … FOR EXECUTE`, *bounded cursor*, la variable **`FOUND`** | slides 10, 11 |
> | `RETURNS TABLE(…)`, `RETURN QUERY`, `RETURN NEXT`, tipo `record` | slides 12, 13 |
> | 🔶 **Oracle**: `curs3 CURSOR (key int) **IS** SELECT …` *(en PL/pgSQL es `FOR`)* | slide **9** |
> | 🔶 **Oracle**: `avg( **months_between** ( **sysdate**, fecha_nacimiento ) )` | slide **17** |
> | *"**Postgres NO implementa este tipo de checks**"* | slide 17 |
> | Los **dos únicos links del deck**: `postgresqltutorial.com` y `postgresql.com` *(sic)* | slide 20 |
>
> Recuento: **10 slides con PostgreSQL** · **2 con Oracle** · **8 estándar o sin motor** ·
> **0 con MySQL** *(cero backticks, cero `DELIMITER`, cero `NEW.`/`OLD.`, cero `SIGNAL`)*.
>
> Con éste, los archivos de `raw/Unidad-01/Teorica/` con motor ajeno pasan a ser **diez de doce**
> —limpio solo el `02`, y el `06` con una atribución histórica—, o sea **ocho decks**: `01`, `03`,
> `04`, `05`, `07`, `08`, `09` y `10`.
>
> *(La [[Clase 09 - Restricciones integridad-Parte 1]] decía **"el sexto"**, y era **un error de
> conteo** —no una consecuencia del inventario viejo: ése ya listaba los mismos siete—.
> **Corregido el 25/08 en [[MySQL]] § *5 · Restricciones e integridad* y el 02/09 en la propia
> [[Clase 09 - Restricciones integridad-Parte 1]] § *El deck vuelve a estar escrito contra
> PostgreSQL***, que ahora dice *"séptimo"*. Contando bien, la 09 es la séptima y ésta la octava.)*
>
> La traducción sintaxis por sintaxis está en [[MySQL]] § *6 · SQL procedural*; el inventario de qué
> deck es de qué motor, en [[PostgreSQL]] § *Inventario*.

> [!important] 🎯 La ironía que conviene no perder de vista
> El **slide 2** advierte, como *desventaja* del SQL procedural: *"**Cada proveedor de BD tiene su
> propio lenguaje procedural**"*. **Los ocho slides que siguen al marco conceptual —el bloque 6–13,
> titulado *"Procedimientos/Funciones en Postgres"*— enseñan el de un proveedor que la cursada no
> usa.** El deck diagnostica el problema en su segundo slide y después lo encarna.

---

## Resumen

El deck contesta la pregunta que la [[Clase 09 - Restricciones integridad-Parte 1]] dejó abierta sin
formularla: **en qué lenguaje se escribe el cuerpo de un trigger**. El deck 09 mostró en su slide 36
una función `RETURNS trigger AS $body$ … LANGUAGE 'plpgsql'` y el vault la transcribió sin poder
explicar la gramática. Éste es el manual de esa gramática.

Se arma en tres bloques:

1. **El marco conceptual** *(slides 2–5)*. Qué es SQL procedural, sus ventajas y su desventaja
   estructural, la tripleta **trigger / stored procedure / función** separada por *quién la invoca*,
   las extensiones procedimentales de SQL-1999, y el reparto de usos.
2. **PL/pgSQL de punta a punta** *(slides 6–13)*. `CREATE FUNCTION` con *dollar quoting*, parámetros
   posicionales y nombrados, declaración de variables (`ALIAS FOR`, `CONSTANT`, `%rowtype`, `%type`),
   **cursores** —concepto totalmente nuevo en el vault— y **funciones que devuelven tabla**.
3. **Los cuatro niveles de restricción** *(slides 14–19)*. Atributo → fila → tabla → generales
   (`ASSERTIONS`), como **argumento en escalera**: mientras el constraint declarativo alcanza, el
   trigger es el recurso equivocado; cuando deja de alcanzar —y deja de alcanzar en el nivel 3—, hay
   que volver a triggers y diseñarlos con cuidado.

| Bloque | Qué establece | Slides |
| --- | --- | --- |
| **Portada** | *"SQL PROCEDURAL · Triggers, Stored Procedures"* | 1 |
| **Qué es SQL procedural** | Definición, ventajas *(incluida la cifra)*, desventaja, SQL-1999 | 2 |
| **La tripleta** | Trigger · Stored Procedure · Función, separados por **quién los invoca** | 3 |
| **Extensiones SQL-1999** | `BEGIN…END`, variables, `if`/`while`/`for`/`loop`/`repeat` | 4 |
| **Usos típicos** | Qué va a trigger y qué va a procedimiento | 5 |
| **`CREATE FUNCTION`** | Gramática PL/pgSQL, *dollar quoting*, `void` = procedimiento | 6–7 |
| **Variables** | `ALIAS FOR $1`, `CONSTANT`, `DEFAULT`, `%rowtype`, `%type` | 8 |
| **Cursores** | Definición, `refcursor`, declarar / abrir / `FETCH` / `CLOSE` / `FOUND` | 9–11 |
| **Funciones que devuelven tabla** | `RETURNS TABLE`, `RETURN QUERY`, `RETURN NEXT`, `record` | 12–13 |
| **Nivel 1 · atributo** | `CHECK` de columna | 14 |
| **Nivel 2 · fila** | `CHECK` entre columnas de una misma tupla | 15 |
| **Nivel 3 · tabla** | `CHECK` con subconsulta → **no lo implementa nadie** | 16–17 |
| **Nivel 4 · generales** | `CREATE ASSERTION` → **no la implementa nadie** → triggers en varias tablas | 18–19 |
| **Cierre** | *Preguntas ??* + dos links a PostgreSQL | 20 |

> [!important] 🔴 Lo que este deck **no** trae, y sorprende: **ni una sola sentencia `CREATE TRIGGER`**
> Cero `BEFORE`/`AFTER`, cero `FOR EACH ROW`, cero `:new`/`:old`, cero ECA, cero cascadas. Se titula
> *"Triggers, Stored Procedures"* y **presupone** el vocabulario de triggers en lugar de enseñarlo:
> el **slide 19** dice *"analizar la **granularidad, eventos y tiempo de activación**"* y el **17**
> pide analizar *"ante qué eventos y en qué tiempo"* — los dos presuponen el vocabulario, pero **solo
> el 19 nombra la granularidad** *(la palabra aparece **una sola vez** en los 20 slides)*.
>
> **Y lo están: en los slides 28–29 de la [[Clase 09 - Restricciones integridad-Parte 1]].** Los dos
> decks están **repartidos, no superpuestos**: el 09 dio los triggers completos y el 10 da el
> lenguaje en que se escribe su cuerpo. Ninguno de los ocho puntos de los slides 25–38 del deck 09
> se repite acá.
>
> Consecuencia: **la predicción de que "los slides 25–38 se van a repetir" también era falsa.**
> **Corregido el 02/09** en [[Clase 09 - Restricciones integridad-Parte 1]] § *Bloque de triggers*
> y § *Dudas abiertas*, en [[1.09.04 - Triggers|Triggers]] y en [[index]] § *Preguntas abiertas*.

---

## Slide 1 · La portada

> [!quote] Textual, completo
> *"Base de Datos II"*
> *"**SQL PROCEDURAL**"*
> *"Triggers, Stored Procedures"*

Fondo del tema de PowerPoint y logo del ITBA. **Todo el SQL del deck es texto vivo** — vale para los
20 slides, incluidos los tres bloques con recuadro de color *(slide 12, caja oscura con coloreado de
sintaxis; slides 17 y 18, cajas verdes)*: son formas con relleno sobre texto real, no capturas.
**Las únicas imágenes con contenido son los dos diagramas de entidades de los slides 16 y 18**
*(verificado con `pdfimages -list`: fuera de los adornos de plantilla que están en las 20 páginas,
solo hay `jpeg` en la 16 y la 18 — más el logo del ITBA en la 1 y el ícono de "Preguntas" en la 20)*.

Es el slide que fija la identidad del deck y el que justifica el `tema:` del frontmatter. Ver el
primer callout de esta página.

## Slide 2 · Qué es SQL procedural

> [!quote] La definición, textual
> *"Posibilita el uso de código procedural conjuntamente con sentencias SQL que son **almacenadas
> dentro de la BD**. El código procedural es **ejecutado por el DBMS** cuando es invocado (directa o
> indirectamente) por el usuario de la BD."*

Las dos mitades de esa frase son las dos decisiones de diseño que definen el tema: **dónde vive el
código** (dentro de la base, no en la aplicación) y **quién lo ejecuta** (el motor, no el cliente).

| | Textual del slide |
| --- | --- |
| **Ventaja 1** | *"Aísla partes comunes existentes en las aplicaciones, delegándolas en el DBMS"* |
| **Ventaja 2** | *"Eficiencia ( en general, cerca de un **órden** de magnitud )"* **[sic]** |
| **Desventaja** | *"Cada proveedor de BD tiene su propio lenguaje procedural"* |
| **Cierre** | *"El SQL-1999 incorporó estas características, pero **poco de lo definido anteriormente se ajustaba a un estándar**"* |

> [!note] La cifra *"cerca de un orden de magnitud"* es **la única cuantificación de todo el material**
> Es la única vez en la cursada que alguien pone un número al beneficio de mover lógica al motor. Va
> **el deck la afirma sin condiciones ni referencia**: no dice contra qué se compara *(¿una
> aplicación que hace N round-trips? ¿un batch?)*, ni con qué carga.
>
> **Pero la afirmación sí es rastreable**: *Seven Databases* **2.3**, recuadro ***Choosing to Execute
> Database Code*** *(impresa 29)*, dice lo mismo con el mismo orden de magnitud **y además dice
> cuándo vale** — cuando el cálculo mueve muchas filas, el procedimiento evita traerlas todas hasta la
> aplicación. O sea que la ventaja **no es general**: es de los casos donde lo que se ahorra es
> tráfico cliente↔servidor. Detalle en [[1.10.01 - SQL procedural|SQL procedural]] y en
> [[_index-bibliografia]] › Clase 10.

> [!important] La desventaja del slide 2 es **el marco de todo el vault**
> *"Cada proveedor de BD tiene su propio lenguaje procedural"* es exactamente por qué existe la
> § *Puntos abiertos* #2 de [[CLAUDE]] y por qué [[MySQL]] necesita una tabla de traducción. Y el
> cierre del slide —*"poco de lo definido anteriormente se ajustaba a un estándar"*— **relativiza el
> modelo de ejecución SQL-99** que cerraba el deck 09 (slide 38): ese modelo es **normativo, no
> descriptivo** de ningún motor real. Vale corregir el encuadre en [[1.09.04 - Triggers|Triggers]].

**Errata del slide:** *"órden"* lleva tilde y no corresponde. Transcrita `[sic]`, no corregida.

## Slide 3 · Trigger, stored procedure y función

> [!quote] Las tres definiciones, textuales
> - ***Trigger**: Es un procedimiento que es **invocado automáticamente por el DBMS** en respuesta a
>   un evento **especifico** de la BD.* **[sic: sin tilde]**
> - ***Stored Procedure**: Es un procedimiento que es **invocado explícitamente por el usuario**.*
> - ***Función**: puede ser predefinida o definida por el usuario para realizar operaciones
>   específicas sobre los datos, y pueden ser invocadas desde un trigger, stored procedure o
>   explícitamente.*

**El criterio de la tripartición es uno solo: quién invoca.**

| | Quién lo invoca | Cuándo |
| --- | --- | --- |
| **Trigger** | el **DBMS**, solo | ante un evento de la BD |
| **Stored procedure** | el **usuario**, explícitamente | cuando quiere |
| **Función** | cualquiera de los dos, o los otros dos | dentro de una expresión |

> [!tip] Éste es el complemento de la definición ECA del deck 09
> El **slide 26 de la [[Clase 09 - Restricciones integridad-Parte 1]]** define el trigger por su
> **estructura** (*regla evento-condición-acción*). Este slide lo define por su **modo de
> invocación**. Son compatibles: la definición de acá es más pobre en estructura y más clara en el
> contraste con el stored procedure. Para el parcial conviene tener las dos.
>
> Y cierra el hueco del **slide 16 del deck 09**, que listaba *"DISPARADORES · PROCEDIMIENTOS ·
> FUNCIONES"* y solo desarrollaba el primero: los otros dos son estos slides.

> [!warning] Esta tripartición **se le cae al deck tres slides después**
> El slide 6 dice *"Para Postgres todos son funciones"*. O sea que la distinción
> *procedimiento vs. función* que plantea acá **no existe en el motor que el deck usa para
> enseñarla** — y **sí existe en MySQL**, que es el motor de la cursada: allá `CREATE PROCEDURE` y
> `CREATE FUNCTION` son dos sentencias distintas, con invocación distinta (`CALL` vs. dentro de una
> expresión). **La definición del slide 3 vale para MySQL, no para el ejemplo del slide 6.**

## Slide 4 · Las extensiones procedimentales de SQL-1999

> [!quote] Textual
> *"SQL-1999 ha extendido el SQL-1992 en varios aspectos, uno de ellos el procedural."*
>
> **Extensiones Procedimentales:**
> - Sentencias compuestas (agruparlas en bloques `begin end`)
> - Declaración de variables y constantes.
> - Sentencias de Flujo de control **(consultar manual del DBMS)**
>   - ✔ `If-then-else` (`elsif`)
>   - ✔ `While`
>   - ✔ `For` (itera sobre los elementos de una tabla resultado)
>   - ✔ `Loop` y `repeat`

El paréntesis *"(consultar manual del DBMS)"* es el propio deck delegando el detalle al motor — y es
la única indicación de que la lista de abajo no es portable.

### La misma lista, contra los dos motores

| Construcción del slide | PL/pgSQL *(lo que enseña el deck)* | **MySQL** *(lo que corre en la cursada)* |
| --- | --- | --- |
| `BEGIN … END` | ✅ | ✅ — y es **obligatorio** para más de una sentencia |
| declaración de variables | ✅ en `DECLARE`, **antes** del `BEGIN` | 🟡 `DECLARE`, **adentro** del `BEGIN`, en sus primeras líneas |
| declaración de **constantes** | ✅ `CONSTANT` | ❌ **no hay constantes** → `DECLARE … DEFAULT` y disciplina |
| `If-then-else` | ✅ | ✅ |
| `elsif` | ✅ acepta `ELSIF` **y** `ELSEIF` | 🟡 **solo `ELSEIF`**, una sola palabra |
| `While` | ✅ | ✅ `WHILE … DO … END WHILE;` |
| **`For` sobre tabla resultado** | ✅ `FOR r IN (SELECT …) LOOP` | 🔴 **no existe `FOR` de ninguna clase** — hay que reescribirlo como cursor + `LOOP` + handler |
| `Loop` | ✅ | ✅ `[etiqueta:] LOOP … END LOOP;` con `LEAVE` / `ITERATE` |
| **`repeat`** | 🔴 **no existe en PL/pgSQL** | ✅ `REPEAT … UNTIL … END REPEAT;` |

> [!warning] El slide lista dos construcciones que **no conviven en ningún motor**
> `For`-sobre-resultado y `repeat` están en la misma lista de cuatro renglones, y **PostgreSQL tiene
> el primero y no el segundo, MySQL tiene el segundo y no el primero**. La lista es del estándar, no
> de un motor — que es exactamente lo que el paréntesis *"consultar manual del DBMS"* advierte, aunque
> el deck no vuelva a mencionarlo.
>
> Para el TP7 el que importa es el `FOR`: **es la reescritura más cara de todo el deck** *(ver slide
> 13)*.

**Detalle de transcripción:** el slide escribe `elsif` —la grafía de PostgreSQL y Oracle— sin
aclarar que MySQL escribe `ELSEIF`. Y la palabra que usa el deck es *"Procedimentales"*, no
*"procedurales"*.

## Slide 5 · Usos de cada tipo

> [!quote] Textual
> **Triggers:**
> - *"Actualización de **valores calculados del negocio**. Por ejemplo Saldo de una cuenta, total de
>   una factura, etc."*
> - *"Control de **reglas del negocio no posibles de hacer en SQL Declarativo**."*
>
> **Procedimientos y Funciones:**
> - *"Todo proceso que necesite de **control de flujo, bucles, etc.** ( if, for, while, cursores, etc. )"*
>   - *"Reportes."*
>   - *"Cálculos intensivos."*
>   - *"Abstracción de tablas ( para trabajo en capas )"*

Es el **slide bisagra** de la clase y la regla que va a gobernar los slides 14–19:

> **El trigger es para lo que no se puede hacer declarativamente. Lo que necesita control de flujo va
> a procedimiento, no a trigger.**

| Uso del slide 5 | Cómo se llamaba en el deck 09 *(slide 33)* |
| --- | --- |
| *"actualización de valores calculados del negocio"* | **mantenimiento de datos derivados** |
| *"control de reglas del negocio no posibles de hacer en SQL Declarativo"* | **forzado de reglas complejas** |
| — | *(el deck 10 **omite** propagación, auditoría y actualización de vistas)* |

> [!tip] El reparto es información nueva, no repetición
> El deck 09 daba **cinco usos de triggers** y nada sobre procedimientos. Este slide da **dos de esos
> cinco** y agrega **el otro lado del reparto**, que el deck 09 no tenía: reportes, cálculos
> intensivos y *"abstracción de tablas (para trabajo en capas)"* **no van a trigger**. Ese último
> ítem es la única mención en todo el material a los *stored procedures* como **capa de acceso** — el
> patrón de encapsular las tablas detrás de procedimientos para que la aplicación no las toque
> directamente. Es también el equivalente funcional que [[1.06.01 - Vistas|Vistas]] proponía para
> suplir el `INSTEAD OF` que MySQL no tiene.

**Maquetación:** *"Reportes"*, *"Cálculos intensivos"* y *"Abstracción de tablas"* van sangrados como
sub-viñetas de *"Todo proceso que necesite de control de flujo"*, aunque conceptualmente son tres
usos hermanos. Y los paréntesis del deck llevan espacio interior — `( if, for, while, cursores, etc. )` —
tic tipográfico que se conserva en todas las transcripciones de esta página.

---

## Slide 6 · `CREATE FUNCTION` en PostgreSQL

> [!quote] La frase que desarma la tripartición del slide 3
> *"Para Postgres todos son funciones, sólo que hay funciones que devuelven **void** ( Procedimientos )."*
> *(`void` va subrayado en el slide.)*

**Transcripción literal** *(los dos `$$` están en rojo en el slide)*:

```sql
CREATE [ OR REPLACE ] FUNCTION nombre_funcion([ [ argmodo ] [ argnombre ] argtipo [, ...] ])
RETURNS tipo AS $$
[ DECLARE ] [ declaraciones de variables ]
BEGIN
  codigo
END;
$$ LANGUAGE plpgsql ;
```

**Lo mismo en MySQL** — no es una traducción palabra por palabra, porque **no hay una sola pieza que
se tipee igual**:

```sql
-- Procedimiento (lo que en el deck es "función que devuelve void")
DELIMITER $$
CREATE PROCEDURE nombre_proc(IN arg1 INT, OUT arg2 VARCHAR(50))
BEGIN
  DECLARE v INT DEFAULT 0;   -- el DECLARE va ADENTRO del BEGIN
  -- codigo
END$$
DELIMITER ;

-- Función (devuelve un escalar)
DELIMITER $$
CREATE FUNCTION nombre_funcion(arg1 INT) RETURNS INT
DETERMINISTIC          -- o READS SQL DATA / NO SQL: obligatorio con binary logging
BEGIN
  DECLARE v INT DEFAULT 0;
  RETURN v;
END$$
DELIMITER ;
```

| Del deck | En MySQL | ¿Corre? |
| --- | --- | :---: |
| *"todos son funciones"* | ❌ **`PROCEDURE` y `FUNCTION` son objetos distintos**, con invocación distinta | ❌ |
| `$$ … $$` *(dollar quoting)* | ❌ **no existe.** El cuerpo va desnudo entre `BEGIN … END` | ❌ |
| `LANGUAGE plpgsql` | ❌ no existe: MySQL tiene **un solo** lenguaje procedural, sin nombre | ❌ |
| `OR REPLACE` | ❌ en 8.x → `DROP PROCEDURE IF EXISTS f;` y después el `CREATE` | ❌ |
| `RETURNS tipo AS` | 🟡 `RETURNS tipo` **sin `AS`**, y solo en `FUNCTION` | 🟡 |
| `[ DECLARE ]` antes del `BEGIN` | 🟡 **al revés**: adentro del `BEGIN`, primero de todo | 🟡 |
| `argmodo` | 🟡 `IN` / `OUT` / `INOUT`, **solo en `PROCEDURE`** *(una función es siempre `IN`)* | 🟡 |
| *(no está en el deck)* | 🔴 **`DELIMITER $$` … `END$$` … `DELIMITER ;`** | obligatorio |
| *(no está en el deck)* | 🔴 **`DETERMINISTIC` / `READS SQL DATA` / `NO SQL`** en toda `FUNCTION` | obligatorio |

> [!warning] 🔴 Los dos que faltan en el deck son los dos que rompen el TP7 en la primera línea
> 1. **`DELIMITER`.** Sin él, el cliente corta la definición en el primer `;` interno y el `CREATE`
>    falla con un error de sintaxis que no dice nada útil. **`DELIMITER` es un comando del cliente,
>    no del servidor** — no se puede poner adentro de un script que ejecute el servidor.
> 2. **La cláusula de característica.** Con *binary logging* prendido, un `CREATE FUNCTION` sin
>    `DETERMINISTIC`, `NO SQL` o `READS SQL DATA` **falla** *(salvo que esté prendido
>    `log_bin_trust_function_creators`)*. Es lo primero que va a morder en el punto 3.d del TP7.
>
> El `$$` de `DELIMITER $$` **no es el `$$` de PostgreSQL**: es solo el string que el cliente va a
> tomar como fin de sentencia. Coincidencia visual, cosas distintas.

> [!note] La afirmación del slide 6 **quedó vieja, y el deck no lo dice**
> *"Para Postgres todos son funciones"* era cierto hasta **PostgreSQL 10**. Desde **PostgreSQL 11**
> existe `CREATE PROCEDURE` de verdad, invocable con `CALL` y capaz de manejar transacciones
> adentro. O sea que el deck está escrito contra una versión anterior a 2018. *(Razonamiento propio,
> no del deck; anotado en [[PostgreSQL]].)*

**Rarezas conservadas:** espacio antes del punto y coma en `plpgsql ;`; `argmodo`/`argnombre`/`argtipo`
como castellanización de `argmode`/`argname`/`argtype` de la documentación oficial; `codigo` y
`nombre_funcion` sin tilde *(correcto: son identificadores)*.

## Slide 7 · La misma función, dos veces

**Transcripción literal:**

```sql
CREATE OR REPLACE FUNCTION Sumador(integer)
RETURNS integer AS $$
BEGIN
       RETURN $1 + 1;
END; $$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION Sumador(unNumero integer)
RETURNS integer AS $$
BEGIN
       RETURN unNumero + 1;
END; $$ LANGUAGE plpgsql;

Select Sumador(19);
```

> [!important] 🎯 El slide muestra dos veces lo mismo y **no explica por qué**. El punto es el contraste
> **Parámetro posicional (`$1`) vs. parámetro nombrado (`unNumero`).** Las dos funciones se llaman
> igual y tienen **la misma firma** `(integer)`, así que —razonamiento propio— la segunda
> **reemplaza** a la primera vía `OR REPLACE`: el `Select Sumador(19);` de abajo ejecuta la segunda y
> devuelve `20`. No son dos funciones coexistiendo; son dos formas de escribir una.

**En MySQL** solo traduce la segunda:

```sql
DELIMITER $$
CREATE FUNCTION Sumador(unNumero INT) RETURNS INT
DETERMINISTIC
BEGIN
  RETURN unNumero + 1;
END$$
DELIMITER ;

SELECT Sumador(19);
```

| Del slide | En MySQL |
| --- | --- |
| `RETURN $1 + 1;` *(posicional)* | ❌ **no existe `$1`.** Los parámetros **se nombran en la firma** y se usan por nombre |
| `RETURN unNumero + 1;` *(nombrado)* | ✅ **traduce directo** — es el único ejemplo del deck que sí |
| `Select Sumador(19);` | ✅ **igual.** *(En Oracle haría falta `FROM dual`; en MySQL y PostgreSQL no)* |
| `RETURN escalar;` | ✅ igual — pero **solo válido en `FUNCTION`**: un `PROCEDURE` no retorna valor, sale con `LEAVE` y comunica por parámetros `OUT` |

**Detalles de forma:** el `END; $$ LANGUAGE plpgsql;` va todo en un renglón, distinto de la plantilla
del slide 6 que lo parte en dos; y `Select` va con mayúscula inicial mientras el resto va en
minúscula. El deck no es consistente con el case de las palabras clave en ningún slide, y esta página
lo respeta.

## Slide 8 · Declaración de variables

**Transcripción literal** *(los comentarios van en verde en el slide)*:

```sql
CREATE Function  Ejemplo2(integer, integer) ……
DECLARE
     numero1  ALIAS FOR $1;  // Primer parámetro
     numero2  ALIAS FOR $2;  // Segundo parámetro
     constante   CONSTANT integer := 100;
     resultado   INTEGER;
     resultado_txt   TEXT DEFAULT   'Texto por defecto';
     tipo_reg   voluntario%rowtype;  // variable del tipo registro
     tipo_col   voluntario.nombre%type;  // variable del tipo columna

     ………
```

> [!bug] 🔴 **Los comentarios usan `//`, que no es comentario en ningún motor**
> Ni SQL, ni PL/pgSQL, ni MySQL aceptan `//`. Es `--` para línea, `/* … */` para bloque *(y MySQL
> acepta además `#`)*. El deck lo hace **cuatro veces en este slide**, dos más en el 9 y dos más en
> el 18: **ocho en total**. Copiado tal cual, el bloque no compila.
>
> Es el error más repetido del deck y hay que anotarlo, porque en el TP7 se van a copiar fragmentos
> de acá.

**Además:** los `……` marcan que el ejemplo está recortado — no hay `RETURNS`, ni `AS $$`, ni `BEGIN`,
ni `END`. **Es un fragmento, no una función compilable**, y el deck no lo aclara. Y una de las
variables se llama `constante`, que es un identificador cualquiera, al lado del `CONSTANT` real: se
presta a confusión.

### La traducción, línea por línea

| Del slide | En **MySQL** | ¿Corre? |
| --- | --- | :---: |
| `numero1 ALIAS FOR $1;` | ❌ **no existe** `ALIAS FOR` ni `$1` — se nombran en la firma | ❌ |
| `constante CONSTANT integer := 100;` | ❌ **no hay constantes** → `DECLARE constante INT DEFAULT 100;` | ❌ |
| `resultado INTEGER;` | ✅ `DECLARE resultado INT;` | ✅ |
| `resultado_txt TEXT DEFAULT 'Texto por defecto';` | 🟡 el `DEFAULT` **sí existe**; para la variable local usar `VARCHAR(n)` en vez de `TEXT` | 🟡 |
| `tipo_reg voluntario%rowtype;` | ❌ **no hay tipo registro.** Una variable **por columna**, y `SELECT c1, c2 INTO v1, v2` | ❌ |
| `tipo_col voluntario.nombre%type;` | ❌ **no existe.** Hay que **repetir el tipo a mano** y mantenerlo sincronizado si la tabla cambia | ❌ |
| `:=` como asignación | 🟡 adentro de una rutina es **`SET v = expr;`**. El `:=` de MySQL es para **variables de usuario** (`@x := 1`) | 🟡 |
| `DECLARE` **antes** del `BEGIN` | 🟡 **adentro** del `BEGIN`, y con **orden rígido**: variables → *conditions* → **cursores** → **handlers**. Fuera de ese orden no compila | 🟡 |

El mismo bloque, reescrito para MySQL:

```sql
DELIMITER $$
CREATE PROCEDURE Ejemplo2(IN numero1 INT, IN numero2 INT)
BEGIN
  DECLARE constante     INT DEFAULT 100;          -- no es constante de verdad
  DECLARE resultado     INT;
  DECLARE resultado_txt VARCHAR(100) DEFAULT 'Texto por defecto';
  -- %rowtype: no existe → una variable por columna
  DECLARE v_id_voluntario INT;
  DECLARE v_nombre        VARCHAR(60);
  -- %type: no existe → el tipo se repite a mano
  DECLARE tipo_col        VARCHAR(60);
  -- …
END$$
DELIMITER ;
```

> [!note] `%rowtype`, `%type` y `ALIAS FOR` son de **linaje Oracle**, y eso no los hace un error
> Los tres vienen de **PL/SQL**; PL/pgSQL los copió deliberadamente cuando se diseñó como lenguaje
> parecido a PL/SQL. O sea que este slide es **PostgreSQL válido**, no una filtración de Oracle:
> **no cuenta como desfasaje de motor**. Las filtraciones de Oracle de verdad son otras dos —el `IS`
> del slide 9 y el `months_between(sysdate, …)` del 17—, y ésas sí no compilan en Postgres.

**Dato de contexto:** acá aparece por primera vez la tabla **`voluntario`**, que es el dataset de
ejemplo del resto del deck. En los slides 12–13 se la ve calificada como
`unc_esq_voluntario.voluntario`. En MySQL **eso significa otra cosa**: *schema* = *database*, así que
`unc_esq_voluntario` sería **otra base**, no un espacio de nombres dentro de la misma.

---

## Slides 9–10 · Cursores — declarar y abrir

> [!important] Concepto **totalmente nuevo** en el vault
> No hay ninguna huella previa de cursores en `wiki/`. Estos tres slides *(9, 10 y 11)* son toda la
> materia prima que existe, y el vocabulario es cerrado y memorizable — o sea, material de parcial.
> Página propia: [[1.10.03 - Cursores|Cursores]].

### La definición *(slide 9)*

> [!quote] Textual
> *"Un cursor es un tipo de variable que nos permite acceder a las filas de un conjunto de datos
> (Tabla, consulta, etc.) en forma **secuencial, no pudiendo volver a una fila anterior una vez que
> se avanza el puntero**."*
>
> *"Todo el acceso a cursores en **PL/pgSQL** es a través de variables del tipo cursor, las cuales son
> siempre del tipo de datos especial **`refcursor`**."*

**El "sin volver atrás" es lo que justifica todo lo demás**: si no se puede retroceder, el patrón
tiene que ser `OPEN` → `FETCH` repetido → `CLOSE`, y hace falta una señal de *"ya no hay más filas"*.

### Las tres formas de declarar *(slide 9)*

La gramática que da el propio slide:

```sql
nombre CURSOR [ ( argumentos ) ] FOR select_query ;
```

Y los tres ejemplos, **literales**:

```sql
DECLARE
   curs1 refcursor;  (puede utilizarse para cualquier consulta)
   curs2 CURSOR FOR SELECT * from voluntario;  // solo se utiliza con la consulta declarada
   curs3 CURSOR (key int) IS
          SELECT * from voluntario where id_voluntario = key;  // consulta parametrizada, key será
          reemplazado por un valor de parámetro entero cuando se inicialice el cursor
```

| | Qué es | Cuándo se fija la consulta |
| --- | --- | --- |
| **`curs1`** | **genérico** *(unbounded)* — tipo `refcursor` | al **abrirlo** |
| **`curs2`** | **ya especificado** *(bounded)* | en la **declaración** |
| **`curs3`** | **parametrizado** | en la declaración, con un hueco que se llena al abrir |

> [!bug] 🔶 **El slide se contradice a sí mismo cuatro renglones después de la regla**
> La gramática dice `… CURSOR [ ( argumentos ) ] **FOR** select_query`, y `curs2` la respeta. Pero
> **`curs3` usa `IS`**: `curs3 CURSOR (key int) **IS** SELECT …`.
>
> **`IS` en lugar de `FOR` es PL/SQL de Oracle** *(`CURSOR c (p NUMBER) IS SELECT …`)*. En PL/pgSQL
> no compila. Es **la primera de las dos filtraciones de Oracle del deck**; la segunda es el
> `months_between(sysdate, …)` del slide 17.
>
> Y es la **tercera instancia** del mismo fenómeno en dos decks consecutivos, contando el
> `:new`/`:old` del slide 30 del deck 09 → refuerza la § *Puntos abiertos* #2 de [[CLAUDE]].

**Detalle de transcripción:** el paréntesis de `curs1` —`(puede utilizarse para cualquier consulta)`—
**no lleva marca de comentario**: va pegado a la línea de código, sin `//` ni `--`. Copiado tal cual,
tampoco compila. Y los dos comentarios de `curs2`/`curs3` vuelven a usar `//`.

### Las tres formas de abrir *(slide 10)*

**Transcripción literal:**

```
• GENERICO                                      [sic: sin tilde]
     • OPEN CURSOR FOR SELECT …..
           • OPEN curs1 for select * from Pais;
     • OPEN CURSOS FOR EXECUTE ….                [sic: "CURSOS" por "CURSOR"]
           • OPEN curs1 for execute “select * from Pais”;   [sic: comillas dobles tipográficas]

• Ya Especificado (BOUNDED CURSOR)
   • OPEN curs2;
   • OPEN curs3(4444);

• Para traer fila a fila se utiliza el FETCH y no olvidarse de cerrarlo con un CLOSE.
   • Fetch curs2 into variable;
   • Close curs2;

Utilizar la variable FOUND para ver si trajo una fila o no.
```

> [!bug] Tres erratas en un slide, todas conservadas `[sic]`
> 1. **`OPEN CURSOS FOR EXECUTE`** — *"CURSOS"* por `CURSOR`.
> 2. **`“select * from Pais”`** — comillas **dobles y tipográficas**. Doblemente mal: en PostgreSQL
>    las comillas dobles delimitan **identificadores**, no cadenas *(`EXECUTE` espera una cadena con
>    comilla simple)*, y las curvas no las acepta ningún parser.
> 3. **`GENERICO`** sin tilde.
>
> Y una ambigüedad: **`curs1` se abre dos veces** en el mismo slide. Son dos alternativas
> ilustrativas —`FOR SELECT` y `FOR EXECUTE`—, no una secuencia, pero el slide no lo aclara y leído
> de corrido parece un `OPEN` sobre un cursor ya abierto, que en Postgres da error.

**`OPEN curs3(4444);` cierra el circuito del slide 9:** el `4444` es el argumento `key` declarado
allá. Los dos slides se leen juntos o el ejemplo se rompe.

### Todo el bloque de cursores, contra MySQL

| Del deck | En **MySQL** | ¿Corre? |
| --- | --- | :---: |
| `curs1 refcursor;` | ❌ **no hay variables de tipo cursor.** Un cursor es una **declaración**, no un valor: no se asigna, no se pasa como parámetro, no se devuelve | ❌ |
| `curs2 CURSOR FOR SELECT * from voluntario;` | 🟡 **`DECLARE curs2 CURSOR FOR SELECT * FROM voluntario;`** — 🎯 **es la única línea del bloque que casi traduce**: solo hay que anteponerle `DECLARE` | 🟡 |
| `curs3 CURSOR (key int) IS SELECT …` | ❌ **doblemente inválido**: el `IS` es Oracle **y** MySQL no admite cursores parametrizados. Sustituto: variable local asignada **antes** del `OPEN`, referenciada desde el `SELECT` del cursor | ❌ |
| `OPEN curs1 for select …` | ❌ el `OPEN` de MySQL **no lleva query**: la consulta se fija en el `DECLARE` | ❌ |
| `OPEN curs1 for execute "…"` *(dinámico)* | ❌ **no existe.** Hay `PREPARE`/`EXECUTE`, pero **no se puede abrir un cursor sobre un prepared statement**; y los prepared statements **no se admiten dentro de funciones ni triggers** *(sí en procedimientos)* | ❌ |
| `OPEN curs2;` · `Fetch … into` · `Close curs2;` | ✅ **iguales.** Ojo: el `FETCH … INTO` necesita **tantas variables como columnas** — y como no hay `%rowtype`, hay que enumerarlas | ✅ |
| `if FOUND then` | 🔴 **`FOUND` no existe.** El reemplazo **no es una variable, es un handler declarado** *(abajo)* | ❌ |

> [!important] 🔴 `FOUND` → `CONTINUE HANDLER FOR NOT FOUND`, **y la lógica se invierte**
> ```sql
> DECLARE done INT DEFAULT 0;
> DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
> -- …
> FETCH cur INTO v1, v2;
> IF done = 0 THEN  -- equivalente a IF FOUND
>   -- había fila
> END IF;
> ```
> **`FOUND` significa "trajo fila"; `done` significa "se acabó".** Son negaciones una de la otra, y
> es el error clásico al portar código de PL/pgSQL a MySQL. Además el handler **se declara al final
> de todos los `DECLARE`**, después de los cursores.
>
> *(Para DML —no para `FETCH`— el análogo de `FOUND` en MySQL es **`ROW_COUNT()`**, y
> `GET DIAGNOSTICS` da el detalle. No está en el deck.)*

## Slide 11 · Cursores — la función completa

**Transcripción literal** *(las comillas del deck son tipográficas simples `‘ ’`, no rectas)*:

```sql
CREATE FUNCTION ….
DECLARE
   cursor cur1 for select * from pais;
   mifila pais%rowtype;
   mensaje TEXT DEFAULT ‘no hay registros’;
Begin
 open cur1;
 fetch cur1 into mifila;

 if FOUND then
    menaje := ‘Por lo menos hay un registro’
 end if;

 close cur1;
  Return mensaje;
end
……
```

> [!bug] 🔴 **Cuatro errores en diecisiete líneas.** Es el bloque más roto del deck
> | # | Error | Consecuencia |
> | :---: | --- | --- |
> | 1 | **`menaje :=`** por `mensaje` | 🎯 **la función devolvería siempre el `DEFAULT`**, o sea `'no hay registros'`, aunque la tabla tenga filas. Es un error *silencioso*: si el motor lo aceptara, el bug no se vería |
> | 2 | Esa misma línea **no termina en `;`** | no compila |
> | 3 | El `end` final **va sin `;`** | no compila |
> | 4 | **`cursor cur1 for select …`** está **invertido** | la gramática que el propio deck dio en el slide 9 es `cur1 CURSOR FOR select …`. Con el orden del slide, tampoco compila |
>
> Con el error 1, `PL/pgSQL` en realidad **sí lo detectaría**: `menaje` no está declarada y la
> función falla al ejecutar. O sea que el bloque tiene un error de compilación *(2, 3, 4)* y uno de
> ejecución *(1)*. **Es pseudocódigo, no código** — le falta además el `RETURNS`, el `AS $$` y el
> `LANGUAGE`.

### La misma función, escrita bien en las dos sintaxis

**PL/pgSQL** *(corregida — no es lo que dice el slide)*:

```sql
CREATE OR REPLACE FUNCTION hay_paises() RETURNS text AS $$
DECLARE
   cur1    CURSOR FOR SELECT * FROM pais;   -- orden correcto
   mifila  pais%rowtype;
   mensaje TEXT DEFAULT 'no hay registros';
BEGIN
   OPEN cur1;
   FETCH cur1 INTO mifila;
   IF FOUND THEN
      mensaje := 'Por lo menos hay un registro';
   END IF;
   CLOSE cur1;
   RETURN mensaje;
END;
$$ LANGUAGE plpgsql;
```

**MySQL** — cambia la estructura, no solo las palabras:

```sql
DELIMITER $$
CREATE FUNCTION hay_paises() RETURNS VARCHAR(50)
READS SQL DATA                       -- obligatorio: la función lee tablas
BEGIN
  DECLARE done    INT DEFAULT 0;     -- 1º: variables
  DECLARE v_id    INT;               --    una por columna: no hay %rowtype
  DECLARE v_nom   VARCHAR(60);
  DECLARE mensaje VARCHAR(50) DEFAULT 'no hay registros';
  DECLARE cur1 CURSOR FOR SELECT id_pais, nombre FROM pais;   -- 2º: cursores
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;        -- 3º: handlers

  OPEN cur1;
  FETCH cur1 INTO v_id, v_nom;
  IF done = 0 THEN                   -- equivalente a IF FOUND
     SET mensaje = 'Por lo menos hay un registro';
  END IF;
  CLOSE cur1;
  RETURN mensaje;
END$$
DELIMITER ;
```

Cinco diferencias estructurales, no cosméticas: **`DECLARE` adentro del `BEGIN`** · **orden rígido
variables → cursores → handlers** · **`%rowtype` desarmado en una variable por columna** ·
**`FOUND` reemplazado por el handler, con la lógica invertida** · **`READS SQL DATA` obligatorio**.

---

## Slide 12 · Funciones que devuelven una TABLA — `RETURN QUERY`

**Transcripción literal** *(el slide lo muestra en un recuadro negro con coloreado de sintaxis)*:

```sql
create function VoluntariosPorApellido(parte_apellido varchar)
returns
  TABLE(nro_voluntario numeric, apellido_nombre varchar)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
      SELECT v.nro_voluntario,
                cast((v.apellido||', '||v.nombre) as varchar)
      FROM unc_esq_voluntario.voluntario v
      WHERE upper(v.apellido) LIKE ('%'||upper(parte_apellido)||'%');
END;
$$;
```

Y la invocación, en un recuadro aparte:

```sql
select *
from VoluntariosPorApellido('co');
```

**En MySQL no hay equivalente de función: hay que cambiar el objeto.**

```sql
DELIMITER $$
CREATE PROCEDURE VoluntariosPorApellido(IN parte_apellido VARCHAR(60))
BEGIN
  SELECT v.nro_voluntario,
         CAST(CONCAT(v.apellido, ', ', v.nombre) AS CHAR) AS apellido_nombre
  FROM   voluntario v
  WHERE  UPPER(v.apellido) LIKE CONCAT('%', UPPER(parte_apellido), '%');
END$$
DELIMITER ;

CALL VoluntariosPorApellido('co');
```

| Del slide | En **MySQL** | ¿Corre? |
| --- | --- | :---: |
| `RETURNS TABLE(col tipo, …)` | ❌ **no existe.** Una `FUNCTION` devuelve **un escalar** | ❌ |
| `RETURN QUERY SELECT …` | ❌ no existe → dentro de un `PROCEDURE`, **el `SELECT` a secas ya emite el result set** | ❌ |
| `select * from f(…)` | ❌ **no se puede hacer `FROM` de una función** → `CALL f(…);` | ❌ |
| 🔴 `a \|\| ', ' \|\| b` | ❌ **en MySQL `\|\|` es el OR lógico** → `CONCAT(a, ', ', b)` | ❌ |
| `cast( … as varchar)` | 🔴 **`CAST` de MySQL no acepta `VARCHAR`** → **`CAST(… AS CHAR)`** | 🟡 |
| `upper()` | ✅ igual | ✅ |
| `unc_esq_voluntario.voluntario` | 🟡 corre, pero **significa otra base**, no un esquema dentro de la misma | 🟡 |

> [!warning] 🔴 El `||` es **el peor tipo de incompatibilidad: no falla, devuelve otra cosa**
> `'a' || 'b'` en MySQL no da `'ab'`: es un **OR lógico**, y devuelve `0`. Sin error, sin warning.
> Un `WHERE apellido LIKE ('%'||x||'%')` portado literalmente compila y filtra mal.
> *(Con `sql_mode = PIPES_AS_CONCAT` cambiaría, pero no es el default.)*

**Dos observaciones sobre el propio slide:**
1. El `cast(… as varchar)` está porque `apellido||', '||nombre` da tipo `text` y la firma declara
   `varchar` — sin el cast, PostgreSQL rechaza la función. Es un detalle real de tipado, no adorno.
2. El `LANGUAGE plpgsql` va **antes** del `AS $$`. Es válido en Postgres, y es **la forma opuesta a
   la del slide 13**, que lo pone al final. Dos slides consecutivos, dos convenciones distintas.

## Slide 13 · Funciones que devuelven una TABLA — `RETURN NEXT` y el `FOR`

**Transcripción literal:**

```sql
CREATE FUNCTION voluntarioscadax(x integer) RETURNS
TABLE(nro_voluntario numeric, apellido varchar, nombre varchar)
AS $$
DECLARE
   var_r record;
   i int;
BEGIN
 i := 0;
 FOR var_r IN (
    SELECT v.nro_voluntario, v.apellido, v.nombre
    FROM unc_esq_voluntario.voluntario v)
 LOOP
     IF (i % x = 0) THEN
             nro_voluntario := var_r.nro_voluntario;
             apellido := var_r.apellido;
             nombre := var_r.nombre;
             i := 0;
             RETURN NEXT;
     END IF;
     i := i + 1;
 END LOOP;
END;
$$; LANGUAGE plpgsql;
```

```sql
select *
from voluntarioscadax(3);
```

> [!bug] `$$; LANGUAGE plpgsql;` **[sic]** — el `;` de más deja el `LANGUAGE` colgado
> El punto y coma después del `$$` **cierra la sentencia**, así que `LANGUAGE plpgsql;` queda como un
> comando suelto e inválido. Lo correcto es `$$ LANGUAGE plpgsql;`. **El slide 12 resuelve lo mismo
> bien**, poniendo el `LANGUAGE` antes del `AS $$` — dos slides seguidos, uno bien y uno mal.

> [!note] La lógica del *"cada x"* tiene un detalle que el deck no comenta
> `i` arranca en **0**, con lo que la **primera fila siempre entra** (`0 % x = 0`). Adentro del `IF`
> se hace `i := 0` **y después** `i := i + 1` afuera, así que el contador se reinicia en cada
> acierto. Leído así el reset es intencional y el resultado es *"una de cada x"*, pero **queda
> ambiguo** si la intención era esa o si el `i := 0` de adentro sobra. Razonamiento propio; el deck
> no lo aclara. → duda abierta.

**En MySQL hay que reescribirlo entero.** No existe el `FOR` sobre resultado, no existe
`RETURN NEXT`, no existe `RETURNS TABLE` y no existe `record`:

```sql
DELIMITER $$
CREATE PROCEDURE voluntarioscadax(IN x INT)
BEGIN
  DECLARE done  INT DEFAULT 0;
  DECLARE i     INT DEFAULT 0;
  DECLARE v_nro DECIMAL(10,0);
  DECLARE v_ape VARCHAR(60);
  DECLARE v_nom VARCHAR(60);
  DECLARE cur CURSOR FOR
      SELECT v.nro_voluntario, v.apellido, v.nombre FROM voluntario v;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  DROP TEMPORARY TABLE IF EXISTS tmp_cadax;
  CREATE TEMPORARY TABLE tmp_cadax (
      nro_voluntario DECIMAL(10,0), apellido VARCHAR(60), nombre VARCHAR(60));

  OPEN cur;
  bucle: LOOP
      FETCH cur INTO v_nro, v_ape, v_nom;
      IF done = 1 THEN LEAVE bucle; END IF;
      IF (i % x = 0) THEN
          INSERT INTO tmp_cadax VALUES (v_nro, v_ape, v_nom);
          SET i = 0;
      END IF;
      SET i = i + 1;
  END LOOP;
  CLOSE cur;

  SELECT * FROM tmp_cadax;     -- éste es el "return" del procedimiento
END$$
DELIMITER ;

CALL voluntarioscadax(3);
```

| Del slide | En **MySQL** | ¿Corre? |
| --- | --- | :---: |
| `var_r record;` | ❌ **no existe el tipo `record`** → una variable por columna | ❌ |
| 🔴 `FOR var_r IN (SELECT …) LOOP` | ❌ **no hay `FOR` de ninguna clase** → cursor + `LOOP` + handler `NOT FOUND` + `LEAVE`. **Es la reescritura más cara del deck** | ❌ |
| `RETURN NEXT;` | ❌ no existe → **tabla temporal**: `INSERT` adentro del loop y `SELECT * FROM` al final | ❌ |
| `nro_voluntario := var_r.nro_voluntario;` | ❌ no aplica: no hay `RETURNS TABLE`, así que no hay columnas de salida que asignar | ❌ |
| `IF … THEN … END IF;` | ✅ igual | ✅ |
| `i % x = 0` | ✅ igual *(`%` y `MOD` son sinónimos)* | ✅ |
| `i := i + 1` | 🟡 `SET i = i + 1;` | 🟡 |

> [!warning] 🔴 Este deck es el primero que **no se puede leer "traduciendo palabras"**
> Los decks 03, 04 y 05 pedían cambiar una cláusula por otra (`ALTER COLUMN … TYPE` → `MODIFY`). Este
> pide **reescribir la estructura**: sin `%rowtype` hay que enumerar columnas; sin `FOR` hay que
> armar un cursor con handler; sin `RETURNS TABLE` hay que cambiar la función por un procedimiento y
> el retorno por una tabla temporal.
>
> **De las ~20 construcciones del deck, tres se tipean igual**: `IF/END IF`, `OPEN/FETCH/CLOSE` y el
> `RETURN` escalar. Todo lo demás cambia. Ver [[MySQL]] § *6 · SQL procedural*.

---

## Slides 14–19 · Los cuatro niveles de restricción

> [!important] 🎯 Es **la misma jerarquía del slide 15 del deck 09**, con otro vocabulario
> No es un eje nuevo: son las mismas cuatro casillas, en el mismo orden, con el mismo criterio de
> decisión —*cuánto hay que mirar para saber si la restricción se cumple*—. Por eso **no lleva página
> de concepto propia**: va a [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] como
> columna de sinónimos y segunda cita.
>
> | Nivel | **Clase 09** *(slides 15, 17–24)* | **Clase 10** *(slides 14–19)* | Ámbito |
> | :---: | --- | --- | --- |
> | 1 | RI de **dominio** — `CREATE DOMAIN` · `CHECK` de columna | **A nivel de Atributo** | un **atributo** |
> | 2 | **`CHECK` de registro** — *"combinación de atributos en una tupla"* | **A nivel de Fila** — *"entre columnas de una misma fila o tupla"* | una **tupla** |
> | 3 | **`CHECK` de tabla** — *"diferentes tuplas de una misma tabla"* | **A nivel de Tabla** — *"de UNA sola tabla"* | una **tabla** |
> | 4 | **`ASSERTION`** — *"número arbitrario de tablas"* | **Generales ( ASSERTIONS )** — *"de MÁS DE UNA tabla"* | la **base de datos** |
>
> **Cómo se sabe que es un eje solo y no dos:** la Clase 09 sí tiene dos ejes ortogonales *(naturaleza
> × estados, slides 4–5)*, y se cruzan en una matriz con todas las celdas llenas. Cruzar estos cuatro
> niveles con la jerarquía del slide 15 daría **una matriz 4×4 con doce celdas vacías**. Es la misma
> clasificación dicha dos veces.
>
> **Dos diferencias que sí importan:**
> 1. **La Clase 10 borra `CREATE DOMAIN`.** Su nivel 1 se implementa con un `CHECK` de columna, que
>    es la única de las tres formas del slide 19 del deck 09 que **existe en MySQL**. Señal sobre qué
>    se toma: cuando la cátedra resume, se queda con lo que corre.
> 2. **El vocabulario cambia** — *fila* por *tupla*, *generales* por *base de datos*. El TP6 pregunta
>    con las palabras de la Clase 09; el parcial puede preguntar con las de la Clase 10. **Hay que
>    saber las dos.**

### El argumento en escalera

Los seis slides **no son una taxonomía decorativa**: son un argumento que se derrumba a propósito.

| Nivel | Lo que dice el deck | Estado |
| :---: | --- | --- |
| **1 · atributo** | *"Esto por supuesto que puede ser controlado con triggers, pero **lo más correcto es controlarlo con un constraint**"* | ✅ el constraint alcanza |
| **2 · fila** | *"Esto por supuesto también puede ser controlado por Triggers, pero **sigue siendo** lo más correcto controlarlo con un constraint"* | ✅ el constraint alcanza |
| **3 · tabla** | *"Esto por supuesto también puede ser controlado por triggers, **PERO SIGUE SIENDO** lo más correcto…"* → 🔴 *"**Postgres NO implementa este tipo de checks**"* → *"Entonces….. **Lamentablemente se tendrá que pensar**…"* | ❌ **acá se rompe** |
| **4 · generales** | *"**Ninguna base de datos comercial implementa Assertions.** Se deberá controlar la restricción con **triggers en varias tablas**"* | ❌ roto del todo |

> [!important] 🎯 El énfasis creciente es **la doctrina del slide 37 del deck 09, martillada tres veces**
> *"Un trigger **NO** es una restricción de integridad"* → *"lo más correcto"* → *"**sigue siendo** lo
> más correcto"* → *"**PERO SIGUE SIENDO** lo más correcto"*. Es lo **único** que este deck repite
> del bloque de triggers del deck 09, y lo repite con mayúsculas. **Es la mejor cita disponible para
> el parcial.**

## Slide 14 · Nivel 1 — a nivel de atributo

> [!quote] Textual
> *"Se puede pensar en cuatro tipos de restricciones"*
>
> **1. A nivel de Atributo**
> - *"El Sueldo no puede ser negativo"*
> - *"La fecha de Nacimiento tiene que estar en este siglo"*

```sql
Alter table …. add constraint chk_sueldo check (sueldo >= 0);
```

**En MySQL: ✅ igual, y se hace cumplir desde 8.0.16.** *(Antes se parseaba y se ignoraba en
silencio. La cursada corre 9.7, así que sí se cumple.)*

```sql
ALTER TABLE empleado ADD CONSTRAINT chk_sueldo CHECK (sueldo >= 0);
```

**El segundo ejemplo del slide no tiene su constraint escrito.** Escrito sería —razonamiento propio—
`CHECK (fecha_nacimiento >= '2000-01-01')`, y es un buen ejemplo de por qué el nivel 1 es cómodo: la
condición mira **una sola columna de la fila que se está tocando**, nada más.

## Slide 15 · Nivel 2 — a nivel de fila

> [!quote] Textual
> **2. A nivel de Fila** — *"Involucra el control de una restricción **entre columnas de una misma
> fila o tupla**."*
> - *"La fecha de Ingreso tiene que ser menor que la de egreso."*
> - *"Si el sueldo es mayor que 5000 la comisión tiene que ser 0."*

```sql
Alter table …. add constraint chk_sueldo_comision check
         ( (sueldo > 5000 and comision = 0 ) or (sueldo <= 5000) );
```

**En MySQL: ✅ igual.** Es el caso que MySQL cubre entero.

> [!tip] La condición está escrita como **implicación desarrollada**, y ése es el patrón
> *"si sueldo > 5000 entonces comision = 0"* no se puede escribir con un `IF` en un `CHECK`. Se
> escribe como `(A ∧ B) ∨ ¬A`, que es lo que hace el slide. La forma canónica equivalente y más corta
> es `NOT (sueldo > 5000) OR comision = 0`, o directamente `sueldo <= 5000 OR comision = 0`.
>
> Es primo hermano del patrón `(col IS NULL) OR (condición)` que la
> [[Clase 09 - Restricciones integridad-Parte 1]] identificó en su slide 21: **toda RI condicional se
> escribe como disyunción**.

**Erratas y descuidos:** `comision` sin tilde en el código *(la prosa del slide sí la lleva)*; el
primer ejemplo enunciado —fecha de ingreso < fecha de egreso— **no tiene constraint escrito**; y el
nombre `chk_sueldo_comision` **se va a repetir mal en el slide 17**, donde el `CHECK` ya no tiene
nada que ver con sueldo ni comisión.

## Slides 16–17 · Nivel 3 — a nivel de tabla

> [!quote] Textual del slide 16
> **3. A nivel de Tabla** — *"Involucra el control de una restricción de **UNA sola tabla**."*
> - *"El promedio de edad de cada Departamento no **pude** ser mayor que 50 años."* **[sic]**
> - *"Ningún empleado puede ganar más que su jefe."*

### El diagrama del slide 16 — contenido que **el texto extraído perdió entero**

A la izquierda hay una captura del modelo de datos en notación **IDEF1X/ERwin** *(la misma familia de
diagramas del TP)*. No es decoración: es lo que hace legibles los dos ejemplos.

```
EMPLEADO                          [caja de esquinas RECTAS = entidad independiente]
 ── id_empleado: NOT NULL          ← PK (compartimento superior)
 ─────────────────────────────
    nombre: NULL
    apellido: NOT NULL
    porc_comision: NULL           ← la "comisión" del slide 15
    sueldo: NULL                  ← el "sueldo" de los slides 14 y 15
    e_mail: NOT NULL
    id_tarea: NOT NULL (FK)
    fecha_nacimiento: NOT NULL    ← la del CHECK del slide 17
    telefono: NULL
    id_departamento: NOT NULL (FK)
    id_distribuidor: NOT NULL (FK)
    id_jefe: NULL (FK)            ← auto-relación: es lo que hace posible "ganar más que su jefe"
```

Los `(FK)` van en rojo. De la caja salen tres conectores, uno de los cuales **vuelve sobre la propia
entidad**: la auto-relación jefe/empleado vía `id_jefe`.

> [!note] Los dos ejemplos del slide 16 **son de naturaleza distinta**, y el deck los pone juntos
> - *"promedio de edad por departamento"* es una restricción **agregada sobre grupos** → `GROUP BY` +
>   `HAVING`.
> - *"ningún empleado gana más que su jefe"* es una **comparación entre filas** de la misma tabla vía
>   la auto-relación → self-join, el mismo recurso del slide 24 del deck 09.
>
> Están juntos porque los dos **involucran más de una fila de UNA sola tabla**, que es la definición
> del nivel. El criterio del nivel es el ámbito, no la forma de la consulta.

### El SQL *(slide 17 — es continuación, va sin título)*

**Transcripción literal:**

```sql
Alter table EMPLEADO add constraint chk_sueldo_comision check not exists (
    select 1
    from empleado
    group by id_distribuidor, id_departamento
    having avg( months_between ( sysdate, fecha_nacimiento ) ) > (50 * 12) );
```

Y debajo, en texto blanco sobre el fondo:

> [!quote] 🔴 El descargo, textual — **es la frase más importante del deck para el vault**
> *"**Postgres NO implementa este tipo de checks, Postgres no permite un select dentro de un
> constraint**…. ☹"*
> *"Entonces….."*
> *"Lamentablemente se tendrá que pensar…. se deberá analizar **ante qué eventos y en qué tiempo** se
> debe disparar **él o los triggers** asociados a EMPLEADO"*

> [!bug] 🔴 **Tres motores en un solo slide, y ninguno es el de la cursada**
> | | Qué hay | Problema |
> | --- | --- | --- |
> | 🔶 **Oracle** | `months_between ( sysdate, fecha_nacimiento )` | **ninguna de las dos funciones existe en PostgreSQL ni en MySQL.** `sysdate` sin paréntesis es Oracle |
> | 📘 **SQL-92** | `CHECK` con subconsulta | está en el estándar; **prácticamente ningún motor lo implementa** |
> | 🐘 **PostgreSQL** | el descargo de arriba | nombrado **por la negativa** |
>
> O sea: **el deck escribe un ejemplo en sintaxis Oracle para después explicar que Postgres no lo
> soporta** — y la sentencia tampoco correría en Oracle, que también prohíbe subconsultas en un
> `CHECK`. **No compila en ningún motor, por dos razones distintas, y el deck nombra solo una.**
>
> Encima el constraint se llama **`chk_sueldo_comision`**, copy-paste del slide 15, cuando lo que
> chequea es el promedio de edad por departamento. Y `check not exists (…)` **le falta un paréntesis**:
> el estándar pide `CHECK (NOT EXISTS (…))`.

> [!important] 🔴 Esta frase **corrigió cinco afirmaciones del vault** — aplicado el 02/09
> El vault venía diciendo, en cinco lugares, que el corte *"atributo y tupla ✅ · tabla y BD ❌"* era
> **el corte de MySQL** — dando a entender que en PostgreSQL sí se podría. **Corregido el 02/09** en:
>
> - [[Clase 09 - Restricciones integridad-Parte 1]] § *`CHECK` — el corte* y § *La jerarquía*
> - [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] § *En MySQL*
> - [[1.09.01 - Restricciones de integridad|Restricciones de integridad]] § *En MySQL*
>
> **Ninguna era falsa** —MySQL efectivamente lo prohíbe— pero **todas encuadran mal el fenómeno**. Lo
> correcto es: **de ámbito tabla para arriba se va a trigger en cualquier motor.** Es exactamente el
> mismo estatus que `CREATE ASSERTION`, que el vault ya rotula bien como *"no existe en ninguno"*.
>
> Consecuencia práctica para el TP6/TP7: la respuesta al **3.c del TP6** no es *"MySQL se queda
> corto"*, es *"el corte es del modelo, no del motor"*. Y estos seis slides son **la respuesta
> canónica** a esa pregunta.

### Cómo se escribe en MySQL — hay que ir a triggers

El cálculo primero, que cambia de forma:

| Del slide *(Oracle)* | En **MySQL** |
| --- | --- |
| `months_between(sysdate, fecha_nacimiento)` | `TIMESTAMPDIFF(MONTH, fecha_nacimiento, CURDATE())` |
| | ⚠️ **el orden de los argumentos se invierte**: `TIMESTAMPDIFF(unidad, desde, hasta)` |
| `> (50 * 12)` | igual — compara **meses contra 600**, o sea 50 años en meses |

*(MySQL sí tiene `SYSDATE()`, **con paréntesis**, y no es igual a `NOW()`: se evalúa al ejecutar la
función, no al empezar la sentencia. Para esto conviene `CURDATE()`.)*

Y la restricción entera, ya como triggers:

```sql
DELIMITER $$
CREATE TRIGGER trg_empleado_edad_ins BEFORE INSERT ON empleado
FOR EACH ROW
BEGIN
  DECLARE prom DECIMAL(10,2);
  SELECT AVG(TIMESTAMPDIFF(MONTH, e.fecha_nacimiento, CURDATE()))
    INTO prom
  FROM   empleado e
  WHERE  e.id_distribuidor = NEW.id_distribuidor
    AND  e.id_departamento = NEW.id_departamento;
  IF prom > 600 THEN
     SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El promedio de edad del departamento supera los 50 años';
  END IF;
END$$
DELIMITER ;
```

> [!warning] 🔴 Hacen falta **tres** triggers, no dos — el vault lo tenía mal, y se corrigió el 02/09
> [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] § *En MySQL* decía que un `CHECK`
> de tabla se suple con *"trigger `BEFORE INSERT` + `BEFORE UPDATE`"*. **Faltaba el `DELETE`**, y el
> ejemplo de este slide lo prueba: **borrar a un empleado joven sube el promedio de edad** y viola la
> restricción sin insertar ni actualizar nada. **Ya dice *"y por cada evento que pueda violarla,
> `DELETE` incluido"*.**
>
> El propio vault ya lo sabía y se contradecía: [[Clase 09 - Restricciones integridad-Parte 1]]
> § *`CHECK` de tabla* dice que uno *"**sí** se puede violar borrando"*. Y el slide 17 lo dice
> con todas las letras: *"se deberá analizar **ante qué eventos**… **él o los triggers**"*.
>
> | Nivel | ¿Qué eventos lo pueden violar? |
> | --- | --- |
> | atributo / fila | `INSERT`, `UPDATE` — **nunca `DELETE`**: solo mira la fila que se toca |
> | **tabla** | `INSERT`, `UPDATE` **y `DELETE`** — mira el conjunto |
> | **generales** | los tres, **en cada tabla involucrada** *(slide 19)* |

**Dos cosas de MySQL que el deck no menciona y el TP7 va a necesitar:**
- **`SIGNAL SQLSTATE '45000'`** es la forma de abortar la operación desde el trigger. Sin él, el
  trigger detecta la violación y no hace nada.
- ⚠️ **Un trigger no puede modificar la tabla que disparó la sentencia** *(error 1442)*. **Leerla**
  desde una subconsulta debería estar permitido —que es lo que hace el trigger de arriba— pero
  conviene verificarlo antes de confiar: es lo primero que hay que probar del TP7. → duda abierta.

## Slides 18–19 · Nivel 4 — generales (`ASSERTIONS`)

> [!quote] Textual del slide 18
> **4. Generales ( ASSERTIONS )** — *"Involucra el control de una restricción de **MÁS DE UNA
> tabla**."*
> - *"Todos los empleados deben trabajar en el mismo Departamento que el jefe del Departamento."*
>
> Y en el recuadro: ***"Ninguna base de datos comercial implementa Assertions. Se deberá controlar la
> restricción con triggers en varias tablas."***

**Transcripción literal:**

```sql
Create Assertion ast_empleado_jefe check not exists (
    select 1
    from empleado e
      join departamento d on ( …. ) // empleado con departamento
      join empleado j on ( …. )  // departamento con empleado (jefe)
    where ( ( e.id_departamento <> j.id_departamento) or
             (e.id_distribuidor <> j.id_distribuidor) )

);
```

### El diagrama del slide 18 — el ciclo que hace falta la assertion

Segunda captura IDEF1X, esta vez con **dos** entidades:

```
DEPARTAMENTO                       [esquinas REDONDEADAS = entidad DEPENDIENTE de identificación]
 ── id_distribuidor: NOT NULL (FK)  ┐ PK compuesta
    id_departamento: NOT NULL       ┘
 ─────────────────────────────
    nombre_departamento: NOT NULL
    calle: NULL / número: NULL
    id_ciudad: NOT NULL (FK)
    jefe_departamento: NOT NULL (FK)  ──┐
                                        │  el ciclo
EMPLEADO  (la misma del slide 16)       │
    id_departamento / id_distribuidor (FK) ──┘
    id_jefe: NULL (FK)
```

> [!important] El ciclo es lo que explica el ejemplo
> **`DEPARTAMENTO.jefe_departamento` apunta a un `EMPLEADO`**, y **`EMPLEADO.(id_distribuidor,
> id_departamento)` apunta a un `DEPARTAMENTO`**. Nada impide que el jefe de un departamento esté
> asignado a **otro** departamento: las dos FKs son independientes. Eso es exactamente lo que la
> assertion detecta.
>
> Y las **esquinas redondeadas** de `DEPARTAMENTO` no son estética: en IDEF1X marcan **entidad
> dependiente de identificación**, coherente con que su PK incluya el FK `id_distribuidor`. Eso
> explica por qué la condición compara **las dos** columnas de la PK compuesta, no solo
> `id_departamento`.

### Slide 19 — por qué hacen falta triggers en **las dos** tablas

> [!quote] Textual *(el slide va sin título, es continuación del 18)*
> *"Se deben generar triggers en DEPARTAMENTO y en EMPLEADO para que controlen esta restricción, ya
> que si **sólo se hiciera sólo en una** [sic], por ejemplo EMPLEADO, uno podría cambiar el jefe en
> la tabla de DEPARTAMENTO y el trigger en Empleado no se despertaría."*
>
> *"Claramente se deberá analizar la **granularidad, eventos y tiempo de activación** de cada trigger
> involucrado."*

> [!important] 🎯 Esto **cierra una duda del vault** y deja de ser razonamiento propio
> [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] § *`CREATE ASSERTION`* afirmaba
> *"hace falta un trigger por evento y por tabla involucrada"* como consecuencia inferida.
> **Actualizado el 02/09 con la cita del slide 19.** Ahora tiene
> cita, y con el contraejemplo concreto**: un trigger puesto solo en `EMPLEADO` **no se entera** de un
> `UPDATE` sobre `DEPARTAMENTO.jefe_departamento`, así que la restricción se viola *"por el otro
> lado"*.
>
> Es la regla general: **una restricción que cruza N tablas necesita triggers en las N tablas**, y en
> cada una, sobre todos los eventos que la puedan romper.

**Y el cierre repite los tres ejes de diseño de un trigger**, que este deck **no define** y el deck 09
sí *(slides 28–29)*:

| Eje | Opciones del estándar | En **MySQL** |
| --- | --- | --- |
| **Granularidad** | `FOR EACH ROW` · `FOR EACH STATEMENT` | 🔴 **solo `FOR EACH ROW`** |
| **Eventos** | `INSERT` · `UPDATE` · `DELETE` *(combinables)* | 🟡 **uno por trigger** |
| **Tiempo de activación** | `BEFORE` · `AFTER` · diferido | 🟡 `BEFORE`/`AFTER`, **sin diferido** |

> [!note] De los tres ejes, MySQL solo deja elegir dos — y el TP7 lo asume
> El enunciado del **TP 7** pide razonar `FOR EACH STATEMENT` **dos veces**, avisando que no existe:
> ej. **1.c** *"(aunque MySQL no soporta esta última opción, resuelvalo según la teoría)"* y ej.
> **2.b** *"for each statement (aunque MySQL no lo soporta, responda según la teoría)"*.
>
> 🎯 **Es la segunda y tercera vez que la cátedra reconoce el desfasaje por escrito** —la primera fue
> el 3.c del TP6— y con eso deja de ser una anécdota: **es el método**. *La teoría en el estándar, la
> implementación en MySQL, y la brecha entre las dos se nombra.* Detalle en [[Práctica 2026-09-01]].
>
> *(Dato que no está en el deck: desde MySQL **5.7** se admiten **varios triggers para el mismo evento
> y timing** sobre una tabla, con `FOLLOWS`/`PRECEDES`. Antes era uno solo — y eso condicionaría todo
> el punto 1 del TP7.)*

## Slide 20 · Cierre

> [!quote] Textual
> *"Preguntas ??"*
> *"Links"*
> *"http://www.postgresqltutorial.com"*
> *"http://www.postgresql.com"* **[sic]**

> [!bug] El segundo link está mal: el sitio oficial es **postgresql.org**
> `postgresql.com` **no es de la comunidad de PostgreSQL**. La transcripción lo conserva tal cual
> —es lo que dice el deck— pero **no hay que ir ahí**: la documentación oficial vive en
> `https://www.postgresql.org/docs/`.

**Y el deck no declara bibliografía.** El slide 39 del deck 09 listaba cinco fuentes; éste cierra con
dos links y nada más. Los dos apuntan a PostgreSQL; **ninguna referencia a MySQL en todo el deck**.

---

## Cuadro de bolsillo — todo el deck en una pantalla

| Pregunta | Respuesta |
| --- | --- |
| ¿Qué es SQL procedural? | Código procedural **almacenado en la BD** y **ejecutado por el DBMS** cuando se lo invoca |
| Su ventaja cuantificada | *"Eficiencia ( en general, cerca de un órden de magnitud )"* — **sin fuente ni condiciones** |
| Su desventaja estructural | *"Cada proveedor de BD tiene su propio lenguaje procedural"* |
| Las **tres** cosas que define | **Trigger** · **Stored procedure** · **Función** |
| El criterio que las separa | **quién las invoca**: el DBMS · el usuario · cualquiera |
| ¿Qué va a trigger? | Valores calculados del negocio; reglas **no expresables en SQL declarativo** |
| ¿Qué va a procedimiento? | Todo lo que necesite **control de flujo**: reportes, cálculos intensivos, abstracción de tablas |
| Extensiones de SQL-1999 | `BEGIN…END` · variables y constantes · `if`/`elsif` · `while` · `for` · `loop` · `repeat` |
| En Postgres, ¿procedimiento o función? | *"Todos son funciones, sólo que hay funciones que devuelven **void**"* *(cierto hasta PG 10)* |
| En **MySQL**, ¿procedimiento o función? | **Dos objetos distintos**: `CALL p(…)` vs. `SELECT f(…)` |
| Qué es `$$` | **Dollar quoting** de PostgreSQL, para no escapar el cuerpo. **En MySQL no existe** |
| Qué es un **cursor** | Variable que recorre un conjunto de filas **secuencialmente y sin volver atrás** |
| Su tipo en PL/pgSQL | **`refcursor`**, siempre |
| Las 3 formas de declararlo | **genérico** (`refcursor`) · **bounded** (`CURSOR FOR …`) · **parametrizado** (`CURSOR (k int) …`) |
| Las 3 formas de abrirlo | `OPEN c FOR SELECT …` · `OPEN c FOR EXECUTE '…'` · `OPEN c;` / `OPEN c(4444);` |
| El ciclo completo | **`OPEN` → `FETCH … INTO` → `CLOSE`**, preguntando por **`FOUND`** |
| `FOUND` en MySQL | ❌ no existe → `DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;` **y la lógica se invierte** |
| Función que devuelve tabla | `RETURNS TABLE(…)` + **`RETURN QUERY`** *(de una)* o **`RETURN NEXT`** *(fila a fila)* |
| Eso en MySQL | ❌ no existe → **`PROCEDURE`** cuyo **último `SELECT`** es el result set |
| Lo único que se tipea igual en MySQL | `IF/END IF` · `OPEN/FETCH/CLOSE` · `RETURN` escalar · `%` / `MOD` · `UPPER()` |
| Los **4 niveles de restricción** | **atributo → fila → tabla → generales (ASSERTIONS)** |
| ¿Es un eje nuevo? | **No.** Es la jerarquía `atributo→tupla→tabla→BD` del deck 09 con otro vocabulario |
| Cómo se elige el nivel | **contar tablas y filas**: 1 fila → fila; 1 tabla N filas → tabla; N tablas → assertion |
| ¿Constraint o trigger? | **Constraint siempre que se pueda.** El deck lo repite **tres veces** con énfasis creciente |
| ¿Dónde se rompe la escalera? | En el **nivel 3**: *"Postgres NO implementa este tipo de checks"* |
| ¿De quién es esa limitación? | 🔴 **De todos los motores.** MySQL tampoco admite subconsultas en un `CHECK` |
| `CREATE ASSERTION` | *"**Ninguna** base de datos comercial implementa Assertions"* → triggers en varias tablas |
| ¿Por qué en **varias** tablas? | Porque un trigger en `EMPLEADO` **no se despierta** si se cambia el jefe en `DEPARTAMENTO` |
| Los 3 ejes de diseño de un trigger | **granularidad · eventos · tiempo de activación** *(definidos en el deck 09, no en éste)* |
| ¿Cuántos deja elegir MySQL? | **Dos y medio**: `FOR EACH ROW` fijo, un evento por trigger, `BEFORE`/`AFTER` sin diferido |

---

## Erratas del deck — inventario completo

Se transcriben `[sic]` en toda la página; ninguna se corrige en las citas. **Están acá porque en el
TP7 se van a copiar fragmentos de estos slides.**

| Slide | Errata | Lo correcto |
| :---: | --- | --- |
| 2 | *"órden"* con tilde | *orden* |
| 3 | *"evento **especifico**"* sin tilde *(y en el mismo slide, *"operaciones específicas"* bien)* | *específico* |
| 4 | Lista `repeat` junto a `For`-sobre-resultado | **ningún motor tiene los dos**: PG tiene `FOR`, MySQL tiene `REPEAT` |
| 6 | *"Para Postgres todos son funciones"* | cierto hasta **PG 10**; desde **PG 11** hay `CREATE PROCEDURE` |
| 8 | Comentarios con **`//`** ×4 | `--` o `/* … */` |
| 8 | Fragmento sin `RETURNS`, `AS $$`, `BEGIN`, `END` | **no es compilable**, y el deck no lo aclara |
| 9 | **`curs3 CURSOR (key int) IS …`** | 🔶 `IS` es **Oracle**; PL/pgSQL usa **`FOR`** — la gramática que el propio slide da 4 renglones antes |
| 9 | `(puede utilizarse para cualquier consulta)` sin marca de comentario | necesita `--` |
| 9 | Comentarios con **`//`** ×2 | `--` |
| 10 | **`OPEN CURSOS FOR EXECUTE`** | `CURSOR` |
| 10 | **`“select * from Pais”`** con comillas dobles tipográficas | comilla **simple recta**: en PG las dobles son para **identificadores** |
| 10 | *"GENERICO"* sin tilde | *genérico* |
| 10 | `curs1` se abre **dos veces** sin aclarar que son alternativas | leído de corrido, parece un `OPEN` sobre un cursor abierto |
| 11 | **`menaje :=`** | `mensaje` — 🎯 la función devolvería **siempre** el `DEFAULT` |
| 11 | Falta el `;` de esa asignación, y el `end` va sin `;` | no compila |
| 11 | **`cursor cur1 for select …`** invertido | `cur1 CURSOR FOR select …` |
| 11 | Comillas tipográficas `‘ ’` en los literales | comillas rectas `'` |
| 13 | **`$$; LANGUAGE plpgsql;`** | `$$ LANGUAGE plpgsql;` — el `;` de más deja el `LANGUAGE` colgado |
| 16 | *"no **pude** ser mayor"* | *puede* |
| 17 | 🔶 **`months_between ( sysdate, … )`** | **Oracle**: no existe en PG ni en MySQL |
| 17 | Constraint llamado **`chk_sueldo_comision`** | copy-paste del slide 15; chequea promedio de edad |
| 17 y 18 | **`check not exists (…)`** sin paréntesis | `CHECK (NOT EXISTS (…))` |
| 18 | Comentarios con **`//`** ×2 | `--` |
| 19 | *"si **sólo** se hiciera **sólo** en una"* | *"sólo"* repetido |
| 20 | **`http://www.postgresql.com`** | **`postgresql.org`** — el `.com` no es de la comunidad |

**Total: 25 erratas en 20 slides**, de las cuales **11 impiden que el código compile** y **una
—`menaje`— produce un bug silencioso**. Es, por lejos, el deck más descuidado del vault.

---

## Dudas abiertas

- [ ] 🔴 **¿El trigger del TP7 ej. 2 corre en MySQL, o lo frena el error 1442?** El enunciado pone un
      trigger sobre `empleado_1` que **lee** `empleado_1` en una subconsulta. Modificar la tabla que
      disparó la sentencia está prohibido; **leerla debería estar permitido, pero hay que
      verificarlo**. De eso depende que el ejercicio se pueda ejecutar o haya que resolverlo en papel.
      **Es lo primero que hay que probar del TP7.**
- [ ] 🔴 **¿Se toma PL/pgSQL en el parcial, si el TP7 se resuelve en MySQL?** Este deck es **el primero
      que no se puede leer traduciendo palabras**: `%rowtype`, `%type`, `record`, `refcursor`, cursor
      parametrizado, `FOR`-sobre-resultado y `RETURNS TABLE` **no tienen sustituto** en MySQL, hay que
      reescribir la estructura. El TP7 avisa dos veces que MySQL no soporta `FOR EACH STATEMENT` y
      pide *"responda según la teoría"*: el patrón sugiere **teoría en el estándar, código en MySQL**.
      **Confirmarlo antes del parcial del 13/10.**
- [ ] 🔴 **¿Los cursores entran al parcial?** Es un tema nuevo, con vocabulario cerrado y tres slides
      propios — o sea, con forma de pregunta de parcial. **De dónde estudiarlos ya no es la duda:**
      GMUW **9.3.6** *Cursors* (383–386) es la definición del slide 9 en el estándar, y **GMUW
      9.4.4–9.4.6** ponen el cursor adentro de un procedimiento *(y **9.4.5** es la fuente del
      `FOUND`)*. Lo que **no** está en ningún libro del vault es la **extensión de PostgreSQL** que
      usa el deck —`refcursor`, cursor parametrizado, `OPEN … FOR EXECUTE`—: eso sale del manual de
      PostgreSQL **§ 41.7** o del de MySQL **§ 15.6.6**. **Lo que sigue abierto es si entran, no de
      dónde estudiarlos.** Ver [[_index-bibliografia]] › Clase 10 y
      [[1.10.03 - Cursores|Cursores]].
- [ ] 🔴 **¿Por qué el archivo se llama *"Restricciones integridad-Parte 2"* si su portada dice
      *"SQL PROCEDURAL"*?** ¿Es un nombre heredado del deck anterior, o **falta un deck de
      restricciones** que la cátedra todavía no subió? El deck 09 tenía 39 slides y este 20; entre los
      dos hay una asimetría grande. **Preguntarle al humano si hay más material.**
- [ ] 🔴 **`INSTEAD OF` sigue sin resolverse.** [[1.06.01 - Vistas|Vistas]] § *`INSTEAD OF`* daba el
      tema por *"pendiente de la teórica de triggers y SQL procedural del 31/08"*. **La teórica llegó
      y no menciona vistas ni `INSTEAD OF` ni una sola vez.** **Corregido el 02/09** en
      [[1.06.01 - Vistas|Vistas]] § *`INSTEAD OF`* *(callout `[!failure]`)*, donde además quedó
      completada la mitad práctica —el *stored procedure* como equivalente funcional, que ahora tiene
      sintaxis → [[1.10.02 - Stored procedures y funciones|Stored procedures y funciones]]—.
      **Lo que sigue abierto es la duda misma**: si hace falta `INSTEAD OF` para el parcial, sale de
      la [[Clase 07 - Vistas-Parte 2|Clase 07]], de la bibliografía o de preguntar.
- [ ] **¿Qué pide el TP7 ej. 3.d, `PROCEDURE` o `FUNCTION`?** El deck dice *"para Postgres todos son
      funciones"* y en MySQL hay que elegir. El cálculo del ejercicio devuelve **dos valores**, lo que
      empuja a `PROCEDURE` con parámetros `OUT` o a dos funciones separadas.
- [ ] **¿MySQL 9.7 admite `CREATE OR REPLACE PROCEDURE` / `FUNCTION`?** En 8.x no existe y hay que
      hacer `DROP … IF EXISTS` antes. Verificar contra el manual 9.7 § 15.1.17.
- [ ] **¿`DECLARE v TEXT DEFAULT '…';` es válido como variable local en MySQL 9.7**, o hay que usar
      `VARCHAR(n)`? El `DEFAULT` sí existe; lo dudoso es `TEXT` como tipo de variable. Manual 9.7
      § 15.6.
- [ ] **La lógica del *"cada x"* del slide 13**: `i` arranca en 0 —la primera fila siempre entra— y
      dentro del `IF` se resetea a 0 antes de incrementarse afuera. ¿El reset es intencional, o el
      ejemplo tiene un bug que nadie notó? El deck no lo comenta.
- [ ] **¿`CREATE DOMAIN` desapareció del temario?** El deck 09 le dedica tres slides *(17–19)*; el
      deck 10, al recorrer la **misma** jerarquía, implementa el nivel 1 con un `CHECK` de columna y
      **no lo menciona**. Puede ser una simplificación coherente con MySQL — o una señal de qué se
      toma. Se cruza con la duda 🔴 del parcial de la [[Clase 09 - Restricciones integridad-Parte 1]].
- [ ] **`:new`/`:old` sigue abierta, y ahora con más peso.** El deck 09 se contradecía entre su slide
      30 *(Oracle)* y su 36 *(PL/pgSQL)*. Este deck agrega **dos filtraciones más de Oracle** *(el
      `IS` del slide 9 y el `months_between(sysdate…)` del 17)*. **Van tres instancias en dos decks
      consecutivos**: ¿la cátedra corrige la sintaxis, o acepta cualquier dialecto mientras la lógica
      esté bien?
- [ ] **Este deck no declara bibliografía** *(el 09 sí, en su slide 39)*. ¿Se asume la misma, o los
      dos links a PostgreSQL son toda la fuente? Afecta al mapeo de [[_index-bibliografia]] › Clase 10.

## Enlaces

- Clase anterior: [[Clase 09 - Restricciones integridad-Parte 1]] · clase siguiente: *(la del 07/09,
  todavía sin material)*
- Práctica de esa semana (martes 01/09): **[[Práctica 2026-09-01]]** — TP 7 Restricciones avanzadas
- Conceptos que **nacen** en esta clase: [[1.10.01 - SQL procedural|SQL procedural]] ·
  [[1.10.02 - Stored procedures y funciones|Stored procedures y funciones]] ·
  [[1.10.03 - Cursores|Cursores]]
- Conceptos que esta clase **reencuadra**: [[1.09.04 - Triggers|Triggers]] *(el lenguaje del cuerpo,
  y la doctrina «constraint antes que trigger» repetida tres veces)* ·
  [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] *(los cuatro niveles como
  sinónimos, y el corte que no es de MySQL)* ·
  [[1.09.01 - Restricciones de integridad|Restricciones de integridad]] ·
  [[1.06.01 - Vistas|Vistas]] *(el stored procedure como sustituto del `INSTEAD OF`)* ·
  [[1.03.02 - DDL — creación y alteración de tablas|DDL]] *(`ALTER TABLE … ADD CONSTRAINT`)*
- Motores: [[MySQL]] § *6 · SQL procedural* *(la traducción completa)* · [[PostgreSQL]] §
  *Inventario* *(fila del deck 10)*
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
