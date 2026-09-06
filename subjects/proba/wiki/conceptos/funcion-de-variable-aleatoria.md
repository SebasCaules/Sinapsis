---
titulo: Función de Variable Aleatoria
resumen: 'Dada una transformación $Y=g(X)$, obtiene la distribución de $Y$ por el método de la FDA: $F_Y(y)=P(g(X)\le y)$ y luego derivar o sumar masas. Incluye el caso afín $Y=aX+b$ y la transformada inversa.'
tipo: concepto
unidad: 5
orden: 1
tags: [bidimensionales, transformacion, funcion-de-variable-aleatoria]
fuentes: ["[[teorica-funcion-de-variable-aleatoria]]", "[[tp5-2024]]", "[[video-mezcla]]", "[[video-funciones-de-variables-aleatorias]]"]
actualizado: 2026-09-04
---

# Función de Variable Aleatoria

**En breve.** Si transformamos una v.a. $X$ con una función $g$, obtenemos otra v.a. $Y=g(X)$;
el objetivo es deducir la distribución de $Y$ a partir de la de $X$, casi siempre pasando por la
[[funcion-de-distribucion-acumulada|FDA]].

Dada una [[variable-aleatoria|variable aleatoria]] $X$ y una función $g:\mathbb{R}\to\mathbb{R}$,
definimos una nueva variable aleatoria $Y=g(X)$. El problema central es: **conocida la
distribución de $X$, ¿cuál es la distribución de $Y$?** (según [[teorica-funcion-de-variable-aleatoria]]).

> **Intuición.** La FDA es el "traductor" universal: como $F_Y(y)=P(g(X)\le y)$ es siempre una
> probabilidad sobre $X$, podemos despejar el evento en términos de $X$ y leerlo en $F_X$. Por eso
> el método de la FDA funciona aunque $g$ no sea inyectiva o cambie el tipo de variable
> (continua → discreta).

## Método general (vía la FDA)

El procedimiento robusto que sirve siempre pasa por la
[[funcion-de-distribucion-acumulada|función de distribución acumulada]] (FDA):

1. **Partir de $F_X$** (lo que se conoce de $X$).
2. **Determinar la FDA de $Y$:**
$$ F_Y(y) = P(Y\le y) = P\big(g(X)\le y\big). $$
   El truco es reescribir el evento $\{g(X)\le y\}$ como un evento sobre $X$ y evaluar $F_X$ ahí.
3. **Obtener la masa o densidad:**
   - Si $Y$ es continua: $f_Y(y)=\dfrac{d}{dy}F_Y(y)$ (derivar).
   - Si $Y$ es discreta: $p_Y(k)=P(Y=k)$ (sumar masas de las preimágenes).

> [!figura] u5-la-preimagen-de-g-x-y-sobre-la-curva-de-g
> Arriba, la curva $y=g(x)$ cortada por la recta horizontal de altura $y$; abajo, la densidad $f_X$ sobre el mismo eje, con la preimagen $\{x:g(x)\le y\}$ sombreada: esa área es $F_Y(y)$. Compare las tres opciones de $g$ y observe que la receta no cambia, solo cambia la forma de la preimagen (dos ramas con $x^2$, una semirrecta con $g$ monótona).

> A veces el paso por la FDA no es necesario: en el caso discreto basta agrupar
> directamente las probabilidades de las preimágenes $g^{-1}(\{k\})$.

## Casos según el tipo de $X$ y de $Y$

| $X$ | $g$ | $Y$ |
|---|---|---|
| discreta | cualquiera | discreta |
| continua | escalonada (clasifica en categorías) | discreta |
| continua | continua estrictamente monótona o por tramos | continua |

Una transformación de una v.a. **continua** puede dar una v.a. **discreta** (p. ej. clasificar
el pH en tipos de agua), pero una v.a. discreta nunca se vuelve continua por aplicar $g$.

## Transformaciones afines $Y=aX+b$

Es el caso más usado. Las fórmulas (válidas para cualquier $X$ con momentos definidos):
- $\mu_Y = a\,\mu_X + b$
- $\sigma_Y^2 = a^2\,\sigma_X^2 \;\Rightarrow\; \sigma_Y = |a|\,\sigma_X$
- Asimetría: $\gamma_Y = \text{sign}(a)\,\gamma_X$ (si $a\neq0$)
- Curtosis: $\kappa_Y = \kappa_X$ (si $a\neq0$)
- Covarianza: $\text{Cov}(X,Y) = a\,\sigma_X^2 = \text{sign}(a)\,\sigma_X\sigma_Y$ (ver [[covarianza-y-correlacion]])

