---
titulo: "Video — Condicional"
resumen: 'Clase en video de Lucio Pantazis (unidad 2) que deriva la probabilidad condicional restringiendo casos desde la frecuencia relativa hasta $P(A\mid B)=P(A\cap B)/P(B)$, con la regla de la multiplicación y el error de invertir el condicionante.'
tipo: fuente
formato: video
unidad: 2
url: "https://youtu.be/_yGFNVvARkA"
duracion: "22:40"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Condicional

**Qué es:** clase del Dr. Lucio Pantazis que construye la probabilidad condicional
desde cero, partiendo de la frecuencia relativa de un experimento repetido y
"restringiendo los casos", antes de llegar a la definición formal.
**Cubre:** motivación frecuentista de $P(A\mid B)$, definición formal y regla de la
multiplicación, un ejemplo completo de extracción de cartas (con diagrama de árbol),
la prueba de que $P(\cdot\mid B)$ cumple los axiomas de Kolmogorov y sus propiedades
derivadas, y una advertencia sobre un error común de cátedra.
**Guía asociada:** Guía 2.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Motivación: retoma el experimento de extraer 2 cartas sin reposición de un mazo de 5 de [[video-laplace]] y propone repetirlo muchas veces (simulación, $n=50$) para ver con qué frecuencia ocurren los eventos $B=$ "la suma de los números extraídos es impar" y $C=$ "el máximo extraído es al menos 4" — los mismos $B$ y $C$ del esquema **sin reposición con orden** de [[video-laplace]]. |
| [01:32] | "Restricción de casos": al saber que $C$ ya ocurrió, los casos totales dejan de ser los 50 originales y pasan a ser los 32 en que $C$ ocurrió; la frecuencia de $B$ dentro de esos 32 da $19/32\approx 0.59$. |
| [05:39] | Generalización $n\to\infty$: ese cociente se reescribe como $\dfrac{n_{B\cap C}/n}{n_C/n}$ y converge a $P(B\cap C)/P(C)$; en la slide calcula $P(B\cap C)/P(C)=(7/20)/(7/10)=1/2$ y muestra una tabla de simulación ($n=50$ hasta $10^5$) como verificación, y remarca que $P(B\mid C)<P(B)$. |
| [08:18] | Definición formal: $P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}$ con $P(B)>0$; distingue explícitamente "probabilidad de la intersección" (no restringe casos totales) de "probabilidad condicional" (sí los restringe); regla de la multiplicación $P(A\cap B)=P(A\mid B)P(B)=P(B\mid A)P(A)$. |
| [11:04] | Retoma el ejemplo de las 2 cartas: define $B_1$ = "la primera extracción es impar", $B_2$ = "la segunda es impar"; calcula por conteo directo $P(B_2\mid B_1)=2/4=1/2$ y $P(B_2\mid B_1^c)=3/4$. |
| [12:52] | Diagrama de Venn de $B_2$ partido en $(B_1\cap B_2)\cup(B_1^c\cap B_2)$, mutuamente excluyentes. |
| [14:36] | Resume las ramas del experimento en un diagrama por etapas (primera y segunda extracción) para no perder de vista qué depende de qué. |
| [17:49] | Muestra la "agilidad" de la condicional: en vez de contar casos de la intersección, calcula $P(B_2)=P(B_1)P(B_2\mid B_1)+P(B_1^c)P(B_2\mid B_1^c)$ leyendo directamente las ramas del árbol. |
| [18:44] | Afirma y demuestra que, con $B$ fijo, $P(\cdot\mid B)$ cumple los tres axiomas de Kolmogorov (no negatividad, $P(S\mid B)=1$, aditividad para eventos m.e.). |
| [20:55] | De esos tres axiomas derivan todas las propiedades ya conocidas (vacío, complemento, monotonía, restas, unión) — pero **todas valen solo mientras $B$ se mantenga fijo**. |
| [21:24] | Advertencia central de la clase: error común de "dar vuelta" el condicionante al aplicar la regla del complemento — marcado como **mal, mal, mal**. |
| [22:00] | Explica la causa: $P(A\mid B)$ y $P(A\mid B^c)$ restringen a conjuntos de casos totales distintos, así que no hay razón para que sean complementarios entre sí. |
| [22:33] | Cierra el tema mostrando el título "Independencia" como próximo punto del programa, pero aclara que lo va a desarrollar en **otro video** — en este video no se llega a dar. |

