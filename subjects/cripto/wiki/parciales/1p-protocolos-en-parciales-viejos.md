---
title: Protocolos en los parciales viejos
resumen: 'Los cuatro Ej. 1 de los parciales viejos, todos protocolos: el intercambio con MAC del 2C-2025, Diffie-Hellman en el 1C-2025, el protocolo tipo TLS del 1C-2023 y Needham-Schroeder en el 1C-2018, cada uno con enunciado completo, respuesta modelo y tips.'
fuentes: ["[[parciales-viejos]]", "[[diffie-hellman]]", "[[needham-schroeder]]", "[[denning-sacco-y-frescura]]", "[[ataques-activos-y-man-in-the-middle]]", "[[ataques-de-repeticion-y-frescura]]", "[[certificados-digitales]]", "[[tls-handshake]]"]
aliases: [Protocolos en los parciales viejos, Ejercicio 1 de los parciales viejos, Protocolos ya tomados en el parcial, Los cuatro protocolos del parcial]
type: parcial
clase: 1p
orden: 11
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, protocolos, parciales-viejos, diffie-hellman, needham-schroeder, tls]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Protocolos en los parciales viejos

Hay cuatro ejercicios de este tipo, uno por parcial y siempre como Ej. 1: un intercambio de claves con MAC en el 2C-2025, Diffie-Hellman en el 1C-2025, un protocolo tipo TLS en el 1C-2023 y Needham-Schroeder en el 1C-2018. El análisis por parcial, con la resolución del apunte verificada, está en [[parciales-viejos|Parciales viejos]]: [[parciales-viejos#2C-2025|2C-2025]], [[parciales-viejos#1C-2025|1C-2025]], [[parciales-viejos#1C-2023|1C-2023]] y [[parciales-viejos#1C-2018|1C-2018]].

La receta y las trampas de este tipo están en [[1p-analizar-un-protocolo|Analizar un protocolo]]; la sección entera empieza en [[primer-parcial|Primer parcial]].

## 2C-2025 · Ej. 1 — Intercambio de claves con MAC

### Enunciado

Dado el siguiente protocolo

|  |  |  |  |
| --- | --- | --- | --- |
| (1.1) | $A \to B$ | $r_A$ | $r_A$ es un número al azar que elige A |
| (1.2) | $A \leftarrow B$ | $(B, A, r_A, r_B), h_K(B, A, r_A, r_B, K')$ | $r_B$ número al azar de B, $h_K(\cdot)$ MAC |
| (1.3) | $A \to B$ | $(A, r_B), h_K(A, r_B, K')$ |  |
| (1.4) | $A$ |  | $W = h'_{K'}(r_B)$ |
| (1.5) | $B$ |  | $W = h'_{K'}(r_B)$ |

donde A y B comparten dos claves simétricas $K$ y $K'$. $h'_{K'}(\cdot)$ es una función de MAC diferente de $h_K(\cdot)$ .

- a) ¿Qué tipo de protocolo sería? ¿Qué es lo que el protocolo intenta construir?
- b) ¿Qué le permiten hacer a A y B los mensajes cruzados 1.2 y 1.3?
- c) ¿Es este protocolo suceptible a un ataque MiTM? Justificar.

### Respuesta modelo

