---
title: Validez de las pruebas de penetración
resumen: 'Las dos preguntas abiertas con las que cierra el deck de pentesting, planteadas como discusión y no como doctrina: cuán válido es un test y qué determina su calidad; la generalización del paso 4 opera dentro de un mismo sistema.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[video-09-pentesting-metodologia]]", "[[metodologia-de-hipotesis-de-falla]]", "[[verificacion-formal-y-prueba-de-penetracion]]"]
aliases: [Validez de las pruebas de penetración, Calidad de un pentest, OSSTMM, Discusión sobre la validez del pentest]
type: concepto
unidad: 2
clase: 8
orden: 11
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, pentesting, validez, osstmm, bishop, clase-08, sin-dictar]
sources: ["Clase 13 - Pentesing.pdf"]
---

# Validez de las pruebas de penetración

**El cierre del deck de Pentesting no da una conclusión: da dos preguntas abiertas, escritas explícitamente como discusión y no como doctrina.** Esta nota las plantea de la misma manera en que las deja la propia filmina — sin adelantar una respuesta única, porque esa es la forma en que la cátedra las presenta, y forzar un cierre limpio sería falsear el material.

Cubre las filminas **30 y 31** del deck de Pentesting. **Esta clase todavía no se dictó** (hoy es 04/09/2026); lo que sigue está escrito contra el PDF, cruzado con [[video-09-pentesting-metodologia|video-09]], que agrega una discusión de alumno sobre este mismo tramo, más lecturas propias rotuladas como tales.

## Filmina 30 — ¿Cuán válidos son los tests de penetración?

Tres afirmaciones, sin jerarquía entre ellas:

- **No sustituyen** una buena especificación, diseño, implementación y pruebas.
- Es una técnica importante para probar un sistema **luego de ser instalado** — idealmente no sería necesario, pero en la práctica sí lo es.
- Encuentra problemas introducidos por la **interacción del sistema con los usuarios y el ambiente**, que suelen quedar fuera del análisis y las pruebas normales.

