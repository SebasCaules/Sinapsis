---
title: Práctica 03 — Seudoaleatoriedad y modos
resumen: 'El mapa de la Clase 02 dibujado como esquema, del secreto perfecto a la seudoaleatoriedad, con dos aportes propios: las claves débiles y semidébiles de DES y cuatro láminas de CFB con bloque de 32 bits.'
fuentes: ["[[clase-02-cifrado]]", "[[guia-02-criptografia-simetrica]]"]
aliases: [Práctica 3, Práctica 03, Practica 3, Clase práctica 3, Mapa de la Clase 02, Láminas de Modo CFB, Claves semidébiles]
type: practica
clase: 2
orden: 23
practica: 3
fecha: 2026-08-24
created: 2026-08-24
updated: 2026-09-04
tags: [practica, seudoaleatoriedad, prg, prf, stream-cipher, block-cipher, otp, cpa, des, 3des, claves-debiles, cfb, modos, propagacion-de-errores, lfsr, rc4, golomb, berlekamp-massey, videos, criptored, clase-02]
sources: ["Clase 3.pdf", "Modo CFB.pdf", "Píldora formativa 33 — ¿Cómo se usan los registros de desplazamiento en la cifra? (Criptored/UPM, guion de Jorge Ramió)", "Píldora formativa 35 — ¿Cómo funciona el algoritmo RC4? (Criptored/UPM, guion de Jorge Ramió)", "Píldora formativa 28 — ¿Cómo funcionan los algoritmos DES y 3DES? (Criptored/UPM, guion de Jorge Ramió)"]
---

# Práctica 03 — Seudoaleatoriedad y modos

> **24/08/2026** · Filminas: [`Clase 3.pdf`](../../raw/practicas/Clase%203.pdf) (10 pp.) y [`Modo CFB.pdf`](../../raw/practicas/Modo%20CFB.pdf) (4 pp.), las dos de **Ana Arias Roig** · Teoría: [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] · Guía: [[guia-02-criptografia-simetrica|Guía 2 — Criptografía Simétrica]]

> **Ojo con el nombre del archivo.** El PDF se llama `Clase 3.pdf`, pero vive en `raw/practicas/`: es la **clase práctica 3, del lunes 24/08**, no la clase teórica 3 (ésa son los jueves **27/08 y 03/09**, y está ingerida en [[clase-03-macs-y-cifrado-autenticado|clase-03]]). Es exactamente el mismo patrón que ya documenta la [[practica-01-esquemas-y-taxonomias|Práctica 01]], donde `Clase 1.pdf` resultó ser la práctica del 10/08 y no la teórica del 06/08, y que la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] repite con `Clase 4.pdf`. **Dos numeraciones paralelas con nombres de archivo idénticos**: la de las teóricas (jueves) y la de las prácticas (lunes). Y el patrón no se queda en `raw/practicas/`: `raw/clases/Clase 03pt2 - Transcripcion.VTT` tampoco es la Clase 4, sino la **segunda sesión de la Clase 3** — ahí la cátedra numera por sesión.

Esta práctica **no trae material nuevo casi en ningún punto**: es el **mapa** del bloque entero de la [[clase-02-cifrado|Clase 02]], dibujado como esquema. Esta nota responde *"¿cómo se conecta todo esto entre sí?"* — el recorrido Secreto Perfecto → Seguridad Computacional → Seudoaleatoriedad, y de ahí a los cifrados de flujo, a los de bloque, a `CPA` y a `DES` — en una sola página, con los desarrollos linkeados.

Dicho eso, hay **dos lugares donde la práctica va más lejos que las filminas de teoría**, y son los que justifican leerla aunque ya te sepas la Clase 02:

1. **[[#8. Claves débiles y semi-débiles: el aporte más fuerte|Claves débiles y semi-débiles caracterizadas por cantidad de subclaves]]** — 1 para las débiles, 2 o 4 para las semi-débiles. Es el [[guia-02-criptografia-simetrica#Ejercicio 8|Ej. 8 de la Guía 2]] dicho por la cátedra, con un criterio más operativo que el del enunciado — y es la **única fuente de la cátedra** que nombra las semi-débiles.
2. **[[#9. Modo CFB: cuatro láminas con bloque de 32 bits y segmento de 8|Las cuatro láminas de CFB con n = 32 y s = 8]]**, que incluyen un caso de falla —**bloques fuera de orden**— que no aparece en ninguna otra fuente del vault, y dejan planteado un ejercicio que es el [[guia-02-resolucion#Ejercicio 6|Ej. 6c de la Guía 2]] con otros parámetros.

---

## 1. El eje que organiza todo

La primera filmina es una sola flecha con tres estaciones:

$$\text{Secreto Perfecto} \;\longrightarrow\; \text{SEGURIDAD COMPUTACIONAL} \;\longrightarrow\; \text{Seudoaleatoriedad}$$

y la estación del medio abierta en sus dos ingredientes:

| Ingrediente de la seguridad computacional | Qué relaja |
|---|---|
| **Adversarios eficientes** | Ya no *cualquier* adversario: sólo los que corren en tiempo razonable ($\mathrm{PPT}$) |
| **Probabilidad de éxito despreciable** | Ya no *cero* probabilidad de éxito: se acepta un margen que decae más rápido que cualquier polinomio |

Ésa es toda la estructura del bloque, y conviene tenerla en la cabeza como una sola frase: **el [[secreto-perfecto|secreto perfecto]] es demasiado caro (exige $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$), así que se baja la vara en dos ejes a la vez —quién ataca y con qué garantía— y lo que queda es la [[seguridad-computacional|seguridad computacional]]; y para construir algo dentro de ese marco hace falta una sola herramienta nueva: la seudoaleatoriedad.**

> **Por qué las dos relajaciones van juntas y no por separado.** Están desarrolladas en [[seguridad-computacional#Nivel de seguridad|Seguridad computacional § Nivel de seguridad]]: el par $\mathrm{PPT}$ + despreciable es lo que permite *componer* construcciones, porque un adversario que da $p(n)$ pasos, cada uno con probabilidad despreciable de acertar, sigue teniendo probabilidad total despreciable. Sin ese par no habría demostraciones por reducción, que es todo lo que sigue.

---

## 2. La tripleta, y la identificación que la teoría no hace tan de frente

La segunda filmina pone tres columnas, una por objeto. El aporte de la práctica está en la **última**, donde a dos de los tres les pone un signo igual:

| Objeto | Definición de la filmina | Y esto **es**… |
|---|---|---|
| **Cadena seudoaleatoria** | *"parece una cadena con una distribución uniforme (aleatoria)"* | — |
| **Generador Seudoaleatorio $G$** | *"algoritmo determinístico que recibe una semilla $s$ pequeña y aleatoria y la expande a una $r$ de longitud mayor y seudoaleatoria"* | **= STREAM CIPHER.** Ej: `RC4`, `LFSR` |
| **Función Seudoaleatoria $F_k$** | *"función que es indistinguible de una función elegida en forma aleatoria del conjunto de $F: \{0,1\}^{n} \to \{0,1\}^{n}$"* | **= BLOCK CIPHERS** |

$$r := G(s) \quad \text{con} \quad \lvert s\rvert = n \quad \text{y} \quad \lvert r\rvert = l(n) > n$$

> **La semilla $s$ es el secreto.** — así, subrayado, en la filmina.

**Ése es el mapa conceptual que hay que llevarse.** Las filminas de teoría desarrollan las cuatro cosas —generador, cifrado de flujo, función pseudoaleatoria, cifrado en bloque— pero **en cuatro momentos distintos**, y la identificación queda implícita. Acá está escrita con un signo igual:

- $G$ **es** el cifrado de flujo → [[generador-pseudoaleatorio|Generador pseudoaleatorio]] · [[criptosistema-de-flujo|Criptosistema de flujo]]
- $F_k$ **es** el cifrado en bloque → [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]]

Y con eso las dos ramas de la criptografía simétrica quedan alineadas contra la misma vara: **una primitiva es aceptable cuando es indistinguible de su contraparte verdaderamente aleatoria**. Lo único que cambia entre las dos ramas es *de qué* se pide indistinguibilidad: de una **cadena** uniforme en un caso, de una **función** elegida al azar entre todas las de $\{0,1\}^{n} \to \{0,1\}^{n}$ en el otro.

> **Un detalle de la definición de $F_k$ que conviene no pasar de largo** *(lectura nuestra).* La filmina compara $F_k$ contra "una función elegida al azar del conjunto de las $F: \{0,1\}^{n} \to \{0,1\}^{n}$". Ese conjunto tiene $(2^{n})^{2^{n}}$ elementos, así que describir uno de sus miembros cuesta $n \cdot 2^{n}$ bits; $F_k$ se describe con **$n$ bits de clave**. La exigencia es que esa compresión brutal **no se note desde afuera**. Es la misma exigencia que en $G$ —comprimir $l(n)$ bits en $n$— un escalón más arriba.

> **Ojo con la letra $s$.** La filmina la usa dos veces con sentidos distintos: acá es la **semilla** del generador, y en el [[#5. El esquema CPA-seguro construido sobre la función pseudoaleatoria|esquema CPA-seguro]] es la **segunda componente del criptograma**. No son lo mismo.

---

## 3. El OTP redefinido con el generador, y su veredicto

La filmina dice literalmente *"Redefine OTP"* y escribe la terna:

$$\begin{aligned}
&k \leftarrow \mathsf{Gen}(1^{n}), &&\lvert k\rvert = n\\
&c := G(k) \oplus m, &&\lvert m\rvert = l(n) > n\\
&m := G(k) \oplus c
\end{aligned}$$

*(La filmina las escribe como tres viñetas sueltas, sin rotularlas $\mathsf{Gen}/\mathsf{Enc}/\mathsf{Dec}$; el orden es ése.)*

con el veredicto en mayúsculas al costado:

> **ESQUEMA SEGURO ante Eavesdropping PARA MENSAJES DE LONGITUD FIJA.**
>
> $$\Pr\big[\mathsf{PrivK}^{\mathsf{eav}}_{A,\mathsf{OTP}}(n) = 1\big] = \tfrac{1}{2} + \mathsf{negl}(n)$$

Tres cosas para leer ahí:

**1. Esto ya no es el OTP: es un [[criptosistema-de-flujo|criptosistema de flujo]].** La cátedra elige presentarlo como *"redefinir el OTP"*, que es didácticamente honesto —la ecuación es idéntica, sólo cambia de dónde sale el keystream—, pero el objeto resultante **ya no tiene [[secreto-perfecto|secreto perfecto]]**: la clave es más corta que el mensaje ($n < l(n)$), y el [[secreto-perfecto#Teorema de Shannon (cota de claves)|teorema de Shannon]] lo prohíbe. Lo que se conserva es la *forma*; lo que se pierde es la garantía incondicional, y a cambio se gana una clave de tamaño manejable.

**2. "PARA MENSAJES DE LONGITUD FIJA" no es un adorno.** El esquema está definido para $\lvert m\rvert = l(n)$ **exactamente**, con $l$ fijada de antemano. Si los mensajes pudieran tener largos distintos, el criptograma filtraría el largo —que es justamente lo que la prueba `Eav` exige que no pase, porque $m_0$ y $m_1$ pueden diferir en longitud—. La restricción está en la filmina y hay que citarla al responder.

**3. El "=" de la cota es la taquigrafía de siempre.** La filmina escribe una igualdad; lo que se quiere decir es $\le \tfrac{1}{2} + \mathsf{negl}(n)$ **para todo adversario $\mathrm{PPT}$**. Los dos cuantificadores que la notación se come están discutidos en [[pruebas-de-indistinguibilidad#Las tres pruebas|Pruebas de indistinguibilidad]].

Y debajo, el límite, también en mayúsculas:

> **OTP NO ES SEGURO PARA MÚLTIPLES MENSAJES. (Vectores de mensajes)**

Es la prueba $\mathsf{Mul}$, y el mecanismo de la falla es de una línea: con la misma clave, $c_1 \oplus c_2 = m_1 \oplus m_2$ y el keystream se cancela. → [[criptosistema-de-flujo#El límite: no pasa Mul|Criptosistema de flujo § El límite: no pasa Mul]]

---

## 4. Seguridad para múltiples mensajes: los dos modos

La filmina responde al problema anterior con **dos diagramas**, rotulados así:

| Modo | Qué muestra el diagrama | Lectura |
|---|---|---|
| **Modo Sincrónico** | **un solo** $\mathrm{IV}$ al principio, y $G$ **encadenado**: la salida de una invocación alimenta la siguiente, y de cada tramo salen $c_1, c_2, c_3$ | Emisor y receptor mantienen un **estado compartido** que avanza con cada mensaje. Barato, pero exige que ninguno se desincronice |
| **Modo Asincrónico** | $\mathrm{IV}_1, \mathrm{IV}_2, \mathrm{IV}_3$ — **uno por mensaje**, cada uno entrando a su propia invocación de $G$ | Cada mensaje se cifra solo. El $\mathrm{IV}$ viaja con el criptograma; no hay estado que mantener |

Es exactamente la distinción que la Clase 02 desarrolla como **modo sincronizado / no sincronizado** → [[cifrado-probabilistico-nonce-e-iv#Las dos formas|Cifrado probabilístico, nonce e IV § Las dos formas]]. Lo que aporta la práctica es el **dibujo lado a lado**: se ve de un vistazo que la diferencia no está en $G$ sino en **cuántos $\mathrm{IV}$ hay y quién se acuerda de qué**.

> **La regla que unifica los dos** *(remite a [[cifrado-probabilistico-nonce-e-iv#Nonce e IV no son exactamente lo mismo|nonce e IV]]).* En los dos casos lo que se está evitando es reusar keystream con la misma clave. El sincrónico lo logra **avanzando** (nunca vuelve atrás); el asincrónico, **sorteando** un $\mathrm{IV}$ fresco. Son las dos únicas maneras.

Entre este bloque y el siguiente, la práctica intercala **dos láminas tituladas *"Modos de Operación de BLOCK CIPHERS"* y *"(cont.)"*** de las que la extracción de texto no recupera **nada**: son diagramas puros. No transcribimos lo que no leímos. El desarrollo de los cinco modos —`ECB`, `CBC`, `CFB`, `OFB`, `CTR`— está en [[modos-de-encadenamiento|Modos de encadenamiento]], y el modo que la cátedra sí desplegó en detalle ese mismo día tiene su [[#9. Modo CFB: cuatro láminas con bloque de 32 bits y segmento de 8|sección propia más abajo]].

---

## 5. El esquema CPA-seguro construido sobre la función pseudoaleatoria

Ésta es la **construcción canónica** de la materia: cómo se pasa de tener una función pseudoaleatoria a tener un criptosistema que aprueba `CPA`. Conviene tenerla escrita entera, porque es la que se pide reproducir.

$$\begin{aligned}
\mathsf{Gen} &: \ k \leftarrow \{0,1\}^{n}, \qquad \lvert k\rvert = n\\[4pt]
\mathsf{Enc} &: \ \text{para } m \text{ con } \lvert m\rvert = n, \ \text{se elige } r \leftarrow \{0,1\}^{n} \ \text{y}\\
             &\qquad c := \big\langle\, r,\ F_k(r) \oplus m \,\big\rangle\\[4pt]
\mathsf{Dec} &: \ \text{dado } c = \langle r, s\rangle, \qquad m := F_k(r) \oplus s
\end{aligned}$$

> **ESQUEMA SEGURO ante CPA** (*Chosen Plaintext Attack*)
>
> $$\Pr\big[\mathsf{PrivK}^{\mathsf{CPA}}_{A,\Pi}(n) = 1\big] = \tfrac{1}{2} + \mathsf{negl}(n)$$

### Cómo leerla

**$r$ es el $\mathrm{IV}$, y va en claro.** El criptograma es un **par**: la primera componente es el valor fresco $r$ y la segunda es el mensaje enmascarado. El receptor no necesita saber nada más, porque $r$ viaja adentro del criptograma. Es el [[#4. Seguridad para múltiples mensajes: los dos modos|modo asincrónico]] de la sección anterior, ahora sobre una función de bloque en vez de un generador.

**"$r$ fresco por mensaje" es toda la seguridad del esquema.** Si $r$ se repitiera para dos mensajes con la misma $k$, el keystream $F_k(r)$ se repetiría y volveríamos al xor de los dos planos. Y si $r$ fuera *predecible* en lugar de sorteado, un adversario que consulta el oráculo en el momento justo puede prepararse el ataque — es la misma razón por la que `CBC` exige [[cifrado-probabilistico-nonce-e-iv#Nonce e IV no son exactamente lo mismo|IV aleatorio y no sólo único]].

**Es la respuesta constructiva a la propiedad (1) de `CPA`.** [[pruebas-de-indistinguibilidad#Propiedades de CPA|Un criptosistema determinístico no puede ser CPA-Secure]]; $F_k$ **es** determinística; el $r$ sorteado es lo que vuelve probabilístico al esquema **sin tocar la primitiva**. Cifrar el mismo $m$ dos veces da dos criptogramas distintos, y el adversario del oráculo se queda sin la comparación que lo hacía ganar.

> **El precio, que la filmina no menciona** *(lectura nuestra).* El criptograma mide $2n$ bits para un mensaje de $n$: **el doble**. Esa expansión es el costo de mandar el $\mathrm{IV}$ en claro con cada bloque, y es exactamente lo que los [[modos-de-encadenamiento|modos de encadenamiento]] vienen a amortizar — `CBC` o `CTR` pagan **un solo** $\mathrm{IV}$ para un mensaje entero de muchos bloques, en lugar de uno por bloque.

> **Y qué pasa si $\lvert m\rvert > n$.** El esquema está definido para mensajes de exactamente un bloque. La extensión es la propiedad (3) de `CPA` —partir en bloques y concatenar—, que **sólo es válida porque este esquema ya es probabilístico**. Aplicarle la misma receta a $F_k$ pelada es el modo [[modos-de-encadenamiento|ECB]], y `ECB` no es CPA-Secure. Las dos propiedades leídas juntas son la justificación completa de por qué existen los modos de encadenamiento.

---

## 6. El experimento PrivK-CPA, en 5 pasos

La filmina lo escribe completo, y **es la versión más precisa que hay en el material de la cátedra** — más que la de las filminas de teoría, que comprimen los pasos 2 y 4 en uno solo:

$$\begin{aligned}
&1)\ \ k \leftarrow \mathsf{Gen}(n)\\
&2)\ \ A \text{ recibe } 1^{n} \text{ y acceso al oráculo } \mathsf{Enc}_k(\cdot), \text{ y emite } m_0 \text{ y } m_1 \text{ de igual longitud}\\
&3)\ \ \text{se elige } b \leftarrow \{0,1\}; \text{ se calcula } c \leftarrow \mathsf{Enc}_k(m_b) \text{ y se lo entrega a } A \ (\textit{challenge ciphertext})\\
&4)\ \ A \ \textbf{sigue teniendo acceso} \text{ al oráculo } \mathsf{Enc}_k(\cdot) \text{ y emite un bit } b'\\
&5)\ \ \text{si } b' = b, \text{ la salida del experimento es } 1 \ (\text{ÉXITO}); \text{ si no, es } 0
\end{aligned}$$

$$\Pr\big[\mathsf{PrivK}^{\mathsf{CPA}}_{A,\Pi}(n) = 1\big] = \tfrac{1}{2} + \mathsf{negl}(n)$$

### Los tres detalles que esta versión agrega

**1. El oráculo está disponible ANTES y DESPUÉS del desafío.** Es lo que dice el paso 4 con todas las letras, y es la diferencia entre `CPA` y una prueba de una sola fase. La [[pruebas-de-indistinguibilidad#Las tres pruebas|versión de la wiki]] sólo menciona el acceso previo; acá queda explícito que el adversario **puede volver a consultar sabiendo ya cómo es $c$**.

> **Por qué eso importa, y no es un tecnicismo** *(desarrollo nuestro).* Con acceso posterior, el adversario tiene la jugada más simple del mundo: recibir $c$, y **entonces** preguntarle al oráculo por $m_0$. Si `Enc` fuera determinística, la respuesta sería idéntica a $c$ exactamente cuando $b = 0$, y gana con probabilidad 1. O sea: el paso 4 es lo que convierte a *"determinístico ⟹ no CPA-Secure"* en una demostración de una línea, sin necesidad de anticipar nada. → [[pruebas-de-indistinguibilidad#Propiedades de CPA|Propiedades de CPA]]

**2. $m_0$ y $m_1$ deben tener *igual longitud*.** Sin esa cláusula la prueba sería trivial de ganar para cualquier esquema razonable: se miden los criptogramas y listo. Ningún cifrado de los que se estudian acá oculta el largo del mensaje, así que la definición lo saca de la discusión por decreto. Es la misma razón por la que el [[#3. El OTP redefinido con el generador, y su veredicto|OTP con el generador G]] se enuncia *"para mensajes de longitud fija"*.

**3. $A$ recibe $1^{n}$.** El $1^{n}$ (la cadena de $n$ unos) es la manera estándar de **entregarle al adversario el parámetro de seguridad en unario**, para que "tiempo polinomial en $n$" tenga sentido: si $n$ llegara en binario, $A$ tendría sólo $\log n$ bits de entrada y no podría ni leer la clave en tiempo polinomial en el tamaño de su entrada. Es notación de Katz & Lindell, y aparece también en el $\mathsf{Gen}(1^{n})$ de la [[#3. El OTP redefinido con el generador, y su veredicto|sección 3]].

---

## 7. DES: la caja de Feistel y la función de transformación

La práctica dibuja `DES` en dos diagramas, y su aporte es **el mapa de nombres**: los rótulos que usa acá no son los mismos que los de la teoría ni los del apunte.

### El diagrama de la ronda

$$\begin{aligned}
&\text{entrada de la ronda } i: \quad L_{i-1} \ (32 \text{ bits}) \ \Vert \ R_{i-1} \ (32 \text{ bits})\\
&\text{camino de la clave: } \ C_{i-1} \ \Vert \ D_{i-1} \ (56 \text{ bits}) \ \xrightarrow{\ \text{Compresión-Permutación}\ } \ 48 \text{ bits}\\
&\text{salida de la ronda } i: \quad L_i \ \Vert \ R_i
\end{aligned}$$

La caja de la derecha —rotulada literalmente **"Caja Feistel"**— es el bloque elemental: $L_{i-1}$ y $R_{i-1}$ entran, $R_{i-1}$ atraviesa $F$ junto con la subclave, la salida se xorea con $L_{i-1}$, y las mitades se cruzan.

### La función de transformación, en tres pasos

La filmina desglosa $F(R_{i-1}, K_i)$ en exactamente estos tres rótulos numerados. La cuarta fila no es parte de $F$: traduce el rótulo del **camino de clave**, que la filmina tampoco nombra como en la teoría.

| Paso en la práctica | Nombre en [[des-y-3des#La función de transformación\|la teoría]] y en [[des-descripcion-del-algoritmo\|el apunte]] | Tamaños |
|---|---|---|
| **1. Expansión-permutación** | $E$ | $32 \to 48$ bits |
| **2. Sustitución SBox** | las ocho cajas $S_1 \dots S_8$ | $48 \to 32$ (cada caja, $6 \to 4$) |
| **3. Permutación PBox** | $P$ | $32 \to 32$ bits |
| **Compresión-Permutación** (camino de clave) | **PC-2** | $56 \to 48$ bits |

Y la partición $C_{i-1} \Vert D_{i-1}$ de los 56 bits es la que produjo **PC-1**, aunque la filmina no la nombre. → [[des-y-3des#Generación de subclaves|Generación de subclaves]] para el detalle, y [[des-descripcion-del-algoritmo|Descripción del algoritmo DES]] para las tablas bit a bit.

> **Inconsistencia de la filmina.** Dentro de la misma lámina la subclave aparece escrita de dos maneras: **$K_{i-1}$** en el diagrama de la caja de Feistel y en el rótulo del bloque de 56 bits, pero **$K_i$** en la expresión $F(R_{i-1}, K_i)$. La correcta —y la que usa el resto del vault— es la segunda: **la ronda $i$ usa la subclave $K_i$**, derivada de $(C_i, D_i)$. Si la copiás tal cual del diagrama, el índice te va a quedar corrido en uno.

---

## 8. Claves débiles y semi-débiles: el aporte más fuerte

Acá la práctica **sí agrega**, y es material directamente examinable: es el [[guia-02-criptografia-simetrica#Ejercicio 8|Ej. 8 de la Guía 2]] enunciado por la cátedra, con un criterio que la guía no da.

### Lo que dice la filmina, literal

> **Claves Débiles:**
> $$\mathsf{Enc}_K(m) = \mathsf{Dec}_K(m) \qquad \text{o sea:} \qquad \mathsf{Enc}_K\big(\mathsf{Enc}_K(m)\big) = m$$
> *(en lugar de generar 16 subclaves distintas, generan **1**)*

> **Claves Semidébiles:** *(vienen de a pares)*
> $$\mathsf{Enc}_{K_x}\big(\mathsf{Enc}_{K_y}(m)\big) = m$$
> *(en lugar de generar 16 subclaves distintas, generan **2 o 4**)*

### Por qué esta caracterización es la buena

La definición de la guía es *funcional* (*"$\mathsf{Enc}_K$ es una involución"*): dice **qué se observa desde afuera**. La de la práctica es *estructural*: dice **dónde está la causa**, y es la misma para los dos casos —**cuántas subclaves distintas produce el key schedule**—. Con un solo número se separan las tres situaciones:

| Tipo de clave | Subclaves distintas | Qué se observa desde afuera |
|---|---|---|
| **Normal** | 16 | nada raro |
| **Débil** | **1** | $\mathsf{Enc}_K = \mathsf{Dec}_K$: cifrar dos veces devuelve el original |
| **Semi-débil** | **2 o 4** | existe una compañera $K_y$ tal que $\mathsf{Enc}_{K_x} \circ \mathsf{Enc}_{K_y} = \mathrm{id}$ |

Y el puente con el mecanismo es inmediato, porque las subclaves salen de **rotar** las dos mitades $C_0$ y $D_0$:

La subclave $K_i$ depende sólo del par $(C_i, D_i)$, o sea de las dos mitades rotadas por el **corrimiento acumulado** $r_1 + \dots + r_i$. Si las dos mitades son periódicas, el par se repite en cuanto el acumulado da la misma vuelta, y la cantidad de subclaves distintas queda determinada por el **período**:

| Período de las mitades bajo rotación | Subclaves distintas | Cuáles son |
|---|---|---|
| las dos **constantes** (período 1) | **1** | $C_0, D_0 \in \{0^{28},\, 1^{28}\}$ → $2 \times 2 = 4$ claves **débiles** |
| las dos fijas bajo la rotación de **2**, al menos una de período exactamente 2 | **2** | se suman los patrones alternados $(01)^{14}$ y $(10)^{14}$ → las **semi-débiles** |
| las dos fijas bajo la rotación de **4**, al menos una de período exactamente 4 | **4** | mitades que repiten un patrón de 4 bits |

El mecanismo, en una línea por caso: con mitades constantes el acumulado no cambia nada y $K_i$ es siempre la misma; con período 2, $(C_i, D_i)$ depende sólo de la **paridad** del acumulado, y el calendario de `DES` produce acumulados de las dos paridades → 2 subclaves; con período 4 depende del acumulado **módulo 4**, y el calendario recorre las cuatro clases → 4 subclaves.

→ [[des-descripcion-del-algoritmo#6.2. El calendario de rotaciones|Calendario de rotaciones]] · [[des-y-3des#Claves débiles|DES y 3-DES § Claves débiles]]

> **Verificado.** Con el calendario real de `DES` ($r = 1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1$; acumulados $1,2,4,6,\dots,27,28$) y los cuatro patrones de 28 bits que la rotación de 2 deja fijos —$0^{28}$, $1^{28}$, $(01)^{14}$, $(10)^{14}$—, las 16 combinaciones de mitades dan **4 con una sola subclave** y **12 con dos**. Esas 12 son exactamente las **6 parejas** de claves semi-débiles. Y con mitades de período 4 el conteo da **4 subclaves**, tal como anuncia la filmina.

> **Lo que la filmina NO dice.** No dice **cuántas** claves semi-débiles hay, ni cómo se emparejan, ni cuáles son las de 4 subclaves. Todo eso está contado y verificado en [[des-y-3des#Las claves semi-débiles|DES y 3-DES § Las claves semi-débiles]] — incluido el aviso de que las de **4** subclaves **no** cumplen $\mathsf{Enc}_{K_x}\big(\mathsf{Enc}_{K_y}(m)\big) = m$, así que la alternativa *"2 o 4"* de la filmina junta dos defectos de gravedad distinta bajo un mismo nombre. **Para el parcial vale el criterio de la cátedra**: 1 subclave ⟹ débil, 2 o 4 ⟹ semi-débil.

> **Por qué esta filmina importa para el vault.** Es la **única fuente de la cátedra** que nombra las claves semi-débiles: el [[guia-02-criptografia-simetrica#Ejercicio 8|enunciado del Ej. 8]] pregunta sólo por las débiles, y las filminas de teoría no las mencionan. Sin esta lámina serían un agregado externo; con ella, son material examinable.

**Dónde seguir:** la resolución completa del ejercicio —las cuatro claves débiles en hexadecimal, el rol de los bits de paridad, y las dos "otras dos" que pide el enunciado— está en [[guia-02-resolucion#Ejercicio 8|Guía 2 — Resolución, Ejercicio 8]]; el desarrollo de las semi-débiles, en [[des-y-3des#Las claves semi-débiles|DES y 3-DES]].

---

## 9. Modo CFB: cuatro láminas con bloque de 32 bits y segmento de 8

El segundo PDF ([`Modo CFB.pdf`](../../raw/practicas/Modo%20CFB.pdf)) son **cuatro diagramas** de *Cipher Feedback Mode*. Las **tres primeras** llevan los parámetros escritos arriba a la derecha —*"Ejemplo: n = 32; s=8"*—: **$n = 32$ bits de bloque, $s = 8$ bits de segmento**. **La cuarta, que es justo la del ejercicio, no los repite**: su texto completo es sólo el enunciado, así que los parámetros hay que **arrastrarlos de las láminas anteriores** — y conviene decirlo en voz alta al resolver, porque la respuesta depende de $n$. Vale la pena registrar la elección: **no es `DES`**. El registro de desplazamiento se llena con $n/s = 4$ segmentos, no con 8.

| Lámina | Título | Qué muestra |
|---|---|---|
| 1 | **Encripción** | El diagrama de cifrado con 5 etapas: $\mathsf{Enc}_k$ sobre el registro, xor con $m_1 \dots m_5$ |
| 2 | **Desencripción correcta** | *"llegan ordenados y sin errores: $c_1, c_2, c_3, c_4, c_5, c_6, c_7$"* — el caso feliz |
| 3 | **Desencripción incorrecta** | *"llegan mezclados: $c_2, c_1, c_3, c_4, c_5, c_6, c_7$"* — **bloques fuera de orden** |
| 4 | **Ejercicio** | *"Analizar: Desencripción incorrecta (llega mal $c_1$, o sea llega: $c_1^{*}, c_2, c_3, c_4, c_5, \dots$)"* — **sin los parámetros**: es la única de las cuatro que no los reimprime |

El mecanismo del modo —el registro de desplazamiento, qué entra y qué se descarta— está en [[modos-de-encadenamiento#Los cinco modos|Modos de encadenamiento § CFB]]. Acá van los dos casos de falla.

### 9.1. El ejercicio de la lámina 4: llega mal el primer segmento

**Es el [[guia-02-resolucion#Ejercicio 6|Ej. 6c de la Guía 2]] con otros parámetros**, y por eso conviene resolverlo con la fórmula y no de memoria. Un bit erróneo en el segmento cifrado tiene **dos efectos separados**:

1. Sobre el segmento propio: $m_1 = c_1 \oplus \mathrm{ks}_1$, y $\mathrm{ks}_1$ todavía es correcto porque el error **aún no entró** al registro. Entra por **xor directo** → $m_1$ sale con **exactamente 1 bit mal**.
2. Sobre los que siguen: el $c_1^{*}$ erróneo entra al registro y **sobrevive $n/s$ desplazamientos**. Mientras esté adentro, la entrada de la primitiva es incorrecta y esos $n/s$ segmentos quedan **destruidos por completo**.

$$\text{segmentos afectados} \;=\; \underbrace{1}_{\text{un bit mal}} \;+\; \underbrace{\frac{n}{s}}_{\text{destruidos}} \;=\; 1 + \frac{32}{8} \;=\; 1 + 4 \;=\; \mathbf{5}$$

**Respuesta: 5 caracteres** — $m_1$ con un solo bit dado vuelta, y $m_2, m_3, m_4, m_5$ basura. A partir de $m_6$ el registro ya se limpió y el descifrado vuelve a ser correcto: **`CFB` es autosincronizante**. *(Verificado por simulación con $n = 32$, $s = 8$: los bits mal en $m_1 \dots m_5$ dieron $1, 4, 3, 6, 5$ y de $m_6$ en adelante, cero.)*

> **El contraste con `DES` es el punto del ejercicio.** La [[guia-02-resolucion#Ejercicio 6|Guía 2]] se responde con **9** porque asume `DES` ($n = 64$); con `AES` serían **17**; con los parámetros de esta lámina son **5**. La respuesta correcta nunca es un número: es $1 + n/s$, y hay que decir con qué $n$ se trabaja. Que la cátedra use $n = 32$ en su propio material es la mejor prueba de que el número absoluto no es lo que se evalúa.

### 9.2. La lámina 3: bloques fuera de orden

Éste es un **modo de falla distinto** del error de bit, y no está cubierto en ninguna otra fuente del vault: no se corrompe ningún bit, lo que se rompe es el **orden**. Es el caso realista de una red que entrega paquetes desordenados.

Con los segmentos $c_1$ y $c_2$ intercambiados, el descifrador procesa $c_2, c_1, c_3, c_4, \dots$ y arrastra el desorden **dentro del registro**:

| Paso | Registro (los $n/s = 4$ últimos segmentos recibidos) | ¿Correcto? | Salida |
|---|---|---|---|
| 1 | $\mathrm{IV}$ | sí | $m'_1 = c_2 \oplus \mathrm{ks}_1$ — **basura** (el keystream es el bueno, el criptograma no) |
| 2 | $[\ \mathrm{IV}\ \Vert\ c_2\ ]$ | **no** | **basura** |
| 3 | $[\ \mathrm{IV}\ \Vert\ c_2,\ c_1\ ]$ | **no** | **basura** |
| 4 | $[\ \mathrm{IV}\ \Vert\ c_2,\ c_1,\ c_3\ ]$ | **no** | **basura** |
| 5 | $[\ c_2,\ c_1,\ c_3,\ c_4\ ]$ | **no** | **basura** |
| 6 | $[\ c_1,\ c_3,\ c_4,\ c_5\ ]$ | **no** — $c_1$ sigue adentro, en el lugar de $c_2$ | **basura** |
| 7 | $[\ c_3,\ c_4,\ c_5,\ c_6\ ]$ | **sí** — los dos intrusos ya salieron | $m_7$ **correcto** |

$$\text{segmentos perdidos} \;=\; \underbrace{2}_{\text{los que llegaron cambiados}} \;+\; \underbrace{\frac{n}{s}}_{\text{mientras el registro esté sucio}} \;=\; 2 + 4 \;=\; \mathbf{6}$$

**`CFB` también se autosincroniza ante reordenamiento**, y lo hace por el mismo motivo que ante un error de bit: el registro sólo recuerda los últimos $n/s$ segmentos, así que **todo daño local se limpia solo** cuando esos segmentos salen. Lo que **no** hace es *reparar* nada: los seis segmentos perdidos están perdidos. *(Verificado por simulación: con $c_1 \leftrightarrow c_2$ salen mal las posiciones 1 a 6 y la 7 en adelante son correctas. Con un intercambio a más distancia, $c_1 \leftrightarrow c_3$, el tramo desordenado abarca 3 posiciones y salen mal 7 — o sea $3 + n/s$.)*

> **Cuidado con leer $L + n/s$ como fórmula general.** Vale mientras los dos tramos de daño se toquen, o sea mientras $L \le n/s + 2$; acá, hasta $c_1 \leftrightarrow c_6$. Si los dos segmentos intercambiados están más lejos, los del medio **llegaron en su lugar y con el registro ya limpio**, se descifran bien, y el daño se parte en dos tramos que suman a lo sumo $2\,(n/s + 1) = 10$ segmentos — no crece más. La regla exacta, simulada, está en [[modos-de-encadenamiento#La regla exacta: dos tramos, no uno|Modos de encadenamiento § La regla exacta]].

### 9.3. El contraste con CBC, que es el que sorprende

$$P_i = \mathsf{Dec}_K(C_i) \oplus C_{i-1}$$

En `CBC`, cada bloque descifrado depende de **exactamente dos** bloques recibidos: el propio y el anterior. No hay registro que se llene: la "memoria" del modo es de **un solo bloque**. Con $C_1$ y $C_2$ intercambiados:

| Bloque | Ecuación con lo recibido | Resultado |
|---|---|---|
| $P'_1$ | $\mathsf{Dec}_K(C_2) \oplus \mathrm{IV}$ | **basura** |
| $P'_2$ | $\mathsf{Dec}_K(C_1) \oplus C_2$ | **basura** |
| $P'_3$ | $\mathsf{Dec}_K(C_3) \oplus C_1$ | **basura** — difiere del verdadero $P_3$ en $C_1 \oplus C_2$ |
| $P'_4$ | $\mathsf{Dec}_K(C_4) \oplus C_3$ | **correcto** |

**`CBC` pierde 3 bloques y se recupera; `CFB` con $n/s = 4$ pierde 6.** *(Verificado por simulación en los dos modos.)* Con los dos bloques intercambiados **más lejos**, `CBC` se planta en **4** y `CFB` en **10**: los topes son $2\,(M+1)$ con $M$ la memoria del modo, y están desarrollados en [[modos-de-encadenamiento#La regla exacta: dos tramos, no uno|Modos de encadenamiento § La regla exacta]].

> **La conclusión, que va contra la intuición.** Uno esperaría que el modo con realimentación más "profunda" fuera el más robusto, y es al revés: **la profundidad de la memoria es exactamente la duración del daño**. `CBC` recuerda 1 bloque y se recupera en 1 bloque de más; `CFB` recuerda $n/s$ segmentos y tarda $n/s$ de más. Cuanto más largo el registro, más caro cada incidente. La regla que unifica los dos casos de esta sección y el de la [[modos-de-encadenamiento#Propagación de errores|propagación de errores]] es una sola: **el daño dura lo que tarda la memoria del modo en vaciarse.** Por eso `OFB` y `CTR`, que no realimentan nada, no propagan nada.

> **Qué sigue sin estar resuelto.** El caso de **pérdida** o **inserción** de segmentos —distinto del reordenamiento, porque cambia la cantidad— no está en el material de la cátedra y no lo desarrollamos acá. El desarrollo de este contraste está volcado en [[modos-de-encadenamiento#Bloques que llegan fuera de orden: un modo de falla distinto|Modos de encadenamiento § Bloques fuera de orden]].

---

## 10. Los tres videos, ya mirados

La práctica cierra con tres links de YouTube, uno por tema. **No son de la cátedra ni del docente**: los tres son **Píldoras formativas de Criptored**, la serie del proyecto Thoth publicada en el canal de la **Universidad Politécnica de Madrid**, con guion del **Dr. Jorge Ramió** y licencia Creative Commons BY-NC-ND. La filmina los linkea como material externo y no los comenta. Son animaciones narradas de cuatro a siete minutos: **todo el contenido está en las filminas** y la voz acompaña.

Un detalle que los vuelve citables: los tres tienen **subtítulos manuales subidos por el canal**, no sólo los automáticos. Las citas de abajo salen de esa pista, así que son textuales — a diferencia del resto del corpus de video del vault, que es ASR y hay que [[videografia|corregir entre corchetes]].

| Tema | Píldora y título real | Duración | Link | Qué aporta sobre lo que el vault ya tiene |
|---|---|---|---|---|
| **LFSR** | **Píldora 33** — *¿Cómo se usan los registros de desplazamiento en la cifra?* (subida el 02/02/2016) | 5:32 | <https://www.youtube.com/watch?v=vfq3onw-uiM> | **Mucho.** Es la teoría del LFSR, que hoy en el vault existe sólo como **un pie de foto y una frase suelta**: polinomio de realimentación, los tres tipos, período máximo, Golomb, Berlekamp-Massey — con cuatro ejemplos numéricos resueltos |
| **RC4** | **Píldora 35** — *¿Cómo funciona el algoritmo RC4?* (subida el 18/04/2016) | 7:21 | <https://www.youtube.com/watch?v=G3HajuqYH2U> | **La mecánica entera**, `KSA` y `PRGA`, con un ejemplo que cierra de punta a punta. Lo que **no** aporta: por qué `RC4` está tachado en [[criptosistema-de-flujo\|Criptosistema de flujo]] — ni una palabra |
| **DES** | **Píldora 28** — *¿Cómo funcionan los algoritmos DES y 3DES?* (subida el 01/09/2015) | 4:43 | <https://www.youtube.com/watch?v=XwUOwqSHzyo> | **Casi nada.** Todo lo técnico ya está, y con más detalle, en [[des-y-3des\|DES y 3-DES]] y en el [[des-descripcion-del-algoritmo\|apunte]]. Se salvan el arco histórico $128 \to 56$ y dos anclas de mundo real |

**Prioridad de lectura, si el tiempo es poco:** el de LFSR entero, el de RC4 desde 01:02, y el de DES sólo si te interesa la historia.

---

### 10.1. LFSR (Píldora 33): lo que le falta al concepto de generador

Éste es el que hay que mirar. Hoy el `LFSR` aparece **dos veces en todo el vault, y las dos al pasar**: como pie de la filmina de teoría en [[generador-pseudoaleatorio#Idea|Generador pseudoaleatorio]] —*"el ejemplo de la filmina es un LFSR"*, y ahí se corta— y como una frase suelta en [[numeros-aleatorios-y-randomness|Sobre números aleatorios y randomness]], *"un LFSR pasa Diehard y se resuelve con álgebra lineal"*. Este video es la explicación extendida del primero **y la demostración del segundo**.

| Tramo | Qué hay |
|---|---|
| 00:00 – 00:18 | Cortina y placa de título. Nada |
| 00:18 – 01:09 | Qué es un registro de desplazamiento: celdas, semilla, reloj, realimentación |
| 01:09 – 01:44 | `NLFSR` contra `LFSR`, y por qué la cripto usa el segundo |
| 01:44 – 03:06 | **El polinomio de realimentación y sus tres tipos**, con ejemplos resueltos |
| 03:06 – 04:12 | **Los 15 estados del LFSR primitivo**, postulados de Golomb, m-secuencia |
| 04:12 – 05:00 | Complejidad lineal y ataque de Berlekamp-Massey |
| 05:00 – 05:14 | Contramedida: conectar varios registros o filtrar no linealmente |

#### La definición y la realimentación (00:18 – 01:09)

Define el registro como **$n$ celdas de un bit cada una**, cuyo estado inicial es la **semilla**. A cada pulso de reloj todo se corre una posición: la última celda entrega su bit —**ése es el que sale y va formando la secuencia cifrante**— y la primera queda vacía. Esa celda vacía se rellena con el resultado de una función de realimentación que se calcula **antes** del desplazamiento:

$$a(t) \;=\; g\big[\,a(t-1),\, a(t-2),\, \dots,\, a(t-n+1)\,\big] \;\oplus\; a(t-n)$$

> [!quote]- Del video — definición de registro de desplazamiento (00:18)
> *"un sistema, circuito o memoria de $n$ celdas en las que se almacena un bit (…) En su estado inicial, la secuencia de esos bits se conoce como semilla."*

Esa fórmula es más informativa de lo que parece: **la última celda queda siempre fuera de $g$ y siempre entra por el XOR**, y de ahí sale después la regla de que el término $x^{n}$ del polinomio nunca falta.

La distinción que sigue (01:09) es la que da los dos nombres: si la realimentación usa **varias puertas lógicas** (AND, OR, NOT) es un `NLFSR`; si usa **una sola XOR** es un `LFSR`. La criptografía usa los `LFSR` porque son *"más simples, más rápidos y más eficientes"*.

> **Por qué extremo sale el bit** ***(Lectura nuestra.)*** El video **nunca lo dice**, y sin eso no se puede seguir ningún ejemplo. Se deduce del diagrama —la flecha de salida está a la derecha de $S_n$, el lazo entra por la izquierda a $S_1$— y se verifica numéricamente: en el `NLFSR` de 6 celdas de 00:41, los primeros seis bits de la secuencia de clave ($011011$) son la semilla $110110$ leída al revés. Con la regla *"sale $S_4$, entra $S_1 \oplus S_4$"* los tres ejemplos de `LFSR` reproducen exactamente los períodos y las secuencias de las filminas. Es inferencia, pero está chequeada contra los cuatro ejemplos.

#### El polinomio de realimentación (01:49)

La regla de codificación, que es lo que hay que llevarse para resolver cualquier ejercicio de `LFSR`:

$$P(x) \;=\; x^{n} + \cdots + x^{k} + \cdots + 1, \qquad \text{un término } x^{k} \text{ por cada celda } S_k \text{ conectada al XOR}$$

El ejemplo de la filmina: un registro de 4 celdas con la **tercera y la cuarta** conectadas al XOR da $x^{4} + x^{3} + 1$.

> [!quote]- Del video — cómo se arma el polinomio y por qué el término de mayor grado nunca falta (01:49)
> *"Las celdas conectadas a la puerta xor se representan por un polinomio (…) Observa que la última celda siempre estará conectada al xor."*

#### Los tres tipos de polinomio, con sus ejemplos resueltos (02:13 – 03:06)

Ésta es la escala de tres peldaños que el vault no tiene en ningún lado, y es el criterio operativo para decidir si un `LFSR` sirve.

**Peldaño 1 — polinomio factorizable: inadmisible.** El período **depende de la semilla** y nunca es máximo. El ejemplo:

$$x^{4} + x^{2} + 1 \;=\; (x^{2} + x + 1)(x^{2} + x + 1) \qquad\Longrightarrow\qquad S_1^{\text{nuevo}} = S_2 \oplus S_4$$

Con semilla $1101$:

| Estado | Sale ($S_4$) | Entra ($S_2 \oplus S_4$) | Siguiente |
|---|---|---|---|
| 1101 | 1 | $1 \oplus 1 = 0$ | 0110 |
| 0110 | 0 | $1 \oplus 0 = 1$ | 1011 |
| 1011 | 1 | $0 \oplus 1 = 1$ | **1101** (cerró) |

Secuencia $101$, **período 3**. Con semilla $0111$, el mismo registro:

| Estado | Sale | Entra | Siguiente |
|---|---|---|---|
| 0111 | 1 | $1 \oplus 1 = 0$ | 0011 |
| 0011 | 1 | $0 \oplus 1 = 1$ | 1001 |
| 1001 | 1 | $0 \oplus 1 = 1$ | 1100 |
| 1100 | 0 | $1 \oplus 0 = 1$ | 1110 |
| 1110 | 0 | $1 \oplus 0 = 1$ | 1111 |
| 1111 | 1 | $1 \oplus 1 = 0$ | **0111** (cerró) |

Secuencia $111001$, **período 6**. Dos semillas, dos períodos distintos, ninguno igual a 15: por eso el video lo tacha.

**Peldaño 2 — polinomio irreducible: mejor, pero tampoco.** El período **ya no depende de la semilla**, pero sigue sin ser el máximo.

$$x^{4} + x^{3} + x^{2} + x + 1 \qquad\Longrightarrow\qquad S_1^{\text{nuevo}} = S_1 \oplus S_2 \oplus S_3 \oplus S_4$$

| Estado | Sale | Entra | Siguiente |
|---|---|---|---|
| 0001 | 1 | $0 \oplus 0 \oplus 0 \oplus 1 = 1$ | 1000 |
| 1000 | 0 | $1 \oplus 0 \oplus 0 \oplus 0 = 1$ | 1100 |
| 1100 | 0 | $1 \oplus 1 \oplus 0 \oplus 0 = 0$ | 0110 |
| 0110 | 0 | $0 \oplus 1 \oplus 1 \oplus 0 = 0$ | 0011 |
| 0011 | 1 | $0 \oplus 0 \oplus 1 \oplus 1 = 0$ | **0001** (cerró) |

Secuencia $10001$, **período 5**. Es el valor que muestra la filmina.

> **Errata del video.** En 02:36 la locución dice que, con polinomio irreducible, el período *"no será el máximo posible, sino un múltiplo de éste"*. **Está al revés: es un divisor.** Lo delata su propio ejemplo — el período es 5, y 5 divide a $2^{4}-1 = 15$. La palabra aparece igual en la pista manual y en la automática, así que no es un problema de transcripción sino del guion. Si citás esta parte, corregila.

**Peldaño 3 — polinomio primitivo: el que se usa.**

$$x^{4} + x + 1, \qquad T_{\max} = 2^{n} - 1$$

> [!quote]- Del video — qué es un polinomio primitivo y de dónde sale el menos uno (02:46 y 03:20)
> *"si el polinomio es de tipo primitivo, esto es, irreducible y que además genera todo el cuerpo"* (…) *"no está permitida la cadena de todos ceros, pues en ese caso el registro no prospera ni genera secuencia alguna."*

El $-1$ está explicado **y mostrado**: la filmina pone el registro en $0000$, que escupe ceros para siempre y nunca sale de ahí. O sea, el `LFSR` recorre los $2^{n}-1$ estados **no nulos**.

#### El ejemplo central: los 15 estados con semilla 1001 (03:11 – 04:11)

Es la animación principal del video y **el ejercicio resuelto que le falta al vault**. Registro de 4 celdas, $x^{4} + x + 1$ (conecta las celdas 4 y 1), semilla $1001$, realimentación $S_1^{\text{nuevo}} = S_1 \oplus S_4$:

| # | Estado | Sale ($S_4$) | Entra ($S_1 \oplus S_4$) | Siguiente |
|---|---|---|---|---|
| 1 | **1001** | 1 | $1 \oplus 1 = 0$ | 0100 |
| 2 | 0100 | 0 | $0 \oplus 0 = 0$ | 0010 |
| 3 | 0010 | 0 | $0 \oplus 0 = 0$ | 0001 |
| 4 | 0001 | 1 | $0 \oplus 1 = 1$ | 1000 |
| 5 | 1000 | 0 | $1 \oplus 0 = 1$ | 1100 |
| 6 | 1100 | 0 | $1 \oplus 0 = 1$ | 1110 |
| 7 | 1110 | 0 | $1 \oplus 0 = 1$ | 1111 |
| 8 | 1111 | 1 | $1 \oplus 1 = 0$ | 0111 |
| 9 | 0111 | 1 | $0 \oplus 1 = 1$ | 1011 |
| 10 | 1011 | 1 | $1 \oplus 1 = 0$ | 0101 |
| 11 | 0101 | 1 | $0 \oplus 1 = 1$ | 1010 |
| 12 | 1010 | 0 | $1 \oplus 0 = 1$ | 1101 |
| 13 | 1101 | 1 | $1 \oplus 1 = 0$ | 0110 |
| 14 | 0110 | 0 | $0 \oplus 0 = 0$ | 0011 |
| 15 | 0011 | 1 | $0 \oplus 1 = 1$ | **1001** (vuelve a la semilla) |

Concatenando la columna *Sale*, la secuencia cifrante:

$$S_i \;=\; 100100011110101 \qquad (15 \text{ bits}), \qquad T = 2^{4} - 1 = 15$$

Los 15 estados son **todos** los de 4 bits salvo $0000$. *(La tabla se verificó recalculándola entera; coincide bit por bit con la que el video deja en pantalla en 04:11.)*

#### Golomb, m-secuencia y por qué un LFSR solo no alcanza (03:35 – 05:14)

Los **tres postulados de Golomb**, literales de la filmina, presentados como *"condiciones de aleatoriedad necesarias para la secuencia de clave"*:

| | Postulado |
|---|---|
| **G1** | Probabilidad de encontrar un bit 1 o 0 en cualquier posición: 50% |
| **G2** | Probabilidad de que ese bit venga precedido de otros ya conocidos: 50% |
| **G3** | La secuencia inicial desplazada no entrega mayor información sobre ella |

Una secuencia que cumple los tres **y además** tiene período máximo se llama **m-secuencia**. Ése es el objetivo del diseño — y es exactamente el puente que justifica el nombre *pseudoaleatorio* en [[generador-pseudoaleatorio|02.04]].

Y acto seguido, la contra, que es lo mejor del video: **la complejidad lineal de una m-secuencia es muy baja.** El ataque de **Berlekamp-Massey** reconstruye toda la secuencia con **$2n$ bits consecutivos**, sin importar cuán largo sea el período:

| Registro | Período $T = 2^{n}-1$ | Bits que necesita el ataque |
|---|---|---|
| `LFSR` de 8 celdas | 255 | $2 \cdot 8 = 16$ |
| `LFSR` de 50 celdas | 1.125.899.906.842.623 | $2 \cdot 50 = 100$ |

La filmina lo remata con *"¡¡Tan sólo 2n bits!!"*. **Éste es el argumento de por qué un `LFSR` solo no sirve como cifrador de flujo**, por más celdas que tenga — y es la frase de [[numeros-aleatorios-y-randomness|Sobre números aleatorios y randomness]] (*"pasa Diehard y se resuelve con álgebra lineal"*) con el número puesto: la secuencia puede aprobar todos los tests estadísticos y aun así ser reconstruible con 100 bits.

La contramedida que propone (05:00) es conectar dos o más registros, *"normalmente mediante una puerta xor de sus salidas, o bien mediante un filtrado no lineal"* — la filmina muestra las dos variantes, con un multiplexor rotulado *Selector* en el segundo caso, y en las dos anota período 5.355.

> **De dónde sale el 5.355** ***(Lectura nuestra.)*** La filmina pone el número y no lo justifica. Es el mínimo común múltiplo de los períodos individuales de los dos registros que dibuja, $x^{6}+x^{5}+1$ y $x^{8}+x^{7}+x^{2}+x+1$:
>
> $$T = \operatorname{mcm}\big(2^{6}-1,\ 2^{8}-1\big) = \operatorname{mcm}(63,\, 255) = 5355$$
>
> El tercer registro de la segunda variante ($x^{4}+x+1$, período 15) no cambia el resultado porque 15 divide a 5355. El video no dice nada de esto.

#### Qué habilita este video en el vault

Tres cosas que hoy **no están** en [[generador-pseudoaleatorio|Generador pseudoaleatorio]], y que este video da con ejemplos resueltos:

1. **El criterio del polinomio.** La condición para que un `LFSR` sirva no es *"que tenga polinomio"*: es que sea **primitivo**. Los dos contraejemplos muestran qué se rompe en cada peldaño — con factorizable, el período depende de la semilla; con irreducible, no depende pero no es máximo.
2. **El puente con la aleatoriedad.** Los postulados de Golomb son lo que conecta *"período máximo"* con *"parece aleatorio"*, que es la palabra que da nombre al concepto.
3. **El límite.** Berlekamp-Massey con $2n$ bits es la razón por la que un generador **lineal** no alcanza para cifrar aunque su período sea astronómico. Es la bisagra hacia los generadores reales de la tabla de [[criptosistema-de-flujo|Criptosistema de flujo]], que son combinaciones de varios registros.

**Cabos sueltos del video:** define el registro en términos de *hardware* (celdas, reloj, puertas) y **no** lo formaliza como recurrencia lineal sobre $\mathrm{GF}(2)$ — sólo roza el álgebra al decir que un primitivo *"genera todo el cuerpo"*, que engancha con [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]]. Tampoco explica *por qué* un polinomio primitivo da período máximo: lo afirma.

---

### 10.2. RC4 (Píldora 35): la mecánica completa, y el silencio sobre el tachado

El video explica `RC4` de punta a punta **en su mecánica**, con un ejemplo numérico que cierra. Lo que no hace —y conviene saberlo antes de abrirlo— es explicar por qué el algoritmo está desaconsejado.

| Tramo | Qué hay |
|---|---|
| 00:00 – 00:14 | Careta del proyecto. Nada |
| 00:14 – 00:40 | **Historia**: *Ron's Code 4*, Rivest, 1987, y la filtración de 1994 |
| 00:40 – 01:02 | La idea: XOR byte a byte, y las dos rutinas |
| 01:02 – 04:20 | **`KSA`**: vectores $S$ y $T$, y tres iteraciones resueltas |
| 04:20 – 06:38 | **`PRGA`**: dos iteraciones resueltas |
| 06:38 – 07:03 | Cifrado del mensaje completo y descifrado |

#### La historia, que el vault no tiene

`RC4` es **Ron's Code 4**, diseñado por **Ronald Rivest en 1987** y mantenido en secreto hasta **1994**, cuando el código apareció en un post anónimo a la lista de correo de **Cipherpunks**. La filmina lo dramatiza sellando un monitor con un cuño *CONFIDENTIAL*. Eso es contexto que la [[criptosistema-de-flujo|tabla de generadores]] no trae.

#### KSA: cargar la clave en el generador (01:02 – 04:20)

Dos vectores de 256 bytes. El primero se inicializa con la identidad; el segundo se llena con la clave repetida:

$$S[i] = i \quad (i = 0,\dots,255), \qquad T[i] = K\big[\,i \bmod \ell\,\big], \quad \ell = \text{largo de } K$$

Con la clave típica de **128 bits = 16 caracteres ASCII**, la clave entra exactamente $256/16 = 16$ veces en $T$. El ejemplo del video usa $K = $ *"Clave de 128 bit"*, que tiene justo 16 caracteres contando los espacios.

Y después el barajado:

$$j \leftarrow 0; \qquad \text{para } i = 0 \text{ hasta } 255: \quad j \leftarrow (j + S[i] + T[i]) \bmod 256, \quad \operatorname{swap}\big(S[i],\, S[j]\big)$$

**Las tres iteraciones que resuelve el video**, con los valores ASCII $\mathtt{C}=67$, $\mathtt{l}=108$, $\mathtt{a}=97$:

| $i$ | $j$ entrante | $S[i]$ | $T[i]$ | $j$ nuevo | Intercambio |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 67 | $(0+0+67) \bmod 256 = 67$ | $S[0]=67$, $S[67]=0$ |
| 1 | 67 | 1 | 108 | $(67+1+108) \bmod 256 = 176$ | $S[1]=176$, $S[176]=1$ |
| 2 | 176 | 2 | 97 | $(176+2+97) \bmod 256 = 19$ | $S[2]=19$, $S[19]=2$ |

De ahí el video salta a las 253 iteraciones restantes y muestra el vector $S$ final barajado, que arranca $87,\,176,\,19,\,178,\,245,\dots$

#### PRGA: generar el keystream (04:20 – 06:38)

$$i \leftarrow (i+1) \bmod 256, \quad j \leftarrow (j + S[i]) \bmod 256, \quad \operatorname{swap}(S[i], S[j]), \quad t \leftarrow (S[i]+S[j]) \bmod 256, \quad \text{salida} = S[t]$$

Dos cosas para retener del enunciado:

- **El keystream tiene la longitud del mensaje**, $L(KS) = L(M)$. No es un chorro infinito que se trunca: el bucle corre mientras $k < L$. En el ejemplo, $M = $ *"Un saludo"* tiene 9 caracteres $\Rightarrow$ 9 bytes.
- **$S$ se sigue modificando en cada byte de salida.** El estado nunca deja de moverse.

**Las dos iteraciones resueltas:**

| $k$ | $i$ | $j$ | Swap | $t = (S[i]+S[j]) \bmod 256$ | Salida $S[t]$ |
|---|---|---|---|---|---|
| 0 | 1 | $(0+176) = 176$ | $S[1] \leftrightarrow S[176]$: quedan 211 y 176 | $(211+176) \bmod 256 = 131$ | $S[131] = \mathbf{188}$ |
| 1 | 2 | $(176+19) = 195$ | $S[2] \leftrightarrow S[195]$: quedan 82 y 19 | $(82+19) = 101$ | $S[101] = \mathbf{21}$ |

#### El cifrado completo (06:38 – 07:03)

Keystream de 9 bytes y mensaje en decimal ASCII, con XOR byte a byte:

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| **Keystream** | 188 | 21 | 18 | 0 | 213 | 10 | 161 | 245 | 206 |
| **Mensaje** (*"Un saludo"*, en ASCII) | 85 | 110 | 32 | 115 | 97 | 108 | 117 | 100 | 111 |
| **Criptograma** | 233 | 123 | 50 | 115 | 180 | 102 | 212 | 145 | 161 |

Y el cierre: como el XOR es **involutivo**, descifrar es la misma operación entre keystream y criptograma. No hay rutina de descifrado separada.

$$C_i = M_i \oplus KS_i \qquad\Longrightarrow\qquad C_i \oplus KS_i = M_i$$

*(Los tres bloques numéricos —las tres vueltas del `KSA`, las dos del `PRGA` y el criptograma entero— se verificaron reimplementando el algoritmo con esa clave y ese mensaje. Dan exacto.)*

#### Lo que este video NO contesta, y hay que decirlo

**`RC4` aparece tachado en la [[criptosistema-de-flujo|tabla de generadores]] de la Clase 02, y este video no explica por qué.** No es que lo explique mal o de pasada: **no lo menciona en absoluto**. Se buscaron en las dos pistas de subtítulos —la manual y la automática— y en la descripción de YouTube los términos *WEP*, *roto*, *vulnerabilidad*, *ataque*, *sesgo*, *inseguro*, *débil*, *desaconsejado*, *seguridad*, *SSL* y *TLS*: **cero coincidencias**. La píldora es de 2016, o sea posterior a los ataques de sesgo de 2013-2015 y a la RFC que prohíbe `RC4` en TLS, y aun así lo presenta en neutro. **Para el tachado hay que traer la justificación de otro lado; este video no sirve como fuente de eso.**

Peor: `RC4` **no toma IV** en su firma, y es justamente ahí donde se rompe en la práctica (`WEP`). El video construye el keystream a partir de la clave sola y pasa por al lado del tema sin nombrarlo. Contrastar con la observación de [[criptosistema-de-flujo|02.03]] de que los generadores recomendados —Salsa20, Rabbit— sí tienen el $\{0,1\}^{64}$ del IV en la firma.

> **Lo que sí conviene anotar en el concepto de flujo** ***(Lectura nuestra.)*** `RC4` **no encaja en el molde de los otros generadores de esa tabla**, y el video lo deja ver sin decirlo. Los generadores de registros producen **bits** a partir de `LFSR` realimentados con polinomios primitivos; `RC4` no tiene registros ni polinomios: mantiene una **permutación de 256 bytes** que se sigue barajando en cada salida, y produce **bytes**. Puestos uno al lado del otro, los videos 10.1 y 10.2 muestran dos familias distintas de generador bajo el mismo rótulo *stream cipher*.

> **Tres erratas en las filminas del propio video** *(leídas con recortes ampliados, no con extracción de texto).*
> 1. La filmina resumen (00:44 – 01:02) escribe la línea del `KSA` como $j = (j + S[i] + T[j]) \bmod 256$. Es $T[j]$ y debería ser $T[i]$ — el propio video se contradice después, porque el panel de cálculo usa $T[0]$, $T[1]$ y $T[2]$ para $i = 0, 1, 2$.
> 2. La filmina de la tablet (desde 02:30) llama $K[i]$ al vector que durante toda la sección rotula **Vector T**. El índice está bien; el nombre cambia de golpe.
> 3. En la animación de intro (00:52) el símbolo XOR lleva pegada la etiqueta *MOD 256*, que es engañosa: la operación es XOR, o sea **suma módulo 2 bit a bit**. Se verifica con sus propios números — $67 \oplus 45 = 110$, que es lo que muestra; la suma módulo 256 daría 112. La narración de cierre sí lo dice bien.

---

### 10.3. DES (Píldora 28): el que menos aporta

**Casi todo lo técnico de este video ya está en el vault, y con más profundidad.** Vale la pena mirarlo por el arco histórico y por dos anclas de mundo real; no por la mecánica.

| Lo que muestra el video | Dónde ya está, mejor |
|---|---|
| Bloque de 64, clave de 64 con 56 efectivos por el bit de paridad de cada byte (01:14) | [[des-y-3des#Qué fue DES\|DES y 3-DES § Qué fue DES]], que además explica **de dónde viene** ese bit (compatibilidad de codificación en IBM) |
| Estructura de Feistel: dos mitades de 32, una se mezcla, se intercambian (01:31) | [[des-y-3des#Estructura: red de Feistel\|§ Estructura: red de Feistel]] — con las ecuaciones y con el argumento de por qué $F$ no necesita ser invertible, que el video **no** da |
| Función de vuelta: Expansión $\to$ XOR $\to$ cajas S $\to$ Permutación (01:43) | [[#7. DES: la caja de Feistel y la función de transformación\|§7 de esta misma práctica]] y [[des-descripcion-del-algoritmo\|§ 5 del apunte]] |
| Tabla de desplazamientos por vuelta y el total de 28 (02:08) | [[des-descripcion-del-algoritmo#6.2. El calendario de rotaciones\|Apunte § 6.2]], que además **suma la columna** y saca el corolario $C_{16} = C_0$ |
| Al descifrar se desplaza a derecha y se va de la vuelta 16 a la 1 (02:12) | [[des-descripcion-del-algoritmo#8. Descifrado\|Apunte § 8]] |
| Regla de la caja S: extremos = fila, interiores = columna (03:05) | [[des-descripcion-del-algoritmo\|Apunte § 5.3]], que trae **las ocho tablas** y su propio ejemplo resuelto sobre $S_3$ |
| 3DES en formato `EDE`, y por qué triple y no doble (03:49) | [[des-y-3des#3-DES\|§ 3-DES]], que además **explica** el *meet-in-the-middle* en vez de sólo nombrarlo |

#### El arco histórico, que sí es un aporte (00:19 – 01:05)

Los 56 bits **no son una elección técnica**: son el resultado de un recorte político, y el video lo cuenta en tres escenas.

> [!quote]- Del video — 1974, la NBS elige a IBM (00:22)
> *"En el año 1974, la NBS actualmente NIST, elige el algoritmo propuesto por IBM como estándar para la cifra simétrica en comunicaciones comerciales."*

> [!quote]- Del video — 1975, la NSA recorta la clave (00:43)
> *"la NSA aplica severas restricciones a dicho algoritmo, haciendo que la clave de 128 bits del original Lucifer se reduzca hasta los 56 bits, con la consiguiente crítica de los expertos."*

Y el cierre del arco: *"el tiempo les da la razón al sucumbir el DES a finales de los noventa ante un ataque por fuerza bruta en red"* — que es la fila **1998 / Deep Crack** de [[des-y-3des#Evolución: cómo se erosionó|la tabla de erosión]]. El recorrido $128 \to 56 \to$ caída es un buen gancho narrativo y el vault no lo tenía contado así.

*(Detalle menor: la filmina muestra un calendario de enero de **1997** mientras la voz dice genéricamente *"finales de los noventa"*. Son dos afirmaciones distintas y sólo la segunda es la que se escucha.)*

#### El ejemplo resuelto de la caja S2 (03:09 – 03:26)

Es el único ejemplo numérico del video, y lo resuelve entero. La caja $S_2$ toma los bits 7 a 12 de la cadena de 48 y devuelve los bits 5 a 8 de la salida de 32.

$$\text{Entrada} = 101100$$

| Paso | Cuenta |
|---|---|
| Bits extremos $\to$ fila | $(b_1 b_6) = (1\,0)_2 = 2$ |
| Bits interiores $\to$ columna | $(b_2b_3b_4b_5) = (0110)_2 = 6$ |
| Celda | $S_2(2,\,6) = 13$ |
| A 4 bits | $13_{10} = 1101_2$ |

$$\text{Salida} = 1101$$

**Verificado contra la tabla $S_2$ del vault**: la [[des-descripcion-del-algoritmo|fila 2, columna 6 del apunte]] da 13, y la columna 6 completa del video (3, 8, 13, 4 de la fila 0 a la 3) coincide con la tabla canónica. Sirve como segundo control de que estás leyendo bien las cajas, junto al de $S_3$ que ya trae el apunte.

#### Dos afirmaciones del video para tomar con pinzas

**1. El "$2^{256}$ de las cajas S".** El video sale al cruce del mito de la puerta trasera con un número: *"romper el algoritmo a partir de las cajas S supone realizar 2 elevado a 256 intentos, en tanto que aplicando fuerza bruta directamente al criptograma dicho trabajo significa sólo 2 elevado a 56 intentos"*. La filmina apoya el número con tres factores en pantalla: **4 salidas, 8 cajas, 16 vueltas**.

> **La cuenta que conecta los tres factores no está en el video** ***(Lectura nuestra.)*** Sale de $4^{8 \cdot 16} = 4^{128} = 2^{256}$. Es una **estimación didáctica**, no un resultado de criptoanálisis publicado: conviene usarla para el argumento retórico —*"atacar por las cajas es más caro que la fuerza bruta"*— y **no** citarla como si fuera una cota canónica. Los ataques que sí funcionan contra las cajas $S$ son el [[des-y-3des#Evolución: cómo se erosionó|criptoanálisis diferencial y el lineal]], que el video no menciona.

**2. Los "168 bits" de 3DES.** El video dice que 3DES tiene *"una fortaleza de 168 bits si las tres claves son diferentes, o bien de 112 bits si usamos sólo dos claves diferentes"*. **Eso contradice lo que enseña la cátedra**, y en un parcial vale lo de la cátedra: [[des-y-3des#3-DES|DES y 3-DES § 3-DES]] dice que con tres claves independientes la seguridad es **del orden de 112 bits, no de 168**, precisamente por *meet-in-the-middle*. Lo que el video llama *"fortaleza"* es el **largo de la clave** ($3 \times 56 = 168$), no el nivel de seguridad. Es la misma confusión que la nota de concepto advierte con la fórmula *"más bits de clave no se traducen uno a uno en más seguridad"*.

Lo que el video sí da bien de 3DES: las **tres variantes** (tres claves, dos claves, tres iguales), y que con las tres iguales el sistema **queda compatible con `DES` simple** — que es la razón de ser del formato `EDE` y coincide con la lectura del vault.

#### Las dos anclas de mundo real, y su fecha de vencimiento

- Una captura de navegador real sobre un checkout en https, mostrando *"Conexión cifrada: el nivel de cifrado es alto (3DES-EDE-CBC 168 bit)"* (04:11).
- 3DES de tres claves, junto con `AES`, entre los algoritmos propuestos en el **Esquema Nacional de Seguridad de España** (04:17). **Contexto peninsular**, no criterio aplicable acá.

> **El video está desactualizado en este punto.** Es de febrero de 2015 y afirma que 3DES *"aún se usa en comunicaciones seguras SSL/TLS"*. Ya no: Sweet32 es de 2016 y 3DES quedó deprecado en TLS. El vault ya lo registra —el docente lo declara roto y no lo recomienda para proyectos nuevos, ver [[des-y-3des#Estado actual|DES y 3-DES § Estado actual]]—. Si citás esa parte, fechala.

**Lo que el video no tiene, para no sobrevenderlo:** no muestra las tablas IP, $\mathrm{IP}^{-1}$, $E$, $P$, PC-1 ni PC-2; da una sola caja $S$ de las ocho; no menciona claves débiles ni semi-débiles (o sea, **no cubre la [[#8. Claves débiles y semi-débiles: el aporte más fuerte|§8]]**, que es el aporte más examinable de esta práctica); no explica el mecanismo del *meet-in-the-middle*, sólo lo nombra; y no habla de modos de operación.

*(Errata a no propagar: la filmina escribe "Matias Meyer" y el subtítulo "Matías y Meyer". Son **dos personas**, Matyas y Meyer, de IBM.)*

---

Son **videos distintos** de los cuatro de la [[practica-02-videos|Práctica 02]] (que son cuatro partes de una misma clase, sin tema declarado) y de los dos videos de teoría de números que el docente encargó al cerrar la Clase 02.

---

## 11. Dónde está el apunte de DES, confirmado

La última línea de la práctica resuelve una pregunta que el vault tenía abierta:

> **Apunte e implementación DES: En `Material Didáctico/Extra/`** *(y también hay una Implementación AES)*

Eso **confirma la procedencia** de tres archivos de `raw/apuntes/` que hasta ahora estaban ahí sin saberse de dónde venían: [`des.pdf`](../../raw/apuntes/des.pdf), [`Implementación DES en JAVA.txt`](../../raw/apuntes/Implementaci%C3%B3n%20DES%20en%20JAVA.txt) e [`Implementación AES en JAVA.txt`](../../raw/apuntes/Implementaci%C3%B3n%20AES%20en%20JAVA.txt). **Son material de cátedra publicado en el campus**, en la carpeta `Material Didáctico/Extra/`, no archivos sueltos que alguien juntó.

Qué cambia y qué no:

- **Cambia el estatus del recurso.** Están puestos por la cátedra y son parte del material del curso, aunque sean "Extra" y no lectura obligatoria. La [[implementaciones-de-referencia#2. Los dos son de la misma cuenta (inferencia nuestra)|inferencia de que las dos implementaciones en Java eran material de cátedra]] —que estaba rotulada como tal por falta de fuente— **queda confirmada por esta filmina**.
- **No cambia la autoría.** [`des.pdf`](../../raw/apuntes/des.pdf) sigue siendo un texto de **Jorge Sánchez Arriazu (1999)**, externo a la cátedra: lo que ahora sabemos es que **la cátedra lo eligió y lo publicó**, no que lo escribió. → [[des-descripcion-del-algoritmo|Descripción del algoritmo DES]]
- **Sigue sin haber fecha de clase.** La filmina dice **dónde** está el material, no a qué clase pertenece. Se queda en la tabla de [[cronograma#Material sin fecha de clase|material sin fecha]].

---

## Ver también

- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] — la otra práctica-mapa: taxonomía de cifrados clásicos y de ataques
- [[practica-02-videos|Práctica 02 — Videos]] — los cuatro videos de la práctica anterior; la existencia de esta práctica 3 es lo que acota su fecha
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] — la teoría que esta práctica ordena, de punta a punta
- [[guia-02-criptografia-simetrica|Guía 2 — Criptografía Simétrica]] · [[guia-02-resolucion|Guía 2 — Resolución]] — el Ej. 6c (propagación en `CFB`) y el Ej. 8 (claves débiles) salen directo de acá
- [[secreto-perfecto|Secreto perfecto]] · [[seguridad-computacional|Seguridad computacional]] — las dos primeras estaciones del eje
- [[one-time-pad|One Time Pad]] — el esquema que la filmina "redefine" con $G$
- [[generador-pseudoaleatorio|Generador pseudoaleatorio]] · [[criptosistema-de-flujo|Criptosistema de flujo]] — la rama $G$ = *stream cipher*
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] — la rama $F_k$ = *block cipher*
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — `Eav`, `Mul` y `CPA`, y el experimento de la sección 6
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — los modos sincrónico y asincrónico
- [[modos-de-encadenamiento|Modos de encadenamiento]] — los cinco modos, la propagación de errores y el caso de bloques fuera de orden
- [[des-y-3des|DES y 3-DES]] — Feistel, key schedule y claves débiles
- [[des-descripcion-del-algoritmo|Descripción del algoritmo DES]] · [[implementaciones-de-referencia|Implementaciones de referencia en Java]] — el material de `Material Didáctico/Extra/`
- [[cronograma|Cronograma]] · [[indice|Índice del vault]]
