---
titulo: Efluentes gaseosos y toxicidad
tipo: concepto
modulo: [2]
clase: []
division: "2"
tags: [efluentes, efluentes-gaseosos, aire, toxicidad, adme, material-particulado, scrubbers, biofiltros]
fuentes: [guia-parcial-2-ambiental, preguntas-ambiental-2017, finales-soa-compilado]
actualizado: 2026-08-25
estado: en-desarrollo
aliases: [efluentes-gaseosos, toxicidad, adme, scrubbers, biofiltros, carbon-activado]
resumen: 'Dos preguntas que cierran el bloque de efluentes por los dos extremos: con qué se depura una corriente gaseosa —cuatro tecnologías, una por tipo de contaminante— y cómo se estudia lo que una sustancia le hace a un organismo cuando la depuración falla: los cuatro aspectos absorción, distribución, metabolismo y excreción (ADME).'
---

> [!warning] Contenido de fuente de alumno, no de cátedra
> Las **preguntas** de este bloque son de cátedra ([[guia-parcial-2-ambiental]], guía oficial del
> parcial 2). Las **respuestas** son de [[preguntas-ambiental-2017]], un resumen de alumno de 2017.
> La cátedra **todavía no dictó el módulo 2 en la cursada 2026**: nada de acá está confirmado
> contra un soporte de clase. Cuando el módulo arranque, hay que cotejar y anotar las diferencias
> en [[contradicciones]].

## En una línea

Dos preguntas que cierran el bloque de efluentes por los dos extremos: **con qué se depura una
corriente gaseosa** —cuatro tecnologías, una por tipo de contaminante— y **cómo se estudia lo que
una sustancia le hace a un organismo** cuando la depuración falla: los cuatro aspectos
**absorción, distribución, metabolismo y excreción (ADME)**.

> [!note] Por qué estos dos temas comparten página
> No tienen mucho en común más allá de ser **las dos preguntas del bloque de efluentes (11–30) que
> no son de efluentes líquidos**: la 27 (toxicidad) y la 30 (gaseosos). Es el reparto que fija la
> tabla de mapeo de [[guia-parcial-2-ambiental]]. Hay, eso sí, un hilo real que las une, y es el que
> desarrolla la sección final: **el efluente gaseoso es la vía por la que un contaminante entra a un
> organismo por inhalación**, que es el primer paso del ADME.

---

# Parte 1 — Tecnologías para efluentes gaseosos (preg. 30)

> "¿Conoce alguna tecnología disponible para tratar efluentes gaseosos?" (Guía Parcial 2, preg. 30)

La respuesta empieza por **de dónde salen** esas corrientes: "para depurar los efluentes gaseosos
que provienen **del resto del tratamiento** o de **producción** (fase líquida o sólida)"
(Preguntas Ambiental 2017, p. 9). O sea: no sólo los gases de chimenea de un proceso productivo,
también los que genera **la propia planta de tratamiento de efluentes líquidos** — la salida
`GASES` del diagrama de bloques de [[tratamiento-de-efluentes-liquidos]].

## Las cuatro tecnologías, y para qué sirve cada una

| Tecnología | Para qué contaminante | Qué principio usa |
|---|---|---|
| **Ciclones y filtros** | **Material particulado** | Separación **física**: el ciclón por fuerza centrífuga, el filtro por retención mecánica |
| **Biofiltros húmedos** | **Volátiles biodegradables** | **Biológico**: microorganismos que degradan el contaminante, igual que un secundario aeróbico pero sobre una corriente de aire |
| **Scrubbers** (lavadores de gases) | Gases solubles | **Absorción en fase líquida**: la fuente los rotula "tecno absorción f. líquida" — el gas se pone en contacto con un líquido que lo captura |
| **Columnas de carbón activado** | Orgánicos volátiles, olores | **Adsorción** sobre la superficie del carbón |

(Preguntas Ambiental 2017, p. 9. La fuente da los cuatro nombres con el contaminante entre
paréntesis, en cuatro viñetas.)

