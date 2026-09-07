---
title: Grupos, anillos y cuerpos
resumen: 'Vocabulario algebraico con el que la Clase 04 escribe sus esquemas sin volver a definirlo: grupo, subgrupo, anillo, cuerpo, generador, orden, elemento primitivo y el grupo multiplicativo $\mathbb{Z}_p^{*}$.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[cuerpos-finitos-y-campos-de-galois]]", "[[teoria-de-numeros]]", "[[cuerpos-finitos]]"]
aliases: [Grupos anillos y cuerpos, Grupo algebraico, Anillo algebraico, Subgrupo, Elemento generador de un grupo, Grupo multiplicativo Zp*]
type: concepto
unidad: 1
clase: 4
orden: 2
created: 2026-09-04
updated: 2026-09-06
tags: [criptografia, algebra, grupos, anillos, cuerpos, aritmetica-modular, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# Grupos, anillos y cuerpos

**El vocabulario algebraico exacto —subgrupo, generador, orden, elemento primitivo, $\mathbb{Z}_p^{*}$— con el que el resto de la Clase 04 escribe Diffie-Hellman, RSA y El Gamal.** Esta nota no vuelve a demostrar lo que ya está probado en las notas de la Clase 2: dice específicamente qué agrega el repaso de filminas por encima de ellas y linkea el resto.

Sale de las filminas **9 a 15** de la Clase 04. Esta clase todavía no se dictó —hoy es 04/09/2026, la clase es el 10/09—, así que la nota está escrita contra el PDF de filminas, más Katz & Lindell y lecturas propias rotuladas; no hay transcripción y por lo tanto ningún callout *De la transcripción*.

## Por qué esta nota no repite la Clase 2

El bloque de filminas 9-15 es, literalmente, un repaso: las definiciones de grupo, grupo abeliano, anillo y cuerpo, la aritmética modular, el teorema de Euler-Fermat y la multiplicatividad de $\varphi$ **ya están** desarrolladas con demostración completa, ejemplos numéricos y tablas en:

- [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]]
- [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]]
- [[inverso-modular|Inverso modular]]
- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]]

Esta nota va derecho a lo que ese material **no** tenía: la nomenclatura exacta —subgrupo, generador, orden, elemento primitivo— con la notación puntual que usa esta clase, porque es la que reaparece sin aviso en [[diffie-hellman|Diffie-Hellman]], [[rsa|RSA]], [[el-gamal|El Gamal]] y [[digital-signature-standard|DSS]].

## Grupo algebraico y subgrupo

Un **grupo algebraico** $(G, +)$ es un conjunto con una operación que cumple clausura, asociatividad, neutro e inverso — la definición estándar, ya cubierta en [[aritmetica-modular-y-divisibilidad|02.13]]. Un **grupo abeliano** agrega conmutatividad.

