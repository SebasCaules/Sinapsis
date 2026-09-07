---
title: Índice de coincidencia
resumen: 'Número único que resume el histograma de un texto y mide si el cifrado conservó las frecuencias del idioma o las aplanó; separa cifrados monoalfabéticos de polialfabéticos y confirma la longitud de clave de Vigenère.'
fuentes: ["[[practica-01-esquemas-y-taxonomias]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Índice de coincidencia, Indice de coincidencia, IC, Index of coincidence]
type: concepto
unidad: 1
clase: 1
orden: 12
created: 2026-08-11
updated: 2026-09-06
tags: [criptoanalisis, indice-de-coincidencia, vigenere, frecuencias, estadistica, practica-01, guia-01]
sources: ["Clase 1.pdf (práctica)", "Guía 1 Ej. 6"]
---

# Índice de coincidencia

Un **único número** que resume el histograma de un texto y dice, sin descifrar nada, si el cifrado conservó las frecuencias del idioma o las aplanó.

Es la herramienta que la [[practica-01-esquemas-y-taxonomias|Práctica 01]] ([filminas](../../raw/practicas/Clase%201.pdf)) pone al lado de Vigenère en el árbol de cifrados clásicos, junto con el criterio de período $D \mid \text{período}$:

> $\mathrm{IC} = \sum_{i=0}^{26} p_i^2 \approx 0{,}0775$

Esta nota trae cómo decidir si un criptograma es monoalfabético o polialfabético, o cómo **confirmar** la longitud $t$ de clave que propuso el [[test-de-kasiski|test de Kasiski]].

---

## Definición

> **IC** = probabilidad de que dos letras tomadas al azar **sin reposición** de un texto resulten iguales.

Hay dos formas, y no son intercambiables:

**Teórica (del idioma).** Con $p_i$ la probabilidad de la letra $i$ en el lenguaje, sobre un alfabeto de $n$ símbolos:

$$\mathrm{IC}_{\text{teo}} = \sum_{i=0}^{n-1} p_i^{\,2}$$

Es la que aparece en la filmina. No depende de ningún texto concreto: se calcula una sola vez a partir de una tabla de frecuencias y sirve como **valor de referencia**.

**Muestral (de un criptograma concreto).** Con $n_i$ la cantidad de apariciones de la letra $i$ y $N = \sum n_i$ el largo del texto:

$$\mathrm{IC}_{\text{mue}} = \frac{\sum_{i=0}^{n-1} n_i\,(n_i - 1)}{N\,(N-1)}$$

Es la que se computa en la práctica, sobre el criptograma o sobre cada sub-texto. El $-1$ arriba y abajo es exactamente el "sin reposición": hay $n_i(n_i-1)$ pares ordenados de posiciones distintas con la misma letra, sobre $N(N-1)$ pares ordenados totales.

Para $N$ grande y un texto en el idioma, $\mathrm{IC}_{\text{mue}} \to \mathrm{IC}_{\text{teo}}$. Para $N$ chico el estimador es ruidoso — y esto importa mucho al partir el criptograma en sub-textos (ver más abajo).

## Valores de referencia

| Texto | IC | De dónde sale |
|---|---|---|
| Castellano | **≈ 0,0775** | Filmina 2 de la [[practica-01-esquemas-y-taxonomias\|Práctica 01]] |
| Uniforme sobre $n = 27$ | $1/27 \approx 0{,}0370$ | $\sum (1/n)^2 = n \cdot 1/n^2 = 1/n$ |
| Uniforme sobre $n = 26$ | $1/26 \approx 0{,}0385$ | ídem |

**Ojo con el alfabeto.** La filmina escribe la suma como $\sum_{i=0}^{26}$, o sea **27 términos** — coherente con el castellano de **27 letras** que usa la [[guia-01-criptografia-clasica|Guía 1]] (Ej. 3 dice "español (27 letras)" y el criptograma trae `Ñ`). Bajo esa lectura el piso a comparar es $1/27 \approx 0{,}0370$, no $1/26$. *(La lectura del rango del índice es inferencia mía, no está aclarado en la filmina.)* Antes de comparar números, conviene fijar contra qué $n$ se está trabajando: mezclar 26 y 27 mueve el piso un 4 % relativo, que es poco frente a la señal pero suficiente para confundirse.

**La señal es la distancia entre esos dos valores:** $0{,}0775$ vs $\approx 0{,}037$ es un factor ~2. Todo el método vive de ese gap; no hace falta precisión decimal, hace falta distinguir "alto" de "bajo".

> **Chequeo propio (no de la cátedra):** si uno calcula $\sum p_i^2$ con la tabla de [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]], da **≈ 0,0724**, no $0{,}0775$. La diferencia viene de qué corpus y qué tabla de frecuencias se usa (y de si se incluye la `Ñ`); en la literatura circulan valores entre ~0,072 y ~0,078 para el castellano. **Para el parcial, usar el $0{,}0775$ de la filmina**; para clasificar un texto, cualquiera de los dos alcanza, porque el piso está en $0{,}037$.

