---
tipo: teorica
clase: 3
unidad: 1
deck: "BD2_Clase 03 - Derivación a Esquema Lógico.pdf"
tema: Derivación del MER a esquema lógico relacional
resumen: "Reglas para derivar el MER a tablas SQL: FK del lado 1 en la tabla del lado N, tabla nueva con clave yuxtapuesta para N:N, una tabla por nodo de la jerarquía con discriminador solo si es exclusiva, y clave parcial más clave de la fuerte en entidades débiles. El deck no da regla para 1:1 ni n-arias."
fecha: 2026-08-03
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 03
  - Derivación a Esquema Lógico
  - Reglas de transformación MER a relacional
  - Esquemas de tablas
  - Diseño lógico
  - Pasaje de DER a tablas
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 03 - Derivación a Esquema Lógico.pdf"
estado: procesado
---

# Clase 03 — Derivación a Esquema Lógico

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 03 - Derivación a Esquema Lógico.pdf` · **24 slides**
> Dictado en la **teórica del lunes 03/08**. El `03` del nombre del archivo **es el número de clase**:
> la numeración de la cátedra (`BD2_Clase NN`) es la que manda. Índice de todas las clases en
> [[_index-clases]].
> Viene inmediatamente después de [[Clase 02 - Modelo Entidad-Relacion]] y **cierra dos de las preguntas que esa clase
> dejó abiertas** (ver § más abajo). Sigue en [[Clase 04 - AlteraciónActualizaciónTablas]].
> Se practica con `ITBA TP 2 Creates.pdf` → [[Práctica 2026-08-04]].
> Bibliografía: [[_index-bibliografia]].

> [!warning] El deck es de PostgreSQL, la cursada corre sobre MySQL
> Slide 10 linkea el catálogo de tipos de **PostgreSQL 9.5**, y la gramática de `CREATE TABLE` de los
> slides 23–24 es la del *synopsis* de PostgreSQL (`index_parameters`, `DEFAULT default_expr`).
> Detalle de qué corre igual y qué no en § [[#PostgreSQL vs. MySQL en este deck]].

## Resumen

La clase anterior terminó con un **MER**; esta lo convierte en **tablas**. En el medio hay un
conjunto cerrado de **reglas de transformación**, una por cada constructo del MER. El deck las da en
cuatro tandas —entidades, relaciones, jerarquías, entidades débiles— y las ilustra con capturas de
un modelador tipo ERwin: el MER y el modelo físico en el mismo slide (la disposición cambia de slide
en slide) y, en varios de ellos, flechas rojas uniendo el antes y el después.

| Tanda | Qué transforma | Slides |
| --- | --- | --- |
| **Preliminares** | Qué es una tabla, clave, F.K., comprensión vs. extensión | 2–6 |
| **Entidades** | Las 7 reglas + ejemplo `ALUMNO` + `CREATE TABLE` | 7–10 |
| **Relaciones** | 1:N binaria y unaria · N:N binaria y unaria · atributos de la relación | 11–18 |
| **Jerarquías** | Supertipo/subtipo, discriminador, exclusiva vs. compartida | 19–21 |
| **Entidades débiles** | Clave parcial + clave de la fuerte | 22 |
| **Sintaxis** | Gramática completa de `CREATE TABLE` | 23–24 |

---

## Chuleta: tabla de reglas de transformación

Toda la clase comprimida. Cada fila es directamente aplicable en el parcial y en el **TP 2**.

| Constructo del MER | Cómo queda en el esquema relacional | Slide |
| --- | --- | --- |
| **Entidad** (fuerte/regular) | Una **tabla** con el **mismo nombre** de la entidad | 7 |
| **Identificador principal (IP)** | La **clave** de esa tabla — el slide dice *"clave"*, no *"clave primaria"*; el SQL del slide 9 la escribe `PRIMARY KEY` | 7 |
| **Atributo simplemente valuado** | Una **columna** de esa tabla | 7 |
| **Atributo obligatorio** | Columna **`NOT NULL`** | 7 |
| **Atributo opcional** | Columna **igual pero sin la leyenda** `NOT NULL` | 7 |
| **Atributo compuesto** | Se **despliega en sus partes componentes**, cada una como si fuera univaluada | 7, 8 |
| **Atributo multivaluado** | Se **proyecta en otra tabla** junto con la clave de la entidad o de la (inter)relación | 7, 8 |
| **Identificador alternativo** | El deck lo dibuja `(AK1:1)` en el modelo físico; **no da la regla SQL** | 8 |
| **Atributo derivado** | **—** (el deck no dice nada) | — |
| **Relación binaria 1:N** | La clave del **lado 1** se agrega en la tabla del **lado N** → **clave extranjera** | 11 |
| **Relación unaria 1:N (ó N:1)** | Igual, pero la FK **DEBE renombrarse** (queda en la misma tabla) | 12 |
| **Relación binaria N:N** | **Tabla nueva**; clave = **yuxtaposición** de las claves de las entidades; cada una, por separado, es **FK** | 13, 14 |
| **Relación unaria N:N** | Igual; las dos FK salen de la misma tabla, con una renombrada | 13, 17 |
| **Nombre de la tabla de una N:N** | El del **rombo**, *"o puede renombrarse"* | 13 |
| **Atributos de una relación 1:N** *(designativa)* | Se incluyen en la **tabla del lado N** | 18 |
| **Atributos de una relación N:N o ternaria** *(asociativa)* | Se incluyen en la **tabla producto de la relación** | 18 |
| **Jerarquía — supertipo** | Una tabla con los **atributos en común, incluido su identificador** | 19 |
| **Jerarquía — subtipo** | Una tabla por subtipo con sus **atributos propios**; su clave **es la clave del supertipo** | 19 |
| **Jerarquía exclusiva** | Además, el **atributo discriminante (`tipo`)** se agrega a la tabla del **supertipo** | 19, 21 |
| **Jerarquía compartida** | **Sin** discriminador | 21 |
| **Entidad débil** | Clave = **identificador propio (clave parcial) + clave de la entidad fuerte**; esa segunda parte es además FK | 22 |
| **Relación binaria 1:1** | **—** el deck **no la trata en ningún slide** | — |
| **Relación ternaria / n-aria** | Solo se la nombra al pasar en el slide 18; **no hay regla ni ejemplo** | — |

> [!missing] Dos huecos grandes del deck
> **1:1** y **n-arias** no tienen regla. Las dos aparecen en cualquier enunciado de parcial, así que
> hay que traerlas de otra fuente o de clase. Ver § Dudas abiertas.

---

## Slides 1–2 · De dónde a dónde

Portada: **Bases de Datos II** / **ESQUEMAS DE TABLAS**. El slide 2 se titula **DISEÑO LÓGICO** y da
el diagrama completo de la clase:

```
        Modelo de Entidades y Relaciones
                     │
                     ▼   Reglas de Transformación
        Esquema Lógico según el Modelo Relacional
        Esquema Post-relacional (tablas en SQL)
