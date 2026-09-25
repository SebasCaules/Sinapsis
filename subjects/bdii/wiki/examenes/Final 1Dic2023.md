---
tipo: examen
unidad: eval
instancia: final
tema:
  - Teorema CAP y consistencia eventual
  - Versionado de datos (HBase)
  - Vistas materializadas en PostgreSQL
  - Creación de tablas en HBase (column families)
  - Redis Sentinel — alta disponibilidad
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Finales Viejos.docx"
  - "raw/Examenes_Viejos/Drive bd2 (4to año 2Q)/Copia de BDII - Finales Viejos.docx"
estado: procesado
resumen: "Final de estudiantes (rótulo de la fuente: 1Dic2023): CAP, versionado en HBase, vistas materializadas de PostgreSQL, sintaxis de creación de tablas en HBase y Redis Sentinel. La versión larga trae menos respuestas que la corta; se cruzan ambas."
aliases:
  - Final 1Dic2023
  - Final Diciembre 2023
---

# Final 1Dic2023 — CAP, HBase, vistas materializadas y Sentinel

## Resumen general

Final de Base de Datos II reconstruido por estudiantes, identificado en la fuente con el rótulo
«1Dic2023» (se conserva tal cual: no se deduce llamado ni día). Son cinco preguntas —una de
verdadero/falso con metáfora (CAP), una de opción múltiple sobre versionado de datos, una de
verdadero/falso sobre vistas materializadas de PostgreSQL, una de opción múltiple sobre sintaxis de
HBase y una repetición de la pregunta de Redis Sentinel del [[Final 1Jul2025|final 1Jul2025]]—.

Las mismas dos copias que cubren el final anterior traen este también: la corta
(`BDII - Finales Viejos.docx`) responde las cinco preguntas con una explicación breve cada una; la
larga (`Copia de BDII - Finales Viejos.docx`) trae las preguntas 1 y 5 sin respuesta aparte (remite
implícitamente a las que ya dio para el final 1Jul2025, por ser idénticas), la 2 solo con la opción
correcta resaltada sin desarrollo, y la 3 con las justificaciones incrustadas letra por letra dentro
del propio enunciado. Ninguna es oficial de la cátedra. La pregunta más valiosa para esta cursada es
la de vistas materializadas: corriendo el equivalente en el motor real de 2026 (MySQL 9.7.2) apareció
un hallazgo que no está en ninguna de las dos fuentes y que afecta directamente una duda abierta ya
registrada en [[1.06.01 - Vistas|Vistas]]. Dos de las cinco preguntas (versionado en HBase, sintaxis
de HBase) son sobre un motor fuera del temario 2026; se responden igual, apoyadas en la bibliografía,
y rotuladas como tales.

> [!info] Fuente
> - `BDII - Finales Viejos.docx`: versión corta, con "Respuesta:" completa para las cinco preguntas.
> - `Copia de BDII - Finales Viejos.docx`: versión más larga, agrupa tres finales; para este trae la
>   pregunta 1 y la 5 sin respuesta explícita (idénticas a las ya respondidas para el final
>   1Jul2025), la 2 con la opción correcta resaltada en el texto pero sin justificación, y la 3 con
>   la respuesta desarrollada letra por letra dentro del propio cuerpo de la pregunta (no como bloque
>   aparte). Ambas de estudiantes, no oficiales de la cátedra, sin capturas ni fecha de rendición.

## Formato

- **Cinco preguntas**: 1 y 3 son de verdadero/falso con justificación (cinco y cuatro afirmaciones
  respectivamente); 2 y 4 son de opción múltiple; 5 es de verdadero/falso con justificación (tres
  afirmaciones), textualmente igual a la pregunta 6 del [[Final 1Jul2025|final 1Jul2025]].
- Puntaje, condición de aprobación, duración y modalidad: **no especificados** en ninguna de las dos
  fuentes.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1 | Teorema CAP y consistencia eventual (náufrago) | [[2.12.04 - Teorema CAP\|Teorema CAP]] · [[2.12.05 - BASE y consistencia eventual\|BASE y consistencia eventual]] | Clase 12 |
