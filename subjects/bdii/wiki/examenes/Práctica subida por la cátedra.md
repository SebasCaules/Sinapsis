---
tipo: examen
unidad: eval
instancia: repaso
tema:
  - Vistas en SQL (vista sobre vista, GROUP BY/HAVING)
  - Consultas SQL con joins, agregación, LEFT JOIN y COALESCE
  - Funciones de agregación y NULL
  - Análisis y reescritura de una consulta (DISTINCT, EXISTS)
  - Teoría — SGBD, modelo conceptual, jerarquías, entidad débil
  - Privilegios (GRANT/REVOKE, WITH GRANT OPTION, vistas)
  - MongoDB — aggregation pipeline ($group, $sort)
  - Neo4j — Cypher con caminos de longitud variable (no dictado aún en 2026 2C)
  - Cassandra — CREATE KEYSPACE (no dictado aún en 2026 2C)
temario: actual
fuentes:
  - "raw/Examenes_Viejos/Drive 72.41 - BDII - Examenes Viejos/BDII - Parciales Viejos.pdf"
estado: procesado
resumen: "Práctica de parcial que un estudiante rotula como subida por la cátedra, resuelta a mano: vistas, consultas SQL, agregados con NULL, teoría del MER, GRANT/REVOKE, MongoDB, Neo4j y Cassandra. Corrida en MySQL 9.7.2 y MongoDB 8.3.11; varias respuestas manuscritas fallan."
aliases:
  - Práctica subida por la cátedra
  - Práctica de la cátedra
  - Práctica (subida por la cátedra)
  - Práctica de parcial de la cátedra
---

# Práctica subida por la cátedra — ejercicios tipo parcial, resueltos a mano

## Resumen general

Es la última sección del manuscrito `BDII - Parciales Viejos.pdf` (páginas 10 a 13), rotulada por
quien lo escribió como *"Práctica (Subida por la cátedra)"*. Son nueve ejercicios pegados como
capturas de un documento de consignas, cada uno con su resolución manuscrita: vistas, consultas
SQL, agregados con `NULL`, el análisis de una consulta sobre Películas, teoría del modelo
conceptual, `GRANT`/`REVOKE`, un `aggregate` de MongoDB, una consulta Cypher y un `CREATE KEYSPACE`
de Cassandra. No trae fecha, puntaje ni duración.

Las consignas pueden ser de la cátedra, pero **las respuestas son de un estudiante y no están
corregidas**. Corridas en MySQL 9.7.2 y MongoDB 8.3.11, cuatro fallan tal como están escritas: la
vista A usa `in`, palabra reservada, como alias (`ERROR 1064`); la B usa un alias `v` que no declara
y la sintaxis de intervalo de PostgreSQL; el `aggregate` no llega a analizarse (escribe `_id=` en vez
de `_id:`, no cierra la etapa `$group` y no separa las etapas con coma) y, con la sintaxis arreglada,
agrupa por la cadena literal `"tipo"` en vez de por el campo `$tipo` y su `$sort` no es un documento;
y la a) de Películas da por buena una consulta que trae columnas de cinco tablas y repite películas. Las de privilegios, agregados y Cassandra son correctas; en teoría,
A y C lo son, y B y D quedan observadas.

Para el parcial del 13/10/2026 es un buen banco de ejercicios de desarrollo sobre la primera mitad:
vistas encadenadas, `HAVING COUNT(DISTINCT …)`, `LEFT JOIN` con condiciones en el `ON`, la tabla de
agregados sobre nulos, y una cadena de privilegios casi igual al ejercicio 2 del TP8. Enseña además
a leer la consigna con cuidado: "a lo sumo 3" y "dirigido" admiten más de una lectura.

> [!info] Fuente
> - **`BDII - Parciales Viejos.pdf`, páginas 10–13** — manuscrito digital (exportado desde iOS el
>   20/10/2025) de un estudiante, con tres secciones: dos parciales ([[Parcial XC-202X|Parcial XC-202X]] y
>   [[Parcial 2Q-2023|Parcial 2Q-2023]]) y esta práctica. **Nada es oficial de la cátedra**: el rótulo
>   *"Subida por la cátedra"* es del estudiante y habla del origen de las consignas, no de las
>   respuestas.
> - **Aporta:** las consignas completas como capturas del documento original (con los DER de
>   Mensajería, Voluntarios y Películas en imagen) y una resolución manuscrita de los nueve
>   ejercicios. No trae solucionario, notas de corrección ni capturas de una plataforma.
> - **Corridas del vault:** las vistas, las consultas, el agregado y la secuencia de privilegios se
>   corrieron en MySQL 9.7.2 (base propia `practica_catedra`, datos inventados para cada caso); el de
>   Películas, sobre `raw/Unidad-01/Practica/esq_peliculas.sql` con dos filas agregadas; el
>   `aggregate`, en MongoDB 8.3.11. Neo4j y Cassandra **no se verificaron en un motor**.

## Formato

- **Nueve ejercicios de desarrollo**, sin numeración propia salvo el de Películas, que la captura
  rotula *"Ejercicio 4"* (el documento original tenía otro orden). Aquí se numeran del 1 al 9 en el
  orden en que aparecen en el manuscrito.
- **Tipos:** escritura de vistas y consultas SQL (1, 2), opción múltiple con una única respuesta (3),
  análisis y reescritura de una consulta (4), preguntas de teoría (5), traducción de una secuencia en
  lenguaje natural a `GRANT`/`REVOKE` (6), traducción de SQL a MongoDB (7), lectura de Cypher (8) y
  escritura de CQL (9).
- **Puntaje, condición de aprobación, duración y modalidad:** la fuente no los dice.
- **Motor supuesto:** la consigna del Ejercicio 4 califica las tablas con el esquema
  `unc_esq_peliculas` (en la respuesta b) el estudiante escribe `unc_esq.pelicula` en el `FROM`
  principal), y la respuesta a la vista B usa `INTERVAL '30 years'`, sintaxis de PostgreSQL. La
  cursada 2026 corre sobre [[MySQL|MySQL]], y las corridas lo traducen donde hace falta.

## Mapa de temas

