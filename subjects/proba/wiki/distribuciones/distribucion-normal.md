---
titulo: Distribución Normal
resumen: 'La campana $N(\mu,\sigma)$, simétrica alrededor de $\mu$ y con dispersión fijada por $\sigma$. Como su FDA no tiene forma cerrada, se estandariza: $F_X(x)=\Phi((x-\mu)/\sigma)$ y se lee la tabla. Es la distribución límite del TCL.'
tipo: distribucion
unidad: 4
orden: 8
tags: [continua, distribucion, normal, gaussiana]
fuentes: ["[[teorica-va-normal]]", "[[tp4-variables-aleatorias-continuas]]", "[[video-normales]]"]
actualizado: 2026-09-04
---

# Distribución Normal

**En breve.** La "campana" $N(\mu,\sigma)$: simétrica alrededor de $\mu$, con dispersión fijada por $\sigma$. Su FDA no tiene forma cerrada, así que casi todo se resuelve [[estandarizacion-y-tabla-normal|estandarizando]] ($Z=\frac{X-\mu}{\sigma}$) y leyendo la tabla de $\Phi$. Es la distribución límite del [[teorema-central-del-limite|TCL]] y la columna vertebral de la inferencia.

**Modela:** la distribución "campana" más usada; aparece como límite de sumas de
muchos efectos pequeños (ver [[teorema-central-del-limite|TCL]], forward-link).
Mediciones físicas, errores, dimensiones de piezas, calificaciones, etc.
**Soporte:** $x\in\mathbb{R}$.
**Parámetros:** media $\mu=E[X]$ y desvío estándar $\sigma>0$ (varianza $\sigma^2$).
**Notación:** $X\sim N(\mu,\sigma)$ (la cátedra usa el **desvío** como segundo
parámetro). También llamada **Gaussiana**. Es "la más importante".

## Función de densidad

$$ f_X(x)=\frac{1}{\sqrt{2\pi}\,\sigma}\,\exp\!\left\{-\frac{(x-\mu)^2}{2\sigma^2}\right\},\qquad x\in\mathbb{R}. $$

- Es **simétrica** respecto de $x=\mu$ → mediana $=\mu=$ moda $=$ media. El máximo
  (valor más frecuente) está en $\mu$ y vale $\frac{1}{\sqrt{2\pi}\,\sigma}$.
- Cambia la concavidad en $\mu\pm\sigma$ (puntos de inflexión).

## Función de distribución acumulada

**No tiene primitiva** (forma cerrada). Se calcula vía la
[[estandarizacion-y-tabla-normal|normal estándar]]:
$$ F_X(x)=P(X\le x)=\Phi\!\left(\frac{x-\mu}{\sigma}\right), $$
donde $\Phi$ es la FDA de $Z\sim N(0,1)$, tabulada. **Solo hace falta tabular $\Phi$ una vez** para cualquier $\mu,\sigma$.

**Intuición (por qué alcanza una sola tabla).** Todas las normales son la **misma** campana reescalada: cambiar $\mu$ la corre y cambiar $\sigma$ la estira o achica, pero la forma es idéntica. Estandarizar mide la distancia al centro **en cantidad de desvíos** ($z=\frac{x-\mu}{\sigma}$), una unidad común a todas las normales. Por eso el área a la izquierda de $x$ en $N(\mu,\sigma)$ es la misma que a la izquierda de $z$ en $N(0,1)$, y basta tabular $\Phi$ una vez.

## Esperanza y varianza

- $E[X]=\mu$.
- $V(X)=\sigma^2$.

## Función generadora de momentos

$$ M_X(t)=\exp\!\left\{\mu t+\tfrac12\sigma^2 t^2\right\}. $$
(No figura en el apunte; ver [[funcion-generadora-de-momentos|FGM]].)

## Regla empírica (68–95–99.7)

