---
titulo: Teorema Central del Límite
resumen: 'La suma o el promedio de muchas v.a. i.i.d. es aproximadamente normal, sea cual sea la distribución de origen: $Z_n=(\bar X_n-\mu)/(\sigma/\sqrt n)$ tiende a $N(0,1)$. Permite calcular probabilidades de sumas y promedios con la tabla de $\Phi$.'
tipo: teorema
unidad: 7
orden: 8
tags: [convergencia, normal, teorema, tcl]
fuentes: ["[[teorica-tcl-introduccion]]", "[[teorica-aproximacion-binomial-normal]]", "[[tp7-suma-de-va]]", "[[video-tcl]]"]
actualizado: 2026-09-03
---

# Teorema Central del Límite (TCL)

**En breve.** Sumar (o promediar) muchas v.a. i.i.d. produce algo aproximadamente
**Normal**, cualquiera sea la distribución de origen. Sirve para calcular
probabilidades de sumas/promedios sin conocer su distribución exacta: se tipifica
y se lee la [[estandarizacion-y-tabla-normal|tabla de la Normal estándar]].

El resultado **estrella** de la unidad: la suma (o el promedio) de muchas v.a.
i.i.d. se distribuye aproximadamente **Normal**, **sin importar** la distribución
de origen (con tal de que tenga media y desvío finitos). Según
[[teorica-tcl-introduccion]].

## Enunciado
Sean $\{X_k\}_{k\ge1}$ i.i.d. con media $\mu=\mu_X$ y desvío $\sigma=\sigma_X$.
Definimos la v.a. **tipificada** del promedio:
$$ Z_n=\frac{\bar X_n-\mu}{\sigma/\sqrt n}\qquad\Big(E[Z_n]=0,\;V(Z_n)=1\Big). $$
Entonces
$$ \lim_{n\to\infty} P(Z_n\le z)=\Phi(z), $$
donde $\Phi$ es la FDA de una [[distribucion-normal|Normal estándar]] $\mathcal N(0,1)$.

## Aproximaciones prácticas (para $n$ grande, regla usual $n>20$)
A partir de $Z_n\approx\mathcal N(0,1)$:
$$
\begin{aligned}
P(Z_n\le z)&\approx\Phi(z),\\[2pt]
P(\bar X_n\le x)&\approx\Phi\!\left(\frac{x-\mu}{\sigma/\sqrt n}\right),\\[2pt]
P(S_n\le s)&\approx\Phi\!\left(\frac{s-n\mu}{\sqrt n\,\sigma}\right).
\end{aligned}
$$
Es decir: $\;\bar X_n\overset{\text{aprox}}{\sim}\mathcal N\!\big(\mu,\tfrac{\sigma}{\sqrt n}\big)$
y $\;S_n\overset{\text{aprox}}{\sim}\mathcal N\!\big(n\mu,\sqrt n\,\sigma\big)$.

**Frecuencia relativa.** Si $\hat P_n=\tfrac1n\sum\mathbb 1_k(A)$ con $p=P(A)$:
$$ P(\hat P_n\le q)\approx\Phi\!\left(\frac{q-p}{\sqrt{p(1-p)/n}}\right). $$

> ⚠️ **Discrepancia sobre el umbral de $n$.** Esta página sigue la regla habitual $n>20$. En [[video-tcl]], el docente (Lucio Pantazis) prefiere ser más conservador y usar $n\ge50$, y aclara que $n=100$ "en general" alcanza pero **no siempre**: si la variable de origen es muy asimétrica (p. ej. una Binomial con $p$ muy chico o muy grande) la aproximación tarda mucho más en parecerse a una Normal — el video trae como contraejemplo una $\mathrm{Bi}(100,0{,}05)$ individual, donde con $n=100$ ya hay diferencias visibles en el segundo decimal frente al valor exacto. En la práctica: usar $n>20$ como mínimo aceptado, pero desconfiar cuando la distribución de origen es muy asimétrica y, de poder, verificar contra el valor exacto.