```

Dos nombres para el destino, subrayados los dos en el slide: **esquema lógico según el modelo
relacional** y **esquema post-relacional (tablas en SQL)**. El título del slide (**DISEÑO LÓGICO**) lo
ubica solo: es la tercera caja de [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]] — el paso del diseño conceptual al
diseño lógico.

## Slide 3 · Lenguaje SQL

> *"La definición de los datos se realiza a través de sentencia de **DDl**"* ← así, con la `l`
> minúscula, en el slide.

- Sus comandos permiten definir **la semántica del esquema relacional**: *"que tablas o relaciones se
  establecen, sus posibles valores (dominios), asociaciones, restricciones, etc."*
- *"Los datos o información de dichas tablas las guarda el **SGBD** en tablas propias denominadas
  tablas de **metadatos**."*
- *"**Él** nombre de las tablas **deben** ser único dentro de cada esquema."* ← así, con `Él` acentuado
  y el verbo en plural, en el slide.
- *"Una tabla en una base de datos relacional es similar a una tabla en papel, posee columnas y filas."*

## Slide 4 · Esquema de base de datos

| Concepto | Definición textual del slide |
| --- | --- |
| **Base de datos relacional** | *"Una base de datos relacional consiste en un conjunto de tablas relacionales (o relaciones) cada una de las cuales contiene un conjunto de tuplas."* |
| **Clave** (o clave alternativa) | *"Una clave (o clave alternativa) en una tabla es un subconjunto de las columnas de la tabla que identifica a cada tupla."* |
| **Clave extranjera (F. K.)** | *"Un F. K. en una tabla T es un conjunto de columnas F que hace referencia a la clave de otra tabla T 'e impone una restricción (**Restricción de Integridad Referencial**)"* ← el `'` que cierra `T'` quedó pegado a la `e` en el slide |

> [!note] El deck fija la abreviatura
> *"La clave y clave extranjera (en adelante abreviado como **F. K.** foreign key)"*. En el resto del
> deck aparece como `(FK)` en los diagramas y como `FOREIGN KEY` en el SQL.

> [!bug] "Clave (o clave alternativa)" mete las dos en la misma definición
> El slide define **clave** y entre paréntesis dice *"o clave alternativa"*, como si fueran lo mismo.
> En la clase anterior eran cosas distintas: **IP** vs. **identificador alternativo**
> ([[Clase 02 - Modelo Entidad-Relacion]], slides 14–19). El slide 8 sí las distingue, con
> la marca `(AK1:1)`. **Verificar en clase** si acá "clave" está usado como *clave candidata*.

## Slide 5 · Ejemplo `MÉDICO` — comprensión y extensión

Las relaciones **pueden visualizarse en forma tabular**. El slide rotula cada parte de una tabla:

| MÉDICO | | | | |
| --- | --- | --- | --- | --- |
| **Matricula** | **NyApell** | **Especialidad** | **DNI** | **ClinicaEjerce** |
| 234555 | Juan Paz | Traumatología | 26456678 | C. Modelo |
| 345234 | Inés Roca | Pediatría | 30564865 | C. Paz |
| 365478 | Pedro Jara | Traumatología | 23546987 | Cons. Privado |
| …. | ………. | ……….. | ………. | …………. |

| Rótulo del slide | Qué señala |
| --- | --- |
| **Nombre de la tabla (relación)** | `MÉDICO` |
| **Nombre de la columna (atributo)** | `Matricula`, `NyApell`, … |
| **Esquema de una tabla o cabecera — (comprensión)** | la fila de encabezados |
| **Fila (tupla)** | cada renglón de datos |
| **Valor o estado de de la tabla (extensión)** — *"de de"*, así en el slide | el conjunto de las filas |

> *"Cada columna tiene un **dominio de definición** que incluye los valores posibles que puede tomar"*.

> [!tip] Razonamiento propio, no está en el deck
> El par **comprensión / extensión** es el mismo par *esquema / instancia*: la cabecera no cambia, el
> contenido sí. El slide da los dos términos y no los relaciona con nada más.

## Slide 6 · Tablas en SQL

- **En SQL no existe un orden para las filas de una tabla.** Cuando se lee una tabla, las filas
  aparecerán en un **orden aleatorio**, a menos que se especifique uno.
- Las **columnas** contienen la información de los campos de la tabla: **nombre, tipo de dato y
  restricciones** asociadas a la columna.
- *"Las filas **contiene** los registros o instancias."* ← sin la `n`, así en el slide.

---

## Slide 7 · Reglas de transformación de entidades

> *"Las reglas de transformación del **DERExt** al Esquema Relacional de Bases de Datos para entidades
> son las siguientes"*

1. Se crea **una tabla por cada entidad**, con el **mismo nombre** de la entidad.
2. El **identificador de la entidad** se transforma en la **clave** de dicha tabla.
3. Todo **atributo simplemente valuado** de la entidad se transforma en un atributo de dicha tabla.
4. Los **atributos compuestos** se **despliegan en sus partes componentes**, como si fueran univaluados.
5. Los **atributos obligatorios** llevan una leyenda de **`NOT NULL`**.
6. Los **atributos opcionales** se indican de la misma manera que los obligatorios **sin la leyenda**.
7. Los **atributos multivaluados** se **proyectan en otra tabla** conjuntamente con la clave de la
   entidad **o de la (inter)relación**.

> [!important] La regla 7 es la que rompe la correspondencia 1 entidad = 1 tabla
> Un atributo multivaluado agrega **una tabla más**, y esa tabla tiene clave **compuesta**: clave de
> la entidad + el propio atributo. Es el mismo mecanismo que va a resolver la entidad débil (slide 22).
> El *"o de la (inter)relación"* del final cubre el caso de un atributo multivaluado colgado de un
> rombo, que el deck **no ejemplifica**.

> [!warning] Cuarta sigla para el modelo extendido
> Acá dice **DERExt**. La clase anterior usaba `MER`, `MERExt` y `MERE` para lo mismo
> ([[Clase 02 - Modelo Entidad-Relacion]], slides 7–8). Cuatro nombres, un solo modelo.

## Slide 8 · Derivación de entidades — el ejemplo `ALUMNO`

*"Aplicando las reglas anteriores…"*. A la derecha, el **MER** de la clase anterior; a la izquierda,
el **modelo físico** resultante.

**MER de partida** (el `ALUMNO` del slide 19 de la [[Clase 02 - Modelo Entidad-Relacion]], pero **no idéntico**: acá
aparece `Documento` como identificador alternativo, `e-mails` se llama `Mails` y `Dirección` se
desagrega en `Calle`/`Nro`/`Ciudad` en vez de `Calle`/`Número`):

| Atributo | Notación en el diagrama | Lectura |
| --- | --- | --- |
| `LU` | bolita **rellena** ● | identificador principal |
| `Documento` | bolita **mitad** ◐ | identificador **alternativo** |
| `Apellido`, `Nombre` | bolita vacía ○, línea continua | descriptor obligatorio |
| `Telefonos` | línea **punteada** + **pata de gallo** `>` | **opcional y multivaluado** |
| `Tutor` | línea **punteada** | opcional |
| `Mails` | **pata de gallo** `>`, línea continua | obligatorio y **multivaluado** |
| `Dirección` | bolita de la que **cuelgan** `Calle`, `Nro`, `Ciudad` | **compuesto** |

**Modelo físico resultante — tres tablas:**

| Tabla | Columnas | Notas del diagrama |
| --- | --- | --- |
| **`ALUMNO`** | `LU` **NOT NULL** *(PK)* · `Documento` NOT NULL **(AK1:1)** · `Apellido` NOT NULL · `Nombre` NOT NULL · `Tutor` **NULL** · `Calle` NOT NULL · `Nro` NOT NULL · `Ciudad` NOT NULL | rectángulo de **esquinas rectas** |
| **`TELEF_ALUM`** | `LU (FK)` NOT NULL · `Telefono` NOT NULL — **las dos en el compartimento de la clave** | esquinas **redondeadas** |
| **`MAILS_ALUM`** | `LU (FK)` NOT NULL · `e_mails` NOT NULL — **las dos en el compartimento de la clave** | esquinas **redondeadas** |

Lo que hay que leer de acá:

- El **compuesto** `Dirección` **desapareció como tal**: quedaron `Calle`, `Nro`, `Ciudad` sueltos
  dentro de `ALUMNO`. No hay tabla `DIRECCION`.
- Los dos **multivaluados** se fueron cada uno a **su propia tabla**, con `LU` como FK y **clave
  compuesta** `{LU, atributo}`. Nombres: `TELEF_ALUM`, `MAILS_ALUM` — o sea, **el deck no da regla de
  nombre**, los inventa.
- El **opcional** `Tutor` es el único que dice **`NULL`** explícito en vez de `NOT NULL`.
- El **identificador alternativo** se marca **`(AK1:1)`** — *alternate key 1, posición 1*.

Y el slide cierra con una clasificación nueva, sin definirla:

> [!quote] Slide 8, al pie
> *"Relaciones entre tablas: **Identificatorias** / **No Identificatorias**"*

> [!important] Qué son, leído de los diagramas del propio deck
> **Razonamiento propio, no está en el deck** — el deck enuncia los dos nombres y nunca los define,
> pero la notación es consistente en todas las capturas del modelo físico:
>
> | | Línea en el diagrama | La FK del hijo… | Ejemplos del deck |
> | --- | --- | --- | --- |
> | **Identificatoria** | **llena** | **forma parte de su clave primaria** (FK en rojo, arriba de la línea divisoria, caja de esquinas **redondeadas**) | `ALUMNO`→`TELEF_ALUM` (8) · `ALUMNO`→`ALUMNOSXCARRERA` (14) · `CAMPO`→`PARCELA` (22) · supertipo→subtipos (20) |
> | **No identificatoria** | **punteada** | es **un atributo más** (FK en azul, debajo de la línea, caja de esquinas **rectas**) | `CIUDAD`→`ALUMNO` (11) · `ALUMNO`→`ALUMNO` por `LUTutor` (12) |
>
> **Confirmar en clase**, porque es exactamente la distinción que hace falta para el TP 2.

## Slide 9 · Creación de tablas

- *"Cada columna debe tener un determinado **tipo de dato**."*
- *"El tipo de dato **limita el conjunto de valores posibles** que se pueden asignar a una columna."*

```sql
CREATE TABLE ALUMNO(
    LU             integer      NOT NULL,
    Documento      integer      NOT NULL,
    Apellido       varchar(30)  NOT NULL,
    Nombre         varchar(30)  NOT NULL,
    Tutor          varchar(50),
    Calle          varchar(40)  NOT NULL,
    Nro            integer      NOT NULL,
    Ciudad         varchar(6 0) NOT NULL,
    CONSTRAINT PK_ALUMNO PRIMARY KEY (LU)
);
```

> *"O puede colocarse la definición de la clave primaria en sentencia aparte"*

```sql
ALTER TABLE ALUMNO
ADD CONSTRAINT PK_ALUMNO PRIMARY KEY (LU);
```

El slide repite además, a la izquierda, la caja `ALUMNO` del modelo físico del slide 8 (con
`Documento NOT NULL (AK1:1)` incluido).

Convención de nombres de constraint que siguen **los ejemplos** del deck (nunca la enuncia como
regla): **`PK_<TABLA>`** y **`FK_<TABLA>_<TABLAREFERENCIADA>`**.

> [!bug] `varchar(6 0)` — está así en el slide
> Con un espacio en el medio. Es un tipeo por `varchar(60)`; tal cual está **no compila**. Se
> transcribe literal porque así lo van a ver en el PDF.

> [!bug] El `CREATE TABLE` **no** implementa el identificador alternativo
> El diagrama dice `Documento NOT NULL (AK1:1)`, pero el SQL no tiene ningún `UNIQUE (Documento)` ni
> `CONSTRAINT AK1_ALUMNO UNIQUE (Documento)`. La regla del slide 7 tampoco menciona los alternativos.
> **Falta la regla para identificadores alternativos.** ← esto entra en el TP 2.

> [!note] La `PK` está declarada dos veces
> **Razonamiento propio, no está en el deck:** si se ejecuta el `CREATE TABLE` **y después** el
> `ALTER TABLE`, el segundo falla porque ya existe una PK. El slide los presenta como **alternativas**
> (*"O puede colocarse…"*), no como una secuencia.

## Slide 10 · Tipos de datos

El slide entero es:

> **Tipos de datos Postgresql**
> <https://www.postgresql.org/docs/9.5/static/datatype.html>

> [!warning] Motor equivocado, y versión vieja
> La cursada corre sobre **MySQL** ([[_cronograma]] § Diferencias con el programa oficial), y encima
> **PostgreSQL 9.5** es una versión ya sin soporte. El catálogo de tipos que hay que mirar para el TP
> es el de MySQL. Ver § [[#PostgreSQL vs. MySQL en este deck]].

Tipos que efectivamente usa el deck en sus ejemplos: **`integer`**, **`varchar(n)`**, **`char(n)`**,
**`date`**.

> [!tip] Razonamiento propio, no está en el deck
> Los cuatro tipos existen igual en MySQL, así que **el SQL de los slides 9, 15 y 16 corre en MySQL sin
> cambios** (salvo los dos tipeos, `varchar(6 0)` y `PK_ ALUMNOSXCARRERA`). Inventario completo en
> § [[#PostgreSQL vs. MySQL en este deck]].

---

## Slide 11 · Relaciones binarias 1:N

> [!quote] La regla, textual
> *"Los atributos identificadores de la entidad (clave de la relación) del **'lado 1'**, se agregan
> como atributos en la tabla correspondiente a la <u>entidad del 'lado N'</u> → constituyen una
> **clave extranjera**"*

**MER de partida:**

```
ALUMNO ──(1,N)──◇ CURSA_EN ◇──(1,1)── CIUDAD
  ●LU                 │                  ●IdCiudad
  ○Apellido      ○FechaInsc              ○SedeUnicen
  ○Nombre
  ○FechaNac
