---
title: Change Cipher Spec y Alert
resumen: 'Los dos tipos de mensaje TLS sin datos de aplicación: el Change Cipher Spec, que dispara una renegociación de claves en cualquier momento, y el Alert, que informa advertencias, errores fatales y el cierre ordenado con CloseNotify.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[tls-handshake]]", "[[tls-arquitectura-y-record]]", "[[sesion-y-conexion-tls]]"]
aliases: [Change Cipher Spec, TLS Alert, CloseNotify, TLS Change Cipher Spec, Alertas TLS]
type: concepto
unidad: 1
clase: 5
orden: 13
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, tls, change-cipher-spec, alert, renegociacion, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Change Cipher Spec y Alert

**Los dos tipos de mensaje TLS que no llevan datos de aplicación: uno dispara un cambio de claves en cualquier momento de la conexión, y el otro es el canal por el que TLS avisa que algo salió mal — desde un cierre prolijo hasta un motivo para cortar la conexión de inmediato.** Es la nota que cierra el bloque de protocolos de la clase con la vista de conjunto de qué es TLS y dónde encaja en el resto de la infraestructura de seguridad.

Sale de las **filminas 44 a 47** del PDF de teoría de la Clase 05. La clase todavía no se dictó — hoy es 04/09/2026, la Clase 05 es el 17/09 según el [[cronograma]] — así que esta nota está escrita contra el PDF de filminas y lecturas propias rotuladas. No hay transcripción ni callouts *De la transcripción*.

## Change Cipher Spec, como mensaje general

