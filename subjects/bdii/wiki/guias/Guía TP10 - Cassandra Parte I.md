---
tipo: guia
unidad: 3
orden: 12
tema: "TP10 - Cassandra Parte I"
resumen: "TP10 Parte I resuelto en cqlsh sobre Cassandra 5.0.9: los 18 pasos del servicio de música, con keyspace, clave de partición y de clustering, now(), ORDER BY, ALLOW FILTERING, índices secundarios, set<text> con CONTAINS, DELETE y DROP, cada uno con su salida real."
fuentes:
  - "raw/Unidad-03/Practica/ITBA TP 10 - Cassandra Parte I.pdf"
estado: procesado
---

# Guía TP10 — Cassandra Parte I

## Resumen general

El TP10 Parte I es la primera práctica de Cassandra. Es un único ejercicio guiado en **18 pasos**
sobre un servicio de música: un *keyspace* `demo_cql_music`, una tabla `canciones` con clave `uuid`
y una tabla `lista_reproduccion` desnormalizada (copia título, álbum y artista en vez de referenciar
a `canciones`, porque CQL no tiene joins), con `id` como clave de partición y `nro_cancion` como
clave de *clustering*. Sobre ese modelo se practican `now()`, `ORDER BY`, el error por filtrar fuera
de la clave, `ALLOW FILTERING`, los índices secundarios, una colección `set<text>` con `CONTAINS`,
los `DELETE` por fila y por partición, y los `DROP`.

Se necesita un contenedor `cassandra` y `cqlsh`; el nodo tarda cerca de un minuto en aceptar
conexiones. Todas las salidas de esta guía son reales (Cassandra 5.0.9, `cqlsh` 6.2.0) y los 18
comandos corren tal como están escritos en el PDF.

Lo que hay que llevarse al parcial: un `WHERE` solo se acepta si fija la partición (y las columnas de
*clustering* en orden), si usa un índice, o con `ALLOW FILTERING`; `ORDER BY` solo ordena dentro de
una partición fijada y solo por columnas de *clustering*; `INSERT` es un *upsert*; `UPDATE` y
`DELETE` exigen la clave de partición; y borrar deja *tombstones*. Trampas: `now()` devuelve un
`timeuuid` aunque la columna sea `uuid`; el mensaje del paso 9 no menciona la clave de partición
sino que pide `ALLOW FILTERING`; y las credenciales `cassandra`/`cassandra` no hacen falta porque la
imagen viene sin autenticación.

## Setup

```bash
docker pull cassandra                                  # hoy trae la 5.0.9
docker network create network-cassandra
docker run --name Mycassandra --network network-cassandra -d cassandra
docker logs -f Mycassandra                             # esperar "Startup complete" (~60 s)
docker exec -it Mycassandra cqlsh                      # Connected to Test Cluster at 127.0.0.1:9042
```

(atención) El PDF escribe `docker ps –a` con guion medio: falla (`"docker ps" accepts no arguments.`);
es `docker ps -a`. Para DataGrip se publica el puerto (`-p 9042:9042`); si `Mycassandra` ya existe,
el `docker run` da `Conflict`: hay que borrarlo antes (`docker rm -f Mycassandra`) o usar otro nombre.
`show host` imprime el clúster, la IP y el puerto de la conexión.

---

## Ejercicio 1

### Paso 1
**Consigna:** crear el *keyspace* `demo_cql_music` con `SimpleStrategy` y factor de replicación 1.
**Resolución:**
```sql
CREATE KEYSPACE demo_cql_music
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};
```
Sin salida. `DESCRIBE KEYSPACE demo_cql_music` agrega `AND durable_writes = true`. RF 1 = una sola
copia de cada fila; `SimpleStrategy` ignora la topología (para varios *data centers*,
`NetworkTopologyStrategy`). (clave) El signo es `=`: `WITH replication : {...}` da `SyntaxException`.

### Paso 2
**Consigna:** usar el *keyspace*.
**Resolución:** `USE demo_cql_music;` — el *prompt* pasa a `cqlsh:demo_cql_music>`.