```

**Modelo físico resultante:**

| `ALUMNO` | | `CIUDAD` | |
| --- | --- | --- | --- |
| `LU` *(PK)* | NOT NULL | `IdCiudad` *(PK)* | NOT NULL |
| `Apellido` | NOT NULL | `SedeUNICEN` | NOT NULL |
| `Nombre` | NOT NULL | | |
| **`IdCiudad (FK)`** | **NOT NULL** | | |
| `FechaInsc` | **NULL** | | |

Las dos flechas rojas del slide señalan exactamente esto: `IdCiudad` viaja del lado 1 al lado N (con
el cartel **CLAVE EXTRANJERA**), y `FechaInsc` —que es atributo **del rombo**— viaja también a la
tabla del lado N. Es el caso "designativa" que el slide 18 va a enunciar como regla.

La relación se dibuja con **línea punteada**: es **no identificatoria**.

> [!note] Por qué la FK queda `NOT NULL`
> **Razonamiento propio, no está en el deck:** la cardinalidad `(1,1)` pegada a `CIUDAD` dice, en la
> lectura **look-across** que fijó la clase anterior, que **cada alumno tiene exactamente una
> ciudad**; de ahí el `NOT NULL` de `IdCiudad (FK)`. El slide no lo justifica
> (ver [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]]).

> [!bug] `FechaNac` desaparece
> El MER de arriba tiene `FechaNac` en `ALUMNO`; la tabla de abajo **no la tiene**. No hay regla que
> justifique perderla — es un descuido del armado del slide. **Verificar en clase.**

> [!note] `SedeUnicen` / `SedeUNICEN`
> El MER escribe `SedeUnicen` y la tabla `SedeUNICEN`. **UNICEN** es la Universidad Nacional del
> Centro, no el ITBA: el deck viene reciclado de otra cursada. No cambia nada del contenido.

## Slide 12 · Relaciones unarias 1:N (ó N:1)

**MER de partida** — una relación **reflexiva** sobre `ALUMNO`:

```
        ┌──(0,N)──◇ ES TUTOR DE ◇
        │                      │
        └──(0,1)───────────────┘
     ALUMNO (●LU, ○Apellido, ○Nombre)
