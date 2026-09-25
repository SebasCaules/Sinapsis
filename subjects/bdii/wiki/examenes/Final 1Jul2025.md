---
tipo: examen
unidad: eval
instancia: final
tema:
  - Índices — hash vs. B-tree en MySQL
  - Taxonomía NoSQL — modelo de documentos
  - Escalabilidad horizontal — Neo4j vs. Cassandra
  - Cassandra vs. Redis para escritura masiva
  - Teorema CAP y consistencia eventual
  - Redis Sentinel — alta disponibilidad
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Finales Viejos.docx"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Copia de BDII - Finales Viejos.docx"
estado: procesado
resumen: "Final de estudiantes (rótulo de la fuente: 1Jul2025): índice hash en MySQL, taxonomía NoSQL, límites de Neo4j, Cassandra vs. Redis para escritura masiva, teorema CAP y Redis Sentinel. Dos copias con respuestas propias distintas, contrastadas y verificadas contra bibliografía y los motores del curso."
aliases:
  - Final 1Jul2025
  - Final Julio 2025
---

# Final 1Jul2025 — índices, taxonomía NoSQL, CAP y escalabilidad

## Resumen general

Final de Base de Datos II reconstruido por estudiantes, identificado en la fuente con el rótulo
«1Jul2025» (se conserva tal cual: no se deduce si corresponde a un primer llamado ni a un "día 1" de
examen). Son seis preguntas de desarrollo y opción múltiple centradas en la segunda mitad de la
cursada: qué tipo de índice conviene para un login de alto volumen en MySQL, qué taxonomía NoSQL usar
para documentos XML sin relación entre sí, por qué Neo4j no es la base de las grandes redes sociales,
qué motor elegir para mil millones de escrituras por segundo en un videojuego, el teorema CAP
ilustrado con la metáfora de un náufrago, y el rol de Redis Sentinel en alta disponibilidad.

Existen dos copias del mismo final con respuestas de estudiantes distintas: una más breve
(`BDII - Finales Viejos.docx`) y una más extensa y argumentada (`Copia de BDII - Finales
Viejos.docx`, que además agrupa tres finales en un solo archivo). Ninguna es oficial de la cátedra ni
trae solucionario propio: son apuntes personales reconstruidos después de rendir. Las dos coinciden
en cinco de las seis respuestas; en la pregunta del videojuego (4) difieren de manera real —una elige
Cassandra, la otra Redis— y esa discrepancia se documenta y se resuelve más abajo. La confiabilidad es
dispar pregunta por pregunta: sólida en la del náufrago (CAP) y en la de Sentinel, más floja en la de
Neo4j y abiertamente contradictoria en la del videojuego. Para el parcial del 13/10/2026, las
preguntas 1 (índice hash en MySQL, verificable en el motor real de esta cursada), 2 (taxonomía NoSQL)
y 5 (CAP) son de temas ya dictados; la 4 (Cassandra) se dicta antes del parcial (28/09 y 05/10), y la
3 (Neo4j) y la 6 (Redis) llegan después del 13/10.

> [!info] Fuente
> - `BDII - Finales Viejos.docx` (carpeta *Drive 72.41 - BDII - Examenes Viejos*): versión corta, con
>   una "Respuesta:" breve por pregunta. De estudiantes, no oficial de la cátedra.
> - `Copia de BDII - Finales Viejos.docx` (carpeta *Drive bd2 (4to año 2Q)*): versión más larga del
>   mismo final, mismas seis preguntas pero respuestas más extensas y argumentadas —a veces con
>   alternativas descartadas explícitamente, como en la pregunta 4—. También de estudiantes. Este
>   archivo agrupa además los finales 1Dic2023 y 1Dic2025 en un solo documento.
> - Ninguna de las dos copias trae el enunciado oficial de la cátedra, capturas de pantalla ni fecha
>   exacta de rendición: ambas son reconstrucciones posteriores al examen, hechas de memoria.

## Formato

- **Seis preguntas**: 1, 3 y 4 son de desarrollo/justificación abierta; 2 es de opción múltiple con
  justificación; 5 y 6 son de verdadero/falso con justificación obligatoria (cinco y tres
  afirmaciones respectivamente).
