---
titulo: Teórica — Suma de Dos Binomiales
resumen: 'Slides manuscritas de la unidad 7 que prueban por convolución y la identidad de Vandermonde que la suma de dos binomiales independientes con la misma $p$ es $\mathrm{Bin}(n_1+n_2,p)$; con parámetros $p$ distintos el resultado deja de valer.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/02 - Suma de Variables Aleatorias Independientes - Dos Binomiales.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma de Dos Binomiales

**Qué es:** slides manuscritas que prueban que la suma de dos Binomiales
independientes **con la misma $p$** es Binomial, vía convolución y la
**identidad de Vandermonde**.

**Cubre las unidades/temas:** unidad 7, convolución, suma de binomiales.

## Puntos clave
- $X\sim\mathrm{Bin}(n_1,p)$, $Y\sim\mathrm{Bin}(n_2,p)$ independientes.
- **Identidad de Vandermonde:** $\displaystyle\binom{n_1+n_2}{k}=\sum_{\ell=0}^{k}\binom{n_1}{\ell}\binom{n_2}{k-\ell}$.
- Convolución: $p_S(s)=\sum_{y=0}^s p_X(s-y)\,p_Y(y) = p^s q^{\,n_1+n_2-s}\sum_{y=0}^s\binom{n_1}{s-y}\binom{n_2}{y}$.
- Aplicando Vandermonde: $p_S(s)=\binom{n_1+n_2}{s}p^s q^{\,n_1+n_2-s}$, $\;\forall s\in R_S$.
- $\therefore S\sim\mathrm{Bin}(n_1+n_2,p)$.
- **Requiere misma $p$.** Si las $p$ difieren, la suma NO es Binomial.

## Páginas del wiki que toca
- [[suma-de-va-independientes]]
- [[distribucion-binomial]]