> [!important] Las cuatro no son intercambiables: cada una ataca un estado distinto del contaminante
> Ordenadas por **qué hay en el gas**, que es como conviene recordarlas:
>
> - ¿El contaminante es **sólido en suspensión**? → **ciclones y filtros**.
> - ¿Es **gas y lo comen bacterias**? → **biofiltro húmedo**.
> - ¿Es **gas y se disuelve**? → **scrubber**.
> - ¿Es **gas, no se disuelve y no lo comen**? → **carbón activado**.
>
> Es la misma lógica de decisión que en [[tratamiento-de-efluentes-liquidos]]: primero se pregunta
> **qué es la suciedad**, después se elige la tecnología. La fuente da la lista pero **no arma este
> árbol de decisión**; el ordenamiento es de esta wiki.
>
> > **Inferencia:** los criterios de "se disuelve" y "no lo comen" salen de leer para qué sirve cada
> > tecnología según la propia fuente (absorción en fase líquida = solubilidad; biofiltro =
> > biodegradable), no de una afirmación explícita.

> [!note] El paralelo exacto con la línea líquida
> Los **biofiltros húmedos** son, sobre una corriente de aire, lo mismo que el secundario biológico
> aeróbico sobre una corriente de agua: microorganismos comiendo suciedad biodegradable. Y de hecho
> "biofiltros" aparece también en la matriz de tecnologías del secundario líquido, en la fila de
> microorganismos adheridos (Preguntas Ambiental 2017, p. 4). La misma palabra en las dos líneas.
>
> Y el criterio de **biodegradabilidad** vuelve a ser el que parte las aguas: si el volátil es
> biodegradable va a biofiltro, si no, a scrubber o a carbón activado. Ver
> [[dqo-dbo-y-biodegradabilidad]].

> [!warning] La fuente da cuatro nombres y **ni una línea de desarrollo**
> No explica cómo funciona un ciclón, ni qué líquido usa un scrubber, ni cuándo se regenera el
> carbón, ni qué se hace con lo que cada equipo retiene. Si el parcial pide "mencione tecnologías",
> la tabla de arriba alcanza; si pide explicarlas, esta wiki no tiene con qué. Anotado en
> [[huecos]].
>
> Falta también el corolario que sí importa: **ninguna de las cuatro destruye el contaminante, lo
> cambia de fase**. El filtro deja un polvo, el scrubber deja un líquido cargado, el carbón queda
> saturado. Esa corriente nueva hay que gestionarla, y la fuente no dice cómo. Es el mismo agujero
> que deja la preg. 26 con los barros.

### Material particulado

Es el contaminante que atacan ciclones y filtros, y tiene **pregunta propia** en la guía —la 61,
que se desarrolla en [[material-particulado]]—: *"¿Cómo puede generarse y qué daños provoca el
material particulado? ¿posee efectos beneficiosos para el ambiente?"* (Guía Parcial 2, preg. 61).

Que el mismo contaminante aparezca en dos bloques distintos —una vez como problema ambiental (61) y
otra como objeto de una tecnología de tratamiento (30)— es la señal de que conviene poder cruzarlos.

---

# Parte 2 — Los cuatro aspectos de la toxicidad (preg. 27)

> "¿Cuáles son los **cuatro aspectos** que se estudian respecto a la toxicidad de sustancias sobre
> el organismo?" (Guía Parcial 2, preg. 27)

La guía pide un número exacto —**cuatro**— y la respuesta es una lista cerrada. Es de las preguntas
más fáciles de contestar bien y de las más fáciles de contestar a medias.

| # | Aspecto | Qué estudia, según la fuente |
|---|---|---|
| 1 | **Absorción** | "Cómo **entran** al cuerpo" |
| 2 | **Distribución** | "Cómo se **distribuye** en el cuerpo" |
| 3 | **Metabolismo** | "Cómo se **incorpora** al organismo" |
| 4 | **Excreción** | "Cómo se **elimina / sale** del cuerpo" |

(Preguntas Ambiental 2017, p. 8)

