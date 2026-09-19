---
tipo: teorica
clase: 11
deck: "BD2_Clase 11 - Seguridad-Transacciones.pdf"
unidad: 1
tema: "Seguridad en Bases de Datos. Transacciones ACID · Implementación de matriz de roles y permisos"
resumen: "Última teórica relacional, en tres bloques: seguridad con cuentas 'usuario'@'host', GRANT, roles y REVOKE en MySQL; transacciones ACID, anomalías y niveles de aislamiento; y un bloque de índices B-tree vs. hash sin anunciar. Da la sintaxis del GRANT, no el modelo de autorización que pide el TP8."
fecha: 2026-09-07
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 11
  - Clase 11 — Seguridad y transacciones
  - Seguridad-Transacciones
  - Seguridad y Transacciones
  - Transacciones ACID
  - ACID
  - GRANT y REVOKE
  - Roles en MySQL
  - Niveles de aislamiento
  - Locking
  - B-tree vs. Hash
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 11 - Seguridad-Transacciones.pdf"
estado: procesado
---

# Clase 11 — Seguridad, transacciones ACID y concurrencia (más un tercer bloque de índices)

## Resumen general

Última teórica de la mitad relacional, del 07/09, con el TP 8 Seguridad del 08/09. El deck trae tres bloques en 38 slides y anuncia dos. **Seguridad** *(slides 2–13)*: amenazas, niveles, autenticación vs. autorización y la sintaxis MySQL de cuentas y privilegios: `CREATE USER 'u'@'host'`, `GRANT … ON base.tabla TO … [WITH GRANT OPTION]`, `CREATE ROLE`, `REVOKE`, `FLUSH PRIVILEGES`. **Transacciones y concurrencia** *(slides 14–30)*: ACID, estados, las anomalías *(lost update, dirty read, non-repeatable read, phantom)*, tres mecanismos de control *(locking, optimista, timestamps)*, los niveles de aislamiento y dos ejemplos en SQL Server y PostgreSQL. **Índices** *(slides 31–38)*, sin anuncio: ordenados vs. asociativos, con y sin agrupación, multinivel, `CREATE INDEX` y B-tree vs. hash según el manual de MySQL.

Es el primer deck de la unidad escrito en MySQL por defecto y el que menos alcanza para su TP, que pide grafos de permisos, privilegios por columna y `REVOKE … CASCADE` "desde la teoría", ausentes de los slides; hace falta GMUW 10.1.4–10.1.6.

Trampas: una cuenta MySQL es `'usuario'@'host'` —no "usuario y contraseña", slide 8— y en Docker hace falta `'%'`. `FLUSH PRIVILEGES` tras un `GRANT` es innecesario; conceder un rol no lo activa sin `SET DEFAULT ROLE`. `REVOKE` no cascadea en MySQL. El slide 30 llama "control de versiones" a un `SELECT … FOR UPDATE`, que es un bloqueo. InnoDB arranca en `REPEATABLE READ` y, contra la tabla del estándar, en la práctica no muestra phantoms. `DROP INDEX` exige `ON tabla`, y `USING HASH` sobre InnoDB se ignora: crea un B-tree.

Para el parcial: la tabla ACID *(la C no la garantiza el motor)*, la de anomalías por nivel de aislamiento, la matriz S/X, fila vs. conjunto en non-repeatable vs. phantom, B-tree *(igualdad y rango, prefijo de `LIKE`)* vs. hash *(solo igualdad, clave completa)* y el cuadro de bolsillo.

