---
titulo: Teórica — Suma de Exponenciales (Erlang / Gamma)
resumen: 'Slides manuscritas de la unidad 7 que, con la equivalencia $\{T_n>t\}=\{N(t)\le n-1\}$ del proceso de Poisson, prueban que la suma de $n$ exponenciales i.i.d. es una Erlang de orden $n$, es decir $\mathrm{Gamma}(n,\lambda)$.'
tipo: fuente
formato: pdf
unidad: 7
archivo_raw: "raw/08-suma-de-va/06 - Suma de Variables Aleatorias Independientes - Exponenciales.pdf"
ingerido: 2026-05-30
---

# Teórica — Suma de Exponenciales (Erlang / Gamma)

**Qué es:** slides manuscritas que prueban que la suma de $n$ exponenciales
i.i.d. es una **Erlang de orden $n$** (caso particular de Gamma), usando la
conexión con el **proceso de Poisson** $N(t)$.

**Cubre las unidades/temas:** unidad 7, suma de exponenciales, Erlang/Gamma, proceso de Poisson.

## Puntos clave
- $\tau_i\sim\mathrm{Exp}(\lambda)$ i.i.d.; $T_n=\sum_{i=1}^n\tau_i$ = instante de la $n$-ésima ocurrencia.
- $N(t)$ = proceso de Poisson de parámetro $\lambda$. Relación clave:
  $\{T_n>t\}\Leftrightarrow\{N(t)<n\}=\{N(t)\le n-1\}$.
- $P(T_n>t)=\sum_{k=0}^{n-1}\dfrac{(\lambda t)^k}{k!}e^{-\lambda t}$ para $t>0$.
- Derivando la FDA y telescopiando la suma se obtiene la densidad:
$$
f_{T_n}(t)=\dfrac{\lambda^n\,t^{\,n-1}\,e^{-\lambda t}}{(n-1)!}\quad t>0.
$$
- $T_n\sim\mathrm{Erlang}_n(\lambda)$, equivalentemente $T_n\sim\mathrm{Gamma}(n,\lambda)$.

## Páginas del wiki que toca
- [[suma-de-va-independientes]]
- [[distribucion-exponencial]]
- [[distribucion-gamma]]
- [[distribucion-erlang]]
- [[proceso-de-poisson]]