- Puntaje, condición de aprobación, duración y modalidad: **no especificados** en ninguna de las dos
  fuentes.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1 | Índice hash vs. B-tree para acceso por igualdad (MySQL) | [[1.08.02 - Índices\|Índices]] | Clase 08 · Clase 11 |
| 2 | Taxonomía NoSQL — documentos para XML sin esquema compartido | [[2.12.01 - NoSQL — origen, propiedades y taxonomía\|Taxonomía NoSQL]] | Clase 12 |
| 3 | Por qué Neo4j no escala para redes sociales masivas | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | no dictado aún — Neo4j se dicta el 19-20/10 |
| 4 | Cassandra vs. Redis para 10⁹ escrituras/segundo | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | no dictado aún — Cassandra 28/09 y 05/10, Redis 26/10 |
| 5 | Teorema CAP y consistencia eventual (metáfora del náufrago) | [[2.12.04 - Teorema CAP\|Teorema CAP]] · [[2.12.05 - BASE y consistencia eventual\|BASE y consistencia eventual]] | Clase 12 |
| 6 | Redis Sentinel — failover y proveedor de configuración | Redis — texto plano *(no dictado aún, se dicta el 26/10)* | — |

### Pregunta 1 — índice para el login en MySQL

> Se tienen muchos usuarios en una App que usa como base de datos MySQL. ¿Qué tipo de índice se
> debería usar para el userID para que se pueda acceder más rápido en el login?

**Respuesta de la fuente (las dos versiones coinciden en la idea):** un índice de tipo **HASH**. La
versión corta razona que el login es una comparación exacta (existencia del usuario + validación de
contraseña, sin rangos), así que conviene un acceso O(1) por hash en vez de un B-tree. La versión
larga agrega que un B-tree "tardaría más en responder" para ese caso de uso porque no hace falta
comparar usuarios entre sí, solo verificar existencia puntual.

**Resolución del vault — (atención), la idea es correcta pero no es implementable como la fuente la
describe en el motor de esta cursada.** El razonamiento teórico es el correcto y coincide con
[[1.08.02 - Índices|Índices]]: para *equality lookup* puro (`WHERE userID = ?`), un hash resuelve en
O(1) contra el O(log n) de un B-tree. El problema es MySQL/InnoDB: verificado corriendo en MySQL
9.7.2:

```sql
CREATE TABLE usuarios_hash (userID INT PRIMARY KEY, password VARCHAR(50));
CREATE INDEX idx_userid_hash ON usuarios_hash(userID) USING HASH;
SHOW INDEX FROM usuarios_hash;
```

Salida real:

```
Table           Key_name          Index_type
usuarios_hash   PRIMARY           BTREE
usuarios_hash   idx_userid_hash   BTREE
```

`USING HASH` se acepta sin error, con la nota `3502` (*"This storage engine does not support the HASH
index algorithm, storage engine default was used instead."*, visible con `SHOW WARNINGS`), e InnoDB
(el *storage engine* por defecto de MySQL, y el que usa esta cursada) construye un B-tree igual. Repitiendo la misma tabla con
`ENGINE=MEMORY` sí se obtiene `Index_type = HASH`:

```sql
CREATE TABLE usuarios_hash_mem (userID INT PRIMARY KEY, password VARCHAR(50)) ENGINE=MEMORY;
CREATE INDEX idx_userid_hash ON usuarios_hash_mem(userID) USING HASH;
```
```
Table               Key_name          Index_type
usuarios_hash_mem   PRIMARY           HASH
usuarios_hash_mem   idx_userid_hash   HASH
```

El hash como índice de usuario **solo existe en el motor `MEMORY`**; InnoDB tiene un *adaptive hash
index* interno (construido y administrado automáticamente por el motor sobre páginas calientes de un
B-tree, no declarable con `CREATE INDEX`; verificado `@@innodb_adaptive_hash_index = 0` en MySQL
9.7.2). En la práctica, para una tabla de usuarios persistente en InnoDB, la respuesta correcta
de examen ("HASH") no se traduce en una sentencia SQL ejecutable con el efecto buscado: lo que hay
disponible es el índice único B-tree por defecto sobre `userID` (que ya resuelve la igualdad de forma
eficiente, aunque en O(log n) y no O(1)), o mover esa tabla puntual a `MEMORY` si el caso de uso lo
tolera (datos volátiles). Esto ya está documentado como trampa en
[[1.08.02 - Índices|Índices]] § *Slides 36-37*.

### Pregunta 2 — taxonomía NoSQL para documentos XML

> Se quieren guardar archivos XML, donde ninguno está relacionado con el otro, y cada uno puede
> tener elementos distintos. ¿Qué taxonomía debería usarse?
>
> A) Columnar · B) Clave-Valor · C) Documentos · D) Grafos

