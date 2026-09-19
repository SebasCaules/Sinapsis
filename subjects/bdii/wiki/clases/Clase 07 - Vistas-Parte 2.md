---
tipo: teorica
clase: 7
deck: "BD2_Clase 07 - Vistas-Parte 2.pdf"
unidad: 1
tema: "Vistas: actualizabilidad, CHECK OPTION, vistas materializadas"
resumen: "Cuándo se puede escribir a través de una vista: las cuatro condiciones del estándar SQL:1999, la preservación de la clave en vistas con join, los casos no actualizables en MySQL, los triggers INSTEAD OF y las vistas materializadas. La regla corta: vista σ-π-⋈ y una sola tabla base tocada."
fecha: 2026-08-10
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 07
  - Clase 07 — Vistas (Parte 2)
  - Vistas Parte 2
  - Vistas materializadas
  - INSTEAD OF
  - Preservación de la clave
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 07 - Vistas-Parte 2.pdf"
estado: procesado
---

# Clase 07 — Vistas (Parte 2)

## Resumen general

Escribir a través de una vista es la pregunta que recorre todo el deck: cuándo un `INSERT`, `UPDATE`
o `DELETE` sobre una relación derivada se traduce sin ambigüedad a las tablas base. Tres capas que no
coinciden: el estándar SQL:1999 (slides 3–4), lo que hace MySQL —el motor de la cursada— (slide 13 y
capturas del manual en los slides 14–16), y lo que se fuerza con triggers `INSTEAD OF` (slides 11–12).
Cierra con vistas materializadas (slides 17 y 20–21) y ventajas/desventajas (18–19). Se practica con
el TP4 Vistas y es material de parcial: qué tabla preserva la clave o qué operación falla sobre un
join es el detalle que se pregunta.

Las cuatro condiciones del estándar: la escritura afecta una sola tabla base (si la vista deriva de
varias, la que preserva la clave); sin columnas derivadas, funciones de grupo, `DISTINCT`,
subconsultas en el `SELECT` ni operaciones de conjunto; sin errores por columnas ocultas `NOT NULL`
sin `DEFAULT` o con RI asociadas; y la fila cumple la condición si hay `WITH CHECK OPTION`. La tabla
que preserva la clave se decide por el esquema, no por los datos: en tipo-subtipo es el subtipo. La
actualizabilidad se hereda en cadena (`Vi` actualizable solo si `Vi-1` lo es). El deck se contradice
sobre los joins en MySQL: el slide 13 los lista como no actualizables, pero el slide 10 inserta y
actualiza a través de una vista con `join`. `INSTEAD OF` no resuelve la ambigüedad, la delega al
programador, y MySQL no lo admite. MySQL tampoco tiene vistas materializadas, y el ejemplo de
PostgreSQL del slide 21 con `WITH LOCAL CHECK OPTION` no es sintaxis válida.

