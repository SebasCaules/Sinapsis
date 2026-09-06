---
titulo: Distribución Erlang
resumen: 'Instante de la $k$-ésima ocurrencia de un proceso de Poisson de tasa $\lambda$, equivalente a la suma de $k$ exponenciales i.i.d.: $E[T_k]=k/\lambda$ y $V(T_k)=k/\lambda^2$. Es la Gamma con parámetro de forma entero.'
tipo: distribucion
unidad: 7
orden: 4
tags: [continua, distribucion]
fuentes: ["[[teorica-suma-exponenciales]]", "[[tp7-suma-de-va]]"]
actualizado: 2026-09-04
---

# Distribución Erlang

**En breve.** El tiempo de espera hasta la $k$-ésima ocurrencia de un proceso de
Poisson, o sea la **suma de $k$ exponenciales** i.i.d. de la misma tasa. Es la
[[distribucion-gamma|Gamma]] con forma entera.

**Modela:** el **instante de la $k$-ésima ocurrencia** de un
[[proceso-de-poisson|proceso de Poisson]] de tasa $\lambda$; equivalentemente, la
**suma de $k$ tiempos exponenciales** independientes de la misma tasa.
**Soporte:** $t>0$.
**Parámetros:** orden $k\in\mathbb N$ (entero) y tasa $\lambda>0$.
**Notación:** $T_k\sim\mathrm{Erlang}_k(\lambda)$.

> La Erlang **es** una [[distribucion-gamma|Gamma]] con parámetro de forma
> **entero**: $\mathrm{Erlang}_k(\lambda)=\mathrm{Gamma}(k,\lambda)$. Esta página
> destaca la lectura "tiempo de la $k$-ésima ocurrencia"; la teoría general
> (densidad con forma real, FGM, ji-cuadrado) está en [[distribucion-gamma]].

## De la suma de exponenciales a la Erlang

Sea $\tau_1,\tau_2,\dots\sim\mathrm{Exp}(\lambda)$ i.i.d. (tiempos **entre**
ocurrencias). El instante de la $k$-ésima ocurrencia es
$$ T_k=\sum_{i=1}^{k}\tau_i. $$
Según [[teorica-suma-exponenciales]], usando la equivalencia con el proceso de
Poisson $\{T_k>t\}\Leftrightarrow\{N(t)\le k-1\}$ con
$N(t)\sim\mathrm{Poisson}(\lambda t)$:
$$ P(T_k>t)=\sum_{j=0}^{k-1}\frac{(\lambda t)^{j}}{j!}\,e^{-\lambda t},\qquad t>0, $$

> **Intuición (la dualidad Erlang↔Poisson).** "La $k$-ésima ocurrencia todavía no
> llegó a tiempo $t$" es lo mismo que decir "hasta $t$ hubo a lo sumo $k-1$
> ocurrencias". Por eso $\{T_k>t\}\Leftrightarrow\{N(t)\le k-1\}$ y un problema de
> tiempo continuo (Erlang) se resuelve con un conteo discreto
> ([[distribucion-poisson|Poisson]]) que es una suma finita. Es el truco que
> evita integrar la densidad.

y derivando la FDA $F_{T_k}(t)=1-P(T_k>t)$ (telescopiando la suma) se obtiene la
**densidad**:
$$ f_{T_k}(t)=\frac{\lambda^{k}\,t^{\,k-1}\,e^{-\lambda t}}{(k-1)!}\qquad (t>0). $$

> [!figura] u7-linea-de-tiempo-la-dualidad-t-k-n-t
> Una realización del [[proceso-de-poisson|proceso de Poisson]] con sus instantes $T_k$, los tiempos $\tau_i$ entre ocurrencias y el contador $N(t)$ en un segundo carril. Los corchetes de abajo miden esos tiempos entre ocurrencias, de modo que $T_k=\tau_1+\dots+\tau_k$; solo llevan rótulo los dos primeros y la $k$-ésima ocurrencia $T_k$, para no amontonar etiquetas sobre el mismo carril. Al mover $t$ se lee el mismo hecho de las dos formas: «la $k$-ésima todavía no llegó» y «hasta $t$ hubo a lo sumo $k-1$».

## Esperanza y varianza

Como $T_k$ es suma de $k$ exponenciales i.i.d. con $E[\tau_i]=1/\lambda$ y
$V(\tau_i)=1/\lambda^2$, independientes:
$$ E[T_k]=\frac{k}{\lambda},\qquad V(T_k)=\frac{k}{\lambda^{2}}. $$

## Casos particulares y relaciones

- $k=1$: $\mathrm{Erlang}_1(\lambda)=\mathrm{Exp}(\lambda)$ (una sola
  [[distribucion-exponencial|exponencial]]).
- Es el caso de **forma entera** de la [[distribucion-gamma|Gamma]]
  ($\mathrm{Erlang}_k=\mathrm{Gamma}(k,\lambda)$).
- $T_k$ es el tiempo de la $k$-ésima llegada del [[proceso-de-poisson|proceso de Poisson]] de tasa $\lambda$.

## Cuándo usarla (reconocer en un ejercicio)

- "Tiempo hasta el $k$-ésimo evento" / "tiempo total de $k$ etapas en serie",
  cuando cada etapa es exponencial de la misma tasa $\lambda$.
- Si te piden $P(T_k>t)$, conviene la equivalencia con $N(t)$ Poisson (suma
  finita) o, para $k$ grande, el [[teorema-central-del-limite|TCL]].

## Ejercicio resuelto

*([[tp7-suma-de-va]], ej. 7 de la guía.) 30 instrumentos $D_1,\dots,D_{30}$ se usan
en serie (cada uno arranca al fallar el anterior); cada duración es
$\mathrm{Exp}(0.1\,\text{1/h})$, independientes. $T$ = tiempo total. ¿$P(T>310)$?*

**Planteo.** $T=\sum_{i=1}^{30}\tau_i\sim\mathrm{Erlang}_{30}(0.1)=\mathrm{Gamma}(30,0.1)$,
con $E[T]=30/0.1=300$ y $V(T)=30/0.1^2=3000$.

**Valor exacto.** $\{T>310\}\Leftrightarrow\{N(310)\le 29\}$,
$N(310)\sim\mathrm{Poisson}(31)$:
$$ P(T>310)=\sum_{k=0}^{29}\frac{31^{k}}{k!}e^{-31}\approx 0.4047. $$

**Aproximación por TCL.**
$$ P(T>310)\approx 1-\Phi\!\left(\frac{310-300}{\sqrt{3000}}\right)\approx 1-\Phi(0.1826)\approx 0.4276. $$

**Resultado.** Exacto $\approx 0.4047$; TCL $\approx 0.4276$. *(La resolución
completa y la versión Gamma general están en [[distribucion-gamma]].)*

## Enlaces
- [[distribucion-gamma]] — la Erlang como Gamma de forma entera (teoría general).
- [[distribucion-exponencial]] — los sumandos y el caso $k=1$.
- [[proceso-de-poisson]] — tiempo de la $k$-ésima ocurrencia.
- [[suma-de-va-independientes]] · [[teorema-central-del-limite]].
