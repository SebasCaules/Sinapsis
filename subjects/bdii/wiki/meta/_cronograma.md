---
tipo: referencia
resumen: "Transcripción del calendario oficial 2026 2C, una fila por encuentro con fecha, modalidad y tema: autoridad del vault para tema y fecha, pero no numera clases ni define unidades. Reúne parcial, recuperatorio y TPO, las diferencias con el programa (MySQL, Cassandra) y cómo ubicar un archivo nuevo."
formato: cronograma
cuatrimestre: 2026 2C
inicio: 2026-08-01
fin: 2026-11-28
fuente: "raw/Material_Catedra/programa/Cronograma 2026-2C.pdf"
---

# Cronograma 2026 2C — Base de Datos II

## Resumen general

Transcribe el calendario oficial 2026 2C, encuentro por encuentro: autoridad del vault para el tema
y la fecha, pero no numera clases ni define unidades (eso sale del deck y del path en `raw/`).
Importa porque fija las fechas de evaluación (parcial 13/10, recuperatorio 03/11, TPO con enunciado
09/11, entrega 15/11 y defensas 16, 17 y 24/11) y documenta que la materia se dicta sobre **MySQL**
—no PostgreSQL, como dice el programa—, con **Cassandra** en vez de HBase/CouchDB y 13 TPs más el
TPO en lugar de 7 + TP Especial. La primera mitad cubre SQL avanzado (vistas, índices/explain plan,
restricciones, triggers, seguridad, ACID); la segunda, NoSQL (MongoDB, Cassandra, Neo4j, Redis,
DynamoDB).

Reglas a tener presentes: una fila del calendario no es una clase (el 03/08 hubo cinco, una
asincrónica, en un solo encuentro); el número de clase sale del nombre del deck (`BD2_Clase NN`),
nunca del orden de filas ni de la fecha; las prácticas se identifican por fecha; la unidad se lee del
path, nunca se deduce del tema; y ninguna edición de *Seven Databases* cubre Cassandra (fuente:
Corbellini § 5 más documentación oficial). Para el parcial: fechas de evaluación, reparto real
MySQL/Cassandra frente al programa, y el criterio para ubicar un archivo — clase por el deck, tema y
fecha por el cronograma, unidad por el path. El formato probable del parcial sale de los exámenes
viejos, reunidos en [[Mapa de exámenes|Mapa de exámenes]].

## Qué es esta página

Transcripción de `raw/Material_Catedra/programa/Cronograma 2026-2C.pdf`.

> [!important] Qué es una "clase" — la premisa correcta
> Una **clase** es la unidad que **numera la cátedra** en el nombre del deck (`BD2_Clase NN`), no un
> día de calendario: varias clases pueden compartir fecha —ver la columna *Clases de la cátedra* del
> calendario— y alguna puede ser asincrónica (la **05**). Tampoco un mismo tema implica una sola
> clase: `Restricciones integridad-Parte 1` es la **Clase 09** y `-Parte 2`, la **Clase 10** — manda
> el número del deck, no el "Parte N". Las **prácticas no se numeran**: se identifican por **fecha**
> (`Práctica 2026-08-04`, …). Registro real, archivo por archivo, en [[_index-clases]].

> [!warning] El PDF dice "1er cuatrimestre"
> Error de la planilla: las fechas van del **1-Aug al 28-Nov-2026** (2º cuatrimestre); se ignora la
> etiqueta y se usan las fechas.

## Ritmo de la cursada

| | Día | Horario | Modalidad |
| --- | --- | --- | --- |
| **Teórica** | Lunes | 19:00–22:00 | Virtual |
| **Práctica** | Martes | 16:00–19:00 | Presencial |

Cada fila del calendario es **un encuentro**, no una clase (ver arriba).

## Calendario

Las cuatro primeras columnas son la transcripción literal del PDF: **fecha · día y hora · modalidad ·
tema**. La quinta **no está en el PDF**: la completo yo, y **solo donde vi el material**. `pendiente`
significa *todavía no se verificó*, no *no hay*.

