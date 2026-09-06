---
titulo: Distribución Uniforme (continua)
resumen: 'Valor al azar en el intervalo $(a,b)$, con densidad constante $1/(b-a)$: todos los subintervalos del mismo largo son igual de probables. Su FDA crece linealmente y cumple $E[X]=(a+b)/2$ y $V(X)=(b-a)^2/12$.'
tipo: distribucion
unidad: 4
orden: 3
tags: [continua, distribucion]
fuentes: ["[[teorica-va-uniforme]]", "[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-06-06
---

# Distribución Uniforme (continua)

**En breve.** Modela un valor "al azar" en $(a,b)$ con densidad **constante** $1/(b-a)$: todos los subintervalos del mismo largo son igual de probables. Es la continua más simple y la base del método de la transformada inversa para simular otras distribuciones.

**Modela:** un valor "al azar" en un intervalo $(a,b)$ sin predilección por
ningún punto (todos los subintervalos del mismo largo son igual de probables).
**Soporte:** $x\in(a,b)$ con $a<b$.
**Parámetros:** extremos $a<b$.
**Notación:** $X\sim\text{Unif}(a,b)$.

## Función de densidad

$$ f_X(x)=\begin{cases} \dfrac{1}{b-a} & x\in(a,b)\\[4pt] 0 & x\notin(a,b).\end{cases} $$

La densidad es **constante** en el intervalo: "es uniforme, no hay predilección
por algunos valores" ([[teorica-va-uniforme]]).

**Intuición (probabilidad = proporción de largo).** Como la densidad es plana, la probabilidad de caer en un subintervalo es simplemente **su largo dividido por el largo total** $b-a$. No hace falta integrar nada raro: $P(c<X<d)=\frac{d-c}{b-a}$ es "qué fracción del intervalo ocupa". El valor $1/(b-a)$ de la densidad es justo el que hace que el rectángulo de base $b-a$ tenga área $1$.

## Función de distribución acumulada

$$ F_X(x)=\begin{cases} 0 & x\le a\\[2pt] \dfrac{x-a}{b-a} & a<x\le b\\[6pt] 1 & x\ge b.\end{cases} $$

La FDA crece linealmente entre $a$ y $b$.

## Esperanza y varianza

- $E[X]=\dfrac{a+b}{2}$ (el punto medio del intervalo).
- $V(X)=\dfrac{(b-a)^2}{12}$.

**Deducción de la esperanza** ([[teorica-va-uniforme]]):
$$ E[X]=\int_a^b x\cdot\frac{1}{b-a}\,dx=\frac{x^2}{2(b-a)}\Big|_a^b=\frac{b^2-a^2}{2(b-a)}=\frac{b+a}{2}. $$
**Varianza:** $E[X^2]=\int_a^b x^2\frac{1}{b-a}\,dx=\frac{b^2+ab+a^2}{3}$, luego
$$ V(X)=\frac{b^2+ab+a^2}{3}-\left(\frac{a+b}{2}\right)^2=\frac{b^2-2ab+a^2}{12}=\frac{(b-a)^2}{12}. $$

## Función generadora de momentos

$$ M_X(t)=\frac{e^{tb}-e^{ta}}{t(b-a)}\quad(t\neq0),\qquad M_X(0)=1. $$
(No figura en el apunte de la teórica; ver [[funcion-generadora-de-momentos|FGM]].)

## Asimetría y curtosis

Simétrica respecto del centro $\tfrac{a+b}{2}$ (coeficiente de asimetría $\gamma=0$).
Su [[asimetria-y-curtosis|curtosis]] es $\kappa=-\tfrac65$ (platicúrtica: colas más
finas que la [[distribucion-normal|normal]]), según [[teorica-va-normal]].

## Relaciones con otras distribuciones

- Si $U\sim\text{Unif}(0,1)$ y $F$ es una FDA continua estrictamente creciente,
  entonces $F^{-1}(U)$ tiene FDA $F$ (método de la transformada inversa) — ver
  [[tecnica-distribucion-de-una-funcion-de-va]] (forward-link).
- Es el caso límite "sin información" frente a la
  [[distribucion-exponencial|exponencial]] y la [[distribucion-normal|normal]].

## Cuándo usarla (reconocer en un ejercicio)

- El enunciado dice explícitamente "al azar / con igual probabilidad en un
  intervalo", "instante de llegada uniforme", "punto al azar en un segmento".
- Horarios con intervalos regulares y un pasajero que llega "en un instante al azar".

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 7 (respuesta $0.6$ en la guía).

**Enunciado.** Un colectivo pasa con intervalos estrictos de 5 minutos. El
instante de llegada de un pasajero a la parada es $X\sim\text{Unif}(0,5)$.
¿Cuál es la probabilidad de que espere **menos de 3 minutos**?

**Planteo.** Espera menos de 3 minutos si el colectivo llega dentro de los 3
minutos siguientes a su llegada, es decir si el pasajero llegó en los últimos 3
minutos del ciclo de 5: $X\in(2,5)$. Equivalentemente, se pide $P(X>2)$.

**Cálculo.** Con $a=0$, $b=5$, $f_X(x)=\tfrac15$ en $(0,5)$:
$$ P(X>2)=\int_2^5 \frac{1}{5}\,dx=\frac{5-2}{5}=\frac{3}{5}. $$
O por la FDA: $P(X>2)=1-F_X(2)=1-\tfrac{2-0}{5-0}=1-\tfrac25=\tfrac35$.

**Resultado.** $P=\tfrac35=0.6$.