Si $a=0$, entonces $Y=b$ es **constante**: $\sigma_Y^2=0$ y $P(Y=b)=1$.

**Caso normal:** si $X\sim N(\mu_X,\sigma_X)$ y $a\neq0$, entonces
$Y=aX+b\sim N(a\mu_X+b,\,|a|\sigma_X)$ (la familia normal es cerrada por afines). De ahí la
**estandarización** $Z=\dfrac{Y-\mu_Y}{\sigma_Y}\sim N(0,1)$. Ver [[distribucion-normal]].

## Aplicación: generación de números aleatorios (transformada inversa)

Si $X$ es continua con $F_X$ estrictamente creciente (existe $F_X^{-1}$) y
$U\sim\text{Unif}(0,1)$ (ver [[distribucion-uniforme-continua]]), al definir
$$ Y = F_X^{-1}(U) $$
resulta $F_Y(y)=P(F_X^{-1}(U)\le y)=P(U\le F_X(y))=F_X(y)$, es decir **$Y$ tiene la misma
distribución que $X$**. Esto permite simular cualquier distribución a partir de una uniforme.

> [!figura] u5-de-una-uniforme-a-cualquier-distribucion
> El valor $u$ sorteado en $(0,1)$ viaja horizontalmente hasta la FDA y baja al eje $x$: eso es $F_X^{\leftarrow}(u)$. Al acumular sorteos el histograma reproduce la densidad objetivo; en el caso discreto, todo un tramo de valores de $u$ cae sobre el mismo salto y colapsa a un único $x$.

Para distribuciones no estrictamente crecientes (p. ej. discretas) se usa la **inversa
generalizada** $F_X^{\leftarrow}(u)=\min\{x:\,u\le F_X(x)\}$.

- Ej.: simular $B\sim\text{Bernoulli}(0.6)$ → $B=0$ si $u\le0.4$, $B=1$ si $u>0.4$.
- Ej.: simular $Y\sim\text{Exp}(0.5)$ → $Y=-2\ln(1-U)$. Ver [[distribucion-exponencial]].

**Ejemplo discreto completo (inversa generalizada), con más de dos valores.** Sea
$X\sim \mathcal{H}(10,4,2)$ (hipergeométrica), con $R_X=\{0,1,2\}$,
$P(X=0)=\tfrac{1}{3}$, $P(X=1)=\tfrac{8}{15}$, $P(X=2)=\tfrac{2}{15}$, y por lo tanto
$F_X(t)=0$ ($t<0$), $\tfrac13$ ($0\le t<1$), $\tfrac{13}{15}$ ($1\le t<2$), $1$
($t\ge2$). Los saltos de $F_X$ marcan directamente los cortes de $g$:
$$ g(U)=\begin{cases} 0 & 0\le U<1/3 \\ 1 & 1/3\le U<13/15 \\ 2 & 13/15\le U<1 \end{cases} $$
Si $U\sim U(0,1)$, entonces $g(U)$ tiene la misma distribución que $X$ (según
[[video-funciones-de-variables-aleatorias]]).

## Ejercicio resuelto

**(Ej. 5 de [[tp5-2024]]; figura como "Ejercicio 7" en la sección de resueltos de la guía)** El
radio $R$ de una esfera es una v.a. continua con densidad $f_R(r)=6r(1-r)$ para $0<r<1$. Obtener
la densidad del volumen $V=\frac{4\pi}{3}R^3$.

**Planteo (método de la FDA).** Como $V$ es función creciente de $R$:
$$ F_V(v)=P(V\le v)=P\!\left(\tfrac{4\pi}{3}R^3\le v\right)=P\!\left(R\le\sqrt[3]{\tfrac{3v}{4\pi}}\right)=F_R\!\left(\sqrt[3]{\tfrac{3v}{4\pi}}\right). $$

