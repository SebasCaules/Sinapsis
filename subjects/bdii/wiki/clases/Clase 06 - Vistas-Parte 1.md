---
tipo: teorica
clase: 6
deck: "BD2_Clase 06 - Vistas-Parte 1.pdf"
unidad: 1
tema: "Vistas: concepto, CREATE VIEW, esquema externo"
resumen: "Vistas como relación derivada y tabla virtual del esquema externo: CREATE VIEW, DROP VIEW y el problema real, actualizarlas. Son actualizables las vistas σ-π que preservan la clave (propiedad del esquema, no de los datos), y WITH CHECK OPTION frena la migración de tuplas."
fecha: 2026-08-10
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 06
  - Clase 06 — Vistas
  - Vistas Parte 1
  - CREATE VIEW
  - WITH CHECK OPTION
  - WCO
  - Vistas actualizables
  - Migración de tuplas
  - Vistas sigma-pi
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 06 - Vistas-Parte 1.pdf"
estado: procesado
---

# Clase 06 — Vistas (Parte 1)

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 06 - Vistas-Parte 1.pdf` · **18 slides**
> El slide 1 es la **portada** (*"Bases de Datos II · Vistas"*, sin contenido); el recorrido de abajo
> arranca en el slide 2 y llega al 18.
> Dictado en la **teórica del lunes 10/08**. El `06` del nombre del archivo **es el número de clase**:
> la cátedra numera sus decks y ésa es la única numeración de clases que existe.
> El mismo lunes se dictaron también la [[Clase 07 - Vistas-Parte 2]] (vistas, segunda clase del tema) y la
> [[Clase 08 - Explicando el plan]] (índices y plan de ejecución): varias clases pueden caer en la misma fecha.
> Clase anterior: [[Clase 05 - Consultas de Datos–Parte 3]]. Se practica con el **TP4 Vistas** del martes
> 11/08 → [[Práctica 2026-08-11]].
> Bibliografía: [[_index-bibliografia]].

> [!info] Las Clases 01–08 viven todas en `raw/Unidad-01/Teorica/`
> No es un error de archivado: una carpeta de unidad **agrupa varias clases**, y la Unidad-01 agrupa
> las Clases 01 a 08. El path no dice a qué clase pertenece un archivo — eso lo registra
> [[_index-clases]].

> [!quote] La bibliografía que declara el deck (slide 18)
> - Date, C., *"An Introduction to Database Systems"*. 8º ed., Addison Wesley, 2004
> - Elmasri, R., Navathe, S., *"Fundamentals of Database Systems"*, Addison Wesley, 2011 **(Cap. 5)**
> - Ramakrishnan R., Gehrke J., *"Database Management Systems"*, 3° ed., McGraw-Hill, 2003 **(Cap. 3 y 25)**
> - Silberschatz, A., Korth, H, Sudarshan, S., *"Database System Concepts"*, McGraw Hill, 2001 **(Cap. 4)**
>
> Los capítulos entre paréntesis son los que **el propio slide** resalta. **No verifiqué ninguno contra
> las fichas del vault** — el mapeo real va en [[_index-bibliografia]].

## Resumen

Una **vista** es una **relación derivada**: una consulta a la que se le pone nombre. Vive en el
**esquema externo** (nivel externo de la arquitectura de tres niveles) y sirve para mostrarle a cada
grupo de usuarios sólo la parte de la BD que le interesa, ocultando el resto. Es una **tabla virtual**:
no guarda datos, las tuplas se generan al operar sobre ella.

Consultar una vista es gratis conceptualmente — se consulta *como cualquier tabla*. **El problema real
del tema es actualizarla**: las modificaciones sobre la vista tienen que propagarse a las tablas base
sin ambigüedad, y eso no siempre se puede. El criterio genérico que decide si se puede es la
**preservación de la clave**. Y aun cuando la vista *sea* actualizable, aparece un segundo problema —
la **migración de tuplas** — que se ataja con **`WITH CHECK OPTION`**.

| Sección del deck | Qué establece | Slides |
| --- | --- | --- |
| **Esquema externo** | Las vistas son el nivel externo de los tres niveles | 2 |
| **Concepto de vista** | Relación derivada · tabla virtual · no materializada | 3 |
| **`CREATE VIEW`** | Sintaxis, renombrado de columnas, reglas de nombres | 4 |
| **Ejemplos de creación** | Sobre una tabla · sobre otra vista · sobre varias tablas | 5–6 |
| **Consulta y `DROP VIEW`** | `RESTRICT` (default) vs. `CASCADE` | 7 |
| **Tabla base → vista** | Los cambios se reflejan solos: recálculo o mantenimiento incremental | 8 |
| **Vista → tabla base** | Las ambigüedades que impiden propagar | 9–10 |
| **Preservación de clave** | La condición estructural de actualizabilidad | 11 |
| **Vistas actualizables** | Las 4 condiciones del estándar SQL · vistas **σ-π** | 12–13 |
| **Migración de tuplas** | La tupla actualizada deja de pertenecer a la vista | 14 |
| **`WITH CHECK OPTION`** | `CASCADED` (default) vs. `LOCAL` · dos ejercicios | 15–17 |

---

## El esquema de ejemplo (diagramas laterales de los slides 5, 6, 13, 16, 17)

Cinco slides traen a la derecha el **mismo diagrama** de tres tablas. Es el esquema contra el que se
escriben *todos* los ejemplos del deck, así que va primero.

**`PROVEEDOR`**

| Columna | Tipo | Nulos | Rol |
| --- | --- | --- | --- |
| `id_proveedor` | `VARCHAR(10)` | `NOT NULL` | **PK** *(ícono de llave)* |
| `nombre` | `VARCHAR(30)` | `NOT NULL` | |
| `rubro` | `VARCHAR(15)` | `NOT NULL` | |
| `ciudad` | `VARCHAR(30)` | `NOT NULL` | |

**`ENVIO`**

| Columna | Tipo | Nulos | Rol |
| --- | --- | --- | --- |
| `id_proveedor` | `VARCHAR(10)` | `NOT NULL` | **PK + FK** *(marcado `(FK)` en rojo)* |
| `id_articulo` | `VARCHAR(10)` | `NOT NULL` | **PK + FK** *(marcado `(FK)` en rojo)* |
| `cantidad` | `NUMERIC(5,0)` | `NOT NULL` | |

**`ARTICULO`**

| Columna | Tipo | Nulos | Rol |
| --- | --- | --- | --- |
| `id_articulo` | `VARCHAR(10)` | `NOT NULL` | **PK** *(ícono de llave)* |
| `descrip` | `VARCHAR(30)` | `NOT NULL` | |
| `peso` | `NUMERIC(5,2)` | `NOT NULL` | |
| `ciudad` | `VARCHAR(30)` | `NOT NULL` | |

```
PROVEEDOR ──┼──o<── ENVIO ──>o──┼── ARTICULO
   (1)                              (1)
