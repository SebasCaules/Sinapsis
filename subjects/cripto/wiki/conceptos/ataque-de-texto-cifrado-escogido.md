---
title: Ataque de texto cifrado escogido
resumen: 'La cuarta prueba de indistinguibilidad y la primera que ningún criptosistema del curso pasa: le da al adversario un oráculo de descifrado y convierte el ataque de maleabilidad en una derrota formal.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[pruebas-de-indistinguibilidad]]", "[[maleabilidad]]"]
aliases: [Ataque de texto cifrado escogido, CCA-Secure, Chosen Ciphertext Attack, Indistinguibilidad CCA, Texto cifrado escogido]
type: concepto
unidad: 1
clase: 3
orden: 2
created: 2026-08-28
updated: 2026-08-28
tags: [criptografia, cca, indistinguibilidad, juegos, integridad, flujo, clase-03]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "Clase 03pt1-Transcripcion.VTT"]
---

# Ataque de texto cifrado escogido

La cuarta prueba de indistinguibilidad, y la primera que **ningún criptosistema del curso pasa**. Es la prueba que hacía falta para que el ataque de [[maleabilidad]] deje de ser una anécdota y pase a ser una derrota formal: le da al adversario un **oráculo de descifrado** y mide qué hace con él.

> **Ojo con el nombre.** `CCA` ya aparecía en el curso como **modelo de ataque** en la taxonomía de la Clase 01 — ver [[modelos-de-ataque|Modelos de ataque]]. Esta nota es la otra cosa: el **juego formal**. La diferencia está desarrollada abajo, en [[#Modelo de ataque contra prueba de indistinguibilidad|Modelo de ataque contra prueba de indistinguibilidad]].

---

## Por qué hizo falta una prueba nueva

Las tres pruebas de la [[clase-02-cifrado|Clase 02]] —[[pruebas-de-indistinguibilidad#Las tres pruebas|Eav, Mul y CPA]]— miden lo mismo con adversarios cada vez más poderosos: **qué información puede extraer** alguien que mira, y en el caso de `CPA`, alguien que además puede pedir cifrados a pedido. El ataque a la base de sueldos no extrae nada, y por eso las tres lo dejan pasar.

El cambio de la Clase 03 es de **verbo**: hasta acá el adversario **leía**, ahora **escribe**.

> [!quote]- De la transcripción — cuál es el cambio de patrón, en palabras del docente (cues pt1 374-390)
> **374-377.** "Lo que está midiendo esta prueba de seguridad de texto cifrado escogido es **un problema que no podemos resolver con un criptosistema de ningún tipo por sí solo**, porque lo que está midiendo es qué ocurre cuando un atacante tiene una capacidad que hasta ahora no habíamos visto, que es **la capacidad de modificar el texto cifrado**."
> **379.** "Cuando empezamos la clase, ¿qué fue lo novedoso que hicimos acá que no habíamos hecho antes? Antes era: tengo el texto cifrado, quiero extraer la información. **Acá hicimos algo distinto: acá modificamos el texto cifrado.**"
> **385-390.** "Yo acá **evité cuidadosamente hablar de confidencialidad**: hablé de un problema de seguridad. Pero lo que ocurrió acá, en realidad, es que este es un problema de seguridad de otro tipo: es un problema de seguridad que ocurre **a raíz de que alguien tiene la capacidad de modificar lo que se almacenó o lo que se transmitió**. Es un problema que se analiza en otro campo de la seguridad. A ese campo se lo llama **integridad**, y es otro de los grandes servicios de seguridad que vamos a ver en la materia."

---

## El juego CCA

*Chosen Ciphertext Attack*, notado $\mathsf{CCA}_{A,\Pi}$. Dados un nivel de seguridad $n$, un adversario $A$ y un criptosistema $\Pi(n)$:

$$\begin{aligned}
&1)\ \ \text{se genera una clave } k \leftarrow K\\
&2)\ \ A \text{ obtiene } f(x) = e_k(x)\ \textbf{y}\ g(x) = d_k(x), \text{ y genera } (m_0, m_1)\\
&3)\ \ \text{se genera } b \leftarrow \{0,1\}\\
&4)\ \ A \text{ recibe } c = e_k(m_b),\ \textbf{y no puede calcular } g(c)\\
&5)\ \ A \text{ emite } b' \in \{0,1\}
\end{aligned}$$

$\mathsf{CCA}_{A,\Pi} = 1$ si $b = b'$, o sea si $A$ gana. Y la condición de seguridad:

$$\Pr[\mathsf{CCA}_{A,\Pi}(n) = 1] \;\le\; \tfrac{1}{2} + \mathsf{negl}(n) \quad \text{para todo } A \text{ } \mathrm{PPT} \qquad\Longrightarrow\qquad \Pi \text{ es CCA-Secure}$$

Es el mismo molde de las tres anteriores —dos mensajes, una moneda escondida, un bit de respuesta— con **exactamente dos diferencias** respecto de `CPA`:

1. El adversario recibe un segundo oráculo, $g(x) = d_k(x)$: **descifra lo que quiera**.
2. Aparece una restricción, la única del juego: **no puede pedir $g(c)$ sobre el criptograma desafío**.

**La restricción no es un tecnicismo, es la única cosa que impide que el juego sea trivial.** Sin ella, el adversario pide el descifrado del desafío, lo compara con $m_0$ y gana siempre; el juego no mediría nada.

> [!quote]- De la transcripción — la capacidad extra y su única salvedad (cues pt1 180-188)
> **180-184.** "Es un escenario donde el atacante tiene la capacidad tanto de cifrar como de [des]cifrar cosas. Es muy parecido al ataque que veíamos antes, pero ahora **le damos una capacidad adicional al atacante: la capacidad de descifrar cualquier mensaje**."
> **186-188.** "La única salvedad es: **el atacante no puede pedir el descifrado de ese mensaje que recibió, porque si no ganaría siempre de forma trivial**. Es la única restricción que se le pone. Pero tiene que adivinar si es uno u otro."

> **Cuándo se puede consultar el oráculo de descifrado** *(lectura nuestra; la filmina no lo dice y el ejercicio depende de ello).* La filmina entrega los dos oráculos en el paso 2, o sea **antes** del desafío, y ahí podría leerse que después del paso 4 ya no se consulta nada. Sería una lectura equivocada, y la propia filmina lo delata: si las consultas terminaran antes del desafío, la restricción *"no puede calcular $g(c)$"* del paso 4 sería **vacía** —$c$ todavía no existe cuando se consulta—. Que la restricción tenga contenido implica que el acceso a $g$ **continúa después de recibir $c$**, que es la versión de Katz & Lindell y la que el ejercicio de abajo usa: todo el ataque consiste en una consulta de descifrado hecha **después** del desafío.

> **Precisión sobre la escritura de la filmina** *(nuestra).* En el paso 5 escribe *"$A$ emite $b' = \{0,1\}$"* donde corresponde $b' \in \{0,1\}$ — el mismo desliz que ya está marcado en varias filminas de la [[clase-02-cifrado|Clase 02]]. Y el umbral lo escribe con $<$ donde la definición de Katz & Lindell usa $\le$; la diferencia es inocua. Lo que **sí** vale registrar es que acá el umbral está bien escrito —$\tfrac12 + \mathsf{neg}(n)$— mientras que dos filminas antes, en `CPA`, aparece como *"$= 0{,}5 + \varepsilon$"*: la comparación entre las dos láminas confirma que aquello es un desliz y no una convención de la cátedra.

---

## Modelo de ataque contra prueba de indistinguibilidad

Las dos cosas se llaman `CCA` y no son la misma. Conviene tenerlas separadas porque en el parcial la pregunta puede apuntar a cualquiera de las dos.

| | **Modelo de ataque** `CCA` (Clase 01) | **Prueba** $\mathsf{CCA}_{A,\Pi}$ (Clase 03) |
|---|---|---|
| Dónde vive | [[modelos-de-ataque\|Modelos de ataque]] | esta nota |
| Qué es | una **categoría**: qué recursos tiene el adversario | un **juego** con reglas, un ganador y una probabilidad |
| Qué dice | el adversario tiene oráculo de `Dec` | $\Pr[\cdot] \le \tfrac12 + \mathsf{negl}(n)$ para todo $A$ $\mathrm{PPT}$ |
| Objetivo del adversario | obtener el texto plano | **adivinar un bit** |
| Para qué sirve | describir y clasificar ataques | **demostrar** seguridad, o refutarla exhibiendo un adversario |

**Es el mismo salto que la Clase 02 le hizo a `CPA`**: la taxonomía dice *qué información tiene* el adversario, la prueba convierte eso en un experimento con una probabilidad de ganar. La ventaja del formato de juego es que se puede **perder**: para refutar la seguridad alcanza con escribir un adversario concreto y calcular su probabilidad, que es exactamente lo que hace el ejercicio de abajo.

