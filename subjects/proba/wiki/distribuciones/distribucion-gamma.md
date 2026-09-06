---
titulo: Distribución Gamma
resumen: 'Tiempo de espera hasta acumular varias ocurrencias de un proceso de Poisson, o suma de exponenciales independientes: $f_X(x)=\lambda^{\alpha}x^{\alpha-1}e^{-\lambda x}/\Gamma(\alpha)$, con $E[X]=\alpha/\lambda$ y $V(X)=\alpha/\lambda^2$.'
tipo: distribucion
unidad: 7
orden: 3
tags: [continua, distribucion]
fuentes: ["[[teorica-suma-exponenciales]]", "[[tp7-suma-de-va]]"]
actualizado: 2026-06-06
---

# Distribución Gamma

**En breve.** Generaliza la [[distribucion-exponencial|exponencial]] sumando
varias: modela el tiempo de espera hasta acumular varias ocurrencias de un
proceso de Poisson. Con forma entera se la llama [[distribucion-erlang|Erlang]].

**Modela:** el **tiempo de espera hasta acumular varias ocurrencias** de un
proceso de Poisson (p. ej. tiempo total de operación de $n$ componentes que se
usan uno tras otro). Es la suma de exponenciales independientes.
**Soporte:** $x>0$.
**Parámetros:** forma $\alpha>0$ (también llamada $k$) y tasa $\lambda>0$.
**Notación:** $X\sim\mathrm{Gamma}(\alpha,\lambda)$ (en el curso, $\Gamma(\alpha,\lambda)$).

> El curso introduce la Gamma con **parámetro de forma entero** $n$ (es decir,
> como [[distribucion-erlang|Erlang]]), que es el caso que aparece al sumar
> exponenciales. La versión general con $\alpha$ real usa la función Gamma de
> Euler $\Gamma(\alpha)=\int_0^\infty u^{\alpha-1}e^{-u}\,du$, que cumple
> $\Gamma(n)=(n-1)!$ para $n$ entero.

## Función de densidad

Caso del curso (forma entera $n$), según [[teorica-suma-exponenciales]] y la
tabla del [[tp7-suma-de-va]]:
$$ f_{\Gamma(n,\lambda)}(x)=\frac{\lambda^{n}\,x^{\,n-1}\,e^{-\lambda x}}{(n-1)!}
   =\frac{(\lambda x)^{n-1}}{(n-1)!}\,\lambda e^{-\lambda x}\qquad (x>0). $$

Forma general (forma $\alpha$ real, reemplazando $(n-1)!$ por $\Gamma(\alpha)$):
$$ f_X(x)=\frac{\lambda^{\alpha}\,x^{\,\alpha-1}\,e^{-\lambda x}}{\Gamma(\alpha)}\qquad (x>0). $$

## Esperanza y varianza

- $E[X]=\dfrac{\alpha}{\lambda}$.
- $V(X)=\dfrac{\alpha}{\lambda^{2}}$.

> **Intuición (forma vs tasa).** El parámetro de forma $\alpha$ (cuántas
> exponenciales se suman) corre la masa hacia la derecha y la hace más simétrica; la
> tasa $\lambda$ sólo cambia la **escala** del tiempo (a mayor $\lambda$, eventos
> más rápidos, todo se comprime). Como cada sumando aporta media $1/\lambda$ y
> varianza $1/\lambda^2$, sumar $\alpha$ de ellos da $\alpha/\lambda$ y
> $\alpha/\lambda^2$ — la misma cuenta que para cualquier
> [[suma-de-va-independientes|suma de i.i.d.]].

**Deducción (caso entero).** Como $X=\sum_{i=1}^n\tau_i$ con
$\tau_i\sim\mathrm{Exp}(\lambda)$ i.i.d. ($E[\tau_i]=1/\lambda$,
$V(\tau_i)=1/\lambda^2$) e independientes:
$$ E[X]=\sum_{i=1}^n E[\tau_i]=\frac{n}{\lambda},\qquad
   V(X)=\sum_{i=1}^n V(\tau_i)=\frac{n}{\lambda^{2}}. $$

## Función generadora de momentos

$$ M_X(t)=\left(\frac{\lambda}{\lambda-t}\right)^{\alpha}\qquad (t<\lambda). $$
Es la potencia $\alpha$-ésima de la FGM de una [[distribucion-exponencial|exponencial]],
lo que vuelve a mostrar que sumar exponenciales (multiplicar FGM) da una Gamma.

