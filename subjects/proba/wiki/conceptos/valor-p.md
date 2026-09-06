---
titulo: Valor p
resumen: 'Probabilidad, calculada bajo la hipótesis nula, de obtener un estadístico tan contrario a ella como el observado. Se rechaza cuando el valor p es menor que $\alpha$; equivale al nivel de significación más chico al que todavía se rechazaría la nula.'
tipo: concepto
unidad: 9
orden: 4
tags: [prueba-de-hipotesis, valor-p, inferencia]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[intro-prueba-de-hipotesis-slides]]", "[[apunte-prueba-proporcion]]", "[[apunte-media-desvio-desconocido]]", "[[video-th-desvio-conocido]]", "[[video-th-desvio-desconocido]]"]
actualizado: 2026-09-04
---

# Valor p

**En breve.** El valor p mide cuán sorprendente es lo observado *si $H_0$ fuera
cierta*: es la probabilidad de un resultado "tan malo o peor" que el de la
muestra. Cuanto más chico, más evidencia contra $H_0$; se rechaza cuando cae por
debajo de $\alpha$.

**Qué es:** El **valor p** (p-value) de una [[prueba-de-hipotesis|prueba de hipótesis]] es la probabilidad de que, **si $H_0$ es verdadera**, el
[[estadistico-de-prueba|estadístico de prueba]] tome un valor **"tan malo o peor"
(tan contrario a $H_0$)** que el observado, según
[[intro-prueba-de-hipotesis-slides|las slides]] y [[tp9-pruebas-de-hipotesis|TP9]].

Es una medida de cuán sospechoso resulta el resultado observado bajo $H_0$: un
valor p chico significa que datos así de extremos serían muy improbables si $H_0$
fuera cierta.

## Regla de decisión con el valor p

$$ \boxed{\ \text{Se rechaza } H_0 \iff \text{valor p} < \alpha\ } $$

Equivalente a la regla de la región crítica, pero más informativa: el valor p es
el **nivel de significación más chico** al cual todavía se rechazaría $H_0$. Como
dice el apunte de [[apunte-media-desvio-desconocido|desvío desconocido]]:
"se rechaza para todo $\alpha > \text{valor p}$".

> [!figura] u9-valor-p-contra-en-la-misma-cola
> El área desde el valor crítico ($\alpha$) y el área desde el estadístico observado (valor p), sombreadas en la misma cola. Mueva el observado: el valor p queda por debajo de $\alpha$ exactamente cuando el estadístico entra en la región de rechazo, así que las dos reglas de decisión son la misma.

> **Intuición (qué NO es).** El valor p **no** es la probabilidad de que $H_0$
> sea verdadera: $H_0$ no es aleatoria, el parámetro tiene un valor fijo aunque
> desconocido. Es una probabilidad sobre los **datos** condicionada a $H_0$, no
> al revés. Por eso un valor p chico dice "datos así de extremos serían raros si
> $H_0$ valiera", lo que nos hace dudar de $H_0$ — pero rechazar puede ser un
> [[error-tipo-i-y-tipo-ii|error tipo I]] (justo cayó en una cola por azar).

## Por qué se define con desigualdad y no con igualdad

El valor p se define sobre la **cola completa** ($\le$ o $\ge$ el estadístico
observado) y no sobre el suceso puntual ($=$): en una distribución continua ese
suceso puntual tiene probabilidad $0$ y no serviría para graduar cuán razonable
es un valor observado. Según [[video-th-desvio-conocido]] (47:49–50:07 y
74:23–76:00), el valor p es además la herramienta más transversal de la
estadística: cualquier prueba de hipótesis, de cualquier tipo, se rechaza si el
valor p es chico — la regla $\text{valor p}<\alpha$ no cambia entre pruebas.

## Cómo se calcula (según el tipo de cola)

Sea $\lambda_{\text{obs}}$ el valor observado del estadístico y $E_{\mu_0}[\Lambda]$
su valor esperado bajo $H_0$. Según [[tp9-pruebas-de-hipotesis|TP9]]:

- **Cola derecha:** $\text{valor p}=P_{\mu_0}(\Lambda > \lambda_{\text{obs}})$.
- **Cola izquierda:** $\text{valor p}=P_{\mu_0}(\Lambda < \lambda_{\text{obs}})$.
- **Dos colas:** $\text{valor p}=P_{\mu_0}\!\left(|\Lambda - E_{\mu_0}[\Lambda]| > |\lambda_{\text{obs}} - E_{\mu_0}[\Lambda]|\right)$.

Con el estadístico estandarizado $Z\sim N(0,1)$:

- Cola derecha: $\text{valor p}=1-\Phi(z_{\text{obs}})$.
- Cola izquierda: $\text{valor p}=\Phi(z_{\text{obs}})$.
- Dos colas: $\text{valor p}=2\,(1-\Phi(|z_{\text{obs}}|))$.

Con el estadístico $T\sim t_{n-1}$ se reemplaza $\Phi$ por $\Xi_{n-1}$ (la FDA de
la [[distribucion-t-de-student|t de Student]] con $n-1$ grados de libertad).

### Cómo acotar el valor p cuando no está tabulado exactamente

Si el estadístico observado $t_{\text{obs}}$ (o $z_{\text{obs}}$) no coincide con
un cuantil exacto de la tabla, se lo puede **ubicar entre dos cuantiles
conocidos** para acotar el valor p sin necesitar calculadora ni software (según
[[video-th-desvio-desconocido|el video de TH con desvío desconocido]]). Por
ejemplo, con $t_9$ y $t_{\text{obs}}=-1.5811$: como
$-t_{9,0.95}=-1.8331 \le t_{\text{obs}} \le -1.3830=-t_{9,0.9}$, y estos
cuantiles dejan $5\%$ y $10\%$ de área a izquierda respectivamente, se concluye
$0.05 \le \text{valor p} \le 0.1$ sin calcular el valor exacto. Alcanza para
decidir si se rechaza o no cuando $\alpha$ cae fuera del intervalo acotado.

## Conceptos relacionados

- [[prueba-de-hipotesis]], [[error-tipo-i-y-tipo-ii]], [[estadistico-de-prueba]]
- [[prueba-de-hipotesis-para-la-media]], [[prueba-de-hipotesis-para-la-proporcion]]
- [[funcion-de-distribucion-acumulada]] ($\Phi$, $\Xi_{n-1}$ son las FDA que se evalúan)
- [[distribucion-normal]], [[distribucion-t-de-student]], [[estandarizacion-y-tabla-normal]]

## Ejercicio resuelto

**Enunciado** (ejercicio 10 del [[tp9-pruebas-de-hipotesis|TP9]], resuelto en el
[[apunte-media-desvio-desconocido|apunte de teórica]]): Un fabricante de lámparas
desarrolló un proceso que espera aumente la eficiencia media (lúmenes/watt) por
encima de $9.5$. Sobre $n=10$ lámparas (variable normal, $\sigma$ desconocido) se
obtuvo $\bar x_{\text{obs}}=10.985$ y $S=1.1489$. Usar $\alpha=5\%$ y calcular el
valor p.

**Planteo.** Cola derecha: $H_0:\mu\le 9.5$ vs $H_1:\mu>9.5$. Como $\sigma$ es
desconocido y $n$ chico, estadístico $T=\dfrac{\bar X - \mu_0}{S/\sqrt n}\sim t_9$.

**Cálculo.**
$$ t_{\text{obs}}=\frac{10.985-9.5}{1.1489/\sqrt{10}}=\frac{1.485}{0.3633}\approx 4.087. $$
Valor crítico: $t_{9,\,0.95}=1.8331$. Como $t_{\text{obs}}=4.087 > 1.8331$, cae en
la región de rechazo. El valor p es
$$ \text{valor p}=P_{\mu_0}(T \ge t_{\text{obs}})=1-\Xi_{9}(4.087)\approx 0.0014. $$

**Resultado.** Como valor p $\approx 0.0014 < 0.05 = \alpha$, se **rechaza $H_0$**:
hay evidencia de que la eficiencia media aumentó. De hecho se rechazaría para
cualquier $\alpha > 0.0014$.
