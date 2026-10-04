---
tipo: teorica
clase: 15
deck: "BD2_Clase 15 - Introduccion a Cassandra.pdf"
unidad: 3
tema: "Introducción a Cassandra"
resumen: "Primera teórica de Cassandra (74 slides): bases tabulares, anillo peer-to-peer, escritura y lectura (commit log, MemTable, SSTable, digest), consistencia y QUORUM, CQL y clave primaria. El CQL del deck se corrió en Cassandra 5.0.9: varias sintaxis ya no existen."
fecha: 2026-09-28
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 15
  - Clase 15 — Introducción a Cassandra
  - Introducción a Cassandra
  - Bases de Datos Tabulares
  - Slides_Bloom_Filters_Cassandra
  - Filtros de Bloom en Cassandra
  - Digest request
fuentes:
  - "raw/Unidad-03/Teorica/BD2_Clase 15 - Introduccion a Cassandra.pdf"
  - "raw/Unidad-03/Teorica/Slides_Bloom_Filters_Cassandra.pdf"
  - "raw/Unidad-03/Teorica/mecanismo de obtencion de resultados DIGEST (cassandra).png"
estado: procesado
---

# Clase 15 — Introducción a Cassandra y bases de datos tabulares

## Resumen general

Deck de 74 slides, con portada *"Bases de Datos Tabulares"*, que abre la Unidad 3 y el segundo motor
NoSQL de la cursada. Recorre qué es una base tabular (columnar, de familias de columnas) y su
terminología frente al modelo relacional; la historia de Cassandra; su arquitectura peer-to-peer en
anillo, con tokens, nodo coordinador, replicación y *gossip*; el camino de escritura (commit log,
MemTable, SSTable inmutable, compactación, *tombstones*) y el de lectura (*direct*, *digest* y *read
repair*); los niveles de consistencia con la fórmula del QUORUM; seguridad; el modelo de datos, y
cierra con CQL: clave primaria, `ALLOW FILTERING`, vistas materializadas, funciones y *triggers*. Es la
base del TP10 (29/09) y entra al parcial del 13/10.

Reglas y trampas que hay que saber:

- Cassandra es **AP** y la consistencia se elige **por operación**. QUORUM = ⌊RF/2⌋ + 1 réplicas
  (RF 3 → 2, RF 5 → 3); con escritura y lectura en QUORUM, R + W > RF y la lectura ve la última
  escritura.
- La *partition key* reparte las filas entre nodos por hash; la *clustering key* las ordena dentro
  de la partición. Un `SELECT` sin la *partition key* completa exige `ALLOW FILTERING`; un `UPDATE`
  o un `DELETE` sin ella falla sin alternativa.
- La SSTable está **en disco** y es inmutable; la MemTable, en memoria. Borrar escribe un
  *tombstone*, que la compactación purga recién después del período de gracia.
- El deck mezcla épocas: `USING CONSISTENCY`, las supercolumnas, la reparación de lectura en segundo
  plano y los particionadores `Random`/`OrderPreserving` son de versiones viejas; en Cassandra 5.0 las
  vistas materializadas vienen deshabilitadas y el *trigger* del ejemplo no carga.

Para el parcial: los dos exámenes de 1C 2026 tienen doce preguntas que involucran a Cassandra (nueve
son específicamente sobre ella) y dos tercios repiten, casi textuales, preguntas del Parcial 2Q2025.

## Fuente, motor y origen del deck

> [!info] Fuente
> `raw/Unidad-03/Teorica/BD2_Clase 15 - Introduccion a Cassandra.pdf` · **74 slides** · **40
> imágenes embebidas** *(PDF de PowerPoint 2010 generado el **06/10/2024**; metadatos `Title`
> "Presentación de PowerPoint" y `Author` "Godio Claudio Jose", aunque el pie de los slides dice
> *"Guillermo Rodriguez - Ingeniería Informática ITBA"*)*. Los slides **7, 9 a 20 y 22 no llevan pie
> ni número**; el resto sí.
> Dictado en la **teórica virtual del lunes 28/09**, cuyo tema en el [[_cronograma]] es
> *"Introducción a Cassandra"*. La teórica siguiente (05/10) figura como *"Conceptos teóricos de
> Cassandra"*.
> La unidad es `3` porque el archivo está en `raw/Unidad-03/`: es la primera clase de esa unidad y la
> única hasta hoy. Se practica con el **TP 10 - Cassandra Parte I** del martes 29/09 →
> [[Práctica 2026-09-29]].
> **No hay slide de agenda ni de bibliografía**, y no hay notas propias del humano en
> `raw/Unidad-03/Teorica/`. Bibliografía: [[_index-bibliografia]] › Clase 15.
>
> Junto al deck hay **dos archivos sin número de clase**, documentados en § *Material
> complementario*: el handout `Slides_Bloom_Filters_Cassandra.pdf` y el diagrama `mecanismo de
> obtencion de resultados DIGEST (cassandra).png`. No son clases y no tienen página propia.

> [!important] Motor: **Cassandra 5.0.9**, y el deck mezcla tres épocas de Cassandra
> El TP10 instala con `docker pull cassandra`, que trae la rama 5.0; todo lo que esta página presenta
> como salida se corrió en **Cassandra 5.0.9** (`SELECT release_version FROM system.local` →
> `5.0.9`, particionador `Murmur3Partitioner`, un solo nodo, `num_tokens: 16`), en keyspaces propios
> `c15clase*`. El deck no tiene motor ajeno (todo es Cassandra), pero sí **desfasaje de versión**:
>
> | Época | Evidencia en el deck | Slides | Estado en 5.0.9 |
> | --- | --- | :---: | --- |
> | **API Thrift / modelo pre-CQL** | supercolumnas, `struct Column { 1: binary name, 2: binary value, 3: i64 timestamp }` (una definición en el lenguaje de interfaces de Thrift), *ColumnFamily* como unidad del modelo, `RandomPartitioner` y `OrderPreservingPartitioner` | 50–53, 57, 60 | Thrift **eliminado en 4.0** (`NEWS.txt` de la distribución); los dos particionadores siguen en el jar solo *"for backward compatibility"* (`cassandra.yaml`) |
> | **CQL2** | `SELECT … USING CONSISTENCY QUORUM;` | 45 | CQL2 deprecado en 2.0 y **eliminado en 2.2** (`NEWS.txt`): hoy es `SyntaxException` |
> | **Reparación de lectura en segundo plano** | *"Background read repair request"*, y en la tabla de lectura *"Por defecto, se ejecuta una reparación de lectura en segundo plano"* | 28, 42–43, 45 | **eliminada en 4.0**: `read_repair_chance` da `Unknown property`; la reparación que queda es **bloqueante** (`read_repair = 'BLOCKING'`) |
> | **CQL3 actual** | `CREATE TABLE`, clave primaria compuesta, `ALLOW FILTERING`, vistas materializadas, funciones, *triggers*, roles | 20, 49, 59, 63–74 | corre, con las diferencias del § *Lo que el deck dice y Cassandra 5.0 no hace* |

> [!note] Bibliografía: ningún libro del vault cubre Cassandra
> Ninguna edición de *Seven Databases* la trata. La única fuente del vault es
> [[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini et al. 2017]]: § 5.2 (p. 13:
> modelo de columnas de BigTable con mecanismos de Dynamo, arquitectura peer-to-peer sin punto único
> de falla, particionado *Order Preserving* y *Random*, CQL), § 5.1.1–5.1.2 (pp. 11–12: SSTable,
> memtable y commit log de BigTable), § 3.2 y Table 3 (pp. 5–7: N/W/R, quórum `N/2+1` y las
> políticas de reparación) y Table 2 (p. 5: Cassandra en AP). Lo que el paper no trae
> (compactación, *tombstones*, filtros de Bloom, niveles de consistencia por operación, la sintaxis de
> CQL, que solo nombra) sale de
> la documentación oficial (`https://cassandra.apache.org/doc/latest/`) y se rotula así. El slide 10
> coincide con el paper: Cassandra toma el modelo de datos de BigTable y los mecanismos de Dynamo (el
> slide fecha esos papers en 2006 y 2007).

---

## Contenidos de la clase

El deck **no tiene slide de agenda**. Esta es la agenda reconstruida en los mismos once bloques de
§ *Conceptos*, con los rangos de slides. El orden es el del deck salvo en el bloque 2, que junta los
slides 21–24 (clientes y un segundo resumen que repite en otro formato los 10–12) con los 9–12; el
deck, además, retoma el modelo de datos en los slides 50–62, después de la consistencia.

| # | Bloque | Slides | Concepto |
| :---: | --- | :---: | --- |
| 1 | Bases de datos tabulares: definición, cuándo sí y cuándo no, terminología RDBMS vs. tabular, ranking | 1–8 | [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases tabulares]] |
| 2 | Cassandra: qué es, historia, características, clientes y segundo resumen | 9–12, 21–24 | [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura]] |
| 3 | CQL y modelado orientado a consultas, con un ejemplo de CQL | 13–20 | [[3.15.03 - CQL y modelado orientado a consultas\|CQL y modelado]] |
| 4 | Arquitectura: coordinador, replicación, *gossip*; nodo, data center y clúster | 25–29 | [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura]] |
| 5 | Escritura: commit log, MemTable, SSTable, filtros de Bloom, compactación, escritura en clúster, borrado y "LLTS" | 30–39 | [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura]] |
| 6 | Lectura: *direct read*, *digest request* y *background read repair* | 40–43 | ídem |
| 7 | Consistencia: `consistency_level`, tablas de lectura y escritura, fórmula del QUORUM, `repair` | 44–47 | [[3.15.05 - Niveles de consistencia y QUORUM\|Consistencia y QUORUM]] |
| 8 | Seguridad: roles, usuarios y permisos | 48–49 | [[3.15.03 - CQL y modelado orientado a consultas\|CQL y modelado]] |
| 9 | Modelo de datos: columna, supercolumna, fila, RowKey, familia de columnas, keyspace, particionado e índices | 50–62 | [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces\|Bases tabulares]] · [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura]] (59–61) · [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] (56) · [[3.15.03 - CQL y modelado orientado a consultas\|CQL y modelado]] (62) |
| 10 | CQL: creación de tabla, clave primaria, asignación de espacio, consulta y `ALLOW FILTERING` | 63–71 | [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] |
| 11 | CQL: vistas materializadas, funciones y *triggers* | 72–74 | [[3.15.03 - CQL y modelado orientado a consultas\|CQL y modelado]] |

