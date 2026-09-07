---
title: Teoría de la información
resumen: 'Vocabulario de Shannon —bit frente a binary digit, entropía, entropía condicional, información mutua y capacidad de canal— y la traducción del secreto perfecto a ese lenguaje: información mutua nula entre mensaje y cifrado.'
aliases: [Teoría de la información, Teoria de la informacion, Entropía, Entropia, Información mutua, Capacidad de canal, Teoremas de codificación de Shannon]
type: apunte
clase: 1
orden: 31
created: 2026-08-24
updated: 2026-09-04
tags: [apunte, teoria-de-la-informacion, entropia, informacion-mutua, capacidad-de-canal, shannon, secreto-perfecto, sin-fecha-asignada]
sources: ["informationtheory.pdf — J. V. Stone, Information Theory: A Tutorial Introduction, arXiv:1802.05968v1, 2018"]
---

# Teoría de la información

> **Fuente:** [`informationtheory.pdf`](../../raw/apuntes/informationtheory.pdf) — *Information Theory: A Tutorial Introduction*, **James V. Stone** (Psychology Department, University of Sheffield), arXiv:1802.05968v1, 2018. 23 páginas, **en inglés**. · Puente principal con la materia: [[secreto-perfecto|Secreto perfecto]]

Esta nota trae **de dónde sale el vocabulario de Shannon** —bit, entropía, entropía condicional, información mutua, capacidad de canal, los dos teoremas de codificación— y, sobre todo, **cómo se traduce el secreto perfecto a ese vocabulario**. Shannon es el mismo autor de las dos cosas: la teoría de la comunicación (1948) y la teoría del secreto (1949). Esta nota cubre la primera y arma el puente con la segunda, que es lo único de acá que la materia usa.

