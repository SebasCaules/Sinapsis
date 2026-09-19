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

## Resumen general

Una vista es una **relación derivada**: una consulta con nombre, que vive en el esquema externo y se
comporta como una **tabla virtual** sin guardar datos. El deck cubre `CREATE VIEW` (con renombrado de
columnas, que es todo o nada), `DROP VIEW` con `RESTRICT`/`CASCADE`, y el problema central del tema:
qué vistas se pueden actualizar y cómo evitar que una actualización haga desaparecer tuplas. Se
practica en el **TP4 Vistas** sobre **MySQL**, y la actualizabilidad es lo que más cae en el parcial.

Lo que hay que saber:

- El criterio genérico es la **preservación de la clave**: cada fila de la tabla aparece como máximo
  una vez en la vista. Es una propiedad **del esquema, no de los datos**: se decide leyendo el
  `CREATE VIEW`.
- Según el estándar SQL, una vista es actualizable si conserva la clave primaria, no tiene agregación
  ni campos derivados, no usa `DISTINCT` y no tiene subconsultas en el `SELECT`: son las **vistas
  σ-π**. En una cadena `T→V1→…→Vn`, `Vi` es actualizable solo si `Vi-1` lo es.
- Una vista actualizable puede sufrir **migración de tuplas** (un `UPDATE` saca las filas de la vista).
  `WITH CHECK OPTION` rechaza esas operaciones: `CASCADED` (default) chequea también las vistas
  subyacentes, `LOCAL` solo la propia, y Date critica `LOCAL`. WCO solo vale en vistas actualizables.
- Motor: MySQL ignora `RESTRICT`/`CASCADE` en `DROP VIEW`, no tiene vistas materializadas y sí soporta
  WCO con `CASCADED` por defecto.
- Trampas del deck: comillas tipográficas que no compilan, nombres reutilizados con definiciones
  distintas (`PROV_COMP`, `PROV_TANDIL`, `PROV_COMP_TANDIL`/`PR_COMP_TANDIL`) y un `UPDATE` con
  errores de sintaxis en el slide 17.

Para el parcial: decidir si una vista es actualizable leyendo su definición contra las cuatro
condiciones, y resolver los ejercicios de `Envios500` (con y sin WCO; `CASCADED` vs. `LOCAL`).

## Fuente y bibliografía del deck

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 06 - Vistas-Parte 1.pdf` · **18 slides** (el slide 1 es la portada;
> el recorrido va del slide 2 al 18). Teórica del lunes 10/08, el mismo día que la
> [[Clase 07 - Vistas-Parte 2]] y la [[Clase 08 - Explicando el plan]]; anterior:
> [[Clase 05 - Consultas de Datos–Parte 3]]. Se practica con el **TP4 Vistas** del martes 11/08 →
> [[Práctica 2026-08-11]]. Qué archivo es de qué clase lo registra [[_index-clases]].

> [!quote] La bibliografía que declara el deck (slide 18)
> - Date, C., *"An Introduction to Database Systems"*. 8º ed., Addison Wesley, 2004
> - Elmasri, R., Navathe, S., *"Fundamentals of Database Systems"*, Addison Wesley, 2011 **(Cap. 5)**
> - Ramakrishnan R., Gehrke J., *"Database Management Systems"*, 3° ed., McGraw-Hill, 2003 **(Cap. 3 y 25)**
> - Silberschatz, A., Korth, H, Sudarshan, S., *"Database System Concepts"*, McGraw Hill, 2001 **(Cap. 4)**
>
> Los capítulos los resalta el propio slide; no están verificados contra las fichas del vault. Mapeo
> real: [[_index-bibliografia]].

---

## El esquema de ejemplo (diagrama lateral de los slides 5, 6, 13, 16, 17)

Cinco slides repiten el mismo diagrama de tres tablas; contra él se escriben todos los ejemplos del deck.

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
  (1)  (1)
```

