---
title: Distribución de claves y KDC
resumen: 'El problema de compartir una clave simétrica cuando el único canal es inseguro: una clave por par crece de forma cuadrática y el KDC lo baja a $n$ claves con claves de sesión, a costa de un único punto de falla.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[clase-03-macs-y-cifrado-autenticado]]", "[[intercambio-de-claves]]", "[[cifrado-autenticado]]"]
aliases: [Distribución de claves y KDC, KDC, Key Distribution Center, Trusted Third Party, Clave de sesión, Kerberos]
type: concepto
unidad: 1
clase: 4
orden: 1
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, distribucion-de-claves, kdc, gestion-de-claves, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# Distribución de claves y KDC

**El problema que hace falta resolver antes de poder usar cualquiera de los esquemas simétricos de las clases 2 y 3: cómo llegan $A$ y $B$ a compartir una clave si el único canal que tienen es inseguro.** Es la nota que explica por qué el curso da un giro hacia una maquinaria completamente distinta —la criptografía asimétrica— apenas termina de cerrar el cifrado autenticado.

Sale de las filminas **2 a 5** de la Clase 04. Esta clase todavía no se dictó —hoy es 04/09/2026, la clase es el 10/09— así que la nota está escrita contra el PDF de filminas, más Katz & Lindell y lecturas propias rotuladas; no hay transcripción y por lo tanto ningún callout *De la transcripción*.

## El problema

Un criptosistema `CCA-Secure` —el estándar de la [[clase-03-macs-y-cifrado-autenticado|Clase 03]]— resuelve confidencialidad e integridad entre $A$ y $B$ una vez que ambas partes ejecutan $\mathsf{Enc}_k(M)$ con la **misma** clave $k$. Pero eso presupone lo que hay que construir: **una clave ya compartida**. Y esa clave no se puede mandar por el mismo canal que se quiere proteger —si el canal fuera seguro para transmitir la clave, ya no haría falta cifrar nada—.

La pregunta que abre la filmina 3 es exactamente ésa: *¿cómo se comparten las claves?*

## Dos escenarios, dos costos

**Dos puntos.** Si sólo hay que resolver el problema entre $A$ y $B$, alcanza con un **canal seguro puntual**: una reunión física, un correo cifrado con otra clave que ya se tenga, un mensajero de confianza. Es un costo que se paga una sola vez.

**Múltiples puntos ($n$).** Cuando el sistema tiene $n$ participantes que potencialmente necesitan hablar entre sí de a pares, el mismo truco deja de escalar y aparecen dos estrategias con estructura de costo muy distinta.

### Estrategia 1 — una clave por combinación

Cada participante administra una clave distinta para cada posible interlocutor: $n-1$ claves por parte. El total de claves en el sistema es la cantidad de pares no ordenados de $n$ elementos:

$$\binom{n}{2} = \frac{n(n-1)}{2}$$

Es **cuadrático en $n$**. Con $n=10$ ya son $45$ claves; con $n=1000$, casi medio millón. Cada participante nuevo obliga a distribuir una clave con **todos** los que ya estaban, así que el costo de agregar gente crece con el tamaño del sistema, no con una constante.

### Estrategia 2 — un punto único de confianza

La alternativa es introducir una entidad central —un ***Trusted Third Party***— con la que cada participante comparte **una sola** clave fija. El total de claves en el sistema pasa a ser **lineal**, $n$ claves para $n$ entidades, sin importar cuántos pares distintos necesiten comunicarse.

Esa entidad, instanciada como protocolo, es el **KDC** (*Key Distribution Center*, filminas 4-5).

## KDC — Key Distribution Center

Un KDC comparte una clave fija con cada participante del sistema: $k_a$ con $A$, $k_b$ con $B$, $k_c$ con $C$, etc. Cuando $A$ quiere hablar con $C$:

1. $A$ envía un pedido al KDC.
2. El KDC genera una **clave de sesión** nueva, $k_s$, específica para esa comunicación.
3. El KDC se la envía a las dos partes, cada una cifrada con la clave que comparte con esa parte:

$$\text{KDC} \to A:\ \mathsf{Enc}_{k_a}(k_s) \qquad\qquad \text{KDC} \to C:\ \mathsf{Enc}_{k_c}(k_s)$$

$A$ y $C$ descifran cada uno con su propia clave fija y quedan con $k_s$ en común, sin haberla transmitido nunca en claro y sin que el KDC tenga que repetir el proceso para cada par de la red.

### Qué gana y qué pierde frente a la Estrategia 1

| | Una clave por combinación | KDC |
|---|---|---|
| Claves totales en el sistema | $\binom{n}{2}$, cuadrático | $n$, lineal |
| Claves que administra cada participante | $n-1$ | $1$ (con el KDC) |
| Costo de agregar un participante | Distribuir con todos los existentes | Una clave nueva con el KDC |
| Punto de falla | Ninguno centralizado | **El KDC es un único punto de falla** |

El KDC resuelve el problema de escala al precio de introducir exactamente lo que el diseño distribuido evitaba: si el KDC se compromete, se cae o queda inaccesible, **toda** la red pierde la capacidad de negociar claves de sesión nuevas — y quien compromete al KDC obtiene, de una sola vez, la clave fija de cada participante del sistema.

## Kerberos y Active Directory

La filmina 5 no desarrolla el punto en texto: sólo muestra dos imágenes, un sello con la cabeza de Cerbero —el perro de tres cabezas de la mitología griega, con motivo de meandro griego alrededor— y el logo de Microsoft Active Directory. *(Lectura nuestra.)* Son, respectivamente, el protocolo académico de referencia para KDC —**Kerberos**, que toma su nombre precisamente del guardián de tres cabezas del inframundo, aludiendo a las tres partes involucradas en el protocolo (cliente, servidor y KDC)— y la implementación comercial más difundida de la misma idea, integrada en el ecosistema de Windows Server. La filmina no explica el protocolo Kerberos en sí; lo deja como referencia de que esta arquitectura no es un ejercicio de pizarra, sino la base de la autenticación corporativa más extendida del mundo.

## Por qué esta nota antecede a la criptografía asimétrica

El KDC resuelve la distribución de claves **sin** salir del mundo simétrico: sigue habiendo una clave fija por participante, sólo que administrada centralmente. La [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]] plantea esta sección como motivación y a continuación introduce una alternativa radicalmente distinta —dos claves por participante, una pública y una privada, sin ningún tercero de confianza que reparta secretos—. El KDC y la criptografía asimétrica no son mutuamente excluyentes: en la práctica, el intercambio de claves asimétrico (Diffie-Hellman) y los KDC conviven en protocolos reales, cada uno resolviendo una parte distinta del problema de gestión de claves que retoma la [[clase-05-protocolos-criptograficos|Clase 05]].