**Respuesta de la fuente (ambas versiones coinciden): C) Documentos.** La versión corta lo resume en
que un XML tiene "forma de documento" y una taxonomía documental da una estructura flexible (ejemplo:
MongoDB). La versión larga desarrolla por qué se descartan las otras tres: grafos no aporta nada
porque no hay relaciones definidas entre los archivos; clave-valor sirve para acceder rápido a un
documento entero por clave pero no para consultar su contenido interno (ejemplifica con un esquema
Redis-`HSET` anidado que sería "muy complicado de navegar"); columnar exigiría parsear el XML a una
estructura de columnas predefinida, lo que rompe el requisito de "cada uno puede tener elementos
distintos".

Después del final 1Dic2025, en el mismo documento largo aparece una nota suelta rotulada
"Respuestas Claudia" que responde la misma pregunta ("C) Documentos") con una justificación breve
—"cada documento es independiente y puede tener una estructura y elementos distintos, sin necesidad
de un esquema fijo compartido"—. No queda claro a qué instancia del final pertenece esa nota (aparece
después de la sección del 1Dic2025, no de la del 1Jul2025), así que se la registra aquí como una
tercera confirmación atribuida a otra persona, no como respuesta propia de este final.

**Resolución del vault:** correcto. Coincide con
[[2.12.01 - NoSQL — origen, propiedades y taxonomía|Taxonomía NoSQL]] § 4: el género documental es el
que acepta estructura autónoma por registro sin esquema compartido, justo el requisito del enunciado
("cada uno puede tener elementos distintos"). El razonamiento de la versión larga sobre clave-valor es
preciso: Redis no es un
clave-valor puro (sus valores son estructuras, *Seven Databases* cap. 8), pero incluso así no
resuelve consultar *dentro* de un documento sin construir a mano un esquema de claves anidadas.

### Pregunta 3 — por qué Neo4j no es la base de las grandes redes sociales

> Si Neo4J es fundamental para esquematizar relaciones, ¿por qué no es usado por X, LinkedIn,
> Instagram, Facebook y otras redes sociales?

**Respuesta de la fuente — difiere en el motor alternativo que proponen.** La versión larga: Neo4j
tiene un número máximo de nodos y relaciones, es CP por defecto, y para operar AP (más útil para
"likes" y comentarios) haría falta la edición HA, "que ya no está soportada"; además no tiene
*auto-sharding* (hay que copiar el grafo entero), así que no escala horizontalmente. Concluye que
Cassandra es más útil "por el volumen de las aplicaciones" y porque el tipo de consulta está bien
definido. La versión corta: coincide en que el problema es la escala masiva y la partición de datos,
y que Neo4j "no puede fragmentar subgrafos", pero en vez de nombrar solo Cassandra dice que soluciones
"como HBase o Cassandra" son más viables por estar "diseñadas desde el principio para la máxima
escalabilidad".