> [!note] Cómo leer el diagrama (razonamiento propio, no está en el deck)
> Notación **pata de gallo (crow's foot)**, no la del MER de la [[Clase 02 - Modelo Entidad-Relacion]]:
> `┼` es *exactamente uno* y `o<` es *cero o muchos*. `ENVIO` es la tabla de cruce N:N, con
> `(id_proveedor, id_articulo)` como **clave primaria compuesta**: la clave de `ENVIO` son las dos
> columnas juntas. `ciudad` está en `PROVEEDOR` y en `ARTICULO`: el caso que el slide 4 obliga a renombrar.

---

## Slide 2 · Vistas – Esquema Externo

Las vistas **forman parte del esquema externo**: presentan a **grupos particulares de usuarios** la
parte de la BD que les interesa, **ocultando** el resto. El slide lo ilustra con el diagrama de los
**tres niveles** de la [[Clase 01 - Introducción_BasesDeDatos]], con el nivel externo recuadrado en
rojo: **una vista es el mecanismo con el que SQL materializa el nivel externo**.

```
  ← distintos grupos de usuarios
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
 │External View1│ │External View2│ │External View3│  ◀── NIVEL EXTERNO
 └──────▲───────┘ └──────▲───────┘ └──────▲───────┘
  └──── logical to external mappings ────┘
 ┌───────┐  ┌──────────────┐
 │ tabla │ ◀────▶  │ Logical Schema│  ◀── NIVEL CONCEPTUAL
 └───────┘  └──────▲───────┘
  internal to logical mapping
 ┌───────┐  ┌───────────────┐
 │ disk  │ ◀────▶  │Internal Schema│  ◀── NIVEL INTERNO
 └───────┘  └───────────────┘
```

> [!quote] Atribución al pie del slide
> *"de: S. Sumathi, S. Esakkirajan, **Fundamentals of Relational Database Management Systems** (2007)"*

> [!missing] Esa fuente no está en el vault
> **Sumathi & Esakkirajan (2007)** no figura en `raw/Material_Catedra/bibliografia/` ni en la
> bibliografía declarada del slide 18: el diagrama es su única aparición. Fuente citada-pero-ausente,
> pendiente en [[_index-bibliografia]].

## Slide 3 · Concepto de Vista

1. Es una **relación derivada** de **una o más tablas y/o vistas definidas previamente**.
2. **Su contenido se define dando un nombre a una expresión de consulta.**
3. Se considera una **tabla virtual** (habitualmente **no materializada**)
  → **las tuplas se generan al operar sobre la vista**.
4. Tres consecuencias, textuales:

| Consecuencia | Textual del slide |
| --- | --- |
| **Consulta** | *"Pueden consultarse como cualquier tabla"* |
| **Actualización** | *"Para poder realizar **actualizaciones** deben cumplirse ciertas condiciones (que surgen de su carácter de datos derivados)"* |
| **Criterio** | *"La característica genérica que define la posibilidad de actualización es la **preservación de la clave** (reconocimiento de la tabla que 'hereda' su clave a la vista)"* |

Las dos palabras a retener son **"derivada"** y **"virtual"**: escribir sobre datos derivados exige
deshacer la derivación, y en una tabla virtual la escritura solo puede ir a la tabla base. El
*"habitualmente no materializada"* deja la puerta abierta a las **vistas materializadas** (copia física
del resultado), que reaparecen en el slide 8 → [[Clase 07 - Vistas-Parte 2|Vistas materializadas]].

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
| `WITH [opción] CHECK OPTION` | *(opcional — se explica en el slide 15)* |

Las **tres reglas de nombres de columna**, textuales:

1. *"Las columnas de la vista se pueden renombrar especificando **la lista completa** de atributos de la
  vista entre paréntesis."*
2. *"Si no, los nombres son los de las columnas de las tablas especificadas en la sentencia SELECT"*
3. *"Se debe especificar con diferente nombre las columnas provenientes de distintas tablas pero con
  igual nombre"*

> [!important] La lista es *completa* o no es
> Se renombran todas las columnas o ninguna. Por eso `TOTAL_ARTICULO` (slide 13) escribe
> `(articulo, total)` y no solo `(total)`, aunque solo el `sum(cantidad)` necesitaba nombre.

## Slides 5–6 · Ejemplos de creación

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

### Vista a partir de **más de una tabla** (slide 6)

> *"`PROV_ENVIOS_TANDIL` que contenga el identificador y nombre de los proveedores de computadoras de
> Tandil y los identificadores de artículos enviados por cada uno"*

```sql
CREATE VIEW PROV_ENVIOS_TANDIL AS
  SELECT P.id_proveedor, P.nombre, E.id_articulo
  FROM  PROVEEDOR P JOIN ENVIO E
  ON  P.id_proveedor = E.id_proveedor
  WHERE  P.rubro  = 'Computadoras'
  AND  P.ciudad = 'Tandil';
```

O la misma vista sobre la vista anterior, sin `WHERE` porque los filtros de `rubro` y `ciudad` ya están
en la vista intermedia:

```sql
CREATE VIEW PROV_ENVIOS_TANDIL AS
  SELECT P.id_proveedor, nombre, E.id_articulo
  FROM  PR_COMP_TANDIL P JOIN ENVIO E
  ON  P.id_proveedor = E.id_proveedor;
```

> [!bug] El deck cambia el nombre de la vista a mitad de camino
> El slide 5 la crea como **`PROV_COMP_TANDIL`**; los slides 6 y 7 la referencian como
> **`PR_COMP_TANDIL`**. Tal como está escrito, el segundo `CREATE VIEW` del slide 6 **fallaría** con
> *table doesn't exist*. Transcripto tal cual; nombre canónico por confirmar.

> [!bug] Las comillas del deck no son comillas SQL
> Extraídas carácter por carácter del PDF:
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
> En SQL solo vale la comilla simple recta `'`: copiado del PDF al cliente MySQL, **ninguno de estos
> ejemplos compila**. Los bloques `sql` de esta página llevan comillas rectas; **el original está mal en
> todos los casos**.

## Slide 7 · Consulta y eliminación

> *"Una vista puede ser consultada como cualquier tabla."*

Ejemplo: *"Listar alfabéticamente los proveedores de `PR_COMP_TANDIL`"*

```sql
SELECT nombre
FROM  PR_COMP_TANDIL
ORDER BY nombre;
```

Eliminación:

```sql
DROP VIEW nom_vista [opción];
```

| `opción` | Comportamiento |
| --- | --- |
| **`RESTRICT`** | *"se rechaza si hay objetos que hacen referencia a la vista"* — **opción por defecto** |
| **`CASCADE`** | *"procede siempre y se eliminan también los objetos dependientes"* |

> [!warning] Motor: `RESTRICT` / `CASCADE` en `DROP VIEW` es sintaxis del estándar, y **MySQL las ignora**
> La cursada corre sobre **MySQL** ([[_cronograma]] § Diferencias con el programa oficial). MySQL
> acepta `DROP VIEW … RESTRICT` y `… CASCADE` sin error, pero **las palabras clave no hacen nada**: el
> `DROP` procede igual y las vistas dependientes quedan *inválidas* (fallan recién al consultarlas).
> PostgreSQL sí implementa las dos semánticas. Para el TP4, `RESTRICT` no es red de seguridad: revisar
> las dependencias a mano antes de dropear. Confirmar contra la versión de MySQL de la cátedra.

## Slide 8 · Actualizaciones Tabla Base → Vista

La dirección fácil. Textual:

> *"Al actualizar las tuplas de una tabla → **los cambios se reflejan automáticamente sobre las vistas**
> definidas a partir de ella."*

> *"Las vistas no mantienen copias de los datos (**salvo que sean materializadas**)
> → el SGBD asegura que las vistas siempre estén actualizadas."*

| Mecanismo | Cómo funciona | Aplica a |
| --- | --- | --- |
| **Por recálculo** | *"las tuplas actualizadas se generan al acceder a la vista"* | vistas normales (virtuales) |
| **Por mantenimiento incremental** | el SGBD propaga solo el delta a la copia guardada | **vistas materializadas** |

> [!warning] Motor: MySQL no tiene vistas materializadas
> **MySQL no soporta `CREATE MATERIALIZED VIEW`**; PostgreSQL y Oracle sí. Se emula con una tabla real
> más un mecanismo de refresco (job, trigger, `REPLACE INTO … SELECT`). En esta cursada el
> mantenimiento incremental es **teoría, no práctica**: todo lo del TP4 va por recálculo. El
> *"habitualmente no materializada"* del slide 3 es, en MySQL, *siempre* no materializada.

## Slides 9–10 · Actualizaciones Vista → Tabla Base

La dirección difícil, y el corazón del deck.

### Slide 9 · Por qué es un problema

> *"Las operaciones de actualización sobre una vista **deberían** propagarse automáticamente a las
> tablas base."*
>
> *"Sin embargo… al propagarse podrían generarse **ambigüedades** o **carecer de sentido** o **provocar
> efectos no deseados**."*

Los dos ejemplos de ambigüedad, textuales (el deck escribe `=>` y no abre los signos de pregunta):

- *"Borrar una tupla en una vista => borrar la tupla de la tabla base? (una modificación también
  podría hacerla "desaparecer" de la vista)"*
