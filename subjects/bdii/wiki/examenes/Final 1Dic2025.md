---
tipo: examen
unidad: eval
instancia: final
tema:
  - Teorema CAP y consistencia eventual
  - DynamoDB — modelado y sentencias con partition/sort key
  - Control de concurrencia y aislamiento en bases relacionales
  - Escalabilidad horizontal de Neo4j
  - Cassandra para IoT — series temporales de alto volumen
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Final 1Dic2025.docx"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Copia de BDII - Finales Viejos.docx"
estado: procesado
resumen: "Final de estudiantes (rótulo de la fuente: 1Dic2025): CAP, DynamoDB (partition/sort key con AWS CLI), concurrencia y aislamiento, escalabilidad de Neo4j y Cassandra para sensores IoT. Reconstruido de memoria ('Como me las acuerdo…'); se cruzan la copia sin respuestas y la copia con desarrollo."
aliases:
  - Final 1Dic2025
  - Final Diciembre 2025
---

# Final 1Dic2025 — CAP, DynamoDB, concurrencia y Cassandra IoT

## Resumen general

Final de Base de Datos II reconstruido por estudiantes, identificado en la fuente con el rótulo
«1Dic2025» (se conserva tal cual: no se deduce llamado ni día). El documento dedicado se abre con la
aclaración explícita de la propia fuente —*"Como me las acuerdo…"*—, es decir, ya viene marcado como
una reconstrucción de memoria, no una transcripción del enunciado oficial. Son cinco preguntas: la
metáfora del náufrago (CAP), sentencias sobre una tabla de `Usuarios` en DynamoDB con partition y sort
key, cinco afirmaciones de verdadero/falso sobre concurrencia y aislamiento en bases relacionales, por
qué Neo4j no es la base de redes sociales masivas (remite a la misma pregunta del
[[Final 1Jul2025|final 1Jul2025]]), y el diseño de una base de datos para sensores IoT de una empresa
de logística.

Hay dos copias que se cruzan: `BDII - Final 1Dic2025.docx` trae las cinco preguntas **sin ninguna
respuesta** —es el enunciado reconstruido, tal cual—, mientras que la sección correspondiente dentro
de `Copia de BDII - Finales Viejos.docx` repite las mismas cinco preguntas palabra por palabra y
además desarrolla respuestas completas para la 3 y la 5 (la 1 remite a la del final 1Jul2025, la 2 no
tiene desarrollo y la 4 dice explícitamente "ya lo respondí arriba"). Ninguna de las dos es oficial de
la cátedra. La pregunta 5 (Cassandra para IoT) es la respuesta más completa y mejor argumentada de los
tres finales de esta tanda, y sirve de referencia cruzada para resolver la discrepancia de la pregunta
4 del final 1Jul2025. Tres de las cinco preguntas (DynamoDB, Neo4j, Cassandra) son sobre temas
todavía no dictados en septiembre de 2026; se responden igual, apoyadas en bibliografía y rotuladas.

> [!info] Fuente
> - `BDII - Final 1Dic2025.docx`: el enunciado completo tal como el estudiante lo reconstruyó de
>   memoria ("Como me las acuerdo…"), sin respuestas. Sirve para confirmar el texto exacto de cada
>   pregunta.
> - `Copia de BDII - Finales Viejos.docx` (sección final): mismas cinco preguntas, con desarrollo
>   completo para la 3 y la 5, remisión a otra pregunta para la 1 y la 4, y sin desarrollo para la 2.
>   Ambas de estudiantes, no oficiales de la cátedra, sin capturas ni confirmación de fecha exacta de
>   rendición (el rótulo "1Dic2025" es literal de la fuente).

## Formato

- **Cinco preguntas**: 1 y 3 son de verdadero/falso con justificación (cinco afirmaciones cada una);
  2 pide escribir dos sentencias sobre una tabla DynamoDB; 4 y 5 son de desarrollo abierto.
- Puntaje, condición de aprobación, duración y modalidad: **no especificados** en ninguna de las dos
  fuentes.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1 | Teorema CAP y consistencia eventual (náufrago) | [[2.12.04 - Teorema CAP\|Teorema CAP]] · [[2.12.05 - BASE y consistencia eventual\|BASE y consistencia eventual]] | Clase 12 |