---

## Conceptos

Cada bloque recorre lo que dicen los slides y enlaza al concepto, que es donde se desarrolla. Las
corridas en el motor están juntas en § *Lo que el deck dice y Cassandra 5.0 no hace*.

### Bloque 1 · Slides 1–8 — Bases de datos tabulares

**Slide 1 (portada)** es un diagrama de tres filas con claves `John Lennon`, `Paul McCartney` y `The
Beatles`: las dos primeras tienen `born`, `country`, `style` y `type` (`artist`), Lennon además
`died`; la banda no tiene `born` pero sí `founded` (1957), y su `type` es `band`. Es la idea de la
clase en una imagen: **cada fila tiene su propio conjunto de columnas**.

**Slide 2** da tres nombres para lo mismo: bases de datos *columnares*, de *columnas extendidas* u
*orientadas a columnas*; tablas con una cantidad muy grande de columnas, donde **cada fila puede tener
una configuración distinta**; precursor: **Google BigTable**. *(nota) El deck usa "columnar" como
sinónimo de familia de columnas: no hace la distinción column store / wide-column que la
[[Clase 12 - Introduccion a NoSQL|Clase 12]] deja abierta.*

**Slide 3** nombra motores (Cassandra, Accumulo, Hypertable, HBase, SimpleDB) y dice que las tabulares
son buenas en cuatro cosas: *gestión de tamaño*, *cargas de escrituras masivas orientadas al stream*,
*alta disponibilidad* y *MapReduce*.

**Slide 4**, la tabla que se pregunta en los exámenes, transcripta:

| RDBMS | Tabular |
| --- | --- |
| Instancia | Cluster |
| Base de Dato | KeySpace |
| Tabla | Familia de Columnas |
| Fila | Fila |
| Columna | Columna (distinto por cada fila) |

**Slides 5–6**: conviene para estructura libre entre registros de una misma familia, registro de
eventos (*logs*), datos con etiquetas, categorías y vínculos, referencias a otros keyspaces, y contar
y clasificar accesos para estadística. **No** conviene para transacciones ACID, para consultas de
agregación (*sum*, *avg*), que según el slide *"deben hacerse del lado del cliente"*, para prototipos
sin patrones de consulta definidos, ni cuando cambiar el esquema de consultas existentes es costoso.

**Slides 7–8**: logo y una captura de db-engines de mayo de 2021 (*13 systems in ranking*, modelo
*Wide column*): Cassandra primera con 110,93 puntos, HBase 43,24, Microsoft Azure Cosmos DB 34,71,
Datastax Enterprise 7,55, y siguen Azure Table Storage, Accumulo, Google Cloud Bigtable, ScyllaDB,
HPE Ezmeral Data Fabric, Elassandra, Amazon Keyspaces, Alibaba Cloud Table Store y SWC-DB.

→ Desarrollo: [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Bases de datos tabulares — familias de columnas y keyspaces]].

### Bloque 2 · Slides 9–12 y 21–24 — Qué es Cassandra

- **9**: base NoSQL *distribuida y masivamente escalable*, con soporte multi data center y
  comunicación peer-to-peer.
- **10**: nace en **Facebook** para la búsqueda en el *inbox*; open source en **2008**; proyecto
  *top-level* de Apache en **febrero de 2010**; inspirada en los papers de **Amazon Dynamo (2007)** y
  **Google BigTable (2006)**; hoy la mantiene **DataStax**; el nombre viene de la sacerdotisa que
  predijo el engaño del caballo de Troya.
- **11**: por **CAP**, Cassandra da tolerancia a particiones y disponibilidad a cambio de consistencia
  eventual → [[2.12.04 - Teorema CAP|Teorema CAP]]; el nivel de consistencia se configura *"incluso a
  nivel de query"*; escala **linealmente** (si 2 nodos soportan 100.000 operaciones por segundo, 4
  soportan 200.000) y **horizontalmente**, con hardware de bajo costo.
- **12**: arquitectura **peer-to-peer**, sin maestro-esclavo ni punto único de fallo; cualquier nodo
  puede ser **coordinador** de una query, y *"será el driver"* el que lo elija; cada fila recibe un
  **token** calculado por una función hash; los nodos se reparten el rango de tokens **de −2⁶³ a
  2⁶³**, lo que define el nodo primario; la replicación se define con un **factor de replicación**;
  los **data centers** agrupan nodos lógicamente.
- **21**: clientes, cada uno con su uso: Netflix (back-end de streaming), Facebook (búsqueda en la
  bandeja de entrada), Reddit (escalamiento horizontal), Spotify (funciones de usuario, análisis y
  monitoreo; *"Para el 2017: 3000 nodos"*), Walmart (*"En 2012 … 10 clústers formados por 250 nodos
  de procesamiento"*).
- **22–24** repiten el resumen con otro formato: iniciado por Facebook, código abierto en 2008,
  *"Proyecto apache en 2009"*, Apache License 2.0, escrito en Java, multiplataforma, *"terabytes de
  datos"*; esquema dinámico, sin punto único de fallo, alta disponibilidad; particionado en anillo,
  escalabilidad horizontal y *"cientos de gigabytes de datos"*.

→ Desarrollo: [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]].

### Bloque 3 · Slides 13–20 — CQL y modelado orientado a consultas

- **13**: CQL es *"un derivado reducido de SQL"*; como los datos están **desnormalizados**, no existen
  *joins* ni subconsultas; se usa desde la shell (`cqlsh`, que el slide llama *"cqlshell"*), desde
  herramientas gráficas (DevCenter) o desde drivers.
- **14–15**: Cassandra combina propiedades de una base **clave-valor** y de una **orientada a
  columnas**; el diagrama del 15 muestra una fila: una *row key* que apunta a pares *column key*
  (`col_a` … `col_d`) → *column value* (`v_a` … `v_d`).
- **16**, en rojo en el slide: modelar por el **patrón de acceso a los datos** (analizar antes las
  queries), **definir adecuadamente la clave de partición** (es la que distribuye los datos: evitar
  cuellos de botella) y **minimizar el número de particiones** que lee una consulta.
- **17–19**: es la mejor opción cuando manda la alta disponibilidad o cuando hay grandes volúmenes y
  se prefiere velocidad a normalización; una tabla pasa a ser una *familia de columnas*; un registro
  puede tener 50 columnas y otro 300, porque se accede por la *Row Key* (el diagrama del 17: `Row Key
  1` con `Column 1`, `2` y `3`; `Row Key 2` con `Column 1` y `Column 4`, cada una con su *value*); el
  modelo se basa **en las consultas, no en la relación entre los datos**; no hay `JOIN`.
- **20**: el ejemplo de CQL, en imagen:

```sql
CREATE KEYSPACE MiEspacioClaves
  WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };
USE MiEspacioClaves;
CREATE COLUMNFAMILY MisColumnas (id text, Apellido text, Nombre text, PRIMARY KEY(id));
INSERT INTO MisColumnas (id, Apellido, Nombre) VALUES ('1', 'Perez', 'Juan');
SELECT * FROM MisColumnas;
```

El resultado que dibuja el slide es `id | nombre | apellido` / `1 | Juan | Perez` / `(1 fila)`. En
el motor corre, pero **la salida no es esa** (fila 1 de la tabla del § *Lo que el deck dice…*).

→ Desarrollo: [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]].

### Bloque 4 · Slides 25–29 — Coordinador, replicación y *gossip*

- **25**: varios nodos independientes comunicados por un protocolo P2P; *"Todos los nodos intercambian
  información con el resto de forma continua"*. El diagrama es un anillo de **10 nodos**: el
  **cliente** habla con el nodo 1 (*nodo coordinador*), que reenvía a los nodos **4 y 5** (*nodos con
  copia de los datos requeridos*) y al **8**, el único con flecha de vuelta (*nodo con copia que
  responde a la petición*).
- **26**: no hay nodos "principales"; el cliente se conecta a cualquiera, que actúa de coordinador y
  determina qué nodos deben responder.
- **27**: diagrama de 5 nodos con flechas *Replication* entre vecinos del anillo; uno o más nodos son
  réplicas de un dato, y si alguno respondió con un valor desactualizado se devuelve **el más
  reciente** al cliente.
- **28**: después, Cassandra hace una **reparación de lectura en segundo plano** (hoy ya no es así:
  § *Lo que el deck dice…*, fila 5); el protocolo **Gossip** ("chisme") corre en segundo plano para
  que los nodos se comuniquen y detecten nodos caídos, y se propaga como una epidemia (*"el vecino le
  informa los cambios"*).
- **29**: **nodo** (instancia que guarda la parte de los datos que le toca según el algoritmo de
  partición), **data center** (grupo lógico de nodos, en un sitio o distribuido; separa cargas, p. ej.
  análisis y tiempo real) y **clúster** (todos los nodos bajo una configuración común, con uno o más
  data centers).

→ Desarrollo: [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]] ·
las políticas de reparación en [[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]].

### Bloque 5 · Slides 30–39 — Escritura, borrado y expiración

- **30**, los cuatro elementos: **commit log** (mecanismo de recuperación; *cada* escritura se
  registra ahí), **MemTable** (estructura en memoria; de ahí los datos pasan a la SSTable),
  **SSTable** (**archivo de disco** con el contenido de la MemTable cuando esta alcanza un tamaño;
  **inmutable** una vez creado) y **filtros de Bloom** (algoritmos rápidos *"no deterministas"* para
  probar si un elemento pertenece a un conjunto; *"un tipo especial de caché"* al que se accede
  *"después de cada consulta"*; ver § *Material complementario* (a)).
- **31**, diagrama de la escritura: *1. petición de escritura* del cliente; *2. escritura en memoria*
  (MemTable) y *2. escritura en commit log* (disco) —las dos con el mismo número—; *3. escritura en
  SSTable (flush)*, con su `INDEX`, en disco.
- **32**: el commit log guarda **toda** la actividad de escritura (durabilidad); la MemTable guarda
  las escrituras **de cada familia de columnas**; *"En Cassandra, las escrituras son 'baratas'"*; si el
  sistema se apaga, se recupera del commit log *(el mismo papel que el log de
  [[1.11.05 - Recovery y write-ahead logging (WAL)|Recovery y WAL]])*; el **flush** libera la MemTable
  cuando se llena.
- **33**: las SSTables no se reescriben, así que **los datos de una misma partición pueden quedar
  repartidos en varias SSTables**; por eso **las lecturas son más "caras" que las escrituras**.
