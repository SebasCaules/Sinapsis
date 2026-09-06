---
titulo: "Video — Axiomas"
resumen: "Clase en video de Lucio Pantazis (unidad 2) sobre espacio muestral, álgebra de sucesos y los tres axiomas de Kolmogorov: los justifica desde la frecuencia relativa y deriva todas sus consecuencias con un único ejemplo numérico."
tipo: fuente
formato: video
unidad: 2
url: "https://youtu.be/fN2jz-P7sjg"
duracion: "54:04"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Axiomas

**Qué es:** clase teórica en video de Lucio Pantazis sobre espacio muestral, sucesos
y los axiomas de Kolmogorov, con un ejemplo numérico único que se usa a lo largo de
toda la clase.
**Cubre:** experimento aleatorio, espacio muestral, álgebra de sucesos (complemento,
unión), sucesos mutuamente excluyentes, De Morgan, frecuencia relativa como
fundamento intuitivo de la probabilidad, y los tres axiomas de Kolmogorov con todas
sus consecuencias (vacío, complemento, monotonía, resta inclusiva/no inclusiva,
unión).
**Guía asociada:** Guía 2.

## Recorrido de la clase
| Timestamp | Tema |
|---|---|
| [00:05] | Motivación: experimento aleatorio con un mazo de cartas (extracción con reposición) |
| [03:58] | Espacio muestral $S$: árbol de dos extracciones y descripción por comprensión, $S=\{(i,j)\in\mathbb{N}^2 : 1\le i,j\le 5\}$ |
| [07:40] | Definición de los sucesos $A$, $B$, $C$ como subconjuntos de $S$ (el ejemplo que recorre toda la clase) |
| [12:04] | Álgebra de sucesos: complemento y sucesos mutuamente excluyentes |
| [17:17] | Álgebra de sucesos: unión |
| [19:38] | Repaso de las Leyes de De Morgan con diagramas de Venn |
| [22:45] | Frecuencia: por qué hace falta repetir el experimento para "medir" la chance de un suceso |
| [25:13] | Simulación de $n=50$ repeticiones "imaginarias" y conteo de ocurrencias de $A$, $B$, $C$ |
| [27:46] | Frecuencia relativa $f_A, f_B, f_C$ |
| [29:10] | Tabla de convergencia de la frecuencia relativa para $n=50,100,\dots,10000$ |
| [33:12] | Axiomas de Kolmogorov, justificados uno a uno a partir de la frecuencia relativa |
| [38:18] | Propiedad derivada: $P(\emptyset)=0$ (demostración) |
| [40:11] | Propiedad derivada: complemento $P(\overline{A})=1-P(A)$, demostración y ejemplo numérico |
| [43:17] | Advertencia de notación: los conjuntos se unen, los números (probabilidades) se suman/restan |
| [45:03]–[53:31] | Propiedades derivadas: monotonía, resta inclusiva, resta no inclusiva y unión (inclusión-exclusión), cada una demostrada y ejemplificada con los datos numéricos de $A,B,C$ |

## Qué aporta sobre el apunte
- **(b) Intuición no escrita en el apunte — fundamento frecuentista de los axiomas.**
  Antes de enunciar los axiomas, el docente construye una simulación mental: define
  $A,B,C$ sobre el experimento de dos extracciones con reposición, cuenta cuántas
  veces ocurre cada uno en $n=50$ repeticiones "imaginarias", calcula la
  **frecuencia relativa** $f_A=n_A/n$ y muestra una tabla de $n=50$ hasta $n=10000$
  donde $f_A\to 0.2$, $f_B\to 0.48$, $f_C\to 0.64$. Solo entonces define
  $P(A):=\lim_{n\to\infty} f_A$ y justifica cada axioma de Kolmogorov como una
  propiedad que ya cumple la frecuencia relativa (p. ej. $f_{A\cup B}=f_A+f_B$
  cuando $A,B$ son m.e., porque cada repetición cuenta para como máximo uno de los
  dos). El apunte [[axiomas-probabilidad]] presenta los tres axiomas directamente
  sin este puente frecuentista; ver [[axiomas-de-probabilidad]] para la versión ya
  escrita del wiki, que solo tiene la intuición de "área total = 1".
- **(a) Ejemplo numérico único usado para TODAS las consecuencias de los axiomas.**
  A diferencia del apunte —que ejemplifica cada propiedad con un enunciado
  distinto—, esta clase reutiliza un solo conjunto de datos ($P(A)=0.2$,
  $P(B)=0.48$, $P(C)=0.64$, $P(A\cap C)=0.08$, $P(B\cap C)=0.32$, $A,B$ mutuamente
  excluyentes) para calcular, en secuencia, el vacío, el complemento, la
  monotonía, la resta inclusiva, la resta no inclusiva y la unión. Queda
  reproducido completo en la sección de abajo.
- **(c) Advertencias del docente** — ver sección dedicada.
- **(d) Énfasis: unos 15 minutos (38:38–53:57) dedicados solo a demostrar, una por
  una y con diagrama de Venn, las consecuencias de los axiomas** que en
  [[axiomas-de-probabilidad]] aparecen enunciadas de forma más compacta (el wiki
  solo desarrolla la demostración de $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ a partir de
  m.e.; el video demuestra además $P(\emptyset)=0$, la monotonía y ambas restas de
  conjuntos, cada una con su propio diagrama).

