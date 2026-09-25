---
tipo: examen
unidad: eval
instancia: parcial
tema:
  - Búsqueda fonética/difusa en SQL
  - Agrupamiento en MongoDB
  - Vistas de agregación en CouchDB
  - Distancia y proximidad geoespacial
  - Modelado de grafos en Neo4j
fecha: 2021-05-18
cuatrimestre: 1Q2021
temario: anterior
fuentes:
  - raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/1Q2021.pdf
  - raw/Examenes_Viejos/Drive ITBA Informatica - 72.41/Parciales/1Q2021.docx
estado: procesado
resumen: "Parcial domiciliario 1Q2021 (18/05/2021, 6h30): noticias de Google News, GPS de una flota y mails, a importar en PostgreSQL/MongoDB/CouchDB/ElasticSearch/Neo4j. Sin solucionario; el vault resuelve en MySQL y MongoDB sobre datos de juguete y rotula el resto como no dictado aún o fuera del temario."
aliases:
  - Parcial 1Q2021
  - 1Q2021
  - Parcial mayo 2021
---

# Parcial 1Q2021 — noticias, GPS y mails en cuatro/cinco motores distintos

## Resumen general

Parcial domiciliario del primer cuatrimestre de 2021 (18/05/2021), individual, con 6 h 30 de plazo
(15:00 a 21:30) y entrega por Campus vía GoogleDoc exportado a PDF. Se aprueba con 5 de los 10 puntos
totales, repartidos en diez ejercicios sobre tres datasets: noticias del día (Google News, 1.757
filas), la actividad GPS de una flota de vehículos de empleados (VAST Challenge 2021, 685.169 filas)
y los encabezados de mails entre empleados de una compañía (VAST Challenge 2021, 1.175 filas). El
enunciado pide importar cada dataset en un conjunto de motores específico —noticias en PostgreSQL,
MongoDB, CouchDB y ElasticSearch; GPS en el motor que el alumno prefiera; mails en Neo4j y CouchDB— y
evaluar en cada uno una operación característica: búsqueda fonética (`metaphone`, *fuzzy search*),
agrupamiento con conteo, vistas map/reduce, cálculo de distancias y proximidad geoespacial, y
modelado de grafos.

Es un examen **sin solucionario**: ni el PDF ni el `.docx` traen respuestas, capturas de pantalla ni
notas de corrección, así que todo lo que aparece bajo "Resolución del vault" en esta página es
producción del vault, no de la fuente. El temario es **anterior** al de la cursada 2026: usa
PostgreSQL como motor relacional principal (la cursada 2026 usa MySQL), y evalúa CouchDB, ElasticSearch
y Neo4j, que **no** están en el programa 2026. Lo que sí es transferible al parcial del 13/10/2026 es
el patrón de cada ejercicio, no la sintaxis del motor: búsqueda aproximada de texto, agrupamiento con
conteo y top-N, y cálculo de distancias sobre coordenadas — todos aplicables a MySQL y MongoDB, los
motores que sí evalúa la cursada 2026 antes del parcial.

> [!info] Fuente
> - `1Q2021.pdf` — enunciado completo, 3 páginas. Publicado por la cátedra (Aizemberg/Rodríguez) en
>   el repositorio de exámenes viejos de estudiantes; **no** es material oficial archivado por la
>   cátedra en el campus de 2026, sino una copia que circula entre alumnos. Aporta el enunciado
>   completo, con la tabla de puntajes por ejercicio.
> - `1Q2021.docx` — la misma consigna, exportada/reconvertida a Word. Aporta el mismo texto en
>   formato editable; ningún estudiante agregó respuestas a esta copia.
>
> **Comparación PDF vs. `.docx`:** el contenido en prosa es idéntico palabra por palabra en las dos
> versiones. La única diferencia es la tabla de puntajes por ejercicio (`Ej. 1..10` / `Puntaje`): en
> el PDF trae los diez valores (`1, 1, 1, 1, 2, 1, 0.5, 0.5, 1, 1`, suma 10), y en el `.docx` la
> conversión a Word dejó la tabla con solo los encabezados `Ej.` / `Puntaje`, sin los valores de cada
> celda — un artefacto de la conversión a `.docx`, no una discrepancia de contenido real. Los
> puntajes que usa esta página salen del PDF.

