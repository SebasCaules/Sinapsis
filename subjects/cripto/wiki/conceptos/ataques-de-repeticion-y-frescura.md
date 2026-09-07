---
title: Ataques de repetición y frescura
resumen: 'Un MAC infalsificable no impide que un atacante reenvíe tal cual un mensaje válido: el experimento Mac-Forge deja el replay afuera por definición, y la frescura la aporta el protocolo con números de secuencia o timestamps.'
fuentes: ["[[practica-04-macs-hash-y-cifrado-autenticado]]", "[[seguridad-de-un-mac]]"]
aliases: [Ataques de repetición y frescura, Ataque de repetición, Replay, Replay attack, Frescura, Freshness, Número de secuencia, Números de secuencia, Timestamp, Timestamps, Ataque de reflexión]
type: concepto
unidad: 1
clase: 3
orden: 18
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, mac, replay, frescura, integridad, protocolos, nonce, numero-de-secuencia, timestamp, clase-03, practica-04]
sources: ["Clase 4.pdf (Práctica 4, 31/08/2026)", "Katz & Lindell cap. 4"]
---

# Ataques de repetición y frescura

**Un MAC puede ser demostrablemente infalsificable y no impedir que un atacante reenvíe diez veces la misma orden de transferencia bancaria.** El agujero no está en la construcción: está en la **definición**, y por lo tanto lo heredan por igual todos los esquemas que la cumplen. Ésta es la nota donde se ve que la frontera entre lo que resuelve la primitiva y lo que tiene que resolver el protocolo que la usa no es difusa —está trazada con precisión, y este ataque cae del otro lado.

Sale de una sola fuente de la cátedra: **la filmina 2 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] (31/08)**, donde aparece con un triángulo rojo de advertencia. En todo el resto del material de la Clase 03 no existe.

---

## La advertencia, y dónde está exactamente

