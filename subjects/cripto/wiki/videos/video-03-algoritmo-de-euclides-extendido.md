---
title: Video 03 — Algoritmo de Euclides extendido
resumen: 'Video de 2017 de Rodrigo Ramele que resuelve a mano una ecuación diofántica lineal con la tabla de Euclides extendido, incluido el manejo del coeficiente negativo y la verificación del invariante fila por fila.'
fuentes: ["[[algoritmo-de-euclides-extendido]]", "[[clase-02-cifrado]]", "[[teoria-de-numeros]]", "[[videografia]]"]
aliases: [Video 03, Video de Euclides extendido, Euclides extendido a mano, Tabla de Euclides extendido, Resolución de ecuación diofántica lineal]
type: video
clase: 4
orden: 41
video: 03
youtube: KgnrX6I_Nd4
created: 2026-09-03
updated: 2026-09-04
tags: [video, teoria-de-numeros, euclides, bezout, diofantica, mcd, algoritmo, clase-02, manuscrito]
sources: ["https://www.youtube.com/watch?v=KgnrX6I_Nd4"]
---

# Video 03 — Algoritmo de Euclides extendido

> **Título en YouTube:** *Criptografía y Seguridad Informática - Algoritmo Euclides Extendido*
> **Duración:** 14:55 · **Subido:** 17/06/2017 (sábado) · **Visibilidad:** público
> **Autor:** Rodrigo Ramele, canal [`@faturita`](https://www.youtube.com/@faturita)
> **Descripción de YouTube:** *"Paso a paso del esquema básico del Algoritmo de Euclides Extendido"*
> **Formato:** manuscrito puro. Cámara cenital sobre hoja cuadriculada, birome azul, sin una sola filmina.
> **Ancla en el cronograma:** **tarea de la Clase 2** — es uno de los dos videos que el docente encarga explícitamente al cerrar el jueves 13/08, y la base de teoría de números que se usa en la [[cronograma|Clase 4 (10/09, Criptografía Asimétrica)]].
> **Link:** https://www.youtube.com/watch?v=KgnrX6I_Nd4

**Para qué sirve:** para ver el algoritmo corrido a mano de punta a punta —con un coeficiente negativo, que es donde se rompe— y para copiarle la disciplina de verificar cada fila contra los coeficientes originales. **Para qué no sirve:** para entender *por qué* funciona; en los quince minutos no hay una sola demostración, ni el criterio de existencia se justifica, ni se menciona complejidad. Todo eso ya está, y mucho mejor desarrollado, en [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]].

---

## Lo primero: esto no es una clase, y el ejemplo tiene un coeficiente negativo

Dos cosas lo separan del resto del corpus de videos.

