---
tipo: examen
unidad: eval
instancia: repaso
tema:
  - Redis
  - DynamoDB
  - Transacciones y control de concurrencia
  - Vistas SQL
  - Índices
  - Teorema CAP
  - Taxonomía NoSQL
  - Elección de motor (Cassandra, Neo4j)
  - Vistas materializadas
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Repaso Final BD 2.docx"
estado: procesado
resumen: "Guía de repaso para el final armada por estudiantes: Redis y DynamoDB con AWS CLI (temas no dictados aún), transacciones y concurrencia, una vista SQL de práctica, e índices, CAP y taxonomías NoSQL tomados de los finales 1Jul2025, 1Dic2023 y 1Dic2025."
aliases:
  - Repaso Final BD2
  - Guía de repaso para el final
  - Repaso Final BD 2 (Balbo)
---

# Repaso Final BD 2 — guía de repaso armada por estudiantes

## Resumen general

Este documento es una guía de estudio que un grupo de estudiantes armó para prepararse para el
final de la cursada 2Q anterior, mezclando ejercicios prácticos de Redis y DynamoDB (con salida de
consola propia) con preguntas literales de tres finales reales: **1Jul2025**, **1Dic2023** y
**1Dic2025**. No es material oficial de la cátedra: ni el enunciado ni las resoluciones fueron
revisados por un docente, y varias partes llevan la firma "Balbo" como quien las redactó. El
documento original mezcla los temas sin orden fijo (Redis, luego una plantilla de DynamoDB vacía,
después transacciones, un ejercicio de vista SQL suelto, y recién al final los tres finales viejos);
esta página lo reorganiza por bloque temático, conservando entre paréntesis la numeración y la
etiqueta que trae la fuente para poder volver al documento original.

Confiabilidad de las respuestas: dispar. Las resoluciones de **SQL** (la vista de investigadores) y
las de **concurrencia/transacciones** son sólidas y coinciden con lo que dicta la cátedra en la
Clase 11. Las de **Redis** citan página y capítulo de *Seven Databases* con precisión y, verificadas
contra el PDF, son correctas letra por letra. Las de los **finales viejos** son irregulares: algunas
tienen buena justificación (Neo4j en redes sociales, elección de motor para el videojuego, CAP del
náufrago), otras se limitan a "VERDADERO/FALSO" sin argumento, y dos ejercicios de **DynamoDB** (sus
fortalezas/debilidades y su clasificación CAP) quedan directamente sin responder en la fuente. Redis,
DynamoDB y Neo4j se dictan después del parcial del 13/10 (26/10, 02/11 y 19/10). Para el parcial
sirven los temas ya dictados —**transacciones y concurrencia**, **vistas SQL** (también las
materializadas), **índices**, la taxonomía NoSQL y el CAP del náufrago— y **Cassandra** (Ejercicios 24
y 32), que se dicta el 28/09 y el 05/10.

> [!info] Fuente
> Un solo archivo: `raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Repaso Final BD 2.docx`. Apuntes de
> estudiantes, no material de cátedra. Aporta: (1) una guía práctica de Redis con salida real de
> consola y citas a *Seven Databases* cap. 8; (2) una guía práctica de DynamoDB con comandos de AWS
> CLI y citas al cap. 7; (3) un resumen propio de transacciones y control de concurrencia citando la
> Clase 11; (4) un ejercicio suelto de vista SQL con su resolución; (5) el texto completo de tres
> finales viejos ("Finales Viejos (Balbo)"): **1Jul2025**, **1Dic2023** y **1Dic2025**, cada uno con
> enunciado y una resolución razonada; (6) una tabla independiente "Conceptos Generales / BASE DE
> DATOS - FINAL", no ligada a ningún ejercicio numerado, que clasifica CAP y arquitectura de MySQL,
> MongoDB, Cassandra, Neo4j, Redis y Amazon DB — citada en los Ejercicios 12 y 17. Trae también 9
> imágenes: capturas de consola, tablas y dos figuras del libro (transacciones Redis, Bloom filter) y
> dos capturas de un artículo externo sobre particiones de DynamoDB.

## Formato

No es un examen con puntaje ni duración: es una guía de repaso sin condición de aprobación, sin
límite de tiempo y sin modalidad de entrega — un documento de estudio grupal. Mezcla tres formatos:
ejercicios prácticos a resolver en la consola del motor (Redis, DynamoDB vía AWS CLI), preguntas de
desarrollo con justificación, y preguntas de verdadero/falso con justificación obligatoria en caso de
falso. Los tres finales que transcribe sí fueron exámenes reales con preguntas de opción múltiple,
desarrollo y V/F, pero el documento no conserva su formato original (duración, puntaje): solo el
enunciado y la resolución de cada pregunta.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP 2026 |
| --- | --- | --- | --- |
| Ejercicio 1 | Redis: strings, EXISTS, SETNX, TTL, patrones KEYS | Redis | no dictado aún (26/10) |
| Ejercicio 2 | Redis: listas | Redis | no dictado aún (26/10) |
| Ejercicio 3 | Redis: hashes | Redis | no dictado aún (26/10) |
| Ejercicio 4 | Redis: sets | Redis | no dictado aún (26/10) |
| Ejercicio 5 | Redis: sorted sets | Redis | no dictado aún (26/10) |
| Ejercicio 6 | Redis: transacciones MULTI/EXEC/DISCARD | Redis · [[1.11.03 - Transacciones y ACID\|Transacciones y ACID]] | no dictado aún (26/10) |
| Ejercicio 7 | Redis: expiración como caché | Redis | no dictado aún (26/10) |
| Ejercicio 8 | Redis: Bloom filter (SETBIT/GETBIT) | Redis | no dictado aún (26/10) |
| Ejercicio 9 | Redis: Sentinel y alta disponibilidad | Redis | no dictado aún (26/10) |
| Ejercicio 10 | Redis: sorted set de películas IMDB | Redis | no dictado aún (26/10) |
| Ejercicio 11 | Redis: fortalezas y debilidades | Redis | no dictado aún (26/10) |
| Ejercicio 12 | Redis según el teorema CAP | Redis · [[2.12.04 - Teorema CAP\|Teorema CAP]] | no dictado aún (26/10) |
| Ejercicio 13 | DynamoDB: gestión de tablas y CRUD con AWS CLI | DynamoDB | no dictado aún (02/11) |
| Ejercicio 14 | DynamoDB: fórmula de particiones (Find.1) | DynamoDB | no dictado aún (02/11) |
| Ejercicio 15 | DynamoDB: cálculo de particiones y modelado de tweets (Do.1, Do.2) | DynamoDB | no dictado aún (02/11) |
| Ejercicio 16 | DynamoDB: fortalezas y debilidades | DynamoDB | no dictado aún (02/11) |
| Ejercicio 17 | DynamoDB según el teorema CAP | DynamoDB · [[2.12.04 - Teorema CAP\|Teorema CAP]] | no dictado aún (02/11) |
| Ejercicio 18 | Anomalías de concurrencia y niveles de aislamiento | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | Clase 11 |
| Ejercicio 19 | Mecanismos de control de concurrencia | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | Clase 11 |
| Ejercicio 20 | Vista SQL: investigadores por instituto | [[1.06.01 - Vistas\|Vistas]] | Clase 06–07 · TP4 |
| Ejercicio 21 (Final 1Jul2025, preg. 1) | Índices: HASH vs. B+Tree para login | [[1.08.02 - Índices\|Índices]] | Clase 08 / 11 · TP5 |
| Ejercicio 22 (Final 1Jul2025, preg. 2) | Taxonomía NoSQL: XML sin relación | [[2.12.01 - NoSQL — origen, propiedades y taxonomía\|Taxonomía NoSQL]] | Clase 12 |
| Ejercicio 23 (Final 1Jul2025, preg. 3) | Neo4j y redes sociales | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] (Neo4j, texto plano) | no dictado aún (19/10) |
| Ejercicio 24 (Final 1Jul2025, preg. 4) | Elección de motor: videojuego de alta escritura | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] · [[2.12.04 - Teorema CAP\|Teorema CAP]] (Cassandra, Redis, DynamoDB en texto plano) | Cassandra: no dictado aún (28/09) |
| Ejercicio 25 (Final 1Jul2025, preg. 5) | CAP: el náufrago (V/F) | [[2.12.04 - Teorema CAP\|Teorema CAP]] · [[2.12.05 - BASE y consistencia eventual\|BASE y consistencia eventual]] | Clase 12 |
| Ejercicio 26 (Final 1Jul2025, preg. 6) | Redis Sentinel (V/F) | Redis (texto plano) | no dictado aún (26/10) |
| Ejercicio 27 (Final 1Dic2023, preg. 2) | Versionado de datos: HBase | HBase (texto plano) | fuera del temario 2026 |
| Ejercicio 28 (Final 1Dic2023, preg. 3) | Vistas materializadas de PostgreSQL (V/F) | [[1.06.01 - Vistas\|Vistas]] | Clase 07 |
| Ejercicio 29 (Final 1Dic2025, preg. 2) | DynamoDB: tabla Usuarios, put-item y query | DynamoDB | no dictado aún (02/11) |
| Ejercicio 30 (Final 1Dic2025, preg. 3) | Concurrencia en BD relacionales (V/F) | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | Clase 11 |
| Ejercicio 31 (Final 1Dic2025, preg. 4) | Neo4j en Instagram/Twitter | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] (Neo4j, texto plano) | no dictado aún (19/10) |
| Ejercicio 32 (Final 1Dic2025, preg. 5) | IoT logístico: elección de motor | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] · [[2.12.04 - Teorema CAP\|Teorema CAP]] (Cassandra, texto plano) | Cassandra: no dictado aún (28/09) |

---

## Bloque 1 — Redis *(tema no dictado aún, se dicta el 26/10; no verificado en el motor)*

> Todo este bloque cita *Seven Databases in Seven Weeks* 2ª ed. **cap. 8** (Redis). Las citas de
> página se verificaron contra el PDF con el offset de la ficha: para el rango del cap. 8 (impresas
> 259–304) el offset es **+9**, no el +13 genérico de otros capítulos — página impresa 262 =
> PDF 271, verificado leyendo el encabezado `Chapter 8. Redis • 262` en la página 271 del PDF. No
> verificado en el motor, así que ninguna salida de este bloque se re-corrió: se contrastó cada comando contra la sintaxis real de
> Redis y, donde el documento cita el libro, contra el texto del PDF.

