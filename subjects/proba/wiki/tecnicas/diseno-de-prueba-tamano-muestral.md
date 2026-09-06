---
titulo: Diseño de la prueba y tamaño muestral (fijar α y β)
resumen: 'Problema inverso de la prueba de hipótesis: en vez de calcular los errores se fijan $\alpha$ y $\beta$ y se despejan el tamaño de muestra y el valor crítico. Para la media con desvío conocido, $n=\left(\frac{(z_{1-\alpha}+z_{1-\beta})\sigma}{\mu_1-\mu_0}\right)^2$.'
tipo: tecnica
unidad: 9
orden: 8
tags: [prueba-de-hipotesis, tecnica, tamano-muestral, curva-oc, diseno]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[intro-prueba-de-hipotesis-slides]]", "[[apunte-media-nula-mayor-igual]]"]
actualizado: 2026-09-04
---

# Diseño de la prueba y tamaño muestral (fijar α y β)

**En breve.** Es el problema "inverso": en vez de calcular $\alpha$ y $\beta$ a
partir de $n$ y la regla, se **fijan** $\alpha$ y un $\beta$ objetivo (para cierto
$\theta_1$) y se **despeja** el $n$ mínimo y el valor crítico que los garantizan.
Dos condiciones (errores I y II), dos incógnitas ($n$ y $c$).

Patrón estilo parcial para la familia de problemas de **diseño** de una
[[prueba-de-hipotesis|prueba de hipótesis]]: en vez de tener fijos $n$ y la
regla de decisión y calcular $\alpha$ y $\beta$, se **imponen a la vez** un
$\alpha$ y un $\beta$ deseados y se **despejan** el tamaño de muestra $n$ y el
valor crítico $c$ (o $\bar x_c$). Es el eje de los ejercicios **4, 5, 6, 7 y 16**
del [[tp9-pruebas-de-hipotesis|TP9]].

> En [[error-tipo-i-y-tipo-ii]] se dice que "para bajar $\alpha$ y $\beta$ a la
> vez hay que aumentar $n$". Esta técnica es **la fórmula** detrás de esa frase:
> cuántas observaciones hacen falta y dónde poner la frontera.

## La idea: dos ecuaciones, dos incógnitas

Una prueba unilateral (digamos **cola derecha**, $H_0:\theta\le\theta_0$ vs
$H_1:\theta>\theta_0$) queda determinada por dos números: el tamaño de muestra
$n$ y el valor crítico $\bar x_c$ del estimador. Se imponen dos condiciones:

1. **Controlar el error tipo I en el borde de $H_0$:** $\alpha = P_{\theta_0}(\text{rechazar})$.
2. **Controlar el error tipo II en un valor alternativo de interés** $\theta_1$
   bajo $H_1$: $\beta(\theta_1) = P_{\theta_1}(\text{no rechazar}) \le \beta^*$.

Cada condición es una ecuación; juntas determinan $n$ y $\bar x_c$.

### Caso media, $\sigma$ conocida (estadístico $Z$)

Para la media con $\sigma$ conocida y prueba de **cola derecha**, el estimador
$\bar X \sim N(\mu,\,\sigma/\sqrt n)$. Las dos condiciones son:

$$ \bar x_c = \mu_0 + z_{1-\alpha}\,\frac{\sigma}{\sqrt n}, \qquad \beta(\mu_1) = \Phi\!\left(z_{1-\alpha} + \frac{\mu_0-\mu_1}{\sigma/\sqrt n}\right) = \beta^*. $$

De la segunda, usando $\Phi^{-1}(\beta^*) = -z_{1-\beta^*}$ (con $\mu_1>\mu_0$):

$$ z_{1-\alpha} - \frac{\mu_1-\mu_0}{\sigma/\sqrt n} = -z_{1-\beta^*} \;\Longrightarrow\; \boxed{\,n = \left(\frac{(z_{1-\alpha}+z_{1-\beta^*})\,\sigma}{\mu_1-\mu_0}\right)^2\,}. $$

Se redondea **hacia arriba** (el $n$ entero más chico que cumple). Una vez fijado
$n$ se obtiene la frontera $\bar x_c = \mu_0 + z_{1-\alpha}\,\sigma/\sqrt n$. Para
cola izquierda los signos se invierten ($\bar x_c=\mu_0 - z_{1-\alpha}\sigma/\sqrt n$,
$\mu_1<\mu_0$) y la fórmula de $n$ es la misma con $|\mu_1-\mu_0|$.

