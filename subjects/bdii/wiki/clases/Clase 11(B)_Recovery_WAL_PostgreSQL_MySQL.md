---
tipo: teorica
clase: 11
unidad: 1
deck: "BD2_Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL.pdf"
tema: "Seguridad en Bases de Datos. Transacciones ACID · Implementación de matriz de roles y permisos"
fecha: 2026-09-07
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 11(B)
  - Clase 11(B)
  - Recovery_WAL_PostgreSQL_MySQL
  - Recovery en Bases de Datos Relacionales
  - Write-Ahead Logging
  - WAL
  - Write-ahead logging
  - Regla de oro del WAL
  - Log record
  - LSN
  - PageLSN
  - ARIES
  - Analysis Redo Undo
  - Redo log
  - Undo log
  - Doublewrite buffer
  - Binlog
  - Binary log
  - Redo log vs binlog
  - Checkpoint
  - Fuzzy checkpointing
  - PITR
  - Point-In-Time Recovery
  - Crash recovery
  - Recovery
  - full_page_writes
  - wal_level
  - synchronous_commit
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL.pdf"
estado: procesado
resumen: "Cómo un motor relacional garantiza atomicidad y durabilidad tras un crash: write-ahead logging, ARIES (analysis-redo-undo) y su implementación en PostgreSQL (MVCC, sin undo log) y MySQL/InnoDB (redo log, undo log, doublewrite, binlog). Gotcha de examen: redo log ≠ binlog."
---

# Clase 11(B) — Recovery: write-ahead logging (WAL) en PostgreSQL y MySQL

## Resumen general

Deck de catorce diapositivas, publicado en el campus el 07/09 —el mismo día que la
[[Clase 11 - Seguridad-Transacciones|Clase 11]]— con el nombre `BD2_Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL.pdf`;
el archivo bajado conserva el nombre `Recovery_WAL_PostgreSQL_MySQL.pptx.pdf`, sin número de clase,
aunque el campus sí lo numera como material de la Clase 11. Cubre cómo un motor relacional garantiza
atomicidad y durabilidad frente a un crash: el problema del *buffer pool* volátil, la regla de oro
del *write-ahead logging* —loguear antes de escribir la página, forzar el log a disco antes de
confirmar el `COMMIT`—, la anatomía de un *log record* (`LSN`, `TxID`, página, valor viejo, valor
nuevo) y el algoritmo **ARIES** (*Analysis · Redo · Undo*). La segunda mitad contrasta cómo lo
implementan **PostgreSQL** —WAL nativo, redo físico, sin *undo log* separado porque MVCC hace ese
trabajo— y **MySQL/InnoDB** —cuatro mecanismos separados: *redo log*, *undo log*, *doublewrite
buffer* y *binlog*, con ARIES completo—, y cierra con una comparativa y tres ideas para llevarse.

