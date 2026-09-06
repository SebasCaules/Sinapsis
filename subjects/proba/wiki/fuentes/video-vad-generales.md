---
titulo: "Video — VAD Generales"
resumen: "Clase en video de Lucio Pantazis (unidad 3) que recorre en vivo la teoría de variables aleatorias discretas sobre un ejemplo de urna: recorrido, probabilidad puntual, acumulada, esperanza, varianza, simetría y curtosis."
tipo: fuente
formato: video
unidad: 3
url: "https://youtu.be/UzGy3b1hhFA"
duracion: "61:41"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — VAD Generales

**Qué es:** clase grabada de Lucio Pantazis que presenta en vivo (con cursor
sobre las slides) la misma presentación teórica ya resumida en
[[va-discretas-introduccion]], usando un ejemplo de urna con 6 bolitas verdes y
4 azules (la fuente en PDF usa celestes/blancas, pero la estructura numérica —
6 y 4 bolitas, 4 extracciones con reposición — es idéntica).
**Cubre:** variable aleatoria discreta (definición formal), recorrido, función
de probabilidad puntual (PMF), función de distribución acumulada (FDA),
esperanza, varianza, simetría y curtosis.
**Guía asociada:** Guía 3.

> Nota metodológica: como esta clase reproduce en video el mismo deck que
> [[va-discretas-introduccion]], gran parte de la teoría ya está documentada en
> el wiki (en [[variable-aleatoria]], [[esperanza]], [[varianza]] y
> [[funcion-de-distribucion-acumulada]]). Esta página se concentra en lo que el
> video agrega sobre esa base: el razonamiento paso a paso en vivo, las
> advertencias explícitas del docente y los énfasis que no están recogidos
> literalmente en las páginas de concepto.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:05] | Introducción: hoy se define un número asociado a un experimento en vez de solo eventos → variables aleatorias discretas |
| [00:49] | Ejemplo motivador: urna con 6 bolitas verdes y 4 azules, 4 extracciones con reposición |
| [02:38] | Se definen los eventos $D_k$ = "hay exactamente $k$ bolitas verdes"; recorrido $\{0,1,2,3,4\}$ |
| [04:31] | Cálculo manual de $P(D_0)=16/625$ y $P(D_1)=96/625$ por independencia y mutua exclusión |
| [08:18] | Cálculo de $P(D_2)=216/625$ (el más trabajoso: 6 combinaciones) |
| [11:03] | Cálculo de $P(D_3)=216/625$ y $P(D_4)=81/625$; se generaliza a $\binom{4}{k}(3/5)^k(2/5)^{4-k}$ |
| [15:27] | Los $D_k$ forman una partición del espacio muestral; se verifica que las probabilidades suman 1 |
| [18:36] | Paso de "definir eventos $D_k$" a "definir la variable aleatoria $D$" |
| [19:04] | Definición formal de variable aleatoria como función $\mathcal{S}\mapsto\mathbb{R}$; recorrido discreto |
| [24:15] | Función de probabilidad puntual $p_X$: función real vs. probabilidad de un evento (distinción que el docente marca como "lo más costoso" de esta parte) |
| [27:35] | Simulación de 1000 repeticiones del experimento; frecuencia relativa vs. probabilidad |
| [30:52] | Función de distribución acumulada (FDA): definición, monotonía, escalonada, continua a derecha |
| [40:23] | Esperanza / valor esperado: definición y advertencia sobre la notación $\mu$ vs. $\bar{x}$ |
| [47:09] | Esperanza de una función de la v.a.: $E[g(X)]$, caso particular $E[X^2]$ |
| [51:32] | Varianza y desvío: definición, fórmula de cálculo $V(X)=E[X^2]-(E[X])^2$, propiedades |
| [57:34] | Simetría y curtosis de una variable aleatoria (mención breve) |
| [59:12] | Cierre: ventaja de definir una variable aleatoria en vez de una serie de eventos |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos.** El video no resuelve un ejercicio nuevo respecto de
  [[va-discretas-introduccion]] (es la misma slide, con verde/azul en vez de
  celeste/blanco), pero SÍ desarrolla en vivo, paso a paso, el razonamiento
  combinatorio completo detrás de la fórmula $P(D_k)=\binom{4}{k}p^kq^{4-k}$
  ([04:31]–[13:01]): primero cuenta a mano las combinaciones mutuamente
  excluyentes para $k=0,1,2$, después invierte el argumento para $k=3$
  (pensar en qué extracción cae la única azul, [11:29]) y remata con $k=4$. Esa cadena de
  razonamiento (mutua exclusión → suma; independencia → producto; conteo de
  combinaciones → coeficiente binomial) está resumida en una sola línea en
  [[va-discretas-introduccion]] y no se reproduce ahí paso a paso — ver el
  ejercicio resuelto más abajo.