### Ejercicio 1 — Redis: strings, EXISTS, SETNX, TTL y patrones KEYS

*(Numeración original: "1." en la guía de tipos de datos, con una segunda resolución idéntica en la
sección "Redis (Balbo)".)*

> Insertar en la BD REDIS 5 títulos de películas.

```
SET pelicula1 "Maléfica"
EXISTS pelicula1
SETNX pelicula2 "Frozen II"
GET pelicula2
SETNX pelicula6 "Toy Story 4"
GET pelicula6
KEYS *
MGET pelicula1 pelicula2 pelicula7
-- Si no existe una clave (como pelicula7) se devolverá nil
KEYS pelicula[1-3]*
KEYS pelicula[^6]
DEL pelicula3
EXISTS pelicula3
SET pelicula7 "Pan."
TTL pelicula7
EXPIRE pelicula7 15
GET pelicula7
TTL pelicula7
```

**Respuesta de la fuente:** respuesta del documento (sin salida de consola transcripta, solo los
comandos). Aparece dos veces, idéntica letra por letra en ambas resoluciones ("anónima" y "Balbo").

**Resolución del vault:** los comandos son correctos. `SETNX` solo escribe si la clave no existe
(por eso tiene sentido usarlo para `pelicula2` y `pelicula6`, ambas nuevas); `KEYS pelicula[1-3]*`
matchea `pelicula1`, `pelicula2` (no hay `pelicula3`, borrada antes) por el patrón de glob de Redis
(rango `[1-3]`); `KEYS pelicula[^6]` matchea claves de 10 caracteres cuyo último carácter no sea `6`
— es decir, excluye `pelicula6` pero también cualquier otra clave de exactamente ese largo que sí
cumpla, no es un "todas menos pelicula6" general. `MGET` sobre una clave inexistente (`pelicula7`
antes de crearla) devuelve `nil` en esa posición, sin error — comportamiento estándar. El bloque final
(`SET`/`TTL`/`EXPIRE`/`TTL`) ilustra que una clave sin expiración fijada devuelve `TTL` = `-1`, y que
tras `EXPIRE` pasa a devolver los segundos restantes.

### Ejercicio 2 — Redis: listas (L_Cantantes)

*(Numeración original: "2." en la guía de tipos de datos; dos resoluciones distintas, no idénticas.)*

> Cree una lista de cantantes L_Cantantes e inserte 5 elementos. Devolver el número de elementos que
> tiene la lista.

**Respuesta de la fuente (primera resolución):**

```
127.0.0.1:6379> RPUSH L_Cantantes L-gante Tini "Maria Becerra" "Olly"
(integer) 4
127.0.0.1:6379> LLEN L_Cantantes
(integer) 4
127.0.0.1:6379> RPOP L_Cantantes
"Olly"
127.0.0.1:6379> LLEN L_Cantantes
(integer) 3
```

**Respuesta de la fuente (Balbo, con la lista de comandos y la "Idea clave" completas):**

```
LPUSH cantantes "Amaral"
LPUSH cantantes "India Martínez"
LPUSH cantantes "Melendi"
RPUSH cantantes "Alejandro Sanz"
RPUSH cantantes "Freddie Mercury"

LLEN cantantes → 5
LRANGE cantantes 0 -1 → [Melendi, India Martínez, Amaral, Alejandro Sanz, Freddie Mercury]
LINDEX cantantes 0 → Melendi
LINDEX cantantes 1 → India Martinez
LINDEX cantantes -1 → Freddie Mercury
RPOP cantantes → elimina y devuelve el último → Freddie Mercury
```

> Idea clave para el parcial/final: una lista en Redis es una colección ordenada, que permite
> duplicados y donde importa la posición — no como un SET. LPUSH/RPUSH agregan por izquierda/derecha,
> LPOP/RPOP sacan por izquierda/derecha, LINDEX mira una posición, LRANGE muestra un rango, LLEN
> cuenta elementos.

**Resolución del vault:** la primera resolución solo pide 4 elementos (`RPUSH` con 4 valores, no 5);
la de Balbo sí carga 5. `LPUSH` invierte el orden de inserción respecto de `RPUSH` porque cada
`LPUSH` sucesivo va al frente: por eso la lista queda `[Melendi, India Martínez, Amaral, …]` y no
`[Amaral, India Martínez, Melendi, …]` — el índice positivo 0 es el último `LPUSH` ejecutado, no el
primero. Ambas resoluciones son correctas en lo que muestran.

### Ejercicio 3 — Redis: hashes (libros)

*(Numeración original: "3." en la guía de tipos de datos; dos resoluciones distintas.)*

> Cree un hash para 5 Libros, incluyendo su título, su ISBN, la editorial y el año.

**Respuesta de la fuente (primera resolución):**

```
127.0.0.1:6379> HSET libro:1 titulo "Francesca si chiama questo romanzo" ISBN 18239432 editorial "Pepe" anio 2024
127.0.0.1:6379> HGET libro:1 titulo
"Francesca si chiama questo romanzo"
127.0.0.1:6379> HVALS libro:1
1) "Francesca si chiama questo romanzo"
2) "18239432"
3) "Pepe"
4) "2024"
```

**Respuesta de la fuente (Balbo):**

```
HSET libro1 "título" "Loba Negra"
HMSET libro1 "isbn" "8466666494" "editorial" "Ediciones B" "año" "2019"
HGETALL libro1
HKEYS libro1 → titulo, isbn, editorial, año
HVALS libro1 → La chica del tren, 9788466332286, Planeta, 2019
```

**Resolución del vault:** la primera resolución es consistente (los valores de `HVALS` coinciden con
los que se cargaron por `HSET`). La de Balbo **no** es consistente **(atención)**: carga `libro1` con
título "Loba Negra", ISBN `8466666494` y editorial "Ediciones B", pero el `HVALS` que transcribe
devuelve "La chica del tren", ISBN `9788466332286` y editorial "Planeta" — datos de otro libro,
probablemente pegados de otra corrida de consola sin actualizar el resultado. El propio documento no
lo nota; queda documentado acá porque, tomado como resolución para estudiar, induce a pensar que
`HSET` no sobrescribe lo que uno acaba de cargar, cuando en realidad sí lo hace: el error es de
transcripción, no del comportamiento del comando. `HMSET` está deprecado desde Redis 4.0 en favor de
`HSET` con múltiples pares (ambos documentos lo usan correctamente como sinónimos).

### Ejercicio 4 — Redis: sets (BD NoSQL vs. BD Relacionales)

*(Numeración original: "4." en la guía de tipos de datos, idéntica en ambas resoluciones.)*

> Cree un conjunto de productos de BD NoSQL y otro de BD Relacionales.

```
SADD BD_NoSQL "REDIS" "MongoDB" "Neo4J" "Cassandra"
SADD BD_Relacionales "Oracle" "MySQL" "Microsoft SQL Server" "PostgreSQL"
SMEMBERS BD_NoSQL
SMEMBERS BD_Relacionales
SUNION BD_NoSQL BD_Relacionales
SINTER BD_NoSQL BD_Relacionales
SDIFF BD_NoSQL BD_Relacionales
SDIFF BD_Relacionales BD_NoSQL
```

**Respuesta de la fuente:** respuesta del documento, sin salida transcripta.

**Resolución del vault:** correcto. Como los dos sets son disjuntos, `SINTER` da un set vacío,
`SUNION` da los 8 elementos, y cada `SDIFF` devuelve el set de origen completo (no hay nada que
restarle). Es un buen ejemplo para notar que `SDIFF A B` no es lo mismo que `SDIFF B A` en el caso
general, aunque acá coincidan en tamaño por ser disjuntos.

### Ejercicio 5 — Redis: sorted sets (productosNoSQL)

*(Numeración original: "5." en la guía de tipos de datos, idéntica en ambas resoluciones.)*

> Cree un conjunto ordenado de productos de BD NoSQL incluyendo una puntuación de popularidad.

```
zadd productosNoSQL 100 mongodb 75 redis 50 cassandra 40 neo4j
zcount productosNoSQL 50 100
ZRANGE productosNoSQL 0 -1
ZREVRANGE productosNoSQL 0 -1
ZREM productosNoSQL "redis"
ZRANGEBYSCORE productosNoSQL 1 (50
ZRANGEBYSCORE productosNoSQL 1 50
ZRANGEBYSCORE productosNoSQL -inf +inf WITHSCORES
```

**Respuesta de la fuente:** respuesta del documento, sin salida transcripta.

**Resolución del vault:** correcto. `ZCOUNT productosNoSQL 50 100` cuenta 3 (mongodb, redis,
cassandra; neo4j con 40 queda afuera). El paréntesis en `ZRANGEBYSCORE productosNoSQL 1 (50` hace que
el límite superior sea **exclusivo** (excluye el score 50 exacto): devuelve solo `neo4j` (40), a
diferencia de la línea siguiente sin paréntesis, que sí incluiría un elemento con score 50 si lo
hubiera.

### Ejercicio 6 — Redis: transacciones con MULTI/EXEC/DISCARD

*(Numeración original: "2) Capítulo 8, página 262".)*

> Comprobar el funcionamiento de las transacciones en Redis (previamente ejecutar los comandos
> SET/GET de las páginas 261 y 262). ¿Qué diferencia hay entre el ROLLBACK de PostgreSQL y el DISCARD
> de Redis?

```
127.0.0.1:6379> SET count 0
OK
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379(TX)> SET prag http://pragprog.com
QUEUED
127.0.0.1:6379(TX)> GET couny
QUEUED
127.0.0.1:6379(TX)> GET count
QUEUED
127.0.0.1:6379(TX)> INCR count
QUEUED
127.0.0.1:6379(TX)> EXEC
1) OK
2) (nil)
3) "1"
4) (integer) 2
```

**Respuesta de la fuente:** respuesta del documento, citando el libro casi textual: al usar `MULTI`
los comandos no se ejecutan cuando se definen (similar a las transacciones de Postgres); se encolan y
se ejecutan en secuencia con `EXEC`. Similar a `ROLLBACK` en SQL, `DISCARD` detiene la transacción y
vacía la cola; a diferencia de `ROLLBACK`, no revierte la base de datos — simplemente no ejecuta la
transacción — mismo efecto, mecanismo distinto (rollback de transacción vs. cancelación de la
operación).

