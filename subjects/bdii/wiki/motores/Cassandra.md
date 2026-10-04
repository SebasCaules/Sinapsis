---
tipo: motor
resumen: "Motor wide-column de la Unidad-03 (Clase 15, TP10): setup con Docker y cqlsh, versión 5.0.9 (lo que baja docker pull cassandra), sin autenticación en la imagen, y la tabla que contrasta el deck (USING CONSISTENCY, supercolumnas, RandomPartitioner, vistas materializadas) con el motor real."
motor: Cassandra
rol: motor wide-column (familias de columnas) de la segunda mitad; abre la Unidad-03
version: "sin fijar por la cátedra — el deck no declara versión; `docker pull cassandra` sin tag trae 5.0.9 (29/09/2026, verificado con `SELECT release_version FROM system.local` y en Docker Hub)"
paradigma: columnar / wide-column (NoSQL)
clases: [15]
tps: [TP10]
aliases:
  - Cassandra
  - Apache Cassandra
  - cqlsh
  - CQL
  - Cassandra Query Language
  - Setup Cassandra
  - Cassandra en Docker
  - Motor wide-column
fuentes:
  - "raw/Unidad-03/Teorica/BD2_Clase 15 - Introduccion a Cassandra.pdf"
  - "raw/Unidad-03/Practica/ITBA TP 10 - Cassandra Parte I.pdf"
  - "raw/Material_Catedra/bibliografia/papers/Corbellini et al (2017) - Persisting big-data, The NoSQL landscape.pdf"
  - "raw/Material_Catedra/programa/Cronograma 2026-2C.pdf"
  - "raw/Examenes_Viejos/1C-26/Parcial/BDII Parcial - 1Q2026.pdf"
  - "raw/Examenes_Viejos/1C-26/Recu/WhatsApp Video 2026-09-29 at 11.06.33.mp4"
estado: procesado
---

# Cassandra — el motor *wide-column* de la segunda mitad

## Resumen general