Es la continuación directa de la Clase 11: retoma la **A** y la **D** de ACID —que esa clase definió
sin decir cómo se garantizan— y les da mecanismo. También conecta con el **MVCC** que
[[1.11.04 - Control de concurrencia y niveles de aislamiento|1.11.04]] ya documentó para InnoDB:
aquí se explica **por qué** PostgreSQL puede prescindir del *undo log* gracias a MVCC, mientras que
InnoDB, aunque también usa MVCC para sus lecturas, sigue necesitando uno. El curso corre sobre
MySQL, pero el deck trata a PostgreSQL primero y en pie de igualdad, con una sección completa por
motor —a diferencia del patrón habitual de la `Unidad-01`, donde el motor ajeno aparece sin avisar—.
Para el parcial: la regla de oro del WAL, las tres fases de ARIES, y el *gotcha* clásico de examen:
**redo log ≠ binlog**.

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL.pdf` · **14 slides**.
> Publicado en el campus el **07/09**, el mismo día que la [[Clase 11 - Seguridad-Transacciones|Clase 11]]
> y bajo el mismo tema oficial de [[_cronograma]] (fila 2026-09-07): ***"Seguridad en Bases de Datos.
> Transacciones ACID · Implementación de matriz de roles y permisos"*** — el bloque de durabilidad y
> atomicidad de esa fila es este deck.
> Clase anterior: [[Clase 10 - Restricciones integridad-Parte 2]] *(31/08)*. Clase hermana, mismo
> día: [[Clase 11 - Seguridad-Transacciones]]. Clase siguiente: [[Clase 12 - Introduccion a NoSQL]]
> *(14/09)*. Se practica con el **TP8 Seguridad** del martes 08/09 → [[Práctica 2026-09-08]] *(no
> ejercita recovery)*.
> Bibliografía: ver § *Bibliografía verificada* de esta página.

> [!note] Numeración del pie de página: cuatro diapositivas no la llevan
> El pie numera **02 a 12** en las diez diapositivas de contenido *(2–6 y 8–12: el footer coincide
> exactamente con el orden del PDF)*. Las cuatro que **no** llevan número son la portada *(1)*, la
> diapositiva separadora *"Dos motores, dos filosofías de recovery"* *(7)*, y el cierre en dos
> partes, *"Tres ideas para no olvidar"* y *"¿Preguntas?"* *(13 y 14)*. Esta página cita por el
> **orden real del PDF, 1 a 14**, que en las diez diapositivas de contenido es el mismo número.

## Contenidos de la clase

Agenda tal como la lista el slide 2, *"Qué vamos a ver hoy"*:

1. **El problema** — por qué el *buffer pool* pone en riesgo *Atomicity* y *Durability*
2. **Write-Ahead Logging** — la regla de oro y la anatomía de un *log record*
3. **ARIES** — *Analysis · Redo · Undo* — el algoritmo detrás de casi todos los motores
4. **PostgreSQL** — WAL, checkpoints, replicación y PITR
5. **MySQL / InnoDB** — *redo log*, *undo log*, *doublewrite buffer* y *binlog*
6. **Comparativa** — dos filosofías de recovery, cara a cara

## Slide 1 · Portada

> [!quote] Textual, completo
> *"Recovery en Bases de Datos Relacionales"*
> *"Write-Ahead Logging (WAL) y su implementación en PostgreSQL y MySQL"*
> *(pie: "LOG SECUENCIAL → DURABILIDAD")*

El subtítulo del pie ya resume la tesis del deck entero: convertir escrituras aleatorias y costosas
en un **log secuencial**, barato de escribir, es lo que permite dar durabilidad sin escribir cada
página a disco en cada `COMMIT`.

## Slide 2 · Agenda

Ver § *Contenidos de la clase*. Es el único slide con los **seis** bloques juntos, como grilla; cada
número individual se repite después, uno por vez, en el encabezado de las diapositivas de contenido
que le corresponden *("01 · EL PROBLEMA" en el slide 3, "02 · WRITE-AHEAD LOGGING" en el 4–5, y así
hasta "06 · COMPARATIVA" en el 12*).

---

## 01 · El problema *(Slide 3)*

> [!quote] Textual
> *"Escribir cada cambio directamente a disco sería demasiado costoso: las páginas se modifican en
> RAM (buffer pool) y su escritura a disco se posterga."*
>
> **Durability (D)** — *"Si hubo COMMIT, el cambio debe sobrevivir a un crash — aunque la página aún
> no esté en disco."*
>
> **Atomicity (A)** — *"Si la transacción no llegó a COMMIT, sus efectos parciales deben poder
> deshacerse por completo."*
>
> **RAM — Buffer Pool** — *"Páginas modificadas ('dirty pages') esperando para bajar a disco. Rápido
> de modificar, volátil."*
>
> **Disco — Log + Datos** — *"El log se escribe primero, en forma secuencial (append-only) — barato.
> Las páginas de datos bajan después, en su propio tiempo."*

*(propuesta propia: el slide no arma esta tabla ni asocia cada elemento a una letra de ACID; es una
síntesis del vault a partir del texto citado arriba)*

| Elemento | Dónde vive | Propiedad de ACID en juego |
| --- | --- | --- |
| Página modificada *(dirty page)* | RAM — *buffer pool*, volátil | — |
| Log, secuencial y *append-only* | Disco, se escribe primero | **D** *(lo confirmado no se pierde, aunque la página siga en RAM)* |
| Página de datos | Disco, baja después, "en su propio tiempo" | **A** *(sus efectos, si la transacción no confirmó, todavía se pueden deshacer)* |

> [!important] (clave) Es la respuesta que [[1.11.03 - Transacciones y ACID|1.11.03]] dejó pendiente
> La [[Clase 11 - Seguridad-Transacciones|Clase 11]] definió la **A** y la **D** de ACID *(slides
> 16–17)*: textualmente, *"todo o nada… sus efectos parciales deben poder deshacerse"* y *"una vez
> que se confirmó una transacción quedará persistida"*. Quién las garantiza —*"el motor, con
> `ROLLBACK` y el log de undo"* / *"el motor, con el log de redo y `fsync`"*— no es una cita del
> slide: es la columna *"Quién la garantiza"* de la tabla que la página de la Clase 11 agregó
> *(propuesta propia del vault)*, sin decir **cómo** funciona ese log.
> [[1.11.03 - Transacciones y ACID|1.11.03]] § 2.1 lo marcó textualmente: *"la A y la D son las dos
> caras del log… la cursada no lo dicta"*. Este deck es esa clase que faltaba: la razón de ser del
> *buffer pool* volátil, y el mecanismo —el log— que lo hace seguro.

---

## 02 · Write-Ahead Logging *(Slides 4–5)*

### Slide 4 · La regla de oro del WAL

> [!quote] Textual
> *"Antes de escribir una página modificada a disco → hay que escribir primero al log, en disco, el
> registro que describe ese cambio."*
>
> *"Y antes de confirmar un COMMIT al cliente, el log de esa transacción tiene que estar físicamente
> en disco (fsync)."*

| Paso | Qué pasa |
| --- | --- |
| **1. Modificar** | La transacción cambia una página en el *buffer pool* (RAM). |
| **2. Loguear** | Se genera el *log record* con el cambio (LSN, página, valor viejo/nuevo). |
| **3. `fsync()`** | El *log record* se fuerza a disco antes de responder el `COMMIT`. |
| **4. Confirmar** | Solo entonces el motor le dice al cliente que el `COMMIT` fue exitoso. |

> [!tip] Es el mismo `fsync` que ya apareció en la arquitectura de PostgreSQL
> [[PostgreSQL]] § *"despachador · proceso por conexión · buffer cache · WAL · fsync · plan de
> ejecución"* y la [[Clase 01 - Introducción_BasesDeDatos|Clase 01]] ya mostraron el diagrama de
> arquitectura de PostgreSQL con **tres flechas rotuladas `FSYNC`**, una de ellas entre `Postgres` y
> el `Write-ahead log (WAL)`. Ese `fsync` era un nombre en un diagrama de cajas; aquí tiene los cuatro
> pasos que lo explican: es el paso **3** de esta tabla, el que separa *"el log dice que pasó"* de
> *"el motor puede prometerlo"*.

> [!figura] lab-recovery-wal
> Recovery con WAL y ARIES: elija el punto del crash y vea qué transacciones deshace el motor y cómo queda cada página.

### Slide 5 · Anatomía de un log record

> [!quote] Textual
> *"Cada registro del log identifica de forma unívoca un cambio, y cada página recuerda cuál fue el
> último cambio que ya tiene aplicado."*

| Campo | Qué es *(textual)* |
| --- | --- |
| **LSN** | *Log Sequence Number*: identificador único y creciente del registro. |
| **TxID** | Transacción que generó el cambio. |
| **Página / offset** | Qué página (y dentro de ella, qué parte) fue modificada. |
| **Valor viejo** | Necesario para poder hacer *undo* (*rollback*). |
| **Valor nuevo** | Necesario para poder hacer *redo* tras un crash. |

> [!quote] Caja lateral — *"PageLSN"*, textual
> *"Cada página en el buffer pool guarda el LSN del último cambio que ya se le aplicó."* … *"Así, al
> recuperar, el motor sabe exactamente qué registros del log ya están reflejados en la página y
> cuáles todavía no."* → *"evita redo innecesario"*

> [!note] Valor viejo y valor nuevo son, literalmente, undo y redo en el mismo registro
> Un *log record* que guarda **ambos** valores es lo que GMUW llama *undo/redo logging*
> *(§ 17.4, impresa 869)*: con el valor viejo se puede deshacer sin depender de que la página esté
> actualizada, y con el valor nuevo se puede rehacer sin depender de si el *undo* ya corrió. Es el
> esquema más flexible de los tres que GMUW compara *(undo-only § 17.2, redo-only § 17.3,
> undo/redo § 17.4)*, y el que usa ARIES.

---

## 03 · ARIES *(Slide 6)*

> [!quote] Textual
> *"Algorithm for Recovery and Isolation Exploiting Semantics — base (con variantes) de la mayoría
> de los motores reales."*

| Fase | Qué hace *(textual)* |
| --- | --- |
| **1. Analysis** | *"Recorre el log desde el último checkpoint para reconstruir qué transacciones estaban activas y qué páginas estaban sucias."* |
| **2. Redo** | *"Rehace TODOS los cambios logueados desde ese punto — incluso de transacciones que después abortaron — hasta llegar al estado exacto previo al crash."* |
| **3. Undo** | *"Deshace los cambios de las transacciones que no habían hecho COMMIT, usando los valores viejos guardados en el log."* |

> [!quote] Pie del slide, textual
> *"Checkpoints acotan cuánto log hay que revisar al reiniciar: en un checkpoint se fuerza a disco
> cierto estado del buffer pool / log para no tener que analizar desde el principio de los tiempos."*

> [!important] (clave) "ARIES" está en la bibliografía: Date lo nombra, GMUW lo cita
> **ARIES** es el algoritmo publicado por Mohan, Haderle, Lindsay, Pirahesh y Schwarz (ACM TODS 17(1),
> 1992). El vault no tiene ese paper, pero **Date cap. 15.4 *System Recovery*** (impresa 455, apartado
> *"ARIES"*) lo nombra con sus tres fases —*"1. Analysis: Build the REDO and UNDO lists. 2. Redo …
> 3. Undo …"*—, explica que el redo *"is often said to be repeating history"* y da la expansión del
> nombre. **GMUW** no lo desarrolla en el cuerpo del capítulo 17: su § 17.4 *Undo/Redo Logging* es un
> esquema más simple —17.4.2 (impresa 871) dice *"1. Redo all the committed transactions in the
> order earliest-first, and 2. Undo all the incomplete transactions in the order latest-first"*, es
> decir, **rehace solo lo confirmado**, no "todo", y no separa una fase de *Analysis*—, pero su
> § 17.7 cita el paper de Mohan et al. como una de las dos fuentes primarias del capítulo. Detalle y
> citas completas en [[1.11.06 - ARIES — análisis, redo y undo|ARIES]] § 6.

> [!tip] Por qué "rehacer todo, incluso lo que después se deshace" no es un desperdicio
> Redo **primero**, sin mirar si la transacción comprometió o no, es lo que le permite a ARIES no
> tener que decidir nada en la fase de *Analysis*: al final del *Redo* la base queda **exactamente**
> como estaba al momento del crash, con todos los cambios de todas las transacciones aplicados. Solo
> **después** de eso el *Undo* deshace lo que corresponde. Date cap. 15.4 (impresa 455) lo llama así:
> *"the ARIES redo phase is often said to be repeating history"*.

---

*Slide 7 — diapositiva separadora, sin contenido nuevo:* **"DE LA TEORÍA A LA PRÁCTICA"** / *"Dos
motores, dos filosofías de recovery"*, con los rótulos **"PostgreSQL — WAL nativo"** y **"MySQL /
InnoDB — ARIES clásico"** que anticipan el veredicto de la comparativa del slide 12: PostgreSQL
resuelve con una variante *redo-only*, MySQL/InnoDB con ARIES completo.

---

## 04 · PostgreSQL *(Slides 8–9)*

### Slide 8 · El WAL de PostgreSQL

> [!quote] Textual
> *"El log se llama WAL directamente: archivos de 16MB en `pg_wal/` (antes `pg_xlog/`). Cada
> registro tiene un LSN. Es redo físico de páginas, con algunas optimizaciones lógicas."*
>
> *"**Sin undo log separado:** gracias a MVCC, las versiones viejas de las tuplas ya están en la
> tabla. Para abortar, simplemente no se aplican los cambios — no hace falta 'deshacer' escribiendo
> encima."*
>
> *"Al reiniciar tras un crash: redo desde el último checkpoint. No hay fase de undo explícita como
> en ARIES — MVCC hace ese trabajo 'gratis'."*

| Parámetro | Qué controla *(textual)* |
| --- | --- |
| `wal_level` | *"minimal / replica / logical — cuánta info se logea"* |
| `checkpoint_timeout` | *"cada cuánto se dispara un checkpoint"* |
| `synchronous_commit` | *"si el COMMIT espera el fsync del WAL"* |

> [!important] (clave) La misma MVCC que ya se documentó para InnoDB, con una consecuencia distinta
> [[1.11.04 - Control de concurrencia y niveles de aislamiento|1.11.04]] § 6 ya estableció que
> **InnoDB también usa MVCC** —sus lectores no bloquean ni se bloquean, igual que en PostgreSQL—.
> Lo que este slide agrega es que en PostgreSQL la MVCC hace un trabajo **extra** que en InnoDB no
> hace: **elimina la necesidad de un log de undo separado**. La diferencia está en qué hace cada
> motor con las versiones viejas de una fila:
>
> | | PostgreSQL | InnoDB |
> | --- | --- | --- |
> | ¿Usa MVCC para lecturas consistentes? | ✓ | ✓ *(1.11.04 § 6)* |
> | ¿Dónde vive la versión vieja de una fila? | **en la propia tabla** (tupla vieja, marcada muerta) | en el **undo log** (tablespace separado) |
> | ¿Hace falta un log de undo aparte? | ✗ — abortar es "no aplicar" | ✓ — InnoDB modifica la fila **in place** y necesita el valor viejo en otro lado |
> | ¿Quién limpia las versiones viejas? | `VACUUM` | *purge* del undo log |
>
> Es la razón de fondo por la que la comparativa del slide 12 pone *"MVCC — sin log de undo
> separado"* del lado de PostgreSQL y *"Undo log dedicado"* del lado de MySQL: **las dos usan MVCC,
> pero solo una la usa también como mecanismo de recovery.**

### Slide 9 · El WAL es más que recovery

> [!quote] Textual
> *"El mismo mecanismo que garantiza durability se reutiliza para otras tres cosas clave:"*
>
> **Replicación streaming** — *"Los registros de WAL se envían a réplicas y se re-aplican allá — el
> mismo mecanismo de redo."*
>
> **PITR** — *"Point-In-Time Recovery: pg_basebackup + archivado continuo de WAL para volver a
> cualquier instante."*
>
> **Replicación lógica** — *"Decodificación del WAL a nivel fila (logical decoding), para replicar
> hacia otros sistemas."*
>
> *"Idea clave: recovery, replicación y PITR no son mecanismos distintos — son tres formas de
> reproducir la misma secuencia de cambios físicos."*

Es la idea que distingue a PostgreSQL en la comparativa del slide 12, fila *"Log para replicación /
PITR"*: **el mismo WAL** sirve para las tres cosas. En MySQL, como muestra el bloque 05, esa función
la cumple un log **distinto**: el *binlog*.

---

## 05 · MySQL / InnoDB *(Slides 10–11)*

### Slide 10 · Más de un log, cada uno con su rol

> [!quote] Textual
> *"A diferencia de Postgres, InnoDB usa varios mecanismos separados — es la parte que más confunde
> en el examen."*

| Log | Nombre técnico *(textual)* | Qué es *(textual)* |
| --- | --- | --- |
| **Redo log** | `ib_logfile` / `#innodb_redo` | *"El WAL propiamente dicho: cambios físicos a páginas, en buffer circular de tamaño fijo. Usado en crash recovery para redo."* |
| **Undo log** | tablespaces de undo | *"Valores anteriores de las filas. Sirve para rollback Y para dar snapshots MVCC a lecturas consistentes."* |
| **Doublewrite buffer** | área contigua previa | *"Protege contra partial page writes: escribe la página primero en un área auxiliar antes que en su lugar final."* |
| **Binary log (binlog)** | log lógico, separado | *"NO es el mecanismo de crash recovery. Es para replicación y PITR — statement o row-based."* |

