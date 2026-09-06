---
titulo: Teórica — Suma de Variables Aleatorias (General)
resumen: 'Slides manuscritas de la unidad 7 con el caso general de $S=X+Y$ sin suponer independencia: $\mu_S=\mu_X+\mu_Y$ y $\sigma_S^2=\sigma_X^2+2\,\mathrm{Cov}(X,Y)+\sigma_Y^2$, más las fórmulas de la distribución de la suma.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/01 - Suma de Variables Aleatorias - General.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma de Variables Aleatorias (General)

**Qué es:** slides manuscritas que deducen la esperanza y la varianza de $S=X+Y$
para v.a. **cualesquiera** (no necesariamente independientes).

**Cubre las unidades/temas:** unidad 7, generalidades de la suma de v.a.

## Puntos clave
- $\mu_S = E[S] = E[X]+E[Y] = \mu_X+\mu_Y$ (siempre, linealidad de la esperanza).
- $\sigma_S^2 = \sigma_X^2 + 2\,\mathrm{Cov}(X,Y) + \sigma_Y^2$ (caso general).
- Deducción de la varianza desarrollando $E\big[((X-\mu_X)+(Y-\mu_Y))^2\big]$.
- Para $X,Y$ v.a. discretas: $p_S(k)=P(X+Y=k)=\sum_{y\in R_Y} p_{X,Y}(k-y,\,y)$.
- Para $X,Y$ v.a. continuas: $f_S(s)=\int_{-\infty}^{+\infty} f_{X,Y}(s-y,\,y)\,dy$.

## Páginas del wiki que toca
- [[suma-de-variables-aleatorias]]
- [[covarianza-y-correlacion]]
