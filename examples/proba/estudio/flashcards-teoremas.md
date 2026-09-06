---
tipo: flashcards
titulo: 'Teoremas'
id: teoremas
---

<!-- Generado por examples/proba/tools/convert-study-data.mjs desde estudio/study-data.js. -->

## Teorema Central del Límite (enunciado).

> pagina: teorema-central-del-limite

Si $X_i$ i.i.d. con media $\mu$ y varianza $\sigma^2$, entonces $Z_n=\dfrac{\sum X_i-n\mu}{\sigma\sqrt n}\xrightarrow{d}\mathcal N(0,1)$.

## Desigualdad de Chebyshev.

> pagina: desigualdad-de-chebyshev

$P(|X-\mu|\ge k\sigma)\le \dfrac{1}{k^2}$, equivalentemente $P(|X-\mu|\ge\varepsilon)\le\dfrac{\sigma^2}{\varepsilon^2}$.

## Desigualdad de Markov ($X\ge 0$).

> pagina: desigualdad-de-chebyshev

$P(X\ge a)\le \dfrac{E[X]}{a}$, para $a>0$.

## Ley (débil) de los grandes números.

> pagina: ley-de-grandes-numeros

$\bar X_n\xrightarrow{P}\mu$: $P(|\bar X_n-\mu|>\varepsilon)\to0$. Se prueba con Chebyshev ($V(\bar X_n)=\sigma^2/n\to0$).

## Teorema de Bayes.

> pagina: probabilidad-total-y-bayes

$P(A_i\mid B)=\dfrac{P(B\mid A_i)P(A_i)}{\sum_k P(B\mid A_k)P(A_k)}$ (partición $\{A_k\}$).

## Aproximación normal de la binomial (De Moivre–Laplace).

> pagina: aproximacion-normal-de-la-binomial

$\mathrm{Bin}(n,p)\approx\mathcal N(np,\sqrt{npq})$ para $n$ grande. Usar corrección por continuidad $\pm0.5$.