| 2 | Insertar y consultar en DynamoDB (partition/sort key) | DynamoDB — texto plano *(no dictado aún, se dicta el 02/11)* | — |
| 3 | Concurrencia y aislamiento en bases relacionales | [[1.11.04 - Control de concurrencia y niveles de aislamiento\|Control de concurrencia]] | Clase 11 |
| 4 | Por qué Neo4j no escala para redes sociales masivas | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | no dictado aún — Neo4j se dicta el 19-20/10 |
| 5 | Cassandra para sensores IoT de alto volumen | [[2.12.02 - Escalabilidad horizontal — sharding y replicación\|Escalabilidad horizontal]] | no dictado aún — Cassandra 28/09 y 05/10 |

### Pregunta 1 — el náufrago: CAP y consistencia eventual

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

Pregunta idéntica, palabra por palabra, a la pregunta 5 del [[Final 1Jul2025|final 1Jul2025]] y a la
pregunta 1 del [[Final 1Dic2023|final 1Dic2023]] (mismas cinco afirmaciones A-E).

**Respuesta de la fuente:** ninguna de las dos copias desarrolla la respuesta aquí; la sección del
final 1Dic2025 dentro de `Copia de BDII - Finales Viejos.docx` reproduce el enunciado pero no repite
la justificación, por ser —según la propia estructura del documento— la misma pregunta ya resuelta
para el final 1Jul2025.

**Resolución del vault:** ver [[Final 1Jul2025]] § Pregunta 5. Se aplica sin cambios: A y C
verdaderas, B falsa, D verdadera condicionada a que sigan llegando actualizaciones, E verdadera.

### Pregunta 2 — DynamoDB: insertar y consultar por partition key

> Se tiene la tabla Usuarios en DynamoDB con:
> - Partition Key: Email.
> - Sorted Key: Fecha (en YYYY-MM-DD)
> - Atributos: Nombre y Edad
>
> Escribir las siguientes sentencias:
>
> A) Insertar el siguiente registro: (Email: juan@example.com, Fecha: 2025-01-01, Nombre: Juan
>    Pérez, Edad: 35)
> B) Obtener todos los usuarios cuyo Email sea juan@example.com

**Respuesta de la fuente:** ninguna de las dos copias trae sentencias resueltas para esta pregunta.

**Resolución del vault — DynamoDB no está dictado aún en 2026 2C (previsto el 02/11).** Se
responde con la sintaxis de **AWS CLI** que usa *Seven Databases in Seven Weeks* 2ª ed., cap. 7
(DynamoDB) — verificado contra el propio capítulo, § *Basic Read/Write Operations* (impresa 221): el
libro usa exclusivamente comandos `aws dynamodb put-item`, `get-item`, `scan` y `query` con
`--key-condition-expression`, no PartiQL (PartiQL no aparece en ningún capítulo del libro, que es de
2018).

**A) Insertar el registro** — con `Email` como partition key y `Fecha` como sort key, ambos son
obligatorios en el `--item`:

```sh
aws dynamodb put-item \
  --table-name Usuarios \
  --item '{
    "Email":  {"S": "juan@example.com"},
    "Fecha":  {"S": "2025-01-01"},
    "Nombre": {"S": "Juan Pérez"},
    "Edad":   {"N": "35"}
  }'
```

**B) Obtener todos los usuarios cuyo Email sea juan@example.com** — como la tabla tiene clave
compuesta (partition + sort), "todos los usuarios con ese email" son, en rigor, todos los ítems con
ese `Email` sin importar la `Fecha`: eso es un `query` por partition key, no un `get-item` (que exige
la clave completa, partition + sort, y devuelve un único ítem). Siguiendo el patrón del libro
(*Day 1: Let's Go Shopping!*, impresa 224-225, ejemplo con `Title = :title` — sin subtítulo propio
dentro del capítulo; la sección *An SQL Querying Interface* es un ejemplo distinto, de *Day 3*,
impresa 250):

```sh
aws dynamodb query \
  --table-name Usuarios \
  --key-condition-expression "Email = :e" \
  --expression-attribute-values '{":e": {"S": "juan@example.com"}}'
```

*(nota del vault)* un `get-item` con solo `Email` fallaría porque a esta tabla le falta la parte de
la clave que identifica el ítem único (`Fecha`); el enunciado pide "todos los usuarios", lo que en
DynamoDB con clave compuesta es semánticamente una consulta por rango de sort key implícito (todas las
fechas), no una lectura puntual — de ahí que la operación correcta sea `query`, no `get-item`.

### Pregunta 3 — concurrencia y aislamiento en bases relacionales

