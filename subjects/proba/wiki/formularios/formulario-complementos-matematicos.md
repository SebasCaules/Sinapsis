---
titulo: Formulario — Complementos Matemáticos
resumen: "Hoja de la unidad 0: integrales impropias de tipo I y II, integrales dobles con límites variables y derivadas parciales, más el diccionario masa-probabilidad que conecta cada operación con densidades y acumuladas."
tipo: formulario
unidad: 0
orden: 4
tags: [complemento-matematico, formulario, cheat-sheet, integracion, derivacion]
fuentes: ["[[tecnica-integrales-impropias]]", "[[tecnica-integrales-dobles]]", "[[tecnica-derivadas-parciales]]"]
actualizado: 2026-09-04
---

# Formulario — Complementos Matemáticos

Hoja de fórmulas de la unidad 0 (Complementos Matemáticos). Detalle y ejercicios
resueltos en [[tecnica-integrales-impropias]], [[tecnica-integrales-dobles]] y
[[tecnica-derivadas-parciales]].

> Estas tres herramientas son el andamiaje de toda la parte continua de la materia:
> **integrar** una densidad da probabilidad (1D y 2D), **derivar** una acumulada
> devuelve la densidad. Si el soporte llega a infinito o el integrando explota en un
> extremo, la integral es **impropia** y se resuelve con un límite; si el problema es
> bidimensional, se resuelve con una integral iterada eligiendo bien el orden.

## Integrales impropias

Según [[tecnica-integrales-impropias]].

| Tipo | Fórmula |
|---|---|
| Tipo I — extremo superior infinito | $\int_a^{+\infty} f(x)\,dx=\lim_{t\to+\infty}\int_a^{t} f(x)\,dx$ |
| Tipo I — extremo inferior infinito | $\int_{-\infty}^{b} f(x)\,dx=\lim_{t\to-\infty}\int_t^{b} f(x)\,dx$ |
| Tipo I — ambos extremos infinitos | $\int_{-\infty}^{+\infty} f(x)\,dx=\int_{-\infty}^{c} f(x)\,dx+\int_{c}^{+\infty} f(x)\,dx$ |
| Tipo II — singularidad en $b$ | $\int_a^b f(x)\,dx=\lim_{t\to b^-}\int_a^{t} f(x)\,dx$ |
| Tipo II — singularidad en $a$ | $\int_a^b f(x)\,dx=\lim_{t\to a^+}\int_t^{b} f(x)\,dx$ |
| Tipo II — singularidad en los dos extremos | $\int_a^b f(x)\,dx=\int_a^{c} f(x)\,dx+\int_{c}^{b} f(x)\,dx$, con $c\in(a,b)$ |

**Convergencia.** La integral impropia existe cuando la integral ordinaria existe
para cada valor finito del corte **y** el límite es finito; si el límite no existe o
es infinito, la integral **diverge**.

- **Cola convergente (referencia):** $\int_1^{+\infty}\frac{1}{x^2}\,dx=1$
- **Cola divergente (referencia):** $\int_1^{+\infty}\frac{1}{x}\,dx=\lim_{t\to+\infty}\ln t=+\infty$
- **Singularidad con área finita (referencia):** $\int_2^{5}\frac{1}{2\sqrt{x-2}}\,dx=\sqrt{3}$

### Dónde aparecen en probabilidad

- **Normalización de una densidad:** $\int_{-\infty}^{+\infty} f_X(x)\,dx=1$
- **Probabilidad como área:** $P(a\le X\le b)=\int_a^b f_X(x)\,dx$
- **FDA como integral impropia:** $F_X(x)=\int_{-\infty}^{x} f_X(y)\,dy$
- **Esperanza como integral impropia:** $E[X]=\int_{-\infty}^{+\infty} x\,f_X(x)\,dx$

Aplican sobre todo a la [[distribucion-exponencial]] (soporte semirrecta positiva) y a
la [[distribucion-normal]] (soporte toda la recta); ver [[funcion-de-densidad]] y
[[funcion-de-distribucion-acumulada]].

## Integrales dobles

Según [[tecnica-integrales-dobles]]. Aplicación directa en
[[variables-aleatorias-bidimensionales]].