```

> [!note] Cómo leer ese diagrama — razonamiento propio, no está en el deck
> La notación del diagrama es **pata de gallo (crow's foot)**, no la que usa la cátedra para el MER en
> la [[Clase 02 - Modelo Entidad-Relacion]]:
> el trazo `┼` del lado de `PROVEEDOR` y `ARTICULO` es *exactamente uno*, y el `o<` del lado de `ENVIO`
> es *cero o muchos*. O sea `ENVIO` es la tabla de cruce N:N entre proveedores y artículos, con
> `(id_proveedor, id_articulo)` como **clave primaria compuesta** y `cantidad` como atributo de la
> relación. **Esto importa para el resto del deck**: la clave de `ENVIO` son las dos columnas juntas.

> [!important] `ciudad` está en dos tablas
> Aparece en `PROVEEDOR` y en `ARTICULO`. Es justo el caso que el slide 4 obliga a resolver: *"se debe
> especificar con diferente nombre las columnas provenientes de distintas tablas pero con igual
> nombre"*.

---

## Slide 2 · Vistas – Esquema Externo

- **Forman parte del *esquema externo*** de la base de datos.
- **Presentan** una parte de la BD que es de interés para **grupos particulares de usuarios**
  (**ocultando** el resto de la información).

El slide ilustra esto con el diagrama clásico de los **tres niveles**, con el **nivel externo
recuadrado en rojo** (es el nivel donde viven las vistas):

```
   👥  👤  🖥️            ← distintos grupos de usuarios
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │External View1│ │External View2│ │External View3│   ◀── NIVEL EXTERNO
 └──────▲───────┘ └──────▲───────┘ └──────▲───────┘
        └──── logical to external mappings ────┘
 ┌───────┐         ┌──────────────┐
 │ tabla │ ◀────▶  │ Logical Schema│                  ◀── NIVEL CONCEPTUAL
 └───────┘         └──────▲───────┘
                internal to logical mapping
 ┌───────┐         ┌───────────────┐
 │ disk  │ ◀────▶  │Internal Schema│                  ◀── NIVEL INTERNO
 └───────┘         └───────────────┘
```

> [!quote] Atribución al pie del slide
> *"de: S. Sumathi, S. Esakkirajan, **Fundamentals of Relational Database Management Systems** (2007)"*

> [!missing] Esa fuente no está en el vault
> **Sumathi & Esakkirajan (2007)** no figura en `raw/Material_Catedra/bibliografia/` — ni en
> obligatoria, ni en complementaria, ni en papers. Es una fuente que **la cátedra usa y el vault no
> tiene**. Vale la pena registrarla en [[_index-bibliografia]] como fuente citada-pero-ausente, y
> eventualmente pedirle al humano el PDF. La bibliografía *declarada* del deck (slide 18) tampoco la
> incluye: el diagrama es la única aparición.

Este es el mismo esquema de tres niveles que introdujo la [[Clase 01 - Introducción_BasesDeDatos]]. La conexión
conceptual es la que da
sentido a todo el tema: **una vista es el mecanismo con el que SQL materializa el nivel externo**.
Lo que en la teoría de tres niveles es "vista externa", en SQL se llama `VIEW`.

## Slide 3 · Concepto de Vista

Cuatro afirmaciones, en el orden del slide:

1. Es una **relación derivada** de **una o más tablas y/o vistas definidas previamente**.
2. **Su contenido se define dando un nombre a una expresión de consulta.**
3. Se considera una **tabla virtual** (habitualmente **no materializada**)
   → **las tuplas se generan al operar sobre la vista**.
4. De lo anterior se desprenden tres consecuencias:

| Consecuencia | Textual del slide |
| --- | --- |
| **Consulta** | *"Pueden consultarse como cualquier tabla"* |
| **Actualización** | *"Para poder realizar **actualizaciones** deben cumplirse ciertas condiciones (que surgen de su carácter de datos derivados)"* |
| **Criterio** | *"La característica genérica que define la posibilidad de actualización es la **preservación de la clave** (reconocimiento de la tabla que 'hereda' su clave a la vista)"* |

> [!tip] Las dos palabras que hay que retener del slide
> **"derivada"** y **"virtual"**. Todo el resto del deck es consecuencia de esas dos: si los datos son
> derivados, escribir sobre ellos exige poder deshacer la derivación; si la tabla es virtual, no hay
> dónde guardar la escritura salvo en la tabla base.

> [!note] "habitualmente no materializada"
> El paréntesis es importante: el slide deja abierta la puerta a las **vistas materializadas**, que
> reaparecen en el slide 8. Una vista materializada **sí** guarda una copia física del resultado.
> El deck no las desarrolla acá. → [[Clase 07 - Vistas-Parte 2|Vistas materializadas]]

## Slide 4 · Creación de Vistas — sintaxis

```sql
CREATE VIEW nom_vista [(n_col_1, …, n_col_n)]
AS expresión_consulta
[WITH [opción] CHECK OPTION];
```

| Parte | Qué es |
| --- | --- |
| `nom_vista` | nombre de la vista |
| `(n_col_1, …, n_col_n)` | nombres de columnas de la vista *(opcional)* |
| `expresión_consulta` | **consulta SQL que define la relación derivada** |
| `WITH [opción] CHECK OPTION` | *(opcional — se explica recién en el slide 15)* |

Las **tres reglas de nombres de columna**, textuales:

1. *"Las columnas de la vista se pueden renombrar especificando **la lista completa** de atributos de la
   vista entre paréntesis."*
2. *"Si no, los nombres son los de las columnas de las tablas especificadas en la sentencia SELECT"*
3. *"Se debe especificar con diferente nombre las columnas provenientes de distintas tablas pero con
   igual nombre"*

> [!important] La lista es *completa* o no es
> No se pueden renombrar dos columnas de cinco: o se listan las cinco, o ninguna. Esto explica por qué
> el ejemplo `TOTAL_ARTICULO` del slide 13 escribe `(articulo, total)` y no sólo `(total)`, aun cuando
> lo único que necesitaba nombre era el `sum(cantidad)`.

## Slides 5–6 · Ejemplos de creación

Tres casos, uno por cada origen posible de una vista.

### Vista a partir de **una tabla** (slide 5)

> *"`PROV_COMP` con el identificador, nombre y ciudad de proveedores del rubro computadoras"*

```sql
CREATE VIEW PROV_COMP AS
    SELECT id_proveedor, nombre, ciudad
    FROM  PROVEEDOR
    WHERE rubro = 'Computadoras';