| Ejercicio | Tema | Concepto del vault | Clase/TP de 2026 |
| --- | --- | --- | --- |
| 1 | Vistas sobre Investigadores: `GROUP BY`/`HAVING`, vista sobre vista | [[1.06.01 - Vistas\|Vistas]] | [[Clase 06 - Vistas-Parte 1\|Clase 06]], [[Clase 07 - Vistas-Parte 2\|Clase 07]] · [[Práctica 2026-08-11\|TP4]] |
| 2 | Consultas sobre Mensajería: agregación con filtro; `LEFT JOIN` + `COALESCE` sobre jerarquía | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05]] · [[Práctica 2026-08-11\|TP3]] |
| 3 | `SUM`, `COUNT(*)` y `COUNT(col)` sobre una columna toda `NULL` (opción múltiple) | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 2\|Clase 05]] |
| 4 | ¿La consulta de Películas responde lo pedido? Reescritura con `EXISTS` | [[1.05.01 - SQL — consultas\|SQL — consultas]] | [[Clase 05 - Consultas de Datos–Parte 3\|Clase 05]] · [[Práctica 2026-08-11\|TP3]] |
| 5 | SGBD, modelo conceptual, jerarquía exclusiva y compartida, entidad débil | [[1.01.01 - Sistema gestor de bases de datos\|SGBD]] · [[1.02.02 - Modelo Entidad-Relación\|MER]] · [[1.03.01 - Derivación de MER a esquema relacional\|Derivación]] | [[Clase 01 - Introducción_BasesDeDatos\|Clase 01]], [[Clase 02 - Modelo Entidad-Relacion\|Clase 02]], [[Clase 03 - Derivación a Esquema Lógico\|Clase 03]] |
| 6 | `GRANT`/`REVOKE` sobre `REMERA`, `CLIENTE`, `VENTAS`, `VENDEDOR` y una vista | [[1.11.02 - Usuarios, privilegios y roles\|Usuarios, privilegios y roles]] | [[Clase 11 - Seguridad-Transacciones\|Clase 11]] · [[Práctica 2026-09-08\|TP8]] |
| 7 | `SELECT … GROUP BY … ORDER BY COUNT(*)` traducido a `aggregate` | [[2.12.08 - Aggregation pipeline\|Aggregation pipeline]] | [[Clase 12 - Introduccion a NoSQL\|Clases 12–14]] · [[Práctica 2026-09-15\|TP9]] |
| 8 | Cypher: amigos a 2 o 3 saltos que no son amigos directos | Neo4j (sin página) | no dictado aún (Neo4j empieza el 19/10) |
| 9 | CQL: `CREATE KEYSPACE` | Cassandra (sin página) | no dictado aún (Cassandra empieza el 28/09) |

---

### Ejercicio 1 — vistas sobre el esquema de Investigadores

> **Ejercicio.** Sea el esquema lógico de una BD de Investigadores:
>
> - **Investigador** (IdInvest, IdCateg, nombre, mail, fec_nac, horas_invest, jerarquía, ***jefe***)
> - **Categoria** (IdCateg, ***denominación***, hs_requeridas)
> - **Campus** (id_campus, nomCampus, Universidad, superficie, ***dirección***, provincia)
> - **Proyecto** (IdInvest, fecha_inicio, IdInst, ***fecha_fin***, ***desempeño***)
> - **Instituto** (IdInst, nombre, id_campus, superficieInst)
>
> Nota: fecha_fin *null* en Proyecto indica el cargo actual del investigador. Jerarquia = {senior,
> junior, master}
>
> Valores por defecto: En Investigador mail=postmaster@gmail.com, horas_invest=30, jerarquía=junior.
> Atributos que aceptan nulos están en ***negrita cursiva***
>
> Provea las sentencias SQL que permitan armar las vistas requeridas para cada inciso:
>
> A. Obtener el identificador, nombre y fecha de nacimiento de todos los investigadores que han
> dirigido proyectos en al menos 3 institutos diferentes de la provincia de Buenos Aires.
>
> B. Obtener el identificador, nombre y fecha de nacimiento de todos los investigadores que han
> dirigido proyectos en al menos 3 institutos diferentes de la provincia de Buenos Aires, y tienen
> menos de 30 años. Utilice la vista anterior.
>
> C. Obtener el identificador, nombre, y fecha de nacimiento de todos los investigadores,
> conjuntamente con los proyectos que se han dirigido, con fecha de inicio posterior al 31/12/2015.

*(En la captura, los nombres de relación y los atributos anulables van en negrita cursiva; aquí las
relaciones van en negrita y los anulables en negrita cursiva.)*

**Respuesta de la fuente (nota manuscrita):**

```sql
-- A.
CREATE VIEW proy_bsas AS
SELECT i.IdInvest, i.nombre, i.fec_nac
FROM Investigador i JOIN Proyecto p ON i.IdInvest = p.IdInvest
                    JOIN Intituto in ON in.IdInst = p.IdInst
                    JOIN Campus c ON c.id_campus = in.id_campus
WHERE i.jerarquía = 'master' AND c.provincia = 'Buenos Aires'
GROUP BY i.IdInvest, i.nombre, i.fec_nac
HAVING COUNT(DISTINCT in.IdInst) >= 3;

-- B.
CREATE VIEW proy_bsas_30 AS
SELECT v.IdInvest, v.nombre, v.fec_nac
FROM proy_bsas
WHERE v.fec_nac > (CURRENT_DATE - INTERVAL '30 years');

-- C.
CREATE VIEW inv_proy AS
SELECT i.IdInvest, i.nombre, i.fec_nac, p.IdInst, p.fecha_inicio, p.fecha_fin, p.desempeño
FROM Investigador i JOIN Proyecto p ON i.IdInvest = p.IdInvest
WHERE i.jerarquía = 'master' AND p.fecha_inicio > DATE '2015-12-31';
```

*(La nota traza la a sin el trazo final en varias palabras —`master`, `jerarquía`, el segundo
`id_campus` de la vista A— y ahí se parece a una o; se transcribe como a. El error de escritura que sí
se distingue es `Intituto`.)*

**Corrida en MySQL 9.7.2** (base `practica_catedra`; esquema con los `DEFAULT` y nulos del
enunciado; cuatro investigadores: Ana *master*, 26 años, 3 institutos de Buenos Aires; Beto *master*,
51 años, 3 institutos; Caro *senior*, 28 años, 3 institutos; Dani *master*, 3 proyectos pero solo en
2 institutos distintos de Buenos Aires).

Tal como está escrita, **la vista A no compila**, por dos motivos independientes:

```text
-- con la tabla bien escrita (Instituto) y el alias "in":
ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'in ON in.IdInst = p.IdInst
-- con el alias cambiado a "ins" pero la tabla como la escribe la nota (Intituto):
ERROR 1146 (42S02): Table 'practica_catedra.Intituto' doesn't exist
```

`IN` es palabra reservada (el operador `x IN (…)`): no sirve como alias sin comillas, ni en MySQL ni
en PostgreSQL. Con alias `ins` y la tabla `Instituto`, la vista se crea y devuelve lo esperado:

```text
SELECT * FROM proy_bsas;
+----------+--------+------------+
| IdInvest | nombre | fec_nac    |
+----------+--------+------------+
|        1 | Ana    | 2000-09-25 |
|        2 | Beto   | 1975-03-01 |
+----------+--------+------------+
```

Dani no entra aunque tiene tres proyectos en Buenos Aires: dos son en el mismo instituto, y
`COUNT(DISTINCT ins.IdInst)` vale 2. Es el punto del ejercicio: sin `DISTINCT` Dani habría entrado.

La **vista B** falla también, y por dos causas. La sintaxis de intervalo es de PostgreSQL:

```text
WHERE v.fec_nac > (CURRENT_DATE - INTERVAL '30 years')
ERROR 1064 (42000): You have an error in your SQL syntax; ... near ')' at line 4
```

Con la sintaxis de MySQL (`INTERVAL 30 YEAR`) aparece el segundo error: `v` nunca se declara como
alias de `proy_bsas`.

```text
ERROR 1054 (42S22): Unknown column 'v.IdInvest' in 'field list'
```

Con `FROM proy_bsas v` e `INTERVAL 30 YEAR` corre y devuelve solo a Ana. La condición está bien
planteada: nacer **después** de "hoy menos 30 años" es tener menos de 30.

La **vista C** corre sin cambios y devuelve una fila por proyecto (8 filas: Ana 3, Beto 2, Dani 3;
Caro queda afuera por el filtro de jerarquía).

**Resolución del vault:**

