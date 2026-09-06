---
titulo: Cadenas de Markov
resumen: 'Proceso de Markov con estados discretos: el próximo estado depende solo del actual. Todo se calcula con la matriz de transición, $\vec p(n)=\vec p(0)\,\mathbb{P}^{n}$, y el largo plazo con la distribución estacionaria $\vec\pi=\vec\pi\,\mathbb{P}$.'
tipo: concepto
unidad: 6
orden: 6
tags: [procesos-estocasticos, markov, matriz-de-transicion]
fuentes: ["[[teorica-cadenas-de-markov]]", "[[tp6-procesos-estocasticos]]", "[[video-cadenas-de-markov]]", "[[video-distribucion-estacionaria-regulares]]", "[[video-distribucion-estacionaria-no-regulares]]", "[[video-tiempos-de-espera]]"]
actualizado: 2026-09-04
---

# Cadenas de Markov

**En breve.** Una cadena de Markov es un [[procesos-estocasticos#Proceso de Markov|proceso de Markov]]
con estados **discretos**: salta entre pocos estados y el próximo depende solo del
actual. Todo se calcula con una **matriz de transición** $\mathbb{P}$; las
preguntas típicas son "¿dónde estoy tras $n$ pasos?" ($\vec p(0)\mathbb{P}^n$) y
"¿qué pasa a largo plazo?" (distribución estacionaria $\vec\pi$).

**Modela:** sistemas que saltan entre un conjunto **discreto** de estados, donde
el próximo estado depende **solo del actual** (no de la historia): clima,
posición de un jugador, marca de un cliente, etc.

Una **cadena de Markov** es un [[procesos-estocasticos#Proceso de Markov|proceso de Markov]] con espacio de estados **discreto** $\mathbb{E}=\{s_1,s_2,\dots\}$.
Nos concentramos en cadenas con conjunto de índices también discreto
($\mathbb{T}=\mathbb{N}_0$). Queda descripta por (según
[[teorica-cadenas-de-markov]]):

1. La **distribución inicial** $p_j(0)=P(X(0)=s_j)$, con $\sum_j p_j(0)=1$.
2. Las **probabilidades de transición** $p_{ij}(n)=P\big(X(n{+}1)=s_j\mid X(n)=
   s_i\big)$, con $\sum_j p_{ij}(n)=1$ para todo $i$ (de cada estado se sale a
   alguno).

## Matriz de transición
$$ \mathbb{P}(n)=\begin{pmatrix} p_{11}(n) & p_{12}(n) & \cdots\\ p_{21}(n) & p_{22}(n) & \cdots\\ \vdots & \vdots & \ddots \end{pmatrix},\qquad \text{cada fila suma 1 (matriz estocástica)}. $$
Con el **vector de probabilidades de estado** $\vec p(n)=(p_1(n)\ p_2(n)\ \cdots)$
(suma 1), la ecuación de Chapman-Kolmogorov se escribe
$$ \vec p(n+1)=\vec p(n)\,\mathbb{P}(n). $$

> **Intuición.** La fila $i$ de $\mathbb{P}$ es la
> [[probabilidad-condicional|distribución condicional]] de "a dónde voy si estoy en
> $s_i$" (por eso suma 1). Multiplicar el vector de estado por $\mathbb{P}$ es
> "avanzar un paso promediando sobre todos los destinos posibles", y elevar
> $\mathbb{P}$ a la $k$ comprime $k$ pasos en una sola matriz: $(\mathbb{P}^k)_{ij}$
> suma las probabilidades de **todos los caminos** de $i$ a $j$ en $k$ pasos.

> **Cuidado con la dirección de la condicional.** $(\mathbb{P}^k)_{ij}$ solo es
> válido para condicionar "hacia el futuro": $P(X(n+k)=s_j\mid X(n)=s_i)$, con el
> condicionante en el pasado y la pregunta en el futuro. **No** sirve para el
> sentido inverso — $P(X(n)=s_i\mid X(n+k)=s_j)$ (condicionante futuro, pregunta
> sobre el pasado) no tiene atajo matricial directo. Hay que resolverlo con la
> definición de probabilidad condicional (intersección dividido condicionante), lo
> que equivale a aplicar Bayes:
> $$ P(X(n){=}s_i\mid X(n{+}k){=}s_j)=\frac{P(X(n{+}k){=}s_j\mid X(n){=}s_i)\cdot P(X(n){=}s_i)}{P(X(n{+}k){=}s_j)}. $$
> Ante la duda de si un atajo matricial aplica, conviene resolver siempre por
> intersección/condicionante en vez de arriesgar una lectura directa de la matriz
> (de [[video-cadenas-de-markov]]).

### Cadena homogénea
La cadena es **homogénea** si $p_{ij}(n)=p_{ij}$ no depende del tiempo. Entonces
$\mathbb{P}$ es constante y
$$ \vec p(n)=\vec p(0)\,\mathbb{P}^{n}. $$
La matriz de **$k$ pasos** es $\mathbb{P}^{(k)}=\mathbb{P}^k$ (sus entradas son las
probabilidades de ir de un estado a otro en exactamente $k$ pasos).

## Diagrama de estados
Grafo dirigido y etiquetado: un nodo por estado, una arista $s_i\to s_j$
etiquetada con $p_{ij}$. La **suma de las etiquetas de las aristas que salen de un
nodo es 1**.

> [!figura] u6-diagrama-de-estados-a-partir-de-la-matriz-p
> El grafo dirigido que corresponde a cada matriz $\mathbb{P}$, con las etiquetas $p_{ij}$ y los estados coloreados según sean recurrentes, transientes o absorbentes. Verifique que las etiquetas que salen de cada nodo suman 1, y compare la frecuencia de visitas acumulada con $\vec\pi$.

## Tipos de estados (cadenas homogéneas)
- **Accesibilidad / comunicación:** $s_j$ es accesible desde $s_i$ sii
  $p_{ij}^{(n)}>0$ para algún $n$. Si además $s_i$ es accesible desde $s_j$, se
  **comunican**.
- **Irreducible:** todos los estados se comunican (una sola clase).
- **Recurrente / transitorio:** sea $r_i$ la probabilidad de volver a $s_i$
  partiendo de $s_i$. $s_i$ es **recurrente** si $r_i=1$, **transitorio** si
  $r_i<1$.
- **Periódico:** $m_i$ = mayor entero tal que $p_{ii}^{(n)}=0$ cuando $n$ no es
  divisible por $m_i$. Si $m_i=1$ el estado es **aperiódico**; si $m_i>1$ es
  **periódico** de período $m_i$.
- **Absorbente:** estado del que no se sale ($p_{ii}=1$). P. ej. "la muerte".

## Distribución estacionaria
La **distribución estacionaria** (o de largo plazo) $\vec\pi$ satisface
$$ \vec\pi=\vec\pi\,\mathbb{P},\qquad \textstyle\sum_j \pi_j=1. $$
Es decir, $\vec\pi$ es el **autovector a izquierda** de $\mathbb{P}$ asociado al
autovalor 1. (No toda solución de $\vec\pi=\vec\pi\mathbb{P}$ es una distribución
estacionaria: hay que pedir que sea distribución de probabilidad.)

> [!figura] u6-convergencia-de-p-n-cuando-hay-y-cuando-no
> Las curvas $p_j(n)$ en las cuatro situaciones de la receta: converge sin depender de $\vec p(0)$, oscila sin converger, converge a un límite que sí depende de $\vec p(0)$, y estado transiente cuya curva cae a cero. Guarde una curva como referencia y cambie $\vec p(0)$ para ver en cuáles se mueve el límite y en cuáles no; la lectura «qué muestra esta cadena» resume el caso elegido.

> **Intuición.** $\vec\pi$ es la distribución que **se reproduce a sí misma**: si
> se comienza con ella, tras un paso se continúa con ella ("régimen de equilibrio"). En una
> cadena regular es además el límite al que tiende el sistema sin importar de dónde
> se parta: la fracción de tiempo a largo plazo que se pasa en cada estado. Por eso
> "comportamiento de largo plazo" $\equiv$ resolver $\vec\pi=\vec\pi\mathbb{P}$.

> **Condición suficiente (cadena regular):** Si existe $n\ge1$ tal que todos los
> elementos de $\mathbb{P}^n$ son positivos, $\mathbb{P}$ es **regular**; entonces
> la cadena es irreducible, recurrente y aperiódica, y existe
> $\vec\pi=\lim_{n\to\infty}\vec p(n)$ **independiente** de $\vec p(0)$.

> **Técnica: verificar regularidad más rápido.** Para hallar a mano una potencia
> de $\mathbb{P}$ toda positiva sin multiplicar por $\mathbb{P}$ paso a paso,
> conviene elevar al cuadrado sucesivamente: $\mathbb{P}^2=\mathbb{P}\cdot\mathbb{P}$,
> $\mathbb{P}^4=\mathbb{P}^2\cdot\mathbb{P}^2$, $\mathbb{P}^8=\mathbb{P}^4\cdot\mathbb{P}^4$,
> etc. Como una vez que una potencia da todas las entradas positivas todas las
> siguientes también, esto llega a la potencia "toda positiva" (o descarta la
> regularidad) con muchas menos multiplicaciones que ir de a un paso
> ($\mathbb{P}^3,\mathbb{P}^4,\dots$) (de
> [[video-distribucion-estacionaria-regulares]]).

> ⚠️ **Error común (orden del razonamiento).** La condición "cadena regular ⟹
> existe $\vec\pi=\vec\pi\mathbb{P}$" es *suficiente pero no necesaria*: si la
> cadena **no** es regular y aun así se encuentra un vector que cumple
> $\vec\pi=\vec\pi\mathbb{P}$ con $\sum_i\pi_i=1$, ese vector **no necesariamente**
> es la distribución estacionaria. Por eso siempre hay que verificar primero la
> regularidad y solo después resolver el autovector a izquierda — invertir el
> orden es uno de los errores más comunes del tema, aunque el resultado numérico
> "dé bien" por casualidad (de [[video-distribucion-estacionaria-regulares]]).

Cuando la cadena es **periódica** puede no existir $\vec\pi$ como límite, aunque
los promedios temporales sí convergen (ejemplo del "bebé" en
[[teorica-cadenas-de-markov]]).

> **¿Y si la cadena NO es regular? — receta de
> [[video-distribucion-estacionaria-no-regulares]].** La no-regularidad no decide
> por sí sola si hay o no $\vec\pi$; hay que mirar la estructura:
> - **Un único estado absorbente, accesible desde todos los demás** ⇒ SÍ hay
>   $\vec\pi$ (independiente de $\vec p(0)$): es la delta en ese estado. Sostener
>   el ciclo entre los demás estados para siempre tiene probabilidad que decae
>   geométricamente a cero.
> - **Dos o más estados absorbentes** ⇒ NO hay $\vec\pi$: el límite de $\vec p(n)$
>   depende de dónde arrancó la cadena (cada absorbente "hereda" una mezcla
>   distinta según el estado inicial).
> - **Hay estados transientes** (se abandonan con probabilidad 1) pero el resto de
>   la cadena, restringida, es **regular** ⇒ SÍ hay $\vec\pi$: vale $0$ en los
>   estados transientes y coincide con la estacionaria de esa subcadena regular en
>   el resto.
> - **Cadena periódica** ⇒ NO hay $\vec\pi$: $\mathbb{P}^n$ oscila sin converger a
>   ningún valor (no es que "converja oscilando").

## Tiempo hasta absorción
Si $s_1,\dots,s_k$ son absorbentes, ordenando los estados
$\mathbb{P}=\begin{pmatrix}\mathbb{I}_{k\times k} & \mathbf{0}\\ \mathbb{F} & \mathbb{Q}\end{pmatrix}$.
Con $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$: $\mathbb{M}(i,j)$ es el tiempo
esperado en $s_{k+j}$ partiendo de $s_{k+i}$ antes de la absorción, y
$\mathbb{G}=\mathbb{M}\,\mathbb{F}$ da $\mathbb{G}(i,j)=P($absorbido por $s_j\mid$
partió de $s_{k+i})$ (de [[tp6-procesos-estocasticos]] sección de repaso).

> [!figura] u6-forma-canonica-los-bloques-i-0-f-q
> La misma matriz antes y después de reordenar los estados, con los cuatro bloques $\mathbb{I}$, $\mathbf{0}$, $\mathbb{F}$ y $\mathbb{Q}$ en colores. Note que el bloque $\mathbf{0}$ es nulo porque de un absorbente no se sale, y que el tiempo hasta la absorción se lee sumando la fila correspondiente de $\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$. Las filas de $\mathbb{M}$ y de $\mathbb{G}=\mathbb{M}\,\mathbb{F}$ están al pie del dibujo y los totales, en las lecturas; cada fila de $\mathbb{G}$ suma 1.

> **Cadena absorbente ↔ tiempo de vida geométrico ([[tp6-procesos-estocasticos]] Ej. 24):**
> Proceso de dos estados $\{V\text{ (vivo)},M\text{ (muerto)}\}$ con $X_0=V$,
> $P(X_n=V\mid X_{n-1}=V)=1-p$, $P(X_n=M\mid X_{n-1}=V)=p$ y $M$ absorbente
> ($p_{MM}=1$). Sea $N$ = años de vida. La persona muere exactamente en el año $k$ si
> sobrevivió los $k$ años previos y muere en el siguiente, por lo que
> $$ P(N=0)=p,\qquad P(N=k)=\underbrace{(1-p)^k}_{\text{sobrevive }k\text{ años}}\,p\quad(k\ge1). $$
> Es una [[distribucion-geometrica|geométrica]] (convención "nº de fracasos antes del
> éxito", con el "éxito" = morir), de donde $E[N]=\dfrac{1-p}{p}$. La potencia de la
> matriz es $\mathbb{P}^n=\begin{pmatrix}1&0\\ 1-(1-p)^n&(1-p)^n\end{pmatrix}$ y su
> límite manda toda la masa al estado absorbente $M$. Es el patrón general "tiempo hasta
> absorción de una cadena con un único estado de salida" → geométrica.

> **Ejemplo numérico completo (de [[video-tiempos-de-espera]], min. 23:39):**
> Cadena de estados $\{E,P,T,R\}$ (Natalia alterna entre escribir y procrastinar
> hasta terminar o renunciar), con
> $$ \mathbb{P}=\left(\begin{array}{cc|cc} 0.5&0.3&0.15&0.05\\ 0.1&0.6&0.02&0.28\\\hline 0&0&1&0\\ 0&0&0&1 \end{array}\right)=\begin{pmatrix}\mathbb{Q}&\mathbb{F}\\ \mathbf{0}&\mathbb{I}\end{pmatrix}. $$
> Con $\mathbb{Q}=\begin{pmatrix}0.5&0.3\\0.1&0.6\end{pmatrix}$:
> $$ \mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}=\begin{pmatrix}40/17&30/17\\10/17&50/17\end{pmatrix}\approx\begin{pmatrix}2.353&1.765\\0.588&2.941\end{pmatrix}. $$
> $\mathbb{M}(i,j)$ es el número esperado de veces que la cadena visita el estado
> transitorio $j$ antes de la absorción, partiendo de $i$ (p. ej. si empieza
> escribiendo, pasa en promedio $2.353$ pasos "escribiendo" y $1.765$
> "procrastinando" antes de terminar o renunciar). Sumando cada fila se recupera
> el tiempo total esperado hasta la absorción: $\mathbb{M}\cdot(1,1)^\top=(70/17,60/17)\approx(4.12,\,3.53)$.
> Multiplicando por $\mathbb{F}=\begin{pmatrix}0.15&0.05\\0.02&0.28\end{pmatrix}$
> se obtienen las probabilidades de terminar en cada estado absorbente:
> $$ \mathbb{M}\,\mathbb{F}=\begin{pmatrix}33/85&52/85\\5/34&29/34\end{pmatrix}\approx\begin{pmatrix}0.388&0.612\\0.147&0.853\end{pmatrix}, $$
> es decir, empezando a escribir la novela termina con probabilidad $\approx0.388$
> y renuncia con $\approx0.612$; empezando a procrastinar, esas probabilidades
> empeoran a $0.147$ y $0.853$.

## Tiempo de recurrencia / primer paso (cadenas regulares)
*De [[video-tiempos-de-espera]], min. 36:52.* La matriz fundamental de absorción
$\mathbb{M}=(\mathbb{I}-\mathbb{Q})^{-1}$ no tiene análogo directo en una cadena
**regular** (sin estados absorbentes): $\mathbb{I}-\mathbb{P}$ no es invertible,
porque $\mathbb{P}$ tiene autovalor $1$ (el de la distribución estacionaria
$\vec\pi$), lo que anula alguna combinación lineal de sus filas.

En su lugar, con $\mathbb{W}$ la matriz que repite $\vec\pi$ en cada fila, se
define
$$ \mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}, $$
que sí es invertible. Si $w_j=\pi_j$, el **tiempo esperado de primer paso** (o de
recurrencia si $i=j$) de $s_i$ a $s_j$ es
$$ E(T_{i,j})=\begin{cases} \dfrac{\mathbb{Z}(j,j)-\mathbb{Z}(i,j)}{w_j} & i\ne j\\[4pt] \dfrac{1}{w_j} & i=j \end{cases}. $$
El caso $i=j$ (**tiempo medio de recurrencia**) es el recíproco directo de la
probabilidad de largo plazo del estado: cuanto más frecuente es $s_j$ en régimen
estacionario, menos hay que esperar en promedio para volver a él.

## Cuándo usarla (reconocer en un ejercicio)
- Un sistema con **pocos estados discretos** y reglas "del estado actual al
  siguiente" con probabilidades fijas → arma $\mathbb{P}$ y un diagrama.
- "¿Probabilidad de estar en tal estado tras $n$ pasos?" → $\vec p(0)\mathbb{P}^n$.
- "¿Comportamiento / frecuencia a largo plazo?" → distribución estacionaria
  $\vec\pi=\vec\pi\mathbb{P}$.

## Ejercicios resueltos

### Largo plazo de una cadena regular
*De [[tp6-procesos-estocasticos]] Ej. 17 (resuelto). Cadena de Markov homogénea
con $\mathbb{E}=\{a,b,c\}$ y*
$$ \mathbb{P}=\begin{pmatrix}0.3 & 0.4 & 0.3\\ 1 & 0 & 0\\ 0 & 0.3 & 0.7\end{pmatrix}. $$
*(a) Calcular $P(X_2=a\mid X_1=b, X_0=c)$. (b) Calcular $P(X_{35}=a\mid X_{33}=a)$.
(c) Estimar $P(X_{200}=a\mid X_0=b)$.*

**(a)** Por la propiedad de Markov, el condicionante se reduce al último instante:
$$ P(X_2=a\mid X_1=b,X_0=c)=P(X_2=a\mid X_1=b)=p_{ba}=1. $$
(fila $b$, columna $a$ de $\mathbb{P}$).

**(b)** Es una transición en **2 pasos**, $(\mathbb{P}^2)_{aa}$. Sumando los
caminos $a\to\{a,b,c\}\to a$:
$$ P(X_{35}=a\mid X_{33}=a)=\sum_{i}p_{ai}\,p_{ia}=\underbrace{0.3^2}_{a\to a\to a}+\underbrace{0.4\cdot1}_{a\to b\to a}+\underbrace{0.3\cdot0}_{a\to c\to a}=0.49. $$

**(c) Largo plazo.** Como $\mathbb{P}^2=\begin{pmatrix}0.49&0.21&0.3\\0.3&0.4&0.3\\
0.3&0.21&0.49\end{pmatrix}>0$, la cadena es **regular** y existe estacionaria
$\vec\pi=(a,b,c)$ independiente del inicio. Resolviendo
$\vec\pi=\vec\pi\mathbb{P}$ con $a+b+c=1$:
$$ \begin{cases} a=0.3a+b\\ b=0.4a+0.3c\\ a+b+c=1 \end{cases}\;\Rightarrow\; \vec\pi=\Big(\tfrac{10}{27},\tfrac{7}{27},\tfrac{10}{27}\Big). $$
Como $\mathbb{P}^{200}$ tiene filas $\approx\vec\pi$, la probabilidad de largo
plazo no depende de $X_0$:
$$ P(X_{200}=a\mid X_0=b)\approx \pi_a=\frac{10}{27}\approx 0.370. $$

**Resultado.** (a) $1$, (b) $0.49$, (c) $\approx 10/27$.

### Clases, recurrencia y primera visita
*De [[tp6-procesos-estocasticos]] Ej. 22 (resuelto). Cadena con
$\mathbb{E}=\{0,1,2,3,4,5,6\}$ y*
$$ \mathbb{P}=\begin{pmatrix}
\tfrac15&\tfrac35&0&0&\tfrac15&0&0\\
0&0&1&0&0&0&0\\
0&\tfrac13&0&\tfrac23&0&0&0\\
0&1&0&0&0&0&0\\
0&0&0&0&0&1&0\\
0&0&0&0&0&0&1\\
0&0&0&0&1&0&0
\end{pmatrix}. $$

**Clases (ítem b).** Mirando qué estados se comunican (ida y vuelta con
probabilidad positiva en algún número de pasos):
$$ C_1=\{0\},\qquad C_2=\{1,2,3\},\qquad C_3=\{4,5,6\}. $$
- $\{0\}$ **no** se comunica con $1$: aunque $p_{01}=\tfrac35>0$, no hay forma de
  volver a $0$ desde $1$, así que $C_1$ es una clase aparte y **transitoria** (la
  probabilidad de salir es $\ge p_{01}=\tfrac35>0$).
- $C_2$ y $C_3$ son **cerradas y recurrentes** (no hay flechas que salgan de ellas);
  una vez dentro, la cadena se queda.
- $C_3=\{4\to5\to6\to4\}$ es un ciclo de longitud 3 → **periódica de período 3**
  ($p_{ii}^{(n)}=1$ sólo si $3\mid n$). $C_2$ **no** es periódica, porque
  $p_{11}^{(2)}=p_{12}p_{21}=\tfrac13\notin\{0,1\}$.

**Probabilidad de primera visita.** Se define
$q_{ij}(n)=P\big(X_n=j,\,X_m\ne j\ \forall\,1\le m\le n{-}1\mid X_0=i\big)$:
llegar **por primera vez** a $j$ desde $i$ en $n$ pasos. Como estos eventos (por
distinto $n$) son disjuntos, $q_{ij}=\sum_{n\ge1}q_{ij}(n)$.

**(c1) $P($alcanzar $6$ desde $0)=\tfrac14$.** Para llegar de $0$ a $6$ hay que pasar
sí o sí por $4$ (única salida de $C_1$ hacia $C_3$), y desde $4$ se va a $6$ en
exactamente 2 pasos forzados $4\to5\to6$. La primera visita a $4$ ocurre en $k$ pasos
si la cadena se quedó $k-1$ veces en $0$ y solo entonces saltó a $4$:
$$ q_{04}(k)=p_{00}^{\,k-1}\,p_{04}=\Big(\tfrac15\Big)^{k-1}\tfrac15=\Big(\tfrac15\Big)^{k}. $$
Entonces, usando $\sum_{k=0}^{\infty}q^k=\tfrac{1}{1-q}$,
$$ q_{06}=\sum_{k\ge1}q_{04}(k)=\sum_{k\ge1}\Big(\tfrac15\Big)^{k}=\frac{1}{1-\tfrac15}-1=\frac54-1=\frac14. $$

**(c2) $P($alcanzar $3$ desde $1)=1$.** Dentro de $C_2$ sólo se llega a $3$ en pasos
**pares** (hay que hacer ciclos $1\to2\to1$ antes de salir por $2\to3$). Con $h$
ciclos previos, $q_{13}(2h{+}2)=\big(\tfrac13\big)^{h}\cdot\tfrac23$, y
$$ q_{13}=\sum_{h\ge0}\Big(\tfrac13\Big)^{h}\tfrac23=\tfrac23\cdot\frac{1}{1-\tfrac13}=\tfrac23\cdot\tfrac32=1. $$
(La cadena entra a $3$ con probabilidad 1: $C_2$ es recurrente.)

**(c3) Pasos esperados de $1$ a $3$ $=3$.** Sea $T_{13}$ el nº de transiciones hasta
la primera visita a $3$; como $P(T_{13}=n)=q_{13}(n)$, sólo aportan los $n=2k$ con
$q_{13}(2k)=\big(\tfrac13\big)^{k-1}\tfrac23$. Usando
$\sum_{k\ge1}k\,q^{k-1}=\tfrac{1}{(1-q)^2}$:
$$ E[T_{13}]=\sum_{n\ge1}n\,q_{13}(n)=\sum_{k\ge1}2k\Big(\tfrac13\Big)^{k-1}\tfrac23
=\tfrac43\sum_{k\ge1}k\Big(\tfrac13\Big)^{k-1}=\tfrac43\cdot\frac{1}{(1-\tfrac13)^2}=\tfrac43\cdot\tfrac94=3. $$

**(c4) Largo plazo en $2$ desde $1$ $=\tfrac38$.** Como la cadena queda atrapada en
$C_2=\{1,2,3\}$, restringimos a una cadena $Y_n$ sobre $\{1,2,3\}$ con
$\mathbb{P}_Y=\begin{pmatrix}0&1&0\\\tfrac13&0&\tfrac23\\1&0&0\end{pmatrix}$. Es
**regular** ($\mathbb{P}_Y^8>0$), así que existe estacionaria $\vec\pi=(a,b,c)$ con
$\vec\pi=\vec\pi\,\mathbb{P}_Y$, $a+b+c=1$:
$$ \begin{cases}a=\tfrac13 b+c\\ b=a\\ c=\tfrac23 b\end{cases}\Rightarrow
\Big(a,b,c\Big)=\Big(\tfrac38,\tfrac38,\tfrac14\Big)\;\Rightarrow\;
\lim_{n\to\infty}P(X_n=2\mid X_0=1)=b=\tfrac38. $$

**Resultado.** $q_{06}=\tfrac14$; $q_{13}=1$; $E[T_{13}]=3$; largo plazo en $2$
$=\tfrac38$.

### Cadena con estado absorbente (oportunidades de examen)
*De [[tp6-procesos-estocasticos]] Ej. 25 (resuelto). Cada materia tiene 3
oportunidades de final; $p=P(\text{aprobar})$. $X_n=$ nº de oportunidades en el
período $n$, con $\mathbb{E}=\{0,1,2,3\}$: el estado $0$ ("aprobado") es
**absorbente**; el $3$ es la cursada recién aprobada; al reprobar la última
instancia se vuelve $1\to3$ (recursa).*

**(a) Matriz de transición.** De cada estado $\ne0$ se aprueba con prob. $p$ (va a $0$)
o se reprueba con prob. $1-p$ (baja una oportunidad, salvo $1\to3$):
$$ \mathbb{P}=\begin{pmatrix}1&0&0&0\\ p&0&0&1-p\\ p&1-p&0&0\\ p&0&1-p&0\end{pmatrix}
\quad\text{(orden de estados }0,1,2,3). $$

**(b) Evolución desde $X_0=3$.** Con $\vec\pi_0=(0,0,0,1)$ y
$\vec\pi_{n+1}=\vec\pi_n\,\mathbb{P}$:
$$ \vec\pi_1=(p,\,0,\,1-p,\,0),\quad
\vec\pi_2=(2p-p^2,\,(1-p)^2,\,0,\,0),\quad
\vec\pi_3=(p^3-3p^2+3p,\,0,\,0,\,(1-p)^3). $$
La clave: en el instante $n$, **no estar aprobado** ($X_n\ne0$) significa haber
reprobado todas las instancias previas, lo que tiene probabilidad $(1-p)^n$. Por lo
tanto la probabilidad de estar en $0$ es $1-(1-p)^n$, y la masa restante $(1-p)^n$ se
reparte cíclicamente entre los estados $1,2,3$ según $n\bmod 3$:
$$ \vec\pi_n=\begin{cases}
\big(1-(1-p)^n,\,0,\,0,\,(1-p)^n\big)&n=3k\\
\big(1-(1-p)^n,\,0,\,(1-p)^n,\,0\big)&n=3k+1\\
\big(1-(1-p)^n,\,(1-p)^n,\,0,\,0\big)&n=3k+2
\end{cases} $$

**Valor límite.** Como $0<1-p<1$, $(1-p)^n\to0$, así que toda la probabilidad se
concentra en el estado absorbente:
$$ \lim_{n\to\infty}\vec\pi_n=(1,\,0,\,0,\,0). $$
Es decir, el alumno **termina aprobando con probabilidad 1**.

**Resultado.** El patrón de $\vec\pi_n$ depende de $n\bmod3$ con peso $(1-p)^n$ fuera
del estado $0$; el límite es $(1,0,0,0)$.

### Tiempo de recurrencia en una cadena regular
*De [[video-tiempos-de-espera]], min. 41:56. Cadena regular $\{B,C,F\}$ (desayuno
de Natalia: bizcocho, cereal, fruta) con*
$$ \mathbb{P}=\begin{pmatrix}0.75&0&0.25\\0.4&0.6&0\\0&1&0\end{pmatrix},\qquad \vec\pi=\Big(\tfrac{8}{15},\tfrac13,\tfrac{2}{15}\Big). $$
*Calcular la matriz de tiempos esperados de primer paso/recurrencia.*

**Planteo.** $\mathbb{W}$ repite $\vec\pi=(8/15,\,1/3,\,2/15)$ en sus tres filas;
$\mathbb{Z}=(\mathbb{I}-\mathbb{P}+\mathbb{W})^{-1}$ y luego
$\mathbb{M}(i,j)=(\mathbb{Z}(j,j)-\mathbb{Z}(i,j))/w_j$ para $i\ne j$,
$\mathbb{M}(i,i)=1/w_i$.

**Resultado** (orden $B,C,F$):
$$ \mathbb{M}=\begin{pmatrix} 15/8 & 5 & 4\\ 5/2 & 3 & 13/2\\ 7/2 & 1 & 15/2 \end{pmatrix}\approx\begin{pmatrix}1.875&5&4\\2.5&3&6.5\\3.5&1&7.5\end{pmatrix}. $$
La diagonal confirma el caso $i=j$: $\mathbb{M}(B,B)=1/w_B=15/8$,
$\mathbb{M}(C,C)=1/w_C=3$, $\mathbb{M}(F,F)=1/w_F=15/2$. Por ejemplo, empezando en
fruta se tarda en promedio $1$ paso en volver a comer cereal (siempre pasa
directamente de fruta a cereal) y $7.5$ pasos en volver a comer fruta de nuevo.
Estos valores coinciden con los obtenidos por simulación (tabla del video):
$(1.824,\,5.059,\,4.098)$, $(2.598,\,3.026,\,6.435)$, $(3.518,\,1.000,\,7.452)$.

### Distribución estacionaria con un estado transiente
*De [[video-distribucion-estacionaria-no-regulares]], ejemplo del kale. La
doctora le dice a Natalia que coma kale (K); si una hora come kale, a la
siguiente vuelve a comer kale con probabilidad $0.4$, pasa a bizcocho (B) con
probabilidad $0.4$ y a fruta (F) con probabilidad $0.2$. El resto de las comidas
(B, cereal C, F) sigue la lógica del ejercicio anterior.*

**Planteo.** $E=\{K,B,C,F\}$ con
$$ \mathbb{P}=\begin{pmatrix}0.4&0.4&0&0.2\\0&0.75&0&0.25\\0&0.4&0.6&0\\0&0&1&0\end{pmatrix}. $$
El kale no es accesible desde $B$, $C$ ni $F$ (esa columna es siempre cero salvo
la fila de $K$), así que la cadena no es regular. Pero desde $K$ sí se sale hacia
$\{B,C,F\}$ sin volver nunca más: $K$ es un **estado transiente**.

**Cálculo.** Las potencias de $\mathbb{P}$ muestran que la primera componente (K)
tiende a $0$ en todas las filas, mientras las otras tres coordenadas convergen
todas al mismo vector — la estacionaria de la subcadena regular $\{B,C,F\}$ (la
misma del ejercicio anterior):
$$ \vec\pi=\Big(0,\ \tfrac{8}{15},\ \tfrac13,\ \tfrac{2}{15}\Big). $$

**Resultado.** $\vec\pi=(0,\tfrac{8}{15},\tfrac13,\tfrac{2}{15})$: patrón general
para "cadena no regular con un estado transiente" → poner $0$ en el transiente y
resolver la estacionaria de la subcadena regular restante.
