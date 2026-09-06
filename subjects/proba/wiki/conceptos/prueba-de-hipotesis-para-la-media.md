---
titulo: Prueba de hipótesis para la media
resumen: 'Contrasta si la media poblacional vale, supera o queda por debajo de un valor de referencia $\mu_0$. Se usa el estadístico $Z=(\bar X-\mu_0)/(\sigma/\sqrt{n})$ con $\sigma$ conocida o $n$ grande, y el estadístico $T$ de Student con $\sigma$ desconocida y $n$ chico.'
tipo: concepto
unidad: 9
orden: 5
tags: [prueba-de-hipotesis, media, estadistico-z, t-de-student]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[apunte-media-nula-igual]]", "[[apunte-media-nula-mayor-igual]]", "[[apunte-media-estadistico-z]]", "[[apunte-media-desvio-desconocido]]"]
actualizado: 2026-09-04
---

# Prueba de hipótesis para la media

**En breve.** Contrasta si la media poblacional $\mu$ vale, supera o queda por
debajo de un valor de referencia $\mu_0$, a partir de la media muestral $\bar X$.
La clave es elegir el estadístico correcto: $Z$ si $\sigma$ es conocida o $n$
grande, $T$ ([[distribucion-t-de-student|t de Student]]) si $\sigma$ es
desconocida y $n$ chico.

> Caso particular de [[prueba-de-hipotesis|prueba de hipótesis]] donde el
> parámetro es la **media poblacional** $\mu$.

**Modela:** contrastar si la media de una población vale, es mayor o es menor que
un valor de referencia $\mu_0$, a partir de la media muestral $\bar X$.

Sea $X_1,\dots,X_n$ una muestra i.i.d. de media $\mu$. Hay tres planteos:

| Tipo | $H_0$ | $H_1$ |
|---|---|---|
| Dos colas | $\mu=\mu_0$ | $\mu\ne\mu_0$ |
| Cola derecha | $\mu\le\mu_0$ | $\mu>\mu_0$ |
| Cola izquierda | $\mu\ge\mu_0$ | $\mu<\mu_0$ |

## Caso 1: varianza $\sigma^2$ conocida (o $n$ grande) → estadístico $Z$

Si la muestra es normal con $\sigma^2$ **conocida** (o si $n$ es grande por
[[teorema-central-del-limite|TCL]], aunque no sea normal), el estadístico es
$$ Z = \frac{\bar X - \mu_0}{\sigma/\sqrt n} \sim N(0,1) \quad \text{bajo } H_0. $$

Reglas de decisión y valor p (según [[tp9-pruebas-de-hipotesis|TP9]]):

| Prueba | Se rechaza si | Valor p |
|---|---|---|
| $\mu=\mu_0$ vs $\mu\ne\mu_0$ | $Z<-z_{1-\alpha/2}$ ó $Z>z_{1-\alpha/2}$ | $2\,(1-\Phi(\lvert z_{\text{obs}}\rvert))$ |
| $\mu\le\mu_0$ vs $\mu>\mu_0$ | $Z>z_{1-\alpha}$ | $1-\Phi(z_{\text{obs}})$ |
| $\mu\ge\mu_0$ vs $\mu<\mu_0$ | $Z<-z_{1-\alpha}$ | $\Phi(z_{\text{obs}})$ |

> Si $n$ es grande y $\sigma^2$ es **desconocida**, sigue valiendo todo lo
> anterior usando $Z=\dfrac{\bar X-\mu_0}{S/\sqrt n}$ (con $S$ el desvío muestral).

**Deducción del valor crítico (cola izquierda,
[[apunte-media-nula-mayor-igual|apunte nula mayor o igual]]):** acotando el error
tipo I en el peor caso $\mu=\mu_0$,
$$ P_{\mu_0}(\bar X_n < \bar x_c)=\Phi\!\left(\tfrac{\bar x_c-\mu_0}{\sigma/\sqrt n}\right)=\alpha \Rightarrow \bar x_c = \mu_0 - z_{1-\alpha}\tfrac{\sigma}{\sqrt n}. $$

### Ejercicio resuelto — $\sigma$ conocida, cola izquierda ($Z$)