```sql
-- A. (resolución del vault)
CREATE VIEW proy_bsas AS
SELECT i.IdInvest, i.nombre, i.fec_nac
FROM Investigador i
     JOIN Proyecto  p   ON p.IdInvest   = i.IdInvest
     JOIN Instituto ins ON ins.IdInst   = p.IdInst
     JOIN Campus    c   ON c.id_campus  = ins.id_campus
WHERE c.provincia = 'Buenos Aires'
GROUP BY i.IdInvest, i.nombre, i.fec_nac
HAVING COUNT(DISTINCT ins.IdInst) >= 3;

-- B. (resolución del vault, MySQL)
CREATE VIEW proy_bsas_30 AS
SELECT v.IdInvest, v.nombre, v.fec_nac
FROM proy_bsas v
WHERE v.fec_nac > CURRENT_DATE - INTERVAL 30 YEAR;

-- C. (resolución del vault: "todos los investigadores", también los que no tienen proyectos)
CREATE VIEW inv_proy AS
SELECT i.IdInvest, i.nombre, i.fec_nac, p.IdInst, p.fecha_inicio, p.fecha_fin, p.desempeño
FROM Investigador i
     LEFT JOIN Proyecto p ON p.IdInvest = i.IdInvest
                         AND p.fecha_inicio > DATE '2015-12-31';
```

> [!warning] (atención) El filtro `jerarquía = 'master'` no está en la consigna
> El enunciado dice *"investigadores que han dirigido proyectos"*, pero el esquema no tiene ningún
> atributo que diga quién dirige: `Proyecto` es la historia de cargos de cada investigador en un
> instituto (*"fecha_fin null … indica el cargo actual"*). La nota interpreta "dirigir" como "ser
> *master*"; es una suposición, y cambia el resultado: sin ese filtro Caro (*senior*, tres institutos
> de Buenos Aires) también entra.
>
> ```text
> +----------+--------+------------+-----------+
> | IdInvest | nombre | jerarquía  | inst_bsas |
> +----------+--------+------------+-----------+
> |        1 | Ana    | master     |         3 |
> |        2 | Beto   | master     |         3 |
> |        3 | Caro   | senior     |         3 |
> +----------+--------+------------+-----------+
> ```
>
> La resolución del vault toma la lectura literal: cada fila de `Proyecto` es un proyecto que ese
> investigador dirigió. En un examen conviene **escribir el supuesto** junto a la consulta.

En C, *"todos los investigadores, conjuntamente con los proyectos"* pide también a los que no tienen
proyectos posteriores a 2015. Por eso la condición de fecha va **en el `ON` del `LEFT JOIN`**: puesta en
el `WHERE`, eliminaría las filas completadas con `NULL` y el `LEFT JOIN` volvería a comportarse como
un `JOIN`. Con una investigadora sin proyectos (Eva, creada sin `mail`, `horas_invest` ni `jerarquía`,
que tomó los tres `DEFAULT`: `postmaster@gmail.com`, `30`, `junior`) la vista devuelve 12 filas, la
última `| 5 | Eva | NULL | NULL |`.

Sobre actualizabilidad ([[1.06.01 - Vistas|Vistas]]): `information_schema.VIEWS` da `IS_UPDATABLE =
NO` para `proy_bsas` (agregación) y para `proy_bsas_30`, que hereda la restricción por estar definida
sobre ella; un `UPDATE proy_bsas_30 …` falla con `ERROR 1288 (HY000): The target table proy_bsas_30 of
the UPDATE is not updatable`. La C de la nota (`JOIN` interno) da `YES`; la del vault (`LEFT JOIN`),
`NO`.

---

### Ejercicio 2 — consultas sobre el esquema de Mensajería

> **Ejercicio.** Considerando el siguiente esquema de BD
>
> | Tabla | Columnas |
> | --- | --- |
> | `MENSAJE` | `tipo_mensaje` int PK · `cod_mensaje` int PK · `asunto` varchar(20) · `texto` varchar(50) · `fecha_envio` date |
> | `CONTIENE` | `id_adjunto` int PK FK · `tipo_mensaje` int PK FK · `cod_mensaje` int PK FK · `descargado` char(1) N |
> | `ADJUNTO` | `id_adjunto` int PK · `tamanio` int · `ubicacion` varchar(30) · `anio_creacion` date · `descripcion` char(25) N · `tipo_adj` char(1) · `tipo_mensaje` int N FK · `cod_mensaje` int N FK |
> | `Audio` | `id_adjunto` int PK FK · `duracion` int |
> | `Imagen` | `id_adjunto` int PK FK · `resolucion` int |
>
> *Nota del diagrama:* "Este esquema corresponde a un sistema de mensajería donde cada mensaje
> enviado puede contener varios archivos adjuntos y en cada caso se registra si fue descargado o no.
> Cada mensaje se identifica por un tipo y código de mensaje y además se incluye el asunto y texto del
> mismo y su fecha de envío. Los adjuntos pueden ser de imagen o audio y algunos pueden registrar el
> primer mensaje en que se los incluyó."
>
> A. Obtener el identificador de los mensajes, junto con el asunto, texto y fecha de envío, si es que
> contienen a lo sumo 3 adjuntos creados en el corriente año con tamaño menor a 50 Mb.
>
> B. Obtener todos los datos comunes de adjunto más un atributo indicando la duración o la
> resolución, según sea el adjunto de tipo audio o imagen.

*(El diagrama es una imagen; la tabla lo transcribe. `Audio` e `Imagen` cuelgan de `ADJUNTO` como
subtipos.)*

**Respuesta de la fuente (nota manuscrita):**

```sql
-- A.
SELECT m.*
FROM MENSAJE m JOIN CONTIENE c ON c.tipo_msj = m.tipo_msj AND c.cod_msj = m.cod_msj
               JOIN ADJUNTO a ON a.id_adjunto = c.id_adjunto
WHERE a.tamaño < 50 AND EXTRACT(YEAR FROM a.anio_creacion) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY m.tipo_msj, m.cod_msj, ...
HAVING COUNT(a.id_adjunto) <= 3;

-- B.
SELECT a.*, COALESCE(au.duracion, im.resolucion) AS at_especifico
FROM Adjunto a LEFT JOIN Audio au ON au.id_adjunto = a.id_adjunto
               LEFT JOIN Imagen im on im.id_adjunto = a.id_adjunto
WHERE au.id_adjunto IS NOT NULL OR im.id_adjunto IS NOT NULL;
```

La nota abrevia los nombres de columna (`tipo_msj`, `cod_msj`, `tamaño`) y deja el `GROUP BY` con
puntos suspensivos; en la corrida se usan los nombres del diagrama y se agrupa solo por la clave.

**Corrida en MySQL 9.7.2** (datos propios: el mensaje 1-1 tiene 2 adjuntos chicos de 2026; el 1-2,
4 chicos de 2026; el 1-3, ninguno; el 1-4, uno grande de 2026 y uno chico de 2024; de los ocho
adjuntos, siete son audio o imagen —tres audio y cuatro imagen— y uno no es de ningún subtipo). La A de la nota corre (MySQL acepta `m.*` agrupando
solo por la PK, por dependencia funcional) y devuelve un solo mensaje:

```text
+--------------+-------------+------------+-------+-------------+
| tipo_mensaje | cod_mensaje | asunto     | texto | fecha_envio |
+--------------+-------------+------------+-------+-------------+
|            1 |           1 | dos chicos | m11   | 2026-03-01  |
+--------------+-------------+------------+-------+-------------+
```