**a)** Es un protocolo de **intercambio de claves con autenticación mutua**, apoyado en dos claves simétricas $K$ y $K'$ que $A$ y $B$ comparten de antemano; no interviene ningún tercero ni certificado. Intenta construir una **clave de sesión** $W$ nueva en cada ejecución —depende del nonce $r_B$— que ninguno de los dos transmite: no es un transporte, cada parte la deriva localmente como $W = h'_{K'}(r_B)$ en los pasos 1.4 y 1.5. Al terminar, $A$ sabe que $B$ participó en esta ejecución y $B$ sabe lo mismo de $A$, y ambos tienen la misma $W$ para cifrar y autenticar el tráfico que sigue. Las claves de largo plazo se reparten por función: $K$ autentica los mensajes del intercambio y $K'$ deriva la clave de sesión; ninguna de las dos se usa para el tráfico.

**b)** El mensaje 1.2 le permite a $A$ dos cosas. Primero, comprobar **frescura**: la respuesta trae $r_A$, el número al azar que ella misma eligió y envió en 1.1, así que no puede ser un 1.2 grabado de una ejecución anterior. Segundo, **autenticar a $B$**: el MAC $h_K(B, A, r_A, r_B, K')$ solo puede calcularlo quien conoce $K$ (y $K'$), y $A$ lo recomputa sobre los campos que recibe en claro y lo compara; si coincide, quien respondió es $B$. Además recibe $r_B$, el material del que saldrá $W$.
El mensaje 1.3 le permite a $B$ lo simétrico: $r_B$ es el nonce que $B$ acaba de elegir, así que el mensaje es fresco, y el MAC $h_K(A, r_B, K')$ prueba que quien lo produjo tiene $K$ —es decir, que es $A$— y que recibió $r_B$ sin alteraciones. Con eso $B$ sabe que $A$ va a derivar la misma $W$ que él.
Los nombres $A$ y $B$ dentro de los MAC atan cada mensaje al par y al sentido en que viaja: un 1.2 no se puede reusar como 1.3 ni devolver a quien lo emitió. Los dos mensajes juntos dan autenticación mutua y confirman que ambos tienen el material de la clave.

**c)** **No.** Para interponerse, un atacante $M$ tendría que hacerse pasar por $B$ ante $A$ —producir un 1.2 válido para el $r_A$ fresco— o por $A$ ante $B$ —producir un 1.3 válido para el $r_B$ fresco—. Las dos cosas exigen calcular $h_K(\cdot)$, y $M$ no conoce $K$: un MAC seguro no se puede falsificar sin la clave. Reenviar mensajes grabados tampoco sirve: $r_A$ y $r_B$ son nuevos en cada ejecución y los MAC los incluyen, así que un mensaje viejo no verifica. Dejar pasar los mensajes sin tocarlos no le da nada: $W = h'_{K'}(r_B)$ exige $K'$, que $M$ tampoco tiene. Lo único que puede hacer es alterar $r_A$ en 1.1, el único mensaje sin autenticar, y con eso solo consigue que a $A$ le falle la verificación de 1.2: corta la sesión, no entra en ella. El protocolo resiste el MitM porque tiene exactamente lo que ese ataque necesita que falte: autenticación mutua sobre claves previamente compartidas, con nonces que atan cada MAC a esta ejecución.

### Tips

- Vale puntos separar los dos servicios y decir quién verifica cada uno: el nonce da **frescura** a quien lo eligió, el MAC da **autenticación de origen** a quien comparte $K$. Un MAC sin nonce sería repetible aunque fuera infalsificable; un nonce sin MAC lo podría fabricar cualquiera.
- No es ninguno de los protocolos con nombre de la Clase 05 —no hay KDC ni certificado—: clasifíquelo por estructura y no le fuerce un nombre.
- El enunciado aclara que $h'_{K'}$ es un MAC distinto de $h_K$: mencione la separación de funciones ($K$ autentica, $K'$ deriva) como parte de lo que construye.
- El argumento de (c) se recicla en cualquier protocolo con claves compartidas: «el atacante no tiene la clave, luego no puede producir el MAC que autentica cada mensaje». En Diffie-Hellman puro el mismo argumento se invierte: no hay clave previa, no hay MAC, hay MitM.

## 1C-2025 · Ej. 1 — Diffie-Hellman

### Enunciado

Dado el siguiente protocolo

|  |  |  |  |
| --- | --- | --- | --- |
| (1.1) | $A \to B$ | $G, q, g$ |  |
| (1.2) | $A$ |  | $x \leftarrow \mathbb{Z}_q$ |
| (1.3) | $A$ |  | $h_1 = g^x$ |
| (1.4) | $A \to B$ | $h_1$ |  |
| (1.5) | $B$ |  | $y \leftarrow \mathbb{Z}_q$ |
| (1.6) | $A \leftarrow B$ | $h_2$ | $h_2 = g^y$ |
| (1.7) | $A$ |  | $k_A = h_2^x$ |
| (1.8) | $B$ |  | $k_B = h_1^y$ |

donde $A(G, q, g)$ elige un Grupo $G$ $\mathbb{Z}_q$ con una raíz primitiva $g$.

- a) ¿Qué tipo de protocolo sería, qué es lo que el protocolo intenta construir?
- b) Mostrar un ejemplo numérico acotado cómo opera el protocolo. ¿Qué valores de $q$ son válidos y por qué?
- c) ¿En qué reside la seguridad computacional del algoritmo?
- d) Mencionar dos problemas que tiene este protocolo.

### Respuesta modelo