- **34**: la **compactación** corre periódicamente, reduce la cantidad de SSTables eliminando datos
  antiguos, y su objetivo es que las lecturas sean más eficientes.
- **35–37**, escritura en el clúster. El diagrama (anillo de 10) muestra al nodo 1 como coordinador y
  **tres réplicas**: el 4 recibe la copia y no responde; el 7 y el 8 *"además de recibir copia,
  responden … indicando que se ha realizado con éxito"* *(lectura del vault: RF 3 con nivel de
  consistencia 2; el slide no lo dice)*. El coordinador envía la escritura a **todas** las réplicas;
  se escribe en todas las disponibles; el **nivel de consistencia** decide cuántas deben confirmar;
  *éxito* = escrito en commit
  log y MemTable; cualquier nodo puede coordinar, elegido *"en base a una política predefinida en la
  Base de Datos"*.
- **38–39**, borrado: la fila no se borra de disco (SSTables inmutables) sino que se marca con un
  **tombstone**; la compactación la elimina después; hay un **tiempo de gracia** para que un nodo caído
  reciba la orden de borrado si vuelve a tiempo; si no vuelve, puede haber **inconsistencias** entre
  réplicas, y por eso se recomienda mantenimiento periódico. El último punto, **"LLTS"**, dice que los
  datos pueden tener *"fecha de caducidad"*: es el **TTL** (*time to live*).

**Verificación en el motor — el borrado es una escritura más.** En `c15clase.users` (fila `2 | Beto |
CA`), un `DELETE` después de un `nodetool flush` dejó **dos SSTables** con la misma partición: la
vieja con el dato y una nueva con la marca. `sstabledump -k 2` de cada una:

```text
nb-1-big-Data.db   "key" : [ "2" ] … "cells" : [ { "name" : "name", "value" : "Beto" }, { "name" : "state", "value" : "CA" } ]
nb-2-big-Data.db   "key" : [ "2" ] … "deletion_info" : { "marked_deleted" : "2026-09-29T17:46:51.219956Z", "local_delete_time" : "2026-09-29T17:46:51Z" }, "rows" : [ ]
```

Después de `nodetool compact c15clase users` queda **una sola** SSTable (`nb-3-big-Data.db`): "Beto"
desapareció, pero **el tombstone sigue**, porque todavía no pasó `gc_grace_seconds = 864000` (10
días, el valor por defecto que muestra `DESCRIBE TABLE`). Cada SSTable trae, además de `Data.db`, un
`Filter.db` (el filtro de Bloom), `Index.db`, `Summary.db`, `Statistics.db` y otros componentes.

→ Desarrollo: [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]].

### Bloque 6 · Slides 40–43 — Lectura: *direct*, *digest* y *read repair*

- **40**: en cada nodo que recibe la lectura se busca por *key* en la **MemTable**; lo que falta se
  busca en las **SSTables**; sin compactación reciente hay que leer varias (*"Problema de lentitud"*).
  Existen ***tres*** mecanismos para obtener el resultado.
- **41**: el **nivel de consistencia** define cuántos nodos deben responder para asumir que la
  respuesta es consistente. **Direct read request**: el coordinador contacta **un** nodo con la réplica
  y la recupera.
- **42**: **Background read repair request**: si hay inconsistencias, las réplicas con *timestamp* más
  antiguo se sobrescriben con la réplica "más actual". **Digest request**: se contacta a tantos nodos
  como indique el nivel de consistencia y se comprueba la consistencia de lo que devolvió el *direct
  read*.
- **43**: la consulta va a los nodos que respondan "más rápido"; ante inconsistencias vale la réplica
  de **timestamp más reciente**, que es la que se devuelve; una vez alcanzado el nivel de
  consistencia, se envía un *digest request* **al resto de las réplicas** para ver si también son
  consistentes.

Los dos archivos complementarios de esta unidad desarrollan esta lectura en dos niveles: el handout
de Bloom, **dentro de un nodo** (qué SSTables leer; slides 30 y 40), y el diagrama DIGEST, **entre
réplicas** (slides 41–43) (§ *Material complementario*). (atención) La reparación **en segundo plano** que describen
los slides 42–43 y el paso 5 del diagrama se eliminó en Cassandra 4.0 → § *Lo que el deck dice…*,
fila 5.

→ Desarrollo: [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]].

### Bloque 7 · Slides 44–47 — Consistencia y QUORUM

- **44**: consistencia reconfigurable (***consistency_level***): **al escribir**, en cuántas réplicas
  hay que escribir para confirmar al cliente; **al leer**, cuántas deben responder. Los datos viven en
  un clúster o *ring*; cada nodo tiene réplicas de distintos rangos, y si uno se cae responde su
  réplica; un protocolo P2P replica según el **factor de replicación**.
- **45**: la consistencia se elige para lecturas y escrituras, con este ejemplo (que **no corre** en
  Cassandra 5.0 → fila 8 de la tabla del § siguiente):

```sql
SELECT * FROM users WHERE state='TX' USING CONSISTENCY QUORUM;
```

- **45–46**, las dos tablas de niveles, resumidas en una:

| Nivel | Lectura (slide 45) | Escritura (slide 46) |
| --- | --- | --- |
| `ANY` | — *(no figura)* | al menos **un nodo disponible** |
| `ONE` / `TWO` / `THREE` | responde con 1/2/3 de las réplicas más cercanas; *"por defecto"*, reparación de lectura en segundo plano | commit log y MemTable de al menos 1/2/3 réplicas |
| `QUORUM` | devuelve cuando respondieron **n/2+1** réplicas | commit log y MemTable en un quórum de réplicas; *"fuerte consistencia"*; se determina por `(replication_factor/2)+1` |
| `LOCAL_QUORUM` | n/2+1 réplicas **del data center del coordinador** | quórum en el data center del coordinador; evita la latencia entre data centers |
| `EACH_QUORUM` | el quórum **de cada** data center | quórum en **todos** los data centers; *"Consistencia fuerte"* |
| `ALL` | todas las réplicas | commit log y MemTable de **todas** las réplicas: la mayor consistencia y la menor disponibilidad |

- **La fórmula del QUORUM**, en el slide 45, debajo del pie (fuera del área de contenido), tal cual:

```text
Quorum = (sum_of_replication_factors / 2) + 1
```

  El deck la escribe de tres maneras: `n/2+1` (tabla de lectura), `(replication_factor/2)+1` (tabla
  de escritura) y la de arriba, que **suma los factores de todos los data centers**. Las tres
  coinciden con un solo data center. La división es **entera**: el motor lo confirma (fila 9).
- **47**: pese a los *tombstones* puede haber datos inconsistentes, así que se recomienda
  mantenimiento rutinario: existe una operación **`repair`** para dejar todos los nodos consistentes.

(documentación oficial, no está en el deck) La regla que falta: si **W + R > RF** (réplicas que
confirman la escritura más réplicas que responden la lectura), toda lectura se superpone con al menos
una réplica que tiene la última escritura. Con RF 3 y QUORUM en las dos, 2 + 2 = 4 > 3. Es la misma
condición `W+R > N` de Corbellini § 3.2 (p. 6, en el texto; la Table 3 de esa página da las
configuraciones de W y R), y el quórum `N/2+1` está en la p. 7.

→ Desarrollo: [[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]].

### Bloque 8 · Slides 48–49 — Seguridad

**48**: usuarios con *login* y *password*, y permisos vía `GRANT`/`REVOKE`; cifrado cliente–clúster y
entre nodos; opciones de *backup* (recomendadas ante borrados accidentales); herramientas externas
(DataStax Enterprise) para autenticación externa, cifrado de tablas y auditoría. **49** (el título
dice *"Securidad (cont.)"*), el código:

```sql
-- Roles
CREATE ROLE alice WITH PASSWORD = 'password_a' AND LOGIN = true;
GRANT report_writer TO alice;
REVOKE report_writer FROM alice;
LIST ROLES;
-- Users
CREATE USER alice WITH PASSWORD 'password_a' SUPERUSER;
-- Permissions
GRANT SELECT ON ALL KEYSPACES TO data_reader;
REVOKE SELECT ON ALL KEYSPACES FROM data_reader;
LIST ALL PERMISSIONS ON keyspace1.table1 OF bob;
```

Es la misma lógica de roles que en MySQL → [[1.11.02 - Usuarios, privilegios y roles|Usuarios,
privilegios y roles]]. **Con la configuración por defecto del contenedor, ninguna de estas sentencias
corre** (fila 10 del § siguiente).

### Bloque 9 · Slides 50–62 — Modelo de datos, keyspace, particionado e índices

- **50–51**: **columna** (unidad básica: *name*, *value*, *timestamp*); **supercolumna** (columna que
  guarda subcolumnas; *"opcionales (se desaconseja su uso)"*); **fila** (conjunto de columnas de una
  familia); **familia de columnas** (equivale a una tabla; cada fila se accede por una *ClaveDeFila*);
  **keyspace** (agrupa familias de columnas; normalmente uno por aplicación); **clúster** (los nodos
  de una instancia; puede tener varios keyspaces).
- **52**: la columna, con el recuadro `struct Column { 1: binary name, 2: binary value, 3: i64
  timestamp }`.
- **53**: la supercolumna: sus valores son subcolumnas ordenadas, sin límite de cantidad; **no tiene
  timestamp propio** y **no es recursiva** (un solo nivel). El esquema del slide:

```text
Supercolumna (
  Nombre de la columna -> "XXX" (
    columna1 -> "XXX" (
      Nombre -> "Nombre del campo"
      Valor -> "Valor del campo"
      Timestap -> "Marca de tiempo"
    )
    columna2 -> "XXX" (
      Nombre -> "Nombre del campo"
      Valor -> "Valor del campo"
      Timestap -> "Marca de tiempo"
    )
  )
)
```

  y al lado un diagrama `super_column_name` con `column1`, `column2` y `column3`, cada una con
  `value` y `timestamp`.
- **54**: los valores **y el timestamp** los pone la aplicación, así que los relojes del sistema y del
  clúster deben estar sincronizados; el timestamp **resuelve conflictos** (consistencia eventual); por
  convención, **microsegundos desde el 01/01/1970**. Recuadro: `{ "name": "Nombre_de_usuario",
  "value": "Braulio123", "timestamp": 987654321 }`.
