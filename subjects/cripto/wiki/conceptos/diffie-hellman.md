---
title: Diffie-Hellman
resumen: 'Primer protocolo de intercambio de claves (1976): ambas partes derivan el secreto $g^{xy}$ sin transmitirlo nunca. Su seguridad se apoya en el logaritmo discreto y la conjetura DDH, y solo resiste adversarios pasivos.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[intercambio-de-claves]]", "[[grupos-anillos-y-cuerpos]]", "[[ataques-activos-y-man-in-the-middle]]"]
aliases: [Diffie-Hellman, DH, Intercambio Diffie-Hellman, Problema del logaritmo discreto, Conjetura de decisión Diffie-Hellman, DDH]
type: concepto
unidad: 1
clase: 4
orden: 4
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, diffie-hellman, logaritmo-discreto, ddh, intercambio-de-claves, man-in-the-middle, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# Diffie-Hellman

**El primer protocolo de intercambio de claves de la historia (1976) y la razón exacta por la que resulta seguro contra un adversario pasivo, pero no contra uno activo.** Es la instancia concreta que satisface la definición abstracta de [[intercambio-de-claves|Intercambio de claves]] — y es, según los parciales viejos que el vault tiene resueltos, el ejercicio de examen completo más probable de toda esta unidad.

Sale de las filminas **18 a 20** de la Clase 04. Esta clase todavía no se dictó —hoy es 04/09/2026, la clase es el 10/09—, así que la nota está escrita contra el PDF de filminas, más Katz & Lindell y lecturas propias rotuladas; no hay transcripción y por lo tanto ningún callout *De la transcripción*.

## El protocolo, paso a paso

$$\begin{aligned}
&\text{1. } A \text{ define } (G, q, g),\ G \text{ grupo}, q \text{ su tamaño}, g \text{ un generador}\\
&\text{2. } A \text{ elige } x \leftarrow \mathbb{Z}_q,\ \text{calcula } h_1 = g^{x}\\
&\text{3. } A \to B:\ (G, q, g, h_1)\\
&\text{4. } B \text{ elige } y \leftarrow \mathbb{Z}_q,\ \text{calcula } h_2 = g^{y}\\
&\text{5. } B \to A:\ (h_2)\\
&\text{6. } A \text{ calcula } k_a = h_2^{\,x} = (g^{y})^{x} = g^{xy}\\
&\text{7. } B \text{ calcula } k_b = h_1^{\,y} = (g^{x})^{y} = g^{xy}
\end{aligned}$$

Si $A$ y $B$ ya se conocen de antemano, los parámetros del grupo $(G, q, g)$ pueden estar predefinidos y compartidos de antemano, y el protocolo se reduce a los pasos 2-7 — no hace falta retransmitirlos en cada ejecución.

**Por qué cierra la condición fundamental $k_a = k_b$.** La exponenciación en un grupo es conmutativa en el exponente: $(g^{y})^{x} = g^{xy} = g^{yx} = (g^{x})^{y}$. $A$ nunca ve $y$ y $B$ nunca ve $x$ — cada uno aplica su propio exponente secreto sobre el valor público que recibió del otro— y sin embargo ambos llegan al mismo valor $g^{xy}$, que se convierte en la clave compartida.

**Qué es público y qué es secreto.** $(G, q, g, h_1, h_2)$ viajan en claro por el canal; forman la $\mathrm{Trans}$ del experimento `KE` de la nota anterior. $x$ e $y$ nunca se transmiten —cada parte los genera y los guarda localmente—, y $g^{xy}$ tampoco se transmite nunca: se **calcula** de forma independiente en cada extremo.

## Seguridad, en dos capas

### Capa 1 — el problema del logaritmo discreto (necesaria, no suficiente)

La primera condición: dado $g^{x}$ (y el grupo $G$, $q$, $g$ públicos), no debería ser posible recuperar $x$. Este es el **problema del logaritmo discreto**, y no se conoce ningún algoritmo eficiente que lo resuelva.