> [!note] El undo log hace **dos** trabajos, y el slide los da en una sola frase
> *"Sirve para rollback Y para dar snapshots MVCC"*: es la confirmación textual del punto que
> [[1.11.04 - Control de concurrencia y niveles de aislamiento|1.11.04]] documentó por el lado de
> concurrencia —InnoDB reconstruye una versión anterior de una fila leyendo su *undo log*— y que este
> deck documenta por el lado de recovery —esa misma cadena de versiones es lo que un `ROLLBACK`
> recorre—. Un solo log, dos consumidores.

### Slide 11 · Recovery en InnoDB: ARIES completo

> [!quote] Textual
> *"InnoDB hace checkpoint difuso (fuzzy checkpointing) de forma continua. Al reiniciar tras un
> crash:"*

| Fase | Con qué *(textual)* |
| --- | --- |
| **Analysis** | *"Ubica el último checkpoint"* |
| **Redo** | *"Con el redo log"* |
| **Undo** | *"De transacciones no comprometidas, con el undo log"* |

> [!bug] (crítico) Gotcha clásico de examen — textual, completo
> *"Redo log ≠ Binlog. El redo log es el WAL físico usado en crash recovery. El binlog es un log
> lógico separado, usado para replicación / PITR. Mantener ambos consistentes requiere un
> **two-phase commit interno** entre redo log y binlog — algo que Postgres no necesita, porque tiene
> un único WAL."*