> **Intuición (leer la fórmula de $n$).** Cada ingrediente tiene un sentido
> claro: exigir menos error (bajar $\alpha$ o $\beta$ sube los fractiles $z$) pide
> **más** muestra; más ruido ($\sigma$ grande) pide **más** muestra; y un efecto
> más fácil de detectar (la brecha $|\mu_1-\mu_0|$ grande, en el denominador al
> cuadrado) pide **menos**. Que entre al cuadrado significa que **partir la brecha
> a la mitad cuadruplica el $n$**: detectar diferencias chicas es caro.

> [!figura] u9-el-precio-de-detectar-diferencias-chicas
> El $n$ necesario contra la brecha estandarizada $|\mu_1-\mu_0|/\sigma$, con una curva por cada $\beta^*$ de referencia. Mueva el punto marcado y compare la lectura con la del punto de brecha mitad: el cociente entre los dos $n$ se mantiene en $\approx 4$.

### Caso proporción (estadístico $Z$)

Misma lógica, pero la varianza cambia de $q_0$ a $q_1$, así que ambos fractiles
llevan su propio desvío. Para **cola derecha** ($H_0:q\le q_0$):

$$ \beta(q_1)=\Phi\!\left(z_{1-\alpha}\sqrt{\frac{q_0(1-q_0)}{q_1(1-q_1)}}+\frac{q_0-q_1}{\sqrt{q_1(1-q_1)/n}}\right)\le\beta^*. $$

Igualando el argumento a $-z_{1-\beta^*}$ se despeja $\sqrt n$ y luego $n$
(ver el ejercicio resuelto). El valor crítico en número de defectuosos es
$c = n\,\hat q_c$ con $\hat q_c = q_0 + z_{1-\alpha}\sqrt{q_0(1-q_0)/n}$.

## La curva característica de operación (curva OC)

$\beta$ no es un solo número: es la **función** $\beta(\theta_1)$ del valor real
del parámetro bajo $H_1$. Su gráfica es la **curva característica de operación
(curva OC)**; la de $1-\beta(\theta_1)$ es la **curva de potencia**
([[error-tipo-i-y-tipo-ii|ver curva OC]]). Puntos guía para chequear el dibujo
(prueba de cola derecha):

- $\beta(\theta_0)=1-\alpha$ (en el borde de $H_0$, casi nunca se rechaza).
- $\beta(\bar x_c)\approx 0.5$ (cuando el verdadero parámetro cae justo en la frontera).
- $\beta(\theta_1)=\beta^*$ en el valor de diseño.
- $\beta\to 0$ a medida que $\theta_1$ se aleja hacia $H_1$ (cada vez se rechaza más).

## Pasos (estilo parcial)

1. Plantear $H_0$/$H_1$ y la cola (ver [[reconocer-prueba-de-hipotesis]]).
2. Traducir los enunciados de riesgo: "rechazar/actuar cuando no había que" → $\alpha$;
   "no rechazar/no actuar cuando sí había que (para tal valor $\theta_1$)" → $\beta(\theta_1)$.
3. Escribir las dos ecuaciones (frontera y $\beta$).
4. Despejar $n$ con la fórmula del cuadrado de los fractiles; **redondear hacia arriba**.
5. Calcular el valor crítico ($\bar x_c$ o $c$) con el $n$ ya elegido.
6. Verificar con la curva OC ($\beta(\theta_0)=1-\alpha$, $\beta(\theta_1)\le\beta^*$).

## Ejercicio resuelto

**Enunciado** (ejercicio 16 del [[tp9-pruebas-de-hipotesis|TP9]], resuelto paso a
paso en el raw): la proporción de defectuosos de un proceso es del $2\%$. Para
controlarlo se inspecciona una vez por hora una muestra de tamaño $n$ y se revisa
el proceso si se encuentran **$c$ o más** defectuosas. Se fija un riesgo del
$10\%$ ($\alpha=0.1$ = probabilidad de detener el proceso cuando no hacía falta) y
una probabilidad $0.2$ de no detener el proceso cuando la proporción real sea del
$6\%$ ($\beta(0.06)\le 0.2$). (a) Plantear la prueba. (b) Determinar $n$ y $c$.
(c) Bosquejar la curva OC.

**(a) Planteo.** Lo que importa es vigilar que la proporción **no aumente**
respecto del $2\%$ aceptable → prueba de **cola derecha**:
$$ H_0: q \le 0.02 \qquad H_1: q > 0.02, \qquad \alpha=0.1. $$
Detener el proceso cuando no había que hacerlo (rechazar $H_0$ siendo verdadera)
es el **error tipo I** → $\alpha=0.1$. No detenerlo cuando $q=0.06$ es **error
tipo II** → se pide $\beta(0.06)\le 0.2$. Estadístico $Z$ de proporción (con $n$
grande, [[prueba-de-hipotesis-para-la-proporcion]]).

