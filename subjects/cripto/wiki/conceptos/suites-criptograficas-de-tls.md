---
title: Suites criptográficas de TLS
resumen: 'Catálogo de piezas que TLS combina para armar una conexión: intercambio de clave, cifrado simétrico, hash o AEAD y firma; la primera categoría decide si hay forward secrecy y ninguna de las otras lo compensa.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[tls-arquitectura-y-record]]", "[[cifrado-autenticado]]", "[[ccm-y-gcm]]"]
aliases: [Suites de TLS, Cipher suites TLS, Criptografía de TLS, TLS - Criptografía, Menú criptográfico de TLS]
type: concepto
unidad: 1
clase: 5
orden: 10
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, tls, cipher-suite, forward-secrecy, aead, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Suites criptográficas de TLS

**El catálogo completo de piezas que TLS puede combinar para armar una conexión — qué usar para intercambiar la clave, para cifrar los datos, para autenticar la integridad y para firmar la identidad — y por qué elegir mal en la primera categoría deja a toda la conexión sin una propiedad que el resto del menú no puede compensar.** Es la nota que explica qué es, en concreto, lo que el `ClientHello` y el `ServerHello` del [[tls-handshake|handshake]] negocian bajo el nombre `Ciphers`/`Cipher`.

Sale de las **filminas 32 a 35** del PDF de teoría de la Clase 05. La clase todavía no se dictó — hoy es 04/09/2026, la Clase 05 es el 17/09 según el [[cronograma]] — así que esta nota está escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas. No hay transcripción ni callouts *De la transcripción*.

## Los cuatro tipos de mensaje TLS

*Filmina 32.* Antes de entrar al menú criptográfico, la filmina fija los cuatro tipos de contenido que puede llevar un [[tls-arquitectura-y-record|TLS Record]]:

- **TLS handshake** — configuración inicial, autenticación de las partes, negociación del material criptográfico. Desarrollado en [[tls-handshake|TLS handshake]].
- **TLS application data** — el contenido del protocolo que TLS encapsula (HTTP, por ejemplo).
- **TLS alert** — informa eventos y problemas. Desarrollado en [[change-cipher-spec-y-alert|Change Cipher Spec y Alert]].
- **TLS Change Cipher Spec** — concluye una renegociación de claves. Desarrollado en [[change-cipher-spec-y-alert|Change Cipher Spec y Alert]].

## El menú criptográfico

*Filminas 33-35.* Una *cipher suite* de TLS es una combinación de una opción de cada una de estas cuatro categorías. La filmina lista, categoría por categoría:

| Categoría | Opciones que lista la filmina |
|---|---|
| Intercambio de clave | **`RSA`** · **Diffie-Hellman con certificado `RSA` o `DSS`** · Diffie-Hellman anónimo · `ECDH` (Diffie-Hellman sobre curvas elípticas) · Kerberos |
| Cifrado simétrico | ~~`RC4`~~ · `ChaCha20` (`TLS 1.2`) · ~~`DES-CBC`~~ · Triple DES (`3DES-EDE-CBC`) · **`AES`** (**`AES-CBC`**, **`AES-CCM`**, **`AES-GCM`**) · `IDEA CBC` · `ARIA` (`ARIA-CBC`, `ARIA-CCM`, `ARIA-GCM`) |
| Hash / integridad | `HMAC-MD5` · `HMAC-SHA1` · `HMAC-SHA2` (256/384) · `AEAD` (*Authenticated Encryption with Associated Data*) |
| Autenticación | Firmas `RSA` · Firmas `DSS` |