```

### Vista a partir de **otra vista** (slide 5)

> *"`PROV_COMP_TANDIL` con los proveedores de computadoras de Tandil (**usando la vista previa**)"*

```sql
CREATE VIEW PROV_COMP_TANDIL AS
    SELECT *
    FROM  PROV_COMP
    WHERE ciudad = 'Tandil';
```

El `FROM PROV_COMP` está resaltado en negrita azul en el slide: el punto del ejemplo es que el `FROM`
de una vista puede ser **otra vista**, no sólo una tabla.

### Vista a partir de **más de una tabla** (slide 6)

> *"`PROV_ENVIOS_TANDIL` que contenga el identificador y nombre de los proveedores de computadoras de
> Tandil y los identificadores de artículos enviados por cada uno"*

```sql
CREATE VIEW PROV_ENVIOS_TANDIL AS
    SELECT P.id_proveedor, P.nombre, E.id_articulo
    FROM   PROVEEDOR P JOIN ENVIO E
    ON     P.id_proveedor = E.id_proveedor
    WHERE  P.rubro  = 'Computadoras'
    AND    P.ciudad = 'Tandil';
```

Y la **misma vista escrita sobre la vista anterior** — el slide la introduce con un *"o…"*:

```sql
CREATE VIEW PROV_ENVIOS_TANDIL AS
    SELECT P.id_proveedor, nombre, E.id_articulo
    FROM   PR_COMP_TANDIL P JOIN ENVIO E
    ON     P.id_proveedor = E.id_proveedor;
```

La segunda versión **no necesita `WHERE`**: los dos filtros (`rubro` y `ciudad`) ya están adentro de la
vista intermedia. Es el argumento práctico a favor de encadenar vistas.

> [!bug] El deck cambia el nombre de la vista a mitad de camino
> El slide 5 la crea como **`PROV_COMP_TANDIL`** y los slides 6 y 7 la referencian como
> **`PR_COMP_TANDIL`** (sin la `OV`). Son dos identificadores distintos: tal como está escrito, el
> segundo `CREATE VIEW` del slide 6 **fallaría** con *table doesn't exist*. Es un tipeo del deck —
> transcripto tal cual. **Verificar en clase cuál es el nombre canónico.**

> [!bug] Las comillas del deck no son comillas SQL
> El PDF trae comillas tipográficas y **cierres inconsistentes**, distintos en cada slide. Extraído
> carácter por carácter del PDF:
>
> | Slide | Literal tal cual está en el deck | Qué cierra |
> | --- | --- | --- |
> | 5 | `„Computadoras‟` | comilla baja doble ↔ comilla alta invertida |
> | 5 | `'Tandil´` | apóstrofe recto ↔ **acento agudo** |
> | 6 | `„Computadoras‟` · `„Tandil‟` | comilla baja ↔ comilla alta invertida |
> | 13 | `„Tandil‟` · `„Computadoras´` | la segunda cierra con **acento agudo** |
> | 14 | `‘Tandil´` · `„Azul„` | la de `Azul` **abre y cierra con comilla baja** |
> | 16–17 | `‘P1’`, `‘A1’`, `‘P2’`, `‘A2’` | comillas tipográficas de apertura/cierre |
>
> En SQL sólo vale la comilla simple recta `'`. Si se copia y pega del PDF al cliente MySQL, **no
> compila** ninguno de estos ejemplos. En esta página los bloques ```sql``` están transcriptos con
> comillas rectas para que sean ejecutables — **el original está mal en todos los casos**.

## Slide 7 · Consulta y eliminación

### Consultar

> *"Una vista puede ser consultada como cualquier tabla."*

Ejemplo: *"Listar alfabéticamente los proveedores de `PR_COMP_TANDIL`"*

```sql
SELECT nombre
FROM   PR_COMP_TANDIL
ORDER BY nombre;
```

### Eliminar

```sql
DROP VIEW nom_vista [opción];
```

| `opción` | Comportamiento |
| --- | --- |
| **`RESTRICT`** | *"se rechaza si hay objetos que hacen referencia a la vista"* — **opción por defecto** |
| **`CASCADE`** | *"procede siempre y se eliminan también los objetos dependientes"* |

> [!warning] Motor: `RESTRICT` / `CASCADE` en `DROP VIEW` es sintaxis del estándar, y **MySQL las ignora**
> La cursada corre sobre **MySQL** ([[_cronograma]] § Diferencias con el programa oficial). MySQL
> **acepta** `DROP VIEW … RESTRICT` y `… CASCADE` sin error de sintaxis, pero **las palabras clave no
> hacen nada**: el `DROP` procede igual y las vistas que dependían de la borrada quedan *inválidas*
> (fallan recién al consultarlas). PostgreSQL sí implementa las dos semánticas de verdad.
> **Consecuencia práctica para el TP4:** en MySQL no se puede confiar en `RESTRICT` como red de
> seguridad — hay que chequear las dependencias a mano antes de dropear.
> **Verificar en clase / contra la doc de la versión de MySQL que use la cátedra.**

## Slide 8 · Actualizaciones Tabla Base → Vista

La dirección fácil. Textual:

> *"Al actualizar las tuplas de una tabla → **los cambios se reflejan automáticamente sobre las vistas**
> definidas a partir de ella."*

> *"Las vistas no mantienen copias de los datos (**salvo que sean materializadas**)
> → el SGBD asegura que las vistas siempre estén actualizadas."*

Dos mecanismos, según el tipo de vista:

| Mecanismo | Cómo funciona | Aplica a |
| --- | --- | --- |
| **Por recálculo** | *"las tuplas actualizadas se generan al acceder a la vista"* | vistas normales (virtuales) |
| **Por mantenimiento incremental** | el SGBD propaga sólo el delta a la copia guardada | **vistas materializadas** |

