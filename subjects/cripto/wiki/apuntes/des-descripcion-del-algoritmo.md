---
title: Descripción del algoritmo DES
resumen: 'Especificación operativa de DES a nivel de bit: las seis tablas de permutación, las ocho cajas S transcriptas, el calendario de rotaciones del key schedule y el tamaño exacto de cada paso.'
fuentes: ["[[des-y-3des]]", "[[clase-02-cifrado]]", "[[practica-03-seudoaleatoriedad-y-modos]]", "[[implementaciones-de-referencia]]"]
aliases: [Descripción del algoritmo DES, DES paso a paso, Especificación de DES, Tablas de DES, S-Cajas, Cajas S, Key schedule de DES, PC-1, PC-2, Permutación IP, FIPS PUB 46]
type: apunte
clase: 2
orden: 31
created: 2026-08-24
updated: 2026-09-04
tags: [apunte, des, feistel, s-cajas, key-schedule, permutaciones, cifrado-en-bloque, fips-46, clase-02, practica-03]
sources: ["des.pdf", "raw/practicas/Clase 3.pdf"]
---

# Descripción del algoritmo DES

> **Fuente:** [`des.pdf`](../../raw/apuntes/des.pdf) — *"Descripción del algoritmo DES (Data Encryption Standard)"*, de **Jorge Sánchez Arriazu**, **diciembre de 1999**, 10 páginas. La parte "paso a paso" es, según el propio documento, una traducción de un artículo de **Matthew Fischer**. La especificación oficial es **FIPS PUB 46** (el documento lo menciona, no lo reproduce).
>
> **Procedencia confirmada: lo publica la cátedra.** No lo **escribió** la cátedra —el autor es Sánchez Arriazu y el texto es de 1999—, pero sí lo **reparte**: la última filmina de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]] del 24/08 dice *"Apunte e implementación DES: En Material Didáctico/Extra/ (y también hay una Implementación AES)"*. O sea que este PDF y los dos `.txt` de implementación que están en `raw/apuntes/` salieron del **campus**, no de una búsqueda suelta por internet. Lo que sigue valiendo es la advertencia sobre el contenido: está escrito **cuando DES todavía se usaba**, así que describe el algoritmo y **no** su estado de seguridad. Para eso está la nota de concepto.

Esta nota trae **el detalle a nivel de bit**: las seis tablas de permutación completas ($\mathrm{IP}$, $\mathrm{IP}^{-1}$, PC-1, PC-2, $E$, $P$), las ocho cajas $S$ transcriptas, el calendario de rotaciones y el tamaño exacto de cada paso. Es la **especificación operativa** — lo que hace falta si se va a implementar DES o si piden seguir un bit a través del algoritmo.

Lo **conceptual** vive en [[des-y-3des|DES y 3-DES]]: qué es una red de Feistel y por qué cifrar y descifrar son el mismo circuito, la historia de las cajas $S$ secretas, 3-DES, las claves débiles y semi-débiles, y la **cronología de ataques** —criptoanálisis diferencial (1990), lineal (1992) y la fuerza bruta de Deep Crack (1998)— que explica por qué hoy **DES está quebrado por tamaño de clave** y aparece tachado en la filmina de [[eleccion-de-primitivas|primitivas recomendadas]]. Ojo con esa cronología: los $2^{47}$ y $2^{43}$ que se citan son **cantidades de textos**, no un espacio de clave más chico — el espacio sigue siendo $2^{56}$. Esta nota no repite nada de eso: acá van las tablas.

---

## 1. Convención de numeración de bits (leer esto primero)

Es el detalle que arruina más implementaciones que ningún otro, y la fuente lo dice **una sola vez, entre paréntesis**, en el paso 1.2.1:

> *"El bit 1, el más significativo, de la clave transformada es el bit 57 de la clave original, el bit 2 pasa a ser el bit 49, etc."*

De ahí salen las dos reglas que valen para **todas** las tablas de este apunte:

1. **Los bits se numeran desde 1 y el bit 1 es el más significativo.** Al revés de lo que uno espera de un `int` en C o en Java, donde el bit 0 es el menos significativo. Toda implementación que copie estas tablas tal cual necesita invertir el orden en algún lado.
2. **Las tablas se leen "de dónde viene", no "adónde va".** El número que está en la posición $j$ de la tabla es la **posición de origen** en la entrada. O sea: $\text{salida}[j] = \text{entrada}[T[j]]$.

Por eso el primer valor de PC-1 es $57$: significa *"el bit 1 de la salida es el bit 57 de la entrada"*.

> **Redacción descuidada de la fuente.** La segunda mitad de la frase citada —*"el bit 2 pasa a ser el bit 49"*— está dicha al revés y contradice a la primera mitad. Lo que quiere decir es *"el bit 2 de la clave transformada es el bit 49 de la original"*, que es lo mismo que dice la primera mitad y lo que efectivamente hace la tabla.

Con esto, la salida de cada permutación queda determinada sin ambigüedad, y las tablas son **públicas y fijas**: no dependen de la clave. Es el [[principio-de-kerckhoffs|principio de Kerckhoffs]] llevado al extremo — todo lo que sigue está publicado, y el secreto son 56 bits y nada más.

---

## 2. Esquema general: las 19 etapas

La fuente lo enuncia así:

> *"DES tiene 19 etapas diferentes. La primera etapa es una transposición, una permutación inicial (IP) del texto plano de 64 bits, independientemente de la clave. La última etapa es otra transposición (IP-1), exactamente la inversa de la primera. La penúltima etapa intercambia los 32 bits de la izquierda y los 32 de la derecha. Las 16 etapas restantes son una Red de Feistel de 16 rondas."*

La **Figura 1** del PDF dibuja dos columnas que corren en paralelo: la de los **datos** y la de la **clave**. Reproducida como tabla:

| # | Etapa (camino de datos) | Entra | Sale | Etapa en paralelo (camino de clave) |
|---|---|---|---|---|
| — | Texto plano | 64 | 64 | Clave de usuario: 64 bits (**56 reales**) |
| 1 | **$\mathrm{IP}$** — permutación inicial | 64 | 64 → $L_0, R_0$ | **PC-1** — selección permutada 1: 64 → 56, partida en $C_0, D_0$ |
| 2 | **Ronda 1** → $L_1, R_1$ | 64 | 64 | rotación a izquierda → $C_1, D_1$; **PC-2** → $K_1$ (48 bits) |
| 3 | **Ronda 2** → $L_2, R_2$ | 64 | 64 | rotación → $C_2, D_2$; **PC-2** → $K_2$ |
| ⋮ | ⋮ | | | ⋮ |
| 17 | **Ronda 16** → $L_{16}, R_{16}$ | 64 | 64 | rotación → $C_{16}, D_{16}$; **PC-2** → $K_{16}$ |
| 18 | **Intercambio** de los dos medios bloques → $R_{16} \Vert L_{16}$ | 64 | 64 | — |
| 19 | **$\mathrm{IP}^{-1}$** — permutación final | 64 | 64 | — |
| — | Texto cifrado | 64 | 64 | — |

$1 + 16 + 1 + 1 = 19$. Los dos caminos se tocan **sólo** en un punto: la subclave $K_i$ de 48 bits entra a la ronda $i$ y se xorea con la mitad derecha expandida.

### Tabla de tamaños (la referencia rápida)

| Objeto | Bits |
|---|---|
| Bloque de entrada y de salida | 64 |
| Medio bloque $L_i$, $R_i$ | 32 |
| Clave de usuario | 64 (8 de paridad) |
| Clave efectiva, después de PC-1 | **56** |
| Mitades del key schedule $C_i$, $D_i$ | 28 cada una |
| Subclave $K_i$, después de PC-2 | **48** |
| Salida de la expansión $E$ | 48 |
| Entrada de cada caja $S_j$ | 6 |
| Salida de cada caja $S_j$ | 4 |
| Salida de las 8 cajas juntas | 32 |
| Rondas | 16 |

> **Por qué $\mathrm{IP}$ e $\mathrm{IP}^{-1}$ no aportan seguridad** *(lectura nuestra — la fuente las describe y no las justifica).* Las dos son biyecciones **fijas, públicas y sin clave**. Un adversario que ve el criptograma le aplica $\mathrm{IP}$ y las deshace gratis; un adversario que elige el plano le aplica $\mathrm{IP}^{-1}$ y también. Toda la seguridad de DES está en las **16 rondas**, y la razón habitual que se da para $\mathrm{IP}$ es de **ingeniería**: acomodar los bits para cargarlos de a bytes en el hardware de los años 70. Que estén ahí no cambia ni un bit del análisis criptográfico — pero **hay que implementarlas igual**, porque los vectores de prueba no dan sin ellas.

---

## 3. Permutación inicial (IP)

Paso 2.2 de la fuente. Toma los 64 bits del bloque y los reordena:

$$
\begin{array}{rrrrrrrr}
58 & 50 & 42 & 34 & 26 & 18 & 10 & 2\\
60 & 52 & 44 & 36 & 28 & 20 & 12 & 4\\
62 & 54 & 46 & 38 & 30 & 22 & 14 & 6\\
64 & 56 & 48 & 40 & 32 & 24 & 16 & 8\\
57 & 49 & 41 & 33 & 25 & 17 &  9 & 1\\
59 & 51 & 43 & 35 & 27 & 19 & 11 & 3\\
61 & 53 & 45 & 37 & 29 & 21 & 13 & 5\\
63 & 55 & 47 & 39 & 31 & 23 & 15 & 7
\end{array}
$$

El bloque permutado se parte en dos mitades de 32 bits:

$$L_0 = \text{bits } 1\dots 32 \text{ (los de mayor peso)}, \qquad R_0 = \text{bits } 33\dots 64$$

> **La estructura que se ve al mirarla de costado** *(lectura nuestra).* Las cuatro primeras filas son todas **pares** en orden decreciente por columnas, y las cuatro últimas todas **impares**. O sea: $L_0$ se queda con **todos los bits pares** del bloque original y $R_0$ con **todos los impares**. $\mathrm{IP}$ no es una permutación arbitraria, es un **desintercalado par/impar** con un reordenamiento regular adentro — exactamente el tipo de cableado que sale barato en hardware.

Y el paso previo, que la fuente aclara en 2.1: si el bloque tiene **menos de 64 bits hay que completarlo**. La fuente no dice cómo; el relleno es el [[primitiva-de-cifrado-en-bloque|padding]] y ahí está el detalle de Simple Pad y Des Pad. En los vectores de prueba de la sección 9 el relleno que usa es simplemente **bytes en cero**.

---

## 4. Las 16 rondas: la ecuación de Feistel

Los pasos 2.4.7 y 2.4.8 de la fuente definen la ronda. En notación limpia, la **ronda $i$**, para $i = 1 \dots 16$:

$$
\begin{aligned}
L_i &= R_{i-1}\\
R_i &= L_{i-1} \oplus F(R_{i-1}, K_i)
\end{aligned}
$$

Eso es todo. La mitad derecha pasa a la izquierda **sin tocarse**, y la nueva derecha es la vieja izquierda xoreada con la mitad derecha pasada por $F$ bajo la subclave $K_i$.

> **Ojo con el orden en que la fuente los escribe.** El paso 2.4.7 calcula $R_i$ y **recién después** el 2.4.8 dice $L_i = R_{i-1}$. Escrito así, si se implementa pisando las variables in-place, al llegar a 2.4.8 ya no se tiene $L_{i-1}$ intacta para el xor. Las dos asignaciones son **simultáneas**: hay que guardar una copia de $L_{i-1}$ (o de $R_{i-1}$) antes de escribir. Es el bug clásico de la primera implementación.

