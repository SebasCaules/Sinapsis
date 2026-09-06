---
titulo: Covarianza y Correlación
resumen: 'La covarianza $\mathrm{Cov}(X,Y)=E[XY]-\mu_X\mu_Y$ mide la asociación lineal y el coeficiente $\rho=\mathrm{Cov}(X,Y)/(\sigma_X\sigma_Y)$ la reescala a $[-1,1]$. Independencia implica $\rho=0$, pero $\rho=0$ no implica independencia.'
tipo: concepto
unidad: 5
orden: 4
tags: [bidimensionales, covarianza, correlacion]
fuentes: ["[[teorica-covarianza-y-correlacion]]", "[[teorica-correlacion-entre-menos-uno-y-uno]]", "[[teorica-correlacion-uno-implica-relacion-lineal]]", "[[tp5-2024]]"]
actualizado: 2026-09-04
---

# Covarianza y Correlación

**En breve.** La covarianza mide cuánto tienden a moverse juntas dos variables (positiva si suben
a la par, negativa si una sube cuando la otra baja); la correlación es esa misma idea reescalada a
$[-1,1]$ para poder comparar entre pares de variables con unidades distintas.

La **covarianza** mide la asociación lineal entre dos
[[variables-aleatorias-bidimensionales|variables aleatorias]] $X$ e $Y$. El **coeficiente de
correlación** es su versión normalizada (adimensional, acotada entre $-1$ y $+1$).

> **Intuición.** En $\text{Cov}(X,Y)=E[(X-\mu_X)(Y-\mu_Y)]$ cada sumando es positivo cuando ambas
> variables están del mismo lado de su media y negativo cuando están en lados opuestos. La
> covarianza promedia esos productos: si predominan los "mismo lado", da positiva. El problema es
> que sus unidades son el producto de las unidades de $X$ e $Y$ (no comparable); por eso dividimos
> por $\sigma_X\sigma_Y$ y obtenemos $\rho$, un puro número entre $-1$ y $1$.

## Covarianza

$$ \text{Cov}(X,Y)=E\big[(X-\mu_X)(Y-\mu_Y)\big]. $$

**Fórmula práctica** (desarrollando el producto, según [[teorica-covarianza-y-correlacion]]):
$$ \text{Cov}(X,Y)=E[XY]-\mu_X\,\mu_Y. $$

Propiedades:
- $\text{Cov}(X,X)=E[X^2]-\mu_X^2=\text{Var}(X)$.
- Simétrica: $\text{Cov}(X,Y)=\text{Cov}(Y,X)$.
- Bilineal: $\text{Cov}(aX+b,\,cY+d)=ac\,\text{Cov}(X,Y)$.
- **Varianza de una combinación lineal:**
$$ \text{Var}(aX+bY)=a^2\text{Var}(X)+2ab\,\text{Cov}(X,Y)+b^2\text{Var}(Y). $$
  En particular $\text{Var}(X\pm Y)=\text{Var}(X)\pm2\text{Cov}(X,Y)+\text{Var}(Y)$.
- Caso afín $Y=aX+b$: $\text{Cov}(X,Y)=a\sigma_X^2=\text{sign}(a)\,\sigma_X\sigma_Y$.

## Coeficiente de correlación

$$ \rho_{X,Y}=\frac{\text{Cov}(X,Y)}{\sigma_X\,\sigma_Y}. $$

> [!figura] u5-que-mide-y-que-no-mide
> Los cuadrantes definidos por $\mu_X$ y $\mu_Y$ colorean el signo de $(x-\mu_X)(y-\mu_Y)$: la covarianza es el promedio de esos productos. Al llevar $\rho$ hacia $\pm1$ la nube colapsa sobre una recta; en cambio, con los generadores de contraejemplo la dependencia es evidente a simple vista y sin embargo $\rho\approx0$. La recta de mínimos cuadrados se dibuja en los tres generadores: en los contraejemplos queda horizontal, que es exactamente lo que significa $\rho\approx0$. El punto marcado en el cruce es el centro $(\bar{x},\bar{y})$, vértice de los cuatro cuadrantes.

### Propiedad 1: $\rho_{X,Y}\in[-1,+1]$

Demostración (según [[teorica-correlacion-entre-menos-uno-y-uno]]): el polinomio
$P_2(z)=\text{Var}(zX+Y)=z^2\text{Var}(X)+2z\,\text{Cov}(X,Y)+\text{Var}(Y)\ge0$ para todo $z$ (es una
varianza). Un cuadrático no negativo tiene discriminante $\le0$:
$$ [2\text{Cov}(X,Y)]^2-4\text{Var}(X)\text{Var}(Y)\le0 \;\Rightarrow\; (\text{Cov}(X,Y))^2\le\text{Var}(X)\text{Var}(Y) $$
(desigualdad de Cauchy-Schwarz). Dividiendo por $\sigma_X^2\sigma_Y^2$ queda $\rho_{X,Y}^2\le1$.

