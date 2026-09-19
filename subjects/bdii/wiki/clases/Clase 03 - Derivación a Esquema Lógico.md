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

## Resumen general

La clase convierte el MER de la [[Clase 02 - Modelo Entidad-Relacion]] en tablas SQL con un conjunto
cerrado de reglas, una por constructo: el paso del diseño conceptual al lógico. Se practica en el TP 2
([[Práctica 2026-08-04]]) y cada regla es directamente aplicable en el parcial. El deck es de
PostgreSQL y la cursada corre sobre MySQL (§ [[#PostgreSQL vs. MySQL en este deck]]), pero el SQL de
sus ejemplos corre igual, salvo dos tipeos del propio deck.

Las reglas: una entidad es una tabla con su identificador como clave; los atributos obligatorios llevan
`NOT NULL`, los compuestos se despliegan en sus partes y los multivaluados van a otra tabla con clave
compuesta. En una 1:N, la clave del lado 1 pasa como FK al lado N, renombrada si la relación es unaria.
Una N:N genera una tabla nueva con clave yuxtapuesta y una FK por separado hacia cada entidad. Una
jerarquía da una tabla por nodo, todas con la clave del supertipo, y discriminador en el supertipo
solo si el corte es exclusivo. Una entidad débil lleva como clave su clave parcial más la de la
fuerte, que además es FK.

Las trampas: no hay regla para relaciones 1:1 ni n-arias, identificadores alternativos ni atributos
derivados, y el deck trae errores que no hay que copiar (`varchar(6 0)`, `PK_ ALUMNOSXCARRERA`,
atributos que desaparecen entre el MER y la tabla, `LUTutor NOT NULL` con cardinalidad `(0,1)`). Al
parcial van la chuleta de reglas, el patrón SQL de la N:N (PK compuesta en el `CREATE TABLE`, cada FK
en su propio `ALTER TABLE`) y la lectura de los diagramas: línea llena y FK dentro de la PK,
identificatoria; punteada y FK como un atributo más, no identificatoria.

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 03 - Derivación a Esquema Lógico.pdf` · **24 slides** · teórica del
> lunes 03/08. Anterior: [[Clase 02 - Modelo Entidad-Relacion]] (cierra dos de sus preguntas
> abiertas); siguiente: [[Clase 04 - AlteraciónActualizaciónTablas]]; práctica: `ITBA TP 2 Creates.pdf`
> → [[Práctica 2026-08-04]]. Índices: [[_index-clases]] · [[_index-bibliografia]].

---

## Chuleta: tabla de reglas de transformación

Cada fila es directamente aplicable en el parcial y en el **TP 2**. El deck da las reglas en cuatro
tandas —**entidades** (slides 7–10), **relaciones** (11–18), **jerarquías** (19–21) y **entidades
débiles** (22)—, precedidas por los preliminares (2–6: tabla, clave, F.K., comprensión vs. extensión)
y cerradas por la gramática de `CREATE TABLE` (23–24), e ilustra cada una con capturas de un modelador
tipo ERwin: el MER y el modelo físico en el mismo slide, con flechas rojas uniendo el antes y el después.

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
> **1:1** y **n-arias** no tienen regla y aparecen en cualquier enunciado de parcial: hay que traerlas
> de otra fuente o de clase (ver § Dudas abiertas).

---

## Slides 1–2 · De dónde a dónde

Portada: **Bases de Datos II** / **ESQUEMAS DE TABLAS**. El slide 2, **DISEÑO LÓGICO**, da el diagrama
de la clase:

```
  Modelo de Entidades y Relaciones
  │
  ▼  Reglas de Transformación
  Esquema Lógico según el Modelo Relacional
  Esquema Post-relacional (tablas en SQL)
```

El destino tiene dos nombres, subrayados los dos en el slide: **esquema lógico según el modelo
relacional** y **esquema post-relacional (tablas en SQL)**. Es la tercera caja de
[[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]]: del diseño conceptual al lógico.

## Slide 3 · Lenguaje SQL

> *"La definición de los datos se realiza a través de sentencia de **DDl**"* ← así, con la `l`
> minúscula, en el slide.

- Sus comandos definen **la semántica del esquema relacional**: *"que tablas o relaciones se
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

> [!bug] Abreviatura fijada, y "clave (o clave alternativa)" en la misma definición
> *"La clave y clave extranjera (en adelante abreviado como **F. K.** foreign key)"*; en el resto del
> deck es `(FK)` en los diagramas y `FOREIGN KEY` en el SQL.
> El slide presenta **clave** y **clave alternativa** como si fueran lo mismo; en la clase anterior
> eran **IP** vs. **identificador alternativo** ([[Clase 02 - Modelo Entidad-Relacion]], slides 14–19),
> y el slide 8 sí las distingue con la marca `(AK1:1)`. **Verificar en clase** si acá "clave" está
> usado como *clave candidata*.

## Slide 5 · Ejemplo `MÉDICO` — comprensión y extensión

Las relaciones **pueden visualizarse en forma tabular**:

| MÉDICO | | | | |
| --- | --- | --- | --- | --- |
| **Matricula** | **NyApell** | **Especialidad** | **DNI** | **ClinicaEjerce** |
| 234555 | Juan Paz | Traumatología | 26456678 | C. Modelo |
| 345234 | Inés Roca | Pediatría | 30564865 | C. Paz |
| 365478 | Pedro Jara | Traumatología | 23546987 | Cons. Privado |
| …. | ………. | ……….. | ………. | …………. |

Rótulos del slide: **nombre de la tabla (relación)**, **nombre de la columna (atributo)**, **esquema de
una tabla o cabecera (comprensión)** = la fila de encabezados, **fila (tupla)**, y **valor o estado de
de la tabla (extensión)** —*"de de"*, así en el slide— = el conjunto de las filas. *"Cada columna tiene
un **dominio de definición** que incluye los valores posibles que puede tomar"*. **Razonamiento
propio:** comprensión / extensión es el par *esquema / instancia* (la cabecera no cambia, el contenido
sí); el slide no relaciona los dos términos con nada más.

## Slide 6 · Tablas en SQL

- **En SQL no existe un orden para las filas de una tabla**: al leerla aparecen en **orden aleatorio**,
  a menos que se especifique uno.
- Las **columnas** contienen **nombre, tipo de dato y restricciones** del campo.
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

> [!important] La regla 7 rompe la correspondencia 1 entidad = 1 tabla
> Un multivaluado agrega **una tabla más**, con clave **compuesta** (clave de la entidad + el propio
> atributo): el mismo mecanismo de la entidad débil (slide 22). El *"o de la (inter)relación"* cubre un
> multivaluado colgado de un rombo, caso que el deck **no ejemplifica**.

> [!warning] Cuarta sigla para el modelo extendido
> **DERExt** acá; `MER`, `MERExt` y `MERE` en la clase anterior ([[Clase 02 - Modelo Entidad-Relacion]],
> slides 7–8). Cuatro nombres, un solo modelo.

## Slide 8 · Derivación de entidades — el ejemplo `ALUMNO`

*"Aplicando las reglas anteriores…"*: a la derecha el **MER**, a la izquierda el **modelo físico**.

**MER de partida** — el `ALUMNO` del slide 19 de la [[Clase 02 - Modelo Entidad-Relacion]], **no
idéntico**: acá `Documento` es identificador alternativo, `e-mails` se llama `Mails` y `Dirección` se
desagrega en `Calle`/`Nro`/`Ciudad` en vez de `Calle`/`Número`. Notación: `LU` bolita **rellena** ●
(identificador principal); `Documento` bolita **mitad** ◐ (identificador **alternativo**); `Apellido`,
`Nombre` bolita vacía ○ con línea continua (obligatorios); `Telefonos` línea **punteada** + **pata de
gallo** `>` (**opcional y multivaluado**); `Tutor` línea punteada (opcional); `Mails` pata de gallo con
línea continua (obligatorio y **multivaluado**); `Dirección` bolita de la que **cuelgan** `Calle`,
`Nro`, `Ciudad` (**compuesto**).

**Modelo físico resultante — tres tablas:**

| Tabla | Columnas | Notas del diagrama |
| --- | --- | --- |
| **`ALUMNO`** | `LU` **NOT NULL** *(PK)* · `Documento` NOT NULL **(AK1:1)** · `Apellido` NOT NULL · `Nombre` NOT NULL · `Tutor` **NULL** · `Calle` NOT NULL · `Nro` NOT NULL · `Ciudad` NOT NULL | rectángulo de **esquinas rectas** |
| **`TELEF_ALUM`** | `LU (FK)` NOT NULL · `Telefono` NOT NULL — **las dos en el compartimento de la clave** | esquinas **redondeadas** |
| **`MAILS_ALUM`** | `LU (FK)` NOT NULL · `e_mails` NOT NULL — **las dos en el compartimento de la clave** | esquinas **redondeadas** |

Lectura: el compuesto `Dirección` **desapareció como tal** (no hay tabla `DIRECCION`; `Calle`, `Nro`,
`Ciudad` quedan sueltos en `ALUMNO`); cada multivaluado se fue a **su propia tabla**, con `LU` como FK
y **clave compuesta** `{LU, atributo}`, con nombres inventados (**el deck no da regla de nombre**); el
opcional `Tutor` es el único con **`NULL`** explícito; `(AK1:1)` = *alternate key 1, posición 1*.

> [!quote] Slide 8, al pie
> *"Relaciones entre tablas: **Identificatorias** / **No Identificatorias**"*

> [!important] Qué son, leído de los diagramas del propio deck
> **Razonamiento propio, no está en el deck:** el deck enuncia los dos nombres y nunca los define, pero
> la notación es consistente en todas las capturas del modelo físico:
>
> | | Línea en el diagrama | La FK del hijo… | Ejemplos del deck |
> | --- | --- | --- | --- |
> | **Identificatoria** | **llena** | **forma parte de su clave primaria** (FK en rojo, arriba de la línea divisoria, caja de esquinas **redondeadas**) | `ALUMNO`→`TELEF_ALUM` (8) · `ALUMNO`→`ALUMNOSXCARRERA` (14) · `CAMPO`→`PARCELA` (22) · supertipo→subtipos (20) |
> | **No identificatoria** | **punteada** | es **un atributo más** (FK en azul, debajo de la línea, caja de esquinas **rectas**) | `CIUDAD`→`ALUMNO` (11) · `ALUMNO`→`ALUMNO` por `LUTutor` (12) |
>
> **Confirmar en clase**: es la distinción que hace falta para el TP 2.

## Slide 9 · Creación de tablas

- *"Cada columna debe tener un determinado **tipo de dato**."*
- *"El tipo de dato **limita el conjunto de valores posibles** que se pueden asignar a una columna."*

```sql
CREATE TABLE ALUMNO(
  LU  integer  NOT NULL,
  Documento  integer  NOT NULL,
  Apellido  varchar(30)  NOT NULL,
  Nombre  varchar(30)  NOT NULL,
  Tutor  varchar(50),
  Calle  varchar(40)  NOT NULL,
  Nro  integer  NOT NULL,
  Ciudad  varchar(6 0) NOT NULL,
  CONSTRAINT PK_ALUMNO PRIMARY KEY (LU)
);
```

> *"O puede colocarse la definición de la clave primaria en sentencia aparte"*

```sql
ALTER TABLE ALUMNO
ADD CONSTRAINT PK_ALUMNO PRIMARY KEY (LU);
```

A la izquierda, el slide repite la caja `ALUMNO` del slide 8 (con `Documento NOT NULL (AK1:1)`).
Convención de nombres de constraint de **los ejemplos** del deck (nunca enunciada como regla):
**`PK_<TABLA>`** y **`FK_<TABLA>_<TABLAREFERENCIADA>`**.

> [!bug] Tres cosas para no copiar tal cual
> - `varchar(6 0)`, con espacio en el medio, está así en el slide: tipeo por `varchar(60)`, **no compila**.
> - El `CREATE TABLE` **no implementa el identificador alternativo**: el diagrama dice
> `Documento NOT NULL (AK1:1)`, pero no hay `UNIQUE (Documento)` ni
> `CONSTRAINT AK1_ALUMNO UNIQUE (Documento)`, y la regla del slide 7 tampoco los menciona.
> **Falta la regla para identificadores alternativos** ← entra en el TP 2.
> - **Razonamiento propio:** la PK está declarada dos veces; si se ejecuta el `CREATE TABLE` **y
> después** el `ALTER TABLE`, el segundo falla porque ya existe una PK. El slide los presenta como
> **alternativas** (*"O puede colocarse…"*), no como secuencia.

## Slide 10 · Tipos de datos

El slide entero es:

> **Tipos de datos Postgresql**
> <https://www.postgresql.org/docs/9.5/static/datatype.html>

> [!warning] Motor equivocado, y versión vieja
> La cursada corre sobre **MySQL** ([[_cronograma]] § Diferencias con el programa oficial) y
> **PostgreSQL 9.5** ya no tiene soporte: el catálogo de tipos para el TP es el de MySQL. Los tipos que
> usa el deck —**`integer`**, **`varchar(n)`**, **`char(n)`**, **`date`**— existen igual en MySQL, así
> que **el SQL de los slides 9, 15 y 16 corre en MySQL sin cambios**, salvo los tipeos `varchar(6 0)` y
> `PK_ ALUMNOSXCARRERA` *(razonamiento propio, no está en el deck)*. Inventario en
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
  ●LU  │  ●IdCiudad
  ○Apellido  ○FechaInsc  ○SedeUnicen
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

Las dos flechas rojas del slide muestran `IdCiudad` viajando del lado 1 al lado N (cartel **CLAVE
EXTRANJERA**) y `FechaInsc` —atributo **del rombo**— viajando también a la tabla del lado N: el caso
"designativa" que el slide 18 enuncia como regla. Línea **punteada**: **no identificatoria**.

> [!note] Por qué la FK queda `NOT NULL`
> **Razonamiento propio, no está en el deck:** la cardinalidad `(1,1)` pegada a `CIUDAD`, en lectura
> **look-across** ([[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]]), dice que cada alumno
> tiene exactamente una ciudad. El slide no lo justifica.

> [!bug] `FechaNac` desaparece; `SedeUnicen` / `SedeUNICEN`
> El MER tiene `FechaNac` en `ALUMNO` y la tabla **no**; ninguna regla justifica perderla. **Verificar
> en clase.** El MER escribe `SedeUnicen` y la tabla `SedeUNICEN`: **UNICEN** es la Universidad
> Nacional del Centro, no el ITBA; el deck viene reciclado de otra cursada.

## Slide 12 · Relaciones unarias 1:N (ó N:1)

**MER de partida** — una relación **reflexiva** sobre `ALUMNO`:

```
  ┌──(0,N)──◇ ES TUTOR DE ◇
  │  │
  └──(0,1)───────────────┘
  ALUMNO (●LU, ○Apellido, ○Nombre)
```

**Modelo físico resultante:** una sola tabla, con la FK apuntándose a sí misma:

| `ALUMNO` | |
| --- | --- |
| `LU` *(PK)* | NOT NULL |
| **`LUTutor (FK)`** | NOT NULL |
| `Apellido` | NOT NULL |
| `Nombre` | NOT NULL |

Todo el texto del slide es un cartel verde sobre `LUTutor`: **DEBE renombrarse**. FK y PK conviven en
la misma tabla, así que la FK **no puede** llamarse `LU`; es la única diferencia con el caso binario.
Relación **punteada** (no identificatoria), con pata de gallo hacia la propia `ALUMNO`.

> [!bug] `LUTutor NOT NULL` contradice la cardinalidad `(0,1)`
> **Razonamiento propio, no está en el deck:** `(0,1)` dice que un alumno **puede no tener tutor** (el
> `Tutor` del slide 8 era opcional), así que la columna tendría que admitir `NULL`. Con `NOT NULL` el
> modelo no se puede poblar: el primer alumno necesitaría un tutor que todavía no existe. **Verificar
> en clase.**

## Slide 13 · Relaciones unarias y binarias N:N — la regla

- Se crea una **nueva tabla**, cuya clave es la **yuxtaposición de los identificadores (claves)** de
  cada una de las entidades participantes.
- **Nombre de tabla:** *"nombre indicado en el rombo, o puede renombrarse"*.
- *"**Cada una de las claves, por separado** es una clave extranjera referida a la tabla(entidad) de
  la cual proviene."* ← sin coma después de *separado* y sin espacio en `tabla(entidad)`, así en el slide.

> [!tip] "Por separado" es la parte que se olvida
> **Razonamiento propio:** la tabla tiene **una PK compuesta** `(A, B)` **y dos FK sueltas**, no una
> sola FK compuesta. El slide 16 lo muestra con dos `ALTER TABLE` distintos.

## Slide 14 · Relaciones binarias N:N — el ejemplo

**MER de partida:**

```
ALUMNO ──(0,N)──◇ CURSA ◇──(0,N)── CARRERA
  ●LU  ●IdCarrera
  ○Apellido  ○NombreCarrera
  ○Nombre  ○PlanEstudio
  ○FechaNac
```

**Modelo físico resultante — tres tablas:**

| `ALUMNO` | | `ALUMNOSXCARRERA` | | `CARRERA` | |
| --- | --- | --- | --- | --- | --- |
| `LU` *(PK)* | NOT NULL | **`LU (FK)`** *(PK)* | NOT NULL | `IdCarrera` *(PK)* | NOT NULL |
| `Apellido` | NOT NULL | **`IdCarrera (FK)`** *(PK)* | NOT NULL | `NombreCarrera` | NOT NULL |
| `Nombre` | NOT NULL | | | `PlanEstudio` | NOT NULL |
| `FechaNac` | **NULL** | | | | |

El rombo `CURSA` pasa a llamarse **`ALUMNOSXCARRERA`**: el deck ejerce el *"o puede renombrarse"* con
la convención **`<A>X<B>`** (`ALUMNOSXCARRERA`, `TUTORXALUMNO`). Las dos relaciones van con **línea
llena** (**identificatorias**: las dos FK forman la PK de la intermedia), y `ALUMNOSXCARRERA` **no
tiene ninguna columna propia**.

## Slide 15 · `CREATE TABLE` de las dos entidades

```sql
CREATE TABLE ALUMNO(
  LU  integer  NOT NULL,
  Apellido  varchar(30)  NOT NULL,
  Nombre  varchar(30)  NOT NULL,
  FechaNac  date,
CONSTRAINT PK_ALUMNO PRIMARY KEY (LU)
);

CREATE TABLE CARRERA(
  IdCarrera  char(5)  NOT NULL,
  NombreCarrera varchar(100)  NOT NULL,
  PlanEstudio  char(6)  NOT NULL,
  CONSTRAINT PK_CARRERA PRIMARY KEY (IdCarrera)
);
```

`FechaNac`, el único opcional, es el único **sin** `NOT NULL` (regla 6 del slide 7). Tipos: `integer`,
`varchar(n)`, **`char(n)`** para códigos de longitud fija (`IdCarrera char(5)`, `PlanEstudio char(6)`)
y **`date`**.

## Slide 16 · `CREATE TABLE` de la tabla intermedia

```sql
CREATE TABLE ALUMNOSXCARRERA(
  LU  integer NOT NULL,
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

Es **el patrón completo de una N:N**, para memorizar tal cual: PK compuesta en el `CREATE`, cada FK
en su propio `ALTER`, y los tipos **copiados exactos** de la tabla referenciada (`LU integer`,
`IdCarrera char(5)`).

> [!bug] `PK_ ALUMNOSXCARRERA` — espacio después del guion bajo
> Así en el slide: el parser lee `PK_` como nombre del constraint y después un identificador suelto →
> **error de sintaxis**. Igual que el `varchar(6 0)` del slide 9.

> [!tip] El orden de ejecución importa
> **Razonamiento propio:** las FK se agregan **después** de que existan las tres tablas; con
> `ALTER TABLE` en vez de inline se evitan las dependencias circulares al crear el esquema. El deck usa
> `ALTER TABLE` pero **no dice por qué**.

## Slide 17 · Relaciones unarias N:N

**MER de partida** — la misma `ES TUTOR DE` del slide 12, ahora `(0,N)` de los **dos** lados:

```
  ┌──(0,N)──◇ ES TUTOR DE ◇
  │  │
  └──(0,N)───────────────┘
  ALUMNO (●LU, ○Apellido, ○Nombre)
```

**Modelo físico resultante:**

| `ALUMNO` | | `TUTORXALUMNO` | |
| --- | --- | --- | --- |
| `LU` *(PK)* | NOT NULL | **`LU (FK)`** *(PK)* | NOT NULL |
| `Apellido` | NOT NULL | **`LUTutor (FK)`** *(PK)* | NOT NULL |
| `Nombre` | NOT NULL | | |

Las **dos** FK apuntan a `ALUMNO` (dos líneas en el diagrama): regla de la N:N (tabla nueva, clave
yuxtapuesta, dos FK) más la del caso unario (una **debe renombrarse** → `LUTutor`).

> [!tip] 1:N vs. N:N en el caso unario
> **Mismo enunciado** con la cardinalidad cambiada, y dos esquemas distintos: con `(0,1)` la FK queda
> **dentro de `ALUMNO`** (slide 12); con `(0,N)` aparece **una tabla aparte** (slide 17). Las
> cardinalidades del MER no son decorativas.

## Slide 18 · Derivación de atributos en relaciones

Los atributos de una relación **pueden ser del mismo tipo que los de una entidad** (los mismos cinco
ejes de la clase anterior) y se derivan *"también de forma análoga a los de las entidades"*:

| Término del slide | Qué relación es | Dónde van sus atributos |
| --- | --- | --- |
| **Designativa** | 1:N | tabla del lado **N** (junto a la FK) |
| **Asociativa** | N:N binaria **o ternaria** | tabla **producto de la relación** |

> [!note] Vocabulario nuevo: *designativa* y *asociativa*
> Primera aparición en la cursada; no está en la [[Clase 02 - Modelo Entidad-Relacion]] y el deck **no
> los define**: los usa como sinónimos de 1:N y de N:N/ternaria. **Razonamiento propio:** una
> **designativa** no genera tabla (solo una FK), una **asociativa** sí.

> [!missing] La ternaria se nombra pero no se deriva
> *"binaria N:N o ternaria"* y ahí termina: **no hay ningún ejemplo ni regla de derivación de
> relaciones n-arias en todo el deck**. Por analogía sería una tabla con las tres claves yuxtapuestas,
> pero **eso no está en el deck**.

---

## Slides 19–21 · Derivación de jerarquías

### Slide 19 · Las reglas

- Se crea **una tabla por la entidad supertipo** (*"con los atributos en común **incluído** su
  identificador"*, con acento en el slide) y **una tabla por cada una de las entidades subtipo** (con
  los **atributos propios**).
- **La clave de la tabla subtipo es la clave de la tabla del supertipo.**
- *"Para las jerarquías **exclusivas**, que deben incluir el **atributo discriminante (tipo)**, éste se
  debe agregar a la tabla correspondiente a la **entidad supertipo**"*.

O sea: **una tabla por nodo del árbol**, todas con la misma clave, y el discriminador **arriba**.

> [!note] Razonamiento propio, no está en el deck
> En la literatura esta estrategia se llama *class-table inheritance* o *vertical partitioning*; hay
> otras dos (todo en una sola tabla, o una tabla por hoja). **El deck no le da nombre a la suya ni
> menciona alternativas.** Nombres sin verificar contra bibliografía: ver [[_index-bibliografia]].

### Slide 20 · El ejemplo `PRODUCTO`

Es la jerarquía del slide 35 de la [[Clase 02 - Modelo Entidad-Relacion]], ahora derivada.

**MER de partida:**

```
PRODUCTO (●IdProducto, ○Descripcion, ○Marca)
  │ <Tipo>
  ├── SOLIDO  (○CantxPaq)
  └── LIQUIDO (○CuidaddoManip)  ← "CuidaddoManip", con dos 'd', en el slide
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

El slide **no tiene texto**: los dos diagramas y una **flecha roja grande** que arranca sobre los
atributos de `PRODUCTO` en el MER (a la altura de `IdProducto`/`Marca`, **no** sobre el `<Tipo>`) y
termina en la columna `Tipo` de la tabla `PRODUCTO`: la tercera regla ilustrada. Conectores del modelo
físico: `PRODUCTO` → `SOLIDO`/`LIQUIDO` es un **semicírculo con trazos cruzados** rotulado **`Tipo`**;
`LIQUIDO` → `ENVASADO`/`A_GRANEL`, un **semicírculo liso**, **sin rótulo**.

> [!important] Los dos niveles no son del mismo tipo
> El primero es la jerarquía **exclusiva** (lleva discriminador: por eso `PRODUCTO` tiene la columna
> `Tipo`) y el segundo la **compartida**. No está rotulado en este slide, pero sí en el mismo diagrama
> de la clase anterior (slide 35) y en el slide 21 para el caso general. **Razonamiento propio:** la
> correspondencia *cruzado = exclusiva* / *liso = compartida* sale de comparar los slides 20 y 21;
> ningún slide define los símbolos. **Confirmar en clase.**

> [!bug] `Presentacion` se pierde
> En el MER es un atributo **multivaluado** de `ENVASADO` (pata de gallo); por la **regla 7 del
> slide 7** tendría que haber una tabla extra tipo `PRESENTACION_ENVASADO (IdProducto, Presentacion)`.
> En el modelo físico `ENVASADO` queda con **una sola columna** y `Presentacion` **desaparece**.
> **Verificar en clase**: o falta la tabla, o el atributo no debía ser multivaluado.

### Slide 21 · El caso general — y la respuesta a la duda de la clase anterior

El slide es **una sola imagen pegada de otra fuente**, titulada **"Jerarquías: subtipos-supertipos"**:
`A` (supertipo, atributos `a1`, `a2`) → `B` (`b1`) y `C` (`c1`), y `C` → `D` (`d1`) y `E` (`e1`). Los
dos niveles están rotulados con llaves:

| Nivel | Rótulo textual del slide |
| --- | --- |
| `A` → `B`, `C` | **Exclusivas (o disjuntas)** — discriminador `< tipo_a >` |
| `C` → `D`, `E` | **Compartidas (o superpuestas)** — sin discriminador |

**Esquema resultante,** transcripto tal cual. En la imagen, `a1` va **subrayado** en las cinco tablas
—es la clave— y en `TablaB`…`TablaE` lleva **además un subrayado punteado** (**razonamiento propio:**
ese punteado marca que ahí `a1` es además **clave extranjera** hacia `TablaA`; la imagen no trae
referencias de notación):

```
TablaA ( a1, a2, …., tipo_a )
TablaB ( a1, b1 )
TablaC ( a1, c1 )
TablaD ( a1, d1 )
TablaE ( a1, e1 )
```

> [!quote] Las dos flechas del slide 21
> Apuntando a `tipo_a` en `TablaA`: *"al ser una jerarquía exclusiva se debe incluir el atributo
> 'tipo'"*
> Apuntando a `TablaD`/`TablaE`: *"en este caso no, porque la jerarquía es compartida"*

> [!success] Responde una de las dos preguntas abiertas de la clase anterior
> La [[Clase 02 - Modelo Entidad-Relacion]] cerraba el slide 35 con *"¿Cómo representar los distintos
> casos? → **esquema lógico**"*. La respuesta, con los sinónimos textuales del deck:
> - **exclusiva = disjunta** → un ejemplar del supertipo cae en **un solo** subtipo → hace falta el
> **discriminador** en la tabla del supertipo;
> - **compartida = superpuesta** → puede caer en **varios** subtipos → **no** hace falta.
>
> La clasificación es **por nivel**, no por jerarquía: en `A/B/C/D/E` —y en `PRODUCTO`— un mismo árbol
> tiene un corte exclusivo y otro compartido. Lo que **sigue sin responderse** es la **participación
> total o parcial**: no aparece en ningún slide de esta clase.

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
 ●IdCampo  ●NroParcela
 ○NombreCampo  ○Superficie
  ○UltimoCultivo
```

**Modelo físico resultante:**

| `CAMPO` | | `PARCELA` | |
| --- | --- | --- | --- |
| `IdCampo` *(PK)* | | **`NroParcela`** *(PK)* | ← clave **parcial** propia |
| `NombreCampo` | | **`IdCampo (FK)`** *(PK)* | ← clave de la fuerte, **en rojo** |
| | | `Superficie` | |
| | | `UltimoCultivo` | |

Las flechas rojas unen `IdCampo` del MER con `IdCampo (FK)` de `PARCELA`, y `NroParcela` con
`NroParcela`. `PARCELA` va con **esquinas redondeadas** y la relación con **línea llena**:
**identificatoria**.

> [!success] Responde la otra pregunta abierta de la clase anterior
> El slide 34 de la [[Clase 02 - Modelo Entidad-Relacion]] cerraba con *"¿cómo se representa la
> dependencia de identificación? → **esquema lógico**"*. Respuesta: la **clave de la fuerte forma
> parte de la clave primaria de la débil**, no como un atributo más sino **dentro de la PK**.
> **Razonamiento propio, no está en el deck:** la dependencia de **existencia** viene de yapa (la FK
> está en la PK, no puede ser `NULL`: ninguna parcela existe sin campo), y eso explica el *"siempre
> (1,1) del lado fuerte"* que la clase anterior dejó sin responder: con `(0,1)` la PK admitiría
> `NULL`, con `(*,N)` la clave no sería única.

> [!tip] Entidad débil vs. atributo multivaluado — mismo esquema, distinta lectura
> **Razonamiento propio:** `PARCELA(NroParcela, IdCampo, …)` y `TELEF_ALUM(LU, Telefono)` tienen la
> **misma forma** (PK compuesta = clave del padre + algo propio, relación identificatoria). La
> diferencia es semántica: la parcela **es una entidad** con atributos propios (`Superficie`,
> `UltimoCultivo`); el teléfono, **solo un valor**. En el examen, si la "tabla del multivaluado"
> empieza a ganar columnas, era una entidad débil.

---

## Slides 23–24 · Sintaxis de `CREATE TABLE`

Gramática en notación de *synopsis* (corchetes = opcional, llaves + `|` = alternativas).

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

**`table_constraint`** — **un ítem más de la lista**, después de las columnas:

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
| `NOT NULL` / `NULL` / `DEFAULT` | ✓ | ✗ |
| `UNIQUE` | ✓ (sin lista) | ✓ **con lista** de columnas |
| `PRIMARY KEY` | ✓ (sin lista) | ✓ **con lista** de columnas |
| `CHECK` | ✗ **no está en la lista del slide** | ✓ |
| Referencia a otra tabla | `REFERENCES reftable` | `FOREIGN KEY (…) REFERENCES reftable` |

> [!important] Las claves compuestas van sí o sí como `table_constraint`
> **Razonamiento propio, no está en el deck**, pero es la razón de forma detrás de todos sus ejemplos:
> `CONSTRAINT PK_ALUMNOSXCARRERA PRIMARY KEY (LU, IdCarrera)` **solo** se puede escribir como
> `table_constraint`, porque la versión de columna no acepta lista. Toda PK compuesta (N:N, entidad
> débil, tabla de multivaluado) cae acá.

> [!bug] El corchete del slide 23 no cierra
> `CREATE [ TABLE [ IF NOT EXISTS ] nombre_tabla (` abre dos `[` y cierra uno solo. **Razonamiento
> propio:** en el *synopsis* real de PostgreSQL ese primer corchete envuelve las variantes
> `TEMPORARY`/`TEMP`/`UNLOGGED`, que el deck borró dejando el `[` huérfano. Se lee como
> `CREATE TABLE [ IF NOT EXISTS ] nombre_tabla ( … )`.

---

## PostgreSQL vs. MySQL en este deck

> [!warning] El deck es de PostgreSQL, la cursada corre sobre MySQL
> Slide 10 linkea el catálogo de tipos de **PostgreSQL 9.5**, y la gramática de `CREATE TABLE` de los
> slides 23–24 es la del *synopsis* de PostgreSQL (`index_parameters`, `DEFAULT default_expr`). El deck
> no menciona MySQL en ningún slide, así que **toda esta sección es razonamiento propio, no está en el
> deck**: la columna "¿Corre en MySQL?" hay que **verificarla contra el manual de MySQL y contra la
> versión que use la cursada**. Es el punto abierto 2 del vault ([[CLAUDE]] § Puntos abiertos).

| Elemento del deck | Motor | ¿Corre en MySQL? |
| --- | --- | --- |
| `CREATE TABLE` de los slides 9, 15, 16 | estándar | ✓ **sí, sin cambios** (salvo los dos tipeos) |
| Tipos `integer`, `varchar(n)`, `char(n)`, `date` | estándar | ✓ **sí**, los cuatro existen en MySQL |
| `CONSTRAINT nombre PRIMARY KEY (…)` | estándar | ✓ sí |
| `ALTER TABLE … ADD CONSTRAINT … FOREIGN KEY … REFERENCES …` | estándar | ✓ sí |
| `CREATE TABLE IF NOT EXISTS` | ambos | ✓ sí, también existe en MySQL |
| **Link de tipos de datos** (slide 10) | **PostgreSQL 9.5** | ✗ hay que usar el manual de MySQL |
| **`index_parameters`** en `UNIQUE`/`PRIMARY KEY` (slide 23) | **PostgreSQL** | ✗ no existe en MySQL |
| **`DEFAULT default_expr`** con expresión arbitraria | **PostgreSQL** | (atención) MySQL lo restringe |
| **`REFERENCES`** como *column_constraint* (slide 23) | **PostgreSQL** | (atención) ver abajo |
| `CHECK (expression)` como *table_constraint* (slide 24) | estándar | (atención) depende de la versión de MySQL |

> [!warning] Las dos trampas concretas para el TP 2
> 1. En **MySQL/InnoDB**, la forma *inline* `columna tipo REFERENCES otra_tabla(col)` se **acepta
> sintácticamente pero no crea la foreign key**: hay que declararla como `table_constraint`
> (`FOREIGN KEY (col) REFERENCES …`) o con `ALTER TABLE`. **El deck usa siempre `ALTER TABLE`, así
> que sus ejemplos están del lado seguro**; el riesgo es copiar la gramática del slide 23.
> 2. **`CHECK`** en MySQL fue ignorado silenciosamente durante muchos años y recién se aplica en
> versiones recientes. **Verificar contra la versión del contenedor de la cursada.**
>
> Ninguna de las dos la dice el deck. **Confirmar en clase / contra el manual de MySQL.**

---

## Notación de los diagramas del deck

Todas las capturas del modelo físico salen del mismo modelador (símbolos de tipo **ERwin / IE**):
slides 8, 9, 11, 12, 14, 15, 16, 17, 20 y 22 (las de los slides 15 y 16 repiten la del 14). El deck
**nunca explica la notación**; la tabla es **razonamiento propio**, de leer todas las capturas juntas.

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

Es una notación distinta de la del **MER** ([[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]])
y el deck las muestra **juntas en el mismo slide** sin avisarlo, cambiando la disposición: MER a la
derecha en el 8, a la izquierda en el 12, y arriba (o arriba-izquierda) en los slides 11, 14, 17, 20 y 22.

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

- [ ] **¿Cómo se deriva una relación 1:1?** El deck no la trata (¿FK de qué lado? ¿se fusionan las tablas?).
- [ ] **¿Cómo se deriva una relación ternaria / n-aria?** El slide 18 la nombra y nunca la deriva.
- [ ] **¿Cuál es la regla para los identificadores alternativos?** ¿`UNIQUE`? El slide 8 los dibuja
  `(AK1:1)` y el `CREATE TABLE` del slide 9 no los implementa.
- [ ] **¿Y los atributos derivados?** La [[Clase 02 - Modelo Entidad-Relacion]] los define como quinto
  eje; esta clase no dice qué hacer con ellos (¿columna calculada? ¿no se guardan? ¿vista?).
- [ ] **¿Qué es la participación *total* o *parcial* de una jerarquía?** Sigue sin definirse.
- [ ] **Confirmar la definición de relación identificatoria / no identificatoria** (slide 8): la lectura
  de arriba sale de los diagramas.
- [ ] **`ENVASADO` sin `Presentacion`** (slide 20): ¿falta la tabla del multivaluado o no era multivaluado?
- [ ] **`ALUMNO` sin `FechaNac`** (slide 11): ¿descuido del slide?
- [ ] **`LUTutor (FK) NOT NULL`** con cardinalidad `(0,1)` (slide 12): ¿es un error?
- [ ] **¿La cursada exige `ALTER TABLE` para las FK o acepta declararlas inline?** En MySQL/InnoDB la
  forma inline no crea la FK. Verificar con el TP 2.
- [ ] **¿Qué versión de MySQL corre en el contenedor de la cursada?** Define si `CHECK` se aplica.
- [ ] ¿Hay convención de la cátedra para el **nombre de la tabla de una N:N** más allá del `AXB` de los
  ejemplos (`ALUMNOSXCARRERA`, `TUTORXALUMNO`)?

## Enlaces

- Clase anterior: [[Clase 02 - Modelo Entidad-Relacion]] — esta clase responde sus dos preguntas derivadas al esquema
  lógico (jerarquías exclusiva/compartida y dependencia de identificación)
- Clase siguiente: [[Clase 04 - AlteraciónActualizaciónTablas]] — alteración y actualización de tablas
- Práctica correspondiente: [[Práctica 2026-08-04]] *(`ITBA TP 2 Creates.pdf`)*
- Conceptos: [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] · [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]] ·
  [[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] · [[Clave extranjera e integridad referencial]]
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
