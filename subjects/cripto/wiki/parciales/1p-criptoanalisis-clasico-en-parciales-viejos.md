---
title: Criptoanálisis clásico en los parciales viejos
resumen: 'Los tres ejercicios de criptoanálisis clásico de los parciales viejos, con enunciado completo, respuesta modelo y tips: el Vigenère del 2C-2025, el base64 del 1C-2023 y el cifrado homofónico del 1C-2018.'
fuentes: ["[[parciales-viejos]]", "[[cifrado-de-vigenere]]", "[[test-de-kasiski]]", "[[indice-de-coincidencia]]", "[[criptoanalisis-por-frecuencias]]", "[[cifrado-por-rotacion]]", "[[codificar-ofuscar-y-cifrar]]", "[[primitiva-de-cifrado-en-bloque]]", "[[criptosistema]]"]
aliases: [Criptoanálisis clásico en parciales viejos, Vigenère en los parciales viejos, Base64 en los parciales viejos, Ejercicios viejos de criptoanálisis clásico]
type: parcial
clase: 1p
orden: 19
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, criptoanalisis-clasico, vigenere, base64, cifrado-homofonico, parciales-viejos]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Criptoanálisis clásico en los parciales viejos

Hay tres ejercicios de este tipo en los cuatro parciales viejos: el Ej. 2 del [[parciales-viejos#2C-2025|2C-2025]] (un criptograma de Vigenère con la tabla de frecuencias adjunta), el Ej. 3 del [[parciales-viejos#1C-2023|1C-2023]] (base64 como "cifrado") y el inciso 2.2 del Ej. 2 del [[parciales-viejos#1C-2018|1C-2018]] (múltiple choice sobre un cifrado homofónico). En el 1C-2025 no apareció. El análisis parcial por parcial está en [[parciales-viejos|Parciales viejos]].

La receta y las trampas de este tipo están en [[1p-criptoanalisis-clasico|Criptoanálisis clásico]]; la sección entera empieza en [[primer-parcial|Primer parcial]].

## 2C-2025 · Ej. 2 — Un criptograma de Vigenère con la tabla de frecuencias

### Enunciado

El siguiente texto fue encontrado en una botella en la guerra de los Roses

"GWAOESFENITLAGEUGEDRVPHJVCDFDR"

Se sabe que el mensaje fue encriptado con clave y estaba en castellano con un alfabeto de 26 letras.

- (a) Detallar cómo sería el abordaje para criptoanalizar el mensaje.
- (b) Intentar encontrar la clave y el mensaje.

Teniendo en cuenta que la frecuencia (aproximada) de aparición de letras en castellano es la siguiente:

| Letra | A | B | C | D | E | F | G | H | I | J | K | L | M | N | Ñ | O | P | Q | R | S | T | U | V | W | X | Y | Z |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| % | 13 | 1 | 4 | 5 | 13 | 1 | 1 | 1 | 7 |  |  | 5 | 3 | 7 | 0 | 9 | 3 | 1 | 7 | 8 | 4 | 4 | 1 |  |  | 1 |  |

Figura 1: Frecuencias de aparición de letras en castellano.

### Respuesta modelo

**(a) Abordaje.**

1. **Alfabeto.** 26 letras, sin `Ñ`: $\texttt{A} = 0, \dots, \texttt{Z} = 25$, aritmética en $\mathbb{Z}_{26}$. El criptograma tiene $N = 30$ letras.

2. **Diagnóstico del tipo de cifrado.** Histograma del criptograma: `E` 4 veces; `G` y `D` 3; `A`, `F`, `R` y `V` 2; otras doce letras una vez. Su índice de coincidencia es

   $$\mathrm{IC} = \frac{\sum_i n_i (n_i - 1)}{N (N - 1)} = \frac{4 \cdot 3 + 3 \cdot 2 + 3 \cdot 2 + 4 \cdot (2 \cdot 1)}{30 \cdot 29} = \frac{32}{870} \approx 0{,}037$$

   Está en el piso de texto uniforme ($1/26 \approx 0{,}0385$) y lejos del castellano ($\approx 0{,}0775$): el histograma está aplanado (19 letras distintas en 30 posiciones). Eso descarta rotación, sustitución monoalfabética y transposición, que conservan las frecuencias, y señala una sustitución polialfabética: un Vigenère, coherente con "encriptado con clave".

3. **Longitud de la clave por Kasiski.** Se buscan secuencias repetidas. No hay trigramas repetidos; hay dos digramas: `DR` en las posiciones 19 y 29 (distancia 10) y `GE` en las posiciones 14 y 17 (distancia 3). Como 10 y 3 no tienen divisor común mayor que 1, al menos una de las dos repeticiones es casual. Los divisores dan los candidatos $t \in \{2, 3, 5, 10\}$. Además, el enunciado esconde un gancho: "encriptado con clave" sugiere que la clave sea la propia palabra `CLAVE`, con $t = 5$, compatible con la distancia 10.

4. **Confirmación de $t$ con el índice de coincidencia.** Para cada candidato se parte el criptograma en $t$ subtextos (una de cada $t$ letras) y se promedian sus IC:

   | $t$ | IC de cada subtexto | Promedio |
   |---|---|---|
   | 2 | 0,067 · 0,019 | 0,043 |
   | 3 | 0,022 · 0,044 · 0,022 | 0,030 |
   | 4 (control) | 0,071 · 0 · 0,048 · 0 | 0,030 |
   | 5 | 0 · 0 · 0,133 · 0,067 · 0,133 | 0,067 |

   Solo $t = 5$ sube hacia $0{,}0775$; $t = 10$ dejaría subtextos de 3 letras, inutilizables. Con subtextos de 6 letras el estimador es ruidoso (valores de 0 y 0,133), pero la separación respecto de los otros candidatos es clara: $t = 5$.

5. **Cada subtexto por frecuencias.** Los cinco subtextos (posiciones $j, j+5, j+10, \dots$) son `GSTUVC`, `WFLGPD`, `AEAEHF`, `ONGDJD` y `EIERVR`. Con 6 letras, alinear un único pico con la `E` no es confiable (los dos primeros no tienen ninguna letra repetida, y en la tabla adjunta `A` y `E` empatan en 13 %), así que se prueban los 26 corrimientos $s$ de cada subtexto y se puntúa cada uno sumando la frecuencia de la letra a la que descifra: $\chi(s) = \sum_\ell n_\ell \cdot p_{(\ell - s) \bmod 26}$. El corrimiento de mayor puntaje es 2 (`C`) en el primero, 11 (`L`) en el segundo, 0 (`A`) en el tercero, 21 (`V`) en el cuarto, y en el quinto empatan 4 (`E`) y 17 (`R`). Clave candidata: `CLAVE` o `CLAVR`.

6. **Verificación.** Se descifra con cada candidata y se lee: con `CLAVR` las posiciones 5, 10, 15, ... dan `ELATNQUESRRAALNSVEIATEHOEASFIA`, que no es castellano; con `CLAVE` sale texto corrido en castellano. Esa lectura es la comprobación final.

**(b) Clave y mensaje.**

$k = \texttt{CLAVE} = (2, 11, 0, 21, 4)$, $t = 5$. Con la clave repetida cíclicamente debajo del criptograma, $m_i = (c_i - k_i) \bmod 26$:

| Posición | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| $c_i$ | G | W | A | O | E | S | F | E | N | I |
| número | 6 | 22 | 0 | 14 | 4 | 18 | 5 | 4 | 13 | 8 |
| clave | C 2 | L 11 | A 0 | V 21 | E 4 | C 2 | L 11 | A 0 | V 21 | E 4 |
| resta mod 26 | 4 | 11 | 0 | 19 | 0 | 16 | 20 | 4 | 18 | 4 |
| $m_i$ | E | L | A | T | A | Q | U | E | S | E |

| Posición | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|
| $c_i$ | T | L | A | G | E | U | G | E | D | R |
| número | 19 | 11 | 0 | 6 | 4 | 20 | 6 | 4 | 3 | 17 |
| clave | C 2 | L 11 | A 0 | V 21 | E 4 | C 2 | L 11 | A 0 | V 21 | E 4 |
| resta mod 26 | 17 | 0 | 0 | 11 | 0 | 18 | 21 | 4 | 8 | 13 |
| $m_i$ | R | A | A | L | A | S | V | E | I | N |

| Posición | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|---|---|---|---|---|---|---|---|---|---|---|
| $c_i$ | V | P | H | J | V | C | D | F | D | R |
| número | 21 | 15 | 7 | 9 | 21 | 2 | 3 | 5 | 3 | 17 |
| clave | C 2 | L 11 | A 0 | V 21 | E 4 | C 2 | L 11 | A 0 | V 21 | E 4 |
| resta mod 26 | 19 | 4 | 7 | 14 | 17 | 0 | 18 | 5 | 8 | 13 |
| $m_i$ | T | E | H | O | R | A | S | F | I | N |

$$\texttt{GWAOESFENITLAGEUGEDRVPHJVCDFDR} \;\to\; \texttt{ELATAQUESERAALASVEINTEHORASFIN}$$

**Clave: `CLAVE`. Mensaje: "EL ATAQUE SERA A LAS VEINTE HORAS FIN".** Las 30 letras del criptograma dan 30 letras de texto claro en castellano corrido, sin ambigüedad.

### Tips

- Los dos incisos valen por separado: (a) es el método y (b) la cuenta. Escriba el método completo (IC del total, Kasiski, IC por subtextos, frecuencias, lectura) aunque vea la clave de entrada; es lo que el corrector busca en (a).
- El gancho es el dato: "encriptado con clave" quiere decir que la clave es `CLAVE`. La Clase 1 usa el mismo recurso con `LACABEZA` en su ejercicio de sustitución.
- Diga explícitamente que 30 letras son pocas (subtextos de 6 letras, IC ruidoso): muestra que entiende el límite de la herramienta, y explica por qué el enunciado dice "intentar" en (b).
- La tabla adjunta empata `A` y `E` en 13 %, y con 6 letras por subtexto alinear el único pico con la `E` no se puede aplicar en dos subtextos (no hay letra repetida) y falla en otros dos. Puntuar los 26 corrimientos con la tabla completa resuelve cuatro; la lectura del texto claro resuelve el quinto.
- Reciclable: el Ej. 6 de la [[guia-01-criptografia-clasica|Guía 1]] es el mismo ejercicio con clave `JUAN` y repeticiones dadas. Si el alfabeto fuera de 27 letras, `Ñ` vale 14 y la numeración corre un lugar desde ahí.

## 1C-2023 · Ej. 3 — base64 como cifrado simétrico

### Enunciado

El banco de Estander usa base64 como sistema de encripción simétrica.

- a) ¿Puede este considerarse un sistema de encripción válido? Explicar.
- b) El CSO dice que su sistema ofrece confuseon y difusión. ¿Qué significa?
- c) El además insiste en que el sistema no es lineal. ¿Qué significa que un criptosistema simétrico sea no lineal? De un ejemplo de otro criptosistema lineal.