**Cálculo.** Derivando con la regla de la cadena:
$$ f_V(v)=f_R\!\left(\sqrt[3]{\tfrac{3v}{4\pi}}\right)\cdot\frac{1}{3}\left(\tfrac{3v}{4\pi}\right)^{-2/3}\cdot\frac{3}{4\pi}. $$
Reemplazando $f_R(r)=6r(1-r)$ y aglomerando términos, queda
$$ f_V(v)=\frac{3}{2\pi}\left(\sqrt[3]{\tfrac{4\pi}{3v}}-1\right),\qquad 0<v<\frac{4\pi}{3}, $$
y $0$ en otro caso.

**Resultado.** El soporte de $V$ es $\left(0,\tfrac{4\pi}{3}\right)$ (imagen de $0<r<1$). Notar
que $f_V(v)\to+\infty$ cuando $v\to0^+$ (la raíz cúbica diverge), pero la integral impropia vale 1
(es una densidad válida). Para el área $A=4\pi R^2$ el procedimiento es análogo, con la salvedad de
que $g(r)=4\pi r^2$ **no es inyectiva** y hay que escribir
$\{R^2\le a/4\pi\}=\{-\sqrt{a/4\pi}\le R\le\sqrt{a/4\pi}\}$; resulta
$f_A(a)=\frac{3}{4\pi}\left(1-\frac{\sqrt{a}}{2\sqrt{\pi}}\right)$ en $0<a<4\pi$ (Ec. 83 de la guía).

> El factor de $f_V$ es $\tfrac{3}{2\pi}$ (constante), no $\tfrac{3}{2v}$: ver la Ec. (77) de la
> resolución oficial del TP5. La divergencia en $v\to0^+$ proviene del término $\sqrt[3]{1/v}$, no
> de un $1/v$ por fuera.

## Ejercicio resuelto — transformación no inyectiva $W=V^2$ (chi-cuadrado)

**(Ejemplo 2 de [[teorica-funcion-de-variable-aleatoria]]; equivale al Ej. 2b/3a del [[tp5-2024]])**
La tensión sobre una resistencia es $V\sim N(0,1)$ (en volts). Hallar la densidad de la potencia
disipada $W=V^2$ (sobre $1\,\Omega$).

**Soporte y FDA.** Como $W=V^2\ge0$, para $w<0$ es $F_W(w)=0$. Para $w>0$, usando que $g(v)=v^2$
**no es inyectiva** (preimagen $\{-\sqrt{w}\le V\le\sqrt{w}\}$):
$$ F_W(w)=P(V^2\le w)=P(-\sqrt{w}\le V\le\sqrt{w})=\Phi(\sqrt{w})-\Phi(-\sqrt{w})=2\Phi(\sqrt{w})-1. $$

**Densidad.** Derivando con la regla de la cadena ($\Phi'(z)=\tfrac{1}{\sqrt{2\pi}}e^{-z^2/2}$):
$$ f_W(w)=2\,\Phi'(\sqrt{w})\cdot\frac{1}{2\sqrt{w}}=\frac{1}{\sqrt{2\pi w}}\,e^{-w/2},\qquad w>0, $$
y $0$ en otro caso.

**Resultado.** $f_W(w)=\dfrac{1}{\sqrt{2\pi w}}e^{-w/2}$ para $w>0$: es exactamente la densidad de
una **[[distribucion-ji-cuadrado|chi-cuadrado]] con 1 grado de libertad**, $W\sim\chi^2_1$. (No
preocupa $w=0$: $P(W=0)=0$ porque $W$ es continua.) Este es el patrón típico de transformación no
inyectiva $Y=X^2$: sumar las dos ramas de la preimagen. Ver la receta en
[[tecnica-distribucion-de-una-funcion-de-va]].

## Relación con otras páginas
- [[tecnica-distribucion-de-una-funcion-de-va]] — receta paso a paso (método FDA), atajos y errores típicos.
- Caso multivariado / mezcla: [[mezcla-de-distribuciones]] (cuando $g$ depende de una v.a. discreta auxiliar).
- [[video-mezcla]] — mismo espíritu: codifica la partición de escenarios como v.a. discreta auxiliar.
- Momentos que se transforman: [[esperanza]], [[varianza]], [[funcion-de-distribucion-acumulada]].
- Suma de v.a. como función de dos v.a.: [[variables-aleatorias-bidimensionales]].
- [[esperanza-condicional]] — $E[g(X)\mid Y]$ y leyes de esperanza/varianza total.
- [[distribucion-ji-cuadrado]] — aparece como $V^2$ con $V\sim N(0,1)$ (transformación no inyectiva).