> [!important] Los cuatro son **un recorrido**, no cuatro propiedades sueltas
> Entrada → reparto → transformación → salida. Es el ciclo completo de la sustancia **dentro** del
> organismo, y por eso el orden importa: se responde en ese orden o la respuesta pierde la lógica.
> En la literatura toxicológica el conjunto se conoce por la sigla **ADME** (*absorption,
> distribution, metabolism, excretion*), que la fuente **no usa** — el resumen enumera los cuatro
> en castellano sin nombrar la sigla. Ver [[glosario-es-en]].

> [!warning] La glosa de "metabolismo" que da la fuente es floja
> "Metabolismo (cómo se **incorpora** al organismo)" (Preguntas Ambiental 2017, p. 8) se pisa con la
> definición de absorción, que ya es "cómo entran al cuerpo". El propio ejemplo del selenio que la
> fuente desarrolla a continuación muestra otra cosa: bajo *Metabolismo* explica que el selenio en
> exceso **es metilado (CH₃·) para su excreción** — o sea, **cómo el organismo transforma
> químicamente la sustancia**, no cómo la incorpora.
>
> > **Inferencia:** la glosa correcta de "metabolismo" es la que se desprende del ejemplo —qué le
> > hace el cuerpo a la sustancia, químicamente— y no la que escribe la fuente. La wiki deja las dos
> > a la vista en vez de elegir en silencio: la de la fuente porque es lo que dice, y la del ejemplo
> > porque es lo que la fuente misma hace. Cuando la cátedra dicte el módulo hay que cotejar cuál
> > pide.

## El ejemplo: selenio

La fuente desarrolla los cuatro aspectos sobre una sustancia concreta, el **selenio** (Preguntas
Ambiental 2017, p. 8). Es el mejor material de la página, porque muestra qué nivel de detalle
espera cada casillero:

| Aspecto | Qué dice del selenio |
|---|---|
| **Absorción** | "Los estudios laborales indican que el organismo puede absorber **por inhalación** selenio en polvo y compuestos de selenio, pero no existen estudios toxicocinéticos cuantitativos que lo avalen". La **ingesta** de selenitos, selenatos y selenometionina "se absorbe fácilmente y en una fracción superior al **80 %** de la dosis administrada". Vía **dérmica**: los estudios no la indican para la selenometionina, "aunque sí se ha detectado en ratones"; el SeS₂ de los shampús anticaspa "parece no ser absorbido por la piel" |
| **Distribución** | "Se acumula en muchos órganos del cuerpo; con **máximos en el hígado y el riñón**. Sin embargo, la mayor o menor cantidad de selenio en los tejidos **no parece correlacionarse con sus efectos**". También hay en sangre, cabello y uñas; "se ha detectado incluso en la **leche materna** y puede transferirse por **vía placentaria**" |
| **Metabolismo** | "El selenio en exceso que se incorpora al organismo es **metilado (CH₃·)** para su excreción" |
| **Excreción** | "Se elimina principalmente por la **orina** y las **heces**, dependiendo la distribución entre ambas vías del **nivel de exposición** y el **tiempo transcurrido**". En **exposición aguda**, cantidades significativas salen "con la **respiración**, causando un característico **'aliento a ajo'**" |

> [!important] Tres cosas del ejemplo que valen para cualquier sustancia
> 1. **La absorción se estudia por vía**: inhalatoria, digestiva y dérmica, cada una por separado y
>    con evidencia distinta. Es la misma clasificación por **vías de ingreso** que el módulo 1 usa
>    para los contaminantes químicos — ver [[05-01-contaminantes-quimicos-y-cmp|contaminantes-quimicos-y-cmp]].
> 2. **Distribución alta no implica efecto alto.** El selenio se acumula en hígado y riñón y aun así
>    "no parece correlacionarse con sus efectos". Dónde se deposita y dónde daña son dos preguntas
>    distintas.
> 3. **La excreción no es sólo orina y heces.** El aliento a ajo del selenio es excreción por vía
>    respiratoria, y es además un **signo clínico**: la misma vía por la que el tóxico sale sirve
>    para detectar la exposición.