## Qué aporta sobre el apunte

La definición $P(A\mid B)=P(A\cap B)/P(B)$, la regla de la multiplicación y la
relación con [[independencia]] ya están en [[probabilidad-condicional]] (de
[[independencia-condicional-bayes]]). El video no repite esa definición como punto
de partida — la **deriva** y agrega:

- **(b) Intuición nueva — motivación frecuentista.** En vez de presentar la fórmula
  directamente, arranca de la frecuencia relativa de un experimento repetido 50
  veces y muestra por qué "restringir los casos totales a los que cumplen la
  condición" es exactamente lo que hace la fórmula: $P(B\mid C)\approx n_{B\cap
  C}/n_C \xrightarrow{n\to\infty} P(B\cap C)/P(C)$ (01:32-08:18). Esto no está en el
  apunte, que va directo a la definición axiomática.
  > ⚠️ Discrepancia [05:39]: la slide del docente calcula $P(B\cap C)=7/20$ y
  > concluye $P(B\mid C)=(7/20)/(7/10)=1/2$. Contando directamente sobre el
  > espacio muestral de [[video-laplace]] (pares ordenados $(i,j)$, $i\neq j$,
  > $1\le i,j\le5$): de los $12$ pares con suma impar ($B$), $8$ tienen además
  > máximo $\ge4$ ($C$) — no $7$ —, así que $P(B\cap C)=8/20=2/5$ y
  > $P(B\mid C)=(2/5)/(7/10)=4/7\approx0.571$, no $1/2$. Esto es consistente con
  > la propia tabla de simulación del docente, cuya fila $n=10\,000$ da
  > $0.5715$ (mucho más cerca de $4/7$ que de $1/2$). Parece un error de cuenta
  > en la slide, no un error de transcripción: se reporta el resultado tal como
  > lo dice la clase, con esta corrección aclarada.
- **(a) Ejemplo resuelto completo.** Retoma el ejemplo de extraer 2 cartas sin
  reposición de un mazo de 5 de [[video-laplace]] (mismo mazo, mismo esquema sin
  reposición con orden, y misma notación $B_i=$ "la $i$-ésima extracción es impar"
  que ese video usa para calcular $P(B)$) y calcula $P(B_2)$ de dos formas —
  contando casos directamente y usando la regla de la multiplicación sobre un
  diagrama por etapas — verificando que dan el mismo resultado (11:04-18:35). Ver
  detalle completo abajo.
- **(c) Advertencia marcada como error frecuente.** El error de "dar vuelta" el
  condicionante en una propiedad derivada (usar $P(A\mid B)=1-P(A\mid B^c)$) se
  señala explícitamente como algo que "lo vemos mucho" y se marca **mal, mal, mal**
  (21:24-22:09) — ver sección de advertencias abajo.
- **(d) Énfasis.** Insiste repetidas veces en que todas las propiedades derivadas de
  los axiomas de Kolmogorov (vacío, complemento, monotonía, etc.) valen **solo
  mientras el evento condicionante se mantenga fijo** (18:44, 20:55, 22:00) — es el
  punto que más tiempo dedica a remarcar en toda la clase.

## Ejercicio resuelto en clase

*(Arranca en [11:04].) Retomando el experimento sin reposición de [[video-laplace]]
(mazo de 5 cartas numeradas 1 a 5, se extraen 2, **sin reposición**). Se definen,
con la misma notación $B_i$ que usa ese video:*
$$ B_1 = \{\text{la primera extracción es impar}\}, \qquad B_2 = \{\text{la segunda extracción es impar}\}. $$
*Calcular $P(B_2)$.*

