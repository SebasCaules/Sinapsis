---
titulo: Teórica — Estimación Puntual (Máximo a Posteriori)
resumen: 'Teórica manuscrita de la unidad 8 con el método bayesiano de máximo a posteriori: el parámetro es una variable aleatoria con densidad a priori y se maximiza la posterior; el ejemplo normal pondera $\overline X_n$ y la media del prior según $n$.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/04 - Estimación Puntual - Máximo a Posteriori.pdf"
ingerido: 2026-05-30
---

# Teórica — Estimación Puntual (Máximo a Posteriori)

**Qué es:** teórica manuscrita del método **máximo a posteriori (MAP)**, de
enfoque bayesiano: el parámetro $\theta$ se trata como variable aleatoria con
una distribución a priori.
**Cubre las unidades/temas:** visión bayesiana, prior, posterior, teorema de
Bayes, estimador MAP de la media de una normal con prior normal.

## Puntos clave
- Visión **bayesiana**: $\theta$ es una v.a. con información previa $g(\theta)$
  (densidad **a priori**).
- Distribución de los datos dado $\theta$: $f(x_1,\dots,x_n|\theta)$.
- **Densidad a posteriori** (Bayes):
  $g(\theta|x_1,\dots,x_n) = \dfrac{f(x_1,\dots,x_n|\theta)\,g(\theta)}{\int f(x_1,\dots,x_n|\zeta)\,g(\zeta)\,d\zeta}$.
- **Estimador MAP:** $\hat\theta = \arg\max_\theta g(\theta|x_1,\dots,x_n)$. El
  denominador no depende de $\theta$, así que se maximiza el numerador.
- **Ejemplo (normal con prior normal):** $X_i\sim\mathcal N(\mu,\sigma)$,
  prior $\mu\sim\mathcal N(\mu_p,\sigma_p)$. Resultado:
  $$\hat\mu = \frac{n\sigma_p^2}{n\sigma_p^2+\sigma^2}\,\overline X_n + \frac{\sigma^2}{n\sigma_p^2+\sigma^2}\,\mu_p.$$
  Para $n$ chico, $\hat\mu\approx\mu_p$ (manda el prior); para $n$ grande,
  $\hat\mu\approx\overline X_n$ (mandan los datos).

## Páginas del wiki que toca
- [[estimacion-puntual]]
- [[inferencia-estadistica]]
