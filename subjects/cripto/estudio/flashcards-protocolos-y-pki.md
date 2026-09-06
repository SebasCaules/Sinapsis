---
tipo: flashcards
titulo: Protocolos, PKI y TLS
id: protocolos-y-pki
division: "5"
descripcion: Certificados, cadenas de confianza, revocación, Needham-Schroeder y el handshake de TLS.
---

## ¿Qué cuatro cosas puede hacer un atacante activo que un espía puramente pasivo no puede? {#protocolos-y-pki:mitm-poderes-del-atacante-activo}
> pagina: ataques-activos-y-man-in-the-middle

**Omitir** mensajes, **reescribir** su contenido, **reordenar** la secuencia y **repetir** mensajes ya enviados.

Frente a este adversario, **ninguno de los esquemas de intercambio de claves vistos hasta la Clase 04 funciona**. La familia de ataques que lo explota es la que da nombre al tema: `Man in the Middle` (`MITM`).

## En la sustitución de clave pública contra el repositorio, ¿dónde está exactamente el ataque y qué conclusión saca la cátedra? {#protocolos-y-pki:mitm-sustitucion-de-clave-publica}
> pagina: ataques-activos-y-man-in-the-middle

$E$ **no bloquea** la consulta de $A$: la reenvía y obtiene la $pk_b$ genuina del repositorio. El ataque está enteramente en la **respuesta** — $E$ le entrega a $A$ su propia $pk_e$ en lugar de $pk_b$. Después:

$$
A \xrightarrow{\;\mathrm{Enc}_{pk_e}(M)\;} E \xrightarrow{\;\mathrm{Enc}_{pk_b}(M)\;} B
$$

$E$ descifra con su clave privada, lee o modifica $M$, y vuelve a cifrarlo bajo la clave real de $B$. La conclusión de la filmina: **el problema no está en la función de cifrado — entra en la esfera de administración de claves.**

## ¿Cuál es el objetivo de una PKI, y por qué no es aplicable a criptosistemas simétricos? {#protocolos-y-pki:pki-objetivo-y-alcance}
> pagina: infraestructura-de-clave-publica

`PKI` (*Public Key Infrastructure*) es el conjunto de mecanismos —organizativos y criptográficos— cuyo objetivo es **asociar una identidad a una clave pública**, para evitar los problemas de suplantación de identidad.

La filmina es explícita en que **no es aplicable a los criptosistemas simétricos**, aunque no desarrolla el motivo: se sigue de la definición de clave pública — en un esquema simétrico no hay una clave *pública* circulando que necesite una garantía externa de a quién identifica. El análogo simétrico es un `KDC`. Lo que la filmina sí da como motivo de la PKI son dos líneas: **la selección de la clave depende de con quién se está hablando**, y **usar la clave equivocada significa que no hay ninguna garantía de confidencialidad ni de integridad**.

## ¿Qué contiene, como mínimo, un certificado digital? {#protocolos-y-pki:certificado-contenido-minimo}
> pagina: certificados-digitales

- **Información de identidad** — por ejemplo, un nombre.
- **La clave pública** asociada a esa identidad.
- **Fecha de emisión** e **intervalo de validez**.
- **Tipo de uso** autorizado: firma de mensajes, cifrado de emails, firma de certificados, cifrado de sitios web.

Y la propiedad que lo separa de una declaración autoproclamada: **está firmado digitalmente por una autoridad competente**.

## ¿Qué cuatro verificaciones permite hacer un certificado, y qué convención sigue el CN según el tipo de entidad? {#protocolos-y-pki:certificado-cuatro-operaciones}
> pagina: certificados-digitales

1. **Verificar la identidad**, comparando el campo `CN` (*Common Name*).
2. **Obtener la clave pública** de $B$, junto con su tipo (`RSA-2048`, `DSA-EC 320`).
3. **Verificar la validez**: que el tipo de uso permitido coincida con lo que se necesita, y que la fecha de vigencia no haya expirado.
4. **Verificar la integridad**, validando la firma digital de la autoridad certificante.

Convenciones de `CN`: dirección de email → la dirección; servidor → `IP` u *hostname*; empresa → razón social.

## ¿Qué es una AC raíz y cómo corta la recursión de "quién certifica al certificador"? {#protocolos-y-pki:ac-raiz-punto-de-corte}
> pagina: cadenas-de-firmas-y-autoridades-raiz