- *"Insertar una fila en una vista => insertar una tupla en la tabla base? (si se actualiza alguna
  tupla también podría incorporarse en la vista)"*

Y las **cinco preguntas abiertas** del slide (en rojo; la cátedra no las responde acá): *"Cómo se
propaga una actualización en caso de:"*. Es el índice del resto del deck: la columna de la derecha
(**razonamiento propio, no está en el deck**) dice dónde las contestan los slides 11 y 12.

| # | Caso *(textual del slide)* | Dónde se contesta |
| --- | --- | --- |
| 1 | una vista resultante de un **ensamble** *(join)* | slide 11 — preservación de clave |
| 2 | un **campo derivado** | slide 12 — condición ✓2 |
| 3 | una **función de agregación** | slide 12 — condición ✓2 · ejemplo `TOTAL_ARTICULO` |
| 4 | una tupla que **no conserva la clave** | slides 11–12 — condición ✓1 · ejemplo `PROV_COMP` |
| 5 | una selección con **`distinct`** | slide 12 — condición ✓3 |

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

> [!important] Regla de la cadena de vistas (recuadro `(*)` del slide 10)
> *"(\*) Puede ser otra vista, que debe ser actualizable.*
> *Si se **si** tienen definidas vistas a partir de vistas : **T→ V1→ V2→ … →Vn***
> ***Vi será actualizable si Vi-1 lo es** y así sucesivamente"*
>
> El *"Si se si tienen"* es un tipeo del deck [sic]. **Razonamiento propio:** la actualizabilidad **se
> corta en el primer eslabón que falla**: un `GROUP BY` en `V2` vuelve no actualizables a `V3 … Vn`.