| Fecha | Día y hora | Modalidad | Tema | Clases de la cátedra |
| --- | --- | --- | --- | --- |
| 2026-08-03 | Lunes, 19:00–22:00, Teórica | Virtual | Cronograma. Bibliografía. Evaluaciones. Grupos (máx X) · Introducción a las Bases de Datos. Repaso modelo DER. Repaso implementación del esquema de BD · Repaso de SQL, SQL Avanzado, Manejo de fechas de SQL → **Asincrónico** | **Clases 01–05** *(la 05, asincrónica)* |
| 2026-08-04 | Martes, 16:00–19:00, Práctica | Presencial | Persistencia políglota. Docker, Instalación MySQL · TP 1 - Modelos · TP 2 - Creates · TP 3 - SQLs simples | [[Práctica 2026-08-04]] |
| 2026-08-10 | Lunes, 19:00–22:00, Teórica | Virtual | Vistas · Índices / Explain Plan | **Clases 06–08** |
| 2026-08-11 | Martes, 16:00–19:00, Práctica | Presencial | TP 3 - SQLs avanzados · TP 4 - Vistas | [[Práctica 2026-08-11]] |
| 2026-08-17 | Lunes, 19:00–22:00, Teórica | Virtual | **FERIADO** | — |
| 2026-08-18 | Martes, 16:00–19:00, Práctica | Presencial | TP 5 - Explain Plan | [[Práctica 2026-08-18]] |
| 2026-08-24 | Lunes, 19:00–22:00, Teórica | Virtual | Restricciones de Integridad | **Clase 09** |
| 2026-08-25 | Martes, 16:00–19:00, Práctica | Presencial | TP 6 - Restricciones declarativas | [[Práctica 2026-08-25]] |
| 2026-08-31 | Lunes, 19:00–22:00, Teórica | Virtual | Triggers y SQL Procedural | **Clase 10** |
| 2026-09-01 | Martes, 16:00–19:00, Práctica | Presencial | TP 7 - Restricciones avanzadas | [[Práctica 2026-09-01]] |
| 2026-09-07 | Lunes, 19:00–22:00, Teórica | Virtual | Seguridad en Bases de Datos. Transacciones ACID · Implementación de matriz de roles y permisos | **Clase 11** [[Clase 11 - Seguridad-Transacciones\|Seguridad y transacciones]] *(el deck suma ocho slides de índices que el tema no anuncia)* · **Clase 11(B)** [[Clase 11(B)_Recovery_WAL_PostgreSQL_MySQL\|Recovery y WAL]] *(segundo deck de la Clase 11: durabilidad y atomicidad)* |
| 2026-09-08 | Martes, 16:00–19:00, Práctica | Presencial | TP 8 - Seguridad | [[Práctica 2026-09-08]] |
| 2026-09-14 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción a las Bases de Datos NoSQL y Tipos de Bases NoSQL · Introducción a MongoDB · MongoDB: Enfoque embebido vs Normalizado · Ejemplos con MongoDB | **Clases 12–14** *(las tres el mismo lunes; más cuatro handouts sin número)* |
| 2026-09-15 | Martes, 16:00–19:00, Práctica | Presencial | TP 9 - MongoDB Parte I | [[Práctica 2026-09-15]] |
| 2026-09-21 | Lunes, 19:00–22:00, Teórica | Virtual | **Día del Estudiante** | — |
| 2026-09-22 | Martes, 16:00–19:00, Práctica | Presencial | TP 9 - MongoDB Parte II | [[Práctica 2026-09-22\|Práctica 2026-09-22]] |
| 2026-09-28 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción a Cassandra | pendiente |
| 2026-09-29 | Martes, 16:00–19:00, Práctica | Presencial | TP 10 - Cassandra Parte I | pendiente |
| 2026-10-05 | Lunes, 19:00–22:00, Teórica | Virtual | Conceptos teóricos de Cassandra | pendiente |
| 2026-10-06 | Martes, 16:00–19:00, Práctica | Presencial | TP 10 - Cassandra Parte II | pendiente |
| 2026-10-12 | Lunes, 19:00–22:00, Teórica | Virtual | **FERIADO** | — |
| **2026-10-13** | Martes, 16:00–19:00, Práctica | Presencial | (clave) **Parcial** | — |
| 2026-10-19 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción a Neo4j | pendiente |
| 2026-10-20 | Martes, 16:00–19:00, Práctica | Presencial | TP 11 - Neo4j | pendiente |
| 2026-10-26 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción a Redis | pendiente |
| 2026-10-27 | Martes, 16:00–19:00, Práctica | Presencial | TP 12 - Redis · **Revisión Parcial** | pendiente |
| 2026-11-02 | Lunes, 19:00–22:00, Teórica | Virtual | Introducción Amazon DynamoDB | pendiente |
| **2026-11-03** | Martes, 16:00–19:00, Práctica | Presencial | (clave) **Recuperatorio Parcial** | — |
| 2026-11-09 | Lunes, 19:00–22:00, Teórica | Virtual | **Enunciado TPO** · Clase de consulta/repaso | pendiente |
| 2026-11-10 | Martes, 16:00–19:00, Práctica | Presencial | **Entrega TPO virtual (domingo 15/11 al final del día)** · **Revisión Recuperatorio Parcial** · TP 13 - Amazon DynamoDB | pendiente |
| 2026-11-16 | Lunes, 19:00–22:00, Teórica | Virtual | (clave) Presentación/Defensa TPO (X grupos) | — |
| 2026-11-17 | Martes, 16:00–19:00, Práctica | **Virtual** | (clave) Presentación/Defensa TPO (X grupos) | — |
| 2026-11-23 | Lunes, 19:00–22:00, Teórica | Virtual | **FERIADO** | — |
| 2026-11-24 | Martes, 16:00–19:00, Práctica | **Virtual** | (clave) Presentación/Defensa TPO (X grupos) | — |

