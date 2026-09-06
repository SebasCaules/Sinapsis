---
titulo: "Video — Procesos Estocásticos"
resumen: "Clase en video de Lucio Pantazis (unidades 5 y 6) que introduce los procesos estocásticos con el ejemplo de escribir una novela: definición formal, espacio de estados y de parámetros, procesos estacionarios e incrementos de un proceso."
tipo: fuente
formato: video
unidad: 6
url: "https://youtu.be/eKdxFbX9re8"
duracion: "31:04"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Procesos Estocásticos

**Qué es:** grabación de la clase de introducción a los procesos estocásticos,
dictada por el Dr. Lucio José Pantazis.
**Cubre:** motivación extendida con un ejemplo propio (Natalia escribiendo una
novela), definición formal de proceso estocástico, espacio de estados y espacio
de parámetros, procesos estacionarios e incrementos de un proceso. Se corta justo
al mostrar el título de la sección siguiente (Procesos de Poisson), sin
desarrollarla — queda para otra clase.
**Guía asociada:** Guía 5 - Guía 6

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:06] | Apertura: se anuncia el tema (procesos estocásticos) y que se empieza con una motivación |
| [00:29] | Motivación: Natalia escribe una novela; palabras por minuto como conjunto de variables aleatorias vinculadas |
| [03:53] | Se define la variable $X(k)$ = cantidad de palabras que escribe en el minuto $k$ |
| [04:52] | Estructura de probabilidades del ejemplo: $X(k)\sim \text{Bi}(n_k,p_k)$ con $n_k,p_k$ que dependen de $X(k-1)$ |
| [09:07] | Cálculo de $P(X(3)=4)$ con diagrama de árbol y probabilidad total sobre los dos primeros minutos |
| [14:55] | Simulación de 10 realizaciones del proceso (gráfico de palabras escritas vs. minuto) |
| [17:14] | Definición formal de proceso estocástico $\{X(t)\}_{t\in I\subseteq\mathbb{R}_{\ge0}}$ |
| [20:12] | "Variantes": las 4 combinaciones de espacio de estados $E$ / espacio de parámetros $I$ discretos o continuos, con ejemplos |
| [24:32] | Procesos estacionarios: definición formal y estacionariedad en sentido amplio |
| [28:47] | Incrementos de un proceso estocástico: $(\Delta_\tau X)_t = X(t+\tau)-X(t)$ |
| [30:57] | Cierre de la clase; se adelanta el título de la próxima sección (Procesos de Poisson) sin desarrollarla |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto propio y distinto al del apunte.** [[teorica-procesos-estocasticos-introduccion]]
  usa la [[caminata-aleatoria|caminata aleatoria]] como ejemplo guía; esta clase
  usa un ejemplo completamente distinto (Natalia escribiendo una novela, con una
  binomial de parámetros que mutan según el minuto anterior) y lo resuelve paso a
  paso con un diagrama de árbol — ver [[#Ejercicio resuelto en clase]].
- **(a) Simulación de 10 realizaciones** (14:55) del proceso, que ilustra
  visualmente la autocorrelación temporal (rachas altas y bajas) del ejemplo —
  no está en el apunte de slides.
- **(b) Intuición de "embalarse" o "bloquearse".** El docente motiva la
  dependencia temporal con la idea cotidiana de que escribir mucho en un minuto
  hace más probable seguir escribiendo mucho (y viceversa con "bloquearse"),
  antes de formalizarlo con la actualización de $n_k$ y $p_k$ (04:52-09:00). Es
  una intuición previa, más concreta, a la ya registrada en
  [[procesos-estocasticos]] sobre "proceso estocástico = secuencia de fotos
  correlacionadas".
- **(b) Intuición de los incrementos con el mismo ejemplo.** A partir de 29:11,
  usa la escritura de Natalia para explicar por qué a veces conviene mirar los
  incrementos en vez del proceso original: "escribió 10 palabras" no dice si
  viene subiendo o bajando, mientras que el incremento sí.
- **(d) Énfasis explícito en el diagrama de árbol.** A los 09:08 dice
  textualmente que "el gráfico de árbol para procesos estocásticos en general
  es importantísimo, sobre todo para los primeros pasos" — lo marca como la
  herramienta clave para calcular probabilidades en procesos con dependencia
  temporal, más que las fórmulas generales.
- **(d) Desénfasis explícito de las definiciones más formales.** Repite varias
  veces que ciertas definiciones generales (por ejemplo la de proceso
  estacionario, a los [26:25], o la condición sobre la covarianza de la
  estacionariedad en sentido amplio, a los [28:04]) "no las vamos a usar
  tanto" — las da para entender de qué se trata,
  pero el foco práctico está en la intuición y en casos con pocos pasos.

## Ejercicio resuelto en clase

*Arranca en [04:52]. Ejemplo motivador de la clase: Natalia escribe una novela;
$X(k)$ = cantidad de palabras que escribe en el minuto $k$, con $k\in\mathbb{N}$.*

**Enunciado.** Se supone la siguiente estructura de probabilidades:
- Para $k=1$: $X(1)\sim \text{Bi}(3,\,0.6)$, es decir $n_1=3$, $p_1=0.6$.
- Para $k>1$: $X(k)\sim \text{Bi}(n_k,p_k)$, donde
$$ n_k=\begin{cases} n_{k-1}+1 & \text{si } X(k-1) > 0.8\,n_{k-1} \\ n_{k-1} & \text{si } 0.2\,n_{k-1}\le X(k-1)\le 0.8\,n_{k-1} \\ \max\{1,\,n_{k-1}-1\} & \text{si } X(k-1) < 0.2\,n_{k-1} \end{cases} $$
$$ p_k = 0.75\cdot\frac{\sum_{i=1}^{k-1}p_i}{k-1} + 0.25\cdot\frac{X(k-1)}{n_{k-1}}. $$
Es decir, si escribió "mucho" (más del 80 % del máximo posible) el minuto
anterior, el máximo de palabras sube en uno; si escribió "poco" (menos del
20 %), baja en uno (sin bajar de 1); y la probabilidad de éxito de la binomial
se actualiza combinando el promedio de las $p_i$ anteriores con la proporción
de palabras escritas en el último minuto. Se pide $P(X(3)=4)$.

**Planteo.** Como las variables están vinculadas (la distribución del minuto
$k$ depende de lo ocurrido en $k-1$), se usa [09:07] probabilidad total sobre
lo ocurrido en los dos primeros minutos, apoyándose en un diagrama de árbol.

**Paso 1 — distribución de $X(1)$.** $X(1)\sim\text{Bi}(3,0.6)$:
$$ P(X(1)=0)=0.4^3=0.064,\quad P(X(1)=1)=3(0.6)(0.4)^2=0.288, $$
$$ P(X(1)=2)=3(0.6)^2(0.4)=0.432,\quad P(X(1)=3)=0.6^3=0.216. $$

**Paso 2 — actualización de $(n_2,p_2)$ según $X(1)$** (umbrales $0.8\cdot3=2.4$
y $0.2\cdot3=0.6$; $p_2=0.75\,p_1+0.25\cdot X(1)/3$):

| $X(1)$ | $n_2$ | $p_2$ |
|---|---|---|
| 0 (bloqueo, $<0.6$) | $\max\{1,2\}=2$ | $0.75(0.6)+0.25(0/3)=0.45$ |
| 1 (rango medio) | $3$ | $0.75(0.6)+0.25(1/3)=0.5\overline{3}$ |
| 2 (rango medio) | $3$ | $0.75(0.6)+0.25(2/3)=0.61\overline{6}$ |
| 3 (embalada, $>2.4$) | $4$ | $0.75(0.6)+0.25(3/3)=0.7$ |

Con esto, $X(2)\mid X(1)$ es binomial con esos parámetros (por ejemplo, si
$X(1)=3$: $X(2)\mid X(1){=}3\sim\text{Bi}(4,0.7)$, con
$P(X(2){=}4\mid X(1){=}3)=0.7^4=0.2401$).

**Paso 3 — actualización de $(n_3,p_3)$ según $X(2)$**, con
$p_3=0.75\cdot\dfrac{p_1+p_2}{2}+0.25\cdot\dfrac{X(2)}{n_2}$. Como se busca
$X(3)=4$, solo importan las ramas donde $n_3\ge4$. Revisando los umbrales
$0.8\,n_2$ y $0.2\,n_2$ en cada una de las 16 combinaciones $(X(1),X(2))$
posibles, las únicas ramas que llegan a $n_3\ge4$ son:

| $X(1)$ | $X(2)$ | $n_3$ | $p_3$ | $P(X(3){=}4\mid n_3,p_3)$ |
|---|---|---|---|---|
| 1 | 3 | 4 | $0.75\cdot\frac{0.6+0.5\overline3}{2}+0.25(1)=0.675$ | $0.675^4\approx0.208$ |
| 2 | 3 | 4 | $0.75\cdot\frac{0.6+0.61\overline6}{2}+0.25(1)\approx0.706$ | $\approx0.249$ |
| 3 | 1 | 4 | $0.75\cdot\frac{0.6+0.7}{2}+0.25(1/4)=0.55$ | $0.55^4\approx0.092$ |
| 3 | 2 | 4 | $0.75(0.65)+0.25(2/4)=0.6125$ | $\approx0.141$ |
| 3 | 3 | 4 | $0.75(0.65)+0.25(3/4)=0.675$ | $\approx0.208$ |
| 3 | 4 | 5 | $0.75(0.65)+0.25(4/4)=0.7375$ | $\binom{5}{4}(0.7375)^4(0.2625)\approx0.388$ |

Todas las demás ramas dejan $n_3<4$, así que aportan probabilidad nula a
$P(X(3)=4)$ (no se puede escribir más palabras que el máximo permitido en ese
minuto).

**Resultado.** Sumando las contribuciones de las ramas no nulas (cada una
ponderada por la probabilidad de haber llegado a ese nodo, $P(X(1))\cdot
P(X(2)\mid X(1))$), la slide de la clase, mostrada en pantalla a los [13:40],
indica
$$ P(X(3)=4) = 0.1648. $$

> ⚠️ Discrepancia: recalculando exactamente esa misma suma con los valores
> que la propia slide muestra para cada rama no nula —
> $0.288\cdot0.1517\cdot0.208 + 0.432\cdot0.2346\cdot0.249 +
> 0.216\cdot0.0756\cdot0.092 + 0.216\cdot0.2646\cdot0.141 +
> 0.216\cdot0.4116\cdot0.208 + 0.216\cdot0.2401\cdot0.388$ — el resultado da
> $\approx 0.0825$, casi exactamente la mitad de $0.1648$. Es decir, la cifra
> final que aparece en la slide no coincide con lo que produce el propio
> método (probabilidad total ponderada rama por rama) aplicado a los propios
> datos intermedios de esa misma slide; es probable que sea un error del
> script que generó la slide, algo compatible con que el docente comente más
> adelante, a los [24:44], "perdí el script" al preparar otra parte de la
> clase. Se deja registrado aquí el valor tal como aparece en la fuente
> ($0.1648$), pero el valor verificable a partir del método y de los datos
> intermedios de la propia slide es $\approx 0.0825$.

**Cierre del docente [09:20]-[09:29]:** justo después de plantear el
problema, el docente aclara que el diagrama de árbol es manejable solo para
pocos pasos ("si tuviera que ver qué pasa en el décimo minuto ya es medio
incontrolable esto. Pero para tres... para tres pasos sí podría mirar").
Más adelante, a los [15:18]-[15:41], agrega que el ejemplo también se puede
simular directamente respetando las reglas de $(n_k,p_k)$ — un proceso con
esa estructura es mucho más fácil de programar que de anticipar a mano — ver
la [[#Recorrido de la clase|simulación]] que muestra a continuación.

## Advertencias del docente

- [09:08] El diagrama de árbol es, en sus palabras, "importantísimo, sobre todo
  para los primeros pasos" al calcular probabilidades en procesos con
  dependencia temporal — herramienta a dominar por encima de fórmulas
  generales.
- [00:11]-[00:14] Sobre las definiciones generales de esta introducción: "van a
  haber cosas que son muy complejas en realidad de entender, que no las vamos a
  usar tanto".
- [28:04]-[28:09] Sobre la utilidad práctica de la definición formal de
  proceso estacionario — dicho justo después de plantear la condición de que
  la covarianza entre dos instantes dependa solo de la longitud del
  intervalo entre ellos (la condición propia de la estacionariedad en
  sentido amplio) — aclara, textualmente: "no no lo vamos a usar tanto, pero
  sí quizás... no lo vamos a usar casi". El foco práctico de la materia está
  en casos concretos y en la intuición, no en verificar las condiciones
  formales caso por caso.

## Páginas del wiki que toca

- [[procesos-estocasticos]]
