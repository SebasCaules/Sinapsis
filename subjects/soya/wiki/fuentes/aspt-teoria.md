---
titulo: ASPT — Análisis de Seguridad de Puestos de Trabajo (documento teórico)
tipo: fuente
modulo: [1]
clase: [3, 4]
division: "1"
tags: [aspt, jerarquia-de-controles, riesgo, incidente, epp]
fuentes: [aspt-teoria]
actualizado: 2026-08-25
estado: consolidado
raw_path: "raw/clases/clases-3y4/ASPT - Analisis de Seguridad de Puesto de Trabajo.pdf"
paginas: 7
autor: GAMASI (consultora)
anio: 2026
rol: bibliografia
aliases: [documento-aspt]
resumen: 'Las siete páginas que explican el método del ASPT de punta a punta: para qué sirve, sus cuatro fases, la jerarquía de control de riesgos que hay que aplicar en la cuarta, y las cinco situaciones que obligan a revisarlo. Es el texto de referencia del trabajo práctico (aspt-trabajo-relevamientos, slide 2).'
---

## En una línea

Las siete páginas que explican el método del ASPT de punta a punta: para qué sirve, sus cuatro
fases, la jerarquía de control de riesgos que hay que aplicar en la cuarta, y las cinco situaciones
que obligan a revisarlo. Es el texto de referencia del trabajo práctico
([[aspt-trabajo-relevamientos]], slide 2).

> [!note] No es un soporte de clase: es material de una consultora repartido por la cátedra
> El documento está membretado por **GAMASI** (Reconquista 365 3.º P, CABA) y su pie de página
> aclara, en todas las páginas, que no sustituye el asesoramiento de un asesor en Higiene y
> Seguridad "en los términos del art. 12 del [[dec-1338-96|Decreto 1338/96]], que reglamentó la
> [[ley-19587|ley 19.587]]".
>
> En la jerarquía de autoridad de `CLAUDE.md` §4 esto es **bibliografía**, no soporte de clase:
> máxima autoridad sobre el método, ninguna sobre qué entra en el parcial. Pero lo reparte la
> cátedra y es el instructivo del trabajo, así que en la práctica fija cómo hay que resolverlo.
> Se cita `(ASPT, p. N)` por página del PDF, que coincide con el "Página N de 7" impreso al pie.

## Recorrido por página

| Pág. | Sección | Contenido | Página de la wiki |
|---|---|---|---|
| 1 | Alcance y beneficios del ASPT | Qué es (proceso estructurado sobre la relación trabajador–tarea–herramientas–entorno) y qué gana cada parte | [[03-01-aspt]] |
| 2 | Alcance (cont.) + Fase 1 | Los que hacen el trabajo son los que más saben de sus peligros; las 4 fases; los 5 criterios de priorización | [[03-01-aspt]] |
| 3 | Fase 1 (cont.) + Fase 2 | Criterios 3 a 5; qué es un paso de trabajo, verbos de acción, y la regla de los 3 a 15 pasos | [[03-01-aspt]] |
| 4 | Fase 3 | Cada paso puede tener más de un riesgo; las 4 preguntas; priorizar por probabilidad; inspeccionar el lugar | [[03-01-aspt]] |
| 5 | Fase 4 | Primero eliminar, después reducir; la **"Jerarquía de Control de Riesgos"** de tres niveles | [[02-06-jerarquia-de-controles]] |
| 6 | Revisión del ASPT | "El ASPT nunca termina"; la **Autoridad para Detención de Trabajos**; revisión ante accidente | [[03-01-aspt]] |
| 7 | Revisión (cont.) | Revisión ante incidente, ante preocupación de un empleado y ante cambio de pasos; revisión periódica | [[03-01-aspt]], [[01-08-incidente]] |

## Las cuatro definiciones que este documento aporta

**1. Qué es el ASPT** (ASPT, p. 1):

> "El ASPT es un proceso estructurado que se centra en la relación entre el trabajador, la tarea,
> las herramientas y el entorno de trabajo."

**2. Las cuatro fases** (ASPT, p. 2):

> "• Selección del trabajo. • Determinación de la secuencia de pasos del trabajo. • Identificación
> de riesgos de cada paso. • Implementación de métodos de control para cada riesgo."

**3. La jerarquía de control de riesgos, en tres niveles** (ASPT, p. 5):

> "Una estrategia habitual para priorizar el control de riesgos es implementar la 'Jerarquía de
> Control de Riesgos.' Esta estrategia consta de tres métodos de control básico: los controles de
> ingeniería en primer lugar, los controles administrativos en segundo lugar y, por último,
> implementar el uso de Elementos de Protección Personal (EPP)."

> [!important] Es una **tercera** versión de la jerarquía, distinta de las dos que ya teníamos
> [[iso-45001]] da cinco escalones (eliminar → sustituir → ingeniería → administrativos → EPP);
> [[clase-02]] los reparte en dos columnas (prevenir / proteger). Este documento da **tres**, y
> deja "eliminar" y "sustituir" fuera de la escalera, como un principio previo: "tenga siempre en
> cuenta, en primera instancia, los controles que **eliminan** los peligros. Luego estudie los
> controles que sólo **reducen** los riesgos a niveles aceptables" (ASPT, p. 5).
> Registrado en [[contradicciones]] (C-09) y desarrollado en [[02-06-jerarquia-de-controles]].

**4. Incidente** (ASPT, p. 6):

> "Un incidente es un hecho en el que no hubo lesiones, pero que si hubiera habido un ligero
> cambio en el tiempo o la posición del empleado, la lesión se podría haber producido."

Coincide con la definición de [[clase-01]] (slide 25) y refuerza el lado de la cátedra en
[[contradicciones]] (C-04). Ver [[01-08-incidente]].

## La definición de riesgo, otra vez

> "Al analizar los riesgos laborales, el riesgo se define a menudo como una función de la
> probabilidad de un accidente y la gravedad del mismo." (ASPT, p. 2)

Es `R = P × G` de [[01-05-riesgo]] llegando por una segunda vía, independiente de
[[iso-45001]] y de [[clase-02]]. Que dos fuentes distintas de la cursada converjan en la misma
ecuación es la mejor señal de que es material de parcial.

## Un detalle de vocabulario que conviene tener a mano

El documento usa **"riesgo"** donde [[clase-01]] y la [[iso-45001]] usarían **"peligro"**: habla de
"identificar los riesgos de cada paso" y da como ejemplos "riesgo de choque eléctrico" y "riesgo de
lesiones cortantes por bordes afilados", que en el vocabulario de la clase 1 son **fuentes** de
daño, es decir peligros. El [[aspt-formulario|formulario]] hace lo mismo: su columna se llama
"Riesgos identificados para cada Paso". Registrado en [[contradicciones]] (C-10) y en
[[glosario-es-en]].

## Conceptos que introduce

- [[03-01-aspt]] — el método completo, sus fases y su revisión.
- Amplía [[02-06-jerarquia-de-controles]], [[01-08-incidente]] y [[01-05-riesgo]].

## Fuentes

- `raw/clases/clases-3y4/ASPT - Analisis de Seguridad de Puesto de Trabajo.pdf` (7 páginas), GAMASI.
- Caché de texto: `.cache/txt/clases--clases-3y4--aspt---analisis-de-seguridad-de-puesto-de-trabajo.txt`
- Formulario asociado: [[aspt-formulario]]. Consigna del trabajo: [[aspt-trabajo-relevamientos]],
  slide 2. Resolución: [[aspt-andamio]].