> **Precisión sobre "NP-Hard", ya señalada en la [[clase-04-criptografia-asimetrica-y-firma-digital#5. Diffie-Hellman|Clase 04]].** La filmina 19 cierra afirmando *"hoy se sabe que es un problema NP-Hard"*. Eso es impreciso en el sentido técnico de la teoría de la complejidad: el logaritmo discreto está en $\mathrm{NP} \cap \mathrm{coNP}$ —una respuesta se verifica en tiempo polinomial en ambos sentidos—, y si además fuera `NP`-difícil implicaría $\mathrm{NP} = \mathrm{coNP}$, un colapso tan improbable como $\mathrm{P}=\mathrm{NP}$. Lo correcto es decir que **no se conoce un algoritmo eficiente (polinomial) para resolverlo**: es una suposición de dureza computacional, no un resultado de completitud `NP`.

**Por qué esta condición sola no alcanza.** Que no se pueda recuperar $x$ ni $y$ a partir de $g^x$ y $g^y$ no dice nada sobre si $g^{xy}$ —la clave que sale del protocolo— *parece* aleatorio a un adversario que ve $g^x$ y $g^y$. Podría existir, en principio, un algoritmo que calcule alguna propiedad parcial de $g^{xy}$ (por ejemplo, su bit menos significativo) sin resolver el logaritmo discreto completo. Ese hueco es exactamente lo que exige una hipótesis más fuerte.

### Capa 2 — la conjetura de decisión Diffie-Hellman (DDH)

$$\textbf{DDH: } \quad \text{dados } g,\ g^{x},\ g^{y},\ \text{un adversario no puede distinguir } g^{xy} \text{ de un elemento aleatorio de } G$$

Es una conjetura **estrictamente más fuerte** que la dureza del logaritmo discreto: pide indistinguibilidad computacional, no sólo la imposibilidad de recuperar el exponente. `DDH` es exactamente la hipótesis que hace falta para que Diffie-Hellman sea seguro en el sentido del experimento `KE` de la nota anterior — si un adversario pudiera distinguir $g^{xy}$ de aleatorio, rompería `KE` con solo comparar $k'$ contra ese distinguidor.

**Un dato curioso de cronología, marcado por la propia filmina:** la formulación de `DDH` como conjetura es **posterior en varios años** a la publicación del protocolo (1976). Diffie y Hellman publicaron el algoritmo antes de que existiera el lenguaje formal necesario para decir con precisión qué hacía falta suponer para que fuera seguro — el protocolo llegó primero, la teoría que lo justifica después.

### La cita que abre el bloque

*"We stand today on the brink of a revolution in cryptography"* — Diffie y Hellman, 1976. La cita, y el candado como metáfora —fácil de cerrar, imposible de abrir sin la llave correcta— es la que motiva toda la sección de [[clase-04-criptografia-asimetrica-y-firma-digital#2. La revolución asimétrica|Criptografía asimétrica]] en la nota de clase.

## En la práctica: el problema del atacante activo

La versión original de Diffie-Hellman **exige un canal autenticado**. Un atacante activo que intercepta y modifica los mensajes 3 y 5 del protocolo —los que llevan $h_1$ y $h_2$— rompe la seguridad completamente, sin necesidad de resolver el logaritmo discreto ni `DDH`.

**El ataque, desarrollado (lectura nuestra, siguiendo la mención de la filmina 20).** Un atacante $M$ (*man-in-the-middle*) se interpone entre $A$ y $B$ desde el primer mensaje:

1. $A$ envía $(G,q,g,h_1)$ hacia $B$; $M$ lo intercepta y en su lugar envía a $B$ su propio $(G,q,g,h_1^{M})$, con $h_1^{M} = g^{x_M}$ y $x_M$ elegido por $M$.
2. $B$ responde con $h_2$ hacia $A$; $M$ lo intercepta y en su lugar envía a $A$ su propio $h_2^{M} = g^{y_M}$.
3. $A$ calcula $k_a = (h_2^{M})^{x} = g^{x \cdot y_M}$, creyendo que es la clave compartida con $B$. En realidad es una clave compartida **con $M$**, porque $M$ conoce $y_M$ y puede calcular $g^{x\cdot y_M} = h_1^{y_M}$.
4. Simétricamente, $B$ calcula $k_b = (h_1^{M})^{y} = g^{x_M \cdot y}$, que $M$ también puede reconstruir porque conoce $x_M$.

$M$ termina con **dos** claves de sesión válidas: una compartida con $A$ y otra con $B$, y $A$ y $B$ nunca comparten ninguna clave entre sí. Todo el tráfico posterior cifrado con $k_a$ o $k_b$ pasa por $M$, que descifra con la clave que le corresponde, lee o modifica el contenido, y vuelve a cifrar con la otra clave antes de reenviarlo — ninguna de las dos víctimas nota nada, porque cada una recibe exactamente el tipo de mensaje que esperaba de la otra.

**La defensa: firmas digitales.** El protocolo se complementa autenticando **quién** envió cada $h_1$ y $h_2$, de modo que sustituirlos deje evidencia verificable. Esa es precisamente la motivación con la que la [[clase-04-criptografia-asimetrica-y-firma-digital#11. Firma digital: la terna y Sig-forge|Clase 04]] introduce la [[firma-digital|Firma digital]] más adelante, y es también el ataque concreto que motiva [[ataques-activos-y-man-in-the-middle|Ataques activos y man-in-the-middle]] en la Clase 05.

## Ver también

- [[clase-04-criptografia-asimetrica-y-firma-digital#5. Diffie-Hellman|Clase 04 — Criptografía asimétrica y firma digital § 5. Diffie-Hellman]] — la sección de la que sale esta nota
- [[intercambio-de-claves|Intercambio de claves]] — la definición abstracta y el experimento `KE` que este protocolo instancia
- [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]] — generador, orden y $\mathbb{Z}_q$, el álgebra sobre la que corre el protocolo
- [[criptosistema-asimetrico|Criptosistema asimétrico]] — el siguiente bloque de la clase, que usa la misma familia de supuestos de dureza
- [[el-gamal|El Gamal]] — el criptosistema que se construye directamente sobre este intercambio de claves
- [[firma-digital|Firma digital]] — la herramienta que arregla el problema del atacante activo
- [[ataques-activos-y-man-in-the-middle|Ataques activos y man-in-the-middle]] — el desarrollo completo del ataque activo contra un intercambio de claves sin autenticar
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — la familia de experimentos de la que `DDH` toma la forma
- Katz & Lindell, cap. 11 *Public-Key Encryption* — el problema del logaritmo discreto y `DDH` formalizados ([[bibliografia|bibliografía]])
