---
tipo: flashcards
titulo: 'Procesos estocásticos'
id: procesos-estocasticos
division: "6"
---

<!-- Generado desde estudio/study-data.js con el conversor del Sprint 2. -->

## Proceso de Poisson: distribución de $N(t)$ y de los tiempos.

> pagina: proceso-de-poisson

$N(t)\sim\mathrm{Poisson}(\lambda t)$; tiempos entre eventos $\sim\mathrm{Exp}(\lambda)$; tiempo al k-ésimo $\sim\mathrm{Erlang}(k,\lambda)$.

## Proceso de Bernoulli: $N(k)$ y tiempos.

> pagina: proceso-de-bernoulli

$N(k)\sim\mathrm{Binomial}(k,p)$; tiempos entre éxitos geométricos; al r-ésimo, binomial negativa.

## Ecuación de Chapman–Kolmogorov (matriz).

> pagina: cadenas-de-markov

$P^{(n)}=P^n$: la probabilidad de ir de $i$ a $j$ en $n$ pasos es la entrada $(i,j)$ de $P^n$.

## Distribución estacionaria $\pi$ de una cadena de Markov.

> pagina: cadenas-de-markov

Satisface $\pi P=\pi$ con $\sum_i\pi_i=1$. Es el límite de $\pi_n$ si la cadena es ergódica.
