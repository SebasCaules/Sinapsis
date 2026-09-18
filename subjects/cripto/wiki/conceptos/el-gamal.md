---
title: El Gamal
resumen: 'Criptosistema asimétrico construido sobre Diffie-Hellman: enmascara el mensaje multiplicándolo por el secreto compartido $g^{xy}$. Es probabilístico por construcción, alcanza CPA-Secure si vale la conjetura DDH, y corre sobre cualquier grupo — de ahí las curvas elípticas y las claves cortas.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[diffie-hellman]]", "[[criptosistema-asimetrico]]", "[[rsa]]"]
aliases: [El Gamal, ElGamal, Cifrado de El Gamal, Criptosistema de El Gamal, Enmascaramiento multiplicativo]
type: concepto
unidad: 1
clase: 4
orden: 8
created: 2026-09-04
updated: 2026-09-15
tags: [criptografia, criptografia-asimetrica, el-gamal, diffie-hellman, ddh, cpa-secure, curvas-elipticas, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# El Gamal

**El criptosistema asimétrico que se construye directamente sobre Diffie-Hellman: usa el secreto compartido $g^{xy}$ como máscara multiplicativa del mensaje, y es `CPA-Secure` si la conjetura `DDH` vale en el grupo.**

> **Fuentes de esta nota.** Filminas **29-31** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), cues **970-1048**. La nota se escribió el 04/09 sólo contra el PDF y se revisó contra la voz el 14/09. Lo que la voz agregó: la motivación —por qué El Gamal ganó terreno sobre `RSA`—, la lectura de la construcción **en paralelo con Diffie-Hellman**, la analogía con el cifrado de flujo, y el bloque sobre otros grupos y curvas elípticas. El ejemplo numérico de la filmina 31 no se mencionó.

**Por qué existe, según la clase.** La sección arranca del *"dolor de cabeza"* de `RSA`: que no se haya podido demostrar que la única forma de romperlo sea factorizar, con lo cual *"siempre estuvo con la espada de Damocles de 'che, ¿y habrá otro ataque algebraico que haga tambalear la seguridad?'"*. El Gamal *"ganó mucha preponderancia, un poco por eso"*, y el docente lo presenta como *"hoy día, les diría, el criptosistema asimétrico más usado"* (cues 971-977). Desde afuera tiene la misma interfaz —una terna `Gen`/`Enc`/`Dec`—, es *"un poco más complejo que RSA, aunque no tanto"*, y conceptualmente es *"una adaptación muy creativa del intercambio de claves de Diffie-Hellman, pero para cifrar información"*.

> **Sobre "el más usado"** *(precisión nuestra)*. Como afirmación literal es discutible: lo que domina en la práctica es el **intercambio** Diffie-Hellman sobre curvas elípticas combinado con un cifrado simétrico —el [[cifrado-hibrido|esquema híbrido]] de `TLS` y de la mensajería—, y El Gamal como criptosistema aparece sobre todo en OpenPGP y, en su versión sobre curvas (`ECIES`), en algunos estándares. Lo que sí es exacto es la idea que sostiene la afirmación: **el mecanismo de El Gamal —derivar una máscara de un secreto Diffie-Hellman— es el que está debajo de casi todo el cifrado asimétrico que se usa hoy**, mucho más que la exponenciación `RSA`.

## La construcción

$$\begin{aligned}
\mathsf{Gen}&:\ \text{seleccionar } (G,q,g),\ G \text{ grupo de tamaño } q,\ g \text{ generador}\\
&\quad x \leftarrow \mathbb{Z}_q,\quad h = g^{x}\\
&\quad pk = (G,q,g,h),\quad sk = (G,q,g,x)\\[4pt]
\mathsf{Enc}_{pk}(m)&:\ y \leftarrow \mathbb{Z}_q,\quad c = (c_1,c_2) = \bigl(g^{y},\ h^{y}\cdot m\bigr)\\
\mathsf{Dec}_{sk}(c) &= c_2 \,/\, c_1^{\,x}
\end{aligned}$$

Es literalmente [[diffie-hellman|Diffie-Hellman]] con un paso más: $g^x$ y $g^y$ son los mismos medios pasos del protocolo de intercambio de claves, y $h^y = (g^x)^y = g^{xy} = (g^y)^x = c_1^{x}$ es el secreto compartido de siempre. El Gamal usa ese secreto como una **máscara multiplicativa**: en vez de transmitirlo para derivar una clave simétrica, lo multiplica directamente contra $m$.

