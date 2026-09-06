---
titulo: "Video — Total y Bayes"
resumen: "Clase en video de Lucio Pantazis (unidad 2) que construye desde cero, sobre un único ejemplo de extracciones sin reposición, la partición del espacio muestral, el teorema de la probabilidad total y el teorema de Bayes."
tipo: fuente
formato: video
unidad: 2
url: "https://youtu.be/n_eF7fjX164"
duracion: "35:05"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Total y Bayes

**Qué es:** clase grabada dedicada casi por completo a un único ejemplo extendido
(extracción de cartas sin reposición) que va construyendo, paso a paso, la fórmula de
la [[probabilidad-total-y-bayes|probabilidad total]] y el [[probabilidad-total-y-bayes|teorema de Bayes]]
desde cero, hasta llegar a sus enunciados generales.
**Cubre:** partición del espacio muestral, teorema de probabilidad total (ambas formas)
y teorema de Bayes, con énfasis en *cómo* se construyen (no solo en la fórmula final).
**Guía asociada:** Guía 2.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:00] | Título: "Probabilidad total y Bayes". |
| [00:23] | Nuevo experimento: mazo de 10 cartas (1 a 10), 4 extracciones **sin reposición**. Define $B_i$ = "la $i$-ésima extracción es impar" y $H_j$ = "hubo exactamente $j$ impares en las 4 extracciones". |
| [01:44] | El docente corrige en vivo un error de la slide: los $B_i$ **no** son independientes (justamente por ser sin reposición); solo los $H_j$ son mutuamente excluyentes. |
| [02:07] | Descompone $P(H_2)$ en 8 intersecciones mutuamente excluyentes ($2^3$, según lo que pasa en las primeras 3 extracciones), con diagrama de Venn. |
| [04:33] | Reescribe cada intersección como condicional × marginal; nota que 2 de los 8 términos son imposibles y se anulan. |
| [06:40] | Quedan 6 términos; deduce qué debe pasar en la 4ª extracción; reemplaza con las probabilidades del mazo → $P(H_2)=30/63$; conecta la cantidad de términos con $\binom{4}{2}=6$. |
| [11:12] | Formaliza el concepto de **partición** del espacio muestral. |
| [12:56] | Enuncia el **Teorema de Probabilidad Total** en general (forma con intersecciones y, desde [13:35], forma con condicionales). |
| [14:17] | Repaso de un ejemplo previo (moneda + cartas, evento $G$="ganar") para mostrar que ya se usaba probabilidad total "sin saberlo". |
| [14:58] | Advertencia fuerte ("horrible" ×7) sobre promediar condicionales sin ponderar por $P(A_k)$. |
| [16:03] | Advertencia sobre el diagrama de árbol: en cada nivel de ramificación tiene que haber una partición. |
| [17:07] | Otras particiones: define eventos acumulados $I_j^k$ = "hasta la extracción $k$, exactamente $j$ impares"; recalcula $P(H_2)$ con la partición $\{I_0^3,I_1^3,I_2^3,I_3^3\}$, más simple. |
| [22:44] | "Condicionales incómodas": invierte una condicional cuando el denominador ya es conocido — $P(I_1^3\mid I_2^4)=1/2$. |
| [25:06] | "Condicionales más incómodas": ahora también el denominador es desconocido → hay que aplicarle probabilidad total, lo que da lugar a Bayes completo. |
| [33:03] | Enuncia el **Teorema de Bayes** en general. |
| [34:56] | Cierre de la guía. |

## Qué aporta sobre el apunte

- **Ejemplo resuelto extendido y original.** El apunte ([[independencia-condicional-bayes]])
  trae ejemplos breves de una sola cuenta (daltónicos, tiradores). Este video, en cambio,
  dedica los 35 minutos enteros a un *único* ejemplo (10 cartas, 4 extracciones sin
  reposición) que se resuelve por **tres caminos distintos** y sirve de excusa para
  derivar, desde cero, tanto la probabilidad total como Bayes — mucho más trabajado que
  cualquier ejemplo ya presente en el wiki. Se reproduce completo abajo.
- **Intuición: dos niveles de dificultad al "invertir" una condicional.** El docente
  distingue explícitamente entre (i) cuando el denominador de la condicional que se
  busca ya se conoce (alcanza la definición simple de condicional) y (ii) cuando el
  denominador también es desconocido (ahí hace falta aplicarle probabilidad total, lo
  que da el teorema de Bayes completo). Esta gradación pedagógica no está en el apunte.
- **Énfasis:** remarca que la cantidad de sumandos "razonables" en una descomposición de
  "exactamente $k$ éxitos en $n$ etapas" coincide con $\binom{n}{k}$ — conecta
  directamente con [[tecnica-conteo-combinatoria]] (no está explicitado así en el apunte).
- **Advertencias del docente** (ver sección propia abajo) sobre errores frecuentes al
  promediar condicionales y sobre la confiabilidad de la intuición en la materia.

## Ejercicio resuelto en clase

