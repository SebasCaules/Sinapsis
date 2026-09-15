---
title: Criptoanálisis clásico
resumen: 'Cómo se resuelve en el primer parcial el ejercicio de criptoanálisis clásico: romper un Vigenère con Kasiski, índice de coincidencia y frecuencias, decidir si algo como base64 es un criptosistema, y definir confusión, difusión y no linealidad.'
fuentes: ["[[parciales-viejos]]", "[[cifrado-de-vigenere]]", "[[test-de-kasiski]]", "[[indice-de-coincidencia]]", "[[criptoanalisis-por-frecuencias]]", "[[cifrado-por-rotacion]]", "[[cifrado-de-sustitucion-monoalfabetica]]", "[[cifrado-por-transposicion]]", "[[codificar-ofuscar-y-cifrar]]", "[[primitiva-de-cifrado-en-bloque]]", "[[criptosistema]]"]
aliases: [Criptoanálisis clásico en el parcial, Parcial de criptoanálisis clásico, Romper Vigenère en el parcial, Base64 en el parcial]
type: parcial
clase: 1p
orden: 18
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, criptoanalisis-clasico, vigenere, kasiski, indice-de-coincidencia, base64]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Criptoanálisis clásico

> [!ejemplo] Así se tomó · 2C-2025, Ejercicio 2
> El siguiente texto fue encontrado en una botella en la guerra de los Roses
>
> "GWAOESFENITLAGEUGEDRVPHJVCDFDR"
>
> Se sabe que el mensaje fue encriptado con clave y estaba en castellano con un alfabeto de 26 letras.
>
> - (a) Detallar cómo sería el abordaje para criptoanalizar el mensaje.
> - (b) Intentar encontrar la clave y el mensaje.
>
> Teniendo en cuenta que la frecuencia (aproximada) de aparición de letras en castellano es la siguiente:
>
> | Letra | A | B | C | D | E | F | G | H | I | J | K | L | M | N | Ñ | O | P | Q | R | S | T | U | V | W | X | Y | Z |
> | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
> | % | 13 | 1 | 4 | 5 | 13 | 1 | 1 | 1 | 7 |  |  | 5 | 3 | 7 | 0 | 9 | 3 | 1 | 7 | 8 | 4 | 4 | 1 |  |  | 1 |  |
>
> Figura 1: Frecuencias de aparición de letras en castellano.

## Lo mínimo que hay que saber

### Alfabeto y aritmética modular

Las letras se numeran en orden, $\texttt{A} = 0, \texttt{B} = 1, \dots, \texttt{Z} = 25$, y se opera en $\mathbb{Z}_{26}$ (inglés, o castellano sin `Ñ`). Con `Ñ` el alfabeto tiene 27 letras, $\texttt{Ñ} = 14$, todo lo que sigue corre un lugar y se opera en $\mathbb{Z}_{27}$. **Lo primero que se escribe es qué $n$ se usa**: el enunciado lo dice.

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 |

### Los cuatro cifrados clásicos

- **Rotación (César).** $c_i = (m_i + k) \bmod n$ y $m_i = (c_i - k) \bmod n$, con $k \in \mathbb{Z}_n$. Hay $n$ claves: cae por [[ataque-de-fuerza-bruta|fuerza bruta]] probando las $n$ y quedándose con el único descifrado legible. Conserva el histograma del idioma, corrido $k$ lugares.
- **Sustitución monoalfabética.** $c_i = \pi(m_i)$ con $\pi$ una permutación fija del alfabeto. Hay $n!$ claves ($26! \approx 4 \times 10^{26}$, $27! \approx 1{,}1 \times 10^{28}$): la fuerza bruta es inviable, pero el histograma se conserva con las etiquetas permutadas y cae por frecuencias. Un espacio de claves grande es **necesario pero no suficiente**.
- **Vigenère (sustitución polialfabética).** Clave $k = k_0 k_1 \cdots k_{t-1}$ de $t$ letras; $c_i = (m_i + k_{i \bmod t}) \bmod n$ y $m_i = (c_i - k_{i \bmod t}) \bmod n$. Una misma letra se cifra distinto según su posición, así que el histograma global se **aplana**. Hay $n^t$ claves, pero conocido $t$ el problema se parte en $t$ rotaciones independientes y cuesta $t \cdot n$.
- **Transposición.** No cambia los símbolos sino sus posiciones (por ejemplo, escribir por filas en $c$ columnas y leer por columnas). El histograma queda **idéntico letra por letra** al del idioma: las frecuencias no lo rompen, pero lo delatan.

### Frecuencias del castellano