```

**Modelo físico resultante:** una sola tabla, `ALUMNO`, con la FK apuntándose a sí misma:

| `ALUMNO` | |
| --- | --- |
| `LU` *(PK)* | NOT NULL |
| **`LUTutor (FK)`** | NOT NULL |
| `Apellido` | NOT NULL |
| `Nombre` | NOT NULL |

Todo el contenido del slide es un cartel verde apuntando a `LUTutor`:

> [!quote] Slide 12
> **DEBE renombrarse**

Es la única diferencia con el caso binario: la FK y la PK conviven en la misma tabla, así que la FK
**no puede** llamarse `LU`. La relación se dibuja **punteada** (no identificatoria) y con pata de
gallo apuntando a la propia `ALUMNO`.

> [!bug] `LUTutor NOT NULL` contradice la cardinalidad `(0,1)`
> **Razonamiento propio, no está en el deck:** el `(0,1)` dice que un alumno **puede no tener tutor**,
> y de hecho el `Tutor` del slide 8 era opcional; la columna tendría que admitir `NULL`. Además, con
> `NOT NULL` el modelo es imposible de poblar: no se puede insertar el primer alumno, porque
> necesitaría un tutor que todavía no existe. **Verificar en clase.**

## Slide 13 · Relaciones unarias y binarias N:N — la regla

- Se crea una **nueva tabla**, cuya clave es la **yuxtaposición de los identificadores (claves)** de
  cada una de las entidades participantes.
- **Nombre de tabla:** *"nombre indicado en el rombo, o puede renombrarse"*.
- *"**Cada una de las claves, por separado** es una clave extranjera referida a la tabla(entidad) de
  la cual proviene."* ← sin coma después de *separado* y sin espacio en `tabla(entidad)`, así en el slide.

> [!tip] "Por separado" es la parte que se olvida
> **Razonamiento propio, no está en el deck:** la tabla tiene **una PK compuesta** `(A, B)` **y dos FK
> sueltas**, una a la tabla de `A` y otra a la de `B`; no es una sola FK compuesta. El slide 16 lo
> muestra con dos `ALTER TABLE` distintos.

## Slide 14 · Relaciones binarias N:N — el ejemplo

**MER de partida:**

```
ALUMNO ──(0,N)──◇ CURSA ◇──(0,N)── CARRERA
  ●LU                                 ●IdCarrera
  ○Apellido                           ○NombreCarrera
  ○Nombre                             ○PlanEstudio
  ○FechaNac
```

**Modelo físico resultante — tres tablas:**

| `ALUMNO` | | `ALUMNOSXCARRERA` | | `CARRERA` | |
| --- | --- | --- | --- | --- | --- |
| `LU` *(PK)* | NOT NULL | **`LU (FK)`** *(PK)* | NOT NULL | `IdCarrera` *(PK)* | NOT NULL |
| `Apellido` | NOT NULL | **`IdCarrera (FK)`** *(PK)* | NOT NULL | `NombreCarrera` | NOT NULL |
| `Nombre` | NOT NULL | | | `PlanEstudio` | NOT NULL |
| `FechaNac` | **NULL** | | | | |

El rombo se llamaba `CURSA` y la tabla se llama **`ALUMNOSXCARRERA`**: el deck ejerce el *"o puede
renombrarse"*. La convención que usa es **`<A>X<B>`** (`ALUMNOSXCARRERA`, `TUTORXALUMNO`).

Las dos relaciones se dibujan con **línea llena**: son **identificatorias**, porque las dos FK forman
la PK de la tabla intermedia. Notar que `ALUMNOSXCARRERA` **no tiene ninguna columna propia** — es
una tabla de dos columnas, las dos FK.

## Slide 15 · `CREATE TABLE` de las dos entidades

```sql
CREATE TABLE ALUMNO(
   LU              integer      NOT NULL,
   Apellido        varchar(30)  NOT NULL,
   Nombre          varchar(30)  NOT NULL,
   FechaNac        date,
CONSTRAINT PK_ALUMNO PRIMARY KEY (LU)
);

CREATE TABLE CARRERA(
   IdCarrera     char(5)       NOT NULL,
   NombreCarrera varchar(100)  NOT NULL,
   PlanEstudio   char(6)       NOT NULL,
   CONSTRAINT PK_CARRERA PRIMARY KEY (IdCarrera)
);
```

`FechaNac` es el único atributo opcional del ejemplo y es el único **sin** `NOT NULL` — regla 6 del
slide 7 en acción. Tipos: `integer`, `varchar(n)`, **`char(n)`** para códigos de longitud fija
(`IdCarrera char(5)`, `PlanEstudio char(6)`) y **`date`**.

## Slide 16 · `CREATE TABLE` de la tabla intermedia

```sql
CREATE TABLE ALUMNOSXCARRERA(
   LU        integer NOT NULL,
   IdCarrera char(5) NOT NULL,
   CONSTRAINT PK_ ALUMNOSXCARRERA PRIMARY KEY (LU, IdCarrera)
);

