---
title: Message Authentication Code
resumen: 'Primitiva con la que la criptografía provee integridad: la terna Gen, Mac y Vrfy que etiqueta un mensaje con una clave compartida; la verificación devuelve solo un bit y no da confidencialidad ni no repudio.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [MAC, Message Authentication Code, Código de autenticación de mensajes, Etiquetador, Gen/Mac/Vrfy]
type: concepto
unidad: 1
clase: 3
orden: 3
created: 2026-08-28
updated: 2026-09-04
tags: [criptografia, mac, integridad, gen-mac-vrfy, etiqueta, autenticacion, clase-03]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt1-Transcripcion.VTT", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "raw/practicas/Clase 4.pdf"]
---

# Message Authentication Code

**La primitiva con la que la criptografía provee integridad.** Esta nota fija *qué es* un MAC —la terna, los tres espacios, la propiedad básica— y en qué se parece y en qué no al [[criptosistema]] de la Clase 1. *Qué significa que un MAC sea seguro* es la nota siguiente: [[seguridad-de-un-mac|Seguridad de un MAC]].

> **MAC no tiene nada que ver con las direcciones de red.** Es *Message Authentication Code*. El docente lo aclara apenas escribe la sigla (cues pt1 396-397), porque la colisión de nombres es inevitable en una carrera de sistemas.

> **Cómo se citan los cues acá.** La Clase 03 se dictó en **dos sesiones** —27/08 y 03/09— y cada transcripción numera sus cues desde 1, así que un número suelto no identifica nada. Por eso todo cue lleva **prefijo de parte**: `(cues pt1 N-M)` para el 27/08 y `(cues pt2 N-M)` para el 03/09 → [[clase-03-macs-y-cifrado-autenticado|Clase 03]].

---

## Qué problema resuelve

La primera mitad de la Clase 3 llega a un callejón: la [[maleabilidad]] permite modificar quirúrgicamente un criptograma sin descifrarlo, el [[ataque-de-texto-cifrado-escogido|ataque de texto cifrado escogido]] formaliza ese poder, y **ningún criptosistema visto hasta ese punto pasa la prueba** — ni siquiera el [[one-time-pad|One Time Pad]], que tiene [[secreto-perfecto|secreto perfecto]] (cue pt1 193). La filmina 13 saca la conclusión en tres renglones:

> Es un problema **no resuelto por el cifrado solamente**. Requiere **control de integridad**: identificar adulteraciones. Primitiva criptográfica: **MAC**.

Lo que cambió no es la fuerza del cifrado sino **el servicio de seguridad** que hace falta. Hasta la Clase 2 todo el aparato —`Eav`, `Mul`, `CPA`— medía **confidencialidad**: que el adversario no pueda *leer*. Acá el adversario no lee, **escribe**; y eso se analiza en otro campo, que es **integridad**.

> [!quote]- De la transcripción — el pasaje de confidencialidad a integridad (cues pt1 379-395)
> **379.** "Cuando empezamos la clase, ¿qué fue lo novedoso que hicimos acá que no habíamos hecho antes? Antes era: tengo el texto cifrado, quiero extraer la información. **Acá hicimos algo distinto: acá modificamos el texto cifrado.**"
> **385-390.** "Yo acá evité cuidadosamente hablar de confidencialidad: hablé de un problema de seguridad. Pero lo que ocurrió acá, en realidad, es que este es un problema de seguridad de otro tipo: es un problema de seguridad que ocurre **a raíz de que alguien tiene la capacidad de modificar lo que se almacenó o lo que se transmitió**. A ese campo se lo llama **integridad**, y es otro de los grandes servicios de seguridad que vamos a ver en la materia."
> **392-395.** "Hasta ahora veníamos viendo **confidencialidad**: cómo, a partir de ciertas transformaciones, nadie puede extraer información. Hoy vamos a entrar al mundo de **integridad**: cómo podemos identificar adulteraciones o modificaciones no permitidas en la información. Y vamos a ver que, si bien sigue siendo parte de criptografía y vamos a tratar de darle una forma parecida, **las construcciones son un poco distintas**."

### Integridad ingenua e integridad practicable

La sesión del 03/09 abre con doce minutos de repaso hablado, y ahí sale **la definición operativa de integridad que la materia usa y que ninguna filmina escribe**. Son dos definiciones, y la que vale es la segunda:

- La **ingenua** es *controlar* la modificación: impedir que la información se altere. Es impracticable, y no por falta de herramientas criptográficas — exige controlar **toda la cadena** por la que la información pasa, dónde se genera, dónde se almacena y dónde se consume, y casi nunca se tiene esa cadena entera bajo control.
- La **practicable** es *detectar* la modificación. Se renuncia a impedirla y se garantiza, en cambio, que ninguna pase inadvertida. Es exactamente lo que entrega un MAC, y por eso la filmina 13 dice *"identificar adulteraciones"* y no *"impedirlas"*.

Y una segunda precisión, sobre qué es lo que la integridad provee: la confidencialidad se define contra el **ocultamiento**; la integridad, contra la **confianza**. Confiar en que la información fue emitida por quien dice haberla emitido, en que lo que se está leyendo no fue modificado, y en que su calidad alcanza para tomar decisiones sobre ella. Las tres son propiedades del *uso* de la información, no de su secreto.

> [!quote]- De la transcripción — integridad ingenua contra integridad práctica, y la integridad como confianza (cues pt2 13-21)
> **13-16.** "Una definición por ahí más ingenua de integridad habla de **controlar** la modificación de la información. Pero en realidad el controlar suele ser muy difícil, porque implica controlar toda la cadena que se va formando en el lugar **donde se genera, se almacena y se consume** la información. Entonces, en términos prácticos, rara vez uno puede controlar toda esa cadena. […] Pero la integridad tiene que ver más, en un sentido práctico, con **detectar** esas modificaciones no [autorizadas]. Lo vamos a revisitar después, cuando veamos ya seguridad en aplicaciones, en sistemas."
>
> **18-21.** "La confidencialidad está asociada con **ocultar** información. La integridad está asociada al **criterio de confianza**. La integridad nos da la capacidad de confiar en que la información fue emitida por alguien, o que la información que estamos leyendo no fue modificada, o en que **la calidad de la información se puede utilizar para tomar otras decisiones**."
>
> *(El corchete del cue pt2 16 corrige el ASR, que dice "modificaciones no no adulteradas" y no cierra.)*

### Por qué la integridad no se resuelve con cifrado

*(Lectura nuestra: la filmina afirma que el cifrado no alcanza, pero no argumenta por qué.)* Hay tres razones, de menor a mayor fuerza:

1. **Ninguna de las pruebas de la Clase 2 mide modificación.** `Eav`, `Mul` y `CPA` terminan con el adversario emitiendo un bit $b'$: lo que se le pide es *distinguir*, o sea extraer información. Un adversario que no adivina nada pero altera el criptograma **gana cero** en esas pruebas, y sin embargo hizo daño. Lo que no se mide, no se protege.
2. **El ataque de reemplazo de fila de la filmina 6 no descifra nada.** Copiar el blob cifrado del sueldo del jefe sobre la fila propia es un *copy-paste*: la confidencialidad del criptosistema queda intacta y el ataque funciona igual. Ver [[maleabilidad|Maleabilidad]].
3. **El argumento definitivo: el OTP.** El One Time Pad tiene la propiedad de confidencialidad **más fuerte que existe** —secreto perfecto, no computacional, incondicional— y **aun así cae** bajo `CCA` (cue pt1 193). Si la confidencialidad llevada al límite teórico no alcanza, entonces ninguna versión más débil va a alcanzar: **la integridad no es un grado más de confidencialidad, es otro eje**. Hace falta una primitiva nueva.

---

## La terna Gen, Mac y Vrfy

La filmina 14 **calca la estructura** de la filmina de criptosistema: tres algoritmos y tres conjuntos.

$$\begin{aligned}
\mathsf{Gen} &: () \to \mathcal{K} && \text{generador de clave}\\
\mathsf{Mac} &: \mathcal{K}\times\mathcal{P} \to \mathcal{T} && \text{etiquetador}\\
\mathsf{Vrfy} &: \mathcal{K}\times\mathcal{P}\times\mathcal{T} \to \{0,1\} && \text{verificador}
\end{aligned}$$

| Conjunto | Qué es |
|---|---|
| $\mathcal{K}$ | espacio de **claves**: todas las claves posibles |
| $\mathcal{P}$ | espacio **plano**: todos los mensajes posibles |
| $\mathcal{T}$ | espacio de **etiquetas**: todas las etiquetas posibles |

**Propiedad básica** (la filmina la llama así; es la contraparte exacta de la condición de corrección de un criptosistema):

