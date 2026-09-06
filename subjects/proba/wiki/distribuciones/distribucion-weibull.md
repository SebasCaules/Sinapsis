---
titulo: Distribución Weibull
resumen: 'Tiempos hasta la falla con tasa de fallas no constante, definida por su FDA $F_X(x)=1-e^{-(\lambda x)^b}$. La forma $b$ decide si la tasa crece ($b>1$), decrece ($b<1$) o es constante ($b=1$, exponencial). Es el modelo estándar de confiabilidad.'
tipo: distribucion
unidad: 4
orden: 7
tags: [continua, distribucion, confiabilidad, weibull]
fuentes: ["[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-09-04
---

# Distribución Weibull

**En breve.** Generaliza la [[distribucion-exponencial|exponencial]] agregando un parámetro de **forma** $b$ que permite [[tasa-de-fallas|tasa de fallas]] creciente ($b>1$, desgaste), decreciente ($b<1$, mortalidad infantil) o constante ($b=1$, vuelve a la exponencial). Es el modelo estándar de confiabilidad; suele venir dada por su FDA $1-e^{-(\lambda x)^b}$.

**Modela:** tiempos de vida / duración hasta la falla cuando la
[[tasa-de-fallas|tasa de fallas]] **no** es constante (componentes que se desgastan o que
"mejoran" con el tiempo). Es el modelo estándar de confiabilidad y análisis de duración.
**Soporte:** $x>0$.
**Parámetros:** forma $b>0$ y escala (vía la tasa) $\lambda>0$, ambos reales positivos.
**Notación:** $X\sim\text{Weibull}(\lambda,b)$ (la guía usa estos dos parámetros).

## Función de distribución y densidad

La guía la define directamente por su **FDA** ([[tp4-variables-aleatorias-continuas]] ej. 14):
$$ F_X(x)=\begin{cases} 1-\exp\!\big(-(\lambda x)^b\big) & x>0\\[2pt] 0 & x\le 0.\end{cases} $$
Derivando se obtiene la **densidad**:
$$ f_X(x)=F_X'(x)=\lambda\,b\,(\lambda x)^{b-1}\exp\!\big(-(\lambda x)^b\big),\qquad x>0, $$
y $0$ en otro caso.

## Esperanza y varianza

Usando la función Gamma $\Gamma(s)=\int_0^\infty u^{s-1}e^{-u}\,du$ (resultado estándar, **no
derivado en el raw** de la unidad 4 — ver [[distribucion-gamma|Gamma]], forward-link de U7):
$$ E[X]=\frac{1}{\lambda}\,\Gamma\!\left(1+\tfrac1b\right),\qquad
V(X)=\frac{1}{\lambda^2}\left[\Gamma\!\left(1+\tfrac2b\right)-\Gamma\!\left(1+\tfrac1b\right)^2\right]. $$
La **mediana** sale de $F_X(m)=\tfrac12$: $m=\dfrac{(\ln 2)^{1/b}}{\lambda}$.

## Tasa de fallas

$$ R(x)=\frac{f_X(x)}{1-F_X(x)}=\lambda\,b\,(\lambda x)^{b-1}. $$
Es una **potencia de $x$** (ver [[tasa-de-fallas]]):
- $b=1$: $R$ constante → se reduce a la [[distribucion-exponencial|exponencial]].
- $b>1$: $R$ creciente (desgaste/envejecimiento).
- $b<1$: $R$ decreciente (mortalidad infantil).

**Intuición (qué controla $b$).** El parámetro de forma $b$ decide **cómo cambia el riesgo con la edad**, mientras $\lambda$ solo fija la escala de tiempo (estira o comprime). Tome la exponencial ($b=1$, riesgo plano) como referencia: subir $b$ por encima de $1$ hace que el componente "envejezca" (cada vez más propenso a fallar), bajarlo por debajo de $1$ modela piezas defectuosas que, si sobreviven el rodaje inicial, se vuelven confiables. Por eso la Weibull cubre las tres ramas de la curva de bañera con un único modelo.

## Relaciones con otras distribuciones

- Con $b=1$ es exactamente la [[distribucion-exponencial|exponencial]] de tasa $\lambda$.
- Generaliza la exponencial dándole una tasa de fallas variable (ver [[tasa-de-fallas]]).
- Emparentada con la [[distribucion-gamma|Gamma]] (forward-link, U7) y la Rayleigh (caso $b=2$).

## Cuándo usarla (reconocer en un ejercicio)

- El enunciado nombra explícitamente "**Weibull**" y da la FDA $1-\exp(-(\lambda x)^b)$.
- Modelo de duración con desgaste o envejecimiento (tasa de fallas no constante).
- Piden duración garantizada $G_p$ (fractil de confiabilidad) tal que $P(X>G_p)=p$.

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 14 (resuelto en la guía, Sec. 6).

**Enunciado.** La duración $X$ de una pieza es Weibull con
$F_X(x)=1-\exp(-(\lambda x)^b)$, $x>0$, con $b=2$ y $\lambda=0.01$, midiendo $x$ en **miles
de horas**.
a) Obtener la densidad. b) Calcular la duración garantizada $G_{90}$ con $90\%$ de
confiabilidad ($P(X>G_{90})=0.90$). c) De un lote, se separan $1000$ piezas con duración
$>10\,000$ hs; ¿cuántas se espera que duren $>20\,000$ hs?

**Planteo.** Con $b=2$, $F_X(x)=1-e^{-(0.01x)^2}$. La unidad es miles de hs, así que
$X>10$ significa "dura más de $10\,000$ hs".

**Cálculo a).** Derivando,
$$ f_X(x)=\big[1-e^{-(0.01x)^2}\big]'=e^{-(0.01x)^2}\cdot\big[(0.01x)^2\big]' $$
$$ = e^{-(0.01x)^2}\cdot 2\cdot0.01x\cdot0.01 = 0.0002\,x\,e^{-(0.01x)^2}\quad(x>0). $$

**Cálculo b).** $P(X>G_{90})=0.90 \Rightarrow 1-F_X(G_{90})=e^{-(0.01 G_{90})^2}=0.90$, luego
$$ -(0.01 G_{90})^2=\ln(0.9) \Rightarrow 0.01\,G_{90}=\sqrt{-\ln 0.9} \Rightarrow
G_{90}=\frac{\sqrt{-\ln 0.9}}{0.01}\approx 32.459. $$
Como está en miles de hs, $G_{90}\approx 32\,459$ hs.

**Cálculo c).** Sea $Y_{1000}=$ piezas con duración $>20\,000$ hs entre las $1000$ ya
seleccionadas. Como las $1000$ ya cumplen $X>10$, la probabilidad de éxito es **condicional**:
$$ p=P(X>20\mid X>10)=\frac{P(X>20)}{P(X>10)}=\frac{e^{-(0.01\cdot20)^2}}{e^{-(0.01\cdot10)^2}}
=\frac{e^{-0.04}}{e^{-0.01}}=e^{-0.03}\approx 0.97045. $$
Modelando $Y_{1000}\sim\text{Bi}(1000,p)$, el número esperado es
$$ E[Y_{1000}]=1000\cdot 0.97045\approx 970.45\approx 970. $$

**Resultado.** a) $f_X(x)=0.0002\,x\,e^{-(0.01x)^2}$ ($x>0$). b) $G_{90}\approx 32\,459$ hs.
c) $\approx 970$ piezas.