$$
\begin{aligned}
P(\mu-\sigma<X<\mu+\sigma)&\approx0.6827,\\
P(\mu-2\sigma<X<\mu+2\sigma)&\approx0.9545,\\
P(\mu-3\sigma<X<\mu+3\sigma)&\approx0.9973.
\end{aligned}
$$
($P(-6\sigma<X-\mu<6\sigma)\approx0.999999998$.)

> [!figura] u4-regla-empirica-invariante
> Las tres bandas **anidadas** $\mu\pm k\sigma$ sombreadas sobre la campana, cada una rotulada con la probabilidad de su intervalo completo: $68.27\,\%$ para $\mu\pm\sigma$, $95.45\,\%$ para $\mu\pm2\sigma$ y $99.73\,\%$ para $\mu\pm3\sigma$ (el núcleo queda más oscuro porque pertenece a las tres). Al mover $\mu$ y $\sigma$ la curva se desplaza y se estira, pero los tres porcentajes no cambian: por eso alcanza una sola tabla de $\Phi$. Con «ver en unidades $z$» se superpone la $N(0,1)$ de referencia y se comprueba que todas las normales colapsan en la misma curva.

## Asimetría y curtosis

Coeficiente de asimetría $\gamma=0$ y [[asimetria-y-curtosis|curtosis]] $\kappa=0$
(**mesocúrtica**: es la referencia). $\kappa<0$ platicúrtica (p. ej.
[[distribucion-uniforme-continua|uniforme]], $-6/5$); $\kappa>0$ leptocúrtica
(p. ej. [[distribucion-exponencial|exponencial]], $+6$).

## Relaciones con otras distribuciones

- **Transformación lineal.** Si $X\sim N(\mu,\sigma)$ y $Y=a\,X+b$ con $a\neq0$,
  entonces $Y\sim N(a\mu+b,\ |a|\,\sigma)$. El valor absoluto en el desvío es
  necesario porque $a$ puede ser negativo y el desvío siempre es positivo
  (fuente: [[video-normales]], comentario final de la clase).
- Estandarizar: $Z=\frac{X-\mu}{\sigma}\sim N(0,1)$ → [[estandarizacion-y-tabla-normal]]
  (allí: cuartiles $Q_{1,3}=\mu\mp0.6745\sigma$, $E[|Z|]=\sqrt{2/\pi}\approx0.798$ y
  probabilidad de [[boxplot|outliers]] de Tukey en una normal $\approx0.7\%$).
- Suma de normales independientes es normal; límite de sumas estandarizadas vía
  [[teorema-central-del-limite|TCL]] (forward-link).
- Aproxima la [[distribucion-binomial|binomial]] y la [[distribucion-poisson|Poisson]]
  para parámetros grandes (forward-links).
- **Ji-cuadrado:** la suma de cuadrados de normales estándar
  $Z_1^2+\dots+Z_k^2\sim\chi^2_k$ es una [[distribucion-ji-cuadrado|ji-cuadrado]] con
  $k$ grados de libertad. En particular $(n-1)S^2/\sigma^2\sim\chi^2_{n-1}$.
- **En inferencia:** la normal es el muestreo del [[promedio-muestral]] (con $\sigma$
  conocido), base del estadístico $Z$ usado en [[intervalos-de-confianza|IC]] y en
  [[prueba-de-hipotesis-para-la-media|pruebas para la media]] /
  [[prueba-de-hipotesis-para-la-proporcion|para la proporción]] (ver el hub
  [[prueba-de-hipotesis]]).

## Cálculo de momentos y normalización
La constante $1/(\sqrt{2\pi}\,\sigma)$ y los momentos surgen de **integrales
impropias** sobre $\mathbb{R}$ (dominio no acotado); ver
[[tecnica-integrales-impropias]].

## Cuándo usarla (reconocer en un ejercicio)