> [!note] "Se ha detectado en la leche materna y puede transferirse por vía placentaria"
> Es la línea con más consecuencias prácticas del ejemplo: la distribución **puede pasar de un
> organismo a otro**. En el módulo 1 eso tiene nombre y consecuencias legales
> ([[01-02-enfermedad-profesional]], [[dec-658-96]]); acá aparece como un dato toxicológico más.

## El puente con el módulo 1: el mismo problema, otro sujeto

> [!important] Toxicidad ambiental y contaminantes químicos ocupacionales son **el mismo estudio
> visto desde dos lados**
>
> | | **Módulo 2 — ambiental** | **Módulo 1 — ocupacional** |
> |---|---|---|
> | **Sujeto expuesto** | El ambiente y la población en general | El **trabajador** |
> | **Pregunta central** | Qué le hace la sustancia al organismo: **ADME** | **Cuánta** sustancia se tolera: **CMP** |
> | **Instrumento** | Estudios toxicocinéticos | Límites de exposición: CMP, CMP-CPT, CMP-C |
> | **Intervención** | Depurar el efluente antes de emitirlo | Ventilación, aislamiento, EPP — [[02-06-jerarquia-de-controles]] |
>
> La página de referencia del módulo 1 es [[05-01-contaminantes-quimicos-y-cmp|contaminantes-quimicos-y-cmp]]: misma sustancia, misma
> vía de ingreso, misma toxicología — y una **concentración máxima permisible** en vez de un perfil
> ADME. Es literalmente el mismo problema medido con otra vara.
>
> > **Inferencia:** el puente lo arma esta wiki. Ninguna de las dos fuentes del módulo 2 menciona
> > las CMP, y ninguna fuente del módulo 1 menciona el ADME.

Y hay un detalle del propio ejemplo que lo confirma: la fuente escribe *"los estudios **laborales**
indican que el organismo puede absorber por inhalación selenio en polvo"* (p. 8). La toxicología
ambiental **se apoya en datos de exposición ocupacional** — es en el trabajo donde la gente está
expuesta a concentraciones medibles, y de ahí salen los estudios que después se usan para pensar la
exposición ambiental.

---

## En la materia

**Módulo 2 — Medio Ambiente** ([[modulo-2-ambiente]]), bloque de **tratamiento de efluentes**
(preg. 11–30 de la guía de cátedra).

**Preguntas de la guía que esta página cubre — dos:**

| Preg. | Qué pide | Dónde está |
|---|---|---|
| **27** | Los **cuatro aspectos** que se estudian sobre la toxicidad de sustancias en el organismo | *Parte 2 — Los cuatro aspectos de la toxicidad* |
| **30** | Tecnologías disponibles para tratar **efluentes gaseosos** | *Parte 1 — Tecnologías para efluentes gaseosos* |

Las dos son **preguntas de enumeración**: la 27 pide cuatro ítems y la 30 pide "alguna tecnología".
Son de las más baratas de la guía en relación esfuerzo/puntos, y de las que más se pierden por
contestar tres de cuatro.

**¿Aparece en algún final del compilado?** Hay que separar los dos temas:

- **Tecnologías para efluentes gaseosos: no.** Se revisó [[finales-soa-compilado]] entero: ni
  ciclones, ni biofiltros, ni scrubbers, ni carbón activado aparecen en ningún final. Sí aparece la
  **definición de "efluente"**, en la explicación de la pregunta 15: *"los residuos pueden ser en
  los tres estados de la materia. Los líquidos y gaseosos se llaman **efluentes**"* (Finales SOA,
  p. 9). Ver [[residuos-peligrosos]].
- **Material particulado: sí, y con respuesta desarrollada.** En la Sección Ambiental del compilado,
  pregunta 3: *"El material particulado en el aire puede ser **natural** (incendios forestales,
  actividad volcánica) o por **actividades humanas**. Un efecto **bueno** es que permite que
  llueva"* (Finales SOA, p. 21). Es el mismo contenido que la preg. 61 de la guía —origen, daños y
  efectos beneficiosos—, y **se toma**. Ver [[material-particulado]].