- **55**: la **fila** agrega columnas bajo un nombre (*rowKey*) y equivale a la fila relacional.
  Diagrama: KEY `9871r.... 12mj` → `Nombre_de_usuario = Braulio123`, `Fecha_de_registro =
  2015-04-01T20:21:01`, `Teléfono = 898765432`.
- **56**: la **RowKey** equivale a la clave primaria y tiene dos partes: **de particionado** (*partition
  key*: las filas con el mismo valor quedan en la misma partición, *"físicamente juntas"*) y **de
  agrupamiento** (*clustering key*: el orden físico de las filas).
- **57–58**: la familia de columnas se guarda **en un fichero separado, ordenado por la RowKey**; tipos
  de columna: *Standard*, *Counter*, *Collection* (`SET`, `LIST`, `MAP`), *User-defined type*,
  *Tuple-type* y *Timestamp type*. El 58 repite el diagrama del 55 con una segunda fila: KEY `911u....
  1pop` → `Joaquín89`, `2014-04-02T10:01:01`, `123764436`.
- **59**: el **keyspace** equivale al esquema relacional; atributos: `replication_factor` (cuántos
  nodos guardan copia; 3 → tres réplicas), `SimpleStrategy` (un solo centro de datos) y
  `NetworkTopologyStrategy` (varios). Ejemplo:
  `CREATE KEYSPACE nombre WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 3};`
- **60**: particionado: **RandomPartitioner** (hash; *equilibrio uniforme de los datos*) y
  **OrderPreservingPartitionioner** (así, con la errata) (claves cercanas en el mismo nodo o en nodos
  adyacentes; mantiene el orden natural). No nombra `Murmur3Partitioner`, que es el que usa Cassandra
  por defecto (fila 13).
- **61**: **índices primarios**: únicos por fila; el *partitioner* y la *replica placement strategy*
  asignan cada fila a un nodo según su índice primario; como cada nodo conoce su rango, se escanean
  solo los índices de las réplicas buscadas.
- **62**: **índices secundarios**: sobre columnas, implementados como **tabla oculta**; no se
  recomiendan cuando hay que revisar mucho volumen para devolver pocos resultados. *(Compárese con
  [[1.08.02 - Índices|Índices]] del lado relacional.)*

→ Desarrollo: [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Bases de datos tabulares]] ·
estrategias de replicación, particionadores e índices primarios en [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]] ·
la RowKey (56) en [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]] ·
los índices secundarios (62) en [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]].

### Bloque 10 · Slides 63–71 — Clave primaria y `ALLOW FILTERING`

El deck usa **la misma tabla `usuarios` con cuatro claves primarias distintas**, una por slide. Con
los cuatro usuarios de los slides 65–66, así queda repartida:

| Slide | `PRIMARY KEY` | *Partition key* | *Clustering* | Particiones con los 4 usuarios |
| :---: | --- | --- | --- | --- |
| 63 | `(idusuario,nombre)` | `idusuario` | `nombre` | — *(el slide no carga datos)* |
| 65 | `(mes,nombre)` | `mes` | `nombre` | **2**: `mes = 5` (Albert, John) y `mes = 11` (John, Peter) |
| 66 | `(idusuario)` | `idusuario` | — | **4**, una fila cada una *("No hay clustering key")* |
| 68 | `((idusuario, mes),nombre)` | `(idusuario, mes)`, **compuesta** | `nombre` | — |

- **63**, el CREATE en imagen, con sus rótulos (nombre de la tabla, nombres y tipos de las columnas):

```sql
CREATE TABLE usuarios (
idusuario text,
nombre text,
mes int,
registro time,
PRIMARY KEY (idusuario,nombre))
```

  La primera parte de la *KEY* define la *partition key* (`idusuario`); la segunda, la *clustering
  key* o clave de ordenamiento (`nombre`).
- **64**: *"¡El orden importa!"*: el primer valor de la *primary key* es la *partition key* y el
  segundo, la *clustering key* — `PRIMARY KEY (mes, idusuario)`. Las dos pueden ser compuestas:
  `PRIMARY KEY ((idusuario,mes),nombre,registro)` (partición `(idusuario,mes)`, *clustering*
  `nombre,registro`).
- **65–66**: las réplicas de las filas de una partición están físicamente juntas; particiones
  distintas pueden vivir en nodos distintos. En el motor, `token(mes)` es el mismo para las dos filas
  de `mes = 5` (`-7509452495886106294`) y otro para las de `mes = 11`; con `PRIMARY KEY (idusuario)`,
  cada fila tiene su propio token.
- **67**, anatomía de una consulta (imagen con rótulos): `SELECT idusuario FROM usuarios WHERE
  idusuario='1p67' ORDER BY nombre`. *Proyección* (`*` = todas las columnas); *tabla consultada*, una
  sola (**no hay JOINs**); *criterios de búsqueda*: en el `WHERE` solo columnas de la *partition key*
  o con índice secundario, y si la *partition key* es compuesta van **todos** sus campos; *criterios
  de ordenamiento*: siempre sobre columnas de la *clustering key*.
- **68**: con `PRIMARY KEY ((idusuario, mes),nombre)`, `SELECT idusuario FROM usuarios WHERE mes=9`
  *"devolvería un error"* porque falta parte de la *partition_key*, y `… WHERE mes=9 AND
  idusuario='agp88'` es correcta.
- **69**: dos capturas de la documentación oficial (en inglés): la *primary key* de CQL tiene *partition
  key* (primer componente; una columna, o varias entre paréntesis adicionales; la tabla mínima es
  `CREATE TABLE t (k text PRIMARY KEY);`) y *clustering columns* (las que siguen; su orden define el
  *clustering order*); ejemplos `PRIMARY KEY (a)`, `PRIMARY KEY (a, b, c)` y `PRIMARY KEY ((a, b), c)`.
- **70–71**, *"Why ALLOW FILTERING?"*: la tabla `blogs (blogId int, time1 int, time2 int, author text,
  content text, PRIMARY KEY(blogId, time1, time2))`; `SELECT * FROM blogs;` devuelve todo, pero
  `SELECT * FROM blogs WHERE time1 = 1418306451235;` da el error *"Bad Request: Cannot execute this
  query as it might involve data filtering and thus may have unpredictable performance. If you want to
  execute this query despite the performance unpredictability, use ALLOW FILTERING."* El 71 explica por
  qué: Cassandra solo puede resolverla leyendo toda la tabla y filtrando; si el 95 % de un millón de
  filas cumple, `ALLOW FILTERING` es razonable; si cumplen 2, se leen 999.998 filas de más, y si la
  consulta es frecuente conviene un **índice** sobre `time1`. Cassandra no puede distinguir los dos
  casos, así que avisa y deja la decisión al usuario.

→ Desarrollo: [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]].

### Bloque 11 · Slides 72–74 — Vistas materializadas, funciones y *triggers*

- **72**, vista materializada:

```sql
CREATE MATERIALIZED VIEW monkeySpecies_by_population AS
SELECT * FROM monkeySpecies
WHERE population IS NOT NULL AND species IS NOT NULL
PRIMARY KEY (population, species)
WITH comment='Allow query by population instead of species';
```

  El recuadro dice que la vista no se actualiza directamente, pero que las actualizaciones de la tabla
  base se propagan a ella. Es la otra respuesta al problema del slide 70: **otra tabla con otra clave
  primaria** para consultar por otra columna (compárese con [[1.06.01 - Vistas|Vistas]]).
- **73**: CQL tiene funciones **escalares** (`SELECT * FROM myTable WHERE date >= currentDate() - 2d;`,
  los datos de los últimos dos días) y **de agregación** (`SELECT SUM (players) FROM plays;`).
- **74**, *trigger*:

```text
CREATE TRIGGER myTrigger
ON myTable
#(java class)
USING 'org.apache.cassandra.triggers.AuditTrigger‘
```

  El recuadro dice que la lógica se escribe en un lenguaje de la JVM y vive **fuera de la base**, en el
  subdirectorio `lib/triggers` de la instalación; se carga al arrancar el clúster, está en cada nodo, y
  el *trigger* se dispara **antes** de la sentencia DML, lo que *"asegura la atomicidad"*. Cierra con
  `DROP TRIGGER myTrigger;`. *(Compárese con [[1.09.04 - Triggers|Triggers]] en MySQL, que se escriben
  en SQL dentro de la base.)*

→ Desarrollo: [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]].

---

## Lo que el deck dice y Cassandra 5.0 no hace

Todo corrido en **Cassandra 5.0.9** (`cqlsh` dentro del contenedor, un solo nodo, configuración por
defecto: `AllowAllAuthenticator`, `AllowAllAuthorizer`, `materialized_views_enabled: false`). Los
keyspaces de prueba se llaman `c15clase*` en vez de los nombres del deck, para no pisar otros. Los
mensajes van literales.

