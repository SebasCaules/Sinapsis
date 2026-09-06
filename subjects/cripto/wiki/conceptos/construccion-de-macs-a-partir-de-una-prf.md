---
title: Construcción de MACs a partir de una función pseudoaleatoria
resumen: 'El paso del MAC de longitud fija, una sola aplicación de una función pseudoaleatoria, al de longitud arbitraria: tres intentos fallidos con sus ataques y la construcción genérica que sí funciona pero es ineficiente.'
fuentes: ["[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Construcción de MACs a partir de una PRF, MAC de longitud fija, Extensión de dominio de un MAC, Domain extension, Construcción genérica de MAC de longitud variable, Ataque de truncado, Ataque de mezcla de mensajes, Permutación de bloques]
type: concepto
unidad: 1
clase: 3
orden: 19
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, mac, prf, longitud-fija, longitud-variable, extension-de-dominio, cbc-mac, mac-forge, clase-03, practica-04]
sources: ["Clase 4.pdf (Práctica 4, 31/08/2026)", "Katz & Lindell cap. 4"]
---

# Construcción de MACs a partir de una función pseudoaleatoria

**Por qué [[cbc-mac|CBC-MAC]] encadena.** El vault, hasta esta nota, pasaba de la definición de MAC directamente a `CBC-MAC` sin decir nunca qué problema resuelve el encadenamiento — y el deck de teoría hace exactamente lo mismo: salta de la [[seguridad-de-un-mac#El ejercicio de los tres MACs|filmina 17]] a la 18 con un *"sea $F$ una función pseudoaleatoria"* de una línea. Las **filminas 3 y 4 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] (31/08)** son ese eslabón que falta: primero el MAC más simple posible —una sola aplicación de la primitiva—, después **tres intentos fallidos** de estirarlo a mensajes largos con sus tres ataques, y por último la construcción genérica que sí funciona y que la propia filmina descarta por ineficiente, con una flecha verde gruesa apuntando a `CBC-MAC`.

Nada de esto está en el deck de teoría ni en ninguna de las dos transcripciones de la Clase 03. Es material exclusivo de la práctica.

> **Artefacto de extracción, no errata.** Más de la mitad de la filmina 4 —las tres cajas *"Sugerencia"* completas y sus tres anotaciones de ataque— **desaparece** al pasar el PDF por `pdftotext`: quedan sólo la caja de la construcción genérica y las palabras sueltas *"¡Ineficiente!"* y *"CBC-MAC"*. Todo lo que sigue se transcribió del render de la página. La filmina no tiene errata; la herramienta sí.

---

## Dónde encaja: el escalón que faltaba

El arco completo del bloque de MACs, ordenado por lo que cada pieza aporta:

| Pieza | Qué mensajes autentica | Tamaño de la etiqueta | Dónde está |
|---|---|---|---|
| $t := F_k(m)$ | **sólo** los de exactamente $n$ bits | $n$ bits | Práctica, filmina 3 |
| Construcción genérica $r\Vert L\Vert i\Vert m_i$ | cualquiera, hasta $2^{n/4}$ bits | **crece con el mensaje** | Práctica, filmina 4 |
| [[cbc-mac\|CBC-MAC]] | cualquiera, con la longitud codificada | $n$ bits, **constante** | Teoría, filminas 18-21 |

La segunda fila es la que faltaba, y es la que vuelve inteligible la tercera: **`CBC-MAC` no es la primera idea que se le ocurre a nadie, es la que sobrevive después de que las obvias fallan o cuestan demasiado.**

## El MAC de longitud fija

La filmina 3 escribe la terna entera, sin abreviar:

$$\mathsf{Gen}: \quad k \leftarrow \{0,1\}^{n}$$

$$\mathsf{Mac}_k(m): \quad t \leftarrow F_k(m), \qquad \text{con } \lvert m\rvert = \lvert k\rvert = n$$

$$\mathsf{Vrfy}_k(m,t): \quad \text{si } \lvert m\rvert \neq \lvert k\rvert \Rightarrow 0; \quad \text{si no, } F_k(m) = t \Rightarrow 1$$

Con $F$ una [[primitiva-de-cifrado-en-bloque#Son funciones pseudoaleatorias|función pseudoaleatoria]] —la filmina lo destaca en una estrella verde—, y con el diagrama de datos al costado: $k$ y $m$ entran a $F_k$, sale $t$, y por el canal viaja el par $\langle m, t\rangle$.

Es la **Construcción 4.5** de Katz & Lindell, letra por letra, y su garantía es el **Teorema 4.6**: *si $F$ es pseudoaleatoria, esto es un MAC seguro para mensajes de longitud $n$*. La intuición de la demostración cabe en una frase: falsificar obliga al adversario a **acertar el valor de $F_k$ en un punto nuevo**; con una función verdaderamente aleatoria eso sale con probabilidad $2^{-n}$, y con una pseudoaleatoria sólo puede salir despreciablemente mejor —si saliera mucho mejor, esa diferencia misma sería un distinguidor—.

**Y es la respuesta correcta al ejercicio de la filmina 17.** Los [[seguridad-de-un-mac#Los tres, en una tabla|tres candidatos]] que la teoría del 27/08 derribó fallan por tres razones distintas, y esta construcción las evita a las tres: donde el candidato (a) usaba $G(k)\oplus m$ —invertible, la etiqueta regala el keystream— acá va $F_k$, que no se invierte; donde el (b) miraba sólo los primeros bits, acá la etiqueta depende de **todos**; y donde el (c) etiquetaba $\lvert m\rvert$ en vez de $m$, acá el argumento es el mensaje. *(Lectura nuestra: la filmina no hace la conexión, pero es la misma diapositiva del mismo bloque con el mismo esqueleto.)*

### El chequeo de longitud no es decorativo

La línea *"si $\lvert m\rvert \neq \lvert k\rvert \Rightarrow 0$"* parece burocracia y no lo es. Hace tres cosas:

1. **Define el dominio.** $F_k$ está definida sobre bloques de exactamente $n$ bits. Fuera de ahí no hay nada que calcular, así que sin el chequeo `Vrfy` ni siquiera es una función total.
2. **Es lo que convierte el esquema en un MAC de longitud fija en sentido formal.** Como `Vrfy` rechaza de plano todo lo que no mida $n$ bits, ningún adversario puede ganar [[seguridad-de-un-mac#El experimento Mac-Forge|Mac-Forge]] emitiendo un mensaje de otra longitud: la condición (1) del experimento falla sola. El teorema se enuncia *para mensajes de longitud $n$* justamente porque `Vrfy` lo hace cumplir.
3. **Es exactamente la línea que la filmina 18 de teoría omite** *(precisión nuestra)*. El vault ya tenía documentado que el `Vrfy` de [[cbc-mac#La construcción|CBC-MAC]] no chequea la longitud, y que esa omisión es lo que el [[cbc-mac#El ataque de longitud variable, paso a paso|ataque de la filmina 19]] explota. Curiosidad del arco: **la práctica del 31/08 escribe explícitamente el chequeo que el deck de teoría había omitido cuatro días antes** para la construcción análoga.

### Por qué esto no alcanza

Porque $n$ es el tamaño de bloque de la primitiva: 128 bits con [[aes|AES]], o sea **16 bytes**. Un MAC que sólo autentica mensajes de 16 bytes no sirve para nada real.

Katz lo dice con precisión en una nota al pie que conviene tener presente: **si existiera una función pseudoaleatoria que aceptara entradas de longitud arbitraria, la Construcción 4.5 ya sería un MAC completo** y no habría nada más que hacer. Todo el problema —y toda esta nota, y `CBC-MAC`, y [[hmac|HMAC]]— existe porque las funciones pseudoaleatorias prácticas, que son los cifradores de bloque, toman entradas **cortas y fijas**. El nombre técnico del problema es **extensión de dominio** (*domain extension*), y es la §4.3.2 del libro.

## Las tres sugerencias fallidas

![Filmina 4 de la Práctica 04: las tres sugerencias fallidas con sus ataques, la construcción genérica y el veredicto](../../assets/practica04-mac-longitud-variable.png)

El punto de partida es un MAC de longitud fija cualquiera $\Pi' = (\mathsf{Gen}', \mathsf{Mac}', \mathsf{Vrfy}')$ —el de la filmina 3, por ejemplo— y el mensaje partido en bloques $m = m_1 \Vert m_2 \Vert \cdots \Vert m_d$, con $d$ variable de mensaje a mensaje.

**Las tres sugerencias son razonables y las tres se rompen con probabilidad 1 y una o dos consultas.** Vale la pena hacer las cuentas, porque los tres ataques son material de examen reutilizable y ninguno depende de `CBC-MAC`.

### Sugerencia 1 — XOR de los bloques

$$t := \mathsf{Mac}'_k\Bigl(\bigoplus_{i} m_i\Bigr), \qquad \text{emitir } \langle m_1, m_2, \ldots, m_d;\ t\rangle$$

La filmina la tacha con: *"El adversario puede falsificar un tag válido sobre un nuevo mensaje, cambiando el mensaje original como para que el XOR de los bloques no cambie."*

**El ataque, con la cuenta.** El adversario consulta un mensaje de dos bloques $m = m_1 \Vert m_2$ con $m_1 \neq m_2$ y recibe $t = \mathsf{Mac}'_k(m_1 \oplus m_2)$. Ahora elige cualquier $\Delta \neq 0$ y emite

$$M = (m_1 \oplus \Delta) \,\Vert\, (m_2 \oplus \Delta) \qquad \text{con la misma } t$$

porque $(m_1\oplus\Delta)\oplus(m_2\oplus\Delta) = m_1 \oplus m_2$: **los $\Delta$ se cancelan de a pares** y el argumento de $\mathsf{Mac}'_k$ es idéntico. La verificación recalcula el mismo XOR, obtiene el mismo valor y acepta. Y $M \neq m$ porque $\Delta \neq 0$. Una consulta, probabilidad 1.

Sale todavía más barato: **permutar los bloques** ($M = m_2 \Vert m_1$) también deja el XOR intacto, porque el XOR es conmutativo. Cualquier reordenamiento sirve, y sale sin hacer ninguna cuenta.

> **Por qué falla de verdad** *(lectura nuestra).* La lección del segundo candidato de la filmina 17 era *"la etiqueta tiene que depender de todos los bits"*. Acá **depende de todos los bits** y falla igual, así que la lección hay que afinarla: **tiene que depender de ellos de una forma que el adversario no pueda cancelar.** Escrito de forma general, el esquema es $\mathsf{Mac}'_k\bigl(g(m)\bigr)$ con $g(m) = \bigoplus_i m_i$ una función **pública** que comprime un mensaje arbitrariamente largo a $n$ bits. Un esquema de esa forma es, como mucho, tan seguro como difícil sea hallar [[resistencias-de-una-funcion-de-hash|colisiones]] de $g$ — y las de un XOR se hallan a ojo. Es exactamente el paradigma [[hmac#HMAC es el paradigma hash-and-MAC|hash-and-MAC]] **instanciado con la peor función de hash imaginable**. Y el $\oplus$ que se cancela es la misma figura que ya apareció en [[maleabilidad]] y en el [[cbc-mac#El ataque de longitud variable, paso a paso|ataque a CBC-MAC]]: *primero anular, después escribir*.

### Sugerencia 2 — autenticar cada bloque por separado

$$t_i := \mathsf{Mac}'_k(m_i), \qquad \text{emitir } \langle m_1, \ldots, m_d;\ t_1, \ldots, t_d\rangle$$

La filmina la tacha con: *"El adversario puede cambiar el orden de los bloques y calcular un tag válido sobre ellos (ej. $m_d, \ldots, m_2, m_1$)."*

**El ataque, con la cuenta.** Consultar $m = m_1 \Vert m_2$ con $m_1 \neq m_2$ y recibir $\langle t_1, t_2\rangle$. Emitir

$$M = m_2 \,\Vert\, m_1 \qquad \text{con la etiqueta } \langle t_2, t_1\rangle$$

El verificador chequea bloque por bloque: $\mathsf{Vrfy}'_k(m_2, t_2) = 1$ y $\mathsf{Vrfy}'_k(m_1, t_1) = 1$. Las dos pasan, porque **cada par bloque-etiqueta es legítimo**; lo único que cambió es el orden, y el esquema no tiene forma de mirarlo. $M \neq m$, una consulta, probabilidad 1.

El mismo esquema cae también por **truncado** (emitir $m_1$ con $\langle t_1\rangle$) y por **empalme** entre dos mensajes distintos. La sugerencia autentica bloques; el problema es que un mensaje **no es un conjunto de bloques, es una secuencia**.

*(Detalle que ya conviene registrar: la etiqueta pasó a tener $d$ componentes. Esa inflación aparece acá y no se va a ir más — es lo que termina condenando a toda la familia.)*

### Sugerencia 3 — autenticar cada bloque con su número de secuencia

$$t_i := \mathsf{Mac}'_k(i \Vert m_i), \qquad \text{emitir } \langle m_1, \ldots, m_d;\ t_1, \ldots, t_d\rangle$$

La filmina la tacha con: *"El adversario puede mezclar bloques de diferentes mensajes"*, y da el ejemplo explícito: de $\langle m_1, \ldots, m_d; t_1,\ldots,t_d\rangle$ y $\langle m'_1, \ldots, m'_d; t'_1,\ldots,t'_d\rangle$ es válido $\langle m_1, m'_2, m_3, m'_4 \ldots; t_1, t'_2, t_3, t'_4 \ldots\rangle$.

**El ataque, con la cuenta.** Dos consultas, dos mensajes de la misma cantidad $d$ de bloques:

$$m = m_1\Vert\cdots\Vert m_d \;\longrightarrow\; \langle t_1,\ldots,t_d\rangle, \qquad m' = m'_1\Vert\cdots\Vert m'_d \;\longrightarrow\; \langle t'_1,\ldots,t'_d\rangle$$

Emitir el mensaje intercalado y la etiqueta intercalada del mismo modo:

$$M = m_1 \Vert m'_2 \Vert m_3 \Vert m'_4 \cdots \qquad \text{con } \langle t_1, t'_2, t_3, t'_4, \ldots\rangle$$

**Por qué pasa.** El bloque que ocupa la posición $i$ en $M$ es un bloque que **ya fue autenticado en esa misma posición $i$** —en $m$ o en $m'$, da igual—, así que su etiqueta es exactamente $\mathsf{Mac}'_k(i \Vert \cdot)$ con el $i$ correcto. Cada verificación individual pasa. Y $M \notin Q$ apenas $m$ y $m'$ difieran en alguna posición par. Dos consultas, probabilidad 1.

**El número de secuencia arregla el orden y no arregla la pertenencia.** Ata cada bloque a **su posición**, pero no a **su mensaje**: nada en $i \Vert m_i$ dice de qué mensaje salió ese bloque.

### El ataque que la filmina no enuncia: el truncado

*(Éste no está en la lámina; sale de Katz & Lindell §4.3.2, y hace falta para entender la construcción final.)*

La Sugerencia 3 cae también por un ataque más barato, de **una sola consulta**: pedir $m = m_1\Vert\cdots\Vert m_d$ y emitir

$$M = m_1 \Vert \cdots \Vert m_{d-1} \qquad \text{con } \langle t_1, \ldots, t_{d-1}\rangle$$

es decir, **tirar el último bloque del mensaje y la última componente de la etiqueta**. Los $d-1$ bloques que quedan conservan sus índices y sus etiquetas, así que todo verifica.

**Esto importa porque es el ataque que justifica el campo $L$ de la construcción final**, y la filmina pone ese campo sin decir nunca contra qué protege. Sin el truncado, $L$ parece decoración.

> **Por qué la longitud no se puede autenticar aparte** *(lectura nuestra; Katz deja la pregunta planteada y no la responde).* La reacción natural al truncado es agregar **un bloque más** con la longitud: $t_0 := \mathsf{Mac}'_k(0 \Vert L)$ junto a los $t_i$. No alcanza, y falla por la Sugerencia 3: el adversario consulta un segundo mensaje cualquiera cuya longitud sea $L' = (d-1)$ bloques, se queda con **su** $t_0$, y lo empalma con los $t_1,\ldots,t_{d-1}$ del primero. La etiqueta resultante es válida sobre $m_1\Vert\cdots\Vert m_{d-1}$. **Todo lo que se autentica por separado se puede recombinar por separado**, así que la longitud tiene que entrar en *cada* bloque — y por la misma razón entrará el identificador de mensaje.

## La construcción que sí funciona

La caja redondeada del pie de la filmina. Partiendo de un MAC de longitud fija $\Pi' = (\mathsf{Gen}', \mathsf{Mac}', \mathsf{Vrfy}')$ para mensajes de $n$ bits:

$$\mathsf{Gen} := \mathsf{Gen}', \qquad \lvert k\rvert = n, \qquad \lvert m\rvert = L < 2^{n/4}$$

$$m = m_1 \Vert m_2 \Vert \cdots \Vert m_d, \qquad \lvert m_i\rvert = n/4 \ \text{ (el último se completa con ceros)}$$

$$r \leftarrow \{0,1\}^{n/4}$$

$$t_i := \mathsf{Mac}'_k\bigl(r \Vert L \Vert i \Vert m_i\bigr) \quad (i = 1,\ldots,d), \qquad \text{emitir } \langle r,\, t_1,\, t_2,\, \ldots,\, t_d\rangle$$

Es la **Construcción 4.7** de Katz & Lindell, y su garantía es el **Teorema 4.8**: *si $\Pi'$ es un MAC seguro de longitud fija para mensajes de $n$ bits, entonces esto es un MAC seguro para mensajes de longitud arbitraria.* La demostración consiste, esencialmente, en mostrar que **los ataques de arriba son los únicos posibles**: se acota la probabilidad de que dos mensajes reciban el mismo identificador $r$ y, fuera de ese evento, cualquier falsificación obliga a autenticar un bloque $r\Vert L\Vert i\Vert m_i$ nunca visto, o sea a romper $\Pi'$.

### Los cuatro campos, y qué mata cada uno

**Cada uno de los cuatro campos está ahí para tapar un agujero concreto, y ninguno sobra:**

| Campo | Qué es | Qué ataque mata |
|---|---|---|
| $r$ | identificador **aleatorio, sorteado por mensaje** | la **mezcla** de bloques de dos mensajes distintos (Sugerencia 3): dos mensajes tienen $r$ distintos, así que ningún bloque de uno verifica en el lugar de otro |
| $L$ | la **longitud** del mensaje | el **truncado**: sacar bloques cambia $L$, y $L$ está adentro de cada etiqueta |
| $i$ | el **índice** del bloque | la **permutación** de bloques (Sugerencia 2) |
| $m_i$ | el bloque de mensaje | ninguno: es el dato |

La lectura que ordena todo: $r$ ata el bloque a **su mensaje**, $L$ lo ata a **la longitud total**, $i$ lo ata a **su posición**. Un bloque autenticado sólo sirve exactamente donde nació.

### Por qué los bloques son de n/4

Porque son **cuatro campos** y $\mathsf{Mac}'$ acepta exactamente $n$ bits:

$$\underbrace{n/4}_{r} + \underbrace{n/4}_{L} + \underbrace{n/4}_{i} + \underbrace{n/4}_{m_i} \;=\; n$$

Y de ahí sale también la cota $L < 2^{n/4}$ de la filmina: es lo que hace falta para que la longitud entre en su campo de $n/4$ bits. El índice entra por añadidura, porque $i \le d \le L$. *(La cota es astronómica —con $n = 128$ son $2^{32}$ bits, o sea medio gigabyte— y en la práctica no molesta; pero es una cota real que hay que verificar al fijar un $n$ concreto.)*

Nótese lo que eso significa: **de cada bloque de entrada de $\mathsf{Mac}'$, sólo la cuarta parte es mensaje.** Las otras tres cuartas partes son metadatos de encuadre. Ese es el precio, y se paga por bloque.

### Dos rarezas de esta construcción

*(Precisiones nuestras; ninguna está en la filmina, y las dos rompen patrones que el resto del curso da por sentados.)*

**`Mac` es aleatorizada.** El sorteo de $r$ hace que dos invocaciones sobre el mismo mensaje devuelvan etiquetas distintas. Es uno de los pocos casos del curso donde la flecha de $t \leftarrow \mathsf{Mac}_k(m)$ que [[message-authentication-code#La terna Gen, Mac y Vrfy|la Definición 4.1 usa]] está ahí por algo: casi todos los MACs reales son determinísticos, éste no.

**Y por lo tanto `Vrfy` no es canónica.** No puede serlo: el verificador no tiene forma de recomputar $r$, así que lo **lee de la etiqueta** y con él re-verifica cada bloque. Eso deja afuera la Proposición 4.4 —que regala seguridad fuerte a los MACs determinísticos con verificación canónica, y que es la que se aplica a [[cbc-mac|CBC-MAC]]—; el libro tiene que probar la seguridad fuerte de esta construcción **aparte**, y lo deja como Ejercicio 4.20.

## Por qué es ineficiente

Es el veredicto que la filmina pone en una caja de borde rojo con un triángulo de advertencia —**"¡Ineficiente!"**— y del que sale una flecha verde gruesa hacia una caja con **`CBC-MAC`**.

> **Cuidado con la lectura de la filmina.** *"¡Ineficiente!"* califica a **esta construcción**, no a `CBC-MAC`. Verificado en el render a 200 dpi: la caja del veredicto está pegada a la construcción genérica, y la flecha verde es la **salida** hacia `CBC-MAC`. Leído al revés, el mensaje de la filmina se invierte por completo.

**La cuenta.** Para un mensaje de $L$ bits: $d = \lceil 4L/n \rceil$ bloques, una etiqueta $t_i$ de $n$ bits por bloque, más el $r$ de $n/4$ bits. Total:

$$\lvert \text{etiqueta} \rvert = \frac{n}{4} + d \cdot n \;\approx\; \frac{n}{4} + 4L$$

**La etiqueta mide cuatro veces el mensaje** —y crece linealmente con él, sin techo—. Con `AES`, $n = 128$, bloques de 32 bits (4 bytes), sobre un mensaje de 1 KiB:

| | Construcción genérica | `CBC-MAC` |
|---|---|---|
| Bloques procesados | $8192/32 = 256$ | $8192/128 = 64$ |
| Evaluaciones de $F_k$ | **256** | **64** |
| Tamaño de la etiqueta | $4 + 256\times16 = 4100$ bytes ≈ **4,0 KiB** | **16 bytes**, y no depende del mensaje |

O sea: **cuatro veces el trabajo y unas 256 veces la etiqueta**, para un mensaje de un solo kilobyte — y la última cifra empeora sin límite a medida que el mensaje crece, porque una etiqueta es constante y la otra no. Katz es explícito sobre el estatus de esta construcción: la incluye por simple y general, dice que difícilmente se use en la práctica, y al presentar `CBC-MAC` señala que es *mucho* más eficiente, con $d$ evaluaciones del cifrador y una etiqueta de $n$ bits.

**Ése es exactamente el argumento que la filmina 18 de teoría nunca da**, y sin el cual `CBC-MAC` parece una construcción arbitraria en vez de la respuesta a un problema concreto:

$$\text{correcto pero } \Theta(L) \text{ de etiqueta} \;\longrightarrow\; \text{encadenar} \;\longrightarrow\; \Theta(1) \text{ de etiqueta}$$

El encadenamiento de `CBC-MAC` es, visto desde acá, **una forma de conseguir lo mismo que hacen $r$, $L$ e $i$ —atar cada bloque a su mensaje, a su longitud y a su posición— sin pagar una etiqueta por bloque**: el estado $t_{i-1}$ arrastra toda esa información hacia adelante en $n$ bits. Y el precio de esa compresión es justamente lo que la teoría desarrolla después: como el estado es único y arrastra todo, [[cbc-mac#Publicar los estados intermedios también rompe|revelarlo rompe el esquema]], y hay que codificar la longitud a mano.

## La correspondencia con Katz & Lindell

Las tres sugerencias de la filmina y las tres del libro **no son las mismas**, aunque las dos cadenas terminan en la misma construcción. Conviene tener la tabla, porque el orden del libro es el que explica de dónde sale cada campo:

| | Cadena de la filmina 4 | Cadena de Katz & Lindell §4.3.2 |
|---|---|---|
| 1 | XOR de los bloques → alterar sin cambiar el XOR | autenticar cada bloque → **reordenar** |
| 2 | autenticar cada bloque → **reordenar** | agregar el índice → **truncar** |
| 3 | agregar el índice → **mezclar** dos mensajes | agregar índice y longitud → **mezclar** dos mensajes |
| 4 | — | agregar el identificador $r$ |
| Final | $t_i := \mathsf{Mac}'_k(r\Vert L\Vert i\Vert m_i)$ | Construcción 4.7, **idéntica** |

Las diferencias, y qué implica cada una:

- **La filmina agrega un escalón que el libro no tiene** (el XOR), y es un buen agregado: es la idea más natural de todas y su ataque es el más instructivo.
- **La filmina comprime dos escalones del libro en uno.** Su Sugerencia 3 es la idea 2 del libro, pero le imputa el ataque que el libro reserva para la idea 3. Los dos ataques son correctos contra el índice solo; el libro los separa para que **cada campo entre por su propio ataque**.
- **Por eso la filmina se queda sin justificar $L$**: el ataque que lo motiva —el truncado— es el único de la cadena del libro que la lámina no enuncia. Es el hueco que la sección anterior tapa.

## Ver también

- [[cbc-mac|CBC-MAC]] — a dónde apunta la flecha verde de la filmina: la construcción que consigue lo mismo con una etiqueta de un solo bloque, y qué le cuesta
- [[seguridad-de-un-mac#El experimento Mac-Forge|Seguridad de un MAC]] — `Mac-Forge`, el experimento que los cuatro ataques de esta nota ganan con probabilidad 1
- [[message-authentication-code#La terna Gen, Mac y Vrfy|Message Authentication Code]] — la terna y la propiedad básica; acá se ve por qué `Mac` puede ser aleatorizada
- [[primitiva-de-cifrado-en-bloque#Son funciones pseudoaleatorias|Primitiva de cifrado en bloque]] — qué es $F_k$, y [[primitiva-de-cifrado-en-bloque#Extensión: padding|el padding]] con el que se completa el último bloque
- [[hmac#HMAC es el paradigma hash-and-MAC|HMAC]] — el paradigma *hash-and-MAC*, del que la Sugerencia 1 es la instanciación degenerada
- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] — por qué comprimir con una función pública obliga a que sus colisiones sean difíciles
- [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]] — el identificador $r$ acá y el número de secuencia allá son el mismo recurso: un valor que no se repite
- [[maleabilidad|Maleabilidad]] — el $\oplus$ que se cancela, que es lo que rompe la Sugerencia 1
- [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04 — MACs, hash y cifrado autenticado]] — las filminas 3 y 4 en su contexto
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]]
- Katz & Lindell cap. 4 — §4.3.1 (Construcción 4.5, Teorema 4.6), §4.3.2 *Domain Extension for MACs* (las tres ideas descartadas, Construcción 4.7, Teorema 4.8) y el Ejercicio 4.20 ([[bibliografia|bibliografía]])