**Resolución del vault:** *Seven Databases* cap. 8, pp. 261–262 (PDF 270–271, offset +9). El
PDF trae el ejemplo con `SET count 2` en vez de `SET count 0` y sin la línea `GET couny` (typo del
documento: la variable no existe, por eso el `EXEC` devuelve `(nil)` en esa posición — el documento lo
usa a propósito para mostrar que un `GET` sobre una clave inexistente igual se encola y se ejecuta,
solo que devuelve `nil`), pero el texto explicativo sobre `MULTI`/`DISCARD`/`ROLLBACK` coincide palabra
por palabra con la p. 262 (PDF 271) del libro (verificado con `pdftotext -f 271 -l 271`). La cita es
correcta.

**(atención) — segunda inconsistencia sin señalar en la fuente:** el bloque de comandos tiene otra
anomalía de transcripción, distinta de la del `GET couny`. Si `count` se fija en `0` justo antes de
`MULTI`, el `GET count` encolado en la posición 3 (antes del `INCR count` de la posición 4) debería
devolver `"0"`, no `"1"`: el valor `"1"` solo es consistente si `count` ya valía `1` al llegar al
`EXEC`, lo que contradice el `SET count 0` mostrado arriba en el mismo bloque (y a su vez es
consistente con el `(integer) 2` que da el `INCR` de la posición 4: `1 + 1 = 2`). Es el mismo patrón
que las anomalías de pegado de consola del Ejercicio 3 (`HVALS`) y el Ejercicio 10 (carga parcial): un
resultado real de otra corrida, transcripto junto a un `SET` que no le corresponde.

### Ejercicio 7 — Redis: expiración como caché de acceso rápido

*(Numeración original: "3) Capítulo 8, páginas 271 y 272".)*

> ¿Cuál es la funcionalidad de Redis que le permite ser usada como caché de acceso rápido? Probar su
> funcionamiento.

```
redis 127.0.0.1:6379> SET ice "I'm melting..."
OK
redis 127.0.0.1:6379> EXPIRE ice 10
(integer) 1
redis 127.0.0.1:6379> EXISTS ice
(integer) 1
redis 127.0.0.1:6379> EXISTS ice
(integer) 0
redis 127.0.0.1:6379> SETEX ice 10 "I'm melting..."
redis 127.0.0.1:6379> TTL ice
(integer) 4
redis 127.0.0.1:6379> PERSIST ice
```

**Respuesta de la fuente:** respuesta del documento, transcripción casi literal del libro: la sección
*Expiry* de la p. 271, la mecánica de `EXPIRE`/`EXISTS`/`SETEX`/`TTL`/`PERSIST`/`EXPIREAT` y el truco
de "most recently used" (renovar el TTL en cada lectura para conservar solo las claves usadas
recientemente).

**Resolución del vault:** *Seven Databases* cap. 8, pp. 271–272 (PDF 280–281, offset +9).
Verificado con `pdftotext -f 280 -l 281`: el texto de la sección *Expiry* y los comandos coinciden
exactamente con el PDF, incluida la explicación de `EXPIREAT` (timeout absoluto vs. `EXPIRE`
relativo). Cita correcta.

### Ejercicio 8 — Redis: Bloom filter con SETBIT y GETBIT

*(Numeración original: "4) Capítulo 8, páginas 285 a 288".)*

> Comprobar el funcionamiento de la implementación de Bloom filter en Redis, con los comandos SETBIT
> y GETBIT. Previamente leer la teoría de las páginas 285 y 286 para entender su finalidad.

**Respuesta de la fuente:** el documento arma su propia versión didáctica antes de citar el libro:

> Qué garantiza un Bloom filter: nunca falsos negativos (si dice "NO está", es seguro que no está);
> puede dar falsos positivos (si dice "SÍ está", probablemente está, pero podría equivocarse).
> Mecanismo: array de bits + k funciones de hash; insertar prende los bits de las k posiciones;
> consultar revisa si *todos* esos bits están en 1 ("quizás está") o si *alguno* está en 0 ("seguro que
> no").

```
127.0.0.1:6379> SETBIT bloom 5 1
(integer) 0
127.0.0.1:6379> SETBIT bloom 20 1
(integer) 0
127.0.0.1:6379> SETBIT bloom 90 1
(integer) 0
127.0.0.1:6379> GETBIT bloom 5
(integer) 1
127.0.0.1:6379> GETBIT bloom 20
(integer) 1
127.0.0.1:6379> GETBIT bloom 90
(integer) 1
-- "redis" prende sus 3 posiciones → probablemente está
127.0.0.1:6379> GETBIT bloom 5
(integer) 1   ← la prendió "redis"
127.0.0.1:6379> GETBIT bloom 33
(integer) 0   ← ¡está en 0! → "mongo" seguro NO está, no hace falta chequear el 77
```

Después describe **RedisBloom** (el módulo real, de fábrica en Redis Stack desde Redis 4.0):

```
127.0.0.1:6379> BF.RESERVE libros 0.01 1000000
OK
127.0.0.1:6379> BF.ADD libros "redis"
(integer) 1
127.0.0.1:6379> BF.EXISTS libros "redis"
(integer) 1   ← probablemente está (lo agregamos)
127.0.0.1:6379> BF.EXISTS libros "mongo"
(integer) 0   ← seguro que no está
```

**Resolución del vault:** el mecanismo general (unión de bits al insertar, OR/AND para consultar,
nunca falsos negativos, posibles falsos positivos) coincide con la sección *Bloom Filters* del libro
(pp. 285–286, PDF 294–295, offset +9). Pero el ejemplo con `SETBIT`/`GETBIT` **no es el del libro**:
verificado con `pdftotext -f 296 -l 297` (sección *SETBIT and GETBIT*, pp. 287–288, offset +9), el
ejemplo real usa la clave `my_burger` con las posiciones `1`, `2` y `3` (`ketchup=0, mustard=1,
onion=2, lettuce=3`) para ilustrar *multivariate flagging* con toppings de hamburguesa — sin relación
con un Bloom filter. El bloom de "redis"/"mongo" en las posiciones 5/20/90 es una construcción
didáctica propia del documento (el propio documento lo dice: "arma su propia versión didáctica antes
de citar el libro"), correctamente etiquetada como tal, pero no verificable letra por letra contra el
PDF porque no está en él. Además, la implementación real de Bloom filter que usa el libro (pp.
285–286) es un script Ruby con el gem `bloomfilter-rb`, no `SETBIT`/`GETBIT` manual: el libro solo
explica esos dos comandos por separado, en la sección siguiente, con el ejemplo del hamburguesa.
`BF.RESERVE`/`BF.ADD`/`BF.EXISTS` tampoco están en el libro (2018, previo a RedisBloom estar tan
difundido): son un agregado correcto del propio documento sobre el módulo real, rotulado como tal.

### Ejercicio 9 — Redis: Sentinel y alta disponibilidad

*(Numeración original: "5) Capítulo 8, página 289" — ejercicio Find.2.)*

> Hacer el ejercicio Find.2 (leer sobre Sentinel). Ver el link de la documentación oficial.

**Respuesta de la fuente:** resumen propio y correcto. Sentinel es el sistema que da alta
disponibilidad a Redis cuando no se usa Redis Cluster; vigila el setup master-réplica y actúa solo si
el master cae. Cuatro funciones: *monitoring* (chequea que master y réplicas funcionen),
*notification* (avisa cuando algo anda mal), *automatic failover* (promueve una réplica a master y
reconfigura al resto, sin intervención manual) y *configuration provider* (los clientes le preguntan a
Sentinel cuál es el master actual). Se corren varios procesos Sentinel cooperando por quórum (menos
falsos positivos) y para no tener un único punto de falla en el propio mecanismo de HA. URL citada:
`https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/`.

**Resolución del vault:** *Seven Databases* cap. 8, p. 289 (PDF 298, offset +9), *Day 2
Homework › Find, ítem 2*: "Read some documentation on Sentinel, a system used to manage
high-availability Redis clusters" — con nota al pie `http://objectrocket.com/blog/how-to/introduction-to-redis-sentinel`.
El documento cambió el link por la documentación oficial de redis.io, más apropiada para 2026 que el
blog post de 2018 que cita el libro; el resumen de las cuatro funciones es correcto y no contradice al
libro (el libro solo pide leer, no resume Sentinel).

### Ejercicio 10 — Redis: sorted set de películas IMDB

*(Numeración original: "6)", con la tabla completa de 10 películas en la imagen 10; el documento solo
resuelve 5 de las 10 y los incisos a–e.)*

> Cargue las siguientes películas y su score en IMDB en Redis, utilizando la estructura más
> conveniente para responder las preguntas posteriores.

| Película | Score |
| --- | --- |
| The theory of everything | 7.7 |
| The Imitation Game | 8.0 |
| Amelie | 8.3 |
| The Shawshank Redemption | 9.3 |
| The Godfather | 9.2 |
| Fight Club | 8.8 |
| Matrix | 8.7 |
| Titanic | 7.8 |
| Jurassic Park | 8.1 |
| ET | 7.9 |

> a) Todas las películas en orden ascendente de acuerdo al score. b) Películas cuyo puntaje se
> encuentra entre 8 y 10. c) Películas que tengan un puntaje menor que 8. d) Las dos mejores películas
> junto a su puntaje. e) En qué posición se encuentra "The Imitation Game", en forma decreciente y
> creciente.

**Respuesta de la fuente (atención — carga parcial):** el documento carga solo 5 de las 10 películas
de la tabla, con el score multiplicado por 10 (para usar enteros):

```
127.0.0.1:6379> ZADD pelicula 77 "The theory of everything" 80 "The imitation game" 83 "amelie" 93 "shadowredemption" 92 "the godfather"
(integer) 5
```

```
a) ZREVRANGE pelicula 0 -1   → orden descendente
   ZRANGE pelicula 0 -1      → orden ascendente

b) ZRANGEBYSCORE pelicula 80 100
   1) "The imitation game"
   2) "amelie"
   3) "the godfather"
   4) "shadowredemption"

c) ZRANGEBYSCORE pelicula -inf (80 WITHSCORES   → no incluye las de valor 80
   1) "The theory of everything"
   2) "77"

d) ZREVRANGE pelicula 0 1 WITHSCORES
   1) "shadowredemption"
   2) "93"
   3) "the godfather"
   4) "92"

e) ZRANK pelicula "the godfather"      → (integer) 3
   ZREVRANK pelicula "the godfather"   → (integer) 1
```

