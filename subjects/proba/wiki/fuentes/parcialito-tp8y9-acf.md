---
titulo: Parcialito TP8 y TP9 (comisiones A, B y F)
resumen: "Resoluciones oficiales del parcialito de TP8 y TP9, comisiones A, B y F, con enunciados simbólicos: un intervalo de confianza deducido desde el teorema central del límite y un valor crítico de prueba sobre la media, con desvío conocido o desconocido."
tipo: fuente
formato: parcial
unidad: eval
archivo_raw: ["raw/12-evaluaciones/Resolucion_Parcialito_TP8y9_ComA.pdf", "raw/12-evaluaciones/Resolucion_Parcialito_TP8y9_ComB.pdf", "raw/12-evaluaciones/Resolucion_Parcialito_TP8y9_ComF.pdf"]
ingerido: 2026-09-04
actualizado: 2026-09-04
---

# Parcialito TP8 y TP9 (comisiones A, B y F)

**Qué es:** las resoluciones oficiales del **tercer parcialito** de la cursada
—el que cierra las guías TP8 (inferencia estadística) y TP9 (pruebas de
hipótesis)—, escritas por Lucio José Pantazis. Hay tres variantes conocidas, una
por comisión (A, B y F), de dos páginas y **dos ejercicios** cada una. Los
enunciados son **simbólicos**: no dan números, sino letras ($n$, $x$, $\mu_0$,
$\sigma$, $s$), de modo que el resultado esperado es una fórmula y no un valor.

**Cubre las unidades/temas:** unidad 8 (estimación puntual, TCL aplicado a la
media y a la proporción, [[intervalos-de-confianza|intervalos de confianza]]) y
unidad 9 ([[prueba-de-hipotesis|pruebas de hipótesis]] sobre la media, valor
crítico y región de rechazo).

## Los tres exámenes

| Comisión | Crudo | Ej. 1 — intervalo de confianza | Ej. 2 — valor crítico |
|---|---|---|---|
| A | `raw/12-evaluaciones/Resolucion_Parcialito_TP8y9_ComA.pdf` | Proporción $p$, confianza 94 %, límite **inferior** → $a=\hat p-z_{0{,}97}\sqrt{\hat p(1-\hat p)/n}$ | Media con $\sigma$ **conocido**, cola derecha, $\alpha=2\%$ → $x_c=\mu_0+z_{0{,}98}\,\sigma/\sqrt n$ |
| B | `raw/12-evaluaciones/Resolucion_Parcialito_TP8y9_ComB.pdf` | Media $\mu$ con $\sigma$ desconocido, confianza 88 %, límite **superior** → $b=\bar X_n+z_{0{,}94}\,s/\sqrt n$ | Media con $\sigma$ desconocido, $n=10$, cola izquierda, $\alpha=10\%$ → $t_c=-t_{9;\,0{,}9}$ |
| F | `raw/12-evaluaciones/Resolucion_Parcialito_TP8y9_ComF.pdf` | Media $\mu$ con $\sigma$ desconocido, confianza 92 %, límite **inferior** → $a=\bar X_n-z_{0{,}96}\,s/\sqrt n$ | Media con $\sigma$ desconocido, $n=12$, cola derecha, $\alpha=2{,}5\%$ → $t_c=t_{11;\,0{,}975}$ |

Las tres comisiones comparten el mismo relato de aula (un profesor que quiere
medir cuánto tardan o cuántos aciertan sus alumnos) y el mismo par de temas: un
intervalo construido a mano desde el TCL y un valor crítico controlando el error
tipo I. Lo que cambia entre ellas son tres perillas: **qué parámetro** se estima,
**qué extremo o qué cola** se pide y **si el desvío poblacional es dato o no**.

## Puntos clave

- **Patrón fijo del parcialito.** Ejercicio 1 = intervalo de confianza deducido
  desde cero (nunca "aplicar la fórmula"); Ejercicio 2 = valor crítico de una
  prueba sobre la media. Ver [[reconocer-prueba-de-hipotesis]].
