---
title: Video 02 — Guía rápida a teoría de números
resumen: 'Video de 2018 de Rodrigo Ramele que narra a mano el manuscrito de teoría de números de la cátedra: divisor, mcd, división entera, diofánticas, congruencias e inverso modular, con restos de dividendo negativo.'
fuentes: ["[[teoria-de-numeros]]", "[[clase-02-cifrado]]", "[[videografia]]", "[[algoritmo-de-euclides-extendido]]"]
aliases: [Video 02, Video de teoría de números, Video de inversas modulares, Cifrado multiplicativo módulo 5, Resto de dividendo negativo]
type: video
clase: 4
orden: 40
video: 02
youtube: FcM8RpBvkf4
created: 2026-09-03
updated: 2026-09-04
tags: [video, teoria-de-numeros, aritmetica-modular, congruencia-modular, inverso-modular, euclides, ecuacion-diofantica, clase-02, parcial]
sources: ["https://www.youtube.com/watch?v=FcM8RpBvkf4"]
---

# Video 02 — Guía rápida a teoría de números

| | |
|---|---|
| **Título en YouTube** | *Criptografía y Seguridad Informática - Guía Rápida a Teoría de Números* |
| **Link** | https://www.youtube.com/watch?v=FcM8RpBvkf4 |
| **Duración** | 31:58 |
| **Subido** | 09/04/2018 (lunes) |
| **Visibilidad** | Público (uno de los pocos del canal que no está oculto) |
| **Autor** | Rodrigo Ramele, canal `@faturita` |
| **Qué es** | **No es una grabación de clase**: es material didáctico producido aparte. Ver [[#Lo primero: esto no es una clase\|abajo]] |
| **Mapeo** | Tarea encargada al cerrar la [[clase-02-cifrado\|Clase 02]] (transcripción pt1, cues 840-846). Base **aritmética** de la Clase 4 (asimétrica, RSA) — con el matiz de [[#Lo que el video NO trae: el salto a RSA no está\|más abajo]] |
| **Soporte** | Cámara cenital sobre un cuaderno cuadriculado. Cero filminas, cero pantalla compartida |

**Vale la pena verlo si** buscas ver resuelto de punta a punta, con números, el cálculo de un inverso modular y el manejo del resto con dividendo negativo — que es exactamente lo que el [[teoria-de-numeros|manuscrito de teoría de números]] enuncia pero nunca ejemplifica. **No es necesario si** buscas RSA, exponenciación modular o el algoritmo de Euclides justificado: nada de eso está acá.

> **Advertencia sobre las citas y los timestamps.** Las citas de esta nota vienen de los subtítulos automáticos de YouTube, que en este video están muy dañados, y fueron normalizadas corrigiendo los términos técnicos deformados. **Son paráfrasis fiel, no transcripción literal verificada contra el audio.** Los timestamps del tramo 00:00-03:50 pueden tener un margen de pocos segundos; el resto está anclado a extracción directa de frames.

---

## Lo primero: esto no es una clase

La [[videografia#La fecha de subida no dice cuándo se dictó|Videografía]] sostiene, como lectura propia, que los 13 videos del canal son *"grabaciones de las clases de teoría, una tanda por cuatrimestre, no material didáctico armado aparte"*. **Para este video eso es falso**, y hay evidencia dura en contra:

- **Censo de marcas de audiencia igual a cero, en todas las categorías.** En las 4081 palabras de la transcripción no hay un solo vocativo (*"chicos"*), ni una pregunta al curso, ni un nombre de alumno, ni una mención del micrófono o del chat, ni negociación de recreo, ni *"la clase que viene"*, ni despedida. Todos los demás videos del canal con transcripción tienen marcas en varias de esas categorías a la vez, y no es un artefacto del ASR: hay videos con la transcripción igual de rota que igual dejan pasar *"ustedes"* y *"esta clase"*.
- **El propio Ramele lo llama "video", no "clase"**, dos veces, y remite a otro video como quien enlaza material: a **12:24** dice que en *el otro video* está el resultado con Euclides extendido para el caso general, y a **21:18** que *"lo único que ves es uno que está en el otro video, y que recomiendo una mirada"*. Un docente en clase no le recomienda al curso presente que mire otro video para el paso que acaba de saltear.
- **El formato lo confirma**: cámara cenital sobre hoja cuadriculada pre-escrita, sin webcam, sin UI de videoconferencia.
- **Y hay confesión directa del docente en otra grabación.** En una clase en vivo de 2025 dice que va a subir un video aparte sobre aritmética modular, distinguiéndolo explícitamente de la clase que está dando.

**Consecuencia para el vault:** la afirmación general de [[videografia#Los 13, con sus datos duros|Videografía]] hay que bajarla a *"11 son grabaciones de clase en vivo, este y el de Euclides extendido son videos complementarios producidos aparte, uno queda sin determinar"*. Y el argumento de la coincidencia entre fechas de subida y cronograma no se sostiene: este video se subió en **2018**, siete años antes de la cursada más vieja de la que hay grabación.

> **Ojo con la otra mitad de la afirmación.** Que el video no sea una clase **no toca** el hecho de que la cátedra lo encargue: ese encargo está documentado del lado de la clase, no del video. En la [[clase-02-cifrado|Clase 02]] el docente pide *"2 vídeos míos de hace muchos años, antes de la pandemia"* y dice que *"eso le va a servir para el parcial"*. **Adentro del video no hay ninguna mención a parcial ni a final.** Las dos cosas conviven: es material viejo, producido suelto, reciclado como tarea.

---

## Lo segundo: confirma la hipótesis del apunte

El apunte [[teoria-de-numeros#Los dos videos son estos|Teoría de números]] dejó anotada esta hipótesis, sin poder cerrarla: *"el PDF escaneado es, con toda probabilidad, el soporte de ese video. No está afirmado en ninguna de las dos fuentes"*.

**El video la confirma.** Lo que se filma es, sección por sección, el mismo manuscrito:

| El video muestra | El escaneo trae |
|---|---|
| Título en rojo *Quick and dirty guide to number theory* | El mismo título |
| Secciones *Divisor*, *GCD ó MCD*, *tips* | [[teoria-de-numeros#Divisor\|Hoja 1]], idénticas |
| *División Entera* recuadrada en rojo, con la leyenda al margen ($b$ dividendo, $q$ cociente, $a$ divisor, $r$ resto) | [[teoria-de-numeros#División entera\|Mismo recuadro, misma leyenda]] |
| *Ecuación diofántica lineal*, *Congruencia modular*, *Ecuación lineal de congruencia*, *Inverso modular* | Mismas secciones, mismo orden |
| Notación $(a{:}b)$, $r_m(x)$, $a \perp b$, $x \equiv y\ (m)$, incógnita con barra $\bar{x}$ | [[teoria-de-numeros#2. La notación propia del manuscrito\|La tabla de notación propia]], toda |
| La flecha que baja de $(a{:}b) = 1$ a $ax + by = 1$ | La misma flecha en los *tips* |
| La flecha que sube desde *"si $\bar{x}$ verifica"* hasta la condición $(a{:}m) = 1$ | La misma flecha en *Inverso modular* |

Y cierra por un lado más: **las erratas coinciden**. En el cuaderno filmado la división entera está enunciada como $\exists\, a, b \in \mathbb{N}$ igual que en el escaneo, y el video la desmiente en acción resolviendo $r_7(-15)$ diez minutos después. La [[teoria-de-numeros#División entera|errata que el apunte había marcado como corrección nuestra]] queda confirmada como errata del original, no como error de lectura del escaneo.

> **La diferencia que sí hay: la paginación.** El escaneo tiene **2 hojas**; el video muestra **3 páginas pre-escritas** en lapicera azul, porque parte la hoja 1 del PDF en dos (divisor y mcd por un lado, división entera y diofántica por otro). El contenido y el orden son los mismos; el soporte físico no es literalmente el mismo par de hojas, o el escaneo reacomodó. ***(Lectura nuestra.)*** El video nunca muestra el PDF: muestra un cuaderno.

**Y hay un desliz que el video ayuda a resolver.** El apunte marcó como *corrección nuestra* que la segunda cláusula del mcd, escrita $\exists\, k$, debería ser $\forall k$. Acá se ve por qué: **Ramele la escribe con $\exists$ pero la lee en voz alta como *"todo $k$ que divida a los dos tiene que dividir a $d$"***. La corrección del vault era la correcta, y ahora tiene respaldo del propio autor.

---

## Recorrido

| Tramo | Tema | Qué hay ahí |
|---|---|---|
| 00:00-00:44 | Presentación | Se presenta como *"guía quick and dirty"* y como *"una pequeña torre de tres o cuatro conceptos"* que el alumno ya vio pero no tiene frescos |
| 00:44-01:31 | Divisor | $a \mid b$ definido por multiplicación, más los dos casos borde: el $1$ divide a todo, todo divide al $0$ |
| 01:31-02:29 | MCD y la notación $(a{:}b)$ | Las dos cláusulas de la definición, leídas como relación de orden entre los divisores comunes |
| 02:29-03:50 | Coprimos y Bézout | Qué es un primo, $a \perp b \iff (a{:}b) = 1$, el tip $(a{:}0) = \lvert a \rvert$, y la flecha que baja a $ax + by = 1$ |
| 03:50-05:00 | División entera | El recuadro rojo $b = qa + r$ con $0 \le r < a$. **Acá pone el énfasis: el resto no puede ser negativo** |
| 05:00-05:50 | Operador resto | Define $r_m(x)$ y anticipa que la trampa aparece con negativos y *"pasa medio desapercibida"* |
| 05:50-07:45 | **Ejemplo resuelto**: $r_7(-15)$ | El intento fallido tachado con una cruz y el ajuste correcto. Ver [[#El tramo que más rinde: restos con dividendo negativo\|abajo]] |
| 07:45-10:40 | **Ejemplos resueltos**: truco de calculadora | $105 \bmod 25$ y $-105 \bmod 25$ con una Casio fx-991 en la mano |
| 10:40-12:41 | Ecuación diofántica lineal | Criterio $(a{:}b) \mid c$, infinitas soluciones, y la remisión al otro video |
| 12:41-13:56 | Congruencia modular y $\mathbb{Z}_m$ | La cadena de equivalencias completa |
| 13:56-15:35 | Demostración de $m \mid (x-y)$ | Escrita a mano en una hoja aparte. **Esto el manuscrito no lo trae** |
| 15:35-16:02 | **La cadena de reducciones** | La idea vertebral del video, enunciada en una frase |
| 16:02-19:07 | Ecuación lineal de congruencia | La reducción a diofántica desarrollada renglón por renglón, con la condición de existencia y la forma general |
| 19:07-21:30 | Inverso modular | Existencia $\iff$ coprimalidad, el abuso de notación $1/a$, y por qué hay claves que no sirven para cifrar |
| 21:30-26:25 | **Ejemplo resuelto**: $3^{-1} \bmod 5$ | Euclides extendido tabular, fila por fila. Ver [[#La corrida de Euclides extendido, con una convención distinta a la del vault\|abajo]] |
| 26:25-27:40 | **Ejemplo resuelto**: tabla de inversos módulo 5 | Las cuatro filas, con la verificación del $4$ al costado |
| 27:40-31:58 | **Ejemplo resuelto**: cifrado multiplicativo | CEDA cifra a EDBA con $k=2$ y vuelve a CEDA con $k^{-1}=3$ |

**Lectura del recorrido:** más de la mitad del video (17 de 32 minutos) son ejemplos numéricos resueltos a mano. Eso es exactamente lo que le falta al manuscrito, y es la razón por la que conviene mirarlo.

---

## La torre, y la cadena que la sostiene

El docente lo estructura como *"una pequeña torre"* donde cada piso apoya en el anterior, y a **15:35** enuncia la cadena que es la idea central de todo el video:

$$\underbrace{a\bar{x} \equiv b\ (m)}_{\text{congruencia modular}}
\;\longrightarrow\;
\underbrace{a\bar{x} - km = b}_{\text{diofántica lineal}}
\;\longrightarrow\;
\underbrace{\textsf{Euclides extendido}}_{\text{el que la resuelve}}$$

> [!quote]- Del video — la cadena de reducciones (15:35)
> "Para resolver las congruencias modulares se necesita llevarlo a una ecuación diofántica lineal, y para resolver la ecuación diofántica lineal se usa el algoritmo de [Euclides] extendido."

Y antes, a **12:31**, la versión corta del mismo punto, que es la única frase del video marcada con un *"esto es muy importante"*:

> [!quote]- Del video — por qué la diofántica es el centro (12:31)
> "Esto es muy importante porque cualquiera de los otros problemas que se encuentran, sobre todo en congruencias modulares, son en realidad la solución de una ecuación diofántica lineal."

Esto es **la misma síntesis** que el apunte del vault arma en [[teoria-de-numeros#5. El hilo que une las dos hojas|El hilo que une las dos hojas]] — con una diferencia que vale la pena registrar: **ahí está marcado como *síntesis nuestra*, porque el manuscrito nunca dibuja la cadena.** El video sí la dibuja, y en voz alta. La lectura del vault queda respaldada por la fuente.

La teoría de cada piso ya está desarrollada en el vault y **no se duplica acá**: [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]], [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]], [[inverso-modular|Inverso modular]].

---

## Qué agrega el video sobre el manuscrito

El apunte tiene una sección entera, [[teoria-de-numeros#6. Lo que el manuscrito NO trae|Lo que el manuscrito NO trae]], con la columna derecha llena de *"video"* y la advertencia de que **nadie lo había mirado**. Acá está el saldo real:

| Hueco declarado en el apunte | ¿Lo cubre este video? |
|---|---|
| **Un solo ejemplo numérico** — el escaneo no trae ningún número | **Sí, y es lo mejor que tiene.** Seis ejemplos resueltos de punta a punta |
| **Euclides extendido**: cómo obtener los $x, y$ de Bézout | **Parcialmente.** Corre la tabla completa para $3^{-1} \bmod 5$, pero **no justifica de dónde salen las filas** — dice literalmente *"fíjense después dónde sale esto"* y remite al otro video |
| **El algoritmo de Euclides** (cómo se calcula el mcd) | **No.** Nunca hace una cadena de divisiones sucesivas |
| **Cómo se despeja $x_0$** en la congruencia lineal | **Sí**, para el caso $b = 1$: sale de la fila anterior al resto cero |
| **Números primos y factorización** | **Apenas.** Define primo al pasar en 02:29 y no vuelve |
| **Para qué sirve** — el manuscrito no menciona criptografía ni una vez | **Sí.** Los últimos cuatro minutos son un criptosistema funcionando |

**Y agrega dos cosas que el apunte no tenía en su lista de huecos:**

1. **La demostración de que $x \equiv y\ (m) \Rightarrow m \mid (x-y)$**, escrita a mano en 14:40. El manuscrito enuncia la equivalencia y no la prueba:
   $$\begin{aligned}
   x &= q_1 m + r_m(x) \\
   y &= q_2 m + r_m(y) \\[2pt]
   \hline \\[-8pt]
   (x-y) &= (q_1-q_2)\,m + \underbrace{\big(r_m(x) - r_m(y)\big)}_{=\;0\ \text{por hipótesis}}
   \end{aligned}$$
   El paréntesis de los restos lo encierra y lo anula, porque por hipótesis los restos son iguales. Queda $(x-y)$ como múltiplo de $m$.
2. **El manejo del resto con dividendo negativo**, al que le dedica cinco minutos y dos ejemplos. El manuscrito no lo toca, y [[aritmetica-modular-y-divisibilidad#4. El algoritmo de la división|02.13]] sólo lo cubre por dentro de la demostración de existencia. Es la contribución operativa más concreta del video.

---

## El tramo que más rinde: restos con dividendo negativo

Un sexto del video (05:50-10:40) está acá. Es el único tema al que le dedica dos ejemplos completos seguidos, y es el tipo de detalle que se cobra en un parcial.

**La regla:** en $b = qa + r$ la condición $0 \le r < a$ **no se negocia**. Cuando el dividendo es negativo, el cociente "natural" da un resto negativo y hay que *pasarse un lugar*.

> [!quote]- Del video — la regla, dicha mientras tacha (06:41)
> "Esto no se puede porque el resto tiene que ser positivo."

### El resto de menos 15 sobre 7

Primer intento, con el cociente que sale solo:

$$q = -2 \;\Longrightarrow\; -15 = 7\cdot(-2) + r = -14 + r \;\Longrightarrow\; r = -1 \qquad \longrightarrow \text{no sirve}$$

Lo **tacha con una cruz en la hoja**: $-1$ no cumple $0 \le r$. Se pasa un lugar:

$$q = -3 \;\Longrightarrow\; -15 = 7\cdot(-3) + r = -21 + r \;\Longrightarrow\; r = 6 \qquad \longrightarrow \text{sirve}$$

$$\boxed{\;r_7(-15) = 6, \quad \text{con cociente } q = -3\;}$$

Verificación de la cota: $0 \le 6 < 7$.

### El truco de calculadora, con los dos signos

Con una Casio fx-991 en cuadro muestra cómo sacar el módulo en una calculadora que no tiene tecla `mod`. Dos pasos: primero el cociente por parte entera, después el resto por diferencia.

**Caso positivo, $105 \bmod 25$:**

$$q = \left\lfloor \frac{105}{25} \right\rfloor = 4 \;\Longrightarrow\; r = 105 - 25\cdot 4 = 5$$

**Caso negativo, $-105 \bmod 25$:** acá está el ajuste. El cociente redondea **alejándose del cero**, no truncando:

$$q = \left\lfloor \frac{-105}{25} \right\rfloor = \lfloor -4{,}2 \rfloor = -5 \;\Longrightarrow\; r = -105 - 25\cdot(-5) = -105 + 125 = 20$$

$$\boxed{\;-105 \bmod 25 = 20, \quad \text{con cociente } q = -5\;}$$

Verificación: $25\cdot(-5) + 20 = -125 + 20 = -105$, y $0 \le 20 < 25$.

> **Errata del cuaderno.** En el caso positivo escribe la fórmula del resto como $r = 25\cdot q - 105$, que da $-5$ — y la calculadora en pantalla efectivamente muestra $-5$. Toma el valor absoluto sin explicitarlo, comentando que *"no importa el signo, la idea es que este es el escenario positivo"*. **El resultado ($5$) es correcto; la fórmula escrita tal cual, no.** El orden correcto es dividendo menos $25\cdot q$.

> **Errata del cuaderno.** En el caso negativo escribe el cociente con **corchetes de techo**, $\lceil -105/25 \rceil$, y le asigna $-5$. El techo de $-4{,}2$ es $-4$, no $-5$: lo que necesita es el **piso**. Está usando la notación de techo para significar *"redondear alejándose del cero"*. **El resultado ($q = -5$, $r = 20$) es correcto; la notación, no.** No copiar esa línea tal cual.

---

## La corrida de Euclides extendido, con una convención distinta a la del vault

En 21:30-26:25 calcula $3^{-1} \bmod 5$. Primero chequea la condición de existencia —$(3{:}5) = 1$, así que existe— y arma la diofántica:

$$3\bar{x} \equiv 1\ (5) \;\longrightarrow\; 3x - 5k = 1$$

Después dibuja una grilla con columnas $r$, $x$, $y$ y una columna $q$ separada por una línea vertical, y va escribiendo al costado la identidad de cada fila. **El invariante es $r = 3x + (-5)y$**, y la recurrencia es *fila anterior menos $q$ por la fila siguiente*:

| $q$ | $r$ | $x$ | $y$ | Identidad escrita al costado |
|---|---|---|---|---|
| — | $-5$ | $0$ | $1$ | $-5 = 3\cdot 0 + (-5)\cdot 1$ |
| — | $3$ | $1$ | $0$ | $3 = 3\cdot 1 + (-5)\cdot 0$ |
| $-2$ | $\mathbf{1}$ | $\mathbf{2}$ | $1$ | $1 = 3\cdot 2 + (-5)\cdot 1 = 6 - 5$ |
| $3$ | $0$ | — | — | fila de corte |

El $q = -2$ sale de dividir $-5$ por $3$ (piso de $-1{,}67$), y la fila nueva es $(-5,0,1) - (-2)\cdot(3,1,0) = (1,2,1)$. La fila siguiente da resto $0$ y ahí corta: **la fila que importa es la anterior al resto cero**. Encierra $x_0 = 2$ en un óvalo y concluye:

$$\boxed{\;2 \equiv 3^{-1}\ (5)\;}$$

Aclara que las soluciones válidas son las que caen entre $0$ y $4$. Verificación directa: $3 \cdot 2 = 6 \equiv 1\ (5)$.

> **Los coeficientes de la fila de corte no se leen en los frames**; el video sólo registra que el resto da $0$ y corta. Calculados a mano darían $(0, -5, -3)$, que es lo que predice el [[algoritmo-de-euclides-extendido#6.3 La misma corrida en tabla|chequeo gratis del último renglón]] del vault. ***(Lectura nuestra: el video no los escribe.)***

### La diferencia con la tabla del vault, que conviene no mezclar

La nota [[algoritmo-de-euclides-extendido#5. La versión extendida|02.14]] usa columnas $(r_i, s_i, t_i)$ sembradas con $(a, 1, 0)$ y $(b, 0, 1)$, con los **dos números positivos**. El video siembra con el **módulo en negativo arriba**, $(-5, 0, 1)$, y el coeficiente que arrastra en la columna $x$ es el de $3$, no el de $5$.

**Por qué lo hace así:** porque corre la tabla directamente sobre la diofántica $3x - 5k = 1$, con el signo ya incorporado. El resultado sale con el signo correcto de una y **no hay que reducir módulo $m$ al final**, que es el paso donde el vault avisa que *"el coeficiente sale negativo casi siempre"*. Es una convención más cómoda para el caso puntual del inverso, y una más frágil si lo que se pide es Bézout general. ***(Lectura nuestra: el video no compara convenciones ni justifica la elección.)***

**Las dos dan lo mismo.** Si en la ambigüedad de un parcial surge la duda, conviene usar la del vault, que es la que está desarrollada con demostración y con el invariante explícito.

---

## La tabla de inversos módulo 5

En 26:25-27:40 arma a mano la tabla completa, comentando que estas tablas se usan mucho en cripto:

| $a$ | $a^{-1} \bmod 5$ | Verificación |
|---|---|---|
| $1$ | $1$ | $1 \cdot 1 = 1$ |
| $2$ | $3$ | $2 \cdot 3 = 6 \equiv 1$ |
| $3$ | $2$ | el que acaba de calcular; el del $2$ sale por simetría |
| $4$ | $4$ | $4 \cdot 4 = 16$, y $16 - 15 = 1$ |

El caso del $4$ lo justifica al costado escribiendo $4\bar{x} \equiv 1\ (5)$: es autoinverso, y no hay otra opción. El $0$ queda afuera, como corresponde.

**Lo que hay que ver acá y el video no dice:** los cuatro elementos no nulos son inversibles porque **$5$ es primo**, y por eso $\mathbb{Z}_5$ es un cuerpo. Contrastar con la [[inverso-modular#1. Definición|tabla de Z₃₂]] del vault, donde sólo la mitad de los elementos tiene inverso. El desarrollo está en [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]].

---

## El cifrado multiplicativo de juguete

Los últimos cuatro minutos son un criptosistema completo, cifrando y descifrando. Alfabeto de cinco letras mapeado a $\mathbb{Z}_5$:

$$\texttt{A} \to 0, \quad \texttt{B} \to 1, \quad \texttt{C} \to 2, \quad \texttt{D} \to 3, \quad \texttt{E} \to 4$$

Clave $k = 2$, que es coprima con $5$ y por lo tanto inversible. Las dos operaciones:

$$\mathsf{Enc}: \; C = M \cdot k \ (5) \qquad\qquad \mathsf{Dec}: \; M = C \cdot k^{-1} \ (5)$$

**Cifrado de CEDA** $= (2, 4, 3, 0)$ con $k = 2$:

| Símbolo | $M$ | $M \cdot 2$ | $\bmod 5$ | Cifrado |
|---|---|---|---|---|
| C | $2$ | $4$ | $4$ | E |
| E | $4$ | $8$ | $3$ | D |
| D | $3$ | $6$ | $1$ | B |
| A | $0$ | $0$ | $0$ | A |

$$\texttt{CEDA} \;\longrightarrow\; (4, 3, 1, 0) \;=\; \boxed{\texttt{EDBA}}$$

**Descifrado** con $k^{-1} = 3$, sacado de la tabla de arriba:

| Símbolo | $C$ | $C \cdot 3$ | $\bmod 5$ | Descifrado |
|---|---|---|---|---|
| E | $4$ | $12$ | $2$ | C |
| D | $3$ | $9$ | $4$ | E |
| B | $1$ | $3$ | $3$ | D |
| A | $0$ | $0$ | $0$ | A |

$$\texttt{EDBA} \;\longrightarrow\; (2, 4, 3, 0) \;=\; \boxed{\texttt{CEDA}}$$

> [!quote]- Del video — para qué era todo esto (31:46)
> "Muestra un poco cómo se puede utilizar la congruencia modular y el cálculo de las inversas como las claves para implementar un esquema de [cifrado] simétrico eligiendo una clave."

**Esto es, en chiquito, el [[guia-02-resolucion|Ej. 7 de la Guía 2]].** Ahí la primitiva es $E(K,M) = (M \cdot K) \bmod 32$ y para escribir `Dec` hay que calcular $7^{-1} \bmod 32 = 23$. **Es el mismo esquema con otro módulo y otra clave**, y el video lo resuelve entero en cuatro minutos. Si el ejercicio de la guía no te cierra, este tramo es el camino más corto.

Y es la razón por la que a **20:53** dice lo único que en todo el video se acerca a marcar contenido evaluable:

> [!quote]- Del video — claves que no sirven (20:53)
> "Algunas combinaciones de estas operaciones para implementar un algoritmo de [cifrado] no son reversibles porque no van a tener inverso."

Con el comentario, al lado, de que *"es muy importante y aparecen algunos ejercicios"*. **Es la única mención directa a ejercicios de la materia en los 32 minutos.** El desarrollo de por qué la invertibilidad de la clave es corrección y no seguridad está en [[inverso-modular#9. Checklist para el parcial|Inverso modular]] y en [[criptosistema|Criptosistema]].

---

## Lo que el video NO trae: el salto a RSA no está

La [[videografia#Los 13, con sus datos duros|Videografía]] mapea este video como *"base de la Clase 4, 10/09"*, la de criptografía asimétrica. **Eso hay que precisarlo, porque tal como está escrito promete de más.**

El video **no menciona**, ni una vez: RSA, criptografía asimétrica, clave pública, Euler, Fermat, la función $\varphi(n)$, exponenciación modular rápida, ni el Teorema Chino del Resto.

Lo que sí entrega es la **aritmética previa**: divisibilidad, mcd, coprimalidad, división entera con restos no negativos, diofántica lineal, congruencia modular, congruencia lineal e inverso modular. De esa lista, **la pieza que RSA necesita directamente es el inverso modular** —es cómo se obtiene $d$ a partir de $e$— y está bien cubierta: condición de existencia, método de cálculo y ejemplo numérico completo.

Pero el video termina en un cifrado multiplicativo **simétrico** de juguete sobre cinco letras. **Es la base aritmética, no la construcción del criptosistema.** El salto a RSA queda entero en la Clase 4, y este video no lo cubre ni lo anticipa.

**El puente que sí falta del lado del vault:** el [[inverso-modular#8. Adelanto: esto es la generación de claves de RSA|adelanto de RSA]] de la nota de inverso modular y el [[cuerpos-finitos-y-campos-de-galois|cierre]] de cuerpos finitos son, hoy, lo más cerca de RSA que llega la wiki. El hueco sigue abierto.

---

## Aporte de notación para el vault

Dos convenciones de la cátedra quedan **definidas formalmente acá**, dichas y escritas por el docente, y conviene fijarlas por si aparecen en un enunciado de parcial:

- **$(a{:}b)$ para el máximo común divisor.** El video introduce las tres notaciones —$\gcd$, $\operatorname{mcd}$, dos puntos— y después usa **siempre** la de los dos puntos, en los 32 minutos.
- **El módulo como subíndice entre paréntesis**, $x \equiv y\ (m)$, sin el `mod`.

Las dos ya estaban registradas en la [[teoria-de-numeros#2. La notación propia del manuscrito|tabla de notación del apunte]], pero ahí salían de leer el escaneo. Ahora tienen respaldo hablado.

---

## Cómo mirarlo

- **Si se llega sin ningún antecedente del tema:** de corrido, los 32 minutos. Es autocontenido, no supone nada de la materia, y está pensado exactamente para eso.
- **Si ya se leyó el [[teoria-de-numeros|apunte]] y las notas de concepto:** conviene saltar a **05:50** y mirar hasta **10:40** (restos negativos, que no están en el vault) y de **21:30** al final (los tres ejemplos numéricos encadenados). El resto son las mismas definiciones que ya están desarrolladas con más profundidad en `conceptos/`.
- **Si lo que se busca es Euclides extendido justificado:** este no es el video. Es el otro de la pareja, [Algoritmo Euclides Extendido](https://www.youtube.com/watch?v=KgnrX6I_Nd4), al que Ramele remite dos veces y recomienda explícitamente. Acá el algoritmo se **usa**, no se explica.
- **Tramo prescindible:** no hay digresiones. El video es corto, denso y no tiene relleno. Lo único repetido es el truco de calculadora, que ocupa tres minutos para un procedimiento de dos líneas.

**Lo que hay que retener si solo se retiene una cosa:** la cadena congruencia modular $\to$ diofántica lineal $\to$ Euclides extendido. Es lo que el docente marca a 15:35 y lo que después se cobra en el Ej. 7 de la Guía 2.

---

## Ver también

- [[teoria-de-numeros|Teoría de números]] — el manuscrito que este video narra página por página; la nota que queda **actualizada** por esta (la hipótesis de la §1 se confirma, y el pendiente *"mirar los dos videos"* se cierra para uno de los dos)
- [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] — divisor, mcd, división entera y $\mathbb{Z}_m$ con demostraciones; el video es la versión narrada y con números de esta nota
- [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]] — el procedimiento que el video **usa sin justificar**, con la convención tabular del vault y el invariante demostrado
- [[inverso-modular|Inverso modular]] — existencia, unicidad y cálculo; incluye la tabla de $\mathbb{Z}_{32}$ que contrasta con la de $\mathbb{Z}_5$ del video
- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] — por qué en $\mathbb{Z}_5$ todos los no nulos tienen inverso y en $\mathbb{Z}_{32}$ no
- [[guia-02-resolucion|Guía 2 — Resolución]] — el **Ej. 7** es el cifrado multiplicativo del video con módulo $32$ en lugar de $5$
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] — la clase que encarga este video como tarea, atado al parcial
- [[videografia|Videografía]] — el mapeo de los 13 videos del canal; esta nota **corrige** su lectura de que todos sean grabaciones de clase
- [[criptosistema|Criptosistema]] — la condición de corrección que obliga a que la clave sea inversible
- [[cifrado-por-rotacion|Cifrado por rotación]] — el criptosistema que ya vive en $\mathbb{Z}_n$ pero con suma, donde el inverso es trivial y no hace falta nada de esto