## Corrección por continuidad
El TCL vale para v.a. **discretas** y **continuas**, pero al aproximar una
**discreta** (recorrido $\{0,1,2,\dots\}$) por una continua hay que **ajustar
$\pm\tfrac12$** (según [[teorica-aproximacion-binomial-normal]]):
$$ P(S_n=s)\approx\Phi\!\left(\frac{s+\frac12-n\mu}{\sqrt n\,\sigma}\right)-\Phi\!\left(\frac{s-\frac12-n\mu}{\sqrt n\,\sigma}\right). $$
Para un intervalo, los extremos se mueven hacia afuera ($\le b\to b+\tfrac12$,
$\ge a\to a-\tfrac12$) si están incluidos.

**Intuición.** Una v.a. discreta concentra toda su probabilidad en puntos enteros,
pero la Normal la reparte en un continuo. Para que $P(S_n=s)$ no quede en cero,
cada entero $s$ se "ensancha" al intervalo $[s-\tfrac12,\,s+\tfrac12]$: así el
área bajo la campana sobre esa franja aproxima la barra del histograma centrada en
$s$. De ahí el $\pm\tfrac12$.

## Caso emblemático: aproximación de la Binomial
Como $\mathrm{Bin}(n,p)=\sum_{i=1}^n\mathrm{Bernoulli}(p)$, el TCL da
$\mathrm{Bin}(n,p)\approx\mathcal N(np,\sqrt{npq})$. La derivación detallada
(Stirling + Taylor) y los ejemplos están en
[[aproximacion-normal-de-la-binomial]].

## Ejercicio resuelto — central telefónica (dimensionar $N$)
*([[tp7-suma-de-va]], ej. 5 de la guía.) Una central $A$ sirve a 1800 usuarios. En
la hora pico cada usuario requiere una línea con prob. $p=\tfrac1{30}$,
independientes. Hallar el número $N$ de líneas tal que en promedio sólo 1 de cada
100 llamadas no encuentre línea, es decir $P(S_{1800}>N)\le\tfrac1{100}$.*

**Variable.** $S_{1800}=\sum_{i=1}^{1800}X_i$, $X_i\sim\mathrm{Bernoulli}(1/30)$, con
$$ E[X_i]=\tfrac1{30},\quad \sigma(X_i)=\sqrt{\tfrac1{30}\cdot\tfrac{29}{30}}=\tfrac{\sqrt{29}}{30}. $$
Por TCL, $S_{1800}\overset{\text{aprox}}{\sim}\mathcal N\big(\mu,\sigma\big)$ con
$$ \mu=1800\cdot\tfrac1{30}=60,\qquad \sigma=\sqrt{1800}\cdot\tfrac{\sqrt{29}}{30}=\sqrt{58}. $$
Luego $\dfrac{S_{1800}-60}{\sqrt{58}}\overset{\text{aprox}}{\sim}\mathcal N(0,1)$.

**Planteo con corrección por continuidad.** Como el recorrido es entero,
$P(S_{1800}>N)=P(S_{1800}>N+0.5)$ y
$$ P(S_{1800}>N+0.5)=P\!\left(\frac{S_{1800}-60}{\sqrt{58}}>\frac{N+0.5-60}{\sqrt{58}}\right)\approx 1-\Phi\!\left(\frac{N-59.5}{\sqrt{58}}\right). $$

**Condición.** $1-\Phi\!\big(\tfrac{N-59.5}{\sqrt{58}}\big)\le 0.01\Rightarrow \Phi\!\big(\tfrac{N-59.5}{\sqrt{58}}\big)\ge 0.99$:
$$ z_{0.99}\le\frac{N-59.5}{\sqrt{58}}\;\Rightarrow\; N\ge z_{0.99}\sqrt{58}+59.5. $$
Con $z_{0.99}=2.3263$: $\;N\ge 2.3263\sqrt{58}+59.5=77.217.$

