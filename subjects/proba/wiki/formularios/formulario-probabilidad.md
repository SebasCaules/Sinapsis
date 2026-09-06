---
titulo: Formulario — Probabilidad
resumen: "Hoja de la unidad 2: axiomas y sus consecuencias, conteo, probabilidad condicional y regla del producto, árbol de probabilidades, probabilidad total y Bayes, independencia, fiabilidad de sistemas y patrones clásicos de ejercicio."
tipo: formulario
unidad: 2
orden: 11
tags: [probabilidad, formulario, cheat-sheet, conteo, bayes]
fuentes: ["[[axiomas-de-probabilidad]]", "[[leyes-de-de-morgan]]", "[[regla-de-laplace]]", "[[tecnica-conteo-combinatoria]]", "[[probabilidad-condicional]]", "[[independencia]]", "[[probabilidad-total-y-bayes]]", "[[arbol-de-probabilidades]]", "[[tp2-calculo-de-probabilidades]]"]
actualizado: 2026-09-04
---

# Formulario — Probabilidad

Hoja de fórmulas de la unidad 2. El detalle conceptual está en
[[probabilidad]], [[axiomas-de-probabilidad]], [[probabilidad-condicional]],
[[independencia]] y [[probabilidad-total-y-bayes]].

> Antes de elegir fórmula, ubique el problema: si el espacio es finito y
> equiprobable, todo se reduce a **contar** ([[regla-de-laplace]] +
> [[tecnica-conteo-combinatoria]]); si el enunciado avanza **por etapas**, arme el
> [[arbol-de-probabilidades|árbol]] y multiplique a lo largo del camino; si aparece
> "al menos uno" o "ninguno", pase al **complemento** vía
> [[leyes-de-de-morgan|De Morgan]].

## Axiomas y consecuencias

| Objeto | Fórmula |
|---|---|
| Axiomas de Kolmogorov | $P(A)\ge 0 \qquad P(S)=1 \qquad P\!\left(\bigcup_{i=1}^{\infty}E_i\right)=\sum_{i=1}^{\infty}P(E_i)\ \ (E_i\ \text{m.e.})$ |
| Complemento | $P(A^c)=1-P(A)$ |
| Suceso imposible | $P(\emptyset)=0$ |
| Monotonía | $A\subseteq B\Rightarrow P(A)\le P(B)$ |
| Unión (incl.–excl. 2) | $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ |
| Unión m.e. | $P(A\cup B)=P(A)+P(B)$ |
| Cota del solape | $\max\big(0,\,P(A)+P(B)-1\big)\le P(A\cap B)\le\min\big(P(A),P(B)\big)$ |

**De Morgan (probabilidades):** $P(\overline{C}\cap\overline{D})=1-P(C\cup D)$ y
$P(\overline{C}\cup\overline{D})=1-P(C\cap D)$.

**Regla de Laplace** (solo con $S$ finito y resultados equiprobables):
$$ P(A)=\frac{\text{casos favorables}}{\text{casos posibles}}=\frac{|A|}{|S|}. $$

## Conteo — lo que no está en la tabla básica

| Objeto | Fórmula |
|---|---|
| Permutaciones de $n$ (desarrollado) | $n!=n(n-1)(n-2)\cdots 2\cdot 1$ |
| Variaciones (desarrollado) | $\dfrac{n!}{(n-r)!}=n(n-1)\cdots(n-r+1)$ |
| Combinaciones | $\dbinom{n}{r}=\dfrac{n!}{r!\,(n-r)!}$ |
| Con repetición, importa el orden | $n^{r}$ |
| Con repetición, no importa el orden | $\dbinom{n+r-1}{r}$ |

**Inclusión–exclusión general:**
$$ \left|\bigcup_{i=1}^{n} A_i\right| = \sum_i |A_i| - \sum_{i<j}|A_i\cap A_j| + \sum_{i<j<k}|A_i\cap A_j\cap A_k| - \cdots + (-1)^{n+1}\left|A_1\cap\cdots\cap A_n\right|. $$
El mismo esquema vale reemplazando $|\cdot|$ por $P(\cdot)$.

