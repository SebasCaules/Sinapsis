---
titulo: Teórica — Suma de Bernoulli y Suma/Promedio de v.a. i.i.d.
resumen: 'Slides manuscritas de la unidad 7 que muestran que la suma de $n$ Bernoulli i.i.d. es binomial y deducen $\mu_{S_n}=n\mu_X$, $\sigma_{S_n}^2=n\sigma_X^2$ y $V(\overline X_n)=\sigma_X^2/n$, semilla de la ley de los grandes números.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/01 - Suma de Variables Aleatorias Independientes - Bernoulli.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma de Bernoulli y Suma/Promedio de v.a. i.i.d.

**Qué es:** slides manuscritas que muestran que la suma de $n$ Bernoulli i.i.d.
es Binomial, y que deducen la esperanza/varianza de la suma $S_n$ y del promedio
$\bar X_n$ de v.a. i.i.d. (Reúne el material de los archivos *Bernoulli* y
*Suma y Promedio de Variables Aleatorias I.I.D.*).

**Cubre las unidades/temas:** unidad 7, suma de i.i.d., promedio muestral.

## Puntos clave
- **i.i.d.** = **i**ndependientes e **i**dénticamente **d**istribuidas.
- $X_i\sim\mathrm{Bernoulli}(p)$ i.i.d. con $\mu_{X_i}=p$, $\sigma_{X_i}^2=pq$.
- $S_n=\sum_{i=1}^n X_i \sim \mathrm{Bin}(n,p)$.
- Para $X_i$ i.i.d. con media $\mu_X$ y varianza $\sigma_X^2$:
  - $\mu_{S_n}=n\,\mu_X$, $\;\sigma_{S_n}^2=n\,\sigma_X^2$.
  - Promedio $\bar X_n=\tfrac1n S_n$: $\;\mu_{\bar X_n}=\mu_X$, $\;\sigma_{\bar X_n}^2=\dfrac{\sigma_X^2}{n}\xrightarrow{n\to\infty}0$.
- La varianza del promedio tendiendo a $0$ es la **semilla de la Ley de los Grandes Números**.

## Páginas del wiki que toca
- [[suma-de-va-independientes]]
- [[suma-de-variables-aleatorias]]
- [[ley-de-grandes-numeros]]
- [[promedio-muestral]]