## Ficha del deck

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 11 - Seguridad-Transacciones.pdf` · **38 slides** · **7 imágenes
> embebidas**, ninguna con contenido técnico salvo el **diagrama de estados del slide 20** *(las otras
> seis son adornos, en los slides 3, 4, 10, 14, 15 y 31)*. El slide 1 es la **portada**; **no hay slide
> de agenda, ni de bibliografía, ni de cierre**: el deck termina en seco con un `CREATE INDEX`.
> Dictado en la **teórica del lunes 07/09**; el `11` del nombre del archivo es el número de clase que
> asigna la cátedra. Tema oficial según [[_cronograma]] *(fila 2026-09-07)*: ***"Seguridad en Bases de
> Datos. Transacciones ACID · Implementación de matriz de roles y permisos"***.
> Clase anterior: [[Clase 10 - Restricciones integridad-Parte 2]] *(31/08)*. Clase siguiente:
> [[Clase 12 - Introduccion a NoSQL]] *(14/09: abre la segunda mitad y la `Unidad-02`, con las Clases
> 12 a 14 y el TP9)*. Se practica con el **TP 8 Seguridad** del martes 08/09 → [[Práctica 2026-09-08]].
> Bibliografía: [[_index-bibliografia]] › Clase 11.
>
> **Es la última teórica de la primera mitad relacional.** La `Unidad-01` cierra con las **Clases 01 a
> 11** y los **TP1 a TP8**; el deck 11 y el TP8 están archivados en `raw/Unidad-01/`.

> [!success] (clave) Motor: **el primer deck de la U1 escrito en MySQL por defecto**
> Evidencia, verificada slide por slide:
>
> | Evidencia | Dónde |
> | --- | --- |
> | El título literal *"Mecanismos de Seguridad **(MySQL)**"* | slide **7** |
> | *"Un usuario **MySQL** se define en términos de un nombre de usuario y una contraseña"* · *"El superusuario se denomina **ROOT**"* | slide **8** |
> | `CREATE USER 'nombre_usuario'@'host' IDENTIFIED BY …` — la identidad `'usuario'@'host'` y el comodín `'%'` son de MySQL | slides **9, 10, 11, 12, 13** |
> | `CREATE ROLE` · `GRANT 'app_developer' TO 'dev1'@'localhost'` · `SHOW GRANTS … USING` — roles de **MySQL 8.0+**, copiados del manual | slide **11** |
> | **`FLUSH PRIVILEGES;`** — comando que sólo existe en MySQL | slides **12, 13** |
> | Traducción casi literal de la **§ 10.3.9** del manual, *Comparison of B-Tree and Hash Indexes* —la lectura asignada en el TP5—, con el operador **`<=>`** que sólo existe en MySQL | slides **36, 37** |
> | El título literal *"Ejemplo en **MySQL**"* con `CREATE INDEX MYINDEX ON USERS (DNI) USING HASH;` | slide **38** |
>
> **Recuento: 10 slides con MySQL explícito · 1 con SQL Server · 1 con PostgreSQL · 26 estándar o sin
> motor.** Los dos slides con motor ajeno **están rotulados por el propio deck** —*"Ejemplo de bloqueo
> en **SQL Server**"* (29: T-SQL, `BEGIN TRANSACTION`, `WITH (UPDLOCK)`, `COMMIT TRANSACTION`) y
> *"Ejemplo de control de versiones en **PostgreSQL**"* (30, que **corre sin cambios en MySQL**)—: es la
> primera vez en la U1 que un deck dice de qué motor es el código ajeno. Lo que cambia es la naturaleza,
> no el conteo: en los decks 08, 09 y 10 el motor ajeno **era el contenido** *(ocho slides de PL/pgSQL
> en el 10)*; aquí son dos ejemplos de cinco líneas. Con el criterio de
> [[_index-clases]] y [[PostgreSQL]] § *Inventario* —*"trae sintaxis de otro motor"*— el deck entra
> igual en la lista: los archivos de `raw/Unidad-01/Teorica/` con motor ajeno son **once de trece**;
> limpios siguen sólo el `02` y el `06` *(con atribución histórica)*. Hay un tercer lugar donde el
> código no corre en MySQL y **no lo dice**: `drop index <nombre-índice>` del slide **35**, que en MySQL
> exige `ON <tabla>`.
>
> (crítico) **El deck no muestra ni una sola transacción en MySQL.** Sus únicos `BEGIN … COMMIT` son
> los de SQL Server y PostgreSQL. Ni `START TRANSACTION`, ni `ROLLBACK`, ni `autocommit`, ni
> `SET TRANSACTION ISOLATION LEVEL`, ni el dato de que **InnoDB arranca en `REPEATABLE READ`**: todo
> eso queda pendiente para [[MySQL]] *(cuentas, transacciones, aislamiento)*.

> [!warning] (crítico) El nombre dice *"Seguridad-Transacciones"*; el deck trae **tres** bloques, y el tercero no está anunciado
> Los **slides 31 a 38** —el **21 %** del deck— son de **índices**: definición, ordenados vs.
> asociativos, primarios vs. secundarios, multinivel, `CREATE INDEX`, B-tree vs. hash y `USING HASH`.
> Ni el nombre del archivo, ni la portada, ni el tema del [[_cronograma]] los mencionan, y los
> encabezados de los slides **32, 33, 34 y 35** dicen *"Transacciones en Base de Datos"* *(ver §
> *Erratas*)*.
>
> (clave) **Ese bloque no es relleno: es la teoría que faltaba de la [[Clase 08 - Explicando el plan]]**:
> los slides 32–37 cierran los tres huecos ✗ de [[1.08.02 - Índices|Índices]] § *Qué cubrió la clase*
> —*"Qué es un B-tree"*, *"Tipos de índice (hash, GiST, GIN, bitmap…)"*, *"Clustered vs.
> non-clustered"*—: ver § *Slides 32–33* y la propagación pendiente en § *Dudas abiertas*.

> [!missing] (crítico) Lo que el tema oficial y el TP8 prometen y **el deck no trae**
> | Prometido por | Qué | ¿Está en el deck? |
> | --- | --- | :---: |
> | [[_cronograma]] *(tema del 07/09)* | *"Implementación de **matriz de roles y permisos**"* | ✗ **ninguna matriz** — la palabra no aparece en los 38 slides |
> | TP8 ej. **1.a** | *"Realice el **grafo de permisos**"* | ✗ **cero** menciones a grafos o diagramas de autorización *(es GMUW **10.1.5** *Grant Diagrams*, impresa 431)* |
> | TP8 ej. **1** y **2.g/i** | `GRANT UPDATE(tiempo,diccion) ON parrafo` — **privilegios por columna** | ✗ el slide 10 sólo da `ON [base].[tabla]` |
> | TP8 ej. **1.b** y **3.b** | `REVOKE … CASCADE` — revocación en cascada | ✗ **ni `CASCADE` ni `RESTRICT`** *(y MySQL tampoco los tiene: el TP lo dice)* |
> | TP8 ej. **2.d/f** | *"todos los usuarios del sistema"* — `PUBLIC` | ✗ no aparece |
> | TP8 ej. **2.j** | *"Eliminar el rol … ¿qué sucede con los usuarios?"* | (atención) el slide 11 tiene `DROP ROLE` pero **no dice qué pasa** con quienes lo tenían |
> | [[1.06.01 - Vistas\|Vistas]] *(previsión del 10/08)* | *"vistas como control de acceso → seguridad (07/09)"* | ✗ **el deck no nombra las vistas ni una vez** |
> | Slide **7** del propio deck | *"Conexiones seguras · Tipos de conexiones y soporte para **SSL**"* | ✗ **anunciado en la agenda del bloque y nunca desarrollado** |
>
> **El TP8 ejercita, sobre todo, lo que no está en el deck**: los tres ejercicios son de propagación y
> revocación de privilegios entre usuarios —el *grant diagram* de GMUW 10.1—, y el deck se queda en
> la sintaxis de un `GRANT` a un usuario. Para el TP hace falta **GMUW 10.1.4–10.1.6** *(impresas
> 430–436)*, no el deck.

> [!note] De dónde salen los slides — observación, no bibliografía
> El deck **no declara fuentes**, pero el texto delata dos libros y un manual, y **ninguno de los dos
> libros está en el vault**:
>
> - **Silberschatz, Korth y Sudarshan**, *Fundamentos de Bases de Datos* *(traducción española)*: los
> niveles de seguridad del slide 4, los cinco estados del 18, las ventajas de la concurrencia del 22
> y **todo el bloque de índices 31–35** *("índices ordenados / asociativos", "con agrupación / sin
> agrupación", el ejemplo bancario de `cuenta`, `sucursal` y `nombre-sucursal`)*. El vault sólo tiene
> su **capítulo 1** *(ficha: `Silberschatz - Fundamentos de Bases de Datos Cap 1 — ficha.md`)*, que
> **no dice "aislamiento" ni "ACID"** *(ficha, fila "ACID como acrónimo": 0 apariciones)*.
> - **Elmasri y Navathe**, *Fundamentos de sistemas de bases de datos*: los tres tipos de amenaza del
> slide 3, la lista de seis fallos del 15, las cinco operaciones del 19 y **el diagrama de estados del
> 20** *(con "Fallo" y "Terminar")*. **No está en el vault**: se cita `—` en el mapeo y se propone
> como fuente externa.
> - **MySQL Reference Manual**: los slides 11 *(§ *Using Roles*)* y 36–37 *(§ 10.3.9)* son copias del
> manual, en el primer caso con los mismos nombres del ejemplo oficial *(`dev1`, `app_developer`)*.
>
> Lo que sí está en el vault y **cubre casi todo el deck** es **GMUW** *(6.6, 10.1, 17.1, 18.3–18.9,
> 8.3, 14.1–14.3)* y **Date** *(caps. 15, 16 y 17)*. El mapeo fino va en [[_index-bibliografia]] ›
> Clase 11.

## Estructura del deck

Los dos temas que el deck sí anuncia son los que la segunda mitad necesita para comparar motores:
**quién puede tocar qué** *(seguridad)* y **qué garantiza el motor cuando muchos tocan lo mismo a la
vez** *(transacciones y concurrencia)*. Cuando la [[Clase 12 - Introduccion a NoSQL]] hable de BASE,
CAP y *eventual consistency*, lo que se negocia es el ACID de los slides 16–17 y los niveles de
aislamiento del 28.

| Bloque | Qué establece | Slides |
| --- | --- | --- |
| **Portada** | *"SEGURIDAD Y TRANSACCIONES"* | 1 |
| **Seguridad · marco** | Definición, tres amenazas, cinco niveles, autenticación vs. autorización, cifrado | 2–6 |
| **Seguridad · MySQL** | Agenda del bloque, `ROOT`, `CREATE USER`, `GRANT` y sus permisos, roles, `REVOKE` + `FLUSH PRIVILEGES`, ejemplos | 7–13 |
| **Transacciones · concepto** | Definición, seis tipos de fallo, **ACID**, cinco estados, cinco operaciones, diagrama de estados | 14–20 |
| **Concurrencia · por qué** | Secuencial vs. concurrente, dos ventajas | 21–22 |
| **Concurrencia · anomalías** | Race conditions, dirty read, non-repeatable read, phantom read | 23–24 |
| **Concurrencia · mecanismos** | Locking (shared/exclusive), control optimista, timestamp ordering | 25–27 |
| **Niveles de aislamiento** | Read Uncommitted → Read Committed → Repeatable Read → Serializable | 28 |
| **Ejemplos** | `WITH (UPDLOCK)` en SQL Server · `FOR UPDATE` en PostgreSQL | 29–30 |
| **Índices** | Definición, tipos, subtipos, multinivel, `CREATE INDEX`, B-tree vs. hash, `USING HASH` | 31–38 |

> [!important] (clave) Cuatro cosas que conviene tener claras antes del recorrido
> 1. **El deck enseña la sintaxis de un `GRANT`, no el modelo de autorización** que el TP8 pregunta
> *(qué pasa cuando quien recibió `WITH GRANT OPTION` concede a un tercero y después se lo revocan)*:
> eso es **GMUW 10.1.5–10.1.6** y **Date 17.2**.
> 2. **ACID se define en dos slides y no vuelve a usarse.** Los slides 23–28 hablan de anomalías y
> aislamiento **sin decir que están desarrollando la "I" de ACID**. El puente lo pone esta página.
> 3. **Los tres mecanismos de control (25–27) y los cuatro niveles (28) son dos ejes distintos** que el
> deck no relaciona: el nivel es *qué* garantiza el motor; el mecanismo, *cómo* lo implementa. En
> MySQL/InnoDB conviven **locking** *(escrituras y `FOR UPDATE`)* y **multiversión** *(lecturas
> comunes)*.
> 4. **El slide 30 está mal rotulado**: su `SELECT … FOR UPDATE` es un **bloqueo pesimista**, lo
> contrario del *"control de versiones"* que el slide 26 define *(«no utilizan bloqueos»)*. Ver
> § *Contradicciones internas*.

---

## Slide 1 · La portada

> [!quote] Textual, completo
> *"Bases de Datos II"*
> *"**SEGURIDAD Y TRANSACCIONES**"*

Plantilla distinta de la de los decks 09 y 10, **sin logo del ITBA en la portada**. Todo el texto del
deck es texto vivo; la única imagen con contenido es el diagrama del slide 20.

## Slide 2 · Introducción — qué es la seguridad de una base de datos

> [!quote] Textual
> - *"La seguridad de las bases de datos se refiere a la protección frente a **accesos
> malintencionados**"*
> - *"Es posible controlar el acceso a la base de datos brindando la autorización adecuada"*
> - *"Los datos guardados en la base de datos deben estar protegidos contra:"*
> - *"accesos no autorizados"*
> - *"destrucción o alteración malintencionadas"*
> - *"introducción accidental de inconsistencias"*

> [!note] La tercera amenaza **no es de seguridad**, y el deck la pone igual
> *"Introducción **accidental** de inconsistencias"* no es un acceso malintencionado: es el problema
> que resuelven las **restricciones de integridad** del deck 09 y las **transacciones** de este mismo
> deck. La lectura útil es que la seguridad en sentido amplio es la suma de autorización, integridad y
> ACID: la misma tripartición de Silberschatz cap. 1 § 1.2 *(ficha: inconvenientes 6 y 7, "anomalías
> en el acceso concurrente" y "problemas de seguridad")*, que la
> [[Clase 01 - Introducción_BasesDeDatos]] ya transcribió.

## Slide 3 · Tipos de amenazas

> [!quote] Textual
> - ***Pérdida de integridad.** La integridad se pierde si se realizan cambios no autorizados en los
> datos mediante acciones intencionadas o accidentales*
> - ***Pérdida de disponibilidad.** Se refiere a que los objetos estén disponibles para un usuario
> humano o para un programa que tenga los derechos correspondientes*
> - ***Pérdida de confidencialidad.** La confidencialidad de la base de datos tiene relación con la
> protección de los datos frente al acceso no autorizado*

Es la tríada **CIA** *(confidentiality · integrity · availability)* de la seguridad informática, en
otro orden y sin nombrarla.

| Amenaza | Lo que se pierde | El mecanismo de la cursada que la ataca |
| --- | --- | --- |
| Pérdida de **integridad** | corrección de los datos | `GRANT` acotado *(slides 10–13)* + restricciones *(deck 09)* + transacciones *(16–20)* |
| Pérdida de **disponibilidad** | que el dato esté cuando se lo pide | **nada en este deck** — es el terreno de réplicas y de CAP, [[Clase 12 - Introduccion a NoSQL]] |
| Pérdida de **confidencialidad** | que sólo lo vea quien debe | `GRANT SELECT` selectivo *(10, 13)* + cifrado *(6)* |

La disponibilidad es la única amenaza sin mecanismo en los 38 slides; es la **A de CAP** *(Seven
Databases 2ª ed. **A2** *The CAP Theorem*, impresas 315–318; Corbellini **§ 3.1**)*, el eje que la
segunda mitad va a poner contra la consistencia. **Redacción:** la definición de *pérdida de
disponibilidad* está escrita al revés —define la disponibilidad, no su pérdida— y la de
*confidencialidad* es circular. Se transcriben como están.

## Slide 4 · Niveles de seguridad

> [!quote] Textual
> - ***Sistema de bases de datos.** Autorización al acceso a una parte limitada de la base de datos*
> - ***Sistema operativo.** La debilidad de la seguridad del sistema operativo puede servir como
> medio para el acceso no autorizado*
> - ***Red.** La seguridad en el nivel del software de la red es tan importante en Internet y en las
> redes privadas de las empresas*
> - ***Físico.** Los sitios que contienen los sistemas informáticos deben estar protegidos de intrusos*
> - ***Humano.** Los usuarios deben ser autorizados cuidadosamente para reducir la posibilidad de
> intrusión*

Cinco niveles, del más interno al más externo. **El deck sólo desarrolla el primero** —el nivel
*sistema de bases de datos*—, el único donde el DBMS tiene algo que decir; los otros cuatro son el
contexto que hace que un `GRANT` sirva de algo.

> [!tip] Es el argumento de por qué existe el `'host'` en `'usuario'@'host'`
> El nivel **Red** es lo que justifica que MySQL haga del *host* **parte de la identidad del usuario**
> *(slide 9)*: `'juan'@'localhost'` y `'juan'@'%'` son **dos cuentas distintas**, con permisos
> distintos. El deck no conecta los dos slides.

## Slide 5 · Autenticación y autorización

> [!quote] Textual
> - *"La **autenticación** es el proceso por el cual se identifica un usuario como válida para
> posteriormente acceder a ciertos recursos definidos"* **[sic: "válida"]**
> - *"Relacionado con la **gestión de usuarios y control de acceso** al DBMS"* *(en rojo solo el fragmento en negrita)*
> - *"La **autorización** es el proceso sobre el cual se establecen qué tipos de recursos están
> permitidos o denegados para cierto usuario o grupo de usuarios concreto"*
> - *"Relacionado con **permisos** (lectura, escritura) para cada usuario autentificado"* *(en rojo solo el fragmento en negrita)*

**La distinción es la que estructura los slides 8–13**:

| | Pregunta que responde | Sentencia MySQL | Slide |
| --- | --- | --- | :---: |
| **Autenticación** | ¿eres quien dices ser? | `CREATE USER 'u'@'host' IDENTIFIED BY '…'` | 9, 11 |
| **Autorización** | ¿puedes hacer esto? | `GRANT … ON … TO …` · `REVOKE` · `CREATE ROLE` | 10–13 |

*"Usuario o **grupo de usuarios**"* es el concepto que el slide 11 va a llamar **rol**: la única
anticipación del tema en el marco conceptual. En GMUW la pareja se trata en **10.1.3** *The
Privilege-Checking Process* *(impresa 428)*: la autorización se chequea **por sentencia**, contra los
privilegios del *authorization ID* actual.

## Slide 6 · Cifrado de datos — conceptos

> [!quote] Textual
> - *"El cifrado de datos se utiliza para proteger datos confidenciales como los números de las
> tarjetas de crédito y contraseñas"*
> - *"El cifrado se puede utilizar también para proporcionar protección adicional a partes
> confidenciales de la base de datos"*
> - *"Los datos se codifican utilizando algún algoritmo de codificación o cifrado"*
> - *"Un usuario no autorizado que acceda a datos codificados tendrá dificultades para descifrarlos,
> pero a los usuarios autorizados se les proporcionarán claves para descifrar los datos"*

Único slide sobre cifrado, **sin un algoritmo, una función ni una sentencia**. Vale como concepto: el
cifrado es la **última línea**, lo que protege cuando fallaron los niveles del slide 4, y es
complementario a la autorización, no un sustituto.

> [!tip] Lo que MySQL trae para esto y el deck no nombra *(a verificar en el manual 9.7)*
> - **Contraseñas**: MySQL nunca guarda la contraseña de `IDENTIFIED BY` en claro; la *hashea* con el
> plugin de autenticación de la cuenta *(`caching_sha2_password` por defecto desde 8.0)*. El slide 6
> pone "contraseñas" como ejemplo de dato a cifrar y el 9 las crea, sin conectar los dos.
> - **Datos en reposo**: cifrado de *tablespace* en InnoDB *(`ENCRYPTION='Y'` en `CREATE TABLE`)* y
> funciones `AES_ENCRYPT()` / `AES_DECRYPT()` para cifrar columnas desde SQL.
> - **Datos en tránsito**: el **SSL** que el slide 7 anuncia y nunca desarrolla.
>
> Nada de esto está en el deck. En bibliografía: **Date 17.5** *Data Encryption* *(impresa 519)*.

---

## Slide 7 · Mecanismos de seguridad (MySQL) — la agenda del bloque

> [!quote] Textual — es el slide que fija el motor del deck
> ***Mecanismos de Seguridad (MySQL)***
> - *"Administración de cuentas de usuarios"*
> - *"Creación, modificación y borrado de cuentas de usuario"*
> - *"Gestión de permisos"*
> - *"Otorgamiento, Modificación y Revocación de privilegios"*
> - *"Conexiones seguras"*
> - *"Tipos de conexiones y soporte para SSL"*

Es la agenda de los slides 8–13, y sirve para medir lo que el bloque cumple:

| Prometido | Cumplido | Dónde |
| --- | :---: | --- |
| Creación de cuentas | ✓ | `CREATE USER` *(9, 11)* |
| **Modificación** de cuentas | ✗ | ni `ALTER USER`, ni `RENAME USER`, ni cambio de contraseña |
| **Borrado** de cuentas | ✗ | ni `DROP USER` *(hay `DROP ROLE`, que es otra cosa)* |
| Otorgamiento de privilegios | ✓ | `GRANT` *(10, 11, 13)* |
| **Modificación** de privilegios | (atención) | sólo por la vía `GRANT` + `REVOKE` |
| Revocación de privilegios | ✓ | `REVOKE` *(12, 13)* |
| **Conexiones seguras / SSL** | ✗ | **cero slides** |

De los siete puntos anunciados, **tres no aparecen**. El `DROP USER` que falta es lo que se necesitaría
para razonar el ej. **2.j** del TP8 al revés *(qué pasa con un rol cuando se elimina el usuario)*.

## Slide 8 · Administración de usuarios — `ROOT`

> [!quote] Textual
> - *"Un usuario MySQL se define en términos de un nombre de usuario y una contraseña/password"*
> - *"Por defecto, el motor de base de datos crea un usuario con permisos para todas las tablas de la
> base de datos"*
> - *"El superusuario se denomina ROOT"*
> - *"Se recomienda limitar el uso de ROOT a la gestión del DBMS y no usarlo en aplicaciones de
> producción"*

> [!warning] La primera viñeta **contradice el slide siguiente**, y el siguiente tiene razón
> En MySQL una cuenta se define por **nombre de usuario y host**, `'usuario'@'host'`, como explica el
> propio slide 9 *("Seguido al nombre de usuario, se debe especificar la IP desde donde podrá
> realizar conexiones")*. La contraseña es un atributo de la cuenta, no parte de su identidad:
> `'juan'@'localhost'` y `'juan'@'%'` son dos cuentas aunque compartan contraseña. Registrado en
> § *Contradicciones internas*.

La práctica conecta a los TPs con **`myuser`** *(`mysql -u myuser -p`, la cuenta que el `docker run`
crea con `ALL` sobre `mydb`)*, no con `root`: [[MySQL]] § *Setup*. `root` aparece en el mismo `docker
run` *(`MYSQL_ROOT_PASSWORD=root`)* y es la sesión de administrador del TP8, la primera práctica
donde hay que **crear otros usuarios** y probar qué ve cada uno *([[Práctica 2026-09-08]])*. Y un dato
que el deck no da: `root` **no es un rol ni un privilegio**, es una cuenta común —`'root'@'localhost'`—
que viene con `ALL PRIVILEGES ON *.* WITH GRANT OPTION`.

## Slide 9 · `CREATE USER` y el *host*

> [!quote] Textual
> - ***CREATE USER** 'nombre_usuario'@'host' **IDENTIFIED BY** ‘tu_contrasena';* **[sic: abre con
> comilla tipográfica `‘` y cierra con recta `'`]**
> - *"Seguido al nombre de usuario, se debe especificar la IP desde donde podrá realizar conexiones
> a la base de datos el usuario creado. Puede ser:"*
> - *"'localhost' o '127.0.0.1', desde la misma PC en la que se encuentre instalado MySQL, es decir
> el host local"*
> - *"'192.168.1.100', sólo permite conexiones desde dicha IP (utilizada para identificar a un PC
> en un LAN)"*
> - *"'%' es un comodín que permite conexiones desde cualquier IP"*

**Transcripción limpia, ejecutable en MySQL:**

```sql
CREATE USER 'nombre_usuario'@'host' IDENTIFIED BY 'tu_contrasena';
```

| `host` | Quién puede conectarse | Nota |
| --- | --- | --- |
| `'localhost'` | sólo desde la máquina del servidor, **por socket Unix** | |
| `'127.0.0.1'` | sólo desde la máquina del servidor, **por TCP** | el deck los presenta como sinónimos; **son dos cuentas distintas** para MySQL |
| `'192.168.1.100'` | sólo desde esa IP | |
| `'%'` | desde cualquier host | es lo que hace falta para entrar al **contenedor Docker** desde el host |

> [!important] (crítico) Para la cursada, el *host* que importa es `'%'`, y el deck no lo dice
> El MySQL de los TPs corre en **Docker** *([[MySQL]] § *Setup*)*. Un cliente que se conecta desde la
> máquina anfitriona **no es `localhost`** para el servidor: llega por la red del contenedor con una IP
> interna. Un usuario creado como `'u'@'localhost'` según el slide **no va a poder conectarse desde
> fuera del contenedor**. Para probar el TP8 con varios usuarios, hay que crearlos con `'%'` —o entrar
> con `docker exec` al contenedor y conectarse desde adentro—. Es lo primero a tener en cuenta en el
> ejercicio 2.

> [!note] `'localhost'` ≠ `'127.0.0.1'`, aunque el slide los junte con una "o"
> `localhost` se resuelve al **socket Unix** y `127.0.0.1` a **TCP sobre loopback**; el servidor busca
> la cuenta que **coincide con el host desde el que llega la conexión**. Si sólo existe
> `'u'@'localhost'` y el cliente se conecta con `-h 127.0.0.1`, la autenticación **falla**. Muerde en
> Docker justamente porque ahí se entra por TCP.

