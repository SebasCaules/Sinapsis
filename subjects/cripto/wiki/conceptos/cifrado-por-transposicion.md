---
title: Cifrado por transposición
resumen: 'Familia clásica complementaria a la sustitución: no cambia los símbolos sino sus posiciones. Preserva el histograma exacto del idioma, de modo que el análisis de frecuencias no lo rompe pero lo delata.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Transposición, Cifrado por transposición, Transposición por columnas, Escítala]
type: concepto
unidad: 1
clase: 1
orden: 9
created: 2026-08-10
updated: 2026-08-11
tags: [criptografia-clasica, transposicion, permutacion, clase-01, practica-01, guia-01]
sources: [Clase 01, Práctica 01, Guía 1 Ej. 5, Guía 1 Ej. 7]
---

# Cifrado por transposición

La otra familia clásica, complementaria a la [[cifrado-de-sustitucion-monoalfabetica|sustitución]]: **no cambia los símbolos, cambia sus posiciones**.

| Familia | Qué altera | Qué preserva |
|---|---|---|
| **Sustitución** | los símbolos | las posiciones |
| **Transposición** | las posiciones | los símbolos (y por lo tanto **el histograma exacto**) |

> **Dónde cae en la taxonomía.** El árbol de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] la pone como **rama hermana de Sustitución** —no como una hoja adentro—, con *trasposición por columnas* de ejemplo y un único bullet: **"frecuencias originales"**.

> **Origen histórico:** ~700-300 AC, la **escítala** (*scitala*) espartana — criptosistema de transposición utilizando báculos. El mensaje se escribía sobre una cinta enrollada en un bastón de diámetro dado; desenrollada, las letras quedaban permutadas. El diámetro del bastón es la clave.

---

## Transposición por columnas

La variante que aparece en la [[guia-01-criptografia-clasica|Guía 1]]. El texto se escribe por filas en una grilla de $n$ columnas y se lee por columnas (eventualmente en un orden dado por una palabra clave).

$$\begin{aligned}
&\text{mensaje: } \texttt{ESTOESUNAPRUEBA}, \qquad n = 5 \text{ columnas}\\[4pt]
&\begin{array}{ccccc}
\texttt{E} & \texttt{S} & \texttt{T} & \texttt{O} & \texttt{E}\\
\texttt{S} & \texttt{U} & \texttt{N} & \texttt{A} & \texttt{P}\\
\texttt{R} & \texttt{U} & \texttt{E} & \texttt{B} & \texttt{A}
\end{array}\\[4pt]
&\text{lectura por columnas: } \texttt{ESR\ SUU\ TNE\ OAB\ EPA}\\
&\text{criptograma: } \texttt{ESRSUUTNEOABEPA}
\end{aligned}$$

La clave es $n$ (y, en la variante con palabra clave, el orden de lectura de las columnas).

## Detección

Un criptograma de transposición se identifica **sin descifrarlo**: sus frecuencias de letras coinciden **exactamente** con las del idioma, letra por letra. Ninguna sustitución produce eso salvo la identidad. Ver [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]] y el Ej. 5 de la Guía 1.

Esa misma propiedad es su debilidad: el análisis de frecuencias no lo rompe, pero lo **delata**.

### Pero las frecuencias solas no la distinguen de la monoalfabética

El bullet **"frecuencias originales"** que la práctica le anota a la transposición es **el mismo** que le anota a la [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]], y ahí está el punto fino: las dos preservan la estadística de primer orden, así que el histograma **por sí solo no las separa entre sí** — sólo separa a las dos de la polialfabética, que lo aplana. Numéricamente es lo mismo: ambas dan [[indice-de-coincidencia|índice de coincidencia]] **alto** (≈ 0,0775 en castellano), porque ninguna de las dos altera el multiconjunto de conteos.

Lo que desempata no es la **forma** del histograma sino **qué letras** ocupan los picos:

- picos sobre $E$, $A$, $O$… con los conteos del castellano → **transposición** (los símbolos no cambiaron, sólo se movieron);
- misma forma pero sobre letras "equivocadas" → **monoalfabética** (los conteos se permutaron de etiqueta).

Ese es exactamente el criterio de desempate del Ej. 5. Ver la tabla en [[criptoanalisis-por-frecuencias#Identificar el tipo de cifrado a partir del histograma|criptoanálisis por frecuencias]].

## Composición con sustitución

Componer transposición con un [[cifrado-por-rotacion|cifrado por rotación]] es el objeto del Ej. 7 de la Guía 1. La observación clave es que las dos capas son **independientes y se pueden atacar por separado**:

- la rotación cambia símbolos pero no posiciones,
- la transposición cambia posiciones pero no símbolos,

así que el histograma del criptograma final es el del castellano **rotado** — la capa de transposición no lo afecta. Eso permite recuperar la rotación primero, por frecuencias, y sólo después atacar la permutación. El costo del ataque combinado es la **suma**, no el producto, de los dos espacios.

> Esta idea —que combinar dos operaciones no basta si el criptoanalista puede separarlas— reaparece en la criptografía moderna: las redes de sustitución-permutación (SPN) alternan ambas capas **muchas veces** justamente para impedir esa separación. Ver Clase 2 (cifrado en bloque).