- El enunciado dice "distribución normal / Gaussiana" y da **media y desvío** (o varianza).
- Piden porcentajes/probabilidades de superar o no un valor, o un valor (fractil)
  asociado a una probabilidad dada (capacidad de tanque, nota mínima, tolerancia).
- Casi siempre se resuelve **estandarizando** y usando la tabla de $\Phi$.

## Ejercicios resueltos

### Ejercicio A — consumo de combustible
**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 16 (resuelto en la teórica
[[teorica-va-normal]]).

**Enunciado.** El consumo mensual de combustible es $X\sim N(\mu=18,\sigma=1.5)$
(en miles de litros). a) ¿% de meses con consumo $<21000$ litros? b) ¿% con
consumo $>17000$ litros? c) ¿% con consumo entre 17000 y 21000? d) ¿Capacidad de
tanque para cubrir el consumo con probabilidad $0.95$?

**Planteo.** Estandarizar $Z=\frac{X-18}{1.5}$ y usar la tabla de $\Phi$
([[estandarizacion-y-tabla-normal]]).

**Cálculo.**
a) $P(X\le21)=\Phi\!\left(\frac{21-18}{1.5}\right)=\Phi(2)=0.9772\Rightarrow 97.72\%$.
b) $P(X>17)=1-\Phi\!\left(\frac{17-18}{1.5}\right)=1-\Phi(-\tfrac23)=\Phi(\tfrac23)$.
Como $\tfrac23=0.6\overline{6}$ cae entre filas de la tabla, se **interpola** entre
$\Phi(0.66)=0.7454$ y $\Phi(0.67)=0.7486$: $\Phi(0.6\overline{6})\approx0.7475\Rightarrow\approx74.8\%$
(usar directamente $\Phi(0.67)\approx0.7486$ es una aproximación más basta).
c) $P(17<X\le21)=\Phi(2)-\Phi(-\tfrac23)=0.9772-0.2525=0.7247\Rightarrow\approx72.5\%$.
d) Capacidad $c$ tal que $P(X\le c)=0.95$:
$$ \Phi\!\left(\frac{c-18}{1.5}\right)=0.95 \Rightarrow \frac{c-18}{1.5}=\Phi^{-1}(0.95)=z_{0.95}\approx1.6449 $$
$$ \Rightarrow c\approx 1.5\cdot1.6449+18\approx20.47. $$

**Resultado.** a) $97.7\%$. b) $74.8\%$. c) $72.5\%$. d) $\approx20467$ litros.

### Ejercicio B — calificaciones de examen (varios ítems)
**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 27 (resuelto en la guía).

**Enunciado.** Notas de un examen con media $78$ y **varianza** $36$ (o sea $\sigma=6$),
con lo cual $X\sim N(78,6)$ en la notación de la cátedra (segundo parámetro $=$ desvío).
a) $P(X>72)$. b) Nota mínima para estar en el $10\%$ superior. e) Si la nota es
$>72$, probabilidad de que sea $>84$.

**Planteo.** $Z=\frac{X-78}{6}$.

**Cálculo a).** $P(X>72)=1-\Phi\!\left(\frac{72-78}{6}\right)=1-\Phi(-1)=\Phi(1)=0.8413$.

**Cálculo b).** Buscamos $x_A$ con $P(X\ge x_A)=0.1$:
$$ 1-\Phi\!\left(\frac{x_A-78}{6}\right)=0.1 \Rightarrow \frac{x_A-78}{6}=z_{0.9}\approx1.2816 \Rightarrow x_A\approx78+6\cdot1.2816\approx85.7. $$

**Cálculo e)** (probabilidad **condicional**):
$$ P(X>84\mid X>72)=\frac{P(X>84)}{P(X>72)}=\frac{1-\Phi(1)}{1-\Phi(-1)}=\frac{1-0.8413}{0.8413}\approx0.1886. $$

**Resultado.** a) $0.8413$. b) $\approx85.7$. e) $\approx0.1886$.

