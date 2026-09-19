---
tipo: teorica
clase: 9
deck: "BD2_Clase 09 - Restricciones integridad-Parte 1.pdf"
unidad: 1
tema: "Restricciones de integridad"
resumen: "Restricciones de integridad: la integridad referencial con sus cinco acciones y tres tipos de matching, la jerarquía atributo→tupla→tabla→BD (DOMAIN, CHECK, ASSERTION) y los triggers cuando lo declarativo no alcanza. Criterio: contar tablas y filas; de ámbito tabla para arriba se va a trigger."
fecha: 2026-08-24
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 09
  - Clase 09 — Restricciones de integridad
  - Restricciones de integridad
  - RI
  - RIRS
  - Integridad referencial
  - Acciones referenciales
  - Tipos de matching
  - MATCH FULL
  - MATCH PARTIAL
  - MATCH SIMPLE
  - CREATE DOMAIN
  - CREATE ASSERTION
  - CHECK
  - Triggers
  - Disparadores
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 09 - Restricciones integridad-Parte 1.pdf"
estado: procesado
---

# Clase 09 — Restricciones de integridad (Parte 1)

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 09 - Restricciones integridad-Parte 1.pdf` · **39 slides**
> El slide 1 es la **portada** (*"Bases de Datos II · RESTRICCIONES DE INTEGRIDAD"*); el recorrido de
> abajo arranca en el 2 y llega al 39, que es la bibliografía. **No hay slide de agenda.**
> Dictado en la **teórica del lunes 24/08**. El `09` del nombre del archivo **es el número de clase**:
> la cátedra numera sus decks y ésa es la única numeración de clases que existe.
> Clase anterior: [[Clase 08 - Explicando el plan]] *(del 10/08 — el lunes 17/08 fue feriado)*.
> Se practica con el **TP6 Restricciones declarativas** del martes 25/08 → [[Práctica 2026-08-25]].
> Bibliografía: [[_index-bibliografia]] › Clase 09.

> [!info] Las Clases 01–10 viven todas en `raw/Unidad-01/Teorica/`
> No es un error de archivado: una carpeta de unidad **agrupa varias clases**, y hoy la Unidad-01
> agrupa las Clases 01 a 10 *(decía "01 a 09" hasta el 02/09; entró la
> [[Clase 10 - Restricciones integridad-Parte 2]] y volvió a caer acá)*. El path no dice a qué clase
> pertenece un archivo — eso lo registra [[_index-clases]].

> [!warning] 🔴 Un tercio de este deck **no es "restricciones declarativas": son triggers**
> El deck se llama *Restricciones integridad — Parte 1*, pero **13 de sus 39 slides** (el 16 y los
> 25 a 38) son **triggers**: sintaxis, granularidad, `:new`/`:old`, cascadas, ejemplos en PL/pgSQL y
> el modelo de ejecución SQL-99. Y el [[_cronograma]] pone *"Triggers y SQL Procedural"* en la
> teórica del **lunes 31/08**, la semana siguiente.
>
> O sea: **el deck se adelanta a su propio cronograma**. Consecuencias prácticas:
> - El **TP6 del martes 25/08 no toca triggers** — es *"Restricciones declarativas"* y sus tres
>   ejercicios son RIR, `CHECK` y `ASSERTION`. Lo de triggers **no se ejercita esta semana**.
> - ~~**Hay una *Parte 2*** que todavía no está en `raw/`. Cuando llegue, es la **misma Clase 09**
>   (`Parte 1/2` = un deck partido, no dos clases) salvo que la cátedra le ponga otro número.~~
>   → **Llegó el 02/09, y la cátedra le puso otro número: es la
>   [[Clase 10 - Restricciones integridad-Parte 2]].** La salvedad estaba bien puesta; la previsión
>   principal erró. Ver el callout de abajo.
> - Los slides 25–38 conviene releerlos junto con la teórica del 31/08 —o sea, con la
>   [[Clase 10 - Restricciones integridad-Parte 2]]—, no antes del TP6. **Pero no porque la Clase 10
>   los repita: no los repite.** Se reparten el tema; ver el § *Slides 25–38 · Triggers*.
>
> La síntesis de triggers está igual acá, completa, porque el material es de esta clase. La página de
> concepto es [[1.09.04 - Triggers|Triggers]].

> [!failure] 02/09 — la previsión de la *Parte 2* **falló**: no es la Clase 09, es la **Clase 10**
> | | |
> | --- | --- |
> | **Qué se preveía** *(arriba, tachado)* | que el deck *Parte 2*, cuando llegara, sería **la misma Clase 09** |
> | **Qué pasó** | llegó el **02/09** como `BD2_Clase 10 - Restricciones integridad-Parte 2.pdf` — 20 slides, dictado el **lunes 31/08** → [[Clase 10 - Restricciones integridad-Parte 2]] |
> | **La lección** | **el número manda sobre el sufijo `Parte N`** |
>
> La regla de `CLAUDE.md` —*"un deck partido en varios archivos es una sola clase"*— **sigue siendo
> correcta**. Lo que la hace verdadera en `BD2_Clase 05 - … Parte 1/2/3` es que **el `NN` es el
> mismo** en los tres archivos, **no** que diga *"Parte"*. Acá el `NN` cambió (`09` → `10`), y con eso
> son **dos clases**, no una partida. Esta página leyó el `Parte 1` como si fuera la premisa; la
> premisa siempre fue el número que pone la cátedra.
>
> Es el mismo patrón que `CLAUDE.md` ya registra dos veces *(11 y 12 de agosto)*: **el LLM dedujo una
> estructura y después la trató como autoridad sobre el material del humano.** Queda escrito, no se
> disimula. El inventario completo de previsiones puestas a prueba está en [[_index-clases]] y en
> [[_cronograma]].

> [!warning] El deck vuelve a estar escrito contra **PostgreSQL**
> Es el **séptimo** deck del vault con motor ajeno —`01`, `03`, `04`, `05-P1`, `07`, `08` y `09`—, y
> esta vez lo dice con todas las letras:
> *(esta página decía **"sexto"**: era **un error de conteo**, corregido el 25/08 →
> [[MySQL]] § *Por qué MySQL* y § *5 · Restricciones e integridad*. Con el deck 10, la
> [[Clase 10 - Restricciones integridad-Parte 2|Clase 10]] pasa a ser el **octavo**.)*
> - **Slide 27**: el título es literalmente *"TRIGGERS – **SINTAXIS PostgreSQL**"*.
> - **Slide 12**: *"MATCH SIMPLE (Opción por defecto para SQL estandar **y PostgreSQL**)"*.
> - **Slide 36**: la función de ejemplo es **PL/pgSQL** (`RETURNS trigger AS $body$ … LANGUAGE 'plpgsql'`).
> - **Slide 39**: la primera fuente que cita es *"Capitulo 36 del Manual de PostgreSQL"*.
>
> La cursada corre sobre **[[MySQL]]**, y el propio **TP6 lo asume**: su ejercicio 3.c pide
> *"las restricciones que puedan ser soportadas por MySQL"*, o sea que la cátedra ya sabe que no
> entran todas. La traducción sentencia por sentencia está en [[MySQL]] § *5 · Restricciones e
> integridad*; el inventario de qué deck es de qué motor, en [[PostgreSQL]].

> [!quote] La bibliografía que declara el deck (slide 39)
> - *"Capitulo 36 del Manual de **POstgreSQL**"* — `www.postgresql.org` **(sic**: la mayúscula
>   descolocada está en el slide**)**
> - Date, C., *"An Introduction to Database Systems"*. **7º ed.**, Addison Wesley, **2000**
> - Elmasri, R., Navathe, S., *"Fundamentals of Database Systems"*, Addison Wesley, 2011
> - Silberschatz, A., Korth, H, Sudarshan, S., *"Database System Concepts"*, McGraw Hill, 2001
> - Sumathi S., Esakkirajan S., *Fundamentals of Relational Database Management Systems*, 2007
>
> Dos observaciones:
> 1. **El deck cita la 7ª edición de Date (2000); el vault tiene la 8ª (2004).** El capítulo de
>    integridad es el **9** en la 8ª — verificado contra el índice del PDF, ver
>    [[_index-bibliografia]] › Clase 09. En la 7ª la numeración puede diferir: **citar siempre por la
>    8ª**, que es la que está en `raw/`.
> 2. **Sumathi & Esakkirajan vuelve a aparecer y sigue sin estar en el vault.** Es la misma fuente
>    que reclama el slide 2 de la [[Clase 06 - Vistas-Parte 1]]. Ya era un pendiente; ahora son dos
>    decks los que la piden.

## Resumen

Una **restricción de integridad (RI)** es una condición que los datos de la base **deben** cumplir
para que la instancia sea *legal*. El deck arma el tema en tres capas, cada vez más ancha:

1. **Qué es una RI y quién la hace cumplir** *(slides 2–5)*. El DBA las **declara**; el SGBD las
   **fuerza**, rechazando la operación o reparándola. La alternativa —meterlas en el código de la
   aplicación— es la que se abandonó hace cuarenta años.
2. **Las RI que ya se venían usando sin nombrarlas así** *(slides 6–14)*: `NOT NULL`, `UNIQUE`,
   `PRIMARY KEY` y sobre todo la **integridad referencial** con sus **acciones referenciales**
   (`CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`) y sus **tipos de matching**
   (`SIMPLE`, `PARTIAL`, `FULL`).
3. **Las RI que no entran en una clave** *(slides 15–24)*: la jerarquía
   **atributo → tupla → tabla → base de datos**, implementada con `CREATE DOMAIN`, `CHECK` de
   registro, `CHECK` de tabla y `CREATE ASSERTION`.

Y después **la salida de emergencia** *(slides 16, 25–38)*: cuando lo declarativo no alcanza —o el
motor no lo implementa—, se escribe un **trigger**. El deck es explícito en que un trigger **no es**
una restricción de integridad y que solo se usa cuando la RI no se puede expresar declarativamente
*(slide 37)*.

| Bloque | Qué establece | Slides |
| --- | --- | --- |
| **Concepto de RI** | Definición, quién la especifica, quién la fuerza | 2–3 |
| **Clasificación** | Por naturaleza (inherente/implícita/explícita) y por estados (estado/transición) | 4–5 |
| **No-nulidad y unicidad** | `NOT NULL`, `DEFAULT`, `PRIMARY KEY`, `UNIQUE` | 6 |
| **Integridad referencial (RIRS)** | Qué es una FK, sintaxis, `MATCH`, `ON UPDATE`/`ON DELETE` | 7–8 |
| **Acciones referenciales** | Las cinco, para borrado y para modificación, con ejemplo | 9–11 |
| **Tipos de matching** | `SIMPLE` / `PARTIAL` / `FULL`, con la tabla de casos | 12–14 |
| **Otras RI declarativas** | La jerarquía atributo→tupla→tabla→BD; y la mención a SQL procedural | 15–16 |
| **RI de dominio / atributo** | `CREATE DOMAIN`, tipos de condición, ejemplo | 17–19 |
| **`CHECK` de registro** | Ámbito tupla, sintaxis, ejemplo | 20–21 |
| **`CHECK` de tabla** | Ámbito tabla, ejemplo con subconsulta | 22 |
| **`ASSERTION`** | Ámbito base de datos, y por qué nadie la implementa | 23–24 |
| **Triggers** | Motivación, ECA, sintaxis, granularidad, referencias, acción, comportamiento, utilidad, ejemplos | 25–36 |
| **Triggers vs. RI declarativas** | Las tres diferencias que importan | 37 |
| **Modelo de ejecución SQL-99** | En qué orden se aplica todo | 38 |
| **Bibliografía** | Cinco fuentes | 39 |

---

## Slide 2 · Concepto de RI

> [!quote] La frase con la que abre el deck
> *"Un SGBD debe ayudar a prevenir el ingreso incorrecto de datos"*

Las tres líneas que definen **RI**, textuales del slide:

| | |
| --- | --- |
| **RI** | *"condiciones que restringen los valores en la BD"* |
| | *"descripción de estados correctos en tiempo de diseño"* |
| | *"previenen inconsistencias"* |

Y la consecuencia, también textual:

> *"forzar las RI → garantizar **instancias legales** de la BD"*

**Instancia legal** es el vocabulario que hay que retener: una instancia es legal si satisface todas
las RI declaradas. Es el mismo sentido de "consistente" que se usa en la **C de ACID**.

### Los tres ejemplos del slide

El slide baja la definición con tres ejemplos de un dominio de voluntariado. **No son decorativos:
cada uno es de un tipo distinto**, y esa es la razón por la que están los tres.

| Ejemplo (textual) | Qué tipo de RI es | Cómo se implementa |
| --- | --- | --- |
| *"Los nombres y apellidos de los voluntarios no pueden ser nulos"* | de **atributo**, de estado | `NOT NULL` |
| *"Un voluntario no puede aportar más de 10 horas semanales."* | de **tupla** o de **tabla** según el modelo, de estado | `CHECK` |
| *"Un voluntario puede cambiar de tarea o de institución solamente dos veces al año."* | de **transición de estados** | ❗ **no es declarativa** → trigger |

> [!tip] El tercer ejemplo es la trampa del slide, y vuelve al final del deck
> *"cambiar … solamente dos veces al año"* **no se puede escribir con un `CHECK`**: compara el estado
> nuevo contra el **historial** de estados anteriores, y `CHECK` solo ve la fila que se está
> insertando o actualizando. Es exactamente la **RI de transición de estados** que define el slide 4,
> y es exactamente el caso que el slide 25 usa para justificar los triggers. El deck plantea el
> problema en su segundo slide y lo resuelve en el vigesimoquinto.

## Slide 3 · Cómo se mantiene la integridad

Dos actores, con responsabilidades separadas:

| Actor | Qué hace | Cómo |
| --- | --- | --- |
| **DBA** | *"especifica las RI sobre los datos"* | → *"código en las aplicaciones que acceden a los datos"*<br>→ *"restricciones (reglas o chequeos) **EN** la BD que interpreta el SGBD"* |
| **SGBD** | *"evita actualizaciones en los datos que no cumplan las RI"* | → *"rechazando la operación (insert, delete, update)"*<br>→ *"realizando acciones reparadoras extras"* |

Y el cierre, textual:

> *"ambas respuestas deben dejar la BD en un estado consistente"*

> [!important] Las dos vías del DBA **no son equivalentes**, y esto es lo que se pregunta
> El slide las lista una al lado de la otra, pero la diferencia es el argumento central de toda la
> materia:
>
> | | RI en el **código de la aplicación** | RI **en la BD** |
> | --- | --- | --- |
> | Alcance | solo las operaciones que pasan por esa app | **todas**, incluida la consola y otra app |
> | Duplicación | una copia por aplicación | una sola |
> | Datos ya cargados | no los revisa | la RI declarativa **sí** *(slide 37)* |
> | Quién la mantiene | el equipo de desarrollo | el DBA, en un solo lugar |
>
> Es el mismo argumento que **Silberschatz § 1.2** hace históricamente para abandonar los sistemas de
> archivos: *"Problemas de integridad … es difícil cambiar los programas para hacer cumplir esas
> restricciones … especialmente cuando las restricciones implican diferentes elementos de datos de
> diferentes archivos"*. Ver [[_index-bibliografia]] › Clase 09.

## Slides 4–5 · Clasificación de las RI

El deck da **dos clasificaciones ortogonales**. Se cruzan: toda RI tiene un valor en cada eje.

### Eje 1 — según su naturaleza *(slide 4)*

| Tipo | Textual del slide | Ejemplo |
| --- | --- | --- |
| **Inherente** | *"se asumen por definición del modelo de datos y no se requiere especificaciones adicionales"* | en el modelo relacional: no hay filas duplicadas; los atributos son atómicos (1FN) |
| **Implícita** | *"provienen del modelo de datos (representada en el esquema) y se especifican durante la creación del esquema"* | `PRIMARY KEY`, `FOREIGN KEY`, el tipo de dato de la columna |
| **Explícita** | *"establecen restricciones adicionales y se pueden incorporar a la BD. **Declarativa o Procedural**"* | `CHECK`, `ASSERTION` (declarativas) · triggers (procedural) |

> [!note] La palabra que abre el resto del deck está acá
> **"Declarativa o Procedural"**, al final de la fila *Explícita*, es la bifurcación que estructura
> todo lo que viene: los slides 15–24 son la rama **declarativa** y los 25–38 la **procedural**.
> Y el TP6 se llama *"Restricciones **declarativas**"* — o sea, cae enteramente del lado izquierdo.

### Eje 2 — según los estados involucrados *(slide 4)*

| Tipo | Textual del slide | Qué mira |
| --- | --- | --- |
| **RI de estado** | *"restringe los valores que pueden tomar los datos en un momento"* | **una** instancia |
| **RI de transición de estados** | *"restringe los posibles cambios de valores entre estados sucesivos de los datos"* | el par (instancia vieja, instancia nueva) |

> [!important] Solo las **de estado** son declarables con `CHECK`/`ASSERTION`
> Una `CHECK` evalúa una condición sobre la fila resultante: **no tiene forma de mirar el valor
> anterior**. Todo lo que sea *"no puede bajar"*, *"solo se puede cambiar N veces"*, *"la fecha nueva
> tiene que ser posterior a la vieja"* es **de transición** y necesita un trigger, que sí tiene
> `:old` y `:new` *(slide 30)*.
>
> El deck lo confirma en su ejemplo estrella del slide 34: *"Verificar que el sueldo de un empleado
> **no se reduzca**"*, escrito con `WHEN (:old.sueldo > :new.sueldo)`. **Es una RI de transición, y
> por eso el ejemplo de trigger es ése y no otro.**

### Slide 5 · Las cinco RI de estado

| RI | Textual del slide |
| --- | --- |
| **Unicidad** | *"no puede haber claves repetidas"* |
| **No Nulidad** | *"el valor de un atributo no puede ser nulo"* |
| **Dominio** | *"los valores de un atributo deben pertenecer a un conjunto (dominio) definido"* |
| **Cardinalidad de una relación** | *"el número de veces que una entidad participa de una relación"* — ej.: *"Los empleados sólo pueden participar en un máximo de 5 proyectos"* |
| **Participación en una relación** | *"participación obligatoria u opcional en una relación"* — ej.: *"Un empleado debe (o puede) estar vinculado a un área"* |

> [!tip] Las dos últimas cierran un hueco que el vault tenía abierto desde la Clase 02
> **Cardinalidad** y **participación** venían del [[1.02.02 - Modelo Entidad-Relación|MER]], donde eran
> anotaciones del diagrama. Acá se las nombra como **restricciones de integridad**, que es lo que
> siempre fueron: el `(0,N)` de un DER es una RI de cardinalidad, y la participación total/parcial es
> una RI de participación.
>
> Y con eso queda claro **cómo se implementa cada una**, que es justo lo que la Clase 03 no decía:
>
> | Del DER | Cómo se fuerza en el esquema |
> | --- | --- |
> | participación **parcial** (0,N) | FK que **admite nulos** |
> | participación **total** (1,N) | FK **`NOT NULL`** |
> | cardinalidad **máx. 1** | FK + `UNIQUE`, o la FK dentro de la PK |
> | cardinalidad **máx. N**, N>1 | ❗ **no hay forma declarativa simple** → `CHECK` de tabla con subconsulta, `ASSERTION` o trigger |
>
> La cuarta fila es exactamente el ejemplo *"máximo de 5 proyectos"* del propio slide 5 — y es
> **exactamente** el ejercicio 3.B.6 del TP6 (*"Cada proveedor no puede proveer más de 20
> productos"*). Ver [[Práctica 2026-08-25]].
>
> **La participación total/parcial** era una de las dudas abiertas de
> [[Clase 02 - Modelo Entidad-Relacion]]: **este slide la nombra pero sigue sin definir la notación**.
> Queda abierta.

## Slide 6 · Restricciones de no-nulidad y de unicidad

La gramática, textual del slide *(`{}` = repetición, `[]` = opcional)*:

```sql
CREATE TABLE NombreTabla
( { nom_col TipoDato [NOT NULL] [DEFAULT valorDefecto], … }
   [ [CONSTRAINT PK_nom] PRIMARY KEY (lista_col_PK),]
   { [ [CONSTRAINT nom_restr] UNIQUE (lista_col),] }
... );
```

```sql
ALTER TABLE NombreTabla
  ADD [CONSTRAINT PK_nom] PRIMARY KEY (lista_col_PK);
