---
tipo: examen
unidad: eval
instancia: repaso
tema:
  - Documento original de las consignas de la Práctica subida por la cátedra (nueve ejercicios)
  - MongoDB — find con proyección, regex, $all, notación de punto, $mul, deleteMany, índices y aggregate
  - MongoDB — $nin con campos ausentes, $all, $elemMatch y deleteOne sobre arreglos de subdocumentos
  - Cassandra — modelado por consulta, partition key y clustering key, CREATE TABLE, INSERT y SELECT
  - Cassandra — keyspace, factor de replicación, QUORUM y ONE, tolerancia a fallas
  - Cassandra — arquitectura peer-to-peer, coordinador, gossip y multi data center
  - Cassandra — commit log, MemTable, SSTable, compactación, tombstones y filtros de Bloom
temario: actual
fuentes:
  - "raw/Examenes_Viejos/2C-26/Ejercicios tipo Parcial Bases de Datos II.pdf"
estado: procesado
resumen: "Documento de ejercicios tipo parcial (7 págs.): las nueve consignas de la Práctica subida por la cátedra, ahora en el original, más ocho ejercicios nuevos de MongoDB y Cassandra. Resueltos por el vault y corridos en MongoDB 8.3.11 y Cassandra 5.0.9."
aliases:
  - Ejercicios tipo Parcial
  - Ejercicios tipo parcial BDII
---

# Ejercicios tipo Parcial — Bases de Datos II

## Resumen general

Es un PDF de siete páginas sin fecha, autor ni puntaje, archivado el 05/10/2026, a una semana del
parcial del 13/10. Tiene dos partes. Las **páginas 1 a 4** son el documento original del que salieron
las capturas de la [[Práctica subida por la cátedra]]: las mismas nueve consignas, con los mismos DER
de Mensajería y Voluntarios y el mismo orden (vistas sobre Investigadores, consultas sobre Mensajería,
agregados con `NULL`, la consulta de Películas, teoría del MER, privilegios, MongoDB, Neo4j y
`CREATE KEYSPACE`). Esas nueve ya están resueltas y corridas en aquella página; aquí solo se mapean.

Las **páginas 5 a 7** son nuevas: *"Ejercicios adicionales"*, tres de MongoDB y cinco de Cassandra, sin
ninguna resolución. Cubren justo lo que el parcial puede tomar de la segunda mitad (Cassandra se dictó
el 28/09 y la teórica de hoy, 05/10, la continúa): `find` con proyección, `$all`, notación de punto,
`$elemMatch`, `aggregate`; y en Cassandra, modelar una tabla desde la consulta, factor de replicación y
`QUORUM`, arquitectura *peer-to-peer*, el camino de escritura, *tombstones* y filtros de Bloom.

El vault los resolvió y corrió en **MongoDB 8.3.11** y **Cassandra 5.0.9**. Las trampas: `$nin`
**incluye** los documentos sin el campo; `{marcas: ["Lenovo","Intel"]}` es igualdad exacta de arreglo,
no "contiene ambos"; un subdocumento consultado como `{proveedor: {provincia: …}}` no encuentra nada;
dos condiciones sobre un arreglo de subdocumentos sin `$elemMatch` pueden cumplirse en elementos
distintos; con RF 3, `QUORUM` son 2 réplicas, y en un único nodo falla con `Unavailable`.

> [!info] Fuente
> - **`raw/Examenes_Viejos/2C-26/Ejercicios tipo Parcial Bases de Datos II.pdf`** — 7 páginas,
>   producido con `pypdf` (unión de documentos). Las páginas 1–4 tienen el formato del documento de
>   consignas que la [[Práctica subida por la cátedra]] fotografió; las 5–7, el rótulo *"Ejercicios
>   adicionales"* y un ejercicio fechado en *"2026-10-01"*, así que son de este cuatrimestre.
> - **Origen sin confirmar.** El nombre sugiere material de la cátedra, pero el PDF no lo dice: no
>   trae logo, docente ni fecha. Se archivó en `2C-26/` por cuatrimestre.
> - **No trae respuestas.** Todo lo que sigue a cada consigna es resolución del vault.

## Mapa de temas