### Paso 3
**Consigna:** crear la tabla `canciones`.
**Resolución:**
```sql
CREATE TABLE canciones (id uuid PRIMARY KEY, titulo text, album text, artista text, data blob);
```
`id` es la clave primaria y a la vez la clave de partición: una fila por partición. (nota) El texto
del PDF dice "columna datos"; el DDL la llama `data`.

### Paso 4
**Consigna:** insertar una canción.
**Resolución:**
```sql
INSERT INTO canciones (id, titulo, album, artista)
VALUES (7db1a490-5878-11e2-bcfd-0800200c9a66, 'Asilo', 'Salvavidas de Hielo', 'Jorge Drexler');

SELECT * FROM canciones;
--  id                                   | album               | artista       | data | titulo
-- --------------------------------------+---------------------+---------------+------+--------
--  7db1a490-5878-11e2-bcfd-0800200c9a66 | Salvavidas de Hielo | Jorge Drexler | null |  Asilo
```
`SELECT *` muestra la clave primero y el resto en orden alfabético; `data` no se cargó y sale `null`.

### Paso 5
**Consigna:** crear `lista_reproduccion` con clave `(id, nro_cancion)`.
**Resolución:**
```sql
CREATE TABLE lista_reproduccion (id uuid, nro_cancion int, cancion_id uuid, titulo text,
  album text, artista text, PRIMARY KEY (id, nro_cancion));
```
`id` = **clave de partición** (todas las canciones de una lista viven juntas en el mismo nodo);
`nro_cancion` = **clave de *clustering*** (ordena las filas dentro de la partición; `DESCRIBE TABLE`
muestra `WITH CLUSTERING ORDER BY (nro_cancion ASC)`). El par identifica cada fila: el `id` se repite,
el `nro_cancion` no dentro de una misma lista.

### Paso 6
**Consigna:** insertar la primera canción de la lista.
**Resolución:**
```sql
INSERT INTO lista_reproduccion (id, nro_cancion, cancion_id, titulo, artista, album)
VALUES (62c36092-82a1-3a00-93d1-46196ee77204, 1, 7db1a490-5878-11e2-bcfd-0800200c9a66,
        'Asilo', 'Jorge Drexler', 'Salvavidas de Hielo');
```
Que el orden de columnas del `INSERT` no coincida con el de la tabla no importa: los valores van
por nombre.

### Paso 7
**Consigna:** insertar varias canciones con `now()` como `id`, leer los `id` generados y cargarlas en
la lista en el orden que se quiera.
**Resolución:**
```sql
INSERT INTO canciones (id, titulo, album, artista) VALUES (now(), 'Todo se transforma', 'Eco', 'Jorge Drexler');
INSERT INTO canciones (id, titulo, album, artista) VALUES (now(), 'Tu falta de querer', 'Mon Laferte Vol. 1', 'Mon Laferte');
INSERT INTO canciones (id, titulo, album, artista) VALUES (now(), 'Hasta la raiz', 'Hasta la raiz', 'Natalia Lafourcade');

SELECT id, titulo, artista FROM canciones;
--  166affd0-bc2c-11f1-b54b-8d1a232e398e | Tu falta de querer |        Mon Laferte
--  7db1a490-5878-11e2-bcfd-0800200c9a66 |              Asilo |      Jorge Drexler
--  166affda-bc2c-11f1-b54b-8d1a232e398e |      Hasta la raiz | Natalia Lafourcade
--  166ad8c0-bc2c-11f1-b54b-8d1a232e398e | Todo se transforma |      Jorge Drexler
```
Los `id` cambian en cada corrida: hay que copiar los propios. Con ellos, a la lista en orden 3, 2, 4:
```sql
INSERT INTO lista_reproduccion (id, nro_cancion, cancion_id, titulo, artista, album)
VALUES (62c36092-82a1-3a00-93d1-46196ee77204, 3, 166affda-bc2c-11f1-b54b-8d1a232e398e, 'Hasta la raiz', 'Natalia Lafourcade', 'Hasta la raiz');
INSERT INTO lista_reproduccion (id, nro_cancion, cancion_id, titulo, artista, album)
VALUES (62c36092-82a1-3a00-93d1-46196ee77204, 2, 166ad8c0-bc2c-11f1-b54b-8d1a232e398e, 'Todo se transforma', 'Jorge Drexler', 'Eco');
INSERT INTO lista_reproduccion (id, nro_cancion, cancion_id, titulo, artista, album)
VALUES (62c36092-82a1-3a00-93d1-46196ee77204, 4, 166affd0-bc2c-11f1-b54b-8d1a232e398e, 'Tu falta de querer', 'Mon Laferte', 'Mon Laferte Vol. 1');
```
Un `SELECT` sin `ORDER BY` devuelve `nro_cancion` 1, 2, 3, 4: la clave de *clustering* ordena las
filas físicamente. Las filas de `canciones`, en cambio, salen en orden de *token* (hash del `id`), no
de inserción.
(atención) `now()` genera un `timeuuid` y la columna es `uuid`: se acepta, pero `toTimestamp(id)`
falla. Para una columna `uuid` corresponde `uuid()`; si interesa la fecha, declarar `timeuuid`.

