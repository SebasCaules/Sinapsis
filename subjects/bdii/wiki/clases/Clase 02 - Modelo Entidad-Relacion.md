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

## Resumen general

El Modelo de Entidades y Relaciones (MER) de Chen (1976) es el modelo conceptual con el que empieza
todo diseño de datos en la cursada: se construye **sin DBMS** y pasa al esquema lógico recién en la
Clase 03. El deck sigue los apuntes de Ale y Dejean (UBA), y su notación no coincide con la de ningún
libro del vault; el TP 1 acepta notación libre y no está confirmado qué exige el parcial.

Tres constructos: **entidades** (fuertes o débiles; tiene sentido que existan, cada ejemplar se
distingue de los demás y todos comparten las mismas propiedades), **atributos** (cinco ejes:
presencia, cardinalidad, rol, composición y origen) y **relaciones** (nombre único, orden unaria,
binaria o ternaria, cardinalidad 1:1, 1:N o N:N, y posibles atributos propios).

Lo que hay que saber:

- Toda entidad necesita al menos un identificador principal, que puede ser compuesto.
- Las cardinalidades `(mín,máx)` se leen **look-across**: el par pegado a una entidad cuenta ejemplares
  de *esa* entidad por cada ejemplar de la *otra*, al revés que en Merise y UML.
- Primero el máximo (1, N o una cantidad fija), después el mínimo: 0 es opcional, 1 es obligatorio.
  El `*` de los ejemplos es un mínimo pendiente, no un valor.
- La entidad débil se une a su fuerte con una relación (1,1):(\*,N); el lado de la fuerte es siempre
  (1,1).
- Las jerarquías ES-UN se rotulan exclusivas o compartidas, con participación total o parcial; el
  deck no define esos términos.

