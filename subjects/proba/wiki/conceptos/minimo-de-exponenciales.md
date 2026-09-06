---
titulo: Mínimo de exponenciales (sistemas en serie)
resumen: 'El mínimo de exponenciales independientes es exponencial con tasa igual a la suma, $T\sim\text{Expo}(\sum_i\lambda_i)$ y $E[T]=1/\sum_i\lambda_i$. Modela el sistema en serie y se deduce con la cola $P(T>t)$.'
tipo: concepto
unidad: 4
orden: 5
tags: [continua, exponencial, confiabilidad, minimo, serie]
fuentes: ["[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-06-06
---

# Mínimo de exponenciales (sistemas en serie)

**En breve.** El mínimo de exponenciales independientes vuelve a ser [[distribucion-exponencial|exponencial]], con tasa igual a la **suma** de las tasas. Es el modelo del sistema en serie (falla en cuanto falla el primer componente) y se deduce fácil trabajando con la cola $P(T>t)$.

Si $X_1,\dots,X_n$ son variables aleatorias **exponenciales independientes** de tasas
$\lambda_1,\dots,\lambda_n$, entonces el **mínimo** $T=\min(X_1,\dots,X_n)$ vuelve a ser
[[distribucion-exponencial|exponencial]], con tasa igual a la **suma** de las tasas:

$$ T=\min(X_1,\dots,X_n)\sim\text{Expo}\!\left(\textstyle\sum_{i=1}^n \lambda_i\right). $$

Modela un **sistema en serie**: $n$ componentes conectados de forma que el sistema falla en
cuanto falla **alguno** de ellos. La duración del sistema es el primero en fallar, es decir el
mínimo de las duraciones individuales ([[tp4-variables-aleatorias-continuas]] ej. 11).

## Deducción (vía la cola / supervivencia)

La clave es trabajar con la [[funcion-de-distribucion-acumulada|FDA]] del mínimo a través de su
**función de supervivencia** $P(T>t)$. El mínimo supera $t$ si y solo si **todos** lo superan;
por independencia el producto se factoriza:
$$ P(T>t)=P(X_1>t,\dots,X_n>t)=\prod_{i=1}^n P(X_i>t)=\prod_{i=1}^n e^{-\lambda_i t}
=\exp\!\left(-\Big(\textstyle\sum_i \lambda_i\Big)t\right). $$
Entonces
$$ F_T(t)=1-P(T>t)=1-\exp\!\left(-\Big(\textstyle\sum_i \lambda_i\Big)t\right),\qquad
f_T(t)=F_T'(t)=\Big(\textstyle\sum_i \lambda_i\Big)\exp\!\left(-\Big(\textstyle\sum_i \lambda_i\Big)t\right), $$
que es exactamente la distribución de una $\text{Expo}\big(\sum_i \lambda_i\big)$. Por lo tanto
$$ E[T]=\frac{1}{\sum_i \lambda_i}. $$

> El **mínimo** de exponenciales es exponencial. No confundir con la **suma** de exponenciales
> i.i.d., que es Gamma/Erlang (ver [[distribucion-gamma|Gamma]], forward-link de U7) — la suma
> modela componentes en *standby* (uno arranca cuando falla el anterior), no en serie.

## Caso idéntico

Si las $n$ tasas son iguales, $\lambda_i=\lambda$, entonces
$$ T\sim\text{Expo}(n\lambda),\qquad E[T]=\frac{1}{n\lambda}=\frac{E[X_1]}{n}. $$
Cuantos más componentes en serie, **antes** falla el sistema (la vida media cae como $1/n$).

**Intuición (las tasas se suman).** La tasa exponencial es un "ritmo de fallar" (ver [[tasa-de-fallas|tasa de fallas]], donde la exponencial es el caso de tasa constante). Si $n$ componentes pueden fallar en paralelo y el primero que falla tumba al sistema, los ritmos individuales se **acumulan**: el sistema falla a ritmo $\sum_i\lambda_i$. Por eso el mínimo es más "peligroso" que cada componente por separado, y su vida media $1/\sum_i\lambda_i$ es menor que la de cualquiera.

## Relaciones con otras distribuciones

- Cada componente es [[distribucion-exponencial|exponencial]]; el mínimo también lo es.
- Aparece en [[proceso-de-poisson|procesos de Poisson]]: si superponemos procesos de tasas
  $\lambda_i$, el tiempo al primer evento es el mínimo de exponenciales → exponencial de tasa
  $\sum_i\lambda_i$.
- Contrapartida de la **suma** de exponenciales (sistema en *standby*) que da
  [[distribucion-gamma|Gamma]]/Erlang (forward-link, U7).

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 11 (enunciado de la guía).

**Enunciado.** Un sistema consta de $n$ componentes idénticos conectados **en serie**: si falla
al menos uno, falla todo el sistema. La duración de cada componente es exponencial de parámetro
$\lambda=0.01$ 1/hora, y los componentes fallan independientemente. Definiendo
$A_i=\{$el $i$-ésimo dura al menos $t$ horas$\}$ y $T=$ duración del sistema (mínima de las $n$),
obtener $F_T(t)=P(T<t)$ y la densidad $f_T(t)$. ¿Qué distribución tiene $T$? ¿Cuál es $E[T]$?

**Planteo.** $T<t$ es el complemento de "todos duran $\ge t$". Por independencia,
$P(\text{todos}\ge t)=\prod_i P(A_i)=\prod_i e^{-\lambda t}=e^{-n\lambda t}$.

**Cálculo.** Con $\lambda=0.01=\tfrac{1}{100}$:
$$ P(T\ge t)=\Big(e^{-0.01t}\Big)^n=e^{-n t/100}\;\Rightarrow\; F_T(t)=1-e^{-n t/100}\quad(t>0), $$
$$ f_T(t)=F_T'(t)=\frac{n}{100}\,e^{-n t/100}=0.01\,n\,e^{-n t/100}. $$
Esta es la densidad de una **exponencial de parámetro** $n\lambda=\dfrac{n}{100}$, así que
$$ T\sim\text{Expo}\!\left(\frac{n}{100}\right),\qquad E[T]=\frac{1}{n/100}=\frac{100}{n}\ \text{horas}. $$

**Resultado.** $F_T(t)=1-e^{-nt/100}$, $f_T(t)=0.01\,n\,e^{-nt/100}$; $T$ es exponencial de
tasa $n/100$ y $E[T]=100/n$ horas (coincide con las Respuestas de la guía, ej. 11).