El tachado y la negrita de la tabla transportan el formato visual de las filminas, no una opinión de esta nota: en la filmina 33, `RSA` y "Diffie-Hellman con certificado RSA o DSS" están resaltados en azul frente al resto en negro; en la filmina 34, `RC4` y `DES-CBC` aparecen **tachados** —marcados como retirados, consistente con que `RC4` terminó prohibido en TLS por la [RFC 7465](https://www.rfc-editor.org/rfc/rfc7465)— mientras que `AES`/`AES-CBC`/`AES-CCM` están en azul y `AES-GCM` va además en negrita, como la opción que la filmina destaca por encima de las demás azules.

Cada suite se arma tomando una opción de cada fila — por ejemplo, "Diffie-Hellman con certificado RSA, AES-GCM, AEAD, firma RSA" es una combinación válida, y el nombre completo de una suite en la práctica (algo como `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`) codifica exactamente estas cuatro decisiones en su propio nombre.

### Intercambio de clave: no todas las opciones dan lo mismo

**La trampa de esta sección, que la filmina no advierte** *(lectura nuestra)*: las cinco opciones de intercambio de clave **no son intercambiables en cuanto a garantías**, aunque la filmina las liste como si fueran alternativas equivalentes.

- **`RSA`.** El cliente cifra el *pre-master secret* directamente con la clave pública del servidor —es exactamente el `ClientKeyExchange` versión RSA del [[tls-handshake#Parte 3 (filmina 41): respuesta del cliente|handshake]]—. **No ofrece *forward secrecy*.** Si un atacante graba el tráfico cifrado de hoy y en algún momento futuro compromete la clave privada de largo plazo del servidor, puede recuperar retroactivamente el *pre-master secret* de **todas** las sesiones grabadas y descifrarlas — el compromiso de una única clave estática rompe la confidencialidad de años de tráfico pasado.
- **Diffie-Hellman (con certificado `RSA` o `DSS`, o `ECDH`).** Si los parámetros de Diffie-Hellman son **efímeros** —se generan de nuevo en cada sesión y se descartan al terminarla, la variante que en la práctica se nombra `DHE`/`ECDHE`—, comprometer la clave privada de largo plazo del servidor **no** permite recuperar sesiones pasadas: esa clave solo sirvió para **firmar** los parámetros efímeros de esa sesión (ver el `ServerKeyExchange` del handshake), no para cifrar nada directamente. Esto **sí** da *forward secrecy*. La filmina no distingue la variante efímera de una hipotética variante estática de DH con certificado, así que esta distinción es una precisión de lectura, no algo que la lámina desarrolle.
- **Diffie-Hellman anónimo.** Sin certificado, así que sin autenticación de ninguna de las dos partes — vulnerable a [[ataques-activos-y-man-in-the-middle|Man in the middle]] tal cual esa sección lo describe, exactamente el escenario que la [[infraestructura-de-clave-publica|PKI]] existe para evitar. Rara vez se usa en la práctica salvo en escenarios donde la autenticación se resuelve por otra vía.

$$\text{RSA: comprometer } K_{\text{priv, servidor}} \;\Longrightarrow\; \text{descifrar todo el tráfico pasado grabado}$$
$$\text{DHE/ECDHE: comprometer } K_{\text{priv, servidor}} \;\Longrightarrow\; \text{solo permite suplantar al servidor a futuro, no descifrar el pasado}$$

### Las variantes con claves cortas, y por qué existen

La filmina 33 anota que existen **variantes obsoletas con claves de 512 bits** para el intercambio de clave, y da el motivo explícito: **"definidas por problemas de exportación de material criptográfico en los EE.UU."**. La filmina 34 anota lo mismo para claves **simétricas de 40 bits**, sin repetir el motivo — *(lectura nuestra)*: es razonable asumir la misma causa para las dos, dado que ambas filminas comparten el título "TLS - Criptografía" y una de ellas ya lo explicita; es el mismo contexto histórico de las restricciones de exportación de criptografía de EE.UU. durante los años 90, que también limitó la fuerza de `DES` y de `RC4` en software exportado —no desarrollado en la clase—.

**Por qué esto no es solo curiosidad histórica** *(lectura propia, no está en la filmina)*: esas variantes de 512 bits, pensadas para desactivarse con el tiempo, siguieron **implementadas** en muchos servidores mucho después de dejar de ser obligatorias por ley, simplemente por compatibilidad hacia atrás. El ataque **FREAK** (2015) explotó exactamente eso: forzar, vía un atacante activo en el handshake, que cliente y servidor negociaran una de esas suites *export-grade* de 512 bits aunque ninguno de los dos la prefiriera, y luego factorizar la clave de 512 bits en el tiempo que dura una conexión TCP con el cómputo de una nube moderna. Es el ejemplo concreto de por qué "dejar la opción vieja disponible, aunque nadie la use por defecto" es en sí mismo un riesgo de seguridad — el mismo argumento, en espíritu, que [[eleccion-de-primitivas|Elección de primitivas]] hace sobre no reusar criptografía obsoleta.

### Hash / integridad y autenticación

- **`HMAC-MD5`, `HMAC-SHA1`, `HMAC-SHA2`.** Instancias concretas de [[hmac|HMAC]] con distintas funciones de hash subyacentes. `HMAC-MD5` y `HMAC-SHA1` figuran en el menú por compatibilidad histórica: `MD5` está [[primitivas-de-hash-estandar|quebrado por colisiones]] y `SHA-1` también acumuló ataques de colisión prácticos con el tiempo, aunque **el uso de un hash quebrado adentro de un `HMAC` no es automáticamente catastrófico** — la seguridad de `HMAC` no depende de la resistencia a colisiones de la misma manera que la firma directa de un hash sí depende. Aun así, las suites modernas evitan ambos por precaución y por estándar.
- **`AEAD`** (*Authenticated Encryption with Associated Data*) no es un algoritmo de hash: es la categoría de [[cifrado-autenticado|cifrado autenticado]] que integra confidencialidad e integridad en una sola primitiva —como `AES-GCM` o `AES-CCM`, ya listados en la fila de cifrado simétrico—, y por eso una suite `AEAD` **no necesita** un `HMAC` aparte: la autenticación ya viene incluida en el modo de cifrado.
- **Autenticación (firmas `RSA` o `DSS`).** Es la firma que el servidor —y, si se pide, el cliente— produce durante el handshake para probar posesión de la clave privada correspondiente al certificado. Ver el `ServerKeyExchange` en [[tls-handshake|TLS handshake]].

## Ver también

- [[tls-arquitectura-y-record|TLS: arquitectura y record]] — la unidad de récord sobre la que se aplica la suite negociada
- [[sesion-y-conexion-tls|Sesión y conexión TLS]] — dónde queda guardada la suite elegida una vez negociada
- [[tls-handshake|TLS handshake]] — el `ClientHello`/`ServerHello` que negocia `Ciphers`/`Cipher`, y el `ServerKeyExchange` donde se ve la firma en acción
- [[cifrado-autenticado|Cifrado autenticado]] — qué es `AEAD` y por qué sustituye a un `HMAC` aparte
- [[hmac|HMAC]] · [[primitivas-de-hash-estandar|Primitivas de hash estándar]] — las construcciones detrás de `HMAC-MD5`, `HMAC-SHA1` y `HMAC-SHA2`
- [[ccm-y-gcm|CCM y GCM]] — los dos modos `AEAD` que la fila de cifrado simétrico lista para `AES` y `ARIA`
- [[modos-de-encadenamiento|Modos de encadenamiento]] — el modo `CBC` detrás de `DES-CBC`, `3DES-EDE-CBC` y `AES-CBC`
- [[ataques-activos-y-man-in-the-middle|Ataques activos y man in the middle]] — el riesgo concreto de un Diffie-Hellman anónimo sin certificado
- [[eleccion-de-primitivas|Elección de primitivas]] — el criterio general de no dejar disponibles primitivas obsoletas, ilustrado acá con las variantes de exportación
- [[clase-05-protocolos-criptograficos#11. Suites criptográficas de TLS|Clase 05 — Protocolos criptográficos]] — sección 11, de donde sale esta nota
