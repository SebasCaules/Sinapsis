---
titulo: "Video — Laplace"
resumen: "Clase en video de Lucio Pantazis (unidad 2) sobre la regla de Laplace: cuándo un espacio es equiprobable y cómo contar casos favorables y posibles con reposición, sin reposición con orden y sin reposición sin orden, sobre un mismo mazo."
tipo: fuente
formato: video
unidad: 2
url: "https://youtu.be/pVBxXX0h8R0"
duracion: "31:06"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Laplace

**Qué es:** clase grabada (YouTube) del Dr. Lucio Pantazis, "Cálculo de
Probabilidades - Laplace".
**Cubre:** la regla de Laplace y el conteo de casos favorables/posibles bajo tres
esquemas de muestreo (con reposición, sin reposición con orden, sin reposición sin
orden), sobre un único ejemplo recurrente (mazo de 5 cartas numeradas).
**Guía asociada:** Guía 2.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:05] | Motivación: cómo calcular probabilidades sin recurrir a simular por repetición |
| [01:05] | Conteo del experimento **con reposición** (árbol $5\times5=25$) y la idea de que sumar varias veces la misma estructura que se repite es lo que da origen a la multiplicación |
| [02:08] | Espacios equiprobables: deducción de que cada resultado vale $1/\#S$ a partir de que todos suman probabilidad 1 |
| [03:44] | Enunciado formal de la **regla de Laplace** y verificación contra probabilidades ya calculadas antes en el curso |
| [06:30] | Advertencia: espacios **no equiprobables** (ejemplo "Gana/Pierde") |
| [07:50] | Nuevo experimento **sin reposición** (árbol $5\times4=20$) |
| [09:54]–[13:57] | Recalcula $P(A)$ y $P(B)$ para el experimento sin reposición usando Laplace |
| [14:25]–[18:41] | Calcula $P(C)$ (suceso no mutuamente excluyente) primero particionando en sucesos disjuntos y después con la regla del complemento |
| [19:02] | Nuevo experimento: extracción **simultánea sin orden** (combinaciones) |
| [22:24]–[25:06] | Recalcula $P(A)$, $P(B)$, $P(C)$ sin orden, con números combinatorios |
| [25:09]–[26:42] | **Error común**: multiplicar sin partición en sucesos m.e. (doble conteo) y su corrección |
| [27:35]–[31:02] | Generaliza las fórmulas de conteo (con reposición, sin reposición con orden, sin reposición sin orden) para $n$ y $k$ genéricos |
| [31:02]–[31:03] | Cierre: flash de menos de un segundo con el título de la próxima clase, "Probabilidad condicional", justo después de la última frase ("eso."); la grabación vuelve enseguida a la diapositiva de generalización y termina así en 31:06 |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto extendido.** El eje de la clase es un único ejercicio (mazo
  de 5 cartas numeradas 1-5, se extraen 2) resuelto bajo **los tres esquemas de
  muestreo** de la tabla de [[tecnica-conteo-combinatoria]] (con reposición / sin
  reposición con orden / sin reposición sin orden), calculando siempre **los mismos
  tres sucesos** $A$, $B$, $C$. Esto deja ver en un solo ejemplo cómo cambia el
  conteo según el esquema, y cuándo la probabilidad resultante coincide y cuándo no:
  los dos esquemas sin reposición dan lo mismo entre sí, pero difieren del esquema
  con reposición (ver la tabla comparativa). Es más sistemático que los ejemplos
  puntuales de [[tp2-calculo-de-probabilidades]]. Ver "Ejercicio resuelto" abajo.
- **(b) Intuición.** Motiva la multiplicación como sumar varias veces lo mismo,
  porque la estructura del árbol se repite (01:52), en vez de partir
  directo de la fórmula de conteo — complementa la explicación ya "seca" de
  [[tecnica-conteo-combinatoria]].
- **(b) Hábito de estudio.** Sugiere resolver cada ejercicio de **dos maneras
  distintas** (p. ej. con orden y sin orden, o directo y por complemento) al
  entrenar para el parcial: si ambas coinciden, da más confianza en el resultado
  (18:44). No está en el apunte.
- **(d) Énfasis.** Remarca con un contraejemplo concreto (ver Advertencias) que la
  regla de Laplace exige que **el espacio muestral elegido** sea equiprobable — no
  alcanza con que un suceso tenga "dos resultados posibles" para asumir 50/50. Esto
  refuerza, con un ejemplo numérico, el aviso ya presente en [[regla-de-laplace]].

## Ejercicio resuelto en clase