| Ej. | Página | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- | --- |
| 1–9 | 1–4 | Las nueve consignas de la práctica | → [[Práctica subida por la cátedra]] § Ejercicios 1–9 | U1, Clases 12–15 |
| 10 | 5 | MongoDB: `find`, regex, `$all`, punto, `$mul`, `deleteMany`, índice, `aggregate` | [[2.12.07 - CRUD y consultas en MongoDB\|CRUD y consultas]] · [[2.14.02 - Índices en MongoDB\|Índices en MongoDB]] · [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | [[Práctica 2026-09-15\|TP9]] |
| 11 | 5 | MongoDB: `$nin` y `$all` | [[2.12.07 - CRUD y consultas en MongoDB\|CRUD y consultas]] | TP9 |
| 12 | 5 | MongoDB: `$elemMatch`, `deleteOne` | [[2.13.01 - Documentos embebidos vs. referencias\|Embebidos vs. referencias]] | TP9 |
| 13 | 6 | Cassandra: tabla de mediciones por sensor y día | [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING\|Clave primaria]] · [[3.15.03 - CQL y modelado orientado a consultas\|CQL y modelado]] | [[Clase 15 - Introduccion a Cassandra\|Clase 15]] · [[Práctica 2026-09-29\|TP10]] |
| 14 | 6 | Cassandra: keyspace, RF, `QUORUM`/`ONE` | [[3.15.05 - Niveles de consistencia y QUORUM\|Consistencia y QUORUM]] | Clase 15 |
| 15 | 6 | Cassandra: arquitectura | [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación\|Arquitectura de Cassandra]] | Clase 15 |
| 16 | 7 | Cassandra: escritura y almacenamiento | [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación\|Escritura y lectura]] §§ 1–3 | Clase 15 |
| 17 | 7 | Cassandra: borrado | ídem § 5 | Clase 15 |
| 18 | 7 | Cassandra: filtros de Bloom (V/F) | ídem § 6 | Clase 15 (handout de Bloom) |

Los ejercicios del PDF no están numerados (salvo el *"Ejercicio 4"* de Películas); aquí se continúa
la numeración 1–9 de la [[Práctica subida por la cátedra]].

## Páginas 1–4: las consignas de la práctica

Coinciden palabra por palabra con las transcritas en la [[Práctica subida por la cátedra]], que tiene
la resolución manuscrita del estudiante, su corrida y la corrección del vault de cada una. Lo que este
PDF agrega:

- **Confirma el texto de las consignas** sin depender de las capturas del manuscrito, y el DER de
  Mensajería y el de Voluntarios en mejor resolución. No hay diferencias de contenido.
- **Contesta en parte la duda abierta** de aquella página sobre el origen: el documento de consignas
  existe por separado, con nueve ejercicios en este orden; sigue sin estar confirmado que sea de la
  cátedra.

---

## Páginas 5–7: ejercicios adicionales

**Corrida en MongoDB 8.3.11** (contenedor `mongo:8`, base `ejtipo_parcial`): el documento 101 de la
consigna más seis inventados para que cada caso discrimine — una notebook HP con `stock: 0`, un monitor
Samsung de Córdoba, una heladera, una notebook Apple de 2.500.000, un cable **sin `marcas` ni
`proveedor`** y una *"notebook genérica"* en minúscula con `["Intel", "Lenovo", "Generic"]`.

### Ejercicio 10 — MongoDB sobre la colección `productos`

> **Ejercicio.** Considere la colección productos:
>
> ```json
> { "_id": 101, "nombre": "Notebook Lenovo", "categoria": "Informática", "precio": 950000,
>   "stock": 12, "marcas": ["Lenovo", "Intel"],
>   "proveedor": {"nombre": "TecnoSur", "provincia": "Buenos Aires"} }
> ```
>
> A. Obtener nombre y precio de los productos de categoría "Informática" cuyo precio sea menor a
> $1.000.000. No mostrar _id.
> B. Obtener los productos cuyo nombre comience con "Note" y tengan stock mayor que 0.
> C. Obtener los productos que posean simultáneamente "Lenovo" e "Intel" dentro del arreglo marcas.
> D. Obtener los productos cuyo proveedor pertenezca a la provincia de Buenos Aires.
> E. Incrementar en un 10% el precio del producto cuyo _id es 101.
> F. Eliminar todos los productos cuyo stock sea 0.
> G. Crear un índice ascendente sobre categoria. Explique brevemente qué efecto espera sobre las
> búsquedas por categoría.
> H. Utilizando aggregate(), obtener para cada categoría la cantidad de productos y el precio promedio.