La B corre y devuelve 7 de los 8 adjuntos (queda afuera el que no es audio ni imagen), con
`at_especifico` = `180`, `1080`, `60`, `720`, `480`, `3600`, `2160`.

**Resolución del vault:**

> [!warning] (atención) "A lo sumo 3" incluye el cero, y el `JOIN` interno lo pierde
> Con `JOIN` y el filtro en el `WHERE`, un mensaje sin adjuntos que cumplan la condición no llega al
> `GROUP BY`, así que el `HAVING … <= 3` nunca lo evalúa. La nota responde en realidad "entre 1 y 3".
> Si "a lo sumo" incluye el cero, el filtro del adjunto va en el `ON` de un `LEFT JOIN`, y `COUNT`
> sobre una columna del lado opcional cuenta 0 donde no hubo coincidencias:

```sql
-- A. (resolución del vault, lectura "0 a 3")
SELECT m.tipo_mensaje, m.cod_mensaje, m.asunto, m.texto, m.fecha_envio
FROM MENSAJE m
     LEFT JOIN CONTIENE c ON c.tipo_mensaje = m.tipo_mensaje AND c.cod_mensaje = m.cod_mensaje
     LEFT JOIN ADJUNTO  a ON a.id_adjunto = c.id_adjunto
                         AND a.tamanio < 50
                         AND YEAR(a.anio_creacion) = YEAR(CURRENT_DATE)
GROUP BY m.tipo_mensaje, m.cod_mensaje
HAVING COUNT(a.id_adjunto) <= 3;
```

```text
+--------------+-------------+---------------------+-------+-------------+---------------------+
| tipo_mensaje | cod_mensaje | asunto              | texto | fecha_envio | adj_chicos_del_anio |
+--------------+-------------+---------------------+-------+-------------+---------------------+
|            1 |           1 | dos chicos          | m11   | 2026-03-01  |                   2 |
|            1 |           3 | sin adjuntos        | m13   | 2026-05-01  |                   0 |
|            1 |           4 | solo grandes/viejos | m14   | 2026-06-01  |                   0 |
+--------------+-------------+---------------------+-------+-------------+---------------------+
```

*(La columna `adj_chicos_del_anio` se agregó solo para la corrida.)* Las dos lecturas se defienden;
lo que se evalúa es que la elegida quede escrita. Además, la consigna pide el identificador, el
asunto, el texto y la fecha, no `m.*` (aquí coinciden porque `MENSAJE` no tiene otras columnas), y
`tamanio` es un `int` sin unidad: la comparación con `50` supone que se guarda en megabytes.

B es correcta. Dos detalles *(resolución del vault)*: `COALESCE` mezcla en una columna segundos y
píxeles, y si un adjunto figurara en `Audio` **y** en `Imagen` (nada lo impide en el esquema) mostraría
solo la duración. Un `CASE` sobre el discriminador `tipo_adj` o dos columnas separadas (`au.duracion`,
`im.resolucion`) lo hacen explícito. Es el mismo patrón de jerarquía exclusiva que la pregunta 16 del
[[Parcial 2Q2025|Parcial 2Q2025]] (`OBRA_PRIVADA`/`OBRA_CIVIL`).

---

### Ejercicio 3 — agregados sobre una columna toda `NULL` (opción múltiple)

> **Ejercicio.** Considere que la tabla tarea del esquema de Voluntarios posee 20 tuplas y suponga
> que en todas ellas el atributo min_horas es nulo. ¿Cuál sería el resultado de la siguiente
> consulta? Seleccione una única opción.
>
> ```sql
> SELECT sum(min_horas), count(*), count(min_horas) FROM tarea;
> ```
>
> A. Una tabla con la tupla (null, null, null)
>
> B. Una tabla con la tupla (0, 20, 0)
>
> C. Una tabla con la tupla (0, 20, 20)
>
> D. Una tabla con la tupla (null, 20, 0)
>
> E. Ninguna de las opciones

*(Acompaña el DER de Voluntarios: `tarea(nombre_tarea, min_horas N, id_tarea PK, max_horas N)`, el
mismo esquema del [[Práctica 2026-09-08|TP8]].)*

**Respuesta de la fuente (nota manuscrita):** *"Se obtiene la opción D"*: `SUM` devuelve `NULL`
porque todas las filas son nulas, `COUNT(*)` devuelve 20 por las 20 filas y `COUNT(min_horas)` cuenta
los no nulos, que son 0.

**Corrida en MySQL 9.7.2** (20 filas con `min_horas` en `NULL`):

```text
+----------------+----------+------------------+
| sum(min_horas) | count(*) | count(min_horas) |
+----------------+----------+------------------+
|           NULL |       20 |                0 |
+----------------+----------+------------------+
```

**Resolución del vault:** ✓ **D**, confirmada. Es la tabla de [[1.05.01 - SQL — consultas|SQL — consultas]] § *`COUNT(*)` vs. `COUNT(col)`*: los agregados sobre una columna ignoran los nulos, y
cuando no queda ningún valor `SUM` (y también `AVG`, `MIN`, `MAX`) devuelve `NULL`, no 0; solo `COUNT`
devuelve 0. La trampa es la opción B, que confunde "suma de nada" con cero. Lo mismo pasa con una
tabla vacía: `WHERE 1 = 0` da `(NULL, 0, 0)`.

---

### Ejercicio 4 — ¿la consulta de Películas responde lo pedido?

> **Ejercicio 4.** La siguiente consulta sobre el esquema de Películas debería *"listar los datos
> completos de las películas con género Drama entregadas por un distribuidor nacional que no tenga
> distribuidor mayorista"*
>
> ```sql
> SELECT * FROM unc_esq_peliculas.pelicula p
> JOIN unc_esq_peliculas.renglon_entrega re ON (p.codigo_pelicula = re.codigo_pelicula)
> JOIN unc_esq_peliculas.entrega e ON (re.nro_entrega = e.nro_entrega)
> JOIN unc_esq_peliculas.distribuidor d ON (e.id_distribuidor = d.id_distribuidor)
> JOIN unc_esq_peliculas.nacional n ON (e.id_distribuidor = n.id_distribuidor)
> WHERE p.genero LIKE 'Drama%' AND n.id_distrib_mayorista IS NULL;
> ```
>
> a) ¿La consulta responde a lo solicitado? Justifique brevemente
>
> b) ¿Se le ocurre otra forma de resolverlo? Si su respuesta es SÍ, escriba la nueva consulta.

*(Acompaña el DER de Películas —el de `esq_peliculas.sql`— con `pelicula`, `renglon_entrega`,
`entrega`, `distribuidor`, `nacional`, `internacional`, `video`, `empleado`, `departamento` y otras.)*

**Respuesta de la fuente (nota manuscrita):**

> a) *"Sí, responde con lo solicitado, porque une correctamente película-renglon-entrega-nacional y
> filtra por género y sin mayorista (id nulo). Se le podría agregar un DISTINCT al SELECT."*