**Sin `IDENTIFIED BY`** la cuenta se crea **sin contraseña**: el deck no lo dice y es un agujero
clásico. Y **no hay `ALTER USER`** en el deck para cambiar una contraseña después.

## Slide 10 · `GRANT` y los tipos de permisos

> [!quote] Textual
> ***GRANT** [**permiso**] **ON** [nombre de bases de datos]. [nombre de tabla] **TO**
> ‘[**usuarioX**]’@'host’ [**WITH GRANT OPTION**];*
> *(`permiso` en rojo · `WITH GRANT OPTION` en verde · comillas mezcladas `‘ ’ '` **[sic]**)*
>
> ***Tipos de Permisos***
> - ***ALL** : esta opción otorga todos los permisos*
> - ***CREATE**: permite crear nuevas tablas o bases de datos*
> - ***DROP**: permite eliminar tablas o bases de datos*
> - ***DELETE**: permite eliminar registros de tablas*
> - ***INSERT**: permite insertar registros en tablas*
> - ***SELECT**: permite leer registros en las tablas*
> - ***UPDATE**: permite actualizar registros seleccionados en tablas*
> - ***WITH GRANT OPTION**: permite que **usuarioX** maneje privilegios de otros usuarios*

**Transcripción limpia:**

```sql
GRANT permiso ON base.tabla TO 'usuarioX'@'host' [WITH GRANT OPTION];
```

> [!warning] Tres imprecisiones en el mismo slide
> 1. **`WITH GRANT OPTION` no es un "tipo de permiso"**: es una **cláusula** del `GRANT` que da al
> receptor el derecho de **volver a conceder** los privilegios que recibió. Y la glosa *"maneje
> privilegios de otros usuarios"* es engañosa: `usuarioX` puede **conceder los suyos** a otros *(y
> revocar lo que él mismo concedió)*, no manejar los ajenos.
> 2. **La lista está incompleta, y lo que falta es lo que el TP7 necesitaba.** MySQL tiene, entre
> otros, `ALTER`, `INDEX`, `REFERENCES`, `CREATE VIEW`, `SHOW VIEW`, `TRIGGER`, `EXECUTE`,
> `CREATE ROUTINE`, `ALTER ROUTINE`, `EVENT`, `USAGE`. Con los siete del slide **no se puede crear
> un trigger ni ejecutar un stored procedure**: no alcanzan para nada de lo que hizo la
> [[Práctica 2026-09-01]].
> 3. **El nivel de granularidad es uno solo —`base.tabla`— y hay cuatro.** `ON *.*` *(global)*,
> `ON base.*` *(base)*, `ON base.tabla` *(tabla)* y **`GRANT SELECT (col1, col2) ON base.tabla`**
> *(columna)*. El slide 13 usa `midb.*` sin haber explicado la forma; **la de columna no aparece en
> ningún slide y el TP8 la usa en el ej. 1** *(`GRANT UPDATE(tiempo,diccion) ON parrafo`)* y la pide
> en el **2.g** *("actualizar datos en el campo horas_aportadas")*.

### Los mismos permisos, contra el estándar y contra GMUW

| Del slide | En SQL estándar / GMUW 10.1.1 | Comentario |
| --- | --- | --- |
| `SELECT`, `INSERT`, `DELETE`, `UPDATE` | los cuatro, **con lista de atributos opcional** en `SELECT`, `INSERT` y `UPDATE` | GMUW 10.1.1 *Privileges* (impresa 426): nueve privilegios, y tres de ellos admiten columnas |
| `CREATE`, `DROP` | no son privilegios del estándar sobre una relación: en GMUW el **owner** puede todo | en MySQL son privilegios de base o globales |
| `ALL` | `ALL PRIVILEGES` | idéntico |
| `WITH GRANT OPTION` | `WITH GRANT OPTION` | idéntico — GMUW 10.1.4 *Granting Privileges* (430) |
| — | `REFERENCES`, `USAGE`, `TRIGGER`, `EXECUTE`, `UNDER` | los que el slide omite; GMUW los lista |

> [!tip] El modelo de GMUW que el deck no da y el TP8 sí pide
> GMUW **10.1.4** define lo que un `GRANT` hace en términos de un **grafo**: cada nodo es *(usuario,
> privilegio, con o sin opción de concesión)* y cada `GRANT` agrega una arista. **10.1.5** *Grant
> Diagrams* *(431)* lo dibuja, y **10.1.6** *Revoking Privileges* *(433)* explica qué se borra con
> `REVOKE … CASCADE` y por qué `RESTRICT` puede fallar. **Los tres ejercicios del TP8 son ese grafo.**
> Es la lectura mínima de la semana, antes que el deck.

## Slide 11 · Roles

> [!quote] Textual, completo — seis sentencias sueltas, sin una línea de prosa
> - *CREATE USER 'dev1'@'localhost' IDENTIFIED BY 'dev1pass';*
> - *CREATE ROLE 'app_developer‘;* **[sic: cierra con `‘`]**
> - *DROP ROLE 'app_developer‘;* **[sic]**
> - *GRANT 'app_developer' TO 'dev1'@'localhost';*
> - *SHOW GRANTS FOR 'dev1'@'localhost' USING 'app_developer';*
> - *GRANT SELECT ON T1 to ‘app_developer’;* **[sic: `to` en minúscula, comillas mezcladas]**

Único slide sobre roles: no define qué es un rol y **las seis sentencias, leídas de arriba abajo, no
forman una secuencia ejecutable** —la tercera **borra** el rol que la segunda creó, y la cuarta se lo
concede a `dev1` cuando ya no existe—. Son comandos de referencia, no un guion.

### Lo mismo, en el orden en que sí corre

```sql
CREATE ROLE 'app_developer';
GRANT SELECT ON midb.T1 TO 'app_developer';  -- el rol acumula privilegios
CREATE USER 'dev1'@'localhost' IDENTIFIED BY 'dev1pass';
GRANT 'app_developer' TO 'dev1'@'localhost';  -- el usuario recibe el rol
SET DEFAULT ROLE 'app_developer' TO 'dev1'@'localhost';  -- ← lo que el deck NO dice
SHOW GRANTS FOR 'dev1'@'localhost' USING 'app_developer';
-- …y al final, si hace falta:
DROP ROLE 'app_developer';
```

> [!important] (crítico) Lo que falta es lo que hace que los roles **no funcionen** la primera vez
> En MySQL, **conceder un rol no lo activa**. Un usuario con `GRANT 'app_developer' TO 'dev1'` sigue
> **sin los privilegios del rol** hasta que el rol esté **activo en su sesión**, por una de tres vías:
> `SET DEFAULT ROLE … TO usuario` *(para futuras sesiones)*, `SET ROLE …` *(en la sesión actual)* o
> la variable de sistema `activate_all_roles_on_login = ON`. **El deck no menciona ninguna.** Quien
> arme el ej. **2.h** del TP8 siguiendo el slide va a ver que `U4` no puede hacer nada y va a pensar
> que el `GRANT` falló. Verificable en el manual 9.7, cap. 8, § *Using Roles*, de donde salen las seis
> sentencias: `dev1`, `dev1pass` y `app_developer` son los nombres del ejemplo oficial.

> [!note] Otras tres cosas que el slide deja sin decir
> - **Roles existen desde MySQL 8.0.** La cursada corre 9.7, así que no hay problema. El TP8 ej. 2.j
> *("Eliminar el rol ins_prov ¿qué sucede con los usuarios U3 y U4?")* se responde con el manual: al
> hacer `DROP ROLE`, **el rol se retira de todas las cuentas que lo tenían**, y esas cuentas pierden
> sus privilegios *(en las sesiones nuevas; las abiertas lo conservan hasta que terminan)*.
> - **`SHOW GRANTS … USING rol`** muestra los privilegios que el usuario tendría **si ese rol
> estuviera activo**: la herramienta para responder el TP8 sin adivinar.
> - **`GRANT SELECT ON T1`** sin base sólo corre si hay una base seleccionada con `USE`.
>
> Sobre el concepto: un rol es **un conjunto nombrado de privilegios**, que se concede a usuarios como
> si fuera un privilegio más. Es el *"grupo de usuarios"* del slide 5 y lo que el [[_cronograma]]
> llama *"matriz de roles y permisos"*: la matriz sería la tabla `rol × privilegio`, que **el deck
> nunca dibuja**. **Date 17.2** *Discretionary Access Control* *(impresa 506)* es la versión conceptual.

## Slide 12 · `REVOKE` y `FLUSH PRIVILEGES`

> [!quote] Textual
> - ***REVOKE** [permisos] **ON** [nombre de base de datos] [nombre de tabla] **FROM** ‘[nombre de
> usuario]’ @‘host’;* **[sic: falta el `.` entre base y tabla; comillas tipográficas]**
> *"Una vez que se haya finalizado con la configuración de privilegios (GRANT o REVOKE) se deben
> refrescar todos los con el comando:"* **[sic: falta una palabra — "todos los *privilegios*"]**
> - ***FLUSH PRIVILEGES;***

**Transcripción limpia:**

```sql
REVOKE permisos ON base.tabla FROM 'usuario'@'host';
```

> [!warning] (crítico) `FLUSH PRIVILEGES` después de un `GRANT` o `REVOKE` **es innecesario**, y el manual lo dice
> Las sentencias de cuentas *(`CREATE USER`, `GRANT`, `REVOKE`, `SET PASSWORD`…)* **actualizan las
> tablas de privilegios en memoria de inmediato**. `FLUSH PRIVILEGES` hace falta **sólo** cuando
> alguien modificó las tablas del sistema `mysql.user`, `mysql.db`, etc. **a mano con `INSERT` /
> `UPDATE` / `DELETE`**. Es una instrucción heredada de tutoriales viejos que no rompe nada pero
> enseña una causalidad falsa. Verificable en el manual 9.7, cap. 8, § *When Privilege Changes Take
> Effect*. Registrado en § *Contradicciones internas* como contradicción con el manual.

> [!important] (crítico) Lo que el slide no trae es lo que hace difícil el TP8: **`REVOKE` no cascadea en MySQL**
> El TP8 lo dice con todas las letras *(ej. 1.b)*: *"Resuelva el ejercicio desde la teoría, ya que
> **MySQL no provee la opción CASCADE**"*. En el estándar y en GMUW **10.1.6**, `REVOKE … CASCADE`
> quita el privilegio **y todo lo que se concedió a partir de él**; `RESTRICT` **rechaza** la
> revocación si eso dejaría privilegios huérfanos. **MySQL no tiene ninguna de las dos**: revocar a
> `adm` **no toca** lo que `adm` ya concedió a `doc`. Ésa es la brecha que el TP8 pide razonar en
> papel, y es la **tercera vez** —en el tercer TP consecutivo— que la cátedra reconoce por escrito un
> desfasaje con MySQL *(las dos anteriores: TP6 3.c y TP7 1.c y 2.b, [[Práctica 2026-09-01]])*.
>
> Tampoco está **`REVOKE ALL PRIVILEGES, GRANT OPTION FROM usuario`** —la forma de quitar *todo*,
> distinta del `REVOKE ALL ON midb.*` del slide 13—, ni cómo revocar **sólo** la `GRANT OPTION`
> conservando el privilegio *(`REVOKE GRANT OPTION ON … FROM …`)*.

## Slide 13 · Ejemplos de privilegios

> [!quote] Textual, completo
> - ***GRANT** ALL **ON** midb.usuarios **TO** ‘juan’@'%’ **WITH GRANT OPTION**;*
> - ***GRANT** ALL **ON** midb.\* **TO** ‘admin’@'%’;*
> - ***GRANT** SELECT **ON** midb.log **TO** ‘auditor’@'192.168.1.100’;*
> - ***REVOKE** ALL **ON** midb.\* **FROM** ‘admin’@'%’;*
> - ***FLUSH PRIVILEGES;***
>
> *(En las cuatro, el nombre de usuario va entre comillas tipográficas `‘ ’`, y el host abre con
> recta `'` y cierra con tipográfica `’` **[sic]**.)*

El mejor slide del bloque: **tres granularidades distintas en tres líneas**, cada una con un *host*
distinto.

| Sentencia | Granularidad | Host | Lo que enseña |
| --- | --- | --- | --- |
| `GRANT ALL ON midb.usuarios TO 'juan'@'%' WITH GRANT OPTION` | **tabla** | cualquiera | `juan` puede todo sobre **una tabla** y puede **pasarlo** |
| `GRANT ALL ON midb.* TO 'admin'@'%'` | **base** | cualquiera | `admin` puede todo sobre **la base**, pero **sin** opción de concesión |
| `GRANT SELECT ON midb.log TO 'auditor'@'192.168.1.100'` | tabla, un privilegio | **una IP** | el patrón *auditor*: sólo lectura, sólo desde un puesto |
| `REVOKE ALL ON midb.* FROM 'admin'@'%'` | base | cualquiera | deshace exactamente el segundo `GRANT` |

> [!tip] El `auditor` del tercer ejemplo es el caso de uso que enlaza con el TP7
> El ej. 1 del TP7 creó una tabla de auditoría `HIS_ENTREGA` con triggers *([[Práctica 2026-09-01]]
> § *Ejercicio 1*)*. Este slide muestra **la otra mitad del patrón**: la tabla de log se llena por
> trigger y **se lee con un usuario que sólo tiene `SELECT` sobre ella**, desde una máquina fija.

> [!note] Dos matices que el ejemplo esconde
> - `GRANT ALL ON midb.*` **no incluye la `GRANT OPTION`** —hay que pedirla explícitamente— ni los
> privilegios **globales** *(crear usuarios, `FILE`, `SUPER`…)*: *"todo sobre `midb`"* no es *"todo"*.
> - El `REVOKE ALL ON midb.*` **no revoca lo que se concedió con otra granularidad**: si `admin`
> tuviera además un `GRANT SELECT ON midb.log`, ese sobreviviría. Los privilegios se guardan y se
> revocan **por nivel** *(global, base, tabla, columna)*. El TP8 ej. 2.e/f puede necesitarlo.

**Balance del bloque de seguridad: 12 slides, 5 de marco conceptual y 7 de sintaxis MySQL de un solo
escenario —un usuario, una tabla—. El modelo de propagación y revocación de privilegios entre
usuarios, que es lo que el TP8 evalúa, no está.**

---

## Slide 14 · Transacciones — conceptos

> [!quote] Textual
> - *"Una transacción es un mecanismo para definir las **unidades lógicas del procesamiento** de una
> base de datos"*
> - *"Una transacción se inicia por la ejecución de un programa escrito en un lenguaje en un lenguaje
> de programación"* **[sic: "en un lenguaje" repetido]**
> - *"Una transacción está delimitada por instrucciones de la forma *inicio transacción* y *fin
> transacción*"*