### Propiedad 2: $\rho_{X,Y}=\pm1$ ⟺ relación lineal con probabilidad 1

Demostración (según [[teorica-correlacion-uno-implica-relacion-lineal]]): si $\rho_{X,Y}=1$,
$$ \text{Var}\!\left(\frac{X}{\sigma_X}-\frac{Y}{\sigma_Y}\right)=1-2\rho_{X,Y}+1=0 \;\Rightarrow\; \frac{X}{\sigma_X}-\frac{Y}{\sigma_Y}=d \text{ (prob. 1)}, $$
de donde $Y=\frac{\sigma_Y}{\sigma_X}X-d\sigma_Y$ (pendiente positiva). Si $\rho_{X,Y}=-1$, se usa la
suma y sale $Y=-\frac{\sigma_Y}{\sigma_X}X+d\sigma_Y$ (pendiente negativa). En general:
$$ \rho_{X,Y}=\pm1 \;\Longleftrightarrow\; Y=aX+b \text{ con prob. 1},\;a\neq0,\;\text{sign}(a)=\text{sign}(\rho_{X,Y}). $$

## Relación con la independencia

- $X,Y$ [[independencia-de-variables-aleatorias|independientes]] $\Rightarrow\text{Cov}(X,Y)=0$ y $\rho_{X,Y}=0$ (**incorrelacionadas**).
- **El recíproco es FALSO en general:** $\text{Cov}=0\not\Rightarrow$ independencia.
- **Excepción (caso normal):** si $X,Y$ son conjuntamente gaussianas y $\text{Cov}(X,Y)=0$,
  entonces sí son independientes (ver [[teorica-bidimensionales-vac-intro]]).

## Ejercicio resuelto

**(Ej. 14 de [[tp5-2024]])** Dada la tabla conjunta $p_{X,Y}(x,y)$ con $x\in\{0,\dots,5\}$,
$y\in\{0,1,2,3\}$, calcular $\text{Cov}(X,Y)$ y $\rho_{X,Y}$.

**Marginales (sumar filas y columnas).** Se obtiene $p_X=(0.03,0.08,0.16,0.21,0.24,0.28)$ y
$p_Y=(0.25,0.26,0.25,0.24)$.

**Momentos.**
$$ E[X]=3.39,\quad E[X^2]=13.45\;\Rightarrow\;\text{Var}(X)=1.9579,\;\sigma_X\approx1.3992, $$
$$ E[Y]=1.48,\quad E[Y^2]=3.42\;\Rightarrow\;\text{Var}(Y)=1.2296,\;\sigma_Y\approx1.1089. $$

> ⚠️ Discrepancia con el raw: una resolución de la cátedra reporta $\sigma_X\approx1.8412$ y
> $\sigma_Y\approx1.3569$, que **no** son $\sqrt{\text{Var}(X)}$ ni $\sqrt{\text{Var}(Y)}$. Los
> desvíos correctos son $\sigma_X=\sqrt{1.9579}\approx1.3992$ y $\sigma_Y=\sqrt{1.2296}\approx1.1089$.
> Llamativamente, $\rho_{X,Y}\approx-0.1658$ sale igual en ambos casos porque la cota de
> correlación se compensa con la $\text{Cov}$; aun así, los desvíos a usar son los correctos.

**Momento cruzado.** Construyendo la tabla auxiliar de $XY$ y sumando, $E[XY]=4.76$ (es $E[W]$
con $W=XY$). Entonces:
$$ \text{Cov}(X,Y)=E[XY]-E[X]E[Y]=4.76-(3.39)(1.48)=-0.2572. $$

**Correlación.**
$$ \rho_{X,Y}=\frac{\text{Cov}(X,Y)}{\sigma_X\sigma_Y}=\frac{-0.2572}{(1.3992)(1.1089)}\approx-0.1658. $$

**Resultado.** $\text{Cov}(X,Y)=-0.2572$, $\rho_{X,Y}\approx-0.1658$ (asociación lineal negativa
débil). Verificación con la suma: $\text{Var}(X+Y)=\text{Var}(X)+2\text{Cov}(X,Y)+\text{Var}(Y)=2.6731$,
que coincide con $\text{Var}(Z)$ calculada directamente para $Z=X+Y$ (la guía reporta
$\text{Var}[X+Y]=2.6731$).

## Relación con otras páginas
- [[independencia-de-variables-aleatorias]] — incorrelación vs. independencia.
- [[variables-aleatorias-bidimensionales]] — de dónde salen $E[XY]$, marginales.
- [[esperanza-condicional]] — $\text{Cov}(X,Y)$ del cilindro vía esperanza condicional.
- [[funcion-de-variable-aleatoria]] — covarianza de transformaciones afines.
- [[varianza]], [[esperanza]].