| 2 | Versionado de datos por motor | HBase — texto plano *(fuera del temario 2026)* | — |
| 3 | Vistas materializadas — performance y almacenamiento | [[1.06.01 - Vistas\|Vistas]] | Clase 07 |
| 4 | Sintaxis `create` de una tabla en HBase | HBase — texto plano *(fuera del temario 2026)* | — |
| 5 | Redis Sentinel — failover y proveedor de configuración | Redis — texto plano *(no dictado aún, se dicta el 26/10)* | — |

### Pregunta 1 — el náufrago: CAP y consistencia eventual

> Decidir si las siguientes afirmaciones son verdaderas o falsas, y justificarlas en este último
> caso. Un náufrago se encuentra desde hace varios años en una isla desierta desconectado del mundo.
> Llega un barco con una persona, la persona se le acerca al náufrago y le pregunta quién es el
> presidente.
>
> A) El náufrago está particionado del mundo.
> B) El náufrago responde quién era el presidente hace 4 años, el náufrago es consistente.
> C) El náufrago responde quién era el presidente hace 4 años, el náufrago es disponible.
> D) Hace 2 años le llegó una botella con una notita de quién era el presidente, el náufrago es
>    eventualmente consistente.
> E) Hace 2 años le llegó una botella con una notita de quien era el presidente, el náufrago es
>    disponible.

Pregunta idéntica, palabra por palabra, a la pregunta 5 del [[Final 1Jul2025|final 1Jul2025]] (con la
única diferencia ortográfica de "quién" con tilde en D acá). La versión larga trae aquí el enunciado
pero no repite la respuesta; la versión corta sí.

**Respuesta de la fuente (versión corta):** A verdadero, B falso, C verdadero, D verdadero (si siguen
llegando botellas), E verdadero — mismo desarrollo que en el final 1Jul2025.

**Resolución del vault:** ver [[Final 1Jul2025]] § Pregunta 5, que desarrolla la misma respuesta con
el mismo detalle. No se repite acá para no duplicar contenido; el matiz relevante es el mismo: D
requiere que las actualizaciones sigan llegando para hablar de consistencia *eventual* en presente, no
de una única corrección puntual hace dos años.

### Pregunta 2 — qué motor da versionado de datos

> Seleccionar la opción correcta. ¿Qué base de datos da el versionado de sus datos?
>
> A) Cassandra y Mongodb · B) Mongo · C) Hbase · D) Neo4j · E) Ninguna de las anteriores

**Respuesta de la fuente:** las dos coinciden en **C) HBase**. La versión larga solo resalta la
opción C en el texto, sin desarrollo. La versión corta lo justifica: HBase permite que cada fila
guarde múltiples versiones del mismo valor asociadas a una marca de tiempo, junto con compresión
transparente y recolección de basura.

**Resolución del vault — (fuera del temario 2026), verificado contra la bibliografía.** *Seven
Databases in Seven Weeks* 2ª ed., Apéndice A1 *Database Overview Tables*, tabla 4 (columnas
*Secondary Indexes · Versioning · Bulk Load · Very Large Files*, impresa 313): de los siete motores
que tabula el libro (PostgreSQL, HBase, MongoDB, CouchDB, Neo4j, DynamoDB, Redis), la columna
*Versioning* marca **Yes** solo para HBase, CouchDB y DynamoDB, y **No** para los demás — incluido
MongoDB. Entre las cinco opciones de la pregunta, la única compatible con esa tabla es **C) HBase**;
Cassandra no aparece en esa tabla del libro (no está entre los siete motores que compara), así que no
se puede confirmar ni descartar por esta fuente, pero tampoco es una de las opciones que sobreviven
igual: A incluye a MongoDB, que el libro marca explícitamente "No". La fuente acierta con C.

### Pregunta 3 — vistas materializadas de PostgreSQL

> Decidir si las siguientes afirmaciones son verdaderas o falsas, y justificarlas en este último
> caso.
>
> A) Una vista materializada de PostgreSQL, brinda performance en comparación a su sentencia de
>    select con el que fue creado.
> B) Una vista materializada de PostgreSQL, no brinda performance en comparación a su sentencia de
>    select con el que fue creado.
> C) Una vista materializada de PostgreSQL tiene sus datos puestos en disco y los busca en cada
>    select.
> D) Una vista materializada de PostgreSQL cuando se realiza un select va a buscar los datos a su
>    tabla de la que fue creada originalmente.

