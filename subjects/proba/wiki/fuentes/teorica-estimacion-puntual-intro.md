---
titulo: Teórica — Estimación Puntual (Intro)
resumen: 'Teórica manuscrita de la unidad 8 que plantea la inferencia como población, muestra y estimador, y define el error cuadrático medio con su descomposición $\mathrm{mse}=V(\hat\theta)+\mathrm{sesgo}^2$, además de insesgadez y consistencia.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/01 - Estimación Puntual - Intro.pdf"
ingerido: 2026-05-30
---

# Teórica — Estimación Puntual (Intro)

**Qué es:** teórica manuscrita que introduce la estimación como inferencia: de
una población se toma una muestra representativa y se construyen estadísticos y
estimadores del parámetro poblacional.
**Cubre las unidades/temas:** estadístico, estimador, error cuadrático medio,
sesgo, varianza, estimador insesgado y consistente.

## Puntos clave
- Esquema: **población** $\to$ **muestra** $\{X_i\}_{i=1}^n$ (esperamos que sea
  representativa).
- **Estadístico**: $g(X_1,\dots,X_n)$, una función de la muestra; es una v.a.
- **Estimador** del parámetro $\theta$: $\hat\theta = h(X_1,\dots,X_n)$, una v.a.
  que esperamos se aproxime al parámetro poblacional $\theta$.
- **Error cuadrático medio (ECM/MSE):** $\mathrm{mse}(\hat\theta)=E[(\hat\theta-\theta)^2]$.
- Descomposición: $\mathrm{mse}(\hat\theta) = V(\hat\theta) + \mathrm{sesgo}^2(\hat\theta)$,
  con $\mathrm{sesgo}(\hat\theta) = E[\hat\theta]-\theta$.
- **Estimador insesgado:** $\mathrm{sesgo}(\hat\theta)=0 \iff E[\hat\theta]=\theta$.
- **Estimador consistente:** $\lim_{n\to\infty}\mathrm{mse}(\hat\theta)=0$
  (existen definiciones alternativas de consistencia).

## Páginas del wiki que toca
- [[inferencia-estadistica]]
- [[estimacion-puntual]]
