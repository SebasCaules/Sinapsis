---
titulo: Estandarización y uso de la tabla normal (Z)
resumen: 'Receta para resolver cualquier normal con una sola tabla: estandarizar con $z=\frac{x-\mu}{\sigma}$, leer $\Phi(z)$ o el fractil $z_\alpha$ en el problema inverso, y aprovechar la simetría $\Phi(-z)=1-\Phi(z)$ para los valores negativos.'
tipo: tecnica
unidad: 4
orden: 9
tags: [continua, normal, tabla, fractil, tecnica]
fuentes: ["[[teorica-va-normal]]", "[[tp4-variables-aleatorias-continuas]]", "[[video-normales]]"]
actualizado: 2026-09-04
---

# Estandarización y uso de la tabla normal (Z)

**En breve.** Receta para resolver cualquier [[distribucion-normal|normal]] $N(\mu,\sigma)$ con una sola tabla: estandarizar $Z=\frac{X-\mu}{\sigma}$, buscar $\Phi$ (probabilidad → valor) o el fractil $z_\alpha$ (valor → probabilidad), y usar la simetría $\Phi(-z)=1-\Phi(z)$ para los negativos.

Técnica para calcular probabilidades y fractiles de una
[[distribucion-normal|normal]] $X\sim N(\mu,\sigma)$ usando una única tabla de la
**normal estándar** $Z\sim N(0,1)$ ([[teorica-va-normal]], [[tp4-variables-aleatorias-continuas]]).

## Normal estándar

$Z\sim N(0,1)$ tiene media $0$ y desvío $1$, densidad
$f_Z(z)=\frac{1}{\sqrt{2\pi}}e^{-z^2/2}$ y FDA
$$ \Phi(z)\overset{\text{def}}{=}F_Z(z)=P(Z\le z)=\int_{-\infty}^{z}\frac{1}{\sqrt{2\pi}}e^{-y^2/2}\,dy. $$
No tiene forma cerrada → se **tabula**. Valores guía: $\Phi(0)=0.5$,
$\lim_{z\to+\infty}\Phi(z)=1$, $\lim_{z\to-\infty}\Phi(z)=0$.

## Paso 1 — estandarizar

$$ Z=\frac{X-\mu}{\sigma}\sim N(0,1),\qquad F_X(x)=P(X\le x)=\Phi\!\left(\frac{x-\mu}{\sigma}\right). $$
La igualdad de probabilidades al estandarizar vale porque se aplica una función
**creciente y biyectiva** a ambos lados de la desigualdad ([[tp4-variables-aleatorias-continuas]] ej. 21).

**Intuición (qué es el $z$).** El valor estandarizado $z=\frac{x-\mu}{\sigma}$ responde "¿a cuántos **desvíos** del centro está $x$?". Un $z=2$ significa "dos desvíos por encima de la media", sin importar las unidades originales (litros, notas, mm). Como todas las normales tienen la misma forma una vez medidas en desvíos, esa pregunta tiene la misma respuesta de probabilidad para cualquier $\mu,\sigma$ — y por eso una sola tabla de $\Phi$ alcanza.

## Paso 2 — simetría (tablas solo con $z\ge0$)

La densidad es simétrica, así que:
$$ \boxed{\ \Phi(z)=1-\Phi(-z)\ }\qquad\Longrightarrow\qquad \Phi(-z)=1-\Phi(z). $$
Esto permite calcular probabilidades con $z$ negativo usando una tabla que solo
tiene valores positivos.

> [!figura] u4-simetria-phi-dos-colas
> Las dos colas de la normal estándar, sombreadas por separado y con su área. Se ve que $\Phi(-z)$ y $1-\Phi(z)$ miden lo mismo, y que la región central vale $2\Phi(z)-1$.

Probabilidades útiles:
- $P(X>x)=1-\Phi\!\left(\frac{x-\mu}{\sigma}\right)$.
- $P(a<X\le b)=\Phi\!\left(\frac{b-\mu}{\sigma}\right)-\Phi\!\left(\frac{a-\mu}{\sigma}\right)$.
- Intervalo simétrico centrado: $P(\mu-k\sigma<X<\mu+k\sigma)=2\Phi(k)-1$.

## Paso 3 — fractiles (problema inverso)

Cuando dan la probabilidad y piden el valor:
$$ z_\alpha=\Phi^{-1}(\alpha),\qquad x_\alpha=\mu+\sigma\,z_\alpha. $$
Por simetría del fractil:
$$ \boxed{\ z_{1-\alpha}=-z_\alpha\ }\qquad\Longleftrightarrow\qquad \Phi^{-1}(\alpha)=-\Phi^{-1}(1-\alpha). $$

> [!figura] u4-fractil-inverso-densidad-y-sigmoide
> El mismo $\alpha$ leído en las dos direcciones: como área a la izquierda de $z_\alpha$ en la densidad, y como entrada por el eje vertical de la sigmoide $\Phi$ hasta bajar al eje $z$. El punto espejo muestra que $z_{1-\alpha}=-z_\alpha$.

Se usa la **tabla de fractiles** $\Phi^{-1}(\alpha)$ de [[tp4-variables-aleatorias-continuas]]
(Sec. 3). Fractiles habituales: $z_{0.90}\approx1.2816$, $z_{0.95}\approx1.6449$,
$z_{0.975}\approx1.96$, $z_{0.99}\approx2.3263$.

> ⚠️ Advertencia del docente ([[video-normales]] [38:16]): la relación
> $z_{1-\alpha}=-z_\alpha$ se usa mal con frecuencia cuando se aplica "de memoria"
> sin dibujar antes la campana y marcar las áreas correspondientes a cada cola.
> Recomendación explícita: siempre hacer el dibujo antes de despejar un cuantil.

