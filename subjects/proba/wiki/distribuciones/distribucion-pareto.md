---
titulo: Distribución Pareto
resumen: 'Magnitudes con un mínimo garantizado $x_0$ y cola pesada: $f_X(x)=\alpha x_0^{\alpha}/x^{\alpha+1}$ para $x>x_0$. Su esperanza $\alpha x_0/(\alpha-1)$ existe solo si $\alpha>1$ y su varianza solo si $\alpha>2$. Aparece en estimación puntual.'
tipo: distribucion
unidad: 4
orden: 10
tags: [continua, distribucion, estimacion]
fuentes: ["[[video-metodos-de-estimacion]]", "[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-09-04
---

# Distribución Pareto

**Modela:** magnitudes con un **mínimo garantizado** $x_0$ y **cola pesada** hacia
la derecha — ingresos y riquezas, tamaños de ciudades, puntajes, montos de
siniestros: la mayoría de los valores se apiña apenas por encima de $x_0$ y unos
pocos casos extremos se van muy lejos.
**Soporte:** $x \ge x_0$ (equivalentemente $x > x_0$; la densidad en el punto
aislado $x_0$ no cambia ninguna probabilidad).
**Parámetros:** $x_0 > 0$ de **escala** (el valor mínimo posible) y $\alpha > 0$
de **forma** (a mayor $\alpha$, cola más liviana).

Notación: $X \sim \mathrm{Pareto}(x_0, \alpha)$. Es una
[[variable-aleatoria-continua|variable aleatoria continua]] de la unidad 4;
[[tp4-variables-aleatorias-continuas]] la lista entre las distribuciones extra de
la unidad, y [[video-metodos-de-estimacion]] la usa como ejemplo central de
[[estimacion-puntual|estimación puntual]].

## Función de densidad

Según [[video-metodos-de-estimacion]] (26:08), la
[[funcion-de-densidad|función de densidad]] es

$$
f_X(x) =
\begin{cases}
\dfrac{\alpha\, x_0^{\alpha}}{x^{\alpha+1}} & x > x_0 \\[6pt]
0 & \text{caso contrario}
\end{cases}
$$

Es una potencia decreciente: en escala logarítmica, $\ln f_X(x)$ es una recta de
pendiente $-(\alpha+1)$ — de ahí el nombre de **ley de potencias**.

## Función de distribución acumulada

Integrando la densidad (una integral elemental, ver
[[tecnica-integrales-impropias]]):

$$
F_X(x) = \int_{x_0}^{x} \frac{\alpha\, x_0^{\alpha}}{t^{\alpha+1}}\, dt
= 1 - \left(\frac{x_0}{x}\right)^{\alpha}, \qquad x \ge x_0,
$$

y $F_X(x) = 0$ para $x < x_0$. La **cola** (función de supervivencia) queda con
forma muy simple:

$$
P(X > x) = \left(\frac{x_0}{x}\right)^{\alpha}, \qquad x \ge x_0 .
$$

Esta cola decae **polinomialmente**, no exponencialmente: por eso se dice que la
Pareto tiene cola pesada frente a la [[distribucion-exponencial|exponencial]] o
la [[distribucion-normal|normal]]. Ver
[[funcion-de-distribucion-acumulada|FDA]].

## Esperanza y varianza

- $E[X] = \dfrac{\alpha\, x_0}{\alpha - 1}$, **solo si** $\alpha > 1$.
- $V(X) = \dfrac{x_0^{2}\,\alpha}{(\alpha-1)^{2}(\alpha-2)}$, **solo si** $\alpha > 2$.

La [[esperanza]] con $x_0 = 10$ aparece explícitamente en
[[video-metodos-de-estimacion]] al plantear el método de los momentos, y el
docente insiste en la condición de la [[varianza]]: «para la varianza de una
Pareto, la fórmula solo vale si $\alpha > 2$ (más restrictivo que $\alpha > 1$
que exige el valor esperado)» (46:16–50:03).

> ⚠️ **Momentos que no existen.**
> Si $0 < \alpha \le 1$ la Pareto **no tiene esperanza finita**; si
> $1 < \alpha \le 2$ tiene esperanza pero **no varianza finita**. Esto no es una
> curiosidad teórica: rompe la hipótesis de «media y desvío finitos» que exige el
> [[teorema-central-del-limite|TCL]] (ver su enunciado) y deja sin sustento al
> [[estimacion-puntual#Método de los momentos|método de los momentos]] en esos
> rangos, como se ve en el ejercicio resuelto de más abajo.

## Momentos

Para $k$ entero positivo, integrando $x^k f_X(x)$ sobre el soporte:

$$
E[X^{k}] = \int_{x_0}^{\infty} x^{k}\,\frac{\alpha\, x_0^{\alpha}}{x^{\alpha+1}}\, dx
= \frac{\alpha\, x_0^{k}}{\alpha - k}, \qquad \text{si } \alpha > k,
$$

y la integral **diverge** si $\alpha \le k$. Con $k=1$ y $k=2$ se recuperan las
fórmulas de esperanza y varianza de la sección anterior (usando
$V(X) = E[X^2] - E[X]^2$).

## Función generadora de momentos

La Pareto **no tiene** [[funcion-generadora-de-momentos|función generadora de
momentos]] útil: para todo $t > 0$

$$
M_X(t) = E\!\left[e^{tX}\right]
= \int_{x_0}^{\infty} e^{tx}\,\frac{\alpha\, x_0^{\alpha}}{x^{\alpha+1}}\, dx = \infty,
$$

porque $e^{tx}$ crece más rápido que cualquier potencia $x^{-(\alpha+1)}$
decrece. Solo está definida en $t \le 0$, y por lo tanto **no sirve** para
generar momentos derivando en $t=0$. Los momentos se calculan directamente con la
integral de la sección anterior.

> **Nota — este resultado no figura en las fuentes del wiki.**
> La divergencia de $M_X(t)$ para $t>0$ se sigue de la propia densidad (es la
> firma de una cola pesada), no de una afirmación de la cátedra. Las fuentes
> disponibles ([[video-metodos-de-estimacion]]) trabajan la Pareto solo desde la
> estimación, sin mencionar su FGM.

## Relaciones con otras distribuciones

- **Con la [[distribucion-exponencial|exponencial]] — la relación clave.** Si
  $X \sim \mathrm{Pareto}(x_0,\alpha)$, entonces
  $$
  Y = \ln\!\left(\frac{X}{x_0}\right) \sim \mathrm{Exp}(\alpha),
  $$
  porque
  $P(Y > y) = P\!\left(X > x_0 e^{y}\right) = \left(\dfrac{x_0}{x_0 e^{y}}\right)^{\alpha} = e^{-\alpha y}$
  para $y \ge 0$. Es decir: **la Pareto es la exponencial en escala
  logarítmica**. Recíprocamente, si $Y\sim\mathrm{Exp}(\alpha)$ entonces
  $X = x_0 e^{Y}$ es Pareto. Ver
  [[tecnica-distribucion-de-una-funcion-de-va]].
  Esta identidad explica de inmediato el estimador de máxima verosimilitud de
  $\alpha$: estimar $\alpha$ en la Pareto es estimar la tasa de una exponencial
  con los datos transformados $\ln(X_i/x_0)$.
- **Escalado.** Si $X\sim\mathrm{Pareto}(x_0,\alpha)$ y $c>0$, entonces
  $cX \sim \mathrm{Pareto}(c\,x_0,\alpha)$: $x_0$ es un parámetro de escala puro
  y $\alpha$ no cambia.
- **Mínimo muestral.** Si $X_1,\dots,X_n$ son i.i.d. Pareto$(x_0,\alpha)$,
  entonces $\min_i X_i \sim \mathrm{Pareto}(x_0,\,n\alpha)$, ya que
  $P(\min_i X_i > x) = \left[(x_0/x)^{\alpha}\right]^{n}$. Es el análogo del
  [[minimo-de-exponenciales|mínimo de exponenciales]] y explica por qué
  $\min_i X_i$ es tan buen estimador de $x_0$: su dispersión se achica al crecer
  $n$.
- **Con la [[distribucion-uniforme-continua|uniforme]].** Si $U\sim U(0,1)$,
  entonces $X = x_0\,U^{-1/\alpha}$ es Pareto$(x_0,\alpha)$ (método de la
  transformada inversa, invirtiendo $F_X$).

## Cuándo usarla (reconocer en un ejercicio)

- El enunciado da un **valor mínimo garantizado** $x_0$ y dice que los valores se
  concentran cerca de él, con pocos casos muy grandes (ingresos, puntajes,
  siniestros, tamaños).
- Aparece una **densidad con forma de potencia** $c/x^{\beta}$ sobre $[x_0,\infty)$:
  identificar $\beta = \alpha+1$ y $c = \alpha x_0^{\alpha}$.
- La probabilidad de superar un umbral se pide como **razón de escalas**,
  $P(X>x)=(x_0/x)^{\alpha}$ — mucho más simple que integrar.
- Se habla de la **regla 80/20** o de «ley de potencias», o el enunciado pregunta
  qué fracción del total acumulan los valores más grandes.
- Señal de alarma típica de parcial: piden esperanza o varianza y hay que
  **verificar $\alpha>1$ o $\alpha>2$** antes de usar la fórmula.
- En [[inferencia-estadistica|inferencia]], es el ejemplo canónico de un
  parámetro **en el soporte** ($x_0$) junto a uno **en el exponente** ($\alpha$),
  que obliga a mezclar el argumento de borde con la derivada.

## Estimación de parámetros

Sea $X_1,\dots,X_n$ una muestra i.i.d. de Pareto$(x_0,\alpha)$. Todo lo que sigue
está desarrollado en [[video-metodos-de-estimacion]] (26:08–52:03) y se apoya en
[[teorica-maxima-verosimilitud]] y [[teorica-metodo-de-los-momentos]].

### Máxima verosimilitud con $x_0$ conocido

Como $\alpha$ está en el **exponente** y no en el soporte, la verosimilitud es
derivable en $\alpha$ mientras todos los datos superen $x_0$:

$$
\hat\alpha = \frac{n}{\displaystyle\sum_{i=1}^{n}\ln\!\left(\frac{X_i}{x_0}\right)} .
$$

Requiere $\min_i X_i > x_0$; si algún dato no supera $x_0$ la verosimilitud vale
$0$ y la fórmula no tiene sentido (advertencia explícita del docente, 34:09).
Obsérvese que es exactamente el estimador de máxima verosimilitud de la tasa de
una [[distribucion-exponencial|exponencial]] aplicado a los datos transformados
$\ln(X_i/x_0)$ — la relación de la sección anterior.

### Máxima verosimilitud con los dos parámetros desconocidos

$x_0$ **define el soporte**, así que la verosimilitud no es continua en $x_0$ y
**no se puede derivar** respecto de él. Se maximiza por **argumento de borde**:
para $\alpha$ fijo, $L$ crece con $x_0$ (por el factor $x_0^{\alpha}$) hasta el
mínimo muestral y se trunca a $0$ apenas lo supera. Entonces

$$
\hat x_0 = \min\{X_1,\dots,X_n\}, \qquad
\hat\alpha = \frac{n}{\displaystyle\sum_{i=1}^{n}\ln\!\left(\dfrac{X_i}{\hat x_0}\right)} .
$$

Es el mismo patrón que la [[distribucion-uniforme-continua|uniforme]] con
extremo desconocido: **parámetro en el soporte $\Rightarrow$ mirar el borde, no
derivar** (ver [[estimacion-puntual]]).

### Método de los momentos

- Con $x_0$ conocido, igualando $E[X]=\overline X_n$:
  $$
  \hat\alpha = \frac{\overline X_n}{\overline X_n - x_0}, \qquad \text{válido solo si } \alpha > 1 .
  $$
  Este estimador da **siempre** un valor mayor que 1, así que si el $\alpha$ real
  está entre $0$ y $1$ falla por construcción.
- Con los dos parámetros desconocidos, igualando media y
  [[varianza-muestral|varianza muestral]] $S^2$:
  $$
  \hat\alpha = 1 + \sqrt{1 + \frac{\overline X_n^{\,2}}{S^{2}}}, \qquad
  \hat x_0 = \frac{\overline X_n\,\sqrt{1 + \overline X_n^{\,2}/S^{2}}}{1 + \sqrt{1 + \overline X_n^{\,2}/S^{2}}},
  $$
  **válido solo si $\alpha > 2$** (necesita varianza finita).

> ⚠️ **El estimador de momentos puede contradecir a los datos.**
> Con dos parámetros, el $\hat x_0$ de momentos puede resultar **mayor que el
> mínimo efectivamente observado**, algo imposible porque $x_0$ debe ser menor o
> igual a todos los datos. La máxima verosimilitud nunca tiene ese problema
> porque busca el máximo sobre el soporte válido
> ([[video-metodos-de-estimacion]], 50:31–52:03).

## Ejercicio resuelto

**Enunciado** ([[video-metodos-de-estimacion]], 26:08–46:16). Los puntajes de una
población siguen una distribución de Pareto de parámetro de forma $\alpha>0$ y
valor mínimo $x_0$, con densidad
$f_{X}(x)=\alpha x_0^{\alpha}/x^{\alpha+1}$ para $x>x_0$ y $0$ en caso
contrario. Estimar $\alpha$ por máxima verosimilitud (a) con $x_0=10$ conocido y
(b) con $x_0$ también desconocido.

### Parte (a) — $x_0 = 10$ conocido

**Planteo.** La función de verosimilitud de la muestra es

$$
L(\alpha)=
\begin{cases}
\displaystyle\prod_{i=1}^{n} \frac{\alpha\cdot 10^{\alpha}}{X_i^{\alpha+1}} & \text{si } \min\{X_1,\dots,X_n\}>10 \\[8pt]
0 & \text{caso contrario}
\end{cases}
$$

Si algún $X_i \le 10$ su densidad es $0$ y anula todo el producto: de ahí la
condición $\min_i X_i > 10$.

**Cálculo.** Tomando logaritmo (válido solo donde $\min_i X_i > 10$), el producto
se vuelve suma:

$$
\ln L(\alpha) = n\ln\alpha + n\,\alpha\ln 10 - (\alpha+1)\sum_{i=1}^{n}\ln X_i .
$$

Derivando respecto de $\alpha$ e igualando a cero:

$$
\frac{d}{d\alpha}\ln L(\alpha) = \frac{n}{\alpha} + n\ln 10 - \sum_{i=1}^{n}\ln X_i = 0 .
$$

**Resultado.**

$$
\hat\alpha = \frac{n}{\displaystyle\sum_{i=1}^{n}\ln X_i - n\ln 10}
= \frac{n}{\displaystyle\sum_{i=1}^{n}\ln\!\left(\frac{X_i}{10}\right)} .
$$

El denominador es una suma de términos positivos **solo si** todos los datos
superan $10$; por eso la fórmula exige $\min_i X_i > 10$.

### Parte (b) — $x_0$ también desconocido

**Planteo.** Ahora la verosimilitud depende de dos parámetros:

$$
L(\alpha, x_0)=
\begin{cases}
\displaystyle\prod_{i=1}^{n} \frac{\alpha\cdot x_0^{\alpha}}{X_i^{\alpha+1}} & \text{si } \min\{X_1,\dots,X_n\}>x_0 \\[8pt]
0 & \text{caso contrario}
\end{cases}
$$

A diferencia de $\alpha$, el parámetro $x_0$ **no es derivable**: la
verosimilitud no es continua en $x_0$, se corta de golpe a $0$ apenas $x_0$
supera algún dato.

**Argumento del borde.** Para $\alpha$ fijo, cuanto más grande sea $x_0$ (sin
pasar el mínimo muestral), más grande es $x_0^{\alpha}$ en el numerador y más
grande la verosimilitud: crece monótonamente hasta $x_0=\min_i X_i$ y ahí se
trunca. El máximo se alcanza siempre en el borde:

$$
\hat x_0 = \min\{X_1,\dots,X_n\} .
$$

**Cálculo de $\alpha$.** Con $x_0$ fijado en $\hat x_0$, la cuenta es idéntica a
la parte (a) reemplazando $10$ por $\hat x_0$:

$$
\hat\alpha = \frac{n}{\displaystyle\sum_{i=1}^{n}\ln\!\left(\dfrac{X_i}{\hat x_0}\right)} .
$$

**Resultado numérico.** Para la muestra observada de $n=10$ puntajes
$3.1,\;1.4,\;1.3,\;1.0,\;1.4,\;2.4,\;2.3,\;1.3,\;11.3,\;2.4$ (mínimo $=1$):

$$
\hat x_0 = 1, \qquad \hat\alpha = 1.3628 .
$$

Sobre una segunda muestra de mínimo $1.2$ el video obtiene
$\hat x_0 = 1.2$ y $\hat\alpha = 2.5833$.

**Contraste con el método de los momentos.** Sobre esas mismas dos muestras, el
método de los momentos da $\hat x_0 = 1.6039,\ \hat\alpha = 2.3522$ (primera) y
$\hat x_0 = 1.3969,\ \hat\alpha = 4.0166$ (segunda). En ambos casos el
$\hat x_0$ de momentos queda **por encima del mínimo observado** ($1$ y $1.2$),
lo cual es imposible. Conclusión del docente: cuando el rango de validez del
método de los momentos es tan restrictivo ($\alpha>2$), conviene usar máxima
verosimilitud.

## Ejercicios resueltos

- [[video-metodos-de-estimacion]] (26:08–46:16) — MLE de la Pareto con $x_0$
  conocido y con ambos parámetros desconocidos; es el ejercicio transcripto
  arriba.
- [[tp4-variables-aleatorias-continuas]] — la lista entre las distribuciones
  extra de la unidad 4.

## Ver también

- [[distribucion-exponencial]] — la Pareto es su imagen en escala logarítmica.
- [[estimacion-puntual]] — máxima verosimilitud, método de los momentos y el
  patrón «parámetro en el soporte».
- [[funcion-de-densidad]], [[funcion-de-distribucion-acumulada]] — herramientas
  generales de la unidad 4.
- [[formulario-va-continuas]] — hoja de fórmulas de la unidad.
