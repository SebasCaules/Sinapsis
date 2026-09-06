---
titulo: "Video — Normales"
resumen: "Clase en video de Lucio Pantazis (unidad 4) sobre la distribución normal: densidad y parámetros, derivación de la esperanza y la varianza, estandarización, uso de las tablas de acumulada y de cuantiles, interpolación y regla empírica."
tipo: fuente
formato: video
unidad: 4
url: "https://youtu.be/4BIldkdAKro"
duracion: "40:42"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Normales

**Qué es:** clase teórica en video sobre la distribución normal, desde la
motivación (longitud de termómetros) hasta la tabla de $\Phi$, la
estandarización y la tabla de cuantiles.
**Cubre:** densidad y parámetros de $N(\mu,\sigma)$, derivación de $E[X]$ y
$V(X)$, FDA sin forma cerrada, estandarización, uso de tablas (acumulada y
cuantiles), interpolación, transformación lineal y regla empírica.
**Guía asociada:** Guía 4

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:05] | Motivación: longitud de termómetros que "en teoría" miden 10 cm pero varían; forma de campana (Gauss) |
| [04:48] | Densidad general $f_X(x)=\frac{1}{\sqrt{2\pi}\sigma}e^{-(x-\mu)^2/(2\sigma^2)}$; por qué $\mu$ y $\sigma$ son media y desvío |
| [06:02] | Por qué la normal es la más versátil: cambiando $\mu,\sigma$ se obtiene cualquier campana, a diferencia de otras distribuciones vistas (p. ej. uniforme) |
| [08:56] | Que la constante de normalización integra 1 requiere integral doble + coordenadas polares (no se demuestra en clase) |
| [10:59] | Derivación de $E[X]=\mu$ con la sustitución $z=\frac{x-\mu}{\sigma}$ y el argumento de función impar |
| [16:27] | Cálculo de $E[X^2]$ y $V(X)=\sigma^2$ (con un error de cálculo en vivo, corregido) |
| [18:47] | FDA de la normal: no tiene primitiva; se resuelve estandarizando, $F_X(t)=\Phi\!\left(\frac{t-\mu}{\sigma}\right)$ |
| [22:33] | Ejemplo visual: dos normales con $\mu,\sigma$ distintos, cómo la estandarización vincula sus áreas |
| [24:46] | Tabla de $\Phi(t)$: cómo leerla (fila = dos primeros decimales, columna = tercer decimal) |
| [27:09] | Simetría para valores negativos: $\Phi(z)=1-\Phi(-z)$ |
| [29:31] | Interpolación lineal para $z$ con más de dos decimales; comparación de precisión con un valor de software |
| [32:15] | Ejemplo de los termómetros estandarizado: $F_X(10.05)$ |
| [33:58] | Cuantiles: tabla de $\Phi^{-1}(\alpha)$ y cómo leerla |
| [36:34] | Cuantiles con $\alpha<0.5$ usando simetría; advertencia sobre un error común |
| [38:16] | Cierre: transformación lineal $Y=aX+b\sim N(a\mu+b,\lvert a\rvert\sigma)$; regla empírica 68-95-99.7; asimetría y curtosis nulas |

## Qué aporta sobre el apunte

- **(a) Ejemplo motivador nuevo (numérico).** El video usa como ejemplo
  conductor la **longitud de un termómetro** $X\sim N(10,\,0.1)$ —cm—, distinto
  del ejemplo de consumo de combustible de [[teorica-va-normal]] (ya
  documentado en [[distribucion-normal]]). Aporta números concretos que
  muestran por qué, aunque el soporte teórico sea $\mathbb{R}$, la probabilidad
  fuera de $[\mu-5\sigma,\mu+5\sigma]$ es despreciable para un modelo físico:
  $P(X\le9.5)\approx2.9\times10^{-7}$ y $P(X\le10.5)\approx0.9999997$ [02:44].
  También un caso de estandarización simple y completo,
  $F_X(10.05)=\Phi(0.5)=0.6915$ [32:15], que complementa
  [[estandarizacion-y-tabla-normal]] con un ejemplo de un solo paso (útil como
  primer contacto, antes de los ejercicios más largos ya documentados ahí).
- **(b) Intuición no escrita en el apunte: de dónde sale $E[X]=\mu$ y
  $V(X)=\sigma^2$.** [[teorica-va-normal]] y [[distribucion-normal]] enuncian
  estos resultados pero no los derivan. El video hace la demostración completa
  vía la sustitución $z=\frac{x-\mu}{\sigma}$ y el argumento de que
  $z\cdot\varphi(z)$ es una función **impar** (se cancela al integrar en un
  dominio simétrico) — ver el ejercicio resuelto abajo.
- **(b) Intuición geométrica sobre $\sigma$.** Explica por qué un $\sigma$
  mayor aplana la campana: al dividir por un $\sigma$ más grande, el exponente
  crece más lento aunque la diferencia $x-\mu$ sea grande, así que la densidad
  "baja más lentamente" [09:54]. Complementa (sin repetir) la intuición ya
  escrita en [[distribucion-normal]] sobre por qué una sola tabla alcanza para
  todas las normales.
- **(c) Advertencia — cuantiles y simetría.** *"Ojo con usar esto para los
  cuantiles porque está mal mal mal. Siempre traten de hacer el dibujito
  porque los ayuda a pensar."* [38:16–38:32]. Advertencia explícita contra
  aplicar de memoria la relación $z_\alpha=-z_{1-\alpha}$ sin dibujar primero
  la campana y ubicar las áreas — es un error frecuente al despejar cuantiles
  con $\alpha<0.5$.
