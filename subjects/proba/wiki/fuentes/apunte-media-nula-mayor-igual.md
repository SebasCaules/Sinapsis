---
titulo: Apunte — Prueba para la media, nula "mayor o igual" (cola izquierda)
resumen: 'Apunte manuscrito de la unidad 9 con la prueba unilateral de cola izquierda para $H_0:\mu\ge\mu_0$ con desvío conocido: valor crítico $\bar x_c=\mu_0-z_{1-\alpha}\,\sigma/\sqrt n$ y curva $\beta(\mu)$, escrita con el fractil inferior $z_\alpha$.'
tipo: fuente
formato: apunte
unidad: 9
archivo_raw: "raw/10-pruebas-de-hipotesis/05 - Prueba de hipotesis para la media - Nula mayor o igual.pdf"
ingerido: 2026-05-30
---

# Apunte — Prueba para la media, nula "mayor o igual" (cola izquierda)

**Qué es:** Apunte manuscrito que deduce la región de rechazo de **cola
izquierda** ($H_0:\mu\ge\mu_0$ vs $H_1:\mu<\mu_0$) y $\beta(\mu)$.

**Cubre las unidades/temas:** unidad 9 — prueba para la media unilateral con
$\sigma$ conocida.

## Puntos clave

- Región de rechazo a la **izquierda**: se rechaza $H_0$ si $\bar X_n < \bar x_c$.
- Probabilidad de error tipo I (acotada por el caso $\mu=\mu_0$, el peor dentro de $H_0$):
  $$ P(\text{Error I}) = P_\mu(\bar X_n < \bar x_c) \le P_{\mu_0}(\bar X_n < \bar x_c) = \Phi\!\left(\tfrac{\bar x_c-\mu_0}{\sigma/\sqrt n}\right) \le \alpha $$
  de donde $\bar x_c = \mu_0 - z_{1-\alpha}\,\dfrac{\sigma}{\sqrt n}$.
- $\beta(\mu) = 1 - \Phi\!\left(z_{\alpha} + \tfrac{\mu_0-\mu}{\sigma}\sqrt n\right)$ para $\mu<\mu_0$.
- Valores: $\beta(\bar x_c)=0.5$, $\beta(\mu_0)=1-\alpha$, $\lim_{\mu\to-\infty}\beta(\mu)=0$.

> **Nota de notación:** Este apunte usa el **fractil inferior** $z_\alpha$ (el que
> deja área $\alpha$ a la izquierda, negativo para $\alpha<0.5$), mientras que las
> páginas de concepto ([[prueba-de-hipotesis-para-la-media]],
> [[error-tipo-i-y-tipo-ii]]) usan $-z_{1-\alpha}$ (con $z_{1-\alpha}>0$). Son
> **equivalentes**: $z_\alpha=-z_{1-\alpha}$ por la simetría de la normal. Así,
> $\bar x_c=\mu_0+z_\alpha\,\sigma/\sqrt n=\mu_0-z_{1-\alpha}\,\sigma/\sqrt n$ es la
> misma frontera escrita de dos maneras.

## Páginas del wiki que toca

- [[prueba-de-hipotesis-para-la-media]]
- [[error-tipo-i-y-tipo-ii]]
