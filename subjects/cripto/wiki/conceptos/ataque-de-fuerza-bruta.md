---
title: Ataque de fuerza bruta
resumen: 'Probar todas las claves posibles hasta obtener un descifrado válido. Se puede montar siempre, así que fija el piso contra el que se mide cualquier esquema: un espacio de claves grande es necesario pero no suficiente.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]", "[[probabilidad-y-criptografia]]"]
aliases: [Fuerza bruta, Brute force, Búsqueda exhaustiva, Espacio de claves suficiente]
type: concepto
unidad: 1
clase: 1
orden: 4
created: 2026-08-10
updated: 2026-08-24
tags: [criptoanalisis, fuerza-bruta, espacio-de-claves, clase-01, practica-01]
sources: [Clase 01, Práctica 01, "probabilidad y criptografia.pdf"]
---

# Ataque de fuerza bruta

Probar **todas las claves posibles** hasta encontrar la que produce un descifrado válido. También llamado *ataque de prueba y error* o *búsqueda exhaustiva*.

> **El ataque de fuerza bruta se puede hacer siempre.** No depende de ninguna debilidad del algoritmo — sólo del tamaño de $K$. Por eso es el piso contra el que se mide cualquier esquema: si un ataque específico no supera a la fuerza bruta, no es un ataque interesante.

---

## Costo

Dado $c = \mathsf{Enc}_k(m)$ con $\lvert c\rvert = \ell$, el adversario evalúa $\mathsf{Dec}_{k'}(c)$ para todo $k' \in K$:

$$\text{Costo} = O(\lvert\mathcal{K}\rvert \cdot \ell)$$

Para el [[cifrado-por-rotacion|cifrado por rotación]], $\lvert K\rvert = n$ (26 o 27) — instantáneo.

$$\begin{aligned}
c &= \texttt{tvyife}\\
k=1: &\quad d(1, \texttt{tvyife}) = \texttt{suxhed} \quad \text{sin sentido}\\
k=2: &\quad d(2, \texttt{tvyife}) = \texttt{rtwgdc} \quad \text{sin sentido}\\
k=3: &\quad d(3, \texttt{tvyife}) = \texttt{qsvfcb} \quad \text{sin sentido}\\
k=4: &\quad d(4, \texttt{tvyife}) = \texttt{prueba} \quad \text{¡con sentido!}
\end{aligned}$$

## Principio de espacio de claves suficiente

> Si $\lvert K\rvert$ es chico, el esquema es inseguro. **La condición es necesaria pero no suficiente.**

El árbol de cifrados clásicos de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] lo anota con esa palabra exacta: el bullet de la sustitución monoalfabética dice **"espacio de claves (necesario)"**. El paréntesis es este principio en una palabra.

Las dos mitades importan y se ilustran con dos ejemplos de la misma clase:

| Esquema | $\lvert K\rvert$ | ¿Resiste fuerza bruta? | ¿Es seguro? |
|---|---|---|---|
| [[cifrado-por-rotacion\|Rotación]] | $n$ = 27 | No | No |
| [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] | $n!$ = $27!$ ≈ 1,1·10²⁸ | Sí | — cae por [[criptoanalisis-por-frecuencias\|frecuencias]] |

> $n$ es el **tamaño del alfabeto**: $n = 26$ (inglés) o $n = 27$ (castellano, con `Ñ`). Las dos filas están escritas sobre el castellano, que es el alfabeto de la [[guia-01-criptografia-clasica|Guía 1]]; con el alfabeto inglés serían $n = 26$ y $26! \approx 4\cdot 10^{26}$. La definición general es $\lvert K\rvert = n!$ — ver [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]].

**Moraleja:** agrandar el espacio de claves elimina un ataque, no todos. La sustitución monoalfabética tiene un espacio de claves astronómico y se rompe a mano en un rato.

El contraejemplo más chico posible está en el **Ejemplo 2** de [[probabilidad-y-criptografia|probabilidad y criptografía]]: con $\lvert M\rvert = 2$, $\lvert K\rvert = 3$ y $\lvert C\rvert = 4$ se cumple $\lvert K\rvert \ge \lvert M\rvert$ y aun así ver $c = 1$ determina $m = \texttt{a}$ (y $c = 4$ → $m = \texttt{b}$), o sea el **mensaje entero**. Claves de sobra, cero [[secreto-perfecto|secreto perfecto]].

---

## La hipótesis oculta del ataque

El ataque asume algo que no siempre vale:

> **Hipótesis de fuerza bruta: se puede discriminar un descifrado válido de uno inválido.**

Eso requiere **redundancia** en el mensaje. La pregunta de las filminas lo muestra:

> Con ROT-X: ¿cuál es el mensaje original $p$ si $e(\texttt{p}) = \texttt{a}$?

Con un solo símbolo, las 27 claves dan 27 mensajes y **todos son igualmente plausibles**. La fuerza bruta enumera pero no decide. Ese caso límite es exactamente [[secreto-perfecto|secreto perfecto]].

En la práctica la hipótesis se instrumenta con un **test de plausibilidad**: ¿el candidato es texto en el idioma esperado? Se automatiza con frecuencias de letras, listas de bigramas/trigramas frecuentes o un diccionario.

## Nota histórica

**1939 — Bombe / Enigma.** Los ataques de exploración sistemática por fuerza bruta motivaron las primeras protocomputadoras. La fuerza bruta no es un ataque "de juguete": es el que hizo falta industrializar el cómputo.

## Ver también

- [[principio-de-kerckhoffs|Principio de Kerckhoffs]]
- [[modelos-de-ataque|Modelos de ataque]]
- [[criptoanalisis-por-frecuencias|Criptoanálisis por frecuencias]] — el ataque que *no* enumera claves
- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] — el bullet "espacio de claves (necesario)"
- [[probabilidad-y-criptografia|Probabilidad y criptografía]] — el Ejemplo 2, contraejemplo numérico con $\lvert K\rvert \ge \lvert M\rvert$
