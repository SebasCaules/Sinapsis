---
titulo: "TP2 — Cálculo de probabilidades (guía 2024)"
resumen: "Guía de ejercicios de la unidad 2 (curso 2024) con repaso de axiomas, probabilidad condicional, independencia, Bayes y el catálogo combinatorio completo; trae 40 enunciados, respuestas y nueve resoluciones paso a paso."
tipo: fuente
formato: guia
unidad: 2
archivo_raw: "raw/03-intro-probabilidad/tp2_2024.pdf"
ingerido: 2026-05-30
---

# TP2 — Cálculo de probabilidades (guía 2024)

**Qué es:** la guía de ejercicios TP2 del curso 2024 (53 págs.): repaso teórico,
40 ejercicios, respuestas y una sección de 8 **ejercicios resueltos** paso a paso.
**Cubre las unidades/temas:** toda la Unidad 2 — espacio muestral y álgebra de
eventos, [[axiomas-de-probabilidad|axiomas]], [[probabilidad-condicional|condicional]],
[[independencia]], [[probabilidad-total-y-bayes|probabilidad total y Bayes]],
[[arbol-de-probabilidades|árbol de probabilidades]], [[regla-de-laplace|Laplace]] y
[[tecnica-conteo-combinatoria|combinatoria]]. El ejercicio resuelto 4 además anticipa
el origen combinatorio de [[distribucion-binomial|binomial]] e
[[distribucion-hipergeometrica|hipergeométrica]] (Unidad 3).

## Estructura del PDF (doble numeración)
- **§1 Repaso de conceptos** (págs. 2-6): álgebra de eventos, axiomas y sus
  consecuencias, condicional, independencia, Bayes, **árbol de probabilidades** (4
  reglas), regla de Laplace y el **catálogo combinatorio completo** (sumas, producto,
  inclusión-exclusión, palomar, factorial/combinatoria, identidades, con/sin reposición).
- **§2 Guía de ejercicios** (págs. 7-15): ejercicios **1 a 40**.
- **§3 Respuestas** (pág. 16): claves numéricas de casi todos.
- **§4 Ejercicios resueltos** (págs. 17-53): desarrollos paso a paso de los ejercicios
  **4, 10, 11, 14, 28, 29, 30, 33, 37** (con su número original de la guía).

> Nota sobre numeración: los desarrollos de §4 conservan el número de la guía (§2),
> así que NO hay corrimiento como en otras guías (p. ej. TP5/TP7). Citar siempre el
> número de la guía.

## Puntos clave
- **Catálogo combinatorio**: vuelca en `[[tecnica-conteo-combinatoria]]` (las 5 formas
  de elegir/ordenar, inclusión-exclusión de $n$ eventos, regla del palomar, identidades
  de números combinatorios, con vs. sin reposición).
- **Árbol de probabilidades** (pág. 4): sus **4 reglas** dan origen a
  `[[arbol-de-probabilidades]]`.
- **Ej. 4** (págs. 17-23): construye binomial e hipergeométrica desde Laplace/conteo,
  comparando muestreo con y sin reposición; deduce $P(k)=\binom{n}{k}p^k(1-p)^{n-k}$
  y $P(k)=\binom{R}{k}\binom{N-R}{n-k}/\binom{N}{n}$.
- **Ej. 28** (sistema de transmisión, fiabilidad serie/paralelo, $P(P_{100})\approx0.9378$),
  **Ej. 29** (canal binario con 3 repetidores: cadena de inversiones + Bayes,
  $P(R_1\mid T_1)=0.756$, $P(T_1\mid R_1)=0.87848$), **Ej. 30** (mezcla de calidades con
  árbol y tabla 2×3), **Ej. 33** (combinatoria de posiciones en una fila), **Ej. 37**
  (cartas españolas con y sin orden) son arquetipos de parcial.
- Discrepancias / cuidados: ver más abajo.

## Patrones arquetípicos de parcial (qué ejercicio para qué patrón)
| Patrón | Ejercicio(s) |
|---|---|
| Espacio muestral y axiomas (expresar uniones/intersecciones) | 1, 3, 5, 6, 7 |
| Inclusión-exclusión de 3 eventos | 6, 7, 13, 14 |
| Independencia vs. mutuamente excluyentes | 12, 26 |
| Fiabilidad serie/paralelo | 16, 20, 22, 23, 28, 40 |
| Bayes diagnóstico (falso positivo/negativo) | 25, 27 |
| Bayes en cadena (canal binario) | 17, 18, 29 |
| Combinatoria (orden, posiciones, cartas) | 32, 33, 35, 36, 37 |
| Origen combinatorio binomial/hipergeométrica | 4, 38, 39 |

## Discrepancias y cuidados
- En el **Ej. 14** (grupos sanguíneos) el enunciado de la guía (pág. 9) etiqueta el
  dato $P(B)$ como "50% el antígeno B", pero en los **Datos** de la resolución (pág. 28)
  aparece dos veces el rótulo $P(N)$ por error de copia/pega — debe leerse $P(N)=0.4$,
  $P(O)=0.23$, $P(N\cap O)=0.08$ (Ej. 24, pág. 33). Es un error de transcripción del raw,
  no afecta los cálculos (los números usados son los correctos).
- Las **Respuestas** (pág. 16) traen redondeos; los desarrollos de §4 dan más cifras.

## Páginas del wiki que toca
- [[probabilidad]] · [[espacio-muestral-y-eventos]] · [[axiomas-de-probabilidad]] ·
  [[probabilidad-condicional]] · [[independencia]] · [[probabilidad-total-y-bayes]] ·
  [[arbol-de-probabilidades]] · [[regla-de-laplace]] · [[tecnica-conteo-combinatoria]] ·
  [[leyes-de-de-morgan]]
- Anticipa: [[distribucion-binomial]] · [[distribucion-hipergeometrica]] (Unidad 3).
