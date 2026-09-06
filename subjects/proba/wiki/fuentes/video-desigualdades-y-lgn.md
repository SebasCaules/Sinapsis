---
titulo: "Video — Desigualdades y LGN"
resumen: "Clase en video de Lucio Pantazis (unidad 7) sobre las desigualdades de Markov y Chebyshev como cotas sin conocer la distribución, media y varianza de sumas y promedios de variables i.i.d., y la Ley de los Grandes Números con simulaciones."
tipo: fuente
formato: video
unidad: 7
url: "https://youtu.be/snYZyy5CVS0"
duracion: "36:52"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Desigualdades y LGN

**Qué es:** clase grabada (slides Beamer) sobre las desigualdades de Markov y
Chebyshev, las variables i.i.d. y la Ley de los Grandes Números.
**Cubre:** cotas de probabilidad sin conocer la distribución, media/varianza de
sumas y promedios de v.a.i.i.d., y la LGN (débil, con demostración vía Chebyshev,
e interpretación frecuentista).
**Guía asociada:** Guía 7.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:03] | Motivación: ¿qué cuentas puedo hacer si no sé nada sobre la distribución de mi variable? |
| [00:31] | Ejemplo de Martín y la basura (setup para Markov) |
| [01:53] | Desigualdad de Markov: enunciado, intuición y aplicación al ejemplo ($P\le 50\%$) |
| [05:20] | Ejemplo del DJ y las canciones (setup para Chebyshev) |
| [06:13] | Desigualdad de Chebyshev: enunciado |
| [09:22] | Aplicación de Chebyshev al ejemplo del DJ ($P\ge 80\%$) y el cambio de signo al complementar |
| [13:08] | Cota vs. distribución conocida: comparación numérica con Normal/Exponencial/Gamma de igual media |
| [17:20] | Variables aleatorias i.i.d. (VAID): definición |
| [18:11] | Media y varianza de $S_n$ y de $\bar X_n$; por qué la varianza necesita independencia |
| [24:54] | Simulación: promedios de variables Normales concentrándose alrededor de la media |
| [27:47] | Histogramas de $\bar X_n$ para $n=10,30,60,100$ contra la Normal teórica |
| [29:11] | Misma simulación repetida con Binomial, Poisson y Exponencial |
| [32:00] | Enunciado de la Ley de los Grandes Números |
| [34:25] | Interpretación frecuentista de la probabilidad vía variables indicadoras Bernoulli |

## Qué aporta sobre el apunte

- **(a) Ejemplos resueltos que no están en el apunte.** El apunte
  ([[teorica-markov-chebyshev]]) trae sólo el enunciado, la demostración
  abstracta y (vía [[tp7-suma-de-va]]) el ejercicio del cañón ya citado en
  [[desigualdad-de-chebyshev]]. El video agrega dos ejemplos completos y
  distintos — el de Martín y la basura (Markov, [00:31]) y el del DJ y las
  canciones (Chebyshev, [05:20]) — reproducidos abajo en "Ejercicio resuelto".
- **(a) Simulación visual de la LGN.** Entre [24:54] y [31:20] el docente
  muestra, con datos simulados, cómo se distribuye $\bar X_n$ para
  $n=10,30,60,100$ en cuatro distribuciones distintas (Normal, Binomial,
  Poisson, Exponencial). [[ley-de-grandes-numeros]] y [[promedio-muestral]] son
  puramente analíticas (fórmulas y demostración vía Chebyshev); el video aporta
  la contraparte gráfica de por qué el promedio se concentra. Detalle propuesto
  como aporte más abajo.
- **(b) Intuición de por qué Markov "tiene que" cumplirse** ([02:25]): si la
  probabilidad de valores grandes no se achicara a medida que el umbral crece,
  el valor esperado terminaría divergiendo; por eso toda variable con media
  finita está obligada a tener colas que se achican.
- **(b) Intuición del cambio de signo al complementar** ([10:32]–[12:29]): el
  docente muestra con números concretos (p. ej. $0.3$ vs. $0.7=1-0.3$ y $0.6$
  vs. $0.4=1-0.6$) por qué al pasar de $P(|X-\mu|\ge\varepsilon)\le\cdot$ a su
  complemento $P(|X-\mu|<\varepsilon)$ la desigualdad se invierte a $\ge$. Se
  detiene un rato en el punto para que se entienda por qué queda mayor o igual
  si la desigualdad de partida decía menor o igual — ver advertencias.
- **(b) Frase mnemotécnica**: *"los promedios se ahogan los enanos"*
  ([31:35]) — a medida que se promedian más valores, un dato atípico pierde
  peso individual y deja de mover el promedio. Buena forma de recordar por qué
  $\bar X_n$ se concentra cuando $n$ crece.