```sql
-- b)  (los cuatro renglones del FROM están pegados como recorte de la consigna)
SELECT DISTINCT p.*
FROM unc_esq.pelicula p
WHERE p.genero LIKE 'Drama%'
  AND EXISTS (SELECT 1
              FROM unc_esq_peliculas.renglon_entrega re
              JOIN unc_esq_peliculas.entrega e ON (re.nro_entrega = e.nro_entrega)
              JOIN unc_esq_peliculas.distribuidor d ON (e.id_distribuidor = d.id_distribuidor)
              JOIN unc_esq_peliculas.nacional n ON (e.id_distribuidor = n.id_distribuidor)
              WHERE re.codigo_pelicula = p.codigo_pelicula
                AND n.id_dist_mayor IS NULL);
```

**Corrida en MySQL 9.7.2** sobre `esq_peliculas.sql`, cargado en una base propia (sin el prefijo
`unc_esq_peliculas.`, que en MySQL sería el nombre de una base). En el dataset los cuatro
distribuidores nacionales tienen mayorista, así que la consulta devuelve vacío; para que el caso sea
visible se dejó sin mayorista al nacional 3 (`UPDATE nacional SET id_distrib_mayorista = NULL WHERE
id_distribuidor = 3`) y se le agregó una segunda entrega de *The Shawshank Redemption* (`entrega` 8,
`renglon_entrega (8, 10002, 2)`). La consulta de la consigna devuelve **3 filas de 22 columnas**
(recortadas aquí a seis):

```text
+-----------------+--------------------------+--------+-------------+-----------------+----------------------+
| codigo_pelicula | titulo                   | genero | nro_entrega | id_distribuidor | id_distrib_mayorista |
+-----------------+--------------------------+--------+-------------+-----------------+----------------------+
|           10002 | The Shawshank Redemption | Drama  |           2 |               3 |                 NULL |
|           10002 | The Shawshank Redemption | Drama  |           8 |               3 |                 NULL |
|           10005 | Forrest Gump             | Drama  |           6 |               3 |                 NULL |
+-----------------+--------------------------+--------+-------------+-----------------+----------------------+
3 rows in set
```

La versión con `EXISTS` de la nota (con los nombres de columna del esquema) devuelve 2 filas y solo
las 6 columnas de `pelicula`.

**Resolución del vault:**

> [!warning] (atención) a) La respuesta correcta es **no, no del todo**
> Las uniones y los filtros están bien, pero `SELECT *` devuelve las columnas de las **cinco** tablas
> (22 en el dataset), no *"los datos completos de las películas"*, y la película sale **una vez por
> cada renglón de entrega** que cumple: *Shawshank* aparece dos veces. El `DISTINCT` que sugiere la
> nota no alcanza con `SELECT *`, porque las filas difieren en `nro_entrega`; hace falta
> `SELECT DISTINCT p.*`. El join con `distribuidor` sobra: `nacional` ya se une por
> `e.id_distribuidor`.

```sql
-- b) (resolución del vault: semijoin, sin duplicados ni columnas ajenas)
SELECT p.*
FROM pelicula p
WHERE p.genero = 'Drama'
  AND p.codigo_pelicula IN (SELECT re.codigo_pelicula
                            FROM renglon_entrega re
                            JOIN entrega e  ON e.nro_entrega = re.nro_entrega
                            JOIN nacional n ON n.id_distribuidor = e.id_distribuidor
                            WHERE n.id_distrib_mayorista IS NULL);
```

Devuelve las mismas 2 filas que la versión con `EXISTS`. En la b) de la nota el `DISTINCT` es
redundante: el `EXISTS` no multiplica filas de `p`. `LIKE 'Drama%'` también aceptaría un género
"Dramedia"; si el género es un valor exacto, `=` es más preciso. Es el esquema del
[[Práctica 2026-08-11|TP3]] (donde se documenta `nacional.id_distrib_mayorista`).

---

### Ejercicio 5 — preguntas de teoría: SGBD, modelo conceptual, jerarquías, entidad débil

> **Ejercicio.** Responda las siguientes preguntas:
>
> A. ¿Qué es un Sistema Gestor de Bases de Datos (SGBD)?
>
> B. ¿Qué es el modelo conceptual de datos? Indique los elementos de un DER.
>
> C. En el modelo conceptual, ¿qué diferencia hay entre una jerarquía exclusiva y una compartida?
>
> D. Defina el concepto de una entidad débil en el modelo conceptual y cómo se deriva al modelo lógico.

**Respuesta de la fuente (nota manuscrita):**

- **A.** *"Un SGBD es un sistema formado por una colección de datos interrelacionados y un conjunto
  de herramientas para acceder a dichos datos. Su principal objetivo es proporcionar una forma de
  almacenar y recuperar información de manera práctica y eficiente."*
- **B.** *"El modelo de datos es una colección de herramientas conceptuales para describir los
  datos, junto con las relaciones entre ellos, la semántica y las restricciones. En el caso de un
  DER, se tiene: Entidades, Relaciones, Atributos."*
- **C.** *"En una jerarquía exclusiva, cada entidad del supertipo puede pertenecer a un sólo subtipo
  de la jerarquía, mientras que en una compartida puede pertenecer a varios subtipos
  simultáneamente."*
- **D.** *"En las entidades débiles la identificación y existencia de un ejemplar dependen de la
  identificación y existencia de un ejemplar de otro tipo de entidad. Se deriva al modelo lógico con
  tablas cuya PK contenga una FK que referencie a otra tabla."*

**Resolución del vault:**

- **A** ✓ — coincide con la definición del slide de la [[Clase 01 - Introducción_BasesDeDatos|Clase 01]]: *"una colección de datos interrelacionados y un conjunto de programas para acceder a dichos
  datos"* ([[1.01.01 - Sistema gestor de bases de datos|Sistema gestor de bases de datos]]
  § *La definición*). La nota dice "herramientas" donde el slide dice "programas".
- **B** (atención) — la nota define **modelo de datos** (Clase 01, slide 7: *"una colección de
  herramientas conceptuales para describir los datos, las relaciones …, la semántica … y las
  restricciones"*), no **modelo conceptual**. La [[Clase 02 - Modelo Entidad-Relacion|Clase 02]]
  (slide 5) lo define como *un conjunto formal y consistente de enunciaciones generales* que
  describen las características relevantes de una situación del mundo real, independiente del motor
  (esquema conceptual, previo al lógico: [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]]). Los elementos del DER están bien: entidades, relaciones (interrelaciones) y atributos,
  los tres elementos estáticos de Chen que el deck presenta en los slides 8–9; conviene sumar las
  cardinalidades, las entidades débiles y las jerarquías ES-UN ([[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]]).