Las dos consecuencias estructurales de esta ecuación —que $F$ **no necesita ser invertible**, y que descifrar es el mismo circuito con las subclaves al revés— están desarrolladas en la [[des-y-3des#Estructura: red de Feistel|nota de concepto]]. Acá alcanza con retener por qué la primera importa **para las tablas de esta nota**: $F$ arranca **expandiendo** 32 bits a 48 y después **comprime** de a 6 bits en 4. Las dos cosas destruyen información. Si Feistel exigiera que $F$ fuese biyectiva, ni $E$ ni las cajas $S$ podrían existir tal como son.

---

## 5. La función F, paso a paso

Es la **Figura 3** del PDF. Cuatro etapas encadenadas, con los tamaños marcados:

$$32 \ \xrightarrow{\ E\ } \ 48 \ \xrightarrow{\ \oplus K_i\ } \ 48 \ \xrightarrow{\ S_1\dots S_8\ } \ 32 \ \xrightarrow{\ P\ } \ 32$$

### 5.1. Expansión E (32 → 48 bits)

Paso 2.4.1. Toma $R_{i-1}$ y produce 48 bits repitiendo algunos:

$$
\begin{array}{rrrrrr}
32 &  1 &  2 &  3 &  4 &  5\\
 4 &  5 &  6 &  7 &  8 &  9\\
 8 &  9 & 10 & 11 & 12 & 13\\
12 & 13 & 14 & 15 & 16 & 17\\
16 & 17 & 18 & 19 & 20 & 21\\
20 & 21 & 22 & 23 & 24 & 25\\
24 & 25 & 26 & 27 & 28 & 29\\
28 & 29 & 30 & 31 & 32 &  1
\end{array}
$$

> **Está impresa en 6 filas de 8 y así no se entiende nada** *(lectura nuestra).* El PDF mete **todas** sus tablas en una grilla de 8 columnas, y en el caso de $E$ eso parte los grupos por la mitad. La misma secuencia de 48 números, reagrupada en **8 filas de 6** —que es como está arriba—, muestra de golpe para qué sirve: **cada fila son los 6 bits que alimentan a una caja $S$**. Lo mismo pasa con PC-1 y con PC-2, más abajo.

Leída así, la regla es transparente. La fila $j$ es

$$\underbrace{4j-4}_{\text{prestado de la izquierda}},\ \underbrace{4j-3,\ 4j-2,\ 4j-1,\ 4j}_{\text{el grupo de 4 propio}},\ \underbrace{4j+1}_{\text{prestado de la derecha}}$$

es decir: los 32 bits se parten en **8 grupos de 4**, y a cada grupo se le pegan **el último bit del grupo anterior y el primero del siguiente**. Los índices se toman **con envoltura circular** dentro del rango $1$–$32$: en la fila $j=1$ el $4j-4=0$ se lee como el bit **32**, y en la fila $j=8$ el $4j+1=33$ se lee como el bit **1**.

Al contar las apariciones se cierra: cada bit aparece $48/32 = 1{,}5$ veces en promedio; en concreto, los **16 bits del borde de cada grupo** aparecen **dos** veces y los otros 16, una sola.

> **Para qué está la expansión** *(lectura nuestra — la fuente sólo dice "convierte el bloque de 32 bits en uno de 48").* Dos motivos que se suman:
> 1. **Cuadrar los tamaños.** La subclave tiene 48 bits, así que la mitad derecha tiene que llegar con 48 para poder xorearse.
> 2. **Difusión.** Los bits duplicados entran a **dos cajas $S$ distintas**, así que un bit del plano influye sobre 8 bits de salida de $F$ en lugar de 4. Es lo que arranca la avalancha: junto con la permutación $P$ de más abajo, hace que en un puñado de rondas cada bit de entrada haya tocado todas las cajas.

### 5.2. Xor con la subclave

Paso 2.4.2. Nada que explicar:

$$B = E(R_{i-1}) \oplus K_i \qquad (48 \text{ bits})$$

### 5.3. Las cajas S (48 → 32 bits)

Pasos 2.4.3 y 2.4.4. Primero se parte el resultado en **ocho bloques de 6 bits**:

$$B = B_1 \Vert B_2 \Vert \dots \Vert B_8, \qquad B_1 = \text{bits } 1\text{–}6,\quad B_2 = \text{bits } 7\text{–}12,\quad \dots,\quad B_8 = \text{bits } 43\text{–}48$$

Y cada $B_j$ se sustituye usando **su propia** tabla $S_j$ — las ocho cajas son **distintas entre sí**. La regla de lectura, que es lo raro del asunto:

| De $B_j = b_1 b_2 b_3 b_4 b_5 b_6$ | Se arma | Rango | Indica |
|---|---|---|---|
| bits **1º y 6º** (los de los extremos) | $m = b_1 b_6$ | 0 a 3 | la **fila** de $S_j$ |
| bits **2º a 5º** (los del medio) | $n = b_2 b_3 b_4 b_5$ | 0 a 15 | la **columna** de $S_j$ |

y $B_j$ se reemplaza por $S_j(m, n)$, que es un valor **de 4 bits**. La fuente insiste: $m=0$ es la primera fila y $m=3$ la última; $n=0$ la primera columna y $n=15$ la última.

**El ejemplo de la fuente**, paso 2.4.4.4, vale como control de que se está leyendo bien:

$$B_3 = 42_{10} = \texttt{101010}_2 \ \Rightarrow\ m = \texttt{1}\,\texttt{0} = 2, \quad n = \texttt{0101} = 5 \ \Rightarrow\ B_3 \leftarrow S_3(2,5) = 15$$

Al buscarlo en la tabla $S_3$ de abajo, fila 2, columna 5, da 15. Si da otra cosa, las filas y columnas se están leyendo al revés.

> **Los bits de los extremos son los que eligen la fila, y eso no es un capricho** *(lectura nuestra).* Justamente los bits 1 y 6 de cada $B_j$ son los **compartidos** con las cajas vecinas por la expansión $E$. O sea: **los bits duplicados eligen en cuál de las cuatro sustituciones distintas se cae**, y los cuatro bits propios eligen la entrada dentro de esa sustitución. Las cuatro filas de cada caja son cuatro permutaciones distintas de $\{0,\dots,15\}$ (se puede comprobar: en cada fila de cada tabla aparecen los 16 valores exactamente una vez), así que $S_j$ es *"una de cuatro sustituciones de 4 bits, elegida por dos bits de contexto"*.

#### Las ocho tablas

**Caja $S_1$**

| $m \backslash n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **0** | 14 | 4 | 13 | 1 | 2 | 15 | 11 | 8 | 3 | 10 | 6 | 12 | 5 | 9 | 0 | 7 |
| **1** | 0 | 15 | 7 | 4 | 14 | 2 | 13 | 1 | 10 | 6 | 12 | 11 | 9 | 5 | 3 | 8 |
| **2** | 4 | 1 | 14 | 8 | 13 | 6 | 2 | 11 | 15 | 12 | 9 | 7 | 3 | 10 | 5 | 0 |
| **3** | 15 | 12 | 8 | 2 | 4 | 9 | 1 | 7 | 5 | 11 | 3 | 14 | 10 | 0 | 6 | 13 |

**Caja $S_2$**

| $m \backslash n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **0** | 15 | 1 | 8 | 14 | 6 | 11 | 3 | 4 | 9 | 7 | 2 | 13 | 12 | 0 | 5 | 10 |
| **1** | 3 | 13 | 4 | 7 | 15 | 2 | 8 | 14 | 12 | 0 | 1 | 10 | 6 | 9 | 11 | 5 |
| **2** | 0 | 14 | 7 | 11 | 10 | 4 | 13 | 1 | 5 | 8 | 12 | 6 | 9 | 3 | 2 | 15 |
| **3** | 13 | 8 | 10 | 1 | 3 | 15 | 4 | 2 | 11 | 6 | 7 | 12 | 0 | 5 | 14 | 9 |

**Caja $S_3$**

| $m \backslash n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **0** | 10 | 0 | 9 | 14 | 6 | 3 | 15 | 5 | 1 | 13 | 12 | 7 | 11 | 4 | 2 | 8 |
| **1** | 13 | 7 | 0 | 9 | 3 | 4 | 6 | 10 | 2 | 8 | 5 | 14 | 12 | 11 | 15 | 1 |
| **2** | 13 | 6 | 4 | 9 | 8 | 15 | 3 | 0 | 11 | 1 | 2 | 12 | 5 | 10 | 14 | 7 |
| **3** | 1 | 10 | 13 | 0 | 6 | 9 | 8 | 7 | 4 | 15 | 14 | 3 | 11 | 5 | 2 | 12 |

**Caja $S_4$**

| $m \backslash n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **0** | 7 | 13 | 14 | 3 | 0 | 6 | 9 | 10 | 1 | 2 | 8 | 5 | 11 | 12 | 4 | 15 |
| **1** | 13 | 8 | 11 | 5 | 6 | 15 | 0 | 3 | 4 | 7 | 2 | 12 | 1 | 10 | 14 | 9 |
| **2** | 10 | 6 | 9 | 0 | 12 | 11 | 7 | 13 | 15 | 1 | 3 | 14 | 5 | 2 | 8 | 4 |
| **3** | 3 | 15 | 0 | 6 | 10 | 1 | 13 | 8 | 9 | 4 | 5 | 11 | 12 | 7 | 2 | 14 |

**Caja $S_5$**

| $m \backslash n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **0** | 2 | 12 | 4 | 1 | 7 | 10 | 11 | 6 | 8 | 5 | 3 | 15 | 13 | 0 | 14 | 9 |
| **1** | 14 | 11 | 2 | 12 | 4 | 7 | 13 | 1 | 5 | 0 | 15 | 10 | 3 | 9 | 8 | 6 |
| **2** | 4 | 2 | 1 | 11 | 10 | 13 | 7 | 8 | 15 | 9 | 12 | 5 | 6 | 3 | 0 | 14 |
| **3** | 11 | 8 | 12 | 7 | 1 | 14 | 2 | 13 | 6 | 15 | 0 | 9 | 10 | 4 | 5 | 3 |

**Caja $S_6$**

| $m \backslash n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **0** | 12 | 1 | 10 | 15 | 9 | 2 | 6 | 8 | 0 | 13 | 3 | 4 | 14 | 7 | 5 | 11 |
| **1** | 10 | 15 | 4 | 2 | 7 | 12 | 9 | 5 | 6 | 1 | 13 | 14 | 0 | 11 | 3 | 8 |
| **2** | 9 | 14 | 15 | 5 | 2 | 8 | 12 | 3 | 7 | 0 | 4 | 10 | 1 | 13 | 11 | 6 |
| **3** | 4 | 3 | 2 | 12 | 9 | 5 | 15 | 10 | 11 | 14 | 1 | 7 | 6 | 0 | 8 | 13 |

**Caja $S_7$**

| $m \backslash n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **0** | 4 | 11 | 2 | 14 | 15 | 0 | 8 | 13 | 3 | 12 | 9 | 7 | 5 | 10 | 6 | 1 |
| **1** | 13 | 0 | 11 | 7 | 4 | 9 | 1 | 10 | 14 | 3 | 5 | 12 | 2 | 15 | 8 | 6 |
| **2** | 1 | 4 | 11 | 13 | 12 | 3 | 7 | 14 | 10 | 15 | 6 | 8 | 0 | 5 | 9 | 2 |
| **3** | 6 | 11 | 13 | 8 | 1 | 4 | 10 | 7 | 9 | 5 | 0 | 15 | 14 | 2 | 3 | 12 |

**Caja $S_8$**

| $m \backslash n$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **0** | 13 | 2 | 8 | 4 | 6 | 15 | 11 | 1 | 10 | 9 | 3 | 14 | 5 | 0 | 12 | 7 |
| **1** | 1 | 15 | 13 | 8 | 10 | 3 | 7 | 4 | 12 | 5 | 6 | 11 | 0 | 14 | 9 | 2 |
| **2** | 7 | 11 | 4 | 1 | 9 | 12 | 14 | 2 | 0 | 6 | 10 | 13 | 15 | 3 | 5 | 8 |
| **3** | 2 | 1 | 14 | 7 | 4 | 10 | 8 | 13 | 15 | 12 | 9 | 0 | 3 | 5 | 6 | 11 |

Son $8 \times 4 \times 16 = 512$ valores de 4 bits, o sea **256 bytes de tablas**. Ese cuarto de kilobyte es, literalmente, *todo* lo que hace fuerte a DES.

> **Por qué: las cajas $S$ son el único paso no lineal de todo el algoritmo** *(lectura nuestra — la fuente enumera los pasos y no analiza ninguno).* Basta con revisar la lista completa de operaciones de DES: $\mathrm{IP}$, $\mathrm{IP}^{-1}$, PC-1, PC-2, $E$, $P$ y las rotaciones son **permutaciones y selecciones de bits**, y el resto son **xores**. Todo eso es **lineal sobre $\mathrm{GF}(2)$**. Si las cajas $S$ también lo fueran, DES entero sería una función lineal de la clave y del plano, y se lo despacharía resolviendo un sistema de 64 ecuaciones: quebrado con un puñado de pares plano/cifrado, sin fuerza bruta ni nada. Las ocho tablas son **la única fuente de no-linealidad**, y por eso son el objeto que se ataca — el [[des-y-3des#Evolución: cómo se erosionó|criptoanálisis diferencial y el lineal]] son, precisamente, técnicas para aprovechar el sesgo residual de estas tablas. Que el mejor ataque diferencial conocido necesite $2^{47}$ textos elegidos y el lineal $2^{43}$ conocidos —volúmenes inalcanzables en la práctica— en vez de quebrar DES de entrada es mérito de estos 256 bytes.

Y el otro rol, ya en el terreno de la ingeniería: el paso $6 \to 4$ **destruye información** — cada salida de 4 bits tiene cuatro preimágenes de 6 dentro de su fila. Es lo que vuelve a $F$ no invertible y lo que obliga a que la estructura sea de **Feistel** y no un cifrado directo.

### 5.4. Permutación P (32 → 32 bits)

Paso 2.4.5. Se concatenan las ocho salidas de 4 bits y se reordenan los 32:

$$
\begin{array}{rrrrrrrr}
16 &  7 & 20 & 21 & 29 & 12 & 28 & 17\\
 1 & 15 & 23 & 26 &  5 & 18 & 31 & 10\\
 2 &  8 & 24 & 14 & 32 & 27 &  3 &  9\\
19 & 13 & 30 &  6 & 22 & 11 &  4 & 25
\end{array}
$$

Ese resultado es la salida de $F$, y es lo que se xorea con $L_{i-1}$ para dar $R_i$.

> **Para qué está $P$** *(lectura nuestra — la fuente no lo comenta).* Sin $P$, los 4 bits que salen de $S_j$ volverían a entrar más o menos a la misma caja en la ronda siguiente, y DES serían **ocho cifradores de 4 bits corriendo en paralelo, casi independientes**. $P$ es lo que impide eso: **dispersa** los 4 bits de cada caja hacia cajas distintas de la ronda que viene. Al seguir los 4 bits que salen de $S_1$, que ocupan las posiciones $1\text{–}4$ antes de $P$, se ve que la tabla los manda a las posiciones **9, 17, 23 y 31**, y en la ronda siguiente $E$ las reparte entre $S_2/S_3$, $S_4/S_5$, $S_6$ y $S_8$ — cuatro destinos disjuntos *(cuenta nuestra, siguiendo las dos tablas)*. $E$ **difunde hacia atrás** (un bit de entrada alcanza dos cajas), $P$ **difunde hacia adelante** (los 4 bits de una misma caja terminan en cajas distintas). Es la mitad *difusión* del par confusión/difusión de Shannon, y las cajas $S$ son la mitad *confusión* — la misma pareja **sustitución + transposición** de los [[cifrado-por-transposicion|cifrados clásicos]], pero iterada 16 veces sobre bits.

---

## 6. El key schedule: generación de las 16 subclaves

Es la **Figura 2** del PDF y el paso 1.2 de la descripción. Tres piezas: PC-1 una vez, y después rotación + PC-2 dieciséis veces.

### 6.1. PC-1: de 64 a 56 bits, y el corte en C_0 / D_0

Paso 1.2.1. Antes, el paso 1.1 aclara qué se hace con la clave del usuario:

> *"Solicitar una clave de 64 bits al usuario. La clave se puede introducir directamente o puede ser el resultado de alguna operación anterior, ya que no hay ninguna especificación al respecto. De cada uno de los ocho bytes se elimina el octavo bit (el menos significativo)."*

O sea: **DES no especifica de dónde sale la clave**. La generación es problema de quien lo usa, y ahí es donde después aparecen las claves débiles de la sección 6.4.

La tabla PC-1, reagrupada en **8 filas de 7**:

$$
\begin{array}{rrrrrrr}
57 & 49 & 41 & 33 & 25 & 17 &  9\\
 1 & 58 & 50 & 42 & 34 & 26 & 18\\
10 &  2 & 59 & 51 & 43 & 35 & 27\\
19 & 11 &  3 & 60 & 52 & 44 & 36\\
63 & 55 & 47 & 39 & 31 & 23 & 15\\
 7 & 62 & 54 & 46 & 38 & 30 & 22\\
14 &  6 & 61 & 53 & 45 & 37 & 29\\
21 & 13 &  5 & 28 & 20 & 12 &  4
\end{array}
$$

> **El PDF la imprime en 7 filas de 8 y eso esconde el corte** *(lectura nuestra).* La secuencia de 56 números es exactamente la misma —lo verificamos entrada por entrada—, pero en la grilla de 8 columnas del PDF el bit 28 de la salida cae en el medio de una fila y **no se ve dónde termina $C_0$**. Reagrupada en $8 \times 7$, como está arriba, el corte queda en la mitad de la tabla:
>
> - **$C_0$** = las **4 primeras filas** = los 28 primeros bits de la salida.
> - **$D_0$** = las **4 últimas filas** = los 28 restantes.

Y el dato que confirma que la tabla hace lo que dice el paso 1.1: **ningún múltiplo de 8 aparece en PC-1**. Los bits $8, 16, 24, 32, 40, 48, 56, 64$ —uno por byte, los de **paridad**— son exactamente los 8 que se caen. Nunca entran al key schedule, y por eso el nivel efectivo es $2^{56}$ y no $2^{64}$: es el primer número de la [[des-y-3des|nota de concepto]], acá verificado sobre la tabla.

> **Errata de la fuente.** En la **Figura 2** (página 3), el bloque de PC-1 está rotulado ***"(54 bits)"***. Son **56**. Lo dice el propio texto en el paso 1.2.1 (*"reduciéndose la misma a 56 bits"*), lo dice la figura dos renglones más abajo ($C_0$ y $D_0$ de 28 bits cada una, $28 + 28 = 56$) y lo dice la tabla, que tiene 56 entradas. Es un tipeo.

### 6.2. El calendario de rotaciones

Paso 1.2.3.1. En cada ronda, $C_{i-1}$ y $D_{i-1}$ se rotan **circularmente a izquierda**, cada una por su cuenta, una cantidad de bits que **no siempre es la misma**:

$$C_i = C_{i-1} \lll r_i, \qquad D_i = D_{i-1} \lll r_i$$

| Ronda $i$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Bits $r_i$ | **1** | **1** | 2 | 2 | 2 | 2 | 2 | 2 | **1** | 2 | 2 | 2 | 2 | 2 | 2 | **1** |

Las rotaciones de **1 bit** caen en las rondas **1, 2, 9 y 16**; las otras doce son de **2 bits**.

> **Al sumar la fila se ve lo que da** *(cuenta nuestra — la fuente da la tabla y no la comenta).*
>
> $$\sum_{i=1}^{16} r_i \;=\; 4\cdot 1 + 12 \cdot 2 \;=\; 4 + 24 \;=\; \mathbf{28}$$
>
> Veintiocho, que es **exactamente el largo de $C_i$ y de $D_i$**. Una rotación circular de 28 posiciones sobre 28 bits es la identidad, así que
>
> $$C_{16} = C_0 \qquad\text{y}\qquad D_{16} = D_0$$
>
> **el key schedule vuelve al punto de partida.** Y eso no es una curiosidad: es lo que hace que el schedule se pueda correr **hacia atrás** con el mismo hardware. Para descifrar hay que ir generando $K_{16}, K_{15}, \dots, K_1$ en ese orden; arrancando de $C_{16}, D_{16}$ —que **son** $C_0, D_0$, o sea que salen de PC-1 igual que al cifrar— y **rotando a derecha** con la misma tabla leída al revés, se obtienen las subclaves en orden inverso sin guardar ninguna. En los 70, ahorrarse $16 \times 48 = 768$ bits de registro era una diferencia real. Que la suma dé 28 y no 27 ni 29 es una **decisión de diseño**, no una casualidad.

### 6.3. PC-2: de 56 a 48 bits (la permutación de compresión)

Paso 1.2.3.2. Se concatenan $C_i$ y $D_i$ (56 bits) y se eligen 48, permutados. La tabla, reagrupada en **8 filas de 6** por la misma razón que $E$ y PC-1 —el PDF la imprime en 6 filas de 8—:

$$
\begin{array}{rrrrrr}
14 & 17 & 11 & 24 &  1 &  5\\
 3 & 28 & 15 &  6 & 21 & 10\\
23 & 19 & 12 &  4 & 26 &  8\\
16 &  7 & 27 & 20 & 13 &  2\\
41 & 52 & 31 & 37 & 47 & 55\\
30 & 40 & 51 & 45 & 33 & 48\\
44 & 49 & 39 & 56 & 34 & 53\\
46 & 42 & 50 & 36 & 29 & 32
\end{array}
$$

Acá los índices van del 1 al 56 sobre la concatenación $C_i \Vert D_i$: los valores $1\text{–}28$ son bits de $C_i$ y los $29\text{–}56$ son bits de $D_i$.

> **Dos cosas que se leen de la tabla y la fuente no dice** *(cuentas nuestras, verificadas entrada por entrada).*
>
> **1. El corte es limpio: 24 bits de cada mitad.** Los **24 primeros** valores de PC-2 son todos $\le 28$ y los **24 últimos** son todos $\ge 29$. O sea: la primera mitad de cada subclave sale íntegra de $C_i$ y la segunda de $D_i$, sin mezclarse. Eso confirma sobre la tabla lo que la filmina de la cátedra dice en prosa (*"24 bits de cada mitad"*) — y de paso confirma que **la separación en dos mitades la hace PC-1, no PC-2**, que es la [[des-y-3des#Generación de subclaves|errata de redacción marcada en la nota de concepto]].
>
> **2. Qué 8 bits se descartan en cada ronda.** Faltan cuatro índices de cada mitad:
>
> | Mitad | Posiciones que PC-2 **no** toma |
> |---|---|
> | $C_i$ (1–28) | 9, 18, 22, 25 |
> | $D_i$ (29–56) | 35, 38, 43, 54 |
>
> $56 - 8 = 48$. Y como los que se descartan son **posiciones fijas** mientras el contenido **rota**, el bit que se pierde en la ronda $i$ **reaparece** en la ronda siguiente. Ningún bit de la clave queda excluido del schedule: como en cada ronda se caen $4$ de las $28$ posiciones de cada mitad, un bit dado se pierde en $16 \cdot \tfrac{4}{28} \approx 2{,}3$ rondas y **participa en unas 14 de las 16 subclaves** *(cuenta nuestra, es un promedio)*. Si los descartes fueran siempre los mismos *bits* en vez de las mismas *posiciones*, DES tendría una clave efectiva de 48 y no de 56.

### 6.4. El corolario: las claves débiles

Todo lo de esta sección 6 es **exactamente** la maquinaria que explica el **Ejercicio 8 de la Guía 2** (*"analizar por qué una clave con todos sus bits en 0, o todos en 1, es débil"*). La cadena de razonamiento, en tres renglones:

1. Una cadena queda fija bajo la **rotación de 1 bit** —la de la ronda 1, y con eso bajo **todas** las del calendario de 6.2— **si y sólo si** es **constante** (todo ceros o todo unos). Con $C_0 = 0^{28}$, la tabla de rotaciones no la mueve nunca: $C_i = C_0$ para toda $i$.
2. Como PC-2 es una **función fija de $(C_i, D_i)$**, si las mitades no cambian entonces $K_1 = K_2 = \dots = K_{16}$: **las 16 subclaves salen idénticas**.
3. Y en una red de Feistel descifrar es correr el mismo circuito con las subclaves al revés — que si son todas iguales es **la misma secuencia**. Entonces $\mathsf{Enc}_K = \mathsf{Dec}_K$ y $\mathsf{Enc}_K(\mathsf{Enc}_K(x)) = x$.

> **El "si y sólo si" del punto 1 hay que atarlo a la rotación de 1** *(precisión nuestra).* Enunciado para *una rotación cualquiera* es **falso**: la cadena alternada $(01)^{14}$ rotada **2** posiciones queda idéntica y no es constante — y la tabla de 6.2 rota 2 en **doce de las dieciséis** rondas. Lo que fuerza la constancia es la **ronda 1**, que rota exactamente 1: de $C_1 = C_0$ sale $C_0 \lll 1 = C_0$, y una cadena en la que cada bit es igual al siguiente es constante. De las otras dos cadenas de 28 bits que la rotación de 2 deja fijas —$(01)^{14}$ y $(10)^{14}$— salen las **claves semi-débiles**, que generan 2 subclaves distintas en vez de 1 y vienen de a pares; están desarrolladas en la [[des-y-3des#Las claves semi-débiles|nota de concepto]].

O sea: la debilidad **no está en las cajas $S$ ni en las rondas**, está enteramente en el key schedule — y más precisamente en que PC-1 más rotaciones puede tener **puntos fijos**. Como cada mitad tiene 2 valores constantes posibles, hay $2 \times 2 = 4$ claves débiles; y admitiendo además las dos mitades **alternadas**, otras 12 claves semi-débiles agrupadas en 6 pares.

La resolución completa —la demostración formal, las cuatro claves en hexadecimal, el papel de los bits de paridad y por qué el impacto práctico es casi nulo pero el riesgo de un `Gen` mal hecho no— está en **[[guia-02-criptografia-simetrica#Ejercicio 8|Guía 2 — Resolución, Ejercicio 8]]**; la definición que da la cátedra —*"en lugar de generar 16 subclaves distintas, genera 1"* para las débiles, *"2 o 4"* para las semi-débiles— es de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]] del 24/08.

---

## 7. Intercambio final e IP inversa

Etapas 18 y 19. El paso 2.5 de la fuente lo dice con una advertencia:

> *"Hacer la siguiente permutación del bloque R(16)L(16). **Obsérvese que esta vez R(16) precede a L(16)**"*

$$
\begin{array}{rrrrrrrr}
40 &  8 & 48 & 16 & 56 & 24 & 64 & 32\\
39 &  7 & 47 & 15 & 55 & 23 & 63 & 31\\
38 &  6 & 46 & 14 & 54 & 22 & 62 & 30\\
37 &  5 & 45 & 13 & 53 & 21 & 61 & 29\\
36 &  4 & 44 & 12 & 52 & 20 & 60 & 28\\
35 &  3 & 43 & 11 & 51 & 19 & 59 & 27\\
34 &  2 & 42 & 10 & 50 & 18 & 58 & 26\\
33 &  1 & 41 &  9 & 49 & 17 & 57 & 25
\end{array}
$$

El resultado es el bloque cifrado de 64 bits.

> **Por qué ese intercambio no es un detalle cosmético** *(lectura nuestra — la fuente lo enuncia como una etapa más y no lo justifica).* Cada ronda de Feistel termina cruzando las mitades. Después de la ronda 16 se queda con $(L_{16}, R_{16})$, que ya viene *cruzado*: si escribieras el criptograma en ese orden, para descifrar necesitarías un circuito **distinto** del de cifrar. Escribirlo como $R_{16} \Vert L_{16}$ **deshace el cruce de la última ronda** y deja la estructura simétrica: correr el mismo circuito con $K_{16},\dots,K_1$ devuelve el plano. Ese único intercambio es lo que compra *"cifrar y descifrar son el mismo hardware"*. Al quitarlo, DES deja de tener esa propiedad — que era **la** razón de elegir Feistel.

---

## 8. Descifrado

La fuente lo despacha en tres renglones (sección *(ii)*):

> *"Usar el mismo proceso descrito con anterioridad pero empleando las subclaves en orden inverso, esto es, en lugar de aplicar K(1) para la primera iteración aplicar K(16), K(15) para la segunda y así hasta K(1)."*

**Nada más cambia**: las mismas $\mathrm{IP}$, $\mathrm{IP}^{-1}$, $E$, cajas $S$, $P$, el mismo intercambio final. Sólo se invierte el orden de las 16 subclaves. La fuente **no demuestra** que eso funcione, lo afirma; la razón estructural está en la [[des-y-3des#Estructura: red de Feistel|nota de concepto]] y se usa como Pieza 1 en el [[guia-02-criptografia-simetrica#Ejercicio 8|Ejercicio 8 de la Guía 2]].

Y una consecuencia inmediata para implementar: por lo visto en 6.2, **$C_{16} = C_0$ y $D_{16} = D_0$**, así que las subclaves de descifrado se generan con el mismo PC-1 y **rotando a derecha** — no hace falta almacenar las 16.

---

## 9. Vectores de prueba

Última página del PDF. Son para verificar una implementación propia: si estos cuatro dan, casi seguro está bien.

| # | Bloque a cifrar (hex) | Clave (hex) | Cifrado (hex) |
|---|---|---|---|
| 1 | `0123456789abcdef` | `133457799BBCDFF1` | `85E813540F0AB405` |
| 2 | `8787878787878787` | `0E329232EA6D0D73` | `0000000000000000` |

Los otros dos son de varios bloques:

**Ejemplo 3** — texto `"Your lips are smoother than vaseline"` (36 caracteres $+$ `Chr(13)` $+$ `Chr(10)`, o sea CR y LF: **38 bytes**), clave `0E329232EA6D0D73`:

- Plano en hexadecimal, ya con relleno: `596f7572206c6970 732061726520736d 6f6f746865722074 68616e2076617365 6c696e650d0a0000`
- Cifrado: `C0999FDDE378D7ED 727DA00BCA5A84EE 47F269A4D6438190 D9D52F78F5358499 828AC9B453E0E653`

**Ejemplo 4** — texto `"Now is the time for all "` (24 caracteres, **con el espacio final**), clave `0123456789ABCDEF`:

- Plano: `4e6f772069732074 68652074696d6520 666f7220616c6c20`
- Cifrado: `3FA40E8A984D4815 6A271787AB8883F9 893D51EC4B563B53`

Tres cosas que hay que sacar de acá antes de sentarse a debuggear:

- **El relleno del Ejemplo 3 son bytes en cero.** 38 bytes no son múltiplo de 8, así que el PDF completa con `0000` hasta 40 y lo rotula, en la propia página, como *"Relleno"*. **No** es ninguno de los esquemas de [[primitiva-de-cifrado-en-bloque|padding]] que da la cátedra: rellenar con ceros es ambiguo al desarmar (no se sabe si el último `00` era relleno o parte del mensaje) y por eso no se usa en serio. Para reproducir el vector hay que rellenar con ceros igual.
- **La fuente no dice en qué modo cifra los ejemplos 3 y 4.** Se ven bloque a bloque, con la misma clave y sin ningún IV a la vista, lo que es compatible con `ECB` *(lectura nuestra)*; pero el documento **no lo declara** y no hay bloques planos repetidos que lo confirmen. Si tu implementación no reproduce estos vectores, ese es el primer supuesto a revisar. Los [[modos-de-encadenamiento|modos de encadenamiento]] explican por qué la diferencia importa y por qué `ECB` está prohibido en producción.
- **El Ejemplo 2 es un lindo recordatorio de que la salida no "parece" nada.** Un plano de bytes todos iguales cifra a **64 ceros**. No hay ninguna relación visible entre la pinta del plano y la del cifrado, que es la idea.

Para código que ya hace esto, la nota que junta las implementaciones de referencia del vault —incluida la [`Implementación DES en JAVA.txt`](../../raw/apuntes/Implementaci%C3%B3n%20DES%20en%20JAVA.txt) de `raw/apuntes/`, que sale del mismo *Material Didáctico/Extra* que este apunte— es [[implementaciones-de-referencia|Implementaciones de referencia]].

---

## 10. Erratas y descuidos de la fuente

Todas verificadas contra el propio documento. Ninguna afecta a las tablas —que están **completas y correctas**—, pero varias hacen perder tiempo si se siguen los pasos al pie de la letra.

| Dónde | Qué dice | Qué debería decir | Cómo se detecta |
|---|---|---|---|
| **Figura 2**, p. 3 | PC-1 rotulada *"(54 bits)"* | **56 bits** | El paso 1.2.1 dice 56, la figura muestra $28+28$, y la tabla tiene 56 entradas |
| **Paso 2.4.1** | *"E(R(i)). Expandir R(i) de 32 a 48 bits"* | $E(R_{i-1})$ — la mitad derecha **anterior** | El paso siguiente ya escribe $E(R_{i-1}) \oplus K_i$, y la ecuación de Feistel usa $R_{i-1}$. Con $R_i$ la recursión ni siquiera está definida |
| **Pasos 2.4.5 y 2.4.6** | El mismo paso **dos veces**: la permutación $P$ aparece duplicada, con el texto y la tabla idénticos | Un solo paso | Al compararlos renglón a renglón, la numeración queda inflada |
| **Pasos 2.4.5 / 2.4.6** | $P[S(1)(B(1))\dots S(2)(B(8))]$ | $S_8(B_8)$, **no** $S_2(B_8)$ | Cada $B_j$ va a **su** caja $S_j$; el propio paso 2.4.4 lo dice bien |
| **Paso 2.4.5.1** | *"Volver a 2.4.4.1. hasta que todos los bloques B(j) hayan sido reemplazados"* | Nada: ahí ya se reemplazaron todos | Es una copia literal del paso 2.4.4.5, pegada donde no va |
| **Paso 1.2.1** | *"el bit 2 pasa a ser el bit 49"* | *"el bit 2 de la clave transformada **es** el bit 49 de la original"* | Contradice a la primera mitad de la misma frase, que sí está bien |

> **Y un descuido que no es errata sino de maquetación:** el PDF fuerza **todas** sus tablas a una grilla de 8 columnas, incluso las que no tienen 8 de ancho. PC-1 sale en $7 \times 8$ y PC-2 y $E$ en $6 \times 8$. Las secuencias de números son **correctas** —las verificamos entrada por entrada contra el reagrupamiento—, pero la forma impresa **destruye la estructura**: en $E$ y PC-2 cada fila debería ser un grupo de 6 (una caja $S$, media subclave), y en PC-1 el corte de la mitad de la tabla es el corte $C_0 / D_0$. Por eso en esta nota están reagrupadas.

---

## 11. Qué no está en esta fuente

Para que no la busques donde no está:

- **No hay análisis de seguridad.** Ni criptoanálisis diferencial, ni lineal, ni fuerza bruta, ni la discusión sobre los 56 bits. Es de **1999** y describe DES como algoritmo vigente. Todo eso está en [[des-y-3des|DES y 3-DES]] y en [[estado-de-un-criptosistema|Estado de un criptosistema]].
- **No hay 3-DES**, ni meet-in-the-middle, ni los 112 bits.
- **No hay criterios de diseño.** No explica por qué las tablas son las que son, ni por qué 16 rondas. La fuente **enumera**; todo el "por qué" de esta nota está rotulado como lectura nuestra.
- **No hay modos de operación.** Los menciona al pasar en la introducción (*"en 1980, el NIST estandarizó los diferentes modos de operación"*) y no vuelve al tema. Ver [[modos-de-encadenamiento|Modos de encadenamiento]].
- **No hay padding especificado.** El paso 2.1 dice que un bloque corto *"debe ser completado"* y no dice cómo.
- **No dice de qué clase del cronograma cuelga** — y no podría: es de 1999 y no tiene nada que ver con la materia. Pero la cátedra sí lo ubica: la [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]] del 24/08 lo señala como *"el apunte e implementación DES"* de **Material Didáctico/Extra**, así que **cuelga del bloque de la [[clase-02-cifrado|Clase 02]]**. Su aplicación directa es el Ejercicio 8 de la [[guia-02-criptografia-simetrica|Guía 2]].

---

## 12. Resumen de un vistazo

$$
\begin{aligned}
\textbf{Cifrado:}\quad & (L_0, R_0) = \mathrm{IP}(m)\\
& L_i = R_{i-1}, \qquad R_i = L_{i-1} \oplus F(R_{i-1}, K_i) \qquad i = 1 \dots 16\\
& c = \mathrm{IP}^{-1}(R_{16} \Vert L_{16})\\[0.6em]
\textbf{Función } F:\quad & F(R, K) = P\big(S(E(R) \oplus K)\big)\\[0.6em]
\textbf{Subclaves:}\quad & (C_0, D_0) = \text{PC-1}(k)\\
& C_i = C_{i-1} \lll r_i, \qquad D_i = D_{i-1} \lll r_i\\
& K_i = \text{PC-2}(C_i \Vert D_i)\\[0.6em]
\textbf{Descifrado:}\quad & \text{idéntico, con } K_{16}, K_{15}, \dots, K_1
\end{aligned}
$$

| Tabla | De → a | Qué hace | Dónde |
|---|---|---|---|
| **$\mathrm{IP}$** | 64 → 64 | permuta el bloque de entrada; parte en $L_0, R_0$ | sección 3 |
| **E** | 32 → 48 | expande con solapamiento circular; 8 grupos de 6 | sección 5.1 |
| **$S_1 \dots S_8$** | 48 → 32 | ocho sustituciones de 6→4; **el único paso no lineal** | sección 5.3 |
| **P** | 32 → 32 | dispersa las salidas de cada caja hacia cajas distintas | sección 5.4 |
| **PC-1** | 64 → 56 | descarta los 8 bits de paridad; parte en $C_0, D_0$ | sección 6.1 |
| **PC-2** | 56 → 48 | comprime: 24 bits de $C_i$ + 24 de $D_i$ → subclave | sección 6.3 |
| **$\mathrm{IP}^{-1}$** | 64 → 64 | la inversa de $\mathrm{IP}$, aplicada a $R_{16} \Vert L_{16}$ | sección 7 |

Los tres números para llevarse: **$4 \cdot 1 + 12 \cdot 2 = 28$** (la suma de las rotaciones, que cierra el key schedule), **$56 = 64 - 8$** (los bits de paridad que PC-1 tira) y **$256$ bytes** de cajas $S$, que es donde vive toda la no-linealidad de DES.

