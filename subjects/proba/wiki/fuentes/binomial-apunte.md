---
titulo: V.A.D. Especiales — Binomial (apunte manuscrito)
resumen: 'Apunte manuscrito de la unidad 3 que deriva la distribución binomial desde extracciones con reposición y tiros de moneda: $P(X=k)=\binom{n}{k}p^kq^{n-k}$, con las demostraciones completas de $E[X]=np$ y $V(X)=npq$.'
tipo: fuente
formato: apunte
unidad: 3
archivo_raw: "raw/04-va-discretas/02 - V.A.D. Especiales - Binomial.pdf"
ingerido: 2026-05-30
---

# V.A.D. Especiales — Binomial (apunte manuscrito)

**Qué es:** apunte manuscrito que deriva la distribución binomial desde dos
ejemplos ($n$ extracciones con reposición de la urna; $n$ tiros de una moneda).
**Cubre las unidades/temas:** distribución binomial, PMF, esperanza, varianza.

## Puntos clave
- Tres condiciones del modelo binomial: $X$ cuenta éxitos; $n$ repeticiones
  idénticas ($p$ constante); independencia.
- Construye $P(X=k)$ contando configuraciones: $\binom{n}{k}p^k q^{n-k}$.
- Normalización por binomio de Newton: $\sum_k \binom{n}{k}p^k q^{n-k} = (p+q)^n = 1$.
- $X \sim \text{Binomial}(n,p)$, $\mathcal{R}_X = \{0,\dots,n\}$.
- Demostraciones completas de $E[X] = np$ (reindexando $m=k-1$) y
  $E[X^2] = n(n-1)p^2 + np$ (usando $k^2 = k(k-1)+k$, reindexando $m=k-2$), de donde
  $V(X) = npq$.

## Páginas del wiki que toca
- [[distribucion-binomial]]
- [[variable-aleatoria]], [[esperanza]], [[varianza]], [[independencia]]
- [[distribucion-bernoulli]]