> **Detalle que cambia el objetivo, no sólo la forma** *(lectura nuestra).* En la taxonomía de la Clase 01 los cuatro modelos comparten meta —*obtener todo el plano*—, y `CCA` se distingue sólo por el recurso. En el juego la meta es mucho más modesta: **distinguir entre dos mensajes que el propio adversario eligió**. Es una exigencia deliberadamente exagerada; si ni siquiera eso se puede, recuperar el plano entero está fuera de discusión.

---

## Ningún criptosistema visto hasta el momento es CCA-Secure

La frase es literal de la filmina, y es la razón de ser de la segunda mitad de la clase. En clase el docente la desarrolla y **le agrega un ítem que la filmina no tiene**:

> [!quote]- De la transcripción — la lista completa, con el One Time Pad adentro (cues pt1 190-193)
> **190-193.** "Las no tan buenas noticias es que **nada de lo que vimos hasta ahora pasa esta prueba**. Ninguno de los criptosistemas de bloque, ninguno de los criptosistemas de flujo, **ni el One Time Pad** pasan esta prueba de seguridad."

**El [[one-time-pad|One Time Pad]] tiene [[secreto-perfecto|secreto perfecto]] y no es `CCA-Secure`.** Es el dato más fuerte de todo el bloque y conviene guardarlo tal cual, porque desarma la intuición de que "perfecto" quiere decir "inmejorable": el secreto perfecto es una afirmación sobre **cuánta información revela el criptograma**, y la maleabilidad no es un problema de información revelada. El OTP es maleable de la manera más total posible — es el $\oplus$ puro.

Que la prueba la reprueben todos **no la vuelve inútil**: la vuelve un diagnóstico. Lo que dice no es *"no uses AES en modo counter"*, sino *"el cifrado solo no alcanza; falta una pieza"*.

> [!quote]- De la transcripción — por qué se sigue usando AES si nada pasa la prueba (cues pt1 370-373)
> **370-373.** "¿Por qué nos sirve un criptosistema de este tipo? Si vamos a ser sinceros, el nivel de seguridad que ofrece un criptosistema de bloque con AES bien usado — probablemente Rodrigo les dijo que se usa en la actualidad: **las conexiones de ustedes con sus home banking se protegen con AES en modo counter**, probablemente, o en alguno de los otros modos más nuevos. **No es que no se usa.** Entonces, ¿por qué no es seguro?"

---

## Ejercicio: el cifrado de flujo no es CCA-Secure

**Enunciado de la filmina.** *Demostrar que el cifrado de flujo en general no es CCA-Secure. Ayuda: considerar $m_0 = (0\ldots 0)$ y $m_1 = (1\ldots 1)$ y verificar qué consultas se pueden hacer a $g(x)$ al recibir $c$.*

Resuelto entero en clase (cues pt1 194-361). Va la reconstrucción completa.

### El esquema atacado

Un [[criptosistema-de-flujo|criptosistema de flujo]] **CPA-Secure**, o sea con $IV$ público y aleatorio, tal como el docente lo corrige en el pizarrón:

$$\mathsf{Enc}_k(m):\;\; IV \leftarrow \{0,1\}^{n},\quad c := \langle\, IV,\;\; G(k\Vert IV)\oplus m \,\rangle \qquad\qquad \mathsf{Dec}_k\langle IV, y\rangle := G(k\Vert IV)\oplus y$$

Lo único que se usa del esquema es la [[maleabilidad]] que la primera mitad de la clase acaba de demostrar: xorear un diferencial en el cuerpo del criptograma, dejando el $IV$ intacto, xorea **ese mismo diferencial** en el texto plano.

$$\mathsf{Dec}_k(c \oplus x) \;=\; \mathsf{Dec}_k(c)\oplus x \tag{M}$$

### El adversario, completo

Sea $\ell$ la longitud de los mensajes y $e_\ell := 0^{\ell-1}1$ la cadena de ceros con un uno al final.

$$\begin{aligned}
&1)\ \ A \text{ emite } m_0 := 0^{\ell} \text{ y } m_1 := 1^{\ell}\\
&2)\ \ A \text{ recibe el desafío } c = \mathsf{Enc}_k(m_b)\\
&3)\ \ A \text{ calcula } c' := c \oplus e_\ell \quad \text{(invierte el último bit del cuerpo cifrado)}\\
&4)\ \ A \text{ consulta } \tilde m := g(c') = \mathsf{Dec}_k(c')\\
&5)\ \ A \text{ emite } b' := \tilde m[1] \quad \text{(el primer bit de lo que recibió)}
\end{aligned}$$

