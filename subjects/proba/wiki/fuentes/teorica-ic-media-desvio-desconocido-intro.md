---
titulo: Teórica — IC para la media (desvío desconocido, Intro)
resumen: 'Teórica manuscrita de la unidad 8 que ordena los tres escenarios del intervalo de confianza para la media e introduce, para desvío desconocido con $n$ chico y datos normales, el estadístico $T_{n-1}=(\overline X_n-\mu)/(S_n/\sqrt n)$.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/03 - Intervalos de Confianza - Media con Desvío Desconocido - Intro.pdf"
ingerido: 2026-05-30
---

# Teórica — IC para la media (desvío desconocido, Intro)

**Qué es:** teórica manuscrita que resume los tres escenarios de IC para la
media e introduce el estadístico $T$ con distribución t de Student.
**Cubre las unidades/temas:** los tres casos del IC para la media; aparición de
la t de Student cuando $\sigma$ es desconocido y $n$ no es grande.

## Puntos clave
- **Tres escenarios** del IC para la media (con $\Delta_B=z_{\frac{1+\gamma}{2}}\frac{\sigma}{\sqrt n}$
  bilateral y $\Delta_U=z_\gamma\frac{\sigma}{\sqrt n}$ unilateral):
  1. $X_i\sim\mathcal N(\mu,\sigma)$ i.i.d. con $\sigma$ **conocido**.
  2. $X_i$ i.i.d. (no necesariamente normales) con $\sigma$ conocido y $n$ grande $\to$ TCL.
  3. $\sigma$ **desconocido** y $n$ muy grande $\to$ reemplazar $\sigma$ por el
     desvío muestral $S_n$.
- **¿Y si $n$ no es grande y $\sigma$ desconocido?** El caso general es
  complicado; para v.a. **normales** se usa el estadístico
  $$T_{n-1} = \frac{\overline X_n - \mu}{S_n/\sqrt n} \sim t_{n-1}$$
  (t de Student con $n-1$ grados de libertad). Aquí $\mu\to\overline X_n$ y
  $\sigma\to S_n$.

## Páginas del wiki que toca
- [[intervalos-de-confianza]]
- [[distribucion-t-de-student]]
- [[inferencia-estadistica]]