### Respuesta modelo

**a)** No. Un criptosistema es una terna $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ sobre espacios $K$, $M$ y $C$, con $D_k(E_k(m)) = m$, cuya seguridad descansa en el secreto de la clave y no en el del algoritmo ([[principio-de-kerckhoffs|principio de Kerckhoffs]]). Base64 falla en los tres puntos que hacen a un cifrado:

1. **No usa clave.** No existe $\mathsf{Gen}$: es una transformación fija y pública que reemplaza cada grupo de 6 bits por un carácter de un alfabeto de 64.
2. **No da confidencialidad.** Cualquiera que intercepte la salida la descodifica con la misma tabla pública; un observador que elige dos mensajes y recibe uno "cifrado" distingue cuál es con probabilidad 1.
3. **No hay dificultad computacional en revertirlo.** Descodificar cuesta lo mismo que codificar.

Base64 es una **codificación** (un cambio de representación, como lo es ofuscar código), no un cifrado. Lo que el banco necesita es un criptosistema simétrico con clave, por ejemplo `AES` con un modo de encadenamiento adecuado.

**b)** Son los dos objetivos de diseño de una primitiva de cifrado:

- **Difusión:** alterar un bit de la entrada altera **muchos** bits de la salida, de forma impredecible; en la formulación de Shannon, la estadística del texto plano se dispersa por todo el criptograma.
- **Confusión:** no se puede anticipar **cómo** la alteración de un bit modifica a los demás bits de la salida; en Shannon, la relación entre la clave y el criptograma es lo más compleja posible.