## Formato

- **Diez ejercicios**, todos de resolución práctica (consultas/vistas/modelos a correr sobre un
  motor y transcribir el resultado, no *multiple choice*).
- **Puntaje total: 10 puntos** (aprueba con 5), repartidos `1, 1, 1, 1, 2, 1, 0.5, 0.5, 1, 1` en los
  ejercicios 1 a 10.
- **Duración:** 6 h 30, de 15:00 a 21:30 del 18/05/2021.
- **Modalidad:** domiciliario e individual. Entrega por Campus, en un GoogleDoc habilitado a los
  docentes con permiso de comentario, exportado a PDF al finalizar. El enunciado pide registrar la
  hora de inicio y fin de cada ejercicio y adjuntar capturas de los comandos ejecutados y de los
  resultados — condiciones de forma que no aplican a esta página, que resuelve sobre datos de
  juguete y lo dice en cada ejercicio.

## Mapa de temas

| Pregunta | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1 | Búsqueda fonética de texto (`metaphone`, PostgreSQL) | [[1.05.01 - SQL — consultas\|SQL — consultas]] *(funciones de texto; la fonética no se dicta)* | Clase 05 |
| 2 | Búsqueda difusa (*fuzzy search*) | ElasticSearch — texto plano *(fuera del temario 2026)* | — |
| 3 | Agrupamiento con conteo y top-N en MongoDB | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | Clase 14 · [[Práctica 2026-09-15\|TP9 Parte I]] |
| 4 | Vista map/reduce de conteo en CouchDB | CouchDB — texto plano *(fuera del temario 2026)* | — |
| 5 | Distancia recorrida a partir de coordenadas GPS | [[2.14.02 - Índices en MongoDB\|geoespacial en MongoDB]] *(sección de índices geoespaciales; resuelto acá en MySQL)* | [[Práctica 2026-09-22\|TP9 Parte II]] |
| 6 | Proximidad a un punto WKT | [[2.14.02 - Índices en MongoDB\|geoespacial en MongoDB]] | [[Práctica 2026-09-22\|TP9 Parte II]] |
| 7 | Conteo de nodos en un grafo | Neo4j — texto plano *(tema no dictado aún; se dicta el 19–20/10)* | — |
| 8 | Conteo de relaciones en un grafo | Neo4j — texto plano *(tema no dictado aún)* | — |
| 9 | Modelado de un grafo de mails | Neo4j — texto plano *(tema no dictado aún)* | — |
| 10 | Vista de conteo de destinatarios en CouchDB | CouchDB — texto plano *(fuera del temario 2026)* | — |

## Dataset 1 — noticias del día (Google News)

Columnas: `Title`, `Source`, `URL`, `Date`, `Category`, `Group`. 1.757 filas, con 29 registros que el
enunciado avisa que traen "algo raro" en `Source` (no especifica qué). A importar en PostgreSQL,
MongoDB, CouchDB y ElasticSearch.

### Pregunta 1 — búsqueda fonética con `metaphone` (PostgreSQL)

> (1 PUNTO) Utilizando Postgresql, buscar los títulos donde aparezca la palabra que suene parecido a
> "Bolsonoro" utilizando metaphone.

**Respuesta de la fuente:** no hay — el examen no trae solucionario.

**Resolución del vault:** `metaphone()` es una función del módulo `fuzzystrmatch` de PostgreSQL, sin
equivalente directo en MySQL. La cursada 2026 es sobre **MySQL** (`raw/Material_Catedra/…` y
[[_cronograma]]), así que esta consulta —pedida como SQL genérico de búsqueda fonética, no como una
función específica de PostgreSQL que MySQL no pueda aproximar— se resuelve acá con `SOUNDEX()`, la
función fonética nativa de MySQL. `SOUNDEX` y `metaphone` usan algoritmos distintos (Soundex es más
viejo y más tosco; metaphone modela mejor la fonética inglesa) pero comparten la idea: reducir una
palabra a un código fonético y comparar códigos en vez de cadenas.

*(propuesta propia)* — datos de juguete: 10 titulares construidos a partir de las columnas del
enunciado, tres de ellos con la palabra "Bolsonaro" en distintas posiciones del título (para probar
que la búsqueda no depende de que la palabra sea la primera).