Las autoridades certificantes tienen a su vez un certificado, emitido por otra AC — y ahí hace falta un punto de corte. Las **AC raíces** son ese punto: **firman su propio certificado** (están autofirmadas) y son, por definición, el **punto de confianza del sistema**.

El concepto en una frase: *confiar en una única autoridad, que delega en otras la capacidad de firmar certificados.* No hay una raíz universal: lo que existe en la práctica es una **lista de AC reconocidas**, preinstalada en el sistema operativo, los navegadores y runtimes como la `JVM`.

## ¿Cómo se escribe la cadena de certificados de $A$ (emitido por $CA_3$, bajo la raíz $CA_1$) y la de $B$ (emitido directamente por la raíz)? {#protocolos-y-pki:cadena-de-certificados-notacion}
> pagina: cadenas-de-firmas-y-autoridades-raiz

$$
C_a = C'_a \,\Vert\, C_{CA_3} \,\Vert\, C_{CA_2} \,\Vert\, C_{CA_1}, \qquad\qquad C_b = C'_b \,\Vert\, C_{CA_1}
$$

$C'_x$ es el propio certificado firmado de $x$; el resto son los certificados de cada eslabón hasta la raíz. La idea: **un certificado no viaja solo** — viaja con la cadena completa que hace falta para subir hasta una raíz ya confiable. $C_b$ es más corta porque $B$ obtuvo su certificado directamente de $CA_1$; la profundidad depende de cuántos niveles de delegación haya, sin límite fijo.

## ¿Cuáles son los cinco pasos de verificación de un certificado X.509? {#protocolos-y-pki:x509-verificacion-cinco-pasos}
> pagina: x509

1. **Obtener la clave pública del emisor** — de la cadena adjunta, o del sistema operativo si el certificado es raíz; si hace falta, se aplica recursivamente.
2. **Verificar la integridad**, con el algoritmo de firma especificado en el propio certificado y la clave del paso 1.
3. **Verificar el intervalo de validez**: el certificado vigente **hoy**, y además la AC vigente **al comienzo** del período del certificado que emitió.
4. **Verificar la identidad**, comparando el `CN` con el que espera la aplicación.
5. **Verificar el uso**, comprobando que el certificado esté autorizado para el propósito concreto.

## ¿Por qué hace falta revocar antes de la expiración, quién puede hacerlo y cómo se consulta una CRL? {#protocolos-y-pki:crl-revocacion-y-consulta}
> pagina: revocacion-y-listas-crl

Dos eventos rompen la hipótesis del intervalo de validez antes de tiempo: **la clave fue averiguada por un atacante**, o hubo un **cambio anticipado** (por ejemplo, de dueño de la clave).

Bajo `X.509`, **solo el emisor de un certificado puede revocarlo** — así se evita que revocar sin autorización sea una denegación de servicio trivial. La revocación se agrega a la **CRL global de esa AC**, que se consulta de dos formas: **descargándola de antemano** para validar offline, o **consultando online** el estado de un certificado puntual contra el servicio de la AC.

## ¿Qué hipótesis previa exige Needham-Schroeder y cuál es la función del KDC? {#protocolos-y-pki:needham-schroeder-hipotesis-y-kdc}
> pagina: needham-schroeder

Es un protocolo de intercambio de claves **simétrico**, en el que se basan `Kerberos` y `Active Directory`. Requiere un servicio centralizado, el `KDC` (*Key Distribution Center*), cuya función es **generar claves de sesión entre pares**.

La hipótesis sin la cual el protocolo no arranca: **cada entidad ya comparte una clave con el KDC**.

## ¿Cuáles son los cinco mensajes de la segunda aproximación de Needham-Schroeder? {#protocolos-y-pki:needham-schroeder-segunda-aproximacion}
> pagina: needham-schroeder

$$
1)\ A \to \mathrm{KDC}:\ A \,\Vert\, B \,\Vert\, r_1
$$
$$
2)\ A \leftarrow \mathrm{KDC}:\ \{A \,\Vert\, B \,\Vert\, r_1 \,\Vert\, k_s \,\Vert\, \{A \,\Vert\, k_s\}_{k_b}\}_{k_a}
$$
$$
3)\ A \to B:\ \{A \,\Vert\, k_s\}_{k_b}
$$
$$
4)\ A \leftarrow B:\ \{r_2\}_{k_s}
$$
$$
5)\ A \to B:\ \{r_2 - 1\}_{k_s}
$$