> [!important] (clave) El *gotcha*, desarmado en una tabla *(propuesta propia: el detalle del estado
> "prepared" y el resto de las filas no están en el slide, que solo da el párrafo citado arriba)*
> | | Redo log | Binlog |
> | --- | --- | --- |
> | Nivel | **físico**: cambios de bytes en páginas InnoDB | **lógico**: sentencias o filas cambiadas |
> | Para qué sirve | *crash recovery* — la fase **Redo** de ARIES | replicación *(a réplicas MySQL)* y PITR *(restaurar un backup + reproducir binlogs)* |
> | Formato del archivo | `ib_logfile*` / `#innodb_redo`, tamaño fijo, circular | `binlog.000001…`, crece, se rota |
> | Motor que lo escribe | **InnoDB**, siempre que hay `autocommit`/`COMMIT` | **el servidor MySQL**, independiente del *storage engine* |
> | Se puede desactivar | no *(es el WAL)* | sí — `log_bin` puede estar apagado en un servidor sin réplicas |
> | Qué pasa si se desincronizan | InnoDB puede recuperar una transacción que el binlog no registró, o viceversa: una réplica quedaría con datos distintos del primario | por eso el **two-phase commit interno**: el *commit* del redo log queda en estado *prepared*, se escribe el binlog, y solo entonces el redo log pasa a *committed* — así los dos logs siempre coinciden en qué transacciones "pasaron" |
>
> Es la razón por la que PostgreSQL, con **un único WAL** que sirve para las tres cosas *(slide 9)*,
> no necesita ese *two-phase commit* interno: no hay un segundo log con el que sincronizarse.