Apache Cassandra es el segundo motor NoSQL de la cursada y el que abre la `Unidad-03`: lo presenta
la [[Clase 15 - Introduccion a Cassandra|Clase 15]] (lunes 28/09, deck *"Bases de Datos
Tabulares"*) y lo ejercita el TP10, en dos partes (29/09 y 06/10), sobre `cqlsh`. Entra al parcial del
13/10: los exámenes viejos preguntan por sus componentes, la fórmula del QUORUM, la clave primaria y
el `WHERE` sin clave de partición, y el 1C 2026 le dedicó seis preguntas del parcial y tres del
recuperatorio (§ *En los exámenes*).

La cátedra no fija versión: el TP pide `docker pull cassandra` sin *tag*, que hoy trae la **5.0.9**
(`cqlsh` 6.2.0, CQL 3.4.7). Sobre esa versión se corrió todo lo que esta página afirma. Tres hechos
del motor que el material no dice: la imagen oficial **no trae autenticación activada** (el
`cassandra`/`cassandra` del TP se acepta, pero también cualquier otra credencial); `CREATE INDEX`
sin `USING` crea el índice secundario *legacy* y no el SAI que agrega la 5.0; y las **vistas
materializadas vienen deshabilitadas**.

El deck mezcla CQL vigente con terminología y sintaxis de versiones viejas: supercolumnas (del
modelo de la API Thrift, eliminada en la 4.0), `USING CONSISTENCY` dentro del `SELECT` (CQL 2,
eliminado en la 2.2), la reparación de lectura en segundo plano (eliminada en la 4.0) y
`RandomPartitioner` y `OrderPreservingPartitioner` como si fueran las opciones de hoy. La tabla
*Deck vs. motor* dice, fila por fila, qué corre, qué da error y qué se escribe en su lugar. Para el
parcial: Cassandra es **AP con consistencia configurable** por operación, el QUORUM es `(RF/2)+1` con división entera, y
la clave primaria se divide en clave de partición (qué nodo) y clave de *clustering* (en qué orden
dentro de la partición).

## Setup, tal como lo da la práctica

### Versión

| Qué | Valor | Cómo se verificó |
| --- | --- | --- |
| Lo que declara el deck | ninguna versión | lectura de los 74 slides |
| Lo que baja `docker pull cassandra` | **5.0.9** | `SELECT release_version FROM system.local;` → `5.0.9`; la imagen local `cassandra:latest` tiene el mismo ID que `cassandra:5.0`; Docker Hub lista `latest` → `5.0.9`, `5.0`, `5` (<https://hub.docker.com/_/cassandra>) |
| `cqlsh` / CQL / protocolo | `cqlsh` 6.2.0 · CQL spec 3.4.7 · protocolo nativo v5 | `SHOW VERSION` → `[cqlsh 6.2.0 \| Cassandra 5.0.9 \| CQL spec 3.4.7 \| Native protocol v5]` |
| Particionador | `org.apache.cassandra.dht.Murmur3Partitioner` | `SELECT partitioner FROM system.local;` |

### Levantar el motor con Docker *(TP10, p. 1)*

```bash
docker pull cassandra
docker network create network-cassandra
docker run --name Mycassandra --network network-cassandra -d cassandra
docker exec -it Mycassandra bash      # dentro del contenedor: cqlsh
docker stop Mycassandra ; docker start Mycassandra
docker ps -a                          # el PDF lo trae con guion medio (–a) y así falla

# DataGrip (u otro cliente en el host): publicar el puerto 9042
docker run --name Mycassandra -p 9042:9042 -d cassandra
```

Verificado en [[Práctica 2026-09-29]] § *Setup del entorno*: el nodo tarda unos 60 s en aceptar
conexiones; la red sin `-p` no publica puertos al host (sirve para conectar **otro contenedor** por
nombre, `docker run --rm --network network-cassandra cassandra cqlsh Mycassandra`, el patrón de
Docker Hub); y el comando de DataGrip **choca** con el contenedor anterior por el nombre
(`Conflict. The container name "/Mycassandra" is already in use …`).

### Autenticación: desactivada en la imagen

| Parámetro de `/etc/cassandra/cassandra.yaml` | Valor en la imagen | Efecto verificado |
| --- | --- | --- |
| `authenticator` | `AllowAllAuthenticator` | `cqlsh -u cassandra -p cassandra` conecta; `cqlsh -u noexiste -p cualquiera` también; sin credenciales, también |
| `authorizer` | `AllowAllAuthorizer` | cualquier conexión puede crear y borrar *keyspaces* |
| `role_manager` | `CassandraRoleManager` | el rol `cassandra` existe en `system_auth.roles` (superusuario), pero nadie lo exige |

La documentación oficial lo confirma: por defecto Cassandra usa `AllowAllAuthenticator`, que *"performs
no authentication checks and therefore requires no credentials"*; el usuario y la clave `cassandra`
solo rigen con `authenticator: PasswordAuthenticator` y un reinicio
(<https://cassandra.apache.org/doc/latest/cassandra/managing/operating/security.html>). Consecuencia:
los comandos de roles del slide 49 **no corren** en la imagen tal como viene (ver *Deck vs. motor*).

### Puertos

| Puerto | Para qué | En la imagen 5.0.9 |
| --- | --- | --- |
| **9042** | protocolo nativo CQL: `cqlsh`, drivers, DataGrip | escucha (`native_transport_port: 9042`) |
| 7000 | comunicación entre nodos (*gossip*, réplicas) | escucha |
| 7199 | JMX (`nodetool`) | escucha |
| 9160 | Thrift, la API anterior a CQL | **declarado** en la imagen (`EXPOSE`) pero **nadie escucha**: Thrift se eliminó en la 4.0 |

*(Verificado leyendo `/proc/net/tcp` dentro del contenedor y `docker image inspect cassandra`.)*

## `cqlsh` — comandos útiles

`cqlsh` acepta CQL y además *comandos especiales* propios del cliente, que no son CQL. Todos están
en la página oficial de `cqlsh`, versión 5.0
(<https://cassandra.apache.org/doc/latest/cassandra/managing/tools/cqlsh.html>). Salidas reales:

| Comando | Qué hace | Salida real (extracto) |
| --- | --- | --- |
| `SHOW HOST` | clúster, IP y puerto del nodo conectado | `Connected to Test Cluster at 127.0.0.1:9042` |
| `SHOW VERSION` | versiones de `cqlsh`, Cassandra, CQL y protocolo | `[cqlsh 6.2.0 \| Cassandra 5.0.9 \| CQL spec 3.4.7 \| Native protocol v5]` |
| `DESCRIBE KEYSPACES` · `DESC TABLES` | lista *keyspaces* o tablas del *keyspace* actual | `system  system_auth  system_distributed …` |
| `DESCRIBE KEYSPACE k` · `DESCRIBE TABLE t` · `DESCRIBE INDEX i` | el DDL completo, con todas las opciones por defecto | `CREATE KEYSPACE … AND durable_writes = true;` |
| `CONSISTENCY` · `CONSISTENCY QUORUM` | muestra o fija el nivel de consistencia de la sesión | `Current consistency level is ONE.` · `Consistency level set to QUORUM.` |
| `TRACING ON` | agrega el trazado de cada consulta: qué nodos, qué rangos, cuántas filas y *tombstones* leyó | `Read 3 live rows and 1 tombstone cells` |
| `EXPAND ON` | una columna por renglón (útil con tablas anchas) | `@ Row 1` / `idusuario \| agp88` … |
| `SOURCE 'archivo.cql'` | ejecuta un archivo de sentencias | la salida de cada sentencia |
| `PAGING` | paginado de resultados | `PAGING is ON` / `Page size: 100` |
| `COPY t TO STDOUT WITH HEADER = true` | exporta (o `FROM` importa) CSV | `id,players` / `1,4` / `2,6` |
| `HELP` | lista los comandos especiales y los temas de ayuda de CQL | `Documented shell commands:` / `CAPTURE  CLS  COPY  DESCRIBE  EXPAND …` |
| `CAPTURE 'archivo'` | guarda la salida de las consultas en un archivo | no se corrió |

Fuera del modo interactivo, lo que usa este vault para verificar:
`docker exec -i <contenedor> cqlsh -e "…"`, `-k <keyspace>` para fijar el *keyspace* y
`docker exec -i <contenedor> cqlsh < archivo.cql` para un script entero.

## Qué TPs corren sobre Cassandra

| TP | Práctica | Teórica | Estado |
| --- | --- | --- | --- |
| **TP10 Parte I** | [[Práctica 2026-09-29]] (martes 29/09) | [[Clase 15 - Introduccion a Cassandra\|Clase 15]] (28/09) | ✓ resuelto y corrido en 5.0.9: los 18 pasos corren sin cambios |
| **TP10 Parte II** | martes 06/10 | *Conceptos teóricos de Cassandra* (05/10, según [[_cronograma]]) | pendiente: el enunciado todavía no está en `raw/` |

## Deck vs. motor

Cada fila se corrió en Cassandra 5.0.9 o se contrastó con un documento oficial. `NEWS.txt` es el
registro de cambios que viaja con cada versión: está dentro de la imagen (`/opt/cassandra/NEWS.txt`)
y en el repositorio (<https://github.com/apache/cassandra/blob/cassandra-5.0/NEWS.txt>).

| Slide | El deck muestra | En 5.0.9 | Evidencia |
| :---: | --- | --- | --- |
| 12 | los nodos se reparten los *tokens* *"de -2⁶³ a 2⁶³"* | (atención) menor: con el particionador por defecto (`Murmur3Partitioner`) el reparto es ese, pero el *token* es un entero de 64 bits con signo, de −2⁶³ a **2⁶³−1** | el trazado de un recorrido completo muestra `min(-9223372036854775808)` (= −2⁶³); `token(id)` devuelve valores como `-8684286806439741081` |
| 13 | la *shell* se llama *"cqlshell"*; herramienta gráfica **DevCenter** | el binario es **`cqlsh`** (6.2.0). DevCenter no se verificó; el TP10 usa DataGrip | `cqlsh --version` |
| 20 | `CREATE COLUMNFAMILY MisColumnas (…)` y la salida `id \| nombre \| apellido` · `(1 fila)` | ✓ `CREATE COLUMNFAMILY` se sigue aceptando como sinónimo de `CREATE TABLE`. Pero la salida real es `id \| apellido \| nombre` · `(1 rows)`: los nombres sin comillas pasan a minúsculas (`MiEspacioClaves` → `miespacioclaves`, `Apellido` → `apellido`) y `SELECT *` ordena las columnas no clave alfabéticamente. Con RF 3 en un nodo avisa `Your replication factor 3 for keyspace … is higher than the number of nodes 1` | corrida del slide completo |
| 39 | *"LLTS"*: datos con *"fecha de caducidad"* | es el **TTL**: `INSERT … USING TTL 3600` y `SELECT TTL(col)` → `3600` | corrida |
| 42, 45 | *"Background read repair request"*; en la tabla de lectura, *"Por defecto, se ejecuta una 'reparación de lectura' en segundo plano"* | ✗ la reparación en segundo plano **se eliminó en la 4.0**: `ALTER TABLE … WITH read_repair_chance = 0.1;` → `SyntaxException: Unknown property 'read_repair_chance'`. Queda la reparación **bloqueante**: las tablas nacen con `read_repair = 'BLOCKING'` y, si las réplicas consultadas no coinciden, la lectura espera a que se escriba la reparación. Además corrige **solo las réplicas que participaron de la lectura**: *"it is made only on the replicas that are not up-to-date and that are involved in the read request"*; una réplica vieja que no se consultó sigue vieja hasta otra lectura, un *hint* o `repair` | corrida · `NEWS.txt` 4.0: *"Background repair has been removed"* · doc oficial, *Read repair* (<https://cassandra.apache.org/doc/latest/cassandra/managing/operating/read_repair.html>): *"Background read repair, which was configured using `read_repair_chance` and `dclocal_read_repair_chance` settings in `cassandra.yaml` is removed Cassandra 4.0"* · la reparación de réplicas no consultadas, en un clúster de tres nodos: [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura]] M8 |
| 45 | `SELECT * FROM users WHERE state='TX' USING CONSISTENCY QUORUM;` | ✗ `SyntaxException: line 1:37 no viable alternative at input 'USING'`. La consistencia ya no va en la sentencia: en `cqlsh`, `CONSISTENCY QUORUM` antes de la consulta; en un *driver*, como opción de la sentencia o de la sesión | corrida · `NEWS.txt` 2.2: *"CQL2 has been removed entirely in this release"* |
| 45–46 | QUORUM = `(sum_of_replication_factors / 2) + 1` · `(replication_factor/2)+1` | ✓ con división entera. Con RF 3 en un solo nodo: `Cannot achieve consistency level QUORUM` … `'required_replicas': 2, 'alive_replicas': 1` (3/2+1 = 2) | corrida · doc oficial: *"A majority (n/2 + 1) of the replicas must respond"* (<https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html>) |
| 45–46 | niveles `ANY`, `ONE`/`TWO`/`THREE`, `QUORUM`, `LOCAL_QUORUM`, `EACH_QUORUM`, `ALL` | ✓ existen todos; `ANY` solo para escribir (al leer: `ANY ConsistencyLevel is only supported for writes`). `HELP CONSISTENCY` agrega `LOCAL_ONE`, `SERIAL` y `LOCAL_SERIAL`, que el deck no nombra. `CONSISTENCY GLOBAL_QUORUM;` y `CONSISTENCY NONE;` → `Improper CONSISTENCY command.`: esos niveles no existen | corrida (`HELP CONSISTENCY` en `cqlsh` 6.2.0) |
| 49 | `CREATE ROLE alice WITH PASSWORD = 'password_a' AND LOGIN = true;`, `CREATE USER …`, `GRANT`, `LIST ROLES` | ✗ en la imagen por defecto: `org.apache.cassandra.auth.CassandraRoleManager doesn't support PASSWORD`; `CREATE USER … SUPERUSER` → `Only superusers can create a role with superuser status`; `GRANT` y `LIST ROLES` → `You have to be logged in and not anonymous to perform this request` | corrida. Hace falta `PasswordAuthenticator` (y `CassandraAuthorizer` para `GRANT`): doc oficial de seguridad |
| 50, 53 | supercolumnas: *"columnas que almacenan subcolumnas"* (el propio slide 50 desaconseja su uso) | no existen en CQL: ninguna sentencia las crea. Eran parte del modelo de la API Thrift, **eliminada en la 4.0**; el puerto 9160 ya no escucha. Lo que sobrevive del almacenamiento viejo es `WITH COMPACT STORAGE`, que 5.0.9 todavía acepta, pero `DESCRIBE` avisa `constructs not compatible with CQL (was created via legacy API)` | `NEWS.txt` 4.0: *"Cassandra 4.0 removed support for the deprecated Thrift interface"* · corrida |
| 52, 54 | cada columna guarda nombre, valor y *timestamp* en microsegundos desde 1970 | ✓ `SELECT WRITETIME(col)` → `1790703715382631` (µs; 29/09/2026 17:41:55 UTC) | corrida |
| 60 | particionadores: `RandomPartitioner` y *"OrderPreservingPartitionioner"* (sic) | el **por defecto es `Murmur3Partitioner`** desde la 1.2. Las dos clases del slide siguen en el *jar* de 5.0.9, pero el `cassandra.yaml` las da como incluidas *"for backward compatibility only"* | `system.local` · `cassandra.yaml` de la imagen · `NEWS.txt` 1.2 |
| 62 | índices secundarios *"implementados como una tabla oculta"* | ✓ es el índice que crea `CREATE INDEX` sin `USING` (`kind = COMPOSITES`, directorio `.indice_…` dentro del de la tabla; `default_secondary_index: legacy_local_table`). La 5.0 agrega **SAI**: `CREATE INDEX … USING 'sai'` (`kind = CUSTOM`, `class_name: sai`). SASI viene deshabilitado (`sasi_indexes_enabled: false`) | corrida · `NEWS.txt` 5.0: *"Added a new secondary index implementation, Storage-Attached Indexes (SAI)"* |
| 68 | con `PRIMARY KEY ((idusuario, mes), nombre)`, `WHERE mes=9` falla y `WHERE mes=9 AND idusuario='agp88'` funciona | ✓ los dos. El error del primero es el de filtrado (`… use ALLOW FILTERING`), no uno que mencione la clave de partición | corrida |
| 70 | `SELECT * FROM blogs WHERE time1 = 1418306451235;` → `Bad Request: Cannot execute this query …` | (atención) con la tabla tal como la define el slide (`time1 int`), el literal no entra en un `int`: `Unable to make int from '1418306451235'`. Con un valor que entra, el error es el del slide, con otro prefijo: `InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering …"` | corrida (el máximo de `int` es 2.147.483.647) |
| 72 | `CREATE MATERIALIZED VIEW monkeySpecies_by_population AS …` | ✗ `Materialized views are disabled. Enable in cassandra.yaml to use.` (`materialized_views_enabled: false`, bajo *EXPERIMENTAL FEATURES*) | corrida · `NEWS.txt` 4.0: la comunidad *"no longer recommends them for production use, and considers them experimental"* |
| 73 | `SELECT * FROM myTable WHERE date >= currentDate() - 2d;` y `SELECT SUM (players) FROM plays;` | la aritmética de fechas funciona, pero esa consulta **sin clave de partición** da el error de `ALLOW FILTERING`; con `WHERE k = 1 AND date >= currentDate() - 2d` devuelve la fila. `SUM` funciona, con el aviso `Aggregation query used without partition key` | corrida |
| 74 | `CREATE TRIGGER myTrigger ON myTable #(java class) USING 'org.apache.cassandra.triggers.AuditTrigger‘` (comilla de cierre tipográfica); la clase va en *"a lib/triggers subdirectory"*; `DROP TRIGGER myTrigger;` | ✗ tal como está en el slide, la línea `#(java class)` da `Invalid syntax at line 3, char 1` (`#` no es comentario en CQL). Sin esa línea y con comilla recta: `Trigger class 'org.apache.cassandra.triggers.AuditTrigger' couldn't be loaded`, porque la clase no viene en la imagen (tampoco la `InvertedIndex` del ejemplo oficial). En la imagen, los *jar* de *triggers* se leen de `conf/triggers` (`/etc/cassandra/triggers`, que solo trae un `README.txt`), no de `lib/triggers` como dicen el slide y la documentación. `DROP TRIGGER myTrigger;` → `mismatched input ';' expecting K_ON`: falta `ON myTable` | corrida · `jvm-server.options` de la imagen: *"Set the default location for the trigger JARs. (Default: conf/triggers)"* · <https://cassandra.apache.org/doc/latest/cassandra/developing/cql/triggers.html> · `NEWS.txt` 2.0: *"Experimental triggers support"* |

### Valores por defecto que el deck no nombra

Leídos de la imagen 5.0.9 (`cassandra.yaml`, `DESCRIBE TABLE` y `CONSISTENCY`):

| Parámetro | Valor | Con qué slide se conecta |
| --- | --- | --- |
| nivel de consistencia de `cqlsh` | `ONE` | 44–46 → [[3.15.05 - Niveles de consistencia y QUORUM\|Niveles de consistencia y QUORUM]] |
| `gc_grace_seconds` (por tabla) | `864000` (10 días) | 38: el *"tiempo de gracia"* de los *tombstones* |
| `bloom_filter_fp_chance` (por tabla) | `0.01` | 30: filtros de Bloom |
| compactación por tabla | `SizeTieredCompactionStrategy` (la 5.0 agrega `UnifiedCompactionStrategy`, según `NEWS.txt`) | 34: compactación |
| `read_repair` (por tabla) | `'BLOCKING'` | 42 y 45: reemplaza a la reparación en segundo plano del deck; solo corrige las réplicas que participaron de la lectura (ver fila 42, 45 de *Deck vs. motor*) |
| `num_tokens` | `16` | 12: reparto de *tokens* |
| `endpoint_snitch` | `SimpleSnitch` | 29: nodo, *data center*, clúster |
| `auto_snapshot` | `true`: `DROP TABLE` y `DROP KEYSPACE` dejan una copia en disco | 48: *backup* |
| `materialized_views_enabled` · `sasi_indexes_enabled` | `false` · `false` | 72 · 62 |

## Cassandra en el teorema CAP según el deck

> [!quote] Clase 15, slide 11
> *"Cassandra nos proporciona tolerancia a particiones y disponibilidad, pero a cambio de ser
> eventualmente consistente, tal y como define el teorema CAP. El nivel de consistencia puede ser
> configurado, según nos interese, incluso a nivel de query."*

El deck la ubica en **AP**, y la bibliografía coincide: en la Table 2 de Corbellini et al. (2017),
p. 5, Cassandra es **el único *wide-column* en la columna AP** (HBase e Hypertable están en CP) →
[[2.12.04 - Teorema CAP|Teorema CAP]] y [[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]].

La segunda frase del slide matiza la primera: el equilibrio entre consistencia y disponibilidad
**se elige por operación**. Una corrida en un nodo con RF 3 lo muestra:

| Nivel (`CONSISTENCY …`) | Réplicas que exige | Resultado real |
| --- | :---: | --- |
| `ONE` | 1 | responde la fila → prioriza **disponibilidad** |
| `QUORUM` | 3/2+1 = **2** | `Unavailable … Cannot achieve consistency level QUORUM` (`required_replicas: 2`, `alive_replicas: 1`) → prefiere fallar antes que responder sin quórum: prioriza **consistencia** |

La regla que la documentación oficial da para lecturas que siempre ven la última escritura es
`W + R > RF` (<https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html>); es la
misma `W+R > N` que Corbellini § 3.2 (p. 6) llama *strong consistency*. QUORUM en escritura y
en lectura la cumple siempre. Desarrollo en
[[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]].

## Bibliografía de Cassandra

**Ninguna edición de *Seven Databases* la cubre**, y ningún libro de la bibliografía obligatoria tiene
un capítulo sobre Cassandra (punto abierto #1 del vault). Verificado contra las fichas:

| Fuente | Qué aporta | Dónde |
| --- | --- | --- |
| [[Corbellini et al (2017) - Persisting big-data — ficha\|Corbellini et al. (2017)]] § 5.2 y Table 5 | el párrafo sustantivo: modelo de columnas y *column families* de BigTable con mecanismos de Dynamo (*consistent hashing*, *read-repair*, *gossip*); P2P sin punto único de falla; particionado *order preserving* y *random*; CQL | p. 13 |
| Corbellini et al. (2017) Table 2 | Cassandra en AP | p. 5 |
| Corbellini et al. (2017) § 3.2 y Table 3 | *read-repair*, *write-repair*, *asynchronous-repair*; N/W/R y quórum | pp. 5–7 (Table 3, p. 6) |
| Corbellini et al. (2017) § 5.1 | el modelo BigTable: SSTable, *commit log*, *memtable* | pp. 11–12 |
| [[Database Systems The Complete Book — ficha\|Garcia-Molina]] cap. 13.7.6 | *Column Stores* (menos de una página): el **otro** sentido de *columnar*, el almacenamiento analítico por columnas. Cassandra guarda filas con sus celdas, no columnas separadas → [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases de datos tabulares]] § 3 | impresas 609–610 |
| Garcia-Molina cap. 20.7 | *Peer-to-Peer Distributed Search* (Chord, §§ 20.7.4–20.7.6): la mecánica del anillo de *hashing* | impresas 1020–1031 |
| [[Seven Databases in Seven Weeks — ficha\|Seven Databases]] 2ª ed. | — solo la nombra (impresas 6, 214 y 310). Como analogía de familias de columnas sirve el cap. 3 (HBase), § *Why Column Families?* | impresas 65–66 |
| Documentación oficial de Apache Cassandra | CQL, `cqlsh`, consistencia, seguridad, índices, *triggers*: todo lo que el TP10 ejercita | <https://cassandra.apache.org/doc/latest/> (la misma URL que da el TP10) |

**Lectura mínima:** Corbellini § 5.2 + Table 5 (p. 13) y Table 2 (p. 5), unas dos páginas; para el
TP, la página de `cqlsh` y la de consistencia de la documentación oficial.

## En los exámenes

Seis preguntas del [[Parcial 1Q2026|Parcial 1Q2026]] y tres del [[Recuperatorio 1Q2026|Recuperatorio 1Q2026]] son de Cassandra, y otras tres la
nombran entre las opciones. Van primero, marcadas con ★★: son las instancias de más peso para practicar.

| Examen | Pregunta | Qué se pregunta | Clave y concepto |
| --- | --- | --- | --- |
| ★★ [[Parcial 1Q2026\|Parcial 1Q2026]] | 7 · ensayo (5 puntos) | función de la *partition key* y de la *clustering key* | la *partition key* **distribuye** las filas entre nodos (hash → *token*); la *clustering key* las **ordena** dentro de la partición. El alumno sacó 0/5 → [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] |
| ★★ [[Parcial 1Q2026\|Parcial 1Q2026]] | 14 · ensayo (8 puntos) | RF 5 con escritura y lectura en `QUORUM`: cuántos confirman, si hay consistencia fuerte, dos réplicas viejas, qué lo corrige | **3**; sí, W + R = 6 > 5; *digest* distinto → gana el *timestamp* más reciente; lo corrige la reparación de lectura, bloqueante desde 4.0 (fila 42, 45 de *Deck vs. motor*). El alumno sacó 2/8 → [[3.15.05 - Niveles de consistencia y QUORUM\|Niveles de consistencia y QUORUM]] · [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura]] § 8 |
| ★★ [[Parcial 1Q2026\|Parcial 1Q2026]] | 24 · V/F (1 punto) | *"La arquitectura de Cassandra es Master-Slave"* | **Falso**: *peer-to-peer* (slide 12) → [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura]] |
| ★★ [[Parcial 1Q2026\|Parcial 1Q2026]] | 26 · varias correctas (3 puntos) | componentes de un nodo | **Commit Log, Memtable y SSTable** (slide 30); *Disk table* y *Memory space* restan. El alumno sacó 3/3 → [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura]] |
| ★★ [[Parcial 1Q2026\|Parcial 1Q2026]] | 31 · ensayo (3 puntos) | escribir en CQL la creación de un *keyspace* | `CREATE KEYSPACE k WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};` (slide 59). (atención) Rareza 1, abajo → [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases de datos tabulares]] § 2.5 |
| ★★ [[Parcial 1Q2026\|Parcial 1Q2026]] | 34 · varias correctas (3 puntos) | `blogs` con `PRIMARY KEY ((blogId, time1), time2)` y `WHERE time1 = 1418306451235` | **C, D y E**: falta `blogId`, parte de la *partition key*; no se filtra por `time1` sola; rendimiento impredecible. El alumno omitió D (1,99/3). (atención) Rareza 2, abajo → [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] |
| ★★ [[Parcial 1Q2026\|Parcial 1Q2026]] | 16 · opción múltiple (2 puntos) | qué base delega la coordinación de nodos en una herramienta externa *(Cassandra es una de las opciones)* | **Neo4j**; Cassandra coordina por *gossip* entre pares (slide 28) → [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura]] § 5 |
| ★★ [[Recuperatorio 1Q2026\|Recuperatorio 1Q2026]] | 34 · coincidencia (2,5 puntos) | terminología tabular vs. RDBMS | Keyspace = base de datos · Column Family = tabla · Fila · Columna · Cluster = instancia (slide 4); 2,5/2,5 → [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases de datos tabulares]] |
| ★★ [[Recuperatorio 1Q2026\|Recuperatorio 1Q2026]] | 35 · V/F (2 puntos) | *"SSTable es una estructura de datos residente en la memoria"* | **Falso**: en disco e inmutable; en memoria está la MemTable (slide 30) → [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura]] |
| ★★ [[Recuperatorio 1Q2026\|Recuperatorio 1Q2026]] | 36 · varias correctas (3 puntos) | niveles de consistencia de escritura válidos | `ANY`, `ONE`/`TWO`/`THREE`, `QUORUM`, `LOCAL_QUORUM`, `EACH_QUORUM` y `ALL` (slide 46). El alumno sacó 0,89/3. (atención) Rareza 3, abajo → [[3.15.05 - Niveles de consistencia y QUORUM\|Niveles de consistencia y QUORUM]] |
| ★★ [[Recuperatorio 1Q2026\|Recuperatorio 1Q2026]] | 25 · opción múltiple (4 puntos) | motor para una tabla de posiciones con un millón de transacciones por segundo *(Cassandra es la opción E)* | **Redis** (*sorted sets*); Cassandra ordena solo dentro de una partición → [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] § 7 |
| ★★ [[Recuperatorio 1Q2026\|Recuperatorio 1Q2026]] | 26 · varias correctas (3 puntos) | bases vistas en clase en configuración CA | MySQL y Neo4j; Cassandra **resta**: es AP (slide 11) → [[2.12.04 - Teorema CAP\|Teorema CAP]] |
| [[Parcial 2Q2025\|Parcial 2Q2025]] | 7 · 8 · 14 | terminología; componentes de un nodo; SSTable en memoria | las mismas claves que el Recuperatorio 1Q2026 P34, el Parcial 1Q2026 P26 y el Recuperatorio 1Q2026 P35 |
| [[Parcial 2Q2025\|Parcial 2Q2025]] | 23 · varias correctas | `blogs` con `PRIMARY KEY (blogId, time1, time2)` y `WHERE time1 = 1418306451235` | **B, C y D**: no se filtra por `time1` sola, falta `blogId`, y con `ALLOW FILTERING` devuelve los datos (slides 70–71); el mismo literal fuera de rango → [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] |
| [[Parcial 2Q2025\|Parcial 2Q2025]] | 26 · opción múltiple | cómo se calcula el QUORUM | **`(replication_factor/2)+1`** (slides 45–46), con división entera → [[3.15.05 - Niveles de consistencia y QUORUM\|Niveles de consistencia y QUORUM]] |
| [[Parcial 2Q2025\|Parcial 2Q2025]] | 28 · 13 · 33 · 3 | master-slave; bases CA; coordinación externa; todos los nodos escriben | Falso · Cassandra resta como CA · Neo4j · AP: las mismas claves que el 1C 2026 → [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura]] |
| [[Parcial 2Q2025\|Parcial 2Q2025]] | 29 · ensayo | cómo se forma la *primary key* y qué hace cada parte | *partition key* = nodo; *clustering key* = orden dentro de la partición; con ejemplos → [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] |
| [[Parcial XC-202X\|Parcial XC-202X]] | 7 · 8 a–e | esquema de un nodo; cinco V/F sobre CQL, consistencia por consulta, redundancia, *master-slave* y tipo de base | MemTable en memoria, *commit log* y SSTables en disco · a F, b F, c V, d V, e F (*wide-column*) → [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura]] · [[3.15.05 - Niveles de consistencia y QUORUM\|Niveles de consistencia y QUORUM]] |
| [[Práctica subida por la cátedra\|Práctica subida por la cátedra]] | 9 · desarrollo | `CREATE KEYSPACE` | `WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3};` → [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases de datos tabulares]] |
| [[Final 1Jul2025\|Final 1Jul2025]] · [[Final 1Dic2025\|Final 1Dic2025]] · [[Repaso Final BD 2\|Repaso Final BD 2]] | P4 · P5 · Ej. 24 y 32 | motor para un videojuego con 10⁹ escrituras por segundo; motor para sensores IoT | Cassandra por escritura masiva, AP y escala lineal (una de las dos copias del Final 1Jul2025 responde Redis); el modelado de cada consulta → [[3.15.03 - CQL y modelado orientado a consultas\|CQL y modelado]] § 4 |
| [[Final 1Dic2023\|Final 1Dic2023]] · [[Repaso Final BD 2\|Repaso Final BD 2]] | P2 · Ej. 27 | qué base versiona sus datos | HBase; Cassandra **no** versiona: gana el *timestamp* más reciente (slide 54) → [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases de datos tabulares]] |