> [!note] "algún procedimiento específico"
> El deck no dice cuál. **Razonamiento propio, no está en el deck:** el mecanismo estándar es un
> **trigger `INSTEAD OF`** sobre la vista; MySQL **no tiene `INSTEAD OF`** y lo resuelve con stored
> procedures. Probablemente sea contenido de la [[Clase 07 - Vistas-Parte 2]] o de la clase de triggers.

## Slide 11 · Propiedad de Preservación de Clave

*"**Establece la condición para que una vista sea actualizable:**"*

1. *"debe tratarse de **una única actualización y del mismo tipo** en la/s tabla/s`(*)` base, cuya clave
  'heredó' la vista"*
2. *"se satisface si **cada fila en la tabla aparece como máximo una vez en la vista**"*

De dónde sale la clave de la vista (el `(*)` es el marcador del slide 10: *"puede ser otra vista, que
debe ser actualizable"*):

| Tipo de vista | De dónde sale la clave |
| --- | --- |
| **Vistas de una tabla`(*)`** | *"la clave de la vista es la clave de la tabla`(*)` de la cual procede"* |
| **Vistas de ensamble** *(join)* | *"la clave de la vista es la de **alguna** de las tablas`(*)` de las cuales procede"* |

> [!quote] Nota subrayada del slide
> *"en una jerarquía de vistas, **basta que una de las vistas involucradas no preserve la clave**, para
> que esta propiedad ya no se cumpla"*

> [!important] Es una propiedad **del esquema**, no de los datos (clave para el parcial)
> Textual: *"La propiedad **NO depende de los datos actuales en las tablas**, sino que es una **propiedad
> estructural de su esquema**."* Que hoy cada fila aparezca una sola vez **no alcanza**: tiene que ser
> imposible por cómo está definida la vista. Se decide leyendo el `CREATE VIEW`, sin mirar una fila.

> [!quote] Genealogía del concepto (línea en rojo al pie del slide 11)
> *"Este concepto ha sido explicado por distintos autores (ej: **Date**), aplicado por el **estándar
> SQL** como forma de operar, y popularizado por **Oracle** que lo implementó y denominó propiedad
> **'key-preserved'** (los SGBD suelen hacer interpretaciones particulares)."*
> El paréntesis final avisa que cada motor decide un poco distinto → duda abierta.

→ Página propia del concepto: [[Preservación de clave]].

## Slide 12 · Vistas Actualizables (a partir de una tabla/vista)

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
> **proyección** de columnas)"*. Solo **σ (`WHERE`)** y **π (lista del `SELECT`)**, con la π
> conservando la clave; agregación, `DISTINCT` o subconsulta en el `SELECT` la sacan de la categoría.