> Indicar si las siguientes afirmaciones relacionadas con concurrencia en bases de datos
> relacionales son verdaderas o falsas.
>
> A) El esquema de control de concurrencia de un DBMS controla la interacción entre las
>    transacciones concurrentes para evitar que se destruya la consistencia de la base de datos
>    (algo así).
> B) En el esquema secuencial de transacciones, una operación puede comenzar antes de que termine la
>    anterior.
> C) Un dirty read ocurre cuando una transacción lee datos modificados por otra transacción que aún
>    no ha sido confirmada.
> D) El objetivo del Shared Lock es que dos transacciones puedan leer y escribir concurrentemente un
>    mismo dato.
> E) En el timestamp ordering, las transacciones se ejecutan en orden inverso al valor otorgado.

**Respuesta de la fuente (`Copia de BDII - Finales Viejos.docx`, desarrollada letra por letra):**

| # | V/F | Justificación de la fuente |
| --- | --- | --- |
| A | Verdadero | "es casi textual del apunte" |
| B | Falso | "es al revés"; en el esquema secuencial no puede empezar una hasta que termina la anterior; lo que permite solapamiento es la ejecución concurrente |
| C | Verdadero | "es la definición exacta" de dirty read |
| D | Falso | Shared Lock permite que varias transacciones **lean** a la vez, pero ninguna puede modificar hasta liberarlo; escribir requiere Exclusive Lock |
| E | Falso *(atención, ver nota)* | se ejecutan en el orden de sus sellos de tiempo, con prioridad para el **más bajo** (más antiguo), no al revés |

*(atención)* la propia fuente se contradice en el ítem E antes de llegar a esta versión: la
respuesta rápida inicial del documento decía "Verdadero, primero el timestamp mas bajo" (V/F
invertido respecto de la afirmación, aunque con el criterio correcto de prioridad), y solo después el
bloque desarrollado letra por letra la corrige a "Falso" con la justificación de la tabla. Se
reporta aquí la versión final ("Falso"), que es la técnicamente correcta, pero se deja constancia de
que la fuente no llegó a ella de forma directa.

