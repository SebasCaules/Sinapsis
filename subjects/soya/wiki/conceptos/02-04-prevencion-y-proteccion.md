---
titulo: Prevención y protección
tipo: concepto
modulo: [1]
clase: [2, 5]
division: "1"
tags: [prevencion, proteccion, barrera, riesgo, capas-de-cebolla]
fuentes: [clase-02, clase-05]
actualizado: 2026-09-15
estado: en-desarrollo
resumen: 'Las dos herramientas en las que la cátedra divide toda intervención sobre el riesgo: prevención para reducir la probabilidad, protección para reducir la gravedad — la misma partición de R = P × G aplicada a la acción.'
---

## En una línea

Las dos herramientas en las que la cátedra divide toda intervención sobre el riesgo: **prevención**
para reducir la probabilidad, **protección** para reducir la gravedad — la misma partición de
`R = P × G` aplicada a la acción.

## Desarrollo

### El cuadro de dos columnas (slide 10)

> "Para reducir la probabilidad de ocurrencia de accidentes, la herramienta es la **Prevención**.
> Para reducir la gravedad de los accidentes, la herramienta es la **Protección**."
> (Clase 2, slide 10)

Es la traducción directa de `R = P × G` (ver [[01-05-riesgo]]) a dos programas de acción
distintos: **prevención interviene la `P`**, **protección interviene la `G`**. La cátedra desarrolla
cada uno en el slide siguiente con una lista concreta de qué significa "prevenir" y qué significa
"proteger" en la práctica.

### Prevenir es (slide 12)

> "Prevenir es:
> - Eliminar.
> - Sustituir.
> - Establecer controles de ingeniería (barreras físicas, protecciones, controles de diseño).
> - Establecer señales, avisos, controles administrativos (procedimientos, normas, capacitación,
>   etc.)."
>
> (Clase 2, slide 12)

Cuatro niveles, de mayor a menor intervención sobre la fuente del peligro: sacar el peligro del
todo (eliminar), cambiarlo por algo menos peligroso (sustituir), interponer un control de diseño o
de ingeniería, o —si nada de eso alcanza— avisar y normar cómo trabajar cerca del peligro. Este
mismo orden es el que retoma [[02-06-jerarquia-de-controles]] para discutir la relación con la
jerarquía clásica de ISO 45001.

### Proteger es (slide 13)

> "Proteger es:
> - Establecer señales, avisos, alarmas de estado de emergencia.
> - Uso de epp
> - Establecer planes de contingencia (emergencias, derrames, primeros auxilios, incendio, etc.).
> - Realizar simulacros."
>
> (Clase 2, slide 13)

Notar que acá **no aparece "eliminar" ni "sustituir"**: proteger no actúa sobre si el evento ocurre
o no, sino sobre qué tan mal termina si ocurre. Todo lo que lista este slide presupone que el
evento ya pasó o está pasando: una alarma de emergencia suena cuando ya hay una emergencia, el EPP
protege durante la exposición, un plan de contingencia se ejecuta cuando el incidente ya está en
curso, y un simulacro prepara para ese momento.

### Por qué "prevenir" no es sólo "barreras físicas" ni "proteger" es sólo EPP

Es un error común leer prevención = ingeniería y protección = EPP. No es así: prevención incluye
también señales y controles **administrativos** (no-físicos), y protección incluye señales y
alarmas además de EPP. El eje real no es físico/no-físico sino **cuándo actúa** — ver
[[02-03-barrera]] para el desarrollo completo de ese criterio, incluido el caso límite de una
barrera de ingeniería que es protectiva.

### Las capas de cebolla: cómo lo dice el docente en la Clase 5

La partición no es una elección entre dos opciones sino un orden de capas, y la
[[clase-05|Clase 5]] lo dice con una imagen que conviene tener a mano para el parcial:

> "Tenemos que tratar de focalizarnos en la prevención por sobre la protección. **La protección es
> la última barrera.** Estas dos barreras no deberían ser una reemplazante de la otra, sino que
> deberían ser **como capas de cebolla**, una adentro de la otra. Entonces la última capa, la última
> barrera es la protección, pero antes nosotros tenemos que establecer medidas para prevenir la
> ocurrencia de esa exposición." (Video Contaminación, 02:40–03:13)

Y la misma clase aplica la partición **tres veces**, una por riesgo, siempre con las dos listas
tituladas "Prevención" y "Protección": para el contaminante químico (ventilación y campanas vs.
máscara — [[05-01-contaminantes-quimicos-y-cmp]]), para la electricidad (trabajar sin tensión,
distancias, 5 reglas de oro y LOTO vs. puesta a tierra, diferencial y EPP —
[[05-02-riesgo-electrico]], slide 17) y para el fuego (orden y limpieza, banda de inflamabilidad
vs. matafuegos, brigada y simulacros — [[05-03-proteccion-contra-incendios]]). El EPP que se
entrega igual aunque la prevención alcance es "**la barrera que le pongo sobre la barrera**"
(Video Contaminación, 19:55).

## En la materia

Slides 10, 12 y 13 de la Clase 2. El slide 10 da la síntesis conceptual (prevención ↔ probabilidad,
protección ↔ gravedad); los slides 12 y 13 la desarrollan en listas concretas, después de que el
slide 11 ubique temporalmente el corte en la
[[02-05-secuencia-del-accidente|secuencia del accidente]]. Es el contenido que estructura
directamente el [[ejercicio-barreras]]. La [[clase-05|Clase 5]] la vuelve a usar como esqueleto de
cada riesgo específico.

## Relación con otros temas

- [[01-05-riesgo]] — la ecuación `R = P × G` que esta partición traduce a acción.
- [[02-03-barrera]] — el criterio preventiva/protectiva de clasificación de barreras, del que
  esta página es el desarrollo detallado de contenido.
- [[02-05-secuencia-del-accidente]] — ubica temporalmente el corte prevención/protección.
- [[02-06-jerarquia-de-controles]] — retoma el mismo listado de "prevenir es" / "proteger es"
  para discutir su relación con la jerarquía de controles de ISO 45001 y el matiz sobre dónde va el
  EPP.
- [[02-07-epp]] — el ítem "uso de epp" de "proteger es" (slide 13).
- [[05-01-contaminantes-quimicos-y-cmp]], [[05-02-riesgo-electrico]],
  [[05-03-proteccion-contra-incendios]] — los tres riesgos de la Clase 5, cada uno con su cuadro
  prevención/protección.
- [[erik-hollnagel]] — autor de la distinción preventivo/protectivo que esta página desarrolla en
  detalle.
- [[iso-45001]] — cláusula 8.1.2, la jerarquía de controles de la que salen estos mismos elementos
  (eliminar, sustituir, ingeniería, administrativos, EPP), aunque ordenados de otra forma.

## Fuentes

- (Clase 2, slide 10) — [[clase-02]]
- (Clase 2, slide 12) — [[clase-02]]
- (Clase 2, slide 13) — [[clase-02]]
- (Video Contaminación, 02:40–03:13 y 19:55; Clase 5, slide 17) — [[clase-05]]
