---
title: Control de acceso y flujo de información
resumen: 'Por qué controlar el acceso a un objeto no controla la información que ese objeto contiene: el contraejemplo de la copia de trabajo en /tmp y la tesis de que las políticas restringen el flujo, no el acceso.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[video-11-flujo-de-informacion]]"]
aliases: [Control de acceso y flujo de información, Control de acceso vs. flujo, ACLs y flujo de información, Objeto vs. información, Mecanismos abiertos de control de acceso]
type: concepto
unidad: 2
clase: 9
orden: 1
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, flujo-de-informacion, control-de-acceso, acl, clase-09, bloque-2, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Control de acceso y flujo de información

**Por qué controlar el acceso a un objeto no alcanza para controlar la información que ese objeto contiene, y el contraejemplo mínimo — una copia de trabajo en `/tmp` — que lo demuestra sin necesidad de ningún ataque sofisticado.**

Cubre las filminas **2 a 5** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf`. La clase (22/10/2026) todavía no se dictó: hoy es 04/09/2026, no existe transcripción de esta cursada, y esta nota está escrita contra el PDF de filminas, contra la nota de clase ya redactada — [[clase-09-flujo-de-informacion|Clase 09 — Flujo de información]] — y, como contraste externo, contra [[video-11-flujo-de-informacion|video-11]], la grabación de una clase de otra cursada (10/05/2024) sobre el mismo deck. Todo lo que no sale literal de la filmina va rotulado como *(lectura nuestra)*.

## El escenario: exámenes y /tmp

**Filminas 2 y 3.** El caso de cátedra: permitir que los docentes escriban los exámenes e impedir que los alumnos accedan a ellos. La ACL del directorio de exámenes es explícita:

$$\mathrm{ACL}(\texttt{/var/cys/examenes}) = \{(\texttt{pablo},r),\ (\texttt{ana},r)\}$$

Sólo `pablo` y `ana` tienen siquiera lectura; `juan` no aparece, así que no tiene ningún derecho sobre ese directorio — el **principio de denegar por defecto**, la misma regla con la que trabajan las [[listas-de-control-de-acceso|ACLs completas]] de la Clase 6: un sujeto sin entrada no tiene derechos, punto. Hasta acá el control de acceso funciona exactamente como se espera.

La segunda ACL es la que rompe la ilusión:

$$\mathrm{ACL}(\texttt{/tmp}) = \{(\texttt{pablo},rw),\ (\texttt{ana},rw),\ (\texttt{juan},rw)\}$$

`/tmp` es un directorio distinto, con su propia política, y `juan` sí tiene lectura y escritura ahí — no hay nada incorrecto en esa ACL tomada de manera aislada. El golpe llega con la pregunta de la filmina 3: **¿qué ocurre si el editor de textos guarda una copia de trabajo en `/tmp` mientras alguien edita el examen?** Ese archivo temporal es, en contenido, el mismo examen. Pero como objeto es **distinto** del que protege $\mathrm{ACL}(\texttt{/var/cys/examenes})$: no tiene ninguna entrada propia y explícita, sólo la ACL general y permisiva de `/tmp` de la que hereda por estar ahí. `juan` nunca aparece en $\mathrm{ACL}(\texttt{/var/cys/examenes})$, y sin embargo puede terminar leyendo el contenido del examen con sólo mirar `/tmp`.

## La tesis: las políticas restringen el flujo, no el acceso

**Filmina 4.** De ese ejemplo sale la afirmación que sostiene toda la clase:

> **Las políticas, por lo general, restringen el flujo de información y no el acceso a los objetos.**

La filmina lo fija con una comparación mínima:

- Evitar que un empleado **sepa** el sueldo de otro
- versus evitar que un empleado **acceda** a la base de datos de sueldos

Son dos objetivos distintos, y el segundo no implica el primero. Es la misma base de sueldos que aparece en [[maleabilidad#El escenario: la base de sueldos|Maleabilidad]], mirada desde el ángulo opuesto: allá el atacante no necesita la clave para modificar quirúrgicamente un criptograma y así *escribir* un sueldo falso; acá el problema es que un empleado *lea* el sueldo real por un camino —una copia, un reporte derivado, un comentario de un compañero— que ninguna ACL sobre la base de datos original contempló. Los dos ataques comparten el mismo diagnóstico de fondo: controlar el objeto (la fila cifrada, el archivo) no controla lo que pasa con la información una vez que sale de ahí.

Cierre de la filmina, con la pregunta retórica que se contesta sola: **¿entonces las ACLs no sirven? Sirven, pero por lo general son mecanismos abiertos, y deben ser complementados.**

### Qué significa "mecanismo abierto" acá

La filmina no define el término, y conviene no forzar una lectura única. Hay una distinción homónima y precisa en los [[lenguajes-de-descripcion-de-politicas|lenguajes de descripción de políticas de la Clase 6]]: un lenguaje de políticas **cerrado** lista qué se permite —lo no mencionado queda denegado por defecto— y uno **abierto** lista qué se prohíbe —lo no mencionado queda permitido por defecto—. *(Lectura nuestra.)* Es tentador leer "mecanismo abierto" de la filmina 4 como ese mismo "abierto" —ACL = lenguaje cerrado, entonces "abierto" tendría que ser lo opuesto y no encajar—, pero la propia ACL de la filmina 2 **es** denegar-por-defecto (cerrada, en la terminología de la Clase 6) y aun así falla. La lectura que sí es consistente con el ejemplo: "abierto" describe que el mecanismo **no cierra todos los caminos** por los que la información puede moverse —dejar `/tmp` fuera de su radar es, literalmente, dejar una puerta abierta—, no el sentido técnico de "lenguaje de política abierto" de la Clase 6. Ambos usos comparten la palabra y la intuición de "algo queda sin cubrir", pero no son la misma definición formal, y la filmina no alcanza a precisar cuál de las dos tenía en mente.

## Objeto vs. información

**Filmina 5.** La síntesis formal de por qué el control de acceso, tomado solo, es una visión incompleta:

| Control de acceso | Pero |
|---|---|
| Limita el acceso a operaciones sobre objetos | La información no es estática |
| Los objetos contienen información → limita el acceso a información | Es actualizada, y puede copiarse |

El argumento en una frase: controlar el acceso a un objeto controla el acceso **a ese objeto**, no a la información que contiene, porque esa información puede escaparse del objeto —copiándose a otro objeto, derivándose en un reporte, transformándose en un cálculo— sin que ninguna operación sobre el objeto original quede registrada. El control de acceso es, en este sentido, una fotografía de un instante sobre una entidad estática; la información real es un fluido que atraviesa esa fotografía y sigue de largo.

### Por qué ni siquiera la maquinaria completa de ACLs resuelve esto

Vale la pena ser preciso sobre el alcance de la objeción, porque no es una limitación de esta ACL puntual sino de todo el modelo. La [[listas-de-control-de-acceso|nota de ACLs de la Clase 6]] formaliza la ACL de un objeto como

$$\mathrm{ACL}(o) = \{(s_i, r_i) \mid s_i \in S,\ r_i \subseteq R\}$$

y desarrolla grupos, resolución de conflictos, herencia de derechos por defecto y revocación en cascada — toda una teoría de qué puede hacer un sujeto sobre **un objeto dado**. *(Lectura nuestra.)* Nada de eso ayuda con el caso `/tmp`: por más sofisticada que sea la ACL de `/var/cys/examenes`, sigue siendo una ACL sobre **ese** objeto, y el archivo temporal en `/tmp` es un objeto **distinto**, con su propia ACL, que no hereda ni referencia a la primera de ninguna manera. Incluso las [[listas-de-capacidades|listas de capacidades]] —la proyección por sujeto en lugar de por objeto— tienen el mismo punto ciego: preguntan qué objetos puede tocar un sujeto, no qué pasa con la información una vez que un objeto autorizado la entrega. El problema no es de implementación de las ACLs sino de **nivel de abstracción**: todo el aparato de control de acceso opera sobre objetos, y el fenómeno que hay que controlar vive un nivel más abajo, en la información que esos objetos transportan.

La única pieza de esa maquinaria que sí empieza a comportarse como una política de *flujo* en vez de una de *acceso* es la *-property* de Bell-LaPadula —prohibir la escritura hacia niveles bajos precisamente para cerrar el canal indirecto de "leer arriba, escribir abajo"—, y es el puente hacia [[politicas-de-control-de-flujo|Políticas de control de flujo]] más adelante en esta misma clase.

## Qué falta para ir más allá de "sirve o no sirve"

La filmina 5 deja la objeción planteada mas no cuantificada: dice que la información se copia y se actualiza, pero no da una manera de medir *cuánta* información efectivamente pasó de un lado a otro. Esa pregunta —no "¿hay flujo?" sino "¿cuánto flujo hay?"— es la que motiva introducir entropía y entropía condicional en la sección siguiente del deck.
