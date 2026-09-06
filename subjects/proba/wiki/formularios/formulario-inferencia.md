---
titulo: Formulario — Inferencia Estadística
resumen: "Hoja de la unidad 8: error cuadrático medio, sesgo y consistencia, estimadores clásicos, intervalos de confianza para la media, la proporción y la varianza, tamaño muestral y un árbol para decidir entre $z$, $t$ y ji-cuadrado."
tipo: formulario
unidad: 8
orden: 7
tags: [inferencia, estimacion, formulario, cheatsheet]
fuentes: ["[[teorica-estimacion-puntual-intro]]", "[[teorica-estimacion-puntual-conocidos]]", "[[teorica-ic-media-desvio-conocido]]", "[[teorica-ic-proporcion]]", "[[teorica-ic-media-desvio-desconocido-intervalos]]", "[[tp8-estimacion-de-parametros]]", "[[video-ic-desvio-desconocido]]"]
actualizado: 2026-09-03
---

# Formulario — Inferencia Estadística

Hoja de fórmulas de la [[inferencia-estadistica]] (unidad 8): estimación puntual
e intervalos de confianza. Notación: $X_i$ i.i.d., $\mu=E[X_i]$, $\sigma^2=V(X_i)$,
$\overline X_n=\frac1n\sum X_i$, nivel de confianza $\gamma$.

## Estimación puntual

| Concepto | Fórmula |
|---|---|
| Error cuadrático medio | $\mathrm{mse}(\hat\theta)=E[(\hat\theta-\theta)^2]$ |
| Descomposición | $\mathrm{mse}(\hat\theta)=V(\hat\theta)+\mathrm{sesgo}^2(\hat\theta)$ |
| Sesgo | $\mathrm{sesgo}(\hat\theta)=E[\hat\theta]-\theta$ |
| Insesgado | $E[\hat\theta]=\theta$ |
| Consistente | $\lim_{n\to\infty}\mathrm{mse}(\hat\theta)=0$ |

**Estimadores clásicos:**

| Parámetro | Estimador | ECM |
|---|---|---|
| Media $\mu$ | $\overline X_n=\frac1n\sum X_i$ | $\sigma^2/n$ |
| Proporción $p$ | $\hat p=\frac1n\sum X_i$ | $p(1-p)/n$ |
| Varianza $\sigma^2$ | $S_n^2=\frac{1}{n-1}\sum(X_i-\overline X_n)^2$ | $\frac{\sigma^4}{n}\!\left(\kappa+2+\frac{2}{n-1}\right)$ |

Identidad: $(n-1)S_n^2=\sum X_i^2 - n\overline X_n^2$. Si normal:
$(n-1)S_n^2/\sigma^2\sim\chi^2_{n-1}$ ([[distribucion-ji-cuadrado|ji-cuadrado]]).
Ver [[varianza-muestral]].

**Métodos de construcción** (ver [[estimacion-puntual]]):
- **Máxima verosimilitud:** $\hat\theta=\arg\max_\theta \prod_i f(x_i;\theta)$;
  se maximiza $\sum_i\ln f(x_i;\theta)$.
- **MAP (bayesiano):** $\hat\theta=\arg\max_\theta g(\theta\mid x)$ con
  $g(\theta\mid x)\propto f(x\mid\theta)\,g(\theta)$.
- **Momentos:** igualar $\mu_k=E[X^k]=H(\theta)$ al momento muestral y despejar.

## Intervalos de confianza para la media

Semiamplitud bilateral $\Delta_B$ (el IC es $\overline X_n\pm\Delta_B$);
unilateral $\Delta_U$ usa $\gamma$ en vez de $\frac{1+\gamma}{2}$.

| Caso | Condición | $\Delta_B$ |
|---|---|---|
| 1 | Normal, $\sigma$ conocido (o $n$ grande, no normal) | $z_{\frac{1+\gamma}{2}}\dfrac{\sigma}{\sqrt n}$ |
| 3 | Normal, $\sigma$ desconocido | $t_{n-1,\frac{1+\gamma}{2}}\dfrac{S_n}{\sqrt n}$ |
| 3' | $\sigma$ desconocido, $n$ muy grande | $z_{\frac{1+\gamma}{2}}\dfrac{S_n}{\sqrt n}$ |