- **C** ✓ — exclusiva (disjunta): cada ejemplar del supertipo es de a lo sumo un subtipo;
  compartida (superpuesta): puede ser de varios a la vez. El deck de la Clase 02 rotula los dos
  términos pero no los define; la derivación de la [[Clase 03 - Derivación a Esquema Lógico|Clase 03]] agrega la consecuencia lógica: la exclusiva lleva **discriminador** (`tipo`) en la tabla del
  supertipo, la compartida no ([[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] § jerarquías).
- **D** (atención) — la definición es correcta; la derivación está incompleta. La PK de la tabla de
  la entidad débil es **compuesta**: su clave parcial **más** la clave de la entidad fuerte, que es a
  la vez FK. "Una PK que contenga una FK" también describe a las tablas de N:N, de multivaluados y de
  subtipos, así que no identifica a la débil ([[1.03.01 - Derivación de MER a esquema relacional|Derivación]] § *Entidad débil*, slide 22).

---

### Ejercicio 6 — roles y privilegios sobre `REMERA`, `CLIENTE`, `VENTAS` y `VENDEDOR`

> **Ejercicio. Roles y privilegios**
>
> Considere la siguiente secuencia de acciones de cesión y revocación de privilegios y tradúzcala a SQL.
>
> A. El usuario ADMIN concede al usuario U1 permisos de selección sobre la tabla REMERA con la
> posibilidad de concederlos a otros usuarios.
>
> B. El usuario ADMIN concede al usuario U2 permisos de inserción y actualización sobre las tablas
> CLIENTE y VENTAS.
>
> C. Permitir que el usuario U2 autorice al usuario U3 para que pueda insertar en la tabla VENDEDOR.
>
> D. El ADMIN le retira el privilegio de actualización sobre la tabla VENTAS al usuario U2.
>
> E. El usuario ADMIN le permite al usuario U3 consultar la vista RemerasDeportivas
>
> **Nota:** asegúrese que todas las operaciones sean permitidas.

**Respuesta de la fuente (nota manuscrita):**

```sql
-- A.
GRANT SELECT ON REMERA TO U1 WITH GRANT OPTION;
-- B.
GRANT INSERT, UPDATE ON CLIENTE TO U2;
GRANT INSERT, UPDATE ON VENTAS TO U2;
-- C.
GRANT INSERT ON VENDEDOR TO U2 WITH GRANT OPTION;
GRANT INSERT ON VENDEDOR TO U3;   -- (desde U2)
-- D.
REVOKE UPDATE ON VENTAS FROM U2;
-- E.
GRANT SELECT ON RemerasDeportivas TO U3;
```

**Corrida en MySQL 9.7.2.** Tablas propias en `practica_catedra`, la vista `RemerasDeportivas`
(`SELECT id_remera, modelo FROM REMERA WHERE categoria = 'deportiva'`, creada por root) y cuatro
cuentas de prueba (`ADMIN_pcat`, `U1_pcat`, `U2_pcat`, `U3_pcat`, todas `@'%'`), **borradas al
terminar** con `DROP USER`. Para cumplir la nota *"asegúrese que todas las operaciones sean
permitidas"* hay que simular al dueño, porque MySQL no tiene *owner* de objetos: root le da a ADMIN
`GRANT ALL PRIVILEGES ON practica_catedra.* … WITH GRANT OPTION`. Cada sentencia se ejecutó **en la
sesión del usuario que la emite** (ADMIN, o U2 en el segundo paso de C). Las cinco de la nota corren.

Antes del paso C, U2 no puede ceder nada, y después de C puede ceder `INSERT` sobre `VENDEDOR` pero no
sobre `CLIENTE`, aunque también tiene `INSERT` ahí:

```text
-- U2, antes de C:   GRANT INSERT ON VENDEDOR TO 'U3_pcat'@'%';
ERROR 1142 (42000): INSERT, GRANT command denied to user 'U2_pcat'@'localhost' for table 'VENDEDOR'
-- U2, después de C: GRANT INSERT ON CLIENTE TO 'U3_pcat'@'%';
ERROR 1142 (42000): GRANT command denied to user 'U2_pcat'@'localhost' for table 'CLIENTE'
```

`REVOKE … CASCADE`, obligatorio en el estándar, no existe en MySQL:

```text
REVOKE UPDATE ON VENTAS FROM 'U2_pcat'@'%' CASCADE;
ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'CASCADE' at line 1
```

Estado final (`SHOW GRANTS` desde root, sin la línea `GRANT USAGE ON *.*` de cada cuenta):

```text
GRANT ALL PRIVILEGES ON `practica_catedra`.* TO `ADMIN_pcat`@`%` WITH GRANT OPTION
GRANT SELECT ON `practica_catedra`.`REMERA` TO `U1_pcat`@`%` WITH GRANT OPTION
GRANT INSERT, UPDATE ON `practica_catedra`.`CLIENTE` TO `U2_pcat`@`%`
GRANT INSERT ON `practica_catedra`.`VENDEDOR` TO `U2_pcat`@`%` WITH GRANT OPTION
GRANT INSERT ON `practica_catedra`.`VENTAS` TO `U2_pcat`@`%`
GRANT SELECT ON `practica_catedra`.`RemerasDeportivas` TO `U3_pcat`@`%`
GRANT INSERT ON `practica_catedra`.`VENDEDOR` TO `U3_pcat`@`%`
```

`mysql.tables_priv` registra además quién concedió cada uno: el `INSERT` de U3 sobre `VENDEDOR` tiene
`Grantor = U2_pcat@localhost`; todos los demás, `ADMIN_pcat@localhost`. Las pruebas de uso:

```text
-- U3: SELECT * FROM RemerasDeportivas;   → 2 filas (Dry-fit, Running)
-- U3: SELECT * FROM REMERA;
ERROR 1142 (42000): SELECT command denied to user 'U3_pcat'@'localhost' for table 'REMERA'
-- U3: INSERT INTO VENDEDOR VALUES (2,'Nora');   → Query OK, 1 row affected
-- U2: UPDATE VENTAS SET monto = 1 WHERE id_venta = 1;
ERROR 1142 (42000): UPDATE command denied to user 'U2_pcat'@'localhost' for table 'VENTAS'
-- U2: INSERT INTO VENTAS VALUES (2,1,3,1,12000.00);   → Query OK (el INSERT sigue)
```

**Resolución del vault:** ✓ la traducción de la nota es correcta, y en el ítem C es la misma de la
[[Práctica 2026-09-08|Práctica 2026-09-08]] § *2.c*: para que U2 autorice un `INSERT` tiene que
**tenerlo con opción de concesión**, así que son dos sentencias de dos usuarios distintos. Lo que
separa la teoría de MySQL ([[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]]
§ 6 y § 7):

- **D en SQL estándar** exige `CASCADE` o `RESTRICT`: `REVOKE UPDATE ON VENTAS FROM U2 RESTRICT;`.
  Aquí las dos dan lo mismo, porque U2 nunca cedió el `UPDATE` sobre `VENTAS` (no tenía opción de
  concesión). En MySQL la sentencia va sin cláusula; con `CASCADE` es error de sintaxis.
- **La marca de concesión es por tabla en MySQL, por privilegio en el estándar.** En este ejercicio no
  cambia el resultado: sobre `VENDEDOR` U2 solo tiene `INSERT`, y la marca no se extiende a `CLIENTE`
  (el `ERROR 1142` de arriba). En el TP8 sí cambiaba, porque U2 tenía además `SELECT` sobre la misma
  tabla y la marca le permitía cederlo.
- **E y la vista.** En el estándar, el dueño de la vista puede conceder `SELECT` sobre ella. En MySQL
  la vista es `SQL SECURITY DEFINER` por defecto (`information_schema.VIEWS`: `DEFINER =
  root@localhost`): U3 la lee con los privilegios de quien la definió y **sin tener ninguno sobre
  `REMERA`**. Es el uso clásico de una vista como mecanismo de seguridad ([[1.06.01 - Vistas|Vistas]]).
  Redefinida como `SQL SECURITY INVOKER`, la misma consulta de U3 falla: `ERROR 1356 (HY000): View
  'practica_catedra.RemerasDeportivas' references invalid table(s) or column(s) or function(s) or
  definer/invoker of view lack rights to use them`.

> [!warning] (atención) "Permisos de actualización" no alcanzan para un `UPDATE … WHERE`
> Antes del `REVOKE`, con `INSERT, UPDATE` sobre `CLIENTE` y nada más, U2 no puede ejecutar el
> `UPDATE` típico:
> ```text
> UPDATE CLIENTE SET nombre='Luis A.' WHERE id_cliente=1;
> ERROR 1143 (42000): SELECT command denied to user 'U2_pcat'@'localhost' for column 'id_cliente' in table 'CLIENTE'
> ```
> `UPDATE CLIENTE SET nombre = 'Luis A.'` (sin `WHERE`) sí corre. MySQL exige `SELECT` sobre las
> columnas que la sentencia **lee** (las del `WHERE`), además de `UPDATE` sobre las que escribe. La
> consigna no lo pide, pero en la práctica B casi siempre necesita también un `SELECT`.

---

### Ejercicio 7 — MongoDB: traducir `GROUP BY` con `ORDER BY COUNT(*)`

> **Ejercicio. MongoDB.**
>
> a) Traduzca a MongoDB la siguiente query:
>
> ```sql
> SELECT tipo, Count(*)
> FROM hospitales
> GROUP BY tipo
> ORDER BY Count(*) DESC
> ```

