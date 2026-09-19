---
tipo: teorica
clase: 1
deck: "BD2_Clase 01 - Introducción_BasesDeDatos.pdf"
unidad: 1
tema: Introducción a las Bases de Datos
resumen: "Apertura de la materia: qué es un SGBD frente al sistema de archivos (los siete inconvenientes), los tres niveles de abstracción, LDD/LMD, el DBA, los tres subsistemas y las arquitecturas de dos y tres capas. El deck no desarrolla nada y cierra con PostgreSQL aunque la cursada corre sobre MySQL."
fecha: 2026-08-03
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 01
  - Clase 01 — Introducción a las Bases de Datos
  - Introducción a las Bases de Datos (clase)
  - SGBD
  - Niveles de abstracción
  - Herramientas de la cursada
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 01 - Introducción_BasesDeDatos.pdf"
estado: revisado
---

# Clase 01 — Introducción a las Bases de Datos

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 01 - Introducción_BasesDeDatos.pdf` · **14 slides**
> Dictado en la **teórica del lunes 03/08** (virtual, 19:00–22:00). El `01` del nombre del archivo
> **es el número de clase**: la numeración de la cátedra (`BD2_Clase NN` → Clase NN) es la única
> numeración real, y varias clases pueden dictarse la misma fecha — el 03/08 se dieron las Clases
> 01 a 05.
> Es la **primera clase de la materia**; la siguiente es [[Clase 02 - Modelo Entidad-Relacion]] (modelo E-R).
> Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]].

> [!important] La única bibliografía que declara el deck
> El slide 14 cierra con una sola línea, textual:
> *"Lectura Obligatoria: Capítulo 1 – Introducción Silberschatz"*.
> Eso es **todo** lo que el deck dice de bibliografía: no da edición, ni páginas, ni secciones, ni
> declara de dónde salieron sus definiciones.
> **Razonamiento propio, no está en el deck:** el cuerpo (slides 3–11) define cada concepto en una o
> dos líneas y no desarrolla ninguno, así que la clase se estudia contra el capítulo y el deck sirve
> como checklist de qué entra. **No verifiqué qué contiene ese capítulo**: el mapeo sección por
> sección lo hace [[_index-bibliografia]] contra la ficha real de la fuente, no esta página.

## Resumen

Clase de apertura de la materia. Define **qué es un SGBD** y por qué existe, contrastándolo contra el
**sistema de procesamiento de archivos** (los **siete inconvenientes**). Después recorre el vocabulario
mínimo que se va a usar toda la cursada: los **tres niveles de abstracción**, los **modelos de datos**,
los **lenguajes LDD/LMD**, los **usuarios y el DBA**, los **tres subsistemas** de un SGBD y las
**arquitecturas de dos y tres capas**. Cierra con dos slides sobre **PostgreSQL** — que es el punto
conflictivo del deck, porque la cursada corre sobre **MySQL**.

| Slides | Tema | Qué hay que saber contestar |
| --- | --- | --- |
| 1 | Portada — *"Bases de Datos II"* / *"INTRODUCCIÓN A LAS BASES DE DATOS"* | — |
| **2** | **Herramientas** | Las tres URLs de descarga: MySQL Workbench, XAMPP, MongoDB |
| **3** | **Introducción** | Definición de SGBD y sus dos mitades; objetivo principal |
| **4** | **Aplicaciones de los SGBD** | Los siete dominios de la lista |
| **5** | **BD vs. sistemas de archivos** | Los **siete inconvenientes**, de memoria |
| **6** | **Visión de los datos** | Los **tres niveles**: físico, lógico, de vistas |
| **7** | **Modelos de datos** | Definición + los cinco modelos que nombra |
| **8** | **Lenguajes de BD** | Esquema · LDD · LMD · declarativo vs. procedimental · ODBC/JDBC |
| **9** | **Usuarios y administradores** | Dos clases de usuario + las **cuatro funciones** del DBA |
| **10** | **Módulos de un SGBD** | Los **tres subsistemas** y de qué responde cada uno |
| **11** | **Arquitecturas de aplicaciones** | Front end / back end · dos capas vs. tres capas |
| **12** | **Qué es PostgreSQL?** | Open source, Berkeley, 1997, C, cross-platform |
| **13** | **Arquitectura de PostgreSQL** | Diagrama: Postmaster, procesos Postgres, buffer cache, WAL, disco |
| **14** | **Bibliografía** | *Lectura obligatoria: Silberschatz cap. 1* |

> [!warning] Dos conflictos internos del deck, arriba de todo
> 1. El slide 2 lista herramientas de **MySQL** (Workbench, XAMPP) y **MongoDB**; los slides 12–13
>    explican **PostgreSQL**. El mismo deck presenta un motor que no es el que se instala.
> 2. La cursada, según el [[_cronograma]], corre sobre **MySQL**. Detalle en § *Problema de motor*.

---

## Slide 2 · Herramientas

Es el **segundo** slide del deck, antes de la introducción: la cátedra pone las descargas primero.
Las tres URLs, textuales:

| Herramienta | URL |
| --- | --- |
| **MySQL Workbench Community Edition** | `https://dev.mysql.com/downloads/workbench/` |
| **XAMPP** | `https://www.apachefriends.org/es/index.html` |
| **MongoDB** | `https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/` |

