---
tipo: guia
unidad: 3
orden: 13
tema: "TP10 - Cassandra Parte II"
resumen: "TP10 Parte II resuelto en Cassandra 5.0.9: modelado orientado a consultas de un blog (columna STATIC, balde por mes) y de un e-commerce desde su DER, Cassandra en CAP, y nueve ejercicios de exámenes viejos sobre clave primaria, modelado y CAP."
fuentes:
  - "raw/Unidad-03/Practica/ITBA TP 10 - Cassandra Parte II.pdf"
  - "raw/Examenes_Viejos/1C-26/Parcial/BDII Parcial - 1Q2026.pdf"
  - "raw/Examenes_Viejos/2C-26/Ejercicios tipo Parcial Bases de Datos II.pdf"
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Parcial 2Q2025.docx"
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Final 1Dic2025.docx"
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Finales Viejos.docx"
estado: procesado
---

# Guía TP10 — Cassandra Parte II

## Resumen general

La Parte II del TP10 pide **modelar**: dado un dominio y sus consultas frecuentes, diseñar las
tablas de Cassandra. El Ejercicio 1 es un blog de noticias con cuatro consultas, el 2 un e-commerce
que llega como DER con cinco consultas, y el 3 pide ubicar a Cassandra en el teorema CAP. No hay
comandos ni datos en el enunciado: las tablas, los datos de prueba y las consultas de esta guía son
la resolución, y todas se corrieron en Cassandra 5.0.9.

El método es siempre el mismo: **una tabla por consulta**. Lo que la consulta fija por igualdad es la
*partition key*; el orden que pide, la *clustering key*; y se agrega a la *clustering key* un
identificador para que dos filas no se pisen. Se duplican datos porque CQL no tiene *joins*. Una
relación N:M del DER no se convierte en una tabla intermedia, sino en **una tabla por cada sentido en
que se consulta**.

Lo que hay que llevarse al parcial: la *partition key* decide **en qué nodo** se guarda una fila y la
*clustering key*, **en qué orden** dentro de la partición (así lo corrigió el docente en 1C 2026); un
rango sin partición fijada pide `ALLOW FILTERING`, y se resuelve con un **balde** (mes, día); una
columna `STATIC` se guarda una vez por partición; `ORDER BY` con `IN` sobre la partición falla con
paginación. Cassandra es **AP** con consistencia ajustable por operación. La última sección suma nueve
ejercicios de exámenes viejos sobre los mismos temas, con su resolución.

## Setup

El mismo contenedor de la [[Guía TP10 - Cassandra Parte I|Parte I]]:

```bash
docker start Mycassandra                 # o docker run --name Mycassandra -d cassandra
docker exec -it Mycassandra cqlsh
```

```sql
CREATE KEYSPACE tp10b WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE tp10b;
```

---

## Ejercicio 1 — blog de noticias

**Consigna:** un blog donde cada autor tiene nombre, nombre de usuario, cuenta de X y descripción; las
noticias tienen título, cuerpo, fecha de publicación, un autor y, opcionalmente, una lista de *tags*;
y los comentarios registran quién los escribió, el texto y el momento. Hay que tener presentes dos
objetivos: (1) distribuir los datos en el clúster y (2) que cada consulta acceda a la menor cantidad
de particiones. Las consultas frecuentes son:

- usuarios por nombre de usuario;
- usuarios por cuenta de X;
- noticias de un usuario, por su nombre de usuario, con su descripción, ordenadas por fecha;
- comentarios en un rango de fechas, ordenados por fecha, con el título de la noticia y el usuario.

a) Crear las *column families*; b) insertar registros de prueba; c) correr las consultas.

### a) Las tablas

| Consulta | Fija por igualdad | Ordena por | Partition key | Clustering key |
| --- | --- | --- | --- | --- |
| usuario por *username* | `username` | — | `username` | — |
| usuario por cuenta de X | `cuenta_x` | — | `cuenta_x` | — |
| noticias de un usuario | `username` | fecha | `username` | `fecha_publicacion DESC, id_noticia` |
| comentarios en un rango | nada | fecha | `mes` (balde) | `fecha_comentario, id_comentario` |

