---
titulo: "Video — Independencia"
resumen: 'Clase en video de Lucio Pantazis (unidad 2) sobre independencia de eventos: la definición $P(A\cap B)=P(A)P(B)$, su equivalencia con la condicional, el comportamiento de los complementos y por qué independiente no es lo mismo que excluyente.'
tipo: fuente
formato: video
unidad: 2
url: "https://youtu.be/Ig9juOwJNf0"
duracion: "19:02"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Independencia

**Qué es:** clase grabada de Lucio Pantazis sobre independencia de eventos, con dos
ejemplos trabajados en vivo (un dado y un mazo de cartas con moneda).
**Cubre:** definición de independencia, su relación con la probabilidad condicional,
propiedades (complementos, incompatibilidad con m.e.), un error conceptual frecuente y
un ejercicio combinado que usa independencia junto con condicionamiento.
**Guía asociada:** Guía 2.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Ejemplo introductorio con un dado: eventos $D$ (resultado $>4$), $E$ (resultado $=2$), $F$ (resultado par) |
| [00:59] | Cálculo de las intersecciones $D\cap E$, $D\cap F$, $E\cap F$ |
| [02:30] | Cálculo de las condicionales $P(D\mid E)$, $P(E\mid D)$, $P(D\mid F)$, $P(F\mid D)$, etc. |
| [04:41] | Definición formal de independencia $P(A\cap B)=P(A)P(B)$ y su equivalencia con la condicional |
| [05:57] | Cómo verificar independencia en la práctica: hay que comprobar la igualdad, nunca asumirla |
| [06:38] | Propiedad: si $A$ y $B$ son independientes, también lo son sus complementos ($A,\bar B$; $\bar A,B$; $\bar A,\bar B$) |
| [07:02] | Distinción entre mutuamente excluyentes e independientes: nunca se cumplen ambas a la vez si las probabilidades son positivas |
| [07:56] | Error conceptual frecuente: independencia no significa que un evento no afecte los *resultados* posibles del otro, sino que no afecta sus *probabilidades* |
| [10:10] | Nuevo ejemplo: mazo de 5 cartas + moneda, extracciones con reposición, juego que se gana con a lo sumo una carta par |
| [13:00] | Planteo de $P(G)$ condicionando según el resultado de la moneda (cara/seca) |
| [14:28] | Cálculo de $P(G\mid M)$ descomponiendo en eventos mutuamente excluyentes y usando la independencia de los $B_i$ |
| [16:33] | Cálculo de $P(G\mid \bar M)$ de forma análoga; resultado final $P(G)=93/125$ |
| [18:56] | Cierre del tema y transición a [[probabilidad-total-y-bayes\|Probabilidad total y Bayes]] |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos que no están en el wiki:**
  - El ejemplo del dado con $D,E,F$ ([00:04]–[04:41]): construye la definición de
    independencia *desde* las condicionales, contrastando un par mutuamente excluyente
    ($D,E$, con $P(D\mid E)=0$) contra un par independiente ($D,F$, con
    $P(D\mid F)=P(D)$). Es un puente pedagógico entre [[probabilidad-condicional]] e
    [[independencia]] que el apunte no desarrolla paso a paso.
  - El ejercicio combinado de cartas + moneda ([10:10]–[18:52]): reproducido completo
    más abajo. Usa independencia *junto con* condicionamiento para calcular una
    probabilidad no condicionada — un patrón de resolución distinto de los tres
    ejercicios que ya tiene [[independencia|la página de independencia]] (tiradores,
    m.e. vs. independiente, circuito serie/paralelo).
- **(b) Intuiciones no escritas en el apunte:**
  - La distinción entre "no afecta los *resultados* posibles" y "no afecta las
    *probabilidades*" ([07:56]): con $D,F$ independientes, saber que ocurrió $D$ sí
    restringe qué valor puede tomar $F$ (solo puede salir 6), pero la *probabilidad* de
    $F$ sigue siendo $1/2$. El apunte fuente ([[independencia-condicional-bayes]]) da la
    definición formal pero no hace esta aclaración.
  - La independencia como herramienta de cálculo: cuando dos eventos $G$ y $M$ **no**
    son independientes, conviene condicionar por $M$ (partición) y usar independencia
    *dentro* de cada rama — anticipa la lógica de
    [[probabilidad-total-y-bayes|probabilidad total]].
- **(c) Advertencias del docente:** ver sección siguiente.
- **(d) Énfasis del docente:** insiste repetidamente en que la independencia
  **siempre hay que comprobarla o justificarla** — salvo que el enunciado la dé
  expresamente ([06:00]) — y en que el vocabulario correcto es "eventos independientes", no
  "probabilidades independientes".

## Ejercicio resuelto en clase

**[10:10]** *Se tiene un mazo de 5 cartas $\{1,2,3,4,5\}$ (3 impares, 2 pares). Se
lanza una moneda equilibrada: si sale cara ($M$) se hacen 2 extracciones con
reposición; si sale ceca ($\bar M$) se hacen 3 extracciones con reposición. Se gana el
juego ($G$) si se extrae a lo sumo una carta par. Calcular $P(G)$.*

