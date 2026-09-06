---
titulo: "Relación entre los procesos Bernoulli y Poisson (teórica)"
resumen: 'Apunte manuscrito de la unidad 6 que obtiene el proceso de Poisson como límite del de Bernoulli al discretizar el tiempo con $p=\lambda\,\Delta t$, y cierra con una tabla comparativa de ambos procesos y de sus distribuciones asociadas.'
tipo: fuente
formato: apunte
unidad: 6
archivo_raw: "raw/07-procesos-estocasticos/07 - Relación entre los Procesos Bernoulli y Poisson.pdf"
ingerido: 2026-05-30
---

# Relación entre los procesos Bernoulli y Poisson (teórica)

**Qué es:** apunte manuscrito que muestra que el proceso de Poisson es el límite
continuo del proceso de Bernoulli, con una tabla comparativa final.
**Cubre las unidades/temas:** discretización del tiempo en intervalos $\Delta t$,
aproximación de Poisson a la binomial, tabla Bernoulli vs. Poisson.

## Puntos clave
- Si se discretiza $[0,t]$ en $t/\Delta t$ intervalos de longitud $\Delta t$, el
  proceso de Poisson de tasa $\lambda$ se aproxima por un proceso de Bernoulli con
  $p=\lambda\,\Delta t$: $N(t)\approx\text{Binomial}\!\left(\frac{t}{\Delta t},
  \lambda\,\Delta t\right)$.
- Tomando $\Delta t\to0$, la binomial converge a Poisson:
  $\binom{t/\Delta t}{n}(\lambda\Delta t)^n(1-\lambda\Delta t)^{t/\Delta t-n}\to
  \dfrac{(\lambda t)^n}{n!}e^{-\lambda t}$. Es la
  [[distribucion-poisson|aproximación Poisson de la binomial]].
- **Tabla comparativa** (Bernoulli / Poisson): parámetro tiempo discreto/continuo;
  ambos con incrementos independientes y estacionarios; ambos Markov; tiempos
  entre eventos Geométrica/Exponencial i.i.d.; tiempo hasta el $k$-ésimo Binomial
  negativa/Erlang; marginal Binomial/Poisson. Geométrica y Exponencial comparten
  la **falta de memoria**.

## Páginas del wiki que toca
- [[relacion-bernoulli-poisson]]
- [[proceso-de-bernoulli]], [[proceso-de-poisson]]