Base64 no ofrece ninguna de las dos: cada grupo de 6 bits se transforma de manera independiente en un único carácter, así que cambiar un bit de entrada cambia exactamente un carácter de salida (no hay difusión), de una forma que se predice con la tabla pública (no hay confusión), y no hay clave cuya relación con la salida haya que ocultar. Esas dos propiedades son las que aporta un cifrado en bloque con sus rondas de sustitución y permutación, y que un dato codificado en base64 no tiene.

**c)** Que un criptosistema simétrico sea **no lineal** significa que el criptograma no es una función lineal (afín) del texto plano y de la clave: ningún bit de salida se puede escribir como suma módulo 2 (XOR) de un subconjunto fijo de bits de entrada y de clave. Importa porque un esquema lineal se rompe con texto plano conocido: con unos pocos pares $(m, c)$ se plantea un sistema de ecuaciones lineales y se despeja la clave; en Vigenère alcanza una resta, $k_i = (c_i - m_i) \bmod n$. Por eso las primitivas modernas incluyen un paso deliberadamente no lineal: en `DES` las **cajas S** son el único paso no lineal (todo lo demás de la ronda es lineal), y en `AES` lo es `Byte Sub`. Base64 no tiene ninguna no linealidad que valga: es una tabla fija y pública de 6 a 8 bits, sin clave, cuya inversa es otra tabla; ni siquiera es un criptosistema. Un ejemplo de criptosistema lineal es el de Vigenère (y su caso $t = 1$, el César): $c_i = (m_i + k_{i \bmod t}) \bmod n$, lineal en $m$ y en $k$. Sobre bits, el one-time pad, $c = m \oplus k$, también es lineal.