Los tres aclarados finales del slide (el tercero, en rojo):

- *"El SGBD traduce una actualización de una vista definida a partir de una tabla/vista en una **única**
  operación de actualización del **mismo tipo** sobre la tabla/vista."*
- *"Esto ocurre **siempre que no se viole ninguna restricción de integridad** definida sobre dicha
  relación (ej: afectando campos que no aceptan nulos o no tienen valores por defecto definidos)."*
- Nota en rojo: *"Algunos SGBD **soportan otras posibilidades** que las especificadas por el estándar
  SQL."*

> [!warning] El segundo aclarado, aplicado al esquema del deck
> Todas las columnas de las tres tablas son `NOT NULL` sin `DEFAULT`. **Razonamiento propio, no está en
> el deck:** una vista actualizable que proyecta solo algunas columnas admite `UPDATE` y `DELETE`, pero
> **un `INSERT` a través de ella falla siempre**: las columnas no proyectadas quedarían en `NULL`. Es el
> caso de `PROV_TANDIL` del slide 13, ✓ actualizable pero sin `rubro` ni `ciudad`. Verificar en clase.

## Slide 13 · Los tres ejemplos, con veredicto

El slide marca cada uno con **✓ verde** o **✗ roja** al costado; esa marca es el contenido del slide.

### ✓ `PROV_TANDIL` — actualizable

> *"`PROV_TANDIL` que contenga el identificador y nombre de los proveedores de Tandil"*

```sql
CREATE VIEW PROV_TANDIL AS
  SELECT id_proveedor, nombre
  FROM PROVEEDOR WHERE ciudad = 'Tandil';
```

**Por qué ✓:** proyecta `id_proveedor`, la **PK de `PROVEEDOR`** (condición ✓1); sin agregación, sin
`DISTINCT`, sin subconsulta. Vista σ-π de manual: σ por `ciudad`, π sobre dos columnas que incluyen la
clave.

### ✗ `PROV_COMP` — **no** actualizable

> *"`PROV_COMP` con nombre y ciudad de proveedores de computadoras"*

```sql
CREATE VIEW PROV_COMP
AS SELECT nombre, ciudad
FROM PROVEEDOR WHERE rubro = 'Computadoras';
```

