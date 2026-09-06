---
titulo: "Video — Suma Variables"
resumen: "Clase en video de Lucio Pantazis (unidad 7) sobre la suma de variables independientes por convolución, aplicada a binomial, Poisson, geométrica, exponencial y normal, y generalizada a n sumandos como antesala del Teorema Central del Límite."
tipo: fuente
formato: video
unidad: 7
url: "https://youtu.be/CYJQPo_Akz0"
duracion: "39:09"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Suma Variables

**Qué es:** clase grabada que desarrolla la distribución de la suma de dos
variables aleatorias independientes con un único hilo conductor (Martín y su
salón de eventos), aplicado sucesivamente a Binomial, Poisson, Geométrica y
Exponencial, y cierra con Normal y la transición hacia el Teorema Central del
Límite.
**Cubre:** suma de v.a. independientes por convolución/probabilidad total;
casos con nombre propio (Binomial, Poisson, Geométrica→Binomial Negativa,
Exponencial→Gamma, Normal); generalizaciones a $n$ sumandos.
**Guía asociada:** Guía 7.

## Recorrido de la clase
| Timestamp | Tema |
|---|---|
| [00:02] | Introducción: la suma de v.a. es el paso previo al Teorema Central del Límite |
| [00:46] | Caso hilo conductor: Martín organiza eventos en un salón de fiestas |
| [01:06] | Cancelaciones: $C_i\sim\mathrm{Bi}(100,0.05)$, plantea $S_C=C_1+C_2$ |
| [04:44]–[11:04] | Deriva $S_C$ por probabilidad total + convolución + identidad de Vandermonde |
| [11:26] | Vinos: $V_1\sim\mathcal{P}o(30)$, $V_2\sim\mathcal{P}o(40)$ |
| [12:29]–[17:08] | Deriva $S_V$ por convolución + binomio de Newton |
| [17:51] | Televisión: $T_i\sim\mathcal{G}e(1/40)$ (minutos completos sin encender) |
| [19:19]–[23:07] | Deriva $S_T$ por convolución; identifica el combinatorio como Binomial Negativa |
| [24:10] | Demoras: $D_i\sim\mathcal{E}(1/5)$ |
| [24:54]–[28:27] | Deriva la FDA de $S_D$ integrando directamente sobre el triángulo $\{r+s\le d\}$ |
| [29:09]–[35:44] | Slides de resumen y generalización a $n$ sumandos: Binomial, Poisson, Geométrica→BinNeg, Exponencial→Gamma |
| [36:15]–[38:58] | Normales: menciona la función característica (fuera de alcance) e intuición de por qué crece el desvío |
| [39:03] | Cierre |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos con números concretos.** El apunte ya prueba en
  abstracto (con parámetros simbólicos) que Binomial+Binomial→Binomial
  ([[teorica-suma-binomiales]]), Poisson+Poisson→Poisson
  ([[teorica-suma-poisson]]) y Normal+Normal→Normal ([[teorica-suma-normales]]).
  El video repite esas mismas demostraciones pero **con un solo caso hilo
  conductor y valores numéricos fijos** (cancelaciones $\mathrm{Bi}(100,0.05)$,
  vinos $\mathcal{P}o(30)+\mathcal{P}o(40)$), lo cual sirve como plantilla de
  cómo se ve la cuenta completa "en limpio" para un ejercicio de parcial.
- **(b) Derivación nueva, no presente en ninguna fuente ya ingerida:** la
  suma de dos Geométricas → Binomial Negativa por convolución completa
  ([19:19]–[23:07]). No existe una `teorica-suma-geometricas` en `raw/`; la
  tabla de [[suma-de-va-independientes]] listaba el resultado
  ($\mathrm{Geo}(p)+\mathrm{Geo}(p)\to\mathrm{BinNeg}(2,p)$) pero sin demostrarlo. Ver
  aporte propuesto.