- **El eje del Ejercicio 1 es qué se estima.** Si se estima una media, el punto
  de partida es $\bar X_n\overset{(a)}{\sim}\mathcal N(\mu,\sigma/\sqrt n)$ por
  [[teorema-central-del-limite|TCL]] (comisiones B y F). Si se estima una
  proporción, el punto de partida es $X_n\sim Bi(n,p)$ aproximada por normal, y
  al dividir por $n$ queda
  $\hat p\overset{(a)}{\sim}\mathcal N\big(p,\sqrt{p(1-p)/n}\big)$ (comisión A).
  Ver [[distribucion-binomial]] y [[aproximacion-normal-de-la-binomial]].
- **El desvío desconocido se reemplaza por [[ley-de-grandes-numeros|LGN]], no por
  t-Student, en el intervalo.** Las tres resoluciones justifican
  $\sigma\approx s$ (o $p\approx\hat p$) apelando a la ley de los grandes números
  y a que la diferencia, dividida por $\sqrt n$, es despreciable. El cuantil que
  usan sigue siendo $z$.
- **Traducir el nivel de confianza al cuantil.** Confianza $1-\alpha$ centrada
  deja $\alpha/2$ en cada cola, así que el cuantil es $z_{1-\alpha/2}$: 88 % →
  $z_{0{,}94}$, 92 % → $z_{0{,}96}$, 94 % → $z_{0{,}97}$. Ver
  [[estandarizacion-y-tabla-normal]].
- **El eje del Ejercicio 2 es si $\sigma$ es dato.** Con $\sigma$ conocido
  (comisión A) el estadístico es normal estándar y el valor crítico se puede dar
  en la escala del promedio: $x_c=\mu_0+z_{1-\alpha}\,\sigma/\sqrt n$. Con
  $\sigma$ desconocido y $n$ chico (comisiones B y F) el estadístico es
  $T=(\bar X_n-\mu)/(s/\sqrt n)\sim t_{n-1}$ y el valor crítico **debe** darse en
  la escala de $T$. Ver [[distribucion-t-de-student]] y
  [[prueba-de-hipotesis-para-la-media]].
- **El error que la cátedra marca en las tres.** Escribir
  $x_c=\mu_0\pm t_{n-1;\,q}\,s/\sqrt n$ cuando $\sigma$ es desconocido **no es un
  valor crítico válido**: $s$ se conoce después de tomar la muestra y la región
  de rechazo se fija antes. Es el mismo argumento que aparece en
  [[error-tipo-i-y-tipo-ii]] y en [[estadistico-de-prueba]].
- **La sospecha va siempre en $H_1$.** "Tardan demasiado" → $H_1:\mu>\mu_0$
  (comisiones A y F); "el tiempo disminuye" → $H_1:\mu<\mu_0$ (comisión B).

> ⚠️ Discrepancia: el PDF de la Comisión F arrastra dos erratas de copiado desde
> la resolución de la Comisión B. (i) En el armado del intervalo del Ejercicio 1
> las igualdades intermedias aparecen con $0{,}88$ aunque el enunciado pide 92 %;
> el cuantil que finalmente usa, $z_{0{,}96}$, sí corresponde al 92 %.
> (ii) El renglón de cierre rotula como $b$ al extremo inferior, cuando en la
> propia deducción $b$ es el superior; la fórmula
> $\bar X_n-z_{0{,}96}\,s/\sqrt n$ es correcta y corresponde a $a$. En el
> Ejercicio 2 el "error común" está escrito con el signo $<$ (cola izquierda,
> heredado de la Comisión B) cuando la prueba es de cola derecha.

## Ejercicio resuelto

**Comisión A, Ejercicio 1** (el más transferible: es el único de los tres que
estima una proporción). Fuente:
`raw/12-evaluaciones/Resolucion_Parcialito_TP8y9_ComA.pdf`.

**Enunciado.** Un profesor quiere estimar qué porcentaje de sus estudiantes sabe
resolver cierto ejercicio, mediante un intervalo de confianza del 94 %. Toma una
muestra de $n$ alumnos y observa que $x$ responden correctamente. Calcular el
límite inferior del intervalo.

**1. Parámetro y estimador.** Se estima $p$ = proporción poblacional de alumnos
que saben la respuesta, con la proporción muestral

$$ \hat p=\frac{X_n}{n},\qquad X_n=\#\text{ respuestas correctas}\sim Bi(n,p). $$

El denominador es fijo; el numerador es la variable aleatoria.