| # | Slide | Lo que dice el deck | Qué pasa en Cassandra 5.0.9 | Estado |
| :---: | :---: | --- | --- | :---: |
| 1 | 20 | `CREATE COLUMNFAMILY MisColumnas (id text, Apellido text, Nombre text, …)` y la salida `id \| nombre \| apellido` · `(1 fila)` | `CREATE COLUMNFAMILY` **corre** (crea una tabla común: `DESCRIBE` la muestra como `CREATE TABLE c15clase_miespacioclaves.miscolumnas`). Los identificadores sin comillas pasan a **minúsculas** y la salida es `id \| apellido \| nombre` · `(1 rows)`: primero la *partition key*, después las demás columnas **en orden alfabético** | (atención) |
| 2 | 20, 59 | keyspace con `'replication_factor' : 3` | se crea, con `Warnings : Your replication factor 3 for keyspace c15clase_miespacioclaves is higher than the number of nodes 1`. Leer en `QUORUM` ahí falla: `Cannot achieve consistency level QUORUM … 'required_replicas': 2, 'alive_replicas': 1` | (atención) |
| 3 | 12 | tokens de −2⁶³ a 2⁶³ | el token es un `bigint`: de **−2⁶³ a 2⁶³ − 1**. `token(id) >= -9223372036854775808` corre; `-9223372036854775809` y `9223372036854775808` dan `Unable to make long from '…'` | (atención) menor |
| 4 | 12 | los nodos se reparten el rango de tokens | con `num_tokens: 16`, **cada nodo tiene 16 tokens** (`SELECT tokens FROM system.local` devuelve 16 valores); `SELECT id, token(id) FROM users` devuelve las filas **en orden de token**, no de `id` (1, 2, 4, 3) | ✓ |
| 5 | 28, 42–43, 45 | reparación de lectura **en segundo plano**, y *"por defecto"* en la tabla de lectura | **eliminada en 4.0** (`NEWS.txt`: *"Background repair has been removed"*). `ALTER TABLE users WITH read_repair_chance = 0.1;` → `SyntaxException: Unknown property 'read_repair_chance'`. Las tablas nacen con `read_repair = 'BLOCKING'`: ante un *digest* distinto, el coordinador pide los datos completos y repara **antes** de responder (documentación oficial, *Read repair*) | ✗ |
| 6 | 38 | un único "tiempo de gracia" para que un nodo caído reciba el borrado | son dos plazos distintos: `gc_grace_seconds = 864000` (10 días que el *tombstone* sobrevive a la compactación; `DESCRIBE TABLE`) y `max_hint_window: 3h` (durante cuánto tiempo se siguen generando *hints* —escrituras pendientes— para un nodo caído; `cassandra.yaml`). El `cassandra.yaml` advierte del riesgo de *"data resurrection"* si un nodo estuvo caído más que `gc_grace_seconds` | (atención) |
| 7 | 39 | "LLTS" | es **TTL**: `INSERT … USING TTL 3600;` → `SELECT TTL(name), WRITETIME(name)` devuelve `3600 \| 1790703923660627`; `sstabledump` muestra `"ttl" : 3600, "expires_at" : "2026-09-29T18:45:23Z"` | (atención) nombre |
| 8 | 45 | `SELECT * FROM users WHERE state='TX' USING CONSISTENCY QUORUM;` | `SyntaxException: line 1:37 no viable alternative at input 'USING'`. Hoy el nivel se fija **fuera** de la sentencia: en `cqlsh`, `CONSISTENCY QUORUM;` (por defecto es `ONE`); en un driver, por sentencia. Además `state` no es clave: sin `USING` la consulta pide `ALLOW FILTERING`. Con `CONSISTENCY QUORUM;` + `… WHERE state='TX' ALLOW FILTERING;` devuelve Ana y Caro | ✗ |
| 9 | 45–46 | `Quorum = (sum_of_replication_factors / 2) + 1` | ✓, con división entera. `required_replicas` de `QUORUM` por RF: **1→1, 2→2, 3→2, 4→3, 5→3, 6→4**; `ALL` pide RF | ✓ |
| 10 | 45–46 | niveles `ANY`, `ONE/TWO/THREE`, `QUORUM`, `LOCAL_QUORUM`, `EACH_QUORUM`, `ALL` | existen todos. `ANY` solo para escribir: al leer, `ANY ConsistencyLevel is only supported for writes`; al escribir en el keyspace RF 3, corre. `EACH_QUORUM` también corre en lectura. Existen además `LOCAL_ONE`, `SERIAL` y `LOCAL_SERIAL`, que el deck no nombra. `CONSISTENCY GLOBAL_QUORUM;` y `CONSISTENCY NONE;` → `Improper CONSISTENCY command.` | (atención) |
| 11 | 49 | roles, usuarios y permisos | con la configuración por defecto nada corre: `CREATE ROLE alice WITH PASSWORD = 'password_a' AND LOGIN = true;` → `org.apache.cassandra.auth.CassandraRoleManager doesn't support PASSWORD`; `CREATE ROLE`, `GRANT`, `REVOKE`, `LIST ROLES`, `LIST ALL PERMISSIONS` → `Unauthorized: … You have to be logged in and not anonymous to perform this request`; `CREATE USER … SUPERUSER` → `Only superusers can create a role with superuser status`. Requiere activar autenticación y autorización en `cassandra.yaml` (no probado aquí) | ✗ por configuración |
| 12 | 50–53 | supercolumnas; `struct Column` | no hay sintaxis CQL para declararlas (el intento `s SUPER COLUMN` da `SyntaxException`); eran del modelo de la API Thrift, **eliminada en 4.0** (`NEWS.txt`); `nodetool enablethrift` → `Found unexpected parameters: [enablethrift]` | ✗ |
| 13 | 60 | `RandomPartitioner` y `OrderPreservingPartitioner` | el particionador por defecto es **`Murmur3Partitioner`** desde 1.2 (`NEWS.txt`; `system.local` lo confirma). Las clases `RandomPartitioner`, `OrderPreservingPartitioner` y `ByteOrderedPartitioner` siguen en el jar 5.0.9, *"for backward compatibility only"*, y el particionador **no se puede cambiar sin recargar todos los datos** (`cassandra.yaml`) | (atención) |
| 14 | 57 | tipos *Standard*, *Counter*, `SET`/`LIST`/`MAP`, UDT, *tuple*, *timestamp* | ✓ todos. `set` se devuelve ordenado (`{'pop', 'rock'}`); una tabla con `counter` **no admite columnas comunes**: `Cannot mix counter and non counter columns in the same table` | ✓ |
| 15 | 59 | `NetworkTopologyStrategy` para varios data centers | ✓ con el data center real (`'datacenter1': 3`). Con uno inexistente: `ConfigurationException: Unrecognized strategy option {dc2} passed to NetworkTopologyStrategy for keyspace c15clase_nts2` | ✓ |
| 16 | 62, 71 | índice secundario sobre `time1` | `CREATE INDEX blogs_time1_idx ON blogs (time1);` corre; la primera consulta, inmediatamente después, falló con `ReadFailure` (el log dice `The secondary index 'blogs_time1_idx' is not yet available`); segundos después, `WHERE time1 = 1418306` devuelve las filas **sin** `ALLOW FILTERING`. El índice por defecto es `legacy_local_table` (la "tabla oculta" del slide) | ✓ |
| 17 | 65 | `registro time` con valores `21-05-2015` | `InvalidRequest: … (TimeType) Unable to coerce '21-05-2015' to a formatted time (long)`; tampoco acepta `'2015-05-21'`: `time` es una **hora del día** (`'20:21:01'`); para fechas es `date` | ✗ datos |
| 18 | 67 | `WHERE idusuario=‘1p67’` (comillas tipográficas) | con la consulta en dos líneas, como en el slide: `Invalid syntax at line 2, char 17`, con el cursor en la comilla `‘`. Con comillas rectas y `ORDER BY nombre` devuelve `Ana`, `Zoe` | (atención) |
| 19 | 67 | en el `WHERE` solo *partition key* o columnas indexadas | incompleto: también entran las de *clustering* después de la *partition key* (`WHERE idusuario='1p67' AND nombre='Ana'` corre). `ORDER BY mes` → `Order by is currently only supported on the clustered columns of the PRIMARY KEY, got mes`; `ORDER BY` sin fijar la partición → `ORDER BY is only supported when the partition key is restricted by an EQ or an IN.` | (atención) |
| 20 | 68 | `WHERE mes=9` *"devolvería un error"* porque falta parte de la *partition key* | ✓ falla, pero con el mensaje de filtrado, no con uno de clave incompleta: `Cannot execute this query as it might involve data filtering … use ALLOW FILTERING`. Lo mismo con `WHERE idusuario='agp88'` sola. **Con `ALLOW FILTERING` corre** y devuelve `agp88`. En un `DELETE` o un `UPDATE` el error sí nombra la clave: `Some partition key parts are missing: idusuario` (*keyspace* `auditcass`). La consulta correcta corre con comillas rectas; el slide no pone `;` (en `cqlsh`: `Incomplete statement at end of file`) | (atención) |
| 21 | 70 | `SELECT * FROM blogs WHERE time1 = 1418306451235;` → error de filtrado | **otro error**: `time1` es `int` y el literal no entra (máximo 2.147.483.647): `Unable to make int from '1418306451235'`, **aun con `ALLOW FILTERING`**. Con un `int` válido (`1418306`) aparece el mensaje del slide, con prefijo `InvalidRequest: Error from server: code=2200 [Invalid query] message=` en vez de `Bad Request:`; con `ALLOW FILTERING` devuelve las filas. Con `time1 bigint`, el literal original da el error de filtrado y con `ALLOW FILTERING` devuelve la fila | (atención) |
| 22 | 72 | `CREATE MATERIALIZED VIEW …` | `InvalidRequest: … Materialized views are disabled. Enable in cassandra.yaml to use.` (`materialized_views_enabled: false`; `NEWS.txt` dice que la comunidad ya no las recomienda para producción y las considera **experimentales**) | ✗ |
| 23 | 73 | `SELECT * FROM myTable WHERE date >= currentDate() - 2d;` | la aritmética de fechas existe, pero sin fijar la partición pide `ALLOW FILTERING`; con `WHERE id = 1 AND date >= currentDate() - 2d` devuelve la fila de hoy | (atención) |
| 24 | 73 | `SELECT SUM (players) FROM plays;` | ✓ `11`, con `Warnings : Aggregation query used without partition key`. `AVG(players)` sobre `int` da **`3`** (11/3 truncado): el promedio conserva el tipo de la columna | ✓ |
| 25 | 74 | el `CREATE TRIGGER` del slide | tal cual: `Invalid syntax at line 3, char 1` (`#` no es comentario en CQL; son `--`, `//` y `/* */`) y además la comilla de cierre es tipográfica. Corregido (`… USING 'org.apache.cassandra.triggers.AuditTrigger';`): `Trigger class 'org.apache.cassandra.triggers.AuditTrigger' couldn't be loaded` — `AuditTrigger` no viene instalado. En la imagen oficial el directorio de *triggers* no es `lib/triggers`, como dice el slide, sino `/etc/cassandra/triggers/`, y solo tiene un `README.txt`: *"Place triggers to be loaded in this directory, as jar files."* `NEWS.txt` presenta los *triggers* como **experimentales** desde 2.0 | ✗ |
| 26 | 74 | `DROP TRIGGER myTrigger;` | `SyntaxException: … mismatched input ';' expecting K_ON`: falta la tabla. Correcto: `DROP TRIGGER IF EXISTS myTrigger ON myTable;` | ✗ |

**Las salidas que más importan, completas:**

