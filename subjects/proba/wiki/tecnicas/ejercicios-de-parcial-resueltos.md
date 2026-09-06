---
titulo: Ejercicios de parcial resueltos (probabilidad)
resumen: "Ejercicios de parcial y final de probabilidad y procesos resueltos paso a paso: variables mixtas, Poisson, cadenas de Markov, distribuciones conjuntas y transformaciones. Entrenan el reconocimiento del método que dispara cada enunciado."
tipo: tecnica
unidad: eval
orden: 1
tags: [parcial, ejercicios, probabilidad, procesos]
fuentes: ["[[evaluaciones]]"]
actualizado: 2026-06-06
---

# Ejercicios de parcial resueltos (probabilidad)

**En breve.** Banco de ejercicios de parcial/final resueltos paso a paso para la
parte de probabilidad y procesos: sirve para entrenar el **reconocimiento del
método** (qué herramienta dispara cada enunciado) más que para memorizar números.

Selección de ejercicios **resueltos paso a paso** sacados de los PDFs con
resolución de [[evaluaciones]]. Esta página cubre **probabilidad y procesos**
(v.a. mixtas, Poisson, Markov, conjuntas, transformaciones). La parte de
**estadística** (estimación, IC, test) está en
[[ejercicios-de-parcial-resueltos-estadistica]].

> Varios parciales 2025 usan un parámetro $K$ (el dígito del legajo) en los
> enunciados. Aquí fijamos un valor o dejamos el planteo general; lo importante
> es el **método**, no el número.

---

## Ej. 1 — Variable aleatoria mixta por probabilidad total

**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ejercicio 1 (Tomás estudia).

**Enunciado (resumido).** La cantidad de horas $X$ que estudia Tomás depende de
su estado:
- Si duerme mal ($D$): $X_D \sim \mathcal{U}(a, b)$.
- Si come mucho ($C$): $X_C \sim \mathcal{E}(\lambda)$.
- En el resto de los casos ($N$): $X_N \sim \mathcal{N}(\mu, \sigma)$.

con $P(D), P(C), P(N)$ dados. Calcular $P(X > E[X])$ y el desvío de $X$.

**Planteo (la idea clave).** $X$ es una **mezcla**: no es discreta ni continua
"pura", pero **sí es continua**. La herramienta es la **probabilidad total
aplicada a la FDA** ([[funcion-de-distribucion-acumulada]]):
$$ F_X(t) = F_{X_D}(t)\,P(D) + F_{X_C}(t)\,P(C) + F_{X_N}(t)\,P(N). $$
Derivando, la densidad también se mezcla:
$$ f_X(x) = f_{X_D}(x)\,P(D) + f_{X_C}(x)\,P(C) + f_{X_N}(x)\,P(N). $$

**Cálculo de la esperanza.** Por linealidad, la esperanza de la mezcla es el
promedio ponderado de las esperanzas:
$$ E[X] = P(D)\,E[X_D] + P(C)\,E[X_C] + P(N)\,E[X_N] = \mu_X. $$
Luego $P(X > \mu_X) = 1 - F_X(\mu_X)$, evaluando cada $F_{X_i}$ en $\mu_X$.

**Desvío — error típico.** El desvío **NO** se mezcla como las esperanzas
($\sigma_X \ne \sum p_i \sigma_i$). Lo que sí vale es la mezcla para el **momento
de segundo orden**:
$$ E[X^2] = \sum_i P(i)\,E[X_i^2] = \sum_i P(i)\big(V(X_i) + E[X_i]^2\big), $$
y solo después $V(X) = E[X^2] - E[X]^2$, $\sigma_X = \sqrt{V(X)}$.

**Intuición.** Piense en la mezcla como "elegir primero una urna" (con prob.
$P(D), P(C), P(N)$) y "después sacar de la urna elegida". Lo **lineal** (densidad,
FDA, momentos $E[X^k]$) se promedia con esos pesos porque es una esperanza más.
El **desvío** no es lineal (lleva una raíz), por eso no se promedia: además del
"spread" interno de cada urna, aparece la variabilidad de *qué urna salió*.