El mensaje 2 va bajo $k_a$, así que $A$ sabe que viene del KDC, y el nonce $r_1$ lo ata a esta ejecución. Los mensajes 4 y 5 son un *challenge-response*: $B$ desafía con $r_2$ bajo $k_s$ y $A$ demuestra conocer $k_s$ devolviendo $r_2-1$.

## ¿Cómo rompe un atacante la segunda aproximación de Needham-Schroeder con una clave de sesión vieja? {#protocolos-y-pki:needham-schroeder-ataque-clave-vieja}
> pagina: needham-schroeder

$E$, que ya obtuvo una $k_s$ **antigua**, arranca directamente desde el tercer mensaje, sin tocar al KDC:

$$
E \to B:\ \{A \,\Vert\, k_s\}_{k_b}, \qquad E \leftarrow B:\ \{r_2\}_{k_s}, \qquad E \to B:\ \{r_2 - 1\}_{k_s}
$$

$B$ no tiene **ningún** dato con el que distinguir una $k_s$ recién generada de una vieja: $r_1$ protege a $A$ contra la repetición del mensaje 2, pero $B$ nunca eligió un valor propio antes de recibir el mensaje 3. Consecuencia: comprometida **cualquier** clave de sesión pasada, el protocolo queda roto para siempre.

## ¿Qué cambia exactamente la modificación Denning-Sacco, y por qué alcanza? {#protocolos-y-pki:denning-sacco-timestamp-en-el-ticket}
> pagina: denning-sacco-y-frescura

El mensaje 3 pasa de $\{A \Vert k_s\}_{k_b}$ a $\{A \Vert T \Vert k_s\}_{k_b}$, con $T$ un **timestamp adentro del ticket**; todos los demás mensajes quedan idénticos.

Al recibirlo, $B$ lo descifra con $k_b$ y —sin volver a consultar a $C$ ni a $A$— compara $T$ contra su reloj local, rechazando el ticket si $T$ no cae dentro de la ventana de aceptación $\Delta t$. Así nunca llega a emitir el desafío $\{r_2\}_{k_s}$, y $E$ ni siquiera tiene la oportunidad de demostrar que conoce $k_s$.

## ¿Qué compra el timestamp de Denning-Sacco, y qué supuestos nuevos cuesta? {#protocolos-y-pki:denning-sacco-ventana-y-supuestos}
> pagina: denning-sacco-y-frescura

No elimina la ventana de vulnerabilidad: la **acota**.

$$
\text{Needham-Schroeder: ventana de ataque} = (\text{fin de la sesión},\ \infty)
$$
$$
\text{Denning-Sacco: ventana de ataque} = (\text{emisión de } T,\ \text{emisión de } T + \Delta t\,]
$$

A cambio exige dos supuestos que la versión con nonces no necesitaba: **relojes sincronizados** entre las partes, y una **ventana $\Delta t$ explícita** ($\Delta t$ chico es intolerante a la latencia; $\Delta t$ grande reabre una versión acotada del ataque). Si $E$ reinyecta el mensaje 3 **dentro** de $\Delta t$, $B$ acepta igual.

## ¿Qué hace el TLS Record con un mensaje de aplicación, y dónde se intercala TLS en la pila? {#protocolos-y-pki:tls-record-procesamiento}
> pagina: tls-arquitectura-y-record

Cuatro pasos: recibe el mensaje; lo divide en **bloques de no más de $2^{16}$ bytes**; **comprime** cada bloque y calcula su **hash**; **encripta** cada bloque junto con su hash y lo entrega al servicio inferior (por ejemplo `TCP`). El orden es comprimir, después hashear, después cifrar.

TLS se intercala **entre la capa de Aplicación y la de Transporte**, y ofrece confidencialidad, integridad y autenticación de origen y destino sobre un transporte confiable. La filmina da la equivalencia informal `TLS 1.2` = `SSL 3.3`.

## En las suites de TLS, ¿por qué el intercambio de clave con RSA y con Diffie-Hellman efímero no dan las mismas garantías? {#protocolos-y-pki:tls-intercambio-de-clave-y-forward-secrecy}
> pagina: suites-criptograficas-de-tls

Con `RSA`, el cliente cifra el *pre-master secret* directamente con la clave pública del servidor: **no hay forward secrecy**. Con Diffie-Hellman **efímero** (`DHE`/`ECDHE`), la clave de largo plazo solo **firma** los parámetros de esa sesión.

