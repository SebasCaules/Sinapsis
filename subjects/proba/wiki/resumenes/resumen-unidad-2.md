---
titulo: "Resumen de la Unidad 2 — Introducción a la Probabilidad"
tipo: resumen
unidad: 2
orden: 1
hub: true
tags: [resumen, probabilidad, condicional, bayes, conteo]
resumen: 'La Unidad 2 arma el modelo de la incertidumbre: espacio muestral y eventos, axiomas de Kolmogorov, Laplace y conteo, condicional $P(D\mid C)=P(D\cap C)/P(C)$, independencia $P(A\cap B)=P(A)P(B)$, probabilidad total, Bayes y árbol.'
fuentes: ["[[probabilidad]]", "[[espacio-muestral-y-eventos]]", "[[leyes-de-de-morgan]]", "[[axiomas-de-probabilidad]]", "[[regla-de-laplace]]", "[[tecnica-conteo-combinatoria]]", "[[probabilidad-condicional]]", "[[independencia]]", "[[probabilidad-total-y-bayes]]", "[[arbol-de-probabilidades]]", "[[formulario-probabilidad]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 2 — Introducción a la Probabilidad

Mientras la [[estadistica-descriptiva|estadística descriptiva]] de la Unidad 1 describe datos ya observados, la probabilidad **modela la incertidumbre de un experimento aleatorio antes de observarlo**. En esta unidad se construye todo el aparato: el lenguaje de conjuntos (espacio muestral y eventos), las reglas que toda probabilidad debe cumplir (axiomas de Kolmogorov), el cálculo por conteo cuando los casos son equiprobables, la probabilidad condicional, la independencia, la probabilidad total, el teorema de Bayes y el árbol de probabilidades. Es la base de la Unidad 3: una [[variable-aleatoria|variable aleatoria]] asigna números a los resultados del experimento y traslada la probabilidad $P$ a distribuciones. El mapa de enlaces de la unidad está en [[probabilidad|Introducción a la Probabilidad]].

> [!info] Lo esencial
> - Un evento es un subconjunto $A\subseteq S$ del espacio muestral; se opera con complemento, unión e intersección.
> - Toda probabilidad cumple $P(A)\ge 0$, $P(S)=1$ y aditividad para eventos mutuamente excluyentes; de ahí salen $P(A^c)=1-P(A)$ y la fórmula de la unión.
> - Con $S$ finito y equiprobable, $P(A)=|A|/|S|$: calcular se reduce a contar (orden y repetición deciden la fórmula).
> - Condicionar a $C$ es reducir el universo a $C$: $P(D\mid C)=P(D\cap C)/P(C)$.
> - Independencia es $P(A\cap B)=P(A)P(B)$; si $A$ y $B$ tienen probabilidad positiva, ser mutuamente excluyentes la impide.
> - Con una partición $\{A_k\}$, la probabilidad total arma $P(B)=\sum_k P(B\mid A_k)P(A_k)$ y Bayes invierte la condicional; el árbol organiza ambas cosas.

## 1. Espacio muestral y eventos

Un **experimento aleatorio** $E$ es aquel cuyos resultados son inciertos. El **espacio muestral** $S$ es el conjunto de **todos** los resultados posibles y un **evento** (suceso) $A$ es un subconjunto de resultados, $A\subseteq S$. Por ejemplo, al tirar un dado, $S=\{1,2,3,4,5,6\}$ y «sale par» es $A=\{2,4,6\}$. Con eventos se opera como con conjuntos: **complemento** $A^c=S\setminus A$ («no ocurre $A$»), **unión** $A\cup B$ («ocurre $A$ o $B$») e **intersección** $A\cap B$ («ocurre $A$ y $B$»). $S$ es el **suceso cierto** y $\emptyset$ el **suceso imposible**.

Dos eventos son **mutuamente excluyentes** (m.e.) cuando no pueden ocurrir juntos:

$$ A\cap B=\emptyset $$

Esta condición es la que permite **sumar** probabilidades en el tercer axioma.

La colección de eventos a los que se asigna probabilidad es una **σ-álgebra** $\Sigma$: contiene a $S$, es cerrada por complemento y por unión numerable (y, por De Morgan, también por intersección). Cuando $S$ es finito se toma $\Sigma=2^S$, todos los subconjuntos.

**Cómo reconocerlo:** todo ejercicio empieza por definir $S$ y nombrar los eventos con letras; traducir «y» como $\cap$, «o» como $\cup$ y «no» como complemento.

> [!nota] Notación
> En el wiki el complemento aparece con dos notaciones equivalentes: $A^c$ (axiomas, condicional, Bayes) y $\overline{A}$ o $\bar A$ (De Morgan, independencia).

Detalle: [[espacio-muestral-y-eventos|Espacio muestral y eventos]]

## 2. Leyes de De Morgan

Al **negar** una unión o una intersección, el complemento «entra» e **intercambia** $\cup$ por $\cap$. Negar «pasa al menos uno» es «no pasa ninguno» (intersección de complementos); negar «pasan los dos» es «falla al menos uno» (unión de complementos).

$$ \overline{C\cup D}=\overline{C}\cap\overline{D}, \qquad \overline{C\cap D}=\overline{C}\cup\overline{D} $$

Vale igual para $n$ eventos: $\overline{\bigcup_i A_i}=\bigcap_i\overline{A_i}$ y $\overline{\bigcap_i A_i}=\bigcup_i\overline{A_i}$. Combinada con el complemento da la versión probabilística:

$$ P\!\left(\overline{C}\cap\overline{D}\right)=1-P(C\cup D), \qquad P\!\left(\overline{C}\cup\overline{D}\right)=1-P(C\cap D) $$

**Cómo reconocerlo:** el enunciado pide la probabilidad de **«ninguno»**. Se pasa al complemento de la unión, $1-P(A_1\cup\cdots\cup A_n)$, y la unión se desarrolla con inclusión-exclusión. Ejemplo típico: grupo sanguíneo $0^-$, que es no tener ninguno de los antígenos $A$, $B$, $Rh$: $P(0^-)=1-P(A\cup B\cup Rh)=1-0.9=0.1$.

> [!figura] u2-de-morgan-cuatro-paneles
> Arriba, $(A\cup B)^c$ y $A^c\cap B^c$ sombrean exactamente la misma región; abajo ocurre lo mismo con $(A\cap B)^c$ y $A^c\cup B^c$. Es la comprobación visual de que negar convierte la unión en intersección y viceversa.

Detalle: [[leyes-de-de-morgan|Leyes de De Morgan]]

## 3. Axiomas de Kolmogorov y sus consecuencias

Un **espacio de probabilidad** es un triplete $(S,\Sigma,P)$, donde $P:\Sigma\to\mathbb{R}$ es la **medida de probabilidad**. Debe cumplir tres axiomas: **no negatividad**, **normalización** y **σ-aditividad** para eventos mutuamente excluyentes $E_1,E_2,\dots$

$$ P(A)\ge 0, \qquad P(S)=1, \qquad P\!\left(\bigcup_{i=1}^{\infty}E_i\right)=\sum_{i=1}^{\infty}P(E_i)\ \ (E_i\ \text{m.e.}) $$

De ellos se deducen las propiedades que se usan en todos los ejercicios: **complemento** $P(A^c)=1-P(A)$, **suceso imposible** $P(\emptyset)=0$ y **monotonía** ($A\subseteq B\Rightarrow P(A)\le P(B)$). La más usada es la **probabilidad de la unión**, válida aunque los eventos **no** sean m.e.:

$$ P(A\cup B)=P(A)+P(B)-P(A\cap B) $$

Se resta $P(A\cap B)$ porque, al sumar $P(A)$ y $P(B)$, la zona común se contó dos veces. Si $A$ y $B$ son m.e., $P(A\cap B)=0$ y queda $P(A\cup B)=P(A)+P(B)$. Para tres eventos, inclusión-exclusión:

$$ P(A\cup B\cup C)=P(A)+P(B)+P(C)-P(A\cap B)-P(A\cap C)-P(B\cap C)+P(A\cap B\cap C) $$

Para $n$ eventos, el mismo esquema alterna signos según la cantidad de eventos intersecados:

$$ P\!\left(\bigcup_{i=1}^{n}A_i\right)=\sum_i P(A_i)-\sum_{i<j}P(A_i\cap A_j)+\sum_{i<j<k}P(A_i\cap A_j\cap A_k)-\cdots+(-1)^{n+1}P(A_1\cap\cdots\cap A_n) $$

La **resta de sucesos** en general es $P(A\setminus B)=P(A)-P(A\cap B)$; solo si $B\subseteq A$ se reduce a $P(A)-P(B)$. El solape está acotado: $\max(0,\,P(A)+P(B)-1)\le P(A\cap B)\le\min(P(A),P(B))$.

**Intuición:** la probabilidad es un área total igual a 1 repartida sobre $S$. Con el enfoque frecuentista, $P(A)$ es el límite de la frecuencia relativa $f_A=n_A/n$, y cada axioma es una propiedad que ya cumple esa frecuencia.

**Cómo reconocerlo:** dan probabilidades de eventos y de sus intersecciones (o conteos sobre un total) y piden «alguno», «al menos uno» o «defectuosa por algún motivo»: unión con inclusión-exclusión.

> [!warn] Errores típicos
> Usar la resta inclusiva $P(A)-P(B)$ sin verificar que $B\subseteq A$ da un resultado mal calculado. Y los sucesos se unen dentro de $P(\cdot)$: se escribe $P(A\cup B)$, nunca $P(A)\cup P(B)$ ni $P(A)+B$.

> [!figura] u2-venn-inclusion-exclusion
> Las áreas son proporcionales a las probabilidades y el solape queda acotado al rango admisible $\max(0,\,P(A)+P(B)-1)\le P(A\cap B)\le\min(P(A),P(B))$. Al sumar $P(A)+P(B)$ la zona común se cuenta dos veces; restarla una vez devuelve $P(A\cup B)$, y con solape nulo se recupera la aditividad del tercer axioma.

Detalle: [[axiomas-de-probabilidad|Axiomas de probabilidad (Kolmogorov)]]

## 4. Regla de Laplace

Cuando el espacio muestral $S$ es **finito** y todos sus resultados son **equiprobables**, cada resultado vale $1/|S|$ y la probabilidad de un evento es la fracción del universo que ocupa:

$$ P(A)=\frac{\text{casos favorables}}{\text{casos posibles}}=\frac{|A|}{|S|} $$

Aquí $|A|$ es la cantidad de resultados que cumplen el evento y $|S|$ la cantidad total de resultados. Calcular probabilidades se reduce así a **contar**. Ejemplo: la suma de dos dados es 8 en $\{(2,6),(3,5),(4,4),(5,3),(6,2)\}$, de modo que $P=5/36$.

**Cómo reconocerlo:** dados, monedas, cartas, filas o urnas «al azar», donde todos los resultados elementales pesan lo mismo.

> [!warn] Solo con casos equiprobables
> Si los casos no son equiprobables, hay que volver a los axiomas. En dos dados, Laplace se aplica sobre las 36 celdas $(i,j)$ y no sobre los 11 valores de la suma: repartir $\tfrac{1}{11}$ entre las sumas daría $0.0909$ en lugar de $\tfrac{5}{36}$.

> [!figura] u2-suma-dos-dados-no-equiprobable
> A la izquierda, las 36 celdas equiprobables coloreadas según su suma; a la derecha, la cantidad de casos de cada suma. Laplace se aplica sobre las 36 celdas y no sobre los 11 valores de la suma: repartir $\tfrac{1}{11}$ entre las sumas daría $0.0909$ en lugar de $\tfrac{5}{36}$.

Detalle: [[regla-de-laplace|Regla de Laplace]]

## 5. Conteo y combinatoria

Para aplicar Laplace hay que contar casos favorables y posibles. La **regla de la suma** dice que, si $A_1,\dots,A_n$ son disjuntos, $|\bigcup_i A_i|=\sum_i|A_i|$ (alternativas excluyentes, «o»). La **regla del producto** dice que, en etapas sucesivas, si una elección se hace de $n$ formas y la siguiente de $m$, hay $n\cdot m$ en total («y», «luego»). Para elegir $r$ elementos de entre $n$ se responden dos preguntas, **¿importa el orden?** y **¿se puede repetir?**, que ubican el caso en la tabla de las cinco formas:

| | Importa el orden | No importa el orden |
|---|---|---|
| Sin repetición | $\dfrac{n!}{(n-r)!}$ (variaciones) | $\dbinom{n}{r}$ (combinaciones) |
| Con repetición | $n^{r}$ | $\dbinom{n+r-1}{r}$ |

La quinta forma es ordenar los $n$ objetos completos: $n!$ (permutaciones). Las combinaciones son las variaciones divididas por los $r!$ ordenamientos que ya no se distinguen:

$$ \binom{n}{r}=\frac{n!}{r!\,(n-r)!} $$

Otras herramientas: **complemento** («al menos uno» se cuenta como $1-P(\text{ninguno})$), **inclusión-exclusión** con $|\cdot|$ en lugar de $P(\cdot)$, la **regla del palomar** (si $n>m$ objetos van a $m$ conjuntos, alguno tiene más de uno) e identidades como $\binom{n}{r}=\binom{n}{n-r}$, Pascal y el binomio de Newton $(x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^ky^{n-k}$.

**Con y sin reposición.** Al extraer una muestra de $n$ entre $N$ elementos con $R$ defectuosos, la probabilidad de $k$ defectuosos sale por conteo y da el origen de dos distribuciones de la Unidad 3: con reposición se obtiene la [[distribucion-binomial|Binomial]] y sin reposición, la [[distribucion-hipergeometrica|Hipergeométrica]].

$$ P(k)=\binom{n}{k}p^k(1-p)^{n-k}\ \ \left(p=\tfrac{R}{N}\right), \qquad P(k)=\frac{\binom{R}{k}\binom{N-R}{n-k}}{\binom{N}{n}} $$

Aquí $R$ es la cantidad de defectuosos (elementos «especiales») del lote; en la Unidad 3 y en el formulario ese mismo parámetro se llama $M$. Cuando $N$, $R$ y $N-R$ son mucho mayores que $n$, ambas se aproximan: las probabilidades con y sin reposición son casi iguales.

**Cómo reconocerlo:** «y / luego» multiplica; «o» entre excluyentes suma; «al menos uno» o «ninguno» pide complemento; si importa el orden, variaciones o permutaciones; si no, combinaciones; reposición o no decide la fila de la tabla.

> [!warn] No olvidar permutaciones
> Al contar casos favorables hay que incluir las permutaciones internas (por ejemplo, el $2!$ de intercambiar a dos personas dentro de un bloque) y cubrir todos los casos m.e. El TP2 advierte que omitir el $2!$ da un resultado erróneo.

> [!figura] u2-curva-cumpleanos
> La curva de $P(\text{al menos dos coinciden})$ cruza el $0.5$ en $n=23$ y llega a $0.99$ en $n=57$ (su complemento, todos distintos, cae a $0.01$). El crecimiento sigue a la cantidad de pares $\binom{n}{2}$ y no a $n$, y por eso el salto ocurre mucho antes de lo que sugieren los 365 días.

Detalle: [[tecnica-conteo-combinatoria|Técnica: conteo y combinatoria]]

## 6. Probabilidad condicional

La probabilidad de $D$ **dado** $C$ mide la chance de $D$ sabiendo que $C$ ocurrió. Condicionar es **reducir el universo** de $S$ a $C$: $C$ pasa a ser el nuevo suceso cierto y se mira qué fracción de $C$ también cumple $D$.

$$ P(D\mid C)=\frac{P(D\cap C)}{P(C)}, \qquad P(C)\neq 0 $$

Si $P(C)=0$ la condicional no está definida. Reordenada da la **regla de la multiplicación**, base de la probabilidad total, de Bayes y del árbol:

$$ P(D\cap C)=P(D\mid C)\,P(C) $$

La condicional cumple todos los axiomas: es una probabilidad legítima sobre el universo reducido. Ejemplo: con dos dados, si la suma es $\ge 8$ (15 casos), la probabilidad de suma par es $P(D\mid C)=\frac{9/36}{15/36}=\frac{3}{5}$.

**Cómo reconocerlo:** frases como «si…», «sabiendo que…», «dado que…», «de los casos en que…».

> [!warn] El condicionante queda fijo
> Es **falso** que $P(A\mid B)=1-P(A\mid B^c)$: las dos condicionales restringen el universo a conjuntos distintos. Las propiedades derivadas de los axiomas (complemento, monotonía, etc.) valen solo mientras el evento condicionante se mantenga fijo; lo correcto es $P(A^c\mid B)=1-P(A\mid B)$.

> [!figura] u2-dados-condicional-grilla
> Las 36 celdas equiprobables de $S$, con $C=\{\text{suma}\ge 8\}$ marcado en el borde y $D=\{\text{suma par}\}$ en el relleno. Al restringir el universo a $C$ ninguna celda cambia de lugar: solo cae el denominador, de 36 casos a 15, y por eso $P(D)=\tfrac12$ se convierte en $P(D\mid C)=\tfrac{9}{15}$.

Detalle: [[probabilidad-condicional|Probabilidad condicional]]

## 7. Independencia de eventos

Dos eventos son **independientes** cuando saber que uno ocurrió no cambia la probabilidad del otro. Entonces la probabilidad de la intersección es el **producto**:

$$ P(A\cap B)=P(A)\,P(B) $$

Si $P(C)\neq 0$, equivale a $P(D\mid C)=P(D)$. Una colección $\{A_k\}$ es independiente si $P\!\left(\bigcap_{k\in J} A_k\right)=\prod_{k\in J} P(A_k)$ para **toda** subcolección finita $J$; no basta con que se cumpla para la intersección completa. Si $A$ y $B$ son independientes, también lo son $A$ y $\bar B$, $\bar A$ y $B$, y $\bar A$ y $\bar B$. Además, $\emptyset$ y $S$ son independientes de todo evento. Para la unión de independientes:

$$ P(A\cup B)=P(A)+P(B)-P(A)\,P(B) $$

**Fiabilidad de sistemas** (componentes independientes, $p_i$ = probabilidad de que el componente $i$ funcione): en **serie** todos deben funcionar y se multiplica; en **paralelo** basta con uno y se toma el complemento del producto de fallas.

$$ P_{\text{serie}}=\prod_{i=1}^{n}p_i, \qquad P_{\text{par}}=1-\prod_{i=1}^{n}(1-p_i) $$

**Cómo reconocerlo:** el enunciado dice «independientes», o se trata de tiradores, extracciones con reposición, contactos o relevadores. En ese caso se multiplica; para «al menos uno» en $n$ ensayos independientes de probabilidad $p$, $P=1-(1-p)^n$.

> [!warn] Mutuamente excluyentes no equivale a independientes
> Si $A$ y $B$ son m.e. y ambos tienen probabilidad positiva, **no** son independientes: saber que ocurrió $A$ asegura que $B$ no ocurrió. Y la independencia no impide que un evento restrinja los *resultados* posibles del otro; lo que no cambia es su *probabilidad* (dado mayor que 4 y dado par son independientes aunque, sabiendo lo primero, el único par posible es 6).

> [!figura] u2-independencia-rectangulo
> Con $A$ definido por filas y $B$ por columnas, la intersección es siempre un rectángulo y su fracción de área es el producto de las dos bandas: $P(A\cap B)=P(A)P(B)$. Al reemplazar $B$ por un evento diagonal, como la suma, el recorte deja de ser rectangular y la igualdad se rompe: conocer $A$ pasa a cambiar la fracción de casos de $B$, que con independencia es la misma dentro de $A$ que en todo $S$.

> [!figura] u2-serie-paralelo-fiabilidad
> El circuito del enunciado: las dos ramas en serie conectadas en paralelo, con cada contacto coloreado según su estado. La comparación en escala logarítmica muestra lo que aporta duplicar la rama: la probabilidad de falla baja de $1.99\times 10^{-2}$ a $3.96\times 10^{-4}$. Al hacer clic en un contacto se lo fuerza a fallar, y el rótulo de arriba dice si el circuito sigue conduciendo con los contactos abiertos elegidos.

Detalle: [[independencia|Independencia de eventos]]

## 8. Probabilidad total y teorema de Bayes

Una **partición** de $S$ es una colección $\{A_k\}$ de eventos mutuamente excluyentes ($A_k\cap A_j=\emptyset$ si $k\neq j$) que cubre todo $S$ ($S=\bigcup_k A_k$); el caso más simple es $\{A,A^c\}$. La **probabilidad total** arma $P(B)$ sumando lo que aporta cada caso de la partición, usando la regla de la multiplicación en cada pedazo $B\cap A_k$:

$$ P(B)=\sum_k P(B\cap A_k)=\sum_k P(B\mid A_k)\,P(A_k) $$

El **teorema de Bayes** **invierte la condicional**: se conoce $P(B\mid A_i)$ (de la causa al efecto) y se quiere $P(A_i\mid B)$ (del efecto observado a la causa). El denominador es la probabilidad total:

$$ P(A_i\mid B)=\frac{P(B\mid A_i)\,P(A_i)}{\sum_k P(B\mid A_k)\,P(A_k)} $$

$P(A_i)$ es la probabilidad **a priori** (antes de la información extra) y $P(A_i\mid B)$ la **a posteriori** (después de observar $B$). En los problemas de test diagnóstico se usa la forma con partición binaria:

$$ P(E\mid +)=\frac{P(+\mid E)\,P(E)}{P(+\mid E)\,P(E)+P(+\mid E^c)\,P(E^c)} $$

Aquí $P(+\mid E)$ es la **sensibilidad**, $P(-\mid E^c)$ la **especificidad** y $P(E)$ la **prevalencia**. El falso positivo es $P(+\cap E^c)$ y el falso negativo, $P(-\cap E)$.

**Intuición:** una causa rara (a priori chica) puede seguir siendo improbable aun con un síntoma que la sugiere fuertemente, porque el denominador normaliza entre todos los caminos que llegan a $B$.

**Cómo reconocerlo:** dan las condicionales «al revés» de lo que se pide (dan $P(+\mid E)$ y piden $P(E\mid +)$), o el universo se divide en casos (sexo, máquina, proveedor, enfermo o sano).

> [!figura] u2-bayes-mosaico-area
> El cuadrado de área 1 partido por el prior (ancho de cada columna) y por la verosimilitud (alto dentro de cada columna): $P(B)$ es la franja de positivos completa y $P(A_i\mid B)$ es la fracción verde de esa franja. Note que con prevalencia baja el rectángulo de falsos positivos es delgado pero se apoya sobre una columna mucho más ancha, y eso es lo que mantiene baja la probabilidad a posteriori.

Detalle: [[probabilidad-total-y-bayes|Probabilidad total y teorema de Bayes]]

## 9. Árbol de probabilidades

El **árbol** organiza un experimento **por etapas**: cada nivel se ramifica según los resultados posibles y cada arista lleva una probabilidad **condicional**. Se arma y se lee con cuatro reglas: (1) cada arista lleva la probabilidad del nodo hijo **dada** la intersección de todos sus antepasados; (2) los hijos de un nodo forman una **partición**; (3) las aristas que salen de un nodo **suman 1**; (4) la probabilidad de un camino es el **producto** de sus aristas.

$$ P(A\cap B)=P(A)\,P(B\mid A) $$

Esa es la regla 4 (regla de la multiplicación) aplicada a un camino de dos etapas. La **probabilidad total** de $B$ es la suma de las hojas que terminan en $B$, y **Bayes** es «invertir el árbol»:

$$ P(\text{rama}\mid B)=\frac{\text{prob. del camino que pasa por la rama y llega a }B}{P(B)} $$

Si las etapas son independientes, las etiquetas no dependen del camino: todas las ramas de un mismo nivel son iguales. Ejemplo: con $P(V)=0.47$, $P(D\mid V)=0.04$ y $P(D\mid\bar V)=0.02$, las hojas con $D$ valen $0.0188$ y $0.0106$, entonces $P(D)=0.0294$ y $P(V\mid D)=0.0188/0.0294\approx 0.6395$.

**Cómo reconocerlo:** «primero…, luego…», extracciones sucesivas sin reposición, canales con repetidores, mezclas de lotes. Es el método más seguro en problemas de varias fases.

> [!figura] u2-arbol-bayes-invertido
> El árbol de dos niveles del ejemplo de daltónicos, con las cuatro reglas de arriba en acción: cada arista lleva $P(\text{hijo}\mid\text{antepasados})$, los hijos de un nodo son una partición, las aristas hermanas suman 1 y cada hoja es el producto de las etiquetas de su camino. Al invertir el árbol las hojas conservan exactamente su valor y solo cambian las etiquetas de las aristas, que pasan a ser las probabilidades a posteriori: eso, y nada más, es el teorema de Bayes.

Detalle: [[arbol-de-probabilidades|Árbol de probabilidades]]

## Cómo aparece en los parciales

Los patrones de ejercicio que aparecen en las páginas de la unidad (sobre todo en el [[tp2-calculo-de-probabilidades|TP2]]):

- **Inclusión-exclusión de tres eventos.** Conteos de defectos $A$, $B$, $C$ en 1000 unidades y sus intersecciones; la proporción defectuosa es $P(A\cup B\cup C)=73/1000=0.073$ (TP2 ej. 13).
- **«Ninguno» con De Morgan.** Grupo sanguíneo $0^-$ como $\overline{A}\cap\overline{B}\cap\overline{Rh}$, que da $1-P(A\cup B\cup Rh)=0.1$ (TP2 ej. 14). También se usa para reescribir $\overline{\overline{X}\cup\overline{Y}}=X\cap Y$ (TP2 ej. 28).
- **M.e. contra independientes.** Con $P(A)=0.4$ y $P(A\cup B)=0.7$: si son m.e., $P(B)=0.3$; si son independientes, $0.7=0.4+p-0.4p$ y $P(B)=0.5$ (TP2 ej. 12).
- **Laplace con conteo de posiciones.** Ocho personas en fila: contiguos $\frac{7\cdot 2!\cdot 6!}{8!}=\frac14$; exactamente dos entre ellos $\frac{5\cdot 2!\cdot 6!}{8!}=\frac{5}{28}$ (TP2 ej. 33).
- **Cartas sin orden.** Dos cartas de 48 españolas: dos espadas $\binom{12}{2}/\binom{48}{2}=\frac{11}{188}$; mismo palo $4\cdot\frac{11}{188}=\frac{11}{47}$; distinto palo por complemento, $\frac{36}{47}$ (TP2 ej. 37). Póker en 5 de 52: $624/\binom{52}{5}\approx 0.00024$.
- **Complemento para «al menos dos iguales».** Problema del cumpleaños: con $n=23$ personas la probabilidad ya supera $0.5$.
- **Derivar Binomial e Hipergeométrica por conteo** según haya o no reposición (TP2 ej. 4).
- **Exactamente uno / exactamente dos con independencia.** Dos tiradores con $0.6$ y $0.7$: ambos aciertan con probabilidad $0.42$; exactamente uno, $0.6\cdot 0.3+0.4\cdot 0.7=0.46$.
- **Fiabilidad serie-paralelo.** Dos ramas de dos contactos en serie, en paralelo, cada contacto con falla $10^{-2}$: $P=1-(1-0.99^2)^2\approx 0.999604$ (TP2 ej. 20).
- **Test diagnóstico con Bayes.** Sensibilidad $0.9$, especificidad $0.99$, prevalencia $0.05$: $P(+)=0.0545$, falso positivo $0.0095$, falso negativo $0.005$, $P(E\mid +)\approx 0.8257$; con dos tests independientes dada la condición, $P(E\mid +_1\cap +_2)\approx 0.9977$ (TP2 ej. 25).
- **Árbol de dos niveles y Bayes.** Daltónicos por sexo: $P(V\mid D)\approx 0.6395$. Otros árboles del TP2: mezcla de calidades resuelta con árbol y tabla $2\times 3$ (ej. 30) y canal binario con tres repetidores, donde la cadena de inversiones da $P(R_1\mid T_1)=0.756$ y Bayes da $P(T_1\mid R_1)=0.87848$ (ej. 29).
- **Condicionar por una partición e independencia dentro de cada rama.** Juego con un mazo de 5 cartas y una moneda: $M$ es el resultado de la moneda y $G$ es ganar, que ocurre con a lo sumo una carta par. Se condiciona por la moneda, $P(G)=P(G\mid M)P(M)+P(G\mid\bar M)P(\bar M)$, y dentro de cada rama se usa independencia entre las extracciones; resultado, $P(G)=93/125$. Sirve cuando los eventos no son independientes en total pero sí dentro de cada caso.

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| Axiomas de Kolmogorov | $P(A)\ge 0,\ P(S)=1,\ P(\bigcup_i E_i)=\sum_i P(E_i)$ | Definición; los $E_i$ deben ser m.e. |
| Complemento | $P(A^c)=1-P(A)$ | «Al menos uno», «ninguno», cuando el complemento es más fácil |
| Suceso imposible y monotonía | $P(\emptyset)=0$; $A\subseteq B\Rightarrow P(A)\le P(B)$ | Consecuencias directas de los axiomas |
| Unión de dos eventos | $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ | Siempre; si son m.e., el último término es 0 |
| Inclusión-exclusión de tres | $P(A\cup B\cup C)=P(A)+P(B)+P(C)-P(A\cap B)-P(A\cap C)-P(B\cap C)+P(A\cap B\cap C)$ | «Alguno de tres» con intersecciones dadas |
| Resta de sucesos | $P(A\setminus B)=P(A)-P(A\cap B)$ | «$A$ pero no $B$»; solo si $B\subseteq A$ queda $P(A)-P(B)$ |
| Cota del solape | $\max(0,P(A)+P(B)-1)\le P(A\cap B)\le\min(P(A),P(B))$ | Acotar la intersección cuando no se conoce |
| De Morgan | $P(\overline{C}\cap\overline{D})=1-P(C\cup D)$ | Probabilidad de «ninguno» |
| Regla de Laplace | $P(A)=\lvert A\rvert/\lvert S\rvert$ | $S$ finito y equiprobable |
| Variaciones | $n!/(n-r)!$ | Importa el orden, sin repetición |
| Combinaciones | $\binom{n}{r}=\frac{n!}{r!(n-r)!}$ | No importa el orden, sin repetición |
| Con repetición | $n^r$ y $\binom{n+r-1}{r}$ | Con orden y sin orden, respectivamente |
| Permutaciones | $n!$ | Ordenar los $n$ objetos |
| Condicional | $P(D\mid C)=\frac{P(D\cap C)}{P(C)}$ | «Dado que», «sabiendo que»; requiere $P(C)\neq 0$ |
| Regla de la multiplicación | $P(D\cap C)=P(D\mid C)\,P(C)$ | Etapas sucesivas, caminos del árbol |
| Independencia | $P(A\cap B)=P(A)\,P(B)$ | Enunciado dice «independientes» |
| Complementos de independientes | $P(A\cap\bar B)=P(A)P(\bar B)$; ídem con $\bar A,B$ y $\bar A,\bar B$ | Si $A,B$ son independientes, también sus complementos |
| Unión de independientes | $P(A\cup B)=P(A)+P(B)-P(A)P(B)$ | Unión cuando hay independencia |
| Al menos uno en $n$ ensayos | $1-(1-p)^n$ | Ensayos independientes de probabilidad $p$ |
| Serie / paralelo | $\prod_i p_i$ y $1-\prod_i(1-p_i)$ | Fiabilidad con componentes independientes |
| Probabilidad total | $P(B)=\sum_k P(B\mid A_k)P(A_k)$ | El universo se divide en casos (partición) |
| Bayes | $P(A_i\mid B)=\frac{P(B\mid A_i)P(A_i)}{\sum_k P(B\mid A_k)P(A_k)}$ | Dan la condicional al revés de lo pedido |
| Bayes binario | $P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B\mid A)P(A)+P(B\mid A^c)P(A^c)}$ | Test y diagnóstico (partición $\{A,A^c\}$) |
| Cumpleaños | $1-\frac{365\cdot 364\cdots(365-n+1)}{365^n}$ | Al menos dos coincidencias entre $n$ personas |

La hoja completa, con identidades combinatorias y la inclusión-exclusión general, está en [[formulario-probabilidad|Formulario — Probabilidad]].
