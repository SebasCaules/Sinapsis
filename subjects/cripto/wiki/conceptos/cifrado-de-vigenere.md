---
title: Cifrado de Vigenère
resumen: 'Sustitución polialfabética de 1553: aplica rotaciones que van cambiando según una clave de $t$ letras, de modo que un mismo símbolo se cifra distinto según su posición. Kasiski publica su método de ruptura en 1863.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Vigenère, Cifrado de Vigenere, Sustitución polialfabética]
type: concepto
unidad: 1
clase: 1
orden: 7
created: 2026-08-10
updated: 2026-08-11
tags: [criptografia-clasica, sustitucion, polialfabetica, vigenere, kasiski, clase-01, guia-01, practica-01]
sources: [Clase 01, Clase 1.pdf (práctica), Guía 1 Ej. 1, Guía 1 Ej. 4, Guía 1 Ej. 6]
---

# Cifrado de Vigenère

Es una **sustitución polialfabética**: un mismo símbolo del texto plano puede transformarse en símbolos distintos según su **posición**. Equivale a aplicar [[cifrado-por-rotacion|ROT-X]] con un corrimiento que va rotando según una clave de $t$ letras.

- Creado en **1553**.
- Durante casi **300 años** se lo consideró seguro.
- En **1863** Friedrich Kasiski publica un método para resolverlo — ver [[test-de-kasiski|test de Kasiski]].

---

## Definición formal

Espacios: $K = \bigcup_{t\ge 1} (\mathbb{Z}_n)^t$ (claves de largo arbitrario $t \ge 1$), $M = C = \Sigma^{*}$.

$$
\begin{aligned}
\mathsf{Gen}():&\quad k = k_1\cdots k_t,\ \text{con cada } k_i \xleftarrow{\$} \mathbb{Z}_n\\
\mathsf{Enc}_k(m_1\cdots m_\ell):&\quad c_i = \bigl(m_i + k_{((i-1) \bmod t)+1}\bigr) \bmod n\\
\mathsf{Dec}_k(c_1\cdots c_\ell):&\quad m_i = \bigl(c_i - k_{((i-1) \bmod t)+1}\bigr) \bmod n
\end{aligned}
$$

> El índice $((i-1) \bmod t) + 1$ es simplemente *"la posición $i$ recorriendo la clave cíclicamente, con la clave indexada desde 1"*. Si se indexa desde 0 queda $k_{i \bmod t}$, que es más limpio — **elegir una convención y ser consistente**.

Casos borde útiles: con $t = 1$ es exactamente el cifrado por rotación; con $t = \ell$ y clave aleatoria fresca es el **one-time pad**.

## Ejemplo

La clave se puede dar como letras o como números (es lo mismo vía $\sigma$). De las filminas: $K = \texttt{ECFD} = 4253$ (largo 4).

Ejemplo verificado, alfabeto inglés ($n = 26$), $K = \texttt{CLAVE} = (2, 11, 0, 21, 4)$:

$$\begin{array}{r|cccccccccccc}
m: & \texttt{c} & \texttt{r} & \texttt{i} & \texttt{p} & \texttt{t} & \texttt{o} & \texttt{g} & \texttt{r} & \texttt{a} & \texttt{f} & \texttt{i} & \texttt{a}\\
   & 2 & 17 & 8 & 15 & 19 & 14 & 6 & 17 & 0 & 5 & 8 & 0\\
k: & 2 & 11 & 0 & 21 & 4 & 2 & 11 & 0 & 21 & 4 & 2 & 11\\
c: & 4 & 2 & 8 & 10 & 23 & 16 & 17 & 17 & 21 & 9 & 10 & 11\\
   & \texttt{e} & \texttt{c} & \texttt{i} & \texttt{k} & \texttt{x} & \texttt{q} & \texttt{r} & \texttt{r} & \texttt{v} & \texttt{j} & \texttt{k} & \texttt{l}
\end{array}$$

Notar el efecto polialfabético: las dos $i$ del plano (posiciones 3 y 11) van a $i$ y $k$; las dos $r$ van a $c$ y $r$. **El patrón de repeticiones del plano se rompe** — que es justamente lo que fallaba en la [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]].

---

## Criptoanálisis

El ataque tiene dos etapas:

1. **Determinar la longitud $t$ del bloque** ([[test-de-kasiski|test de Kasiski]] o [[indice-de-coincidencia|índice de coincidencia]]).
2. **Analizar cada bloque por separado.** Una vez conocido $t$, las posiciones $i \equiv j \pmod t$ fueron cifradas todas con la misma $k_j$: cada una de esas $t$ subcadenas es un [[cifrado-por-rotacion|cifrado por rotación]] puro y se resuelve por [[criptoanalisis-por-frecuencias|frecuencias]] o fuerza bruta sobre $n$ claves.

El costo total pasa de $n^t$ (probar todas las claves) a $t \cdot n$ — de exponencial a lineal en $t$. **Ese es el punto: Vigenère no falla por tener pocas claves, falla porque el problema se descompone.**

El árbol de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] lo clasifica como **sustitución polialfabética** y le cuelga exactamente esas dos herramientas: el **período de clave** ($D \mid \text{período}$, vía [[test-de-kasiski|Kasiski]]) y el **[[indice-de-coincidencia|índice de coincidencia]]**. La primera propone candidatos de $t$ a partir de las distancias entre repeticiones; el segundo confirma cuál es el bueno midiendo si los sub-bloques se parecen al idioma o a texto aleatorio.

### Consecuencias prácticas

- **Clave larga y sin letras repetidas es mejor.** Cuanto mayor $t$, menos texto queda por sub-bloque y más difícil es el análisis estadístico de cada uno. Además una clave con letras repetidas (p. ej. `CERO` vs `COMPADRE`) produce sub-bloques con el mismo corrimiento, que se pueden fusionar. Es el Ej. 4b de la [[guia-01-criptografia-clasica|Guía 1]].
- **Componer dos Vigenère da otro Vigenère.** Las claves forman grupo bajo suma módulo $n$; el largo resultante es $\operatorname{mcm}(t_1, t_2)$. Ej. 4c de la Guía 1.
- **Bajo [[modelos-de-ataque|CPA]] cae trivialmente:** pedir el cifrado de una cadena suficientemente larga de $aaaa\dots$ devuelve la clave en claro, repetida. Ej. 8 de la Guía 1.

---

## Ver también

- [[test-de-kasiski|Test de Kasiski]] — cómo se obtiene $t$
- [[indice-de-coincidencia|Índice de coincidencia]] — cómo se confirma $t$
- [[criptoanalisis-por-frecuencias|Criptoanálisis por frecuencias]] — cómo se resuelve cada sub-bloque
- [[cifrado-por-rotacion|Cifrado por rotación]] — el caso $t = 1$
- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]]
- [[guia-01-criptografia-clasica|Guía 1 — Ej. 1, 4, 6, 8]]