> [!tip] (clave) Verificado en MySQL 9.7.2
> Los cuatro mecanismos del slide 10 y el gotcha del 11 **están activos por defecto** (corrida real):
>
> | Variable | Valor verificado | Qué confirma |
> | --- | --- | --- |
> | `SELECT @@version;` | `9.7.2` | coincide con la versión que citan [[MySQL]] y las páginas de la Clase 11 |
> | `SHOW VARIABLES LIKE 'innodb_doublewrite';` | `ON` | el *doublewrite buffer* del slide 10 está activo |
> | `SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';` | `1` | el *redo log* se fuerza a disco (`fsync`) en **cada** `COMMIT` — el ajuste más estricto, el que hace al slide 4 literal |
> | `SHOW VARIABLES LIKE 'innodb_redo_log_capacity';` | `104857600` *(100 MB)* | el tamaño del *buffer circular* del redo log — reemplaza a la vieja `innodb_log_file_size`, que en 9.7 **ya no existe como variable** *(verificado: consulta vacía)* |
> | `SHOW VARIABLES LIKE 'sync_binlog';` | `1` | el binlog también se fuerza a disco en cada *commit* — la otra mitad del *two-phase commit* interno |
> | `SHOW VARIABLES LIKE 'log_bin';` | `ON` | el binlog está activo por defecto, aunque no haya réplicas configuradas |
> | `SELECT @@transaction_isolation;` | `REPEATABLE-READ` | coincide con el default documentado en [[1.11.04 - Control de concurrencia y niveles de aislamiento\|1.11.04]] § 6 |
> | `SHOW VARIABLES LIKE '%undo%';` | `innodb_max_undo_log_size = 1073741824` *(1 GB)* · `innodb_undo_directory = ./` · `innodb_undo_log_encrypt = OFF` · `innodb_undo_log_truncate = ON` | el *undo log* del slide 10 existe como tablespace, con purga automática; `innodb_undo_tablespaces` **ya no aparece** como variable configurable en 9.7 *(verificado: consulta vacía)* |
>
> No verificado en un servidor PostgreSQL: los parámetros del slide 8 —`wal_level`,
> `checkpoint_timeout`, `synchronous_commit`— quedan verificados solo contra la documentación
> oficial. Ver § *Dudas abiertas*.

