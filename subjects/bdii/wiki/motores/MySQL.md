---
tipo: motor
resumen: "Motor relacional de la cursada (clases 01 a 11, TPs 2 a 8), aunque buena parte de los decks está en PostgreSQL: la página traduce la sentencia del slide a lo que hay que tipear en MySQL, del setup Docker a DDL, vistas, EXPLAIN, restricciones, triggers, SQL procedural, seguridad y transacciones."
motor: MySQL
rol: motor de la cursada
version: "9.7.2"
paradigma: relacional
clases: [01, 03, 04, 05, 06, 07, 08, 09, 10, 11]
tps: [TP2, TP3, TP4, TP5, TP6, TP7, TP8]
aliases:
  - MySQL
  - MySQL 9.7.2
  - MySQL Workbench
  - Motor de la cursada
  - Setup MySQL
  - Restricciones en MySQL
  - CHECK en MySQL
  - Triggers en MySQL
  - SIGNAL SQLSTATE
  - SQL procedural en MySQL
  - Stored procedures en MySQL
  - Cursores en MySQL
  - DELIMITER
  - Seguridad en MySQL
  - Usuarios y privilegios en MySQL
  - GRANT en MySQL
  - Roles en MySQL
  - Transacciones en MySQL
  - Niveles de aislamiento en MySQL
  - InnoDB
fuentes:
  - "raw/Unidad-01/Practica/BDD II - Clase I.pdf"
  - "raw/Unidad-01/Practica/esq_peliculas.sql"
  - "raw/Unidad-01/Practica/ITBA TP 4 Vistas.pdf"
  - "raw/Unidad-01/Practica/ITBA TP 5 Explain Plan.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 01 - Introducción_BasesDeDatos.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 03 - Derivación a Esquema Lógico.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 04 - AlteraciónActualizaciónTablas.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 1.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 2.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 05 - Consultas de Datos–Parte 3.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 06 - Vistas-Parte 1.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 07 - Vistas-Parte 2.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 08 - Explicando el plan(1).pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 09 - Restricciones integridad-Parte 1.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 10 - Restricciones integridad-Parte 2.pdf"
  - "raw/Unidad-01/Practica/ITBA TP 6 Restricciones Declarativas.pdf"
  - "raw/Unidad-01/Practica/ITBA TP 7 Restricciones Avanzadas.pdf"
  - "raw/Unidad-01/Teorica/BD2_Clase 11 - Seguridad-Transacciones.pdf"
  - "raw/Unidad-01/Practica/ITBA TP 8 Seguridad.pdf"
  - "raw/Material_Catedra/programa/Cronograma 2026-2C.pdf"
estado: procesado
---

# MySQL — el motor de la cursada

## Resumen general

Esta página traduce el material teórico de la Unidad 1 —escrito mayormente en PostgreSQL, con
pasajes en Oracle y T-SQL— a lo que realmente corre en **MySQL 9.7.2**, el motor de la cursada:
las Clases 01 a 11 y los TP2 a TP8 se resuelven en Docker con MySQL Workbench Community, sobre el
dataset `esq_peliculas.sql`. Importa porque la cátedra evalúa sobre MySQL aunque enseñe con
sintaxis de otro motor: once de los trece decks de teórica traen sintaxis ajena, solo la Clase 02
queda limpia y la Clase 11 es el primer deck escrito en MySQL por defecto.

Reglas y trampas centrales: el DDL y las sentencias de cuentas (`CREATE USER`, `GRANT`, `REVOKE`)
hacen *commit* implícito, sin *rollback* posible; MySQL no tiene `ASSERTION`, `DOMAIN`, `CHECK` con
subconsulta, `FOR EACH STATEMENT` ni los tipos `%rowtype`/`%type`/`record` de PL/pgSQL, y hay que
resolver con triggers, `ENUM`, columnas repetidas o cursores explícitos; el modelo de seguridad no
tiene *owner*, `PUBLIC` ni `REVOKE … CASCADE`, y `WITH GRANT OPTION` es una marca por cuenta y
nivel, no por privilegio —una misma sentencia del TP8 tiene respuesta distinta según se conteste
desde la teoría o desde el motor—; InnoDB arranca en `REPEATABLE READ` y es multiversión, así que
un `SELECT` común no bloquea; `||` es el operador `OR` en MySQL, no concatenación (se usa
`CONCAT()`); y `DELIMITER` es un comando del cliente, imprescindible para triggers y procedimientos.

Para el parcial conviene tener a mano la tabla de equivalencias DDL/DML (§§ 1–2), el corte de las
restricciones declarativas entre tupla y tabla (§ 5) y las tres diferencias de modelo en seguridad
—*owner*, `GRANT OPTION` y `REVOKE`— (§ 7): son los puntos donde estándar y MySQL dan respuestas
distintas, y la cátedra ya lo preguntó así en tres TPs seguidos.

> [!important] El motor sobre el que se rinde, aunque los decks digan otra cosa
> El [[_cronograma]] —autoridad sobre el programa oficial— dicta **SQL avanzado sobre MySQL**; la
> contracara, qué partes del material son de PostgreSQL y por qué, está en [[PostgreSQL]]. Desde el
> 14/09 la cursada cambia a [[MongoDB]]: la Clase 11 y el TP8 cierran la mitad relacional.

---

## Por qué MySQL, si el programa dice PostgreSQL

El programa oficial de la materia dice **"PostgreSQL avanzado"**. El cronograma —lo que realmente se
dicta— dice **MySQL**. La regla del vault es que **gana el cronograma** ([[_cronograma]] § *Diferencias
con el programa oficial*).

La evidencia, junta:

| Evidencia | Motor que implica | Dónde |
| --- | --- | --- |
| *"Primera mitad: SQL avanzado sobre **MySQL**"* | MySQL | [[_cronograma]] § diferencias |
| Práctica del 04/08: `docker pull mysql:9.7.2` | MySQL | [[Práctica 2026-08-04]] |
| Herramientas a descargar: **MySQL Workbench**, **XAMPP** | MySQL | [[Clase 01 - Introducción_BasesDeDatos]] slide 2 |
| `esq_peliculas.sql` usa `ALTER TABLE … DROP FOREIGN KEY` | MySQL | `raw/Unidad-01/Practica/esq_peliculas.sql` |
| Deck 07, slide 13: lista de *"cuándo una vista en MySQL no es actualizable"* | MySQL | [[Clase 07 - Vistas-Parte 2]] |
| Programa oficial: *"PostgreSQL avanzado"* | PostgreSQL | [[_cronograma]] § diferencias |
| Decks `BD2_Clase 01`, `03`, `04`, `05` *(las tres partes)*, `07`, `08`, `09` **y `10`** | **PostgreSQL** en 01, 03, 04, 05-P1, 07, 08, 09 y 10 — **Oracle** en 05-P1 y 05-P2, y en 10 *(ver abajo)*; **T-SQL** en 05-P3 | reparto verificado slide por slide en el callout de abajo y en [[_index-clases]] § *desfasaje* · [[PostgreSQL]] § *Inventario* |
| **TP6 ej. 3.c: *"las restricciones que puedan ser soportadas por MySQL"*** | (clave) MySQL, y la cátedra lo sabe | [[Práctica 2026-08-25]] |
| **TP7 ej. 1.c y 2.b: *"aunque MySQL no lo soporta, responda según la teoría"*** | (clave) MySQL, por segunda vez por escrito | [[Práctica 2026-09-01]] |
| **Deck `BD2_Clase 11`**: slide 7 *"Mecanismos de Seguridad (MySQL)"*, slide 8, slide 38 *"Ejemplo en MySQL"*, `FLUSH PRIVILEGES` en 12–13, roles del manual en 11 | (clave) MySQL — primer deck de la U1 escrito en MySQL por defecto; su motor ajeno son dos ejemplos rotulados (slides 29–30) | [[Clase 11 - Seguridad-Transacciones]] · callout de abajo |
| **TP8 ej. 1.b y ej. 2**: *"MySQL no provee la opción CASCADE"* / *"la funcionalidad pedida"* | (clave) MySQL, por tercera vez y por escrito | [[Práctica 2026-09-08]] |

> [!bug] Inventario verificado slide por slide: qué decks traen motor ajeno
> Releídas las trece teóricas de la U1 —incluidas las imágenes, que `pdftotext` no lee—, el reparto
> es:
>
> | Deck | Motor ajeno | Dónde se ve |
> | --- | --- | --- |
> | `05 – Parte 1` | **PostgreSQL** + **Oracle** | slides 21 y 22, *"LIMIT and OFFSET (PostgreSQL)"*, `LIMIT ALL` / `OFFSET 15` · slide 35, `ERROR: aggregates not allowed in WHERE clause` *(redacción de PG)* · **slide 5, imagen**: `nombre_continente: VARCHAR2(25)`, `horas_aportadas: NUMBER(8,2)` |
> | `05 – Parte 2` | **Oracle** | **slides 4 y 8, imágenes**: diagrama de BD Voluntarios con `calle: VARCHAR2(40)`, `id_direccion: NUMBER(4)`, `nombre_institucion: VARCHAR2(60)`. En el **texto** no se nombra ningún motor |
> | `05 – Parte 3` | **T-SQL / SQL Server** *(y MySQL)* | slide 9 `SELECT top 3 nombre, apellido` · slides 14–16 `DATEPART` / `DATENAME` / `DATEDIFF` con `getdate()`, con `DATEDIFF` de **tres** argumentos · slide 5 `"rango de precios" = CASE` · slide 7 `LIKE 'A[nm]%'`. Lo **MySQL** son los backticks (`` FROM `ventas` ``) y `LIMIT 0 , 30` |
>
> La **Clase 07** también trae PostgreSQL: su slide 21 se titula *"Vistas Materializadas -
> PostgreSQL"* y el 12 aclara *"(en PostgreSQL la función podría implementar el comportamiento para
> todos los eventos)"*. La **Clase 02** y la **Clase 06** **no** tienen motor ajeno: los diagramas de
> la 06 usan `VARCHAR(n)` estándar, y su única mención de Oracle *(slide 11)* es atribución
> histórica —*"popularizado por Oracle que lo implementó y denominó propiedad key-preserved"*—, no
> sintaxis.
>
> Con la **Clase 10** *(PostgreSQL + Oracle)* sumada, los decks PostgreSQL de la U1 son **ocho**
> —`01`, `03`, `04`, `05-P1`, `07`, `08`, `09` y `10`— y los archivos con algún motor ajeno, **10 de
> 12**. Detalle completo, con la evidencia textual, en [[PostgreSQL]] § *Inventario* y en
> [[_index-clases]] § *desfasaje* / [[index]] § *dudas abiertas*.

> [!success] (clave) La Clase 11 es el primer deck de la U1 escrito en MySQL por defecto
> Evidencia slide por slide en [[Clase 11 - Seguridad-Transacciones]] § *Fuente* › callout *Motor*:
> el título *"Mecanismos de Seguridad **(MySQL)**"* *(slide 7)*, *"Un usuario **MySQL** se define…"*
> y *"El superusuario se denomina **ROOT**"* *(slide 8)*, la forma `'usuario'@'host'` con el comodín
> `'%'` *(slides 9–13)*, `CREATE ROLE` / `GRANT` / `SHOW GRANTS … USING` copiados del ejemplo oficial
> del manual *(slide 11)*, **`FLUSH PRIVILEGES;`** *(slides 12–13)*, la § 10.3.9 del manual
> traducida a medias con el operador `<=>` *(slides 36–37)* y el título *"Ejemplo en **MySQL**"* con
> `CREATE INDEX MYINDEX ON USERS (DNI) USING HASH;` *(slide 38)*. **Recuento: 10 slides con MySQL
> explícito · 1 SQL Server *(slide 29, T-SQL)* · 1 PostgreSQL *(slide 30)* · 26 estándar o sin
> motor.** *(Su motor ajeno son dos ejemplos rotulados, slides 29 y 30.)* Con este deck, los
> archivos de `raw/Unidad-01/Teorica/` con algún motor ajeno pasan a **11 de 13**; limpios siguen
> sólo el `02` y el `06`.
>
> Tres lugares del deck **no corren en MySQL y no lo avisan**: el slide **11**, cuyo `DROP ROLE
> 'app_developer'` va **antes** del `GRANT` del mismo rol *(→ § *7.1*)*; el `drop index
> <nombre-índice>` **sin `ON tabla`** del slide **35** *(→ § *8.4*)*; y, en el mismo slide, los
> identificadores con guion `índice-s` / `nombre-sucursal`, que exigen backticks. El más visible es
> el `DROP INDEX`, porque muerde en el TP5.
>
> Los decks **12, 13 y 14** *(14/09, `raw/Unidad-02/`)* **no entran en este inventario**: son de
> **MongoDB**, el motor correcto de la segunda mitad → [[MongoDB]].

> [!note] Razonamiento propio, no está en ningún deck
> El desfasaje se explica solo: los decks vienen de una versión anterior de la materia que corría
> sobre PostgreSQL, y la práctica se actualizó a MySQL sin rehacer las teóricas. La consecuencia
> operativa es que **el material enseña conceptos correctos con sintaxis del motor equivocado**.

> [!success] (clave) La cátedra reconoce el desfasaje por escrito, en tres TPs consecutivos
> El **TP6** ej. 3 pide las sentencias dos veces: *"en SQL estándar"* (b) y *"las que puedan ser
> soportadas por **MySQL**"* (c). El **TP7** ej. 1.c y 2.b repiten la fórmula sobre `FOR EACH
> STATEMENT`: *"aunque **MySQL** no lo soporta, responda según la teoría"*. El **TP8** la lleva a un
> cambio de **modelo**, no de una cláusula: ej. 1.b *"ya que **MySQL** no provee la opción CASCADE"* y
> ej. 2 *"en el caso de que **MySQL** no provee la funcionalidad pedida, resuélvalo desde la
> teoría"* — y ahí la brecha ya no es una opción del `CREATE TRIGGER`: MySQL no tiene *owner*, no
> tiene `PUBLIC`, no tiene `REVOKE … CASCADE` y maneja `GRANT OPTION` como una marca por nivel, lo
> que cambia varias respuestas del TP y no solo sintaxis *(la sentencia 6 del ej. 1 falla en la
> teoría y pasa en MySQL, ver § *7*)*.
>
> **Tres TPs consecutivos con la misma forma son el método de la cátedra**: la teoría en el
> estándar, la implementación en MySQL, y la brecha entre las dos se nombra. **Ninguno de los tres
> dice una palabra del parcial** → [[Práctica 2026-09-01]], [[Práctica 2026-09-08]], [[PostgreSQL]]
> § *Dudas abiertas*.

---

## Setup, tal como lo da la práctica

> [!info] Fuente
> Todo este apartado sale de `raw/Unidad-01/Practica/BDD II - Clase I.pdf`, secciones *"Introducción a
> Docker"* y *"Preparación para las primeras guías prácticas"* → [[Práctica 2026-08-04]].
> **Las versiones y credenciales son las del deck, no inventadas.**

La cátedra da dos caminos para el servidor: contenedor **Docker** (recomendado) o instalación directa
desde <https://dev.mysql.com/downloads/mysql/>.

### Requisitos de Docker Desktop (Windows)

- WSL 2 habilitado.
- Windows 11 64-bit Enterprise/Pro/Education 23H2 (build 22631) o superior, **o**
  Windows 10 64-bit Enterprise/Pro/Education 22H2 (build 19045).
- Features Hyper-V y Containers habilitados.
- Procesador 64-bit con SLAT, 8 GB RAM, virtualización habilitada en BIOS/UEFI.

En **Linux** no hace falta Docker Desktop, solo Docker Engine; después de instalar hay que agregar el
usuario al grupo `docker` para no depender de `sudo`.

### Levantar el motor

```bash
docker version
docker run hello-world
```

```bash
docker pull mysql:9.7.2
```

```bash
docker run --name MyMySql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=mydb -e MYSQL_USER=myuser -e MYSQL_PASSWORD=mysecretpassword -p 3306:3306 -d mysql:9.7.2
```

### Conectarse por línea de comandos

```bash
docker exec -it MyMySql bash
```

```bash
mysql -u myuser -p
```

### Parámetros de conexión, en una tabla

| Parámetro | Valor |
| --- | --- |
| Imagen | `mysql:9.7.2` |
| Nombre del contenedor | `MyMySql` |
| Host | `127.0.0.1` / `localhost` |
| Puerto | `3306` |
| Base | `mydb` |
| Usuario | `myuser` |
| Password | `mysecretpassword` |
| Password de `root` | `root` |
| URL JDBC (DataGrip) | `jdbc:mysql://localhost:3306/mydb` |

