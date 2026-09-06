---
titulo: "Video — Funciones de Variables Aleatorias"
resumen: "Clase en video de Lucio Pantazis (unidades 4 y 5) sobre la distribución de $Y=g(X)$: transformación de continua a discreta por tramos, caso no monótono resuelto con Bhaskara y un apéndice de simulación por inversa generalizada."
tipo: fuente
formato: video
unidad: 5
url: "https://youtu.be/z9bDNyto31U"
duracion: "59:26"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Funciones de Variables Aleatorias

**Qué es:** clase teórico-práctica del Dr. Lucio Pantazis sobre "Vínculos entre variables",
centrada en cómo obtener la distribución de $Y=g(X)$ a partir de la distribución conocida de $X$.
**Cubre:** transformación continua→discreta (descuento por tramos), continua→continua por tramos
(no monótona, con búsqueda de raíces), y un apéndice sobre simulación por inversa generalizada.
**Guía asociada:** Guía 4 - Guía 5.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:05] | Introducción: esta guía es en gran parte una aplicación de lo ya visto (guía 3) a "vínculos entre variables" |
| [00:53] | Caso 1: gasto $G\sim N(75,15)$ (miles de pesos) de un supermercado y esquema de descuento $D$ por tramos de gasto; por qué $D$ resulta discreta |
| [04:56] | Cálculo de $P(D=k)$ estandarizando $G$ y usando tabla normal; luego $E[D]$, $\text{Var}(D)$ (repaso de guía 3) |
| [09:11] | Nueva variable $GD$ = "gasto con descuento" (continua→continua por tramos), planteo con probabilidad total |
| [18:37] | Densidad de $GD$ como combinación de las densidades de cada tramo (regla de la cadena) |
| [19:56] | Cálculo de $E[GD]$ reutilizando $E[G]$ ya conocido en vez de resolver cuatro integrales nuevas; interpretación de negocio (pérdida promedio) |
| [25:53] | Caso 2: distancia $X\sim U(0,5)$ km y gasto promedio $GP=8X^2-40X+100$ (transformación **no monótona**) |
| [31:19]–[38:45] | Búsqueda de $F_{GP}(t)$ con la fórmula de Bhaskara; argumento de discriminante negativo + teorema de Bolzano para justificar $F_{GP}(t)=0$ cuando $t<50$ |
| [43:20] | Densidad de $GP$ por derivación; cálculo de $E[GP]$, $\text{Var}(GP)$ |
| [45:39] | Síntesis: qué agrega esta guía (usar las probabilidades de $X$ para las probabilidades de $Y$, no solo el valor esperado); clasificación discreta/continua de $Y=g(X)$ |
| [49:03] | Segundo método para $E[GP]$ vía $E[X]$, $E[X^2]$ — comparación de estrategias de cálculo |
| [51:05] | Apéndice: simulación por inversa generalizada, caso continuo (reutiliza $GP$), verificación gráfica con histogramas |
| [56:50] | Apéndice: inversa generalizada para variables discretas, ejemplo con hipergeométrica $H(10,4,2)$ |

## Qué aporta sobre el apunte

- **(a) Ejemplo — transformación no monótona con Bhaskara.** El apunte
  ([[teorica-funcion-de-variable-aleatoria]], resumido en [[tecnica-distribucion-de-una-funcion-de-va]])
  ya cubre el caso no inyectivo con $Y=X^2$ (preimagen simétrica $\pm\sqrt{y}$). El video agrega una
  variante con una parábola genérica $GP=8X^2-40X+100$ (vértice fuera del origen), donde las dos
  raíces se obtienen con la fórmula de Bhaskara y dependen de $t$ de forma más laboriosa. Ver el
  ejercicio resuelto abajo.
- **(a) Ejemplo — transformación continua→discreta con probabilidad total.** El caso del descuento
  ($G$ continua se clasifica en $D\in\{0,5,15,25\}$ por tramos) es una instancia concreta del atajo
  "$g$ escalonada" que [[tecnica-distribucion-de-una-funcion-de-va]] ya menciona en abstracto; el
  video lo resuelve con números (normal con tabla) y extiende el mismo ejemplo a una versión
  continua ($GD$ = gasto con descuento), mostrando la densidad de $GD$ como combinación de las
  densidades de cada tramo.
- **(a) Ejemplo — inversa generalizada para una variable discreta.** El concepto
  [[funcion-de-variable-aleatoria]] ya menciona la inversa generalizada en abstracto (con ejemplos
  breves de Bernoulli y exponencial). El video agrega un ejemplo discreto completo, paso a paso,
  con una hipergeométrica $H(10,4,2)$: cómo los "saltos" de la acumulada se convierten directamente
  en los cortes de la función $g(U)$. Ver el ejercicio resuelto abajo.
