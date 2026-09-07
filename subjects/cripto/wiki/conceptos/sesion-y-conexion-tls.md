---
title: Sesión y conexión TLS
resumen: 'Distinción de TLS entre la sesión, lo negociado una vez y reutilizable por varias conexiones incluido el Master Secret de 48 bytes, y la conexión, con nonces, IVs y claves de escritura y MAC distintas para cada dirección.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[tls-handshake]]", "[[suites-criptograficas-de-tls]]", "[[tls-arquitectura-y-record]]"]
aliases: [Sesión TLS, Conexión TLS, TLS Session, TLS Connection, Master Secret]
type: concepto
unidad: 1
clase: 5
orden: 11
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, tls, sesion, conexion, master-secret, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Sesión y conexión TLS

**Dos palabras que TLS usa con un significado técnico preciso y distinto entre sí, y que el uso cotidiano de "sesión" invita a confundir.** Es la nota que separa *qué se acordó* (la sesión, reutilizable) de *cómo se están usando esos acuerdos ahora mismo* (la conexión, con material criptográfico fresco por cada instancia) — y donde queda explícito, con la propia advertencia en mayúsculas de la filmina, que ninguna de las dos cosas es un mecanismo de sesión de aplicación.

Sale de las **filminas 36 y 37** del PDF de teoría de la Clase 05. La clase todavía no se dictó — hoy es 04/09/2026, la Clase 05 es el 17/09 según el [[cronograma]] — así que esta nota está escrita contra el PDF de filminas y lecturas propias rotuladas. No hay transcripción ni callouts *De la transcripción*.

## Sesión: lo que se negocia una vez y se puede reusar

*Filmina 36.* Una **sesión** TLS es una asociación entre dos pares que **puede soportar múltiples conexiones**. Guarda:

- Un **identificador único de sesión** (el $S_{id}$ que aparece en el `ClientHello`/`ServerHello` del [[tls-handshake#Parte 1 (filmina 38): hola y parámetros|handshake]]).
- El **certificado X.509v3** del otro extremo — opcional, porque la autenticación de cliente rara vez se pide en la práctica.
- El **método de compresión** acordado.
- El **método de encriptación y `MAC`** acordado — es decir, la [[suites-criptograficas-de-tls|suite criptográfica]] elegida.
- El **"Master Secret"**: la clave de sesión compartida, de **48 bytes**, derivada durante el handshake a partir del *pre-master secret*.

**La advertencia que cierra la filmina, citada tal cual porque el énfasis es de la propia lámina:**

> *"Sesiones en SSL: Uso transparente por eficiencia. **NO es un protocolo de sesión!!!**"*

**Qué significa exactamente esa advertencia** *(lectura nuestra, desarrollando la frase de la filmina)*: reusar una sesión —reconectar con el mismo $S_{id}$ en lugar de correr el handshake completo de nuevo— es una **optimización de rendimiento**: evita repetir la parte cara del handshake (intercambio de certificados, operaciones de clave pública) cuando cliente y servidor ya se conocieron recientemente. No es, en cambio, un mecanismo para que la **aplicación** de arriba mantenga estado de usuario —lo que en la práctica se resuelve con cookies de sesión HTTP, tokens, etc.—. Confundir las dos cosas es el error concreto que la filmina previene: que exista una sesión TLS vigente **no dice nada** sobre si el usuario de la aplicación sigue autenticado, ni sobre cuánto dura su sesión de aplicación.

## Conexión: los parámetros de uso, frescos por instancia

*Filmina 37.* Una **conexión** describe **cómo** intercambiar datos dentro de una sesión, y contiene:

- Una **secuencia de bits aleatoria de calidad criptográfica** — los nonces $r_1$ (cliente) y $r_2$ (servidor) del `ClientHello`/`ServerHello`.
- **Claves de escritura para ambos lados**, **distintas** para cada dirección.
- **Claves para `MAC`** (hashes con clave) también distintas para ambos lados.
- **IVs**, si el modo de cifrado los necesita.
- Un **número de secuencia independiente** para cliente y para servidor.

### Por qué las claves son distintas por dirección

**Este es el detalle de diseño que más se pasa por alto, y la filmina no explica el porqué** *(lectura nuestra)*. Si cliente y servidor usaran la **misma** clave de escritura en las dos direcciones, un atacante activo podría montar un **ataque de reflexión**: capturar un mensaje cifrado que el cliente le mandó al servidor y **reenviárselo al propio cliente** simulando que viene del servidor. Si la clave fuera simétrica y compartida en ambos sentidos, el cliente lo descifraría con éxito —porque es la misma clave que usó para cifrar su propio mensaje— sin ninguna manera de distinguir "esto lo mandé yo" de "esto lo mandó el servidor". Usar **claves de escritura independientes por dirección** (cliente-a-servidor y servidor-a-cliente son criptográficamente distintas) cierra ese canal por diseño: un mensaje válido en una dirección jamás descifra correctamente en la otra. Es la misma familia de problema que ya apareció con el [[ataques-de-repeticion-y-frescura|Ataque de reflexión]] en el contexto de `MAC`s y desafíos-respuesta.

### Los números de secuencia, y una frescura distinta de la de Denning-Sacco

Los números de secuencia —independientes para cliente y servidor— cumplen un rol de frescura, pero **a un nivel distinto** del que resolvía [[denning-sacco-y-frescura|Denning-Sacco]] para Needham-Schroeder. Ahí, la frescura protegía contra reinyectar una **clave de sesión completa** de una ejecución vieja del protocolo. Acá, el número de secuencia protege contra reordenar o repetir **récords individuales dentro de una misma conexión ya establecida**: se incluye implícitamente en el cálculo del `MAC` de cada [[tls-arquitectura-y-record|TLS Record]], aunque no viaje explícito en el récord —cada lado lo mantiene y lo incrementa localmente—, así que dos récords con contenido idéntico producen `MAC`s distintos si sus números de secuencia difieren, y un atacante que reordene o repita récords capturados produce un `MAC` que no valida contra el número de secuencia esperado por el receptor.

$$\text{Denning-Sacco: frescura de una \emph{sesión completa}, contra ejecuciones viejas del protocolo}$$
$$\text{Número de secuencia TLS: frescura de un \emph{récord individual}, contra reordenamiento dentro de la misma conexión}$$

## Sesión y conexión, lado a lado

| | Sesión | Conexión |
|---|---|---|
| Alcance | puede abarcar **varias** conexiones | una sola instancia de intercambio de datos |
| Qué guarda | acuerdos de **largo plazo**: suite, certificado, Master Secret | material de **uso**: claves de escritura, `MAC`, IVs, secuencia |
| Se reusa para | evitar rehacer el handshake completo | — (es, en sí misma, la unidad que se abre y cierra) |
| Riesgo si se confunde con sesión de aplicación | ninguno directo, pero la filmina lo advierte explícitamente | — |
