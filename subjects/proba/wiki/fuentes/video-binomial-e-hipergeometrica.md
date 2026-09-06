---
titulo: "Video — Binomial e Hipergeométrica"
resumen: "Clase en video de Lucio Pantazis (unidad 3) que deriva la binomial y la hipergeométrica a partir de un mismo juego de urna resuelto con y sin reposición; incluye la demostración de $E(X)=np$, $V(X)=npq$ y la aproximación entre ambas."
tipo: fuente
formato: video
unidad: 3
url: "https://youtu.be/Om5_V59TvrQ"
duracion: "60:39"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Binomial e Hipergeométrica

**Qué es:** clase grabada donde el docente introduce las distribuciones binomial
e hipergeométrica como "estructuras conocidas" a partir de un único ejemplo
(un juego de casino con una urna) resuelto primero con reposición y luego sin
reposición.
**Cubre:** distribución [[distribucion-binomial|Binomial]] (PMF, recorrido,
demostración completa de $E[X]=np$ y $V(X)=npq$), relación con
[[distribucion-bernoulli|Bernoulli]], distribución
[[distribucion-hipergeometrica|Hipergeométrica]] (PMF, recorrido, esperanza y
varianza) y su aproximación por la binomial.
**Guía asociada:** Guía 3.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:05] | Repaso: de cualquier v.a. se puede sacar recorrido, PMF, media y varianza; motivación de reconocer "estructuras conocidas" para ahorrar ese trabajo |
| [01:40] | Planteo del ejemplo: urna de 10 bolitas (4 azules, 6 verdes) y juego de casino — ganar 1 peso si sale azul, perder la apuesta de 3 pesos si no; Agustina juega 5 veces **con reposición** |
| [03:44] | Definición de las variables $B$ (bolitas azules extraídas) y $G$ (ganancia del casino), con $G=G(B)$ como función de $B$ |
| [07:09] | Recorrido y PMF de $B$ con reposición: $P(B=k)=\binom{5}{k}(2/5)^k(3/5)^{5-k}$ |
| [11:35] | Cálculo explícito, sumando término a término, de $E(B)=2$ y $V(B)=6/5$ |
| [13:55] | Cálculo de $E(G)=7$ y $V(G)=96/5$ usando linealidad de $E$ y $V$, sin recalcular la distribución de $G$ desde cero |
| [17:27] | Generalización: se nombra la "estructura binomial" y se define formalmente $X\sim\text{Bi}(n,p)$ |
| [21:04]–[22:05] | Características de la binomial: recorrido $\{0,\dots,n\}$ y PMF $\binom{n}{k}p^kq^{n-k}$ |
| [22:05]–[29:23] | Demostración completa, paso a paso, de $E(X)=np$ y $V(X)=npq$ usando el binomio de Newton |
| [29:38] | Comentario: la Bernoulli es el caso particular $\text{Bi}(1,p)$; notación $q=1-p$ |
| [32:01] | Mismo juego pero **sin reposición**: se repite el planteo de $B$ y $G$ |
| [33:20]–[36:00] | Recorrido y PMF de $B$ sin reposición: $P(B=k)=\dfrac{\binom{4}{k}\binom{6}{5-k}}{\binom{10}{5}}$, $\mathcal R_B=\{0,1,2,3,4\}$ |
| [37:00]–[40:08] | Cálculo de $E(B)=2$, $V(B)=2/3$; $E(G)=7$ (igual que antes), $V(G)=32/3$ (menor que con reposición) |
| [40:09] | Generalización: se nombra la "variable hipergeométrica" $X\sim\mathcal H(N,M,n)$ |
| [42:51]–[48:07] | Comentarios sobre el recorrido de la hipergeométrica: cómo razonar el máximo $\min\{n,M\}$ y el mínimo $\max\{n-(N-M),0\}$ en vez de memorizarlos |
| [50:16]–[53:25] | Bosquejo de por qué las probabilidades de la hipergeométrica suman 1 (justificación combinatoria, sin demostración formal completa) |
| [56:12] | Coincidencia de $E$ y $V$ entre Hipergeométrica($N,M,n$) y Binomial($n,M/N$) cuando se toma $p=M/N$ |
| [58:19]–[60:37] | Aproximación numérica hipergeométrica $\approx$ binomial: ejemplo con $N=1000$, $M=400$, comparando $n=5$ (aproximación buena) contra $n=100$ (aproximación se degrada) |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto que no está en los apuntes.** El apunte de
  [[binomial-apunte]] y de [[hipergeometrica-apunte]] derivan la PMF en
  abstracto; este video arma un **único experimento** (la urna del casino) y lo
  resuelve completo dos veces —con y sin reposición— incluyendo una variable
  derivada $G$ (ganancia). Ese ejercicio completo se reproduce abajo en
  "Ejercicio resuelto en clase".