**Enunciado** (ejercicio 1 del [[tp9-pruebas-de-hipotesis|TP9]]): de una
producción de tubos de hormigón se extrae una muestra de tamaño $n=16$ y se pesan,
resultando una media muestral de $17.5\ \text{kg}$. La varianza del peso de un tubo
es de $4\ \text{kg}^2$ (es decir $\sigma=2\ \text{kg}$) y el peso es normal con
media de referencia $18\ \text{kg}$ (¡lo afirma el fabricante!). A un nivel
$\alpha=5\%$, ¿se puede concluir que el peso medio es significativamente
**inferior** al especificado? Calcular el valor p.

**Planteo.** "Significativamente inferior a $18$" → prueba de **cola izquierda**:
$$ H_0:\mu\ge 18 \qquad H_1:\mu<18. $$
Como $\sigma$ es **conocida** ($\sigma=2$), estadístico $Z=\dfrac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1)$.

**Región de rechazo.** Cola izquierda al $5\%$: se rechaza si $Z<-z_{0.95}=-1.645$.

**Cálculo.**
$$ z_{\text{obs}}=\frac{17.5-18}{2/\sqrt{16}}=\frac{-0.5}{0.5}=-1. $$
Valor p (cola izquierda) $=\Phi(z_{\text{obs}})=\Phi(-1)\approx 0.1587$.

**Resultado.** Como $z_{\text{obs}}=-1 > -1.645$ (equivalente a valor p
$\approx 0.159 > 0.05$), **no se rechaza $H_0$**: la evidencia muestral no apoya
que el peso medio de los tubos haya disminuido respecto del valor especificado
(coincide con la respuesta del TP9).

### Ejemplo motivador — tableros de secado ($Z$, cola derecha)

Es el ejemplo con el que abren las [[intro-prueba-de-hipotesis-slides|slides]]: un
fabricante afirma que el tiempo medio de secado es $\mu\le 20$ min; sobre
$n=36$ tableros el promedio observado da $\bar x=21$ min. ¿Miente el fabricante o
fue el azar? Asumiendo el tiempo de secado normal con $\sigma$ conocida, la prueba
es de **cola derecha**:
$$ H_0:\mu\le 20 \qquad H_1:\mu>20, \qquad Z=\frac{\bar X-20}{\sigma/\sqrt{36}}. $$
Se rechaza $H_0$ si $Z>z_{1-\alpha}$, es decir si $\bar X > 20 + z_{1-\alpha}\,\sigma/6$.
La curva OC de las slides toma $\alpha=0.05$ (de modo que $\beta(20)=1-\alpha=0.95$)
y muestra $\beta(21)\approx 0.20$, $\beta\to 0$ a medida que el verdadero $\mu$
crece por encima de $20$.

