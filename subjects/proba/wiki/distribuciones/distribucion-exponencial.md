---
titulo: Distribución Exponencial
resumen: 'Tiempo de espera hasta el próximo suceso de un proceso de Poisson: $f_X(x)=\lambda e^{-\lambda x}$, $P(X>x)=e^{-\lambda x}$ y $E[X]=\sigma_X=1/\lambda$. Su sello son la falta de memoria y la tasa de fallas constante $\lambda$.'
tipo: distribucion
unidad: 4
orden: 4
tags: [continua, distribucion]
fuentes: ["[[teorica-va-exponencial]]", "[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-09-04
---

# Distribución Exponencial

**En breve.** Modela el tiempo de espera hasta el próximo suceso "al azar" (tiempo entre llegadas de un [[proceso-de-poisson|proceso de Poisson]]). Su sello es la **falta de memoria** y la [[tasa-de-fallas|tasa de fallas]] constante $\lambda$. Con un solo parámetro $\lambda$ quedan fijadas $E[X]=V(X)^{1/2}=1/\lambda$.

**Modela:** tiempos de vida, tiempos de espera y tiempos **entre sucesos**
(intervalos entre eventos de un proceso de Poisson).
**Soporte:** $x\ge0$.
**Parámetros:** tasa $\lambda>0$ (sucesos por unidad de tiempo).
**Notación:** $X\sim\text{Expo}(\lambda)$ (también $\mathcal{E}(\lambda)$).

## Función de densidad

$$ f_X(x)=\begin{cases} \lambda e^{-\lambda x} & x>0\\[2pt] 0 & x<0.\end{cases} $$

## Función de distribución acumulada

$$ F_X(x)=\begin{cases} 1-e^{-\lambda x} & x\ge0\\[2pt] 0 & x<0,\end{cases}\qquad P(X>x)=e^{-\lambda x}\ \ (x\ge0). $$

## Esperanza y varianza

- $E[X]=\dfrac{1}{\lambda}$.
- $V(X)=\dfrac{1}{\lambda^2}$, de modo que $\sigma_X=\dfrac{1}{\lambda}$ (media y desvío coinciden).

**Deducción** ([[teorica-va-exponencial]]), usando $\int_0^\infty t^{n-1}e^{-t}\,dt=(n-1)!$
y el cambio $u=\lambda t$ (la normalización $\int_0^\infty\lambda e^{-\lambda x}dx=1$
y estos momentos son **integrales impropias** sobre dominio no acotado; ver
[[tecnica-integrales-impropias]]):
$$ E[X]=\int_0^\infty t\,\lambda e^{-\lambda t}\,dt=\frac{1}{\lambda}\int_0^\infty u\,e^{-u}\,du=\frac{1!}{\lambda}=\frac{1}{\lambda}, $$
$$ E[X^2]=\int_0^\infty t^2\,\lambda e^{-\lambda t}\,dt=\frac{1}{\lambda^2}\int_0^\infty u^2 e^{-u}\,du=\frac{2!}{\lambda^2}=\frac{2}{\lambda^2}, $$
$$ V(X)=\frac{2}{\lambda^2}-\left(\frac{1}{\lambda}\right)^2=\frac{1}{\lambda^2}. $$

## Falta de memoria

Propiedad característica de la exponencial ([[teorica-va-exponencial]]): el haber
"sobrevivido" hasta $x$ no aporta información sobre el futuro.
$$ P(X>x+\Delta\mid X>x)=\frac{P(X>x+\Delta)}{P(X>x)}=\frac{e^{-\lambda(x+\Delta)}}{e^{-\lambda x}}=e^{-\lambda\Delta}=P(X>\Delta). $$
Ej.: si $X$ es el tiempo de vida de un dispositivo, $P(X>20+1\mid X>20)=P(X>1)$.
Es la **única** distribución continua sin memoria (su análogo discreto es la
[[distribucion-geometrica|geométrica]]).

> [!figura] u4-falta-de-memoria-cola-renormalizada
> Arriba, la cola $x>t$ resaltada sobre la densidad; abajo, esa misma cola dividida por $P(X>t)$. Al mover $t$ la curva de abajo no se mueve: la vida restante tiene exactamente la misma exponencial que el dispositivo nuevo.

**Intuición (falta de memoria).** Un dispositivo exponencial "no envejece": llevar 20 horas funcionando no lo acerca ni lo aleja de la falla, su expectativa de vida restante es siempre $1/\lambda$, como recién salido de fábrica. Esto encaja con que falla **al azar** (no por desgaste): el reloj se reinicia en cada instante. Es la cara probabilística de la [[tasa-de-fallas|tasa de fallas]] constante. Si en cambio el componente se desgasta, hay que usar la [[distribucion-weibull|Weibull]].

## Función generadora de momentos

$$ M_X(t)=\frac{\lambda}{\lambda-t}\quad (t<\lambda). $$
(No figura en el apunte; ver [[funcion-generadora-de-momentos|FGM]].)

## Asimetría y curtosis

Sesgada a la derecha. Su [[asimetria-y-curtosis|curtosis]] es $\kappa=+6$
(leptocúrtica: colas más gruesas que la [[distribucion-normal|normal]]),
según [[teorica-va-normal]].

## Relaciones con otras distribuciones

- Es el tiempo entre llegadas de un **proceso de Poisson** de tasa $\lambda$ →
  el conteo en un intervalo es [[distribucion-poisson|Poisson]].
- Análogo continuo (sin memoria) de la [[distribucion-geometrica|geométrica]].
- Caso particular de la [[distribucion-weibull|Weibull]] con $b=1$ y de la
  [[distribucion-gamma|Gamma]]/[[distribucion-erlang|Erlang]] con parámetro de
  forma $1$ (es el caso $n=1$: una sola exponencial).
- Es la **única** distribución con [[tasa-de-fallas|tasa de fallas]] **constante**
  ($R(t)=\lambda$): tasa de falla constante $\iff$ exponencial.
- El **mínimo** de $n$ exponenciales independientes (sistema en serie) es exponencial
  de tasa $\sum_i\lambda_i$ → ver [[minimo-de-exponenciales]].

## Cuándo usarla (reconocer en un ejercicio)

- "Tiempo hasta la falla", "tiempo de vida", "tiempo entre sucesos/llegadas".
- Dan la **media** $\mu=1/\lambda$ (o la tasa $\lambda$ directamente).
- Aparece la frase "falla al azar en promedio cada $T$ horas" → $\lambda=1/T$.
- Sistemas en **serie** de $n$ exponenciales independientes: el mínimo de los
  tiempos vuelve a ser exponencial de parámetro $\sum\lambda_i$ → ver
  [[minimo-de-exponenciales]].

## Ejercicios resueltos

### Ejercicio A — falta de memoria + binomial
**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 10 (resuelto en la guía).

**Enunciado.** El tiempo hasta la falla de un dispositivo es exponencial con
**media 400 hs**.
a) El dispositivo funcionó sin fallas 400 horas. ¿Probabilidad de que falle en
las próximas 100 horas?
b) Si se ponen 10 de estos dispositivos, ¿probabilidad de que falle al menos uno
antes de 100 horas (fallas independientes)?

