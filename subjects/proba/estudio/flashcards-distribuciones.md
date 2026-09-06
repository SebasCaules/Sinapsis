---
tipo: flashcards
titulo: 'Distribuciones · E[X] y V(X)'
id: distribuciones
descripcion: 'Esperanza y varianza de cada distribución del programa, con lo que modela.'
---

<!-- Generado desde estudio/study-data.js con el conversor del Sprint 2. -->

## Bernoulli: $E[X]$ y $V(X)$

> pagina: distribucion-bernoulli
> tags: discreta

$$E[X]=p$$
$$V(X)=p\,q$$

Un único ensayo con dos resultados: éxito (1) o fracaso (0).

## Binomial: $E[X]$ y $V(X)$

> pagina: distribucion-binomial
> tags: discreta

$$E[X]=n\,p$$
$$V(X)=n\,p\,q$$

Número de éxitos en n ensayos de Bernoulli independientes.

## Geométrica: $E[X]$ y $V(X)$

> pagina: distribucion-geometrica
> tags: discreta

$$E[X]=\dfrac{q}{p}$$
$$V(X)=\dfrac{q}{p^{2}}$$

Número de FRACASOS antes del primer éxito (convención de la cátedra).

La cátedra cuenta FRACASOS (soporte $\mathbb{N}_0$, $E=q/p$), no ensayos.

## Binomial negativa: $E[X]$ y $V(X)$

> pagina: distribucion-binomial-negativa
> tags: discreta

$$E[X]=\dfrac{r\,q}{p}$$
$$V(X)=\dfrac{r\,q}{p^{2}}$$

Número de FRACASOS antes del r-ésimo éxito (Pascal).

Suma de $r$ geométricas independientes; cuenta fracasos.

## Hipergeométrica: $E[X]$ y $V(X)$

> pagina: distribucion-hipergeometrica
> tags: discreta

$$E[X]=n\dfrac{M}{N}$$
$$V(X)=n\,p\,q\,\dfrac{N-n}{N-1}$$

Especiales en una muestra SIN reposición de tamaño n de una población N con M especiales.

## Poisson: $E[X]$ y $V(X)$

> pagina: distribucion-poisson
> tags: discreta

$$E[X]=\lambda$$
$$V(X)=\lambda$$

Número de ocurrencias en un intervalo con tasa media λ. Media = varianza.

## Uniforme continua: $E[X]$ y $V(X)$

> pagina: distribucion-uniforme-continua
> tags: continua

$$E[X]=\dfrac{a+b}{2}$$
$$V(X)=\dfrac{(b-a)^2}{12}$$

Valor al azar en (a,b) sin predilección: densidad constante.

## Exponencial: $E[X]$ y $V(X)$

> pagina: distribucion-exponencial
> tags: continua

$$E[X]=\dfrac{1}{\lambda}$$
$$V(X)=\dfrac{1}{\lambda^{2}}$$

Tiempo de espera / entre sucesos con tasa λ. Sin memoria.

## Normal: $E[X]$ y $V(X)$

> pagina: distribucion-normal
> tags: continua

$$E[X]=\mu$$
$$V(X)=\sigma^{2}$$

La campana de Gauss; límite de sumas de muchos efectos pequeños (TCL).

Segundo parámetro = DESVÍO $\sigma$ (no varianza), por convención de la cátedra.

## Gamma: $E[X]$ y $V(X)$

> pagina: distribucion-gamma
> tags: continua

$$E[X]=\dfrac{\alpha}{\lambda}$$
$$V(X)=\dfrac{\alpha}{\lambda^{2}}$$

Tiempo de espera hasta acumular α ocurrencias de un proceso de Poisson.

## Erlang: $E[X]$ y $V(X)$

> pagina: distribucion-erlang
> tags: continua

$$E[T_k]=\dfrac{k}{\lambda}$$
$$V(T_k)=\dfrac{k}{\lambda^{2}}$$

Instante de la k-ésima ocurrencia de Poisson = suma de k exponenciales (Gamma de forma entera).

## Weibull: $E[X]$ y $V(X)$

> pagina: distribucion-weibull
> tags: continua

$$E[X]=\tfrac{1}{\lambda}\Gamma(1+\tfrac1b)$$
$$V(X)=\tfrac{1}{\lambda^2}\big[\Gamma(1+\tfrac2b)-\Gamma(1+\tfrac1b)^2\big]$$

Tiempo a la falla cuando la tasa de fallas varía con el tiempo (b≠1). b=1 ⇒ exponencial.

## t de Student: $E[X]$ y $V(X)$

> pagina: distribucion-t-de-student
> tags: continua

$$E[T]=0\ (m>1)$$
$$V(T)=\dfrac{m}{m-2}\ (m>2)$$

Estadístico estandarizado de la media muestral cuando σ es desconocido (m=n−1 g.l.).

## Ji-cuadrado χ²: $E[X]$ y $V(X)$

> pagina: distribucion-ji-cuadrado
> tags: continua

$$E[X]=k$$
$$V(X)=2k$$

Suma de k cuadrados de normales estándar. (n−1)S²/σ² ~ χ²₍ₙ₋₁₎.
