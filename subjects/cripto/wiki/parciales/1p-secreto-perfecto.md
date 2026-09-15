---
title: Secreto perfecto, demostrado
resumen: 'Cómo se resuelve el ejercicio de secreto perfecto del primer parcial: el modelo probabilístico, las caracterizaciones equivalentes, el conteo de claves que decide, cómo se refuta y qué condiciones sobre los parámetros hay que enunciar.'
fuentes: ["[[parciales-viejos]]", "[[secreto-perfecto]]", "[[one-time-pad]]", "[[modelo-probabilistico-de-un-criptosistema]]", "[[cifrado-de-vigenere]]", "[[practica-02-videos]]"]
aliases: [Secreto perfecto en el parcial, Demostrar secreto perfecto en el parcial, Ejercicio de secreto perfecto]
type: parcial
clase: 1p
orden: 16
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, secreto-perfecto, one-time-pad, shannon, vigenere, bayes]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Secreto perfecto, demostrado

> [!ejemplo] Así se tomó · 1C-2025, Ejercicio 4
> Dado el siguiente criptosistema $Exp_{eav}(\mathbf{A}, n)$, verificar si un atacante tiene éxito en un ataque de texto cifrado.
>
> $$c = E_k(m) = (m \oplus k_0) \oplus f(k_1),$$
>
> con $f(\cdot)$ la función identidad, $f(0) = 0$ y $f(1) = 1$ y $k = k_0k_1 \in \{0,1\}^2$ uniformemente distribuídas, y teniendo en cuenta $m, c \in \{0,1\}$ y que $Pr[m = 0] = 0{,}9$ y $Pr[m = 1] = 0{,}1$.

## Lo mínimo que hay que saber

### El criptosistema y su modelo probabilístico

Un criptosistema es una terna $\Pi = (\mathsf{Gen}, E, D)$ sobre tres conjuntos —claves $\mathcal{K}$, mensajes $\mathcal{M}$, criptogramas $\mathcal{C}$— con $D_k(E_k(m)) = m$ (las filminas y el 2C-2025 escriben $\mathsf{Enc}_k$ y $\mathsf{Dec}_k$ por $E_k$ y $D_k$). La terna dice qué funciones hay, no qué tan probable es cada cosa; para hablar de seguridad se agregan **tres distribuciones**:

- $\Pr[M{=}m]$, la del **mensaje**: la fija el contexto (el idioma, qué se manda), no el diseñador. Puede ser cualquiera.
- $\Pr[K{=}k]$, la de la **clave**: la fija $\mathsf{Gen}$, casi siempre uniforme, $\Pr[K{=}k] = 1/\lvert\mathcal{K}\rvert$.
- $\Pr[C{=}c]$, la del **criptograma**: no se elige, queda inducida por las otras dos y por $E$, porque $C = E_K(M)$.

**Hipótesis de independencia:** la clave se sortea sin mirar el mensaje, $\Pr[M{=}m,\ K{=}k] = \Pr[M{=}m]\cdot\Pr[K{=}k]$. Sin ella no vale ninguna de las fórmulas que siguen; hay que escribirla en la respuesta.

### Las tres fórmulas: contar claves

- **Condicional del criptograma dado el mensaje**: la masa de las claves que llevan $m$ a $c$,
  $$\Pr[C{=}c \mid M{=}m] = \sum_{k\,:\,E_k(m) = c} \Pr[K{=}k] = \frac{\#\{k : E_k(m) = c\}}{\lvert\mathcal{K}\rvert}\quad\text{(clave uniforme)}.$$
  Depende solo de $\mathsf{Gen}$ y de la tabla de cifrado, nunca de $\Pr[M{=}\cdot]$; **es la cuenta que decide el ejercicio**.
- **Marginal del criptograma**: el promedio de las condicionales pesado por los mensajes, $\Pr[C{=}c] = \sum_{m} \Pr[M{=}m]\,\Pr[C{=}c \mid M{=}m]$.
- **A posteriori (Bayes)**: lo que el adversario cree del mensaje después de ver $c$,
  $$\Pr[M{=}m \mid C{=}c] = \frac{\Pr[C{=}c \mid M{=}m]\cdot\Pr[M{=}m]}{\Pr[C{=}c]}.$$

### Secreto perfecto: la definición y sus caracterizaciones equivalentes

$\Pi$ tiene **secreto perfecto** si, para **toda** distribución sobre $\mathcal{M}$, todo $m \in \mathcal{M}$ y todo $c \in \mathcal{C}$ con $\Pr[C{=}c] > 0$,
$$\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m].$$
Ver el criptograma no cambia lo que el adversario cree del mensaje: la a posteriori es la a priori. No hay ninguna cota de cómputo; es seguridad **incondicional**. Cuatro formas equivalentes (la 1 y la 2 por Bayes, con $\Pr[M{=}m] > 0$ y $\Pr[C{=}c] > 0$; la 2 y la 3 porque la marginal es el promedio de las condicionales):