Lo que la filmina 10 nombra explícitamente y las notas de la Clase 2 no llegaban a nombrar por separado es el **subgrupo**: $(G', +)$ es subgrupo de $(G, +)$ si

$$(G, +) \text{ es grupo}, \quad (G', +) \text{ es grupo}, \quad G' \subseteq G, \quad G' \neq \varnothing$$

Es decir, un subconjunto no vacío de $G$ que **por sí mismo**, con la misma operación restringida, vuelve a satisfacer los cuatro axiomas de grupo. El caso que va a aparecer en [[digital-signature-standard|`DSS`]] es exactamente éste: el generador $g$ de `DSS` genera un subgrupo de orden $q$ **dentro** de $\mathbb{Z}_p^{*}$, que tiene orden $p-1$ — un subgrupo propio, no todo el grupo.

## Grupo cíclico, generador, orden, primitivo

La filmina 11 fija una terna de definiciones que la Clase 2 no necesitaba nombrar con este nivel de precisión porque trabajaba sobre todo con $\mathbb{Z}_n$ directamente. Acá hacen falta porque Diffie-Hellman y El Gamal se escriben sobre un grupo cíclico **genérico** $G$, no siempre $\mathbb{Z}_n$.

$$G = \bigl(\{\, g^{n} \mid n \in \mathbb{Z}\,\},\ +\bigr), \qquad g^{n} = \underbrace{g + g + \cdots + g}_{n \text{ veces}}$$

La notación exponencial es multiplicativa por convención —"$g^n$" para $n$ aplicaciones sucesivas de $+$—, así que en un grupo escrito aditivamente sería $n \cdot g$; la clase usa la notación exponencial porque los grupos de interés (`DH`, `RSA`, El Gamal) son multiplicativos módulo un número.

- **Todos los grupos de tamaño $n$ son isomorfos** entre sí, y el **grupo canónico** de referencia es $\mathbb{Z}_n = (\{0, 1, \ldots, n-1\}, +)$.
- **Generador:** un elemento $g$ tal que $\gcd(g, n) = 1$. Hay exactamente $\varphi(n)$ generadores de un grupo de tamaño $n$ — la función $\varphi$ de Euler, ya desarrollada en [[cuerpos-finitos-y-campos-de-galois#Función phi de Euler|02.16]].
- **Orden de un elemento**, $\operatorname{ord}(g)$: el tamaño del subgrupo cíclico que $g$ genera, es decir, el menor $n$ tal que $g^{n}$ vuelve al neutro.
- **Elemento primitivo:** $g$ es primitivo si $\operatorname{ord}(g) = n$ — o sea, si genera **todo** el grupo, no sólo un subgrupo propio.

Esta terna —generador, orden, primitivo— es la que decide, más adelante, qué tan grande es el espacio de exponentes válidos en `DH` (dónde vive $x$ e $y$) y por qué `DSS` necesita un generador de orden **exactamente** $q$ y no de orden $p-1$.

## Anillo y cuerpo, en la forma condensada de esta clase

La filmina 12 da la misma jerarquía de [[cuerpos-finitos-y-campos-de-galois|02.16]] pero con otro orden de presentación, útil para memorizar la cadena de implicaciones:

$$\text{grupo abeliano } (G,+) \;\subset\; \text{anillo } (G,+,*) \;\subset\; \text{cuerpo } (G,+,*)$$

**Anillo:** $(G, +, *)$ tal que $(G,+)$ es grupo abeliano y $*$ es clausurada, asociativa y distributiva sobre $+$. **Cuerpo (o campo):** un anillo donde además $*$ es conmutativa, tiene neutro, y **todo elemento salvo el neutro de $+$** tiene inverso multiplicativo.

La condición *"salvo el neutro de $+$"* es la que separa un anillo cualquiera de un cuerpo: el cero nunca tiene inverso multiplicativo en ninguna estructura razonable ($0 \cdot x = 0 \neq 1$ para todo $x$), así que un cuerpo pide inverso para **todos los demás** elementos.

## El campo canónico Z_p*

La filmina 13 fija la notación de tamaño que el resto de la clase da por sabida:

$$\mathbb{Z}_p^{*} = \Bigl(\bigl\{\, k \mid k \in \{\mathbb{Z}_p - 0\} \wedge \gcd(k,p)=1 \,\bigr\},\ +,\ *\Bigr), \qquad p \text{ primo}, \qquad \lvert \mathbb{Z}_p^{*}\rvert = p - 1$$

Es el mismo objeto que [[cuerpos-finitos-y-campos-de-galois#El detalle que decide todo: el 0 queda afuera del segundo grupo|02.16]] llama *"el $0$ queda afuera del segundo grupo"*: $\mathbb{Z}_p$ con la suma es un grupo de tamaño $p$, pero $\mathbb{Z}_p$ con el producto **no** —porque $0$ no tiene inverso—, así que el grupo multiplicativo se define excluyéndolo, y su tamaño es $p-1$, no $p$. Esta es exactamente la notación $\mathbb{Z}_p^{*}$ que Diffie-Hellman y El Gamal usan para el grupo sobre el que corre toda la aritmética: **el generador $g$, las claves $h_1, h_2$ o $h$, todo vive en $\mathbb{Z}_p^{*}$**, nunca en $\mathbb{Z}_p$ completo.

También vale la generalización de la filmina 13 —todo campo finito tiene tamaño $p^{n}$ con $p$ primo y $n$ entero, y todos los campos del mismo tamaño son isomorfos— que es la misma que desarrolla [[cuerpos-finitos-y-campos-de-galois|02.16]] con $\mathrm{GF}(2^{m})$ como caso de interés para AES; esta clase no vuelve a ese caso particular.

## Las tres identidades de aritmética modular

La filmina 14-15 cita, sin volver a demostrar, tres identidades que ya están probadas en el vault y que son las que hacen funcionar RSA y Diffie-Hellman:

$$a \equiv b \pmod n \iff a - b = k\cdot n \ \text{ para algún } k \in \mathbb{Z}$$

$$\gcd(k,n) = 1 \;\Longrightarrow\; \exists\, k^{-1} \mid k\cdot k^{-1} \equiv 1 \pmod n \qquad \text{(→ [[inverso-modular|Inverso modular]])}$$

$$a^{\varphi(n)} \equiv 1 \pmod n \qquad \text{(y si $p$ es primo: } a^{p-1} \equiv 1 \pmod p \text{)} \qquad \text{(→ Euler-Fermat, [[cuerpos-finitos-y-campos-de-galois#Función phi de Euler|02.16]])}$$

$$\varphi(n\cdot m) = \varphi(n)\cdot\varphi(m) \text{ si } \gcd(n,m)=1, \qquad \varphi(p^{a}) = p^{a} - p^{a-1} = p^{a-1}(p-1) \text{ si $p$ es primo}$$

> **Errata de la filmina (15).** La fórmula de $\varphi(p^{a})$ mezcla dos nombres para el mismo exponente ($a$ a la izquierda, $k$ a la derecha). Arriba va con un único nombre, $a$, siguiendo la demostración de [[cuerpos-finitos-y-campos-de-galois#Función phi de Euler|02.16]].

**Dónde se usa cada una en el resto de la clase.** La primera identidad de Euler-Fermat es la que decide, en `RSA`, que $e \cdot d \equiv 1 \pmod{\varphi(n)}$ recupera exactamente $m$ al descifrar — porque $\varphi(n) = (p-1)(q-1)$ mide el tamaño del grupo multiplicativo $\mathbb{Z}_n^{*}$. La segunda, sobre el orden del grupo, decide en Diffie-Hellman que los exponentes $x$ e $y$ se sortean sobre $\mathbb{Z}_q$ — el tamaño exacto del grupo cíclico $G$.
