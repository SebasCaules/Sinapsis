---
tipo: teorica
clase: 2
deck: "BD2_Clase 02 - Modelo Entidad-Relacion.pdf"
unidad: 1
tema: Modelo de Entidades y Relaciones (MER / DER)
resumen: "Modelo de Entidades y Relaciones de Chen, diseñado sin DBMS: entidades fuertes y débiles, los cinco ejes de un atributo, relaciones por orden y cardinalidad, y jerarquías ES-UN. Las cardinalidades (mín,máx) se leen look-across, cruzadas, con 0 opcional y 1 obligatorio."
fecha: 2026-08-03
modalidad: virtual, lunes 19:00–22:00
aliases:
  - BD2_Clase 02
  - Clase 02 — Modelo Entidad-Relación
  - Modelo Entidad-Relación (clase)
fuentes:
  - "raw/Unidad-01/Teorica/BD2_Clase 02 - Modelo Entidad-Relacion.pdf"
estado: procesado
---

# Clase 02 — Modelo de Entidades y Relaciones

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 02 - Modelo Entidad-Relacion.pdf` · **36 slides**
> Dictado en la **teórica virtual del lunes 03/08**. El `02` del nombre del archivo **es el número de
> clase**: la numeración de la cátedra (`BD2_Clase NN`) es la única que existe, y el cronograma no
> numera clases. Varias clases se dictaron esa misma fecha — el índice completo está en
> [[_index-clases]].
> Se practica con `ITBA TP 1 Modelos_Diagramas.pdf` → [[Práctica 2026-08-04]].
> Bibliografía: [[_index-bibliografia]] § 2.bis (mapeo del deck `BD2_Clase 02`).

> [!quote] El deck declara su fuente (slide 2)
> *"Apuntes de Cátedra. Bases de Datos. Prof. J. Ale y G. Dejean. Fac. Ingeniería UBA."*
> Por eso su notación no coincide con ningún libro del vault → [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

## Resumen

El lenguaje natural sirve para *comunicar* información pero no para *estructurarla*: por eso se usan
**modelos**. Un **modelo de datos** tiene poder expresivo y es abstracto; modelar es **elegir qué es
relevante**. El conjunto formal de esas decisiones es el **modelo conceptual**, y el estándar es el
**MER de Chen (1976)**, hecho de entidades, atributos y relaciones. Toda la clase ocurre **sin
DBMS** — segunda caja de [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]].

| Constructo | Qué hay que decidir | Slides |
| --- | --- | --- |
| **Entidad** | ¿fuerte o débil? Test: las tres propiedades inherentes | 10–13 |
| **Atributo** | los **cinco ejes**: presencia · cardinalidad · rol · composición · origen | 14–19 |
| **Relación** | orden y cardinalidad; puede tener atributos propios | 21–25 |
| **Cardinalidad** | máximos primero, mínimos después (0 = opcional, 1 = obligatorio) | 26–27, 31–33 |
| **Jerarquía ES-UN** | exclusiva o compartida; participación total o parcial | 35 |

Referencia de notación y checklist de modelado: [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

---

## Slides 2–3 · Representación de la información

- **La estructura y el contexto le dan *significado* a los datos**, posibilitando su entendimiento.
- El **lenguaje natural** es la forma primaria de representación y comunicación, pero **NO es el mejor
  medio**.
- Conviene establecer formas especializadas de **representación**: las fórmulas matemáticas, los mapas
  carreteros y las partituras musicales son **modelos** de representación simbólica.

Un estudiante puede simbolizarse así:

```
<LU: 123456; Nombre y Apellido: Juan Torres; Fecha nacimiento: 23/08/1995; carrera: Ing en Sistemas>
```

La notación simplificada que solo contiene los valores se denomina **TUPLA o REGISTRO**:

```
<123456; Juan Torres; 23/08/1995; Ing en Sistemas>
```

La interpretación de esos valores es aplicable a todas las tuplas por igual:

```
<LU; Nombre y Apellido; Fecha nacimiento; carrera>
```

## Slide 4 · Modelo de datos

**Herramienta intelectual** que permite plasmar una interpretación de un conjunto de aspectos del
mundo real:

| Propiedad | Qué significa |
| --- | --- |
| **Poder expresivo** | Representa cómo están relacionados los datos |
| **Abstracta** | Mínimamente perturbable ante los cambios del aspecto evolutivo del mundo real |

Es un **mecanismo de abstracción**: permite ver el *contenido de información* de los datos **en lugar
de sus valores individuales**. Interesan los que puedan ser **codificados y manipulados
computacionalmente**.

## Slide 5 · Diseño de un modelo de datos

- **Modelado de datos** → organizar los datos para que representen una situación del mundo real con la
  mayor fidelidad posible, para poder manejarlos computacionalmente.
- **No es posible tener un conocimiento completo del mundo real** → centrar la atención en la
  información **relevante**, ocultando o ignorando la que no lo sea.
- Esas características se describen con **enunciaciones generales**, por ejemplo en lenguaje natural.
- **Un conjunto formal y consistente de tales enunciaciones define un *modelo conceptual de datos*.**

## Slide 6 · Etapas en el diseño de datos

Página completa: [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]].

```
UdeD ──▶ Diseño Conceptual ──▶ Diseño Lógico ──▶ Almacenamiento (Base de Datos)
          ▲                     Temprano │ Tardío                ▲
          │                    ── sin DBMS │ con DBMS ──          │
   Ingeniería de          Normalización y Depuración        Esquema Físico
   Requisitos             + Esquema Conceptual
                          Esq. Lógico Genérico │ Esq. Lógico Específico