**Por qué ✗:** **no proyecta `id_proveedor`** (viola ✓1). Dos proveedores homónimos de la misma ciudad
son **indistinguibles** en la vista, y un `UPDATE` sobre esa fila no sabe a cuál fila base corresponde:
la ambigüedad del slide 9 en su forma más pura.

> [!warning] Es **otra** `PROV_COMP`, distinta de la del slide 5
> El slide 5 la definió como `SELECT id_proveedor, nombre, ciudad` (**con** la clave, ✓ preserva) y el
> slide 13 la redefine como `SELECT nombre, ciudad` (**sin** la clave). El deck reusa el nombre para el
> contraste; si en el parcial preguntan por "`PROV_COMP`", hay que aclarar cuál.

### ✗ `TOTAL_ARTICULO` — **no** actualizable

> *"`TOTAL_ARTICULO` que liste, para cada articulo, su identificador y la cantidad total enviada"*
> *(el deck escribe "articulo" sin tilde [sic])*

```sql
CREATE VIEW TOTAL_ARTICULO (articulo, total) AS
  SELECT id_articulo, sum(cantidad)
  FROM ENVIO
  GROUP BY id_articulo;
```

**Por qué ✗:** tiene **función de agregación** (`sum`), viola ✓2. Además cada fila de la vista resume
**muchas** filas de `ENVIO`, así que tampoco preserva la clave (slide 11): un `UPDATE … SET total = 700`
es **irresolublemente ambiguo**, con infinitas formas de repartir 700 entre los envíos del artículo.
La lista `(articulo, total)` le pone nombre al `sum(cantidad)` (regla del slide 4).

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

> [!important] El punto del ejemplo
> La vista es **perfectamente actualizable** (`SELECT *`, conserva la clave, σ-π pura) y el `UPDATE`,
> sin `WHERE`, se ejecuta sin error sobre todas las filas de Tandil. Resultado: **la vista queda vacía**.
> La actualizabilidad no alcanza; hace falta un segundo mecanismo.
>
> `PROV_TANDIL` cambia de definición otra vez. Slide 13: `SELECT id_proveedor, nombre FROM PROVEEDOR
> WHERE ciudad='Tandil'`. Slide 14: `SELECT * FROM PROVEEDOR WHERE ciudad='Tandil'`. Con la del slide 13
> el `UPDATE … SET ciudad` ni compilaría (`ciudad` no está proyectada); por eso el slide 14 la redefine
> con `*`. Transcripto tal cual.

## Slide 15 · Vistas con Opción de Chequeo (WCO)

> *"**Solución a la migración de tuplas** → incluir la cláusula `WITH CHECK OPTION` (WCO)"*

Repite la sintaxis del slide 4 con la tercera línea (`[WITH [opción] CHECK OPTION]`) resaltada.

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

> [!tip] Por qué Date critica `LOCAL` (razonamiento propio, no está en el deck)
> Con `LOCAL` una actualización puede satisfacer la condición de la vista sobre la que se opera y
> **violar la de la vista de abajo**: la tupla migra igual, un nivel más abajo. `LOCAL` no elimina la
> migración, la esconde. El ejercicio del slide 17 es exactamente esa situación. Confirmar contra Date.

> [!success] Motor: acá MySQL sí acompaña
> **MySQL soporta `WITH CASCADED CHECK OPTION` y `WITH LOCAL CHECK OPTION`, con `CASCADED` por
> defecto**, igual que el estándar y que el slide. Se puede probar tal cual en la cursada, siempre sobre
> una vista/tabla actualizable.

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

El deck **no da las respuestas**; la tabla es **razonamiento propio, no está en el deck**, a verificar
en clase o en el TP4.

| Operación | Sin WCO | Con WCO |
| --- | --- | --- |
| `INSERT … ('P1','A1',500)` | **Procede.** `500 >= 500` → la fila **sí** se ve en la vista | **Procede** igual: satisface la condición |
| `INSERT … ('P2','A2',300)` | **Procede** sobre `ENVIO`, pero `300 < 500` → la fila **se inserta y desaparece**: no es visible en la vista que la insertó | **Se rechaza.** Es el caso *"cualquier inserción … que haga migrar una tupla"* |
| `UPDATE … SET cantidad=100 WHERE id_proveedor='P1'` | **Procede.** Las filas de P1 pasan a 100 y **migran fuera** de la vista | **Se rechaza:** `100 < 500` viola la condición |