ALTER TABLE ALUMNOSXCARRERA ADD CONSTRAINT FK_ALUMNOSXCARRERA_CARRERA
  FOREIGN KEY (IdCarrera)
  REFERENCES CARRERA(IdCarrera);

ALTER TABLE ALUMNOSXCARRERA ADD CONSTRAINT FK_ALUMNOSXCARRERA_ALUMNO
  FOREIGN KEY (LU)
  REFERENCES ALUMNO(LU);
```

Este es **el patrón completo de una N:N** y conviene memorizarlo tal cual: PK compuesta en el
`CREATE`, cada FK en su propio `ALTER`, y los tipos de las columnas **copiados exactos** de la tabla
referenciada (`LU integer`, `IdCarrera char(5)`).

> [!bug] `PK_ ALUMNOSXCARRERA` — espacio después del guion bajo
> Está así en el slide. Tal cual escrito, el parser lee `PK_` como nombre del constraint y después se
> encuentra un identificador suelto → **error de sintaxis**. Igual que el `varchar(6 0)` del slide 9.

> [!tip] El orden de ejecución importa
> **Razonamiento propio, no está en el deck:** las FK se agregan **después** de que existan las tres
> tablas. Declararlas con `ALTER TABLE` en vez de inline evita el problema de las dependencias
> circulares al crear el esquema. El deck usa `ALTER TABLE` pero **no dice por qué**.

## Slide 17 · Relaciones unarias N:N

**MER de partida** — la misma `ES TUTOR DE` del slide 12, pero ahora `(0,N)` de los **dos** lados:

```
        ┌──(0,N)──◇ ES TUTOR DE ◇
        │                      │
        └──(0,N)───────────────┘
     ALUMNO (●LU, ○Apellido, ○Nombre)
```

**Modelo físico resultante:**

| `ALUMNO` | | `TUTORXALUMNO` | |
| --- | --- | --- | --- |
| `LU` *(PK)* | NOT NULL | **`LU (FK)`** *(PK)* | NOT NULL |
| `Apellido` | NOT NULL | **`LUTutor (FK)`** *(PK)* | NOT NULL |
| `Nombre` | NOT NULL | | |

Las **dos** FK apuntan a `ALUMNO`, y en el diagrama salen **dos líneas** de `ALUMNO` hacia
`TUTORXALUMNO`. Se aplica a la vez la regla de la N:N (tabla nueva, clave yuxtapuesta, dos FK) y la
del caso unario (una de las dos **debe renombrarse** → `LUTutor`).

> [!tip] Comparación 1:N vs. N:N en el caso unario
> **Es el mismo enunciado** con la cardinalidad cambiada, y da dos esquemas completamente distintos:
> con `(0,1)` la FK se queda **dentro de `ALUMNO`** (slide 12); con `(0,N)` aparece **una tabla
> aparte** (slide 17). Es el mejor ejemplo del deck de por qué las cardinalidades del MER no son
> decorativas.

## Slide 18 · Derivación de atributos en relaciones

- Los atributos de una relación **pueden ser del mismo tipo que los de una entidad** (o sea: valen los
  mismos cinco ejes de la clase anterior — obligatorio/opcional, uni/multivaluado, etc.).
- Si la relación que describen es **designativa (1:N)** → se incluyen en la **tabla del lado N**,
  derivándolos en forma **análoga a los de las entidades**.
- Si la relación es **asociativa (binaria N:N o ternaria)** → se derivan en la **tabla producto de la
  relación**, *"también de forma análoga a los de las entidades"*.

| Término del slide | Qué relación es | Dónde van sus atributos |
| --- | --- | --- |
| **Designativa** | 1:N | tabla del lado **N** (junto a la FK) |
| **Asociativa** | N:N binaria **o ternaria** | tabla **producto de la relación** |

> [!note] Vocabulario nuevo: *designativa* y *asociativa*
> Aparece acá por primera vez en toda la cursada y no está en la [[Clase 02 - Modelo Entidad-Relacion]]. El deck **no
> los define**: los usa como sinónimos de 1:N y de N:N/ternaria.
> **Razonamiento propio, no está en el deck:** sirve como regla mental que una relación
> **designativa** no genera tabla (solo una FK) y una **asociativa** sí.

> [!missing] La ternaria se nombra pero no se deriva
> El slide dice *"binaria N:N o ternaria"* y ahí termina: **no hay ningún ejemplo ni regla de
> derivación de relaciones n-arias en todo el deck**. Por analogía sería una tabla con la
> yuxtaposición de las tres claves, pero **eso no está en el deck** — hay que confirmarlo.

---

## Slides 19–21 · Derivación de jerarquías

### Slide 19 · Las reglas

- Se crea **una tabla por la entidad supertipo** (*"con los atributos en común **incluído** su
  identificador"*, con acento en el slide) y **una tabla por cada una de las entidades subtipo** (con
  los **atributos propios**).
- **La clave de la tabla subtipo es la clave de la tabla del supertipo.**
- *"Para las jerarquías **exclusivas**, que deben incluir el **atributo discriminante (tipo)**, éste se
  debe agregar a la tabla correspondiente a la **entidad supertipo**"*.

O sea: **una tabla por nodo del árbol**, todas con la misma clave, y el discriminador **arriba**, no
abajo.

> [!note] Razonamiento propio, no está en el deck
> En la literatura esta estrategia se llama *class-table inheritance* o *vertical partitioning*, y hay
> otras dos (todo en una sola tabla, o una tabla por hoja). **El deck no le da nombre a la suya ni
> menciona las alternativas**: da una sola forma de derivar jerarquías. Los nombres van sin verificar
> contra bibliografía — ver [[_index-bibliografia]].

### Slide 20 · El ejemplo `PRODUCTO`

Es la jerarquía del slide 35 de la [[Clase 02 - Modelo Entidad-Relacion]], ahora derivada.

**MER de partida:**

```
PRODUCTO (●IdProducto, ○Descripcion, ○Marca)
    │ <Tipo>
    ├── SOLIDO  (○CantxPaq)
    └── LIQUIDO (○CuidaddoManip)          ← "CuidaddoManip", con dos 'd', en el slide
            │
            ├── ENVASADO (>○Presentacion) ← multivaluado (pata de gallo)
            └── A_GRANEL (○CantMinima)