Clientes gráficos que propone la cátedra:

- **MySQL Workbench Community** — <https://dev.mysql.com/downloads/workbench/> ·
  Connection Method `Standard (TCP/IP)`, Hostname `127.0.0.1`, Port `3306`, Username `myuser`,
  Default Schema `mydb`.
- **DataGrip (JetBrains)** — Data Source MySQL, bajando los drivers correspondientes.

### Comandos Docker de referencia

```bash
docker image ls  # o: docker images  — lista imágenes descargadas
docker container ls --all # o: docker ps -a  — lista contenedores (--all incluye los detenidos)
docker stop <container_name>
docker start <container_name>
```

> [!warning] El deck de la teórica propone **XAMPP**, la práctica propone **Docker**
> El slide 2 de la [[Clase 01 - Introducción_BasesDeDatos|Clase 01]] manda a bajar **XAMPP**
> (`https://www.apachefriends.org/es/index.html`), que
> trae el stack Apache/MySQL/PHP empaquetado; la práctica del martes levanta MySQL en un contenedor
> aislado. Las dos vías dan el mismo motor. Queda como duda abierta cuál toma la cátedra como oficial
> → [[Clase 01 - Introducción_BasesDeDatos]] § Dudas abiertas.

---

## Qué TPs corren sobre MySQL

Serie real según [[_cronograma]], transcripta de `raw/tp/_index.md`:

| TP | Tema | Práctica donde se da | Teórica que lo sustenta | ¿Toca MySQL? |
| --- | --- | --- | --- | --- |
| **TP1** | Modelos / Diagramas ER extendido | [[Práctica 2026-08-04]] | pendiente | ✗ es papel: DER, sin motor |
| **TP2** | Creación de esquemas: tablas y tipos de datos | [[Práctica 2026-08-04]] | pendiente | ✓ DDL en MySQL |
| **TP3** | SQLs simples · SQLs avanzados | [[Práctica 2026-08-04]] · [[Práctica 2026-08-11]] | pendiente | ✓ sobre `esq_peliculas.sql`. **El enunciado de "SQLs avanzados" no está archivado** — `pendiente`, no `—` |
| **TP4** | Vistas | **[[Práctica 2026-08-11]]** | Clases **06** y **07** | ✓ `CREATE VIEW` en MySQL. 5 ejercicios; los **3, 4 y 5** sobre `esq_peliculas.sql`, el **1 y el 2** sobre un esquema propio que **hay que crear a mano** |
| **TP5** | Explain Plan | **[[Práctica 2026-08-18]]** | Clase **08** | ✓ **confirmado por el enunciado** — ver el callout de abajo. **No usa `esq_peliculas.sql`**: crea sus propias tablas `materia` e `inscripto` |
| **TP6** | Restricciones declarativas | **[[Práctica 2026-08-25]]** | Clase **09** | (atención) **solo el ejercicio 3.c.** Los ejercicios 1 y 2 son de **matching**, que InnoDB ignora, y el 3.b pide `CREATE ASSERTION`, que no existe. Sus tres esquemas están solo como imagen → § *5* |
| **TP7** | Restricciones avanzadas | **[[Práctica 2026-09-01]]** | Clase **10** | (atención) **casi todo, menos dos puntos.** Los ejercicios **1.c** y **2.b** piden razonar `FOR EACH STATEMENT`, que MySQL no tiene: son de lápiz y papel, como los de *matching* del TP6. Usa `esq_peliculas.sql` *(ej. 1 y 3)* y el esquema A del TP6 ej. 3 *(ej. 4)*. El trigger del **ej. 2** puede chocar con el **error 1442** → § *Dudas abiertas* |
| **TP8** | Seguridad | **[[Práctica 2026-09-08]]** | Clase **11** *(sólo los slides 8–13)* | (atención) **corre casi entero, con la teoría por delante.** De sus **18 ítems**: tres son de lápiz y papel por decisión del enunciado —1.b (`REVOKE … CASCADE`) y 2.d / 2.f (`PUBLIC`)—, uno no puede ejecutarse como está —2.h nombra el rol `ins_prov`, que 2.g no creó—, uno usa `CASCADE` sin aviso (3.b.2), y 1.a da un resultado distinto en MySQL que en la teoría (la sentencia 6 pasa). Tres esquemas propios, dos como imagen, y once cuentas a crear a mano → § *7* |
| **TP9** | MongoDB — Parte I | **[[Práctica 2026-09-15]]** | Clases **12, 13 y 14** | ✗ **MongoDB** — cambio de motor y de unidad *(`raw/Unidad-02/`)* → [[MongoDB]] |
| **TP9 Parte II**–**TP13** | MongoDB · Cassandra · Neo4j · Redis · DynamoDB | segunda mitad | pendiente | ✗ segunda mitad NoSQL |

> [!success] (clave) El TP5 corre sobre **MySQL**, y lo dice su propio enunciado
> Primera línea del PDF: *"Antes de comenzar, es necesario **levantar MySQL** en la PC que vayan a
> utilizar para este práctico."* Lo refuerza con *"las diferentes técnicas de optimización de
> consultas **de MySQL**"*, el link al **MySQL 9.7 Reference Manual** y la instrucción de usar
> **MySQL Workbench**. Detalle en [[Práctica 2026-08-18]]. **Consecuencia:** el deck `BD2_Clase 08`
> es PostgreSQL puro y todos sus ejemplos hay que rehacerlos → § *4*. Cierra la mitad **TP5** de la
> duda, no la mitad **parcial** → § *Dudas abiertas*.

> [!note] La columna de esta tabla ya no numera clases
> Da **la práctica donde se dicta el TP** y, cuando está verificado, la **teórica** que lo sustenta
> —no la numeración de filas del cronograma, que da tema y fecha, no número de clase—. La tabla de
> TPs de [[Práctica 2026-08-04]] sigue listando la asignación del **programa oficial** *("TP1
> PostgreSQL / TP2 HBase / TP3 MongoDB")*; la serie correcta es la de arriba.

### El dataset: `esq_peliculas.sql`

`raw/Unidad-01/Practica/esq_peliculas.sql` · **381 líneas**. Centro de distribución de películas, con
las tablas `pais`, `ciudad`, `distribuidor` (+ subtipos `nacional` / `internacional`), `departamento`,
`empleado`, `tarea`, `empresa_productora`, `pelicula`, `video`, `entrega`, `renglon_entrega`. Crea las
tablas e inserta datos de ejemplo.

Estructura del script, que es exactamente el patrón que enseña el slide 6 de la [[Clase 04 - AlteraciónActualizaciónTablas|Clase 04]]:

1. Un bloque de `drop` **comentado** en el encabezado, en orden inverso a las dependencias.
2. Todos los `CREATE TABLE`, con las columnas y los `CONSTRAINT … CHECK (… IS NOT NULL)`.
3. Todos los `ALTER TABLE … ADD CONSTRAINT pk_<tabla> PRIMARY KEY (…)`.
4. Todos los `ALTER TABLE … ADD CONSTRAINT … FOREIGN KEY (…) REFERENCES …`.
5. Los `INSERT`.
6. Un último `ALTER TABLE departamento ADD CONSTRAINT departamento_jefe_departamento_fkey …` al final
  de todo, después de los datos.

> [!tip] Por qué las FK van en `ALTER TABLE` y no dentro del `CREATE`
> Porque el esquema tiene **ciclos**: `empleado.id_jefe → empleado`, y
> `departamento.jefe_departamento → empleado` mientras `empleado.(id_distribuidor, id_departamento) →
> departamento`. Con las FK declaradas *inline* no existe un orden de creación posible. Sacándolas a
> `ALTER TABLE`, el orden deja de importar. Está desarrollado en
> [[Clase 04 - AlteraciónActualizaciónTablas]].

La línea que **prueba** que el script es MySQL, del bloque de `drop` comentado:

```sql
alter table empleado drop foreign key empleado_id_distribuidor_fkey;
```

`DROP FOREIGN KEY` es MySQL. En PostgreSQL sería `DROP CONSTRAINT` — que es justamente lo que enseña
el deck de la [[Clase 04 - AlteraciónActualizaciónTablas|Clase 04]].

> [!note] Ampliación, no está en el material
> El script conserva **rastros de un dump de PostgreSQL** aunque corra en MySQL: escribe los tipos como
> `character varying(n)`, `character(2)` y `numeric(p,s)` —las grafías del estándar/PostgreSQL, que
> MySQL acepta como sinónimos de `VARCHAR`, `CHAR` y `DECIMAL`—, y nombra las FK con la convención
> automática de PostgreSQL `<tabla>_<columna>_fkey`. Conviven con nombres a mano (`pk_ciudad`,
> `fk_entrega_video`). **Los sinónimos de tipos no los verifiqué contra el manual de la versión
> 9.7.2**: si algo falla al cargar el script, es el primer lugar donde mirar.

> [!warning] Los `CHECK (col IS NOT NULL)` del script
> Cada tabla define restricciones del tipo `CONSTRAINT pelicula_titulo_check CHECK ((titulo IS NOT
> NULL))`. **Durante muchos años MySQL parseó los `CHECK` y los ignoró en silencio**, y recién los
> aplica desde versiones recientes → [[Clase 03 - Derivación a Esquema Lógico]] § PostgreSQL
> vs. MySQL. **Verificar contra la versión del contenedor** si el TP depende de que se apliquen; no
> asumir que sí ni que no.

---

## Tabla de diferencias: lo que muestra el slide vs. lo que hay que tipear

> [!important] Esta es la tabla que hay que tener al lado cuando se hace el TP
> Columna 2: **lo que dice el material**. Columna 3: **lo que hay que tipear en MySQL**. La columna
> *Certeza* dice cuánto me consta; donde dice **`verificar`** no está confirmado y va también a
> § Dudas abiertas. **Preferí dejar celdas en `verificar` antes que inventar equivalencias.** Las
> citas usan el nombre real de cada deck —[[Clase 05 - Consultas de Datos–Parte 2\|Parte 2]],
> [[Clase 05 - Consultas de Datos–Parte 3\|Parte 3]], [[Clase 06 …]] / [[Clase 07 …]]—, no la
> nomenclatura *"Bloque A–E"* que usaba una versión anterior de la página.

### 1 · DDL — `ALTER TABLE` y `DROP TABLE`

| Operación | El material dice *(PostgreSQL)* | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- | --- |
| Agregar columna | `ALTER TABLE t ADD COLUMN c tipo;` | **igual** (`COLUMN` es opcional en los dos) | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slide 3 |
| Eliminar columna | `ALTER TABLE t DROP COLUMN c;` | **igual** | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slides 3–4 |
| Renombrar columna | `ALTER TABLE t RENAME COLUMN vieja TO nueva;` | **igual** en MySQL 8.0+; antes `ALTER TABLE t CHANGE vieja nueva tipo;` | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slide 3 |
| **Cambiar tipo de dato** | `ALTER TABLE t ALTER COLUMN c TYPE tipo;` | `ALTER TABLE t MODIFY COLUMN c tipo;` — **sin `TYPE`** | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slides 3 y 5 |
| **Poner `NOT NULL`** | `ALTER TABLE t ALTER COLUMN c SET NOT NULL;` | **no existe** → `ALTER TABLE t MODIFY COLUMN c tipo NOT NULL;` | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slides 3 y 5 |
| **Quitar `NOT NULL`** | `ALTER TABLE t ALTER COLUMN c DROP NOT NULL;` | **no existe** → `ALTER TABLE t MODIFY COLUMN c tipo NULL;` | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slides 3 y 5 |
| Poner / quitar `DEFAULT` | `ALTER TABLE t ALTER COLUMN c SET DEFAULT v;` / `DROP DEFAULT;` | **igual** | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slide 5 |
| Agregar `UNIQUE` / `PRIMARY KEY` / `FOREIGN KEY` | `ALTER TABLE t ADD CONSTRAINT n …;` | **igual** (la FK requiere InnoDB) | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slides 4 y 6 · `esq_peliculas.sql` |
| **Eliminar una FK** | `ALTER TABLE t DROP CONSTRAINT n;` | `ALTER TABLE t DROP FOREIGN KEY n;` | seguro — **es la forma que usa `esq_peliculas.sql`** | [[Clase 04 - AlteraciónActualizaciónTablas]] slide 4 |
| Eliminar una PK | *(no está en el material)* | `ALTER TABLE t DROP PRIMARY KEY;` | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] § *Tabla maestra* |
| Eliminar una `UNIQUE` | *(no está en el material)* | `ALTER TABLE t DROP INDEX n;` *(en MySQL una `UNIQUE` **es** un índice)* | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] § *Tabla maestra* |
| `DROP CONSTRAINT` genérico | `ALTER TABLE t DROP CONSTRAINT n;` | existe en MySQL 8 moderno, pero **desde qué versión: `verificar`**. Mientras tanto, usar las tres formas específicas de arriba | **verificar** | [[Clase 04 - AlteraciónActualizaciónTablas]] § *Dudas abiertas* |
| Borrar tabla | `DROP TABLE t CASCADE;` / `RESTRICT;` | MySQL **acepta las dos palabras y las ignora**: no hay borrado en cascada de objetos dependientes | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slide 7 |
| `REFERENCES` *inline* en la columna | `c tipo REFERENCES otra(col)` | en **MySQL/InnoDB** se acepta sintácticamente pero **no crea la FK** → declararla como `table_constraint` o con `ALTER TABLE` | **verificar** — razonamiento propio | [[Clase 03 - Derivación a Esquema Lógico]] slide 23 |
| `index_parameters` en `UNIQUE`/`PRIMARY KEY` | gramática del *synopsis* de PostgreSQL | **no existe** en MySQL | seguro | [[Clase 03 - Derivación a Esquema Lógico]] slide 23 |
| Catálogo de tipos de datos | link a **PostgreSQL 9.5** (slide 10) | hay que usar el **manual de MySQL** | seguro | [[Clase 03 - Derivación a Esquema Lógico]] slide 10 |

> [!warning] La trampa de `MODIFY COLUMN`
> `MODIFY` **redeclara la columna entera**: todo atributo que no se vuelva a escribir **se pierde**. Si
> la columna tenía `DEFAULT 'Regular'` y se hace `MODIFY COLUMN condicion VARCHAR(30)` a secas, **el
> default desaparece**. Es la diferencia de fondo con el `ALTER COLUMN … TYPE` de PostgreSQL, que toca
> solo lo que se le pide.

### 2 · DML y consultas