**Resolución del vault:**

```javascript
// A.
db.productos.find(
  { categoria: "Informática", precio: { $lt: 1000000 } },
  { _id: 0, nombre: 1, precio: 1 }
)
// B.
db.productos.find({ nombre: /^Note/, stock: { $gt: 0 } })
// C.
db.productos.find({ marcas: { $all: ["Lenovo", "Intel"] } })
// D.
db.productos.find({ "proveedor.provincia": "Buenos Aires" })
// E.
db.productos.updateOne({ _id: 101 }, { $mul: { precio: 1.1 } })
// F.
db.productos.deleteMany({ stock: 0 })
// G.
db.productos.createIndex({ categoria: 1 })
// H.
db.productos.aggregate([
  { $group: { _id: "$categoria", cantidad: { $sum: 1 }, precio_promedio: { $avg: "$precio" } } }
])
```

Lo que mostró la corrida, inciso por inciso:

- **A** devuelve tres documentos, solo con `nombre` y `precio`. La proyección mezcla `_id: 0` con
  inclusiones: es la única exclusión permitida en una proyección de inclusión.
- **B** devuelve Lenovo y Apple; la HP queda afuera por `stock: 0` y la *"notebook genérica"* porque
  la regex distingue mayúsculas (`/^note/i` la traería). Con `^` anclado al inicio la regex puede usar un
  índice sobre `nombre`; sin anclar, no.
- **C** devuelve la Lenovo **y la genérica**, que tiene las dos marcas en otro orden y con una tercera.
  (atención) `{ marcas: ["Lenovo", "Intel"] }` es **igualdad exacta de arreglo** (mismos elementos,
  mismo orden): en la corrida devuelve solo la 101.
- **D** con notación de punto devuelve los tres productos de Buenos Aires. (atención)
  `{ proveedor: { provincia: "Buenos Aires" } }` compara el subdocumento entero, que además tiene
  `nombre`, y devuelve **vacío**.
- **E** con `$mul` deja `1045000.0000000001`: el error de coma flotante de `double`. Si importa, el
  precio se guarda como `NumberDecimal` o en centavos enteros. `$inc: { precio: 95000 }` también
  cumple, pero fija el monto en vez de calcularlo.
- **F** borra un documento (`deletedCount: 1`, la HP). `deleteOne` borraría solo el primero.
- **G** devuelve `categoria_1`. Efecto: las búsquedas por igualdad o rango sobre `categoria` pasan de
  recorrer la colección (`COLLSCAN`) a recorrer el índice (`IXSCAN`); en la corrida, `explain` da
  `IXSCAN categoria_1` con 4 claves y 4 documentos examinados para 4 devueltos. El índice además
  sirve para ordenar por `categoria`, y se paga en cada escritura y en espacio
  ([[2.14.02 - Índices en MongoDB|Índices en MongoDB]] §§ 4–5).
- **H** (después de F) da `Accesorios 1 · 5000`, `Electrodomésticos 1 · 800000` e
  `Informática 4 · 1061250`. Es `SELECT categoria, COUNT(*), AVG(precio) … GROUP BY categoria`; el
  `$` de `"$categoria"` es lo que lo hace ruta de campo (el error de la nota manuscrita del Ejercicio 7
  de la [[Práctica subida por la cátedra]]).

### Ejercicio 11 — `$nin` contra `$all`

> **Ejercicio.** Analice la siguiente consulta:
>
> ```javascript
> db.productos.find(
>   { marcas: { $nin: ["Apple", "Samsung"] } },
>   { _id: 0, nombre: 1 }
> )
> ```
>
> A. Explique en lenguaje natural qué documentos devuelve.
> B. ¿Qué ocurre con un documento que no posee el atributo marcas?
> C. ¿Cambiaría el resultado si se reemplazara $nin por $all? Justifique.