- **(c) Método alternativo para Exponencial→Gamma.** El apunte
  ([[teorica-suma-exponenciales]]) prueba la suma de exponenciales vía la
  equivalencia con el proceso de Poisson ($\{T_n>t\}\Leftrightarrow\{N(t)\le n-1\}$).
  El video, en cambio, integra **directamente la FDA** de $S_D=D_1+D_2$ sobre
  la región $\{D_1+D_2\le d\}$ con una imagen geométrica (recta $r=d-s$ en el
  plano $(s,r)$) — una segunda forma de llegar al mismo resultado, útil si en
  el parcial no cae del lado del proceso de Poisson.
- **(d) Generalizaciones a $n$ sumandos** que no estaban formalizadas para
  todas las familias: $\mathrm{BinNeg}(n,p)+\mathrm{BinNeg}(m,p)=\mathrm{BinNeg}(n+m,p)$
  ([34:26]) — la Geométrica es el caso $n=1$. (La generalización análoga para
  Gamma, $\Gamma(\alpha_1,\lambda)+\Gamma(\alpha_2,\lambda)=\Gamma(\alpha_1+\alpha_2,\lambda)$
  [35:44], **ya está** documentada en [[distribucion-gamma]].)
- **(e) Intuición nueva** sobre por qué el desvío de la suma de dos Normales
  **aumenta** en vez de promediarse: valores altos de $X$ pueden coincidir con
  valores altos de $Y$ (empujando la suma hacia arriba) y del mismo modo para
  valores bajos, así que la dispersión se acumula en vez de cancelarse
  ([37:21]–[37:43]). El apunte da la fórmula ($\sigma_S=\sqrt{\sigma_1^2+\sigma_2^2}$)
  pero no esta lectura intuitiva.
- **(f) Advertencia metodológica explícita:** el docente aclara ([33:18],
  [33:47]) que al pensar la Geométrica/Binomial Negativa como "cantidad de
  **fracasos**" versus "cantidad de **intentos**" hasta el $n$-ésimo éxito, las
  dos variables que se suman tienen que estar en la **misma versión** — si una
  cuenta fracasos y la otra intentos, el resultado deja de tener sentido. El
  video eligió deliberadamente la versión "fracasos" en el ejemplo de la
  televisión porque el recorrido resulta más simple de recortar en la
  convolución.

## Ejercicio resuelto en clase

El video desarrolla, uno tras otro, cuatro derivaciones completas sobre el
mismo caso hilo conductor (Martín y el salón de eventos). Se reproducen las
cuatro porque cada una fija con números concretos una de las demostraciones
generales del apunte.

### 1. Cancelaciones — suma de dos Binomiales ([01:06])

**Enunciado.** El salón tiene 100 asientos siempre completos, pero en
promedio un 5% de los invitados cancela por imprevistos. Sea
$C_i=$ cantidad de cancelaciones el $i$-ésimo día del fin de semana
($i=1$: viernes, $i=2$: sábado), con $C_1,C_2$ independientes entre sí y
$$ C_i\sim\mathrm{Bi}(100,\,0.05). $$
Se pide la distribución de $S_C=C_1+C_2$.

**Planteo.** $S_C$ es discreta con recorrido $\mathcal R_{S_C}=\{0,1,\dots,200\}$.
Se calcula $P(S_C=k)$ condicionando por probabilidad total sobre los valores de
$C_1$:
$$ P(S_C=k)=P(C_1+C_2=k)=\sum_{i=0}^{200}P(C_1+C_2=k\cap C_1=i)=\sum_{i=0}^{200}P(C_2=k-i)\cdot P(C_1=i), $$
donde el último paso usa la independencia de $C_1$ y $C_2$.