**Planteo — eventos.**
- $M$ = "la moneda sale cara", con $P(M)=P(\bar M)=\tfrac12$.
- $B_i$ = "la $i$-ésima extracción es impar", con $P(B_i)=\tfrac35$ en cada extracción
  (las extracciones son con reposición, así que la composición del mazo no cambia: los
  $B_i$ son independientes entre sí, y también independientes de $M$, porque la moneda
  solo decide *cuántas* extracciones hay, no la probabilidad de cada una).
- $G$ = "se gana el juego" (a lo sumo 1 carta par) **no** es independiente de $M$, así
  que hay que condicionar:
$$ P(G) = P(G\mid M)\,P(M) + P(G\mid \bar M)\,P(\bar M) = \tfrac12\,P(G\mid M) + \tfrac12\,P(G\mid \bar M). $$

**Caso $M$ (2 extracciones).** A lo sumo una carta par $\iff$ las dos impares, o
exactamente una impar y la otra par. Estos tres sucesos son mutuamente excluyentes:
$$ G\mid M = (B_1\cap B_2) \cup (\bar B_1\cap B_2) \cup (B_1\cap \bar B_2). $$
Usando que son m.e. y que los $B_i$ son independientes entre sí:
$$ P(G\mid M) = P(B_1)P(B_2) + P(\bar B_1)P(B_2) + P(B_1)P(\bar B_2) = \tfrac35\cdot\tfrac35 + \tfrac25\cdot\tfrac35 + \tfrac35\cdot\tfrac25 = \tfrac{9}{25}+\tfrac{6}{25}+\tfrac{6}{25} = \tfrac{21}{25}. $$

**Caso $\bar M$ (3 extracciones).** A lo sumo una carta par $\iff$ las tres impares, o
exactamente una par entre las tres. Cuatro sucesos mutuamente excluyentes:
$$ G\mid \bar M = (B_1\cap B_2\cap B_3) \cup (\bar B_1\cap B_2\cap B_3) \cup (B_1\cap \bar B_2\cap B_3) \cup (B_1\cap B_2\cap \bar B_3). $$
$$ P(G\mid \bar M) = \left(\tfrac35\right)^3 + \tfrac25\cdot\tfrac35\cdot\tfrac35 + \tfrac35\cdot\tfrac25\cdot\tfrac35 + \tfrac35\cdot\tfrac35\cdot\tfrac25 = \tfrac{27}{125}+\tfrac{18}{125}+\tfrac{18}{125}+\tfrac{18}{125} = \tfrac{81}{125}. $$

**Resultado.**
$$ P(G) = \tfrac12\cdot\tfrac{21}{25} + \tfrac12\cdot\tfrac{81}{125} = \tfrac{105}{250}+\tfrac{81}{250} = \tfrac{186}{250} = \boxed{\tfrac{93}{125}}. $$

El punto clave del ejercicio (remarcado por el docente en [17:35]–[18:56]): $G$ y $M$
**no** son independientes, pero condicionar por $M$ (una partición) permite trabajar
*dentro* de cada rama con eventos que **sí** son independientes — la independencia no
sirvió para calcular $P(G)$ directamente, sino para calcular las condicionales
$P(G\mid M)$ y $P(G\mid \bar M)$.

## Advertencias del docente

- **[04:35]** "No digan que las probabilidades son independientes" — lo que es
  independiente son los **sucesos** (eventos), no sus probabilidades. Error de
  vocabulario que remarca explícitamente.
- **[05:57]** Para afirmar que dos eventos son independientes hay que **comprobar** la
  igualdad $P(A\cap B)=P(A)P(B)$, salvo que el enunciado diga expresamente que lo son;
  no vale asumir que las intersecciones siempre dan el producto de las probabilidades,
  porque sin independencia asegurada eso no se cumple.
- **[07:02]–[07:56]** Error frecuente en el aula (el docente cuenta que siempre pregunta
  en clase cómo son estos eventos y le responden esto): decir que dos eventos son a la
  vez mutuamente excluyentes e independientes. Si ambos tienen probabilidad positiva, **nunca** puede pasar
  ($P(A\cap B)=0\neq P(A)P(B)>0$).
- **[10:26]** Cuando se afirma que un conjunto de eventos es independiente, **siempre
  hay que justificarlo** — dar el motivo por el cual saber que pasó uno no debería
  afectar la probabilidad del otro (p. ej. en [12:16] justifica la independencia de los
  $B_i$ diciendo que, como la carta se vuelve a meter en el mazo, la probabilidad de que
  la siguiente extracción sea impar sigue siendo siempre la misma).

## Páginas del wiki que toca

- [[independencia]]
- [[probabilidad-condicional]]
- [[probabilidad-total-y-bayes]]
- [[espacio-muestral-y-eventos]]
- [[regla-de-laplace]]
- [[probabilidad]]