| Del material | Motor de origen | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- | --- |
| `INSERT` / `UPDATE` / `DELETE` de los slides 8–9 | estándar | **idénticos** | seguro | [[Clase 04 - AlteraciónActualizaciónTablas]] slides 8–9 |
| `LIMIT n` · `LIMIT n OFFSET m` | PostgreSQL | **igual**; también `LIMIT m, n` (offset primero) | seguro | [[Clase 05 - Consultas de Datos–Parte 1]] slides 21–22 |
| **`LIMIT ALL`** | PostgreSQL | **no existe** → poner un tope enorme: `LIMIT 18446744073709551615 OFFSET m` | seguro | [[Clase 05 - Consultas de Datos–Parte 1]] slide 22 |
| **`OFFSET m` solo, sin `LIMIT`** | PostgreSQL | **no compila**: en MySQL `OFFSET` exige `LIMIT` | seguro | [[Clase 05 - Consultas de Datos–Parte 1]] § *PostgreSQL/Oracle → MySQL* |
| `VARCHAR2(n)` · `NUMBER(p,s)` | Oracle | `VARCHAR(n)` · `DECIMAL(p,s)` | seguro | [[Clase 05 - Consultas de Datos–Parte 1]] § *PostgreSQL/Oracle → MySQL* |
| Concatenación `\|\|` | estándar / PostgreSQL | `CONCAT(...)` | seguro | [[Clase 05 - Consultas de Datos–Parte 3]] |
| **`FULL JOIN` / `FULL OUTER JOIN`** | Oracle / PostgreSQL | **no existe** → emular con `LEFT JOIN … UNION … RIGHT JOIN` | seguro | [[Clase 05 - Consultas de Datos–Parte 2]] |
| *"para `ORDER BY`, null es el mayor"* | Oracle / PostgreSQL | **al revés**: MySQL pone los `NULL` **primero** en `ASC` | seguro | [[Clase 05 - Consultas de Datos–Parte 2]] slide 29 |
| `EXTRACT(DAY FROM fecha)` vs. `DAY()` | PostgreSQL vs. MySQL | MySQL tiene `DAY()` / `DAYOFMONTH()`; PostgreSQL solo `EXTRACT` | seguro | [[Clase 05 - Consultas de Datos–Parte 3]] slides 11–13 |
| `STDDEV(col)` | Oracle / PostgreSQL | existe, **pero MySQL devuelve el desvío poblacional** y PostgreSQL el muestral → **números distintos** | **verificar** | [[Clase 05 - Consultas de Datos–Parte 1]] § *PostgreSQL/Oracle → MySQL* |
| `LIKE` sensible a mayúsculas | PostgreSQL: sí | MySQL: **depende de la *collation***; con la default `..._ci` es **insensible** | **verificar la collation del TP** | [[Clase 05 - Consultas de Datos–Parte 1]] slide 14 |
| Alias plegado a minúsculas en la salida | PostgreSQL (*case folding*) | MySQL **respeta** las mayúsculas del alias | alta | [[Clase 05 - Consultas de Datos–Parte 1]] |
| Regla del `GROUP BY` del slide 31 | PostgreSQL: siempre | MySQL: **igual desde 5.7**, por `ONLY_FULL_GROUP_BY` activo por defecto | alta | [[Clase 05 - Consultas de Datos–Parte 1]] slide 31 |
| `ERROR: aggregates not allowed in WHERE clause` | PostgreSQL | `ERROR 1111 (HY000): Invalid use of group function` | alta | [[Clase 05 - Consultas de Datos–Parte 1]] slide 35 |
| Identificador con caracteres raros — el slide 17 lo escribe **pelado**: `CREATE VIEW Envios500-999 AS` | ninguno: **así, sin comillas, no es un identificador válido en ningún motor** *(razonamiento propio)* | `` `Envios500-999` `` — **MySQL usa backticks**; en el estándar/PostgreSQL sería `"Envios500-999"` | seguro | [[Clase 06 - Vistas-Parte 1]] slide 17 |

### 3 · Vistas

| Del material | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- |
| `CREATE VIEW … AS consulta` | **igual** | seguro | [[Clase 06 - Vistas-Parte 1]] |
| `DROP VIEW v RESTRICT;` / `CASCADE;` | MySQL **acepta las palabras y las ignora**: el `DROP` procede y las vistas dependientes quedan inválidas *(fallan recién al consultarlas)* | seguro | [[Clase 06 - Vistas-Parte 1]] slide 7 |
| **`CREATE MATERIALIZED VIEW … WITH [NO] DATA`** | **no existe.** *"MySQL no admite las vistas materializadas"* — **lo dice el propio slide 20** | seguro, dicho por el deck | [[Clase 07 - Vistas-Parte 2]] slides 20–21 |
| `REFRESH MATERIALIZED VIEW v;` *(**no está en el deck**: `REFRESH` no aparece en ninguno de los 22 slides. Es la contraparte PostgreSQL del "se debe actualizar manualmente la vista materializada" que dice la tabla del slide 20)* | **no existe** (no hay qué refrescar) | **razonamiento propio** | — |
| Trigger **`INSTEAD OF`** sobre una vista, con `:new.columna` | **no existe**: MySQL solo admite `BEFORE`/`AFTER` y **solo sobre tablas**. El sustituto es un *stored procedure* o escribir contra las tablas base | **verificar** — razonamiento propio | [[Clase 07 - Vistas-Parte 2]] slides 11–12 |
| `WITH [LOCAL\|CASCADED] CHECK OPTION` | existe en MySQL | seguro | [[Clase 06 - Vistas-Parte 1]] slides 4 y 15 *(ejemplos: 16–17)* · [[Clase 07 - Vistas-Parte 2]] slide 2 |

### 4 · Índices y plan de ejecución

El deck `BD2_Clase 08` es **PostgreSQL puro**; la traducción completa, fila por fila y con nivel de
certeza declarado, está en [[Clase 08 - Explicando el plan]] § *PostgreSQL vs. MySQL*. Lo mínimo
para el TP5 — que **corre sobre MySQL**, así que esta tabla dejó de ser precautoria: es la que hay que
usar ([[Práctica 2026-08-18]]):

| Del deck *(PostgreSQL)* | En **MySQL** | Certeza |
| --- | --- | --- |
| `EXPLAIN consulta` | `EXPLAIN consulta` (también `DESCRIBE` / `DESC`) | seguro |
| `EXPLAIN ANALYZE consulta` | existe, con salida en formato árbol — **el enunciado del TP5 lo usa sobre MySQL sin aclarar nada**, dándolo por disponible en 9.7 | existe: **seguro** · **desde qué versión: `verificar`** |
| — | `EXPLAIN FORMAT=JSON` (trae `query_cost`) y `EXPLAIN FORMAT=TREE` | seguro que existen; versión: **verificar** |
| — | **`SET @@explain_format=TREE;`** — **variable de sesión, con dos `@`**: fija el formato árbol para toda la sesión en lugar de repetir `FORMAT=TREE` en cada sentencia | **seguro — es la primera sentencia del enunciado del TP5** |
| `pg_class.relpages / reltuples` | `information_schema.TABLES` → `TABLE_ROWS`, `DATA_LENGTH`, `AVG_ROW_LENGTH`; también `SHOW TABLE STATUS` | seguro (en InnoDB `TABLE_ROWS` es **estimado**) |
| `ANALYZE VERBOSE tabla` | `ANALYZE TABLE tabla` | seguro |
| `\d tabla` | `DESCRIBE tabla` · `SHOW CREATE TABLE tabla` · `SHOW INDEX FROM tabla` | seguro |
| `\timing` | no hace falta: el cliente `mysql` **ya imprime** `1 row in set (0.01 sec)` | seguro |
| `generate_series(1,100000)` | **no existe** → se emula con un `WITH RECURSIVE` (MySQL 8+) | seguro |
| `Seq Scan` | `type = ALL` en el `EXPLAIN` clásico | razonablemente seguro |
| `Index Only Scan` | `Extra: Using index` (covering index) | razonablemente seguro |
| `Filter` | `Extra: Using where` | razonablemente seguro |
| `Sort` | `Extra: Using filesort` | razonablemente seguro |
| `set enable_seqscan = off` | no hay equivalente exacto; están `optimizer_switch` y los hints `USE INDEX` / `FORCE INDEX` / `IGNORE INDEX` | hints: seguro · equivalencia fina: **verificar** |
| `pgAdmin` → botón *Explain query* | **MySQL Workbench** → *Visual Explain* **y** *Form Editor*: el TP5 pide textualmente *"Elegir la opción "Form Editor" en MySQL Workbench para ver el árbol"* | *Visual Explain* existe: seguro · **la relación entre los dos: verificar** |
| `EXPLAIN (ANALYZE, BUFFERS)` | sin equivalente directo | **verificar** |
| `JIT:`, `Gather`, `Workers Planned` | no existen igual en MySQL | **verificar** |

> [!warning] *Form Editor* **no reemplaza** a *Visual Explain*: lo complementa
> El vault mapeaba *pgAdmin → Explain query* ⟶ *Workbench → **Visual Explain*** en cuatro páginas, y
> **nunca** mencionaba el *Form Editor*. La cátedra pide el segundo. **La fila de arriba conserva los
> dos.**
>
> **Razonamiento propio, sin fuente:** *Visual Explain* **dibuja** el plan; el *Form Editor* del grid
> de resultados sirve para ver **formateado el valor multilínea de una celda**, que es exactamente
> donde cae la salida en formato `TREE`. Son cosas distintas y probablemente se usan juntas.
> **Verificar abriendo Workbench** — está como pregunta 4 en [[Práctica 2026-08-18]].

> [!missing] (crítico) El hueco de la sintaxis de creación de índices: **cerrado, desde un deck que no era de índices**
> El TP5 exige la sintaxis en **cinco** ejercicios —clave primaria, clave compuesta, índices `Unique`
> y `No Unique`, borrar todos los *constraints*— y ni el enunciado, ni la lectura asignada del
> § 10.3.9 *(compara B-tree contra hash sin DDL)*, ni *Seven Databases* cap. 2.2 *(sintaxis de
> PostgreSQL)* la dan.
>
> **Resuelto por el slide 35** de la [[Clase 11 - Seguridad-Transacciones|Clase 11]]: `create index
> <nombre-índice> on <nombre-tabla> (<lista-atributos>)` y `drop index <nombre-índice>`, y el slide
> **38**, `CREATE INDEX MYINDEX ON USERS (DNI) USING HASH;` rotulado *"Ejemplo en MySQL"*. La forma
> `CREATE INDEX nombre ON tabla (cols)` **es MySQL válido** —contra el manual 9.7, § **15.1.18
> *CREATE INDEX Statement***—; lo que **no** corre es el `drop index` **sin `ON tabla`**, y el
> `USING HASH` sobre InnoDB **se ignora en silencio**. Tabla completa en § *8.4* → pregunta 1 de
> [[Práctica 2026-08-18]].

> [!important] Lo que **sí** se transfiere entero, sin traducción
> Los conceptos son los mismos en los dos motores, y son los que caen en el parcial: el plan es un
> **árbol** que se lee de adentro hacia afuera; **estimación ≠ realidad** y las estadísticas se
> actualizan con `ANALYZE`; **full scan vs. acceso por índice** es la decisión central; una condición
> que **acota el acceso** no es lo mismo que una que **filtra después**; en un índice **compuesto** el
> **orden de las columnas** decide qué consultas puede servir; un índice que **cubre** la consulta
> evita ir a la tabla; y las condiciones inútiles (`LIKE '%'`) **cuestan**.

### 5 · Restricciones e integridad

El deck de la [[Clase 09 - Restricciones integridad-Parte 1|Clase 09]] es el **séptimo** escrito
contra PostgreSQL —`01`, `03`, `04`, `05-P1`, `07`, `08` y `09`—, su slide 27 se titula literalmente
*"SINTAXIS PostgreSQL"*, y esta vez el desfasaje es el más grande de todos: **de las cuatro
sentencias declarativas que enseña, MySQL tiene una y media**.

> [!important] (clave) La regla que resume toda la sección — **es la respuesta al ejercicio 3.c del TP6**
> **La jerarquía `atributo → tupla → tabla → base de datos` del slide 15 es exactamente el mapa de lo
> que MySQL puede y no puede. El corte cae entre *tupla* y *tabla*.**
>
> | Ámbito de la RI | Recurso del estándar | ¿MySQL? | Por qué |
> | --- | --- | :---: | --- |
> | **atributo / dominio** | `CHECK` en la columna | ✓ | — |
> | **atributo / dominio** | `CREATE DOMAIN` | ✗ | **no existe en MySQL** |
> | **registro / tupla** | `CHECK` de tabla | ✓ | — |
> | **tabla** | `CHECK` con subconsulta | ✗ | **No lo tiene ningún motor.** MySQL prohíbe subconsultas en un `CHECK` — y el slide 17 de la [[Clase 10 - Restricciones integridad-Parte 2\|Clase 10]] dice que **PostgreSQL tampoco**: *"Postgres no permite un select dentro de un constraint"* |
> | **base de datos** | `CREATE ASSERTION` | ✗ | **no existe en ningún motor** |
>
> Lo que cae del lado ✗ se reemplaza por **triggers** — y el propio slide 37 del deck avisa que **no
> es una traducción equivalente**: un trigger *"no verifica su cumplimiento para los datos ya
> almacenados"*.

#### 5.1 · Claves e integridad referencial

| Del material | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- |
| `PRIMARY KEY` · `UNIQUE` · `NOT NULL` · `DEFAULT` | **igual** | seguro | Clase 09 slide 6 |
| `FOREIGN KEY … REFERENCES` como *table constraint* | **igual — exige InnoDB**; con MyISAM se parsea y se ignora | seguro | Clase 09 slide 8 |
| `REFERENCES` *inline* en la columna | se acepta sintácticamente pero **no crea la FK** | **verificar** | Clase 03 slide 23 · Clase 09 slide 8 |
| `ON DELETE` / `ON UPDATE CASCADE` | **igual** | seguro | Clase 09 slides 9–10 |
| `ON DELETE` / `ON UPDATE SET NULL` | **igual**, y **exige que la columna admita nulos** | seguro | Clase 09 slide 9 |
| **`SET DEFAULT`** | ✗ **InnoDB rechaza la definición de la tabla**: la parsea y la declara inválida | **alta** — verificar contra el manual 9.7 | Clase 09 slide 8 |
| **`NO ACTION` vs. `RESTRICT`** | (atención) **InnoDB los trata igual.** No hay chequeo diferido, así que la distinción del slide 9 *("RESTRICT se chequea antes")* **no es observable** | **alta** | Clase 09 slides 9–10, 38 |
| Acción por defecto | `NO ACTION` — que en InnoDB **es** `RESTRICT` | alta | Clase 09 slide 9 |
| **`MATCH FULL \| PARTIAL \| SIMPLE`** | (atención) **se parsea y se ignora**: InnoDB siempre se comporta como **`MATCH SIMPLE`** | **alta** — (crítico) **verificar contra el manual 9.7** | Clase 09 slides 12–14 |
| Chequeo diferido (`SET CONSTRAINTS … DEFERRED`) | ✗ **no existe**: todo es inmediato | seguro | Clase 09 slide 38, paso 3 |
| `ALTER TABLE t ADD CONSTRAINT n FOREIGN KEY …` | **igual** | seguro | Clase 09 slide 8 · TP6 ej. 1.a |
| Eliminar una FK | `ALTER TABLE t DROP **FOREIGN KEY** n;` — **no** `DROP CONSTRAINT` | seguro | `esq_peliculas.sql` |

> [!warning] (crítico) Consecuencia para el TP6: **los ejercicios de matching no se pueden correr**
> Los puntos **1.c** y **2.b** son de lápiz y papel. Si se ejecutan en MySQL, el resultado va a ser
> **la columna `SIMPLE`** en todos los casos, se haya escrito `MATCH FULL` o lo que sea.
>
> Si de verdad hiciera falta `MATCH FULL` en MySQL, se agrega a mano con un `CHECK`:
> ```sql
> CHECK ( (Zona IS NULL AND NroC IS NULL) OR (Zona IS NOT NULL AND NroC IS NOT NULL) )
> ```
> *(Razonamiento propio. Fuerza la parte "todo o nada"; la parte "coincide con la PK" ya la da la FK.)*

#### 5.2 · `CHECK`, dominios y aserciones

