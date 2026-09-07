---
title: Guía 1 — Criptografía Clásica
resumen: 'Guía del 10/08 sobre criptografía clásica, con enunciado y resolución en la misma página: ocho ejercicios de definiciones formales, rotación, sustitución, Vigenère, Kasiski, transposición y ataque de texto plano elegido, cada uno con su resolución verificada en un recuadro plegado.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]"]
aliases: [Guía 1, Guia 1, Resolución Guía 1, Guia 1 resolucion, Soluciones Guía 1]
type: guia
clase: 1
orden: 21
guia: 1
fecha: 2026-08-10
created: 2026-08-10
updated: 2026-09-06
tags: [guia, resolucion, criptografia-clasica, rotacion, vigenere, sustitucion, transposicion, kasiski, frecuencias]
sources: ["raw/guias/guia1/Guia 1 - Criptografía Clásica.pdf", "raw/guias/guia1/Resolucion Guia 1.md", "raw/guias/guia1/G1-Ej3.py", "raw/guias/guia1/G1-Ej6-kasiski.py", "raw/guias/guia1/Guia 1 - Criptografía Clásica - Soluciones.pdf"]
---

# Guía 1 — Criptografía Clásica

> **10/08/2026** · [Enunciado](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica.pdf) · [Apuntes crudos](../../raw/guias/guia1/Resolucion%20Guia%201.md) · [Soluciones de la cátedra](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica%20-%20Soluciones.pdf) · Teoría: [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] · Práctica del mismo día: [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]]

Esta página reúne **el enunciado de la Guía 1 y las cuentas hechas**: el desplazamiento del Ej. 3 reconstruido símbolo por símbolo, el Vigenère del Ej. 4 con la aritmética modular a la vista, el criterio que clasifica los tres criptogramas del Ej. 5, el Kasiski del Ej. 6 corrido de verdad y el conteo de fuerza bruta del Ej. 7 bien contado. Debajo de cada enunciado, la resolución va en un **recuadro plegado** que se abre con un clic: así se puede intentar el ejercicio antes de ver la respuesta. Cada resolución arranca con el resumen en cursiva de su consigna.

Es el bloque de **criptografía clásica** que entra en el **Parcial 1 (24/09)**. La guía recorre las tres familias del árbol de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] —rotación, sustitución, transposición— y las ataca por la vía que le cuelga a cada rama.

## Tablero de estado

*Estado al 24/08.* Leyenda: **resuelto** (desarrollado y verificado en el recuadro de resolución del ejercicio) · **en curso** (empezado pero sin cerrar) · **pendiente** (sin empezar).

| # | Tema | Concepto que aplica | Estado |
|---|---|---|---|
| 1 | Definiciones formales `Gen`/`Enc`/`Dec` | [[criptosistema\|Criptosistema]] | resuelto |
| 2 | Composición de dos sustituciones simples | [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] | en curso |
| 3 | Descifrar criptograma de rotación (castellano, 27) | [[cifrado-por-rotacion\|Rotación]] · [[criptoanalisis-por-frecuencias\|Frecuencias]] · [[ataque-de-fuerza-bruta\|Fuerza bruta]] | resuelto |
| 4 | Vigenère: cifrar modular · elección de clave · composición | [[cifrado-de-vigenere\|Vigenère]] | resuelto |
| 5 | Clasificar 3 criptogramas por tipo de técnica | [[criptoanalisis-por-frecuencias\|Frecuencias]] · [[indice-de-coincidencia\|Índice de coincidencia]] · [[cifrado-por-transposicion\|Transposición]] | resuelto |
| 6 | Kasiski: longitud de clave y clave de un Vigenère | [[test-de-kasiski\|Test de Kasiski]] · [[indice-de-coincidencia\|Índice de coincidencia]] | en curso |
| 7 | Transposición por columnas + rotación: estrategia y costo | [[cifrado-por-transposicion\|Transposición]] · [[ataque-de-fuerza-bruta\|Fuerza bruta]] | resuelto |
| 8 | Chosen-plaintext attack sobre sustitución y Vigenère | [[modelos-de-ataque\|Modelos de ataque]] | pendiente |