**Resolución del vault:**

- **A.** El nombre (sin `_id`) de los productos **que no tienen ni "Apple" ni "Samsung"** entre sus
  marcas. Sobre un arreglo, `$nin` exige que **ningún** elemento esté en la lista.
- **B.** ✓ **Se devuelve.** `$nin` también selecciona los documentos que no tienen el campo. En la
  corrida aparece el *Cable USB*, que no tiene `marcas`. Para excluirlos:
  `{ marcas: { $exists: true, $nin: ["Apple", "Samsung"] } }`.
- **C.** Sí, cambia por completo. `$all` devuelve los que tienen **las dos** marcas a la vez. Pasa de
  "ninguna de las dos" a "ambas": en la corrida, de cuatro documentos a **ninguno** (ningún producto
  es Apple y Samsung a la vez), y un documento sin `marcas` nunca cumple un `$all`.

### Ejercicio 12 — `$elemMatch` sobre `exports.foods`

> **Ejercicio.** Considere una colección paises que posee un arreglo exports.foods con objetos que
> contienen los atributos name y tasty.
>
> A. Escriba una consulta que encuentre países que exporten un alimento llamado "bacon" cuyo atributo
> tasty sea false.
> B. Indique qué operador utilizaría para asegurar que ambas condiciones correspondan al mismo
> elemento del arreglo.
> C. Escriba la sentencia para eliminar un único documento que satisfaga esa condición.

Es el ejemplo de `badBacon` del slide 27 de la [[Clase 14 - MongoDB Features|Clase 14]], que el vault
ya desarrolla en [[2.12.07 - CRUD y consultas en MongoDB|CRUD y consultas en MongoDB]] § 2.1.

**Resolución del vault:**

```javascript
// A. y B.
db.paises.find({ "exports.foods": { $elemMatch: { name: "bacon", tasty: false } } })
// C.
db.paises.deleteOne({ "exports.foods": { $elemMatch: { name: "bacon", tasty: false } } })
```

**Corrida** con cuatro países: A exporta *bacon* no sabroso y *ham*; B, *bacon* sabroso y *tofu* no
sabroso; C, solo *bacon* sabroso; D, solo *bacon* no sabroso.

```text
$elemMatch                                          → A, D
"exports.foods.name": "bacon", "exports.foods.tasty": false → A, B, D
deleteOne(… $elemMatch …)  → deletedCount: 1 (borra A); quedan B, C, D
```

- **B.** `$elemMatch`. Con notación de punto cada condición se evalúa por separado sobre **cualquier**
  elemento: B entra porque tiene un *bacon* (sabroso) y otro alimento no sabroso (*tofu*). Es el
  error que la pregunta busca.
- **C.** `deleteOne` borra el primer documento que coincide en orden natural; `deleteMany` borraría A
  y D.

---

**Corrida en Cassandra 5.0.9** (contenedor `cassandra:5.0`, **un solo nodo**), con el keyspace
`sensores` del Ejercicio 14.

### Ejercicio 13 — modelar las mediciones de un sensor por día

> **Ejercicio.** Una aplicación registra mediciones de sensores con los atributos: id_sensor,
> fecha_hora, tipo, valor y ciudad. La consulta más frecuente es: "Obtener cronológicamente las
> mediciones realizadas por un sensor determinado durante un día."
>
> A. Proponga una tabla Cassandra adecuada para soportar eficientemente esta consulta.
> B. Indique cuál sería la partition key y cuál la clustering key.
> C. Escriba la sentencia CQL CREATE TABLE.
> D. Escriba una sentencia CQL para insertar una medición.
> E. Escriba la consulta CQL para obtener las mediciones del sensor S01 del día 2026-10-01, ordenadas
> cronológicamente.
> F. Explique por qué no sería conveniente resolver este escenario mediante un modelo normalizado que
> requiera JOIN.

**Resolución del vault:**

- **A.** Una tabla por consulta, `mediciones_por_sensor_dia`, con todas las columnas que la consulta
  devuelve (desnormalizada) y una columna `fecha` agregada como **balde de día**.
