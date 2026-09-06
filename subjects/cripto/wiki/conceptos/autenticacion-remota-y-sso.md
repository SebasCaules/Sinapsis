---
title: Autenticación remota y SSO
resumen: 'Delegar la verificación de identidad en un sistema externo, lo que implica necesariamente una relación de confianza; entre las tecnologías abiertas, OpenID 1 y 2 están obsoletas y OpenID Connect se apoya en OAuth2.'
fuentes: ["[[clase-07-autenticacion]]", "[[autenticacion]]", "[[bibliografia]]"]
aliases: [Autenticación remota, Single Sign-On, SSO, OpenID Connect, Federación de identidad]
type: concepto
unidad: 2
clase: 7
orden: 10
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, autenticacion, sso, openid-connect, federacion, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf"]
---

# Autenticación remota y SSO

**Qué implica delegar la verificación de identidad en un sistema externo en lugar de hacerla uno mismo, y qué separa a las dos tecnologías abiertas que compiten para hacerlo.** Es la nota más corta de las cinco de este bloque, porque la filmina se queda deliberadamente en el nivel de "qué existe" y no baja al protocolo — coherente con que el resto de la clase tampoco entra en el detalle de protocolos de federación.

Cubre la filmina **45** del deck `Clase 07 - Aplicaciones - Principios y autenticacion.pdf`. Esta clase todavía no se dictó —hoy es 04/09/2026—, así que la nota está escrita contra el PDF y lecturas propias, rotuladas como tales; no hay transcripción, y **ningún video de la cátedra toca autenticación remota o SSO** — se verificó por grep sobre los trece videos de la [[videografia|videografía]] y no hay una sola mención a *OAuth*, *OpenID*, *federación* ni *Single Sign-On*.

## Delegar es confiar

*Single Sign-On* consiste en la **delegación de la autenticación** en un sistema externo: en vez de que cada aplicación verifique la identidad por su cuenta —con su propio esquema de la sección [[almacenamiento-de-claves|Almacenamiento de claves]]—, todas confían en que un único sistema ya la verificó y aceptan su veredicto sin volver a pedir la clave.

Esto **implica necesariamente una relación de confianza**, y no es un detalle menor: el sistema que delega renuncia a controlar directamente la parte más sensible de su propio modelo de seguridad —quién es cada principal— y la pone en manos de un tercero. Si ese tercero falla, se compromete o miente, **todos** los sistemas que delegan en él heredan la falla al mismo tiempo. Es el mismo tipo de intercambio —comodidad y consistencia contra un punto único de fallo— que aparece cada vez que se centraliza una función de seguridad, sólo que acá el activo centralizado es la identidad misma.

## Qué hay para delegar

La filmina nombra dos categorías con lógicas de mercado distintas:

- **Productos comerciales**, cada uno con **tecnología propia y no intercambiable** entre sí: *Active Directory Federation Services*, `CAS`, *Siteminder*. Elegir uno de estos ata al sistema al ecosistema de ese proveedor.
- **Tecnologías abiertas**, pensadas para interoperar entre proveedores distintos:
  - **OpenID 1 y 2** — marcadas como **obsoletas** en la propia filmina.
  - **OpenID Connect** — vigente, **construido sobre `OAuth2`**.

La filmina no desarrolla el protocolo de ninguna de las dos, y esta nota tampoco lo hace en profundidad — pero vale la pena una precisión que la filmina no da y que explica por qué la vigente está construida *sobre* la otra.

### Por qué OpenID Connect necesita OAuth2 debajo, y no al revés

**Esto no está en la filmina — es contexto general, no derivado de ninguna fuente de la cátedra, y se lo etiqueta como tal.** `OAuth2` es, en rigor, un protocolo de **autorización**: delega el acceso a un recurso concediendo un token con alcance limitado, sin que el recurso necesite conocer la contraseña original del usuario. No fue diseñado para responder la pregunta *"¿quién es esta persona?"*, y durante años se lo usó igual para eso —de forma informal e insegura— porque conseguir un token ya implicaba que alguien se había autenticado en algún lado. `OpenID Connect` agrega, encima de `OAuth2`, la pieza que faltaba: un **token de identidad** firmado y con formato estándar, que responde explícitamente la pregunta de autenticación en lugar de inferirla de que el flujo de autorización haya terminado bien. Es el motivo por el que la filmina describe una tecnología *"basada en"* la otra, y no dos alternativas al mismo nivel.

## Dónde encaja esto en el resto de la clase

`SSO` es, en el vocabulario de [[autenticacion|Autenticación]], la decisión de mover el componente $L$ —la función que decide si $(a,c)$ es una asociación válida— **fuera** del sistema que necesita el resultado. Todo lo demás que la clase desarrolla —[[factores-de-autenticacion|factores]], [[almacenamiento-de-claves|almacenamiento]], [[ataques-a-un-sistema-de-autenticacion|ataques]], [[challenge-response-y-eke|challenge-response y EKE]]— sigue existiendo, sólo que ahora ocurre **una vez**, adentro del proveedor de identidad, en lugar de repetirse en cada sistema que confía en él.

**Nota sobre la filmina 46, que cierra el deck completo.** Inmediatamente después de ésta, la última filmina del PDF da la lectura recomendada —capítulos 12-13 de *Computer Security: Art and Science*, de Matt Bishop— para el bloque entero de principios y autenticación. Esa filmina y la precisión sobre a qué edición de Bishop corresponde esa numeración de capítulos ya están desarrolladas en [[clase-07-autenticacion#10. Autenticación remota y SSO|Clase 07 — Autenticación § 10. Autenticación remota y SSO]]; no se repite acá para no duplicar el análisis.

## Ver también

- [[clase-07-autenticacion#10. Autenticación remota y SSO|Clase 07 — Autenticación § 10. Autenticación remota y SSO]] — la sección de la que cuelga esta nota, con la precisión completa sobre la lectura recomendada de la filmina 46
- [[autenticacion|Autenticación]] — el formalismo $(A,C,F,L,S)$ del que `SSO` es, en esencia, sacar $L$ afuera del sistema
- [[factores-de-autenticacion|Factores de autenticación]] — lo que el sistema externo termina verificando en nombre de todos los demás
- [[challenge-response-y-eke|Challenge-response y EKE]] — el mecanismo del paso anterior: autenticar directamente contra una clave compartida, la alternativa que `SSO` reemplaza
- [[videografia#Los cuatro huecos del Bloque 2|Videografía § Los cuatro huecos del Bloque 2]] — por qué esta clase, y en particular esta sección, no tiene ningún video de respaldo
- [[bibliografia|Bibliografía]] — Bishop, cap. 13 *Authentication*, lectura designada del bloque