**Por qué el paso 4 es legal.** $c' \ne c$: difieren exactamente en el bit que $A$ acaba de invertir. La única restricción del juego prohíbe consultar $g$ **sobre $c$**, no sobre criptogramas parecidos. Ésa es la grieta entera del argumento, y es lo que el docente subraya: *"construís $c'$ que ya es distinto de $c$, así que vale"* (cue pt1 339).

**Por qué el paso 5 acierta siempre.** Por (M), $\tilde m = m_b \oplus e_\ell$, o sea $m_b$ con el último bit dado vuelta. Como $m_0$ y $m_1$ son **constantes y opuestas en todas las posiciones**, cualquier bit que no sea el último delata cuál era:

| $b$ | $m_b$ | $\tilde m = m_b \oplus e_\ell$ | primer bit de $\tilde m$ | $b'$ | ¿acierta? |
|---|---|---|---|---|---|
| 0 | $00\cdots 0$ | $00\cdots 01$ | 0 | 0 | Sí |
| 1 | $11\cdots 1$ | $11\cdots 10$ | 1 | 1 | Sí |

Los dos casos son disjuntos y $A$ nunca se equivoca:

$$\Pr[\mathsf{CCA}_{A,\Pi}(n) = 1] = 1 \;\;\not\le\;\; \tfrac12 + \mathsf{negl}(n)$$

$A$ hace **una sola** consulta de descifrado, no usa el oráculo de cifrado para nada y corre en tiempo lineal en $\ell$. El esquema **no es CCA-Secure**.

> [!quote]- De la transcripción — la resolución, en palabras del docente (cues pt1 316-325)
> **316-320.** "Nosotros ¿qué hicimos acá? Calculamos un $c$ modificado donde cambiamos el último bit. Entonces, si yo lo descifro, lo que voy a tener es el $m$ original —que es uno de esos 2 de arriba— con el último bit modificado. **Entonces me va a quedar o todos ceros y un 1, o todos unos y un 0.** Si ignoro ese último bit que modifiqué…"
> **321-324.** "…si el primer bit —o cualquier otro de los bits— es 0, es [porque era] el primer mensaje, que eran todos ceros. Si el primer bit, uno de los no modificados, era 1, es que era el segundo mensaje. **Y con esta tabla de decisión simple yo puedo siempre adivinar a qué mensaje se corresponde el texto cifrado, sin haberlo descifrado.**"

### Tres comentarios que valen para el parcial

**1. La restricción del juego queda decorativa.** No hace falta pedir el descifrado prohibido: alcanza con pedir el de un criptograma que difiere en **un bit**, y cuya respuesta es el mensaje desafío con **un bit** cambiado. La maleabilidad convierte "casi $c$" en "casi $m_b$", y el juego no tiene cómo distinguir esas dos cosas.

**2. La ayuda de la filmina es un atajo, no una necesidad** *(lectura nuestra).* Cualquier par $m_0 \ne m_1$ sirve: $A$ pide $\mathsf{Dec}_k(c\oplus e_\ell)$, le vuelve a xorear $e_\ell$ para recuperar $m_b$ **entero** y lo compara con los dos candidatos. Elegir la cadena de ceros contra la de unos ahorra ese último paso, porque cualquier bit intacto ya contesta la pregunta.

