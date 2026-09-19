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

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 07 - Vistas-Parte 2.pdf` · **22 slides**
> Dictado en la **teórica del lunes 10/08**. El `07` del nombre del archivo **es el número de clase**:
> la numeración de la cátedra (`BD2_Clase NN` → Clase NN) es la única que vale, y el
> [[_cronograma]] no numera clases.
> Es la **parte 2 de 2**: la parte 1 es la clase anterior, [[Clase 06 - Vistas-Parte 1]]. La clase siguiente
> es [[Clase 08 - Explicando el plan]].
> Se practica con el **TP4 Vistas** → [[Práctica 2026-08-11]].

> [!info] Esta clase vive en `raw/Unidad-01/Teorica/`
> No es un error de archivado: **la Unidad-01 agrupa las Clases 01 a 08**, y una carpeta de unidad
> puede contener varias clases. El path no dice a qué clase pertenece un archivo — eso lo registra
> [[_index-clases]]. Del mismo lunes 10/08 son también las Clases 06 y 08.

## Resumen

Toda la parte 2 gira alrededor de una sola pregunta: **¿se puede escribir a través de una vista?**
La respuesta del deck tiene tres capas que no coinciden entre sí — el **estándar SQL:1999**, lo que
hace **MySQL**, y lo que se puede forzar con **triggers `INSTEAD OF`** — y cierra con **vistas
materializadas**, ventajas y desventajas.

| Slides | Tema | Qué hay que llevarse |
| --- | --- | --- |
| 1–2 | Portada + **repaso** de la parte 1 | esquema externo, relación derivada, tabla virtual, `CREATE VIEW` |
| **3** | **Actualizaciones en Vistas** | las **4 condiciones** para que una vista sea automáticamente actualizable |
| **4** | Vistas actualizables con **2+ tablas** | **preservación de la clave**, vistas σ-π-⋈, cadena `T→V1→…→Vn` |
| 5 | Comentarios sobre **RIRs** | tres ubicaciones posibles de la FK → tres casos de ensamble |
| 6–8 | Un ejemplo por caso | `EMPL_SISTEMAS` (N:1) · `EMPL_PROY` (N:N) · `ING_TANDIL` (tipo-subtipo) |
| 9–10 | Ejemplo corrido en **MySQL** | `alumnos` + `profesores` + `vista_nota_alumnos_aprobados` |
| 11–12 | Actualización vía **triggers `INSTEAD OF`** | escape para vistas que **no** son automáticamente actualizables |
| **13** | Vistas actualizables **en MySQL** | la lista de **12 casos** que hacen una vista no actualizable |
| 14–16 | Ejemplos del manual MySQL | `insert` · `update` · `delete` sobre `vjoin` y `vup` |
| 17, 20–21 | **Vistas materializadas** | concepto, comparativa por SGBD, `CREATE MATERIALIZED VIEW` de PostgreSQL |
| 18–19 | Ventajas y desventajas | seguridad, independencia de datos · actualización restringida, rendimiento |
| 22 | Bibliografía | Date · Elmasri-Navathe · Ramakrishnan-Gehrke · Silberschatz |

> [!important] La contradicción central del deck
> El slide 13 dice que en MySQL una vista con **`ENSAMBLES (joins)`** no es actualizable, pero el
> ejemplo del slide 10 **inserta y actualiza a través de una vista con `join`**, y el slide 15
> (captura del manual de MySQL) muestra `UPDATE vjoin SET c=c+1;` como **válido**.
> Los tres slides son del mismo deck. Detalle abajo → [[#Slides 14–16 · Los ejemplos del manual de MySQL]].

---

## Slides 1–2 · Repaso de la Parte 1

El slide 2 viene rotulado **`Repaso…`** y repite el arranque de [[Clase 06 - Vistas-Parte 1]]:
forman parte del **esquema externo** —*"presentan una parte de la BD de interés para grupos de
usuarios"*, *"ocultando el resto de la información"*—, son una **relación derivada** de una o más
tablas y/o vistas definidas previamente, y una **tabla virtual (habitualmente no materializada)**.
No lo desarrollo acá.

Lo único que hace falta tener a mano de ese slide es la sintaxis, porque el resto del deck se apoya
en su última línea:

```sql
CREATE VIEW nom_vista [(n_col_1, …, n_col_n)]
AS expresión_consulta
[WITH [opción] CHECK OPTION];
```

- `nom_vista`: nombre de la vista
- `n_col_1,..., n_col_n`: nombres de columnas de la vista
- `expresión_consulta`: consulta SQL que define la relación derivada
- **`opción`: cascade/local**

> [!note] `cascade/local` aparece nombrado y nunca definido **en este deck**
> En **todo el deck 07** la opción `cascade`/`local` aparece dos veces —el slide 2 la nombra en la
> lista de parámetros, el slide 21 escribe `WITH LOCAL CHECK OPTION` en un ejemplo— y no se explica
> la diferencia. (El slide 3 menciona `with check option` como cuarta condición, pero **no** nombra
> `cascade`/`local`.)
> **La definición sí está en la Parte 1**, deck 06 slides 15–17 → [[Clase 06 - Vistas-Parte 1]]:
> `CASCADED` (default) chequea la vista **y las subyacentes**, `LOCAL` sólo la propia.
> Resumen acá abajo → [[#WITH CHECK OPTION · qué dice este deck]].

---

## Slide 3 · Actualizaciones en Vistas

Este slide también viene rotulado `Repaso…`, pero es **el núcleo del deck**: todo lo que sigue son
casos particulares suyos.

> [!quote] La premisa de la que sale todo
> *"Las vistas no mantienen COPIAS de los datos → cuando se modifica una vista, se están
> modificando las tablas base"*

De ahí salen las dos direcciones, que **no son simétricas** (la columna *Dificultad* es
**razonamiento propio**; el slide sólo trae los dos títulos y las citas):

| Dirección | Qué dice el slide | Dificultad *(razonamiento propio)* |
| --- | --- | --- |
| **Tabla Base → Vista** | *"Al actualizar las tuplas de una tabla → los cambios se reflejan automáticamente sobre las vistas (si no se violan restricciones!)"* | **ninguna**: la vista se recalcula al consultarla |
| **Vista → Tabla Base** | *"Para que resulten automáticamente actualizables deben cumplir ciertas condiciones"* | **todo el problema**: hay que traducir una escritura sobre una relación derivada a escrituras sobre las tablas base, y esa traducción puede ser **ambigua** |

La pregunta que el slide se hace, textual (sin signo de apertura, tal cual el deck):
***"Cuándo es posible sin ambigüedades?"***

### Las cuatro condiciones, textuales

> [!quote] Slide 3 — transcripción literal
> - *"Si no afecta más de una tabla o, si deriva de más de una tabla, la actualización afecta sólo a
>   una (la que preserva la clave)"*
> - *"Si no contiene columnas con información derivada o funciones de grupo o clásula distinct,
>   subconsultas en el select u operaciones de conjunto"*
> - *"Si no causa error afectando atributos que no tienen valores por defecto definidos o que no
>   aceptan nulos o que activan RI asociadas"*
> - *"Si verifica la condición, si se especificó with check option"*

*(`clásula` es el tipeo del slide: dice **clásula distinct** por *cláusula distinct*.)*

### Qué significa cada una

| # | Condición | Por qué existe | Dónde se desarrolla |
| --- | --- | --- | --- |
| **1** | **Una sola tabla afectada** — o, si la vista deriva de varias, la escritura toca sólo **la que preserva la clave** | Si la vista junta dos tablas, un `INSERT` de una fila de la vista podría querer decir "insertar en A", "insertar en B" o "insertar en las dos": **ambiguo**. La regla lo desambigua eligiendo una sola tabla | slides 4–8 |
| **2** | **Sin información derivada, funciones de grupo, `DISTINCT`, subconsultas en el `SELECT` ni operaciones de conjunto** | Todas destruyen la correspondencia **1 fila de la vista ↔ 1 fila de la tabla base**. Con `SUM(x)`, ¿a qué fila base le escribo? Con `DISTINCT`, una fila de la vista puede venir de N filas base | slide 13 (versión MySQL) |
| **3** | **Que no cause error** en atributos sin `DEFAULT`, que no aceptan nulos, o que **activan RI asociadas** | La vista puede no exponer todas las columnas de la tabla base. Si una columna oculta es `NOT NULL` y sin `DEFAULT`, el `INSERT` a través de la vista no tiene con qué llenarla | — |
| **4** | **Que verifique la condición**, si se especificó `WITH CHECK OPTION` | Evita que una fila escrita por la vista **desaparezca de la vista** (*migración de tuplas*) | en este deck, sólo slides 2 y 21 · la explicación completa está en [[Clase 06 - Vistas-Parte 1]] (deck 06, slides 15–17) |

> [!note] Condición 3 — "activan RI asociadas"
> `RI` = **restricciones de integridad**. Que la escritura dispare una restricción (por ejemplo una
> FK con `ON DELETE`) no la vuelve imposible, la vuelve **riesgosa**: el efecto real sobre la base
> excede lo que el usuario ve en la vista. Es exactamente el tema de [[Restricciones de integridad]],
> que se dicta más adelante en la cursada.

---

## Slide 4 · Vistas actualizables a partir de 2 o más tablas/vistas

> [!quote] La regla del estándar
> *"Según el estándar SQL:1999, la actualización sobre una vista definida a partir de más de una
> tabla/vista → **sólo puede modificar una de las tablas base**: la que cumpla la propiedad de
> **preservación de la clave** (la que tiene la misma clave de la vista, y entonces aparece a lo
> sumo una vez en la vista)"*

**Preservación de la clave**, entonces, tiene una definición operativa: la tabla base cuya **clave es
la clave de la vista**. Consecuencia: cada fila de esa tabla aparece **a lo sumo una vez** en el
resultado, así que escribir una fila de la vista identifica **una sola** fila de esa tabla.

Los otros tres ítems del slide:

- **No debe definirse en base a Unión, Intersección o Diferencia.**
  Con la aclaración entre paréntesis: *"(Manifiestos para SQL:1999 y versiones posteriores →
  incluir otras operaciones, por ej. Intersección)"*. **Razonamiento propio:** la aclaración parece
  decir que hay propuestas de ampliar el estándar para admitir intersección; el deck no explica qué
  son esos "manifiestos" → duda abierta.
- **Se llaman vistas σ-π-⋈**: *"se obtienen mediante condiciones de ensamble sobre los pares
  FK → PK especificados en las RIRs"*. Selección, proyección y ensamble: nada más.
- **La actualización no se realizará si se viola alguna restricción definida sobre la relación base
  a actualizar.**

> [!quote] La nota al pie — vistas sobre vistas
> *"(\*) Puede ser otra vista, que en este caso debe ser actualizable.
> Si T→ V1→ V2→ … →Vn: **Vi será actualizable si Vi-1 lo es** y así sucesivamente"*
>
> La actualizabilidad es **hereditaria y frágil**: una sola vista no actualizable en la cadena
> vuelve no actualizables a todas las que están aguas abajo.

> [!tip] Mnemotécnica: σ-π-⋈ y nada más
> **Razonamiento propio, no está en el deck:** si la definición de la vista contiene algo que **no** sea `WHERE` (σ), lista de columnas (π) o
> `JOIN` por FK→PK (⋈), el estándar la da por no actualizable. `GROUP BY`, `DISTINCT`, `UNION`,
> agregados y subconsultas en el `SELECT` están todos afuera.

---

## Slide 5 · Comentarios sobre RIRs

**RIR** = restricción de integridad referencial. El slide clasifica las vistas-ensamble según
**dónde cae la FK** dentro del esquema de la relación. El diagrama muestra una relación partida en
dos bloques —**atributos clave** `K (K₁ … Kₘ)` y **atributos secundarios** `Z (Z₁ … Z_p)`— con una
flecha rotulada `rir` hacia otra relación cuya clave es `K_d`, y tres flechas punteadas debajo que
marcan los tres solapamientos posibles:

| Caso | Ubicación de la FK | De dónde proviene | Ejemplo del deck |
| --- | --- | --- | --- |
| **(1)** | **FK ≡ K** (la FK *es* la clave) | *"procede de la representación de relaciones de tipo-subtipo"* | `ING_TANDIL` (slide 8) |
| **(2)** | **FK ≡ Z₁,.., Z_r** (atributos secundarios), con **FK ∩ K = ∅** | *"proviene de la abstracción de relaciones 1:1, N:1 o n-arias con al menos una cardinalidad 1"* | `EMPL_SISTEMAS` (slide 6) |
| **(3)** | **FK ≡ K₁,.., K_q**, con **FK ⊂ K** (subconjunto propio de la clave) | *"resulta de las relaciones N:N, n-arias en general y las correspondientes a los vínculos entidad fuerte-entidad débil (rel. identificatorias)"* | `EMPL_PROY` (slide 7) |

Esto conecta directo con el paso de MER a esquema lógico: cada patrón de FK es la huella de un tipo
de relación del [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

---

## Slides 6–8 · Un ejemplo por caso

Los tres slides comparten el título **"Vistas Actualizables (a partir de 2 o más tablas/vistas)"**, la
etiqueta `Ejemplo`, el `CREATE VIEW`, el diagrama de las tablas a la derecha y la línea *"La clave de
… es …"* con la aclaración *"(análisis de dependencias funcionales)"*.

> [!warning] Sólo **dos** de los tres traen `Nota:`
> Los slides 6 y 8 cierran con una **`Nota:`** que explica por qué la tabla "obvia" **no** es la que
> preserva la clave. **El slide 7 no tiene ninguna nota**: termina en la línea de la clave.

> [!note] Cuál es la tabla que preserva la clave: lo dice el deck a medias
> **Razonamiento propio:** los slides **nunca escriben** "la tabla que preserva la clave es X". Dicen
> cuál es la clave de la vista, y en los slides 6 y 8 la `Nota:` dice cuál **no** es. La tabla
> preservada que anoto abajo en cada caso es la deducción de eso; **verificar en clase**.

### Slide 6 · Caso (2) — ensamble desde una relación N:1

> *"Caso (2): más intuitivo→ Ensamble mediante RIR, FK= atrib. secundarios"*
>
> *"Vista ensamble proveniente de relación N:1"*

Esquema de las tablas, según el diagrama:

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

Es decir: la propiedad se decide **mirando el esquema**, no las filas que hoy tiene la base. Un
`id_dpto` que resulta único *por casualidad* no convierte a `DEPARTAMENTO` en la tabla preservada.

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
  funcionales)* — clave **compuesta**, la de la tabla de ensamble.
- Tabla que preserva la clave: **`TRABAJA`** — **razonamiento propio**: este slide **no trae `Nota:`**
  y no nombra ninguna tabla preservada; se deduce de que la clave de la vista es exactamente la de
  `TRABAJA`.

> [!bug] `E.cantidad_horas` no existe
> El `WHERE` filtra por **`E.cantidad_horas`**, pero según el propio diagrama del slide
> `cantidad_horas` es una columna de **`TRABAJA`**, no de `EMPLEADO`. En cualquier motor esa
> consulta falla con *unknown column*. Debería decir **`T.cantidad_horas`**.
> Transcribo el slide tal cual. **Verificar en clase** si es un tipeo o si el esquema pretendido era
> otro.

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

O sea: los dos lados tienen la misma clave `id_empleado` y los dos aparecen una sola vez, pero
`EMPLEADO` tiene **más filas** que `INGENIERO` (hay empleados que no son ingenieros). El subtipo es
el que "encaja" exactamente con la vista.

> [!tip] Regla práctica para los tres casos
> **Razonamiento propio, no está en el deck:**
> **la tabla que preserva la clave es la del lado "muchos" / la más específica**: `EMPLEADO` frente a
> `DEPARTAMENTO`, `TRABAJA` frente a `EMPLEADO`, `INGENIERO` frente a `EMPLEADO`. Es la tabla cuya
> clave **coincide con la de la vista** y cuyo dominio no es más extenso que el de la vista.

> [!warning] Comillas tipográficas en los ejemplos que traen literales
> De los tres ejemplos sólo dos tienen literales de texto: los slides 6 y 8 escriben `'Sistemas'` y
> `'Tandil'` con **comillas curvas** (artefacto de
> PowerPoint). Copiadas y pegadas a un cliente SQL **fallan**: hay que reemplazarlas por comillas
> rectas `'...'`.

---

## Slides 9–10 · Ejemplo corrido en MySQL

Dos slides con capturas de un script real. **Este es el ejemplo que más se parece al TP4.**

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

*(`Jorje Dante` es tal cual el slide.)* Notar que `codigoprofesor` en `alumnos` **no está declarado
como FK**: la integridad referencial acá es sólo semántica.

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

**Razonamiento propio, no está en el deck** (el deck no muestra las salidas):

- El primer `select` sobre la vista devuelve **3 filas** —las de `nota>=7`— con su profesor:
  `30444444 Diana Dominguez / Maria Luque / 9.70`, `30555555 Fabian Fuentes / Jorje Dante / 8.50`,
  `30666666 Gaston Gonzalez / Jorje Dante / 9.70`.
- El `insert` **no menciona `nombreprofesor`**. Eso no es casualidad: es lo que hace que la escritura
  afecte **sólo a `alumnos`**, la tabla que preserva la clave (`documento` es la clave de la vista).
  Es la **condición 1** del slide 3 en acción. Si el `insert` hubiera incluido `nombreprofesor`,
  tocaría dos tablas y fallaría.
- El `update` cambia `9.7 → 10`: la fila **sigue cumpliendo** `nota>=7`, así que sigue en la vista.

> [!bug] El ejemplo contradice al slide 13
> `vista_nota_alumnos_aprobados` **es una vista con `join`**, y el slide 13 lista
> **`ENSAMBLES (joins)`** entre las cosas que hacen que una vista *no* sea actualizable en MySQL.
> Sin embargo acá el deck inserta y actualiza a través de ella sin comentario alguno, y el slide 15
> muestra `UPDATE vjoin SET c=c+1;` como **válido**.
> (Ojo: el slide 14 **no** ayuda a este ejemplo — ahí `INSERT INTO vjoin (c) VALUES (1);` figura como
> **inválido**. El único `insert` a través de una vista con `join` que el deck da por bueno es el del
> slide 10.)
> **Lo más probable** —razonamiento propio— es que el ítem del slide 13 esté mal enunciado y que lo
> correcto sea: *una vista con join es actualizable, pero cada sentencia sólo puede tocar una tabla
> base*. **Confirmar en clase antes del parcial**: es la clase de detalle que se pregunta.

> [!question] Lo que este ejemplo deja servido para `WITH CHECK OPTION`
> **Razonamiento propio:** si en vez de `set nota=10` se hiciera `set nota=5`, la fila se escribiría
> igual en `alumnos` y **desaparecería de la vista** (deja de cumplir `nota>=7`). Se puede modificar
> una fila hasta hacerla invisible desde la misma vista que la modificó. Eso es exactamente lo que
> bloquea `WITH CHECK OPTION`, y el deck no lo dice.

---

## Slides 11–12 · Actualización vía triggers `INSTEAD OF`

El escape para todo lo que quedó afuera.

> [!quote] Slide 11
> *"Recurso que permite la actualización de vistas que no son automáticamente actualizables"*
>
> - *"Definir triggers **INSTEAD OF** (opción especial para vistas) para las distintas operaciones
>   requeridas (eventos críticos)"*
> - *"Se pueden **"interceptar"** las operaciones de actualización: el trigger se dispara
>   automáticamente **en lugar de** la sentencia disparadora, en forma "invisible" para el usuario"*
> - *"Por defecto, los triggers INSTEAD OF son **for each row**"*
>
> Y la advertencia subrayada: *"**Importante**: Queda en manos del usuario la responsabilidad de
> implementar las actualizaciones necesarias y de la manera que las considere "adecuadas""*

Traducido: `INSTEAD OF` no resuelve la ambigüedad, **la delega**. El motor deja de intentar adivinar
qué tabla tocar y el programador escribe la semántica que quiera. Si la escribe mal, la base queda
inconsistente y nadie avisa.

### Slide 12 — el ejemplo `info_tutores`

Esquema base, según el recuadro del slide *(subrayado = clave)*:

```
Alumno (nro_al, nombre, id_tutor)      ← nro_al e id_tutor subrayados
Profesor (id_prof, nombre)             ← id_prof subrayado
```

```sql
CREATE VIEW info_tutores (nro_al, nom_al, id_tutor, nom_tut)
 AS SELECT A.nro_al, A.nombre, A.id_tutor, P.nombre
    FROM  Alumno A JOIN Profesor P
    ON  A.Id_tutor = P.id_prof;