---

## Por qué funciona

El IC es **invariante** ante dos de las tres familias del árbol de cifrados clásicos:

- **Sustitución monoalfabética** ([[cifrado-por-rotacion|rotación]] incluida): $c_i = \pi(m_i)$ con $\pi$ fija, así que $n_{\pi(i)}^{(c)} = n_i^{(m)}$. Permutar las **etiquetas** no cambia el **multiconjunto** de conteos, y la fórmula muestral sólo depende de ese multiconjunto. $\mathrm{IC}(c) = \mathrm{IC}(m)$, exactamente igual, no aproximadamente.
- **[[cifrado-por-transposicion|Transposición]]**: se reordenan posiciones, no símbolos. El histograma queda idéntico letra por letra, así que el IC también.
- **Sustitución polialfabética** ([[cifrado-de-vigenere|Vigenère]]): cada posición usa un corrimiento distinto según $k_{i \bmod t}$. La mezcla de $t$ histogramas rotados entre sí **aplana** la distribución, y el IC cae hacia $1/n$ (tanto más cerca cuanto mayor es $t$).

De ahí la regla de lectura:

| IC observado | Diagnóstico |
|---|---|
| ≈ 0,0775 (alto) | Monoalfabética **o** transposición — las frecuencias sobrevivieron |
| ≈ 1/n (bajo, plano) | Polialfabética |