| Del material | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- |
| `CHECK (condición)` de columna o de tupla | ✓ **existe, y se hace cumplir desde 8.0.16** *(abril 2019)*. **Antes se parseaba y se ignoraba en silencio** — la restricción parecía estar y no hacía nada. La cursada corre **9.7**, así que sí se cumplen | seguro | Clase 09 slides 17–21 |
| `CHECK` con **subconsulta** | ✗ **prohibido.** Cae todo `CHECK` de ámbito **tabla** — y **no es una carencia de MySQL**: el slide 17 de la Clase 10 dice que *"Postgres no permite un `select` dentro de un constraint"*, así que **no lo tiene ningún motor** | alta — **verificar el ancla del manual** · **la mitad PostgreSQL la dice el deck** | Clase 09 slide 22 · **Clase 10 slide 17** · TP6 3.A.4 y 3.B.6 |
| `CHECK` con funciones **no determinísticas** *(`NOW()`, `RAND()`, `CURRENT_DATE`)* | ✗ prohibido. `YEAR()` y `EXTRACT()` **sí** valen | alta | TP6 3.A.2 y 3.A.3 |
| **`CREATE DOMAIN`** | ✗ **no existe.** Sustitutos: el tipo **`ENUM`** *(para el caso `IN (…)`)* o repetir el `CHECK` en cada columna | seguro | Clase 09 slides 17 y 19 |
| **`CREATE ASSERTION`** | ✗ **no existe** *(ningún motor la tiene — lo dicen **los dos** decks: Clase 09 slide 23, y Clase 10 slide 18 textual: "**Ninguna base de datos comercial implementa Assertions**")* | seguro, dicho por el deck **dos veces** | Clase 09 slides 23–24 · **Clase 10 slide 18** |
| `DATE '2010-01-01'` | acepta el literal `'2010-01-01'` a secas; las dos formas valen | seguro | TP6 3.A.2 |
| `LIKE 'S\_%' ESCAPE '\'` | **igual — y el `ESCAPE` es opcional**: en MySQL la barra invertida ya es el carácter de escape por defecto dentro de las cadenas | alta | Clase 09 slide 18 · TP6 3.B.7 |
| `EXTRACT(YEAR FROM fecha)` | existe; la forma idiomática es **`YEAR(fecha)`** | seguro | TP6 3.A.3 |
| Nombrar restricciones (`ADD CONSTRAINT nombre`) | **igual**, y sigue siendo *"Recomendable!"* | seguro | Clase 09 slide 6 |

#### 5.3 · Triggers

**De las ocho cláusulas del slide 27, MySQL sólo conserva `BEFORE`/`AFTER` y `FOR EACH ROW`** —y esta
última pasa de opcional a **obligatoria**—; **las demás no tienen equivalente.** Es la tabla de
traducción más densa del vault.

| Del slide *(PostgreSQL)* | En **MySQL** | Certeza |
| --- | --- | --- |
| `BEFORE` / `AFTER` | ✓ **igual** | seguro |
| **`INSTEAD OF`** | ✗ no existe | seguro |
| `INSERT OR UPDATE OR DELETE` combinados | ✗ **un evento por trigger** — hay que escribir uno por cada uno | seguro |
| `UPDATE OF columna` | ✗ no existe → chequear a mano con `IF NEW.c <> OLD.c` | seguro |
| `TRUNCATE` como evento | ✗ no existe | seguro |
| `FOR EACH ROW` | ✓ **y es obligatorio** | seguro |
| **`FOR EACH STATEMENT`** | ✗ no existe. *(Y es el **default** del estándar — slide 29)* · (clave) **confirmado por el TP7 ej. 1.c y 2.b**, que lo dicen en el enunciado: *"aunque MySQL no lo soporta, responda según la teoría"* | seguro — **y ya no es razonamiento propio: lo dice la cátedra** |
| **`WHEN (condición)`** | ✗ no existe → un `IF … THEN … END IF` adentro del cuerpo | seguro |
| `EXECUTE PROCEDURE fn()` | ✗ el cuerpo va **inline**, entre `BEGIN … END` | seguro |
| `ON` una **vista** | ✗ **solo sobre tablas** | seguro |
| `:new` / `:old` *(slide 30)* | **`NEW.col` / `OLD.col`** — sin dos puntos. *(Los `:` son de **Oracle**; el propio slide 36 los escribe sin ellos)* | seguro |
| `TG_OP` | ✗ no existe *(no hace falta: un trigger por evento)* | seguro |
| `RAISE EXCEPTION` *(el `funcion_error()` del slide 34)* | **`SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '…'`** | seguro |
| `RETURN NEW` / `RETURN OLD` | ✗ no hay valor de retorno. Para cancelar en un `BEFORE`: `SIGNAL` | alta |
| — | (atención) **un trigger no puede modificar la tabla que disparó la sentencia** *(error 1442)*. (crítico) **Muerde en el TP7 ej. 2**, donde el trigger sobre `empleado_1` **lee** `empleado_1` en una subconsulta: **leerla debería estar permitido y modificarla no, pero no está verificado** | alta · **el caso concreto del TP7: pendiente de verificar** |
| — | **Varios triggers para el mismo evento y *timing* sobre una tabla** sí se admiten desde **5.7**, ordenados con `FOLLOWS` / `PRECEDES`. Antes era **uno solo por combinación**, y eso condicionaría todo el punto 1 del TP7 | **alta** — razonamiento propio, no está en ningún deck |
| *"analizar la **granularidad, eventos y tiempo de activación** de cada trigger involucrado"* *(Clase 10 slide 19)* | (atención) **de los tres, MySQL sólo deja elegir dos**: la granularidad está **fija** en `FOR EACH ROW`, el tiempo se limita a `BEFORE`/`AFTER` *(sin diferido)*, y el evento es **uno por trigger** | seguro |
| pasos 1, 3 y 4 del modelo SQL-99 *(slide 38)* | ✗ no hay triggers de sentencia ni verificación diferida | seguro |

La forma MySQL de un trigger de integridad, que es lo que hay que tipear cuando el `CHECK` no alcanza:

```sql
DELIMITER $$
CREATE TRIGGER tr_provee_max_20_ins
BEFORE INSERT ON PROVEE
FOR EACH ROW
BEGIN
  IF (SELECT COUNT(*) FROM PROVEE WHERE nro_prov = NEW.nro_prov) >= 20 THEN
  SIGNAL SQLSTATE '45000'
  SET MESSAGE_TEXT = 'Un proveedor no puede proveer más de 20 productos';
  END IF;
END$$
DELIMITER ;
```

> [!note] El `DELIMITER` no es decorativo
> El cuerpo del trigger tiene `;` adentro, y el cliente `mysql` cortaría la sentencia en el primero.
> `DELIMITER $$` cambia el terminador mientras dura la definición y `DELIMITER ;` lo devuelve. Sin
> eso, el `CREATE TRIGGER` falla con un error de sintaxis que no dice nada útil → § *Lo que es propio
> de MySQL*, ítem 5.

> [!warning] (crítico) Migrar una RI declarativa a trigger **es una degradación**, no una traducción
> Lo dice el slide 37 del deck, y hay que decirlo al entregar el 3.c del TP6:
> 1. **No valida el histórico.** `ALTER TABLE … ADD CONSTRAINT CHECK` falla si alguna fila ya
> almacenada no cumple; `CREATE TRIGGER` **no mira nada** de lo ya cargado.
> 2. **Multiplica las piezas.** Una restricción → **un trigger por evento y por tabla involucrada**.
> Una `ASSERTION` de tres tablas se convierte en cuatro o seis triggers a mantener sincronizados.
> 3. **El motor no la entiende.** Un `CHECK` es analizable; un trigger es una caja negra.

#### 5.4 · Lo que hace falta del manual y no está en ningún libro

> [!missing] (crítico) **Ninguna fuente del vault cubre qué soporta MySQL de restricciones — ni de SQL procedural**
> Los tres libros son de 2004–2008 o están escritos contra PostgreSQL, y ninguno menciona MySQL en
> estos temas: las secciones **5 y 6** de esta página son razonamiento propio contrastado con el
> comportamiento conocido de *stored programs* e InnoDB, no una cita.
>
> Las secciones del manual 9.7 que las cerrarían, sin anclajes verificados: § *CHECK Constraints*
> (prohibición de subconsultas y funciones no determinísticas, desde qué versión se cumplen); §
> *FOREIGN KEY Constraints* (`MATCH` ignorado, `SET DEFAULT` rechazado, `NO ACTION` = `RESTRICT`); §
> *CREATE TRIGGER Statement* (cláusulas ausentes); § *CREATE PROCEDURE / CREATE FUNCTION* (`OR
> REPLACE`, `DETERMINISTIC`/`READS SQL DATA`, error 1418 → § *6.1*); § *Compound Statement Syntax*
> (orden de `DECLARE`, handlers `NOT FOUND`, cursores, `GET DIAGNOSTICS` → §§ *6.2* y *6.3*).
> Hueco dado de alta en [[_index-bibliografia]] § 3 › *Huecos de cobertura*.

### 6 · SQL procedural — funciones, procedimientos y cursores

El deck de la [[Clase 10 - Restricciones integridad-Parte 2|Clase 10]] es el **octavo** escrito contra
PostgreSQL, y el que más lejos lleva el desfasaje: **ocho de sus veinte slides —del 6 al 13— son
PL/pgSQL de punta a punta**, los ocho titulados *"Procedimientos/Funciones en **Postgres**"*. Esta
sección es la continuación directa del § *5.3*: aquélla traduce el `CREATE TRIGGER`, ésta traduce
**lo que va adentro**.

> [!warning] (crítico) El deck 10 es el **primero que no se puede leer "traduciendo palabras"**
> Los decks 03, 04 y 05 pedían cambiar una cláusula por otra, y con una tabla de equivalencias al
> lado se salía. El deck 10 pide **reescribir la estructura**: sin `%rowtype` hay que enumerar
> columnas, sin `FOR` hay que armar un cursor con handler, sin `RETURNS TABLE` hay que cambiar la
> función por un procedimiento. **De las ~20 construcciones procedurales, tres se tipean igual**:
> `IF … END IF`, `OPEN`/`FETCH`/`CLOSE` y el `RETURN` de un escalar. **Siete no tienen sustituto de
> ninguna clase** —`%rowtype`, `%type`, `record`, `refcursor`, cursor parametrizado,
> `FOR`-sobre-resultado y `RETURNS TABLE`—.
>
> El slide 2 del propio deck advierte que *"cada proveedor de BD tiene su propio lenguaje
> procedural"*, y los once slides siguientes enseñan el de un proveedor que la cursada no usa: el
> slide 4 ya trae `elsif` y un `For` *"que itera sobre los elementos de una tabla resultado"*, los
> dos de PL/pgSQL, no del estándar. *(El deck se llama "Restricciones integridad-Parte 2"; el
> contenido procedural es el grueso, las restricciones son los slides 14–18, ya cubiertas en § 5.)*

> [!important] Cómo leer estas tablas
> Los marcadores de *En MySQL* son `✓ tal cual` · `(atención) con cambios` · `✗ no existe`. La
> `Certeza` califica la afirmación sobre MySQL, no sobre el deck: **seguro** es comportamiento
> estable de *stored programs* en MySQL 8.x sin motivo para creer que cambió en 9.x, pero **nada de
> esta sección está verificado contra el manual 9.7** — donde depende de la versión dice
> `pendiente de verificar`. Las secciones que la cerrarían son `CREATE PROCEDURE`/`CREATE FUNCTION`
> y *Compound Statement Syntax* (§ 15.1.17 y § 15.6, tampoco verificados) → hueco junto a § *5.4*.

#### 6.1 · El envoltorio: crear la rutina

| Del deck 10 | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- |
| *"Para Postgres **todos son funciones**, sólo que hay funciones que devuelven `void` (Procedimientos)"* | ✗ **la distinción es real en MySQL**: `CREATE PROCEDURE` *(no retorna, se invoca con `CALL`)* y `CREATE FUNCTION` *(lleva `RETURNS`, se invoca dentro de una expresión)* son **dos objetos distintos**. Es la diferencia de fondo del deck, no un detalle de tipeo | seguro | Clase 10 slide 6 |
| `CREATE [OR REPLACE] FUNCTION f(args) RETURNS tipo AS $$ … $$ LANGUAGE plpgsql;` | (atención) `CREATE FUNCTION f(p tipo) RETURNS tipo DETERMINISTIC BEGIN … END` — **sin `AS`, sin `$$`, sin `LANGUAGE`** | seguro | Clase 10 slides 6–7 |
| **`$$` como delimitador del cuerpo** *(dollar quoting)* | ✗ **no existe.** El cuerpo va desnudo entre `BEGIN … END`. El `$$` que sí se ve en MySQL es **otra cosa**: el argumento de `DELIMITER`, que es un comando **del cliente**, no del servidor | seguro | Clase 10 slides 6, 7, 12, 13 |
| **`LANGUAGE plpgsql`** | ✗ no existe: MySQL tiene **un solo** lenguaje procedural, sin nombre y sin cláusula que lo declare | seguro | Clase 10 slides 6, 12, 13 |
| **`OR REPLACE`** | ✗ en MySQL 8.x no existe → `DROP PROCEDURE IF EXISTS f;` seguido del `CREATE` | **alta** · en 9.7: **pendiente de verificar** | Clase 10 slide 7 |
| *(ausente en el deck)* | (crítico) **`DELIMITER $$` … `END$$` … `DELIMITER ;`** — sin eso el cliente corta la definición en el primer `;` interno y el `CREATE` falla con un error de sintaxis que no dice nada útil. **Es obligatorio y no lo menciona ningún slide** | seguro | razonamiento propio · ya estaba en § *5.3* |
| *(ausente en el deck)* | (crítico) **Características obligatorias de una `FUNCTION` con *binary logging*:** sin `DETERMINISTIC`, `NO SQL` o `READS SQL DATA` el `CREATE FUNCTION` falla con el **error 1418** *(o hay que prender `log_bin_trust_function_creators`)*. (clave) **Es el primer muro del TP7 punto 3.d** | **alta** — el número de error y el default en 9.7: **pendiente de verificar** | razonamiento propio |
| `Select Sumador(19);` | ✓ **igual**, para una `FUNCTION` | seguro | Clase 10 slide 7 |
| `select * from VoluntariosPorApellido('co');` | ✗ **no se puede hacer `FROM` de una función.** El sustituto es un `PROCEDURE` invocado con `CALL VoluntariosPorApellido('co');`, que devuelve **el result set de su último `SELECT`** | seguro | Clase 10 slides 12–13 |
| `unc_esq_voluntario.voluntario` *(esquema.tabla)* | (atención) **corre, pero significa otra cosa**: en MySQL *schema* **es** *database*, así que `unc_esq_voluntario` sería **otra base**, no un espacio de nombres dentro de la misma | seguro | Clase 10 slides 12–13 |

#### 6.2 · Declaración de variables