---

## 06 · Comparativa *(Slide 12)*

> [!quote] Textual, completo — transcripción celda por celda
>
> | | PostgreSQL | MySQL / InnoDB |
> | --- | --- | --- |
> | **Log físico principal** | WAL (pg_wal/) | Redo log (ib_logfile) |
> | **Deshacer Tx abortadas** | MVCC — sin log de undo separado | Undo log dedicado |
> | **Log para replicación / PITR** | El mismo WAL | Binlog (log lógico separado) |
> | **Protección partial writes** | full_page_writes | Doublewrite buffer |
> | **Algoritmo de recovery** | Redo-only (variante, gracias a MVCC) | ARIES completo (analysis–redo–undo) |

Es la tabla que resume las secciones 04 y 05: **una fila por cada punto que las separa**, y ninguna
fila donde coincidan del todo — ni siquiera en la protección contra escrituras parciales, donde
las dos resuelven el mismo problema con nombres y mecanismos distintos *(`full_page_writes`
reescribe la página entera en el WAL la primera vez que se toca tras un checkpoint; el *doublewrite
buffer* la escribe dos veces, en un área auxiliar y en su lugar final)*.

> [!note] "Redo-only" no significa "sin undo": significa que MVCC hace ese trabajo por otro lado
> La fila *"Algoritmo de recovery"* llama a PostgreSQL **"redo-only (variante)"** porque, al
> reiniciar, PostgreSQL solo necesita rehacer *(redo)* lo que el WAL registró desde el último
> checkpoint — no hay una fase de *undo* explícita como en ARIES. Eso **no** significa que las
> transacciones abortadas queden con cambios aplicados: MVCC ya resolvió eso en otro momento, al no
> haber marcado esas tuplas como visibles. Es la misma idea del slide 8, repetida aquí en una palabra.

---

## Para llevarse *(Slide 13)*

> [!quote] Textual, completo
>
> **El log siempre va primero** — *"WAL no es un detalle de implementación: es la razón por la cual
> el buffer pool puede ser volátil sin romper durability."*
>
> **Un log puede servir para todo** — *"Postgres reutiliza el mismo WAL para recovery, replicación y
> PITR. Diseñar bien el log de antemano paga dividendos."*
>
> **Undo no siempre es un log** — *"MVCC (Postgres) y undo logs (InnoDB) son dos formas válidas de
> resolver Atomicity — no hay una única receta correcta."*

Las tres ideas cierran, en ese orden, los tres bloques del deck: la primera es el § 01–02 *(por qué
hace falta el log)*, la segunda es el § 04 *(PostgreSQL, un log para todo)*, la tercera es el § 04
vs. 05 *(dos soluciones válidas al mismo problema de Atomicity)*.

## Slide 14 · Cierre

> [!quote] Textual, completo
> *"¿Preguntas?"* — *"Bases de Datos II · ITBA — Recovery y Write-Ahead Logging"*

---

## Relación con la Clase 11 y con la concurrencia

> [!important] (clave) Este deck completa la fila ACID de [[1.11.03 - Transacciones y ACID|1.11.03]]
> | Letra | Lo que dijo la Clase 11 *(slides 16–17)* | Lo que este deck agrega |
> | --- | --- | --- |
> | **A**tomicidad | *"todo o nada"*; el motor, con `ROLLBACK` y el log de *undo* | **cómo**: en InnoDB, el *undo log* del slide 10; en PostgreSQL, no aplicar los cambios de tuplas invisibles *(slide 8)* |
> | **D**urabilidad | *"confirmado = persistido"*; el motor, con el log de *redo* y `fsync` | **cómo**: la regla de oro del slide 4 —loguear y `fsync` **antes** de confirmar— y el *redo log*/WAL de los slides 10 y 8 |
>
> La **C** *(consistencia — restricciones e integridad, Clases 09–10)* y la **I** *(aislamiento —
> [[1.11.04 - Control de concurrencia y niveles de aislamiento|1.11.04]])* quedan fuera de este
> deck: son temas de otro par de clases. Con esto, las cuatro letras de ACID tienen ya una página que
> explica **quién** las garantiza y **cómo**.

> [!tip] El puente con el MVCC de 1.11.04, resumido en una frase
> [[1.11.04 - Control de concurrencia y niveles de aislamiento|1.11.04]] documentó el MVCC de InnoDB
> desde el ángulo de la **concurrencia** —por qué un `SELECT` no bloquea—; este deck lo documenta
> desde el ángulo del **recovery** —por qué esas mismas versiones viejas sirven también, en
> PostgreSQL, para no necesitar un log de *undo*—. Es el mismo mecanismo, visto por dos slides
> distintos de dos clases distintas.

## El desfasaje de motor: aquí no hay uno escondido

