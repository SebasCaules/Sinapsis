---
title: Práctica 04 — MACs, hash y cifrado autenticado
resumen: 'Las filminas de la clase práctica del 31/08, que se adelantó tres días a la teoría y es la única fuente de la cátedra sobre replay, NMAC y las sugerencias fallidas de MAC; su anexo de 2025 resuelve los ataques al CBC-MAC.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[guia-03-mac-y-funciones-de-hash]]"]
aliases: [Práctica 4, Práctica 04, Practica 4, Clase práctica 4, Anexo Clase 4, Sugerencias fallidas de MAC, NMAC]
type: practica
clase: 3
orden: 20
practica: 4
fecha: 2026-08-31
created: 2026-09-04
updated: 2026-09-04
tags: [practica, mac, mac-forge, replay, prf, cbc-mac, hash, colisiones, merkle-damgard, nmac, hmac, cifrado-autenticado, cca, encrypt-then-mac, clase-03]
sources: ["Clase 4.pdf", "Anexo Clase 4.pdf"]
---

# Práctica 04 — MACs, hash y cifrado autenticado

> **31/08/2026** · Filminas: [`Clase 4.pdf`](../../raw/practicas/Clase%204.pdf) (18 pp., **Ana Arias Roig**, creado el 30/08/2026) y [`Anexo Clase 4.pdf`](../../raw/practicas/Anexo%20Clase%204.pdf) (5 pp., fechado **7 de abril de 2025**) · Teoría: [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] · Guía: [[guia-03-mac-y-funciones-de-hash|Guía 3 — MAC y Funciones de Hash]]

Esta práctica **no es un mapa de la teoría**, a diferencia de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]]. Es material que **va por delante** de las filminas de teoría en cinco puntos distintos, y en cuatro de ellos es la **única fuente de la cátedra** que existe:

1. **[[#4. Mac-Forge, y el aviso que la teoría no da: replay|La advertencia de replay]]** con sus dos contramedidas. Ninguna de las 41 filminas del deck de teoría menciona la palabra *replay*.
2. **[[#5. MAC de longitud fija a partir de una PRF|El MAC de longitud fija a partir de una función pseudoaleatoria]]**, $t \leftarrow F_k(m)$. Teoría salta de la definición de seguridad directamente a `CBC-MAC`, sin este escalón.
3. **[[#6. Longitud variable: las tres sugerencias fallidas|Las tres sugerencias fallidas para llegar a longitud variable]]**, cada una con su ataque. Es el hallazgo más grande de esta práctica y **la extracción automática de texto lo pierde entero**: son más de la mitad de la filmina 4 y sólo se ven renderizando la página.
4. **[[#11. NMAC, el escalón que falta hacia HMAC|NMAC]]**, el paso intermedio que vuelve inteligible a `HMAC`. No aparece en ninguna filmina de teoría.
5. **[[#10. La transformación de Merkle-Damgård completa|La transformación de Merkle-Damgård completa]]** —dominio de la función de compresión, recurrencia, bloque final de longitud y teorema de reducción—, donde teoría sólo dice que existe *"un modelo general iterativo propuesto por Merkle en 1989"*.

Y el `Anexo`, que es material de 2025 reusado, trae **[[#15. El Anexo: los ataques al CBC-MAC resueltos por la cátedra|los tres ataques al CBC-MAC dibujados y resueltos por la cátedra]]** — nueve cadenas dibujadas contra cero en el deck de teoría, más una falsificación que teoría no tiene y una errata de subíndices que hay que corregir para poder usarlo.

---

## 1. Ojo con el nombre del archivo: tercer caso del mismo patrón

`Clase 4.pdf` **no es la teórica 4**. Vive en `raw/practicas/`, la propia filmina 1 lleva impreso *"31 de agosto de 2026"* —un **lunes**— y la autora del PDF es **Ana Arias Roig**, la de las prácticas, no Pablo Abad. Es la **clase práctica 4**.

Es el **tercer caso** del mismo patrón, ya documentado dos veces:

| Archivo | Parece | Es |
|---|---|---|
| `raw/practicas/Clase 1.pdf` | la teórica 1 (06/08) | la [[practica-01-esquemas-y-taxonomias\|práctica 1]], lunes 10/08 |
| `raw/practicas/Clase 3.pdf` | la teórica 3 (27/08) | la [[practica-03-seudoaleatoriedad-y-modos\|práctica 3]], lunes 24/08 |
| `raw/practicas/Clase 4.pdf` | la teórica 4 (Criptografía asimétrica) | **esta** práctica, lunes 31/08 |

**Dos numeraciones paralelas con nombres de archivo idénticos**: la de las teóricas (jueves) y la de las prácticas (lunes). La regla operativa es la de siempre: **la carpeta manda sobre el nombre**.

El mismo cuidado vale para la transcripción: `raw/clases/Clase 03pt2 - Transcripcion.VTT` **tampoco es la Clase 4**. Es la **segunda sesión de la Clase 03**, del jueves 03/09, y cubre las filminas 22 a 41 del PDF de teoría. Como la Clase 03 tiene ahora **dos grabaciones y cada archivo `.VTT` numera sus cues desde 1**, en todo el vault los cues de esta clase llevan **prefijo de parte**: `(cues pt1 N-M)` para el 27/08 y `(cues pt2 N-M)` para el 03/09. Sin el prefijo el número no identifica nada.

---

## 2. El arco: la práctica se adelanta tres días a la teoría

El dato que ordena la lectura de toda esta nota:

$$\underbrace{\text{lunes } 31/08}_{\text{esta práctica}} \;\longrightarrow\; \underbrace{\text{jueves } 03/09}_{\text{segunda sesión de la Clase 03}}$$

**La práctica cubrió hash, `NMAC`, `HMAC` y cifrado autenticado tres días ANTES de que la teoría los dictara.** La sesión del 27/08 llegó hasta la filmina 21 (el `CBC-MAC` y su ataque de sufijo); todo lo que va de la filmina 22 en adelante —funciones de hash, Merkle-Damgård, las primitivas, `HMAC`, las tres formas de combinar, `CCM` y `GCM`— se dictó recién el 03/09. Esta práctica ya lo había recorrido entero.

Consecuencias prácticas para leerla:

- **Las filminas 6 a 13 de la práctica no son un repaso**: cuando se dieron, nadie había visto todavía una función de hash en la teoría de este cuatrimestre. Están escritas como primera exposición y hay que leerlas así.
- **El `Anexo`, en cambio, mira para atrás.** Está fechado *"7 de abril 2025"* —material del cuatrimestre anterior— y desarrolla los ataques al `CBC-MAC` de las filminas 19 y 21, que sí se habían dado el 27/08. Es, entre otras cosas, la **resolución de la cátedra de la tarea que Abad dejó ese jueves**; ver [[#15. El Anexo: los ataques al CBC-MAC resueltos por la cátedra|§15]].
- **Donde las dos fuentes se solapan, no siempre coinciden.** La práctica es a veces más precisa que la teoría (el experimento `CCA`, las condiciones de encrypt-then-MAC) y a veces menos (la definición de resistencia a preimagen, la tabla de primitivas sin `SHA-2`). Cada sección de abajo dice para qué lado cae.

---

## 3. Del cifrado al MAC

*Filmina 1.* La filmina abre con un contraste dibujado como flecha bifurcada: del **esquema de cifrado** salen dos consecuencias opuestas.

| Lo que el cifrado sí hace | Lo que el cifrado no hace |
|---|---|
| **Provee confidencialidad** | **No detecta alteraciones en el mensaje** |

y el remate, en verde: **no provee integridad ni autenticación**. De ahí, la caja central: **MAC**, *Message Authentication Codes*.

*(La filmina acompaña las dos ramas con un pulgar arriba y un pulgar abajo. El vault [[indice#Convenciones|no reproduce emojis]]: el contraste va en palabras.)*

La terna, tal como la escribe la práctica:

$$\begin{aligned}
\mathsf{Gen} &: \ k \leftarrow \mathsf{Gen}(1^{n})\\
\mathsf{Mac} &: \ t \leftarrow \mathsf{Mac}_{k}(m) &&\text{el emisor envía } \langle m,t\rangle\\
\mathsf{Vrfy} &: \ b := \mathsf{Vrfy}_{k}(m,t) &&b = 1 \text{ si es válido}
\end{aligned}$$

**Dos diferencias con la filmina 14 de teoría**, las dos a favor de la práctica:

1. **La parametrización por el parámetro de seguridad.** Teoría da las signaturas como funciones entre conjuntos ($\mathsf{Gen}: () \to K$, $\mathsf{Mac}: K \times P \to T$, $\mathsf{Vrfy}: K\times P\times T \to \{0,1\}$); la práctica escribe $\mathsf{Gen}(1^{n})$, que es la forma con la que después se cuantifica sobre adversarios $\mathrm{PPT}$. Sobre el $1^{n}$ en unario, ver [[practica-03-seudoaleatoriedad-y-modos#6. El experimento PrivK-CPA, en 5 pasos|Práctica 03 §6]].
2. **Qué viaja por el canal.** *"El emisor envía $\langle m,t\rangle$"* está escrito al costado del $\mathsf{Mac}$, y teoría no lo dice en ninguna parte. Es la aclaración que evita el malentendido más común: **el MAC no cifra nada**, el mensaje va en claro y la etiqueta lo acompaña. → [[message-authentication-code#Cómo se usa: la etiqueta es pública, la clave no|Message Authentication Code § Cómo se usa]]

---

## 4. Mac-Forge, y el aviso que la teoría no da: replay

*Filmina 2.* El experimento, en **tres** pasos (teoría lo escribe en cuatro):

$$\begin{aligned}
&1)\ \ k \leftarrow \mathsf{Gen}(n)\\
&2)\ \ A \text{ recibe } 1^{n} \text{ y acceso al oráculo } \mathsf{Mac}_k(\cdot).\ \text{Sea } Q \text{ el conjunto de sus consultas.}\\
&\qquad A \text{ emite un par } \langle m,t\rangle\\
&3)\ \ \text{la salida es } 1 \ (\text{ÉXITO}) \text{ si y sólo si } \mathsf{Vrfy}(m,t)=1 \ \textbf{y} \ m \notin Q
\end{aligned}$$

$$\Pr\bigl[\mathit{Mac\text{-}Forge}_{A,\pi}(n) = 1\bigr] \le \mathit{negl}(n)$$

El aporte formal frente a [[clase-03-macs-y-cifrado-autenticado#8. Seguridad de un MAC: Mac-forge|teoría 15]] es que **$Q$ se define adentro del mismo cuadro**, como parte del paso 2, en vez de aparecer suelto en el paso 3. El desarrollo completo del experimento está en [[seguridad-de-un-mac#El experimento Mac-Forge|Seguridad de un MAC]].

### El aviso que sólo está acá

Debajo, con una señal de peligro roja y una flecha que se bifurca:

> **`MAC` no protege contra ataques de REPLAY** — contramedidas: **número de secuencia** · **timestamps**

**Ninguna de las 41 filminas del deck de teoría menciona el replay.** Teoría 16 sólo observa que el adversario puede pedir el MAC de cualquier mensaje y que el esquema se considera roto si falsifica cualquiera *"tenga sentido o no"*. La frontera que este aviso traza es la que más se olvida al implementar:

**Un MAC garantiza que el mensaje viene de quien comparte la clave y que no fue alterado. No garantiza que sea nuevo.** Un par $\langle m,t\rangle$ interceptado y reenviado tal cual es, para el verificador, indistinguible del original: la etiqueta es válida porque **efectivamente lo es**. La primitiva hizo su trabajo; lo que falta es una noción de **frescura**, y ésa no vive en la primitiva sino en el protocolo que la usa.

Las dos contramedidas de la filmina son las dos formas canónicas de agregar frescura, y se diferencian en **qué estado hay que mantener**:

| Contramedida | Qué se agrega al mensaje autenticado | Qué estado hace falta | Costo |
|---|---|---|---|
| **Número de secuencia** | un contador que avanza con cada mensaje | cada extremo recuerda el contador de la conversación | hay que sincronizar, y el contador no puede reiniciarse con la misma clave |
| **Timestamp** | la hora de emisión | relojes razonablemente sincronizados y una ventana de tolerancia | no hace falta estado por conversación, pero la ventana deja un hueco de aceptación |

> **Lo que la filmina no dice, y conviene tener presente** *(lectura nuestra).* El campo de frescura tiene que quedar **adentro de lo que la etiqueta cubre**: autenticar $m$ y mandar el número de secuencia al lado, sin autenticarlo, no arregla nada, porque el adversario lo reescribe. La forma correcta es $t \leftarrow \mathsf{Mac}_k(\mathrm{ctr} \Vert m)$. Katz trata este punto en el capítulo 4 al discutir sesiones de comunicación seguras, y agrega un tercer ataque de la misma familia que la filmina no nombra: el **ataque de reflexión**, devolverle a $A$ un mensaje que $A$ misma envió — que se resuelve con un **bit de dirección** dentro del material autenticado, igual que el replay se resuelve con un contador.

→ [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]] · [[seguridad-de-un-mac#Lo que la definición no cubre|Seguridad de un MAC § Lo que la definición no cubre]]

---

## 5. MAC de longitud fija a partir de una PRF

*Filmina 3.* El escalón que la teoría se saltea. Teoría pasa del [[seguridad-de-un-mac#El ejercicio de los tres MACs|ejercicio de los tres MACs candidatos]] (filmina 17) directo a `CBC-MAC` (filmina 18), diciendo apenas *"sea $F$ una función pseudoaleatoria"* como preámbulo. La práctica escribe la construcción entera:

$$\begin{aligned}
\mathsf{Gen} &: \ k \leftarrow \{0,1\}^{n}\\[3pt]
\mathsf{Mac} &: \ t \leftarrow F_{k}(m), \qquad \text{con } \lvert m\rvert = \lvert k\rvert = n\\[3pt]
\mathsf{Vrfy} &: \ b := \mathsf{Vrfy}_{k}(m,t) =
\begin{cases}
0 & \text{si } \lvert m\rvert \neq \lvert k\rvert\\
1 & \text{si } F_{k}(m) = t\\
0 & \text{en otro caso}
\end{cases}
\end{aligned}$$

con la estrella al pie: **$F_k$ es una función seudoaleatoria**. Y el veredicto, subrayado: **MAC seguro para mensajes de longitud fija $n$**.

El diagrama de flujo que la acompaña dice exactamente lo que la [[#3. Del cifrado al MAC|filmina 1]] había anunciado: entran $k$ y $m$ a la caja $F_k$, sale $t$, y **el mensaje $m$ viaja sin transformar al lado de la etiqueta**; una llave agrupa a los dos y apunta a $\langle m,t\rangle$.

### Por qué esto es un MAC seguro, y por qué sólo a longitud fija

**Es seguro** porque falsificar equivale a **predecir el valor de $F_k$ en un punto que nunca se consultó**. Si $F_k$ fuera una función verdaderamente aleatoria, la mejor estrategia posible sería adivinar: probabilidad $2^{-n}$. Como $F_k$ es indistinguible de una función aleatoria, la ventaja del adversario contra la versión real no puede superar a la de la versión ideal por más que una cantidad despreciable. Es la reducción de siempre, y es **la construcción 4.5 de Katz-Lindell**.

**Sólo a longitud fija**, y por dos motivos distintos que conviene no mezclar:

1. **El dominio de $F_k$ es $\{0,1\}^{n}$ y nada más.** Un mensaje más largo no entra; uno más corto tampoco, y por eso el `Vrfy` **chequea la longitud explícitamente antes de comparar**. Ese chequeo es lo que la filmina escribe y teoría no.
2. **La constante $n$ es la misma que la de la clave.** La filmina escribe $\lvert m\rvert = \lvert k\rvert = n$: el mensaje mide exactamente lo que mide la clave. Esto **no es una necesidad de la construcción** *(precisión nuestra)* —lo que hace falta es que $m$ caiga en el dominio de $F_k$, y la clave podría tener otro largo—, pero es la instanciación natural cuando $F$ es un cifrador de bloque con clave y bloque del mismo tamaño.

**Lo que hay que llevarse:** un MAC de longitud fija es **gratis** si ya se tiene una PRF. Todo el trabajo del resto de la clase —las [[#6. Longitud variable: las tres sugerencias fallidas|tres sugerencias fallidas]], la [[#6.4. La construcción que sí funciona, y por qué es ineficiente|construcción genérica]], [[#7. CBC-MAC y las tres opciones seguras|CBC-MAC]], [[#11. NMAC, el escalón que falta hacia HMAC|NMAC]] y [[#12. HMAC con las dos cadenas dibujadas|HMAC]]— es una sola pregunta: **cómo llegar de acá a los mensajes de longitud arbitraria sin romper nada.**

→ [[construccion-de-macs-a-partir-de-una-prf|Construcción de MACs a partir de una PRF]] · [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]]

---

## 6. Longitud variable: las tres sugerencias fallidas

*Filmina 4.* **Es el hallazgo más grande de esta práctica, y `pdftotext` lo pierde entero.** La extracción automática de texto devuelve sólo la caja de la construcción genérica más las palabras sueltas *"¡Ineficiente!"* y *"CBC-MAC"*; **las tres cajas "Sugerencia" con sus tres ataques —más de la mitad de la lámina— no aparecen**. Sólo se recuperan renderizando la página. Nada de esto está en el deck de teoría.

![Filmina 4: las tres sugerencias fallidas y la construcción genérica](../../assets/practica04-mac-longitud-variable.png)

El punto de partida es un MAC $(\mathsf{Gen}', \mathsf{Mac}', \mathsf{Vrfy}')$ seguro **para mensajes de un bloque**, como el de la [[#5. MAC de longitud fija a partir de una PRF|§5]]. La pregunta es cómo autenticar un mensaje partido en $d$ bloques $m_1, m_2, \dots, m_d$. La filmina descarta tres respuestas naturales, cada una con un ataque concreto, y recién después presenta la que funciona.

### 6.1. Sugerencia 1: XOR de los bloques

$$t := \mathsf{Mac}'_{k}\Bigl(\bigoplus_{i} m_{i}\Bigr), \qquad \text{emitir } \langle m_{1}, m_{2}, \dots, m_{d};\, t\rangle$$

**El ataque, tal como lo escribe la filmina:** el adversario puede falsificar una etiqueta válida sobre un mensaje nuevo **cambiando el mensaje original de modo que el XOR de los bloques no cambie**.

**La cuenta.** El XOR de los bloques es invariante bajo dos operaciones que el adversario controla por completo:

- **Permutar los bloques.** Con una consulta sobre $m = m_1\Vert m_2$ y su etiqueta $t$, emitir $m^{*} = m_2 \Vert m_1$ con la **misma** $t$: $m_2 \oplus m_1 = m_1 \oplus m_2$.
- **Compensar dos bloques con el mismo $\Delta$.** Emitir $m^{*} = (m_1\oplus\Delta) \Vert (m_2\oplus\Delta)$ para cualquier $\Delta \neq 0^{n}$, otra vez con la misma $t$:
  $$(m_1\oplus\Delta) \oplus (m_2\oplus\Delta) = m_1 \oplus m_2 \oplus \Delta \oplus \Delta = m_1 \oplus m_2$$

En los dos casos $m^{*} \notin Q$ y $\mathsf{Vrfy}$ devuelve 1. Probabilidad de éxito **1**, con **una sola consulta**.

> **Un tercer ataque, más barato todavía** *(lectura nuestra).* Ni siquiera hace falta un mensaje de dos bloques. Consultar la etiqueta de $m = m_1$ —un solo bloque— y emitir $m^{*} = m_1 \Vert 0^{n}$ con la misma $t$: el XOR sigue valiendo $m_1$. El esquema **no mira la cantidad de bloques en ningún momento**, así que un mensaje y su versión rellenada con ceros son el mismo objeto a los ojos de la etiqueta. Esto anticipa por qué la construcción buena necesita meter $L$ adentro.

**Qué se aprendió:** comprimir el mensaje con una función **que el adversario puede invertir a voluntad** antes de autenticarlo es equivalente a autenticar cualquier preimagen. El XOR no es una función de hash: no es resistente a colisiones ni de lejos.

### 6.2. Sugerencia 2: autenticar cada bloque por separado

$$t_{i} := \mathsf{Mac}'_{k}(m_{i}), \qquad \text{emitir } \langle m_{1}, \dots, m_{d};\, t_{1}, \dots, t_{d}\rangle$$

**El ataque, tal como lo escribe la filmina:** el adversario puede **cambiar el orden de los bloques** y calcular una etiqueta válida sobre ellos, por ejemplo $m_d, \dots, m_2, m_1$.

**La cuenta.** Cada par $\langle m_i, t_i\rangle$ es válido **por sí mismo** y no lleva ninguna información de posición. Con una consulta sobre $m = m_1\Vert m_2 \Vert \dots \Vert m_d$, que devuelve $t_1, \dots, t_d$, el adversario emite cualquier permutación $\sigma$:

$$m^{*} = m_{\sigma(1)} \Vert \cdots \Vert m_{\sigma(d)} \qquad \text{con } \ t^{*} = \bigl(t_{\sigma(1)}, \dots, t_{\sigma(d)}\bigr)$$

y verifica, porque cada componente verifica. Con $d$ bloques distintos hay $d! - 1$ falsificaciones disponibles a partir de **una** consulta.

> **Dos ataques más que la filmina no menciona** *(lectura nuestra), y que importan porque justifican dos de los cuatro campos de la construcción buena.*
>
> - **Truncar.** Emitir $m^{*} = m_1 \Vert m_2$ con $(t_1, t_2)$: un prefijo de un mensaje válido es un mensaje válido. También sirve quedarse con cualquier subconjunto de bloques.
> - **Mezclar dos mensajes.** Con dos consultas $m$ y $m'$, cualquier intercalado $m_1 \Vert m'_2 \Vert m_3 \Vert \cdots$ con las etiquetas correspondientes es válido.
>
> O sea que el problema no es sólo el **orden**: es que la etiqueta no ata el bloque **ni a su posición, ni a la longitud total, ni al mensaje del que salió**. La [[#6.3. Sugerencia 3: autenticar cada bloque con su número de secuencia|sugerencia 3]] tapa el primero de los tres agujeros y deja los otros dos abiertos.

### 6.3. Sugerencia 3: autenticar cada bloque con su número de secuencia

$$t_{i} := \mathsf{Mac}'_{k}(i \Vert m_{i}), \qquad \text{emitir } \langle m_{1}, \dots, m_{d};\, t_{1}, \dots, t_{d}\rangle$$

**El ataque, tal como lo escribe la filmina:** el adversario puede **mezclar bloques de mensajes diferentes**. Dados

$$\langle m_{1}, m_{2}, \dots, m_{d};\, t_{1}, t_{2}, \dots, t_{d}\rangle \qquad\text{y}\qquad \langle m'_{1}, m'_{2}, \dots, m'_{d};\, t'_{1}, t'_{2}, \dots, t'_{d}\rangle$$

es válido el mensaje intercalado

$$\langle m_{1}, m'_{2}, m_{3}, m'_{4}, \dots;\ t_{1}, t'_{2}, t_{3}, t'_{4}, \dots\rangle$$

**La cuenta.** El índice $i$ ata el bloque a **su posición**, y por eso la permutación de la sugerencia 2 ya no funciona: mover $m_1$ a la posición 3 exigiría una etiqueta de $3\Vert m_1$ que el adversario no tiene. Pero el índice **no ata el bloque a su mensaje**: la etiqueta de $2\Vert m'_2$ es igual de válida dentro de $m$ que dentro de $m'$, porque el esquema no tiene forma de saber de cuál de los dos vino. Con **dos** consultas de $d$ bloques cada una, el adversario dispone de $2^{d}-2$ mensajes intercalados no consultados, todos con etiqueta válida.

Y la **truncación sigue funcionando con una sola consulta**: $\langle m_1, m_2;\ t_1, t_2\rangle$ es un mensaje válido de dos bloques *(lectura nuestra; la filmina sólo exhibe el intercalado)*.

### 6.4. La construcción que sí funciona, y por qué es ineficiente

$$\begin{aligned}
&\mathsf{Gen} := \mathsf{Gen}'\\[3pt]
&\lvert m\rvert = L < 2^{n/4}, \qquad \lvert k\rvert = n\\[3pt]
&m \text{ se parte en } d \text{ bloques de longitud } n/4 \ \text{(se completa con ceros)}\\[3pt]
&r \leftarrow \{0,1\}^{n/4}\\[3pt]
&t_{i} = \mathsf{Mac}'_{k}\bigl(r \Vert L \Vert i \Vert m_{i}\bigr) \quad \text{para } i = 1,\dots,d\\[3pt]
&\Rightarrow \ \text{emitir } \langle r,\, t_{1}, t_{2}, \dots, t_{d}\rangle
\end{aligned}$$

Es la **construcción 4.7 de Katz-Lindell**, y cada uno de los cuatro campos del bloque autenticado tapa exactamente uno de los agujeros de arriba:

| Campo | Mide | Qué ataque cierra |
|---|---|---|
| $r$ | $n/4$ bits, **fresco por mensaje** | el **intercalado** de la sugerencia 3: dos mensajes distintos tienen $r$ distintos, y un bloque de uno no verifica dentro del otro |
| $L$ | $n/4$ bits | la **truncación**: la longitud total está adentro de cada etiqueta, así que quedarse con menos bloques delata la manipulación |
| $i$ | $n/4$ bits | el **reordenamiento** de la sugerencia 2 |
| $m_i$ | $n/4$ bits | el dato |

**Por qué los bloques miden $n/4$ y la longitud está acotada por $2^{n/4}$.** Los cuatro campos tienen que entrar en **una sola invocación** de $\mathsf{Mac}'$, que sólo acepta bloques de $n$ bits. Cuatro campos de $n/4$ bits dan exactamente $n$. De ahí sale todo lo demás: $r$ mide $n/4$, el índice $i$ mide $n/4$ (con lo cual no puede haber más de $2^{n/4}$ bloques), y $L$ mide $n/4$ (con lo cual $L < 2^{n/4}$). **No son constantes arbitrarias: son la única repartición que cierra.**

### Por qué es ineficiente, que es lo que motiva CBC-MAC

La filmina pone un triángulo de advertencia y una caja roja con **"¡Ineficiente!"**, y de ahí sale una flecha verde gruesa hacia **`CBC-MAC`**.

> **Errata de lectura frecuente, resuelta en el render.** *"¡Ineficiente!"* califica a **la construcción genérica**, no a `CBC-MAC`. La cadena de lectura es: *esta construcción es correcta pero ineficiente $\Rightarrow$ por eso se pasa a `CBC-MAC`*. La flecha verde es una transición de tema, no un veredicto. La extracción de texto emite las dos palabras sueltas y pegadas, y ahí sí se puede leer al revés.

La cuenta de la ineficiencia *(desarrollo nuestro; la filmina afirma el veredicto sin cuantificarlo)*:

$$d = \frac{L}{n/4} = \frac{4L}{n} \quad\text{bloques} \qquad\Longrightarrow\qquad \text{salida} = \underbrace{\tfrac{n}{4}}_{r} + d\cdot n = \tfrac{n}{4} + 4L \ \text{ bits}$$

O sea: **la etiqueta pesa cuatro veces el mensaje**, y hacen falta $4L/n$ invocaciones de la primitiva contra las $L/n$ que hace `CBC-MAC` — **cuatro veces más trabajo y cuatro veces más ancho de banda**. `CBC-MAC`, en cambio, procesa bloques enteros de $n$ bits y emite **una sola** etiqueta de $n$ bits, sin importar cuán largo sea el mensaje.

> **El otro costo, que tampoco está en la filmina** *(lectura nuestra).* El valor $r$ mide $n/4$ bits, así que con $n = 128$ son **32 bits**: por la [[seguridad-de-las-funciones-de-hash#Por qué la raíz cuadrada: la paradoja del cumpleaños|paradoja del cumpleaños]], dos mensajes comparten $r$ después de unos $2^{16}$ mensajes autenticados con la misma clave. Cuando eso pasa, el ataque de intercalado de la sugerencia 3 vuelve a estar disponible entre esos dos mensajes. La construcción es segura en el sentido asintótico, pero su margen concreto es mucho más chico de lo que sugiere el $n$ de la clave.

→ [[construccion-de-macs-a-partir-de-una-prf|Construcción de MACs a partir de una PRF]]

---

## 7. CBC-MAC y las tres opciones seguras

*Filmina 5.* Acá la práctica y la teoría se solapan fuerte, y son **complementarias**: la práctica dibuja lo que la teoría enuncia, y la teoría exhibe los ataques que la práctica omite.

$$\begin{aligned}
&\mathsf{Gen}: \ k \leftarrow \{0,1\}^{n}, \qquad \lvert k\rvert = n, \qquad \lvert m\rvert = L(n)\cdot n\\[3pt]
&m \text{ se parte en } l \text{ bloques de longitud } n\\[3pt]
&t_{0} = 0^{n}, \qquad t_{i} = F_{k}(t_{i-1} \oplus m_{i}) \quad\Rightarrow\quad \text{emite } t_{l}
\end{aligned}$$

Y la banda rosa a todo el ancho, que es la misma frase de la filmina 19 de teoría:

> **La construcción anterior es infalsificable SÓLO si se permiten mensajes de una misma longitud.**

Las tres opciones seguras para longitudes distintas, idénticas a las de [[cbc-mac#Las tres extensiones seguras|teoría 20]]:

| Opción | Construcción | Dónde entra la longitud |
|---|---|---|
| 1 | $k_{l} := F_{k}(\lvert m\rvert)$ y $t \leftarrow \mathsf{CBC\text{-}MAC}_{k_{l}}(m)$ | en la **clave** |
| 2 | $m' := \lvert m\rvert \Vert m$ y $t \leftarrow \mathsf{CBC\text{-}MAC}_{k}(m')$ | en el **primer bloque** |
| 3 | $k_{1}, k_{2} \leftarrow \{0,1\}^{n}$; $t \leftarrow \mathsf{CBC\text{-}MAC}_{k_{1}}(m)$; $\hat{t} \leftarrow F_{k_{2}}(t)$ | en ningún lado |

**Qué aporta la práctica:** el **diagrama de la cadena**, que teoría no tiene. Se ven las cajas de bloque, los XOR, las cajas $F_k$ y —lo más importante— **la asimetría entre estados intermedios y etiqueta**: los $t_1, \dots, t_{l-1}$ quedan como rótulos sueltos al pie, y sólo $t_l$ va en caja verde. Ese contraste visual **es** el agujero que explotan los tres ataques del [[#15. El Anexo: los ataques al CBC-MAC resueltos por la cátedra|Anexo]]: lo que se calcula y se descarta.

**Qué tiene teoría y no la práctica:** los **dos ataques concretos**. Teoría 19 da la falsificación de longitud variable y teoría 21 el ataque de sufijo; la práctica afirma el resultado sin exhibirlos. Los dos están desarrollados en [[cbc-mac#El ataque de longitud variable, paso a paso|CBC-MAC]] y, ahora, **también dibujados por la cátedra en el `Anexo`**.

→ [[cbc-mac|CBC-MAC]] · [[modos-de-encadenamiento|Modos de encadenamiento]]

---

## 8. Funciones de hash y los niveles de seguridad

*Filminas 6 a 9.* Cuatro láminas que abren el bloque de hash. Recordar que **es la primera exposición del tema en el cuatrimestre**: la teoría del 03/09 todavía no había ocurrido.

### La definición, más pobre que la de teoría

La filmina 6 se queda con una sola propiedad —**comprime la entrada a una longitud fija**, dibujado como embudo— más una promesa: *"permiten construir esquemas MAC seguros"*, que es lo que se cumple en las [[#11. NMAC, el escalón que falta hacia HMAC|filminas 12]] y [[#12. HMAC con las dos cadenas dibujadas|13]].

Todo lo formal está en **teoría 22 y no acá**: el hash como par de algoritmos $(\mathsf{Gen}, \mathsf{Hash})$, que $s$ es un **selector y no una clave**, que en muchas implementaciones la familia tiene un solo miembro, y el nombre *"funciones de resumen"*. → [[funciones-de-hash-criptograficas#El selector no es una clave|Funciones de hash criptográficas § El selector no es una clave]]

> **Discrepancia notacional entre los dos decks, sin consecuencias.** La práctica escribe $H^{s}$ y $h^{s}$ con la $s$ como **superíndice**; teoría escribe $H_s$ con **subíndice**. Es el mismo objeto. *(La filmina 11 llega a usar las dos formas dentro de la misma lámina: $h^{s}$ en el enunciado y $h_{s}$ en la caja de fórmula.)*

### Colisiones y la jerarquía

La filmina 7 define la colisión —$x \neq x'$ con $H(x) = H(x')$—, advierte que **las colisiones van a existir** y bifurca hacia *"nociones de seguridad más débiles"*: resistencia a segundas preimágenes y resistencia a preimagen.

**Ése es el aporte de la práctica sobre teoría**: presentarlas **ordenadas por fuerza**. Teoría 25-27 da las tres propiedades en filminas paralelas, sin jerarquizarlas. La práctica dice, con todas las letras, que las otras dos son *más débiles* que la resistencia a colisiones — que es exactamente lo que el vault desarrolla en [[resistencias-de-una-funcion-de-hash#La jerarquía|Resistencias § La jerarquía]].

**Lo que la práctica omite:** el **argumento** de por qué las colisiones existen. Teoría 24 lo da —principio del palomar: con $n+1$ mensajes y $n$ salidas hay al menos una colisión—; la práctica sólo afirma el hecho.

### Los tres niveles, y la definición de preimagen que queda mal

La filmina 8 los pone en una sola lámina comparable, que es cómodo:

$$\begin{aligned}
&\text{1. Resistente a colisiones:} && \text{encontrar } x \neq x' \text{ tal que } H^{s}(x) = H^{s}(x')\\
&\text{2. Resistente a segundas preimágenes:} && \text{dado } x, \text{ encontrar } x \neq x' \text{ tal que } H^{s}(x) = H^{s}(x')\\
&\text{3. Resistente a preimagen:} && \text{dado } H^{s}(x) = y, \text{ encontrar algún } x' \text{ tal que } H^{s}(x) = H^{s}(x')
\end{aligned}$$

> **Errata de la filmina.** El punto 3 debería decir *"dado $y$, encontrar algún $x'$ tal que $H^{s}(x') = y$"*. Tal como está escrito, **la condición del punto 3 es literalmente idéntica a la del punto 1** y no captura la inversión de la función: la $x$ aparece en la conclusión sin haber sido dada como dato, que es exactamente lo que separa preimagen de segunda preimagen. Acá **teoría es más precisa que la práctica**: la filmina 25 dice *"para todo $y$, es computacionalmente imposible hallar $x$ con $h(x)=y$"*, que es lo correcto. Verificado en el render.

> **Errata de la filmina (los diagramas).** Los tres niveles vienen acompañados de un diagrama de conjuntos cada uno, y **los tres son exactamente el mismo dibujo**: dos puntos del dominio, dos flechas, un único punto del codominio, sin rótulos ni marcas. Ese dibujo representa **una colisión**, así que sólo corresponde al nivel 1. Para segunda preimagen habría que destacar el $x$ dado; para preimagen habría que **partir de un punto marcado en el codominio y remontar hacia el dominio**. El diagrama refuerza la imprecisión que el texto del punto 3 ya tiene. Verificado con recortes individuales a 220 dpi.

### El umbral de 160 bits

La filmina 9, con una advertencia grande:

> Para ser segura, una función de hash resistente a colisiones necesita una salida **mayor de 160 bits** ($2^{80}$ cómputos). **Es una condición necesaria pero no suficiente.**

Dos diferencias con [[seguridad-de-las-funciones-de-hash#Por qué 2 elevado a la 80 ya no alcanza|teoría 35]], las dos a favor de la práctica:

1. **Teoría dice *"tamaño mínimo de salida: 160 bits"*** (o sea, 160 es admisible); **la práctica dice *"mayor de 160"*** (o sea, 160 ya no alcanza). La práctica es más estricta, y tiene razón: 160 bits dan 80 bits de seguridad contra colisiones, y eso está por debajo de lo aceptable desde hace años.
2. **La aclaración *"necesaria pero no suficiente"*** no está en teoría, y es la que impide leer el umbral como un certificado. `SHA-1` tiene 160 bits de salida y **está quebrada** desde SHAttered: el tamaño de salida acota el ataque genérico, no los ataques estructurales. → [[primitivas-de-hash-estandar#SHA-1|Primitivas de hash estándar § SHA-1]]

*(El `80` de $2^{80}$ es un superíndice real, en negrita, verificado en el render. La lectura "280" que devuelve la extracción de texto es un artefacto.)*

---

## 9. Primitivas y los dos modelos de construcción

*Filmina 10.* Una tabla corta y una taxonomía.

| Primitiva de hash | Salida |
|---|---|
| `MD5` | 128 bits |
| `SHA-1` | 160 bits |
| `SHA-3` (estándar actual) | 224 / 256 / 384 / 512 bits |

Y debajo, **"modelos de aplicación (construcciones)"**, bifurcado en dos ramas con sus instancias:

$$\text{Iterativo} \ \longrightarrow\ \text{CBC-MAC} \ /\ \text{Merkle} \qquad\qquad \text{Esponja} \ \longrightarrow\ \text{Keccak (SHA-3)}$$

**El aporte es la taxonomía**, no la tabla. Teoría menciona *"aplicación iterativa"* y *"aplicación modelo esponja"* como atributos sueltos de cada primitiva (filminas 30, 31, 32) pero **nunca como una clasificación de dos ramas**. Presentado así, se ve que la diferencia entre `SHA-2` y `SHA-3` no es de tamaño ni de generación: es de **arquitectura**, y es la razón por la que un ataque que rompe a una familia no se traslada a la otra. → [[construccion-de-merkle-damgard#SHA-3 no usa este modelo|Construcción de Merkle-Damgård § SHA-3 no usa este modelo]]

Tres observaciones sobre la tabla:

- **Falta `SHA-2`** (256/384/512 bits), que sí figura en teoría 35 y que es **la familia más usada en producción hoy**. Es una omisión, no un dato falso.
- **`MD5` no está marcada como quebrada**, cosa que teoría 35 sí hace. Leída sola, la tabla la presenta como una primitiva más.
- **`Keccak` está bien escrito acá.** En el deck de **teoría**, filmina 35, aparece como *"Kekkak"*: esa errata es de teoría, no de la práctica.

> **Sobre poner `CBC-MAC` en una tabla de hash** *(precisión nuestra).* La columna dice literalmente `CBC-MAC/Merkle`, **con barra**, lo cual sostiene la lectura de *enumeración de dos construcciones iterativas* y no la de un nombre único —verificado en el render a 250 dpi—. Aun así es impreciso: en una taxonomía de **primitivas de hash**, el ejemplo iterativo pertinente es **Merkle-Damgård**, que es justamente lo que desarrolla la filmina siguiente; `CBC-MAC` es un MAC, no un hash, y entra ahí sólo por analogía de encadenamiento. La analogía es buena —los dos encadenan estado y los dos sufren ataques de prefijo—, pero conviene no coleccionarla como si `CBC-MAC` fuera una función de hash.

---

## 10. La transformación de Merkle-Damgård completa

*Filmina 11.* **Aporte grande.** Teoría 29 sólo dice que existe un *"modelo general iterativo"* propuesto por Merkle en 1989, que lo usan muchas funciones, y enumera de manera cualitativa el preprocesamiento y la función de compresión. **No da la transformación, ni la fórmula, ni el dominio, ni el teorema de reducción, ni el nombre completo.** La práctica da todo eso.

![Filmina 11: la transformación de Merkle-Damgård](../../assets/practica04-merkle-damgard.png)

$$\begin{aligned}
&\lvert x\rvert = L < 2^{l(n)}, \qquad X = x_{1}x_{2}x_{3}\cdots x_{B}, \qquad \lvert x_{i}\rvert = l\\[3pt]
&h^{s}: \{0,1\}^{2l} \to \{0,1\}^{l} \quad \text{segura}\\[3pt]
&z_{0} = 0^{l}, \qquad x_{B+1} = \lvert x\rvert\\[3pt]
&\boxed{\,z_{i} = h_{s}\bigl(z_{i-1} \Vert x_{i}\bigr)\,}\\[3pt]
&H^{s}(X) = z_{B+1}
\end{aligned}$$

Las piezas, en el orden en que hay que entenderlas:

1. **La función de compresión come $2l$ bits y devuelve $l$.** Ése es el único ingrediente que hay que diseñar: recibe el **estado de encadenamiento** ($l$ bits) concatenado con **un bloque de mensaje** ($l$ bits), y devuelve el estado nuevo.
2. **El estado arranca en $0^{l}$.** Es el $\mathrm{IV}$ de la construcción; en las primitivas reales no es cero sino una constante especificada por el estándar.
3. **El último bloque procesado es la longitud del mensaje**, $x_{B+1} = \lvert x\rvert$. Es el *Merkle-Damgård strengthening*, y es lo que impide que dos mensajes de largos distintos colisionen trivialmente por relleno.
4. **La salida es el estado final**, $z_{B+1}$.

Y el enunciado que justifica todo el diseño, en la caja gris de la derecha:

> **Una colisión en $H^{s}$ sólo puede ocurrir si hay una colisión en $h^{s}$.**

**Ése es el teorema de reducción**, y es la razón de ser de la construcción: reduce el problema *"diseñar una función resistente a colisiones sobre entradas de longitud arbitraria"* al problema *"diseñar una función resistente a colisiones sobre entradas de $2l$ bits fijos"*, que es infinitamente más manejable. La demostración —remontar la cadena desde el punto donde las dos evaluaciones difieren— está en [[construccion-de-merkle-damgard#El teorema que hace que valga la pena|Construcción de Merkle-Damgård § El teorema que hace que valga la pena]].

### La discrepancia sobre la transformación final

En la teoría del 03/09, al presentar esta misma construcción, el docente afirma que Merkle-Damgård agrega **una función de transformación al final** que impide que salgan los estados intermedios, y que por eso poner la longitud como sufijo *"no es un problema de seguridad"*.

> [!quote]- De la transcripción de la Clase 03 — la transformación final atribuida a Merkle-Damgård (cues pt2 327, 362-364)
> **327.** *"Pero como la construcción está, además de agregar la longitud, agrega una función de transformación al final. No deja salir los estados intermedios, sino que los transforma: no es un problema de seguridad."*
>
> **362-364.** *"A esa salida se la transforma con una función no reversible, que tiene que ver de vuelta con esto de eliminar la posibilidad de que alguien tenga acceso a esos estados intermedios, y el resultado de eso es el resultado de la etiqueta."*

**La construcción tal como la dibujan las dos filminas de la cátedra no tiene esa transformación final** *(precisión nuestra)*. Ni la filmina 29 de teoría ni **esta filmina 11**: acá la salida es $z_{B+1}$ **directo**, sin ninguna caja adicional después del último eslabón. Y las primitivas reales de la familia tampoco la tienen: `MD5`, `SHA-1` y `SHA-2` emiten el estado de encadenamiento tal cual. Por eso el **length extension attack** es real, por eso $H(k \Vert m)$ no sirve como MAC, y por eso [[#12. HMAC con las dos cadenas dibujadas|HMAC es anidado]] en vez de una sola pasada.

La discrepancia queda **registrada, no resuelta**: existen variantes de la familia que sí aplican una transformación de salida —el *wide-pipe* y la truncación de `SHA-512/256` son los ejemplos canónicos—, y en esas variantes la afirmación del docente es correcta. Sobre la construcción que las dos filminas dibujan, no lo es. → [[construccion-de-merkle-damgard#La contra: length extension|Construcción de Merkle-Damgård § La contra: length extension]]

> **Errata del nombre.** La filmina escribe **"Merkle Darmgard"**: están transpuestas la `r` y la `m`, falta la `å` y falta el guion. El apellido del segundo autor es **Damgård**, danés. Verificado con recorte del título a 250 dpi.

---

## 11. NMAC, el escalón que falta hacia HMAC

*Filmina 12.* **`NMAC` no aparece en ninguna de las 41 filminas del deck de teoría.** Teoría pasa de las funciones de hash directamente a `HMAC` (filmina 33), y ése es justamente el salto que vuelve a `HMAC` una fórmula para memorizar en vez de una construcción que se entiende. La práctica pone el escalón.

![Filmina 12: NMAC](../../assets/practica04-nmac.png)

$$\begin{aligned}
&\mathsf{Gen}: \ (s, k_{1}, k_{2}), \qquad \lvert k_{1}\rvert = \lvert k_{2}\rvert = n\\[3pt]
&m = m_{1}m_{2}m_{3}\cdots m_{B}, \qquad \lvert m\rvert = L\\[3pt]
&\boxed{\,t := h^{s}_{k_{1}}\Bigl(H^{s}_{k_{2}}(m)\Bigr)\,} \qquad \text{y se emite } \langle m,t\rangle
\end{aligned}$$

El diagrama es una cadena de **cinco eslabones** de la misma función de compresión de la [[#10. La transformación de Merkle-Damgård completa|filmina 11]], y hay que leerlo en dos tramos:

| Eslabón | Entrada | Salida | Qué está pasando |
|---|---|---|---|
| 1 | $k_{2} \Vert m_{1}$ | $z_{1}$ | **la clave $k_2$ ocupa el lugar del $\mathrm{IV}$** |
| 2 | $z_{1} \Vert m_{2}$ | $z_{2}$ | cadena Merkle-Damgård normal |
| 3 | $z_{B-1} \Vert m_{B}$ | $z_{B}$ | último bloque de mensaje |
| 4 | $z_{B} \Vert L$ | $z$ | el bloque de longitud, igual que en Merkle-Damgård |
| 5 | $k_{1} \Vert z$ | $t$ | **la pasada externa**: se comprime el resultado con la otra clave |

Los rótulos que la propia filmina pone debajo del dibujo separan los dos tramos: $H^{s}_{k_{2}}(m) = z$ para el interno, $h^{s}_{k_{1}}(z) = t$ para el externo.

> **Errata de la filmina.** La caja de entrada del **tercer** eslabón dice $z_{1} \Vert m_{B}$ y debería decir $z_{B-1} \Vert m_{B}$: el eslabón que procesa el último bloque de mensaje recibe el estado de encadenamiento **anterior**, no el primero. El subíndice `1` es un error de copiado del segundo eslabón. Verificado con recorte de las cinco cajas de entrada a 250 dpi. En la tabla de arriba está ya corregido.

### Por qué NMAC es el escalón que hace comprensible a HMAC

**`NMAC` es un hash con clave, anidado dentro de otro hash con clave** — de ahí *nested*. La estructura resuelve de un golpe el problema que hace que $H(k \Vert m)$ no sirva:

- **La pasada interna** es un Merkle-Damgård normal, pero arrancado desde $k_2$ en vez de desde el $\mathrm{IV}$ público. Un adversario que ve $z$ **no puede extenderlo**, porque para seguir la cadena necesitaría... nada, en realidad: sí podría extenderla. Lo que lo detiene es la pasada externa.
- **La pasada externa** vuelve a comprimir $z$ bajo $k_1$. La etiqueta que se publica **no es un estado de la cadena interna**, sino la imagen de ese estado bajo otra función con otra clave. **Eso es lo que mata el length extension**: el atacante tiene $t$, no $z$, y de $t$ no puede volver a $z$.

Es la misma idea que la **opción 3 de las extensiones seguras de `CBC-MAC`** —cifrar la etiqueta final con una segunda clave independiente— aplicada a la cadena de hash en vez de a la cadena `CBC`. → [[cbc-mac#Las tres extensiones seguras|CBC-MAC § Opción 3]]

**Y lo que `NMAC` pide y no se puede tener en la práctica**, que es exactamente lo que motiva a `HMAC`:

1. **Dos claves independientes**, $k_1$ y $k_2$.
2. **Acceso a la función de compresión con el $\mathrm{IV}$ reemplazable.** Ninguna biblioteca de hash del mundo real expone eso: `SHA-256` es una caja que come bytes y devuelve 32, con su $\mathrm{IV}$ cableado adentro.

[[#12. HMAC con las dos cadenas dibujadas|HMAC]] es la variante implementable: deriva las dos claves de una sola con dos constantes, y en lugar de reemplazar el $\mathrm{IV}$ **antepone la clave enmascarada como primer bloque del mensaje**, con lo cual usa la función de hash tal como viene.

---

## 12. HMAC con las dos cadenas dibujadas

*Filmina 13.* Teoría 33 da la fórmula cerrada y nada más. La práctica la **dibuja**, y el dibujo es el que muestra que `HMAC` es `NMAC` con las claves derivadas.

![Filmina 13: HMAC](../../assets/practica04-hmac.png)

$$\begin{aligned}
&\mathsf{Gen}: \ (s, k), \qquad \lvert k\rvert = n\\[3pt]
&ipad = \texttt{0x36} \text{ repetido}, \qquad opad = \texttt{0x5C} \text{ repetido}, \qquad \mathrm{IV} \text{ constante fija}\\[3pt]
&\boxed{\,t := H^{s}_{\mathrm{IV}}\Bigl(\bigl(k \oplus opad\bigr) \,\Big\Vert\, H^{s}_{\mathrm{IV}}\bigl((k \oplus ipad) \Vert m\bigr)\Bigr)\,}
\end{aligned}$$

Las dos cadenas del diagrama, que son el aporte:

| Cadena | Primer eslabón | Bloques siguientes | Salida |
|---|---|---|---|
| **Interna** | $\mathrm{IV} \Vert (k \oplus ipad)$ | $m_{1}, \dots, m_{B}$ y después el bloque de longitud $L$ | $z$ |
| **Externa** | $\mathrm{IV} \Vert (k \oplus opad)$ | un solo bloque de datos: $z$ | $t$ |

Puesto al lado de [[#11. NMAC, el escalón que falta hacia HMAC|NMAC]], el mapeo es exacto:

| `NMAC` pide | `HMAC` lo consigue con |
|---|---|
| clave $k_2$ en el lugar del $\mathrm{IV}$ interno | $\mathrm{IV}$ fijo, y $(k \oplus ipad)$ como **primer bloque de datos** |
| clave $k_1$ en el lugar del $\mathrm{IV}$ externo | $\mathrm{IV}$ fijo, y $(k \oplus opad)$ como **primer bloque de datos** |
| dos claves independientes | **una** clave, enmascarada con dos constantes distintas |
| función de compresión con $\mathrm{IV}$ reemplazable | la función de hash **tal como viene**, sin tocar nada |

Y de ahí sale la propiedad que hace a `HMAC` deployable: **se puede implementar con dos llamadas a cualquier biblioteca de hash estándar**, sin acceso a las internas. → [[hmac#Por qué dos pasadas de hash y no una|HMAC § Por qué dos pasadas de hash y no una]]

### La errata de opad e ipad, que dos decks distintos arrastran

> **Errata de la filmina.** Las dos líneas de definición dicen
> $$opad = \texttt{0x36} \text{ repetido}, \qquad Ipad = \texttt{0x5C} \text{ repetido}$$
> **y están intercambiadas.** Lo correcto es $ipad = \texttt{0x36}$ (*inner*, la de adentro) y $opad = \texttt{0x5C}$ (*outer*, la de afuera). Verificado en el render.

Lo que vuelve a esta errata digna de párrafo propio es **dónde más aparece**:

1. **La filmina se contradice consigo misma.** La fórmula de la misma lámina —$t := H^{s}_{\mathrm{IV}}((k \oplus opad) \Vert H^{s}_{\mathrm{IV}}((k \oplus ipad) \Vert m))$— **sí es correcta**: $ipad$ en la pasada interna, $opad$ en la externa. O sea que la lámina afirma dos cosas incompatibles a diez centímetros de distancia.
2. **Es exactamente la misma errata que ya está documentada en la filmina 33 del deck de teoría**, que escribe *"opad = 0x36...36, ipad = 0x5c5c...5c"*.

**Dos decks, dos autoras distintas, la misma inversión.** Eso no es coincidencia: **es un error de origen que ambos materiales heredan de una fuente común** *(lectura nuestra)*, probablemente una versión anterior del material de la cátedra. Es útil saberlo porque significa que **el material no se puede usar como control cruzado en este punto**: mirar las dos filminas y ver el mismo valor no confirma nada. La forma de recordar cuál es cuál es semántica y no memorística: **`i` de *inner*, `o` de *outer***, y en el RFC 2104 el `ipad` es `0x36`.

→ [[hmac#Errata central: opad e ipad tienen los valores intercambiados|HMAC § Errata central]]

> **Dos imprecisiones menores, que no son erratas.** La filmina escribe *"$n$ veces byte 0x36"* mientras que $\lvert k\rvert = n$ está en **bits**: hay una mezcla de unidades. Y en el diagrama el rótulo $z_{0}$ se reutiliza para el primer estado de la cadena interna **y** para el de la externa, que no valen lo mismo porque la clave enmascarada difiere.

---

## 13. Cifrado autenticado como conjunción formal

*Filminas 14 a 17.* El cierre de la práctica, y el tramo donde más se nota que es **más precisa que la teoría**.

### La definición como suma de dos requisitos

La filmina 14 es una portada de sección con una sola idea, escrita con código de color:

$$\underbrace{\text{Privacidad}}_{\text{rojo}} \;+\; \underbrace{\text{integridad}}_{\text{verde}} \qquad\Longleftrightarrow\qquad \underbrace{\texttt{CCA-Secure}}_{\text{rojo}} \;+\; \underbrace{\texttt{MAC-forge Secure}}_{\text{verde}}$$

y el nombre alternativo, *secure message transmission*. **Teoría nunca escribe la definición en estos términos**: enuncia el resultado (*"el criptosistema resultante es CCA-Secure"*) pero no define el cifrado autenticado como **conjunción de dos propiedades formales**. La segunda línea es la traducción de la primera, y es lo que hace verificable la noción. → [[cifrado-autenticado#Los dos ingredientes|Cifrado autenticado § Los dos ingredientes]]

### El experimento PrivK-CCA, más preciso que el de teoría

La filmina 15 lo escribe entero:

$$\begin{aligned}
&1)\ \ k \leftarrow \mathsf{Gen}(n)\\
&2)\ \ A \text{ recibe } 1^{n} \text{ y acceso a los oráculos } \mathsf{Enc}_k(\cdot) \text{ y } \mathsf{Dec}_k(\cdot),\\
&\qquad \text{y emite } m_{0}, m_{1} \text{ de igual longitud}\\
&3)\ \ b \leftarrow \{0,1\}; \ c \leftarrow \mathsf{Enc}_{k}(m_{b}) \text{ se entrega a } A \quad (\textit{challenge ciphertext})\\
&4)\ \ A \ \textbf{sigue teniendo acceso} \text{ a } \mathsf{Enc}_k(\cdot) \text{ y } \mathsf{Dec}_k(\cdot),\\
&\qquad \text{pero no puede preguntar por } c. \ A \text{ emite } b'\\
&5)\ \ \text{si } b' = b, \text{ la salida es } 1 \ (\text{ÉXITO}); \text{ si no, } 0
\end{aligned}$$

$$\Pr\bigl[\mathit{PrivK}^{CCA}_{A,\pi}(n) = 1\bigr] \le \tfrac{1}{2} + \mathit{negl}(n) \qquad \text{para todo adversario } \mathrm{PPT} \ A$$

**Cuatro precisiones que teoría 11 no tiene**, y son las mismas cuatro por las que la [[practica-03-seudoaleatoriedad-y-modos#6. El experimento PrivK-CPA, en 5 pasos|Práctica 03 §6]] resultaba la mejor versión del experimento `CPA`:

1. **El acceso a los oráculos continúa después del desafío** (paso 4). Teoría 11 no lo aclara, y sin eso `CCA` no se distingue de una prueba de una sola fase.
2. **La única restricción es no preguntar por $c$.** No es *"no usar el oráculo"*: es *"no usarlo sobre ese cifrado en particular"*, y toda la dificultad de las demostraciones `CCA` está en esa diferencia.
3. **$m_0$ y $m_1$ de igual longitud**, sin lo cual la prueba sería trivial de ganar.
4. **Cuantificación sobre todo adversario $\mathrm{PPT}$**, y la cota escrita con $\le$ y no con $=$.

**Lo que tiene teoría y no la práctica:** toda la **motivación** del ataque `CCA` — el ejemplo de la base de sueldos y la maleabilidad (filminas 5 a 10) y el ejercicio de demostrar que el cifrado de flujo no es `CCA`-seguro (filmina 12). → [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]] · [[maleabilidad|Maleabilidad]]

*(Detalle de la lámina: la numeración de pasos es `1) 2) 3) 4) 3)` — el último paso está numerado 3 en vez de 5.)*

### Las tres formas, con semáforo

La filmina 16 organiza las tres combinaciones como un **semáforo vertical**, que es más contundente que la lista de teoría 36:

| Forma | Qué se emite | Veredicto de la filmina |
|---|---|---|
| **1. Cifrar y autenticar por separado** | $\langle c,t\rangle$ con $c \leftarrow \mathsf{Enc}_{k_{1}}(m)$, $t \leftarrow \mathsf{Mac}_{k_{2}}(m)$ | **Rojo — INSEGURO.** La etiqueta $t$ puede brindar información de $m$ |
| **2. Autenticar y luego cifrar** | $c \leftarrow \mathsf{Enc}_{k_{1}}\bigl(m \Vert \mathsf{Mac}_{k_{2}}(m)\bigr)$ | **Amarillo — puede ser seguro, requiere prueba de seguridad.** *(x padding)* |
| **3. Cifrar y luego autenticar** | $\langle c,t\rangle$ con $c \leftarrow \mathsf{Enc}_{k_{1}}(m)$, $t \leftarrow \mathsf{Mac}_{k_{2}}(c)$ | **Verde — SEGURO**, siempre que los algoritmos de cifrado y MAC lo sean **y las claves sean independientes** |

**Dos aportes sobre teoría 36**, y el primero es una corrección de fondo:

1. **Teoría dice de la tercera forma, sin condiciones, *"siempre es seguro"*.** La práctica **agrega las dos hipótesis** que hacen verdadera esa afirmación: que los dos componentes sean seguros, y que **las claves sean independientes**. La segunda es exactamente lo que el [[#14. El ejercicio: claves iguales rompen encrypt-then-MAC|ejercicio de la filmina 18]] pone a prueba.
2. **La nota *"(x padding)"* sobre la segunda forma** apunta a los ataques de *padding oracle*: cuando se autentica y después se cifra, el receptor **tiene que descifrar antes de poder verificar**, y cualquier diferencia observable entre "padding mal formado" y "MAC inválido" se convierte en un oráculo. Es el motivo por el que la práctica es más prudente que teoría, que cuenta a esta forma entre las seguras.

> **Una discrepancia sobre esta filmina, registrada en la clase del 03/09.** Al dictar la misma lámina, el docente dio **SSH** como ejemplo de la segunda forma, *autenticar y luego cifrar* (cues pt2 700-706). Hay dos lecturas y las dos dejan en pie su argumento: el protocolo canónico de *authenticate-then-encrypt* es **SSL/TLS** —Katz lo dice explícitamente al analizar `TLS 1.2`—, mientras que **SSH** es el ejemplo canónico de la **primera** forma, *encrypt-and-MAC*, la que esta filmina marca en rojo, porque el MAC de SSH se calcula sobre el **texto plano** y viaja al lado del cifrado. Si la buena es SSH, el argumento del docente queda incluso más fuerte, porque sería la forma marcada insegura. El detalle está en la [[clase-03-macs-y-cifrado-autenticado|nota de clase]] y en [[privacidad-e-integridad#Las tres combinaciones|Privacidad e integridad]].

### La construcción, con la hipótesis que teoría omite

La filmina 17 escribe encrypt-then-MAC entero:

$$\begin{aligned}
&\pi_{E} = (\mathsf{Gen}_{E}, \mathsf{Enc}, \mathsf{Dec}) \ \text{ esquema } \texttt{CPA}\text{-seguro}\\
&\pi_{M} = (\mathsf{Gen}_{M}, \mathsf{Mac}, \mathsf{Vrfy}) \ \text{ MAC seguro } \textbf{con etiquetas únicas}\\
&\qquad (\forall k, \forall m \ \text{ hay un único } t \text{ con } \mathsf{Vrfy}(m,t)=1)\\[4pt]
&\mathsf{Gen}': \ k_{1} \leftarrow \mathsf{Gen}_{E}(1^{n}), \quad k_{2} \leftarrow \mathsf{Gen}_{M}(1^{n})\\[3pt]
&\mathsf{Enc}': \ c \leftarrow \mathsf{Enc}_{k_{1}}(m), \quad t \leftarrow \mathsf{Mac}_{k_{2}}(c) \ \Rightarrow \ \text{emitir } \langle c,t\rangle\\[3pt]
&\mathsf{Dec}': \ \text{si } \mathsf{Vrfy}_{k_{2}}(c,t) = 1 \ \text{ emitir } \mathsf{Dec}_{k_{1}}(c); \ \text{ si no, fallo}
\end{aligned}$$

**Tres cosas que teoría 37 no tiene:**

1. **La hipótesis de etiquetas únicas.** Es una condición **necesaria** en la demostración de Katz-Lindell y teoría la omite por completo. Un MAC probabilístico —uno donde el mismo $(k,m)$ admite varias etiquetas válidas— rompe el argumento: el adversario puede tomar el cifrado del desafío, cambiarle la etiqueta por otra igualmente válida, y **consultar el oráculo de descifrado sobre ese nuevo par**, que ya no es el $c$ prohibido. → [[cifrado-autenticado#El resultado: el criptosistema es CCA-Secure|Cifrado autenticado § El resultado]]
2. **La referencia bibliográfica precisa**: *"ver teorema 4.20"*, de Katz-Lindell, el libro que la filmina 41 de teoría recomienda.
3. **La intuición de la demostración**: *"la idea es mostrar que la desencripción que podría dar el oráculo no sirve para nada al adversario"*. Es decir: el oráculo sólo responde sobre cifrados que **el adversario ya construyó él mismo**, porque cualquier otro es rechazado en la verificación antes de llegar a descifrar. El oráculo `CCA` queda vaciado de contenido, y por eso `CCA` colapsa sobre `CPA`.

Y una estrella de advertencia al costado, que es el enganche directo con el ejercicio: **las claves $k_1$ y $k_2$ deben ser independientes**.

*(La práctica no dice nada de `CCM` ni `GCM`, que sí están en teoría 38 y 39. → [[ccm-y-gcm|CCM y GCM]])*

---

## 14. El ejercicio: claves iguales rompen encrypt-then-MAC

*Filmina 18.* El único ejercicio de la práctica, y **no está en el deck de teoría** (los de teoría son otros tres: el cifrado de flujo no `CCA`-seguro, los tres MACs candidatos, y esquematizar `AES-CCM`).

### El enunciado

> **Ejercicio.** Considerar:
> - $F$ una función pseudoaleatoria biyectiva fuerte
> - $\mathsf{Enc}_{k}(m) = F_{k}(m \Vert r)$
> - $\mathsf{Mac}_{k}(c) = F^{-1}_{k}(c)$ *(pasa Mac-Forge)*
>
> Probar que el esquema haciendo **cifrar y luego autenticar** no es resistente a `CCA` (por tener claves iguales).

**Cómo leer el enunciado antes de resolverlo:**

- *"Biyectiva fuerte"* quiere decir **permutación pseudoaleatoria fuerte** (*strong PRP*): tanto $F_k$ como $F^{-1}_k$ son indistinguibles de una permutación aleatoria y su inversa.
- El paréntesis *"(pasa Mac-Forge)"* es una **concesión deliberada**: el MAC, tomado aisladamente, es infalsificable, precisamente porque $F^{-1}_k$ es una permutación pseudoaleatoria cuando $F$ es una PRP fuerte. El fracaso **no se puede atribuir a un componente débil**.
- Y la clave: **la misma $k$ aparece en $\mathsf{Enc}$ y en $\mathsf{Mac}$**. Ahí está todo el ejercicio.

### La resolución

Componiendo según [[#13. Cifrado autenticado como conjunción formal|encrypt-then-MAC]] pero con $k_1 = k_2 = k$, sobre un mensaje $m$:

$$c \leftarrow \mathsf{Enc}_{k}(m) = F_{k}(m \Vert r)$$
$$t \leftarrow \mathsf{Mac}_{k}(c) = F^{-1}_{k}(c) = F^{-1}_{k}\bigl(F_{k}(m \Vert r)\bigr) = m \Vert r$$

y se emite $\langle c, t\rangle$.

**El MAC es exactamente la función inversa del cifrado y usa la misma clave, así que componerlos CANCELA el cifrado.** La etiqueta **es** el mensaje en claro concatenado con el aleatorio. El adversario no necesita romper nada: le alcanza con leer.

El ataque formal en el experimento de la [[#13. Cifrado autenticado como conjunción formal|filmina 15]]:

$$\begin{aligned}
&1)\ \ A \text{ elige } m_{0} \neq m_{1} \text{ cualesquiera, de igual longitud, y los emite}\\
&2)\ \ \text{recibe el desafío } \langle c, t\rangle \text{ con } c = F_{k}(m_{b}\Vert r) \ \text{ y } \ t = m_{b} \Vert r\\
&3)\ \ A \text{ descarta los últimos } \lvert r\rvert \text{ bits de } t \text{ y compara el prefijo con } m_{0} \text{ y } m_{1}\\
&4)\ \ \text{emite } b' = 0 \text{ si el prefijo es } m_{0}, \ b' = 1 \text{ si es } m_{1}
\end{aligned}$$

$$\Pr\bigl[\mathit{PrivK}^{CCA}_{A,\pi}(n) = 1\bigr] = 1 \;\;\gg\;\; \tfrac{1}{2} + \mathit{negl}(n)$$

### El remate: no falla en CCA, falla mucho antes

**El adversario nunca usó el oráculo de descifrado.** Es decir: el esquema **falla ya en la noción más débil de todas**. No es `CPA`-seguro, y ni siquiera es seguro frente a un espía pasivo (`Eav`), porque la etiqueta que viaja en claro **es el texto plano**. Que el enunciado pida probar la falla de `CCA` es apenas lo que la clase venía discutiendo; el ataque es **mucho más barato que eso**.

Dicho de otro modo: no hace falta hablar de indistinguibilidad. Basta con observar que **el criptograma transporta el mensaje en claro adentro**.

### La moraleja, que es la razón de ser del ejercicio

Cierra el círculo con la [[#13. Cifrado autenticado como conjunción formal|filmina 16]] y la estrella de advertencia de la 17:

- El **cifrado** es seguro por separado (es `CPA`-seguro por ser $F$ una PRP).
- El **MAC** es seguro por separado (lo concede el propio enunciado).
- La **forma de combinarlos es la correcta** — cifrar y luego autenticar, la única que la filmina marca en verde.
- **Lo único que falla es la independencia de las claves.**

Por eso la condición *"claves independientes"* que la práctica agregó al veredicto de la filmina 16 **no es una formalidad**: es lo que sostiene el teorema 4.20 citado en la filmina 17.

Este ejercicio es, literalmente, el pasaje *"The need for independent keys"* de la sección 4.5.2 de Katz & Lindell, con los mismos $\mathsf{Enc}_k(m) = F_k(m\Vert r)$ y $\mathsf{Mac}_k(c) = F^{-1}_k(c)$. El libro lo enuncia como principio general: *"different instances of cryptographic primitives should always use independent keys"* (Katz & Lindell, §4.5.2), y remata señalando que el mensaje queda revelado en claro. También aclara que esto no contradice el teorema de encrypt-then-MAC, porque la construcción **exige explícitamente** que $k_E$ y $k_M$ se elijan de manera independiente.

> **Un contrapunto que conviene registrar.** La filmina 38 de **teoría** afirma que `CCM` sí es `CCA`-seguro **usando la misma clave**, siempre que el IV y el nonce no coincidan ni se reutilicen. **No hay contradicción**: la reutilización de clave es insegura **en general**, y sólo es admisible cuando existe una **prueba de seguridad específica para esa construcción concreta** — que es justamente lo que `CCM` tiene y la composición genérica no. → [[ccm-y-gcm#CCM|CCM y GCM § CCM]] · [[privacidad-e-integridad#Dos claves independientes|Privacidad e integridad § Dos claves independientes]]

---

## 15. El Anexo: los ataques al CBC-MAC resueltos por la cátedra

[`Anexo Clase 4.pdf`](../../raw/practicas/Anexo%20Clase%204.pdf), cinco filminas, fechado **7 de abril de 2025** — o sea **material del cuatrimestre anterior reusado**. Su contenido son los ataques al `CBC-MAC` de las filminas 19 y 21 del deck de teoría, **dibujados**: nueve cadenas `CBC` completas contra cero en teoría.

**Dos cosas que hay que decir de entrada:**

1. **La filmina 2 trae una falsificación que el deck de teoría no tiene** — la de **una sola consulta** —, y el vault ya la tenía derivada por su cuenta creyendo que no era material de cátedra. **Sí lo es**, y no como variante marginal: es el ejemplo **principal** del `Anexo`, el primero que presenta, y la versión de teoría queda relegada a un *"otra forma de hacerlo"*.
2. **La filmina 5 es la resolución de la cátedra de la tarea que Abad dejó el 27/08.** Ese jueves el docente bosquejó el ataque de sufijo en voz y lo dejó de tarea (*"se los dejo de tarea, pero si lo desarrollan como desarrollamos el anterior van a ver que da"*, cue pt1 785). La resolución estaba escrita desde 2025 y se distribuyó por el lado de la práctica. **El vault ya lo había resuelto por su cuenta y coincide bloque por bloque.** *(Que el `Anexo` se haya repartido con ese propósito es lectura nuestra: ninguna fuente lo declara.)*

La filmina 1 es un recordatorio de la construcción de longitud fija, idéntico a [[cbc-mac#La construcción|teoría 18]] más dos datos que teoría no explicita: $\lvert k\rvert = n$ y $\lvert m\rvert = \ell(n)\cdot n$.

> **Aporte transversal del `Anexo`: el encuadre explícito en `Mac-Forge`.** Las tres filminas de ataque abren nombrando el experimento $\mathit{Mac\text{-}Forge}_{A,\pi}(n)$, listan el paso $k \leftarrow \mathsf{Gen}(n)$, dicen *"el adversario $A$ que tiene acceso al oráculo"* y **escriben el conjunto $Q$ con sus pares $\langle$mensaje, etiqueta$\rangle$ desarrollados**. La filmina 19 de teoría no nombra el experimento ni escribe $Q$: arranca directo en *"crear dos bloques aleatorios $A$ y $B$"*.

> **Colisión de nombres, propia de las filminas.** La letra $A$ nombra **a la vez** al adversario (impreso en rojo) y a un bloque de mensaje (impreso en verde). El `Anexo` no lo aclara. Acá, cuando haya ambigüedad, se escribe *"el adversario"* en palabras y se reserva $A$ para el bloque.

### 15.1. Falsificación con una sola consulta

*Anexo, filmina 2.* **No está en el deck de teoría.**

![Anexo filmina 2: falsificación con una sola consulta](../../assets/anexo04-cbcmac-falsificacion-1-consulta.png)

**El esquema atacado:** `CBC-MAC` tal cual la filmina 1, pero **aceptando mensajes de cualquier cantidad de bloques**.

**La consulta.** El adversario elige un bloque cualquiera $A$ de $n$ bits y pide $t_{1} = \mathsf{Mac}_k(m_1)$ con $m_1 = A$. Como $A$ ocupa exactamente un bloque:

$$t_{1} = F_{k}(t_{0} \oplus A) = F_{k}(0^{n} \oplus A) = F_{k}(A)$$

Queda $Q = \bigl\{\langle A,\ F_{k}(A)\rangle\bigr\}$, que es lo que la filmina escribe.

**La falsificación.** Emitir el mensaje de **dos** bloques

$$m_{2} = A \,\Vert\, (t_{1} \oplus A) \qquad \text{con la etiqueta } t_{2} = t_{1}$$

**Verificación, bloque por bloque.** Llamando $v_1, v_2$ a los estados de la cadena de $m_2$:

$$v_{1} = F_{k}(0^{n} \oplus A) = F_{k}(A) = t_{1}$$
$$v_{2} = F_{k}\bigl(v_{1} \oplus (t_{1} \oplus A)\bigr) = F_{k}\bigl(t_{1} \oplus t_{1} \oplus A\bigr) = F_{k}(0^{n} \oplus A) = F_{k}(A) = t_{1}$$

$\mathsf{Mac}_k(m_2) = v_2 = t_1$, que es la etiqueta emitida. `Vrfy` devuelve 1. Y $m_2 \notin Q$: tiene dos bloques y la única consulta tenía uno — **$A$ es prefijo de $m_2$, pero no es $m_2$**, y `Mac-Forge` sólo prohíbe emitir un mensaje que esté en $Q$. Por lo tanto $\Pr[\mathit{Mac\text{-}Forge} = 1] = 1$: no es una ventaja no despreciable, es **certeza**.

**Qué se cancela con qué.** La cadena entra al segundo $F_k$ con el estado $v_1$, y ese estado es exactamente el valor **público** $t_1$ que el oráculo le entregó al adversario. Poniendo $t_1 \oplus A$ como segundo bloque, el XOR del encadenamiento calcula

$$v_{1} \oplus (t_{1}\oplus A) \;=\; t_{1} \oplus t_{1} \oplus A \;=\; 0^{n} \oplus A \;=\; A$$

El $t_1$ que aporta el encadenamiento **se anula** contra el $t_1$ que el adversario escribió adentro del bloque, y en la entrada de $F_k$ queda **$A$ pelado** — el mismo argumento que ya se evaluó en la primera iteración. Es la técnica de *primero anular con un xor conocido, después escribir*, la misma que el docente había usado para el ataque a la [[maleabilidad|base de sueldos]].

**Lo que el dibujo hace ver de un golpe** y el texto no: el $t_1$ que sale de la caja verde de la cadena de arriba **es el mismo $t_1$ que el adversario escribe adentro del segundo bloque de la de abajo**. El valor público de la consulta se reinyecta como dato y se encuentra consigo mismo en el XOR del encadenamiento.

> **Cambio de estatus en el vault.** [[cbc-mac#El ataque de longitud variable, paso a paso|cbc-mac.md]] tenía este ataque en un callout rotulado *"no está en la filmina; es la variante de un bloque del Ejercicio 4.13(a) de K&L, verificada acá"*. **Esa afirmación quedó caduca**: sí está en una filmina de la cátedra, con la misma fórmula —$m_2 = A\Vert(t_1\oplus A)$ con $t_2 = t_1$— y la misma verificación en dos renglones. Pasa de derivación propia a **material de cátedra**.

### 15.2. Falsificación con dos consultas, y la errata

*Anexo, filmina 3*, bajo el título *"otra forma de hacerlo"*. Es el ataque que sí está en teoría 19. **Y acá está el hallazgo más fino de toda la ingesta: la filmina tiene una errata, y el diagrama la repite.**

![Anexo filmina 3: falsificación con dos consultas](../../assets/anexo04-cbcmac-falsificacion-2-consultas.png)

**Lo que dice la filmina, literal:**

$$m_{1} = A, \qquad m_{2} = A \Vert B \qquad (A \text{ y } B \text{ del tamaño de un bloque})$$
$$Q = \bigl\{\langle A,\ F_{k}(A)\rangle,\ \langle A\Vert B,\ F_{k}(B \oplus F_{k}(A))\rangle\bigr\}$$
$$m_{3} = A \Vert B \Vert (A \oplus t_{1}), \qquad t_{3} = t_{2}$$

**Las consultas están bien.** Desarrollándolas:

$$t_{1} = \mathsf{Mac}_k(A) = F_{k}(0^{n}\oplus A) = F_{k}(A)$$
$$t_{2} = \mathsf{Mac}_k(A\Vert B) = F_{k}\bigl(F_{k}(A) \oplus B\bigr) = F_{k}(t_{1} \oplus B)$$

y el hallazgo que la filmina quiere exhibir es correcto: **el estado intermedio que la cadena de $m_2$ calcula y descarta es $F_k(A)$, que es literalmente $t_1$, la etiqueta completa de la primera consulta.**

#### Por qué la falsificación escrita no cierra

Llamando $s_1, s_2, s_3$ a los estados de la cadena de $m_3 = A\Vert B\Vert(A\oplus t_1)$:

$$s_{1} = F_{k}(0^{n}\oplus A) = F_{k}(A) = t_{1}$$
$$s_{2} = F_{k}(s_{1} \oplus B) = F_{k}(t_{1} \oplus B) = t_{2}$$
$$s_{3} = F_{k}\bigl(s_{2} \oplus (A\oplus t_{1})\bigr) = F_{k}\bigl(t_{2} \oplus A \oplus t_{1}\bigr)$$

Para que $s_3$ fuera $t_2 = F_k(t_1\oplus B)$ haría falta

$$t_{2} \oplus A \oplus t_{1} = t_{1} \oplus B \qquad\Longleftrightarrow\qquad t_{2} = A \oplus B$$

que es una coincidencia de probabilidad despreciable sobre la que el adversario **no tiene ningún control**. **La falsificación tal como está escrita falla.**

#### El diagnóstico: un cruce de subíndices heredado de teoría

> **Errata de la filmina.** Las dos últimas líneas de la filmina 3 del `Anexo` están mal, y el diagrama repite el mismo error.

El origen es un **cambio de etiquetado que no se propagó a la fórmula**:

| | Orden de las consultas | Qué es $t_1$ | Qué es $t_2$ | ¿La falsificación cierra? |
|---|---|---|---|---|
| **Teoría, filmina 19** | $m_1 = A\Vert B$, $m_2 = A$ | etiqueta del mensaje de **dos** bloques | etiqueta del de **uno** | **Sí** |
| **Anexo, filmina 3** | $m_1 = A$, $m_2 = A\Vert B$ | etiqueta del de **uno** | etiqueta del de **dos** | **No** |

El `Anexo` **invierte el orden de las consultas** respecto de teoría —lo cual es perfectamente legítimo y hasta más natural— **pero copia la línea de la falsificación sin ajustar los subíndices**. Con el etiquetado del `Anexo`, $t_1$ ya no es el estado con el que se entra al tercer bloque: ése es $t_2$.

Con el etiquetado de teoría la cuenta sí cierra: $s_3 = F_k(t_1 \oplus A \oplus t_1) = F_k(A) = t_2$. **La filmina 19 de teoría, con su propio etiquetado, está bien.** El error lo introduce el `Anexo`.

#### La corrección

Traduciendo fielmente el ataque de teoría al etiquetado del `Anexo`: el tercer bloque tiene que ser $A \oplus t_{2}$, y la etiqueta falsificada es $t_{1}$.

$$\boxed{\ m_{3} = A \,\Vert\, B \,\Vert\, (A \oplus t_{2}), \qquad t_{3} = t_{1}\ }$$

**Verificación:**

$$s_{1} = F_{k}(A) = t_{1}, \qquad s_{2} = F_{k}(t_{1}\oplus B) = t_{2}, \qquad s_{3} = F_{k}\bigl(t_{2} \oplus (A\oplus t_{2})\bigr) = F_{k}(A) = t_{1}$$

Cierra. Y $m_3 \notin Q$, porque tiene tres bloques contra dos y uno. Probabilidad de éxito **1**.

**Dos arreglos alternativos**, por si conviene conservar la línea $t_3 = t_2$ tal como está impresa:

| Arreglo | Falsificación | Verificación | Comentario |
|---|---|---|---|
| **a** | $m_{3} = A\Vert B\Vert(B \oplus t_{1} \oplus t_{2})$, $t_{3} = t_{2}$ | $s_{3} = F_{k}(t_{2}\oplus B\oplus t_{1}\oplus t_{2}) = F_{k}(t_{1}\oplus B) = t_{2}$ | correcto, pero menos elegante: no deja $A$ pelado, deja $t_1 \oplus B$ |
| **b** | $m_{3} = A\Vert(A\oplus t_{1})\Vert B$, $t_{3} = t_{2}$ | $s_{1} = t_{1}$; $s_{2} = F_{k}(t_{1}\oplus A\oplus t_{1}) = F_{k}(A) = t_{1}$; $s_{3} = F_{k}(t_{1}\oplus B) = t_{2}$ | el que **mejor conecta con la filmina 2**: el segundo bloque hace el truco de una consulta, y recién después se pega el $B$ |

#### Alcance de la errata

Afecta a las **dos representaciones**, no sólo al texto:

- La línea de texto $m_3 = A\Vert B\Vert(A \oplus t_1)$ con $t_3 = t_2$.
- **El tercer diagrama**, cuya tercera caja de bloque está rotulada *"A xor t₁"* y cuya caja verde de salida es $t_3$, presentada como igual a $t_2$.

**No es un artefacto de extracción.** Verificado con recorte ampliado a 220 dpi: el cableado del diagrama es `CBC` estándar, sin saltos ni cruces —la entrada del tercer XOR viene de $t_2$, del segundo $F_k$—, y el rótulo del tercer bloque dice inequívocamente *"A xor t₁"* con subíndice 1. **El dibujo es internamente consistente con la fórmula escrita, y las dos están mal por el mismo motivo.**

#### Qué agrega esta versión sobre la de una consulta

**En potencia, nada**: las dos falsifican con probabilidad 1. Pero es **más didáctica**, porque **exhibe** el estado intermedio robado en vez de esconderlo. En la [[#15.1. Falsificación con una sola consulta|filmina 2]] el estado robado es la propia etiqueta que se reemite; acá se ve explícitamente que **el estado interno de una cadena larga coincide con la etiqueta completa de una cadena corta**.

### 15.3. Opciones seguras

*Anexo, filmina 4.* La única de las cinco que es puro texto, sin diagrama. Son las mismas tres opciones de [[cbc-mac#Las tres extensiones seguras|teoría 20]] y de la [[#7. CBC-MAC y las tres opciones seguras|filmina 5 de esta práctica]], con dos diferencias de notación y ninguna de fondo:

| | Teoría 20 | Anexo filmina 4 | Qué gana el `Anexo` |
|---|---|---|---|
| Opción 1 | $k' := F_k(\lvert m\rvert)$ | $k_{\ell} := F_k(\lvert m\rvert)$ | el subíndice $\ell$ **hace explícito que hay una clave por cada longitud**, que es precisamente el argumento de seguridad |
| Opción 3 | $t'$ = salida de la cadena, $t$ = etiqueta final | $t$ = salida de la cadena, $\hat{t}$ = etiqueta final | nada; son los mismos símbolos corridos |

**Confirmado en el render a 220 dpi:** las barras de valor absoluto **están**. La Opción 1 aplica $F_k$ a la **longitud**, $F_k(\lvert m\rvert)$, no al mensaje; la Opción 2 antepone la **longitud**, $\lvert m\rvert \Vert m$, no una copia del mensaje. Las lecturas $F_k(m)$ y $m \Vert m$ que devuelve la extracción de texto son **falsos positivos ya conocidos**. Coincide exactamente con lo verificado en la filmina 5 de esta práctica.

**Lo que el `Anexo` no trae**, y sigue estando sólo en la teoría, en la transcripción y en el vault: por qué cada opción tapa el agujero, el criterio *prefix-free* y el Teorema 4.13 de Katz-Lindell, el nombre `EMAC`, cuál se usa en la práctica y el costo de las dos claves independientes. → [[cbc-mac#El criterio que unifica los cuatro casos|CBC-MAC § El criterio que unifica los cuatro casos]]

### 15.4. Por qué el sufijo no sirve, resuelto por la cátedra

*Anexo, filmina 5.* Es **el mismo ataque de la filmina 21 de teoría**, ahora con las tres cadenas dibujadas. Y es la resolución de la tarea del 27/08.

![Anexo filmina 5: el ataque de sufijo](../../assets/anexo04-cbcmac-ataque-sufijo.png)

#### Tabla de equivalencia de notación, indispensable antes de leer

**El `Anexo` y el vault usan las mismas letras para cosas distintas.** Sin esta tabla el lector que venga de [[cbc-mac#Por qué la longitud como sufijo no sirve|03.05]] va a creer que las dos fuentes se contradicen.

| Objeto | `Anexo` | Vault (`03.05`) |
|---|---|---|
| Etiqueta de $m_1 = AAA$ | $T_{1}$ (mayúscula, caja verde) | $t_{1}$ |
| Etiqueta de $m_2 = BBB$ | $T_{2}$ | $t_{2}$ |
| Etiqueta de $m_3 = AAA3CC$ | $T_{3}$ | $t_{3}$ |
| Etiqueta falsificada | $T_{4} = T_{3}$ | $t_{3}$ |
| Estado tras 4 bloques de $m_3'$ | $t_{4}$, con el rótulo **$T_1 = t_4$** dentro del dibujo | $t_{1}$ (se demuestra que lo es) |
| Estado 5 de $m_3'$ | $t_{5}$ | $p$ |
| Estado 6 de $m_3'$ | $t_{6}$ | $q$ |
| Estados intermedios en general | $t_{i}$ **minúscula** | $\mathrm{st}(\cdot)$ y nombres auxiliares |

**En resumen: $T_i^{\text{Anexo}} = t_i^{\text{vault}}$.** El `Anexo` reserva las **mayúsculas $T_i$ para las etiquetas** que devuelve el oráculo y las **minúsculas $t_i$ para los estados** que la cadena calcula y descarta; el vault usa $t_i$ para las etiquetas.

> **Advertencia sobre el diagrama.** Los rótulos $t_1, t_2, t_3$ **se reusan en las tres cadenas** y valen cosas distintas en cada una. Sólo $T_1, T_2, T_3$ son globales.

**La separación tipográfica del `Anexo` es, en sí misma, un aporte** sobre teoría, que llama $t_i$ a todo: la distinción entre etiqueta publicada y estado descartado **es justamente la que el ataque explota**, así que verla en la notación ayuda.

#### El ataque

**El esquema atacado** es la variante que pone la longitud como **sufijo**:

$$m' := m \,\Vert\, \lvert m\rvert, \qquad \mathsf{Mac}_k(m) := \mathsf{CBC\text{-}MAC}_k(m')$$

Escribiendo $\langle\ell\rangle$ para el bloque que codifica la longitud $\ell$ **medida en bloques**, y recordando que `AAA` es el **mismo** bloque $A$ tres veces:

$$\begin{aligned}
m_{1} = AAA &\;\longrightarrow\; m_{1}' = A\,A\,A\,\langle3\rangle, && T_{1}\\
m_{2} = BBB &\;\longrightarrow\; m_{2}' = B\,B\,B\,\langle3\rangle, && T_{2}\\
m_{3} = AAA3CC &\;\longrightarrow\; m_{3}' = A\,A\,A\,\langle3\rangle\,C\,C\,\langle6\rangle, && T_{3}
\end{aligned}$$

**El truco central, que el diagrama escribe y teoría deja para deducir:** los primeros cuatro bloques de $m_3'$ son **exactamente $m_1'$ entero** —el mensaje $m_1$ ya rellenado con su propio bloque de longitud—, así que el estado de la cadena de $m_3$ después de cuatro bloques **vale $T_1$**. El `Anexo` lo rotula, dentro del dibujo y en una caja resaltada:

$$T_{1} = t_{4}$$

Nada del esquema impide construir $m_3$ así: $\langle3\rangle$ es un bloque como cualquier otro y ningún mensaje legítimo tiene prohibido llevarlo en el medio. **Ésa es la falla del sufijo: el mensaje-con-relleno de uno es prefijo legal de otro.**

Siguiendo la cadena de $m_3'$:

$$t_{5} = F_{k}(T_{1} \oplus C), \qquad t_{6} = F_{k}(t_{5} \oplus C), \qquad T_{3} = F_{k}\bigl(t_{6} \oplus \langle6\rangle\bigr)$$

**La falsificación:**

$$X := T_{1} \oplus T_{2} \oplus C, \qquad \text{emitir } \bigl(m_{4},\, T_{4}\bigr) \ \text{ con } \ m_{4} = BBB3XC \ \text{ y } \ T_{4} = T_{3}$$

**Verificación.** $m_4 = B\,B\,B\,\langle3\rangle\,X\,C$ tiene **seis** bloques, igual que $m_3$, así que su mensaje con relleno es $m_4' = B\,B\,B\,\langle3\rangle\,X\,C\,\langle6\rangle$ — **con el mismo bloque $\langle6\rangle$**. Llamando $w_i$ a sus estados:

$$w_{4} = T_{2} \qquad \text{(los bloques 1 a 4 son exactamente } m_{2}')$$
$$w_{5} = F_{k}(w_{4} \oplus X) = F_{k}\bigl(T_{2} \oplus T_{1} \oplus T_{2} \oplus C\bigr) = F_{k}(T_{1} \oplus C) = t_{5}$$
$$w_{6} = F_{k}(w_{5} \oplus C) = F_{k}(t_{5}\oplus C) = t_{6}$$
$$\mathsf{Mac}_k(m_{4}) = F_{k}\bigl(w_{6} \oplus \langle6\rangle\bigr) = F_{k}\bigl(t_{6}\oplus\langle6\rangle\bigr) = T_{3}$$

**Ahí está todo el ataque, en el paso de $w_5$.** El bloque $X$ está calculado para que $T_2 \oplus X = T_1 \oplus C$: **cancela** el estado que la cadena de $m_4$ trae ($T_2$) e **instala** el estado que la cadena de $m_3$ traía en ese punto ($T_1$), ya mezclado con $C$. **Desde el quinto bloque en adelante las dos cadenas son la misma.**

Y $m_4 \notin Q = \{AAA,\ BBB,\ AAA3CC\}$: contra los dos primeros difiere en cantidad de bloques, y contra el único de seis difiere ya en el primero ($B$ contra $A$).

#### Qué agrega el Anexo, y qué sigue faltando

**El `Anexo` coincide con el vault bloque por bloque.** La resolución que [[cbc-mac#Por qué la longitud como sufijo no sirve|03.05]] había derivado por su cuenta —cuando la única fuente era el bosquejo en voz del docente— **es correcta término a término**: los tres mensajes de consulta, el $X = T_1\oplus T_2\oplus C$, el mensaje forjado, la identidad $T_1 = t_4$ y las tres ecuaciones de la cadena de $m_3$.

**Lo que el `Anexo` agrega:** los tres diagramas, el rótulo $T_1 = t_4$ escrito adentro del dibujo, la separación tipográfica entre etiquetas y estados, y el mensaje falsificado **numerado** como $m_4$ con etiqueta $T_4$, que deja más claro que es una cuarta pieza distinta de las tres consultas.

**Lo que el `Anexo` no hace, y el vault sí:**

- **No dibuja la cuarta cadena**, la del mensaje falsificado. La verificación de que la falsificación cierra queda del lado del lector; el vault **es** esa verificación escrita completa.
- **No chequea que $m_4 \notin Q$** en ninguno de los tres ataques.
- **No aclara en qué unidad se mide la longitud** que codifican los bloques `3` y `6` (son **bloques**, no bytes ni bits), ni que `AAA` es el mismo bloque tres veces.
- No menciona el criterio *prefix-free*, ni el Teorema 4.13, ni la variante con un solo $C$, ni la atribución al Ejercicio 4.15 de Katz-Lindell.

**El `Anexo` es puro desarrollo mecánico; la interpretación sigue estando en la teoría, en la transcripción y en el vault.** El marco narrativo de `03.05` —*"quedó de tarea, acá lo resolvimos"*— sigue siendo cierto en cuanto al álgebra, pero hay que agregarle que **la cátedra tenía la resolución hecha desde 2025**.

---

## Erratas y precisiones de las filminas

Todas verificadas **renderizando la página**, nunca leyendo el texto extraído. Las que son artefactos de extracción van [[#Artefactos de extracción|en la sección siguiente]], aparte.

| Filmina | Dice | Debería decir |
|---|---|---|
| **P4-2** | $\Pr[\mathit{MAC\text{-}Forge}_{A,\pi}(n)=1] \le \mathit{negl}(\ )$ — el paréntesis **vacío** | $\mathit{negl}(n)$: falta el argumento. Sin él la cota no dice nada, porque *"despreciable"* es una propiedad **respecto del parámetro de seguridad** |
| **P4-2** | *"El adversario $A$ emite un par $\langle m,t\rangle$.de igual longitud"* | La cláusula *"de igual longitud"* **está de más**: en `Mac-Forge` el adversario emite **un solo** par mensaje-etiqueta y no hay contra qué comparar longitudes. Es un arrastre de los experimentos de indistinguibilidad, donde el adversario sí emite **dos** mensajes — compárese con la filmina 15, que la usa correctamente. *(Falta además el espacio después del punto.)* |
| **P4-5** | $t_{i} = F_{k}(t_{i-1 \oplus} m_{i})$ — el $\oplus$ compuesto **a la altura del subíndice**, pegado al `i-1` | $t_{i} = F_{k}(t_{i-1} \oplus m_{i})$. Es un **defecto tipográfico real del PDF**, no un artefacto: el $\oplus$ quedó dentro del subíndice. El contenido es correcto y el diagrama de la misma lámina lo dibuja bien |
| **P4-8** | *"3. Resistente a preimagen — dado $H^{s}(x)=y$, encontrar algún $x'$ tal que $H^{s}(x)=H^{s}(x')$"* | *"Dado $y$, encontrar algún $x'$ tal que $H^{s}(x') = y$"*. Tal como está, **la condición es idéntica a la del nivel 1** y no captura la inversión: la $x$ aparece en la conclusión sin ser dato del problema. Teoría 25 lo dice bien. Ver [[#8. Funciones de hash y los niveles de seguridad\|§8]] |
| **P4-8** | Los **tres** diagramas de conjuntos que acompañan a los tres niveles | Son **el mismo dibujo repetido tres veces** (dos puntos del dominio convergiendo en uno del codominio, sin rótulos), verificado con recortes individuales a 220 dpi. Ese dibujo es **una colisión**, así que sólo corresponde al nivel 1 |
| **P4-10** | Tabla de primitivas: `MD5` / `Sha1` / `Sha3` | **Falta `SHA-2`** (256/384/512), que sí figura en teoría 35 y es la familia más usada en producción. Tampoco se marca `MD5` como quebrada. Es una **omisión**, no un dato falso |
| **P4-11** | *"Transformación de Merkle **Darmgard**"* | **Merkle-Damgård**: están transpuestas la `r` y la `m`, falta la `å` y falta el guion. Verificado con recorte del título a 250 dpi |
| **P4-12** | En el diagrama de `NMAC`, la caja de entrada del tercer eslabón dice $z_{1} \Vert m_{B}$ | $z_{B-1} \Vert m_{B}$: el eslabón del último bloque de mensaje recibe el estado **anterior**, no el primero. Error de copiado del segundo eslabón. Verificado con recorte de las cinco cajas a 250 dpi |
| **P4-13** | $opad = \texttt{0x36}$ repetido, $Ipad = \texttt{0x5C}$ repetido | **Intercambiados**: $ipad = \texttt{0x36}$ (*inner*), $opad = \texttt{0x5C}$ (*outer*). La **fórmula de la misma lámina sí es correcta**, o sea que la filmina se contradice consigo misma. **Es la misma errata de la filmina 33 del deck de teoría**: dos decks de dos autoras distintas arrastran el mismo error de origen. Ver [[#12. HMAC con las dos cadenas dibujadas\|§12]] |
| **P4-15** | La numeración de los pasos del experimento es `1) 2) 3) 4) 3)` | El último paso debería estar numerado **5)**. Aparece como 3), repitiendo el número del paso donde se elige el bit |
| **Anexo-3** | $m_{3} = A\Vert B\Vert(A \oplus t_{1})$ con $t_{3} = t_{2}$, **y el diagrama, cuya tercera caja dice "A xor t₁"** | $m_{3} = A\Vert B\Vert(A \oplus t_{2})$ con $t_{3} = t_{1}$. El `Anexo` invierte el etiquetado de las consultas respecto de teoría 19 pero copia la fórmula sin ajustar los subíndices. **Teoría, con su propio etiquetado, está bien.** Verificación algebraica completa y dos arreglos alternativos en [[#15.2. Falsificación con dos consultas, y la errata\|§15.2]] |

**Precisiones que no son erratas:**

- **P4-9.** Teoría dice *"tamaño mínimo de salida: 160 bits"*; la práctica dice **"mayor de 160 bits"**. La práctica es **más estricta**, y tiene razón. Además agrega *"es una condición necesaria pero no suficiente"*, que teoría no dice.
- **P4-10.** La columna de construcciones dice `CBC-MAC/Merkle`, **con barra** — verificado a 250 dpi. Eso sostiene la lectura de *enumeración de dos construcciones iterativas* y **no** la de un nombre único, así que no se declara errata; sigue siendo impreciso poner un MAC en una tabla de primitivas de hash. Ver [[#9. Primitivas y los dos modelos de construcción|§9]].
- **P4-13.** *"$n$ veces byte"* mezcla unidades con $\lvert k\rvert = n$, que está en bits; y en el diagrama el rótulo $z_0$ se reutiliza para dos valores distintos (el primer estado de la cadena interna y el de la externa), que no son iguales porque la clave enmascarada difiere.
- **P4-11.** La caja de fórmula escribe $z_i = h_{s}(z_{i-1}\Vert x_i)$ con $s$ como **subíndice** mientras el resto de la lámina usa $h^{s}$ con superíndice. Inconsistencia interna menor de la propia filmina.
- **Transversal.** La práctica usa $H^{s}$ / $h^{s}$ con **superíndice** y teoría usa $H_s$ con **subíndice**. Es una discrepancia notacional entre decks, no una errata. Y `Keccak` está **bien escrito** en la práctica; la errata *"Kekkak"* es de teoría 35.
- **Anexo-2.** El texto llama $t_1$ a la etiqueta de la consulta, pero la caja verde del diagrama la rotula $t_\ell$ (el rótulo genérico copiado de la filmina 1). Como el mensaje tiene un bloque, $\ell = 1$ y son el mismo valor.
- **Anexo-3.** El conjunto $Q$ se escribe con una **coma suelta antes de la llave de cierre** — confirmado en el render. Cosmético.

---

## Artefactos de extracción

Defectos que **la extracción automática de texto inventa** y que el PDF no tiene. Van aparte de las erratas, siguiendo el precedente de la [[clase-03-macs-y-cifrado-autenticado#Erratas y precisiones de las filminas|nota de la Clase 03]].

| Filmina | Parece | Es |
|---|---|---|
| **P4-4** | Que la lámina sólo contiene la construcción genérica más las palabras sueltas *"CBC-MAC"* e *"¡Ineficiente!"* | **Artefacto grave por pérdida de contenido.** Faltan **tres cajas completas** —"Sugerencia 1/2/3"— con sus fórmulas y sus tres anotaciones de ataque. Es **más de la mitad de la lámina**, y sólo se recupera renderizando. Ver [[#6. Longitud variable: las tres sugerencias fallidas\|§6]] |
| **P4-4** | Que *"¡Ineficiente!"* y *"CBC-MAC"* son dos anotaciones sueltas sin relación | *"¡Ineficiente!"* es una caja de borde rojo con triángulo de advertencia, ubicada a la derecha de la construcción genérica, y de ella sale una **flecha verde gruesa** hacia `CBC-MAC`. **Califica a la construcción genérica, no a `CBC-MAC`** |
| **P4-4** | `\|m\|=L<2n/4` y `r ←{0,1}n/4` | $\lvert m\rvert = L < 2^{n/4}$ y $r \leftarrow \{0,1\}^{n/4}$ — superíndices reales aplanados |
| **P4-5** | Opción 1: $k_l := F_k(m)$ · Opción 2: $m' := m \Vert m$ | **Falso positivo ya conocido**, re-confirmado a 250 dpi: es $F_k(\lvert m\rvert)$ (la PRF se evalúa en la **longitud**) y $m' := \lvert m\rvert \Vert m$ (se **antepone** la longitud). **La herramienta se come las barras de valor absoluto.** Ídem en el `Anexo` filmina 4 |
| **P4-5** | Opción 3: $k_1 \leftarrow 0,1^{n}$, como si el conjunto no tuviera llaves | $k_1 \leftarrow \{0,1\}^{n}$: las llaves están en el render y el $n$ es superíndice real |
| **P4-5** | $t_i = F_k(t_{i-1}\oplus m_i)$, una expresión normal | **Caso inverso al habitual**: acá la extracción **disimula** un defecto que sí existe. En el render el $\oplus$ está a la altura del subíndice. Está listado en las erratas |
| **P4-8** | $H_{s}(x)$, con la $s$ como subíndice, igual que en teoría | En el render la $s$ es **superíndice**: $H^{s}(x)$. Discrepancia notacional entre decks, no errata |
| **P4-9** | *"(280 cómputos)"*, que se lee como el número 280 | $2^{80}$: el `80` es un superíndice real, en negrita |
| **P4-10** | *"Iterativo   CBC-MAC/Merkle"* en una línea, como si fuera una construcción llamada *"CBC-MAC-Merkle"* | Son **dos columnas** unidas por una flecha bifurcada: la rama *Iterativo* tiene como instancias `CBC-MAC` y `Merkle`, la rama *Esponja* tiene `Keccak (SHA-3)` |
| **P4-11** | `|x| = L < 2 l(n)`, como si el 2 y el $l(n)$ fueran factores | $\lvert x\rvert = L < 2^{l(n)}$: superíndice real. Ídem $h^{s}: \{0,1\}^{2l}\to\{0,1\}^{l}$ y $z_0 = 0^{l}$ |
| **P4-12** | Una tira de caracteres sin estructura donde va la fórmula de `NMAC` | $t := h^{s}_{k_1}\bigl(H^{s}_{k_2}(m)\bigr)$: doble índice (superíndice $s$, subíndice $k_i$) y paréntesis, todo presente en el render |
| **P4-12** | Que las cajas del diagrama son texto corrido junto al cuerpo | Son **cinco eslabones trapezoidales encadenados en fila**, cada uno con su entrada arriba y su salida abajo. El orden y la separación sólo se leen en el render — y ahí se ve la errata del tercer eslabón |
| **P4-13** | Que *"IV ‖(k⊕ipad)  z0 ‖ m1  zB ‖ L"* pertenece al cuerpo de la lámina | Son las cajas de entrada de **dos cadenas de compresión distintas** (la interna arriba, la externa abajo). La extracción las intercala con el texto del margen y hace ilegible la estructura de dos pasadas, que es **justamente el contenido de la filmina** |
| **P4-15** | $\Pr[\ldots] \le 1 + \mathit{negl}(n)$, con un `1` y un `2` en líneas separadas | $\le \tfrac{1}{2} + \mathit{negl}(n)$: el 1 y el 2 son numerador y denominador de una **fracción apilada real** |
| **P4-16** | Que los veredictos *"INSEGURO"*, *"Puede ser seguro"* y *"SEGURO"* son texto plano al margen | Cada uno va acompañado de un **círculo de semáforo** —rojo, amarillo, verde—, que es el organizador visual de la lámina. La extracción pierde los tres círculos |
| **P4-17** | Que *"las claves k1 y k2 deben ser independientes"* es una línea más del cuerpo | Está dentro de una **estrella color durazno con borde rojo**, al costado, y es la advertencia destacada de la lámina — el enganche directo con el ejercicio de la 18 |
| **P4-18** | `Mack(c)=F-1k(c)` | $\mathsf{Mac}_{k}(c) = F^{-1}_{k}(c)$: el $-1$ es un **superíndice real** (la inversa de la permutación), no una resta |
| **P4-1, 3, 15, 16, 17** | `kGen(1n)`, `tMack(m)`, `cEnck1(m)` | Las **flechas de asignación $\leftarrow$ se pierden** en la extracción, junto con los superíndices: $k \leftarrow \mathsf{Gen}(1^{n})$, $t \leftarrow \mathsf{Mac}_k(m)$, $c \leftarrow \mathsf{Enc}_{k_1}(m)$ |
| **P4-1** | Que la lámina sólo tiene texto | Tiene dos iconos (pulgar arriba y pulgar abajo) y una flecha bifurcada, que la extracción no ve. *(Al pasar a la wiki los emojis no se reproducen: el contraste va en palabras.)* |

---

## Cabos sueltos

- **La construcción genérica de la filmina 4 no tiene demostración acá.** La práctica la presenta y la descarta por ineficiente sin probar que es segura. La prueba es la de la **construcción 4.7 de Katz-Lindell**; el argumento de por qué cada uno de los cuatro campos es necesario está [[#6.4. La construcción que sí funciona, y por qué es ineficiente|más arriba]] como lectura nuestra, no de la cátedra.
- **La práctica no dice que `HMAC` sea infalsificable.** Teoría 33 sí lo afirma. Es lo único que teoría tiene sobre `HMAC` y la práctica no. → [[hmac#Por qué es infalsificable, con la hipótesis fina|HMAC § Por qué es infalsificable]]
- **No hay nada de `CCM` ni de `GCM` en toda la práctica**, ni de aplicaciones prácticas del cifrado autenticado. Eso está sólo en teoría 38-40 y en la transcripción del 03/09. → [[ccm-y-gcm|CCM y GCM]]
- **La discrepancia sobre la transformación final de Merkle-Damgård queda registrada, no resuelta.** El docente afirma que la construcción la tiene; las dos filminas de la cátedra no la dibujan y las primitivas reales de la familia tampoco. Ver [[#10. La transformación de Merkle-Damgård completa|§10]].
- **La discrepancia sobre SSH y la segunda forma** tiene dos lecturas y las dos dejan en pie el argumento del docente. Ver [[#13. Cifrado autenticado como conjunción formal|§13]] y la [[clase-03-macs-y-cifrado-autenticado|nota de clase]].
- **Los tres diagramas de ataque del `Anexo` no tienen equivalente en el vault.** [[cbc-mac|03.05]] tiene un solo diagrama, el de la construcción base. Los tres son portables a mermaid casi directamente; el del sufijo, con el rótulo $T_1 = t_4$ marcado adentro de la cadena, es el que más valor agrega.
- **No hay transcripción de esta práctica.** Todo lo que dice esta nota sale de los dos PDF y de la comparación contra el deck de teoría y su transcripción. Si en algún punto la lámina es ambigua, la ambigüedad queda declarada y no resuelta.
- **Que el `Anexo` se haya repartido como resolución de la tarea del 27/08 es lectura nuestra.** Ninguna fuente lo declara; lo que sí está establecido es que resuelve exactamente esa tarea y que está fechado un año antes.

---

## Ver también

- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — las dos sesiones de teoría (27/08 y 03/09) que esta práctica adelanta y complementa
- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] · [[practica-03-seudoaleatoriedad-y-modos|Práctica 03 — Seudoaleatoriedad y modos]] — los otros dos casos del patrón `Clase N.pdf` que no es la teórica N
- [[guia-03-mac-y-funciones-de-hash|Guía 3 — MAC y Funciones de Hash]] · [[guia-03-resolucion|Guía 3 — Resolución]] — la guía del mismo bloque, con sus seis ejercicios resueltos
- [[message-authentication-code|Message Authentication Code]] · [[seguridad-de-un-mac|Seguridad de un MAC]] · [[cbc-mac|CBC-MAC]] — la primitiva de integridad y su ataque de longitud variable
- [[construccion-de-macs-a-partir-de-una-prf|Construcción de MACs a partir de una PRF]] — el escalón de la filmina 3 y la construcción genérica de la 4
- [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]] — el replay de la filmina 2 y sus dos contramedidas
- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] · [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] · [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]] — las filminas 6 a 9
- [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] · [[primitivas-de-hash-estandar|Primitivas de hash estándar]] · [[hmac|HMAC]] — las filminas 10 a 13
- [[privacidad-e-integridad|Privacidad e integridad]] · [[cifrado-autenticado|Cifrado autenticado]] · [[ccm-y-gcm|CCM y GCM]] — las filminas 14 a 18
- [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]] · [[maleabilidad|Maleabilidad]] — la motivación de `CCA` que esta práctica no trae
- [[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]] · [[agilidad-criptografica|Agilidad criptográfica]] — los dos criterios de diseño que salen de la sesión del 03/09
- [[eleccion-de-primitivas|Elección de primitivas]] · [[estado-de-un-criptosistema|Estado de un criptosistema]] — qué usar y con qué criterio
- [[notacion-y-terminologia|Notación y terminología]] — el inventario de símbolos del vault
- [[bibliografia|Bibliografía]] · [[cronograma|Cronograma]] · [[indice|Índice del vault]]