**Moraleja.** Para mezclas: la **densidad/FDA y los momentos** se promedian con
los pesos $P(i)$; los **desvíos no**. Ver [[mezcla-de-distribuciones|mezcla de distribuciones]], [[varianza]] y [[esperanza]].

---

## Ej. 2 — Proceso de Poisson: condicional, incrementos y Erlang

**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 2 (el desarrollo de abajo). El
`2025Q2_Parcial_Resolución.pdf` Ej. 2 es **otro** proceso de Poisson, con el mismo
método (condicional por incrementos independientes + equivalencia $T_k\!\leftrightarrow\!N$).

**Enunciado (final 05/12).** Los tiempos entre toses son exponenciales i.i.d. de
parámetro $\lambda = \tfrac{1}{12}\,\text{min}^{-1}$. Sea $N(t)$ el proceso de
Poisson asociado.
(a) Sabiendo que en los primeros 40 min tosió 4 veces, calcular
$P(N(20)=1 \mid N(40)=4)$ y $P(T_5 < 45)$.
(b) ¿Cuántos minutos monitorear para que $P(N(t)\ge 50) > 0.9$?

**Planteo (a) — condicional dentro de un Poisson.**
$$ P(N(20)=1 \mid N(40)=4) = \frac{P(N(20)=1 \cap N(40)-N(20)=3)}{P(N(40)=4)}. $$
Como los **incrementos son independientes**, el numerador factoriza:
$$ = \frac{P(N(20)=1)\,P(N(40)-N(20)=3)}{P(N(40)=4)}. $$
Con $N(20)\sim Po(20\lambda)=Po(\tfrac{5}{3})$ y, por **incrementos
estacionarios**, $N(40)-N(20)\sim Po(\tfrac{5}{3})$, $N(40)\sim Po(\tfrac{10}{3})$.
La cuenta da el equivalente a una binomial:
$$ = \binom{4}{1}\Big(\tfrac{1}{2}\Big)^1\Big(\tfrac{1}{2}\Big)^3 = \tfrac{1}{4}. $$

**Planteo (a, 2da parte) — Erlang vía Poisson.** $T_5$ (instante de la 5ª tos)
es [[distribucion-erlang|Erlang]]/$\Gamma(5,\lambda)$. En vez de integrar la Gamma, se usa la
**equivalencia de sucesos** con el proceso de conteo:
$$ P(T_5 < 45) = P(N(45) \ge 5) = 1 - P(N(45) \le 4), \quad N(45)\sim Po(45\lambda). $$

**Intuición — el truco que aparece una y otra vez.** "La 5ª tos llegó antes de
$t$" y "hubo al menos 5 toses hasta $t$" son **el mismo suceso** vistos del lado
del tiempo ($T_5$, continuo) o del lado del conteo ($N(t)$, discreto). Convertir
una pregunta sobre tiempos (Erlang/Gamma, que obliga a integrar) en una pregunta
sobre conteos (Poisson, que se suma con la PMF) suele ser muchísimo más barato.

**Planteo (b) — buscar el tiempo $t$.** Para $\lambda t$ grande,
$N(t)\sim Po(\lambda t) \approx \mathcal{N}(\lambda t, \sqrt{\lambda t})$ (TCL).
Con corrección por continuidad:
$$ P(N(t)\ge 50) \approx 1 - \Phi\!\left(\frac{49.5 - t/12}{\sqrt{t/12}}\right) > 0.9. $$
Esto lleva a $z_{0.1} = -z_{0.9} \ge \frac{49.5 - t/12}{\sqrt{t/12}}$, una
**cuadrática en $\sqrt{t}$**. Se resuelve, se descarta la raíz negativa y se
verifica: $t \approx 712.5$ min.

Ver [[proceso-de-poisson]], [[distribucion-poisson]], [[distribucion-exponencial]], [[distribucion-erlang]], [[procesos-estocasticos]].

---

## Ej. 3 — Cadena de Markov regular: distribución estacionaria

**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ej. 3 (comidas: Bizcochos, Cereal, Fruta).