> [!note] Deck que nombra y compara los dos motores en pie de igualdad, sin ocultarlo
> El resto de la unidad tiene once decks de trece (sin contar este) con motor ajeno **sin avisar** —PostgreSQL, Oracle
> o T-SQL presentados como si fueran genéricos— según el inventario de `CLAUDE.md` § *Puntos
> abiertos*. Este deck es distinto: **nombra los dos motores en su propio título** y les dedica una
> sección a cada uno, con la misma extensión. La cursada corre sobre **MySQL**, así que el § 05 es el
> motor de casa y el § 04 es material de comparación explícita — no hay nada que el deck presente
> como "genérico" y en realidad sea de otro motor. La única asimetría es de **orden**: PostgreSQL se
> desarrolla primero *(slides 8–9)* y MySQL después *(10–11)*, aunque el motor de la cursada sea el
> segundo. No es el único deck de la unidad que nombra dos motores explícitamente —la propia
> [[Clase 11 - Seguridad-Transacciones|Clase 11]], del mismo día, rotula sus slides 29 y 30 como
> ejemplos en SQL Server y PostgreSQL—, pero sí es el que les dedica una sección completa a cada uno
> en vez de un par de slides sueltos.

## Bibliografía verificada

Todo contra las fichas de `raw/Material_Catedra/bibliografia/` y, donde el vault no tiene ficha,
contra la documentación oficial por URL — mismo criterio que usa [[MySQL]] § *Bibliografía de
MySQL*.

| Fuente | Sección | Impresas | Qué aporta a esta página |
| --- | --- | ---: | --- |
| ★ GMUW | **17.1** *Issues and Models for Resilient Operation* — 17.1.1 *Failure Modes* · 17.1.4 *The Primitive Operations of Transactions* | 843–850 | el problema del *buffer pool* volátil del slide 3; ya citada en [[1.11.03 - Transacciones y ACID\|1.11.03]] |
| ★★ GMUW | **17.2** *Undo Logging* — 17.2.1 *Log Records* · 17.2.3 *Recovery Using Undo Logging* · 17.2.4–17.2.5 *Checkpointing* | 851–862 | la anatomía de un *log record* (slide 5, con el valor viejo) y el *undo log* de InnoDB (slide 10) |
| ★★ GMUW | **17.3** *Redo Logging* — 17.3.1 *The Redo-Logging Rule* · 17.3.2 *Recovery With Redo Logging* · 17.3.3–17.3.4 *Checkpointing* | 863–868 | la regla de oro del WAL (slide 4, con el valor nuevo) y el *redo log*/WAL de los slides 8 y 10 |
| ★★ GMUW | **17.4** *Undo/Redo Logging* — 17.4.1 *The Undo/Redo Rules* · 17.4.2 *Recovery With Undo/Redo Logging* · 17.4.3 *Checkpointing* | 869–874 | el pariente más cercano del vault al esquema de log de ARIES (slide 6, 11): un log que guarda valor viejo y nuevo. GMUW **no** desarrolla ARIES en el cuerpo (lo cita en § 17.7 como fuente primaria) ni rehace "todo" en el redo — ver el callout de § *03 · ARIES* — y el algoritmo del slide generaliza esta sección (Mohan et al. 1992, no está en el vault) |
| GMUW | **17.5** *Protecting Against Media Failures* — 17.5.1 *The Archive* · 17.5.3 *Recovery Using an Archive and Log* | 875–879 | el *backup* + archivado continuo que sostiene el PITR del slide 9 |
| ★ Date | **15.3** *Transaction Recovery* | 450–453 | *undo*/*redo* desde el ángulo de Date, complementa a GMUW 17.2–17.4 |
| ★★ Date | **15.4** *System Recovery* | 453–455 | **exactamente el escenario del deck**: recuperación tras un crash del sistema, con checkpoints; su apartado *"ARIES"* (455) nombra el algoritmo, sus tres fases y el *repeating history* |
| ★ Date | **15.5** *Media Recovery* | 455–456 | el *backup* + archivado del otro lado del PITR (slide 9) |
| Date | **15.6** *Two-Phase Commit* | 456–457 | (atención) es *two-phase commit* **distribuido**, entre nodos — no el mismo mecanismo que el *"two-phase commit interno"* entre *redo log* y *binlog* del slide 11, pero es el concepto de dos fases que ese gotcha invoca por nombre |
| — Silberschatz cap. 1 | — | — | **verificado**: el vault solo tiene el capítulo 1 (introductorio); no llega a un capítulo de recuperación. `—` en el mapeo |
| — *Seven Databases* 2ª ed. | — | — | **verificado contra la ficha**: sin apariciones de *wal* / *recovery* / *crash* / *durab-* con contenido técnico de PostgreSQL en las secciones que el vault indexó de este libro. `—` en el mapeo |
| — Corbellini et al. 2017 | — | — | **verificado contra la ficha**: sin *recovery*/*logging* de motores relacionales; su § 5.1.2 tiene *"redo points"*, pero es de **BigTable** (Google — *commit log*, *memtable*), no de Cassandra: Cassandra solo aparece en § 5.2, como una de las tres wide-column que el paper compara. Otro motor y otra unidad de todos modos. `—` en el mapeo |
| MySQL 9.7 Reference Manual *(sin ficha; verificado por URL, 25/09)* | **§ 17.4** *InnoDB Architecture* · **§ 17.6.4** *Doublewrite Buffer* · **§ 17.6.5** *Redo Log* · **§ 17.6.6** *Undo Logs* · **§ 7.4.4** *The Binary Log* | — | la sección 05 del deck, sección por sección |
| PostgreSQL 18 Documentation *(sin ficha; verificado por URL, 25/09)* | Cap. **28** *Reliability and the Write-Ahead Log* § **28.3** *Write-Ahead Logging (WAL)* · Cap. **19** § **19.5** *Write Ahead Log* (`wal_level`, `checkpoint_timeout`, `synchronous_commit`) · Cap. **25** § **25.3** *Continuous Archiving and Point-in-Time Recovery (PITR)* | — | la sección 04 del deck, sección por sección |