| Letra | E | A | S | O | I | N | R |
|---|---|---|---|---|---|---|---|
| % | 13,11 | 10,60 | 8,47 | 8,23 | 7,16 | 7,14 | 6,95 |

Siguen D 5,87, T 5,40, C 4,85, L 4,42 y U 4,34; en la cola quedan K, W, X, J, Z y Ñ, todas por debajo de 0,3 %. La tabla que adjunta el 2C-2025 es una versión redondeada de ésta, en la que **A y E empatan en 13 %**.

### Diagnóstico por histograma

| Lo que se ve en el criptograma | Qué es |
|---|---|
| Frecuencias iguales a las del castellano, letra por letra | Transposición |
| Mismo perfil (un pico de $\approx 13\,\%$ y cola larga) pero en otras letras | Sustitución monoalfabética, rotación incluida |
| Frecuencias aplanadas, todas cerca de $1/n$ | Sustitución polialfabética (Vigenère) |

### Índice de coincidencia

Probabilidad de que dos letras tomadas al azar del texto, sin reposición, sean iguales. Sobre un texto concreto, con $n_i$ apariciones de la letra $i$ y largo $N$:

$$\mathrm{IC} = \frac{\sum_{i} n_i\,(n_i - 1)}{N\,(N - 1)}$$

Su valor teórico para un idioma es $\sum_i p_i^2$. Referencias: **castellano $\approx 0{,}0775$** (el valor de la filmina; con la tabla completa del castellano da $\approx 0{,}072$ y con la del 2C-2025, $\approx 0{,}075$); **texto uniforme** $1/26 \approx 0{,}0385$ o $1/27 \approx 0{,}0370$. La señal es el factor 2 entre ambos valores. La rotación, la sustitución monoalfabética y la transposición **conservan el IC**; Vigenère lo hunde hacia $1/n$.

### Test de Kasiski

Si una secuencia del texto plano se repite alineada con el mismo tramo de la clave, se cifra igual las dos veces. Por eso la **distancia** $D$ entre dos apariciones de una secuencia repetida (de 3 letras o más) en el criptograma es un múltiplo de $t$: $t \mid D$. Se factorizan las distancias y $t$ se busca entre sus **divisores comunes** (el mcd, descartando las repeticiones casuales). Kasiski **propone** candidatos; el IC los **confirma**.

### Confirmar la longitud con el IC

Para cada $t$ candidato se parte el criptograma en $t$ subtextos (el subtexto $j$ son las posiciones $i \equiv j \pmod t$, una de cada $t$ letras), se calcula el IC de cada uno y se promedian. Con el $t$ correcto cada subtexto es una rotación pura de castellano y el promedio salta a $\approx 0{,}0775$; con un $t$ incorrecto se queda cerca de $1/n$. Los múltiplos del $t$ correcto también saltan: **quedarse con el menor**. Con subtextos de pocas letras el estimador es ruidoso, y hay que decirlo.

### Romper cada subtexto por frecuencias

Con $t$ fijo, cada subtexto es un César con clave $k_j$. La forma rápida es alinear la letra más frecuente del subtexto con la $\texttt{E}$: $k_j = (\text{pico} - \texttt{E}) \bmod n$. La forma robusta, que conviene con subtextos cortos, es probar los $n$ corrimientos $s$ y puntuar cada uno con la tabla del idioma:

$$\chi(s) = \sum_{\ell} n_\ell \cdot p_{(\ell - s) \bmod n}$$

donde $n_\ell$ es cuántas veces aparece la letra $\ell$ en el subtexto y $p$ es la frecuencia en castellano de la letra a la que descifraría con corrimiento $s$. El $s$ de mayor puntaje es $k_j$. Después se descifra todo y se **lee**: el texto claro en castellano es la verificación final.

### Qué es un criptosistema, y qué no

Un criptosistema es una terna $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ con espacios $K$, $M$ y $C$ y la condición de corrección $D_k(E_k(m)) = m$ para toda clave y todo mensaje. Para decidir si algo lo es se hacen tres preguntas: **¿usa una clave?**, **¿da confidencialidad?** (el criptograma no revela nada de $m$ a quien no tiene la clave) y **¿es computacionalmente difícil revertirlo sin la clave?** Base64 falla las tres: no tiene clave, cualquiera lo descodifica y revertirlo es inmediato. Es una **codificación**, como lo es ofuscar código; sin clave, un observador distingue dos mensajes con probabilidad 1, y por el [[principio-de-kerckhoffs|principio de Kerckhoffs]] la seguridad no puede descansar en que el algoritmo sea desconocido.

### Confusión, difusión y no linealidad