**Planteo.** Media $=1/\lambda=400 \Rightarrow \lambda=1/400$.

**Cálculo a).** Por **falta de memoria**, haber durado 400 hs no informa nada:
la probabilidad de fallar en las próximas 100 hs es la de fallar en un intervalo
de 100 hs cualquiera,
$$ P(X<100)=F_X(100)=1-e^{-100/400}=1-e^{-0.25}\approx 0.2212. $$

**Cálculo b).** Sea $T$ el tiempo de cada dispositivo y $D=$ cantidad que dura
más de 100 hs. $P(T>100)=e^{-100/400}=e^{-0.25}$. Que **ninguno** falle antes de
100 hs (los 10 duran más) tiene probabilidad
$$ P(D=10)=\big(e^{-0.25}\big)^{10}=e^{-2.5}\approx 0.08209, $$
así que "al menos uno falla antes de 100 hs" es
$$ 1-P(D=10)\approx 1-0.08209 = 0.91792. $$

**Resultado.** a) $\approx0.2212$. b) $\approx0.9179$.

### Ejercicio B — despejar $\lambda$ desde una binomial
**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 12 (resuelto en la guía).

**Enunciado.** Duración $X\sim\text{Expo}(\lambda)$ (en 1/hora). En una muestra de
5 dispositivos, la probabilidad de que **al menos uno** dure más de 1200 hs es
$0.75$. a) Hallar $\lambda$. b) Si los 5 se conectan en serie (falla el sistema
si falla alguno), probabilidad de que el sistema funcione más de 1500 horas.

**Planteo.** $p=P(X>1200)=e^{-\lambda\cdot1200}$. Sea $Y_5\sim\text{Bi}(5,p)$ la
cantidad que dura más de 1200 hs.

**Cálculo a).**
$$ P(Y_5\ge1)=1-P(Y_5=0)=0.75 \Rightarrow P(Y_5=0)=(1-p)^5=0.25 \Rightarrow 1-p=\sqrt[5]{0.25}. $$
Entonces $p=e^{-1200\lambda}=1-\sqrt[5]{0.25}$, y
$$ \lambda=-\frac{\ln\!\big(1-\sqrt[5]{0.25}\big)}{1200}\approx 0.0011819\ \text{1/hora}. $$

**Cálculo b).** En serie, el sistema funciona >1500 hs solo si **los 5** duran
más de 1500 hs. Con $p'=P(X>1500)=e^{-0.0011819\cdot1500}$,
$$ P(\text{los 5}>1500)=\big(e^{-0.0011819\cdot1500}\big)^5\approx 0.00014135. $$

**Resultado.** a) $\lambda\approx0.001182$ 1/hora. b) $\approx0.00014$.
