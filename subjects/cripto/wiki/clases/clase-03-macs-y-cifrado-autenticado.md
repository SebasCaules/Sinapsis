---
title: Clase 03 — MACs y cifrado autenticado
resumen: 'La clase de integridad, dictada en dos jueves: del ataque de texto cifrado escogido a los MAC y CBC-MAC, las funciones de hash y HMAC, y el cierre en cifrado autenticado con CCM y GCM.'
fuentes: ["[[clase-02-cifrado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]", "[[guia-03-mac-y-funciones-de-hash]]"]
aliases: [Clase 3, Clase 03, MACs, Integridad, MAC y cifrado autenticado]
type: clase
clase: 3
orden: 1
hub: true
fecha: 2026-08-27
fecha_2: 2026-09-03
created: 2026-08-28
updated: 2026-09-04
tags: [clase, integridad, maleabilidad, cca, mac, cbc-mac, hash, merkle-damgard, hmac, cumpleanos, cifrado-autenticado, ccm, gcm, clase-03, transcripcion]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt1-Transcripcion.VTT", "raw/clases/Clase 03pt2 - Transcripcion.VTT"]
---

# Clase 03 — MACs y cifrado autenticado

> **27/08 y 03/09 de 2026** — dos jueves de **teoría**, las dos sesiones con el mismo docente, **Pablo Abad** — el ASR lo identifica así en todos los cues de las dos grabaciones, y el [[reglamento-y-evaluacion|reglamento]] lo lista como **Responsable** de la cátedra: es la primera clase del cuatrimestre que no da Ramele · [Filminas](../../raw/clases/Clase%2003%20-%20Criptografia%20-%20MACs%20y%20Cifrado%20Autenticado.pdf) (41 slides, un solo PDF para las dos fechas)
> Transcripciones: [27/08](../../raw/clases/Clase%2003pt1-Transcripcion.VTT) (873 cues, 1h39) y [03/09](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT) (910 cues, 1h48) — **1783 cues, 3h27 en total**
> Lectura designada: Katz & Lindell **capítulo 4**, encargada en voz al cerrar el 03/09 (cue pt2 907) · Guía asociada: **[[guia-03-mac-y-funciones-de-hash|Guía 3 — MAC y Funciones de Hash]]**, lun 07/09 — ingerida, con su [[guia-03-resolucion|resolución]] · Práctica asociada: **[[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]]**, lun 31/08
> Viene de: [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]

> **Nota histórica: el archivo de la segunda grabación se llamaba "Clase 04" y no era la Clase 4.** Hasta el 04/09, `raw/clases/Clase 03pt2 - Transcripcion.VTT` se llamaba `Clase 04 - Transcripcion.VTT`; ese día se renombró al nombre actual. Es la **segunda sesión de esta clase**, la del jueves 03/09: arranca con *"la clase pasada habíamos empezado a ver otro campo de la criptografía…"* y desarrolla las filminas 22 a 41 de este mismo PDF. La lección se mantiene: la cátedra numera los archivos de `raw/` por **sesión**, no por tema — el mismo patrón que en `raw/practicas/`, donde `Clase N.pdf` es la práctica N y no la teórica N. La Clase 4 de verdad, **Criptografía Asimétrica**, es el 10/09 y todavía no está ingerida.

> **Una clase, dos jueves, una sola nota.** El [[cronograma]] parte esta clase en **MAC y cifrado autenticado (1)** el 27/08 y **(2)** el 03/09; las filminas son un único PDF y la wiki las trata como una sola nota —convención del vault: *la clase es la semana temática completa*—, por eso los conceptos llevan prefijo `03.*`.
> **El corte está medido**, no inferido: el 27/08 llegó hasta la filmina **21** —el ataque de sufijo al `CBC-MAC`, dejado de tarea— y su transcripción **no menciona en ningún cue** las palabras *hash*, *SHA*, *colisión* ni *preimagen*; el 03/09 abre el material nuevo en la filmina **22** con *"los primos hermanos de los MAC, que son las funciones de hash criptográficas"* (cue pt2 96, 00:11:39) y cierra en la **41** con la bibliografía (cue pt2 907, 01:47:27).
> O sea: **27/08 = filminas 1-21 = [[#1. Repaso: el criptosistema y las pruebas de la Clase 02|§1]] a [[#11. Cierre de la primera sesión|§11]] · 03/09 = filminas 22-41 = [[#12. La segunda sesión: cómo retoma el 03/09|§12]] a [[#25. Cierre: la integridad implícita y la bibliografía|§25]].**
> Con dos salvedades que sólo se ven midiendo: la sesión del 03/09 **no arranca en la 22** —le dedica doce minutos a repasar en voz las filminas 13 a 21, y ese repaso trae material que no está en ninguna lámina— y **no recorre el PDF en orden**: saltea la filmina **33** (`HMAC`) y vuelve a ella después de la 34 y la 35. El orden real de exposición es `[13-21 repaso]` → 22 → … → 32 → **34 → 35 → 33** → 36 → … → 41.

> **Cómo se citan los cues.** Hay **dos grabaciones** y cada `.VTT` numera sus cues **desde 1**, así que un número suelto no identifica nada. Por eso todo cue lleva **prefijo de parte**: `(cues pt1 N-M)` para la sesión del **27/08** y `(cues pt2 N-M)` para la del **03/09**. Es la misma convención que usa la [[clase-02-cifrado|Clase 02]].
> Los bloques plegados **De la transcripción** traen lo que el docente dijo en voz y **no está en ninguna filmina**; todo lo demás sale de las filminas. Las voces etiquetadas `EMILIO JOSÉ MITCHELL`, `TOMÁS PIETRAVALLO`, `Carlos Amador Vallejo Tapia` y `AGUSTÍN JULIÁN BRUNERO` son alumnos que participan por voz — el 03/09 son 22 cues de alumnos sobre 910, y varias de las mejores explicaciones de la jornada salen de ahí.
> Los dos `.VTT` son **transcripciones automáticas**: las repeticiones, los cortes de palabra y los errores de reconocimiento —*"Wandame Pan"* por *One Time Pad*, *"Cats"* por *Katz*, *"Md: Cinco"* por `MD5`, *"ya 1"* por `SHA-1`— son del ASR. Las citas se normalizan y las correcciones de palabra entera van entre corchetes; cuando la normalización hace una lectura interpretativa, se marca.

---

## 1. Repaso: el criptosistema y las pruebas de la Clase 02

> **El criptosistema sigue siendo la terna $\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec}$; lo que cambió es cuántas pruebas tiene que pasar.**

La filmina 2 es la misma terna de siempre — $\mathsf{Gen}: () \to \mathcal{K}$, $\mathsf{Enc}: \mathcal{K} \times \mathcal{P} \to \mathcal{C}$, $\mathsf{Dec}: \mathcal{K} \times \mathcal{C} \to \mathcal{P}$, con la propiedad básica $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ y los tres espacios $\mathcal{K}$, $\mathcal{P}$, $\mathcal{C}$ —. No hay nada nuevo: es el punto de partida sobre el que se cuelga la prueba nueva.

La filmina 3 reescribe la prueba `CPA` de la [[clase-02-cifrado|Clase 02]] tal como la dejó la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]], en sus 5 pasos:

1. Se genera una clave $k \leftarrow \mathcal{K}$
2. $A$ obtiene acceso a $f(x) = \mathsf{Enc}_k(x)$ y genera el par $(m_0, m_1)$
3. Se genera $b \leftarrow \{0, 1\}$
4. $A$ recibe $c = \mathsf{Enc}_k(m_b)$
5. $A$ emite $b' \in \{0, 1\}$

$A$ gana si $b = b'$, y $\Pi$ es indistinguible cuando su ventaja sobre la moneda es **despreciable**. La filmina escribe el experimento como `CPA`$_{A,\Pi}$; la notación del vault es $\mathsf{PrivK}^{\mathsf{CPA}}_{A,\Pi}$ — ver [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]].

> [!quote]- De la transcripción — el repaso que arma el arco de la Clase 02 y la pregunta que abre esta (cues pt1 2-24)
> *"La clase pasada habíamos repasado la formalización de cuál es la estructura más importante de la criptografía, que era el criptosistema: la terna de algoritmos, generación de claves, cifra[do y des]cifrado, con su propiedad básica de que cifrar y descifrar deberían funcionar como inversas para una misma clave. Y dos pruebas de seguridad, que de alguna manera empezaban a darle forma a esta idea de que **no hay una única definición de seguridad**."*
>
> La pregunta que abre la clase se la hace **el propio docente** —no hay alumnos en el aire todavía: el primero habla en el cue pt1 65— y la contesta él mismo. La formula en los cues pt1 7-8: *"Ese escenario dice: qué pruebas de seguridad deberíamos considerar en función de [qué] criptosistemas podemos usar."* Y la respuesta es la cadena completa de la clase anterior (cues pt1 9-14): *"Si voy muy rápido: el **One Time Pad**, por ejemplo, como caso ideal de criptosistema. Pero vimos que el One Time Pad, tan bueno como es, **no pasa la prueba de múltiples mensajes**, entonces tiene casos donde es muy bueno, pero muy acotados. Y después fuimos sofisticando las pruebas hasta entrar en la prueba `CPA` —*Chosen Plain Text, Indistinguibility*—, que empieza a modelar ataques más sofisticados, de los que aparecen cuando ya no salimos del mundo del papel y de jugar con criptosistemas offline, y empezamos a pensar el uso de criptosistemas **en protocolos**."*
>
> Y el ejemplo con el que aterriza el `CPA` (cues pt1 18-24): el oráculo de cifrado es *"una suerte de servicio remoto que descifra el texto"* — la imagen que usa es una **infraestructura de email** donde los mensajes viajan cifrados entre servidores: yo puedo generar un email con el texto plano que quiera y, rastreando la salida del servidor, obtener el texto cifrado que le corresponde.
>
> *(El cue pt1 20 dice literalmente **"descifra"**, pero el ejemplo que sigue —y el `CPA` entero— es de **cifrado**: el atacante pone el plano y se lleva el cifrado. Queda registrado como está; el lapsus es del docente o del ASR, y la transcripción no permite distinguirlo.)*

→ Conceptos: **[[criptosistema|Criptosistema]]** · **[[modelos-de-ataque|Modelos de ataque]]** · **[[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]]**

---

## 2. Criptosistemas CPA-Secure: con qué se instancia

> **La respuesta a "¿qué uso si necesito CPA-Secure?" tiene dos ramas: flujo con tweaks y bloque con encadenamiento.**

La filmina 4 reparte el menú, que es exactamente lo construido en la Clase 02:

| Rama | Qué añade | Para qué |
|---|---|---|
| **Criptosistemas de flujo con tweaks** | Un parámetro extra, el **IV**: *"público pero se selecciona aleatoriamente"*, para **evitar reutilizar exactamente la misma semilla** en el generador | La construcción de flujo CPA-Secure $c := \langle IV,\ G(k \Vert IV)\oplus m\rangle$ |
| **Criptosistemas de bloque** | **Encadenamiento**: `CBC`, `Counter`, `OFB`, `CFB`, *"utilizando primitivas de cifrado de bloque seguras"* | [[aes\|AES]] / [[des-y-3des\|3DES]] en un [[modos-de-encadenamiento\|modo]] |

*(La fórmula de la primera fila no está en la filmina 4, que sólo nombra el IV: la trae la wiki desde [[maleabilidad|Maleabilidad]] y [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]], donde es el objeto que la clase ataca. Y hay que escribirla entera: el punto del IV es que **el keystream dependa del valor fresco**. Un $c := \langle r,\ G(k)\oplus m\rangle$, con el $r$ viajando al pepe y el keystream fijo, sigue siendo determinístico y por lo tanto **no** es CPA-Secure — es el resultado que la propia [[clase-02-cifrado|Clase 02]] usa para descartar el cifrado determinístico. La forma equivalente de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]], sobre función pseudoaleatoria en vez de generador, es $c := \langle r,\ F_k(r)\oplus m\rangle$.)*

No es una filmina de contenido nuevo: es **la mesa de herramientas sobre la que la clase va a montar su contraejemplo**. La palabra *tweaks* es la única que la wiki no usa en ese sentido — el vault dice [[cifrado-probabilistico-nonce-e-iv|nonce e IV]]—.

**Por qué el bloque le ganó al flujo.** La filmina reparte las dos ramas en pie de igualdad, pero en la práctica la de bloque es la que domina, y el docente da tres razones que la filmina no escribe: **es más eficiente**, **está mejor pensada para ejecutarse en hardware** —de ahí el throughput— y, la que interesa acá, **es más fácil de demostrar**, porque trabaja sobre un dominio finito de tamaño fijo en vez de sobre estructuras potencialmente infinitas. Las tres explican por qué el resto de la clase razona sobre bloques y por qué el contraejemplo que viene se monta sobre **flujo**: el flujo es lo que quedó del lado frágil.

> [!quote]- De la transcripción — las tres razones del bloque sobre el flujo (cues pt1 29-32)
> *"Ahí aparece el concepto de los criptosistemas de bloque, que son los que hoy dominan el escenario de los criptosistemas: porque son **más eficientes**, porque están **mejor pensados para ejecutar en hardware** —entonces tienen mayor [throughput]—, y porque, al no trabajar con **estructuras potencialmente infinitas**, tienen demostraciones matemáticas un poco —no mucho, pero un poco— **más fáciles de hacer y de seguir**."*

→ Conceptos: **[[generador-pseudoaleatorio|Generador pseudoaleatorio]]** · **[[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]]** · **[[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]]** · **[[modos-de-encadenamiento|Modos de encadenamiento]]**

---

## 3. Un nuevo tipo de ataque: la base de sueldos

> **Un criptosistema CPA-Secure, usado exactamente como se manda, y aun así lo adulteran. Acá nace el tema de toda la clase.**

Las filminas 5 a 8 cuentan la historia en cuatro pasos, y cada uno empeora al anterior.

**El encargo** (filmina 5): *"¿Podríamos proteger los sueldos de empleados en una base de datos?"*. Supuesto explícito: se usa **un criptosistema de flujo CPA-Secure** — lo mejor que dejó la Clase 02. La tabla guarda, por empleado, el sueldo cifrado:

| empleado | sueldo (cifrado) |
|---|---|
| 2542 | `0xEA26969AA3F61CDD9EC68498DF031CA935EFA9C` |
| 2678 | `0xF4933E107178B88D8EE00F40E43A9A3C9D2EDF79` |
| 2789 | `0x155BBBE7A5442CBBCAB8F57DACF7212255F3641C` |
| 2890 | `0x4D9B47D518F2ED7DE04D601F1856767969A328E8` |

**El ataque sin conocer valores** (filmina 6): *"A veces no es necesario conocer el valor para generar problemas"*. El atacante conoce **su legajo (2678)** y **el de su jefe (2890)** — datos públicos de cualquier organización —, así que **copia el criptograma de la fila del jefe a la suya**: la fila de 2678 pasa a valer `0x4D9B...328E8` — **¡Aumento de sueldo!**, dice la filmina.

No descifró nada, no rompió la confidencialidad, y cobró el sueldo del jefe. Cada criptograma sigue descifrando a *algo* válido. El problema es que **no hay forma de detectar que la fila fue adulterada**.

**La defensa que no funciona** (filmina 7): cifrar `'empleado||sueldo'` como un solo mensaje, para que el criptograma dependa de los dos campos. Texto plano: `2678 $12,345`.

**El remate** (filmina 8, rotulada `Malleability` en el propio PDF): *"¡Modificaciones quirúrgicas aún permiten cambiar el dato!"* — el criptograma de `2678 $12,345` se convierte, cambiando algunos bytes, en el de `2678 $100,000`:

| | criptograma |
|---|---|
| original | `0xF4933E107178B88D8EE00F40E43A9A3C9D2EDF79` |
| adulterado | `0xF4933E107178B88D8EE00F40E43A9A3C9D2F69F0` |

La palabra clave es **maleabilidad**, y el docente la define en voz antes de que la filmina la nombre:

> [!quote]- De la transcripción — qué significa maleabilidad (cues pt1 116-120)
> *"Si yo tomo un texto cifrado que salía de algún valor plano y le modifico algún bit o algunos bits, cuando yo lo descifre **con una clave que no conozco** —no importa—, el resultado va a ser **el texto plano con esos mismos bits cambiados**. (…) Y por eso se llama maleabilidad: **yo puedo tocar el texto cifrado, moldearlo de alguna manera, para remoldear o cambiarle la forma al texto plano**."*

→ Conceptos: **[[maleabilidad|Maleabilidad]]** — la nota completa del ataque: escenario, aritmética y las tres condiciones que hay que retener

---

## 4. Backstage del ataque: la aritmética del XOR

> **Por qué una modificación tan quirúrgica es posible: porque el cifrado de flujo es un XOR, y el XOR es lineal de los dos lados.**

Las filminas 9 y 10 abren el cajón del ataque para mostrar que no hay magia.

**Filmina 9 — lo que el atacante necesita saber.** *"Se necesita conocer el criptosistema y formato de mensaje"*:

$$\text{Formato del campo:}\quad IV \,\Vert\, \texttt{empl} \,\Vert\, \texttt{sueldo}$$

| Campo | Tipo | Tamaño |
|---|---|---|
| $IV$ | `byte[]` | 12 bytes |
| `empl` | `int` | 4 bytes |
| `sueldo` | `int` | 4 bytes |

Sobre el criptograma de la fila adulterada, esos 20 bytes se leen así — y es lo que le dice al atacante **dónde cortar**:

$$\underbrace{\texttt{F4933E107178B88D8EE00F40}}_{IV,\ 12\ \text{bytes}}\ \underbrace{\texttt{E43A9A3C}}_{\texttt{empl},\ 4}\ \underbrace{\texttt{9D2EDF79}}_{\texttt{sueldo},\ 4}$$

Conocer el formato **no es un supuesto exótico**: el [[principio-de-kerckhoffs|principio de Kerckhoffs]] asume que el sistema es público, y el formato de los campos lo es junto con él.

**Filmina 10 — la cuenta.** Con $\mathsf{Enc}_k(m) = G(k) \oplus m = c$, se define $c' = c \oplus x$ para cualquier $x$ que el atacante elija, y entonces:

$$\mathsf{Dec}_k(c') = G(k) \oplus c \oplus x = \underbrace{G(k) \oplus c}_{=\,m} \oplus x = m \oplus x$$

**El cambio aplicado al criptograma es el cambio aplicado al texto plano.** La filmina lo muestra bit a bit sobre el sueldo: con $x$ bien elegido, los bytes de `12345` se convierten en los de `100000` — el *"avance iterativo hasta el resultado"* que anuncia el cuerpo de la filmina es literal: el atacante corrige dígito por dígito, con un XOR por posición, hasta que el descifrado dice lo que él quiere.

> [!quote]- De la transcripción — de dónde sale la propiedad (cues pt1 101-107)
> *"La maleabilidad de un criptosistema de flujo sale de esta propiedad, por definición. Si en un criptosistema de flujo la función de cifrado, ¿qué es? Es un **XOR bit a bit** entre los bits del mensaje y los bits de un generador pseudoaleatorio que usa como semilla lo que llamamos clave. Entonces, imagínense por un segundo que, a la hora de descifrar este mensaje, en vez de descifrar $c$, modificamos $c$ y creamos un $c'$ que es $c$ con algún valor arbitrario (…) le cambiamos el último bit a $c$."*

Este es el mismo ataque estructural que la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]] ya había anticipado para el modo `CTR`; acá se convierte en el motivo de todo el bloque nuevo.

→ Conceptos: **[[maleabilidad|Maleabilidad]]** · **[[criptosistema-de-flujo|Criptosistema de flujo]]** · **[[one-time-pad|One Time Pad]]**

---

## 5. Ataques de texto cifrado escogido: CCA

> **Si el atacante también puede pedir desciframientos, la definición de seguridad se endurece otra vez. Y nada de lo visto hasta hoy la pasa.**

**La definición** (filmina 11). El experimento `CCA`$_{A,\Pi}$ —*Chosen Ciphertext Attack*— es el `CPA` con un oráculo más:

1. Se genera una clave $k \leftarrow \mathcal{K}$ (para un nivel de seguridad $n$)
2. $A$ obtiene $f(x) = \mathsf{Enc}_k(x)$ **y** $g(x) = \mathsf{Dec}_k(x)$, y genera $(m_0, m_1)$
3. Se genera $b \leftarrow \{0, 1\}$
4. $A$ recibe $c = \mathsf{Enc}_k(m_b)$ — **y no puede calcular $g(c)$**
5. $A$ emite $b'$

$A$ gana si $b = b'$, y $\Pi$ es CCA-indistinguible si $\Pr[\mathsf{CCA}_{A,\Pi} = 1] < \tfrac{1}{2} + \mathsf{negl}(n)$. La filmina escribe el experimento como `CCA`$_{A,\Pi}$ y abrevia el umbral como `neg(n)` — la notación del vault y las erratas están en la [[#Erratas y precisiones de las filminas|tabla de erratas]].

La restricción del paso 4 es la única diferencia con el `CPA`, y es la que hace la prueba interesante: el adversario conserva el descifrador para **cualquier criptograma salvo el desafío**. Ver [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]].

### El ejercicio: demostrar que el flujo no es CCA-Secure

**Filmina 12.** *"Ningún criptosistema visto hasta el momento es CCA-Secure. Ejercicio: demostrar que el cifrado de flujo en general no es CCA-Secure. Ayuda: considerar $m_0 = (0\ldots0)$ y $m_1 = (1\ldots1)$ y verificar qué consultas se pueden hacer a $g(x)$ al recibir $c$."*

**Resuelto en clase, guiado por los alumnos.** La construcción: $A$ pide $m_0 = 0\ldots0$ y $m_1 = 1\ldots1$; recibe $c = G(k) \oplus m_b$; forma $c' = c \oplus e_n$ — el vector con un único `1` en el último bit — y consulta $g(c')$, que **no es** el criptograma desafiado, así que la consulta es legal.

> [!quote]- De la transcripción — el ataque bit a bit (cues pt1 295-322)
> Sobre qué hace $c' = c \oplus e_n$ al texto plano (cues pt1 295-296): *"el resultado sería que $m'$ es exactamente igual a $m$, salvo que el último bit está al revés (…) si el último bit es 0, en $c'$ va a ser un 1 y viceversa. Y el resto es todo igual."*
>
> Y por qué eso resuelve el desafío (cues pt1 316-321): *"Calculamos un $c'$ modificado donde cambiamos el último bit. Entonces, si yo lo descifro, lo que voy a tener es el mensaje original —que es uno de esos dos— con el último bit modificado: me va a quedar uno que son todos ceros y un 1, o todos unos y un 0."*
>
> La respuesta del alumno que cierra (cues pt1 312, 314): *"Si [$b$] es 0, correspondía al $m_0$; y si era 1, al $m_1$ (…) porque quedaron los primeros bits, excepto el último, iguales."*

