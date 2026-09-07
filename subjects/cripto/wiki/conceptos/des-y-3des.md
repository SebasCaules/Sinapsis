---
title: DES y 3-DES
resumen: 'Primitiva de bloque de 64 bits con clave de 56 efectivos y red de Feistel de 16 rondas: la primera función de cifrado pública respaldada por un gobierno, con sus claves débiles y su erosión hasta 3-DES.'
fuentes: ["[[clase-02-cifrado]]", "[[guia-02-criptografia-simetrica]]", "[[guia-02-criptografia-simetrica]]", "[[practica-03-seudoaleatoriedad-y-modos]]"]
aliases: [DES, 3DES, 3-DES, Triple DES, Data Encryption Standard, Red de Feistel, Feistel]
type: concepto
unidad: 1
clase: 2
orden: 9
created: 2026-08-21
updated: 2026-09-06
tags: [criptografia, des, 3des, feistel, criptoanalisis-diferencial, criptoanalisis-lineal, claves-debiles, claves-semidebiles, key-schedule, guia-02, practica-03, clase-02, transcripcion]
sources: ["Clase 02 - Criptografia - Cifrado.pdf", "raw/guias/guia2/Guia 2 - Criptografía Simétrica.pdf", "raw/practicas/Clase 3.pdf", "raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# DES y 3-DES

La primitiva de bloque que **inauguró la criptografía pública**, y el caso de estudio de cómo un criptosistema se erosiona con los años.

---

## Qué fue DES

- Método desarrollado por **IBM**.
- Adoptado por el **gobierno de EE.UU.** como estándar para usos **no militares**.
  - **Fue la primera función de cifrado pública apoyada por un gobierno.**
  - Alcanzó **uso comercial masivo**.

| Característica | Valor |
|---|---|
| Textos planos | binarios |
| Entrada | **64 bits** |
| Clave | **64 bits** ($56$ efectivos) |
| Salida | **64 bits** |
| Rondas | **16** |

> **Los 8 bits que faltan.** De los 64 bits de clave, 8 son **de paridad** y no aportan seguridad: el nivel real es $2^{56}$. Es el primer número a recordar de esta nota.

**Y por qué existen esos 8 bits no es una decisión criptográfica: es compatibilidad de codificación de caracteres.** IBM venía de un código de caracteres de 7 bits y, al pasar a uno de 8, usó el bit sobrante de cada byte como **paridad**. DES hereda ese formato: la clave se escribe como 8 bytes, y el octavo bit de cada uno **no se puede elegir**, queda determinado por los otros siete. De ahí que el espacio sea $2^{56}$ y no $2^{64}$ — o, dicho como lo dice la clase, *"hay un montón de claves que no pueden usarse"*.

> [!quote]- De la transcripción — de dónde salen los 56 bits efectivos (cues pt2 116-121)
> *"La clave tiene 56 bits que son efectivos (…) la razón es que IBM trabajaba con un código que era el de BCDIC, que era de 7 bits. Entonces, cuando empiezan a usar ASCII, por temas de compatibilidad interna de IBM, para poder utilizar los dos sistemas, se crea de 7 bits **y con un bit de paridad**. Ésa es la diferencia de los 56 bits efectivos: **el octavo bit de cada uno de los 8 bytes que forman los 64 es el de paridad** (…) es un bit que uno no puede elegir libremente, es fijo, dada la paridad del byte al que está pegado. Por eso son 56 bits efectivos: hay un montón de claves que no pueden usarse."*

> **Precisión nuestra.** El código de 7 bits es **ASCII**; `BCDIC` es de 6 bits y su extensión `EBCDIC` de 8. El nombre parece un lapsus. El mecanismo que describe —un bit de paridad por byte— es el correcto, y es el que fija FIPS 46.

## Estructura: red de Feistel

![Estructura de Feistel — cifrado y descifrado](../../assets/clase02-des-feistel.png)

> - Se **parte el mensaje en dos mitades**.
> - Se **transforma una mitad** con parte de la clave.
> - Se **intercambian las dos mitades** de lugar.
> - Se repiten los tres pasos anteriores (**una ronda**) **16 veces**.

> **Lo que muestra el diagrama y la filmina no dice.** Nótense las dos columnas: **cifrar y descifrar son el mismo circuito**, y lo único que cambia es el **orden de las subclaves** ($K_0\dots K_n$ para cifrar, $K_n\dots K_0$ para descifrar). Esa es la gracia de Feistel:
>
> 1. **$F$ no necesita ser invertible.** Se puede diseñar la función de transformación pensando sólo en que mezcle bien, sin preocuparse por poder deshacerla. Por eso $F$ puede incluir una expansión de 32 a 48 bits, que destruye información.
> 2. **Una sola implementación sirve para las dos direcciones** — media el costo en hardware, que en los 70 era determinante.
>
> Esto la nota lo deducía del diagrama; **el 20/08 está dicho**, y con dos precisiones que el dibujo no da: que $\mathrm{IP}$ y $\mathrm{IP}^{-1}$ **son inversas la una de la otra por diseño**, y que la consecuencia es visible en el `decrypt` de la [[implementaciones-de-referencia|implementación de referencia]]. Es la Pieza 1 del [[guia-02-criptografia-simetrica#Ejercicio 8|Ej. 8 de la Guía 2]].

> [!quote]- De la transcripción — cifrar y descifrar con el mismo algoritmo, y cómo se ve en el código (cues pt2 368-373)
> *"Una cosa importante que no les dije, una ventaja piolísima: **el cifrado y el descifrado se hacen con el mismo algoritmo**. Y lo único que cambia es que **se invierte la función de permutación** que se aplica de forma inicial y final —por cómo están diseñadas, se invierten entre ellas— **y se invierte el orden de las claves**. Por eso es lo que vieron en el `decrypt` que estaba en el código (…) No se necesita otro algoritmo: simplemente se cambia el orden de algunas cosas y nada más."*

### La función de transformación

![La función F de DES](../../assets/clase02-des-funcion-f.png)

| Etapa | Qué hace |
|---|---|
| **E** → Expansión | **32 a 48 bits** |
| **Sx** → Sustituciones | **6 a 4 bits** (ocho cajas $S_1\dots S_8$) |
| **P** → Permutación | reordena los 32 bits de salida |

La media mitad expandida se xorea con la **subclave de 48 bits** antes de entrar a las cajas $S$.

> **Sustitución + permutación, otra vez.** Es la misma pareja de operaciones de los cifrados clásicos de la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] —[[cifrado-de-sustitucion-monoalfabetica|sustitución]] y [[cifrado-por-transposicion|transposición]]—, pero **iteradas 16 veces** y sobre bits en lugar de letras. Lo que allá era débil por separado, acá funciona por composición: las $S$ aportan no-linealidad y la $P$ difunde. Es el patrón que Shannon llamó *confusión y difusión*.

**El inventario de operaciones es cerrado, y de ahí sale todo lo demás.** DES *"busca difundir y confundir todo lo posible partiendo del plaintext, y aplicando rounds repetitivos sobre el mismo para enroscar; y aplica operaciones simples como **xor, sustituciones, permutaciones y shifts**"* (cues pt2 172-173). Nada más que eso — y como el xor, las permutaciones y los desplazamientos son **lineales sobre $\mathrm{GF}(2)$**, las cajas $S$ quedan como **el único paso no lineal** de todo el algoritmo. Es el argumento que la wiki venía haciendo por cuenta propia, y en el 20/08 lo hace el docente por el mismo camino.

> [!quote]- De la transcripción — las cajas S como el punto central y el blanco de todos los ataques (cues pt2 271-273, 303-306)
> *"Estas matrices son todos **parámetros fijos** de DES. Es como cosa mágica, **magic numbers** tirados por ahí, que nadie sabe bien por qué los pusieron. Pero sirven, dan buenos resultados, se probaron alternativas, y en general son los que mejor funcionan."*
>
> *"Esto es (…) arbitrario, una cosa media mágica, un numerito de una tablita. Pero es muy importante, porque **agrega una cuestión de no linealidad** media extraña al algoritmo. Se ha estudiado al infinito (…) y **es lo que más se lo ha atacado**, porque es el punto central del proceso de cifrado: si se fijan, todos los otros son permutaciones (…) está el xor con la clave, eso es cierto, pero **éste es el punto central**."*
>
> *(El cierre del cue 305 está degradado en el ASR; la frase sobre los otros pasos se reconstruye por el contexto, que el propio docente completa al excluir el xor a renglón seguido.)*

### Generación de subclaves

![Generación de subclaves de DES](../../assets/clase02-des-subclaves.png)

| Bloque | Qué hace |
|---|---|
| **PC1** | **Selección de 56 bits** — los 8 restantes son paridad |
| **$\lll$** | Desplazamiento **a nivel de bits** de cada mitad, en cada ronda |
| **PC2** | Genera la **subclave de 48 bits**, tomando **24 bits de cada mitad** |

> **Cuidado con la redacción de la filmina.** Dice *"PC2 → separación en dos mitades"*, pero el propio diagrama muestra que **la separación en dos mitades la hace PC1**: de ahí salen las dos ramas con sus $\lll$ independientes. **PC2 es la permutación de compresión** que junta 24 bits de cada mitad para armar la subclave de 48. Los sub-bullets de la filmina (*"generación de subclave"*, *"24 bits de cada mitad"*) sí describen a PC2 correctamente.
>
> **La transcripción del 20/08 respalda la corrección**, y de la boca del docente. Sobre PC-1: *"vos primero hacés esta permutación. Esto te queda dividido como en dos partes (…) te queda una parte como si fuese izquierda y derecha"* (cue pt2 205). Y sobre PC-2: *"tiene una entrada que es 56 y la salida de 48 es más chiquita: **hay valores que no quedan elegidos por la permutación y que mueren ahí en la PC-2**. Entonces cada una de las 16 claves es de 48; no es ni de 56 ni de 64"* (cues pt2 218-222).

**Por qué se llama expansión si nada se agranda.** La objeción la plantea un alumno en clase —*"cambio el orden de los números, me quedaría el vector o matriz del mismo tamaño"* (cue pt2 197)— y tiene razón sobre cada paso individual. La respuesta es que el nombre describe el **resultado global**, no una operación: *"vas a generar 16 claves. Por eso se llama expansión: porque agarrás el material de la clave original y lo usás para generar 16 claves internas"* (cues pt2 209-212). Y el calendario de rotaciones, que parece arbitrario, no lo es: *"lo decidió la gente que elaboró DES por muchos testeos que hicieron para minimizar cualquier tipo de correlación entre la entrada y la salida"* (cues pt2 216-217).

### Media clase dictada sobre el código, no sobre el PDF

Un dato de procedencia que conviene tener a mano al estudiar esta nota: **entre los cues pt2 167 y 317 del 20/08 el docente deja las filminas y explica DES sobre su propia implementación en Java** — la misma que reparte como [[implementaciones-de-referencia|implementación de referencia]]. Tres cosas que **ninguna filmina de la cátedra trae** salen de ahí:

- **Qué es una matriz de permutación**: guarda **índices**, y en la posición $j$ de la salida va el bit que estaba en la posición que la tabla lista en $j$ (cues pt2 182-188).
- **Cómo una permutación agranda**: la expansión $E$ de $32$ a $48$ bits *"lo único que hace es repetir índices"* (cues pt2 260-271). No es una biyección, es una selección con repetición — y por eso $F$ **no es invertible**, que es justamente lo que la red de Feistel permite.
- **Cómo se lee una caja $S$**: la fila sale de $2b_1 + b_6$ y la columna de los cuatro bits del medio (cues pt2 292-302), que es exactamente la regla que tabula [[des-descripcion-del-algoritmo|Descripción del algoritmo DES]].

> [!quote]- De la transcripción — qué es una matriz de permutación, y cómo una permutación agranda de 32 a 48 (cues pt2 182-188, 260-271)
> *"La matriz me dice **los índices**: en cada posición tiene el índice que va en esa posición. Por ejemplo, en el 0 tiene 4 y en el 1 tiene 3; entonces, cuando aplico esa matriz de permutación, en la posición 0 pongo el 4 y en la 1 pongo el 3, de los originales que yo tenía. Con eso tengo un output que es permutar todos los valores (…) va a quedar lo mismo que tenía, pero ordenado de otra manera."*
>
> Y la pregunta que abre la función $E$: *"¿Se imaginan cómo puedo hacer un vector de permutación a nivel bits para que tenga de entrada 32 y de salida 48? (…) Es mucho más simple: **lo único que hacen es repetir índices**. Entonces van a tener de entrada un valor y de salida un valor más grande, porque se están repitiendo índices."*

> [!quote]- De la transcripción — cómo se lee una caja $S$ (cues pt2 292-302)
> *"Cada uno de esos $S_i$ (…) actúan como la entrada de **una fila y una columna a una matriz**. La fila se calcula como $2b_1 + b_6$, o sea el valor del bit que está en $b_6$ más el valor de $b_1$ por 2; **y la columna se calcula con los bits [del medio]** armados de esta manera. Con esto tienen la fila y la columna para las cajas $S$ (…) y ahí obtienen un valor de salida que tiene **4 bits fijo**."*

> **Precisión nuestra sobre el tamaño de las cajas.** El docente dice *"son 8 matrices de 8 por 8"* (cue pt2 307). Las cajas son **ocho**, sí, pero cada una es $4\times 16$: 4 filas (los 2 bits de los extremos) por 16 columnas (los 4 del medio). El total es $8\cdot 4\cdot 16 = 512$ valores de 4 bits, o sea 256 bytes.

---

## Claves débiles

Un corolario directo de las **dos secciones anteriores** —la red de Feistel y el key schedule—, el contenido del [[guia-02-criptografia-simetrica#Ejercicio 8|Ej. 8 de la Guía 2]] y una filmina propia de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]] del 24/08. Esta nota trae por qué una clave de DES puede degenerar el cifrado, por qué existen además **pares** de claves que se anulan entre sí, y por qué la falla **no está en el algoritmo de cifrado sino en cómo se derivan las subclaves**.

### La definición

Una clave $K$ es **débil** si

$$\mathsf{Enc}_K\big(\mathsf{Enc}_K(x)\big) = x \qquad \text{para todo } x$$

o sea si $\mathsf{Enc}_K$ es una **involución**: $\mathsf{Enc}_K = \mathsf{Enc}_K^{-1} = \mathsf{Dec}_K$. Dicho en criollo, **cifrar y descifrar son la misma operación**, y aplicar el cifrado dos veces devuelve el original. Es una degeneración total: quien intercepte el criptograma y sospeche que la clave es débil lo descifra corriendo el cifrador.

> **Cómo lo escribe la cátedra, y por qué esa forma es mejor.** La filmina de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]] pone la definición al revés:
>
> $$\mathsf{Enc}_K(m) = \mathsf{Dec}_K(m) \qquad \text{o sea} \qquad \mathsf{Enc}_K\big(\mathsf{Enc}_K(m)\big) = m$$
>
> Las dos son **equivalentes** —se aplica $\mathsf{Enc}_K$ a los dos lados de la primera y queda la segunda; se aplica $\mathsf{Dec}_K$ a los dos lados de la segunda y se vuelve a la primera—, pero la primera dice mejor **por qué** pasa: no es que el cifrado "se deshaga solo", es que **el cifrador y el descifrador se volvieron la misma función**. Y la Práctica agrega la caracterización operativa, que es la que conviene memorizar: una clave débil, *"en lugar de generar 16 subclaves distintas, genera 1"*.

### Por qué ocurre: dos piezas que encajan

**Pieza 1 — La red de Feistel se invierte dando vuelta el orden de las subclaves.** Es exactamente lo que muestra el [[#Estructura: red de Feistel|diagrama de arriba]]: descifrar es correr **el mismo circuito** con las subclaves al revés.

$$\mathsf{Enc}_K \ \text{usa} \ K_1, K_2, \dots, K_{16} \qquad\qquad \mathsf{Dec}_K \ \text{usa} \ K_{16}, K_{15}, \dots, K_1$$

Es una propiedad **estructural de Feistel**, no una particularidad de DES.

**Pieza 2 — El key schedule puede producir 16 subclaves idénticas.** PC-1 parte la clave en dos mitades de 28 bits, $C_0$ y $D_0$, y cada ronda las **rota circularmente a izquierda**. El calendario **no rota siempre lo mismo**: las rondas 1, 2, 9 y 16 rotan **1 bit** y las otras doce rotan **2**. La cantidad que importa acá es la de la **primera** ronda:

$$C_0 \lll 1 = C_0 \quad\Longleftrightarrow\quad C_0 \ \text{es constante (todo ceros o todo unos)}$$

La ida es obvia. La vuelta también, y es de una línea: si rotar un lugar deja la cadena igual, entonces cada bit coincide con el siguiente, y recorriéndola entera todos resultan iguales. Y las constantes quedan fijas bajo **cualquier** rotación:

$$0^{28} \lll r = 0^{28}, \qquad 1^{28} \lll r = 1^{28} \qquad \text{para todo } r$$

> **El lema hay que enunciarlo con la rotación de 1, no con "una rotación".** Es tentador escribir *"una rotación circular deja fija a una cadena si y sólo si la cadena es constante"*, y el **sólo si** de esa versión es **falso**: la cadena alternada $(01)^{14}$ rotada **2** posiciones queda idéntica y no es constante — y el calendario de DES rota 2 en **12 de sus 16 rondas**. Lo que cierra el argumento es que la **ronda 1 rota exactamente 1 bit**: de $C_1 = C_0$ se sigue $C_0 \lll 1 = C_0$, y de ahí que $C_0$ sea constante. Enunciado así, "queda fija bajo la rotación de 1" implica "queda fija bajo **todas** las del calendario", que es lo que hace falta. Las cuatro cadenas de 28 bits que la rotación de **2** deja fijas —$0^{28}$, $1^{28}$, $(01)^{14}$ y $(10)^{14}$— son justamente de donde salen las [[#Las claves semi-débiles|claves semi-débiles]], que son otra cosa.

Entonces $C_i = C_0$ y $D_i = D_0$ **en todas las rondas** exactamente cuando las dos mitades son constantes; y como PC-2 es una función fija que sólo depende de $(C_i, D_i)$:

$$K_1 = K_2 = \dots = K_{16}$$

**Las 16 subclaves salen idénticas.**

**Las dos piezas juntas.** Si todas las subclaves son iguales, la secuencia invertida $K_{16}, \dots, K_1$ es **literalmente la misma** que la directa $K_1, \dots, K_{16}$. Por la Pieza 1, eso significa

$$\mathsf{Enc}_K = \mathsf{Dec}_K \quad\Longrightarrow\quad \mathsf{Enc}_K\big(\mathsf{Enc}_K(x)\big) = \mathsf{Dec}_K\big(\mathsf{Enc}_K(x)\big) = x \quad \text{para todo } x$$

que es la definición de clave débil. Y con eso queda claro **por qué la clave de todos ceros y la de todos unos califican**: los 56 bits que sobreviven a PC-1 siguen siendo todos ceros (o todos unos), así que las dos mitades quedan constantes.

> **Dónde está la debilidad, exactamente.** No en las cajas $S$, no en la función $F$, no en el número de rondas: **en el key schedule**, y más precisamente en que la iteración *PC-1 más rotaciones* tiene **puntos fijos**. Es la lección transferible del ejercicio: una primitiva puede estar impecablemente diseñada y aun así tener claves que la degeneran, si la derivación de subclaves no lo contempla.

### Las cuatro claves débiles

Cada mitad de 28 bits tiene **dos** valores constantes posibles, así que hay $2 \times 2 = 4$ combinaciones y **exactamente 4 claves débiles**:

| $C_0$ | $D_0$ | Clave en hexadecimal (con bits de paridad) |
|---|---|---|
| $0^{28}$ | $0^{28}$ | `0101 0101 0101 0101` |
| $1^{28}$ | $1^{28}$ | `FEFE FEFE FEFE FEFE` |
| $0^{28}$ | $1^{28}$ | `1F1F 1F1F 0E0E 0E0E` |
| $1^{28}$ | $0^{28}$ | `E0E0 E0E0 F1F1 F1F1` |

**Por qué el hexadecimal de la primera fila no es "todo ceros".** Porque, como dice la tabla del principio de esta nota, el bit 8 de cada byte es de **paridad** y PC-1 lo descarta. Por eso la clave "todos 0" se escribe habitualmente `0101010101010101` (con paridad impar en cada byte) y la de "todos 1", `FEFEFEFEFEFEFEFE`. Pero `0000000000000000` y `FFFFFFFFFFFFFFFF` **también son débiles**: lo único que importa son los 56 bits que sobreviven a PC-1, y los de paridad no entran nunca al key schedule. Es una distinción de implementación —qué acepta la librería— y no de criptografía.

Las **dos mixtas**, `1F1F1F1F0E0E0E0E` y `E0E0E0E0F1F1F1F1`, son la respuesta a la pregunta del ejercicio *"¿cuáles serían otras dos?"*. El hexadecimal parece arbitrario y no lo es, pero la razón **no** es que la primera mitad de la clave alimente a $C_0$ y la segunda a $D_0$: los ocho bytes aportan bits a **las dos** mitades. Lo que PC-1 parte no es la clave, es **cada byte**. Numerando los bits del 1 (el más significativo) al 8 (el de paridad, que se descarta): los bits 1, 2 y 3 de los ocho bytes arman $C_0$, los bits 5, 6 y 7 de los ocho arman $D_0$, y el bit 4 es el único que cambia de bando, cayendo en $D_0$ si el byte es el 1, 2, 3 o 4 y en $C_0$ si es el 5, 6, 7 u 8.

Entonces, para conseguir $C_0 = 0^{28}$ y $D_0 = 1^{28}$ hacen falta bytes con los **bits altos en cero y los bajos en uno**, y el bit 4 puesto según adónde vaya a caer: `1F` $= \texttt{0001\ 1111}$ en los primeros cuatro bytes y `0E` $= \texttt{0000\ 1110}$ en los últimos. Los dos bytes **difieren exactamente en ese bit 4** (más el de paridad, que se acomoda para que los dos queden impares). Por eso la clave es `1F` cuatro veces y después `0E` cuatro veces, en vez de un byte repetido ocho veces: el patrón se quiebra justo donde PC-1 le cambia el bando al bit 4. La tabla completa del reparto está en [[guia-02-criptografia-simetrica#Las cuatro claves débiles|Guía 2 — Resolución, Ej. 8]].

### Las claves semi-débiles

**Son material de la cátedra**, aunque el enunciado del Ej. 8 no las pida: la filmina de DES de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]] las define en el mismo renglón que las débiles, y con la caracterización más nítida de las dos — **por cantidad de subclaves distintas**:

| Tipo | Subclaves distintas (de 16) | Definición de la cátedra |
|---|---|---|
| **Débil** | **1** | $\mathsf{Enc}_K(m) = \mathsf{Dec}_K(m)$, o sea $\mathsf{Enc}_K\big(\mathsf{Enc}_K(m)\big) = m$ |
| **Semi-débil** | **2 o 4** | *"vienen de a pares"*: $\mathsf{Enc}_{K_x}\big(\mathsf{Enc}_{K_y}(m)\big) = m$ |

**De dónde salen.** Del mismo mecanismo, un escalón más arriba. Si en vez de pedir que las mitades queden fijas bajo la rotación de **1** pedimos que queden fijas bajo la de **2**, aparecen dos candidatas más además de las constantes: las **alternadas** $(01)^{14}$ y $(10)^{14}$. Son las únicas cuatro cadenas de 28 bits que la rotación de 2 deja quietas.

Con $C_0$ alternada el calendario ya no la deja quieta, pero casi: las rotaciones de **2** la devuelven a sí misma y las de **1** la cambian por la **otra** alternada. Como $C_i$ es $C_0$ rotada por el corrimiento **acumulado** $r_1 + \dots + r_i$, lo único que decide cuál de las dos aparece en la ronda $i$ es la **paridad del acumulado**.

Acá hay que mirar el calendario entero y no las dos primeras rondas: rotan 1 bit las rondas **1, 2, 9 y 16**, así que los acumulados son

$$1,\ 2,\ 4,\ 6,\ 8,\ 10,\ 12,\ 14,\ 15,\ 17,\ 19,\ 21,\ 23,\ 25,\ 27,\ 28$$

e **impares sólo en la ronda 1 y en las rondas 9 a 15**. O sea: $C_i$ es la alternada **opuesta** en $K_1$ y en $K_9 \dots K_{15}$, y la **original** en $K_2 \dots K_8$ y en $K_{16}$. Escrito como patrón, con $A$ = la opuesta y $B$ = la original, queda $\texttt{ABBBBBBBAAAAAAAB}$: el par $(C_i, D_i)$ toma **dos** valores en vez de uno —de ahí las **2 subclaves** que anuncia la cátedra— pero **no se alternan**.

> **Que sean dos no alcanza: hace falta que estén en ese orden** *(precisión nuestra, verificada corriendo PC-1, el calendario y PC-2).* El patrón real, $\texttt{ABBBBBBBAAAAAAAB}$, leído al revés da $\texttt{BAAAAAAABBBBBBBA}$, que es exactamente su **complemento** — y el complemento es el patrón de la clave que arranca con la otra alternada, o sea la compañera. Esa antisimetría es lo que hace cerrar el argumento de abajo. Si el patrón fuera de veras alternante ($\texttt{ABABAB}\dots$), o si fuera el $\texttt{ABBBBBBBBBBBBBBB}$ que sale de creer que sólo las rondas 1 y 2 rotan 1 bit, la secuencia invertida **no** sería la de ninguna clave y no habría pareja.

Por eso la secuencia $K_1, \dots, K_{16}$ de una de esas claves es **exactamente la inversa** de la de su compañera, y por la Pieza 1 correr las subclaves al revés **es** descifrar:

$$\mathsf{Enc}_{K_x} = \mathsf{Dec}_{K_y} \quad\Longrightarrow\quad \mathsf{Enc}_{K_x}\big(\mathsf{Enc}_{K_y}(m)\big) = m$$

**Cuántas son.** Cuatro valores posibles para $C_0$ por cuatro para $D_0$ dan 16 combinaciones: 4 son las débiles de arriba —las dos mitades constantes— y las **12 restantes** son las semi-débiles, que se agrupan en **6 pares** *(cuenta nuestra, verificada corriendo PC-1, el calendario de rotaciones y PC-2 sobre las 16 combinaciones)*:

| $C_0$, $D_0$ | Clave (hex) | Su pareja (hex) | $C_0$, $D_0$ de la pareja |
|---|---|---|---|
| $(10)^{14}$, $(10)^{14}$ | `01FE01FE01FE01FE` | `FE01FE01FE01FE01` | $(01)^{14}$, $(01)^{14}$ |
| $(10)^{14}$, $(01)^{14}$ | `1FE01FE00EF10EF1` | `E01FE01FF10EF10E` | $(01)^{14}$, $(10)^{14}$ |
| $(10)^{14}$, $0^{28}$ | `01E001E001F101F1` | `E001E001F101F101` | $(01)^{14}$, $0^{28}$ |
| $(10)^{14}$, $1^{28}$ | `1FFE1FFE0EFE0EFE` | `FE1FFE1FFE0EFE0E` | $(01)^{14}$, $1^{28}$ |
| $0^{28}$, $(10)^{14}$ | `011F011F010E010E` | `1F011F010E010E01` | $0^{28}$, $(01)^{14}$ |
| $1^{28}$, $(10)^{14}$ | `E0FEE0FEF1FEF1FE` | `FEE0FEE0FEF1FEF1` | $1^{28}$, $(01)^{14}$ |

Nótese el patrón: **una clave y su pareja son la misma, con las mitades alternadas dadas vuelta**. Y nótese también que basta con que **una sola** de las dos mitades sea alternada: la otra puede ser constante, y el par sigue funcionando.

**El "o 4" de la cátedra.** La filmina dice *"generan 2 o 4"*. El 4 sale de subir otro escalón: las mitades que la rotación de **4** deja fijas —las que repiten un patrón de 4 bits siete veces; hay 16 por mitad— hacen que $(C_i, D_i)$ tome **cuatro** valores y el schedule produzca **4 subclaves distintas**. De las $16 \times 16 = 256$ combinaciones de ese tipo, 4 dan una sola subclave (las débiles), 12 dan dos (los 6 pares de arriba) y las **240 restantes dan cuatro** *(cuenta nuestra, misma verificación)*. Un aviso para no memorizar de más: en esas 240 la secuencia de subclaves **no** es la inversa de la de ninguna otra clave, así que **no** cumplen $\mathsf{Enc}_{K_x}\big(\mathsf{Enc}_{K_y}(m)\big) = m$ *(verificado)*. Lo que tienen es una clave con muchísima menos diversidad de subclaves de la que debería — razón suficiente para descartarlas, pero un defecto más débil que el de los 6 pares.

### Impacto real

**Despreciable en probabilidad, y aun así se chequean.** Las 4 débiles más las 12 semi-débiles son 16 claves sobre $2^{56}$:

$$\frac{4}{2^{56}} = 2^{-54} \approx 5{,}6 \times 10^{-17}, \qquad \frac{16}{2^{56}} = 2^{-52} \approx 2{,}2 \times 10^{-16}$$

de sortear una por accidente con un generador decente. Las claves débiles **no son lo que rompió a DES**: lo que lo rompió fue el **tamaño de la clave**, $2^{56}$, que la fuerza bruta con hardware dedicado alcanza — ver la sección que sigue.

El riesgo real es otro y es de ingeniería: **un generador de claves mal inicializado**. Un buffer sin inicializar da todo ceros, y todo ceros **es** una clave débil; el sorteo deja de ser uniforme y cae justo en la única porción del espacio que había que evitar. Por eso las implementaciones serias **chequean y descartan explícitamente** estas 4 claves —y las 12 semi-débiles— antes de usarlas. Es un caso de manual del *"no inventes criptografía"* de [[eleccion-de-primitivas|Elección de primitivas]]: el algoritmo está bien, lo que falla es el `Gen` del [[criptosistema]].

> **Dónde seguir.** El key schedule **a nivel de bits** —las tablas PC-1 y PC-2, el calendario de rotaciones ronda por ronda— está en [[des-descripcion-del-algoritmo|Descripción del algoritmo DES]]; la resolución completa del ejercicio, en [[guia-02-criptografia-simetrica#Ejercicio 8|Guía 2 — Resolución, Ejercicio 8]]; la filmina que define débiles y semi-débiles, en [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]].

---

## Evolución: cómo se erosionó

| Año | Qué pasó | Costo del ataque | Qué se cuenta |
|---|---|---|---|
| — | Nivel **teórico** de seguridad | $2^{56}$ | **claves** a probar por [[ataque-de-fuerza-bruta\|fuerza bruta]] |
| — | **Desconfianza** por cuestiones de diseño confidenciales (las sustituciones) | — | — |
| **1990** | **Criptoanálisis diferencial** (Biham y Shamir) | $2^{47}$ | **textos planos elegidos** |
| **1992** | **Criptoanálisis lineal** (Matsui) | $2^{43}$ | **textos planos conocidos** |
| **1998** | **Deep Crack** (EFF) encuentra una clave en 56 horas *(no está en la filmina)* | $2^{56}$ | **claves**: fuerza bruta con hardware dedicado |
| **2026** | Fuerza bruta **en la nube**, medida en dinero: paper del propio docente con un alumno, en arXiv *(no está en la filmina)* | $2^{56}$ | **claves**: el espacio entero, en **un día** por USD 1,2 M — o **21 años** con 37 workers pagables con una tarjeta de crédito |

**Qué es criptoanálisis, y qué compra cada bit.** Las dos preguntas se contestan en clase, y ninguna filmina las tiene. Criptoanálisis es *"analizar, sobre todo, el output de lo que generan los algoritmos (…) es lo que hace el atacante sobre el ciphertext"*, y la parte *diferencial* es *"ver cómo vos cambiás cosas y qué resultado produce"* (cues pt2 330-332). Y la aritmética que hace que un solo bit importe: bajar de $2^{56}$ a $2^{55}$ significa probar **la mitad** de las claves, *"y así sucesivamente"* (cues pt2 336-341). Al pasar, la actualización que ninguna filmina trae: hoy se usan modelos de aprendizaje automático para criptoanálisis, y lo que hacen es *"reducir la cantidad de bits que vos tenés que probar en fuerza bruta"* (cue pt2 333).

> **Los tres números no son de la misma especie, y eso cambia la conclusión** *(precisión nuestra; la filmina los pone en una sola columna).* Leer la tabla como *"el espacio de clave se erosionó de $2^{56}$ a $2^{47}$ y después a $2^{43}$"* es **un error**:
>
> - $2^{56}$ es una **cantidad de claves** — lo que cuesta recorrer el espacio entero.
> - $2^{47}$ es una **cantidad de textos planos elegidos** que el atacante tiene que hacerle cifrar a la víctima para montar el criptoanálisis diferencial.
> - $2^{43}$ es una **cantidad de textos planos conocidos** que necesita el lineal.
>
> **El espacio de clave sigue siendo $2^{56}$ en los tres casos.** Los dos ataques analíticos son más baratos que la fuerza bruta *en cómputo*, pero exigen un volumen de material que en la vida real no se consigue: $2^{47}$ bloques de 8 bytes cifrados **bajo la misma clave** son unos $10^{15}$ bytes, un petabyte. Por eso DES no cayó por ahí. Cayó por **fuerza bruta** sobre los $2^{56}$, cuando el hardware se abarató: en 1998 la máquina **Deep Crack** de la EFF —cuarto de millón de dólares en chips a medida— encontró una clave en menos de tres días. La lección para el parcial: *"hay un ataque de $2^{43}$"* **no** quiere decir *"la clave tiene 43 bits de seguridad"*; hay que preguntar siempre **qué está contando** el exponente.

> **Ojo:** en ese mismo pasaje el docente lee el $2^{47}$ del criptoanálisis diferencial como una reducción del **espacio de clave** —*"se redujo un montonazo, del 56 a $2^{47}$"* (cue pt2 343)—. No lo es: es cantidad de **material**, como explica el recuadro de arriba. El espacio de clave sigue en $2^{56}$.

> [!quote]- De la transcripción — cuánto sale hoy romper DES en la nube (cues pt2 349-359, 402)
> *"Estuvimos trabajando con un alumno (…) Gonzalo (…) el paper está disponible, está en **arXiv** (…) y aborda esta pregunta: ¿cuán roto está DES? Básicamente, si usás cloud, **¿en cuánto lo rompés, o por cuánta plata lo rompés?**"*
>
> Los números: *"si tienen un palo y medio, 1,2 millones, pueden reclutar un montón de workers en forma elástica usando instancias (…) **lo rompen en un día**, es decir, en un día recorren **todo el espacio completo de claves** hoy por hoy. Con menos guita, con guita que uno puede tener, **se tarda veintiún años con 37 workers**, que es lo que se puede pagar con una tarjeta de crédito."*
>
> El método: *"agarra un mensaje con una clave y lo cifra de dos maneras: una de **caja blanca**, pudiendo comparar cuál es el output, y la otra simplemente con outputs, **chequeando que parte de la salida sea una palabra en español**."*
>
> Y el contraste con hardware dedicado: *"están las cuestiones específicas hechas con **FPGA y con GPU**, que lo rompen quizás en menos tiempo, pero con costos quizás más grandes."*

**Por qué esta fila es la más informativa de la tabla.** No aporta un ataque nuevo: aporta el **precio** del ataque viejo. DES cae recorriendo el espacio entero, así que la pregunta *"¿está roto?"* se contesta con una cifra en dólares y no con una técnica — es exactamente la frontera *debilitado / quebrado* de [[estado-de-un-criptosistema|Estado de un criptosistema]], resuelta por ingeniería. Y los dos modos del ataque —caja blanca contra *"¿parece castellano?"*— son la **hipótesis oculta** que marca [[ataque-de-fuerza-bruta|Ataque de fuerza bruta]]: poder distinguir un descifrado válido de uno inválido.
*Cabo suelto:* la transcripción no da ni el título ni el año del paper.

Y el detalle que hace interesante a la tabla de los dos criptoanálisis:

> **Gran parte del diseño de DES disminuye el impacto** del criptoanálisis diferencial — **otros sistemas fueron inmediatamente quebrados** con la misma técnica.

> **Cómo leerlo.** Las cajas $S$ eran secretas *por decisión de diseño*, y eso generó sospecha de puerta trasera durante quince años. Cuando en 1990 se publicó el criptoanálisis diferencial, resultó que las $S$ estaban elegidas **precisamente para resistirlo**: los diseñadores conocían el ataque casi dos décadas antes que la academia. La sospecha era razonable y la conclusión fue la contraria a la esperada. Es el mejor argumento a favor del [[principio-de-kerckhoffs|principio de Kerckhoffs]] leído al revés: el secreto de diseño **no** ayudó a la seguridad, sólo retrasó la confianza pública.

---

## 3-DES

> Variante fuerte de DES. Consiste en seleccionar **3 claves independientes** y calcular:

$$c = \mathsf{Enc}_{k_1}\big(\mathsf{Dec}_{k_2}(\mathsf{Enc}_{k_3}(p))\big)$$

- Brinda una seguridad del orden de **112 bits**.
  - Notar que es **menor a 168** bits, por un ataque conocido como **meet-in-the-middle**.
- Es **inmune** a criptoanálisis diferencial y lineal.
- Es **mucho más lenta** que DES (**¡3 veces!**).

> **Por qué `Dec` en el medio** *(lectura nuestra — la filmina lo escribe pero no lo explica).* Es **compatibilidad hacia atrás**: si se toma $k_1 = k_2 = k_3 = k$, entonces $\mathsf{Enc}_k(\mathsf{Dec}_k(\mathsf{Enc}_k(p))) = \mathsf{Enc}_k(p)$, o sea **3-DES degenera exactamente en DES**. Un equipo con hardware 3-DES podía hablar con uno que sólo tenía DES. Criptográficamente `Enc-Enc-Enc` sería equivalente; la $D$ del medio es una decisión de despliegue, no de seguridad.

> **De dónde salen los 112 bits.** *Meet-in-the-middle* es el ataque genérico contra el cifrado múltiple: en lugar de probar las $2^{168}$ combinaciones, se cifra por un lado, se descifra por el otro y se buscan coincidencias en el medio, cambiando tiempo por memoria. Por eso el doble cifrado (`2-DES`, 112 bits de clave) da apenas ~$2^{57}$ de seguridad y **no se usa**, y el triple queda en ~$2^{112}$. Es el mismo patrón que el [[ataque-de-fuerza-bruta|principio de espacio de claves suficiente]]: **más bits de clave no se traducen uno a uno en más seguridad**.

**Por qué los bancos se quedaron tanto tiempo.** No fue una decisión criptográfica: *"durante mucho tiempo, para los bancos resultó muy cómodo, como ya tenían armado DES, utilizar triple DES"* (cue pt2 364). Es la misma base instalada que explica que DES siga corriendo en lugares insospechados — durante años, el **código de verificación de una tarjeta** (los tres dígitos del dorso) fue *"el output de un algoritmo de DES que como input tomaba el número de tarjeta y la fecha de expiración"* (cues pt2 41-43). Una primitiva quebrada que sigue viva porque cambiarla cuesta más que el riesgo.
*(El esquema del CVV no está verificado contra su estándar; lo que se afirma acá es lo que dijo la cátedra.)*

**Y el *meet-in-the-middle* engancha con la Clase 3.** El docente lo manda al mismo cajón que las *Rainbow Tables* y la **paradoja del cumpleaños** —*"seguro después lo van a ver más adelante"* (cue pt2 377)—, que es material del bloque de [[seguridad-de-las-funciones-de-hash|funciones de hash]]. El patrón compartido es el mismo: cambiar memoria por tiempo, y una cota que sale de contar coincidencias en vez de recorrer el espacio.

## Estado actual

En la filmina de [[eleccion-de-primitivas|primitivas recomendadas]], **DES aparece tachado** y 3DES sobrevive pero sin la etiqueta de recomendado — esa se la lleva [[aes|AES]].

**La voz va un paso más allá que la filmina: 3DES también sale de la lista.** El docente lo declara roto —*"durante muchos años se usó triple DES; ahora se considera que está roto y no se usa más"* (cue pt2 382)— y, al recorrer la tabla de recomendados, lo saca de los proyectos nuevos: *"eventualmente se puede utilizar, más o menos. No, yo no usaría para un proyecto nuevo"* (cue pt2 504). El único recomendado que nombra sin reservas es **AES en modo `CBC` o `CTR`** (cue pt2 507). Ver [[eleccion-de-primitivas|Elección de primitivas]] y [[estado-de-un-criptosistema|Estado de un criptosistema]].