```sql
CREATE TABLE usuarios_por_username (
  username text PRIMARY KEY, nombre text, cuenta_x text, descripcion text);

CREATE TABLE usuarios_por_cuenta_x (
  cuenta_x text PRIMARY KEY, username text, nombre text, descripcion text);

CREATE TABLE noticias_por_usuario (
  username          text,
  descripcion       text STATIC,
  fecha_publicacion timestamp,
  id_noticia        timeuuid,
  titulo text, cuerpo text, tags set<text>,
  PRIMARY KEY ((username), fecha_publicacion, id_noticia)
) WITH CLUSTERING ORDER BY (fecha_publicacion DESC, id_noticia ASC);

CREATE TABLE comentarios_por_mes (
  mes              text,
  fecha_comentario timestamp,
  id_comentario    timeuuid,
  comentario text, username text, id_noticia timeuuid, titulo_noticia text,
  PRIMARY KEY ((mes), fecha_comentario, id_comentario)
) WITH CLUSTERING ORDER BY (fecha_comentario ASC, id_comentario ASC);
```

- Las dos primeras tablas guardan **los mismos datos** con distinta clave. Un índice secundario sobre
  `cuenta_x` también respondería, pero consulta todos los nodos; la tabla duplicada lee una partición.
- `descripcion STATIC` se guarda **una vez por partición** y sale en cada fila: la consulta 3 la
  muestra con cada noticia sin repetirla, y cambiarla es un solo `UPDATE`.
- `id_noticia` en la *clustering key* evita que dos noticias del mismo instante se pisen (`INSERT` es
  un *upsert*).
- La consulta 4 no fija nada por igualdad: sin el balde `mes`, un rango de fechas pide
  `ALLOW FILTERING`. El mes acota la partición; con mucho volumen, el balde baja a día.
- El título de la noticia y el usuario **se copian** en cada comentario: no hay *join*.

### b) Datos de prueba

```sql
BEGIN BATCH
  INSERT INTO usuarios_por_username (username, nombre, cuenta_x, descripcion)
  VALUES ('mgarcia', 'María García', '@mgarcia_news', 'Periodista de tecnología');
  INSERT INTO usuarios_por_cuenta_x (cuenta_x, username, nombre, descripcion)
  VALUES ('@mgarcia_news', 'mgarcia', 'María García', 'Periodista de tecnología');
APPLY BATCH;

INSERT INTO noticias_por_usuario (username, descripcion) VALUES ('mgarcia', 'Periodista de tecnología');
INSERT INTO noticias_por_usuario (username, fecha_publicacion, id_noticia, titulo, cuerpo, tags)
VALUES ('mgarcia', '2026-10-01 10:00:00+0000', 50554d6e-29bb-11e5-b345-feff819cdc9f,
        'Sale Cassandra 5.1', 'Cuerpo 1', {'cassandra', 'bases'});

INSERT INTO comentarios_por_mes (mes, fecha_comentario, id_comentario, comentario, username, id_noticia, titulo_noticia)
VALUES ('2026-10', '2026-10-01 12:00:00+0000', now(), 'Excelente', 'jperez',
        50554d6e-29bb-11e5-b345-feff819cdc9f, 'Sale Cassandra 5.1');
```

El `BATCH` escribe las dos tablas de usuarios juntas: o se aplican las dos o ninguna. La corrida
cargó además a `jperez`, dos noticias más de `mgarcia` (20/09 y 03/10) y tres comentarios más (uno de
septiembre, dos de octubre) con el mismo molde.

### c) Consultas

```sql
SELECT * FROM usuarios_por_username WHERE username = 'mgarcia';
SELECT * FROM usuarios_por_cuenta_x WHERE cuenta_x = '@jperez';
SELECT username, descripcion, fecha_publicacion, titulo, tags
FROM noticias_por_usuario WHERE username = 'mgarcia';
SELECT fecha_comentario, comentario, titulo_noticia, username
FROM comentarios_por_mes
WHERE mes = '2026-10' AND fecha_comentario >= '2026-10-01' AND fecha_comentario < '2026-10-04';
```

