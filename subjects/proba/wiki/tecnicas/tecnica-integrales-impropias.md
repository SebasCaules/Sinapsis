---
titulo: Integrales impropias
resumen: 'Cuando el dominio no es acotado o el integrando explota en un extremo, la integral se define por un límite: $\int_a^{+\infty}f=\lim_{t\to+\infty}\int_a^{t}f$. Es la herramienta para normalizar densidades y calcular probabilidades de cola.'
tipo: tecnica
unidad: 0
orden: 1
tags: [complemento-matematico, integracion, continua]
fuentes: ["[[complemento-integrales-impropias]]"]
actualizado: 2026-09-04
---

# Integrales impropias

**En breve.** Cuando el dominio es infinito o el integrando explota en un extremo,
la integral no se evalúa directo: se reemplaza el punto problemático por una
variable $t$ y se toma límite. Es la herramienta para normalizar densidades sobre
$\mathbb{R}$ o $[0,\infty)$ y calcular probabilidades de colas.

**Para qué sirve en proba:** una variable aleatoria continua se describe por su
[[funcion-de-densidad|densidad]] $f_X$. Para que $f_X$ sea densidad debe cumplir
$\int_{-\infty}^{+\infty} f_X(x)\,dx = 1$, y las probabilidades son áreas
$P(a\le X\le b)=\int_a^b f_X$. Casi siempre estas integrales son **impropias**:
el dominio es no acotado (colas que llegan a $\pm\infty$, como en la
[[distribucion-normal]] o la [[distribucion-exponencial]]) o el integrando tiene
una singularidad en un extremo. La técnica consiste en reemplazar el límite
problemático por una variable $t$ y tomar límite. Según
[[complemento-integrales-impropias]].

## Tipo I — dominio de integración no acotado

Se define como el límite de una integral ordinaria sobre un intervalo finito:

$$ \int_a^{+\infty} f(x)\,dx = \lim_{t\to+\infty}\int_a^{t} f(x)\,dx,
\qquad
\int_{-\infty}^{b} f(x)\,dx = \lim_{t\to-\infty}\int_t^{b} f(x)\,dx. $$

> [!figura] u0-cola-convergente-vs-divergente
> El área acumulada de $1/x^2$ y la de $1/x$ sobre $[1,t]$, con $t$ creciendo hasta $10^4$. En el panel superior el sombreado marca el tramo ya integrado, de $1$ hasta $t$; como el eje $x$ es logarítmico, el área dibujada no es proporcional al valor. Note que la primera se estanca en $1$ mientras la segunda, $\ln t$, sigue subiendo sin techo.

Cuando ambos extremos son infinitos se parte en un punto $c$ cualquiera:

$$ \int_{-\infty}^{+\infty} f(x)\,dx = \int_{-\infty}^{c} f(x)\,dx + \int_{c}^{+\infty} f(x)\,dx. $$

**Dos condiciones para que la integral impropia exista (converja):**
1. La integral ordinaria $\int_a^{t} f$ debe existir para cada $t$ finito (con $t>a$ o $t<b$ según el caso).
2. Debe existir (ser finito) el límite cuando $t\to\pm\infty$.

Si el límite no existe o es infinito, la integral **diverge**.

**Intuición.** ¿Cómo puede una región **infinitamente larga** tener área **finita**?
La clave es que la cola del integrando se hace chica lo bastante rápido: cada tramo
nuevo que se agrega aporta cada vez menos área, y la suma de aportes se estabiliza en
un número (como una serie geométrica que converge). Por eso una densidad como la
[[distribucion-exponencial|exponencial]] o la [[distribucion-normal|normal]] puede
extenderse hasta $\infty$ y aun así integrar exactamente $1$. La frontera está en
qué tan rápido decae: $1/x^2$ converge, pero $1/x$ diverge —su cola no se achica lo
suficiente.

## Tipo II — el integrando no es continuo en todo el intervalo

Cuando $f$ tiene una asíntota / singularidad en un extremo del intervalo de
integración, se usa también un límite:

- $f$ continua en $[a,b)$ (no en $b$):
  $$ \int_a^b f(x)\,dx = \lim_{t\to b^-}\int_a^{t} f(x)\,dx. $$
- $f$ continua en $(a,b]$ (no en $a$):
  $$ \int_a^b f(x)\,dx = \lim_{t\to a^+}\int_t^{b} f(x)\,dx. $$
