---
titulo: Desigualdades de Markov y de Chebyshev
resumen: 'Cotas universales que solo usan momentos: Markov da $P(X\ge\alpha)\le E[X]/\alpha$ para $X\ge 0$, y Chebyshev $P(|X-\mu|\ge\varepsilon)\le\sigma_X^2/\varepsilon^2$. Valen siempre pero son flojas; con ellas se demuestra la ley débil de los grandes números.'
tipo: teorema
unidad: 7
orden: 6
tags: [desigualdad, cota, varianza, teorema]
fuentes: ["[[teorica-markov-chebyshev]]", "[[tp7-suma-de-va]]", "[[video-desigualdades-y-lgn]]"]
actualizado: 2026-09-04
---

# Desigualdades de Markov y de Chebyshev

**En breve.** Dan una **cota superior** de la probabilidad de que una v.a. se
aleje de su media (Chebyshev) o supere un umbral (Markov), usando sólo
[[esperanza|esperanza]] y/o [[varianza|varianza]]. Útiles cuando no se conoce la
distribución y para demostrar la [[ley-de-grandes-numeros|LGN]].

Dos **cotas universales** de probabilidad. No suponen nada sobre la forma de la
distribución (sólo momentos) $\Rightarrow$ son **válidas siempre pero poco
ajustadas**. Según [[teorica-markov-chebyshev]].

**Intuición (por qué son flojas).** Como valen para *cualquier* distribución con
esos momentos, deben cubrir incluso el peor caso posible. Una distribución
concreta y "bien portada" (p. ej. la Normal) concentra mucho más cerca de la
media que ese peor caso, así que la probabilidad real suele ser muchísimo menor
que la cota. Por eso Chebyshev garantiza $\ge 0.84$ donde la verdad es $\approx
0.98$ (ver el ejercicio).

## Desigualdad de Markov
Si $X$ es una v.a. que **sólo toma valores no negativos** ($X\ge 0$), entonces
para todo $\alpha>0$:
$$ P(X\ge\alpha)\le\frac{E[X]}{\alpha}. $$

> [!figura] u7-la-recta-x-por-encima-del-escalon
> La recta $y=x/\alpha$ queda por encima de la indicadora $\mathbb 1_{\{x\ge\alpha\}}$ en todo el semieje $x\ge0$ —el área sombreada es justamente esa brecha— y las dos valen 1 en $x=\alpha$. Integrar ambas contra la misma densidad conserva la desigualdad: ese es el único paso no trivial de la demostración.

**Idea de demostración** (caso continuo): con la función indicadora
$\mathbb 1_{\{x\ge\alpha\}}$,
$$ P(X\ge\alpha)=\int_\alpha^\infty f_X(x)\,dx=\int_{-\infty}^\infty \mathbb 1_{\{x\ge\alpha\}}f_X(x)\,dx\le\int_{-\infty}^\infty \frac{x}{\alpha}\,f_X(x)\,dx=\frac{E[X]}{\alpha}, $$
porque donde $\mathbb 1=1$ es $x\ge\alpha$, luego $\tfrac{x}{\alpha}\ge 1$.

> El TP7 la enuncia de forma equivalente con $|X|$: $\;P(|X|\ge\varepsilon)\le\dfrac{E[|X|]}{\varepsilon}$.

## Desigualdad de Chebyshev
Sea $X$ una v.a. con media $\mu$ y varianza $\sigma_X^2$. Para todo $\varepsilon>0$:
$$ P(|X-\mu|\ge\varepsilon)\le\frac{\sigma_X^2}{\varepsilon^2}. $$

**Idea de demostración:** aplicar Markov a la v.a. no negativa $(X-\mu)^2$ con $\alpha=\varepsilon^2$:
$$ P(|X-\mu|\ge\varepsilon)=P\big((X-\mu)^2\ge\varepsilon^2\big)\le\frac{E[(X-\mu)^2]}{\varepsilon^2}=\frac{\sigma_X^2}{\varepsilon^2}. $$

### Forma para promedios (i.i.d.)
Si $\{X_k\}_{k=1}^n$ son i.i.d. y $\bar X_n=\tfrac1n\sum X_k$ ([[promedio-muestral]]),
como $V(\bar X_n)=\sigma_X^2/n$:
$$ P\big(|\bar X_n-\mu|\ge\varepsilon\big)\le\frac{\sigma_X^2}{n\,\varepsilon^2}\xrightarrow{n\to\infty}0. $$
Este es el puente directo a la [[ley-de-grandes-numeros|Ley de los Grandes Números]].

## Ejercicios resueltos

### Ejemplo 1 — el cañón (TP7, Chebyshev)
*([[tp7-suma-de-va]], ej. 3 de la guía, parte Chebyshev.) Un cañón acierta con
prob. $0.8$; $X$ = número de blancos en $100$ disparos independientes. Acotar
$P(70<X<90)$ con Chebyshev.*

**Planteo.** $X\sim\mathrm{Bin}(100,0.8)$, $E[X]=100\cdot0.8=80$,
$V(X)=100\cdot0.8\cdot0.2=16$.

