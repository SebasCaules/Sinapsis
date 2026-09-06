---
titulo: "Video — Valor Esperado Condicional"
resumen: "Clase en video de Lucio Pantazis (unidad 5) sobre esperanza y varianza condicionales como funciones de X, con la demostración de la ley de esperanza total y de la ley de varianza total, aplicadas a ejemplos ya trabajados en clase."
tipo: fuente
formato: video
unidad: 5
url: "https://youtu.be/mgGr9cgCn0Y"
duracion: "22:57"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Valor Esperado Condicional

**Qué es:** clase de cierre de guía de Lucio Pantazis sobre cómo sistematizar el vínculo entre dos
variables mediante el valor esperado y la varianza condicionales, vueltos a aplicar sobre dos
ejemplos ya trabajados en clases anteriores.
**Cubre:** definición de $E(Y\mid X)$ como función $g(X)$, ley de esperanza total (demostración),
propiedad $E(f(X)\mid X)=f(X)$ y su uso para simplificar covarianzas, varianza condicional y ley de
varianza total (demostración), aplicadas sobre una vuelta al ejemplo continuo de banana y dulce de
leche.
**Guía asociada:** Guía 5.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Retoma el ejemplo de las filas de supermercado ($M$ = artículos máximos de la caja, $N$ = personas en la fila) ya resuelto por fuerza bruta en [[video-vad-2d]]. |
| [01:34] | Nota que $N\mid M{=}i$ tiene estructura de $\text{Binomial}(8-\tfrac{i}{10},\,3/4)$ conocida. |
| [04:20] | Para cada valor de $M$, $N$ tiene su propio valor esperado y varianza: la idea de "una función que depende de $M$". |
| [06:59] | Definición formal: $E(Y\mid X)$ es una función $g(X)$ que da el valor promedio de $Y$ para cada $x$. |
| [08:15] | Por qué se condiciona $N$ a $M$ y no al revés: $M\mid N$ no tiene una estructura conocida. |
| [08:56] | Demostración de la ley de esperanza total, $E(Y)=E(E(Y\mid X))$, a partir de conjunta = condicional × marginal. |
| [10:21] | Recalcula $E(N)=7/2$ con la fórmula: mucho más corto que la suma directa. |
| [11:34] | Propiedad $E(f(X)\mid X)=f(X)$: al condicionar a $X$, $X$ queda fijo (constante). |
| [12:07] | Aplica la propiedad a la covarianza: $E(M\cdot N)$ vía $E(M\cdot E(N\mid M))$; obtiene $\text{Cov}(M,N)=-50/3$. |
| [14:20] | Introduce la varianza condicional y demuestra $V(Y)=E(V(Y\mid X))+V(E(Y\mid X))$. |
| [17:58] | Recalcula $V(N)=17/8$ con la fórmula. |
| [18:56] | Aclara que las mismas propiedades valen para variables continuas. |
| [19:10] | Vuelve al ejemplo continuo de banana y dulce de leche de [[video-vac-2d]], ahora con la conjunta no uniforme: $B\sim\mathcal U(0,4)$, $D\mid B{=}b\sim\mathcal U(2b,4b)$; calcula $E(D)=6$ y $V(D)$. |
| [22:37] | Cierre de la clase. |

## Qué aporta sobre el apunte

La definición de $E(X\mid Y)$, la ley de esperanza total y la ley de varianza total ya están
desarrolladas en [[esperanza-condicional]] a partir de [[teorica-bidimensionales-vac-intro]] y del
[[tp5-2024]], con dos ejercicios resueltos (cilindro y subte/colectivo). Lo que aporta este video:

- **(a) Dos ejercicios resueltos, ambos reutilizando ejemplos ya ingeridos** pero con un aporte real
  de método:
  - la vuelta al ejemplo discreto de las cajas del supermercado ([[video-vad-2d]]), resuelto
    por el atajo de la condicional en vez de sumas largas — mismos resultados finales
    ($E(N)=7/2$, $\text{Cov}(M,N)=-50/3$) obtenidos en una línea en vez de sumar decenas de
    términos, más un dato nuevo que esa clase no había calculado ($V(N)=17/8$);
  - una vuelta al ejemplo **continuo** de banana y dulce de leche ya introducido en
    [[video-vac-2d]] ($B\sim\mathcal U(0,4)$, $D\mid B=b$ entre $2b$ y $4b$), pero con la premisa
    cambiada: allí la conjunta se planteaba uniforme sobre el triángulo; aquí el docente aclara que
    la conjunta **no** es uniforme y que lo único uniforme es la condicional $D\mid B$. El aporte
    no es el ejemplo en sí (ya está en [[video-vac-2d]]) sino resolverlo con el atajo de la
    condicional y la aclaración conceptual de (e) más abajo.
- **(b) Una propiedad no explicitada en el wiki todavía:** $E(f(X)\mid X)=f(X)$, y su consecuencia
  práctica $E(s(X)\cdot t(Y)\mid X)=s(X)\cdot E(t(Y)\mid X)$ — "lo que depende de $X$ sale afuera"
  al condicionar a $X$. Es justamente la herramienta que permite calcular $E(XY)$ (y por lo tanto
  la covarianza) sin plantear la suma/integral doble completa. Propuesto como aporte a
  [[esperanza-condicional]] (ver más abajo).