Para el parcial: vista σ-π-⋈ y una sola tabla tocada; la tabla de decisión del final recorre los
chequeos en orden, y `WITH CHECK OPTION` se estudia en la Parte 1, porque este deck solo lo nombra.

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 07 - Vistas-Parte 2.pdf` · **22 slides** · teórica del lunes
> **10/08** (mismo día que las Clases 06 y 08). Parte **2 de 2**: la parte 1 es
> [[Clase 06 - Vistas-Parte 1]]; sigue [[Clase 08 - Explicando el plan]]. Se practica con el
> **TP4 Vistas** → [[Práctica 2026-08-11]]. Archivo → clase: [[_index-clases]].

---

## Slides 1–2 · Repaso de la Parte 1

El slide 2 (rotulado `Repaso…`) repite el arranque de [[Clase 06 - Vistas-Parte 1]]: esquema externo,
relación derivada, tabla virtual (habitualmente no materializada). Lo que hace falta tener a mano es
la sintaxis, porque el resto del deck se apoya en su última línea:

```sql
CREATE VIEW nom_vista [(n_col_1, …, n_col_n)]
AS expresión_consulta
[WITH [opción] CHECK OPTION];
```

- `nom_vista`: nombre de la vista
- `n_col_1,..., n_col_n`: nombres de columnas de la vista
- `expresión_consulta`: consulta SQL que define la relación derivada
- **`opción`: cascade/local**

> [!note] `cascade/local` se nombra y no se define en este deck
> Aparece en los slides 2 y 21 (`WITH LOCAL CHECK OPTION` en un ejemplo), y el slide 3 menciona
> `with check option` como cuarta condición, sin explicar la diferencia. La definición está en la
> Parte 1, deck 06 slides 15–17 → [[#WITH CHECK OPTION · qué dice este deck]].

---

## Slide 3 · Actualizaciones en Vistas

También rotulado `Repaso…`, pero es **el núcleo del deck**: todo lo que sigue son casos particulares
suyos.

> [!quote] La premisa de la que sale todo
> *"Las vistas no mantienen COPIAS de los datos → cuando se modifica una vista, se están
> modificando las tablas base"*
>
> - **Tabla Base → Vista**: *"Al actualizar las tuplas de una tabla → los cambios se reflejan
> automáticamente sobre las vistas (si no se violan restricciones!)"*
> - **Vista → Tabla Base**: *"Para que resulten automáticamente actualizables deben cumplir ciertas
> condiciones"*

Las dos direcciones no son simétricas: hacia la vista no hay problema (se recalcula al consultarla);
hacia la tabla base hay que traducir una escritura sobre una relación derivada a escrituras sobre las
tablas base, y esa traducción puede ser **ambigua**. La pregunta del slide, textual (sin signo de
apertura, tal cual el deck): ***"Cuándo es posible sin ambigüedades?"***

### Las cuatro condiciones, textuales

> [!quote] Slide 3 — transcripción literal
> - *"Si no afecta más de una tabla o, si deriva de más de una tabla, la actualización afecta sólo a
> una (la que preserva la clave)"*
> - *"Si no contiene columnas con información derivada o funciones de grupo o clásula distinct,
> subconsultas en el select u operaciones de conjunto"*
> - *"Si no causa error afectando atributos que no tienen valores por defecto definidos o que no
> aceptan nulos o que activan RI asociadas"*
> - *"Si verifica la condición, si se especificó with check option"*

*(`clásula` es el tipeo del slide, por *cláusula distinct*.)*

### Qué significa cada una

| # | Condición | Por qué existe | Dónde se desarrolla |
| --- | --- | --- | --- |
| **1** | **Una sola tabla afectada** — o, si la vista deriva de varias, sólo **la que preserva la clave** | Con dos tablas, un `INSERT` de una fila de la vista podría significar "insertar en A", "en B" o "en las dos": **ambiguo**. La regla elige una sola tabla | slides 4–8 |
| **2** | **Sin información derivada, funciones de grupo, `DISTINCT`, subconsultas en el `SELECT` ni operaciones de conjunto** | Todas destruyen la correspondencia **1 fila de la vista ↔ 1 fila de la tabla base** (con `SUM(x)` no hay fila base a la que escribir; con `DISTINCT`, una fila de la vista puede venir de N) | slide 13 (versión MySQL) |
| **3** | **Que no cause error** en atributos sin `DEFAULT`, que no aceptan nulos, o que **activan RI asociadas** | Si una columna que la vista oculta es `NOT NULL` sin `DEFAULT`, el `INSERT` no tiene con qué llenarla. `RI` = **restricciones de integridad**: disparar una FK con `ON DELETE` no es imposible sino **riesgoso**, porque el efecto excede lo que se ve en la vista → [[Restricciones de integridad]] | — |
| **4** | **Que verifique la condición**, si se especificó `WITH CHECK OPTION` | Evita que una fila escrita por la vista **desaparezca de la vista** (*migración de tuplas*) | en este deck, sólo slides 2 y 21 · la explicación está en [[Clase 06 - Vistas-Parte 1]] (deck 06, slides 15–17) |

---

## Slide 4 · Vistas actualizables a partir de 2 o más tablas/vistas

> [!quote] La regla del estándar
> *"Según el estándar SQL:1999, la actualización sobre una vista definida a partir de más de una
> tabla/vista → **sólo puede modificar una de las tablas base**: la que cumpla la propiedad de
> **preservación de la clave** (la que tiene la misma clave de la vista, y entonces aparece a lo
> sumo una vez en la vista)"*

Como cada fila de la tabla que preserva la clave aparece a lo sumo una vez en el resultado, escribir
una fila de la vista identifica **una sola** fila de esa tabla. Los otros tres ítems del slide:

- **No debe definirse en base a Unión, Intersección o Diferencia**, con la aclaración *"(Manifiestos
  para SQL:1999 y versiones posteriores → incluir otras operaciones, por ej. Intersección)"*; el deck
  no explica qué son esos "manifiestos".
- **Se llaman vistas σ-π-⋈**: *"se obtienen mediante condiciones de ensamble sobre los pares
  FK → PK especificados en las RIRs"*. Selección, proyección y ensamble: nada más.
- **La actualización no se realizará si se viola alguna restricción definida sobre la relación base
  a actualizar.**

> [!quote] La nota al pie — vistas sobre vistas
> *"(\*) Puede ser otra vista, que en este caso debe ser actualizable.
> Si T→ V1→ V2→ … →Vn: **Vi será actualizable si Vi-1 lo es** y así sucesivamente"*
>
> La actualizabilidad es **hereditaria y frágil**: una vista no actualizable en la cadena vuelve no
> actualizables a todas las que están aguas abajo.

---

## Slide 5 · Comentarios sobre RIRs

**RIR** = restricción de integridad referencial. El slide parte la relación en **atributos clave**
`K (K₁ … Kₘ)` y **secundarios** `Z (Z₁ … Z_p)` y clasifica las vistas-ensamble según **dónde cae la
FK**:

| Caso | Ubicación de la FK | De dónde proviene | Ejemplo del deck |
| --- | --- | --- | --- |
| **(1)** | **FK ≡ K** (la FK *es* la clave) | *"procede de la representación de relaciones de tipo-subtipo"* | `ING_TANDIL` (slide 8) |
| **(2)** | **FK ≡ Z₁,.., Z_r** (atributos secundarios), con **FK ∩ K = ∅** | *"proviene de la abstracción de relaciones 1:1, N:1 o n-arias con al menos una cardinalidad 1"* | `EMPL_SISTEMAS` (slide 6) |
| **(3)** | **FK ≡ K₁,.., K_q**, con **FK ⊂ K** (subconjunto propio de la clave) | *"resulta de las relaciones N:N, n-arias en general y las correspondientes a los vínculos entidad fuerte-entidad débil (rel. identificatorias)"* | `EMPL_PROY` (slide 7) |

Cada patrón de FK es la huella de un tipo de relación del
[[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

---

## Slides 6–8 · Un ejemplo por caso

Cada slide trae un `CREATE VIEW`, el diagrama de las tablas y la línea *"La clave de … es …"* con la
aclaración *"(análisis de dependencias funcionales)"*.

> [!note] Cuál es la tabla que preserva la clave: el deck lo dice a medias
> Los slides **nunca escriben** "la tabla que preserva la clave es X". Los slides 6 y 8 cierran con
> una **`Nota:`** que dice cuál **no** es; el slide 7 no trae ninguna. La tabla preservada anotada en
> cada caso es deducción propia; **verificar en clase**. Regla práctica (razonamiento propio): **es la
> del lado "muchos" / la más específica**, la tabla cuya clave coincide con la de la vista y cuyo
> dominio no es más extenso que el de la vista.

### Slide 6 · Caso (2) — ensamble desde una relación N:1

> *"Caso (2): más intuitivo→ Ensamble mediante RIR, FK= atrib. secundarios"*
>
> *"Vista ensamble proveniente de relación N:1"*

```
EMPLEADO(id_empleado, nombre, apellido, fecha_nac, ciudad, id_dpto FK)
DEPARTAMENTO(id_dpto, nombre, nro_oficina)
```

```sql
CREATE VIEW EMPL_SISTEMAS AS
SELECT E.id_empleado, E.apellido, E.id_dpto, D.nombre
FROM DEPARTAMENTO D, EMPLEADO E
WHERE D.id_dpto = E.id_dpto
  AND D.nombre= 'Sistemas';