**Resolución del vault — (atención), un matiz corregido contra la bibliografía.** El núcleo de las dos
respuestas es correcto y coincide con *Seven Databases* cap. 6 § *Neo4j's Weaknesses*: la edición
Enterprise/HA replica el grafo completo a otros servidores, pero "no puede actualmente fragmentar
subgrafos" (*"It cannot currently shard subgraphs"*), lo que limita el tamaño total del grafo aunque
ese límite sea de decenas de miles de millones de nodos. En la relación CP/AP, la versión larga
coincide con el libro en lo central: el libro dedica una sección propia, *Neo4j on CAP* (impresa 208),
y asocia la edición **HA con AP** ("*Neo4j HA is available and partition tolerant (AP)*"; cada réplica
devuelve lo que tiene aunque esté desactualizada), igual que la fuente, que dice que para AP "hay que
usar la version HA". Donde se aparta es en la **esquina por defecto**: la fuente dice que Neo4j es CP
por defecto, mientras que *Seven Databases* Apéndice A2 (*CAP in the Wild*, impresa 317) ubica a Neo4j
de una sola instancia en **CA**, porque no distribuye datos y no hay partición que tolerar. Sobre
"ya no está soportada": el libro (2018) no dice eso —describe Neo4j HA como la opción vigente—; la
afirmación es más bien sobre el Neo4j actual (Neo4j reemplazó HA por *Causal Clustering* en versiones
posteriores a las del libro), algo que no se puede verificar contra la bibliografía obligatoria de
esta cursada. Sobre la alternativa: ni HBase ni Cassandra están dictadas todavía en 2026 2C (Cassandra
el 28/09 y el 05/10); el criterio de "consulta bien definida + volumen" que da la versión larga sí es
consistente con [[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad
horizontal]].

### Pregunta 4 — motor para un videojuego con 10⁹ escrituras/segundo

> Se tiene un videojuego con un userID y un score. Se prevén 1.000.000.000 de escrituras por segundo.
> ¿Qué base de datos debería usarse?

**Respuesta de la fuente — discrepancia real entre las dos copias.** La versión larga responde
**Cassandra**: el patrón de consultas está bien definido (score de un usuario, mejores scores, scores
de amigos), las escrituras son muy rápidas, tiene *auto-sharding* para escalar con la carga, conviene
un modelo AP porque el score no requiere ACID como una transacción bancaria, y soporta *multi data
center* para un juego jugado desde distintas partes del mundo. Como alternativas descartadas nombra
DynamoDB (mismas ventajas pero con *vendor lock-in* a AWS) y **Redis** explícitamente: "se destaca
cuando se quieren hacer muchas lecturas y acá se quieren hacer muchas escrituras", además de que "no
soporta espacios más grandes de lo que se tiene en una RAM" y es volátil por defecto (hay que manejar
persistencia aparte). La versión corta responde **Redis**: razona que acceder por `userID` a un
`score` es un patrón clave-valor, y que la cantidad de escrituras exige "alta capacidad de performance
y procesamiento", por lo que elige Redis — sin mencionar el límite de RAM ni el perfil de lectura que
la propia versión larga usa para descartarlo.

**Resolución del vault — (atención), las dos fuentes se contradicen; se sostiene Cassandra.** El
patrón de acceso (clave→valor) es compatible con ambos motores, pero el requisito explícito del
enunciado —volumen de **escritura**, no de lectura— favorece a Cassandra: su almacenamiento por
*SSTables* con *compaction* está optimizado para escritura de alto volumen *(resolución del vault,
según la documentación oficial de Apache Cassandra: Corbellini no lo dice)*; el paper (§ 5.2, p. 13, y
Tabla 5, p. 13) la describe como modelo de column families de BigTable con los mecanismos de Dynamo y
arquitectura peer-to-peer sin punto único de falla, y las SSTables que describe en § 5.1.1-5.1.2 son
las de BigTable. Tiene *auto-sharding* real, escala horizontalmente agregando nodos y es AP por
diseño — encaja con que el enunciado no exige consistencia fuerte para un score de videojuego. Redis,
en cambio, es en esencia una estructura en memoria de un único proceso por *shard* (salvo *Redis
Cluster*, no cubierto en la bibliografía de esta cursada): el propio argumento de la versión corta
("alta capacidad de performance") es cierto para *lecturas*, pero el enunciado pide **escrituras**, y
1.000.000.000/s excede por varios órdenes de magnitud lo que un solo proceso puede procesar aunque
esté en RAM. Este mismo patrón de pregunta —motor de escritura masiva y distribuida, AP, IoT/gaming—
se repite casi textual en la pregunta 5 de [[Final 1Dic2025]], donde la fuente sí resuelve con
Cassandra y con una justificación mucho más desarrollada; usar esa resolución como referencia cruzada
refuerza que la respuesta de la versión corta de esta pregunta (Redis) es la que está equivocada, no
la de la versión larga.