**Atajo:** para quien llega por el parcial, la sección que importa es la [[#8. El puente con criptografía|§8 — El puente con criptografía]]. Todo lo anterior es el andamiaje mínimo para poder leerla. *(En toda la nota, §N refiere a las secciones **de esta nota**; cuando se cita una sección del paper se dice "sección N del paper".)*

---

## 1. Aviso previo: esta fuente no tiene clase asignada

Hay que decirlo antes que nada, porque cambia cómo se estudia:

| Pregunta | Respuesta |
|---|---|
| ¿A qué clase pertenece? | **No se sabe.** El PDF está suelto en `raw/apuntes/` sin ningún contexto: ni fecha, ni mención en las filminas, ni referencia en un apunte de clase |
| ¿La nombra el [[programa-y-objetivos\|programa]]? | **No.** El programa no menciona teoría de la información, ni entropía, ni Shannon como tema. Tampoco aparece en el [[cronograma]] |
| ¿Está en la [[bibliografia\|bibliografía]] de la cátedra? | **No.** No es Katz & Lindell ni Bishop ni ninguno de los cinco libros de consulta |
| Entonces, ¿qué es? | **Material de apoyo sin fecha.** Alguien lo guardó en el vault; el vault no dice quién ni para qué |

**Por contenido se apoya sobre la [[clase-01-introduccion-y-criptografia-clasica|Clase 1]]** *(lectura nuestra)*: la Clase 1 cierra en [[secreto-perfecto|secreto perfecto]] y enuncia el teorema de Shannon $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$, y este tutorial da exactamente el lenguaje en el que ese teorema fue enunciado originalmente. Lo más cercano que el programa tiene a un gancho es el ítem *"Criptosistemas clásicos · One-time pad · **Modelos teóricos**"* de la Clase 1 — pero eso es una inferencia nuestra, no una afirmación de la cátedra.

> **Por qué no le corresponde una nota de concepto numerada.** El esquema de la wiki numera los conceptos como `<unidad>.<clase>.<orden>`, y los tres números salen de **qué clase introduce el concepto**. Acá no hay clase, así que no hay número posible sin inventarlo. Además, los conceptos criptográficos que este material ilumina **ya tienen su nota**: [[secreto-perfecto|secreto perfecto]], [[one-time-pad|one time pad]], [[generador-pseudoaleatorio|generador pseudoaleatorio]]. Lo de acá es la **relectura en clave de entropía** de esas notas, no un concepto nuevo del curso. Se queda en `apuntes/`.

También conviene tener presente **qué tipo de texto es**: es un tutorial de comunicaciones y neurociencia (el autor es psicólogo y lo aplica a sistemas biológicos), **no un texto de criptografía**. En sus 23 páginas no aparece **ni una vez** ninguna de las palabras *cipher*, *encrypt*, *secret*, *secrecy* ni *adversary*; *key* aparece dos veces y en las dos es *"key scientific problems"* / *"Key Equations"*, nada que ver con una clave criptográfica. *(Contado por nosotros sobre el texto del PDF.)* Todo el puente con la materia de la §8 está marcado como lectura nuestra.

---

## 2. Un bit no es un binary digit

Es la insistencia central del tutorial —le dedica una sección entera, la **sección 3 del paper**— y es lo que después habilita todo:

> - Un **binary digit** es el valor de una variable binaria: un símbolo, un $0$ o un $1$. Es un **recipiente**.
> - Un **bit** es una **cantidad de información**. Es el **contenido**.
>
> Confundirlos es un error de categoría — la analogía del tutorial: es como confundir una botella de un litro con un litro de leche (en el original, una pinta). Una botella de un litro puede contener entre cero y un litro; un binary digit, promediado sobre sus dos estados, puede transportar **entre 0 y 1 bit** de información.

Un binary digit transporta exactamente 1 bit **sólo si sus dos estados son equiprobables**. Si están sesgados, transporta menos, y el recipiente viaja medio vacío.

El origen de la unidad, en el ejemplo del tutorial: parado en una bifurcación con dos caminos igualmente probables, saber cuál tomar es **un bit**. Con $n$ bifurcaciones se llega a $m = 2^{n}$ destinos, o al revés: $n = \log_2 m$. De ahí sale el logaritmo base 2, y de ahí que todos los logaritmos del texto sean base 2 salvo aclaración.

> **Esta distinción es la §8.4 de esta nota.** Es exactamente la que hace falta para entender por qué **una clave de 56 binary digits sesgada no vale 56 bits de seguridad**, y por qué la clave de [[des-y-3des|DES]] tiene 64 binary digits pero sólo 56 bits.

---

## 3. Información de Shannon y entropía

### Sorpresa

La **información de Shannon** (o *surprisal*) de un resultado $x$ con probabilidad $p(x)$:

$$\text{información de Shannon}(x) = \log_2 \frac{1}{p(x)} = -\log_2 p(x) \ \text{ bits}$$

Cuanto más improbable el resultado, más sorprende, más información trae. Un resultado seguro ($p = 1$) trae $0$ bits: ya lo sabías.

### Entropía = sorpresa promedio

La **entropía** de una variable aleatoria $x$ con distribución $p(x) = \{p(x_1), \dots, p(x_m)\}$ es el promedio de la sorpresa, pesado por la propia distribución:

$$H(x) = \sum_{i=1}^{m} p(x_i)\, \log_2 \frac{1}{p(x_i)} \ \text{ bits}$$

> **Entropía e información son la misma cuenta con distinto signo pedagógico.** Si una variable tiene entropía alta, la incertidumbre inicial sobre ella es grande —y vale exactamente su entropía—. Al conocer su valor, se recibe una cantidad de información igual a la incertidumbre que se elimina. *Recibir información es que se elimine entropía.*

### Los tres ejemplos numéricos del tutorial

| Caso | Distribución | Cuenta | $H$ |
|---|---|---|---|
| **Moneda justa** | $p(\text{cara}) = p(\text{cruz}) = 0{,}5$ | $\log_2(1/0{,}5) = 1$ para las dos caras | $1$ bit |
| **Moneda sesgada** | $p(\text{cara}) = 0{,}9$ | $0{,}9 \cdot \log_2(1/0{,}9) + 0{,}1 \cdot \log_2(1/0{,}1) = 0{,}9\cdot 0{,}152 + 0{,}1 \cdot 3{,}322$ | $\mathbf{0{,}469}$ bits |
| **Suma de dos dados** | 11 valores, $\{1/36, \dots, 6/36, \dots, 1/36\}$ | $\sum_{i=1}^{11} p(x_i)\log_2(1/p(x_i))$ | $\mathbf{3{,}27}$ bits |

De la moneda sesgada salen los dos números que más se reusan en esta nota: **cada resultado cara aporta $0{,}152$ bits y cada cruz $3{,}322$**, y el promedio es $0{,}469$. Notar la asimetría: *el resultado raro es el que trae información*.

### Interpretar la entropía: 2^H valores equiprobables

Una variable con entropía $H(x)$ "vale" $m = 2^{H(x)}$ **alternativas equiprobables**:

| $H(x)$ | $2^{H(x)}$ | Lectura |
|---|---|---|
| $1$ bit | $2$ | la moneda justa |
| $0{,}469$ bits | $1{,}38$ | la moneda sesgada: *como un dado de 1,38 caras* |
| $3{,}27$ bits | $9{,}65$ | la suma de dos dados, que tiene 11 resultados posibles pero "vale" 9,65 |

Suena raro un dado de 1,38 caras, y el tutorial lo admite; pero es la traducción más intuitiva que hay. **La brecha entre $m$ y $2^{H}$ es exactamente la redundancia**: 11 resultados posibles pero sólo 9,65 de capacidad efectiva porque no son equiprobables.

### Un aviso que el tutorial deja marcado

La definición de $H(x)$ vale para valores **independientes**. Si los valores consecutivos de la variable están correlacionados, cada uno es más predecible —menos sorprendente— y la entropía real por símbolo baja. Por eso siempre hay que aclarar si se asume independencia. *(Esto reaparece en la §8.7: el castellano es el caso extremo de valores no independientes.)*

### Variables continuas

Para variables continuas la entropía es, literalmente, **infinita**: cada valor está especificado con precisión infinita. Se ignoran los términos infinitos y queda la **entropía diferencial**:

$$H(x_c) = \int p(x_c) \log_2 \frac{1}{p(x_c)}\, dx_c$$

No es una entropía de verdad —no es invariante ante cambios de escala—, pero la dificultad **desaparece en cuanto se toman diferencias de entropías**, que es lo único que se hace después: la información mutua es una diferencia, y ahí los infinitos se cancelan.

> **Errata de la fuente.** La ecuación (5) de la página 7 imprime $H(x_c) = \int p(x_c)\log \frac{1}{x_c}\,dx_c$ — **le falta la $p$ adentro del logaritmo**. Que es un tipeo se confirma con la propia ecuación (32) del formulario de la página 18, donde la misma fórmula aparece bien: $\int p(x)\log\frac{1}{p(x)}dx$. En el mismo párrafo hay otro descuido menor: define la variable discreta con "$n$ valores posibles" y dos renglones después escribe $P_d = 1/m$ y $H(x_d) = \log m$.

### Distribuciones de máxima entropía

Para transmitir la mayor cantidad de información posible, la variable tiene que tener la **máxima entropía compatible con sus restricciones**. El tutorial lista tres, ordenadas de más a menos restringidas:

| Restricción | Distribución de máxima entropía | Densidad | Varianza |
|---|---|---|---|
| Varianza $v_x$ fija | **Gaussiana** | $p(x) = \dfrac{1}{\sqrt{2\pi v_x}}\, e^{-(\mu_x - x)^2 / (2 v_x)}$ | $v_x$ |
| Sin valores negativos, media $\mu$ fija | **Exponencial** | $p(x) = \dfrac{1}{\mu} e^{-x/\mu}$ | $\mu^{2}$ |
| Acotada entre $x_{\min}$ y $x_{\max}$ | **Uniforme** | $p(x) = \dfrac{1}{x_{\max} - x_{\min}}$ | $(x_{\max}-x_{\min})^{2}/12$ |

La gaussiana tiene además una propiedad de eficiencia energética que el tutorial subraya: ninguna otra distribución entrega tanta información por unidad de energía gastada.

> **Dónde pega esto en la materia** *(lectura nuestra)*: el caso discreto y acotado —alfabeto finito— tiene por máxima entropía a la **uniforme**. Por eso `Gen()` sortea la clave uniformemente en el [[one-time-pad|one time pad]], y por eso un [[generador-pseudoaleatorio|PRG]] se compara siempre contra la uniforme: es la única distribución que llena el recipiente.

---

## 4. El canal: entropía conjunta, condicional e información mutua

### El esquema

$$\text{mensaje } s \;\longrightarrow\; \boxed{\text{codificación}} \;\xrightarrow{\;x\;}\; \boxed{\text{canal } (+\,\eta)} \;\xrightarrow{\;y\;}\; \boxed{\text{decodificación}} \;\longrightarrow\; \hat{s}$$

El canal más cómodo de analizar es el **aditivo**: la salida es la entrada más ruido,

$$y = x + \eta$$

El ruido $\eta$ es lo único que impide que $\hat{s} = s$ siempre.

### Entropía condicional

$$H(y \mid x) = \text{incertidumbre que queda sobre } y \text{ una vez que se conoce } x$$

En un canal aditivo con ruido independiente, esa incertidumbre residual **es exactamente el ruido**:

$$H(y \mid x) = H(\eta)$$

El tutorial también le da su nombre clásico, tomado de Shannon: la **equivocación** (*equivocation*) es $H(x \mid y)$, la incertidumbre promedio que queda sobre la **entrada** después de observar la salida. Conviene retener esa palabra: la §8 se apoya en ella.

### Información mutua

$$I(x, y) = H(y) - H(y \mid x) = H(y) - H(\eta) \ \text{ bits}$$

Es **cuánta información de $x$ realmente llega a $y$**: se resta de la entropía total de la salida la parte que es puro ruido. Y es **simétrica**, cosa que el propio tutorial marca como contraintuitiva:

$$I(x, y) = I(y, x)$$

Lo que $x$ te dice sobre $y$ es, en promedio, exactamente lo que $y$ te dice sobre $x$. Por eso el tutorial se permite "invertir el sentido del canal" a mitad del razonamiento sin que cambie nada.

> **Nota de notación.** La fuente escribe $I(x, y)$ con **coma**. La convención habitual en criptografía y en Cover & Thomas es $I(X;Y)$ con **punto y coma**, para no confundirla con la información mutua de la variable conjunta $(x,y)$ contra una tercera. En la §8 usamos el punto y coma.

### El diagrama de abanico

La figura 7 del tutorial es la imagen que conviene memorizar:

- Hay $2^{H(x)}$ entradas posibles y $2^{H(y)}$ salidas posibles.
- Cada **entrada** abre un abanico de $2^{H(y \mid x)}$ salidas igualmente probables — el ruido desparrama.
- Cada **salida** abre un abanico de $2^{H(x \mid y)}$ entradas que podrían haberla causado — el ruido confunde.

Comunicar sin error es lograr que los abanicos **no se solapen**. Ahí está toda la teoría en una imagen.

### El ejemplo numérico del canal discreto

El tutorial arma un canal aditivo chiquito y hace las cuentas:

| Pieza | Valores | Entropía |
|---|---|---|
| Entrada $x$ | $m_x = 3$ equiprobables: $100, 200, 300$ | $H(x) = \log_2 3 = 1{,}58$ bits |
| Ruido $\eta$ | $m_\eta = 2$ equiprobables: $10, 20$ | $H(\eta) = \log_2 2 = 1{,}00$ bit |
| Salida $y$ | $m_y = 3 \times 2 = 6$ equiprobables: $110, 120, 210, 220, 310, 320$ | $H(y) = \log_2 6 = 2{,}58$ bits |

De donde sale la relación general para un canal aditivo con entrada y ruido independientes y equiprobables:

$$H(y) = \log_2 m_x + \log_2 m_\eta = H(x) + H(\eta)$$

y la información mutua:

$$I(x,y) = H(y) - H(\eta) = 2{,}58 - 1{,}00 = 1{,}58 \ \text{bits}$$

> **Ojo con este ejemplo — observación nuestra, no del tutorial.** La sección donde aparece se titula *"el ruido reduce la capacidad del canal"*, pero **en este ejemplo concreto el ruido no reduce nada**: los seis valores de salida son todos distintos, así que ver la salida determina la entrada sin ambigüedad, $H(x \mid y) = 0$, y por lo tanto
> $$I(x,y) = H(x) - H(x\mid y) = 1{,}58 - 0 = 1{,}58 = H(x)$$
> es decir, **pasa toda la información de la entrada**. Lo que el ruido hizo fue inflar $H(y)$ de $1{,}58$ a $2{,}58$ bits sin agregar información útil: gastó recipiente, no contenido. Para que el ruido **cueste** información los abanicos tienen que **solaparse**, o sea que dos entradas distintas puedan producir la misma salida — y con ruido $\{10, 20\}$ y entradas separadas de a 100 eso nunca pasa. Si el ruido fuera $\{0, 100\}$, entrada $100$ y entrada $200$ podrían dar ambas $200$, y ahí sí $H(x\mid y) > 0$. **Es el ejemplo el que está mal elegido, no la teoría.**

### Las identidades que hay que tener a mano

$$\begin{aligned}
H(x,y) &= H(x) + H(y \mid x) = H(y) + H(x \mid y) &&\text{(regla de la cadena)}\\
H(x \mid y) &= H(x,y) - H(y)\\
I(x,y) &= H(x) + H(y) - H(x,y)\\
I(x,y) &= H(x) - H(x \mid y) = H(y) - H(y \mid x)\\
I(x,y) &= \sum_{i}\sum_{j} p(x_i, y_j) \log_2 \frac{p(x_i, y_j)}{p(x_i)\,p(y_j)}
\end{aligned}$$

La última forma es la que revela lo importante: **$I(x,y) = 0$ si y sólo si $p(x,y) = p(x)p(y)$, o sea si y sólo si $x$ e $y$ son independientes.** Ese renglón es todo el puente de la §8.2.

---

## 5. Capacidad de canal y los dos teoremas de codificación

### Capacidad

La **capacidad** $C$ es la máxima información que un canal puede entregar en su salida acerca de su entrada. Se mide en **bits por uso** del canal (o bits por segundo).

$$\begin{aligned}
\text{Canal sin ruido:}\quad C &= \max_{p(x)} H(x) \ \text{ bits por entrada}\\
\text{Canal con ruido:}\quad C &= \max_{p(x)} I(x,y) = \max_{p(x)}\,\big[\,H(y) - H(y\mid x)\,\big] \ \text{ bits}
\end{aligned}$$

El máximo se toma **sobre la distribución de entrada**: la capacidad es una propiedad del canal, no del uso que le estés dando. Y si no hay ruido, $H(y \mid x) = 0$ y la segunda fórmula colapsa en la primera.

Las tres leyes que el tutorial enuncia en la introducción, y que son el resumen de todo:

1. Todo canal tiene un **techo definido** de información transmisible: su capacidad.
2. Ese techo **se achica cuando crece el ruido**.
3. Ese techo **se puede alcanzar casi exactamente** con una codificación juiciosa de los datos.

### Teorema de codificación de fuente (canal sin ruido)

*También llamado primer teorema fundamental de codificación.* En castellano, y parafraseado:

> Con una fuente de entropía $H$ bits por símbolo y un canal de capacidad $C$ bits por segundo, se puede codificar la salida de la fuente para transmitir a una tasa promedio de $C/H - \varepsilon$ símbolos por segundo, con $\varepsilon$ arbitrariamente chico. **No** se puede transmitir a una tasa promedio mayor que $C/H$.

Traducido a lo que uno hace: **cada símbolo se puede representar, en promedio, con apenas un poquito más de $H(x)$ binary digits — y con menos, no.**

El ejemplo del tutorial con los dados cierra el argumento:

| | Binary digits por tirada |
|---|---|
| Codificación ingenua (11 resultados, todos con el mismo largo) | $\log_2 11 = \mathbf{3{,}46}$ |
| Óptima según el teorema | apenas más de $H(x) = \mathbf{3{,}27}$ |
| Ahorro | $\approx 0{,}19$ binary digits por tirada |

Ese $0{,}19$ es exactamente **la redundancia que la codificación ingenua desperdicia** por tratar como equiprobables a resultados que no lo son.

### Teorema de codificación de canal con ruido

*Segundo teorema fundamental.* Es el resultado contraintuitivo de 1948, y el tutorial explica bien por qué:

Antes de Shannon se creía que reducir errores exigía bajar la tasa —cada código corrector agrega redundancia y por lo tanto va más lento—, y que llevado al límite, **comunicar con error cero exigía tasa cero**. Shannon probó que no: se puede comunicar con error tan chico como se quiera, a cualquier tasa **por debajo de la capacidad**.

Parafraseado:

> Sea un canal discreto de capacidad $C$ y una fuente discreta de entropía por segundo $H$. Si $H \le C$, **existe** un sistema de codificación que transmite la salida de la fuente con frecuencia de error arbitrariamente chica. Si $H > C$, se puede codificar de modo que la equivocación sea menor que $H - C + \varepsilon$, y **no existe** codificación que dé una equivocación menor que $H - C$.

Dos lecturas que conviene separar:

- **La buena.** Por debajo de $C$, el error se puede hacer tender a cero **sin** que la tasa tienda a cero. El precio se paga en complejidad de la codificación, no en velocidad.
- **La mala, y la que importa acá.** Por encima de $C$, hay un piso irreductible de incertidumbre: $H - C$ bits que **nunca** se recuperan. No es que el código sea malo — es que la información no está.

### Desigualdad de procesamiento de datos

$$I(x,y) \le H(x)$$

> Por sofisticado que sea un dispositivo, la información que su salida tiene sobre su entrada **no puede superar** la información que había en la entrada.

Dicho brutalmente: **procesar no crea información**. Ninguna función determinística de $x$ sabe más sobre $x$ que $x$ mismo. Es la línea que en la §8.5 mata la esperanza de que un [[generador-pseudoaleatorio|generador pseudoaleatorio]] "fabrique" azar.

---

## 6. El canal gaussiano

Si el ruido se saca de una gaussiana, el canal es **gaussiano**. Como la suma de dos gaussianas independientes es gaussiana, y como la gaussiana es la de máxima entropía a varianza fija (§3), conviene que **la entrada también sea gaussiana**: eso maximiza $H(x)$, que maximiza $H(y)$, que maximiza $I(x,y)$.

Con $v_x$ la varianza de la entrada y $v_\eta$ la del ruido:

$$\begin{aligned}
H(x) &= \tfrac{1}{2}\log_2 (2\pi e\, v_x)\\
H(\eta) &= \tfrac{1}{2}\log_2 (2\pi e\, v_\eta)\\
H(y) &= \tfrac{1}{2}\log_2 \big(2\pi e\, (v_x + v_\eta)\big) &&\text{porque } v_y = v_x + v_\eta\\[2pt]
I(x,y) &= H(y) - H(\eta) = \tfrac{1}{2}\log_2\!\left(1 + \frac{v_x}{v_\eta}\right)
\end{aligned}$$

Los factores $2\pi e$ **se cancelan** al restar: por eso no importaba que la entropía diferencial no fuera una entropía de verdad.

Como la varianza de una señal de media cero es su **potencia**, con $S = v_x$ (potencia de señal) y $N = v_\eta$ (potencia de ruido) queda la ecuación famosa:

$$\boxed{\;C = \frac{1}{2}\log_2\!\left(1 + \frac{S}{N}\right)\ \text{bits por valor}\;}$$

donde $S/N$ es la **relación señal-ruido** (SNR). Y con ancho de banda $W$ Hz, muestreando a la tasa de Nyquist $2W$:

$$C = W \log_2\!\left(1 + \frac{S}{N}\right)\ \text{bits/s}$$

**El logaritmo es la mala noticia práctica:** duplicar la potencia no duplica la capacidad, apenas le suma medio bit. Los rendimientos son decrecientes desde el primer watt.

Vía análisis de Fourier —cuyas componentes son mutuamente independientes si la variable es gaussiana— la información mutua se integra en frecuencia:

$$I(x,y) = \int_{0}^{W} \log_2\!\left(1 + \frac{S(f)}{N(f)}\right) df \ \text{ bits/s}$$

> **Errata de la fuente.** La ecuación (24) de la página 16 imprime la probabilidad de detectar una señal gaussiana en ruido gaussiano como $P = \tfrac12 \log\big(1 + \operatorname{erf}(\sqrt{S/8N})\big)$. **No puede ser una probabilidad:** con $S/N \to 0$ da $\tfrac12\log 1 = 0$ (debería dar $0{,}5$, que es adivinar) y con $S/N \to \infty$ da $\tfrac12\log 2 = 0{,}5$ (debería dar $1$). El $\log$ está de más; la forma correcta es $P = \tfrac12\big(1 + \operatorname{erf}\sqrt{S/8N}\big)$, que sí va de $0{,}5$ a $1$. En el mismo renglón, el texto llama a $\operatorname{erf}$ *"la función de distribución acumulada de una gaussiana"*, lo cual tampoco es exacto: la relación es $\operatorname{erf}(z) = 2\Phi(z\sqrt{2}) - 1$.

---

## 7. El canal binario simétrico — **no está en esta fuente**

El **canal binario simétrico** (BSC) es el ejemplo canónico de todo curso de teoría de la información, y **este tutorial no lo trae**: su único canal discreto trabajado es el de tres entradas y dos ruidos de la §4. Como la §8 lo necesita, lo agregamos nosotros; queda dicho que **es complemento nuestro y no material de la fuente**.

*(Desarrollo nuestro, usando sólo fórmulas que sí están en la fuente.)* El BSC toma un bit y lo **invierte con probabilidad $p$**. Definiendo la **entropía binaria**

$$H_2(p) = p \log_2 \frac{1}{p} + (1-p)\log_2\frac{1}{1-p}$$

la incertidumbre que el canal agrega es $H(y \mid x) = H_2(p)$ para cualquier entrada, y con entrada uniforme $H(y) = 1$. Aplicando $C = \max_{p(x)}[H(y) - H(y\mid x)]$:

$$C_{\text{BSC}} = 1 - H_2(p) \ \text{ bits por bit transmitido}$$

| $p$ | $H_2(p)$ | $C_{\text{BSC}}$ | Lectura |
|---|---|---|---|
| $0$ | $0$ | $1$ | canal perfecto |
| $0{,}1$ | $0{,}469$ | $0{,}531$ | el ruido se come casi la mitad |
| $\mathbf{0{,}5}$ | $\mathbf{1}$ | $\mathbf{0}$ | **la salida es independiente de la entrada: no pasa nada** |
| $1$ | $0$ | $1$ | invierte siempre: es perfecto, sólo hay que negar |

El $H_2(0{,}1) = 0{,}469$ es el mismo número de la moneda sesgada de la §3, y no es casualidad: es la misma cuenta.

> **La fila que importa es $p = 0{,}5$.** Un canal que invierte el bit con probabilidad exactamente $1/2$ tiene **capacidad cero**. Y eso es, literalmente, el [[one-time-pad|one time pad]] sobre un bit: $c = m \oplus k$ con $k$ uniforme **es** un canal binario simétrico con $p = 1/2$ entre el mensaje y el adversario. La §8 desarrolla esto.

---

## 8. El puente con criptografía

Todo lo de esta sección es **lectura nuestra**: la fuente no menciona criptografía en ninguna página. Lo que sí es de la fuente son las fórmulas que se usan, y están citadas.

Vale la pena tener presente el dato histórico: **Shannon publicó las dos cosas con un año de diferencia** — *A Mathematical Theory of Communication* en 1948 (lo que resume este tutorial) y *Communication Theory of Secrecy Systems* en 1949 (de donde sale el [[secreto-perfecto|secreto perfecto]] y la cota $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ que enuncia la [[clase-01-introduccion-y-criptografia-clasica|Clase 1]]). El segundo paper es una **aplicación del primero**. Que las dos cosas se estudien por separado es un accidente de los planes de estudio, no del contenido.

### 8.1. Un cifrado es un canal hacia el adversario

El movimiento que hay que hacer es este: **poner al adversario en el lugar del receptor**.

$$M \;\xrightarrow{\;\text{"canal"} = \mathsf{Enc}_K\;}\; C \;\longrightarrow\; \text{adversario}$$

La clave $K$ hace el papel del **ruido** $\eta$: es lo que el adversario no conoce y lo que desparrama cada mensaje sobre muchos criptogramas. Y hay un cambio de signo respecto de comunicaciones que conviene decir en voz alta:

| | Comunicaciones | Criptografía |
|---|---|---|
| El ruido es | el enemigo | **el amigo** |
| Se busca | $I(x,y)$ **máxima** (capacidad) | $I(M;C)$ **mínima** (idealmente cero) |
| El objetivo del diseño | acercarse a $C$ | **hacer que $C = 0$** para el canal que va al adversario |

Es la misma matemática, optimizada al revés. Y se apoya sobre el [[modelo-probabilistico-de-un-criptosistema|modelo probabilístico de un criptosistema]], que ya trata a $M$, $K$ y $C$ como variables aleatorias con $K$ independiente de $M$ — exactamente la hipótesis que el canal aditivo necesita.

### 8.2. Secreto perfecto es, exactamente, I(M;C) = 0

La [[secreto-perfecto|definición de secreto perfecto]] dice:

$$\Pr[M{=}m \mid C{=}c] = \Pr[M{=}m] \qquad \forall m,\ \forall c \text{ con } \Pr[C{=}c] > 0$$

Eso es, palabra por palabra, la definición de que **$M$ y $C$ son independientes**. Y por la última identidad de la §4:

$$I(M;C) = 0 \iff p(m,c) = p(m)\,p(c) \iff M \perp C \iff \text{secreto perfecto}$$

$$\boxed{\;\text{Secreto perfecto} \iff I(M;C) = 0 \ \text{ para toda distribución sobre } \mathcal{M}\;}$$

**El cuantificador no es decorativo.** La definición del curso pide "para toda distribución de probabilidades en $\mathcal{M}$", así que la traducción correcta también lo pide. Que $I(M;C) = 0$ para *una* distribución particular de mensajes no certifica nada — es el mismo cuidado que aparece marcado en el [[probabilidad-y-criptografia|Ejemplo 1 de probabilidad y criptografía]].

Y hay una ganancia de lectura: **las dos caracterizaciones que la nota de concepto presenta como equivalentes son las dos formas de escribir la misma información mutua**, las ecuaciones (49) y (50) del tutorial:

| Forma | Se anula cuando | Es la caracterización... |
|---|---|---|
| $I(M;C) = H(M) - H(M \mid C)$ | $H(M\mid C) = H(M)$: el criptograma no baja la incertidumbre sobre el mensaje | ...**del mensaje**: la a posteriori es igual a la a priori |
| $I(M;C) = H(C) - H(C \mid M)$ | $H(C\mid M) = H(C)$: fijar el mensaje no cambia la distribución del criptograma | ...**del cifrado**: $\Pr[\mathsf{Enc}_K(m) = c]$ no depende de $m$ |

No son dos teoremas que casualmente coinciden: **son la misma cantidad medida desde los dos extremos del canal**, y son iguales por la simetría $I(x,y) = I(y,x)$ de la §4.

> **Y en el vocabulario del tutorial:** secreto perfecto es *"la equivocación del mensaje es máxima"*, $H(M \mid C) = H(M)$. Shannon usó esa misma palabra en los dos papers. Cuando el [[#Teorema de codificación de canal con ruido|teorema de canal ruidoso]] dice que la equivocación no puede bajar de $H - C$, está dando —del otro lado del mostrador— exactamente la garantía que el criptógrafo quiere: **si la capacidad del canal hacia el adversario es cero, la equivocación se queda en $H(M)$ y no baja nunca.**

### 8.3. La cota |K| ≥ |M| es en realidad una cota de entropía: H(K) ≥ H(M)

El [[secreto-perfecto#Teorema de Shannon (cota de claves)|teorema de Shannon]] que enuncia la Clase 1 es un argumento de **conteo**. La versión en entropía es más fuerte y explica mejor **por qué**.

**Demostración** *(desarrollo nuestro; usa la regla de la cadena, ecuaciones (42)–(43) del tutorial, y la condición de corrección del [[criptosistema]]).*

1. **Con la clave y el criptograma, el mensaje está determinado.** Es la condición de corrección: $m = \mathsf{Dec}_k(c)$. Luego
   $$H(M \mid C, K) = 0$$
2. **Regla de la cadena, condicionando en $C$, por los dos lados:**
   $$\begin{aligned}
   H(M, K \mid C) &= H(K \mid C) + H(M \mid K, C) = H(K \mid C) + 0\\
   H(M, K \mid C) &= H(M \mid C) + H(K \mid M, C) \;\ge\; H(M \mid C)
   \end{aligned}$$
   porque toda entropía es $\ge 0$. Combinando las dos líneas:
   $$H(K \mid C) \;\ge\; H(M \mid C)$$
3. **Condicionar nunca aumenta la entropía**, así que $H(K) \ge H(K \mid C)$.
4. **Y por secreto perfecto** (§8.2), $H(M \mid C) = H(M)$. Encadenando:

$$\boxed{\;H(K) \;\ge\; H(K\mid C) \;\ge\; H(M \mid C) \;=\; H(M)\;}$$

**De ahí sale la cota de conteo como caso particular.** Si los mensajes son equiprobables, $H(M) = \log_2 \lvert\mathcal{M}\rvert$; y toda distribución de claves cumple $H(K) \le \log_2 \lvert\mathcal{K}\rvert$. Entonces

$$\log_2 \lvert\mathcal{K}\rvert \;\ge\; H(K) \;\ge\; H(M) \;=\; \log_2 \lvert\mathcal{M}\rvert \quad\Longrightarrow\quad \lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$$

**Por qué la versión en entropía es la buena:**

- **Dice el "por qué" que el conteo esconde.** La clave tiene que aportar *al menos tanta incertidumbre como la que el mensaje podría filtrar*. La [[secreto-perfecto|nota de secreto perfecto]] ya lo dice con palabras — *"el secreto perfecto es precisamente la afirmación de que la clave aporta tanta incertidumbre como la que el mensaje podría filtrar"* — y esto es esa frase escrita como desigualdad.
- **Es estrictamente más fuerte.** $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ cuenta claves; $H(K) \ge H(M)$ **las pesa**. Un espacio de $2^{128}$ claves con una `Gen()` sesgada satisface el conteo y puede violar la entropía.
- **Explica el costo del [[one-time-pad|one time pad]].** Para cifrar $n$ bits de mensaje uniforme hacen falta $n$ **bits** de clave, no $n$ binary digits: azar genuino, distribuido de antemano, usado una sola vez. Las tres malas noticias del OTP son las tres consecuencias operativas de esta única desigualdad.

> **Sigue siendo necesaria y NO suficiente.** El [[one-time-pad|ejercicio de la clave sesgada]] de la Clase 2 lo muestra en números. Con $\Pr[K] = (0{,}3;\,0{,}1;\,0{,}4;\,0{,}2)$ y $\Pr[M] = (0{,}60;\,0{,}15;\,0{,}10;\,0{,}15)$ sobre 2 bits:
> $$H(K) = 1{,}846 \ \text{bits} \;\ge\; H(M) = 1{,}595 \ \text{bits}$$
> **La cota de entropía se cumple — y aun así no hay secreto perfecto** ($\Pr[M{=}00\mid C{=}01] = 0{,}32 \ne 0{,}60$). Es exactamente el mismo patrón que el Ejemplo 2 de [[probabilidad-y-criptografia|probabilidad y criptografía]], donde $\lvert\mathcal{K}\rvert = 3 \ge \lvert\mathcal{M}\rvert = 2$ tampoco alcanzaba. **Ni contar claves ni pesarlas alcanza: hace falta además que estén bien repartidas.** *(Las dos entropías las calculamos nosotros a partir de los datos de la filmina.)*

### 8.4. Por qué una clave de 56 bits sesgada no vale 56 bits de seguridad

Acá se cobra la distinción de la §2. **Una clave de 56 binary digits es un recipiente de 56 bits; cuánto lleva adentro lo decide `Gen()`.**

*(Desarrollo nuestro, construido sobre el $0{,}469$ de la moneda sesgada del tutorial.)* Supongamos una clave de 56 binary digits generada bit a bit de forma independiente, pero con un generador roto que produce un $1$ el 90 % de las veces. Cada binary digit transporta $H_2(0{,}9) = 0{,}469$ bits, así que:

$$H(K) = 56 \times 0{,}469 = \mathbf{26{,}3}\ \text{bits}$$

**La clave ocupa 56 binary digits y transporta 26 bits.** El espacio efectivo pasó de $2^{56} \approx 7{,}2\cdot 10^{16}$ a $2^{26{,}3} \approx 8{,}1\cdot 10^{7}$: unos **mil millones de veces más chico**, sin que ningún campo del protocolo cambie de tamaño.

> **Precisión importante — y es una corrección al razonamiento fácil.** *(Lectura nuestra; el tutorial sólo habla de entropía de Shannon.)* Para "cuánto cuesta **adivinar** la clave", la entropía de Shannon **no es la medida correcta**: es un promedio, y un atacante no promedia — prueba primero las claves más probables. La medida correcta es la **min-entropía**
> $$H_\infty(K) = -\log_2 \max_k \Pr[K = k] \;\le\; H(K)$$
> En el ejemplo de arriba, la clave más probable es la de 56 unos, con probabilidad $0{,}9^{56} = 0{,}0027$. Entonces
> $$H_\infty(K) = 56 \times \log_2(1/0{,}9) = \mathbf{8{,}5}\ \text{bits}$$
> O sea: **un atacante que pruebe una sola clave —la de todos unos— acierta 1 de cada 365 veces.** Contra un nominal de $2^{56}$. La entropía de Shannon decía 26 bits y ya era una catástrofe; la min-entropía dice $8{,}5$ y es la cifra real. Moraleja para el parcial: *entropía de Shannon para "cuánto se puede comprimir / cuánto filtra", min-entropía para "cuán fácil es adivinar".*

**Dónde aparece esto en la materia, sin ningún sesgo de por medio:** la clave de [[des-y-3des|DES]] tiene **64 binary digits, de los cuales 8 son de paridad**. Aun con una `Gen()` impecable, esos 64 recipientes transportan a lo sumo $H(K) = 56$ bits, y el nivel de seguridad es $2^{56}$, no $2^{64}$. **Es el mismo error de categoría que denuncia la §2, cometido por un estándar federal.** El [[ataque-de-fuerza-bruta|principio de espacio de claves suficiente]] y los tamaños mínimos que recomienda [[eleccion-de-primitivas|elección de primitivas]] hay que leerlos siempre en bits, nunca en binary digits.

Y por eso importa tanto el [[generador-pseudoaleatorio|generador pseudoaleatorio]]: **`Gen()` no es un detalle de implementación, es la mitad de la seguridad.** Un generador sesgado no rompe ninguna fórmula del criptosistema; simplemente hace que los recipientes viajen medio vacíos y nadie se entere mirando el protocolo.

### 8.5. El PRG: n binary digits de salida, a lo sumo s bits de contenido

La [[#Desigualdad de procesamiento de datos|desigualdad de procesamiento de datos]] de la §5 liquida el asunto en un renglón.

*(Desarrollo nuestro.)* Un [[generador-pseudoaleatorio|generador pseudoaleatorio]] es $G : \{0,1\}^{s} \to \{0,1\}^{n}$ con $s < n$ y **determinístico**. Como $G(K)$ es función de $K$:

$$H\big(G(K)\big) \;\le\; H(K) \;\le\; s \ \text{ bits}$$

mientras que la salida ocupa $n$ binary digits. **La expansión mueve recipientes, no contenido.** Los $n - s$ binary digits extra son, en información, exactamente cero.

De ahí sale, sin ninguna cuenta nueva, el resultado que la [[criptosistema-de-flujo|nota de criptosistema de flujo]] enuncia por conteo:

$$H(K) \le s < n \le H(M) \ \text{(para mensajes uniformes de } n \text{ bits)} \quad\Longrightarrow\quad \text{no hay secreto perfecto}$$

Es el $\lvert\mathcal{K}\rvert \lll \lvert\mathcal{M}\rvert$ de esa nota, dicho en entropía. **Y no es un defecto reparable:** cualquier construcción que expanda una semilla corta tiene este agujero por definición.

> **Entonces, ¿por qué funcionan los cifradores de flujo?** Porque el déficit de entropía **existe pero es inaccesible en tiempo razonable**. Un adversario sin límite de cómputo lo detecta siempre —le alcanza con probar las $2^{s}$ semillas—; un adversario [[seguridad-computacional|PPT]], no. Ese es el corte exacto entre la seguridad **incondicional** de la §8.2 y la [[seguridad-computacional|seguridad computacional]], y la definición de PRG es la promesa formal de que ninguna prueba estadística eficiente encuentra el déficit. **La teoría de la información dice qué información hay; la seguridad computacional dice quién puede sacarla.** El curso vive del segundo lado desde la Clase 2 en adelante.

### 8.6. Cuánto filtra exactamente el OTP con clave sesgada

*(Desarrollo nuestro. La filmina calcula una sola probabilidad a posteriori y la [[one-time-pad|nota de OTP]] completa la tabla; acá lo cerramos con un número en bits.)*

Para cualquier cifrado **aditivo** —$C = M \oplus K$ sobre $\{0,1\}^{n}$, con $K$ independiente de $M$— vale una identidad muy cómoda. Dado $M = m$, la variable $C = m \oplus K$ es una biyección de $K$, así que $H(C \mid M{=}m) = H(K)$ para **todo** $m$, y por lo tanto $H(C\mid M) = H(K)$. Metiendo eso en $I = H(C) - H(C\mid M)$:

$$\boxed{\;I(M;C) = H(C) - H(K)\;}$$

Con los datos de la filmina ($\Pr[K] = (0{,}3;\,0{,}1;\,0{,}4;\,0{,}2)$, $\Pr[M] = (0{,}60;\,0{,}15;\,0{,}10;\,0{,}15)$), la marginal del criptograma es

| $c$ | $00$ | $01$ | $10$ | $11$ |
|---|---|---|---|---|
| $\Pr[C{=}c]$ | $0{,}265$ | $0{,}185$ | $0{,}315$ | $0{,}235$ |

*(el $0{,}185$ es el mismo que calcula la filmina para $C = 01$; los otros tres los agregamos nosotros)*. De ahí $H(C) = 1{,}974$ bits, y

$$I(M;C) = 1{,}974 - 1{,}846 = \mathbf{0{,}128}\ \text{bits}$$

**El criptograma filtra $0{,}128$ bits sobre un mensaje de $1{,}595$ bits de entropía**: alrededor del 8 % del mensaje, con sólo torcer la clave. No es catastrófico, pero no es cero, y el secreto perfecto exige cero.

Y la identidad da además una **cota general muy legible**. Como $H(C) \le n$:

$$I(M;C) \;\le\; n - H(K)$$

> **El mensaje no puede filtrar más bits que los que le faltan a la clave para ser uniforme.** Con $n = 2$: $2 - 1{,}846 = 0{,}154$, y efectivamente $0{,}128 \le 0{,}154$. Con la clave uniforme, $H(K) = n$, la cota da $0$ y **cae el secreto perfecto del OTP en un renglón** — sin Bayes, sin el Lema 1, sin tablas.

Esto conecta las tres cosas de esta sección: la fuga es exactamente el déficit de entropía de la clave, el déficit viene de que los binary digits van medio vacíos (§8.4), y con clave uniforme el canal hacia el adversario es un BSC con $p = 1/2$ y **capacidad cero** (§7). *Un bit de clave uniforme compra un bit de secreto. Ni más ni menos: ese es todo el teorema de Shannon.*

### 8.7. La redundancia del castellano es por qué caen los cifrados clásicos

Última traducción, y es la que explica la [[clase-01-introduccion-y-criptografia-clasica|Clase 1]] entera.

*(Desarrollo nuestro, calculado sobre la tabla de frecuencias de [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]].)*

| Cantidad | Valor | Qué es |
|---|---|---|
| $\log_2 27$ | $4{,}75$ bits/letra | el máximo: alfabeto castellano **equiprobable** |
| $H(\text{castellano})$ | $\approx 4{,}04$ bits/letra | la entropía real de esa tabla de frecuencias |
| Redundancia | $\approx 0{,}71$ bits/letra ($15\ \%$) | lo que sobra — **y sólo por frecuencias de letras sueltas** |

Y con la redundancia real es mucho peor, porque las letras del castellano **no son independientes** (§3): después de una $q$ viene una $u$ casi seguro. Contando digramas, trigramas y palabras, la entropía por letra del castellano escrito baja muchísimo más. *(Cuánto más, esta fuente no lo dice y nosotros no lo medimos.)*

**Esa redundancia es el combustible del criptoanálisis.** Un cifrado de [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]] permuta las etiquetas pero **no toca la distribución**: el histograma viaja intacto, con sus $0{,}71$ bits de sesgo por letra, y el atacante lo lee. La [[cifrado-por-transposicion|transposición]] es todavía más transparente: deja el histograma **idéntico**.

El [[indice-de-coincidencia|índice de coincidencia]] es la misma idea con otra métrica. $\mathrm{IC} = \sum p_i^2$ es la **probabilidad de colisión**, y $-\log_2 \mathrm{IC}$ es lo que en la literatura se llama entropía de Rényi de orden 2 *(no aparece en esta fuente: sólo trae entropía de Shannon)*:

| Texto | IC | $-\log_2 \mathrm{IC}$ |
|---|---|---|
| Castellano (valor de la filmina) | $0{,}0775$ | $3{,}69$ bits/letra |
| Uniforme sobre 27 símbolos | $0{,}0370$ | $4{,}75$ bits/letra |

**El "gap de factor 2" del que vive el índice de coincidencia es, en bits, un gap de un bit por letra.** El IC no mide otra cosa que redundancia; sólo que la mide con una métrica que se computa contando pares, sin logaritmos.

---

## 9. Qué NO está en esta fuente

Para que no la busques donde no está:

| Tema | ¿Está? |
|---|---|
| Criptografía, en cualquier forma | **No.** Ni una vez |
| Canal binario simétrico | **No** — lo agregamos nosotros en la §7 |
| Códigos correctores de errores | **Casi no.** Los nombra al pasar al abrir la sección 11 del paper — *"como vimos, los efectos del ruido se pueden reducir con códigos correctores"* — pero **nunca los vio**: es una referencia cruzada que quedó del libro largo del mismo autor, del que este paper es un resumen |
| Compresión concreta (Huffman, aritmética, LZ) | **No.** El teorema de codificación de fuente se enuncia, pero no se construye ningún código |
| Distancia de unicidad, entropía de clave residual | **No.** Son del paper de 1949 de Shannon, no del de 1948 |
| Min-entropía, entropía de Rényi | **No.** Sólo entropía de Shannon |
| Divergencia de Kullback-Leibler | **No** |
| Demostraciones de los teoremas | **No.** Los enuncia y los interpreta; es explícitamente un tutorial informal |

El texto sí cierra con una **lista comentada de lecturas** que vale como mapa: MacKay (*Information Theory, Inference, and Learning Algorithms*, gratis online) como el clásico moderno, Cover & Thomas como la referencia técnica, Pierce como el más informal, y el propio Shannon & Weaver de 1949 — sorprendentemente legible, según el autor.

---

## 10. Erratas de la fuente, juntas

Las tres están verificadas contra el PDF, no contra la extracción de texto.

| Dónde | Se imprime | Debería decir | Cómo se confirma |
|---|---|---|---|
| Ec. (5), p. 7 | $H(x_c) = \int p(x_c)\log\frac{1}{x_c}dx_c$ | $\int p(x_c)\log\frac{1}{p(x_c)}dx_c$ | la ec. (32) del formulario, p. 18, tiene la misma fórmula bien |
| Ec. (36), p. 19 | rotulada $H(y\mid x)$, con sumando $\log\frac{1}{p(x_i \mid y_j)}$ | $H(x \mid y)$ | la ec. (37) de abajo ya es $H(y\mid x)$, y las versiones continuas (38)/(39) están bien rotuladas |
| Ec. (24), p. 16 | $P = \tfrac12\log\big(1 + \operatorname{erf}\sqrt{S/8N}\big)$ | $P = \tfrac12\big(1 + \operatorname{erf}\sqrt{S/8N}\big)$ | la impresa no es una probabilidad: da $0$ con SNR nula y $0{,}5$ con SNR infinita |

Y una de la Tabla 1 (p. 6): el epígrafe dice que la columna *Surprisal* es $P\log(1/P)$, pero los valores de la columna son $\log(1/P)$ — para $P = 1/36$ la tabla imprime $5{,}17 = \log_2 36$, mientras que $P\log_2(1/P)$ daría $0{,}14$. El epígrafe describe el **término** de la entropía; la columna trae la **sorpresa**.

---

## 11. Formulario

Todos los logaritmos en base 2; todo en bits.

$$\begin{aligned}
\text{Sorpresa} \quad & \log_2 \tfrac{1}{p(x)}\\[2pt]
\text{Entropía} \quad & H(x) = \sum_i p(x_i)\log_2 \tfrac{1}{p(x_i)}\\[2pt]
\text{Entropía conjunta} \quad & H(x,y) = \sum_i \sum_j p(x_i,y_j)\log_2 \tfrac{1}{p(x_i,y_j)}\\[2pt]
\text{Entropía condicional} \quad & H(y\mid x) = \sum_i\sum_j p(x_i,y_j)\log_2 \tfrac{1}{p(y_j\mid x_i)} = H(x,y) - H(x)\\[2pt]
\text{Regla de la cadena} \quad & H(x,y) = H(x) + H(y\mid x) = H(y) + H(x\mid y)\\[2pt]
\text{Información mutua} \quad & I(x,y) = \sum_i\sum_j p(x_i,y_j)\log_2 \frac{p(x_i,y_j)}{p(x_i)p(y_j)}\\[2pt]
& I(x,y) = H(x) + H(y) - H(x,y) = H(x) - H(x\mid y) = H(y) - H(y\mid x)\\[2pt]
\text{Capacidad} \quad & C = \max_{p(x)} I(x,y)\\[2pt]
\text{Canal gaussiano} \quad & C = \tfrac12 \log_2\!\left(1 + \tfrac{S}{N}\right) \ \text{por valor}, \qquad C = W\log_2\!\left(1+\tfrac{S}{N}\right)\ \text{bits/s}
\end{aligned}$$

Y las traducciones al vocabulario de la materia *(lectura nuestra, §8)*:

| Teoría de la información | Criptografía |
|---|---|
| $I(M;C) = 0$ para toda $\Pr[M]$ | [[secreto-perfecto\|secreto perfecto]] |
| $H(M \mid C) = H(M)$ (equivocación máxima) | la misma definición, del lado del mensaje |
| $H(C \mid M) = H(C)$ | la caracterización equivalente, del lado del cifrado |
| $H(K) \ge H(M)$ | el [[secreto-perfecto#Teorema de Shannon (cota de claves)\|teorema de Shannon]], en versión fuerte |
| $\log_2\lvert\mathcal{K}\rvert \ge \log_2\lvert\mathcal{M}\rvert$ | el mismo teorema, en versión de conteo |
| $I(M;C) = H(C) - H(K)$ para cifrado aditivo | cuánto filtra un [[one-time-pad\|OTP]] con clave imperfecta |
| $H(G(K)) \le s$ con salida de $n$ binary digits | por qué un [[criptosistema-de-flujo\|cifrador de flujo]] no puede ser perfecto |
| $H_\infty(K) \ll$ largo de la clave | por qué una clave sesgada de 56 binary digits no da $2^{56}$ |
| capacidad del canal hacia el adversario $= 0$ | el objetivo de diseño |