**Resolución del vault:** los comandos de a) a d) son correctos para el subconjunto cargado, pero
**(atención)**: la consigna original pide cargar las **10** películas de la tabla, y solo se cargaron
5 (falta Fight Club, Matrix, Titanic, Jurassic Park y ET), con los nombres además en minúscula y
recortados ("shadowredemption" por "The Shawshank Redemption"), lo que dificulta comparar contra la
tabla. El inciso e) además responde el rank de **"the godfather"**, no de **"The Imitation Game"**
como pide la consigna — con los 5 elementos cargados, `ZRANK pelicula "the imitation game"` da
`(integer) 1` (segunda peor, ascendente) y `ZREVRANK pelicula "the imitation game"` da
`(integer) 3` (segunda mejor, descendente). El uso de `ZADD`/sorted set como estructura es la elección
correcta: permite ordenar por score y responder rangos, top-N y ranking con comandos nativos, algo que
ni una lista ni un set nativo de Redis ofrecen.

### Ejercicio 11 — Redis: fortalezas y debilidades

*(Numeración original: "7)".)*

> Resuma las fortalezas y debilidades de Redis. ¿En qué situaciones utilizarían esta base de datos?

**Respuesta de la fuente:** paráfrasis fiel del cierre del cap. 8 del libro. Fortalezas: velocidad;
capacidad de almacenar estructuras complejas (listas, hashes, sets) y operar sobre ellas con comandos
específicos; opciones de durabilidad configurables (velocidad vs. seguridad de los datos);
replicación maestro-esclavo para durabilidad y para sistemas con alta carga de lectura. Debilidades:
al residir en memoria, tiene un problema de durabilidad inherente (datos no persistidos se pueden
perder si el proceso cae); no admite datasets más grandes que la RAM disponible (Redis Cluster mitiga
esto). Más de 120 comandos, mayoría autoexplicativos salvo abreviaturas poco intuitivas (`INCRBY`,
`ZCOUNT` vs. `SCARD`). Cierre del libro: agregar Redis a cualquier ecosistema políglota,
independientemente del sistema de registro (SOR) elegido.

**Resolución del vault:** correcto, coincide con el *Wrap-Up* del cap. 8.

### Ejercicio 12 — Redis según el teorema CAP

*(Numeración original: "8)".)*

> Clasifique Redis según el Teorema CAP.

**Respuesta de la fuente:** "Redis y Neo4J son consistentes y disponibles (CA); no distribuyen datos
(*data sharding*), por lo que la partición no es un problema (aunque podría decirse que CAP no tiene
mucho sentido en sistemas no distribuidos)".

**Resolución del vault (atención — la clasificación depende de la fuente):** la respuesta es válida
**para un Redis standalone**, y coincide con lo que dice *Seven Databases* Apéndice A2 § *CAP in the
Wild* (p. 317): ahí el libro ubica a Redis, PostgreSQL y Neo4j en **CA**. La propia fuente ya trae esta
misma distinción, sin que este ejercicio la cite: la tabla independiente "Conceptos Generales / BASE
DE DATOS - FINAL" del documento (no ligada a ningún ejercicio numerado, con una fila por motor) ya
clasifica a Redis como "CA (cuando no está con REDIS Cluster, sino CP)" — la elaboración de abajo sobre
Redis solo / con réplicas / con Redis Cluster no es un aporte exclusivo del vault, extiende una
distinción que el documento fuente ya insinúa. El propio vault, además, ya documenta que esta
clasificación está en disputa entre las tres fuentes que cubren el tema —
ver [[2.12.04 - Teorema CAP|Teorema CAP]] § *Dudas abiertas*: el deck de la cátedra ubica a Redis en
**CP**, el paper de Corbellini en **AP**, y el libro en **CA** — y que la respuesta correcta depende de
si se habla de un Redis solo (sin distribuir, CA razonable), con réplicas (CP: escrituras solo al
primario), o con Redis Cluster (más cerca de AP). La resolución del documento es defendible citando el
libro, pero no es la única lectura posible; qué esquina toma la cátedra en el parcial (cuando dicte
Redis, el 26/10) sigue siendo una pregunta abierta en el vault, no algo que esta página resuelva.

---

## Bloque 2 — DynamoDB *(tema no dictado aún, se dicta el 02/11; sin contenedor DynamoDB Local disponible)*

> Este bloque cita *Seven Databases* 2ª ed. **cap. 7** (DynamoDB). Offset de página: **+10** para el
> rango del cap. 7 (impresas 211–257) — página impresa 232 = PDF 242, verificado leyendo
> `Chapter 7. DynamoDB • 232` en la página 242 del PDF. Ninguna salida de este bloque se corrió contra
> DynamoDB Local (no verificado en el motor): se verificó la sintaxis de la AWS CLI y,
> donde el documento cita el libro o un artículo externo, se contrastó contra la fuente.

### Ejercicio 13 — DynamoDB: gestión de tablas y CRUD con AWS CLI

*(Numeración original: "Guia DYNAMO DB, 1) CRUD", ítems 1 a 14; los encabezados "Gestión de tablas",
"CREATE", "READ" y "DELETE" que preceden a este bloque en el documento son tablas que quedaron como
imagen en el documento — mismo contenido, sin datos adicionales que transcribir.
Todos los comandos usan `--endpoint-url http://localhost:8000` para DynamoDB Local, omitido en la
transcripción de la fuente "para que se lea".)*

**Respuesta de la fuente:**

```
# 1. Listar tablas (pág. 218)
aws dynamodb list-tables

# 2. Crear tabla ShoppingCart (pág. 218)
aws dynamodb create-table --table-name ShoppingCart \
  --attribute-definitions AttributeName=ItemName,AttributeType=S \
  --key-schema AttributeName=ItemName,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

# 3. Describir tabla (pág. 219)
aws dynamodb describe-table --table-name ShoppingCart

# 4. Insertar ítems (pág. 221)
aws dynamodb put-item --table-name ShoppingCart --item '{"ItemName": {"S": "Tickle Me Elmo"}}'
aws dynamodb put-item --table-name ShoppingCart --item '{"ItemName": {"S": "1975 Buick LeSabre"}}'
aws dynamodb put-item --table-name ShoppingCart --item '{"ItemName": {"S": "Ken Burns: the Complete Box Set"}}'

# 5. Leer todos (scan = SELECT *) (pág. 222)
aws dynamodb scan --table-name ShoppingCart

# 6. Leer por clave (get-item) (pág. 223)
aws dynamodb get-item --table-name ShoppingCart --key '{"ItemName": {"S": "Tickle Me Elmo"}}'

# 7. Lectura consistente (pág. 223)
aws dynamodb get-item --table-name ShoppingCart --key '{"ItemName": {"S": "Tickle Me Elmo"}}' --consistent-read

# 8. Borrar ítem (pág. 223)
aws dynamodb delete-item --table-name ShoppingCart --key '{"ItemName": {"S": "Tickle Me Elmo"}}'

# Nota: DynamoDB no permite strings vacíos (pág. 220). Solo restringe el esquema en los atributos
# clave; el resto es schemaless.

# --- Tabla Books (clave compuesta: hash + range) ---

# 9. Put con JSON anidado (pág. 221)
aws dynamodb put-item --table-name Books --item '{"Title": {"S": "Moby Dick"}, "PublishYear": {"N": "2012"}, "ISBN": {"N": "98765"}, "PublisherInfo": {"Name": "Something"}}'

# 10. Crear tabla con clave compuesta (pág. 224)
aws dynamodb create-table --table-name Books \
  --attribute-definitions AttributeName=Title,AttributeType=S AttributeName=PublishYear,AttributeType=N \
  --key-schema AttributeName=Title,KeyType=HASH AttributeName=PublishYear,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

# 11. Insertar ítems (págs. 224-225)
aws dynamodb put-item --table-name Books --item '{"Title": {"S": "Moby Dick"}, "PublishYear": {"N": "1851"}, "ISBN": {"N": "12345"}}'
aws dynamodb put-item --table-name Books --item '{"Title": {"S": "Moby Dick"}, "PublishYear": {"N": "1971"}, "ISBN": {"N": "23456"}, "Note": {"S": "Out of print"}}'
aws dynamodb put-item --table-name Books --item '{"Title": {"S": "Moby Dick"}, "PublishYear": {"N": "2008"}, "ISBN": {"N": "34567"}}'

# 12. Range query - libros después de 1980 (pág. 225)
aws dynamodb query --table-name Books \
  --expression-attribute-values '{":title": {"S": "Moby Dick"}, ":year": {"N": "1980"}}' \
  --key-condition-expression 'Title = :title AND PublishYear > :year'

# 13. Query con proyección - solo ISBN (pág. 226)
aws dynamodb query --table-name Books \
  --expression-attribute-values '{":title": {"S": "Moby Dick"}, ":year": {"N": "1900"}}' \
  --key-condition-expression 'Title = :title AND PublishYear > :year' --projection-expression 'ISBN'

# 14. Query con proyección - solo Note (pág. 227)
aws dynamodb query --table-name Books \
  --expression-attribute-values '{":title": {"S": "Moby Dick"}, ":year": {"N": "1900"}}' \
  --key-condition-expression 'Title = :title AND PublishYear > :year' --projection-expression 'Note'

# Notas del query:
# - Operadores válidos para range key: =, >, <, >=, <=, BETWEEN, begins_with.
# - BETWEEN a AND b equivale a >= a AND <= b.
# - Si el atributo proyectado no existe en un ítem, devuelve {} (visible en 'Note').
```

**Resolución del vault:** "no verificado en el motor". La sintaxis de la AWS CLI es correcta en los 14
comandos: la clave simple de `ShoppingCart` (`HASH` sobre `ItemName`) y la clave compuesta de `Books`
(`HASH` sobre `Title`, `RANGE` sobre `PublishYear`) están bien declaradas con
`--attribute-definitions`/`--key-schema`, y el uso de `expression-attribute-values` con placeholders
(`:title`, `:year`) en `--key-condition-expression` es el patrón estándar para evitar inyección de
valores literales. Las páginas citadas (218–227) están dentro del rango del cap. 7 según la ficha.

### Ejercicio 14 — DynamoDB: la fórmula de particiones (Find.1)

*(Numeración original: "4) Capítulo 7, página 232" — ejercicio Find.1.)*