- **Identidad alternante:** $\displaystyle\sum_{k=0}^{n}(-1)^k\binom{n}{k}=0$
- **Binomio de Newton:** $\displaystyle(x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^k y^{n-k}$
- **Regla del palomar (forma general):** $n=km+1 \Rightarrow \exists\, j:\ |A_j|\ge k+1$, con $n$ objetos repartidos en $m$ conjuntos $A_1,\dots,A_m$
- **Muestreo con reposición vs. sin reposición:** si $N,\,R,\,N-R\gg n$, entonces $\dfrac{\binom{R}{k}\binom{N-R}{n-k}}{\binom{N}{n}}\approx\binom{n}{k}p^k(1-p)^{n-k}$ con $p=R/N$ (ver [[distribucion-binomial]] y [[distribucion-hipergeometrica]])

## Condicional, árbol y regla del producto

| Objeto | Fórmula |
|---|---|
| Probabilidad condicional | $P(D\mid C)=\dfrac{P(D\cap C)}{P(C)}\quad (P(C)\neq 0)$ |
| Regla del producto | $P(D\cap C)=P(D\mid C)\,P(C)$ |
| Regla del producto (camino del árbol) | $P(A\cap B)=P(A)\,P(B\mid A)$ |
| Aristas de un nodo (regla 3 del árbol) | $\sum_k P(H_k\mid A)=1$, con $\{H_k\}$ los hijos de $A$ |

## Probabilidad total y Bayes

**Partición** $\{A_k\}$ de $S$: $A_k\cap A_j=\emptyset$ ($k\neq j$) y $S=\bigcup_k A_k$; el caso simple es $\{A,A^c\}$.

**Probabilidad total:**
$$ P(B)=\sum_k P(B\cap A_k)=\sum_k P(B\mid A_k)\,P(A_k). $$

**Teorema de Bayes:**
$$ P(A_i\mid B)=\frac{P(B\mid A_i)\,P(A_i)}{\sum_k P(B\mid A_k)\,P(A_k)}. $$

**Bayes — partición binaria** (la forma que sale en los problemas de test y diagnóstico):
$$ P(A\mid B)=\frac{P(B\mid A)\,P(A)}{P(B\mid A)\,P(A)+P(B\mid A^c)\,P(A^c)}. $$

## Independencia — consecuencias

| Objeto | Fórmula |
|---|---|
| Definición | $A,B\ \text{indep.}\iff P(A\cap B)=P(A)\,P(B)$ |
| Caracterización por la condicional | $P(D\mid C)=P(D)\quad (P(C)\neq 0)$ |
| Colección de eventos | $P\!\left(\bigcap_k A_k\right)=\prod_k P(A_k)$ |
| Complemento a la derecha | $P(A\cap\bar B)=P(A)\,P(\bar B)$ |
| Complemento a la izquierda | $P(\bar A\cap B)=P(\bar A)\,P(B)$ |
| Ambos complementos | $P(\bar A\cap\bar B)=P(\bar A)\,P(\bar B)$ |
| Deducción del complemento | $P(A\cap\bar B)=P(A)-P(A)P(B)=P(A)\big(1-P(B)\big)$ |
| Unión de independientes | $P(A\cup B)=P(A)+P(B)-P(A)\,P(B)$ |
| $\emptyset$ independiente de todo | $P(A\cap\emptyset)=0=P(A)\cdot 0$ |
| $S$ independiente de todo | $P(A\cap S)=P(A)=P(A)\cdot 1$ |

> ⚠️ Mutuamente excluyentes $\neq$ independientes: si $A,B$ son m.e. y ambos tienen
> probabilidad positiva, **no** son independientes.

## Fiabilidad de sistemas

Con componentes independientes, $p_i$ la probabilidad de que el componente $i$
**funcione** y $q_i=1-p_i$ la de que falle ([[independencia]], [[tp2-calculo-de-probabilidades]] ej. 20).

- **Componente:** $p_i=1-q_i$
- **Serie ($n$ componentes):** $P_{\text{serie}}=\displaystyle\prod_{i=1}^{n} p_i$
- **Paralelo ($n$ componentes):** $P_{\text{par}}=1-\displaystyle\prod_{i=1}^{n}(1-p_i)$
- **Dos ramas de a dos, en paralelo (caso del TP2):** $P=1-\left(1-p^2\right)^2$

## Patrones clásicos

- **Problema del cumpleaños:** $P(\text{al menos 2 iguales})=1-\dfrac{365\cdot 364\cdots (365-n+1)}{365^{\,n}}$
- **"Al menos uno" en $n$ ensayos independientes de probabilidad $p$:** $P=1-(1-p)^{n}$

## Cuándo usar qué

- Espacio **finito y equiprobable** → [[regla-de-laplace|Laplace]]: cuente favorables y posibles; decida antes si importa el orden y si hay reposición.
- Aparece **"al menos uno"** o **"ninguno"** → complemento y [[leyes-de-de-morgan|De Morgan]]; con varios eventos superpuestos, inclusión–exclusión.
- El experimento avanza **por etapas** ("primero…, luego…") → [[arbol-de-probabilidades|árbol]]: multiplicar a lo largo del camino, sumar las hojas.
- Dan las **condicionales al revés** de lo que se pide ($P(+\mid E)$ y piden $P(E\mid +)$) → probabilidad total en el denominador y **Bayes**.
- El enunciado dice **"independientes"** → multiplique; si además pregunta por complementos, use las tres parejas de la tabla.
- Circuitos, relevadores o **redundancia** → serie es producto, paralelo es complemento del producto de fallas.