```

- **La clave de `EMPL_SISTEMAS` es `E.id_empleado`** *(análisis de dependencias funcionales)*.
- Tabla que preserva la clave: **`EMPLEADO`** *(deducido: la `Nota:` sólo dice que **no** es
  `DEPARTAMENTO`)*.

> [!quote] La nota del slide — la parte que se toma en el parcial
> *"Aunque en la vista hubiera sólo un empleado en cada departamento – y entonces id_dpto sería
> único– igualmente la tabla Departamento **NO** sería de la cual se preserva la clave!
> (**no depende de los datos sino de la estructura del esquema**)"*

Un `id_dpto` único *por casualidad* no convierte a `DEPARTAMENTO` en la tabla preservada: la
propiedad se decide mirando el esquema.

### Slide 7 · Caso (3) — ensamble desde una relación N:N

> *"Caso (3): Ensamble mediante RIR, FK ⊂ K (subconjunto de los atrib. clave)"*
>
> *"Vista ensamble proveniente de relación N:N"*

```
EMPLEADO(id_empleado, nombre, apellido, fecha_nac, ciudad)
TRABAJA(id_empleado FK, id_proyecto FK, cantidad_horas, tarea)
PROYECTO(id_proyecto, titulo, subsidio)
```

```sql
CREATE VIEW EMPL_PROY AS
 SELECT T.id_empleado, T.id_proyecto, T.tarea, E.apellido
 FROM TRABAJA T,  EMPLEADO E
 WHERE T.id_empleado = E.id_empleado
  AND E.cantidad_horas <3000;
```

- **La clave de `EMPL_PROY` es `T.id_empleado, T.id_proyecto`** *(análisis de dependencias
  funcionales)*: clave **compuesta**, la de la tabla de ensamble.
- Tabla que preserva la clave: **`TRABAJA`** (deducción propia: el slide **no trae `Nota:`**; la
  clave de la vista es exactamente la de `TRABAJA`).

> [!bug] `E.cantidad_horas` no existe
> Según el diagrama del propio slide, `cantidad_horas` es columna de **`TRABAJA`**, no de `EMPLEADO`:
> la consulta falla con *unknown column*. Debería decir **`T.cantidad_horas`**. Se transcribe tal
> cual; **verificar en clase** si es un tipeo o un esquema distinto.

### Slide 8 · Caso (1) — ensamble desde una relación tipo-subtipo

> *"Caso (1): Ensamble mediante RIR, FK ≡ K (coincide con la clave)"*
>
> *"Vista ensamble correspondiente a relación tipo-subtipo"*

```
EMPLEADO(id_empleado, nombre, apellido, fecha_nac, ciudad)
INGENIERO(id_empleado FK, fecha_graduacion, titulo, universidad)
```

El diagrama usa el símbolo de **jerarquía** (triángulo/arco) entre `INGENIERO` y `EMPLEADO`.

```sql
CREATE VIEW ING_TANDIL AS
SELECT I.id_empleado, I.titulo, E.apellido, E.nombre
FROM INGENIERO I, EMPLEADO E
WHERE I.id_empleado = E.id_empleado
  AND E.ciudad = 'Tandil';
```

- **La clave de `ING_TANDIL` es `I.id_empleado` (tabla subtipo)** — *"(tabla subtipo)"* es del slide.
- Tabla que preserva la clave: **`INGENIERO`**, el **subtipo** *(deducido: la `Nota:` sólo dice que
  **no** es `EMPLEADO`)*.

> [!quote] La nota del slide
> *"En la vista Empleado e Ingeniero se corresponden con sólo una persona, o sea que id_empleado es
> único en la vista (resultado del ensamble), pero Empleado no sería la tabla de la cual se preserva
> la clave (**porque es esperable que su dominio de definición sea más extenso**)"*

Los dos lados tienen la misma clave y aparecen una sola vez, pero `EMPLEADO` tiene **más filas** que
`INGENIERO` (hay empleados que no son ingenieros): el subtipo es el que encaja con la vista.

> [!warning] Comillas tipográficas en los literales
> Los slides 6 y 8 escriben `'Sistemas'` y `'Tandil'` con **comillas curvas** (artefacto de
> PowerPoint); copiadas a un cliente SQL **fallan**. Reemplazarlas por comillas rectas `'...'`.

---

## Slides 9–10 · Ejemplo corrido en MySQL

Dos capturas de un script real. **Es el ejemplo que más se parece al TP4.**

### Slide 9 — el esquema y los datos

```sql
create table alumnos(
 documento char(8),
 nombre varchar(30),
 nota decimal(4,2),
 codigoprofesor int,
 primary key(documento)
);

create table profesores (
  codigo int auto_increment,
  nombre varchar(30),
  primary key(codigo)
);

insert into alumnos values('30111111','Ana Algarbe', 5.1, 1);
insert into alumnos values('30222222','Bernardo Bustamante', 3.2, 1);
insert into alumnos values('30333333','Carolina Conte',4.5, 1);
insert into alumnos values('30444444','Diana Dominguez',9.7, 1);
insert into alumnos values('30555555','Fabian Fuentes',8.5, 2);
insert into alumnos values('30666666','Gaston Gonzalez',9.70, 2);