Qué falta en los dos **en curso**: el **Ej. 2** tiene el argumento de grupo escrito pero le falta el ejemplo concreto que pide la consigna; el **Ej. 6** ya tiene la [[#Script de Kasiski|herramienta]] corrida, la [[#Ejercicio 6|longitud de clave]] comprobada ($t = 4$) y la clave `JUAN` obtenida, y le falta el índice de coincidencia sobre los cuatro sub-textos —que es lo que pide el verbo *comprobar* del ítem (a)—, generalizar el script a esos cuatro sub-textos y volcar el desarrollo al crudo.

> [!nota]- Estado al 24/08 de la resolución
> Ej. 1, 3, 4, 5 y 7 **resueltos y verificados** · Ej. 2 y 6 **en curso** — el 2 tiene escrito el argumento de grupo y le falta el ejemplo concreto que pide la consigna; el 6 tiene la herramienta corrida, la longitud de clave comprobada y la clave obtenida, pero **sin volcar al crudo** · Ej. 8 **pendiente** (no hay nada en el crudo). Ver el [[#Tablero de estado|tablero]].

> [!nota]- Nota de método
> Este apunte **verifica** todo lo que el [crudo](../../raw/guias/guia1/Resolucion%20Guia%201.md) anotó de forma telegráfica, en vez de copiarlo. Donde la cuenta del crudo no da, la discrepancia queda marcada en un recuadro **Discrepancia con el crudo** y se escribe el resultado verificado. El [PDF de soluciones de la cátedra](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica%20-%20Soluciones.pdf) —que llegó al vault el 24/08— se usa como tercer control.

---

## Ejercicios

### Ejercicio 1

Dar una **definición formal** de los algoritmos `Gen`, `Enc` y `Dec` para los siguientes esquemas:

- Cifrado de rotación
- Cifrado de sustitución monoalfabética
- Cifrado de Vigenère

> [!nota]- Resolución del Ejercicio 1
> *Definición formal de `Gen`, `Enc`, `Dec` para rotación, sustitución monoalfabética y Vigenère.*
>
> ![Enunciado Ej. 1](../../assets/Pasted%20image%2020260810124920.png)
>
> **Desarrollo completo del caso rotación** —espacios $K$/$M$/$C$, [[cifrado-por-rotacion#Formulación equivalente|formulación por permutaciones]], [[cifrado-por-rotacion#Corrección|demostración de corrección]] y [[cifrado-por-rotacion#Criptoanálisis|análisis de seguridad]]—: [[cifrado-por-rotacion|Cifrado por rotación]]. Acá abajo va sólo el resumen operativo de los tres esquemas.
>
> En todos los casos el alfabeto es $\Sigma$ con $n = \lvert\Sigma\rvert$, y se identifica cada letra con su índice vía el orden alfabético. La aritmética es en $\mathbb{Z}_n$. Este ejercicio se escribe sobre el **inglés de 26** —es lo que usan las filminas, Katz y la solución de la cátedra—; del Ej. 3 en adelante la guía pasa al **castellano de 27**, y hay que decir cuál se está usando.
>
> #### Cifrado de rotación
>
> $$
> \begin{aligned}
> \mathsf{Gen}():&\quad k \xleftarrow{\$} \{0,\dots,25\} \quad\text{(uniforme)}\\
> \mathsf{Enc}_k(m_1\cdots m_r) &= c_1\cdots c_r,\quad c_i = (m_i + k) \bmod 26\\
> \mathsf{Dec}_k(c_1\cdots c_r) &= m_1\cdots m_r,\quad m_i = (c_i - k) \bmod 26
> \end{aligned}
> $$
>
> → [[cifrado-por-rotacion|Cifrado por rotación]]
>
> #### Cifrado de sustitución monoalfabética
>
> $$
> \begin{aligned}
> \mathsf{Gen}():&\quad k = \pi \xleftarrow{\$} S_{26}\quad\text{(una de las } 26!\ \text{permutaciones de } \{0,\dots,25\})\\
> \mathsf{Enc}_k(m_1\cdots m_r) &= c_1\cdots c_r,\quad c_i = \pi(m_i)\\
> \mathsf{Dec}_k(c_1\cdots c_r) &= m_1\cdots m_r,\quad m_i = \pi^{-1}(c_i)
> \end{aligned}
> $$
>
> La inversa $\pi^{-1}$ **existe siempre** por ser $\pi$ biyectiva: ahí está la corrección, y es el mismo hecho que resuelve el Ej. 2.
>
> → [[cifrado-de-sustitucion-monoalfabetica|Sustitución monoalfabética]]
>
> #### Cifrado de Vigenère
>
> $$
> \begin{aligned}
> \mathsf{Gen}():&\quad k = k_1 k_2 \cdots k_t,\quad k_i \xleftarrow{\$} \{0,\dots,25\},\ t \ge 1\\
> \mathsf{Enc}_k(m_1\cdots m_r) &= c_1\cdots c_r,\quad c_i = \big(m_i + k_{((i-1) \bmod t)+1}\big) \bmod 26\\
> \mathsf{Dec}_k(c_1\cdots c_r) &= m_1\cdots m_r,\quad m_i = \big(c_i - k_{((i-1) \bmod t)+1}\big) \bmod 26
> \end{aligned}
> $$
>
> El índice cíclico $((i-1) \bmod t)+1$ es todo el esquema: dice que la posición $i$ del mensaje se cifra con la letra $((i-1)\bmod t)+1$ de la clave, o sea que el mensaje se parte en $t$ sub-textos y cada uno recibe **su propia rotación**. Esa factorización es la que después lo mata (Ej. 6).
>
> → [[cifrado-de-vigenere|Cifrado de Vigenère]]
>
> **Chequeo antes de entregar:** la consigna pide *definición formal*, así que además de los tres algoritmos conviene explicitar los tres espacios ($K$, $M$, $C$) y la **condición de corrección** $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$. Para rotación está escrita en [[cifrado-por-rotacion#Definición formal|Cifrado por rotación]]; para sustitución monoalfabética y Vigenère falta escribirla.
>
> **Detalle de la solución de la cátedra:** para Vigenère aclara que, para que $\lvert K\rvert$ sea **finito**, hay que acotar el largo de la clave (por ejemplo $t \le L$ con $L$ el largo del texto plano) — si no, $K = \Sigma^{+}$ es infinito y `Gen` no puede ser uniforme. Es una precisión que el enunciado no pide pero que cierra la definición.

### Ejercicio 2

¿Por qué la **composición de dos sistemas de sustitución simple** no provee más seguridad que el uso de uno solo? Ejemplificar.

> [!nota]- Resolución del Ejercicio 2
> *¿Por qué la composición de dos sistemas de sustitución simple no provee más seguridad que el uso de uno solo? Ejemplificar.*
>
> ![Enunciado Ej. 2](../../assets/Pasted%20image%2020260810175131.png)
>
> **Estado: en curso.** El argumento de grupo está escrito; falta el ejemplo concreto que pide la consigna. (En el crudo está sólo el enunciado: lo que sigue se escribió acá.)
>
> La dirección es mirar el conjunto de claves como **grupo bajo composición**. La composición de biyecciones es biyectiva, y $S_n$ contiene **todas** las permutaciones de $\Sigma$, así que $\pi_2 \circ \pi_1 \in S_n$ es otra clave del mismo espacio:
>
> $$\forall m \in \Sigma:\quad \pi_2\big(\pi_1(m)\big) = (\pi_2 \circ \pi_1)(m) = \pi_3(m),\qquad \pi_3 \in S_n$$
>
> Cifrar dos veces no agranda el espacio de claves: se sigue estando dentro de las mismas $n!$ permutaciones. El argumento completo está en [[cifrado-de-sustitucion-monoalfabetica#Composición|Sustitución monoalfabética § Composición]], y es exactamente el que usa la cátedra en su solución.
>
> **Falta el ejemplo concreto** que pide la consigna: dos permutaciones chicas escritas en extenso y la tercera que sale de componerlas. Es la única pieza que hay que agregar.

### Ejercicio 3

Descifrar el siguiente criptograma, sabiendo que fue encriptado usando el **cifrado de rotación**, que se corresponde a un texto en **español (27 letras)** y los espacios fueron suprimidos. ¿Cuál fue la estrategia que utilizaste?

```
VKXYKBKXGKSGWAKQQGYIUYGYWAKXKGQRKSZKJKYKKYIUSYKMAÑX
```

> [!nota]- Resolución del Ejercicio 3
> *Descifrar el criptograma sabiendo que es rotación, texto en castellano (27 letras) y con los espacios suprimidos. ¿Cuál fue la estrategia?*
>
> ![Enunciado Ej. 3](../../assets/Pasted%20image%2020260810194101.png)
>
> ```
> VKXYKBKXGKSGWAKQQGYIUYGYWAKXKGQRKSZKJKYKKYIUSYKMAÑX
> ```
>
> **Resuelto: $k = 6$.**
>
> $$\boxed{\texttt{PERSEVERA\ EN\ AQUELLAS\ COSAS\ QUE\ REALMENTE\ DESEES\ CONSEGUIR}}$$
>
> #### La estrategia: frecuencias, no fuerza bruta
>
> Con $\lvert K\rvert = 27$ la [[ataque-de-fuerza-bruta|fuerza bruta]] sirve —27 descifrados y listo—, pero es **más caro que pensar**. El [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]] llega en **un solo intento**, porque la rotación conserva la distribución de frecuencias *corrida $k$ lugares*: el pico del criptograma tiene que ser el pico del castellano desplazado.
>
> Contando con [[#Script de frecuencias|G1-Ej3.py]] sobre el criptograma:
>
> ![Frecuencias del criptograma del Ej. 3](../../assets/Pasted%20image%2020260821144731.png)
>
> | Letra | Cant. | Frec. |
> |---|---|---|
> | K | 13 | 25,49 % |
> | Y | 7 | 13,73 % |
> | G | 5 | 9,80 % |
> | X | 4 | 7,84 % |
> | S · A · Q | 3 | 5,88 % |
>
> La $\texttt{K}$ se lleva **13 de 51 símbolos**, un 25 % — más del doble que cualquier otra. En castellano la letra más frecuente es la $\texttt{E}$ (≈ 13 %; ver la [[criptoanalisis-por-frecuencias#Tabla de frecuencias del castellano|tabla completa]]). Alineando pico con pico sobre el [[cifrado-por-rotacion#Ejemplos|alfabeto de 27]]:
>
> $$k \;=\; \sigma(\texttt{K}) - \sigma(\texttt{E}) \;=\; 10 - 4 \;=\; \mathbf{6}$$
>
> Que la $\texttt{K}$ esté al 25 % y no al 13 % no es un problema: el texto es corto (51 letras), así que las frecuencias son ruidosas. Lo que importa es que **sea el pico**, no que pegue el porcentaje.
>
> #### Verificación símbolo por símbolo
>
> $m_i = (c_i - 6) \bmod 27$. Los primeros doce, que ya alcanzan para reconocer la frase:
>
> | $c_i$ | V | K | X | Y | K | B | K | X | G | K | S | G |
> |---|---|---|---|---|---|---|---|---|---|---|---|---|
> | $\sigma(c_i)$ | 22 | 10 | 24 | 25 | 10 | 1 | 10 | 24 | 6 | 10 | 19 | 6 |
> | $\sigma(c_i)-6$ | 16 | 4 | 18 | 19 | 4 | $-5$ | 4 | 18 | 0 | 4 | 13 | 0 |
> | $\bmod\ 27$ | 16 | 4 | 18 | 19 | 4 | **22** | 4 | 18 | 0 | 4 | 13 | 0 |
> | $m_i$ | P | E | R | S | E | V | E | R | A | E | N | A |
>
> La sexta columna es la interesante: $1 - 6 = -5$ y el módulo lo devuelve a $22 = \texttt{V}$. Es el único lugar donde la cuenta "da vuelta" en este tramo, y es donde se equivoca todo el mundo si resta a mano.
>
> El criptograma completo descifrado con $k = 6$:
>
> ```
> PERSEVERAENAQUELLASCOSASQUEREALMENTEDESEESCONSEGUIR
> ```
>
> **Control en sentido inverso:** volviendo a cifrar ese texto plano con $k=6$ se reobtiene el criptograma **letra por letra, los 51 símbolos**. Eso es lo que cierra la verificación — descifrar y que "parezca español" no alcanza como prueba.
>
> **La `Ñ` no es decoración.** El criptograma trae `MAÑX` cerca del final. En el alfabeto de 27 la `Ñ` vale $14$, y $14 - 6 = 8 = \texttt{I}$, que es la `I` de `CONSEGUIR`. Con el alfabeto inglés de 26 ese símbolo directamente no existe: **la presencia de la `Ñ` confirma que hay que trabajar en $\mathbb{Z}_{27}$**, tal como dice el enunciado.
>
> **Ojo con la solución de la cátedra.** Su texto plano sigue: *"…CONSEGUIR PORQUE SI ES ASI LO CONSEGUIRAS"*. Esa continuación **no está en el criptograma del enunciado**: 51 símbolos alcanzan justo hasta `CONSEGUIR`. La cátedra parece estar citando la frase original completa, no el descifrado de lo que da a descifrar. Coincide con nosotros en lo que sí importa —la clave 6 y el mismo razonamiento del pico al 25 %—. *(Lectura nuestra de la diferencia, no una errata declarada.)*

### Ejercicio 4

**a)** Cifrar según Vigenère el mensaje $M = \texttt{UN\ VINO\ DE\ MESA}$ con la clave $K = \texttt{BACO}$, **sin usar la tabla**, sólo con operaciones modulares.

**b)** En un sistema de cifra de Vigenère la clave a usar puede ser `CERO` o bien `COMPADRE`. ¿Cuál de las dos conviene usar y por qué?

**c)** Mostrar, con un ejemplo, que la **composición de dos cifrados Vigenère** resulta en otro cifrado Vigenère.

> [!nota]- Resolución del Ejercicio 4
> *a) Cifrar `UN VINO DE MESA` con $K = \texttt{BACO}$ sólo con operaciones modulares · b) `CERO` vs `COMPADRE` · c) composición de dos Vigenère.*
>
> ![Enunciado Ej. 4](../../assets/Pasted%20image%2020260821145006.png)
> ![Enunciado Ej. 4 (cont.)](../../assets/Pasted%20image%2020260821145315.png)
>
> #### a) Cifrar sin tabla
>
> Alfabeto castellano de **27**, $c_i = (m_i + k_{((i-1)\bmod 4)+1}) \bmod 27$. Índices de la clave: $\texttt{B}=1$, $\texttt{A}=0$, $\texttt{C}=2$, $\texttt{O}=15$.
>
> | $i$ | $m_i$ | $\sigma(m_i)$ | $k$ | $\sigma(k)$ | suma | $\bmod\ 27$ | $c_i$ |
> |---|---|---|---|---|---|---|---|
> | 1 | U | 21 | B | 1 | 22 | 22 | **V** |
> | 2 | N | 13 | A | 0 | 13 | 13 | **N** |
> | 3 | V | 22 | C | 2 | 24 | 24 | **X** |
> | 4 | I | 8 | O | 15 | 23 | 23 | **W** |
> | 5 | N | 13 | B | 1 | 14 | 14 | **Ñ** |
> | 6 | O | 15 | A | 0 | 15 | 15 | **O** |
> | 7 | D | 3 | C | 2 | 5 | 5 | **F** |
> | 8 | E | 4 | O | 15 | 19 | 19 | **S** |
> | 9 | M | 12 | B | 1 | 13 | 13 | **N** |
> | 10 | E | 4 | A | 0 | 4 | 4 | **E** |
> | 11 | S | 19 | C | 2 | 21 | 21 | **U** |
> | 12 | A | 0 | O | 15 | 15 | 15 | **O** |
>
> $$\boxed{C = \texttt{VNXWÑOFSNEUO}}$$
>
> Nótese que **ninguna suma desborda**: el mayor total es 24. Acá el módulo no llega a actuar, lo cual es una buena señal de que no hay error de wrap escondido.
>
> **Discrepancia con el crudo.** El crudo escribe $C = \texttt{VNXVÑOFRNEUÑ}$ y anota la clave como "$1\ 0\ 2\ 14$". El $14$ es el problema: en el **alfabeto castellano de 27** la `Ñ` ocupa la posición 14 y la `O` corre a la **15**; el 14 es el índice de la `O` en el alfabeto **inglés de 26**. O sea: el crudo usó el alfabeto de 27 para el mensaje y la salida (por eso aparece la `Ñ` en el resultado) pero el índice de 26 para la `O` de la clave.
>
> El error es **sistemático, no aleatorio**: difieren exactamente las tres posiciones cifradas con la `O` —la 4, la 8 y la 12— y en todas el símbolo cae **uno antes** del correcto.
>
> | Posición | 4 | 8 | 12 |
> |---|---|---|---|
> | Verificado ($\texttt{O}=15$) | **W** | **S** | **O** |
> | Crudo ($\texttt{O}=14$) | V | R | Ñ |
>
> La [solución de la cátedra](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica%20-%20Soluciones.pdf) da `V N X W Ñ O F S N E U O`, que es lo verificado acá. **El resultado correcto es `VNXWÑOFSNEUO`.**
>
> Moraleja para el parcial: cuando el alfabeto es el de 27, conviene escribir la tabla de índices **antes** de empezar a sumar. Todo lo que está después de la `N` corre un lugar.
>
> #### b) CERO vs COMPADRE
>
> **Conviene `COMPADRE`.** El crudo tiene la intuición correcta —"cuanto más larga la clave, mejor"—; la justificación es esta.
>
> El largo $t$ de la clave se llama **período**, y es lo único que separa a Vigenère de una rotación. El [[cifrado-de-vigenere#Definición formal|índice cíclico]] parte el mensaje en $t$ sub-textos, y **cada sub-texto es un cifrado por rotación independiente**. Atacar Vigenère es (i) descubrir $t$ y (ii) romper $t$ Césares. Entonces:
>
> | Efecto de agrandar $t$ | Por qué |
> |---|---|
> | **Menos texto por sub-texto** | Con $m$ letras, cada sub-texto tiene $m/t$. Con `CERO` ($t=4$) son $m/4$; con `COMPADRE` ($t=8$), $m/8$. El [[criptoanalisis-por-frecuencias\|ataque por frecuencias]] sobre cada sub-texto necesita muestra: a la mitad de muestra, el pico se vuelve estadísticamente dudoso. Es el mismo ruido que ya se vio en el Ej. 3, donde 51 letras dieron un pico del 25 % en vez del 13 %. |
> | **Histograma global más chato** | Se superponen 8 rotaciones distintas en vez de 4, así que el [[indice-de-coincidencia\|índice de coincidencia]] del criptograma baja hacia $1/27 \approx 0{,}0370$ y se aleja del $0{,}0775$ del castellano. Menos señal para el atacante. |
> | **Menos repeticiones útiles** | [[test-de-kasiski\|Kasiski]] vive de secuencias repetidas cuya distancia sea múltiplo de $t$. Cuanto mayor $t$, menos probable es que un mismo trozo de texto vuelva a caer alineado con el mismo trozo de clave. |
> | **Espacio de claves mayor** | $27^4 = 531\,441$ contra $27^8 = 282\,429\,536\,481$. |
>
> Ojo con el orden de importancia: el último renglón es el **argumento más débil**. Un espacio de claves grande es condición **necesaria y no suficiente** —es todo el punto de [[ataque-de-fuerza-bruta#Principio de espacio de claves suficiente|espacio de claves suficiente]]—, y Vigenère no cae por fuerza bruta sino por la factorización en sub-textos. Los tres primeros renglones son los que realmente contestan la pregunta.
>
> **Un chequeo que hay que hacer y acá no muerde.** [[cifrado-de-vigenere#Consecuencias prácticas|Vigenère]] advierte que una clave con **letras repetidas** desperdicia período: dos posiciones con la misma letra producen sub-textos con el mismo corrimiento, y el atacante puede fusionarlos. `CERO` (C, E, R, O) y `COMPADRE` (C, O, M, P, A, D, R, E) **no repiten ninguna letra**, así que las dos aprovechan todo su período y la comparación se decide sólo por el largo: 4 contra 8.
>
> **Hasta dónde llega el argumento.** La cátedra remata: *"si el período pudiera ser del mismo tamaño del mensaje, ¡mejor!, pero eso no sería práctico"*. Ese caso límite —clave tan larga como el mensaje y elegida al azar— **es el [[one-time-pad|One Time Pad]]**, y ahí Vigenère alcanza el [[secreto-perfecto|secreto perfecto]]. El "no sería práctico" es exactamente la tercera mala noticia del OTP. Se retoma en la [[guia-02-criptografia-simetrica#Ejercicio 3|Guía 2, Ej. 3c]].
>
> #### c) Componer dos Vigenère da otro Vigenère
>
> **El argumento.** Cifrar con $k^{(1)}$ y después con $k^{(2)}$, en la posición $i$, es
>
> $$\big((m_i + k^{(1)}_{\,\cdot}) + k^{(2)}_{\,\cdot}\big) \bmod n \;=\; \big(m_i + (k^{(1)}_{\,\cdot} + k^{(2)}_{\,\cdot})\big) \bmod n$$
>
> por **asociatividad de la suma en $\mathbb{Z}_n$**. La suma de las dos letras de clave es otra letra de clave, así que existe una única clave $K$ que hace el trabajo de las dos. No es un truco del ejemplo: es que $(\mathbb{Z}_n, +)$ es un grupo, igual que en el Ej. 2 lo era $(S_n, \circ)$.
>
> **Con claves del mismo largo $t$**, la clave compuesta es $K_j = (k^{(1)}_j + k^{(2)}_j) \bmod n$, también de largo $t$.
>
> **Con largos distintos $p$ y $q$**, hay que repetir cada clave hasta que vuelvan a alinearse: el largo resultante es $\operatorname{mcm}(p, q)$.
>
> $$K'_j \equiv \big(k^{(1)}_{((j-1)\bmod p)+1} + k^{(2)}_{((j-1)\bmod q)+1}\big) \pmod{n},\qquad j = 1,\dots,\operatorname{mcm}(p,q)$$
>
> ##### El ejemplo del crudo, verificado
>
> $M = \texttt{HOLA}$, $k^{(1)} = \texttt{ABCD}$, $k^{(2)} = \texttt{EFGH}$, alfabeto de 27.
>
> | | H (7) | O (15) | L (11) | A (0) |
> |---|---|---|---|---|
> | $+\ k^{(1)}$ | $+\texttt{A}(0)=7$ | $+\texttt{B}(1)=16$ | $+\texttt{C}(2)=13$ | $+\texttt{D}(3)=3$ |
> | $C_1$ | **H** | **P** | **N** | **D** |
> | $+\ k^{(2)}$ | $+\texttt{E}(4)=11$ | $+\texttt{F}(5)=21$ | $+\texttt{G}(6)=19$ | $+\texttt{H}(7)=10$ |
> | $C_2$ | **L** | **U** | **S** | **K** |
>
> Clave compuesta, sumando las dos claves posición a posición:
>
> $$K = \texttt{ABCD} + \texttt{EFGH} = (0{+}4,\ 1{+}5,\ 2{+}6,\ 3{+}7) = (4, 6, 8, 10) = \boxed{\texttt{EGIK}}$$
>
> Y en un solo paso: $\mathsf{Enc}_{\texttt{EGIK}}(\texttt{HOLA}) = (7{+}4,\ 15{+}6,\ 11{+}8,\ 0{+}10) = (11, 21, 19, 10) = \texttt{LUSK}$. **Coincide con $C_2$.** ∎
>
> **Discrepancia con el crudo.** El crudo tiene tres deslices en este ejemplo:
>
> | | Crudo | Verificado |
> |---|---|---|
> | $C_1 = \mathsf{Enc}_{\texttt{ABCD}}(\texttt{HOLA})$ | `HPNC` | **`HPND`** ($\texttt{A}+\texttt{D} = 0+3 = 3 = \texttt{D}$) |
> | $C_2 = \mathsf{Enc}_{\texttt{EFGH}}(C_1)$ | `LUSÑ` | **`LUSK`** ($\texttt{D}+\texttt{H} = 3+7 = 10 = \texttt{K}$) |
> | Clave compuesta | `EFHO` | **`EGIK`** |
>
> Los dos primeros son errores de arrastre en la última columna. El tercero no se deduce de ninguno de los dos: la suma correcta $(0{+}4,\,1{+}5,\,2{+}6,\,3{+}7)$ da $\texttt{E},\texttt{G},\texttt{I},\texttt{K}$, mientras que `EFHO` corresponde a $(4,5,7,15)$. **La clave compuesta correcta es `EGIK`**, y es la única que reproduce $C_2$ en un paso, que es justamente lo que el ejercicio pide mostrar.
>
> ##### El ejemplo de la cátedra, también verificado
>
> Sirve como segundo control y además cubre el caso de largos distintos.
>
> - **Mismo largo:** $\texttt{BARBA} + \texttt{JAMON} = \texttt{KADPN}$. Verificado sobre 27: $(1{+}9, 0{+}0, 18{+}12, 1{+}15, 0{+}13) = (10, 0, 30, 16, 13) \to (10, 0, 3, 16, 13) = \texttt{K}, \texttt{A}, \texttt{D}, \texttt{P}, \texttt{N}$. La tercera posición es la que desborda: $30 \bmod 27 = 3$.
> - **Largos distintos:** $\texttt{JAMON}$ ($p=5$) con $\texttt{BAR}$ ($q=3$) $\Rightarrow \operatorname{mcm}(5,3) = 15$.
>
> $$\begin{array}{llllllllllllllll}
> K_1: & \texttt{J} & \texttt{A} & \texttt{M} & \texttt{O} & \texttt{N} & \texttt{J} & \texttt{A} & \texttt{M} & \texttt{O} & \texttt{N} & \texttt{J} & \texttt{A} & \texttt{M} & \texttt{O} & \texttt{N}\\
> K_2: & \texttt{B} & \texttt{A} & \texttt{R} & \texttt{B} & \texttt{A} & \texttt{R} & \texttt{B} & \texttt{A} & \texttt{R} & \texttt{B} & \texttt{A} & \texttt{R} & \texttt{B} & \texttt{A} & \texttt{R}\\
> K': & \texttt{K} & \texttt{A} & \texttt{D} & \texttt{P} & \texttt{N} & \texttt{A} & \texttt{B} & \texttt{M} & \texttt{G} & \texttt{Ñ} & \texttt{J} & \texttt{R} & \texttt{N} & \texttt{O} & \texttt{E}
> \end{array}$$
>
> Verificado símbolo por símbolo: $K' = \texttt{KADPNABMGÑJRNOE}$, igual a lo que da la cátedra.
>
> **Por qué importa.** Igual que en el Ej. 2, componer no compra seguridad **cuando el largo no crece**: dos Vigenère de largo $t$ dan un Vigenère de largo $t$. Lo único que puede mejorar es el caso de largos coprimos, donde el período salta a $p \cdot q$ — y aun así el resultado sigue siendo un Vigenère, atacable exactamente igual, sólo que con un $t$ mayor (que es el punto de la parte b).

### Ejercicio 5

Teniendo en cuenta la frecuencia aproximada de aparición de letras en castellano, decir para **cada criptograma** si se ha obtenido mediante **sustitución monoalfabética**, **sustitución polialfabética** o **transposición**. *(No hay que descifrarlos.)*

**Criptograma 1**
```
KOZFVPCYVCWVZHMZLCIOHIFIZGJCZTVVXIGJLZHYZLGVMNVLYZ
```

**Criptograma 2**
```
HHMBIWSIPSNNTAWVITQWMEAQVNSPGQJNWELXMJDIBYUGNNRMEUDEM
ZIBTMYMBMWURBTIZXNCWZIUPZUQNRMEGJLWRVROPMREUMXXXAXDIP
UVFEASMBSASCETAEWOYYAKUSWEABSASCRECIOMEWTQOMYALMTXRAG
EWSQQHJDXMVJEAFIRNDUIANW
```

**Criptograma 3**
```
DERTNYLANAOTAABADEAXCEEAIDEJLXHRSUAUJUMXELAATECRTRNAZBI
RESOX
```

> La tabla de frecuencias del castellano está en [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]], junto con el criterio de clasificación por forma del histograma.

> [!nota]- Resolución del Ejercicio 5
> *Clasificar los 3 criptogramas: sustitución monoalfabética, polialfabética o transposición. Sin descifrarlos.*
>
> ![Enunciado Ej. 5 y Criptograma 1](../../assets/Pasted%20image%2020260821150045.png)
> ![Criptograma 2](../../assets/Pasted%20image%2020260821150056.png)
> ![Criptograma 3](../../assets/Pasted%20image%2020260821150126.png)
>
> #### El criterio, antes de mirar los números
>
> Las tres familias del árbol de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] dejan **tres huellas distintas en el histograma**, y por eso se pueden separar sin descifrar nada ([[criptoanalisis-por-frecuencias#Identificar el tipo de cifrado a partir del histograma|tabla de criterios]]):
>
> | Qué le hace al texto | Qué le pasa al histograma | Diagnóstico |
> |---|---|---|
> | **Transposición**: mueve posiciones, no toca símbolos | Queda **idéntico** al del castellano, letra por letra: la `E` y la `A` siguen arriba | Transposición |
> | **Monoalfabética**: cambia símbolos con una permutación fija | Conserva la **forma** (un pico ~13 %, cola larga) pero con **otras etiquetas**: el pico puede ser cualquier letra | Monoalfabética |
> | **Polialfabética**: cambia símbolos con $t$ permutaciones alternadas | Se **aplana**: se superponen $t$ histogramas corridos y todo tiende a $1/n$ | Polialfabética |
>
> La versión cuantitativa del mismo criterio es el [[indice-de-coincidencia|índice de coincidencia]]:
>
> $$\mathrm{IC} = \frac{1}{N(N-1)}\sum_{i} F_i (F_i - 1)$$
>
> con $\approx 0{,}0775$ para texto plano en castellano y $1/27 \approx 0{,}0370$ para texto uniforme (aleatorio), que es el piso. El IC es **invariante** ante transposición (no cambia qué símbolos hay) y ante sustitución monoalfabética (sólo les cambia el nombre), así que **separa polialfabética de todo lo demás** — pero no separa transposición de monoalfabética. Para eso hay que mirar **dónde cae la masa**, no sólo cuánto se concentra.
>
> #### Los conteos
>
> Corridos con [[#Script de frecuencias|G1-Ej3.py]]:
>
> ![Frecuencias del Criptograma 1](../../assets/Pasted%20image%2020260821150347.png)
> ![Frecuencias del Criptograma 2](../../assets/Pasted%20image%2020260821150419.png)
> ![Frecuencias del Criptograma 3](../../assets/Pasted%20image%2020260821150449.png)
>
> | | Criptograma 1 | Criptograma 2 | Criptograma 3 |
> |---|---|---|---|
> | Letras | 50 | 183 | 60 |
> | Símbolos distintos | 18 (faltan 9) | 26 (falta sólo la `Ñ`) | 19 (faltan 8) |
> | Pico | `Z` 16,0 % | `M` 8,7 % | `A` 18,3 % |
> | Segundo | `V` 14,0 % | `E` 7,7 % | `E` 13,3 % |
> | $\mathrm{IC}$ | 0,0653 | **0,0447** | 0,0695 |
> | Masa en `AEIOU` | **12,0 %** | 27,9 % | **43,3 %** |
>
> *(El $\mathrm{IC}$ y la fila `AEIOU` no los imprime el script; se calcularon aparte con el mismo conteo. Referencia: en castellano las cinco vocales suman ≈ 47 %.)*
>
> #### Los veredictos
>
> **Criptograma 2 → sustitución polialfabética.** Es el más fácil y se decide con el IC: **0,0447**, mucho más cerca del piso $1/27 = 0{,}0370$ que del $0{,}0775$ del castellano. El histograma está aplanado —el pico apenas llega al 8,7 % cuando debería rondar el 13 %— y aparecen **26 de los 27 símbolos** en 183 letras. Eso es exactamente lo que produce superponer varias rotaciones. Ninguna otra familia aplana el histograma.
>
> **Criptograma 3 → transposición.** El pico es `A` con 18,3 % y el segundo `E` con 13,3 %: **las dos letras más frecuentes del castellano, en su propio lugar**. Y las cinco vocales `AEIOU` suman 43,3 %, contra el ≈ 47 % del idioma. Es decir: el histograma no está permutado, está **intacto**. Sólo se movieron posiciones ⇒ transposición.
>
> **Criptograma 1 → sustitución monoalfabética.** La forma es la correcta —dos letras se llevan 16 % y 14 %, hay cola larga, faltan 9 símbolos— pero **las etiquetas están corridas**: el pico es `Z` y el segundo `V`, y las vocales `AEIOU` suman apenas **12 %** cuando en castellano son ≈ 47 %. Perfil de idioma con nombres cambiados ⇒ monoalfabética.
>
> **Por qué el IC no alcanza acá y hay que mirar las vocales.** Entre el Criptograma 1 (0,0653) y el Criptograma 3 (0,0695) hay una diferencia de 0,004 sobre textos de 50 y 60 letras — puro ruido muestral, no sirve para decidir. Es el límite conocido del IC: es **invariante ante sustitución monoalfabética**, así que por diseño no puede distinguir el caso 1 del caso 3. Lo que los separa es **cuáles** letras cargan la masa: en el 3 son `A` y `E`, en el 1 son `Z` y `V`. Ese es el matiz entre "conserva el perfil" y "conserva la asignación letra por letra" que marca la [[criptoanalisis-por-frecuencias#Identificar el tipo de cifrado a partir del histograma|nota de frecuencias]].
>
> **Discrepancia con el crudo.** En el crudo, debajo del histograma de cada criptograma quedó anotado el veredicto, y los del **1 y el 3 están intercambiados**:
>
> | | Crudo | Verificado (y solución de la cátedra) |
> |---|---|---|
> | Criptograma 1 | transposición | **monoalfabética** |
> | Criptograma 2 | polialfabética | **polialfabética** |
> | Criptograma 3 | monoalfabética | **transposición** |
>
> Los conteos del crudo son correctos —son los mismos que se reproducen acá—; lo que se dio vuelta es la etiqueta. La [solución de la cátedra](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica%20-%20Soluciones.pdf) coincide con la clasificación verificada, y lo justifica con las mismas dos frases: el 1 *"conserva frecuencias en las nuevas letras, pero usa una permutación del alfabeto original"*, el 3 *"conserva el alfabeto y la frecuencia de las letras originales"*.

### Ejercicio 6

Se recibe un criptograma cifrado mediante **Vigenère** (ver [enunciado completo](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica.pdf), es largo). Se pide:

**a.** Comprobar la **longitud de la clave**.
**b.** Encontrar la **clave** del sistema y desencriptar sólo los **diez primeros caracteres**.

Para ello:
- Listar todas las **secuencias repetidas** de al menos 3 caracteres, junto con la distancia a la que se encuentran.
- **Ayuda:** aparecen cuatro cadenas de cuatro caracteres que se repiten: **`JGAZ`**, **`NMON`**, **`PNFA`** y **`AZMJ`**.
- Estimar la longitud y obtener la frecuencia de aparición de cada letra como **primera de cada bloque**.

> Es el procedimiento del [[test-de-kasiski|test de Kasiski]], paso por paso.
>
> El enunciado **no nombra** el índice de coincidencia, pero el verbo de (a) es *comprobar*: Kasiski propone la longitud y el [[indice-de-coincidencia|índice de coincidencia]] es la herramienta que la valida. Además, "la frecuencia de aparición de cada letra como primera de cada bloque" es exactamente el sub-texto sobre el que se calcula el IC. *(Lectura nuestra del enunciado, no de la cátedra.)*

> [!nota]- Resolución del Ejercicio 6
> *Vigenère: a) comprobar la longitud de la clave · b) hallar la clave y descifrar los diez primeros caracteres.*
>
> ![Enunciado Ej. 6 — criptograma](../../assets/Pasted%20image%2020260821150633.png)
> ![Enunciado Ej. 6 — criptograma (cont.)](../../assets/Pasted%20image%2020260821150644.png)
> ![Enunciado Ej. 6 — consigna](../../assets/Pasted%20image%2020260821150657.png)
>
> **Estado: en curso.** La herramienta está escrita ([[#Script de Kasiski|G1-Ej6-kasiski.py]]) y corrida, y la respuesta está abajo verificada — pero **en el crudo no está volcado el paso final**, y el script todavía no cubre los cuatro sub-textos. Eso es lo que falta.
>
> #### a) La longitud de la clave: 4
>
> El criptograma tiene **478 letras** una vez limpiado. El script encuentra **28 secuencias repetidas** de 3 o más caracteres; entre ellas, las cuatro que el enunciado regala:
>
> | Secuencia | Posiciones | Distancias |
> |---|---|---|
> | `JGAZ` | 0, 128 | 128 |
> | `NMON` | 72, 256 | 184 |
> | `PNFA` | 87, 283 | 196 |
> | `AZMJ` | 98, 130, 314 | 32, 184 |
>
> La idea de [[test-de-kasiski|Kasiski]] es que una secuencia se repite **cuando el mismo trozo de texto plano cae alineado con el mismo trozo de clave**, y eso pasa sólo si la distancia entre las dos apariciones es **múltiplo del período**. Entonces el período divide a todas las distancias:
>
> $$\operatorname{mcd}(128,\ 184,\ 196,\ 32) = 4$$
>
> $$\Rightarrow\quad \boxed{t = 4}$$
>
> La tabla de factores sobre las **37 distancias** que salen de las 28 repeticiones lo confirma por otro lado:
>
> | Largo candidato | Divide a |
> |---|---|
> | 2 | 35 / 37 |
> | **4** | **34 / 37** |
> | 8 | 22 / 37 |
> | 16 | 10 / 37 |
> | 3 · 6 · 12 | 6 / 37 |
>
> **Cómo se lee esta tabla, que es donde se equivoca la intuición.** El 2 puntúa *más alto* que el 4 y aun así no es la respuesta: **todo divisor del período verdadero también divide todas las distancias**, así que los candidatos chicos siempre acumulan apoyo. La regla correcta es quedarse con el **mayor** candidato que todavía divide a casi todas las distancias — el 4 divide 34 de 37 (92 %), mientras que el 8 se cae a 22 de 37 (59 %). Las 3 distancias que el 4 no divide (hay repeticiones a 37, 8 y 20 de distancia) son **coincidencias del idioma**, no de la clave: en un texto de 478 letras es esperable que alguna secuencia de 3 letras se repita por azar.
>
> Eso es exactamente lo que hace `estimar_largo()`: el mayor candidato que divide al menos al 60 % de las distancias.
>
> La cátedra llega a lo mismo por el camino corto: *"como todos son múltiplos de 4, el período debe ser 4 o 2 o 1"*, y descarta 2 y 1 al partir el texto. Y como el enunciado dice **comprobar**, el cierre natural es el [[indice-de-coincidencia|índice de coincidencia]]: partir en 4 sub-textos y verificar que el IC de cada uno salte de ≈ 0,04 (el del criptograma entero) a ≈ 0,0775. **Ese paso todavía no está hecho.**
>
> #### La frecuencia de la primera letra de cada bloque
>
> Es lo que pide el tercer ítem de la ayuda, y el script lo saca con `texto[::4]` — los 120 símbolos que ocupan la posición 0 de cada bloque de 4, o sea el **sub-texto cifrado con $k_1$**:
>
> ![Salida del script: largo 4 y frecuencias del primer bloque](../../assets/Pasted%20image%2020260821151120.png)
>
> | Letra | J | N | M | T | X | D | A |
> |---|---|---|---|---|---|---|---|
> | Frec. | 17,50 % | 14,17 % | 10,00 % | 9,17 % | 7,50 % | 6,67 % | 5,83 % |
>
> #### b) La clave y los diez primeros caracteres
>
> Cada sub-texto es un [[cifrado-por-rotacion|César independiente]], así que se resuelve alineando su pico con el del castellano. Sobre el sub-texto 1:
>
> **Cuidado con alinear el pico con la `E` de una.** En castellano la `A` y la `E` están **empatadas** en ≈ 13 % (la tabla del propio enunciado les da 13 a las dos). Lo que desempata es la **distancia entre los dos picos**: acá son `J` (17,50 %) y `N` (14,17 %), separadas por $13 - 9 = 4$ posiciones — exactamente la distancia entre `A` $(0)$ y `E` $(4)$. Entonces el par se lee $\texttt{J}\leftrightarrow\texttt{A}$ y $\texttt{N}\leftrightarrow\texttt{E}$, y sale
>
> $$k_1 = \sigma(\texttt{J}) - \sigma(\texttt{A}) = 9 - 0 = 9 = \texttt{J}$$
>
> Control: con $k_1 = 9$ el sub-texto descifrado queda `A` 17,5 % · `E` 14,2 % · `D` 10 % · `L` 9,2 % · `O` 7,5 % · `U` 6,7 % · `R` 5,8 %, que es un perfil de castellano creíble. Si en cambio se hubiera alineado $\texttt{J}\leftrightarrow\texttt{E}$ (o sea $k_1 = 5$), el segundo pico caería en una letra rara y el perfil no cerraría. *(Este desempate es lectura nuestra; el enunciado no lo menciona.)*
>
> Repitiendo el mismo ataque sobre los sub-textos 2, 3 y 4 se obtienen $k_2 = \texttt{U}$, $k_3 = \texttt{A}$, $k_4 = \texttt{N}$:
>
> $$\boxed{K = \texttt{JUAN}}$$
>
> y descifrando con esa clave, los primeros caracteres son
>
> ```
> AMANECIAYELNUEVOSOLPINTABADEOROLASONDASDEUNMAR
> ```
>
> es decir **`AMANECIAYE`** son los diez que pide el enunciado, y la frase es *"Amanecía y el nuevo sol pintaba de oro las ondas de un mar."* Coincide con la [solución de la cátedra](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica%20-%20Soluciones.pdf).
>
> #### Qué falta
>
> 1. **El script sólo saca el sub-texto 1** (`primeras_de_bloque` devuelve `texto[::largo]`). Para los cuatro corrimientos hay que generalizarlo a `texto[j::largo]` con $j = 0,1,2,3$.
> 2. **Falta la comprobación por IC** que pide el verbo *comprobar* de la parte (a): calcular el IC de cada sub-texto y ver el salto a ≈ 0,0775.
> 3. **Falta volcar todo esto al [crudo](../../raw/guias/guia1/Resolucion%20Guia%201.md)**, donde hoy están pegadas las capturas de la salida pero no está escrito el razonamiento.
>
> **Una errata menor de la solución de la cátedra:** su tabla ubica `NMON` en las posiciones 75 y 256, pero declara una distancia de 184 — y $256 - 75 = 181$. La posición correcta es **72** (que es la que devuelve el script), y con ella $256 - 72 = 184$. El número que usa el razonamiento es el correcto; el que está mal es el índice.

### Ejercicio 7

Se cuenta con un texto cifrado producto de **transposición por columnas** (cada $n$ columnas se reacomodó el texto original) **y** un **cifrado de rotación**.

**a)** ¿Qué estrategia usarías para recuperar el mensaje original?
**b)** Si el texto cifrado tiene $m$ caracteres, ¿cuántas pruebas requeriría un ataque de fuerza bruta?

> [!nota]- Resolución del Ejercicio 7
> *Transposición por columnas + rotación: a) estrategia de recuperación · b) cuántas pruebas requiere la fuerza bruta con $m$ caracteres.*
>
> ![Enunciado Ej. 7](../../assets/Pasted%20image%2020260821151145.png)
>
> #### Cómo funciona la capa de transposición
>
> El mensaje se escribe en una grilla de $n$ columnas, fila por fila, y se lee **por columnas**. Con $M = \texttt{ATACARALAMANECER}$ ($m = 16$) y $n = 4$:
>
> $$\begin{array}{c|cccc}
>  & \text{col }1 & \text{col }2 & \text{col }3 & \text{col }4\\
> \hline
> \text{fila }1 & \texttt{A} & \texttt{T} & \texttt{A} & \texttt{C}\\
> \text{fila }2 & \texttt{A} & \texttt{R} & \texttt{A} & \texttt{L}\\
> \text{fila }3 & \texttt{A} & \texttt{M} & \texttt{A} & \texttt{N}\\
> \text{fila }4 & \texttt{E} & \texttt{C} & \texttt{E} & \texttt{R}
> \end{array}$$
>
> Leyendo por columnas: `AAAE TRMC AAAE CLNR`. **Verificado**, coincide con el crudo.
>
> En general, con $n$ columnas y $k$ filas, la posición $(f, c)$ guarda $m_{(f-1)n + c}$, y hace falta que la grilla cierre: $m = n \cdot k$. Ese detalle es el que decide toda la parte (b).
>
> #### a) La estrategia: separar las dos capas
>
> Las dos capas son **ortogonales**:
>
> - la **rotación** cambia símbolos y no toca posiciones,
> - la **transposición** cambia posiciones y no toca símbolos.
>
> ⇒ El histograma del criptograma final es el del castellano **rotado $k$ lugares**, porque la transposición es **invisible** al conteo de frecuencias. Ver [[cifrado-por-transposicion#Composición con sustitución|Transposición § Composición con sustitución]].
>
> Eso permite atacar en dos pasos independientes:
>
> 1. **Deshacer la rotación por [[criptoanalisis-por-frecuencias|frecuencias]].** Se alinea el pico del criptograma con la `E` (o la `A`, ver el desempate del Ej. 6) y sale $k$. Un intento bien elegido; a lo sumo las 27 rotaciones por [[ataque-de-fuerza-bruta|fuerza bruta]].
> 2. **Sobre el texto ya des-rotado, probar cada $n$** y leer la grilla por filas hasta que aparezca algo legible.
>
> El crudo dice lo mismo en la parte (a) —"compondría la matriz variando el tamaño de columnas $n$"— y agrega que se puede recorrer la grilla desde la esquina inferior derecha; el punto conceptual, sin embargo, es **que los dos pasos se puedan hacer por separado**, y eso es lo que hay que escribir.
>
> **El ejemplo de la cátedra** ilustra los dos pasos sobre un texto de 9 letras:
>
> $$\texttt{HHAVWWWHR} \ \xrightarrow{\ k=3\ }\ \texttt{EEXSTTTEO} \ \xrightarrow{\ n=3\ }\ \texttt{ESTETEXTO}$$
>
> La `H` es la letra más frecuente del criptograma; suponiendo `H` $\leftrightarrow$ `E` sale $k = 3$. Después, con $n = 2$ *falla* y con $n = 3$ sale `ESTETEXTO`. Ese "falla" no es casualidad y anticipa la parte (b): **$m = 9$ y $2 \nmid 9$**, así que $n = 2$ ni siquiera arma una grilla rectangular.
>
> #### b) El conteo, bien hecho
>
> Hay que contar **cuántos pares $(n, k)$ hay que probar**, y ahí está el punto fino:
>
> **1. Los $n$ posibles son los divisores de $m$.** La grilla es de $n$ columnas por $k$ filas y tiene que cerrar exacta: $m = n\cdot k$ con $n, k$ enteros. Entonces $n \mid m$, y la cantidad de candidatos es $d(m)$, **el número de divisores de $m$** — no $m$, ni $m-2$.
>
> **2. Por cada $n$ hay 27 rotaciones.** ⇒ Costo del ataque **ciego** (probar todas las combinaciones sin mirar el resultado intermedio):
>
> $$\#\text{pruebas} \;=\; 27 \cdot d(m)$$
>
> Descontando $n = 1$ y $n = m$, que producen **los dos la misma permutación identidad** (una sola columna leída de arriba abajo, o una sola fila leída de izquierda a derecha, dan el texto original), quedan $27\,(d(m) - 2)$ pruebas no triviales.
>
> **3. Pero el ataque de la parte (a) no es ciego, es separado.** Como el histograma delata la rotación sin depender de $n$, los dos espacios se recorren uno **después** del otro y el costo es la **suma**:
>
> $$\#\text{pruebas} \;=\; 27 + d(m)$$
>
> Esa es la respuesta que corresponde a la estrategia de (a), y la diferencia con la anterior es de órdenes de magnitud.
>
> ##### La cuenta en números
>
> | $m$ | Divisores | $d(m)$ | Ciego $27\,d(m)$ | Separado $27 + d(m)$ | Crudo $27(m-2)$ | Crudo $m+25$ |
> |---|---|---|---|---|---|---|
> | 16 | 1, 2, 4, 8, 16 | 5 | **135** | **32** | 378 | 41 |
> | 51 | 1, 3, 17, 51 | 4 | **108** | **31** | 1323 | 76 |
> | 60 | 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60 | 12 | **324** | **39** | 1566 | 85 |
> | 120 | 16 divisores | 16 | **432** | **43** | 3186 | 145 |
>
> **Discrepancia con el crudo.** El crudo cierra con *"hay que probar cada combinación de $(k,n)$ a ciegas $\Rightarrow 27\cdot(m-2) = m+25$ pruebas"*. Ahí hay **dos problemas distintos**:
>
> **(i) Los dos números no son iguales.** $27(m-2) = 27m - 54$ y $m + 25 = 27 + (m-2)$. La igualdad $27m - 54 = m + 25$ pide $26m = 79$, que no tiene solución entera: **no coinciden para ningún $m$**. Lo que pasó es que se escribieron **dos ataques diferentes** con signo de igual entre medio — el producto es el ataque ciego, la suma es el ataque separado de la parte (a). Son las dos cuentas correctas de dos escenarios distintos, no dos formas de escribir la misma.
>
> **(ii) La cantidad de $n$ candidatos no es $m-2$, es $d(m)-2$.** Tratar como candidatos a todos los enteros entre 2 y $m-1$ ignora que la grilla tiene que cerrar. Para $m = 60$ eso son 58 candidatos contra los **12** divisores reales: se sobrecuenta por un factor ~5. El propio ejemplo de la cátedra lo muestra —con $m=9$, $n=2$ "falla"— y el crudo ya tenía escrito $m = n\cdot k$ dos renglones antes.
>
> **Corregido:** $27\,d(m)$ a ciegas, $27 + d(m)$ separando las capas.
>
> **Qué contesta la cátedra, y por qué difiere.** Su solución dice: *"para obtener la clave de César, el máximo de pruebas es $q$ (el número de símbolos del alfabeto); por cada una hay que transponer $m$ veces, entonces $m \cdot q$"*, o sea $27m$. Es una **cota superior válida** —$d(m) \le m$ siempre— pero deja sin usar la restricción de divisibilidad, así que sobrecuenta igual que el crudo. Y llama la atención que su propia parte (a) usa la separación (primero $k$ por frecuencias, después reordenar), con lo cual su (b) le pone precio a un ataque más torpe que el que ella misma propone. *(Lectura nuestra; la cátedra no marca esta tensión.)*
>
> **Un supuesto que conviene declarar.** Todo esto asume que la grilla se llena **exacta**, sin relleno. Si el cifrador admite *padding* para completar la última fila, cualquier $n \le m$ vuelve a ser posible y el conteo ciego sube a $27m$ — la respuesta de la cátedra. El enunciado no aclara cuál de los dos casos es; en un parcial conviene escribir el supuesto antes de dar el número. *(Lectura nuestra.)*

### Ejercicio 8

Mostrar que los siguientes cifrados son **muy fáciles de quebrar mediante un ataque de texto plano elegido** (*chosen-plaintext attack*):

- cifrado de sustitución monoalfabética
- cifrado de Vigenère

> [!nota]- Resolución del Ejercicio 8
> *Mostrar que sustitución monoalfabética y Vigenère caen fácil bajo chosen-plaintext attack.*
>
> **Estado: pendiente.** No hay nada en el crudo.
>
> Dirección: bajo [[modelos-de-ataque|CPA]] el adversario elige el texto plano y ve su cifrado, así que **una sola consulta bien elegida** recupera la clave entera en los dos casos:
>
> - **Monoalfabética:** pedir el cifrado de `ABCDEFGHIJKLMNÑOPQRSTUVWXY` (todo el alfabeto menos una letra) devuelve $\pi$ tabulada. La letra que falta queda determinada **por descarte**, porque $\pi$ es biyectiva.
> - **Vigenère:** pedir el cifrado de $\texttt{AAAA}\dots$ de largo suficiente devuelve $\mathsf{Enc}_k(\texttt{A}^r)_i = (0 + k_j) = k_j$, o sea **la clave en claro, repetida**.
>
> → [[modelos-de-ataque#Cómo caen los cifrados clásicos bajo CPA|Modelos de ataque § Cómo caen los cifrados clásicos bajo CPA]]. El desarrollo escrito con nuestras palabras es lo que falta; la [solución de la cátedra](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica%20-%20Soluciones.pdf) sigue exactamente estas dos líneas.

---

## Herramientas

Dos scripts de Python escritos para esta guía, los dos en `raw/guias/guia1/`. No dependen de nada externo: sólo `sys`, `unicodedata` y `collections` de la biblioteca estándar.

Los dos comparten el mismo truco de normalización, que es la parte que hay que entender:

```python
texto = texto.upper().replace("Ñ", "\0")
texto = unicodedata.normalize("NFD", texto)
texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
return texto.replace("\0", "Ñ")
```

`NFD` descompone cada carácter acentuado en letra base + marca combinante, y el filtro `category(c) != "Mn"` tira las marcas: así `Á` → `A`, `Ü` → `U`. **El problema es que `Ñ` también se descompone**, en `N` + tilde combinante, y quedaría convertida en `N`. Por eso se la esconde primero detrás de un `\0` (un carácter que no aparece en ningún texto) y se la restituye al final. Sin ese paso, el alfabeto de 27 se convertiría en el de 26 en silencio — que es justo el tipo de error que arruinó el Ej. 4a en el crudo.

### Script de frecuencias

[Ver el archivo](../../raw/guias/guia1/G1-Ej3.py)

**Qué hace.** Cuenta cuántas veces aparece cada letra de un texto y las lista ordenadas de mayor a menor con su porcentaje. Es la implementación directa del paso 1 del [[criptoanalisis-por-frecuencias#Procedimiento|criptoanálisis por frecuencias]].

| Función | Qué hace |
|---|---|
| `normalizar(texto)` | Mayúsculas y sin tildes, **conservando la `Ñ`** (el truco de arriba) |
| `contar_letras(texto, ignorar_tildes=True)` | Devuelve un `Counter`, filtrando con `isalpha()` — descarta espacios, dígitos y puntuación |
| `mostrar(conteo)` | Imprime `Total de letras`, y después una fila por letra con cantidad y frecuencia |

**Cómo se corre:**

```bash
python3 G1-Ej3.py "VKXYKBKXGKSGWAKQQGYIUYGYWAKXKGQRKSZKJKYKKYIUSYKMAÑX"
```

Sin argumentos lo pide por entrada estándar. La salida es la que está pegada en el crudo para el Ej. 3 y para los tres criptogramas del Ej. 5.

**Para qué se usó.** Es la herramienta del **Ej. 3** (encontrar el pico `K` al 25 % y de ahí $k=6$) y del **Ej. 5** (los tres histogramas que deciden la clasificación).

**Lo que no hace:** no calcula el índice de coincidencia ni compara contra la tabla del castellano. Esos dos números se sacaron aparte a partir del mismo conteo.

### Script de Kasiski

[Ver el archivo](../../raw/guias/guia1/G1-Ej6-kasiski.py)

**Qué hace.** El [[test-de-kasiski|test de Kasiski]] completo sobre el criptograma del Ej. 6: lista las secuencias repetidas con su distancia, factoriza las distancias para estimar el largo de clave, y saca la frecuencia de la primera letra de cada bloque.

**Trae el criptograma embebido** en la constante `CRIPTOGRAMA` — hasta ahora ese texto sólo existía dentro del [PDF del enunciado](../../raw/guias/guia1/Guia%201%20-%20Criptograf%C3%ADa%20Cl%C3%A1sica.pdf), o sea que el script es también la primera versión copiable del criptograma en el vault. Son 478 letras después de limpiar.

| Función | Qué hace |
|---|---|
| `limpiar(texto)` | Normaliza y se queda **sólo** con los 27 símbolos de `ALFABETO` (tira espacios, saltos y el punto final) |
| `secuencias_repetidas(texto, largo_min=3)` | `{secuencia: [posiciones]}` para toda secuencia de 3+ caracteres que aparezca dos o más veces. Barre largos crecientes y **corta apenas no encuentra ninguna** de un largo dado: si no hay repetidas de largo $N$, tampoco las hay más largas |
| `distancias(posiciones)` | Diferencias entre apariciones **consecutivas** |
| `divisores(dists, max_largo=20)` | Para cada candidato de 2 a 20, a cuántas distancias divide |
| `estimar_largo(dists)` | **El mayor** candidato que divide al menos al 60 % de las distancias |
| `primeras_de_bloque(texto, largo)` | `texto[::largo]` — el sub-texto que pide la ayuda del enunciado |

> **La línea que importa es `estimar_largo`.** No devuelve el candidato *más votado* sino el **mayor** que supera el umbral, y esa elección es la que evita el error clásico: como todo divisor del período verdadero divide también todas las distancias, el 2 y el 3 siempre acumulan votos sin ser la respuesta. Ver la lectura de la tabla de factores en el [[#Ejercicio 6|Ej. 6]].

**Cómo se corre:**

```bash
python3 G1-Ej6-kasiski.py       # estima el largo solo
python3 G1-Ej6-kasiski.py 4     # fuerza el largo a 4
```

Imprime, en orden: cantidad de letras, la tabla de secuencias repetidas con posiciones y distancias, la tabla de factores con un histograma de `#`, el largo estimado, y las frecuencias de la primera letra de cada bloque.

**Lo que no hace todavía:** sólo emite el sub-texto **0**. Para recuperar la clave completa hay que generalizarlo a `texto[j::largo]` con $j = 0,\dots,t-1$ y resolver cada sub-texto como un César. Tampoco calcula el índice de coincidencia, que es la comprobación que pide la parte (a) del Ej. 6.

---

## Qué se lleva al parcial

- **Antes de sumar, fijar el alfabeto.** El Ej. 4a se rompe entero por confundir $\texttt{O}=15$ (castellano de 27) con $\texttt{O}=14$ (inglés de 26). Conviene escribir la tabla de índices primero.
- **El pico del histograma no siempre es la `E`.** `A` y `E` empatan en ≈ 13 %. Lo que desempata es la **distancia entre los dos picos** (Ej. 6).
- **El IC separa polialfabética de todo lo demás, y nada más.** Es invariante ante monoalfabética y ante transposición, así que para distinguir esas dos hay que mirar **en qué letras** cae la masa (Ej. 5).
- **Componer no compra seguridad cuando el resultado vive en el mismo espacio de claves.** $S_n$ bajo $\circ$ (Ej. 2), $\mathbb{Z}_n$ bajo $+$ (Ej. 4c): en los dos casos la composición es otra clave del mismo sistema.
- **Cuando las capas se separan, el costo se suma; cuando no, se multiplica.** Todo el Ej. 7 vive de esa distinción, y es la razón por la que los cifrados modernos alternan sustitución y permutación **muchas** veces.
- **Contar bien los candidatos.** En una transposición por columnas de $m$ caracteres los $n$ posibles son los **divisores** de $m$, no todos los enteros hasta $m$.