**Respuesta de la fuente (nota manuscrita):**

```javascript
db.hospitales.aggregate([
  {$group: {_id='tipo', count: {$sum: 1}}
  {$sort: -1}
]);
```

*(Transcripción literal. Entre `_id` y `'tipo'` la nota traza dos rayas horizontales, un `=`, distinto
de los dos puntos de `$group:`, `count:` y `$sum:`. La etapa `$group` abre tres llaves y cierra
dos.)*

**Corrida en MongoDB 8.3.11** (base propia; seis hospitales: tres `publico`, dos `privado`, uno
`universitario`). Tal como está escrita, falla antes de llegar al servidor: el analizador de mongosh
llega a `{$sort` todavía dentro del documento de la etapa `$group`, que quedó sin cerrar, y espera una
coma:

```text
SyntaxError: Unexpected token, expected "," (3:2)

  1 | db.hospitales.aggregate([
  2 |   {$group: {_id='tipo', count: {$sum: 1}}
> 3 |   {$sort: -1}
    |   ^
```

Con la llave de cierre y la coma entre etapas agregadas, el `=` sigue siendo un error de sintaxis:

```text
SyntaxError: Invalid shorthand property initializer. (2:15)
```

Con `_id:` en lugar de `_id=`, la sentencia llega al servidor, que rechaza el `$sort`:

```text
MongoServerError: the $sort key specification must be an object
```

Y el `$group` solo, sin `$sort`, muestra el último error: `'tipo'` sin `$` es una **cadena
constante**, así que todos los documentos caen en un único grupo:

```text
[ { _id: 'tipo', count: 6 } ]
```

**Resolución del vault:** (atención) la estructura es la correcta —`$group` con `$sum: 1`, después
`$sort` descendente— pero tiene cinco errores: tres de sintaxis de JavaScript (`=` en lugar de `:`
en `_id`, la llave que cierra la etapa `$group` y la coma entre las etapas) y dos del pipeline
(`'tipo'` sin `$` y `$sort` sin documento). Corregida:

```javascript
db.hospitales.aggregate([
  { $group: { _id: "$tipo", count: { $sum: 1 } } },
  { $sort:  { count: -1 } }
]);
```

```text
[
  { _id: 'publico', count: 3 },
  { _id: 'privado', count: 2 },
  { _id: 'universitario', count: 1 }
]
```

- `_id: "$tipo"`: el `$` convierte la cadena en una **ruta de campo**; es la clave de agrupamiento,
  el `GROUP BY tipo`.
- `$sort` recibe un documento `{campo: 1 | -1}`; el campo por el que se ordena es el acumulador
  `count` que creó la etapa anterior.
- Para que la salida tenga la columna `tipo` del `SELECT`, una tercera etapa
  `{ $project: { _id: 0, tipo: "$_id", count: 1 } }` devuelve `{ count: 3, tipo: 'publico' }`, etc.
- `$sortByCount: "$tipo"` hace las dos etapas en una y devuelve el mismo resultado (verificado).

Referencias: [[2.12.08 - Aggregation pipeline|Aggregation pipeline]]; Seven Databases cap. 4.3
§ *Aggregated Queries* (impresas 115–117).

---

### Ejercicio 8 — Neo4j: leer una consulta Cypher *(tema no dictado aún)*

> **Ejercicio. Neo4j.** Redacte en lenguaje natural la pregunta que le solicitan responder para
> construir la siguiente consulta:
>
> ```cypher
> MATCH (:User {name: 'Mary'})-[:FRIENDS_WITH*2..3]-(friend_of_friend:User)
> WHERE NOT (:User {name: 'Mary'})-[:FRIENDS_WITH]-(friend_of_friend)
> RETURN DISTINCT friend_of_friend.name
> ```

**Respuesta de la fuente (nota manuscrita):** *"La consulta busca obtener los nombres de amigos de
amigos y de los amigos de amigos de amigos de Mary, pero que no sean amigos directos suyos."*

**Resolución del vault:** *(tema no dictado aún: según [[_cronograma|el cronograma]], Neo4j empieza el 19/10, después
del parcial)*. ✓ La lectura de la nota es correcta: *"¿Cuáles son los nombres (sin repetir) de los
usuarios que están a dos o tres saltos de amistad de Mary y que no son sus amigos directos?"*. Cada
parte de la consulta:

- `*2..3` es un camino de **longitud variable**, entre 2 y 3 relaciones `FRIENDS_WITH`. Seven
  Databases cap. 6.3 § *Six Degrees of…* (impresa 198) presenta esta notación de estrella (`*1..2`,
  `*1..4`) y advierte que **cada salto cuenta**: allí, entre actores, un grado son dos saltos
  (actor–película–actor).
- El patrón no tiene flecha (`-[…]-`): la amistad se recorre en cualquier sentido.
- `WHERE NOT (…)-[:FRIENDS_WITH]-(friend_of_friend)` descarta a quien, además de estar a 2 o 3 saltos
  por algún camino, está a **1 salto** por otro.
- `DISTINCT` hace falta porque a una misma persona se llega por varios caminos; el recuadro *Be Wary
  of Repetition* del mismo capítulo (impresa 198) advierte que sin él el conteo sale inflado.

Dos matices *(resolución del vault, no verificados en un motor)*: si Mary está en un triángulo de amistades (Mary–A–B–Mary), un camino de 3 saltos vuelve a
ella, y como no es amiga de sí misma el `WHERE NOT` no la descarta, así que Mary aparecería en su
propio resultado. Se evita con `WHERE friend_of_friend.name <> 'Mary'` o ligando a Mary en una
variable (`(mary:User {name:'Mary'})`) y agregando `friend_of_friend <> mary`. Además, el nodo del
`WHERE` es un patrón nuevo: si hubiera dos usuarias llamadas Mary, descartaría a los amigos directos
de cualquiera de las dos.

---

### Ejercicio 9 — Cassandra: `CREATE KEYSPACE` *(tema no dictado aún)*

> **Ejercicio. Cassandra.** Escriba en CQL la sentencia correcta para crear un *keyspace*.

**Respuesta de la fuente (nota manuscrita):**

```sql
CREATE KEYSPACE my_space
WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 3};
```