```

Acá se ve para qué sirve la **lista de nombres de columnas** del `CREATE VIEW`: `A.nombre` y
`P.nombre` colisionan, y la lista los renombra a `nom_al` y `nom_tut`.

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

El slide rotula el bloque como **"sintaxis SQL estándar"** y agrega abajo:

> *"Deberían plantearse triggers similares para las operaciones de UPDATE y DELETE
> (en PostgreSQL la función podría implementar el comportamiento para todos los eventos)"*

La semántica elegida es **upsert en las dos tablas**: si el alumno no existe lo inserta, si existe le
cambia el tutor; ídem con el profesor. Es una decisión de diseño, no una regla — un `INSERT` sobre la
vista puede terminar en **dos `INSERT`, dos `UPDATE` o una mezcla**.

> [!bug] `:new` no es sintaxis SQL estándar
> **Razonamiento propio:** la notación `:new.columna` con dos puntos es de **Oracle PL/SQL**. El
> estándar usa `REFERENCING NEW ROW AS n` + `n.columna`, y PostgreSQL usa `NEW.columna` dentro de una
> **función** `RETURNS TRIGGER` (no un bloque `BEGIN…END` inline como el del slide). El rótulo
> "sintaxis SQL estándar" del slide **no se corresponde con el código que muestra**. Verificar en clase.

> [!warning] MySQL no tiene `INSTEAD OF` — y la cursada corre sobre MySQL
> **Razonamiento propio, no está en el deck:** MySQL sólo admite triggers `BEFORE` / `AFTER` y
> **sólo sobre tablas**, no sobre vistas. Este slide entero no es reproducible en el motor de la
> materia; en MySQL el equivalente funcional es un **stored procedure** que encapsule las escrituras,
> o directamente escribir contra las tablas base. **Confirmar con la cátedra** cómo se pide resolverlo
> en el TP4. Es el mismo problema PostgreSQL-vs-MySQL que arrastra el deck `BD2_Clase 04`.

---

## Slide 13 · Vistas actualizables en MySQL

La lista concreta del motor de la cursada. Transcripción textual:

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

*(Los tipeos son del slide: `independendientes`; y dos ítems quedaron a medio traducir del manual de
MySQL — *"Referencia solo a valores literales **only to literal values**"* y los paréntesis en inglés.)*

Puesto en relación con las condiciones del estándar (slide 3):

| Ítem MySQL | ¿A qué condición del estándar corresponde? |
| --- | --- |
| funciones de agregación, `GROUP BY`, `HAVING` | condición 2 — funciones de grupo |
| `DISTINCT` | condición 2 — cláusula distinct |
| `UNION` / `UNION ALL` | condición 2 — operaciones de conjunto (y slide 4: *"no debe definirse en base a Unión…"*) |
| subconsultas en el `SELECT` | condición 2 — subconsultas en el select |
| **`ENSAMBLES (joins)`** | **contradice** la condición 1, que sí admite joins si se preserva la clave → ver el bug arriba |
| vista no actualizable en el `FROM` | slide 4, nota al pie: `Vi` actualizable **sólo si** `Vi-1` lo es |
| subconsulta en el `WHERE` que referencia una tabla del `FROM` | **no** tiene equivalente en el estándar del slide 3 — es específico de MySQL |
| sólo valores literales | *"sin tabla subyacente para actualizar"* — no hay dónde escribir |
| `ALGORITHM = TEMPTABLE` | específico de MySQL: si el motor materializa en tabla temporal, se rompe el vínculo con las filas base |
| múltiples referencias a una columna base | específico de MySQL, y **sólo rompe el `INSERT`** |

> [!note] `ALGORITHM = MERGE` vs. `TEMPTABLE`
> **Razonamiento propio, no está en el deck:** MySQL puede resolver una vista de dos maneras —
> **fusionando** su definición con la consulta del usuario (`MERGE`) o **materializándola** en una
> tabla temporal (`TEMPTABLE`). Sólo las vistas resueltas por `MERGE` son actualizables; de ahí que
> los slides 14–16 hablen de *"merged (updatable) view"*. El deck nombra `TEMPTABLE` sin explicar el
> par. **Verificar en clase.**

---

## Slides 14–16 · Los ejemplos del manual de MySQL

Tres capturas de la documentación oficial de MySQL, en inglés, sobre el mismo esquema. El setup
(slide 14):

```sql
CREATE TABLE t1 (x INTEGER);
CREATE TABLE t2 (c INTEGER);
CREATE VIEW vmat AS SELECT SUM(x) AS s FROM t1;
CREATE VIEW vup AS SELECT * FROM t2;
CREATE VIEW vjoin AS SELECT * FROM vmat JOIN vup ON vmat.s=vup.c;
```

La columna *Estado* es **razonamiento propio**: el slide no rotula las vistas, sólo se deduce de las
razones que el manual da en cada ejemplo.

| Vista | Definición | Estado *(razonamiento propio)* |
| --- | --- | --- |
| **`vmat`** | `SELECT SUM(x) AS s FROM t1` | **no actualizable** — agregado ⇒ se materializa |
| **`vup`** | `SELECT * FROM t2` | **actualizable** — *merged view* |
| **`vjoin`** | `vmat JOIN vup` | **parcialmente** actualizable: una parte sí, la otra no |

### Slide 14 · `insert`

| Sentencia | ¿Válida? | Razón textual del manual |
| --- | --- | --- |
| `INSERT INTO vjoin (c) VALUES (1);` | ❌ | *"This statement is invalid because one component of the join view is nonupdatable"* |
| `INSERT INTO vup (c) VALUES (1);` | ✅ | *"This statement is valid; the view contains no materialized components"* |

### Slide 15 · `update`

| Sentencia | ¿Válida? | Razón textual del manual |
| --- | --- | --- |
| `UPDATE vjoin SET c=c+1;` | ✅ | *"This statement is valid; column `c` is from the updatable part of the join view"* |
| `UPDATE vjoin SET x=x+1;` | ❌ | *"This statement is invalid; column `x` is from the nonupdatable part"* |
| `UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ... SET c=c+1;` | ✅ | *"This statement is valid; the updated table reference of the multiple-table UPDATE is an updatable view (`vup`)"* |
| `UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ... SET s=s+1;` | ❌ | *"This statement is invalid; it tries to update a materialized derived table"* |

### Slide 16 · `delete`

| Sentencia | ¿Válida? | Razón textual del manual |
| --- | --- | --- |
| `DELETE vjoin WHERE ...;` | ❌ | *"This statement is invalid because the view is a join view"* |
| `DELETE vup WHERE ...;` | ✅ | *"This statement is valid because the view is a merged (updatable) view"* |
| `DELETE vup FROM vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...;` | ✅ | *"This statement is valid because it deletes from a merged (updatable) view"* |

> [!important] La asimetría que hay que memorizar
> **Razonamiento propio a partir de los slides 14–16** (el deck no saca esta conclusión):
> sobre `vjoin` —una vista con join **con un componente no actualizable**— el manual da
> `INSERT` **inválido** (slide 14) y `DELETE` **inválido** (slide 16), pero `UPDATE` **válido si la
> columna tocada viene de la parte actualizable** (slide 15). La razón que imprime cada slide no es
> la misma: el `INSERT` falla *"because one component of the join view is nonupdatable"*, el `DELETE`
> falla *"because the view is a join view"* —sin condicionarlo al componente materializado—, y el
> `UPDATE` se decide **columna por columna**.
>
> Esto **matiza** el ítem `ENSAMBLES (joins)` del slide 13: el slide lo enuncia sin distinguir la
> operación, y las capturas muestran que la operación importa. **Confirmar en clase.**

---

## Slide 17 · Vistas materializadas

> [!quote] El disparador
> *"Algunas aplicaciones pueden requerir alto grado de respuesta por parte de la BD (**no siendo
> suficiente la optimización de la/s consulta/s**)"*

**Razonamiento propio:** cuando afinar la consulta ya no alcanza —es lo único que nombra el slide—,
se cambia de estrategia: **precalcular**.

*"Una vista puede ser **materializada**"*:

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

**Razonamiento propio:** las dos dimensiones son ortogonales — **qué se recalcula** (todo vs. sólo el
delta) y **cuándo** (en cada escritura vs. cada tanto vs. a pedido). El precio es siempre el mismo
trade-off: **lecturas rápidas a cambio de escrituras caras y datos potencialmente rancios.**

> [!tip] Es el mismo trade-off que reaparece en NoSQL
> **Razonamiento propio:** "precalcular una vista y aceptar que quede desactualizada un rato" es
> exactamente la lógica de la **desnormalización** y de las vistas de MapReduce que se ven en la
> segunda mitad de la cursada. Vale la pena tener el concepto en [[Clase 07 - Vistas-Parte 2|Vistas materializadas]] como
> página transversal.

---

## Slide 18 · Ventajas de las vistas

> [!quote] Transcripción
> - *"**Simplifican la percepción** que los usuarios tienen de la BD, presentando la información
>   necesaria y ocultando el resto"*
> - *"**Presentan diferentes datos** a distinto tipo de usuarios, aún cuando los estén compartiendo
>   (sobre la misma BD)"*
> - *"Permiten definir **consultas complejas/frecuentes** para no tener que especificarlas cada vez
>   que se utilizan"*
> - *"Facilitan la **independencia de los datos** (ocultando a los usuarios cambios en la estructura
>   en las tablas base)"*
> - *"Permiten aplicar **políticas de seguridad** (privacidad): dando privilegios selectivamente
>   sobre distintas vistas (control de acceso)"*
>     - *"Vistas sobre algunas **columnas**, ocultando otras reservadas para usuarios específicos
>       (ej. antecedentes penales)"*
>     - *"Vistas sobre determinadas **filas**, ocultando otras reservadas para usuarios específicos
>       (ej. películas no aptas para público infantil)"*

**Razonamiento propio, no está en el deck:** la seguridad por vistas tiene entonces **dos
granularidades**, que se corresponden con las dos operaciones del álgebra (el slide da los dos
ejemplos, pero no los nombra π y σ):

| Granularidad | Operación | Ejemplo del deck |
| --- | --- | --- |
| **Por columnas** (vertical) | **proyección** π | ocultar `antecedentes_penales` |
| **Por filas** (horizontal) | **selección** σ | ocultar películas no aptas para público infantil |

El slide habla de *"dando privilegios selectivamente sobre distintas vistas (control de acceso)"* pero
**no nombra `GRANT`**. Es el anticipo directo de [[Seguridad en bases de datos]], tema de una clase
posterior de la cursada.

---

## Slide 19 · Desventajas de las vistas

> [!quote] Transcripción
> - *"**Actualizaciones VISTA → Tabla BASE restringidas**: hay varias limitaciones sobre la
>   estructura de las vistas para asegurar que resulten automáticamente actualizables (debido a
>   posibles anomalías)"*
> - *"**Cuestiones de Rendimiento**: el proceso de resolución de la vista puede exigir el acceso a
>   múltiples tablas cada vez que se accede a ella → evaluar si podría justificarse su materialización
>   (técnicas de mantenimiento de vistas)"*
> - *"**Necesidad de sincronización** en caso de vistas materializadas (y duplicación de datos)"*
> - *"**Modificaciones a la estructura de tablas base** (ej. agregado de columnas) no serán advertidos
>   por la vista, salvo que sea **re-creada**"*

> [!important] La última desventaja es la cara oculta de la cuarta ventaja
> **Razonamiento propio, no está en el deck:** el slide 18 vende la **independencia de los datos** como
> beneficio; el 19 muestra el costo: una columna nueva en la tabla base **no aparece** en una vista
> `SELECT *` ya creada. La vista congela el esquema al momento del `CREATE VIEW` y hay que
> **re-crearla** para que lo vea. El deck dice *"salvo que sea re-creada"* pero **no da la sentencia**:
> `DROP VIEW` está en [[Clase 06 - Vistas-Parte 1]] (deck 06, slide 7); `CREATE OR REPLACE VIEW` no
> aparece en ninguno de los dos decks. **Verificar en clase.**

---

## Slides 20–21 · Vistas materializadas en cada motor

### Slide 20 — la comparativa

Tabla transcripta de la captura:

| SGBD | Cómo funcionan las vistas materializadas *(textual del slide)* |
| --- | --- |
| **PostgreSQL** | *"Con PostgreSQL, se debe **actualizar manualmente** la vista materializada y volver a calcular la **vista completa**. La vista materializada se completa con datos en el momento exacto en que se crea."* |
| **MySQL** | *"MySQL **no admite** las vistas materializadas."* |
| **Oracle** | *"Oracle **actualiza automáticamente** las vistas materializadas, pero también ofrece la opción de actualizarlas a pedido. También puede escribir una instrucción SQL que solicite que las vistas se actualicen antes de generar resultados."* |
| **SQL Server** | *"SQL Server usa el nombre **"vistas indexadas"**, ya que la materialización es un paso para crear un índice de una vista normal. Solo puede realizar consultas SQL básicas con las vistas indexadas. Se actualizan **automáticamente** para el usuario."* |

Cruzado con las preguntas del slide 17 — **razonamiento propio**, el deck no arma este cruce:

| Motor | ¿Regeneración o incremental? | ¿Cuándo? |
| --- | --- | --- |
| PostgreSQL | **regeneración completa** *("volver a calcular la vista completa")* | **forzado** (manual) |
| Oracle | (no lo dice) | automática **o** a pedido |
| SQL Server | (no lo dice) | automática, transparente |
| MySQL | — | **no las tiene** |

> [!warning] MySQL no tiene vistas materializadas, y la cursada corre sobre MySQL
> El propio slide lo dice. O sea que **toda la sección de vistas materializadas es teórica** para el
> TP4 y para la práctica de la materia. **Razonamiento propio, no está en el deck:** el reemplazo
> habitual en MySQL es una **tabla real** que se rellena con un `INSERT … SELECT` y se refresca con
> un `EVENT` programado o con triggers. **Verificar con la cátedra** si el parcial puede pedir eso.

### Slide 21 — la sintaxis de PostgreSQL

```sql
CREATE MATERIALIZED VIEW view_name
AS query
WITH [NO] DATA;
```

Transcripción de las viñetas (el slide las deja en inglés):

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
> **Razonamiento propio:** `WITH [LOCAL|CASCADED] CHECK OPTION` es una cláusula de **`CREATE VIEW`**,
> no de `CREATE MATERIALIZED VIEW`. Una vista materializada **no es actualizable**, así que no tiene
> sentido chequear condición alguna sobre escrituras que no existen. La forma correcta sería:
>
> ```sql
> CREATE MATERIALIZED VIEW alumnos_2017
> AS SELECT * FROM alumno WHERE añoDeIngreso = 2017
> WITH DATA;
> ```
>
> Además el identificador **`añoDeIngreso`** lleva `ñ` y mayúsculas: PostgreSQL pliega los
> identificadores sin comillas a **minúsculas**, con lo cual el nombre real de la columna tendría que
> ser `añodeingreso` o ir entrecomillado. **Verificar en clase** — es el candidato número uno a
> pregunta capciosa.

> [!warning] Deck en PostgreSQL, cursada en MySQL
> Este slide es el segundo caso registrado de un deck escrito sobre PostgreSQL mientras la cursada
> corre sobre **MySQL** (el primero es `BD2_Clase 04`, ver [[_cronograma]] § diferencias con el
> programa). Y acá el desajuste es máximo: **MySQL no tiene `CREATE MATERIALIZED VIEW` en absoluto**,
> como dice el propio slide 20.
> **Razonamiento propio:** en PostgreSQL el refresco manual que menciona el slide 20 se hace con
> `REFRESH MATERIALIZED VIEW nombre;`, sentencia que el deck **no menciona**.

---

## WITH CHECK OPTION · qué dice este deck

Todo lo que el **deck 07** trae sobre el tema, junto:

| Slide | Qué dice, textual |
| --- | --- |
| 2 | `[WITH [opción] CHECK OPTION];` · *"opción: **cascade/local**"* |
| 3 | 4ª condición: *"Si verifica la condición, si se especificó with check option"* |
| 21 | `WITH LOCAL CHECK OPTION` dentro de un `CREATE MATERIALIZED VIEW` (que además es incorrecto) |

Es decir: **este deck la nombra y no la explica.**

> [!success] La explicación completa está en la Parte 1 — no estudiarla de acá
> El deck **06** (Parte 1) le dedica tres slides: **15** (definición de WCO y la tabla
> `CASCADED`/`LOCAL`), **16** y **17** (dos ejercicios). Ir a
> [[Clase 06 - Vistas-Parte 1]] § *Vistas con Opción de Chequeo (WCO)*.
>
> Lo mínimo que hay que traerse de allá para leer este deck:
>
> | Opción | Qué se chequea, según el deck 06 slide 15 | Default |
> | --- | --- | --- |
> | **`CASCADED`** | *"las tuplas son chequeadas contra las condiciones de la vista **y aquellas de las vistas subyacentes**"* | **sí** |
> | **`LOCAL`** | *"sólo se chequean contra las condiciones definidas en **la misma vista**"* | no |
>
> Además el deck 06 aclara que WCO *"sólo está soportado en vistas automáticamente actualizables"* —
> lo que explica por qué el `WITH LOCAL CHECK OPTION` del slide 21, sobre una vista **materializada**,
> no tiene sentido.

---

## ¿Esta vista es actualizable? — tabla de decisión

**Razonamiento propio:** esta tabla no está en el deck — es el cruce de los slides 3–4 (estándar) con
el 13 (MySQL) y las capturas 14–16. Checklist para el TP4 y para el parcial; se recorre de arriba
hacia abajo y **el primer ❌ corta**.

| # | Pregunta | Si la respuesta es… | Estándar SQL:1999 (slides 3–4) | MySQL (slide 13) |
| --- | --- | --- | --- | --- |
| 1 | ¿Tiene **funciones de agregación** (`SUM`, `COUNT`, …)? | sí | ❌ no actualizable | ❌ |
| 2 | ¿Tiene **`GROUP BY`** o **`HAVING`**? | sí | ❌ *(funciones de grupo)* | ❌ |
| 3 | ¿Tiene **`DISTINCT`**? | sí | ❌ | ❌ |
| 4 | ¿Tiene **columnas derivadas / calculadas**? | sí | ❌ | *(el slide 13 no lo lista)* |
| 5 | ¿Tiene **subconsultas en el `SELECT`**? | sí | ❌ | ❌ *(las independientes: sólo falla el `INSERT`)* |
| 6 | ¿Usa **`UNION` / `INTERSECT` / `EXCEPT`**? | sí | ❌ *(operaciones de conjunto)* | ❌ `UNION` y `UNION ALL` |
| 7 | ¿Tiene una **subconsulta en el `WHERE` que referencia una tabla del `FROM`**? | sí | — *(no lo menciona)* | ❌ |
| 8 | ¿Referencia **sólo valores literales**, sin tabla debajo? | sí | — | ❌ |
| 9 | ¿Está declarada con **`ALGORITHM = TEMPTABLE`**? | sí | — | ❌ |
| 10 | ¿Está definida sobre **otra vista no actualizable**? | sí | ❌ *(`Vi` requiere `Vi-1`)* | ❌ |
| 11 | ¿Deriva de **más de una tabla** (`JOIN`)? | sí | ⚠️ **sólo** si la escritura toca la tabla que **preserva la clave** | ⚠️ **contradictorio en el deck**: slide 13 dice ❌; el slide 10 hace `INSERT` **y** `UPDATE` a través de una vista con `join`, y el slide 15 da `UPDATE vjoin SET c=c+1;` por válido — pero sobre `vjoin` el slide 14 da el `INSERT` por inválido y el 16 el `DELETE` por inválido |
| 12 | La escritura, ¿toca **columnas de más de una** tabla base? | sí | ❌ *(condición 1)* | ⚠️ *el slide 13 no lo lista; los slides 15–16 muestran DML multi-tabla **válido** si el destino escrito es una vista actualizable* |
| 13 | ¿Hay **múltiples referencias a una misma columna base**? | sí | — | ⚠️ falla el `INSERT`, ok `UPDATE`/`DELETE` |
| 14 | ¿La vista **oculta** columnas `NOT NULL` sin `DEFAULT` de la tabla base? | sí | ❌ para `INSERT` *(condición 3)* | ídem |
| 15 | ¿La escritura **activa RI asociadas** con efectos fuera de la vista? | sí | ⚠️ condición 3 — el estándar la desaconseja | ídem |
| 16 | Si hay **`WITH CHECK OPTION`**: ¿la fila resultante **cumple** la condición de la vista? | no | ❌ se rechaza la sentencia *(condición 4)* | ídem |
| — | **Todo lo anterior pasó** | | ✅ **automáticamente actualizable** (vista **σ-π-⋈**) | ✅ *merged (updatable) view* |
| — | Algo dio ❌ pero **igual hay que poder escribir** | | → **trigger `INSTEAD OF`** (slides 11–12) | ⚠️ **MySQL no tiene `INSTEAD OF`** |

> [!tip] La versión corta para el parcial
> **σ-π-⋈ y una sola tabla tocada.** Si la vista es un `SELECT` de columnas, con `WHERE`, y a lo sumo
> `JOIN`s por FK→PK, y la escritura cae toda sobre la tabla que preserva la clave → actualizable.
> Cualquier cosa que rompa la correspondencia **1 fila de la vista ↔ 1 fila de una tabla base** la
> mata.

---

## Slide 22 · Bibliografía del deck

Transcripción literal del slide de cierre — **no verificada** contra las fichas del vault:

> - Date, C., *"An Introduction to Database Systems"*. 8º ed., Addison Wesley, 2004
> - Elmasri, R., Navathe, S., *"Fundamentals of Database Systems"*, Addison Wesley, 2011 **(Cap. 5)**
> - Ramakrishnan R., Gehrke J., *"Database Management Systems"*, 3° ed., McGraw-Hill, 2003
>   **(Cap. 3 y 25)**
> - Silberschatz, A., Korth, H, Sudarshan, S., *"Database System Concepts"*, McGraw Hill, 2001
>   **(Cap. 4)**

El mapeo real tema → capítulo, contra los índices de las fuentes que están en el vault, va en
[[_index-bibliografia]] § 2.

---

## Dudas abiertas

- [x] ~~**¿`CASCADED` vs. `LOCAL`?**~~ **Resuelto**: este deck no lo define, pero el deck 06 sí →
      [[Clase 06 - Vistas-Parte 1]] slides 15–17. `CASCADED` es el default (del estándar **y** de
      MySQL) y chequea también las vistas subyacentes; `LOCAL` sólo la propia. Queda abierto allá si
      la definición de `LOCAL` del slide 15 coincide con la del estándar.
- [ ] **¿Una vista con `JOIN` es o no actualizable en MySQL?** El slide 13 dice que no; el ejemplo
      del slide 10 hace `insert` **y** `update` a través de una, y el slide 15 da por válido
      `UPDATE vjoin SET c=c+1;`. Pero sobre `vjoin` el slide 14 rechaza el `INSERT` y el slide 16
      rechaza el `DELETE`. **La contradicción está dentro del mismo deck** — y `vjoin` tiene un
      componente materializado (`vmat`) que `vista_nota_alumnos_aprobados` no tiene, así que quizás
      no sean el mismo caso. **Preguntar.**
- [ ] **`E.cantidad_horas` en el slide 7** — según el diagrama del propio slide, `cantidad_horas` es
      de `TRABAJA`, no de `EMPLEADO`. ¿Tipeo o esquema distinto?
- [ ] **¿El trigger del slide 12 es "sintaxis SQL estándar"?** Usa la notación `:new` de Oracle
      PL/SQL, no la del estándar ni la de PostgreSQL.
- [ ] **¿Cómo se resuelve el TP4 si MySQL no tiene `INSTEAD OF` ni vistas materializadas?** ¿Se pide
      la teoría en el parcial y la práctica se hace de otra forma?
- [ ] **`CREATE MATERIALIZED VIEW … WITH LOCAL CHECK OPTION` (slide 21)** — no es sintaxis válida de
      PostgreSQL. ¿Es un error del deck o hay algún motor donde sí lo sea?
- [ ] **`CREATE OR REPLACE VIEW` no aparece en ningún deck**, pero el slide 19 dice que la vista hay
      que *"re-crearla"* para que vea columnas nuevas. `DROP VIEW` sí está —deck 06 slide 7, ver
      [[Clase 06 - Vistas-Parte 1]]—, así que la única vía documentada es `DROP` + `CREATE`.
      ¿Se acepta `CREATE OR REPLACE VIEW` en el TP4?
- [ ] ¿Qué criterio concreto se usa para decidir **qué vistas materializar**? El slide 17 lo declara
      *"decisión compleja"* y no da ninguno.
- [ ] El slide 4 habla de *"Manifiestos para SQL:1999 y versiones posteriores"* — ¿cuáles son esos
      manifiestos y qué operaciones proponen admitir además de la intersección?

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