| Del deck 10 | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- |
| `DECLARE` como **sección previa a `BEGIN`** | (atención) **al revés**: en MySQL el `DECLARE` va **adentro** del `BEGIN … END`, en sus primeras líneas | seguro | Clase 10 slides 8, 11 |
| `numero1 ALIAS FOR $1;` · `RETURN $1 + 1;` | ✗ no existen ni `ALIAS FOR` ni `$1`: los parámetros **se nombran en la firma** y se usan por nombre — que es exactamente lo que hace el **segundo** ejemplo del slide 7 (`unNumero`), y ése **sí** traduce | seguro | Clase 10 slides 7–8 |
| `constante CONSTANT integer := 100;` | ✗ **MySQL no tiene constantes** → `DECLARE constante INT DEFAULT 100;` *(y confiar en no reasignarla)* | seguro | Clase 10 slide 8 |
| `resultado INTEGER;` | ✓ `DECLARE resultado INT;` | seguro | Clase 10 slide 8 |
| `resultado_txt TEXT DEFAULT 'Texto por defecto';` | (atención) `DECLARE resultado_txt VARCHAR(100) DEFAULT 'Texto por defecto';` — **el `DEFAULT` sí existe**; lo dudoso es `TEXT` como tipo de una **variable local**. Usar `VARCHAR(n)`, que es seguro | `DEFAULT`: seguro · `TEXT` local: **pendiente de verificar** | Clase 10 slides 8, 11 |
| (crítico) **`tipo_reg voluntario%rowtype;`** | ✗ **no existe: MySQL no tiene tipo registro.** Se declara **una variable por columna** y se usa `SELECT c1, c2 INTO v1, v2` / `FETCH cur INTO v1, v2` | seguro | Clase 10 slides 8, 11 |
| (crítico) **`tipo_col voluntario.nombre%type;`** | ✗ **no existe**: hay que **repetir el tipo a mano**, y mantenerlo sincronizado si la tabla cambia | seguro | Clase 10 slide 8 |
| `var_r record;` | ✗ **no existe** el tipo `record` | seguro | Clase 10 slide 13 |
| `:=` como asignación | (atención) dentro de una rutina la asignación es **`SET v = expr;`** *(o `SELECT … INTO v`)*. El `:=` existe en MySQL, pero es para **variables de usuario** (`@x := 1`) | seguro | Clase 10 slides 8, 13 |
| *(ausente en el deck)* | (crítico) **El orden de los `DECLARE` es rígido**: primero las variables, después las *conditions*, después los **cursores**, y **al final los handlers**. Fuera de ese orden el `CREATE` no compila | **alta** | razonamiento propio |
| Comentarios `// …` | ✗ **no son comentario en ningún motor** —ni PL/pgSQL ni MySQL los aceptan— → `-- …` o `/* … */` *(MySQL además acepta `#`)* | seguro | Clase 10 slides 8, 9, 18 |

#### 6.3 · Cursores — el bloque que más cambia

| Del deck 10 | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- |
| `curs1 refcursor;` *(cursor genérico)* | ✗ **no existe: MySQL no tiene variables de tipo cursor.** Un cursor es una declaración, no un valor — no se asigna, no se pasa como parámetro y no se devuelve | seguro | Clase 10 slide 9 |
| `curs2 CURSOR FOR SELECT * from voluntario;` | (atención) `DECLARE curs2 CURSOR FOR SELECT * FROM voluntario;` — (clave) **es la única línea de todo el bloque de cursores que casi traduce**: sólo hay que anteponerle `DECLARE` | seguro | Clase 10 slide 9 |
| `curs3 CURSOR (key int) IS SELECT … where id = key;` | ✗ **doblemente inválido**: el `IS` **es de Oracle** *(el propio slide da la gramática con `FOR` cuatro líneas más arriba: se contradice solo)*, y **MySQL no admite cursores con parámetros**. Sustituto: una variable local, asignada **antes** del `OPEN`, referenciada desde el `SELECT` del cursor | seguro | Clase 10 slide 9 |
| `OPEN curs1 for select * from Pais;` *(abrir con una query al vuelo)* | ✗ **no existe**: el `OPEN` de MySQL no lleva query — la consulta queda fijada en el `DECLARE` | seguro | Clase 10 slide 10 |
| `OPEN curs1 for execute "select * from Pais";` *(cursor dinámico)* | ✗ **no existe.** MySQL tiene `PREPARE`/`EXECUTE`, pero **no se puede abrir un cursor sobre un *prepared statement***; y las *prepared statements* **no se admiten dentro de funciones ni de triggers** *(sí en procedimientos)* | **alta** | Clase 10 slide 10 |
| `OPEN curs3(4444);` | ✗ cae con el cursor parametrizado, dos filas más arriba | seguro | Clase 10 slide 10 |
| `OPEN curs2;` · `Fetch curs2 into variable;` · `Close curs2;` | ✓ **iguales** *(`FETCH [NEXT] FROM cur INTO …`)*. Un `FETCH … INTO` necesita **tantas variables como columnas** — y como no hay `%rowtype`, hay que enumerarlas todas a mano | seguro | Clase 10 slides 10–11 |
| (crítico) **`if FOUND then`** — *"Utilizar la variable **FOUND** para ver si trajo una fila o no"* | ✗ **`FOUND` no existe en MySQL.** El reemplazo no es una variable sino **un handler declarado**: `DECLARE done INT DEFAULT 0;` + `DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;`, y después del `FETCH` se pregunta `IF done = 0 THEN …`. (atención) **La condición queda invertida respecto del deck**: `FOUND` es *"trajo fila"* y `done` es *"se acabó"* | seguro | Clase 10 slides 10–11 |
| *(ausente en el deck)* | Para **DML** *(no para `FETCH`)* el análogo de `FOUND` es **`ROW_COUNT()`**; el detalle lo da `GET DIAGNOSTICS` | **alta** | razonamiento propio |

#### 6.4 · Control de flujo y funciones que devuelven tablas

| Del deck 10 | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- |
| `IF … THEN … END IF;` | ✓ **igual** | seguro | Clase 10 slides 11, 13 |
| **`elsif`** | (atención) MySQL escribe **`ELSEIF`**, en una sola palabra *(PL/pgSQL acepta las dos grafías; el deck lo lista como si fuera del estándar)* | seguro | Clase 10 slide 4 |
| `WHILE` · `LOOP` · `REPEAT` | ✓ existen los tres: `WHILE … DO … END WHILE;`, `[etiqueta:] LOOP … END LOOP;`, `REPEAT … UNTIL … END REPEAT;` — con `LEAVE` / `ITERATE` sobre etiqueta | seguro | Clase 10 slide 4 |
| (crítico) **`FOR var_r IN (SELECT …) LOOP … END LOOP;`** | ✗ **MySQL no tiene `FOR` de ninguna clase**, ni numérico ni sobre un resultado. Hay que **reescribirlo entero** como cursor + `LOOP` + handler `NOT FOUND`. **Es la reescritura más cara del deck** | seguro | Clase 10 slides 4, 13 |
| **`RETURNS TABLE(col tipo, …)`** | ✗ **no existe**: una `FUNCTION` de MySQL devuelve **un escalar**. Sustituto: un `PROCEDURE` cuyo último `SELECT` **es** el result set | seguro | Clase 10 slides 12–13 |
| **`RETURN QUERY SELECT …`** | ✗ no existe → dentro de un `PROCEDURE`, **el `SELECT` a secas** ya emite el result set | seguro | Clase 10 slide 12 |
| **`RETURN NEXT;`** *(acumular fila a fila)* | ✗ no existe. Sustituto: **tabla temporal** — `CREATE TEMPORARY TABLE …`, `INSERT` adentro del loop, `SELECT * FROM …` al final | seguro | Clase 10 slide 13 |
| `RETURN escalar;` | ✓ **igual**, y **sólo válido dentro de una `FUNCTION`**: un `PROCEDURE` no retorna valor *(sale con `LEAVE` y devuelve por parámetros `OUT`)* | seguro | Clase 10 slide 7 |
| Asignar a la columna de salida (`nro_voluntario := var_r.nro_voluntario;`) | — no aplica: sin `RETURNS TABLE` no hay columnas de salida que asignar | seguro | Clase 10 slide 13 |
| `i % x = 0` | ✓ **igual** *(`%` y `MOD` son sinónimos)* | seguro | Clase 10 slide 13 |

#### 6.5 · Expresiones, tipos y funciones

| Del deck 10 | Motor de origen | En **MySQL** | Certeza | De dónde salió |
| --- | --- | --- | --- | --- |
| (crítico) **Concatenación `\|\|`** | estándar / PostgreSQL | ✗ **en MySQL `\|\|` es el OR lógico** → `CONCAT(a, ', ', b)`. (atención) **No falla: devuelve otra cosa** — el peor tipo de incompatibilidad, porque no hay error que avise. *(Con `sql_mode = PIPES_AS_CONCAT` cambiaría, pero no es el default)* | seguro | Clase 10 slide 12 |
| `LIKE ('%'\|\|upper(x)\|\|'%')` | PostgreSQL | (atención) `LIKE CONCAT('%', UPPER(x), '%')` | seguro | Clase 10 slide 12 |
| **`cast( … as varchar)`** | PostgreSQL | (crítico) **el `CAST` de MySQL no acepta `VARCHAR`** → **`CAST(… AS CHAR)`**. Los destinos válidos son `CHAR`, `SIGNED`, `UNSIGNED`, `DECIMAL`, `DATE`, `DATETIME`, `TIME`, `BINARY`, `JSON`… | **alta** · la lista exacta en 9.7: **pendiente de verificar** | Clase 10 slide 12 |
| `::` *(cast abreviado)* | PostgreSQL | — **no aparece en este deck**; se anota porque aparece en otros: MySQL **no tiene `::`**, sólo `CAST()` / `CONVERT()` | seguro | — |
| `upper()` | estándar | ✓ `UPPER()` | seguro | Clase 10 slide 12 |
| (nota) **`months_between ( sysdate, fecha_nacimiento )`** | **Oracle** | ✗ **ninguna de las dos existe en MySQL tal como está** → **`TIMESTAMPDIFF(MONTH, fecha_nacimiento, CURDATE())`**. (atención) **El orden de los argumentos se invierte**: `TIMESTAMPDIFF(unidad, desde, hasta)`. *(MySQL sí tiene `SYSDATE()`, **con paréntesis**, y no es igual a `NOW()`: se evalúa al ejecutarse, no al empezar la sentencia)* | seguro | Clase 10 slide 17 |
| `TEXT` como tipo | ambos | (atención) existe como tipo de **columna**; como **variable local**, usar `VARCHAR(n)` | **pendiente de verificar** | Clase 10 slides 8, 11 |
| `numeric(p,s)` / `varchar(n)` | estándar | ✓ `DECIMAL(p,s)` es sinónimo de `NUMERIC`; `VARCHAR(n)` igual | seguro | Clase 10 slides 12–13 |
| Comillas curvas en los literales | — *(artefacto de PowerPoint)* | ✗ **no parsean en ningún motor.** Reescribir con `'` rectas antes de ejecutar nada del deck | seguro | Clase 10 slides 10–11 |

> [!bug] Además del motor, el deck 10 trae **erratas de tipeo** que no son diferencias de dialecto
> No son "PostgreSQL vs. MySQL": **no compilan en ningún lado**, y conviene no perder tiempo buscándoles
> traducción. El slide **11** escribe `cursor cur1 for select …` con las palabras **invertidas** *(la
> forma es `cur1 CURSOR FOR …`)* y `menaje` por `mensaje`; el **10** escribe `OPEN CURSOS FOR EXECUTE`
> por `CURSOR`; el **13** cierra con `$$; LANGUAGE plpgsql;`, con un `;` de más que deja el `LANGUAGE`
> fuera de la sentencia *(comparar con el 12, que lo pone antes del `AS $$`)*; y el **20** linkea
> `postgresql.com`, cuando el sitio oficial es **`postgresql.org`**. Detalle slide por slide en
> [[Clase 10 - Restricciones integridad-Parte 2]].

### 7 · Seguridad — usuarios, privilegios y roles

Esta sección **invierte el sentido de las seis anteriores**: el deck de la
[[Clase 11 - Seguridad-Transacciones|Clase 11]] es el **primero escrito en MySQL por defecto** —sus
slides 8 a 13 son `CREATE USER`, `GRANT`, roles, `REVOKE` y `FLUSH PRIVILEGES` con la forma
`'usuario'@'host'`—, así que la sintaxis del slide ya es la que se tipea. Lo que hay que traducir es
al revés: **el modelo del estándar que el TP8 ejercita** —*owner*, grafo de permisos, `WITH GRANT
OPTION` por privilegio, `REVOKE … CASCADE`, `PUBLIC`— contra lo que MySQL hace, que difiere en
**cuatro puntos de modelo** y cambia la respuesta en **seis filas** de la tabla. La tabla la armó
[[Práctica 2026-09-08]] § *Cheatsheet*; aquí se consolida con la fuente de cada afirmación.

> [!important] Cómo leer esta tabla
> Columna 2: la teoría, tal como la usa el TP8 y la formaliza **GMUW 10.1** *(impresas 425–436)*.
> Columna 3: MySQL 9.7. *De dónde sale* distingue **deck** *(slide N de la Clase 11)*, **TP8**
> *(ejercicio)* y **manual 9.7** *(sección citada por número y título)*; lo que no se pudo abrir
> dice `sin verificar`. Ninguna de las tres fuentes es el contenedor: **nada de esta sección se
> ejecutó todavía en `mysql:9.7.2`** → § *Dudas abiertas*.

#### 7.1 · La tabla: teoría *(GMUW 10.1 / TP8)* vs. MySQL