- **(b) Intuiciones.** El docente distingue explícitamente **antes** del
  experimento (probabilidad, letra griega $\mu$) de **después** de repetirlo
  muchas veces (estadística, letra latina $\bar{x}$) como la razón conceptual
  de por qué se usan alfabetos distintos ([42:39]–[44:30]). Esta distinción
  "antes/después" no está explicitada así en [[esperanza]] ni en
  [[variable-aleatoria]] (que solo mencionan la notación $\mu_X$ sin justificar
  por qué no usar $\bar{x}$) — ver aporte propuesto para [[esperanza]].
- **(c) Advertencias** — ver sección dedicada abajo.
- **(d) Énfasis.** El docente remarca cuatro veces seguidas ("importantísimo,
  importantísimo, importantísimo, importantísimo", [38:08]) que la FDA, poco útil en esta guía,
  va a ser central en la unidad siguiente (probabilidad continua). También
  señala que diferenciar $p_X(k)$ (función que toma un **número** y devuelve
  una probabilidad) de $P(\text{evento})$ (que toma un **evento**) es "lo más
  costoso de esta parte de la materia" ([25:19]–[26:11]) — ambas funciones ya
  están definidas por separado en [[variable-aleatoria]], pero el video pone el
  foco pedagógico específicamente en no confundirlas.

## Ejercicio resuelto en clase

**Enunciado** ([00:49]–[13:01], slides "Experimento"/"Eventos $D_k$"/"Cálculo de
probabilidades"). Una urna tiene 6 bolitas verdes y 4 azules. Se realizan 4
extracciones con reposición. Sea $D_k$ el evento "entre las 4 extracciones hay
exactamente $k$ bolitas verdes". Calcular $P(D_k)$ para $k=0,1,2,3,4$.

**Planteo.** Sea $V_i$ = "la $i$-ésima extracción es una bolita verde"
($1\le i\le 4$). Como hay reposición, los $V_i$ son independientes y, por la
[[regla-de-laplace|regla de Laplace]]:
$$ P(V_i) = \frac{6}{6+4} = \frac35, \qquad P(\overline{V_i}) = 1 - \frac35 = \frac25. $$
Como mínimo pueden salir 0 verdes (todas azules) y como máximo 4 (todas
verdes), así que el recorrido es $k\in\{0,1,2,3,4\}$. Cada $D_k$ se descompone
en tantos sucesos mutuamente excluyentes como formas hay de elegir en cuáles de
las 4 extracciones cae la bolita verde, y por independencia cada suceso
factoriza como producto de probabilidades.

**Cálculo.**

- $k=0$ (ninguna verde, una sola combinación):
$$ P(D_0) = P(\overline{V_1}\cap\overline{V_2}\cap\overline{V_3}\cap\overline{V_4})
  \overset{\text{IND}}{=} \left(\frac25\right)^4 = \frac{16}{625}. $$

- $k=1$ (una verde, 4 combinaciones — cuál extracción es la verde):
$$ P(D_1) = 4\cdot\frac35\cdot\left(\frac25\right)^3 = \frac{96}{625}. $$

- $k=2$ (dos verdes, 6 combinaciones — el docente las enumera todas a mano
  antes de generalizar):
$$ P(D_2) = 6\cdot\left(\frac35\right)^2\left(\frac25\right)^2 = \frac{216}{625}. $$

- $k=3$ (tres verdes; se invierte el razonamiento: hay que decidir en qué
  extracción cae la única azul, 4 combinaciones):
$$ P(D_3) = 4\cdot\frac25\cdot\left(\frac35\right)^3 = \frac{216}{625}. $$

- $k=4$ (todas verdes, una sola combinación):
$$ P(D_4) = \left(\frac35\right)^4 = \frac{81}{625}. $$

El patrón se generaliza (y se verifica) como
$$ P(D_k) = \binom{4}{k}\left(\frac35\right)^k\left(\frac25\right)^{4-k}, \qquad 0\le k\le 4, $$
y se comprueba la normalización:
$$ \frac{16}{625}+\frac{96}{625}+\frac{216}{625}+\frac{216}{625}+\frac{81}{625} = 1. $$

**Resultado.** $P(D_0)=\tfrac{16}{625}$, $P(D_1)=\tfrac{96}{625}$,
$P(D_2)=\tfrac{216}{625}$, $P(D_3)=\tfrac{216}{625}$, $P(D_4)=\tfrac{81}{625}$.
Redefiniendo $D$ = "cantidad de bolitas verdes en las 4 extracciones" como
variable aleatoria, esto es exactamente su [[variable-aleatoria|PMF]]
$p_D(k)=P(D_k)$, y anticipa la fórmula de la [[distribucion-binomial|binomial]]
$\text{Binomial}(4, 3/5)$ que se formaliza más adelante en la unidad.

Con esa PMF, en [40:23]–[47:00] y [51:32]–[57:00] el docente calcula además,
sobre esta misma variable $D$: $E[D]=2{,}4$ (comparándolo con el promedio
muestral $\bar{x}_{Ag}=2{,}447$ de una simulación de 1000 repeticiones) y
$V(D)=0{,}96$, $\sigma(D)\approx 0{,}98$ — aplicación directa de las fórmulas
generales ya documentadas en [[esperanza]] y [[varianza]].

## Advertencias del docente

- **No confundir $\mu$ (parámetro, "antes" del experimento) con $\bar{x}$
  (estadístico muestral, "después" de repetirlo)**: "muchos usan el [$\mu$]
  para referirse a una media de estadística descriptiva y está mal porque no
  están entendiendo conceptualmente qué está pasando" [42:53]–[43:04]; "si
  ustedes confunden las letras es porque están teniendo un error conceptual"
  [43:46]–[43:54].
- **$E[XY]\ne E[X]\cdot E[Y]$ en general**: "no lo hagan, no lo hagan, salvo
  que sepan por qué" [46:36]–[46:47] (ya documentado como advertencia en
  [[esperanza]]).
- **$V(X+Y)\ne V(X)+V(Y)$ en general**: "ojo con esto porque tengan mucho mucho
  cuidado, no lo hagan" [57:13]–[57:25] (ya documentado como advertencia en
  [[varianza]]).
- **$E[X^2]\ne (E[X])^2$**: remarca que son "cualitativamente cosas distintas"
  porque una es la esperanza de una variable elevada al cuadrado y la otra es
  un número (la esperanza) elevado al cuadrado [54:24]–[54:46].
- **La FDA, aunque poco útil en esta guía, será clave en la próxima unidad**
  (probabilidad continua): "va a ser muy importante esta función de
  distribución [...] importantísimo, importantísimo, importantísimo,
  importantísimo" [37:59]–[38:13] — señal de que conviene afianzarla ahora aunque en la Guía 3
  no se explote a fondo.

## Páginas del wiki que toca

- [[variable-aleatoria]]
- [[esperanza]]
- [[varianza]]
- [[funcion-de-distribucion-acumulada]]
- [[distribucion-binomial]]
- [[regla-de-laplace]]
- [[reconocer-distribucion-discreta]]