insert into profesores(nombre) values ('Maria Luque');
insert into profesores(nombre) values ('Jorje Dante');
```

*(`Jorje Dante` es tal cual el slide.)* `codigoprofesor` en `alumnos` **no está declarado como FK**:
la integridad referencial es sólo semántica.

### Slide 10 — la vista y las escrituras a través de ella

```sql
create view vista_nota_alumnos_aprobados as
  select documento,
  a.nombre as nombrealumno,
  p.nombre as nombreprofesor,
  nota,
  codigoprofesor
  from alumnos as a
  join profesores as p on a.codigoprofesor=p.codigo
  where nota>=7;

select * from vista_nota_alumnos_aprobados;

-- Mediante la vista insertamos un nuevo alumno calificado por el profesor
-- con código 1
insert into vista_nota_alumnos_aprobados(documento, nombrealumno, nota, codigoprofesor)
  values('99999999','Rodriguez Pablo', 10, 1);

select * from vista_nota_alumnos_aprobados;

-- si consultamos la tabla base: alumnos tenemos una nueva fila con el alumno
-- insertado
select * from alumnos;

-- modificamos la nota de un alumno aprobado mediante la vista
update vista_nota_alumnos_aprobados set nota=10
  where documento='30444444';

select * from alumnos;
```

Razonamiento propio (el deck no muestra las salidas):

- El primer `select` devuelve **3 filas**, las de `nota>=7`: `30444444 Diana Dominguez / Maria Luque /
  9.70`, `30555555 Fabian Fuentes / Jorje Dante / 8.50`, `30666666 Gaston Gonzalez / Jorje Dante / 9.70`.
- El `insert` **no menciona `nombreprofesor`**: por eso afecta **sólo a `alumnos`**, la tabla que
  preserva la clave (`documento` es la clave de la vista). Es la **condición 1** del slide 3 en acción;
  con `nombreprofesor` tocaría dos tablas y fallaría.
- El `update` cambia `9.7 → 10` y la fila sigue cumpliendo `nota>=7`. Con `set nota=5` se escribiría
  igual en `alumnos` y **desaparecería de la vista**: eso es lo que bloquea `WITH CHECK OPTION`, y el
  deck no lo dice.

> [!bug] El ejemplo contradice al slide 13
> `vista_nota_alumnos_aprobados` **es una vista con `join`**, y el slide 13 lista **`ENSAMBLES
> (joins)`** entre lo que hace que una vista *no* sea actualizable en MySQL. Aquí el deck inserta y
> actualiza a través de ella sin comentario, y el slide 15 da `UPDATE vjoin SET c=c+1;` por
> **válido**; en cambio el slide 14 da `INSERT INTO vjoin (c) VALUES (1);` por **inválido**, así que
> el único `insert` a través de una vista con `join` que el deck da por bueno es el del slide 10.
> **Lo más probable** (razonamiento propio): el ítem del slide 13 está mal enunciado y lo correcto es
> *una vista con join es actualizable, pero cada sentencia sólo puede tocar una tabla base*.
> **Confirmar en clase antes del parcial.**

---

## Slides 11–12 · Actualización vía triggers `INSTEAD OF`

> [!quote] Slide 11
> *"Recurso que permite la actualización de vistas que no son automáticamente actualizables"*
>
> - *"Definir triggers **INSTEAD OF** (opción especial para vistas) para las distintas operaciones
> requeridas (eventos críticos)"*
> - *"Se pueden **"interceptar"** las operaciones de actualización: el trigger se dispara
> automáticamente **en lugar de** la sentencia disparadora, en forma "invisible" para el usuario"*
> - *"Por defecto, los triggers INSTEAD OF son **for each row**"*
>
> Y la advertencia subrayada: *"**Importante**: Queda en manos del usuario la responsabilidad de
> implementar las actualizaciones necesarias y de la manera que las considere "adecuadas""*

`INSTEAD OF` no resuelve la ambigüedad: **la delega**. El programador escribe la semántica; si la
escribe mal, la base queda inconsistente y nadie avisa.

### Slide 12 — el ejemplo `info_tutores`

Esquema base, según el recuadro del slide *(subrayado = clave)*:

```
Alumno (nro_al, nombre, id_tutor)  ← nro_al e id_tutor subrayados
Profesor (id_prof, nombre)  ← id_prof subrayado
```

```sql
CREATE VIEW info_tutores (nro_al, nom_al, id_tutor, nom_tut)
 AS SELECT A.nro_al, A.nombre, A.id_tutor, P.nombre
  FROM  Alumno A JOIN Profesor P
  ON  A.Id_tutor = P.id_prof;
```

La **lista de nombres de columnas** del `CREATE VIEW` resuelve la colisión entre `A.nombre` y
`P.nombre` (`nom_al`, `nom_tut`).

> [!quote] Cómo presenta el slide la solución
> *"Una posible semántica para el insert sobre info_tutores podría ser: (**no significa que sea la
> única, dependerá de los requerimientos**)"*

```sql
CREATE TRIGGER insert_info_tutores
INSTEAD OF INSERT ON info_tutores
FOR EACH ROW
BEGIN
  IF NOT EXISTS (SELECT * FROM Alumno A WHERE A.nro_al= :new.nro_al)
  THEN INSERT INTO Alumno VALUES(:new.nro_al, :new.nom_al, :new.id_tutor);
  ELSE UPDATE Alumno SET  id_tutor= :new.id_tutor  WHERE nro_al= :new.nro_al;
  END IF;
  IF NOT EXISTS (SELECT * FROM Profesor P WHERE P.id_prof= :new.id_tutor)
  THEN  INSERT INTO Profesor VALUES (:new.id_tutor, :new.nom_tut);
  ELSE UPDATE Profesor SET nombre= :new.nom_tut WHERE id_prof= :new.id_tutor;
  END IF;