1. **Criterio del mensaje** (la definición): $\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$.
2. **Criterio del criptograma**: $\Pr[C{=}c \mid M{=}m] = \Pr[C{=}c]$.
3. **Indistinguibilidad perfecta**: $\Pr[C{=}c \mid M{=}m] = \Pr[C{=}c \mid M{=}m']$ para todo $m, m' \in \mathcal{M}$ y todo $c$. La distribución del criptograma es la misma cualquiera sea el mensaje.
4. **Experimento $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$**: el adversario $A$ elige $m_0, m_1$; recibe $c = E_k(m_b)$ con $b \leftarrow \{0,1\}$ uniforme; emite $b'$; gana si $b' = b$. Hay secreto perfecto si y solo si $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1] = \tfrac12$ para **todo** $A$.

> [!tip] Cuál usar
> Para **demostrar**, la 3: es la única que no menciona $\Pr[M{=}\cdot]$, se verifica contando claves y vale automáticamente para toda distribución de mensajes; después, si se quiere, se cierra con Bayes (la 1). Para **refutar** basta **un** caso que falle en cualquiera de las cuatro: la definición dice «para todo», y negarla es exhibir uno.

### Teorema de Shannon: la cota de claves

$$\text{secreto perfecto} \implies \lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert.$$
Fijado un $c$ posible, cada mensaje $m$ tiene que poder producirlo con alguna clave (si no, $\Pr[M{=}m \mid C{=}c] = 0 \ne \Pr[M{=}m]$), y mensajes distintos necesitan claves distintas porque $D_k(c)$ es un solo mensaje. La clave tiene que ser **al menos tan larga como el mensaje**. Es condición **necesaria, no suficiente**: con $\lvert\mathcal{K}\rvert = 3 \ge \lvert\mathcal{M}\rvert = 2$ se puede no tener secreto perfecto si las claves están mal repartidas entre los criptogramas (Ejemplo 2 de [[probabilidad-y-criptografia|Probabilidad y criptografía]]).

### El One Time Pad, el molde de toda demostración

$\mathcal{M} = \mathcal{K} = \mathcal{C} = \{0,1\}^n$, clave uniforme, $E_k(m) = m \oplus k$, $D_k(c) = c \oplus k$. Fijados $m$ y $c$ hay **exactamente una** clave que lleva uno al otro, $k = m \oplus c$, así que
$$\Pr[C{=}c \mid M{=}m] = \Pr[K = m \oplus c] = \tfrac{1}{2^n},$$
que no depende de $m$: secreto perfecto por la caracterización 3. Lo mismo sobre $(\mathbb{Z}_{26}, +)$ con $k = c - m \pmod{26}$ y $26^{-n}$: el cifrado por rotación de una sola letra y el Vigenère con clave tan larga como el mensaje son este mismo OTP. Sus tres condiciones son las de cualquier esquema con secreto perfecto (todo esquema con secreto perfecto es reducible al OTP):

1. **Clave tan larga como el mensaje**: $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ (Shannon).
2. **Clave uniforme**: con una clave sesgada la cuenta de Bayes se mueve (en el ejercicio de la Clase 2, $\Pr[M{=}00 \mid C{=}01] = 0{,}32 \ne 0{,}60 = \Pr[M{=}00]$).
3. **Un solo uso**: con la misma clave, $c_1 \oplus c_2 = m_1 \oplus m_2$; la clave se cancela y el adversario se queda con una relación entre los mensajes.