**Resolución del vault:** *(tema no dictado aún: Cassandra se dicta el 28/09 y el 05/10, antes del
parcial)*. ✓ Correcta; coincide con el ejemplo de la documentación oficial de Apache Cassandra, § *CREATE
KEYSPACE* (`https://cassandra.apache.org/doc/latest/cassandra/developing/cql/ddl.html`), que usa
`WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3}`. No verificado en un motor.
Lo que conviene saber para defenderla:

- **`replication`** es la única opción obligatoria: la clase de estrategia y el factor de replicación
  (cuántas copias de cada fila guarda el clúster).
- **`SimpleStrategy`** reparte las réplicas por todo el clúster sin mirar centros de datos; la
  documentación la considera poco recomendable para producción. **`NetworkTopologyStrategy`** fija
  un factor **por centro de datos**:
  `{'class': 'NetworkTopologyStrategy', 'dc1': 3, 'dc2': 2}`.
- El nombre del *keyspace* admite solo letras, dígitos y guion bajo (hasta 48 caracteres), y no
  distingue mayúsculas salvo entre comillas dobles: `my-space`, con guion medio, fallaría.
- `IF NOT EXISTS` evita el error si ya existe.

Ninguna edición de *Seven Databases* cubre Cassandra; el respaldo bibliográfico del vault es
[[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini]] § 5, que no llega al detalle de
CQL.

---

## Qué enseña para el parcial 2026

- **Vistas encadenadas y agregación.** Una vista con `GROUP BY … HAVING COUNT(DISTINCT …)` y otra
  definida sobre ella es el formato de ejercicio más repetido de la primera mitad. Se evalúan tres
  cosas: el `DISTINCT` dentro del `COUNT`, declarar el alias de la vista base y saber que la vista
  derivada hereda la no actualizabilidad ([[1.06.01 - Vistas|Vistas]]).
- **Traducir de PostgreSQL a MySQL de memoria.** Las respuestas de estudiantes (y varios decks) usan
  `INTERVAL '30 years'`; en MySQL es `INTERVAL 30 YEAR`. Los alias que son palabras reservadas (`in`,
  `on`, `order`) rompen en los dos motores.
- **Dónde va el filtro con un `LEFT JOIN`.** En el `ON` conserva las filas sin coincidencia; en el
  `WHERE` las elimina. Aparece dos veces en esta práctica (ej. 1 C y ej. 2 A) y decide si "todos" y
  "a lo sumo" incluyen a los que no tienen nada.
- **`NULL` en agregados:** `SUM`/`AVG`/`MIN`/`MAX` de nada es `NULL`; `COUNT(col)` es 0 y `COUNT(*)`
  cuenta filas. Pregunta de opción múltiple clásica.
- **Criticar una consulta**, no solo escribirla: `SELECT *` sobre un join trae columnas de todas las
  tablas y repite filas; `DISTINCT p.*` o un semijoin (`EXISTS`/`IN`) lo resuelven.
- **Privilegios:** la cadena `GRANT … WITH GRANT OPTION` → re-concesión desde el otro usuario → `REVOKE`
  es la misma del TP8 y de la pregunta 32 del [[Parcial 2Q2025|Parcial 2Q2025]]. Hay que saber
  escribirla en SQL estándar (`CASCADE`/`RESTRICT`) y en MySQL (sin cláusula), y que conceder `SELECT`
  sobre una vista no requiere dar nada sobre la tabla base.
- **MongoDB:** el error más probable en la traducción de un `GROUP BY` es olvidar el `$` de la ruta
  de campo en `_id` y escribir `$sort` sin documento.
- **Neo4j queda después del parcial** (19/10) según el cronograma; **Cassandra**, antes (28/09 y 05/10),
  así que un `CREATE KEYSPACE` o una pregunta de replicación pueden entrar el 13/10.

## Dudas abiertas

- (abierto) Ejercicio 1: ¿qué modela *"han dirigido proyectos"*? El esquema no tiene un atributo de
  dirección; la nota lo resuelve con `jerarquía = 'master'` y el vault con la lectura literal (toda
  fila de `Proyecto`). Pregunta para el docente de práctica.
- (abierto) Ejercicio 2 A: ¿*"si es que contienen a lo sumo 3"* incluye los mensajes con 0 adjuntos
  que cumplan la condición? Y ¿en qué unidad está `tamanio`?
- (abierto) Ejercicio 6: el `ERROR 1143` (un `UPDATE … WHERE` exige `SELECT` sobre las columnas leídas)
  está verificado en MySQL 9.7.2; falta contrastar qué dice el estándar sobre el mismo caso contra la
  bibliografía (Database Systems The Complete Book cap. 10.1 o Date cap. 17.6).
- (abierto) Ejercicio 8: que Mary aparezca en su propio resultado vía un ciclo de 3 saltos es un
  razonamiento sobre la semántica de Cypher, no una corrida.
- (abierto) El origen de las consignas: el rótulo *"Subida por la cátedra"* es del estudiante; no se
  encontró el documento original en el campus ni la fecha de publicación.

## Enlaces

- [[Mapa de exámenes|Mapa de exámenes]] · [[Parcial XC-202X|Parcial XC-202X]] y
  [[Parcial 2Q-2023|Parcial 2Q-2023]] (las otras dos secciones del mismo manuscrito) ·
  [[Parcial 2Q2025|Parcial 2Q2025]]
- Clases: [[Clase 01 - Introducción_BasesDeDatos|Clase 01]] · [[Clase 02 - Modelo Entidad-Relacion|Clase 02]] ·
  [[Clase 03 - Derivación a Esquema Lógico|Clase 03]] · [[Clase 05 - Consultas de Datos–Parte 1|Clase 05 (1)]] ·
  [[Clase 05 - Consultas de Datos–Parte 2|Clase 05 (2)]] · [[Clase 05 - Consultas de Datos–Parte 3|Clase 05 (3)]] ·
  [[Clase 06 - Vistas-Parte 1|Clase 06]] · [[Clase 07 - Vistas-Parte 2|Clase 07]] ·
  [[Clase 11 - Seguridad-Transacciones|Clase 11]] · [[Clase 12 - Introduccion a NoSQL|Clase 12]] ·
  [[Clase 14 - MongoDB Features|Clase 14]]
- Prácticas: [[Práctica 2026-08-11|Práctica 2026-08-11 (TP3 y TP4)]] ·
  [[Práctica 2026-09-08|Práctica 2026-09-08 (TP8)]] · [[Práctica 2026-09-15|Práctica 2026-09-15 (TP9)]]
- Conceptos: [[1.01.01 - Sistema gestor de bases de datos|Sistema gestor de bases de datos]] ·
  [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]] ·
  [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] ·
  [[1.03.01 - Derivación de MER a esquema relacional|Derivación de MER a esquema relacional]] ·
  [[1.05.01 - SQL — consultas|SQL — consultas]] · [[1.06.01 - Vistas|Vistas]] ·
  [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] ·
  [[2.12.08 - Aggregation pipeline|Aggregation pipeline]]
- Motores: [[MySQL|MySQL]] · [[MongoDB|MongoDB]] · [[PostgreSQL|PostgreSQL]]
- Bibliografía: [[Seven Databases in Seven Weeks — ficha|Seven Databases (ficha)]] ·
  [[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini (ficha)]]
- [[_cronograma|Cronograma]]