Para el parcial: la heurística de Chen (sustantivo → entidad o atributo, verbo → relación), la tabla
de atributos de `ALUMNO` como plantilla de clasificación y la lectura cruzada de cardinalidades sobre
`ALUMNO`–`PRACTICA`–`DEPORTE`. Notación y checklist de modelado:
[[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

## Fuente

> [!info] Fuente
> `raw/Unidad-01/Teorica/BD2_Clase 02 - Modelo Entidad-Relacion.pdf` · **36 slides** · teórica virtual
> del lunes 03/08 (una de varias clases de esa fecha; índice en [[_index-clases]]).
> Se practica con `ITBA TP 1 Modelos_Diagramas.pdf` → [[Práctica 2026-08-04]].
> Bibliografía: [[_index-bibliografia]] § 2.bis (mapeo del deck `BD2_Clase 02`).
> Fuente declarada por el deck (slide 2): *"Apuntes de Cátedra. Bases de Datos. Prof. J. Ale y G.
> Dejean. Fac. Ingeniería UBA."* Por eso su notación no coincide con ningún libro del vault.

---

## Slides 2–3 · Representación de la información

**La estructura y el contexto le dan *significado* a los datos.** El lenguaje natural es la forma
primaria de representación, pero **no es el mejor medio**: fórmulas, mapas y partituras son
**modelos** de representación simbólica. Un estudiante puede simbolizarse así:

```
<LU: 123456; Nombre y Apellido: Juan Torres; Fecha nacimiento: 23/08/1995; carrera: Ing en Sistemas>
```

La notación con solo los valores es la **TUPLA o REGISTRO**:

```
<123456; Juan Torres; 23/08/1995; Ing en Sistemas>
```

y la interpretación de esos valores vale para todas las tuplas por igual:

```
<LU; Nombre y Apellido; Fecha nacimiento; carrera>
```

## Slides 4–5 · Modelo de datos y modelado

**Slide 4** — un modelo de datos es una **herramienta intelectual** para plasmar una interpretación de
aspectos del mundo real: tiene **poder expresivo** (representa cómo se relacionan los datos) y es
**abstracto** (mínimamente perturbable ante la evolución del mundo real). Muestra el *contenido de
información* de los datos, no sus valores individuales.

**Slide 5** — **modelar** es organizar los datos para representar una situación del mundo real con la
mayor fidelidad posible, atendiendo solo a la información **relevante**. Esas características se
describen con enunciaciones generales; **un conjunto formal y consistente de tales enunciaciones
define un *modelo conceptual de datos*.**

## Slide 6 · Etapas en el diseño de datos

Página completa: [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]].

```
UdeD ──▶ Diseño Conceptual ──▶ Diseño Lógico ──▶ Almacenamiento (Base de Datos)
  ▲  Temprano │ Tardío  ▲
  │  ── sin DBMS │ con DBMS ──  │
  Ingeniería de  Normalización y Depuración  Esquema Físico
  Requisitos  + Esquema Conceptual
  Esq. Lógico Genérico │ Esq. Lógico Específico
```

Esquema conceptual y esquema lógico genérico (diseño lógico *temprano*) se hacen **sin DBMS**; esquema
lógico específico (*tardío*) y esquema físico, con DBMS. La flecha desde **Sistema de Archivos**
recuerda que el destino final puede no ser una base de datos.

## Slide 7 · Modelo conceptual de datos

Se destaca el **Modelo de Entidades y Relaciones** (Modelo E/R, **MER**), propuesto por **Chen en dos
artículos ya icónicos, 1976 y 1977**: *"El Modelo E/R puede ser usado como una base para una vista
unificada de los datos"*, con *"el enfoque más natural del mundo real que consiste en entidades e
interrelaciones (relaciones)"*. Las extensiones de otros autores forman el **MER Extendido**.

> [!warning] Tres siglas para lo mismo
> Slide 7 dice **MERExt**, slide 8 dice **MERE**, el título de la clase dice **MER**. Las dos primeras
> son el modelo *extendido*. Conviene fijar una sola antes del parcial.

Referencia de 1976, verificada contra la bibliografía de Date (ref. [14.6]): Peter Pin-Shan Chen,
*"The Entity-Relationship Model—Toward a Unified View of Data"*, **ACM TODS 1, No. 1 (March 1976)**.
El artículo de 1977 no está identificado en ninguna fuente del vault.

## Slides 8–9 · Conceptos básicos y su representación

Los tres elementos estáticos de Chen; *"diferentes tipos de interrelaciones, entidades y
características de los atributos conducen al MERE"*:

- **Entidad** (rectángulo): objeto real o abstracto que existe en la realidad y acerca del cual se
  desea almacenar información.
- **Relación** o *interrelación* (rombo): asociación o vinculación entre entidades.
- **Atributos** (línea + bolita): características de las entidades **y de las relaciones**, que
  proveen detalles descriptivos.

## Slides 10–13 · Entidades

El slide 10 da **cuatro definiciones alternativas**:

> - *"Cualquier objeto (real o abstracto) que existe en la realidad y acerca del cual queremos
> almacenar información en la base de datos."*
> - *"Algo con realidad objetiva que existe o puede ser pensado."*
> - *"Una persona, lugar, cosa, concepto o suceso, real o abstracto, de interés para la empresa."*
> - *"Objetos (hechos, cosas, personas,…) que tienen propiedades en común y una existencia autónoma."*

> [!note] Por qué cuatro y no una
> Date dice que las definiciones del paper de Chen eran *"quite imprecise"* y que los términos del
> modelo E/R *"no parecen tener un único significado bien definido"* (**Date 14.6**, *A Brief
> Analysis*).

Un **conjunto entidad** (slide 11) está formado por **ejemplares o instancias**, cada uno
**distinguible entre otros** y descripto por sus atributos: `ALUMNO` (`LU`, `Nombre`, `Apellido`) con
instancias `123, Carlos, Sánchez` · `124, Miguel, Rodríguez`…

**Dos categorías** (slide 12): **regulares o fuertes**, cuyos ejemplares tienen **existencia por sí
mismos** (`ALUMNO`), y **débiles**, cuya **identificación y existencia** dependen de las de un ejemplar
de otro tipo (`COPIA_LIBRO` ← `ORIGINAL_LIBRO` · `RENGLON_REMITO` ← `REMITO` · `PROVINCIA` ← `PAÍS`).

**Las tres propiedades inherentes** (slide 13):

1. **Tiene sentido que exista** (existencia propia), en el contexto de un sistema destinado a manejar
  información.
2. **Cada ejemplar debe poder distinguirse de los demás.**
3. **Todos los ejemplares deben tener las mismas propiedades.**

## Slides 14–19 · Atributos

Son los **datos relativos a una entidad o relación**; cada uno tiene un **dominio** (entero, cadena,
fecha…) y **se coloca junto a la entidad que describe**. Cinco ejes:

| Eje | Valores | Ejemplo del deck |
| --- | --- | --- |
| **Presencia** | **obligatorio** (siempre hay valor) · **opcional** (puede estar ausente) | — |
| **Cardinalidad** | **univaluado** · **multivaluado** (conjunto de valores por instancia) | `Edad` · `Telefonos` |
| **Rol** | **identificador principal (IP)**: identifica unívocamente cada ejemplar · **identificador alternativo**: otro que puede cumplir el rol de IP · **descriptor**: una característica | `LU` · documento · `Nombre` |
| **Composición** | **simple** · **compuesto** (valor = concatenación de sus componentes) | `Nombre` · `Dirección`: calle, número, piso, dpto. |
| **Origen** | **nativo** · **derivado** (valor obtenido por cálculo desde otros atributos) | — · `edad`, desde fecha de nacimiento |

**Slide 18** — los atributos son el reverso de las propiedades de las entidades: el **mismo** conjunto
de atributos para todas las instancias es la **3ª propiedad**; el **IP** (nro. de libreta, patente) y
los **identificadores alternativos** son la **2ª propiedad**.

**Slide 19** — ejemplo `ALUMNO`, que junta todos los tipos a la vez:

| Atributo | Presencia | Cardinalidad | Rol | Composición |
| --- | --- | --- | --- | --- |
| `LU` | obligatorio | univaluado | **IP** | simple |
| `Nombre` | obligatorio | univaluado | descriptor | simple |
| `Apellido` | obligatorio | univaluado | descriptor | simple |
| `Telefonos` | **opcional** | **multivaluado** | descriptor | simple |
| `Tutor` | **opcional** | univaluado | descriptor | simple |
| `e-mails` | obligatorio | **multivaluado** | descriptor | simple |
| `Dirección` | obligatorio | univaluado | descriptor | **compuesto** → `Calle`, `Número` |

Regla: **cada conjunto de entidades debe tener al menos un identificador principal**, que **podría ser
compuesto**.

> [!question] Dos preguntas que el slide 19 deja abiertas, en rojo
> *"¿Podría el IP ser un atributo multivaluado?"* · *"¿Podría ser un atributo opcional?"*
> **Razonamiento propio, no está en el deck:** las dos, **no**, por la 2ª propiedad: opcional dejaría
> ejemplares sin identificador; multivaluado rompería la correspondencia unívoca ejemplar ↔
> identificador. Compuesto sí: sigue siendo **un solo valor** por instancia. **Confirmar en clase.**

## Slide 20 · Ejercicio del deck

Identificar **de forma precisa** entidades y atributos; es la misma consigna que el **TP 1**:

> *"Se quiere registrar información para un sistema de compras de productos que realizan clientes de
> un negocio."*
>
> 1. Se necesita guardar los datos de los clientes, los mismos son: un identificador, nombre y
> apellido, fecha de nacimiento, dirección y su teléfono.
> 2. **Opcionalmente** una persona pueda tener otro número de teléfono y **varios** números de
> teléfono celular.
> 3. Los datos de las facturas que se registran son: su tipo y número (que identifica a cada factura),
> su fecha, el cliente y el importe total. Además se necesita guardar los datos de los productos
> que compondrán dicha factura.

Las palabras marcadas disparan cada eje: *"identificador"* → IP · *"tipo y número"* → IP compuesto ·
*"opcionalmente"* → opcional · *"varios"* → multivaluado · *"importe total"* → candidato a
**derivado**.

## Slides 21–25 · Relaciones (interrelaciones)

**Definición:** asociación, vinculación o correspondencia **entre conjuntos de entidades**, que se
materializa en asociaciones entre dos o más instancias del mismo o de diferente tipo. El **conjunto
relación** es el tipo; la **instancia de relación**, cada ejemplar. **Slide 22** — `CURSA` vincula
`ALUMNO` y `MATERIA`; un ejemplar une al alumno `123, Carlos, Sánchez` con la materia `EdD` **dado que
satisface la frase** *"123, Carlos Sánchez cursa la materia EdD, Estructuras de Datos"*.

**Slide 23** — características del tipo de relación:

- **Nombre:** al igual que las entidades, **debe ser único**.
- **Grado u <u>orden</u>:** número de tipos de entidades que participan.
- **Tipo de correspondencia o <u>cardinalidad</u> o multiplicidad:** **número máximo de ejemplares**
  de un tipo entidad que pueden estar asociados, en una determinada relación, con un ejemplar de
  otro(s).
- **Atributos propios:** una relación **puede tener atributos propios**.

*"Los términos más usuales son los subrayados"* → **orden** y **cardinalidad**. **Slide 24** — una
relación `R` de orden `n` relaciona `n` conjuntos de entidades `E₁ … Eₙ`: `n=1` **UNARIA** · `n=2`
**BINARIA** · `n=3` **TERNARIA**. **Slide 25** — tipos de correspondencia: **1:1** · **1:N** · **N:N**.

## Slides 26–27 · Cardinalidades

> [!important] Se leen **Look-Across (LA)** — cruzado
> Textual del slide 26: *"La lectura que se hace de las cardinalidades se denomina **Look-Across (LA)**
> o Chen-Style, se lee sobre la línea de la 'entidad destino'"*, con la pregunta guía: *"¿Cuántos
> ejemplares de la entidad E1 pueden relacionarse con cada ejemplar de la entidad E2, como máximo y
> como mínimo?"*
>
> En la práctica: **el par `(mín,máx)` pegado a una entidad cuenta ejemplares de *esa* entidad, por
> cada ejemplar de la *otra*.** Es lo contrario de la convención min-max de Merise y de UML, que se
> escriben igual → [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]].