> [!note] Qué dice esta lista sobre la cursada
> **Razonamiento propio, no está en el deck:** las tres herramientas mapean contra la estructura del
> [[_cronograma]]: **MySQL
> Workbench + XAMPP** para la primera mitad (SQL avanzado sobre [[MySQL]]) y **MongoDB** para la
> segunda (NoSQL). No hay ninguna herramienta de PostgreSQL en la lista.
>
> La URL de MongoDB es específicamente la del **tutorial de instalación en Windows**
> (`install-mongodb-on-windows`); no es la portada de la documentación. En macOS/Linux hay que
> buscar el tutorial equivalente.

> [!tip] La práctica propone otra vía
> La práctica del martes 04/08 instala MySQL vía **Docker**, no vía XAMPP → [[Práctica 2026-08-04]].
> Las dos opciones conviven: XAMPP trae el stack Apache/MySQL/PHP empaquetado, Docker levanta el
> motor aislado en un contenedor.

## Slide 3 · Introducción — qué es un SGBD

Definición, textual:

> [!quote] Definición de SGBD (slide 3)
> *"Un **sistema gestor de bases de datos** (SGBD) consiste en una **colección de datos
> interrelacionados** y un **conjunto de programas** para acceder a dichos datos."*

El slide resalta en color las dos mitades de la definición — **colección de datos** y **conjunto de
programas** —, que es el punto: un SGBD **no** es solamente los datos, ni solamente el software.

| Mitad | Qué es | Aclaración del slide |
| --- | --- | --- |
| **Colección de datos** | *"denominada normalmente **base de datos**"* | *"contiene información relevante para la organización"* |
| **Conjunto de programas** | el software de acceso | — |

**Objetivo principal** (subrayado en el slide):

> *"proporcionar una forma de <u>almacenar y recuperar información</u> de manera *práctica* y
> *eficiente*."*

Textual: *"Los SGBD se diseñan para gestionar grandes volúmenes de información, esto implica la
posibilidad de:"*

- **Definir** estructuras para almacenar información. ← el futuro **LDD** del slide 8
- Contar con mecanismos para **manipular** dicha información. ← el futuro **LMD** del slide 8

Cierra: *"La información es muy importante en las organizaciones entonces los SGBD poseen un amplio
conjunto de conceptos y técnicas para su gestión."*

> [!note] Definir / manipular es el eje que estructura el deck
> **Razonamiento propio, no está en el deck:** el par *definir* / *manipular* del slide 3 reaparece
> literalmente como **LDD / LMD** en el slide 8, y otra vez en el slide 10 como lo que compila el
> *procesador de consultas* (*"instrucciones LDD y LMD"*). Es la misma distinción tres veces, con
> tres nombres. Si en el parcial preguntan "qué implica gestionar grandes volúmenes", la respuesta
> es esa dupla.

## Slide 4 · Aplicaciones de los SGBD

Lista cerrada de siete dominios, sin comentario:

1. Bancos
2. Líneas aéreas
3. Universidades
4. Tarjetas de Crédito
5. Telecomunicaciones
6. Sistemas de ventas o de compras
7. Cadenas de producción o gestión de almacenes

> [!note] Para qué sirve esta lista
> **Razonamiento propio, no está en el deck:** los siete son casos **OLTP transaccionales de alta
> concurrencia** — justamente donde duelen los siete inconvenientes del slide siguiente. El slide 4
> y el slide 5 son la misma idea leída al derecho y al revés: *acá se usan SGBD* / *por esto no
> alcanzan los archivos*.

## Slide 5 · Aplicaciones de BD vs. sistemas de archivos

El contraste fundacional del capítulo. Textual:

> [!quote] El sistema de procesamiento de archivos (slide 5)
> *"En un **sistema de procesamiento de archivos** típico se mantiene mediante un sistema operativo
> convencional, los registros permanentes son almacenados en varios archivos y se escriben diferentes
> programas de aplicación para extraer registros y para añadir registros a los archivos adecuados, lo
> que ocasiona inconvenientes importantes."*

**Los siete inconvenientes**, tal como los enumera el slide:

| # | Inconveniente *(textual del slide)* |
| --- | --- |
| 1 | **Redundancia e inconsistencia de datos.** |
| 2 | **Dificultad en el acceso a los datos** |
| 3 | **Aislamiento de datos.** |
| 4 | **Problemas de integridad.** |
| 5 | **Problemas de atomicidad.** |
| 6 | **Anomalías en el acceso concurrente** |
| 7 | **Problemas de seguridad.** |