END;
```

El slide rotula el bloque como **"sintaxis SQL estándar"** y agrega: *"Deberían plantearse triggers
similares para las operaciones de UPDATE y DELETE (en PostgreSQL la función podría implementar el
comportamiento para todos los eventos)"*. La semántica elegida es **upsert en las dos tablas**: un
`INSERT` sobre la vista puede terminar en dos `INSERT`, dos `UPDATE` o una mezcla. Es una decisión de
diseño, no una regla.

> [!bug] `:new` no es sintaxis SQL estándar
> Razonamiento propio: `:new.columna` es notación de **Oracle PL/SQL**. El estándar usa
> `REFERENCING NEW ROW AS n` + `n.columna`, y PostgreSQL usa `NEW.columna` dentro de una **función**
> `RETURNS TRIGGER`, no un bloque `BEGIN…END` inline. El rótulo del slide no se corresponde con el
> código. Verificar en clase.

> [!warning] MySQL no tiene `INSTEAD OF`, y la cursada corre sobre MySQL
> Razonamiento propio: MySQL sólo admite triggers `BEFORE` / `AFTER` y **sólo sobre tablas**. El
> equivalente funcional es un **stored procedure** que encapsule las escrituras, o escribir contra las
> tablas base. **Confirmar con la cátedra** cómo se pide resolverlo en el TP4. Es el mismo problema
> PostgreSQL-vs-MySQL que arrastra el deck `BD2_Clase 04`.

---

## Slide 13 · Vistas actualizables en MySQL

La lista concreta del motor de la cursada, textual:

> [!quote] *"Una vista en MySQL **no es actualizable** si:"*
> - *Contiene funciones de agregación*
> - *DISTINCT*
> - *GROUP BY*
> - *HAVING*
> - *Usa UNION o UNION ALL*
> - *Usa subconsultas en el select*
> - *Subconsultas independendientes en el select (solo falla el INSERT)*
> - *ENSAMBLES (joins)*
> - *Referencia una vista no actualizable en el FROM*
> - *Subconsulta en el WHERE que referencia a una tabla en el FROM*
> - *Referencia solo a valores literales only to literal values (sin tabla subyacente para actualizar)*
> - *ALGORITHM = TEMPTABLE (use of a temporary table always makes a view nonupdatable)*
> - *Multiple referencias a cualquier columna de una tabla base (falla en INSERT, ok para UPDATE y DELETE)*

*(Tipeos del slide: `independendientes`, y dos ítems a medio traducir del manual de MySQL.)*

Frente al estándar (slide 3): agregación, `GROUP BY`, `HAVING`, `DISTINCT`, `UNION` y subconsultas
en el `SELECT` son la **condición 2**; la vista no actualizable en el `FROM` es la nota al pie del
slide 4; la subconsulta en el `WHERE`, los literales sin tabla, `ALGORITHM = TEMPTABLE` y las
múltiples referencias a una columna (que **sólo rompe el `INSERT`**) son específicos de MySQL; y
**`ENSAMBLES (joins)` contradice la condición 1**, que sí admite joins si se preserva la clave (ver el
bug del slide 10). El cruce ítem por ítem está en la
[[#¿Esta vista es actualizable? — tabla de decisión]].

> [!note] `ALGORITHM = MERGE` vs. `TEMPTABLE` (razonamiento propio)
> MySQL resuelve una vista **fusionando** su definición con la consulta del usuario (`MERGE`) o
> **materializándola** en una tabla temporal (`TEMPTABLE`). Sólo las resueltas por `MERGE` son
> actualizables; de ahí el *"merged (updatable) view"* de los slides 14–16. El deck nombra `TEMPTABLE`
> sin explicar el par. **Verificar en clase.**

---

## Slides 14–16 · Los ejemplos del manual de MySQL

Tres capturas de la documentación oficial de MySQL, en inglés, sobre el mismo esquema (slide 14):

```sql
CREATE TABLE t1 (x INTEGER);
CREATE TABLE t2 (c INTEGER);
CREATE VIEW vmat AS SELECT SUM(x) AS s FROM t1;
CREATE VIEW vup AS SELECT * FROM t2;
CREATE VIEW vjoin AS SELECT * FROM vmat JOIN vup ON vmat.s=vup.c;
```

Estado de cada vista (razonamiento propio; el slide no las rotula): **`vmat`** no actualizable
(agregado ⇒ se materializa); **`vup`** actualizable (*merged view*); **`vjoin`** parcialmente
actualizable.

### Slide 14 · `insert`

| Sentencia | ¿Válida? | Razón textual del manual |
| --- | --- | --- |
| `INSERT INTO vjoin (c) VALUES (1);` | ✗ | *"This statement is invalid because one component of the join view is nonupdatable"* |
| `INSERT INTO vup (c) VALUES (1);` | ✓ | *"This statement is valid; the view contains no materialized components"* |

### Slide 15 · `update`

| Sentencia | ¿Válida? | Razón textual del manual |
| --- | --- | --- |
| `UPDATE vjoin SET c=c+1;` | ✓ | *"This statement is valid; column `c` is from the updatable part of the join view"* |
| `UPDATE vjoin SET x=x+1;` | ✗ | *"This statement is invalid; column `x` is from the nonupdatable part"* |
| `UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ... SET c=c+1;` | ✓ | *"This statement is valid; the updated table reference of the multiple-table UPDATE is an updatable view (`vup`)"* |
| `UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ... SET s=s+1;` | ✗ | *"This statement is invalid; it tries to update a materialized derived table"* |

### Slide 16 · `delete`

| Sentencia | ¿Válida? | Razón textual del manual |
| --- | --- | --- |
| `DELETE vjoin WHERE ...;` | ✗ | *"This statement is invalid because the view is a join view"* |
| `DELETE vup WHERE ...;` | ✓ | *"This statement is valid because the view is a merged (updatable) view"* |
| `DELETE vup FROM vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...;` | ✓ | *"This statement is valid because it deletes from a merged (updatable) view"* |

> [!important] La asimetría que hay que memorizar
> Razonamiento propio a partir de los slides 14–16: sobre `vjoin` —join **con un componente no
> actualizable**— el `INSERT` es **inválido** (slide 14) y el `DELETE` **inválido** (slide 16), pero
> el `UPDATE` es **válido si la columna tocada viene de la parte actualizable** (slide 15). El
> `DELETE` falla *"because the view is a join view"*, sin condicionarlo al componente materializado;
> el `UPDATE` se decide **columna por columna**. Esto **matiza** el ítem `ENSAMBLES (joins)` del
> slide 13: la operación importa. **Confirmar en clase.**

---

## Slide 17 · Vistas materializadas

> [!quote] El disparador
> *"Algunas aplicaciones pueden requerir alto grado de respuesta por parte de la BD (**no siendo
> suficiente la optimización de la/s consulta/s**)"*

Cuando afinar la consulta no alcanza, se **precalcula**. *"Una vista puede ser **materializada**"*:

- *"el SGBD **pre-calcula y almacena** su contenido (físicamente, como sucede con una tabla)"*
- *"Puede ser usada como si fuera una relación común (incluso **crear índices** para mejorar la
  performance de consultas)"*
- *"Se genera **duplicación de datos** y necesidad de **mantener la consistencia** respecto del
  contenido de las tablas base"*

**Cuestiones a evaluar**, textual del slide:

| Pregunta | Opciones que plantea el slide |
| --- | --- |
| *"¿Qué vistas deberían materializarse?"* | *"(decisión compleja)"* — el slide no da criterio |
| *"¿Cómo debe ser la sincronización entre vistas materializadas y tablas base?"* | *"¿Aplicar actualización por **regeneración** de la vista? ¿o **incremental**?"* |
| ídem, eje temporal | *"¿En forma **inmediata** (al darse algún cambio)? ¿**periódicamente**? ¿**forzado**?"* |

Razonamiento propio: las dos dimensiones son ortogonales —**qué se recalcula** (todo o sólo el delta)
y **cuándo** (en cada escritura, cada tanto o a pedido)— y el trade-off es siempre **lecturas rápidas
a cambio de escrituras caras y datos potencialmente rancios**, la misma lógica de la desnormalización
y de las vistas de MapReduce de la segunda mitad de la cursada.

---

## Slide 18 · Ventajas de las vistas

> [!quote] Transcripción
> - *"**Simplifican la percepción** que los usuarios tienen de la BD, presentando la información
> necesaria y ocultando el resto"*
> - *"**Presentan diferentes datos** a distinto tipo de usuarios, aún cuando los estén compartiendo
> (sobre la misma BD)"*
> - *"Permiten definir **consultas complejas/frecuentes** para no tener que especificarlas cada vez
> que se utilizan"*
> - *"Facilitan la **independencia de los datos** (ocultando a los usuarios cambios en la estructura
> en las tablas base)"*
> - *"Permiten aplicar **políticas de seguridad** (privacidad): dando privilegios selectivamente
> sobre distintas vistas (control de acceso)"*
> - *"Vistas sobre algunas **columnas**, ocultando otras reservadas para usuarios específicos
> (ej. antecedentes penales)"*
> - *"Vistas sobre determinadas **filas**, ocultando otras reservadas para usuarios específicos
> (ej. películas no aptas para público infantil)"*

La seguridad por vistas tiene dos granularidades (razonamiento propio; el slide da los ejemplos sin
nombrar las operaciones): **por columnas** = proyección π, **por filas** = selección σ. El slide habla
de privilegios selectivos pero **no nombra `GRANT`**: es el anticipo de
[[Seguridad en bases de datos]].

---

## Slide 19 · Desventajas de las vistas

> [!quote] Transcripción
> - *"**Actualizaciones VISTA → Tabla BASE restringidas**: hay varias limitaciones sobre la
> estructura de las vistas para asegurar que resulten automáticamente actualizables (debido a
> posibles anomalías)"*
> - *"**Cuestiones de Rendimiento**: el proceso de resolución de la vista puede exigir el acceso a
> múltiples tablas cada vez que se accede a ella → evaluar si podría justificarse su materialización
> (técnicas de mantenimiento de vistas)"*
> - *"**Necesidad de sincronización** en caso de vistas materializadas (y duplicación de datos)"*
> - *"**Modificaciones a la estructura de tablas base** (ej. agregado de columnas) no serán advertidos
> por la vista, salvo que sea **re-creada**"*

> [!important] La última desventaja es la cara oculta de la cuarta ventaja
> Razonamiento propio: la **independencia de los datos** del slide 18 tiene un costo: una columna nueva
> en la tabla base **no aparece** en una vista `SELECT *` ya creada, porque la vista congela el esquema
> al momento del `CREATE VIEW`. El deck dice *"salvo que sea re-creada"* pero **no da la sentencia**:
> `DROP VIEW` está en [[Clase 06 - Vistas-Parte 1]] (deck 06, slide 7); `CREATE OR REPLACE VIEW` no
> aparece en ninguno de los dos decks. **Verificar en clase.**

---

## Slides 20–21 · Vistas materializadas en cada motor

### Slide 20 — la comparativa

| SGBD | Cómo funcionan las vistas materializadas *(textual del slide)* |
| --- | --- |
| **PostgreSQL** | *"Con PostgreSQL, se debe **actualizar manualmente** la vista materializada y volver a calcular la **vista completa**. La vista materializada se completa con datos en el momento exacto en que se crea."* |
| **MySQL** | *"MySQL **no admite** las vistas materializadas."* |
| **Oracle** | *"Oracle **actualiza automáticamente** las vistas materializadas, pero también ofrece la opción de actualizarlas a pedido. También puede escribir una instrucción SQL que solicite que las vistas se actualicen antes de generar resultados."* |
| **SQL Server** | *"SQL Server usa el nombre **"vistas indexadas"**, ya que la materialización es un paso para crear un índice de una vista normal. Solo puede realizar consultas SQL básicas con las vistas indexadas. Se actualizan **automáticamente** para el usuario."* |

Cruzado con las preguntas del slide 17 (razonamiento propio): PostgreSQL = **regeneración completa**
y **forzada** (manual); Oracle = automática **o** a pedido; SQL Server = automática y transparente;
MySQL **no las tiene**.

> [!warning] MySQL no tiene vistas materializadas, y la cursada corre sobre MySQL
> Lo dice el propio slide: **toda la sección es teórica** para el TP4 y para la práctica. El
> reemplazo habitual en MySQL (razonamiento propio) es una **tabla real** rellenada con
> `INSERT … SELECT` y refrescada con un `EVENT` programado o con triggers. **Verificar con la
> cátedra** si el parcial puede pedir eso.

### Slide 21 — la sintaxis de PostgreSQL

```sql
CREATE MATERIALIZED VIEW view_name
AS query
WITH [NO] DATA;
```

Viñetas del slide, en inglés:

- *"`view_name` is the name of your materialized view in Postgres"*
- *"`query` is that complex query that supplies the data for our materialized view"*
- *"`WITH DATA` / `WITH NO DATA` is the parameter that specifies if the query has to load the data
  (the query results) **at once during the object creation**. If we need it while creating a Postgres
  materialized view, we specify the `WITH DATA` parameter. If not – use the `WITH NO DATA` one."*

Y el ejemplo, tal cual el slide:

```sql
CREATE MATERIALIZED VIEW alumnos_2017
AS select * from alumno where añoDeIngreso=2017
WITH LOCAL CHECK OPTION
WITH DATA;
```

> [!bug] El ejemplo del slide 21 no es válido en PostgreSQL
> Razonamiento propio: `WITH [LOCAL|CASCADED] CHECK OPTION` es una cláusula de **`CREATE VIEW`**, no
> de `CREATE MATERIALIZED VIEW`; una vista materializada **no es actualizable**, así que no hay
> escrituras que chequear. La forma correcta sería:
>
> ```sql
> CREATE MATERIALIZED VIEW alumnos_2017
> AS SELECT * FROM alumno WHERE añoDeIngreso = 2017
> WITH DATA;
> ```
>
> Además **`añoDeIngreso`** lleva `ñ` y mayúsculas: PostgreSQL pliega los identificadores sin comillas
> a **minúsculas**, así que la columna tendría que llamarse `añodeingreso` o ir entrecomillada.
> **Verificar en clase**: es el candidato número uno a pregunta capciosa.

> [!warning] Deck en PostgreSQL, cursada en MySQL
> Segundo caso registrado de un deck escrito sobre PostgreSQL (el primero es `BD2_Clase 04`, ver
> [[_cronograma]] § diferencias con el programa), y aquí el desajuste es máximo: **MySQL no tiene
> `CREATE MATERIALIZED VIEW` en absoluto**, como dice el propio slide 20. En PostgreSQL el refresco
> manual se hace con `REFRESH MATERIALIZED VIEW nombre;`, sentencia que el deck **no menciona**.

---

## WITH CHECK OPTION · qué dice este deck

| Slide | Qué dice, textual |
| --- | --- |
| 2 | `[WITH [opción] CHECK OPTION];` · *"opción: **cascade/local**"* |
| 3 | 4ª condición: *"Si verifica la condición, si se especificó with check option"* |
| 21 | `WITH LOCAL CHECK OPTION` dentro de un `CREATE MATERIALIZED VIEW` (que además es incorrecto) |

**Este deck la nombra y no la explica.** La explicación está en la Parte 1, deck 06: slide 15
(definición y tabla `CASCADED`/`LOCAL`), 16 y 17 (ejercicios) → [[Clase 06 - Vistas-Parte 1]]
§ *Vistas con Opción de Chequeo (WCO)*. Lo mínimo para leer este deck:

| Opción | Qué se chequea, según el deck 06 slide 15 | Default |
| --- | --- | --- |
| **`CASCADED`** | *"las tuplas son chequeadas contra las condiciones de la vista **y aquellas de las vistas subyacentes**"* | **sí** |
| **`LOCAL`** | *"sólo se chequean contra las condiciones definidas en **la misma vista**"* | no |

El deck 06 aclara además que WCO *"sólo está soportado en vistas automáticamente actualizables"*: por
eso el `WITH LOCAL CHECK OPTION` del slide 21, sobre una vista **materializada**, no tiene sentido.

---

## ¿Esta vista es actualizable? — tabla de decisión

Razonamiento propio: cruce de los slides 3–4 (estándar) con el 13 (MySQL) y las capturas 14–16.
Checklist para el TP4 y para el parcial; se recorre de arriba hacia abajo y **el primer ✗ corta**.

| # | Pregunta | Si la respuesta es… | Estándar SQL:1999 (slides 3–4) | MySQL (slide 13) |
| --- | --- | --- | --- | --- |
| 1 | ¿Tiene **funciones de agregación** (`SUM`, `COUNT`, …)? | sí | ✗ no actualizable | ✗ |
| 2 | ¿Tiene **`GROUP BY`** o **`HAVING`**? | sí | ✗ *(funciones de grupo)* | ✗ |
| 3 | ¿Tiene **`DISTINCT`**? | sí | ✗ | ✗ |
| 4 | ¿Tiene **columnas derivadas / calculadas**? | sí | ✗ | *(el slide 13 no lo lista)* |
| 5 | ¿Tiene **subconsultas en el `SELECT`**? | sí | ✗ | ✗ *(las independientes: sólo falla el `INSERT`)* |
| 6 | ¿Usa **`UNION` / `INTERSECT` / `EXCEPT`**? | sí | ✗ *(operaciones de conjunto)* | ✗ `UNION` y `UNION ALL` |
| 7 | ¿Tiene una **subconsulta en el `WHERE` que referencia una tabla del `FROM`**? | sí | — *(no lo menciona)* | ✗ |
| 8 | ¿Referencia **sólo valores literales**, sin tabla debajo? | sí | — | ✗ |
| 9 | ¿Está declarada con **`ALGORITHM = TEMPTABLE`**? | sí | — | ✗ |
| 10 | ¿Está definida sobre **otra vista no actualizable**? | sí | ✗ *(`Vi` requiere `Vi-1`)* | ✗ |
| 11 | ¿Deriva de **más de una tabla** (`JOIN`)? | sí | (atención) **sólo** si la escritura toca la tabla que **preserva la clave** | (atención) **contradictorio en el deck**: el slide 13 dice ✗, el slide 10 inserta y actualiza a través de un `join`, y sobre `vjoin` el manual acepta sólo el `UPDATE` (ver bug del slide 10 y asimetría de los slides 14–16) |
| 12 | La escritura, ¿toca **columnas de más de una** tabla base? | sí | ✗ *(condición 1)* | (atención) *el slide 13 no lo lista; los slides 15–16 muestran DML multi-tabla **válido** si el destino escrito es una vista actualizable* |
| 13 | ¿Hay **múltiples referencias a una misma columna base**? | sí | — | (atención) falla el `INSERT`, ok `UPDATE`/`DELETE` |
| 14 | ¿La vista **oculta** columnas `NOT NULL` sin `DEFAULT` de la tabla base? | sí | ✗ para `INSERT` *(condición 3)* | ídem |
| 15 | ¿La escritura **activa RI asociadas** con efectos fuera de la vista? | sí | (atención) condición 3 — el estándar la desaconseja | ídem |
| 16 | Si hay **`WITH CHECK OPTION`**: ¿la fila resultante **cumple** la condición de la vista? | no | ✗ se rechaza la sentencia *(condición 4)* | ídem |
| — | **Todo lo anterior pasó** | | ✓ **automáticamente actualizable** (vista **σ-π-⋈**) | ✓ *merged (updatable) view* |
| — | Algo dio ✗ pero **igual hay que poder escribir** | | → **trigger `INSTEAD OF`** (slides 11–12) | (atención) **MySQL no tiene `INSTEAD OF`** |

> [!tip] La versión corta para el parcial
> **σ-π-⋈ y una sola tabla tocada.** Si la definición sólo tiene lista de columnas (π), `WHERE` (σ) y
> a lo sumo `JOIN`s por FK→PK (⋈), y la escritura cae toda sobre la tabla que preserva la clave →
> actualizable. `GROUP BY`, `DISTINCT`, `UNION`, agregados y subconsultas en el `SELECT` quedan
> afuera: cualquier cosa que rompa la correspondencia **1 fila de la vista ↔ 1 fila de una tabla
> base** la mata.

---

## Slide 22 · Bibliografía del deck

Transcripción literal, **no verificada** contra las fichas del vault:

> - Date, C., *"An Introduction to Database Systems"*. 8º ed., Addison Wesley, 2004
> - Elmasri, R., Navathe, S., *"Fundamentals of Database Systems"*, Addison Wesley, 2011 **(Cap. 5)**
> - Ramakrishnan R., Gehrke J., *"Database Management Systems"*, 3° ed., McGraw-Hill, 2003
> **(Cap. 3 y 25)**
> - Silberschatz, A., Korth, H, Sudarshan, S., *"Database System Concepts"*, McGraw Hill, 2001
> **(Cap. 4)**

El mapeo real tema → capítulo, contra los índices de las fuentes del vault, va en
[[_index-bibliografia]] § 2.

---

## Dudas abiertas

- [x] ~~**¿`CASCADED` vs. `LOCAL`?**~~ **Resuelto** en el deck 06 → [[Clase 06 - Vistas-Parte 1]]
  slides 15–17: `CASCADED` es el default (del estándar **y** de MySQL). Queda abierto allá si la
  definición de `LOCAL` del slide 15 coincide con la del estándar.
- [ ] **¿Una vista con `JOIN` es o no actualizable en MySQL?** El slide 13 dice que no; los slides 10
  y 15 muestran escrituras válidas. `vjoin` tiene un componente materializado (`vmat`) que
  `vista_nota_alumnos_aprobados` no tiene: quizás no sean el mismo caso. **Preguntar.**
- [ ] **`E.cantidad_horas` en el slide 7**: ¿tipeo o esquema distinto?
- [ ] **¿El trigger del slide 12 es "sintaxis SQL estándar"?** Usa `:new` de Oracle PL/SQL.
- [ ] **¿Cómo se resuelve el TP4 si MySQL no tiene `INSTEAD OF` ni vistas materializadas?**
- [ ] **`CREATE MATERIALIZED VIEW … WITH LOCAL CHECK OPTION` (slide 21)**: ¿error del deck o hay
  algún motor donde sea válido?
- [ ] **¿Se acepta `CREATE OR REPLACE VIEW` en el TP4?** No aparece en ningún deck; la única vía
  documentada para *"re-crear"* (slide 19) es `DROP VIEW` (deck 06 slide 7) + `CREATE`.
- [ ] **¿Qué criterio concreto decide qué vistas materializar?** El slide 17 lo declara *"decisión
  compleja"*.
- [ ] **¿Cuáles son los *"Manifiestos para SQL:1999"* del slide 4** y qué operaciones proponen admitir?

## Enlaces

- Clase anterior: [[Clase 06 - Vistas-Parte 1]] *(Vistas, Parte 1)* · clase siguiente:
  [[Clase 08 - Explicando el plan]] *(índices y plan de ejecución)*
- Práctica correspondiente: [[Práctica 2026-08-11]] *(TP4 Vistas)*
- Conceptos: [[1.06.01 - Vistas|Vistas]] · [[Clase 07 - Vistas-Parte 2|Vistas materializadas]] · [[Restricciones de integridad referencial]] ·
  [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]]
- Motores: [[MySQL]] · [[PostgreSQL]]
- Adelanta temas de clases posteriores: [[Restricciones de integridad]] ·
  [[Triggers y SQL procedural]] *(triggers `INSTEAD OF`)* · [[Seguridad en bases de datos]]
  *(vistas como control de acceso)*
- Índice de clases: [[_index-clases]] · bibliografía: [[_index-bibliografia]] § 2 · calendario:
  [[_cronograma]]