El adorno —varios clientes contra un mismo servidor— es la situación que motiva la concurrencia de los
slides 21–28. **La definición útil es la primera**: una transacción es la **unidad lógica de trabajo**, el conjunto
de operaciones que **o pasa entero o no pasa**. El ejemplo canónico de toda la bibliografía es la
transferencia bancaria, que el deck **no da** en ningún slide; Silberschatz cap. 1 § 1.7 *(ficha,
impresa 10)* lo usa para definir atomicidad, consistencia y durabilidad, y GMUW **6.6.3**
*Transactions* *(impresa 299)* lo formaliza.

> [!note] *"inicio transacción y fin transacción"* — el deck nunca dice cómo se escriben en MySQL
> En MySQL: **`START TRANSACTION;`** *(o `BEGIN;`)* … **`COMMIT;`** / **`ROLLBACK;`**. MySQL arranca
> con **`autocommit = 1`**, así que **cada sentencia suelta es una transacción** que se confirma sola;
> `START TRANSACTION` suspende eso hasta el `COMMIT`. Además, **el DDL hace *commit* implícito**
> *([[MySQL]] § *Lo que es propio de MySQL*)* y **todo esto requiere InnoDB**: una tabla MyISAM no
> participa de transacciones. El único `BEGIN … COMMIT` del deck es de otros motores *(slides 29–30)*.

## Slide 15 · Fallos

> [!quote] Textual — seis viñetas, sin desarrollo
> - *"Fallo de la computadora (caída del sistema)"*
> - *"Un error de la transacción o del sistema"*
> - *"Errores locales o condiciones de excepción detectados por la transacción"*
> - *"Control de la concurrencia"*
> - *"Fallo del disco rígido"*
> - *"Problemas físicos y catástrofes"*

Es la lista de tipos de fallo de Elmasri y Navathe, sin explicar por qué se lista. El sentido: el
slide 14 dijo "todo o nada", y este enumera **todas las formas en que una transacción puede quedar a
medias**, es decir, todo lo que el motor tiene que poder deshacer o rehacer. Es la motivación del
*log* y de la recuperación, temas que el deck **no toca** *(GMUW cap. **17** *Coping With System
Failures*, en particular **17.1.1** *Failure Modes*, impresa 844, con la misma taxonomía)*.

| Fallo del slide | De quién es la culpa | Qué lo cubre |
| --- | --- | --- |
| Caída del sistema | hardware/SO | recuperación por log — **durabilidad** *(slide 17)* |
| Error de la transacción o del sistema | el programa *(división por cero, overflow)* | `ROLLBACK` — **atomicidad** *(16)* |
| Errores locales / excepciones | la lógica de negocio *(saldo insuficiente)* | `ROLLBACK` explícito |
| **Control de la concurrencia** | otra transacción | el *scheduler* aborta una para resolver un conflicto o un **deadlock** — **aislamiento** *(17, 25–28)* |
| Fallo del disco | medio físico | *backup* + log — GMUW **17.5** *Protecting Against Media Failures* |
| Catástrofes | el mundo | réplicas remotas — terreno de la segunda mitad |

> [!tip] El cuarto ítem es el más raro de la lista, y el más importante para este deck
> *"Control de la concurrencia"* como **causa de fallo** es exacto: cuando dos transacciones se traban
> entre sí *(deadlock)* o una viola la serializabilidad, **el motor mata una de las dos** —en InnoDB,
> la que hizo menos trabajo— y la aplicación recibe un error. Es la única causa de fallo **provocada
> por el propio DBMS**, y el deck **no menciona los deadlocks** en ningún slide *(GMUW **19.2**
> *Deadlocks*, impresa 966; Date **16.5**)*.

## Slides 16–17 · ACID

> [!quote] Slide 16 — *"ACID (AC--)"*, textual
> **Atomicidad**
> - *"Requiere que cada transacción sea "todo o nada": si una parte de la transacción falla, todas
> las operaciones de la transacción fallan, y por lo tanto la base de datos no sufre cambios"*
>
> **Consistencia**
> - *"Asegura que cualquier transacción llevará a la base de datos de un estado válido a otro estado
> válido. Cualquier dato que se escriba en la base de datos tiene que ser válido de acuerdo a
> todas las reglas definidas"*

> [!quote] Slide 17 — *"ACID (--ID)"*, textual
> **Aislamiento**
> - *"Asegura que la ejecución concurrente de las transacciones resulte en un estado del sistema que
> se obtendría si estas transacciones fueran ejecutadas una detrás de otra"*
>
> **Durabilidad**
> - *"Significa que una vez que se confirmó una transacción quedará persistida, incluso ante eventos
> como pérdida de alimentación eléctrica, errores y caídas del sistema"*

### Las cuatro, en una tabla con lo que cada una implica

| Propiedad | Definición del deck, en una línea | Quién la garantiza | Qué la rompe | Dónde sigue en el deck |
| --- | --- | --- | --- | --- |
| **A**tomicidad | todo o nada | el motor, con `ROLLBACK` y el log de *undo* | un fallo a mitad de camino *(slide 15)* | estados *(18, 20)*, `ROLLBACK` *(19)* |
| **C**onsistencia | de un estado válido a otro válido, *"de acuerdo a todas las reglas definidas"* | **el programador y las restricciones** | una transacción mal escrita | — *(son los decks **09–10**)* |
| **I**solation | como si fueran una detrás de otra | el control de concurrencia | las anomalías de 23–24 | **21–30**, todo el resto del bloque |
| **D**urabilidad | confirmado = persistido, aun sin luz | el motor, con el log de *redo* y `fsync` | una caída **antes** del `COMMIT` no la rompe: no había nada que durar | — |

