---
title: Secreto perfecto en los parciales viejos
resumen: 'Los dos ejercicios de secreto perfecto que aparecieron en los parciales viejos, el Vigenère formal del 2C-2025 y la clave de dos bits del 1C-2025, con enunciado completo, demostración escrita entera y tips.'
fuentes: ["[[parciales-viejos]]", "[[secreto-perfecto]]", "[[one-time-pad]]", "[[modelo-probabilistico-de-un-criptosistema]]", "[[cifrado-de-vigenere]]", "[[practica-02-videos]]"]
aliases: [Secreto perfecto en parciales viejos, Ejercicios viejos de secreto perfecto, Secreto perfecto 2C-2025 y 1C-2025]
type: parcial
clase: 1p
orden: 17
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, secreto-perfecto, one-time-pad, vigenere, shannon, bayes]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Secreto perfecto en los parciales viejos

Dos ejercicios en los cuatro parciales del vault, los dos como Ej. 4: el Vigenère formal del [[parciales-viejos#2C-2025|2C-2025]] y el cifrado de un bit con clave de dos bits del [[parciales-viejos#1C-2025|1C-2025]]. En 1C-2023 y 1C-2018 el tema no aparece. El análisis parcial por parcial está en [[parciales-viejos|Parciales viejos]]; la teoría condensada y la receta, en la página de resumen de este tipo.

La receta y las trampas de este tipo están en [[1p-secreto-perfecto|Secreto perfecto, demostrado]]; la sección entera empieza en [[primer-parcial|Primer parcial]].

## 2C-2025 · Ej. 4 — Secreto perfecto de un Vigenère formal

### Enunciado

Se define un criptosistema de encripción simétrica $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ con un alfabeto de 26 letras con $K = k_1k_2k_3...k_l$ con $k_i \in \{0, ..., 25\}$. Los mensajes $M = m_1m_2...m_n$ donde $m_i \in \{0, ..., 25\}$. La encripción $\mathsf{Enc}$ procede como

$$c_j = (m_j + k_{((j-1)\bmod l)+1})(26)$$

y la desencripción $\mathsf{Dec}$

$$m_j = (c_j - k_{((j-1)\bmod l)+1})(26)$$

Demostrar si este sistema tiene secreto perfecto y ante que condiciones sobre los parámetros.

### Respuesta modelo

**Modelo.** El $(26)$ es reducción módulo 26: el esquema trabaja en $\mathbb{Z}_{26}$. Espacios: $\mathcal{M} = \mathcal{C} = \mathbb{Z}_{26}^{\,n}$ (mensajes de largo fijo $n$) y $\mathcal{K} = \mathbb{Z}_{26}^{\,l}$, con $\lvert\mathcal{M}\rvert = 26^{\,n}$ y $\lvert\mathcal{K}\rvert = 26^{\,l}$. Suponemos $\mathsf{Gen}$ uniforme: cada $k_i$ se elige uniforme en $\mathbb{Z}_{26}$ e independiente de los demás, de modo que $\Pr[K{=}k] = 26^{-l}$ para toda $k \in \mathcal{K}$, y la clave se elige independientemente del mensaje. Es el cifrado de Vigenère con clave de largo $l$: el símbolo $j$ del mensaje se suma con el símbolo $((j-1) \bmod l) + 1$ de la clave, recorriéndola cíclicamente. Corrección: $\mathsf{Dec}_k(\mathsf{Enc}_k(m))_j = (m_j + k_i) - k_i = m_j \pmod{26}$ con el mismo $k_i$ en los dos pasos.

Usamos la caracterización equivalente del secreto perfecto: hay secreto perfecto si y solo si $\Pr[C{=}c \mid M{=}m]$ no depende de $m$, es decir $\Pr[C{=}c \mid M{=}m] = \Pr[C{=}c \mid M{=}m']$ para todo $m, m' \in \mathcal{M}$ y todo $c \in \mathcal{C}$. Con clave uniforme e independiente del mensaje,

$$\Pr[C{=}c \mid M{=}m] = \sum_{k\,:\,\mathsf{Enc}_k(m) = c} \Pr[K{=}k] = \frac{\#\{k \in \mathcal{K} : \mathsf{Enc}_k(m) = c\}}{26^{\,l}}.$$

El veredicto depende de cómo se comparan $l$ y $n$.

**Caso $l \ge n$: hay secreto perfecto.** Para $j = 1, \ldots, n$ vale $j - 1 < l$, luego $((j-1) \bmod l) + 1 = j$ y el cifrado es $c_j = m_j + k_j \pmod{26}$: cada símbolo del mensaje se cifra con un símbolo distinto de la clave, y los últimos $l - n$ símbolos de la clave no se usan. Fijados $m$ y $c$, una clave $k$ cumple $\mathsf{Enc}_k(m) = c$ si y solo si $k_j = c_j - m_j \pmod{26}$ para $j = 1, \ldots, n$, con $k_{n+1}, \ldots, k_l$ libres. Hay exactamente $26^{\,l-n}$ claves así, para cualquier par $(m, c)$. Entonces

$$\Pr[C{=}c \mid M{=}m] = \frac{26^{\,l-n}}{26^{\,l}} = 26^{-n} \qquad \text{para todo } m \in \mathcal{M},\ c \in \mathcal{C},$$

valor que no depende de $m$: $\Pr[C{=}c \mid M{=}m] = \Pr[C{=}c \mid M{=}m'] = 26^{-n}$ para todo par $m, m'$. Hay secreto perfecto. Para cerrarlo con la definición:

$$\Pr[C{=}c] = \sum_{m} \Pr[M{=}m]\,\Pr[C{=}c \mid M{=}m] = 26^{-n} \sum_m \Pr[M{=}m] = 26^{-n},$$

y por Bayes

$$\Pr[M{=}m \mid C{=}c] = \frac{\Pr[C{=}c \mid M{=}m]\,\Pr[M{=}m]}{\Pr[C{=}c]} = \frac{26^{-n}\,\Pr[M{=}m]}{26^{-n}} = \Pr[M{=}m],$$

para toda distribución de $M$, todo $m$ y todo $c$. En el caso $l = n$ hay exactamente una clave por par, $k = c - m \pmod{26}$ símbolo a símbolo, y $\Pr[C{=}c \mid M{=}m] = \Pr[K = c - m] = 26^{-n}$: es el One Time Pad sobre el grupo $(\mathbb{Z}_{26}, +)$, con la suma módulo 26 en el papel del $\oplus$.

**Caso $l < n$: no hay secreto perfecto.** Como $l < n$, las posiciones $1$ y $1 + l$ existen en el mensaje y usan el mismo símbolo de clave: $((1 + l - 1) \bmod l) + 1 = (l \bmod l) + 1 = 1 = ((1-1) \bmod l) + 1$. En general, $j$ y $j + l$ comparten $k_i$ con $i = ((j-1) \bmod l) + 1$. Restando los dos símbolos del criptograma,

$$c_j - c_{j+l} = (m_j + k_i) - (m_{j+l} + k_i) = m_j - m_{j+l} \pmod{26},$$

una relación entre símbolos del mensaje que se lee del criptograma sin conocer la clave. Contraejemplo formal: sean $m = 0\,0 \cdots 0$ (todos ceros), $m'$ el mensaje con $m'_{1+l} = 1$ y ceros en el resto, y $c = 0\,0 \cdots 0$. La única clave que lleva $m$ a $c$ es $k = 0^{\,l}$ (como $n > l$, intervienen los $l$ símbolos de la clave y todos deben valer $0$), así que $\Pr[C{=}c \mid M{=}m] = \Pr[K = 0^{\,l}] = 26^{-l} > 0$. En cambio, con cualquier clave el cifrado de $m'$ cumple $c_1 - c_{1+l} = m'_1 - m'_{1+l} = -1 \equiv 25 \pmod{26}$, mientras que en $c$ es $c_1 - c_{1+l} = 0$: ninguna clave lleva $m'$ a $c$ y $\Pr[C{=}c \mid M{=}m'] = 0$. Las dos condicionales difieren, falla la caracterización y no hay secreto perfecto; equivalentemente, para cualquier distribución con $\Pr[M{=}m'] > 0$, ver $C = c$ descarta a $m'$: $\Pr[M{=}m' \mid C{=}c] = 0 \ne \Pr[M{=}m']$. Coincide con el teorema de Shannon: $\lvert\mathcal{K}\rvert = 26^{\,l} < 26^{\,n} = \lvert\mathcal{M}\rvert$, y sin al menos tantas claves como mensajes no puede haber secreto perfecto.

**Conclusión: condiciones sobre los parámetros.** El sistema tiene secreto perfecto si y solo si $l \ge n$: la clave al menos tan larga como el mensaje, que es $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ (Shannon), y además la clave elegida uniformemente en $\mathbb{Z}_{26}^{\,l}$, independientemente del mensaje y usada una sola vez. La uniformidad es necesaria: con $l = n$, $\Pr[C{=}c \mid M{=}m] = \Pr[K = c - m]$, y para que no dependa de $m$ todas las claves deben ser equiprobables. El único uso también: si dos mensajes $m, m'$ se cifran con la misma clave, $c - c' = m - m' \pmod{26}$ símbolo a símbolo, la misma fuga que en el caso $l < n$. Con esas condiciones el esquema es el One Time Pad sobre $\mathbb{Z}_{26}$; con $l < n$ es el Vigenère clásico, que no lo tiene.

### Tips

- Vale puntos separar en los dos casos y decir explícitamente cuál es «la condición sobre los parámetros»: $l \ge n$, con la clave uniforme y de un solo uso. Nombrar a Shannon, $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$, es lo que el corrector espera ver como cierre.
- La refutación del caso $l < n$ cabe en una línea, $c_j - c_{j+l} = m_j - m_{j+l}$; si sobra tiempo, convertirla en el par imposible ($m$ con dos símbolos iguales, $m'$ con dos distintos, $c$ con dos iguales) para que la demostración quede formal.
- El índice $((j-1) \bmod l) + 1$ solo dice «recorrer la clave cíclicamente, indexada desde 1»; con $l \ge n$ es simplemente $j$. Resolverlo antes de calcular ahorra errores.
- Es el mismo argumento con que [[secreto-perfecto|Secreto perfecto]] demuestra que el cifrado por rotación es perfecto si y solo si el mensaje tiene una sola letra: con $l = n$ hay una clave por par $(m, c)$ y la condicional vale $1/\lvert\mathcal{K}\rvert$; con clave más corta, el patrón de repeticiones del mensaje sobrevive en el criptograma. Sirve para cualquier variante sobre $\mathbb{Z}_{26}$ o sobre $\{0,1\}^{n}$ con $\oplus$.
- Escribir la hipótesis «$K$ uniforme e independiente de $M$» antes de la primera fórmula: el enunciado no la dice y sin ella $\Pr[C{=}c \mid M{=}m]$ no es un conteo de claves.

## 1C-2025 · Ej. 4 — Secreto perfecto con una clave de dos bits

### Enunciado

Dado el siguiente criptosistema $Exp_{eav}(\mathbf{A}, n)$, verificar si un atacante tiene éxito en un ataque de texto cifrado.

$$c = E_k(m) = (m \oplus k_0) \oplus f(k_1),$$

con $f(\cdot)$ la función identidad, $f(0) = 0$ y $f(1) = 1$ y $k = k_0k_1 \in \{0,1\}^2$ uniformemente distribuídas, y teniendo en cuenta $m, c \in \{0,1\}$ y que $Pr[m = 0] = 0{,}9$ y $Pr[m = 1] = 0{,}1$.

### Respuesta modelo

**Modelo.** Como $f$ es la identidad, $c = E_k(m) = m \oplus k_0 \oplus k_1$. Espacios: $\mathcal{M} = \mathcal{C} = \{0,1\}$ y $\mathcal{K} = \{0,1\}^2 = \{00, 01, 10, 11\}$ con $\Pr[K{=}k] = \tfrac14$ para cada clave, elegida independientemente del mensaje; distribución del mensaje $\Pr[M{=}0] = 0{,}9$, $\Pr[M{=}1] = 0{,}1$. Descifrado $D_k(c) = c \oplus k_0 \oplus k_1$, y $D_k(E_k(m)) = m \oplus k_0 \oplus k_1 \oplus k_0 \oplus k_1 = m$. El «ataque de texto cifrado» es el experimento $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$: el atacante tiene éxito si adivina el bit $b$ con probabilidad mayor que $\tfrac12$, y existe un atacante así si y solo si el esquema no tiene secreto perfecto. Verificamos el secreto perfecto.

**Condicionales, contando claves.** Fijado $m$, $C = c$ ocurre exactamente para las claves con $k_0 \oplus k_1 = m \oplus c$:

$$\Pr[C{=}0 \mid M{=}0] = \Pr[k_0 \oplus k_1 = 0] = \Pr[K{=}00] + \Pr[K{=}11] = \tfrac14 + \tfrac14 = \tfrac12,$$
$$\Pr[C{=}0 \mid M{=}1] = \Pr[k_0 \oplus k_1 = 1] = \Pr[K{=}01] + \Pr[K{=}10] = \tfrac14 + \tfrac14 = \tfrac12,$$
$$\Pr[C{=}1 \mid M{=}0] = \Pr[k_0 \oplus k_1 = 1] = \tfrac12, \qquad \Pr[C{=}1 \mid M{=}1] = \Pr[k_0 \oplus k_1 = 0] = \tfrac12.$$

| $\Pr[C{=}c \mid M{=}m]$ | $c = 0$ | $c = 1$ |
|---|---|---|
| $m = 0$ | $k \in \{00, 11\}$: $\tfrac12$ | $k \in \{01, 10\}$: $\tfrac12$ |
| $m = 1$ | $k \in \{01, 10\}$: $\tfrac12$ | $k \in \{00, 11\}$: $\tfrac12$ |

Las dos filas son iguales: $\Pr[C{=}c \mid M{=}0] = \Pr[C{=}c \mid M{=}1] = \tfrac12$ para $c = 0, 1$. La distribución del criptograma no depende del mensaje, luego el esquema tiene secreto perfecto, para cualquier distribución de $M$.

**Cierre con la definición (Bayes).** Con la distribución del enunciado,

$$\Pr[C{=}0] = \Pr[M{=}0]\,\Pr[C{=}0 \mid M{=}0] + \Pr[M{=}1]\,\Pr[C{=}0 \mid M{=}1] = 0{,}9 \cdot \tfrac12 + 0{,}1 \cdot \tfrac12 = \tfrac12,$$

y del mismo modo $\Pr[C{=}1] = \tfrac12$. Entonces

$$\Pr[M{=}0 \mid C{=}0] = \frac{\Pr[C{=}0 \mid M{=}0]\,\Pr[M{=}0]}{\Pr[C{=}0]} = \frac{\tfrac12 \cdot 0{,}9}{\tfrac12} = 0{,}9 = \Pr[M{=}0], \qquad \Pr[M{=}1 \mid C{=}0] = \frac{\tfrac12 \cdot 0{,}1}{\tfrac12} = 0{,}1 = \Pr[M{=}1],$$

y lo mismo con $C = 1$: $\Pr[M{=}0 \mid C{=}1] = 0{,}9$ y $\Pr[M{=}1 \mid C{=}1] = 0{,}1$. En los cuatro pares la a posteriori coincide con la a priori, $\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$.

**El experimento de texto cifrado.** El adversario emite $m_0 = 0$ y $m_1 = 1$ (los únicos dos mensajes), recibe $c = E_k(m_b)$ con $b \leftarrow \{0,1\}$ uniforme y emite $b'$. Como $k' = k_0 \oplus k_1$ es uniforme en $\{0,1\}$ (dos de las cuatro claves dan $0$ y dos dan $1$) e independiente de $b$, el criptograma $c = m_b \oplus k'$ es uniforme e independiente de $b$; cualquier $b'$ calculado a partir de $c$ es independiente de $b$ y $\Pr[b' = b] = \tfrac12$. Con la estrategia natural $b' = c$, los ocho casos $(b, k)$, cada uno con probabilidad $\tfrac18$:

| $b$ | $m_b$ | $k$ | $k_0 \oplus k_1$ | $c$ | $b' = c$ | acierta |
|---|---|---|---|---|---|---|
| 0 | 0 | 00 | 0 | 0 | 0 | sí |
| 0 | 0 | 01 | 1 | 1 | 1 | no |
| 0 | 0 | 10 | 1 | 1 | 1 | no |
| 0 | 0 | 11 | 0 | 0 | 0 | sí |
| 1 | 1 | 00 | 0 | 1 | 1 | sí |
| 1 | 1 | 01 | 1 | 0 | 0 | no |
| 1 | 1 | 10 | 1 | 0 | 0 | no |
| 1 | 1 | 11 | 0 | 1 | 1 | sí |

$$\Pr\big[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1\big] = \tfrac{4}{8} = \tfrac12.$$

**Conclusión.** El atacante no tiene éxito: su probabilidad de acertar es exactamente $\tfrac12$, la misma que sin ver el criptograma, y eso vale para todo adversario. El esquema es un One Time Pad de un bit con clave efectiva $k' = k_0 \oplus k_1$, uniforme, y por eso tiene secreto perfecto. El sesgo $\Pr[M{=}0] = 0{,}9$ no interviene: la mejor apuesta del atacante sobre el mensaje es $m = 0$ con probabilidad $0{,}9$ antes de ver $c$, y sigue siendo $0{,}9$ después.

### Tips

- El atajo que vale puntos es contar claves por fila: $\Pr[C{=}c \mid M{=}m] = \Pr[k_0 \oplus k_1 = m \oplus c] = \tfrac12$ en las cuatro casillas. La tabla de Bayes con los ocho casos es el camino largo; alcanza con el cierre en dos líneas.
- El $0{,}9 / 0{,}1$ es una distracción: el veredicto sale sin usarlo, y se usa solo para mostrar que la a posteriori reproduce el $0{,}9$. El error es tomar el sesgo del mensaje por falta de uniformidad.
- La $f$ identidad está para que se escriba $c = m \oplus k_0 \oplus k_1$. Cualquier otra $f: \{0,1\} \to \{0,1\}$ daría lo mismo, porque $k_0$ es un bit uniforme independiente de $k_1$, y un bit uniforme xoreado con algo independiente de él sigue siendo uniforme: la clave efectiva $k_0 \oplus f(k_1)$ es uniforme para toda $f$.
- La variante que sí rompe el esquema es la clave sesgada: si $\Pr[K{=}00] + \Pr[K{=}11] \ne \tfrac12$, las dos filas de la tabla dejan de coincidir y la misma cuenta lo muestra. Es el ejercicio con clave $0{,}3 / 0{,}1 / 0{,}4 / 0{,}2$ de [[one-time-pad|One Time Pad]].
- «Verificar si un atacante tiene éxito» se responde con el número: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1] = \tfrac12$ exactamente, para todo adversario. Decir «no tiene ventaja» sin la cuenta vale menos; el cálculo por casos $(b, k)$ es el de [[practica-02-videos|Práctica 02]].

## Lo que se repite

- Los dos esquemas son un One Time Pad disfrazado: el Vigenère con clave del largo del mensaje es el OTP sobre $(\mathbb{Z}_{26}, +)$ ([[cifrado-de-vigenere|Cifrado de Vigenère]]); $m \oplus k_0 \oplus k_1$ es el OTP de un bit con clave efectiva $k_0 \oplus k_1$. Reconocerlo en la primera línea orienta toda la respuesta.
- La cuenta que decide es siempre la misma: $\Pr[C{=}c \mid M{=}m]$ como masa de las claves que llevan $m$ a $c$, y verificar que no depende de $m$. Con clave uniforme es «cantidad de claves sobre el total»; en el caso afirmativo la cantidad es la misma en todas las casillas.
- Las dos hipótesis que hay que escribir antes de calcular: clave uniforme y elegida independientemente del mensaje. El enunciado las da en el 1C-2025 («uniformemente distribuidas») y las calla en el 2C-2025; en los dos casos se declaran.
- Las condiciones sobre los parámetros son las tres del OTP: clave al menos tan larga como el mensaje ($\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$, Shannon), uniforme y de un solo uso. Cuando el enunciado pide «ante qué condiciones», la respuesta es esa lista.
- La refutación tiene una forma fija: una relación entre criptogramas que no depende de la clave ($c_j - c_{j+l} = m_j - m_{j+l}$, o $c \oplus c' = m \oplus m'$ con clave reusada) y, a partir de ella, un par $(m, c)$ imposible. Un solo par alcanza.
- La distribución de los mensajes que trae el enunciado ($0{,}9 / 0{,}1$) nunca cambia el veredicto; sirve para cerrar con Bayes y nada más.
- Llevar memorizado: la definición con su «para toda distribución de $M$», la caracterización $\Pr[C{=}c \mid M{=}m] = \Pr[C{=}c \mid M{=}m']$, la fórmula de Bayes, el teorema de Shannon y la demostración del OTP en tres líneas.