Es la versión numérica de la columna **"frecuencias originales"** del árbol de la Práctica 01: tanto César como la transposición por columnas la tienen anotada, y el IC es justamente lo que la mide. El IC **no distingue** monoalfabética de transposición (ambas conservan el histograma) — para eso hace falta la tabla de criterios del Ej. 5 en [[criptoanalisis-por-frecuencias#Identificar el tipo de cifrado a partir del histograma|criptoanálisis por frecuencias]], que separa "frecuencias iguales letra por letra" (transposición) de "mismo perfil, letras distintas" (monoalfabética).

---

## Uso operativo contra Vigenère

1. **Calcular el $\mathrm{IC}$ muestral del criptograma completo.** Si da ≈ 0,0775, no es polialfabético: se deja Vigenère de lado y se va por frecuencias directas. Si da cerca de $1/n$, se continúa.
2. **Elegir un $t$ candidato** (de [[test-de-kasiski|Kasiski]], o barriendo $t = 1, 2, 3, \dots$).
3. **Partir el criptograma en $t$ sub-textos**: el sub-texto $j$ son los caracteres en las posiciones $i \equiv j \pmod t$, es decir *una de cada $t$ letras* arrancando en $j$.
4. **Calcular el $\mathrm{IC}$ muestral de cada sub-texto y promediar los $t$ valores.**
5. **Leer el resultado.** Si $t$ es el largo real de la clave, cada sub-texto fue cifrado íntegramente con la misma $k_j$: es un [[cifrado-por-rotacion|cifrado por rotación]] puro sobre texto en castellano, y como la rotación **conserva el IC**, el promedio salta a ≈ 0,0775. Si $t$ es incorrecto, cada sub-texto sigue mezclando corrimientos distintos y el promedio se queda cerca de $1/n$.
6. **Quedarse con el $t$ más chico que salta.** Los múltiplos del $t$ correcto también saltan (un sub-texto de $2t$ sigue siendo rotación pura), así que el criterio es el mínimo. Además, a mayor $t$ cada sub-texto tiene $N/t$ caracteres y el estimador se vuelve ruidoso: con $t$ grande y criptograma corto el salto se difumina.
7. **Con $t$ fijo, resolver cada sub-texto por separado** alineando su pico con la $E$, o por fuerza bruta sobre las $n$ claves. → [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]]

> El paso 4 de este procedimiento es la versión cuantitativa del paso "verificar que el histograma de cada sub-bloque tenga el perfil del castellano" que aparece en [[test-de-kasiski|test de Kasiski]]: en vez de mirar $t$ histogramas a ojo, se compara $t$ números contra $0{,}0775$.

---

## Kasiski vs. IC

No compiten: **Kasiski propone, el IC confirma.** Ese es el punto.

| | [[test-de-kasiski\|Test de Kasiski]] | Índice de coincidencia |
|---|---|---|
| **Qué necesita** | Que haya secuencias repetidas de ≥ 3 caracteres | Sólo largo suficiente; no necesita repeticiones |
| **Qué devuelve** | Un conjunto de **candidatos**: los divisores comunes de las distancias (el $D \mid \text{período}$ de la filmina) | Un **veredicto** por cada $t$ que le pases: alto ⇒ sí, bajo ⇒ no |
| **Modo de uso** | Generativo — sale a buscar $t$ | Verificativo — testea un $t$ dado |
| **Falla cuando** | El texto es corto, no hay repeticiones, o las que hay son casualidad | Los sub-textos quedan cortos ($t$ grande, $N$ chico) y el estimador se vuelve ruidoso |
| **Costo** | Buscar y factorizar distancias | $O(N)$ por candidato, barrible sobre todos los $t$ |

Flujo típico: Kasiski da los divisores plausibles → el IC descarta los espurios y confirma el mínimo que salta a $0{,}0775$. Si Kasiski no encuentra repeticiones utilizables, el IC solo alcanza: se barre $t = 1, 2, 3, \dots$ y se corta en el primer salto.

---

## En la Guía 1

El **Ejercicio 6** ([[guia-01-criptografia-clasica#Ejercicio 6|enunciado]]) pide, sobre un criptograma de Vigenère:

- **a.** *Comprobar* la longitud de la clave.
- **b.** Encontrar la clave y descifrar los diez primeros caracteres.

El verbo de (a) es **comprobar**, no "buscar": el enunciado ya entrega las cuatro repeticiones (`JGAZ`, `NMON`, `PNFA`, `AZMJ`) para que Kasiski proponga $t$. El IC es la herramienta natural de la comprobación — partir en $t$ sub-textos y verificar que el promedio salte a ≈ 0,0775.

Y la consigna *"obtener la frecuencia de aparición de cada letra como primera de cada bloque"* es literalmente construir el sub-texto $j = 1$ del paso 3: de ese mismo conteo salen **las dos cosas**, el $\mathrm{IC}$ que valida $t$ y el pico que, alineado con la $E$, da $k_1$.

> **Estado de resolución al 24/08:** [[guia-01-criptografia-clasica#Ejercicio 6|Guía 1 § Ejercicio 6]] — **en curso**. El Kasiski está corrido y la longitud comprobada por el mcd de las distancias ($t = 4$), y de ahí sale la clave `JUAN` y los diez primeros caracteres. **Lo que falta es justamente el IC:** partir el criptograma en los cuatro sub-textos y verificar que el promedio salte de $\approx 0{,}04$ a $\approx 0{,}0775$, que es la comprobación que pide el verbo de la parte (a).