> [!warning] Motor: MySQL no tiene vistas materializadas
> **MySQL no soporta `CREATE MATERIALIZED VIEW`.** PostgreSQL y Oracle sí. En MySQL, si se necesita el
> efecto, se emula con una tabla real más algún mecanismo de refresco (job, trigger, `REPLACE INTO …
> SELECT`). O sea: en esta cursada, la columna "mantenimiento incremental" de la tabla de arriba es
> **teoría, no práctica** — todo lo que se haga en el TP4 va por recálculo.
> El *"habitualmente no materializada"* del slide 3 es, en MySQL, *siempre* no materializada.

## Slides 9–10 · Actualizaciones Vista → Tabla Base

La dirección difícil, y el corazón del deck.

### Slide 9 · Por qué es un problema

> *"Las operaciones de actualización sobre una vista **deberían** propagarse automáticamente a las
> tablas base."*
>
> *"Sin embargo… al propagarse podrían generarse **ambigüedades** o **carecer de sentido** o **provocar
> efectos no deseados**."*

Los dos ejemplos de ambigüedad, textuales:

- *"Borrar una tupla en una vista => borrar la tupla de la tabla base? (una modificación también
  podría hacerla "desaparecer" de la vista)"*
- *"Insertar una fila en una vista => insertar una tupla en la tabla base? (si se actualiza alguna
  tupla también podría incorporarse en la vista)"*

> [!note] El deck escribe `=>`, no `⇒`, y **no abre los signos de pregunta**
> Textual: *"Borrar una tupla en una vista **=>** borrar la tupla de la tabla base**?**"*. Transcripto
> tal cual.

Y las **cinco preguntas abiertas** del slide (marcadas en rojo, con el ícono de interrogación — la
cátedra no las responde acá). *"Cómo se propaga una actualización en caso de:"*

> *"- una vista resultante de un **ensamble**?"*
> *"- un **campo derivado**?"*
> *"- una **función de agregación**?"*
> *"- una tupla que **no conserva la clave**?"*
> *"- una selección con **distinct**?"*

**Razonamiento propio, no está en el deck** — el slide sólo enumera las cinco preguntas y no dice dónde
se contestan. Esta es *mi* correspondencia con el resto del deck:

| # | Caso *(textual del slide)* | Dónde lo leo contestado |
| --- | --- | --- |
| 1 | una vista resultante de un **ensamble** *(join)* | slide 11 — preservación de clave |
| 2 | un **campo derivado** | slide 12 — condición ✓2 |
| 3 | una **función de agregación** | slide 12 — condición ✓2 · ejemplo `TOTAL_ARTICULO` |
| 4 | una tupla que **no conserva la clave** | slides 11–12 — condición ✓1 · ejemplo `PROV_COMP` |
| 5 | una selección con **`distinct`** | slide 12 — condición ✓3 |

> [!tip] Este slide es el índice del resto del deck
> Las cinco preguntas se contestan una por una en los slides 11 y 12. Si en el parcial piden *"¿por qué
> una vista con `GROUP BY` no es actualizable?"*, la respuesta está en el par pregunta-3 / condición-✓2.

### Slide 10 · La regla general

> *"Cada actualización de una tupla en una vista debe poder **propagarse sin ambigüedades** a la/s
> tabla/s base o subyacente/s."*
>
> *"Sólo es factible cuando una actualización de la/s tabla/s base puede lograr el efecto deseado sobre
> la vista."*
>
> **"No toda vista se puede actualizar automáticamente"** *— resaltado en el slide —*
> *"→ cuando una actualización sobre la vista pueda generar **distintas posibilidades** de actualización
> a la/s tabla/s base, se deberá recurrir a **algún procedimiento específico** para implementar la que
> sea requerida."*

Y el recuadro al pie, que define la **recursión sobre jerarquías de vistas**:

> [!important] Regla de la cadena de vistas (recuadro `(*)` del slide 10)
> *"(\*) Puede ser otra vista, que debe ser actualizable.*
> *Si se **si** tienen definidas vistas a partir de vistas : **T→ V1→ V2→ … →Vn***
> ***Vi será actualizable si Vi-1 lo es** y así sucesivamente"*
>
> El *"Si se si tienen"* es un **tipeo del deck**, transcripto tal cual [sic].
>
> **Razonamiento propio, no está en el deck:** la actualizabilidad se propaga hacia adelante y **se
> corta en el primer eslabón que falla** — un solo `GROUP BY` en `V2` vuelve no-actualizables a
> `V3 … Vn`. El slide sólo enuncia la recursión, no saca esta consecuencia.

> [!note] "algún procedimiento específico" es el pie para la clase siguiente
> El deck no dice cuál. **Razonamiento propio, no está en el deck:** el mecanismo estándar para esto es
> un **trigger `INSTEAD OF`** sobre la vista, y en MySQL —que **no tiene `INSTEAD OF`**— se resuelve con
> stored procedures. Muy probablemente sea contenido de [[Clase 07 - Vistas-Parte 2]], donde sigue el tema, o
> de la clase de triggers más adelante en la cursada. **Confirmar.**

## Slide 11 · Propiedad de Preservación de Clave

El slide abre con *"**Establece la condición para que una vista sea actualizable:**"*. Dos incisos:

1. *"debe tratarse de **una única actualización y del mismo tipo** en la/s tabla/s`(*)` base, cuya clave
   'heredó' la vista"*
2. *"se satisface si **cada fila en la tabla aparece como máximo una vez en la vista**"*

Con las dos aclaraciones de cómo se determina la clave de la vista — el `(*)` es el mismo marcador del
recuadro del slide 10, o sea *"puede ser otra vista, que debe ser actualizable"*:

| Tipo de vista | De dónde sale la clave |
| --- | --- |
| **Vistas de una tabla`(*)`** | *"la clave de la vista es la clave de la tabla`(*)` de la cual procede"* |
| **Vistas de ensamble** *(join)* | *"la clave de la vista es la de **alguna** de las tablas`(*)` de las cuales procede"* |

> [!quote] Nota subrayada del slide
> *"en una jerarquía de vistas, **basta que una de las vistas involucradas no preserve la clave**, para
> que esta propiedad ya no se cumpla"*

Y el punto que más cae en parcial:

> [!important] Es una propiedad **del esquema**, no de los datos
> Textual: *"La propiedad **NO depende de los datos actuales en las tablas**, sino que es una **propiedad
> estructural de su esquema**."*
>
> Traducción: que hoy, con los datos que hay, cada fila aparezca una sola vez **no alcanza**. Tiene que
> ser imposible que aparezca dos veces, por cómo está definida la vista. Se decide leyendo el
> `CREATE VIEW`, sin mirar una sola fila.

> [!quote] Genealogía del concepto (línea en rojo al pie del slide 11)
> *"Este concepto ha sido explicado por distintos autores (ej: **Date**), aplicado por el **estándar
> SQL** como forma de operar, y popularizado por **Oracle** que lo implementó y denominó propiedad
> **'key-preserved'** (los SGBD suelen hacer interpretaciones particulares)."*
>
> El paréntesis final es una advertencia práctica: **cada motor decide un poco distinto**. → duda abierta.

→ Página propia del concepto: [[Preservación de clave]].

## Slide 12 · Vistas Actualizables (a partir de una tabla/vista)

Las **cuatro condiciones del estándar SQL** (el slide las lista con ✓):

> *"Según el estándar SQL, una vista definida sobre una tabla base (u otra vista actualizable) **es
> actualizable si**:"*

| # | Condición | Pregunta del slide 9 que contesta |
| --- | --- | --- |
| ✓ 1 | **conserva todas las columnas de la clave (primaria)** | *tupla que no conserva la clave* |
| ✓ 2 | **no contiene funciones de agregación o información derivada** | *función de agregación* · *campo derivado* |
| ✓ 3 | **no incluye la claúsula `DISTINCT`** *(el deck escribe "claúsula" [sic])* | *selección con distinct* |
| ✓ 4 | **no incluye subconsultas en el `SELECT`** | — |

> [!important] El nombre que hay que saber: **vistas σ-π**
> Textual: *"→ se denominan **vistas σ-π** (se obtienen a partir de **selección** de tuplas y
> **proyección** de columnas)"*.
>
> Es decir: una vista es actualizable si su definición se puede escribir usando **sólo** los operadores
> **σ (selección = `WHERE`)** y **π (proyección = lista del `SELECT`)** del álgebra relacional — y
> siempre que la π conserve la clave. Cualquier otro operador (agregación, `DISTINCT`, subconsulta en
> el `SELECT`) la saca de la categoría.

Los tres aclarados finales del slide (el tercero, en rojo):

- *"El SGBD traduce una actualización de una vista definida a partir de una tabla/vista en una **única**
  operación de actualización del **mismo tipo** sobre la tabla/vista."*
- *"Esto ocurre **siempre que no se viole ninguna restricción de integridad** definida sobre dicha
  relación (ej: afectando campos que no aceptan nulos o no tienen valores por defecto definidos)."*
- Nota en rojo: *"Algunos SGBD **soportan otras posibilidades** que las especificadas por el estándar
  SQL."*

> [!warning] El segundo aclarado tiene consecuencia directa sobre el esquema del deck
> **Todas** las columnas de `PROVEEDOR`, `ENVIO` y `ARTICULO` son `NOT NULL` y ninguna tiene `DEFAULT`.
> Entonces, **razonamiento propio, no está en el deck:** una vista actualizable que proyecte *sólo
> algunas* columnas es actualizable para `UPDATE` y `DELETE`, pero **un `INSERT` a través de ella falla
> siempre** — las columnas no proyectadas quedarían en `NULL` y no lo aceptan. Es exactamente el caso
> de `PROV_TANDIL` del slide 13, que es ✓ actualizable pero deja afuera `rubro` y `ciudad`.
> **Verificar en clase**, porque cambia la respuesta de "¿se puede insertar en `PROV_TANDIL`?".

## Slide 13 · Los tres ejemplos, con veredicto

El slide marca cada uno con **✓ verde** o **✗ roja** al costado. Esa marca es el contenido del slide.

### ✓ `PROV_TANDIL` — actualizable

> *"`PROV_TANDIL` que contenga el identificador y nombre de los proveedores de Tandil"*

```sql
CREATE VIEW PROV_TANDIL AS
    SELECT id_proveedor, nombre
    FROM PROVEEDOR WHERE ciudad = 'Tandil';
```

**Por qué ✓:** proyecta `id_proveedor`, que es la **PK de `PROVEEDOR`** → condición ✓1 cumplida. Sin
agregación, sin `DISTINCT`, sin subconsulta. Es una vista σ-π de manual: σ por `ciudad`, π sobre dos
columnas que incluyen la clave.

### ✗ `PROV_COMP` — **no** actualizable

> *"`PROV_COMP` con nombre y ciudad de proveedores de computadoras"*

```sql
CREATE VIEW PROV_COMP
AS SELECT nombre, ciudad
FROM PROVEEDOR WHERE rubro = 'Computadoras';
```

**Por qué ✗:** **no proyecta `id_proveedor`** → viola ✓1. La vista no heredó la clave, así que dos
proveedores homónimos de la misma ciudad son **indistinguibles** dentro de la vista: un `UPDATE` sobre
una fila de la vista no tiene forma de saber a cuál de las dos filas base corresponde. Es la ambigüedad
del slide 9 en su forma más pura.

> [!warning] Ojo: es **otra** `PROV_COMP` distinta de la del slide 5
> El slide 5 definió `PROV_COMP` como `SELECT id_proveedor, nombre, ciudad` (**con** la clave) y el
> slide 13 la redefine como `SELECT nombre, ciudad` (**sin** la clave). Mismo nombre, distinta
> definición, distinto veredicto. **El deck reusa el nombre para hacer el contraste** — pero si en el
> parcial preguntan por "`PROV_COMP`" hay que aclarar cuál. La del slide 5 **sí** preserva la clave.

### ✗ `TOTAL_ARTICULO` — **no** actualizable

> *"`TOTAL_ARTICULO` que liste, para cada articulo, su identificador y la cantidad total enviada"*
> *(el deck escribe "articulo" sin tilde [sic])*

```sql
CREATE VIEW TOTAL_ARTICULO (articulo, total) AS
    SELECT id_articulo, sum(cantidad)
    FROM ENVIO
    GROUP BY id_articulo;
```

