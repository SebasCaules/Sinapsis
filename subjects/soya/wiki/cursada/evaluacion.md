---
titulo: Evaluación y régimen de aprobación
tipo: hub
modulo: [1, 2]
clase: [1]
division: "cursada"
tags: [cursada, evaluacion, parciales]
fuentes: [clase-01, programa-oficial-12-83, guia-parcial-2-ambiental, finales-soa-compilado]
actualizado: 2026-08-25
estado: en-desarrollo
resumen: 'Dos módulos que se aprueban por separado con 4 o más, un parcial presencial por módulo, una sola instancia de recuperatorio presencial al final de la cursada, y final presencial.'
---

## En una línea

Dos módulos que se aprueban **por separado** con 4 o más, un parcial presencial por módulo, **una
sola** instancia de recuperatorio presencial al final de la cursada, y **final presencial**.

## El régimen, tal como lo dio la cátedra

Textual de la primera clase (Clase 1, slide 3):

> - Dos Módulos: Seguridad / Medio Ambiente.
> - Para aprobar la materia es necesario aprobar cada módulo con 4 o más.
> - Un parcial PRESENCIAL por cada módulo.
> - Una única instancia de recuperatorio PRESENCIAL al final de la cursada.
> - Se aprueba con 4 o más.
> - FINAL PRESENCIAL.

## El programa oficial dice algo distinto — y hay que preguntarlo

**Agregado el 2026-08-25.** Entró a `raw/material_catedra/` el
[[programa-oficial-12-83|programa oficial del ITBA]], que era el hueco H-01. Su sección de
requisitos de aprobación **no coincide con el slide de arriba**.

| | Clase 1, slide 3 (cátedra 2026) | Programa oficial (ITBA, 2023) |
|---|---|---|
| **Criterio** | "aprobar **cada módulo** con 4 o más" | "el **promedio** de los parciales… es **superior a** 4" |
| **Trabajos prácticos** | no los menciona | **al menos el 80 %** realizados |
| **Un 3 y un 6** | desaprobado | aprobado (promedia 4,5) |
| **Un 4 exacto** | aprobado | desaprobado ("superior a") |

> [!warning] Es la contradicción de mayor consecuencia práctica del vault
> Registrada como **C-26** en [[contradicciones]]. **Gana la Clase 1** por la jerarquía de
> `CLAUDE.md` §4 —es la cursada en curso y es tres años más nueva— y porque es el criterio más
> exigente, que es la lectura conservadora correcta.
>
> **Pero conviene preguntarlo en clase.** Ninguna de las dos fuentes es descartable: una es lo que
> dijo el docente, la otra es lo que el ITBA publica como reglamento de la materia.

Lo que el programa **sí agrega sin chocar con nada**:

- Los parciales **"podrán ser de desarrollo, multiple-choice o una combinación de ambos"**.
- El recuperatorio único **permite recuperar uno o los dos** parciales desaprobados: *"en la cual
  se podrán recuperar lo o los parciales desaprobados"*. Eso **corrige la inferencia** que esta
  página hacía más abajo, de que sólo se podía recuperar uno.
- Los TP son **individuales o grupales, de 3 a 5 personas**, y **llevan nota con devolución del
  docente**. Eso cierra H-08 y H-10: el [[ejercicio-barreras]] y los demás **sí se califican**.
- Hay **seis TP** en el programa, cinco de ellos del módulo 2. Ver
  [[programa-oficial-12-83]].
- Las clases son **presenciales de tipo teórico-práctico**, lo que cierra H-07.

## Qué implica en la práctica

Tres consecuencias que no están dichas con todas las letras pero se siguen de lo anterior:

> ~~**Inferencia:** al ser una sola instancia de recuperatorio, desaprobar los dos parciales deja
> sin red: sólo se puede recuperar uno.~~
>
> **Corregido el 2026-08-25.** El [[programa-oficial-12-83|programa oficial]] (p. 6) dice que en el
> recuperatorio único "se podrán recuperar **lo o los** parciales desaprobados": **se pueden
> recuperar los dos**. La inferencia era razonable pero equivocada. Se deja tachada, no borrada
> (regla dura #3).

> **Inferencia:** como los módulos se aprueban de forma independiente, **no se compensan entre
> sí**. Un 9 en Seguridad no levanta un 3 en Medio Ambiente.

> ~~**Inferencia:** el énfasis en PRESENCIAL sugiere una aclaración frente a la modalidad de las
> clases, pero no sabemos si las clases son presenciales, híbridas o remotas.~~
>
> **Cerrado el 2026-08-25.** El [[programa-oficial-12-83|programa oficial]] (p. 5) dice: *"Las
> clases son **presenciales** de tipo teórico-práctico."* Las clases y las evaluaciones son
> presenciales. Era H-07 en [[huecos]].

## Qué se sabe de cada instancia — actualizado el 2026-08-25

La ingesta de `raw/examenes/` y `raw/resumenes/` agregó dos cosas que antes eran huecos.

### El parcial del módulo 2 tiene guía de preguntas publicada

**[[guia-parcial-2-ambiental]] es material de cátedra** —trae el código `12.83` impreso— y son
**80 preguntas numeradas**. No trae respuestas: es la consigna.

Es, en los hechos, el temario evaluable del módulo 2. Está desarrollado pregunta por pregunta en
**[[banco-parcial-2-ambiental]]**.

> [!warning] La guía no está fechada
> Sus metadatos internos dicen `CreationDate D:20170214` y su preg. 35 llama "reciente" a la cumbre
> de Kigali (2016). **Nadie confirmó que siga vigente en 2026.** Es H-19 en [[huecos]] y C-24 en
> [[contradicciones]], y es la pregunta de mayor retorno para hacer en clase.

**No hay** una guía equivalente para el parcial del módulo 1.

### El final es integrador: tiene las dos secciones

[[finales-soa-compilado]] —compilado de alumnos, no de cátedra— trae tres finales completos
(2Q2019, 1Q2020 y 2Q2020) y **los tres tienen la misma estructura**:

| | Estructura |
|---|---|
| **Sección Ocupacional** | módulo 1 |
| **Sección Ambiental** | módulo 2 |

Eso responde una de las preguntas que esta página tenía abiertas: **el final no se rinde por
módulo, se rinde entero y cubre los dos**. Con la salvedad de que la fuente es de alumno y de
2019–2020, así que el formato pudo cambiar.

El formato es **multiple choice**, y con un patrón táctico que conviene saber: *"ninguna de las
anteriores"* aparece como opción con muchísima frecuencia y **muchas veces es la correcta**. El
detalle, con el inventario de temas y las trampas, está en **[[guia-de-finales]]**.

## Lo que sigue sin saberse

Ninguna de estas cosas figura en el material disponible, y **no hay que suponerlas**:

- Las **fechas** de los dos parciales y del recuperatorio. **Sigue siendo lo más caro que falta.**
- La **ponderación** de cada módulo en la nota final, y si el final promedia o reemplaza.
- Las **condiciones de asistencia**.
- **Cuál de los dos criterios de aprobación rige** (C-26): el de la Clase 1 o el del programa.
- Si **la guía de preguntas del parcial 2 sigue vigente** (H-19).
- Si existe una **guía equivalente para el parcial 1** que no tengamos.

Lo que **sí** entró a `raw/material_catedra/` es el [[programa-oficial-12-83|programa oficial]],
que cerró los TP, la modalidad de examen, el alcance del recuperatorio y el carácter presencial de
las clases. Lo que falta ahora son **fechas**, que un programa no trae: eso sale de un cronograma.
Ver [[huecos]] y [[cronograma]].

## Cómo se estudia para cada instancia

| Instancia | Por dónde |
|---|---|
| **Parcial módulo 1** | El temario del slide 5 es el índice. Ver [[modulo-1-seguridad]] para el mapeo tema → página, y [[repaso-parcial-modulo-1]] para la hoja de repaso |
| **Parcial módulo 2** | **[[banco-parcial-2-ambiental]]** — las 80 preguntas de la guía de cátedra, con respuesta. Ver también [[modulo-2-ambiente]] |
| **Final** | **[[guia-de-finales]]** — estructura, temas de las dos secciones y las trampas verificadas |

## Fuentes

- [[clase-01]] — `raw/clases/1er clase SOyA - V-3.pdf`, slide 3. **Cátedra.**
- [[programa-oficial-12-83]] — `raw/material_catedra/12.83 - Seguridad Ocupacional y Ambiental.pdf`,
  pp. 5-6. **Cátedra**, pero versión 2023.
- [[guia-parcial-2-ambiental]] — `raw/examenes/preguntas tipo 2do parcial.pdf`. **Cátedra.**
- [[finales-soa-compilado]] — `raw/examenes/FINALES SOA [COMPILADO].pdf`. Alumno: la estructura del
  final sale de acá y no está confirmada por la cátedra.
