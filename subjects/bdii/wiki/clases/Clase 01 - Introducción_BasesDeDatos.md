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

## Resumen general

Clase de apertura de la materia (teórica virtual del lunes 03/08, deck de 14 slides). Define
**qué es un SGBD** —una colección de datos interrelacionados más un conjunto de
programas para acceder a ellos— y por qué existe, contrastándolo con el **sistema de procesamiento
de archivos** y sus **siete inconvenientes** (redundancia e inconsistencia, dificultad de acceso,
aislamiento, integridad, atomicidad, concurrencia, seguridad). Después fija el vocabulario que
atraviesa toda la cursada: los **tres niveles de abstracción** (físico = *cómo* se almacena, lógico =
*qué* datos y relaciones, vistas = subconjuntos por usuario), los **modelos de datos**, **esquema**,
**LDD** y **LMD** (con LMD *declarativo* = *no procedimental*), las dos clases de usuario y las
**cuatro funciones del DBA**, los **tres subsistemas** de un SGBD (gestor de transacciones,
procesador de consultas, gestor de almacenamiento) y las **arquitecturas de dos y tres capas**.

Importa por dos razones. Primero, el deck define cada concepto en una o dos líneas y no desarrolla
ninguno (los siete inconvenientes se enumeran sin explicar); la única bibliografía es *Silberschatz,
capítulo 1*, así que la clase se estudia contra ese capítulo y el deck sirve de checklist. Segundo,
plantea el conflicto de motor: el slide 2 manda descargar **MySQL Workbench, XAMPP y MongoDB**, pero
los slides 12–13 presentan **PostgreSQL**; por el cronograma, la cursada corre sobre **MySQL**, y esos
dos slides se estudian como ejemplo de arquitectura de un SGBD relacional (despachador, un proceso
por conexión, buffer cache, WAL, fsync), no como el motor de la materia.

Para el parcial: los siete inconvenientes y las cuatro funciones del DBA de memoria; los tres niveles
con su par *cómo/qué*; qué hace cada subsistema; la diferencia dos capas / tres capas; y no copiar
los tipeos del deck (*SGDB*, *LIBPG*, *Share Buffer Cache*).

## Fuente y mapa del deck

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 01 - Introducción_BasesDeDatos.pdf` · **14 slides** · teórica del
> lunes 03/08 (virtual, 19:00–22:00); ese mismo día se dictaron las Clases 01 a 05.
> Primera clase de la materia; la siguiente es [[Clase 02 - Modelo Entidad-Relacion]] (modelo E-R).
> Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]].

Slide 1, portada (*"Bases de Datos II"* / *"INTRODUCCIÓN A LAS BASES DE DATOS"*); slides 2–13, una
sección cada uno más abajo; slide 14, *Lectura obligatoria: Silberschatz cap. 1*.

---

## Slide 2 · Herramientas

Segundo slide del deck, antes de la introducción. Las tres URLs, textuales:

| Herramienta | URL |
| --- | --- |
| **MySQL Workbench Community Edition** | `https://dev.mysql.com/downloads/workbench/` |
| **XAMPP** | `https://www.apachefriends.org/es/index.html` |
| **MongoDB** | `https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/` |

> [!note] Qué dice esta lista sobre la cursada (razonamiento propio, no está en el deck)
> Las tres herramientas se corresponden con el [[_cronograma]]: **MySQL Workbench + XAMPP** para la primera
> mitad (SQL avanzado sobre [[MySQL]]) y **MongoDB** para la segunda (NoSQL). No hay ninguna
> herramienta de PostgreSQL. La URL de MongoDB es la del **tutorial de instalación en Windows**
> (`install-mongodb-on-windows`); en macOS/Linux hay que buscar el equivalente.

> [!tip] La práctica propone otra vía
> La práctica del martes 04/08 instala MySQL vía **Docker**, no vía XAMPP → [[Práctica 2026-08-04]].
> Conviven: XAMPP trae el stack Apache/MySQL/PHP empaquetado; Docker levanta el motor aislado en un
> contenedor.

