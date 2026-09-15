---
titulo: Barrera
tipo: concepto
modulo: [1]
clase: [2]
division: "1"
tags: [barrera, prevencion, proteccion, hollnagel]
fuentes: [clase-02]
actualizado: 2026-08-13
estado: en-desarrollo
aliases: [barreras]
resumen: '"Un medio físico o no-físico cuya función planificada es la de prevenir, controlar o mitigar eventos no deseados o accidentes" (Hollnagel, 2006) (Clase 2, slide 9) — y el criterio con el que se clasifica cada barrera como preventiva (actúa sobre la probabilidad) o protectiva (actúa sobre la gravedad) es la herramienta central del ejercicio-barreras.'
---

## En una línea

"Un medio físico o no-físico cuya función planificada es la de prevenir, controlar o mitigar
eventos no deseados o accidentes" (Hollnagel, 2006) (Clase 2, slide 9) — y el criterio con el que
se clasifica cada barrera como **preventiva** (actúa sobre la probabilidad) o **protectiva** (actúa
sobre la gravedad) es la herramienta central del [[ejercicio-barreras]].

## Desarrollo

### La definición

> "Para evitar las pérdidas podemos interponer 'barreras'. Una barrera es: un medio físico o
> no-físico cuya función planificada es la de prevenir, controlar o mitigar eventos no deseados o
> accidentes." (Hollnagel, 2006) (Clase 2, slide 9)

Dos cosas hay que retener de esta definición. Primero, que una barrera puede ser **física o
no-física** — no hace falta que sea un objeto para contar como barrera. Segundo, que su función es
**planificada**: una barrera es algo que alguien puso ahí a propósito, no un accidente de
circunstancias que casualmente evitó un daño.

### Física vs. no-física

La cátedra no da una lista cerrada de ejemplos en este slide, pero el resto de la clase (slides 12
y 13, ver [[02-04-prevencion-y-proteccion]]) sí distingue explícitamente entre "controles de
ingeniería" y "controles administrativos", que es la misma partición física/no-física aplicada.

> **Inferencia:** la tabla que sigue no está en la Clase 2 — es una extrapolación propia de esa
> partición ingeniería/administrativo a ejemplos concretos, para ilustrar el criterio. Ningún ítem
> de la columna "Física" ni de "No-física" fue verificado contra el texto de la fuente.
>
> | Física | No-física |
> |---|---|
> | Guardas y resguardos de máquina | Procedimiento de trabajo seguro |
> | Vallado perimetral | Permiso de trabajo |
> | Válvula de alivio de presión | Capacitación / formación |
> | Muro de contención de derrames | Norma o política interna |
> | Elemento de Protección Personal (EPP) — ver [[02-07-epp]] | Señalización y cartelería |
> | Sistema de rociadores (*sprinklers*) | Procedimiento de emergencia / simulacro |

### El criterio de clasificación: preventiva vs. protectiva

Éste es el criterio operativo, el que hace falta para resolver el ejercicio de barreras:

- **Preventiva** — actúa **antes** de que el evento se desencadene, reduciendo la
  **probabilidad** de que ocurra. Es la herramienta que la clase llama "Prevención" (slide 10).
- **Protectiva** — actúa **durante o después** de que el evento ya se desencadenó, reduciendo la
  **gravedad** del daño. Es la herramienta que la clase llama "Protección" (slide 10).

Esta partición es exactamente la de `R = P × G` (ver [[01-05-riesgo]]): prevención interviene la
`P`, protección interviene la `G`. La [[02-05-secuencia-del-accidente|secuencia del accidente]]
(slide 11) la ubica además en el tiempo: lo preventivo actúa antes de la pérdida de control, lo
protectivo después, "para controlar y mitigar" ([[erik-hollnagel]]).

> [!important] El caso límite: una barrera de ingeniería puede ser protectiva
> El eje de clasificación **no es "física vs. no-física" ni "de ingeniería vs. administrativa"**:
> es **cuándo actúa respecto del evento**, el mismo criterio antes/después que ubica la
> [[02-05-secuencia-del-accidente|secuencia del accidente]] (slide 11). Una barrera puede ser un
> dispositivo de ingeniería y aun así ser **protectiva** si actúa **una vez que el evento ya se
> desencadenó**, para acotar el daño en curso, en vez de **preventiva** si actúa **antes**, para
> que el evento no llegue a ocurrir.
>
> Este es el punto que más se presta a confusión en el [[ejercicio-barreras]]: **no alcanza con
> preguntar "¿es física o de ingeniería?" para decidir si una barrera es preventiva.** Hay que
> preguntar **"¿actúa antes o después de que el evento ya se desencadenó?"**.
>
> **Inferencia:** ninguno de estos dos ejemplos concretos figura en la Clase 2. Un sistema de
> rociadores contra incendios (*sprinklers*) sería, por este criterio, un control de ingeniería
> que actúa **después** de que el fuego ya se inició (protectivo, no preventivo, aunque sea
> "ingeniería" en el sentido de [[02-06-jerarquia-de-controles]]); una guarda mecánica que impide
> el contacto con la parte móvil de una máquina sería, en cambio, preventiva, porque actúa antes de
> que el evento (el contacto) pueda ocurrir. Son ejemplos de manual para fijar el criterio, no
> contenido de la fuente — verificar contra el material real antes de usarlos en un parcial.

## En la materia

Slides 9 y 10 de la Clase 2, inmediatamente después del giro hacia las fallas de gestión
([[02-02-causas-de-los-accidentes]]) y antes de la secuencia del accidente (slide 11) y del
desarrollo detallado de "prevenir es" / "proteger es" (slides 12-13,
[[02-04-prevencion-y-proteccion]]). Es, junto con `R = P × G`, el eje sobre el que se construye
todo lo que sigue en el módulo 1 — y la base teórica directa del [[ejercicio-barreras]].

## Relación con otros temas

- [[erik-hollnagel]] — autor de la definición y de la secuencia preventivo/protectivo.
- [[william-johnson]] — su definición de accidente (1973) ya nombraba la "falta de barreras" como
  causa; Hollnagel treinta años después desarrolla en detalle qué es una barrera.
- [[01-05-riesgo]] — `R = P × G` es la ecuación que la clasificación preventiva/protectiva
  interviene.
- [[02-04-prevencion-y-proteccion]] — desarrollo completo de "prevenir es" / "proteger es".
- [[02-05-secuencia-del-accidente]] — ubica temporalmente el corte preventivo/protectivo.
- [[02-06-jerarquia-de-controles]] — ordena las barreras por eficacia, un eje distinto (pero
  relacionado) al de esta página.
- [[ejercicio-barreras-consigna]], [[ejercicio-barreras]] — el trabajo práctico que aplica este
  criterio a un caso real.

## Fuentes

- (Clase 2, slide 9 — citado como "Hollnagel, 2006") — [[clase-02]]
- (Clase 2, slide 10) — [[clase-02]]
