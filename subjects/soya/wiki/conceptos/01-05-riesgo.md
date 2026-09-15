---
titulo: Riesgo
tipo: concepto
modulo: [1]
clase: [1]
division: "1"
tags: [riesgo, peligro, iso 45001, prevencion, proteccion]
fuentes: [clase-01, clase-02, aspt-teoria, resumen-ordonez]
actualizado: 2026-08-25
estado: en-desarrollo
resumen: 'Combinación de la probabilidad de ocurrencia de un evento peligroso o exposición, y la severidad de la lesión o deterioro de salud que pueden causar (ISO 45001:2018): R = P × G. Es la ecuación central de todo el módulo 1.'
---

## En una línea

Combinación de la probabilidad de ocurrencia de un evento peligroso o exposición, y la severidad
de la lesión o deterioro de salud que pueden causar (ISO 45001:2018): **R = P × G**. Es la
ecuación central de todo el módulo 1.

## Desarrollo

Definición textual de la cátedra:

> "Riesgo: Combinación de probabilidad de ocurrencia de un evento peligroso o exposición, y la
> severidad de la lesión o deterioro de la salud que pueden causar los eventos o exposiciones.
> (ISO 45001:2018 y otros)
> RIESGO = PROBABILIDAD x GRAVEDAD
> R = P x G" (Clase 1, slide 18)

El slide siguiente trae una imagen sin texto extraído en la fuente (Clase 1, slide 19); es
razonable suponer que ilustra la relación probabilidad/gravedad (por ejemplo una matriz de riesgo),
pero eso **no está confirmado** en el material disponible y no se afirma como dato.

> [!note] Apareció un candidato para esa lámina — sin confirmar
> [[resumen-ordonez]] (p. 10), fuente de alumno de una cursada anterior, trae una **matriz de
> riesgo 3 × 3** en el mismo lugar del recorrido: gravedad (ligeramente dañino / dañino /
> extremadamente dañino) × probabilidad (muy poco probable / poco probable / probable), y las
> celdas resultantes van de **no significativo → poco significativo → moderado → significativo →
> intolerable**.
>
> Es el único candidato concreto que apareció para el slide 19, y encaja con su posición entre el
> slide 18 (`R = P × G`) y el 20 (riesgo aceptable). **No está confirmado que sea el mismo
> gráfico**: son dos cursadas distintas y nadie miró todavía la lámina del PDF de 2026. Ver H-06
> en [[huecos]].
>
> Vale doble porque esa matriz es, además, el bloque metodológico que H-03 declara ausente del
> tema 7 del temario ("Identificación de peligros y evaluación de riesgos").

### La variante OHSAS 18001

[[resumen-ordonez]] (p. 2) atribuye la definición a **OHSAS 18001:2007**, la norma anterior:

> "Riesgo: Combinación de probabilidad de ocurrencia de un evento peligroso o exposición, y la
> severidad de la lesión o **enfermedad ocupacional** que puede ser causada por el evento o la
> exposición."

Casi idéntica —cambia "deterioro de la salud" por "enfermedad ocupacional"— y, sobre todo,
**`R = P × G` es exactamente la misma en las dos**. A diferencia de lo que pasa con
[[01-04-peligro|peligro]], acá el cambio de norma no mueve nada de fondo. Ver [[ohsas-18001]].

### Por qué esta ecuación es la bisagra del módulo

`R = P × G` no es solo una fórmula: fija que el riesgo tiene **dos variables independientes**. El
slide 18 de la Clase 1 no dice más que eso — no habla todavía de prevención ni de protección —,
pero es la partición sobre la que se apoya la lectura que la cátedra hace explícita recién en la
Clase 2 (slide 10):

- **Bajar P** — actuar sobre la probabilidad de que el evento peligroso ocurra o de que haya
  exposición. Es el terreno de la **prevención**.
- **Bajar G** — actuar sobre la severidad del daño si el evento ocurre igual. Es el terreno de la
  **protección**.

Ver [[02-04-prevencion-y-proteccion]] (Clase 2, slide 10) para el desarrollo completo de esta
partición; acá se anticipa solo para explicar por qué la ecuación importa, no como contenido de
esta clase.

### Peligro vs. riesgo

El [[01-04-peligro|peligro]] es la fuente con potencial de daño; existe con independencia de que
alguien esté expuesto. El riesgo necesita, además, una probabilidad de exposición y una gravedad
asociada. Un mismo peligro puede tener distinto riesgo según cuánta gente esté expuesta, con qué
frecuencia y con qué controles ya puestos — esa es la pregunta que separa "identificar un peligro"
de "evaluar un riesgo", y es, en los términos de esta cursada, el examen de la materia.

## En la materia

Segundo ítem del temario del módulo 1 ("Definición de peligro y riesgo", Clase 1, slide 5). Es la
ecuación que [[materia]] usa como columna vertebral de la cadena peligro → riesgo → accidente /
enfermedad profesional.

## Una tercera fuente que dice lo mismo

El documento de [[aspt-teoria]], que no es material de la cátedra sino de una consultora, llega a la
misma ecuación por su cuenta, al explicar cómo priorizar qué trabajo analizar primero:

> "Al analizar los riesgos laborales, el riesgo se define a menudo como **una función de la
> probabilidad de un accidente y la gravedad del mismo**. Una mayor probabilidad y severidad de los
> riesgos involucrados, implicará una mayor necesidad de efectuar un ASPT." (ASPT, p. 2)

Que tres fuentes independientes del corpus —[[iso-45001]] vía [[clase-01]], el cuadro de
[[clase-02]] (slide 10) y este documento— converjan en `R = P × G` es la mejor señal de que la
ecuación es material de parcial y no una simplificación de una clase.

Y agrega un uso nuevo: **`R = P × G` no sólo sirve para evaluar un riesgo, sirve para decidir dónde
gastar el esfuerzo de análisis.** Los cinco criterios de priorización del [[03-01-aspt|ASPT]]
son, dos de ellos, `P` y `G` literales: "frecuencia de accidentes" y "gravedad del accidente"
(ASPT, pp. 2-3).

## Relación con otros temas

- [[01-04-peligro]] — la fuente que el riesgo cuantifica.
- [[01-06-riesgo-aceptable]] — qué nivel de R se considera tolerable.
- [[01-07-accidente]] — lo que ocurre cuando el riesgo se materializa.
- [[02-04-prevencion-y-proteccion]] — las dos familias de intervención que salen de separar P y G.
- [[03-01-aspt]] — `R = P × G` usado para priorizar qué trabajo se analiza primero.
- [[iso-45001]] — fuente de la definición; esa página ubica la definición en la cláusula 3.20,
  verificada por triangulación con fuentes secundarias (no por lectura directa de la norma) — ver
  esa página para el detalle.

## Fuentes

- (Clase 1, slide 18)
- (Clase 1, slide 19)
- (Clase 2, slide 10) — citada solo para la lectura prevención/protección de `R = P × G`.
- (ASPT, pp. 2-3) — [[aspt-teoria]]