*(Empieza en [00:23]; mazo de 10 cartas numeradas 1 a 10, se hacen 4 extracciones sin
reposición. $B_i$ = "la $i$-ésima extracción es impar" ($i=1,\dots,4$); $H_j$ = "en las
4 extracciones se obtuvieron exactamente $j$ números impares". Se pide $P(H_2)$.)*

> Nota: en esta clase el docente comete y corrige varios errores aritméticos en vivo
> (se lo ve tachar y recalcular varias veces). Los números que siguen están verificados
> de forma independiente contra el cálculo directo por conteo (hipergeométrico), así que
> en algún paso puntual el valor final difiere levemente del que aparece literalmente en
> la grabación — se prioriza la cuenta correcta.

### Planteo — partición por acumulados

En vez de descomponer $H_2$ directamente en $2^3=8$ intersecciones de $B_i$/$\overline{B_i}$
(el primer camino que prueba el docente en [02:07], válido pero más largo), conviene
definir eventos **acumulados**:
$$ I_j^k = \text{"hasta la $k$-ésima extracción se obtuvieron exactamente $j$ números impares"}. $$
Con esta notación, $H_2 = I_2^4$. Para un mismo $k$, los $I_j^k$ son mutuamente
excluyentes y cubren todo el espacio → son una [[probabilidad-total-y-bayes|partición]].

### Paso 1 — probabilidad total con la partición $\{I_0^3, I_1^3, I_2^3, I_3^3\}$

$$ P(I_2^4) = P(I_2^4\mid I_0^3)P(I_0^3) + P(I_2^4\mid I_1^3)P(I_1^3) + P(I_2^4\mid I_2^3)P(I_2^3) + P(I_2^4\mid I_3^3)P(I_3^3). $$

Los términos con $I_0^3$ y $I_3^3$ se anulan: de 0 impares en 3 extracciones no se puede
llegar a 2 impares agregando solo una carta, y de 3 impares tampoco se puede *bajar* a 2.
Quedan solo dos términos:
$$ P(H_2) = P(I_2^4\mid I_1^3)\cdot P(I_1^3) + P(I_2^4\mid I_2^3)\cdot P(I_2^3). $$

### Paso 2 — calcular $P(I_1^3)$ y $P(I_2^3)$

$P(I_1^3)$ (exactamente 1 impar en las primeras 3 extracciones) se arma sumando las 3
formas mutuamente excluyentes de lograrlo — en cada término hay **un solo** $B_i$
(la extracción impar) y los otros dos son $\overline{B_i}$:
$$ P(I_1^3) = P(\overline{B_1}\cap\overline{B_2}\cap B_3) + P(\overline{B_1}\cap B_2\cap\overline{B_3}) + P(B_1\cap\overline{B_2}\cap\overline{B_3}) $$
$$ = \tfrac12\cdot\tfrac49\cdot\tfrac58 + \tfrac12\cdot\tfrac59\cdot\tfrac12 + \tfrac12\cdot\tfrac59\cdot\tfrac12 = \frac{15}{36}. $$

Análogamente para $P(I_2^3)$ (exactamente 2 impares en las primeras 3) — ahora cada
término tiene **dos** $B_i$ verdaderos y uno solo $\overline{B_i}$:
$$ P(I_2^3) = P(\overline{B_1}\cap B_2\cap B_3) + P(B_1\cap\overline{B_2}\cap B_3) + P(B_1\cap B_2\cap\overline{B_3}) $$
$$ = \tfrac12\cdot\tfrac59\cdot\tfrac12 + \tfrac12\cdot\tfrac59\cdot\tfrac12 + \tfrac12\cdot\tfrac49\cdot\tfrac58 = \frac{15}{36}. $$

> ⚠️ Nota de fidelidad: en este mazo particular (5 pares y 5 impares) da la casualidad
> de que $P(I_1^3)=P(I_2^3)=15/36$ — es una simetría de este caso, no una regla general.
> Verificación por conteo directo: $P(I_1^3)=\binom{5}{1}\binom{5}{2}/\binom{10}{3}=50/120=15/36$
> y $P(I_2^3)=\binom{5}{2}\binom{5}{1}/\binom{10}{3}=50/120=15/36$ — coincide con lo calculado
> arriba, y confirma que cada descomposición corresponde a su evento correcto.

### Paso 3 — las condicionales que faltan y resultado

Si ya hubo exactamente 1 impar en las primeras 3, para llegar a 2 en las 4 la 4ª
extracción tiene que ser impar sí o sí: quedan 4 impares entre las 7 cartas restantes,
$$ P(I_2^4\mid I_1^3) = P(B_4\mid I_1^3) = \frac47. $$
Si ya hubo exactamente 2 impares en las primeras 3, la 4ª tiene que ser **par**: quedan
4 pares entre las 7 restantes,
$$ P(I_2^4\mid I_2^3) = P(\overline{B_4}\mid I_2^3) = \frac47. $$

$$ P(H_2) = \frac47\cdot\frac{15}{36} + \frac47\cdot\frac{15}{36} = \frac{30}{63} = \frac{10}{21} \approx 0.476. $$

*(Verificación por conteo directo: $P(H_2)=\dfrac{\binom{5}{2}\binom{5}{2}}{\binom{10}{4}}=\dfrac{100}{210}=\dfrac{10}{21}$ — coincide.)*

### Paso 4 — "dar vuelta" una condicional cuando el denominador ya se conoce

*(Desde [22:44].)* Ahora se pregunta, sabiendo que hubo exactamente 2 impares en las 4
extracciones ($I_2^4$), cuán probable es que eso haya venido de exactamente 1 impar en
las primeras 3 ($I_1^3$): se pide $P(I_1^3\mid I_2^4)$. Es difícil pensarla directamente
(el pasado condicionado al futuro), pero es fácil en el sentido contrario
($P(I_2^4\mid I_1^3)$, ya calculada arriba). Como $P(I_2^4)=P(H_2)$ **ya se conoce**
(Paso 3), alcanza con la definición de condicional:
$$ P(I_1^3\mid I_2^4) = \frac{P(I_1^3\cap I_2^4)}{P(I_2^4)} = \frac{P(I_2^4\mid I_1^3)\cdot P(I_1^3)}{P(I_2^4)} = \frac{\tfrac47\cdot\tfrac{15}{36}}{\tfrac{30}{63}} = \frac12. $$

### Paso 5 — cuando también el denominador es desconocido (Bayes completo)

*(Desde [25:06].)* El docente plantea un caso más incómodo: sabiendo que hubo
exactamente 3 impares en las 4 extracciones ($I_3^4$), qué tan probable es que haya
habido exactamente 1 impar en las **primeras 2** ($I_1^2$): se pide $P(I_1^2\mid I_3^4)$.
Ahora el denominador $P(I_3^4)$ **no se conoce de antemano**, así que hace falta
aplicarle también probabilidad total, usando la partición $\{I_0^2, I_1^2, I_2^2\}$ de
lo que puede pasar en las primeras 2 extracciones — esto es exactamente el teorema de
Bayes en acción:
$$ P(I_1^2\mid I_3^4) = \frac{P(I_3^4\mid I_1^2)\cdot P(I_1^2)}{P(I_3^4\mid I_0^2)\cdot P(I_0^2) + P(I_3^4\mid I_1^2)\cdot P(I_1^2) + P(I_3^4\mid I_2^2)\cdot P(I_2^2)}. $$

Con $P(I_0^2)=P(I_2^2)=\tfrac12\cdot\tfrac49=\tfrac29$, $P(I_1^2)=2\cdot\tfrac12\cdot\tfrac59=\tfrac59$;
$P(I_3^4\mid I_0^2)=0$ (imposible pasar de 0 a 3 impares en solo 2 extracciones más);
$P(I_3^4\mid I_1^2)=P(B_3\cap B_4\mid I_1^2)=\tfrac48\cdot\tfrac37=\tfrac3{14}$;
$P(I_3^4\mid I_2^2)=P(\overline{B_3}\cap B_4\mid I_2^2)+P(B_3\cap\overline{B_4}\mid I_2^2)=\tfrac38\cdot\tfrac57+\tfrac58\cdot\tfrac37=\tfrac{15}{28}$:

$$ P(I_1^2\mid I_3^4) = \frac{\tfrac3{14}\cdot\tfrac59}{0 + \tfrac3{14}\cdot\tfrac59 + \tfrac{15}{28}\cdot\tfrac29} = \frac{5/42}{5/42+5/42} = \frac12. $$

Este es exactamente el patrón del [[probabilidad-total-y-bayes|teorema de Bayes]]: el
numerador es un solo término de la partición, el denominador es la probabilidad total
armada con **todos** los términos de esa misma partición.

## Advertencias del docente

- [01:44] Corrige un error de su propia slide: en este experimento (sin reposición) los
  $B_i$ **no son independientes** entre sí — solo los $H_j$ son mutuamente excluyentes.
  Advertencia útil: no dar por sentada la independencia solo porque una slide lo diga.
- [14:58] Advertencia fuerte y repetida ("horrible" × 7): al usar probabilidad total,
  **nunca hay que promediar directamente** probabilidades condicionales $P(B\mid A_k)$
  sin ponderarlas por $P(A_k)$ — cada condicional está calculada sobre un total de casos
  distinto según el condicionante, así que sumarlas "tal cual" no tiene sentido (puede
  dar incluso más de 1). Señala que muchos se olvidan de esa parte.
- [05:38] "La intuición falla y mucho" en esta materia — la describe como "un arma de
  doble filo" y pide verificar siempre con cuentas, no solo con intuición.
- [16:03] Recuerda que en un [[arbol-de-probabilidades|diagrama de árbol]], cada nivel de
  ramificación tiene que ser una partición genuina — si no, "este diagrama es inválido".

## Páginas del wiki que toca

- [[probabilidad-total-y-bayes]]
- [[probabilidad-condicional]]
- [[independencia]]
- [[arbol-de-probabilidades]]
- [[tecnica-conteo-combinatoria]]
- [[espacio-muestral-y-eventos]]
