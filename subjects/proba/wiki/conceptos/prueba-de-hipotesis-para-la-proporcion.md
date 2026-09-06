---
titulo: Prueba de hipótesis para la proporción
resumen: 'Contrasta una proporción poblacional contra un valor de referencia $q_0$ mediante $Z=(\hat q-q_0)/\sqrt{q_0(1-q_0)/n}$, válido para $n$ grande por aproximación normal de la binomial. El desvío se evalúa en $q_0$ y no en el observado $\hat q$.'
tipo: concepto
unidad: 9
orden: 6
tags: [prueba-de-hipotesis, proporcion, estadistico-z]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[apunte-prueba-proporcion]]", "[[apunte-media-estadistico-z]]", "[[intro-prueba-de-hipotesis-slides]]"]
actualizado: 2026-06-06
---

# Prueba de hipótesis para la proporción

**En breve.** Contrasta si la fracción de una población que cumple cierta
propiedad supera, iguala o queda por debajo de un valor de referencia $q_0$,
usando un estadístico $Z$ basado en la [[aproximacion-normal-de-la-binomial|aproximación normal de la binomial]]. Se usa cuando el dato es un conteo de éxitos sobre un total.

> Caso particular de [[prueba-de-hipotesis|prueba de hipótesis]] donde el
> parámetro es una **proporción poblacional** $q$ (o $p$).

**Modela:** contrastar si la proporción de una población que satisface cierta
propiedad vale, supera o es menor que un valor de referencia $q_0$.

Sea $q$ la probabilidad **desconocida** de un evento (equivalente: la proporción
de la población que cumple la propiedad). Sea $X$ el número de individuos con la
propiedad en una muestra de $n$ casos independientes. Si $n\ll N$ (población
$N$), entonces $X\sim\text{Binomial}(n,q)$. Si $n$ es **grande** ($>100$), por
[[teorema-central-del-limite|TCL]] $X$ es aproximadamente normal con media $nq$ y
varianza $nq(1-q)$, y el estimador $\hat q = X/n$ es aproximadamente normal.

## Estadístico de prueba

$$ Z = \frac{\hat q - q_0}{\sqrt{\dfrac{q_0(1-q_0)}{n}}} \sim N(0,1) \quad \text{bajo } H_0, $$
con $\hat q = X/n$. (También se puede usar directamente $X$ o $\hat q$, son
estadísticos equivalentes — ver [[apunte-media-estadistico-z|equivalencia de estadísticos]].)

> **Intuición.** En el denominador va $q_0$ y **no** $\hat q$: como todo se
> calcula *bajo $H_0$* (suponiendo $H_0$ cierta), el desvío de $\hat q$ se evalúa
> en el valor hipotético $q_0$, no en el observado. Esto diferencia la prueba del
> [[intervalos-de-confianza|intervalo de confianza]] de la proporción, donde sí
> se usa $\hat q$ en el error estándar (porque ahí no hay un $q_0$ que suponer).

## Reglas de decisión y valor p

Según [[tp9-pruebas-de-hipotesis|TP9]], para $n$ grande y nivel $\alpha$:

| Prueba | Se rechaza si | Valor p |
|---|---|---|
| $q=q_0$ vs $q\ne q_0$ | $Z<-z_{1-\alpha/2}$ ó $Z>z_{1-\alpha/2}$ | $2\,(1-\Phi(\lvert z_{\text{obs}}\rvert))$ |
| $q\le q_0$ vs $q>q_0$ | $Z>z_{1-\alpha}$ | $1-\Phi(z_{\text{obs}})$ |
| $q\ge q_0$ vs $q<q_0$ | $Z<-z_{1-\alpha}$ | $\Phi(z_{\text{obs}})$ |

