---
titulo: TP9 — Pruebas de hipótesis (guía 2024)
resumen: "Guía de ejercicios de la unidad 9 (curso 2024) sobre pruebas de hipótesis para la media y la proporción: errores de tipo I y II, nivel de significación, valor p y los estadísticos $Z$ y $T$, con tablas de fractiles."
tipo: fuente
formato: guia
unidad: 9
archivo_raw: "raw/10-pruebas-de-hipotesis/tp9_2024.pdf"
ingerido: 2026-05-30
---

# TP9 — Pruebas de hipótesis (guía 2024)

**Qué es:** Guía de ejercicios de la cátedra para la unidad de pruebas de
hipótesis, con un repaso teórico inicial, tablas (normal estándar, fractiles
$z$ y $t$ de Student) y ejercicios resueltos.

**Cubre las unidades/temas:** unidad 9 — Pruebas de hipótesis para la media
(varianza conocida con $Z$, varianza desconocida con $T$) y para la proporción.

## Puntos clave

- **Repaso de conceptos** (sección 1): define *población*, *muestra*, *hipótesis
  estadística*, *hipótesis nula* $H_0$, *hipótesis alternativa* $H_1$,
  *estadístico de prueba* $\Lambda$, *región crítica* $R$, *error tipo I y II*,
  *nivel de significación* $\alpha$, *potencia* $1-\beta$ y *valor p*.
- Tabla de errores:

  | | $H_0$ verdadera | $H_0$ falsa |
  |---|---|---|
  | Se acepta $H_0$ | OK | Error Tipo II |
  | Se rechaza $H_0$ | Error Tipo I | OK |

- **Prueba para la media** (tres tipos: dos colas, cola derecha, cola izquierda):
  - Varianza $\sigma^2$ **conocida** (o $n$ grande): estadístico $Z = \dfrac{\bar X - \mu_0}{\sigma/\sqrt n}$.
  - Si $n$ grande y $\sigma^2$ desconocida: $Z = \dfrac{\bar X - \mu_0}{S/\sqrt n}$ (sigue valiendo por TCL).
  - Varianza $\sigma^2$ **desconocida** (muestra normal, $n$ chico): estadístico $T = \dfrac{\bar X - \mu_0}{S/\sqrt n} \sim t_{n-1}$.
- **Prueba para la proporción**: $X \sim \text{Binomial}(n,q)$; si $n$ grande
  ($>100$) por TCL $\hat q = X/n$ es aproximadamente normal y
  $Z = \dfrac{\hat q - q_0}{\sqrt{q_0(1-q_0)/n}}$.
- Tablas de la **función de distribución normal estándar** $\Phi$, **fractiles de
  la normal estándar** $z_\alpha$ y **fractiles de la $t$ de Student** $t_{n,\alpha}$.
- Incluye una simulación en Octave para fijar conceptos de error tipo I.

## Ejercicios resueltos (sección 7)

- **Ejercicio 8** (resuelto en el raw): prueba para la media de **dos colas** con
  $\sigma$ desconocida → estadístico $T$ (alambre de Al, $n=35$). Volcado en
  [[prueba-de-hipotesis-para-la-media]].
- **Ejercicio 16** (resuelto paso a paso en el raw): **diseño** de una prueba para
  la **proporción** de cola derecha; se fijan $\alpha=0.1$ y $\beta(0.06)\le 0.2$
  para determinar $n=90$ y $c=4$, con curva OC. Volcado en
  [[diseno-de-prueba-tamano-muestral]].
- **Ejercicio 10** (resuelto en el apunte de teórica): prueba para la media de
  cola derecha con $\sigma$ desconocida (lámparas) → estadístico $T$, ver
  [[apunte-media-desvio-desconocido|apunte de desvío desconocido]].

## Otros ejercicios volcados al wiki (de la sección 5)

- **Ejercicio 1** (tubos de hormigón): prueba para la media, **$\sigma$ conocida**
  ($Z$), cola izquierda, $n=16$ → no se rechaza. En [[prueba-de-hipotesis-para-la-media]].
- **Ejercicio 12** (Corvette, de Paulos): prueba para la proporción de cola
  izquierda, valor p $\approx 10^{-10}$. En [[prueba-de-hipotesis]].
- **Ejercicio 13** (caja de 12 piezas): $\beta(k)=(12-k)/12$, ejemplo discreto sin
  aproximación normal. En [[error-tipo-i-y-tipo-ii]].
- **Ejercicio 15** (semáforos en rojo): prueba para la proporción de cola
  izquierda, se rechaza. En [[reconocer-prueba-de-hipotesis]].
- **Ejercicio 20** (proceso químico): prueba de la media ($T$) **+** IC del $90\%$
  para la varianza (ji-cuadrado). En [[prueba-de-hipotesis-para-la-media]].
- **Apéndice** (simulación en Octave): frecuencia empírica del error tipo I
  $\approx 0.05$. Reseñado en [[error-tipo-i-y-tipo-ii]].

## Páginas del wiki que toca

- [[prueba-de-hipotesis]]
- [[prueba-de-hipotesis-para-la-media]]
- [[prueba-de-hipotesis-para-la-proporcion]]
- [[error-tipo-i-y-tipo-ii]]
- [[valor-p]]
- [[diseno-de-prueba-tamano-muestral]]
- [[reconocer-prueba-de-hipotesis]]
- [[distribucion-t-de-student]]
- [[distribucion-ji-cuadrado]]
