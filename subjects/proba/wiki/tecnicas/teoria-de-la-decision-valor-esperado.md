---
titulo: Teoría de la Decisión — Maximización del Valor Esperado
resumen: "Patrón de ejercicio donde se elige un parámetro de decisión $k$ y la ganancia depende además de una variable aleatoria que no se controla: se escribe $G_k=g_k(X)$, se calcula $E[G_k]$ para cada $k$ y se elige el que la maximiza."
tipo: tecnica
unidad: 3
orden: 6
tags: [discreta, tecnica, esperanza, decision]
fuentes: ["[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-06-06
---

# Teoría de la Decisión — Maximización del Valor Esperado

**En breve.** Patrón de ejercicio donde se elige un parámetro $k$ (cuánto producir,
qué obra tomar) y la ganancia depende de $k$ y de una v.a. que no se controla. La
receta: escribir la ganancia $G_k$ como [[funcion-de-variable-aleatoria|función de la v.a.]], calcular $E[G_k]$ para cada $k$ y quedarse con el que la maximiza.

La **teoría de la decisión** estudia el comportamiento de un agente que debe
elegir entre varias alternativas frente a eventos inciertos. El criterio más
común es el de **maximización del valor esperado**: se toma la decisión que
maximiza el valor esperado de la ganancia (o retorno), o equivalentemente la que
minimiza el costo esperado (según [[tp3-variables-aleatorias-discretas]], recuadro
"Teoría de la decisión", eje de los ejercicios 9, 10 y 11).

## El patrón (cómo se reconoce y se resuelve)

Aparece cuando el enunciado pide elegir **un parámetro de decisión** $k$ (cuántas
unidades comprar/producir, qué obra elegir, etc.) y la ganancia depende a la vez
de esa decisión y de una [[variable-aleatoria|v.a.]] $X$ que **no se controla**
(la demanda, el resultado de la obra…).

1. **Identificar la variable de decisión** $k$ y la **v.a. de azar** $X$ con su
   [[funcion-de-distribucion-acumulada|distribución]].
2. **Escribir la ganancia como función** $G_k = g_k(X)$. Para cada valor candidato
   de $k$ se obtiene una v.a. distinta (su recorrido y su distribución dependen de
   $k$). Conviene verla como una [[funcion-de-variable-aleatoria|función de la v.a.]]
   $X$ y usar $E[g_k(X)] = \sum_{x} g_k(x)\,p_X(x)$.
3. **Calcular $E[G_k]$ para cada $k$** posible (tabla).
4. **Elegir el $k^*$ que maximiza** $E[G_k]$ (o que minimiza el costo esperado).

> Atajo útil: muchas veces no hace falta tabular **todos** los $k$. Conviene
> acotar: para $k$ menor que el mínimo del recorrido de $X$, $E[G_k]$ crece con
> $k$; para $k$ mayor que el máximo, $E[G_k]$ decrece. El óptimo está dentro del
> recorrido de la demanda.

## Variantes del TP3

- **Ej. 9** (utilidad de la demanda diaria $D$): elegir $k$ artículos a producir
  para maximizar $E[U]$, e incluye el **valor de la información perfecta** (cuánto
  pagaría por conocer la demanda de antemano = $E$ de la ganancia con producción
  ajustada a la demanda menos $\max_k E[G_k]$).
- **Ej. 10** (contratista, dos obras): comparar $E[\text{ganancia}]$ de cada obra;
  y una segunda parte donde el criterio **no** es el valor esperado sino la
  probabilidad de superar un umbral (decisión bajo otro criterio).
- **Ej. 11** (vendedor de diarios): el clásico *newsvendor*, resuelto abajo.

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 11). Un vendedor de
diarios compra cada periódico a \$0,40 y lo vende a \$1; no puede devolver los
diarios que no vendió. La demanda diaria $X$ es independiente día a día y tiene
distribución:

| demanda $x$ | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 |
|---|---|---|---|---|---|---|---|---|
| $p_X(x)$ | 0,01 | 0,04 | 0,06 | 0,08 | 0,15 | 0,28 | 0,22 | 0,16 |

¿Cuántos diarios $k$ debe comprar para **maximizar la ganancia esperada**? (La
demanda insatisfecha no se penaliza.)

**Planteo.** Sea $G_k$ la ganancia cuando compra $k$ diarios. Vende a \$1 y compra
a \$0,40. Si la demanda $X \ge k$, vende los $k$ que tiene; si $X < k$, vende
solo $X$ y le quedan diarios sin vender (que ya pagó). Como
[[funcion-de-variable-aleatoria|función de $X$]]:
$$
G_k(X) =
\begin{cases}
1\cdot X - 0{,}40\,k & \text{si } X < k \quad(\text{sobran diarios})\\[2pt]
1\cdot k - 0{,}40\,k = 0{,}60\,k & \text{si } X \ge k \quad(\text{vende todo})
\end{cases}
$$

**Cálculo.** Se computa $E[G_k] = \sum_x G_k(x)\,p_X(x)$ para cada $k$ del recorrido
de la demanda (Tabla 6 del raw):

| $k$ | $E[G_k]$ |
|---|---|
| 63 | 37,80 |
| 64 | 38,39 |
| 65 | 38,94 |
| 66 | 39,43 |
| 67 | 39,84 |
| **68** | **40,10** |
| 69 | 40,08 |
| 70 | 39,84 |

Por ejemplo, para $k=68$:
$$
E[G_{68}] = \underbrace{(35{,}8)(0{,}01)+\dots+(39{,}8)(0{,}15)}_{X<68}
 + \underbrace{(0{,}60\cdot 68)(0{,}28+0{,}22+0{,}16)}_{X\ge 68} = 40{,}10
$$
(los términos con $X<68$ usan $G_{68}=X-27{,}2$; los términos con $X\ge 68$ usan
$G_{68}=0{,}60\cdot 68 = 40{,}8$).

Fuera del recorrido la ganancia esperada solo baja: para $k>70$,
$E[G_k] = 67{,}84 - 0{,}40\,k \le 39{,}44$; para $k<63$, $E[G_k]=0{,}60\,k \le 37{,}20$.

**Resultado.** El máximo es $E[G_{68}] = \$40{,}10$, en $k = 68$. **El vendedor
debe comprar 68 diarios por día.** Comprar 69 ya baja a \$40,08: el riesgo de que
sobren supera la ganancia marginal de vender uno más.

## Relaciones

- Se apoya en la [[esperanza|esperanza]] y, en particular, en $E[g(X)]$
  (ver [[funcion-de-variable-aleatoria|función de una v.a.]]).
- El recuadro del TP3 que la motiva conecta con la introducción a
  [[variable-aleatoria|v.a. discretas]].
- En unidades posteriores reaparece como criterio de decisión bajo incertidumbre
  (p. ej. en [[prueba-de-hipotesis|pruebas de hipótesis]], donde se busca controlar
  errores esperados).