> [!note] Detalles de integridad que el ejercicio no menciona (razonamiento propio)
> `ENVIO` tiene `id_proveedor` e `id_articulo` como **FK** y como PK compuesta: si `'P2'` o `'A2'` no
> existen, o `('P1','A1')` ya existía, el `INSERT` falla por integridad **antes de cualquier
> consideración sobre la vista** (el aclarado del slide 12). El slide 17 asume que `('P1','A1')` **sí**
> existe.
> El caso "sin WCO" del segundo `INSERT` es el más contraintuitivo: la fila se inserta **a través de la
> vista** y `SELECT * FROM Envios500` **no la muestra**; está en `ENVIO`, pero nunca perteneció a la
> vista. Es el mejor argumento para poner WCO siempre, como recomienda Date (slide 15).

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

El `UPDATE`, **transcripto literalmente del slide** (así como está no compila; ver el `[!bug]`):

```sql
UPDATE Envios500-999 SET cantidad= 300 where
 (id_proveedor = 'P1' and id_articulo = 'A1 )';
```

> [!bug] Cuatro errores en el slide 17
> 1. **`FROM ENVIO500`**: le falta la `S`. La vista se llama **`Envios500`**; tal como está, referencia
> una relación inexistente.
> 2. **`Envios500-999` como nombre de vista.** El guion es el **operador de resta** en SQL: un
> identificador sin comillar no puede contenerlo. Habría que escribir `` `Envios500-999` `` (MySQL,
> backticks), `"Envios500-999"` (estándar/PostgreSQL) o renombrarla `Envios500_999`. Probablemente sea
> notación informal del slide, pero en el TP4 hay que escribirlo bien.
> 3. **El paréntesis de cierre quedó *adentro* del literal.** El slide escribe `id_articulo = ‘A1 )’;`:
> el literal pasó de `'A1'` a `'A1 )'` y el `where (…` **nunca se cierra**. Es un error de sintaxis, y
> aun cerrando el paréntesis a mano compararía contra la cadena `A1 )`, que no existe en `ENVIO`.
> **La versión que hay que usar en el TP4 es** `... where (id_proveedor = 'P1' and id_articulo = 'A1');`.
> 4. El texto alterna `ENVIOS500` / `Envios500` / `ENVIO500` para la misma vista, y arrastra un
> `ENVIOS500-999_con` con guion bajo pegado al "con" (probablemente un subrayado del original).

El deck tampoco da esta respuesta; lo que sigue es **razonamiento propio, no está en el deck**. Sobre
la cadena `ENVIO → Envios500 → Envios500-999` hay dos condiciones, `cantidad >= 500` (propia de
`Envios500`) y `cantidad < 1000` (propia de `Envios500-999`), y el `UPDATE` pone `cantidad = 300`:

| Definición de `Envios500-999` | Qué se chequea | Resultado |
| --- | --- | --- |
| **`WITH CASCADED CHECK OPTION`** | `cantidad < 1000` **y** `cantidad >= 500` *(la de la vista subyacente)* | `300 < 1000` ✓ pero `300 >= 500` ✗ → **la operación se RECHAZA** |
| **`WITH LOCAL CHECK OPTION`** | **solo** `cantidad < 1000` | `300 < 1000` ✓ → **la operación PROCEDE** … y la tupla **migra**: desaparece de `Envios500-999` **y** de `Envios500`, porque ya no cumple `>= 500` |

> [!important] La crítica de Date a `LOCAL`, hecha ejemplo
> Con `LOCAL` el WCO **no cumple su promesa**: la tupla migra igual. Por eso `CASCADED` es el default
> del estándar y Date dice que `LOCAL` no debería usarse (slide 15). Regla mnemotécnica: `CASCADED`
> chequea **toda la cadena hacia abajo**; `LOCAL`, **un solo eslabón**.

