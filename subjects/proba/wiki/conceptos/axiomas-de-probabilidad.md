---
titulo: Axiomas de probabilidad (Kolmogorov)
resumen: 'Reglas de Kolmogorov: $P(A)\ge0$, $P(S)=1$ y aditividad para sucesos mutuamente excluyentes. De ellas se deducen el complemento $P(A^c)=1-P(A)$, la monotonía y $P(A\cup B)=P(A)+P(B)-P(A\cap B)$.'
tipo: concepto
unidad: 2
orden: 4
tags: [probabilidad, axiomas, kolmogorov]
fuentes: ["[[axiomas-probabilidad]]", "[[tp2-calculo-de-probabilidades]]", "[[video-axiomas]]"]
actualizado: 2026-09-04
---

# Axiomas de probabilidad (Kolmogorov)

**En breve.** Tres reglas mínimas (no negatividad, normalización, aditividad de
disjuntos) que toda asignación de probabilidad debe respetar; de ellas se deducen
todas las propiedades útiles (complemento, monotonía, unión). Es el cimiento sobre el
que se apoyan [[probabilidad-condicional|condicional]], [[independencia]] y
[[probabilidad-total-y-bayes|Bayes]].

Un **espacio de probabilidad** es un triplete $(S, \Sigma, P)$ con $S\neq\emptyset$,
$\Sigma$ una [[espacio-muestral-y-eventos|σ-álgebra]] de $S$, y
$P:\Sigma\to\mathbb{R}$ la **medida de probabilidad** que cumple:

1. $P(A) \ge 0 \quad \forall A\in\Sigma$.
2. $P(S) = 1$.
3. **σ-aditividad**: si $E_1, E_2, \dots$ son [[espacio-muestral-y-eventos|mutuamente excluyentes]], entonces $P\!\left(\bigcup_{i=1}^{\infty} E_i\right) = \sum_{i=1}^{\infty} P(E_i)$.

## Consecuencias (se deducen de los axiomas)
- **Complemento**: $P(A^c) = 1 - P(A)$.
  *(De $A\cup A^c = S$, m.e., y el 3er axioma.)*
- **Suceso imposible**: $P(\emptyset) = 0$.
- **Monotonía**: $A\subseteq B \Rightarrow P(A)\le P(B)$.
  *(Pues $B = A\cup(B\setminus A)$, m.e., y $P(B\setminus A)\ge 0$.)*
- **Probabilidad de la unión** (incluso si **no** son m.e.):
$$ P(A\cup B) = P(A) + P(B) - P(A\cap B). $$

> Si $A,B$ son m.e., $P(A\cap B)=0$ y se recupera $P(A\cup B)=P(A)+P(B)$.

> [!figura] u2-venn-inclusion-exclusion
> Las áreas son proporcionales a las probabilidades y el solape queda acotado al rango admisible $\max(0,\,P(A)+P(B)-1)\le P(A\cap B)\le\min(P(A),P(B))$. Al sumar $P(A)+P(B)$ la zona común se cuenta dos veces; restarla una vez devuelve $P(A\cup B)$, y con solape nulo se recupera la aditividad del tercer axioma.

- **Resta de sucesos**: si $B\subseteq A$, $P(A\setminus B)=P(A)-P(B)$ (resta
  *inclusiva*). Si no hay relación de inclusión entre $A$ y $B$, la fórmula general es
  $P(A\setminus B)=P(A)-P(A\cap B)$ (resta *no inclusiva*; se reduce a la anterior
  cuando $B\subseteq A$, porque ahí $A\cap B=B$). *Ojo* ([[video-axiomas]], 48:14):
  usar la fórmula inclusiva sin verificar que $B\subseteq A$ da un resultado mal
  calculado. Demostración con diagrama de Venn y ejemplo numérico completo en
  [[video-axiomas]].

> **Advertencia de notación ([[video-axiomas]], 43:17):** Los **sucesos** (conjuntos)
> se unen con $\cup$; las **probabilidades** (números) se suman o restan. La unión va
> siempre dentro del argumento de $P(\cdot)$ — $P(A\cup B)$ — nunca $P(A)\cup P(B)$ ni
> $P(A)+B$.

**Intuición.** La probabilidad puede pensarse como un **área total igual a 1** repartida sobre
$S$. El axioma 1 dice que no hay áreas negativas; el 2, que todo el universo "pesa" 1;
el 3, que pegar trozos que no se solapan suma sus áreas. La fórmula de la unión resta
$P(A\cap B)$ porque al sumar $P(A)$ y $P(B)$ la zona compartida se contó **dos veces**.

**Fundamento frecuentista.** Además de la intuición geométrica de "área total = 1",
[[video-axiomas|el video de la clase]] (30:27) da otro fundamento, frecuentista: antes
de enunciar los axiomas, construye la [[histograma-y-frecuencias|frecuencia relativa]]
$f_A=n_A/n$ de un suceso $A$ sobre $n$ repeticiones imaginarias del experimento y
define $P(A):=\lim_{n\to\infty} f_A$ (idea formalizada después por la
[[ley-de-grandes-numeros|Ley de los Grandes Números]]). Cada axioma se justifica
entonces como una propiedad que ya cumple la frecuencia relativa: por ejemplo, si
$A,B$ son mutuamente excluyentes, cada repetición cuenta para como máximo uno de los
dos, de donde $f_{A\cup B}=f_A+f_B$.

## Ejercicio resuelto
*Suma o bien 4 o bien 11 al tirar dos dados (Laplace + unión de m.e.).*

**Resolución.** $S$ tiene $36$ casos. "Suma $=4$": $\{(1,3),(2,2),(3,1)\}$ → $3$ casos.
"Suma $=11$": $\{(5,6),(6,5)\}$ → $2$ casos. Son **m.e.** (una suma no puede ser 4
y 11 a la vez), así que
$$ P(\text{4 o 11}) = \frac{3}{36} + \frac{2}{36} = \frac{5}{36}. $$
Ver [[regla-de-laplace]].

## Ejercicio resuelto — inclusión-exclusión de 3 eventos ([[tp2-calculo-de-probabilidades]] ej. 13)
*Entre 1000 unidades hay defectos $A,B,C$ contados (en cantidad de piezas) así:
$A{=}30$, $B{=}35$, $C{=}20$, $A\cap B{=}5$, $A\cap C{=}5$, $B\cap C{=}4$,
$A\cap B\cap C{=}2$. ¿Qué proporción de unidades es defectuosa?*

Defectuosa $= A\cup B\cup C$. Con la fórmula de inclusión-exclusión para 3 eventos
(generalización de la unión de a dos — ver [[tecnica-conteo-combinatoria]]):
$$
\begin{aligned}
P(A\cup B\cup C) ={}& P(A)+P(B)+P(C)\\
&- P(A\cap B)-P(A\cap C)-P(B\cap C)\\
&+ P(A\cap B\cap C).
\end{aligned}
$$
Dividiendo cada conteo por $1000$:
$$ P = \frac{30+35+20 - 5-5-4 + 2}{1000} = \frac{73}{1000} = 0.073. $$
Es decir, el $7.3\%$ de las unidades es defectuosa.

## Relación
La probabilidad de la unión y el complemento se usan constantemente en
[[independencia]], [[probabilidad-total-y-bayes]], [[arbol-de-probabilidades]],
[[leyes-de-de-morgan]] y [[tecnica-conteo-combinatoria]].