La información se coloca **sobre los vínculos**, entre paréntesis:

```
E1 ──(0,N)──◇ ESTA RELAC ◇──(1,1)── E2
```

**Cardinalidad máxima** — máximo número de ejemplares de una entidad con los que se puede relacionar
otra: *"al menos **1** (puede ser 0 o 1)"* (textual del slide) · como máximo **N** (muchos o varios,
cantidad variable) · como máximo **a** (cantidad fija).

> [!bug] El primer ítem parece un error del slide
> *"Al menos 1"* dentro de la **máxima**, con una aclaración que corresponde a un máximo: probablemente
> quiso decir *"como máximo 1"*. **Verificar en clase.**

**Cardinalidad mínima** — mínimo número de ejemplares: **0**, un ejemplar **puede** estar relacionado
con otro · **1**, **debe** estar relacionado al menos con un ejemplar · **a**, **debe** estar
relacionado al menos con **a** ejemplares.

## Slides 28–30 · Un ejemplo por tipo

**Unaria (reflexiva / recursiva)** — `PIEZA` (`CodPieza`, `Descripcion`, `Precio`) con `FORMA PARTE`,
`(0,N)` de los dos lados: cada **pieza** forma-parte de otra u otras **piezas**, y cada **pieza**
está-formada-por otra u otras **piezas**. *"Notar que se describe con hechos afirmativos."*

