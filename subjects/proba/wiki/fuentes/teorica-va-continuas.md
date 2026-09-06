---
titulo: Teórica — Variables Aleatorias Continuas (01 - V.A.C.)
resumen: 'Apunte manuscrito de la unidad 4 que introduce las variables aleatorias continuas: la FDA continua implica $P(X=\alpha)=0$, la densidad es la derivada $f_X=dF_X/dx$ y la esperanza y la varianza pasan a calcularse por integral.'
tipo: fuente
formato: slides
unidad: 4
archivo_raw: "raw/05-va-continuas/01 - V.A.C.pdf"
ingerido: 2026-05-30
---

# Teórica — Variables Aleatorias Continuas (01 - V.A.C.)

**Qué es:** apunte manuscrito de la teórica que introduce las variables
aleatorias continuas (v.a.c.) a partir de la función de distribución acumulada
(FDA), la densidad de probabilidad y los valores esperados como integrales.

**Cubre las unidades/temas:** unidad 4 (V.A. Continuas) — repaso de FDA,
definición de v.a.c., densidad $f_X$, esperanza y varianza por integral.

## Puntos clave
- **FDA** $F_X:\mathbb{R}\to[0,1]$, $F_X(\alpha)=P(X\le\alpha)$. Propiedades:
  (1) no decreciente, (2) $\lim_{\alpha\to-\infty}F_X=0$,
  (3) $\lim_{\alpha\to+\infty}F_X=1$, (4) $P(\alpha<X\le\beta)=F_X(\beta)-F_X(\alpha)$.
- **V.a.d.** (discreta): FDA en forma de "escalera" con discontinuidades en los
  puntos del recorrido.
- **V.a.c.** (continua): $X$ es v.a.c. $\iff$ $F_X$ es **continua**
  $\iff$ $P(X=\alpha)=0\ \forall\alpha\in\mathbb{R}$. (Esto último NO pasa con una v.a.d.)
- Ejemplo de altura: $P(X=173\text{ cm})=0$.
- **Discretización** de una v.a.c.: aproximar $E[X]$ con datos agrupados,
  $P_i=F_X(x_i+\delta)-F_X(x_i-\delta)$, y al tomar $\delta\to 0$ la suma converge
  a la integral $\int x\,\frac{dF_X}{dx}\,dx$.
- **Densidad de probabilidad (pdf):** $f_X(x)=\dfrac{dF_X(x)}{dx}$ donde $F_X$ es
  derivable. Propiedades: $\int_{\mathbb{R}}f_X=1$ y $f_X(x)\ge0$.
  Interpretación: $f_X(\alpha)\,\Delta x\approx P\!\big(X\in(x-\tfrac{\Delta x}{2},x+\tfrac{\Delta x}{2}]\big)$.
- **Esperanza y varianza por integral:**
  $\mu_X=E[X]=\int_{-\infty}^{+\infty}x\,f_X(x)\,dx$,
  $E[X^2]=\int_{-\infty}^{+\infty}x^2 f_X(x)\,dx$,
  $\sigma_X^2=\operatorname{Var}(X)=E[X^2]-(E[X])^2$.
- Ejemplo trabajado: $F_X(x)=x^2$ en $(0,1)$ da $f_X(x)=2x$, $E[X]=2/3$, $\sigma_X^2=1/18$.

## Páginas del wiki que toca
- [[variable-aleatoria-continua|Variable aleatoria continua]]
- [[funcion-de-densidad|Función de densidad]]
- [[funcion-de-distribucion-acumulada|FDA]] (forward-link, unidad V.A. Discretas)
- [[esperanza]], [[varianza]] (forward-links, versiones integrales)
- [[distribucion-uniforme-continua|Distribución Uniforme continua]]