```

**Modelo físico resultante — cinco tablas:**

| Tabla | Columnas |
| --- | --- |
| **`PRODUCTO`** | `IdProducto` *(PK)* · `Descripcion` · `Marca` · **`Tipo`** ← agregado por la regla del discriminador |
| **`SOLIDO`** | `IdProducto (FK)` *(PK)* · `CantxPaq` |
| **`LIQUIDO`** | `IdProducto (FK)` *(PK)* · `CuidadoManip` |
| **`ENVASADO`** | `IdProducto (FK)` *(PK)* — **y nada más** |
| **`A_GRANEL`** | `IdProducto (FK)` *(PK)* · `CantMinima` |

El slide **no tiene texto**: son los dos diagramas (MER arriba a la izquierda, modelo físico a la
derecha) y una **flecha roja grande** que arranca sobre los atributos de `PRODUCTO` en el MER —a la
altura de `IdProducto`/`Marca`, **no** sobre el `<Tipo>`— y termina apuntando a la columna `Tipo` de la
tabla `PRODUCTO` del modelo físico. Es la ilustración de la tercera regla.

Notación de los conectores de jerarquía en el modelo físico (símbolos de tipo ERwin):

| Nivel | Símbolo | Rótulo |
| --- | --- | --- |
| `PRODUCTO` → `SOLIDO`/`LIQUIDO` | semicírculo **con trazos cruzados** | **`Tipo`** |
| `LIQUIDO` → `ENVASADO`/`A_GRANEL` | semicírculo **liso** | **sin rótulo** |

> [!important] Los dos niveles no son del mismo tipo
> El primer nivel es la jerarquía **exclusiva** (lleva discriminador, y por eso `PRODUCTO` tiene la
> columna `Tipo`) y el segundo es la **compartida** (no lo lleva). Esto **no está rotulado en este
> slide**, pero sí en el mismo diagrama de la clase anterior
> ([[Clase 02 - Modelo Entidad-Relacion]], slide 35), y el slide 21 lo dice con letras en el
> caso general.
> **Razonamiento propio:** lo que no dice ningún slide es qué significan los dos **símbolos** del
> conector (semicírculo con trazos cruzados vs. semicírculo liso); la correspondencia
> *cruzado = exclusiva* / *liso = compartida* sale de comparar los slides 20 y 21. **Confirmar en clase.**

> [!bug] `Presentacion` se pierde
> En el MER, `Presentacion` es un atributo **multivaluado** de `ENVASADO` (tiene pata de gallo). Por la
> **regla 7 del slide 7** tendría que haber una tabla extra tipo `PRESENTACION_ENVASADO
> (IdProducto, Presentacion)`. En el modelo físico del slide, `ENVASADO` queda con **una sola columna**
> y `Presentacion` **desaparece**. **Verificar en clase**: o falta la tabla, o el atributo no debía ser
> multivaluado.

### Slide 21 · El caso general — y la respuesta a la duda de la clase anterior

El slide es **una sola imagen pegada de otra fuente**, titulada **"Jerarquías: subtipos-supertipos"**:
`A` (supertipo, atributos `a1`, `a2`) → `B` (`b1`) y `C` (`c1`), y `C` → `D` (`d1`) y `E` (`e1`). Los
dos niveles están rotulados con llaves a los costados:

| Nivel | Rótulo textual del slide |
| --- | --- |
| `A` → `B`, `C` | **Exclusivas (o disjuntas)** — discriminador `< tipo_a >` |
| `C` → `D`, `E` | **Compartidas (o superpuestas)** — sin discriminador |

**Esquema resultante,** transcripto tal cual (en la imagen, `a1` va **subrayado** en las cinco tablas
—es la clave— y en `TablaB`…`TablaE` lleva **además un subrayado punteado** debajo):

```
TablaA ( a1, a2, …., tipo_a )
TablaB ( a1, b1 )
TablaC ( a1, c1 )
TablaD ( a1, d1 )
TablaE ( a1, e1 )
```

> [!note] El subrayado punteado
> **Razonamiento propio, no está en el deck:** el punteado extra de `a1` en `TablaB`…`TablaE` marca que
> ahí `a1` es además **clave extranjera** hacia `TablaA`. La imagen no trae referencias de notación.

Con dos anotaciones en la propia imagen, en itálica y con flecha:

> [!quote] Las dos flechas del slide 21
> Apuntando a `tipo_a` en `TablaA`: *"al ser una jerarquía exclusiva se debe incluir el atributo
> 'tipo'"*
> Apuntando a `TablaD`/`TablaE`: *"en este caso no, porque la jerarquía es compartida"*

> [!success] Esto responde una de las dos preguntas abiertas de la clase anterior
> La [[Clase 02 - Modelo Entidad-Relacion]] cerraba el slide 35 con *"¿Cómo representar los
> distintos casos? → **esquema lógico**"*, y la duda quedó anotada como "¿qué distingue una jerarquía
> exclusiva de una compartida?". **La respuesta está acá:**
> - **exclusiva = disjunta** → un ejemplar del supertipo cae en **un solo** subtipo → hace falta el
>   **discriminador** en la tabla del supertipo;
> - **compartida = superpuesta** → un ejemplar puede caer en **varios** subtipos → **no** hace falta.
>
> La hipótesis que había anotado la clase anterior (exclusiva = disjuntos, compartida = solapados)
> queda **confirmada por el propio deck**, con los sinónimos textuales.
>
> Lo que **sigue sin responderse** es la **participación total o parcial**: no aparece en ningún slide
> de esta clase.

> [!note] La clasificación es **por nivel**, no por jerarquía
> En el ejemplo `A/B/C/D/E`, un mismo árbol tiene un nivel exclusivo y otro compartido. Lo mismo en
> `PRODUCTO`. No se pregunta "¿esta jerarquía es exclusiva?" sino "¿este **corte** lo es?".

---

## Slide 22 · Derivación de entidades débiles

> [!quote] El enunciado del slide, textual
> *"**Entidades Débiles:** tienen dependencia de existencia y de identificación."*
> *"Su clave se forma con el **identificador propio (clave parcial)** más el **identificador (clave) de
> la entidad fuerte**,"* ← la coma final está así en el slide, la frase queda cortada.

**MER de partida** — el mismo `CAMPO`/`PARCELA` del slide 34 de la clase anterior, con `PARCELA` en
doble rectángulo y la línea de la relación duplicada:

```
CAMPO ══(1,1)══◇ TIENE ◇══(0,N)══ ║ PARCELA ║
 ●IdCampo                            ●NroParcela
 ○NombreCampo                        ○Superficie
                                     ○UltimoCultivo