**(b) Determinar $n$.** Se impone $\beta(0.06)\le 0.2$ con la fórmula de la
proporción ($q_0=0.02$, $q_1=0.06$, $z_{1-\alpha}=z_{0.9}=1.2816$):
$$ \beta(0.06)=\Phi\!\left(z_{0.9}\sqrt{\frac{0.02(0.98)}{0.06(0.94)}}+\frac{0.02-0.06}{\sqrt{0.06(0.94)/n}}\right)=\Phi\!\left(z_{0.9}\sqrt{\tfrac{49}{141}}-\frac{2\sqrt n}{\sqrt{141}}\right)\le 0.2. $$
Como $\Phi^{-1}(0.2)=z_{0.2}=-0.8416$, se pide que el argumento sea $\le z_{0.2}$:
$$ z_{0.9}\sqrt{\tfrac{49}{141}}-\frac{2\sqrt n}{\sqrt{141}}\le z_{0.2} \;\Longrightarrow\; \frac{2\sqrt n}{\sqrt{141}}\ge z_{0.9}\sqrt{\tfrac{49}{141}}-z_{0.2}. $$
Despejando $\sqrt n$ y luego $n$:
$$ \sqrt n \ge \frac{7}{2}z_{0.9}-\frac{\sqrt{141}}{2}z_{0.2} \;\Longrightarrow\; n \ge \left(\tfrac{7}{2}(1.2816)-\tfrac{\sqrt{141}}{2}(-0.8416)\right)^2 \approx 89.91. $$
Por lo tanto **$n=90$** (se verifica $\beta(0.06)\approx 0.1998\le 0.2$ con $n=90$,
mientras que con $n=89$ daría $0.2023>0.2$).

**Determinar $c$.** Con $n=90$, la frontera en $\hat q$ es
$$ \hat q_c = q_0 + z_{0.9}\sqrt{\frac{q_0(1-q_0)}{n}} = 0.02 + 1.2816\sqrt{\frac{0.02\cdot 0.98}{90}} \approx 0.0389. $$
En número de defectuosos, $X=n\hat q = 90\hat q$, la condición de rechazo
$\hat q>0.0389$ equivale a $X > 1.8+\tfrac{21}{10}\sqrt{\tfrac25}\,z_{0.9}\approx 3.50$.
Como $X$ es entero, se revisa el proceso cuando hay **$c=4$ o más** defectuosas.

**(c) Curva OC.** $\beta(q_1)=\Phi\!\left(z_{0.9}\sqrt{\tfrac{0.02\cdot0.98}{q_1(1-q_1)}}+\tfrac{0.02-q_1}{\sqrt{q_1(1-q_1)/90}}\right)$.
Puntos guía: $\beta(0.02)=0.9$ (= $1-\alpha$), $\beta(0.0389)\approx 0.5$
(la frontera), $\beta(0.06)\approx 0.20$ (valor de diseño), $\beta(0.1)\approx 0.0267$,
$\beta(0.2)\approx 7\times 10^{-5}$, $\beta(1)=0$. La curva arranca en $0.9$ en
$q_1=0.02$ y cae hacia $0$ a medida que crece $q_1$ (más defectuosos → más fácil
detectar el problema).

**Resultado.** $n=90$, $c=4$ (coincide con la respuesta del TP9: "la muestra debe
tener tamaño 91 y el valor de $c$ es 4").

> ⚠️ Discrepancia con el raw: las **Respuestas** del TP9 (sección 6) dicen
> "$n=91$", pero la **Resolución** paso a paso del mismo TP9 (sección 7,
> ec. 12–15) obtiene $n\ge 89.91 \Rightarrow n=90$, verificando que con $n=90$ ya
> se cumple $\beta(0.06)\approx 0.1998<0.2$ y con $n=89$ no. El valor correcto es
> $n=90$; el "91" de las Respuestas parece un redondeo de más. El valor crítico
> $c=4$ es el mismo en ambos.

## Conceptos y técnicas relacionados

- [[error-tipo-i-y-tipo-ii]] — definiciones de $\alpha$, $\beta$, potencia y curva OC.
- [[prueba-de-hipotesis]] — marco general (hub de la unidad).
- [[prueba-de-hipotesis-para-la-media]] — fórmulas del caso $Z$/$T$ para la media.
- [[prueba-de-hipotesis-para-la-proporcion]] — fórmula de $\beta(q_1)$ usada arriba.
- [[reconocer-prueba-de-hipotesis]] — cómo plantear $H_0$/$H_1$ y elegir la cola.
- [[estandarizacion-y-tabla-normal]] — leer los fractiles $z_{1-\alpha}$, $z_{1-\beta^*}$ de la tabla.
- [[formulario-pruebas-de-hipotesis]], [[formulario-inferencia]] — fórmulas de $n$, valor crítico y $\beta$.