Lo que más se repite, instancia tras instancia: la tabla de terminología del slide 4, los componentes
de un nodo (slide 30), *peer-to-peer* y no *master-slave*, Cassandra como AP y el `WHERE` sin la
*partition key* completa. En el 1C 2026 se sumaron el QUORUM **aplicado** (RF 5, W + R > RF,
reparación de lectura) y el `CREATE KEYSPACE` escrito, y los dos ensayos de Cassandra (P7 y P14,
13 puntos) fueron los que más le costaron al alumno del parcial.

### Tres rarezas de corrección, verificadas en Cassandra 5.0.9

| # | Pregunta | Qué pasó en la corrección | Qué dice el motor | Cómo responder |
| :---: | --- | --- | --- | --- |
| 1 | [[Parcial 1Q2026\|Parcial 1Q2026]] P31 | el alumno escribió `CREATE KEYSPACE nombre_keyspace WITH replication : {…};` y la plataforma le dio **3/3** | `SyntaxException: … no viable alternative at input ':'`: no crea nada (la columna del mensaje depende del largo del nombre) | con **`=`** antes del mapa y `:` solo dentro de él, como en el slide 59 |
| 2 | [[Parcial 1Q2026\|Parcial 1Q2026]] P34 (y [[Parcial 2Q2025\|Parcial 2Q2025]] P23) | la clave (C, D y E) trata la consulta como una falla de filtrado | con `time1 int`, el literal `1418306451235` no entra en un `int` (máximo 2.147.483.647): `Unable to make int from '1418306451235'`, antes de mirar la clave. Con un valor que entra, el error es el de filtrado: `Cannot execute this query as it might involve data filtering and thus may have unpredictable performance…` | marcar la clave de la plataforma (filtrado, *partition key* incompleta) y, si hay espacio, mencionar el tipo |
| 3 | [[Recuperatorio 1Q2026\|Recuperatorio 1Q2026]] P36 | entre las opciones están *None* y *Global Quorum*, niveles que no existen, con −20 % cada uno; el alumno marcó *Global Quorum* | `CONSISTENCY GLOBAL_QUORUM;` y `CONSISTENCY NONE;` → `Improper CONSISTENCY command.` (fila 45–46 de *Deck vs. motor*) | solo los niveles de la tabla del slide 46; `ANY` vale porque la pregunta es **de escritura** |