- **(c) Advertencia — cuidado con integrales donde la variable de integración
  aparece elevada al cuadrado.** Al calcular $E[X^2]$ en vivo, el docente
  omite meter $z^2$ dentro de la integral de $\int z^2\varphi(z)\,dz$ (no se
  puede sacar de la integral porque depende de $z$) y se autocorrige
  [17:39–18:03]: *"acá [sic] me falta una integral más, que es este por $z^2$... no
  lo puedo sacar de la integral porque depende de $z$."* Vale como advertencia
  de un error común al manipular esta clase de integrales.
- **(d) Énfasis.** Insiste varias veces en que el "salto" de estandarizar
  antes de usar la tabla **se puede saltear en la práctica**, pero pide
  entenderlo al menos una vez: *"ustedes pueden saltar tranquilamente de acá [sic] a
  acá, pero al menos alguna vez quiero que entiendan de dónde viene este
  salto"* [33:45]. También remarca con un ejemplo numérico que **interpolar es
  mucho más preciso que redondear** al valor de tabla más cercano — ver el
  aporte propuesto a [[estandarizacion-y-tabla-normal]].

## Ejercicio resuelto en clase

**Fuente:** derivación en vivo en la teórica (no es un ejercicio de guía),
[10:59]–[18:47].

**Enunciado.** Mostrar que si $X\sim N(\mu,\sigma)$, con densidad
$$ f_X(x)=\frac{1}{\sqrt{2\pi}\,\sigma}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}, $$
entonces $E[X]=\mu$ y $V(X)=\sigma^2$ (es decir, que los parámetros son
efectivamente la media y el desvío).

**Planteo.** Sustituir $z=\dfrac{x-\mu}{\sigma}$, de donde $dz=\dfrac{dx}{\sigma}$
y $x=\mu+z\sigma$. Con esto, $f_X(x)\,dx$ se transforma en
$\varphi(z)\,dz=\dfrac{1}{\sqrt{2\pi}}e^{-z^2/2}\,dz$, la densidad de una
$N(0,1)$.

**Cálculo — $E[X]$.**
$$
E[X]=\int_{-\infty}^{+\infty} x\,f_X(x)\,dx
=\int_{-\infty}^{+\infty} (\mu+z\sigma)\,\varphi(z)\,dz
=\mu\underbrace{\int_{-\infty}^{+\infty}\varphi(z)\,dz}_{=1}
+\sigma\underbrace{\int_{-\infty}^{+\infty} z\,\varphi(z)\,dz}_{=0}.
$$
La segunda integral vale $0$ porque $z\,\varphi(z)$ es una función **impar**
($\varphi$ es par y $z$ es impar): lo que se acumula entre $-\infty$ y $0$ es
exactamente lo opuesto de lo que se acumula entre $0$ y $+\infty$, y como
ambas partes convergen, se cancelan. Por lo tanto,
$$ E[X]=\mu\cdot1+\sigma\cdot0=\mu. $$

**Cálculo — $V(X)$ (vía $E[X^2]$).** Con la misma sustitución,
$$
E[X^2]=\int_{-\infty}^{+\infty} (\mu+z\sigma)^2\,\varphi(z)\,dz
=\int_{-\infty}^{+\infty}\big(\mu^2+2\mu\sigma z+\sigma^2 z^2\big)\varphi(z)\,dz.
$$
Separando en tres integrales:
$$
E[X^2]=\mu^2\underbrace{\int\varphi(z)\,dz}_{=1}
+2\mu\sigma\underbrace{\int z\,\varphi(z)\,dz}_{=0}
+\sigma^2\underbrace{\int z^2\,\varphi(z)\,dz}_{=1}.
$$
La tercera integral es el segundo momento de la $N(0,1)$, que también vale
$1$ (aquí es donde el docente omite en el pizarrón, por error, meter el
factor $z^2$ dentro de la integral —no se puede sacar porque depende de la
variable de integración— y se autocorrige). Entonces
$$ E[X^2]=\mu^2+\sigma^2. $$

**Resultado.**
$$ V(X)=E[X^2]-E[X]^2=(\mu^2+\sigma^2)-\mu^2=\sigma^2. $$
Queda mostrado que $E[X]=\mu$ y $V(X)=\sigma^2$: los parámetros con los que se
define $N(\mu,\sigma)$ son, efectivamente, la media y el desvío de la
variable.

### Ejemplo adicional — estandarización de un valor puntual
**Fuente:** [32:15].

**Enunciado.** Para la longitud de los termómetros, $X\sim N(10,\,0.1)$.
Calcular $F_X(10.05)=P(X\le10.05)$.

**Cálculo.**
$$ F_X(10.05)=P\!\left(\frac{X-10}{0.1}\le\frac{10.05-10}{0.1}\right)=P(Z\le0.5)=\Phi(0.5)=0.6915. $$

**Resultado.** $P(X\le10.05)\approx0.6915$.

## Advertencias del docente

- No usar la relación $z_\alpha=-z_{1-\alpha}$ "de memoria" para cuantiles:
  *"está mal mal mal"*; siempre dibujar la campana y marcar las áreas antes de
  aplicarla [38:16].
- Al calcular integrales donde la variable de integración aparece con
  potencia (p. ej. $z^2$), no se puede sacar ese factor fuera de la integral
  — es un error fácil de cometer en el pizarrón; el docente lo detecta sobre
  la marcha y se corrige en el momento [17:39].
- Recuerda que, aunque en la práctica se puede ir directo de $X$ a la tabla
  de $\Phi$, vale la pena entender **al menos una vez** de dónde sale el
  "salto" de estandarizar [33:45].

## Páginas del wiki que toca

- [[distribucion-normal|Distribución Normal]]
- [[estandarizacion-y-tabla-normal|Estandarización y uso de la tabla Z]]
- [[variable-aleatoria-continua|Variable aleatoria continua]]
- [[funcion-de-densidad|Función de densidad]]
