---
titulo: Distribución Geométrica
resumen: 'Cantidad de fracasos antes del primer éxito en ensayos Bernoulli: $p_X(k)=q^k p$ con $E[X]=q/p$. Es la única discreta sin memoria. Cuidado con la doble convención: contando ensayos queda $p_Y(k)=q^{k-1}p$ y $E[Y]=1/p$.'
tipo: distribucion
unidad: 3
orden: 9
tags: [discreta, distribucion]
fuentes: ["[[geometrica-apunte]]", "[[tp3-variables-aleatorias-discretas]]", "[[va-discretas-introduccion]]"]
actualizado: 2026-09-04
---

# Distribución Geométrica

**En breve.** Cuenta cuántos fracasos pasan antes del primer éxito al repetir un
ensayo [[distribucion-bernoulli|Bernoulli]]. Es la única discreta **sin memoria**:
lo ya esperado no cambia lo que falta. Atención a la doble convención (fracasos vs.
ensayos), detallada más abajo.

**Modela:** el número de **fracasos** obtenidos antes de conseguir el primer
éxito, en una serie de ensayos [[independencia|independientes]] con igual
probabilidad de éxito $p$.
**Soporte:** $\mathcal{R}_X = \mathbb{N}_0 = \{0, 1, 2, \dots\}$.
**Parámetros:** $p \in (0,1]$ = probabilidad de éxito ($q = 1-p$).

Se nota $X \sim \text{Geométrica}(p)$.

> ⚠️ **Dos convenciones, ambas usadas por la cátedra.** En esta materia conviven
> las dos versiones:
> - **"Número de fracasos"** (el apunte [[geometrica-apunte]] y el repaso del
>   [[tp3-variables-aleatorias-discretas]]): cuenta los **fracasos** antes del
>   primer éxito, **incluye el 0**, $\mathcal{R}_X=\mathbb{N}_0$, $p_X(k)=q^k p$,
>   $E[X]=q/p$. **Es la convención por defecto de esta página** (las fórmulas de
>   abajo son éstas).
> - **"Número de ensayos"** (las slides [[va-discretas-introduccion|de Pantazis]],
>   ejemplo del casino): cuenta los **ensayos hasta el primer éxito**,
>   $\mathcal{R}_Y=\mathbb{N}=\{1,2,\dots\}$, $p_Y(k)=q^{k-1}p$, $E[Y]=1/p$,
>   $V(Y)=q/p^2$. Ver la sección dedicada más abajo.
>
> Las dos se relacionan por $Y = X + 1$ (el ensayo del éxito se cuenta o no). De ahí
> $E[Y]=E[X]+1=q/p+1=1/p$ y $V(Y)=V(X)=q/p^2$. **No mezclar las fórmulas**: si el
> enunciado pide "cuántos intentos / apuestas / personas se eligen", suele ser la
> versión de ensayos ($E=1/p$); si pide "cuántos fracasos / fallas previas", es la
> de fracasos ($E=q/p$).

## Función de masa
$$ p_X(k) = P(X=k) = q^{\,k}\,p, \qquad k \in \mathbb{N}_0 $$

> Idea ([[geometrica-apunte]]): para tener exactamente $k$ fracasos seguidos y
> luego el éxito, $q\cdots q\,p = q^k p$. Normaliza con la serie geométrica
> $\sum_{k=0}^{\infty} q^k = \tfrac{1}{1-q}$, así $\sum_k q^k p = \tfrac{p}{1-q} = 1$.

## Esperanza y varianza
- $E[X] = \mu_X = \dfrac{q}{p} = \dfrac{1-p}{p}$
- $V(X) = \sigma_X^2 = \dfrac{q}{p^2} = \dfrac{1-p}{p^2}$

> $E[X]$ sale de $\sum_k k\,q^k = \tfrac{d}{dq}\sum_k q^k = \tfrac{q}{(1-q)^2}$,
> multiplicado por $p$ da $q/p$.

## Función generadora de momentos
$$ M_X(t) = \frac{p}{1 - q\,e^t}, \qquad t < -\ln q $$
(ver [[funcion-generadora-de-momentos|FGM]]).

## Propiedad de falta de memoria

Para $L, \Delta \in \mathbb{N}_0$:
$$ P(X \ge L + \Delta \mid X \ge L) = P(X \ge \Delta) $$
porque $P(X \ge m) = q^m$, de modo que $P(X\ge M \mid X\ge L) = q^M/q^L = q^{M-L}$.
"Haber esperado ya $L$ fracasos no cambia cuánto falta esperar." Es la única
distribución discreta sin memoria.