La filmina 2 de la práctica rehace el experimento [[seguridad-de-un-mac#El experimento Mac-Forge|Mac-Forge]] —que la teoría ya había dado el 27/08 en su filmina 15— y le agrega abajo una banda que la teoría no tiene: un triángulo de advertencia rojo, una caja de borde rojo y una flecha bifurcada hacia dos remedios.

> *"MAC no protege contra ataques de **REPLAY**"* — con una flecha que se abre hacia **"N° de secuencia"** y **"Timestamps"**.

**Es el único lugar donde la cátedra lo dice**, y conviene dejar registrado hasta dónde se verificó:

| Fuente | ¿Menciona replay? |
|---|---|
| Las 41 filminas del PDF de teoría de la Clase 03 | No |
| Los 873 cues de la transcripción del **27/08** | No |
| Los 910 cues de la transcripción del **03/09** | No |
| Filmina 2 de la Práctica 04 (31/08) | **Sí**, con las dos contramedidas |

O sea que quien haya cursado sólo la teoría no vio nunca esta advertencia, y quien lea sólo el deck de teoría tampoco la va a encontrar. *(El vault, hasta esta nota, la tenía únicamente como apostilla de libro dentro de [[seguridad-de-un-mac#Lo que la definición no cubre|Seguridad de un MAC]]; ahora se sabe que es material de cátedra.)*

## Por qué Mac-Forge no captura el replay

Ésta es la parte que hay que entender, y es más fina de lo que parece.

**Qué es un replay.** El adversario observa el par $(m,t)$ que una parte honesta emitió y lo **reenvía tal cual**, sin modificar nada. No falsifica: copia.

**Qué pide el experimento.** [[seguridad-de-un-mac#El experimento Mac-Forge|Mac-Forge]] declara éxito si y sólo si se cumplen **las dos** condiciones:

$$\text{(1)}\ \ \mathsf{Vrfy}_k(m,t) = 1 \qquad \text{y} \qquad \text{(2)}\ \ m \notin Q$$

donde $Q$ es el conjunto de mensajes que el adversario le consultó al oráculo $\mathsf{Mac}_k(\cdot)$.

**Y ahí se cae.** Un adversario que reenvía cumple (1) —la etiqueta es legítima, claro que verifica— y **falla (2) por construcción**: el mensaje que reenvía es exactamente uno que ya fue autenticado. Si lo obtuvo del oráculo, entonces $m \in Q$ literalmente. Por lo tanto, para **cualquier** esquema $\Pi$ y cualquier adversario $A$ que se limite a repetir,

$$\Pr\bigl[\mathsf{Mac\text{-}Forge}_{A,\Pi}(n) = 1\bigr] = 0$$

**El replay no es que gane con probabilidad baja: pierde el experimento con probabilidad 1.** Tiene ventaja exactamente cero, y aun así puede vaciar una cuenta bancaria. Eso es lo que quiere decir que el experimento **no lo modela**.

> **Lo más importante de toda la nota** *(lectura nuestra).* La vulnerabilidad **no es de ninguna construcción**. No es un defecto de [[cbc-mac|CBC-MAC]], ni de [[hmac|HMAC]], ni de la elección de la función pseudoaleatoria $F$. Está en la definición de seguridad, así que **la cumplen todos los esquemas seguros por igual**: un MAC ideal —uno que fuera literalmente una función aleatoria— es tan vulnerable al replay como el peor de los tres candidatos de la [[seguridad-de-un-mac#El ejercicio de los tres MACs|filmina 17]]. Mejorar la primitiva no ayuda, porque no hay nada que mejorar.

**La razón técnica, en una línea:** `Vrfy` **no tiene estado**. Es una función determinística de $(k, m, t)$ y de nada más, así que el mismo par válido presentado mil veces devuelve 1 las mil veces — no hay dónde anotar que ya se lo vio. La Definición 4.1 de Katz & Lindell no le da memoria al verificador, y sin memoria no hay manera de distinguir "primera vez" de "otra vez".

**Y no le da memoria a propósito.** El libro lo justifica: si un mensaje repetido "vale" o no vale **depende de la aplicación**. Dos órdenes de compra idénticas pueden ser dos compras legítimas o una compra duplicada, y la criptografía no tiene forma de saber cuál de las dos es. Como la definición de MAC se niega deliberadamente a suponer nada sobre la semántica de quien lo usa —la misma decisión de diseño que hace que [[seguridad-de-un-mac#Se considera roto aunque la falsificación no tenga sentido|Mac-Forge considere rota una falsificación aunque el mensaje falsificado no tenga sentido]]—, la decisión queda para el nivel de arriba.

> **El vocabulario que falta, y que conviene fijar** *(precisión nuestra).* Al MAC se le piden dos cosas: **integridad** (el mensaje no fue alterado) y **autenticación de origen** (lo produjo quien tiene la clave). El replay **no viola ninguna de las dos**: el mensaje reenviado está íntegro y su origen es legítimo. Lo que falta es una tercera propiedad, la **frescura** (*freshness*): que el mensaje sea de **ahora** y no de antes. **Integridad no es frescura**, y ninguna cantidad de MAC compra la segunda.

### El ejemplo canónico

Es el del libro, y vale la pena tenerlo con los números puestos. Alicia le pide al banco que transfiera 1000 dólares de su cuenta a la de Bob, y le adjunta la etiqueta $t = \mathsf{Mac}_k(m)$ para que el banco sepa que el pedido es auténtico.

- **Lo que el MAC sí impide:** que Bob intercepte el pedido y lo cambie por 10 000. Eso sería producir una etiqueta válida sobre un mensaje nunca autenticado, o sea exactamente una falsificación, o sea exactamente lo que `Mac-Forge` prohíbe.
- **Lo que el MAC no impide:** que Bob intercepte el pedido y lo reenvíe **diez veces**. El banco verifica las diez y transfiere 10 000. **Mismo resultado, y sin haber roto nada.**

Y el detalle que lo vuelve incómodo: las diez transferencias son **indistinguibles** de diez órdenes legítimas. El banco no puede detectarlo mirando los mensajes; sólo puede detectarlo si **guarda estado**.

## La respuesta no vive en la primitiva: vive en el protocolo

Las dos ramas de la flecha de la filmina son las dos técnicas estándar, y ninguna de las dos toca el MAC: las dos cambian **qué se autentica**.

### Número de secuencia

Las dos partes mantienen un contador $\mathrm{ctr}$ de mensajes enviados en la sesión, inicializado en 0. Para transmitir $m$:

$$t := \mathsf{Mac}_k\bigl(\mathrm{ctr} \Vert m\bigr), \qquad \text{enviar } \langle \mathrm{ctr},\, m,\, t\rangle, \qquad \mathrm{ctr} \mathrel{+}= 1$$

El receptor lleva su propio contador, acepta sólo si el $\mathrm{ctr}$ recibido es **el que esperaba** y recién entonces lo incrementa.

**Qué compra.** Un par $(m,t)$ vale **una sola vez**, y además queda fijado **en qué posición** de la conversación vale. Como efecto secundario, el receptor detecta también el reordenamiento y la pérdida.

**Qué cuesta.** **Estado sincronizado** entre las dos partes: hay que inicializarlo al abrir la sesión y mantenerlo hasta cerrarla. Sufre en canales con pérdida o reordenamiento —si un mensaje se pierde, el receptor se queda esperando un número que no va a llegar y rechaza todo lo que sigue—; Katz señala que el problema se puede mitigar, típicamente con una ventana de recepción, pero que no desaparece. Y es estado **por sesión**: reiniciar el contador sin cambiar la clave devuelve el problema entero.

### Timestamps

El emisor antepone la hora actual $T$ —el libro sugiere al milisegundo—, autentica y envía las tres cosas:

$$t := \mathsf{Mac}_k\bigl(T \Vert m\bigr), \qquad \text{enviar } \langle T,\, m,\, t\rangle$$

El receptor verifica **dos** cosas: que $t$ sea etiqueta válida de $T \Vert m$, **y** que $T$ caiga dentro de una ventana de tolerancia $\Delta$ alrededor de su propio reloj $T'$, es decir $\lvert T - T'\rvert \le \Delta$.

**Qué compra.** **No hace falta estado compartido**: el reloj hace de estado, y es un estado que las dos partes ya tienen sin haber acordado nada. Escala a muchos interlocutores sin llevar un contador por cada uno, y el timestamp queda además como dato de auditoría.

**Qué cuesta.** **Relojes sincronizados** con precisión mejor que $\Delta$, que es un requisito de infraestructura y no de criptografía. Y, sobre todo: **la ventana no se puede cerrar**. Mientras $\Delta > 0$, un replay ejecutado lo bastante rápido sigue pasando la verificación; y $\Delta$ no puede ser 0 porque dos relojes nunca coinciden exactamente. O sea que **el timestamp no elimina el replay: lo acota**. Elegir $\Delta$ es un compromiso puro: chico rechaza mensajes legítimos por deriva de reloj, grande deja más ventana de ataque.

### Las dos, comparadas

| | Número de secuencia | Timestamp |
|---|---|---|
| Qué hace de referencia | un contador que las partes mantienen | el reloj de pared |
| Estado compartido | **Sí**, hay que inicializarlo por sesión | No |
| Requisito de infraestructura | ninguno | **relojes sincronizados** |
| ¿Elimina el replay? | **Sí**, dentro de la sesión | **No**: queda la ventana $\Delta$ |
| Falla con | pérdida y reordenamiento de mensajes | deriva de reloj |
| Qué fija de yapa | el **orden** de los mensajes | la **hora** — sirve para auditoría |

> **Lo que la filmina dibuja pero no dice** *(precisión nuestra).* En las dos contramedidas, **lo que se autentica cambia**: la etiqueta se calcula sobre $\mathrm{ctr}\Vert m$ o sobre $T \Vert m$, **no** sobre $m$. Si el contador o la hora viajaran por fuera de la etiqueta, el adversario podría modificarlos a gusto y el remedio no serviría absolutamente de nada — reenviar $(m,t)$ cambiando el $T$ adjunto sería trivial. La filmina las dibuja como dos cajas colgando de una flecha, sin aclarar que entran **adentro** del `Mac`; es la aclaración sin la cual la contramedida no funciona.

## El cuadro completo: reordenamiento, repetición y reflexión

El replay no viene solo. Katz & Lindell lo trata en su lugar natural —§4.5.3, la **sesión de comunicación**— y ahí muestra que, aun usando [[cifrado-autenticado|cifrado autenticado]], que es lo más fuerte que la clase construye, quedan **tres** ataques posibles sobre la sesión:

| Ataque | Qué hace el adversario | Qué provoca |
|---|---|---|
| **Reordenamiento** | entrega $c_2$ antes que $c_1$ | las partes no coinciden en el orden de la conversación |
| **Repetición** (*replay*) | reenvía un $c$ válido ya emitido | el receptor procesa dos veces lo que se envió una |
| **Reflexión** | toma un $c$ que $A$ le mandó a $B$ y **se lo devuelve a $A$** | $A$ "recibe" un mensaje que $B$ nunca envió |

**Vale la pena subrayar el marco:** los tres sobreviven al cifrado autenticado. Un canal CCA-Secure e infalsificable sigue siendo reordenable, repetible y reflejable, porque las tres cosas son propiedades **de la sesión**, no del mensaje.

La solución del libro es económica: **dos contadores y un bit**. Cada parte mantiene $\mathrm{ctr}_{A,B}$ y $\mathrm{ctr}_{B,A}$, uno por sentido, inicializados en 0; y acuerdan un bit de dirección $b_{A,B}$, con $b_{B,A}$ su complemento —por ejemplo $b_{A,B} = 0$ si el identificador de $A$ es lexicográficamente menor que el de $B$—. Entonces $A$ envía

$$c \leftarrow \mathsf{Enc}_k\bigl(b_{A,B} \Vert \mathrm{ctr}_{A,B} \Vert m\bigr)$$

y $B$ acepta sólo si el descifrado no es $\bot$ y además el bit y el contador son los que esperaba. **El contador mata el reordenamiento y el replay; el bit de dirección mata la reflexión.** Katz observa que en la práctica la direccionalidad se suele resolver de otra manera —**una clave distinta por sentido**—, que es lo que hace `TLS`: en su capa de registro, `TLS 1.2` usa números de secuencia exactamente para esto, y claves separadas para cada dirección.

*(Es también el motivo por el que la firma digital tampoco resuelve el replay: acredita quién firmó, pero no **cuándo**. K&L lo dice al abrir el capítulo de firmas y remite a esta misma sección.)*

## Un número de secuencia es un nonce

El contador y el timestamp son dos instancias del mismo objeto: un valor que **no se repite** bajo la misma clave. Es literalmente la definición de [[cifrado-probabilistico-nonce-e-iv#Nonce e IV no son exactamente lo mismo|nonce]] — *number used once* —, a la que sólo se le exige **unicidad** y no impredecibilidad; y por eso un contador sirve acá, por la misma razón por la que sirve como nonce del modo [[modos-de-encadenamiento|CTR]].

La simetría vale la pena verla entera *(lectura nuestra)*:

| | Del lado de la confidencialidad | Del lado de la integridad |
|---|---|---|
| Qué rompe la repetición | reusar $(k, \text{nonce})$ hace que dos cifrados distintos se filtren entre sí | reenviar $(m,t)$ hace que la acción se ejecute dos veces |
| Qué se agrega | un IV o nonce a la entrada de `Enc` | un contador o un timestamp a la entrada de `Mac` |
| Qué se le exige al valor | unicidad — y en `CBC`, además, impredecibilidad | unicidad — y en el timestamp, además, **cercanía** |
| Dónde vive | **adentro** del esquema de cifrado | **afuera** del MAC, en el protocolo |

La última fila es la diferencia que importa. El nonce del cifrado es parte del esquema: `Enc` lo sortea, lo usa y lo emite. El contador de frescura **no lo genera ni lo verifica ningún MAC** — lo pone el protocolo, y por eso ninguna biblioteca de MACs lo trae. Es la misma idea aplicada en dos capas distintas, y confundir las capas es exactamente el error que la filmina previene.

## Lo que esto anticipa

La advertencia de la filmina 2 es, en realidad, la semilla de un área entera. Todo el problema de **establecer frescura** —demostrarle a la contraparte que este mensaje es de ahora— es lo que motiva los desafíos y respuestas (*challenge-response*), los nonces de negociación y los números de sesión que arma cualquier protocolo real. En el [[cronograma]] eso es la **Clase 5 — Protocolos criptográficos (17/09)**, ya en el terreno donde el MAC deja de ser el objeto de estudio y pasa a ser una pieza.

Hasta entonces conviene guardar la frase corta: **la primitiva garantiza que el mensaje no cambió y quién lo hizo; el protocolo tiene que garantizar cuándo.**