```

| Artefacto | Etapa | ¿DBMS? |
| --- | --- | --- |
| **UdeD** | entrada, vía ingeniería de requisitos | — |
| **Esquema conceptual** | diseño conceptual | no |
| **Esquema lógico genérico** | diseño lógico **temprano** | no |
| **Esquema lógico específico** | diseño lógico **tardío** | sí |
| **Esquema físico** | almacenamiento | sí |

El diagrama tiene además una flecha desde **Sistema de Archivos** al almacenamiento: el destino final
puede no ser una base de datos.

## Slide 7 · Modelo conceptual de datos

- Se destaca el **Modelo de Entidades y Relaciones** (Modelo E/R — **MER**), propuesto por **Chen en
  dos artículos ya icónicos, 1976 y 1977**.
- Según Chen, *"El Modelo E/R puede ser usado como una base para una vista unificada de los datos"*,
  adoptando *"el enfoque más natural del mundo real que consiste en entidades e interrelaciones
  (relaciones)"*.
- Otros autores lo extendieron → familia de modelos, el **MER Extendido**.

> [!warning] Tres siglas para lo mismo
> Slide 7 dice **MERExt**, slide 8 dice **MERE**, el título de la clase dice **MER**. Las dos primeras
> son el modelo *extendido*. Conviene fijar una sola antes del parcial.

Referencia de Chen 1976 verificada contra la bibliografía de Date (ref. [14.6]):

> Peter Pin-Shan Chen, *"The Entity-Relationship Model—Toward a Unified View of Data"*,
> **ACM TODS 1, No. 1 (March 1976)**.

El segundo artículo (1977) no está identificado en ninguna fuente del vault.

## Slides 8–9 · Conceptos básicos y su representación

Los tres elementos estáticos que distinguía Chen:

| Elemento | Definición del deck | Símbolo |
| --- | --- | --- |
| **Entidad** | Objeto real o abstracto que existe en la realidad y acerca del cual se desea almacenar información | rectángulo |
| **Relación** *(o interrelación)* | Asociación o vinculación entre entidades | rombo |
| **Atributos** | Características de las entidades **y de las relaciones**, que proveen detalles descriptivos | línea + bolita |

*"Diferentes tipos de interrelaciones, entidades y características de los atributos conducen al
MERE."*

## Slides 10–13 · Entidades

El slide 10 da **cuatro definiciones alternativas**:

> - *"Cualquier objeto (real o abstracto) que existe en la realidad y acerca del cual queremos
>   almacenar información en la base de datos."*
> - *"Algo con realidad objetiva que existe o puede ser pensado."*
> - *"Una persona, lugar, cosa, concepto o suceso, real o abstracto, de interés para la empresa."*
> - *"Objetos (hechos, cosas, personas,…) que tienen propiedades en común y una existencia autónoma."*

> [!note] Por qué cuatro y no una
> Date, al comentar el paper original de Chen, dice que sus definiciones eran *"quite imprecise"* y
> que los términos del modelo E/R *"no parecen tener un único significado bien definido"*. El análisis
> está en **Date 14.6** *A Brief Analysis*.

**Conjunto entidad** (slide 11): está formado por **ejemplares o instancias**; cada una representa
simbólicamente un objeto del mundo real **distinguible entre otros**, descripto por sus propios
atributos. Ejemplo: `ALUMNO` (`LU`, `Nombre`, `Apellido`) con instancias `123, Carlos, Sánchez` ·
`124, Miguel, Rodríguez` · `125, José, González` · `126, Agustín, García`…

**Dos categorías** (slide 12):

| Categoría | Definición | Ejemplos del deck |
| --- | --- | --- |
| **Regulares o fuertes** | Sus ejemplares tienen **existencia por sí mismos** | `ALUMNO` |
| **Débiles** | La **identificación y existencia** de un ejemplar dependen de las de un ejemplar de otro tipo | `COPIA_LIBRO` ← `ORIGINAL_LIBRO` · `RENGLON_REMITO` ← `REMITO` · `PROVINCIA` ← `PAÍS` |

**Las tres propiedades inherentes** (slide 13):

1. **Tiene sentido que exista** (existencia propia), evaluado en el contexto de un sistema destinado a
   manejar información.
2. **Cada ejemplar debe poder distinguirse de los demás.**
3. **Todos los ejemplares deben tener las mismas propiedades.**

## Slides 14–19 · Atributos

Son los **datos relativos a una entidad o relación**. Cada uno tiene un **dominio de definición**
(entero, cadena, fecha…) y toma un valor dentro del dominio. **Se colocan junto a la entidad que
describen.**

| Eje | Valores | Ejemplo del deck |
| --- | --- | --- |
| **Presencia** | **obligatorio** (siempre hay valor) · **opcional** (puede estar ausente) | — |
| **Cardinalidad** | **univaluado** · **multivaluado** (conjunto de valores por instancia) | `Edad` · `Telefonos` |
| **Rol** | **identificador principal (IP)** · **identificador alternativo** · **descriptor** | `LU` · documento · `Nombre` |
| **Composición** | **simple** · **compuesto** (valor = concatenación de sus componentes) | `Nombre` · `Dirección`: calle, número, piso, dpto. |
| **Origen** | **nativo** · **derivado** (valor obtenido por cálculo desde otros atributos) | — · `edad`, desde fecha de nacimiento |

Definiciones textuales de los roles:

- **Identificador principal (IP):** identifica unívocamente cada uno de los ejemplares de la entidad.
- **Identificador alternativo:** otro identificador que puede cumplir el rol de IP.
- **Descriptor:** atributo que representa una característica de la entidad.

**Slide 18 — los atributos son el reverso de las propiedades de las entidades:**

- Todas las instancias se describen con el **mismo** conjunto de atributos → **3ª propiedad**.
- (Casi) siempre hay un atributo con valor distinto para cada instancia → **atributo identificador
  principal** (nro. de libreta, patente de un automóvil) → **2ª propiedad**.
- Algunas entidades tienen más de uno → **identificadores alternativos** → **2ª propiedad**.

**Slide 19 — ejemplo `ALUMNO`,** que junta todos los tipos a la vez:

| Atributo | Presencia | Cardinalidad | Rol | Composición |
| --- | --- | --- | --- | --- |
| `LU` | obligatorio | univaluado | **IP** | simple |
| `Nombre` | obligatorio | univaluado | descriptor | simple |
| `Apellido` | obligatorio | univaluado | descriptor | simple |
| `Telefonos` | **opcional** | **multivaluado** | descriptor | simple |
| `Tutor` | **opcional** | univaluado | descriptor | simple |
| `e-mails` | obligatorio | **multivaluado** | descriptor | simple |
| `Dirección` | obligatorio | univaluado | descriptor | **compuesto** → `Calle`, `Número` |

Y la regla: **cada conjunto de entidades debe tener al menos un identificador principal**, y **ese IP
podría ser un atributo compuesto**.

> [!question] Dos preguntas que el slide deja abiertas, en rojo
> *"¿Podría el IP ser un atributo multivaluado?"* · *"¿Podría ser un atributo opcional?"*
>
> **Razonamiento propio, no está en el deck:** las dos, **no**, por la 2ª propiedad de las entidades.
> Si fuera opcional habría ejemplares sin identificador; si fuera multivaluado, la correspondencia
> ejemplar ↔ identificador dejaría de ser unívoca. Compuesto sí, porque sigue teniendo **un solo
> valor** por instancia. **Confirmar en clase.**

## Slide 20 · Ejercicio del deck

Identificar **de forma precisa** entidades y atributos. Es la misma consigna que el **TP 1**:

> *"Se quiere registrar información para un sistema de compras de productos que realizan clientes de
> un negocio."*
>
> 1. Se necesita guardar los datos de los clientes, los mismos son: un identificador, nombre y
>    apellido, fecha de nacimiento, dirección y su teléfono.
> 2. **Opcionalmente** una persona pueda tener otro número de teléfono y **varios** números de
>    teléfono celular.
> 3. Los datos de las facturas que se registran son: su tipo y número (que identifica a cada factura),
>    su fecha, el cliente y el importe total. Además se necesita guardar los datos de los productos
>    que compondrán dicha factura.

Las palabras marcadas disparan cada eje: *"identificador"* → IP · *"tipo y número"* → IP compuesto ·
*"opcionalmente"* → opcional · *"varios"* → multivaluado · *"importe total"* → candidato a
**derivado**.

## Slides 21–25 · Relaciones (interrelaciones)

**Definición:** asociación, vinculación o correspondencia **entre conjuntos de entidades**, que se
materializa en un conjunto de asociaciones entre dos o más instancias del mismo o diferente tipo.

- **Conjunto relación:** el tipo de relación, la estructura genérica.
- **Instancia de relación:** cada ejemplar concreto.

**Slide 22 — ejemplo `CURSA`**, que vincula `ALUMNO` y `MATERIA`. Un ejemplar es la vinculación entre
el alumno `123, Carlos, Sánchez` y la materia `EdD, Estructuras de Datos`, **dado que satisface la
frase** *"123, Carlos Sánchez cursa la materia EdD, Estructuras de Datos"*.

**Slide 23 — características del tipo de relación:**

| Característica | Definición |
| --- | --- |
| **Nombre** | Al igual que las entidades, **debe ser único** |
| **Grado u <u>orden</u>** | Número de tipos de entidades que participan |
| **Tipo de correspondencia o <u>cardinalidad</u> o multiplicidad** | **Número máximo de ejemplares** de un tipo entidad que pueden estar asociados, en una determinada relación, con un ejemplar de otro(s) |
| **Atributos propios** | Una relación **puede tener atributos propios** |

*"Los términos más usuales son los subrayados"* → **orden** y **cardinalidad**.

**Slide 24 — orden:** una relación `R` de orden `n` relaciona `n` conjuntos de entidades `E₁ … Eₙ`.
`n=1` **UNARIA** · `n=2` **BINARIA** · `n=3` **TERNARIA**.

**Slide 25 — tipos de correspondencia:** uno a uno **1:1** · uno a muchos **1:N** · muchos a muchos
**N:N**.

## Slides 26–27 · Cardinalidades

> [!important] Se leen **Look-Across (LA)** — cruzado
> Textual del slide 26: *"La lectura que se hace de las cardinalidades se denomina **Look-Across (LA)**
> o Chen-Style, se lee sobre la línea de la 'entidad destino'"*, con la pregunta guía: *"¿Cuántos
> ejemplares de la entidad E1 pueden relacionarse con cada ejemplar de la entidad E2, como máximo y
> como mínimo?"*
>
> En la práctica: **el par `(mín,máx)` pegado a una entidad cuenta ejemplares de *esa* entidad, por
> cada ejemplar de la *otra*.** Es lo contrario de la convención min-max de Merise y de UML, que se
> escriben igual → comparación en [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

La información se coloca **sobre los vínculos**, entre paréntesis:

```
E1 ──(0,N)──◇ ESTA RELAC ◇──(1,1)── E2
```

**Cardinalidad máxima** — máximo número de ejemplares de una entidad con los que se puede relacionar
otra:

- *"al menos **1** (puede ser 0 o 1)"* ← **textual del slide**
- como máximo **N** (muchos o varios, cantidad variable)
- como máximo **a** (cantidad fija)

> [!bug] El primer ítem parece un error del slide
> Dice *"al menos 1"* dentro de la **máxima**, y la aclaración *"puede ser 0 o 1"* corresponde a un
> máximo. Probablemente quiso decir *"como máximo 1"*. **Verificar en clase.**

**Cardinalidad mínima** — mínimo número de ejemplares:

| Mínimo | Significado |
| --- | --- |
| **0** | Un ejemplar **puede** estar relacionado con otro |
| **1** | Un ejemplar **debe** estar relacionado al menos con un ejemplar |
| **a** | Un ejemplar **debe** estar relacionado al menos con **a** ejemplares |

## Slides 28–30 · Un ejemplo por tipo

**Unaria (reflexiva / recursiva)** — `PIEZA` (`CodPieza`, `Descripcion`, `Precio`) con `FORMA PARTE`,
`(0,N)` de los dos lados:

- Cada **pieza** forma-parte de otra u otras **piezas**.
- Cada **pieza** está-formada-por otra u otras **piezas**.
- *"Notar que se describe con hechos afirmativos."*

**Binaria 1:N** — `CARRERA (*,N) ─ PERTENECE ─ (*,1) DEPARTAMENTO`:

- Cada **carrera** pertenece a un **único** departamento.
- Cada **departamento** posee **muchas** carreras.

**Binaria N:N** — `ALUMNO (*,N) ─ PRACTICA ─ (*,N) DEPORTE`:

- Cada **alumno** practica varios **deportes**.
- Cada **deporte** es practicado por varios **alumnos**.

## Slides 31–33 · Opcionales vs. obligatorias

Con `(0,N)` de los dos lados *"sólo se ha indicado que un deporte podría ser practicado por varios
alumnos y que un alumno podría practicar varios deportes… **los casos más restrictivos no están
representados**"*.

> [!tip] El `*` es un placeholder, no un valor
> Slide 32: *"los casos más restrictivos se indican donde figura el `*`"*. Marca el **mínimo todavía
> sin decidir**; el ejercicio es reemplazarlo por 0 o 1 según la semántica del enunciado.

Resuelto (slide 33) — `ALUMNO (0,N) ─ PRACTICA ─ (1,N) DEPORTE`:

- Un alumno practica **al menos** un deporte y podría practicar **varios**.
- Un deporte **podría no ser practicado por ningún** alumno, pero puede serlo por **uno o más**.

> En la cardinalidad mínima, **0 indica OPCIONALIDAD** y **1 indica OBLIGATORIEDAD** (relación
> *mandatoria*).

> [!note] Este ejemplo es el que confirma el look-across
> El `(1,N)` está pegado a `DEPORTE` y sin embargo la frase que restringe es *"un alumno practica al
> menos un deporte"*. Con lectura min-max clásica diría lo otro. Los tres ejemplos del deck son
> consistentes entre sí con la lectura cruzada.

## Slide 34 · Relación entidad débil ↔ entidad fuerte

- Una **entidad débil** puede ser unívocamente identificada **sólo en el contexto de otra entidad
  fuerte o propietaria**.
- Están vinculadas por una **relación binaria (1,1):(\*,N)**. **Siempre la cardinalidad del lado 1 es
  1** *(el slide pregunta "¿Por qué?" y no lo responde)*.
- La débil tiene **dependencia de existencia** y **de identificación** respecto de la fuerte.

Ejemplo: `CAMPO (1,1) ─ TIENE ─ (0,N) PARCELA`, con `PARCELA` en **doble rectángulo** y la línea de la
relación duplicada. `CAMPO`: `IdCampo`, `NombreCampo`. `PARCELA`: `NroParcela`, `Superficie`,
`UltimoCultivo`.

Cierra con *"¿cómo se representa la dependencia de identificación? → **esquema lógico**"* — es decir,
la [[Clase 03 - Derivación a Esquema Lógico]].

> [!note] La razón del "(1,1) siempre" — razonamiento propio
> Con 0 fuertes no habría de dónde tomar la parte prestada del identificador; con 2 o más, el
> identificador no sería único.

## Slide 35 · Jerarquías (relaciones ES-UN o ISA)

Vocabulario **supertipo** / **subtipo**:

```
PRODUCTO (IdProducto, Descripcion, Marca)
    │ <Tipo>                          ← jerarquía exclusiva
    ├── SOLIDO (CantxPaq)
    └── LIQUIDO (CuidadoManip)
            │                         ← jerarquía compartida
            ├── ENVASADO (Presentacion)
            └── A_GRANEL (CantMinima)
