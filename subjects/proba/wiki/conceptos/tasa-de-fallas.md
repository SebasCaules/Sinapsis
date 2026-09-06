---
titulo: Función de tasa de fallas (tasa de riesgo)
resumen: "Mide el riesgo instantáneo de falla de un componente que ya sobrevivió hasta $t$: $R(t)=f_T(t)/(1-F_T(t))$. Su forma distingue desgaste, mortalidad infantil y falla al azar; $R$ constante caracteriza a la distribución exponencial."
tipo: concepto
unidad: 4
orden: 6
tags: [continua, confiabilidad, exponencial, weibull, tasa-de-fallas]
fuentes: ["[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-09-04
---

# Función de tasa de fallas (tasa de riesgo)

**En breve.** $R(t)=f_T(t)/(1-F_T(t))$ mide el "ritmo de fallar" de un componente que ya sobrevivió hasta $t$. Su forma resume el envejecimiento (creciente = desgaste, decreciente = mortalidad infantil, constante = al azar). $R$ **constante** caracteriza a la [[distribucion-exponencial|exponencial]]; la [[distribucion-weibull|Weibull]] cubre los otros casos.

La **función de tasa de fallas** (o **tasa de riesgo**, *hazard rate*) se asocia a una
[[variable-aleatoria-continua|variable aleatoria continua]] **no negativa** $T$ que modela
una duración o tiempo hasta la falla. Según [[tp4-variables-aleatorias-continuas]] (ej. 13)
se define como

$$ R(t)=\frac{f_T(t)}{1-F_T(t)}, $$

donde $f_T$ es la [[funcion-de-densidad|densidad]] y $F_T$ la
[[funcion-de-distribucion-acumulada|FDA]] de $T$. Al denominador $S(t)=1-F_T(t)=P(T>t)$ se lo
llama **función de supervivencia** (o confiabilidad).

## Interpretación

$R(t)$ es la **tasa instantánea de falla condicionada a haber sobrevivido hasta $t$**: para
$\Delta t$ pequeño,
$$ P\big(t\le T\le t+\Delta t \mid T>t\big)\approx R(t)\,\Delta t. $$
Es decir, $R(t)\,\Delta t$ aproxima la probabilidad de fallar en el próximo instante $\Delta t$
dado que el componente llegó funcionando hasta $t$. La forma de $R(t)$ describe el patrón de
envejecimiento:

- $R$ **creciente**: el componente se desgasta (más propenso a fallar con el tiempo).
- $R$ **decreciente**: "mortalidad infantil" (sobrevivir lo hace más confiable).
- $R$ **constante**: falla **al azar**, sin memoria → caso exponencial (ver abajo).

> [!figura] u4-tres-formas-de-la-tasa-de-fallas
> Tasa de fallas, supervivencia y densidad de una familia Weibull sobre el mismo eje $t$. Al variar el parámetro de forma $b$ se recorren las tres ramas: $b>1$ desgaste, $b=1$ falla al azar (exponencial) y $b<1$ mortalidad infantil.

**Intuición.** $R(t)$ no es la probabilidad de fallar antes de $t$, sino el peligro **en este instante dado que se llegó vivo hasta aquí**. Es la diferencia entre "¿qué chance tengo de morir alguna vez?" (eso es $F_T$) y "a mi edad actual, ¿qué tan riesgoso es el próximo ratito?" (eso es $R$). Un auto viejo tiene $R$ alta aunque ya haya sobrevivido mucho; una pieza recién fabricada con defectos de fábrica tiene $R$ alta al principio y luego baja.

## Relación con la densidad y la supervivencia

Como $\dfrac{d}{dt}\big[1-F_T(t)\big]=-f_T(t)$, la tasa de fallas es la derivada logarítmica
(cambiada de signo) de la supervivencia:
$$ R(t)=\frac{f_T(t)}{1-F_T(t)}=-\frac{S'(t)}{S(t)}=-\frac{d}{dt}\ln S(t). $$
Esto permite recuperar la distribución a partir de $R$: integrando,
$$ S(t)=1-F_T(t)=\exp\!\left(-\int_0^t R(u)\,du\right). $$

## Caracterización de la exponencial: $R$ constante $\iff$ exponencial

> **Resultado ([[tp4-variables-aleatorias-continuas]] ej. 13).** Una variable aleatoria
> continua $T$ que toma valores reales positivos tiene
> [[distribucion-exponencial|distribución exponencial]] **si y solo si** su tasa de fallas
> $R(t)$ es **constante**.

**Demostración.**

($\Rightarrow$) Si $T\sim\text{Expo}(\lambda)$, entonces $f_T(t)=\lambda e^{-\lambda t}$ y
$1-F_T(t)=e^{-\lambda t}$ para $t>0$, de modo que
$$ R(t)=\frac{\lambda e^{-\lambda t}}{e^{-\lambda t}}=\lambda \quad\text{(constante)}. $$

($\Leftarrow$) Supongamos $R(t)=\lambda$ constante. Usando $R(t)=-\dfrac{d}{dt}\ln S(t)$ y la
condición inicial $S(0)=1-F_T(0)=1$ (es un **problema de valor inicial** para $F_T$):
$$ -\frac{d}{dt}\ln S(t)=\lambda \;\Rightarrow\; \ln S(t)=-\lambda t + C,\quad S(0)=1\Rightarrow C=0, $$
$$ S(t)=e^{-\lambda t} \;\Rightarrow\; F_T(t)=1-e^{-\lambda t}, $$
que es exactamente la FDA de una exponencial de parámetro $\lambda$. $\blacksquare$

Esto reexpresa la **falta de memoria** de la [[distribucion-exponencial|exponencial]]: una
tasa de falla que no cambia con la edad equivale a que el pasado no informe sobre el futuro.

## Relación con otras distribuciones

- [[distribucion-exponencial|Exponencial]]: el único caso con $R$ **constante** ($R(t)=\lambda$).
- [[distribucion-weibull|Weibull]]: generaliza la exponencial permitiendo $R$ creciente o
  decreciente. Con parámetro de forma $b$, su tasa de fallas es $R(t)=\lambda b(\lambda t)^{b-1}$,
  que es **potencia de $t$**: constante si $b=1$ (vuelve a la exponencial), creciente si $b>1$,
  decreciente si $b<1$. Por eso la Weibull es el modelo estándar de confiabilidad.
- [[minimo-de-exponenciales|Mínimo de exponenciales]] (sistema en serie): como cada componente
  tiene $R$ constante $\lambda_i$, el sistema en serie tiene $R$ constante $\sum_i\lambda_i$
  (las tasas se suman) y sigue siendo exponencial.

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 13 (enunciado teórico de la guía).

**Enunciado.** Demostrar que una variable aleatoria continua positiva $T$ tiene distribución
exponencial si y solo si su tasa de fallas $R(t)=f_T(t)/(1-F_T(t))$ es constante.

**Planteo.** Probar las dos implicaciones. La clave es escribir $R$ como derivada logarítmica
de la supervivencia $S(t)=1-F_T(t)$ y resolver la ecuación diferencial con $S(0)=1$.

**Cálculo.** (Igual que la demostración de arriba.)
- Directa: exponencial $\Rightarrow f_T=\lambda e^{-\lambda t}$, $S=e^{-\lambda t}$, $R=\lambda$.
- Recíproca: $R=\lambda$ const $\Rightarrow -\dfrac{d}{dt}\ln S=\lambda \Rightarrow S=e^{-\lambda t}
  \Rightarrow F_T=1-e^{-\lambda t}$.

**Resultado.** $T\sim\text{Expo}(\lambda)\iff R(t)\equiv\lambda$. La condición es **necesaria y
suficiente**; la tasa de fallas constante es la firma de la exponencial.
