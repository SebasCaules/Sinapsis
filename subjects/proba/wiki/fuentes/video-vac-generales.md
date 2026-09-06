---
titulo: "Video — VAC Generales"
resumen: "Clase en video de Lucio Pantazis (unidad 4) que introduce las variables continuas como límite de discretas cada vez más finas y resuelve un ejercicio completo con densidad partida: constante, acumulada, esperanza, varianza y cuantiles."
tipo: fuente
formato: video
unidad: 4
url: "https://youtu.be/Ow2jXN5Vk8Y"
duracion: "45:30"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — VAC Generales

**Qué es:** clase teórica en video que introduce las variables aleatorias continuas (v.a.c.) a partir de un ejemplo de discretización progresiva (termómetros cada vez más precisos) y desarrolla, paso a paso, un ejercicio completo con una densidad partida.
**Cubre:** motivación de la v.a.c. por convergencia de discretas, densidad de probabilidad, FDA, paralelismo discreta/continua, y un ejercicio integral (constante $k$, probabilidad en rango, FDA por tramos, esperanza, varianza, mediana y cuantiles).
**Guía asociada:** Guía 4

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:37] | Motivación: día de verano, termómetro que redondea al grado entero ($T_0$) |
| [03:34] | Termómetro más preciso, redondea a décimas ($T_1$) |
| [05:37] | Termómetro de centésimas ($T_2$): el zoom muestra que sigue siendo discreta |
| [07:49] | Comparación $T_0/T_1/T_2$: la probabilidad puntual tiende a $0$, la de un rango converge |
| [10:57] | Generalización a una variable continua $T$ en $[25,40]$: $P(T=t)=0\ \forall t$ |
| [13:22] | Por qué integrar la "probabilidad puntual" no sirve; hace falta una función de densidad |
| [15:00] | Definición y propiedades de la función de densidad $f_T(t)$ |
| [19:57] | Función de distribución acumulada como integral de la densidad |
| [22:51] | Tabla de paralelismo discreta ↔ continua (probabilidad puntual/densidad, recorrido/soporte, FDA, $E(X)$, $E(X^2)$, $V(X)$) |
| [26:53] | Ejercicio: hallar $k$ en $f_T(t)=k(t-25)^2(40-t)$ |
| [30:11] | Cálculo de $P(35\le T\le 37)$ con el $k$ hallado |
| [34:03] | Cálculo de $F_T(t)$ por tramos |
| [40:16] | Cálculo de $E(T)$ y $V(T)$ |
| [42:24] | Mediana como cuantil $0.5$; percentiles y cuartiles de una v.a.c. |

## Qué aporta sobre el apunte

La definición formal de v.a.c., la densidad y la FDA como integral ya están desarrolladas con el mismo nivel de detalle en [[teorica-va-continuas]], [[variable-aleatoria-continua]] y [[funcion-de-densidad]] (son apuntes del mismo docente). Lo que aporta este video puntualmente:

- **(a) Ejemplo resuelto completo:** un ejercicio de punta a punta con densidad partida $f_T(t)=k(t-25)^2(40-t)$ en $[25,40]$ — hallar $k$, $P(35\le T\le 37)$, $F_T(t)$ por tramos, $E(T)$, $V(T)$, mediana y cuartiles/percentil — que no está en las páginas existentes (ver sección siguiente).
- **(a) Motivación numérica de por qué $P(X=x)\to0$:** en vez de solo enunciarlo, el video muestra tres discretizaciones sucesivas de la misma temperatura (redondeo al entero, a la décima, a la centésima) y calcula $P(T=36)$ en cada una: $0.1093 \to 0.01143 \to 0.001147$ (tiende a $0$), mientras que $P(35\le T\le 37)$ apenas cambia: $0.3188 \to 0.2368 \to 0.2276$ (converge). Es la misma idea que ya está en [[variable-aleatoria-continua]] con el ejemplo de la altura, pero aquí se ve con números concretos que decrecen geométricamente, lo cual hace tangible el "improbable pero no imposible".
- **(c) Advertencia sobre chequeo de continuidad de la FDA por tramos** y sobre el rango razonable de $E(X)$ — ver sección de advertencias.
- **(d) Énfasis:** remarca dos veces que entender por qué $P(a\le X\le b)=P(a<X<b)$ para una v.a.c. "es muy importante para casi toda la materia" [32:16], y que el patrón de "encontrar la constante $k$ que normaliza" es "muy clásico" en ejercicios de v.a.c. [27:29].

No aporta nada nuevo sobre la tabla de paralelismo discreta/continua (ya cubierta, de forma equivalente, en la tabla de [[funcion-de-densidad]]) ni sobre las propiedades básicas de la FDA (ya en [[variable-aleatoria-continua]]).

## Ejercicio resuelto en clase

**Fuente:** este video (26:53–45:27).

**Enunciado.** La temperatura $T$ (en °C) de un día de verano es una variable aleatoria continua con densidad
$$
f_T(t) = \begin{cases} k\,(t-25)^2\,(40-t) & 25 \le t \le 40 \\ 0 & \text{en otro caso.} \end{cases}
$$
Se pide: hallar $k$; calcular $P(35\le T\le 37)$; hallar la FDA $F_T(t)$; calcular $E(T)$ y $V(T)$; hallar la mediana y los cuartiles / percentil 5.

