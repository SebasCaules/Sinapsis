---
titulo: "Video — Cadenas de Markov"
resumen: "Clase en video de Lucio Pantazis (unidad 6) que introduce las cadenas de Markov con un solo ejemplo hilado: propiedad de Markov, matriz y diagrama de transición, potencias para k pasos y vector de distribución, primero resueltos con árboles."
tipo: fuente
formato: video
unidad: 6
url: "https://youtu.be/szNv8NmURUc"
duracion: "32:42"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Cadenas de Markov

**Qué es:** clase grabada del Dr. Lucio Pantazis que introduce las cadenas de
Markov a partir de un único ejemplo hilado (los hábitos de comida de Natalia),
resuelto primero "a mano" con árboles de probabilidad y después con matrices.
**Cubre:** propiedad de Markov, matriz y diagrama de transición, ecuación de
Chapman-Kolmogorov ($\mathbb{P}^k$), vector de distribución, y una advertencia
sobre cuándo NO se puede usar $\mathbb{P}^k$.
**Guía asociada:** Guía 6.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Introducción y planteo del ejemplo hilado: los hábitos de comida de Natalia (bizcocho/cereal/fruta) mientras escribe |
| [01:50] | Formaliza el proceso: $X(n)=$ comida en la hora $n$; nota que el espacio de estados no son números, sino letras/categorías |
| [03:42] | Calcula $P(X(3)=F)$ con el árbol completo de probabilidades (caso no condicionado) |
| [04:21] | Observación clave: mirando el árbol, nota que el pasado remoto no influye, solo el paso inmediato anterior — germen de la propiedad de Markov |
| [06:52] | Repite el cálculo pero condicionado: $P(X(3)=F\mid X(1)=B)$, con árbol restringido |
| [08:30] | Enuncia formalmente la propiedad de Markov y la contrasta con el proceso de escritura de palabras de la unidad anterior, donde sí influía todo el pasado |
| [09:43] | Cadena de Markov = proceso de Markov con espacio de estados discreto; menciona que también existen versiones con parámetro/estado continuo |
| [11:20] | Define la matriz de transición $\mathbb{P}=(p_{ij})$ |
| [13:11] | Arma la matriz de transición concreta del ejemplo de Natalia |
| [13:44] | Diagrama de transición (grafo con nodos B/C/F y flechas pesadas) |
| [14:36] | Propiedades: las filas de $\mathbb{P}$ suman 1 (probabilidad total sobre destinos); las columnas NO tienen por qué sumar 1 |
| [16:41] | Deduce la fórmula de dos pasos usando probabilidad total + Markov, llegando a $(\mathbb{P}^2)_{ij}$ |
| [20:47] | Generaliza a $k$ pasos: $P(X(n+k)=s_j\mid X(n)=s_i)=(\mathbb{P}^k)_{ij}$ |
| [20:49] | Verifica los resultados de los árboles con $\mathbb{P}^2$ y calcula $\mathbb{P}^4$ para un ejemplo nuevo a 4 pasos |
| [23:26] | Introduce el vector de distribución $\vec p(n)$ y demuestra $\vec p(n+1)=\vec p(n)\,\mathbb{P}$ |
| [27:32] | Ejemplo numérico cerrando con vectores; advertencia final: $\mathbb{P}^k$ NO sirve para condicionar "pasado dado futuro" (resuelve ese caso con intersección/Bayes) |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto paso a paso.** El apunte teórico ya trae varios ejemplos
  resueltos (vendedor viajero, el bebé, la vida — ver
  [[cadenas-de-markov#Ejercicios resueltos|cadenas-de-markov]]), pero con otros
  enunciados. El video aporta un ejemplo **nuevo y completo**, hilado de punta a
  punta de la clase (mismo enunciado usado para introducir el proceso, la
  propiedad de Markov, la matriz, el diagrama, $\mathbb{P}^k$ y el vector de
  distribución): los hábitos de comida de Natalia. Se reproduce íntegro más
  abajo.
- **(a) Deducción "desde cero" de $(\mathbb{P}^2)_{ij}$.** El apunte da la fórmula
  de Chapman-Kolmogorov directamente; el video la **deduce** en el pizarrón con
  probabilidad total + propiedad de Markov (a partir de [16:41]), mostrando por
  qué la suma $\sum_k p_{ik}p_{kj}$ es literalmente el producto fila-por-columna
  que define $(\mathbb{P}^2)_{ij}$. Útil para quien necesite justificar el paso
  en un parcial en vez de solo aplicarlo.
- **(b) Intuición: qué distingue a una cadena de Markov de un proceso cualquiera.**
  El docente contrasta explícitamente este ejemplo con el proceso de escritura de
  palabras visto antes en la unidad ([08:30]), donde el valor de cada letra
  dependía de **todas** las anteriores (se promediaban probabilidades). Aquí, en
  cambio, alcanza con el estado inmediato anterior. Es la misma idea que ya está
  en [[cadenas-de-markov]], pero el video la construye visualmente: se ve en el
  árbol de probabilidades cómo dos ramas con distinto pasado remoto pero mismo
  penúltimo estado convergen en la misma probabilidad condicional ([04:21]).
- **(b) Por qué conviene pensar con matrices.** El docente comenta explícitamente
  ([12:46]-[13:14]) que trabajar con matrices y vectores es lo que hace viables
  los cálculos a largo plazo — motivación informal de por qué se usa álgebra
  lineal aquí y no en unidades anteriores.
- **(d) Énfasis explícito.** Remarca dos veces que **lo más importante para
  definir una cadena de Markov es la matriz/diagrama de transición**, no la
  distribución inicial ([11:20], [23:52]): una vez fijada la transición, la
  distribución inicial solo decide "desde dónde arranca" el mismo mecanismo.
- **(c) Advertencia de error común** — ver sección dedicada abajo. No está
  desarrollada en el apunte de la fuente [[teorica-cadenas-de-markov]] ni en
  [[cadenas-de-markov]]: se propone como aporte nuevo.

## Ejercicio resuelto en clase

*Ejemplo hilado de toda la clase, arrancando en [00:04]. Enunciado:*

> Natalia acompaña su escritura comiendo cada hora entre bizcocho ($B$), cereal
> ($C$) o fruta ($F$). La primera hora elige al azar entre las tres opciones
> (probabilidad $\tfrac13$ cada una). Luego:
> - Si comió bizcocho, la hora siguiente vuelve a comer bizcocho con
>   probabilidad $0.75$; el resto de las veces cambia a fruta.
> - Si comió cereal, la hora siguiente vuelve a comer cereal con probabilidad
>   $0.6$; el resto de las veces cambia a bizcocho.
> - Si comió fruta, la hora siguiente come cereal (con probabilidad $1$).

**Planteo.** Sea $X(n)=$ comida elegida en la hora $n$, con espacio de estados
$E=\{B,C,F\}$ (no son números — son categorías; ver
[[variable-aleatoria|variable aleatoria]] vs. este tipo de "estado valor" que no
lo es). Probabilidades iniciales $P(X(1){=}B)=P(X(1){=}C)=P(X(1){=}F)=\tfrac13$.
Transiciones:
$$ P(X(n{+}1){=}B\mid X(n){=}B)=0.75,\ \ P(X(n{+}1){=}F\mid X(n){=}B)=0.25, $$
$$ P(X(n{+}1){=}B\mid X(n){=}C)=0.4,\ \ P(X(n{+}1){=}C\mid X(n){=}C)=0.6, $$
$$ P(X(n{+}1){=}C\mid X(n){=}F)=1. $$

**(a) $P(X(3)=F)$ sin condicionar — [03:42].** Se arma el árbol completo de las
primeras tres horas y se identifican las dos ramas que terminan en $X(3)=F$:
la que pasa por $B,B$ y la que pasa por $C,B$. Como el condicionante de la
"segunda condicional" (una vez fijado $X(2)=B$) no depende de qué pasó en la
primera hora, cada rama se calcula multiplicando las probabilidades de
transición sin arrastrar el origen:
$$ P(X(3){=}F)=P(X(1){=}B)\cdot p_{BB}\cdot p_{BF}+P(X(1){=}C)\cdot p_{CB}\cdot p_{BF} $$
$$ =\tfrac13\cdot0.75\cdot0.25+\tfrac13\cdot0.4\cdot0.25=\frac{2875}{30000}=0.095833. $$

**(b) $P(X(3)=F\mid X(1)=B)$ — [06:52].** Al condicionar por el estado inicial,
el árbol se restringe a una sola rama de partida ($X(1)=B$), y ya no hace falta
"desarmar" el $\tfrac13$ inicial (se cancelaría igual si se lo incluyera y
dividiera):
$$ P(X(3){=}F\mid X(1){=}B)=p_{BB}\cdot p_{BF}=0.75\cdot0.25=\frac{1875}{10000}=0.1875. $$

**(c) Verificación con $\mathbb{P}^2$ y extensión a 4 pasos — [20:49].** Con
$$ \mathbb{P}=\begin{pmatrix}0.75&0&0.25\\0.4&0.6&0\\0&1&0\end{pmatrix}\ (\text{orden }B,C,F), $$
$$ \mathbb{P}^2=\begin{pmatrix}0.5625&0.25&0.1875\\0.54&0.36&0.1\\0.4&0.6&0\end{pmatrix}. $$
La entrada $(B,F)$ de $\mathbb{P}^2$ es $0.1875$: coincide con lo calculado en
(b) porque $P(X(3){=}F\mid X(1){=}B)=(\mathbb{P}^2)_{BF}$ (transición en 2 pasos
"hacia el futuro"). Con $\mathbb{P}^4=\mathbb{P}^2\times\mathbb{P}^2$ se obtiene
además $P(X(5){=}F\mid X(1){=}B)=(\mathbb{P}^4)_{BF}=0.1305$.

**(d) Con el vector de distribución — [23:26]-[29:57].** Con
$\vec p(1)=\big(\tfrac13,\tfrac13,\tfrac13\big)$,
$$ \vec p(3)=\vec p(1)\,\mathbb{P}^2=(0.500833,\ 0.403333,\ 0.095833), $$
$$ \vec p(5)=\vec p(1)\,\mathbb{P}^4=(0.537852,\ 0.327908,\ 0.13424). $$
La tercera coordenada de $\vec p(3)$ coincide con el resultado (a). Tomando en
cambio $\vec p(1)=(1,0,0)$ (certeza de arrancar en $B$) se recupera el resultado
(b): $\vec p(3)=(1,0,0)\,\mathbb{P}^2=(0.5625,\ 0.25,\ 0.1875)$.

**Resultado.** $P(X(3){=}F)=0.095833$; $P(X(3){=}F\mid X(1){=}B)=0.1875$;
$P(X(5){=}F\mid X(1){=}B)=0.1305$.

## Advertencias del docente

- **[30:17]-[32:39] — Error muy común: $\mathbb{P}^k$ solo sirve "hacia el
  futuro".** El docente advierte explícitamente ("ojo con esto, es un error
  recontracomún") que la búsqueda directa de una entrada de $\mathbb{P}^k$
  **solo** es válida cuando el condicionante es el estado más **pasado** y lo
  que se pregunta es un estado más **futuro** (p. ej. $P(X(3){=}F\mid
  X(1){=}B)=(\mathbb{P}^2)_{BF}$). **No** vale al revés: para calcular
  $P(X(1){=}B\mid X(3){=}F)$ (condicionante futuro, pregunta sobre el pasado) NO
  se puede leer directamente $(\mathbb{P}^2)_{FB}$ ni ningún atajo matricial
  simple. Hay que resolverlo con intersección dividido condicionante:
  $$ P(X(1){=}B\mid X(3){=}F)=\frac{P(X(3){=}F\mid X(1){=}B)\cdot P(X(1){=}B)}{P(X(3){=}F)}=\frac{0.1875\cdot\tfrac13}{0.095833}=\frac{15}{23}\approx0.6522, $$
  un valor que **no tiene nada que ver** con $(\mathbb{P}^2)_{FB}$. El docente
  recomienda: ante la duda de si un atajo matricial aplica, resolver siempre por
  intersección/condicionante — "es más largo, pero prefiero eso a que lo usen
  mal" ([31:24]).
- **[05:53]-[08:19] — Recordatorio de por qué se puede omitir el condicionante lejano.**
  Insiste en que, dentro de una intersección con dos condicionantes en cadena
  (p. ej. $P(X(3){=}F\mid X(2){=}B,X(1){=}C)$), el más lejano se puede tachar
  directamente por la propiedad de Markov — remarca que esto **no** valía en el
  ejemplo de escritura de palabras de la unidad anterior.

## Páginas del wiki que toca

- [[cadenas-de-markov]]
- [[procesos-estocasticos]]
- [[proceso-de-bernoulli]]
- [[proceso-de-poisson]]
- [[relacion-bernoulli-poisson]]
- [[caminata-aleatoria]]
- [[teorica-cadenas-de-markov]]
