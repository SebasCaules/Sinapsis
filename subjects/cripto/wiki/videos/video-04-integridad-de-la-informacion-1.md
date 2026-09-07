---
title: Video 04 — Integridad de la información (1)
resumen: 'Grabación de clase de Rodrigo Ramele en 2025 sobre las filminas 1 a 22 del deck de la Clase 03 —CPA, CCA, maleabilidad, MAC y CBC-MAC—, que saltea la filmina 17 y agrega el caso Midway.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[videografia]]", "[[video-05-integridad-de-la-informacion-2]]"]
aliases: ["Video 04", "Integridad de la Información #1", "Integridad #1", "Ramele — MACs y CBC-MAC", "Video de la Clase 3"]
type: video
clase: 3
orden: 40
video: 04
youtube: xLuj2bDU6J4
created: 2026-09-03
updated: 2026-09-03
tags: [video, clase-03, integridad, cpa, cca, maleabilidad, mac, mac-forge, cbc-mac, hash, ramele, transcripcion]
sources: ["https://www.youtube.com/watch?v=xLuj2bDU6J4"]
---

# Video 04 — Integridad de la información (1)

> **1:10:38** · subido el **27/03/2025**, jueves · **oculto** en YouTube (no listado: se llega sólo por link) · docente **Rodrigo Ramele** · descripción del propio autor: *"CPA y CCA | Message Authentication Codes"* · [Ver en YouTube](https://www.youtube.com/watch?v=xLuj2bDU6J4)
> **Mapea a:** [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]], primera sesión (**MAC y cifrado autenticado (1)**, 27/08 en el [[cronograma]]) · deck: [Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf](../../raw/clases/Clase%2003%20-%20Criptografia%20-%20MACs%20y%20Cifrado%20Autenticado.pdf), 41 filminas
> **Continúa en:** [[video-05-integridad-de-la-informacion-2|Video 05 — Integridad de la información (2)]] — los dos se subieron el mismo día y son **una sola jornada partida en dos archivos**: éste termina negociando el recreo y el siguiente arranca inmediatamente después.
> **Es una grabación de clase en vivo de la cursada 1C-2025**, no material producido aparte: hay alumnos con nombre respondiendo (**Félix** 29:26, **Cristian** 17:34, **Nicolás** 24:22 y 49:23, **Mauro** 05:27 y 1:10:02) y el cierre es una negociación de la hora del recreo con el curso.

**Para qué sirve:** para escuchar a **otro docente explicando el mismo deck que dio Abad el 27/08** —con dos bloques que Abad no dio: el caso Midway y la digresión sobre generación de aleatoriedad—, y para tener una **segunda** explicación en voz de la filmina 22 de hash, que Abad también dio el 03/09. **Para qué no sirve:** para enterarte del tema por primera vez, porque la [[clase-03-macs-y-cifrado-autenticado|nota de clase]] ya tiene todo el contenido formal desarrollado con más detalle que acá, y porque **este video se saltea la filmina 17** —el ejercicio de los tres MACs candidatos, que Abad sí resolvió entero—.

---

## Lo que este video corrige de la wiki

Hasta que se lo miró, la wiki **infería** —y lo decía como inferencia— que este video cubría **las filminas 1 a 21** y que el #2 arrancaba en la 22. **Las dos puntas de esa inferencia estaban mal**, y ése es el aporte principal de esta nota. La corrección ya está absorbida en la [[videografia#Qué cubre y qué no|Videografía]] y en los [[clase-03-macs-y-cifrado-autenticado#Cabos sueltos|cabos sueltos de la Clase 03]]; acá va el detalle:

| La wiki decía | Lo verificado |
|---|---|
| Cubre las filminas **1-21** | Recorre las filminas **1 a 22** |
| Las cubre **todas** | **Saltea la 17** por completo — pasa de la 16 (52:35) a la 18 (52:55) |
| Termina antes de hash; hash empieza en el #2 | **Termina con la 22 (funciones de hash) en pantalla los últimos 5 min 33 s**, desde 1:05:05. El pasaje a los esquemas **sin clave** ocurre dentro de este video |
| El #2 arranca donde éste termina | El #2 **arranca en la misma filmina 22**: la explica dos veces, una por video |

El conteo de "21 filminas" que cerraba tan bien era una casualidad aritmética: son las páginas **1-16 y 18-22**, o sea 22 alcanzadas menos una salteada.