## Dudas abiertas

- [ ] ¿La cátedra espera que se active `PasswordAuthenticator`? El TP10 da `cassandra`/`cassandra`,
  pero la imagen no las pide, y los comandos de roles del slide 49 solo corren con autenticación.
- [ ] ¿Qué versión toma la cátedra? El deck no declara ninguna; el TP baja `latest` (5.0.9 hoy).
- [ ] ¿Las vistas materializadas (slide 72) entran al parcial como concepto, dado que en 5.0.9 vienen
  deshabilitadas y la comunidad las considera experimentales?
- [ ] (atención) El `WHERE time1 = 1418306451235` del slide 70 no entra en `time1 int`. La misma
  consulta es la Pregunta 23 del [[Parcial 2Q2025]] (clave B, C y D) y, con
  `PRIMARY KEY ((blogId, time1), time2)`, la Pregunta 34 del [[Parcial 1Q2026|Parcial 1Q2026]] (clave C, D y E). En
  las dos, la clave de la plataforma la trata como una falla de filtrado o de clave de partición; en
  el motor real falla antes por tipo (`Unable to make int from '1418306451235'`, corrido con las dos
  definiciones). ¿La cátedra acepta que se mencione el error de tipo?
- [ ] ¿La teórica del 05/10 cubre SAI, `nodetool` y `repair`?
- [ ] DevCenter (slide 13): no verificado si sigue disponible; el TP usa DataGrip.