- **(a) Comparación numérica de la aproximación hipergeométrica → binomial.**
  [[hipergeometrica-apunte]] solo enuncia la proposición límite
  ($M_N/N\to p \Rightarrow P(X_N=k)\to \text{Bi}(n,p)$); el video la ilustra con
  números concretos ($N=1000$, $M=400$) mostrando que para $n=5$ las
  probabilidades casi coinciden, pero para $n=100$ ya difieren de forma
  apreciable. Ilustración numérica agregada en [[distribucion-hipergeometrica]]
  (sección "Relaciones con otras distribuciones").
- **(b) Intuición de "estructuras conocidas".** El hilo conductor de la clase
  ([00:05]) es una idea de estrategia general para el parcial: si se reconoce
  que una variable sigue un patrón ya estudiado (binomial, hipergeométrica,
  etc.), el recorrido, la PMF, la esperanza y la varianza ya están resueltos de
  antemano y no hace falta recalcularlos desde cero. Esto es exactamente lo que
  organiza [[reconocer-distribucion-discreta]], aquí presentado como motivación
  antes de ver las distribuciones puntuales.
- **(b) Intuición para el recorrido de la hipergeométrica.** En vez de memorizar
  $\mathcal R_X=\{\max\{n-(N-M),0\},\dots,\min\{n,M\}\}$, el docente insiste en
  razonarlo ([47:26]–[48:07]): preguntarse cuántos elementos interesantes se
  pueden extraer como mucho (lo que se termina antes, entre $n$ y $M$) y cuántos
  se van a extraer sí o sí (si los elementos "no interesantes" $N-M$ son pocos
  respecto de $n$).
- **(c) Advertencia explícita sobre qué no hace falta memorizar.** Al llegar a
  la demostración formal de $E(X)=np$ y $V(X)=npq$ de la binomial, el docente
  dice textualmente que no quiere darle tanto énfasis a esa cuenta ([22:14]) —
  la deja completa en la slide pero aclara que el resultado ($np$, $npq$) es lo
  que hay que saber usar, no reproducir la demostración.
- **(d) Comentario aparte sobre ludopatía.** Al calcular que el casino gana en
  promedio 7 pesos por noche jugada ([15:06]–[16:33]), el docente hace una
  digresión no matemática: el negocio del casino no depende de ganarle a cada
  jugador individual sino de la repetición masiva (la ley de los grandes
  números aplicada informalmente), y advierte que esto no es una excusa para
  fomentar el juego. Es color de clase, no contenido evaluable.

## Ejercicio resuelto en clase

**Enunciado** (planteado por el docente desde [01:40]). Un casino tiene una urna
con 10 bolitas: 4 azules y 6 verdes. El juego consiste en sacar una bolita al
azar; si es azul, el jugador gana 1 peso, y si no, pierde la apuesta de 3 pesos.
Agustina juega 5 veces en una noche. Sea $B$ la cantidad de bolitas azules
extraídas en las 5 extracciones y $G$ la ganancia del casino luego de las 5
apuestas. Se pide analizar $B$ y $G$: (i) considerando extracciones **con
reposición**, y (ii) considerando extracciones **sin reposición** (partiendo
siempre de la urna con 4 azules y 6 verdes).

**Planteo.** Si $B=k$ bolitas azules salieron, Agustina ganó $k$ pesos (uno por
cada azul) y perdió $3$ pesos en cada una de las $5-k$ extracciones sin azul.
La ganancia del casino es lo contrario:
$$ G = 3\cdot(5-B) - 1\cdot B = 15 - 4B $$

### (i) Con reposición

Cada extracción es independiente con $p=P(A_i)=2/5$ (probabilidad de bolita
azul) constante $\Rightarrow$ estructura **binomial**, $B\sim\text{Bi}(5,\,2/5)$.

$$ \mathcal R_B=\{0,1,2,3,4,5\}, \qquad P(B=k)=\binom{5}{k}\left(\frac25\right)^k\left(\frac35\right)^{5-k} $$

**Cálculo.**
$$ E(B) = \sum_{k=0}^{5} k\cdot P(B=k) = 2 $$
$$ E(B^2) = \sum_{k=0}^{5} k^2\cdot P(B=k) = \frac{26}{5} \;\Rightarrow\; V(B) = E(B^2)-E(B)^2 = \frac{26}{5}-4 = \frac65 \;\Rightarrow\; \sigma(B)=\sqrt{\tfrac65} $$

(Estos valores coinciden con $E(B)=np=5\cdot\tfrac25=2$ y
$V(B)=npq=5\cdot\tfrac25\cdot\tfrac35=\tfrac65$, como debe ser por ser $B$
binomial — ver [[distribucion-binomial]].)