> [!note] Detalles de la transcripción
> - Las tres últimas prácticas (17/11, 24/11) figuran como **Virtual**: son defensas.
> - La entrega del TPO está en la fila del martes **10/11**, pero la fecha real es el domingo
> **15/11**.
> - En feriados, parcial y defensas la columna de clases va `—`: no hay contenido nuevo que numerar.

## Fechas que importan

| Qué | Cuándo |
| --- | --- |
| **Parcial** | martes **13/10**, presencial — formato probable y temas que más se repiten en [[Mapa de exámenes\|Mapa de exámenes]] |
| **Recuperatorio** | martes **03/11**, presencial |
| **Enunciado del TPO** | lunes **09/11** |
| **Entrega del TPO** | domingo **15/11**, al final del día, virtual |
| **Defensas del TPO** | 16/11 · 17/11 · 24/11 *(por grupos)* |
| Feriados | 17/08 · 12/10 · 23/11 *(todos lunes: se pierden teóricas)* |
| Día del Estudiante | 21/09 *(lunes: se pierde teórica)* |

Las tres teóricas de feriado más el Día del Estudiante hacen **4 lunes perdidos**; la práctica del
martes nunca cae en feriado.

> [!tip] Cómo llegar al parcial del 13/10
> Los exámenes viejos muestran el formato probable: el [[Parcial 2Q2025|Parcial 2Q2025]], el más
> cercano a esta cursada, tuvo 33 preguntas en plataforma: 22 cerradas y autocalificadas (opción
> múltiple, verdadero/falso, coincidencia) y 11 de ensayo corregidas a mano, es decir, un tercio del
> examen de desarrollo. No fue un práctico domiciliario como los de 2020-2021. Antes
> del 13/10 se dicta todo lo relacional, NoSQL/MongoDB y las dos teóricas de Cassandra; Neo4j, Redis y
> DynamoDB llegan después, aunque en los exámenes viejos también aparecen. Detalle y priorización en
> [[Mapa de exámenes|Mapa de exámenes]].

## Unidades

El cronograma no habla de "unidades": `Unidad-NN` es la organización de `raw/`, y agrupa varias
clases según **dónde quedó archivado el material**, no según los temas.

> [!warning] Esta tabla mezcla lo observado con lo previsto — no confundir
> Las filas ✓ son hechos verificados; las demás son una agrupación temática tentativa, solo para
> orientarse. **Donde la previsión choque con dónde está el archivo, gana el archivo.** Registro en
> [[_index-clases]].