**Deducción del valor crítico (cola derecha,
[[apunte-prueba-proporcion|apunte]]):** acotando el error tipo I en el peor caso
$p=p_0$, con $\hat p \sim N(p_0,\sqrt{p_0(1-p_0)/n})$,
$$ P(\text{Error I})=1-\Phi\!\left(\tfrac{\hat p_c - p_0}{\sqrt{p_0(1-p_0)/n}}\right)=\alpha \Rightarrow \hat p_c = p_0 + z_{1-\alpha}\sqrt{\tfrac{p_0(1-p_0)}{n}}. $$

**Error tipo II** ($\beta$, [[apunte-prueba-proporcion|apunte]]): para $p>p_0$,
$$ \beta(p)=\Phi\!\left(\tfrac{\hat p_c - p}{\sqrt{p(1-p)/n}}\right),\qquad \beta(\hat p_c)=0.5,\quad \beta(p_0)=1-\alpha,\quad \beta(1)=0. $$
La forma general (TP9) que mezcla $p_0$ y $p_1$:
$$ \beta(q_1)=\Phi\!\left(z_{1-\alpha}\sqrt{\tfrac{q_0(1-q_0)}{q_1(1-q_1)}}+\tfrac{q_0-q_1}{\sqrt{q_1(1-q_1)/n}}\right). $$

## ¿Cuándo usarla?

- El dato es un **conteo de éxitos / fracasos** sobre un total ("18 de 145",
  "92 de 400", "80 de 1000").
- Se pregunta por un **porcentaje / proporción** que supera o no un umbral.
- $n$ grande (en la práctica $>100$) para que valga la aproximación normal.

Ver [[reconocer-prueba-de-hipotesis|cómo reconocer qué prueba usar]].

## Conceptos relacionados

- [[prueba-de-hipotesis]], [[error-tipo-i-y-tipo-ii]], [[valor-p]], [[estadistico-de-prueba]]
- [[distribucion-binomial]], [[distribucion-normal]], [[teorema-central-del-limite]]
- [[aproximacion-normal-de-la-binomial]], [[estandarizacion-y-tabla-normal]] (para evaluar $\Phi$ y los fractiles $z$)
- [[prueba-de-hipotesis-para-la-media]]
- [[diseno-de-prueba-tamano-muestral]] (despejar $n$ y $c$ fijando $\alpha$ y $\beta$ con la fórmula de $\beta(q_1)$ de arriba)

## Ejercicio resuelto

**Enunciado** (ejercicio 17 del [[tp9-pruebas-de-hipotesis|TP9]], también en las
[[intro-prueba-de-hipotesis-slides|slides]]): Una máquina dosificadora se debe
ajustar si el porcentaje de envases con falta de llenado es significativamente
**superior al 8 %**. En una muestra de $n=145$ envases se encontraron $18$
incompletos. ¿Hay que ajustar la máquina? Nivel $\alpha=5\%$. Calcular el valor p.

**Planteo.** "Superior al 8 %" → cola derecha:
$$ H_0: q\le 0.08 \qquad H_1: q>0.08, \qquad \alpha=0.05. $$
Estadístico $Z=\dfrac{\hat q - q_0}{\sqrt{q_0(1-q_0)/n}}$, con
$\hat q=\dfrac{18}{145}\approx 0.1241$, $q_0=0.08$.

**Región de rechazo.** Se rechaza si $Z>z_{0.95}=1.645$.

**Cálculo.**
$$ z_{\text{obs}}=\frac{0.1241-0.08}{\sqrt{\dfrac{0.08\cdot 0.92}{145}}}=\frac{0.0441}{\sqrt{0.000507}}=\frac{0.0441}{0.02252}\approx 1.959. $$
Valor p (cola derecha): $\text{valor p}=1-\Phi(1.959)\approx 0.025$.

**Resultado.** Como $z_{\text{obs}}=1.959 > 1.645$ (equivalente: valor p
$\approx 0.025 < 0.05$), se **rechaza $H_0$**: hay que **ajustar** la máquina
dosificadora. (El TP9 confirma $z=1.959$ y valor p $=0.025$.)
