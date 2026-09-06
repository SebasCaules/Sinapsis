---
titulo: Teórica — Variable Aleatoria Normal (06 - V.A.C.)
resumen: 'Apunte manuscrito de la unidad 4 sobre la normal: densidad simétrica respecto de $\mu$, regla empírica de uno, dos y tres desvíos, normal estándar y estandarización $F_X(x)=\Phi((x-\mu)/\sigma)$ con manejo de tabla y fractiles.'
tipo: fuente
formato: slides
unidad: 4
archivo_raw: "raw/05-va-continuas/06 - V.A.C. - Variable Aleatoria Normal.pdf"
ingerido: 2026-05-30
---

# Teórica — Variable Aleatoria Normal (06 - V.A.C.)

**Qué es:** apunte manuscrito de la teórica sobre la distribución normal o
Gaussiana $X\sim N(\mu,\sigma)$, la normal estándar $Z\sim N(0,1)$, la
estandarización y el uso de la tabla de $\Phi$. Incluye un repaso final de v.a.c.

**Cubre las unidades/temas:** unidad 4 — distribución normal, normal estándar,
estandarización, tabla, fractiles. También repaso de FDA/densidad de v.a.c.

## Puntos clave
- $X\sim N(\mu,\sigma)$ — "la más importante". Parámetros: $\mu=E[X]$,
  $\sigma^2=\operatorname{Var}(X)$. Coeficiente de asimetría $\gamma=0$, curtosis $\kappa=0$ (mesocúrtica).
- **Densidad:** $f_X(x)=\frac{1}{\sqrt{2\pi}\,\sigma}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}$,
  simétrica respecto de $\mu$; mediana $=\mu=$ moda $=$ media; cambia la concavidad en $\mu\pm\sigma$.
- **Regla empírica:** $P(\mu-\sigma<X<\mu+\sigma)\approx0.6827$,
  $P(\mu-2\sigma<X<\mu+2\sigma)\approx0.9545$,
  $P(\mu-3\sigma<X<\mu+3\sigma)\approx0.9973$.
- **Normal estándar** $Z\sim N(0,1)$: $f_Z(z)=\frac{1}{\sqrt{2\pi}}e^{-z^2/2}$.
  $\Phi(z)\overset{\text{def}}{=}F_Z(z)=P(Z\le z)$. No tiene forma cerrada (no tiene
  primitiva), se tabula. $\Phi(0)=0.5$, $\Phi(z)=1-\Phi(-z)$.
- **Estandarización:** $F_X(x)=\Phi\!\left(\frac{x-\mu}{\sigma}\right)$ — basta una
  sola tabla de $\Phi$ para cualquier $\mu,\sigma$.
- **Fractiles:** $z_\alpha=\Phi^{-1}(\alpha)$; $z_{1-\alpha}=-z_\alpha$.
- **Interpolación lineal** en la tabla cuando el valor de $z$ cae entre dos filas.
- Ejercicio trabajado (16 de la guía): consumo de combustible $X\sim N(18,1.5)$.

## Páginas del wiki que toca
- [[distribucion-normal|Distribución Normal]]
- [[estandarizacion-y-tabla-normal|Estandarización y uso de la tabla Z]]
- [[variable-aleatoria-continua|Variable aleatoria continua]]
- [[asimetria-y-curtosis|Asimetría y curtosis]]
