---
title: Revocación y listas CRL
resumen: 'Mecanismo para invalidar un certificado antes de que expire, por compromiso de la clave o cambio de dueño; bajo X.509 solo el emisor puede revocar, y la CRL es la lista negra consultable offline u online.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[x509]]", "[[certificados-digitales]]", "[[cadenas-de-firmas-y-autoridades-raiz]]"]
aliases: [Revocación de certificados, Listas CRL, Certificate Revocation List, CRL, Revocación de claves]
type: concepto
unidad: 1
clase: 5
orden: 6
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, pki, certificados, revocacion, crl, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Revocación y listas CRL

**Qué hacer cuando un certificado válido, dentro de su período de vigencia, tiene que dejar de ser confiable antes de tiempo.** Es la nota que cierra el bloque de PKI de la clase: todo lo anterior —certificados, cadenas de firmas, X.509— asume que la fecha de expiración es la única forma de que un certificado deje de servir; esta nota es la excepción a esa asunción.

Cubre las filminas **20 y 21** del PDF de teoría de la Clase 05. **Esta clase todavía no se dictó** — hoy es 04/09/2026, la fecha del [[cronograma]] es el 17/09 —, así que la nota está escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas; no hay transcripción de esta clase. Las dos filminas son bloques de viñetas simples, sin fórmulas ni diagramas.

## Por qué hace falta revocar antes de la expiración

*Filmina 20.* El [[x509#Verificación de un certificado X.509, en cinco pasos|paso 3 de verificación de un certificado X.509]] comprueba que el certificado esté dentro de su intervalo de validez — pero ese intervalo se fijó **en el momento de la emisión**, sobre la hipótesis de que la clave privada correspondiente seguiría siendo secreta y su dueño seguiría siendo el mismo hasta esa fecha. Dos eventos rompen esa hipótesis **antes** de tiempo:

- **La clave fue averiguada por un atacante** — se comprometió la clave privada, y todo certificado que la respalda deja de garantizar nada, aunque su fecha de expiración esté lejos.
- **Cambio anticipado**, por ejemplo un cambio del dueño de la clave — la identidad que el certificado ataba a esa clave dejó de corresponder.

## La tensión de diseño

La filmina plantea el problema como dos requisitos que compiten entre sí, y que cualquier mecanismo de revocación tiene que resolver a la vez:

1. **No revocar** certificados que no deben ser revocados — es decir, evitar que alguien pueda revocar un certificado **sin autorización**, porque eso sería una denegación de servicio trivial contra cualquier identidad.
2. **Propagar** la información de revocación con suficiente rapidez como para evitar comunicaciones futuras con la clave comprometida — un mecanismo de revocación que tarda semanas en llegar a todo el mundo no protege a nadie durante ese tiempo.

*(Lectura nuestra, no desarrollado en la filmina)*: estos dos requisitos tironean en direcciones opuestas por diseño. Restringir quién puede revocar (para satisfacer el punto 1) tiende a introducir demora — hay que verificar la autorización de quien pide la revocación —, lo cual atenta contra la velocidad de propagación que pide el punto 2. El mecanismo concreto que se describe a continuación resuelve el punto 1 de forma tajante —restringiendo la autorización a una sola parte— y deja el punto 2 librado a cómo se distribuye la lista.

## Las listas de revocación (CRL)

*Filmina 21.* Una `CRL` (*Certificate Revocation List*) es, literalmente, una lista de certificados revocados — la filmina la compara con una lista de números de tarjeta de crédito robadas: un mecanismo de "lista negra" consultable, no una prueba criptográfica de que un certificado en particular sigue siendo válido.

Hay dos tipos de listado:

- **Listado actual** — certificados vigentes (dentro de su intervalo de validez) que fueron revocados.
- **Listado histórico** — certificados ya expirados que además fueron revocados en algún momento.

**Bajo el estándar X.509, solo el emisor de un certificado puede revocarlo.** Esta es exactamente la restricción que resuelve el requisito 1 de la tensión de diseño de arriba: revocar no es una acción abierta a cualquiera que reclame la identidad del certificado, sino un privilegio exclusivo de la autoridad que lo emitió en primer lugar — la misma AC de [[cadenas-de-firmas-y-autoridades-raiz|Cadenas de firmas y autoridades raíz]]. La revocación se agrega a la **CRL global de esa AC**.

Sobre esa CRL global, hay dos formas de consultarla:

- **Descargarla de antemano** para validar **offline** — el verificador tiene una copia local de la lista y la consulta sin conexión al momento de validar un certificado.
- **Consultar el estado de un certificado puntual online**, por conexión directa al servicio de la AC.

> **El compromiso entre las dos formas de consulta** *(lectura nuestra, no está en la filmina)*: la validación offline es rápida y no depende de la disponibilidad de la AC en el momento de la verificación, pero introduce un desfasaje — la copia local de la CRL puede estar desactualizada, y una revocación reciente no se reflejaría hasta la próxima descarga. La validación online resuelve ese desfasaje al costo de depender de que el servicio de la AC esté disponible y responda a tiempo, lo cual reintroduce parte del problema de propagación que la CRL busca resolver. Ninguna de las dos opciones es estrictamente mejor; es el mismo tipo de compromiso que en otros contextos del curso se resuelve con [[riesgo-y-seguridad-relativa|riesgo y seguridad relativa]]: la elección depende de qué tan crítico es detectar una revocación en tiempo real.

## Ver también

- [[clase-05-protocolos-criptograficos#7. Revocación y listas CRL|Clase 05 — Protocolos criptográficos, sección 7]] — la sección de la que sale esta nota
- [[x509|X.509]] — el estándar cuyo paso de verificación de vigencia esta nota complementa
- [[certificados-digitales|Certificados digitales]] — el intervalo de validez que la revocación anticipa
- [[cadenas-de-firmas-y-autoridades-raiz|Cadenas de firmas y autoridades raíz]] — por qué solo el emisor puede revocar es la misma lógica de confianza jerárquica de esta sección
- [[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]] — el marco general para pensar el compromiso entre validación offline y online