**a)** Es el protocolo de **Diffie-Hellman**: un intercambio de claves por **acuerdo**, sin tercero de confianza y sin autenticación de las partes. Intenta construir un **secreto compartido** $k = g^{xy}$ entre $A$ y $B$ hablando por un canal público: cada extremo lo calcula con su exponente secreto sobre el valor público del otro —$k_A = h_2^{\,x} = (g^y)^x = g^{xy}$ y $k_B = h_1^{\,y} = (g^x)^y = g^{xy}$, iguales porque la potencia conmuta en el exponente— y la clave nunca viaja. Ese $k$ se usa después como clave de sesión de un esquema simétrico. Lo que ve el atacante es $(G, q, g, h_1, h_2)$; $x$, $y$ y $g^{xy}$ no se transmiten nunca.

**b)** Ejemplo en $\mathbb{Z}_5$ con $g = 2$, que es raíz primitiva porque sus potencias $2, 4, 3, 1$ recorren todos los elementos no nulos. $A$ elige $x = 2$ y envía $h_1 = 2^2 = 4$; $B$ elige $y = 3$ y envía $h_2 = 2^3 = 8 \equiv 3$. Entonces $k_A = h_2^{\,x} = 3^2 = 9 \equiv 4$ y $k_B = h_1^{\,y} = 4^3 = 64 \equiv 4$: coinciden, $k = 4$.
Los valores válidos de $q$ son los **primos**: con $q$ primo existe una raíz primitiva $g$, un elemento cuyas potencias generan todos los elementos no nulos de $\mathbb{Z}_q$, que es lo que el enunciado exige. En la práctica $q$ debe ser además grande (cientos de bits), porque la seguridad depende de que el logaritmo discreto en ese grupo sea inabordable.

**c)** En que $x$ e $y$ **nunca se transmiten**, y recuperarlos a partir de lo que sí viaja —$g^x$ y $g^y$— es el **problema del logaritmo discreto** sobre un grupo finito, para el que no se conoce ningún algoritmo eficiente: es una suposición de dureza computacional, no un teorema. Esa condición es necesaria pero no suficiente; la hipótesis que hace falta es la **conjetura de decisión Diffie-Hellman (DDH)**: dados $g$, $g^x$ y $g^y$, un adversario no puede distinguir $g^{xy}$ de un elemento al azar del grupo. Con DDH la clave es indistinguible de aleatoria para quien solo escucha, que es lo que se le pide a un intercambio de claves.

**d)** Dos problemas:
1. **No resiste un atacante activo: es vulnerable a man in the middle.** El protocolo exige un canal autenticado y no lo construye. Un atacante $M$ intercepta $h_1$ en 1.4 y le envía a $B$ su propio $g^{x_M}$; intercepta $h_2$ en 1.6 y le envía a $A$ su propio $g^{y_M}$. $A$ calcula $g^{x y_M}$ y $B$ calcula $g^{x_M y}$; $M$ conoce las dos, descifra y vuelve a cifrar todo el tráfico entre ellos y ninguno lo nota, porque nada autentica quién envió $h_1$ y $h_2$. Se corrige autenticando esos valores: con un MAC bajo una clave previa, o con una firma digital respaldada por un certificado.
2. **Costo computacional.** Cada parte hace exponenciaciones modulares sobre números de cientos o miles de bits, y el costo crece con el tamaño de $q$; por eso se usa para acordar una clave de sesión y no para cifrar tráfico.

### Tips

- El ejemplo numérico se verifica antes de escribirlo: liste las potencias de $g$ para mostrar que es raíz primitiva y elija exponentes con $h_1, h_2 \neq 1$. Con $g = 2$, $x = 3$, $y = 4$ en $\mathbb{Z}_5$ las cuentas cierran pero $h_2 = 2^4 \equiv 1$ y la clave sale $k = 1$: un ejemplo degenerado no muestra nada.
- «$q$ primo» vale puntos solo con el porqué: existencia de la raíz primitiva. Agregue «y grande» en una línea.
- En (c) la frase que se espera es «$x$ e $y$ nunca se transmiten y obtenerlos de $g^x$, $g^y$ es el logaritmo discreto». Diga «sin algoritmo eficiente conocido», no «NP-hard»; nombrar DDH como la hipótesis fuerte suma.
- En (d) escriba el MitM como secuencia, no como adjetivo. «No autentica a las partes» y «es vulnerable a MitM» son el mismo problema: no los cuente como dos. El segundo es el costo de la exponenciación.
- La corrección —firmar $g^x$ y $g^y$ con un certificado— es exactamente lo que hace el `ServerKeyExchange` de TLS: se recicla si el parcial pregunta cómo se usa Diffie-Hellman en la práctica.

