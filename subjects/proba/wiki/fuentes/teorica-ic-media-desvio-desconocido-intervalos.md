---
titulo: Teórica — IC para la media (desvío desconocido, Intervalos)
resumen: 'Teórica manuscrita de la unidad 8 que deriva el intervalo de confianza para la media con desvío desconocido usando la t de Student, $\Delta_B=t_{n-1,(1+\gamma)/2}\,S_n/\sqrt n$, con el ejemplo numérico de los diez paquetes de azúcar.'
tipo: fuente
formato: pdf
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/05 - Intervalos de Confianza - Media con Desvío Desconocido - Intervalos.pdf"
ingerido: 2026-05-30
---

# Teórica — IC para la media (desvío desconocido, Intervalos)

**Qué es:** teórica manuscrita que deriva el IC para la media de una normal con
$\sigma$ desconocido usando la t de Student, con un ejemplo numérico completo.
**Cubre las unidades/temas:** derivación del IC con t de Student, relación con la
aproximación normal para $n$ grande, ejemplo paso a paso.

## Puntos clave
- Partiendo de $T=\frac{\overline X_n-\mu}{S_n/\sqrt n}\sim t_{n-1}$ y pidiendo
  $P(|\overline X_n-\mu|\le\Delta_B)=\gamma$, se llega a
  $$\Delta_B = t_{n-1,\frac{1+\gamma}{2}}\cdot\frac{S_n}{\sqrt n}.$$
- Para $n$ grande ($>100/200$), $t_{n-1,\frac{1+\gamma}{2}}\approx z_{\frac{1+\gamma}{2}}$,
  recuperando el IC con la normal (reemplazando $\sigma$ por $S_n$).
- **IC bilateral:** $\left(\overline X_n \pm t_{n-1,\frac{1+\gamma}{2}}\frac{S_n}{\sqrt n}\right)$;
  **unilaterales** con $t_{n-1,\gamma}$.
- **Ejemplo (azúcar MuyDulce):** 10 paquetes, pesos en gramos. Se asume normal y
  bilateral, $\sigma$ desconocido. Con $\overline X_{10}=986.6$, $S_{10}=5.1467$,
  $\gamma=0.9$ ($t_{9,0.95}=1.8331$), $\Delta_B=2.9834\approx 3$, da IC
  $(983.6, 989.6)$. Usa la identidad $S_n^2=\frac{1}{n-1}[\sum X_i^2 - n\overline X_n^2]$.

## Páginas del wiki que toca
- [[intervalos-de-confianza]]
- [[distribucion-t-de-student]]
- [[varianza-muestral]]
- [[inferencia-estadistica]]