### Cómo se refuta

Tres caminos, y con uno alcanza:

- **Conteo**: $\lvert\mathcal{K}\rvert < \lvert\mathcal{M}\rvert$, y Shannon lo cierra en una línea.
- **Una relación entre criptogramas que no depende de la clave.** Si dos posiciones $j$ y $j + l$ se cifran con el mismo símbolo de clave (clave de largo $l$ repetida sobre un mensaje más largo), restando queda $c_j - c_{j+l} = m_j - m_{j+l} \pmod{26}$: el criptograma conserva un patrón del mensaje. Es la misma repetición de clave que el criptoanálisis de Vigenère explota bloque por bloque.
- **Un par $(m, c)$ imposible.** De la relación anterior sale el contraejemplo formal: un $m$ con $m_j = m_{j+l}$, un $m'$ con $m'_j \ne m'_{j+l}$ y un $c$ con $c_j = c_{j+l}$. Entonces $\Pr[C{=}c \mid M{=}m] > 0$ pero $\Pr[C{=}c \mid M{=}m'] = 0$: falla la caracterización 3 y, por Bayes, $\Pr[M{=}m' \mid C{=}c] = 0 \ne \Pr[M{=}m']$.

### La distribución de los mensajes es una distracción

La definición cuantifica sobre **toda** distribución de $M$, y la caracterización 3 ni la menciona. Si el enunciado da $\Pr[M{=}0] = 0{,}9$ o $\Pr[M{=}m_0] = 0{,}7$, ese dato **no cambia el veredicto**: sirve solo para cerrar con Bayes y mostrar que la a posteriori reproduce ese mismo $0{,}9$ o $0{,}7$. Lo que tiene que ser uniforme es la **clave**, no el mensaje; y lo que sale uniforme es el criptograma **para cada mensaje fijo**.

## Receta

1. **Escribir el modelo.** Nombrar $\mathcal{M}$, $\mathcal{K}$, $\mathcal{C}$ con sus tamaños; declarar «$K$ uniforme, $\Pr[K{=}k] = 1/\lvert\mathcal{K}\rvert$, elegida independientemente de $M$»; reescribir el cifrado en su forma más simple (por ejemplo $c = m \oplus k_0 \oplus k_1$, o $c_j = m_j + k_j$ con el índice de la clave ya resuelto) y verificar la corrección $D_k(E_k(m)) = m$ en una línea.
2. **Anticipar el veredicto mirando el esquema.** ¿$\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$? ¿Algún símbolo de clave se usa dos veces dentro del mismo mensaje? ¿Cada par $(m, c)$ tiene la misma cantidad de claves? Si el esquema tiene parámetros ($l$, $n$), separar en casos antes de calcular.
3. **Si hay secreto perfecto: contar claves.** Para cada $m$ y cada $c$, $\Pr[C{=}c \mid M{=}m] = \#\{k : E_k(m) = c\}/\lvert\mathcal{K}\rvert$; en un esquema chico, una tabla con filas $m$, columnas $c$ y las claves de cada casilla. Escribir el valor común (por ejemplo $\tfrac12$ o $26^{-n}$), decir explícitamente «no depende de $m$» y concluir por la caracterización 3, nombrando las dos hipótesis usadas.
4. **Cerrar con la definición.** $\Pr[C{=}c] = \sum_m \Pr[M{=}m]\,\Pr[C{=}c \mid M{=}m]$ da ese mismo valor común; Bayes da $\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$. Escribir «para toda distribución de $M$».
5. **Si no hay: un contraejemplo.** Escribir la relación sin clave ($c_j - c_{j+l} = m_j - m_{j+l}$) y sacar de ella un $m$, un $m'$ y un $c$ con $\Pr[C{=}c \mid M{=}m] = 0 \ne \Pr[C{=}c \mid M{=}m'] > 0$; o el conteo $\lvert\mathcal{K}\rvert < \lvert\mathcal{M}\rvert$. Con una violación alcanza; no hace falta medir cuánto se filtra.
6. **Enunciar las condiciones sobre los parámetros.** Clave al menos tan larga como el mensaje ($l \ge n$, es decir $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$), uniforme, independiente del mensaje y de un solo uso. Nombrar a Shannon y decir que, con esas condiciones, el esquema es el One Time Pad sobre el grupo que corresponda.
7. **Si la consigna pregunta por el atacante**, traducir: hay secreto perfecto, luego $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1] = \tfrac12$ para todo $A$; el criptograma no le da ninguna ventaja sobre adivinar sin verlo.