**Enunciado (resumido).** $X(n)$ = comida en la hora $n$, estados $\{B,C,F\}$,
matriz de transición $\mathbb{P}$ dada. (a) $P(X(3)=F\mid X(1)=C)$. (b)
$P(X(1)=C\mid X(3)=F)$. (c) Probabilidad a largo plazo de comer bizcochos.

**Planteo (a) — "a futuro" con $\mathbb{P}^2$.** Pasar de $C$ a $F$ en 2 pasos
es la entrada $(C,F)$ de $\mathbb{P}^2$: multiplicar la fila $C$ por la columna
$F$ de $\mathbb{P}$.

**Intuición.** La entrada $(i,j)$ de $\mathbb{P}^k$ es la probabilidad de ir de
$i$ a $j$ en exactamente $k$ pasos. El producto de matrices no es más que la
**probabilidad total** sobre todos los estados intermedios posibles: la fila por
la columna suma "ir a un intermedio y desde ahí al destino" sobre cada camino.

**Planteo (b) — "hacia atrás" con Bayes.** La matriz solo sirve hacia adelante.
Para invertir el tiempo se usa [[probabilidad-total-y-bayes|Bayes]]:
$$ P(X(1)=C\mid X(3)=F) = \frac{P(X(3)=F\mid X(1)=C)\,P(X(1)=C)}{\sum_i P(X(3)=F\mid X(1)=i)\,P(X(1)=i)}. $$
Si la inicial es uniforme, $P(X(1)=i)=\tfrac13$ se cancela y queda solo el
cociente de las transicionales a 2 pasos.

**Planteo (c) — distribución estacionaria.** Primero se verifica que la cadena
es **regular** (alguna potencia $\mathbb{P}^k$ tiene todas las entradas
positivas: aquí $\mathbb{P}^2$ casi todas, $\mathbb{P}^4$ todas). Entonces existe
$\vec\pi$ única con
$$ \vec\pi = \vec\pi\,\mathbb{P}, \qquad \sum_i \pi_i = 1. $$
Se arma el sistema (descartando una ecuación por dependencia lineal) y se
resuelve. Ver [[cadenas-de-markov]].

---

## Ej. 4 — Cadena de Markov con estado absorbente

**Fuente:** `09 - Segundo Parcial.pdf`, Ej. 5 (sobrepeso/obesidad/muerte) y
`Resolución_Examen_15_12_TemaA.pdf`, Ej. 3 (medicación).

**Enunciado (2do parcial 2024).** Estados $N$ (normal), $S$ (sobrepeso), $O$
(obeso), $M$ (muerto). $M$ es **absorbente**. (b) ¿Hay distribución a largo
plazo? (c) Esperanza de vida de un adulto con peso normal.

**Planteo (b).** Cuando hay **un único estado absorbente alcanzable desde todos
los demás**, la cadena NO es regular pero **sí tiene distribución a largo
plazo**: a la larga todo termina en el absorbente, así que
$\vec\pi = (1,0,0,0)$ concentrada en $M$ (sin importar el estado inicial).

**Planteo (c) — tiempo medio de absorción.** Se ordena $\mathbb{P}$ separando el
absorbente y se toma $Q$ = submatriz de transiciones entre estados transitorios.
La **matriz fundamental** es
$$ (I - Q)^{-1}, $$
cuya entrada $(i,j)$ es el número esperado de visitas al estado $j$ partiendo de
$i$. **Sumando la fila** correspondiente al estado inicial se obtiene el tiempo
medio total hasta la absorción (la "esperanza de vida"). Ver [[cadenas-de-markov]].

**Variante por complemento — "no absorbido en $k$ pasos".**
**Fuente:** `Resolución_Examen_15_12_TemaA.pdf`, Ej. 3 (medicación: Paracetamol /
Ibuprofeno / Ninguno).

**Enunciado.** $X(n)$ = pastilla tomada en la $n$-ésima dosis (cada **8 h**),
$E=\{P,I,N\}$. $N$ ("se terminan los síntomas") es **absorbente**.
$$ \mathbb{P}=\begin{pmatrix} 0.25 & 0.45 & 0.3 \\ 0.6 & 0.3 & 0.1 \\ 0 & 0 & 1 \end{pmatrix}, \qquad \vec\pi^{(0)}=(\tfrac12,\tfrac12,0). $$
Calcular la probabilidad de que tarde **más de 16 h** (desde la 1ª pastilla) hasta
que se terminan los síntomas.

