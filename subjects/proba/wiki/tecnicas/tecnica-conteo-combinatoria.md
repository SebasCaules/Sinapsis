---
titulo: "Técnica: conteo y combinatoria"
resumen: "Herramientas para contar casos favorables y posibles al aplicar la regla de Laplace: reglas de suma y producto, las cinco formas de elegir u ordenar $r$ entre $n$ según orden y repetición, inclusión-exclusión y paso al complemento."
tipo: tecnica
unidad: 2
orden: 6
tags: [probabilidad, conteo, combinatoria, laplace, parcial]
fuentes: ["[[regla-de-laplace-slides]]", "[[tp2-calculo-de-probabilidades]]"]
actualizado: 2026-09-04
---

# Técnica: conteo y combinatoria

**En breve.** Caja de herramientas para contar casos favorables y posibles y así
aplicar la [[regla-de-laplace|regla de Laplace]]: reglas de suma y producto, las cinco
formas de elegir/ordenar, inclusión-exclusión, complemento y palomar. Es la base
combinatoria de la [[distribucion-binomial|Binomial]] y la
[[distribucion-hipergeometrica|Hipergeométrica]].

Para aplicar la [[regla-de-laplace]] hay que **contar** casos favorables y
posibles. Herramientas:

## Principios básicos
- **Regla de la suma**: si $A_1,\dots,A_n$ son **disjuntos**,
  $\left|\bigcup_i A_i\right| = \sum_i |A_i|$. (En la heladera hay 4 manzanas y 5 peras:
  $4+5=9$ frutas de dónde elegir.)
- **Regla del producto** (multiplicación): para el producto cartesiano,
  $|A_1\times\cdots\times A_n| = \prod_i |A_i|$. Si una elección se hace de $n$ formas y
  otra (a continuación) de $m$, en conjunto hay $n\times m$. (4 manzanas y 5 peras →
  $4\cdot 5=20$ pares.) Sirve para **etapas sucesivas**.
- **Complemento** ("al menos una vez"): muchas veces es más fácil contar lo que
  **no** pasa y usar $P(A)=1-P(A^c)$ (ver [[leyes-de-de-morgan]] para pasar
  "ninguno" → complemento de la unión).

## Catálogo combinatorio (TP2 §1)
Según [[tp2-calculo-de-probabilidades]] (repaso, págs. 4-6).

### Las 5 formas de elegir / ordenar
Elegir $r$ elementos de entre $n$:

| | **Importa el orden** | **No importa el orden** |
|---|---|---|
| **Sin repetición** | $\dfrac{n!}{(n-r)!}=n(n-1)\cdots(n-r+1)$ (variaciones) | $\dbinom{n}{r}=\dfrac{n!}{r!\,(n-r)!}$ (combinaciones) |
| **Con repetición** | $n^{r}$ | $\dbinom{n+r-1}{r}$ |

Además, **ordenar** los $n$ objetos completos: $n! = n(n-1)\cdots 2\cdot 1$ (permutaciones).

**Intuición.** Antes de elegir fórmula, conteste **dos preguntas**: (1) ¿importa el
orden? y (2) ¿se puede repetir? Esas dos respuestas ubican el caso en una celda de la
tabla. Las **combinaciones** $\binom{n}{r}$ son las variaciones $\tfrac{n!}{(n-r)!}$
"divididas por el $r!$" de los ordenamientos que ya no quiere distinguir.

### Inclusión-exclusión
Para 2 conjuntos: $|A_1\cup A_2| = |A_1| + |A_2| - |A_1\cap A_2|$.
Para 3: $|A\cup B\cup C| = |A|+|B|+|C| - |A\cap B|-|A\cap C|-|B\cap C| + |A\cap B\cap C|$.
General ($n$ conjuntos):
$$ \left|\bigcup_{i=1}^{n} A_i\right| = \sum_i |A_i| - \sum_{i<j}|A_i\cap A_j| + \sum_{i<j<k}|A_i\cap A_j\cap A_k| - \cdots + (-1)^{n+1}|A_1\cap\cdots\cap A_n|. $$
(Mismo esquema vale reemplazando $|\cdot|$ por $P(\cdot)$; ver [[axiomas-de-probabilidad]].)

### Regla del palomar (pigeonhole)
Si $n$ objetos se distribuyen en $m$ conjuntos y $n>m$, al menos un conjunto tiene
más de un objeto. General: si $n=km+1$ objetos van a $m$ conjuntos, al menos uno
contiene $\ge k+1$. (En un grupo de $>366$ personas, al menos 2 cumplen años el mismo día.)

### Identidades de números combinatorios útiles
$$ \binom{n}{r}=\binom{n}{n-r}, \qquad
   \binom{n+1}{r}=\binom{n}{r}+\binom{n}{r-1}\ \text{(Pascal)}, $$
$$ \sum_{k=0}^{n}\binom{n}{k}=2^{n}, \qquad
   \sum_{k=0}^{n}(-1)^k\binom{n}{k}=0, $$