```text
-- noticias de mgarcia
 username | descripcion              | fecha_publicacion               | titulo                   | tags
----------+--------------------------+---------------------------------+--------------------------+------------------------
  mgarcia | Periodista de tecnología | 2026-10-03 09:00:00.000000+0000 |        MongoDB 9 en beta |                   null
  mgarcia | Periodista de tecnología | 2026-10-01 10:00:00.000000+0000 |       Sale Cassandra 5.1 | {'bases', 'cassandra'}
  mgarcia | Periodista de tecnología | 2026-09-20 18:00:00.000000+0000 | Redis cambia de licencia |              {'redis'}
-- comentarios del 01/10 al 03/10
 fecha_comentario                | comentario | titulo_noticia     | username
---------------------------------+------------+--------------------+----------
 2026-10-01 12:00:00.000000+0000 |  Excelente | Sale Cassandra 5.1 |   jperez
 2026-10-02 20:00:00.000000+0000 |  Lo espero | Sale Cassandra 5.1 |  mgarcia
```

Las noticias salen de la más nueva a la más vieja sin `ORDER BY`. Tres comprobaciones más:

- `UPDATE noticias_por_usuario SET descripcion = 'Editora de tecnología' WHERE username = 'mgarcia'`
  cambia la descripción en las tres filas.
- Un rango que cruza meses va con `IN`:
  `WHERE mes IN ('2026-09','2026-10') AND fecha_comentario >= '2026-09-15' AND fecha_comentario < '2026-10-03'`
  devuelve tres comentarios. (atención) Agregarle `ORDER BY` falla: `Cannot page queries with both
  ORDER BY and a IN restriction on the partition key; … disable paging for this query`. Con
  `PAGING OFF` en `cqlsh` corre; en una aplicación, se ordena en el cliente.
- Sin balde, `WHERE fecha_comentario >= '2026-10-01'` falla pidiendo `ALLOW FILTERING`.

---

## Ejercicio 2 — e-commerce a partir de un DER

**Consigna:** con este DER, crear las estructuras de Cassandra que respondan cinco consultas.

![DER del e-commerce del TP10 Parte II](../assets/tp10b-der-ecommerce.png)

**Usuario** (`id`, nombre, email, password) y **Producto** (`id`, título, tags, descripción) se
relacionan por tres N:M: *publica* (fecha), *comenta* (fecha, comentario) y *califica* (fecha,
fecha). **Producto** pertenece N:1 a **Categoría** (`nombre`, fecha de creación, descripción).
Las consultas:

1. usuario por ID;
2. producto por ID;
3. productos publicados por un usuario (por nombre);
4. usuarios que comentaron un producto (por nombre de producto);
5. qué productos calificó un usuario, por fecha.

(atención) *califica* trae dos `Fecha` y ningún puntaje; y el "nombre" del producto es su `titulo`,
que no es clave (dos productos homónimos comparten partición).

**Resolución:**

```sql
CREATE TABLE usuarios_por_id (
  id_usuario uuid PRIMARY KEY, nombre text, email text, password text);

CREATE TABLE productos_por_id (
  id_producto uuid PRIMARY KEY, titulo text, descripcion text, tags set<text>,
  categoria text, categoria_descripcion text, categoria_fecha_creacion date);

CREATE TABLE productos_por_usuario (
  nombre_usuario text, fecha_publicacion timestamp, id_producto uuid,
  id_usuario uuid, titulo text, descripcion text,
  PRIMARY KEY ((nombre_usuario), fecha_publicacion, id_producto)
) WITH CLUSTERING ORDER BY (fecha_publicacion DESC, id_producto ASC);

CREATE TABLE comentadores_por_producto (
  titulo_producto text, id_usuario uuid, fecha_comentario timestamp,
  nombre_usuario text, email text, comentario text,
  PRIMARY KEY ((titulo_producto), id_usuario, fecha_comentario));

CREATE TABLE calificaciones_por_usuario (
  id_usuario uuid, fecha_calificacion timestamp, id_producto uuid,
  titulo_producto text, nombre_usuario text,
  PRIMARY KEY ((id_usuario), fecha_calificacion, id_producto)
) WITH CLUSTERING ORDER BY (fecha_calificacion DESC, id_producto ASC);
```

