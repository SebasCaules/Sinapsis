---
title: Paradigmas de control de acceso
resumen: 'Eje que separa el acceso discrecional, donde quien crea la información controla el acceso y las reglas pueden alterarse, del mandatorio, con reglas fijadas por el sistema e inalterables. En Bell-LaPadula ambos se combinan.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[politica-de-seguridad-y-sistema-seguro]]", "[[bell-lapadula]]"]
aliases: [Acceso discrecional, Acceso mandatorio, Control de acceso discrecional, Control de acceso mandatorio, ORCON, Originator-controlled]
type: concepto
unidad: 2
clase: 6
orden: 3
created: 2026-09-04
updated: 2026-09-04
tags: [politicas-de-seguridad, control-de-acceso, dac, mac, orcon, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Paradigmas de control de acceso

**El eje —quién fija las reglas de acceso y quién puede alterarlas— que después reaparece, sin volver a nombrarse, adentro de la letra chica de Bell-LaPadula.** Es la nota más corta de la clase en filminas y la única con una discrepancia declarada entre lo que el nombre del concepto promete y lo que el material realmente trae.

Cubre la filmina **9** del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es **04/09/2026**, la clase es el **01/10/2026**— así que esta nota está escrita contra el PDF, sin transcripción.

## Los dos paradigmas de la filmina

Las políticas de control de acceso se centran en controlar el acceso a **objetos**, y la filmina 9 distingue dos paradigmas por quién fija las reglas y si se pueden alterar:

$$\begin{array}{l|l|l}
 & \text{Acceso Discrecional (DAC)} & \text{Acceso Mandatorio (MAC)}\\ \hline
\text{Reglas} & \text{Arbitrarias (\emph{ad hoc})} & \text{Prefijadas}\\
\text{Mecanismos} & \text{Puntuales} & \text{Del sistema}\\
\text{¿Se pueden alterar?} & \text{Sí — opcionalmente} & \textbf{No}
\end{array}$$

En **acceso discrecional**, quien **crea** la información puede controlar el acceso a ella — la filmina lo marca como opcional, no como parte obligatoria del modelo: un sistema DAC no exige que exista control, sólo lo habilita a discreción del creador. En **acceso mandatorio**, las reglas están fijadas por el sistema y **no pueden ser alteradas** por ningún sujeto, ni siquiera por el creador del objeto.

## Por qué "mandatorio" no significa "sin discreción en absoluto"

La distinción DAC/MAC no es una dicotomía excluyente entre sistemas: reaparece **combinada** en la letra chica de [[bell-lapadula|Bell-LaPadula]], que es el primer modelo concreto que da la clase. La condición de seguridad simple de BLP dice que $S$ puede leer $O$ si y sólo si $L(O) \le L(S)$ **y** $S$ tiene permiso discrecional para leer $O$: la parte de niveles es MAC (fijada, no negociable), y el permiso discrecional es DAC (puede restringir más, dentro de lo que el nivel ya permite). La filmina de BLP lo deja escrito como regla explícita: *"los accesos discrecionales solo pueden restringir a los mandatorios, no contradecirlos"*. Es la instancia concreta de este paradigma general: **DAC nunca amplía lo que MAC prohíbe, sólo puede acotar más dentro de lo permitido**. Cualquier sistema real que combine los dos —y la mayoría los combina— tiene que respetar ese orden de prioridad.

## Lo que la filmina no trae: ORCON

*(Precisión sobre la fuente, no un desarrollo de contenido de cátedra.)* El nombre de este concepto suele ir acompañado, en la literatura (Bishop, cap. 4), de un tercer paradigma: **ORCON** (*originator-controlled*), en el que el creador de la información retiene control sobre su redistribución incluso después de que otros sujetos la reciben —ni el sujeto que la crea original ni quien la recibe puede reclasificarla sin permiso del originador—. Es un híbrido entre DAC (el originador decide) y MAC (la regla se aplica de forma no negociable a cualquiera que reciba el dato, incluidos receptores posteriores).

Verificado sobre la filmina 9 renderizada: **ORCON no aparece**. La lámina completa son sólo las dos viñetas de DAC y MAC de la tabla de arriba. Tampoco hay ninguna otra mención a ORCON en el resto de los dos decks de esta clase (Políticas ni Control de acceso). Si se necesita para el parcial, hay que tenerlo presente como **lectura externa**, no como contenido dado por la cátedra en esta clase — la [[clase-06-politicas-de-seguridad-y-control-de-acceso#3. Paradigmas de control de acceso|nota de clase]] deja la misma constancia.

## Dónde reaparece la distinción en el resto de la clase

- **[[lenguajes-de-descripcion-de-politicas|Lenguajes de descripción de políticas]]**: la distinción entre lenguajes *cerrados* (deny by default) y *abiertos* (allow by default) es, en espíritu, la misma tensión de fondo que DAC/MAC — reglas explícitas y restrictivas contra reglas permisivas por omisión.
- **[[listas-de-control-de-acceso|Listas de control de acceso]]**: el "principio de denegar por defecto" —si un sujeto no tiene entrada en el ACL, no tiene ningún derecho— es la forma concreta que toma DAC en la práctica: el dueño de un objeto decide, entrada por entrada, quién accede.
- **[[composicion-de-politicas|Composición de políticas]]**: cuando se componen dos políticas, el "principio de denegación por defecto" vuelve a aparecer como una de las dos salidas posibles para los casos que ninguna política original cubre — la misma lógica restrictiva de MAC, aplicada ahora a huecos de especificación en vez de a niveles de seguridad.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#3. Paradigmas de control de acceso|Clase 06 — Políticas de seguridad y control de acceso § 3. Paradigmas de control de acceso]]
- [[politica-de-seguridad-y-sistema-seguro|Política de seguridad y sistema seguro]]
- [[lenguajes-de-descripcion-de-politicas|Lenguajes de descripción de políticas]] — la misma tensión reglas-explícitas-contra-permisivas, en la forma de escribir la política
- [[bell-lapadula|Bell-LaPadula]] — dónde DAC y MAC se combinan explícitamente, con la regla de que uno restringe al otro y nunca al revés
- [[listas-de-control-de-acceso|Listas de control de acceso]] — DAC llevado a un mecanismo concreto, con el principio de denegar por defecto
- [[composicion-de-politicas|Composición de políticas]] — el principio de denegación por defecto vuelto a aparecer en otro contexto