**La voz lee la construcción exactamente como ese paralelo**, paso por paso (cues 981-1007): `Gen` es *"prácticamente lo que ocurre en el primer paso de Diffie-Hellman, lo que hace el lado A antes de mandar al lado B"*, sólo que en vez de mandar $g^{x}$ se lo **publica** como parte de la clave —los tres parámetros y $h$ son la clave pública, $x$ queda como secreta—; cifrar es *"la segunda parte de Diffie-Hellman"*: elegir $y$, calcular $g^{y}$, y "transmitirlo" como primera componente del criptograma; y $h^{y}$ es *"$g$ a la $x$ a la $y$, que sería como la clave de sesión de Diffie-Hellman"*, multiplicada por el mensaje.

> [!quote]- De la transcripción — Gen y Enc leídos sobre Diffie-Hellman (cues 981-996)
> *"Generación de claves: igual que en Diffie-Hellman, se elige un campo $G$ de tamaño $q$ y un generador dentro de ese campo. Se elige un número al azar entre 0 y $q-1$, y se calcula el generador elevado a ese número. Si hacemos memoria de lo que vimos hace un rato, esto es prácticamente lo que ocurre en el primer paso de Diffie-Hellman, lo que hace el lado A antes de mandar al lado B. Y lo que haría Diffie-Hellman después, ¿qué hace? Lo publica, se lo manda al lado B. Bueno, acá lo hacemos de alguna manera, porque los 3 parámetros y el $h$, el $g$ a la $x$, forman parte de la clave pública de El Gamal. Queda como clave secreta el valor $x$ (…) lo que el lado A, entre comillas, se guarda para sí. ¿Qué significa cifrar en El Gamal? Cifrar un mensaje es elegir un número al azar entre 0 y $q$, que sería como la segunda parte de Diffie-Hellman; calcular $g$ a ese número, y transmitirlo, entre comillas: acá el $g$ a la $y$ pasa a ser parte del texto cifrado, así que se transmite, se le da al atacante o a todo el mundo. Y después, fíjense que el texto cifrado tiene 2 componentes: uno es el $g$ a la $y$, y el otro es $h$, $g$ a la $x$, elevado a la $y$ —que sería como la clave de sesión de Diffie-Hellman, la clave compartida— multiplicado por el mensaje."*

> **Errata de la filmina (29).** La lámina escribe $pk = (G,q,\mathbf{p},h)$ y $sk = (G,q,\mathbf{p},x)$ — con $p$ en la tercera posición. Verificado sobre la página renderizada: el glifo es una "p" minúscula, no una "g", y $p$ no se define en ningún lugar de esta filmina ni de las anteriores del bloque de El Gamal. Dos líneas antes, la misma lámina fija la terna a seleccionar como "$G, q, g$": la variable correcta es $g$, el generador, y sin él $\mathsf{Dec}$ no tiene con qué recomputar la cadena. Arriba va corregido. En el aula la línea no se leyó: la voz dice *"los 3 parámetros y el $h$"* (cue 986).

## Por qué el descifrado funciona

$$\mathsf{Dec}(c) = \frac{c_2}{c_1^{x}} = \frac{h^{y}\cdot m}{(g^{y})^{x}} = \frac{(g^{x})^{y}\cdot m}{g^{xy}} = \frac{g^{xy}\cdot m}{g^{xy}} = m$$

Todo el esquema se apoya en una sola igualdad, $h^{y} = g^{xy} = c_1^{x}$: quien cifra la calcula desde $h$ (pública) y su propio $y$; quien descifra la calcula desde $c_1$ (que viaja en el criptograma) y su $x$ privado. Nadie más puede calcularla sin resolver el problema que Diffie-Hellman ya deja planteado: dados $g^x$ y $g^y$, ni el logaritmo discreto ni la conjetura `DDH` tienen solución eficiente conocida. La voz lo dice como reconstrucción: descifrar es *"tomar la segunda parte y dividirla por $g$ a la $y$ elevado a la $x$, que es la reconstrucción de la clave de sesión"*, y la seguridad viene de que *"a partir de $g$ a la $x$ no se puede recuperar $x$, entonces el único que tiene $x$ es el que tenga la clave secreta"* (cues 1002-1011).

## Es un cifrado de flujo con la clave derivada de Diffie-Hellman

