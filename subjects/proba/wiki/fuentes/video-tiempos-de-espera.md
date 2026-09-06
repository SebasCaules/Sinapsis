---
titulo: "Video — Tiempos de Espera"
resumen: "Clase en video de Lucio Pantazis (unidad 6) sobre tiempos de espera en cadenas de Markov: tiempo medio hasta la absorción con la matriz fundamental, y tiempos medios de recurrencia y de primer paso en una cadena regular."
tipo: fuente
formato: video
unidad: 6
url: "https://youtu.be/XgU36S3G4pc"
duracion: "45:20"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Tiempos de Espera

**Qué es:** clase que retoma el ejemplo de una cadena de Markov con estados
absorbentes para mostrar cuánta información extra se puede sacar más allá de "en
algún momento termina", y extiende la idea a cadenas regulares.
**Cubre:** tiempo hasta absorción con la matriz fundamental
$\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ (con ejemplo numérico completo), y tiempo
medio de recurrencia / primer paso entre estados de una cadena regular con
$\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$.
**Guía asociada:** Guía 6.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:06] | Retoma el ejemplo de Natalia (escribir/procrastinar/terminar/renunciar): ya sabemos que la cadena termina absorbida, pero hay más para analizar. |
| [01:44] | Plantea $P(\text{tarda más de 15 min en ser absorbida}\mid\text{empieza escribiendo})$ con un árbol de probabilidades a mano (con errores de cálculo en vivo que corrige). |
| [10:17] | Define $T_E$ y $T_P$ (pasos hasta la primera absorción según el estado inicial) y plantea sus valores esperados como series. |
| [14:03] | Simulación: promedia la cantidad de pasos hasta la absorción por estado inicial, $E(T_E)\approx4.142$, $E(T_P)\approx3.525$. |
| [17:24] | Descompone el total de pasos según cuánto tiempo se pasa en cada estado transitorio antes de la absorción: define $N_{E,E}, N_{E,P}, N_{P,E}, N_{P,P}$. |
| [20:56] | Probabilidad de terminar absorbida en cada estado ($T$ o $R$) según el estado inicial, estimada por simulación. |
| [23:39] | Introduce la matriz fundamental $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ para obtener sin simular todo lo calculado hasta aquí. |
| [29:19] | Calcula $\mathbb{M}$ para el ejemplo de Natalia; coincide con los valores simulados. |
| [32:43] | Calcula $\mathbb{M}\,\mathbb{F}$ (probabilidades de absorción por estado), comparando con la simulación. |
| [34:36] | Generaliza: la estructura de $\mathbb{M}$ sirve con cualquier cantidad de estados absorbentes y transitorios. |
| [35:08] | Extiende la pregunta a cadenas **regulares** (sin absorbentes): ¿cuánto tarda en llegar/volver a otro estado? Nuevo ejemplo: el desayuno de Natalia (bizcocho/cereal/fruta). |
| [38:06] | Define la matriz fundamental para cadenas regulares $\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$, con $\mathbb{W}$ la distribución estacionaria repetida por filas. |
| [39:49] | Resuelve el ejemplo completo: calcula $\mathbb{Z}$ y la matriz $\mathbb{M}$ de tiempos medios de recurrencia/primer paso, comparando con la simulación. |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto que no está en el apunte.** [[cadenas-de-markov]] ya tenía
  la fórmula abstracta $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$,
  $\mathbb{G}=\mathbb{M}\mathbb{F}$ (de [[tp6-procesos-estocasticos]]), pero sin un
  ejemplo numérico resuelto de punta a punta. El video calcula $\mathbb{M}$ y
  $\mathbb{M}\mathbb{F}$ completos para la cadena de 4 estados $\{E,P,T,R\}$ y
  verifica cada resultado contra una simulación (ver ejercicio resuelto abajo).
- **(a) Contenido completamente nuevo: tiempos de recurrencia en cadenas
  regulares.** Ni [[teorica-cadenas-de-markov]] ni [[tp6-procesos-estocasticos]]
  cubren cómo calcular el tiempo esperado de primer paso/recurrencia entre estados
  de una cadena **sin** estados absorbentes. El video introduce
  $\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$ como el análogo de
  $\mathbb{M}$ para este caso, con un ejemplo completo (ver más abajo).