```text
cqlsh:c15clase_miespacioclaves> SELECT * FROM MisColumnas;        -- slide 20
 id | apellido | nombre
----+----------+--------
  1 |    Perez |   Juan

(1 rows)

cqlsh:c15clase> SELECT * FROM users WHERE state='TX' USING CONSISTENCY QUORUM;   -- slide 45
SyntaxException: line 1:37 no viable alternative at input 'USING' (...FROM users WHERE state='TX' [USING]...)

cqlsh:c15clase_rf5> CONSISTENCY QUORUM;                          -- fórmula del slide 45, RF 5
Consistency level set to QUORUM.
cqlsh:c15clase_rf5> SELECT * FROM t WHERE id = 1;
NoHostAvailable: … Unavailable('Error from server: code=1000 [Unavailable exception] message="Cannot achieve consistency level QUORUM" info={'consistency': 'QUORUM', 'required_replicas': 3, 'alive_replicas': 1}')

cqlsh:c15clase> SELECT * FROM blogs WHERE time1 = 1418306451235 ALLOW FILTERING;  -- slide 70
InvalidRequest: Error from server: code=2200 [Invalid query] message="Unable to make int from '1418306451235'"

cqlsh:c15clase> CREATE MATERIALIZED VIEW monkeySpecies_by_population AS … ;       -- slide 72
InvalidRequest: Error from server: code=2200 [Invalid query] message="Materialized views are disabled. Enable in cassandra.yaml to use."
```

**El timestamp resuelve conflictos, verificado** (slide 54). Dos escrituras sobre la misma fila con
*timestamps* puestos por la aplicación, la segunda **más vieja**:

```sql
INSERT INTO users (id, name, state) VALUES (20, 'escrito-con-ts-2000', 'TX') USING TIMESTAMP 2000;
INSERT INTO users (id, name, state) VALUES (20, 'escrito-con-ts-1000', 'TX') USING TIMESTAMP 1000;
SELECT id, name, WRITETIME(name) FROM users WHERE id = 20;
--  id | name                | writetime(name)
--  20 | escrito-con-ts-2000 |            2000
```

Gana la de mayor *timestamp*, aunque llegó primero, y no queda ninguna "versión" de la otra: es
*last write wins*. Los `WRITETIME` que pone el servidor son microsegundos desde 1970
(`1790703923660627`), la convención del slide 54.

---

## Contradicciones internas y erratas

| # | Contradicción | Slides | Detalle |
| :---: | --- | :---: | --- |
| 1 | **Agregaciones** | 6 ↔ 73 | el 6 dice que *sum* y *avg* deben hacerse del lado del cliente; el 73 enseña `SUM` en CQL. En el motor, `SUM` y `AVG` corren, con aviso si abarcan varias particiones (fila 24) |
| 2 | **Quién elige el coordinador** | 12 ↔ 37 | *"será el driver"* contra *"una política predefinida en la Base de Datos"* |
| 3 | **Año de Apache** | 10 ↔ 22 | *top-level* en febrero de 2010 contra *"Proyecto apache en 2009"*; no se contradicen si 2009 es el ingreso a Apache y 2010 la promoción, pero el deck no lo aclara |
| 4 | **Volumen** | 22 ↔ 24 | *"terabytes de datos"* contra *"cientos de gigabytes de datos"* |
| 5 | **Tres fórmulas del quórum** | 45 ↔ 46 | `n/2+1`, `(replication_factor/2)+1` y `(sum_of_replication_factors / 2) + 1`: iguales con un data center |
| 6 | **"El segundo valor"** | 64 ↔ 64, 69 | el 64 dice que el segundo valor de la *primary key* es la *clustering key*, y en el mismo slide la *clustering* es `nombre,registro` (dos columnas); el 69 lo dice bien: **las que siguen** a la *partition key* |
| 7 | **Qué entra en el `WHERE`** | 67 ↔ 69 y motor | el 67 limita el `WHERE` a la *partition key* e índices; las columnas de *clustering* también entran (fila 19) |
| 8 | **`registro time`** | 63–66 | la columna es `time` —el propio rótulo del 63 glosa los tipos como *"texto, entero, hora"*— y los datos de los slides 65–66 son fechas (fila 17) |
| 9 | **`time1 int`** | 70 | el literal no entra en `int` (fila 21); el ejemplo viene de una fuente en inglés que no se cita |
| 10 | **"No deterministas"** | 30 | un filtro de Bloom da siempre la misma respuesta para la misma clave; lo probabilístico es la **tasa de falsos positivos** (§ *Material complementario* (a)). Tampoco es un *caché*, ni se consulta *después* de la consulta: se consulta **antes** de leer cada SSTable |

| Slide | Errata | Lo correcto |
| :---: | --- | --- |
| 4 | *"Base de Dato"* | Base de Datos |
| 11 | *"Es distribuida, lo quiere decir que…"* | lo que quiere decir |
| 13 | *"a través de la shell. de CQL, cqlshell"* | la shell de CQL, `cqlsh` |
| 16 | *"la clave de partición de nuestro datos"* | nuestros datos |
| 17 | *"una de las características principio"* | principales |
| 23 | *"Los datos estás disponibles"* | están |
| 27 | *"reciénte"* | reciente |
| 33 | *"MenTable"* | MemTable |
| 39 | *"LLTS"* | TTL |
| 41 | *"cuantos nodos"* | cuántos |
| 43 | *"Se envía la consulta aquellos nodos"* | a aquellos nodos |
| 49 | *"Securidad (cont.)"* | Seguridad |
| 53 | *"Timestap"* (dos veces) | Timestamp |
| 54 | *"El timestamp es usa para resolver conflictos"* | se usa |
| 60 | *"OrderPreservingPartitionioner"* | `OrderPreservingPartitioner` |
| 67 | *"particion key"*; comillas `‘1p67’` | *partition key*; comillas rectas |
| 68 | comillas `‘agp88’` | comillas rectas |
| 71 | *"999, 998 rows"* | 999.998 filas |
| 74 | `#(java class)`; `'…AuditTrigger‘`; `DROP TRIGGER myTrigger;` | sin la línea `#`; comilla recta; `… ON myTable;` |

**Hay erratas en 19 de los 74 slides**, y **cinco impiden ejecutar el código tal cual**: las comillas
de los slides 67, 68 y 74, el `#` del 74 y el `DROP TRIGGER` sin `ON`. Además, ninguna sentencia de
los slides 63–68 termina en `;`: pegada así en `cqlsh`, queda esperando (`Incomplete statement at
end of file`). A eso se suman los errores de fondo del ejemplo (filas 17 y 21) y lo que la versión
5.0 ya no tiene o trae deshabilitado (filas 5, 8, 12 y 22).

---

## Material complementario (sin número de clase)

> [!info] Dos archivos archivados junto al deck, **sin `BD2_Clase NN` en el nombre**
> Están en `raw/Unidad-03/Teorica/`. **No son clases**: no llevan número de la cátedra, no tienen
> portada de clase ni fecha. Se asignan a la Clase 15 **por tema y por carpeta**: la Unidad 3 solo
> tiene esta clase, el handout de Bloom desarrolla los filtros que el deck nombra en el slide 30, y el
> diagrama DIGEST dibuja la lectura de los slides 40–43. Si acompañan a la teórica del 05/10, se
> reasignan.

### (a) `Slides_Bloom_Filters_Cassandra.pdf` — filtros de Bloom

Ocho slides exportados de Google Slides (`Title: Slides_Bloom_Filters_Cassandra.pptx`), sin autor ni
fecha, con el pie *"Base de Datos II · Cassandra · Bloom Filters"* y el número de página. Los títulos
internos van numerados de 1 a 7 a partir de la página 2.

**Transcripción, página por página:**

| Pág. | Título | Contenido |
| :---: | --- | --- |
| 1 | *Bloom Filters en Cassandra* | subtítulo: *"Una estructura probabilística para evitar búsquedas innecesarias en SSTables"*. Recuadro: *"Puede decir con certeza NO está; si dice puede estar, hay que comprobar."* Dos cajas: **NO → definitivo** (verde) y **TAL VEZ → comprobar** (azul) |
| 2 | *1. El problema* | *"Una lectura puede tener que considerar varias SSTables"*. Cinco cajas `SSTable 1` … `SSTable 5`; debajo, **"Buscar partition key = 125"**, unida a la `SSTable 3`. Pregunta: *"¿cómo descartar rápidamente SSTables donde la clave seguro no existe?"* |
| 3 | *2. ¿Qué contiene un Bloom Filter?* | *"Un vector de bits + varias funciones hash"*. Vector de 10 posiciones (0 a 9), todas en `0`; tres cajas `h1(clave)`, `h2(clave)`, `h3(clave)`. *"Cada hash selecciona una posición del vector."* |
| 4 | *3. Insertar una clave* | *"Ejemplo: Juan → posiciones 2, 5 y 8"*. Vector `0 0 1 0 0 1 0 0 1 0` (las posiciones 2, 5 y 8 en verde); `h1(Juan)=2 h2(Juan)=5 h3(Juan)=8`. *"Al insertar, esas posiciones pasan a 1."* |
| 5 | *4. Consultar: ¿está Pedro?* | *"Supongamos h(Pedro) → posiciones 2, 4 y 8"*. El mismo vector, con 2 y 8 en verde (valen 1) y **4 en rojo (vale 0)**. *"Aparece un 0 → Pedro DEFINITIVAMENTE NO fue agregado"* · *"No hay falsos negativos."* |
| 6 | *5. ¿Y si todas las posiciones son 1?* | *"El Bloom Filter sólo puede responder: 'posiblemente está'"*. Caja **Bloom Filter: PUEDE ESTAR** → *"Luego hay que comprobar la SSTable"*. Tabla de cuatro filas sin encabezado (lo que dice el filtro · lo que pasa en realidad · resultado): NO está · No está · ✓ — NO está · Sí está · ✗ imposible (en rojo) — Puede estar · Sí está · ✓ — Puede estar · No está · ✓ falso positivo (en rojo) |
| 7 | *6. ¿Cómo lo usa Cassandra?* | *"El Bloom Filter no encuentra el dato: descarta dónde no vale la pena buscar"*. SSTable 1 · Bloom → NO · DESCARTAR; SSTable 2 · NO · DESCARTAR; **SSTable 3 · TAL VEZ · COMPROBAR**; SSTable 4 · NO · DESCARTAR; **SSTable 5 · TAL VEZ · COMPROBAR**. Pie: *"Más memoria para el filtro → menos falsos positivos → menos búsquedas innecesarias"* |
| 8 | *7. Para cerrar la explicación* | *"Tres ideas que deberían llevarse"*: 1 · es probabilístico y muy compacto; 2 · "NO" es seguro, "puede estar" requiere comprobación; 3 · Cassandra lo usa para evitar trabajo innecesario sobre SSTables. Pregunta final: *"¿por qué es aceptable tener falsos positivos, pero no falsos negativos?"* |