> Nota: el valor numérico de $\sigma$ y la conclusión final del ejemplo están
> embebidos como **imágenes** en el pptx (no en el texto extraíble); aquí se deja
> el planteo simbólico. Para un caso de cola derecha con $\sigma$ **desconocida**
> (estadístico $T$), ver el ejercicio resuelto de las lámparas en
> [[valor-p#Ejercicio resuelto|valor p]].

## Caso 2: varianza $\sigma^2$ desconocida, muestra normal, $n$ chico → estadístico $T$

Si la muestra es normal y $\sigma^2$ es **desconocida** (no se la puede
reemplazar por la normal porque $n$ es chico), el estadístico es
$$ T = \frac{\bar X - \mu_0}{S/\sqrt n} \sim t_{n-1} \quad \text{bajo } H_0, $$
una [[distribucion-t-de-student|t de Student]] con $n-1$ grados de libertad.

> **Intuición.** $T$ se parece a $Z$ pero reemplaza el $\sigma$ desconocido por
> su estimación $S$. Como $S$ también es aleatorio (varía de muestra en muestra),
> agrega una fuente extra de incertidumbre: por eso la $t$ tiene **colas más
> pesadas** que la normal y los fractiles críticos son **mayores** ($t_{n-1,1-\alpha}>z_{1-\alpha}$),
> exigiendo más evidencia para rechazar. Al crecer $n$, $S$ se vuelve un
> estimador casi exacto de $\sigma$ y la $t$ converge a la normal.

| Prueba | Se rechaza si | Valor p |
|---|---|---|
| $\mu=\mu_0$ vs $\mu\ne\mu_0$ | $T<-t_{n-1,\,1-\alpha/2}$ ó $T>t_{n-1,\,1-\alpha/2}$ | $2\,(1-\Xi_{n-1}(\lvert t_{\text{obs}}\rvert))$ |
| $\mu\le\mu_0$ vs $\mu>\mu_0$ | $T>t_{n-1,\,1-\alpha}$ | $1-\Xi_{n-1}(t_{\text{obs}})$ |
| $\mu\ge\mu_0$ vs $\mu<\mu_0$ | $T<-t_{n-1,\,1-\alpha}$ | $\Xi_{n-1}(t_{\text{obs}})$ |

donde $\Xi_{n-1}$ es la FDA de la $t$ con $n-1$ g.l. Cuando $n$ es grande
($>200$), $\Xi_{n-1}\approx\Phi$ y $t_{n-1,\delta}\approx z_\delta$ (se recupera el
caso $Z$).

> **Advertencia del docente ([[apunte-media-desvio-desconocido|apunte]]):** La
> regla de decisión debe fijarse **antes** de tomar la muestra. No tiene sentido
> escribir $\bar x_c = \mu_0 + t_{n-1,1-\alpha}\,\tfrac{S}{\sqrt n}$ porque $S$ es
> desconocido de antemano; por eso se trabaja directamente con el estadístico $T$.

> [!figura] u9-por-que-x-c-con-s-esta-mal
> Arriba, la recta correcta: el fractil $t_{n-1,1-\alpha}$ depende solo de $n$ y de $\alpha$, así que la frontera queda fijada antes de muestrear. Abajo, la frontera $\bar x_c=\mu_0+t_{n-1,1-\alpha}\,S/\sqrt n$ no está en ningún lugar definido, porque $S$ solo se conoce con la muestra ya tomada.

## ¿Cuándo usar $Z$ y cuándo $T$?

- $\sigma$ **conocida** → siempre $Z$.
- $\sigma$ **desconocida** y $n$ **grande** → $Z$ con $S$ (vale por TCL).
- $\sigma$ **desconocida**, muestra **normal** y $n$ **chico** → $T$ ($t_{n-1}$).

> [!figura] u9-colas-pesadas-y-el-precio-del-fractil
> La $t_{n-1}$ y la $N(0,1)$ superpuestas, con los dos fractiles críticos marcados sobre el mismo eje: la franja entre ellos es la evidencia extra que exige la $t$. Al subir los grados de libertad las curvas se funden y la diferencia $t_{n-1,1-\alpha}-z_{1-\alpha}$ tiende a cero.

Ver también [[reconocer-prueba-de-hipotesis|cómo reconocer qué prueba usar]].

## Conceptos relacionados

- [[prueba-de-hipotesis]], [[error-tipo-i-y-tipo-ii]], [[valor-p]], [[estadistico-de-prueba]]
- [[distribucion-t-de-student]], [[distribucion-normal]], [[teorema-central-del-limite]]
- [[promedio-muestral]], [[varianza-muestral]], [[distribucion-ji-cuadrado]] (IC de la varianza en el ej. 20)
- [[intervalos-de-confianza]] (dualidad con la prueba de dos colas)
- [[diseno-de-prueba-tamano-muestral]] (fijar $\alpha$ y $\beta$ para despejar $n$)
- [[formulario-pruebas-de-hipotesis]] (cheat-sheet de fórmulas $Z$/$T$)

## Ejercicio resuelto

**Enunciado** (ejercicio 8 resuelto del [[tp9-pruebas-de-hipotesis|TP9]]): Según
un fabricante, la resistencia media de cierto alambre aleado de Al es de
$250\ \text{MN/m}^2$. Un contratista pone a prueba una muestra de tamaño $n=35$ y
obtiene media $274.4$ y desvío estándar $11.2\ \text{MN/m}^2$. ¿Es justificable
concluir que la resistencia es significativamente **diferente** a lo especificado?
Nivel $\alpha=5\%$, variable normal.

**Planteo.** "Diferente" → prueba de **dos colas**:
$$ H_0:\mu=250 \qquad H_1:\mu\ne 250. $$
Como $\sigma$ es desconocido (sólo tenemos $S=11.2$), estadístico
$T=\dfrac{\bar X-\mu_0}{S/\sqrt n}\sim t_{34}$.

**Región de rechazo.** Se rechaza si $|T| > t_{34,\,0.975}\approx 2.0322$.

**Cálculo.**
$$ t_{\text{obs}}=\frac{274.4-250}{11.2/\sqrt{35}}=\frac{24.4}{1.893}\approx 12.889. $$

**Resultado.** Como $t_{\text{obs}}=12.889 > 2.0322$, se **rechaza $H_0$**: hay
suficiente evidencia, a nivel $5\%$, de que la resistencia media de la remesa es
significativamente diferente a la especificada por el fabricante.

---

**Otro ejercicio** (ejercicio 10, cola derecha, $t$): ver el desarrollo completo
en [[valor-p#Ejercicio resuelto|valor p]] (lámparas, $t_{\text{obs}}=4.087$,
valor p $\approx 0.0014$ → se rechaza).

---

## Ejercicio resuelto — prueba de la media ($T$) + IC de la varianza (ji-cuadrado)

**Enunciado** (ejercicio 20 del [[tp9-pruebas-de-hipotesis|TP9]]): en un proceso
químico se producen en promedio $800$ toneladas por día. Las producciones diarias
de una semana fueron: $805,\ 790,\ 790,\ 780,\ 770$.
(a) A nivel $\alpha=5\%$, ¿se puede afirmar que la producción promedio es **menor**
a $800$ toneladas (y que, por tanto, algo anda mal)? (b) Hallar el intervalo de
confianza del $90\%$ para la **varianza** de la producción diaria. (c) ¿Qué
supuestos se requieren?

**Datos muestrales.** $n=5$, $\bar x = 787$ ton, desvío muestral $S=13.04$ ton
($S^2=170$).

**(a) Prueba de la media (cola izquierda, $\sigma$ desconocida → $T$).**
"Menor a $800$" → $H_0:\mu\ge 800$ vs $H_1:\mu<800$. Como $\sigma$ es desconocido
y $n=5$ es chico (muestra normal), estadístico $T=\dfrac{\bar X-\mu_0}{S/\sqrt n}\sim t_{4}$.
$$ t_{\text{obs}}=\frac{787-800}{13.04/\sqrt5}=\frac{-13}{5.832}\approx -2.23. $$
Región de rechazo (cola izquierda, $4$ g.l.): $T<-t_{4,0.95}=-2.132$. Como
$t_{\text{obs}}=-2.23 < -2.132$, se **rechaza $H_0$**: hay evidencia de una
disminución significativa de la media diaria → algo anda mal en el proceso.

**(b) IC del $90\%$ para la varianza** (usa $(n-1)S^2/\sigma^2\sim\chi^2_{n-1}$,
[[varianza-muestral|varianza muestral]] y la [[distribucion-ji-cuadrado|ji-cuadrado]]).
Con $n-1=4$ g.l. y $\chi^2_{4,\,0.05}=0.7107$, $\chi^2_{4,\,0.95}=9.4877$:
$$ \left[\frac{(n-1)S^2}{\chi^2_{4,\,0.95}},\ \frac{(n-1)S^2}{\chi^2_{4,\,0.05}}\right] = \left[\frac{4\cdot 170}{9.4877},\ \frac{4\cdot 170}{0.7107}\right] \approx [71.67,\ 956.77]. $$

**(c) Supuestos.** El procedimiento es válido si la producción diaria es una
**variable aleatoria normal** (para que $T\sim t_{n-1}$ y $(n-1)S^2/\sigma^2\sim\chi^2_{n-1}$).

**Resultado.** Se rechaza $H_0$ ($t_{\text{obs}}=-2.23 < -2.132$); el IC del $90\%$
para la varianza es $(71.67,\ 956.77)$ (coincide con la respuesta del TP9). Este
ejercicio ilustra la **dualidad** entre prueba e [[intervalos-de-confianza|intervalo de confianza]] y combina los dos estadísticos de muestra normal: $T$ para la media
y $\chi^2$ para la varianza.