- **Los cuatro aspectos de toxicidad (ADME): no.** Pero **sí se toma su contraparte ocupacional**:
  la pregunta 2 del compilado es un ejercicio de asignar tres concentraciones (800, 200 y 250 ppm) a
  **CMP, CMP-CPT y CMP-C** (Finales SOA, p. 3), con la definición de CMP desarrollada en la
  explicación. Ver [[05-01-contaminantes-quimicos-y-cmp|contaminantes-quimicos-y-cmp]].

> [!important] La lectura conjunta: **el final toma la toxicidad por el lado del módulo 1**
> Sobre sustancias tóxicas, el compilado de finales no pregunta ADME: pregunta **CMP, CMP-CPT y
> CMP-C**. Eso no dice nada sobre el parcial 2 —que se toma con la guía, y la guía pregunta ADME en
> la 27—, pero sí dice algo sobre el **final integrador**: si en el final aparece una sustancia
> tóxica, lo más probable, según el compilado, es que venga con números de exposición ocupacional y
> no con farmacocinética. Ver [[evaluacion]].

---

## Relación con otros temas

- [[tratamiento-de-efluentes-liquidos]] — la línea líquida. Esta página es la salida `GASES` de su
  diagrama de bloques.
- [[dqo-dbo-y-biodegradabilidad]] — el criterio de biodegradabilidad, que también decide entre
  biofiltro y las tecnologías no biológicas.
- [[material-particulado]] — el contaminante que atacan ciclones y filtros; tiene pregunta propia
  (preg. 61) y **sí aparece en un final**.
- [[05-01-contaminantes-quimicos-y-cmp|contaminantes-quimicos-y-cmp]] — **el mismo problema visto desde el trabajador**: vías de
  ingreso, clasificación por acción y los tres límites de exposición (CMP, CMP-CPT, CMP-C).
- [[atmosfera-y-sus-capas]] y [[capa-de-ozono-e-inversion-termica]] — a dónde va el efluente gaseoso
  que se emite, y por qué una inversión térmica lo retiene cerca del suelo.
- [[contaminacion-y-polucion]] — la capacidad de autodepuración del aire.
- [[residuos-peligrosos]] — dónde termina lo que el filtro, el scrubber y el carbón retienen.
- [[01-02-enfermedad-profesional]] y [[dec-658-96]] — la consecuencia jurídica de la exposición
  crónica a un tóxico en el trabajo.
- [[02-06-jerarquia-de-controles]] — cómo se interviene: un scrubber es control de ingeniería;
  el respirador del operario es [[02-07-epp|EPP]], la escala más baja.
- [[iso-14001]] — las emisiones a la atmósfera son un aspecto ambiental típico de un sistema de
  gestión.
- [[guia-parcial-2-ambiental]] — las consignas 27 y 30.
- [[preguntas-ambiental-2017]] — las respuestas, y sus límites.
- [[banco-parcial-2-ambiental]] — el cruce pregunta ↔ respuesta ↔ concepto.
- [[modulo-2-ambiente]] — el hub del módulo.
- [[glosario-es-en]] — ADME (*absorption, distribution, metabolism, excretion*), lavador de gases
  (*scrubber*), carbón activado (*activated carbon*), material particulado (*particulate matter*).
- [[huecos]] — las cuatro tecnologías gaseosas quedan nombradas y sin explicar, y no hay fuente sobre
  qué se hace con lo que retienen.
- [[contradicciones]] — donde va la glosa de "metabolismo" que se pisa con la de "absorción".

## Fuentes

- (Guía Parcial 2, preg. 27 y 30) — [[guia-parcial-2-ambiental]], documento de cátedra.
  **Las consignas.**
- (Preguntas Ambiental 2017, pp. 8–9) — [[preguntas-ambiental-2017]], resumen de alumno.
  **Las respuestas**, incluido el desarrollo completo del ejemplo del selenio.
- (Finales SOA, pp. 3, 9 y 21) — [[finales-soa-compilado]], resumen de alumno. La pregunta 2 sobre
  CMP / CMP-CPT / CMP-C, la definición de "efluente" en la pregunta 15 y la respuesta sobre material
  particulado de la Sección Ambiental.