## 1C-2023 · Ej. 1 — Protocolo tipo TLS

### Enunciado

Dado el siguiente protocolo

|  |  |  |  |
| --- | --- | --- | --- |
| (1.1) | $C \to S$ | $C, C\#, N_C$ |  |
| (1.2) | $C \leftarrow S$ | $S, S\#, N_S, Cert(S, Sgn_{kS}(S))$ | Check Certificate |
| (1.3) | $C \to S$ | $E_{K_0}(kS), N$ | $k1 = H(K_0, N_C, N_S)$ |
| (1.4) | $C \to S$ | $E_{Kcs}(finished, MAC_k1(timestamp))$ | $Kcs = H(N, k1)$ |
| (1.5) | $C \leftarrow S$ | $E_{Kcs}(finished, MAC_k1(timestamp))$ |  |
| (1.6) | $C \to S$ | $E_{Kcs}(data)$ |  |
| (1.7) | $C \leftarrow S$ | $E_{Kcs}(data)$ |  |

donde $E(\cdot)$ es un esquema de cifrado simétrico, $Sgn(\cdot)$ es un esquema de firma digital.

- a) ¿Qué tipo de protocol sería, qué es lo que el protocolo intenta construir?
- b) ¿Cuál es el propósito de los mensajes (1.4) y (1.5)?
- c) ¿Por qué se deriva la clave $Kcs$ y no se usa en cambio la clave $K_0$?

### Respuesta modelo

**a)** Es un protocolo de **autenticación e intercambio de claves** del tipo **TLS**, con otra notación: un *handshake* que construye una **clave de sesión simétrica** $K_{cs}$ y, con ella, un **canal seguro** —confidencialidad e integridad para los datos de 1.6 y 1.7— en el que el cliente sabe que habla con $S$. La autenticación es **unilateral**: solo el servidor se identifica, con el certificado de 1.2 que el cliente verifica (*Check Certificate*); el cliente no presenta nada. La clave se establece por **transporte**: en 1.3 el cliente envía, cifrado bajo la clave que obtuvo del certificado, el material a partir del cual ambos derivan $k_1$ y $K_{cs}$. Mensaje por mensaje: 1.1 y 1.2 son los saludos, con identidades y con los nonces $N_C$ y $N_S$ que hacen única la sesión; 1.2 trae además el certificado del servidor; 1.3 es el intercambio de clave, con la derivación $k_1 = H(K_0, N_C, N_S)$; 1.4 y 1.5 son los *finished*, ya bajo $K_{cs} = H(N, k_1)$; 1.6 y 1.7 son los datos.

**b)** Los mensajes 1.4 y 1.5 son los *finished*, uno por sentido, y son los primeros que viajan cifrados con la clave nueva. Su propósito es **confirmar que las dos partes derivaron la misma $K_{cs}$** (y la misma $k_1$) antes de mandar datos: si un lado descifra el *finished* del otro y verifica el MAC, los dos calcularon lo mismo a partir del mismo material y de los mismos nonces, y el intercambio no fue alterado en el camino. El $\mathrm{MAC}_{k_1}$ da **integridad y autenticación de origen** —solo quien tiene $k_1$ pudo producirlo— y el *timestamp* da **frescura contra replay**: un *finished* grabado de otra conexión llega con una hora vieja y se rechaza. El de 1.4 le prueba al servidor que el cliente tiene las claves; el de 1.5, al cliente que el servidor descifró 1.3 y tiene las mismas. Recién después de los dos empieza el tráfico.

**c)** $K_0$ es la clave que llega por la parte asimétrica del protocolo: la clave del certificado del servidor. Es una clave **de largo plazo**, **la misma para todos los clientes** y parte de un esquema **asimétrico**, que sirve para autenticar al servidor y para transportar cifrado el secreto de 1.3, no para cifrar tráfico: el cifrado asimétrico es mucho más costoso que el simétrico, y una clave que no cambia entre conexiones no da frescura. Por eso se deriva $K_{cs}$: pasando por $H$ a $K_0$ junto con los nonces $N_C$, $N_S$ y $N$ se obtiene una clave **simétrica** (barata para 1.6 y 1.7), **nueva en cada conexión** (los nonces cambian) y **separada por función** ($k_1$ para el MAC, $K_{cs}$ para cifrar). La clave del certificado autentica y transporta; la clave de sesión se deriva.

