---
titulo: Secuencia del accidente
tipo: concepto
modulo: [1]
clase: [2]
division: "1"
tags: [secuencia-del-accidente, barrera, prevencion, proteccion, hollnagel]
fuentes: [clase-02]
actualizado: 2026-08-13
estado: en-desarrollo
resumen: 'El esquema de cuatro fases con el que la Clase 2 ubica en el tiempo la distinción preventivo/protectivo: condición normal → fase inicial (falta de control) → fase de conclusión (pérdida de control → exposición a la energía) → fase de perjuicio, con tres vocabularios de barreras de distinta granularidad superpuestos sobre esas mismas cuatro fases.'
---

## En una línea

El esquema de cuatro fases con el que la Clase 2 ubica en el tiempo la distinción
preventivo/protectivo: condición normal → fase inicial (falta de control) → fase de conclusión
(pérdida de control → exposición a la energía) → fase de perjuicio, con **tres vocabularios de
barreras** de distinta granularidad superpuestos sobre esas mismas cuatro fases.

## Desarrollo

> [!warning] Página reconstruida a partir de un slide con texto muy desordenado
> El slide 11 es un diagrama, y la extracción de texto del PDF rompe por completo su disposición
> espacial: los rótulos de las fases, los estados intermedios y los tres vocabularios aparecen
> mezclados y fuera de orden en `.cache/txt/`. Lo que sigue reconstruye el contenido con el mayor
> cuidado posible a partir de las piezas ciertas (las fases, los estados, las citas y los términos
> exactos de cada vocabulario), pero **el emparejamiento fase-por-fase de la tabla de abajo es una
> inferencia**, no una lectura directa y verificada del layout visual del slide. Si hay margen de
> duda al repasar para el parcial, conviene confirmar contra el PDF original.

### Lo que es seguro (texto literal del slide)

El slide 11 trae, sin ambigüedad de contenido (aunque sí de orden), estos elementos:

- **Las cuatro fases**, en este orden: **Condición normal** → **Fase inicial** → **Fase de
  conclusión** → **Fase de perjuicio**.
- **Los tres estados intermedios**: **Falta de control** → **Pérdida de control** → **Exposición a
  la energía**.
- **Tres vocabularios**, cada uno citado con su propia referencia:
  - **Hollnagel (2004)** — dos términos: **Preventivo** / **Protectivo**. (Citado en el original
    como "Hollangel, 2004": es una errata tipográfica del propio slide, no un autor distinto — es
    [[erik-hollnagel|Erik Hollnagel]]. Ver [[contradicciones]], C-02.)
  - **IEC 61508/11, ISO 13702** — tres términos: **Prevenir** / **Controlar** / **Mitigar**.
  - **Duijm et al. (2004)** — cuatro términos: **Evitar** / **Prevenir** / **Controlar** /
    **Proteger**.

(Clase 2, slide 11)

### La reconstrucción: una tabla que alinea los tres vocabularios contra las cuatro fases

> **Inferencia:** el emparejamiento columna por columna que sigue se arma a partir de dos anclas
> firmes — (1) Duijm tiene exactamente cuatro términos para las cuatro fases, lo que sugiere una
> correspondencia uno a uno; y (2) la página de [[erik-hollnagel]] ya registra, a partir de esta
> misma clase, que las barreras **preventivas actúan antes de la pérdida de control** y las
> **protectivas actúan después, "para controlar y mitigar"** — lo que fija dónde cae el corte
> binario de Hollnagel sobre las otras dos escalas.

| | Condición normal | Fase inicial (falta de control) | Fase de conclusión (pérdida de control → exposición a la energía) | Fase de perjuicio |
|---|---|---|---|---|
| **Duijm et al., 2004** (4 términos) | Evitar | Prevenir | Controlar | Proteger |
| **IEC 61508/11, ISO 13702** (3 términos) | *(sin término — nada falló todavía)* | Prevenir | Controlar | Mitigar |
| **Hollnagel, 2004** (2 términos) | Preventivo | Preventivo | Protectivo | Protectivo |

Leída por columnas, la tabla dice: en **condición normal** todavía no hay nada que controlar, sólo
evitar que se inicie una desviación (Duijm) — es terreno "preventivo" en el sentido más amplio. En
la **fase inicial**, ante la falta de control, se **previene**: para los tres vocabularios el verbo
es esencialmente el mismo. En la **fase de conclusión**, con la pérdida de control ya en curso y la
energía en vías de liberarse, se **controla**: acá Duijm e IEC/ISO coinciden literalmente en la
palabra. Y en la **fase de perjuicio**, con el daño ya producido, se **protege / mitiga**: son
sinónimos funcionales en este esquema.

### Por qué importa esta página

Esta tabla es lo que le da textura temporal al criterio preventiva/protectiva de
[[02-03-barrera]]: no alcanza con decir "antes o después del evento" en abstracto, porque el
"evento" en sí tiene subfases (pérdida de control, exposición a la energía) donde el tipo de
intervención posible cambia. Es también el punto exacto donde se conecta con la definición de
[[william-johnson|Johnson]] (1973): un accidente es "una transferencia indeseada de **energía**
debido a la falta de barreras" — y acá la "exposición a la energía" es, literalmente, la
bisagra entre pérdida de control y fase de perjuicio.

## En la materia

Slide 11 de la Clase 2, entre la definición de barrera y el cuadro prevención/protección (slides
9-10, [[02-03-barrera]] y [[02-04-prevencion-y-proteccion]]) y el desarrollo detallado de
"prevenir es" / "proteger es" (slides 12-13). Cumple el rol de justificar, con un modelo temporal,
por qué la clasificación binaria preventivo/protectivo tiene sentido.

## Relación con otros temas

- [[02-03-barrera]] — el criterio preventiva/protectiva que esta página ubica en el tiempo.
- [[02-04-prevencion-y-proteccion]] — el desarrollo en contenido concreto de "prevenir" y
  "proteger".
- [[erik-hollnagel]] — autor del vocabulario binario preventivo/protectivo y de la definición de
  barrera.
- [[william-johnson]] — su definición de accidente (transferencia indeseada de *energía*) es la
  que da sentido al estado "exposición a la energía" de esta secuencia.
- [[01-07-accidente]] — las tres definiciones de accidente de [[clase-01]], con las que esta
  secuencia temporal dialoga.
- [[contradicciones]] — registra la errata "Hollangel" por Hollnagel (C-02).

## Fuentes

- (Clase 2, slide 11) — [[clase-02]]
