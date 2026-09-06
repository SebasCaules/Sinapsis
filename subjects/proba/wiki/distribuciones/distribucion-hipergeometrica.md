---
titulo: Distribución Hipergeométrica
resumen: 'Éxitos en una muestra de tamaño $n$ tomada sin reposición de una población finita: $p_X(k)=\binom{M}{k}\binom{N-M}{n-k}/\binom{N}{n}$. Comparte la media $np$ con la binomial, pero su varianza es menor por el factor $(N-n)/(N-1)$.'
tipo: distribucion
unidad: 3
orden: 11
tags: [discreta, distribucion]
fuentes: ["[[hipergeometrica-apunte]]", "[[tp3-variables-aleatorias-discretas]]", "[[video-binomial-e-hipergeometrica]]"]
actualizado: 2026-09-04
---

# Distribución Hipergeométrica

**En breve.** Es la "binomial sin reposición": cuenta los éxitos en una muestra de
una población **finita** de la que se extrae sin devolver. Misma media que la
[[distribucion-binomial|Binomial]] ($np$), pero menos varianza por el factor de
corrección por población finita.

**Modela:** el número de individuos "del tipo especial" en una muestra de tamaño
$n$ tomada **sin reposición** de una población finita.
**Soporte:** $\mathcal{R}_X = \{\max\{0,\,n-(N-M)\},\ \dots,\ \min\{n,\,M\}\}$.
**Parámetros:** $N$ = tamaño de la población; $M$ = cantidad de individuos del tipo
especial (conjunto $A$); $n$ = tamaño de la muestra.

Se nota $X \sim \text{Hipergeométrica}(N, M, n)$. Según
[[hipergeometrica-apunte]], la diferencia clave con la
[[distribucion-binomial|Binomial]] es que el muestreo es **sin reposición**: las
extracciones **no** son independientes y la probabilidad de éxito cambia en cada
paso.

## Función de masa
$$ p_X(k) = P(X=k) = \frac{\dbinom{M}{k}\dbinom{N-M}{\,n-k\,}}{\dbinom{N}{n}}, \qquad k \in \mathcal{R}_X $$

> [!figura] u3-poblacion-conjunto-a-y-muestra-de-donde-sale-el-
> La misma muestra de tamaño $n$ corrida de un extremo al otro de la población da el mínimo y el máximo solapamiento posibles con $A$. De ahí salen los extremos del recorrido, $\max\{0,\, n-(N-M)\}$ y $\min\{n,\, M\}$.

> Idea: hay $\binom{N}{n}$ muestras equiprobables; las favorables eligen $k$ de los
> $M$ especiales y $n-k$ de los $N-M$ restantes.

### Origen combinatorio
La PMF $P(X=k)=\dfrac{\binom{R}{k}\binom{N-R}{n-k}}{\binom{N}{n}}$ se deriva
**directamente desde el conteo / [[regla-de-laplace|Laplace]]** en el modelo de
**muestreo sin reposición** (las muestras de tamaño $n$ son equiprobables). En
[[tp2-calculo-de-probabilidades]] ej. 4 se construye este puente y se contrasta con
el muestreo **con reposición**, que da la [[distribucion-binomial|Binomial]]; cuando
$N,\,R,\,N-R \gg n$ la hipergeométrica **se aproxima a la binomial** (da casi igual
muestrear con o sin reposición). El detalle de la derivación combinatoria está en
[[tecnica-conteo-combinatoria]].

## Esperanza y varianza

Con $p = \dfrac{M}{N}$ (proporción de especiales en la población):
- $E[X] = \mu_X = n\,\dfrac{M}{N} = n\,p$
- $V(X) = \sigma_X^2 = n\,\dfrac{M}{N}\left(\dfrac{N-M}{N}\right)\dfrac{N-n}{N-1} = n\,p\,q\,\underbrace{\dfrac{N-n}{N-1}}_{\text{factor de corrección}}$

> El **factor de corrección por población finita** $\tfrac{N-n}{N-1}$ hace que la
> varianza de la hipergeométrica sea **menor** que la de una binomial con el mismo
> $n$ y $p$. La media, en cambio, coincide ($np$).

> **Intuición.** Sin reposición, cada extracción te da **información** sobre lo que
> queda (si ya sacaste un defectuoso, quedan menos): las extracciones están
> negativamente correlacionadas y eso reduce la dispersión del total. En los
> extremos se ve claro: si $n=N$ se saca toda la población, el conteo es fijo y el
> factor $\tfrac{N-n}{N-1}=0$ anula la varianza; si $N\to\infty$ tiende a 1 y
> se recupera la [[distribucion-binomial|Binomial]].

