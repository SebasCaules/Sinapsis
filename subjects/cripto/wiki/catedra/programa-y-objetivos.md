---
title: Programa y objetivos
resumen: 'Programa oficial de 72.44: sus dos etapas —primero criptografía, después su aplicación a sistemas—, los cinco objetivos de aprendizaje, los contenidos por bloque y la metodología del curso.'
fuentes: ["[[cronograma]]", "[[reglamento-y-evaluacion]]", "[[bibliografia]]"]
aliases: [Programa, Contenidos, Objetivos, Contenidos mínimos]
type: catedra
clase: catedra
orden: 1
created: 2026-08-10
updated: 2026-09-04
tags: [catedra, programa, contenidos, objetivos]
sources: [72.44 - Criptografía y Seguridad.pdf, Reglamento_Cripto.pdf]
---

# Programa y objetivos

> Fuentes: [`72.44 - Criptografía y Seguridad.pdf`](../../raw/material_Catedra/72.44%20-%20Criptograf%C3%ADa%20y%20Seguridad.pdf) (programa oficial) · [`Reglamento_Cripto.pdf`](../../raw/material_Catedra/Reglamento_Cripto.pdf)

## La estructura del curso, en una frase

> El curso se divide en **dos etapas**. La primera está dedicada exclusivamente a adquirir los **conocimientos básicos de criptografía**, que constituyen la base sobre la cual entender las dimensiones de la seguridad. La segunda está dedicada a la **aplicación de esos conceptos en sistemas**, mostrando problemas recurrentes y la composición de las herramientas vistas para lograr un nivel adecuado de seguridad.

Ese corte se refleja en todo: en el [[cronograma]] (parcial 1 = criptografía, parcial 2 = seguridad), en la bibliografía (Katz & Lindell para la primera, Bishop para la segunda) y en la organización de esta wiki.

La materia se dicta en el **primer año del ciclo profesional** y asume alumnos que ya pueden construir aplicaciones funcionalmente completas: busca **introducir requisitos no funcionales de seguridad en cada etapa del ciclo de desarrollo**.

---

## Objetivos de aprendizaje

1. Comprender las **herramientas criptográficas básicas** y su ámbito de aplicación en problemas de **confidencialidad e integridad**.
2. **Utilizar eficazmente** algoritmos y protocolos criptográficos existentes para garantizar requerimientos de seguridad.
3. Comprender y poder **especificar los requerimientos de seguridad** de un sistema.
4. Participar en un **análisis de vulnerabilidades o test de penetración**, y comprender los resultados de un informe de ese tipo.
5. **Detectar y corregir** problemas típicos de aplicaciones respecto de seguridad.

> Los objetivos 2 y 3 marcan el tono: la materia no busca que se invente criptografía, sino que se sepa **elegir y componer** primitivas existentes, y que se sepa **decir qué propiedad de seguridad se necesita**.

---

## Contenidos

### Bloque 1 — Criptografía (Clases 1-5 · Guías 1-4 · 1er parcial)

| Tema | Dónde se ve | Conceptos en la wiki |
|---|---|---|
| Introducción a la criptografía | [[clase-01-introduccion-y-criptografia-clasica\|Clase 1]] | [[criptosistema\|Criptosistema]] · [[principio-de-kerckhoffs\|Kerckhoffs]] |
| Criptosistemas clásicos · One-time pad · Modelos teóricos | Clase 1 | [[cifrado-por-rotacion\|Rotación]] · [[cifrado-de-sustitucion-monoalfabetica\|Sustitución]] · [[cifrado-de-vigenere\|Vigenère]] · [[cifrado-por-transposicion\|Transposición]] · [[secreto-perfecto\|Secreto perfecto]] |
| Criptosistemas simétricos de flujo y de bloque · Medios de encadenamiento | [[clase-02-cifrado\|Clase 2]] | [[one-time-pad\|One Time Pad]] · [[seguridad-computacional\|Seguridad computacional]] · [[criptosistema-de-flujo\|Flujo]] · [[generador-pseudoaleatorio\|PRG]] · [[pruebas-de-indistinguibilidad\|Indistinguibilidad]] · [[cifrado-probabilistico-nonce-e-iv\|Nonce e IV]] · [[primitiva-de-cifrado-en-bloque\|Bloque]] · [[modos-de-encadenamiento\|Modos]] · [[des-y-3des\|DES/3DES]] · [[aes\|AES]] · [[estado-de-un-criptosistema\|Estado]] · [[eleccion-de-primitivas\|Elección de primitivas]] |
| Integridad: MACs y funciones de hash | [[clase-03-macs-y-cifrado-autenticado\|Clase 3]] | [[maleabilidad\|Maleabilidad]] · [[ataque-de-texto-cifrado-escogido\|CCA]] · [[message-authentication-code\|MAC]] · [[seguridad-de-un-mac\|Seguridad de un MAC]] · [[cbc-mac\|CBC-MAC]] · [[funciones-de-hash-criptograficas\|Funciones de hash]] · [[resistencias-de-una-funcion-de-hash\|Resistencias]] · [[construccion-de-merkle-damgard\|Merkle-Damgård]] · [[primitivas-de-hash-estandar\|Primitivas de hash]] · [[hmac\|HMAC]] · [[seguridad-de-las-funciones-de-hash\|Seguridad de los hash]] |
| Cifrado autenticado: composición de cifrado y MAC *(no es una línea del programa — fila nuestra)* | [[clase-03-macs-y-cifrado-autenticado\|Clase 3]] | [[privacidad-e-integridad\|Privacidad e integridad]] · [[cifrado-autenticado\|Cifrado autenticado]] · [[ccm-y-gcm\|CCM y GCM]] |
| Criptografía asimétrica: cifrado y firma digital | Clase 4 | pendiente |
| Manejo de claves: generación, distribución, almacenamiento, intercambio | Clase 5 / Guía 4 | pendiente |
| Protocolos criptográficos | Clase 5 | pendiente |