**Binaria 1:N** — `CARRERA (*,N) ─ PERTENECE ─ (*,1) DEPARTAMENTO`: cada **carrera** pertenece a un
**único** departamento; cada **departamento** posee **muchas** carreras.

**Binaria N:N** — `ALUMNO (*,N) ─ PRACTICA ─ (*,N) DEPORTE`: cada **alumno** practica varios
**deportes**; cada **deporte** es practicado por varios **alumnos**.

## Slides 31–33 · Opcionales vs. obligatorias

Con `(0,N)` de los dos lados *"sólo se ha indicado que un deporte podría ser practicado por varios
alumnos y que un alumno podría practicar varios deportes… **los casos más restrictivos no están
representados**"*. Slide 32: *"los casos más restrictivos se indican donde figura el `*`"*: el `*` es
un **placeholder** del mínimo todavía sin decidir, que se reemplaza por 0 o 1 según el enunciado.

Resuelto (slide 33) — `ALUMNO (0,N) ─ PRACTICA ─ (1,N) DEPORTE`: un alumno practica **al menos** un
deporte y podría practicar **varios**; un deporte **podría no ser practicado por ningún** alumno, pero
puede serlo por **uno o más**. En la cardinalidad mínima, **0 indica OPCIONALIDAD** y **1 indica
OBLIGATORIEDAD** (relación *mandatoria*).

> [!note] Este ejemplo confirma el look-across
> El `(1,N)` está pegado a `DEPORTE` y sin embargo la frase que restringe es *"un alumno practica al
> menos un deporte"*; con lectura min-max clásica diría lo contrario. Los tres ejemplos del deck son
> consistentes con la lectura cruzada.