*(arranca en [01:05], continúa hasta [25:06])*

**Enunciado.** Un mazo tiene 5 cartas numeradas del 1 al 5. Se extraen 2 cartas.
Se definen los sucesos:
- $A$ = "los números extraídos son iguales".
- $B$ = "los números extraídos suman un número impar".
- $C$ = "el máximo número extraído es al menos 4".

Calcular $P(A)$, $P(B)$, $P(C)$ bajo tres esquemas de extracción.

---

**(i) Con reposición** [01:05]–[06:04]

Espacio muestral (pares ordenados, se puede repetir carta):
$$ \mathcal{S}=\{(i,j)\in\mathbb{N}^2 : 1\le i,j\le 5\}, \qquad \#\mathcal{S}=5\cdot5=25. $$
Equiprobable (todas las extracciones son al azar), así que vale Laplace.

- $A$ (iguales): hay $5$ pares $(i,i)$. $\;P(A)=\dfrac{5}{25}=0.2.$
- $B$ (suma impar): definiendo $B_i=$ "la $i$-ésima extracción es impar", $B=(B_1\cap \overline{B_2})\cup(\overline{B_1}\cap B_2)$, mutuamente excluyentes.
  Con $3$ impares y $2$ pares disponibles en cada extracción (hay reposición):
  $\#(B_1\cap\overline{B_2})=3\cdot2=6$, $\#(\overline{B_1}\cap B_2)=2\cdot3=6$.
  $\;P(B)=\dfrac{6+6}{25}=\dfrac{12}{25}=0.48.$
- $C$ (máximo $\ge4$): por complemento, $\overline{C}=$ "ambas extracciones $<4$" (en $\{1,2,3\}$, con reposición): $\#\overline{C}=3\cdot3=9$.
  $\;P(C)=1-\dfrac{9}{25}=\dfrac{16}{25}=0.64.$

---

**(ii) Sin reposición, con orden** [07:50]–[18:41]

$$ \mathcal{S}=\{(i,j)\in\mathbb{N}^2 : 1\le i,j\le5,\ i\ne j\}, \qquad \#\mathcal{S}=5\cdot4=20. $$

- $A$: imposible sin reposición. $\;P(A)=\dfrac{0}{20}=0.$
- $B$: ahora, sin reposición, sacar la primera par o impar no cambia la cantidad disponible del otro conjunto (quitar un par no afecta a los impares, y viceversa).
  $\#(B_1\cap\overline{B_2})=3\cdot2=6$ (primera impar entre 3, segunda par entre 2, intactas).
  $\#(\overline{B_1}\cap B_2)=2\cdot3=6$ (primera par entre 2, segunda impar entre 3, intactas).
  $\;P(B)=\dfrac{6+6}{20}=\dfrac{12}{20}=\dfrac{3}{5}=0.6.$
  Atención: los **casos favorables** siguen siendo $12$, igual que con reposición, pero el espacio muestral bajó de $25$ a $20$, así que la probabilidad **no** coincide con la de (i): $12/20=0.6\ne12/25=0.48$. Sí va a coincidir con el esquema sin orden (iii), donde las permutaciones se compensan (ver comentario del docente en [23:44]).
- $C$: **no** es mutuamente excluyente escribirlo como $C_1\cup C_2$ directo ($C_i=$ "$i$-ésima extracción $\ge4$"), así que se particiona en sucesos disjuntos:
  $C=(C_1\cap\overline{C_2})\cup(\overline{C_1}\cap C_2)\cup(C_1\cap C_2)$.
  $\#(C_1\cap\overline{C_2})=2\cdot3=6$ (primera $\in\{4,5\}$, segunda $\in\{1,2,3\}$).
  $\#(C_1\cap C_2)=2\cdot1=2$ (primera $\in\{4,5\}$, segunda es la otra de $\{4,5\}$).
  $\#(\overline{C_1}\cap C_2)=3\cdot2=6$ (simétrico al primero).
  $\;P(C)=\dfrac{6+2+6}{20}=\dfrac{14}{20}=\dfrac{7}{10}.$
  Alternativa más simple con el **complemento** (De Morgan: $\overline{C}=\overline{C_1\cup C_2}=\overline{C_1}\cap\overline{C_2}$, "ambas $<4$"):
  $\#(\overline{C_1}\cap\overline{C_2})=3\cdot2=6$, $\;P(C)=1-\dfrac{6}{20}=\dfrac{7}{10}.$ (mismo resultado, mucho menos trabajo — con la práctica uno se da cuenta de cuándo conviene usar el complemento, porque a veces es más fácil calcularlo, [17:33]).