### Paso 8
**Consigna:** consultar la lista ordenada por `nro_cancion` descendente.
**Resolución:**
```sql
SELECT * FROM lista_reproduccion WHERE id = 62c36092-82a1-3a00-93d1-46196ee77204 ORDER BY nro_cancion DESC;
```
Devuelve 4 filas: 4 *Tu falta de querer*, 3 *Hasta la raiz*, 2 *Todo se transforma*, 1 *Asilo*.
Funciona porque el `WHERE` fija la partición y `nro_cancion` es de *clustering*. Sin el `WHERE`:
`ORDER BY is only supported when the partition key is restricted by an EQ or an IN.`; por una columna
que no es de *clustering*: `Order by is currently only supported on the clustered columns of the
PRIMARY KEY, got titulo`.

### Paso 9
**Consigna:** filtrar la lista por `artista`.
**Resolución:**
```sql
SELECT * FROM lista_reproduccion WHERE artista='Jorge Drexler';
-- InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query
-- as it might involve data filtering and thus may have unpredictable performance. If you want to
-- execute this query despite the performance unpredictability, use ALLOW FILTERING"
```
Falla porque el `WHERE` no fija ninguna partición y `artista` no es parte de la clave ni tiene índice:
la única forma de responder es leer todas las filas. (nota) El mensaje no habla de la clave de
partición, como dice el PDF: pide `ALLOW FILTERING`.

### Paso 10
**Consigna:** repetir la consulta con `ALLOW FILTERING`.
**Resolución:**
```sql
SELECT * FROM lista_reproduccion WHERE artista='Jorge Drexler' ALLOW FILTERING;
```
2 filas: `nro_cancion` 1 (*Asilo*) y 2 (*Todo se transforma*). Con `TRACING ON` se ve que recorre
todos los rangos de *tokens* del anillo y lee las 4 filas para devolver 2: con pocas filas es
inocuo, con millones es un recorrido completo del clúster.

### Paso 11
**Consigna:** crear un índice sobre `artista`.
**Resolución:**
```sql
CREATE INDEX indice_artista ON lista_reproduccion (artista);
SELECT * FROM lista_reproduccion WHERE artista='Jorge Drexler';   -- ahora sin ALLOW FILTERING: 2 filas
```
El índice lee solo las 2 filas que matchean, pero sigue consultando todo el anillo porque es local a
cada nodo; por eso es más lento que filtrar por la clave de partición. (nota) Sin `USING` crea el
índice secundario clásico (tabla oculta); el SAI de la 5.0 se pide con `USING 'sai'`.

### Paso 12
**Consigna:** agregar una columna `etiquetas` de tipo conjunto.
**Resolución:**
```sql
ALTER TABLE lista_reproduccion ADD etiquetas set<text>;
```
Las filas existentes quedan con `etiquetas` en `null`.