*Filmina 44.* Ya apareció, en el [[tls-handshake#Parte 4 (filminas 42-43): Change Cipher Spec y Finish, en las dos direcciones|handshake]], como el mensaje que precede al primer `Finish` de cada dirección. Esta filmina lo generaliza:

- Se usa durante el handshake, **pero puede aparecer en cualquier momento** de una conexión ya establecida.
- Implica una **renegociación** — un cambio de las claves de sesión en uso —, y lo puede pedir tanto el cliente como el servidor.
- **No tiene contenido propio**: es un tipo de mensaje del protocolo cuya sola llegada dispara el cambio, no un mensaje que se interprete por su cuerpo — el cuerpo del `ChangeCipherSpec` está vacío, $\{\,\}$, en el handshake.

**Que "pueda aparecer en cualquier momento" es la parte que conviene retener**, porque es exactamente lo que habilita la **renegociación**: TLS no obliga a correr el handshake completo una sola vez al principio de la conexión y nunca más — cualquiera de las dos partes puede pedir, en medio de una sesión de datos de aplicación ya en curso, que se vuelva a negociar el material criptográfico (por ejemplo, para subir el nivel de autenticación del cliente a mitad de una sesión HTTP, un patrón real de algunos servidores web de la época).

## TLS Alert

*Filminas 45-46.* El **Alert** envía eventos **fuera de banda** — es decir, en un canal de mensajes separado del flujo de datos de aplicación, aunque viaje sobre el mismo [[tls-arquitectura-y-record|TLS Record]]—, y se clasifica en dos niveles:

- **Advertencia** — informativo, no corta la conexión por sí solo.
- **Fatal** — **invalida la conexión**: al recibir o emitir un alert fatal, ambas partes deben terminarla.

**`CloseNotify`** es el evento que indica el **fin de una sesión**, de forma prolija: anuncia que no se van a enviar mensajes nuevos, y si llega un mensaje nuevo después de un `CloseNotify` recibido, se ignora. Es el mecanismo que distingue un cierre **intencional** de una conexión —el `CloseNotify` llegó— de un corte abrupto de la conexión de transporte subyacente sin ningún aviso de TLS — que un receptor cuidadoso debería tratar como sospechoso, no como un fin de sesión normal.

**Los errores fatales** que la filmina enumera:

| Error fatal | Qué indica |
|---|---|
| Mensaje no esperado | un mensaje llegó fuera del orden que la máquina de estados del protocolo permite |
| `MAC` incorrecto | el récord no pasó la verificación de integridad |
| Error al descomprimir | el bloque comprimido del récord no descomprime correctamente |
| Error en el handshake | alguna de las partes no pudo completar la negociación |
| Parámetro ilegal | un valor recibido está fuera del rango o formato esperado |

**Las advertencias o errores**, a elección de quien las recibe según el contexto — es decir, no necesariamente fatales, aunque puedan tratarse como tal si la política de seguridad local lo exige:

| Advertencia | Qué indica |
|---|---|
| No hay certificado | se esperaba un certificado y no llegó ninguno |
| Certificado no válido | el certificado recibido no pasa la [[x509\|verificación de X.509]] |
| Certificado no soportado | el tipo de certificado no es uno que la implementación maneje |
| Certificado expirado o revocado | falla el intervalo de validez, o aparece en una [[revocacion-y-listas-crl\|CRL]] |

## Por qué "en cualquier momento" fue, en la práctica, un problema real

**Esta sección no está en las filminas 44-47 — desarrolla, con nombre y mecanismo, el problema que la filmina 48 deja apenas insinuado como lectura recomendada, y que el propio panorama de la filmina 47 anticipa con la frase "problemas de diseño... hicieron que pierda parte de su utilidad"** *(lectura propia, rotulada por completo)*.

Que un `ChangeCipherSpec` pueda disparar una renegociación en cualquier punto de una conexión ya autenticada fue, en 2009, el mecanismo detrás de una vulnerabilidad real y con nombre: la **vulnerabilidad de renegociación de TLS** (divulgada públicamente en noviembre de 2009). El problema de fondo: el `Finish` de una renegociación **no estaba criptográficamente atado** al `Finish` de la sesión anterior sobre la que se renegociaba. Eso permitía un ataque de **inyección de prefijo**: un atacante activo podía abrir su propia conexión TLS con un servidor, inyectar datos de aplicación bajo su propia identidad, y luego forzar una renegociación en la que la **víctima real** completaba el handshake — de manera que, del lado del servidor, los datos que el atacante había inyectado antes de la renegociación quedaban **prependidos** a los datos legítimos de la víctima, dentro de lo que la aplicación de arriba veía como una sola conexión autenticada. El ejemplo canónico: inyectar el comienzo de un request HTTP malicioso antes de que la sesión autenticada del usuario legítimo complete el resto del request.

**Por qué esto era posible con el protocolo tal como lo describen estas filminas**: nada en el `Finish` de una renegociación —tal como está definido en las filminas 42-43 del [[tls-handshake|handshake]]— incluye información sobre el `Finish` de una negociación **anterior** en la misma conexión; `msgs` es la concatenación de los mensajes de **este** handshake solamente. La corrección estándar (`RFC 5746`, la extensión de renegociación segura) agrega justamente eso: cada `Finish` de una renegociación incorpora el valor del `Finish` anterior, atando criptográficamente toda la cadena de renegociaciones entre sí y cerrando la posibilidad de inyectar contenido en el punto de la costura.

## Panorama de TLS

*Filmina 47.* La clase cierra el bloque con una síntesis de dónde queda TLS parado, en cinco puntos:

- Es el **estándar de comunicación segura** en servicios web (`https`) y control remoto (`ssh`).
- **Depende por completo** de la infraestructura de [[infraestructura-de-clave-publica|PKI]] descripta en las secciones anteriores de la clase.
- **No se usa frecuentemente para validar clientes**: la autenticación de cliente de la Parte 3 del [[tls-handshake#Parte 3 (filmina 41): respuesta del cliente|handshake]] existe en el protocolo, pero rara vez se pide en la práctica.
- Está **soportado por todos los navegadores**, aunque cada uno responde distinto frente a las alertas — no hay una política universal de qué hacer ante cada tipo de advertencia.
- Aunque **problemas de diseño del lado de los clientes** —como el de renegociación desarrollado arriba— le hicieron perder parte de su utilidad, **sigue siendo la alternativa mayormente adoptada**.