Por linealidad de $E$ y $V$ (constantes salen al cuadrado en la varianza, y no
la afectan al trasladar):
$$ E(G) = E(15-4B) = 15 - 4\,E(B) = 15 - 4\cdot 2 = 7 $$
$$ V(G) = V(15-4B) = 4^2\cdot V(B) = 16\cdot\frac65 = \frac{96}{5} \;\Rightarrow\; \sigma(G)=\sqrt{\tfrac{96}{5}} $$

**Interpretación.** El casino gana en promedio 7 pesos por noche que Agustina
juega. Si jugara 1000 noches, el casino ganaría alrededor de 7000 pesos; si
jugara 1.000.000 de noches, alrededor de 7.000.000. El negocio del casino está
en la repetición masiva, no en ganarle a cada jugador puntual.

### (ii) Sin reposición

Ahora las extracciones no son independientes (la probabilidad de sacar azul
cambia según lo ya extraído) $\Rightarrow$ estructura **hipergeométrica**,
$B\sim\mathcal H(N=10,\,M=4,\,n=5)$.

El máximo de $B$ ya no es 5: solo hay 4 bolitas azules en la urna, así que como
mucho se pueden extraer 4. Por lo tanto:
$$ \mathcal R_B=\{0,1,2,3,4\}, \qquad P(B=k)=\frac{\binom{4}{k}\binom{6}{5-k}}{\binom{10}{5}} $$

**Cálculo.**
$$ E(B) = \sum_{k=0}^{4} k\cdot P(B=k) = 2 $$
$$ E(B^2) = \sum_{k=0}^{4} k^2\cdot P(B=k) = \frac{14}{3} \;\Rightarrow\; V(B) = \frac{14}{3}-4 = \frac23 \;\Rightarrow\; \sigma(B)=\sqrt{\tfrac23} $$

Nuevamente estos valores coinciden con la fórmula general de
[[distribucion-hipergeometrica]]: $E(B)=n\,\tfrac MN = 5\cdot\tfrac{4}{10}=2$ y
$V(B)=n\,\tfrac MN\left(\tfrac{N-M}N\right)\tfrac{N-n}{N-1} = 5\cdot0{,}4\cdot0{,}6\cdot\tfrac59 = \tfrac23$.

Para $G=15-4B$ (misma función que antes):
$$ E(G) = 15 - 4\,E(B) = 15 - 4\cdot 2 = 7 $$
$$ V(G) = 4^2\cdot V(B) = 16\cdot\frac23 = \frac{32}{3} \;\Rightarrow\; \sigma(G)=\sqrt{\tfrac{32}{3}} $$

**Resultado y comparación.** En ambos casos $E(G)=7$: el casino gana lo mismo
en promedio, con o sin reposición. Pero la varianza sin reposición
($V(G)=32/3\approx10{,}67$) es **menor** que con reposición ($V(G)=96/5=19{,}2$): al no
reponer, cada extracción da información sobre las que quedan (extracciones
negativamente correlacionadas), así que el resultado final se dispersa menos.
Esto es el mismo fenómeno del **factor de corrección por población finita**
documentado en [[distribucion-hipergeometrica]]: la ganancia del casino es aún
más previsible (menos varianza) sin reposición. El docente lo señala en el video
([39:04]–[39:18]): al tener menos varianza, la ganancia del casino tiene menos
chances de irse para el lado negativo.

## Advertencias del docente

- Al llegar a la demostración formal de $E(X)=np$ para la binomial, aclara que
  no quiere darle tanto énfasis a esa cuenta ([22:14]–[22:16]): lo importante
  para usar en un ejercicio es el resultado $E(X)=np$, $V(X)=npq$, no reproducir
  la demostración con el binomio de Newton.
- Sobre el recorrido de la hipergeométrica, insiste varias veces en que **no
  hay que memorizar la fórmula** $\{\max\{n-(N-M),0\},\dots,\min\{n,M\}\}$ tal
  cual, sino razonar en cada ejercicio cuántos elementos interesantes se pueden
  extraer como mucho y cuántos se van a extraer sí o sí ([47:26]–[48:07]): "más que
  acordarse esta fórmula, ustedes tienen que pensar en qué puede llegar a pasar
  con el experimento".
- Advierte que la aproximación hipergeométrica $\approx$ binomial deja de
  tener sentido cuando el tamaño de muestra $n$ no es chico respecto de la
  población $N$: con $N=1000$, $M=400$, la aproximación es buena para $n=5$
  pero ya se nota la diferencia en el primer o segundo decimal para $n=100$
  ([59:53]–[60:30]).

## Páginas del wiki que toca

- [[distribucion-binomial]]
- [[distribucion-hipergeometrica]]
- [[distribucion-bernoulli]]
- [[reconocer-distribucion-discreta]]
- [[esperanza]]
- [[varianza]]
- [[variable-aleatoria]]