**La lectura que más ayuda a entender la fórmula es de la voz y no de la filmina.** Multiplicar la "clave compartida" $h^{y}$ por el mensaje es, estructuralmente, lo mismo que hace un [[one-time-pad|one-time pad]] o un [[criptosistema-de-flujo|cifrado de flujo]]: se genera una clave y se **mezcla** con el mensaje — con producto en el grupo en vez de XOR, y con una clave que no es aleatoria sino derivada. Y como el $y$ se sortea de nuevo en **cada** cifrado, la máscara cambia cada vez aunque $h$ sea siempre la misma: cifrar dos veces el mismo mensaje da dos criptogramas distintos. Eso es lo que hace a El Gamal **probabilístico de fábrica**, sin necesitar ningún padding externo — la diferencia central con [[rsa|RSA]] textbook, que sí es determinístico y por eso necesita el parche de [[pkcs1-y-tamano-de-claves|PKCS#1]]. Y es la propiedad que [[criptosistema-asimetrico|Criptosistema asimétrico]] exige como condición necesaria para `CPA-Secure`.

> [!quote]- De la transcripción — "una suerte de one-time pad", y un y nuevo por mensaje (cues 997-1014)
> *"¿Qué pasa? Esta clave, entre comillas, compartida, multiplicada por el mensaje, es muy parecido en cuanto a estructura a considerarla como una clave de uso único, una suerte de one-time pad con el mensaje. No es el one-time pad, porque esta clave no es aleatoria, pero es la misma idea; o si quieren, es parecido a un criptosistema de flujo más que al one-time pad: usamos esa misma idea, generamos una clave y la mezclamos con el mensaje. (…) Y cada vez que se cifra un mensaje, si bien se repite el mismo $g$ a la $x$, se toma un $y$ nuevo. Entonces, si yo cifro 2 veces el mismo mensaje, se van a calcular 2 $y$ distintos para cada mensaje; por ende, una clave distinta a cada sesión; por ende, esta parte va a ser distinta."*

## Resultado de seguridad y la conjetura DDH

La filmina lo resume en una línea: **si la conjetura de decisión Diffie-Hellman (`DDH`) es difícil en $G$, El Gamal es `CPA-Secure`.** Es la misma conjetura que sostiene la seguridad de la clave compartida en Diffie-Hellman —dados $g$, $g^x$, $g^y$, un adversario no puede distinguir $g^{xy}$ de un elemento aleatorio del grupo— aplicada ahora a un rol distinto: acá $g^{xy}$ no es una clave que se deriva después, es la máscara que se multiplica **directamente** contra $m$. Si un adversario pudiera distinguir $c_2 = h^{y}\cdot m_0$ de $c_2' = h^{y}\cdot m_1$ para $m_0 \ne m_1$ elegidos por él, eso le daría una forma de distinguir $g^{xy}$ de ruido — que es exactamente lo que `DDH` prohíbe.

**Lo que la voz subraya es la diferencia de estatus con `RSA`**: acá *"se puede atar todo a la prueba de decisión de Diffie-Hellman, y no hay otro ataque plausible que quede afuera"* (cue 1019). Es una **reducción completa** —romper El Gamal es exactamente romper `DDH` en $G$— contra la reducción parcial de `RSA` a la factorización. Y la consecuencia práctica: *"este se usa así como está, no se necesita agregarle veinte mil otras cosas"* (cue 1020), contra el `RSA` que no se puede usar sin `PKCS#1`. Los parámetros $(G, q, g)$, además, *"son reutilizables, así que hay tablas con estos parámetros que se pueden reutilizar para cifrar las veces que uno quiera"* (cues 1021-1022): la clave nueva es sólo $x$.

## Diferencias con RSA

| | `RSA` | El Gamal |
|---|---|---|
| Determinismo | Determinístico (necesita padding) | Probabilístico por diseño |
| Parámetros | Cada par de claves trae su propio $n=p\cdot q$ | $(G,q,g)$ se pueden **reutilizar** entre usuarios |
| Estructura algebraica | Anillo $\mathbb{Z}_n$ | Cualquier grupo donde `DDH` sea difícil |
| Alternativas de grupo | — | Anillos de polinomios ($2^{n}$ elementos, fáciles de mapear a mensajes de $n$ bits), curvas elípticas |
| Reducción de seguridad | parcial: factorizar $\Rightarrow$ romper, pero no al revés demostrado | completa: romper $\iff$ resolver `DDH` en $G$ |
| Expansión del mensaje | $c$ mide lo mismo que $n$ | $c=(c_1,c_2)$ mide el **doble** que $m$ |

*(La última fila de la tabla —la expansión a $(c_1,c_2)$— no está en la filmina ni en la voz: es lectura nuestra sobre la propia fórmula de $\mathsf{Enc}$, y es literalmente el precio del no determinismo.)*

## Cualquier grupo: polinomios y curvas elípticas

**La fila de "alternativas de grupo" es el bloque que la voz más desarrolló** (cues 1023-1045), y explica la tabla de [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]]. Como El Gamal está formulado sobre un grupo abstracto y no sobre $\mathbb{Z}_n$, se puede instanciar sobre **anillos de polinomios** —donde una transformación toma bloques de 64 o 128 bytes y devuelve bloques de 128 bytes, *"que es algo que con RSA no voy a tener, y voy a perder espacio de almacenamiento"*—, o sobre **curvas elípticas**, que *"cumplen con todas las mismas propiedades"* de grupo y donde el problema de decisión Diffie-Hellman *"es mucho más complejo"*. Eso es lo que permite **relajar el tamaño de las claves**: las operaciones sobre puntos de una curva *"son un chino"*, pero existen y se implementan, y a cambio las claves bajan de 2048 o 4096 bits a **256 o 320**. El argumento práctico del docente es de manejo de claves: cuando hay que almacenarlas en papel o tipearlas a mano —*"esta mano es un infierno"*—, una clave corta vuelve tratable el problema.

> [!quote]- De la transcripción — polinomios, curvas elípticas y claves más chicas (cues 1023-1045)
> *"Toda esta formulación, a diferencia de RSA, donde se trabaja con números y aritmética modular, está formulada desde un punto de vista de poder trabajar con cualquier campo algebraico. Entonces yo podría aplicar Diffie-Hellman a números módulo $n$, pero también podría trabajar sobre anillos de polinomios, y de golpe tener una transformación que tiene como entrada bloques de 64, 128 bytes y de salida bloques de 128 bytes, que es algo que con RSA no voy a tener, y voy a perder espacio de almacenamiento. Pero también voy a poder meterme con espacios más complejos, como el de curvas elípticas, que son espacios algebraicos que cumplen con todas las mismas propiedades, pero donde está demostrado que el problema de decisión de Diffie-Hellman es mucho más complejo; de hecho, es exponencial. Y eso nos permite relajar el tamaño de las claves. Cuando trabajamos con curvas elípticas las operaciones son un chino —multiplicar 2 puntos o sumar 2 puntos de curvas elípticas no es trivial—, pero existen las operaciones y se implementan, y nos permite volver a tamaños de clave más chicos. En muchos usos las claves requieren esfuerzo extra para almacenarlas de forma segura: a veces hay que sacarlas y tenerlas en papel, a veces hay que tipearlas a mano; volver a claves mucho más chicas vuelve más tratable ese problema. Con curvas elípticas se puede trabajar con claves mucho más compactas: 256 y 320 son 2 tamaños de clave de curvas elípticas bastante usados, mucho mejor que 2048 o 4096, que también se ven en el campo."*

> **Precisión sobre "está demostrado que es exponencial"** *(nuestra)*. No está demostrado. Lo que ocurre es que, para curvas bien elegidas, **no se conoce** ningún algoritmo subexponencial para el logaritmo discreto —los mejores ataques genéricos cuestan del orden de $\sqrt{q}$—, mientras que sobre $\mathbb{Z}_p^{*}$ sí existen los ataques subexponenciales (*index calculus*) que obligan a 2048 bits. La ausencia de un ataque mejor es lo que permite claves de 256 bits, y es una situación empírica, no un teorema. Y vale recordar, contra la pregunta que quedó abierta en [[diffie-hellman#La pregunta sobre computación cuántica|Diffie-Hellman]], que **Shor rompe el logaritmo discreto sobre curvas elípticas igual que sobre enteros**: las curvas ahorran bits, no protegen de lo cuántico.

## Ejemplo numérico, verificado

Con parámetros deliberadamente chicos, $G = \mathbb{Z}_q^{*}$, $q = 2357$ (primo), $g = 2$:

$$x = 1751 \;\longrightarrow\; h = g^{x} \bmod q = 2^{1751} \bmod 2357 = 1185$$

Cifrado de $m = 2035$ con $y = 1520$ elegido al azar:

$$c = \bigl(2^{1520} \bmod 2357,\ \ 2035\cdot 1185^{1520} \bmod 2357\bigr) = (1430,\ 697)$$

Descifrado de $c=(1430,697)$:

$$1430^{-1751}\cdot 697 \bmod 2357 = 2035 \quad\checkmark$$

Las tres cuentas cierran exactamente como las escribe la filmina 31 — verificado con aritmética modular, no solo leído del PDF. En el aula esta filmina no se comentó: la voz pasó de los tamaños de clave a la pausa.