### Tips

- Reconocerlo como TLS y mapear cada mensaje —saludos con nonces, certificado, intercambio de clave bajo la clave pública del servidor, *finished*, datos— vale puntos aunque el enunciado no lo nombre.
- La autenticación es **unilateral**: el cliente no presenta certificado. No escriba «mutua».
- En (b) hay tres cosas que nombrar: confirmación de que ambos tienen la misma clave, integridad y autenticación por el MAC, frescura por el *timestamp*; y que son los primeros mensajes bajo la clave nueva. En TLS real el *finished* autentica todos los mensajes del *handshake*; aquí, un *timestamp*.
- En (c) la respuesta tiene tres adjetivos —simétrica, nueva por conexión, separada por función— más el rol de la clave del certificado: autenticar y transportar, nunca cifrar tráfico.
- La notación del enunciado es inconsistente: $E_{K_0}(kS)$ en 1.3 usa a $K_0$ como clave de cifrado, pero $k_1 = H(K_0, N_C, N_S)$ la usa como material de derivación. Declare en una línea la lectura que adopta —$K_0$ es la clave del certificado y $kS$ el secreto que viaja cifrado— y responda con ella: los argumentos de (c) valen igual si $K_0$ fuera el secreto transportado.

## 1C-2018 · Ej. 1 — Needham-Schroeder

### Enunciado

Dado el siguiente protocolo

$$\begin{aligned} (1.1)\ &A \to T : A, B, N_A \\ (1.2)\ &A \leftarrow T : E_{kAT}(N_A, B, k, E_{kBT}(k, A)) \\ (1.3)\ &A \to B : E_{kBT}(k, A) \\ (1.4)\ &A \leftarrow B : E_k(N_B) \\ (1.5)\ &A \to B : E_k(N_B - 1) \end{aligned}$$

donde $E(\cdot)$ es un esquema de cifrado simétrico.

- a) ¿Para qué está el nombre del destinatario en los mensajes (1.1) y (1.2)?
- b) ¿Qué problema tiene este protocolo?
- c) El protocolo de Denning-Sacco agrega timestamps a los mensajes (1.2) y (1.3). ¿Con qué objetivo?

### Respuesta modelo

Es el protocolo de **Needham-Schroeder**: intercambio de claves simétrico por **transporte**, con un tercero de confianza $T$ (un KDC) que comparte de antemano una clave con cada parte —$k_{AT}$ con $A$, $k_{BT}$ con $B$— y genera la clave de sesión $k$ para el par. Construye una $k$ compartida solo entre $A$ y $B$, con autenticación mutua mediada por $T$: 1.1 es el pedido, 1.2 la respuesta con $k$ y el ticket para $B$, 1.3 la entrega del ticket, y 1.4 y 1.5 un desafío-respuesta con el que $B$ comprueba que quien le habla tiene $k$.

**a)** En 1.1 el nombre $B$ viaja en claro porque $T$ necesita saber **con quién** quiere hablar $A$: con eso elige $k_{BT}$ para cifrar el ticket $E_{kBT}(k, A)$ y le informa a $B$, dentro del ticket, con quién comparte $k$. En 1.2 el nombre $B$ va **dentro del cifrado** con $k_{AT}$, que solo $A$ y $T$ conocen, para que $A$ pueda comprobar que la clave que recibe es para hablar con $B$ y no con otro: como 1.1 viaja en claro, un atacante $E$ podría reemplazar $B$ por $E$ en el pedido y hacer que $T$ emita una clave para el par $A$ y $E$; al encontrar $E$ en lugar de $B$ dentro de 1.2, $A$ detecta la sustitución. Sin el nombre adentro del cifrado se podría suplantar la identidad del destinatario aunque el mensaje esté cifrado. El nonce $N_A$, que vuelve dentro de 1.2, cumple el papel complementario: le asegura a $A$ que la respuesta es a **este** pedido y no una grabada.

