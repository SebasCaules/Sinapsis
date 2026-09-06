---
titulo: Aproximación Normal de la Binomial
resumen: 'Caso más usado del TCL: para $n$ grande, $\mathrm{Bin}(n,p)\approx\mathcal{N}(np,\sqrt{npq})$. Al ser la binomial discreta se aplica la corrección por continuidad $\pm\tfrac{1}{2}$; regla práctica $np\ge5$ y $nq\ge5$.'
tipo: concepto
unidad: 7
orden: 9
tags: [tcl, binomial, normal, aproximacion]
fuentes: ["[[teorica-aproximacion-binomial-normal]]", "[[tp7-suma-de-va]]", "[[video-tcl]]"]
actualizado: 2026-09-04
---

# Aproximación Normal de la Binomial (De Moivre–Laplace)

**En breve.** Para $n$ grande, una [[distribucion-binomial|Binomial]] se aproxima
por una [[distribucion-normal|Normal]] de la misma media y varianza. Evita sumar
muchos términos binomiales a mano: se tipifica y se usa la
[[estandarizacion-y-tabla-normal|tabla de la Normal]], con corrección por
continuidad por tratarse de una discreta.

Caso particular y más usado del [[teorema-central-del-limite|TCL]]: para $n$
grande,
$$ \mathrm{Bin}(n,p)\;\approx\;\mathcal N\big(np,\;\sqrt{npq}\big),\qquad q=1-p. $$
Vale porque $\mathrm{Bin}(n,p)=\sum_{i=1}^n\mathrm{Bernoulli}(p)$ es suma de i.i.d.
con $\mu=np$ y $\sigma^2=npq$ (ver [[suma-de-va-independientes]]).

## Por qué funciona (esbozo de la derivación)
Según [[teorica-aproximacion-binomial-normal]], partiendo de la PMF exacta
$P(S_n=x)=\binom{n}{x}p^x q^{n-x}$, se aplica:
- **fórmula de Stirling** $n!=\sqrt{2\pi n}\,n^n e^{-n}(1+O(1/n))$,
- **Taylor** $\ln(1+x)=x-\tfrac{x^2}{2}+O(x^3)$,

y, tomando $x=np+z\sqrt{npq}$, se llega a
$$ P(S_n=x)\;\xrightarrow{n\to\infty}\;\frac{1}{\sqrt{2\pi npq}}\,e^{-\frac{(x-np)^2}{2npq}}, $$
que es exactamente la densidad de una $\mathcal N(np,\sqrt{npq})$ evaluada en $x$.

## Corrección por continuidad (clave en discretas)
Como la Binomial es **discreta** y la Normal **continua**, se ajusta $\pm\tfrac12$:
$$
\begin{aligned}
P(S_n=s)&\approx\Phi\!\left(\tfrac{s+\frac12-np}{\sqrt{npq}}\right)-\Phi\!\left(\tfrac{s-\frac12-np}{\sqrt{npq}}\right),\\
P(a\le S_n\le b)&\approx\Phi\!\left(\tfrac{b+\frac12-np}{\sqrt{npq}}\right)-\Phi\!\left(\tfrac{a-\frac12-np}{\sqrt{npq}}\right).
\end{aligned}
$$
Para $<$ y $>$ estrictos hay que excluir los extremos (mover el $\pm\tfrac12$ hacia adentro).

> [!figura] u7-barras-contra-campana-de-donde-sale-el-12
> Cada barra de la binomial ocupa una franja de ancho 1 centrada en su entero, así que el borde del área normal debe caer a mitad de camino entre dos enteros y no sobre uno. Compare los tres números que se leen a la vez: suma binomial exacta, aproximación sin corregir y aproximación con $\pm\tfrac12$.

**Intuición.** La $\mathrm{Bin}(n,p)$ es una suma de $n$ Bernoulli i.i.d.
([[suma-de-va-independientes|caso Bernoulli→Binomial]]); el TCL dice que esa suma
se vuelve Normal. El histograma de barras, al crecer $n$, se "rellena" en una
campana simétrica centrada en $np$. La condición $np\ge5,\ nq\ge5$ pide que la
campana entre cómoda en $[0,n]$ sin chocar contra los bordes (si $p\approx0$ queda
muy asimétrica y la Normal falla; ahí gana Poisson).

## Cuándo conviene
- $n$ grande y $p$ ni muy chico ni muy grande (regla práctica $np\ge5$ y $nq\ge5$).
- Para evitar sumas binomiales enormes a mano.
- *(Si $n$ es grande pero $p\approx0$ con $np$ moderado, conviene la
  aproximación de [[distribucion-poisson|Poisson]] en lugar de la normal.)*

> ⚠️ **Regla más estricta en la clase en video.** [[video-tcl|La clase de Lucio Pantazis]] (min. 33:04) pide $np>10$ **y** $n(1-p)>10$ simultáneamente (no
> $np\ge5,\ nq\ge5$), y trae un contraejemplo con $n=100$:
> $C\sim\mathrm{Bi}(100,0{,}05)$, $P(C\le2)$ exacto $\approx0{,}1183$ vs.
> aproximación Normal $\approx0{,}1257$ — ya difieren en el segundo decimal
> aunque $n$ sea grande, porque $p$ es muy chico. La misma condición
> ($\lambda=np>10$) se pide para aproximar Poisson por Normal.

## Ejercicio resuelto
*([[tp7-suma-de-va]], ej. 3 de la guía.) Un cañón acierta con prob. $0.8$ y los
disparos son independientes. En $100$ disparos, calcular $P(70<X<90)$ por la
binomial y por la aproximación normal.*

**Modelo.** $X\sim\mathrm{Bin}(100,0.8)$.

**Valor exacto (binomial).** $70<X<90\iff 71\le X\le 89$:
$$ P(70<X<90)=\sum_{k=71}^{89}\binom{100}{k}0.8^k\,0.2^{100-k}\approx 0.98305. $$

**Aproximación normal.** $\mu=100\cdot0.8=80$, $\sigma=\sqrt{100\cdot0.8\cdot0.2}=4$.
Como se excluyen el 70 y el 90 (incluidos 71 y 89), con corrección por continuidad
el intervalo continuo es $(70.5,\,89.5)$:
$$ P(70<X<90)=P(70.5<X\le 89.5)\approx\Phi\!\left(\frac{89.5-80}{4}\right)-\Phi\!\left(\frac{70.5-80}{4}\right). $$
$$ =\Phi(2.375)-\Phi(-2.375)=2\Phi(2.375)-1\approx 2(0.99123)-1\approx 0.98245. $$

**Resultado.** Exacto $\approx 0.98305$; normal con corrección $\approx 0.98245$
(error $<10^{-3}$). *(Chebyshev sólo garantizaba $\ge0.84$ — ver
[[desigualdad-de-chebyshev]].)*

## Enlaces
- [[teorema-central-del-limite]] (resultado madre) · [[distribucion-binomial]] · [[distribucion-normal]].
- [[suma-de-va-independientes]] (Bernoulli→Binomial) · [[estandarizacion-y-tabla-normal]] (cómo tipificar y leer la tabla).
- [[desigualdad-de-chebyshev]] (cota universal, mucho más floja para el mismo problema).
