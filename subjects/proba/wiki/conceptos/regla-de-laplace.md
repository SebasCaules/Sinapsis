---
titulo: Regla de Laplace
resumen: "Con espacio muestral finito y resultados equiprobables, $P(A)=|A|/|S|$: casos favorables sobre casos posibles. Reduce el cálculo de probabilidades a un problema de conteo; si los casos no son equiprobables hay que volver a los axiomas."
tipo: concepto
unidad: 2
orden: 5
tags: [probabilidad, laplace, conteo]
fuentes: ["[[regla-de-laplace-slides]]", "[[video-laplace]]"]
actualizado: 2026-09-04
---

# Regla de Laplace

**En breve.** Cuando todos los resultados pesan lo mismo, la probabilidad de un evento
es simplemente "casos favorables sobre casos posibles": calcular probabilidades se
vuelve un problema de **contar** ([[tecnica-conteo-combinatoria|combinatoria]]).

Cuando el [[espacio-muestral-y-eventos|espacio muestral]] $S$ es **finito** y todos
los resultados son **igualmente probables** (equiprobables):
$$ P(A) = \frac{\text{casos favorables}}{\text{casos posibles}} = \frac{|A|}{|S|}. $$
Calcular probabilidades se reduce a **contar** → ver [[tecnica-conteo-combinatoria]].

**Intuición.** Si las $|S|$ caras del experimento son indistinguibles en cuanto a su
chance, cada una vale $1/|S|$; un evento con $|A|$ de esas caras acumula $|A|/|S|$. Es
la probabilidad como "fracción del universo ocupada por $A$" — la misma imagen de área
de los [[axiomas-de-probabilidad|axiomas]], pero con todos los puntos del mismo tamaño.

> ⚠️ Solo vale si los casos son **equiprobables**. Si no lo son, hay que volver a
> los [[axiomas-de-probabilidad|axiomas]]. Ver el contraejemplo numérico (juego
> Gana/Pierde con $P(\text{Gana})=0.2\ne0.5$) en [[video-laplace|clase de Laplace]],
> min. 06:30.

## Ejercicio resuelto
*Hallar la probabilidad de que la suma sea 8 al tirar un dado dos veces.*

- **Casos posibles**: $6\times 6 = 36$ (principio de multiplicación).
- **Casos favorables** (suma $=8$): $\{(2,6),(3,5),(4,4),(5,3),(6,2)\}$ → $5$.
$$ P(\text{suma}=8) = \frac{5}{36}. $$

> [!figura] u2-suma-dos-dados-no-equiprobable
> A la izquierda, las 36 celdas equiprobables coloreadas según su suma; a la derecha, la cantidad de casos de cada suma. Laplace se aplica sobre las 36 celdas y no sobre los 11 valores de la suma: repartir $\tfrac{1}{11}$ entre las sumas daría $0.0909$ en lugar de $\tfrac{5}{36}$.

## Relación
Es el origen *frecuentista/combinatorio* de la [[probabilidad|probabilidad]]; los
[[axiomas-de-probabilidad|axiomas de Kolmogorov]] la generalizan a casos no
equiprobables y a $S$ infinitos. Para contar los casos, ver
[[tecnica-conteo-combinatoria]].
