---
titulo: "Video — Distribución Estacionaria (No Regulares)"
resumen: "Clase en video de Lucio Pantazis (unidad 6) que arma una taxonomía de cuatro casos de cadenas no regulares (un absorbente, varios absorbentes, estados transientes y cadena periódica) e indica en cuáles existe distribución estacionaria."
tipo: fuente
formato: video
unidad: 6
url: "https://youtu.be/hs7YwSdaQrk"
duracion: "15:27"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Distribución Estacionaria (No Regulares)

**Qué es:** continuación de [[video-cadenas-de-markov|la clase de cadenas de Markov]], centrada exclusivamente en qué hacer cuando una cadena **no es
regular**: ¿tiene igual distribución estacionaria o no?
**Cubre:** estado absorbente, cadena con un único absorbente vs. con varios,
estados transientes, cadenas periódicas — para cada caso, si existe o no
$\vec\pi$ y por qué.
**Guía asociada:** Guía 6.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:05] | Arranca directo con el primer caso no regular: Natalia escribiendo una novela, alternando entre escribir (E) y procrastinar (P), con un tercer estado terminar (T) |
| [02:01] | Define formalmente **estado absorbente**: $p_{ii}=1$ |
| [03:40] | Calcula $\mathbb{P}^2,\mathbb{P}^4,\mathbb{P}^8,\mathbb{P}^{16},\mathbb{P}^{32}$ numéricamente: las filas convergen todas a $(0,0,1)$ |
| [04:45] | Justifica por qué: sostener el ciclo E↔P para siempre tiene probabilidad que decae a cero |
| [06:01] | Regla general: **un único estado absorbente, accesible desde todos los demás** ⇒ hay $\vec\pi$, independiente de $\vec p(0)$ |
| [06:20] | Segundo caso: agrega un estado renunciar (R) → ahora hay **dos** estados absorbentes (T y R) |
| [07:20] | Potencias de $\mathbb{P}$ para el caso de dos absorbentes: las filas **no** convergen a un mismo vector |
| [08:37] | Regla general: **dos o más estados absorbentes** ⇒ **no** hay $\vec\pi$ (el límite depende de $\vec p(0)$) |
| [08:56] | Tercer caso: introduce **estados transientes** con el ejemplo del Kale (K, B, C, F) |
| [10:44] | Potencias de $\mathbb{P}$ del ejemplo Kale: la columna de K tiende a 0, el resto converge a $\pi=(0,\tfrac{8}{15},\tfrac13,\tfrac{2}{15})$ |
| [12:41] | Repaso de los casos vistos hasta aquí (absorbente único, dos absorbentes, transiente) antes de pasar al último |
| [13:16] | Cuarto caso: **cadena periódica**, ejemplo de estado de ánimo bipolar (Contenta/Triste) |
| [13:35] | $\mathbb{P}^2=\mathbb{I}$, por lo que $\mathbb{P}^n$ oscila entre $\mathbb{P}$ y $\mathbb{I}$ y no converge ⇒ no hay $\vec\pi$ |
| [15:07]–[15:22] | Balance final (dos casos no regulares con $\vec\pi$ y dos sin $\vec\pi$) y cierre: "si no es regular no es que no tiene distribución estacionaria, tengo que analizarla distinto" |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos numéricamente, potencia por potencia.** El apunte
  [[teorica-cadenas-de-markov]] ya menciona ejemplos de cadena periódica (el
  bebé) y absorbente (la vida), pero sin mostrar el cálculo explícito de las
  potencias de $\mathbb{P}$. Este video sí lo hace para los cuatro casos —
  $\mathbb{P}^2,\mathbb{P}^4,\mathbb{P}^8,\mathbb{P}^{16},\mathbb{P}^{32}$
  calculadas en R — permitiendo **ver** numéricamente cómo convergen (o no)
  las filas. Se reproducen íntegros más abajo.