```sql
CREATE TABLE noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(300), Source VARCHAR(100), URL VARCHAR(300),
  Date_ DATE, Category VARCHAR(100), `Group` VARCHAR(100)
);
-- 10 filas de juguete, entre ellas:
-- ('Bolsonaro anuncia nueva medida economica', 'Clarin', …)
-- ('Bolsonaro enfrenta criticas por manejo de la pandemia', 'La Nacion', …)
-- ('El presidente brasileno Bolsonaro viaja a Europa', 'Infobae', …)
-- ('Boca gano el clasico del futbol argentino', 'Ole', …)   -- control: no debe matchear
```

Como `SOUNDEX()` codifica la cadena entera y no una palabra suelta, hay que partir el título en
palabras (`SUBSTRING_INDEX` en una CTE recursiva sobre los espacios) y comparar el código de cada
palabra contra `SOUNDEX('Bolsonoro')`:

```sql
WITH RECURSIVE seq AS (SELECT 0 n UNION ALL SELECT n+1 FROM seq WHERE n<10),
palabras AS (
  SELECT n.id, n.Title,
         TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(n.Title, ' ', s.n+1), ' ', -1)) AS palabra
  FROM noticias n JOIN seq s
  WHERE s.n < (LENGTH(n.Title) - LENGTH(REPLACE(n.Title,' ',''))+1)
)
SELECT DISTINCT p.Title
FROM palabras p
WHERE SOUNDEX(p.palabra) = SOUNDEX('Bolsonoro');
```

Salida real (MySQL 9.7.2):

```
Title
Bolsonaro anuncia nueva medida economica
Bolsonaro enfrenta criticas por manejo de la pandemia
El presidente brasileno Bolsonaro viaja a Europa
```

`SOUNDEX('Bolsonaro') = SOUNDEX('Bolsonoro') = 'B4256'`: los dos códigos coinciden, así que la
consulta encuentra los tres titulares y descarta el resto (`SOUNDEX('Boca') = 'B200'`, distinto). En
PostgreSQL la resolución equivalente sería `WHERE metaphone(unnest(string_to_array(title,' ')), 8) =
metaphone('Bolsonoro', 8)`, con `unnest` para separar en palabras igual que acá.

### Pregunta 2 — búsqueda difusa en ElasticSearch

> (1 PUNTO) Utilizando ElasticSearch, buscar artículos que mencionan a "Bolsonoro" utilizando
> búsqueda difusa (fuzzy search).

**Respuesta de la fuente:** no hay.

**Resolución del vault — ElasticSearch está fuera del temario 2026.** No se corre (no verificado en el motor) y no se inventa
salida. El enfoque, sin ejecutarlo: ElasticSearch resuelve *fuzzy search* con el parámetro `fuzziness`
de una `match` query, que acepta términos a una distancia de Levenshtein (edición) configurable —
típicamente `AUTO`, que usa 1 o 2 ediciones según el largo del término:

```json
GET /noticias/_search
{
  "query": {
    "match": {
      "Title": { "query": "Bolsonoro", "fuzziness": "AUTO" }
    }
  }
}
```

Con `fuzziness: AUTO` y un término de 9 letras como "Bolsonoro", ElasticSearch admite hasta 2
ediciones, así que "Bolsonaro" (una sola sustitución de vocal) entraría. A diferencia de `metaphone`
o `SOUNDEX` —que comparan códigos fonéticos—, la distancia de edición de ElasticSearch es puramente
ortográfica: no modela cómo suena la palabra, sino cuántos caracteres hay que cambiar. Fuente:
documentación oficial, *Fuzziness* — <https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#fuzziness>.

### Pregunta 3 — agrupamiento en MongoDB

> (1 PUNTO) MongoDB. Realizar una consulta de agrupación, donde muestre el top 10 de artículos
> publicados por medio (source) ordenados de manera descendente por la cantidad de artículos
> publicados en ese dia.

**Respuesta de la fuente:** no hay.

**Resolución del vault:** *(propuesta propia)* — 11 documentos de juguete (los mismos 10 titulares de
la pregunta 1 más uno extra de `Clarin` el mismo día, para que haya un medio con 3 publicaciones el
14/05). Agrupar por `(Source, Date)` y ordenar descendente por cantidad, con
[[2.12.08 - Aggregation pipeline|`$group` + `$sort` + `$limit`]]:

```js
db.noticias.aggregate([
  { $group: { _id: { source: "$Source", date: "$Date" }, cantidad: { $sum: 1 } } },
  { $sort: { cantidad: -1 } },
  { $limit: 10 }
])
```

Salida real (MongoDB 8.3.11, colección `noticias`):

```
{ _id: { source: 'Clarin', date: '2021-05-14' }, cantidad: 3 }
{ _id: { source: 'La Nacion', date: '2021-05-14' }, cantidad: 2 }
{ _id: { source: 'Ole', date: '2021-05-14' }, cantidad: 2 }
{ _id: { source: 'Clarin', date: '2021-05-11' }, cantidad: 1 }
{ _id: { source: 'Infobae', date: '2021-05-12' }, cantidad: 1 }
{ _id: { source: 'Ambito', date: '2021-05-13' }, cantidad: 1 }
{ _id: { source: 'Infobae', date: '2021-05-13' }, cantidad: 1 }
```

(Con 11 documentos de juguete salen 7 grupos, todos por debajo del `$limit: 10`; con los 1.757 reales
el `$limit` sí recortaría.)

### Pregunta 4 — vista de conteo en CouchDB

> (1 PUNTO) CouchDB. Lo mismo que en el punto anterior, pero no hace falta que estén ordenados, la
> vista debe mostrar todos los medios y la cantidad de artículos publicados.

**Respuesta de la fuente:** no hay.

**Resolución del vault — CouchDB está fuera del temario 2026.** No se corre (no verificado en el motor). El enfoque: CouchDB agrupa con una vista map/reduce — la
función `map` emite una clave por documento y `reduce` la agrega. Acá la clave es `Source` (sin la
fecha, porque el enunciado no pide desglosar por día) y el reductor es el built-in `_count`:

```js
// map
function (doc) {
  emit(doc.Source, 1);
}
// reduce
_count
```