### Paso 13
**Consigna:** agregar tres etiquetas a la canción 1 de la lista.
**Resolución:**
```sql
UPDATE lista_reproduccion SET etiquetas = etiquetas + {'2017'}        WHERE id = 62c36092-82a1-3a00-93d1-46196ee77204 AND nro_cancion=1;
UPDATE lista_reproduccion SET etiquetas = etiquetas + {'guitarra'}    WHERE id = 62c36092-82a1-3a00-93d1-46196ee77204 AND nro_cancion=1;
UPDATE lista_reproduccion SET etiquetas = etiquetas + {'Mon Laferte'} WHERE id = 62c36092-82a1-3a00-93d1-46196ee77204 AND nro_cancion=1;

SELECT nro_cancion, titulo, etiquetas FROM lista_reproduccion WHERE id = 62c36092-82a1-3a00-93d1-46196ee77204;
--  1 |              Asilo | {'2017', 'Mon Laferte', 'guitarra'}
--  2 | Todo se transforma | null
--  3 |      Hasta la raiz | null
--  4 | Tu falta de querer | null
```
Un `set` ordena sus elementos y no repite: volver a agregar `'guitarra'` no cambia nada. El `UPDATE`
exige la clave primaria completa: con solo `id` responde `Some clustering keys are missing: nro_cancion`.

### Paso 14
**Consigna:** indexar `etiquetas` y buscar las canciones etiquetadas `'guitarra'`.
**Resolución:**
```sql
CREATE INDEX indice_etiquetas ON lista_reproduccion (etiquetas);
SELECT * FROM lista_reproduccion WHERE etiquetas CONTAINS 'guitarra';
```
1 fila: la 1 (*Asilo*). Sobre un `set` el índice toma los valores (`target = 'values(etiquetas)'`).
`CONTAINS 'Guitarra'` da 0 filas (distingue mayúsculas) y `WHERE etiquetas = {'guitarra'}` no se
acepta sobre una colección. (atención) En un script, consultar justo después del `CREATE INDEX` puede
dar `ReadFailure` porque el índice todavía se está construyendo; a mano no se nota.

### Paso 15
**Consigna:** borrar una fila de la lista.
**Resolución:**
```sql
DELETE FROM lista_reproduccion WHERE id = 62c36092-82a1-3a00-93d1-46196ee77204 AND nro_cancion = 1;
```
Quedan las filas 2, 3 y 4. La fila no desaparece en el acto: queda una *tombstone* que se purga en
la compactación, pasado `gc_grace_seconds` (864000 s = 10 días). Un `DELETE` exige la clave de
partición: `WHERE nro_cancion = 2` o `WHERE artista = ...` dan `Some partition key parts are missing: id`,
y `ALLOW FILTERING` no existe para `DELETE`.

### Paso 16
**Consigna:** borrar toda la lista.
**Resolución:**
```sql
DELETE FROM lista_reproduccion WHERE id = 62c36092-82a1-3a00-93d1-46196ee77204;
```
Con solo la clave de partición borra todas sus filas (una *tombstone* de partición); el `SELECT`
sobre ese `id` devuelve `(0 rows)`. También se puede borrar un rango de *clustering*:
`... WHERE id = ... AND nro_cancion >= 2;`.

### Paso 17
**Consigna:** eliminar la tabla `lista_reproduccion`.
**Resolución:** `DROP TABLE lista_reproduccion;` — `DESC TABLES` muestra solo `canciones`.

### Paso 18
**Consigna:** eliminar el *keyspace*.
**Resolución:** `DROP KEYSPACE demo_cql_music;` — desaparece de `DESCRIBE KEYSPACES`. (nota) Con
`auto_snapshot: true` (valor de la imagen) cada `DROP` deja una copia en `snapshots/`; se libera con
`nodetool clearsnapshot`.

---

## Enlaces

- Análisis completo, trazados y diferencias con el enunciado: [[Práctica 2026-09-29|Práctica del 29/09]]
- Motor: [[Cassandra]]