- **(b) Intuición: la matriz fundamental como "geométrica matricial".** El docente
  conecta $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ con $E[Z]=\frac{1}{1-q}$ de la
  [[distribucion-geometrica|geométrica]] (número de intentos hasta el primer
  éxito): en la geométrica solo hay éxito/fracaso, mientras que en una cadena con
  varios estados transitorios "fracasar" (no ser absorbido) tiene muchas formas
  posibles, y la inversión de matrices reemplaza a la división por $1-q$ [24:45–28:00].
- **(b) Intuición: por qué $\mathbb{I}-\mathbb{P}$ no sirve en cadenas regulares.**
  Como $\mathbb{P}$ tiene autovalor $1$ (el de $\vec\pi$), $\mathbb{I}-\mathbb{P}$
  nunca es invertible; sumar $\mathbb{W}$ (con $\vec\pi$ repetida en cada fila)
  "compensa" esa dirección singular y permite invertir [37:48–38:17].
- **(d) Énfasis: la matriz fundamental es central.** El docente insiste en que
  $\mathbb{M}$ "está metida en todos los cálculos": de ella salen tanto los tiempos
  esperados en cada estado transitorio como (multiplicada por $\mathbb{F}$) las
  probabilidades de absorción por estado [33:08–33:35].

## Ejercicio resuelto en clase

### 1. Tiempo hasta absorción con la matriz fundamental
*[23:39]. Natalia alterna entre escribir (E) y procrastinar (P) hasta que termina
la novela (T) o renuncia (R), con matriz de transición*
$$ \mathbb{P}=\left(\begin{array}{cc|cc} 0.5&0.3&0.15&0.05\\ 0.1&0.6&0.02&0.28\\\hline 0&0&1&0\\ 0&0&0&1 \end{array}\right)=\begin{pmatrix}\mathbb{Q}&\mathbb{F}\\ \mathbf{0}&\mathbb{I}\end{pmatrix},\qquad \mathbb{Q}=\begin{pmatrix}0.5&0.3\\0.1&0.6\end{pmatrix},\ \mathbb{F}=\begin{pmatrix}0.15&0.05\\0.02&0.28\end{pmatrix}. $$
*Calcular cuántos pasos se espera pasar en cada estado transitorio antes de la
absorción, y con qué probabilidad termina en $T$ o en $R$ según el estado inicial.*

**Planteo.** La matriz fundamental es $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$;
$\mathbb{M}(i,j)$ es el número esperado de veces que la cadena visita el estado
transitorio $j$ antes de ser absorbida, partiendo de $i$. Las probabilidades de
absorción por estado se obtienen con $\mathbb{M}\,\mathbb{F}$.

**Cálculo.**
$$ \mathbb{I}-\mathbb{Q}=\begin{pmatrix}0.5&-0.3\\-0.1&0.4\end{pmatrix},\qquad \det=0.5\cdot0.4-(-0.3)(-0.1)=0.17. $$
$$ \mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}=\frac{1}{0.17}\begin{pmatrix}0.4&0.3\\0.1&0.5\end{pmatrix}=\begin{pmatrix}40/17&30/17\\10/17&50/17\end{pmatrix}\approx\begin{pmatrix}2.353&1.765\\0.588&2.941\end{pmatrix}. $$
Es decir, si Natalia empieza escribiendo, se espera que pase $2.353$ pasos más
escribiendo y $1.765$ procrastinando antes de terminar o renunciar (si empieza
procrastinando: $0.588$ y $2.941$ respectivamente). Sumando cada fila se recupera
el total esperado de pasos hasta la absorción:
$$ \mathbb{M}\cdot\binom{1}{1}=\binom{70/17}{60/17}\approx\binom{4.118}{3.529}. $$
Con la matriz de absorción $\mathbb{F}$:
$$ \mathbb{M}\,\mathbb{F}=\begin{pmatrix}33/85&52/85\\5/34&29/34\end{pmatrix}\approx\begin{pmatrix}0.388&0.612\\0.147&0.853\end{pmatrix}. $$

**Resultado.** Empezando a escribir, $P(\text{termina})\approx0.388$ y
$P(\text{renuncia})\approx0.612$; empezando a procrastinar, esas probabilidades
empeoran a $0.147$ y $0.853$. Todos estos valores coinciden (a menos de error de
simulación) con los que el docente obtuvo simulando miles de trayectorias:
$E(T_E,T_P)\approx(4.142,3.525)$ y matriz de absorción
$\approx\begin{pmatrix}0.383&0.617\\0.153&0.847\end{pmatrix}$.

