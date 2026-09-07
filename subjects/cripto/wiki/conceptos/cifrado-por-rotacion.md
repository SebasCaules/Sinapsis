---
title: Cifrado por rotación
resumen: 'Desplaza cada letra $k$ posiciones en el alfabeto, con vuelta circular. Es el cifrado de César y el subtipo más simple de sustitución monoalfabética; su espacio de claves es el tamaño del alfabeto, así que cae por fuerza bruta.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Cifrado por rotación, ROT-X, Cifrado César, Rotación]
type: concepto
unidad: 1
clase: 1
orden: 3
created: 2026-08-10
updated: 2026-08-11
tags: [criptografia-clasica, sustitucion, rotacion, cesar, clase-01, guia-01]
sources: [Clase 01, Guía 1 Ej. 1, Guía 1 Ej. 3]
---

# Cifrado por rotación (ROT-X)

![Cifrado por rotación](../../assets/Pasted%20image%2020260806165202.png)

Cada letra se reemplaza por la que ocupa $k$ posiciones más adelante en el alfabeto, volviendo a la $A$ después de la $\mathbb{Z}$. Es el subtipo más simple de [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]]: usa sólo las $n$ permutaciones que son **traslaciones**.

> **Origen histórico:** ~50 AC, César. Ver [[clase-01-introduccion-y-criptografia-clasica#4. Historia de la criptografía|historia]].

---

## Definición formal

Sea $\Sigma$ un alfabeto finito con $n = \lvert\Sigma\rvert$ (**n = 27** para castellano, **n = 26** para inglés) y la biyección canónica por orden alfabético $\sigma: \Sigma \to \mathbb{Z}_n$, $\sigma(\texttt{A})=0, \dots, \sigma(\texttt{Z})=n-1$. Toda la aritmética es en $\mathbb{Z}_n = \mathbb{Z}/n\mathbb{Z}$.

**Espacios:** $K = \mathbb{Z}_n$, $M = C = \Sigma^{*}$ (o $\Sigma^{\ell}$ si se fija la longitud).

$$
\begin{aligned}
\mathsf{Gen}():&\quad k \xleftarrow{\$} \mathbb{Z}_n \quad\text{(uniforme: } \Pr[K=k]=1/n)\\
\mathsf{Enc}_k(m_1\cdots m_\ell):&\quad c_1\cdots c_\ell,\ \text{con } c_i=(m_i+k) \bmod n\\
\mathsf{Dec}_k(c_1\cdots c_\ell):&\quad m_1\cdots m_\ell,\ \text{con } m_i=(c_i-k) \bmod n
\end{aligned}
$$

### Formulación equivalente

Para cada $k$ se define la rotación $\pi_k: \mathbb{Z}_n \to \mathbb{Z}_n$, $\pi_k(x) = (x+k) \bmod n$. Cada $\pi_k$ es una **permutación** de $\mathbb{Z}_n$ (la traslación por $k$ en el grupo cíclico $(\mathbb{Z}_n, +)$), con inversa $\pi_k^{-1} = \pi_{-k}$. Entonces $\mathsf{Enc}_k = \pi_k^{*}$ y $\mathsf{Dec}_k = \pi_{-k}^{*}$, donde $f^{*}$ aplica $f$ posición por posición (*letterwise*).

### Corrección

$\mathsf{Dec}_k \circ \mathsf{Enc}_k = \pi_{-k}^{*} \circ \pi_k^{*} = (\pi_{-k} \circ \pi_k)^{*} = (\pi_0)^{*} = \operatorname{id}$, porque $\pi_{-k} \circ \pi_k = \pi_{-k+k} = \pi_0 = \operatorname{id}$. ∎

> **Ojo con el rango de $k$.** Las filminas dicen "$k$ es un número entre 1 y 26"; la definición formal usa $k \in \mathbb{Z}_n = \{0,\dots,n-1\}$. La diferencia es sólo $k = 0$ (la identidad, que no cifra nada). Katz & Lindell incluyen el 0 para que `Gen` sea uniforme sobre un grupo; la cátedra lo excluye por ser una clave inútil. **Aclarar cuál se usa** al dar la definición en un parcial.

---

## Ejemplos

**Inglés (n = 26), de las filminas:**

$$e(\texttt{prueba},\, 4) = \texttt{tvyife}$$

**Castellano (n = 27):**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | Ñ | O | P | Q | R | S | T | U | V | W | X | Y | Z |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 |

Con $k = 5$ y $m = \texttt{CRIPTO}$ → $\sigma(m) = (2, 18, 8, 16, 20, 15)$ → $(7, 23, 13, 21, 25, 20)$ = **$\texttt{HWNUYT}$**.

El módulo actúa cuando hay desborde: $\mathbb{Z}$ = 26, $(26+5) \bmod 27 = 4$ = $E$, luego $\mathsf{Enc}_5(\texttt{ZORRO}) = \texttt{ETWWT}$.

---

## Criptoanálisis

**Debilidad: hay muy pocas claves.** El espacio de claves es constante ($\lvert K\rvert = n$, 26 o 27) e independiente del largo del mensaje.

Un adversario recupera $m$ evaluando $\mathsf{Dec}_{k'}(c)$ para los $n$ valores posibles y quedándose con el único candidato legible. Costo: $O(n\cdot\ell)$ — ver [[ataque-de-fuerza-bruta|ataque de fuerza bruta]].

$$\begin{aligned}
c &= \texttt{tvyife}\\
k=1: &\quad d(1, \texttt{tvyife}) = \texttt{suxhed} \quad \text{sin sentido}\\
k=2: &\quad d(2, \texttt{tvyife}) = \texttt{rtwgdc} \quad \text{sin sentido}\\
k=3: &\quad d(3, \texttt{tvyife}) = \texttt{qsvfcb} \quad \text{sin sentido}\\
k=4: &\quad d(4, \texttt{tvyife}) = \texttt{prueba} \quad \text{¡con sentido!} \ \Rightarrow\ k = 4
\end{aligned}$$

Esto viola el **principio de espacio de claves suficiente**: si $\lvert K\rvert$ es chico, el esquema es inseguro. La condición es **necesaria pero no suficiente** — la [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]] tiene $n!$ claves y también cae.

### Límite de la fuerza bruta

> Con ROT-X: ¿cuál es el mensaje original $p$ si $e(\texttt{p}) = \texttt{a}$?

Con $\ell = 1$ **todos** los descifrados son igual de válidos: no hay forma de discriminar. La hipótesis implícita del ataque —*se puede distinguir un descifrado válido de uno inválido*— sólo vale cuando el mensaje tiene suficiente redundancia. Ese caso límite es exactamente el punto de contacto con el [[secreto-perfecto|secreto perfecto]]: con $\ell = 1$ la tabla de cifrado es un **cuadrado latino** (cada clave manda cada letra a una distinta, y para cada par $(m, c)$ hay exactamente una clave), y eso basta para que el criptograma no mueva la probabilidad a posteriori.

El Ejemplo 1 de [[probabilidad-y-criptografia|probabilidad y criptografía]] es ese mismo fenómeno en miniatura, con la cuenta hecha número por número: $\lvert M\rvert = \lvert K\rvert = \lvert C\rvert = 2$, tabla de cifrado que es un cuadrado latino y $\Pr[M = x \mid C = y] = \Pr[M = x]$ para todo par.

### Segunda fuga: el patrón de repeticiones

$\mathsf{Enc}_k$ preserva el **patrón de repeticiones** del texto plano y la **distribución de frecuencias** salvo un corrimiento cíclico de índices. Esa invariante es la que habilita el [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]] — que funciona igual para la sustitución monoalfabética general, sin necesidad de probar claves.

---

## Resumen

| | |
|---|---|
| $K$ | $\mathbb{Z}_n$, con $n = \lvert\Sigma\rvert$ |
| $M = C$ | $\Sigma^{*}$ (o $\Sigma^{\ell}$) |
| $\mathsf{Gen}()$ | $k \leftarrow \mathbb{Z}_n$ uniforme |
| $\mathsf{Enc}_k(m)_i$ | $(m_i + k) \bmod n$ |
| $\mathsf{Dec}_k(c)_i$ | $(c_i - k) \bmod n$ |
| Corrección | $\pi_{-k} \circ \pi_k = \pi_0 = \operatorname{id}$ |
| Seguridad | $\lvert K\rvert = n$ constante ⇒ fuerza bruta en $O(n\cdot\ell)$ |
| Secreto perfecto | Sólo si $\ell = 1$ (ver [[secreto-perfecto\|secreto perfecto]]) |