### Pregunta 5 — el náufrago: CAP y consistencia eventual

> Decidir si las siguientes afirmaciones son verdaderas o falsas, y justificarlas en este último
> caso. Un náufrago se encuentra desde hace varios años en una isla desierta desconectado del mundo.
> Llega un barco con una persona, la persona se le acerca al náufrago y le pregunta quién es el
> presidente.
>
> A) El náufrago está particionado del mundo.
> B) El náufrago responde quién era el presidente hace 4 años, el náufrago es consistente.
> C) El náufrago responde quién era el presidente hace 4 años, el náufrago es disponible.
> D) Hace 2 años le llegó una botella con una notita de quien era el presidente, el náufrago es
>    eventualmente consistente.
> E) Hace 2 años le llegó una botella con una notita de quien era el presidente, el náufrago es
>    disponible.

**Respuesta de la fuente (las dos versiones coinciden en el fondo):**

| Afirmación | V/F | Justificación de la fuente |
| --- | --- | --- |
| A | Verdadero | quedó desconectado del sistema (el mundo) |
| B | Falso | su dato quedó desactualizado (asumiendo mandato de 4 años); es AP, no consistente |
| C | Verdadero | puede responder al cliente aunque el dato no esté al día |
| D | Verdadero, condicionado | "si vuelven a llegar esas botellas cada tanto" (la versión corta lo da directamente por verdadero) |
| E | Verdadero | sigue siendo disponible, no cambia en nada |

**Resolución del vault:** consistente con [[2.12.04 - Teorema CAP|Teorema CAP]] y
[[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]]. La metáfora sale de *Seven
Databases* 2ª ed. Apéndice A2, *A CAP Adventure, Part I y II* (impresas 316-317): el náufrago en la
isla está particionado, el capitán que pregunta es el cliente, y la botella es el canal de
consistencia eventual — el libro dice que cada vez que el dato cambia alguien lo escribe en un papel
y lo tira al mar en una botella, de modo que el aislado "*can eventually have the correct answer*".
La metáfora traduce
"partición de red" en "aislamiento físico/informativo" y "disponibilidad" en "puede responder,
aunque la respuesta esté vieja" — exactamente la distinción que la página del vault marca como la
más confundida del tema (la C de CAP no es la C de ACID). El matiz de D es correcto: consistencia
eventual no es "una vez llegó la actualización", es que el sistema **converge** si sigue recibiendo
actualizaciones — con una sola botella hace dos años y ninguna más, el náufrago volvió a quedar
desactualizado y ya no es eventualmente consistente en el presente; la versión larga lo capta mejor
al condicionarlo ("si vuelven a llegar...") que la versión corta, que lo da por sentado sin esa
condición. **D queda Verdadero si el mecanismo de botellas sigue** (el libro: se tira una botella con
cada cambio), igual que en la tabla de [[2.12.05 - BASE y consistencia eventual|BASE y consistencia
eventual]].

### Pregunta 6 — Redis Sentinel

> (Cómo se lo acuerda) Decidir si las siguientes afirmaciones son verdaderas o falsas, y
> justificarlas en este último caso.
>
> A) Sentinel Redis es un proveedor de configuración, le informa al usuario dónde está (no me
>    acuerdo que era exactamente) el nodo master.
> B) Sentinel Redis vigila el estado de los Master Nodes y Slave Nodes.
> C) Cuando un Master Node falla, el administrador de Redis Sentinel es el que inicia el proceso de
>    failover.

**Respuesta de la fuente (las dos versiones coinciden: A y B verdaderas, C falsa).** La versión corta
lo resume en una línea. La versión larga desarrolla cada ítem: A es cierta porque Sentinel actúa como
*configuration provider* — los clientes le preguntan a Sentinel la dirección del master vigente
(*service discovery*); B es cierta porque monitorizar masters y réplicas es la función de vigilancia
canónica de Sentinel; C es falsa porque el failover en Sentinel es **automático y por consenso**: los
Sentinels detectan la caída y, solo cuando un **quorum** de instancias coincide en que el master
está caído, un Sentinel líder (elegido entre ellos) ejecuta la promoción de una réplica — nunca lo
dispara un "administrador" humano ni un proceso único.