- **B.** Partition key **compuesta `(id_sensor, fecha)`**: todas las mediciones de un sensor en un día
  quedan en una partición, en un nodo (y sus réplicas). Clustering key **`fecha_hora`**, ascendente:
  dentro de la partición las filas se guardan ya ordenadas por hora, así que la lectura es secuencial
  y sin ordenamiento.

```sql
-- C.
CREATE TABLE mediciones_por_sensor_dia (
  id_sensor  text,
  fecha      date,
  fecha_hora timestamp,
  tipo       text,
  valor      double,
  ciudad     text,
  PRIMARY KEY ((id_sensor, fecha), fecha_hora)
) WITH CLUSTERING ORDER BY (fecha_hora ASC);

-- D.
INSERT INTO mediciones_por_sensor_dia (id_sensor, fecha, fecha_hora, tipo, valor, ciudad)
VALUES ('S01', '2026-10-01', '2026-10-01 14:30:00+0000', 'temperatura', 22.5, 'Buenos Aires');

-- E.
SELECT * FROM mediciones_por_sensor_dia
WHERE id_sensor = 'S01' AND fecha = '2026-10-01';
```

Con dos mediciones de S01 el 01/10 (insertadas 14:30 primero, 08:00 después), una del 02/10 y otra de
S02, E devuelve solo las dos del día, **08:00 antes que 14:30** aunque se insertaron al revés: el orden
lo da la clustering key, no hace falta `ORDER BY`. `ORDER BY fecha_hora DESC` también corre (invierte
el orden de clustering). Lo que el modelo **no** admite, verificado:

```text
SELECT * FROM mediciones_por_sensor_dia WHERE id_sensor = 'S01';
SELECT * FROM mediciones_por_sensor_dia WHERE ciudad = 'Rosario';
InvalidRequest: ... Cannot execute this query as it might involve data filtering ... use ALLOW FILTERING
```

Con partición compuesta hay que dar **todas** sus columnas; filtrar por una columna común exige
`ALLOW FILTERING`, otra tabla o un índice secundario
([[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria]]
§§ 3, 5 y P6, el mismo caso con balde de día).

> [!note] (nota) ¿Y `PRIMARY KEY (id_sensor, fecha_hora)`?
> También responde la consulta, con `fecha_hora >= '2026-10-01' AND fecha_hora < '2026-10-02'` como
> rango sobre la clustering key. Pero la partición de un sensor crece sin límite (todas sus mediciones
> de toda la vida en un nodo). El balde de día acota la partición y coincide con cómo se pregunta.
> Las dos se defienden; conviene escribir por qué se eligió una.

- **F.** Cassandra **no tiene `JOIN`** (ni claves foráneas): CQL lo rechaza. Además, la tabla se
  reparte por hash de la partition key entre nodos: un *join* tendría que juntar filas de varios
  nodos, que es lo que el modelo evita para escalar horizontalmente. Se modela **desde la consulta**:
  se duplica `ciudad` y `tipo` en cada medición (las escrituras son baratas y el disco también) para
  que cada lectura toque **una sola partición**
  ([[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado]] §§ 2–3).

### Ejercicio 14 — keyspace, replicación y consistencia

> **Ejercicio. Keyspace, replicación y consistencia.**
>
> A. Escriba en CQL una sentencia para crear el keyspace sensores con factor de replicación 3.
> B. Explique qué significa que el factor de replicación sea 3.
> C. Suponga Replication Factor = 3. Si una escritura utiliza QUORUM, ¿cuántas réplicas deben
> confirmar la escritura?
> D. ¿Qué ventaja podría tener ONE frente a QUORUM? ¿Y QUORUM frente a ONE?
> E. Si uno de los nodos se encuentra caído, ¿necesariamente queda indisponible la base? Justifique.

**Resolución del vault:**

```sql
-- A.
CREATE KEYSPACE sensores
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};
```

Corre, con el aviso `Your replication factor 3 for keyspace sensores is higher than the number of
nodes 1`. En producción, con varios centros de datos:
`{'class': 'NetworkTopologyStrategy', 'dc1': 3}`. El `=` después de `replication` es obligatorio (la
trampa del [[Parcial 1Q2026]] P31, en la [[Práctica subida por la cátedra]] § Ejercicio 9).