**3. El argumento no usa nada del flujo salvo (M).** Vale para **todo** esquema de la forma $c = \text{keystream}\oplus m$: el flujo con y sin $IV$, el [[modos-de-encadenamiento#Los cinco modos|CTR]], el `OFB`, el primer bloque de `CFB`, y el `OTP`. Para [[modos-de-encadenamiento#Los cinco modos|CBC]] hay que variarlo un poco —se toca el $IV$ para gobernar el primer bloque—, pero cae igual. De ahí sale, con demostración, la frase de la filmina: **ninguno de los criptosistemas vistos es `CCA-Secure`**.

> [!quote]- De la transcripción — la moraleja que el docente saca del ejercicio (cue pt1 326)
> **326.** "En la naturaleza de por qué se puede hacer este ataque está la relación con el ataque [a los sueldos] que les mostré: lo que hice acá fue, a partir de un texto cifrado, alterarlo, para después pedir propiedades o mirarlas sobre el texto alterado."

---

## CCA es estrictamente más fuerte que CPA

La relación entre las dos pruebas se demuestra en dos líneas, y conviene tenerla escrita porque es el tipo de argumento que la materia pide *(desarrollo nuestro; la filmina sólo pone las dos pruebas una al lado de la otra).*

**`CCA-Secure` $\Longrightarrow$ `CPA-Secure`.** Todo adversario de `CPA` **es** un adversario de `CCA` que simplemente no usa el oráculo $g$. Si existiera un $A$ que gana `CPA` con ventaja no despreciable, ese mismo $A$ corrido en el juego `CCA` gana con la misma ventaja. Contrarrecíproco: si nadie gana `CCA`, nadie gana `CPA`.

**La implicación no vale al revés.** El ejercicio de arriba exhibe un esquema **CPA-Secure por hipótesis** que cae en `CCA` con probabilidad 1. Un contraejemplo alcanza: la inclusión es **estricta**.

La cadena completa del curso queda así:

| | `Eav` | `Mul` | `CPA` | `CCA` |
|---|---|---|---|---|
| Oráculo de cifrado | No | No | Sí | Sí |
| Oráculo de descifrado | No | No | No | **Sí** |
| Adversario | pasivo | pasivo | activo | activo |
| Restricción propia | — | — | — | no consultar $g$ sobre el desafío |
| ¿Lo pasa algo de lo visto en el curso? | Sí | Sí, con $IV$ o nonce | Sí (flujo con $IV$, `CBC`, `CTR`) | **nada** |

**Cada prueba contiene a la anterior**, así que `CCA` es la exigencia máxima del bloque simétrico. Y como no la pasa nada, es también la que **abre** la clase siguiente en lugar de cerrarla.

---

## Lo que la prueba mide en realidad

El cierre conceptual, que es donde converge toda la primera mitad de la Clase 03:

**`CCA` no mide confidencialidad.** Mide qué pasa cuando el adversario puede **modificar** lo que se guardó o se transmitió, y el receptor **descifra cualquier cosa que le llegue**. El adversario del ejercicio no ganó porque el cifrado filtre información: ganó porque tuvo enfrente a alguien dispuesto a descifrar un criptograma adulterado y a contarle el resultado.

Eso deja la salida a la vista y explica el resto de la clase:

1. El problema **no se resuelve con cifrado solo** — la filmina lo dice con todas las letras.
2. Hace falta **control de integridad**: identificar adulteraciones. La primitiva es el [[message-authentication-code|MAC]].
3. Autenticando el criptograma, $c' = c\oplus e_\ell$ **falla la verificación**, el oráculo devuelve un fallo en vez de un texto plano, y la consulta del paso 4 deja de servirle al adversario. Ése es exactamente el mecanismo del [[cifrado-autenticado|cifrado autenticado]], y el motivo por el que se lo puede probar `CCA-Secure`.

> [!quote]- De la transcripción — de confidencialidad a integridad (cues pt1 392-395)
> **392-395.** "Hasta ahora veníamos viendo **confidencialidad**: cómo, a partir de ciertas transformaciones, nadie puede extraer información. Hoy vamos a entrar al mundo de **integridad**: cómo podemos identificar adulteraciones o modificaciones no permitidas en la información. Y vamos a ver que, si bien sigue siendo parte de criptografía y vamos a tratar de darle una forma parecida, **las construcciones son un poco distintas**."

---

## Ver también

- [[maleabilidad|Maleabilidad]] — la propiedad que hace ganar al adversario de esta prueba, con el ataque a la base de sueldos entero
- [[modelos-de-ataque|Modelos de ataque]] — el `CCA` **informal** de la Clase 01: la taxonomía COA / KPA / CPA / CCA y el corte pasivo/activo. Ahí está *qué recursos tiene* el adversario; acá está el juego que convierte eso en una probabilidad
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — `Eav`, `Mul` y `CPA`, el molde del que esta prueba es la cuarta pieza
- [[message-authentication-code|Message Authentication Code]] — la primitiva que falta
- [[cifrado-autenticado|Cifrado autenticado]] — la construcción que sí es `CCA-Secure`
- [[criptosistema-de-flujo|Criptosistema de flujo]] — el esquema que cae en el ejercicio
- [[one-time-pad|One Time Pad]] — secreto perfecto y aun así no `CCA-Secure`
- [[seguridad-computacional|Seguridad computacional]] — qué quiere decir $\mathsf{negl}(n)$ y qué es un adversario $\mathrm{PPT}$
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — el vocabulario para responder *"¿es seguro?"* con *"¿contra qué prueba?"*
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]]
- Katz & Lindell — la definición formal de `CCA` es la Definición 3.33; la lectura que manda la filmina es el cap. 4 *Message Authentication Codes* ([[bibliografia|bibliografía]])