> [!warning] Matiz del estándar que el slide simplifica (razonamiento propio)
> El slide define `LOCAL` como *"sólo se chequean contra las condiciones definidas en la misma vista"*.
> En el estándar SQL, `LOCAL` chequea la condición de la vista **más** las de las vistas subyacentes
> **que a su vez estén definidas `WITH CHECK OPTION`**. Acá `Envios500` se definió **sin** WCO, así que
> el resultado coincide con la lectura del slide; si `Envios500` tuviera su propio WCO, la fila `LOCAL`
> cambiaría. Verificar cuál de las dos definiciones vale para el parcial.

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

- [ ] ¿`PROV_COMP_TANDIL` (slide 5) o `PR_COMP_TANDIL` (slides 6 y 7)?
- [ ] ¿Cuál `PROV_COMP` vale? Slide 5: con clave (✓). Slide 13: sin clave (✗). `PROV_TANDIL` también
  tiene dos definiciones (slides 13 y 14).
- [ ] Respuestas de los ejercicios del slide 16 y del slide 17: las tablas de arriba son propias, sin
  confirmar.
- [ ] ¿La definición de `LOCAL` del slide 15 es la del estándar (que chequea también las vistas
  subyacentes con WCO)? Cuál se toma para el parcial.
- [ ] `Envios500-999` con guion: ¿notación del slide o hay que comillarlo (`` `Envios500-999` `` en MySQL)?
- [ ] El `UPDATE` del slide 17: confirmar que la intención es `id_articulo = 'A1'` con el paréntesis
  afuera antes de usarlo en el TP4.
- [ ] ¿Se puede hacer `INSERT` a través de `PROV_TANDIL`, que no proyecta `rubro` ni `ciudad`
  (`NOT NULL` sin `DEFAULT`)?
- [ ] `DROP VIEW … RESTRICT` en MySQL: confirmar contra la versión de la cátedra; afecta el TP4.
- [ ] ¿Qué es el "procedimiento específico" del slide 10? ¿Triggers `INSTEAD OF` (MySQL no los tiene)?
  ¿Es contenido de la [[Clase 07 - Vistas-Parte 2]] o de la clase de triggers?
- [ ] ¿Cómo se determina la clave de una vista de ensamble? El slide 11 dice *"la de **alguna** de las
  tablas"*. En `PROV_ENVIOS_TANDIL` (slide 6), ¿es la de `PROVEEDOR` o la de `ENVIO`?
- [ ] ¿Qué "interpretaciones particulares" hace MySQL de la propiedad key-preserved (slide 11)?
- [ ] Conseguir Sumathi & Esakkirajan (2007): la cátedra cita su diagrama y no está en el vault.
- [ ] ¿Las vistas materializadas entran en el parcial? Aparecen en los slides 3 y 8 y MySQL no las
  soporta. ¿Se desarrollan en la [[Clase 07 - Vistas-Parte 2]]?

## Enlaces

- Clase anterior: [[Clase 05 - Consultas de Datos–Parte 3]] · clase siguiente: [[Clase 07 - Vistas-Parte 2]], donde
  **sigue el tema de vistas**. Después viene [[Clase 08 - Explicando el plan]] (índices y plan de ejecución).
- Práctica correspondiente (martes 11/08, **TP4 Vistas**): [[Práctica 2026-08-11]]
- Los tres niveles vienen de acá: [[Clase 01 - Introducción_BasesDeDatos]]
- Conceptos: [[1.06.01 - Vistas|Vistas]] · [[Preservación de clave]] · [[Clase 07 - Vistas-Parte 2|Vistas materializadas]] · [[Esquema externo]]
- Motor: [[MySQL]] — ver los tres callouts de motor de esta página (`DROP VIEW`, vistas materializadas,
  WCO)
- Bibliografía: [[_index-bibliografia]] · calendario: [[_cronograma]] · índice: [[_index-clases]]