**2. Aproximación normal.** Por TCL la binomial se aproxima por una normal con su
misma media y su mismo desvío, y al dividir por $n$:

$$ X_n\overset{(a)}{\sim}\mathcal N\big(np;\ \sqrt{np(1-p)}\big) \quad\Longrightarrow\quad \hat p\overset{(a)}{\sim}\mathcal N\!\left(p;\ \sqrt{\tfrac{p(1-p)}{n}}\right). $$

**3. Estandarizar.** El estadístico pivote no depende de nada desconocido salvo
$p$, que es justamente lo que se quiere encerrar:

$$ \frac{\hat p-p}{\sqrt{p(1-p)/n}}\overset{(a)}{\sim}\mathcal N(0;1). $$

**4. Plantear el intervalo e invertir.**

$$ P(a\le p\le b)=0{,}94 \iff P\!\left(\frac{\hat p-a}{\sqrt{p(1-p)/n}}\ \ge\ \frac{\hat p-p}{\sqrt{p(1-p)/n}}\ \ge\ \frac{\hat p-b}{\sqrt{p(1-p)/n}}\right)=0{,}94. $$

**5. Eliminar el $p$ del desvío (LGN).** Para $n$ grande $p\approx\hat p$
y, dividido por $n$, la diferencia entre $\sqrt{p(1-p)/n}$ y
$\sqrt{\hat p(1-\hat p)/n}$ es despreciable, así que se reemplaza en los extremos.

**6. Cuantil.** El 94 % central deja $3\%$ en cada cola, de modo que el cuantil es
$z_{0{,}97}$ y

$$ a=\hat p-z_{0{,}97}\sqrt{\frac{\hat p(1-\hat p)}{n}},\qquad b=\hat p+z_{0{,}97}\sqrt{\frac{\hat p(1-\hat p)}{n}}. $$

**Resultado.** El límite inferior pedido es

$$ \boxed{\ a=\hat p-z_{0{,}97}\sqrt{\frac{\hat p\,(1-\hat p)}{n}}\ },\qquad \hat p=\frac{x}{n}. $$

## Páginas del wiki que toca

- [[intervalos-de-confianza|Intervalos de confianza]] — el Ejercicio 1 de las tres comisiones.
- [[prueba-de-hipotesis|Prueba de hipótesis]] y [[prueba-de-hipotesis-para-la-media|Prueba de hipótesis para la media]] — el Ejercicio 2 de las tres.
- [[prueba-de-hipotesis-para-la-proporcion|Prueba de hipótesis para la proporción]] — mismo estadístico pivote que el Ejercicio 1 de la Comisión A.
- [[estadistico-de-prueba|Estadístico de prueba]] y [[error-tipo-i-y-tipo-ii|Error tipo I y tipo II]] — el control $P(\text{rechazar }H_0\mid H_0)= \alpha$.
- [[teorema-central-del-limite|Teorema central del límite]] y [[ley-de-grandes-numeros|Ley de los grandes números]] — las dos herramientas que sostienen los intervalos.
- [[distribucion-normal|Distribución normal]] y [[estandarizacion-y-tabla-normal|Estandarización y tabla normal]] — los cuantiles $z_{0{,}94}$, $z_{0{,}96}$, $z_{0{,}97}$, $z_{0{,}98}$.
- [[distribucion-t-de-student|Distribución t de Student]] — los valores críticos $t_{9;\,0{,}9}$ y $t_{11;\,0{,}975}$.
- [[distribucion-binomial|Distribución binomial]] y [[aproximacion-normal-de-la-binomial|Aproximación normal de la binomial]] — el punto de partida del Ejercicio 1 de la Comisión A.
- [[promedio-muestral|Promedio muestral]], [[varianza-muestral|Varianza muestral]] y [[estimacion-puntual|Estimación puntual]] — $\bar X_n$, $s$ y $\hat p$ como estimadores.
- [[reconocer-prueba-de-hipotesis|Reconocer una prueba de hipótesis]] — cómo decidir cola y estadístico desde el relato.
- [[inferencia-estadistica|Inferencia estadística]] y [[poblacion-y-muestra|Población y muestra]] — marco general.
- [[evaluaciones|Evaluaciones (parciales y finales)]] — catálogo de `raw/12-evaluaciones/`.
