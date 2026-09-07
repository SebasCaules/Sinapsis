---
title: Políticas de control de flujo
resumen: 'Los dos requisitos mínimos de toda política de control de flujo, reflexión y transitividad, y la relación de dominancia de Bell-LaPadula aplicada al flujo en tres casos, sin el modelo completo de la Clase 6.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[video-11-flujo-de-informacion]]", "[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[control-de-acceso-y-flujo-de-informacion]]"]
aliases: [Políticas de control de flujo, Reflexión y transitividad del flujo, Requerimientos de una política de flujo, Dominancia aplicada al flujo, Bell-LaPadula aplicado al flujo]
type: concepto
unidad: 2
clase: 9
orden: 5
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, flujo-de-informacion, politicas, bell-lapadula, transitividad, dominancia, clase-09, bloque-2, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Políticas de control de flujo

**Los dos requisitos mínimos —reflexión y transitividad— que toda política de control de flujo debe cumplir, y cómo la relación de dominancia de Bell-LaPadula, que la [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 6]] ya desarrolla en detalle, instancia esos dos requisitos sobre el caso `/tmp` con el que arrancó esta clase.**

Cubre las filminas **14 y 15** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf`. La clase (22/10/2026) todavía no se dictó: hoy es 04/09/2026, no hay transcripción de esta cursada, y esta nota está escrita contra el PDF de filminas, contra [[video-11-flujo-de-informacion|video-11]] —clase grabada de otra cursada, citada como contraste— y contra [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 06 — Políticas de seguridad y control de acceso]], que en este vault sí desarrolla el modelo Bell-LaPadula completo. Todo lo que no sale literal de la filmina va rotulado como *(lectura nuestra)*.

## Reflexión y transitividad

**Filmina 14.** Toda política de control de flujo de información debe cumplir con dos principios:

$$\textbf{Reflexión: } a, b \text{ en la misma clase}, \ a \text{ puede leer/escribir } o_1 \ \implies\ b \text{ puede leer/escribir } o_1$$

$$\textbf{Transitividad: } a, b \text{ en clases distintas}, \ a \text{ puede escribir } o_1 \text{ y leer } o_2, \ b \text{ puede leer } o_1 \ \implies\ b \text{ eventualmente puede leer } o_2$$

La reflexión es la parte fácil: si dos sujetos comparten clase, tiene que valer lo mismo para los dos —de lo contrario la "clase" no estaría cumpliendo su función de agrupar sujetos equivalentes—. La transitividad es la que muerde: formaliza que la información se escurre por **caminos indirectos** de más de un salto. Es, precisamente, el fenómeno de [[control-de-acceso-y-flujo-de-informacion#El escenario: exámenes y /tmp|Control de acceso y flujo de información]]: $b$ (`juan`) puede leer $o_1$ (`/tmp`), que porta lo que $a$ (el proceso del editor, escribiendo por cuenta de `pablo`) volcó ahí a partir de $o_2$ (el examen); la transitividad dice que, en esas condiciones, $b$ termina teniendo acceso efectivo a la información de $o_2$ aunque nunca haya tocado ese objeto directamente. *(Lectura nuestra: la filmina no vuelve explícitamente sobre el ejemplo de `/tmp` en este punto; la conexión con la sección 1 de esta clase es nuestra, y la correspondencia exacta de roles —quién es $a$, quién es $b$— no está desarrollada por la fuente más allá de la analogía general.)*

## La relación de dominancia de Bell-LaPadula aplicada al flujo

**Filmina 15.** Acá aparece la **relación de dominancia** de Bell-LaPadula — no el modelo completo. Los tres casos que desarrolla la filmina:

| Caso | Configuración | Qué se concluye |
|---|---|---|
| 1 | $a,b,o \in C_1$ (misma clase) | Dominancia mutua: $a \operatorname{dom} o$ y $o \operatorname{dom} a$, igual con $b$. Tanto $a$ como $b$ pueden **leer y escribir** $o$ |
| 2 | $a \in C_1$, $b \in C_2$ con $C_2 \operatorname{dom} C_1$, $o \in C_1$ | Como $b \operatorname{dom} a$ y $a \operatorname{dom} o$, entonces **$b \operatorname{dom} o$** por transitividad, y $b$ puede leer $o$ |
| 3 | Igual que el 2, más una restricción discrecional en curso $(b,-,C_1)$ | $a$ puede leer $o$ y escribir $o'$ en $C_2$, que $b$ **sí** puede leer: la restricción discrecional se elude por el camino indirecto |

### Estos tres casos, contra la maquinaria completa de la Clase 6

La [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 6]] sí desarrolla el modelo [[bell-lapadula|Bell-LaPadula]] entero, con sus dos condiciones formales sobre niveles $l,l'$ y conjuntos de categorías $C,C'$:

$$\textbf{Condición de seguridad simple: } S \text{ puede leer } O \iff L(S) \operatorname{dom} L(O) \ \wedge\ S \text{ tiene permiso para leer } O$$
$$\textbf{Condición de cierre (*-property): } S \text{ puede escribir } O \iff L(O) \operatorname{dom} L(S) \ \wedge\ S \text{ tiene permiso para escribir } O$$

donde $(l,C) \operatorname{dom} (l',C') \iff l' \le l \ \wedge\ C' \subseteq C$. La cláusula de permiso es la capa discrecional (DAC) montada sobre la dominancia (MAC): la dominancia sola nunca alcanza, hace falta además el permiso puntual sobre ese objeto. Los tres casos de la filmina 15 son instancias directas de estas dos condiciones —tomando, para los casos 1 y 2, que el permiso discrecional está otorgado por defecto, ya que la filmina no lo pone en juego hasta el caso 3 *(lectura nuestra)*—:

**Caso 1** aplica ambas condiciones a la vez: como $a$, $b$ y $o$ comparten clase $C_1$, la dominancia es mutua en las dos direcciones ($a \operatorname{dom} o$ y $o \operatorname{dom} a$), así que tanto la condición de lectura ($L(a)\operatorname{dom} L(o)$) como la de escritura ($L(o)\operatorname{dom} L(a)$) se cumplen para ambos sujetos — de ahí que puedan leer **y** escribir.

**Caso 2** es la condición de seguridad simple sola: $b$ puede leer $o$ porque $L(b) = C_2 \operatorname{dom} C_1 = L(o)$. *(Lectura nuestra.)* Vale la pena notar que la derivación de la filmina —"$b\operatorname{dom} a$, $a \operatorname{dom} o$, luego $b\operatorname{dom} o$ por transitividad"— es correcta pero da un rodeo innecesario: como $C_2 \operatorname{dom} C_1$ ya está dado como hipótesis y $o \in C_1$, $b \operatorname{dom} o$ se sigue de manera **directa** de la definición de dominancia entre clases, sin necesidad de pasar por $a$ como intermediario. El paso por $a$ no está mal, pero no es el camino más corto hasta la conclusión.

**Caso 3** es donde interactúan las dos capas del modelo: MAC (la dominancia, que no se negocia) y DAC (la restricción discrecional $(b,-,C_1)$, que sólo puede restringir, nunca ampliar lo que MAC permite) — exactamente la distinción de [[paradigmas-de-control-de-acceso|Paradigmas de control de acceso]] de la Clase 6: *"los accesos discrecionales solo pueden restringir a los mandatorios, no contradecirlos"*. Ninguna fuente del vault —ni esta filmina, ni el video de la cátedra, ni la Clase 6— define la sintaxis exacta de la terna $(b,-,C_1)$, pero dos piezas ya disponibles alcanzan para una lectura razonable *(inferencia nuestra)*: el signo $-$ es, en la [[listas-de-control-de-acceso|notación de ACLs de la Clase 6]], exactamente el símbolo del derecho **revocado** —"cada derecho tiene tres estados posibles: otorgado ($+$), no asignado, revocado ($-$)... el revocado pesa más que cualquier cantidad de otorgados"—, y el patrón general es el de un permiso discrecional que **restringe** lo que MAC ya autoriza. Leído así, $(b,-,C_1)$ es una restricción discrecional que revoca a $b$ el acceso a objetos de la clase $C_1$ **a pesar de** que la dominancia ya lo permitiría — y la filmina muestra exactamente cómo ese candado puntual se elude: $a$ (que sí puede leer $o \in C_1$) escribe la misma información en $o' \in C_2$, que $b$ puede leer sin tropezar con ninguna restricción, porque la restricción discrecional sólo mencionaba $C_1$. Es la transitividad de la sección anterior, con nombres concretos.

## Alcance de esta sección, para no leer de más

Esto es **sólo** la relación de dominancia trasladada al problema del flujo: no aparecen aquí la *simple security property* ni la *-property* completas con su vocabulario de sujetos, objetos y permisos discrecionales explícitos —esas sí están desarrolladas, con demostración del [[bell-lapadula#Teorema básico de la seguridad, y por qué hace falta la condición de cierre|teorema básico de la seguridad]] incluido, en la Clase 6—, y tampoco aparecen acá Biba ni la muralla china, que resuelven problemas distintos (integridad, conflicto de interés) con la misma maquinaria de niveles y dominancia. Quien busque el modelo completo tiene que ir a esa clase; esta sección de la Clase 9 sólo toma prestada la relación de orden para ilustrar cómo una política de flujo concreta puede construirse sobre ella.