## Slide 3 · Introducción — qué es un SGBD

> [!quote] Definición de SGBD (slide 3)
> *"Un **sistema gestor de bases de datos** (SGBD) consiste en una **colección de datos
> interrelacionados** y un **conjunto de programas** para acceder a dichos datos."*

El slide resalta en color las dos mitades de la definición: la **colección de datos** (*"denominada
normalmente base de datos"*, que *"contiene información relevante para la organización"*) y el
**conjunto de programas** de acceso. Un SGBD no es solo los datos ni solo el software.

**Objetivo principal** (subrayado en el slide): *"proporcionar una forma de <u>almacenar y recuperar
información</u> de manera práctica y eficiente."*

*"Los SGBD se diseñan para gestionar grandes volúmenes de información, esto implica la posibilidad
de:"*

- **Definir** estructuras para almacenar información. ← el futuro **LDD** del slide 8
- Contar con mecanismos para **manipular** dicha información. ← el futuro **LMD** del slide 8

> [!note] Definir / manipular es el eje del deck (razonamiento propio)
> El par reaparece como **LDD / LMD** en el slide 8 y en el slide 10 como lo que compila el
> *procesador de consultas*. Si preguntan "qué implica gestionar grandes volúmenes", la respuesta es
> esa dupla.

## Slide 4 · Aplicaciones de los SGBD

Lista cerrada de siete dominios, sin comentario:

1. Bancos
2. Líneas aéreas
3. Universidades
4. Tarjetas de Crédito
5. Telecomunicaciones
6. Sistemas de ventas o de compras
7. Cadenas de producción o gestión de almacenes

> [!note] Razonamiento propio
> Los siete son casos **OLTP transaccionales de alta concurrencia**: justo donde duelen los siete
> inconvenientes del slide siguiente. El slide 4 y el slide 5 son la misma idea al derecho y al revés.

## Slide 5 · Aplicaciones de BD vs. sistemas de archivos

> [!quote] El sistema de procesamiento de archivos (slide 5)
> *"En un **sistema de procesamiento de archivos** típico se mantiene mediante un sistema operativo
> convencional, los registros permanentes son almacenados en varios archivos y se escriben diferentes
> programas de aplicación para extraer registros y para añadir registros a los archivos adecuados, lo
> que ocasiona inconvenientes importantes."*

**Los siete inconvenientes**, con el título textual del slide y una glosa de qué falla. El deck solo
los enumera —ninguno tiene explicación en este ni en otro slide—, así que la glosa es **razonamiento
propio: verificar contra Silberschatz cap. 1** antes de darla por buena.

| # | Inconveniente *(textual del slide)* | Qué falla *(glosa propia)* |
| --- | --- | --- |
| 1 | **Redundancia e inconsistencia de datos.** | El mismo dato duplicado en varios archivos y formatos; se actualiza una copia y no las otras → las copias se contradicen. |
| 2 | **Dificultad en el acceso a los datos** | No hay lenguaje de consulta general: cada consulta no prevista obliga a escribir un programa nuevo. |
| 3 | **Aislamiento de datos.** | Los datos están dispersos en archivos con formatos distintos; cruzarlos requiere código a medida. |
| 4 | **Problemas de integridad.** | Las restricciones viven enterradas en el código de cada programa; agregar una nueva obliga a tocar todos. |
| 5 | **Problemas de atomicidad.** | Un fallo a mitad de una operación compuesta deja el estado a medio aplicar. |
| 6 | **Anomalías en el acceso concurrente** | Varios procesos escribiendo el mismo archivo a la vez se pisan entre sí. |
| 7 | **Problemas de seguridad.** | No hay forma de que cada usuario vea solo la porción que le corresponde. |

> [!note] Los siete son el índice de la cursada (razonamiento propio)
> Según el [[_cronograma]]: *aislamiento* y *dificultad en el acceso* → vistas,
> [[Clase 06 - Vistas-Parte 1]] y [[Clase 07 - Vistas-Parte 2]]; *eficiencia del acceso* → índices y
> explain plan, [[Clase 08 - Explicando el plan]]; *integridad*, *atomicidad*, *concurrencia* y
> *seguridad* → las clases de integridad, triggers, seguridad y ACID de la segunda parte del
> cuatrimestre. El slide 5 se puede leer como el temario.

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
  │  NIVEL DE VISTAS  vista 1 · vista 2 · …  │  ← subconjuntos por usuario
  ├──────────────────────────────────────────────┤
  │  NIVEL LÓGICO  QUÉ datos y qué relaciones│  ← el esquema
  ├──────────────────────────────────────────────┤
  │  NIVEL FÍSICO  CÓMO se almacenan  │  ← estructuras de bajo nivel
  └──────────────────────────────────────────────┘
```

El slide corta ahí: independencia de datos, esquema vs. instancia y ANSI/SPARC no aparecen (ver
§ *Qué NO hay en esta clase*).

> [!tip] El nivel de vistas se implementa en las Clases 06 y 07
> Este slide da el concepto; el objeto SQL `CREATE VIEW` que lo materializa se ve en las teóricas del
> 10/08 → [[Clase 06 - Vistas-Parte 1]] y [[Clase 07 - Vistas-Parte 2]], y en **TP4 Vistas**.

## Slide 7 · Modelos de datos

> [!quote] Definición (slide 7)
> *"Por debajo de la estructura de la base de datos está el **modelo de datos**: una colección de
> herramientas conceptuales para describir los datos, las relaciones entre los datos, la semántica de
> los datos y las restricciones de los datos."*

Cuatro elementos: **datos · relaciones · semántica · restricciones**. Modelos que nombra el slide:

| Modelo | Qué dice el deck |
| --- | --- |
| **Entidad-relación** | *"es un modelo de datos ampliamente usado, y proporciona una representación gráfica conveniente para ver los datos, las relaciones y las restricciones"* |
| **Relacional** | *"se usa ampliamente para almacenar datos en las bases de datos"* |
| **Orientado a objetos** | mencionado, sin definir |
| **Relacional orientado a objetos** | mencionado, sin definir |
| **Semiestructurados** | mencionado, sin definir |

> [!note] Es el índice de las clases que siguen
> El **modelo entidad-relación** se desarrolla en [[Clase 02 - Modelo Entidad-Relacion]] y su bajada
> a tablas en [[Clase 03 - Derivación a Esquema Lógico]]. La definición de *modelo de datos* de la
> Clase 02 (apuntes Ale/Dejean: *"herramienta intelectual"*, con **poder expresivo** y
> **abstracción**) dice lo mismo con otro vocabulario →
> [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]]. Los **modelos semiestructurados**
> son el gancho hacia la segunda mitad ([[MongoDB]], documentos JSON) →
> [[2.12.03 - Persistencia políglota|Persistencia políglota]].

## Slide 8 · Lenguajes de bases de datos

| Término | Definición textual del slide |
| --- | --- |
| **Esquema** | *"El diseño general de la base de datos se denomina el **esquema** de la base de datos."* |
| **LDD** — lenguaje de definición de datos | *"Un esquema de base de datos se especifica con un conjunto de definiciones que se expresan usando un **lenguaje de definición de datos (LDD)**."* |
| **LMD** — lenguaje de manipulación de datos | *"es un lenguaje que permite a los usuarios acceder o manipular los datos."* |

Sobre los LMD, textual: *"Los LMD no procedimentales, que requieren que un usuario especifique **sólo
los datos que necesita**, se usan ampliamente hoy día."* Debajo, dos sub-viñetas:

| Tipo de LMD | Qué especifica el usuario |
| --- | --- |
| **Declarativo** *(= no procedimental)* | **qué** datos necesita, no cómo obtenerlos — *"se usan ampliamente hoy día"* |
| **Procedimental** | el procedimiento para obtenerlos |

Último ítem del slide: **"Acceso a las bases de datos desde programas de aplicación. (ODBC, JDBC)"** —
las dos APIs se nombran y no se definen.

> [!warning] El slide mezcla dos nombres para lo mismo (razonamiento propio)
> *"No procedimental"* en el texto corrido y *"declarativo"* en la sub-viñeta son el mismo concepto;
> la sub-viñeta no agrega una tercera categoría. El slide no lo aclara.

> [!note] SQL es las dos cosas (razonamiento propio)
> SQL no es *un* LDD ni *un* LMD: contiene ambos — `CREATE`/`ALTER`/`DROP` son su LDD,
> `SELECT`/`INSERT`/`UPDATE`/`DELETE` su LMD. El deck los presenta como lenguajes separados, y el
> TP2 (creates) y el TP3 (SQLs) dividen igual → [[Práctica 2026-08-04]].

## Slide 9 · Usuarios y administradores de la base de datos

*"Los usuarios de bases de datos se pueden catalogar en varias clases, y cada clase de usuario usa
habitualmente diferentes tipos de interfaces de la base de datos."* El slide anuncia *"varias clases"*
y enumera **dos**: **usuarios normales** y **programadores de aplicaciones**.

**Administradores de bases de datos. Funciones** — las cuatro, textuales:

| # | Función del DBA |
| --- | --- |
| 1 | **Definición de esquemas y organización física** |
| 2 | **Definición de estructuras y métodos de acceso** |
| 3 | **Autorizaciones para acceder a los datos.** |
| 4 | **Mantenimiento de la base de datos** |

> [!note] Las cuatro funciones también son temario (razonamiento propio)
> Función 1 → esquema lógico, [[Clase 03 - Derivación a Esquema Lógico]]; función 2 → **índices**,
> [[Clase 08 - Explicando el plan]]; función 3 → **seguridad, roles y permisos** (TP8); función 4 →
> mantenimiento, que la cursada no cubre como clase propia.

## Slide 10 · Módulos de un SGBD

> [!bug] El título del slide dice **SGDB**, no SGBD
> Textual: *"MODULOS DE UN SGDB (DBMS)"*. Las letras B y D están permutadas respecto de la sigla
> correcta (**S**istema **G**estor de **B**ases de **D**atos), que el propio slide 3 escribe bien.
> Se transcribe tal cual pero **no se copia al parcial**.

*"Un sistema de bases de datos tiene varios subsistemas."* Los tres, con su definición textual:

| Subsistema | De qué responde *(textual del slide)* |
| --- | --- |
| **Gestor de transacciones** | *"es el responsable de asegurar que la base de datos permanezca en un estado **consistente (correcto)** a pesar de los fallos del sistema. El gestor de transacciones también asegura que las ejecuciones de **transacciones concurrentes** ocurran sin conflictos."* |
| **Procesador de consultas** | *"compila y ejecuta instrucciones **LDD y LMD**."* |
| **Gestor de almacenamiento** | *"es un módulo que proporciona la **interfaz** entre los datos de bajo nivel almacenados en la base de datos y los programas de aplicación y las consultas enviadas al sistema."* |

> [!note] Cada subsistema tapa inconvenientes del slide 5 (razonamiento propio)
> El **gestor de transacciones** responde a *atomicidad* (5) y *anomalías de concurrencia* (6); el
> **procesador de consultas** a *dificultad en el acceso* (2); el **gestor de almacenamiento** a
> *redundancia* (1) y *aislamiento* (3). El procesador de consultas es lo que se abre en canal con el
> **explain plan** de la [[Clase 08 - Explicando el plan]] (TP5); el gestor de transacciones es la
> clase de ACID → [[1.11.03 - Transacciones y ACID|Transacciones ACID]].

## Slide 11 · Arquitecturas de aplicaciones

*"Las aplicaciones de bases de datos se dividen normalmente en un parte frontal (**front end**) que
se ejecuta en las máquinas cliente y una parte que se ejecuta en servidor (**back end**)."* —
*"un parte frontal"* está así en el slide: es un tipeo del deck y se transcribe tal cual.

| Arquitectura | Definición textual | Piezas |
| --- | --- | --- |
| **Dos capas** | *"el frontal se comunica directamente con una base de datos que se ejecuta en el servidor"* | cliente ↔ servidor de BD |
| **Tres capas** | *"la parte del servidor se divide asimismo en un **servidor de aplicaciones** y en un **servidor de bases de datos**"* | cliente ↔ servidor de aplicaciones ↔ servidor de BD |

```
DOS CAPAS  [ front end ] ──────────────────────▶ [ servidor de BD ]

TRES CAPAS  [ front end ] ──▶ [ servidor de  ]──▶ [ servidor de BD ]
  [ aplicaciones  ]
```

El deck no da ventajas, desventajas ni criterio para elegir una u otra: solo la descripción
estructural (ver § *Qué NO hay en esta clase*).

---

## Slides 12–13 · PostgreSQL

Los dos últimos slides de contenido dejan la teoría general y presentan **un motor concreto**, que
no es el de la cursada: ver § *Problema de motor*.

### Slide 12 · Qué es PostgreSQL?

Título textual *"QUÉ ES POSTGRESQL?"*, sin `¿` de apertura. Seis ítems, con el logo del elefante de
PostgreSQL abajo a la derecha:

| Ítem del slide | Textual |
| --- | --- |
| Tipo | *"Sistema de Gestión de Base de Datos **Open-Source**"* |
| Origen | *"'**Proyecto Ingres**' en Universidad de **Berkeley**"* |
| Primera versión | *"Primera versión de PostgreSQL liberó en **1997**"* |
| Portabilidad | *"**Cross-Platform**"* |
| Lenguaje | *"Escrito en **C**"* |
| Usuarios | *"Utilizada por organizaciones tales como"* → **Yahoo · MySpace · Skype** |

> [!warning] Dos datos históricos a verificar (razonamiento propio, no está en el deck)
> - *"'Proyecto Ingres' en Universidad de Berkeley"*: el linaje habitual es **Ingres → POSTGRES
>   ("post-Ingres") → Postgres95 → PostgreSQL**, todos en Berkeley. PostgreSQL desciende de
>   **POSTGRES**, el **sucesor** de Ingres, no de Ingres mismo.
> - *"Primera versión … 1997"*: 1997 es el año en que el proyecto pasa a llamarse **PostgreSQL**;
>   hubo versiones previas como POSTGRES y Postgres95.
>
> Ambas dependen de qué se cuente como "primera versión"; ninguna fuente del vault las respalda ni
> las desmiente. **MySpace** y **Skype** en la lista de usuarios datan el slide a fines de los 2000:
> viene de una versión vieja del deck, coherente con que la cursada ya no use PostgreSQL.

### Slide 13 · Arquitectura de PostgreSQL

Slide de una sola imagen, con el título en vertical sobre el margen izquierdo: un diagrama de bloques
partido en dos cajas grandes, **Cliente** (arriba) y **Servidor** (abajo). Reconstrucción de lo que
se lee:

```
┌─ CLIENTE ─────────────────────────────────────────────────────┐
│  ┌──────────────┐  │
│  │  Aplicación  │  │
│  └──────┬───────┘  │
│  ▲▼  │
│  ┌──────────────┐  │
│  │  LIBPG  │  │
│  └──┬────────┬──┘  │
└───────────────────────│────────│──────────────────────────────┘
  Conexión inicial  ▲▼  ▲▼  Autenticación, consultas y resultados
┌─ SERVIDOR ────────────│────────│──────────────────────────────┐
│  ┌ postgresql.conf ┐  │  │  │
│  ├ pg_hba.conf  ┤  │  │  (sin flecha en el dibujo)  │
│  └ pg_ident.conf  ┘  ▼  ▼  │
│  ┌────────────┐  ┌──────────┐  │
│  │ Postmaster │───▶│ Postgres │┐  │
│  └────────────┘  └──────────┘│┐  ← 3 cajas  │
│  └──────────┘│  apiladas  │
│  └──────────┘  │
│  ▲▼  ▲▼  FSYNC  │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ PostgreSQL Share  │  │ Write-ahead log  │  │
│  │ Buffer Cache  │  │ (WAL)  │  │
│  └──────────┬───────────┘  └──────────┬───────────┘  │
│  ▲▼  FSYNC ▲▼  │
│  ┌─────────────────────────────────────────────┐  │
│  │  Kernel disk buffer cache  │  │
│  └──────────────────┬──────────────────────────┘  │
│  ▲▼  FSYNC  │
│  ╭─────────╮  │
│  │  Disk  │  ← en gris muy claro  │
│  │  Disco  │  │
│  ╰─────────╯  │
└───────────────────────────────────────────────────────────────┘
```

Detalles que la reconstrucción no muestra: las flechas son **bidireccionales** salvo *Conexión
inicial* (LIBPG → Postmaster) y Postmaster → primer `Postgres`; LIBPG es la caja destacada (violeta,
cursiva); los tres `.conf` son cajas **punteadas** pegadas al Postmaster **sin ninguna flecha**;
`Postgres` son **tres cajas superpuestas y escalonadas**. **Los tres rótulos `FSYNC`** están sobre
`Postgres` ↔ `WAL`, `WAL` ↔ `Kernel disk buffer cache` y `Kernel disk buffer cache` ↔ `Disco`:
ninguno cuelga de la rama del *Share Buffer Cache*.

> [!note] Qué se lee en la estructura (razonamiento propio; el slide no tiene texto)
> 1. **Un proceso por conexión**: el Postmaster recibe la conexión inicial y despacha a un
>    `Postgres`, que aparece triplicado.
> 2. **Dos capas de caché encadenadas**: la del motor (*Share Buffer Cache*) y la del sistema
>    operativo (*Kernel disk buffer cache*); los datos no van del motor al disco directamente.
> 3. **El camino rotulado `FSYNC` es el del WAL**: Postgres → WAL → kernel cache → disco.
>
> Son inferencias sobre el dibujo: **verificar en clase**.

> [!bug] Dos tipeos del diagrama
> **LIBPG**: la librería cliente en C de PostgreSQL se llama **`libpq`** (con `q`, de *query*).
> **"PostgreSQL Share Buffer Cache"**: el parámetro y el componente se llaman **`shared_buffers`** /
> *shared buffer cache*. Ambos se transcriben como están en el slide.

> [!warning] Este diagrama es de PostgreSQL, no de MySQL
> Nada se traslada a MySQL sin traducción; sí la **forma** del problema: despachador, pool de
> conexiones, caché de páginas, log de escritura anticipada y `fsync` al disco (§ *Problema de
> motor*). Los nombres de MySQL/InnoDB no están verificados contra ninguna fuente del vault: no
> usarlos en el parcial sin verificar.

## Slide 14 · Bibliografía y referencias

El slide se titula *"Bibliografía y Referencias"* y todo su contenido es una línea, más un signo de
pregunta gigante y *"Preguntas?"* (sin `¿` de apertura, como en el slide 12):

> [!quote] Slide 14, textual
> *"Lectura Obligatoria: Capítulo 1 – Introducción Silberschatz"*

Es la **única** referencia bibliográfica del deck: sin edición, páginas ni secciones. Como el cuerpo
(slides 3–11) define cada concepto en una o dos líneas y no desarrolla ninguno, la clase se estudia
contra ese capítulo y el deck sirve como checklist de qué entra. El mapeo sección por sección contra
la ficha real de la fuente lo hace [[_index-bibliografia]], no esta página.

---

## Problema de motor: el deck presenta PostgreSQL, la cursada usa MySQL

El programa oficial dice PostgreSQL y el cronograma dicta MySQL ([[_cronograma]] § *Diferencias con
el programa oficial*); esta clase agrega el caso más de fondo: el slide institucional de "qué motor
usamos", en la primera clase de la materia. Los hechos:

| Evidencia | Motor que implica | Dónde |
| --- | --- | --- |
| Herramientas a descargar: MySQL Workbench, XAMPP; MongoDB | **MySQL**; **MongoDB** | slide 2 de este deck |
| *"¿Qué es PostgreSQL?"* + arquitectura | **PostgreSQL** | slides 12–13 de este deck |
| Práctica del 04/08: instalación de MySQL vía Docker | **MySQL** | [[Práctica 2026-08-04]] |
| Cronograma: primera mitad SQL avanzado | **MySQL** | [[_cronograma]] |
| Programa oficial: *PostgreSQL avanzado* | **PostgreSQL** | [[_cronograma]] § diferencias |
| Deck `BD2_Clase 04`, sintaxis de los ejemplos | **PostgreSQL** | [[Clase 04 - AlteraciónActualizaciónTablas]] |

El slide 2 y los slides 12–13 no pueden ser los dos verdaderos a la vez: un deck que instala MySQL
Workbench y después explica el `Postmaster` de PostgreSQL arrastra material de una versión anterior
de la materia. **Se resuelve por la regla del vault: gana el cronograma → la cursada es MySQL.** Los
slides 12–13 se estudian como **ejemplo de arquitectura de un SGBD relacional**; lo evaluable es la
**estructura** (despachador · procesos por conexión · buffer cache · WAL · fsync), no los nombres
propios de PostgreSQL.

## Qué NO hay en esta clase

Huecos del deck, para no confundirlos con "no entra". Si los cubre la lectura obligatoria del
slide 14 hay que verificarlo contra la ficha en [[_index-bibliografia]]:

- [ ] Definición de cada uno de los **siete inconvenientes** (slide 5 solo los enumera).
- [ ] **Independencia de datos** física y lógica.
- [ ] Distinción **esquema vs. instancia** (el slide 8 define *esquema* sin contraponerlo a instancia).
- [ ] **Arquitectura de tres esquemas** ANSI/SPARC.
- [ ] Definición de **ODBC** y **JDBC** (solo se nombran).
- [ ] Las **clases de usuario** más allá de dos.
- [ ] Ventajas y desventajas de **dos capas vs. tres capas**.
- [ ] Cualquier mención de **NoSQL**: entra en la segunda mitad del cuatrimestre, según el
  [[_cronograma]], y no lo cubre ese capítulo.

## Dudas abiertas

- [ ] ¿Los slides 12–13 (PostgreSQL) son evaluables, o quedaron de una versión anterior del deck?
  Es la duda principal: la diferencia entre memorizar `pg_hba.conf` o no.
- [ ] ¿Cuál es el equivalente en **MySQL/InnoDB** de cada pieza del diagrama (postmaster, proceso por
  conexión, share buffer cache, WAL)?
- [ ] ¿La cátedra toma las **dos** clases de usuario del slide 9, o hay más?
- [ ] ¿"LMD no procedimental" y "LMD declarativo" son lo mismo para la cátedra? *(Deberían serlo.)*
- [ ] ¿SQL se presenta como **un** lenguaje con parte LDD y parte LMD, o como dos? El slide 8 sugiere
  lo segundo.
- [ ] ¿*"Proyecto Ingres"* y *"primera versión en 1997"* (slide 12) son precisos, o simplificaciones?
- [ ] ¿`LIBPG` y `Share Buffer Cache` del diagrama son tipeos por `libpq` y *shared buffer cache*?
- [ ] ¿Qué relación tienen los tres `.conf` con el `Postmaster`, si el diagrama no los une con flecha?
- [ ] ¿Qué edición de **Silberschatz** es la de la lectura obligatoria? → ficha en [[_index-bibliografia]].
- [ ] ¿Se instala con **XAMPP** o con **Docker**? El slide 2 dice XAMPP, la práctica usa Docker.

## Enlaces

- Clase anterior: — (es la primera de la materia) · clase siguiente: [[Clase 02 - Modelo Entidad-Relacion]]
- Práctica de esa semana: [[Práctica 2026-08-04]]
- Motores: [[MySQL]] · [[PostgreSQL]] · [[MongoDB]]
- Conceptos: [[Niveles de abstracción de datos]] · [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] ·
  [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]] · [[1.11.03 - Transacciones y ACID|Transacciones ACID]] · [[2.12.03 - Persistencia políglota|Persistencia políglota]] · [[Docker]]
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