| Concepto | En la teoría / SQL estándar | En **MySQL 9.7** | ¿Cambia la respuesta del TP8? | De dónde sale |
| --- | --- | --- | :---: | --- |
| **La cuenta** | un *authorization ID* (usuario) | **`'usuario'@'host'`**: el *host* es parte de la identidad. `'juan'@'localhost'` y `'juan'@'%'` son **dos cuentas**. Si se omite el host, **se asume `'%'`** *(manual: "an account name consisting only of a user name is equivalent to `'user_name'@'%'`")*. Los nombres de usuario **distinguen mayúsculas**; los de host, no | (atención) sólo operativo *(`U1` ≠ `u1`)* | deck slide 9 · manual **§ 8.2.4 *Specifying Account Names*** |
| **Crear la cuenta** | implícito en el modelo | `CREATE USER 'u'@'h' IDENTIFIED BY '…';` — **hay que hacerlo antes del primer `GRANT`**: desde 8.0 un `GRANT` a una cuenta inexistente **no la crea, falla** con **`ERROR 1410 (42000): You are not allowed to create a user with GRANT`** *(`ER_CANT_CREATE_USER_WITH_GRANT`)*. El TP8 da por existentes **diez cuentas** y crea sólo `U4` | (atención) operativo: hay que crear once cuentas | deck slide 9 · TP8 § *Setup* · manual **§ 15.7.1.6 *GRANT Statement*** · *MySQL Error Reference 9.7* |
| **Owner** | quien crea la tabla tiene **todos** los privilegios sobre ella con opción de concesión y es la **raíz del grafo** *(GMUW 10.1.5)* | ✗ **No existe.** Crear una tabla no da ningún privilegio sobre ella; los privilegios vienen de un `GRANT` global, de base o de tabla. **Para simular al owner**, `root` le da `ALL PRIVILEGES ON base.* … WITH GRANT OPTION` | (crítico) **sí**: el nodo raíz del grafo del ej. 1 y del ej. 3 **no existe en el motor** | TP8 ej. 1 y 3 · [[Práctica 2026-09-08]] § *Qué no corre*, fila 4 · manual **§ 15.7.1.6** |
| **Otorgar** | `GRANT priv ON tabla TO usuario [WITH GRANT OPTION]` | ✓ igual, con `'u'@'h'` y `base.tabla`: **`GRANT permiso ON base.tabla TO 'usuarioX'@'host' [WITH GRANT OPTION];`** | — | deck slide 10 · manual **§ 15.7.1.6** |
| **Granularidades** | tabla, o **columna** en `SELECT`/`INSERT`/`UPDATE`/`REFERENCES` | **cinco niveles**: `ON *.*` *(global)* · `ON base.*` · `ON base.tabla` · **`GRANT UPDATE (col1, col2) ON base.tabla`** *(columna)* · `ON PROCEDURE base.rutina`. El deck da una sola *(`[base].[tabla]`)*. **La de columna, que el TP8 usa en el ej. 1 y pide en 2.g/2.i, no está en ningún slide** | (atención) operativo: la sintaxis hay que sacarla del manual | deck slides 10, 13 · TP8 ej. 1, 2.g, 2.i · manual **§ 15.7.1.6** *(gramática `priv_type [(column_list)]`)* |
| **`WITH GRANT OPTION`** | se adjunta **a cada privilegio**: se puede tener `SELECT*` y `DELETE` sin `*` sobre la misma tabla | (crítico) **Es un privilegio aparte, `GRANT OPTION`, y es una marca por (cuenta, nivel)**: si se tiene sobre la tabla, sirve para re-otorgar cualquier privilegio que se tenga sobre ella. Es el elemento `'Grant'` del `SET` `Table_priv` de `mysql.tables_priv` *(y `Grant_priv` en `mysql.user`/`mysql.db`)* | (crítico) **sí**: la **sentencia 6 del ej. 1 falla en la teoría y pasa en MySQL**; en 2.c U2 puede re-otorgar también el `SELECT` de 2.b; en 3.b.2 B conserva la marca tras perder `INSERT` | TP8 ej. 1.a, 2.c, 3.b.2 · manual **§ 8.2.2 *Privileges Provided by MySQL*** · **§ 8.2.3 *Grant Tables*** *(`Table_priv` = `SET('Select','Insert','Update','Delete','Create','Drop','Grant','References','Index','Alter','Create View','Show view','Trigger')`)*. Sin resolver si aplica a nivel global, ver *Dudas* |
| **`ALL`** | `ALL PRIVILEGES` = todos los que el otorgante puede conceder *(GMUW 10.1.4)* | ✓ `ALL [PRIVILEGES]`, **pero no incluye `GRANT OPTION`** —hay que pedirla aparte con `WITH GRANT OPTION`— ni los privilegios de un nivel superior: *"todo sobre `midb`"* no es *"todo"* | (atención) en 2.a hay que escribir `WITH GRANT OPTION` explícito | deck slides 10, 13 · [[Clase 11 - Seguridad-Transacciones]] § *Slide 13* · manual **§ 15.7.1.6** *("the `GRANT OPTION` privilege enables you to assign only those privileges which you yourself possess")* |
| **Revocar** | `REVOKE priv ON tabla FROM usuario {CASCADE \| RESTRICT}`: `CASCADE` quita también lo concedido a partir de él, `RESTRICT` rechaza si dejaría huérfanos *(GMUW 10.1.6)* | (crítico) **`REVOKE permisos ON base.tabla FROM 'u'@'h';` — sin `CASCADE` ni `RESTRICT`**: la gramática del manual no los tiene. **La revocación nunca se propaga**: quitarle algo a `adm` no le quita nada a `doc`. Escribir `CASCADE` es error de sintaxis | (crítico) **sí**: 1.b y 3.b.2 se contestan **en papel**, y el enunciado del 1.b lo dice | TP8 ej. 1.b *("ya que MySQL no provee la opción CASCADE")*, 3.b.2 · deck slide 12 · manual **§ 15.7.1.8 *REVOKE Statement*** |
| **Revocar todo** | `REVOKE ALL PRIVILEGES ON tabla FROM usuario` | dos formas equivalentes que **el deck no trae**: **`REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'u'@'h';`** o `REVOKE ALL ON *.* FROM 'u'@'h';` — las dos borran *"all global, database, table, column, and routine privileges"*. El `REVOKE ALL ON midb.*` del slide 13 **sólo revoca el nivel base**: un `GRANT SELECT ON midb.log` sobreviviría | (atención) puede tocar 2.e / 2.f | deck slide 13 · manual **§ 15.7.1.8** *(cita textual)* |
| **Revocar una columna a quien tiene la tabla entera** | el estándar descompone: quedan las otras columnas | (nota) MySQL **no descompone** el privilegio de tabla: `REVOKE UPDATE(tiempo) …` a quien tiene `UPDATE` de tabla **falla**, presumiblemente con **`ERROR 1147 (42000)`** *(`ER_NONEXISTING_TABLE_GRANT`, sin verificar en el contenedor)* | (crítico) **sí**: el punto más fino del 1.b | TP8 ej. 1.b · [[Práctica 2026-09-08]] § *Qué no corre*, fila 6 · *MySQL Error Reference 9.7* |
| **`PUBLIC`** | pseudo-usuario que representa a **todos**, presentes y futuros *(GMUW 10.1, impresa 425)* | ✗ **No existe**: cero apariciones en § 15.7.1.6. Sustituto: un rol nombrado en la variable de sistema **`mandatory_roles`** —se comporta como *"granted to all users"* sin concederlo a cada cuenta—, que se fija con `SET PERSIST mandatory_roles = '…';` o en `my.cnf`, y **exige el privilegio `ROLE_ADMIN`**. O bien un `GRANT` por cuenta | (crítico) **sí**: 2.d y 2.f se contestan en la teoría; el sustituto es un extra | TP8 ej. 2.d, 2.f · manual **§ 8.2.10 *Using Roles*** › *Defining Mandatory Roles* · **§ 8.2.2** *(`ROLE_ADMIN`)* |
| **Roles** | SQL:1999: `CREATE ROLE`, `GRANT priv TO rol`, `GRANT rol TO usuario` *(Date 17.6)* | ✓ **desde MySQL 8.0**: `CREATE ROLE 'r';` · `GRANT SELECT ON base.t TO 'r';` · `GRANT 'r' TO 'u'@'h';` · `SHOW GRANTS FOR 'u'@'h' USING 'r';` · `DROP ROLE 'r';` — las seis sentencias del slide 11 son el **ejemplo oficial del manual** *(`dev1`, `dev1pass`, `app_developer`)*, **pero en un orden que no corre**: la tercera borra el rol que la segunda creó | — | deck slide 11 · manual **§ 8.2.10 *Using Roles*** |
| **Activación del rol** | un rol concedido **está activo** | (crítico) **No**: conceder un rol *"no automatically causes the role to become active within account sessions"*. Hay tres maneras: **`SET DEFAULT ROLE 'r' TO 'u'@'h';`** *(para cada conexión futura)*, **`SET ROLE 'r';`** *(en la sesión actual)*, o la variable **`activate_all_roles_on_login = ON`** *(desactivada por defecto)*. **El deck no menciona ninguna**: quien siga el slide 11 para el ej. 2.h va a ver que `U4` no puede hacer nada. Se comprueba con **`SELECT CURRENT_ROLE();`** | (crítico) **sí**: 2.h–2.j no funcionan sin este paso | deck slide 11 · TP8 ej. 2.h · manual **§ 8.2.10** › *Activating Roles* |
| **`DROP ROLE` con usuarios asignados** | los beneficiarios pierden lo que venía por el rol | ✓ igual, y se revoca **en el acto** sobre sesiones abiertas —*"its adjusted privileges apply beginning with the next statement executed"*—, no al reconectar. Las cuentas siguen existiendo con sus privilegios directos | (atención) responde 2.j | TP8 ej. 2.j · manual **§ 15.7.1.4 *DROP ROLE Statement*** |
| **`FLUSH PRIVILEGES`** | — | (nota) **Sobrante después de un `GRANT` o `REVOKE`**: el servidor ya recarga las tablas de permisos en el acto tras esas sentencias. Hace falta **sólo** tras un `INSERT`/`UPDATE`/`DELETE` directo sobre `mysql.user` y compañía, algo *"not recommended"*. El slide 12 dice *"se deben refrescar"*: no hace daño, pero enseña una causalidad falsa | — | deck slides 12, 13 · manual **§ 8.2.13 *When Privilege Changes Take Effect*** |
| **Ver el estado** | catálogo `INFORMATION_SCHEMA` | `SHOW GRANTS FOR 'u'@'h';` *(slide 11)* · `SHOW GRANTS FOR 'u'@'h' USING 'r';` *(expande el rol)* · `mysql.tables_priv` / `mysql.columns_priv` *(la marca `Grant` como valor por cuenta-nivel; `SHOW GRANTS` también la muestra, como sufijo `WITH GRANT OPTION`)* · `INFORMATION_SCHEMA.TABLE_PRIVILEGES` · `SELECT CURRENT_USER();` · `SELECT CURRENT_ROLE();` | — | deck slide 11 · manual **§ 8.2.10** › *Checking Role Privileges* · **§ 8.2.3 *Grant Tables*** · **§ 15.7.7.24 *SHOW GRANTS Statement*** |
| **`'u'@'localhost'` con el MySQL en Docker** | — | (crítico) **Desde el host anfitrión, un cliente no es `localhost` para el contenedor**: llega por la red interna de Docker. Un usuario creado como `'u'@'localhost'` no puede conectarse desde afuera; para el TP8 hay que crearlos con **`'%'`** —o entrar con `docker exec -it MyMySql mysql -u doc -p`—. (atención) El mismo § 8.2.4 marca el comodín `%` como **deprecado**, aunque en 9.7 sigue funcionando. Para MySQL, `'localhost'` *(socket Unix)* y `'127.0.0.1'` *(TCP)* son **dos cuentas**, aunque el slide 9 los junte con una "o" | (atención) operativo: muerde **antes** del primer `GRANT` | deck slide 9 · [[Clase 11 - Seguridad-Transacciones]] § *Slide 9* · § *Setup* de esta página · razonamiento propio sobre la red de Docker |

> [!important] (clave) Seis filas cambian la respuesta, y se reducen a tres diferencias de modelo más `PUBLIC`
> Las seis (crítico) de la columna *¿Cambia la respuesta?*: *owner*, `WITH GRANT OPTION`, `REVOKE`,
> `REVOKE` de una columna, `PUBLIC` y activación del rol. Tres son consecuencias de otras: el
> `REVOKE` de columna es el mismo `REVOKE` que no descompone, `PUBLIC` lo manda a la teoría el
> propio enunciado (2.d, 2.f), y la activación del rol es un paso operativo que el deck omite.
> Quedan **tres diferencias de modelo**: *owner*, `GRANT OPTION` por nivel y `REVOKE` sin cascada
> *(ítems 2, 3 y 4 de [[Práctica 2026-09-08]] § *Qué no corre*)*.
>
> Sin `CASCADE`, 1.b y 3.b.2 se contestan en papel, y el enunciado lo asume. Pero el `GRANT OPTION`
> por nivel hace que **la sentencia 6 del ej. 1 pase en MySQL y falle en la teoría** —dos respuestas
> correctas según el motor—, y la ausencia de *owner* hace que la raíz del grafo no exista en el
> motor de la cursada: es la misma forma del `FOR EACH STATEMENT` del TP7, pero más profunda —ahí
> faltaba una cláusula, acá el modelo de autorización es otro—. La respuesta recomendada es la que
> ya practican tres TPs: dos párrafos rotulados, la teoría y MySQL, nombrando la brecha.

#### 7.2 · Lo mínimo que hay que tipear para el TP8, en orden

Propuesta propia, armada sobre el § *Setup* de [[Práctica 2026-09-08]]; **no se ejecutó en el
contenedor**. Sirve para el ejercicio 2 y, con otros nombres, para el 1 y el 3.

```sql
-- 0. Sesión de administrador: docker exec -it MyMySql mysql -u root -p
-- 1. Las cuentas, ANTES de cualquier GRANT (error 1410 si no), y con '%' por Docker
--  ('%' como comodín de host está deprecado en § 8.2.4; en 9.7 sigue funcionando)
CREATE USER 'U1'@'%' IDENTIFIED BY 'u1';
CREATE USER 'U2'@'%' IDENTIFIED BY 'u2';
CREATE USER 'U3'@'%' IDENTIFIED BY 'u3';

-- 2. Privilegios de tabla, con y sin opción de concesión (2.a, 2.b, 2.c)
GRANT ALL PRIVILEGES ON voluntarios.institucion TO 'U1'@'%' WITH GRANT OPTION;
GRANT SELECT ON voluntarios.voluntario TO 'U2'@'%';
GRANT INSERT ON voluntarios.voluntario TO 'U2'@'%' WITH GRANT OPTION;  -- U0 habilita a U2…
-- …y U2, desde SU sesión, concede:  GRANT INSERT ON voluntarios.voluntario TO 'U3'@'%';

-- 3. Privilegio de columna (2.g / 2.i) — la forma que ningún slide muestra
CREATE ROLE 'ins_vol';
GRANT UPDATE (horas_aportadas) ON voluntarios.voluntario TO 'ins_vol';

-- 4. Rol → usuario, y el paso que el slide 11 omite
CREATE USER 'U4'@'%' IDENTIFIED BY 'u4';
GRANT 'ins_vol' TO 'U3'@'%', 'U4'@'%';
SET DEFAULT ROLE 'ins_vol' TO 'U3'@'%', 'U4'@'%';  -- sin esto, el rol está pero no actúa

-- 5. Revocar (2.e, 2.f): sin CASCADE, y nunca se propaga
REVOKE DELETE ON voluntarios.institucion FROM 'U1'@'%';

-- 6. Ver qué quedó
SHOW GRANTS FOR 'U3'@'%' USING 'ins_vol';
SELECT User, Host, Db, Table_name, Table_priv, Column_priv FROM mysql.tables_priv;
SELECT User, Host, Db, Table_name, Column_name, Column_priv FROM mysql.columns_priv;
-- FLUSH PRIVILEGES;  ← no hace falta: ninguna de las sentencias de arriba tocó mysql.* a mano
```

> [!warning] Un efecto secundario que el deck no dice y muerde en § *8*
> **`CREATE USER`, `GRANT`, `REVOKE`, `DROP USER` y `ALTER USER` hacen *commit* implícito**: el manual
> los lista bajo el rótulo *"Statements that implicitly use or modify tables in the `mysql` database"*
> *(`ALTER USER`, `CREATE USER`, `DROP USER`, `GRANT`, `RENAME USER`, `REVOKE`, `SET PASSWORD`)*, y todos
> los de esa sección *"implicitly end any transaction active in the current session, as if you had done
> a `COMMIT` before executing the statement"* *(manual 9.7, **§ 15.3.3 *Statements That Cause
> an Implicit Commit***, verificado el 16/09)*. No hay forma de probar un `GRANT` dentro de una
> transacción y deshacerlo con `ROLLBACK`: **se deshace con `REVOKE`**, y sin cascada.

### 8 · Transacciones — lo que el deck 11 no trae en MySQL

> [!missing] (crítico) El deck define transacción, ACID, estados, anomalías y niveles de aislamiento en 17 slides, **y no escribe ni una transacción en MySQL**
> Sus únicos `BEGIN … COMMIT` son el de **SQL Server** *(slide 29)* y el de **PostgreSQL** *(slide 30)*.
> Ni `START TRANSACTION`, ni `ROLLBACK` en código, ni `autocommit`, ni `SET TRANSACTION ISOLATION
> LEVEL`, ni que **InnoDB arranca en `REPEATABLE READ`**, ni que las lecturas comunes no bloquean.
> Es la ausencia que [[Clase 11 - Seguridad-Transacciones]] dejó anotada como *"queda para un § 7 de
> [[MySQL]], todavía por escribir"* — es este § 8. Todo lo que sigue está verificado contra el manual
> 9.7, salvo donde dice lo contrario; **nada se ejecutó todavía en el contenedor**.

#### 8.1 · Abrir, confirmar, deshacer