**Por qué ✗:** tiene **función de agregación** (`sum`) → viola ✓2. Y además cada fila de la vista
resume **muchas** filas de `ENVIO`, con lo que la fila base aparece agregada, no *"como máximo una vez"*
→ tampoco preserva la clave (slide 11). Un `UPDATE … SET total = 700` es **irresolublemente ambiguo**:
hay infinitas formas de repartir 700 entre los envíos del artículo.

Este ejemplo es también el que justifica la lista de columnas del slide 4: `(articulo, total)` le pone
nombre al `sum(cantidad)`, que si no quedaría con un nombre generado por el motor.

| Vista | Veredicto | Condición violada |
| --- | --- | --- |
| `PROV_TANDIL` | ✓ actualizable | — |
| `PROV_COMP` *(la del slide 13)* | ✗ | ✓1 — no conserva la clave |
| `TOTAL_ARTICULO` | ✗ | ✓2 — función de agregación *(y ✓1 por el `GROUP BY`)* |

## Slide 14 · ¿Migración de Tuplas?

> *"Al efectuar actualizaciones en una vista, podría ocurrir que **las tuplas afectadas dejen de
> pertenecer a la vista**."*

```sql
CREATE VIEW PROV_TANDIL AS
    SELECT * FROM PROVEEDOR
    WHERE ciudad = 'Tandil';
```

> *"¿Cuál sería el resultado de la siguiente operación?"*

```sql
UPDATE PROV_TANDIL SET ciudad= 'Azul';
```

La respuesta, textual del slide:

> *"→ En este caso **todos los registros de la vista serían actualizados** con un valor de ciudad
> diferente a Tandil…"*
> *"→ y entonces **dejarían de pertenecer a la vista** (migración de tuplas de la vista)"*

> [!important] El chiste del ejemplo
> La vista es **perfectamente actualizable** (es `SELECT *`, conserva la clave, es σ-π pura). El
> `UPDATE` se ejecuta sin error. Y sin embargo el resultado es absurdo: **la vista queda vacía** y las
> filas se fueron a Azul. La actualizabilidad no alcanza — hace falta un segundo mecanismo.
>
> Nótese además que este `UPDATE` **no tiene `WHERE`**: afecta a *todas* las filas de la vista, que son
> todas las de Tandil.

> [!note] `PROV_TANDIL` cambia de definición otra vez
> Slide 13: `SELECT id_proveedor, nombre FROM PROVEEDOR WHERE ciudad='Tandil'`.
> Slide 14: `SELECT * FROM PROVEEDOR WHERE ciudad='Tandil'`.
> Mismo nombre, dos definiciones. Con la del slide 13 el `UPDATE … SET ciudad` ni siquiera compilaría,
> porque `ciudad` no está proyectada — por eso el slide 14 la redefine con `*`. **Transcripto tal cual.**

## Slide 15 · Vistas con Opción de Chequeo (WCO)

> *"**Solución a la migración de tuplas** → incluir la cláusula `WITH CHECK OPTION` (WCO)"*

Vuelve a mostrar la sintaxis completa, ahora con la tercera línea resaltada:

```sql
CREATE VIEW nom_vista [(n_col_1, …, n_col_n)]
AS expresión_consulta
[WITH [opción] CHECK OPTION];
```

> *"Si se especifica WCO → **una actualización sobre la vista procede si satisface la condición de
> consulta que la define** (se rechaza cualquier inserción o actualización que haga migrar una tupla de
> la vista)."*

| `opción` | Qué se chequea | Default |
| --- | --- | --- |
| **`CASCADED`** | *"las tuplas son chequeadas contra las condiciones de la vista **y aquellas de las vistas subyacentes**"* | **sí** |
| **`LOCAL`** | *"sólo se chequean contra las condiciones definidas en **la misma vista**"* | no |

Dos notas finales del slide:

- **"Sólo está soportado en vistas automáticamente actualizables"** *(resaltado en el slide).*
- Nota en rojo: *"**Date recomienda usar WCO en vistas actualizables y critica la opción 'local'**."*

> [!tip] Por qué Date critica `LOCAL`
> **Razonamiento propio, no está en el deck:** con `LOCAL` una actualización puede satisfacer la
> condición de la vista sobre la que se opera y **violar la de la vista de abajo**, con lo que la tupla
> migra igual — sólo que un nivel más abajo. `LOCAL` no elimina la migración, la esconde. El ejercicio
> del slide 17 es exactamente esa situación. **Confirmar el razonamiento contra Date.**

> [!success] Motor: acá MySQL sí acompaña
> **MySQL soporta `WITH CASCADED CHECK OPTION` y `WITH LOCAL CHECK OPTION`, y el default es
> `CASCADED`** — igual que el estándar y que el slide. Este pedazo del deck se puede probar tal cual en
> la cursada. (El único cuidado: hay que definir la vista sobre una vista/tabla actualizable, como dice
> el slide.)

## Slide 16 · Ejercicio 1 — `Envios500` con y sin WCO

> *"Vista `ENVIOS500` con los envíos de 500 o más unidades de algún artículo (a partir de `ENVIO`)"*

```sql
CREATE VIEW Envios500 AS
SELECT * FROM ENVIO
WHERE cantidad>=500;
```

> *"determinar el efecto de las sig. operaciones, si la vista*
> *- se define **con** WCO*
> *- se define **sin** WCO"*

```sql
INSERT INTO Envios500 VALUES ('P1', 'A1', 500);
INSERT INTO Envios500 VALUES ('P2', 'A2', 300);
UPDATE Envios500 SET cantidad=100 WHERE id_proveedor= 'P1';
```

> [!question] El deck **no da las respuestas**
> El slide plantea el ejercicio y termina. Lo que sigue es **razonamiento propio, no está en el deck** —
> **verificar en clase o en el TP4.**

| Operación | Sin WCO | Con WCO |
| --- | --- | --- |
| `INSERT … ('P1','A1',500)` | **Procede.** `500 >= 500` → la fila **sí** se ve en la vista | **Procede** igual: satisface la condición |
| `INSERT … ('P2','A2',300)` | **Procede** sobre `ENVIO`, pero `300 < 500` → la fila **se inserta y desaparece**: no es visible en la vista que la insertó | **Se rechaza.** Es el caso *"cualquier inserción … que haga migrar una tupla"* |
| `UPDATE … SET cantidad=100 WHERE id_proveedor='P1'` | **Procede.** Las filas de P1 pasan a 100 y **migran fuera** de la vista | **Se rechaza:** `100 < 500` viola la condición |