```

> [!quote] La única palabra suelta del slide
> Al costado del bloque de `CONSTRAINT nom` dice **"Recomendable!"**.
>
> Es la recomendación de **nombrar siempre las restricciones**. La razón no está en este slide sino
> en el uso: **una restricción sin nombre no se puede borrar** —el motor le pone un nombre autogenerado
> y hay que ir a buscarlo al catálogo—. El TP6 lo pide sin decirlo: su ejercicio 1.a manda escribir
> `ALTER TABLE … ADD CONSTRAINT R1 …`, con los nombres `R1`–`R4` puestos por la cátedra.

> [!note] Esto ya estaba, pero desperdigado
> `NOT NULL`, `DEFAULT`, `PRIMARY KEY` y `UNIQUE` se habían dado en la
> [[Clase 03 - Derivación a Esquema Lógico]] como *sintaxis de `CREATE TABLE`*. La novedad de esta
> clase no es la sintaxis: es **el nombre del concepto** —son RI implícitas de estado— y su lugar en
> la jerarquía del slide 15. La hoja de sintaxis sigue siendo
> [[1.03.02 - DDL — creación y alteración de tablas|DDL]].

---

## Slides 7–8 · Integridad referencial (RIRS)

### La definición *(slide 7)*

> [!quote] Textual
> *"Una **clave extranjera** (FOREIGN KEY en SQL) de una tabla A (**referenciante**) es un conjunto no
> vacío de columnas cuyos valores coinciden con los valores de otro conjunto de columnas, que son
> clave de otra tabla B (**referenciada**)"*
>
> *"Nota: A y B podrían ser la misma tabla."*
>
> *"Las claves extranjeras (FOREIGN KEY) especifican relaciones entre tablas y permiten mantener la
> consistencia entre registros de esas tablas"*

Y la regla, en el recuadro destacado del slide:

> [!important] La regla de integridad referencial, textual del slide 7
> *"El conjunto de valores de la clave extranjera de una tabla A debe coincidir al menos con un valor
> de la clave primaria de la tabla B, a la que hace referencia, **o bien ser nulo**"*

Las tres palabras que importan de esa frase:

- **"clave"**, no *"clave primaria"*, en la definición del slide: el estándar admite referenciar
  cualquier clave candidata (`UNIQUE`), no solo la PK. El recuadro después dice *"clave primaria"* —
  es una simplificación del propio deck, no un error grave, pero conviene saber la diferencia.
- **"al menos"**: la FK no exige unicidad del lado referenciante. Muchas filas de A pueden apuntar a
  la misma de B — eso es lo que hace que una FK modele un 1:N.
- **"o bien ser nulo"**: la escapatoria que abre todo el tema de **matching** de los slides 12–14. Si
  la FK es de **una** columna, *nulo* es inequívoco. Si es de **varias**, hay que decidir qué pasa
  cuando **algunas** son nulas y otras no — y ahí aparecen `SIMPLE`/`PARTIAL`/`FULL`.

**RIRS** es la sigla del deck para *Restricciones de Integridad Referencial*; la `S` final aparece
solo en los títulos y no se explica. El TP6 usa **RIR**, sin la `S`.

### La sintaxis *(slide 8)*

```sql
CREATE TABLE NombreTabla
( { nombre_columna TipoDato [NOT NULL] … }
   [ [CONSTRAINT PK_nom] PRIMARY KEY (lista_columnasPK),]
   { [ [CONSTRAINT U_nom] UNIQUE (lista_columnas),] }
   { [ [CONSTRAINT FK_nom] FOREIGN KEY (lista_columnasFK)
         REFERENCES nombreTablaRef [(lista_columnasRef)]
         [ MATCH {FULL | PARTIAL | SIMPLE}]
         [ON UPDATE AccionRef]
         [ON DELETE AccionRef] ] } ….. );
```

```sql
ALTER TABLE NombreTabla
  ADD CONSTRAINT FK_nom FOREIGN KEY (lista_columnasFK) …;
