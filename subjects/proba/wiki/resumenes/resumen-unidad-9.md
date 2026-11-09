---
titulo: "Resumen de la Unidad 9 — Pruebas de Hipótesis"
tipo: resumen
unidad: 9
orden: 1
hub: true
tags: [resumen, prueba-de-hipotesis, valor-p, error-tipo-ii]
resumen: "Una prueba de hipótesis decide entre $H_0$ y $H_1$ con un estadístico de distribución conocida bajo $H_0$: se rechaza si cae en la región de nivel $\alpha$ o si el valor p es menor que $\alpha$. Para la media se usa $Z$ o $T$, para la proporción $Z$; fijar $\alpha$ y $\beta$ determina $n$."
fuentes: ["[[prueba-de-hipotesis]]", "[[estadistico-de-prueba]]", "[[error-tipo-i-y-tipo-ii]]", "[[valor-p]]", "[[prueba-de-hipotesis-para-la-media]]", "[[prueba-de-hipotesis-para-la-proporcion]]", "[[reconocer-prueba-de-hipotesis]]", "[[diseno-de-prueba-tamano-muestral]]", "[[formulario-pruebas-de-hipotesis]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 9 — Pruebas de Hipótesis

La unidad 8 ([[inferencia-estadistica|Inferencia Estadística]]) enseñó a **estimar** un parámetro poblacional a partir de una muestra, con el promedio muestral $\bar X$ (introducido en la unidad 7), el desvío muestral $S$ y los [[intervalos-de-confianza|intervalos de confianza]]. La unidad 9 usa esas mismas herramientas para **decidir**: dada una afirmación sobre un parámetro (la media $\mu$ o una proporción $q$), ¿la muestra aporta evidencia suficiente para rechazarla? La decisión nunca es segura, porque la muestra es aleatoria; lo que se hace es **controlar de antemano la probabilidad de equivocarse**. Toda la unidad descansa en la distribución del promedio estandarizado: la normal (por muestra normal o por el [[teorema-central-del-limite|TCL]] con $n$ grande) y la [[distribucion-t-de-student|t de Student]] cuando $\sigma$ es desconocido y $n$ es pequeño. Es la última unidad del programa y cierra el bloque de inferencia.

> [!info] Lo esencial
> - Se contrastan dos hipótesis: $H_0$ (lleva siempre la igualdad, es el statu quo) y $H_1$ (donde suele ir la afirmación que se quiere probar con evidencia).
> - El estadístico de prueba resume la muestra en un número con distribución conocida bajo $H_0$; se rechaza $H_0$ si cae en la región de rechazo, ubicada en la(s) cola(s) que indica $H_1$.
> - Error tipo I: rechazar $H_0$ siendo verdadera (probabilidad $\le\alpha$, se fija). Error tipo II: aceptarla siendo falsa ($\beta$, es una función del valor real). Potencia $=1-\beta$.
> - Regla del valor p: se rechaza $H_0$ si y solo si valor p $<\alpha$.
> - Media: $Z$ si $\sigma$ es conocida o $n$ es grande; $T\sim t_{n-1}$ si $\sigma$ es desconocida, la muestra normal y $n$ pequeño. Proporción: $Z$ con el desvío evaluado en $q_0$.
> - Para bajar $\alpha$ y $\beta$ a la vez hay que aumentar $n$; fijando ambos se despejan $n$ y el valor crítico.

> [!nota] Notación del wiki
> La proporción poblacional se escribe $q$ (con $\hat q=X/n$ y valor de referencia $q_0$) en la mayoría de las páginas, pero en algunos ejemplos y apuntes aparece como $p$ ($\hat p$, $p_0$): son lo mismo. $\Phi$ es la FDA de la normal estándar y $\Xi_{n-1}$ la FDA de la $t$ con $n-1$ grados de libertad; $z_\delta$ y $t_{n-1,\delta}$ son los fractiles que dejan área $\delta$ a su izquierda.

## 1. Hipótesis, tipos de prueba y procedimiento

Una **prueba de hipótesis** contrasta dos hipótesis mutuamente excluyentes sobre un parámetro $\theta$ de la población. La **hipótesis nula** $H_0$ es la afirmación por defecto, que se mantiene salvo **evidencia fuerte** en contra; la **hipótesis alternativa** $H_1$ es su complemento. No son simétricas: como en un juicio, la carga de la prueba recae sobre $H_1$, y no rechazar $H_0$ por falta de evidencia **no demuestra** que sea cierta. Según hacia dónde apunta $H_1$ hay tres tipos de prueba:

| Tipo | $H_0$ | $H_1$ | Región de rechazo |
|---|---|---|---|
| Dos colas (bilateral) | $\theta=\theta_0$ | $\theta\ne\theta_0$ | en ambas colas |
| Cola derecha | $\theta\le\theta_0$ | $\theta>\theta_0$ | a la derecha |
| Cola izquierda | $\theta\ge\theta_0$ | $\theta<\theta_0$ | a la izquierda |

El **nivel de significación** $\alpha$ es la cota de la probabilidad de rechazar $H_0$ siendo cierta. La región crítica se elige de modo que:

$$ P_{H_0}\!\left(\Lambda \in R^{(\alpha)}\right) \le \alpha $$

$\Lambda$ es el estadístico de prueba y $R^{(\alpha)}$ la región de rechazo. Aunque $H_0$ diga $\le$ o $\ge$, el valor crítico se deduce en el caso límite $\theta=\theta_0$, el más desfavorable dentro de $H_0$.

**Procedimiento estilo parcial:** (1) identificar el parámetro y plantear $H_0$, $H_1$ y la cola; (2) elegir el estadístico y su distribución bajo $H_0$; (3) fijar $\alpha$ y construir la región de rechazo; (4) calcular el valor observado; (5) decidir: rechazar si cae en $R$ o si valor p $<\alpha$; (6) concluir en palabras del problema. Gracias al TCL, las fórmulas basadas en la normal valen aunque la variable no sea normal si $n$ es grande. La prueba de dos colas es dual del [[intervalos-de-confianza|intervalo de confianza]]: con nivel $\alpha$ se rechaza $H_0:\theta=\theta_0$ exactamente cuando $\theta_0$ queda fuera del intervalo de confianza $1-\alpha$.

Detalle: [[prueba-de-hipotesis|Prueba de hipótesis]]

## 2. Estadístico de prueba y región de rechazo

El **estadístico de prueba** $\Lambda$ es una función de la muestra (un solo número) con distribución conocida bajo $H_0$. La **región de rechazo** (región crítica) $R$ es el conjunto de valores de $\Lambda$ que llevan a rechazar: se rechaza $H_0 \iff \Lambda\in R$. Vive en las **colas** porque ahí caen los valores improbables bajo $H_0$, y la masa que se deja en la cola es exactamente $\alpha$. Trabajar con el estimador ($\bar X$, $\hat q$) o con su versión estandarizada ($Z$, $T$) es **equivalente**, porque la transformación es lineal y monótona ($\bar X>\bar x_c \iff Z>z_c$); la cátedra usa la estandarizada porque alcanza con una sola tabla.

Con $Z\sim N(0,1)$ bajo $H_0$, las reglas de rechazo son:

$$ \text{Dos colas: } |Z|>z_{1-\alpha/2} \qquad \text{Cola derecha: } Z>z_{1-\alpha} \qquad \text{Cola izquierda: } Z<-z_{1-\alpha} $$

Con $T$ se reemplaza $z$ por el fractil $t_{n-1}$ correspondiente. El **valor crítico del estimador** se obtiene «des-estandarizando»; por ejemplo, para la media con cola derecha:

$$ \bar x_c = \mu_0 + z_{1-\alpha}\,\frac{\sigma}{\sqrt n} $$

$\mu_0$ es el valor de referencia, $\sigma$ el desvío poblacional conocido y $n$ el tamaño de muestra. Para cola izquierda el signo es $-$; para dos colas, $\mu_0\pm z_{1-\alpha/2}\,\sigma/\sqrt n$.

**Cómo reconocerlo:** el enunciado da la regla en términos del estimador («se rechaza si la media muestral es menor que 4970») o pide la región crítica en las unidades del problema; ahí conviene pasar entre $\bar x_c$ y $z_c$ con la estandarización.

Detalle: [[estadistico-de-prueba|Estadístico de prueba y región de rechazo]]

## 3. Errores tipo I y tipo II, potencia y curva OC

Toda decisión puede fallar de dos maneras:

| | $H_0$ verdadera | $H_0$ falsa |
|---|---|---|
| Se acepta $H_0$ | OK | **Error tipo II** ($\beta$) |
| Se rechaza $H_0$ | **Error tipo I** ($\alpha$) | OK |

El **error tipo I** (rechazar $H_0$ verdadera) tiene probabilidad máxima $\alpha$: es **un solo número** que se fija de antemano, calculado en $\theta_0$. El **error tipo II** (aceptar $H_0$ falsa) tiene probabilidad $\beta$, que es una **función** $\beta(\theta_1)$ del valor real del parámetro bajo $H_1$: solo se puede calcular para un $\theta_1$ concreto. La **potencia** es $1-\beta$, la probabilidad de rechazar $H_0$ cuando es falsa. Hay que buscar un **balance**: bajar $\alpha$ tiende a subir $\beta$, y para bajar ambos a la vez hay que **aumentar $n$**.

Para la media con $\sigma$ conocida y cola derecha:

$$ \beta(\mu_1)=\Phi\!\left(z_{1-\alpha}+\frac{\mu_0-\mu_1}{\sigma/\sqrt n}\right) $$

$\mu_1$ es el valor real de la media bajo $H_1$. Para cola izquierda, $\beta(\mu_1)=1-\Phi\!\left(-z_{1-\alpha}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$; para dos colas, $\beta(\mu_1)=\Phi\!\left(z_{1-\alpha/2}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)-\Phi\!\left(-z_{1-\alpha/2}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$. Si la regla viene dada en el estimador, es más directo calcular $\beta(\mu_1)=P_{\mu_1}(\text{no rechazar})$ con la distribución de $\bar X$ centrada en $\mu_1$.

La gráfica de $\beta(\theta_1)$ es la **curva característica de operación (curva OC)**; la de $1-\beta(\theta_1)$, la **curva de potencia**. Sus puntos guía:

$$ \beta(\theta_0)=1-\alpha, \qquad \beta(\text{valor crítico})\approx 0.5, \qquad \beta(\theta_1)\to 0 \text{ al alejarse hacia } H_1 $$

El segundo vale si la distribución del estadístico es simétrica.

**Cómo reconocerlo:** el enunciado pregunta «probabilidad de error tipo I» para una regla dada (se calcula bajo $\theta_0$), «probabilidad de error tipo II si en realidad $\mu=\dots$» (se calcula bajo ese $\theta_1$), o pide bosquejar la curva OC. Cuando $\sigma$ es desconocido, $\beta$ no puede calcularse antes de muestrear; una salida práctica es estimar $S$ con una **muestra piloto**.

Detalle: [[error-tipo-i-y-tipo-ii|Error tipo I y tipo II]]

## 4. Valor p

El **valor p** es la probabilidad de que, **si $H_0$ es verdadera**, el estadístico tome un valor **tan contrario a $H_0$ o más** que el observado. Es el **nivel de significación más pequeño** al que todavía se rechazaría $H_0$: se rechaza para todo $\alpha>$ valor p. Se define sobre la cola completa y no sobre el suceso puntual, que en una distribución continua tiene probabilidad $0$. La regla vale igual para cualquier prueba:

$$ \text{Se rechaza } H_0 \iff \text{valor p} < \alpha $$

Con el estadístico estandarizado $Z$, según la cola:

$$ \text{derecha: } 1-\Phi(z_{\text{obs}}) \qquad \text{izquierda: } \Phi(z_{\text{obs}}) \qquad \text{dos colas: } 2\,\big(1-\Phi(|z_{\text{obs}}|)\big) $$

Con $T\sim t_{n-1}$ se reemplaza $\Phi$ por $\Xi_{n-1}$. Si $t_{\text{obs}}$ no coincide con un fractil tabulado, se lo **acota entre dos fractiles conocidos**; por ejemplo, en una prueba de cola izquierda ($H_1:\mu<\mu_0$) con $t_9$ y $t_{\text{obs}}=-1.5811$, como $-t_{9,0.95}\le t_{\text{obs}}\le -t_{9,0.9}$ y esos fractiles dejan $5\%$ y $10\%$ de área a su izquierda, se concluye $0.05\le$ valor p $\le 0.1$ (con dos colas, el mismo $t_{\text{obs}}$ daría $0.1\le$ valor p $\le 0.2$), lo que alcanza para decidir cuando $\alpha$ cae fuera de ese intervalo.

> [!warn] Qué no es el valor p
> El valor p **no** es la probabilidad de que $H_0$ sea verdadera: el parámetro tiene un valor fijo aunque desconocido. Es una probabilidad sobre los **datos** condicionada a $H_0$. Un valor p pequeño hace dudar de $H_0$, pero rechazar puede ser un error tipo I.

**Cómo reconocerlo:** el enunciado dice «calcular el valor p» o «¿para qué niveles de significación se rechaza?».

Detalle: [[valor-p|Valor p]]

## 5. Prueba de hipótesis para la media

Contrasta si la media poblacional $\mu$ vale, supera o queda por debajo de $\mu_0$, a partir de $\bar X$ de una muestra i.i.d. La clave es **elegir el estadístico** según lo que se sabe de $\sigma$ y del tamaño de muestra.

**Caso 1: $\sigma$ conocida** (muestra normal, o cualquier muestra con $n$ grande por TCL):

$$ Z = \frac{\bar X - \mu_0}{\sigma/\sqrt n} \sim N(0,1) \text{ bajo } H_0 $$

Si $n$ es grande y $\sigma$ es desconocida, vale lo mismo reemplazando $\sigma$ por el desvío muestral $S$.

**Caso 2: $\sigma$ desconocida, muestra normal, $n$ pequeño:**

$$ T = \frac{\bar X - \mu_0}{S/\sqrt n} \sim t_{n-1} \text{ bajo } H_0 $$

$S$ es el desvío muestral y $n-1$ los grados de libertad. Como $S$ también es aleatorio, la $t$ tiene **colas más pesadas** que la normal y sus fractiles son mayores ($t_{n-1,1-\alpha}>z_{1-\alpha}$): exige más evidencia para rechazar. Cuando $n$ es grande ($>200$), $\Xi_{n-1}\approx\Phi$ y $t_{n-1,\delta}\approx z_\delta$.

Las reglas de rechazo y el valor p son los de las secciones 2 y 4, con $z$ o $t_{n-1}$ según el caso. En resumen:

| Situación | Estadístico |
|---|---|
| $\sigma$ conocida | $Z$ con $\sigma$ |
| $\sigma$ desconocida y $n$ grande | $Z$ con $S$ (vale por TCL) |
| $\sigma$ desconocida, muestra normal y $n$ pequeño | $T\sim t_{n-1}$ |

> [!warn] La regla con $T$ se fija antes de muestrear
> No tiene sentido escribir $\bar x_c=\mu_0+t_{n-1,1-\alpha}\,S/\sqrt n$, porque $S$ se conoce recién con la muestra tomada. Con $\sigma$ desconocida se trabaja directamente con el estadístico $T$, cuyo fractil depende solo de $n$ y de $\alpha$.

**Cómo reconocerlo:** el dato es un promedio, un «tiempo medio», un «peso promedio» o una lista de mediciones. Si el enunciado da la varianza poblacional, corresponde $Z$; si solo da un desvío calculado de la muestra y $n$ es pequeño, corresponde $T$.

Detalle: [[prueba-de-hipotesis-para-la-media|Prueba de hipótesis para la media]]

## 6. Prueba de hipótesis para la proporción

Contrasta si la proporción $q$ de la población que cumple una propiedad vale, supera o queda por debajo de $q_0$. Si $X$ es la cantidad de éxitos en $n$ casos independientes ($n\ll N$), $X\sim\text{Bin}(n,q)$; con $n$ grande, por la [[aproximacion-normal-de-la-binomial|aproximación normal de la binomial]], $\hat q=X/n$ es aproximadamente normal. El umbral de «$n$ grande» no es único en el wiki: las páginas de la unidad 9 usan $n>100$, la unidad 7 da como criterio de la aproximación $nq\ge5$ y $n(1-q)\ge5$ (la clase en video pide $nq>10$ y $n(1-q)>10$), y la unidad 8 menciona $n>100$, $>100/200$ o $>200$ según la página. El estadístico es:

$$ Z = \frac{\hat q - q_0}{\sqrt{q_0(1-q_0)/n}} \sim N(0,1) \text{ bajo } H_0 $$

$\hat q=X/n$ es la proporción observada y $q_0$ el valor de referencia. Las reglas de rechazo y el valor p son las mismas que para $Z$ en la media. El valor crítico, para cola derecha:

$$ \hat q_c = q_0 + z_{1-\alpha}\sqrt{\frac{q_0(1-q_0)}{n}} $$

Y el error tipo II para cola derecha, en la forma general del TP9:

$$ \beta(q_1)=\Phi\!\left(z_{1-\alpha}\sqrt{\frac{q_0(1-q_0)}{q_1(1-q_1)}}+\frac{q_0-q_1}{\sqrt{q_1(1-q_1)/n}}\right) $$

$q_1$ es el valor real de la proporción bajo $H_1$; la raíz del primer término aparece porque bajo $q_1$ la varianza cambia. Si ya se calculó $\hat q_c$, es más directo $\beta(q_1)=\Phi\!\left(\tfrac{\hat q_c-q_1}{\sqrt{q_1(1-q_1)/n}}\right)$, con $\beta(\hat q_c)=0.5$ y $\beta(1)=0$.

> [!warn] En el denominador va $q_0$, no $\hat q$
> Todo se calcula suponiendo $H_0$ cierta, así que el desvío de $\hat q$ se evalúa en el valor hipotético $q_0$. Es la diferencia con el intervalo de confianza de la proporción, donde sí se usa $\hat q$ en el error estándar.

**Cómo reconocerlo:** el dato es un conteo de éxitos sobre un total («18 de 145», «92 de 400», «80 de 1000») o se pregunta por un porcentaje que supera o no un umbral, con $n$ grande.

Detalle: [[prueba-de-hipotesis-para-la-proporcion|Prueba de hipótesis para la proporción]]

## 7. Cómo reconocer y plantear una prueba

Es la receta para no equivocar el planteo, que es el error más común. **Paso 0:** las señales de una prueba son «¿se puede concluir/afirmar que…?», «¿hay evidencia de que…?», «¿es justificable…?», «¿hay que ajustar…?», «con un nivel de significación del X %», junto con un valor de referencia. **Paso 1:** un promedio o una lista de mediciones indica media; un conteo de éxitos o un porcentaje indica proporción. **Paso 2:** plantear las hipótesis con la **regla de oro**: la **igualdad siempre va en $H_0$** y la afirmación que se quiere probar con evidencia suele ir en $H_1$, porque así concluir a favor de ella queda protegido por un $\alpha$ pequeño. No siempre es así: en el ejercicio Corvette la hipótesis formulada («al menos el 15 %») lleva la igualdad y queda en $H_0:p\ge 0.15$.

| El enunciado pregunta por… | $H_0$ | $H_1$ | Cola |
|---|---|---|---|
| «diferente / distinto a $\theta_0$» | $\theta=\theta_0$ | $\theta\ne\theta_0$ | dos colas |
| «mayor / superior», «aumentó» | $\theta\le\theta_0$ | $\theta>\theta_0$ | derecha |
| «menor / inferior», «disminuyó», «no llega» | $\theta\ge\theta_0$ | $\theta<\theta_0$ | izquierda |

**Paso 3:** elegir el estadístico ($Z$ o $T$ para la media, $Z$ para la proporción). **Paso 4:** buscar el fractil crítico, calcular el valor observado, decidir y **concluir en palabras del problema**. La regla de decisión se resume en:

$$ \text{rechazar } H_0 \iff \lambda_{\text{obs}}\in R \iff \text{valor p}<\alpha $$

$\lambda_{\text{obs}}$ es el valor observado del estadístico.

> [!warn] Errores frecuentes
> Poner la igualdad en $H_1$; confundir la cola («inferior» o «no llegan» es izquierda); usar $Z$ con $n$ pequeño y $\sigma$ desconocido (corresponde $T$); olvidar dividir $\alpha$ entre 2 en dos colas; fijar la regla con $S$ después de ver la muestra.

Detalle: [[reconocer-prueba-de-hipotesis|Cómo reconocer y plantear una prueba de hipótesis]]

## 8. Diseño de la prueba y tamaño muestral

Es el **problema inverso**: en lugar de calcular $\alpha$ y $\beta$ a partir de $n$ y la regla, se **fijan** $\alpha$ y un $\beta^*$ objetivo para un valor alternativo $\theta_1$, y se **despejan** el tamaño de muestra $n$ y el valor crítico. Son **dos ecuaciones con dos incógnitas**: controlar el error tipo I en el borde de $H_0$ ($\alpha=P_{\theta_0}(\text{rechazar})$) y el error tipo II en $\theta_1$ ($\beta(\theta_1)\le\beta^*$). Para la media con $\sigma$ conocida en una prueba de una cola (aquí, cola derecha):

$$ n=\left(\frac{(z_{1-\alpha}+z_{1-\beta^*})\,\sigma}{\mu_1-\mu_0}\right)^2 $$

Se redondea **hacia arriba** y luego se calcula la frontera $\bar x_c=\mu_0+z_{1-\alpha}\,\sigma/\sqrt n$. Para cola izquierda la fórmula de $n$ es la misma con $|\mu_1-\mu_0|$ y la frontera lleva signo $-$. Leída como intuición: bajar $\alpha$ o $\beta^*$ o subir $\sigma$ pide más muestra, y como la brecha $|\mu_1-\mu_0|$ entra al cuadrado, **partirla a la mitad cuadruplica $n$**.

Para la proporción se iguala el argumento de $\beta(q_1)$ a $-z_{1-\beta^*}$ y se despeja $\sqrt n$:

$$ z_{1-\alpha}\sqrt{\frac{q_0(1-q_0)}{q_1(1-q_1)}}+\frac{q_0-q_1}{\sqrt{q_1(1-q_1)/n}}=-z_{1-\beta^*} $$

Después, como se rechaza si $X>n\,\hat q_c$ y $X$ es entero, el valor crítico en número de defectuosos $c$ es el primer entero mayor que $n\,\hat q_c$ (no el redondeo usual), y la regla queda **rechazar $H_0$ si $X\ge c$**: en el ej. 16, $X>3.50$ da $c=4$, es decir, se revisa el proceso con 4 o más defectuosas.

> [!warn] Discrepancia: qué se llama $c$
> El [[formulario-pruebas-de-hipotesis|formulario de pruebas de hipótesis]] escribe «$c=n\,\hat q_c$», que en el ej. 16 vale $3.50$ y se usa con la regla «rechazar si $X>c$». Este resumen y la [[diseno-de-prueba-tamano-muestral|técnica de diseño]] llaman $c$ al entero $4$, con la regla «rechazar si $X\ge c$». Las dos reglas rechazan exactamente los mismos valores de $X$; solo cambia a qué número se le da el nombre $c$.

**Cómo reconocerlo:** el enunciado traduce los riesgos en palabras: «detener/actuar cuando no hacía falta» es $\alpha$; «no detener/no actuar cuando la proporción real es del 6 %» es $\beta(\theta_1)$; y pide «determinar $n$ y $c$» o «el tamaño de muestra necesario».

> [!warn] Discrepancia: ejercicio 16 del TP9
> Las Respuestas del TP9 dicen $n=91$, pero la Resolución paso a paso del mismo TP9 obtiene $n\ge 89.91\Rightarrow n=90$ (con $n=90$ ya se cumple $\beta(0.06)\approx 0.1998<0.2$ y con $n=89$ no). El wiki toma $n=90$ como correcto; el valor crítico $c=4$ coincide en ambas versiones.

Detalle: [[diseno-de-prueba-tamano-muestral|Diseño de la prueba y tamaño muestral (fijar α y β)]]

## Cómo aparece en los parciales

Los ejercicios resueltos de estas páginas (casi todos del TP9) muestran estos patrones:

- **Prueba completa de la media con $\sigma$ conocida ($Z$).** Tubos de hormigón (ej. 1): «¿es el peso medio significativamente inferior a 18 kg?» con $\sigma=2$, $n=16$, $\bar x=17.5$; cola izquierda, $z_{\text{obs}}=-1>-1.645$, valor p $\approx 0.159$, no se rechaza.
- **Prueba de la media con $\sigma$ desconocida ($T$).** Tiempo de una operación (ej. 11, cola derecha, $t_{\text{obs}}=0.399<1.7613$, no se rechaza); lámparas (ej. 10, cola derecha, $t_{\text{obs}}=4.087$, valor p $\approx 0.0014$, se rechaza); alambre de aluminio (ej. 8, «diferente», dos colas, $t_{\text{obs}}=12.889>2.0322$, se rechaza).
- **Prueba de la media combinada con un intervalo de confianza para la varianza.** Producción química (ej. 20): $T$ de cola izquierda con $n=5$ y luego IC del 90 % para $\sigma^2$ con la [[distribucion-ji-cuadrado|ji-cuadrado]]; se pide además enunciar el supuesto de normalidad.
- **Prueba de proporción.** Máquina dosificadora (ej. 17, «superior al 8 %», $z_{\text{obs}}=1.959$, valor p $\approx 0.025$, hay que ajustar); campaña vial (ej. 15, «hizo descender», $z_{\text{obs}}\approx -3.055$, se rechaza); Corvette (ej. 12, «al menos el 15 %», $z_{\text{obs}}\approx -6.2$, se rechaza).
- **Calcular $\alpha$ y $\beta$ para una regla dada en el estimador.** Cemento (ej. 2): «se rechaza si la media muestral es menor que 4970»; $\alpha=\Phi(-1.768)\approx 0.039$ y $\beta(4960)\approx 0.278$.
- **Error tipo II como función, sin normal.** Caja de 12 piezas (ej. 13): extrayendo una sola pieza, $\beta(k)=(12-k)/12$.
- **Diseño para la media con $\sigma$ conocida: fijar $\alpha$ y $\beta$ y despejar $n$ y $\bar x_c$.** Alambre de 280 kg con $\sigma=20$ (ej. 4, cola derecha), partidas de 1250 kg con $\sigma=180$ (ej. 6, cola izquierda) y paquetes de cereal de 360 g con $\sigma=30$ (ej. 7): se usa la fórmula de $n$ de la sección 8 y se pide la regla de decisión, a veces con curvas OC y de potencia. La pieza de 11.5 cm con $\sigma=0.1$ (ej. 5) es de dos colas: el TP9 sugiere despreciar la cola opuesta y verificarlo después.
- **Diseño para la proporción: despejar $n$ y $c$, con curva OC.** Control de defectuosos (ej. 16): $n=90$, $c=4$, y bosquejo de la curva OC con sus puntos guía.
- **Valor crítico simbólico para la media (parcialito real).** En el [[parcialito-tp8y9-acf|parcialito de TP8 y TP9]], el ej. 2 pide la frontera en letras: con $\sigma$ conocido, $x_c=\mu_0+z_{1-\alpha}\,\sigma/\sqrt n$; con $\sigma$ desconocido y $n$ pequeño, $t_c=\pm t_{n-1;\,1-\alpha}$ en la escala de $T$. La cátedra marca como error escribir $x_c$ con $s$.
- **Acotar el valor p con la tabla** cuando el estadístico observado no coincide con un fractil tabulado.

En todos los casos se pide **concluir en palabras del problema**, no solo «se rechaza» o «no se rechaza».

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| Nivel de significación | $P_{H_0}(\Lambda\in R)\le\alpha$ | Construir la región de rechazo |
| Potencia | $1-\beta$ | Probabilidad de rechazar $H_0$ falsa |
| Estadístico $Z$ (media) | $Z=\dfrac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1)$ | $\sigma$ conocida, o $n$ grande (con $S$) |
| Estadístico $T$ (media) | $T=\dfrac{\bar X-\mu_0}{S/\sqrt n}\sim t_{n-1}$ | $\sigma$ desconocida, muestra normal, $n$ pequeño |
| Estadístico $Z$ (proporción) | $Z=\dfrac{\hat q-q_0}{\sqrt{q_0(1-q_0)/n}}$ | Conteo de éxitos, $n>100$ |
| Rechazo, dos colas | $\lvert Z\rvert>z_{1-\alpha/2}$ (o $t_{n-1,1-\alpha/2}$) | $H_1:\theta\ne\theta_0$ |
| Rechazo, cola derecha | $Z>z_{1-\alpha}$ (o $t_{n-1,1-\alpha}$) | $H_1:\theta>\theta_0$ |
| Rechazo, cola izquierda | $Z<-z_{1-\alpha}$ (o $-t_{n-1,1-\alpha}$) | $H_1:\theta<\theta_0$ |
| Valor crítico de la media | $\bar x_c=\mu_0+z_{1-\alpha}\,\sigma/\sqrt n$ (derecha), $\mu_0-z_{1-\alpha}\,\sigma/\sqrt n$ (izquierda), $\mu_0\pm z_{1-\alpha/2}\,\sigma/\sqrt n$ (dos colas) | Regla en unidades del problema |
| Valor crítico de la proporción | $\hat q_c=q_0+z_{1-\alpha}\sqrt{q_0(1-q_0)/n}$ | Cola derecha; $c$ = primer entero mayor que $n\hat q_c$; rechazar si $X\ge c$ |
| Valor p, cola derecha | $1-\Phi(z_{\text{obs}})$ o $1-\Xi_{n-1}(t_{\text{obs}})$ | $H_1:\theta>\theta_0$ |
| Valor p, cola izquierda | $\Phi(z_{\text{obs}})$ o $\Xi_{n-1}(t_{\text{obs}})$ | $H_1:\theta<\theta_0$ |
| Valor p, dos colas | $2(1-\Phi(\lvert z_{\text{obs}}\rvert))$ o $2(1-\Xi_{n-1}(\lvert t_{\text{obs}}\rvert))$ | $H_1:\theta\ne\theta_0$ |
| Decisión | rechazar $H_0\iff$ valor p $<\alpha$ | Cualquier prueba |
| $\beta$ media, cola derecha | $\Phi\!\left(z_{1-\alpha}+\frac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$ | Error tipo II en $\mu_1>\mu_0$ |
| $\beta$ media, cola izquierda | $1-\Phi\!\left(-z_{1-\alpha}+\frac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$ | Error tipo II en $\mu_1<\mu_0$ |
| $\beta$ media, dos colas | $\Phi\!\left(z_{1-\alpha/2}+\frac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)-\Phi\!\left(-z_{1-\alpha/2}+\frac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$ | Error tipo II en $\mu_1\ne\mu_0$ |
| $\beta$ proporción, cola derecha | $\Phi\!\left(z_{1-\alpha}\sqrt{\frac{q_0(1-q_0)}{q_1(1-q_1)}}+\frac{q_0-q_1}{\sqrt{q_1(1-q_1)/n}}\right)$ | Error tipo II en $q_1>q_0$ |
| Puntos guía de la curva OC | $\beta(\theta_0)=1-\alpha$, $\beta(\text{crítico})\approx 0.5$, $\beta\to 0$ | Bosquejar la curva OC |
| Tamaño muestral (media) | $n=\left(\frac{(z_{1-\alpha}+z_{1-\beta^*})\sigma}{\mu_1-\mu_0}\right)^2$, hacia arriba | Fijar $\alpha$ y $\beta^*$, prueba de una cola |

Fractiles de uso frecuente: $z_{0.90}=1.2816$, $z_{0.95}=1.6449$, $z_{0.975}=1.96$, $z_{0.99}=2.3263$. Hoja completa en el [[formulario-pruebas-de-hipotesis|Formulario — Pruebas de hipótesis]]; para leer los fractiles, ver [[estandarizacion-y-tabla-normal|estandarización y tabla normal]].