- **Difusión:** alterar un bit de la entrada altera **muchos** bits de la salida, de forma impredecible (en la formulación de Shannon: la estadística del texto plano se dispersa por todo el criptograma).
- **Confusión:** no se puede anticipar **cómo** la alteración de un bit modifica a los demás (en Shannon: la relación entre la clave y el criptograma es lo más compleja posible).
- **No linealidad:** la salida **no** se puede escribir como combinación lineal (sumas módulo 2, XOR) de los bits de entrada y de clave. En un esquema lineal un par $(m, c)$ conocido entrega la clave con una resta, como en Vigenère. Las **cajas S son el único paso no lineal de `DES`** y `Byte Sub` lo es de `AES`. Ejemplos lineales: César y Vigenère, $c = (m + k) \bmod n$, y el XOR con una clave, $c = m \oplus k$.

### Cifrado homofónico

Cada letra (en el 1C-2018, cada vocal) se sustituye por **más de un símbolo**, elegido al azar, con una cantidad de símbolos proporcional a su frecuencia en el idioma. Está diseñado para **aplanar el histograma**: el IC, que mide cuán disparejo es el histograma, deja de distinguirlo de texto uniforme. No es un Vigenère: no hay corrimientos que dependan de la posición.

### Espacios de claves que suelen preguntar

| Esquema | $\lvert K \rvert$ | $n = 26$ | $n = 27$ |
|---|---|---|---|
| Rotación | $n$ | 26 | 27 |
| Sustitución monoalfabética | $n!$ | $\approx 4 \times 10^{26} \approx 2^{88}$ | $\approx 1{,}1 \times 10^{28} \approx 2^{93}$ |
| Vigenère con clave de largo $t$ | $n^t$ | $26^5 = 11\,881\,376$ | $27^5 = 14\,348\,907$ |
| Vigenère atacado por subtextos | $t \cdot n$ intentos | $5 \cdot 26 = 130$ | $5 \cdot 27 = 135$ |

## Receta

### Si dan un criptograma

1. **Fije el alfabeto.** Escriba $n$ (26 o 27, según diga el enunciado) y la tabla letra-número.
2. **Cuente.** Haga el histograma del criptograma y calcule su IC. Si sale $\approx 0{,}0775$, es monoalfabético o transposición: si las letras frecuentes son las del castellano es transposición, si no, frecuencias directas. Si sale $\approx 1/n$, es polialfabético: siga.
3. **Kasiski.** Liste las secuencias repetidas, sus distancias y los divisores comunes; anote los candidatos a $t$. Si el enunciado esconde un gancho ("encriptado con clave", una palabra sugerida), anótelo como candidato también.
4. **Confirme $t$ con el IC.** Para cada candidato, parta en $t$ subtextos, calcule los IC y promedie; elija el menor $t$ que salte hacia $0{,}0775$.
5. **Resuelva cada subtexto.** Para $j = 0, \dots, t-1$ obtenga $k_j$ alineando el pico con la $\texttt{E}$ o puntuando los $n$ corrimientos con la tabla. Escriba la clave como letras y como números.
6. **Descifre y lea.** Tabla con cuatro filas: letra cifrada, su número, la letra de clave que le toca, y $(c_i - k_{i \bmod t}) \bmod n$ con su letra. Lea el texto claro, sepárelo en palabras y cierre con clave y mensaje en una línea.
7. **Si el enunciado regala la clave, igual escriba los pasos 2 a 5** como respuesta al "detallar el abordaje", diga por qué con un texto corto las estadísticas por subtexto serían poco confiables, y use la clave regalada en el paso 6.

### Si preguntan si algo es un criptosistema

1. Aplique las tres preguntas (clave, confidencialidad, dificultad de revertir) y concluya con la palabra correcta: **codificación**, no cifrado.
2. Defina confusión y difusión con una oración cada una y diga por qué el esquema del enunciado no tiene ninguna de las dos.
3. Defina no linealidad, nombre las cajas S de `DES` y `Byte Sub` de `AES` como el paso no lineal, y dé un ejemplo lineal ($c = m + k$).

## Plantilla de respuesta

**Criptograma.** *(a) Abordaje.* Alfabeto de $n =$ \<26 o 27\> letras. El IC del criptograma es \<valor\>, cerca de $1/n$: es una sustitución polialfabética (Vigenère). Kasiski: las secuencias \<lista\> se repiten a distancias \<lista\>, cuyos divisores comunes son \<lista\>; candidatos $t \in$ \<conjunto\>. IC por subtextos: con $t =$ \<valor\> el promedio da \<valor\>, frente a \<valores\> con los otros candidatos, así que $t =$ \<valor\>. En cada subtexto, alineando el histograma con la tabla del castellano, los corrimientos son \<lista\>. *(b) Clave y mensaje.* $k =$ \<PALABRA\> $=$ \<números\>. Descifrado con $m_i = (c_i - k_{i \bmod t}) \bmod n$: \<tabla\>. Mensaje: \<texto en castellano, separado en palabras\>.

