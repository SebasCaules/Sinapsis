---
title: Video 11 — Flujo de información
resumen: 'Clase grabada de Ramele sobre flujo de información: quince minutos de entropía de Shannon, la definición formal por entropía condicional y los tres ejemplos numéricos resueltos; no toca malware ni control de acceso.'
fuentes: ["[[videografia]]", "[[cronograma]]", "[[teoria-de-la-informacion]]"]
aliases: [Video 11, Flujo de información, Canal oculto, Side channel attack, Problema de confinamiento, Relación de dominancia]
type: video
clase: 9
orden: 40
video: 11
youtube: yvfjxmzvQVw
created: 2026-09-03
updated: 2026-09-04
tags: [video, seguridad, flujo-de-informacion, entropia, canales-ocultos, confinamiento, bloque-2, clase-09, ramele]
sources: ["https://www.youtube.com/watch?v=yvfjxmzvQVw"]
---

# Video 11 — Flujo de información

> **Duración:** 52:29 · **Subido:** 10/05/2024 · **Docente:** Rodrigo Ramele · **Visibilidad:** oculto (*unlisted*, se accede por la playlist)
> **Mapea a:** [[cronograma|Clase 9 — Flujo de información y malware]], 22/10 · **Guía 8 — Flujos de información**, 26/10 · [[videografia|Videografía]]
> **Deck:** `Clase 09 - Aplicaciones - Flujo de información.pdf`, **27 filminas**, abierto en Preview de macOS. **El vault no tiene este PDF.** Todo lo que sigue sale del video.
> **Link:** [Flujo de Información](https://www.youtube.com/watch?v=yvfjxmzvQVw)
> **Es una clase en vivo**, no un video de estudio: a 13:13 pide *"alguien que se anime a explicarlo, vale tirar fruta"* y un alumno contesta; a 17:20 vuelve sobre *"lo que contó Mauro"*; y cierra a 51:39 con el aviso de que la última hora se solapa con Redes. Verificado contra la transcripción.

Sirve para llevarte **la definición formal de flujo de información por entropía condicional y los tres ejemplos numéricos resueltos en pantalla**, que son lo más evaluable de la clase y no están en ningún otro lado del vault; **no** sirve como clase de control de acceso ni de modelos de seguridad, y **no tiene una sola palabra de malware**, que es la otra mitad del rótulo de la Clase 9.

---

## Lo que este video aporta y ningún otro material del vault tiene

**La cátedra enseña entropía de Shannon en clase, y este video es la prueba.**

El apunte de [[teoria-de-la-informacion|Teoría de la información]] abre con un [[teoria-de-la-informacion#1. Aviso previo: esta fuente no tiene clase asignada|aviso de que la fuente no tiene clase asignada]]: *"el programa no menciona teoría de la información, ni entropía, ni Shannon como tema. Tampoco aparece en el cronograma"*. Eso sigue siendo literalmente cierto sobre esos dos documentos — pero acá hay **quince minutos de entropía dictados sobre una filmina de la cátedra**, la número 6 del deck de la Clase 9, del 05:52 al 21:00. Un tercio de la clase.

Y no es un adorno: es **el andamiaje**. La definición de flujo de información de la filmina 8 está escrita en entropía condicional, y sin ella no se entiende ni una de las tres cuentas del examen. Ramele además avisa explícitamente que el tema es de últimos años o posgrado y que se usa en *machine learning* y en criptografía, no sólo en esta clase.

***(Lectura nuestra.)*** Con esto, el apunte de Teoría de la información deja de ser material suelto y pasa a tener un ancla concreta: **es el desarrollo largo de la filmina 6 de la Clase 9**. La conexión con la [[clase-01-introduccion-y-criptografia-clasica|Clase 1]] que el apunte plantea por contenido sigue valiendo — el propio video conecta la definición de flujo con el [[secreto-perfecto|secreto perfecto]] a los 22:39 — pero el ancla dura está acá.

Lo segundo que aporta, y que también es exclusivo: **los tres ejemplos numéricos resueltos** (filminas 10, 11 y 12) y **el criterio operativo de las dos desigualdades** (filmina 8). Con eso alcanza para resolver un ejercicio de parcial de flujo, que es exactamente lo que la Guía 8 va a pedir.

---

## Recorrido

| Desde | Hasta | Tramo |
|---|---|---|
| 00:00 | 02:25 | **Cola del video anterior.** Safari con el artículo de IEEE Spectrum sobre *bloat*. Scrollea dos minutos y medio |
| 02:25 | 03:39 | Cambia de ventana y abre el PDF de la Clase 09. Anuncia que la clase que sigue la retoma Pablo, y que ACLs se ven *"en la clase de control de acceso"* |
| 03:39 | 05:00 | **Filminas 2 y 3.** Motivación: exámenes, ACLs y el caso del editor que guarda una copia en `/tmp` |
| 05:00 | 05:52 | **Filminas 4 y 5.** Las políticas restringen el flujo, no el acceso. El caso de los sueldos |
| 05:52 | 08:00 | **Filmina 6.** Información de un evento y entropía de Shannon. La filmina queda quieta hasta 21:11 |
| 08:00 | 12:20 | Capacidad del canal: el telégrafo, el *clock*, y el canal de un bit que avisa que viene el enemigo |
| 12:20 | 17:00 | **Digresión termodinámica.** Boltzmann, la tumba, el mate que se enfría, el cuento de Asimov. Sin contenido de examen |
| 17:00 | 21:00 | Máximo y mínimo de la entropía. El *bit* como *binary term*. Cierre: la entropía matematiza la información |
| 21:00 | 22:39 | **Filmina 7.** Entropía condicional |
| 22:39 | 26:47 | **Filmina 8.** Definición formal de flujo de información. Enganche con secreto perfecto y con el ventilador del servidor |
| 26:47 | 28:56 | **Filminas 9 y 10.** Seguimiento de flujo y el primer ejemplo numérico resuelto |
| 28:56 | 33:00 | Pregunta de alumno sobre por qué la desigualdad es *menor*. Navega hacia atrás y vuelve a la 8. Desarrolla el caso norcoreano |
| 33:00 | 35:00 | La entropía como cantidad de bits, y la aclaración de que eso vale sólo con distribución uniforme |
| 35:00 | 36:36 | **Filminas 11 y 12.** Los otros dos ejemplos: flujo indirecto por rama y por comportamiento |
| 36:36 | 37:00 | **Filmina 13.** Flujo explícito contra implícito |
| 37:00 | 38:27 | **Filmina 14.** Reflexión y transitividad |
| 38:27 | 40:33 | **Filmina 15.** Relación de dominancia de Bell-LaPadula aplicada al flujo |
| 40:33 | 41:17 | **Filmina 16.** Mecanismos estáticos y dinámicos |
| 41:17 | 42:38 | **Filmina 17.** El oficial que deja de emitir comunicados, y el límite de lo técnico |
| 42:38 | 43:17 | **Filmina 18.** El problema de confinamiento |
| 43:17 | 44:42 | **Filminas 19 y 20.** Aislación total y recursos medibles |
| 44:42 | 47:40 | **Filmina 21.** Canal oculto: definición, clasificación y atributos. Ejemplo largo del DRM y el cine |
| 47:40 | 49:08 | **Filmina 22.** Canal oculto temporal por CPU compartida |
| 49:08 | 50:12 | **Filmina 23.** Side channel de tiempo sobre la exponenciación modular |
| 50:12 | 51:14 | **Filminas 24 a 27.** Máquinas virtuales, sandboxes y lectura recomendada |
| 51:14 | 52:29 | Cierre administrativo: el solapamiento con Redes, el enunciado del TP y las consultas en el S206 |

> **Los tramos de esta tabla salen del audio, no del muestreo de frames.** Dos filminas quedaron con timestamp de frame separados por tres segundos (13 y 14, a 36:36 y 36:39) y una filmina aparece capturada 38 segundos antes de que el audio la trate (la 23, capturada a 48:30 y explicada desde 49:08). El barrido toma la lámina cuando pasa, no cuando el docente la pone.

---

## El temario según el propio autor, y qué promete de más

La descripción de YouTube trae el índice escrito por el propio Ramele:

> Control de Acceso dinamico | Flujo de Informacion | Entropia. Entropia Condicionada. | Flujo de Informacion. Relacion de Dominancia Bell Lapadula | Aislamiento: VMs y Sandboxing.

Vale citarla porque es lo más cercano a un temario oficial que hay del deck, y porque **ella misma acota el alcance**: dice *"Relación de Dominancia Bell Lapadula"*, no *"modelo Bell-LaPadula"*. Es honesta en eso.

Donde sí promete de más es en la primera entrada. **"Control de Acceso dinámico" no es la clase de control de acceso**: es la mitad *dinámica* de la filmina 16, o sea flujo de información con etiquetas, y dura 44 segundos. El propio docente manda el tema a otra clase apenas arranca.

> [!quote]- Del video — dónde se ven de verdad las ACLs (03:28)
> "las listas de control de acceso, llamadas ACLs, que ya lo vamos a ver en detalle… eso lo vemos todo en **la clase de control de acceso**."

Esa clase **no existe en el canal**. La verificación adversarial la buscó en los trece videos y no está: la da otro docente (Pablo) y son dos clases, ninguna grabada.

---

## Por qué el control de acceso no alcanza

**Filminas 2 y 3 (03:47 y 04:36).** El escenario es de cátedra: permitir que los docentes escriban los exámenes e impedir que los alumnos accedan. La filmina 2 pone la ACL del directorio de exámenes y pregunta si el control de acceso alcanza como mecanismo efectivo:

- `ACL(/var/cys/examenes)` → { (pablo, r), (ana, r) }
- `ACL(/tmp)` → { (pablo, rw), (ana, rw), (juan, rw) }

Y la filmina 3 mete el golpe: **¿qué pasa si el editor de textos guarda una copia de trabajo en `/tmp` mientras se edita el examen?** La ACL del archivo original no dice absolutamente nada sobre esa copia. El control de acceso es una **visión estática** de un problema que no lo es: la información se actualiza y se copia.

**Filminas 4 y 5 (05:00 y 05:40).** De ahí sale la tesis de toda la clase.

> [!quote]- Del video — la tesis (05:01)
> "Las políticas por lo general restringen **el flujo de información** y no el acceso a los objetos puntualmente."

El ejemplo canónico de la filmina 4 es el que el vault ya conoce por otro lado: **evitar que un empleado sepa el sueldo de otro no es lo mismo que evitar que acceda a la base de datos de sueldos.** Es la misma base de sueldos del ataque de [[maleabilidad#El escenario: la base de sueldos|maleabilidad]], pero mirada desde el otro lado: allá el problema era modificar el criptograma sin la clave, acá es que la información se escurra por un camino que nadie modeló.

Cierre de la filmina 4: los ACLs sirven, pero son **mecanismos abiertos** y deben ser complementados.

---

## Los quince minutos de teoría de la información

**Filmina 6, del 05:52 al 21:11.** Es el tramo más largo de la clase y **es íntegramente oral**: la filmina no se mueve en quince minutos, no hay pizarrón, y todo lo que se ve en pantalla son las dos fórmulas y la lectura de máximo y mínimo. Verificado, no inferido.

La **información de un evento** es menos el logaritmo de su probabilidad:

$$I(x_i) = -\log p(x_i)$$

Y la **entropía** de una variable aleatoria discreta $X$ que toma valores $x_1,\dots,x_n$ es el promedio de esas informaciones puntuales, ponderado por probabilidad:

$$H(X) = -\sum_{i=1}^{n} p(x_i)\log p(x_i)$$

Con logaritmo en base dos, el resultado está en bits. Los dos extremos que la filmina explicita:

| Distribución | Entropía | Lectura |
|---|---|---|
| Uniforme, $p(x_i) = 1/n$ | **Máxima** | Se usa toda la capacidad del canal de Shannon |
| Pico, $p(x_i)=1$ y el resto $0$ | **Cero** | Un único evento posible: no hay nada que informar |

> [!quote]- Del video — la entropía cero, explicada (19:41)
> "Si siempre te digo la letra a, siempre te estoy diciendo lo mismo que nada. Nunca la voy a cambiar, no hay nada raro. No hay información, la información es cero, y eso lo refleja la entropía."

> [!quote]- Del video — por qué esto vale la pena (20:31)
> "La entropía es lo mejor que tenemos para medir información, entonces **matematiza la idea de información**, la lleva a algo muy concreto."

**El ejemplo del canal de un bit (10:24)** es el que mejor fija la intuición, y lo resuelve con el curso. Un canal de un bit avisa que viene el enemigo. ¿Qué valor aporta más información, el cero o el uno? Un alumno dice que el uno, porque lo saca de la tranquilidad; otro dice que ambos aportan lo mismo. **La primera es la correcta**: como el canal normalmente está en cero, ese evento tiene probabilidad alta, su $-\log p$ es chico y aporta poco. El uno, raro, es el que paga.

> [!quote]- Del video — el remate del tramo (12:16)
> "Ahí aparece la idea de que la sorpresa, lo sorpresivo, lo raro, es lo que te aporta más información."

Eso es exactamente la **sorpresa** del apunte de [[teoria-de-la-informacion#Sorpresa|Teoría de la información]], y la entropía como [[teoria-de-la-informacion#3. Información de Shannon y entropía|sorpresa promedio]]. Si ya leíste ese apunte, **este tramo del video no te agrega nada nuevo salvo la confirmación de que la cátedra lo dicta**; si no lo leíste, el apunte lo desarrolla mucho mejor y con demostraciones.

**Lo mismo vale para la capacidad del canal (08:00-12:20).** El diálogo sobre cómo transmitir información por un cable de cobre —dar o sacar tensión, o sea el telégrafo, y de ahí el *clock* y la tasa de bits por segundo— llega apenas a la idea intuitiva. La [[teoria-de-la-informacion#5. Capacidad de canal y los dos teoremas de codificación|la capacidad como el máximo de la información mutua]] y los dos teoremas de codificación están en el apunte, no en el video.

**Y la digresión termodinámica (12:20-17:00) se puede saltear entera.** Son casi cinco minutos: un alumno arriesga la definición termodinámica de entropía, Ramele corrige con el mate caliente en una habitación fría que tiende al equilibrio, menciona a Boltzmann y su fórmula grabada en la tumba, la tendencia del universo a la entropía máxima, el vaso que se rompe, y recomienda un cuento de Asimov sobre una computadora a la que le preguntan si la entropía puede revertirse. **Es cultura general, está bueno, y no hay nada de examen ahí.** Lo decimos porque la nota tiene que servir para decidir qué mirar.

Un dato que sí conviene retener del cierre del tramo (33:00-35:00), porque es la trampa de la cuenta: **la entropía da la cantidad de bits necesarios para codificar la variable, pero sólo cuando la distribución es uniforme**, porque ahí se usa la capacidad máxima de Shannon. Con distribución no uniforme, $H$ es menor que el número de bits crudos.

---

## Entropía condicional y la definición formal de flujo

**Filmina 7 (21:11).** Se obtiene reemplazando probabilidades por probabilidades condicionadas:

$$H(X \mid Y=y) = -\sum_{i=1}^{n} p(x_i \mid y)\log p(x_i \mid y)
\qquad
H(X \mid Y) = \sum_{j=1}^{m} p(y_j)\,H(X \mid Y=y_j)$$

La lectura que le da Ramele: **cuánta información remanente queda en $X$ sabiendo que ocurrió $y$.** Con eso se puede chequear si dos variables están correlacionadas y, por lo tanto, si hay flujo. Es la misma [[teoria-de-la-informacion#Entropía condicional|entropía condicional del apunte]], la que Shannon llama *equivocación*.

**Filmina 8 (22:39).** Acá está la definición que hay que saber de memoria. Sea $s$ el estado de un sistema y $t$ el estado después de ejecutar los comandos $c_1,\dots,c_n$. Sean $x_s, y_s$ los valores de los objetos en $s$ y $y_t$ el valor de $y$ en $t$. **Hay flujo de información de $x$ a $y$** si:

$$H(x_s \mid y_t) < H(x_s \mid y_s) \quad \text{si } y \text{ existe en } s$$

$$H(x_s \mid y_t) < H(x_s) \qquad\ \ \text{si } y \text{ no existe en } s$$

En criollo: **si después de conocer $y$ te queda menos incertidumbre sobre $x$ que la que tenías antes, es porque algo se pasó de $x$ a $y$.**

***(Lectura nuestra.)*** En la notación del apunte de teoría de la información, la segunda desigualdad es exactamente $I(x;y) > 0$: la [[teoria-de-la-informacion#Información mutua|información mutua]] es $H(x) - H(x \mid y)$, así que "la condicional bajó" y "la mutua es positiva" son la misma afirmación. Ramele **no** escribe la información mutua en ningún momento de la clase; la equivalencia la ponemos nosotros porque hace que las dos notas del vault hablen el mismo idioma.

**La pregunta que el curso hace y que conviene tener resuelta (28:56-33:00):** ¿por qué el criterio es *menor* y no *mayor*?

> [!quote]- Del video — la respuesta (32:33)
> "Vos querés que **no se te reduzca** de lo que había, porque si se te reduce vos podés inferir algo más."

Se reduce la entropía original ⟹ se gana predictibilidad. Si se hace cero, se puede predecir exactamente. Ese es el sentido de la desigualdad.

**El enganche con criptografía (22:39-26:47)**, que es lo que hace que este tema no sea una isla: no correlacionar el criptograma con el texto plano es exactamente [[secreto-perfecto|secreto perfecto]]. Y el hilo conductor que Ramele usa cuatro veces en la clase es **el ventilador del servidor**:

> **El caso norcoreano (30:01-32:47).** Se está dentro de un servidor en Corea del Norte. Se mide por sonido la velocidad del *fan* y las claves que el sistema genera normalmente, y se calcula la entropía de una respecto de la otra. Después se repite la medición justo después de que el sistema genera una clave. Si esa entropía condicional se reduce —y sobre todo si se hace cero— **hay flujo de información entre la velocidad del ventilador y algún bit, o la longitud, de la clave**. Es el esquema de la filmina 8 con $y$ = velocidad del fan y $x$ = clave.

Ese escenario ya fue pregunta de examen: ver [[#Qué marca como pregunta de examen|Qué marca como pregunta de examen]].

---

## Los tres ejemplos numéricos resueltos

Son las filminas 10, 11 y 12, y son **el bloque de mayor densidad evaluable de todo el video**. Los tres siguen el mismo molde: calcular $H(x)$, calcular $H(x \mid y)$, comparar.

### 1. Flujo directo por asignación

**Filmina 10 (27:15).** Considerar el comando $y := x + z$, donde $0 \le x \le 7$ con igual probabilidad y $Z$ tiene distribución $p(z{=}1) = 0{,}5$, $p(z{=}2) = 0{,}25$, $p(z{=}3) = 0{,}25$.

**Entropía natural de $x$.** Ocho valores equiprobables, $p(x_i) = 1/8$:

$$H(x) = -\sum_{i=0}^{7} \tfrac{1}{8}\log_2 \tfrac{1}{8} = -8 \cdot \tfrac{1}{8} \cdot (-3) = 3 \text{ bits}$$

Son los $3$ bits que hacen falta para codificar $8$ valores, porque $2^{3} = 8$.

**Entropía de $x$ conociendo $y$.** Después del comando, sabiendo $y$, el valor de $x$ sólo puede ser $y-1$, $y-2$ o $y-3$, y hereda las probabilidades de $z$:

$$H(x \mid y) = -\tfrac{1}{2}\log_2\tfrac{1}{2} - \tfrac{1}{4}\log_2\tfrac{1}{4} - \tfrac{1}{4}\log_2\tfrac{1}{4} = \tfrac{1}{2} + \tfrac{1}{2} + \tfrac{1}{2} = 1{,}5 \text{ bits}$$

**Conclusión.** Como $1{,}5 < 3$, **hay traspaso de información de $x$ a $y$** — que es lo que la filmina remata con un globo. Y tiene todo el sentido, porque $y$ se calcula directamente en base a $x$: es **flujo directo**. De los $3$ bits de incertidumbre original quedaron $1{,}5$: se filtró un bit y medio.

> **Ojo con la transcripción en este punto.** El ASR de YouTube dice a 28:38 *"es 2 a la 8 2 al cubo que es 8 y lo que está dando justamente es dos porque son 3 bits"*. Es ruido del ASR sobre un $2^{3} = 8$. **La filmina, que sí se leyó, dice $H(x) = 3$.** No es una errata de la cátedra: es la transcripción automática.

### 2. Flujo indirecto por rama

**Filmina 11 (35:05).** Considerar `if x = 0 then y = 1 else y = 0`, con $x \in \{0,1\}$ y $p(x{=}0) = 0{,}5$. Lo interesante: **$x$ e $y$ no aparecen nunca en la misma asignación.**

$$H(x) = -2 \cdot \tfrac{1}{2}\log_2\tfrac{1}{2} = 1 \text{ bit}
\qquad
H(x \mid y) = 0$$

$H(x \mid y) = 0$ porque conociendo $y$ se determina $x$ exactamente: $y=1 \Rightarrow x=0$, $y=0 \Rightarrow x=1$. Como $0 < 1$, hay flujo. **El flujo va por el control del programa, no por una asignación.** Ramele lo describe como una asignación *piecewise* encubierta.

### 3. Flujo indirecto por comportamiento

**Filmina 12 (35:50).** Considerar `while x = 0 loop {}`, con $x \in \{0,1\}$ y $p(x{=}0) = 0{,}5$. Acá **no existe ninguna asignación en absoluto**. Se define $y = 0$ si el programa termina.

$$H(x) = 1 \qquad H(x \mid y) = 0$$

Saber si el programa terminó o quedó colgado en el *loop* infinito determina el valor de $x$. **Hay traspaso de información sin una sola línea que escriba nada.** Es el ejemplo más limpio de por qué el flujo no se puede auditar mirando asignaciones.

---

## Flujo explícito e implícito

**Filmina 13 (36:36).** La generalización de los tres ejemplos:

| Tipo | Qué es | Cuál de los ejemplos |
|---|---|---|
| **Explícito** | Existe una asignación o escritura de información del tipo $y := f(x)$ | El primero, $y := x + z$ |
| **Implícito** | Hay verificación de flujo **sin** asignaciones explícitas | El `if` y el `while` |

> [!quote]- Del video — dónde está el problema real (36:53)
> "El problema es encontrar y controlar estos flujos, sobre todo los **implícitos** de información. Son mucho más sutiles y muchísimo más difíciles de capturar."

Vale la pena tener presente para qué se usa esto en criptografía, que es lo que la filmina 9 (26:47) plantea: las técnicas formales de análisis de flujo sirven para **verificar que una función de cifrado no revele información de la clave**. El flujo existe siempre —es necesario para que el programa funcione—; lo que se verifica es que no vaya a donde no debe.

---

## Reflexión y transitividad

**Filmina 14 (37:00).** Los dos principios que **toda** política de control de flujo de información debe cumplir:

- **Reflexión** — si $a$ y $b$ están en la **misma clase** y $a$ puede leer o escribir $o_1$, entonces $b$ también puede.
- **Transitividad** — si $a$ y $b$ están en **clases distintas**, $a$ puede escribir $o_1$ y leer $o_2$, y $b$ puede leer $o_1$, entonces **$b$ eventualmente puede leer $o_2$**.

La transitividad es la que muerde: es la formalización de que la información se escurre por caminos indirectos, o sea el caso `/tmp` con el que arrancó la clase. Ramele engancha esto con la relación de dominancia que —dice— ya vieron en políticas.

> **La clase de políticas no está en el canal.** A 37:10 lo trata como visto (*"dominancia, similar a lo que vimos en políticas"*), pero la verificación adversarial recorrió los trece videos y **no hay ninguna clase de políticas y modelos de seguridad grabada**. Lo único disponible es lo que viene a continuación, que es la *aplicación* de la dominancia al flujo.

---

## Bell-LaPadula: acá está sólo la relación de dominancia

**Filmina 15 (38:27).** Esto es lo que hay, y conviene ser preciso sobre su alcance antes de desarrollarlo: **es la relación de dominancia de Bell-LaPadula trasladada al problema del flujo, no el modelo Bell-LaPadula.** No aparecen la *simple security property* ni la *star-property*. Tampoco Biba, Clark-Wilson ni Chinese Wall — cero menciones en las ocho transcripciones del Bloque 2, verificado.

Los tres casos que desarrolla la filmina:

| Caso | Configuración | Qué se concluye |
|---|---|---|
| 1 | $a$, $b$ y $o$ en la misma clase $C_1$ | Dominancia mutua: $a$ domina $o$ y $o$ domina $a$, ídem con $b$. Tanto $a$ como $b$ pueden **leer y escribir** $o$ |
| 2 | $a \in C_1$, $o \in C_1$, $b \in C_2$ con $C_2$ dominando a $C_1$ | $b$ domina a $a$, $a$ domina a $o$, luego **$b$ domina a $o$ por transitividad** y puede leerlo |
| 3 | Igual que 2, más una restricción discrecional en curso $(b, -, C_1)$ | $a$ puede leer $o$ y escribir $o'$ en $C_2$, que $b$ **sí** puede leer. La restricción discrecional se elude por el camino indirecto |

> **El caso 3 se reporta tal como se leyó de la filmina.** La notación $(b, -, C_1)$ para la restricción discrecional **no la explica ni la filmina ni el audio**, y el docente pasa por encima rápido. Lo que sí queda claro es la moraleja: una prohibición discrecional puntual no sobrevive a la transitividad del flujo.

Y una advertencia del propio docente que conviene tener en la cabeza para calibrar cuánto estudiar de este tramo:

> [!quote]- Del video — cuánto de esto se usa en la práctica (40:08)
> "Estas técnicas de flujo de información hoy son **más teóricas**, esto se usa muy poquito en la práctica. Pero flujo de información y **análisis de información por entropía es mucho más común**, sobre todo en criptoanálisis."

O sea: la parte de dominancia es formalismo; la parte de entropía es la que se usa de verdad. Eso también dice dónde poner el esfuerzo de estudio.

---

## Mecanismos estáticos y dinámicos

**Filmina 16 (40:33).** Cómo se implementa el control de flujo. Duran juntos 44 segundos.

| | Cómo funciona |
|---|---|
| **Estáticos** | Se analiza el flujo **comando por comando**, con conceptos de teoría de compiladores, y **sólo se permiten comandos certificados**. Ramele lo asocia a los sistemas *hardened* donde sólo corre código autenticado |
| **Dinámicos** | Se asignan **etiquetas** a la información. Al leer, el usuario adquiere las etiquetas del dato; al escribir, el dato lleva todas las etiquetas del usuario; y cada zona tiene un conjunto de etiquetas **requeridas** y **prohibidas** |

**Esta mitad dinámica es el "Control de Acceso dinámico" del título de YouTube.** No es una clase de control de acceso: es marcado de información con etiquetas, o sea flujo de información. Vale la aclaración porque el título hace pensar otra cosa.

---

## Donde lo técnico se termina

**Filmina 17 (41:17).** El ejemplo es de esferas gubernamentales: un oficial que adquiere acceso a información confidencial **deja de poder emitir comunicados públicos**, para que no se le escape nada. Es control de flujo por etiquetas aplicado a personas.

Y ahí la filmina hace tres preguntas que se contestan solas: no se puede impedir que hable informalmente, que imprima documentación clasificada, ni que fotografíe una pantalla.

> [!quote]- Del video — el límite del mecanismo (41:57)
> "Sólo se puede controlar y se puede hacer un mecanismo técnico. Después está todo lo que excede a lo técnico."

> [!quote]- Del video — por dónde entran los ataques de verdad (42:16)
> "Los mayores ataques de estas cosas no son por análisis de flujo, sino más bien porque alguien deja un password escrito en un lugar, o lo llaman por teléfono y le hacen un chamullo, y da la información sin que se dé cuenta."

Ramele subraya que este punto **atraviesa toda la materia y toda la disciplina**. Es la misma idea que aparece en la [[video-09-pentesting-metodologia|metodología de pentesting]] por el lado de la ingeniería social.

---

## Confinamiento, aislación total y canales ocultos

**Filmina 18 (42:38).** El **problema de confinamiento**. Un sistema ideal tiene que hacer dos cosas:

1. Permitir que una entidad acceda **sólo** a los recursos para los que está autorizada. **Es la parte fácil** y ya existen mecanismos seguros para eso.
2. **No revelar información de ningún tipo** a quien no está autorizado. **Es la parte difícil.**

El problema de confinamiento, entonces: **prevenir que un servidor revele información que el usuario del servicio considera confidencial.**

**Filminas 19 y 20 (43:17 y 44:13).** La **aislación total** sería la solución perfecta. Requisitos: el proceso no puede comunicarse con otros procesos, y el proceso no puede ser observado. Consecuencia: no revela información. En la práctica es inalcanzable, porque los procesos usan **recursos medibles**: memoria, ciclos de CPU, espacio en disco, ancho de banda — y Ramele agrega **calor y señales electromagnéticas capturables desde el cuarto de al lado**. Dos procesos que tienen prohibido comunicarse igual comparten sistema de archivos, procesador y memoria.

> [!quote]- Del video — la conclusión sobre la aislación (44:06)
> "Es muy difícil que un sistema en sí mismo esté aislado, entonces en algún punto u otro, por algo, se puede llegar a escapar información."

**Filmina 21 (44:42).** El **canal oculto** es *un canal de comunicación que no fue diseñado para ello*. Clasificación y atributos, que es lo que entra en el parcial:

| | |
|---|---|
| **Espacial** | Usa **atributos de recursos compartidos** |
| **Temporal** | Usa **información temporal o de orden** en el acceso a recursos compartidos |
| **Ruido** | Capacidad de interferencia no premeditada de terceras partes |
| **Ancho de banda** | Tasa de transmisión del canal |

Y acá cierra el círculo con la primera mitad de la clase, que es el mejor momento del video:

> [!quote]- Del video — la definición de leakage en términos de entropía (44:50)
> "Ahí aparece la idea del *leak* de información: el **leakage** va a ser algo que me va a permitir **reducir la entropía condicional** de lo que yo quiero que permanezca oculto."

O sea: **la fuga es, exactamente, el flujo de la filmina 8**, medido con la misma desigualdad. Lo demás es el catálogo de por dónde puede pasar.

> El ejemplo largo del tramo 44:42-47:40 —el DRM por regiones en los DVDs y en las copias de películas para cines argentinos, burlado por alguien filmando la pantalla con una cámara— es una anécdota entretenida y de contenido conceptual casi nulo. Ilustra que el canal no diseñado siempre existe, y nada más. **Se puede saltear.**

**Filmina 22 (47:40).** El ejemplo que sí conviene saber, porque es el canal oculto temporal en su forma mínima:

> **Dos procesos que no pueden comunicarse pero comparten la CPU.** Para enviar un **bit 0**, el proceso $a$ devuelve el control al sistema operativo de manera inmediata. Para enviar un **bit 1**, hace uso intensivo de su *slot* temporal. El proceso $b$ accede al reloj de tiempo real y mide **cuánto tarda en recuperar la CPU**: si tardó más, es porque el SO se la estaba dando al otro. De ahí infiere el bit.

Es un canal de comunicación completo, con su codificación, construido sobre el planificador del sistema operativo. Ramele menciona además, al pasar, trabajos recientes de **reconstrucción de escenas de una habitación usando un router como transmisor y un receptor del otro lado**, y el problema de privacidad que eso implica.

---

## El side channel sobre la exponenciación modular

**Filmina 23 (49:08).** Un **side channel attack** es un ataque que hace uso de un canal oculto para ganar información. El caso de la filmina es el algoritmo de exponenciación entera para calcular $a^{b} \bmod n$:

$$\begin{aligned}
&x := 1; \quad a_{\mathrm{tmp}} := a \\
&\textbf{for } i := 0 \textbf{ to } k-1 \textbf{ do} \\
&\quad \textbf{if } b_i = 1 \textbf{ then } x := (x \cdot a_{\mathrm{tmp}}) \bmod n \\
&\quad a_{\mathrm{tmp}} := (a_{\mathrm{tmp}} \cdot a_{\mathrm{tmp}}) \bmod n \\
&\textbf{end} \\
&\mathrm{result} := x
\end{aligned}$$

donde $b_i$ es el $i$-ésimo bit de la representación binaria de $b$.

**El ataque, en una línea:** la multiplicación extra sólo se ejecuta cuando el bit vale $1$, así que **el tiempo de ejecución depende de los bits de $b$**. Aplicando métodos estadísticos sobre el canal de tiempo se reconstruye parte de $b$ — y $b$ es típicamente el exponente secreto.

De paso (49:22) aclara **la notación del módulo con paréntesis**, porque dice que muchos le contaron que no la conocían; la usa acá y también con curvas elípticas. La notación modular del vault está en [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]].

> **Este es el único punto del video donde la clase de seguridad toca criptografía concreta**, y es un buen enganche: el algoritmo de la filmina es el mismo de exponenciación rápida que aparece en cualquier implementación de RSA o Diffie-Hellman.

---

## Métodos de aislación: máquinas virtuales y sandboxes

**Filminas 24 a 26 (50:12).** Dos caminos para el confinamiento, y la diferencia clave es si hay que tocar el sistema o no.

| | **Máquina virtual** | **Sandbox** |
|---|---|---|
| Idea | Presentar un ambiente que se comporte como una computadora que sólo corre los procesos aislados | Correr los procesos en un ambiente que **analiza las acciones y detecta fugas** |
| ¿Modifica el sistema? | **No** | **Sí**: o el ambiente (kernel o SO modificado) o el programa (llamadas a puntos de control) |
| Sujetos y objetos | Los sujetos pasan a ser **las VMs**; los objetos, los recursos. El **núcleo de la VM** es el agente que provee seguridad | — |
| Ejemplos de la filmina | `KVM`, `VmWare`, `qemu`, `CCS64`, `Mame`, Java virtual machine | `Chroot`, Gentoo *ebuild sandbox*, la JVM vía `SecurityManager` |

Ramele agrega que los sandboxes son muy comunes en los sistemas operativos de celulares. Es el mismo mecanismo que el [[video-07-principios-de-diseno-2024|Video 07]] menciona bajo el principio 7 (mecanismos exclusivos), con el ejemplo del sandbox de iOS: **el video 07 lo nombra como principio, éste lo desarrolla como mecanismo.**

**Filmina 27 (51:14) — lectura recomendada.** Capítulo **16-1** y capítulo **17** de *Computer Security: Art and Science*, de Matt Bishop → [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|Bibliografía]].

---

## Qué marca como pregunta de examen

| Momento | Qué dice |
|---|---|
| **25:36** | Sobre correlacionar la velocidad del ventilador con la clave: es *"lo que charlamos en el examen, que pusimos como pregunta"*. **Ese escenario ya fue evaluado**, y lo vuelve a desarrollar entero en 30:01-32:47 |
| **28:49** | Después de la cuenta de $H(x)=3$: *"Si entendieron eso les va a servir un montón para todo"*. Es el punto donde conecta entropía con cantidad de bits para codificar una variable |
| **33:03-33:48** | Lo repite con el matiz que hace la diferencia: eso vale **sólo con distribución uniforme**, porque ahí se usa la capacidad máxima de Shannon |
| **42:43** | Al presentar el problema de confinamiento menciona un caso *"que estaba en el examen"*. **La referencia no se pudo resolver** — ver [[#Lo que no se pudo leer\|Lo que no se pudo leer]] |
| **49:22** | Sobre la notación de módulo con paréntesis: *"muchos me dijeron que no sabían la nomenclatura"* |
| **52:00** | Consultas en el **S206 de rectorado**, casi todos los días, *"sobre todo a la hora de venir los parciales y el final"* |

**Y lo que no marca pero es evidente por densidad:** las tres cuentas de entropía de las filminas 10, 11 y 12, y las dos desigualdades de la filmina 8. Ese es el criterio operativo para decidir si hay flujo, y es lo que un ejercicio de la Guía 8 va a pedir.

---

## Qué no cubre este video

Vale la pena ser explícito, porque el rótulo de la clase y el título de YouTube prometen más de lo que hay.

| Tema | Estado |
|---|---|
| **Malware** | **Cero.** Ni virus, ni gusanos, ni troyanos, ni *ransomware*, ni ninguna taxonomía de código malicioso. La verificación buscó estas palabras en los ocho reportes del Bloque 2 y encontró **un solo hit en todo el corpus**, en otro video y como anécdota. El cronograma llama a la Clase 9 *"Flujo de información y malware"*: **la mitad de malware no está en ninguna grabación del canal** |
| **Modelo Bell-LaPadula** | **No.** Sólo la relación de dominancia aplicada al flujo (filmina 15). Sin *simple security property* ni *star-property* |
| **Biba, Clark-Wilson, Chinese Wall** | **No.** Cero menciones en las ocho transcripciones del Bloque 2 |
| **Control de acceso, ACLs, listas de capacidades** | **No.** Diferido explícitamente a 03:28 a *"la clase de control de acceso"*, que da otro docente y **no existe en el canal** |
| **Políticas y modelos de seguridad** | **No.** A 37:10 lo trata como ya visto |
| **Pizarrón** | **No hay.** La clase entera son filminas en Preview, más el navegador en los primeros dos minutos y medio |

Y una honestidad más, sobre el tramo de entropía: **si ya leíste el apunte de [[teoria-de-la-informacion|Teoría de la información]], los quince minutos de la filmina 6 no te van a agregar nada técnico.** Lo que agregan es el encuadre —confirman que la cátedra lo dicta y para qué— y las dos o tres frases que fijan la intuición. La materia de examen de esos quince minutos cabe en la tabla de máximo y mínimo de más arriba.

---

## Los primeros dos minutos y medio son de otro tema

**00:00-02:25.** El video abre con Safari y un artículo de IEEE Spectrum, **"Why Bloat Is Still Software's Biggest Vulnerability"** (`spectrum.ieee.org/bloat-software-development`), dedicado a la memoria de **Niklaus Wirth** y que revive su **"A Plea for Lean Software"** de 1995, publicado en *Computer*. El argumento: dependemos de decenas de miles de paquetes que no controlamos, y eso es la peor práctica posible en seguridad; la propuesta es escribir software *lean*, chico y auditable, que **hereda mejor seguridad por los principios de diseño**. Ramele recomienda leerlo junto con el original de 1995.

***(Lectura nuestra.)*** El autor del artículo es **Bert Hubert**, deducido del `berthub.eu` que se ve en el texto en pantalla. Ramele no lo nombra.

**Esto es cola del [[video-07-principios-de-diseno-2024|Video 07]], no de esta clase.** Son dos minutos y medio de scroll sobre una pantalla, y todo el contenido conceptual pertenece a la clase de principios de diseño. Se puede saltar directo a 02:25.

---

## Misma jornada que el Video 07

Este video y el [[video-07-principios-de-diseno-2024|Video 07 — Principios de diseño (2024)]] **se subieron el mismo día (10/05/2024) y son la misma jornada de clase, partida en dos archivos por el recreo.** Verificado por la verificación adversarial: el Video 07 cierra con *"hacemos un descansito… volvemos y media, que vamos a ver flujo de información"*, y éste abre a 02:26 con:

> [!quote]- Del video — la apertura que engancha con la primera mitad (02:26)
> "va a heredar una mejor seguridad por varios de **los principios de diseño** [de los que] charlamos hoy"

**Si vas a mirar uno, mira los dos seguidos y en ese orden.** Y no leas el orden de las filminas como si fuera el orden del cronograma: el deck del Video 07 se llama `Clase 07 - …` pero mapea a la **Clase 8** del cronograma vigente, y el de éste se llama `Clase 09 - …` y mapea a la **Clase 9**. ***(Lectura nuestra:)*** la numeración de los decks es de otra cursada; que acá el número coincida es casualidad, y el mapeo se sostiene por el **tema** y por el **nombre del archivo del deck**, no por la fecha de subida.

> **La fecha de subida no dice cuándo se dictó.** La verificación adversarial refutó ese argumento para todo el corpus: los trece videos vienen de al menos siete cursadas repartidas en nueve años, hay subidas en sábado y domingo, y hay casos con tres años de desfasaje entre el dictado y la publicación. **De este video no se puede determinar la fecha de dictado**, sólo que es anterior o igual al 10/05/2024. La única ancla dura del mapeo a la Clase 9 es el nombre del PDF y el tema.

---

## Lo que no se pudo leer

Todo esto viene de la ingesta y conviene tenerlo declarado antes que aparezca como si fuera un hueco de la nota.

- **La referencia al examen en 42:43.** El ASR transcribe *"ese call server que estaba en el examen"*. Puede ser *"el caso del server"*, un nombre propio de un ejercicio, u otra cosa. **No se resolvió y no se inventó la referencia.** Si aparece el enunciado de ese examen, ahí se despeja.
- **La navegación de 40:07 a 40:33.** Hay un ida y vuelta muy rápido entre las filminas 11, 14, 15 y 16 que no se mapeó paso a paso. El orden que reporta esta nota es el de los frames capturados y **puede haber alguna filmina intermedia que el muestreo no agarró**.
- **La notación $(b, -, C_1)$ de la restricción discrecional** (filmina 15): se leyó de la filmina pero ni la filmina ni el audio la explican.
- **Dos momentos deícticos irrecuperables.** A 18:39 pregunta *"¿ustedes ven el cursor moverse en la pantalla?"* y a 19:09 dice *"es lo que está ahí"*, señalando la parte de máximo y mínimo de la filmina 6. A la resolución de los frames **el cursor no se distingue**; el contenido señalado se dedujo de lo que dice, y es inequívoco (el caso de la distribución en pico).
- **Reparto desparejo de los frames.** El muestreo por escena puso 121 de 170 frames en los primeros tres minutos —porque el profesor scrollea el artículo y cambia de ventana— y dejó huecos en la parte teórica. Se taparon con un segundo pase dirigido de 18 frames. El resultado verificado: el tramo 05:52-21:00 tiene la filmina 6 fija en pantalla y **toda la explicación de teoría de la información es oral**.
- **Las citas de esta nota están levemente limpiadas** de muletillas y repeticiones del ASR. Son fieles en contenido, no palabra por palabra. Las intervenciones de los alumnos —la definición termodinámica a 13:50 y la pregunta sobre la desigualdad a 29:06— se oyen especialmente mal: el sentido general es claro, las palabras exactas no, y por eso van parafraseadas y no entre comillas.

---

## Ver también

- [[video-07-principios-de-diseno-2024|Video 07 — Principios de diseño (2024)]] — la primera mitad de esta misma jornada. Mirala antes.
- [[video-06-principios-de-diseno-2026|Video 06 — Principios de diseño (2026)]] — la versión vigente del deck de principios; su principio de mecanismos exclusivos es el que acá se desarrolla como VMs y sandboxes.
- [[video-08-vulnerabilidades|Video 08 — Vulnerabilidades]] — el otro video del Bloque 2 que habla de confinamiento.
- [[video-09-pentesting-metodologia|Video 09 — Pentesting: metodología]] — la ingeniería social, que es el *"todo lo que excede a lo técnico"* de la filmina 17.
- [[teoria-de-la-informacion|Teoría de la información]] — **el desarrollo largo de la filmina 6**: entropía, entropía condicional, información mutua, capacidad de canal y el puente con criptografía. Es la nota que este video ancla.
- [[notacion-y-terminologia#Teoría de la información|Notación y terminología]] — la tabla de símbolos de teoría de la información del vault, para traducir la notación del video.
- [[secreto-perfecto|Secreto perfecto]] — lo que Ramele invoca a 22:39: no correlacionar criptograma y texto plano es el caso límite de no tener flujo.
- [[maleabilidad#El escenario: la base de sueldos|Maleabilidad]] — la misma base de sueldos, atacada por el otro lado.
- [[probabilidad-y-criptografia|Probabilidad y criptografía]] — las tres fórmulas de probabilidad condicional que hacen falta para seguir las cuentas de entropía condicional.
- [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] — la notación de módulo que aclara a 49:22.
- [[bibliografia#2. Matt Bishop — Computer Security: Art and Science|Bibliografía]] — Bishop, capítulos 16-1 y 17, la lectura de la filmina 27.
- [[videografia|Videografía]] — dónde encaja este video entre los trece.
- [[cronograma|Cronograma]] — Clase 9 (22/10) y Guía 8 (26/10).
- [[tp-implementacion|TP de Implementación]] — el enunciado que anuncia en el cierre, a 51:39.
