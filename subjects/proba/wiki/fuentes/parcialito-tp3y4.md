---
titulo: Parcialito TP3 y TP4 (comisiones A, C, E y F)
resumen: "Resoluciones oficiales del parcialito de TP3 y TP4 en sus cuatro versiones, comisiones A, C, E y F, con enunciados simbólicos y molde fijo: un ejercicio de variable discreta y otro de variable continua, con el eje puesto en la comparación entre muestreo con reposición y sin reposición."
tipo: fuente
formato: parcial
unidad: eval
archivo_raw: ["raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_ComA.pdf", "raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_ComC.pdf", "raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_ComE.pdf", "raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_ComF.pdf"]
ingerido: 2026-09-04
actualizado: 2026-09-04
---

# Parcialito TP3 y TP4 (comisiones A, C, E y F)

**Qué es:** las resoluciones oficiales del **segundo parcialito** de la cursada
(el que evalúa TP3 y TP4), escritas por Lucio José Pantazis, en sus cuatro
versiones — comisiones A, C, E y F. Cada versión tiene dos ejercicios y su
resolución completa. Los cuatro enunciados son **simbólicos** ($M$, $m$, $N$,
$a$, $b$, $L$): salvo una excepción, el resultado que se pide es una fórmula, no
un número.

**Cubre las unidades/temas:** Unidad 3 (variables aleatorias discretas:
recorrido, función de masa de probabilidad (PMF), esperanza, Binomial e
Hipergeométrica) y Unidad 4 (variables aleatorias continuas: densidad a
normalizar, Normal y Exponencial). El patrón es fijo: **Ejercicio 1 discreto,
Ejercicio 2 continuo**.

## Los cuatro exámenes

| Comisión | Ej. | Tema | Resultado | Crudo |
|---|---|---|---|---|
| A | 1 | V.a.d. armada a mano: recorrido $\{0,1,2\}$, PMF por [[regla-de-laplace\|Laplace]] condicional **sin reposición**, [[esperanza\|esperanza]] | $E(X)=\dfrac{m}{M}\cdot\dfrac{M-m}{M-1}+2\cdot\dfrac{m}{M}\cdot\dfrac{m-1}{M-1}$ | `raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_ComA.pdf` |
| A | 2 | [[distribucion-normal\|Normal]]: estandarizar, simetría de $\Phi$, tabla | $P(m-2{,}56\,s\le T\le m+1{,}34\,s)=0{,}9047$ | ídem |
| C | 1 | [[distribucion-binomial\|Binomial]] $\mathrm{Bi}(7;p)$ con $p=\tfrac{M}{N+M}$, cola superior | $P(X\ge 5)=21\,p^{5}q^{2}+7\,p^{6}q+p^{7}$ | `raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_ComC.pdf` |
| C | 2 | [[funcion-de-densidad\|Densidad]] lineal $f_T(t)=m\,t$ en $(a,b)$: normalizar e integrar la cola izquierda | $P(T<10)=\dfrac{10^{2}-a^{2}}{b^{2}-a^{2}}$ | ídem |
| E | 1 | [[distribucion-hipergeometrica\|Hipergeométrica]] $\mathcal{H}(N+M;M;4)$, cola inferior | $P(X\le 2)=\dfrac{\binom{M}{0}\binom{N}{4}+\binom{M}{1}\binom{N}{3}+\binom{M}{2}\binom{N}{2}}{\binom{N+M}{4}}$ | `raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_ComE.pdf` |
| E | 2 | Misma densidad lineal, cola derecha | $P(T>12)=\dfrac{b^{2}-12^{2}}{b^{2}-a^{2}}$ | ídem |
| F | 1 | Mismo relato que A·1 pero **con reposición**: extracciones independientes | $E(X)=\dfrac{m\,(M+m)}{M^{2}}$ | `raw/12-evaluaciones/Resoluciones_Parcialitos_TP3y4_ComF.pdf` |
| F | 2 | [[distribucion-exponencial\|Exponencial]] de media $L$: FDA y probabilidad condicional | $P(T<b\mid T>a)=1-\dfrac{e^{-b/L}}{e^{-a/L}}$ | ídem |

Los cuatro son **exámenes distintos**, no cuatro copias del mismo: están pareados
dos a dos (A ↔ F por la reposición; C ↔ E por con/sin reposición y por la cola de
la densidad), pero cada par tiene resultado diferente.

## Puntos clave

- **El molde del parcialito es fijo:** una variable aleatoria discreta (Unidad 3)
  y una continua (Unidad 4). Quien practique con una sola comisión ve la mitad
  del examen.
- **El eje de la parte discreta es con reposición vs. sin reposición.** Es lo
  único que cambia entre A·1 y F·1, y entre C·1 y E·1, y decide todo el resto:
  - *Sin reposición* → la composición del cajón cambia entre extracciones. Hay
    que condicionar: $P(A_1\cap A_2)=P(A_2\mid A_1)\,P(A_1)$, con denominador
    $M-1$ en la segunda. Si son varias extracciones simultáneas, es
    [[distribucion-hipergeometrica|Hipergeométrica]].
  - *Con reposición* → las extracciones son independientes y la probabilidad de
    éxito es la misma siempre: $P(A_1\cap A_2)=P(A_1)\,P(A_2)$. Si son varias
    repeticiones, es [[distribucion-binomial|Binomial]].
  - Es exactamente el criterio de [[reconocer-distribucion-discreta|reconocer qué
    distribución discreta usar]].