donde $z_p=\Phi^{-1}(p)$ y $t_{m,p}=F_{T_m}^{-1}(p)$ ([[distribucion-t-de-student]]).

**IC bilateral (caso 1):**
$$IC_\gamma(\mu)=\left(\overline X_n - z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n},\; \overline X_n + z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n}\right).$$
**Unilaterales (caso 1):** $\left(\overline X_n - z_\gamma\frac{\sigma}{\sqrt n},\infty\right)$, $\left(-\infty,\overline X_n + z_\gamma\frac{\sigma}{\sqrt n}\right)$.

## Intervalo de confianza para la proporción

$$IC_\gamma(p)=\left(\hat p \pm z_{\frac{1+\gamma}{2}}\sqrt{\frac{\hat p(1-\hat p)}{n}}\right),\qquad \text{(}n\text{ grande)}.$$
Unilaterales acotados a $[0,1]$:
$\left(\hat p - z_\gamma\sqrt{\tfrac{\hat p(1-\hat p)}{n}},\,1\right)$ y
$\left(0,\,\hat p + z_\gamma\sqrt{\tfrac{\hat p(1-\hat p)}{n}}\right)$.

## Tamaño muestral (error de muestreo $E$ = semiamplitud)

| Objetivo | Condición |
|---|---|
| Media | $n\ge z_{\frac{1+\gamma}{2}}^2\,\dfrac{\sigma^2}{E^2}$ |
| Media, $\sigma$ desconocido (muestra piloto) | $n\ge z_{\frac{1+\gamma}{2}}^2\,\dfrac{s_{\text{piloto}}^2}{E^2}$ |
| Proporción (cota conservadora) | $n\ge z_{\frac{1+\gamma}{2}}^2\,\dfrac{1/4}{E^2}$ |
| Proporción (con estimación previa $\hat p$) | $n\ge z_{\frac{1+\gamma}{2}}^2\,\dfrac{\hat p(1-\hat p)}{E^2}$ |

(según [[video-ic-desvio-desconocido]]: la fila de proporción con $\hat p$ vale también
cuando $\hat p$ viene de una muestra piloto previa.)

## Intervalo de confianza para la varianza (normal, ji-cuadrado)

$$IC_\gamma(\sigma^2)=\left[\frac{(n-1)S_n^2}{\chi^2_{n-1,\frac{1+\gamma}{2}}}\;,\;\frac{(n-1)S_n^2}{\chi^2_{n-1,\frac{1-\gamma}{2}}}\right],\qquad \text{(variables normales)}.$$

Sale de $(n-1)S_n^2/\sigma^2\sim\chi^2_{n-1}$ (ver estimación puntual, arriba) y de
despejar $\sigma^2$ en $\chi^2_{n-1,\frac{1-\gamma}{2}}\le(n-1)S_n^2/\sigma^2\le\chi^2_{n-1,\frac{1+\gamma}{2}}$.
Según [[video-ic-desvio-desconocido]]: nunca reemplazar los cuantiles de $\chi^2_{n-1}$
por los de $t_{n-1}$ en este intervalo (la varianza usa ji-cuadrado, no Student).

## Árbol de decisión (qué fórmula usar)

1. ¿Estimo una **proporción**? $\to$ IC de proporción con $Z$.
2. ¿Estimo una **media**?
   - $\sigma$ **conocido** y (normal ó $n$ grande) $\to$ $Z$.
   - $\sigma$ **desconocido**, normal, $n$ chico $\to$ $t_{n-1}$.
   - $\sigma$ **desconocido**, $n$ muy grande ($>200$) $\to$ $Z$ con $S_n$.

## Páginas relacionadas
- [[inferencia-estadistica]] · [[estimacion-puntual]] · [[intervalos-de-confianza]]
- [[distribucion-t-de-student]] · [[varianza-muestral]]
- [[teorema-central-del-limite]] (justifica las aproximaciones normales)