- **(b) Intuición — dos caminos para el mismo $E[Y]$.** El docente resuelve $E[GP]$ de dos formas
  (integral directa de $g(x)f_X(x)$, y descomposición vía $E[X]$, $E[X^2]$ ya conocidos) y remarca
  explícitamente [49:03]-[51:02] que ninguna de las dos es siempre la mejor: "a veces la función me
  queda más complicada que la original, pero a veces la original me queda más complicada que la
  función [...] no tengan una única forma de hacerlo". Es una estrategia de examen que no está
  como tal en el apunte.
- **(c)/(d) Advertencia + énfasis — la intuición hay que respaldarla matemáticamente.** En el
  tramo $t<50$ de $F_{GP}$, el docente primero da una intuición visual —el gasto promedio mínimo es
  50, así que por debajo de ese valor no se acumula nada [31:26]— y aclara enseguida que eso igual
  hay que verlo matemáticamente [31:39]; después lo demuestra formalmente con el signo del
  discriminante y el teorema de Bolzano [33:53]-[34:56], cerrando con la frase textual: *"la
  intuición hay que respaldarla siempre"* [43:35].
- **(d) Énfasis — qué es "lo nuevo" de esta guía.** Ya al abrir la clase el docente advierte que
  muchas cosas *"medio que ya estaban dadas"* y se podían deducir de lo ya visto [00:11], y al
  llegar a $E[D]$ remite el cálculo a la guía 3 [07:51]. Al cerrar aclara explícitamente
  [46:55]-[47:07] que *"esto es lo nuevo"*: usar la distribución de $X$ para obtener
  **probabilidades** de $Y=g(X)$ (no solo su esperanza), es decir, la
  [[funcion-de-distribucion-acumulada|FDA]] completa de la nueva variable.

## Ejercicio resuelto en clase

### 1. Transformación no monótona: distancia → gasto promedio [25:53]

**Enunciado (según el video).** La distancia $X$ (en km) de un cliente elegido al azar al
supermercado es $X\sim U(0,5)$. El gasto promedio de los clientes a distancia $x$ es
$$ GP = g(X) = 8X^2 - 40X + 100 \quad \text{(miles de pesos)}. $$
Hallar $F_{GP}(t)$, su densidad, y $E[GP]$.

**Planteo.** $g$ es una parábola con coeficiente principal positivo y vértice en $x=5/2$ (dentro del
soporte $(0,5)$), donde $g(5/2)=50$; en los extremos $g(0)=g(5)=100$. Por lo tanto $g$ **no es
monótona** en $(0,5)$: a cada valor de $GP$ (salvo el mínimo) le corresponden dos valores de $X$.
El recorrido de $GP$ es $[50,100]$.

Para $t\in[50,100]$, se busca $x$ tal que $8x^2-40x+100=t$, es decir
$8x^2-40x+(100-t)=0$. Por Bhaskara:
$$ x = \frac{40\pm\sqrt{1600-32(100-t)}}{16} = \frac{40\pm\sqrt{32t-1600}}{16} = \frac{5}{2}\pm\frac{\sqrt{2t-100}}{4}. $$
Llamando $x_1=\tfrac{5}{2}-\tfrac{\sqrt{2t-100}}{4}$ y $x_2=\tfrac{5}{2}+\tfrac{\sqrt{2t-100}}{4}$
(las dos raíces, simétricas respecto del vértice), el evento $\{GP\le t\}$ equivale a $\{x_1\le X\le x_2\}$
(la parábola "abre hacia arriba", así que está por debajo de $t$ **entre** las raíces).

**Caso $t<50$.** El discriminante $32t-1600$ es negativo, la parábola $8x^2-40x+(100-t)$ no tiene
raíces reales y, como su coeficiente principal es positivo, nunca puede cambiar de signo (si lo
hiciera, por el teorema de Bolzano tendría una raíz). Como en $x=0$ vale $100-t>0$, la parábola es
siempre positiva, es decir $g(x)>t$ para todo $x$: el evento $\{GP\le t\}$ es vacío y $F_{GP}(t)=0$.

**Caso $50\le t\le 100$.** Verificando que $x_1,x_2\in[0,5]$ en este rango (el límite $t=100$ es
exactamente cuando $x_2=5$ y $x_1=0$), y usando que $X\sim U(0,5)$ tiene $F_X(x)=x/5$:
$$ F_{GP}(t) = F_X(x_2)-F_X(x_1) = \frac{x_2-x_1}{5} = \frac{1}{5}\cdot\frac{2\cdot\frac{\sqrt{2t-100}}{4}}{1} = \frac{\sqrt{2t-100}}{10}. $$

**Caso $t>100$.** $x_2>5$ y $x_1<0$ (fuera del soporte de $X$), por lo que $F_X$ satura en $1$ y
$0$ respectivamente y $F_{GP}(t)=1$.