**Planteo y cálculo — hallar $k$ [26:53].** Como $f_T$ es no negativa por construcción (el cuadrado y, dentro de $[25,40]$, $40-t\ge0$), sólo falta imponer que integre $1$:
$$ \int_{-\infty}^{+\infty} f_T(t)\,dt = k\int_{25}^{40} (t-25)^2(40-t)\,dt = 1. $$
Desarrollando el polinomio, la primitiva es $-\dfrac{t^4}{4}+30t^3-\dfrac{2625}{2}t^2+25000t$, y evaluada entre $25$ y $40$ da $16875/4$. Despejando,
$$ k = \frac{4}{16875}. $$

**Cálculo — $P(35\le T\le 37)$ [30:11].**
$$
P(35\le T\le 37)=\int_{35}^{37}\frac{4}{16875}(t-25)^2(40-t)\,dt = \frac{4}{16875}\left(-\frac{t^4}{4}+30t^3-\frac{2625}{2}t^2+25000t\right)\Big|_{35}^{37} = \frac{4}{16875}\cdot 956 = \frac{3824}{16875}\approx 0.2266.
$$
Este valor es prácticamente el mismo al que convergían las aproximaciones discretas de la motivación ($0.3188\to0.2368\to\mathbf{0.2276}$), lo que confirma que el modelo continuo es el límite de refinar el instrumento de medición.

**Cálculo — FDA por tramos [34:03].** Como $f_T$ está partida, $F_T(t)=\int_{-\infty}^t f_T(s)\,ds$ también queda partida en tres casos:
$$
F_T(t)=\begin{cases}
0 & t<25\\[6pt]
\dfrac{4}{16875}\left(-\dfrac{t^4}{4}+30t^3-\dfrac{2625}{2}t^2+25000t-\dfrac{703125}{4}\right) & 25\le t\le 40\\[8pt]
1 & t>40
\end{cases}
$$
Chequeo de continuidad (ver advertencias): evaluando el tramo del medio en $t=25$ da $0$ y en $t=40$ da $1$, empalmando correctamente con los tramos vecinos.

**Cálculo — $E(T)$ y $V(T)$ [40:16].**
$$ E(T)=\int_{25}^{40} t\,f_T(t)\,dt = \frac{4}{16875}\int_{25}^{40} t\,(t-25)^2(40-t)\,dt = 34. $$
Es razonable: al ser el soporte $[25,40]$, $E(T)$ debe caer dentro de ese intervalo. Análogamente, integrando $t^2 f_T(t)$ se obtiene $E(T^2)$ y
$$ V(T)=E(T^2)-E(T)^2 = 9 \quad\Rightarrow\quad \sigma_T=\sqrt{V(T)}=3. $$

**Cálculo — mediana [42:24].** Para una v.a.c., la mediana es el valor $x_{0.5}$ tal que $F_T(x_{0.5})=0.5$ (deja 50% de probabilidad de cada lado). Aquí $F_T$ no tiene inversa en forma cerrada, así que se resuelve numéricamente:
$$ F_T(x_{0.5})=0.5 \quad\Longrightarrow\quad x_{0.5}\approx 34.21. $$

**Cálculo — cuartiles y percentil 5 [44:52].** Del mismo modo, para cualquier $\alpha\in(0,1)$ el cuantil $x_\alpha$ cumple $F_T(x_\alpha)=\alpha$. Resolviendo numéricamente para distintos $\alpha$:
$$ Q_1=x_{0.25}\approx 31.84,\qquad Q_3=x_{0.75}\approx 36.35,\qquad P_5=x_{0.05}\approx 28.73. $$

**Resultado.** $k=\dfrac{4}{16875}$; $P(35\le T\le 37)\approx0.2266$; $F_T(t)$ como arriba; $E(T)=34$; $V(T)=9$ ($\sigma_T=3$); mediana $\approx34.21$; $Q_1\approx31.84$, $Q_3\approx36.35$, $P_5\approx28.73$.

## Advertencias del docente

- **[37:28]** "Una cosa que pueden chequear siempre que hagan una variable aleatoria continua es ver que su distribución también [sea continua]... es una buena forma de detectar errores": cuando la FDA queda partida en tramos, verificar que los tramos **empalmen** en los bordes del soporte (den el mismo valor al evaluar el límite de un tramo y el inicio del siguiente) sirve como chequeo de que la cuenta está bien hecha.
- **[41:04]** Al calcular $E(T)$, remarca que el resultado tiene que caer dentro del soporte de la variable (aquí, entre $25$ y $40$): "si son formas... les tiene que sonar raro que no les dé dentro de esos valores" — otro chequeo rápido de consistencia.
- **[32:16]** Insiste en que incluir o no un extremo en una desigualdad ($\le$ vs. $<$) no cambia la probabilidad para una v.a.c. (porque el punto aislado tiene probabilidad $0$): "entender eso es muy importante para casi toda la materia".
- **[27:29]** Señala que encontrar la constante $k$ de normalización es "muy clásico de variables aleatorias continuas" en los ejercicios, y que el valor de $k$ "no va a dar un número lindo" pero eso no es un error: es una constante que se arrastra hasta el final.

## Páginas del wiki que toca

- [[variable-aleatoria-continua]]
- [[funcion-de-densidad]]
- [[formulario-va-continuas]]
- [[teorica-va-continuas]]
- [[tp4-variables-aleatorias-continuas]]