**Lectura mínima sugerida** *(≈ 26 páginas)*: GMUW cap. 17.2–17.4 completo *(851–872, ~21 páginas)*
para el mecanismo detrás de ARIES, más Date cap. 15.3–15.4 *(450–455, ~5 páginas)* para el mismo
tema desde otro autor. GMUW cap. 17.5 y Date cap. 15.5–15.6 solo si el parcial pregunta por *media failures*
o *two-phase commit* distribuido, que el deck no desarrolla.

## Dudas abiertas

- [x] (ok) ~~**¿Entra la recuperación?**~~ *(duda heredada de
  [[Clase 11 - Seguridad-Transacciones]] § *Dudas abiertas* y de [[1.11.04 - Control de concurrencia y niveles de aislamiento|1.11.04]])*.
  **Sí: tiene deck propio, es esta página.**
- [ ] **¿Entran deadlocks y 2PL?** Siguen sin un deck dedicado — el slide 15 de la Clase 11 los
  presupone como causa de fallo, pero ninguna de las dos clases desarrolla el mecanismo (GMUW cap. 18.3.3
  y 19.2, no dictados). Ver [[1.11.04 - Control de concurrencia y niveles de aislamiento|1.11.04]]
  § *Dudas abiertas*.
- [ ] (crítico) **¿"ARIES" entra por nombre en el parcial, o alcanza con describir análisis-redo-undo?**
  El deck lo nombra y Date cap. 15.4 también (con las tres fases); ningún examen viejo del vault lo
  pregunta.
- [ ] (crítico) **Lo de PostgreSQL no se verificó en un servidor real**: `wal_level`,
  `checkpoint_timeout`, `synchronous_commit` y `full_page_writes` quedan verificados solo contra la
  documentación oficial de PostgreSQL 18, no contra un `SHOW` en un servidor real. Si se arma un
  contenedor de Postgres para la cursada, repetir la verificación que sí se hizo del lado MySQL.
- [ ] **¿El *"two-phase commit interno"* del slide 11 se explicó en clase con más detalle** —el
  estado *prepared* del *redo log* entre el `COMMIT` de InnoDB y la escritura del *binlog*— o el
  parcial solo pide la frase *"redo log ≠ binlog"*?
- [ ] **¿Se pide el detalle de `full_page_writes` vs. *doublewrite buffer*** —qué escriben, cuándo,
  y por qué ambos existen— o alcanza con nombrarlos como equivalentes en la comparativa del slide 12?
- [x] ~~**Verificar si 9.7 todavía acepta `innodb_log_file_size`** como alias retrocompatible de
  `innodb_redo_log_capacity`.~~ (ok) No: `mysqld --no-defaults --validate-config
  --innodb-log-file-size=50331648` en MySQL 9.7.2 responde `[ERROR] [MY-000067] unknown variable
  'innodb-log-file-size=50331648'` y sale con código 1; con `--innodb-redo-log-capacity=104857600`
  sale con 0. Solo existe `innodb_redo_log_capacity`.

## Enlaces

- Clase hermana, mismo día *(07/09)*: [[Clase 11 - Seguridad-Transacciones]] *(slides 16–20, ACID —
  la A y la D que este deck explica)* · clase anterior: [[Clase 10 - Restricciones integridad-Parte 2]]
  *(31/08)* · clase siguiente: [[Clase 12 - Introduccion a NoSQL]] *(14/09)*
- Práctica de esa semana (martes 08/09): [[Práctica 2026-09-08]] *(TP8 Seguridad — no ejercita
  recovery)*
- Conceptos: [[1.11.03 - Transacciones y ACID|Transacciones y ACID]] *(la A y la D, ahora con
  mecanismo)* · [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia
  y niveles de aislamiento]] *(el MVCC de InnoDB, contrastado aquí con el de PostgreSQL)* ·
  [[1.11.05 - Recovery y write-ahead logging (WAL)|Recovery y write-ahead logging (WAL)]] *(concepto
  nuevo, primera aparición en esta clase)* ·
  [[1.11.06 - ARIES — análisis, redo y undo|ARIES — análisis, redo y undo]] *(concepto nuevo, primera
  aparición en esta clase)*
- Motores: [[MySQL]] § *8 · Transacciones* *(MVCC, `REPEATABLE READ`; sección a ampliar con *redo
  log*, *undo log*, *doublewrite buffer* y *binlog*)* · [[PostgreSQL]] *(sección a ampliar con WAL,
  checkpoints, replicación y PITR)*
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] · calendario:
  [[_cronograma]]