**Planteo — por qué conviene condicionar.** Contar directamente los casos
favorables a $B_2$ es incómodo porque la cantidad de cartas impares que quedan
disponibles para la segunda extracción depende de qué salió en la primera. Por
eso conviene condicionar a lo que pasó en la primera extracción:
$$ B_2 = (B_1\cap B_2)\cup(B_1^c\cap B_2), $$
con $B_1\cap B_2$ y $B_1^c\cap B_2$ mutuamente excluyentes (partición de $B_2$
según lo que ocurrió en la primera extracción).

**Cálculo de las condicionales (por conteo directo).**
- Si la primera extracción fue impar ($B_1$), quedan 4 cartas, de las cuales 2 son
  impares:
$$ P(B_2\mid B_1) = \frac{2}{4} = \frac{1}{2}. $$
- Si la primera extracción fue par ($B_1^c$), quedan 4 cartas, de las cuales 3 son
  impares:
$$ P(B_2\mid B_1^c) = \frac{3}{4}. $$

**Datos previos** (calculados en [[video-laplace]] para el esquema sin reposición
con orden — ahí $B_1$ es el suceso "la primera extracción es impar" dentro de la
definición de $B=$ "la suma es impar" — y recordados en esta clase):
$$ P(B_1) = \frac{3}{5}, \qquad P(B_1^c) = \frac{2}{5}. $$

**Regla de la multiplicación** (probabilidad total sobre la partición $\{B_1,
B_1^c\}$):
$$ P(B_2) = P(B_1\cap B_2) + P(B_1^c\cap B_2) = P(B_2\mid B_1)P(B_1) + P(B_2\mid B_1^c)P(B_1^c). $$
$$ P(B_2) = \frac{1}{2}\cdot\frac{3}{5} + \frac{3}{4}\cdot\frac{2}{5} = \frac{3}{10} + \frac{3}{10} = \frac{3}{5}. $$

**Resultado:** $P(B_2)=\tfrac{3}{5}$ — el mismo valor que $P(B_1)$ (esperable: por
simetría, "la segunda es impar" es tan probable como "la primera es impar" cuando
no hay reposición).

**Lectura sobre el diagrama por etapas** (a partir de [14:36]): el docente arma un
árbol de dos niveles (primera extracción: $B_1$ con peso $3/5$, $B_1^c$ con peso
$2/5$; segunda extracción: $B_2\mid B_1$ con peso $1/2$, $B_2\mid B_1^c$ con peso
$3/4$) y remarca que el cálculo anterior es exactamente multiplicar las
probabilidades de las ramas que interesan y sumarlas ([18:30]) — el mismo procedimiento que
[[arbol-de-probabilidades]], aplicado paso a paso en vivo sobre este ejemplo.

## Advertencias del docente

- **[18:44]** Antes de listar propiedades, aclara que está pensando $P(\cdot\mid B)$
  como una función que "agarra un evento y me devuelve la probabilidad de ese
  evento condicional a $B$" ([19:10]) — con $B$ **fijo**. Todo lo que sigue depende
  de ese punto.
- **[21:24]** Marca como error muy frecuente ("lo vemos mucho", [21:33]) escribir
  $$ \text{MAL: } P(A\mid B) = 1 - P(A\mid B^c), $$
  es decir, aplicar la regla del complemento pero **cambiando el evento
  condicionante** en vez de mantenerlo fijo. Lo remarca tres veces seguidas como
  "mal, mal, mal".
- **[22:00]** Explica la causa del error: $P(A\mid B)$ restringe los casos totales a
  los de $B$, mientras que $P(A\mid B^c)$ los restringe a los de $B^c$ — son
  conjuntos de casos totales distintos (casi siempre disjuntos), así que no hay
  ninguna razón para que esas dos probabilidades sumen 1.

## Páginas del wiki que toca
- [[probabilidad-condicional]] · [[axiomas-de-probabilidad]] ·
  [[arbol-de-probabilidades]] · [[independencia]] (mencionada solo como próximo
  tema, no desarrollada) · [[probabilidad]] · [[video-laplace]] (fuente del
  ejemplo de las 2 cartas y de los eventos $B$/$C$ que retoma esta clase)