**Resolución del vault:** las cinco respuestas coinciden con
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]]: la definición
de A es la que da esa página para el propósito del control de concurrencia; C es la definición
canónica de *dirty read* (GMUW cap. 6.6.5); D
reproduce exactamente la distinción Shared/Exclusive Lock de esa página (*"Shared Lock — permite que
[varias transacciones lean]... Exclusive Lock — permite que una sola transacción lea y modifique el
dato"*); E coincide con § 3.3 *Timestamp ordering* de esa misma página, donde el sello **más bajo**
(más antiguo) tiene prioridad. B es correcta por descarte: el esquema secuencial es, por definición,
el opuesto del concurrente.

### Pregunta 4 — por qué Neo4j no es la base de las grandes redes sociales

> Si Neo4j parece ideal para el modelado de comunidades, ¿por qué aplicaciones como Instagram o
> Twitter no la usan?

Pregunta con el mismo fondo que la pregunta 3 del [[Final 1Jul2025|final 1Jul2025]] (ahí con
Facebook/LinkedIn/X en vez de Instagram/Twitter). La `Copia de BDII - Finales Viejos.docx` ni
siquiera repite la justificación aquí: dice literalmente "ya lo respondí arriba", remitiendo a la
respuesta ya dada para el final anterior dentro del mismo documento.

**Resolución del vault:** ver [[Final 1Jul2025]] § Pregunta 3, incluido el matiz (atención)
sobre la esquina por defecto de Neo4j (CP en la fuente, CA en *Seven Databases* A2, impresa 317; HA =
AP en los dos). No se repite aquí para no duplicar contenido.

### Pregunta 5 — Cassandra para sensores IoT de una empresa de logística

> Se quiere diseñar un sistema para una empresa multinacional de logística que tiene sensores en sus
> camiones y containers. Cada vehículo envía aproximadamente 2.000 datos por segundo, donde los
> atributos son: Ubicación por GPS · Temperatura · Algo · Algo. Para este sistema, se requiere una
> base de datos que sea tolerante a particiones y altamente disponible, así como que pueda escalar
> horizontalmente. Además, se debe poder realizar consultas históricas, como por ejemplo "la
> temperatura promedio de cada sensor en la última semana". Elegir una base de datos y justificar la
> elección.

*(nota del vault)* el enunciado original lista cuatro atributos de sensor pero solo nombra dos
(Ubicación por GPS, Temperatura); los otros dos quedaron como "Algo" en ambas copias de la fuente —no
es un error de transcripción de esta página, así llega el documento.

**Respuesta de la fuente (`Copia de BDII - Finales Viejos.docx`): Cassandra**, con una justificación
en cuatro partes. *Tolerancia a particiones + alta disponibilidad*: es exactamente lo que pide el
enunciado y lo que Cassandra prioriza según CAP (AP, eventualmente consistente); su arquitectura en
anillo hace que la caída de un nodo no degrade el servicio porque no hay nodo "principal" — el cliente
se conecta a cualquier nodo, que actúa de coordinador. *Escala horizontal*: agrega nodos de hardware
de bajo costo y escala linealmente (2 nodos → X operaciones/seg, 4 nodos → 2X). *Volumen de escritura*:
2.000 datos/seg por vehículo por una flota completa es una carga de escritura enorme, para la que
Cassandra está optimizada (SSTables + compactación); es el caso de uso clásico de series
temporales/IoT. *Consultas históricas*: en Cassandra el modelado se guía por el patrón de acceso —se
diseña el esquema según las queries que se van a ejecutar—, lo que encaja con pedir de antemano "el
promedio de la última semana". La fuente agrega una consideración de diseño: elegir bien la
**partition key** (propone `(sensor_id, ventana_temporal)`, por ejemplo `sensor_id` + día) para
distribuir la carga y evitar *hot partitions*, y acotar la lectura de "última semana" a pocas
particiones ordenadas por tiempo. Como alternativas descartadas: una relacional no daría la escala ni
el *throughput* de escritura pedidos; MongoDB también escala horizontalmente (sharding) y da alta
disponibilidad (*replica sets*) y "podría defenderse", pero el perfil de escritura masiva
*append-only* de series temporales encaja mejor con Cassandra.

**Resolución del vault:** la respuesta y su razonamiento son consistentes con Corbellini § 3.2 (las
tres políticas de reparación de Cassandra) y § 5.2/Tabla 5 (Cassandra en las siete dimensiones
comparadas), la única fuente bibliográfica del vault sobre Cassandra (ver Puntos abiertos § 1 de
CLAUDE.md); la compactación de SSTables que menciona la fuente no está en Corbellini y sale de la
documentación oficial de Apache Cassandra. Esta pregunta es la versión más desarrollada del mismo patrón de la pregunta 4
del [[Final 1Jul2025|final 1Jul2025]] (motor para escritura masiva y distribuida): aquí la fuente sí
concluye Cassandra con una justificación completa, lo que refuerza que la respuesta "Redis" que la
versión corta del final 1Jul2025 da para ese caso análogo (videojuego, 10⁹ escrituras/seg) es la
inconsistente entre las cuatro respuestas que tocan este patrón en los tres finales de esta tanda.

## Qué enseña para el parcial 2026

- El patrón "motor para escritura distribuida masiva + tolerancia a particiones + disponibilidad +
  escalado horizontal" aparece dos veces en esta tanda de finales (aquí y en la pregunta 4 del final
  1Jul2025) y las dos veces la respuesta mejor justificada es Cassandra — memorizar el criterio
  (AP, auto-sharding, escritura optimizada por SSTables) sirve para cualquier variante de esta
  pregunta tipo, sea IoT, gaming o logística.
- La pregunta 3 (concurrencia) es enteramente transferible al parcial 2026: dirty read, Shared vs.
  Exclusive Lock y timestamp ordering son teoría de la Clase 11, ya dictada, y las cinco afirmaciones
  de este final son un buen resumen de las trampas más comunes de ese tema (confundir el sentido del
  timestamp ordering, o creer que Shared Lock permite escribir).
- Para DynamoDB, distinguir `get-item` (requiere la clave completa) de `query` (filtra por partition
  key, opcionalmente con condición sobre el sort key) es la trampa central de cualquier pregunta con
  clave compuesta — "traer todos los X con partition key = valor" es siempre `query`, nunca
  `get-item`.

## Dudas abiertas

- (abierto) Los dos atributos de sensor que el enunciado deja como "Algo" no se pudieron
  reconstruir: ninguna de las dos copias de la fuente los completa.
- (abierto) Ninguna de las dos fuentes da fecha exacta, duración, modalidad ni puntaje de este
  final; el propio documento se autodescribe como reconstruido de memoria, así que ni siquiera el
  orden o la redacción exacta de las preguntas está garantizado al 100 %.

## Enlaces

[[Mapa de exámenes]] · [[Final 1Jul2025]] · [[Final 1Dic2023]] · [[_cronograma]] · [[_index-clases]] ·
[[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]] ·
[[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia]] ·
[[2.12.02 - Escalabilidad horizontal — sharding y replicación|Escalabilidad horizontal]] ·
[[Clase 11 - Seguridad-Transacciones]]