| Objeto | Fórmula |
|---|---|
| Masa de una placa | $\text{masa}=\iint_R d(x,y)\,dx\,dy$ |
| Celda elemental (Riemann) | $\Delta\text{masa}(x_i,y_j)\approx d(x_i,y_j)\,\Delta x\,\Delta y$ |
| Suma de Riemann | $\text{masa}\approx\sum_i\sum_j d(x_i,y_j)\,\Delta x\,\Delta y$ |
| Fubini (triángulo $0<x<1,\;0<y<1-x$) | $\iint_R d\,dA=\int_0^1\left[\int_0^{1-x} d(x,y)\,dy\right]dx=\int_0^1\left[\int_0^{1-y} d(x,y)\,dx\right]dy$ |
| Baricentro en $x$ | $\bar x=\frac{\iint_R x\,d(x,y)\,dA}{\text{masa}}$ |
| Baricentro en $y$ | $\bar y=\frac{\iint_R y\,d(x,y)\,dA}{\text{masa}}$ |
| Probabilidad de una región del plano | $P((X,Y)\in R)=\iint_R f_{XY}(x,y)\,dA$ |
| Normalización conjunta | $\iint_{\mathbb{R}^2} f_{XY}(x,y)\,dA=1$ |
| Baricentro como vector de esperanzas | $(\bar x,\bar y)=(E[X],E[Y])$ |

**Regla de los límites.** Los límites **externos** son siempre constantes y los
**internos** pueden depender de la variable externa; si queda una segunda variable
en un límite externo, el orden de integración está invertido.

## Derivadas parciales

Según [[tecnica-derivadas-parciales]]. Es la operación inversa de integrar: de
acumulada a densidad.

| Objeto | Fórmula |
|---|---|
| Densidad lineal como cociente incremental | $\frac{\Delta m}{\Delta x}\xrightarrow[\Delta x\to 0]{}\frac{dm}{dx}(\alpha)$ |
| Densidad en 1D | $f_X(x)=F_X'(x)$ |
| Densidad como derivada cruzada | $d(x,y)=\frac{\partial}{\partial x}\frac{\partial}{\partial y}m(x,y)=\frac{\partial^2 m}{\partial x\,\partial y}$ |
| Densidad conjunta desde la FDA conjunta | $f(x,y)=\frac{\partial^2 F}{\partial x\,\partial y}$ |
| Clairaut / Schwarz (cruzadas iguales) | $\frac{\partial^2 m}{\partial x\,\partial y}=\frac{\partial^2 m}{\partial y\,\partial x}$ |
| Independencia al derivar la FDA conjunta | $F(x,y)=F_X(x)F_Y(y)\;\Rightarrow\;f(x,y)=f_X(x)f_Y(y)$ |

**Hipótesis de Clairaut:** las derivadas parciales segundas deben ser continuas;
bajo esa regularidad el orden de derivación no altera el resultado.

## Diccionario masa ↔ probabilidad

| Mundo físico | Mundo probabilístico |
|---|---|
| Densidad superficial en kg/m² | Densidad conjunta |
| Masa total | Probabilidad total (igual a uno) |
| Masa acumulada | FDA conjunta |
| Baricentro de la placa | Vector de esperanzas |
| Momento de inercia respecto del baricentro | [[varianza|Varianza]] |

## Cuándo usar qué

- Aparece infinito en un límite de integración (colas de la exponencial o de la normal, normalizar sobre toda la recta): integral impropia de **Tipo I**.
- El integrando explota en un extremo (denominador que se anula, raíz de cero, logaritmo de cero): integral impropia de **Tipo II**; los dos extremos problemáticos se parten en un punto interior.
- El enunciado da una densidad conjunta y pide la probabilidad de una región, una constante de normalización, una marginal o una esperanza: **integral doble** con Fubini.
- El enunciado da la FDA (o la masa acumulada) y pide la densidad: **derivada** simple en una variable, **cruzada** en dos.
- Antes de integrar en dos variables, dibuje el recinto y decida el orden: el orden bien elegido evita partir la integral en dos pedazos.
- Si el resultado de una integral doble debe ser una probabilidad, verifique primero que la densidad esté normalizada (masa igual a uno); si no lo está, divida por la masa.

## Páginas relacionadas

- [[tecnica-integrales-impropias]], [[tecnica-integrales-dobles]], [[tecnica-derivadas-parciales]] — desarrollo completo con ejercicios resueltos.
- [[variable-aleatoria-continua]], [[funcion-de-densidad]], [[funcion-de-distribucion-acumulada]] — dónde se aplican.
- [[variables-aleatorias-bidimensionales]] — el caso 2D.
- [[formulario-va-continuas]] — la hoja de la unidad 4, que usa estas herramientas.