## Ejercicio resuelto en clase
*(Ejemplo continuo, [07:40]–[53:31].)*

**Enunciado.** Se extraen dos cartas numeradas de $1$ a $5$, con reposición (se
anota el número y la carta se vuelve a meter en el mazo antes de la segunda
extracción). El espacio muestral es
$$ S = \{(i,j)\in\mathbb{N}^2 : 1\le i,j\le 5\}, \qquad |S|=25. $$
Se definen los sucesos
- $A=$ "los números extraídos son iguales" ($|A|=5$),
- $B=$ "los números extraídos suman un número impar",
- $C=$ "el máximo número obtenido es por lo menos $4$" ($|C|=16$).

Mediante una simulación de $n=10000$ repeticiones del experimento (frecuencia
relativa $\to$ probabilidad, ver [[axiomas-de-probabilidad]]) se estiman:
$$ P(A)=0.2,\quad P(B)=0.48,\quad P(C)=0.64,\quad P(A\cap C)=0.08,\quad P(B\cap C)=0.32, $$
y, como $A$ y $B$ son mutuamente excluyentes (si los números son iguales su suma es
par, luego $A\subseteq\overline{B}$, es decir $A\cap B=\emptyset$;
la implicación recíproca no vale: hay sumas pares con números distintos, p. ej.
$(i,j)=(1,3)$), $P(A\cap B)=0$.

**Planteo.** Se pide aplicar, sobre estos datos, cada una de las consecuencias de
los axiomas de Kolmogorov (ver [[axiomas-de-probabilidad]] para las demostraciones
generales).

**Cálculo.**

1. *Complemento* $P(\overline{X})=1-P(X)$:
$$ P(\overline{A})=1-0.2=0.8,\qquad P(\overline{B})=1-0.48=0.52,\qquad P(\overline{C})=1-0.64=0.36. $$
($\overline{B}$ es "la suma de los números extraídos es par"; $\overline{C}$ es "el
máximo número obtenido es menor a 4".)

2. *Monotonía* $X\subseteq Y \Rightarrow P(X)\le P(Y)$: como $A$ y $B$ son m.e.,
   $A\subseteq \overline{B}$, y en efecto
$$ P(\overline{B})=0.52 \ge P(A)=0.2. $$

3. *Resta inclusiva* $X\subseteq Y \Rightarrow P(Y\setminus X)=P(Y)-P(X)$, aplicada
   con $X=A\subseteq Y=\overline{B}$:
$$ P(\overline{B}\setminus A) = P(\overline{B})-P(A) = 0.52-0.2 = 0.32. $$

4. *Resta no inclusiva* (sin relación de inclusión) $P(X\setminus Y)=P(X)-P(X\cap Y)$:
$$ P(A\setminus C)=P(A)-P(A\cap C)=0.2-0.08=0.12, \qquad P(C\setminus A)=P(C)-P(A\cap C)=0.64-0.08=0.56, $$
$$ P(B\setminus C)=P(B)-P(B\cap C)=0.48-0.32=0.16, \qquad P(C\setminus B)=P(C)-P(B\cap C)=0.64-0.32=0.32. $$

5. *Unión* (inclusión-exclusión) $P(X\cup Y)=P(X)+P(Y)-P(X\cap Y)$:
$$ P(A\cup C)=0.2+0.64-0.08=0.76, \qquad P(B\cup C)=0.48+0.64-0.32=0.8, $$
y, al ser $A,B$ mutuamente excluyentes, $P(A\cup B)=P(A)+P(B)=0.2+0.48=0.68$.

**Resultado.** Un mismo conjunto de datos numéricos alcanza para ilustrar las seis
consecuencias de los axiomas: $P(\overline{A})=0.8$, $P(\overline{B})=0.52$,
$P(\overline{C})=0.36$; monotonía $P(A)\le P(\overline{B})$; restas
$P(\overline{B}\setminus A)=0.32$, $P(A\setminus C)=0.12$, $P(C\setminus A)=0.56$,
$P(B\setminus C)=0.16$, $P(C\setminus B)=0.32$; y uniones $P(A\cup C)=0.76$,
$P(B\cup C)=0.8$, $P(A\cup B)=0.68$.

## Advertencias del docente
- **[43:17]–[44:31] — Notación: no confundir "unir" con "sumar".** Los **sucesos**
  (conjuntos) se unen con $\cup$; las **probabilidades** (números) se suman o
  restan. Escribir la unión dentro del argumento de $P(\cdot)$ y no fuera
  ($P(A\cup B)$, nunca $P(A)\cup P(B)$ ni $P(A)+B$) — el docente lo marca como un
  error "recontragrave" porque delata no entender qué tipo de objeto es cada cosa.
- **[48:14] — "Ojo, ojo, ojo, ojo":** la fórmula de resta inclusiva
  $P(A\setminus B)=P(A)-P(B)$ **solo vale si $B\subseteq A$**. Si $B$ no está
  incluido en $A$, usarla da un resultado mal calculado; en ese caso corresponde la
  resta no inclusiva $P(A\setminus B)=P(A)-P(A\cap B)$.

## Páginas del wiki que toca
- [[axiomas-de-probabilidad]]
- [[espacio-muestral-y-eventos]]
- [[leyes-de-de-morgan]]
- [[probabilidad]]
