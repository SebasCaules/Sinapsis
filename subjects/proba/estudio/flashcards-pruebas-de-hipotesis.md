---
tipo: flashcards
titulo: 'Pruebas de hipótesis'
id: pruebas-de-hipotesis
division: "9"
---

<!-- Generado desde estudio/study-data.js con el conversor del Sprint 2. -->

## Error tipo I vs tipo II.

> pagina: error-tipo-i-y-tipo-ii

Tipo I ($\alpha$): rechazar $H_0$ siendo verdadera. Tipo II ($\beta$): no rechazar $H_0$ siendo falsa. Potencia $=1-\beta$.

## Definición de valor p y regla de decisión.

> pagina: valor-p

Probabilidad, bajo $H_0$, de un estadístico tan o más extremo que el observado. Se rechaza $H_0\iff p<\alpha$.

## Estadístico Z para la media (σ conocida).

> pagina: prueba-de-hipotesis-para-la-media

$Z=\dfrac{\bar X-\mu_0}{\sigma/\sqrt n}$. Se compara con $z_{1-\alpha}$ o $z_{1-\alpha/2}$ según la cola.

## Estadístico T para la media (σ desconocida).

> pagina: prueba-de-hipotesis-para-la-media

$T=\dfrac{\bar X-\mu_0}{S/\sqrt n}\sim t_{n-1}$ bajo $H_0$.

## Estadístico Z para una proporción.

> pagina: prueba-de-hipotesis-para-la-proporcion

$Z=\dfrac{\hat q-q_0}{\sqrt{q_0(1-q_0)/n}}$ (con $n$ grande, $n>100$).

## Tamaño muestral fijando α y β (media, σ conocida).

> pagina: diseno-de-prueba-tamano-muestral

$n=\left(\dfrac{(z_{1-\alpha}+z_{1-\beta^*})\,\sigma}{\mu_1-\mu_0}\right)^2$ (redondear hacia arriba).