> [!important] (clave) Tres puntos que el deck no dice y el parcial puede pedir
> 1. **La consistencia es la única de las cuatro que no la garantiza el motor.** Las *"reglas
> definidas"* son las **restricciones de integridad** de la
> [[Clase 09 - Restricciones integridad-Parte 1]] y los **triggers** del deck 10. El motor garantiza
> que si cada transacción *por separado* respeta las reglas, la ejecución concurrente también
> *(eso es aislamiento)*. Silberschatz cap. 1 § 1.7 lo reparte igual *(ficha: "el programador define
> transacciones consistentes; el gestor de transacciones asegura atomicidad y durabilidad")*.
> 2. **La definición de aislamiento del slide 17 es la de serializabilidad**: el deck define la I como
> el nivel `SERIALIZABLE` del slide 28, y los otros tres niveles son **grados de violación de la I**.
> GMUW **6.6.1** *Serializability* *(impresa 296)* abre el tema exactamente así.
> 3. **ACID es lo que la segunda mitad va a negociar.** Corbellini **§ 3.2** *ACID and BASE
> properties* *(pp. 5–7)*: BASE *(Basically Available, Soft state, Eventually consistent)* es "qué se
> cede de ACID para ganar disponibilidad y partición". Date **16.10** se titula ***Dropping ACID***
> *(impresa 485)*.
>
> Silberschatz cap. 1 —el único de ese libro en el vault— **no define la I**: § 1.7 define A, C y D
> sobre la transferencia de fondos y *"nunca dice «aislamiento» en sentido transaccional"*. Para la I
> hay que ir a **GMUW 6.6** o a **Date 16**.

## Slide 18 · Estados de una transacción

> [!quote] Textual
> - ***Activa**, la transacción permanece en este estado durante su ejecución*
> - ***Parcialmente confirmada**, después de ejecutarse la última instrucción*
> - ***Fallida**, tras descubrir que no puede continuar la ejecución normal*
> - ***Abortada**, después de haber retrocedido la transacción y restablecido la base de datos a su
> estado anterior al comienzo de la transacción*
> - ***Confirmada**, tras completarse con éxito*

Cinco estados, en el vocabulario de la traducción de Silberschatz. El que confunde es *"parcialmente
confirmada"*: la última instrucción **ya se ejecutó** pero el motor **todavía no garantizó la
durabilidad** —los cambios están en memoria y el log no está en disco—. Desde ahí se va a
*confirmada* *(el log llegó a disco)* o a *fallida* *(se cayó el sistema antes)*.

| Estado | Cuándo se entra | De dónde se viene | A dónde se va |
| --- | --- | --- | --- |
| **Activa** | `START TRANSACTION` | — | parcialmente confirmada · fallida |
| **Parcialmente confirmada** | última instrucción ejecutada | activa | confirmada · fallida |
| **Fallida** | no puede seguir | activa · parcialmente confirmada | abortada |
| **Abortada** | `ROLLBACK` terminado, BD restaurada | fallida | *(fin; puede reiniciarse)* |
| **Confirmada** | `COMMIT` durable | parcialmente confirmada | *(fin)* |

(crítico) Esta lista **no coincide con el diagrama del slide 20**: *"Abortada"* no está en el diagrama
y *"Terminar"* no está en la lista. Detalle en § *Slide 20*.

## Slide 19 · Operaciones

> [!quote] Textual
> - ***INICIO DE TRANSACION.** Marca el inicio de la ejecución de una transacción* **[sic: sin la
> segunda C, dos veces en el slide]**
> - ***LEER o ESCRIBIR.** Especifican operaciones de lectura o escritura en los elementos de la base
> de datos que se ejecutan como parte de una transacción*
> - ***FIN DE LA TRANSACION.** Especifica que las operaciones LEER y ESCRIBIR de la transacción han
> terminado y marca el final de la ejecución de la transacción. En este punto se comprueba si los
> cambios introducidos pueden confirmarse* **[sic]**
> - ***CONFIRMAR (Commit).** Señala una finalización satisfactoria de la transacción, por lo que los
> cambios (actualizaciones) ejecutados se pueden enviar con seguridad a la base de datos*
> - ***ABORTAR (Rollback).** Señala que la transacción no ha terminado satisfactoriamente, por lo que
> deben deshacerse los cambios*

Son las **cinco primitivas** con las que el slide 20 etiqueta las aristas del diagrama. La distinción
fina: **`FIN DE LA TRANSACCIÓN` no es `COMMIT`**; el fin marca que el programa terminó de emitir
operaciones, y recién después viene el *commit* o el *rollback*. Es lo que separa *"activa"* de
*"parcialmente confirmada"* en el slide 18. En GMUW **17.1.4** *The Primitive Operations of
Transactions* *(impresa 848)* las primitivas son más finas —**`INPUT`** *(disco → buffer)*, **`READ`**
y **`WRITE`** *(buffer ↔ variable local)* y **`OUTPUT`** *(buffer → disco)*—, y lo que el deck omite
es que escribir **no** significa que llegó al disco: ésa es la razón del estado "parcialmente
confirmada".

### Las cinco operaciones, en MySQL

| Del slide | En MySQL | Nota |
| --- | --- | --- |
| INICIO DE TRANSACCIÓN | `START TRANSACTION;` o `BEGIN;` | con `autocommit=1`, sin esto cada sentencia es su propia transacción |
| LEER / ESCRIBIR | `SELECT` / `INSERT`, `UPDATE`, `DELETE` | sólo sobre tablas **InnoDB** |
| FIN DE LA TRANSACCIÓN | *(implícito)* | no hay sentencia: es el instante antes del `COMMIT` |
| CONFIRMAR | `COMMIT;` | también implícito ante cualquier DDL |
| ABORTAR | `ROLLBACK;` | y `SAVEPOINT` / `ROLLBACK TO SAVEPOINT` para deshacer parcialmente *(Date **15.7** *Savepoints*)* |

## Slide 20 · Diagrama de transición de estados

> [!quote] El único diagrama con contenido del deck — imagen escaneada, en blanco y negro
> *"Transacciones en Base de Datos · Diagrama de Transición de Estados"*

Transcripción del diagrama *(la capa de texto lo perdió por completo; sólo se ve en el PNG)*:

```
  Leer, Escribir
  ┌──┐
  ↓  │
Inicio de  ┌──────┐  Fin de la  ┌──────────────────────┐  Confirmar  ┌────────────┐
transacción ───────→ │Activa│ ───────────────→ │Parcialmente confirmada│ ─────────→ │ Confirmada │
  └──────┘  transacción  └──────────────────────┘  └────────────┘
  │  │  │
  │ Abortar  │ Abortar  │
  │  ↓  ↓
  │  ┌───────┐  ┌──────────┐
  └──────────────────────────→ │ Fallo │ ─────────────────────→│ Terminar │
  └───────┘  └──────────┘
```

Cinco nodos y ocho aristas *(siete transiciones más la flecha de entrada; las dos que llegan a
Terminar van sin etiqueta)*. Las etiquetas son **exactamente las cinco operaciones del slide 19**, y
"Leer, Escribir" es un **bucle** sobre *Activa*.

> [!bug] (crítico) El diagrama y la lista del slide 18 son de dos libros distintos, y no cierran entre sí
> | Slide 18 *(lista)* | Slide 20 *(diagrama)* | ¿Coinciden? |
> | --- | --- | :---: |
> | Activa | Activa | ✓ |
> | Parcialmente confirmada | Parcialmente confirmada | ✓ |
> | Confirmada | Confirmada | ✓ |
> | **Fallida** | **Fallo** | (atención) mismo estado, otro nombre |
> | **Abortada** | — | ✗ **no está en el diagrama** |
> | — | **Terminar** | ✗ **no está en la lista** |
>
> El diagrama es la figura de Elmasri y Navathe *(active · partially committed · committed · failed ·
> terminated)*; la lista es la de Silberschatz *(active · partially committed · failed · aborted ·
> committed)*. En Elmasri, *"terminated"* es el estado final común de confirmadas y fallidas; en
> Silberschatz, *"aborted"* es el estado al que llega una fallida **después** del rollback. Para el
> parcial: **aprender uno completo**, y saber que *"Abortada"* ≈ el tramo *Fallo → Terminar*.
>
> Lo que el diagrama sí muestra mejor que la lista: que se puede **abortar desde dos lugares**, desde
> *Activa* y desde *Parcialmente confirmada* *(ya se ejecutó todo, pero el motor no logró hacerlo
> durable)*. Esa segunda arista es la razón de ser del estado intermedio.

## Slides 21–22 · Concurrencia — el problema y sus ventajas

> [!quote] Slide 21, textual
> - ***Enfoque de ejecución secuencial** de transacciones es más sencillo de implementar, pero menos
> eficiente. Para comenzar una transacción es necesario finalizar la anterior*
> - ***Enfoque de ejecución concurrente** permite varias transacciones que actualizan
> concurrentemente los datos y puede provocar complicaciones en la consistencia de los mismos*
>
> *El **esquema de control de concurrencia** de un DBMS controla la interacción entre las
> transacciones concurrentes para evitar que se destruya la consistencia de la base de datos*
> *(esta última frase va sin viñeta, como conclusión)*

> [!quote] Slide 22, textual
> - ***Productividad y utilización de recursos mejorados***
> - *"El número de transacciones que puede ejecutar en un tiempo dado aumenta cuando varias
> transacciones se ejecutan en paralelo. Por ej., las operaciones de E/S, como uso de CPU y
> discos pueden trabajar en paralelo en una computadora"*
> - ***Tiempo de espera reducido***
> - *"Frente a transacciones cortas y largas, la ejecución concurrente reduce los retardos
> impredecibles en la ejecución de las transacciones"*
> - *"Se reduce también el tiempo medio de respuesta"*

El planteo: **secuencial** es trivialmente correcto y lento; **concurrente** es rápido y peligroso; el
**control de concurrencia** permite tener lo segundo con la corrección de lo primero, y el criterio de
corrección es la definición de aislamiento del slide 17. Las dos ventajas son las de un SO
multiprogramado: **throughput** *(mientras una transacción espera al disco, otra usa la CPU)* y
**latencia** *(una corta no espera a una larga)*.

> [!note] El vocabulario preciso, que el deck no usa
> - Una ejecución secuencial es un ***schedule* serial**; una concurrente que da el mismo resultado
> que alguna serial es un ***schedule* serializable**. GMUW **18.1** *Serial and Serializable
> Schedules* *(impresa 884)* y Date **16.6** *Serializability* *(476)*.
> - El "esquema de control de concurrencia" es el ***scheduler*** de GMUW **18.3.2**: el módulo que
> decide, operación por operación, si dejarla pasar, demorarla o abortar la transacción.
> Silberschatz cap. 1 lo llama *"gestor de control de concurrencia"* *(ficha § 1.7)*.

## Slides 23–24 · Problemas de concurrencia — las cuatro anomalías

> [!quote] Slide 23, textual
> *"Debido a la ejecución simultánea de transacciones, pueden surgir problemas como:"*
> - ***Race conditions**: Situación donde el resultado de las transacciones depende del orden de
> ejecución. Por ejemplo, dos transacciones intentando actualizar el mismo saldo de cuenta
> simultáneamente.*
> - ***Dirty Read:** Ocurre cuando una transacción lee datos modificados por otra transacción que aún
> no ha sido confirmada. Si la segunda transacción se deshace, los datos leídos son inválidos. Por
> ejemplo, un cliente ve un saldo de cuenta que se actualizó pero luego se revertió, dejando al
> cliente con información incorrecta.*

> [!quote] Slide 24, textual
> - ***Non-repeatable Read:** Se produce cuando una transacción lee un dato y luego otra transacción
> modifica ese dato antes de que la primera transacción se complete. Esto significa que si la
> primera transacción lee el mismo dato de nuevo, obtendrá un valor diferente. Por ejemplo, una
> transacción que lee un precio de producto, y otra transacción cambia el precio antes de que la
> primera confirme su operación.*
> - ***Phantom Read:** Sucede cuando una transacción lee un conjunto de datos y otra transacción
> inserta o elimina datos en ese conjunto antes de que la primera transacción termine. Esto resulta
> en un conjunto de datos que cambia durante la transacción. Por ejemplo, una transacción que
> cuenta el número de registros que cumplen ciertos criterios, mientras que otra transacción
> inserta nuevos registros que también cumplen esos criterios.*

Es el catálogo de lo que puede salir mal, y lo que hace inteligible el slide 28: cada nivel de
aislamiento se define por **cuáles de estas anomalías tolera**.

### Las cuatro, con la traza mínima que las produce

| Anomalía | T1 | T2 | Lo que ve T1 | Nombre del estándar |
| --- | --- | --- | --- | --- |
| **Race condition** *(lost update)* | lee saldo=100 · escribe 100−10 | lee saldo=100 · escribe 100−20 | una de las dos escrituras **se pierde**: queda 90 u 80, nunca 70 | *lost update* — Date **16.2** lo llama así; el estándar SQL-92 **no lo lista** |
| **Dirty read** | — | escribe saldo=200 *(sin commit)* | lee 200 → T2 hace `ROLLBACK` → T1 usó un valor **que nunca existió** | P1 *dirty read* |
| **Non-repeatable read** | lee precio=10 | escribe precio=12 · commit | vuelve a leer: 12 — **el mismo `SELECT` devuelve otra cosa** | P2 *non-repeatable read* |
| **Phantom read** | `COUNT(*) WHERE x>5` → 3 | `INSERT` una fila con x=7 · commit | vuelve a contar: 4 — **el mismo conjunto tiene una fila nueva** | P3 *phantom* |

> [!warning] *"Race conditions"* no es el nombre técnico, y el deck lo pone primero
> El estándar SQL-92 —y GMUW **6.6.5**, **6.6.6**, y Date **16.2** *Three Concurrency Problems*—
> hablan de **lost update**, **dirty read** *(uncommitted dependency)* y **non-repeatable read**
> *(inconsistent analysis)*, más el **phantom**. *"Race condition"* es vocabulario de sistemas
> operativos: describe la **causa** *(el resultado depende del orden)*, no una anomalía. El ejemplo
> del slide —*"dos transacciones intentando actualizar el mismo saldo"*— es exactamente el **lost
> update**. Vale saber los dos nombres: el del deck para el parcial, el del estándar para la
> bibliografía.

> [!note] La diferencia entre *non-repeatable* y *phantom* es **fila vs. conjunto**, y el deck la da bien
> *Non-repeatable*: **una fila que ya leí cambió** *(`UPDATE` ajeno)*. *Phantom*: **el conjunto de
> filas que cumplen mi condición cambió** *(`INSERT`/`DELETE` ajeno)*. Se resuelven con mecanismos
> distintos: para la primera alcanza con bloquear **las filas leídas**; para la segunda hay que
> bloquear **el rango** —filas que todavía no existen—, que es lo que hace InnoDB con sus *gap locks*
> y lo que GMUW **18.6.3** *Phantoms and Handling Insertions Correctly* *(impresa 926)* explica. Por
> eso `REPEATABLE READ` del estándar evita la primera y no la segunda *(slide 28)*.

## Slide 25 · Locking — shared y exclusive

> [!quote] Textual
> *"Consiste en controlar el acceso a los datos mediante bloqueos:"*
> - ***Shared Lock:** Permite que múltiples transacciones lean un dato, pero ninguna pueda
> modificarlo hasta que se libere el bloqueo. Ej: varias transacciones pueden leer el saldo de una
> cuenta simultáneamente, pero no pueden modificarlo hasta que se libere el bloqueo.*
> - ***Exclusive Lock:** Permite que una sola transacción lea y modifique el dato. Nadie más puede
> leer ni modificar el dato hasta que se libere el bloqueo. Ej: una transacción que actualiza el
> saldo de una cuenta bloquea el dato para que otros usuarios no puedan leer ni modificarlo.*

Primero de **tres mecanismos** *(25 locking · 26 optimista · 27 timestamps)*, y el único que la
cursada va a ver en acción. Con dos modos, la regla cabe en una **matriz de compatibilidad**:

| Quiere ↓ · Hay → | **S** *(shared)* | **X** *(exclusive)* |
| --- | :---: | :---: |
| **S** | ✓ compatible | ✗ espera |
| **X** | ✗ espera | ✗ espera |

Es GMUW **18.4.1** *Shared and Exclusive Locks* y **18.4.2** *Compatibility Matrices* *(impresas
905–907)*; Date **16.3** *Locking* *(470)*.

> [!warning] (crítico) *"Nadie más puede leer"* es cierto en el modelo de dos bloqueos, y **falso en InnoDB y en PostgreSQL**
> Los dos motores que el deck usa como ejemplo —y el de la cursada— usan **multiversión (MVCC)**: un
> `SELECT` común **no pide bloqueo** y lee la **versión confirmada** más reciente *(o la del inicio de
> su transacción, según el nivel)*, así que **una fila con `X` sigue siendo legible** con su valor
> viejo. Sólo un `SELECT … FOR UPDATE` / `FOR SHARE` *(slide 30)* pide bloqueo y espera. **En MySQL,
> los lectores no bloquean a los escritores ni los escritores a los lectores.** El deck da el modelo
> de libro, el de GMUW 18.4, que en **18.8.5** *Multiversion Timestamps* *(939)* explica la
> alternativa que InnoDB usa.

> [!note] Lo que hace falta además de los dos modos, y el deck no trae
> - **Two-Phase Locking (2PL)**: que una transacción **no pida más bloqueos después de soltar uno**.
> Sin esa regla, tener bloqueos no garantiza serializabilidad. GMUW **18.3.3** *(900)*.
> - **Deadlock**: T1 tiene X sobre A y pide B; T2 tiene X sobre B y pide A. GMUW **19.2**; Date
> **16.5**. InnoDB lo detecta y aborta la transacción más chica con el error **1213**.
> - **Granularidad**: fila, página, tabla. InnoDB bloquea **filas** *(y rangos)*; una tabla MyISAM se
> bloquea entera. GMUW **18.6** *Hierarchies of Database Elements*; Date **16.9** *Intent Locking*.
> - **Update lock**: el modo intermedio que el slide 29 usa sin definir *(`UPDLOCK`)*. GMUW
> **18.4.4** *Update Locks* *(909)*.

## Slide 26 · Control de versiones (Optimistic Concurrency Control)

> [!quote] Textual
> - *"En el **control de versiones** las transacciones no utilizan bloqueos. En lugar de eso, se
> permite que las transacciones realicen cambios y, antes de confirmarlas, se verifica si los datos
> han cambiado durante la transacción."*
> - ***Ejemplo:** Una transacción que actualiza un registro debe comparar el valor del registro antes
> de la actualización con el valor actual en la base de datos. Si ha cambiado, se produce un
> conflicto y la transacción debe manejar el error.*

Segundo mecanismo: **no bloquear, y validar al final**. Apuesta a que los conflictos son raros *(por
eso "optimista")*: si lo son, se ahorra el costo de los bloqueos; si no, se pagan *rollbacks* y
reintentos. GMUW **18.9** *Concurrency Control by Validation* *(impresa 942)*; **18.9.3** *Comparison
of Three Concurrency-Control Mechanisms* *(946)* es la tabla que compara los tres slides 25–27.

> [!warning] (nota) El nombre *"control de versiones"* es desafortunado, y el deck lo usa dos veces con dos sentidos
> 1. En la bibliografía, lo que el slide describe se llama **control optimista** o **por validación**.
> *"Control de versiones"* no es un término de la literatura de transacciones: choca con **MVCC**
> *(multiversion concurrency control: mantener **varias versiones** de cada fila, lo que hacen InnoDB
> y PostgreSQL)* y con *version control* en el sentido de git.
> 2. El slide **30** se titula *"Ejemplo de **control de versiones** en PostgreSQL"* y muestra un
> `SELECT … FOR UPDATE`, que es un **bloqueo**: exactamente lo que este slide dice que el control de
> versiones no hace. Ver § *Slides 29–30* y § *Contradicciones internas*.

> [!tip] Cómo se implementa el ejemplo del slide en SQL común — el patrón de la **columna de versión**
> En la práctica no se compara el valor: se agrega una columna `version INT` y se hace
>
> ```sql
> -- T leyó la fila con version = 7
> UPDATE productos SET stock = stock - 1, version = version + 1
> WHERE id = 1 AND version = 7;
> -- si afectó 0 filas, alguien cambió la fila entre mi lectura y mi escritura: conflicto
> ```
>
> Es *optimistic locking* de aplicación, corre igual en MySQL, y **es lo que el slide 30 debería
> haber mostrado** si quería ilustrar este slide.

## Slide 27 · Timestamp Ordering

> [!quote] Textual
> - *"En el **timestamp ordering**, cada transacción recibe un sello de tiempo y los datos se ordenan
> según estos tiempos. Las transacciones se ejecutan en el orden de sus sellos de tiempo para
> evitar conflictos."*
> - ***Ejemplo**: Si dos transacciones modifican el mismo registro, la transacción con el sello de
> tiempo más bajo tiene prioridad.*

Tercer mecanismo: **decidir el orden serial de antemano** —el del sello de tiempo de inicio— y
abortar cualquier transacción cuya operación sea incompatible con ese orden. Tampoco usa bloqueos,
pero **valida operación por operación**, no al final.

> [!note] Lo que el slide simplifica, y GMUW desarrolla
> - Lo que se ordena no son los datos: cada elemento guarda **el sello de la última transacción que lo
> leyó y de la última que lo escribió** *(`RT(X)`, `WT(X)`)*, y con eso el *scheduler* detecta
> operaciones *"físicamente irrealizables"*. GMUW **18.8.1–18.8.4** *(impresas 934–937)*.
> - *"La transacción con el sello más bajo tiene prioridad"*: la consecuencia es que **la más nueva se
> aborta y reinicia con un sello nuevo**, no que espera.
> - **18.8.5** *Multiversion Timestamps* *(939)* es el puente hacia MVCC, el mecanismo real de InnoDB,
> que **no está en ninguno de los tres slides**. **18.8.6** *Timestamps Versus Locking* *(941)*:
> bloqueos cuando hay muchos conflictos, timestamps/validación cuando hay pocos y muchas lecturas.

## Slide 28 · Niveles de aislamiento

> [!quote] Textual
> *"Los **niveles de aislamiento** determinan el grado en el que una transacción debe estar aislada
> de las demás:"*
> - ***Read Uncommitted:** Permite lecturas de datos no confirmados (dirty reads). Proporciona el
> mayor rendimiento pero la menor consistencia.*
> - ***Read Committed:** Permite leer solo datos confirmados. Minimiza los dirty reads pero no evita
> las lecturas no repetibles.*
> - ***Repeatable Read:** Garantiza que si una transacción lee un dato, ese dato no cambiará durante
> la transacción. Evita lecturas no repetibles pero no previene las lecturas fantasma.*
> - ***Serializable:** Proporciona el mayor nivel de aislamiento, tratando las transacciones como si
> fueran serializadas. Esto asegura la consistencia más alta pero puede impactar en el rendimiento.*

Es el slide que une los 23–24 con el 17: cada nivel es una **lista de anomalías toleradas**, y el
último es la definición de aislamiento del slide 17.

### La tabla del estándar SQL-92, que el slide describe en prosa

| Nivel | Dirty read | Non-repeatable read | Phantom | Rendimiento |
| --- | :---: | :---: | :---: | --- |
| `READ UNCOMMITTED` | ✓ posible | ✓ posible | ✓ posible | máximo |
| `READ COMMITTED` | ✗ | ✓ posible | ✓ posible | |
| `REPEATABLE READ` | ✗ | ✗ | ✓ posible | |
| `SERIALIZABLE` | ✗ | ✗ | ✗ | mínimo |

GMUW **6.6.5** *Dirty Reads* *(302)* y **6.6.6** *Other Isolation Levels* *(304)* dan exactamente
esta tabla; Date **16.8** *Isolation Levels* *(480)* y, para los cuatro niveles tal como los define
SQL, **16.11** *SQL Facilities* *(490–491)*.

> [!warning] Dos imprecisiones de redacción, una de ellas conceptual
> - *"**Minimiza** los dirty reads"*: `READ COMMITTED` **los elimina**, por definición sólo se leen
> datos confirmados.
> - *"Garantiza que si una transacción lee un dato, ese dato **no cambiará** durante la transacción"*:
> el dato **puede cambiar** en la base *(otra transacción puede confirmar un `UPDATE`)*; lo que se
> garantiza es que **mi transacción lo va a seguir viendo igual**. Es la diferencia entre bloquear la
> fila *(el otro espera)* y darme una **versión** *(el otro escribe y yo no me entero)*, que es lo que
> hace InnoDB.

> [!important] (crítico) Lo que el deck no dice de MySQL, y es lo que más importa para la práctica
> | Dato | Valor en MySQL/InnoDB | ¿En el deck? |
> | --- | --- | :---: |
> | **Nivel por defecto** | **`REPEATABLE READ`** — no `READ COMMITTED` como en PostgreSQL, Oracle y SQL Server | ✗ |
> | Cómo se cambia | `SET [GLOBAL \| SESSION] TRANSACTION ISOLATION LEVEL …;` o `SET TRANSACTION ISOLATION LEVEL …` para la próxima transacción | ✗ |
> | Cómo se consulta | `SELECT @@transaction_isolation;` | ✗ |
> | **Phantoms en `REPEATABLE READ`** | para los `SELECT` comunes, InnoDB **sí los evita** *(lee una instantánea tomada en la primera lectura)*; para los `SELECT … FOR UPDATE` / `UPDATE` / `DELETE`, los evita con **gap locks** | ✗ — el slide dice, siguiendo el estándar, que **no** los previene |
> | `SERIALIZABLE` en InnoDB | convierte cada `SELECT` común en `SELECT … FOR SHARE`: bloquea de verdad | ✗ |
>
> El tercer renglón es la trampa: **la tabla del estándar dice que `REPEATABLE READ` admite phantoms,
> y MySQL, en su nivel por defecto, en la práctica no los muestra.** Si el parcial pregunta "según la
> teoría", la respuesta es la del slide; si pregunta "en MySQL", es la contraria. Es el mismo patrón
> del `FOR EACH STATEMENT` del TP7. **Verificar contra el manual 9.7, § *Transaction Isolation
> Levels* del capítulo de InnoDB, antes de afirmarlo en un examen.**

## Slides 29–30 · Ejemplos prácticos — en SQL Server y en PostgreSQL

> [!quote] Slide 29, textual — con coloreado de sintaxis, texto vivo
> ```sql
> -- Ejemplo de bloqueo en SQL Server
>
> BEGIN TRANSACTION;
> SELECT * FROM productos WITH (UPDLOCK);
> -- Bloqueo de actualización
>
> UPDATE productos SET stock = stock - 1 WHERE id = 1;
> COMMIT TRANSACTION;
> ```

> [!quote] Slide 30, textual
> ```sql
> -- Ejemplo de control de versiones en PostgreSQL
>
> BEGIN;
> SELECT * FROM productos FOR UPDATE; -- Bloqueo de
> actualización
>
> UPDATE productos SET stock = stock - 1 WHERE id = 1;
> COMMIT;
> ```
> *(El comentario `-- Bloqueo de actualización` está partido en dos renglones por el ancho del slide;
> el segundo renglón, `actualización`, quedaría **fuera del comentario** si se copiara tal cual.)*

**Los dos únicos slides del deck con motor ajeno son el mismo ejemplo dos veces**: abrir una
transacción, **bloquear las filas que se van a modificar** al leerlas, modificarlas, confirmar. El
patrón se llama *"leer para actualizar"* y es la forma de evitar el *lost update* del slide 23 con
**bloqueos pesimistas**.

| | SQL Server *(29)* | PostgreSQL *(30)* | **MySQL** *(no está en el deck)* |
| --- | --- | --- | --- |
| Abrir | `BEGIN TRANSACTION;` | `BEGIN;` | `START TRANSACTION;` o `BEGIN;` |
| Leer bloqueando | `SELECT … WITH (UPDLOCK)` | `SELECT … FOR UPDATE` | **`SELECT … FOR UPDATE`** — idéntico a PG |
| Modificar | `UPDATE …` | `UPDATE …` | `UPDATE …` |
| Cerrar | `COMMIT TRANSACTION;` | `COMMIT;` | `COMMIT;` |
| ¿Corre en MySQL tal cual? | ✗ `WITH (UPDLOCK)` y `… TRANSACTION` son T-SQL | ✓ **sin cambiar una letra** | — |

> [!success] (clave) Por primera vez en la U1, el código "de otro motor" **corre en MySQL sin traducción**
> El slide 30 es PostgreSQL según su rótulo y MySQL válido carácter por carácter: `BEGIN`,
> `FOR UPDATE`, `COMMIT`. Es la única pieza de código ajeno de toda la unidad que no hace falta
> reescribir, y el único ejemplo de transacción que la cursada tiene en MySQL **lo tiene por
> accidente**.

> [!bug] (crítico) El rótulo del slide 30 está mal: `FOR UPDATE` es un **bloqueo**, no *"control de versiones"*
> `SELECT … FOR UPDATE` **adquiere un bloqueo exclusivo sobre las filas** y hace esperar a cualquier
> otro `FOR UPDATE` o `UPDATE` sobre ellas: **el mismo mecanismo que el slide 29** —pesimista, por
> bloqueo— con otra sintaxis. Lo que ilustraría el slide 26 es el patrón de columna de versión.
> Registrado en § *Contradicciones internas*.

> [!note] Tres detalles de los ejemplos que el deck deja pasar
> - **Los dos bloquean la tabla entera**: `SELECT * FROM productos` sin `WHERE` toma un bloqueo por
> **cada fila**, para después modificar una sola *(`WHERE id = 1`)*. En un sistema real, el `SELECT`
> llevaría el mismo `WHERE` que el `UPDATE`.
> - **`UPDLOCK` no es un `X`**: es el **update lock** de GMUW **18.4.4** *(909)*, compatible con
> lecturas compartidas, incompatible con otro `UPDLOCK`, y se **promueve** a exclusivo al escribir.
> Existe para evitar el *deadlock* de dos transacciones que leen con `S` y quieren promover a `X` a
> la vez. El `FOR UPDATE` de PostgreSQL y MySQL es directamente exclusivo.
> - **El `UPDATE` solo, sin el `SELECT`, ya es atómico** en los tres motores: `stock = stock - 1` se
> evalúa bajo bloqueo de fila. El `SELECT … FOR UPDATE` hace falta cuando la aplicación **necesita
> leer el valor antes de decidir** *(p. ej. verificar que `stock > 0`)*.

**Balance del bloque de transacciones: 17 slides, todos conceptuales salvo dos ejemplos en motores
ajenos; cero sintaxis MySQL; cero `ROLLBACK` en código; cero deadlocks; cero recuperación.**

---

## Slide 31 · Índices — el tercer bloque, sin anuncio

> [!quote] Textual
> - *"Estructuras complementarias en DBMS que se asocian con los atributos de las tablas y agilizan
> la operaciones de búsqueda"* **[sic: "la operaciones"]**
> - *"Juegan el mismo papel que los índices de los libros o los catálogos de fichas de las
> bibliotecas"*
> - *"Por ejemplo, para recuperar un registro de cuenta dado su número de cuenta, el sistema de bases
> de datos buscaría en un índice para encontrar el bloque de disco en que se encuentra el registro
> correspondiente, y entonces extraería ese bloque de disco para obtener el registro cuenta"*

A partir de aquí, **ocho slides que no tienen nada que ver con seguridad ni con transacciones**. El
tema ya se dio: [[Clase 08 - Explicando el plan]] mostró índices *en uso* —qué le hacen a un plan de
ejecución— y [[1.08.02 - Índices|Índices]] documentó que ese deck **no explicaba qué son por dentro**.
Estos slides son esa teoría, cinco semanas después y en el deck equivocado. Por qué están aquí
—material que sobró de la Clase 08, repaso pre-parcial del manual § 10.3.9 que el TP5 pidió leer, o
deck reciclado— no se puede saber desde el deck: los encabezados *"Transacciones en Base de Datos"*
de los slides 32–35 sugieren copia y pega *(§ *Dudas abiertas*)*.

El ejemplo del *"registro de cuenta dado su número de cuenta"* es el banco de Silberschatz, el mismo
del slide 35 con `sucursal`. En GMUW, la motivación es **8.3.1** *Motivation for Indexes* *(impresa
350)*.

## Slide 32 · Tipos de índices — ordenados y asociativos

> [!quote] Textual *(encabezado: "Transacciones en Base de Datos · Tipos de Índices" **[sic]**)*
> - ***Índices ordenados.** Estos índices están basados en una disposición ordenada de los valores.
> Ej: B-trees.*
> - ***Índices asociativos.** Estos índices están basados en una distribución uniforme de los valores
> a través de una serie de cajones (buckets). El valor asignado a cada cajón está determinado por
> una función, llamada función de asociación (hash function). Ej: Hashes.*

Es la **bifurcación fundamental** de las estructuras de índice: los slides 33–35 desarrollan los
**ordenados**, y los 36–38 comparan los dos.

| | Ordenado *(B-tree)* | Asociativo *(hash)* |
| --- | --- | --- |
| Qué guarda | las claves **en orden** | las claves **repartidas en cajones** por una función |
| Sirve para | igualdad **y rango** *(`<`, `BETWEEN`, prefijo de `LIKE`, `ORDER BY`)* | **sólo igualdad** |
| Costo de búsqueda | O(log n) — tantos accesos como niveles | O(1) — un acceso, si la función reparte bien |
| En InnoDB | **el único tipo** para tablas de usuario | sólo en el motor `MEMORY` *(y como *adaptive hash index* interno, automático)* |
| Bibliografía | GMUW **14.2** *B-Trees* *(633)* | GMUW **14.3** *Hash Tables* *(648)* |

> [!success] (clave) Este slide cierra el hueco *"¿Qué es un B-tree? ✗"* de [[1.08.02 - Índices|Índices]]
> Con una definición de una línea —*"disposición ordenada de los valores"*—, pero es la primera vez
> que un deck de la cátedra **define** el B-tree en lugar de mostrarlo en la salida de un `EXPLAIN`.
> La propiedad que importa es que **está ordenado**, y de ahí sale todo lo que la Clase 08 mostró sin
> explicar *(por qué sirve para rangos, por qué `LIKE 'abc%'` lo usa y `LIKE '%abc'` no, por qué un
> índice compuesto se usa por prefijo izquierdo)*. *Seven Databases* 2ª ed. cap. 2 § *Fast Lookups
> with Indexing* *(impresas 18–20)*, la lectura asignada en el TP5, dice lo mismo con un dibujo.

**Vocabulario:** *"asociativo"* es la traducción de *hash* en Silberschatz; *"cajón"* = *bucket*.

## Slide 33 · Índices ordenados — subtipos: con y sin agrupación

> [!quote] Textual *(encabezado "Transacciones en Base de Datos" **[sic]**)*
> - ***Índice primario o índices con agrupación.** La clave de búsqueda especifica el orden secuencial
> del archivo (archivos ordenados secuencialmente). La clave de búsqueda de un índice primario es
> normalmente la clave primaria (pero no necesariamente)*
> - ***Índices secundarios o índices sin agrupación.** Las claves de búsqueda especifican un orden
> diferente del orden secuencial del archivo. Un archivo puede tener varios índices secundarios
> además de su método de acceso principal*

> [!success] (clave) Y éste cierra el hueco *"Clustered vs. non-clustered ✗"* de [[1.08.02 - Índices|Índices]]
> *"Con agrupación"* es ***clustered***; *"sin agrupación"* es ***non-clustered***. Un índice es
> *clustered* cuando **los datos están físicamente ordenados por su clave**, y por definición **sólo
> puede haber uno** por tabla. La sección **B** de [[1.08.02 - Índices|Índices]] —*"El índice
> clustered de InnoDB"*— ya lo explicaba desde el manual; ahora tiene slide de la cátedra.

> [!important] Lo que este slide significa **en InnoDB**, y el deck no dice
> - **La `PRIMARY KEY` *es* el índice con agrupación**: la tabla InnoDB está guardada como un B-tree
> ordenado por PK, y las hojas **son las filas**. No hay "archivo" separado del "índice primario".
> - **Todo índice secundario guarda la PK en sus hojas**, no un puntero físico: buscar por índice
> secundario es **dos búsquedas** *(secundario → PK, PK → fila)*. Por eso una PK gorda encarece
> todos los índices de la tabla.
> - La salvedad del slide —*"normalmente la clave primaria (pero no necesariamente)"*— en InnoDB
> **no aplica**: el clustered es la PK; si no hay PK, el primer `UNIQUE NOT NULL`; si tampoco, uno
> oculto de 6 bytes.
>
> Bibliografía: GMUW **14.1.5** *Secondary Indexes* *(impresa 624)* explica por qué un índice
> secundario **tiene que ser denso** y el primario puede ser disperso.

## Slide 34 · Índices multinivel

> [!quote] Textual *(encabezado "Transacciones en Base de Datos" **[sic]**)*
> - *"Solución para índices muy grandes"*
> - *"El índice se trata como si fuese un archivo secuencial y se construye otro índice sobre el
> índice con agrupación"*
> - *"Para localizar un registro se usa en primer lugar una búsqueda binaria sobre el índice más
> externo para buscar el registro con el mayor valor de la clave de búsqueda que sea menor o igual
> al valor deseado"*
> - *"Los índices multinivel están estrechamente relacionados con la estructura de árbol, tales como
> los árboles binarios usados para la indexación en memoria"*

Es la idea que lleva del "índice ordenado" al **B-tree**: si el índice no entra en memoria, se indexa
el índice, y un B-tree es un índice multinivel **que se mantiene balanceado solo** al insertar y
borrar.

| Nivel | Qué contiene | Dónde vive |
| --- | --- | --- |
| Externo *(raíz)* | una entrada por bloque del nivel siguiente | memoria, siempre |
| Intermedios | una entrada por bloque del nivel de abajo | memoria, casi siempre |
| Interno *(hojas)* | una entrada por registro *(denso)* o por bloque de datos *(disperso)* | disco |

> [!note] Dos precisiones que el slide simplifica
> - *"Búsqueda binaria sobre el índice más externo"*: en un B-tree real el nivel externo es **un
> bloque** con cientos de entradas; dentro del bloque se busca binariamente, pero de un nivel al
> siguiente se **sigue un puntero**.
> - *"Árboles binarios"*: un B-tree **no es binario**; cada nodo tiene cientos de hijos *(tantos como
> entradas caben en un bloque de disco)*, y por eso un índice de millones de filas tiene **3 o 4
> niveles**, no 20. La frase viene de Silberschatz y contrapone los índices en disco con los árboles
> binarios en memoria; leída sola, confunde.
>
> GMUW **14.1.4** *Multiple Levels of Index* *(impresa 623)* es este slide; **14.2.7** *Efficiency of
> B-Trees* *(645)* es la cuenta de por qué alcanzan tres niveles.

## Slide 35 · Índices en SQL

> [!quote] Textual *(encabezado "Transacciones en Base de Datos" **[sic]**)*
> ```
> create index <nombre-índice> on <nombre-tabla> (<lista-atributos>)
> drop index <nombre-índice>
> ```
> *"**lista-atributos** es la lista de atributos de la tabla que constituye la clave de búsqueda del
> índice"*
> ***Ejemplo:***
> ```
> create index índice-s on sucursal (nombre-sucursal)
> ```
> *"índice llamado índice-s de la tabla sucursal con la clave de búsqueda nombre-sucursal"*

Es el DDL que [[1.08.02 - Índices|Índices]] § *Dudas abiertas* marcaba como **(crítico) pendiente**
*("Sintaxis exacta de `CREATE INDEX` / `DROP INDEX` en MySQL … sigue sin verificar")*. **El deck la
trae en la versión del libro, y la mitad no corre en MySQL.**

| Del slide | En MySQL | ¿Corre? |
| --- | --- | :---: |
| `create index <nombre> on <tabla> (<atributos>)` | `CREATE INDEX nombre ON tabla (col1, col2, …);` | ✓ idéntico |
| **`drop index <nombre>`** | **`DROP INDEX nombre ON tabla;`** — el `ON tabla` es **obligatorio** | ✗ **error de sintaxis** sin `ON` |
| `create index índice-s on sucursal (nombre-sucursal)` | los identificadores con **guion** *(`índice-s`, `nombre-sucursal`)* **no son válidos sin backticks**: `-` no es un carácter de identificador | ✗ sin `` ` `` |
| — | `ALTER TABLE tabla ADD INDEX nombre (cols);` / `ALTER TABLE tabla DROP INDEX nombre;` — la forma alternativa, que es la que [[MySQL]] ya documentaba para el borrado | ✓ |
| — | `CREATE UNIQUE INDEX …` · `CREATE INDEX … USING BTREE \| HASH` *(slide 38)* · `SHOW INDEX FROM tabla` | ✓ |

**El ejemplo, en MySQL:**

```sql
CREATE INDEX `índice-s` ON sucursal (`nombre-sucursal`);  -- con backticks por los guiones
-- o, con nombres razonables:
CREATE INDEX idx_sucursal_nombre ON sucursal (nombre_sucursal);
DROP INDEX idx_sucursal_nombre ON sucursal;  -- ON tabla obligatorio
```

> [!warning] (nota) Tercer lugar del deck donde el código no corre en MySQL, y el único **sin rótulo**
> Los slides 29 y 30 avisan de qué motor son. Éste da la forma `drop index nombre` **del estándar y de
> PostgreSQL**, que MySQL rechaza. Es una discrepancia chica, pero es la que muerde en el TP5 *(que
> pide crear y borrar índices en cinco ejercicios)*. GMUW **8.3.2** *Declaring Indexes* *(impresa 351)*
> da la misma sintaxis genérica, con la advertencia de que **no es parte del estándar SQL** y cada
> motor la escribe a su modo.

## Slides 36–37 · B-tree vs. Hash — la § 10.3.9 del manual, traducida a medias

> [!quote] Slide 36, textual — **mitad en español, mitad en inglés**
> - *"Se puede utilizar un índice de árbol B para comparaciones de columnas en expresiones que
> utilizan los operadores =, >, >=, <, <= o BETWEEN."*
> - *"El índice también se puede utilizar para comparaciones LIKE si el argumento de LIKE es una
> cadena constante que no comienza con un carácter comodín."*
> - *"For example, the following statements use indexes:"*
> `SELECT * FROM tbl_name WHERE key_col LIKE 'Patrick%';`
> `SELECT * FROM tbl_name WHERE key_col LIKE 'Pat%_ck%';`
> - *"The following  statements do not use indexes:"* **[sic: doble espacio]**
> `SELECT * FROM tbl_name WHERE key_col LIKE '%Patrick%';`
> `SELECT * FROM tbl_name WHERE key_col LIKE other_col;`
>
> *(En verde van el primer `LIKE` y los dos patrones que usan índice —`'Patrick%'` y `'Pat%_ck%'`—;
> el segundo `LIKE` va en gris. Los dos `LIKE` y patrones que no usan índice van en rojo.)*

> [!quote] Slide 37, textual
> - *"Las **Hashes** se utilizan únicamente para comparaciones de igualdad que utilizan los
> operadores = o <=> (pero son muy rápidos). No se utilizan para operadores de comparación como <
> que encuentran un rango de valores."*
> - *"El optimizador no puede utilizar un índice hash para acelerar las operaciones ORDER BY."*
> - *"Solo se pueden utilizar **claves completas** para buscar una fila."*

> [!success] (clave) Estos dos slides **son la lectura que la cátedra asignó en el TP5**, puesta en el deck
> [[MySQL]] § *Bibliografía* registra que el TP5 mandó leer el **MySQL 9.7 Reference Manual
> § 10.3.9** *Comparison of B-Tree and Hash Indexes*. Los slides 36–37 son **esa sección, párrafo por
> párrafo**: las dos viñetas traducidas, los cuatro ejemplos `SELECT … LIKE` copiados en inglés con
> `tbl_name` y `key_col` —los nombres del manual— y las tres propiedades de los hash. La prueba
> definitiva es el operador **`<=>`** del slide 37: el **igual seguro ante `NULL`** de MySQL, que **no
> existe en ningún otro motor ni en el estándar**.

### Lo que los dos slides dicen, en una tabla

| Predicado | B-tree | Hash | Por qué |
| --- | :---: | :---: | --- |
| `col = v` · `col <=> v` | ✓ | ✓ | igualdad: los dos |
| `col > v`, `<`, `>=`, `<=`, `BETWEEN` | ✓ | ✗ | rango: el hash no tiene orden |
| `col LIKE 'Patrick%'` | ✓ | ✗ | prefijo constante = rango `['Patrick', 'Patricl')` |
| `col LIKE 'Pat%_ck%'` | ✓ | ✗ | **sólo se usa el prefijo `Pat`**; el resto filtra después |
| `col LIKE '%Patrick%'` | ✗ | ✗ | empieza con comodín: no hay prefijo → *full scan* |
| `col LIKE other_col` | ✗ | ✗ | el patrón no es constante: no se conoce al planificar |
| `ORDER BY col` | ✓ | ✗ | el B-tree ya está ordenado; el hash no |
| `(a, b)` indexado, `WHERE a = 1` | ✓ prefijo izquierdo | ✗ **clave completa** | el hash de `(a)` no tiene relación con el de `(a, b)` |

> [!tip] Esto es lo que la [[Clase 08 - Explicando el plan]] mostró en `EXPLAIN` sin explicar
> [[1.08.02 - Índices|Índices]] § *6* documentó que *"`LIKE '%'` sobre columna indexada no usa el
> índice"* a partir de un plan con `Filter` y un costo mayor *(187.65 → 208.98)*, y el deck 08 lo decía
> en sus slides 16 y 20. **Este slide es la regla general de la que aquello era un caso**: el índice se
> usa cuando el `LIKE` da un **prefijo constante**, porque un prefijo es un **rango** sobre un índice
> ordenado. Y `LIKE 'Pat%_ck%'` usa el índice sólo para el tramo `Pat`: el resto del patrón se aplica
> como filtro sobre las filas que el rango devuelve.

## Slide 38 · Ejemplo en MySQL — `USING HASH`

> [!quote] Textual, completo — el último slide del deck
> ***Ejemplo en MySQL***
> - *CREATE INDEX MYINDEX ON USERS (DNI) **USING HASH**;* *(`USING HASH` en verde)*

**El deck termina aquí, sin cierre.** Ni "Preguntas", ni links, ni bibliografía.

```sql
CREATE INDEX MYINDEX ON USERS (DNI) USING HASH;
```

Sintácticamente es MySQL correcto *(`index_type` es `USING {BTREE | HASH}` y va después de la lista
de columnas)*. Pero:

> [!bug] (crítico) Sobre una tabla InnoDB, este `USING HASH` **se ignora en silencio** y el índice que se crea es un **B-tree**
> **InnoDB no soporta índices hash** para tablas de usuario: su único tipo es `BTREE`. El manual lo
> documenta en la tabla de tipos permitidos por motor *(§ *CREATE INDEX Statement*, capítulo de
> sentencias SQL del manual 9.7)*: `InnoDB → BTREE`; `MEMORY → HASH, BTREE`; `NDB → HASH, BTREE`. Y
> agrega que *si se especifica un tipo que el motor no admite pero hay otro que puede usar sin afectar
> los resultados, el motor usa ése*. O sea: la sentencia del slide **no falla**, y **`SHOW INDEX FROM
> USERS`** devuelve `Index_type = BTREE`. **Para tener un hash de verdad, la tabla tiene que ser
> `ENGINE = MEMORY`**, o confiar en el *adaptive hash index* interno de InnoDB, que es automático y no
> se declara.
>
> Es **la misma clase de incompatibilidad silenciosa** que el `||` del slide 12 del deck 10 *(no
> falla, devuelve otra cosa)*. Lo primero que hay que probar al llegar a este slide: crear la tabla,
> correr la sentencia, mirar `SHOW INDEX`.

Un detalle de diseño que el ejemplo esconde: un índice sobre `DNI` **debería ser `UNIQUE`**, y un
`UNIQUE` en InnoDB **es un índice B-tree** de todos modos. El `USING HASH` sobre `DNI` tendría sentido
en una tabla `MEMORY` de sesiones, no en `USERS`.

---

## Cuadro de bolsillo — todo el deck en una pantalla

| Pregunta | Respuesta |
| --- | --- |
| ¿De qué protege la seguridad de una BD? | accesos no autorizados · destrucción/alteración malintencionadas · inconsistencias accidentales *(slide 2)* |
| Las tres amenazas | pérdida de **integridad** · **disponibilidad** · **confidencialidad** *(3)* |
| Los cinco niveles | sistema de BD · sistema operativo · red · físico · humano *(4)* — el deck sólo desarrolla el primero |
| Autenticación vs. autorización | **quién eres** *(`CREATE USER … IDENTIFIED BY`)* vs. **qué puedes** *(`GRANT`)* *(5)* |
| Cómo se identifica una cuenta MySQL | `'usuario'@'host'` — **el host es parte de la identidad** *(9)*; el slide 8 dice "usuario y contraseña" y está mal |
| `'localhost'` · `'192.168.1.100'` · `'%'` | sólo local · sólo esa IP · **cualquiera** — en Docker hace falta `'%'` |
| Sintaxis de `GRANT` | `GRANT permiso ON base.tabla TO 'u'@'host' [WITH GRANT OPTION];` *(10)* |
| Permisos que lista el deck | `ALL` · `CREATE` · `DROP` · `DELETE` · `INSERT` · `SELECT` · `UPDATE` — **faltan** `ALTER`, `INDEX`, `TRIGGER`, `EXECUTE`… |
| `WITH GRANT OPTION` | **no es un permiso**: es la cláusula que deja **volver a conceder** lo recibido |
| Granularidades | `*.*` · `base.*` · `base.tabla` · **`(columnas)`** — el deck sólo da la tercera y el TP8 usa la cuarta |
| Roles | `CREATE ROLE` → `GRANT priv ON … TO rol` → `GRANT rol TO usuario` → **`SET DEFAULT ROLE`** *(el paso que el deck omite)* *(11)* |
| Desde qué versión hay roles | **MySQL 8.0** |
| `REVOKE` | `REVOKE permisos ON base.tabla FROM 'u'@'host';` *(12)* — **sin `CASCADE` ni `RESTRICT`** en MySQL |
| `FLUSH PRIVILEGES` | **innecesario** tras `GRANT`/`REVOKE`; sólo tras editar `mysql.*` a mano |
| ¿Qué es una transacción? | **unidad lógica de trabajo**: todo o nada *(14)* |
| ACID | **A**tomicidad *(todo o nada)* · **C**onsistencia *(estado válido → estado válido)* · **I**solation *(como si fueran en serie)* · **D**urabilidad *(confirmado = persistido)* *(16–17)* |
| ¿Cuál no la garantiza el motor? | la **C**: la definen las restricciones y el programador |
| Los cinco estados | activa → parcialmente confirmada → confirmada · fallida → abortada *(18)* — el diagrama del 20 usa **fallo → terminar** |
| Las cinco operaciones | inicio · leer/escribir · fin · **commit** · **rollback** *(19)* |
| En MySQL | `START TRANSACTION` · … · `COMMIT` / `ROLLBACK`; `autocommit=1` por defecto; DDL confirma solo; sólo **InnoDB** |
| ¿Por qué concurrencia? | throughput *(E/S ‖ CPU)* y latencia *(cortas no esperan a largas)* *(22)* |
| Las cuatro anomalías | **race condition** *(lost update)* · **dirty read** · **non-repeatable read** *(fila)* · **phantom** *(conjunto)* *(23–24)* |
| Los tres mecanismos | **locking** *(S/X)* · **optimista** *(validar al commit)* · **timestamps** *(orden fijado al inicio)* *(25–27)* |
| ¿Cuál usa InnoDB? | **locking** para escrituras y `FOR UPDATE` + **multiversión** para lecturas — **ninguno de los tres slides lo dice** |
| Los cuatro niveles | `READ UNCOMMITTED` ⊃ dirty · `READ COMMITTED` ⊃ non-rep · `REPEATABLE READ` ⊃ phantom · `SERIALIZABLE` ⊃ nada *(28)* |
| Nivel por defecto de InnoDB | **`REPEATABLE READ`** — y en la práctica **sin phantoms** para lecturas comunes |
| `SELECT … FOR UPDATE` | bloqueo **pesimista** de las filas leídas; **corre igual en PG y en MySQL** *(30)*; en SQL Server, `WITH (UPDLOCK)` *(29)* |
| Índices: los dos tipos | **ordenados** *(B-tree: igualdad y rango)* · **asociativos** *(hash: sólo igualdad)* *(32)* |
| Con / sin agrupación | *clustered* *(los datos van en el orden del índice; uno por tabla — en InnoDB, la PK)* / *non-clustered* *(33)* |
| Multinivel | índice sobre el índice; el B-tree es uno que se balancea solo *(34)* |
| DDL | `CREATE INDEX n ON t (cols);` · **`DROP INDEX n ON t;`** — el `ON t` que el slide 35 omite |
| `LIKE` e índice | usa el índice **si el patrón empieza con un prefijo constante** *(36)* |
| Hash: tres límites | sólo `=` y `<=>` · no sirve para `ORDER BY` · sólo **clave completa** *(37)* |
| `USING HASH` en InnoDB | **se ignora**: el índice es B-tree. Hash real sólo en `ENGINE=MEMORY` *(38)* |

---

## Erratas del deck — inventario completo

Se transcriben `[sic]` en toda la página; ninguna se corrige en las citas.

| Slide | Errata | Lo correcto |
| :---: | --- | --- |
| 4 | *"es **tan** importante en Internet y en las redes privadas"* | falta el *"como"* de la comparación |
| 5 | *"se identifica un usuario como **válida**"* | *válido* |
| 5 | *"autentificado"* / *"autenticación"* en el mismo slide | las dos formas existen; inconsistencia interna |
| 9 | `IDENTIFIED BY ‘tu_contrasena';` — abre `‘` y cierra `'` | comillas rectas simples |
| 10 | `[nombre de bases de datos]. [nombre de tabla]` con espacio | `base.tabla` |
| 10 | `‘[usuarioX]’@'host’` — tres tipos de comilla | comillas rectas |
| 10 | `WITH GRANT OPTION` listado como *"tipo de permiso"* | es una **cláusula**, no un privilegio |
| 10 | *"permite que usuarioX **maneje privilegios de otros usuarios**"* | permite que **conceda los suyos** a otros |
| 11 | `'app_developer‘;` ×2 — cierra con `‘` | `'app_developer';` |
| 11 | `GRANT SELECT ON T1 **to** ‘app_developer’;` — `to` en minúscula, comillas mezcladas | `TO 'app_developer'` |
| 11 | `DROP ROLE` **antes** de `GRANT rol TO usuario` | leído en orden, concede un rol borrado |
| 12 | `ON [nombre de base de datos] [nombre de tabla]` — sin el `.` | `ON base.tabla` |
| 12 | *"se deben refrescar todos los con el comando"* | falta *"privilegios"* |
| 12 | (crítico) *"se deben refrescar … FLUSH PRIVILEGES"* tras `GRANT`/`REVOKE` | **innecesario**: sólo tras editar las tablas `mysql.*` directamente |
| 13 | `‘juan’@'%’`, `‘admin’@'%’`, `‘auditor’@'…’` — usuario entre `‘ ’` tipográficas; host abre con `'` recta y cierra con `’` | comillas rectas |
| 14 | *"escrito en un lenguaje **en un lenguaje** de programación"* | duplicado |
| 19 | *"INICIO DE **TRANSACION**"* · *"FIN DE LA **TRANSACION**"* | *TRANSACCIÓN* |
| 18 vs. 20 | (crítico) lista con **Abortada** y sin *Terminar*; diagrama con **Terminar** y sin *Abortada* | dos fuentes sin reconciliar *(ver § Contradicciones)* |
| 22 | *"las operaciones de E/S, **como** uso de CPU y discos"* | *"E/S **y** uso de CPU"* |
| 23 | *"Race conditions"* como nombre de anomalía | **lost update** *(el ejemplo lo es)*; *race condition* es la causa genérica |
| 28 | *"**Minimiza** los dirty reads"* | los **elimina** |
| 28 | *"ese dato **no cambiará** durante la transacción"* | *"mi transacción **lo seguirá viendo igual**"* — el dato puede cambiar |
| 30 | (crítico) *"Ejemplo de **control de versiones**"* sobre un `SELECT … FOR UPDATE` | es un **bloqueo pesimista**, lo contrario del slide 26 |
| 30 | `-- Bloqueo de` / `actualización` partido en dos renglones | copiado tal cual, la segunda línea queda fuera del comentario |
| 31 | *"agilizan **la** operaciones"* | *las* |
| 32–35 | (crítico) encabezado *"**Transacciones** en Base de Datos"* en cuatro slides de **índices** | copia y pega del bloque anterior |
| 33 | *"Índice primario **o** índices con agrupación"* | singular/plural mezclados |
| 34 | *"tales como los **árboles binarios**"* | un B-tree no es binario *(frase heredada de Silberschatz)* |
| 35 | (nota) `drop index <nombre-índice>` sin `ON tabla` | en MySQL: `DROP INDEX n ON t;` |
| 35 | `índice-s`, `nombre-sucursal` con guion y tilde, sin comillas | identificadores inválidos en MySQL sin backticks |
| 36 | dos viñetas **en inglés** *("For example, the following statements…")* | traducción incompleta del manual § 10.3.9 |
| 36 | *"The following  statements"* — doble espacio | — |
| 37 | *"**Las** Hashes"* | *los índices hash* |
| 38 | (crítico) `USING HASH` sobre una tabla InnoDB | **se ignora**: crea un B-tree |

**Total: 34 erratas en 38 slides.** A diferencia del deck 10 *(25 erratas, 11 de las cuales impedían
compilar)*, aquí casi ninguna rompe código, pero **cuatro son conceptuales** *(FLUSH PRIVILEGES,
"control de versiones", estados sin reconciliar, USING HASH)* y son las que un parcial podría castigar.

---

## Contradicciones internas del deck

| # | Entre | Qué dice uno | Qué dice el otro | Cómo se resuelve |
| :---: | --- | --- | --- | --- |
| 1 | Slide **8** ↔ slide **9** | *"Un usuario MySQL se define en términos de un nombre de usuario y una contraseña"* | *"Seguido al nombre de usuario, se debe especificar la IP desde donde podrá realizar conexiones"* — la identidad es `'usuario'@'host'` | **Gana el 9**: el host es parte de la cuenta; la contraseña es un atributo |
| 2 | Slide **18** ↔ slide **20** | cinco estados: activa · parcialmente confirmada · **fallida** · **abortada** · confirmada | cinco nodos: activa · parcialmente confirmada · confirmada · **fallo** · **terminar** — sin *abortada* | Son Silberschatz y Elmasri respectivamente. **Aprender uno completo**; *abortada* ≈ el tramo *fallo → terminar* |
| 3 | Slide **26** ↔ slide **30** | control de versiones: *"las transacciones **no utilizan bloqueos**"* | *"Ejemplo de **control de versiones** en PostgreSQL"*: `SELECT … FOR UPDATE` — un **bloqueo** | **El 30 está mal rotulado**: es locking pesimista, igual que el 29. El ejemplo de OCC sería la columna `version` |
| 4 | Slide **25** ↔ slides **29–30** | exclusive lock: *"**Nadie más puede leer** ni modificar el dato"* | los dos motores de los ejemplos *(y MySQL)* son **MVCC**: un `SELECT` común lee la versión confirmada aunque haya un `X` | El 25 describe el modelo de dos bloqueos de libro; los motores reales lo relajan con versiones |
| 5 | Slide **7** ↔ slides **8–13** | agenda: *"modificación y borrado de cuentas"*, *"conexiones seguras … SSL"* | ni `ALTER USER`, ni `DROP USER`, ni una palabra de SSL | Promesa incumplida: tres de siete puntos de la agenda no se desarrollan |
| 6 | Slide **10** ↔ slide **13** | sintaxis: `ON [base]. [tabla]` — una sola granularidad | `GRANT ALL ON midb.*` — granularidad de base, no explicada | El 13 usa una forma que el 10 no da; y la de **columna** que el TP8 usa no está en ninguno |
| 7 | Slide **12** ↔ **manual de MySQL** *(no otro slide)* | *"se deben refrescar … FLUSH PRIVILEGES"* tras `GRANT`/`REVOKE` | `GRANT`/`REVOKE` tienen efecto inmediato; `FLUSH` es para ediciones manuales de `mysql.*` | Gana el manual. Inofensivo, pero enseña una causalidad falsa |
| 8 | Slide **28** ↔ **InnoDB** *(no otro slide)* | `REPEATABLE READ` *"no previene las lecturas fantasma"* | en InnoDB, en ese nivel *(el por defecto)*, las lecturas comunes **no ven phantoms** | Gana el slide "según la teoría", gana InnoDB "en MySQL". Hay que saber cuál se pregunta |
| 9 | Nombre del archivo y tema del cronograma ↔ slides **31–38** | *"Seguridad-Transacciones"* / *"Seguridad … Transacciones ACID … matriz de roles"* | ocho slides de **índices**, con encabezado *"Transacciones"* | El contenido gana: el deck tiene tres bloques, y la matriz de roles no está en ninguno |

---

## Dudas abiertas

- [ ] (crítico) **¿Qué se toma de seguridad en el parcial del 13/10: la sintaxis MySQL del deck o el
  modelo de grafos de GMUW 10.1 que ejercita el TP8?** Son dos capas distintas y sólo una está en el
  deck; el patrón *"teoría en el estándar, código en MySQL"* de TP6, TP7 y TP8 sugiere que se toman
  las dos. **Confirmar antes del parcial.**
- [ ] (crítico) **¿Por qué los slides 31–38 son de índices, y se dieron en clase?** ¿Repaso
  pre-parcial? ¿Material que sobró de la Clase 08? ¿Se saltearon? **Preguntar al humano**: afecta qué
  se estudia de índices para el 13/10.
- [ ] (crítico) **Propagar los slides 31–38 a [[1.08.02 - Índices|Índices]].** Sus tres huecos ✗
  *("Qué es un B-tree", "Tipos de índice", "Clustered vs. non-clustered")* y su duda (crítico) sobre la
  sintaxis de `CREATE INDEX` / `DROP INDEX` **se cierran con este deck** *(slides 32, 32–37, 33 y 35,
  con la salvedad del `ON tabla` en el `DROP`)*, más `USING HASH` con la advertencia de que InnoDB lo
  ignora. El concepto nació en la Clase 08 y este deck lo **reencuadra**: va en `clases: [8, 11]`, no
  en una página nueva.
- [ ] (crítico) **Verificar en el contenedor de la cursada, antes del TP8**: (a) que `USING HASH`
  sobre InnoDB devuelve `Index_type = BTREE` en `SHOW INDEX`; (b) que un usuario `'u'@'localhost'`
  **no** puede conectarse desde el host anfitrión al MySQL en Docker, y que `'u'@'%'` sí; (c) que
  `GRANT rol TO usuario` sin `SET DEFAULT ROLE` deja al usuario sin los privilegios del rol; (d) que
  `SELECT @@transaction_isolation;` devuelve `REPEATABLE-READ`. Las cuatro son afirmaciones de esta
  página **hechas desde el manual, no comprobadas en el entorno real**.
- [ ] (crítico) **¿`REPEATABLE READ` de InnoDB evita los phantoms o no, para lo que pregunta la
  cátedra?** Si el parcial pide *"nivel mínimo que evita phantoms"*, la respuesta del slide es
  `SERIALIZABLE` y la de MySQL es `REPEATABLE READ`. Preguntar cuál se espera.
- [ ] **¿La *"matriz de roles y permisos"* del cronograma se dio oralmente?** El deck no tiene ninguna
  matriz. Si en clase se dibujó una tabla `rol × permiso`, vale reconstruirla desde las
  notas del humano.
- [ ] **¿Se explicó el `SET DEFAULT ROLE` en clase?** Sin él, el ej. 2.h del TP8 "no funciona" si se
  sigue el deck.
- [ ] **¿Vale el `FOR UPDATE` del slide 30 como "la sintaxis MySQL de transacciones" para el
  parcial?** Si el parcial pide escribir una transacción, ¿se espera `START TRANSACTION` o vale
  `BEGIN`? *(las dos funcionan)*.
- [ ] **¿Deadlocks, 2PL y recuperación entran?** Ninguno está en el deck; los tres están en GMUW
  *(18.3.3, 19.2, cap. 17)* y en Date *(16.5, cap. 15)*. El slide 15 nombra *"control de la
  concurrencia"* como causa de fallo, que presupone deadlocks.
- [ ] **Este deck tampoco declara bibliografía** *(como el 10; el 09 sí lo hacía)*. ¿La cátedra asume
  GMUW y Date para estos temas, o hay que conseguir Elmasri? Afecta al mapeo de
  [[_index-bibliografia]] › Clase 11.
- [ ] **La previsión de [[1.06.01 - Vistas|Vistas]] § *Enlaces*** —*"seguridad (07/09, vistas como
  control de acceso) → todavía sin material"*— **falló**: el deck no nombra las vistas. Corregir esa
  línea y dejar la duda: ¿`GRANT SELECT ON vista` se da por sabido, o no entra?