**Explicación** *(resolución del vault)*. El handout completa el slide 33: como una partición puede
estar repartida en varias SSTables, una lectura tendría que abrir todas. Cada SSTable lleva un filtro
de Bloom de sus claves de partición; antes de tocar el disco, el nodo le pregunta a cada filtro:

1. **Insertar** una clave pone en 1 los *k* bits que eligen sus *k* funciones hash (Juan → 2, 5, 8).
2. **Consultar**: si alguno de los *k* bits está en 0, la clave **seguro no está** (Pedro: el bit 4
   vale 0). Si todos están en 1, **puede estar**: esos bits pudieron quedar en 1 por **otras** claves.
   Si una clave nunca insertada cayera en 2, 5 y 8 —los bits de Juan—, el filtro diría "puede estar"
   y Cassandra leería esa SSTable para nada: eso es un **falso positivo**.
3. **Falsos negativos no hay**, porque los bits solo pasan de 0 a 1: si la clave se insertó, sus bits
   están en 1.

La respuesta a la pregunta de la página 8: un falso positivo **cuesta una lectura de más** (la
SSTable se abre y la clave no está; el resultado sigue siendo correcto). Un falso negativo haría
**saltear una SSTable que sí tiene el dato**, y la lectura devolvería un resultado incompleto o
viejo: sería un error, no una ineficiencia. Por eso el filtro se diseña para que el error sea solo de
un lado. El tamaño manda: con 10 bits y 3 funciones hash, después de 3 claves la probabilidad de falso
positivo ronda el 21 % (≈ (1 − e^(−3·3/10))³); con más bits por clave baja, que es el *"más memoria →
menos falsos positivos"* de la página 7.

**En el motor.** Cada SSTable tiene su componente `…-Filter.db` (`nb-1-big-Filter.db` en
`c15clase.users`); la tasa objetivo es una propiedad de tabla, `bloom_filter_fp_chance = 0.01` (1 %,
por defecto en `DESCRIBE TABLE`), y `nodetool tablestats` informa `Bloom filter false positives`,
`Bloom filter false ratio` y `Bloom filter space used` (unas decenas de bytes en estas tablas de
prueba, de pocas filas). Lo que
el slide 30 dice mal —"después de cada consulta", "caché", "no deterministas"— está en la
contradicción 10.

→ [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]].

### (b) `mecanismo de obtencion de resultados DIGEST (cassandra).png` — la lectura entre réplicas

Infografía de 1536 × 1024 px, sin metadatos. **Qué muestra:**

- **Título**: *"MECANISMOS DE OBTENCIÓN DE RESULTADOS EN CASSANDRA"*; subtítulo: *"Cómo Cassandra logra
  consistencia eventual en lecturas"*. Leyenda de colores: Cliente, Coordinador, Réplica A (verde),
  Réplica B (naranja), Réplica C (violeta). Recuadro: *"Ejemplo: Factor de réplica = 3"* y *"Niveles de
  consistencia: ONE, QUORUM, ALL, etc."*
- **Panel inicial**: el cliente envía un `SELECT` a **cualquier nodo**, que actúa como **coordinador**
  y tiene debajo las tres réplicas.
- **Paso 1 · Direct read request**: el coordinador elige **una** réplica (*"usualmente la más
  rápida"*), la A, y le pide el **valor completo**.
- **Paso 2 · Digest request**: a las **otras** réplicas (B y C) les pide solo un **resumen** (*digest*,
  un hash) del dato, no el dato completo.
- **Paso 3 · ¿Los datos coinciden?**: se comparan los *digests*. **Caso 1**, `A = B = C`: todo
  consistente, se devuelve el dato. **Caso 2**, `A ≠ B o C`: hay inconsistencia y se pasa al paso 4.
- **Paso 4 · Resolver inconsistencia**: el coordinador consulta las tres réplicas, con *timestamps*
  `t1 = 10:00` (A), **`t2 = 10:05` (B, con una corona)** y `t3 = 09:58` (C), y elige **el dato más nuevo
  (mayor timestamp)**: ese es el resultado de la lectura.
- **Paso 5 · Background read repair**: el coordinador actualiza **en segundo plano** A y C, que tenían
  datos viejos; *"No bloquea la respuesta"*.
- **Cierre**: el coordinador devuelve el resultado al cliente; *"La reparación en lectura (Read
  Repair) mejora la consistencia del sistema con el tiempo"*; una tira *"EN RESUMEN"* con los cinco
  pasos y una **idea clave**: Cassandra prioriza la disponibilidad y usa estas lecturas para detectar
  y corregir inconsistencias progresivamente.

**Cómo encaja con los slides 40–43:**

| Diagrama | Deck | Coincide |
| --- | --- | :---: |
| panel inicial (cualquier nodo es coordinador) | 26, 41 | ✓ |
| paso 1, *direct read* a la réplica más rápida | 41 (*direct read request*) y 43 (*"más rápido"*) | ✓ |
| paso 2, *digest* a las otras réplicas | 42 (*digest request*: tantos nodos como el nivel de consistencia) | (atención) el diagrama pide *digest* a **todas** las demás; el deck, a las que exige el nivel, y después **al resto** (43) |
| paso 3, comparar *digests* | 42 (*"se comprueba la consistencia de los datos retornados"*) | ✓ |
| paso 4, gana el mayor *timestamp* | 43 (*"válidos las réplicas con un timestamp más reciente"*) y 54 (el timestamp resuelve conflictos) | ✓ |
| paso 5, reparación en segundo plano | 28 y 42 (*background read repair request*) | ✓ con el deck, ✗ con Cassandra ≥ 4.0 |

**Tres cosas que el diagrama deja afuera** *(resolución del vault)*:

1. **Un hash no trae timestamp.** En el paso 4 el coordinador no puede elegir "el de mayor
   timestamp" mirando *digests*: tiene que pedir el **dato completo** a las réplicas que no
   coincidieron. La documentación oficial (*Read repair*) lo describe así: ante un *digest* distinto,
   el coordinador envía un pedido de lectura completa a esas réplicas y elige, por *timestamps*, la
   más reciente.
2. **En el ejemplo, la réplica del *direct read* es la vieja.** A respondió con `10:00` y la más nueva
   es B (`10:05`). Con nivel `ONE` solo hay *direct read*: el cliente habría recibido el dato de A,
   viejo. Con RF 3 y `QUORUM` el coordinador espera 2 respuestas (un dato y un *digest*); como en el
   ejemplo las tres réplicas difieren entre sí, cualquier par detecta la inconsistencia, pero el
   valor de las `10:05` vuelve al cliente **solo si B es una de las dos**. Ese valor está en una sola
   réplica, es decir, se escribió con W = 1: W + R = 1 + 2 = 3 no supera RF 3, y la lectura en
   `QUORUM` no alcanza para garantizarlo. Con la escritura también en `QUORUM`, B no podría ser la
   única réplica al día.
3. **El paso 5 ya no es así.** Cassandra 4.0 eliminó la reparación en segundo plano (`read_repair_chance`
   → `Unknown property` en 5.0.9); la reparación que quedó es **bloqueante** (`read_repair =
   'BLOCKING'`, por defecto): el coordinador no responde hasta reparar las réplicas que consultó para
   el nivel de consistencia (documentación oficial). Las réplicas que no participaron de la lectura
   se ponen al día por *hinted handoff* o por `nodetool repair` (slide 47). En el contenedor, con
   RF 1, `nodetool repair c15clase` responde `Replication factor is 1. No repair is needed for
   keyspace 'c15clase'`.

→ [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]] ·
[[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]].

---

## Para el parcial

> [!important] Los dos exámenes de 1C 2026 son los de mayor peso del vault
> Son del cuatrimestre anterior, con la misma cátedra y la misma plataforma. Entre los dos, **doce
> preguntas involucran a Cassandra** y **nueve son específicamente sobre ella**. La resolución
> completa de cada una está en su página; aquí va qué evalúan y en qué slide está la respuesta.

### ★★ [[Parcial 1Q2026]] (desaprobado)

| Preg. | Puntaje | Qué evalúa | Dónde está en el deck | Trampa |
| :---: | :---: | --- | --- | --- |
| 7 | 0/5 · ensayo | función de la *partition key* y de la *clustering key* | 56, 63–64, 69 | el alumno respondió *"determinar quién va a participar de la clave"* y *"el orden de la clave"*; el comentario docente pide lo del slide 56: la *partition key* **distribuye** las filas en el clúster y la *clustering key* **ordena** las filas dentro de la partición |
| 14 | 2/8 · ensayo | RF = 5 con escritura y lectura en `QUORUM`: a) cuántos nodos confirman, b) ¿consistencia fuerte?, c) dos nodos con datos viejos, d) qué mecanismo corrige | 42–47 | a) **3** = ⌊5/2⌋+1 (el motor pide `required_replicas: 3`); b) sí, **porque 3 + 3 = 6 > 5**: el alumno puso *"sí, ya que se utiliza QUORUM"* y el docente anotó que no responde a la consistencia; c) la lectura en quórum toca al menos una réplica al día, el *digest* no coincide y gana el mayor *timestamp* (43); d) la **reparación de lectura** (28, 42), y `repair` (47): el alumno la dejó en blanco |
| 16 | 2/2 | qué base delega la coordinación de nodos en una herramienta externa | 12, 25–28 | la clave es **Neo4j**; Cassandra es distractor: coordina sola, peer-to-peer con *gossip* |
| 24 | 1/1 · V/F | *"La arquitectura de Cassandra es Master-Slave"* | 12, 26 | **Falso** |
| 26 | 3/3 | componentes de un nodo | 30–31 | **Commit Log, Memtable y SSTable**; *Disk table* y *Memory space* restan |
| 31 | 3/3 · ensayo | `CREATE KEYSPACE` en CQL | 20, 59 | la respuesta del alumno (`WITH replication : {…}`) **no corre**: `SyntaxException … no viable alternative at input ':'`. La plataforma la aprobó; lo correcto es `=`. El `'replication_factor':'1'` como texto sí corre |
| 34 | 1,99/3 · varias correctas | `blogs` con `PRIMARY KEY ((blogId, time1), time2)` y `WHERE time1 = 1418306451235` | 67–68, 70–71 | clave: falla porque no incluye `blogId`, porque la *performance* es impredecible y porque no se puede filtrar solo por `time1`. El alumno omitió la de *performance* (es literalmente el mensaje del motor). En 5.0.9 la consulta falla antes, porque el literal no entra en `int` (fila 21) |