## Slide 34 · Relación entidad débil ↔ entidad fuerte

Una **entidad débil** puede ser unívocamente identificada **sólo en el contexto de otra entidad fuerte
o propietaria**: tiene **dependencia de existencia** y **de identificación** respecto de ella. Están
vinculadas por una **relación binaria (1,1):(\*,N)**, y **siempre la cardinalidad del lado 1 es 1** —
el slide pregunta "¿Por qué?" y no lo responde; razonamiento propio: con 0 fuertes no habría de dónde
tomar la parte prestada del identificador, y con 2 o más no sería único.

Ejemplo: `CAMPO (1,1) ─ TIENE ─ (0,N) PARCELA`, con `PARCELA` en **doble rectángulo** y la línea de la
relación duplicada. `CAMPO`: `IdCampo`, `NombreCampo`. `PARCELA`: `NroParcela`, `Superficie`,
`UltimoCultivo`. Cierra con *"¿cómo se representa la dependencia de identificación? → **esquema
lógico**"*: [[Clase 03 - Derivación a Esquema Lógico]].

## Slide 35 · Jerarquías (relaciones ES-UN o ISA)

Vocabulario **supertipo** / **subtipo**; `<Tipo>` es el **discriminador**, y un subtipo puede a su vez
ser supertipo de otros.

```
PRODUCTO (IdProducto, Descripcion, Marca)
  │ <Tipo> ← jerarquía exclusiva
  ├── SOLIDO (CantxPaq)
  └── LIQUIDO (CuidadoManip)
  │  ← jerarquía compartida
  ├── ENVASADO (Presentacion)
  └── A_GRANEL (CantMinima)
```

El deck rotula **jerarquía exclusiva** y **compartida** y menciona **participación total o parcial**,
pero **no define ninguno de los tres términos**. Cierra igual: *"¿Cómo representar los distintos
casos? → **esquema lógico**"*.

## Slide 36 · Construcción del MER

> [!quote] La advertencia con la que abre
> *"No existen reglas que indiquen cómo construir un modelo de datos, sólo principios generales a
> aplicar junto al criterio del diseñador experimentado."*

1. **Interpretar las frases en lenguaje natural** del relevamiento, identificando *entidades* y
  *relaciones*.
2. **Heurísticas de Chen:** un **sustantivo** en general es una entidad, **aunque podría ser un
  atributo** (*"los <u>ALUMNOS</u> cursan <u>MATERIAS</u>"*); un **verbo o frase verbal** puede
  indicar una **relación** (*"los alumnos <u>CURSAN</u> materias"*).
3. **¿Qué información debería registrarse?** → los **atributos**, de entidades y de relaciones.
4. Para **relaciones más complejas** (ternarias, agregaciones): experiencia del diseñador,
  herramientas y **conocimiento de las transformaciones en esquemas equivalentes**.

Checklist operativo: [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] § checklist.

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

- [ ] ¿Qué distingue una jerarquía *exclusiva* de una *compartida*? (¿subtipos disjuntos vs. solapados?)
- [ ] ¿Qué es la *participación total o parcial*? (¿todo ejemplar del supertipo cae en algún subtipo?)
- [ ] ¿El IP puede ser multivaluado u opcional? (slide 19, sin responder; razonamiento arriba).
- [ ] ¿La cardinalidad máxima *"al menos 1"* del slide 27 es un tipeo por *"como máximo 1"*?
- [ ] ¿Cuál es la referencia exacta del **segundo artículo de Chen (1977)**?
- [ ] ¿El parcial exige la notación de la cátedra o acepta cualquiera? *(El TP 1 pide notación libre.)*

## Enlaces

- Clase anterior: [[Clase 01 - Introducción_BasesDeDatos]] · clase siguiente: [[Clase 03 - Derivación a Esquema Lógico]]
- Práctica correspondiente: [[Práctica 2026-08-04]]
- Conceptos: [[1.02.02 - Modelo Entidad-Relación|Modelo Entidad-Relación]] · [[1.02.01 - Etapas del diseño de datos|Etapas del diseño de datos]]
- Índice de clases: [[_index-clases]] · calendario: [[_cronograma]]
- Bibliografía: [[_index-bibliografia]] § 2.bis (mapeo del deck `BD2_Clase 02`)