**Planteo — la clave es traducir el tiempo a pasos.** $16\text{ h}/8\text{ h}=2$
dosis. "Tardar más de 16 h" $\Leftrightarrow$ **no llegar al absorbente $N$ en las
primeras 2 transiciones** $\Leftrightarrow X(1)\ne N \ \wedge\ X(2)\ne N$. Por el
**complemento**:
$$ P(\text{tardar}>16) = 1 - P(X(1)=N) - P\big(X(1)\ne N \cap X(2)=N\big), $$
(los dos sucesos a restar son mutuamente excluyentes: o se absorbe en el paso 1,
o no se absorbe en el 1 pero sí en el 2). Desarrollando con $\vec\pi^{(0)}$:
$$ = 1 - \underbrace{0.5\cdot 0.3 - 0.5\cdot 0.1}_{X(1)=N}
        - \underbrace{0.5\cdot 0.25\cdot 0.3 - 0.5\cdot 0.45\cdot 0.1
        - 0.5\cdot 0.6\cdot 0.3 - 0.5\cdot 0.3\cdot 0.1}_{X(1)\ne N,\ X(2)=N} = 0.635. $$

**Distribución a largo plazo.** Como $N$ es **el único absorbente** y es accesible
desde todos los estados, la cadena no es regular pero tiene límite
$\vec\pi=(0,0,1)$: a la larga todo termina en $N$, sin importar el estado inicial.

> **Patrón.** Cuando piden "P(no absorbido en $k$ pasos)" conviene el complemento
> $1-P(\text{absorbido en }\le k)$, no la matriz fundamental (esa da el tiempo
> **medio**, no la probabilidad a horizonte fijo). Es un patrón distinto al de la
> esperanza de vida de más arriba.

---

## Ej. 5 — Densidad conjunta continua: normalización y condicionales

