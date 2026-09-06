---
titulo: Formulario — Variables Aleatorias Continuas
resumen: "Hoja de la unidad 4: densidad y función de distribución, esperanza, momentos y varianza por integral, tabla de las distribuciones continuas con sus parámetros, falta de memoria de la exponencial y estandarización de la normal."
tipo: formulario
unidad: 4
orden: 11
tags: [continua, formulario, cheat-sheet]
fuentes: ["[[teorica-va-continuas]]", "[[teorica-va-uniforme]]", "[[teorica-va-exponencial]]", "[[teorica-va-normal]]", "[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-05-30
---

# Formulario — Variables Aleatorias Continuas

Hoja de fórmulas de la unidad 4. Detalle en
[[variable-aleatoria-continua]], [[funcion-de-densidad]] y las páginas de cada
distribución.

> Las fórmulas generales de $E[X]$, $V(X)$, momentos y la normalización
> $\int_{\mathbb R}f_X=1$ se evalúan, en distribuciones de soporte no acotado
> (exponencial, normal), como **integrales impropias**: ver
> [[tecnica-integrales-impropias]].

## General (v.a.c.)

| Objeto | Fórmula |
|---|---|
| FDA | $F_X(x)=P(X\le x)=\int_{-\infty}^{x} f_X(y)\,dy$ |
| Densidad | $f_X(x)=\dfrac{dF_X(x)}{dx}$, con $f_X\ge0$, $\int_{\mathbb{R}}f_X=1$ |
| Probabilidad | $P(a<X\le b)=F_X(b)-F_X(a)=\int_a^b f_X$ |
| Esperanza | $E[X]=\int_{-\infty}^{+\infty} x\,f_X(x)\,dx$ |
| Esperanza por la cola (si $X\ge0$) | $E[X]=\int_0^{+\infty}\big(1-F_X(x)\big)\,dx=\int_0^{+\infty}P(X>x)\,dx$ |
| Momento $k$ | $E[X^k]=\int_{-\infty}^{+\infty} x^k\,f_X(x)\,dx$ |
| Varianza | $\operatorname{Var}(X)=E[X^2]-(E[X])^2=\int (x-\mu)^2 f_X$ |
| v.a.c. | $X$ v.a.c. $\iff F_X$ continua $\iff P(X=\alpha)=0\ \forall\alpha$ |

## Tabla de distribuciones continuas

| Distribución | Soporte | Densidad $f_X(x)$ | $E[X]$ | $V(X)$ |
|---|---|---|---|---|
| [[distribucion-uniforme-continua\|Unif$(a,b)$]] | $(a,b)$ | $\dfrac{1}{b-a}$ | $\dfrac{a+b}{2}$ | $\dfrac{(b-a)^2}{12}$ |
| [[distribucion-exponencial\|Expo$(\lambda)$]] | $x\ge0$ | $\lambda e^{-\lambda x}$ | $\dfrac1\lambda$ | $\dfrac1{\lambda^2}$ |
| [[distribucion-normal\|$N(\mu,\sigma)$]] | $\mathbb{R}$ | $\dfrac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ | $\mu$ | $\sigma^2$ |

### FDA específicas
- Uniforme: $F_X(x)=\dfrac{x-a}{b-a}$ en $(a,b)$.
- Exponencial: $F_X(x)=1-e^{-\lambda x}$ ($x\ge0$); $P(X>x)=e^{-\lambda x}$.
- Normal: $F_X(x)=\Phi\!\left(\dfrac{x-\mu}{\sigma}\right)$ (sin forma cerrada → tabla).

## Falta de memoria (exponencial)

$$ P(X>x+\Delta\mid X>x)=P(X>\Delta)=e^{-\lambda\Delta}. $$

## Normal estándar y estandarización

Ver [[estandarizacion-y-tabla-normal]].
$$ Z=\frac{X-\mu}{\sigma}\sim N(0,1),\quad \Phi(z)=P(Z\le z),\quad \Phi(-z)=1-\Phi(z),\quad z_{1-\alpha}=-z_\alpha. $$
Regla empírica: $1\sigma\approx0.6827$, $2\sigma\approx0.9545$, $3\sigma\approx0.9973$.
Fractiles: $z_{0.90}\approx1.2816$, $z_{0.95}\approx1.6449$, $z_{0.975}\approx1.96$, $z_{0.99}\approx2.3263$.

Útiles para $Z\sim N(0,1)$ ([[tp4-variables-aleatorias-continuas]] ej. 15):
- Desvío absoluto medio (semi-normal): $E[|Z|]=\sqrt{2/\pi}\approx0.798$.
- Cuartiles: $Q_1=-0.6745$, $Q_3=0.6745$, rango intercuartílico $I_Q=1.349$.
- Outliers de Tukey ($|Z|>2.698$): $P\approx0.007$ (ver [[boxplot]] de U1).

## Asimetría y curtosis (referencia)

| Distribución | Curtosis $\kappa$ | Tipo |
|---|---|---|
| [[distribucion-normal\|Normal]] | $0$ | mesocúrtica |
| [[distribucion-uniforme-continua\|Uniforme]] | $-6/5$ | platicúrtica |
| [[distribucion-exponencial\|Exponencial]] | $+6$ | leptocúrtica |
