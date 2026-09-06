---
titulo: Teórica — Suma de Variables Aleatorias Independientes
resumen: "Slides manuscritas de la unidad 7 con la suma de variables independientes: la covarianza se anula, las varianzas se suman y la distribución sale por convolución; incluye la tabla de casos estables binomial, Poisson y normal."
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/02- Suma de Variables Aleatorias - Independientes.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma de Variables Aleatorias Independientes

**Qué es:** slides manuscritas con el caso $X,Y$ **independientes**: la covarianza
se anula y la suma se calcula por **convolución**. Incluye la tabla de casos
especiales (Binomial, Poisson, Normal).

**Cubre las unidades/temas:** unidad 7, suma de v.a. independientes.

## Puntos clave
- $X,Y$ independientes $\Rightarrow \mathrm{Cov}(X,Y)=0$, $p_{Y\mid X}=p_Y$, $f_{Y\mid X}=f_Y$.
- Por lo tanto $\mu_S=\mu_X+\mu_Y$ y $\sigma_S^2=\sigma_X^2+\sigma_Y^2$ (sin término cruzado).
- **Convolución discreta:** $p_S(s)=\sum_{y\in R_Y} p_X(s-y)\,p_Y(y)$.
- **Convolución continua:** $f_S(s)=\int_{-\infty}^{+\infty} f_X(s-y)\,f_Y(y)\,dy$.
- Casos especiales ($X,Y$ indep.):
  1. $X\sim\mathrm{Bin}(n_1,p),\;Y\sim\mathrm{Bin}(n_2,p)\Rightarrow S\sim\mathrm{Bin}(n_1+n_2,p)$.
  2. $X\sim\mathrm{Poisson}(\lambda_1),\;Y\sim\mathrm{Poisson}(\lambda_2)\Rightarrow S\sim\mathrm{Poisson}(\lambda_1+\lambda_2)$.
  3. $X\sim\mathcal N(\mu_1,\sigma_1),\;Y\sim\mathcal N(\mu_2,\sigma_2)\Rightarrow S\sim\mathcal N(\mu_1+\mu_2,\sqrt{\sigma_1^2+\sigma_2^2})$.

## Páginas del wiki que toca
- [[suma-de-variables-aleatorias]]
- [[suma-de-va-independientes]]
- [[covarianza-y-correlacion]]