| Unidad | Clases | Tema |
| --- | --- | --- |
| `Unidad-01` | ✓ **01 a 11** | Intro a BD, DER, esquema lógico, DDL/alteración de tablas, consultas SQL · vistas · índices/explain plan · **restricciones de integridad** · **SQL procedural** (triggers, stored procedures, cursores) · **seguridad (usuarios, `GRANT`/`REVOKE`, roles), ACID, concurrencia y niveles de aislamiento, e índices** *(Clase 11, 07/09)* · **recovery: WAL y ARIES** *(Clase 11(B), 07/09 — segundo deck de la Clase 11, no una clase nueva)* · **6 archivos de material complementario sin número**: los dos PNG de *Ejercicios de RI* (Clase 09), el enunciado de stored procedure y dos `.sql` (Clase 10) y `ejemplo Seguridad BD.png` (Clase 11) · persistencia políglota, Docker, MySQL · **TP1–TP8** completos, TP3 SQLs simples y SQLs avanzados incluidos, y sus seis prácticas (04, 11, 18, 25/08, 01, 08/09). Todo lo relacional: 14 decks de teórica *(la Clase 05 en tres partes y la 11 en dos)* |
| `Unidad-02` | ✓ **12 a 14** | **NoSQL**: por qué surge, propiedades, CAP, BASE, taxonomía · **MongoDB**: documentos, CRUD, `aggregate`, `$lookup`, vistas, embebido vs. normalizado (1:1/1:N/N:M) · `mongosh`, índices, aggregation pipeline, MapReduce, replica sets, sharding *(14/09)* · **4 handouts sin número** (ecommerce, sharding vs. replication, MapReduce — en Clase 14) · **TP9 Parte I** y práctica del 15/09 · **TP9 Parte II** (índices y `explain()`, `$group`, índice `2d`, CAP; con `egresados.csv` y `mongoCities_fixed.json`) y práctica del 22/09. Abierta el **15/09** |
| `Unidad-03` | ✗ *(no usado)* | triggers y SQL procedural — cayeron en `Unidad-01` (Clase 09/TP6, Clase 10/TP7) |
| `Unidad-04` | ✗ *(no usado)* | seguridad, roles y permisos, ACID — cayó en `Unidad-01` |
| `Unidad-05` | ✗ *(no usado)* | NoSQL, MongoDB — cayó en `Unidad-02` |
| `Unidad-06` | *(previsto)* | Cassandra |
| `Unidad-07` | *(previsto)* | Neo4j |
| `Unidad-08` | *(previsto)* | Redis |
| `Unidad-09` | *(previsto)* | DynamoDB |
| `Unidad-10` | *(previsto)* | Enunciado, entrega y defensas del TPO |

> [!failure] La numeración de clases y la de unidades son independientes: `Unidad-01` tiene once
> clases y `Unidad-02`, tres. De siete previsiones de unidad, una acertó: seis fallaron esperando que
> cada tema nuevo abriera una unidad, y el material siguió cayendo en `Unidad-01` hasta que lo NoSQL
> abrió `Unidad-02` el 15/09. El corte real fue **relacional / NoSQL**, no uno por tema — lectura
> tentativa también para las unidades que faltan. Detalle en [[_index-clases]] § *Unidades*.

## Diferencias con el programa oficial

El cronograma es lo que **realmente se dicta**; el programa, el documento formal — no coinciden.

| | Programa | Cronograma *(lo que se dicta)* |
| --- | --- | --- |
| Motor relacional | **PostgreSQL** avanzado | **MySQL** |
| **HBase** | Contenido + TP2 | ✗ **no aparece** |
| **CouchDB** | TP4 | ✗ **no aparece** |
| **Cassandra** | Contenido, sin TP | ✓ **se dicta, con TP10 en dos clases** |
| Primera mitad | por motor, desde el TP1 PostgreSQL | **SQL avanzado sobre MySQL**: vistas, índices, explain plan, integridad, triggers, seguridad, ACID |
| Cantidad de TPs | 7 + TP Especial | **13 + TPO** |
| TP Especial | "TP Especial" | **TPO**, con enunciado el 09/11 y defensa oral |

> [!important] Cassandra, no CouchDB
> El programa dicta "Cassandra" pero copió su descripción del capítulo de CouchDB de *Seven
> Databases*: la etiqueta acierta, la descripción no. **Ninguna edición de *Seven Databases* cubre
> Cassandra.** Fuente: [[Corbellini et al (2017) - Persisting big-data — ficha|Corbellini § 5]] más
> documentación de Apache Cassandra. Ver [[_index-bibliografia]] § 3.

## Cómo ubico un archivo nuevo

1. **El número de clase lo da el nombre del deck**: `BD2_Clase 07 - Vistas-Parte 2.pdf` → **Clase
  07**. Sin número —o si es una práctica— se identifica por **fecha**: `Práctica 2026-08-11`. Sin
  número ni fecha clara, preguntarle al humano.
2. **El cronograma da el tema y la fecha**, y confirma que el deck cae donde parece — pero no dice
  cuántas clases hay ese día ni cómo se numeran.
3. **La unidad no se deduce: se lee del path** (`raw/Unidad-NN/Teorica|Practica/`).
4. Registrar en [[_index-clases]] a qué clase pertenece el archivo, actualizar § *Unidades* si
  corresponde, y mapear la bibliografía en [[_index-bibliografia]] § 2.

> [!bug] Regla a no romper
> No confundir la agrupación tentativa de § *Unidades* con dónde debe archivarse un deck, ni numerar
> clases por el orden de filas de esta tabla: **el nombre del deck decide la clase; el path decide la
> unidad; el cronograma decide el tema y la fecha, y nada más.**
