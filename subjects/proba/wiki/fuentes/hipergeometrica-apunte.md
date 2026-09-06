---
titulo: V.A.D. Especiales — Hipergeométrica (apunte manuscrito)
resumen: 'Apunte manuscrito de la unidad 3 sobre el muestreo sin reposición: $p_X(k)=\binom{M}{k}\binom{N-M}{n-k}/\binom{N}{n}$, con $E[X]=np$ y $V(X)=npq\,(N-n)/(N-1)$, más la demostración de la aproximación binomial cuando $N\gg n$.'
tipo: fuente
formato: apunte
unidad: 3
archivo_raw: "raw/04-va-discretas/06 - V.A.D. Especiales - Hipergeométrica.pdf"
ingerido: 2026-05-30
---

# V.A.D. Especiales — Hipergeométrica (apunte manuscrito)

**Qué es:** apunte manuscrito sobre la distribución hipergeométrica (muestreo sin
reposición) y su aproximación por la binomial.
**Cubre las unidades/temas:** distribución hipergeométrica, PMF, esperanza,
varianza, factor de corrección, aproximación binomial.

## Puntos clave
- Población $N$, conjunto especial $A$ de tamaño $M$, muestra $n$ **sin
  reposición**. $X$ = número de elementos de la muestra que pertenecen a $A$.
- $p_X(k) = \dfrac{\binom{M}{k}\binom{N-M}{n-k}}{\binom{N}{n}}$;
  recorrido $\{\max\{0,n-(N-M)\},\dots,\min\{n,M\}\}$.
- $E[X] = n\,M/N = np$; $V(X) = npq\,\tfrac{N-n}{N-1}$ (factor de corrección).
- Proposición y demostración completa de la **aproximación binomial**: si
  $M_N/N \to p$, entonces $P(X_N=k) \to \binom{n}{k}p^k(1-p)^{n-k}$ cuando $N \gg n$.

## Páginas del wiki que toca
- [[distribucion-hipergeometrica]]
- [[distribucion-binomial]], [[variable-aleatoria]], [[varianza]]