```

> [!quote] Y la lista de acciones, textual del pie del slide
> `AccionRef = NO ACTION | CASCADE | SET NULL | SET DEFAULT | RESTRICT`

**Cinco** acciones, dos eventos (`ON UPDATE`, `ON DELETE`) y **tres** tipos de matching. Ése es todo
el espacio de diseño de una FK, y el TP6 lo recorre entero.

> [!warning] Cuatro cosas de esta gramática **no funcionan igual en MySQL**
> | Del slide | En **MySQL/InnoDB** |
> | --- | --- |
> | `MATCH {FULL\|PARTIAL\|SIMPLE}` | se **parsea y se ignora**: InnoDB siempre se comporta como `MATCH SIMPLE` |
> | `SET DEFAULT` | InnoDB **rechaza la definición de la tabla**: no la implementa |
> | `NO ACTION` ≠ `RESTRICT` | InnoDB los trata **igual**, porque no tiene chequeo diferido |
> | `REFERENCES` *inline* en la columna | se acepta sintácticamente pero **no crea la FK** |
>
> Detalle y nivel de certeza en [[MySQL]] § *5 · Restricciones e integridad*. Las dos primeras filas
> son las que rompen el TP6: **los ejercicios 1.c y 2.b de matching no se pueden correr en MySQL**,
> son de lápiz y papel.

---

## Slides 9–10 · Acciones referenciales

Los dos slides tienen la misma estructura; cambia el evento. **La pregunta que hace cada uno**,
textual:

- *Slide 9* — *"¿Qué sucede si se intenta **borrar (delete)** un registro en la Tabla_B que está
  siendo referenciada en la Tabla_A por la FK?"*
- *Slide 10* — *"¿Qué sucede si se intenta **modificar (update) la clave primaria** de un registro en
  la Tabla_B que está siendo referenciada en Tabla_A por la FK?"*

> [!important] La pregunta es siempre sobre la tabla **referenciada** (B), nunca sobre la A
> Las acciones referenciales solo se disparan cuando se toca la fila **apuntada**. Si se inserta o se
> modifica una fila de la tabla **referenciante** (A), no hay acción referencial ninguna: hay un
> **chequeo** común y silvestre —el valor nuevo tiene que existir en B, o ser nulo— y listo.
>
> Suena obvio escrito, y es el error nº 1 del TP6: su ejercicio **1.b.v** es
> `UPDATE TRABAJA_EN SET IdProy = 3 WHERE IdProy = 1`, sobre la **referenciante**. Ninguna acción
> referencial aplica. Ver [[Práctica 2026-08-25]].

### Las cinco acciones, agrupadas como las agrupa el deck

El deck las parte en **dos familias**, y el título de cada familia es la mitad de la respuesta:

#### Familia 1 — *"Rechazo de la operación"*

| Acción | Textual del slide |
| --- | --- |
| **`NO ACTION`** | *"no permite borrar un registro cuya clave primaria está siendo referenciada por un registro en la Tabla_A (**es la opción por defecto**)"* |
| **`RESTRICT`** | *"misma semántica que NO ACTION, pero **se chequea antes de las otras RI**"* |

#### Familia 2 — *"Acepta la operación y realiza acciones reparadoras adicionales"*

El slide antepone la línea común: *"borra el registro en la Tabla_B **y** …"*

| Acción | Textual del slide |
| --- | --- |
| **`CASCADE`** | *"se propaga el borrado a todos los registros que referencian a dicha clave primaria mediante la FK en la Tabla_A"* |
| **`SET NULL`** | *"les coloca nulos en la FK de los registros que referencian a dicha clave primaria en la Tabla_A (**sólo si admite nulos**)"* |
| **`SET DEFAULT`** | *"les coloca el valor por defecto en la FK de los registros que referencian a dicha clave primaria en la Tabla_A"* |

### `NO ACTION` vs. `RESTRICT` — la única diferencia, y el slide que la explica

Es la pregunta más frecuente del tema y el deck la contesta **dos veces**, con 29 slides de por medio:

- **Slide 9/10**: *"misma semántica … pero **se chequea antes de las otras RI**"*.
- **Slide 38**: el diagrama del modelo de ejecución SQL-99 pone tres cajas **en este orden**:
  `Apply RESTRICT Rules` → `Apply CASCADE, SET NULL, SET DEFAULT Rules` →
  `Apply NO ACTION Rules and Evaluate Constraints`.

> [!important] Leídos juntos, la diferencia queda operativa
> **`RESTRICT` corta antes de que pase nada.** Aborta apenas ve una fila referenciante, **antes** de
> ejecutar las reparaciones de las otras FKs.
>
> **`NO ACTION` corta al final.** Deja que las otras acciones referenciales se ejecuten y **después**
> mira si quedó alguna violación. Si alguna de esas reparaciones eliminó la fila conflictiva, la
> operación **pasa** — donde `RESTRICT` la habría rechazado.
>
> De ahí que `NO ACTION` sea compatible con el **chequeo diferido** (`SET CONSTRAINTS … DEFERRED`) y
> `RESTRICT` no.
>
> ⚠️ **Nada de esto se puede ver en MySQL**: InnoDB no tiene chequeo diferido y trata las dos
> palabras igual. La distinción es **de parcial, no de TP**.

> [!note] La combinación que se pregunta en el parcial: dos reglas sobre la misma fila
> Cuando una fila referenciada tiene **dos** FKs apuntándole con acciones distintas, **manda la
> restrictiva**: si una dice `CASCADE` y la otra `RESTRICT`, la operación se **rechaza** y la cascada
> nunca ocurre — porque, por el slide 38, `RESTRICT` se evalúa **primero**.
>
> Es literalmente el ejercicio **1.b.vi** del TP6 (`UPDATE PROYECTO SET IdProy = 5 WHERE IdProy = 2`,
> con R2 `ON UPDATE CASCADE` y R3 `ON UPDATE RESTRICT` sobre la misma fila). Resuelto en
> [[Práctica 2026-08-25]].

## Slide 11 · El ejemplo de acciones referenciales

DER y esquema del slide:

```
              (0,N)          (0,1)
 EMPLEADO ──────────── R ──────────── AREA

 EMPLEADO(idE, nombre, .., AreaT)      AREA(idArea, … )
```

```sql
CREATE TABLE Empleado (…);
CREATE TABLE Area (…);
ALTER TABLE Empleado
  ADD CONSTRAINT FK_R
  FOREIGN KEY (AreaT) REFERENCES Area
    ON UPDATE ….
    ON DELETE ….;