> [!missing] El deck los enumera y no los define
> Son siete títulos sueltos: ninguno tiene explicación en el slide, ni en ningún otro slide del deck.
> **Razonamiento propio:** es el hueco más grande de la clase, y lo natural es que las definiciones
> salgan de la **lectura obligatoria** que declara el slide 14 (*Silberschatz, cap. 1*) — pero no
> verifiqué contra la ficha de esa fuente que el capítulo las traiga una por una.

> [!tip] Glosa de los siete
> **Razonamiento propio, no está en el deck. Verificar contra Silberschatz cap. 1 antes de darlo por
> bueno.**
>
> | # | Inconveniente | Qué falla |
> | --- | --- | --- |
> | 1 | Redundancia e inconsistencia | El mismo dato duplicado en varios archivos y formatos; se actualiza una copia y no las otras → las copias se contradicen. |
> | 2 | Dificultad en el acceso | No hay lenguaje de consulta general: cada consulta no prevista obliga a escribir un programa nuevo. |
> | 3 | Aislamiento de datos | Los datos están dispersos en archivos con formatos distintos; cruzarlos requiere código a medida. |
> | 4 | Problemas de integridad | Las restricciones viven enterradas en el código de cada programa; agregar una nueva obliga a tocar todos. |
> | 5 | Problemas de atomicidad | Un fallo a mitad de una operación compuesta deja el estado a medio aplicar. |
> | 6 | Anomalías en el acceso concurrente | Varios procesos escribiendo el mismo archivo a la vez se pisan entre sí. |
> | 7 | Problemas de seguridad | No hay forma de que cada usuario vea solo la porción que le corresponde. |

> [!note] Los siete son el índice de la cursada
> **Razonamiento propio:** cada inconveniente se cobra su propio tramo de la cursada, según el
> [[_cronograma]] — *aislamiento* y *dificultad en el acceso* → vistas, [[Clase 06 - Vistas-Parte 1]] y
> [[Clase 07 - Vistas-Parte 2]]; *eficiencia del acceso* → índices y explain plan,
> [[Clase 08 - Explicando el plan]]; *integridad*, *atomicidad*, *concurrencia* y *seguridad* → las clases de
> integridad, triggers, seguridad y ACID de la segunda parte del cuatrimestre, que todavía no
> tienen deck en el vault. El slide 5 se puede leer como el temario.

## Slide 6 · Visión de los datos — los tres niveles de abstracción

> [!quote] El propósito (slide 6)
> *"Uno de los propósitos principales de un SGBD es proporcionar a los usuarios una visión
> ***abstracta*** de los datos, es decir, esconder los detalles de cómo almacenan y mantienen los
> datos."*

El slide llama a esto **abstracción de datos** y define tres niveles. Las palabras `cómo` y `qué`
están subrayadas en el deck: son la bisagra entre el nivel físico y el lógico.

| Nivel | Posición | Definición textual del slide |
| --- | --- | --- |
| **Nivel físico** | *"el nivel más bajo de abstracción"* | *"describe <u>cómo</u> se almacenan realmente los datos. En el nivel físico se describen en detalle las estructuras de datos complejas de bajo nivel."* |
| **Nivel lógico** | *"el siguiente nivel"* | *"describe <u>qué</u> datos se almacenan en la base de datos y qué relaciones existen entre ellos. Es así que los usuarios del nivel lógico no necesitan preocuparse de cómo están almacenados los datos."* |
| **Nivel de Vistas** | *"el nivel más alto de abstracción"* | *"Algunos usuarios sólo acceden a un subconjunto del total de los datos de una base de datos."* |

```
      ┌──────────────────────────────────────────────┐
      │  NIVEL DE VISTAS   vista 1 · vista 2 · …     │  ← subconjuntos por usuario
      ├──────────────────────────────────────────────┤
      │  NIVEL LÓGICO      QUÉ datos y qué relaciones│  ← el esquema
      ├──────────────────────────────────────────────┤
      │  NIVEL FÍSICO      CÓMO se almacenan         │  ← estructuras de bajo nivel
      └──────────────────────────────────────────────┘
```

> [!missing] Lo que el deck deja afuera
> El slide define los tres niveles y **corta ahí**. **Razonamiento propio, no está en el deck:** tres
> cosas que se enseñan habitualmente junto con esto no aparecen en ningún slide:
> - **Independencia de datos** física y lógica (el beneficio de tener los niveles separados).
> - La distinción **esquema vs. instancia** (el slide 8 define *esquema* recién después, y sin
>   contraponerlo a instancia).
> - La **arquitectura de tres esquemas** ANSI/SPARC.
>
> Si están o no en la lectura obligatoria, hay que verificarlo contra la ficha de la fuente en
> [[_index-bibliografia]]; el deck no lo dice.

