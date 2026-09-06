---
titulo: Teórica — IC para la proporción
resumen: 'Teórica manuscrita de la unidad 8 con el intervalo de confianza para una proporción a partir de Bernoulli: el bilateral $\hat p \pm z_{(1+\gamma)/2}\sqrt{\hat p(1-\hat p)/n}$, sus versiones unilaterales y el costo de usar $\hat p$ en lugar de $p$.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/02 - Intervalos de Confianza - Proporción.pdf"
ingerido: 2026-05-30
---

# Teórica — IC para la proporción

**Qué es:** teórica manuscrita del intervalo de confianza para una proporción
$p$ a partir de $X_i\sim$ Bernoulli$(p)$.
**Cubre las unidades/temas:** IC bilateral y unilaterales para $p$, uso de
$\hat p$ en el desvío.

## Puntos clave
- $\hat p = \frac1n\sum X_i \stackrel{TCL}{\approx} \mathcal N\!\left(p,\sqrt{p(1-p)/n}\right)$
  para $n$ grande. El desvío $\sqrt{p(1-p)/n}$ depende del $p$ **desconocido**,
  por lo que se reemplaza por $\sqrt{\hat p(1-\hat p)/n}$.
- **IC bilateral:** $\left(\hat p \pm z_{\frac{1+\gamma}{2}}\sqrt{\tfrac{\hat p(1-\hat p)}{n}}\right)$.
- **IC unilaterales:** $\left(\hat p - z_\gamma\sqrt{\tfrac{\hat p(1-\hat p)}{n}},\ 1\right)$ y $\left(0,\ \hat p + z_\gamma\sqrt{\tfrac{\hat p(1-\hat p)}{n}}\right)$ (acotados a $[0,1]$).
- **¿Qué tan grave es usar $\hat p$ en lugar de $p$?** Ejemplo con $p=0.5$,
  $\hat p=0.4$, $n=100$: $\sqrt{p(1-p)/n}=0.05$ vs $\sqrt{\hat p(1-\hat p)/n}=0.0489898$,
  diferencia de $\sim 2\%$. La aproximación es buena para $n$ grande.

## Páginas del wiki que toca
- [[intervalos-de-confianza]]
- [[estimacion-puntual]]
- [[inferencia-estadistica]]