**Cálculo.**
$$
P(S_C=k)=\sum_{i=0}^{200}\binom{100}{k-i}0.05^{\,k-i}0.95^{\,100-k+i}\cdot\binom{100}{i}0.05^{\,i}0.95^{\,100-i}
=0.05^{\,k}\,0.95^{\,200-k}\sum_{i=0}^{200}\binom{100}{k-i}\binom{100}{i}.
$$
Por la **identidad de Vandermonde** ($\sum_i\binom{100}{k-i}\binom{100}{i}=\binom{200}{k}$,
ya usada en [[teorica-suma-binomiales]]):
$$ P(S_C=k)=\binom{200}{k}\,0.05^{\,k}\,0.95^{\,200-k}. $$

**Resultado.** $\;S_C\sim\mathrm{Bi}(200,\,0.05)$.

### 2. Vinos — suma de dos Poisson con distinto parámetro ([11:26])

**Enunciado.** Sea $V_i=$ cantidad de vinos consumidos el $i$-ésimo día del
fin de semana, con $V_1\sim\mathcal{P}o(30)$ (viernes) y $V_2\sim\mathcal{P}o(40)$
(sábado), independientes. Se pide la distribución de $S_V=V_1+V_2$.

**Planteo.** $S_V$ es discreta con $\mathcal R_{S_V}=\mathbb N_0$. Igual que
antes, por probabilidad total + independencia:
$$ P(S_V=k)=\sum_{i=0}^{k}P(V_2=k-i)\cdot P(V_1=i) $$
(la suma se recorta en $i=0,\dots,k$ porque para $i>k$ sería $P(V_2=k-i)=0$).

**Cálculo.**
$$
P(S_V=k)=\sum_{i=0}^{k}e^{-40}\frac{40^{\,i}}{i!}\cdot e^{-30}\frac{30^{\,k-i}}{(k-i)!}
=\frac{e^{-70}}{k!}\sum_{i=0}^{k}\binom{k}{i}30^{\,k-i}40^{\,i}
=\frac{e^{-70}}{k!}(30+40)^k,
$$
usando el binomio de Newton en el último paso.

**Resultado.** $\;S_V\sim\mathcal{P}o(70)$ — se suman los parámetros aunque
sean distintos, a diferencia del caso binomial donde hace falta la misma $p$.

### 3. Televisión — suma de dos Geométricas → Binomial Negativa ([17:51])

**Enunciado.** Cada minuto, con probabilidad $p=1/40$ e independiente entre
minutos, algún invitado se percata de que hay un televisor apagado y pide que
lo prendan. Sea $T_i=$ cantidad de minutos **completos** sin televisión
prendida el $i$-ésimo día del fin de semana:
$$ T_i\sim\mathcal{G}e\!\left(\frac{1}{40}\right)\quad\text{(versión "fracasos", }\mathcal R_{T_i}=\mathbb N_0\text{).} $$
Se pide la distribución de $S_T=T_1+T_2$.

**Planteo.** $S_T$ es discreta con $\mathcal R_{S_T}=\mathbb N_0$. Por
probabilidad total + independencia:
$$ P(S_T=k)=\sum_{i=0}^{k}P(T_2=k-i)\cdot P(T_1=i). $$

**Cálculo.**
$$
P(S_T=k)=\sum_{i=0}^{k}\left(1-\frac1{40}\right)^{k-i}\frac1{40}\cdot\left(1-\frac1{40}\right)^{i}\frac1{40}
=\left(\frac1{40}\right)^2\left(1-\frac1{40}\right)^{k}\sum_{i=0}^{k}1
=(k+1)\left(\frac1{40}\right)^2\left(1-\frac1{40}\right)^{k}.
$$
El factor $k+1$ es exactamente $\binom{(k+2)-1}{2-1}$, el combinatorio que
aparece en la fórmula de la Binomial Negativa.

**Resultado.** $\;S_T\sim\mathcal{NB}\!\left(2,\,\frac1{40}\right)$: la cantidad
de minutos completos hasta que **dos** invitados distintos (en días distintos)
pidan prender la tele.

### 4. Demoras — suma de dos Exponenciales → Gamma, vía la FDA ([24:10])

