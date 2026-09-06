---
titulo: Teórica — Estimación Puntual (Estimadores conocidos)
resumen: 'Teórica manuscrita de la unidad 8 con los estimadores clásicos y su insesgadez: media muestral $\overline X_n$, proporción $\hat p$ y varianza $S_n^2$ con denominador $n-1$; además $(n-1)S_n^2/\sigma^2\sim\chi^2_{n-1}$ en el caso normal.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/02 - Estimación Puntual - Algunos Conocidos.pdf"
ingerido: 2026-05-30
---

# Teórica — Estimación Puntual (Estimadores conocidos)

**Qué es:** teórica manuscrita con los estimadores puntuales clásicos de la
media, la proporción y la varianza, y la demostración de su insesgadez.
**Cubre las unidades/temas:** estimador de la media $\overline X_n$, de la
proporción $\hat p$, de la varianza $S_n^2$; distribución ji-cuadrado.

## Puntos clave
- **Estimador de la media:** $\hat\mu = \overline X_n = \frac1n\sum X_i$. Para
  $X_i$ i.i.d. con $\mu=E[X_i]$ y $\sigma^2=V(X_i)$: insesgado
  ($E[\overline X_n]=\mu$) y consistente ($\mathrm{mse}=\sigma^2/n\to 0$). Por TCL,
  $\overline X_n \approx \mathcal N(\mu, \sigma/\sqrt n)$.
- **Estimador de la proporción:** $\hat p = \frac1n\sum X_i$ con $X_i\sim$
  Bernoulli$(p)$. Insesgado y consistente; $V(\hat p)=p(1-p)/n$. Por TCL,
  $\hat p \approx \mathcal N(p,\sqrt{p(1-p)/n})$.
- **Estimador de la varianza:** $S_n^2 = \frac{1}{n-1}\sum (X_i-\overline X_n)^2$.
  Es **insesgado** ($E[S_n^2]=\sigma^2$, gracias al $n-1$) y consistente bajo
  ciertas condiciones. Identidad útil: $(n-1)S_n^2 = \sum X_i^2 - n\overline X_n^2$.
- Si $X_i\sim\mathcal N(\mu,\sigma^2)$ i.i.d.: $(n-1)S_n^2/\sigma^2 \sim \chi^2_{n-1}$
  (ji-cuadrado con $n-1$ grados de libertad).

## Páginas del wiki que toca
- [[estimacion-puntual]]
- [[varianza-muestral]]
- [[inferencia-estadistica]]
- [[intervalos-de-confianza]]