## Enlaces

- Clase anterior: [[Clase 10 - Restricciones integridad-Parte 2]] *(31/08)* · clase siguiente:
  [[Clase 12 - Introduccion a NoSQL]] *(14/09 — arranca la segunda mitad y la `Unidad-02`)*
- Práctica de esa semana (martes 08/09): **[[Práctica 2026-09-08]]** — TP 8 Seguridad
- Prácticas relacionadas: [[Práctica 2026-09-01]] *(TP7 — la tabla de auditoría que el `auditor`
  del slide 13 leería)* · [[Práctica 2026-08-18]] *(TP5 — la lectura del manual § 10.3.9 que los
  slides 36–37 reproducen)*
- Conceptos que **nacen** en esta clase *(nombres previstos; los fija la etapa de conceptos)*:
  [[1.11.01 - Seguridad en bases de datos|Seguridad en bases de datos]] ·
  [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] ·
  [[1.11.03 - Transacciones y ACID|Transacciones y ACID]] *(hoy el vault linkea
  `[[Transacciones ACID]]` desde trece lugares: conviene que sea alias)* ·
  [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia y niveles de aislamiento]]
- Conceptos que esta clase **reencuadra**: [[1.08.02 - Índices|Índices]] *(slides 31–38: B-tree vs.
  hash, clustered, multinivel, DDL — cierra tres huecos y una duda de esa página)* ·
  [[1.09.01 - Restricciones de integridad|Restricciones de integridad]] *(la "C" de ACID)* ·
  [[1.09.04 - Triggers|Triggers]] *(la tabla de log del `auditor`)* ·
  [[1.06.01 - Vistas|Vistas]] *(la previsión "vistas como control de acceso" que este deck no cumple)* ·
  [[1.08.01 - Plan de ejecución|Plan de ejecución]] *(el `LIKE` con prefijo del slide 36 es la regla
  detrás del `Filter` de la Clase 08)*