**Respuesta de la fuente (las dos coinciden: A y C verdaderas; B y D falsas).** La versión larga lo
justifica letra por letra dentro del propio cuerpo de la pregunta: A verdadera porque "pueden tener
sus propios índices"; B falsa por el mismo motivo que A es verdadera; C verdadera; D falsa, "eso es en
una vista no materializada". La versión corta llega a la misma conclusión en un bloque aparte: "las
verdaderas son la A) y la C), ya que justamente la idea de la vista materializada es brindar
performance al tener los datos ya persistidos en el disco, y no tener que buscarlos a partir de las
tablas originales como sí sucede en las vistas [no materializadas]".

**Resolución del vault — correcta en PostgreSQL; (atención) con un hallazgo nuevo verificado en
MySQL.** El razonamiento de la fuente es preciso para PostgreSQL, motor sobre el que está redactada la
pregunta: una vista materializada persiste el resultado del `SELECT` en disco como una tabla física
(con sus propios índices posibles) y no recalcula en cada consulta, a diferencia de una vista común.

**MySQL, el motor de esta cursada, no tiene vistas materializadas como objeto** — trampa que
[[1.06.01 - Vistas|Vistas]] ya documenta (slide 20 de la Clase 07) y que deja abierta esta duda: *"¿Entran
las vistas materializadas en el parcial, si MySQL no las soporta?"*. Corriendo el equivalente en
MySQL 9.7.2 apareció algo que responde parcialmente esa
duda: MySQL 9.7 **sí acepta la sintaxis `CREATE MATERIALIZED VIEW`**, pero no hace lo que su nombre
promete.

```sql
CREATE TABLE base_t (id INT PRIMARY KEY, val INT);
INSERT INTO base_t VALUES (1,10),(2,20);
CREATE MATERIALIZED VIEW mv_sum AS SELECT SUM(val) AS total FROM base_t;
SELECT * FROM mv_sum;
INSERT INTO base_t VALUES (3,30);
SELECT * FROM mv_sum;
```

Salida real:

```
total
30
total
60
```

El segundo `SELECT` sobre `mv_sum` devuelve `60`, no `30`: el valor se recalculó al vuelo después del
`INSERT`, exactamente el comportamiento de una vista **no** materializada. Confirmado además con
`SHOW CREATE TABLE mv_sum`, que la clasifica como `View` (no como tabla física) y muestra
`CREATE ALGORITHM=UNDEFINED MATERIALIZED /*(BY ENGINE=UNKNOWN)*/ ... VIEW`, con el comentario
`ENGINE=UNKNOWN` sugiriendo que el motor de almacenamiento subyacente para la materialización todavía
no está implementado en esta versión. En otras palabras: la afirmación C de esta pregunta ("tiene sus
datos puestos en disco y los busca en cada select") describiría correctamente una vista materializada
real, pero **no** lo que hoy hace `CREATE MATERIALIZED VIEW` en MySQL 9.7.2 — ahí sigue comportándose
como D ("va a buscar los datos a su tabla original"), es decir, como una vista común con un nombre
engañoso. Si el parcial 2026 pregunta por vistas materializadas en MySQL, la respuesta correcta según
esta corrida es que **MySQL no ofrece vistas materializadas funcionales**, aunque la sintaxis exista y
no tire error.

### Pregunta 4 — sintaxis para crear una tabla en HBase

> Seleccionar la opción correcta. ¿Cuál es la sentencia para crear la siguiente tabla "formas"? (no
> importa exactamente el nombre de las column family es anecdótico, mientras que las respuestas se
> adapten a esos nombres)
>
> | | Key | Column Family "colores" | Column Family "figura" |
> | --- | --- | --- | --- |
> | Row 1 | 1 | "Verde" "Rojo" | "Triángulo" |
> | Row 2 | 2 | algoalgo (no importa mucho lo que había adentro) | "Cuadrado" |
>
> A) Create 'formas', 'colores', 'figura'
> B) Create 'formas', 'colores'
> C) Create 'formas', 'key', 'colores', 'figura'
> D) Create 'formas', 'key', 'colores'

**Respuesta de la fuente (versión corta): A.** Razona que la sintaxis básica de creación en HBase
pide el nombre de la tabla seguido de todas las *column families*, y que la clave de fila (Key) es
implícita —no se declara como argumento del `create`—, por lo que las opciones C y D, que incluyen
`'key'` como argumento, están mal. La versión larga trae la pregunta pero no una respuesta aparte.

