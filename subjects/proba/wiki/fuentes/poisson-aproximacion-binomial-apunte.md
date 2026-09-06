---
titulo: V.A.D. Especiales — Poisson, Aproximación a la Binomial (apunte manuscrito)
resumen: 'Apunte manuscrito con la proposición y la demostración de que la binomial converge a la Poisson: si $np_n\to\lambda$, entonces $\binom{n}{k}p_n^k(1-p_n)^{n-k}\to\lambda^ke^{-\lambda}/k!$, lo que justifica usarla con $n$ grande y $p$ chico.'
tipo: fuente
formato: apunte
unidad: 3
archivo_raw: "raw/04-va-discretas/10 - V.A.D. Especiales - Poisson - Aprox. a Binomial.pdf"
ingerido: 2026-05-30
---

# V.A.D. Especiales — Poisson, Aproximación a la Binomial (apunte manuscrito)

**Qué es:** apunte manuscrito con la proposición y demostración de la aproximación
de la binomial por la Poisson.
**Cubre las unidades/temas:** aproximación Poisson a la binomial.

## Puntos clave
- Recuerda el límite $(1 + x/n)^n \to e^x$.
- **Proposición**: si $\{p_n\}$ con $\lim_n n\,p_n = \lambda > 0$, entonces
  $\lim_n \binom{n}{k}p_n^k(1-p_n)^{n-k} = \tfrac{\lambda^k}{k!}e^{-\lambda}$.
- Idea de la demostración separando los tres factores límite.
- Consecuencia: $n$ grande y $p$ chico con $\lambda = np \Rightarrow
  \text{Binomial}(n,p) \approx \text{Poisson}(np)$.
- Ejemplo numérico con $p=0{,}001$: $P(X_n=0)=(1-p)^n$ vs. $e^{-np}$ casi iguales.

## Páginas del wiki que toca
- [[distribucion-poisson]] (sección "Aproximación de Poisson a la Binomial")
- [[distribucion-binomial]]
