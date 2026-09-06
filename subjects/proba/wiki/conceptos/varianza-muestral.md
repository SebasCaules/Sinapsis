---
titulo: Varianza Muestral
resumen: 'Estimador insesgado de la varianza poblacional, $S_n^2=\frac{1}{n-1}\sum_i (X_i-\bar X_n)^2$: el denominador $n-1$ es la corrección de Bessel. Su raíz reemplaza al desvío poblacional en los intervalos de confianza de la media con desvío desconocido.'
tipo: concepto
unidad: 8
orden: 3
tags: [inferencia, estimacion, dispersion]
fuentes: ["[[teorica-estimacion-puntual-conocidos]]", "[[tp8-estimacion-de-parametros]]", "[[video-poblacion-y-muestra]]"]
actualizado: 2026-09-04
---

# Varianza Muestral

**En breve.** El estimador insesgado de la varianza poblacional $\sigma^2$; usa
denominador $n-1$ (corrección de Bessel) y es el $S_n$ que reemplaza a $\sigma$
en los [[intervalos-de-confianza|IC]] de la media con desvío desconocido.

**Qué es:** el estimador puntual de la varianza poblacional $\sigma^2=V(X)$ a
partir de una muestra i.i.d. $\{X_i\}_{i=1}^n$. Es el correlato inferencial de la
[[medidas-de-dispersion|varianza descriptiva]], pero con denominador $n-1$ para
que sea insesgado.

$$\boxed{\;S_n^2 = \frac{1}{n-1}\sum_{i=1}^n (X_i-\overline X_n)^2\;}$$

El **desvío muestral** es $S_n=\sqrt{S_n^2}$. Aparece como estimador de $\sigma$
en los [[intervalos-de-confianza]] de la media con desvío desconocido (caso de la
[[distribucion-t-de-student]]).

## Propiedades

Según [[teorica-estimacion-puntual-conocidos]] (con $X_i$ i.i.d., $\mu=E[X_i]$,
$\sigma^2=V(X_i)$):
- **Insesgado:** $E[S_n^2]=\sigma^2$. El $n-1$ (no $n$) en el denominador es
  exactamente lo que cancela el sesgo.
- **Consistente** bajo ciertas condiciones (varianza/curtosis finita).
- Si $X_i\sim\mathcal N(\mu,\sigma)$ i.i.d., entonces
  $\dfrac{(n-1)S_n^2}{\sigma^2}\sim\chi^2_{n-1}$ ([[distribucion-ji-cuadrado|ji-cuadrado]]
  con $n-1$ grados de libertad).

> **¿Por qué $n-1$ y no $n$?** Dividir por $n$ subestima la varianza, porque los
> desvíos se miden respecto de $\overline X_n$ (que ya "se ajusta" a los datos) en
> lugar del verdadero $\mu$. El $n-1$ es la corrección de Bessel: hay $n-1$ grados
> de libertad porque uno se consume al estimar la media.

> [!figura] u8-por-que-n-menos-1
> La parábola $Q(c)=\sum_i (x_i-c)^2$ alcanza su mínimo en $c=\overline X_n$ y nunca en $c=\mu$: la brecha $n(\overline X_n-\mu)^2$ entre ambos valores es justo lo que se pierde al centrar en la media muestral. Acumule muestras y compare los promedios de $Q/n$ y de $Q/(n-1)$ contra $\sigma^2$.

> **Intuición (el grado de libertad que se gasta).** Con un solo dato ($n=1$) no
> hay forma de medir dispersión: $\overline X_1=X_1$ y el único desvío es
> exactamente $0$. La fórmula lo refleja —el denominador $n-1$ vale $0$— y avisa
> que hace falta al menos otro punto para "comparar". En general, fijada la media
> muestral, conocer $n-1$ desvíos determina el último (suman $0$): solo $n-1$ son
> libres. Por eso aparece el $n-1$ tanto aquí como en los grados de libertad de la
> [[distribucion-ji-cuadrado|ji-cuadrado]] y de la [[distribucion-t-de-student|t]].

> **El estimador que divide por $n$ (sin el $-1$).** Según el video
> [[video-poblacion-y-muestra]] [28:32]–[29:56], si en vez de $S_n^2$ se usa
> $\tilde S_n^2 = \frac1n\sum(X_i-\overline X_n)^2 = \frac{n-1}{n}S_n^2$, entonces
> $E[\tilde S_n^2] = \frac{n-1}{n}\sigma^2$: subestima $\sigma^2$ (sesgo
> negativo), pero el sesgo tiende a $0$ cuando $n\to\infty$ — es
> **asintóticamente insesgado**. Con $n$ grande, ambas versiones dan resultados
> casi idénticos; por eso conviene revisar qué denominador usa cada software
> antes de comparar salidas.

## Identidad de cálculo

Muy útil para resolver ejercicios a mano:

$$(n-1)\,S_n^2 = \sum_{i=1}^n X_i^2 - n\,\overline X_n^2
\quad\Longleftrightarrow\quad
S_n^2 = \frac{1}{n-1}\left[\sum_{i=1}^n X_i^2 - n\,\overline X_n^2\right].$$

## Ejercicio resuelto — Demostración de insesgadez

**Enunciado** ([[teorica-estimacion-puntual-conocidos]]): probar que
$E[S_n^2]=\sigma^2$. Para simplificar, asumir $\mu=0$ (sin pérdida de generalidad,
ya que $S_n^2$ no cambia si se traslada toda la muestra).

**Planteo.** Con $\mu=0$: $E[\overline X_n]=0$ y
$V(\overline X_n)=E[\overline X_n^2]=\sigma^2/n$. Partimos de la identidad de
cálculo.

**Cálculo.**
$$(n-1)S_n^2 = \sum_{i=1}^n X_i^2 - n\,\overline X_n^2.$$
Tomando esperanza y usando $E[X_i^2]=V(X_i)=\sigma^2$ (pues $\mu=0$) y
$E[\overline X_n^2]=\sigma^2/n$:
$$E\!\left[(n-1)S_n^2\right] = \sum_{i=1}^n E[X_i^2] - n\,E[\overline X_n^2]
= n\sigma^2 - n\cdot\frac{\sigma^2}{n} = n\sigma^2 - \sigma^2 = (n-1)\sigma^2.$$

**Resultado.** Dividiendo por $n-1$: $\boxed{E[S_n^2]=\sigma^2}$, es decir,
$S_n^2$ es un **estimador insesgado** de la varianza poblacional.

## Páginas relacionadas
- [[estimacion-puntual]] — la varianza muestral como estimador.
- [[distribucion-t-de-student]] — usa $S_n$ para el IC de la media.
- [[distribucion-ji-cuadrado]] — distribución de $(n-1)S_n^2/\sigma^2$.
- [[medidas-de-dispersion]] — la versión descriptiva (denominador $n$).
- [[prueba-de-hipotesis-para-la-media]] — su ej. 20 usa
  $(n-1)S^2/\sigma^2\sim\chi^2$ para un IC de la varianza combinado con la prueba
  de la media.