**Enunciado.** Sea $D_i=$ minutos demorados el $i$-ésimo día del fin de
semana, con $D_i\sim\mathcal{E}(1/5)$ independientes. Se pide la distribución
de $S_D=D_1+D_2$.

**Planteo.** $S_D$ es continua; conviene empezar por su función de
distribución. Para $d\ge 0$:
$$ F_{S_D}(d)=P(S_D\le d)=P(D_1+D_2\le d)=P(D_2\le d-D_1). $$

**Cálculo.** Integrando sobre la región $\{(s,r): 0\le s\le d,\ 0\le r\le d-s\}$
(la densidad conjunta factoriza por independencia):
$$
F_{S_D}(d)=\int_0^d\int_0^{d-s}\frac15e^{-s/5}\cdot\frac15e^{-r/5}\,dr\,ds
=\int_0^d\frac15e^{-s/5}\left(1-e^{-(d-s)/5}\right)ds
=1-e^{-d/5}-\frac{d}{5}e^{-d/5}.
$$
Derivando respecto de $d$ se obtiene la densidad:
$$
f_{S_D}(d)=\frac15e^{-d/5}-\frac15e^{-d/5}+\frac{d}{25}e^{-d/5}=\frac{d}{25}e^{-d/5}
=\frac{(1/5)^2\,d^{\,2-1}\,e^{-d/5}}{(2-1)!},\qquad d>0.
$$

**Resultado.** $\;S_D\sim\Gamma\!\left(2,\,\frac1{5}\right)$ — coincide con
sumar dos exponenciales de la misma tasa, tal como se demuestra por otra vía
(proceso de Poisson) en [[teorica-suma-exponenciales]] y en [[distribucion-erlang]].

## Advertencias del docente

- **[06:48]–[08:34]** Al escribir la convolución con combinatorios sumando
  "hasta 100" o "hasta $k$", muchos de los términos individuales no tienen
  sentido combinatorio (por ejemplo $\binom{100}{-1}$). El docente aclara que
  por convención $\binom{n}{k}=0$ cuando $k<0$ o $k>n$, así que **no hace
  falta cortar la sumatoria a mano en cada caso**: los términos "sin sentido"
  se anulan solos. Es un tecnicismo útil para no perder tiempo en el parcial
  ajustando límites de sumatoria a mano.
- **[29:51]–[30:36]** Para que $\mathrm{Bi}(n,p)+\mathrm{Bi}(m,p)=\mathrm{Bi}(n+m,p)$
  hace falta que **la misma $p$** — si las probabilidades de éxito difieren,
  la suma deja de ser Binomial (aunque cada sumando sí lo sea). Mismo cuidado
  para Geométrica/BinNeg ($p$) y Exponencial/Gamma ($\lambda$): sin el mismo
  parámetro de "tasa", la familia no se conserva bajo la suma.
- **[33:18], [33:47]–[34:30]** Al sumar Geométricas/Binomiales Negativas, la
  versión "fracasos" y la versión "intentos" **no son intercambiables**: hay
  que sumar dos variables que cuenten lo mismo (ambas fracasos, o ambas
  intentos), porque cambia el recorrido y el valor esperado del resultado.
- **[38:18]–[38:39]** Sobre la fórmula $\sigma_S=\sqrt{\sigma_1^2+\sigma_2^2}$
  de la suma de Normales: el docente recomienda **deducir primero la
  varianza** (suma directa, sin hipótesis extra más allá de independencia) y
  solo al final sacar la raíz para obtener el desvío, en vez de tratar de
  memorizar la fórmula del desvío directamente — "es más difícil decir tiene
  que ser raíz de este más este, pero ¿y si me olvido el cuadrado?".

## Páginas del wiki que toca

- [[suma-de-variables-aleatorias]]
- [[suma-de-va-independientes]]
- [[formulario-suma-de-va]]
- [[distribucion-gamma]]
- [[distribucion-erlang]]
- [[teorema-central-del-limite]]