- La categoría no tiene consulta propia y es N:1: se **embebe** en el producto.
- *publica* se consulta desde el usuario (tabla 3), *comenta* desde el producto (tabla 4) y *califica*
  desde el usuario (tabla 5): una tabla por sentido de consulta.
- *"Un usuario 'X'"* no dice si es id o nombre; la tabla 5 usa `id_usuario`.

Con dos usuarios (`ana`, `beto`), dos productos de `ana`, tres comentarios sobre la *Notebook X1*
(dos de `beto`) y dos calificaciones de `beto`:

```sql
SELECT fecha_publicacion, titulo FROM productos_por_usuario WHERE nombre_usuario = 'ana';
SELECT id_usuario, nombre_usuario, fecha_comentario FROM comentadores_por_producto WHERE titulo_producto = 'Notebook X1';
SELECT fecha_calificacion, titulo_producto FROM calificaciones_por_usuario
WHERE id_usuario = 22222222-2222-2222-2222-222222222222;
```

```text
 fecha_publicacion               | titulo
---------------------------------+-------------
 2026-10-03 10:00:00.000000+0000 |    Mouse M2
 2026-10-01 10:00:00.000000+0000 | Notebook X1

 id_usuario                           | nombre_usuario | fecha_comentario
--------------------------------------+----------------+---------------------------------
 11111111-1111-1111-1111-111111111111 |            ana | 2026-10-02 10:00:00.000000+0000
 22222222-2222-2222-2222-222222222222 |           beto | 2026-10-02 09:00:00.000000+0000
 22222222-2222-2222-2222-222222222222 |           beto | 2026-10-04 09:00:00.000000+0000

 fecha_calificacion              | titulo_producto
---------------------------------+-----------------
 2026-10-05 12:00:00.000000+0000 |     Notebook X1
 2026-10-01 12:00:00.000000+0000 |        Mouse M2
```

`beto` sale dos veces porque comentó dos veces, y `SELECT DISTINCT` no sirve (solo admite columnas de
partición). Si la consulta quiere cada usuario una vez, la clave se achica a
`PRIMARY KEY ((titulo_producto), id_usuario)`: el segundo comentario pisa al primero, y la consulta
devuelve `ana` y `beto` una vez cada uno. Buscar en `productos_por_id` por `titulo` falla pidiendo
`ALLOW FILTERING`.

---

## Ejercicio 3 — Cassandra en el teorema CAP

**Consigna:** clasificar a Cassandra según el teorema CAP.

**Resolución:** **AP**, disponibilidad y tolerancia a particiones con consistencia eventual (Clase 15,
slide 11; Corbellini et al. 2017, Table 2). No hay maestro: cualquier réplica viva acepta lecturas y
escrituras, y ante una partición de red cada lado sigue respondiendo; las réplicas se ponen al día
después (*hinted handoff*, *read repair*, `repair`). El matiz que suma puntos: la consistencia **se
elige por operación**. Con `QUORUM` en lectura y escritura, `W + R > RF` y toda lectura ve la última
escritura confirmada, a cambio de fallar si no se juntan las réplicas.

---

## Ejercicios de exámenes viejos

Los mismos temas, tal como los tomó la cátedra. Los dos primeros son del [[Parcial 1Q2026]], el de
mayor peso del vault.

### Parcial 1Q2026, pregunta 7 — partition key y clustering key (ensayo, 5 puntos)

**Consigna:** ¿qué función cumple la *partition key*? ¿Y la *clustering key*?