## Relaciones con otras distribuciones
- **Se aproxima por la [[distribucion-binomial|Binomial$(n, p)$]]** con $p = M/N$
  cuando $N \gg n$ (y $M, N-M \gg n$). Formalmente ([[hipergeometrica-apunte]]):
  si $X_N \sim \text{Hipergeométrica}(N, M_N, n)$ con $M_N/N \to p$, entonces
  $\lim_{N\to\infty} P(X_N=k) = P(Y=k)$ con $Y \sim \text{Binomial}(n,p)$.
  Intuitivamente, con población enorme da casi igual muestrear con o sin reposición.
- **Ilustración numérica** (según [[video-binomial-e-hipergeometrica]], min.
  58:19). Con $N=1000$, $M=400$ ($p=M/N=0{,}4$):
  - $n=5$, $k=0$: $\text{Bi}(5,\,0{,}4)$ da $P(X=0)=(0{,}6)^5\approx 0{,}0778$,
    y $\mathcal H(1000,400,5)$ da $P(X=0)\approx 0{,}0772$ — valores casi
    idénticos, la aproximación es excelente cuando $n$ es chico frente a $N$.
  - $n=100$, $k=40$: $\text{Bi}(100,\,0{,}4)$ da $P(X=40)\approx 0{,}0812$,
    mientras que $\mathcal H(1000,400,100)$ da $P(X=40)\approx 0{,}0856$ — ya
    difieren de forma apreciable (aprox. 5 % relativo) porque $n$ dejó de ser
    chico frente a $N$.

> [!figura] u3-n-creciente-con-p-m-n-fijo-la-hipergeometrica-se
> PMF hipergeométrica y Binomial$(n,\, p = M/N)$ superpuestas. Al crecer $N$ con $p$ fijo las dos series colapsan y el factor $(N-n)/(N-1)$ tiende a 1: la esperanza ya coincidía de antes, la varianza solo entonces.

## Uso en inferencia (corrección por población finita)
El **factor de corrección por población finita** $\sqrt{(N-n)/(N-1)}$ de la
hipergeométrica reaparece en inferencia: al construir un
[[intervalos-de-confianza|IC de proporción]] muestreando **sin reposición** de una
población finita, se multiplica el error estándar por este factor. La corrección se
justifica vía la aproximación normal de la hipergeométrica; ver el ejercicio del
TP8 ej. 24 en [[intervalos-de-confianza]].

## Cuándo usarla (reconocer en un ejercicio)
- Muestreo **sin reposición** de una población **finita** con dos clases.
- Se conocen los totales $N$ y $M$ (no solo una proporción).
- Cartas de un mazo, artículos defectuosos de un lote chico, bolas de una urna sin
  devolución.

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 4). Se selecciona al azar
una muestra **sin reemplazo** de 3 artículos de un total de 10, de los cuales 2
son defectuosos. Sea $X$ = número de artículos defectuosos en la muestra. Obtener
la distribución y sus parámetros. ¿Cómo cambia si el muestreo es con sustitución?

**Planteo.** Sin reposición $\Rightarrow X \sim \text{Hipergeométrica}(N=10,\ M=2,\ n=3)$.
Recorrido $\mathcal{R}_X = \{0, 1, 2\}$.

**Cálculo (sin reposición).**
$$ p_X(0) = \frac{\binom{2}{0}\binom{8}{3}}{\binom{10}{3}} = \frac{56}{120} = \tfrac{7}{15} \approx 0{,}467 $$
$$ p_X(1) = \frac{\binom{2}{1}\binom{8}{2}}{\binom{10}{3}} = \frac{2\cdot 28}{120} = \tfrac{7}{15} \approx 0{,}467 $$
$$ p_X(2) = \frac{\binom{2}{2}\binom{8}{1}}{\binom{10}{3}} = \frac{8}{120} = \tfrac{1}{15} \approx 0{,}067 $$
Con $p = M/N = 0{,}2$:
$$ E[X] = n\,p = 3\cdot 0{,}2 = 0{,}6 $$
$$ V(X) = n\,p\,q\,\frac{N-n}{N-1} = 3\cdot 0{,}2\cdot 0{,}8\cdot \frac{7}{9} = 0{,}373 $$

**Con sustitución** (con reposición) pasa a ser
$X \sim \text{Binomial}(3,\ 0{,}2)$: misma media $E[X] = np = 0{,}6$, pero varianza
$V(X) = npq = 0{,}48$ (mayor, porque ya no actúa el factor de corrección).

**Resultado.** Sin reposición: $E[X]=0{,}6$, $V(X)=0{,}373$. Con reposición:
$E[X]=0{,}6$, $V(X)=0{,}48$.