- **El eje de la parte continua es densidad a normalizar vs. distribución
  conocida.**
  - *Densidad sin nombre* (C·2, E·2): primero se despeja la constante con
    $\int_{\mathbb{R}} f_T = 1$ y solo después se integra la cola pedida. Aquí
    $m=\tfrac{2}{b^{2}-a^{2}}$, y el resultado queda siempre como diferencia de
    cuadrados sobre $b^{2}-a^{2}$.
  - *Distribución conocida* (A·2 Normal, F·2 Exponencial): no se integra nada; se
    usa la FDA. En la Normal, [[estandarizacion-y-tabla-normal|estandarizar]] y
    aplicar $\Phi(-z)=1-\Phi(z)$; en la Exponencial, $E(T)=1/\lambda=L$ y
    $F_T(t)=1-e^{-t/L}$.
- **Cuidado con "a lo sumo" y con quién es el éxito.** El único resultado
  numérico de los ocho es el $0{,}9047$ de A·2; todo lo demás se entrega en
  parámetros. Eso obliga a dejar bien definido qué cuenta la variable antes de
  escribir la cola.
- **La condicional de F·2 se resuelve por definición**, sin invocar la falta de
  memoria: $P(T<b\mid T>a)=\dfrac{F_T(b)-F_T(a)}{1-F_T(a)}$. El resultado
  simplifica a $1-e^{-(b-a)/L}$, que es justamente la falta de memoria de la
  [[distribucion-exponencial|Exponencial]] leída al revés.

## Ejercicio resuelto

**Comisión E, Ejercicio 1** (el más transferible de los ocho), según este mismo
parcialito.

> **Enunciado.** Todos los días una verdulería comienza el día con un cajón de
> $N$ naranjas y $M$ mandarinas. No reponen su contenido hasta el día siguiente.
> En un mismo día van 4 clientes y no hay más clientes en el día. Cada cliente
> toma al azar una sola fruta del cajón. Calcular la probabilidad de que estos 4
> clientes se lleven a lo sumo 2 naranjas.

**1. Variable aleatoria.** $X$ = cantidad de mandarinas elegidas entre los 4
clientes.

**2. Reconocer la distribución.** Cada cliente se lleva una fruta *distinta*: las
4 extracciones son **sin reposición** de una población finita partida en dos
clases (mandarinas = éxito, naranjas = fracaso). Eso es exactamente el molde de
la [[distribucion-hipergeometrica|Hipergeométrica]]:

$$ X \sim \mathcal{H}(N+M;\ M;\ 4). $$

**3. Recorrido y PMF.** Con $N>4$ y $M>4$, $\mathcal{R}_X=\{0,1,2,3,4\}$ y la PMF
sale por [[regla-de-laplace|regla de Laplace]] contando casos favorables sobre
casos posibles:

$$ p_X(k)=P(X=k)=\frac{\dbinom{M}{k}\cdot\dbinom{N}{4-k}}{\dbinom{N+M}{4}} $$

donde $\binom{M}{k}$ elige las $k$ mandarinas, $\binom{N}{4-k}$ las $4-k$
naranjas y $\binom{N+M}{4}$ cuenta las 4 extracciones posibles.

**4. Cola pedida.** La resolución oficial suma los tres primeros valores del
recorrido:

$$
P(X\le 2)=P(X=0)+P(X=1)+P(X=2)
=\frac{\dbinom{M}{0}\dbinom{N}{4}+\dbinom{M}{1}\dbinom{N}{3}+\dbinom{M}{2}\dbinom{N}{2}}{\dbinom{N+M}{4}}
$$

**5. Resultado.**
$$ P(X\le 2)=\frac{\dbinom{M}{0}\dbinom{N}{4}+\dbinom{M}{1}\dbinom{N}{3}+\dbinom{M}{2}\dbinom{N}{2}}{\dbinom{N+M}{4}} $$

> ⚠️ Discrepancia: el enunciado pide «a lo sumo 2 **naranjas**», que con $X$ =
> cantidad de mandarinas equivale a $P(X\ge 2)$ (los términos $k=2,3,4$). La
> resolución oficial de `Resoluciones_Parcialitos_TP3y4_ComE.pdf` calcula
> $P(X\le 2)$, es decir «a lo sumo 2 mandarinas». Se transcribe la resolución tal
> como está en el crudo; la corrección, si se quisiera responder literalmente lo
> pedido, es sumar los términos $k=2,3,4$ de la misma $p_X(k)$.

## Páginas del wiki que toca

- [[distribucion-binomial|Distribución Binomial]] — el caso con reposición (C·1).
- [[distribucion-hipergeometrica|Distribución Hipergeométrica]] — el caso sin reposición (E·1).
- [[distribucion-normal|Distribución Normal]] — A·2, el único resultado numérico.
- [[distribucion-exponencial|Distribución Exponencial]] — F·2, FDA y condicional.
- [[funcion-de-densidad|Función de densidad]] — normalización de $f_T(t)=m\,t$ (C·2, E·2).
- [[variable-aleatoria-continua|Variable aleatoria continua]] — el paso $P(T<x)=P(T\le x)$.
- [[esperanza|Esperanza]] — A·1 y F·1.
- [[regla-de-laplace|Regla de Laplace]] — cómo se arma cada $p_X(k)$.
- [[reconocer-distribucion-discreta|Reconocer qué distribución discreta usar]] — el criterio con/sin reposición.
- [[estandarizacion-y-tabla-normal|Estandarización y tabla Normal]] — A·2.
- [[evaluaciones|Evaluaciones]] — catálogo de parciales, parcialitos y finales.