**Resultado.** Como $N$ es entero, $N=78$ (muy por debajo de las 1800 líneas
físicas). Verificación exacta con la binomial: $P(S_{1800}>78)\approx0.0096\le0.01$
y $P(S_{1800}>77)\approx0.0132>0.01$, así que 78 es el mínimo.

## Ejercicio resuelto — suma de Poisson (TCL vs exacto)
*([[tp7-suma-de-va]], ej. 9 de la guía.) Sean $X_i\sim\mathrm{Poisson}(0.3)$
independientes, $i=1,\dots,50$, y $S=X_1+\dots+X_{50}$. a) Estimar $P(S\ge 18)$ por
el TCL. b) Compararlo con el valor exacto (recordar que la suma de Poisson
independientes es Poisson, $S\sim\mathrm{Poisson}(50\cdot0.3)$).*

**Parámetros.** Cada $X_i$ tiene $E[X_i]=V(X_i)=0.3$. Por suma de i.i.d.:
$$ \mu=E[S]=50\cdot0.3=15,\qquad \sigma^2=V(S)=50\cdot0.3=15,\quad \sigma=\sqrt{15}. $$

**a) TCL con corrección por continuidad.** $S$ es **discreta** (recorrido
$\{0,1,2,\dots\}$), así que $P(S\ge 18)=P(S\ge 17.5)$ y
$$ P(S\ge 18)\approx 1-\Phi\!\left(\frac{17.5-15}{\sqrt{15}}\right)=1-\Phi(0.6455)\approx 1-0.7405=0.2595. $$

**b) Valor exacto.** Por el caso Poisson+Poisson (ver
[[suma-de-va-independientes]]), $S\sim\mathrm{Poisson}(15)$, de modo que
$$ P(S\ge 18)=1-\sum_{k=0}^{17}\frac{15^k}{k!}e^{-15}\approx 0.2511. $$

**Resultado.** TCL $\approx 0.259$; exacto $\approx 0.251$ (aproximación
razonable; sin la corrección por continuidad el TCL daría $\approx 0.219$, peor).

## Ejercicio resuelto — cancelaciones (suma de Binomiales) y corrección por continuidad
*([[video-tcl]], min. 17:08.) $C_i\sim\mathrm{Bi}(100,0{,}05)$ i.i.d., cantidad de cancelaciones en el $i$-ésimo de $104$ eventos del año. Calcular $P(S_{104}\le490)$ con $S_{104}=\sum_{i=1}^{104}C_i$.*

**Sin corrección.** $S_{104}\overset{\text{TCL}}{\sim}\mathcal N(520,\sqrt{494})$, y
$$ P(S_{104}\le490)\approx\Phi\!\left(\frac{490-520}{\sqrt{494}}\right)=0{,}0885459. $$

**Con corrección por continuidad** (punto medio $490{,}5$):
$$ P(S_{104}\le490)=P(S_{104}\le490{,}5)\approx\Phi\!\left(\frac{490{,}5-520}{\sqrt{494}}\right)=0{,}0922101. $$

**Resultado.** Exacto (Binomial de $10\,400$ ensayos) $\approx0{,}0913270$: la versión corregida ($0{,}0922$) queda mucho más cerca que la sin corregir ($0{,}0885$). *(Para decidir si sumar o restar $0{,}5$ en cada caso, ver el método de razonamiento en [[video-tcl]] en vez de una regla fija.)*

## Enlaces
- [[aproximacion-normal-de-la-binomial]] (consecuencia) · [[distribucion-normal]].
- [[ley-de-grandes-numeros]] (compañera; la LGN dice *a qué* converge, el TCL *cómo*).
- [[suma-de-variables-aleatorias]] · [[promedio-muestral]] · [[desigualdad-de-chebyshev]].
- [[distribucion-poisson]] · [[distribucion-gamma]].