$A$ mira **cualquier bit salvo el último** de $\mathsf{Dec}_k(c')$: si es `0`, $b = 0$; si es `1`, $b = 1$. La salvedad no es un detalle: el último bit es justamente el que $A$ dio vuelta, así que ahí la regla queda **invertida** —con $b = 0$ el descifrado termina en `1` y con $b = 1$ termina en `0`— y el adversario perdería siempre. Es lo que el docente marca al cerrar (cue pt1 320): *"Si ignoro ese último bit que modifiqué…"*. Mirando cualquiera de los otros, la ventaja es $1/2$ — total. Es la maleabilidad de la [[#4. Backstage del ataque: la aritmética del XOR|§4]] convertida en adversario de la prueba formal.

### La moraleja: para qué sirve una prueba de seguridad

El docente no cierra el ejercicio con el ejercicio: lo cierra con **qué se hace con el resultado**. Una prueba de seguridad no es un sello de calidad abstracto, es **una herramienta de decisión**: dice si una construcción se puede usar o no *en un escenario dado*. Lo que acaba de demostrarse, puesto en prosa, es que **si el escenario exige sobrevivir a texto cifrado escogido, un criptosistema de flujo no sirve y hay que buscar otra cosa**. Ésa es la lección explícita de la sesión, y es el marco con el que hay que leer todo lo que sigue: el `CCA` no se rompe cambiando de modo de cifrado, se rompe agregando **otra primitiva**.

> [!quote]- De la transcripción — para qué sirve una prueba de seguridad (cues pt1 364-368)
> *"Las pruebas de seguridad se pueden usar como **herramienta para entender si un criptosistema, una construcción criptográfica, se puede usar o no en cierto escenario**. O sea, el resultado de lo que acabamos de hacer, si lo pusiese en prosa, quiere decir que si estuviésemos en un escenario de seguridad donde aplica esta definición —donde necesitamos **sobrevivir a texto cifrado escogido**— un criptosistema de flujo **no sirve**: tenemos que buscar otra cosa. Ésa, si quieren, es la lección."*

Y una nota metodológica sobre el ejercicio mismo, que conviene tener a mano antes del parcial: **la construcción de este adversario no es obvia la primera vez, y no se espera que lo sea**. El docente lo dice de frente sobre su propia experiencia. La categoría que usa —*demostraciones galera*, las que parecen sacadas de la galera de un mago— nombra exactamente la sensación de leer un ataque elegante y no ver de dónde salió; el antídoto no es tener la idea, es **reconocer la estructura repetida** (acá: anular con un xor conocido y después leer). Es la misma técnica que reaparece en el [[#10. Cómo construir un MAC: CBC-MAC|ataque al CBC-MAC]] media hora después.

> [!quote]- De la transcripción — las demostraciones "galera" (cues pt1 356-361)
> *"Es muy fácil, entre comillas. O sea: yo esta demostración ya la vi 200 veces, **la puedo hacer dormido**. La primera vez que la vi, como la están viendo ustedes, dije: *no se me hubiese ocurrido jamás*. Muchas de estas cosas son como las demostraciones matemáticas esas que llamamos **galeras**: cuando uno las ve por primera vez dice *¿cómo se le ocurrió a alguien?*, y después uno empieza a ver cierta estructura y cierta idea atrás de eso."*

→ Conceptos: **[[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]]** · **[[maleabilidad|Maleabilidad]]**

---

## 6. La conclusión: hace falta integridad

> **"Es un problema no resuelto por el cifrado solamente. Requiere control de integridad."** (filmina 13)

La filmina 13 cierra la primera mitad del arco en cuatro líneas: el CCA no se arregla con **otro** modo de cifrado — *"consiste en identificar adulteraciones"* — y la primitiva que lo hace tiene nombre:

> **Primitiva criptográfica: MAC** — *MAC = Message Authentication Code.*

El puente lo da el propio docente al cerrar el ejercicio (cue pt1 282): *"En el ataque que habíamos mostrado, que motivó todo esto, habíamos visto otra suerte de propiedad, que era esta: la de **maleabilidad**. ¿Se acuerdan?"*

Es el mismo movimiento conceptual que la Clase 02 usó con `Eav`: un ataque concreto primero, la prueba formal después. Acá el ataque fue la [[#3. Un nuevo tipo de ataque: la base de sueldos|base de sueldos]] y la prueba es el `CCA`; la respuesta a ambas es la **integridad**, que el docente presenta como *"otro de los grandes servicios de seguridad"* junto a la privacidad (cue pt1 390).

---

## 7. Message Authentication Code

> **La terna de algoritmos del criptosistema, cambiada de servicio: en vez de cifrar y descifrar, etiqueta y verifica.**

La filmina 14 define el MAC como **una terna de algoritmos** — la misma forma que el criptosistema, con otros nombres:

| Algoritmo | Firma | Nombre en la filmina | Qué hace |
|---|---|---|---|
| $\mathsf{Gen}$ | $() \to \mathcal{K}$ | Generador de clave | Sortea la clave |
| $\mathsf{Mac}$ | $\mathcal{K} \times \mathcal{P} \to \mathcal{T}$ | **Etiquetador** | Genera la etiqueta $t$ del mensaje |
| $\mathsf{Vrfy}$ | $\mathcal{K} \times \mathcal{P} \times \mathcal{T} \to \{0, 1\}$ | Verificador | Dice si el par $(m, t)$ es válido |

**Propiedad básica:** para todo $m$ y $k$ válidos, $\mathsf{Vrfy}_k(m, \mathsf{Mac}_k(m)) = 1$ — exactamente el paralelo de $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$.

Los conjuntos también se trasladan: $\mathcal{K}$ es el espacio de claves, $\mathcal{P}$ el plano y $\mathcal{T}$ el **espacio de etiquetas**. El docente en voz usa la palabra que la bibliografía reserva para esto:

> [!quote]- De la transcripción — etiquetadora y verificación (cues pt1 401-405, 409, 414)
> *"Hay una función que se suele llamar **etiquetadora** —*labelling*—, que a partir de una clave y un mensaje genera una **etiqueta**; y una función de **verificación**, que a partir de una clave, un mensaje y una etiqueta básicamente **emite una decisión sobre si la verificación se pasa o no se pasa** (…) [otra,] a partir de un mensaje, una etiqueta y la clave, **nos dice si verifica o no** (…) calcula la etiqueta de un mensaje con una clave dada."*

Dos diferencias con el cifrado que conviene fijar, porque las usa la prueba de la [[#8. Seguridad de un MAC: Mac-forge|§8]]:

1. **El MAC no devuelve texto: devuelve una etiqueta** — un testigo que permite *detectar* si el mensaje cambió, no recuperar el original.
2. **La etiqueta no es secreta.** El docente lo contesta explícitamente (cue pt1 466): *"La etiqueta no tiene por qué ser privada."* El par $(m, t)$ se puede guardar o transmitir junto: lo que protege el esquema es que **nadie más puede producir** una etiqueta válida para un mensaje nuevo.

→ Conceptos: **[[message-authentication-code|Message Authentication Code]]**

---

## 8. Seguridad de un MAC: Mac-forge

> **La prueba mide exactamente lo que el servicio promete: que nadie pueda producir un par válido para un mensaje que nunca etiquetaron.**

**El experimento** (filmina 15): *Message Authentication Experiment*, $\mathsf{Mac\text{-}Forge}_{A,\Pi}$:

1. Se genera una clave $k \leftarrow \mathcal{K}$ (para un nivel de seguridad $n$)
2. $A$ obtiene $f(x) = \mathsf{Mac}_k(x)$
3. $A$ evalúa $f$ **las veces que quiera** — el conjunto de evaluaciones se llama $Q$
4. $A$ emite $(m, t)$ con $m \notin Q$

$A$ gana si $\mathsf{Vrfy}_k(m, t) = 1$, y $\Pi$ es **infalsificable** si $\Pr[\mathsf{Mac\text{-}Forge}_{A,\Pi} = 1] \leq \mathsf{negl}(n)$. Ver [[seguridad-de-un-mac|Seguridad de un MAC]].

> [!quote]- De la transcripción — el experimento contado desde el adversario (cues pt1 440-452)
> *"Si lo tengo que resumir desde el punto de vista del adversario: el adversario tiene acceso a una función de etiquetar, etiqueta los mensajes que quiera, y después tiene que emitir un mensaje nuevo **que no etiquetó nunca**, con un valor de etiqueta. Va a ganar la prueba si el mensaje y la etiqueta del atacante pasan la verificación. (…) Si la probabilidad de que el atacante gane es despreciable, se dice que el MAC es **infalsificable**."*
>
> Y la diferencia de estructura con las pruebas de indistinguibilidad (cues pt1 447-452): *"A diferencia de lo que pasaba con los criptosistemas —que recibían un mensaje y tenían que elegir entre dos, y la mitad de las veces le pegan—, acá, si elige un mensaje y una etiqueta al azar (…) la probabilidad de que gane tirando valores al azar es prácticamente 0. **Por eso el sesgo es hacia el 0** en la nomenclatura de la prueba."*

El detalle del paso 3 que el docente cuida (cues pt1 434-437): *"las veces que quiera"* significa **polinómicas** en $n$ — *"una cantidad grande, pero polinómica de veces"*. Y el registro $Q$ existe porque el paso 4 lo necesita: *"acá sí hay un registro de las evaluaciones, de los valores de $x$ para los cuales pidió la etiqueta"* (cue pt1 437).

→ Conceptos: **[[seguridad-de-un-mac|Seguridad de un MAC]]** · **[[modelos-de-ataque|Modelos de ataque]]**

### Las observaciones y la lección de 2004

La filmina 16 añade dos observaciones que parecen detalles y no lo son:

- **El adversario puede obtener el MAC de cualquier mensaje que elija** — el oráculo es ilimitado dentro de lo polinómico.
- **Se considera roto el MAC si falsifica cualquier mensaje**, *"independientemente de si tiene sentido o no"*.

Ese segundo punto es el que el docente eligió justificar, y la filmina no lo justifica: lo hace con una historia de veinte cues que no está en ningún slide. **El arco es de cuatro años.** En **2004** un grupo de matemáticos chinos —Xiaoyun Wang y colaboradores, aunque la clase no los nombra— publica una forma nueva de falsificar, y la primera reacción de las empresas que dependían de esas primitivas es **ningunearla**: *"las falsificaciones que crean no tienen sentido — el original era un PDF, la falsificación no es un PDF, así que no sirve para nada"*. En ese momento el ataque pedía **una supercomputadora de la época trabajando seis o siete horas**. Para **2006** estaba mejorado y automatizado al punto de correr *"en la computadora de cualquiera"*. Para **2008**, optimizado hasta **un millón de falsificaciones por segundo**. Y ahí el sinsentido se cayó, por una razón que nadie había anticipado en 2004: no hacía falta falsificar el mensaje entero. Alcanzaba con **dejar el prefijo y el sufijo iguales y modificar algo en el medio** — y con eso se **falsificaron certificados digitales** de Google y Microsoft, generados pre-expirados como prueba de concepto por quien lo hizo.

Cuatro años entre *"es un ataque teórico muy lindo"* y *"esto está roto en producción"*. Ése es el argumento entero, y por eso la definición de la filmina 16 no admite la excepción del sentido.

> [!quote]- De la transcripción — por qué no vale el argumento "la falsificación no tiene sentido" (cues pt1 473-493)
> *"Esto lo agregué porque en el 2004 hubo un avance muy importante en todo este campo: **un grupo de matemáticos chinos encontró una forma nueva de atacar funciones, primitivas de los MACs** que se usan para integridad, y lograban generar falsificaciones. Lo primero que hicieron —especialmente las empresas que tenían productos que dependían de eso— fue básicamente ningunearlos, diciendo: *pero no importa, las falsificaciones que crean no tienen sentido. Uno se va a dar cuenta rápido: el original era un PDF, la falsificación no es un PDF, así que no sirve para nada. Es un ataque teórico muy lindo, pero no sirve*.*
>
> *El 2004 fue un año bisagra: era un ataque completamente nuevo en cuanto a metodología, requería una **supercomputadora** de esos tiempos dejándola trabajar **seis, siete horas**. Pero como suele pasar con todo lo novedoso, ni bien salió se armó una comunidad entusiasta de *queremos entenderlo, queremos mejorarlo*. La historia corta es que **para el 2006 se había mejorado y automatizado el ataque lo suficiente como para que corra en la computadora de cualquiera**, y **para el 2008 se había optimizado al punto de generar un millón de falsificaciones por segundo**.*
>
> *Y ahí se abrieron caminos donde el sinsentido empezó a tener grietas. El sinsentido se cayó cuando alguien dijo: bueno, tal vez no quiero falsificar todo el mensaje; tal vez quiero falsificar **una parte** del mensaje — dejo el prefijo y el sufijo igual y modifico algo en el medio. Y gracias a eso **lograron falsificar certificados digitales**. Cuando apareció un tipo con un certificado digital de Google, de Microsoft… —era bueno: lo generó pre-expirado, como prueba de concepto—, ahí sí se armó un revuelo bastante grande.*
>
> *Fue una gran lección para la comunidad de las pruebas de seguridad: parecen muy draconianas y creemos que hay un espacio en el medio — **hay que tener mucho cuidado cuando aparece un ataque e ignorarlo porque no parece práctico**."*

*(Qué es lectura nuestra en el párrafo de arriba: el docente **no nombra ni a los autores ni a la función** — dice sólo "primitivas de los MACs". La identificación del "grupo de matemáticos chinos" con Xiaoyun Wang y colaboradores, y del episodio de los certificados con las colisiones de `MD5`/`SHA-1`, la agrega la wiki — ver [[primitivas-de-hash-estandar|Primitivas de hash estándar]].)*

La moraleja es la misma que la [[clase-02-cifrado|Clase 02]] fijó con *seguro / debilitado / quebrado*: **la definición es dura a propósito**, porque el "espacio del medio" entre definición y práctica es donde mueren los sistemas.

---

## 9. Ejercicio: tres MACs candidatos

> **Filmina 17.** *"Considerar la seguridad de los siguientes MACs"*: $\mathsf{Mac}_k(m) = G(k) \oplus m$ (con $G$ generador pseudoaleatorio), $\mathsf{Mac}_k(m) = k \oplus \mathsf{first}_k(m)$ (los primeros $\lvert k\rvert$ bits del mensaje), y $\mathsf{Mac}_k(m) = \mathsf{Enc}_k(\lvert m\rvert)$ (con `Enc` CPA-Secure). **Los tres son falsificables**, y la clase los derribó uno por uno.

### a) La etiqueta es el keystream xor el mensaje

$$\mathsf{Mac}_k(m) = G(k) \oplus m \qquad (G \text{ generador pseudoaleatorio})$$

Falsificable en una consulta: si $A$ pide la etiqueta de cualquier mensaje $m$, recibe $t = G(k) \oplus m$ y de ahí **recupera $G(k) = t \oplus m$**. Con la semilla en la mano, produce $(m', G(k) \oplus m')$ para el mensaje nuevo $m'$ que quiera, y $\mathsf{Vrfy}$ lo da por bueno.

Lo resolvió **Carlos** en voz, y el docente le fue traduciendo cada paso a notación (cues pt1 511-538).

> [!quote]- De la transcripción — la discusión arrancó por el mensaje 0 (cues pt1 515-532)
> Carlos: *"Había pensado que el MAC… lo que podés hacer es agarrar un mensaje hecho de **todos ceros** (…) usar el MAC, intentar validar todos los ceros, y entonces te queda el generador."*
>
> El docente lo traduce (cues pt1 527-532): *"Puedes, aprovechando que tenés la función de etiquetado: puedes etiquetar el mensaje 0, que sería calcular el MAC (…) y publicarías ese mensaje, llamémoslo $m'$, y como etiqueta el $G(k)$ que calculaste **xor ese mensaje**."* — El mensaje $0$ es el caso límite que revela la semilla: $t = G(k) \oplus 0 = G(k)$; la etiqueta que se emite después es $G(k) \oplus m'$.

El error de diseño es usar la **misma $G(k)$ como bloque cifrante y como etiqueta**: la etiqueta filtra exactamente el valor que debía permanecer oculto.

### b) La etiqueta sólo cubre los primeros bits

$$\mathsf{Mac}_k(m) = k \oplus \mathsf{first}_k(m)$$

Falsificable **sin tocar la etiqueta**: la etiqueta sólo cubre los primeros $\lvert k\rvert$ bits del mensaje, así que $A$ pide la etiqueta de cualquier mensaje, y emite un mensaje nuevo con **los primeros bits intactos y la cola cambiada**, con la misma etiqueta.

> [!quote]- De la transcripción — la regla que deja este contraejemplo (cues pt1 562-568)
> *"Exacto, porque la etiqueta sólo toma en cuenta los primeros $k$ bits del mensaje (…) Le calculamos la etiqueta y después cambiamos algunos de los bits de por ahí atrás, que no entran en la etiqueta. (…) Para ser infalsificable, sí o sí, **la etiqueta tiene que tomar en cuenta todos los bits del contenido del mensaje**. No se puede armar una función de [MAC] [in]falsificable que ignore partes del mensaje."*
>
> *(El ASR del cue pt1 568 dice "una función de magging falsificable". "Magging" es `MAC`, y el "falsificable" tiene que ser **infalsificable**: la frase anterior lo exige y la conclusión no cierra de otro modo. Los dos corchetes marcan las dos correcciones nuestras.)*

Es el prerrequisito que después cumple el [[#10. Cómo construir un MAC: CBC-MAC|CBC-MAC]] — y que las [[funciones-de-hash-criptograficas|funciones de hash]] del 03/09 cumplen por diseño.

### c) La etiqueta sólo depende de la longitud

$$\mathsf{Mac}_k(m) = \mathsf{Enc}_k(\lvert m\rvert) \qquad (\mathsf{Enc} \text{ CPA-Secure})$$

Falsificable porque **la etiqueta sólo depende de la longitud**: $A$ pide la etiqueta de $m_1$ y la reusa para cualquier $m_2$ de la misma longitud. Lo plantea primero **Carlos** (cue pt1 574): *"Con que un mensaje tenga igual longitud, te lo verifique igual."*

> [!quote]- De la transcripción — el ataque (cues pt1 595-597)
> *"Yo puedo [etiquetar] un mensaje de longitud $x$, voy a obtener una etiqueta, y después puedo poner cualquier otro mensaje de longitud $x$ con esa etiqueta. Porque, aunque yo pase por la función MAC y me daría otro resultado —no importa—, la etiqueta del otro mensaje va a validar igual."*
>
> *(En el cue pt1 595 el ASR transcribe "descifrar"; por el contexto —el adversario está usando el oráculo $\mathsf{Mac}_k$— es **etiquetar**. Corrección nuestra.)*

Este es el que la clase dejó cerrado al final, porque su verificación es distinta: como la etiqueta es un **cifrado**, se puede verificar por inversión en vez de por recomputación.

> [!quote]- De la transcripción — la verificación por inversión y el cierre (cues pt1 823-828, 844-864)
> Sobre por qué este MAC no se verifica como los anteriores (cues pt1 823-826): *"Con los otros, que eran determinísticos, calculás el MAC de vuelta y lo comparás. Porque al ser [el cifrado] no determinístico, te va a pasar esto: cuando lo calculo me da $x$; cuando lo voy a verificar, lo vuelvo a calcular y me da otro valor (…) Entonces la verificación no puede ser así."*
>
> Y la propiedad que salva el caso (cue pt1 828): *"¿Cuál es la propiedad fundamental que se va a mantener en este caso? **Que la etiqueta es el resultado de un cifrado, entonces la puedes invertir.**"*
>
> Con eso, la falsificación completa sobre la pizarra al cerrar la clase (cues pt1 844-864): se etiqueta el mensaje `1, 2, 3`, se emite $(m', t)$ con $m'$ otro mensaje de longitud 3, y la verificación —*"lo que va a determinar si esto pasa o no va a ser: descifrar con la clave $k$ la etiqueta y compararlo contra la longitud de $m'$"*. El descifrado de la etiqueta da 3, la longitud de $m'$ es 3, *"así que esto es verdadero. **Pasó la verificación. Emitiste una falsificación.**"*

La observación de cierre: el cifrado probabilístico impide verificar por recomputación — el re-cifrado de lo que sea daría otra etiqueta —, y por eso el `Vrfy` de este esquema **descifra**. Pero la inversión no salva el esquema: la etiqueta sigue dependiendo sólo de la longitud, y la falsificación pasa igual.

---

## 10. Cómo construir un MAC: CBC-MAC

> **La primera construcción infalsificable de la materia: un cifrado en bloque encadenado, y el último bloque como etiqueta.**

**La construcción** (filmina 18). A partir de una primitiva de cifrado de bloque — una **función pseudoaleatoria** $F_k$ [[primitiva-de-cifrado-en-bloque|segura]]:

$$\begin{aligned}
\mathsf{Gen}:\quad & k \leftarrow \{0,1\}^n \\
\mathsf{Mac}:\quad & \text{sea } m = m_1 \Vert m_2 \Vert \ldots \Vert m_j,\quad t_0 = 0\ldots0,\quad t_i = F_k(t_{i-1} \oplus m_i) \\
& \mathsf{Mac}_k(m) = t_j \\
\mathsf{Vrfy}:\quad & \mathsf{Vrfy}_k(m, t) = 1 \iff t = \mathsf{Mac}_k(m)
\end{aligned}$$

Es el [[modos-de-encadenamiento|modo CBC]] sin IV y **sin devolver nada más que el último bloque**. El `Vrfy` recomputa y compara — el patrón *"calculás el MAC de vuelta y lo comparás"* de la [[#9. Ejercicio: tres MACs candidatos|§9c]].

### El ataque de longitud variable

**Filmina 19.** *"La construcción anterior es infalsificable SOLO si se permiten mensajes de una misma longitud."* Con longitudes libres, el ataque es:

1. Crear dos bloques aleatorios $A$ y $B$
2. Pedir $t_1 = \mathsf{Mac}_k(A \Vert B)$ y $t_2 = \mathsf{Mac}_k(A)$
3. Emitir $\big(A \Vert B \Vert (A \oplus t_1),\; t_2\big)$

Por qué funciona: el estado intermedio del mensaje forjado tras $A \Vert B$ es $t_1$, así que el tercer bloque entra XOReado como $A \oplus t_1$ y el estado vuelve a valer $F_k(t_1 \oplus (A \oplus t_1)) = F_k(A)$ — exactamente el estado de $\mathsf{Mac}_k(A)$, cuya salida es $t_2$. El mensaje forjado es nuevo — nunca se etiquetó — y verifica.

> [!quote]- De la transcripción — el engaño de los prefijos (cues pt1 720-729)
> *"Entonces, yo, ¿qué estoy haciendo? Yo estoy construyendo un mensaje que primero va a ser un **xor con $t_1$** —o sea, eso [da] 0: dejé un tablero limpio para poner el valor que quiera—. ¿Y qué valor le pongo? **Le pongo $A$**, porque esto termina siendo $F(A)$. Y $F(A)$ es un valor que ya tengo y calculé: $F(A)$ es lo que llamábamos $t_2$. Así que si yo construyo este mensaje, **sé que la etiqueta $t_2$ va a ser válida**. Fíjense que yo, como atacante, evalué dos mensajes que no son este mensaje. Son distintos —son prefijos, pero no son ese mensaje— y logro emitir un tercer mensaje con una etiqueta que tengo garantías de que sea válida."*
>
> *(El docente está describiendo el bloque que se escribe en el mensaje. El **bloque literal** que va en la tercera posición es $A \oplus t_1$; lo que él nombra es el efecto de ese bloque: el $\oplus t_1$ borra el estado y deja $A$ pelado en la entrada de $F$.)*
>
> Y la moraleja del docente (cue pt1 732): *"al evaluar el mensaje sólo de $A$ y el de $A \Vert B$, lo que hice fue **recuperar esos estados internos** que se pierden."*

### Extensiones seguras para mensajes arbitrarios

**Filmina 20** — tres arreglos estándar, cada uno atacando la causa del fallo:

| Extensión | Idea | Qué arregla |
|---|---|---|
| $\mathsf{Mac}_k(m)$ con $k' = F_k(\lvert m\rvert)$ y $t_i = F_{k'}(t_{i-1} \oplus m_i)$ | derivar una **clave distinta por longitud** | los mensajes de cada longitud se procesan con una clave independiente, así que el estado robado de una longitud no sirve en otra |
| $m' = \lvert m\rvert \Vert m$, $\mathsf{Mac}_k(m) = \mathsf{CBC\text{-}MAC}_k(m')$ | **prefijar la longitud** | los mensajes largos ya no extienden a los cortos |
| dos claves: $t' = \mathsf{CBC\text{-}MAC}_{k_1}(m)$, $t = F_{k_2}(t')$ | **último bloque con otra clave** | el ataque necesita $F_{k_2}$, que no está expuesta |

### El sufijo no sirve: la tarea que dejó la clase

**Filmina 21.** *"Utilizar la longitud del mensaje como sufijo NO es seguro"*: $m' = m \Vert \lvert m\rvert$. El slide da el esqueleto del ataque — bloques `AAA`, `BBB`, un mensaje intermedio `AAA3CC`, el bloque $X = t_1 \oplus t_2 \oplus C$ y el par forjado $(\mathsf{BBB3XC},\, t_3)$, donde `BBB3XC` es el **mensaje** y $t_3$ la etiqueta — y lo deja a medio armar:

> [!quote]- De la transcripción — las dos "tareas" (cues pt1 773, 785)
> *"**Se los dejo de tarea** para que lo miren, pero si nosotros utilizásemos una construcción que utiliza [el sufijo]…"*
> *"**Se los dejo de tarea**, pero si lo desarrollan como desarrollamos el anterior, van a ver que da."*

Pero entre esas dos frases el docente **sí dio el esqueleto en voz** (cues pt1 774-784): tres bloques más la codificación de la longitud, un segundo mensaje de la misma longitud, un tercero que arranca con el **primer mensaje ya transformado** como prefijo —`AAA` con el `3` adentro— y sufijo agregado, y después la compensación del bloque del medio con los estados intermedios ya conocidos, para que la etiqueta del mensaje construido **coincida con la del mensaje 3**. Es la misma técnica del ataque de prefijos, abusando esta vez de la **cantidad de bloques**: la longitud, al ir al final, ya no distingue mensajes que arrancan igual.

> [!quote]- De la transcripción — el esqueleto del ataque al sufijo, dicho en voz (cues pt1 774-784)
> *"Si se los tengo que contar en pocas palabras: podemos hacer la misma idea **abusándonos de la cantidad de bloques**. Fíjense, puedo crear un mensaje que tenga 3 bloques; entonces se va a calcular el MAC de este mensaje, una suerte de $A$ y la codificación de la longitud, 3. Un segundo mensaje de la misma longitud (…) [y] un tercer mensaje —y acá viene el truco, si quieren— **que tenga como prefijo no el primer mensaje: el primer mensaje transformado**, o sea, fíjense, el $AA$ con el 3; y después tenga alguna estructura que va a ser un mensaje más largo, va a tener sufijo agregado. A partir de esto se puede construir un mensaje que parta del mensaje 2 y haga esta misma idea que hicimos con el mensaje 3: usamos el mensaje de prefijo más el número, y **podemos compensar la primera letra del medio utilizando los valores que tenemos de intermedios**, para generar una etiqueta que sea válida, que [matchee] la etiqueta del mensaje 3. Es más sofisticado; el ataque es más difícil de pensarlo."*
>
> *(El cue pt1 784 transcribe "que manchega": es **"que matchee"**, coincida. Corrección nuestra.)*

Es decir: **lo que quedó de tarea es el desarrollo algebraico, no la idea.** El bosquejo está en la grabación; lo que falta —los seis bloques concretos, la cuenta de los estados y la verificación paso a paso— lo desarrolla la wiki en [[cbc-mac#Por qué la longitud como sufijo no sirve|CBC-MAC § Por qué la longitud como sufijo no sirve]].

El docente además le pone nombre a la familia (cues pt1 786-789): son **extension attacks**, y aparecen en *"casi todas las construcciones criptográficas que van procesando por bloque"*. De ahí la regla práctica con la que cierra: la longitud —o cualquier modificación de este tipo— va **en la clave o al principio del mensaje**, nunca al final.

→ Conceptos: **[[cbc-mac|CBC-MAC]]** · **[[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]]** · **[[modos-de-encadenamiento|Modos de encadenamiento]]**

---

## 11. Cierre de la primera sesión

Los últimos minutos de la grabación (cues pt1 844-873) son la verificación del tercer MAC del [[#9. Ejercicio: tres MACs candidatos|ejercicio]] y un cierre seco: *"[¿]Alguna otra duda? ¿Alguna otra pregunta?"* (cue pt1 873).

- **No hay anuncios sobre el parcial**: la transcripción no registra ninguna mención. Es el primer jueves de teoría del cuatrimestre en el que el docente no marca nada de cara al 24/09.
- **La única tarea que dejó esta sesión** es el [[#10. Cómo construir un MAC: CBC-MAC|ataque al sufijo del CBC-MAC]] de la filmina 21 (cues pt1 773, 785): el docente dio el esqueleto en voz y dejó el desarrollo algebraico. La [[bibliografia|lectura del capítulo 4]] de Katz & Lindell **no es de esta sesión**: está en la filmina 41, que esta jornada no llegó a proyectar — la transcripción del 27/08 no menciona en ningún cue las palabras *libro*, *capítulo*, *Katz* ni *Lindell*. Se encargó **la sesión siguiente**, y esa vez sí en voz (cue pt2 907, ver la [[#25. Cierre: la integridad implícita y la bibliografía|§25]]).
- **El lunes 31/08** deja dos cosas: la continuación de la [[guia-02-criptografia-simetrica|Guía 2]] y la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]], que **se adelanta a la segunda mitad de esta teoría** — cubre hash, `NMAC`, `HMAC` y cifrado autenticado tres días antes que el 03/09, y trae en su Anexo la resolución de la cátedra del ataque al sufijo que hoy quedó de tarea. La práctica escrita, la [[guia-03-mac-y-funciones-de-hash|Guía 3]], llega el 07/09: su enunciado ya está en `raw/guias/guia3/` y está ingerida, con sus [[guia-03-resolucion|seis ejercicios resueltos]].

---

## 12. La segunda sesión: cómo retoma el 03/09

> **La sesión del 03/09 no arranca en la filmina 22: arranca con doce minutos de repaso hablado de las filminas 13 a 21.** Y ese repaso no es relleno — es donde se dice qué es integridad, cuánto vale $2^{128}$ y de qué tamaño son en la práctica las etiquetas y las claves de un MAC. Nada de eso está en el PDF.

El corte es medible al cue. El material nuevo empieza en el **cue pt2 96, a las 00:11:39**, cuando el docente anuncia el pase *"a los primos hermanos de los MAC"*. Antes de ese punto no hay una sola mención de hash, colisión ni preimagen en toda la grabación. Lo que hay antes es esto:

| Cues 03/09 | Filminas | Qué hace |
|---|---|---|
| 1-21 | repasa la 13, sin proyectarla | Retoma la [[#3. Un nuevo tipo de ataque: la base de sueldos\|base de sueldos]] del 27/08 y define **integridad** |
| 22-37 | **14**, reproyectada | La terna $\mathsf{Gen}$ / $\mathsf{Mac}$ / $\mathsf{Vrfy}$ y la etiqueta que no reconstruye el mensaje |
| 38-63 | **15**, reproyectada | `Mac-Forge`, las pruebas *"por el negativo"* y las tres combinaciones que la infalsificabilidad descarta |
| 64-88 | 15 o 16 (incierto) | **Fuerza bruta sobre etiquetas**, $2^{128}$ y los tamaños reales de etiqueta y clave |
| 89-95 | 17 a 21, **sólo de palabra** | Cierre verbal del bloque de `CBC-MAC`; transición a las funciones de hash |

El docente declara el repaso como tal en el cue pt2 24 — *"esto es repaso, ¿no? Pero para irlo, seguirlo fijando"* — y de las filminas 17 a 21 sólo enumera de corrido lo ya visto: los MAC de juguete, la construcción a partir de una función pseudoaleatoria y los ataques al `CBC-MAC`. **No vuelve a proyectarlas.**

**Integridad tiene dos definiciones, y la cátedra se queda con la segunda.** La *ingenua* habla de **controlar** la modificación de la información, y es impracticable: controlar exige dominar toda la cadena donde la información se genera, se almacena y se consume, cosa que casi nadie puede hacer. La *práctica* —la que usa la materia— habla de **detectar** esas modificaciones. Y el encuadre que va con ella: la confidencialidad se asocia a **ocultar**; la integridad se asocia a **confiar** — confiar en que la información fue emitida por quien dice, en que no fue modificada, y en que su calidad alcanza para tomar decisiones sobre ella. Ninguna filmina define integridad: la 13 sólo dice *"Requiere control de integridad / Consiste en identificar adulteraciones"*.

> [!quote]- De la transcripción — la retoma del 27/08 y las dos definiciones de integridad (cues pt2 1-21)
> La apertura, que es la evidencia dura de que esta grabación es la **segunda sesión de la Clase 3** y no la Clase 4 (cues pt2 1-4): *"Bien, la clase pasada habíamos empezado a ver otro campo de la criptografía que no tenía que ver tanto con confidencialidad, porque atacaba otro tipo de problemas. Si se acuerdan, hablamos de este problema de **alguien modificando una base de datos** que, por más que la información estaba cifrada, hacía cosas que no nos parecían que estuvieran buenas desde un punto de vista de seguridad; y habíamos entrado en que todo lo que habíamos visto hasta ese momento no alcanzaba para resolver eso."*
>
> Las dos definiciones (cues pt2 13-16): *"Una definición por ahí más ingenua de integridad habla de **controlar** la modificación de la información. Pero en realidad el controlar suele ser muy difícil, porque implica controlar toda la cadena que se va formando en el lugar donde se genera, se almacena y se consume la información. Entonces, en términos prácticos, rara vez uno puede controlar toda esa cadena. La integridad tiene que ver más, en un sentido práctico, con **detectar** esas modificaciones no autorizadas. Lo vamos a revisitar después, cuando veamos ya seguridad en aplicaciones, en sistemas."*
>
> Y el encuadre (cues pt2 18-21): *"La confidencialidad está asociada con **ocultar** información. La integridad está asociada al criterio de **confianza**. La integridad nos da la capacidad de confiar en que la información fue emitida por alguien, o en que la información que estamos leyendo no fue modificada, o en que la calidad de la información se puede utilizar para tomar otras decisiones."*

**La fuerza bruta también existe contra un MAC, y la defensa es la misma que en cifrado.** El docente lo marca dos veces como *"súper importante"* (cue pt2 65): alguien con suerte podría acertar una etiqueta válida, y alguien probando sin parar podría encontrar una. No hay nada que lo impida — lo que hay es un espacio de etiquetas y de claves lo bastante grande como para que la probabilidad sea despreciable. Es exactamente el argumento de la [[clase-02-cifrado|Clase 02]], trasladado del espacio de claves al espacio de etiquetas.

Y de ahí salen los **dos únicos números concretos de parámetros de MAC de toda la clase**, que ninguna filmina trae: etiquetas de **128 a 256 bits** y claves de **128 a 256 bits**.

> [!quote]- De la transcripción — la escala de 2 elevado a la 128 y los tamaños reales de un MAC (cues pt2 76-88)
> La analogía (cues pt2 76-80): *"Se acuerdan que con criptosistemas, cerca del final de la clase, vimos algunas probabilidades. Pero a esta altura ya nos damos cuenta de que si la cantidad de etiquetas es más de **2 a la [128]**, en principio ya pasamos la cantidad de **átomos del universo**, la cantidad de **segundos desde el Big Bang**. Así que valen todas las analogías que quieran: si cada [átomo] fuese una computadora completa que puede calcular una etiqueta por segundo, estamos cubiertos de alguna manera en esos escenarios."*
>
> Los números (cues pt2 84-88): *"Para que tengan de referencia: un MAC suele tener etiquetas de **128 a 256 [bits]**, los más usados, y claves de **128 a [256] [bits]**. Entonces estamos, si quieren, en escenarios parecidos en la tolerancia a tener mala suerte —o a que alguien nos ataque por fuerza bruta— que con los criptosistemas."*
>
> *(Tres correcciones nuestras entre corchetes. El ASR transcribe "2 a la 100, 28" por $2^{128}$, "tomo" por átomo, y —las dos que más importan— **"Byte" donde el docente dice bits** y **"156" donde dice 256**. Con la lectura literal del ASR los números quedarían ocho veces más grandes y con un valor que no corresponde a ninguna primitiva real.)*

→ Conceptos: **[[message-authentication-code|Message Authentication Code]]** · **[[seguridad-de-un-mac|Seguridad de un MAC]]** · **[[ataque-de-fuerza-bruta|Ataque de fuerza bruta]]**

---

## 13. Funciones de hash

> **Filminas 22 y 23.** *"Son pares de algoritmos: $\mathsf{Gen}: s \leftarrow S$ y $\mathsf{Hash}: h = H_s(m) \in \{0,1\}^{L}$. Diferencia importante: **$s$ no es una clave, simplemente es un selector**. En muchas implementaciones $S = \{s_0\}$. Se las llama funciones de resumen. **Análogas a los MACs, pero sin clave.**"*

La caracterización que da el docente al presentarlas ordena todo lo que sigue: las funciones de hash son **los primos hermanos de los MAC**, todavía dentro del campo de la integridad, y son **la primera construcción criptográfica de la materia que no tiene clave**. La ausencia de clave no es un detalle de la firma: es la diferencia estructural de la que salen las tres propiedades de la [[#14. Colisiones y las tres resistencias|§14]] y el motivo por el que un hash, solo, no autentica nada.

> [!quote]- De la transcripción — el cierre del repaso y el salto a las funciones de hash (cues pt2 89-98)
> El inventario de lo ya visto (cues pt2 89-93): *"Habíamos visto algunas construcciones de [MAC] de juguete, pero para entender algunas propiedades. Vimos sí una forma de construir un [MAC] no desde cero, sino a través de una **función pseudoaleatoria**, que era el corazón de los criptosistemas de bloque que habíamos visto. Entonces podemos reciclar estructuras que ya se desarrollaron en otra parte de la criptografía. Vimos algunos ataques, un poquito fáciles, un poquito más sofisticados, sobre (…) la construcción `CBC-MAC`."*
>
> Y el salto, que es el arranque exacto del material nuevo — **cue pt2 96, 00:11:39** (cues pt2 94-98): *"Y ahora es momento de pasar, todavía dentro del campo de integridad, a **los primos hermanos de los MAC**, que son las funciones de hash criptográficas. Las funciones de hash criptográficas tienen una gran, gran diferencia respecto de todo lo que vimos hasta ahora: son **la primera construcción criptográfica que vemos en la cual no va a haber clave involucrada**."*
>
> *(El cue 93 dice "sobre las funciones de [hash] y la construcción `CBC-MAC`". En ese punto de la clase las funciones de hash todavía no se habían visto, así que lo más probable es que el docente haya dicho "sobre las funciones de MAC". Se cita cortado para no atribuirle una afirmación que la cronología desmiente.)*

**El selector $s$ contesta una pregunta que el vault tenía abierta.** La filmina 22 afirma que $s$ no es una clave sino un selector, y no dice por qué; [[funciones-de-hash-criptograficas#El selector no es una clave|03.06]] registraba el hueco. El docente lo contesta con una regla que vale para toda la materia: **en criptografía, decir "clave" significa que el adversario no la conoce**. Nunca se garantiza seguridad en un escenario donde el atacante conoce la clave — *"eso es game over"*. El selector, en cambio, es **información pública**: el adversario lo recibe. Por lo tanto no puede ser una clave, aunque la firma de $\mathsf{Gen}$ se le parezca.

Queda pendiente la otra mitad de la pregunta —para qué sirve entonces el paso de selección—, y el docente la promete explícitamente en el cue pt2 115. La cumple veinte minutos después, en la [[#15. La prueba Hash-Coll|§15]].

> [!quote]- De la transcripción — por qué el selector no es una clave, y qué es una familia en la práctica (cues pt2 107-116)
> *"Esta construcción podría engañarnos un poco y hacernos pensar: bueno, pero esto es muy parecido a la función de generación de claves, sólo que le llamo $s$ en vez de $k$. Acuérdense siempre de que en criptografía, cuando hablamos de claves, es un modelo mental en el cual el algoritmo atacante, el adversario, **no conoce la clave**. Nunca garantizamos seguridad en un escenario donde el atacante conoce la clave: eso es game over, se acabó. Esta función de selección es **información pública**. No, no es una clave."*
>
> Y la advertencia terminológica (cues pt2 111-116): *"Ahora, ésta es la teoría, y esto se usa más que nada para demostraciones. En la práctica es muy probable que el conjunto de posibles algoritmos **tenga un solo elemento**: pasa en muchas de las funciones que se utilizan hoy día. Cuando veamos las pruebas de seguridad les cuento por qué está esta transformación y qué caso quiere modelar. Pero en la práctica van a ver que, más que familias de funciones de hash que se seleccionen, hay funciones de hash con **distintos parámetros**. Es más: se habla de familias de funciones de hash, pero con otro sentido que el sentido formal."*

**El efecto avalancha, antes de tener nombre formal.** La filmina 23 es un diagrama mudo —*"Etiquetadores universales"*, cinco mensajes entrando a una caja y saliendo como digests— y sin la voz no dice qué está comparando. La voz lo dice: para que una función de hash sea segura tiene que **tomar en cuenta todo el mensaje**, y cualquier cambio menor en la entrada debe producir *"una avalancha de cambios impredecibles"* en la etiqueta. Los cinco renglones de la figura son exactamente eso: un mensaje corto contra uno largo (**la longitud de la entrada no afecta la longitud de la salida**), después `over → ouer` (**un símbolo cambiado**), `over → oevr` (**dos símbolos permutados**) y `over → oer` (**la mezcla de ambas cosas**). Las tres etiquetas cambian por completo y de manera distinta.

![Filmina 23 — etiquetadores universales](../../assets/clase03-hash-etiquetadores.png)

Y el argumento de por qué el ejemplo se hace con hash y no con MAC: en un MAC uno podría atribuirle **a la clave** buena parte de la dispersión; acá no hay clave, así que el fenómeno se ve directo.

> [!quote]- De la transcripción — el efecto avalancha y la procedencia del gráfico de la filmina 23 (cues pt2 124-140)
> La propiedad, enunciada antes de formalizarla (cues pt2 124-129): *"Si bien todavía no vimos la prueba de seguridad de las funciones de hash, tiene que ver con que de alguna manera cumplen muchas de las propiedades que tienen los MAC: el resultado de pasar por una función de hash, para que sea seguro en el criterio que vamos a ver, tiene que **tomar en cuenta todo el mensaje**, y tiene que ser susceptible a que cualquier cambio menor en el mensaje genere **una avalancha de cambios impredecibles** en las etiquetas."*
>
> La procedencia (cues pt2 130-132): *"Acá hay un ejemplo que, si no me acuerdo mal, lo saqué de Wikipedia hace mucho, de cinco mensajes pasados por la misma función de hash, que no importa —es [MD5], es anecdótico—. Fíjense que no importa la longitud del mensaje: las etiquetas suelen tener una longitud fija."*
>
> La lectura del gráfico (cues pt2 135-140): *"Fíjense qué pasa cuando tomamos un mensaje y le cambiamos simplemente **un símbolo**: cambió totalmente. ¿Y qué pasa si tomamos el mensaje original y damos vuelta **dos símbolos**? Volvió a cambiar radicalmente. Y si queremos **una mezcla de los dos**, cambió radicalmente todavía de otra manera, medio impredecible. Esta misma estructura se ve también con los MAC, con una clave; pero acá, que no hay clave involucrada, es más directo ver este resultado, porque en los MAC uno le puede atribuir gran parte de esta dispersión a la clave. Las funciones de hash, no."*

> **La función de la figura no es `MD5`** *(precisión nuestra).* El docente dice que sí, y él mismo relativiza —*"no importa, es anecdótico"*—, pero los digests del diagrama tienen **40 dígitos hexadecimales, o sea 160 bits**, que es el tamaño de `SHA-1` y no el de `MD5`. Y tampoco son hashes reales de esas cadenas: `MD5("Fox")` vale `de7b8fdc57c8a948bc0cf52b31b617f3`, mientras que la filmina muestra `DFCD 3454 BBEA 788A 751A 696C 24D9 7009 CA99 2D17`. Son los valores ilustrativos de la figura original de Wikipedia. No cambia nada de lo que la filmina enseña; sí conviene no memorizar la atribución.

### El origen del nombre: las tablas de hash

Veinte cues sin ninguna filmina detrás, y una de las mejores explicaciones de la jornada — porque no la da el docente, la pide. Pregunta por qué estas funciones se llaman *de hash* y manda a la clase a recordar las **tablas de búsqueda por hash** de Estructuras de Datos y Algoritmos. Contesta **Tomás Pietravallo**, y entre los dos arman el puente completo:

1. **Se genera un código a partir del elemento** — por ejemplo, multiplicando cada carácter por un primo y sumando.
2. **Ese código se lleva módulo la capacidad del vector**, y lo que se busca es que la salida quede **uniformemente distribuida** sobre los buckets.
3. Con eso, la búsqueda cuesta **tiempo aproximadamente constante**.
4. Pero la función está **definida a priori** y las entradas son **dinámicas**: hay una cantidad finita de espacios y una cantidad de elementos que no se controla. Si entran más elementos que espacios, **dos van a caer en el mismo bucket**, y a eso se lo llama **colisión**.
5. Y ahí está el motivo de la uniformidad: si todo cae en el mismo bucket, la estructura **degenera en una búsqueda lineal** y se pierde la ventaja entera.

Los cuatro elementos que la clase va a necesitar en la [[#14. Colisiones y las tres resistencias|§14]] —dominio grande contra codominio finito, colisión inevitable, dispersión buscada, degradación cuando falla— ya están todos acá, dichos en el vocabulario de una materia anterior. La diferencia con el caso criptográfico no es estructural sino de exigencia: en una tabla de hash la colisión es un **costo**; en criptografía es un **ataque**.

> [!quote]- De la transcripción — las tablas de hash explicadas por la clase (cues pt2 141-162)
> La pregunta y la primera respuesta (cues pt2 141-146). **Pablo Abad:** *"¿Por qué se las llama funciones de hash? ¿Se acuerdan cuando vieron Estructuras y Algoritmos, las tablas de búsqueda de hash? ¿Alguien se anima a contar más o menos cuál es la idea de cómo funcionan esas tablas de búsqueda?"* — **Tomás Pietravallo:** *"Intenta generar un código único a partir del elemento. Por ejemplo, si tienes texto, quizás vas multiplicando cada carácter por un primo y lo sumas, o haces alguna transformación. Así, más o menos sabes que te da uniforme en el espacio módulo, por ejemplo, la capacidad de tu vector. Y eso me permite hacer [lookups] en más o menos tiempo constante."*
>
> La segunda pregunta y el cierre (cues pt2 154-162). **Pablo Abad:** *"El que habló mencionó una distribución uniforme, y eso está bueno. ¿Y por qué se busca una distribución uniforme?"* — **Tomás Pietravallo:** *"Para intentar que no caiga todo en el mismo [bucket], porque, depende del algoritmo que uses, cuando tenés colisiones vas a terminar igual haciendo una búsqueda lineal."* — **Pablo Abad:** *"Ahí va. Perfecto. (…) La función que transforma la información en número de [bucket] la definimos a priori, y probablemente sea parte de un programa. La entrada, los inputs que vamos a meter en la lista o en la tabla, tranquilamente son dinámicos, no están predefinidos. Y entonces hay una cantidad finita de espacios: si hay más elementos que queremos meter, seguro que va a ocurrir que dos caigan en el mismo [bucket]. Y a eso lo llamamos **colisión**."*

→ Conceptos: **[[funciones-de-hash-criptograficas|Funciones de hash criptográficas]]** — la definición, el selector y los etiquetadores universales

---

## 14. Colisiones y las tres resistencias

> **Filminas 24 a 27.** Colisión: $x \neq x'$ y $h(x) = h(x')$. *"Si hay $n+1$ mensajes y $n$ valores de salida, existe al menos una colisión."* Y las tres propiedades, cada una en su filmina: **resistencia a preimágenes** (para todo $y$, es computacionalmente imposible hallar $x$ con $h(x) = y$), **a segundas imágenes** (para todo $x$, hallar $x' \neq x$ con $h(x') = h(x)$) y **a colisiones** (hallar cualquier par $x \neq x'$ con $h(x) = h(x')$).

**Las colisiones existen y no se pueden ignorar**, y el argumento es de teoría de conjuntos: si una función mapea un conjunto de entrada mayor que el de salida, necesariamente hay elementos que caen en el mismo lugar. Como un hash criptográfico acepta mensajes de tamaño arbitrario y produce una salida finita y acotada, el antecedente se cumple siempre. La filmina 24 lo escribe como principio del palomar en una línea; la voz agrega el porqué.

> *(Matiz sobre "tamaño arbitrario", **precisión nuestra**: en los cues pt2 176-177 el docente afirma que las funciones de hash criptográficas "tienen que aceptar mensajes de tamaño arbitrario", y las filminas 30, 31 y 32 acotan la entrada de `MD5`, `SHA-1` y `SHA-3` a $2^{64}$ bits. La arbitrariedad es **práctica, no literal** —el límite es tan alto que ningún mensaje real lo alcanza—, y en el caso de `SHA-3` ni siquiera existe: la esponja no tiene bloque de longitud. Ver [[primitivas-de-hash-estandar#SHA-3|Primitivas de hash estándar]].)*

**"Computacionalmente imposible" tiene una definición, y la clase la da.** Las tres filminas usan el término sin definirlo. El docente lo define y, de paso, cuenta de dónde salió: es un término que *"prácticamente se acuñó para las funciones de hash"* y significa exactamente lo mismo que decir que la probabilidad de éxito de un adversario es **despreciable**. **No es imposibilidad absoluta**: con tiempo y cómputo infinitos se encontraría una preimagen, porque al menos una existe. Es imposibilidad para un algoritmo que corra en tiempo polinómico.

> [!quote]- De la transcripción — qué quiere decir computacionalmente imposible (cues pt2 194-201)
> *"Es **computacionalmente imposible**. Computacionalmente imposible es un término que prácticamente se acuñó para las funciones de hash cuando nacieron, pero que es exactamente lo mismo que cuando decimos que las posibilidades de que un atacante gane una prueba sean **despreciables**. O sea: no es absolutamente imposible, porque alguien con tiempo y capacidad de cómputo infinita podría probar el universo de todos los mensajes posibles y encontrar alguno —definitivamente, porque al menos uno hay—. Que sea computacionalmente imposible quiere decir que un algoritmo que corra en tiempo polinómico (…) va a tener una **probabilidad despreciable** de encontrar una [preimagen]."*
>
> *(**Precisión nuestra sobre el final de la frase.** El docente dice que el algoritmo corre "en tiempo polinómico **sobre el tamaño del conjunto de posibles etiquetas**". En las pruebas de las filminas 15 y 28 el polinomio corre sobre el **nivel de seguridad $n$**, no sobre el tamaño del espacio de salida — que es exponencial en $n$, así que las dos lecturas no son equivalentes. Ver [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]].)*

**Preimágenes es más fuerte que la unidireccionalidad del MAC.** El docente lo marca por contraste explícito: del MAC ya se sabía que no existe un "des-MAC", que la etiqueta no permite volver al mensaje. De un hash se pide **algo más**: que dada una etiqueta sea computacionalmente imposible llegar a **algún** mensaje que la produzca — no al original, a cualquiera.

**Segundas preimágenes cierra un agujero que la primera deja abierto**, y esa es la razón de que hagan falta las dos. La resistencia a preimágenes dice que nadie puede, a partir del hash publicado, recuperar el documento. **No dice nada** sobre alguien que ya **tiene** el documento original y quiere usarlo como ayuda para fabricar un segundo con la misma etiqueta. Eso lo cubre la segunda propiedad, y con ella *"se termina de cerrar el ciclo"*.

> [!quote]- De la transcripción — por qué las dos primeras propiedades son complementarias (cues pt2 235-246)
> *"Una segunda propiedad que nos va a interesar mucho se conoce como **resistencia a segundas preimágenes**. Es sutilmente distinta a la otra: en lugar de partir de una etiqueta y tratar de construir un documento, nos garantiza que, **dado un documento**, es computacionalmente imposible generar un segundo documento que tenga la misma etiqueta, que tenga el mismo hash. Entre la propiedad anterior y ésta se termina de cerrar el ciclo, porque ésta nos garantiza que **el que tenía el documento original no puede usar ese documento original como ayuda** para generar un segundo. La primera propiedad no dice nada de eso: nos dice que nadie puede, a partir del hash que se publica, recuperar el documento o un documento parecido."*

**Lo que separa segundas preimágenes de colisiones son los grados de libertad**, y el docente hace que lo verbalice la clase. Contesta **Emilio José Mitchell** (cue pt2 259) con la frase exacta: en una hay **un $x$ fijo**, en la otra **se eligen los dos**. El docente lo confirma y le pone el nombre — *"en colisiones tenemos un grado más de libertad"* —, y esa es toda la explicación de por qué atacar colisiones sale más barato, que la [[#18. Seguridad de las funciones de hash|§18]] va a convertir en un exponente.

La cuenta ya está dicha acá, media hora antes de que la filmina 34 la nombre. Contra **segundas preimágenes** hay un $x$ fijo: se generan documentos y cada uno se compara contra **una** etiqueta. Contra **colisiones** no: se genera el primero, el segundo se compara contra el primero, **el tercero contra dos**, **el cuarto contra tres**, y así. Cada mensaje nuevo aprovecha todo el trabajo anterior. Y el docente agrega la observación de ingeniería que suele faltar: ese problema **se paraleliza bien con cómputo distribuido**, así que no se vuelve intratable por el hecho de tener que guardar y comparar muchas etiquetas.

> [!quote]- De la transcripción — los grados de libertad y por qué las colisiones salen más baratas (cues pt2 254-277)
> La pregunta y la respuesta del alumno (cues pt2 254-264). **Pablo Abad:** *"¿Cuál es la diferencia, a ver si a alguien se le ocurre, entre esta propiedad y las segundas preimágenes? Porque son muy parecidas. Segundas preimágenes dice: para todo $x$ es computacionalmente imposible hallar un $x'$ distinto tal que $H(x') = H(x)$. Resistencia a colisiones dice: es computacionalmente imposible hallar $x$, $x'$ tal que $x$ es distinto de $x'$ y $H(x) = H(x')$."* — **Emilio José Mitchell:** *"En uno tienes un $x$ fijo y en el otro elegís tanto $x$ como [$x'$]."* — **Pablo Abad:** *"Muy bien. Correcto. (…) En segundas [preimágenes] nosotros partimos de un documento que ya existe, $x$, y nuestro objetivo es encontrar un segundo. En colisiones tenemos **un grado más de libertad**: tenemos que inventarnos dos documentos."*
>
> El costo comparado (cues pt2 265-277): *"¿Y eso por qué es importante? Lo vamos a ver en unos minutos, cuando pensemos en el modelo de seguridad y los ataques por fuerza bruta. A falta de un ataque más inteligente, un ataque por fuerza bruta acá sería: yo tengo $x$ y empiezo a generar un documento al azar, ¿el hash es igual? No; otro documento, ¿el hash es igual? No; hasta encontrarlo. En la función colisión yo puedo hacer algo un poco más inteligente: genero el primer documento, genero el segundo, ¿las etiquetas coinciden? No; genero un tercero, pero ahora puedo comparar la etiqueta del tercero **contra las dos** que generé; y cuando genero el cuarto, comparo **contra las tres**; y el quinto contra las cuatro, y así sucesivamente. (…) Es un problema que sabemos [atacar] muy eficientemente con **cómputo distribuido**. No es que se vuelve intratable."*

### Prueba de existencia: el commitment

**Contenido entero de la voz: no hay ninguna filmina detrás, y el vault no lo tenía.** De la resistencia a preimágenes el docente deriva un servicio con nombre propio — lo llama **prueba de existencia** y aclara que en inglés se llama **commitment** —: **demostrar que algo existe sin revelar qué es**. Se publica el hash del documento ahora y se muestra el documento después; como los hashes son **determinísticos**, cualquiera puede recalcular y verificar que el documento exhibido es el que estaba comprometido. Dice además que *"se usa mucho en protocolos"*, cuando hay que combinar varias piezas criptográficas.

Los dos ejemplos que da tienen amenazas distintas, y por eso vale la pena tener los dos:

| Ejemplo | Qué se compromete | De quién protege |
|---|---|---|
| **La apuesta** | El resultado de un evento **ya ocurrido y ya escrito**, sobre el que alguien va a apostar | Del que sostiene el resultado: sin compromiso previo hay *"dos sobres"* y le muestran al apostador el que le convenga |
| **La patente bajo secreto** | La documentación de una invención con fórmula secreta —*"las píldoras de la inmortalidad"*— que no se puede publicar porque un competidor la reproduciría | **Del propio custodio**: el riesgo es que el depositario esté de acuerdo con el dueño y le permita actualizar el documento cuando aparezca una disputa |

El segundo es el interesante, porque la amenaza no viene de afuera del sistema sino de adentro: **el que guarda el secreto es el sospechoso**. Depositar el hash junto con la patente permite demostrar después que ese documento existía en esa fecha y que no fue modificado.

> [!quote]- De la transcripción — la apuesta, los dos sobres y las patentes bajo secreto (cues pt2 206-234)
> El servicio y el primer ejemplo (cues pt2 206-221): *"Piensen un poco ya en los usos que abre esto, porque abre un tipo de servicio que se llama **prueba de existencia**, donde yo puedo **demostrar que algo existe sin revelar ese algo**. Supongan que hay un resultado de un evento que **ya está escrito** en algún lado y alguien va a hacer una apuesta sobre eso. Como el evento ya existe, el que va a hacer la apuesta lo que no va a querer es que lo estafen: en el momento le van a decir "el evento dio esto", pero uno tendría desconfianza de que haya **dos sobres**, que yo apueste a uno y me saquen el sobre que dice lo otro. Entonces podría demostrar que el resultado del evento está escrito **revelando la etiqueta de ese mensaje** y, llegado el momento final, mostrando el documento. ¿Por qué? Porque es fácil, con el documento, calcular y ver que [matchea] la etiqueta; si le aplico el hash de vuelta, **los hash son determinísticos**."*
>
> El segundo ejemplo y el nombre (cues pt2 222-234): *"Otro ejemplo tiene que ver con una versión digital de los sistemas de propiedad intelectual, de patentes. Algunas son muy sensibles: es información que, si cayese en manos de un competidor, le haría trivial reproducirla —por ejemplo en la industria de medicamentos—. Entonces las patentes de ese tipo se guardan bajo secreto. El problema de guardarlas bajo secreto es que **hay que confiar en que el que las guarda no está arreglado con el dueño de la patente**, y que si hay una disputa no le va a dejar actualizar ese documento con lo que le convenga. Uno podría abrir una patente de, no sé, **las píldoras de la inmortalidad**, como patente cerrada, y el día que alguien consigue la información y la mete en un sobre, decir "yo lo tenía antes, tengo todos los derechos". Es un caso medio exagerado, pero para ese tipo de patentamiento con fórmula secreta uno podría, junto con la patente, dejar [asentado] un hash de la documentación, lo que permitiría, si en el futuro hay una disputa, **demostrar que cuando se patentó existía el documento y que no fue modificado**. (…) Estas pruebas de existencia —o **commitment**, se llaman también— se usan mucho en protocolos, cuando queremos construir soluciones criptográficas que tienen que combinar cosas."*

> **Un commitment necesita las dos propiedades, no una** *(precisión nuestra).* El docente presenta el commitment como aplicación de la **resistencia a preimágenes** (cue pt2 206), pero el argumento que desarrolla en el cue pt2 221 —que el que hizo el compromiso no pueda exhibir después **otro** documento que dé la misma etiqueta— es, literalmente, **resistencia a segundas preimágenes y a colisiones**. Las dos hacen falta y cubren cosas distintas: preimágenes da el **ocultamiento** (el hash publicado no revela el documento) y colisiones da la **vinculación** (el documento comprometido es el único que se puede exhibir). Sin la segunda, quien publica el hash puede prepararse dos documentos con la misma etiqueta y elegir después — que es exactamente la estafa de los dos sobres, sólo que hecha con criptografía.

→ Conceptos: **[[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]]** — las tres definiciones, la jerarquía y el commitment

---

## 15. La prueba Hash-Coll

> **Filmina 28.** *Collision resistance:* $\mathsf{Hash\text{-}Coll}_{A,H}$. Dado un nivel de seguridad $n$, un adversario $A$ y una familia de funciones de hash $H_{s(n)}$: **1)** se selecciona una función $s \leftarrow S$; **2)** $A$ obtiene acceso a $H(x) = H_s(x)$; **3)** $A$ emite $x, x'$. Gana si $x \neq x'$ y $H(x) = H(x')$. Si $\Pr[\mathsf{Hash\text{-}Coll}_{A,H} = 1] < \mathsf{negl}(n)$, la función es **libre de colisiones**.

De las varias pruebas que existen para funciones de hash —*"es todo un mundo"*—, la cátedra formaliza **una sola**, y dice por qué: la resistencia a colisiones es *"la más importante y medular para el uso cotidiano"*. La justificación completa de esa elección no está acá sino en la [[#18. Seguridad de las funciones de hash|§18]], donde el docente vuelve sobre el tema para acotar en qué régimen es legítima.

**Y acá se contesta para qué está el paso 1.** Es la promesa del cue pt2 115, cumplida: el paso de selección **existe para prohibirle memoria al adversario**. Si hubiera una única función fija y alguien le encontrara alguna vez una colisión, existiría un adversario trivial que gana siempre — uno que tiene esa colisión **hardcodeada** y la emite sin hacer ninguna cuenta. Formalizar con una familia y sortear la función al principio de la prueba **cierra esa puerta**: el adversario recibe la función y recién entonces empieza a trabajar, sin poder traer nada precalculado. Que en la práctica la familia tenga un solo elemento no debilita el argumento, porque lo que se está modelando es el orden temporal, no la cardinalidad.

Es, además, una distinción que conviene tener clara antes del parcial: **el selector no aporta secreto** —es público, [[#13. Funciones de hash|§13]]— **pero sí aporta frescura**. Es la misma función que cumple un [[cifrado-probabilistico-nonce-e-iv|nonce]]: no esconde nada, evita reusar trabajo viejo.

> [!quote]- De la transcripción — el recorrido de Hash-Coll y para qué sirve el paso de selección (cues pt2 278-303)
> La prueba y por qué es la elegida (cues pt2 278-293): *"Si queremos pasar de la informalidad a una definición más formal: hay varias pruebas de seguridad respecto de las funciones de hash, y es todo un mundo. Nos vamos a centrar en la **más importante y medular para el uso cotidiano**, que es casualmente la resistencia a colisiones. Como todas las pruebas de seguridad, se realiza como una prueba estadística con unos pasos a seguir entre una función de hash y un algoritmo adversario, y los pasos son muy pocos, bastante simples: se **selecciona una función dentro de la familia**; se le da acceso al atacante a esa función en particular; y se le pide que emita **dos mensajes**. Si el hash de esos dos mensajes es igual, el adversario gana la prueba; si no, perdió. Si la probabilidad de que el adversario gane es despreciable, se dice que la función es **libre de colisiones**."*
>
> El porqué del paso 1 (cues pt2 294-303): *"Acá es donde aparece la formalidad de la selección de funciones. ¿Qué quiere decir esto? El paso uno nos dice de alguna manera que **no vale que el algoritmo $A$ precompute una colisión antes de que siquiera empiece la prueba**. Porque la realidad es que si yo tengo una sola función de hash y algún día le encuentro una colisión, una forma trivial de ganar sería **hardcodearle esa colisión** y que emita siempre esa colisión. La estructura de esta prueba está pensada para que acá no pueda tener memoria en ese sentido. Entonces, incluso cuando en la práctica las familias suelen ser una sola función, la estructura formal tiene esa selección para dejar claro eso: **el adversario obtiene la función y a partir de ahí empieza a trabajar sobre la función que obtiene. No puede traer información [precalculada]**."*

> **Sobre "libre de colisiones".** Es el vocabulario que la cátedra usa de forma consistente —filmina 28 y cues pt2 293, 589 y 620—, no un desliz de una lámina. Vale la aclaración terminológica igual: **ninguna función de hash está libre de colisiones**, porque la [[#14. Colisiones y las tres resistencias|§14]] acaba de demostrar que existen siempre. Lo que la prueba mide es que sean **computacionalmente inhallables**. La bibliografía suele decir *collision-resistant* justamente por eso. Cuando el enunciado de un parcial diga "libre de colisiones", hay que leer "resistente a colisiones".

→ Conceptos: **[[resistencias-de-una-funcion-de-hash#El juego Hash-Coll|Resistencias de una función de hash]]** · **[[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]]**

---

## 16. La construcción de Merkle-Damgård

> **Filmina 29.** *Modelo general iterativo.* *"Propuesto por Merkle en 1989. Utilizado por muchas funciones. **Preprocesamiento**: ajustar el tamaño del mensaje, agregar bloque con tamaño. **Función de compresión**: similar al hash pero opera sobre bloques pequeños. **La seguridad está dada por la función de compresión.**"*

![Filmina 29 — modelo general iterativo de Merkle-Damgård](../../assets/clase03-merkle-damgard.png)

**La motivación es exactamente la misma que la de los cifradores de bloque, y el docente lo dice de frente: son contemporáneos.** Hacia 1989 se buscaban formas **sistemáticas** de construir funciones de hash, de manera de poder **reutilizar las demostraciones** en vez de empezar de cero con cada función nueva. La receta es la que la [[clase-02-cifrado|Clase 02]] ya había usado dos veces: se aísla una pieza chica, **de entrada y salida de tamaño fijo y conocido**, sobre la que las demostraciones son manejables —acá la **función de compresión**, allá la primitiva de bloque—, y se le pone encima una construcción que la extiende a tamaño arbitrario — acá el modelo iterativo, allá los [[modos-de-encadenamiento|modos de encadenamiento]]. De ahí sale la frase de la filmina *"la seguridad está dada por la función de compresión"*: no es un comentario, es el teorema.

La filmina nombra sólo a Merkle; el nombre completo del modelo y el segundo autor —**Damgård**— vienen de la voz.

> [!quote]- De la transcripción — el origen del modelo iterativo y el paralelo con los cifradores de bloque (cues pt2 306-317)
> *"En 1989, más o menos, un investigador de IBM, y después complementado por otro investigador que se llama [Damgård], estaban buscando **formas sistemáticas de construir funciones de hash** de tal forma que se puedan aprovechar, como ocurrió con las funciones de bloque, muchos aspectos de las demostraciones, y **no haya que empezar desde cero con cada función**. Y plantean una construcción general que se conoce como **modelo general iterativo de [Merkle-Damgård]**: una forma general de construir una función de hash criptográfica que procesa mensajes de tamaño arbitrario a partir de una función mucho más simple, que se llama **función de compresión**, a la que le vamos a pedir prácticamente las mismas propiedades que a la función de hash, pero que opera sobre bloques pequeños y de tamaño fijo. **Es contemporáneo**, y por eso el parecido en cuanto a la idea con el desarrollo de los criptosistemas de bloque: era tener una función más simple, especialmente más finita en el sentido de que tenga entrada y salida de tamaños conocidos y fijos, que simplifica mucho las demostraciones, y tener una construcción arriba que nos diga: **si vos conseguiste el bloque del medio, yo te lo extiendo a tamaños arbitrarios**. Es la misma idea."*
>
> *(La atribución a **IBM** es del docente y no cierra: Ralph Merkle trabajó en Stanford, Berkeley y Xerox PARC, no en IBM. La historia de IBM es la de `DES`, que él mismo cuenta en esta materia. Ivan Damgård es danés, de Aarhus. **Precisión nuestra**, registrada también en [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]].)*

**El preprocesamiento es el padding, más la longitud — y la longitud va al final.** El docente lee el diagrama como *"el esquema del paper"* y lo mapea contra lo que la clase ya sabe: la etapa que los autores llaman de preprocesamiento es el equivalente al **padding**, y como el modelo **es iterativo**, hereda los mismos problemas de prefijos que el [[#10. Cómo construir un MAC: CBC-MAC|CBC-MAC]] de la [[#10. Cómo construir un MAC: CBC-MAC|§10]]. Por eso Merkle-Damgård agrega, además del padding, **un bloque con la longitud** — que la filmina menciona sin decir dónde va.

**Y acá está lo que el vault no sabía: el sufijo es un compromiso deliberado, no un descuido.** El docente lo dice sin vueltas —*"hoy día sabemos que agregarla al final no es lo mejor"*, y que con el conocimiento de hoy los autores la habrían puesto como **prefijo**—, pero explica qué se compra con el sufijo: **modo streaming**. Con la longitud al final se puede empezar a calcular la etiqueta de un mensaje **que todavía está llegando**, sin tenerlo completo. Con la longitud al principio hay que **tener el mensaje entero antes de empezar**.

Y la simetría que vale la pena ver: **es exactamente el mismo trade-off que en el `CBC-MAC`.** La [[#Extensiones seguras para mensajes arbitrarios|filmina 20]] da como arreglo seguro *prefijar la longitud*, $m' = \lvert m\rvert \Vert m$, y Katz y Lindell señalan de esa misma opción que tiene la desventaja de "not being able to cope with streaming data" (*Introduction to Modern Cryptography*, cap. 4, *References and Additional Reading*). Las dos construcciones —una de MAC, otra de hash— enfrentan la misma disyuntiva entre seguridad y procesamiento en línea, y la resuelven al revés. Eso no es casualidad: es la consecuencia de que las dos sean **iterativas**.

> [!quote]- De la transcripción — el padding, la herencia del CBC-MAC y el compromiso a favor del streaming (cues pt2 320-334)
> La lectura del esquema (cues pt2 320-327): *"Si miramos rápido, éste es el esquema del paper. Tiene una forma distinta, pero fíjense que es parecido a los bloques. Hay una etapa que ellos llaman **de preprocesamiento**, pero que de alguna manera es el **equivalente al padding**, con la salvedad de que este modelo **es iterativo**, y por ser iterativo comparte muchas de las similitudes y problemas del modelo que vimos de `CBC-MAC`: entonces va a tener problemas de ataques de uso de **prefijos**. Ya en el modelo de Merkle, automáticamente, además de agregar los bits de padding **se agrega la longitud del bloque al final**. Hoy día sabemos que agregarla al final no es lo mejor."*
>
> El compromiso (cues pt2 328-334): *"Creo que si [Merkle y Damgård] estuviesen rediseñando eso con el conocimiento que tenemos hoy, **hubiesen agregado la longitud como prefijo**. Dicho todo esto, agregarla como sufijo tiene una ventaja muy grande, que es que podemos trabajar en una suerte de **modo streaming**, donde podemos empezar a procesar y calcular la etiqueta de un mensaje que está llegando **sin necesidad de tenerlo completo**. Si el tamaño del bloque estuviese al principio, necesitamos tener todo el mensaje para poder calcular la etiqueta. Entonces **es un buen compromiso**."*

**El recorrido del esquema, paso a paso**, porque la filmina 29 es una imagen sin texto: padding, agregado del bloque de longitud, partición en bloques igual que para cifrar en bloque; después se itera la función $F$ tomando **un bloque más el estado anterior** y produciendo el estado siguiente, hasta consumir el mensaje entero; y la salida del último bloque **no es la etiqueta**: pasa antes por una función final **no reversible**. Y la definición operativa que explica el nombre *compresión*: la función toma $2X$ bits de entrada —un bloque más un estado— y devuelve $X$; **compacta a la mitad**.

> [!quote]- De la transcripción — el recorrido bloque a bloque y qué es una función de compresión (cues pt2 355-370)
> *"Lo que vamos a hacer acá es ir procesando bloque a bloque. Hay una función $F$: le pasamos el primer bloque y un estado inicial —el estado inicial suele ser un vector aleatorio, un vector de inicialización— y la salida es el próximo estado. Metemos el segundo bloque con el estado y sacamos el que sigue; metemos el tercer bloque con el estado que había salido, sacamos el que sigue, y así hasta consumir todo el mensaje, hasta terminar de consumir este último bloque, que tiene la longitud. A esa salida **se la transforma con una función no reversible**, que tiene que ver de vuelta con esto de **eliminar la posibilidad de que alguien tenga acceso a esos estados intermedios**, y el resultado de eso es la etiqueta."*
>
> Y el nombre (cues pt2 368-370): *"Una forma conceptual de verlas es que **toman una entrada que tiene $2X$ bits** —esto y esto— **y dan una salida que tiene $X$**: como que compacta la salida a la mitad."*

> **El estado inicial: tres versiones distintas de la misma cosa** *(precisión nuestra).* El docente dice que $z_0$ *"suele ser un vector aleatorio, un vector de inicialización"* (cues pt2 356-357); la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] escribe $z_0 = 0^{l}$ en su filmina 11; Katz y Lindell lo dan como un valor **arbitrario pero fijo**. La lectura correcta es la tercera, y las otras dos son casos suyos: el estado inicial de un hash **es una constante pública del estándar** —los valores de `MD5` y `SHA-1` están escritos en la especificación—, no algo que se sortee por mensaje. Llamarlo *IV* invita a la confusión con el [[cifrado-probabilistico-nonce-e-iv|IV de un modo de cifrado]], que sí es fresco por mensaje, y contradice de frente la regla que la propia [[#10. Cómo construir un MAC: CBC-MAC|§10]] fija para el `CBC-MAC`, donde $t_0 = 0\ldots0$ **tiene** que ser fijo.

### La pregunta de Emilio: por qué la longitud va al final

Es la pregunta que amarra esta clase con la anterior, y llega **en el momento exacto**: apenas el docente termina de decir que el sufijo no es lo óptimo y antes de recorrer el esquema. *(Por eso sus cues, 336-344, quedan entre los dos bloques citados más arriba: acá la nota agrupa por tema y no por reloj.)*

**Emilio José Mitchell** pregunta por qué se sabe hoy que poner el tamaño al final es más inseguro, y la respuesta del docente es **el ataque al `CBC-MAC` de la [[#10. Cómo construir un MAC: CBC-MAC|§10]], trasladado**: la construcción simple funciona si todos los mensajes tienen la misma longitud, pero si se permiten longitudes distintas **un mensaje puede ser prefijo de otro**, y con eso el adversario obtiene **los estados intermedios que se suponen descartados**. Conociéndolos, los puede **compensar** para forzar el valor final que quiera. El docente lo generaliza explícitamente: *"este ataque se puede trasladar a los modelos iterativos en general"* — que es la definición misma de un **extension attack**, la familia que él ya había nombrado el 27/08.

> [!quote]- De la transcripción — la pregunta de Emilio y el ataque de extensión explicado sobre el diagrama (cues pt2 336-344)
> **Emilio José Mitchell:** *"¿Porque sabemos hoy en día que es más inseguro poner al final el tamaño del bloque?"* — **Pablo Abad:** *"Es por el mismo problema que vimos cuando vimos `CBC-MAC`, que les dije: ojo que esto funciona, esta construcción simple funciona **si usamos bloques de tamaño fijo**, porque si permitimos bloques de distintos tamaños **yo puedo hacer que un bloque sea prefijo de otro**. Y con eso, en este ejemplo que estoy viendo acá, **yo tengo acceso a los estados intermedios que se supone que se descartan**. Y teniendo acceso a los estados intermedios —acá calculo un estado intermedio, acá calculo el estado final de $AB$, pero que es el estado intermedio de este otro mensaje—, **conociendo los estados intermedios yo los puedo compensar de alguna manera y hacer que el resultado final dé el valor que quiera**."*
>
> Emilio cierra: *"Okay, perfecto. Está bien. Gracias."* — y el docente: *"No, por favor, buena pregunta."*

> **La discrepancia que hay que registrar** *(precisión nuestra).* El docente cierra el punto diciendo que en Merkle-Damgård el sufijo **no es un problema de seguridad**, porque la construcción *"agrega una función de transformación al final [que] no deja salir los estados intermedios, sino que los transforma"* (cues pt2 327, 351, 362-364). El razonamiento es correcto **para el modelo con esa función final**; el problema es que **la función final no está**.
>
> - Las **dos filminas de la cátedra** que dibujan la construcción —la 29 de teoría y la 11 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]]— muestran la salida como el último estado, $z_{B+1}$, **directo**.
> - `MD5`, `SHA-1` y `SHA-2` **tampoco la tienen**: su salida es el estado interno completo, tal cual.
> - Por eso el **length extension attack es real** y no teórico: dado $H(m)$ y $\lvert m\rvert$, sin conocer $m$, se calcula $H(m \Vert \text{padding} \Vert m')$ retomando la iteración desde la etiqueta publicada.
> - Y por eso **`HMAC` es anidado** en vez de ser el $H(k \Vert m)$ ingenuo, que es exactamente lo que este ataque rompe — [[#21. HMAC: la vuelta atrás a la filmina 33|§21]].
>
> Dicho de otro modo: la función final $g$ **es** la contramedida correcta, el docente tiene razón sobre para qué está; lo que falta decir es que **las primitivas reales la instancian como la identidad**, y ahí la contramedida desaparece. `SHA-3` sí resuelve el problema, porque la esponja **trunca** el estado al emitir. El desarrollo completo está en [[construccion-de-merkle-damgard#La contra: length extension|Construcción de Merkle-Damgård § La contra: length extension]].

→ Conceptos: **[[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]]** · **[[cbc-mac|CBC-MAC]]** · **[[modos-de-encadenamiento|Modos de encadenamiento]]**

---

## 17. Las primitivas: de MD5 a SHA-3

> **Filminas 30 a 32.** `MD5`: entrada de hasta $2^{64}$ bits, salida de **128 bits**, aplicación iterativa. `SHA-1`: misma entrada, salida de **160 bits**, *"se construye sobre la base de MD5"*. `SHA-3`: salida de **224, 256, 384 o 512 bits**, *"aplicación modelo esponja"*, estandarizada por el NIST **en 2013**. Las tres traen los mismos tres ejemplos: el hash de la cadena vacía, de `"a"` y de `"abc"`.

**Casi todo lo que sigue no está en ninguna filmina.** Las tres láminas son fichas técnicas; lo que las vuelve inteligibles —por qué existió cada una, por qué murió, y por qué la que ganó ganó— es media hora de relato hablado. El arco completo:

| Año | Qué pasa | Consecuencia |
|---|---|---|
| 1992 | **`MD5`**, quinta generación de la serie **MD** (*Message Digest*) de **Ron Rivest**, sobre el modelo iterativo | *"El `DES` de las funciones de hash"*: 128 bits, la primera masiva |
| 1993 | El instituto de estándares de EE.UU. quiere un hash para uso comercial; sale **`SHA-0`**, que *"no vio la luz"* | Aparece con cambios y sin explicación: eso es **`SHA-1`** (1995), 160 bits |
| 2001-2002 | **`SHA-2`**: *"el triple `DES` de los hashes"* — tomar `SHA-1`, robustecerlo y agrandarlo, a costa de más peso y lentitud | Punto de contención para los más sensibles a seguridad |
| **2004** | Un grupo de criptógrafos y matemáticos chinos publica una **familia nueva de ataques de propósito general** y destroza `MD5` | *"Cisma y refundación del área"*; `SHA-1` queda en duda |
| hasta 2008 | Los ataques se sofistican | `MD5` **muerta**; 160 bits empiezan a sonar chicos |
| 2007-2012 | **Concurso abierto** al estilo `AES`; los pliegos piden *"el tamaño de conjuntos de `SHA-2` con la velocidad de `SHA-1`"* | Gana **Keccak**, y gana **por ser un modelo distinto** |

*(Los años de la columna izquierda **no los da la clase**: el docente ordena el relato pero sólo fecha 2004 y 2008. Las demás fechas son nuestras, y una de ellas corrige el orden que el relato sugiere — ver el recuadro al final de la sección.)*

> [!quote]- De la transcripción — MD5, el linaje MD y el criterio estricto de avalancha (cues pt2 373-392)
> El linaje (cues pt2 373-378): *"Una más conocida, histórica, que hoy día ya es un poco obsoleta: la que sería como **el `DES` de las funciones de hash**, [`MD5`]. [`MD5`] es la **quinta generación** de una serie de funciones de hash [`MD`, **Message Digest**], que es casi como "función resumen de mensaje", creadas por **[Ron Rivest]**, que es uno de los criptógrafos famosos de nuestra época. [`MD5`] sigue el modelo iterativo de [Merkle-Damgård] y tiene una función de compresión propia."*
>
> El criterio de diseño, declarado fuera de programa (cues pt2 385-392): *"Hay un criterio de diseño para evaluar las funciones de compresión —no lo vamos a ver en la materia— que se llama **criterio estricto de avalancha**, que dice que ante el cambio de un bit en cualquier [posición] de la entrada tiene que haber un **sesgo despreciable alrededor del 50 por ciento** de que cambie **cada bit** de la etiqueta. O sea: no deberíamos poder entender que un bit de la entrada hace que cambien más ciertos bits de la etiqueta que otros. La forma de ver eso es esto: hago un cambio lo más chico posible y **cambia todo**."*

El **criterio estricto de avalancha** es la versión formal de lo que la filmina 23 muestra a ojo, y explica por qué las tres láminas de primitivas repiten los mismos tres ejemplos: la cadena vacía, `"a"` y `"abc"` son entradas mínimas y casi idénticas entre sí, y sus digests no se parecen en nada.

### MD5 en las redes peer to peer

Caso completamente fuera de filmina, y la única cosa que le da contenido al título mudo *"Etiquetadores universales"* de la filmina 23. **`MD5` se hizo popular porque las primeras redes de transferencia de archivos peer to peer —eDonkey y Kademlia, precursoras de BitTorrent— lo usaron como índice universal de contenido.**

El problema que resuelve es concreto: en un sistema de archivos distribuido, **el mismo archivo vive en muchas computadoras con nombres y ubicaciones distintas**, así que buscar por nombre no funciona. El hash normaliza **un identificador único ligado al contenido y no al nombre**: se comparte una carpeta, se indexan sus archivos por su hash, y se busca y se pide **por hash**. Dos copias del mismo contenido con nombres distintos se reconocen como la misma cosa; dos archivos con el mismo nombre y contenido distinto no se confunden.

Es también el ejemplo que explica por qué una colisión no es una curiosidad académica: en un índice de contenido, **una colisión es la posibilidad de que alguien te sirva un archivo distinto del que pediste, y el sistema lo dé por bueno**.

> [!quote]- De la transcripción — el hash como índice universal de contenido (cues pt2 393-403)
> *"[`MD5`] se hizo súper popular porque las primeras redes de transferencia de archivos peer to peer —esto ya es historia antigua, pero por ahí escucharon hablar de **[eDonkey]** y **[Kademlia]**, que fueron los prototipos de [BitTorrent], que sería hoy algo más usado— nacieron de la idea de utilizar esta función como **una suerte de índice universal**. O sea: si una función de hash criptográfica me da un resumen de todo el contenido de un archivo… el gran problema de los sistemas de archivos distribuidos es que cuando el archivo empieza a estar en un montón de computadoras **tiene nombres distintos, está en lugares distintos**. Entonces las funciones de hash dejaban **normalizar un único indicador que tenía que ver con el contenido**. Uno compartía una carpeta, se indexaban los archivos —bueno, yo tengo estos archivos, éstos son los [hashes] de los archivos—, y uno buscaba y pedía **por ese tipo de contenido**."*

**`SHA-0`, `SHA-1` y el patrón que ya se había visto con `DES`.** El instituto de estándares de Estados Unidos pidió estandarizar un hash para uso comercial. No hubo concurso: el encargo salió, según el docente, directo a IBM, y produjo la función que hoy se llama `SHA-0` — que *"no vio la luz"*. Se la pasaron a la NSA, que la aprobó **con cambios que no explicó**: *"úsenla con estos cambios, créanme que está buena"*. Eso es `SHA-1`.

**Es literalmente el mismo patrón que las cajas $S$ de `DES`**, contado por el mismo docente en la misma materia: una primitiva que sale de un proceso institucional, una intervención de la NSA sin justificación pública, y una comunidad que tarda décadas en entender por qué esos cambios estaban bien. Ver [[des-y-3des|DES y 3DES]].

Y la diferencia técnica que separa a las dos: **128 contra 160 bits**. Como cada bit agregado duplica el esfuerzo de un ataque por fuerza bruta, esos 32 bits multiplican el trabajo por unos **mil millones** — $2^{32} \approx 4{,}3 \times 10^{9}$, para ser exactos. El juicio que agrega: 128 bits queda *"incómodamente cerca"* del poder de cómputo de un gobierno.

> [!quote]- De la transcripción — SHA-0, la NSA y el salto de 128 a 160 bits (cues pt2 405-419)
> La historia institucional (cues pt2 405-413): *"En algún momento, **siguiendo la misma lógica de `DES`**, el instituto de estándares de Estados Unidos pidió estandarizar una función de hash para uso comercial. No se hizo un concurso, no queda muy claro: la comisionaron directamente a IBM. Salió una función de hash que hoy solemos llamar **[`SHA-0`]**, que no vio la luz, parecida a lo que ocurrió con `DES`. Esa función se la pasaron a la **NSA**, la Agencia de Seguridad, y la Agencia de Seguridad dijo: **me gusta, sí, úsenla, pero úsenla con estos cambios, que no les voy a explicar por qué, pero funciona; créanme que está buena**. Ésa es la función [`SHA-1`]."*
>
> Los tamaños (cues pt2 415-419): *"[`SHA-1`] tiene etiquetas un poco más largas: pasamos de **128 bits a 160**. Y 128 bits para una función de hash, cuando veamos los modelos de ataques por fuerza bruta, queda **incómodamente cerca** del poder de cómputo que puede tener un gobierno o alguien con acceso a mucho poder de cómputo. **160 ya se escapa.** Acuérdense de que cada bit que agregamos **duplica** el esfuerzo de un ataque por fuerza bruta, así que de 128 a 160 estamos multiplicando por **mil millones y un poco más**."*
>
> *(**Precisión nuestra sobre la atribución.** `SHA-0` y `SHA-1` no fueron comisionadas a IBM: fueron **diseñadas por la NSA** y publicadas por el NIST como FIPS 180 y FIPS 180-1. La historia del encargo a IBM con intervención posterior de la NSA es, otra vez, **la de `DES`**. El paralelo que el docente quiere trazar es correcto; la genealogía institucional de este caso, no.)*

En el mismo tramo aparece el adelanto que ancla todo esto en algo con consecuencias: los **certificados digitales**, que se ven en la unidad de protocolos, usan funciones de hash en su construcción, y son *"los que les aseguran a ustedes que cuando se están conectando a un servidor se están conectando al servidor real y no a uno trucho"*. Romper un hash no es romper un juguete.

### 2004: el año que rompió el área

**El hecho:** un grupo de criptógrafos y matemáticos chinos encuentra una **familia nueva de ataques de propósito general** — ataques que no afectan a una función específica sino, potencialmente, **a todas las que comparten el modelo** — y la aplica sobre `MD5`, la más usada del momento, destrozándola. Hoy `MD5` se considera *"superquebrada"*.

**El efecto sobre la disciplina** es lo que el docente quiere que quede: *"un cisma y una refundación"*. Años de papers, primero rompiendo funciones y después construyendo funciones que sobrevivieran a lo que se acababa de aprender.

**La ironía, y la sospecha.** `SHA-1` resistió mejor que `MD5` — y resistió mejor **gracias precisamente a los cambios que la NSA había metido sin explicar**. De ahí la especulación, que el docente marca como no confirmada porque el material sigue sin desclasificarse: que la NSA conocía esos ataques **quince años antes** que la comunidad científica.

Esta es, además, la misma historia que la [[#8. Seguridad de un MAC: Mac-forge|§8]] contó el 27/08 desde el otro lado — la de las falsificaciones que primero se ningunearon por *"no tener sentido"* y terminaron falsificando certificados de Google y Microsoft. **Son el mismo episodio**: allá visto como lección metodológica sobre cómo leer un ataque nuevo, acá visto como el punto de quiebre de las primitivas de hash.

> [!quote]- De la transcripción — 2004 y lo que siguió hasta 2008 (cues pt2 425-441)
> El ataque (cues pt2 425-436): *"En 2004 hubo un avance muy importante. Un grupo de **criptógrafos y matemáticos chinos** encuentra una familia nueva de ataques, **ataques de propósito general**: ataques que afectan no a una función específica sino **potencialmente a todas**. Y lo aplican sobre [`MD5`], que era la función más famosa del momento, **y lo destrozan**. Básicamente, hoy día [`MD5`] se considera superquebrada. Ahí hubo como un **cisma y una refundación** de la parte de criptografía en el ámbito de funciones de hash: fueron años donde hubo muchos papers y muchos avances, primero en **romper** funciones de hash y después en **construir funciones nuevas que sobrevivan** a eso. Y la cosa divertida, muy parecida a la historia [de `DES`]: resulta que [`SHA-1`] no se rompió tanto **por los cambios que había introducido la NSA**. Así que se especula —todavía no está desclasificado como para poder confirmarlo— que **sabían de ciertos ataques avanzados antes de que la comunidad científica los descubra**."*
>
> El saldo (cues pt2 437-441): *"Siguieron hasta el 2008, que se fueron sofisticando y mejorando los ataques. Básicamente **[`MD5`] murió**, y [`SHA-1`] quedó con **serias dudas**. Y, por otro lado, los 160 que parecían cómodos, con la explosión que hubo de poder de cómputo, empezaron a ponerse en duda: si había ataques que iban a bajar la complejidad y además el poder de cómputo se acercaba, **160 empezó a sonar incómodamente chico** también."*

**`SHA-2` es el 3DES de los hashes.** La analogía es del docente y es exacta: no es un diseño nuevo, es **tomar `SHA-1`, robustecerlo y agrandarlo**, a costa de hacerlo más pesado y más lento. Un **punto de contención** para los más sensibles a seguridad mientras se buscaba el sucesor de verdad.

**Y el sucesor se buscó con un concurso abierto**, al estilo de `AES`, cuyos pliegos pedían una cosa difícil: **el tamaño de conjuntos de `SHA-2` con la velocidad de `SHA-1`**.

**Por qué gana Keccak es el mejor argumento de la clase, y no es un argumento técnico sobre Keccak.** De los participantes, alrededor del **90 por ciento eran variantes de Merkle-Damgård**. Después del susto de 2004 —un ataque general que se llevó puesta a toda una familia de golpe— **el riesgo de elegir otro Merkle-Damgård no era que fuera peor, era que fuera lo mismo**: un solo ataque nuevo contra el modelo podría llevarse el estándar viejo y el nuevo juntos. Así que la balanza se inclinó por el **modelo esponja**, inventado para el concurso, **por ser distinto**.

Es un criterio de selección que no aparece en ningún lado del PDF y que conviene tener nombrado: **diversidad de diseño como contramedida contra el monocultivo**. La misma lógica por la que no se plantan mil hectáreas de una sola variedad.

> [!quote]- De la transcripción — SHA-2, el concurso y por qué gana el modelo esponja (cues pt2 442-467)
> `SHA-2` y los pliegos (cues pt2 442-448): *"Entonces se estandariza y se construye rápido una familia que se llama [`SHA-2`], como **punto de contención** para los más sensibles respecto a seguridad. Y se organiza, parecido a lo que ocurre con `AES`, **un concurso abierto**, llamando a toda la comunidad científica y académica del mundo a construir los sucesores. [`SHA-2`], si quieren, para hacer una analogía, **fue como triple `DES`**: fue tomar [`SHA-1`], robustecerlo y agrandar el tamaño a costa de hacerlo mucho más pesado y lento. En los pliegos del concurso lo que se pedía eran funciones criptográficas que cumplan con **el tamaño de conjuntos de [`SHA-2`] y tengan la velocidad de [`SHA-1`]**."*
>
> El ganador (cues pt2 449-453): *"De ir bajando funciones de hash y contendientes emerge un ganador, una función de hash que se llamaba **[Keccak]**. No sé si de casualidad o no, pero digamos, coautoreada por **[Vincent Rijmen]**, que es también el autor de `AES`. Así que le debemos a [Rijmen] las dos funciones más importantes de la criptografía moderna que se utilizan masivamente."*
>
> El argumento del modelo distinto (cues pt2 460-467): *"Y en particular termina ganando porque en ese concurso hubo **63 participantes** —no me acuerdo el número exacto, pero no les exagero que **el 90 por ciento de los participantes eran variantes del modelo [Merkle-Damgård]**—. Y parte de lo que había quedado muy sensible con el ataque de 2004 es: **¿qué pasa si aparece otro ataque general? No podemos darnos el lujo de que nos rompa el estándar nuevo.** Entonces hubo tres finalistas y la balanza se inclinó sobre éste, porque **es un modelo distinto, que se llama esponja**, que lo inventaron para el concurso. Hoy hay otras funciones de hash menos conocidas o más experimentales que usan este modelo de esponja también. El modelo demostró ser bastante robusto."*

> **Cuatro precisiones sobre este tramo** *(precisiones nuestras).* El argumento del docente —un coautor de `AES` está detrás de `SHA-3`, la esponja gana por ser un modelo distinto— **es correcto en su sustancia**. Los datos que lo acompañan, no del todo:
>
> | Dice el docente | Lo verificado |
> |---|---|
> | Keccak es coautoreada por **Vincent Rijmen** | El equipo es **Bertoni, Daemen, Peeters y Van Assche**. El coautor de `AES` que sí está detrás de Keccak es **Joan Daemen**, el otro autor de Rijndael. Rijmen no participó |
> | **63** participantes y **3** finalistas | **64** propuestas presentadas, 51 admitidas a la primera ronda, 14 semifinalistas en 2009 y **5 finalistas** en 2010: BLAKE, Grøstl, JH, Keccak y Skein. El propio docente aclara que no recuerda la cifra |
> | `SHA-2` se estandariza **después** de 2004, como respuesta al ataque | `SHA-2` es **anterior**: borrador en 2001, FIPS 180-2 en **2002**. Lo que 2004 provoca no es su creación sino su **adopción masiva**, que es probablemente lo que el docente recuerda |
> | La filmina 32 dice que `SHA-3` se estandarizó **en 2013** | Keccak se **eligió** en octubre de 2012 y se estandarizó en **FIPS 202, agosto de 2015**. El 2013 no corresponde a ningún hito |
>
> Y una precisión de fondo sobre el vocabulario, que la clase usa suelto: **`SHA-3` no es el reemplazo de `SHA-2`.** El NIST **no deprecó `SHA-2`**, que sigue siendo estándar vigente y recomendado. `SHA-3` es una **alternativa de diseño distinto**, disponible por si `SHA-2` cae — que es, exactamente, el argumento de diversidad que el docente acaba de dar. Ver [[primitivas-de-hash-estandar#SHA-3|Primitivas de hash estándar]].

→ Conceptos: **[[primitivas-de-hash-estandar|Primitivas de hash estándar]]** · **[[des-y-3des|DES y 3DES]]** — el mismo patrón institucional, veinte años antes · **[[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]]**

---

## 18. Seguridad de las funciones de hash

> **Filmina 34.** *Objetivos del atacante*, sea $h: A \to B$. **Preimágenes**: dado $y \in B$, hallar $x$ con $h(x) = y$ — fuerza bruta: $\lvert B\rvert$ intentos. **Segundas imágenes**: dado $(x,y)$ con $h(x) = y$, hallar $x'$ con $h(x') = y$ — fuerza bruta: $\lvert B\rvert$ intentos. **Colisiones**: hallar $x, x'$ con $h(x) = h(x')$ — fuerza bruta: $\lvert B\rvert^{1/2}$. *Paradoja del cumpleaños.*

> **El docente saltea la filmina 33 y vuelve sobre ella al final.** De la 32 pasa directo a la 34 y después a la 35; `HMAC` recién se da en el cue pt2 583, después de las primitivas recomendadas. El orden real de exposición está en la [[#21. HMAC: la vuelta atrás a la filmina 33|§21]].

**Primero, la salvedad que el vault no tenía, y que el docente aporta como autocorrección espontánea.** La jerarquía de las tres resistencias —resistencia a colisiones implica las otras dos— es lo que justifica que la materia formalice **una sola prueba**. Pero esa implicación **no vale matemáticamente**: hay **casos borde** —entrada muy chica, pocos mensajes posibles, etiquetas de tamaño chico— donde la resistencia a colisiones no garantiza nada sobre preimágenes ni sobre segundas preimágenes. Vale **asintóticamente**, con etiquetas grandes y muchos mensajes, y *"por eso nos centramos sólo en esa prueba"*.

**Y esa salvedad es exactamente la justificación teórica del ejercicio del [[ataque-de-diccionario-sobre-hashes|ataque de diccionario]].** El Ejercicio 6 de la [[guia-03-mac-y-funciones-de-hash|Guía 3]] ataca `SHA-1` —160 bits de salida, resistente a colisiones hasta donde se sabe— sobre un dominio de **diez elementos**, y lo rompe con diez evaluaciones. Eso no contradice ninguna prueba: es el caso borde que el docente acaba de nombrar. Con $\lvert A\rvert = 10$ no hay régimen asintótico, la implicación no aplica, y **la resistencia a preimágenes se esquiva sin violarse**. Es la conexión que faltaba entre la teoría del 03/09 y la resolución de la guía — ver [[ataque-de-diccionario-sobre-hashes#El costo no es 2 elevado a la 160, es el tamaño del dominio|El costo no es 2 elevado a la 160, es el tamaño del dominio]].

> [!quote]- De la transcripción — la resistencia a colisiones no implica las otras dos matemáticamente (cues pt2 471-478)
> *"Nosotros tenemos conceptualmente tres propiedades. Perdón, algo que se me escapó decirles: **resistencia a colisiones se relaciona con estas dos, pero de una forma bastante compleja, y no garantiza segundas preimágenes y preimágenes matemáticamente**, porque hay **casos borde** donde no lo puede garantizar. Si la entrada es muy chica, o si la cantidad de mensajes que ciframos es muy chica, entonces hay como subcategorías que se escapan del conocimiento de la materia, donde se habla de segundas preimágenes en conjuntos chicos, segundas preimágenes con etiquetas de tamaño chico. Ahora, **[asintóticamente]**, cuando hablamos de **etiquetas de tamaño grande y potencialmente muchos mensajes**, resistencia a colisiones **sí** garantiza las otras dos propiedades. **Por eso nos centramos sólo en esa prueba.**"*

**La fuerza bruta es lo último que le queda al adversario**, y por eso los tres números de la filmina 34 son **cotas de referencia**, no el costo de un ataque real: valen cuando no existe criptoanálisis. En cuanto aparece un ataque inteligente, la cota se cae — como se cae la de `MD5` dos párrafos más abajo.

Las dos primeras cotas las deriva la clase, con **Emilio José Mitchell** contestando las dos veces. Contra **preimágenes**: se genera un mensaje, se hashea, se compara, se repite; la probabilidad de acertar depende de cuántas etiquetas posibles haya, así que estadísticamente hacen falta del orden de **la cantidad de etiquetas** — $2^{128}$ intentos para una salida de 128 bits. Contra **segundas preimágenes** es *"prácticamente lo mismo"*: se calcula el hash del mensaje de partida y se buscan mensajes hasta pegarle. **Mismo orden de intentos.** De ahí las dos celdas $\lvert B\rvert$ de la filmina.

> [!quote]- De la transcripción — las dos cotas de fuerza bruta, derivadas con la clase (cues pt2 489-500)
> Preimágenes (cues pt2 489-494): *"Si nosotros tenemos el conjunto de salida de la función, de etiquetas, una búsqueda por fuerza bruta requiere **estadísticamente, en el orden de la cantidad de posibles etiquetas** que hay, de intentos. Puedo tener la mala suerte de que dos etiquetas nos den el mismo número, y probablemente algunas más; pero cuando probamos aproximadamente —si hay $2^{128}$ posibles etiquetas— **cuando probamos aproximadamente $2^{128}$ mensajes ya estamos en una probabilidad no despreciable de encontrarla**. Así que está por ahí el orden."*
>
> Segundas preimágenes (cues pt2 495-500). **Pablo Abad:** *"Si nosotros queremos vulnerar segundas preimágenes, nuestro punto de partida es un documento $x$. ¿Qué sería romper la propiedad de segundas preimágenes por fuerza bruta? ¿Alguien?"* — **Emilio José Mitchell:** *"De vuelta: [pruebo] mensajes hasta que te dé el mismo hash que tenías inicialmente."* — **Pablo Abad:** *"Correcto. Es muy parecido: la forma normal de resolverlo es **le calculo el [hash] al mensaje y empiezo a buscar mensajes hasta pegarle**. Así que requiere más o menos **la misma cantidad de intentos**."*

### La paradoja del cumpleaños, en el aula

**Colisiones es distinto, y por eso es más barato.** No se generan pares y se descartan: se genera un mensaje, se compara **contra todos los anteriores**, y esa progresión acumulativa es exactamente el problema estadístico que se estudia en probabilidad como **paradoja del cumpleaños**. Es lo que el docente ya había anticipado media hora antes en la [[#14. Colisiones y las tres resistencias|§14]], cuando dijo *"eso va a cambiar la complejidad del ataque"*.

La analogía, dicha con números en el aula:

- Fijadas **dos** personas cualesquiera, la probabilidad de que cumplan el mismo día es $1/365$ — despreciable.
- Pero la pregunta que importa es otra: **cuántas personas hacen falta en un grupo para que la probabilidad de que haya dos coincidentes deje de ser despreciable**. Y ahí el número es sorprendentemente bajo.
- El docente no lo recuerda —*"no me acuerdo si 14 o 21"*— y lo aporta un alumno, **Emilio José Mitchell**: **23**, para el 50 por ciento. Mucho más bajo que 365.

**Trasladado al hash:** el costo está en el orden de **la raíz cuadrada del tamaño del conjunto** — hay una constante de por medio, pero el orden es ése. Con $2^{128}$ etiquetas posibles, como en `MD5`, hacen falta unas **$2^{64}$ exploraciones** para encontrar una colisión. Y el juicio operativo: **$2^{64}$ es un número que hoy no deja tranquilo a nadie**, porque existe poder de cómputo para ejecutarlo.

> [!quote]- De la transcripción — la paradoja del cumpleaños con el número aportado por un alumno (cues pt2 501-519)
> Por qué colisiones es distinto (cues pt2 501-504): *"No es que genere dos mensajes y, si no hay colisión, los tiro y genero otros dos. Yo puedo generar el primer mensaje, genero el segundo y lo comparo; genero el tercero y lo comparo con los dos que generé; el cuarto contra los tres. Y así voy haciendo. **Y esa progresión de búsqueda, cuando genera el mensaje $N$, es muy parecida a un problema estadístico que se estudia en probabilidad como la paradoja del cumpleaños.**"*
>
> La analogía y el número (cues pt2 505-519): *"Si yo elijo a dos de ustedes cualesquiera, la probabilidad de que cumplan el mismo día de cumpleaños es **1/365**. Pero si yo quiero pensar en la probabilidad de que **entre el grupo** haya dos que cumplan el mismo día, la probabilidad [sube] terriblemente. Y si lo quiero poner de la otra manera: **¿cuántas personas tendría que tener en el grupo para que haya una probabilidad no despreciable de que dos cumplan el mismo día** —o dos mensajes el mismo hash—? El número es súper bajo versus la intuición. ¿Se acuerdan? En un grupo de personas… uy, ahora se me fue, no me acuerdo si 14 o 21…"* — **Emilio José Mitchell:** *"23, [para el] 50 por ciento."* — **Pablo Abad:** *"Veintitrés. Ahí está, gracias. **Número mucho más bajo que 365.** Acá pasa lo mismo: el número está en un orden —no es exactamente lo mismo, hay una constante—, pero está **en el orden de la raíz cuadrada del tamaño del conjunto**."*
>
> *(En el cue pt2 509 el ASR transcribe "la probabilidad **baja** terriblemente". Por el contexto —es la probabilidad de que en el grupo haya dos coincidentes, que **crece** con el tamaño del grupo— el término correcto es "sube". Corrección nuestra, marcada entre corchetes.)*

> [!quote]- De la transcripción — 2 a la 64 para MD5, 2 a la 20 con criptoanálisis, y la regla del doble de bits (cues pt2 521-545)
> La cota y su juicio (cues pt2 521-526): *"Entonces, la complejidad de hallar colisiones por fuerza bruta requiere explorar aproximadamente **la raíz cuadrada del espacio**. Si yo tengo $2^{128}$ elementos, como pasa en [`MD5`], yo requeriría aproximadamente **$2^{64}$ exploraciones** para poder encontrar una colisión. $2^{64}$ es un número que **hoy no nos dejaría tranquilos**: hoy hay poder de cómputo como para ejecutar $2^{64}$ operaciones de este tipo."*
>
> El criptoanálisis real y la regla de dimensionamiento (cues pt2 538-545): *"Desde un punto de vista formal decimos que [`MD5`] **está quebrado**, porque además, con los ataques publicados que hay, **no se necesitan $2^{64}$: se necesitan menos de $2^{20}$ operaciones** para encontrar una [colisión]. (…) Y ésta es la razón por la cual **las funciones de hash modernas estandarizadas tienen tamaños que aproximadamente son el doble en bits que las claves de los criptosistemas**: tiene que ver con esto, porque **la paradoja del cumpleaños lleva a que el ataque de fuerza bruta tenga que explorar la mitad del tamaño en bits del conjunto**, o la raíz cuadrada de la cantidad de elementos."*

**Dos conclusiones que conviene llevarse enteras.**

**Primera: la propiedad más fuerte es la más barata de romper.** Suena contradictorio y no lo es. Resistencia a colisiones es la propiedad **más exigente** —implica las otras dos, en el régimen asintótico— y sin embargo su ataque genérico cuesta $\lvert B\rvert^{1/2}$ contra los $\lvert B\rvert$ de las otras dos. La razón es la de la [[#14. Colisiones y las tres resistencias|§14]]: el adversario de colisiones tiene **un grado más de libertad** y puede reutilizar todo el trabajo anterior en cada intento nuevo. Y de ahí sale la regla práctica: **el nivel de seguridad de un hash de $L$ bits es $L/2$, no $L$**.

**Segunda: por eso los hashes tienen el doble de bits que las claves.** No es una convención ni un exceso de celo. Un criptosistema de bloque con clave de 128 bits ofrece 128 bits de seguridad; una función de hash de 128 bits ofrece **64**. Para emparejar a `AES-128` hace falta un hash de **256**. Eso explica de un tirón por qué la filmina 35 exige **mínimo 160 bits de salida** cuando las claves de bloque típicas son de 128, y por qué la recomendación del docente para proyectos nuevos —[[#20. Qué usar en la práctica|§20]]— es `SHA-3` de **256**.

**Y `MD5` cierra el círculo del [[#17. Las primitivas: de MD5 a SHA-3|§17]]:** la cota genérica dice $2^{64}$; los ataques publicados desde 2004 la bajan a **menos de $2^{20}$**. Ese salto de 44 órdenes binarios es lo que separa *"quebrada en teoría"* de *"quebrada en un rato en cualquier notebook"*, y es la razón de la marca *Quebrada* de la filmina 35. La discusión de qué significa eso en la práctica —de qué me protejo y de quién— es lo que viene inmediatamente después, en la [[#19. La seguridad es relativa: de qué y de quién|§19]].

→ Conceptos: **[[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]]** · **[[resistencias-de-una-funcion-de-hash#La propiedad más fuerte es la más barata de romper|Resistencias de una función de hash]]** · **[[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]]** — el caso borde donde la jerarquía no aplica

## 19. La seguridad es relativa: de qué y de quién

Los exponentes de la [[#18. Seguridad de las funciones de hash|filmina 34]] dejan una pregunta abierta que el PDF no contesta: si hallar una colisión en `MD5` cuesta $2^{64}$ y ese número ya está al alcance del cómputo actual, ¿por qué `MD5` sigue en producción en medio mundo? El docente se detiene acá **dos minutos y medio fuera de filmina** y contesta con un marco entero, que es lo mejor del tramo y no está escrito en ninguna parte del material de la cátedra.

**La respuesta es que no existe la seguridad a secas.** Un escenario de seguridad tiene **dos factores**: *de qué me estoy protegiendo* y *de quién me estoy protegiendo*. La misma primitiva es exagerada, justa o insuficiente según el par de respuestas. El docente lo baja con **tres ejemplos escalonados**, todos con la misma primitiva —`MD5`— y distinto escenario:

| Qué protejo | De quién | Veredicto sobre `MD5` |
|---|---|---|
| La lista de figuritas que faltan para el álbum del mundial | De un conocido con ganas de molestar | Alcanza de sobra; algo más fuerte *"estamos exagerando"* |
| Los estados financieros de una empresa ya presentados ante el fisco | De quien tenga interés económico en alterarlos | *"Empieza a ser cuestionable"* |
| Información militar cuya modificación maliciosa podría matar gente | De un adversario con presupuesto estatal | *"Se queda corto"* |

A la ponderación conjunta del **problema potencial** y del **impacto potencial** el docente le pone nombre —**riesgo**— y anuncia que se formaliza más adelante en la materia, en la unidad de seguridad de sistemas. Es decir: el concepto no muere con esta clase, por eso tiene nota propia.

*(El ASR trae la primera respuesta como "me decís alcan 6 h"; la reconstrucción a `SHA-256` es nuestra y se marca entre corchetes.)*

> [!quote]- De la transcripción — Los tres escenarios escalonados y el nombre "riesgo" (cues pt2 525-536)
> Por eso [MD5] a ver. no sé si decir que no es seguro, pues se sigue usando en muchos lados. La La seguridad siempre es relativa, también, No. Algo que siempre hay que tener en cuenta es el escenario de seguridad tiene 2 2 factores. Si quieren. Uno es de qué me estoy protegiendo y en otro es de quién me estoy protegiendo. Si yo quiero este verificar que nadie me modifique la lista de las figuritas que me faltan para completar el álbum del mundial me decís [SHA-256], diría: estamos exagerando ya. Por eso el [MD5]. Este, si yo quiero garantizarme que nadie modifique los estados financieros de una empresa que se presentaron ya ante el fisco. Bueno, [MD5] empieza [a ser] cuestionable este. Si yo estoy trabajando en un ejército y quiero garantizar que no se modifique información con la cual podría morir gente. Si la modifica maliciosamente. [MD5], se queda corto, entonces la seguridad siempre es. volvemos a esto. No hay una única definición de seguridad. El escenario de seguridad tiene que tener en cuenta el potencial problema y y el potencial impacto que tiene Después vamos a dar. Eso se llama riesgo y y es parte del análisis que se hace todo el tiempo en seguridad.

**El matiz no es una licencia.** Inmediatamente después el docente cierra la puerta formal: *desde el punto de vista formal `MD5` está quebrado*, y no por la cota genérica sino por criptoanálisis real —los ataques publicados encuentran una colisión en **menos de $2^{20}$ operaciones**, no en $2^{64}$—. Las dos afirmaciones conviven: `MD5` está quebrada como primitiva y sigue siendo aceptable como suma de verificación de un álbum de figuritas.

De la misma cuenta sale una **regla de dimensionamiento** que el vault no tenía escrita: las funciones de hash modernas estandarizadas llevan **aproximadamente el doble de bits que las claves de los criptosistemas** con los que se usan. La razón es exactamente la [[#18. Seguridad de las funciones de hash|paradoja del cumpleaños]]: la fuerza bruta contra colisiones sólo tiene que explorar **la mitad del tamaño en bits** del conjunto —la raíz cuadrada de su cardinal—, así que para igualar los $n$ bits de seguridad de una clave hace falta una etiqueta de $2n$ bits. Es la explicación de por qué la [[#20. Qué usar en la práctica|filmina 35]] exige un mínimo de 160 bits de salida cuando las claves de bloque típicas son de 128.

> [!quote]- De la transcripción — MD5 en menos de 2^20 operaciones y por qué el hash duplica a la clave (cues pt2 538-545)
> desde un punto de vista formal y decimos que [MD5] está quebrado. Sí, porque, además, con los ataques publicados que hay, no se necesitan 2 a las 64, se necesitan menos de 2 a la 20 operaciones para para encontrar una [colisión]. Mhm. Pero bueno. esta es la razón por la cual las funciones de hash modernas estandarizadas tienen tamaños que aproximadamente son el doble en bits que las de las funciones. Este de los criptosistemas que las claves de los criptosistemas tiene que ver con esto, porque la paradoja del cumpleaños es como que de alguna manera lleva el ataque de fuerza bruta que tenga que explorar la mitad del tamaño bits del conjunto o la raíz cuadrada de la cantidad de elementos.

El docente abre turno de preguntas (cue pt2 546) y nadie responde; tras catorce segundos de silencio sigue con la filmina 35.

→ Concepto: **[[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]]** — el marco completo, con los tres ejemplos y el mínimo común denominador · **[[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]]** · **[[primitivas-de-hash-estandar|Primitivas de hash estándar]]**

---

## 20. Qué usar en la práctica

La filmina 35 es la contracara de la tabla de primitivas de la [[clase-02-cifrado|Clase 02]]: qué nombres esperar al abrir un proyecto ajeno y qué elegir para uno nuevo. El docente declara que repite el mismo ejercicio que hizo con los criptosistemas.

**El mapa del terreno.** A diferencia de los criptosistemas, hay muchas funciones de hash dando vueltas, pero en la práctica sería raro toparse con algo fuera de la familia `SHA`. La excepción son **tres jurisdicciones con estándares propios —Europa, Japón y China—**: en un sistema con origen o destino en alguna de ellas puede aparecer otra familia. Para todo lo local, americano o internacional genérico, la familia `SHA` cubre el caso.

**La recomendación concreta**, que la filmina no da:

- Para un proyecto nuevo, **`SHA-3`**, el último estándar.
- **La variante de 256 bits para todo.** La más chica de las disponibles es segura hoy.
- **La de 512 se reserva para almacenamiento con horizonte de décadas** — información que hay que retener 20 o 30 años, donde el riesgo no es el atacante de hoy sino el de 2050.
- Con la salvedad honesta de que **a esa escala no se puede asegurar nada**: puede aparecer un ataque contra `SHA-3` y para entonces existir un `SHA-8`. Menciona la computación cuántica, y aclara que **hoy no tiene ningún ataque material** contra funciones de hash.
- Si aparece `MD5` —o cualquier función fuera de la familia— en un sistema existente, **hay que averiguar el estado** de esa primitiva, porque es probable que haya un problema latente.

`SHA-3` gana además por razones que no son criptográficas y que la filmina omite: está estandarizado, es **libre de patentes**, es gratis y está metido en todas las librerías.

> [!quote]- De la transcripción — Las tres jurisdicciones y la recomendación de SHA-3 con sus tamaños (cues pt2 552-568)
> A diferencia de los criptosistemas, Acá la realidad es que hay muchas funciones de hash dando vueltas, pero hoy día sería raro que se encuentren con una muy distinta alguna de las generaciones de la familia [SHA], si están trabajando con algún sistema de origen y destino europeo o de origen y destino japonés o chino, que son 3 jurisdicciones que tienen estándares propios, podría aparecer alguna, otra. pero en general y especialmente para todo lo que sea o local o americano, o o así, a nivel internacional, sería raro que se encuentren con con alguna muy distinta de estas. Entonces, las recomendaciones hoy día, para un proyecto nuevo son usar el último estándar. [SHA-3] hay distintos este tamaños. Esto es muy parecido a los criptosistemas. El tamaño más chico es seguro. Hoy día, el tamaño más grande se reserva como esto es integridad y tiene que ver por ahí, con el almacenamiento y garantías de una modificación acá aparecen algunos escenarios donde hay información que se quiere retener por 20 30 años. y el Consejo práctico es: usa la variante más chica la de 256 bits para todo se recomienda la de 512 para sistema de almacenamiento pensando en horizontes de décadas. La gran realidad es que en un horizonte de décadas no se puede asegurar nada. O sea, puede aparecer un ataque que rompa [SHA-3] y que a esa altura ya tengamos [SHA-8] que que esté superpuesto. Ahí están las computadoras cuánticas que, si bien hoy día no no tienen ningún ataque material a esto no quiere decir que cuando se vuelvan más masivas, no, no, no generen estudios nuevos que que días no se pueden hacer y lleguen a algo. Pero en general, las versiones más chicas son ultra seguras. [SHA-1] incluso es seguro para para un sistema normal. [SHA-1] está como en un horizonte, digamos, en el borde.

### El desacuerdo sobre SHA-1

La última frase de esa cita es la más importante del tramo para el vault, y **obliga a reescribir una entrada**.

La [[#Erratas y precisiones de las filminas|tabla de erratas]] de esta nota venía tratando como **errata de maquetación** el hecho de que la filmina 35 liste `SHA-1` entre las *Primitivas recomendadas* sin ninguna marca, al lado de `MD5 → Quebrada`. Esa clasificación se escribió cuando la sesión del 03/09 no existía y sólo se podía leer el PDF: era razonable suponer que la marca faltaba por descuido.

**Ya no se puede suponer eso.** El docente dice en voz que `SHA-1` *"incluso es seguro para un sistema normal"* y que *"está como en un horizonte, digamos, en el borde"* (cues pt2 567-568), y en toda la sesión la única primitiva sobre la que da alerta es `MD5`. La ausencia de marca en la filmina **no es un descuido: es la posición de la cátedra, dicha dos veces**.

> **Desacuerdo explícito con la cátedra** *(no es una errata).* La wiki mantiene su posición: `SHA-1` está **quebrada** desde SHAttered (2017), con una colisión real publicada a un costo cercano a $2^{63}$; el NIST la **deprecó en 2011** y prohibió su uso para firma digital desde 2013. Para un proyecto nuevo no es defendible bajo ningún escenario, y para uno existente es material de migración, no de tolerancia.
>
> Las dos posiciones son compatibles con el marco de la [[#19. La seguridad es relativa: de qué y de quién|§19]] si se lee *"sistema normal"* como *"escenario de bajo riesgo, sin adversario con presupuesto"*: una colisión de $2^{63}$ está fuera del alcance de casi cualquiera salvo de quien pueda pagar una granja de GPU. Pero el marco cortaría del otro lado también: **la resistencia a colisiones es exactamente la propiedad que un certificado o una firma necesita**, y ahí el adversario sí tiene presupuesto. La wiki registra la posición del docente citada y sostiene la suya al lado, rotulada como lo que es: un desacuerdo argumentado, no una corrección tipográfica.

### El mínimo común denominador

El cierre del bloque es un adelanto declarado al resto de la materia, y es el argumento que vuelve todo lo anterior una decisión de ingeniería y no de gusto: **la seguridad de un sistema es el mínimo común denominador de la seguridad de todos sus componentes.** Hoy la parte criptográfica de un sistema está —en palabras del docente— *"como la estratosfera"* respecto de los demás patrones e interacciones. De ahí el remate: teniendo la criptografía resuelta a niveles buenos y disponible gratis en cualquier librería, que un sistema caiga por **mal uso de criptografía** *"bordea la negligencia"*.

> [!quote]- De la transcripción — El mínimo común denominador y por qué SHA-3 es el ganador (cues pt2 573-582)
> Me estoy adelantando al resto de la materia, pero Básicamente, la seguridad de un sistema es el mínimo común denominador de la seguridad de todos los componentes, no, y hoy día toda la parte criptográfica de un sistema está como la estratosfera versus el resto de otras de otros patrones y y y de otras interacciones que hay en los sistemas, entonces teniendo resuelto técnicamente que la seguridad, por el lado de criptografía esté a a niveles buenos, el que un sistema caiga por mal uso de criptografía es como bordea la negligencia hoy día. Así que llévense más o menos esa Esa idea […] [SHA-3] es un claro ganador […] hay equivalentes en otras geografías. Pero a nivel estandarizado de libre de patentes para usar gratis y metido en todas las librerías.

→ Conceptos: **[[primitivas-de-hash-estandar|Primitivas de hash estándar]]** · **[[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]]** · **[[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]]**

---

## 21. HMAC: la vuelta atrás a la filmina 33

**Dato de recorrido que hasta ahora el vault no tenía: el PDF no se dicta en orden.** El docente pasa de la filmina 32 (`SHA-3`) directamente a la **34** (seguridad de funciones de hash) y de ahí a la **35** (primitivas en la práctica), y recién a la hora y nueve minutos —cue pt2 583— **vuelve atrás a la filmina 33**, `HMAC`. Tiene lógica de exposición: la 33 no es una filmina de hashes sino de **MACs construidos con hashes**, así que cierra el bloque de integridad en vez de abrirlo. El orden real de exposición de la segunda sesión es, entonces:

> 22 → 23 → 24 → 25 → 26 → 27 → 28 → 29 → 30 → 31 → 32 → **34 → 35 → 33** → 36 → 37 → 38 → 39 → 40 → 41

**El encuadre con el que arranca.** El docente recupera una promesa de la primera sesión: hay **dos formas de construir un MAC a partir de otra cosa**. La primera ya se vio —el [[#10. Cómo construir un MAC: CBC-MAC|CBC-MAC]], a partir de una **función pseudoaleatoria**—; la segunda es a partir de una **función de hash criptográfica**, y está estandarizada en un **RFC público del IETF**. Ese par no está enunciado como tal en ninguna filmina: las 18 a 21 dan `CBC-MAC` y la 33 da `HMAC`, sin decir en ningún lado que son las dos alternativas del mismo problema.

> [!quote]- De la transcripción — Las dos formas de construir un MAC y el RFC del IETF (cues pt2 583-589)
> Bien, cuan cuando vimos [MAC], yo les había dicho que había 2 formas de construir los [MAC] a partir de otras cosas. Habíamos visto una: el [CBC-MAC]. que nos permitía construirlo a partir de una función pseudo aleatoria. La segunda forma de construir un [MAC] es a partir de una de una función de hash criptográfica. Hay un una forma de construcción que está estandarizada. Es una R. F, C, Público de de los que maneja el [Internet Engineering Task Force] de Internet. Mhm. Y es bastante simple. O sea, es dada una función de hash que sea libre de colisiones. Se puede construir un [MAC] de la siguiente manera.

La construcción de la filmina es la anidación

$$\mathsf{HMAC}_k(m) \;=\; H^s\bigl((k \oplus \mathsf{opad}) \,\Vert\, H^s\bigl((k \oplus \mathsf{ipad}) \,\Vert\, m\bigr)\bigr)$$

y el docente la lee entera en voz, término por término, sin usar la notación: *el hash de un prefijo que es la clave XOR-eada contra una constante, seguido del mensaje; eso da una etiqueta, y a esa etiqueta se le vuelve a aplicar el hash agregándole como prefijo la clave XOR-eada contra la otra constante.* Es la lectura que permite reconstruir el orden de aplicación sin el PDF delante.

> [!quote]- De la transcripción — La fórmula anidada leída en voz alta (cues pt2 603-607)
> Entonces, volviendo a esto, entonces esto es el resultado de calcular el hash, el valor de Hash de un prefijo que es la clave del [MAC]. [XOR-eada] contra una constante y después el mensaje sí. Esto da un valor a una etiqueta y a ese valor volver a aplicarle la función de Hash agregándole como prefijo. La clave son otra constante

### Qué exige realmente la prueba de las constantes, y qué no

La filmina 33 enumera los valores de `ipad` y `opad` —además **intercambiados**, ver la [[#Erratas y precisiones de las filminas|tabla de erratas]]— y no dice de dónde salen. El docente lo explica, y en el camino **corrige una afirmación del vault**.

La razón por la que las constantes son **bytes repetidos** no es criptográfica sino **reputacional**: en criptografía existe una preocupación permanente por las *backdoors*, un secreto que quien lo conozca pueda usar para vulnerar el sistema. Por eso, cuando un diseño necesita introducir un valor constante, se elige entre tres opciones defendibles: **la constante cero**, **un nonce aleatorio**, o **una constante lo bastante regular como para que nadie pueda sospechar que fue elegida a dedo**. Si `ipad` fuese un valor arbitrario de aspecto casual, en palabras del docente, *"media Internet estaría diciendo: acá hay trampa"*. Es el criterio que en la literatura se llama **nothing-up-my-sleeve**, el mismo que sostiene las constantes de las S-boxes de otras primitivas.

**Y acá está la corrección al vault:** la prueba de seguridad de `HMAC` **sólo exige que `ipad` y `opad` sean distintas entre sí**. Nada más. No hay ninguna propiedad especial de $\texttt{0x36}$ y de $\texttt{0x5c}$ que la demostración necesite; podrían ser otro par cualquiera de constantes diferentes. Las notas del vault que atribuían virtudes específicas a esos dos valores hay que reescribirlas: la única virtud que tienen es **no ser iguales** y **ser explicables**.

> [!quote]- De la transcripción — El miedo a las backdoors, y el único requisito de la prueba (cues pt2 595-602)
> esto en criptografía ocurre este en general hay por lo sensible que es el tema. Siempre está la preocupación de que haya [backdoors]. Algún secreto que si alguien lo conoce, puede vulnerar la seguridad. entonces cuando se introducen valores constantes típicamente o es una constante 0, o es un vector aleatorio, un [nonce]. o es una constante que sea lo suficientemente regular como para que nadie crea que hay trampa. O sea, si este fuese un valor arbitrario media Internet estaría diciendo [acá] hay trampa. Seguro que hay algún truco. entonces lo la la prueba de seguridad del del [HMAC], lo que requiere es que las 2 constantes. El [inner pad] y el [outer pad] sean distintos. Es lo único que requiere. Entonces, simplemente se definieron 2 constantes que se repiten todos los bytes como para decir, acá no hay gato encerrado.

Como corolario, **el docente no corrige en voz el intercambio de la filmina**. Se limita a nombrar el *inner pad* y el *outer pad* y a decir que sólo tienen que ser distintos, con lo cual el error del PDF queda intacto y sin señalar. Que la prueba no dependa de cuál es cuál explica por qué pasa desapercibido; **no lo vuelve inocuo**, porque la conformidad con el RFC 2104 sí depende de los valores exactos y una implementación que los intercambie no interopera con nadie.

### La objeción del doble procesamiento, desarmada

La confusión típica frente a la fórmula anidada es pensar que **hay que procesar el mensaje dos veces** y que por lo tanto `HMAC` cuesta el doble que un hash. **Es falso**, y el argumento es de una línea:

- El **hash interno** recibe $(k \oplus \mathsf{ipad}) \Vert m$. Ahí sí se recorre el mensaje entero, **una vez**.
- Su salida es **una etiqueta de tamaño constante** —128 o 256 bits—, no una función de la longitud del mensaje.
- El **hash externo** recibe entonces $(k \oplus \mathsf{opad})$ concatenado con esa etiqueta: **típicamente dos bloques**, siempre los mismos dos bloques, **independientemente de si el mensaje tenía 40 bytes o 40 gigabytes**.

Conclusión: `HMAC` tiene prácticamente **la misma velocidad que hashear el mensaje**. Lo único de longitud variable se procesa una sola vez.

> [!quote]- De la transcripción — Por qué el mensaje se procesa una sola vez (cues pt2 608-617)
> por ahí. Como le expliqué quedó claro. Pero cuando 1 mira así una una confusión típica que aparece es uy, hay que procesar el mensaje 2 veces. Esto es carísimo. pero fíjense que en realidad no hay que aplicar 2 veces la función de [hash], eso sí. Pero fíjense que el mensaje, que es lo que puede variar en longitud Se procesa una sola vez, porque lo primero que se calcula. Es este término El segundo que tiene la clave [XOR-eada]; para esto es la clave. Tiene una longitud dada por la definición del [MAC], pero pongamos el caso: estándar. 128 bits es un bloque chiquitito o [256], si quieren, pero sigue siendo chiquitito concatenado el mensaje. El resultado de esta función es una etiqueta. Es un bloque de tamaño constante. [128, 256 bits]. ¿sí? Entonces la segunda, el segundo hash, lo que se llama el [outer] Hash. En realidad se aplica sobre un mensaje que tiene 2 bloques. Típicamente, no más, independientemente de la longitud del mensaje. Así que esta operación, si bien [a primera vista] asusta un poco, es prácticamente tiene la misma velocidad que calcularle el [hash] al al mensaje.

La demostración de que `HMAC` es infalsificable —el *"Es infalsificable (`MAC-Forge`)"* que la filmina afirma sin fundamentar— queda remitida al **libro de Katz**, con su hipótesis explícita: *si $H$ es libre de colisiones, ningún adversario gana `Mac-Forge`* (cues pt2 618-621).

### HMAC contra CBC-MAC: la diferencia es de ingeniería

Cerrado `HMAC`, el docente hace una digresión de dos minutos **sin ninguna filmina de apoyo** que el vault no tenía y que cambia cómo hay que leer el par de construcciones. Hasta ahora la wiki las presentaba como intercambiables y nunca decía cuánto cuesta cada una.

**`HMAC` es de uno a tres órdenes de magnitud más rápido que `CBC-MAC`.** La causa es estructural: las **permutaciones pseudoaleatorias** que forman los criptosistemas de bloque son funciones pesadas en cantidad de operaciones —aun con aceleración por hardware— frente a las **funciones de compresión** de un hash, que son mucho más livianas. Calcular la etiqueta de un mensaje con un hash es, típicamente, entre $10$ y $1000$ veces más barato que cifrar ese mismo mensaje, que es lo que el `CBC-MAC` obliga a hacer.

De ahí la **preponderancia de `HMAC` en las librerías**, y de ahí que la diferencia importe de verdad en las aplicaciones masivas —el docente anticipa la clase de protocolos y habla de **etiquetar teras o petabytes**—. Pero el veredicto es explícito y hay que citarlo entero, porque desactiva la lectura equivocada:

> *"pero son tan seguras como los `CBC-MAC`. Es un tema más que nada ingenieril, la razón por la cual se utilizan más."*

`HMAC` **no es criptográficamente superior** al `CBC-MAC`. Es más barato.

> [!quote]- De la transcripción — El orden de magnitud y el veredicto de que la elección es ingenieril (cues pt2 624-638)
> En la práctica. En la práctica, la mayor cantidad de implementaciones que [va] a haber de funciones de [hash] son de este tipo. no porque sean más seguras. Pero por un tema práctico, es las funciones F, las las permutaciones pseudo aleatorias que forman parte de los criptosistema del bloque son funciones que suelen ser pesadas en términos de cantidad de operaciones y cosas para hacer. Si bien se pueden acelerar por hardware y demás. son pesadas versus las funciones de compresión de las funciones de [hash], sí entonces típicamente calcular la etiqueta de un mensaje. Es 1 a 3 órdenes de magnitud más rápido que cifrar. Ese mensaje que sería lo que se necesita para hacer el [CBC-MAC]. entonces un [HMAC] es típicamente mucho más rápido para calcular la la etiqueta de un mensaje que un [CBC-MAC]. Y ese motivo, especialmente cuando lo pensamos para aplicaciones masivas, como vamos a ver en en en la clase de de protocolos, no por ahí. Estamos hablando de etiquetar teras, petabytes de información hace una diferencia grande. Entonces. en la práctica, en implementaciones, incluso en librerías. Hay como cierta preponderancia hacia los [HMAC]. pero son tan seguras como los [CBC-MAC]. Es un tema más que nada [ingenieril], la la razón por la cual se utilizan más

> **Lo que la teoría no da y la práctica sí.** La filmina 33 salta directo del hash a `HMAC`, sin escalón intermedio. La [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del 31/08 —tres días **antes** de esta sesión— dedica una filmina entera a **`NMAC`**, la construcción de dos claves explícitas de la que `HMAC` es la instanciación, y con ella la anidación deja de parecer arbitraria: en `NMAC` las dos claves están a la vista, y `HMAC` las deriva de una sola clave XOR-eándola contra las dos constantes. Ver [[practica-04-macs-hash-y-cifrado-autenticado#11. NMAC, el escalón que falta hacia HMAC|NMAC, el escalón que falta]] y el diagrama de `HMAC` de la filmina 13 de esa práctica: ![HMAC con las dos cadenas](../../assets/practica04-hmac.png)

→ Conceptos: **[[hmac|HMAC]]** · **[[cbc-mac|CBC-MAC]]** · **[[funciones-de-hash-criptograficas|Funciones de hash criptográficas]]**

---

## 22. Privacidad e integridad: las tres formas

Antes de abrir la filmina 36 el docente **interrumpe la exposición y reconstruye con la clase, a fuerza de preguntas, por qué se llegó hasta acá**. La respuesta que busca —y que Emilio José Mitchell termina dando— es *"la alteración de datos encriptados"* —el alumno dice *encriptados*; la cátedra usa *cifrados*, pero acá se cita su palabra—: el problema con el que la [[#3. Un nuevo tipo de ataque: la base de sueldos|§3]] y la [[#5. Ataques de texto cifrado escogido: CCA|§5]] se habían chocado el 27/08. La primera respuesta del alumno es *"autenticar"*, que el docente acepta pero **reubica**: la autenticación es parte de los servicios de integridad y estas primitivas sirven para construirla, pero es un concepto **de nivel aplicación** que todavía no se vio.

De ahí sale el enunciado que abre el bloque, y que es el complemento exacto del arco de la primera sesión:

**Ni las funciones de hash ni los MAC protegen la confidencialidad.** No hay nada en sus definiciones que lo haga. Un sistema construido sólo con hash y MAC detecta la modificación y, al mismo tiempo, deja la información a la vista de cualquiera. Y el argumento va más lejos que eso: **el propio modelo de seguridad no contempla la filtración**. `Mac-Forge` mide falsificaciones, no fugas; nada en esa prueba impide que la etiqueta $t$ revele parte del mensaje.

> [!quote]- De la transcripción — Por qué un MAC no dice nada sobre la confidencialidad (cues pt2 654-659)
> lo que vimos hasta acá [MAC] y funciones de Hash atacan el otro problema. Pero no hay nada en la definición de las funciones de hash o de los [MAC] que proteja la confidencialidad de la información. Si si nosotros construimos una solución sólo con Hash y con [MAC] genial, detectamos la modificación. No sé qué, pero todo el mundo vería la información o tendría acceso a la información o parte de la información? Incluso no hay nada porque el modelo de seguridad de de contra falsificaciones no lo toma en cuenta. No hay nada que no diga que a partir de la etiqueta, yo tal vez no puedo recuperar el mensaje original, pero tal vez puedo extraer parte del mensaje original o parte de la información

**Las tres formas de la filmina 36**, con una precisión conceptual que el PDF no hace: sólo dos de las tres son composiciones; **la primera no es combinar, es no combinar**.

| # | Nombre | Construcción | Veredicto de la filmina |
|---|---|---|---|
| 1 | Cifrar **y** autenticar | $c \leftarrow \mathsf{Enc}_{k_1}(m)$, $t \leftarrow \mathsf{Mac}_{k_2}(m)$ | $t$ puede brindar información de $m$ — **insegura** |
| 2 | Autenticar, **luego** cifrar | $c \leftarrow \mathsf{Enc}_{k_1}(m \Vert \mathsf{Mac}_{k_2}(m))$ | Puede ser seguro, requiere prueba de seguridad |
| 3 | Cifrar, **luego** autenticar | $c \leftarrow \mathsf{Enc}_{k_1}(m)$, $t \leftarrow \mathsf{Mac}_{k_2}(c)$ | Siempre es seguro |

**Cuál es la insegura, y por qué: la respuesta la aporta un alumno.** El docente pregunta a la clase y **Tomás Pietravallo** contesta que la primera, *"porque estás dándole 2 piezas de información sobre el mensaje original"* (cue pt2 672). El docente lo confirma dos veces y desarrolla: en la primera forma se publica, se almacena o se transfiere el texto cifrado **junto con** la etiqueta, y nada impide que un atacante recupere información del mensaje a partir de la etiqueta. Si la recupera, se perdió la confidencialidad, y con ella todo el punto del cifrado.

> [!quote]- De la transcripción — Tomás Pietravallo identifica la forma insegura (cues pt2 671-679)
> Pablo Abad: ¿se les ocurre alguna alguna idea de cuál podría ser y por qué. / TOMÁS PIETRAVALLO: [Cifrar] y autenticar porque estás dándole 2 piezas de información sobre el mensaje original. / Pablo Abad: Muy bien ¿correcto? ¿correcto? Es un poco la consecuencia de lo que mencionas un rato, de si nosotros lo hacemos por separado. Nosotros estamos publicando, almacenando, transfiriendo el texto cifrado. Ok y la y la etiqueta. Ok. No hay nada que nos diga que un atacante a través de la etiqueta, no pueda recuperar información del mensaje. Y si recupera información, perdimos confidencialidad, perdimos privacidad, entonces ¿correcto? La primera forma: Cifrar y autenticar por separado no alcanza

*(Precisión nuestra, que refuerza el punto sin contradecirlo.)* Katz da un motivo todavía más concreto para descartar la primera forma: **la mayoría de los MAC de uso real son determinísticos** —el `CBC-MAC`, entre ellos—, así que la etiqueta de un mismo mensaje es siempre la misma. Eso permite a un observador **detectar cuándo se envía dos veces el mismo mensaje**, con lo cual el esquema ni siquiera es `CPA`-seguro. No hace falta un MAC patológico: alcanza con uno normal.

**El estatus de las otras dos, dicho con precisión.** Acá el docente afina lo que la filmina comprime en tres palabras:

- **La segunda forma puede ser segura, y de hecho hay sistemas seguros construidos así.** Lo que no existe es una **prueba general**: no hay ningún teorema que diga *"para todo criptosistema y para todo MAC, autenticar-luego-cifrar es seguro"*. Lo que hay son **demostraciones para combinaciones concretas** de un MAC particular con un criptosistema particular. Intuitivamente resuelve el problema de la primera —vuelve confidencial también a la etiqueta, metiéndola adentro de lo que se cifra—, pero, en sus palabras, *"una cosa es que intuitivamente parezca. Otra cosa es demostrarlo"*.
- **La tercera sí tiene una demostración general**, válida **para cualquier criptosistema y cualquier MAC**. Es lo que la filmina llama *"siempre es seguro"* y lo que convierte a `Encrypt-then-MAC` en la construcción de la [[#23. Cifrado autenticado|§23]].

> [!quote]- De la transcripción — Demostraciones para ciertas combinaciones contra demostración general (cues pt2 680-693)
> la segunda forma, [autenticar] y luego cifrar Es un poco más complicada si es puede ser segura. No existe ninguna prueba general de seguridad. No hay ninguna prueba que nos diga para todo cripto sistema. Y para todo [MAC] esto va a ser seguro. Sí, intuitivamente resuelve el problema que tiene el primero, porque el problema del primero, que es que, como la etiqueta es pública. Se puede ver si la etiqueta [leakea] información. Ya fuimos el segundo método de alguna manera, lo que hace es vuelve confidencial. La etiqueta también la mete adentro de lo que se cifra Después se descifrará y se recuperará la etiqueta. [El catch] acá es que una cosa es que intuitivamente parezca. Otra cosa es demostrarlo. Entonces hay demostraciones para ciertas combinaciones de [MAC] y cripto sistemas. No hay una prueba general de seguridad, como sí hay para la tercera. cifrar y luego autenticar, o sea, generar la etiqueta del mensaje cifrado tiene una demostración general que aplica para cualquier [criptosistema] para cualquier [MAC].

**Por qué la segunda sigue viva: el dato histórico.** Si una de las formas es siempre segura y la otra depende, ¿por qué se sigue usando la segunda? Porque **la formalización de los criptosistemas autenticados es reciente**: de los últimos **veinte y pocos años**. Hay muchas herramientas seguras que se diseñaron con la idea de combinar cifrado e integridad **antes de que existieran las pruebas** del cifrado autenticado. No son inseguras: son anteriores al marco.

### La discrepancia sobre SSH

Como caso real de la segunda forma el docente nombra **`SSH`**, el shell remoto con el que *"administramos prácticamente todos los servidores del mundo"*: usa el mecanismo del medio, es seguro **por contramedidas** que mitigan todas las debilidades conocidas de esa estructura y no por una demostración, y —remata— *"si estuviésemos diseñando `SSH` hoy desde cero, seguro utilizaríamos el tercer mecanismo"*.

> [!quote]- De la transcripción — La formalización reciente y el caso SSH (cues pt2 694-707)
> Me pueden preguntar, y es totalmente válido? Bueno si tenemos una que siempre es segura y otra que la respuesta es: depende y y el depende puede ser difícil de probar porque la consideraríamos siquiera o por temas históricos. Este, la formalización de los criptosistemas [autenticados] es reciente reciente en criptografía. Es de los últimos 20 y pocos años. Me parece un montón, pero pero es bastante reciente, pero hay muchas herramientas seguras que se desarrollaron con este modelo en mente antes de de pensar en las pruebas de de criptosistemas autenticados. entre ellas una muy importante que es [SSH]. el shell remoto que usamos para administrar servidores. El Protocolo [SSH] Este utiliza el el mecanismo del medio. Sí, lo utilizas de forma segura. este y tiene un montón de contramedidas para garantizarse que, incluso sin una prueba de seguridad de esto, todas las debilidades conocidas, esta estructura que eran mitigadas. entonces es seguro. Digo, lo utilizamos para administrar prácticamente todos los servidores del mundo de una manera más automática, menos automática, entrando humanos, entrando con [script], pero se sigue usando. Así que es es seguro este: Si estuviésemos diseñando [SSH] hoy desde 0, seguro utilizaríamos el tercer mecanismo.

> **Discrepancia registrada.** *(Precisión nuestra; el argumento del docente se sostiene con cualquiera de las dos lecturas.)*
>
> El ejemplo canónico de **authenticate-then-encrypt** no es `SSH` sino **`SSL`/`TLS`**. Katz lo dice con todas las letras al analizar el protocolo: *"TLS 1.2 uses an authenticate-then-encrypt approach"* —y dedica una sección entera a los problemas que esa elección le trajo, incluido el ataque de padding sobre `CBC`—.
>
> `SSH`, en cambio, es el ejemplo canónico de la **primera** forma, `encrypt-and-MAC`: en su protocolo de transporte clásico el MAC se calcula sobre el **texto plano** —el paquete sin cifrar, con su número de secuencia— y viaja **al lado** del texto cifrado, no adentro. Es exactamente el esquema que la filmina 36 marca como inseguro.
>
> **Las dos lecturas dejan en pie lo que el docente quiso decir**: que existen sistemas ampliamente desplegados y considerados seguros que no usan la tercera forma, que su seguridad descansa en contramedidas y análisis específicos en vez de en un teorema general, y que hoy se diseñarían con `Encrypt-then-MAC`. Si la asignación correcta es `SSH` → primera forma, el argumento queda **más fuerte todavía**, porque entonces el protocolo con el que se administra medio mundo instancia la forma que el PDF marca insegura, y sigue siendo seguro sólo gracias a esas contramedidas.
>
> Queda como cabo suelto verificar la asignación contra la fuente primaria (RFC 4253 para el transporte de `SSH`; RFC 5246 para `TLS` 1.2).

### Agilidad criptográfica: por qué gana la tercera

Antes de pasar a la filmina 37, el docente se detiene en lo que él mismo presenta como *"un concepto muy importante que hasta ahora venimos ignorando completamente"*, y que resulta ser **la razón práctica —no matemática— por la que se favorece la tercera forma**.

**Toda primitiva criptográfica, por buena que sea, termina obsoleta.** No es una posibilidad: es el ciclo de vida normal, y esta misma clase lo mostró con `MD5` y `SHA-1`. Por lo tanto, **cualquier protocolo o sistema pensado para durar tiene que tener previsto el camino de actualización**: qué pasa cuando la criptografía que usa se vuelva obsoleta, y cómo se la reemplaza.

Ahí es donde la tercera forma gana, y el motivo es la **generalidad de su demostración**: como el teorema vale para *cualquier* MAC, se puede **reemplazar el MAC por otro sin volver a demostrar la seguridad del sistema completo**. Con la segunda forma no: como la prueba es para una combinación concreta, cambiar la primitiva obliga a rehacer el análisis entero.

> [!quote]- De la transcripción — Las primitivas se vuelven obsoletas y el camino de actualización (cues pt2 710-718)
> Si cuando 1 piensa ya en protocolos y empieza a salir de la abstracción matemática, y empieza a pensar en sistemas que van a van a estar funcionando. Hay un concepto muy importante que hasta ahora venimos ignorando completamente que es las primitivas criptográficas, no importa lo buenos que sean, eventualmente se vuelven obsoletas. entonces cualquier protocolo, cualquier sistema que esté pensado para durar mucho tiempo tiene que tener previsto. ¿qué va a pasar cuando la criptografía que usa se vuelva obsoleta? ¿cuál es el camino para actualizarlo? Sí, entonces la tercera forma es como que simplifica ese camino en el sentido de. Bueno, si se volvió obsoleta, el el [MAC] lo puedo reemplazar por otro. y no necesito volver a probar la seguridad en todo el sistema, como pasa el segundo. Entonces, por eso se favorece hoy día al tercero.

→ Conceptos: **[[agilidad-criptografica|Agilidad criptográfica]]** — el desarrollo completo, con la conexión al horizonte cuántico de la [[#20. Qué usar en la práctica|§20]] · **[[privacidad-e-integridad|Privacidad e integridad]]** · **[[seguridad-de-un-mac|Seguridad de un MAC]]**

---

## 23. Cifrado autenticado

La filmina 37 toma la tercera forma y la convierte en una **definición**: un criptosistema autenticado es, conceptualmente, un criptosistema que además **tiene control de integridad**. Se construye a partir de dos piezas ya conocidas —un criptosistema `CPA`-seguro $\Pi_e$ y un MAC infalsificable $\Pi_m$— y resuelve **el combo completo**: la información queda confidencial **y** se puede detectar cualquier manipulación.

$$
\begin{aligned}
\mathsf{Gen}&: \quad k_1 \leftarrow \mathsf{Gen}_e, \quad k_2 \leftarrow \mathsf{Gen}_m \\
\mathsf{Enc}&: \quad c \leftarrow \mathsf{Enc}_{k_1}(m), \quad t \leftarrow \mathsf{Mac}_{k_2}(c) \\
\mathsf{Dec}&: \quad \text{si } \mathsf{Vrfy}_{k_2}(c,t) = 1 \;\Rightarrow\; m = \mathsf{Dec}_{k_1}(c); \quad \text{si no} \;\Rightarrow\; \perp
\end{aligned}
$$

El orden del descifrado importa y el docente lo recorre en ese orden: **primero se verifica, después se descifra**. Si la verificación falla no se descifra nada.

**Y el resultado es `CCA`-seguro**, que es exactamente la prueba que la [[#5. Ataques de texto cifrado escogido: CCA|§5]] había introducido para modelar la manipulación arbitraria del texto cifrado. El arco de la clase cierra ahí: la prueba que se definió para nombrar el problema es la que la construcción termina ganando.

> [!quote]- De la transcripción — Definición verbal del criptosistema autenticado (cues pt2 720-731)
> Un criptosistema autenticado es un conjunto de a ver perdón. Un criptosistema autenticado es conceptualmente un criptosistema que tiene controles de integridad. También. Sí, hay más de una forma de construirlo. Sí. La primera forma de construirlo es a partir de un criptosistema que sea. C, p. ¿que pase la prueba de [Chosen Plaintext Attack] sí que si se acuerdan, es lo más avanzado que vimos dentro de criptosistemas hasta llegar a los problemas de integridad y un [MAC] que sea infalsificable a partir de un criptosistema. [Si es CPA-seguro y un MAC infalsificable], se puede construir un criptosistema autenticado un cripto al sistema autenticado de vuelta. Nos resuelve el combo completo. Nos garantiza que la información queda confidencial y podemos detectar cualquier manipulación de la información.

### El modo de falla nuevo

Esto es lo mejor de la sección, y es material que el vault tenía **sólo como un símbolo**: el $\perp$ de la última línea del `Dec`.

**Desde afuera, un criptosistema autenticado puede FALLAR al descifrar. Un criptosistema tradicional no falla nunca.** A un criptosistema clásico se le puede entregar cualquier cadena de bits como texto cifrado y siempre devuelve algo: en el peor caso, basura aleatoria. No tiene forma de saber que le mintieron. El autenticado sí la tiene, y por eso **gana una salida que antes no existía**.

El docente lo baja a implementación, que es donde el símbolo se vuelve código:

- En un **lenguaje con excepciones**, el fallo será casi seguro **una excepción**.
- En un **lenguaje con códigos de error**, será **un código de error específico**.
- Y falla **exactamente cuando detecta manipulación** del texto cifrado. No es un fallo aleatorio ni un caso borde: es la señal de que alguien tocó el criptograma.

Para quien programa, eso cambia la forma del código: descifrar deja de ser una operación total y pasa a ser una operación que hay que envolver, con una rama de error que el criptosistema clásico no tenía dónde poner.

> [!quote]- De la transcripción — La falla al descifrar como excepción o código de error (cues pt2 738-746)
> y acá aparece la gran diferencia. Cuando miramos los criptosistemas [autenticados] desde afuera, existe un modo de falla nuevo al pedir el descifrado de un texto cifrado. sí, el un criptosistema autenticado puede darnos como resultado una falla. Esto ya depende de cómo esté implementado. Se está en en un lenguaje con excepciones, probablemente es una excepción en un lenguaje con códigos de errores. Tendrá un código de error específico. pero, a diferencia de lo que pasaba con los criptosistemas tradicionales que yo le tiro. Un mensaje, y de última me sale un texto de cifrado que es aleatorio basura. Este Los cripto sistemas [autenticados] pueden fallar y van a fallar casualmente. Cuando detectan algún tipo de manipulación en el texto cifrado.

### Cómo se ve desde afuera, y cómo se llama en las librerías

La filmina genera **dos claves** y produce **dos salidas**, $c$ y $t$. En la práctica nada de eso asoma por la API: **desde afuera un criptosistema autenticado se ve como un criptosistema común**, con dos diferencias cosméticas:

- **Una clave "más grande"** — porque las dos claves van concatenadas en una sola.
- **Un texto cifrado "un poco más largo"** — porque la etiqueta viaja adentro de él.

Y, por ser autenticado, gana la resistencia a manipulaciones del texto cifrado que se mide con `CCA`.

**Los nombres.** No hay estándar de nomenclatura, pero la convención habitual compone el nombre del criptosistema con el del MAC o del `HMAC`. El docente nombra dos que se encuentran tal cual en las librerías: **`AES-HMAC-SHA-1`** y **`AES-HMAC-SHA-3`**.

> [!quote]- De la transcripción — Nombres de librería y la vista de interfaz (cues pt2 754-761)
> en las librerías. No hay no hay un estándar para esto, pero típicamente es alguna función criptográfica que empieza con el nombre del criptosistema. sí e incluye el nombre de alguna de algún [MAC] o de algún [HMAC]. entonces puede encontrarse con, por ejemplo, [AES-HMAC-SHA-1] o [AES-HMAC-SHA-3]. Eso es un criptosistema autenticado, seguro desde afuera se ven como un criptosistema. Sí, porque a acá generamos 2 claves, ¿no? Pero esto desde afuera, se ve como una clave más grande. Simplemente este. El cifrado se genera en 2 partes, pero lo que se ve desde afuera es como un texto cifrado un poco más largo, porque en algún lugar tiene la etiqueta. Entonces, desde afuera se ven como criptosistema, pero por ser autenticados ganan esa capacidad de ser resistentes en la prueba contra manipulaciones del texto cifrado.

→ Conceptos: **[[cifrado-autenticado|Cifrado autenticado]]** · **[[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]]** · **[[privacidad-e-integridad|Privacidad e integridad]]**

---

## 24. CCM y GCM

La construcción de la filmina 37 funciona, pero paga un precio visible: **duplica el material de clave**. El docente señala que ése es *"lo que más se ve como factor negativo desde fuera"*. De la investigación posterior salieron **modos de encadenamiento** más sofisticados que los de la [[clase-02-cifrado|Clase 02]] y que consiguen integridad **sin extender el tamaño de la clave**. Hay varios; **dos ganaron relevancia**, y son los de las filminas 38 y 39.

### CCM, y el dato de que está en retirada

`CCM` significa **Counter with CBC-MAC** e instancia la **segunda** forma de la [[#22. Privacidad e integridad: las tres formas|§22]], *authenticate-then-encrypt*:

$$c \;=\; \mathsf{Enc}_k\bigl(\mathsf{CBC\text{-}MAC}_k(m) \,\Vert\, m\bigr)$$

**Estado actual, que la filmina no dice y el vault no tenía:** de los dos modos, `CCM` es **el menos relevante hoy**. Lo fue *"hasta hace cinco años"*; sigue apareciendo y hay que saber leerlo, pero **está cayendo en desuso**. La filmina lo presenta sin ninguna indicación de esto.

> [!quote]- De la transcripción — Por qué aparecen estos modos y que CCM está en retirada (cues pt2 763-772)
> posterior a esta definición y bueno y productos de investigación se encontró que 1 podría definir algunos modos de encadenamiento para las funciones de criptosistemas de bloque que sean un poco más sofisticados que los que vimos y que de alguna manera ganen la capacidad de de de hacer controles de integridad. en particular sin la necesidad de duplicar o de extender el tamaño de la clave, que es por ahí lo que más se ve como factor negativo desde fuera. Y en la actualidad, si bien hay varios. Hay 2 modos de encadenamiento nuevos que están ganando cada vez más relevancia. Si este es el de los 2, este es el menos relevante, si quieren. Hoy día lo fue hace hasta hace 5 años, pero pero ahora está, se lo van a encontrar, probablemente, pero está cayendo en desuso. Se llama [CCM].

Antes de desarrollarlo el docente **repasa el modo counter con la clase** —responde Tomás Pietravallo (cues pt2 777-786)—: se cifra un bloque formado por **una parte aleatoria y un contador** que arranca en 1, 2, 3, 4; el resultado es la secuencia con la que se hace el XOR bit a bit contra el mensaje. Se llama *counter* porque el contador es lo que garantiza que los bloques de entrada **nunca se repitan**, que es el único requisito del modo. Ese repaso es material de la [[modos-de-encadenamiento|Clase 02]], no de ésta.

**Cómo funciona `CCM` de punta a punta**, incluyendo el descifrado, que la filmina no muestra: se calcula el `CBC-MAC` del mensaje, se lo usa como **prefijo**, y se cifra todo junto. Al descifrar se recupera la concatenación etiqueta $\Vert$ mensaje, se **recalcula** el `CBC-MAC` del mensaje recuperado y se **compara** contra la etiqueta que venía adentro. Si difieren, hubo manipulación.

**El detalle que el docente marca como subrayable** —textualmente, *"el detalle no menor que no sé si tendría que resaltarlo más"*— es que **las dos claves son la misma**. En la construcción genérica de la filmina 37 hacen falta dos claves independientes; `CCM` usa una sola, y puede hacerlo porque **existe una prueba de seguridad específica de esta construcción**, con una condición precisa: **el IV que aparece en el `CBC-MAC` y el nonce que usa el modo counter no deben coincidir ni reutilizarse**. Bajo esa condición, `CCM` es `CCA`-seguro con una única clave.

**Esa demostración no está en Katz**, y la cátedra se compromete a subirla al campus como material adicional —lo que la filmina 38 anota como *"(ver material adicional en Campus)"*—.

**El precio: la mitad de la velocidad.** `CCM` consigue cifrado autenticado sin duplicar la clave, pero **procesa el mensaje dos veces**: una para calcular el MAC y otra para cifrarlo. Por eso corre, típicamente, a **la mitad de la velocidad de un modo counter normal**. Durante mucho tiempo ése fue un compromiso aceptable —integridad a cambio de la mitad del rendimiento—.

> [!quote]- De la transcripción — La clave única, la prueba prometida al campus y el costo del doble procesamiento (cues pt2 798-815)
> el detalle no menor que no sé si tendría que resaltarlo más. Acá Fíjense que esta clave, acá y esta clave acá son la misma. porque hay una prueba de seguridad específica para esta construcción que dice que si el [IV] que aparecería en el [CBC-MAC] y el nonce que se utiliza en el counter no coinciden, O sea, no son el mismo número ni se reutilizan la construcción. Sí, [es CCA-secure] usando la misma clave. Sí, esta demostración no está en el libro de [Katz]. Se la vamos a subir para los que quieran como material adicional en campus. porque es es interesante, no complicada, No es tan trivial, pero este si a alguien le interesa para profundizar. Está buena. Está bueno lo lo que hacen para demostrar. Pero fíjense esto: logra de alguna manera darnos un criptosistema autenticado sin duplicar el tamaño de la clave. Así que esto, durante mucho tiempo fue un [trade-off] Bueno, porque porque digo un compromiso. porque aquí hay un compromiso, o sea, si no duplicamos el tamaño de la clave. Pero pero hay que procesar de alguna manera y que cifrar el mensaje 2 veces: una para calcular [MAC] y después otra para cifrar el mensaje en sí mismo. Si entonces el modo. [CCM] Típicamente es la mitad. Va Va a la mitad de velocidad que el que los modos normales. No sé que un counter, por ejemplo. sí a cambio de ese mitad de velocidad nos garantiza control de integridad también. Entonces fue muy bueno.

> **Cuidado con generalizar la clave única.** La [[practica-04-macs-hash-y-cifrado-autenticado#14. El ejercicio: claves iguales rompen encrypt-then-MAC|Práctica 04]] demuestra, en su último ejercicio, que **usar la misma clave para cifrar y para autenticar rompe `Encrypt-then-MAC`**. No hay contradicción con `CCM`: reutilizar la clave es inseguro **en general**, y admisible **sólo** cuando existe una prueba específica del modo concreto que la habilita bajo condiciones concretas —acá, IV y nonce distintos y no reutilizados—. La regla operativa es la de siempre: no se reusa clave salvo que un teorema lo autorice explícitamente.

### GCM

`GCM` es el **modo superador**, y es hoy el cifrado autenticado de bloque más usado bajo el nombre **`AES-GCM`**.

**La anécdota de la patente.** El docente cuenta que el modo superador *"se inventó antes que `CCM`"*, pero sus autores lo patentaron y exigieron regalías a quien lo implementara, con lo cual **nadie lo implementó durante unos ocho años**, hasta que lo liberaron.

> [!quote]- De la transcripción — La patente que habría demorado ocho años la adopción (cues pt2 816-821)
> pero hay una versión superadora de esto. Otro modo de encadenamiento que de hecho se inventó antes que [CCM] pasa que los autores del modo no tuvieron mejor idea que patentarlo y querer exigirle a todos los que lo implementen y paguen regalías. con lo cual consiguieron que nadie lo implemente por unos 8 años hasta que tiraron la toalla y lo liberaron al público. Este Y recién ahí empezó a usarse el modo superador del [CCM]. Se llama [GCM].

> **Corrección de fondo** *(precisión nuestra; no descalifica la anécdota, que es real pero de otro modo).*
>
> **La historia de la patente es la de `OCB`, no la de `GCM`.** `OCB` (Rogaway, 2001) fue el modo autenticado de un solo paso que quedó frenado por reclamos de patente durante años, hasta que sus licencias se fueron liberando. `GCM` (McGrew y Viega, 2004; estandarizado por el NIST en **SP 800-38D**, 2007) se diseñó **explícitamente libre de patentes**, y ésa fue una de sus banderas de adopción.
>
> **Y el orden temporal también está invertido.** `CCM` (RFC 3610, 2003; NIST SP 800-38C, 2004) es **anterior** a `GCM`, y nació justamente como **alternativa sin patentes a `OCB`** para el estándar de `WiFi` 802.11i. O sea: `CCM` existe *porque* `OCB` estaba patentado, y `GCM` llega después de los dos.
>
> Lo que la anécdota conserva intacto es su moraleja, que es la que el docente quería transmitir: **una patente puede sacar de circulación un diseño criptográficamente superior durante casi una década**, y por eso *"libre de patentes"* aparece como criterio de elección tanto acá como en el cierre de la [[#20. Qué usar en la práctica|§20]] sobre `SHA-3`.

**Qué es `GHASH`.** La *G* de `GCM` es *Galois*, y viene de la función de hash con la que se calcula la etiqueta: **`GHASH`**, una función de hash iterativa —*"de las más experimentales, no tan mainstream"*— que procesa bloque a bloque y **convierte cada bloque en un polinomio**. La traducción es directa y el docente la da explícita:

> **Cada bit del bloque es el coeficiente de un grado sucesivo.** Un bloque de 128 bits da un polinomio con término constante, término lineal, cuadrático, y así hasta $x^{127}$. Donde el bit vale 1, ese grado aparece con coeficiente 1; donde vale 0, ese término no aparece.

Sobre esos polinomios se trabaja en un **campo de Galois**, $\mathrm{GF}(2^{128})$: un campo algebraico cuyos elementos **son polinomios** y donde se los puede sumar y multiplicar como si fueran números, reduciendo el resultado por el resto contra **otro polinomio fijo**, el *polinomio reductor*, que caracteriza el espacio y **es siempre el mismo**. La filmina lo escribe:

$$\mathrm{Mult}(x,y) \;=\; x \cdot y \bmod \bigl(x^{128} + x^{7} + x^{2} + x + 1\bigr)$$

La iteración es multiplicativa: se parte de un estado, y **cada estado siguiente sale de multiplicar en el campo el bloque entrante contra el estado anterior**. El docente remata que, pese a lo intimidante que suena, la implementación es *"terriblemente rápida"*.

> [!quote]- De la transcripción — De bloque a polinomio, y la iteración en el campo de Galois (cues pt2 824-843)
> un counter sí, pero la Ge es lo que lo diferencia básicamente hay entre las funciones de hash más experimentales que digo, no. no, no son tan mainstream. Hay una que se llama [GHASH], que es [de Galois]. que básicamente a ver si la tengo que simplificar mucho. Ahí está la versión simplificada. Es una función de [hash] iterativa parecida a todas las que vimos, queda procesando bloque a bloque. Y lo que hace de alguna manera es convertir a cada bloque en en un polinomio. Sí, la forma más fácil de verlo es, imagínense a cada bloque como un polinomio donde cada bit del bloque es el coeficiente de un grado sucesivo. Entonces, si tengo un bloque de 128 bits, va a haber un factor constante, un factor lineal x x cuadrado [hasta x a la 127] sí. Y donde el [bit] el mensaje era, 1. Aparece Ese bloque tiene 1 de coeficiente. Donde había un 0, aparece como 0, Ese [bloque], o sea, no aparece. Hay un campo algebraico que se llama [de Galois], en el cual los elementos son polinomios y 1 puede definir operaciones sobre los elementos como si fuesen números, puede multiplicar polinomios, reducir los restos. Otro polinomio. Este y aunque suene re complicado, es es súper eficiente la forma en la que se implementa eso. En particular, el hash, el [GHASH], el hash de Galois, trata a cada bloque como si fuese un polinomio. Y lo que va haciendo es la multiplicación. o sea, toma un estado inicial. Y lo que va haciendo es sacando el Estado siguiente como el resultado de multiplicar en un campo [de Galois] la representación en polinomio del bloque y del Estado anterior, y eso al Estado siguiente. Ese Estado convertido a polinomio, se mezcla y se multiplica con el polinomio del bloque siguiente. y así sucesivamente. Eso es es terriblemente rápido.

> **Precisión sobre la descripción oral.** *(Precisión nuestra; la filmina está bien y la voz se desliza.)* Tal como quedó dicha, la iteración sería *"multiplicar el polinomio del bloque por el del estado anterior"*. La recurrencia real de `GHASH` es
> $$X_i \;=\; \bigl(X_{i-1} \oplus C_i\bigr) \cdot H$$
> es decir: el estado se **XOR-ea** con el bloque y el producto es siempre contra **la constante $H$**, no contra el bloque. Lo dice la propia filmina 39 al escribir $\mathrm{Mult}_H(x) = \mathrm{Mult}(x, H)$ con $H = \mathsf{Enc}_k(0^{128})$. Y por lo mismo, $H$ **no es el "valor inicial" del estado** sino la **subclave de hash**, el multiplicador: el estado arranca en $0^{128}$. La distinción importa porque quien estudie sólo de la transcripción se lleva una recurrencia que no reproduce ninguna etiqueta real.

**La reserva del docente, que el vault no tenía.** Es la única advertencia crítica sobre `GCM` de toda la clase, y contrasta con la recomendación práctica de usarlo: la etiqueta de `GHASH` *"todavía no está tan demostrada que sea robusta ante todo tipo de ataques, especialmente algebraicos"*. Su construcción es **puramente matemática** y **no tiene tantos años de estudio** como las anteriores, así que queda —en sus palabras— *"en un segundo nivel versus las más estudiadas"*.

> [!quote]- De la transcripción — La reserva sobre la madurez de GHASH (cues pt2 844-846)
> Tiene sus temas, Tiene sus temas, si quieren. En particular. es una etiqueta que todavía no está tan demostrada que sea robusta. Ante todo, el tipo de ataques especialmente algebraicos. La construcción de esa etiqueta es puramente matemática. Este y todavía no tiene tantos años de estudio como las anteriores. Entonces es como que había cierta, si quieren estar en un segundo nivel versus las más estudiadas.

**La estructura, leída sobre el diagrama.** El docente recorre la filmina 39 con el cursor y da la clave de lectura: **si se corta el esquema por la mitad, la parte de arriba es un cifrado en modo counter** —se genera un contador por bloque, se lo cifra y se lo usa para cifrar el bloque— **y la parte de abajo calcula, en paralelo, el `GHASH` de los textos cifrados**. Es decir: `GCM` **instancia la tercera forma**, cifrar y luego autenticar. La filmina no hace esa conexión; el docente la hace dos veces.

![GCM](../../assets/clase03-gcm.png)

El recorrido del diagrama, paso por paso:

1. Se toma un **buffer inicial de ceros** y se lo cifra una vez. *(Eso produce $H$; ver la precisión de arriba.)*
2. Se **mezcla con el texto cifrado 1** para obtener el estado siguiente; con el texto cifrado 2, el siguiente; y así.
3. Al final **se agregan las longitudes** —del mensaje cifrado y de los datos autenticados— en un bloque propio.
4. De ahí sale la **etiqueta de autenticación**, y el texto cifrado que se emite es la **concatenación de los bloques cifrados con esa etiqueta**.

Ahí aparece, de pasada, el **AAD**: `GCM` permite tener **datos que no se cifran pero sí se autentican**. Es lo que las cajas *Auth Data* del diagrama dibujan sin nombrar, y lo que hace que el modo sirva para un paquete de red, donde la cabecera tiene que viajar legible para que la lean los routers pero no puede ser modificable. **El vault ya lo tenía** —[[ccm-y-gcm|03.14]] lo desarrolla como AEAD desde las especificaciones—, pero hasta ahora no tenía **ni una sola mención hablada** de la cátedra que lo respaldara: ésta es la primera.

**El costo, y por qué desplaza a `CCM`.** Cada bloque del mensaje **se procesa una sola vez**: se cifra, se guarda el resultado para la salida y además se multiplica en el campo. Las multiplicaciones son livianas; **el costo lo domina íntegramente el cifrado**, igual que en un modo counter común. Contra las **dos** pasadas de `CCM`, `GCM` hace **una**.

Y como el estado se va acumulando, **admite procesamiento en streaming**: se puede ir emitiendo el texto cifrado bloque a bloque a medida que el mensaje llega, y calcular la etiqueta al final, sin tener nunca el mensaje completo en memoria ni recorrerlo dos veces. Es la ventaja decisiva sobre `CCM`, que necesita el mensaje entero antes de poder cifrarlo.

> [!quote]- De la transcripción — Valor inicial, longitudes, AAD, streaming y por qué es el más usado (cues pt2 858-881)
> Y esto, cómo funciona? Tomamos un buffer inicial? Sí que suele ser todo ceros. Lo ciframos una vez. Y este es como el valor inicial. y a partir de acá lo vamos mezclando con el texto cifrado Uno: calculamos el próximo Estado el texto cifrado 2: calculamos el próximo estado. Al final de esto se le agregan las longitudes. Si quieren la longitud del mensaje que tiene otro modo que no viene al caso. Acá, este permitiría cifrar, te tener data que no está cifrada, pero también está autenticada la parte de [data no cifrada], Pero no importa, se agrega la longitud del mensaje cifrado. Si quieren muy parecido a lo que solíamos hacer con todo. y de ahí sale el tag de autenticación. Entonces el texto cifrado que termina saliendo es la concatenación de el cifrado de cada 1 de los bloques y la etiqueta de autenticación [fíjense]. En particular, trabaja con polinomios. En un espacio, el espacio se caracteriza por por el polinomio reductor, se le llama [GHASH] [128] en este caso tiene este polinomio polinomio particular con ciertas propiedades. No importa, pero es siempre el mismo que básicamente termina definiendo. ¿qué significa multiplicar estos 2 polinomios. Esta operación en particular no son operaciones caras, pero lo más importante es, fíjense que cada bloque del mensaje se procesa una sola vez se cifra a resultados cifrado. se lo guarda para la salida y, además, se lo multiplica. Y si quieren, hay un cálculo adicional Al final, para agregar la longitud de bloque de vuelta, estas operaciones son mucho más livianas. El el costo lo domina totalmente el el cifrado de cada bloque. pero fíjense que si yo lo pienso ma más en modo streaming, no voy procesando cada bloque, puedo ir emitiendo el texto cifrado: 1, el 2 o el 3, la llego al último. Esto es estado interno, que se va acumulando. Y cuando llego al último calculo esto y emito esto. entonces tiene la ventaja de de de poder ir procesando un mensaje mientras va se va generando buenísimo me genera una etiqueta, sigue el modo que ya sabemos que es seguro por default de autenticar el mensaje cifrado y el mensaje plano se va autenticando, se va generando en la autenticación a medida que se procesa el mensaje, no tengo que procesarlo 2 veces. El mensaje [GCM] es hoy día el el tipo de criptosistema de bloque autenticado que más se utiliza, entonces

### El inventario de modos: con esto alcanza

Terminado `GCM`, el docente abre turno de preguntas (cue pt2 882) y no obtiene ninguna. Cierra entonces el inventario completo de **modos de encadenamiento** de la materia:

- **Cinco** vistos en la clase de criptosistemas de bloque —que atribuye a otro docente, *"Rodri"*, grafía del ASR sin confirmar—.
- **Dos** en ésta: `CCM` y `GCM`.
- Existen **muchos más**, de usos muy específicos; si aparece alguno habrá que leer qué lo diferencia de los estándares.
- **Con estos siete se cubre el 99 por ciento de las aplicaciones que requieren criptografía.**

> [!quote]- De la transcripción — Cinco más dos, y el 99 por ciento de las aplicaciones (cues pt2 883-890)
> Okay, yo creo que la me no No sé si lo llego a mencionar Rodri cuando vieron cryptosistemas, pero de bloques. Nosotros vimos 5 mecanismos si quieren, ignorando el [ECB], que es no encadenar. Acá Vemos 2 más. Hay muchos más mecanismos de de encadenamiento en general. 99 por [ciento] de las aplicaciones requieren estos. El resto ya son de usos súper específicos donde si alguna vez les aparece, tendrán que leer. ¿qué diferencia a esos criptos a esos modos de encadenamiento de los estándares. Y ojalá apliquen en el lugar donde estén. Si no, con esto cubren el 99 por [ciento] de las aplicaciones que requieran criptografía.

> **Discrepancia menor en la cuenta.** El docente dice *"5 mecanismos… ignorando el `ECB`"*, lo que daría **seis** modos en la Clase 02. La nota del vault [[modos-de-encadenamiento#Los cinco modos|Modos de encadenamiento]] registra **cinco contando `ECB`**: `ECB`, `CBC`, `CFB`, `OFB` y `CTR` — o sea **cuatro** ignorándolo. Queda como cabo suelto verificar si la clase de bloques dio un sexto modo que la nota no recoge, o si el docente contó de memoria. La cuenta final que importa —*estos modos cubren el 99 por ciento*— no depende de resolverla.

→ Conceptos: **[[ccm-y-gcm|CCM y GCM]]** · **[[modos-de-encadenamiento|Modos de encadenamiento]]** · **[[cifrado-autenticado|Cifrado autenticado]]** · **[[cbc-mac|CBC-MAC]]**

---

## 25. Cierre: la integridad implícita y la bibliografía

Los últimos minutos son **consejo dirigido a ingenieros que construyen sistemas**, y cierran el arco narrativo que la primera sesión había abierto ocho días antes con la [[#3. Un nuevo tipo de ataque: la base de sueldos|base de datos de sueldos]].

**El relevamiento de requerimientos miente por omisión.** Si uno releva requerimientos para ese sistema, lo único que le van a decir es *"los sueldos de los empleados son confidenciales"*. Nadie va a mencionar integridad. Pero en sistemas reales **los casos que necesitan sólo confidencialidad son de nicho**: cuando aparece un requerimiento no funcional de seguridad que habla de confidencialidad, **la integridad está implícita**, aunque el dueño de los requerimientos no lo tenga claro. Es exactamente lo que la filmina 40 escribe —*"en aplicaciones reales, el requerimiento de privacidad lleva implícito el de integridad"*— convertido en regla de relevamiento.

**Y con eso se cierra la chicana del 27/08.** El docente vuelve al ejemplo con el que abrió: *"pero nuestro criptosistema cubre el problema de las bases de datos, no pueden ver el sueldo"*. Sí lo cubría, y sin embargo **había un problema**: el atacante no necesitaba leer el sueldo para subírselo. La respuesta —la que faltaba entonces— es el cifrado autenticado.

**El consejo operativo**, sin matices: *"no hay razón de peso hoy día para no tratar de usar siempre criptosistemas autenticados hasta que se demuestre lo contrario"*, y el remate — **"erren por ese lado"**—. Lo que lo vuelve gratis es `GCM`: da prácticamente la misma performance con la integridad ya incluida, así que el costo de equivocarse por exceso es cero y el de equivocarse por defecto es el ataque de la filmina 8.

> [!quote]- De la transcripción — La integridad implícita y el cierre del ejemplo de los sueldos (cues pt2 891-906)
> Un par de cosas prácticas, especialmente para nosotros, ingenieros, que vamos a construir sistemas en términos generales. piensen en el ejemplo de la base de datos. Si ustedes estaban relevando requerimientos, probablemente lo único que les hubiesen dicho es no. Los sueldos de los empleados son confidenciales. Mhm en en sistemas reales. Son muy, muy de nicho. Los casos donde requieran solo confidencialidad, sin integridad en general. cuando escuchen hablar de confidencialidad casi siempre viene acompañado implícitamente de integridad por ese motivo, y porque existen cosas como [GCM], que prácticamente nos dan la misma performance con integridad adicionada. salvo que es una razón muy, muy buena. El El consejo normal es usar solo [criptosistemas] autenticados. Hay casos de nicho donde se necesitan las cosas por separado definitivamente. Y tal vez algún protocolo que ustedes estén usando lo requiera por definitivamente. Pero tengan en cuenta que, en general, cuando escuchan o requerimientos no funcionales de seguridad que hablen de confidencialidad. La integridad está implícita. Es un poco. Se acuerdan que yo les tiré un poco la chicana de [:] pero nuestro criptosistema con el problema de las bases de datos. Lo cubre. No pueden ver el sueldo, pero ustedes creen que hay un problema, Y veo la respuesta. Pues sí, hay un problema. Es muy implícito, y por ahí la persona que pide que que dueña de los requerimientos. No lo tiene tan claro. Pero en general pasa esto. O sea, no, no hay razón de peso hoy día para no tratar de usar siempre criptosistemas autenticados hasta que se demuestre lo contrario. Si, como Consejo erren por ese lado en los sistemas que construyen

### Las dos cosas administrativas

La transcripción termina en el cue pt2 909 con la filmina 41 y **dos anuncios**, ninguno de los cuales había ocurrido el 27/08:

1. **La lectura designada queda encargada en voz.** *"Todo lo que es integridad desde el punto de vista de criptografía se cubre en el **capítulo 4** del libro de Katz."* Es lo que la filmina 41 escribe —*Introduction to Modern Cryptography*, Katz & Lindell— y que la sesión del 27/08 **no llegó a proyectar ni mencionó en ningún cue**. El [[#Cabos sueltos|cabo suelto]] que esta nota había dejado abierto —*"se va a encargar el 03/09"*— queda **cerrado y cumplido**.
2. **Hay material extra prometido al campus.** *"Algunos de los temas que vimos no están en el libro de Katz, les vamos a subir material extra en campus"*, sobre todo **demostraciones y propiedades no tan básicas**. Es la segunda promesa de material del día: la primera fue la demostración específica de `CCM` (cues pt2 806-808). **Ese material no está en `raw/`**, así que queda como cabo suelto nuevo: hay que bajarlo del campus.

> [!quote]- De la transcripción — Katz capítulo 4 y el material extra prometido (cues pt2 907-909)
> bien, estos temas, todo lo que es integridad desde el punto de vista de criptografía, se cubre en el capítulo 4 del libro de [Katz]. algunos de los temas que vimos no están en el libro de [Katz], les vamos a subir material extra en campus para los que quieran profundizar más que nada. demostraciones o algunas propiedades no tan básicas.

**La grabación corta ahí.** No hay cierre administrativo, no hay saludo y —como en la sesión del 27/08— **no hay ninguna mención del parcial del 24/09**. Las dos jornadas de la Clase 03 suman 1783 cues y en ninguna aparece una sola referencia a fechas de examen ni a entregas.

→ Conceptos: **[[cifrado-autenticado|Cifrado autenticado]]** · **[[ccm-y-gcm|CCM y GCM]]** · **[[maleabilidad|Maleabilidad]]** · **[[bibliografia|Bibliografía]]**

---

## Erratas y precisiones de las filminas

La primera fila va fuera de orden a propósito: es la única errata que **la cátedra reconoce en voz alta** durante la clase. El resto va por número de slide.

**Reescrituras de filas ya existentes:** filminas **33**, **35** y **37**.
**Filas nuevas:** filminas **36**, **38** y **39**.

| Filmina | Dice | Debería decir |
|---|---|---|
| 15 | *"Dado un nivel de seguridad $n$, un adversario $A$, y un **Criptosistema** $\Pi(n)$"* | **un MAC** — `Mac-Forge` se corre contra la terna $(\mathsf{Gen},\mathsf{Mac},\mathsf{Vrfy})$, no contra un criptosistema; es copy-paste del slide de `CPA`. **La corrige el propio docente en vivo** (cue pt1 425): *"ignorando que la presentación tiene un error —¿no?— y hablo de un criptosistema, lo corrijo"*. Es la única errata que la cátedra reconoce en voz alta en toda la clase — ver [[seguridad-de-un-mac\|Seguridad de un MAC]] |
| 3 | *"Si $\Pr[\mathsf{CPA}_{A,\Pi}=1] = 0.5 + \varepsilon$ ⇒ $\Pi$ es indisting."* | $\varepsilon$ tiene que ser **despreciable** en $n$, no cualquier valor: tal como está, todo criptosistema con ventaja fija pasaría — ver [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]]. *(Precisión nuestra.)* |
| 10 | La cuenta del *Backstage del ataque* cierra en `2F69F0`, con el último byte en binario como `11110000` | **`2F69E0`**, con el último byte `11100000`. Los tres valores de la columna se XOR-ean en decimal —$\texttt{0x2EDF79} \oplus \texttt{0x003039} \oplus \texttt{0x0186A0}$—, y el último byte da $\texttt{0x79} \oplus \texttt{0x39} \oplus \texttt{0xA0} = \texttt{0xE0}$, no $\texttt{0xF0}$. Los otros dos bytes de la filmina están bien; el error se arrastra al criptograma adulterado de la filmina 8. **El docente no lo corrige**, ni acá ni en el [[video-04-integridad-de-la-informacion-1\|video 04]]. *(Errata nuestra, verificada renderizando la página 10 del PDF, no leyéndola con `pdftotext`.)* |
| 11 y 15 | `neg(n)` | $\mathsf{negl}(n)$, *"negligible"*: la abreviatura incompleta se presta a confusión con una función $n$-ésima |
| 21 | El ataque al sufijo se enuncia con `AAA`, `BBB`, `AAA3CC`, $X = t_1 \oplus t_2 \oplus C$ y *"Emitir (BBB3XC, $t_3$)"* | El mecanismo es correcto, pero el slide queda **incompleto**: no cierra por qué el par $(\mathsf{BBB3XC},\, t_3)$ verifica. El desarrollo está en [[cbc-mac#Por qué la longitud como sufijo no sirve\|CBC-MAC § Por qué la longitud como sufijo no sirve]] |
| 22 | *"$h = H_s(m)\ \varepsilon\ \{0,1\}^{L}$"* | El símbolo es **$\in$** (pertenece), no la letra $\varepsilon$ — ver [[funciones-de-hash-criptograficas\|Funciones de hash criptográficas]] |
| 32 | *"Entrada: secuencia de hasta $2^{64}$ bits"* para `SHA-3`, copiada tal cual de los slides de `MD5` y `SHA-1` | **Falso para `SHA-3`**: ese límite viene del campo de longitud de la construcción [[construccion-de-merkle-damgard\|Merkle-Damgård]], y Keccak no la usa — su esponja **no tiene límite de entrada** — ver [[primitivas-de-hash-estandar\|Primitivas de hash estándar]] |
| 31 | *"Se construye sobre la base de **MD5**"* | Impreciso: `SHA-1` y `MD5` **comparten linaje** (MD4) y estructura Merkle-Damgård, pero `SHA-1` no se construye sobre `MD5`. *(Precisión nuestra.)* |
| 35 | *"Antes conocida como **Kekkak**"* | **Keccak** — el candidato que el NIST eligió para `SHA-3` en 2012 |
| 35 | `SHA-1` figura en *"Primitivas recomendadas"* **sin ninguna marca**, al lado de `MD5 → Quebrada` | **No es una errata de maquetación: es la posición de la cátedra**, dicha en voz. *"`SHA-1` incluso es seguro para un sistema normal; está como en un horizonte, digamos, en el borde"* (cues pt2 567-568), y en toda la sesión la única alerta es sobre `MD5`. **La wiki registra un desacuerdo explícito**: `SHA-1` está quebrada desde SHAttered (2017, colisión real a $\approx 2^{63}$), el NIST la deprecó en 2011 y prohibió su uso en firma desde 2013. Ver [[#20. Qué usar en la práctica\|§20]], [[primitivas-de-hash-estandar\|Primitivas de hash estándar]] y [[seguridad-de-las-funciones-de-hash\|Seguridad de las funciones de hash]]. *(Reescritura: dejó de ser errata y pasó a desacuerdo argumentado.)* |
| 33 | $\mathsf{opad} = \texttt{0x36}\ldots\texttt{36}$, $\mathsf{ipad} = \texttt{0x5c5c}\ldots\texttt{5c}$ | **Los valores están intercambiados** (RFC 2104: $\mathsf{ipad}=\texttt{0x36}$ *inner*, $\mathsf{opad}=\texttt{0x5c}$ *outer*); la fórmula de la misma filmina sí está bien. **Dos datos nuevos del 03/09:** el docente **no la corrige en voz** —sólo dice que la prueba exige que las constantes sean distintas (cues pt2 599-602)—, y **la misma errata está en la filmina 13 de la [[practica-04-macs-hash-y-cifrado-autenticado\|Práctica 04]]**, con la fórmula igualmente correcta debajo: **es sistemática de la cátedra, no el desliz de una lámina**. Que la prueba no dependa de cuál es cuál explica que pase desapercibida; la conformidad con el RFC sí depende. Ver [[hmac\|HMAC]] *(Reescritura.)* |
| 33 | Se enuncia `HMAC` directamente, sin construcción intermedia | La construcción de la que `HMAC` es la instanciación —**`NMAC`**, con dos claves explícitas— **no aparece en ninguna de las 41 filminas de teoría**, y sin ella la anidación queda sin motivación. Sí está en la **filmina 12 de la [[practica-04-macs-hash-y-cifrado-autenticado#11. NMAC, el escalón que falta hacia HMAC\|Práctica 04]]**, dictada tres días antes. *(Omisión de la teoría, no dato falso. Fila nueva sobre una filmina que ya tenía otra.)* |
| 36 | *"Cifrar, luego Autentificar — **Siempre es seguro**"*, sin condiciones | La **filmina 16 de la [[practica-04-macs-hash-y-cifrado-autenticado\|Práctica 04]]** completa el enunciado: siempre que **los algoritmos lo sean** y las **claves sean independientes**. La teoría omite la condición y la práctica la agrega — y su filmina 18 pone a prueba justamente esa condición, mostrando que **claves iguales rompen `Encrypt-then-MAC`**. La práctica corrige a la teoría. Ver [[privacidad-e-integridad\|Privacidad e integridad]] *(Fila nueva.)* |
| 37 | *"$m = /$ (fallo)"* | La notación estándar del fallo es $\perp$ (*bottom*). **Y no es sólo notación**: el 03/09 el docente convierte ese símbolo en el rasgo distintivo de la construcción —*"existe un modo de falla nuevo al pedir el descifrado"*, que se materializa como **excepción** o como **código de error** según el lenguaje, y que se dispara **exactamente cuando se detecta manipulación** (cues pt2 738-746)—, frente al descifrado clásico, que nunca falla y devuelve basura. Ver [[#23. Cifrado autenticado\|§23]] y [[cifrado-autenticado\|Cifrado autenticado]] *(Reescritura: la fila era tipográfica y ahora carga el modo de falla.)* |
| 38 | Presenta `CCM` sin ninguna indicación de su estado actual | `CCM` **está cayendo en desuso**: *"lo fue hasta hace 5 años… se lo van a encontrar, probablemente, pero está cayendo en desuso"* (cues pt2 769-772). Y el costo que la filmina no cuantifica: **procesa el mensaje dos veces**, así que corre a **la mitad de la velocidad** de un modo counter normal (cues pt2 811-814). Ver [[ccm-y-gcm\|CCM y GCM]] *(Fila nueva, precisión.)* |
| 39 | Presenta `GCM` sin ninguna reserva | El docente registra en voz la **única advertencia crítica de toda la clase**: la etiqueta de `GHASH` *"todavía no está tan demostrada que sea robusta ante todo tipo de ataques, especialmente algebraicos"*, tiene *"menos años de estudio que las anteriores"* y queda *"en un segundo nivel versus las más estudiadas"* (cues pt2 844-846). Conviene leerlo junto a la recomendación de usar `AES-GCM` por defecto: no se contradicen, pero la filmina sola da una imagen sin matices. Ver [[ccm-y-gcm\|CCM y GCM]] *(Fila nueva, precisión.)* |
| 39 | $H = \mathsf{Enc}_k(0\ldots0)$ y $\mathrm{Mult}_H(x) = \mathrm{Mult}(x,H)$ — **la filmina está bien** | Se registra acá porque **la descripción oral se desliza** y quien estudie de la transcripción memoriza algo que no funciona: el docente describe el estado siguiente como *"multiplicar el polinomio del bloque por el del estado anterior"* (cues pt2 838-842) y llama a $H$ *"el valor inicial"* (cues pt2 859-861). La recurrencia real es $X_i = (X_{i-1} \oplus C_i)\cdot H$: se **XOR-ea** con el bloque y se multiplica siempre por la **constante** $H$, que es la **subclave de hash**, no el estado inicial —el estado arranca en $0^{128}$—. Ver [[#24. CCM y GCM\|§24]] y [[ccm-y-gcm\|CCM y GCM]] *(Fila nueva: discrepancia entre la voz y la filmina, no errata del PDF.)* |

> **Dos cosas que parecen erratas y no lo son** *(las dos, artefactos de extraer el texto del PDF).*
>
> **La frase "cortada" de la filmina 15.** El texto extraído termina en *"Si Pr[Mac-Forge=1] <= neg(n) => Π es"* y parece que falta la palabra. **No falta: verificado sobre la filmina renderizada, "infalsificable" está**, en la línea siguiente, desbordada por debajo de la línea horizontal del pie de página. Es un **desborde de maquetación**, no una frase incompleta — pero conviene saberlo, porque cualquier extracción automática se come justo el término que define el concepto. La filmina 16 **no** dice "infalsificable" por ningún lado.
>
> **El exponente "aplanado" de las filminas 30, 31 y 32.** El texto extraído dice *"secuencia de hasta 264 bits"* y parece un $2^{64}$ al que se le perdió el exponente. **La filmina está bien**: verificado con `pdftotext -bbox-layout`, el `2` y el `64` tienen cajas distintas —el `64` va en cuerpo menor y con la línea de base elevada—, o sea que es un superíndice tipográfico correcto. Lo mismo con los $2^{160}$ y $2^{80}$ de la filmina 35. Lo que sí es errata de contenido es aplicarle ese límite a `SHA-3`, y está arriba.
>
> **El nombre pegado al subíndice en las filminas 3 y 11.** `pdftotext` devuelve `CPAA,Π` y `CCAA,Π`, y parece un nombre duplicado. En el PDF el subíndice $A,\Pi$ está **perfectamente compuesto** —cuerpo menor y desplazado hacia abajo, verificado en el render—; lo que se aplana es la extracción. La notación del vault, eso sí, es distinta de la de la filmina: $\mathsf{PrivK}^{\mathsf{CPA}}_{A,\Pi}$ ([[notacion-y-terminologia|02.17]]) contra `CPA`$_{A,\Pi}$.

---

## Cabos sueltos

**Cerrados por esta ingesta**

- ~~La segunda mitad (03/09) sin transcripción.~~ **Cerrado.** La sesión existe y está grabada: [`Clase 03pt2 - Transcripcion.VTT`](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT), 910 cues, 1h48, Pablo Abad. Cubre las filminas 22 a 41 y está volcada en las [[#12. La segunda sesión: cómo retoma el 03/09|§12]] a [[#25. Cierre: la integridad implícita y la bibliografía|§25]]. El archivo se llamaba, hasta el 04/09, "Clase 04" y no era la Clase 4; se renombró ese día a `Clase 03pt2 - Transcripcion.VTT`.
- ~~La lectura designada de Katz se va a encargar el 03/09.~~ **Cerrado y cumplido.** El docente la encarga en voz al cerrar: *"todo lo que es integridad… se cubre en el capítulo 4 del libro de [Katz]"* (cue pt2 907). Registrado en la [[#25. Cierre: la integridad implícita y la bibliografía|§25]] y en la [[bibliografia|bibliografía]].
- ~~El ataque al sufijo del `CBC-MAC` quedó de tarea y lo resuelve la wiki.~~ **Cerrado por la cátedra, no por nosotros.** El [[practica-04-macs-hash-y-cifrado-autenticado#15. El Anexo: los ataques al CBC-MAC resueltos por la cátedra|Anexo Clase 4.pdf]] trae la resolución escrita, con el álgebra completa. Lo que el vault daba como derivación propia era material de cátedra que todavía no habíamos visto: hay que reclasificarlo en [[cbc-mac|CBC-MAC]]. Ojo con el choque de subíndices entre el Anexo y la filmina 19 de teoría.
- ~~La filmina 23 ("Etiquetadores universales") sólo trae título y diagrama; hay que volver sobre ella cuando exista la transcripción.~~ **Cerrado**: el 03/09 la proyecta y la desarrolla —efecto avalancha sobre los cinco mensajes de la figura, más la digresión sobre tablas de hash—, en la [[#13. Funciones de hash|§13]].
- ~~La cátedra quizás desarrolle rainbow tables el 03/09.~~ **Cerrado por verificación negativa**: **cero apariciones** de *rainbow*, *diccionario*, *precomputar*, *sal* y *contraseña* en los 910 cues. El [[ataque-de-diccionario-sobre-hashes|ataque de diccionario]] sigue siendo aporte de la Guía 3, no de la teoría.

**Siguen abiertos**

- El **"material adicional en Campus"** que la filmina 38 cita para la prueba específica de `CCM` **sigue sin estar en `raw/`**, y ahora tiene confirmación hablada: *"esta demostración no está en el libro de [Katz]. Se la vamos a subir… como material adicional en campus"* (cues pt2 806-808). Sin él, la prueba que habilita **una sola clave** en `CCM` queda enunciada y no verificada.
- El **ejercicio de la filmina 38** —*"esquematizar un cifrado utilizando AES-CCM"*— **no se enunció en voz**: en los 910 cues del 03/09 no aparece la palabra *ejercicio* ni ninguna referencia a esa consigna. Ya se había verificado que la [[guia-03-mac-y-funciones-de-hash#Lo que la guía no trae|Guía 3]] no lo trae. Queda como consigna escrita que nadie asignó, resuelta de todos modos en [[ccm-y-gcm|03.14]].
- Los **videos de Ramele** [[video-04-integridad-de-la-informacion-1|video-04]] y [[video-05-integridad-de-la-informacion-2|video-05]] (27/03/2025) siguen siendo útiles, pero **`video-05` dejó de ser la única fuente hablada sobre las filminas 22 a 41**: ahora hay dos, y de docentes distintos. Vale la pena contrastarlos donde difieran.

**Nuevos, que deja esta ingesta**

- **Material extra prometido al campus, segunda promesa del día.** Al cerrar, el docente anuncia material adicional para *"algunos de los temas que vimos [que] no están en el libro de [Katz]… demostraciones o algunas propiedades no tan básicas"* (cues pt2 908-909). **No está en `raw/`.** Junto con la prueba de `CCM` son dos entregas pendientes de la cátedra.
- **`SSH` y la segunda forma.** El docente lo da como ejemplo de *authenticate-then-encrypt* (cues pt2 700-707); el caso canónico de esa forma es `SSL`/`TLS`, y `SSH` es el caso canónico de la **primera** forma, `encrypt-and-MAC`. Verificar contra fuente primaria: **RFC 4253** (transporte de `SSH`) y **RFC 5246** (`TLS` 1.2). Ver la discrepancia registrada en la [[#22. Privacidad e integridad: las tres formas|§22]] y en [[privacidad-e-integridad|Privacidad e integridad]].
- **La cuenta de los modos de encadenamiento no cierra.** El docente dice *"5 mecanismos… ignorando el `ECB`"* (cue pt2 885), lo que daría seis; [[modos-de-encadenamiento#Los cinco modos|02.08]] registra cinco **contando** `ECB`. Verificar contra la clase de criptosistemas de bloque si hubo un sexto modo que la nota no recoge.
- **Katz capítulo 4 contra capítulo 5.** La cátedra ubica **todo** el bloque de integridad —MACs *y* funciones de hash— en el **capítulo 4** (cue pt2 907), mientras que el vault viene citando el **capítulo 5** para hash. Probablemente sea diferencia de edición, la misma que separa el **Teorema 4.19** que cita el vault del **4.20** que cita la filmina 17 de la Práctica 04. **Hay que resolverlo antes de dejar las dos citas conviviendo**: hoy se contradicen. Destino: [[bibliografia|bibliografía]].
- **La anécdota de la patente de `GCM` es la de `OCB`.** Queda **registrada y corregida** en la [[#24. CCM y GCM|§24]], no pendiente. Lo que sí conviene es dejar la corrección también en [[ccm-y-gcm|03.14]] para que no se pierda quien llegue por el concepto y no por la clase.
- **"Rodri"**, el docente al que se atribuye la clase de criptosistemas de bloque (cue pt2 883), es **grafía del ASR sin confirmar**. No aparece en el [[reglamento-y-evaluacion|reglamento]] con ese nombre; probablemente sea la forma corta de un nombre de la cátedra. Verificar antes de escribirlo como atribución en el [[cronograma]].
- **Sigue sin haber una sola mención del parcial.** Las dos jornadas de la Clase 03 suman **1783 cues** y en ninguna hay referencia al parcial del 24/09, a entregas ni a fechas de examen. Ya no es una particularidad del 27/08: es el patrón de esta clase.

---

## Ver también

- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] — de dónde salen el `CPA`, los modos y las primitivas que esta clase rompe; y el modo counter que el 03/09 repasa antes de `CCM`
- [[maleabilidad|Maleabilidad]] · [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]] — el arco ataque → prueba de la primera hora del 27/08, que el cifrado autenticado del 03/09 cierra
- [[message-authentication-code|Message Authentication Code]] · [[seguridad-de-un-mac|Seguridad de un MAC]] · [[cbc-mac|CBC-MAC]] · [[construccion-de-macs-a-partir-de-una-prf|Construcción de MACs a partir de una PRF]] — la primitiva de integridad, con el escalón que explica **por qué** hace falta encadenar
- [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]] — lo que un MAC **no** resuelve y tiene que resolver el protocolo que lo usa
- [[funciones-de-hash-criptograficas|Funciones de hash]] y sus derivadas: [[resistencias-de-una-funcion-de-hash|resistencias]], [[construccion-de-merkle-damgard|Merkle-Damgård]], [[primitivas-de-hash-estandar|primitivas estándar]], [[hmac|HMAC]], [[seguridad-de-las-funciones-de-hash|seguridad]] · [[ataque-de-diccionario-sobre-hashes|ataque de diccionario]] — los conceptos de la sesión del 03/09, más el que sale de la Guía 3
- [[privacidad-e-integridad|Privacidad e integridad]] · [[cifrado-autenticado|Cifrado autenticado]] · [[ccm-y-gcm|CCM y GCM]] · [[modos-de-encadenamiento|Modos de encadenamiento]] — el cierre del arco, y el inventario completo de modos
- [[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]] · [[agilidad-criptografica|Agilidad criptográfica]] — los dos criterios de diseño que el 03/09 introduce fuera de filmina y que sobreviven a la unidad de criptografía
- [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04 — MACs, hash y cifrado autenticado]] — la práctica del **lunes 31/08**, que se **adelantó** a esta teoría: `NMAC`, las tres sugerencias fallidas de MAC, y el Anexo con los ataques al `CBC-MAC` resueltos por la cátedra
- [[guia-03-mac-y-funciones-de-hash|Guía 3 — MAC y Funciones de Hash]] · [[guia-03-resolucion|Guía 3 — Resolución]] — la práctica escrita de esta clase, con los seis ejercicios hechos
- [[practica-03-seudoaleatoriedad-y-modos|Práctica 03 — Seudoaleatoriedad y modos]] — el experimento `CPA` en 5 pasos y el modo `CTR`, que esta clase ataca y que `CCM` y `GCM` reutilizan
- [[video-04-integridad-de-la-informacion-1|video-04]] y [[video-05-integridad-de-la-informacion-2|video-05]] — los dos videos de Ramele que cubren esta clase, con el mapa de qué filmina va en qué minuto; **ya no son la única voz sobre las filminas 22-41** · [[videografia|Videografía]]
- [[notacion-y-terminologia|Notación y terminología]] — el inventario de símbolos del vault
- [[bibliografia|Bibliografía]] · [[cronograma|Cronograma]] · [[programa-y-objetivos|Programa y objetivos]] · [[indice|Índice]]