$$
\text{RSA: comprometer } K_{\text{priv, servidor}} \;\Longrightarrow\; \text{descifrar todo el tráfico pasado grabado}
$$
$$
\text{DHE/ECDHE: comprometer } K_{\text{priv, servidor}} \;\Longrightarrow\; \text{solo suplantar al servidor a futuro}
$$

El Diffie-Hellman **anónimo** no lleva certificado, así que no autentica a ninguna parte y queda expuesto a man in the middle.

## Diferencia entre sesión y conexión en TLS: ¿qué guarda cada una? {#protocolos-y-pki:tls-sesion-contra-conexion}
> pagina: sesion-y-conexion-tls

La **sesión** es una asociación entre dos pares que puede soportar **múltiples conexiones**: identificador $S_{id}$, certificado `X.509v3` del otro extremo (opcional), método de compresión, método de encriptación y `MAC`, y el **Master Secret de 48 bytes**.

La **conexión** describe *cómo* intercambiar datos dentro de esa sesión: una secuencia aleatoria de calidad criptográfica, **claves de escritura y claves de `MAC` distintas para cada dirección**, `IV`s si el modo los necesita, y un **número de secuencia independiente** para cliente y para servidor.

La filmina advierte en mayúsculas que **no es un protocolo de sesión**: reusar una sesión es solo una optimización de rendimiento.

## ¿Cuáles son las cuatro partes del handshake de TLS, y qué llevan el ClientHello y el ServerHello? {#protocolos-y-pki:tls-handshake-cuatro-partes}
> pagina: tls-handshake

Parte 1: **acordar** qué se va a usar. Parte 2: **autenticar al servidor** y darle al cliente los parámetros que le faltan. Parte 3: **darle al servidor lo que le falta a él**, y opcionalmente autenticar al cliente. Parte 4: **confirmar, ya bajo las claves nuevas**, que ambos calcularon lo mismo.

$$
\mathrm{ClientHello}: \quad C \to S:\ \{V_c \,\Vert\, r_1 \,\Vert\, S_{id} \,\Vert\, \mathrm{Ciphers} \,\Vert\, \mathrm{Comps}\}
$$
$$
\mathrm{ServerHello}: \quad C \leftarrow S:\ \{V \,\Vert\, r_2 \,\Vert\, S_{id} \,\Vert\, \mathrm{Cipher} \,\Vert\, \mathrm{Comp}\}
$$

con $V = \min(\text{versión cliente}, \text{versión servidor})$, $S_{id} = 0$ para iniciar una sesión nueva, y $r_1, r_2$ los nonces de cada lado. **Ningún mensaje de esta parte está cifrado ni autenticado todavía.**

## ¿Por qué la versión $V$ vuelve a viajar adentro del ClientKeyExchange? {#protocolos-y-pki:tls-downgrade-y-version-repetida}
> pagina: tls-handshake

Para **prevenir ataques de downgrade**. El `ClientHello` y el `ServerHello` viajan en claro, así que un atacante activo puede reescribirlos para que ambas partes negocien de buena fe una versión más vieja y con algoritmos más débiles.

El $V$ del `ClientKeyExchange` es el que el cliente informó **originalmente**, y este mensaje sí viaja cifrado con la clave pública del servidor. Al descifrarlo, el servidor compara

$$
V_{\text{negociado en ServerHello}} \overset{?}{=} V_{\text{informado, cifrado, en ClientKeyExchange}}
$$

Si el atacante bajó la versión, las dos no coinciden y el servidor puede abortar.

## ¿Cuáles son los dos tipos de mensaje TLS que no llevan datos de aplicación, y qué hace cada uno? {#protocolos-y-pki:tls-change-cipher-spec-y-alert}
> pagina: change-cipher-spec-y-alert

**`ChangeCipherSpec`**: no tiene contenido propio y puede aparecer **en cualquier momento** de una conexión ya establecida, no solo en el handshake. Implica una **renegociación** de las claves de sesión, y la puede pedir tanto el cliente como el servidor.

**`Alert`**: envía eventos **fuera de banda**, en dos niveles — **advertencia**, informativa y que no corta la conexión por sí sola, y **fatal**, que **invalida la conexión** y obliga a ambas partes a terminarla (mensaje no esperado, `MAC` incorrecto, error al descomprimir, error en el handshake, parámetro ilegal). El **`CloseNotify`** indica el fin de una sesión: anuncia que no se envían mensajes nuevos, y todo mensaje posterior se ignora.