- **(b) Intuición de por qué "un solo absorbente accesible" alcanza.** El
  docente explica, sin álgebra, por qué no hace falta más que esa condición
  ([04:45]–[06:01]): para no terminar en el estado absorbente hay que sostener
  indefinidamente un ciclo entre los demás estados, y como cada paso de ese
  ciclo tiene probabilidad estrictamente menor a 1, la probabilidad de
  sostenerlo $n$ pasos decae geométricamente a cero. Es la misma lógica del
  patrón "tiempo hasta absorción" ya documentado en
  [[cadenas-de-markov#Tiempo hasta absorción|cadenas-de-markov]], pero contada
  en palabras antes de la matemática.
- **(d) Énfasis: organiza "no regular" en una taxonomía operativa de 4 casos.**
  Esto es lo más valioso del video y **no** está así de sistematizado en
  [[cadenas-de-markov]] (que trae las definiciones de absorbente, transitorio y
  periódico por separado, pero no la regla de decisión). El docente arma
  explícitamente la tabla mental: único absorbente accesible → sí estacionaria;
  ≥2 absorbentes → no estacionaria; estados transientes con resto regular → sí
  estacionaria (poniendo 0 en los transientes); periódica → no estacionaria.
  Se propone como aporte concreto a la página — ver sección **Aportes**
  devuelta al orquestador.
- **(c) Advertencia explícita como cierre de la clase** — ver sección dedicada
  abajo.

## Ejercicio resuelto en clase

*Cuatro variantes del mismo ejemplo hilado (los hábitos de Natalia mientras
escribe una novela), cada una ilustrando un caso distinto de cadena no
regular.*

### Caso 1 — un único estado absorbente (arranca en [00:05])

> Natalia alterna cada 5 minutos entre escribir (E) y procrastinar (P), hasta
> que en algún momento termina la novela (T). Si escribe, a los 5 minutos
> sigue escribiendo con probabilidad $0.5$, procrastina con probabilidad $0.3$
> y termina con probabilidad $0.2$. Si procrastina, sigue procrastinando con
> probabilidad $0.7$, escribe con probabilidad $0.2$ y termina con
> probabilidad $0.1$. Si termina, no vuelve a ninguno de los otros estados.

**Planteo.** $E=\{E,P,T\}$ y
$$ \mathbb{P}=\begin{pmatrix}0.5&0.3&0.2\\0.2&0.7&0.1\\0&0&1\end{pmatrix}\quad(\text{orden }E,P,T). $$
Como la última fila es $(0,0,1)$ para cualquier potencia (fila de $T$
inalterada: $0\cdot0=0$, $0\cdot0=0$, $1\cdot1=1$), la cadena **no es
regular** — nunca va a tener todas las entradas positivas.

**Cálculo — potencias de $\mathbb{P}$ ([03:40]).**
$$ \mathbb{P}^2=\begin{pmatrix}0.31&0.36&0.33\\0.24&0.55&0.21\\0&0&1\end{pmatrix},\quad
\mathbb{P}^4=\begin{pmatrix}0.1825&0.3096&0.5079\\0.2064&0.3889&0.4047\\0&0&1\end{pmatrix}, $$
$$ \mathbb{P}^{16}=\begin{pmatrix}0.0303&0.0553&0.9144\\0.0368&0.0672&0.8960\\0&0&1\end{pmatrix},\quad
\mathbb{P}^{32}\approx\begin{pmatrix}0.0030&0.0054&0.9917\\0.0036&0.0064&0.9899\\0&0&1\end{pmatrix}. $$

**Conclusión.** Las dos primeras columnas van tendiendo a $0$ y la tercera a
$1$: todas las filas convergen a $(0,0,1)$. Existe $\vec\pi=(0,0,1)$,
**independiente** de $\vec p(0)$: cualquiera sea el estado inicial, a largo
plazo Natalia termina la novela con probabilidad $1$. Regla general: si hay un
**único** estado absorbente y es **accesible desde todos los demás**, la
cadena tiene distribución estacionaria (aunque no sea regular) y es la delta
en ese estado.

### Caso 2 — dos estados absorbentes (arranca en [06:20])

> Se agrega la posibilidad de renunciar (R) a la novela. Si escribe: sigue
> escribiendo $0.5$, procrastina $0.3$, termina $0.15$, renuncia $0.05$. Si
> procrastina: sigue procrastinando $0.6$, escribe $0.1$, termina $0.02$,
> renuncia $0.28$. Terminar y renunciar son ambos absorbentes.

**Planteo.** $E=\{E,P,T,R\}$ con
$$ \mathbb{P}=\begin{pmatrix}0.5&0.3&0.15&0.05\\0.1&0.6&0.02&0.28\\0&0&1&0\\0&0&0&1\end{pmatrix}. $$

**Cálculo — $\mathbb{P}^{32}$ ([07:20]).**
$$ \mathbb{P}^{32}\approx\begin{pmatrix}
0.000015 & 0.000036 & 0.388224 & 0.611725\\
0.000012 & 0.000027 & 0.147050 & 0.852911\\
0&0&1&0\\
0&0&0&1
\end{pmatrix}. $$

**Conclusión.** La fila $E$ converge a $(0,0,0.388,0.612)$ y la fila $P$ a
$(0,0,0.147,0.853)$: **distintos** vectores límite. La probabilidad de terminar
la novela vs. renunciar a largo plazo **depende de dónde arrancó** la cadena
(si arrancó terminada, termina; si arrancó renunciada, renuncia; y desde $E$ o
$P$ cada una "hereda" una mezcla distinta). No hay comportamiento unificado,
por lo tanto **no existe** $\vec\pi$. Regla general: con **dos o más** estados
absorbentes nunca hay distribución estacionaria.

### Caso 3 — estados transientes (arranca en [08:56])

> La doctora le dice a Natalia que coma kale (K), que le resulta espantoso.
> Come kale una hora y a la siguiente vuelve a comer kale con probabilidad
> $0.4$, pasa a bizcocho (B) con probabilidad $0.4$ y a fruta (F) con
> probabilidad $0.2$. El resto de las comidas (B, cereal C, F) sigue la
> lógica ya conocida del ejemplo original (ver
> [[video-cadenas-de-markov#Ejercicio resuelto en clase|video-cadenas-de-markov]]).

**Planteo.** $E=\{K,B,C,F\}$ con
$$ \mathbb{P}=\begin{pmatrix}0.4&0.4&0&0.2\\0&0.75&0&0.25\\0&0.4&0.6&0\\0&0&1&0\end{pmatrix}. $$
El kale nunca es accesible desde $B$, $C$ ni $F$ (esa columna es siempre cero
salvo la propia fila de $K$): no es regular. Pero desde $K$ sí se puede
**salir** hacia $\{B,C,F\}$ y no volver, así que $K$ es un **estado
transiente**: un estado al que, con probabilidad positiva, no se vuelve nunca
más.

**Cálculo — potencias de $\mathbb{P}$ ([10:44]).**
$$ \mathbb{P}^{8}=\begin{pmatrix}0.000655&0.532938&0.332991&0.133415\\0&0.533384&0.333230&0.133387\\0&0.533319&0.333389&0.133292\\0&0.533167&0.333609&0.133223\end{pmatrix},\quad
\mathbb{P}^{32}\approx\begin{pmatrix}0&\tfrac{8}{15}&\tfrac13&\tfrac{2}{15}\\0&\tfrac{8}{15}&\tfrac13&\tfrac{2}{15}\\0&\tfrac{8}{15}&\tfrac13&\tfrac{2}{15}\\0&\tfrac{8}{15}&\tfrac13&\tfrac{2}{15}\end{pmatrix}. $$

**Conclusión.** La primera componente (K) tiende a $0$ en todas las filas —
tarde o temprano se abandona el kale para siempre — mientras que las otras
tres coordenadas convergen todas al **mismo** vector, que coincide con la
distribución estacionaria de la subcadena regular formada solo por $\{B,C,F\}$
(la misma del ejemplo original). Existe $\vec\pi=\big(0,\tfrac{8}{15},\tfrac13,\tfrac{2}{15}\big)$,
independiente de $\vec p(0)$. Regla general: si el estado no accesible es
**transiente** (se abandona con probabilidad 1) y el resto de la cadena
restringida es regular, la cadena completa **sí** tiene distribución
estacionaria: cero en los estados transientes y la estacionaria de la
subcadena en el resto.

### Caso 4 — cadena periódica (arranca en [13:16])

> El estado de ánimo de Natalia alterna cada hora entre contenta (C) y triste
> (T), con probabilidad 1 de pasar del uno al otro.

**Planteo.** $E=\{C,T\}$ con
$$ \mathbb{P}=\begin{pmatrix}0&1\\1&0\end{pmatrix}. $$

**Cálculo.** $\mathbb{P}^2=\mathbb{I}=\begin{pmatrix}1&0\\0&1\end{pmatrix}$, y por lo tanto
$$ \mathbb{P}^n=\begin{cases}\mathbb{P}&n\text{ impar}\\ \mathbb{I}&n\text{ par}\end{cases}. $$

**Conclusión.** Las potencias de $\mathbb{P}$ oscilan indefinidamente entre
$\mathbb{P}$ e $\mathbb{I}$ sin acercarse nunca a un único valor — no es que
oscile *convergiendo*, oscila sin límite. Por lo tanto **no existe**
$\lim_{n\to\infty}\mathbb{P}^n$ y **no hay** distribución estacionaria. Nótese
que $\vec\pi=(0.5,0.5)$ sí cumple $\vec\pi=\vec\pi\,\mathbb{P}$ (es autovector
a izquierda con autovalor 1), pero **no** es la distribución estacionaria,
justamente porque la condición de cadena regular (única que garantiza que el
autovector coincide con el límite) no se cumple aquí — ver
[[cadenas-de-markov#Distribución estacionaria|cadenas-de-markov]], donde ya se
señala que la condición de regularidad es suficiente pero no necesaria; este
es el ejemplo que muestra el otro lado: un autovector que existe pero **no**
es la estacionaria.

**Resultado de los cuatro casos.** Único absorbente accesible → $\vec\pi=(0,0,1)$.
Dos absorbentes → no existe $\vec\pi$. Transiente + subcadena regular →
$\vec\pi=(0,\tfrac{8}{15},\tfrac13,\tfrac{2}{15})$. Periódica → no existe
$\vec\pi$.

## Advertencias del docente

- **[15:16]–[15:22] — Cierre de la clase, la idea más importante.** "Si no es
  regular no es que no tiene distribución estacionaria, tengo que analizarla
  distinto." Es decir: la ausencia de regularidad **no** decide por sí sola si
  hay o no $\vec\pi$ — hace falta mirar la estructura (absorbentes,
  transientes, periodicidad) caso por caso.
- **[14:20]–[14:25] — Error de interpretación a evitar con cadenas
  periódicas.** El docente aclara explícitamente que en el caso periódico no
  hay que pensar "converge oscilando": "no es que converge oscilando, no, no.
  Oscila entre dos valores y no se acerca a ningún valor" — distingue oscilar
  con convergencia (a un promedio, por ejemplo) de oscilar sin convergencia
  alguna, que es lo que ocurre aquí.
- **[09:00]–[09:08] — Duda al pasar sobre cómo se escribe el término.** El
  docente comenta que vio el nombre de estos estados escrito con "s" y con
  "sc" (transientes / transcientes) y que le parece que debería ser con "sc",
  porque "transientes" le suena raro. Es una duda ortográfica sobre el término,
  no una convención de notación: vale la pena revisar cómo lo escribe el propio
  apunte de la cátedra antes de copiarlo en un parcial.

## Páginas del wiki que toca

- [[cadenas-de-markov]]
- [[procesos-estocasticos]]
- [[caminata-aleatoria]]
- [[proceso-de-bernoulli]]
- [[proceso-de-poisson]]
- [[relacion-bernoulli-poisson]]