> **La filmina 17 no la da ninguno de los dos videos.** Es la única página del deck de 41 que no aparece en pantalla en las dos horas de grabación. Verificado con sweep continuo de 46:00 a 57:00 y con `grep` de `first_k_bits` y *"seguridad de los siguientes"* sobre las transcripciones completas de los dos videos: cero coincidencias. Esa filmina está en [[clase-03-macs-y-cifrado-autenticado#9. Ejercicio: tres MACs candidatos|Clase 03 § 9. Ejercicio: tres MACs candidatos]], donde Abad la desarrolló entera con los alumnos.

Y un dato de encuadre que también corrige a la wiki: **la Clase 3 de la cursada 2026 la dio Pablo Abad, no Ramele.** Este video es la versión de Ramele del mismo tema, de otro cuatrimestre y con otro grupo. Los dos usan el mismo PDF.

---

## Recorrido

Los timestamps de la columna izquierda son de **cambio de filmina**, verificados uno por uno; los de las secciones de abajo son del audio.

| Desde | Filmina | Tramo | Qué hay | Vale la pena |
|---|---|---|---|---|
| 00:00 | 1 | Portada y encuadre de la materia | La materia son dos materias pegadas; el objetivo es la intuición de seguridad; el método de Katz | Poco: es discurso de apertura, sin contenido de examen |
| 05:09 | 2 | Criptosistema (repaso) y Kerckhoffs | La terna, la propiedad de cierre, Kerckhoffs preguntado a la clase | Poco: está todo en [[criptosistema\|01.01]] y [[principio-de-kerckhoffs\|01.02]]. Sí aporta el contrapunto militar |
| 07:07 | — | **Escritorio y Google Slides** | Sube el deck al campus. No hay contenido | Saltear. Vuelve a la filmina 2 a las 08:34 |
| 12:01 | 3 | Ataques de texto plano escogido (CPA) | El experimento en 5 pasos y el corolario probabilístico | Sí, por el corolario. La filmina 3 queda en pantalla **16 minutos**, hasta 27:57 |
| — | 3 | *Midway* (18:20-22:10) | Caso histórico como CPA de la vida real | **Sí. No está en la clase de Abad** |
| — | 3 | *Aleatoriedad* (22:10-27:55) | TRNG contra PRNG, el PID de Unix como semilla | Sí, si se viene flojo de [[generador-pseudoaleatorio\|02.04]]; si no, es digresión |
| 27:57 | 4 | Criptosistemas CPA-Secure | Flujo con IV, bloque con encadenamiento. **El IV es público** | Sí, por el "grabarse a fuego" del IV |
| 31:21 | 5 | Un nuevo tipo de ataque | La tabla de sueldos cifrados | Sí — es el giro de la clase |
| 32:43 | 6 | ¡Aumento de sueldo! | El empleado copia el criptograma del jefe | Sí |
| 36:33 | 7 | Cifrar empleado y sueldo juntos | La defensa que no alcanza | Sí |
| 37:05 | 8 | Modificaciones quirúrgicas | Maleabilidad, con el globo `Malleability` | Sí |
| 38:13 | 9 | Backstage: formato del campo | IV de 12 bytes, empl 4, sueldo 4 | Sí |
| 38:52 | 10 | Backstage: la aritmética XOR | El avance iterativo bit a bit — **tiene una errata, abajo** | Sí |
| 39:25 | 11 | Ataques de texto cifrado escogido | La definición de `CCA` en 5 pasos | **Sí: es el único tramo marcado como de examen** |
| 43:00 | 12 | Ningún criptosistema visto es CCA-Secure | El ejercicio del cifrado de flujo. **Lo deja planteado, no lo resuelve** | Medio: Abad sí lo resolvió |
| 44:13 | 13 | Requiere control de integridad | Las dos familias: con clave y sin clave | Sí, es corto |
| 45:13 | 14 | Message Authentication Code | La terna Gen/Mac/Vrfy y la simetría del MAC | Sí |
| 46:57 | 15 | Seguridad de un MAC | El experimento `Mac-forge` | Sí |
| 49:55 | 14 | *(vuelve 10 s)* | Responde una pregunta de Nicolás sobre el par $(m,t)$ | — |
| 50:05 | 15 | Seguridad de un MAC | Sigue | — |
| 52:35 | 16 | Observaciones | Roto = falsifica cualquier mensaje, tenga sentido o no | Sí, son 20 segundos |
| 52:55 | **18** | Cómo construir un MAC | CBC-MAC para longitud fija. **Salteó la 17** | Sí |
| 55:10 | 14 | *(vuelve 5 s)* | — | — |
| 55:15 | 18 | Cómo construir un MAC | Sigue | — |
| 56:30 | 19 | CBC-MAC | El ataque de longitud variable | Sí |
| 58:49 | 20 | Extensiones seguras | Las tres alternativas para longitud arbitraria | Sí |
| 1:02:08 | 21 | La longitud como sufijo NO es segura | El algoritmo atacante con tres bloques | Sí |
| **1:05:05** | **22** | **Funciones de hash criptográficas** | La discute más de palabra que de filmina. Hasta el final | Medio: es motivación, no teoría |
| 1:09:43 | 22 | Corte | Negocia el recreo con el curso | — |

---

## 1. Los primeros doce minutos: encuadre y repaso

Casi la mitad del video es repaso y contexto antes de llegar a material nuevo. Del minuto 0 al 12 no hay nada que no esté en el vault, con dos matices que sí vale registrar.

**El método de la materia** (04:00). Ramele explica por qué la teoría avanza como avanza: no se define "seguro" de una vez, se le va dando poder al atacante por etapas y se mira qué aguanta. Es exactamente el arco `Eav` → `Mul` → `CPA` → `CCA` de [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]], pero dicho como programa de trabajo antes de empezar.

> [!quote]- Del video — el método de Katz, y para qué sirve (02:03 y 04:00)
> *"para ser bueno en seguridad informática hay que ser un poquito paranoico"*
>
> *"yo le voy dando… primero considero el atacante lo más simple que puede ser, y a medida que van pasando los estadíos yo le voy dando más y más y más poder al atacante, y en base a eso voy entendiendo mi sistema"*

**El contrapunto militar a Kerckhoffs** (08:47-12:00). Éste sí es aporte del video: la filmina dice lo de siempre —todo público salvo la clave—, y Ramele agrega que en ámbitos militares igual se ocultan los algoritmos, **y que eso no contradice a Kerckhoffs**. La distinción que hace es entre *sumar una capa* y *apoyar la seguridad en esa capa*: ocultar el algoritmo es legítimo como capa extra (usa la metáfora de la cebolla y de Minas Tirith), lo equivocado es poner ahí el trust. Analogía con la ofuscación de código.

> [!quote]- Del video — dónde está el error de la seguridad por oscuridad (09:59)
> *"lo que es equivocado es que vos pongas el foco de la seguridad, es decir, pongas tu trust en el sistema, en que el algoritmo solo lo conocés vos"*

→ [[principio-de-kerckhoffs|Principio de Kerckhoffs]] · [[criptosistema|Criptosistema]]

**La interrupción de 07:07 a 08:34** no tiene contenido: un alumno le pide la presentación, se sale del modo presentación y se ve el escritorio con Chrome, una pestaña de Excalidraw en blanco y la ventana de edición de Google Slides del archivo *"Clase 03 - Criptografía - MACs y Cifrado Autenticado"* mientras la sube al campus. Comenta al pasar que le desaconsejaron publicar el deck de antemano, porque sorprender con la filmina hace que presten más atención. **El Excalidraw queda en blanco: en todo el video no dibuja nada.** Todo el contenido está en las filminas y en la voz.

---

## 2. CPA: el experimento y el corolario probabilístico

**12:01-18:20.** La filmina 3 es la misma que la [[clase-03-macs-y-cifrado-autenticado#1. Repaso: el criptosistema y las pruebas de la Clase 02|nota de clase]] desarrolla en 5 pasos, y queda en pantalla **dieciséis minutos** —todo Midway y toda la digresión de aleatoriedad pasan con esta filmina de fondo—.

Lo que el video agrega por encima de la nota de clase es de dónde sale la palabra **oráculo**: de teoría de la computabilidad, y el punto es que el adversario **no necesita conocer los internos de la máquina, sólo tener acceso a ella**.

El corolario lo saca de la clase preguntando: Cristian contesta la solución trivial —cifrar $m_0$ y $m_1$ en el oráculo y comparar contra $c$— y de ahí sale la exigencia.

$$\text{Si } \mathsf{Enc}_k \text{ es determinística, } A \text{ compara } \mathsf{Enc}_k(m_0) \text{ con } c \Rightarrow \text{gana siempre}$$

> [!quote]- Del video — el corolario que le importa (17:49)
> *"que no es seguro si $f$ es determinística. Necesito que de alguna manera esa función sea probabilística"*

Es el mismo resultado que sostiene el [[cifrado-probabilistico-nonce-e-iv|cifrado probabilístico]], dicho como consecuencia forzada del experimento y no como definición previa.

→ [[modelos-de-ataque|Modelos de ataque]] · [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]]

---

## 3. Midway: un CPA de la vida real

**18:20-22:10.** Este bloque **no existe en la clase de Abad** y es probablemente la razón más fuerte para mirar el video.

El caso: en 1942 los estadounidenses sospechaban que el próximo objetivo japonés era Midway, pero querían certeza para jugar la flota. Ya podían leer el tráfico japonés —habían roto el sistema porque la embajada japonesa en Alemania usaba el mismo cifrado para reportar a Tokio—, así que **mandaron por radio desde Midway un mensaje falso diciendo que se habían quedado sin agua**. Cuando interceptaron el reporte japonés cifrado con esa novedad, vieron cómo se cifraba la palabra "Midway" y confirmaron el plan de ataque.

Puesto en el vocabulario del experimento: **eligieron el texto plano y accedieron al oráculo de cifrado haciéndoselo usar al enemigo**. Es un `CPA` completo, sin computadoras.

> **Cabos del relato.** Cita un libro llamado *"Magic"* sobre el criptoanálisis estadounidense contra Japón; **no está verificado el título ni el autor**, queda como lo dijo. Y se enreda con los presidentes —dice *"Howuer"*, *"Roosevelt"*, *"primero vino Roosevelt y después murió Roosevelt y viene otro presidente"*—; el otro presidente es Truman, pero **él no lo nombra**, así que no se lo atribuye. También arranca diciendo "Pearl Harbor" y se autocorrige a Midway.

---

## 4. La digresión sobre aleatoriedad

**22:10-27:55.** Tampoco está en la clase de Abad. Sale de una pregunta suya: ¿cómo hace una computadora determinística para producir algo no determinístico? Mauro contesta que no puede, y Ramele lo valida: **no puede sola**. Quedan dos caminos.

| Vía | Qué es | Comentario del video |
|---|---|---|
| Aleatoriedad física | Medir un proceso físico genuinamente estocástico — el ejemplo que da es decaimiento atómico | Es la única fuente "real" |
| Generador pseudoaleatorio | Recurrencias con ciclo lo más largo posible, apoyadas en teoría de números | Es lo que se usa en la práctica |

Y una mala práctica histórica que vale la pena tener anotada: **usar el PID de Unix como semilla**, que resultó predecible. Descarta también la hora del sistema como fuente.

No aporta teoría nueva por encima de [[generador-pseudoaleatorio|Generador pseudoaleatorio]] ni del apunte [[numeros-aleatorios-y-randomness|Sobre números aleatorios y randomness]], pero es la única vez en el material de la Clase 3 donde alguien explica **por qué** el `CPA` obliga a resolver el problema del azar.

---

## 5. CPA-Secure y el IV público

**27:57-31:21**, filmina 4. Las dos ramas son las mismas que la [[clase-03-macs-y-cifrado-autenticado#2. Criptosistemas CPA-Secure: con qué se instancia|nota de clase]] ya tabula: flujo con *tweaks* (el IV cambia la semilla del generador) y bloque con encadenamiento `CBC`, `Counter`, `OFB`, `CFB`.

Lo que Ramele marca con más énfasis que nadie es que **el IV es público**, y la justificación es de una línea: si fuera secreto, sería la clave — y la clave es lo único secreto. Se lo hace decir a Félix.

> [!quote]- Del video — el IV es público (29:14)
> *"Una cosa importante que tienen que grabarse a fuego, a fuego, es que el I[V] es público. Es público. ¿Por qué razón? Porque si el I[V] es secreto, ¿qué es el I[V] entonces? — La clave. — Exactamente, Félix."*
>
> *(El ASR escribe sistemáticamente "IB" donde se dice "IV".)*

→ [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] · [[modos-de-encadenamiento|Modos de encadenamiento]]

---

## 6. La base de sueldos, la maleabilidad y el backstage

**31:21-39:25**, filminas 5 a 10. Es el giro de la clase, y está desarrollado entero —tabla, formato del campo y aritmética— en [[clase-03-macs-y-cifrado-autenticado#3. Un nuevo tipo de ataque: la base de sueldos|Clase 03 § 3]] y [[clase-03-macs-y-cifrado-autenticado#4. Backstage del ataque: la aritmética del XOR|§ 4]], más la nota de concepto [[maleabilidad|Maleabilidad]]. No lo dupliquemos: **el video no agrega ningún paso técnico que la wiki no tenga.**

Lo que sí agrega son las dos moralejas, dichas con nombre propio, y un ejercicio.

**Primera moraleja: lo estúpido tira abajo lo sofisticado.** El ataque de la filmina 6 —copiar el criptograma del jefe sobre la propia fila— no rompe nada criptográfico. El atacante ni siquiera necesita saber qué algoritmo hay debajo.

> [!quote]- Del video — el ataque estúpido contra el algoritmo sofisticado (33:28)
> *"Vos podés hacer algo recontra sofisticado, un algoritmo CPA-Secure re sofisticado, y esto estúpido te tira toda la basura, porque no necesita ni saber lo que está haciendo el algoritmo"*

**Segunda moraleja: global contra local.** La formula como regla de oro y es la frase más citable del video.

> [!quote]- Del video — la regla de oro (34:46 y 35:08)
> *"la seguridad es un concepto que uno lo demanda global, pero el abordaje siempre que hace es local"*
>
> *"la seguridad es como una cadena que se rompe por el eslabón más débil"* — y vuelve a Minas Tirith: la fortaleza rodeada de defensas donde alguien conoce un pasadizo.

**El ejercicio que deja** (38:22): codear el ataque de maleabilidad sobre el esquema `empleado||sueldo`. *"Es un ejercicio interesante para hacer, lo pueden codear y sale."* La ley que hay que implementar es de una línea:

$$\mathsf{Enc}_k(m) = G(k) \oplus m = c, \qquad c' = c \oplus x \;\Longrightarrow\; \mathsf{Dec}_k(c') = m \oplus x$$

Y el formato del campo, que es lo que le dice al atacante dónde cortar: $IV \Vert \texttt{empl} \Vert \texttt{sueldo}$, con $IV$ de 12 bytes, `empl` entero de 4 y `sueldo` entero de 4.

---

## 7. CCA: el tramo marcado como de examen

**39:25-44:13**, filminas 11 y 12. Es el único tramo del video donde Ramele dice explícitamente que esto entra.

La definición está en [[clase-03-macs-y-cifrado-autenticado#5. Ataques de texto cifrado escogido: CCA|Clase 03 § 5]] y en [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]]: el `CCA` es el `CPA` más un oráculo de descifrado $g(x) = \mathsf{Dec}_k(x)$, con la restricción de que al recibir el desafío $c$ el adversario **pierde el acceso a $g(c)$** —y sólo a $g(c)$—.

**Lo que hay que saber justificar es esa restricción**, y ése es el punto que marca como pregunta típica de parcial:

> [!quote]- Del video — lo único marcado como examen (41:02)
> *"Esto es diferente del [CPA]. Esto es importante que se lo guarden, porque después estas son preguntas típicas que entran en los exámenes: porque son preguntas fáciles de agarrarlos a ustedes, pero que también llevan mucho a la cuestión conceptual de cómo va esta idea de ir dándole más poder al atacante."*
>
> *(El ASR escribe "SPA"; por contexto —está contrastando con el experimento anterior— es `CPA`.)*

La justificación que da tiene dos capas. La superficial: si tuviera $g(c)$, descifra el desafío y compara, y se acabó el juego. La que vale la pena retener:

> [!quote]- Del video — por qué el oráculo de descifrado equivale a la clave (42:05)
> *"si vos tenés el motor de desencripción, aún sin saber la clave, es como que la clave está dentro del motor de desencripción y la tenés de una manera indirecta"*

**Lo que el video NO hace:** resolver el ejercicio de la filmina 12 —demostrar que el cifrado de flujo no es `CCA`-Secure, con la ayuda $m_0 = (0\ldots0)$ y $m_1 = (1\ldots1)$—. Ramele lo deja planteado y sigue. **Abad sí lo resolvió con los alumnos**, paso a paso: está en [[clase-03-macs-y-cifrado-autenticado#El ejercicio: demostrar que el flujo no es CCA-Secure|Clase 03 § El ejercicio: demostrar que el flujo no es CCA-Secure]]. Para ese ejercicio, la versión de Abad es estrictamente mejor.

---

## 8. Hace falta integridad: las dos familias

**44:13-45:13**, filmina 13. Un minuto, y es el pivote de todo el resto de las dos horas:

| Familia | Nombre | Qué usa |
|---|---|---|
| Con clave | MAC — *message authentication code* | [[message-authentication-code\|Message Authentication Code]] |
| Sin clave | *unkeyed message authentication* | [[funciones-de-hash-criptograficas\|Funciones de hash criptográficas]] |

La consecuencia de tener clave, que subraya: **sólo puede dar y verificar integridad quien tiene la clave, y nadie más.** Arranca por los MAC y deja la familia sin clave para el final del video.

---

## 9. MAC y Mac-forge

**45:13-52:35**, filminas 14 a 16. La terna y el experimento están completos en [[message-authentication-code|Message Authentication Code]] y [[seguridad-de-un-mac|Seguridad de un MAC]].

$$\mathsf{Gen}: () \to \mathcal{K}, \quad \mathsf{Mac}: \mathcal{K} \times \mathcal{P} \to \mathcal{T}, \quad \mathsf{Vrfy}: \mathcal{K} \times \mathcal{P} \times \mathcal{T} \to \{0,1\}, \quad \mathsf{Vrfy}_k(m, \mathsf{Mac}_k(m)) = 1$$

Dos cosas que Ramele marca con énfasis y que conviene tener:

**El MAC es simétrico** (46:39). Quien etiqueta y quien verifica **comparten la misma clave**, y lo dice anticipando explícitamente que eso es lo que cambia con las firmas digitales. Es el mismo punto que la [[message-authentication-code|nota de concepto]] hace, dicho como pregunta abierta hacia adelante.

**Un solo par alcanza.** En `Mac-forge` el adversario pide todas las etiquetas que quiera —conjunto $Q$— y después tiene que emitir un par $(m,t)$ con $m \notin Q$ que verifique:

$$\mathsf{Mac\text{-}Forge}_{A,\Pi} = 1 \iff \mathsf{Vrfy}_k(m, t) = 1 \;\wedge\; m \notin Q$$

> [!quote]- Del video — el umbral de "roto" (51:26)
> *"Basta con que tenga uno solo para pasar el experimento"*

Nicolás pregunta a las 49:23 qué es exactamente el par $(m,t)$ y Ramele **vuelve diez segundos a la filmina 14** para reexplicarlo: $A$ elige el $m$ y trata de fraguarle un $t$ trucho. Es la única vez en el video que retrocede por una pregunta.

La filmina 16 (52:35, veinte segundos) cierra con la observación que define "roto": el MAC se considera roto si el adversario puede falsificar **cualquier** mensaje, tenga sentido o no. En la clase de Abad ese punto viene acompañado de [[clase-03-macs-y-cifrado-autenticado#Las observaciones y la lección de 2004|la lección de 2004]] —los ataques a `MD5` y el argumento de que "las falsificaciones no tienen sentido"—; **Ramele no cuenta esa historia.**

---

## 10. La filmina que Ramele no da

**52:35 → 52:55.** Veinte segundos, y el deck avanza de la 16 a la 18. Vale la pena aislarlo porque es lo que hace que este video **no** sustituya a la clase de Abad.

La filmina 17 es un ejercicio entero:

> **Considerar la seguridad de los siguientes MACs:** $\mathsf{Mac}_k(m) = G(k) \oplus m$ (con $G$ generador pseudoaleatorio) · $\mathsf{Mac}_k(m) = k \oplus \mathsf{first}_k(m)$ · $\mathsf{Mac}_k(m) = \mathsf{Enc}_k(\lvert m \rvert)$ (con `Enc` CPA-Secure)

Los tres son falsificables, y cada uno enseña una regla distinta —la etiqueta no puede filtrar el keystream, tiene que cubrir **todos** los bits del mensaje, y no puede depender sólo de la longitud—. La transcripción pasa directo de leer la filmina 16 (*"se considera roto el MAC si el adversario puede falsificar cualquier mensaje, independientemente de si tiene o no sentido"*, 52:43) a *"Bueno, ¿cómo puedo construir un MAC básico?"* (52:54), que ya es la 18.

**Está resuelto, con las tres respuestas y las intervenciones de los alumnos, en [[clase-03-macs-y-cifrado-autenticado#9. Ejercicio: tres MACs candidatos|Clase 03 § 9]].** Es material de la [[guia-03-mac-y-funciones-de-hash|Guía 3]] por tipo de ejercicio y no conviene saltearlo.

---

## 11. CBC-MAC, su ataque y las extensiones

**52:55-1:05:05**, filminas 18 a 21. La construcción y los dos ataques están completos en [[cbc-mac|CBC-MAC]] y en [[clase-03-macs-y-cifrado-autenticado#10. Cómo construir un MAC: CBC-MAC|Clase 03 § 10]]. Resumen de lo que se ve, con sus minutos:

**La construcción para longitud fija** (52:55). Con $F$ pseudoaleatoria:

$$m = m_1 \Vert m_2 \Vert \ldots \Vert m_j, \qquad t_0 = 00\ldots0, \qquad t_i = F_k(t_{i-1} \oplus m_i), \qquad \mathsf{Mac}_k(m) = t_j$$

La verificación es rehacer la cuenta y comparar etiquetas — y aclara que **no todo esquema verifica así**, porque la construcción es determinística sólo si la clave es la misma. Es exactamente el matiz que en la clase de Abad se vuelve importante para el tercer MAC de la filmina 17, que verifica por inversión; acá queda dicho al pasar y sin caso donde aplicarlo, porque esa filmina no la dio.

**El ataque de longitud variable** (56:30). La construcción es infalsificable **sólo si todos los mensajes son de la misma longitud**. Con dos bloques aleatorios $A$ y $B$:

$$m_1 = A \Vert B, \quad m_2 = A, \qquad t_1 = f(m_1),\; t_2 = f(m_2) \;\Longrightarrow\; \text{emitir } \bigl(A \Vert B \Vert (A \oplus t_1),\; t_2\bigr)$$

Al procesar el tercer bloque, el bucle calcula $F_k\bigl(t_1 \oplus (A \oplus t_1)\bigr) = F_k(A) = t_2$. La sutileza que Ramele subraya —y que es la clave para entender por qué el ataque es legal— es que **el mensaje emitido nunca se consultó completo al oráculo, sólo sus subpartes**:

> [!quote]- Del video — por qué el ataque cuenta (58:22)
> *"Acá este mensaje no lo consultó completo, lo hizo de cada una de las subpartes. Entonces, si él puede, generando subpartes, armar un mensaje completo y predecir exactamente cuál es el tag, lo rompe."*
>
> *(Alrededor de 58:15 el ASR da "los que vos cuereaste / queriaste", que por contexto es "los que vos consultaste al oráculo" — de* query*. La palabra real no se entiende.)*

**Las tres extensiones seguras** (58:49), filmina 20:

| Alternativa | Construcción |
|---|---|
| Derivación de clave desde la longitud | $k' = F_k(\lvert m \rvert)$, y el bucle corre con $k'$: $t_i = F_{k'}(t_{i-1} \oplus m_i)$ |
| Longitud como **prefijo** | $m' = \lvert m \rvert \Vert m$, y $\mathsf{Mac}_k(m) = \mathsf{CBC\text{-}MAC}_k(m')$ |
| Dos claves | $t' = \mathsf{CBC\text{-}MAC}_{k_1}(m)$, $t = F_{k_2}(t')$ |

Aprovecha para explicar qué es **derivación de clave**: a partir de una clave única, generar otras para usos distintos.

**Por qué el sufijo no sirve** (1:02:08), filmina 21. Si la longitud va al final, $m' = m \Vert \lvert m \rvert$, el esquema se rompe otra vez. Con bloques aleatorios $A$, $B$, $C$:

$$m_1 = AAA \to m_1' = AAA3,\quad t_1 = f(m_1) \qquad m_2 = BBB \to m_2' = BBB3,\quad t_2 = f(m_2)$$
$$m_3 = AAA3CC \to m_3' = AAA3CC6, \quad t_3 = f(m_3)$$
$$X = t_1 \oplus t_2 \oplus C \qquad\Longrightarrow\qquad \text{emitir } (BBB3XC,\; t_3)$$

La filmina da el algoritmo pero **no cierra por qué el par verifica** —es la misma [[clase-03-macs-y-cifrado-autenticado#Erratas y precisiones de las filminas|errata de incompletitud ya registrada]] para esta página—, y Ramele tampoco lo desarrolla: lo lee y saca la moraleja. El desarrollo está en [[cbc-mac#Por qué la longitud como sufijo no sirve|CBC-MAC § Por qué la longitud como sufijo no sirve]].

> [!quote]- Del video — de qué se trata todo esto (1:04:09)
> *"vos tenés que hacer algo que tiene que ser muy robusto, de forma de que se banque estos toqueteos, se banque poder toquetear bits y cambiar bits de acá y allá"*

Es el hilo que une el video entero: maleabilidad al principio, `CCA` en el medio, MAC al final. Todo es la misma pregunta.

---

## 12. Los últimos cinco minutos: funciones de hash

**1:05:05 hasta el final**, filmina 22 en pantalla **5 min 33 s**. Es el tramo que la wiki no esperaba encontrar acá.

El anuncio del cambio de familia llega **antes** del cambio de filmina: a las 1:04:43, todavía con la 21 en pantalla, dice *"ahora pasamos a los esquemas de integridad que no tienen claves"*, y a las 1:05:01 *"seguimos y pasamos a las famosas funciones de hash"*.

La filmina 22 dice lo formal —el par de algoritmos, que $s$ es un **selector y no una clave**, que en muchas implementaciones $S$ tiene un solo elemento, y que son análogas a los MAC pero sin clave—:

$$\mathsf{Gen}: s \leftarrow S, \qquad \mathsf{Hash}: h = H^s(m) \in \{0,1\}^{L}$$

**Pero Ramele no la lee.** Literalmente pide *"tapen esto, tapen 'criptográficas'"* y la discute de palabra, por el lado de la motivación, con la clase:

- ¿Para qué sirve un hash? — *"para hacer el `equals` en Java"* (contesta un alumno; el ASR escribe *"el IQ en Java"*)
- ¿Por qué? — porque funciona como un **ID del objeto** en una hash table, y agiliza determinar si dos cosas son distintas
- Repaso de hash tables, encadenamiento con listas enlazadas, el trade-off memoria contra performance, competitive programming
- El hash como **digest** o función de resumen
- ¿Por qué sirve para integridad? — *"para poder comparar después"*, contesta un alumno: el digest depende del valor, así que se lo puede recalcular y comparar

**No hay nada de resistencias, ni colisiones, ni preimágenes, ni Merkle-Damgård, ni `SHA` más allá de que alguien tira "`SHA-256`" al pasar.** Todo eso queda para el video siguiente, que **vuelve a leer esta misma filmina** entre 05:38 y 06:56 y ahí sí desarrolla las viñetas. O sea: la 22 se explica dos veces, una por video, y esta primera vez es la versión intuitiva.

El video corta negociando el recreo con el curso —*"¿hacemos 17:20? Dale. Sí, hagamos 17:30"*— y con un comentario al pasar: **Satoshi no implementó el hash de Bitcoin**, usó la librería de OpenSSL (el ASR dice *"Open C"*).

→ [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] · [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] · [[primitivas-de-hash-estandar|Primitivas de hash estándar]]

---

## Erratas y precisiones de las filminas

Las erratas del deck ya están tabuladas en [[clase-03-macs-y-cifrado-autenticado#Erratas y precisiones de las filminas|Clase 03 § Erratas]] — es el mismo PDF. Acá van sólo las tres cosas que surgieron de mirar **este** video.

**Una errata nueva, no registrada en la nota de clase.** La filmina 10 hace la cuenta mal en el último byte.

> **Errata de la filmina:** en la filmina 10 (*Backstage del ataque*, 38:52) el resultado del avance iterativo debería ser **`2F69E0`**, no `2F69F0`. Las tres filas de entrada son correctas — `2EDF79` = `00101110 11011111 01111001`, `12345` = `00000000 00110000 00111001`, `100000` = `00000001 10000110 10100000` —, pero el último byte del XOR es $\texttt{0x79} \oplus \texttt{0x39} \oplus \texttt{0xA0} = \texttt{0xE0}$, no `0xF0`: la filmina escribe `11110000` donde va `11100000`. El error se propaga a la filmina 8, cuyo criptograma adulterado dice `…9D2F69F0` y debería decir `…9D2F69E0`. **Verificado sobre la página renderizada del PDF, no sobre extracción de texto.** Los dos primeros bytes están bien, y la mecánica del ataque no cambia. **Ramele no lo corrige: lee la filmina.**

**Confirmación de una errata ya registrada.** La filmina 3 escribe la condición del `CPA` como $\Pr[\mathsf{CPA}_{A,\Pi} = 1] = 0{,}5 + \varepsilon \Rightarrow \Pi$ es indistinguible, con **igualdad** y con un $\varepsilon$ sin cuantificar, mientras la filmina 11 escribe la de `CCA` correctamente como $< \tfrac{1}{2} + \mathsf{neg}(n)$. La nota de clase ya lo tiene como precisión; el video lo confirma en pantalla y **tampoco lo corrige en voz**.

**Una errata que el informe del video reportó y que no existe.** El informe de visionado anotó que la filmina 15 (`Mac-forge`, 46:57) dice *"Si $\Pr[\mathsf{Mac\text{-}Forge} = 1] >\ \mathsf{neg}(n) \Rightarrow \Pi$ es infalsificable"*, con el signo al revés. **No es así:** el deck dice $\leq$, que es lo correcto. Es una mala lectura del frame de video. ***(Lectura nuestra: el signo se verificó contra el PDF del repo, que es el mismo deck que Ramele proyecta.)***

---

## Qué aporta y qué no

**Aporta**, y no está en ningún otro lado del vault:

- **Midway** (18:20) como `CPA` histórico, y la digresión de **aleatoriedad** (22:10). Ninguna de las dos está en la clase de Abad ni en las notas de concepto.
- El **contrapunto militar a Kerckhoffs** (08:47): ocultar el algoritmo como capa, no como fundamento.
- Las dos **moralejas de seguridad** del ataque de sueldos (33:28, 34:46, 35:08) — global contra local, y el eslabón más débil.
- Una segunda voz sobre la **restricción de $g(c)$ en el `CCA`** (42:05), que es lo único marcado como de examen.
- Alguien explicando **la filmina 22 de hash** por el lado de la intuición (1:05:05) — útil como contraste con la explicación de Abad del 03/09, que entra por la analogía de las tablas de hash de estructuras de datos.

**No aporta:**

- Nada formal que la [[clase-03-macs-y-cifrado-autenticado|nota de la Clase 03]] no tenga con más detalle. Todas las fórmulas del video ya están en el vault.
- **La filmina 17 no la da.** Ese ejercicio hay que buscarlo en la versión de Abad.
- **No resuelve** el ejercicio del cifrado de flujo contra `CCA` (43:00) — lo plantea y sigue. Abad sí lo resolvió.
- **No cuenta** la historia de 2004 y los ataques a `MD5` que sí trae la clase de Abad al hablar de las observaciones del `Mac-forge`.
- Los primeros doce minutos y los dos minutos de escritorio (07:07-08:34) son salteables sin pérdida.

**Ejercicios que deja para hacer en casa**, los dos de la filmina y ninguno resuelto en pantalla:

1. **Codear el ataque de maleabilidad** sobre `empleado||sueldo` (38:22).
2. **Demostrar que el cifrado de flujo no es CCA-Secure** con $m_0 = (0\ldots0)$ y $m_1 = (1\ldots1)$ (43:00) — resuelto en la [[clase-03-macs-y-cifrado-autenticado#El ejercicio: demostrar que el flujo no es CCA-Secure|nota de clase]].

---

## Cabos sueltos

- **La foto de la filmina 13** (44:13), debajo de *"Primitiva criptográfica: MAC"*, es demasiado chica y oscura en el video para saber qué muestra; parece un interior con muebles. No afecta nada técnico, pero **no se llegó a leer**.
- **El deck no tiene números de filmina impresos.** La numeración que usa esta nota es la de páginas del [PDF del repo](../../raw/clases/Clase%2003%20-%20Criptografia%20-%20MACs%20y%20Cifrado%20Autenticado.pdf), verificada página por página contra lo proyectado. Si la cátedra hubiera re-subido una versión distinta del deck, la numeración podría correrse — **no hay ningún indicio de eso**, y el título del archivo que se ve subir al campus a las 07:07 coincide.
- **El libro "Magic"** que cita a las 19:11 sobre el criptoanálisis estadounidense contra Japón: no está verificado el título ni el autor.
- **Los nombres de los alumnos** (Mauro, Cristian, Félix, Nicolás) salen del ASR y pueden estar mal escritos.
- **La errata de la filmina 10** que se registra arriba **no está en la tabla de erratas de la [[clase-03-macs-y-cifrado-autenticado#Erratas y precisiones de las filminas|nota de Clase 03]]**; habría que agregarla ahí, porque es del deck y no del video.
- **Este video y el #2 son una sola jornada.** El #1 corta en un recreo y el #2 arranca inmediatamente después, sin repasar nada; los dos se subieron el 27/03/2025.