> Hacer el ejercicio Find.1: averiguar la fórmula que usa DynamoDB para calcular el número de
> particiones de una tabla. Ver el link "A Deep Dive into DynamoDB Partitions".

**Respuesta de la fuente:** capturas de un artículo externo (no el libro) con la fórmula:

> Por rendimiento (throughput): particiones = RCU/3000 + WCU/1000 — cada partición aguanta hasta 3000
> RCU y 1000 WCU. Por almacenamiento: particiones = GB de datos / 10 — cada partición topea en 10 GB.

Y las definiciones de RCU/WCU: 1 RCU da 1 lectura fuertemente consistente de hasta 4 KB, o 2 lecturas
eventualmente consistentes de hasta 4 KB (con redondeo hacia arriba si el ítem supera los 4 KB); 1 WCU
da 1 escritura por segundo de hasta 1 KB (redondeando hacia arriba).

**Resolución del vault:** *Seven Databases* cap. 7, p. 232 (PDF 242, offset +10), *Day 1 Homework › Find, ítem
1*: "DynamoDB does have a specific formula that's used to calculate the number of partitions for a
table. Do some Googling and find that formula" — el libro no da la fórmula, solo manda a buscarla,
así que la cita de página es correcta y el documento hizo la tarea pedida. La fórmula transcripta
coincide con el artículo "A Deep Dive into DynamoDB Partitions" (Shine Solutions Group, 2016,
`https://shinesolutions.com/2016/06/27/a-deep-dive-into-dynamodb-partitions/`), que es casi
seguro el artículo al que apunta el link de la consigna (mismo título exacto) — verificado contra el
artículo: da exactamente "particiones por rendimiento = RCU/3000 +
WCU/1000" y "particiones por almacenamiento = GB/10", con el total como el **máximo** entre ambas, no
la suma. El documento no transcribe explícitamente esa regla del máximo, aunque sí la usa
correctamente en el Ejercicio 15.

### Ejercicio 15 — DynamoDB: cálculo de particiones y modelado de tweets (Do.1, Do.2)

*(Numeración original: "5) Capítulo 7, página 233", incisos a) Do.1 y b) Do.2. Verificado contra el
libro con `pdftotext -f 242 -l 243` (p. 233, offset +10): la lista real de *Day 1 Homework › Do* tiene
tres ítems — Do.1 es la fórmula de particiones (el inciso a); Do.2 es justamente "If you were storing
tweets in DynamoDB, how would you do so..." (el modelado de tweets, inciso b); Do.3, que el documento
no transcribe, no tiene nada que ver con índices: pide hacer una operación de `update-item` con
*conditional expressions* sobre la tabla `ShoppingCart`.)*

> a) Usando la fórmula del ejercicio anterior, calcular cuántas particiones usaría una tabla que
> almacena 100 GB de datos y tiene asignadas 2000 RCU y 3000 WCU. b) Si guardaran tweets en DynamoDB,
> ¿cómo lo harían usando los tipos de datos soportados por DynamoDB?

**Respuesta de la fuente:** el documento transcribe el enunciado (en inglés, tal como está en el
libro) pero **no da la resolución numérica** ni la respuesta de modelado.

**Resolución del vault (obligatoria: la fuente no responde):**

*Do.1 — número de particiones.* Con la fórmula del Ejercicio 14 (máximo entre partición por
rendimiento y por almacenamiento, redondeando cada término hacia arriba):

- Por rendimiento: `2000/3000 + 3000/1000 = 0,667 + 3 = 3,667` → **4 particiones**.
- Por almacenamiento: `100 GB / 10 GB = 10` → **10 particiones**.
- Total: `max(4, 10)` = **10 particiones** (manda el requisito de almacenamiento, no el de
  throughput).

*Do.2 — modelado de tweets.* *(propuesta propia)* Un tweet tiene un identificador único, un autor, un
timestamp, un texto acotado y, opcionalmente, hashtags y menciones. Con los tipos de DynamoDB (S,
N, B, y los conjuntos SS/NS/BS, más L y M para listas y mapas):

| Atributo | Tipo DynamoDB | Por qué |
| --- | --- | --- |
| `TweetId` (partition key) | S | identificador único, string para permitir cualquier esquema de ids |
| `UserId` | S | quién lo publicó; podría ser sort key si la tabla se consulta "tweets de un usuario" |
| `Timestamp` | N | epoch Unix, permite `query` con rango y ordenar cronológicamente |
| `Text` | S | contenido del tweet |
| `Hashtags` | SS (string set) | conjunto de strings, sin duplicados ni orden — encaja con la semántica de un hashtag |
| `Mentions` | SS | igual que hashtags |
| `Metrics` | M (map) | anidar likes/retweets/replies como sub-atributos numéricos sin crear más tablas |

Con `UserId` como *sort key* y una tabla con clave compuesta (`UserId` hash + `Timestamp` range) se
resuelve el patrón de acceso más común: "tweets de un usuario en un rango de fechas", igual que el
ejemplo `Books` del Ejercicio 13.

### Ejercicio 16 — DynamoDB: fortalezas y debilidades

*(Numeración original: "6)".)*

> Resuma las fortalezas y debilidades de DynamoDB. ¿En qué situaciones utilizarían esta base de
> datos?

**Respuesta de la fuente:** el documento transcribe la consigna pero no la responde.

**Resolución del vault (obligatoria: la fuente no responde):** paráfrasis del *Wrap-Up* del cap. 7 (pp.
255–256, PDF 265–266, offset +10). Fortalezas: cero instalación ni configuración, se empieza a
construir de inmediato; pocos límites intrínsecos de escala si hay presupuesto; ofrece índices y
*range queries* — construcciones más potentes que las de muchos NoSQL — aunque exige resignar parte
del poder de consulta de SQL; el ecosistema AWS alrededor (Kinesis, Lambda, Athena) permite tapar
huecos (como las consultas tipo SQL que DynamoDB no ofrece de forma nativa). Debilidades: la
planificación de capacidad (RCU/WCU) y el diseño del modelo de datos alrededor del particionado son
difíciles de acertar; conviene usar Postgres u otro motor relacional salvo que el problema
"tenga forma de DynamoDB"; encaja el modelo de datos con el sistema de particionado puede costar; y
el costo económico del servicio administrado no siempre se justifica frente a correr la base uno
mismo. Situaciones de uso: cargas con escritura muy alta y predecible, acceso por clave con patrones
de consulta bien definidos de antemano (como en el Ejercicio 24, el ejemplo del videojuego), y
equipos que priorizan velocidad de desarrollo y libertad operativa sobre control de infraestructura.

### Ejercicio 17 — DynamoDB según el teorema CAP

*(Numeración original: "7)".)*

> Clasifique DynamoDB según el Teorema CAP.

**Respuesta de la fuente:** el documento transcribe la consigna pero no la responde en este punto
(sí clasifica a "Amazon DB" como **AP** en la tabla independiente "Conceptos Generales / BASE DE
DATOS - FINAL" — ver nota en el Ejercicio 12 —, que no está ligada a ningún ejercicio numerado; ni el
Ejercicio 24 ni el 32 traen tabla en la fuente, son prosa pura).

**Resolución del vault (obligatoria: la fuente no responde acá):** DynamoDB se clasifica como **AP**:
tolera particiones y prioriza disponibilidad, con consistencia eventual por defecto. A diferencia de
otros motores AP, DynamoDB deja elegir la consistencia **por lectura**: `--consistent-read` (ver
Ejercicio 13, ítem 7) pide una lectura fuertemente consistente, que puede no estar disponible durante
una partición real — es decir, DynamoDB no tiene una única esquina fija, sino que el cliente puede
pedir más C a costa de disponibilidad en cada request. *Seven Databases* no clasifica a DynamoDB en su
apéndice A2 (el recuadro de CAP está en el cap. 4, MongoDB); el propio recuadro *DynamoDB's
Consistency Model* del cap. 7 (p. 215, PDF 225) describe justamente esta elección por lectura sin
fijar una postura CAP explícita. La ubicación en AP sale del slide 18 de la Clase 12, que pone a
DynamoDB en la columna AP; Corbellini no clasifica a DynamoDB (la palabra no aparece en el paper,
que solo nombra el Dynamo de Amazon) → [[2.12.04 - Teorema CAP|Teorema CAP]] § 4.3.

---

## Bloque 3 — Transacciones y control de concurrencia *(Clase 11, ya dictada)*

### Ejercicio 18 — Anomalías de concurrencia y niveles de aislamiento

*(Numeración original: sin número, sección "Transacciones SGDB" § "Los problemas de concurrencia" y
"Orden de gravedad".)*

**Respuesta de la fuente (correcta):**

- **Race condition:** el resultado depende del orden en que se ejecutan las transacciones; el problema
  de fondo del que derivan los demás.
- **Dirty read:** una transacción lee datos modificados por otra que todavía no confirmó; si esa
  segunda transacción hace rollback, lo leído era inválido — la más grave de las tres, porque implica
  leer algo que nunca existió de forma confirmada.
- **Non-repeatable read:** se lee un dato, otra transacción lo modifica y confirma, y al releer dentro
  de la misma transacción se obtiene un valor distinto — afecta filas ya existentes que cambian de
  valor.
- **Phantom read:** se lee un conjunto de filas que cumple un criterio, y otra transacción inserta o
  elimina filas que también lo cumplen; al releer, el conjunto cambió de tamaño — la diferencia con la
  anterior es que acá aparecen o desaparecen filas, no cambia el valor de una existente.

Orden de gravedad (de peor a menos grave): dirty read → non-repeatable read → phantom read, resuelto
de forma acumulativa por los niveles de aislamiento:

| Nivel de aislamiento | Dirty read | Non-repeatable read | Phantom read |
| --- | --- | --- | --- |
| Read Uncommitted | permite | permite | permite |
| Read Committed | evita | permite | permite |
| Repeatable Read | evita | evita | permite |
| Serializable | evita | evita | evita |

