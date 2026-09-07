---
title: "TLS: arquitectura y record"
resumen: 'Capa de seguridad a nivel transporte intercalada entre aplicación y transporte, y su unidad de trabajo, el récord: parte el mensaje en bloques de hasta 65536 bytes, los comprime, los hashea y los cifra.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[infraestructura-de-clave-publica]]", "[[x509]]", "[[pruebas-de-indistinguibilidad]]"]
aliases: [TLS arquitectura, TLS Record, Registro TLS, SSL Record, Capa TLS, Record de TLS]
type: concepto
unidad: 1
clase: 5
orden: 9
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, tls, ssl, tls-record, capas-de-red, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# TLS: arquitectura y record

**Dónde vive TLS en la pila de red, y cómo convierte un mensaje de aplicación en la unidad de datos que efectivamente sale cifrada por el cable.** Es la nota de arranque de todo el bloque TLS: sin el TLS Record no hay unidad sobre la que aplicar nada de lo que viene después —suites (05.10), sesión y conexión (05.11), handshake (05.12)—, porque el Record es literalmente el contenedor que las demás secciones llenan.

Sale de las **filminas 29 a 31** del PDF de teoría de la Clase 05. La clase todavía no se dictó — hoy es 04/09/2026, la Clase 05 es el 17/09 según el [[cronograma]] — así que esta nota está escrita contra el PDF de filminas y contra lecturas propias rotuladas. No hay transcripción ni callouts *De la transcripción*.

## Qué es SSL/TLS

*Filmina 29.* Ofrece seguridad a **nivel transporte**: corre sobre un canal de transporte confiable —típicamente `TCP`— y provee, para ambos participantes (origen y destino), las tres garantías que el resto del curso viene tratando por separado:

- **Confidencialidad** — el contenido no es legible en tránsito.
- **Integridad** — una modificación en tránsito se detecta.
- **Autenticación** — de origen y de destino, apoyada en la [[infraestructura-de-clave-publica|PKI]] y los [[x509|certificados X.509]] de las secciones anteriores de la clase.

**Historia, en una línea.** `SSL` (*Secure Socket Layer*) es la versión original, creada por Netscape. `TLS` (*Transport Layer Security*) es su evolución, y corrige deficiencias que se le encontraron a SSL. La filmina da una equivalencia informal de versiones: **`TLS 1.2` = `SSL 3.3`** — es decir, TLS continúa la numeración de SSL como si fuera la misma familia de protocolo en evolución, y no dos protocolos independientes. `TLS` es, a la fecha de la filmina, el estándar actual.

## Dónde se intercala TLS en la pila

*Filmina 30.* La filmina lo resuelve con dos diagramas de capas, uno al lado del otro.

**Conexión normal, insegura.** El mensaje $m$ pasa de la capa de Aplicación a la de Transporte sin ninguna transformación — lo que sale a la red es $m$ en claro.

**Conexión con SSL, protegida.** Se intercala una capa `SSL` entre Aplicación y Transporte. Esa capa toma el mismo mensaje $m$ y lo convierte, antes de que llegue a Transporte, en una secuencia de bytes sin ninguna estructura reconocible — la filmina la dibuja literalmente como una cadena de símbolos sin sentido, del estilo `($!)$J"=?*`. *(Precisión nuestra, no está en la filmina)*: esa cadena de símbolos no es un artefacto de la extracción del PDF ni un error de transcripción — es, deliberadamente, cómo se representa "esto es ruido cifrado, indistinguible de azar" en una lámina, la misma idea informal de indistinguibilidad que las [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]] formalizan para un criptosistema.

**La consecuencia arquitectónica que la filmina no dice en voz alta** *(lectura nuestra)*: al vivir **entre** Aplicación y Transporte, TLS es transparente para el protocolo de aplicación de arriba (HTTP, SMTP, lo que sea) y para el transporte de abajo (TCP no necesita saber que sus bytes van cifrados) — es exactamente la propiedad que permite frases como "HTTPS es HTTP sobre TLS" sin que HTTP tenga que cambiar una sola línea de su propia especificación.

## El TLS Record

*Filmina 31.* El **TLS Record** es la unidad de trabajo de la capa TLS: el proceso que convierte un mensaje de aplicación en lo que efectivamente se entrega al servicio de transporte, en cuatro pasos.

1. TLS recibe un mensaje a enviar.
2. Lo divide en **bloques de no más de $2^{16}$ bytes** cada uno.
3. **Comprime** cada bloque, y calcula su **hash**.
4. **Encripta** cada bloque junto con su hash, y lo envía al servicio inferior (por ejemplo, `TCP`).

![Estructura del TLS Record: del mensaje completo a los bloques comprimidos y finalmente al récord cifrado con su header](../../assets/clase05-tls-record.png)

Leyendo el diagrama de arriba hacia abajo: el **mensaje** completo se parte en **bloques**; cada bloque pasa a **bloque comprimido** (con su hash ya calculado y pegado); y cada bloque comprimido se convierte en un **TLS Record**, cifrado como unidad, con un `header` al frente de cada franja.

**Qué lleva el header, y por qué la filmina no lo desarrolla** *(lectura nuestra, no está en la filmina)*: el diagrama rotula la caja pero no describe su contenido. Por especificación, ese header identifica el **tipo de contenido** del récord —uno de los cuatro tipos de mensaje que la [[suites-criptograficas-de-tls|sección siguiente]] detalla: handshake, datos de aplicación, alerta o change cipher spec— y la **versión** del protocolo negociada, además de la longitud del fragmento. Es lo que le permite al receptor, antes incluso de descifrar nada, saber a qué máquina de estados TLS entregarle el contenido una vez descifrado.

**El orden de las operaciones es la parte que conviene mirar con cuidado** *(lectura nuestra, no está en la filmina)*: el esquema de la filmina es *comprimir, después autenticar (hashear), después cifrar* — **compress-then-MAC-then-encrypt**. Ese orden concreto tuvo una consecuencia real bastante posterior a esta lámina: el ataque **CRIME** (2012) explota que la compresión, cuando mezcla datos secretos (por ejemplo una cookie de sesión) con datos que el atacante controla (por ejemplo el contenido de un request HTTP que el atacante puede inducir a que la víctima envíe), produce un tamaño de salida comprimida que **depende de si el atacante adivinó correctamente** un byte del secreto — un side channel de compresión, no una falla de la primitiva de cifrado ni del hash. La defensa práctica no cambió el orden que dibuja la filmina: fue deshabilitar la compresión a nivel TLS en la práctica.

## Los cuatro tipos de récord, resumidos

El header de cada TLS Record distingue entre cuatro tipos de contenido, que **esta nota no desarrolla** —cada uno tiene su propio bloque en la clase—:

| Tipo | Para qué sirve | Dónde se desarrolla |
|---|---|---|
| Handshake | negociación inicial, autenticación, derivación de claves | [[tls-handshake\|TLS handshake]] |
| Application data | el contenido del protocolo que TLS encapsula | — |
| Alert | eventos y errores, dentro y fuera de banda | [[change-cipher-spec-y-alert\|Change Cipher Spec y Alert]] |
| Change Cipher Spec | dispara una renegociación de los parámetros de sesión | [[change-cipher-spec-y-alert\|Change Cipher Spec y Alert]] |