## Relaciones con otras distribuciones

- **Suma de exponenciales:** $\sum_{i=1}^n\mathrm{Exp}(\lambda)$ i.i.d.
  $=\mathrm{Gamma}(n,\lambda)$ (ver [[suma-de-va-independientes]]). Para $n=1$ la
  Gamma **es** una exponencial: $\mathrm{Gamma}(1,\lambda)=\mathrm{Exp}(\lambda)$.
- **Erlang:** la $\mathrm{Gamma}(n,\lambda)$ con forma **entera** $n$ se llama
  [[distribucion-erlang|Erlang de orden $n$]]; es el tiempo de la $n$-ésima
  ocurrencia de un [[proceso-de-poisson|proceso de Poisson]].
- **Ji-cuadrado:** la $\chi^2_k$ es una $\mathrm{Gamma}(\alpha=k/2,\lambda=1/2)$
  (forward-link [[distribucion-ji-cuadrado]]).
- **Infinitamente divisible:** la Gamma se escribe como suma de i.i.d.
  ($\mathrm{Gamma}(\alpha,\lambda)=\sum\mathrm{Gamma}(\alpha/m,\lambda)$), según
  [[tp7-suma-de-va]].
- **Suma cerrada (misma tasa):**
  $\mathrm{Gamma}(\alpha_1,\lambda)+\mathrm{Gamma}(\alpha_2,\lambda)
  =\mathrm{Gamma}(\alpha_1+\alpha_2,\lambda)$ si son independientes.

## Cuándo usarla (reconocer en un ejercicio)

- "Tiempo total hasta la $n$-ésima falla / llegada / evento" cuando los tiempos
  entre eventos son **exponenciales independientes** de la misma tasa.
- Componentes usados **en serie temporal** (uno arranca cuando falla el anterior):
  el tiempo total es Gamma con $n$ = cantidad de componentes.
- Si $n$ es grande, $P(X>t)$ se puede aproximar por el [[teorema-central-del-limite|TCL]]
  o calcular exacto vía $\{X>t\}\Leftrightarrow\{N(t)\le n-1\}$ con
  $N(t)\sim\mathrm{Poisson}(\lambda t)$.

## Ejercicio resuelto

*([[tp7-suma-de-va]], ej. 7 de la guía.) Se usan 30 instrumentos
$D_1,\dots,D_{30}$ en serie: cuando uno falla arranca el siguiente. La duración de
cada uno es $\mathrm{Exp}(0.1\,\text{1/hora})$ y las duraciones son
independientes. Sea $T$ el tiempo total de operación. ¿Probabilidad de que $T$
exceda 310 horas?*

**Planteo.** $T=\sum_{i=1}^{30}\tau_i$ con $\tau_i\sim\mathrm{Exp}(0.1)$ i.i.d., así
que $T\sim\mathrm{Gamma}(30,\,0.1)$. Sus momentos:
$$ E[T]=\frac{30}{0.1}=300,\qquad V(T)=\frac{30}{0.1^{2}}=3000. $$

**Valor exacto (vía Poisson).** Como $\{T>310\}\Leftrightarrow\{N(310)\le 29\}$ con
$N(310)\sim\mathrm{Poisson}(0.1\cdot 310)=\mathrm{Poisson}(31)$:
$$ P(T>310)=\sum_{k=0}^{29}\frac{31^{k}}{k!}e^{-31}\approx 0.40465. $$

**Aproximación por TCL** (suma de 30 i.i.d.):
$$ P(T>310)\approx 1-\Phi\!\left(\frac{310-300}{\sqrt{3000}}\right)=1-\Phi\!\left(\frac{1}{\sqrt{30}}\right)\approx 1-\Phi(0.1826)\approx 0.4276. $$

**Resultado.** Exacto $\approx 0.4047$; TCL $\approx 0.4276$ (la Respuesta de la
guía reporta el valor por TCL, $0.4276$).

## Enlaces
- [[distribucion-erlang]] — el caso de forma entera (mismo objeto, otro nombre).
- [[distribucion-exponencial]] — el caso $n=1$ y los sumandos.
- [[suma-de-va-independientes]] — suma de exponenciales → Gamma.
- [[proceso-de-poisson]] — la Gamma como tiempo de la $n$-ésima ocurrencia.
- [[distribucion-ji-cuadrado]] · [[teorema-central-del-limite]].
