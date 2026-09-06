---
titulo: Teórica — Suma de Dos Poisson
resumen: 'Slides manuscritas de la unidad 7 que prueban por convolución y binomio de Newton que la suma de dos Poisson independientes es $\mathrm{Poisson}(\lambda_1+\lambda_2)$, o sea que la familia es estable frente a la suma.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/03 - Suma de Variables Aleatorias Independientes - Dos Poisson.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma de Dos Poisson

**Qué es:** slides manuscritas que prueban que la suma de dos Poisson
independientes es Poisson con $\lambda$ sumados, vía convolución y el binomio
de Newton.

**Cubre las unidades/temas:** unidad 7, convolución, suma de Poisson.

## Puntos clave
- $X\sim\mathrm{Poisson}(\lambda_1)$, $Y\sim\mathrm{Poisson}(\lambda_2)$ indep.
- $R_X=R_Y=\mathbb N\cup\{0\}\Rightarrow R_S=\mathbb N\cup\{0\}$.
- Convolución: $p_S(s)=\sum_{y=0}^s \dfrac{\lambda_1^{s-y}e^{-\lambda_1}}{(s-y)!}\cdot\dfrac{\lambda_2^{y}e^{-\lambda_2}}{y!}$.
- Sacando factor común y multiplicando/dividiendo por $s!$:
  $p_S(s)=\dfrac{e^{-\lambda_1-\lambda_2}}{s!}\sum_{y=0}^s\binom{s}{y}\lambda_2^{y}\lambda_1^{s-y}=\dfrac{e^{-\lambda_1-\lambda_2}}{s!}(\lambda_1+\lambda_2)^s$.
- $\therefore S\sim\mathrm{Poisson}(\lambda_1+\lambda_2)$.

## Páginas del wiki que toca
- [[suma-de-va-independientes]]
- [[distribucion-poisson]]