**Resolución:** la *partition key* define **cómo se distribuyen** las filas en el clúster: por hash se
convierte en un token que ubica la partición en un nodo y sus réplicas, y todas las filas con el mismo
valor quedan juntas. La *clustering key* define **cómo se ordenan** las filas dentro de la partición,
y con la *partition key* hace única cada fila. Una respuesta que habló de "quién participa de la
clave" y "el orden de la clave" sacó 0/5: hay que nombrar **distribución** y **orden**. En este TP:
`username` reparte las noticias por autor; `fecha_publicacion` las ordena.

### Parcial 1Q2026, pregunta 34 — `WHERE` con parte de la partition key (opción múltiple, 3 puntos)

**Consigna:** con
`CREATE TABLE blogs (blogId int, time1 int, time2 int, author text, content text, PRIMARY KEY ((blogId, time1), time2));`,
¿qué pasa con `SELECT * FROM blogs WHERE time1 = 1418306451235;`? A. Devuelve los blogs de ese
`time1` · B. Ninguna · C. Falla porque no incluye `blogId` · D. Falla porque la performance es
impredecible · E. Falla porque no se puede filtrar solo por `time1`.

**Resolución:** **C, D y E**. La *partition key* es compuesta: hay que dar sus dos componentes. D es el
texto del error (`… might involve data filtering and thus may have unpredictable performance … use
ALLOW FILTERING`). Es el mismo error de la consulta de comentarios sin balde del Ejercicio 1.

### Parcial 2Q2025, pregunta 23 — `WHERE` sin la partition key (opción múltiple)

**Consigna:** la misma tabla con `PRIMARY KEY (blogId, time1, time2)` (partición `blogId`, *clustering*
`time1, time2`) y la misma consulta. A. Devuelve los datos · B. Falla porque no se puede filtrar solo
por `time1` · C. Falla porque no incluye `blogId` · D. Devuelve los datos si se agrega
`ALLOW FILTERING` · E. Ninguna.

**Resolución:** **B, C y D**. Sin `blogId` no hay partición fijada; con `ALLOW FILTERING` corre, pero
recorre todas las particiones.

### Parcial 2Q2025, pregunta 29 — la Primary Key en Cassandra (ensayo)

**Consigna:** explique cómo se constituye una *Primary Key* en Cassandra y qué función cumple cada
componente, con ejemplos.

**Resolución:** dos partes: la *partition key* (la primera componente, o el primer grupo entre
paréntesis), que determina el nodo, y las columnas de *clustering*, que ordenan dentro de la
partición. Tres ejemplos de este TP: simple, `PRIMARY KEY (id_usuario)`; con *clustering*,
`PRIMARY KEY ((username), fecha_publicacion, id_noticia)`; con partición compuesta,
`PRIMARY KEY ((id_sensor, fecha), fecha_hora)`.

### Ejercicios tipo Parcial, ejercicio 13 — mediciones de sensores

**Consigna:** una aplicación registra mediciones con `id_sensor`, `fecha_hora`, `tipo`, `valor` y
`ciudad`, y la consulta frecuente es "las mediciones de un sensor durante un día, en orden
cronológico". Proponer la tabla, sus claves, el `CREATE TABLE`, un `INSERT`, la consulta del sensor
S01 el 2026-10-01, y explicar por qué no conviene un modelo normalizado con `JOIN`.

**Resolución:** el mismo patrón que el balde del Ejercicio 1, con el día como balde:

```sql
CREATE TABLE mediciones_por_sensor_dia (
  id_sensor text, fecha date, fecha_hora timestamp, tipo text, valor double, ciudad text,
  PRIMARY KEY ((id_sensor, fecha), fecha_hora)
) WITH CLUSTERING ORDER BY (fecha_hora ASC);

INSERT INTO mediciones_por_sensor_dia (id_sensor, fecha, fecha_hora, tipo, valor, ciudad)
VALUES ('S01', '2026-10-01', '2026-10-01 14:30:00+0000', 'temperatura', 22.5, 'Buenos Aires');

SELECT * FROM mediciones_por_sensor_dia WHERE id_sensor = 'S01' AND fecha = '2026-10-01';
```