### Tips

- La palabra que vale puntos en a) es *codificación*, y el argumento es la ausencia de clave, no la debilidad del algoritmo. El docente lo llamó una pregunta caza-bobos que "aparece siempre en examen".
- No describa cómo agrupa bits base64: describa lo que le falta (clave, confidencialidad, costo de inversión).
- b) y c) son material de la Clase 2: lleve las dos definiciones y el ejemplo de las cajas S memorizados, con los nombres exactos.
- El mismo test de tres preguntas sirve para cualquier esquema inventado del ejercicio "¿es válido este esquema?".
- Las erratas del enunciado ("confuseon", "De un ejemplo") son del examen; responda con los términos correctos.

## 1C-2018 · Ej. 2.2 — El cifrado homofónico del Duque de Mantua

### Enunciado

Elegir la opción correcta y justificar en una oración.

2- El Duque de Mantua en 1401 utilizó un sistema de encripción homofónico donde implementó un cifrado de sustitución de manera que cada una de las vocales era sustituída por más de un símbolo, que se seleccionaba al azar. La cantidad de símbolos de sustitución para cada vocal era proporcional a la frecuencia de aparición de esa vocal dentro del lenguaje.

- (a) El esquema no tiene secreto perfecto porque es imposible identificar la vocal asignada.
- (b) El esquema opera en realidad como un cifrado Vigènere.
- (c) El índice de coincidencia no es tan útil en este caso.

(Los incisos 1 y 3 del mismo ejercicio, sobre validación de certificados y SSL/TLS, son de otro tipo y se tratan en su propia página.)

### Respuesta modelo

**Opción (c).** Al sustituir cada vocal por varios símbolos elegidos al azar, con tantos símbolos como frecuencia tiene la vocal, el histograma del criptograma se aplana: las letras más frecuentes quedan repartidas entre muchos símbolos, y el índice de coincidencia, que mide cuán disparejo es el histograma, cae hacia el valor de texto uniforme y deja de distinguir este esquema de un cifrado polialfabético o de texto aleatorio.

Por qué no las otras: (a) se contradice a sí misma: que sea imposible identificar la vocal sería un argumento a favor del secreto, no en contra, y el secreto perfecto es una propiedad sobre la que se razona formalmente, no algo imposible de analizar. (b) No es un Vigenère: en Vigenère el símbolo depende de la posición, mediante corrimientos cíclicos fijados por una clave; aquí se elige al azar entre varios y no hay clave de corrimientos.

### Tips

- Una oración: qué mide el IC (la irregularidad del histograma) y qué le hace el homofónico al histograma (lo empareja). Con eso está la justificación completa.
- Es el contraejemplo que muestra que el IC no es un detector universal de sustitución: sirve para Verdadero o Falso del tipo "el índice de coincidencia detecta cualquier sustitución" (falso; corrección: el homofónico lo anula).
- No caiga en (b): Vigenère depende de la posición; el homofónico, del azar.

## Lo que se repite

- Es siempre la misma caja de herramientas, en el mismo orden: histograma e IC del criptograma para diagnosticar el tipo, Kasiski para proponer $t$, IC por subtextos para confirmarlo, frecuencias en cada subtexto para obtener $k_j$, y lectura del texto claro como verificación.
- Lleve memorizados la fórmula muestral del IC, $\sum n_i(n_i-1) / N(N-1)$, y los dos valores de referencia: $\approx 0{,}0775$ para el castellano y $1/26 \approx 0{,}0385$ (o $1/27 \approx 0{,}0370$) para texto uniforme. El IC es el hilo de los tres ejercicios: confirma $t$ en el 2C-2025 y es lo que el homofónico del 1C-2018 anula.
- El test de tres preguntas para "¿es un criptosistema?" (clave, confidencialidad, dificultad de revertir) resuelve el base64 del 1C-2023 y cualquier esquema inventado.
- Confusión, difusión y no linealidad se piden por su nombre: una oración por definición, más el ejemplo de las cajas S de `DES` y `Byte Sub` de `AES`, más un ejemplo lineal ($c = m + k$).
- Los enunciados esconden ganchos ("encriptado con clave") y traen erratas: el gancho se usa, la errata se ignora.
- Antes de la primera cuenta, fije el alfabeto ($n = 26$ o $27$) y la tabla letra-número; descifre restando, no sumando.