| Del deck *(slides 14 y 19)* | En **MySQL 9.7** | Nota | De dónde sale |
| --- | --- | --- | --- |
| *"inicio transacción"* · `INICIO DE TRANSACION` **[sic]** | **`START TRANSACTION;`** — o `BEGIN;` / `BEGIN WORK;`, que son alias | es la sintaxis SQL estándar, la forma recomendada para una transacción *ad hoc*, y admite modificadores que `BEGIN` no *(`WITH CONSISTENT SNAPSHOT`, `READ ONLY`, `READ WRITE`)* | manual **§ 15.3.1 *START TRANSACTION, COMMIT, and ROLLBACK Statements*** |
| `LEER` / `ESCRIBIR` | `SELECT` / `INSERT`, `UPDATE`, `DELETE` | sólo sobre tablas **transaccionales** (InnoDB, NDB); una tabla MyISAM **no participa** | manual **§ 15.3.1** |
| `CONFIRMAR (Commit)` | **`COMMIT;`** | también `COMMIT AND CHAIN` / `AND NO RELEASE` *(no hacen falta en la cursada)* | manual **§ 15.3.1** |
| `ABORTAR (Rollback)` | **`ROLLBACK;`** | deshacer **parcialmente**: `SAVEPOINT nombre;` … `ROLLBACK TO SAVEPOINT nombre;` *(Date 15.7 *Savepoints*; sección del manual sin verificar)* | manual **§ 15.3.1** · Date 15.7 |
| `FIN DE LA TRANSACION` **[sic]** | *(no hay sentencia)* | es el instante anterior al `COMMIT` — el estado *"parcialmente confirmada"* del slide 18 | [[Clase 11 - Seguridad-Transacciones]] § *Slide 19* |
| *(ausente en el deck)* | (crítico) **`autocommit = 1` por defecto**: cada sentencia suelta es su propia transacción y se confirma sola | `START TRANSACTION` lo suspende hasta el `COMMIT`/`ROLLBACK`; `SET autocommit = 0;` lo apaga para la sesión | manual **§ 15.3.1** |
| *(ausente en el deck)* | (crítico) **El DDL hace *commit* implícito** — `CREATE`/`ALTER`/`DROP TABLE`, `CREATE`/`DROP INDEX`, `TRUNCATE`, `RENAME TABLE`… — **y también las sentencias de cuentas** *(`CREATE USER`, `GRANT`, `REVOKE`…)* y `LOCK TABLES` | excepción: `CREATE TEMPORARY TABLE` / `DROP TEMPORARY TABLE` **no** confirman | manual **§ 15.3.3 *Statements That Cause an Implicit Commit*** |
| *(ausente en el deck)* | (atención) **Dentro de un *stored program*, `BEGIN` no abre una transacción**: el parser lo trata como el inicio de un bloque `BEGIN … END` | muerde en el § *6* de esta página: en un `PROCEDURE` hay que escribir `START TRANSACTION`, nunca `BEGIN` | manual **§ 15.3.1** |

#### 8.2 · Niveles de aislamiento y lo que InnoDB hace de verdad

| Del deck *(slide 28)* | En **MySQL 9.7 / InnoDB** | De dónde sale |
| --- | --- | --- |
| Los cuatro niveles del estándar, en prosa | los **mismos cuatro** nombres: `READ UNCOMMITTED` · `READ COMMITTED` · `REPEATABLE READ` · `SERIALIZABLE` | manual **§ 15.3.7 *SET TRANSACTION Statement*** |
| *(no dice el nivel por defecto)* | (crítico) **`REPEATABLE READ`** es el default de InnoDB. **No `READ COMMITTED`** como en PostgreSQL, Oracle y SQL Server *(razonamiento propio sobre esos tres motores)* | manual **§ 15.3.7** y **§ 17.7.2.1 *Transaction Isolation Levels*** |
| *(no dice cómo se cambia)* | **`SET TRANSACTION ISOLATION LEVEL nivel;`** → sólo la **próxima** transacción · **`SET SESSION TRANSACTION ISOLATION LEVEL …`** → toda la sesión · **`SET GLOBAL …`** → sesiones nuevas | manual **§ 15.3.7** |
| *(no dice cómo se consulta)* | **`SELECT @@SESSION.transaction_isolation;`** · `SELECT @@GLOBAL.transaction_isolation;` — devuelve `REPEATABLE-READ` con guion | manual **§ 15.3.7** *(formato con guion: sin verificar en el contenedor)* |
| *"Exclusive Lock: Nadie más puede leer ni modificar el dato"* *(slide 25)* | (crítico) **Falso en InnoDB para los `SELECT` comunes.** InnoDB es **multiversión**: guarda versiones previas de las filas para construir lecturas consistentes. Un `SELECT` sin `FOR UPDATE` **no pide bloqueo**: **los lectores no bloquean a los escritores ni al revés**. El modelo del slide es el de GMUW 18.4, no el del motor de la cursada | manual **§ 17.3 *InnoDB Multi-Versioning*** · [[Clase 11 - Seguridad-Transacciones]] § *Slide 25* |
| *"Repeatable Read … no previene las lecturas fantasma"* | (nota) **En la práctica, para las lecturas consistentes, InnoDB no las muestra**: lee la instantánea de la primera lectura de la transacción. Si el parcial pregunta *"según la teoría"*, vale el slide; si pregunta *"en MySQL"*, la respuesta es la contraria — el mismo patrón del `FOR EACH STATEMENT` del TP7. Para **lecturas con bloqueo, `UPDATE` y `DELETE`**, la misma sección agrega *gap locks* / *next-key locks* que bloquean inserciones de otras sesiones en el rango escaneado | manual **§ 17.7.2.1**. Sin verificar quedan § 17.7.1 *InnoDB Locking* y § 17.7.4 *Phantom Rows* |
| *"Serializable: … tratando las transacciones como si fueran serializadas"* | en InnoDB **convierte cada `SELECT` común en `SELECT … FOR SHARE`** si `autocommit` está desactivado: es el único nivel donde **leer bloquea** | manual **§ 17.7.2.1** |
| *(el slide 15 lista "control de la concurrencia" como fallo, sin nombrar deadlocks)* | InnoDB **detecta el deadlock y aborta una** de las transacciones con **`ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction`** *(`ER_LOCK_DEADLOCK`)* | *MySQL Error Reference 9.7* · cuál transacción se elige *("la que hizo menos trabajo")*: sin verificar |

#### 8.3 · Lectura con bloqueo: el slide 30 corre tal cual

| | SQL Server *(slide 29)* | PostgreSQL *(slide 30)* | **MySQL 9.7** | De dónde sale |
| --- | --- | --- | --- | --- |
| Abrir | `BEGIN TRANSACTION;` | `BEGIN;` | `START TRANSACTION;` *(o `BEGIN;`)* | manual § 15.3.1 |
| Leer bloqueando | `SELECT * FROM productos WITH (UPDLOCK);` | `SELECT * FROM productos FOR UPDATE;` | ✓ **`SELECT … FOR UPDATE`, idéntico a PostgreSQL**: bloquea las filas y sus entradas de índice, igual que un `UPDATE`; otras transacciones no pueden modificarlas ni hacer `SELECT ... FOR SHARE` sobre ellas | manual **§ 17.7.2.4 *Locking Reads*** |
| El modo compartido | `WITH (HOLDLOCK)` *(no está en el deck)* | `FOR SHARE` | **`SELECT … FOR SHARE`**: otras sesiones pueden leer las filas pero no modificarlas hasta el commit. *(`LOCK IN SHARE MODE` es la grafía vieja y **9.7 la sigue aceptando** como equivalente; `FOR SHARE` además admite `OF table_name`, `NOWAIT` y `SKIP LOCKED`)* | manual **§ 17.7.2.4** |
| Modificar | `UPDATE productos SET stock = stock - 1 WHERE id = 1;` | ídem | ídem | deck |
| Cerrar | `COMMIT TRANSACTION;` | `COMMIT;` | `COMMIT;` — y ahí se sueltan los bloqueos de `FOR SHARE` y `FOR UPDATE` | manual **§ 17.7.2.4** |
| ¿Corre en MySQL tal cual? | ✗ `WITH (UPDLOCK)` y `… TRANSACTION` son T-SQL | ✓ **sin cambiar una letra** | — | [[Clase 11 - Seguridad-Transacciones]] § *Slides 29–30* |

```sql
-- El slide 30, ya en MySQL y con el WHERE que el ejemplo omite (sin WHERE bloquea todas las filas)
START TRANSACTION;
SELECT * FROM productos WHERE id = 1 FOR UPDATE;  -- bloqueo de actualización sobre esa fila
UPDATE productos SET stock = stock - 1 WHERE id = 1;
COMMIT;
```

> [!warning] Dos condiciones del `FOR UPDATE` que el slide no dice
> 1. **Sólo funciona con `autocommit` apagado** (manual § 17.7.2.4). Un `SELECT … FOR UPDATE`
> suelto, fuera de transacción, **suelta el bloqueo en el acto** y no protege nada.
> 2. **`NOWAIT` y `SKIP LOCKED`** existen: el primero falla si la fila está bloqueada, el segundo
> la saca del resultado (§ 17.7.2.4). No están en ningún deck; responden a *"¿y si no quiero
> esperar?"*.
>
> Y el rótulo del slide 30 está mal en cualquier motor: `FOR UPDATE` es un **bloqueo pesimista**,
> no *"control de versiones"* → [[Clase 11 - Seguridad-Transacciones]] § *Contradicciones internas*.

#### 8.4 · Índices: el `CREATE INDEX` del slide 35 y el `USING HASH` del 38

Es el bloque de índices que el deck 11 trae sin anunciar *(slides 31–38)*, y **cierra el hueco (crítico)
del § *4*** de esta página. La teoría va a [[1.08.02 - Índices|Índices]]; aquí, sólo lo que se tipea.