## Interpolación lineal

Si el $z$ buscado cae **entre dos filas** de la tabla, se interpola linealmente.
Para $\Phi(z)$ con $z\in(z_1,z_2)$:
$$ \Phi(z)\approx \Phi(z_1)+\frac{\Phi(z_2)-\Phi(z_1)}{z_2-z_1}\,(z-z_1). $$

> [!figura] u4-interpolar-vs-redondear-tabla-z
> Ampliación de $\Phi$ entre las filas $z=0.66$ y $z=0.67$. En un tramo de $0.01$ la curva y la cuerda casi se calcan: por eso interpolar acierta cinco decimales y redondear a la fila más cercana, solo dos.

> Ejemplo ([[teorica-va-normal]]): $\Phi(0.6\overline{6})$ con $\Phi(0.66)=0.7454$ y
> $\Phi(0.67)=0.7486$ da $\approx0.7475$.

> **Interpolar vs. redondear — comparación de precisión ([[video-normales]] [29:31]):**
> Para $\Phi(0.668)$, el valor real (software) es $0.7479332$. La
> interpolación lineal da $\approx0.7479315$ (coincide en los primeros **cinco**
> decimales), mientras que redondear al valor de tabla más cercano
> ($\Phi(0.67)=0.7486$) solo coincide en los primeros **dos**. Interpolar es
> sensiblemente más preciso que redondear.

## Mini-receta

1. Identificar $\mu$ y $\sigma$ (cuidado: la cátedra da el **desvío**, no la varianza).
2. ¿Piden probabilidad o valor? Probabilidad → estandarizar y buscar $\Phi$.
   Valor → buscar fractil $z_\alpha$ y despejar $x_\alpha=\mu+\sigma z_\alpha$.
3. Usar $\Phi(-z)=1-\Phi(z)$ y $z_{1-\alpha}=-z_\alpha$ para los negativos.
4. Interpolar si hace falta.

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 27 ítem 4 (resuelto en la guía).

**Enunciado.** Notas $X\sim N(78,6)$. La nota reprobatoria $x_R$ deja por debajo
al $25\%$ inferior. Calcular aproximadamente la proporción de estudiantes con
nota que supera **en al menos 5 puntos** a $x_R$.

**Planteo.** Primero $x_R$ con $P(X\le x_R)=0.25$, luego $P(X\ge x_R+5)$.

**Cálculo.**
$$ \Phi\!\left(\frac{x_R-78}{6}\right)=0.25 \Rightarrow \frac{x_R-78}{6}=z_{0.25}=-z_{0.75}\approx-0.6745 $$
$$ \Rightarrow x_R\approx78-6\cdot0.6745\approx73.95. $$
Entonces
$$ P(X\ge x_R+5)=P(X\ge78.95)=1-\Phi\!\left(\frac{78.95-78}{6}\right) $$
$$ \approx1-\Phi(0.16)\approx1-0.5631=0.4369. $$

**Resultado.** $\approx44\%$ de los estudiantes superan en al menos 5 puntos a la
nota reprobatoria del $25\%$.

### Ejercicio resuelto — cuartiles de la normal, outliers de Tukey y $E[|Z|]$
**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 15 ítems e, f, g (resuelto en la guía).

**Enunciado.** Sea $X\sim N(\mu,\sigma)$ y $Z\sim N(0,1)$ estándar.
e) Hallar los cuartiles $Q_1$, $Q_3$ y el rango intercuartílico $I_Q=|Q_3-Q_1|$, que
cumplen $F(Q_1)=0.25$, $F(Q_3)=0.75$. f) Según la convención de **Tukey** para el
[[boxplot|boxplot]] (U1), son **valores extremos (outliers)** los que caen por debajo de
$Q_1-1.5\,I_Q$ o por encima de $Q_3+1.5\,I_Q$; calcular $P(\text{outlier})$. g) Calcular $E[|Z|]$.

**Planteo y cálculo e).** $Q_1=\mu+\sigma z_{0.25}$ y $Q_3=\mu+\sigma z_{0.75}$. Por simetría
$z_{0.75}=-z_{0.25}\approx0.6745$, así que
$$ Q_1=\mu-0.6745\,\sigma,\qquad Q_3=\mu+0.6745\,\sigma,\qquad I_Q=Q_3-Q_1=1.349\,\sigma. $$

**Cálculo f).** Las cercas de Tukey, en unidades estandarizadas ($\mu=0,\sigma=1$), están en
$$ Q_3+1.5\,I_Q=0.6745+1.5\cdot1.349=2.698,\qquad Q_1-1.5\,I_Q=-2.698. $$
Como la normal es simétrica,
$$ P(\text{outlier})=2\,\Phi(-2.698)=2\,(1-\Phi(2.698))\approx2\cdot0.00349\approx0.007. $$

**Cálculo g).** Por simetría de $Z$ y con $\int z\,e^{-z^2/2}dz=-e^{-z^2/2}$,
$$ E[|Z|]=2\int_0^\infty z\,\frac{1}{\sqrt{2\pi}}e^{-z^2/2}\,dz=\frac{2}{\sqrt{2\pi}}\big[-e^{-z^2/2}\big]_0^\infty=\frac{2}{\sqrt{2\pi}}=\sqrt{\frac{2}{\pi}}\approx0.798. $$

**Resultado.** e) $I_Q=1.349\,\sigma$. f) $P(\text{outlier})\approx0.7\%$: en una normal,
solo cerca de **7 de cada 1000** observaciones serían marcadas como atípicas por la regla del
boxplot. g) $E[|Z|]=\sqrt{2/\pi}\approx0.798$ (la **semi-normal**, valor medio del desvío absoluto).