**Resolución del vault:** consistente con [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]]. Falta mencionar el **lost update**, que la fuente omite de la
lista de anomalías pero que sí está en el material de la Clase 11 y en el concepto del vault — vale la
pena repasarlo aparte para el parcial. La cita de la fuente al pie ("Todo eso está en BD2 - Clase 11:
Seguridad y Transacciones, sección Mecanismos de Control de Concurrencia") es correcta.

### Ejercicio 19 — Mecanismos de control de concurrencia

*(Numeración original: sin número, misma sección, subtítulos "Locking", "Control de Versiones" y
"Timestamp Ordering".)*

**Respuesta de la fuente (correcta):**

- **Locking (bloqueos):** *Shared Lock* — varias transacciones pueden leer un dato, ninguna puede
  modificarlo hasta liberar el bloqueo; *Exclusive Lock* — una sola transacción lee y modifica, nadie
  más puede leer ni modificar hasta liberarlo.
- **Control de versiones (Optimistic Concurrency Control):** no usa bloqueos; las transacciones hacen
  sus cambios y, antes de confirmar, se verifica si los datos cambiaron durante la transacción; si
  cambiaron, hay conflicto y la transacción debe manejar el error.
- **Timestamp ordering:** cada transacción recibe un sello de tiempo; los datos se ordenan según esos
  tiempos, y ante un conflicto sobre el mismo registro gana la transacción con el sello más bajo.

Resumen de la fuente: locking previene el conflicto bloqueando (pesimista); control de versiones lo
detecta al final y lo maneja (optimista); timestamp ordering lo ordena por tiempo de llegada.

**Resolución del vault:** correcto y bien resumido; coincide con [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]].

---

## Bloque 4 — Vistas SQL

### Ejercicio 20 — Vista de investigadores que dirigieron proyectos en 3 o más institutos de Buenos Aires

*(Numeración original: sin número, sección "Ejs de parcial", con el esquema en la imagen 9.)*

> Sea el esquema lógico de una BD de Investigadores:
>
> - `Investigador (IdInvest, IdCateg, nombre, mail, fec_nac, horas_invest, jerarquía, jefe)`
> - `Categoria (IdCateg, denominación, hs_requeridas)`
> - `Campus (id_campus, nomCampus, Universidad, superficie, dirección, provincia)`
> - `Proyecto (IdInvest, fecha_inicio, IdInst, fecha_fin, desempeño)`
> - `Instituto (IdInst, nombre, id_campus, superficieInst)`
>
> Nota: `fecha_fin` null en Proyecto indica el cargo actual del investigador. Jerarquía =
> {senior, junior, master}. Valores por defecto: en Investigador `mail = postmaster@gmail.com`,
> `horas_invest = 30`, `jerarquía = junior`.
>
> **A.** Obtener el identificador, nombre y fecha de nacimiento de todos los investigadores que han
> dirigido proyectos en al menos 3 institutos diferentes de la provincia de Buenos Aires.
> **B.** Obtener el identificador, nombre y fecha de nacimiento de todos los investigadores que han
> dirigido proyectos en al menos 3 institutos diferentes de la provincia de Buenos Aires, y tienen
> menos de 30 años. Utilice la vista anterior.
> **C.** Obtener identificador, nombre y fecha de nacimiento de todos los investigadores,
> conjuntamente con los proyectos que han dirigido, con fecha de inicio posterior al 31/12/2015.

**Respuesta de la fuente (solo el inciso A):**

```sql
CREATE VIEW directores_proyectos AS
SELECT i.idInvest, i.nombre, i.fec_nac
FROM Investigador i
JOIN Proyecto p ON i.idInvest = p.idInvest
JOIN Instituto inst ON inst.idInst = p.idInst
JOIN Campus c ON c.id_campus = inst.id_campus
WHERE c.provincia = 'Buenos Aires'
GROUP BY i.idInvest, i.nombre, i.fec_nac
HAVING COUNT(DISTINCT inst.idInst) >= 3;
```

Con la aclaración: "Asumo que jefe es un IdInvest que cada investigador tiene asociado a su jefe que
es otro investigador."

**Verificado en MySQL 9.7.2** (esquema recreado con `Investigador`,
`Categoria`, `Campus`, `Instituto` y `Proyecto` según el enunciado; `jefe` autorreferencial a
`Investigador.IdInvest`, `Proyecto` con PK `(IdInvest, fecha_inicio)`, sin datos del enunciado
original porque la fuente no los da — se cargaron tres institutos en Buenos Aires y uno en Santa Fe,
un investigador con proyectos en los tres de Buenos Aires y otro con uno solo):

```
mysql> SELECT * FROM directores_proyectos;
idInvest  nombre      fec_nac
1         Ana Perez   1985-05-01
```

El investigador con proyectos en los 3 institutos de Buenos Aires aparece; el que solo dirigió un
proyecto en un instituto de Buenos Aires queda afuera, como corresponde a `HAVING COUNT(DISTINCT
inst.idInst) >= 3`. La vista corre sin errores y da el resultado esperado.

**Resolución del vault — incisos B y C (obligatoria: la fuente no los responde):**

```sql
-- B: investigadores de la vista anterior con menos de 30 años
CREATE VIEW directores_proyectos_jovenes AS
SELECT dp.idInvest, dp.nombre, dp.fec_nac
FROM directores_proyectos dp
WHERE TIMESTAMPDIFF(YEAR, dp.fec_nac, CURDATE()) < 30;
```

```sql
-- C: todos los investigadores con sus proyectos de fecha_inicio posterior al 31/12/2015
CREATE VIEW investigadores_proyectos_recientes AS
SELECT i.idInvest, i.nombre, i.fec_nac, p.IdInst, p.fecha_inicio, p.fecha_fin, p.desempenio
FROM Investigador i
JOIN Proyecto p ON i.idInvest = p.idInvest
WHERE p.fecha_inicio > '2015-12-31';
```

Ambas se corrieron en MySQL sobre el mismo esquema: B devuelve vacío con los datos de prueba cargados
(la única investigadora que cumple A tiene más de 30 años en esta carga); C devuelve los proyectos con
`fecha_inicio` posterior a esa fecha para los dos investigadores de prueba, filas incluidas en la
verificación de más arriba. Nota sobre C: la consigna pide "todos los investigadores… conjuntamente
con los proyectos que han dirigido, con fecha de inicio posterior al 31/12/2015" — se interpretó como
un `JOIN` (solo investigadores que efectivamente tienen algún proyecto en ese rango), no un `LEFT
JOIN`; si la intención fuera listar también a los investigadores sin proyectos recientes con `NULL` en
esas columnas, correspondería `LEFT JOIN` en su lugar — el enunciado no lo aclara.

(nota) La misma consigna es el Ejercicio 1 de
[[Práctica subida por la cátedra|Práctica subida por la cátedra]]. Allí la resolución del vault toma
para C la lectura con `LEFT JOIN` y la fecha en el `ON`, porque la consigna pide *"todos los
investigadores"*, y señala que la nota manuscrita de esa práctica filtra por `jerarquía = 'master'`
sin que la consigna lo pida.

---

## Bloque 5 — Final 1Jul2025 (Balbo)

### Ejercicio 21 — Índices para acelerar el login de muchos usuarios

*(Numeración original: pregunta 1, Final 1Jul2025.)*

> Se tienen muchos usuarios en una App que usa como base de datos MySQL. ¿Qué tipo de índice se
> debería usar para el userID para que se pueda acceder más rápido en el login?

**Respuesta de la fuente (correcta):** si existen muchos usuarios, en principio un índice **HASH**
sería el adecuado, ya que solo hace falta saber si el usuario existe y si la contraseña es correcta
(igualdad pura, sin rangos). Sin embargo, en MySQL/InnoDB lo habitual es declarar `userID` como
`PRIMARY KEY` o `UNIQUE INDEX`, lo que se implementa mediante un índice **B+Tree**, que en la práctica
permite búsquedas muy eficientes para el login igual. Incluye una tabla de tipos de índice: HASH
(igualdad exacta, no sirve para rangos), B-Tree/B+Tree (el más común, igualdad y rangos), Unique
(restricción de integridad, no solo performance), Compuesto (importa el orden de las columnas, como
una agenda por apellido y después nombre), Full Text (búsqueda de texto) y Espacial (datos
geográficos).

**Resolución del vault:** coincide con [[1.08.02 - Índices|Índices]] § *Qué cubre el material*: "el
B-tree sirve para igualdad, rango, `ORDER BY` y prefijo; el hash, solo para igualdad con clave
completa. En InnoDB, `USING HASH` se acepta pero crea un B-tree (según el manual)". La respuesta de la
fuente ya incorpora esta salvedad de MySQL/InnoDB, así que no hace falta corregirla: es la respuesta
más completa posible con el material dictado (Clase 08 + slides 31–38 de la Clase 11).

### Ejercicio 22 — Taxonomía NoSQL para archivos XML sin relación entre sí

*(Numeración original: pregunta 2, Final 1Jul2025 — opción múltiple A) Columnar B) Clave-Valor
C) Documentos D) Grafos.)*

**Respuesta de la fuente (correcta): C) Documentos.** Documentos está pensado para estructura no
rígida, con elementos que pueden diferir en campos entre sí — encaja con XML sin relación. Grafos no
tiene sentido porque se aprovecha cuando los datos se relacionan de maneras diversas y no definidas;
acá no hay relaciones. Clave-valor es el caso clásico de caché: dado una clave, acceso rápido a un
valor, pero navegar el contenido interno del XML es complicado y rara vez se quiere solo un campo
puntual. Documental convierte fácilmente los tags XML a campos JSON, sin forzar un esquema, con cada
documento autónomo y autocontenido.