## Enlaces

- Teórica: [[Clase 15 - Introduccion a Cassandra]] · práctica: [[Práctica 2026-09-29]] *(TP10 Parte I,
  con las salidas reales de los 18 pasos)*
- Conceptos de la Clase 15:
  [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Familias de columnas y keyspaces]] ·
  [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]] ·
  [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]] ·
  [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura]] ·
  [[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]] ·
  [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]]
- Conceptos NoSQL generales: [[2.12.01 - NoSQL — origen, propiedades y taxonomía|NoSQL]] ·
  [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
  [[2.12.04 - Teorema CAP|Teorema CAP]] · [[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]]
- Otros motores: [[MongoDB]] *(el documental de la Unidad-02)* · [[MySQL]] · [[PostgreSQL]]
- Exámenes (detalle en § *En los exámenes*): [[Mapa de exámenes]] · ★★ **[[Parcial 1Q2026|Parcial 1Q2026]]** *(preguntas 7, 14, 24, 26, 31 y 34; la 16 la nombra como opción)* ·
  ★★ **[[Recuperatorio 1Q2026|Recuperatorio 1Q2026]]** *(preguntas 34, 35 y 36; la 25 y la 26 la nombran como opción; la 36 incluye `Global Quorum` y `None`, niveles
  que no existen: ver *Deck vs. motor*, fila 45–46)* · [[Parcial 2Q2025]] *(preguntas 7, 8, 14, 23, 26, 28 y 29)* ·
  [[Parcial XC-202X]] *(ejercicios 7 y 8)* · [[Final 1Jul2025]] y [[Final 1Dic2025]] *(motor para
  escritura masiva)*
- Índice de clases: [[_index-clases]] · calendario: [[_cronograma]] · bibliografía: [[_index-bibliografia]]