> [!tip] El nivel de vistas se implementa en las Clases 06 y 07
> El nivel de vistas de este slide es el concepto; el objeto SQL `CREATE VIEW` que lo materializa se
> ve en las teóricas del 10/08 → [[Clase 06 - Vistas-Parte 1]] y [[Clase 07 - Vistas-Parte 2]], y en **TP4 Vistas**.

## Slide 7 · Modelos de datos

> [!quote] Definición (slide 7)
> *"Por debajo de la estructura de la base de datos está el **modelo de datos**: una colección de
> herramientas conceptuales para describir los datos, las relaciones entre los datos, la semántica de
> los datos y las restricciones de los datos."*

Los cuatro elementos que un modelo de datos describe: **los datos · las relaciones entre los datos ·
la semántica · las restricciones.**

Modelos que nombra el slide:

| Modelo | Qué dice el deck |
| --- | --- |
| **Entidad-relación** | *"es un modelo de datos ampliamente usado, y proporciona una representación gráfica conveniente para ver los datos, las relaciones y las restricciones"* |
| **Relacional** | *"se usa ampliamente para almacenar datos en las bases de datos"* |
| **Orientado a objetos** | mencionado, sin definir |
| **Relacional orientado a objetos** | mencionado, sin definir |
| **Semiestructurados** | mencionado, sin definir |

> [!note] Esto es el índice de las clases que siguen
> El **modelo entidad-relación** de este slide se desarrolla entero en la clase siguiente →
> [[Clase 02 - Modelo Entidad-Relacion]], y su bajada a tablas en [[Clase 03 - Derivación a Esquema Lógico]].
> Comparar la definición de *modelo de datos* de este deck con la de la [[Clase 02 - Modelo Entidad-Relacion]]
> (apuntes Ale/Dejean: *"herramienta intelectual"*, con **poder expresivo** y **abstracción**): dicen
> lo mismo con vocabulario distinto → [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].
>
> Los **modelos semiestructurados** son el gancho hacia la segunda mitad de la cursada
> ([[MongoDB]], documentos JSON) → [[2.12.03 - Persistencia políglota|Persistencia políglota]].

## Slide 8 · Lenguajes de bases de datos

| Término | Definición textual del slide |
| --- | --- |
| **Esquema** | *"El diseño general de la base de datos se denomina el **esquema** de la base de datos."* |
| **LDD** — lenguaje de definición de datos | *"Un esquema de base de datos se especifica con un conjunto de definiciones que se expresan usando un **lenguaje de definición de datos (LDD)**."* |
| **LMD** — lenguaje de manipulación de datos | *"es un lenguaje que permite a los usuarios acceder o manipular los datos."* |

Sobre los LMD, textual:

> *"Los LMD no procedimentales, que requieren que un usuario especifique **sólo los datos que
> necesita**, se usan ampliamente hoy día."*
>
> - LMDs **declarativos**
> - LMDs **procedimentales**

| Tipo de LMD | Qué especifica el usuario |
| --- | --- |
| **Declarativo** *(= no procedimental)* | **qué** datos necesita, no cómo obtenerlos — *"se usan ampliamente hoy día"* |
| **Procedimental** | el procedimiento para obtenerlos |

Último ítem del slide: **"Acceso a las bases de datos desde programas de aplicación. (ODBC, JDBC)"** —
las dos APIs se nombran y no se definen.

> [!warning] El slide mezcla dos nombres para lo mismo
> El texto corrido dice *"Los LMD **no procedimentales**, que requieren que un usuario especifique
> sólo los datos que necesita, se usan ampliamente hoy día"* y la sub-viñeta de abajo dice *"LMDs
> **declarativos**"*. **Razonamiento propio, no está en el deck:** son el mismo concepto con dos
> nombres, y la sub-viñeta no agrega una tercera categoría. El slide no lo aclara → queda en dudas
> abiertas.

> [!note] SQL es las dos cosas
> **Razonamiento propio, no está en el deck:** SQL no es *un* LDD ni *un* LMD, es un lenguaje que
> contiene ambos — `CREATE`/`ALTER`/`DROP` son su LDD, `SELECT`/`INSERT`/`UPDATE`/`DELETE` su LMD.
> El deck los presenta como si fueran lenguajes separados. **Verificar cómo lo plantea la cátedra**,
> porque el TP2 (creates) y el TP3 (SQLs) hacen justamente esa división → [[Práctica 2026-08-04]].

## Slide 9 · Usuarios y administradores de la base de datos

> *"Los usuarios de bases de datos se pueden catalogar en varias clases, y cada clase de usuario usa
> habitualmente diferentes tipos de interfaces de la base de datos."*

**Clases de usuario** que enumera el deck — solo dos:

- Usuarios normales
- Programadores de aplicaciones

**Administradores de bases de datos. Funciones** — las cuatro, textuales:

| # | Función del DBA |
| --- | --- |
| 1 | **Definición de esquemas y organización física** |
| 2 | **Definición de estructuras y métodos de acceso** |
| 3 | **Autorizaciones para acceder a los datos.** |
| 4 | **Mantenimiento de la base de datos** |

> [!warning] "Varias clases" y después lista dos
> El slide anuncia *"varias clases"* de usuario y enumera **dos**: usuarios normales y programadores
> de aplicaciones. **Verificar en clase** si la cátedra toma esas dos o una lista más larga; el deck
> no dice cuál sería esa lista y no la busqué en la bibliografía.

> [!note] Las cuatro funciones también son temario
> **Razonamiento propio:** función 1 → esquema lógico, [[Clase 03 - Derivación a Esquema Lógico]]; función 2 →
> **índices**, [[Clase 08 - Explicando el plan]]; función 3 → **seguridad, roles y permisos** (TP8), clase
> todavía sin deck en el vault; función 4 → mantenimiento, que la cursada no cubre como clase propia.

## Slide 10 · Módulos de un SGBD

> [!bug] El título del slide dice **SGDB**, no SGBD
> Textual: *"MODULOS DE UN SGDB (DBMS)"*. Las letras B y D están permutadas respecto de la sigla
> correcta (**S**istema **G**estor de **B**ases de **D**atos), que el propio slide 3 escribe bien.
> Es un tipeo del deck; se transcribe tal cual pero **no se copia al parcial**.

*"Un sistema de bases de datos tiene varios subsistemas."* Los tres, con su definición textual:

| Subsistema | De qué responde *(textual del slide)* |
| --- | --- |
| **Gestor de transacciones** | *"es el responsable de asegurar que la base de datos permanezca en un estado **consistente (correcto)** a pesar de los fallos del sistema. El gestor de transacciones también asegura que las ejecuciones de **transacciones concurrentes** ocurran sin conflictos."* |
| **Procesador de consultas** | *"compila y ejecuta instrucciones **LDD y LMD**."* |
| **Gestor de almacenamiento** | *"es un módulo que proporciona la **interfaz** entre los datos de bajo nivel almacenados en la base de datos y los programas de aplicación y las consultas enviadas al sistema."* |

> [!note] Cada subsistema tapa inconvenientes del slide 5
> **Razonamiento propio, no está en el deck:** el **gestor de transacciones** responde a
> *atomicidad* (5) y *anomalías de concurrencia* (6); el **procesador de consultas** a *dificultad en
> el acceso* (2); el **gestor de almacenamiento** a *redundancia* (1) y *aislamiento* (3). La
> arquitectura del SGBD es la respuesta punto por punto a por qué no alcanzan los archivos.
>
> El **procesador de consultas** es lo que se abre en canal con el **explain plan** de la
> [[Clase 08 - Explicando el plan]] (TP5); el **gestor de transacciones** es la clase de ACID de la segunda
> parte del cuatrimestre → [[1.11.03 - Transacciones y ACID|Transacciones ACID]].

## Slide 11 · Arquitecturas de aplicaciones

> *"Las aplicaciones de bases de datos se dividen normalmente en un parte frontal (**front end**) que
> se ejecuta en las máquinas cliente y una parte que se ejecuta en servidor (**back end**)."*

> [!bug] *"un parte frontal"* está así en el slide
> Concordancia mal: dice *"un parte frontal"* donde correspondería *"una parte frontal"*. Se
> transcribe tal cual; es un tipeo del deck.

| Arquitectura | Definición textual | Piezas |
| --- | --- | --- |
| **Dos capas** | *"el frontal se comunica directamente con una base de datos que se ejecuta en el servidor"* | cliente ↔ servidor de BD |
| **Tres capas** | *"la parte del servidor se divide asimismo en un **servidor de aplicaciones** y en un **servidor de bases de datos**"* | cliente ↔ servidor de aplicaciones ↔ servidor de BD |

```
DOS CAPAS      [ front end ] ──────────────────────▶ [ servidor de BD ]

TRES CAPAS     [ front end ] ──▶ [ servidor de   ]──▶ [ servidor de BD ]
                                 [ aplicaciones  ]
```

> [!missing] El deck no dice por qué se elige una u otra
> No aparecen ventajas, desventajas ni criterio de decisión: solo la descripción estructural de las
> dos arquitecturas. Queda como hueco a cubrir con la lectura obligatoria del slide 14 —sin dar por
> sentado que ese capítulo lo trate— o preguntando en clase.

---

## Slides 12–13 · PostgreSQL

Los dos últimos slides de contenido cambian de registro: dejan la teoría general y presentan **un
motor concreto**. Ver antes el callout de § *Problema de motor*.

### Slide 12 · Qué es PostgreSQL?

> [!bug] El título del slide no lleva `¿` de apertura
> Textual: *"QUÉ ES POSTGRESQL?"*. Se transcribe así.

Textual, seis ítems (el slide lleva además el logo del elefante de PostgreSQL, abajo a la derecha):