- **B.** Cada fila se guarda en **tres nodos distintos**: el dueño del token de su partición y los
  dos siguientes en el anillo (con `SimpleStrategy`). Es por *keyspace*, no por tabla.
- **C.** **2**: `QUORUM = ⌊RF / 2⌋ + 1 = ⌊3/2⌋ + 1 = 2`. En la corrida, con un solo nodo vivo:
  `Unavailable … Cannot achieve consistency level QUORUM … 'required_replicas': 2, 'alive_replicas': 1`;
  la misma lectura con `ONE` responde.
- **D.** `ONE` espera una sola confirmación: **menor latencia y más disponibilidad** (responde
  mientras quede una réplica viva). `QUORUM` espera la mayoría: **consistencia más fuerte**; si
  escritura y lectura usan `QUORUM`, `W + R = 4 > RF = 3` y toda lectura ve la última escritura
  confirmada ([[3.15.05 - Niveles de consistencia y QUORUM|Consistencia y QUORUM]] §§ 4–5).
- **E.** **No.** No hay maestro: cualquier nodo vivo coordina, y cada dato tiene otras réplicas. Con
  RF 3 y un nodo caído, `QUORUM` sigue pudiendo juntar 2 y `ONE`, 1. Las escrituras para el nodo caído
  quedan como *hints* en el coordinador (*hinted handoff*) y se entregan cuando vuelve. Solo falla una
  operación que pida más réplicas de las vivas (`ALL` con un nodo caído; `QUORUM` con dos).

### Ejercicio 15 — arquitectura de Cassandra

> **Ejercicio. Arquitectura de Cassandra.**
>
> A. Explique por qué Cassandra utiliza una arquitectura peer-to-peer.
> B. ¿Existe un nodo maestro permanente? Justifique.
> C. ¿Qué función cumple el nodo coordinador?
> D. ¿Qué función cumple el protocolo Gossip?
> E. ¿Qué ventaja aporta el soporte de múltiples data centers?

**Resolución del vault** ([[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]] §§ 1, 4, 5 y 7):

- **A.** Para no tener **punto único de falla** ni cuello de botella: todos los nodos son iguales,
  cualquiera atiende lecturas y escrituras, y agregar nodos aumenta la capacidad de forma casi lineal.
  Es la apuesta por **AP** del teorema CAP: disponibilidad y tolerancia a particiones, con consistencia
  ajustable por operación.
- **B.** **No.** Ningún nodo tiene un rol especial fijo; el anillo de tokens reparte los datos y
  cualquier nodo puede caerse sin que el clúster deje de responder (si quedan réplicas suficientes
  para el nivel pedido).
- **C.** Es el nodo que **recibe la petición del cliente** (cualquiera, elegido por el *driver*):
  calcula con el particionador qué réplicas tienen la partición, les reenvía la operación, espera
  tantas respuestas como pida el nivel de consistencia y responde. Guarda *hints* para réplicas
  caídas y, en una lectura, compara los *digests* y dispara el *read repair* si difieren.
- **D.** Es el protocolo de **difusión de estado entre pares**: cada segundo, cada nodo intercambia
  con algunos otros lo que sabe de sí y del resto (vivo o caído, carga, tokens). Así todos conocen la
  topología sin un servidor central, y se detectan fallas.
- **E.** Réplicas en **centros de datos separados** (`NetworkTopologyStrategy` con factor por DC):
  sobrevive a la caída de un DC entero, permite leer y escribir **cerca del usuario** con
  `LOCAL_QUORUM`, y separar cargas (por ejemplo, un DC para analítica).

### Ejercicio 16 — escritura y almacenamiento interno

> **Ejercicio. Escritura y almacenamiento interno.**
>
> A. Ordene Commit Log, MemTable y SSTable según su participación en una operación de escritura.
> B. ¿Cuál reside en memoria?
> C. ¿Cuál permite recuperar información ante una falla?
> D. ¿Por qué una SSTable se considera inmutable?
> E. ¿Por qué las escrituras son relativamente baratas mientras que las lecturas pueden requerir mayor
> trabajo?
> F. ¿Qué función cumple la compactación?

**Resolución del vault** ([[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura en Cassandra]] §§ 1–3):

