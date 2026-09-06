---
titulo: Estadístico de prueba y región de rechazo
resumen: 'Función de la muestra con distribución conocida bajo $H_0$ ($Z$ si el desvío es conocido, $T$ si no) y conjunto de valores que llevan a rechazar. La región de rechazo va en las colas que indica $H_1$ y acumula probabilidad $\alpha$.'
tipo: concepto
unidad: 9
orden: 2
tags: [prueba-de-hipotesis, estadistico, region-de-rechazo]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[apunte-media-estadistico-z]]"]
actualizado: 2026-09-04
---

# Estadístico de prueba y región de rechazo

**En breve.** El estadístico de prueba comprime toda la muestra en un solo
número con distribución conocida bajo $H_0$; la región de rechazo es el rango de
ese número que nos hace abandonar $H_0$. Juntos son la maquinaria que convierte
los datos en una decisión.

**Qué es:** El **estadístico de prueba** $\Lambda$ es una **función de la
muestra** (un solo número) que resume los datos para decidir entre $H_0$ y $H_1$
en una [[prueba-de-hipotesis|prueba de hipótesis]]. La **región de rechazo** (o
región crítica) $R$ es el conjunto de valores de $\Lambda$ para los que se
rechaza $H_0$: se rechaza $H_0 \iff \Lambda \in R$, según
[[tp9-pruebas-de-hipotesis|TP9]].

## Estadísticos usados en la unidad

| Parámetro | Estadístico | Distribución bajo $H_0$ | Condición |
|---|---|---|---|
| Media $\mu$ | $Z=\dfrac{\bar X - \mu_0}{\sigma/\sqrt n}$ | $N(0,1)$ | $\sigma$ conocido, o $n$ grande |
| Media $\mu$ | $T=\dfrac{\bar X - \mu_0}{S/\sqrt n}$ | $t_{n-1}$ | $\sigma$ desconocido, muestra normal |
| Proporción $q$ | $Z=\dfrac{\hat q - q_0}{\sqrt{q_0(1-q_0)/n}}$ | $N(0,1)$ | $n$ grande ($>100$) |

> **Equivalencia de estadísticos ([[apunte-media-estadistico-z|apunte Z]]):**
> Trabajar con el estimador puntual ($\bar X$, $\hat q$) o con su versión
> estandarizada ($Z$, $T$) es equivalente, porque la transformación es lineal y
> monótona. Por ejemplo, $\bar X > \bar x_c \iff Z > z_c$. La cátedra presenta
> las reglas usando la versión estandarizada porque alcanza con una sola tabla.

> [!figura] u9-dos-ejes-una-misma-decision
> El eje del estimador $\bar x$ y el eje del estadístico $Z$, alineados: la transformación lineal manda $\mu_0$ a $0$ y $\bar x_c$ a $z_{1-\alpha}$, y la zona de rechazo es la misma en los dos. Por eso una sola tabla de fractiles alcanza para cualquier $\mu_0$, $\sigma$ y $n$.

## Región de rechazo según el tipo de cola

Con el estadístico estandarizado $Z\sim N(0,1)$ y nivel $\alpha$:

| Tipo | $H_1$ | Se rechaza si |
|---|---|---|
| Dos colas | $\theta\ne\theta_0$ | $Z < -z_{1-\alpha/2}$ ó $Z > z_{1-\alpha/2}$ |
| Cola derecha | $\theta>\theta_0$ | $Z > z_{1-\alpha}$ |
| Cola izquierda | $\theta<\theta_0$ | $Z < -z_{1-\alpha}$ |

(Con $T$ se reemplaza $z$ por el fractil $t_{n-1}$ correspondiente.)

> [!figura] u9-las-tres-rectas-de-rechazo
> Las tres regiones de rechazo sobre la recta del estadístico estandarizado, con sus fractiles rotulados. Observe que al pasar de $Z$ a $T$ solo cambia el nombre del fractil: la geometría de la recta es idéntica.

> **Intuición.** La región de rechazo vive en las **colas** porque ahí caen los
> valores **improbables bajo $H_0$**: si $H_0$ fuera cierta, $\Lambda$ rondaría su
> valor esperado y casi nunca llegaría tan lejos. La masa $\alpha$ que dejamos en
> la cola es justamente la probabilidad de [[error-tipo-i-y-tipo-ii|error tipo I]]
> que aceptamos correr. En qué cola(s) ponerla depende de hacia dónde apunta
> $H_1$ (ver [[reconocer-prueba-de-hipotesis|cómo elegir la cola]]).

El **valor crítico** del estimador se obtiene "des-estandarizando". Para la
media, cola derecha: $\bar x_c = \mu_0 + z_{1-\alpha}\,\dfrac{\sigma}{\sqrt n}$.

## Conceptos relacionados

- [[prueba-de-hipotesis]], [[valor-p]], [[error-tipo-i-y-tipo-ii]]
- [[esperanza]] (un estadístico es una v.a.; tiene su propia distribución muestral)
- [[promedio-muestral]], [[varianza-muestral]] (los estimadores $\bar X$ y $S^2$ que se estandarizan)
- [[estandarizacion-y-tabla-normal]] (cómo pasar de $\bar X$ a $Z$ y leer fractiles)
- [[distribucion-normal]], [[distribucion-t-de-student]] (las distribuciones de $\Lambda$ bajo $H_0$)
- [[teorema-central-del-limite]] (justifica usar la normal cuando $n$ es grande)

## Ejercicio resuelto

**Enunciado** (ejercicio 11 del [[tp9-pruebas-de-hipotesis|TP9]]): En una planta,
una operación toma en promedio 5 min. El gerente sospecha que para cierta máquina
el tiempo es mayor. Toma $n=15$ tiempos (variable normal) y obtiene
$\bar x\approx 5.127$, $S\approx 1.234$. Probar la sospecha con $\alpha=5\%$.

**Planteo.** El gerente sospecha que el tiempo medio **supera** los 5 min, así
que es cola derecha: $H_0:\mu\le 5$ vs $H_1:\mu>5$. Como $\sigma$ es desconocido y
$n=15$ es chico, estadístico $T=\dfrac{\bar X - 5}{S/\sqrt{15}}\sim t_{14}$.

**Región de rechazo.** Se rechaza $H_0$ si $T > t_{14,\,0.95}=1.7613$.

**Cálculo.** $t_{\text{obs}}=\dfrac{5.127-5}{1.234/\sqrt{15}}\approx 0.399$ (coincide con el TP9).

**Resultado.** Como $t_{\text{obs}}=0.399 < 1.7613$, **no** cae en la región de
rechazo: **no se rechaza $H_0$**. La evidencia muestral **no apoya** que el tiempo
promedio supere los 5 minutos.