- $f$ continua en $(a,b)$ pero no en $a$ ni en $b$: se parte en un $c\in(a,b)$,
  $\int_a^b = \int_a^c + \int_c^b$, y cada pedazo se trata como los casos anteriores.

> [!figura] u0-singularidad-tipo-ii-area-finita
> La curva $1/(2\sqrt{x-2})$ con el corte $t$ acercándose a la asíntota $x=2$. Al acercar $t$ a $2$ la franja se estira sin límite hacia arriba (el eje $y$ está recortado en $3.2$ y la punta se remata con una flecha) y, aun así, el área acumulada se estaciona en $\sqrt3\approx 1.7321$, como muestra la barra de la derecha.

## Cómo reconocer cuál usar
- Aparece $\pm\infty$ en un límite de integración → **Tipo I**.
- El integrando "explota" (denominador que se anula, raíz de cero, log de cero) en
  un extremo del intervalo → **Tipo II**.
- En proba: normalizar una densidad sobre $[0,\infty)$ o $\mathbb{R}$ → Tipo I.

## Ejercicio resuelto

> Calcular $\displaystyle\int_1^{\infty}\frac{1}{x^2}\,dx$.
> (Ejemplo 1 de [[complemento-integrales-impropias]].)

**Planteo (Tipo I).** El límite superior es infinito, así que introducimos $t>1$
y tomamos límite:
$$ \int_1^{\infty}\frac{1}{x^2}\,dx = \lim_{t\to\infty}\int_1^{t} x^{-2}\,dx. $$

**Cálculo.** Una primitiva de $x^{-2}$ es $-\tfrac{1}{x}$:
$$ \int_1^{t} x^{-2}\,dx = \left.-\frac{1}{x}\right|_1^{t} = -\frac{1}{t}-\left(-\frac{1}{1}\right) = 1-\frac{1}{t}. $$

**Límite.** $\displaystyle\lim_{t\to\infty}\left(1-\frac{1}{t}\right) = 1.$

**Resultado.** $\displaystyle\int_1^{\infty}\frac{1}{x^2}\,dx = 1$. La integral
**converge**: el área bajo la cola es finita aunque el dominio sea infinito.

### Ejercicio resuelto (Tipo II)

> Calcular $\displaystyle\int_2^{5}\frac{1}{2\sqrt{x-2}}\,dx$.
> (Ejemplo 2 de [[complemento-integrales-impropias]].)

**Planteo.** El integrando explota en $x=2$ (el denominador $2\sqrt{x-2}\to 0$).
Es una integral impropia de **Tipo II** con singularidad en el extremo izquierdo:
$$ \int_2^{5}\frac{1}{2\sqrt{x-2}}\,dx = \lim_{t\to 2^+}\int_t^{5}\frac{1}{2\sqrt{x-2}}\,dx. $$

**Cálculo.** Una primitiva de $\tfrac{1}{2\sqrt{x-2}}=\tfrac{1}{2}(x-2)^{-1/2}$ es
$\sqrt{x-2}$:
$$ \int_t^{5}\frac{1}{2\sqrt{x-2}}\,dx = \left.\sqrt{x-2}\right|_t^{5} = \sqrt{5-2}-\sqrt{t-2} = \sqrt{3}-\sqrt{t-2}. $$

**Límite.** $\displaystyle\lim_{t\to 2^+}\left(\sqrt{3}-\sqrt{t-2}\right) = \sqrt{3}-0 = \sqrt{3}.$

**Resultado.** $\displaystyle\int_2^{5}\frac{1}{2\sqrt{x-2}}\,dx = \sqrt{3}$.
La integral converge a pesar de la singularidad en $x=2$.

## Relación con otras páginas
- [[funcion-de-densidad]] — normalización $\int_{-\infty}^{\infty}f=1$ y probabilidades como áreas.
- [[funcion-de-distribucion-acumulada]] — $F_X(x)=\int_{-\infty}^{x}f_X$ suele ser una integral impropia en el límite inferior.
- [[variable-aleatoria-continua]] — donde se usan estas integrales.
- [[distribucion-exponencial]], [[distribucion-normal]], [[distribucion-gamma]] — densidades sobre dominios no acotados.
- [[esperanza]] — $E[X]=\int_{-\infty}^{\infty}x\,f_X(x)\,dx$ es también una integral impropia (que puede divergir).
- [[tecnica-integrales-dobles]] — la versión 2D para densidades conjuntas.
