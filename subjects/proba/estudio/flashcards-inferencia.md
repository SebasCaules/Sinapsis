---
tipo: flashcards
titulo: 'Inferencia'
id: inferencia
division: "8"
---

<!-- Generado desde estudio/study-data.js con el conversor del Sprint 2. -->

## ¿Qué es un estimador insesgado?

> pagina: estimacion-puntual

$\hat\theta$ es insesgado si $E[\hat\theta]=\theta$. El sesgo es $E[\hat\theta]-\theta$.

## Error cuadrático medio (ECM) de un estimador.

> pagina: estimacion-puntual

$\mathrm{ECM}(\hat\theta)=E[(\hat\theta-\theta)^2]=V(\hat\theta)+\mathrm{sesgo}^2$.

## ¿Por qué $S_n^2$ divide por $n-1$?

> pagina: varianza-muestral

Para ser insesgado: con $n$ subestima. $S_n^2=\dfrac{1}{n-1}\sum(X_i-\bar X)^2$ cumple $E[S_n^2]=\sigma^2$.

## IC para la media con σ conocido (nivel $1-\alpha$).

> pagina: intervalos-de-confianza

$\bar X\pm z_{1-\alpha/2}\,\dfrac{\sigma}{\sqrt n}$.

## IC para la media con σ desconocido y n chico.

> pagina: intervalos-de-confianza

$\bar X\pm t_{n-1,\,1-\alpha/2}\,\dfrac{S}{\sqrt n}$ (usa la t de Student con $n-1$ g.l.).

## IC para una proporción (TCL).

> pagina: intervalos-de-confianza

$\hat p\pm z_{1-\alpha/2}\sqrt{\dfrac{\hat p(1-\hat p)}{n}}$.

## Estimador de máxima verosimilitud (idea).

> pagina: estimacion-puntual

Maximizar $L(\theta)=\prod f(x_i;\theta)$ (o $\ell=\log L$). Se deriva $\ell$ e iguala a 0, salvo casos de soporte (p.ej. uniforme).
