---
title: Certificados digitales
resumen: 'Mensaje firmado por una autoridad competente que ata una identidad a una clave pública, con fecha de emisión, intervalo de validez y tipo de uso; permite verificar identidad, obtener la clave, validar vigencia e integridad.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[infraestructura-de-clave-publica]]", "[[cadenas-de-firmas-y-autoridades-raiz]]", "[[x509]]"]
aliases: [Certificados digitales, Certificado digital, Common Name, CN, Tipo de uso de un certificado, Uso de un certificado]
type: concepto
unidad: 1
clase: 5
orden: 3
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, pki, certificados, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Certificados digitales

**Qué es, exactamente, el objeto que resuelve la asociación identidad-clave de la PKI, y las cuatro cosas para las que sirve una vez que se tiene.** Es la nota que da forma concreta a la promesa de [[infraestructura-de-clave-publica|Infraestructura de clave pública]], y la que deja planteada, en su último punto, la pregunta que reabre el problema una capa más arriba: validar una firma también necesita una clave pública.

Cubre las filminas **8 a 10** del PDF de teoría de la Clase 05. **Esta clase todavía no se dictó** — hoy es 04/09/2026, la fecha del [[cronograma]] es el 17/09 —, así que la nota está escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas; no hay transcripción de esta clase. Las tres filminas son bloques de viñetas simples y coinciden entre el texto extraído y lo esperable de su estructura.

## Definición: qué contiene un certificado

*Filmina 8.* Un certificado es, ante todo, un **mensaje**: no un objeto binario opaco, sino una estructura de datos con campos definidos. Contiene, como mínimo:

- **Información de identidad** — por ejemplo, un nombre.
- **La clave pública** asociada a esa identidad.
- **Fecha de emisión.**
- **Intervalo de validez.**
- **Tipo de uso** autorizado para esa clave, con cuatro ejemplos que la filmina lista como viñetas — sin indicar explícitamente si son mutuamente excluyentes *(precisión nuestra: la filmina no lo aclara)*: firma de mensajes, cifrado de emails, firma de certificados, cifrado de sitios web.

Y una propiedad que separa a un certificado de una simple declaración autoproclamada: **el certificado está firmado digitalmente por una autoridad competente**. Esa firma es lo que convierte "alguien dice que esta clave es de $B$" en una afirmación verificable — siempre que se confíe en quien firmó. De dónde sale esa confianza es exactamente el tema de [[cadenas-de-firmas-y-autoridades-raiz|Cadenas de firmas y autoridades raíz]].

> **Sobre el campo "tipo de uso": esta lista se vuelve el estándar `X.509` en la sección siguiente** *(lectura nuestra)*. La [[x509|nota de X.509]] muestra un certificado real donde este campo aparece bajo `X509v3 Basic Constraints` con el valor `CA:TRUE` — es decir, "este uso es firmar otros certificados". La correspondencia entre los cuatro usos de esta filmina y los campos concretos de X.509 no está hecha explícita en el material, pero es la misma idea con nombre de estándar.

## Cómo se usa un certificado: las cuatro operaciones

*Filminas 9-10.* $A$ solicita el certificado de $B$ — puede dárselo el propio $B$, o cualquier otra entidad que lo tenga —, y con él $A$ puede hacer cuatro verificaciones independientes.

### Verificar la identidad

Comparando el campo `CN` (*Common Name*), cuyo contenido esperado **depende del tipo de entidad** que el certificado identifica:

| Tipo de entidad | Convención de `CN` |
|---|---|
| Dirección de email | `CN=<dirección de email>` |
| Servidor | `CN=<IP>` o `CN=<hostname>` |
| Empresa | `CN=<Razón social>` |

Esta tabla es la que vuelve concreta la palabra "identidad" que quedó abstracta en la [[infraestructura-de-clave-publica#Por qué la PKI no aplica a criptosistemas simétricos|nota de PKI]]: un certificado no identifica personas en abstracto, identifica **según el rol** que la entidad juega en el protocolo.

### Obtener la clave pública de B

Es parte del certificado mismo, junto con el **tipo de clave** — por ejemplo `RSA-2048` o `DSA-EC 320`, en los ejemplos que da la filmina. No hace falta ningún canal adicional: la clave viaja dentro del propio mensaje certificado.

### Verificar la validez

Dos comprobaciones distintas, que conviene no confundir:

- **El tipo de uso permitido** coincide con lo que se necesita — un certificado marcado para "cifrado de emails" no debería aceptarse para "firma de certificados", aunque la clave matemáticamente sirva para las dos cosas.
- **La fecha de vigencia** no expiró — el intervalo de validez de la definición de la filmina 8.

### Verificar la integridad

Validando la **firma digital** de la autoridad que certifica. Es la comprobación que, sin ella, todo lo anterior es solo una afirmación no verificada — cualquiera puede escribir un mensaje con el formato correcto y una clave pública cualquiera.

## La pregunta que queda abierta

El cierre de la filmina 10 es, textualmente, la bisagra hacia la sección siguiente: **validar una firma digital requiere una clave pública — ¿cómo se obtiene esa?** Es la misma pregunta de origen que abrió toda la clase en [[ataques-activos-y-man-in-the-middle#El problema de origen: ¿de dónde sale una clave pública? (filmina 5)|Ataques activos y man in the middle]] — solo que ahora aplicada a la clave de la **autoridad certificante**, no a la de $B$. La respuesta —que las autoridades certificantes tienen a su vez un certificado, hasta llegar a una raíz en la que se confía sin más pruebas— es el contenido de [[cadenas-de-firmas-y-autoridades-raiz|Cadenas de firmas y autoridades raíz]].

## Ver también

- [[clase-05-protocolos-criptograficos#4. Certificados digitales|Clase 05 — Protocolos criptográficos, sección 4]] — la sección de la que sale esta nota
- [[infraestructura-de-clave-publica|Infraestructura de clave pública]] — el objetivo que el certificado instancia
- [[cadenas-de-firmas-y-autoridades-raiz|Cadenas de firmas y autoridades raíz]] — de dónde sale la clave pública que valida la firma del certificado
- [[x509|X.509]] — el estándar que fija los campos exactos de un certificado real, con un ejemplo completo
- [[revocacion-y-listas-crl|Revocación y listas CRL]] — qué pasa cuando un certificado válido deja de serlo antes de su expiración
- [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04 — Criptografía asimétrica y firma digital]] — la firma digital que certifica un certificado