### 2. Tiempo de recurrencia en una cadena regular
*[36:52]–[44:04]. Cadena regular $\{B,C,F\}$ (desayuno que acompaña la escritura
de Natalia: bizcocho, cereal, fruta) con*
$$ \mathbb{P}=\begin{pmatrix}0.75&0&0.25\\0.4&0.6&0\\0&1&0\end{pmatrix},\qquad \vec\pi=\Big(\tfrac{8}{15},\ \tfrac13,\ \tfrac{2}{15}\Big)\ \text{(distribución estacionaria)}. $$
*Calcular el tiempo esperado de primer paso/recurrencia entre cada par de estados.*

**Planteo.** Como $\mathbb{P}$ tiene autovalor $1$, $\mathbb{I}-\mathbb{P}$ no es
invertible. Se define en su lugar $\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$,
con $\mathbb{W}$ la matriz que repite $\vec\pi$ en cada una de sus filas, y con
$w_j=\pi_j$:
$$ E(T_{i,j})=\mathbb{M}(i,j)=\frac{\mathbb{Z}(j,j)-\mathbb{Z}(i,j)}{w_j}\ (i\ne j),\qquad E(T_{i,i})=\mathbb{M}(i,i)=\frac{1}{w_i}. $$

**Cálculo.** Con $w=(8/15,1/3,2/15)$:
$$ \mathbb{I}-\mathbb{P}+\mathbb{W}=\begin{pmatrix}47/60&1/3&-7/60\\2/15&11/15&2/15\\8/15&-2/3&17/15\end{pmatrix}, $$
que se invierte (adjunta $3\times3$) para obtener $\mathbb{Z}$, y de ahí, aplicando
la fórmula anterior a cada par $(i,j)$:
$$ \mathbb{M}=\begin{pmatrix} 15/8 & 5 & 4\\ 5/2 & 3 & 13/2\\ 7/2 & 1 & 15/2 \end{pmatrix}\approx\begin{pmatrix}1.875&5&4\\2.5&3&6.5\\3.5&1&7.5\end{pmatrix}\qquad(\text{orden }B,C,F). $$
La diagonal se verifica directo por la fórmula del caso $i=j$:
$\mathbb{M}(B,B)=1/w_B=15/8$, $\mathbb{M}(C,C)=1/w_C=3$, $\mathbb{M}(F,F)=1/w_F=15/2$.

**Resultado.** Por ejemplo, empezando en fruta se tarda en promedio $1$ paso en
volver a comer cereal (de fruta siempre se pasa a cereal) y $7.5$ pasos en volver a
comer fruta de nuevo. Estos valores son consistentes con la simulación mostrada en
el video:
$$ \begin{array}{c|ccc} \text{Inicio}\backslash\text{Final} & B & C & F\\\hline B & 1.824 & 5.059 & 4.098\\ C & 2.598 & 3.026 & 6.435\\ F & 3.518 & 1.000 & 7.452 \end{array} $$

## Advertencias del docente

- **[03:14]–[09:52] Se equivoca en vivo calculando el árbol de probabilidades a
  mano** (resta ramas equivocadas varias veces) y lo corrige en el momento; el
  resultado final ($P(\text{tarda más de 15 min})=0.61$ empezando en $E$, $0.5$
  empezando en $P$) coincide con el método exacto de la matriz fundamental. Vale
  como recordatorio de revisar con cuidado qué ramas se restan al calcular un
  complemento con un árbol.
- **[07:19]–[08:04] Error frecuente marcado explícitamente:** cuando el estado
  inicial ya está fijo, ese instante ya cuenta como "el primer tramo". No hay que
  sumar un paso de más: "más de 15 minutos" con tramos de 5 minutos no obliga a
  contar tres pasos completos si el estado inicial ya define el punto de partida.
- **[12:48]–[13:16] La condición "por primera vez" es clave** al definir $T_E$
  (pasos hasta la primera absorción): sin ella, los eventos para distintos $n$ no
  son mutuamente excluyentes (se puede seguir "absorbido" en pasos posteriores).
  El docente lo compara con la definición de la [[distribucion-geometrica|geométrica]].
- **[37:48]–[38:17] $\mathbb{I}-\mathbb{P}$ nunca es invertible en una cadena
  regular** (por el autovalor $1$ asociado a $\vec\pi$): hay que usar
  $\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$, no $(\mathbb{I}-\mathbb{P})^{-1}$.

## Páginas del wiki que toca
- [[cadenas-de-markov]]
