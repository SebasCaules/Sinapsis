---
titulo: Teórica — IC para la media (desvío conocido)
resumen: 'Teórica manuscrita de la unidad 8 que deriva el intervalo de confianza para la media con desvío conocido, de semiamplitud $\Delta=z_{(1+\gamma)/2}\,\sigma/\sqrt n$, con sus versiones unilaterales y el uso del TCL si la población no es normal.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/01 - Intervalos de Confianza - Media con Desvío Conocido.pdf"
ingerido: 2026-05-30
---

# Teórica — IC para la media (desvío conocido)

**Qué es:** teórica manuscrita que deriva el intervalo de confianza (IC) para
la media de una normal con $\sigma$ conocido.
**Cubre las unidades/temas:** nivel de confianza, semiamplitud, IC bilateral y
unilaterales, uso del TCL para v.a. no normales.

## Puntos clave
- Planteo: $X_i\sim\mathcal N(\mu,\sigma)$ i.i.d. con $\sigma$ **conocido**;
  $\overline X_n\sim\mathcal N(\mu,\sigma/\sqrt n)$.
- **Nivel de confianza** $\gamma$ (cercano a 1): se pide
  $P(\mu\in(\overline X_n-\Delta,\overline X_n+\Delta))\ge\gamma$.
- Estandarizando: $P(\dots) = 2\Phi(\Delta/(\sigma/\sqrt n))-1\ge\gamma$, de donde
  $$\Delta = z_{\frac{1+\gamma}{2}}\cdot\frac{\sigma}{\sqrt n}.$$
- **IC bilateral:** $\left(\overline X_n - z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n},\ \overline X_n + z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n}\right)$.
- **IC unilaterales:** $\left(\overline X_n - z_\gamma\frac{\sigma}{\sqrt n},\ \infty\right)$ y $\left(-\infty,\ \overline X_n + z_\gamma\frac{\sigma}{\sqrt n}\right)$.
- **V.a. no normales:** para $n$ grande ($n>100$) el TCL permite usar las mismas
  fórmulas. Si $n$ es chico, depende de la distribución de los $X_i$.

## Páginas del wiki que toca
- [[intervalos-de-confianza]]
- [[inferencia-estadistica]]
- [[teorema-central-del-limite]]