- Motores: [[MySQL]] *(§ nuevo pendiente: cuentas, `GRANT`, roles, `START TRANSACTION`, `autocommit`,
  `REPEATABLE READ`, `FOR UPDATE`, `USING HASH`)* · [[PostgreSQL]] § *Inventario* *(fila del deck 11:
  slide 30, y el `drop index` sin `ON` del 35)* · [[MongoDB]] *(lo que sigue: qué pasa con ACID cuando
  no hay transacciones — Seven Databases 2ª ed. A1, tabla 6, *Transactions · Triggers · Security*)*
- Bibliografía verificada contra las fichas: GMUW **6.6** *(Transactions in SQL, 296–306)* ·
  **10.1** *(Security and User Authorization, 425–436)* · **17.1** *(Failure Modes y primitivas,
  843–850)* · **18.3–18.9** *(locks, timestamps, validación, 897–947)* · **19.2** *(Deadlocks, 966)* ·
  **8.3** *(Indexes in SQL, 350)* · **14.1–14.3** *(índices, B-trees, hash, 620–660)* — Date **15**
  *(Recovery)*, **16** *(Concurrency: 16.2, 16.3, 16.5, 16.6, 16.8, 16.10)*, **17** *(Security:
  17.2, 17.5, 17.6)* — Silberschatz cap. 1 **§ 1.7** *(A, C y D sin la I)* — *Seven Databases* 2ª ed.
  cap. 2 § *Fast Lookups with Indexing* *(18–20)*, cap. 2 § *Transactions* *(26)*, **A1** tabla 6
  *(314)*, **A2** *(315–318)* — Corbellini **§ 3.1–3.2** *(CAP, ACID y BASE, pp. 4–7)*
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]] · reglas del vault: [[CLAUDE]]