- **A.** **Commit log → MemTable → SSTable.** La escritura se agrega al commit log (disco, secuencial),
  después a la MemTable (memoria) y se confirma; cuando la MemTable se llena, un *flush* la vuelca a
  una SSTable nueva.
- **B.** La **MemTable**.
- **C.** El **commit log**: si el nodo cae antes del *flush*, al reiniciar se reaplica y se reconstruye
  la MemTable perdida. (Las SSTables también son durables, pero solo tienen lo ya volcado.)
- **D.** Porque una vez escrita **no se modifica nunca**: una actualización o un borrado es una
  escritura nueva (en otra SSTable), con su *timestamp*. Eso hace la escritura secuencial y sin
  bloqueos.
- **E.** Escribir es **anexar** en disco y memoria, sin leer antes ni buscar dónde está la fila. Leer,
  en cambio, puede tener que juntar la misma partición desde la MemTable y **varias SSTables** y
  quedarse con el valor de *timestamp* más nuevo; los filtros de Bloom, los índices de partición y la
  caché lo atenúan.
- **F.** Fusiona varias SSTables en una nueva: une las versiones de cada fila quedándose con la más
  reciente, **descarta los tombstones vencidos** y libera espacio. Así baja la cantidad de SSTables
  que una lectura tiene que consultar.

### Ejercicio 17 — borrado en Cassandra

> **Ejercicio. Borrado en Cassandra.**
>
> A. ¿Qué ocurre internamente cuando se elimina una fila?
> B. ¿Por qué el dato no se elimina inmediatamente de una SSTable?
> C. ¿En qué momento se elimina físicamente el dato marcado como borrado?
> D. ¿Qué problema podría producir un nodo que permaneció caído durante una operación de borrado?

**Resolución del vault** (ídem § 5). Corrido: `DELETE` de la medición de las 08:00, `nodetool flush` y
`sstabledump` de la SSTable resultante.

```text
"clustering" : [ "2026-10-01 08:00:00.000Z" ],
"deletion_info" : { "marked_deleted" : "2026-10-05T13:53:30.270543Z", "local_delete_time" : "2026-10-05T13:53:30Z" },
"cells" : [ ]
```

- **A.** No se borra: se **escribe una marca de borrado, un *tombstone***, con su *timestamp*, por el
  mismo camino que cualquier escritura. En la lectura, el tombstone tapa las versiones anteriores
  (en la corrida, el `SELECT` posterior devuelve solo la de las 14:30). En el volcado de arriba la fila
  sigue en disco, sin celdas y con `deletion_info`.
- **B.** Porque las SSTables son **inmutables** (Ejercicio 16 D), y porque el borrado tiene que
  **propagarse a todas las réplicas**: si se olvidara enseguida, una réplica que conservara el dato
  viejo lo podría volver a difundir.
- **C.** En una **compactación** posterior al vencimiento del **tiempo de gracia**
  (`gc_grace_seconds`, por defecto **864000 s = 10 días**; verificado en
  `system_schema.tables` para la tabla de la corrida). Ahí se descartan el tombstone y los datos que
  tapa.
- **D.** **Resurrección del dato** (*zombie*): si el nodo vuelve después de los 10 días, cuando las
  demás réplicas ya purgaron el tombstone, su copia vieja no tiene nada que la tape y la reparación o
  el *read repair* la vuelven a propagar como si fuera vigente. Por eso se corre `nodetool repair` en
  cada nodo dentro del `gc_grace_seconds`, y un nodo caído más tiempo que eso no se reincorpora sin
  reconstruirlo.

### Ejercicio 18 — filtros de Bloom, verdadero o falso

> **Ejercicio. Filtros de Bloom.** Indique Verdadero o Falso y justifique.
>
> A. Si un Bloom Filter indica que un elemento no está en una SSTable, Cassandra puede evitar
> consultar esa SSTable.
> B. Si el Bloom Filter indica que un elemento puede estar, existe certeza de que el elemento se
> encuentra allí.
> C. El uso de Bloom Filters busca disminuir accesos innecesarios durante las lecturas.

**Resolución del vault** (ídem § 6 y el handout `Slides_Bloom_Filters_Cassandra.pdf` de la
[[Clase 15 - Introduccion a Cassandra|Clase 15]]):