> [!figura] u3-falta-de-memoria-la-cola-recortada-y-reescalada-
> La cola $\{X \ge L\}$ tiene masa total $q^{L}$; al dividirla por $q^{L}$ y correrla $L$ lugares cae exactamente sobre la distribución original. Note que el cociente $q^{L+\Delta}/q^{L} = q^{\Delta}$ no depende de $L$.

> **Intuición.** Como los ensayos son [[independencia|independientes]], la moneda
> "no se acuerda" de las tiradas previas: una racha de fracasos no acerca el éxito.
> Cada vez que se vuelve a tirar, se arranca de cero, idéntico al primer intento. (En el
> caso continuo, la [[distribucion-exponencial|exponencial]] es la análoga sin
> memoria.) Ejemplo ([[geometrica-apunte]]): si cada día un
enfermo tiene probabilidad $p$ de ser dado de alta (independiente de los días
previos), entonces
$$ P(\text{permanecer} \ge 1 \text{ semana más} \mid \text{ya permaneció} \ge 1 \text{ mes}) = P(\text{permanecer} \ge 1 \text{ semana}). $$

## Versión "número de ensayos" (slides Pantazis)

Las slides de la cátedra [[va-discretas-introduccion]] usan la **otra** convención
en el ejemplo del casino. Sea $Y$ = **cantidad de apuestas (ensayos) hasta que el
casino pierde por primera vez**, con $p=\tfrac16$ (el casino "pierde" cuando el
apostador acierta el 1). Como hay que **incluir el ensayo del éxito**:
$$ p_Y(k) = P(Y=k) = q^{\,k-1}\,p = \left(\tfrac56\right)^{k-1}\tfrac16, \qquad k \in \mathbb{N} = \{1,2,\dots\} $$
Se normaliza con la serie geométrica $\sum_{k=1}^{\infty} q^{k-1} = \tfrac{1}{1-q}$,
así $\sum_k q^{k-1}p = \tfrac{p}{1-q}=1$.

**Esperanza y varianza** (vía las series $\sum k q^{k-1}=\tfrac{1}{(1-q)^2}$ y
$\sum k^2 q^{k-1}=\tfrac{1+q}{(1-q)^3}$):
$$ E[Y] = \frac1p = 6, \qquad E[Y^2]=\frac{1+q}{p^2}=66, \qquad V(Y)=E[Y^2]-E[Y]^2 = 66-36 = 30. $$

**Función de la v.a. (linealidad).** La ganancia acumulada del casino hasta esa
primera derrota es $h(Y) = -4 + 1\cdot(Y-1) = Y-5$, y por
[[esperanza|linealidad de la esperanza]]:
$$ E[h(Y)] = E[Y] - 5 = 6 - 5 = 1. $$
Es decir, aun cuando el apostador gana por primera vez, el casino lleva ganado en
promedio \$1 contando las apuestas previas.

> Coincide con la convención de "fracasos" vía $Y = X + 1$: la $X$ de arriba (con
> $p=\tfrac16$) daría $E[X]=q/p=5$ y $V(X)=q/p^2=30$, de modo que $E[Y]=E[X]+1=6$ y
> $V(Y)=V(X)=30$. La varianza es la misma; la esperanza difiere en 1.

## Relaciones con otras distribuciones
- Es el caso $r = 1$ de la [[distribucion-binomial-negativa|Binomial negativa]]:
  $\text{Geométrica}(p) = \text{BinNeg}(1, p)$.
- Cada ensayo individual es una [[distribucion-bernoulli|Bernoulli$(p)$]].

## Cuándo usarla (reconocer en un ejercicio)
- Se repite un ensayo Bernoulli **hasta el primer éxito**.
- Se pregunta por la cantidad de intentos/fracasos previos a ese primer éxito.
- Aparece la frase "hasta que ocurra por primera vez".

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 40a). El 5 % de la
población mundial tiene talasemia. Se toman personas al azar, una tras otra.
¿Cuál es el número medio de personas elegidas antes de que aparezca la primera con
talasemia? ¿Cuál es la probabilidad de que las 12 primeras no tengan talasemia?

**Planteo.** "Éxito" = encontrar una persona con talasemia, $p = 0{,}05$. Sea
$X$ = n.º de personas **sin** talasemia (fracasos) antes de la primera con
talasemia $\Rightarrow X \sim \text{Geométrica}(0{,}05)$.

**Cálculo.**
$$ E[X] = \frac{q}{p} = \frac{0{,}95}{0{,}05} = 19 $$
"Las 12 primeras no tienen talasemia" equivale a $X \ge 12$ (al menos 12 fracasos
antes del primer éxito):
$$ P(X \ge 12) = q^{12} = 0{,}95^{12} \approx 0{,}5404 $$

**Resultado.** En promedio se eligen $19$ personas sin talasemia antes de la
primera con talasemia; $P(\text{12 primeras sanas}) \approx 0{,}5404$.
