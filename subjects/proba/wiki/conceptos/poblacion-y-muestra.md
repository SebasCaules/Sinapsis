---
titulo: Población y muestra
resumen: "La población es el universo completo que se quiere estudiar y la muestra el subconjunto que efectivamente se observa, elegido al azar para que sea representativo; sobre la muestra se calculan las medidas de resumen."
tipo: concepto
unidad: 1
orden: 2
tags: [estadistica-descriptiva, fundamentos]
fuentes: ["[[tp1-estadistica-descriptiva]]"]
actualizado: 2026-06-06
---

# Población y muestra

**En breve.** La **población** es el universo completo que se quiere estudiar y la
**muestra** es el subconjunto que efectivamente se observa; toda la
[[estadistica-descriptiva|estadística descriptiva]] trabaja sobre la muestra para
luego, vía [[inferencia-estadistica|inferencia]], sacar conclusiones sobre la población.

- **Población**: conjunto de todos los elementos/individuos cuyas características
  se quieren estudiar. A veces es imposible (población infinita), costoso o
  ridículo (si estudiar destruye los elementos) analizarla entera.
- **Muestra**: subconjunto de la población que sí se estudia. Idealmente
  **representativa**; una forma de lograrlo es elegir los elementos **al azar**.

> **Intuición.** Quiere saber el peso promedio de *todos* los recién nacidos del país
> (población) pero no puede pesarlos a todos: pesa 100 al azar (muestra) y usa ese
> grupo como "ventana" hacia el total. Si la muestra está bien elegida, lo que se ve en
> ella se parece a lo que pasa en la población; si está sesgada (p. ej. solo de una
> clínica privada), las conclusiones se distorsionan.

Sea $\{x_i\}_{i=1}^n$ el conjunto de características relevadas, con $n$ = cantidad
de individuos muestreados.

## Tipos de muestra
- **Cualitativa**: características no numéricas (p. ej. la profesión).
- **Cuantitativa**: características numéricas.

En la materia nos concentramos en **muestras cuantitativas**. Sobre ellas se
calculan las [[estadistica-descriptiva|medidas de resumen]].

## Conexión con probabilidad
La muestra es la contraparte observada de una [[variable-aleatoria]]: las medidas
de resumen muestrales (media, varianza) **estiman** parámetros poblacionales
($E[X]$, $V(X)$). Ese salto es el objeto de la [[inferencia-estadistica]].