### ★★ [[Recuperatorio 1Q2026]] (aprobado con nota baja)

| Preg. | Puntaje | Qué evalúa | Dónde está en el deck | Trampa |
| :---: | :---: | --- | --- | --- |
| 25 | 0/4 | tabla de posiciones de un juego (*UserID*, *Score*), 1.000.000 de transacciones por segundo: qué NoSQL | 3, 67 | el alumno marcó MongoDB. (atención) **La clave de la plataforma es Redis**, no Cassandra (opción E). Un *ranking* global por *score* no es una consulta natural en Cassandra: `ORDER BY` solo ordena **dentro** de una partición (slide 67; en el motor, `ORDER BY is only supported when the partition key is restricted by an EQ or an IN.`) |
| 26 | 3/3 | bases vistas en clase en configuración **CA** | 11 | MySQL y Neo4j; Cassandra resta, porque es **AP** |
| 34 | 2,5/2,5 | correspondencias Tabular vs. RDBMS | 4 | la tabla del slide 4, literal: Keyspace → Base de datos, Column Family → Tabla, Cluster → Instancia |
| 35 | 2/2 · V/F | *"SSTable es una estructura de datos residente en la memoria"* | 30 | **Falso**: la residente en memoria es la MemTable |
| 36 | 0,89/3 · varias correctas | niveles de consistencia **de escritura** válidos | 46 | los seis de la tabla del 46: `ALL`, `QUORUM`, `EACH_QUORUM`, `ONE/TWO/THREE`, `LOCAL_QUORUM`, `ANY`. *Global Quorum* y *None* no existen (`Improper CONSISTENCY command.`) y restan 20 % cada una. El alumno marcó tres correctas y *Global Quorum*: 3 × 16,66 % − 20 % ≈ 0,89 |

### Exámenes anteriores

- [[Parcial 2Q2025]] § *Sección I*: Preguntas **7** (terminología → slide 4; es la Pregunta 34 del
  recuperatorio), **8** (componentes → 30; la 26 del parcial 1Q2026), **14** (SSTable en memoria →
  30; la 35 del recuperatorio), **23** (`blogs` y `ALLOW FILTERING` → 70–71; la 34 del parcial
  1Q2026 cambia la clave a `((blogId, time1), time2)`), **26** (fórmula del QUORUM → 45–46), **28** (Master-Slave → 12, 26; la
  24 del parcial 1Q2026) y **29** (*Primary Key*, ensayo → 56, 63–64, 69; la 7 del parcial 1Q2026).
  Con Cassandra como opción: la **13** (bases en CA → 11; la 26 del recuperatorio) y la **33**
  (coordinación delegada en una herramienta externa; la 16 del parcial 1Q2026), ambas en § *Sección
  F*.
- [[Parcial XC-202X]] § *Sección E*: Ejercicio **7** (esquema de un nodo → 30–34) y **8** (V/F: CQL
  solo `INSERT` → 13, consistencia por *query* → 11, redundancia → 27, master-slave → 12, *key-value*
  → 2 y 14).
- [[Final 1Jul2025]] Pregunta **4** y [[Final 1Dic2025]] Pregunta **5** (motor para escritura masiva:
  videojuego y sensores IoT → 3, 11, 16, 32), repetidas como Ejercicios 24 y 32 de
  [[Repaso Final BD 2]]. (atención) Contrastar con la Pregunta 25 del recuperatorio 1Q2026.
- [[Práctica subida por la cátedra]] Ejercicio **9** (`CREATE KEYSPACE` → 59; corre en 5.0.9 con el
  aviso de RF mayor que la cantidad de nodos).
- [[Final 1Dic2023]] Pregunta **2** (qué base versiona sus datos): Cassandra aparece como opción. Según
  el slide 54, el *timestamp* resuelve el conflicto; en el motor, la escritura con *timestamp* menor se
  descarta sin dejar versión (*last write wins*, § *Lo que el deck dice…*): no versiona.
- Cruce por tema en [[Mapa de exámenes]].

**Qué llevarse:**

- ★★★ La tabla del slide 4, los tres componentes del slide 30, que la SSTable está en disco,
  Cassandra = **AP** y **peer-to-peer** (no master-slave): cinco preguntas que ya salieron dos veces
  cada una.
- ★★★ *Partition key* = **distribución** entre nodos (hash → token); *clustering key* = **orden**
  dentro de la partición. En ensayo, con un ejemplo de clave compuesta `((a, b), c)`.
- ★★★ QUORUM = ⌊RF/2⌋+1 y el argumento **W + R > RF** para la consistencia fuerte; saber qué pasa con
  réplicas viejas (*digest* distinto → gana el mayor *timestamp* → *read repair*).
- ★★ Las tres causas del error de `blogs`: falta la *partition key*, no se puede filtrar por una
  *clustering* sola, *performance* impredecible → `ALLOW FILTERING` o un índice.
- ★★ Los niveles de consistencia **exactos** de la tabla del slide 46 (ANY solo en escritura), y
  `CREATE KEYSPACE … WITH replication = {…}` con `=`.
- ★ Elegir motor por el **patrón de consulta**, no solo por el volumen: escritura masiva de series →
  Cassandra; *ranking* global por puntaje → no es una consulta natural para Cassandra.

---

## Dudas abiertas

- [ ] (crítico) **¿La cátedra acepta `USING CONSISTENCY` en el parcial?** Está en el slide 45 y no
  corre desde Cassandra 2.2. Ningún examen del vault pide escribir una consulta con nivel de
  consistencia; si aparece, conviene escribir `CONSISTENCY QUORUM;` y aclarar la sintaxis del deck.
- [x] (ok) **Leaderboard: Redis; escritura masiva: Cassandra.** La Pregunta 25 del
  [[Recuperatorio 1Q2026]] tiene clave **Redis** para una tabla de posiciones con 10⁶ transacciones
  por segundo, igual que la Pregunta 10 del [[Parcial 23-5-23 - Bases de Datos Avanzadas|Parcial 23-5-23]]
  (10⁵ transacciones por segundo, sin Cassandra entre las opciones): no es un cambio de criterio. Lo
  que decide es el *ranking* ordenado por *score* (*sorted set*); para el videojuego con 10⁹
  escrituras por segundo del [[Final 1Jul2025]], sin tabla de posiciones, el vault sostiene
  **Cassandra**. Redis se dicta el 26/10, después del parcial.
- [ ] (crítico) **¿Qué modelo de lectura se evalúa, el del deck o el de Cassandra 4.0+?** El deck y el
  diagrama DIGEST enseñan la reparación en segundo plano, que ya no existe. La Pregunta 14 d) del
  [[Parcial 1Q2026]] pregunta *"qué mecanismo corrige automáticamente el problema"*: la respuesta
  segura nombra la **reparación de lectura** (*read repair*) y, si hay espacio, aclara que desde
  Cassandra 4.0 es bloqueante y solo toca las réplicas consultadas.
- [ ] **¿"LLTS" es TTL?** No hay otra lectura posible, pero conviene confirmarlo en clase.
- [ ] **¿Supercolumnas, `struct Column` y particionadores entran como teoría?** Son del modelo Thrift,
  eliminado en 4.0; el deck dedica cuatro slides (50–53) y el 60. Ningún examen del vault los pregunta.
- [ ] **¿Qué trae la teórica del 05/10 (*"Conceptos teóricos de Cassandra"*)?** Este deck ya cubre
  arquitectura, escritura, lectura y consistencia. Si llega un deck 16, ver si reemplaza o amplía, y
  si los dos archivos complementarios eran para esa clase.
- [ ] **Autoría del deck**: el pie dice Guillermo Rodriguez y los metadatos del PDF, Godio Claudio
  Jose. Sin consecuencia para el estudio.
- [ ] **Vistas materializadas y *triggers* en el TP10 Parte II**: vienen deshabilitadas (vistas) o sin
  clase instalada (*trigger*) en la imagen `cassandra:5.0`. Si el TP las pide, hace falta
  `materialized_views_enabled: true` en `cassandra.yaml` o un jar en `/etc/cassandra/triggers/`.
- [ ] **Seguridad**: el slide 49 no corre con la configuración por defecto. ¿El TP10 activa
  `PasswordAuthenticator`? El enunciado menciona el usuario `cassandra` para DataGrip →
  [[Práctica 2026-09-29]].

## Enlaces

- Clase anterior: [[Clase 14 - MongoDB Features]] *(14/09; el 21/09 fue Día del Estudiante)* · clase
  siguiente: *(05/10, "Conceptos teóricos de Cassandra" según el [[_cronograma]])*
- Práctica de esa semana (martes 29/09): **[[Práctica 2026-09-29]]** — TP 10 Cassandra Parte I
- Conceptos que **nacen** en esta clase:
  [[3.15.01 - Bases de datos tabulares — familias de columnas y keyspaces|Bases de datos tabulares]] ·
  [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]] ·
  [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]] ·
  [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]] ·
  [[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]] ·
  [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]]
- Conceptos existentes que esta clase **retoma**: [[2.12.04 - Teorema CAP|Teorema CAP]] *(Cassandra en
  AP, slide 11)* · [[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]] *(las
  políticas de reparación)* ·
  [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
  [[2.12.01 - NoSQL — origen, propiedades y taxonomía|NoSQL — taxonomía]] ·
  [[1.11.05 - Recovery y write-ahead logging (WAL)|Recovery y WAL]] *(el commit log)* ·
  [[1.08.02 - Índices|Índices]] · [[1.06.01 - Vistas|Vistas]] · [[1.09.04 - Triggers|Triggers]] ·
  [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]]
- Motor: [[Cassandra]] · comparar con [[MongoDB]] y [[MySQL]]
- Bibliografía: Corbellini et al. 2017 § 5.2 *(p. 13)*, § 5.1.1–5.1.2 *(pp. 11–12)*, § 3.2 y Table 3
  *(pp. 5–7)*, Table 2 *(p. 5)* → [[Corbellini et al (2017) - Persisting big-data — ficha]] · detalle
  en [[_index-bibliografia]] › Clase 15
- Exámenes: [[Parcial 1Q2026]] · [[Recuperatorio 1Q2026]] · [[Parcial 2Q2025]] ·
  [[Parcial XC-202X]] · [[Final 1Jul2025]] · [[Final 1Dic2025]] · [[Repaso Final BD 2]] ·
  [[Práctica subida por la cátedra]] · [[Mapa de exámenes]]
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] · calendario:
  [[_cronograma]] · TPs: `raw/tp/_index.md`