## Plantilla de respuesta

1. **Modelo.** «Espacios \<M, K, C con sus tamaños\>. $K$ uniforme, $\Pr[K{=}k] = 1/\lvert\mathcal{K}\rvert$, elegida independientemente de $M$. Cifrado: $c =$ \<forma simple\>; corrección: $D_k(E_k(m)) = m$.»
2. **Condicionales.** «Fijado $m$, $C = c$ ocurre para las claves \<cuáles\>; luego $\Pr[C{=}c \mid M{=}m] =$ \<cantidad\> $/\lvert\mathcal{K}\rvert =$ \<valor\>, para todo $m$ y todo $c$.»
3. **Veredicto.** «$\Pr[C{=}c \mid M{=}m] = \Pr[C{=}c \mid M{=}m']$ para todo $m, m', c$: hay secreto perfecto, para toda distribución de $M$. Cierre: $\Pr[C{=}c] =$ \<valor\> y $\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m]$.» O bien: «para $m =$ \<…\>, $m' =$ \<…\> y $c =$ \<…\>, $\Pr[C{=}c \mid M{=}m] =$ \<valor\> $\ne$ \<valor\> $= \Pr[C{=}c \mid M{=}m']$: no hay secreto perfecto.»
4. **Condiciones.** «\<l ≥ n\>, es decir $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ (Shannon); clave uniforme, independiente del mensaje, de un solo uso. Es el One Time Pad sobre \<grupo\>.»

**Ejemplo mínimo resuelto** (el esquema de juguete de la Práctica 2): $\mathcal{K} = \{k_0, k_1\}$ equiprobables, $\mathcal{M} = \{m_0, m_1\}$ con $\Pr[M{=}m_0] = 0{,}7$ y $\Pr[M{=}m_1] = 0{,}3$, $\mathcal{C} = \{1, 2\}$ y la tabla de cifrado

| $E_k(m)$ | $k_0$ | $k_1$ |
|---|---|---|
| $m_0$ | 1 | 2 |
| $m_1$ | 2 | 1 |

*Modelo.* $K$ uniforme, $\Pr[K{=}k_0] = \Pr[K{=}k_1] = \tfrac12$, independiente de $M$; $\lvert\mathcal{K}\rvert = \lvert\mathcal{M}\rvert = 2$.
*Condicionales.* En la fila $m_0$ el $1$ sale solo con $k_0$ y el $2$ solo con $k_1$; en la fila $m_1$, al revés. Cada casilla tiene una única clave, así que $\Pr[C{=}1 \mid M{=}m_0] = \Pr[K{=}k_0] = \tfrac12$, $\Pr[C{=}1 \mid M{=}m_1] = \Pr[K{=}k_1] = \tfrac12$, y lo mismo con $c = 2$.
*Veredicto.* Las dos filas coinciden: $\Pr[C{=}c \mid M{=}m_0] = \Pr[C{=}c \mid M{=}m_1] = \tfrac12$ para $c = 1, 2$. Hay secreto perfecto, para toda distribución de $M$. Cierre: $\Pr[C{=}1] = 0{,}7\cdot\tfrac12 + 0{,}3\cdot\tfrac12 = \tfrac12$ y $\Pr[M{=}m_0 \mid C{=}1] = \dfrac{\tfrac12\cdot 0{,}7}{\tfrac12} = 0{,}7 = \Pr[M{=}m_0]$; el $0{,}7$ entra y sale sin tocar nada.
*Condiciones.* $\lvert\mathcal{K}\rvert = 2 = \lvert\mathcal{M}\rvert$, clave uniforme, una clave por mensaje. La tabla no repite valores en ninguna fila ni columna: es el OTP de un bit, con $m_0, 1 \mapsto 0$ y $m_1, 2 \mapsto 1$.