- **(d) Énfasis en que "la cota de Markov es muy bruta"** ([15:23], dentro del
  tramo [13:08]–[16:44]): insiste en que,
  si se conoce la distribución, siempre conviene calcular la probabilidad real
  en vez de usar Markov/Chebyshev, porque la cota queda muy por encima del
  valor verdadero. Ilustra esto con Normal/Exponencial/Gamma de igual media —
  ver el aporte propuesto a [[desigualdad-de-chebyshev]] con el ejemplo de los
  "321 ceros".
- **(d) Énfasis en identificar suma vs. promedio** ([20:00]): remarca que gran
  parte de la Guía 7 consiste en reconocer si el enunciado pide $S_n$ o
  $\bar X_n$, porque cambia la fórmula de la esperanza y la varianza a usar.
- **(d) Énfasis en las VAID** ([17:04]): las llama "las estrellas de esta
  guía" — remarca que, sin saber nada de la distribución individual, saber que
  las variables son i.i.d. ya alcanza para calcular media y varianza de la
  suma y del promedio.

## Ejercicio resuelto en clase

### Ejemplo 1 — Martín y la basura (Markov) — arranca en [00:31]

**Enunciado.** Martín junta basura durante todo el fin de semana. El camión
que se la lleva tiene capacidad máxima de $200$ kg. Martín no sabe qué
distribución tiene la cantidad de basura $B$ que junta (ni si es continua, ni
su densidad ni su acumulada): sólo sabe que $B\ge 0$ (son kilos) y que
$E[B]=100$. Quiere acotar la probabilidad de que la basura supere la
capacidad del camión.

**Planteo.** Como $B$ es no negativa y tiene valor esperado finito, se puede
aplicar la [[desigualdad-de-chebyshev|desigualdad de Markov]] con
$\alpha=200$:
$$ P(B\ge 200)\le\frac{E[B]}{200}. $$

**Cálculo.**
$$ P(B\ge 200)\le\frac{100}{200}=0.5. $$

**Resultado.** A lo sumo el $50\%$ de los fines de semana la basura de Martín
va a superar la capacidad del camión — una cota que puede calcular sin saber
absolutamente nada más sobre la distribución de $B$.

### Ejemplo 2 — el DJ y las canciones (Chebyshev) — arranca en [05:20]

**Enunciado.** Un DJ paga derechos por cada canción que pone en sus eventos.
La cantidad de canciones $M$ que toca por evento es discreta, con
$E[M]=150$ y $V(M)=500$, pero no conoce su distribución. Quiere acotar la
probabilidad de que la cantidad de canciones que pone quede entre $100$ y
$200$.

**Planteo.** El evento se reescribe como distancia a la media:
$$ 100<M<200 \iff |M-150|<50. $$
Por la [[desigualdad-de-chebyshev|desigualdad de Chebyshev]] con
$\varepsilon=50$:
$$ P(|M-150|\ge 50)\le\frac{V(M)}{50^2}=\frac{500}{2500}. $$

**Cálculo.**
$$ P(|M-150|\ge 50)\le 0.2 \;\Rightarrow\; P(100<M<200)=1-P(|M-150|\ge 50)\ge 1-0.2=0.8. $$

**Resultado.** Aunque no conoce la distribución de $M$, el DJ puede garantizar
que al menos el $80\%$ de las veces la cantidad de canciones que toca queda
entre $100$ y $200$.

> Nota: al pasar de $P(|M-150|\ge 50)\le 0.2$ a su complemento, el docente
> marca explícitamente ([10:41]) que la desigualdad se invierte ($\ge$ en vez
> de $\le$) — ver advertencia abajo.

## Advertencias del docente

- **[10:32]–[12:29]** Al tomar el complemento de una cota de Chebyshev (pasar
  de $P(|X-\mu|\ge\varepsilon)\le c$ a $P(|X-\mu|<\varepsilon)$), la
  desigualdad se invierte a $\ge 1-c$. El docente se detiene a justificarlo
  con un ejemplo numérico simple ($0.3$/$0.7$, $0.6$/$0.4$) para que se
  entienda por qué queda mayor o igual, y solo después vuelve al ejemplo
  del DJ.
- **[18:42]–[19:17]** Para que $V(S_n)=\sum_i V(X_i)$ (suma de varianzas, sin
  covarianzas) hace falta **independencia**, no alcanza con que las
  variables sean idénticamente distribuidas. Si no son independientes hay que
  agregar los términos de covarianza; omitirlos "está mal justificado".
- **[13:08]–[16:44]** Remarca que Markov/Chebyshev dan cotas **muy brutas**:
  siempre que se conozca la distribución conviene calcular la probabilidad
  real en vez de usar la cota (ver ejemplo de los "321 ceros" propuesto como
  aporte a [[desigualdad-de-chebyshev]]).

## Páginas del wiki que toca

- [[desigualdad-de-chebyshev]]
- [[ley-de-grandes-numeros]]
- [[promedio-muestral]]
- [[suma-de-variables-aleatorias]]
- [[suma-de-va-independientes]]
- [[teorema-central-del-limite]]
