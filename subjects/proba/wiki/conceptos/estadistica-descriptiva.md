---
titulo: Estadística Descriptiva
resumen: "Hub de la Unidad 1: resumir y describir una muestra con medidas de centro, dispersión y forma más histograma y boxplot, sin inferir todavía sobre la población. Contiene el mapa de todas las páginas de la unidad y la idea de robustez."
tipo: concepto
unidad: 1
orden: 1
hub: true
tags: [hub, estadistica-descriptiva]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[estadistica-descriptiva-introduccion]]", "[[video-histogramas]]"]
actualizado: 2026-09-03
---

# Estadística Descriptiva

**En breve.** Página **hub** de la Unidad 1: la estadística descriptiva resume y
describe una [[poblacion-y-muestra|muestra]] con medidas de centro, dispersión y
forma más unos pocos gráficos, **sin** todavía inferir sobre la población (ese salto
es [[inferencia-estadistica|inferencia]]). Aquí abajo está el mapa de todas las
páginas de la unidad.

Página **hub** de la Unidad 1. La estadística descriptiva busca **resumir y
describir** un conjunto de datos observados $\{x_i\}_{i=1}^n$ (una *muestra*),
sin todavía hacer inferencia sobre la población. La idea: en vez de mirar los
datos uno por uno, se calculan **medidas de resumen** que dan una idea general.

> **Fuentes de la unidad.** El recorrido motivador está en las slides
> [[estadistica-descriptiva-introduccion]] (ejemplo de las 200 monedas); la
> presentación formal con fórmulas, en la teórica [[estadistica-descriptiva-general]];
> los ejercicios resueltos, en [[tp1-estadistica-descriptiva]]; y la construcción
> paso a paso del histograma (discreto → continuo), en la clase grabada
> [[video-histogramas]].

## Paso 0: vistazo exploratorio
Antes de calcular medidas, conviene **mirar los datos** con dos gráficos iniciales
(scatterplot muestra-vs-caso y dispersión sobre una recta) para detectar
tendencias o valores atípicos. Ver [[histograma-y-frecuencias]].

## Mapa de la unidad

- **[[poblacion-y-muestra]]** — qué se observa y de dónde sale (muestra
  cualitativa vs cuantitativa).
- **Medidas de resumen** (datos sin agrupar):
  - [[medidas-de-tendencia-central]] — media, mediana, moda. *"¿Por dónde andan
    los valores?"*
  - [[medidas-de-dispersion]] — rango, IQR, varianza, desvío, $w$, MAD. *"¿Qué
    tan dispersos están?"*
  - [[asimetria-y-curtosis]] — forma de la distribución.
  - [[cuartiles-y-percentiles]] — cómo se parte la muestra en cuartos.
- **Gráficos**:
  - [[histograma-y-frecuencias]] — frecuencias absoluta/relativa/acumulada.
  - [[boxplot]] — caja, bigotes y outliers.
- **[[datos-agrupados]]** — cómo aproximar todas las medidas cuando solo se tiene
  una tabla de frecuencias (se perdió la información individual).

## Idea transversal: robustez
La **mediana** y el **MAD** son *robustos* ante [[boxplot|outliers]]; la **media**
y el **desvío** no. Ver el ejemplo del ingreso $\{1,1,2,100\}$ en
[[medidas-de-tendencia-central]].

## Relación con el resto de la materia
La distinción muestra/población y las medidas de resumen reaparecen en
[[inferencia-estadistica]] (estimación) — las versiones poblacionales son la
esperanza $E[X]$ y la varianza $V(X)$ de una [[variable-aleatoria]].