## Trampas

- **Verificar la definición con la distribución de mensajes del enunciado y concluir.** La definición pide toda distribución; con un $\Pr[M{=}\cdot]$ fijo no se certifica nada. Se demuestra con la caracterización 3, que no mira $\Pr[M{=}\cdot]$, y el $0{,}9$ o el $0{,}7$ se usa solo en el cierre.
- **Confundir «mensaje uniforme» con «clave uniforme».** El mensaje puede estar tan sesgado como se quiera; la que debe ser uniforme, y está en la hipótesis, es la clave. Un esquema con secreto perfecto y mensajes $0{,}7 / 0{,}3$ es perfectamente normal.
- **Un solo par $(m, c)$ para demostrar.** El caso afirmativo exige todos los pares, o un argumento general («exactamente una clave por par, luego $1/\lvert\mathcal{K}\rvert$ siempre»); el caso negativo se cierra con uno solo.
- **Tomar $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ como suficiente.** Es solo necesaria: con claves suficientes pero mal repartidas, o con clave sesgada, el criptograma sigue filtrando. Lo suficiente es la cuenta de la caracterización 3.
- **Olvidar las hipótesis.** Sin «clave uniforme e independiente del mensaje», $\Pr[C{=}c \mid M{=}m]$ no es la masa de claves que llevan $m$ a $c$ y la cuenta no vale. Se escriben antes de la primera fórmula.
- **La clave más larga que el mensaje no molesta; la más corta lo rompe.** Con $l > n$ sobran símbolos de clave que no se usan y cada par $(m, c)$ tiene $26^{\,l-n}$ claves, todos los pares por igual; con $l < n$ se repite un símbolo y aparece $c_j - c_{j+l} = m_j - m_{j+l}$.
- **Condicionar sobre un criptograma imposible.** La definición pide $\Pr[C{=}c] > 0$; un $c$ que no puede aparecer no cuenta como contraejemplo.
- **Escribir $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{C}\rvert$ por $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$.** En estos esquemas $\lvert\mathcal{M}\rvert = \lvert\mathcal{C}\rvert$ y da lo mismo; la forma general del teorema es con $\mathcal{M}$.

## Para profundizar

- [[1p-secreto-perfecto-en-parciales-viejos|Secreto perfecto en los parciales viejos]] — los ejercicios de este tipo que ya se tomaron, con enunciado completo, respuesta modelo y tips.
- [[primer-parcial|Primer parcial]] — el hub de la sección, con la tabla de los siete tipos y el orden sugerido.
- [[secreto-perfecto|Secreto perfecto]]: la definición, la caracterización equivalente, el teorema de Shannon con su ejemplo de «necesario pero no suficiente» y el cifrado por rotación demostrado en los dos sentidos.
- [[one-time-pad|One Time Pad]]: la demostración completa de la clase (lema del criptograma uniforme y cierre por Bayes), las tres malas noticias y el ejercicio con clave sesgada resuelto con números.
- [[modelo-probabilistico-de-un-criptosistema|Modelo probabilístico de un criptosistema]]: de dónde salen las tres fórmulas, la hipótesis de independencia y por qué se verifica la condicional y no la a posteriori.
- [[practica-02-videos|Práctica 02 — Videos]]: un mismo esquema de juguete verificado por las cuatro caracterizaciones, incluido el experimento eav con la tabla de casos.
- [[cifrado-de-vigenere|Cifrado de Vigenère]]: la definición formal con el índice $((i-1) \bmod t) + 1$ y por qué la clave repetida se rompe bloque por bloque.
- [[probabilidad-y-criptografia|Probabilidad y criptografía]]: los dos ejemplos numéricos del apunte, uno que cumple y uno que no, con las cuentas de Bayes completas.
- [[clase-01-introduccion-y-criptografia-clasica|Clase 01 — Introducción y criptografía clásica]]: la clase donde se define el secreto perfecto y se enuncia la cota de Shannon.