> [!note] Detalles de integridad que el ejercicio no menciona
> **Razonamiento propio:** los dos `INSERT` van a parar a `ENVIO`, que tiene `id_proveedor` e
> `id_articulo` como **FK**. Si `'P2'` no existe en `PROVEEDOR` o `'A2'` no existe en `ARTICULO`, la
> inserción falla por **violación de FK antes de cualquier consideración sobre la vista** — es el caso
> *"siempre que no se viole ninguna restricción de integridad"* del slide 12. Lo mismo con la PK
> compuesta `(id_proveedor, id_articulo)`: si `('P1','A1')` ya existía, el primer `INSERT` falla por
> clave duplicada. El slide 17 asume que esa fila **sí** existe.

> [!tip] El caso "sin WCO" del segundo `INSERT` es el más contraintuitivo
> Insertás una fila **a través de la vista** y después `SELECT * FROM Envios500` **no te la muestra**.
> No se perdió: está en `ENVIO`. Simplemente nunca perteneció a la vista. Es el mejor argumento a favor
> de poner WCO siempre — que es lo que recomienda Date según el slide 15.

## Slide 17 · Ejercicio 2 — `CASCADED` vs. `LOCAL`

> *"Teniendo creada `Envios500`:"*

```sql
CREATE VIEW Envios500 AS
 SELECT * FROM ENVIO
 WHERE cantidad>=500;
```

> *"`ENVIOS500-999_con` los envíos de entre 500 y 999 unidades (**a partir de `ENVIOS500`**)"*

```sql
CREATE VIEW Envios500-999 AS
 SELECT * FROM ENVIO500
 WHERE cantidad < 1000;
```

> *"Cuál es la respuesta ante la sig. operación si `Envios500-999` se define con:*
> *- `CASCADED` WCO?*
> *- `LOCAL` WCO?"*

El `UPDATE`, **transcripto literalmente del slide** (ver el `[!bug]` de abajo — así como está no
compila):

```sql
UPDATE Envios500-999 SET cantidad= 300 where
 (id_proveedor = 'P1' and id_articulo = 'A1 )';
```

> [!bug] Cuatro errores en el slide 17
> 1. **`FROM ENVIO500`** — le falta la `S`. La vista se llama **`Envios500`**. Tal como está escrito,
>    referencia una relación inexistente.
> 2. **`Envios500-999` como nombre de vista.** El guion es el **operador de resta** en SQL: un
>    identificador sin comillar no puede contenerlo. Para que funcione habría que escribirlo
>    `` `Envios500-999` `` (MySQL, backticks) o `"Envios500-999"` (estándar/PostgreSQL), o renombrarla
>    `Envios500_999`. **Verificar en clase** — probablemente sea sólo notación informal del slide, pero
>    en el TP4 hay que escribirlo bien.
> 3. **El paréntesis de cierre quedó *adentro* del literal.** El slide escribe
>    `id_articulo = ‘A1 )’;` — o sea: espacio, paréntesis y recién ahí la comilla de cierre. Comparado
>    con lo que evidentemente se quiso escribir (`id_articulo = 'A1');`), el literal pasó de `'A1'` a
>    `'A1 )'` y el `where (…` **nunca se cierra**. Tal cual está, la sentencia es un error de sintaxis,
>    y aunque se cerrara el paréntesis a mano compararía `id_articulo` contra la cadena `A1 )`, que no
>    existe en `ENVIO`. **La versión que hay que usar en el TP4 es**
>    `... where (id_proveedor = 'P1' and id_articulo = 'A1');`.
> 4. El texto del slide alterna `ENVIOS500` / `Envios500` / `ENVIO500` para la misma vista, y arrastra
>    un `ENVIOS500-999_con` con guion bajo pegado al "con" (probablemente un subrayado del original).

> [!question] El deck tampoco da esta respuesta
> Lo que sigue es **razonamiento propio, no está en el deck** — **verificar en clase.**

Hay **dos condiciones** en juego sobre la cadena `ENVIO → Envios500 → Envios500-999`:

| Vista | Su condición propia |
| --- | --- |
| `Envios500` | `cantidad >= 500` |
| `Envios500-999` | `cantidad < 1000` |

El `UPDATE` pone `cantidad = 300`. Entonces:

| Definición de `Envios500-999` | Qué se chequea | Resultado |
| --- | --- | --- |
| **`WITH CASCADED CHECK OPTION`** | `cantidad < 1000` **y** `cantidad >= 500` *(la de la vista subyacente)* | `300 < 1000` ✓ pero `300 >= 500` ✗ → **la operación se RECHAZA** |
| **`WITH LOCAL CHECK OPTION`** | **sólo** `cantidad < 1000` | `300 < 1000` ✓ → **la operación PROCEDE** … y la tupla **migra**: desaparece de `Envios500-999` **y** de `Envios500`, porque ya no cumple `>= 500` |

> [!important] Esta es la crítica de Date a `LOCAL`, hecha ejemplo
> Con `LOCAL`, el WCO **no cumple su promesa**: la tupla migra igual. Se puso una opción de chequeo y
> la tupla se fue lo mismo. Por eso `CASCADED` es el default del estándar y por eso Date dice que
> `LOCAL` no debería usarse (slide 15).
>
> **Regla mnemotécnica:** `CASCADED` chequea **toda la cadena hacia abajo**; `LOCAL` chequea **un solo
> eslabón**. Si la vista se apoya en otras vistas con filtros, `LOCAL` es un agujero.

> [!warning] Matiz del estándar que el slide simplifica
> El slide define `LOCAL` como *"sólo se chequean contra las condiciones definidas en la misma vista"*.
> **Razonamiento propio:** en el estándar SQL, `LOCAL` chequea la condición de la vista **más** las
> condiciones de las vistas subyacentes **que a su vez estén definidas `WITH CHECK OPTION`** — y en este
> ejercicio `Envios500` se definió **sin** WCO, con lo que el resultado coincide con la lectura
> simplificada del slide. Pero **no siempre coincide**. Si `Envios500` tuviera su propio WCO, el
> resultado de la fila `LOCAL` cambiaría. **Verificar en clase cuál de las dos definiciones se toma como
> válida para el parcial**, porque cambia respuestas.

---

## Cuadro de bolsillo — todo el deck en una pantalla