**Resolución del vault:** coincide con [[2.12.01 - NoSQL — origen, propiedades y taxonomía|Taxonomía
NoSQL]]: los cuatro géneros son clave-valor, documento, columna (familia de columnas) y grafo; XML sin
relación y con campos variables entre elementos es el caso de libro para el género documental. La
opción "Columnar" tampoco encaja por la misma razón que grafos: un *column store*/*wide-column*
apunta a agregaciones sobre muchas filas con el mismo esquema de columnas, no a documentos con forma
libre.

### Ejercicio 23 — Por qué Neo4j no lo usan las grandes redes sociales

*(Numeración original: pregunta 3, Final 1Jul2025.)*

**Respuesta de la fuente:** aunque el esquema de grafos sería útil para diagramar relaciones como las
de una red social, la transaccionalidad estricta que ofrece Neo4j choca con la respuesta rápida que
necesita ese tipo de plataforma. Neo4j es CP por defecto, y la versión AP (HA) no está soportada.
Además no tiene *auto sharding* (hay que copiar el grafo entero), por lo que no escala
horizontalmente, algo necesario cuando el cómputo requerido cambia día a día. Es más útil Cassandra
por el volumen y porque el tipo de consultas está bien definido de antemano, y Cassandra escala muy
bien.

**Resolución del vault:** consistente con lo que documenta [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] sobre la diferencia entre escalar verticalmente
(copiar todo el grafo) y horizontalmente (particionar entre nodos). Neo4j y Cassandra son temas **no
dictados aún** en 2026 2C (Neo4j: 19/10; Cassandra: 28/09), así que esta es una buena introducción
pero conviene revisarla de nuevo contra el material real de esas clases cuando se dicten.
(atención) Sobre CAP, la fuente dice que Neo4j es CP por defecto y AP solo con HA; *Seven Databases*
2ª ed. coincide en HA = AP (cap. 6, § *Neo4j on CAP*, impresa 208) pero ubica a Neo4j de una sola
instancia en CA (apéndice A2, impresa 317). El matiz está desarrollado en [[Final 1Jul2025]] §
Pregunta 3.

### Ejercicio 24 — Elegir motor para un videojuego con 1.000 millones de escrituras por segundo

*(Numeración original: pregunta 4, Final 1Jul2025 — userID y score.)*

**Respuesta de la fuente (Cassandra, con alternativas):** Cassandra porque (1) las consultas típicas
("score de un userID", "mejores scores", "scores de los amigos de un userID") se pueden modelar bien
sabiendo de antemano el patrón de acceso; (2) las escrituras son muy rápidas, algo que el volumen
exige; (3) tiene *auto sharding*, escala horizontalmente; (4) es **AP** — no es vital la consistencia
fuerte para un score, a diferencia de un saldo bancario; (5) acepta multi-datacenter, lo que ayuda a
escalar geográficamente. Alternativas descartadas: **DynamoDB** (también AP y escalable, pero atado a
AWS); **Redis** (mejor para lecturas que para el volumen de escrituras pedido, no soporta datasets más
grandes que la RAM, y hay que manejar la persistencia porque es volátil por defecto).

**Resolución del vault:** razonamiento correcto y bien fundamentado; coincide con la caracterización de
Cassandra como motor AP orientado a escritura de alto volumen que da el vault en
[[2.12.04 - Teorema CAP|Teorema CAP]] y [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]]. Nota: 1.000 millones de escrituras por segundo es una cifra
extrema incluso para Cassandra a escala de un solo clúster razonable — vale como ejercicio de
razonamiento sobre el eje AP/escritura, no como una cifra realista de sizing.

### Ejercicio 25 — CAP: el náufrago (verdadero/falso)

*(Numeración original: pregunta 5, Final 1Jul2025, incisos A–E.)*

> Un náufrago está años en una isla desconectado del mundo. Llega un barco, le preguntan quién es el
> presidente.
> **A.** El náufrago está particionado del mundo.
> **B.** Responde quién era el presidente hace 4 años → el náufrago es consistente.
> **C.** Responde quién era el presidente hace 4 años → el náufrago es disponible.
> **D.** Hace 2 años le llegó una botella con una notita de quién era el presidente → es eventualmente
> consistente.
> **E.** Hace 2 años le llegó esa notita → el náufrago es disponible.

**Respuesta de la fuente (correcta):**

- **A — Verdadero.**
- **B — Falso:** no es consistente porque no da un dato actualizado (da el último que tiene); está
  particionado, es AP, no consistente. En consistencia fuerte, al consultar se espera el valor más
  actualizado — no es el caso.
- **C — Verdadero:** puede contestar, nada se lo impide. En CAP, disponibilidad no significa
  "responder bien", significa que ante una consulta el nodo da alguna respuesta no fallida.
- **D — Verdadero**, con la salvedad de que depende de que le sigan llegando "botellitas" cada tanto:
  representa una actualización que llega tarde, típica de consistencia eventual — si hubo otro cambio,
  debería llegarle otra botella en algún momento.
- **E — Verdadero:** si el náufrago puede responder, está disponible, más allá del contenido de la
  notita.

Comentario final de la fuente: en CAP, ante partición, el sistema elige entre responder siempre aunque
sea con datos viejos (disponibilidad) o negarse/esperar para no dar datos incorrectos (consistencia).

**Resolución del vault:** correcto y bien explicado, coincide con
[[2.12.04 - Teorema CAP|Teorema CAP]] y [[2.12.05 - BASE y consistencia eventual|BASE y consistencia
eventual]]. Es una de las mejores justificaciones de todo el documento.

### Ejercicio 26 — Redis Sentinel (verdadero/falso)

*(Numeración original: pregunta 6, Final 1Jul2025, incisos A–C.)*

> **A.** Sentinel Redis es un proveedor de configuración, le informa al usuario dónde está el nodo
> master. **B.** Sentinel Redis vigila el estado de los Master Nodes y Slave Nodes. **C.** Cuando un
> Master Node falla, el administrador de Redis Sentinel es el que inicia el proceso de failover.

**Respuesta de la fuente (correcta):**

- **A — Verdadero:** Sentinel actúa como *configuration provider*: los clientes le preguntan a
  Sentinel cuál es el master actual, relevante porque si el master falla y una réplica es promovida,
  la dirección del master cambia.
- **B — Verdadero:** es exactamente la función de *monitoring*: los procesos Sentinel monitorean
  instancias maestras y réplicas para detectar fallas y coordinar la recuperación.
- **C — Falso:** el failover lo inicia automáticamente Redis Sentinel, no un administrador humano; los
  Sentinels deben detectar la falla y alcanzar quórum, y luego proponen una réplica como nuevo master.

**Resolución del vault:** correcto y consistente con lo verificado en el Ejercicio 9 (mismo tema,
*Seven Databases* cap. 8 p. 289).

---

## Bloque 6 — Final 1Dic2023 (Balbo)

### Ejercicio 27 — Qué base de datos da versionado de sus datos

*(Numeración original: pregunta 2, Final 1Dic2023 — opción múltiple A) Cassandra y MongoDB B) Mongo
C) HBase D) Neo4j E) Ninguna de las anteriores.)*

**Respuesta de la fuente: C) HBase**, marcada como correcta sin justificación adicional.

**Resolución del vault (tema fuera del temario 2026):** **HBase no se dicta en la cursada 2026 2C** —
el [[_cronograma]] documenta que el programa oficial la incluye pero el cronograma real la reemplaza
por **Cassandra**. La respuesta se verifica contra *Seven Databases in Seven Weeks* 2ª ed., Apéndice
A1 *Database Overview Tables* (impresa 313): la columna *Versioning* marca **Yes** solo para HBase,
CouchDB y DynamoDB, y **No** para PostgreSQL, MongoDB, Neo4j y Redis. Entre las cinco opciones, la
única compatible es **C) HBase**: A y B incluyen a MongoDB, que el libro marca "No", y Neo4j también
es "No". La fuente acierta → misma resolución en [[Final 1Dic2023]] § *Pregunta 2*.

### Ejercicio 28 — Vistas materializadas de PostgreSQL (verdadero/falso)

*(Numeración original: pregunta 3, Final 1Dic2023, incisos A–D.)*

> **A.** Una vista materializada de PostgreSQL brinda mejor performance en comparación con su
> sentencia `SELECT`. **B.** Una vista materializada de PostgreSQL no brinda mejor performance en
> comparación con su sentencia `SELECT`. **C.** Una vista materializada de PostgreSQL tiene sus datos
> puestos en disco y los busca en cada `SELECT`. **D.** Una vista materializada de PostgreSQL, al
> hacer un `SELECT`, va a buscar los datos a la tabla de la que fue creada originalmente.

**Respuesta de la fuente (correcta):**

- **A — Verdadero:** una vista materializada sí mejora la performance sobre un `SELECT` directo (puede
  tener sus propios índices).
- **B — Falso:** por la misma razón que A.
- **C — Verdadero.**
- **D — Falso:** eso sería cierto para una vista normal, no para una materializada — una vista
  materializada no vuelve a consultar las tablas base en cada `SELECT`; lee el resultado guardado, y
  solo vuelve a las tablas originales con `REFRESH MATERIALIZED VIEW`.

**Resolución del vault:** el inciso C coincide con [[1.06.01 - Vistas|Vistas]] § *Virtual vs.
materializada*, que trae literalmente "¿Guarda datos? sí, pre-calculados y almacenados físicamente"
para la fila correspondiente. La frase "no vuelve a consultar automáticamente las tablas base en cada
`SELECT`... solo vuelve a las tablas originales cuando se hace un `REFRESH MATERIALIZED VIEW`" que
justifica el inciso D **no es una cita del vault** (verificado con `grep` sobre
`wiki/conceptos/1.06.01 - Vistas.md`: ninguna de esas tres frases aparece ahí) sino la propia
justificación del documento fuente; conceptualmente sí es consistente con lo que esa página dice sobre
la vista materializada ("por mantenimiento incremental o regeneración", nunca al recalcularse en cada
`SELECT`), pero no está transcripta de ahí. Importante para el parcial: **MySQL 9.7.2 acepta `CREATE
MATERIALIZED VIEW` pero no materializa**: recalcula en cada `SELECT` (ver [[Final 1Dic2023]] §
*Pregunta 3*; la Clase 07, slide 20, dice que MySQL no las admite). Esta pregunta, si aparece en 2026,
se evalúa en términos teóricos de PostgreSQL: en el motor de la cursada la sintaxis corre, pero no hay
materialización.

---

## Bloque 7 — Final 1Dic2025 (Balbo)

### Ejercicio 29 — Tabla Usuarios en DynamoDB: put-item y query

*(Numeración original: pregunta 2, Final 1Dic2025. El documento incluye dos transcripciones de esta
misma pregunta: una bajo "DEL FINAL" —sintaxis correcta— y otra bajo "Final 1Dic2025" propiamente
dicha, con errores de transcripción por el editor de texto del `.docx`.)*

> Se tiene la tabla Usuarios en DynamoDB con Partition Key: Email, Sort Key: Fecha (AAAA-MM-DD),
> Atributos: Nombre y Edad. **A.** Insertar (Email: juan@example.com, Fecha: 2025-01-01, Nombre: Juan
> Pérez, Edad: 35). **B.** Obtener todos los usuarios cuyo Email sea juan@example.com.

**Respuesta de la fuente ("DEL FINAL", sintaxis correcta):**

```
# A
aws dynamodb put-item --table-name Usuarios --item '{
  "Email": {"S": "juan@example.com"},
  "Fecha": {"S": "2025-01-01"},
  "Nombre": {"S": "Juan Pérez"},
  "Edad": {"N": "35"}
}'

# B
aws dynamodb query --table-name Usuarios \
  --key-condition-expression "Email = :email" \
  --expression-attribute-values '{":email": {"S": "juan@example.com"}}'
```

**Respuesta de la fuente ("Final 1Dic2025", con errores de transcripción — atención):**

```
aws dynambodb put-item - - table-name Usuarios - - item '{
  "Email" : {"S": "juan@example.com.ar" },
  "Fecha": {"S": "2025-01-01"},
  "Nombre": {"S": "Juan Perez"},
  "Edad": {"N": "35"}
}'

aws dynamo db query –table-name Usuarios\
  –key-condition-expression "Email: :email"\
  –expression-atributes-values '{":email": {"S": "juan@example.com.ar"}}'
```

**Resolución del vault (atención — la segunda transcripción tiene varios errores):** comparada con la
primera versión (correcta) del mismo documento, esta segunda trae: `dynambodb` en vez de `dynamodb`
(typo), `- -` con espacio en vez de `--` (el editor de texto separó el doble guion), `dynamo db` con
espacio en `get-item`, `"Email: :email"` en vez de `"Email = :email"` (la condición de clave usa `=`,
no `:`; con `:` la CLI la rechazaría), `expression-atributes-values` mal escrito (falta la segunda "r"
de *attributes*) y el email cambiado a `juan@example.com.ar` en la clave de `query` aunque el
enunciado y el `put-item` correcto usan `juan@example.com` — con ese cambio la consulta no
encontraría el registro insertado. Se documentan los dos textos porque son literalmente lo que trae la
fuente (probablemente autocorrección de comillas tipográficas y guiones del procesador de texto sobre
un texto que en algún momento se pegó dos veces), pero para estudiar conviene quedarse con la primera
versión ("DEL FINAL"), sintácticamente correcta. Ninguna de las dos se verificó en el motor.

### Ejercicio 30 — Concurrencia en bases de datos relacionales (verdadero/falso)

*(Numeración original: pregunta 3, Final 1Dic2025, incisos A–E.)*

> **A.** El esquema de control de concurrencia de un DBMS controla la interacción entre transacciones
> concurrentes para evitar que se destruya la consistencia de la base de datos. **B.** En el esquema
> secuencial de transacciones, una operación puede comenzar antes de que termine la anterior. **C.**
> Un dirty read ocurre cuando una transacción lee datos modificados por otra que aún no confirmó. **D.**
> El objetivo del Shared Lock es que dos transacciones puedan leer y escribir concurrentemente un
> mismo dato. **E.** En el timestamp ordering, las transacciones se ejecutan en orden inverso al valor
> otorgado.

**Respuesta de la fuente (correcta):**

- **A — Verdadero:** el control de concurrencia es el sistema que usa el DBMS para gestionar varias
  transacciones simultáneas evitando que se pisen entre ellas.
- **B — Falso:** en un esquema secuencial/serial las transacciones se ejecutan una después de la otra,
  sin solaparse (ejemplo: T1 completa `read`/`write`/`commit` de A antes de que T2 empiece).
- **C — Verdadero:** definición clásica de dirty read (ejemplo: T1 actualiza el saldo, T2 lo lee, T1
  hace rollback — T2 leyó un valor que "nunca existió oficialmente").
- **D — Falso:** el Shared Lock permite que varias transacciones **lean** al mismo tiempo, pero no que
  escriban; no permite que una escriba mientras otra tiene el shared lock.
- **E — Falso:** en timestamp ordering, el sistema intenta que el resultado sea equivalente a ejecutar
  las transacciones en el **orden** de sus timestamps, no en orden inverso.

**Resolución del vault:** correcto en los cinco incisos, coincide con
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]].

### Ejercicio 31 — Por qué Neo4j no lo usan Instagram o Twitter

*(Numeración original: pregunta 4, Final 1Dic2025 — variante del Ejercicio 23.)*

**Respuesta de la fuente:** mismo argumento que el Ejercicio 23: la transaccionalidad estricta (ACID)
de Neo4j choca con la velocidad de respuesta que necesitan las redes sociales; Neo4j es CP por
defecto, y la versión AP (HA) no está soportada; no tiene *auto sharding* (hay que copiar todo el
grafo), por lo que no escala horizontalmente — condición necesaria cuando el cómputo requerido varía
rápido. Cassandra es mejor por el volumen de las aplicaciones y porque escala muy bien
horizontalmente.

**Resolución del vault:** ver Ejercicio 23 — mismo razonamiento, mismo motor (Neo4j) todavía no
dictado en 2026 2C (se dicta el 19/10).

### Ejercicio 32 — Elección de motor para sensores IoT de logística

*(Numeración original: pregunta 5, Final 1Dic2025.)*

> Empresa multinacional de logística con sensores en camiones y contenedores; cada vehículo envía
> ~2.000 datos por segundo (ubicación GPS, temperatura, y otros atributos). Se requiere una base
> tolerante a particiones, altamente disponible y que escale horizontalmente, además de soportar
> consultas históricas como "temperatura promedio de cada sensor en la última semana". Elegir una
> base de datos y justificar.

**Respuesta de la fuente (Cassandra, correcta):** tolerancia a particiones + alta disponibilidad es
literalmente lo que Cassandra prioriza según CAP (AP), a cambio de consistencia eventual; su
arquitectura en anillo hace que la caída de un nodo no degrade el servicio (sin nodo "principal": el
cliente se conecta a cualquier nodo, que actúa de coordinador) — clave cuando una caída significa
pérdida de dinero o de datos. Escala horizontalmente agregando nodos de hardware de bajo costo, y de
forma lineal (2 nodos → X operaciones/seg, 4 nodos → 2X), dando predictibilidad para sumar flota.
Está optimizada para escritura de alto volumen (SSTables + compactación), encaja con el patrón de
series temporales/IoT. Para "temperatura promedio de cada sensor en la última semana", el modelado en
Cassandra se guía por el patrón de acceso: se diseña el modelo según las consultas que se van a
ejecutar, no al revés.

**Resolución del vault:** razonamiento sólido, consistente con
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] y
[[2.12.04 - Teorema CAP|Teorema CAP]]. Cassandra todavía **no se dictó** al 25/09/2026 (se dicta el
28/09/2026); revisar de nuevo contra el
material real de esa clase cuando esté disponible en el vault.

---

## Qué enseña para el parcial 2026

- De este documento, entran al parcial del **13/10/2026** los temas ya dictados —**transacciones y
  concurrencia** (Bloque 3), **vistas SQL** (Ejercicio 20 y las materializadas del Ejercicio 28),
  **índices** (Ejercicio 21), la taxonomía NoSQL (Ejercicio 22) y el CAP del náufrago (Ejercicio 25),
  de la Clase 12— y **Cassandra** (Ejercicios 24 y 32), que se dicta el 28/09 y el 05/10, antes del
  parcial. Neo4j, Redis y DynamoDB se dictan después: quedan para el recuperatorio y el final — ver
  [[_cronograma]].
- Patrón que se repite en los finales viejos: las preguntas de "elegir un motor y justificar"
  (Ejercicios 24, 32) y las de "por qué Neo4j no sirve para X" (Ejercicios 23, 31) casi siempre se
  resuelven con el mismo trío de argumentos — CAP (¿AP o CP?), escalabilidad horizontal (¿auto
  sharding o hay que copiar todo?) y el patrón de acceso (¿las consultas están bien definidas de
  antemano?). Vale la pena tener ese trío como checklist mental.
- Las preguntas V/F de CAP (Ejercicio 25) y de concurrencia (Ejercicios 18, 30) premian justificar con
  la definición exacta (qué es "disponible" en CAP, qué es un dirty read) antes que con intuición.
- Trampa recurrente en los V/F: negar la premisa completa aunque una parte sea cierta (Ejercicio 30-D:
  el Shared Lock sí permite lectura concurrente, pero no escritura — la afirmación completa es falsa
  por agregar "y escribir").
- La vista de investigadores (Ejercicio 20) es un buen ejemplo de `HAVING COUNT(DISTINCT …)` sobre un
  `JOIN` de tres tablas — un patrón típico de "cuenta cuántos distintos" que reaparece en varios TPs.
- El índice HASH vs. B+Tree (Ejercicio 21) es la trampa de fondo del temario de índices: la respuesta
  "teóricamente correcta" (HASH para igualdad pura) no es la que usa el motor real en InnoDB
  (B+Tree) — hay que poder dar las dos.

## Dudas abiertas

- La clasificación CAP de Redis (Ejercicio 12) sigue en disputa dentro del propio vault entre el
  deck de la cátedra (CP), el paper de Corbellini (AP) y *Seven Databases* (CA) — no se resuelve acá;
  ver [[2.12.04 - Teorema CAP|Teorema CAP]] § *Dudas abiertas*.
- El Ejercicio 20-C asumió un `JOIN` (no un `LEFT JOIN`) para "todos los investigadores… con los
  proyectos que han dirigido, con fecha de inicio posterior al 31/12/2015"; el enunciado no aclara si
  los investigadores sin proyectos recientes deberían aparecer con columnas en `NULL`.
- El Ejercicio 15 (Do.2, modelado de tweets en DynamoDB) es una propuesta propia sin enunciado de
  cátedra contra el cual contrastarla.

## Enlaces

- [[Mapa de exámenes]]
- Clases: [[Clase 11 - Seguridad-Transacciones]] · [[Clase 06 - Vistas-Parte 1]] ·
  [[Clase 07 - Vistas-Parte 2]] · [[Clase 08 - Explicando el plan]] ·
  [[Clase 12 - Introduccion a NoSQL]].
- Conceptos: [[1.06.01 - Vistas|Vistas]] · [[1.08.02 - Índices|Índices]] ·
  [[1.11.03 - Transacciones y ACID|Transacciones y ACID]] ·
  [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] ·
  [[2.12.01 - NoSQL — origen, propiedades y taxonomía|Taxonomía NoSQL]] ·
  [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
  [[2.12.04 - Teorema CAP|Teorema CAP]] · [[2.12.05 - BASE y consistencia eventual|BASE y consistencia
  eventual]].
- [[_cronograma]] — fechas de dictado de Redis (26/10), DynamoDB (02/11), Cassandra (28/09) y Neo4j
  (19/10), todas usadas en esta página para rotular qué está "no dictado aún".
