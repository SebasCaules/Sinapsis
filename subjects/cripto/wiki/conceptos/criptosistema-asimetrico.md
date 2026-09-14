---
title: Criptosistema asimétrico
resumen: 'Terna Gen, Enc, Dec con par de claves pública y privada, y experimento Eav en el que el adversario recibe pk. De ahí que ser indistinguible ante escucha ya implique CPA-Secure y que el cifrado deba ser probabilístico — y el aviso del docente: las dos claves no son intercambiables.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[pruebas-de-indistinguibilidad]]", "[[criptosistema]]", "[[cifrado-probabilistico-nonce-e-iv]]"]
aliases: [Criptosistema asimétrico, Cifrado de clave pública, Terna Gen Enc Dec asimétrica, Prueba Eav asimétrica, Cifrado no determinístico]
type: concepto
unidad: 1
clase: 4
orden: 5
created: 2026-09-04
updated: 2026-09-14
tags: [criptografia, criptosistema-asimetrico, clave-publica, indistinguibilidad, cpa-secure, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# Criptosistema asimétrico

**La terna de algoritmos y la prueba de indistinguibilidad que definen qué significa "cifrar con clave pública" — y por qué, en este mundo, ser seguro contra un adversario pasivo ya implica ser `CPA-Secure` sin necesidad de ningún oráculo.** Es la maquinaria formal que después instancian `RSA` y `El Gamal`.

> **Fuentes de esta nota.** Filminas **6 a 8 y 21 a 23** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT). La idea de 1976 está en los cues **115-172** —desarrollada en [[diffie-hellman#La cita que abre el bloque|Diffie-Hellman]]— y la terna con su prueba en los cues **702-745**. La nota se escribió el 04/09 sólo contra el PDF y se revisó contra la voz el 14/09.

## La idea: dos claves, y una se publica a propósito

El bloque abre (filmina 6) con la cita de Diffie y Hellman de 1976 —*"We stand today on the brink of a revolution in cryptography"*, desarrollada en [[diffie-hellman|Diffie-Hellman]]— y con la imagen que traduce la idea: **el candado**. Un candado es fácil de cerrar, pero hace falta una llave **distinta** para abrirlo. Trasladada a criptografía, la pregunta que abre el campo entero es si se puede construir un criptosistema con **dos contraseñas** —una para cifrar y otra para descifrar— de manera que conocer la de cifrar **no alcance** para recuperar el mensaje.

Si semejante cosa existe, la consecuencia es inmediata y es la que da nombre al área: la clave de cifrado se puede **publicar a propósito**, sin que eso comprometa nada. De ahí el otro nombre del campo, **criptografía de clave pública** — y de ahí también que la filmina 8 pueda anunciar tres construcciones nuevas de un solo golpe: [[intercambio-de-claves|intercambio de claves]] (dos partes acuerdan un secreto *en línea*, sin canal seguro previo), **cifrado asimétrico** (el mismo rol que el cifrado simétrico, con dos claves) y [[firma-digital|firma digital]] (el mismo rol que un MAC, verificable con una clave pública). En la voz, el orden histórico fue ése: primero el intercambio de claves, *"todavía de forma teórica en su primer paper"*, después *"implementaciones de criptosistemas que satisfacían las condiciones"*, y después *"el equivalente a MACs para el lado de integridad"* (cues 160-183).

**Y el docente marca por qué el campo es más que una construcción distinta**: por la división en claves, la criptografía asimétrica *"habilita otros usos prácticos que no se pueden resolver con lo que vimos hasta ahora"* (cues 184-187). Esos usos son los que la [[firma-digital|firma digital]] va a nombrar —verificación pública, transferibilidad, no repudio— y los que la [[clase-05-protocolos-criptograficos|Clase 05]] va a explotar con certificados.

## La terna

Igual que un criptosistema simétrico ($\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec}$, [[criptosistema#Vista informal|Criptosistema]]), un criptosistema asimétrico es una terna de algoritmos — la diferencia decisiva está en qué toma cada uno como clave:

$$\begin{aligned}
\mathsf{Gen}&:\ () \to (pk, sk) &&\text{(public key, secret key)}\\
\mathsf{Enc}&:\ \mathsf{Enc}_{pk}(m)\\
\mathsf{Dec}&:\ \mathsf{Dec}_{sk}(c)\\[4pt]
&\text{Propiedad: para todo } m,\ \mathsf{Dec}_{sk}(\mathsf{Enc}_{pk}(m)) = m
\end{aligned}$$

$\mathsf{Gen}$ ya no produce una única clave sino un **par**: una clave pública $pk$, que se puede distribuir sin restricción, y una clave privada $sk$, que se mantiene en secreto. $\mathsf{Enc}$ **siempre** toma la clave pública, nunca la privada; $\mathsf{Dec}$ **siempre** toma la privada. Es la traducción directa de la idea del candado de la sección anterior: cualquiera puede cerrar (cifrar, con $pk$), sólo el dueño de la llave puede abrir (descifrar, con $sk$).

**La voz presenta la terna como el criptosistema de siempre "revisitado desde la asimetría"**: sigue siendo una terna que sirve para lo mismo —transformar un mensaje, darle confidencialidad y poder recuperarlo—, *"salvo que ahora la función de generación generaría 2 claves en vez de una, y utilizaríamos una clave para cifrar y otra clave distinta para descifrar"*. Y fija el modelo de adversario del mundo asimétrico en una frase: **el atacante conoce la clave pública y no conoce la privada** (cues 702-712).

### Las dos claves no son intercambiables

Es la única advertencia de toda la clase que el docente rotula como **error conceptual frecuente**, y conviene saberla tal cual la dijo. Si lo que se quiere es confidencialidad, la clave de descifrar tiene que ser la que está **fuera del alcance** del atacante; por lo tanto **se cifra con la pública y se descifra con la secreta**, y no al revés. Si un esquema permitiera usarlas al revés y alguien lo hiciera, *"no tenemos confidencialidad: si se descifrase con la clave pública, cualquiera puede agarrar el texto cifrado y recuperar el mensaje original"*.

> [!quote]- De la transcripción — se cifra con la pública, y el error que pasa "más de lo que me gustaría" (cues 713-724)
> *"Estas claves no se pueden usar en cualquier lado. Si yo quiero dar confidencialidad con un criptosistema, necesito que una vez cifrada la información no cualquiera pueda descifrarla. Entonces yo necesito que **la clave para descifrar sea la clave que está afuera del escenario de un atacante**. Entonces, en un criptosistema asimétrico, y esto es súper súper importante: **se cifra con la clave pública. Cualquiera puede encriptar, pero se descifra sólo con la clave secreta.** Si por alguna razón tuviésemos la desdicha de estar usando algún algoritmo donde estas claves podrían ser intercambiables, si las usamos al revés, no tenemos confidencialidad: porque si se descifrase con la clave pública, cualquiera puede descifrar el mensaje. Súper importante. **Error conceptual que pasa más de lo que me gustaría, no sólo en la materia sino en general: las 2 claves no son intercambiables.** La que designamos pública se puede usar sólo para cifrar; la secreta, sólo para descifrar."*

> **Por qué la advertencia tiene sentido justo en `RSA`** *(precisión nuestra)*. En `RSA` las dos operaciones son la misma exponenciación modular, y **algebraicamente** sí se pueden intercambiar los exponentes: es lo que hace [[rsa-signature-y-hashed-rsa|RSA-Signature]], que "cifra" con $d$ y "descifra" con $e$. Lo que no se puede intercambiar es el **rol**: usar la privada para dar confidencialidad no da confidencialidad, y usar la pública para firmar no da no repudio. Que la fórmula lo permita es precisamente lo que hace frecuente el error.

## La prueba Eav: indistinguibilidad ante escucha

$$\begin{aligned}
\textbf{Experimento } \mathsf{Eav}_{A,\Pi}:\\
&\text{Se genera } (pk, sk) \leftarrow \mathcal{K}\\
&\text{1. } A \text{ recibe } pk \text{ y emite } m_0, m_1\\
&\text{2. Se genera } b \leftarrow \{0,1\}\\
&\text{3. Se calcula } c \leftarrow \mathsf{Enc}_{pk}(m_b) \text{ y se le envía a } A\\
&\text{4. } A \text{ emite } b' \in \{0,1\}\\
&\mathsf{Eav}_{A,\Pi} = 1 \iff b = b'
\end{aligned}$$

$$\Pr[\mathsf{Eav}_{A,\Pi}=1] < 0{,}5 + \varepsilon(n) \;\Longrightarrow\; \Pi \text{ es indistinguible}$$

Es literalmente el mismo experimento `Eav` simétrico de la [[pruebas-de-indistinguibilidad|Clase 02]] —el adversario elige dos mensajes, recibe el cifrado de uno de los dos elegido al azar, y tiene que adivinar cuál fue— salvo por un cambio de un solo símbolo que decide todo: **acá el adversario recibe $pk$** antes de elegir $m_0$ y $m_1$. El docente lo lee así, señalando la línea resaltada de la filmina: *"esta es la misma prueba de indistinguibilidad (…) salvo que lo que está resaltado ahí, en el paso 2, que le damos al atacante lo que llamamos clave pública; después es exactamente igual"* (cues 725-731).

> **Errata de la filmina (22).** El paso 3 de la filmina dice *"$c \leftarrow \mathsf{Enc}_{sk}(m_b)$"* — con la clave **privada**. Es incoherente con la propia terna de la filmina anterior, donde $\mathsf{Enc}$ toma siempre $pk$, y el adversario de este experimento sólo conoce $pk$: no podría ni evaluar esa línea. Arriba va corregido a $\mathsf{Enc}_{pk}(m_b)$. En el aula la línea no se leyó; lo que la voz dice sobre con qué clave se cifra es lo correcto, y es la sección anterior.

## Por qué el pk público lo cambia todo

En el mundo simétrico, la prueba `Eav` es estrictamente más débil que `CPA`: en `Eav` el adversario no tiene acceso a un oráculo de cifrado, así que sólo puede observar **un** cifrado elegido por el desafiante. Ganar acceso a un oráculo —poder pedir el cifrado de mensajes propios— es lo que separa `Eav` de `CPA` en la [[pruebas-de-indistinguibilidad|Clase 02]].

**En el mundo asimétrico esa distinción se borra.** Cualquiera que conozca $pk$ —y en este experimento el adversario la conoce desde el paso 1— **ya tiene acceso de fábrica a la función de cifrado**: puede calcular $\mathsf{Enc}_{pk}(m)$ para cualquier $m$ que elija, sin necesitar preguntarle nada a nadie. Es exactamente lo que en simétrico había que ganar con un oráculo de consultas.

$$\text{Indistinguible ante un adversario pasivo (`Eav`)} \;\Longrightarrow\; \text{`CPA-Secure`}$$

en un criptosistema asimétrico, sin que haga falta un experimento `CPA` separado con oráculo explícito — el oráculo está siempre disponible con solo conocer $pk$. Y la consecuencia sobre el recorrido del curso la saca el propio docente: en este mundo **no hay escalera** `Eav` → `Mul` → `CPA` que subir, *"directamente la primera prueba ya es equivalente a chosen plaintext indistinguishability"*, y por eso el bloque de criptografía *"se achica"*.

> [!quote]- De la transcripción — dar la clave pública es dar la función de cifrado (cues 732-745)
> *"Esta sutileza de la clave pública tiene un impacto muy importante: si el atacante conoce la clave pública, y la clave pública permite cifrar cualquier mensaje, **lo que le estamos dando en el fondo es acceso a la función de cifrado**. Y darle acceso a la función de cifrado, para nosotros, antes no era esta prueba: era una prueba mucho más avanzada, la prueba de chosen plaintext attack indistinguishability. ¿Qué quiere decir esto? Que nuestra prueba básica de seguridad en el mundo asimétrico ya tiene el mismo nivel de seguridad que la prueba CPA de antes. Entonces todo criptosistema asimétrico básico que pase la prueba básica va a ser CPA-secure. Y una consecuencia interesante de eso para recordar: cuando vimos que ser CPA-secure requería que el sistema sea no determinístico, con lo cual **todo criptosistema asimétrico, desde el vamos, tiene que ser no determinístico** para funcionar. Entonces acá no vamos a pasar por single eavesdropping, multiple eavesdropping, CPA: directamente la primera prueba ya es equivalente a chosen plaintext indistinguishability. Así que achicamos un poco todo lo que hay que hacer para recorrer la parte de criptografía, y ya llegamos casi al final."*

## El corolario que se sigue directo: cifrado no determinístico obligatorio

$$\text{`CPA-Secure`} \;\Longrightarrow\; \mathsf{Enc}_{pk} \text{ no puede ser determinística}$$

**Por qué.** Si $\mathsf{Enc}_{pk}$ fuera determinística —el mismo mensaje siempre produce el mismo criptograma bajo la misma clave—, el propio adversario del experimento `Eav` podría, tras recibir $c$ en el paso 3, calcular por su cuenta $\mathsf{Enc}_{pk}(m_0)$ y $\mathsf{Enc}_{pk}(m_1)$ —tiene $pk$, así que puede hacerlo sin ningún oráculo— y comparar cuál de los dos coincide bit a bit con $c$. Esa comparación identifica $b$ con probabilidad $1$, así que $\Pr[\mathsf{Eav}=1]=1 \gg 0{,}5+\varepsilon(n)$: el esquema queda roto trivialmente.

Esta es la razón formal, no una preferencia de diseño, de por qué **todo** criptosistema asimétrico seguro tiene que ser probabilístico: necesita algún tipo de aleatoriedad interna —un valor $r$ o $y$ elegido al azar en cada ejecución de $\mathsf{Enc}$— para que cifrar el mismo mensaje dos veces dé resultados distintos. Es la misma exigencia que [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] desarrolla para el mundo simétrico, llevada acá a una consecuencia todavía más dura: en simétrico un esquema determinístico puede seguir siendo `Eav`-seguro (porque el adversario no tiene acceso de fábrica al cifrado); en asimétrico, no. La voz lo dice como "desde el vamos": el no determinismo no es una propiedad deseable sino una condición de existencia.

**Consecuencia inmediata sobre los esquemas concretos que siguen.** `Textbook RSA` ([[rsa|RSA]]) es determinístico y por lo tanto **no puede ser `CPA-Secure`** — es exactamente el primer problema que la [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]] señala de textbook RSA, y esta nota es la que explica **por qué** ese problema es fatal y no cosmético. `El Gamal`, en cambio, sortea un exponente $y$ nuevo en cada cifrado —es probabilístico por construcción— y por eso puede alcanzar `CPA-Secure` bajo `DDH`. El docente cierra `RSA` exactamente con esta cuenta: *"si yo cifro 2 veces el mismo $p$ con la misma clave, me va a dar exactamente lo mismo; y ya sabemos, producto de esta prueba y los aprendizajes de antes en la materia, que si es determinístico no puede ser seguro"* (cues 858-862).