Las tres se leen mejor juntas que por separado. La primera es una advertencia contra usar el pentest como sustituto de un buen proceso de desarrollo — exactamente lo que ya señala [[aseguramiento-en-el-ciclo-de-vida|Aseguramiento en el ciclo de vida]] al insistir en no dejar la seguridad para el final del proyecto. La segunda admite que, pese a esa advertencia, el pentest **sí hace falta** en la práctica: ningún proceso de diseño por sí solo anticipa todo lo que pasa una vez que el sistema está instalado en un ambiente real. Y la tercera dice **por qué** hace falta: hay una categoría entera de problemas —los que nacen de la interacción con usuarios y ambiente— que ni el mejor análisis de escritorio puede ver, porque no existen hasta que el sistema efectivamente corre con gente real usándolo. Es exactamente la clase de hallazgo que produce el [[casos-de-prueba-de-penetracion#Caso: ataque externo por ingeniería social|caso de ingeniería social]]: ningún análisis de código iba a encontrar que un empleado nuevo revela su contraseña por teléfono.

## Filmina 31 — ¿Qué determina la calidad de una prueba de penetración?

- La metodología de hipótesis de fallas **depende de la capacidad de los testers para formular hipótesis** — no hay garantía de cobertura si el tester no es bueno formulando hipótesis.
- **No provee una forma sistemática** de revisar un sistema.
- **Los resultados de un test sirven sólo marginalmente para otros** — cada test es un mundo aparte, aunque existan herramientas que automatizan algunos aspectos de una prueba, nunca todos.

Las tres son, en el fondo, la misma limitación mirada desde tres ángulos: la [[metodologia-de-hipotesis-de-falla|Metodología de hipótesis de falla]] no es un algoritmo que garantice cobertura, es un método que depende de la creatividad de quien lo ejecuta. Un tester mediocre formula pocas hipótesis, prueba pocas cosas, y el informe final da una falsa sensación de seguridad que no corresponde a ninguna propiedad real del sistema — es la misma trampa, dicha de otra forma, que ya señala [[verificacion-formal-y-prueba-de-penetracion|Verificación formal y prueba de penetración]]: un pentest limpio prueba que el equipo no encontró nada, no que no haya nada que encontrar.

### La tensión sobre "generalización", resuelta por la cátedra

La tercera afirmación —que los resultados sirven sólo marginalmente para otros sistemas— choca en apariencia con el paso 4 de la metodología, que se llama justamente **generalización**. Un alumno le marca la contradicción a Ramele en [[video-09-pentesting-metodologia#7. Para discutir, y una tensión que un alumno marca bien|video-09]] (1:21:42): si el paso 4 generaliza, ¿cómo puede ser que un test sirva sólo marginalmente para *otros* tests?

La resolución que da la cátedra separa dos escalas de generalización que la palabra, usada sola, confunde:

| | Generalización del paso 4 | "Validez externa" de la filmina 31 |
|---|---|---|
| Alcance | **Dentro del mismo sistema** | **Entre sistemas distintos** |
| Qué hace | Pivotea desde una vulnerabilidad ya explotada hacia sus derivaciones, buscando dónde se replica el mismo problema | Preguntar si lo que un pentest encontró en el Sistema A dice algo sobre el Sistema B |
| Respuesta de la cátedra | Sí generaliza — es la parte más importante de la prueba, según la filmina 15 del bloque de metodología | **No generaliza nada** — cada test es un mundo aparte |

> [!quote]- Del video 09 — el alcance de un pentest (1:23:07)
> "El pen test sirve para ese sistema, en ese momento y en ese lugar, y listo."

Es una aclaración que conviene tener resuelta de memoria porque separa dos preguntas que a primera vista suenan idénticas: **"¿esta vulnerabilidad aparece en otro lado del mismo sistema?"** (sí, es justamente lo que busca el paso 4) contra **"¿esta vulnerabilidad me dice algo sobre otro sistema parecido?"** (no de forma automática — a lo sumo, sirve como hipótesis de partida para *empezar* un pentest nuevo, no como conclusión de uno ya hecho).

## Lectura recomendada, y el mismo desfasaje de numeración que ya aparece en el bloque de vulnerabilidades

La filmina 32, de cierre, remite a **Bishop, capítulo 23, secciones 1-2**, y al **`OSSTMM`** (*Open Source Security Testing Methodology Manual*, `isecom.org/osstmm`).

En el mapeo de capítulos de la [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|bibliografía]] del vault, *Vulnerability Analysis — penetration testing* corresponde al **capítulo 24** en la edición que está en `raw/`, no al 23 — el 23, en esa edición, es *Malware*. Es el mismo desfasaje de numeración que ya señala [[identificacion-de-vulnerabilidades|Identificación de vulnerabilidades]] sobre la filmina 22 del deck de Vulnerabilidades, y que [[video-09-pentesting-metodologia#Lectura recomendada (1:20:52)|video-09]] confirma de forma independiente sobre esta misma lectura. *(Lectura nuestra: al buscar la lectura conviene ir por el título del capítulo, no por el número — probablemente ambas filminas sigan la numeración de una edición anterior del libro, pero eso no está confirmado contra ningún original de esa edición.)*

El **`OSSTMM`** no tiene mapeo de capítulo porque no es un libro de la bibliografía del vault: es un manual metodológico externo, de acceso abierto, que —a diferencia de la Metodología de Hipótesis de Falla que da esta clase— sí intenta ofrecer una forma sistemática y estandarizada de auditar un sistema. Citarlo justo después de la filmina 31 —*"no provee una forma sistemática de revisar un sistema"*— sugiere una lectura posible, aunque no la diga la filmina explícitamente: el `OSSTMM` es, en parte, una respuesta a esa misma limitación. *(Lectura nuestra.)*