Las mediciones salen por hora sin `ORDER BY`. Cassandra no tiene `JOIN`, y juntar filas de varias
particiones (de varios nodos) es lo que el modelo evita: se copian `tipo` y `ciudad` en cada fila.
Detalle completo en [[Ejercicios tipo Parcial Bases de Datos II]].

### Final 1Dic2025, pregunta 5 — sensores IoT de una empresa de logística

**Consigna:** camiones y contenedores con sensores, unos 2.000 datos por segundo por vehículo; se pide
una base tolerante a particiones, altamente disponible y escalable horizontalmente, con consultas
históricas como "la temperatura promedio de cada sensor en la última semana". Elegir motor y
justificar.

**Resolución:** **Cassandra**: es AP, escala agregando nodos, la escritura es barata (commit log y
MemTable) y la consulta se conoce de antemano. Clave: `PRIMARY KEY ((sensor_id, dia), ts)`. El
promedio de una semana es una consulta por sensor sobre siete particiones
(`dia IN (…)`), o una tabla de agregados que la aplicación mantiene al escribir. Corrido en
[[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado]] § 4.2.

### Final 1Jul2025, pregunta 4 — videojuego con 10⁹ escrituras por segundo

**Consigna:** un videojuego con `userID` y `score`, y mil millones de escrituras por segundo. ¿Qué
base de datos usar?

**Resolución:** **Cassandra**, por el volumen de **escritura** y porque el *score* no necesita ACID. Al
modelarla: el *ranking* se ordena solo dentro de una partición, así que una tabla
`PRIMARY KEY ((juego), score, user_id)` concentra todas las escrituras del juego en una partición, y
actualizar un puntaje crea una fila nueva. (clave) Si el enunciado dice **tabla de posiciones**, la
clave del [[Recuperatorio 1Q2026]] (P25) fue **Redis**. Detalle en
[[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado]] § 4.1.

### Parcial 1Q2026, pregunta 24 — ¿Cassandra es master-slave? (V/F, 1 punto)

**Resolución:** **Falso**. Es *peer-to-peer*: no hay maestro y cualquier nodo coordina una consulta. Es
la base del Ejercicio 3: sin maestro no hay punto único de falla.

### Ejercicios tipo Parcial, ejercicio 14 — replicación y consistencia

**Consigna:** crear el keyspace `sensores` con RF 3; explicar qué significa RF 3; cuántas réplicas
confirman una escritura `QUORUM`; ventajas de `ONE` y de `QUORUM`; si un nodo caído deja la base
indisponible.

**Resolución:** `CREATE KEYSPACE sensores WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};`.
RF 3 = tres copias de cada fila en tres nodos. `QUORUM = ⌊3/2⌋ + 1 = 2`. `ONE` da menor latencia y
más disponibilidad; `QUORUM`, consistencia más fuerte. Un nodo caído **no** deja la base
indisponible: con RF 3 quedan dos réplicas, que alcanzan para `QUORUM`. En un único nodo, `QUORUM`
falla con `Unavailable … 'required_replicas': 2, 'alive_replicas': 1`.

---

## Enlaces

- Práctica: [[Práctica 2026-10-06]] · parte anterior: [[Guía TP10 - Cassandra Parte I]]
- Teórica: [[Clase 15 - Introduccion a Cassandra]]
- Conceptos: [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado orientado a consultas]] ·
  [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria en Cassandra]] ·
  [[3.15.05 - Niveles de consistencia y QUORUM|Niveles de consistencia y QUORUM]] ·
  [[2.12.04 - Teorema CAP|Teorema CAP]]
- Exámenes: [[Parcial 1Q2026]] · [[Parcial 2Q2025]] · [[Final 1Dic2025]] · [[Final 1Jul2025]] ·
  [[Ejercicios tipo Parcial Bases de Datos II]] · [[Mapa de exámenes]]