**Reescritura simétrica.** $70<X<90 \iff |X-80|<10$, así que
$$ P(70<X<90)=P(|X-80|<10)=1-P(|X-80|\ge 10). $$

**Cota de Chebyshev** con $\varepsilon=10$:
$$ P(|X-80|\ge 10)\le\frac{16}{10^2}=0.16. $$

**Resultado.** $\;P(70<X<90)\ge 1-0.16=0.84.$
La cota es **correcta pero floja**: el valor verdadero (vía binomial/normal) es
$\approx 0.983$ — ver [[aproximacion-normal-de-la-binomial]]. Chebyshev sólo
garantiza $\ge 0.84$.

### Ejemplo 2 — el DJ y las canciones ([[video-desigualdades-y-lgn|clase]], Chebyshev)
*El DJ paga derechos por cada canción que pone en sus eventos. La cantidad de
canciones $M$ que toca por evento es discreta, con $E[M]=150$ y $V(M)=500$,
pero no conoce su distribución. Se quiere acotar $P(100<M<200)$.*

**Planteo.** El evento se reescribe como distancia a la media:
$$ 100<M<200 \iff |M-150|<50. $$
Por Chebyshev con $\varepsilon=50$:
$$ P(|M-150|\ge 50)\le\frac{V(M)}{50^2}=\frac{500}{2500}=0.2. $$

**Resultado.** $\;P(100<M<200)=1-P(|M-150|\ge 50)\ge 1-0.2=0.8.$ Aunque no se
conoce la distribución de $M$, se puede garantizar que al menos el $80\%$ de
las veces la cantidad de canciones que toca queda entre $100$ y $200$.

> Al pasar de $P(|M-150|\ge 50)\le 0.2$ a su complemento, la desigualdad se
> invierte ($\ge$ en vez de $\le$) — el mismo cuidado que en el ejercicio del
> cañón.

## Cota vs. probabilidad real (cuando se conoce la distribución)
[[video-desigualdades-y-lgn|El video de la clase]] (13:08–16:44) retoma estos
mismos ejemplos para mostrar **cuán bruta** es la cota, comparándola contra la
probabilidad real cuando sí se conoce (o se supone) la distribución:

- **Retomando el ejemplo de la basura** ([[video-desigualdades-y-lgn|Martín y la basura]], Markov, $E[B]=100$, cota
  $P(B\ge200)\le0.5$): si además se supone que $B$ es Normal de media $100$,
  la probabilidad real $P(B\ge200)$ resulta muchísimo menor que $0.5$ — tan
  chica que el docente comenta, a modo de ilustración, que tiene cientos de
  ceros decimales antes de la primera cifra significativa (menciona "321
  ceros"). Con una Exponencial de igual media el resultado es igualmente muy
  por debajo de $0.5$, aunque menos extremo por tener cola más pesada que la
  Normal.
- **Retomando el ejemplo del DJ** (Chebyshev, Ejemplo 2 arriba, cota
  $P(100<M<200)\ge0.8$): si se supone que $M$ es Normal o Gamma con la misma
  media ($150$) y varianza ($500$), la probabilidad real resulta **mucho más
  alta** que $0.8$, bastante más cerca de $1$.

> ⚠️ La cifra "321 ceros" es un comentario oral del docente, dado como
> ilustración de cuán chica resulta la probabilidad real frente a la cota — no
> un cálculo que se reproduzca aquí de forma verificada (el audio de la clase
> no permite confirmar con precisión los parámetros exactos que usó). Tómese
> como una indicación cualitativa ("la probabilidad real es astronómicamente
> menor que la cota"), no como un valor numérico exacto.

> [!figura] u7-cuanto-se-despega-la-cota-de-chebyshev
> Las dos colas sombreadas son la probabilidad real y las barras de la derecha la enfrentan con la cota $\sigma^2/\varepsilon^2$. Observe que la cota decae como $1/\varepsilon^2$ mientras la probabilidad real cae mucho más rápido, que con cola más pesada la brecha se achica, y que para $\varepsilon<\sigma$ la cota supera 1 y deja de decir nada.

**Conclusión del docente:** estas cotas sirven exactamente cuando no se conoce
nada más sobre la distribución; en cuanto se conoce (o se supone una familia
razonable), conviene calcular la probabilidad real en vez de usar Markov o
Chebyshev, porque la cota queda muy por encima (o su complemento muy por
debajo) del valor verdadero.

## Cuándo usarlas
- Cuando **no se conoce la distribución**, sólo media y/o varianza.
- Para **dimensionar tamaños de muestra** garantizando una cota (ej. 14, 15, 16 del [[tp7-suma-de-va]]).
- Para **demostrar la LGN débil**.

## Enlaces
- [[ley-de-grandes-numeros]] (consecuencia directa) · [[teorema-central-del-limite]] (da cotas más ajustadas).
- [[varianza]] · [[esperanza]] · [[promedio-muestral]].