| Ítem del slide | Textual |
| --- | --- |
| Tipo | *"Sistema de Gestión de Base de Datos **Open-Source**"* |
| Origen | *"'**Proyecto Ingres**' en Universidad de **Berkeley**"* |
| Primera versión | *"Primera versión de PostgreSQL liberó en **1997**"* |
| Portabilidad | *"**Cross-Platform**"* |
| Lenguaje | *"Escrito en **C**"* |
| Usuarios | *"Utilizada por organizaciones tales como"* → **Yahoo · MySpace · Skype** |

> [!warning] Dos datos históricos del slide que conviene verificar
> **Razonamiento propio, no está en el deck.** Los transcribo como los dice el slide, pero:
> - *"'Proyecto Ingres' en Universidad de Berkeley"* — el linaje habitual que se cuenta es
>   **Ingres → POSTGRES ("post-Ingres") → Postgres95 → PostgreSQL**, todos en Berkeley. Llamar
>   *Proyecto Ingres* al origen de PostgreSQL salta un eslabón: PostgreSQL desciende de **POSTGRES**,
>   que fue el **sucesor** de Ingres, no de Ingres mismo.
> - *"Primera versión … 1997"* — 1997 es la fecha en que el proyecto pasa a llamarse **PostgreSQL**;
>   hubo versiones previas bajo los nombres POSTGRES y Postgres95.
>
> Las dos afirmaciones dependen de qué se cuente como "primera versión". **Verificar en clase**; no
> hay fuente en el vault que las respalde ni las desmienta.

> [!note] La lista de usuarios está fechada
> **Razonamiento propio:** **MySpace** y **Skype** datan el slide — son referencias de fines de los
> 2000. Es un indicio de que estos slides vienen arrastrados de una versión vieja del deck, lo cual
> encaja con que la cursada ya no use PostgreSQL.

### Slide 13 · Arquitectura de PostgreSQL

Slide de una sola imagen, con el título en vertical sobre el margen izquierdo. Es un diagrama de
bloques partido en dos cajas grandes, **Cliente** (arriba) y **Servidor** (abajo). Reconstrucción de
lo que se lee:

```
┌─ CLIENTE ─────────────────────────────────────────────────────┐
│                    ┌──────────────┐                           │
│                    │  Aplicación  │                           │
│                    └──────┬───────┘                           │
│                           ▲▼                                  │
│                    ┌──────────────┐                           │
│                    │    LIBPG     │                           │
│                    └──┬────────┬──┘                           │
└───────────────────────│────────│──────────────────────────────┘
      Conexión inicial  ▲▼       ▲▼  Autenticación, consultas y resultados
┌─ SERVIDOR ────────────│────────│──────────────────────────────┐
│  ┌ postgresql.conf ┐  │        │                              │
│  ├ pg_hba.conf     ┤  │        │  (sin flecha en el dibujo)   │
│  └ pg_ident.conf   ┘  ▼        ▼                              │
│                 ┌────────────┐    ┌──────────┐                │
│                 │ Postmaster │───▶│ Postgres │┐               │
│                 └────────────┘    └──────────┘│┐  ← 3 cajas   │
│                                    └──────────┘│    apiladas  │
│                                     └──────────┘              │
│                        ▲▼                  ▲▼  FSYNC          │
│         ┌──────────────────────┐  ┌──────────────────────┐    │
│         │ PostgreSQL Share     │  │ Write-ahead log      │    │
│         │ Buffer Cache         │  │ (WAL)                │    │
│         └──────────┬───────────┘  └──────────┬───────────┘    │
│                    ▲▼                  FSYNC ▲▼               │
│         ┌─────────────────────────────────────────────┐       │
│         │        Kernel disk buffer cache             │       │
│         └──────────────────┬──────────────────────────┘       │
│                            ▲▼      FSYNC                      │
│                        ╭─────────╮                            │
│                        │  Disk   │  ← en gris muy claro       │
│                        │  Disco  │                            │
│                        ╰─────────╯                            │
└───────────────────────────────────────────────────────────────┘
```

Elementos, uno por uno:

| Elemento | Dónde | Qué se lee |
| --- | --- | --- |
| **Aplicación** | Cliente | caja en cursiva; flecha **bidireccional** hacia LIBPG |
| **LIBPG** | Cliente | caja destacada (violeta, en cursiva); de ella salen las dos flechas que cruzan al servidor |
| *Conexión inicial* | flecha cliente→servidor | llega al **Postmaster** |
| *Autenticación, consultas y resultados* | flecha cliente↔servidor | va contra los procesos **Postgres** |
| `postgresql.conf`, `pg_hba.conf`, `pg_ident.conf` | Servidor, izquierda | tres cajas **punteadas** pegadas al borde izquierdo del Postmaster. **En el dibujo no hay flecha** que las conecte con nada: están apoyadas ahí y listo |
| **Postmaster** | Servidor | recibe la flecha rotulada *Conexión inicial* y tiene una flecha propia **hacia el primer proceso Postgres** |
| **Postgres** | Servidor | **tres cajas superpuestas y escalonadas**, las tres rotuladas `Postgres`; la flecha *Autenticación, consultas y resultados* llega a la de arriba |
| **PostgreSQL Share Buffer Cache** | Servidor | caja blanca; flecha **bidireccional** con los procesos Postgres y con el `Kernel disk buffer cache` |
| **Write-ahead log (WAL)** | Servidor | *"Write-ahead log (WAL)"*; la flecha que lo une a los procesos Postgres lleva el rótulo **FSYNC** |
| **Kernel disk buffer cache** | Servidor | caja gris, ancha, por debajo de las dos anteriores; bidireccional con ambas y con el disco |
| **Disco** | Servidor | cilindro blanco, con *"Disk"* en gris muy claro arriba de la palabra *"Disco"* |

**Los tres rótulos `FSYNC`**, uno por uno: (1) sobre la flecha `Postgres` ↔ `Write-ahead log (WAL)`;
(2) sobre la flecha `WAL` ↔ `Kernel disk buffer cache`; (3) sobre la flecha `Kernel disk buffer
cache` ↔ `Disco`. Ninguno cuelga de la rama del *Share Buffer Cache*.

> [!note] Qué se lee en la estructura del diagrama
> **Razonamiento propio, no está en el deck** — el slide es solo la imagen, no hay una sola línea de
> texto que explique nada de esto:
>
> 1. **Un proceso por conexión.** El `Postmaster` recibe la conexión inicial y hay una flecha suya
>    hacia `Postgres`, que aparece triplicado: la lectura natural es un proceso servidor por cliente.
> 2. **Dos capas de caché encadenadas**: la del motor (*Share Buffer Cache*) y la del sistema
>    operativo (*Kernel disk buffer cache*). Los datos no van del motor al disco directamente.
> 3. **El camino rotulado `FSYNC` es el del WAL.** Los tres rótulos están sobre la cadena
>    Postgres → WAL → kernel cache → disco, y ninguno sobre la del buffer cache de datos.
>
> Las tres son inferencias sobre el dibujo: **verificar en clase**.

> [!bug] El diagrama dice **LIBPG**
> La librería cliente en C de PostgreSQL se llama **`libpq`** (con `q`, de *query*), no `libpg`.
> Es casi seguro un tipeo del autor del diagrama. **Se transcribe como está en el slide** y se marca
> acá; verificar en clase si a la cátedra le importa.

> [!bug] El diagrama dice **"PostgreSQL Share Buffer Cache"**
> El parámetro y el componente se llaman **`shared_buffers`** / *shared buffer cache*, en plural
> posesivo. *"Share"* está transcripto tal cual del slide. Mismo caso que el anterior.

> [!warning] Este diagrama es de PostgreSQL, no de MySQL
> **Nada de lo de acá se traslada a MySQL sin traducción.** Lo que sí se traslada es la **forma** del
> problema: todo motor relacional tiene un proceso/hilo despachador, un pool de conexiones, una caché
> de páginas en memoria, un log de escritura anticipada y un `fsync` al disco. En MySQL/InnoDB los
> nombres son otros. **No los escribo acá porque no los tengo verificados contra ninguna fuente del
> vault** — verificar antes de usarlos en el parcial.

## Slide 14 · Bibliografía y referencias

El slide se titula *"Bibliografía y Referencias"* y todo su contenido es una línea, más un signo de
pregunta gigante y la palabra *"Preguntas?"* (sin `¿` de apertura, como en el slide 12):

> [!quote] Slide 14, textual
> *"Lectura Obligatoria: Capítulo 1 – Introducción Silberschatz"*

Es la **única** referencia bibliográfica de todo el deck: no hay lista de referencias, ni ediciones,
ni números de página. El mapeo contra la ficha real de la fuente lo lleva [[_index-bibliografia]].

---

## Problema de motor: el deck presenta PostgreSQL, la cursada usa MySQL

> [!warning] Tercer registro del conflicto PostgreSQL / MySQL en el vault
> Ya estaba documentado que **el programa oficial dice PostgreSQL y el cronograma dicta MySQL**
> ([[_cronograma]] § *Diferencias con el programa oficial*) y que **el deck `BD2_Clase 04` usa
> sintaxis PostgreSQL** (`CLAUDE.md` § *Puntos abiertos*). Esta clase agrega el caso **más de
> fondo**: no es una sintaxis suelta, es el **slide institucional de "qué motor usamos"**, y aparece
> en la **primera clase de la materia**.

Los hechos, sin interpretación:

| Evidencia | Motor que implica | Dónde |
| --- | --- | --- |
| Herramientas a descargar: MySQL Workbench, XAMPP | **MySQL** | slide 2 de este deck |
| Herramienta a descargar: MongoDB | **MongoDB** | slide 2 de este deck |
| *"¿Qué es PostgreSQL?"* + arquitectura | **PostgreSQL** | slides 12–13 de este deck |
| Práctica del 04/08: instalación de MySQL vía Docker | **MySQL** | [[Práctica 2026-08-04]] |
| Cronograma: primera mitad SQL avanzado | **MySQL** | [[_cronograma]] |
| Programa oficial: *PostgreSQL avanzado* | **PostgreSQL** | [[_cronograma]] § diferencias |
| Deck `BD2_Clase 04`, sintaxis de los ejemplos | **PostgreSQL** | [[Clase 04 - AlteraciónActualizaciónTablas]] |

**Contradicción interna del deck:** el slide 2 y los slides 12–13 no pueden ser los dos verdaderos a
la vez. Un deck que instala MySQL Workbench y después explica el `Postmaster` de PostgreSQL está
arrastrando material de una versión anterior de la materia.

**Cómo se resuelve, según las reglas del vault:** *gana el cronograma* → **la cursada es MySQL**. Los
slides 12–13 se estudian como **ejemplo de arquitectura de un SGBD relacional**, no como el motor de
la materia. Lo evaluable de esos dos slides es la **estructura** (despachador · procesos por conexión ·
buffer cache · WAL · fsync), no los nombres propios de PostgreSQL.

> [!question] Confirmar en clase
> Si el parcial puede preguntar por el diagrama de arquitectura de **PostgreSQL** específicamente, o
> si esos dos slides son decorativos. Es la diferencia entre memorizar `pg_hba.conf` o no.

## Qué NO hay en esta clase

Registro explícito de los huecos, para no confundirlos con "no entra":

- [ ] Definición de cada uno de los **siete inconvenientes** (slide 5 solo los enumera).
- [ ] **Independencia de datos** física y lógica.
- [ ] Distinción **esquema vs. instancia**.
- [ ] **Arquitectura de tres esquemas** ANSI/SPARC.
- [ ] Definición de **ODBC** y **JDBC** (solo se nombran).
- [ ] Las **clases de usuario** más allá de dos.
- [ ] Ventajas y desventajas de **dos capas vs. tres capas**.
- [ ] Cualquier mención de **NoSQL**, que es media cursada — entra recién en la segunda mitad del
      cuatrimestre, según el [[_cronograma]].

**Ninguno de esos puntos aparece en el deck.** Si los cubre la lectura obligatoria que declara el
slide 14 hay que verificarlo contra la ficha de la fuente en [[_index-bibliografia]] — acá no se da
por sabido. El último punto (NoSQL) es de la segunda mitad de la cursada y no lo cubre ese capítulo.

## Dudas abiertas

- [ ] ¿Los slides 12–13 (PostgreSQL) son evaluables, o quedaron de una versión anterior del deck?
      → es la duda principal de la clase.
- [ ] ¿Cuál es el equivalente en **MySQL/InnoDB** de cada pieza del diagrama de PostgreSQL
      (postmaster, proceso por conexión, share buffer cache, WAL)? No lo escribo sin verificar.
- [ ] ¿La cátedra toma las **dos** clases de usuario del slide 9, o hay más? El slide dice "varias".
- [ ] ¿"LMD no procedimental" y "LMD declarativo" son lo mismo para la cátedra? *(Deberían serlo.)*
- [ ] ¿SQL se presenta como **un** lenguaje con parte LDD y parte LMD, o como dos lenguajes?
      El slide 8 sugiere lo segundo; el TP2/TP3 dividen igual.
- [ ] ¿*"Proyecto Ingres"* y *"primera versión en 1997"* (slide 12) son precisos, o simplificaciones?
- [ ] ¿`LIBPG` y `Share Buffer Cache` del diagrama son tipeos por `libpq` y *shared buffer cache*?
- [ ] ¿Qué relación tienen los tres `.conf` con el `Postmaster`? En el diagrama están apoyados contra
      su caja **sin ninguna flecha**, así que la relación queda implícita.
- [ ] ¿Qué edición de **Silberschatz** es la de la lectura obligatoria? El slide no lo dice
      → resolver contra la ficha en [[_index-bibliografia]].
- [ ] ¿Se instala con **XAMPP** o con **Docker**? El slide 2 dice XAMPP, la práctica usa Docker.

## Enlaces

- Clase anterior: — (es la primera de la materia) · clase siguiente: [[Clase 02 - Modelo Entidad-Relacion]]
- Práctica de esa semana: [[Práctica 2026-08-04]]
- Motores: [[MySQL]] · [[PostgreSQL]] · [[MongoDB]]
- Conceptos: [[Niveles de abstracción de datos]] · [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] ·
  [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]] · [[1.11.03 - Transacciones y ACID|Transacciones ACID]] · [[2.12.03 - Persistencia políglota|Persistencia políglota]] · [[Docker]]
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