$$\forall m \in \mathcal{P},\ \forall k \in \mathcal{K}\ \text{válidos}: \qquad \mathsf{Vrfy}_k\bigl(m,\ \mathsf{Mac}_k(m)\bigr) = 1$$

Es decir: **una etiqueta legítima siempre verifica**. Nada más. Igual que $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$, esta condición dice que el esquema se cree a sí mismo y **no dice absolutamente nada sobre seguridad** — y ese es exactamente el gancho de la filmina siguiente:

> [!quote]- De la transcripción — por qué la propiedad básica no alcanza (cue pt1 419)
> **419.** "**Hay un montón de funciones que cumplen con esta propiedad y que jamás se nos ocurriría usar en seguridad.**"

La función constante $\mathsf{Mac}_k(m) := 0$ con $\mathsf{Vrfy}_k(m,t) := 1$ cumple la propiedad básica y no autentica nada *(ejemplo nuestro)*. Por eso hace falta el experimento [[seguridad-de-un-mac#El experimento Mac-Forge|Mac-Forge]].

> **Tres precisiones de Katz & Lindell que la filmina redondea** (Definición 4.1):
> - **`Mac` puede ser aleatorizado.** Por eso el libro escribe $t \leftarrow \mathsf{Mac}_k(m)$ con flecha y no con $:=$. La mayoría de los MACs reales son determinísticos, pero la definición no lo exige — y el tercer MAC del [[seguridad-de-un-mac#El ejercicio de los tres MACs|ejercicio de la clase]] es justamente uno que no lo es.
> - **`Vrfy` es siempre determinística.** Un verificador que a veces dice que sí y a veces que no sobre el mismo par no serviría para nada.
> - **MAC de longitud fija.** Si $\mathsf{Mac}_k$ sólo está definida para mensajes de una longitud $\ell(n)$, el esquema se llama *fixed-length MAC*. Es la categoría a la que pertenece el [[cbc-mac|CBC-MAC]] básico, y la distinción es la que vuelve inteligible el ataque de la filmina 19.

---

## El paralelo con el criptosistema, y las tres diferencias

Que la filmina 14 sea una copia de la filmina 2 es deliberado y ayuda a memorizar; pero **lo que hay que tener claro para el parcial son las diferencias**, no el parecido.

| | [[criptosistema\|Criptosistema]] | MAC |
|---|---|---|
| Terna | $(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ | $(\mathsf{Gen}, \mathsf{Mac}, \mathsf{Vrfy})$ |
| Conjuntos | $\mathcal{K}$, $\mathcal{P}$, $\mathcal{C}$ | $\mathcal{K}$, $\mathcal{P}$, $\mathcal{T}$ |
| Condición básica | $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ | $\mathsf{Vrfy}_k(m,\mathsf{Mac}_k(m)) = 1$ |
| Qué devuelve la segunda función | el **mensaje** | **un bit** |
| ¿Son inversas una de la otra? | Sí | **No** |
| Servicio de seguridad | confidencialidad | **integridad** |
| ¿Sirve si es determinístico? | no puede ser CPA-Secure | **Sí, sin problema** |
| Prueba con la que se mide | `Eav` / `Mul` / `CPA` / `CCA` | [[seguridad-de-un-mac\|Mac-Forge]] |

### Vrfy devuelve un bit y no recupera nada

`Enc` y `Dec` son un **ida y vuelta**: van y vienen entre $\mathcal{P}$ y $\mathcal{C}$, y una deshace a la otra. `Mac` y `Vrfy` no: `Mac` va de mensajes a etiquetas, y `Vrfy` **no vuelve** — toma las tres cosas juntas y emite un veredicto.

> [!quote]- De la transcripción — Mac y Vrfy no son inversas (cues pt1 399-418)
> **399-403.** "Es una terna de algoritmos también. Tiene un algoritmo de generación de clave, como los criptosistemas —o sea que se usan claves—. Pero las operaciones son distintas: hay una función que se suele llamar **etiquetadora, *labelling* en la literatura en inglés**, que a partir de una clave y un mensaje genera una etiqueta; y una función de verificación que a partir de una clave, un mensaje y una etiqueta emite una decisión sobre si la verificación se pasa o no."
> **407-410.** "**Fíjense que es distinto: acá no es un ida y vuelta entre dos conjuntos con funciones que actúan como inversas.** Son bastante distintas las funciones: una, a partir de una clave y cualquier tipo de mensaje, lo etiqueta, genera una etiqueta; y otra, a partir de un mensaje, una etiqueta y la clave, nos dice si verifica o no la relación."

**Consecuencia que conviene sacar** *(lectura nuestra).* La etiqueta **no es el mensaje cifrado**: no hay forma de recuperar $m$ a partir de $t$, ni se pretende. Es más — en cualquier MAC usable $\mathcal{T}$ es un conjunto **finito y chico** (etiquetas de longitud fija) mientras que $\mathcal{P}$ contiene mensajes de longitud arbitraria, así que por el **principio del palomar** $\mathsf{Mac}_k$ **no puede ser inyectiva**: para toda clave existen $m \ne m'$ con la misma etiqueta. Las colisiones no son un defecto que se pueda eliminar, **existen siempre**. De ahí que la seguridad se defina como *"nadie las puede encontrar en tiempo polinómico"* y no como *"no las hay"* — es el mismo giro que después se repite con las [[resistencias-de-una-funcion-de-hash|funciones de hash]].

### El MAC no da confidencialidad

Nada en la definición pide que $t$ oculte $m$. Y no es un olvido: es **estructural**.

> **La demostración, en tres líneas** *(desarrollo nuestro).* Sea $\Pi = (\mathsf{Gen},\mathsf{Mac},\mathsf{Vrfy})$ un MAC infalsificable. Definamos $\mathsf{Mac}'_k(m) := m \,\Vert\, \mathsf{Mac}_k(m)$, y que $\mathsf{Vrfy}'$ parta la etiqueta, chequee que la primera parte sea $m$ y le pase el resto a $\mathsf{Vrfy}$. Toda falsificación contra $\Pi'$ contiene adentro una falsificación contra $\Pi$, así que **$\Pi'$ es tan infalsificable como $\Pi$** — y publica el mensaje entero en claro dentro de la etiqueta. Conclusión: **un MAC puede ser perfectamente seguro y filtrar todo el mensaje.**

Por eso las dos cosas se piden por separado y hay que **combinar** un criptosistema con un MAC para tener ambas: cómo se combinan (y cuál de las tres formas es la que se rompe) es [[privacidad-e-integridad|Privacidad e integridad]], y el resultado con nombre propio es el [[cifrado-autenticado|cifrado autenticado]].

### Un MAC determinístico no es un problema

En la Clase 2 quedó grabado que *"un criptosistema determinístico no puede ser CPA-Secure"* ([[pruebas-de-indistinguibilidad#Propiedades de CPA|demostración]]). **Esa regla no se transfiere a los MACs**, y confundirlas es el error más fácil de cometer en este tema.

*(Lectura nuestra; la filmina no discute el punto.)* La razón es que **las dos pruebas piden cosas distintas**:

- En `CPA` el adversario tiene que **distinguir**. Si `Enc` es determinística, le alcanza con pedirle al oráculo el cifrado de $m_0$ y compararlo con el desafío: el determinismo le entrega el juego entero, porque criptogramas iguales delatan mensajes iguales.
- En [[seguridad-de-un-mac#El experimento Mac-Forge|Mac-Forge]] el adversario tiene que **producir** una etiqueta válida sobre un mensaje **que no consultó**. Que las etiquetas sean repetibles no le sirve: las únicas que puede predecir son las de los mensajes de $Q$, que son exactamente los que la prueba le prohíbe emitir. **La repetibilidad no le regala nada.**

Y Katz & Lindell va más lejos todavía: la **Proposición 4.4** dice que un MAC seguro con **verificación canónica** —recalcular la etiqueta y comparar, que es lo único que se puede hacer si `Mac` es determinística— es automáticamente un MAC **fuertemente** seguro. O sea que en los MACs el determinismo, lejos de ser un defecto, **te regala la propiedad más fuerte**.

Esto no es un tecnicismo: **[[cbc-mac|CBC-MAC]] y [[hmac|HMAC]] son determinísticos**, son el resto de la Clase 3, y son los MACs que se usan de verdad. Si el determinismo fuera un problema, la clase se quedaría sin construcciones. En la clase del 27/08 se dijo lo contrario al resolver el primer MAC del ejercicio; la corrección, con la cita al lado, está en [[seguridad-de-un-mac#El ejercicio de los tres MACs|Seguridad de un MAC]].

---

## Cómo se usa: la etiqueta es pública, la clave no

El escenario de uso no está en ninguna filmina y sale entero de la transcripción. Se etiqueta el mensaje una vez, se guardan **mensaje y etiqueta** —juntos o separados, da igual— y en cualquier momento posterior se verifican. Con un MAC infalsificable, **nadie puede modificar el mensaje, ni la etiqueta, ni las dos cosas a la vez, y pasar la verificación**: como `Vrfy` mira el **par**, cualquiera de los tres cambios se detecta.

> [!quote]- De la transcripción — la etiqueta es pública y el uso típico (cues pt1 460-469)
> **460-462.** "Yo puedo tomar un mensaje cualquiera, que es el que quiero proteger, sobre el cual quiero detectar modificaciones, y calcular una etiqueta. Y puedo **guardar el mensaje y la etiqueta juntos o separados, no importa**. En algún futuro lejano yo puedo recuperar el mensaje, recuperar la etiqueta y verificarlos."
> **463-464.** "Con la seguridad de que, si tengo un MAC infalsificable, **nadie podría modificar el mensaje, modificar la etiqueta o modificar ambos y lograr pasar la prueba**."
> **466.** *(respondiendo a Carlos, que preguntó por el chat)* "**La etiqueta no tiene por qué ser privada. Lo que es privado es la clave** —por eso es una función con clave."
> **467-469.** "Pero la etiqueta puede ser pública, la podés guardar junto con el mensaje, no hay ninguna restricción de ese tipo. **Porque como la verificación depende del par, va a detectar tanto cambios del mensaje como de la etiqueta como de ambos.**"

> **La primera constancia escrita de que el par viaja junto.** La filmina 1 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] (31/08) redibuja la terna y agrega al pie la anotación **"emisor envía $\langle m,t\rangle$"**. Hasta entonces el vault sostenía ese punto sólo con la transcripción del 27/08. La misma filmina encabeza con el diagnóstico que abre el tema —*"Esquema Encripción (Cifrado): provee confidencialidad · no detecta alteraciones en mensaje · no provee INTEGRIDAD-AUTENTICACIÓN"*— y ahí hay un detalle que conviene registrar: **junta integridad y autenticación en un solo renglón**, que es justamente la conflación que el docente desarma después → [[#Dónde queda la autenticación|Dónde queda la autenticación]].

**Y ahí está la razón de ser de la clave** *(lectura nuestra).* Un CRC o un checksum también detectan modificaciones, pero **cualquiera los recalcula**: el atacante modifica el mensaje, recalcula el checksum y reemplaza los dos. Lo que hace que un MAC sirva contra un adversario y no sólo contra el ruido del canal es que **la etiqueta no se puede recalcular sin $k$**. Es el [[principio-de-kerckhoffs|principio de Kerckhoffs]] otra vez: el algoritmo es público, el único secreto es la clave.

---

## Los tamaños reales, y la fuerza bruta sobre la etiqueta

Ninguna filmina de la Clase 03 da un número; el repaso del 03/09 sí. Un MAC de los que se usan tiene **etiquetas de 128 a 256 bits** y **claves de 128 a 256 bits**.

> **Corrección del ASR, y por qué hay que hacerla.** La transcripción dice *"etiquetas de 128 a 256 **Byte**"* y *"claves de 128 a **156** Byte"* (cues pt2 85-86). Las dos cosas están mal transcriptas: la unidad es el **bit** —128 bytes serían 1024 bits, un tamaño que no usa ningún MAC estándar— y el *156* es el reconocedor comiéndose el 2 de **256**. Al citar se corrige entre corchetes, y queda dicho acá que se corrigió. *(Precisión nuestra.)*

El número importa porque hay **un ataque que existe siempre** y que ninguna construcción puede eliminar: probar etiquetas al azar hasta que una verifique. Es la misma [[ataque-de-fuerza-bruta|fuerza bruta]] de los criptosistemas, corrida al espacio $\mathcal{T}$. Contra eso no hay teorema; hay **dimensionamiento** — se eligen $\lvert\mathcal{T}\rvert$ y $\lvert\mathcal{K}\rvert$ tan grandes que la probabilidad de acertar quede despreciable. Con $2^{128}$ etiquetas el docente ofrece la escala de siempre: más que los átomos del universo, más que los segundos transcurridos desde el Big Bang.

> [!quote]- De la transcripción — la fuerza bruta sobre etiquetas y los tamaños de referencia (cues pt2 66-88)
> **66-72.** "Así como en los criptosistemas existía un ataque por fuerza bruta, acá yo también podría generar un mensaje y empezar a probar todas las etiquetas posibles. […] Alguien con toda la suerte del universo podría pegarle a alguna etiqueta al azar que justo pase la validación: sí, podría. **Alguien que se ponga a probar sin parar etiquetas podría encontrar una etiqueta que pase la validación: sí, podría.**"
>
> **73-80.** "Pero ahí entramos en lo mismo que hicimos con los criptosistemas: nosotros podemos trabajar con conjuntos tan grandes de posibles etiquetas, y conjuntos tan grandes de posibles claves, **de tal forma que la chance de que eso ocurra sea muy baja**. […] Si la cantidad de etiquetas es más de $2^{128}$, en principio **ya pasamos la cantidad de átomos del universo, la cantidad de segundos desde el Big Bang**. Valen todas las analogías que quieran: si cada átomo fuese una computadora completa que puede calcular una etiqueta por segundo, estamos cubiertos."
>
> **81-88.** "Lo mismo que los criptosistemas: se diseñan para que los parámetros —el tamaño de las etiquetas, el tamaño de las claves— **vuelvan despreciablemente baja esa probabilidad de éxito**. Para que tengan de referencia, un MAC suele tener etiquetas de 128 a 256 [bits], los más usados, y claves de 128 a [256 bits]. Estamos en escenarios parecidos, en la tolerancia a tener mala suerte o a que alguien nos ataque por fuerza bruta, que con los criptosistemas."
>
> *(Correcciones del ASR: "2 a la 100, 28" es $2^{128}$; "Byte" son **bits** en los dos casos y "156" es **256** — ver el recuadro de arriba.)*

**Esto convierte en material de cátedra lo que el vault tenía sólo como apostilla de libro.** El [[seguridad-de-un-mac#Por qué la cota es despreciable y no un medio|Ejercicio 4.1 de Katz & Lindell]] demuestra que la etiqueta tiene que medir un número **superlogarítmico** de bits o el MAC no puede ser seguro, por bien construido que esté; los cues de arriba son la misma idea dicha como criterio de diseño. Teorema y práctica coinciden: **el tamaño de la etiqueta es condición necesaria, y elegirlo es parte del diseño, no del análisis.**

## Por qué un MAC no da no repudio

*(Lectura nuestra; ninguna filmina de la Clase 3 usa la palabra "no repudio", y la transcripción tampoco.)*

Un MAC es de **clave simétrica**: emisor y receptor comparten la misma $k$. De ahí sale una limitación que no es de implementación sino de definición:

- Si Bob recibe $(m,t)$ y $\mathsf{Vrfy}_k(m,t)=1$, Bob sabe que **alguien que conoce $k$** produjo esa etiqueta.
- Pero Bob **también** conoce $k$. Así que Bob no puede demostrarle a un tercero que la etiqueta la hizo Alice: **la podría haber fabricado él mismo**, y el tercero no tiene forma de distinguir los dos casos.

O sea que un MAC da **integridad y autenticación de origen entre las dos partes que comparten la clave**, y nada más. No sirve como evidencia frente a un juez, un auditor o cualquier tercero. Peor todavía si la clave la comparten $n$ partes: la etiqueta válida no identifica a **cuál** de las $n$.

Lo que sí da no repudio es la **firma digital**, y la razón es exactamente la asimetría de claves: se firma con una clave privada que **nadie más tiene**, y se verifica con la pública. Eso sigue sin dictarse al 04/09: la [[cronograma|criptografía asimétrica es la Clase 4, del 10/09]], y la firma digital aparece nombrada en la Guía 4 (14/09). Así que **el vault todavía no tiene nota de firma digital**, y esta sección no afirma nada sobre cómo se construye.

> **Verificado, pese a que el archivo se llamó "Clase 04" hasta el 04/09.** La segunda sesión de la Clase 3 quedó grabada en `Clase 03pt2 - Transcripcion.VTT`. En sus 910 cues no hay criptografía asimétrica ni firma digital: lo más cerca que llega es el intercambio de los cues pt2 642-645, donde un alumno nombra la autenticación y el docente la deja explícitamente para más adelante. La Clase 4 sigue pendiente. *(Precisión nuestra.)*

### Dónde queda la autenticación

El 03/09, al repreguntar por qué se había empezado a hablar de MACs, un alumno propone que el servicio buscado es **autenticar** — *"saber si el que te da algo es realmente esa persona"*. El docente **valida la respuesta y la ubica**: la autenticación es parte de los servicios de integridad y estas primitivas sirven para construirla, pero es **un concepto de nivel aplicación** que la materia todavía no vio. La respuesta que buscaba era la del problema concreto de la clase anterior: la alteración de datos ya cifrados.

Vale la pena tener esa ubicación clara, porque el vocabulario se mezcla enseguida — la filmina 1 de la Práctica 04 escribe *"INTEGRIDAD-AUTENTICACIÓN"* como si fueran una sola cosa. No lo son:

| Servicio | Qué afirma | ¿Lo da un MAC? |
|---|---|---|
| **Integridad** | el mensaje no cambió | Sí |
| **Autenticación de origen** | lo emitió quien comparte la clave | Sí, sólo entre las partes que la comparten |
| **No repudio** | y se le puede probar a un tercero | No, y no es cuestión de construir mejor: es la simetría de la clave |

> [!quote]- De la transcripción — la autenticación, ubicada a nivel aplicación (cues pt2 642-651)
> **642-643.** *(Emilio José Mitchell)* "No sé si la palabra era **autenticar**, o saber si el que te da algo es realmente esa persona."
>
> **644-645.** *(Pablo Abad)* "Vale. **Autenticación es parte de los servicios de integridad**, y se pueden usar estas cosas. Sólo que no lo vimos: te estás adelantando, porque es **un concepto más a nivel aplicación**. Pero es válido lo que decís."
>
> **647-651.** "La pregunta más visceral: cuando empezamos esta clase, el jueves pasado, veníamos de criptosistemas —pruebas cada vez más complicadas de seguridad— y de golpe apareció un problema que no podíamos resolver. […] *(Emilio)* La alteración de datos encriptados. *(Pablo)* De datos encriptados. Perfecto. Eso."

---

## Estado de las fuentes

- La definición (filminas 13 y 14) tiene **respaldo de transcripción doble**: el bloque de MAC va de los cues pt1 396 a 418, y se vuelve a desarrollar entero en el repaso que abre la sesión del **03/09** (cues pt2 22-37), las dos con Pablo Abad. El repaso no contradice nada de lo que esta nota ya decía: reconfirma la terna, la propiedad básica y el hecho de que la etiqueta no reconstruye el mensaje.
- La discusión sobre la etiqueta pública sale de una pregunta de alumno por chat (cues pt1 466-469), no de las filminas. La filmina 1 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] (31/08) agrega la primera constancia **escrita** de la cátedra de que el par $\langle m,t\rangle$ viaja junto.
- **Sólo de la sesión del 03/09, sin filmina que lo sostenga:** la distinción entre integridad ingenua y practicable, la integridad como criterio de confianza, los tamaños de etiqueta y clave, la analogía de $2^{128}$ y la ubicación de la autenticación a nivel aplicación.
- **Lo que no está en ninguna fuente y va rotulado como lectura nuestra:** el argumento del OTP, el argumento del palomar sobre $\mathcal{T}$, la construcción $\mathsf{Mac}'_k(m) = m \Vert \mathsf{Mac}_k(m)$, la comparación con el CRC y toda la sección de no repudio. El 03/09 respalda de costado la conclusión —no la construcción— de que el MAC no oculta nada:

> [!quote]- De la transcripción — el MAC no protege la confidencialidad, en el repaso socrático del 03/09 (cues pt2 654-659)
> **654-657.** "Lo que vimos hasta acá —MACs y funciones de hash— ataca el otro problema. Pero **no hay nada en la definición de las funciones de hash o de los MACs que proteja la confidencialidad** de la información. Si nosotros construimos una solución sólo con hash y con MACs, genial: detectamos la modificación. Pero todo el mundo vería la información, o tendría acceso a la información o a parte de la información."
>
> **658-659.** "Incluso —**porque el modelo de seguridad contra falsificaciones no lo toma en cuenta**— no hay nada que diga que, a partir de la etiqueta, yo tal vez no pueda recuperar el mensaje original; pero **tal vez pueda extraer parte** del mensaje original, o parte de la información, que es lo que queremos proteger realmente cuando hablamos de confidencialidad."