- **(c) La demostración en pizarrón** de ambas leyes (esperanza total y varianza total), que en el
  wiki hasta ahora solo estaban enunciadas y aplicadas, no demostradas paso a paso.
- **(d) Un criterio de cuándo conviene usar esta técnica**, explicado en varias oportunidades
  ([08:15]–[08:28], [10:52]–[11:07]): condicionar la variable "difícil" a la "fácil" (la que tiene
  estructura conocida, como binomial o uniforme), nunca al revés, y usarlo quando la condicional
  resulta más simple que integrar/sumar la conjunta completa. Es una heurística de reconocimiento
  de patrón que no está expresada así en las teóricas ya ingeridas.
- **(e) Una aclaración conceptual** ([19:53]–[20:09]): que todas las condicionales de un vector sean
  uniformes **no** implica que la conjunta sea uniforme (lo muestra explícitamente con el ejemplo de
  banana/dulce de leche, cuya conjunta no es constante en el soporte pese a que $D\mid B$ sí lo es).

## Ejercicio resuelto en clase

### 1. Atajo por condicional sobre el ejemplo de las cajas del supermercado

**(Desde [00:04].)** Retoma el ejemplo de [[video-vad-2d]]: $M\in\{20,40,60\}$ es la cantidad
máxima de artículos de la caja elegida, con $P(M=i)=\tfrac{80-i}{120}$, la misma marginal usada en
esa clase para obtener $E(M)=\tfrac{100}{3}$. De esa misma marginal se obtiene también
$E(M^2)=400\cdot\tfrac12+1600\cdot\tfrac13+3600\cdot\tfrac16=\tfrac{4000}{3}$ y por lo tanto
$V(M)=E(M^2)-E^2(M)=\tfrac{4000}{3}-\left(\tfrac{100}{3}\right)^2=\tfrac{2000}{9}$ — dato que
[[video-vad-2d]] señala explícitamente como no calculado en esa clase (solo deja planteada la
covarianza como cierre) y que se deriva aquí a partir de su misma marginal. $N$ es la cantidad de
personas por delante en la fila.

**Planteo — reconocer la estructura condicional [01:34].** La distribución condicional
$N\mid M=i$ resulta

$$
p_{N\mid M=i}(j)=\binom{8-\frac{i}{10}}{j}\left(\frac34\right)^{j}\left(\frac14\right)^{8-\frac{i}{10}-j},\qquad 0\le j\le 8-\frac{i}{10},
$$

es decir $N\mid M=i\sim\text{Bi}\!\left(8-\tfrac{i}{10},\,\tfrac34\right)$. Por lo tanto, sin sumar
nada, ya se conocen su valor esperado y varianza para cada $i$:

$$
E(N\mid M=i)=\left(8-\frac{i}{10}\right)\frac34=6-\frac{3i}{40},\qquad
V(N\mid M=i)=\left(8-\frac{i}{10}\right)\frac34\cdot\frac14=\frac32-\frac{3i}{160}.
$$

Vistas como funciones de la variable $M$ (no de un valor fijo $i$):

$$
E(N\mid M)=g(M)=6-\frac{3M}{40},\qquad V(N\mid M)=h(M)=\frac32-\frac{3M}{160}.
$$

**Cálculo — $E(N)$ vía esperanza total [10:21].**

$$
E(N)=E\big(E(N\mid M)\big)=E\left(6-\frac{3M}{40}\right)=6-\frac{3}{40}E(M)=6-\frac{3}{40}\cdot\frac{100}{3}=\frac72.
$$

**Resultado.** $E(N)=\tfrac72$, idéntico al obtenido en [[video-vad-2d]] sumando directamente sobre
toda la conjunta, pero en una línea en vez de una suma extensa.

**Cálculo — $\text{Cov}(M,N)$ usando $E(f(X)\mid X)=f(X)$ [12:07].** Para la covarianza hace falta
$E(M\cdot N)$. Como $M$ queda fijo al condicionar a $M$, "sale afuera" de la esperanza condicional:

$$
E(M\cdot N)=E\big(E(M\cdot N\mid M)\big)=E\big(M\cdot E(N\mid M)\big)=E\left(M\cdot\left(6-\frac{3M}{40}\right)\right)
=6\,E(M)-\frac{3}{40}\,E(M^2).
$$

Con $E(M^2)=V(M)+E^2(M)=\tfrac{2000}{9}+\left(\tfrac{100}{3}\right)^2=\tfrac{4000}{3}$:

$$
E(M\cdot N)=6\cdot\frac{100}{3}-\frac{3}{40}\cdot\frac{4000}{3}=200-100=100.
$$

$$
\text{Cov}(M,N)=E(M\cdot N)-E(M)\,E(N)=100-\frac{100}{3}\cdot\frac72=100-\frac{350}{3}=-\frac{50}{3}.
$$

