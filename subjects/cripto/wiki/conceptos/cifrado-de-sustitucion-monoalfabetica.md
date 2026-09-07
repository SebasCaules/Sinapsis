---
title: Cifrado de sustitución monoalfabética
resumen: 'Reemplaza cada símbolo por otro según una permutación fija del alfabeto, la misma en todo el mensaje. Su espacio de claves de $n!$ resiste la fuerza bruta, pero conserva las frecuencias del idioma y cae por análisis de frecuencias.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Sustitución monoalfabética, Cifrado de sustitución, Sustitución simple]
type: concepto
unidad: 1
clase: 1
orden: 5
created: 2026-08-10
updated: 2026-09-06
tags: [criptografia-clasica, sustitucion, monoalfabetica, clase-01, practica-01, guia-01]
sources: [Clase 01, Práctica 01, Guía 1 Ej. 1, Guía 1 Ej. 2, Guía 1 Ej. 8]
---

# Cifrado de sustitución monoalfabética

![Cifrado de sustitución](../../assets/Pasted%20image%2020260806171036.png)

Reemplaza cada símbolo por otro, siempre el mismo, según una permutación fija del alfabeto. *Monoalfabética* = **un solo alfabeto de cifrado** para todo el mensaje: la sustitución no depende de la posición.

> **Dónde cae en la taxonomía.** El árbol de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] la ubica como hoja de **Sustitución → Sustitución Monoalfabética**, con el **cifrado César** como ejemplo, y le anota exactamente dos debilidades: **"espacio de claves (necesario)"** y **"frecuencias originales en cifrado"**. Son, respectivamente, las dos secciones de abajo: [[#Espacio de claves|espacio de claves]] y [[#Criptoanálisis|criptoanálisis]].

---

## Definición formal

Espacios: $K = S_n$ (el grupo simétrico: todas las permutaciones de $\mathbb{Z}_n$), $M = C = \Sigma^{*}$.

$$
\begin{aligned}
\mathsf{Gen}():&\quad k = \pi \xleftarrow{\$} S_n \quad\text{(uniforme entre las } n! \text{ permutaciones)}\\
\mathsf{Enc}_k(m_1\cdots m_\ell):&\quad c_1\cdots c_\ell,\ \text{con } c_i=\pi(m_i)\\
\mathsf{Dec}_k(c_1\cdots c_\ell):&\quad m_1\cdots m_\ell,\ \text{con } m_i=\pi^{-1}(c_i)
\end{aligned}
$$

La corrección es inmediata: $\pi^{-1}(\pi(m_i)) = m_i$ por definición de permutación inversa.

> El [[cifrado-por-rotacion|cifrado por rotación]] es el caso particular en que $\pi$ se restringe a las $n$ traslaciones $\pi_k(x) = x+k$.

## Ejemplo

La clave se escribe como la imagen del alfabeto en orden:

$$\begin{array}{rl}
k = & \texttt{dublcmfthijnzpxqeaosvkrwgy}\\
    & \texttt{abcdefghijklmnopqrstuvwxyz}\\[6pt]
\text{mensaje} : & \texttt{esto\ es\ una\ prueba}\\
\text{cifrado} : & \texttt{cosx\ co\ vpd\ qavcud}
\end{array}$$

Los símbolos del texto cifrado **no tienen que ser letras**: el criptograma hallado en 1794 en el cementerio de Trinity (NY) fue descifrado en 1986 sustituyendo símbolos arbitrarios por letras. Lo que define al esquema es la biyección, no el alfabeto de llegada.

---

## Espacio de claves

$$\lvert\mathcal{K}\rvert = n! \qquad 26! \approx 4\times10^{26} \qquad 27! \approx 1{,}1\times10^{28}$$

La [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] lo redondea a *"estamos en cuatrillones de claves"*; estrictamente son cientos o miles de cuatrillones (un cuatrillón es $10^{24}$). El punto no cambia: la [[ataque-de-fuerza-bruta|fuerza bruta]] es inviable. Y sin embargo el esquema cae en minutos — es el ejemplo canónico de que **un espacio de claves grande es necesario pero no suficiente**.

## Criptoanálisis

> **Debilidad: las propiedades estadísticas del lenguaje no se ven alteradas.**

Como $\pi$ es fija, la letra más frecuente del texto plano se mapea a la letra más frecuente del criptograma. El ataque es de [[criptoanalisis-por-frecuencias|análisis de frecuencias]] y no requiere probar ninguna clave:

1. Obtener la frecuencia estimada de cada símbolo en el lenguaje del mensaje.
2. Calcular la frecuencia de cada símbolo en el texto cifrado.
3. Asumir que los símbolos de mayor probabilidad se corresponden.
4. Formar grupos de dos y tres letras comunes (`el`, `la`, `de`, `las`, `los`, …) y refinar.

Los primeros documentos de criptoanálisis por frecuencias son del **800 DC** (mundo árabe) — a partir de ahí "empiezan a romperse" los criptosistemas conocidos hasta entonces.

### Ataque de texto plano elegido

Bajo [[modelos-de-ataque|CPA]] el esquema se quiebra de forma **total y trivial**: el adversario pide el cifrado del alfabeto completo ($abc\dots z$) y obtiene $\pi$ entera en una sola consulta. Es el Ej. 8 de la [[guia-01-criptografia-clasica|Guía 1]].

### Composición

Componer dos sustituciones simples **no agrega seguridad**: el conjunto de claves es un **grupo** bajo composición ($S_n$), así que $\pi_2 \circ \pi_1$ es otra permutación del mismo espacio. Es el Ej. 2 de la [[guia-01-criptografia-clasica|Guía 1]] — el enunciado está capturado en su [[guia-01-criptografia-clasica#Ejercicio 2|resolución]], y este argumento del grupo $S_n$ es la respuesta.