**Resolución del vault:** consistente con la documentación oficial de Redis sobre Sentinel
(*Redis Sentinel Documentation*, <https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/>),
citada aquí porque **Redis todavía no se dicta en 2026 2C** (previsto 26/10) y *Seven Databases* 2ª
ed. cap. 8 solo lo menciona como tarea (impresa 289, *Day 2 Homework*, *Find* 2) sin desarrollarlo;
el detalle sale de la documentación oficial de Redis. La descripción de la versión larga —quorum +
Sentinel líder, sin intervención manual— coincide con el mecanismo documentado oficialmente: Sentinel
combina *monitoring*, *notification*, *configuration provider* y **automatic failover** con elección
de líder por mayoría (`quorum` + `down-after-milliseconds`), sin actor humano en el camino crítico.

## Qué enseña para el parcial 2026

- La pregunta 1 es la única de este final ejecutable en el motor real de la cursada, y expone una
  trampa concreta de MySQL/InnoDB: pedir `USING HASH` en una tabla InnoDB no da error, pero tampoco
  hace lo que se pide — se ignora en silencio y queda un B-tree. Vale la pena memorizar esto para
  cualquier pregunta de índices del parcial del 13/10.
- El patrón "motor de escritura masiva distribuida, AP, sin necesidad de ACID fuerte" (preguntas 4 de
  este final y 5 de [[Final 1Dic2025]]) apunta a Cassandra, no a Redis ni a DynamoDB — aunque los
  tres son clave-valor en sentido amplio, el criterio que los distingue es volumen de **escritura**
  vs. **lectura**, y el ajuste al tamaño de RAM. Ojo con la variante de la pregunta 10 de
  [[Parcial 23-5-23 - Bases de Datos Avanzadas]]: el mismo juego con UserID y Score, pero como
  **tabla de posiciones** (ranking top-N) y con ~100.000 transacciones/s, se responde con Redis
  (*sorted sets* en memoria). Lo que cambia la respuesta es el volumen y el tipo de carga: escritura
  masiva distribuida que no cabe en RAM → Cassandra; ranking con throughput alto que cabe en memoria →
  Redis.
- Las preguntas de CAP con metáforas (náufrago, barco, botellas) reaparecen en los tres finales de
  esta tanda: conviene automatizar la traducción metáfora → {partición, disponibilidad,
  consistencia, consistencia eventual} en vez de memorizar la anécdota puntual.
- Cuando una respuesta de examen viejo cita una arquitectura HA/edición Enterprise de un motor NoSQL,
  conviene chequearla contra la sección "*<Motor> on CAP*" del libro si existe (Neo4j y HBase son los
  únicos dos con sección propia) antes de darla por buena: aquí la fuente acierta en que HA es AP,
  pero ubica a Neo4j por defecto en CP, donde el libro (Apéndice A2, impresa 317) lo ubica en CA.

## Dudas abiertas

- (abierto) No se pudo determinar a qué examen pertenece la nota suelta "Respuestas Claudia" que
  sigue a la sección del final 1Dic2025 en `Copia de BDII - Finales Viejos.docx`: por contenido
  corresponde a esta pregunta 2, pero su ubicación en el documento sugiere que podría ser de otra
  instancia no incluida en esta tanda de finales.
- (abierto) Ninguna de las dos fuentes da fecha exacta, duración, modalidad ni puntaje de este final;
  no hay con qué completar esos campos del frontmatter más allá de lo que ya se documenta en
  § Formato.

## Enlaces

[[Mapa de exámenes]] · [[Final 1Dic2023]] · [[Final 1Dic2025]] · [[_cronograma]] · [[_index-clases]] ·
[[1.08.02 - Índices|Índices]] ·
[[2.12.01 - NoSQL — origen, propiedades y taxonomía|Taxonomía NoSQL]] ·
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
[[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]] · [[MySQL]]
