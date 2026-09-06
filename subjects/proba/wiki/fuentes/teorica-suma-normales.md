---
titulo: Teórica — Suma de Dos Normales
resumen: 'Slides manuscritas de la unidad 7 que calculan la convolución de dos densidades normales completando cuadrados y concluyen que la suma de normales independientes es normal, con media $\mu_1+\mu_2$ y varianza $\sigma_1^2+\sigma_2^2$.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/04 - Suma de Variables Aleatorias Independientes - Dos Normales.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma de Dos Normales

**Qué es:** slides manuscritas que prueban que la suma de dos Normales
independientes es Normal, calculando la convolución de densidades y
**completando cuadrados** en el exponente.

**Cubre las unidades/temas:** unidad 7, convolución continua, suma de normales.

## Puntos clave
- $X\sim\mathcal N(\mu_1,\sigma_1)$, $Y\sim\mathcal N(\mu_2,\sigma_2)$ indep., $S=X+Y$.
- Resultado: $\mu_S=\mu_1+\mu_2$, $\;\sigma_S^2=\sigma_1^2+\sigma_2^2$, y $S$ es Normal.
- Técnica: $f_S(s)=\int f_X(s-y)f_Y(y)\,dy$; cambio de variable $r=\tfrac{y-\mu_2}{\sigma_2}$;
  se completa cuadrados en el exponente y la integral residual vale $1$ (es una densidad normal en $r$).
- $\therefore S\sim\mathcal N\big(\mu_1+\mu_2,\sqrt{\sigma_1^2+\sigma_2^2}\big)$.

## Páginas del wiki que toca
- [[suma-de-va-independientes]]
- [[distribucion-normal]]