**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ej. 4 y
`2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 5 (carga viral).

**Enunciado (final 05/12).** Densidad conjunta
$$ f_{TX}(t,x) = \begin{cases} \tfrac{3}{160}\,t\,x & 0\le t\le 4,\ 1\le x\le t+1 \\ 0 & \text{c.c.} \end{cases} $$
Si $X = \log_{10}(C)$: (a) $P(X\le 3)$ y $P(X\le 3 \mid T>2)$. (b) $P(C>1000)$.

**Planteo — clave: dibujar la región.** El soporte es triangular ($1\le x \le
t+1$, $0\le t \le 4$). La constante ya está dada (se verifica integrando $=1$).
Para $P(X\le 3)$ conviene el complemento:
$$ P(X\le 3) = 1 - P(X>3) = 1 - \int_{2}^{4}\!\!\int_{3}^{t+1} \tfrac{3}{160}\,t\,x \,dx\,dt, $$
ojo con los **límites**: $X>3$ exige $t+1 > 3 \Rightarrow t > 2$, por eso la
integral en $t$ arranca en 2. Resultado $\approx 43/80$.

**Planteo — condicional.** $P(X\le 3\mid T>2)$ es un cociente de integrales sobre
la región recortada por $t>2$:
$$ P(X\le 3\mid T>2) = \frac{\displaystyle\int_2^4\!\!\int_1^{3} \tfrac{3}{160}txdx\,dt}{\displaystyle\int_2^4\!\!\int_1^{t+1}\tfrac{3}{160}txdx\,dt}. $$

**Planteo (b) — volver a $C$.** $C>1000 \Leftrightarrow 10^X > 10^3
\Leftrightarrow X>3$, así que $P(C>1000) = P(X>3) = 1 - P(X\le 3) = 37/80$.

Ver [[variables-aleatorias-bidimensionales]], [[funcion-de-variable-aleatoria]].

---

## Ej. 6 — Transformación de variable aleatoria continua

**Fuente:** `09 - Segundo Parcial.pdf`, Ej. 4 (precio de pañales).

**Enunciado.** $D\sim\mathcal{U}(0,1)$ y $Q = 10D^2 + 2$. (a) $E[Q]$ y $V(Q)$.
(b) Densidad $f_Q$.

**Planteo (a) — momentos sin hallar $f_Q$.** Usar
[[esperanza|esperanza de una función de v.a.]] directamente:
$$ E[Q] = 10E[D^2] + 2, \qquad E[D^2]=\int_0^1 x^2dx = \tfrac13 \Rightarrow E[Q]=\tfrac{16}{3}. $$
$$ E[Q^2] = 100E[D^4] + 40E[D^2] + 4, \qquad E[D^4]=\tfrac15, $$
y $V(Q) = E[Q^2] - E[Q]^2 = \tfrac{9400}{45} \approx 208.89$.

**Planteo (b) — método de la FDA.** Para $q\in(2,12)$:
$$ F_Q(q) = P(10D^2+2 \le q) = P\!\left(D \le \sqrt{\tfrac{q-2}{10}}\right) = \sqrt{\tfrac{q-2}{10}}, $$
(válido porque $D\ge 0$). Derivando,
$$ f_Q(q) = \frac{1}{2\sqrt{10(q-2)}}, \quad q\in(2,12); \quad 0 \text{ c.c.} $$

Ver [[funcion-de-variable-aleatoria]], [[distribucion-uniforme-continua]], [[funcion-de-densidad]].

---

## Ej. 7 — Hipergeométrica vs Binomial (con/sin reposición)

**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 3 (pastillas) y
`11 - Final.pdf`, Ej. 4 (facturas).

**Enunciado (final 05/12).** Cajón con 3 tabletas de 20 pastillas de Paracetamol
(60) y 2 de 10 de Ibuprofeno (20). Cada **8 h** se toma una dosis. (a) Eligiendo
una **tableta** al azar y reponiéndola cada vez → cada dosis es Paracetamol con
$p = 3/5$. Calcular $P(X\ge 6)$ del nº de Paracetamol **en 72 h (9 dosis)**, y
$E,\sigma$ del nº de Paracetamol **en 48 h (6 dosis)**. (b) Repetir con todas las
pastillas **mezcladas** (sin reposición).

**Planteo — reconocer la distribución y cuidar el horizonte temporal.**
- (a) Cada extracción es **independiente** con $p=3/5$ fijo. Hay dos horizontes
  distintos en el enunciado:
  - $72\text{ h} = 9$ dosis ⇒ $X_9 \sim \text{Bi}(9, 3/5)$, y
    $P(X_9\ge 6)=\sum_{i=6}^{9}\binom{9}{i}(3/5)^i(2/5)^{9-i}\approx 0.4826$.
  - $48\text{ h} = 6$ dosis ⇒ $X_6 \sim \text{Bi}(6, 3/5)$, con
    $$ E[X_6]=6\cdot\tfrac35=\tfrac{18}{5}=3.6, \qquad
       \sigma(X_6)=\sqrt{6\cdot\tfrac35\cdot\tfrac25}=\tfrac{6}{5}=1.2. $$
  > Cuidado: $E,\sigma$ se piden para **6 dosis** (48 h), no para las 9 dosis de
  > $P(X\ge 6)$. Usar $n=9$ aquí daría $E=27/5$, que es el horizonte equivocado.
- (b) Se sacan dosis de un pool finito de 80 pastillas (60 "éxitos") **sin
  reposición**. Mismo desdoblamiento: $Y_9 \sim \mathcal{H}(80,60,9)$ para
  $P(Y_9\ge 6)\approx 0.8469$, y $Y_6 \sim \mathcal{H}(N{=}80, K{=}60, n{=}6)$ para
  $E,\sigma$:
  $$ E[Y_6] = n\tfrac{K}{N}=\tfrac92, \qquad \sigma(Y_6) = \sqrt{n\tfrac{K}{N}\tfrac{N-K}{N}\tfrac{N-n}{N-1}}\approx 1.0265, $$
  donde $\tfrac{N-n}{N-1}$ es el **factor de corrección por población finita**.

**Moraleja.** "Con reposición / pool infinito" → [[distribucion-binomial|Binomial]];
"sin reposición de un pool finito" → [[distribucion-hipergeometrica|Hipergeométrica]].
Cuando $N$ es enorme frente a $n$, la hipergeométrica se aproxima por la binomial.

---

## Ej. 8 — Probabilidad total + Bayes (sistema de rutas)

**Fuente:** `03 - Primer Parcial.pdf`, Ej. 3.

**Enunciado.** Rutas 1 y 2 confluyen en la ruta 3. $P(\text{cong. 1})=0.1$,
$P(\text{cong. 2})=0.3$, $P(1\mid 2)=0.33$. La ruta 3 se congestiona con prob.
1, 0.15, 0.1 según haya 2, 1 o 0 rutas congestionadas. (a) $P(\text{cong. 3})$.
(b) $P(1\cap 2 \mid 3)$.

**Planteo (a) — partición por nº de rutas congestionadas.** Definir los eventos
de la **partición**: ambas, exactamente una, ninguna. Con $P(1\cap 2) = P(1\mid
2)P(2) = 0.33\cdot 0.3 = 0.099$ se arma la partición y se aplica
[[probabilidad-total-y-bayes|probabilidad total]]:
$$ P(C_3) = \sum_{\text{escenarios}} P(C_3\mid \text{esc.})\,P(\text{esc.}) = 0.1992. $$

**Planteo (b) — Bayes.**
$$ P(1\cap 2 \mid C_3) = \frac{P(C_3\mid 1\cap 2)\,P(1\cap 2)}{P(C_3)} = \frac{1\cdot 0.099}{0.1992} \approx 0.497. $$

Ver [[probabilidad-total-y-bayes]], [[independencia]].

---

## Ej. 9 — V.a. discreta por árbol + suma i.i.d. (TCL)

**Fuente:** `Resolución_Examen_15_12_TemaA.pdf`, Ej. 2 (pañuelos).

**Enunciado.** Caja con 10 pañuelos nuevos. Cada vez que estornuda, agarra uno al
azar, lo usa y lo devuelve. Un pañuelo usado queda **reutilizable** el 60% de las
veces (entonces sirve **una** vez más y luego queda inutilizable) y queda
**inutilizable** el otro 40%. Si agarra uno inutilizable, sigue extrayendo hasta
agarrar uno nuevo o reutilizable. En una hora estornuda **2 veces**.
(a) $E[M]$ y $\sigma(M)$ del nº $M$ de pañuelos inutilizables tras una hora.
(b) Si cada hora le reponen la caja (10 nuevos, 2 estornudos/hora), ¿cuántas horas
para acumular $\ge 100$ inutilizables con probabilidad $> 0.92$?

**Planteo (a) — armar la v.a.d. con un [[arbol-de-probabilidades|árbol]].** Definir eventos por extracción:
$N_i$ (agarra nuevo), $R_i$ (reutilizable), $I_i$ (queda inutilizable), con
$P(I_i\mid N_i)=0.6$ y $P(I_i\mid R_i)=1$. **El primer pañuelo siempre es nuevo**
($P(N_1)=1$). $M\in\{0,1,2\}$ es discreta. Recorriendo las ramas del árbol:
$$ P(M{=}1) = \underbrace{0.6\cdot 1\cdot 0.4}_{I_1,\ \bar I_2}
            + \underbrace{0.4\cdot \tfrac1{10}\cdot 1}_{\bar I_1\to R_2\to I_2}
            + \underbrace{0.4\cdot \tfrac9{10}\cdot 0.6}_{\bar I_1\to N_2\to I_2} = 0.496, $$
$$ P(M{=}2) = 0.6\cdot 1\cdot 0.6 = 0.36, \qquad P(M{=}0)=1-0.496-0.36=0.144. $$
Entonces, por definición de esperanza,
$$ E[M] = 0\cdot 0.144 + 1\cdot 0.496 + 2\cdot 0.36 = 1.216, $$
$$ E[M^2] = 0.496 + 4\cdot 0.36 = 1.936 \Rightarrow \sigma(M)=\sqrt{1.936 - 1.216^2}\approx 0.6763. $$

**Planteo (b) — suma i.i.d. → TCL.** $S_n=\sum_{i=1}^n M_i$ con $M_i$ i.i.d.
($\mu_M=1.216$, $\sigma_M\approx 0.6763$). Por [[teorema-central-del-limite|TCL]],
$S_n \overset{(a)}{\sim}\mathcal{N}\!\big(n\mu_M,\ \sqrt n\,\sigma_M\big)$. Se busca
$n$ con
$$ P(S_n\ge 70) > 0.92 \ \Rightarrow\ 1-\Phi\!\left(\frac{70-n\mu_M}{\sqrt n\,\sigma_M}\right) > 0.92
   \ \Rightarrow\ z_{0.08}=-z_{0.92}\ge \frac{70-n\mu_M}{\sqrt n\,\sigma_M}. $$
Es una **cuadrática en $\sqrt n$**: queda $\sqrt n \approx 9.46$ (la otra raíz
$\approx -8.6$ se descarta), de donde $n\ge 89.63 \Rightarrow \boxed{n\ge 90}$ horas.

> Ojo con el umbral: el raw escribe "$\ge 70$" (no 100) en la cuenta de $S_n$; lo
> importante es el método (v.a.d. por árbol → momentos → suma i.i.d. → TCL → despeje
> cuadrático en $\sqrt n$). Ver [[esperanza]], [[varianza]], [[suma-de-variables-aleatorias]], [[suma-de-va-independientes]], [[teorema-central-del-limite]].

---

## Ej. 10 — Hipergeométrica vía regla de Laplace (paramétrico)

**Fuente:** `Res_Parcialito_TP1y2_ComB.pdf`, Ej. 2.

**Enunciado.** En una clínica hay $N$ personas esperando un test; $M$ de ellas
padecen la enfermedad. Quedan **3 tests** y se eligen al azar 3 personas para
testear. Calcular la probabilidad de que **al menos 2** de las testeadas estén
enfermas.

**Planteo — conteo equiprobable ⇒ Laplace.** Todas las selecciones de 3 entre las
$N$ son equiprobables, así que se usa la **regla de Laplace** (casos
favorables/casos totales). Definir $E_i$ = "se eligen **exactamente** $i$ enfermas".
Los $E_i$ son **mutuamente excluyentes** (la palabra *exactamente*), así que
$$ P(\text{al menos 2}) = P(E_2\cup E_3) = P(E_2) + P(E_3). $$
Contando con [[tecnica-conteo-combinatoria|coeficientes binomiales]] (elegir
enfermos de los $M$ y sanos de los $N-M$):
$$ \boxed{P(E_2\cup E_3) = \frac{\dbinom{M}{2}\dbinom{N-M}{1}}{\dbinom{N}{3}}
                         + \frac{\dbinom{M}{3}}{\dbinom{N}{3}}.} $$
Esta es exactamente la **suma de los dos términos superiores de la
[[distribucion-hipergeometrica|hipergeométrica]]** $\mathcal{H}(N,M,3)$: el ejercicio
**deriva la hipergeométrica desde el conteo de Laplace**, sin invocar la fórmula
cerrada.

> **Moraleja.** Extracción sin reposición de un pool finito + casos equiprobables ⇒
> [[regla-de-laplace|Laplace]] con binomiales = [[distribucion-hipergeometrica|hipergeométrica]].
> "Al menos $k$" se arma sumando las ramas $E_k, E_{k+1},\dots$ (mutuamente
> excluyentes), o por el complemento si conviene.

Ver [[distribucion-hipergeometrica]], [[regla-de-laplace]], [[tecnica-conteo-combinatoria]].

---

## Ver también

- [[ejercicios-de-parcial-resueltos-estadistica|Ejercicios de parcial resueltos (estadística)]]
- [[evaluaciones|Catálogo de evaluaciones]]
- [[tecnica-conteo-combinatoria]], [[tecnica-datos-agrupados-interpolacion]]
- [[reconocer-distribucion-discreta|Cómo reconocer qué distribución usar]]
- [[procesos-estocasticos]], [[cadenas-de-markov]], [[proceso-de-poisson]]
