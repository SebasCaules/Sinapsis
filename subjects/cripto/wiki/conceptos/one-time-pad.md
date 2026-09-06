---
title: One Time Pad
resumen: 'Cifrado de Vernam: el mensaje se xorea con una clave aleatoria de su mismo largo. Es el testigo de que el secreto perfecto existe y, por el resultado de reducibilidad, esencialmente el único esquema que lo alcanza.'
fuentes: ["[[clase-02-cifrado]]", "[[secreto-perfecto]]"]
aliases: [One Time Pad, One-time pad, OTP, Cifrado de Vernam, Libreta de un solo uso]
type: concepto
unidad: 1
clase: 2
orden: 1
created: 2026-08-21
updated: 2026-08-24
tags: [criptografia, one-time-pad, secreto-perfecto, xor, vernam, clase-02]
sources: [Clase 02 - Criptografia - Cifrado.pdf]
---

# One Time Pad

El **testigo de que el [[secreto-perfecto|secreto perfecto]] existe**: la definición de la Clase 01 no es vacía, hay un esquema que la cumple. Y, como muestra el resultado de reducibilidad al final de esta nota, es **esencialmente el único**.

---

## Definición

Atribuido a **Vernam (1917)**. Con $M = K = C = \{0,1\}^{n}$:

$$\begin{aligned}
\mathsf{Gen} &: k \leftarrow \{0,1\}^n,\quad n = \lvert m\rvert &&\quad \text{(uniforme)}\\
\mathsf{Enc} &: e_k(m) = m \oplus k\\
\mathsf{Dec} &: d_k(c) = c \oplus k
\end{aligned}$$

**Corrección:** $d_k(e_k(m)) = (m \oplus k) \oplus k = m \oplus (k \oplus k) = m \oplus 0 = m$. Sale sola porque $\oplus$ es su propia inversa — el mismo argumento de grupo que hace correcto al [[cifrado-por-rotacion|cifrado por rotación]], acá sobre $(\mathbb{Z}_2^{\,n}, \oplus)$ en lugar de $(\mathbb{Z}_n, +)$.

### Ejemplo de la filmina

$$\begin{array}{rl}
m = & \texttt{00101101000101110}\\
k = & \texttt{01100111010011010}\\ \hline
c = & \texttt{01001010010110100}
\end{array}$$

*(verificado bit a bit)*

> **Errata de la filmina:** dice *"Atribuido a **Verman** (1917)"*. Es **Gilbert Vernam**.

---

## El OTP tiene secreto perfecto

La demostración de la clase, en dos partes. Notación de las filminas: $N = 2^{n} = \lvert K\rvert$.

> **Otra errata:** las filminas escriben $\lvert k\rvert = 2^{n} = N$. Debería ser $\lvert K\rvert$ — es el tamaño del **espacio** de claves, no la longitud de una clave (que es $n$).

### Lema 1 — la distribución del criptograma es uniforme

$$P(C=c) = \sum_k P(C = c \cap K = k)$$

Y para cada término, usando que **$k$ y $m$ se eligen independientemente**:

$$P(C = c \cap K = k) = P(M = c \oplus k \cap K = k) = P(M = c \oplus k)\cdot P(K=k) = P(M = c\oplus k)\cdot \tfrac{1}{N}$$
Luego

$$P(C=c) = \frac{1}{N}\sum_k P(M = c\oplus k) = \frac{1}{N}$$

porque al recorrer todas las claves $k$, el valor $c \oplus k$ **recorre todos los mensajes exactamente una vez**, y la suma de sus probabilidades da 1.

> **El paso que hay que entender.** $k \mapsto c \oplus k$ es una **biyección** de $K$ en $M$. Eso es lo único que se usa, y es lo que hace que la demostración no dependa de *cómo* estén distribuidos los mensajes: por eso vale para **toda** distribución sobre $M$, como exige la definición.

### Parte 2 — de ahí sale la definición, vía Bayes

