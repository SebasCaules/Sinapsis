---
titulo: Esperanza (Valor Esperado)
resumen: 'Promedio a largo plazo de una variable aleatoria, ponderado por sus probabilidades: $E[X]=\sum_k k\,p_X(k)$. Es el centro de masa de la distribución y cumple linealidad, $E[aX+bY+c]=aE[X]+bE[Y]+c$, aun sin independencia.'
tipo: concepto
unidad: 3
orden: 3
tags: [discreta, esperanza, momentos]
fuentes: ["[[va-discretas-introduccion]]", "[[tp3-variables-aleatorias-discretas]]", "[[video-vad-generales]]"]
actualizado: 2026-09-04
---

# Esperanza (Valor Esperado)

**En breve.** Es el promedio "a largo plazo" de una [[variable-aleatoria|v.a.]]:
un promedio ponderado de sus valores, donde el peso de cada valor es su
probabilidad. Sirve para resumir una distribución en un solo número y para
comparar alternativas inciertas (ver [[teoria-de-la-decision-valor-esperado|teoría de la decisión]]).

> [!figura] u3-el-balancin-la-esperanza-como-centro-de-masa
> Las masas $p_X(k)$ cuelgan de una barra rígida y el fulcro solo la equilibra cuando se lo coloca en $E[X] = \sum_k k\,p_X(k)$. Note que ese punto de equilibrio no tiene por qué ser un valor del recorrido.

La **esperanza** o **valor esperado** de una [[variable-aleatoria|v.a. discreta]]
$X$, notada $\mu_X$ o $E[X]$, es:
$$ E[X] = \mu_X = \sum_{k \in \mathcal{R}_X} k\,p_X(k) $$

> **Intuición.** Pensar la PMF como masas $p_X(k)$ colocadas sobre la recta en
> cada $k$: $E[X]$ es el **centro de masa** (el punto donde la barra se
> equilibra). Por eso no tiene por qué coincidir con ningún valor del recorrido
> (un dado tiene $E[X]=3{,}5$). Cada masa "tira" del balance proporcionalmente a
> su probabilidad y a su distancia al centro.

**Interpretación.** Si se repite el experimento muchas veces y se registran los
valores de $X$, el promedio converge a $E[X]$. Es el análogo probabilístico de la
media de [[datos-agrupados|datos agrupados]] $\bar{x}_{Ag} = \sum_i x_i\,(f_i/n)$,
donde la frecuencia relativa $f_i/n$ converge a $P(X=k)$
(según [[va-discretas-introduccion]]). Gráficamente, $E[X]$ es el punto que
"equilibra" la distribución.

> **¿Por qué $\mu$ y no $\bar{x}$?** Según [[video-vad-generales]], la letra griega denota lo que pasaría **antes** de correr el experimento (un parámetro de la distribución, calculado con probabilidades); la letra latina $\bar{x}$ es un **estadístico muestral**, calculado **después** de repetir el experimento y observar datos reales (con frecuencias relativas). Usar $\bar{x}$ para referirse al valor esperado es un error conceptual frecuente: confunde qué se sabe antes de experimentar con qué se mide después.

## Esperanza de una función de la v.a.

Para una función cualquiera $g : \mathbb{R} \mapsto \mathbb{R}$:
$$ E[g(X)] = \sum_{k \in \mathcal{R}_X} g(k)\,p_X(k) $$
En particular, los **momentos**: $E[X^k] = \sum_x x^k p_X(x)$. Esto se usa para
calcular la [[varianza|varianza]] vía $V(X) = E[X^2] - (E[X])^2$. Todos los
momentos se pueden recuperar de golpe con la
[[funcion-generadora-de-momentos|función generadora de momentos]].

## Propiedades (linealidad)

Sean $a,b,c$ constantes y $X, Y$ v.a. discretas:
- $E[c] = c$.
- $E[a\cdot X] = a\cdot E[X]$.
- $E[X + Y] = E[X] + E[Y]$ (incluso si **no** son [[independencia|independientes]]).
- Combinando: $E[a\cdot X + b\cdot Y + c] = a\,E[X] + b\,E[Y] + c$.

> ⚠️ **Atención.** Si $X, Y$ son v.a., en general $E[X\cdot Y] \ne E[X]\cdot E[Y]$.
> No factorizar un valor esperado cuando hay **dos variables** multiplicándose sin
> verificar que se pueda (requiere [[independencia|independencia]]).

## Ejercicio resuelto

**Enunciado** ([[va-discretas-introduccion]], ejemplo del casino). Una persona
apuesta: al tirar un dado, el casino gana \$4 si sale 1 y pierde \$1 en caso
contrario. Sea $G$ = ganancia del casino. Calcular $E[G]$.

**Planteo.** Recorrido $\mathcal{R}_G = \{-4, 1\}$ (el casino "gana" $-4$ si el
apostador acierta el 1, y gana $1$ si no). Por [[regla-de-laplace|Laplace]]:
$P(G=-4) = P(\text{sale } 1) = \tfrac16$ y $P(G=1) = \tfrac56$.

**Cálculo.**
$$ E[G] = (-4)\cdot\tfrac16 + 1\cdot\tfrac56 = \tfrac{-4+5}{6} = \tfrac16 $$

**Resultado.** $E[G] = \tfrac16 > 0$: el casino sale ganando. En 1000 apuestas
gana en promedio $\approx 166{,}66$ pesos.

> **Variante (ítem de la misma fuente, slides de Pantazis):** Sea $Y$ = **cantidad
> de apuestas (ensayos) hasta que el casino pierde por primera vez**. Es una
> [[distribucion-geometrica#Versión "número de ensayos" (slides Pantazis)|geométrica en su versión "número de ensayos"]]
> con $p=\tfrac16$, $\mathcal{R}_Y=\mathbb{N}=\{1,2,\dots\}$ y
> $P(Y=k)=\left(\tfrac56\right)^{k-1}\tfrac16$, de modo que $E[Y]=\tfrac1p=6$
> (¡no $q/p=5$!). La ganancia acumulada del casino hasta esa primera derrota es
> $h(Y)=-4+1\cdot(Y-1)=Y-5$, y por linealidad $E[h(Y)]=E[Y]-5=6-5=1$.
>
> > ⚠️ **Cuidado con la convención.** Esta fuente usa la geométrica como **número
> > de ensayos** ($E=1/p$). La página [[distribucion-geometrica]] adopta por defecto
> > la convención de la cátedra **"número de fracasos"** ($E=q/p$). No mezclar las
> > fórmulas: con la versión de fracasos $Z=Y-1$ daría $E[Z]=q/p=5$. Ver la nota de
> > convenciones en esa página.

## Aplicación: teoría de la decisión

Un uso central de la esperanza es **elegir entre alternativas inciertas
maximizando el valor esperado** de la ganancia. Ver
[[teoria-de-la-decision-valor-esperado|Teoría de la decisión]] (criterio de
maximización del valor esperado, con el ejercicio del vendedor de diarios del TP3
resuelto paso a paso).