```

**Modelo físico resultante:**

| `CAMPO` | | `PARCELA` | |
| --- | --- | --- | --- |
| `IdCampo` *(PK)* | | **`NroParcela`** *(PK)* | ← clave **parcial** propia |
| `NombreCampo` | | **`IdCampo (FK)`** *(PK)* | ← clave de la fuerte, **en rojo** |
| | | `Superficie` | |
| | | `UltimoCultivo` | |

Las dos flechas rojas del slide unen `IdCampo` del MER con `IdCampo (FK)` de `PARCELA`, y `NroParcela`
del MER con `NroParcela` de la tabla. `PARCELA` se dibuja con **esquinas redondeadas** y la relación
con **línea llena**: es **identificatoria**.

> [!success] Esto responde la otra pregunta abierta de la clase anterior
> El slide 34 de la [[Clase 02 - Modelo Entidad-Relacion]] cerraba con *"¿cómo se representa la dependencia de
> identificación? → **esquema lógico**"*. **La respuesta es esta:** la dependencia de identificación
> se representa haciendo que la **clave de la fuerte forme parte de la clave primaria de la débil** —
> no como un atributo más, sino **dentro de la PK**.
>
> **Razonamiento propio, no está en el deck:** la dependencia de **existencia** viene de yapa —como la
> FK está en la PK no puede ser `NULL`, así que ninguna parcela existe sin campo— y eso explica el
> *"siempre (1,1) del lado fuerte"* que la clase anterior dejaba con un "¿Por qué?" sin responder: si fuera
> `(0,1)` la PK admitiría `NULL`, y si fuera `(*,N)` la clave no sería única.

> [!tip] Entidad débil vs. atributo multivaluado — mismo esquema, distinta lectura
> **Razonamiento propio, no está en el deck:**
> `PARCELA(NroParcela, IdCampo, …)` y `TELEF_ALUM(LU, Telefono)` tienen la **misma forma**: PK
> compuesta = clave del padre + algo propio, relación identificatoria. La diferencia es semántica: la
> parcela **es una entidad** (tiene atributos propios, `Superficie`, `UltimoCultivo`), el teléfono es
> **solo un valor**. En el examen, si la "tabla del multivaluado" empieza a ganar columnas, era una
> entidad débil.

---

## Slides 23–24 · Sintaxis de `CREATE TABLE`

Los dos últimos slides son la gramática, en notación de *synopsis* (corchetes = opcional, llaves +
`|` = alternativas).

```
CREATE [ TABLE [ IF NOT EXISTS ] nombre_tabla (
[
  { nombre_columna tipo_dato [ column_constraint [ ... ], ]
    | table_constraint }
    [, ... ]
] );
```

**`column_constraint`** — se escribe **pegada a una columna**:

```
[ CONSTRAINT constraint_name ]
{ NOT NULL |
  NULL |
  DEFAULT default_expr |
  UNIQUE index_parameters |
  PRIMARY KEY index_parameters |
  REFERENCES reftable [ ( refcolumn ) ] }
```

**`table_constraint`** — se escribe **como un ítem más de la lista**, después de las columnas:

```
[ CONSTRAINT constraint_name ]
{ CHECK ( expression ) |
  UNIQUE ( column_name [, ... ] ) |
  PRIMARY KEY ( column_name [, ... ] )  |
  FOREIGN KEY ( column_name [, ... ] )
  REFERENCES reftable [ ( refcolumn [, ... ] ) ]
}
```

| | `column_constraint` | `table_constraint` |
| --- | --- | --- |
| Afecta a | **una** columna | **una o varias** columnas |
| `NOT NULL` / `NULL` / `DEFAULT` | ✅ | ❌ |
| `UNIQUE` | ✅ (sin lista) | ✅ **con lista** de columnas |
| `PRIMARY KEY` | ✅ (sin lista) | ✅ **con lista** de columnas |
| `CHECK` | ❌ **no está en la lista del slide** | ✅ |
| Referencia a otra tabla | `REFERENCES reftable` | `FOREIGN KEY (…) REFERENCES reftable` |

> [!important] Por qué las claves compuestas van sí o sí como `table_constraint`
> **Razonamiento propio, no está en el deck** — pero es la razón de forma detrás de todos sus ejemplos:
> `CONSTRAINT PK_ALUMNOSXCARRERA PRIMARY KEY (LU, IdCarrera)` **solo** se puede escribir como
> `table_constraint`, porque la versión de columna no acepta lista. Toda PK compuesta —N:N, entidad
> débil, tabla de multivaluado— cae acá.

> [!bug] El corchete del slide 23 no cierra
> `CREATE [ TABLE [ IF NOT EXISTS ] nombre_tabla (` abre dos `[` y cierra uno solo: el corchete que
> abre justo después de `CREATE` nunca se cierra en todo el fragmento.
> **Razonamiento propio, no está en el deck:** en el *synopsis* real de PostgreSQL ese primer corchete
> envuelve las variantes `TEMPORARY`/`TEMP`/`UNLOGGED`, que el deck borró dejando el `[` huérfano. Se
> lee como si dijera `CREATE TABLE [ IF NOT EXISTS ] nombre_tabla ( … )`.

---

## PostgreSQL vs. MySQL en este deck

Punto abierto #2 del vault ([[CLAUDE]] § Puntos abiertos): la cursada corre sobre **MySQL** y varios
decks están escritos contra **PostgreSQL**. Este es uno de ellos.

> [!warning] Toda esta sección es **razonamiento propio, no está en el deck**
> El deck no menciona MySQL en ningún slide. La columna "¿Corre en MySQL?" hay que **verificarla contra
> el manual de MySQL y contra la versión que use la cursada**, no darla por buena.

Inventario:

| Elemento del deck | Motor | ¿Corre en MySQL? |
| --- | --- | --- |
| `CREATE TABLE` de los slides 9, 15, 16 | estándar | ✅ **sí, sin cambios** (salvo los dos tipeos) |
| Tipos `integer`, `varchar(n)`, `char(n)`, `date` | estándar | ✅ **sí**, los cuatro existen en MySQL |
| `CONSTRAINT nombre PRIMARY KEY (…)` | estándar | ✅ sí |
| `ALTER TABLE … ADD CONSTRAINT … FOREIGN KEY … REFERENCES …` | estándar | ✅ sí |
| `CREATE TABLE IF NOT EXISTS` | ambos | ✅ sí, también existe en MySQL |
| **Link de tipos de datos** (slide 10) | **PostgreSQL 9.5** | ❌ hay que usar el manual de MySQL |
| **`index_parameters`** en `UNIQUE`/`PRIMARY KEY` (slide 23) | **PostgreSQL** | ❌ no existe en MySQL |
| **`DEFAULT default_expr`** con expresión arbitraria | **PostgreSQL** | ⚠️ MySQL lo restringe |
| **`REFERENCES`** como *column_constraint* (slide 23) | **PostgreSQL** | ⚠️ ver abajo |
| `CHECK (expression)` como *table_constraint* (slide 24) | estándar | ⚠️ depende de la versión de MySQL |

> [!warning] Las dos trampas concretas para el TP 2
> **Razonamiento propio, no está en el deck** — y por eso van también a Dudas abiertas:
> 1. En **MySQL/InnoDB**, la forma *inline* `columna tipo REFERENCES otra_tabla(col)` se **acepta
>    sintácticamente pero no crea la foreign key**. Hay que declararla como `table_constraint`
>    (`FOREIGN KEY (col) REFERENCES …`) o con `ALTER TABLE`. **El deck usa siempre `ALTER TABLE`, así
>    que sus ejemplos están del lado seguro** — el riesgo es copiar la gramática del slide 23.
> 2. **`CHECK`** en MySQL fue ignorado silenciosamente durante muchos años y recién se empezó a
>    aplicar en versiones recientes. **Verificar contra la versión del contenedor de la cursada**
>    antes de apoyarse en él.
>
> Ninguna de las dos cosas la dice el deck. **Confirmar en clase / contra el manual de MySQL.**

---

## Notación de los diagramas del deck

Todas las capturas del modelo físico salen del mismo modelador (símbolos de tipo **ERwin / IE**), y
aparecen en los slides 8, 9, 11, 12, 14, 15, 16, 17, 20 y 22 (las de los slides 15 y 16 repiten la
del 14). El deck **nunca explica la notación**; esta tabla es **razonamiento propio**, de leer todas
las capturas juntas.

| Elemento | Significado |
| --- | --- |
| Caja de **esquinas rectas** | entidad **independiente** (su PK no incluye ninguna FK) |
| Caja de **esquinas redondeadas** | entidad **dependiente** (su PK incluye una FK) |
| **Compartimento superior** de la caja | columnas que forman la **clave primaria** |
| Compartimento inferior | el resto de las columnas |
| Icono de **llave amarilla** | columna de la PK que **no** es FK (`LU` en `ALUMNO`, `Telefono` en `TELEF_ALUM`) |
| Icono de **dos cuadraditos rojo/azul** | columna que es **FK** |
| Fila `… (FK) …` en **rojo**, en el compartimento **superior** | FK que **es parte de la PK** → relación identificatoria |
| Fila `… (FK) …` en **azul**, en el compartimento **inferior** | FK que es **un atributo más** → relación no identificatoria |
| Icono de **rombo celeste** | columna que no es ni clave ni FK |
| **Línea llena** entre tablas | relación **identificatoria** |
| **Línea punteada** entre tablas | relación **no identificatoria** |
| **Pata de gallo** `<` | lado "muchos" |
| **`o`** sobre la línea | cero (opcional) |
| **Barra vertical** `\|` sobre la línea | exactamente uno |
| `(AK1:1)` | *alternate key* nº 1, posición 1 → identificador **alternativo** |
| **Semicírculo con trazos cruzados** en una jerarquía (slide 20, rotulado `Tipo`) | corte supertipo→subtipos **exclusivo** |
| **Semicírculo liso** (slide 20, sin rótulo) | corte supertipo→subtipos **compartido** |

Comparar con la notación del **MER** en [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]]: son dos notaciones distintas y el
deck las muestra **juntas en el mismo slide**, sin avisarlo. La disposición **cambia de slide en
slide**: en el 8 el MER va a la derecha y el físico a la izquierda; en el 12 al revés; en los slides 11,
14, 17, 20 y 22 el MER va arriba (o arriba-izquierda) y el modelo físico debajo.

## Receta para el TP 2 y para el parcial

**Razonamiento propio, no está en el deck** — orden de aplicación que se desprende de las reglas:

1. **Una tabla por entidad fuerte.** Nombre = nombre de la entidad. IP → `PRIMARY KEY`.
2. **Bajar los atributos**: simples → columnas; compuestos → desplegar en componentes; obligatorios →
   `NOT NULL`; opcionales → sin nada.
3. **Sacar los multivaluados** a su propia tabla `(clave_entidad, atributo)`, PK compuesta por las dos.
4. **Entidades débiles**: PK = clave parcial + clave de la fuerte, y esa segunda parte también FK.
5. **Relaciones 1:N** (binarias o unarias): FK del lado 1 en la tabla del lado N. Si es unaria,
   **renombrar**. `NOT NULL` si el mínimo del otro lado es 1.
6. **Relaciones N:N** (binarias o unarias): tabla nueva, PK = las dos claves, dos FK sueltas. Si es
   unaria, **renombrar** una.
7. **Atributos del rombo**: si la relación es 1:N van a la tabla del lado N; si es N:N o ternaria, a la
   tabla de la relación.
8. **Jerarquías**: tabla por supertipo + tabla por subtipo, todas con la clave del supertipo. Si el
   corte es **exclusivo**, agregar el discriminador **en el supertipo**.
9. Escribir el SQL: `CREATE TABLE` con `CONSTRAINT PK_<TABLA> PRIMARY KEY (…)` adentro, y las FK
   después con `ALTER TABLE … ADD CONSTRAINT FK_<TABLA>_<REFERENCIADA> FOREIGN KEY (…) REFERENCES …`.

## Dudas abiertas

- [ ] **¿Cómo se deriva una relación 1:1?** El deck no la trata en ningún slide, y es el caso más
      preguntado (¿FK de qué lado? ¿se fusionan las tablas?).
- [ ] **¿Cómo se deriva una relación ternaria / n-aria?** El slide 18 la nombra (*"asociativa (binaria
      N:N o ternaria)"*) y nunca la deriva.
- [ ] **¿Cuál es la regla para los identificadores alternativos?** El slide 8 los dibuja `(AK1:1)`
      pero el `CREATE TABLE` del slide 9 no los implementa y ninguna regla los menciona. ¿`UNIQUE`?
- [ ] **¿Y los atributos derivados?** La [[Clase 02 - Modelo Entidad-Relacion]] los define como quinto eje; esta
      clase no dice qué hacer con ellos (¿columna calculada? ¿no se guardan? ¿vista?).
- [ ] **¿Qué es la participación *total* o *parcial* de una jerarquía?** Sigue sin definirse: la
      Clase 02 la nombró y la Clase 03 la ignoró. *(Lo de exclusiva/compartida sí quedó respondido,
      slide 21.)*
- [ ] **Confirmar la definición de relación identificatoria / no identificatoria** (slide 8 las nombra
      y nunca las define). La lectura de arriba sale de los diagramas.
- [ ] **`ENVASADO` sin `Presentacion`** (slide 20): ¿falta la tabla del multivaluado o el atributo no
      era multivaluado?
- [ ] **`ALUMNO` sin `FechaNac`** (slide 11): ¿descuido del slide?
- [ ] **`LUTutor (FK) NOT NULL`** con cardinalidad `(0,1)` (slide 12): ¿es un error?
- [ ] **¿La cursada exige `ALTER TABLE` para las FK o acepta declararlas inline?** En MySQL/InnoDB la
      forma inline `columna tipo REFERENCES …` no crea la FK. Verificar con el TP 2.
- [ ] **¿Qué versión de MySQL corre en el contenedor de la cursada?** Define si `CHECK` se aplica o se
      ignora.
- [ ] ¿Hay convención de la cátedra para el **nombre de la tabla de una N:N** más allá del `AXB` que
      usan los ejemplos (`ALUMNOSXCARRERA`, `TUTORXALUMNO`)?

## Enlaces

- Clase anterior: [[Clase 02 - Modelo Entidad-Relacion]] — esta clase responde sus dos preguntas derivadas al esquema
  lógico (jerarquías exclusiva/compartida y dependencia de identificación)
- Clase siguiente: [[Clase 04 - AlteraciónActualizaciónTablas]] — alteración y actualización de tablas
- Práctica correspondiente: [[Práctica 2026-08-04]] *(`ITBA TP 2 Creates.pdf`)*
- Conceptos: [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] · [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]] ·
  [[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] · [[Clave extranjera e integridad referencial]]
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
