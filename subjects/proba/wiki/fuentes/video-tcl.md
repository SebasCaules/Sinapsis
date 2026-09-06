---
titulo: "Video — TCL"
resumen: "Clase en video de Lucio Pantazis (unidad 7) sobre el Teorema Central del Límite para sumas y promedios, con corrección por continuidad, cuatro ejemplos numéricos comparados contra el valor exacto y los límites de la aproximación normal."
tipo: fuente
formato: video
unidad: 7
url: "https://youtu.be/zJYKPySYw-s"
duracion: "41:36"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — TCL

**Qué es:** clase grabada de Lucio Pantazis sobre el Teorema Central del Límite,
con cuatro ejemplos numéricos completos (todos sobre el mismo caso de estudio
recurrente: la fiesta de fin de año de "Martín") que comparan la aproximación
del TCL contra el valor exacto.
**Cubre:** enunciado formal del TCL (para sumas y promedios), corrección por
continuidad, límites de la aproximación Normal→Binomial cuando $p$ es extremo,
y el caso de una variable de distribución totalmente desconocida.
**Guía asociada:** Guía 7.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Cierre de la motivación (continuación de la clase de LGN): histogramas de promedios de Binomiales y Exponenciales que se van pareciendo cada vez más a una Normal a medida que crece $n$ |
| [03:41] | Arranca la sección "Teorema Central del Límite" |
| [03:53] | Enunciado formal del TCL: $Z_n$, $\bar X_n$ y $S_n$ |
| [08:08] | Regla práctica sobre el $n$ "suficientemente grande": crítica a la costumbre de pedir $n>30$ |
| [09:06] | Relectura de la LGN a través del TCL: el TCL no solo dice que el promedio se concentra, sino que permite calcular probabilidades |
| [11:07]–[18:11] | Ejemplo 1 — demoras del evento (suma de Exponenciales → Gamma/Erlang), TCL vs. valor exacto |
| [18:13]–[29:24] | Ejemplo 2 — cancelaciones (suma de Binomiales), corrección por continuidad con el punto medio |
| [29:45]–[33:00] | Cómo razonar (no memorizar) si la corrección por continuidad suma o resta $0{,}5$ |
| [33:04]–[37:35] | Contraejemplo: por qué $n=100$ no alcanza si $p$ es muy chico o muy grande; condición $np>10$, $n(1-p)>10$ |
| [37:39]–[40:00] | Ejemplo 3 — promedio de canciones por evento, variable de distribución desconocida |
| [40:05]–[41:30] | Cierre: reflexión sobre lo llamativo del teorema (lo llama el teorema flashero) y advertencia sobre independencia e idéntica distribución |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos que no están en el wiki:** los cuatro ejercicios de
  esta clase son nuevos — usan un caso de estudio ("la fiesta de fin de año de
  Martín": demoras, cancelaciones, canciones) que no aparece en ninguna fuente
  ya ingerida. Reproducidos íntegros más abajo.
- **(b) Intuiciones y motivación no escritas en el apunte:**
  - Demostración visual (histogramas superpuestos con la Normal teórica) de
    que los promedios de Binomiales, Poisson y Exponenciales se acercan a una
    campana a medida que crece $n$ — antes de enunciar el TCL formalmente.
    Complementa [[teorema-central-del-limite]], que da el enunciado pero no
    esta evidencia empírica previa.
  - Forma de **razonar** (no memorizar) si la corrección por continuidad suma
    o resta $0{,}5$: preguntarse qué valores del recorrido de la variable
    discreta original quedan incluidos antes y después de la corrección, y
    elegir el signo que los preserve. [[teorema-central-del-limite]] ya trae
    la fórmula de la corrección pero no este método de verificación.
  - Intuición de por qué la aproximación Normal falla con $p$ muy chico o muy
    grande aunque $n$ sea grande: en el caso extremo $p=0$ (o $p=1$) la
    variable es **constante**, y no tiene sentido aproximar una constante por
    una Normal — la Binomial con $p$ chico se parece casi a esa constante
    [35:47].
  - Reflexión de cierre sobre por qué el promedio es tan usado como valor
    representativo en la vida cotidiana, y advertencia de que el TCL exige
    independencia e idéntica distribución — condiciones difíciles de verificar
    en la práctica (ejemplo: un censo sobre una población entera, donde el
    último valor queda determinado por los anteriores y deja de ser
    independiente).
- **(c)/(d) Advertencias y énfasis del docente:** ver sección siguiente.

## Ejercicios resueltos en clase

### Ejercicio 1 — Demoras del evento (suma de Exponenciales) [11:07]

*Sea $D_i$ = minutos demorados en el $i$-ésimo evento del año, con
$D_i\sim\mathcal E(1/5)$ i.i.d. ($E(D_i)=5$, $\sigma(D_i)=5$). Martín organiza
eventos los 52 fines de semana del año, 2 por fin de semana, es decir $104$
eventos: $S_{104}=\sum_{i=1}^{104}D_i$. Calcular la probabilidad de que las
demoras totales del año superen las 7 horas (420 minutos), por TCL y en forma
exacta.*

**Planteo.** Por [[suma-de-va-independientes|suma de exponenciales i.i.d.]],
$S_{104}\sim\Gamma\!\left(104,\tfrac15\right)$ exactamente (Erlang de orden
104), pero su acumulada es costosa de calcular a mano. Por el TCL,
$$ S_{104}\overset{\text{TCL}}{\sim}\mathcal N\!\big(104\cdot5,\;\sqrt{104}\cdot5\big)=\mathcal N(520,\;50{,}99). $$

**Cálculo (TCL).**
$$
P(S_{104}>420)=P\!\left(\frac{S_{104}-520}{\sqrt{104}\cdot5}>\frac{420-520}{\sqrt{104}\cdot5}\right)\overset{\text{TCL}}{\approx}P(Z>-1{,}9611614)=\Phi(1{,}9611614)=0{,}9750699.
$$

**Valor exacto (Gamma, con software).** $P(S_{104}>420)=0{,}980771$.

**Resultado.** TCL $\approx0{,}9751$ vs. exacto $\approx0{,}9808$: la diferencia
es de apenas $0{,}5\%$, aun sin usar corrección por continuidad (aquí no hace
falta: $D_i$ es continua). *(Nota: en el gráfico comparativo de la diapositiva
el docente marcó por error el punto $x=480$ en vez de $420$ — quedó un valor
viejo sin actualizar en una diapositiva; con $x=480$ ambas curvas dan
$\approx0{,}78$, coincidiendo solo al tercer decimal.)*

### Ejercicio 2 — Cancelaciones (suma de Binomiales) [18:13]

*Sea $C_i$ = cantidad de cancelaciones en el $i$-ésimo evento del año,
$C_i\sim\mathrm{Bi}(100,\,0{,}05)$ i.i.d. Asumiendo independencia entre
eventos, $S_{104}=\sum_{i=1}^{104}C_i$. Aproximar $P(S_{104}\le490)$.*

**Planteo.** Por el TCL (suma de $104$ Binomiales i.i.d.),
$$ S_{104}\overset{\text{TCL}}{\sim}\mathcal N\!\big(104\cdot100\cdot0{,}05,\;\sqrt{104\cdot100\cdot0{,}05\cdot0{,}95}\big)=\mathcal N(520,\;\sqrt{494}). $$

**Cálculo sin corrección por continuidad.**
$$ P(S_{104}\le490)\overset{\text{TCL}}{\approx}\Phi\!\left(\frac{490-520}{\sqrt{494}}\right)=\Phi(-1{,}3497638)=0{,}0885459. $$

**Con corrección por continuidad.** Como $S_{104}$ es discreta, $P(S_{104}\le490)$
coincide con $P(S_{104}\le t)$ para cualquier $t\in[490,491)$; se toma el punto
medio $490{,}5$ del "vacío de probabilidad":
$$ P(S_{104}\le490)=P(S_{104}\le490{,}5)\overset{\text{TCL}}{\approx}\Phi\!\left(\frac{490{,}5-520}{\sqrt{494}}\right)=0{,}0922101. $$

**Resultado.** Valor exacto (Binomial de $10\,400$ ensayos, vía software)
$\approx0{,}0913270$. La versión **con** corrección ($0{,}0922$) queda mucho
más cerca del exacto que la versión sin corregir ($0{,}0885$).

**Cómo decidir el signo de la corrección [29:45].** En vez de una regla fija
("sumo si es $\ge$, resto si es $<$"), conviene chequear qué valores del
recorrido quedan incluidos antes y después de mover $0{,}5$:
- $P(S_{104}\ge510)$ incluye el $510$ en adelante. Restando $0{,}5$,
  $P(S_{104}\ge509{,}5)$ sigue incluyendo el $510$ en adelante — correcto.
  Sumando $0{,}5$, $P(S_{104}\ge510{,}5)$ ya excluye el $510$ — incorrecto.
- $P(S_{104}>510)$ incluye el $511$ en adelante. Sumando $0{,}5$,
  $P(S_{104}\ge510{,}5)$ incluye el $511$ en adelante — correcto. Restando
  $0{,}5$, $P(S_{104}\ge509{,}5)$ incluye de más el $510$ — incorrecto.

### Ejercicio 3 — Cuando $n$ no alcanza: $p$ muy chico [33:04]

*Sea $C_i\sim\mathrm{Bi}(100,\,0{,}05)$ un único evento (no la suma). Calcular
$P(C_i\le2)$ por la aproximación Normal y comparar con el valor exacto.*

**Resultado.** Exacto $\approx0{,}1183$; aproximación Normal (con corrección,
$x=2{,}5$) $\approx0{,}1257$ — ya en el segundo decimal aparecen diferencias
[34:13], pese a que $n=100$. La razón: con $p=0{,}05$ la Binomial está muy concentrada
cerca de $0$ (en el caso extremo $p=0$ sería una constante, y no tiene sentido
aproximar una constante por una Normal). Por eso se pide, además de $n$
grande, que $np>10$ **y** $n(1-p)>10$ simultáneamente (controla que $p$ no sea
ni muy chico ni muy grande). Para Poisson→Normal, análogamente $\lambda=np>10$.

### Ejercicio 4 — Promedio de canciones (variable desconocida) [37:39]

*Martín no conoce la distribución de $M_i$ = cantidad de canciones que pone
por evento, pero sabe $E(M_i)=150$ y $V(M_i)=500$. Calcular
$P(148\le\bar M_{104}\le153)$.*

**Planteo.** Por el TCL, sin saber nada de la distribución de $M_i$ (ni
siquiera si es discreta o continua), alcanza con media y varianza:
$$ \bar M_{104}=\frac{\sum_{i=1}^{104}M_i}{104}\overset{\text{TCL}}{\sim}\mathcal N\!\left(150,\;\sqrt{\tfrac{500}{104}}\right). $$

**Cálculo.**
$$ P(148\le\bar M_{104}\le153)\approx\Phi\!\left(\frac{153-150}{\sqrt{500/104}}\right)-\Phi\!\left(\frac{148-150}{\sqrt{500/104}}\right)=\Phi(1{,}3682)-\Phi(-0{,}9121)=0{,}7335295. $$

**Resultado.** $P(148\le\bar M_{104}\le153)\approx0{,}7335$. El docente remarca
que la clave de la guía 7 es identificar si lo que se pide es sobre un
**promedio** o sobre una **suma**, y aplicar la versión correspondiente del
TCL; de ahí en más "se vuelve un ejercicio de la guía A4" (tabla Normal).

## Advertencias del docente

- **[08:08]–[08:52]** Sobre el $n$ mínimo para aplicar el TCL: "vamos a decir
  $n\ge50$... en general muchos dicen $n>30$. A mí no me gusta nada" — prefiere
  ser estricto porque, si la variable de origen es muy asimétrica, tarda más
  en parecerse a una Normal. "Con $n=100$ me digo que estamos cubiertos", pero
  aclara enseguida (ver ejercicio 3) que **no siempre alcanza**.
- **[13:00]–[13:22]** Al plantear las cuentas paso a paso en vez de saltar
  directo al resultado: "estamos forjando algo que nos ayuda a entenderlo
  mucho más y hace que después nos equivoquemos menos" en el pasaje mecánico.
- **[29:45]–[33:00]** Sobre la corrección por continuidad: "no agarrar una
  regla que diga siempre hago esto, hago esto, porque eso no es pensar" — hay
  que verificar qué valores del recorrido quedan incluidos antes y después de
  la corrección (ver ejercicio 2).
- **[33:04]–[36:44]** Los problemas de la aproximación Normal a la Binomial
  aparecen cuando $p$ es muy chico o muy grande, sin importar qué tan grande
  sea $n$ — pide **ambas** condiciones $np>10$ y $n(1-p)>10$ a la vez, porque
  si $p$ es chico la primera falla y si $p$ es grande falla la segunda.
- **[40:42]–[41:10]** Sobre las hipótesis del TCL en la práctica: "ojo que de
  nuevo si las variables no son independientes...". Advierte que el teorema
  tiene "peros" —que las variables tengan la misma distribución y que sean
  independientes— y que "en la práctica es muy difícil que se cumpla"
  (ejemplo: un censo sobre toda una población, donde el último valor queda
  determinado por los anteriores).

## Páginas del wiki que toca

- [[teorema-central-del-limite]]
- [[aproximacion-normal-de-la-binomial]]
- [[ley-de-grandes-numeros]]
- [[promedio-muestral]]
- [[suma-de-va-independientes]]
- [[suma-de-variables-aleatorias]]
- [[distribucion-gamma]]
- [[distribucion-erlang]]
- [[desigualdad-de-chebyshev]]