**Resultado.** $\text{Cov}(M,N)=-\tfrac{50}{3}$, el mismo valor de [[video-vad-2d]].

**Cálculo — $V(N)$ vía varianza total [17:58].**

$$
V(N)=E\big(V(N\mid M)\big)+V\big(E(N\mid M)\big)=E\left(\frac32-\frac{3M}{160}\right)+V\left(6-\frac{3M}{40}\right)
=\frac32-\frac{3}{160}E(M)+\left(\frac{3}{40}\right)^2 V(M).
$$

$$
V(N)=\frac32-\frac{3}{160}\cdot\frac{100}{3}+\frac{9}{1600}\cdot\frac{2000}{9}=\frac32-\frac58+\frac54=\frac{17}{8}.
$$

**Resultado.** $V(N)=\tfrac{17}{8}$ (dato nuevo: [[video-vad-2d]] no lo había calculado).

### 2. Vuelta al ejemplo de banana y dulce de leche, con la conjunta ya no uniforme

**(Desde [19:10].)** Se retoma el ejemplo de consumo conjunto de banana ($B$) y dulce de leche
($D$) ya introducido en [[video-vac-2d]] (mismo soporte $0\le b\le4$, $2b\le d\le4b$), pero
cambiando la premisa: el docente aclara en clase que "supónganse que aquí Andrea se equivocó y ya
no es uniforme" — la densidad conjunta ya no es uniforme; lo que sí es uniforme es la condicional:

$$
B\sim\mathcal U(0,4),\qquad D\mid B=b\sim\mathcal U(2b,4b).
$$

**Planteo.** De la uniforme condicional se conocen directamente su esperanza y varianza:

$$
E(D\mid B)=3B,\qquad V(D\mid B)=\frac{(2B)^2}{12}=\frac{B^2}{3}.
$$

**Cálculo — $E(D)$.** Con $B\sim\mathcal U(0,4)$, $E(B)=2$:

$$
E(D)=E\big(E(D\mid B)\big)=E(3B)=3\,E(B)=6.
$$

**Cálculo — $V(D)$.** Con $V(B)=\tfrac{4}{3}$ (varianza de $\mathcal U(0,4)$):

$$
V(D)=E\big(V(D\mid B)\big)+V\big(E(D\mid B)\big)=E\left(\frac{B^2}{3}\right)+V(3B)
=\frac13\big(V(B)+E^2(B)\big)+3^2\,V(B).
$$

$$
V(D)=\frac13\left(\frac43+4\right)+9\cdot\frac43=\frac{16}{9}+12=\frac{124}{9}.
$$

> ⚠️ **Discrepancia con la diapositiva.** La diapositiva de la clase (t≈22:20) muestra este mismo
> desarrollo pero escribe el resultado final como $\tfrac{52}{9}$ en vez de $\tfrac{124}{9}$. Los
> dos términos intermedios que sí se leen en la diapositiva —
> $\tfrac13\left(\tfrac43+2^2\right)=\tfrac{16}{9}$ y $9\cdot\tfrac43=12$— suman $\tfrac{124}{9}$
> (verificado dos veces sobre el frame de la clase), no $\tfrac{52}{9}$: parece un error aritmético
> del docente al sumar esos dos términos en la diapositiva, no un error de transcripción. El wiki
> registra aquí el resultado correctamente derivado, $V(D)=\tfrac{124}{9}$, y deja constancia de que
> el valor que aparece escrito en la clase es distinto.

**Resultado.** $E(D)=6$ y $V(D)=\tfrac{124}{9}$ (según el cálculo verificado; la diapositiva de la
clase dice $\tfrac{52}{9}$, ver discrepancia arriba).

## Advertencias del docente

- **[07:57]–[08:11]** "Yo planteé $N$ condicional a la $M$, pero podría haber planteado $M$
  condicional a la $N$. Lo que pasa es que $M$ condicional a la $N$ ya no tiene estructura. Es más
  difícil de decir: 'Ah, bueno, este es el valor esperado, esta es la varianza.'" — la elección de qué variable
  condicionar a cuál no es arbitraria: se condiciona la variable sin estructura conocida a la que
  sí la tiene.
- **[19:53]–[20:09]** Sobre el ejemplo de banana/dulce de leche: "podemos ver que ojo, que no es que
  esta combinación me queda uniforme, porque no es así […] porque la conjunta no es uniforme, pero
  no es lo que queremos ver ahora." Advertencia explícita de que una condicional uniforme **no**
  implica una conjunta uniforme.
- **[22:37]–[22:52]** Cierre general: "esto como quizás difícil de entender, pero realmente ahorra
  muchas cuentas en caso de que tengamos una suma muy extensa y que podamos identificar una
  estructura condicional de las variables entre sí" — remarca que el valor de la técnica es
  computacional (ahorrar cuentas), no solo teórico.

## Páginas del wiki que toca

- [[esperanza-condicional]]
- [[variables-aleatorias-bidimensionales]]
- [[covarianza-y-correlacion]]
- [[independencia-de-variables-aleatorias]]
- [[funcion-de-variable-aleatoria]]
- [[mezcla-de-distribuciones]]