**b)** Es vulnerable a **replay**, porque el mensaje 1.3 no lleva **ningún elemento de frescura para $B$**: ni un nonce que $B$ haya elegido ni un timestamp. $B$ descifra $E_{kBT}(k, A)$ y obtiene una clave bien formada, pero no tiene ningún dato con el que distinguir si $T$ acaba de generar $k$ o si es de una sesión de hace meses. Ataque: un atacante $E$ que consiguió una clave de sesión **vieja** $k$ —filtrada después de que esa sesión terminó— y grabó el 1.3 correspondiente hace lo siguiente. (1) $E \to B$: $E_{kBT}(k, A)$, el ticket viejo, que sigue siendo un cifrado válido bajo $k_{BT}$. (2) $B$ lo acepta, cree que es $A$ y responde $E_k(N_B)$. (3) $E$ conoce $k$, descifra $N_B$ y responde $E_k(N_B - 1)$. $B$ queda convencido de hablar con $A$: $E$ **suplanta a $A$** sin haber roto ninguna primitiva y sin haber hablado nunca con $T$. El desafío de 1.4 no ayuda, porque solo prueba que el otro tiene $k$, no que $k$ sea nueva. Y como cualquier clave vieja filtrada sirve para siempre, el protocolo queda roto en cuanto se compromete una sola clave de sesión pasada. La frescura está para $A$, por $N_A$, y no para $B$.

**c)** Para darle a $B$ la frescura que le falta. Denning-Sacco agrega un timestamp $\mathrm{ts}$ dentro del ticket, que viaja adentro de 1.2 y es el mensaje 1.3: $E_{kBT}(k, A, \mathrm{ts})$. Al descifrar 1.3, $B$ compara $\mathrm{ts}$ con su reloj y **rechaza el ticket si no es reciente**, sin consultar a $T$ ni a $A$. El ataque de (b) se corta en el primer paso: el ticket viejo trae una hora vieja y $B$ ni siquiera emite el desafío. El timestamp **acota** la ventana del ataque —de «para siempre» a «mientras $\mathrm{ts}$ no haya expirado», una tolerancia $\Delta t$— pero no la elimina: un ticket reenviado dentro de la ventana sigue entrando, y el arreglo exige relojes sincronizados entre las partes.

### Tips

- Nómbrelo: es Needham-Schroeder con $T$ como KDC, literal al de la Clase 05. Diga en una línea qué comparte cada parte con $T$ y qué construye, aunque el enunciado no pregunte el tipo.
- En (a) hay dos respuestas distintas, una por mensaje: en 1.1 el nombre le dice a $T$ para quién emitir; en 1.2, adentro del cifrado, le permite a $A$ detectar que le cambiaron el interlocutor. La frase que vale es «dentro del cifrado, para que no se pueda suplantar la identidad del destinatario».
- En (b) el puntaje está en la secuencia: qué tiene el atacante (una $k$ vieja y el 1.3 grabado), qué no necesita (hablar con $T$, romper un cifrado), por qué $B$ no distingue y por qué el desafío $N_B$ no lo salva. Cierre con «frescura para $A$ y no para $B$».
- En (c) diga «acota, no elimina» y nombre los dos costos: la ventana $\Delta t$ y los relojes sincronizados. Es la misma comparación nonce contra timestamp que sirve para cualquier pregunta de frescura.

## Lo que se repite

- La consigna (a) es la misma en tres de los cuatro: tipo y qué construye. Se contesta con tres adjetivos —acuerdo, transporte o derivación; autenticación unilateral o mutua; claves compartidas, KDC o certificados— y una oración sobre la clave de sesión.
- Los cuatro protocolos son los de la Clase 05 o sus piezas: claves compartidas con MAC, Diffie-Hellman, TLS y Needham-Schroeder. Conviene llevar memorizados los tres con nombre, mensaje por mensaje, y sus correcciones.
- La pregunta del ataque se contesta desde lo que el atacante no tiene: sin las claves compartidas no hay MitM (2C-2025); sin autenticación de los valores públicos sí lo hay (1C-2025); sin frescura para el receptor hay replay (1C-2018).
- Frescura y autenticación son servicios distintos y se nombran por separado: nonce o timestamp para uno, MAC o firma para el otro. El nombre dentro del cifrado ata la clave a la identidad.
- Las correcciones son siempre las mismas tres: timestamp dentro del ticket, firma o certificado sobre los valores de Diffie-Hellman, clave de sesión derivada del secreto y de los nonces.
- Los ejemplos numéricos se verifican antes de escribirlos: raíz primitiva comprobada, exponentes que no den $1$.
- Ninguno de los ataques rompe una primitiva. Escribirlo así —«explota una identidad no verificada» o «un mensaje sin frescura»— es lo que distingue una respuesta completa.