**Resolución del vault — (fuera del temario 2026), confirmado contra el libro y con el ejemplo del
enunciado tomado casi literal del propio libro.** *Seven Databases in Seven Weeks* 2ª ed., cap. 3
(HBase), § *Creating a Table* (impresa 60): el ejemplo del shell es

```
hbase> create 'wiki', 'text'
```

— tabla seguida de sus *column families*, sin argumento de clave de fila. Más aún, la figura de
ejemplo de esa misma sección (impresa 59, § *Creating a Table*) usa dos *column families* llamadas
literalmente **"color"** y **"shape"**, con valores de ejemplo `"red"`, `"blue"`, `"yellow"` y
`"square"`, `"triangle"` — la tabla del examen ("colores": Verde/Rojo, "figura": Triángulo/Cuadrado)
es una traducción casi directa de ese mismo ejemplo del libro. Con esa confirmación, la sintaxis real
es en minúscula (`create`, no `Create`) pero de las cuatro opciones dadas, **A) es la única
sintácticamente correcta**: tabla + *column families*, sin declarar la clave.

### Pregunta 5 — Redis Sentinel

> (Cómo se lo acuerda) Decidir si las siguientes afirmaciones son verdaderas o falsas, y
> justificarlas en este último caso.
>
> A) Sentinel Redis es un proveedor de configuración, le informa al usuario dónde está (no me
>    acuerdo que era exactamente) el nodo master.
> B) Sentinel Redis vigila el estado de los Master Nodes y Slave Nodes.
> C) Cuando un Master Node falla, el administrador de Redis Sentinel es el que inicia el proceso de
>    failover.

Pregunta idéntica a la pregunta 6 del [[Final 1Jul2025|final 1Jul2025]] (mismas tres afirmaciones
A/B/C sobre Sentinel como proveedor de configuración, vigilancia de masters/réplicas, e inicio del
failover). La versión larga trae aquí solo el enunciado; la versión corta repite la misma respuesta
que dio para el final anterior: A y B verdaderas, C falsa.

**Resolución del vault:** ver [[Final 1Jul2025]] § Pregunta 6, que desarrolla la respuesta completa
—con la cita a la documentación oficial de Redis Sentinel sobre quorum y elección de líder— para no
duplicarla acá.

## Qué enseña para el parcial 2026

- El hallazgo de esta página con más impacto directo en el parcial: `CREATE MATERIALIZED VIEW` **sí
  corre** en MySQL 9.7.2 (el motor de la cursada) pero **no materializa nada** — sigue siendo una
  vista común bajo otro nombre. Si el parcial pide "crear una vista materializada" en MySQL, la
  respuesta correcta es señalar que MySQL no la soporta de verdad, no ejecutar esa sentencia
  esperando el comportamiento de PostgreSQL.
- Las preguntas de opción múltiple sobre motores no dictados (HBase acá) suelen construirse a partir
  de ejemplos textuales del propio *Seven Databases*: la tabla de "formas" es el ejemplo de
  color/shape del capítulo 3 traducido al español. Reconocer el ejemplo original ahorra tener que
  deducir la sintaxis desde cero.
- Las preguntas de apéndice comparativo ("¿qué motor da X?") se resuelven rápido con la tabla del
  Apéndice A1 del libro (siete motores × ocho columnas de capacidades) en vez de razonar motor por
  motor desde la memoria de cada capítulo.

## Dudas abiertas

- (abierto) No se pudo confirmar si `ENGINE=UNKNOWN` en la salida de `SHOW CREATE TABLE` para
  `CREATE MATERIALIZED VIEW` significa que la funcionalidad está en desarrollo activo en MySQL 9.7 o
  si es un placeholder permanente; no se encontró documentación oficial de MySQL sobre esta sintaxis
  al momento de esta corrida.
- (abierto) Ninguna de las dos fuentes da fecha exacta, duración, modalidad ni puntaje de este final.

## Enlaces

[[Mapa de exámenes]] · [[Final 1Jul2025]] · [[Final 1Dic2025]] · [[_cronograma]] · [[_index-clases]] ·
[[1.06.01 - Vistas|Vistas]] · [[2.12.04 - Teorema CAP|Teorema CAP]] ·
[[2.12.05 - BASE y consistencia eventual|BASE y consistencia eventual]] · [[MySQL]] ·
[[Clase 07 - Vistas-Parte 2]]