- **A. Verdadero.** El filtro **no tiene falsos negativos**: si alguna de las posiciones que dan las
  funciones *hash* está en 0, la clave nunca se insertó en esa SSTable, y se la saltea sin tocar disco.
- **B. Falso.** Puede haber **falsos positivos**: las posiciones pueden estar en 1 por otras claves
  (en el handout, Juan `(2, 5, 8)` y Pedro `(2, 4, 8)` comparten bits). "Puede estar" obliga a buscar,
  y la búsqueda puede volver vacía. La tasa se configura por tabla (`bloom_filter_fp_chance`).
- **C. Verdadero.** Para eso existe: como una partición puede estar repartida en muchas SSTables, el
  filtro (en memoria) descarta las que seguro no la tienen y ahorra lecturas de disco.

---

## Qué enseña para el parcial 2026

- ★★ **Las nueve consignas de las páginas 1–4 son las de la [[Práctica subida por la cátedra]]**, y
  cinco de ellas ya volvieron en el [[Parcial 1Q2026]] y el [[Recuperatorio 1Q2026]]; se estudian allí.
- ★ **Cassandra pesa.** Cinco de los ocho ejercicios nuevos son de Cassandra, y cubren toda la Clase
  15: modelado por consulta, RF y `QUORUM`, arquitectura, camino de escritura, tombstones y Bloom.
  Las fórmulas que hay que tener a mano: `QUORUM = ⌊RF/2⌋ + 1` y `W + R > RF`.
- **MongoDB: las cuatro trampas de arreglos y subdocumentos.** `$all` contra igualdad de arreglo,
  notación de punto contra subdocumento completo, `$elemMatch` contra condiciones sueltas, y `$nin`
  que incluye a los que no tienen el campo.
- **Modelar en Cassandra es escribir primero la consulta.** La partition key sale del `WHERE` por
  igualdad; la clustering key, del orden pedido. Justificar el balde (día) y el porqué del no-`JOIN`.

## Dudas abiertas

- (abierto) El origen del PDF: ¿lo publicó la cátedra (campus, 2C 2026) o es una recopilación de
  estudiantes? Las páginas 5–7 tienen un ejemplo fechado el 01/10/2026.
- (abierto) Ejercicio 13: si la cátedra espera el balde de día `(id_sensor, fecha)` o
  `PRIMARY KEY (id_sensor, fecha_hora)` con rango; las dos corren.
- (abierto) Ejercicio 14 E y 17 D usan *hinted handoff* y `repair`, que la Clase 15 nombra; habrá que
  ver si la teórica del 05/10 los desarrolla.

## Enlaces

- [[Mapa de exámenes]] · [[Práctica subida por la cátedra]] · [[Parcial 1Q2026]] · [[Recuperatorio 1Q2026]]
- Clases y prácticas: [[Clase 12 - Introduccion a NoSQL|Clase 12]] · [[Clase 14 - MongoDB Features|Clase 14]] ·
  [[Clase 15 - Introduccion a Cassandra|Clase 15]] · [[Práctica 2026-09-15|TP9]] · [[Práctica 2026-09-29|TP10]]
- Conceptos: [[2.12.07 - CRUD y consultas en MongoDB|CRUD y consultas en MongoDB]] ·
  [[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
  [[2.13.01 - Documentos embebidos vs. referencias|Embebidos vs. referencias]] ·
  [[2.14.02 - Índices en MongoDB|Índices en MongoDB]] ·
  [[3.15.02 - Arquitectura de Cassandra — anillo peer-to-peer, particionado y replicación|Arquitectura de Cassandra]] ·
  [[3.15.03 - CQL y modelado orientado a consultas|CQL y modelado]] ·
  [[3.15.04 - Escritura y lectura en Cassandra — commit log, MemTable, SSTable y compactación|Escritura y lectura]] ·
  [[3.15.05 - Niveles de consistencia y QUORUM|Consistencia y QUORUM]] ·
  [[3.15.06 - Clave primaria en Cassandra — partition key, clustering key y ALLOW FILTERING|Clave primaria]]
- Motores: [[MongoDB]] · [[Cassandra]]
