---
title: Infraestructura de clave pública
resumen: 'Conjunto de mecanismos organizativos y criptográficos cuyo objetivo es asociar una identidad a una clave pública y evitar la suplantación; no aplica a criptosistemas simétricos, donde el análogo es un KDC.'
fuentes: ["[[clase-05-protocolos-criptograficos]]", "[[ataques-activos-y-man-in-the-middle]]", "[[clase-04-criptografia-asimetrica-y-firma-digital]]"]
aliases: [Infraestructura de clave pública, PKI, Public Key Infrastructure, Asociar identidad y clave]
type: concepto
unidad: 1
clase: 5
orden: 2
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, protocolos, pki, administracion-de-claves, clase-05, sin-dictar]
sources: ["raw/clases/Clase 05 - Protocolos.pdf"]
---

# Infraestructura de clave pública

**La respuesta de administración de claves al problema que deja planteado el ataque man in the middle: cómo atar una clave pública a la identidad correcta, para que sustituirla deje de ser gratis.** Es la nota más corta de la clase — una sola filmina — pero es la que fija el objetivo que las tres secciones siguientes (certificados, cadenas de firmas, X.509) van a resolver en detalle.

Cubre la **filmina 7** del PDF de teoría de la Clase 05. **Esta clase todavía no se dictó** — hoy es 04/09/2026, la fecha del [[cronograma]] es el 17/09 —, así que la nota está escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas; no hay transcripción de esta clase. La filmina es de puro texto en viñetas, sin fórmulas ni diagramas, y coincide entre el texto extraído y la página renderizada.

## Definición y objetivo

`PKI` (*Public Key Infrastructure*) es el conjunto de mecanismos —organizativos y criptográficos— cuyo **objetivo** es asociar una identidad a una clave pública. Lo que busca evitar, en la propia formulación de la filmina, son los **problemas de suplantación de identidad**: el `man in the middle` o *spoofing* de la [[ataques-activos-y-man-in-the-middle|nota anterior]], donde $A$ termina con $pk_e$ creyendo que es $pk_b$.

## Por qué la PKI no aplica a criptosistemas simétricos

La filmina es explícita en un punto que conviene no pasar por alto: **la `PKI` no es aplicable a los criptosistemas simétricos**. El motivo, que la filmina no desarrolla pero que se sigue directamente de la definición de clave pública *(lectura nuestra)*: en un esquema simétrico no hay una clave *pública* que necesite quedar atada a una identidad de forma verificable por terceros — la clave ya es un secreto compartido entre dos partes que, para intercambiarla, tuvieron que apoyarse en algún canal o tercero de confianza previo. El problema de "¿a quién le pertenece esta clave que acabo de recibir de un desconocido?" es específicamente un problema de **claves públicas**: solo ahí una clave puede circular abiertamente y necesitar, por eso mismo, una garantía externa de a quién identifica.

Esto no significa que el mundo simétrico esté libre del problema de identidad — significa que lo resuelve con una **arquitectura distinta**. La sección de esta clase que resuelve el análogo simétrico es [[needham-schroeder|Needham-Schroeder]], con un `KDC` (*Key Distribution Center*) que comparte una clave con cada parte, en lugar de una autoridad que firma certificados.

| | PKI (asimétrica) | KDC (simétrica) |
|---|---|---|
| Qué necesita cada parte de antemano | Nada, salvo confiar en la raíz de una cadena de certificados | Compartir una clave con el KDC |
| Qué certifica el tercero de confianza | Que una clave **pública** pertenece a una identidad, con una firma | Nada — genera y **distribuye** una clave de sesión simétrica bajo demanda |
| Mecanismo de confianza | Firma digital verificable por cualquiera con la clave pública de la AC | Cifrado bajo una clave compartida, verificable solo por las partes que la tienen |
| Se desarrolla en | [[certificados-digitales\|Certificados digitales]] → [[cadenas-de-firmas-y-autoridades-raiz\|Cadenas de firmas y autoridades raíz]] → [[x509\|X.509]] | [[needham-schroeder\|Needham-Schroeder]] → [[denning-sacco-y-frescura\|Denning-Sacco y frescura]] |

## El motivo, explicado

La filmina da el motivo en dos líneas que conviene desarrollar. Primero: **la selección de la clave depende de con quién se está hablando** — no hay una única clave "correcta" en abstracto, sino una clave correcta *para esa contraparte*. Segundo, y es la consecuencia que ya demostró la [[ataques-activos-y-man-in-the-middle|nota anterior]]: **usar la clave equivocada significa que no hay ninguna garantía de confidencialidad ni de integridad**, sin importar cuán fuerte sea el esquema de cifrado subyacente — exactamente lo que mostró el ataque de la filmina 6, donde $\mathrm{Enc}_{pk_e}(M)$ es criptográficamente perfecto y, al mismo tiempo, completamente inútil como defensa.

*(Lectura nuestra, no está en la filmina)*: obsérvese que "identidad" en esta definición es deliberadamente abstracto — puede ser una persona, un servidor, una empresa o una autoridad certificante. La sección siguiente, [[certificados-digitales|Certificados digitales]], es la que instancia ese concepto de identidad con el campo concreto `CN` (*Common Name*) y sus distintas convenciones según el tipo de entidad.