**¿Es un criptosistema?** No: \<esquema\> no usa clave, no da confidencialidad (cualquiera lo revierte) y revertirlo no tiene costo computacional; es una codificación. Confusión: \<definición\>. Difusión: \<definición\>. No linealidad: \<definición\>; el paso no lineal de `DES` son las cajas S; ejemplo lineal: \<$c = m + k$\>.

## Trampas

- **Mezclar 26 y 27.** Con `Ñ` la `O` vale 15 y no 14, y el piso del IC pasa de $0{,}0385$ a $0{,}0370$. Se fija $n$ antes de la primera cuenta.
- **Descifrar sumando.** Cifrar es $+k$, descifrar es $-k$; si el resultado no es castellano, revisar el signo antes que la clave.
- **Alinear el pico solo con la E.** En la tabla del 2C-2025, `A` y `E` empatan en 13 %: el pico de un subtexto puede ser cualquiera de las dos. Probar ambas, o puntuar los $n$ corrimientos con la tabla completa, y dejar que la lectura del texto decida.
- **Tomar a Kasiski como prueba.** Un divisor común de las distancias es un candidato, no el período: con distancias 12 y 18 el divisor 6 no divide a $t = 3$. Y en un texto corto una repetición puede ser casualidad. Siempre confirmar con el IC.
- **Olvidar el $-1$ del IC muestral**, o quedarse con un múltiplo de $t$: los múltiplos también hacen saltar el IC y se elige el menor.
- **Decir que base64 "cifra pero es débil".** No cifra en absoluto: el argumento es que no hay clave, no que el algoritmo sea flojo. La palabra que espera el corrector es *codificación*.
- **Invertir confusión y difusión**, o definir solo una. Van las dos, una oración cada una.
- **"No lineal" no significa "complicado"**: significa que la salida no es una combinación lineal de los bits de entrada y de clave; el ejemplo es la caja S.
- **Llamar Vigenère al cifrado homofónico.** El homofónico elige el símbolo al azar entre varios; Vigenère lo elige por la posición. Lo que el homofónico anula es el IC, porque aplana el histograma.
- **Confundir transposición con monoalfabética.** Las dos conservan el histograma y dan IC alto; la transposición conserva además **qué letra** tiene cada frecuencia.

## Para profundizar

- [[1p-criptoanalisis-clasico-en-parciales-viejos|Criptoanálisis clásico en los parciales viejos]] — los ejercicios de este tipo que ya se tomaron, con enunciado completo, respuesta modelo y tips.
- [[primer-parcial|Primer parcial]] — el hub de la sección, con la tabla de los siete tipos y el orden sugerido.
- [[cifrado-de-vigenere|Cifrado de Vigenère]] — la definición formal, el ejemplo con `CLAVE` verificado y por qué el ataque cuesta $t \cdot n$.
- [[test-de-kasiski|Test de Kasiski]] — el procedimiento en cinco pasos y la lectura correcta de $D \mid \text{período}$.
- [[indice-de-coincidencia|Índice de coincidencia]] — fórmulas teórica y muestral, valores de referencia y el uso operativo contra Vigenère.
- [[criptoanalisis-por-frecuencias|Criptoanálisis por frecuencias]] — la tabla completa del castellano y la clasificación por histograma.
- [[cifrado-por-rotacion|Cifrado por rotación]] — César formal, la tabla de 27 letras y la fuerza bruta.
- [[cifrado-de-sustitucion-monoalfabetica|Cifrado de sustitución monoalfabética]] — las $n!$ claves y por qué igual cae.
- [[cifrado-por-transposicion|Cifrado por transposición]] — transposición por columnas y cómo se distingue de la monoalfabética.
- [[codificar-ofuscar-y-cifrar|Codificar, ofuscar y cifrar]] — base64 y la pregunta que "aparece siempre en examen".
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] — difusión y confusión con la cita del docente, y el efecto avalancha.
- [[criptosistema|Criptosistema]] — la terna Gen, Enc, Dec y la condición de corrección.
- [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] y [[guia-01-criptografia-clasica|Guía 1]] — la clase y la guía de donde sale todo esto; el Ej. 6 de la guía es un Vigenère completo con Kasiski.