> **Cómo se arma esta tabla, y las dos costuras que destapó la Clase 3.** La regla es **una fila por línea del programa oficial**, en su orden; la columna *Conceptos* se llena a medida que el material se ingiere. Los 14 conceptos nuevos no entraron limpio, y las dos decisiones son nuestras:
>
> - **`03.01` y `03.02` no son integridad**, aunque los dicte la Clase 3. La [[maleabilidad]] y el [[ataque-de-texto-cifrado-escogido|ataque de texto cifrado escogido]] **cierran el tema de arriba**: son el ataque que rompe los criptosistemas simétricos de la Clase 2, y en [[bibliografia|Katz & Lindell]] caen en el **capítulo 3**, no en el 4. Quedan en la fila de integridad porque ahí es donde se dictan, pero el tema del que hablan es el anterior.
> - **El cifrado autenticado no tiene línea propia en el programa.** Las filminas 36-40 componen cifrado y MAC en un único criptosistema y bajan a `CCM` y `GCM`: son tres conceptos que sí se dictan y que *"Integridad: MACs y funciones de hash"* no nombra. Antes que perderlos dentro de esa fila, va una fila aparte **marcada como agregado nuestro**.
>
> **La Clase 3 está ingerida entera**, con sus **dos** sesiones y las dos transcripciones: el 27/08 llegó hasta el `CBC-MAC` (`03.01` a `03.05`, filminas 1-21) y el 03/09 cubrió de las funciones de hash al cifrado autenticado (`03.06` a `03.14`, filminas 22-41). A esos catorce se suman cinco conceptos que **no salen de la teoría**: el `03.15` lo introduce el Ej. 6 de la [[guia-03-mac-y-funciones-de-hash|Guía 3]], y el `03.16` al `03.19` salen de lo que el docente dijo fuera de filmina y de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del 31/08. El detalle está en la [[clase-03-macs-y-cifrado-autenticado|nota de clase]].
>
> Sin fila siguen `02.13` a `02.17` —el [[teoria-de-numeros|andamiaje matemático]] y la [[notacion-y-terminologia|notación]]—: la cátedra los **encarga** pero el programa no los lista, así que su lugar es el [[indice|índice]] y no esta tabla, que espeja al programa.

### Bloque 2 — Seguridad (Clases 6-11 · Guías 5-10 · 2do parcial)

| Tema | Dónde se ve |
|---|---|
| Introducción a la seguridad informática · aspectos fundamentales · objetivos | Clase 6 |
| Políticas de seguridad: generalidades, confidencialidad, integridad, modelos híbridos, composición | Clase 6 |
| Control de acceso: ACLs, capacidades, L&K | Clase 6 / Guía 6 |
| Identidad, representación de identidad, certificados, anonimato | Clase 7 |
| Autenticación: challenge-response, biometría, múltiples factores | Clase 7 / Guía 7 |
| Seguridad en aplicaciones · principios de diseño seguro | Clase 8 |
| Flujo de información · confinamiento · canales ocultos · problemas frecuentes | Clase 9 / Guía 8 |
| Programas malignos (malware) | Clase 9 |
| Verificación · auditorías · penetration testing · análisis de vulnerabilidades | Clase 8 / Guía 9 |
| Seguridad en la empresa · protección de datos | Clases 10-11 / Guía 10 |

### Contenidos mínimos (plan de estudios)

> Criptografía Clásica y Moderna. Métodos simétrico y asimétrico. Algoritmos: encriptación y hashing. Protocolos: VPNs, PGP, HTTPS. Aplicaciones: dinero electrónico, voto electrónico. Seguridad en bases de datos, sistemas operativos y redes. Auditoría y peritaje en seguridad.

---

## Metodología

- **Enfoque basado en resolución de problemas**, con problemas similares a los del campo profesional.
- **Clases teóricas** (jueves): modelos teóricos y su aplicación.
- **Clases prácticas** (lunes): ejercitación, en papel o computadora según el tema.
- **Proyecto integrador**: implementación de una función de seguridad **no estudiada en la materia**, construida a partir de los conceptos aprendidos → ver [[tp-implementacion|TP]].

### Herramientas que se usan

Demostraciones en vivo con software específico y prácticas sobre computadora:

- **John The Ripper** (cracking de passwords)
- **OpenSSL** — Guía 5
- **JCE** (Java Cryptography Extension) — Guía 5
- **GCC** / JVM para los ejercicios de programación

## Ver también

- [[cronograma|Cronograma]] · [[reglamento-y-evaluacion|Reglamento y evaluación]] · [[bibliografia|Bibliografía]]
