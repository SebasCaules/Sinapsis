---
tipo: quiz
titulo: 'Quiz conceptual'
id: quiz-general
descripcion: 'Reconocer distribuciones, criterios de inferencia y convenciones de la cátedra.'
---

<!-- Generado por examples/proba/tools/convert-study-data.mjs desde estudio/study-data.js. -->

## De una caja con 7 bolas (3 rojas) se extraen 4 sin reposición. ¿Qué distribución tiene la cantidad de rojas?

> pagina: distribucion-hipergeometrica

- [ ] Binomial
- [x] Hipergeométrica
- [ ] Poisson
- [ ] Geométrica

> Muestreo sin reposición de una población finita ⇒ hipergeométrica.

## Llamadas a una central: en promedio 5 por minuto, ¿cuántas en 3 minutos?

> pagina: distribucion-poisson

- [ ] Binomial(15,·)
- [x] Poisson(15)
- [ ] Exponencial(5)
- [ ] Geométrica(5)

> Conteo de eventos en un intervalo con tasa media ⇒ Poisson con λt = 5·3 = 15.

## Tiempo hasta la primera falla de un componente sin envejecimiento (tasa constante).

> pagina: distribucion-exponencial

- [ ] Normal
- [x] Exponencial
- [ ] Uniforme
- [ ] Weibull con b≠1

> Falta de memoria / tasa de fallas constante ⇒ exponencial.

## ¿Cuál distribución tiene media = varianza?

> pagina: distribucion-poisson

- [ ] Binomial
- [ ] Normal
- [x] Poisson
- [ ] Exponencial

> Poisson: $E[X]=V(X)=\lambda$.

## Para σ desconocido y n chico, el estadístico de la media sigue una…

> pagina: distribucion-t-de-student

- [ ] Normal estándar
- [x] t de Student con n−1 g.l.
- [ ] Ji-cuadrado
- [ ] F

> $T=(\bar X-\mu_0)/(S/\sqrt n)\sim t_{n-1}$.

## ¿Qué mide la potencia de una prueba?

> pagina: error-tipo-i-y-tipo-ii

- [ ] $\alpha$
- [ ] $1-\alpha$
- [ ] $\beta$
- [x] $1-\beta$

> Potencia $=1-\beta=$ probabilidad de rechazar $H_0$ cuando es falsa.

## Se rechaza $H_0$ cuando el valor p…

> pagina: valor-p

- [ ] $> \alpha$
- [x] $< \alpha$
- [ ] $=0.5$
- [ ] $>0.5$

> Regla: rechazar $H_0\iff p<\alpha$.

## $(n-1)S^2/\sigma^2$ se distribuye como…

> pagina: distribucion-ji-cuadrado

- [ ] Normal
- [ ] t de Student
- [x] Ji-cuadrado con n−1 g.l.
- [ ] Exponencial

> Resultado base para inferir sobre la varianza.

## La suma de n exponenciales i.i.d. de tasa λ es…

> pagina: distribucion-erlang

- [ ] Exponencial(nλ)
- [x] Gamma/Erlang(n,λ)
- [ ] Normal
- [ ] Poisson

> Suma de exponenciales ⇒ Gamma de forma entera = Erlang(n,λ).

## Incorrelación (Cov=0) implica independencia…

> pagina: independencia-de-variables-aleatorias

- [ ] Siempre
- [ ] Nunca
- [x] Solo en la normal bivariada
- [ ] Solo si E[X]=0

> En general no; sí vale el recíproco para la normal bivariada.

## ¿Cuándo conviene aproximar la binomial por la Poisson?

> pagina: distribucion-poisson

- [ ] n chico, p grande
- [x] n grande, p chico (np moderado)
- [ ] n grande, p≈0.5
- [ ] siempre

> Eventos raros: $n\to\infty$, $p\to0$ con $\lambda=np$ fijo.

## El segundo parámetro de $N(\mu,\cdot)$ en la cátedra es…

> pagina: distribucion-normal

- [ ] la varianza σ²
- [x] el desvío σ
- [ ] el rango
- [ ] la mediana

> La cátedra usa el DESVÍO σ como segundo parámetro.

## Número de fracasos antes del primer éxito (convención de la cátedra):

> pagina: distribucion-geometrica

- [ ] Binomial
- [x] Geométrica (soporte ℕ₀)
- [ ] Binomial negativa
- [ ] Poisson

> Geométrica que cuenta fracasos: $E=q/p$, soporte $\mathbb N_0$.

## $\bar X_n$ converge a $\mu$ cuando $n\to\infty$. Esto es la…

> pagina: ley-de-grandes-numeros

- [ ] TCL
- [x] Ley de grandes números
- [ ] Desigualdad de Markov
- [ ] Regla de Laplace

> LGN: el promedio muestral converge a la media poblacional.

## Corrección por continuidad se usa al aproximar una v.a. … por una continua.

> pagina: aproximacion-normal-de-la-binomial

- [ ] continua
- [x] discreta
- [ ] normal
- [ ] uniforme

> Al pasar de discreta (p.ej. binomial) a normal se ajusta $\pm0.5$.