### Ejercicio C — tolerancia / despeje del desvío
**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 21 (resuelto en la guía).

**Enunciado.** Diámetro $D\sim N(10.02,0.075)$. Especificación $10.00\pm0.025$ mm.
a) Probabilidad de que la rosca esté **fuera** de especificación. b) Si el diámetro
estuviera centrado en $10$ ($D\sim N(10,\sigma)$), ¿máximo $\sigma$ que permita
**no más de una defectuosa entre mil**?

**Cálculo a).** Dentro de especificación: $9.975\le D\le10.025$.
$$ P(E)=\Phi\!\left(\frac{10.025-10.02}{0.075}\right)-\Phi\!\left(\frac{9.975-10.02}{0.075}\right) $$
$$ = \Phi(0.066)-\Phi(-0.6)=0.5239-0.2743=0.2536. $$
Fuera: $P(\overline E)=1-0.2536=0.7464$.

> ⚠️ Discrepancia con el raw ([[tp4-variables-aleatorias-continuas]]): la **resolución
> detallada** (Sec. 6, ec. 81) obtiene $P(\overline E)=0.7464$ leyendo $\Phi(0.066)\approx0.5239$
> de la tabla; pero la **sección de Respuestas** (Sec. 5, ej. 21a) reporta $0.7477$. Las dos
> vienen del mismo PDF. El origen de la diferencia es el redondeo de la tabla: el valor exacto
> es $\Phi(0.066)\approx0.5263$ (no $0.5239$, que corresponde a $\Phi(0.06)$), de donde
> $P(\overline E)\approx0.748$. El número "oficial" del enunciado es $0.7477$.

**Cálculo b).** Centrado: pedir $P(E)=0.999$. Por simetría,
$$ 0.999=2\Phi\!\left(\frac{0.025}{\sigma}\right)-1 \Rightarrow \Phi\!\left(\frac{0.025}{\sigma}\right)=0.9995 \Rightarrow \frac{0.025}{\sigma}=\Phi^{-1}(0.9995)\approx3.2905, $$
$$ \sigma\approx\frac{0.025}{3.2905}\approx0.0076\ \text{mm}. $$

**Resultado.** a) $\approx0.7477$ (Respuestas; la resolución por tabla da $0.7464$, ver
discrepancia). b) $\sigma\approx0.0076$ mm.

### Ejercicio D — motivación numérica: longitud de un termómetro
**Fuente:** [[video-normales]] [00:05]–[02:44] y [31:07].

**Enunciado.** La longitud $X$ (cm) de un termómetro fabricado tiene
$X\sim N(10,\,0.1)$. a) Mostrar numéricamente que, aunque el soporte teórico es
$\mathbb{R}$, la probabilidad fuera de $[9.5,10.5]$ es despreciable. b) Calcular
$P(X\le10.05)$.

**Cálculo a).** $P(X\le9.5)=\Phi\!\left(\frac{9.5-10}{0.1}\right)=\Phi(-5)\approx2.9\times10^{-7}$,
y $P(X\le10.5)=\Phi(5)\approx0.9999997$. Es decir, prácticamente toda la
probabilidad está concentrada en $[9.5,10.5]$ ($\pm5\sigma$), por más que la
densidad nunca sea exactamente cero fuera de ese rango.

**Cálculo b).** $P(X\le10.05)=\Phi\!\left(\frac{10.05-10}{0.1}\right)=\Phi(0.5)=0.6915$.

**Resultado.** a) $P(X\le9.5)\approx0{,}00003\%$, $P(X\le10.5)\approx99{,}99997\%$.
b) $P(X\le10.05)\approx0.6915$.

Este ejemplo complementa el consumo de combustible del Ejercicio A: ilustra, con
números concretos, por qué el soporte $\mathbb{R}$ de la normal no es un problema
práctico para modelar cantidades físicas acotadas (como una longitud, que no
puede ser negativa).
