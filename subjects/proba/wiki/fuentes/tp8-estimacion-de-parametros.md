---
titulo: TP8 — Estimación de parámetros
resumen: "Guía de ejercicios de la unidad 8 (curso 2024) sobre estimación puntual e intervalos de confianza: máxima verosimilitud, momentos y máximo a posteriori, insesgadez, tamaño muestral, con tablas de la normal y de la t de Student."
tipo: fuente
formato: guia
unidad: 8
archivo_raw: "raw/09-inferencia-estadistica/tp8_2024.pdf"
ingerido: 2026-05-30
---

# TP8 — Estimación de parámetros

**Qué es:** guía de ejercicios (curso 2024) sobre estimación puntual e
intervalos de confianza, con repaso teórico, tablas (normal estándar, fractiles
de la normal y de la t de Student), respuestas y ejercicios resueltos paso a paso.
**Cubre las unidades/temas:** estimación puntual (MV, MAP, momentos), insesgadez
y consistencia, IC para la media (con $\sigma$ conocido y desconocido) y para la
proporción, cálculo del tamaño muestral.

## Puntos clave
- **Repaso teórico** (sección 1): generalidades de estimación, ECM, sesgo,
  estimadores insesgado/consistente/asintóticamente insesgado; MV, momentos, MAP;
  estimación puntual de media, varianza y proporción; estimación de intervalos.
- **Tablas:** función de distribución $\Phi$ de $\mathcal N(0,1)$; fractiles
  $z_\alpha=\Phi^{-1}(\alpha)$; fractiles de la t de Student por grados de libertad.
- **Ejercicios destacados** (con resolución incluida):
  - **Ej. 1:** EMV (máxima verosimilitud) de $\alpha$ para Laplace$(0,\alpha)$,
    Uniforme$(3,\alpha)$ y Uniforme$(\alpha,2)$ — incluye dos máximos por **soporte**.
  - **Ej. 2:** repetición del ej. 1 con el **método de los momentos**.
  - **Ej. 5:** MAP con prior Beta$(\alpha,\beta)$ para una Bernoulli$(P)$.
  - **Ej. 6:** estimador insesgado de **mínima varianza** de $\mu$ por
    combinación lineal $Y=a\overline X_1+b\overline X_2$ ($b=1-a$, $a=1/3$ si
    $n_2=2n_1$, $a=1/2$ si $n_1=n_2$).
  - **Ej. 9 (resuelto):** IC 90% para la media, $\sigma$ conocido; cálculo de
    tamaño muestral por error de muestreo. Resultado $246\pm 7.8$; $b)$ 15 envases más.
  - **Ej. 13 (resuelto):** IC 95% para la media con datos agrupados ($n=150$),
    usando $z$ por TCL. Resultado $(0.716, 0.763)$.
  - **Ej. 14 (resuelto):** IC 95% para la media de 7 datos normales con $\sigma$
    desconocido $\to$ t de Student. Resultado $(9.74, 10.26)$.
  - **Ej. 20 (resuelto):** IC 90% para el porcentaje de defectuosos ($n=300$, 18
    defectuosas, $\hat p=0.06$); tamaño muestral y porcentaje máximo unilateral.
    Resultado $0.060\pm 0.023$; $b)$ $n=1226$; $c)$ $7.76\%$. (Antes citado como
    Ej. 21; en la guía el Ej. 21 es el de los 100 votantes.)
  - **Ej. 22 (resuelto):** IC 90% para el rating (proporción), $n=600$.
    Resultado $(0.22,0.28)$; inversión adicional $\approx 4473\,C$.
  - **Ej. 24:** corrección por **población finita** de la semiamplitud del IC de
    una proporción y deducción de $n=1/(B^2+1/N)$.

## Páginas del wiki que toca
- [[inferencia-estadistica]]
- [[estimacion-puntual]]
- [[intervalos-de-confianza]]
- [[distribucion-t-de-student]]
- [[varianza-muestral]]
