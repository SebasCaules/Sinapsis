---
titulo: Relación entre los procesos Bernoulli y Poisson
resumen: "El proceso de Poisson es el límite continuo del de Bernoulli al hacer infinitamente finos los ticks del reloj: mismo esqueleto de conteo, y cada distribución discreta pasa a su análoga continua (Binomial a Poisson, Geométrica a Exponencial)."
tipo: concepto
unidad: 6
orden: 5
tags: [procesos-estocasticos, comparacion]
fuentes: ["[[teorica-relacion-bernoulli-poisson]]", "[[teorica-proceso-de-bernoulli]]", "[[teorica-proceso-de-poisson]]"]
actualizado: 2026-09-04
---

# Relación entre los procesos Bernoulli y Poisson

**En breve.** El [[proceso-de-poisson|Poisson]] es lo que se obtiene al hacer
infinitamente finos los ticks del [[proceso-de-bernoulli|Bernoulli]]: mismo
esqueleto (conteo, incrementos indep. y estac., [[procesos-estocasticos#Proceso de Markov|Markov]]),
cambia solo discreto $\to$ continuo. Cada distribución discreta tiene su análoga
continua.

El [[proceso-de-poisson|proceso de Poisson]] es el **límite continuo** del
[[proceso-de-bernoulli|proceso de Bernoulli]]: ambos son procesos de conteo con
incrementos independientes y estacionarios y propiedad de Markov; solo cambia si
el tiempo es discreto o continuo (según [[teorica-relacion-bernoulli-poisson]]).

> **Intuición.** Si se parte un minuto en muchísimos instantes chiquitos y en cada
> uno se tira una moneda con $p=\lambda\,\Delta t$ (probabilidad ínfima), el número
> total de caras deja de ser [[distribucion-binomial|Binomial]] y se vuelve
> [[distribucion-poisson|Poisson]]. Es el mismo argumento del límite que convierte
> una Binomial con $n$ grande y $p$ chico en una Poisson, pero leído como dos
> *procesos* en el tiempo en vez de dos distribuciones sueltas.

## Poisson como límite de Bernoulli
Discretizamos $[0,t]$ en $\dfrac{t}{\Delta t}$ intervalos de longitud $\Delta t$.
En cada intervalo, la probabilidad de un evento es
$$ P\big(N(k\Delta t)-N((k{-}1)\Delta t)=1\big)=\lambda\,\Delta t+o(\Delta t)\approx \lambda\,\Delta t, $$
y la de más de uno es $o(\Delta t)\approx0$. Entonces $N(t)$ se comporta como un
proceso de Bernoulli con $p=\lambda\,\Delta t$ y $k=\dfrac{t}{\Delta t}$ ensayos:
$$ N(t)\;\underset{\text{aprox}}{\sim}\;\text{Binomial}\!\left(\frac{t}{\Delta t},\,\lambda\,\Delta t\right). $$

> [!figura] u6-refinar-el-reloj-de-binomial-t-t-t-a-poisson-t
> Arriba, el intervalo $[0,t]$ partido en $m=t/\Delta t$ ranuras; abajo, la PMF de $\text{Binomial}(m,\lambda t/m)$ contra el perfil fijo de $\text{Poisson}(\lambda t)$. Al aumentar $m$ las barras se encajan sobre el perfil; con $m$ chico la lectura «estado del acoplamiento» avisa de $p=\lambda\Delta t>1$ —el error que se discute en el ejercicio resuelto de esta página— o de cuántos eventos comparten ranura: con ese $\Delta t$ el conteo discreto pierde eventos, y al achicarlo esa pérdida desaparece.

Tomando $\Delta t\to0$ (infinitos ensayos, $p\to0$ con $\frac{t}{\Delta t}\cdot
\lambda\Delta t=\lambda t$ fijo), la binomial converge a la Poisson:
$$ P(N(t)=n)\approx\binom{t/\Delta t}{n}(\lambda\Delta t)^n(1-\lambda\Delta t)^{\frac{t}{\Delta t}-n}\;\xrightarrow[\Delta t\to0]{}\;\frac{(\lambda t)^n}{n!}e^{-\lambda t}. $$
Este es exactamente el resultado de la
[[distribucion-poisson|aproximación Poisson de la binomial]] (Poisson como
límite de Binomial con $n$ grande, $p$ chico, $np=\lambda t$).

## Tabla comparativa
| | **Bernoulli** | **Poisson** |
|---|---|---|
| Parámetro tiempo | discreto | continuo |
| Incrementos | indep. y estac. | indep. y estac. |
| Markov | sí | sí |
| Tiempos entre eventos | [[distribucion-geometrica\|Geométrica]] i.i.d. | [[distribucion-exponencial\|Exponencial]] i.i.d. |
| Tiempo hasta el $k$-ésimo | [[distribucion-binomial-negativa\|Binomial negativa]] | [[distribucion-erlang\|Erlang]] |
| Distribución marginal $N(t)$ | [[distribucion-binomial\|Binomial]] | [[distribucion-poisson\|Poisson]] |
| Parámetro | $p$ | $\lambda$ |

Las dos distribuciones de tiempos entre eventos (Geométrica y Exponencial)
comparten la **falta de memoria**, que es lo que hace a ambos procesos "sin
memoria" (Markov).

## Correspondencia de parámetros
Al refinar el tiempo, $p=\lambda\,\Delta t$. Las parejas de distribuciones de
arriba son los análogos discreto↔continuo: Geométrica↔Exponencial,
Binomial negativa↔Erlang, Binomial↔Poisson.

## Ejercicio resuelto
*Adaptado de [[tp6-procesos-estocasticos]] Ej. 6. Una sustancia emite partículas
según un proceso de Poisson a razón de 75 partículas por minuto. (a) Probabilidad
de que en 20 segundos se emitan exactamente 20 partículas. (b) Mostrar la conexión
con el proceso de Bernoulli.*

**(a)** Pasamos la tasa a las unidades del intervalo. En $t=20\text{ s}=\tfrac13$
min, $\lambda t=75\cdot\tfrac13=25$. Luego $N\sim\text{Poisson}(25)$ y
$$ P(N=20)=\frac{25^{20}}{20!}e^{-25}\approx 0.0519. $$

**(b) Conexión con Bernoulli.** Si discretizamos los 20 s en, por ejemplo,
$\Delta t=1$ s, tenemos $k=20$ "ensayos" con $p=\lambda\Delta t=75\cdot\frac{1}{60}
=1.25$ — pero $p>1$ no es válido: $\Delta t$ es demasiado grande para que "a lo
sumo un evento por intervalo" sea razonable. Tomando $\Delta t$ chico (p. ej.
$\Delta t=0.01$ s, $k=2000$, $p=0.0125$), $N\approx\text{Binomial}(2000,0.0125)$
con $kp=25=\lambda t$, y
$$ P(N=20)\approx\binom{2000}{20}(0.0125)^{20}(0.9875)^{1980}\approx 0.0519, $$
que coincide con la Poisson: el proceso de Bernoulli **aproxima** al de Poisson
cuanto más fino es $\Delta t$.

**Resultado.** $P(N=20)\approx 0.0519$; la binomial con $\Delta t\to0$ y $kp=
\lambda t$ reproduce la Poisson.