```

- Un subtipo puede a su vez ser supertipo de otros.
- `<Tipo>` es el **discriminador**.
- El deck rotula **jerarquía exclusiva** y **compartida** y menciona **participación total o parcial**,
  pero **no define ninguno de los tres términos**.
- Cierra igual: *"¿Cómo representar los distintos casos? → **esquema lógico**"*.

## Slide 36 · Construcción del MER

> [!quote] La advertencia con la que abre
> *"No existen reglas que indiquen cómo construir un modelo de datos, sólo principios generales a
> aplicar junto al criterio del diseñador experimentado."*

1. **Interpretar las frases en lenguaje natural** del relevamiento, identificando cuáles son las
   *entidades* y cuáles las *relaciones*.
2. **Heurísticas de Chen:** un **sustantivo** en general es una entidad, **aunque podría ser un
   atributo** (*"los <u>ALUMNOS</u> cursan <u>MATERIAS</u>"*); un **verbo o frase verbal** puede
   indicar una **relación** (*"los alumnos <u>CURSAN</u> materias"*).
3. **¿Qué información debería registrarse?** → determinar los **atributos**, de entidades y de
   relaciones.
4. Para **relaciones más complejas** (ternarias, agregaciones), la experiencia del diseñador, las
   herramientas y el **conocimiento de las transformaciones en esquemas equivalentes** son un recurso
   fundamental.

Checklist operativo derivado de esto: [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] § checklist.

---

## Notación del deck

Slides 9, 14, 15, 16 y 34. Comparación con Garcia-Molina y Date en [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

![Bloques constructivos del MER: entidades y atributos](../assets/mer-bloques-entidades-atributos.png)

![Bloques constructivos del MER: relaciones y cardinalidades](../assets/mer-bloques-relaciones.png)

![Bloques constructivos del MER: entidad débil y jerarquías](../assets/mer-bloques-casos-especiales.png)

Los mismos bloques en tabla, por si hace falta buscarlos por texto:

| Elemento | Símbolo |
| --- | --- |
| Entidad | rectángulo con `NOMBRE_ENTIDAD` |
| Entidad **débil** | **doble** rectángulo |
| Relación | rombo con el nombre |
| Relación con entidad débil | línea **duplicada** hacia la entidad débil |
| Atributo | línea terminada en **bolita** |
| Atributo obligatorio / opcional | línea **continua** / **punteada** |
| Atributo univaluado / multivaluado | línea simple / terminada en **pata de gallo** (`>`) |
| IP / alternativo / descriptor | bolita **rellena** ● / **mitad** ◐ / **vacía** ○ |
| Atributo compuesto | bolita de la que **cuelgan** sus componentes |
| Cardinalidad | par `(mín,máx)` sobre la línea, leído **look-across** |
| Jerarquía | línea desde el supertipo con el discriminador entre `< >` |
| **Origen** (nativo/derivado) | **sin símbolo** — el deck define el concepto y nada más |

## Dudas abiertas

- [ ] **¿Qué distingue una jerarquía *exclusiva* de una *compartida*?** Hipótesis: exclusiva =
      subtipos **disjuntos**; compartida = **solapados**.
- [ ] **¿Qué es la *participación total o parcial*?** Hipótesis: total = todo ejemplar del supertipo
      cae en algún subtipo; parcial = puede no caer en ninguno.
- [ ] ¿El IP puede ser multivaluado u opcional? (slide 19, sin responder — razonamiento arriba).
- [ ] ¿La cardinalidad máxima *"al menos 1"* del slide 27 es un tipeo por *"como máximo 1"*?
- [ ] ¿Cuál es la referencia exacta del **segundo artículo de Chen (1977)**?
- [ ] ¿El parcial exige la notación de la cátedra o acepta cualquiera? *(El TP 1 pide notación libre.)*

## Enlaces

- Clase anterior: [[Clase 01 - Introducción_BasesDeDatos]] · clase siguiente: [[Clase 03 - Derivación a Esquema Lógico]]
- Práctica correspondiente: [[Práctica 2026-08-04]]
- Conceptos: [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] · [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]]
- Índice de clases: [[_index-clases]] · calendario: [[_cronograma]]
- Bibliografía: [[_index-bibliografia]] § 2.bis (mapeo del deck `BD2_Clase 02`)
