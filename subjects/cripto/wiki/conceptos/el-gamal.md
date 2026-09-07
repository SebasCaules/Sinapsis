---
title: El Gamal
resumen: 'Criptosistema asimétrico construido sobre Diffie-Hellman: enmascara el mensaje multiplicándolo por el secreto compartido $g^{xy}$. Es probabilístico por construcción y alcanza CPA-Secure si vale la conjetura DDH.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[diffie-hellman]]", "[[criptosistema-asimetrico]]", "[[rsa]]"]
aliases: [El Gamal, ElGamal, Cifrado de El Gamal, Criptosistema de El Gamal, Enmascaramiento multiplicativo]
type: concepto
unidad: 1
clase: 4
orden: 8
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, criptografia-asimetrica, el-gamal, diffie-hellman, ddh, cpa-secure, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# El Gamal

**El criptosistema asimétrico que se construye directamente sobre Diffie-Hellman: usa el secreto compartido $g^{xy}$ como máscara multiplicativa del mensaje, y es `CPA-Secure` si la conjetura `DDH` vale en el grupo.**

> Filminas **29-31** del PDF de teoría de la Clase 04. La clase todavía no se dictó (hoy es 04/09/2026): nota escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas.

## La construcción

$$\begin{aligned}
\mathsf{Gen}&:\ \text{seleccionar } (G,q,g),\ G \text{ grupo de tamaño } q,\ g \text{ generador}\\
&\quad x \leftarrow \mathbb{Z}_q,\quad h = g^{x}\\
&\quad pk = (G,q,g,h),\quad sk = (G,q,g,x)\\[4pt]
\mathsf{Enc}_{pk}(m)&:\ y \leftarrow \mathbb{Z}_q,\quad c = (c_1,c_2) = \bigl(g^{y},\ h^{y}\cdot m\bigr)\\
\mathsf{Dec}_{sk}(c) &= c_2 \,/\, c_1^{\,x}
\end{aligned}$$

Es literalmente [[diffie-hellman|Diffie-Hellman]] con un paso más: $g^x$ y $g^y$ son los mismos medios pasos del protocolo de intercambio de claves, y $h^y = (g^x)^y = g^{xy} = (g^y)^x = c_1^{x}$ es el secreto compartido de siempre. El Gamal usa ese secreto como una **máscara multiplicativa**: en vez de transmitirlo para derivar una clave simétrica, lo multiplica directamente contra $m$.

> **Errata de la filmina (29).** La lámina escribe $pk = (G,q,\mathbf{p},h)$ y $sk = (G,q,\mathbf{p},x)$ — con $p$ en la tercera posición. Verificado sobre la página renderizada: el glifo es una "p" minúscula, no una "g", y $p$ no se define en ningún lugar de esta filmina ni de las anteriores del bloque de El Gamal. Dos líneas antes, la misma lámina fija la terna a seleccionar como "$G, q, g$": la variable correcta es $g$, el generador, y sin él $\mathsf{Dec}$ no tiene con qué recomputar la cadena. Arriba va corregido.

## Por qué el descifrado funciona

$$\mathsf{Dec}(c) = \frac{c_2}{c_1^{x}} = \frac{h^{y}\cdot m}{(g^{y})^{x}} = \frac{(g^{x})^{y}\cdot m}{g^{xy}} = \frac{g^{xy}\cdot m}{g^{xy}} = m$$

Todo el esquema se apoya en una sola igualdad, $h^{y} = g^{xy} = c_1^{x}$: quien cifra la calcula desde $h$ (pública) y su propio $y$; quien descifra la calcula desde $c_1$ (que viaja en el criptograma) y su $x$ privado. Nadie más puede calcularla sin resolver el problema que Diffie-Hellman ya deja planteado: dados $g^x$ y $g^y$, ni el logaritmo discreto ni la conjetura `DDH` tienen solución eficiente conocida.

## Resultado de seguridad y la conjetura DDH

La filmina lo resume en una línea: **si la conjetura de decisión Diffie-Hellman (`DDH`) es difícil en $G$, El Gamal es `CPA-Secure`.** Es la misma conjetura que sostiene la seguridad de la clave compartida en Diffie-Hellman —dados $g$, $g^x$, $g^y$, un adversario no puede distinguir $g^{xy}$ de un elemento aleatorio del grupo— aplicada ahora a un rol distinto: acá $g^{xy}$ no es una clave que se deriva después, es la máscara que se multiplica **directamente** contra $m$. Si un adversario pudiera distinguir $c_2 = h^{y}\cdot m_0$ de $c_2' = h^{y}\cdot m_1$ para $m_0 \ne m_1$ elegidos por él, eso le daría una forma de distinguir $g^{xy}$ de ruido — que es exactamente lo que `DDH` prohíbe.

## Por qué es probabilístico, y por qué eso importa

El $y$ se sortea de nuevo en **cada** cifrado, así que el mismo mensaje $m$ da un criptograma distinto cada vez — El Gamal es no determinístico por construcción, sin necesitar ningún padding externo. Es la diferencia central con [[rsa|RSA]] textbook, que sí es determinístico y por eso necesita el parche de [[pkcs1-y-tamano-de-claves|PKCS#1]]. Y es la propiedad que [[criptosistema-asimetrico|Criptosistema asimétrico]] exige como condición necesaria para `CPA-Secure`: El Gamal la cumple de fábrica, sin ningún mecanismo agregado.

## Diferencias con RSA

| | `RSA` | El Gamal |
|---|---|---|
| Determinismo | Determinístico (necesita padding) | Probabilístico por diseño |
| Parámetros | Cada par de claves trae su propio $n=p\cdot q$ | $(G,q,g)$ se pueden **reutilizar** entre usuarios |
| Estructura algebraica | Anillo $\mathbb{Z}_n$ | Cualquier grupo donde `DDH` sea difícil |
| Alternativas de grupo | — | Anillos de polinomios ($2^{n}$ elementos, fáciles de mapear a mensajes de $n$ bits), curvas elípticas |
| Expansión del mensaje | $c$ mide lo mismo que $n$ | $c=(c_1,c_2)$ mide el **doble** que $m$ |

La fila de curvas elípticas no es solo una alternativa más: la filmina apunta que ahí el problema de decisión `DH` es **más difícil de atacar**, que es la puerta de entrada a por qué [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]] recomienda módulos mucho más chicos sobre curvas que sobre campos numéricos.

*(La última fila de la tabla —la expansión a $(c_1,c_2)$— no está en la filmina: es lectura nuestra sobre la propia fórmula de $\mathsf{Enc}$, y es literalmente el precio del no determinismo.)*

## Ejemplo numérico, verificado

Con parámetros deliberadamente chicos, $G = \mathbb{Z}_q^{*}$, $q = 2357$ (primo), $g = 2$:

$$x = 1751 \;\longrightarrow\; h = g^{x} \bmod q = 2^{1751} \bmod 2357 = 1185$$

Cifrado de $m = 2035$ con $y = 1520$ elegido al azar:

$$c = \bigl(2^{1520} \bmod 2357,\ \ 2035\cdot 1185^{1520} \bmod 2357\bigr) = (1430,\ 697)$$

Descifrado de $c=(1430,697)$:

$$1430^{-1751}\cdot 697 \bmod 2357 = 2035 \quad\checkmark$$

Las tres cuentas cierran exactamente como las escribe la filmina 31 — verificado con aritmética modular, no solo leído del PDF.
