---
titulo: Distribución Binomial
resumen: 'Número de éxitos en $n$ ensayos Bernoulli independientes con la misma probabilidad $p$: $p_X(k)=\binom{n}{k}p^k q^{n-k}$, con $E[X]=np$ y $V(X)=npq$. Se reconoce por el número fijo de repeticiones y el muestreo con reposición.'
tipo: distribucion
unidad: 3
orden: 8
tags: [discreta, distribucion]
fuentes: ["[[binomial-apunte]]", "[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-09-04
---

# Distribución Binomial

**En breve.** Cuenta cuántos éxitos hay en un número **fijo** $n$ de ensayos
[[distribucion-bernoulli|Bernoulli]] independientes con el mismo $p$. Es la suma
de $n$ Bernoulli. La pista típica: "cuántos de los $n$…" con muestreo con
reposición o población grande.

**Modela:** el número de "éxitos" en $n$ experimentos
[[independencia|independientes]] e idénticos, cada uno con la misma probabilidad
de éxito $p$.
**Soporte:** $\mathcal{R}_X = \{0, 1, \dots, n\}$.
**Parámetros:** $n \in \mathbb{N}$ = cantidad de ensayos; $p \in [0,1]$ =
probabilidad de éxito ($q = 1-p$).

Se nota $X \sim \text{Binomial}(n, p)$. Según [[binomial-apunte]], las tres
condiciones que caracterizan el modelo binomial son:
1. $X$ **cuenta éxitos**.
2. Se repite un experimento $n$ veces **idénticas** (la probabilidad de éxito $p$
   no cambia).
3. Los experimentos son **independientes**.

Ejemplos típicos: número de bolillas rojas al extraer $n$ **con reposición**;
número de caras en $n$ tiros de una moneda.

## Función de masa
$$ p_X(k) = P(X=k) = \binom{n}{k}\,p^k\,q^{\,n-k}, \qquad k \in \{0,1,\dots,n\} $$

> [!figura] u3-de-donde-sale-el-combinatorio-enumerar-las-secue
> Todas las secuencias de $n$ ensayos con exactamente $k$ éxitos, enumeradas una por fila. Note que todas tienen la misma probabilidad $p^{k}q^{\,n-k}$: lo único que cambia con $k$ es cuántas filas hay, y ese conteo es $\binom{n}{k}$.

> Idea ([[binomial-apunte]]): cada secuencia concreta con $k$ éxitos y $n-k$
> fracasos tiene probabilidad $p^k q^{n-k}$, y hay $\binom{n}{k}$ formas de elegir
> en qué posiciones caen los éxitos. La normalización sale del binomio de Newton:
> $\sum_{k=0}^{n}\binom{n}{k}p^k q^{n-k} = (p+q)^n = 1^n = 1$.

> **Intuición.** La fórmula tiene dos piezas: $p^k q^{n-k}$ es la probabilidad de
> **una** secuencia particular con $k$ éxitos (no importa el orden, da lo mismo por
> independencia), y $\binom{n}{k}$ cuenta **cuántas** secuencias así hay. Por eso
> "3 caras en 5 tiros" es más probable que "5 caras en 5 tiros": no porque cada
> secuencia lo sea, sino porque hay muchas más maneras de ubicar 3 caras que 5.

### Origen combinatorio
La PMF $P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}$ también se deriva **desde el conteo /
[[regla-de-laplace|Laplace]]** en el modelo de **muestreo con reposición**, sin
asumir de entrada el modelo binomial. En [[tp2-calculo-de-probabilidades]] ej. 4 se
arma este puente: contar las secuencias favorables (extracciones con reposición,
todas equiprobables) y dividir por el total reproduce exactamente $\binom{n}{k}p^k q^{n-k}$.
El detalle de la derivación combinatoria está documentado en
[[tecnica-conteo-combinatoria]]; ese mismo ejercicio contrasta este caso con el de
muestreo **sin reposición**, que da la [[distribucion-hipergeometrica|Hipergeométrica]].

## Esperanza y varianza
- $E[X] = \mu_X = n\,p$
- $V(X) = \sigma_X^2 = n\,p\,(1-p) = n\,p\,q$

> Se demuestran ([[binomial-apunte]]) reindexando la suma ($m = k-1$ para $E[X]$,
> $m = k-2$ para $E[X^2]$ usando $k^2 = k(k-1) + k$). Se obtiene
> $E[X^2] = n(n-1)p^2 + np$, de donde $V(X) = E[X^2] - (np)^2 = npq$.

## Función generadora de momentos
$$ M_X(t) = (q + p\,e^t)^n $$
(ver [[funcion-generadora-de-momentos|FGM]]; es la FGM de la
[[distribucion-bernoulli|Bernoulli]] elevada a la $n$).

## Relaciones con otras distribuciones
- Es la suma de $n$ [[distribucion-bernoulli|Bernoulli$(p)$]] independientes.
- $\text{Binomial}(1, p) = \text{Bernoulli}(p)$.
- **Aproxima a la [[distribucion-hipergeometrica|Hipergeométrica]]** cuando la
  población es muy grande respecto de la muestra ($N \gg n$): muestrear sin
  reposición se parece a muestrear con reposición.
- **Se aproxima por [[distribucion-poisson|Poisson$(np)$]]** cuando $n$ es grande
  y $p$ chico (ver sección en la página de Poisson).

## Cuándo usarla (reconocer en un ejercicio)
- Cantidad **fija** $n$ de ensayos independientes con el mismo $p$.
- Muestreo **con reposición**, o población tan grande que la reposición no importa.
- Se pregunta "cuántos de los $n$ ...".

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 21). De cada 5 fusibles
que produce una máquina, 1 es defectuoso. En una muestra (de un lote muy grande)
de 4 fusibles, calcular la probabilidad de obtener: a) uno defectuoso; b) como
máximo dos defectuosos; c) ninguno; d) los cuatro defectuosos.

**Planteo.** Lote muy grande $\Rightarrow$ ensayos independientes con
$p = \tfrac15 = 0{,}2$. Sea $X$ = n.º de defectuosos en $n=4$. Entonces
$X \sim \text{Binomial}(4,\ 0{,}2)$, con $p_X(k) = \binom{4}{k}0{,}2^k\,0{,}8^{\,4-k}$.

**Cálculo.**
- a) $P(X=1) = \binom{4}{1}0{,}2^1\,0{,}8^3 = 4\cdot 0{,}2\cdot 0{,}512 = 0{,}4096 \approx 0{,}41$.
- c) $P(X=0) = \binom{4}{0}0{,}2^0\,0{,}8^4 = 0{,}8^4 = 0{,}4096 \approx 0{,}41$.
- b) $P(X\le 2) = P(0) + P(1) + P(2)$ con $P(2) = \binom{4}{2}0{,}2^2\,0{,}8^2 = 6\cdot 0{,}04\cdot 0{,}64 = 0{,}1536$. Suma: $0{,}4096 + 0{,}4096 + 0{,}1536 = 0{,}9728 \approx 0{,}97$.
- d) $P(X=4) = 0{,}2^4 = 0{,}0016$.

**Resultado.** a) $0{,}41$; b) $0{,}97$; c) $0{,}41$; d) $0{,}0016$.