$$P(M=m \mid C=c)\cdot P(C=c) = P(C=c \cap M=m) = P(K = c\oplus m \cap M = m) = P(K=c\oplus m)\cdot P(M=m)$$

Sustituyendo $P(C{=}c) = 1/N$ (Lema 1) y $P(K = c \oplus m) = 1/N$ (clave uniforme):

$$P(M=m\mid C=c)\cdot \tfrac{1}{N} = \tfrac{1}{N}\cdot P(M=m) \quad\Longrightarrow\quad \boxed{P(M=m \mid C=c) = P(M=m)}$$

> Nótese que los dos $1/N$ **se cancelan**: uno viene de que la clave es uniforme, el otro de que el criptograma resulta uniforme. Si la clave no fuera uniforme, ninguno de los dos valdría — que es exactamente lo que muestra el ejercicio de más abajo.

---

## Las malas noticias

Las tres limitaciones, tal como las lista la filmina:

### 1. Secreto perfecto ⇒ |K| ≥ |C|

La cota de Shannon. La clave tiene que ser **tan larga como el mensaje**, y hay que distribuirla de antemano por un canal seguro — el problema circular que hace impracticable al OTP.

> La [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] y Katz & Lindell enuncian la cota como $\lvert K\rvert \ge \lvert M\rvert$; esta filmina la escribe $\lvert K\rvert \ge \lvert C\rvert$. En el OTP $\lvert M\rvert = \lvert C\rvert = 2^{n}$, así que ambas dicen lo mismo acá. La versión con $\lvert M\rvert$ es la general — ver [[secreto-perfecto#Teorema de Shannon (cota de claves)|secreto perfecto]].

### 2. Reutilizar la clave lo destruye

$$\begin{aligned}
c_1 &= m_1 \oplus k\\
c_2 &= m_2 \oplus k\\
\Longrightarrow\quad c_1 \oplus c_2 &= m_1 \oplus m_2
\end{aligned}$$

La clave **se cancela**. El adversario se queda con el xor de los dos textos planos, que en lenguaje natural alcanza para separarlos. **De ahí el "One Time"**: el nombre es la advertencia.

> Este mismo cálculo, con $k$ reemplazado por $G(s)$, es lo que hace que los [[criptosistema-de-flujo|criptosistemas de flujo]] fallen la prueba `Mul`. La filmina lo marca: *"¿Similar al problema del One Time Pad con reuso de claves? ¡No es casualidad!"*.

### 3. La clave DEBE ser aleatoria

Y la filmina pregunta: *¿cómo puede garantizarse esto?* La respuesta —una vez que se abandona el secreto perfecto— es el [[generador-pseudoaleatorio|generador pseudoaleatorio]].

---

## Ejercicio: qué pasa si la clave no es aleatoria

Es el ejercicio de la clase, y es el que **muestra el mecanismo de la fuga**.

**Datos.** Clave sesgada y mensaje no uniforme, sobre 2 bits:

| | $00$ | $01$ | $10$ | $11$ |
|---|---|---|---|---|
| $P(K = k)$ | 0,3 | 0,1 | **0,4** | 0,2 |
| $P(M = m)$ | **0,60** | 0,15 | 0,10 | 0,15 |

**Pregunta.** Se observa $C = 01$. ¿Cuánto vale $P(M = 00 \mid C = 01)$?

**Paso 1 — la marginal del criptograma.** Ya no es uniforme:

$$P(C{=}01) = \sum_k P(M = 01\oplus k)\,P(K=k)$$

$$= P(M{=}01)P(K{=}00) + P(M{=}00)P(K{=}01) + P(M{=}11)P(K{=}10) + P(M{=}10)P(K{=}11)$$

$$= 0{,}15\cdot0{,}3 + 0{,}6\cdot0{,}1 + 0{,}15\cdot0{,}4 + 0{,}1\cdot0{,}2 = \mathbf{0{,}185}$$

**Paso 2 — la condicional directa.** $P(C{=}01 \mid M{=}00) = P(K = 01 \oplus 00) = P(K = 01) = 0{,}1$.

**Paso 3 — Bayes.**

$$P(M{=}00 \mid C{=}01) = \frac{0{,}1 \cdot 0{,}6}{0{,}185} = \mathbf{0{,}32} \neq 0{,}60 = P(M{=}00)$$

**No hay secreto perfecto.**

> **Errata de la filmina** en el paso 2: escribe $P(C{=}01 \mid M{=}00) = P(K = 01 * M \mid M = 00)$. El $*$ es un $\oplus$ mal renderizado — debe leerse $P(K = 01 \oplus M \mid M = 00)$.

### La tabla completa (desarrollo nuestro)

La filmina calcula sólo $m = 00$. Las cuatro posteriores dado $C = 01$ cuentan mejor la historia:

| $m$ | a priori $P(M{=}m)$ | a posteriori $P(M{=}m \mid C{=}01)$ | efecto |
|---|---|---|---|
| $00$ | 0,600 | **0,324** | se derrumba |
| $01$ | 0,150 | 0,243 | |
| $10$ | 0,100 | 0,108 | ≈ |
| $11$ | 0,150 | **0,324** | |

El criptograma no sólo movió las probabilidades: **empató a $11$ con $00$**, cuando a priori $00$ era cuatro veces más probable. Un adversario que antes apostaba $00$ con confianza ahora tiene dos candidatos igual de buenos —y eso es información, que es justo lo que el secreto perfecto prohíbe.

**De dónde sale la fuga:** $P(K = 10) = 0{,}4$ es el doble de lo que le tocaría en una uniforme. El criptograma $01$ es más "compatible" con los mensajes que se alcanzan vía $k = 10$ (o sea $m = 11$), y eso los premia. El sesgo de la clave se **traduce** en sesgo de la posteriori.

> Comparar con el [[probabilidad-y-criptografia|Ejemplo 2 de Probabilidad y criptografía]]: ahí también se cumple la cota de conteo y aun así hay fuga. **Contar claves no alcanza — importa cómo están repartidas.**

---

## Más allá del OTP

Dos resultados que la clase enuncia sin demostrar:

> - Cualquier criptosistema con secreto perfecto es **reducible al OTP**.
> - Cualquier sistema que **no** sea reducible al OTP **no** posee secreto perfecto.

**Consecuencia.** El secreto perfecto es *demasiado impráctico* y **no hay alternativa**: no es que falten construcciones eficientes, es que toda construcción perfectamente secreta *es* un OTP disfrazado, y hereda sus tres problemas. Por eso el camino no es buscar mejores esquemas sino **cambiar la definición de seguridad** → [[seguridad-computacional|seguridad computacional]].

> **Cómo leerlo.** Es el mismo movimiento que la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] hizo con los cifrados clásicos, pero al revés. Allá se rompieron los esquemas hasta que hizo falta una definición rigurosa; acá la definición rigurosa se cumple perfectamente y lo que se rompe es su **costo**. En los dos casos el resultado es el mismo: hay que refundar la noción de seguridad.

## Ver también

- [[secreto-perfecto|Secreto perfecto]] — la definición que el OTP alcanza, y la cota de Shannon
- [[modelo-probabilistico-de-un-criptosistema|Modelo probabilístico de un criptosistema]] — de dónde salen $P(C{=}y)$ y $P(C{=}y \mid M{=}x)$
- [[probabilidad-y-criptografia|Probabilidad y criptografía]] — más ejemplos numéricos del mismo tipo
- [[criptosistema-de-flujo|Criptosistema de flujo]] — el OTP con la clave reemplazada por $G(k)$
- [[seguridad-computacional|Seguridad computacional]] — a dónde lleva la impracticabilidad del OTP
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
- Katz & Lindell §2.2 *The One-Time Pad* ([[bibliografia|bibliografía]])
