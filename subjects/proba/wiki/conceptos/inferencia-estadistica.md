---
titulo: Inferencia Estadística
resumen: "Marco general de la unidad 8: a partir de una muestra al azar se estima un parámetro poblacional desconocido, con un único valor (estimación puntual) o con un rango (intervalo de confianza). Distingue estadístico, estimador y estimación."
tipo: concepto
unidad: 8
orden: 1
hub: true
tags: [inferencia, estimacion, fundamentos]
fuentes: ["[[teorica-estimacion-puntual-intro]]", "[[tp8-estimacion-de-parametros]]"]
actualizado: 2026-06-06
---

# Inferencia Estadística

**En breve.** Marco general de la unidad 8: a partir de una muestra al azar se
estima un parámetro poblacional desconocido, ya sea con un único valor
([[estimacion-puntual]]) o con un rango ([[intervalos-de-confianza]]). Es el
puente entre la [[estadistica-descriptiva|descriptiva]] y la probabilidad.

**La idea central:** usar una **muestra** observada para sacar conclusiones
sobre un **parámetro poblacional desconocido** (la media $\mu$, la varianza
$\sigma^2$, una proporción $p$, …). Es el puente que cierra el lazo entre la
[[estadistica-descriptiva]] (resumir lo que se ve) y la probabilidad (modelar el
mecanismo que lo generó).

Según [[teorica-estimacion-puntual-intro]], el esquema es:

$$\text{Población} \;\longrightarrow\; \text{muestra } \{X_i\}_{i=1}^n \;\longrightarrow\; \text{estadístico / estimador} \;\longrightarrow\; \theta$$

## Cerrando el lazo con descriptiva

La media muestral y la varianza muestral, que en
[[medidas-de-tendencia-central]] y [[medidas-de-dispersion]] eran sólo números
que resumían los datos, ahora cobran un rol más profundo: son **estimadores** de
parámetros poblacionales.

| Cantidad muestral | Estima a | Parámetro poblacional |
|---|---|---|
| Media muestral $\overline X_n=\frac1n\sum X_i$ | $\to$ | $E[X]=\mu$ |
| [[varianza-muestral\|Varianza muestral]] $S_n^2=\frac{1}{n-1}\sum(X_i-\overline X_n)^2$ | $\to$ | $V(X)=\sigma^2$ |
| Proporción muestral $\hat p=\frac1n\sum X_i$ | $\to$ | $p$ |

La diferencia clave: en [[poblacion-y-muestra]] la muestra eran datos fijos
$\{x_i\}$; en inferencia pensamos a $\{X_i\}$ como **variables aleatorias**
([[variable-aleatoria|v.a.]]) i.i.d. (cada $X_i$ tiene la distribución
poblacional), de modo que cualquier función de la muestra es también una v.a. con
su propia distribución.

> **Intuición.** El parámetro $\theta$ es el "número verdadero" que la naturaleza
> fijó pero nadie ve; la muestra es una ventana ruidosa a ese número. Como la
> ventana cambia con cada muestra, el estimador hereda esa aleatoriedad: por eso
> tiene sentido hablar de su [[esperanza]] y su [[varianza]]. Toda la unidad es
> controlar cuánto se puede confiar en lo que se ve por la ventana.

## Conceptos básicos

- **Parámetro poblacional ($\theta$, $\mu$, $\sigma$, $p$):** característica
  **fija pero desconocida** de la población. **No** es una variable aleatoria
  (salvo en el enfoque bayesiano del [[estimacion-puntual#Máximo a posteriori (MAP)|MAP]]).
- **Estadístico:** cualquier función $g(X_1,\dots,X_n)$ de la muestra. Es una v.a.
- **Estimador:** un estadístico $\hat\theta = h(X_1,\dots,X_n)$ con el que se
  busca aproximar un parámetro. Es una v.a.
- **Estimación:** el **valor concreto** $\hat\theta(x_1,\dots,x_n)$ que toma el
  estimador una vez observada la muestra. Es un número.

> Distinción **pre-muestra / post-muestra** (énfasis del [[tp8-estimacion-de-parametros]]):
> antes de observar la muestra, $\overline X_n$ es una v.a. (mayúsculas); después,
> $\overline x_n$ es un número (minúsculas). Confundirlas lleva a errores graves al
> interpretar un intervalo de confianza.

## Las dos grandes ramas de la unidad

1. **[[estimacion-puntual]]** — devolver **un solo valor** como aproximación del
   parámetro. Incluye cómo medir la calidad de un estimador (sesgo, varianza,
   ECM) y los métodos para construirlos (máxima verosimilitud, máximo a
   posteriori, método de los momentos).
2. **[[intervalos-de-confianza]]** — devolver un **rango** de valores que
   contiene al parámetro con un nivel de confianza $\gamma$ dado.

Una tercera rama, las **pruebas de hipótesis**, está en la unidad siguiente; su hub
conceptual es **[[prueba-de-hipotesis]]** ([[tp9-pruebas-de-hipotesis|TP9]]). Hay una
**dualidad** estrecha entre [[intervalos-de-confianza|IC]] y pruebas: un IC bilateral
de nivel $\gamma$ contiene a $\theta_0$ exactamente cuando la prueba bilateral de
$H_0:\theta=\theta_0$ a nivel $\alpha=1-\gamma$ **no** rechaza. Las fórmulas de las
pruebas están en [[formulario-pruebas-de-hipotesis]].

## Herramientas que se apoyan en esta unidad

- El [[teorema-central-del-limite]] justifica aproximar la distribución de
  $\overline X_n$ y $\hat p$ por una normal cuando $n$ es grande.
- La [[ley-de-grandes-numeros]] garantiza la consistencia de los estimadores.
- La [[distribucion-t-de-student]] aparece cuando se estima la media de una
  normal con la varianza desconocida y $n$ chico.
- La [[distribucion-ji-cuadrado]] es la distribución de $(n-1)S_n^2/\sigma^2$ y
  sustenta la insesgadez de la [[varianza-muestral]] y los IC de la varianza.

> **Todas las fórmulas juntas:** Ver el [[formulario-inferencia]] (estimación
> puntual, ECM, IC de media y proporción, tamaño muestral, árbol de decisión).

## Ejercicio resuelto

**Enunciado** ([[tp8-estimacion-de-parametros]], repaso): se usa $n=2$ y se
observan $x_1=2$, $x_2=4$. Dar la estimación de $\mu=E[X_1]$ con el estimador
promedio.

**Planteo.** El estimador puntual de la media es $\hat\mu(X_1,X_2)=\frac12(X_1+X_2)$,
que es una variable aleatoria. La **estimación** es su valor evaluado en los
datos observados.

**Cálculo.**
$$\hat\mu(2,4) = \frac12(2+4) = 3.$$

**Resultado.** La estimación de $\mu$ es $\boxed{3}$. Nótese la distinción: el
**estimador** $\hat\mu$ es una v.a.; la **estimación** $\hat\mu(2,4)=3$ es un número.