| Pregunta | Respuesta del deck |
| --- | --- |
| ¿Qué es una vista? | Relación **derivada**: nombre dado a una expresión de consulta |
| ¿En qué nivel vive? | **Esquema externo** (nivel externo de los tres niveles) |
| ¿Guarda datos? | **No** — tabla virtual, tuplas generadas al operar. Salvo materializadas |
| ¿Sobre qué se define? | Una o más **tablas y/o vistas** definidas previamente |
| ¿Cómo se consulta? | **Como cualquier tabla** |
| ¿Cómo se borra? | `DROP VIEW nom [RESTRICT\|CASCADE]` — `RESTRICT` es el default |
| Tabla → vista | Automático, por **recálculo** o **mantenimiento incremental** |
| Vista → tabla | **No siempre posible.** Criterio: **preservación de la clave** |
| ¿Cuándo preserva la clave? | Cuando **cada fila de la tabla aparece como máximo una vez** en la vista. **Propiedad del esquema, no de los datos** |
| Las 4 condiciones del estándar | conserva la PK · sin agregación ni derivados · sin `DISTINCT` · sin subconsultas en el `SELECT` |
| ¿Cómo se llaman esas vistas? | **Vistas σ-π** (selección + proyección) |
| En una cadena `T→V1→…→Vn` | `Vi` es actualizable **si `Vi-1` lo es**; un eslabón roto rompe todo |
| ¿Qué es la migración de tuplas? | Que la fila actualizada **deje de pertenecer** a la vista |
| ¿Cómo se evita? | `WITH CHECK OPTION` |
| `CASCADED` vs. `LOCAL` | `CASCADED` (default) chequea la vista **y las subyacentes**; `LOCAL` sólo la propia |
| ¿Sobre qué vistas funciona WCO? | **Sólo sobre vistas automáticamente actualizables** |

## Dudas abiertas

- [ ] **¿`PROV_COMP_TANDIL` o `PR_COMP_TANDIL`?** El slide 5 crea la primera, los slides 6 y 7 usan la
      segunda. Tal como está, el segundo `CREATE VIEW` del slide 6 no compila.
- [ ] **¿Cuál `PROV_COMP` vale?** Slide 5: `SELECT id_proveedor, nombre, ciudad` (preserva la clave ✓).
      Slide 13: `SELECT nombre, ciudad` (✗). Y `PROV_TANDIL` también tiene dos definiciones
      (slides 13 y 14). Si en el parcial nombran una vista, hay que preguntar cuál.
- [ ] **Respuestas del ejercicio del slide 16** — el deck lo deja planteado. Mi tabla está arriba,
      **sin confirmar**.
- [ ] **Respuestas del ejercicio del slide 17** (`CASCADED` vs. `LOCAL`) — ídem.
- [ ] **¿La definición de `LOCAL` del slide 15 es la del estándar?** El estándar chequea también las
      vistas subyacentes *que tengan WCO*; el slide dice *"sólo… la misma vista"*. Con el ejemplo del
      slide 17 da igual, pero no en general. **Cuál se toma para el parcial.**
- [ ] **`Envios500-999` con guion** — ¿es sólo notación del slide o hay que comillarlo? En MySQL sería
      `` `Envios500-999` ``.
- [ ] **El `UPDATE` del slide 17 no compila**: el paréntesis de cierre quedó adentro del literal
      (`id_articulo = 'A1 )';`) y el `where (` nunca se cierra. Asumo que la intención es
      `id_articulo = 'A1'` y que el paréntesis va afuera — **confirmar en clase** antes de usarlo como
      enunciado del TP4.
- [ ] **¿Se puede hacer `INSERT` a través de `PROV_TANDIL`?** Es ✓ actualizable pero no proyecta `rubro`
      ni `ciudad`, que son `NOT NULL` sin `DEFAULT`. Mi lectura del slide 12 dice que el `INSERT` falla
      y el `UPDATE`/`DELETE` no. **Confirmar.**
- [ ] **`DROP VIEW … RESTRICT` en MySQL** — la doc estándar dice una cosa y MySQL las ignora. Confirmar
      contra la versión que use la cátedra, porque afecta el TP4.
- [ ] **¿Qué es el "procedimiento específico"** del slide 10 para actualizar vistas no actualizables?
      ¿Triggers `INSTEAD OF`? MySQL no los tiene. ¿Es contenido de la [[Clase 07 - Vistas-Parte 2]] o de la
      clase de triggers, más adelante en la cursada?
- [ ] **¿Cómo se determina la clave de una vista de ensamble?** El slide 11 dice *"la de **alguna** de
      las tablas"*, sin decir cuál ni qué pasa si son varias. En `PROV_ENVIOS_TANDIL` (slide 6), ¿la
      clave es la de `PROVEEDOR` o la de `ENVIO`?
- [ ] **¿Qué "interpretaciones particulares" hace MySQL** de la propiedad key-preserved? El slide 11
      avisa que los SGBD difieren pero no dice cómo.
- [ ] **Conseguir Sumathi & Esakkirajan (2007)** — la cátedra cita el diagrama de tres niveles de ahí y
      la fuente **no está en el vault**.
- [ ] **¿Las vistas materializadas entran en el parcial?** Aparecen dos veces (slides 3 y 8) pero MySQL
      no las soporta, así que no se pueden practicar. ¿Se desarrollan en la [[Clase 07 - Vistas-Parte 2]]?

## Enlaces

- Clase anterior: [[Clase 05 - Consultas de Datos–Parte 3]] · clase siguiente: [[Clase 07 - Vistas-Parte 2]], donde
  **sigue el tema de vistas**. Después viene [[Clase 08 - Explicando el plan]] (índices y plan de ejecución).
- Práctica correspondiente (martes 11/08, **TP4 Vistas**): [[Práctica 2026-08-11]]
- Los tres niveles vienen de acá: [[Clase 01 - Introducción_BasesDeDatos]]
- Conceptos: [[1.06.01 - Vistas|Vistas]] · [[Preservación de clave]] · [[Clase 07 - Vistas-Parte 2|Vistas materializadas]] · [[Esquema externo]]
- Motor: [[MySQL]] — ver los tres callouts de motor de esta página (`DROP VIEW`, vistas materializadas,
  WCO)
- Bibliografía: [[_index-bibliografia]] · calendario: [[_cronograma]] · índice: [[_index-clases]]