$$ (x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^k y^{n-k}\ \text{(binomio de Newton)}. $$

### Con reposición vs. sin reposición
Cuando el tamaño de la población y de cada clase son **mucho mayores** que el tamaño
de la muestra, las probabilidades con y sin reposición son **casi iguales** — base de
la aproximación de la [[distribucion-hipergeometrica]] por la [[distribucion-binomial]].

## Cuándo usar cada cosa
- "y / luego / después" → suelen multiplicarse las etapas (regla del producto).
- "o" entre alternativas excluyentes → se suman (regla de la suma).
- "al menos uno/una", "ninguno" → conviene el **complemento** / [[leyes-de-de-morgan|De Morgan]].
- Importa el orden → variaciones/permutaciones; no importa → combinaciones $\binom{n}{r}$.
- ¿Repone o no repone? → fila correspondiente de la tabla de las 5 formas.

## Ejercicio resuelto — posiciones en una fila ([[tp2-calculo-de-probabilidades]] ej. 33)
*Ocho personas (entre ellas Jorge y Alejandro) se forman al azar en una fila.
(a) ¿Probabilidad de que estén uno detrás del otro (contiguos)? (b) ¿De que haya
exactamente dos personas entre ellos?*

Casos posibles: $\#S = 8!$ (ordenamientos equiprobables).

**(a) Contiguos.** Estrategia "elegir posiciones × permutar × ubicar al resto":
- Hay $7$ formas de elegir el bloque de 2 posiciones consecutivas ($\{1,2\},\dots,\{7,8\}$).
- Por cada una, $2!$ formas de permutar a Jorge y Alejandro dentro del bloque.
- Por cada una, $6!$ formas de ubicar a las otras 6 personas.
$$ P(E) = \frac{\#E}{\#S} = \frac{7\cdot 2!\cdot 6!}{8!} = \frac{1}{4}. $$

**(b) Exactamente dos entre ellos.** Las posiciones de Jorge y Alejandro distan 3
(p. ej. 1 y 4): hay $5$ pares posibles ($\{1,4\},\dots,\{5,8\}$); luego $2!$ por permutar
a los dos y $6!$ por el resto:
$$ P(F) = \frac{5\cdot 2!\cdot 6!}{8!} = \frac{5}{28}. $$

> ⚠️ Al contar "casos favorables" hay que **no olvidar las permutaciones** ($2!$) ni
> cubrir todos los casos m.e.; el TP2 advierte que omitir el $2!$ da un resultado erróneo.

## Ejercicio resuelto — cartas españolas ([[tp2-calculo-de-probabilidades]] ej. 37)
*De un mazo español de 48 cartas (4 palos × 12) se sacan 2 al azar.*

Sin orden, casos posibles $\#S=\binom{48}{2}$. (Con orden $48\cdot 47$ da lo mismo:
las permutaciones se compensan.)

**(a) Las dos de espadas:** $\;P(E)=\dfrac{\binom{12}{2}}{\binom{48}{2}}=\dfrac{12\cdot 11}{48\cdot 47}=\dfrac{11}{188}.$

**(b) Una espada y una copa:** $\;P(EC)=\dfrac{\binom{12}{1}\binom{12}{1}}{\binom{48}{2}}=\dfrac{2\cdot 12\cdot 12}{48\cdot 47}=\dfrac{6}{47}.$

**(c) Mismo palo** (4 palos m.e.): $\;P(MP)=4\cdot\dfrac{11}{188}=\dfrac{11}{47}.$

**(d) Distinto palo** (complemento): $\;P(DP)=1-P(MP)=1-\dfrac{11}{47}=\dfrac{36}{47}.$

## Origen combinatorio de binomial e hipergeométrica ([[tp2-calculo-de-probabilidades]] ej. 4)
El ej. 4 del TP2 deriva **desde Laplace/conteo** las dos distribuciones del muestreo
($N$ elementos, $R$ "defectuosos", muestra de tamaño $n$, $k$ defectuosos):
- **Con reposición** (cada extracción "ve" la misma proporción $p=R/N$): los ordenamientos
  dan $P(k)=\binom{n}{k}p^k(1-p)^{n-k}$ → [[distribucion-binomial|Binomial]].
- **Sin reposición** (la población cambia): $P(k)=\dfrac{\binom{R}{k}\binom{N-R}{n-k}}{\binom{N}{n}}$
  → [[distribucion-hipergeometrica|Hipergeométrica]].
- Cuando $N,R,N-R\gg n$ ambas coinciden (con reposición ≈ sin reposición).

## Ejercicio resuelto — póker
*Probabilidad de tener póker (4 cartas iguales) en una mano de 5 de un mazo de 52.*

- **Posibles**: $\binom{52}{5}=2\,598\,960$ manos.
- **Favorables**: elegir el valor del cuarteto ($13$ opciones) y la 5ª carta entre
  las $48$ restantes → $13\times 48 = 624$.
$$ P(\text{póker}) = \frac{624}{\binom{52}{5}} = \frac{624}{2\,598\,960} \approx 0.00024. $$

## Ejercicio resuelto — problema del cumpleaños
*En una reunión de $n$ personas, ¿probabilidad de que al menos dos cumplan el mismo
día?* (365 días equiprobables.)

**Resolución.** Conviene el **complemento** (todos distintos):
$$ P(\text{al menos 2 iguales}) = 1 - \frac{365\cdot 364\cdots (365-n+1)}{365^{\,n}}. $$
Para $n=23$ ya supera $0.5$ (resultado contraintuitivo).

> [!figura] u2-curva-cumpleanos
> La curva de $P(\text{al menos dos coinciden})$ cruza el $0.5$ en $n=23$ y llega a $0.99$ en $n=57$ (su complemento, todos distintos, cae a $0.01$). El crecimiento sigue a la cantidad de pares $\binom{n}{2}$ y no a $n$, y por eso el salto ocurre mucho antes de lo que sugieren los 365 días.

## Relación
[[regla-de-laplace]] · [[axiomas-de-probabilidad|complemento $P(A^c)=1-P(A)$]] ·
[[leyes-de-de-morgan]] (inclusión-exclusión y "ninguno") ·
[[distribucion-binomial]] / [[distribucion-hipergeometrica]] (origen combinatorio, ej. 4).