| Del deck | En **MySQL 9.7** | ¿Corre? | De dónde sale |
| --- | --- | :---: | --- |
| `create index <nombre-índice> on <nombre-tabla> (<lista-atributos>)` *(slide 35)* | **`CREATE INDEX nombre ON tabla (col1, col2, …);`** | ✓ idéntico | manual **§ 15.1.18 *CREATE INDEX Statement*** |
| **`drop index <nombre-índice>`** *(slide 35)* | **`DROP INDEX nombre ON tabla;`** — el `ON tabla` es **obligatorio** | ✗ sin `ON` es error de sintaxis — **el más visible de los tres lugares del deck que no corren en MySQL y no lo avisan** *(los otros dos: el orden del `DROP ROLE` del slide 11 y los guiones de la fila siguiente)* | [[Clase 11 - Seguridad-Transacciones]] § *Slide 35* · manual § *DROP INDEX Statement*: **título y número sin verificar** *(no se abrió)* |
| `create index índice-s on sucursal (nombre-sucursal)` | los identificadores con **guion** exigen backticks: `` CREATE INDEX `índice-s` ON sucursal (`nombre-sucursal`); `` | ✗ sin `` ` `` | razonamiento propio *(`-` no es carácter de identificador)* |
| — | la forma alternativa: `ALTER TABLE tabla ADD INDEX nombre (cols);` / `ALTER TABLE tabla DROP INDEX nombre;` *(es la que § *1 · DDL* ya daba para el borrado)* | ✓ | § *1* de esta página · manual: **sin verificar** |
| `CREATE INDEX MYINDEX ON USERS (DNI) USING HASH;` *(slide 38, "Ejemplo en MySQL")* | (crítico) **Sintaxis correcta, resultado distinto del prometido.** La *Table 15.1 Index Types Per Storage Engine* del manual dice `InnoDB → BTREE` *(sólo)*, `MyISAM → BTREE`, `MEMORY/HEAP → HASH, BTREE`, `NDB → HASH, BTREE`; si el tipo pedido no es válido para el motor, se usa el disponible sin fallar. O sea: **sobre una tabla InnoDB la sentencia no falla y crea un B-tree**; `SHOW INDEX FROM USERS` debería devolver `Index_type = BTREE` *(sin verificar en el contenedor)*. Para un hash de verdad, la tabla tiene que ser `ENGINE = MEMORY` | (atención) corre, pero **ignora el `USING HASH` en silencio** — la misma clase de incompatibilidad que el `\|\|` del deck 10 | manual **§ 15.1.18** |

---

## Bibliografía de MySQL — el manual 9.7, que linkea la cátedra

> [!success] La única bibliografía del lado MySQL que tiene el vault
> Los libros de la materia son de PostgreSQL y de NoSQL; el enunciado del TP5 linkea dos secciones
> del **MySQL 9.7 Reference Manual** —el manual de **la versión del contenedor**, `mysql:9.7.2`—.

| Sección | Título del ancla, textual | URL |
| --- | --- | --- |
| **§ 15.8.2** | *"MySQL :: MySQL 9.7 Reference Manual :: 15.8.2 EXPLAIN Statement"* | <https://dev.mysql.com/doc/refman/9.7/en/explain.html#explain-execution-plan> |
| **§ 10.3.9** | *"MySQL :: MySQL 9.7 Reference Manual :: 10.3.9 Comparison of B-Tree and Hash Indexes"* | <https://dev.mysql.com/doc/refman/9.7/en/index-btree-hash.html> |

Las dos URLs y los dos títulos de ancla salen de las anotaciones del PDF del TP5 →
[[Práctica 2026-08-18]] § *Bibliografía asignada por la cátedra*.

> [!note] Secciones del manual 9.7 que abrió el vault para los §§ 7 y 8 (no las asignó la cátedra)
> Leídas en `dev.mysql.com/doc/refman/9.7/en/`; son la bibliografía de facto de la Clase 11 del lado
> MySQL, y ninguna aparece en un deck ni en un TP:
>
> | § | Título | Cierra |
> | --- | --- | --- |
> | **8.2.2** | *Privileges Provided by MySQL* | `GRANT OPTION` como privilegio; `CREATE ROLE`, `DROP ROLE`, `ROLE_ADMIN` |
> | **8.2.3** | *Grant Tables* | `mysql.tables_priv.Table_priv` con el elemento `'Grant'`; `columns_priv` |
> | **8.2.4** | *Specifying Account Names* | host omitido → `'%'`; usuario sensible a mayúsculas |
> | **8.2.10** | *Using Roles* | activación *(`SET DEFAULT ROLE`, `SET ROLE`, `activate_all_roles_on_login`)*, `mandatory_roles`, `SHOW GRANTS … USING`, `CURRENT_ROLE()` |
> | **8.2.13** | *When Privilege Changes Take Effect* | `FLUSH PRIVILEGES` innecesario tras `GRANT`/`REVOKE` |
> | **15.7.1.6** | *GRANT Statement* | privilegios de columna; sin `PUBLIC` |
> | **15.7.1.8** | *REVOKE Statement* | sin `CASCADE`/`RESTRICT`; `REVOKE ALL PRIVILEGES, GRANT OPTION` |
> | **15.7.1.4** | *DROP ROLE Statement* | efecto sobre cuentas y sesiones abiertas |
> | **15.3.1** | *START TRANSACTION, COMMIT, and ROLLBACK Statements* | `autocommit`, `BEGIN` como alias y su trampa en *stored programs* |
> | **15.3.3** | *Statements That Cause an Implicit Commit* | DDL **y sentencias de cuentas** confirman |
> | **15.3.7** | *SET TRANSACTION Statement* | niveles, alcance *(próxima / sesión / global)*, `@@transaction_isolation`, default |
> | **17.3** | *InnoDB Multi-Versioning* | MVCC: por qué un `SELECT` no bloquea |
> | **17.7.2.1** | *Transaction Isolation Levels* | `REPEATABLE READ` por defecto, instantánea, `SERIALIZABLE` → `FOR SHARE` |
> | **17.7.2.4** | *Locking Reads* | `FOR UPDATE`, `FOR SHARE`, `NOWAIT`, `SKIP LOCKED` |
> | **15.1.18** | *CREATE INDEX Statement* | *Table 15.1 Index Types Per Storage Engine*: InnoDB sólo `BTREE` |
> | — | *MySQL Error Reference 9.7* › *Server Error Message Reference* | errores **1410**, **1141**, **1147**, **1213**, **1175** *(el **3523** quedó fuera de la parte visible: `sin verificar`)* |
>
> | **15.7.7.24** | *SHOW GRANTS Statement* | *(abierta el **18/09**)* la marca `Grant` aparece como sufijo `WITH GRANT OPTION` de cada línea |
>
> **Sigue sin abrir**: § *DROP INDEX Statement*, § *SAVEPOINT*, § 17.7.1 *InnoDB Locking* *(tipos de
> lock)*, § 17.7.4 *Phantom Rows*, y las cinco secciones del § *5.4* *(`CHECK`, `FOREIGN KEY`,
> `CREATE TRIGGER`, `CREATE PROCEDURE`, *Compound Statement Syntax*)*, que siguen `sin verificar`.

> [!note] Qué cubre cada una — y qué no
> La **§ 15.8.2** es la referencia de `EXPLAIN`. La **§ 10.3.9** compara **B-tree contra hash**,
> exactamente el recorte de tipos de índice que pide la cursada *(no hay GiST, ni bitmap, ni
> full-text: eso es PostgreSQL)*. **Ninguna trae DDL de creación de índices**, así que el hueco
> (crítico) de arriba no se cierra con esta lectura.

> [!warning] La teoría de índices, en cambio, la cátedra la asigna sobre **PostgreSQL**
> El ejercicio 2 del TP5 manda leer *Seven Databases* **cap. 2.2** —§ *Fast Lookups with Indexing*,
> pp. 18–21 impresas— con esta aclaración del enunciado: *"si bien el libro hace mención a
> PostgreSQL, también aplica para MySQL"*. La traducción de motor hay que hacerla también en la
> bibliografía: el libro escribe `CREATE INDEX … USING hash (…)`, sintaxis de PostgreSQL. Lo que sí
> se transfiere entero es el concepto: al declarar una PK el motor crea un índice automáticamente, y
> en particular un B-tree.

---

## Lo que es propio de MySQL y no está en ningún deck

> [!note] Ampliación, no está en el material
> Estas **siete** cosas no las dice ningún slide, pero muerden en el TP. Están recogidas de las páginas
> de clase, donde ya figuran rotuladas como razonamiento propio. **Confirmar antes de usarlas en el
> parcial.**

1. **`SET SQL_SAFE_UPDATES = 0;`** — MySQL Workbench viene con el modo *safe updates* activo: un
  `UPDATE` o `DELETE` que no filtre por una columna con índice se rechaza con el **error 1175**. Los
  ejemplos del slide 9 de la [[Clase 04 - AlteraciónActualizaciónTablas|Clase 04]] (`UPDATE Curso SET duracion = duracion + 20;` y
  `DELETE FROM Ofrece;`) son exactamente ese caso. Conviene volver a poner `1` después.

2. **El DDL hace `COMMIT` implícito.** Un `ALTER TABLE` o un `DROP TABLE` **no se deshace con
  `ROLLBACK`** y además cierra la transacción abierta. En PostgreSQL el DDL **sí** es transaccional.
  Consecuencia directa: el truco `BEGIN; EXPLAIN ANALYZE CREATE TABLE AS …; ROLLBACK;` que propone el
  slide 1 del deck de explain plan **no funciona en MySQL** → [[Clase 08 - Explicando el plan]].
  *(Verificado contra manual 9.7 § 15.3.3 *Statements That Cause an Implicit Commit*; la lista
  incluye también `CREATE USER`, `GRANT` y `REVOKE` → § *7.2* y § *8.1*.)*

3. **`SET FOREIGN_KEY_CHECKS = 0;`** — como `DROP TABLE … CASCADE` no hace nada, borrar un esquema con
  FK exige o bien soltar las FK a mano y borrar en orden inverso (lo que hace el encabezado comentado
  de `esq_peliculas.sql`), o bien desactivar el chequeo, borrar y reactivarlo.

4. **`ALGORITHM = MERGE` vs. `TEMPTABLE` en vistas.** MySQL resuelve una vista fusionando su definición
  con la consulta del usuario (`MERGE`) o materializándola en una tabla temporal (`TEMPTABLE`). **Solo
  las vistas resueltas por `MERGE` son actualizables** — de ahí que `ALGORITHM = TEMPTABLE` aparezca en
  la lista de "vista no actualizable" del slide 13 del deck 07.

5. **`DELIMITER` es un comando del *cliente*, no del servidor.** No es SQL: lo interpreta el programa
  `mysql` (y Workbench) para saber dónde termina una sentencia. Por eso hace falta al definir
  triggers, procedimientos y funciones —cuyo cuerpo tiene `;` adentro— y por eso **no aparece en
  ningún manual de sintaxis SQL ni en ningún slide**. Ya estaba dicho en el callout de § *5.3*; entra
  acá porque es exactamente el tipo de cosa que esta lista recoge.

6. **El orden de los `DECLARE` dentro de un `BEGIN … END` es rígido**: variables → *conditions* →
  **cursores** → **handlers**. Declarar un handler antes que un cursor no es un problema de estilo:
  **el `CREATE` no compila**. Es la trampa más probable al reescribir el `FOR … LOOP` del deck 10 como
  cursor.

7. **Una `FUNCTION` no se crea sin declarar su carácter cuando hay *binary logging*.** Falta
  `DETERMINISTIC`, `NO SQL` o `READS SQL DATA` y el `CREATE FUNCTION` se rechaza con el **error 1418**
  —la alternativa es prender `log_bin_trust_function_creators`—. El deck 10 no lo menciona porque en
  PostgreSQL no existe el problema. (clave) **Es el primer muro del ejercicio 3.d del TP7.**

### Cuándo una vista en MySQL **no** es actualizable

Esto **sí** está en el material, y es de lo poco escrito directamente contra MySQL: el slide 13 del
deck `BD2_Clase 07`. Transcripción completa y comparación con las condiciones del estándar en
[[Clase 07 - Vistas-Parte 2]]. En corto: funciones de agregación, `DISTINCT`, `GROUP BY`, `HAVING`,
`UNION`/`UNION ALL`, subconsultas en el `SELECT`, **joins**, referencia a otra vista no actualizable,
subconsulta en el `WHERE` que referencia una tabla del `FROM`, referencia solo a literales,
`ALGORITHM = TEMPTABLE`, y múltiples referencias a la misma columna base (esto último solo rompe el
`INSERT`).

### Cómo averiguar lo que el deck no enseña

```sql
SHOW CREATE TABLE Ofrece;  -- definición completa, con los nombres de todas las FK
SHOW INDEX FROM graduados;  -- índices de una tabla
DESCRIBE pelicula;  -- columnas y tipos
SHOW TABLE STATUS;  -- filas estimadas, tamaño
```

`SHOW CREATE TABLE` es la que resuelve el problema práctico que deja abierto el deck de la
[[Clase 04 - AlteraciónActualizaciónTablas|Clase 04]]: enseña `DROP CONSTRAINT` pero nunca dice
**cómo averiguar el nombre** de la restricción.

---

## Dudas abiertas

- [ ] **¿El parcial toma MySQL o PostgreSQL?** El cronograma y los TPs (TP5, TP6, TP7, TP8) apuntan
  a MySQL, pero ninguno dice una palabra del parcial. Es la duda más cara del vault. La U1 cierra
  con 8 decks PostgreSQL/Oracle/T-SQL, 1 en MySQL por defecto con dos ejemplos ajenos (el 11) y 2
  sin motor (02 y 06) → § *Por qué MySQL*.
- [ ] (crítico) **¿El trigger del TP7 ej. 2 corre en MySQL, o lo frena el error 1442?** Lee
  `empleado_1` desde una subconsulta sobre la misma tabla que dispara el trigger; no está
  verificado → [[Práctica 2026-09-01]].
- [ ] ¿MySQL 9.7 admite `CREATE OR REPLACE PROCEDURE` / `FUNCTION`? En 8.x no existe, y el deck 10 lo
  usa en su slide 7.
- [ ] ¿`DECLARE v TEXT DEFAULT '…';` es válido como variable local en 9.7, o hay que usar `VARCHAR(n)`?
- [ ] **¿Qué pide la cátedra para el TP7 ej. 3.d, un `PROCEDURE` o una `FUNCTION`?** El cálculo
  devuelve dos valores, lo que empuja a un `PROCEDURE` con parámetros `OUT` o a dos funciones.
- [x] ~~¿El TP5 se hace en MySQL o PostgreSQL?~~ **Resuelto: MySQL** → [[Práctica 2026-08-18]]; hay
  que rehacer todos los ejemplos del deck 08.
- [ ] ¿Desde qué versión soporta MySQL el `ALTER TABLE … DROP CONSTRAINT` genérico?
- [ ] (atención) ¿Desde qué versión está `EXPLAIN ANALYZE` en MySQL? Existe en 9.7, la versión de
  introducción sigue sin verificar.
- [x] ~~(crítico) ¿Sintaxis de creación de índices que espera la cátedra?~~ **Resuelto**: slide 35 de la
  [[Clase 11 - Seguridad-Transacciones|Clase 11]], `create index nombre on tabla (cols)`,
  confirmado en manual § 15.1.18. Queda sin resolver el `drop index` sin `ON tabla` → § *8.4*.
- [ ] (crítico) **¿El parcial evalúa seguridad con la semántica del estándar o con la de MySQL?** La
  sentencia 6 del TP8 ej. 1.a falla en la teoría y pasa en MySQL; `REVOKE … CASCADE`, `PUBLIC` y el
  *owner* no existen en el motor → pregunta 5 de [[Práctica 2026-09-08]] § *Preguntas al docente*.
- [ ] (crítico) **Verificar en el contenedor `mysql:9.7.2`, antes del parcial**: (a) `GRANT` a cuenta
  inexistente → `ERROR 1410`; (b) `REVOKE UPDATE(tiempo)` a quien tiene `UPDATE` de tabla →
  ¿`ERROR 1147`?; (c) rol concedido sin `SET DEFAULT ROLE` deja `CURRENT_ROLE() = NONE`; (d)
  `'u'@'localhost'` no conecta desde el host al contenedor, `'u'@'%'` sí; (e) `SELECT
  @@transaction_isolation;` → `REPEATABLE-READ`; (f) `CREATE INDEX … USING HASH` sobre InnoDB →
  `SHOW INDEX` dice `BTREE`; (g) el error **3523** (rol desconocido, ej. 2.h).
- [ ] **¿`GRANT OPTION` se otorga también a nivel global?** `mysql.user` tiene `Grant_priv` y
  `GRANT ALL ON *.* … WITH GRANT OPTION` es la forma habitual de crear un administrador, pero la
  Table 8.2 no lo nombra explícitamente entre los niveles de `GRANT OPTION`. Probarlo es más barato
  que seguir leyendo.
- [ ] (atención) **¿`REPEATABLE READ` de InnoDB evita los phantoms para lo que pregunta la cátedra?**
  El slide 28 dice que no (estándar); el manual dice que las lecturas consistentes leen la
  instantánea de la primera lectura. Si el parcial pide "nivel mínimo que evita phantoms", el
  slide responde `SERIALIZABLE` y MySQL, `REPEATABLE READ`.
- [ ] **¿Vale `BEGIN` o hay que escribir `START TRANSACTION` en el parcial?** Dentro de un *stored
  program* solo la segunda vale (manual § 15.3.1); el único ejemplo del deck que corre en MySQL
  (slide 30) usa `BEGIN` y está rotulado PostgreSQL.
- [x] ~~¿`LOCK IN SHARE MODE` sigue aceptado en 9.7 como sinónimo de `FOR SHARE`?~~ ✓ Sí, el manual
  los declara equivalentes; `FOR SHARE` admite además `OF table_name`, `NOWAIT` y `SKIP LOCKED`.
- [ ] ¿Qué es exactamente el "Form Editor" de MySQL Workbench que pide el TP5, y en qué se diferencia
  del *Visual Explain*?
- [ ] ¿Cuál es el equivalente MySQL de `EXPLAIN (ANALYZE, BUFFERS)`? No encontrado; el TP5 no lo toca.
- [ ] ¿La versión 9.7.2 aplica los `CHECK` de `esq_peliculas.sql`, o los ignora?
- [ ] ¿MySQL 9.7.2 acepta sin problema las grafías `character varying(n)` / `numeric(p,s)` del script?
- [ ] ¿Se instala con **XAMPP** (slide 2 de la [[Clase 01 - Introducción_BasesDeDatos|Clase 01]]) o
  con **Docker** (práctica del 04/08)?
- [ ] ¿Cuál es la **collation** de la base del TP? De eso depende si `LIKE 'a%'` matchea `Ana`.
- [ ] ¿Importa el nombre que se le da a una `PRIMARY KEY`, si MySQL lo descarta y la llama siempre
  `PRIMARY`?
- [x] ~~¿El TP4 pide una vista materializada?~~ **No**: ninguno de sus cinco ejercicios la toca →
  [[Práctica 2026-08-11]].
- [ ] ¿Entra `TRUNCATE TABLE`, que no menciona ningún deck?

## Enlaces

- Motor del material, no de la cursada: **[[PostgreSQL]]** · otros motores: [[MongoDB]] ·
  [[Cassandra]] · [[Neo4j]] · [[Redis]] · [[DynamoDB]]
- Setup y TPs: [[Práctica 2026-08-04]] *(setup)* · [[Práctica 2026-08-11]] *(TP4 Vistas)* ·
  [[Práctica 2026-08-18]] *(TP5 Explain Plan — el que confirma el motor)* ·
  [[Práctica 2026-08-25]] *(TP6 Restricciones declarativas)* ·
  [[Práctica 2026-09-01]] *(TP7 Restricciones avanzadas — el que lo repite)* ·
  **[[Práctica 2026-09-08]]** *(TP8 Seguridad — el tercero, y el § 7 sale de ahí)* ·
  [[Práctica 2026-09-15]] *(TP9 MongoDB Parte I — el primer TP que **no** corre sobre MySQL)* ·
  [[Docker]] · índice de enunciados en `raw/tp/_index.md`
- Clases que tocan sintaxis MySQL/PostgreSQL:
  [[Clase 01 - Introducción_BasesDeDatos]] ·
  [[Clase 03 - Derivación a Esquema Lógico]] ·
  [[Clase 04 - AlteraciónActualizaciónTablas]] ·
  [[Clase 05 - Consultas de Datos–Parte 1]] ·
  [[Clase 05 - Consultas de Datos–Parte 2]] ·
  [[Clase 05 - Consultas de Datos–Parte 3]] ·
  [[Clase 06 - Vistas-Parte 1]] · [[Clase 07 - Vistas-Parte 2]] ·
  [[Clase 08 - Explicando el plan]] · [[Clase 09 - Restricciones integridad-Parte 1]] ·
  [[Clase 10 - Restricciones integridad-Parte 2]] *(SQL procedural — el § 6 sale de acá)* ·
  **[[Clase 11 - Seguridad-Transacciones]]** *(el primer deck en MySQL por defecto — los §§ 7 y 8
  salen de ahí; cierra la U1)*
- Lo que sigue, en otro motor: [[Clase 12 - Introduccion a NoSQL]] · [[Clase 13 - NoSQL-EmbebidosVSNormalizado]] ·
  [[Clase 14 - MongoDB Features]] *(14/09, `raw/Unidad-02/` — no entran en el inventario de motor
  ajeno: son [[MongoDB]])*
- Conceptos: [[DDL vs DML]] · [[1.06.01 - Vistas|Vistas]] · [[1.08.02 - Índices|Índices]] · [[1.08.01 - Plan de ejecución|Plan de ejecución]] ·
  [[Restricciones de integridad]] · [[1.11.03 - Transacciones y ACID|Transacciones ACID]] · [[Sintaxis MySQL vs PostgreSQL]] ·
  [[1.09.04 - Triggers|Triggers]] ·
  **de la Clase 11**: [[1.11.01 - Seguridad en bases de datos|Seguridad en bases de datos]] ·
  [[1.11.02 - Usuarios, privilegios y roles|Usuarios, privilegios y roles]] *(§ 7)* ·
  [[1.11.04 - Control de concurrencia y niveles de aislamiento|Control de concurrencia y niveles de aislamiento]] *(§ 8)*
- Calendario: [[_cronograma]] · índice de clases: [[_index-clases]] · bibliografía:
  [[_index-bibliografia]]