---

**(iii) Sin reposición, sin orden** [19:02]–[25:06]

Se extraen las 2 cartas a la vez (no hay noción de "primera" y "segunda"):
$$ \#\mathcal{S}=\binom{5}{2}=\frac{5\cdot4}{2}=10. $$

- $A$: imposible. $\;P(A)=\dfrac{0}{10}=0.$
- $B$: elegir 1 carta del conjunto de pares ($\{2,4\}$) y 1 del conjunto de impares ($\{1,3,5\}$): $\;P(B)=\dfrac{\binom{2}{1}\binom{3}{1}}{\binom{5}{2}}=\dfrac{6}{10}=\dfrac{3}{5}=0.6.$ (mismo valor que en (ii) — "las permutaciones se terminan compensando", [24:00]; en cambio con reposición (i) daba $12/25=0.48$).
- $C$: por complemento, elegir las 2 cartas entre las 3 menores a 4 ($\{1,2,3\}$): $\;P(C)=1-\dfrac{\binom{3}{2}}{\binom{5}{2}}=1-\dfrac{3}{10}=\dfrac{7}{10}.$

---

**Comparación de los tres esquemas**

| Esquema | $\#\mathcal{S}$ | $P(A)$ | $P(B)$ | $P(C)$ |
|---|---|---|---|---|
| (i) Con reposición | $25$ | $5/25=0.2$ | $12/25=0.48$ | $16/25=0.64$ |
| (ii) Sin reposición, con orden | $20$ | $0$ | $12/20=0.6$ | $14/20=0.7$ |
| (iii) Sin reposición, sin orden | $10$ | $0$ | $6/10=0.6$ | $7/10=0.7$ |

Lo que hay que leer de la tabla: **(ii) y (iii) coinciden en todo** — son el mismo
experimento contado con o sin orden, y las permutaciones se cancelan entre numerador
y denominador. **(i) no coincide con ninguno de los dos**: reponer cambia el
experimento (habilita $A$, que sin reposición es imposible, y modifica $P(B)$ y
$P(C)$). El caso de $B$ es el más engañoso: los casos favorables son $12$ en (i) y
en (ii), pero el espacio muestral pasa de $25$ a $20$, así que $0.48\ne0.6$.

## Advertencias del docente

- **[06:30]** "Ojo que acá [sic] hay un error muy común": pensar que si un suceso tiene
  dos resultados posibles (ganar/perder), entonces cada uno tiene probabilidad
  $1/2$. Contraejemplo dado: en un juego con reposición que "gana" si salen dos
  cartas iguales, $\mathcal{S}=\{\text{Gana},\text{Pierde}\}$ tiene 2 elementos,
  pero **no** son equiprobables: $P(\text{Gana})=P(A)=0.2\ne0.5$. La regla de
  Laplace exige verificar que el espacio muestral elegido sea equiprobable, no solo
  que tenga pocos resultados.
- **[18:44]** Al entrenar para el parcial, conviene resolver cada ejercicio de dos
  maneras distintas (p. ej. directo y por complemento, o con orden y sin orden): si
  ambas dan el mismo resultado, da más confianza en la respuesta.
- **[25:09]–[26:42]** **Error común y grave** al contar casos favorables con
  combinatorios: multiplicar sin chequear que los sucesos involucrados sean
  mutuamente excluyentes puede hacer que se cuenten casos de más — al punto de dar
  una "probabilidad" mayor a 1. Ejemplo trabajado: calcular $P(C)$ (máximo $\ge4$,
  sin orden) como $\binom{2}{1}\binom{4}{1}/\binom{5}{2}=8/10=4/5$ (elegir 1 de
  $\{4,5\}$ y la otra carta cualquiera de las 4 restantes) es **incorrecto**: el
  caso $\{4,5\}$ queda contado dos veces. El valor correcto es $7/10$ (ver
  Ejercicio resuelto, parte (iii)); la corrección exige partir en sucesos
  disjuntos $C_i=$ "se extraen exactamente $i$ cartas $\ge4$" y sumar
  $P(C)=P(C_1)+P(C_2)=\big[\binom{2}{1}\binom{3}{1}+\binom{2}{2}\binom{3}{0}\big]/\binom{5}{2}=7/10$.

## Páginas del wiki que toca

- [[regla-de-laplace]] · [[tecnica-conteo-combinatoria]] · [[probabilidad]] ·
  [[axiomas-de-probabilidad]] · [[espacio-muestral-y-eventos]] ·
  [[leyes-de-de-morgan]]