Consultada con `?group=true`, esta vista devuelve un documento por `Source` con la cantidad total de
artículos, sin orden garantizado — que es exactamente lo que pide el enunciado ("no hace falta que
estén ordenados"). Referencia: *Seven Databases in Seven Weeks* (2ª ed.) cap. 5 *(CouchDB)*, *Day 2:
Creating and Querying Views*, impresas 145–158.

## Dataset 2 — GPS de la flota (VAST Challenge 2021)

Columnas: `Timestamp`, `id` (vehículo), `lat`, `long`. 685.169 filas. El enunciado da libertad de
motor.

### Pregunta 5 — distancia recorrida por empleado

> (2 PUNTOS) ¿Qué distancia recorrió cada empleado con su vehículo (en km)? Entregar todas las
> consultas que tuvieron que hacer para llegar a este resultado. Nota: usar alguna de las bases de
> datos vistas en la materia.

**Respuesta de la fuente:** no hay.

**Resolución del vault — MySQL.** *(propuesta propia)* — datos de juguete: 2 vehículos (`35`, `42`),
5 y 3 puntos GPS respectivamente, con las coordenadas del punto WKT que pide la pregunta 6 puestas
como último punto de cada vehículo (para poder resolver las dos preguntas sobre el mismo dataset de
juguete). La distancia total es la suma de la distancia entre cada par de puntos consecutivos del
mismo vehículo, ordenados por tiempo. `ST_Distance_Sphere` (MySQL 9.7) calcula la distancia entre dos
`POINT` en metros sobre una esfera; `LAG()` trae el punto anterior dentro de la partición del
vehículo:

```sql
WITH pasos AS (
  SELECT vehiculo_id, Timestamp_, lat, lon,
         LAG(lat) OVER (PARTITION BY vehiculo_id ORDER BY Timestamp_) AS lat_prev,
         LAG(lon) OVER (PARTITION BY vehiculo_id ORDER BY Timestamp_) AS lon_prev
  FROM gps
)
SELECT vehiculo_id,
       ROUND(SUM(ST_Distance_Sphere(POINT(lon_prev, lat_prev), POINT(lon, lat))) / 1000, 3)
         AS km_recorridos
FROM pasos
WHERE lat_prev IS NOT NULL
GROUP BY vehiculo_id
ORDER BY km_recorridos DESC;
```

Salida real (MySQL 9.7.2, tabla `gps`):

```
vehiculo_id  km_recorridos
35           5.211
42           0.548
```

`ST_Distance_Sphere(POINT(lon, lat), …)` toma `POINT(longitud, latitud)` — el orden invertido
respecto de cómo suele leerse "lat, long" es la trampa más común de esta consulta. Con los 685.169
puntos reales, esta misma consulta (sin más cambio que la tabla de origen) da la distancia real de
cada empleado; acá se corrió sobre 8 puntos de juguete para mostrar que la lógica funciona.

### Pregunta 6 — vehículos cerca de un punto WKT

> (1 PUNTO) ¿Qué vehículos estuvieron cerca (a menos de 50 metros) de las siguiente punto WKT_GEOM ->
> Point (24.825879 36.051030) ?

**Respuesta de la fuente:** no hay.

**Resolución del vault — MySQL.** Mismos datos de juguete de la pregunta 5. Distancia mínima de cada
vehículo al punto dado, filtrando por debajo de 50 m:

```sql
SELECT vehiculo_id,
       ROUND(MIN(ST_Distance_Sphere(POINT(lon, lat), POINT(24.825879, 36.051030))), 2) AS distancia_m
FROM gps
GROUP BY vehiculo_id
HAVING distancia_m < 50
ORDER BY distancia_m;
```

Salida real:

```
vehiculo_id  distancia_m
42           0.09
35           0.77
```

Los dos vehículos de juguete entran porque el último punto de cada uno se construyó a pocos
centímetros del punto WKT dado — es un dataset armado para probar la consulta, no para reflejar
distancias reales de los 685.169 puntos del dataset original.

## Dataset 3 — mails entre empleados (VAST Challenge 2021)

Columnas: `From`, `To`, `Date`, `Subject`. 1.175 filas. El campo `To` puede traer varios
destinatarios: hay que transformar los datos antes de importar en Neo4J (un nodo por empleado). El
archivo procesado va a Neo4J; el archivo sin procesar, a CouchDB.

### Pregunta 7 — nodos de tipo "Persona"

> (0.5 PUNTOS) ¿Cuántos nodos de tipo "Persona" tiene el grafo?

**Respuesta de la fuente:** no hay.

**Resolución del vault — Neo4j (tema no dictado aún; se dicta el 19–20/10, después del parcial
del 13/10).** No se corre (no verificado en el motor). El enfoque, sin salida inventada:
cada dirección única que aparece en `From` o en cualquier posición de `To` (ya separado) se modela
como un nodo `:Persona`. Contarlos es una consulta Cypher directa:

```cypher
MATCH (p:Persona) RETURN count(p) AS cantidad;
```

Referencia de sintaxis: *Seven Databases in Seven Weeks* (2ª ed.) cap. 6 *(Neo4J)*, *Day 1: Graphs,
Cypher, and CRUD*, impresas 179–189.

### Pregunta 8 — conexiones entre "Personas"

> (0.5 PUNTOS) ¿Cuántas conexiones, entre las "Personas" tiene el grafo?

**Respuesta de la fuente:** no hay.

**Resolución del vault — Neo4j (tema no dictado aún).** Cuenta las relaciones entre nodos
`:Persona` (típicamente `:ENVIO_MAIL_A`, según cómo se modele el punto 9):

```cypher
MATCH (:Persona)-[r]-(:Persona) RETURN count(r) AS conexiones;
```

Sin datos importados en un motor real, no hay un número que reportar — reportarlo sería inventar una
salida.

### Pregunta 9 — modelar mails enviados/recibidos por empleado

> (1 PUNTO) Modelar la estructura del grafo para obtener de una forma simple, cuantos mails envió o
> recibió cada empleado. No nos interesa, ni la fecha, ni el subject del mail.

**Respuesta de la fuente:** no hay.

**Resolución del vault — Neo4j (tema no dictado aún).** *(propuesta propia)* — modelo: un nodo
`:Persona {email}` por dirección, y una relación `:ENVIO` por cada par `(From, destinatario)` de cada
fila de `To` ya separado (el enunciado pide justamente esa transformación antes de importar). Con ese
modelo, "cuántos mails envió o recibió" cada empleado es el grado del nodo, sin filtrar por dirección:

```cypher
MATCH (p:Persona)
RETURN p.email AS empleado, size((p)-[:ENVIO]-()) AS mails_enviados_o_recibidos
ORDER BY mails_enviados_o_recibidos DESC;
```

`size((p)-[:ENVIO]-())` cuenta relaciones sin importar el sentido de la flecha, que es exactamente
"envió o recibió" en una sola consulta — la alternativa de sumar `MATCH (p)-[:ENVIO]->()` y `MATCH
(p)<-[:ENVIO]-()` por separado da lo mismo pero en dos pasos.

## Dataset 3 en CouchDB

### Pregunta 10 — vista de conteo de destinatarios

> (1 PUNTO) Crear una vista que permita contar la cantidad de destinatarios que tiene cada mail,
> excluyendo a el que envía el mail.

**Respuesta de la fuente:** no hay.

**Resolución del vault — CouchDB está fuera del temario 2026.** No se corre. Enfoque: esta
vista trabaja sobre el archivo **sin procesar** (el enunciado lo dice explícitamente: "Importar el
archivo sin procesar en CouchDB"), donde `To` sigue siendo una lista sin separar. El `map` cuenta los
destinatarios de cada documento, restando el emisor si por error apareciera también en `To`:

```js
function (doc) {
  var destinatarios = doc.To.split(',').map(function(x){ return x.trim(); })
                              .filter(function(x){ return x !== doc.From; });
  emit(doc._id, destinatarios.length);
}
```

No hace falta `reduce`: la pregunta pide la cantidad por mail, no un total agregado. Referencia:
*Seven Databases in Seven Weeks* (2ª ed.) cap. 5 *(CouchDB)*, *Day 2: Creating and Querying Views*,
impresas 145–158.

## Qué enseña para el parcial 2026

- El patrón "buscar coincidencias aproximadas de texto" se repite en tres motores del examen viejo
  (`metaphone` en PostgreSQL, *fuzzy* en ElasticSearch, `SOUNDEX` acá en MySQL): para el parcial 2026
  lo que importa es la versión MySQL, `SOUNDEX()`, y su límite frente a variaciones morfológicas —
  singular vs. plural ya cambia el código (`SOUNDEX('ajuste') = 'A230'` ≠ `SOUNDEX('ajustes') =
  'A232'`, verificado en el parcial 2Q2021 de esta misma carpeta).
- "Top-N agrupado y ordenado" es el mismo ejercicio en SQL (`GROUP BY` + `ORDER BY` + `LIMIT`) y en
  MongoDB (`$group` + `$sort` + `$limit`): la resolución del vault muestra la versión MongoDB acá.
- Los ejercicios de distancia geoespacial (5 y 6) son resolubles en MySQL con `ST_Distance_Sphere` y
  funciones de ventana (`LAG`), aunque el material de la cursada 2026 no dicta funciones espaciales de
  SQL explícitamente — la trampa transferible es el orden de argumentos de `POINT(longitud, latitud)`,
  no `(latitud, longitud)`.
- CouchDB, ElasticSearch y Neo4j **no** están en el programa 2026 antes del parcial del 13/10: un
  ejercicio de examen viejo en esos motores es útil para entender el *patrón* (vistas map/reduce,
  búsqueda difusa, modelado de grafos), no para memorizar sintaxis que no se va a evaluar el 13/10.

## Dudas abiertas

- (abierto) Los 29 registros de `Source` con "algo raro" que menciona el enunciado no se pudieron
  caracterizar: la fuente no dice qué tienen de raro, y el dataset real (`gnews-2021-05-14…`) no está
  en el vault, solo se conocen sus columnas por el enunciado.
- (abierto) No se pudo confirmar si "todas las consultas que tuvieron que hacer" en la pregunta 5
  esperaba una única consulta (como la de esta página) o una secuencia de pasos intermedios
  materializados en tablas — el enunciado no lo aclara y no hay solucionario que lo muestre.

## Enlaces

[[Mapa de exámenes]] · [[_cronograma]] · [[_index-clases]] · [[2.12.08 - Aggregation pipeline|Aggregation pipeline]] ·
[[2.14.02 - Índices en MongoDB|Índices en MongoDB]] · [[1.05.01 - SQL — consultas|SQL — consultas]] ·
[[Práctica 2026-09-15]] · [[Práctica 2026-09-22]] · [[Parcial 2Q2021]]