**Es material producido aparte, no una grabación de clase.** En 1690 palabras de transcripción no hay una sola marca de audiencia: cero vocativos, cero nombres de alumnos, cero preguntas al curso, cero micrófono o chat, cero recreo, cero despedida. Y a 00:06 el docente habla del salón **como algo externo** —dice que el algoritmo se usa *"sobre todo para hacer algunos ejercicios de salón"*—, cosa que nadie dice estando en el salón. Es el video más viejo de los trece (2017) y precede a todas las cursadas que hay grabadas. Esto **corrige** lo que la [[videografia#Los 13, con sus datos duros|Videografía]] supone al agrupar los trece: éste y el de *Guía Rápida a Teoría de Números* son videos complementarios, no clases.

**El ejemplo tiene un coeficiente negativo, y ahí está toda la gracia.** Resuelve $41x - 19y = 8$, que en la tabla entra como $a = 41$, $b = -19$. Los dos ejemplos de la nota [[algoritmo-de-euclides-extendido#6. Ejemplo 1: el mcd de 7 y 32|02.14]] —$\operatorname{mcd}(32,7)$ y $\operatorname{mcd}(84,30)$— tienen los dos coeficientes positivos, y con eso el signo del cociente nunca es una decisión. Acá sí lo es, y el docente le dedica un tramo entero. **Ése es el aporte real del video sobre el vault.**

> [!quote]- Del video — el encuadre de apertura (00:05)
> "En cripto se usa mucho en la parte de teoría de números […] sobre todo para hacer algunos ejercicios de salón."

---

## 1. Recorrido

| Tramo | Qué pasa | ¿Se puede saltear? |
|---|---|---|
| **00:00 – 00:22** | Placa de título superpuesta: *ALGORITMO DE EUCLIDES EXTENDIDO / RESOLUCION DE ECUACION DIOFANTICA LINEAL*. Encuadre en una oración. | Sí |
| **00:22 – 01:45** | Escribe $41x - 19y = 8$ y, al lado, la condición de existencia $(41{:}19) \mid 8$. Define qué es una diofántica lineal y adelanta la idea del algoritmo. | No, si nunca viste el criterio |
| **01:45 – 03:00** | Dibuja la tabla $r$, $x$, $y$, $q$; rotula $41$ sobre $x$ y $-19$ sobre $y$; anota $r > 0$; escribe el invariante a la derecha; carga las dos filas semilla. | **No.** Es el andamio de todo lo demás |
| **03:00 – 07:40** | **El núcleo.** Las tres divisiones enteras, la recurrencia de $x$ e $y$, y la verificación del invariante fila por fila. Incluye el tramo sobre el signo del cociente (03:00 – 03:25). | **No** |
| **07:40 – 08:50** | Lee $x_0 = -6$, $y_0 = -13$ y arma la familia con el parámetro $k$. | No |
| **08:50 – 10:10** | Por qué hay que multiplicar todo por $8$, y las fórmulas ya escaladas. | No |
| **10:10 – 11:40** | Instancia en $k = 2$, obtiene $x = -352$, $y = -760$ y verifica reemplazando. En el medio, el aparte del libro que usa de soporte. | Sí, si ya te convenciste |
| **11:40 – 14:05** | Hoja nueva: el algoritmo **en letras**, $aX + bY = c$. Tabla general, cociente inicial, recurrencia dibujada con flechas, invariante. | Depende: es casi todo redundante con [[algoritmo-de-euclides-extendido#5. La versión extendida\|02.14 §5]] |
| **14:05 – 14:55** | Fórmulas generales de la familia y el recordatorio final del escalado a $c$. | Sí |

---

## 2. El ejercicio, resuelto entero

Esto es lo que hay que llevarse del video. Está desarrollado acá completo para que no haga falta mirarlo si no quieres — pero la corrida es exactamente la del manuscrito, número por número, y la tabla se leyó ampliada, no se reconstruyó.

### 2.1 Enunciado y condición de existencia (00:22 – 00:52)

$$41x - 19y = 8, \qquad x, y \in \mathbb{Z}$$

Insiste en que **tanto las incógnitas como los coeficientes son enteros**: ahí está toda la dificultad del problema. Y al costado escribe la condición de existencia con la notación de dos puntos del [[teoria-de-numeros#2. La notación propia del manuscrito|manuscrito de la cátedra]]:

$$(41{:}19) \mid 8$$

O sea: el máximo común divisor de los coeficientes tiene que dividir al término independiente. **No demuestra el criterio ni lo justifica**, sólo lo enuncia y sigue. La demostración de ida y vuelta está en [[algoritmo-de-euclides-extendido#2. La ecuación diofántica lineal|02.14 §2]].

### 2.2 La tabla que dibuja (01:45 – 03:00)

Cuatro columnas —$r$, $x$, $y$ y, separada por una raya vertical, $q$—, con dos rótulos y una nota que son la mitad del método:

- **Sobre la columna $x$ escribe $41$; sobre la columna $y$, $-19$.** No son decoración: dicen qué coeficiente multiplica cada columna en el invariante.
- **Arriba a la izquierda anota $r > 0$.** Es la restricción que después va a fijar todos los signos.
- **A la derecha de la tabla deja el invariante de control**, que tiene que cumplirse en cada fila sin excepción:

$$r = (41)\,x + (-19)\,y$$

Y carga las dos filas semilla, que son cada número escrito como combinación trivial de sí mismo:

$$41 = (41)(1) + (-19)(0) \qquad\text{y}\qquad -19 = (41)(0) + (-19)(1)$$

**Nota de forma:** la ecuación viene con un menos, y él no la reescribe como $41x + 19y' = 8$ con $y' = -y$. Mete $-19$ directamente en la tabla y sigue. Es la decisión que hace que el ejercicio sea interesante, y también la que obliga al cuidado con los signos.

### 2.3 Las tres divisiones enteras (03:00 – 07:00)

Al margen izquierdo de la tabla escribe las divisiones, una por iteración:

$$\begin{aligned}
41 &= (-19)(-2) + 3 && \text{(03:25)}\\
-19 &= (3)(-7) + 2 && \text{(05:00)}\\
3 &= (2)(1) + 1 && \text{(06:15)}
\end{aligned}$$

Y las columnas $x$ e $y$ salen de **la misma recurrencia que los restos**: el valor de dos filas más arriba, menos el de la fila inmediatamente anterior multiplicado por el cociente de esa fila.

$$v_{n+1} = v_{n-1} - v_{n}\,q_{n}$$

Desarrollada, iteración por iteración:

$$\begin{aligned}
&\text{it. 1 } (q = -2): && x = 1 - (0)(-2) = 1, && y = 0 - (1)(-2) = 2\\
&\text{it. 2 } (q = -7): && x = 0 - (1)(-7) = 7, && y = 1 - (2)(-7) = 15\\
&\text{it. 3 } (q = 1): && x = 1 - (7)(1) = -6, && y = 2 - (15)(1) = -13
\end{aligned}$$

### 2.4 La tabla completa

| Fila | $r$ | $x$ | $y$ | $q$ | Verificación contra $41x + (-19)y$ | Minuto |
|---|---|---|---|---|---|---|
| semilla | $41$ | $1$ | $0$ | — | $41 - 0 = 41$ | 02:35 |
| semilla | $-19$ | $0$ | $1$ | — | $0 - 19 = -19$ | 02:50 |
| 1 | $3$ | $1$ | $2$ | $-2$ | $41 - 38 = 3$ | 04:30 |
| 2 | $2$ | $7$ | $15$ | $-7$ | $287 - 285 = 2$ | 05:25 |
| 3 | $\mathbf{1}$ | $\mathbf{-6}$ | $\mathbf{-13}$ | $1$ | $-246 + 247 = \mathbf{1}$ | 07:00 |
| corte | $0$ | — | — | — | una vuelta más daría resto cero | 07:28 |

**Corta en la fila del gcd**, que acá vale $1$, y escribe el $0$ debajo del $1$ encerrado para dejar constancia de que ahí termina. Es una diferencia menor de estilo con el pseudocódigo de [[algoritmo-de-euclides-extendido#5. La versión extendida|02.14 §5]], que corre hasta el resto $0$ y devuelve el renglón anterior: llegan al mismo lado.

> [!quote]- Del video — para qué sirve toda la tabla (04:55)
> "Esta es un poco la idea: achicar esto hasta que quede el [gcd]."

### 2.5 De la solución particular a la familia (07:40 – 08:50)

De la última fila lee

$$x_0 = -6, \qquad y_0 = -13$$

y **avisa explícitamente que si los reemplazas en la ecuación original no va a dar** — porque resuelven la ecuación igualada al gcd, no al $8$. Verificación:

$$41(-6) - 19(-13) = -246 + 247 = 1 \quad\checkmark$$

La familia general la escribe sumando en $x$ el otro coeficiente dividido el gcd, por $k$, y restando lo análogo en $y$:

$$x = -6 + \frac{-19}{1}\,k = -6 - 19k, \qquad y = -13 - \frac{41}{1}\,k = -13 - 41k$$

Que es la fórmula de [[algoritmo-de-euclides-extendido#7. La forma general de las soluciones|02.14 §7]] —$x = x_0 + t\,b/d$, $y = y_0 - t\,a/d$— con $a = 41$, $b = -19$, $d = 1$, y llamando $k$ al parámetro en vez de $t$.

### 2.6 El escalado por 8 (08:50 – 10:10)

El argumento, que es el mismo de la suficiencia del criterio de existencia: la tabla dejó todo igualado al gcd; como el gcd divide a $8$, para llegar al $8$ hay que multiplicar por el factor que lleva el gcd hasta el término independiente. Acá el gcd es $1$ y el factor es $8$. Anota **x 8** al lado del par de fórmulas y escribe a la derecha:

$$\boxed{\; x = -48 - 152k, \qquad y = -104 - 328k \;}$$

> [!quote]- Del video — el resumen del método en una frase (09:21)
> "Lo que se hizo fue llevar todo al [gcd]."

### 2.7 Instanciación en k = 2 y verificación (10:10 – 11:40)

$$x = -48 - 152(2) = -352, \qquad y = -104 - 328(2) = -760$$

Y en hoja nueva reemplaza en la ecuación original, con un tilde de OK al lado:

$$41(-352) - 19(-760) = -14432 + 14440 = 8 \quad\checkmark$$

**Recomputado acá y da.** Es el único paso del video que un parcial también te va a pedir y que casi nadie hace: treinta segundos que detectan todos los errores de signo.

---

## 3. Los dos puntos donde se detiene a explicar el porqué

Nunca dice "esto entra en el parcial" —no menciona parcial ni final en todo el video—, pero son los dos únicos lugares donde frena la corrida para justificar, y son exactamente los dos que hacen fallar el ejercicio si se los saltea.

### El resto positivo es lo que fija el signo del cociente (03:00 – 03:25)

El resto de la división entera está **definido** como positivo. Esa exigencia es la que determina qué cociente hay que usar: sin ella habría más de una opción y la tabla quedaría ambigua. Es la razón por la que en la primera iteración el cociente es $-2$ y no otro: $41 - (-19)(-2) = 3 > 0$, mientras que cualquier otro candidato deja el resto negativo. Aclara además que el $-19$ inicial es **dato de entrada** —el coeficiente de la ecuación—, no un resto calculado: los restos que salen de las divisiones sí tienen que ser todos positivos.

> [!quote]- Del video — la regla de signos (03:10 y 03:21)
> "Importante que esto siempre tiene que ser, r tiene que ser positivo."
>
> "Eso determina el signo a utilizar, porque si no podría haber más de una opción."

Este tramo **no tiene equivalente en el vault**: la nota [[algoritmo-de-euclides-extendido|02.14]] trabaja con coeficientes positivos y nunca se topa con la ambigüedad. Lo mismo el [[aritmetica-modular-y-divisibilidad#4. El algoritmo de la división|algoritmo de la división]] de la nota de base, que enuncia $0 \le r < \lvert b \rvert$ sin ejercitarlo con divisor negativo.

### La tabla resuelve la ecuación igualada al gcd, no a c (08:50 – 09:45 y 14:05 – 14:55)

Vuelve sobre esto dos veces, una en el ejemplo y otra en la generalización. La tabla nunca vio el $8$: lo único que hizo fue bajar los coeficientes hasta el gcd. Recién al final se multiplica por el $p$ tal que

$$(a{:}b)\,p = c$$

Con $d = 1$ el escalado es invisible cuando $c$ también es $1$ —el caso del [[inverso-modular|inverso modular]]—, y por eso se olvida. Acá, con $c = 8$, no se puede olvidar.

---

## 4. El tramo final: el algoritmo en letras (11:40 – 14:55)

Casi tres minutos y medio, en hoja nueva, generalizando lo que acaba de hacer. Es el tramo que la [[videografia|Videografía]] no anticipaba —el video no termina en el ejercicio—, aunque conceptualmente **es casi todo redundante** con el pseudocódigo de [[algoritmo-de-euclides-extendido#5. La versión extendida|02.14 §5]]. Qué escribe:

$$aX + bY = c$$

- **La tabla** $r$, $x$, $y$, $q$, con las filas iniciales $a \to (1, 0)$ y $b \to (0, 1)$ (11:40 – 12:35).
- **El cociente inicial**, escrito con corchetes de piso (12:35 – 13:20):
  $$q = \left\lfloor \frac{a}{b} \right\rfloor$$
- **La columna de restos**, que arranca con el resto de $a$ dividido $b$. En el manuscrito queda anotado como un subíndice chiquito arriba de la columna, que se lee como $r_b(a)$ —la [[teoria-de-numeros#2. La notación propia del manuscrito|notación del manuscrito de la cátedra]]— y coincide con lo que dice en audio a las 12:47, pero **el trazo en sí no es concluyente**.
- **La recurrencia dibujada con flechas punteadas** sobre la tabla: se toma el valor de dos filas arriba, se le resta el de la fila de arriba por el cociente, y el resultado baja a la fila siguiente (13:20 – 13:45).
- **El invariante en forma general** (13:45 – 14:05):
  $$r = (x)\,a + (y)\,b$$
- **Las fórmulas de la familia**, agrupadas por una llave, con $d = (a{:}b)$ (14:05 – 14:40):
  $$x = x_0 + k\,\frac{b}{d}, \qquad y = y_0 - k\,\frac{a}{d}$$
- **El escalado final** $(a{:}b)\,p = c$ (14:40 – 14:55).

> [!quote]- Del video — sobre los signos de la familia (14:04)
> "Tienen que ser con signo distinto, no importa cuál es cuál."

---

## 5. Qué agrega sobre la nota 02.14 y qué no

La nota de concepto se escribió **sin haber mirado este video** y lo declara así en su bloque de fuentes. Éste es el contraste que ahí quedó pendiente.

| Punto | [[algoritmo-de-euclides-extendido\|Nota 02.14]] | Video 03 |
|---|---|---|
| Ejemplos trabajados | $\operatorname{mcd}(32,7)$ y $\operatorname{mcd}(84,30)$, ambos coeficientes positivos | $41$ y $-19$: **un coeficiente negativo** |
| Signo del cociente | no aparece; con $a,b > 0$ no hay ambigüedad | **tramo entero dedicado** (03:00 – 03:25) |
| Notación del mcd | $\operatorname{mcd}(a,b)$ | $(a{:}b)$, la del manuscrito de la cátedra |
| Parámetro de la familia | $t$ | $k$ |
| Criterio de parada | corre hasta resto $0$ y devuelve el renglón anterior | corta en la fila del gcd y anota el $0$ debajo como confirmación |
| Verificación | una columna de chequeo por tabla | **fila por fila, en voz alta, las cuatro** |
| Sustitución hacia atrás | sí, como segunda forma de hacerlo | no la menciona |
| Chequeo del último renglón ($\pm b/d$, $\mp a/d$) | sí | no |
| Demostraciones | criterio de existencia, Bézout, forma general de las soluciones | **ninguna** |
| Complejidad | Lamé, $O(\log \min(a,b))$, y la conexión con RSA | no la menciona |
| Familia completa de soluciones | demostrada, y probada que son todas | la escribe, pero escala también el término en $k$ — ver abajo |

**El saldo honesto:** el video aporta **dos cosas** que el vault no tenía —el manejo del coeficiente negativo con la regla del resto positivo, y la corrida de una diofántica con $c \ne d$ hecha íntegra a mano por el propio docente—, y no aporta nada más. Todo lo demás la nota 02.14 ya lo tenía, y con demostraciones.

---

## 6. Dos observaciones nuestras sobre la resolución

### La familia que escribe no es la familia completa

***(Lectura nuestra. El docente no menciona este matiz y en el video queda presentado como la solución general.)***

Las fórmulas finales del video,

$$x = -48 - 152k, \qquad y = -104 - 328k$$

**dan soluciones válidas para todo $k$ entero** —verificado: $41x - 19y = 8$ para cualquier $k$, porque los términos en $k$ se cancelan—, pero **no generan todas las soluciones**. El paso en $x$ tiene que ser $b/d = -19$, y acá es $-152 = 8 \cdot (-19)$: multiplicó por $8$ también el término paramétrico, no sólo la solución particular. La familia completa es

$$x = -48 - 19t, \qquad y = -104 - 41t, \qquad t \in \mathbb{Z}$$

y la del video se recupera con $t = 8k$, o sea que cubre **una de cada ocho** soluciones. Comprobación de que la de arriba también cierra:

$$41(-48 - 19t) - 19(-104 - 41t) = -1968 - 779t + 1976 + 779t = 8 \quad\checkmark$$

Si el enunciado pide *"todas las soluciones enteras"*, la del video se queda corta. Es exactamente el error que la [[algoritmo-de-euclides-extendido#10. Checklist para el parcial|nota 02.14]] marca como el tercero más frecuente —*usar $b$ en vez de $b/d$*— en su otra variante: escalar el paso junto con el punto de partida.

### El piso del cociente no vale cuando el divisor es negativo

***(Lectura nuestra.)***

La fórmula general que escribe a las 12:35, $q = \lfloor a/b \rfloor$, **no reproduce su propio ejemplo en la primera iteración**. Con $a = 41$ y $b = -19$:

$$\left\lfloor \frac{41}{-19} \right\rfloor = \lfloor -2{,}157\ldots \rfloor = -3 \quad\Longrightarrow\quad r = 41 - (-19)(-3) = -16 < 0$$

El cociente que efectivamente usa es $-2$, que es el techo, no el piso. Y no alcanza con cambiar piso por techo en todos lados: en la segunda iteración, con $a = -19$ y $b = 3$, el piso $\lfloor -19/3 \rfloor = -7$ **sí** es el correcto, y el techo daría $-6$ con resto negativo. La regla que funciona en las tres filas es la que él dice en voz a las 03:10 y no llega a escribir en símbolos:

$$\text{elegir } q \text{ tal que } \quad 0 \le a - bq < \lvert b \rvert$$

que con $b > 0$ coincide con el piso y con $b < 0$ coincide con el techo. **No es un error del video** —el $\lfloor \cdot \rfloor$ de la formulación general está escrito pensando en $a, b$ positivos, y en ese caso es correcto—, pero si se copia la fórmula general y se aplica al ejemplo del propio video, no cierra.

---

## 7. Lo que no se llegó a leer

- **El subíndice de la columna $r$ en la tabla general** (de 12:35 en adelante) es minúsculo. Se lee como $r_b(a)$, y eso coincide con el audio de 12:47 (*"sería el resto de a div b"*), **pero el trazo no es concluyente**.
- **La palabra manuscrita a la derecha de $(a{:}b)\,p = c$** en el último frame (14:50) queda tapada por un logo superpuesto y **no se puede leer**.
- **El aparte del libro (10:21).** Se le mueve la hoja y aclara, entre risas, que el soporte es *"el libro de Menezes"*. En todos los frames se ve, a la izquierda del cuadro, una tapa con patrón de laberinto rojo sobre fondo oscuro en la que se alcanzan a leer fragmentos —`...PLIED`, `...RYPTOG`—. **La identificación con el *Handbook of Applied Cryptography* combina esos fragmentos con la mención en audio; no es lectura directa de la tapa completa.** Dato de color, sin valor de examen.
- **El tramo 09:26 – 09:33** suena a un intercambio con alguien fuera de cámara, pero el audio está roto y no se puede afirmar si hay un segundo interlocutor. No se cita.

> **Sobre las citas.** La transcripción es ASR automático de YouTube y viene bastante rota: escribe *"el algoritmo decl extendido"* por *de Euclides extendido*, *"eje CD"* por *gcd*, *"Meneses"* por *Menezes*, *"I"* donde el docente dice *y* (la variable) y *"que"* donde dice *q* (la columna). También equivoca números que el manuscrito muestra bien: dice *"-9"* donde va $-19$ (04:46) y *"-3"* donde va $-13$ (07:23). **Todos los números de esta nota salen de la imagen, no del ASR**, y la tabla se verificó dígito por dígito con recortes ampliados.

---

## 8. Qué dice sobre el parcial

**Nada.** No menciona parcial ni final en ningún momento de los quince minutos. Lo más cercano es el encuadre de apertura (00:05), que ubica el algoritmo como herramienta de práctica —*"ejercicios de salón"*— más que como tema teórico.

El estatus de examen que el vault le asigna a este contenido **no sale de acá**: sale del encargo en la [[teoria-de-numeros#1. De dónde sale esto: es tarea de la Clase 02|encargo de la Clase 02]], donde el docente nombra el procedimiento y avisa que va a servir para el parcial. Este video es el desarrollo de ese encargo, no una fuente independiente sobre qué se toma.

***(Lectura nuestra.)*** Sí vale como referencia de **formato esperado**: es el propio docente resolviendo el ejercicio con una disposición concreta —tabla de cuatro columnas, coeficientes rotulados sobre $x$ e $y$, verificación al costado de cada fila—. Copiar esa disposición en un parcial no puede salir mal, aunque nada en el video diga que se espera.