```

La instancia, y las cinco operaciones a analizar *(textual: "considerar la instancia dada para las
tablas y result. **individuales, no acumulativos**")*:

| EMPLEADO | | | |
| --- | --- | --- | --- |
| **IdE** | Nombre | … | **AreaT** |
| 1 | E1 | … | 101 |
| 2 | E2 | … | 101 |

| AREA | |
| --- | --- |
| **IdArea** | … |
| 101 | … |
| 102 | … |

```sql
DELETE FROM Area WHERE IdArea = 101;
DELETE FROM Area WHERE IdArea = 102;
DELETE FROM Area;
UPDATE Area SET IdArea = 201 WHERE IdArea = 101;
UPDATE Area SET IdArea = 202 WHERE IdArea = 102;
```

> [!bug] En el PDF, la columna `AreaT` de `EMPLEADO` está **tapada por un recuadro**
> En la vista renderizada del slide hay un rectángulo violeta encima de la última columna de la tabla
> `EMPLEADO`: no se lee ni el encabezado ni los valores. **La capa de texto del PDF sí los tiene**, y
> dice `101` para los dos empleados.
>
> Es un desprolijo de armado del deck, no un dato faltante — pero **si el slide se proyecta en clase,
> el ejercicio se ve incompleto**. Vale confirmarlo: sin esa columna el ejercicio no se puede
> resolver.

### La resolución, acción por acción

**Razonamiento propio: el slide plantea el ejercicio y no lo resuelve.** Los dos empleados apuntan a
`101`; **`102` no está referenciada por nadie** — ese es el diseño del ejercicio.

| Operación | `NO ACTION` / `RESTRICT` | `CASCADE` | `SET NULL` | `SET DEFAULT` |
| --- | --- | --- | --- | --- |
| `DELETE … IdArea = 101` | ❌ rechaza | ✅ borra el área **y los dos empleados** | ✅ `AreaT = NULL` en los dos | ✅ `AreaT = <default>` en los dos |
| `DELETE … IdArea = 102` | ✅ pasa | ✅ pasa | ✅ pasa | ✅ pasa |
| `DELETE FROM Area;` *(las dos filas)* | ❌ rechaza *(por la 101)* | ✅ borra **todo**: 2 áreas y 2 empleados | ✅ `AreaT = NULL` en los dos | ✅ `AreaT = <default>` en los dos |
| `UPDATE … IdArea = 201 WHERE IdArea = 101` | ❌ rechaza | ✅ los dos empleados pasan a `AreaT = 201` | ✅ `AreaT = NULL` en los dos | ✅ `AreaT = <default>` |
| `UPDATE … IdArea = 202 WHERE IdArea = 102` | ✅ pasa | ✅ pasa | ✅ pasa | ✅ pasa |

> [!warning] Tres trampas de esta tabla
> 1. **`SET NULL` solo funciona si `AreaT` admite nulos.** El slide 9 lo dice entre paréntesis
>    (*"sólo si admite nulos"*). Si `AreaT` fuera `NOT NULL`, la acción falla y la operación se
>    rechaza — un `SET NULL` que se comporta como un `RESTRICT`, que es lo más confuso del tema.
>    Y `AreaT` **es** nullable acá: el DER dice `(0,1)`, o sea participación opcional.
> 2. **`SET DEFAULT` es peor**: si la columna no tiene `DEFAULT` declarado, el default es `NULL` y se
>    reduce al caso anterior; y si tiene uno, **ese valor tiene que existir en `AREA`** o la operación
>    también falla. Por eso InnoDB directamente no lo implementa.
> 3. **En `SET NULL` sobre `UPDATE`** el empleado **pierde el área**, no la sigue. Es la diferencia
>    conceptual con `CASCADE`: `CASCADE` mantiene el vínculo, `SET NULL` lo rompe. Para un `UPDATE`
>    eso casi nunca es lo que se quiere — `SET NULL` tiene sentido en `ON DELETE`, no en `ON UPDATE`.

---

## Slides 12–14 · Tipos de matching

### Cuándo importa *(slide 12)*

> [!quote] Textual
> *"Los tipos de matching afectan cuando las FK se definen **sobre varios atributos**, y pueden
> contener valores nulos"*
>
> *"Indican los requisitos que deben cumplir los conjuntos de valores de atributos de la FK en R,
> respecto de los correspondientes en la clave referenciada en R´"*
>
> - *"MATCH SIMPLE (**Opción por defecto** para SQL estandar y PostgreSQL)"*
> - *"MATCH PARTIAL"*
> - *"MATCH FULL"*

> [!important] La condición de entrada, en una línea
> **`MATCH` solo hace algo si (a) la FK es compuesta y (b) admite nulos.** Con una FK de una sola
> columna, o con todas sus columnas `NOT NULL`, las tres opciones son indistinguibles. Si en el
> parcial cae un ejercicio de matching, **la FK va a ser de dos o más columnas y nullable** — como en
> los dos primeros ejercicios del TP6.

### Las tres reglas *(slide 13)*

> [!quote] Textual del slide, respetando su estructura
> *"La integridad referencial se satisface si para cada tupla en la tabla referenciante se verifica lo
> siguiente:*
>
> *Ninguna de las columnas de la FK es NULL y existe una tupla en la tabla referenciada cuyos valores
> de clave coinciden con los de tales columnas, **o***
> - *Al menos una de las columnas en la FK es NULL (**MATCH SIMPLE**) y puede o no el resto hacer
>   referencia a la PK*
> - *Los valores de los atributos no nulos de la FK se corresponden con los correspondientes valores
>   de la clave, al menos en una tupla de la tabla referenciada (**MATCH PARTIAL**)*
> - *Todas las columnas de la FK son NULL (**MATCH FULL**) o hacen referencia a la PK completa"*

Reescrito como reglas operativas — **es la forma en que conviene tenerlo para el TP y el parcial**:

| Estado de la FK | `SIMPLE` | `PARTIAL` | `FULL` |
| --- | :---: | :---: | :---: |
| **Ningún** valor nulo, y la combinación **existe** en la referenciada | ✅ | ✅ | ✅ |
| **Ningún** valor nulo, y la combinación **no existe** | ❌ | ❌ | ❌ |
| **Todos** los valores nulos | ✅ | ✅ | ✅ |
| **Algunos** nulos, y los no nulos **coinciden** con alguna tupla | ✅ | ✅ | ❌ |
| **Algunos** nulos, y los no nulos **no coinciden** con ninguna | ✅ | ❌ | ❌ |

> [!tip] La regla mnemotécnica: **cuántos nulos hacen falta para zafar**
> - **`SIMPLE`** — *"con un nulo alcanza"*. **Un solo** nulo en la FK y el chequeo se saltea entero,
>   sin mirar el resto. Es el más permisivo, y el default.
> - **`PARTIAL`** — *"los nulos zafan; el resto tiene que coincidir"*. Ignora las columnas nulas pero
>   **exige que las no nulas machen** contra alguna tupla.
> - **`FULL`** — *"todo o nada"*. O todas nulas, o ninguna nula y coincidiendo. **Prohíbe la mezcla.**
>
> Ordenados de más a menos permisivo: **`SIMPLE` ⊇ `PARTIAL` ⊇ `FULL`**. Cualquier fila que pasa
> `FULL` pasa `PARTIAL`, y cualquiera que pasa `PARTIAL` pasa `SIMPLE`. **Nunca puede haber un `ok`
> en `FULL` con una `X` en `SIMPLE`** — es el chequeo de sanidad para saber si uno se equivocó.

> [!note] `FULL` es el que uno **quiere** casi siempre, y `SIMPLE` es el que **tiene**
> Una FK compuesta a medio llenar —*"sé la zona pero no el número de cliente"*— casi nunca es un
> estado del mundo válido: es un dato a medio cargar. `MATCH FULL` lo prohíbe. Pero el default del
> estándar es `SIMPLE`, y **MySQL solo tiene `SIMPLE`**. En la práctica, si se quiere `FULL` en MySQL
> hay que agregarlo a mano con un `CHECK`:
>
> ```sql
> CHECK ( (Zona IS NULL AND NroC IS NULL)
>      OR (Zona IS NOT NULL AND NroC IS NOT NULL) )
> ```
>
> *(Razonamiento propio, no está en el deck. Fuerza la parte "todo o nada" de `FULL`; la parte
> "coincide con la PK" ya la da la FK.)*

### El ejemplo del slide 14

DER del slide: `EMPLEADO ──(0,N)── Pertenece ──(0,1)── AREA`, con `IdEmp` como clave de EMPLEADO y
**`CodArea` compuesta por `TipoA` + `IdArea`** en AREA. La FK de EMPLEADO es entonces
`(TipoA, IdArea)` — **compuesta y nullable**, que es la condición de entrada del slide 12.

> [!quote] La consigna, textual
> *"Analizar la posibilidad de alta de las sig. tuplas en T-EMPLEADO según los distintos tipos de
> matching (suponiendo que la FK admita nulos)"*

**AREA** *(las filas relevantes; el slide antepone un `…`)*:

| TipoA | IdArea |
| --- | --- |
| A | 1 |
| B | 1 |
| B | 2 |

**Las cinco altas y su veredicto, tal cual el slide:**

| IdEmp | TipoA | IdArea | Simple | Parcial | Full |
| ---: | --- | --- | :---: | :---: | :---: |
| 1 | `A` | `1` | ok | ok | ok |
| 2 | `A` | `2` | ❌ | ❌ | ❌ |
| 3 | `null` | `null` | ok | ok | ok |
| 4 | `null` | `1` | ok | ok | ❌ |
| 5 | `C` | `null` | ok | ❌ | ❌ |

**Por qué cada una** *(el slide da la tabla sin justificar; esto es reconstrucción propia)*:

| # | Razón |
| --- | --- |
| **1** | Sin nulos y `(A,1)` **está** en AREA → pasa las tres. |
| **2** | Sin nulos y `(A,2)` **no está**. ⚠️ **Existe `A` como TipoA y existe `2` como IdArea, pero no juntos.** Es la trampa central del tema: el matching es **por combinación**, no columna por columna. |
| **3** | Todo nulo → pasa las tres, incluida `FULL`. |
| **4** | Mezcla. `SIMPLE`: hay un nulo, listo. `PARTIAL`: el no nulo es `IdArea = 1`, y **hay** tuplas con `IdArea = 1` — `(A,1)` y `(B,1)` —, así que pasa. `FULL`: mezcla → rechaza. |
| **5** | Mezcla. `SIMPLE`: hay un nulo, pasa. `PARTIAL`: el no nulo es `TipoA = 'C'`, y **no hay ninguna** tupla con `TipoA = 'C'` → rechaza. `FULL`: mezcla → rechaza. |

> [!important] Las filas 4 y 5 son las que distinguen `PARTIAL` de `FULL` y de `SIMPLE`
> Las dos tienen la **misma forma** —un nulo y un no nulo— y **dan distinto en `PARTIAL`**. La única
> diferencia es si el valor no nulo aparece en alguna tupla de la referenciada. **Si un ejercicio de
> matching tiene una sola fila interesante, va a ser una de estas dos.**
>
> El TP6 lo repite calcado: sus casos **1.c.i** `(B, null)` y **1.c.iv** `(null, 3)` son las filas 5 y
> 4 de este slide, con otros valores. Ver [[Práctica 2026-08-25]].

---

## Slides 15–16 · Las otras restricciones declarativas

### La jerarquía *(slide 15)*

> [!quote] Textual
> *"Además de las anteriores, se puede requerir otras RI específicas sobre los datos según la
> estrategia de funcionamiento de la organización"*
>
> *"La especificación declarativa de RI sigue la **estructura jerárquica del modelo relacional
> (atributo→tupla→tabla→BD)**:"*
>
> - *"RI **Dominio** (DOMAIN)"*
> - *"RI de tabla asociada a uno ó más atributos (**CHECK de registro**)"*
> - *"RI de tabla asociada a varias tuplas (**CHECK de tabla**)"*
> - *"RI generales de la base de datos (**ASSERTION**)"*
>
> *"Se activan siempre que se realice alguna operación sobre los datos afectados por la restricción"*
> · *"Su incumplimiento promueve el **rechazo** de la operación"*

> [!important] Ésta es la tabla que hay que saber de memoria — es el ejercicio 3.a del TP6
> El TP6 pide clasificar nueve restricciones exactamente en estas cuatro categorías y elegir el
> recurso. La regla de decisión, en una pregunta: **¿cuántas cosas hay que mirar para saber si se
> cumple?**
>
> | Ámbito | Alcanza con mirar… | Recurso SQL-1999 | Cómo se reconoce |
> | --- | --- | --- | --- |
> | **atributo / dominio** | **una columna** de una fila | `CREATE DOMAIN` + `CHECK`, o `CHECK` en la columna | *"el sueldo debe ser > 0"*, *"la nacionalidad debe estar en esta lista"* |
> | **registro / tupla** | **varias columnas de la misma fila** | `CHECK` de tabla *(sin subconsulta)* | *"la fecha de ascenso debe ser posterior a la de ingreso"* |
> | **tabla** | **varias filas de la misma tabla** | `CHECK` de tabla *(con subconsulta)* | *"no más de 30 empleados por área"* — hay un **conteo** o un **agregado** |
> | **base de datos** | **más de una tabla** | `CREATE ASSERTION` | *"el sueldo no puede superar al del gerente de su área"* |
>
> **El disparador de la respuesta es siempre el mismo: contar tablas y contar filas.** Una tabla y una
> fila → tupla. Una tabla y varias filas → tabla. Varias tablas → assertion.

> [!warning] Ojo con la fila *registro/tupla*: la palabra **"tabla"** del deck confunde
> El slide llama a las dos del medio *"RI de tabla asociada a…"*: a **uno o más atributos** (registro)
> y a **varias tuplas** (tabla). Las dos se escriben con `CHECK` en un `ALTER TABLE`, y por eso el
> deck las llama *"de tabla"* — pero **el ámbito es distinto** y el TP6 pide justamente el ámbito, no
> el recurso. En la columna *Tipo de restricción* del TP hay que poner **"de registro/tupla"** o
> **"de tabla"** según cuántas filas mire, no según la sentencia que se usa.

### La otra alternativa *(slide 16)*

> [!quote] Textual
> *"Otra alternativa para especificar RI → **SQL Procedural**: **DISPARADORES (TRIGGERS)** → Es una
> pieza de código almacenada en la BD que "se dispara" automáticamente ante la ocurrencia de algún
> evento · **PROCEDIMIENTOS** · **FUNCIONES**"*
>
> *"Recurso útil ante la **imposibilidad de definir en los DBMS**:"*
> - *"restricciones complejas en forma declarativa"*
> - *"ciertas acciones referenciales"*
> - *"acciones específicas de reparación"*

Es la primera mención de triggers, y la justificación completa vuelve en el slide 25.

---

## Slides 17–19 · RI de dominio / atributo

### Qué son *(slide 17)*

> [!quote] Textual
> - *"Permiten definir el conjunto de los valores válidos de un atributo"*
> - *"Casos particulares: **NOT NULL, DEFAULT, PRIMARY KEY, UNIQUE**"*
> - *"Ámbito de la restricción: **atributo**"*
> - *"Se pueden especificar las RI del atributo en la sentencia CREATE TABLE **o definirlas en un
>   dominio** y declarar el atributo perteneciente al dominio"*

```sql
CREATE DOMAIN NomDominio
AS TipoDato [ DEFAULT ValorDefecto ]
[ [CONSTRAINT NomRestriccion] CHECK (condición);
```

> [!quote] El recuadro que aparece **tres veces** en el deck (slides 17, 20 y 23)
> *"La condición debe evaluar como **VERDADERA o DESCONOCIDA**"*

> [!important] Ésta es la regla de `NULL` en los `CHECK`, y es contraintuitiva
> Un `CHECK` **no rechaza** cuando su condición da `UNKNOWN` — solo cuando da `FALSE`.
>
> Consecuencia directa: **`CHECK (sueldo > 0)` acepta `sueldo = NULL`**, porque `NULL > 0` es
> `UNKNOWN`, no `FALSE`. Si el atributo no debe ser nulo, hay que decirlo aparte con `NOT NULL`: el
> `CHECK` no lo cubre.
>
> Es el reverso exacto del `WHERE`, que **sí** descarta las filas `UNKNOWN`. El mismo `NULL` con la
> misma expresión da resultados opuestos en las dos cláusulas — y es de las cosas que caen en el
> parcial. El tratamiento completo de la lógica trivaluada está en
> [[1.05.01 - SQL — consultas|SQL — consultas]] § 11.
>
> ⚠️ Ojo con la asimetría del deck: **`WITH CHECK OPTION`** de las vistas —[[Clase 06 - Vistas-Parte 1]]
> slide 15— usa la **misma palabra** `CHECK` y **no** la misma regla de nulos. Son cosas distintas.

> [!bug] El paréntesis de la sintaxis del slide 17 **no cierra**
> Textual: `[ [CONSTRAINT NomRestriccion] CHECK (condición);` — abre `[` dos veces y cierra ninguna.
> Es una errata de tipeo del slide; la gramática correcta es
> `[ [CONSTRAINT nombre] CHECK (condición) ]`.

### Los tipos de condición *(slide 18)*

| Tipo | Operadores | Ejemplo del slide |
| --- | --- | --- |
| **Comparación simple** | `=` `<` `>` `<=` `>=` `<>` | `Sueldo > 0` |
| **Rango** | `[NOT] BETWEEN` *("incluye extremos")* | `nota BETWEEN 0 AND 10` |
| **Pertenencia** | `[NOT] IN` | `Area IN ('Académica', 'Posgrado', 'Extensión')` |
| **Semejanza de patrones** | `[NOT] LIKE` — `%` *(0 o más caracteres)*, `_` *(un carácter)* | `LIKE 's%'` · `LIKE 's_'` |
| **Test de nulidad** | `IS [NOT] NULL` | `FechaIngreso IS NOT NULL` |

> *"AND, OR se utilizan para concatenar distintas condiciones"* · *"Se antepone NOT para negarlas"*

> [!bug] Las comillas del slide 18 están rotas
> Textual: `Area IN („Académica‟, Posgrado‟, „Extensión‟)`. Son comillas tipográficas mal convertidas
> **y a `Posgrado` le falta la de apertura**. En SQL van comillas simples rectas:
> `IN ('Académica', 'Posgrado', 'Extensión')`.

> [!tip] El `_` de `LIKE` es un comodín — y el TP6 lo cobra
> El slide lo dice (*"`_` para un carácter simple"*) sin señalar la consecuencia: **para buscar un
> guion bajo literal hay que escaparlo.** El ejercicio 3.B.7 del TP6 pide *"Los códigos de sucursal
> deben comenzar con el string `'S_'`"*, y el `CHECK` ingenuo `LIKE 'S_%'` acepta `SX123` — porque
> `_` matchea cualquier carácter. La forma correcta es `LIKE 'S\_%'`. Ver [[Práctica 2026-08-25]].

### El ejemplo *(slide 19)*

> *"El sueldo de un empleado es un valor no nulo, mayor a 0 e inferior a 50000, y con 2 decimales"* ·
> `EMPLEADO(idE, .., sueldo)`

Las **tres** formas que da el slide, en orden:

```sql
-- (1) con dominio
CREATE DOMAIN SueldoValido
AS Numeric (7,2) NOT NULL
CHECK (value BETWEEN 0 AND 50000);

CREATE TABLE Empleado
( …. ,
  sueldo SueldoValido, ... );
```

```sql
-- (2) sin dominio, con CHECK en la columna
CREATE TABLE Empleado
( …. ,
  sueldo Numeric (7,2) NOT NULL
    CHECK (sueldo BETWEEN 0 AND 50000),
  …. );
```

> [!note] `value` es la palabra clave del `CREATE DOMAIN`
> Dentro de un dominio no hay nombre de columna todavía, así que el estándar usa la palabra reservada
> **`value`** para referirse al valor que se está chequeando. En el `CHECK` de la columna, en cambio,
> se escribe el nombre de la columna (`sueldo`). El slide muestra las dos y no lo explica.

> [!bug] El enunciado dice *"mayor a 0"* y el `CHECK` escribe `BETWEEN 0 AND 50000`
> **`BETWEEN` incluye los extremos** —lo dice el propio slide 18—, así que ese `CHECK` **acepta
> `sueldo = 0`**, que el enunciado prohíbe. Y con *"inferior a 50000"* pasa lo mismo del otro lado:
> acepta exactamente `50000`.
>
> Lo correcto para el enunciado sería `CHECK (value > 0 AND value < 50000)`. Es un error del slide,
> chico pero exactamente del tipo que se corrige en un parcial. **Y el TP6 tiene el mismo patrón**:
> su A.2 pide *"fechas posteriores **o iguales** al 2010"* — ahí `>=` sí es lo correcto, y hay que
> leerlo con cuidado.

> [!warning] `CREATE DOMAIN` **no existe en MySQL**
> Es de las cosas más limpias del estándar y de las que menos motores implementan. PostgreSQL sí lo
> tiene; MySQL no. Los sustitutos en MySQL son el tipo `ENUM` (para el caso `IN (…)`) o repetir el
> `CHECK` en cada columna. Detalle en [[MySQL]] § *5*.

## Slides 20–21 · `CHECK` de registro

### Qué es *(slide 20)*

> [!quote] Textual
> - *"Representa una restricción específica sobre los valores que puede tomar **una combinación de
>   atributos en una tupla**"*
> - *"Ámbito de la restricción: **tupla** (la RI se comprueba para cada fila que se inserta o
>   actualiza en la tabla)"*

```sql
CREATE TABLE NombreTabla
( …..
 { [[CONSTRAINT nom_restr] CHECK (condición) ] } );
```

```sql
ALTER TABLE NombreTabla
  ADD [CONSTRAINT nom_restr] CHECK (condición);
```

> [!note] El paréntesis del ámbito dice **"que se inserta o actualiza"**, y omite el `DELETE`
> Es correcto y es una diferencia real con el `CHECK` de tabla y con la `ASSERTION`: un `CHECK` de
> tupla **solo se evalúa sobre la fila que se toca**, así que un `DELETE` nunca lo puede violar.
> Un `CHECK` de tabla del tipo *"tiene que haber al menos un empleado por área"* **sí** se puede
> violar borrando — y ahí es donde los motores flaquean.

### El ejemplo *(slide 21)*

> *"Un empleado o bien no ha ascendido o, si ha ascendido, la fecha de ascenso no puede ser anterior a
> la fecha de ingreso"* · `EMPLEADO(idE, .., FechaAscenso, FechaIngreso)`

```sql
ALTER TABLE Empleado
  ADD CONSTRAINT Ascenso
  CHECK ( (FechaAscenso IS NULL)
          OR (FechaIngreso < FechaAscenso ));
```

> [!tip] La forma `(col IS NULL) OR (condición)` es **el patrón** de las RI opcionales
> Aparece acá y reaparece en el TP6 (ejercicio 3.A.3: *"los artículos publicados en 2017 deben ser de
> nacionalidad 'Argentino'"* → `CHECK (YEAR(fecha_pub) <> 2017 OR nacionalidad = 'Argentino')`).
>
> Y —razonamiento propio— el `IS NULL` explícito de este ejemplo **es redundante**: por la regla del
> slide 17, si `FechaAscenso` es `NULL` entonces `FechaIngreso < FechaAscenso` da `UNKNOWN`, y el
> `CHECK` acepta igual. Está escrito así por claridad, no por necesidad. **Escribirlo explícito es la
> práctica correcta**: hace visible la intención en vez de apoyarse en la lógica trivaluada.

## Slide 22 · `CHECK` de tabla

> [!quote] Textual
> - *"Representa una restricción que afecta **diferentes tuplas de una misma tabla**"*
> - *"Ámbito de la restricción: **tabla**"*
> - *"Casos particulares: **PRIMARY KEY, UNIQUE** (a nivel tabla)"*

> *"No puede haber más de 30 empleados por area"*

```sql
ALTER TABLE Empleado
ADD CONSTRAINT area_max
 CHECK ( NOT EXISTS (SELECT 1 FROM Empleado
                     GROUP BY TipoA, IdArea
                     HAVING count(*) > 30));
```

> [!important] El patrón `NOT EXISTS (SELECT … HAVING …)` es **la forma canónica** y hay que copiarlo
> SQL no tiene un cuantificador universal (*"para todo grupo, count ≤ 30"*). Se escribe siempre como
> **su negación existencial**: *"no existe ningún grupo con count > 30"*. El slide 24 lo dice
> explícitamente para las assertions, y vale igual acá.
>
> La receta, tres pasos: (1) escribir la consulta que **encuentra las violaciones**; (2) envolverla en
> `NOT EXISTS`; (3) ése es el `CHECK`. Con eso se resuelven los ejercicios **3.A.4**, **3.A.5**,
> **3.B.6** y **3.B.9** del TP6 sin pensar dos veces.

> [!warning] 🔴 Este `CHECK` **no compila en MySQL**, y es el corte que define el TP6
> **MySQL prohíbe subconsultas dentro de un `CHECK`.** Todo `CHECK` con `SELECT` adentro —o sea:
> todos los de **ámbito tabla**— queda afuera. Y `ASSERTION` no existe en ningún motor.
>
> El resultado es una línea de corte muy limpia, y es la respuesta al ejercicio **3.c** del TP6:
>
> | Ámbito | ¿Se puede declarar en MySQL? |
> | --- | --- |
> | atributo / dominio | ✅ con `CHECK` de columna *(sin `CREATE DOMAIN`)* |
> | registro / tupla | ✅ con `CHECK` de tabla |
> | **tabla** | ❌ necesita subconsulta → **trigger** |
> | **base de datos** | ❌ necesita `ASSERTION` → **trigger** |
>
> **La jerarquía del slide 15 es exactamente el mapa de lo que MySQL puede y no puede.** El corte cae
> entre *tupla* y *tabla*. Es lo más rendidor de esta clase para el parcial.
>
> *(Además: los `CHECK` de MySQL recién **se hacen cumplir desde 8.0.16**; antes se parseaban y se
> ignoraban en silencio. La cursada corre 9.7, así que sí se cumplen — pero es la clase de dato que
> conviene tener a mano. Ver [[MySQL]] § 5.)*

> [!warning] ⚠️ Corrección del 02/09 — **el corte no es de MySQL: es de todos los motores**
> El callout de arriba está bien en los hechos —MySQL efectivamente prohíbe la subconsulta— y **mal
> en el encuadre**: presenta como *"la limitación de MySQL"* algo que también le pasa al motor contra
> el que están escritos estos decks. El **slide 17 de la
> [[Clase 10 - Restricciones integridad-Parte 2]]** lo dice textual:
>
> > *"**Postgres NO implementa este tipo de checks, Postgres no permite un select dentro de un
> > constraint…. ☹**"*
>
> La tabla de arriba no cambia de contenido, pero su encabezado se lee mejor como **"¿Se puede
> declarar?"**, a secas: **de ámbito tabla para arriba se va a trigger en cualquier motor**. La
> respuesta al **3.c del TP6** es la misma; el *porqué* no: no es *"MySQL se queda corto y el estándar
> o PostgreSQL lo resolverían"*, es que **el `CHECK` con subconsulta es una promesa del estándar que
> nadie cumple** — exactamente como la `ASSERTION`. Los **slides 14–19 de la Clase 10** son la
> respuesta canónica al 3.c, no un repaso.

## Slides 23–24 · `ASSERTION`

### Qué es *(slide 23)*

> [!quote] Textual
> - *"Permiten definir restricciones sobre un **número arbitrario de atributos** de un **número
>   arbitrario de tablas**"*
> - *"Ámbito de la restricción: **base de datos**"*
> - *"**No están asociadas a un elemento** (tabla o dominio) en particular"*
> - *"Su activación se daría ante actualizaciones sobre las tablas involucradas"*
> - *"Requerirían **alto costo** para comprobación y mantenimiento"*
> - → ***"los DBMS comerciales no soportan ASSERTIONS !"***

```sql
CREATE ASSERTION NomAssertion CHECK (condición);
```

> [!important] El deck usa el **potencial** a propósito
> *"Su activación **se daría**"*, *"**Requerirían** alto costo"*. No es un descuido de redacción: es
> que **no hay implementación**. `CREATE ASSERTION` está en SQL-92, y treinta años después ningún
> motor mainstream la tiene — ni MySQL, ni PostgreSQL, ni Oracle, ni SQL Server.
>
> **Segunda cita, del 02/09.** El **slide 18 de la [[Clase 10 - Restricciones integridad-Parte 2]]**
> repite la afirmación —*"Ninguna base de datos **comercial** implementa Assertions"*— con **el mismo
> hedge** que este slide 23. Son dos citas de la cátedra para lo mismo, y ninguna de las dos dice
> *"mainstream"*: esa palabra —y el listado de los cuatro motores— **sigue siendo razonamiento
> propio**. Lo que la Clase 10 **sí** agrega es el **remedio**, que este deck no da: *"Se deberá
> controlar la restricción con **triggers en varias tablas**"*, y el porqué en su slide 19 — con un
> solo trigger sobre `EMPLEADO`, cambiar el jefe en `DEPARTAMENTO` no despertaría nada.
>
> **Por qué**: una assertion no cuelga de ninguna tabla, así que el motor tendría que decidir por sí
> mismo, para cada `INSERT`/`UPDATE`/`DELETE` de **cualquier** tabla, si esa operación puede violarla
> — y reevaluar una consulta que puede recorrer varias tablas enteras. Ésa es la razón del *"alto
> costo"* del slide.
>
> **Consecuencia para el TP6:** el ejercicio 3.b pide escribir las sentencias *"en SQL estándar"*,
> incluidas las `CREATE ASSERTION`. Se escriben aunque no corran en ningún lado — el TP lo sabe, y
> por eso el 3.c pregunta aparte cuáles **sí** soporta MySQL.

### El ejemplo *(slide 24)*

> *"El sueldo de los empleados de un área no puede ser mayor al sueldo del gerente de esa área"*
> `EMPLEADO (idE, .., sueldo, AreaT)` · `AREA (IdArea, …., gerente)`

```sql
CREATE ASSERTION salario_valido
CHECK ( NOT EXISTS ( SELECT 1 FROM Empleado E, Empleado G, Area A
                   WHERE E.sueldo > G.sueldo
                   AND E.AreaT = A.IdArea
                   AND G.IdE = A.gerente ) );
```

> [!quote] La regla que el slide deja escrita al pie — **es la que hay que retener**
> *"SQL no proporciona un mecanismo para expresar la condición «**para todo X, P(X)**» (P=predicado) →
> se debe utilizar su equivalente «**no existe X tal que no P(X)**»"*

> [!note] El self-join `Empleado E, Empleado G` es lo que hace funcionar el ejemplo
> La misma tabla aparece dos veces con alias distintos: `E` es el empleado cualquiera y `G` el
> gerente. Sin el self-join no se puede comparar un empleado contra otro. Es el mismo recurso de la
> [[Clase 05 - Consultas de Datos–Parte 2]], acá aplicado a una restricción.
>
> Y —razonamiento propio— **el ejemplo tiene un hueco**: si un área no tiene gerente asignado
> (`A.gerente IS NULL`), el join no produce ninguna fila y **la restricción se satisface
> vacuamente**. Los empleados de un área sin gerente pueden cobrar lo que quieran. Es correcto según
> lo escrito, pero probablemente no es lo que se quería.

---

## Slides 25–38 · Triggers

> [!warning] Recordatorio: este bloque **se adelanta al cronograma**
> *"Triggers y SQL Procedural"* es la teórica del **31/08**, y el TP6 del 25/08 **no los usa**. Está
> acá porque el material es de esta clase; para el TP6, alcanza con los slides 2–24.
>
> **Corrección del 02/09 — "adelantarse" no significó "solaparse".** Acá se había previsto que la
> teórica del 31/08 iba a **repetir** este bloque entero. Llegó
> —[[Clase 10 - Restricciones integridad-Parte 2]]— y **no vuelve sobre ninguno**: en sus 20 slides no
> hay **una sola sentencia `CREATE TRIGGER`**, ni granularidad, ni `:new`/`:old`, ni cascadas, ni el
> modelo de ejecución SQL-99. Al contrario: sus slides 17 y 19 **presuponen** este vocabulario
> (*"analizar la granularidad, eventos y tiempo de activación"*) en vez de enseñarlo. Los dos decks
> están **repartidos, no superpuestos**: **la sintaxis de triggers se estudia acá**, y el lenguaje
> procedural en el que se escribe el cuerpo de un trigger —funciones, stored procedures, cursores—
> está allá.

### Slide 25 · La motivación

> [!quote] Los tres motivos, textuales
> - *"imposibilidad de utilizar assertions en DBMS"*
> - *"carencia de implementación de ciertas acciones referenciales"*
> - *"no disponibilidad de acciones específicas diferentes al rechazo y la reparación estándar"*
>
> → *"necesidad de una herramienta útil para escribir aserciones, restricciones complejas, acciones
> específicas de reparación, etc."* → ***"Triggers (disparadores)"***

Los tres motivos **no son teóricos**: los tres son cosas que el deck ya mostró que faltan.

| Motivo del slide 25 | Dónde apareció el problema |
| --- | --- |
| assertions no implementadas | slide 23, *"los DBMS comerciales no soportan ASSERTIONS !"* |
| acciones referenciales que faltan | slide 8 lista cinco; **InnoDB no implementa `SET DEFAULT`** |
| solo hay rechazo y reparación estándar | slides 9–10: las cinco acciones y ninguna más |

### Slide 26 · Qué es un trigger

> [!quote] Textual
> - *"**Trigger**: pieza de código (**no declarativo**) almacenada que "se dispara" automáticamente
>   ante la ocurrencia de un evento sobre la base de datos"*
> - *"Puede considerarse una regla **evento-condición-acción (ECA)**"*
> - *"Es persistente y accesible para todas las operaciones de la BD (según se haya definido)"*

Y el desglose ECA, también textual:

| | |
| --- | --- |
| **Evento** | *"sentencia o situación que dispara su ejecución"* |
| **Condición** | *"expresión booleana que debe evaluar en VERDADERO para que el trigger se active. Si evalúa en FALSO o DESCONOCIDO no se ejecuta. **Solo para Triggers a nivel fila**"* |
| **Acción** | *"procedimiento que contiene las sentencias SQL a ser ejecutadas"* |

> [!important] La regla de `NULL` acá es **la opuesta** a la de los `CHECK`
> - `CHECK` *(slides 17, 20, 23)*: se cumple con **VERDADERO o DESCONOCIDO**. `UNKNOWN` **acepta**.
> - `WHEN` de un trigger *(slide 26)*: se activa **solo** con VERDADERO. `UNKNOWN` **no dispara**.
>
> Es la misma expresión booleana con `NULL` adentro dando comportamientos contrarios en las dos
> cláusulas del mismo deck. Vale la pena tenerlo anotado: es exactamente el tipo de detalle que se
> pregunta.

### Slide 27 · La sintaxis *(PostgreSQL)*

> [!warning] El título del slide es literal: ***"TRIGGERS – SINTAXIS PostgreSQL"***
> No hay ambigüedad. Lo que sigue **no es SQL estándar ni MySQL**.

```sql
CREATE [ CONSTRAINT ] TRIGGER nombre_del_trigger
{ BEFORE | AFTER | INSTEAD OF }                       -- tiempo de activación
{ INSERT [ OR ] UPDATE [ OF nombre_columna [, ... ] ] -- EVENTO
   [ OR ] DELETE [ OR ] TRUNCATE }
   ON nombre_tabla_o_vista
   [ FOR [ EACH ] { ROW | STATEMENT } ]               -- granularidad
   [ WHEN ( condición ) ]                             -- CONDICIÓN
   EXECUTE PROCEDURE nombre_función;                  -- ACCIÓN
```

> *"Para eliminación de un trigger existente: `DROP TRIGGER <nombre trigger>`"*
> *"La función que se invoca debe ser de tipo **ttrigger**"*

> [!bug] **`ttrigger`** con doble `t` es un tipeo
> El tipo se llama `trigger` (`RETURNS trigger`, como escribe el propio slide 36).

> [!note] Dos detalles de PostgreSQL que el slide no marca
> - **`EXECUTE PROCEDURE`** está **deprecado** desde PostgreSQL 11 en favor de `EXECUTE FUNCTION`.
>   Sigue aceptándose, así que el slide no está mal — está viejo. Encaja con el resto del material,
>   que linkea la doc de PostgreSQL 9.5.
> - **`TRUNCATE`** como evento es propio de PostgreSQL y **solo admite `FOR EACH STATEMENT`**.
>
> *(Razonamiento propio; verificar contra la doc si hiciera falta citarlo.)*

> [!warning] Casi nada de esta sintaxis sobrevive el pasaje a MySQL
> | Del slide | En **MySQL** |
> | --- | --- |
> | `INSTEAD OF` | ❌ no existe — solo `BEFORE` / `AFTER` |
> | `INSERT OR UPDATE OR DELETE` combinados | ❌ **un evento por trigger** |
> | `UPDATE OF columna` | ❌ no existe — se chequea a mano con `IF NEW.c <> OLD.c` |
> | `TRUNCATE` como evento | ❌ no existe |
> | `FOR EACH STATEMENT` | ❌ **solo `FOR EACH ROW`** |
> | `WHEN (condición)` | ❌ no existe — se pone un `IF` adentro del cuerpo |
> | `EXECUTE PROCEDURE fn()` | ❌ el cuerpo va **inline**, entre `BEGIN … END` |
> | `ON` una **vista** | ❌ solo sobre **tablas** |
>
> Es la tabla más densa del vault: **de ocho cláusulas del slide, MySQL no tiene ninguna igual.**
> La forma MySQL completa está en [[MySQL]] § *5*.

### Slide 28 · Eventos y tiempo de activación

| **EVENTO** *(sobre la tabla o vista asociada)* | **TIEMPO DE ACTIVACIÓN** |
| --- | --- |
| Inserción (`INSERT`) | *"antes de la sentencia disparadora (`BEFORE`)"* |
| Actualización (`UPDATE`) — *"se puede especificar columna/s"* | *"después de la sentencia disparadora (`AFTER`)"* |
| Eliminación (`DELETE`) | *"en lugar de la sentencia disparadora (`INSTEAD OF`)"* |

> [!tip] Cuándo usar cada tiempo — razonamiento propio, el slide solo los enumera
> - **`BEFORE`** — para **validar o corregir** el valor antes de que se escriba. Es el único que puede
>   modificar `NEW` y que puede abortar la operación limpiamente.
> - **`AFTER`** — para **propagar**: mantener un contador, escribir un log, tocar otra tabla. Los
>   datos ya están escritos y las RI declarativas ya se chequearon *(slide 38)*.
> - **`INSTEAD OF`** — solo sobre **vistas**, para hacer escribible una vista que no es actualizable.
>   Es el mecanismo que menciona el slide 12 de [[Clase 07 - Vistas-Parte 2]], y **MySQL no lo tiene**.

### Slide 29 · Granularidad

> *"**FOR EACH ROW**: se ejecuta una vez por cada fila afectada"*
> *"**FOR EACH STATEMENT**: se ejecuta una vez para la sentencia SQL disparadora, independientemente
> de la cantidad de filas que afecte"*
> *"(Por defecto → **FOR EACH STATEMENT**)"*

> [!warning] El default sorprende, y en MySQL directamente no existe
> Casi todo el mundo escribe triggers `FOR EACH ROW`, así que el default `STATEMENT` del estándar es
> contraintuitivo — **y hay que acordarse porque es exactamente lo que se pregunta**. En **MySQL
> `FOR EACH ROW` es obligatorio** y no hay statement-level, así que la pregunta solo tiene sentido en
> el terreno del estándar/PostgreSQL.
>
> Y se conecta con el slide 26: la condición `WHEN` es *"Solo para Triggers a nivel fila"*, o sea que
> el trigger del default (`STATEMENT`) es justamente el que **no** puede tener condición.

### Slide 30 · Referencias a los valores

> [!quote] Textual
> *"La sentencia `INSERT` manipula una **nueva fila** (si el trigger es FOR EACH ROW) o un **nuevo
> conjunto de filas** (si es FOR EACH STATEMENT)"*
>
> *"`DELETE` manipula una **fila vieja** (para triggers a nivel fila) o un conjunto de filas o tabla
> vieja (para triggers de sentencia)"*
>
> *"`UPDATE` manipula estados viejos y nuevos, tanto de filas como de conjuntos de filas, según
> corresponda"*
>
> *"Corresponde referirse a estos elementos como **`:new` y `:old`** dentro del cuerpo de la función
> trigger"*

Qué está disponible en cada evento — **no lo dice el slide en tabla, y es la forma útil**:

| Evento | `:old` | `:new` |
| --- | :---: | :---: |
| `INSERT` | ❌ | ✅ |
| `UPDATE` | ✅ | ✅ |
| `DELETE` | ✅ | ❌ |

> [!bug] 🔴 **`:new` / `:old` con dos puntos es sintaxis de Oracle, no de PostgreSQL — y el propio deck lo desmiente seis slides después**
> El slide 30 dice `:new` y `:old`. **El slide 36, que es la función PL/pgSQL de ejemplo, escribe
> `new.AreaT` y `old.AreaT` — sin dos puntos.** No pueden ser las dos.
>
> Quién tiene razón: **el slide 36**. En PL/pgSQL las variables son `NEW` y `OLD`, sin prefijo. Los
> dos puntos son de **PL/SQL de Oracle**, y solo dentro del cuerpo de un trigger — en la cláusula
> `WHEN` de Oracle sí van, en PostgreSQL nunca.
>
> Y el slide **34** repite el error: escribe `WHEN (:old.sueldo > :new.sueldo)` en un deck cuyo slide
> 27 se titula *"SINTAXIS PostgreSQL"*. En PostgreSQL sería `WHEN (OLD.sueldo > NEW.sueldo)`.
>
> **En MySQL también van sin dos puntos**: `NEW.col` / `OLD.col`. O sea: la forma del slide 30 no
> corre ni en el motor que el deck declara ni en el de la cursada. **Es Oracle infiltrado**, el mismo
> dialecto que ya había aparecido en las partes 2 y 3 de la [[Clase 05 - Consultas de Datos–Parte 2]].

### Slide 31 · La acción

> [!quote] Textual
> - *"La acción consiste en una sentencia SQL aislada o un conjunto de sentencias, delimitadas en un
>   bloque `BEGIN . . . END`"*
> - *"Puede referirse a valores anteriores y nuevos que se modifican, nuevos que se insertan, o
>   anteriores que se eliminaron, según el evento que desencadenó la acción"*
> - *"Pueden incluir **sentencias de control** (`IF … ELSE`, `FOR`, `WHILE`, …)"*
> - *"**No pueden incluir sentencias del DDL** (`CREATE`, `ALTER`, `DROP`)"*
> - *"Un trigger `BEFORE` **no debería** contener sentencias SQL que alteren datos (`INSERT`, `UPDATE`,
>   `DELETE`): esto puede disparar otros triggers BEFORE (sus acciones van quedando pendientes)"*
> - *"La acción del trigger es un **procedimiento atómico** → Si cualquier sentencia del cuerpo del
>   trigger falla, la acción completa del trigger se deshace, **incluyendo las correspondientes a la
>   sentencia que lo disparó**"*

> [!important] La última viñeta es el punto de fondo, y es lo que hace usable un trigger como RI
> **Si el trigger falla, se deshace todo — incluida la sentencia original.** Sin esa garantía, un
> trigger no serviría para forzar una restricción: podría rechazar a medias y dejar la base
> inconsistente.
>
> Es la misma **atomicidad** de la A de ACID, aplicada al par (sentencia, trigger). Y es lo que
> permite el patrón *"rechazo"* del slide 34: el trigger llama a algo que falla a propósito, y con eso
> aborta la operación entera. En MySQL, ese *"algo que falla a propósito"* se escribe
> **`SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '…'`**.

> [!note] *"Pueden incluir sentencias de control"* es lo que separa lo declarativo de lo procedural
> Un `CHECK` es una **expresión booleana**: no tiene `IF`, no tiene bucles, no tiene orden de
> ejecución. Un trigger es **código**. Ésa es toda la diferencia entre las dos ramas del slide 4, y es
> también por qué el slide 37 dice que hay que preferir lo declarativo: el `CHECK` es analizable por
> el motor, el trigger es una caja negra.

### Slide 32 · Comportamiento y cascadas

> [!quote] Textual
> - *"Ante un cierto evento sobre una tabla → **pueden activarse varios triggers**!"*
> - *"Se puede producir una **activación de triggers en cascada** → Si la activación de un trigger T1
>   dispara otro trigger T2: **se suspende** la ejecución de T1, se ejecuta el trigger anidado T2 y
>   luego **se retoma** la ejecución de T1"*
> - *"→ esto podría dar lugar a una cadena "**infinita**" de activaciones!"*
> - *"Los DBMS suelen **limitar la longitud** de las cadenas de disparadores"*

El ejemplo del slide, en su diagrama:

```
SQL statement            UPDATE_T1 Trigger
UPDATE T1 SET …;   ───▶  BEFORE UPDATE ON T1
                         FOR EACH ROW                 INSERT_T2 Trigger
                         INSERT INTO T2 VALUES (...); ───▶ BEFORE INSERT ON T2
                                                           FOR EACH ROW
                                                           INSERT INTO ... VALUES (...);
```

> [!warning] Este ejemplo es **el que el slide 31 dice que no hay que escribir**
> El slide 31 acababa de decir que *"un trigger `BEFORE` no debería contener sentencias SQL que alteren
> datos"*, y el ejemplo del 32 es un `BEFORE UPDATE` que hace `INSERT`, disparando otro `BEFORE INSERT`
> que hace otro `INSERT`.
>
> **No es una contradicción**: el 32 está mostrando **por qué** el 31 lo desaconseja. Pero leídos
> sueltos parecen decir cosas opuestas, así que conviene tenerlos anotados juntos.

> [!note] La cascada es LIFO, y en MySQL hay una regla más
> *"se suspende T1, se ejecuta T2, se retoma T1"* es una **pila**, igual que las llamadas a función.
>
> Y MySQL agrega una restricción que el deck no menciona: **un trigger no puede modificar una tabla
> que ya está siendo usada por la sentencia que lo invocó** (error 1442). Es lo que impide el caso más
> obvio de recursión, y también impide muchos triggers legítimos. *(Razonamiento propio; ver
> [[MySQL]] § 5.)*

### Slide 33 · Para qué sirven

> [!quote] Los cinco usos, textuales
> - *"**Mantener datos derivados** - Generación automática de datos"*
> - *"**Forzado de reglas de integridad o del negocio complejas** (Ej. cuando no es posible incluirlas
>   declarativamente) o con acciones específicas de reparación (diferentes al rechazo y la reparación
>   estándar)"*
> - *"**Propagación de actualizaciones**"*
> - *"**Generación de logs** para soporte de auditoría de las acciones de la base de datos y chequeos
>   de seguridad"*
> - *"**Mantener vistas actualizadas** (cuando el DBMS no provee capacidades para hacerlo)"*

> [!tip] El quinto uso cierra un cabo suelto de la [[Clase 07 - Vistas-Parte 2|Clase 07]]
> *"Mantener vistas actualizadas cuando el DBMS no provee capacidades"* es exactamente lo que hay que
> hacer en MySQL para **simular una vista materializada** — que MySQL no tiene, como dice el slide 20
> de la Clase 07: una tabla real más triggers sobre las tablas base que la mantengan al día.
>
> Era una de las dudas abiertas de esa clase (*"¿cómo se hace en MySQL?"*). **Ésta es la respuesta**,
> y viene dos clases después.

### Slides 34–36 · Los ejemplos

#### Forzado de reglas de integridad *(slide 34)*

La plantilla que da el slide:

```sql
create trigger <nombre>
before <operación crítica sobre la BD>
when <condición por la que una RI es incumplida>
< acción(es) del trigger >   -- → rechazo (acción pasiva) / reparación (acción activa)
```

Y el ejemplo — *"Verificar que el sueldo de un empleado no se reduzca"*:

```sql
CREATE TRIGGER sueldo_no_se_reduce
  BEFORE UPDATE OF sueldo ON Empleado
  FOR EACH ROW
  WHEN (:old.sueldo > :new.sueldo)
  EXECUTE PROCEDURE funcion_error();
```

> [!important] Éste es **el ejemplo canónico de RI de transición de estados**
> Compara `:old` contra `:new`: **ningún `CHECK` puede hacer eso.** Es el cierre del arco que abrió el
> slide 2 con *"un voluntario puede cambiar de tarea solamente dos veces al año"* y que el slide 4
> nombró *RI de transición de estados*.
>
> Si en el parcial hay que justificar por qué una restricción necesita un trigger, **la respuesta casi
> siempre es ésta**: porque mira el estado anterior.

> [!bug] Recordatorio: los `:` de `:old` / `:new` son de Oracle
> En PostgreSQL: `WHEN (OLD.sueldo > NEW.sueldo)`. Ver el slide 30 más arriba.

> [!note] El nombre `funcion_error()` dice cómo se implementa el rechazo
> La *"acción pasiva"* del slide es una función que **lanza un error a propósito**. En PL/pgSQL sería
> `RAISE EXCEPTION`; en MySQL, `SIGNAL SQLSTATE '45000'`. Por la atomicidad del slide 31, ese error
> deshace también el `UPDATE` que disparó el trigger — que es todo el truco.

#### Actualización de datos derivados *(slides 35–36)*

*"Mantener automáticamente la cantidad total de empleados del Area (ante altas, bajas o
modificaciones en Empleado)"*
`EMPLEADO(idE, nombre, .., AreaT)` · `AREA(idArea, … CantEmp)`

```sql
CREATE TRIGGER Incrementar_EmpArea
AFTER INSERT OR UPDATE OF AreaT OR DELETE
ON Empleado
FOR EACH ROW
EXECUTE PROCEDURE cant_total_empleados();
```

```sql
CREATE FUNCTION cant_total_empleados ( )
RETURNS trigger AS $body$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE area set CantEmp = CantEmp + 1 where IdArea = new.AreaT;
        RETURN NEW;
    END IF;
    IF TG_OP = 'UPDATE' THEN
        UPDATE area set CantEmp = CantEmp - 1 where IdArea = old.AreaT;
        UPDATE area set CantEmp = CantEmp + 1 where IdArea = new.AreaT;
        RETURN NEW;
    END IF;
    IF TG_OP = 'DELETE' THEN
        UPDATE area set CantEmp = CantEmp - 1 where IdArea = old.AreaT;
        RETURN OLD;
    END IF;
END; $body$
LANGUAGE 'plpgsql'
```

Cuatro cosas que este ejemplo enseña y el slide no comenta:

| | |
| --- | --- |
| **`TG_OP`** | variable de PL/pgSQL con el evento que disparó (`'INSERT'`/`'UPDATE'`/`'DELETE'`). Es lo que permite **un solo trigger para los tres eventos**. En MySQL, donde cada evento necesita su propio trigger, no hace falta — y no existe |
| **`RETURN NEW` / `RETURN OLD`** | una función trigger de PostgreSQL **tiene que devolver algo**. En un `AFTER` el valor se ignora; en un `BEFORE ROW` devolver `NULL` **cancela la operación**. Acá es `AFTER`, así que es puro trámite |
| **`AFTER`, no `BEFORE`** | correcto: se cuenta lo que **ya** pasó. Con `BEFORE` el contador se adelantaría a una operación que las RI declarativas todavía podrían rechazar *(slide 38, paso 2b)* |
| **el `UPDATE` hace resta y suma** | y **no chequea si `old.AreaT = new.AreaT`**. Si el `UPDATE` toca la fila sin cambiarle el área, resta y suma sobre la misma → queda igual. Funciona por casualidad, no por diseño |

> [!bug] El ejemplo tiene **dos bugs reales**, y son buenos para pensar
> *(Razonamiento propio, el slide lo da como correcto.)*
> 1. **No maneja `NULL` en `AreaT`.** Si un empleado no tiene área, `where IdArea = NULL` no matchea
>    nada y el contador queda desfasado en silencio. Y el DER del slide 11 dice `(0,1)`: `AreaT`
>    **puede** ser nulo.
> 2. **No hay `RETURN` fuera de los tres `IF`.** Si `TG_OP` fuera otra cosa —`TRUNCATE`—, la función
>    termina sin `RETURN` y PL/pgSQL da error en tiempo de ejecución. Menor, pero el `ELSE` faltaría.
>
> Hay un tercer punto, no bug pero sí concepto: **el contador `CantEmp` es dato derivado**, o sea
> **redundancia deliberada**. Se acepta a cambio de no recontar; el precio es que hay que mantenerla,
> y de ahí el trigger. Es el mismo trade-off de la **vista materializada** de la
> [[Clase 07 - Vistas-Parte 2|Clase 07]] — hecho a mano.

### Slide 37 · Triggers vs. RI declarativas

> [!quote] Textual — **las tres frases más importantes del bloque de triggers**
> - *"Triggers → permiten definir y forzar reglas de integridad, pero **NO son una restricción de
>   integridad**"*
> - *"Un trigger definido para forzar una RI **no verifica su cumplimiento para los datos ya
>   almacenados** en la BD (una RI declarativa verifica la carga existente en la BD)"*
> - *"Los triggers **deberían usarse sólo cuando una RI no puede ser expresada mediante una cláusula
>   declarativa**"*

> [!important] La segunda es la diferencia práctica que más se cobra
> Cuando se hace `ALTER TABLE … ADD CONSTRAINT CHECK (…)`, el motor **valida las filas que ya están**:
> si alguna no cumple, el `ALTER` falla. Cuando se hace `CREATE TRIGGER`, **no pasa nada con lo ya
> cargado**: el trigger arranca a mirar recién a partir de la próxima operación.
>
> Consecuencia: **una base "protegida" solo por triggers puede tener datos que violan la regla**, y
> nadie se entera. Si hay que migrar una RI a trigger, la validación del histórico es un paso aparte y
> manual.
>
> **Y esto es lo que hace caro el ejercicio 3.c del TP6.** Las restricciones de ámbito *tabla* y
> *base de datos* no se pueden declarar en MySQL, así que van a trigger — y con eso **pierden la
> validación del histórico**. No es una traducción equivalente: es una degradación.

### Slide 38 · El modelo de ejecución SQL-99

El slide combina un diagrama —tomado de *"Semantic Integrity Support in SQL-99 and Commercial
(Object-)Relational Database Management Systems"*, de **Türker y Gertz**— con la lista de pasos en
castellano.

**El diagrama, de arriba abajo:**

```
                 SQL-Statement
                       │
         ┌─────────────▼─────────────┐
         │ Determine Set of          │
         │ Affected Rows             │
         └─────────────┬─────────────┘
         ┌─────────────▼─────────────┐
         │ Execute BEFORE Triggers   │──▶ Error
         └─────────────┬─────────────┘
  ╔══════════════ ▼ ══════════════════╗
  ║  Enforcement of Declarative       ║
  ║  Constraints                      ║
  ║  ┌─────────────────────────────┐  ║
  ║  │ Apply RESTRICT Rules        │──╫▶ Error
  ║  └─────────────┬───────────────┘  ║
  ║  ┌─────────────▼───────────────┐  ║
  ║  │ Apply CASCADE, SET NULL,    │──╫▶ Error
  ║  │ SET DEFAULT Rules           │  ║
  ║  └─────────────┬───────────────┘  ║
  ║  ┌─────────────▼───────────────┐  ║
  ║  │ Apply NO ACTION Rules       │──╫▶ Error
  ║  │ and Evaluate Constraints    │  ║
  ║  └─────────────┬───────────────┘  ║
  ╚══════════════ ▼ ══════════════════╝
         ┌───────────────────────────┐
         │ Execute AFTER Trigger     │──▶ Error
         └───────────────────────────┘
```

**Y la lista de pasos, textual del slide:**

> 1. *"Ejecuta todos los triggers **BEFORE-statement**"*
> 2. *"Realiza un ciclo por todas las filas afectadas por la sentencia SQL"*
>    a. *"Ejecuta todos los triggers **BEFORE-row**"*
>    b. *"Bloquea y actualiza cada fila y ejecuta los chequeos de integridad declarat. (**El bloqueo
>       no se levanta hasta el final de la transacción**)"*
>    c. *"Ejecuta todos los triggers **AFTER-row**"*
> 3. *"Completa las acciones correspondientes a la **verificación diferida** de integridad expresada
>    declarativamente"*
> 4. *"Ejecuta todos los triggers **AFTER-statement**"*

> [!important] Este slide es el que cierra el deck, y contesta tres preguntas de los slides anteriores
> 1. **Por qué `RESTRICT` ≠ `NO ACTION`** *(slide 9)*. Están en cajas distintas del diagrama, y
>    `RESTRICT` va **primero** — antes de las reparaciones. `NO ACTION` va **último**, junto con
>    *"Evaluate Constraints"*.
> 2. **Por qué un trigger `BEFORE` no debería alterar datos** *(slide 31)*. Corre **antes** de los
>    chequeos declarativos: lo que escriba puede terminar deshecho, y las cascadas de `BEFORE`
>    quedan pendientes.
> 3. **Por qué el contador del slide 35 va en un `AFTER`.** El `AFTER-row` corre en el paso 2c, o sea
>    **después** de que la fila fue escrita y validada. Un `BEFORE` contaría filas que todavía podrían
>    ser rechazadas.
>
> Y agrega una cuarta: **el bloqueo se toma en el paso 2b y no se suelta hasta el `COMMIT`**. Eso es
> concurrencia — el tema del programa que todavía no se dictó.

> [!warning] Los pasos 1, 3 y 4 **no existen en MySQL**
> | Paso del slide | En MySQL |
> | --- | --- |
> | 1 · `BEFORE-statement` | ❌ no hay triggers de sentencia |
> | 2a–2c · por fila | ✅ es lo único que hay |
> | 3 · **verificación diferida** | ❌ **no existe chequeo diferido** — todo es inmediato |
> | 4 · `AFTER-statement` | ❌ no hay triggers de sentencia |
>
> Y el paso 3 ausente es lo que colapsa `NO ACTION` con `RESTRICT` en InnoDB: **sin diferido, no hay
> "al final" donde evaluar.** Todo el punto 1 de arriba es teoría pura para esta cursada.

---

## Cuadro de bolsillo — todo el deck en una pantalla

| Pregunta | Respuesta |
| --- | --- |
| ¿Qué es una RI? | Condición que restringe los valores; forzarla garantiza **instancias legales** |
| ¿Quién la declara / quién la fuerza? | El **DBA** la declara; el **SGBD** la fuerza |
| Clasificación por naturaleza | **inherente** · **implícita** · **explícita** *(declarativa o procedural)* |
| Clasificación por estados | **de estado** · **de transición de estados** ← ésta necesita trigger |
| Las 5 RI de estado | unicidad · no nulidad · dominio · cardinalidad · participación |
| Regla de integridad referencial | la FK coincide con una clave de la referenciada **o es nula** |
| Las 5 acciones referenciales | `NO ACTION` *(default)* · `RESTRICT` · `CASCADE` · `SET NULL` · `SET DEFAULT` |
| `NO ACTION` vs. `RESTRICT` | misma semántica; **`RESTRICT` se chequea antes** *(slide 38)* |
| ¿Sobre qué tabla se disparan? | sobre la **referenciada**, nunca sobre la referenciante |
| Dos reglas en conflicto | manda la **restrictiva**: `RESTRICT` se evalúa primero |
| Los 3 matchings | `SIMPLE` *(un nulo alcanza — default)* · `PARTIAL` *(los no nulos deben machear)* · `FULL` *(todo o nada)* |
| ¿Cuándo importa el matching? | FK **compuesta** y **nullable**. Si no, las tres son iguales |
| La jerarquía declarativa | **atributo → tupla → tabla → base de datos** |
| Los 4 recursos | `CREATE DOMAIN` · `CHECK` de registro · `CHECK` de tabla · `CREATE ASSERTION` |
| Cómo se elige | **contar tablas y filas**: 1 tabla 1 fila → tupla; 1 tabla N filas → tabla; N tablas → assertion |
| Regla de `NULL` en un `CHECK` | se cumple con **VERDADERO o DESCONOCIDO**. `NULL` **acepta** |
| Regla de `NULL` en un `WHEN` de trigger | se activa **solo con VERDADERO**. `NULL` **no dispara** |
| ¿Por qué no hay `ASSERTION`? | *"Requerirían alto costo"* → *"los DBMS comerciales no soportan ASSERTIONS !"* |
| ¿Cómo se escribe "para todo"? | como **«no existe X tal que no P(X)»** → `NOT EXISTS (…)` |
| ¿Qué es un trigger? | regla **evento-condición-acción**, código **no declarativo**, persistente |
| Granularidad, y default | `FOR EACH ROW` · `FOR EACH STATEMENT` — **default: STATEMENT** |
| ¿Trigger = RI? | **No.** Y **no valida los datos ya cargados**; la RI declarativa sí |
| ¿Cuándo usar trigger? | **solo** cuando la RI no se puede expresar declarativamente *(slide 37)* |
| El corte — y **no es solo de MySQL** | atributo y tupla ✅ · tabla y BD ❌ *(nadie admite subconsulta en un `CHECK`: **PostgreSQL tampoco**, Clase 10 slide 17. Y `ASSERTION` no existe en ningún motor)* |

---

## Dudas abiertas

- [x] ~~🔴 **¿Cuándo llega la *Parte 2*, y qué trae?** El deck se llama *Parte 1*. Si la Parte 2 es la
      teórica del 31/08 (*"Triggers y SQL Procedural"*), entonces **los slides 25–38 se van a repetir**
      y este deck se adelantó. Si es otra cosa, falta material de restricciones que no vimos.~~
      ✅ **Cerrada el 02/09, y ninguna de las dos ramas acertó.** Llegó ese día, es
      **[[Clase 10 - Restricciones integridad-Parte 2]]** *(20 slides)*, es la teórica del **31/08**
      —*"Triggers y SQL Procedural"* en el [[_cronograma]], *"SQL PROCEDURAL · Triggers, Stored
      Procedures"* en su portada— y **la cátedra le puso número propio: es la Clase 10, no la 09**.
      Pero **los slides 25–38 no se repiten**: el deck 10 no trae sintaxis de triggers en absoluto.
      Trae lo que esta clase usó sin explicar —**el lenguaje procedural**: funciones, stored
      procedures y **cursores** *(concepto nuevo)*— más seis slides (14–19) que reencuadran la
      jerarquía de restricciones en **cuatro niveles** *(atributo · fila · tabla · generales)*, que
      son los del slide 15 con otro vocabulario. Y tampoco *"falta material de restricciones"*: esos
      seis slides **son** ese material.
- [ ] 🔴 **¿El parcial toma la sintaxis del estándar o la de MySQL?** Es la duda de siempre, pero acá
      pesa más que nunca: **`CREATE DOMAIN`, `CREATE ASSERTION`, `MATCH FULL/PARTIAL`, `SET DEFAULT`,
      `FOR EACH STATEMENT`, `INSTEAD OF` y `WHEN` no existen en MySQL** — o sea que la mitad del deck
      no se puede tipear en el motor de la cursada. El TP6 pregunta explícitamente *"cuáles soporta
      MySQL"* (ejercicio 3.c), lo que sugiere que **la cátedra pide las dos**: la del estándar para el
      concepto y la de MySQL para la implementación. **Confirmarlo.**
      **Al 02/09 sigue abierta para el parcial**, pero hay **dos datos nuevos**, los dos en la misma
      dirección. (1) El **TP7** repite la política del 3.c del TP6 y lo dice textual dos veces:
      *"aunque MySQL no soporta esta última opción, **resuelvalo según la teoría**"* (ej. 1.c) y
      *"aunque MySQL no lo soporta, **responda según la teoría**"* (ej. 2.b) → [[Práctica 2026-09-01]].
      (2) La [[Clase 10 - Restricciones integridad-Parte 2]], al repasar esta misma jerarquía en sus
      slides 14–19, **omite `CREATE DOMAIN`**: implementa el nivel de atributo con un `CHECK` de
      columna, que es lo que sí corre en MySQL. Cuando la cátedra resume, se queda con lo que corre.
- [ ] 🔴 **`:new` / `:old` (slide 30) vs. `new.` / `old.` (slide 36)** — el deck se contradice, y la
      forma correcta para PostgreSQL y para MySQL es la del 36, sin dos puntos. **¿Cuál se corrige?**
      **Al 02/09 sigue abierta, y se agrava**: el slide 17 de la
      [[Clase 10 - Restricciones integridad-Parte 2]] vuelve a meter **Oracle** en un deck de
      PostgreSQL — `months_between(sysdate, fecha_nacimiento)` — en el mismo recuadro donde se queja
      de que *"Postgres NO implementa este tipo de checks"*. Esa sentencia **no compila en ningún
      motor**, por dos razones distintas, y el deck nombra una sola. Van **dos decks consecutivos**
      con el mismo fenómeno → `CLAUDE.md` § *Puntos abiertos #2*.
- [ ] **El slide 11 tiene la columna `AreaT` tapada por un recuadro.** ¿Es así en la versión que se
      proyectó? Sin esa columna el ejercicio no se puede resolver.
- [ ] **El `CHECK` del slide 19 no coincide con su enunciado**: dice *"mayor a 0"* e *"inferior a
      50000"* y escribe `BETWEEN 0 AND 50000`, que incluye los dos extremos. ¿Es intencional?
- [ ] **¿`RESTRICT` y `NO ACTION` se toman como distintos en el parcial**, sabiendo que el motor de la
      cursada los trata igual? El slide 9 y el 38 los distinguen con cuidado; InnoDB no.
- [ ] **¿Qué se espera cuando `SET NULL` choca contra una FK `NOT NULL`?** El slide 9 dice *"sólo si
      admite nulos"* y no dice qué pasa si no. ¿La operación se rechaza, o la definición de la FK ya
      era ilegal?
- [ ] **`MATCH PARTIAL`**: ¿alguien lo implementa? El slide lo enseña como una de tres opciones reales.
      Ni PostgreSQL ni MySQL lo tienen. ¿Es solo teoría?
- [ ] **¿La `S` final de "RIRS" quiere decir algo?** El deck usa `RIRS` en los títulos y el TP6 usa
      `RIR`. ¿Es *"…Referencial (Sobre el eSquema)"*, o un tipeo que quedó?
- [ ] **Participación total vs. parcial**: el slide 5 la nombra como RI, pero **sigue sin definirse la
      notación** — es la misma duda abierta desde [[Clase 02 - Modelo Entidad-Relacion]].
- [ ] **Sumathi & Esakkirajan (slide 39) sigue sin estar en el vault**, y ya van **dos** decks que la
      citan *(éste y la [[Clase 06 - Vistas-Parte 1]])*.
- [ ] El deck cita **Date 7ª ed. (2000)** y el vault tiene la **8ª (2004)**. Confirmado que el capítulo
      de integridad es el **9** en la 8ª; **en la 7ª puede ser otro número**. Si la cátedra da páginas,
      pedir la edición.

## Enlaces

- Clase anterior: [[Clase 08 - Explicando el plan]] · clase siguiente:
  **[[Clase 10 - Restricciones integridad-Parte 2]]** *(la del 31/08 — SQL procedural: funciones,
  stored procedures, cursores, y los cuatro niveles de restricción)*
- Práctica de esa semana (martes 25/08): **[[Práctica 2026-08-25]]** — TP6 Restricciones declarativas
- Conceptos: [[1.09.01 - Restricciones de integridad|Restricciones de integridad]] ·
  [[1.09.02 - Integridad referencial y acciones referenciales|Integridad referencial]] ·
  [[1.09.03 - CHECK, DOMAIN y ASSERTION|CHECK, DOMAIN y ASSERTION]] ·
  [[1.09.04 - Triggers|Triggers]]
- Conceptos que esta clase reencuadra: [[1.03.02 - DDL — creación y alteración de tablas|DDL]] ·
  [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] ·
  [[1.05.01 - SQL — consultas|SQL — consultas]] § 11 *(lógica trivaluada)* ·
  [[1.06.01 - Vistas|Vistas]] *(`WITH CHECK OPTION`, `INSTEAD OF`, materializadas)*
- Motores: [[MySQL]] § *5 · Restricciones e integridad* · [[PostgreSQL]] § *Inventario*
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] ·
  calendario: [[_cronograma]]