**Resultado (distribución).**
$$ F_{GP}(t)=\begin{cases} 0 & t<50 \\[4pt] \dfrac{\sqrt{2t-100}}{10} & 50\le t\le 100 \\[6pt] 1 & t>100 \end{cases} $$

**Densidad.** Derivando el tramo intermedio:
$$ f_{GP}(t) = \frac{1}{10\sqrt{2t-100}}, \qquad 50<t<100. $$

**Valor esperado (dos métodos).** Integrando directamente $g(x)$ contra $f_X(x)=1/5$:
$$ E[GP] = \int_0^5 (8x^2-40x+100)\cdot\frac{1}{5}\,dx = \frac{1}{5}\left[\frac{8x^3}{3}-20x^2+100x\right]_0^5 = \frac{200}{3}\approx 66{,}67. $$
Alternativamente, sin integrar de nuevo, usando $E[X]=5/2$ y $E[X^2]=\text{Var}(X)+E[X]^2=\tfrac{25}{12}+\tfrac{25}{4}=\tfrac{25}{3}$:
$$ E[GP]=8\,E[X^2]-40\,E[X]+100 = 8\cdot\frac{25}{3}-40\cdot\frac{5}{2}+100=\frac{200}{3}. $$
Ambos métodos coinciden ($200/3\approx66{,}67$ miles de pesos).

### 2. Simulación por inversa generalizada — caso discreto [56:50]

**Enunciado (apéndice, imagen del docente).** Simular datos con distribución
$X\sim \mathcal{H}(10,4,2)$ (hipergeométrica) a partir de una uniforme $U\sim U(0,1)$.

**Planteo.** $R_X=\{0,1,2\}$, con probabilidades puntuales
$$ P(X=0)=\frac{\binom{6}{2}}{\binom{10}{2}}=\frac{1}{3},\quad P(X=1)=\frac{\binom{4}{1}\binom{6}{1}}{\binom{10}{2}}=\frac{8}{15},\quad P(X=2)=\frac{\binom{4}{2}}{\binom{10}{2}}=\frac{2}{15}. $$
Como $X$ es discreta, su acumulada $F_X$ da "saltos" y no es invertible en el sentido estricto; la
**inversa generalizada** usa la ubicación de esos saltos:
$$ F_X(t)=\begin{cases} 0 & t<0 \\ 1/3 & 0\le t<1 \\ 13/15 & 1\le t<2 \\ 1 & t\ge 2 \end{cases} $$

**Construcción de $g$.** Los tramos de la acumulada indican en qué rango de $U(0,1)$ cae cada
valor de $X$:
$$ g(U)=\begin{cases} 0 & 0\le U< 1/3 \\ 1 & 1/3\le U< 13/15 \\ 2 & 13/15\le U< 1 \end{cases} $$

**Resultado.** Si $U\sim U(0,1)$, entonces $g(U)$ tiene la misma distribución que $X\sim
\mathcal{H}(10,4,2)$. El docente lo verifica generando muchos datos con $g(U)$ y comparando las
frecuencias relativas obtenidas contra $1/3$, $8/15$, $2/15$: coinciden casi exactamente. La misma
idea, en el caso continuo, se aplicó antes a $GP$: si $F_{GP}(t)=y$, despejando $t$ se obtiene
$t=50y^2+50$, por lo que $g(U)=50U^2+50$ tiene la misma distribución que $GP$.

## Advertencias del docente

- **"La intuición hay que respaldarla siempre"** [43:35] — al calcular $F_{GP}(t)$ para $t<50$, no
  alcanza con la intuición de que da cero porque no se llega a ese gasto promedio mínimo [31:26];
  hay que probarlo formalmente (aquí, con el signo del discriminante y el teorema de Bolzano
  [33:53]-[34:56]).
- **No hay una única forma de calcular $E[Y]$** [50:21]-[51:02] — conviene tener varias estrategias
  disponibles (integral directa vs. reutilizar momentos ya conocidos de $X$), porque cuál es más
  simple depende del ejercicio: "a veces la función me queda más complicada que la original, pero a
  veces la original me queda más complicada que la función".
- **Guía mayormente aplicada, no nueva teoría** [00:11], [07:51], [46:55] — el docente aclara que buena
  parte de las cuentas ya se sabían hacer desde la guía 3 (valor esperado de $g(X)$); lo nuevo es
  obtener la **distribución completa** (probabilidades) de $Y=g(X)$, no solo su esperanza.

## Páginas del wiki que toca

- [[funcion-de-variable-aleatoria]]
- [[tecnica-distribucion-de-una-funcion-de-va]]
- [[mezcla-de-distribuciones]]
- [[variables-aleatorias-bidimensionales]]
- [[esperanza-condicional]]
