---
title: Guía 4 — Manejo de claves, cifrado asimétrico y firma digital
resumen: 'Los dieciocho ejercicios de la Guía 4 con enunciado y resolución en la misma página: protocolos con claves de sesión y sus ataques, Diffie-Hellman a tres y firmado, firma digital contra MAC, certificados con OpenSSL de punta a punta, la PKI argentina, y los tres ejercicios de seguridad demostrable sobre CCA y textbook RSA.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[clase-05-protocolos-criptograficos]]", "[[clase-03-macs-y-cifrado-autenticado]]"]
aliases: [Guía 4, Guia 4, Manejo de claves, Resolución Guía 4, Guia 4 resolucion, Soluciones Guía 4]
type: guia
clase: 4
orden: 21
guia: 4
fecha: 2026-09-14
created: 2026-09-14
updated: 2026-09-14
tags: [guia, resolucion, protocolos, claves-de-sesion, replay, man-in-the-middle, diffie-hellman, firma-digital, certificados, openssl, pki, cca, rsa, tls]
sources: ["raw/guias/guia4/Guia 4 - Manejo de claves - Cifrado Asimétrico - Firma Digital.pdf", "Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT", "raw/clases/Clase 05 - Protocolos.pdf"]
---

# Guía 4 — Manejo de claves, cifrado asimétrico y firma digital

> **lun 14/09/2026** (mismo día: consultas del 1er parcial) · [Enunciado](../../raw/guias/guia4/Guia%204%20-%20Manejo%20de%20claves%20-%20Cifrado%20Asim%C3%A9trico%20-%20Firma%20Digital.pdf) (6 páginas, 18 ejercicios) · Teoría: [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04 — Criptografía asimétrica y firma digital]] y [[clase-05-protocolos-criptograficos|Clase 05 — Protocolos criptográficos]]
> **Resolución:** los **18 ejercicios**, plegados debajo de cada enunciado. Los tres de `OpenSSL` están **corridos de verdad**, con la salida pegada.

Esta nota reúne **los enunciados de la Guía 4 transcriptos y su resolución**, con el concepto que destraba cada uno. La cuenta hecha va en un **aviso plegado debajo de cada ejercicio**, que se abre con un clic: primero se intenta, después se mira.

> **La guía es de este año.** El encabezado dice **2026** en las seis páginas, como la Guía 1 y la Guía 2 —y a diferencia de la [[guia-03-mac-y-funciones-de-hash|Guía 3]], que decía 2025—. Es la guía más larga de las cuatro: dieciocho ejercicios contra seis u ocho de las anteriores. *(Verificado sobre los encabezados del PDF; el `pdfinfo` la fecha el 31/07/2026.)* **No hay PDF de soluciones de la cátedra** en `raw/` para esta guía: todo lo que sigue es resolución nuestra, contrastada contra las notas de concepto, Katz & Lindell y —para los tres ejercicios de investigación— las fuentes primarias que se citan en cada uno.

---

## Cómo leer esta guía

### Las notaciones que fija el recuadro del enunciado

La guía abre con un cuadro de convenciones que vale para los dieciocho ejercicios, y conviene tenerlo a mano porque los enunciados lo usan sin repetirlo:

| Notación | Qué es |
|---|---|
| $K_{sx}$ · $K_{px}$ | clave **privada** y clave **pública** de $x$ |
| $E_x(M)$ · $D_x(C)$ | cifrar con la pública de $x$ · descifrar con la privada de $x$ |
| $S_x(M)$ · $V_x$ | firmar con la privada de $x$ · verificar con la pública de $x$ |
| $K_{xy}$ o $K_s$ | clave de sesión compartida entre $x$ e $y$ |
| $\{M\}_{K_S}$ | cifrado **simétrico** de $M$ con $K_S$ |
| **Mallory** · **Eve** | atacante **activo** · atacante **pasivo** |

Es la notación de la [[clase-05-protocolos-criptograficos|Clase 05]] y de Bishop, no la de Katz & Lindell: llaves para el cifrado simétrico, subíndice para la clave. Y la pareja Mallory/Eve es la distinción **activo/pasivo** que [[modelos-de-ataque|Modelos de ataque]] fija desde la Clase 01 y que [[ataques-activos-y-man-in-the-middle|Ataques activos y man in the middle]] convierte en los cuatro poderes del atacante.

### Once de dieciocho ejercicios son de una clase que todavía no se dictó

La guía se practica el **lunes 14/09**, entre la Clase 04 (jueves 10/09, dictada) y la Clase 05 (jueves 17/09). Y **la mayoría de sus ejercicios son material de la Clase 05**:

| Ejercicios | De qué clase sale la teoría | Estado al 14/09 |
|---|---|---|
| 6 · 8 · 16 · 17 | **Clase 04** — Diffie-Hellman, firma digital contra MAC, `RSA-Signature`, maleabilidad de `RSA` | **dictada**, con transcripción |
| 15 | **Clase 03** y **Práctica 03** — el juego `CCA` y la construcción `CPA`-segura sobre una PRF | dictada |
| 1 · 2 · 3 · 4 · 5 · 7 · 9 | **Clase 05** — ataques a protocolos, claves de sesión, Needham-Schroeder, Diffie-Hellman autenticado | **anticipada**: nota escrita sólo contra las filminas |
| 10 · 11 · 12 · 13 · 14 | **Clase 05** — certificados, cadenas de firma, PKI; más `OpenSSL` y la ley argentina | anticipada |
| 18 | **Clase 05** — `TLS` | anticipada |

> **Qué dice esa columna** *(precisión nuestra)*. Indica de qué clase sale **la teoría que hace falta para atacar cada ejercicio**, no que la guía la presuponga: los ejercicios de protocolos se resuelven con las ideas de la Clase 04 —claves de sesión, KDC, firma digital, *man in the middle*— más el sentido común que la Clase 05 va a formalizar. Es el mismo fenómeno que la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] adelantándose tres días a la teoría del hash, pero a mayor escala: acá la práctica se adelanta **una semana entera** a once de sus dieciocho ejercicios. Las notas de concepto de la Clase 05 existen desde el 04/09 y están escritas contra el PDF; cuando la clase se dicte, habrá que volver sobre las resoluciones que citan filminas.

> **Y no es la práctica que el docente anunció.** Al cerrar el repaso de álgebra el 10/09, Abad dijo que *"en la práctica probablemente repasemos con algunos ejercicios básicos, especialmente de aritmética"* (cue 298). **No hay un solo ejercicio de aritmética en la guía**: nada de Euclides, inversos modulares, ejemplos numéricos de `RSA` ni de El Gamal. Lo más cerca que está de una cuenta es el Ej. 6, y es una cuenta en exponentes. Si esos ejercicios existen, no están en `raw/`.

### Tres familias, y un ejercicio de cada clase anterior

Los dieciocho ejercicios se ordenan por tema, y el orden del PDF los respeta:

- **Protocolos y manejo de claves (1 a 9).** Ataques con nombre, claves de sesión que viajan mal, autenticación mutua con nonces, Needham-Schroeder, Diffie-Hellman a tres y firmado, y el protocolo de clave pública de Trent. Es el bloque que va a caer en el **Ejercicio 1 del parcial**, que según los [[parciales-viejos|cuatro parciales viejos]] es **siempre** un protocolo.
- **Firma digital, certificados y PKI (10 a 14, más el 8).** Del laboratorio de `OpenSSL` —solicitud, autocertificado, una CA propia que firma— a la red de confianza de PGP y la infraestructura de firma digital argentina.
- **Seguridad demostrable (15, 16, 17).** Tres ejercicios cortos de *"mostrar que este esquema no es seguro"*, uno por cada clase de criptografía: un cifrado `CPA`-seguro que no es `CCA`-seguro, `RSA` para firma sin hash, y `RSA` para cifrado ante `CCA`. Son los que más se parecen al **segundo ejercicio** de los parciales viejos —*"¿este esquema sigue siendo seguro?"*—.
- **`TLS` (18).** Un ejercicio de investigación que cierra la guía con el protocolo donde todo lo anterior se junta.

### Erratas y rarezas del PDF

| Dónde | Dice | Debería decir |
|---|---|---|
| Ej. 12, paso 4 | *"De manera análoga al **ejercicio 6**, se creará un requerimiento de certificado"* | **ejercicio 10**, que es el que crea la solicitud. Es una referencia arrastrada de una versión anterior de la guía, donde los ejercicios de `OpenSSL` tenían otra numeración |
| Ej. 8, a) y b) | *"**Trasferir** \$1000 a Mark"* | *Transferir* — errata de tipeo, repetida en los dos ítems |
| Ej. 11 | *"lo **autocerficarás**"* · Ej. 13 *"La notación de **cerificados**"* | *autocertificarás* · *certificados* |
| Ej. 3 | $S_A\{N_1, K_s\}$, con llaves | el recuadro reserva las llaves para cifrado simétrico; una firma es $S_A(N_1, K_s)$. Y como se ve en la resolución, **la confusión de notación es el problema del ejercicio** |
| Ej. 4 | $(N_2)_{K_s}$ y $(N_1)_{K_s}$, con paréntesis | $\{N_2\}_{K_s}$, cifrado simétrico según el recuadro |
| Ej. 10 y 12 | sinopsis de `openssl req` y `openssl x509` | son de **OpenSSL 1.0.x**: `-md2`, `-mdc2`, `-asn1-kludge`, `-engine` ya no existen o están retirados en 3.x. Los comandos que se piden corren igual; el detalle en cada ejercicio |

*(Verificado sobre las páginas renderizadas, no sobre el texto extraído: las fórmulas de los Ej. 15, 16 y 17 y los dos archivos de configuración del Ej. 12 son objetos que `pdftotext` no devuelve, y se transcribieron a mano desde el render.)*

---

## Tablero de estado

Los **dieciocho** ejercicios están resueltos más abajo, en el aviso plegado que sigue a cada enunciado; la columna *Estado* linkea a cada uno.

| # | Tema | Concepto que aplica | Estado |
|---|---|---|---|
| 1 | Cuatro ataques a protocolos, con ejemplo y contramedida | [[ataques-de-repeticion-y-frescura\|Repetición y frescura]] · [[ataques-activos-y-man-in-the-middle\|Ataques activos]] · [[needham-schroeder\|Needham-Schroeder]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 1\|resuelto]] |
| 2 | Interceptar la clave pública en el primer mensaje | [[ataques-activos-y-man-in-the-middle\|Ataques activos]] · [[infraestructura-de-clave-publica\|PKI]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 2\|resuelto]] |
| 3 | Una clave de sesión firmada en vez de cifrada | [[firma-digital\|Firma digital]] · [[criptosistema-asimetrico\|Criptosistema asimétrico]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 3\|resuelto]] |
| 4 | Autenticación mutua con nonces y el ataque por reflexión | [[ataques-de-repeticion-y-frescura\|Repetición y frescura]] · [[challenge-response-y-eke\|Challenge-response]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 4\|resuelto]] |
| 5 | La variante de Needham-Schroeder con nonce de Bob | [[needham-schroeder\|Needham-Schroeder]] · [[denning-sacco-y-frescura\|Denning-Sacco y frescura]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 5\|resuelto]] |
| 6 | Diffie-Hellman entre tres | [[diffie-hellman\|Diffie-Hellman]] · [[grupos-anillos-y-cuerpos\|Grupos]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 6\|resuelto]] |
| 7 | Diffie-Hellman firmado, y el ataque que sobrevive a las firmas | [[diffie-hellman\|Diffie-Hellman]] · [[ataques-activos-y-man-in-the-middle\|Man in the middle]] · [[certificados-digitales\|Certificados]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 7\|resuelto]] |
| 8 | Firma digital contra MAC, en cuatro escenarios | [[firma-digital\|Firma digital]] · [[message-authentication-code\|MAC]] · [[ataques-de-repeticion-y-frescura\|Repetición]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 8\|resuelto]] |
| 9 | El protocolo de Trent con claves públicas, y el masquerading de Bob | [[certificados-digitales\|Certificados]] · [[denning-sacco-y-frescura\|Denning-Sacco]] · [[firma-digital\|Firma digital]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 9\|resuelto]] |
| 10 | Una solicitud de certificado con `openssl req` | [[certificados-digitales\|Certificados]] · [[x509\|X.509]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 10\|corrido]] |
| 11 | Autocertificarse, y comparar con la solicitud | [[cadenas-de-firmas-y-autoridades-raiz\|Autoridades raíz]] · [[x509\|X.509]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 11\|corrido]] |
| 12 | Una CA propia que firma el certificado de un usuario | [[cadenas-de-firmas-y-autoridades-raiz\|Cadenas de firmas]] · [[x509\|X.509]] · [[revocacion-y-listas-crl\|Revocación]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 12\|corrido]] |
| 13 | Nivel de confianza en la firma de Fred, red de confianza | [[cadenas-de-firmas-y-autoridades-raiz\|Cadenas de firmas]] · [[confianza-y-aseguramiento\|Confianza]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 13\|resuelto]] |
| 14 | La infraestructura de firma digital argentina | [[firma-digital\|Firma digital]] · [[infraestructura-de-clave-publica\|PKI]] · [[cadenas-de-firmas-y-autoridades-raiz\|AC raíz]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 14\|investigado]] |
| 15 | Un cifrado `CPA`-seguro que no es `CCA`-seguro | [[ataque-de-texto-cifrado-escogido\|CCA]] · [[maleabilidad\|Maleabilidad]] · [[practica-03-seudoaleatoriedad-y-modos\|Práctica 03]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 15\|resuelto]] |
| 16 | Textbook `RSA` para firma: el ataque de no mensaje | [[rsa-signature-y-hashed-rsa\|RSA-Signature]] · [[firma-digital\|Sig-forge]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 16\|resuelto]] |
| 17 | Textbook `RSA` para cifrado no es `CCA`-seguro | [[rsa\|RSA]] · [[maleabilidad\|Maleabilidad]] · [[pkcs1-y-tamano-de-claves\|PKCS#1]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 17\|resuelto]] |
| 18 | `TLS`: fases, `AEAD`, `HKDF` y cuatro Verdadero/Falso | [[tls-arquitectura-y-record\|TLS: arquitectura y record]] · [[tls-handshake\|TLS handshake]] · [[suites-criptograficas-de-tls\|Suites]] · [[ccm-y-gcm\|AEAD]] | [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 18\|investigado]] |

---

> [!nota]- Cómo está resuelta esta guía
> Esta nota reúne **las cuentas hechas de la Guía 4**, con el razonamiento completo y no sólo el resultado. Los dieciocho ejercicios están resueltos de punta a punta; los tres de `OpenSSL` están **corridos con `OpenSSL 3.6.2`** y la salida pegada; los dos de investigación —la PKI argentina y `TLS`— están contestados contra **fuentes primarias**: los certificados raíz descargados y leídos con `openssl x509`, el sitio del Ente Licenciante, el texto de la Ley 25.506, y las RFC de `TLS`.
>
> **Ojo con una diferencia respecto de la Guía 1 y la Guía 3.** Esta guía **no tiene PDF de soluciones de la cátedra** ni transcripción propia. Todo lo que sigue es resolución nuestra. Las únicas partes con respaldo directo de la cátedra son las que la voz del 10/09 tocó: el ataque multiplicativo a `RSA-Signature` del Ej. 16 (cues 1143-1145), la necesidad de un canal autenticado para Diffie-Hellman que motiva el Ej. 7 (cues 677-692), el argumento del no repudio del Ej. 8 (cues 1099-1112) y la ley de firma digital del Ej. 14 (cues 1113-1129).
>
> Cada resolución va **plegada debajo del enunciado** correspondiente, y arranca con el resumen en cursiva de lo que se pide. Los protocolos se escriben con la notación del recuadro de la guía.
>
> ### Tablero: qué destraba cada ejercicio
>
> | Ej. | Lo que se pregunta | El concepto que lo destraba |
> |---|---|---|
> | 1-5 | Ataques a protocolos con clave de sesión, y cómo se evitan | **frescura** —nonce o timestamp— y **atar cada mensaje a quién lo manda**: [[ataques-de-repeticion-y-frescura\|Repetición y frescura]] · [[needham-schroeder\|Needham-Schroeder]] |
> | 6-7 | Diffie-Hellman a tres, y firmado | la conmutatividad de los exponentes, y que una firma sin identidad no ata nada: [[diffie-hellman\|Diffie-Hellman]] |
> | 8-9 | Qué da una firma que un MAC no, y qué no da una firma sola | verificación pública, no repudio, y que **la firma no dice a quién va dirigido el mensaje**: [[firma-digital\|Firma digital]] |
> | 10-12 | El laboratorio de certificados | qué es una solicitud, qué es un certificado, quién firma a quién: [[certificados-digitales\|Certificados]] · [[cadenas-de-firmas-y-autoridades-raiz\|Cadenas de firmas]] |
> | 13-14 | Confianza: la red de PGP y la jerarquía argentina | dos formas de cortar la recursión "¿quién firma al que firma?": [[cadenas-de-firmas-y-autoridades-raiz\|Autoridades raíz]] |
> | 15-17 | Tres esquemas que no son seguros | el molde del parcial: **exhibir el adversario** que gana `CCA` o `Sig-forge`: [[ataque-de-texto-cifrado-escogido\|CCA]] · [[rsa-signature-y-hashed-rsa\|RSA-Signature]] |
> | 18 | `TLS` | dónde se juntan intercambio de claves, certificados y cifrado autenticado: [[tls-handshake\|TLS handshake]] |

---

## Enunciados

### Ejercicio 1

Escribe un ejemplo de los siguientes ataques que pueden darse contra un protocolo. ¿Pueden evitarse?

1. **Replay**
2. **Key Reuse**
3. **Man in the middle**
4. **Masquerading** (suplantación de identidades)

> Los cuatro nombres son los que la [[clase-05-protocolos-criptograficos|Clase 05]] va a usar para catalogar lo que sale mal en un protocolo, y **tres de ellos ya tienen ejemplo en el vault**: *replay* y *key reuse* son exactamente los dos problemas de la [[needham-schroeder#Primera aproximación, y por qué no alcanza|primera aproximación de Needham-Schroeder]], y *man in the middle* es el ataque que [[diffie-hellman#En la práctica: el problema del atacante activo|Diffie-Hellman]] no resiste. El cuarto, la suplantación, es lo que el ataque a la [[needham-schroeder#El ataque: una clave de sesión vieja alcanza|segunda aproximación]] logra. La pregunta *"¿pueden evitarse?"* es la parte con contenido: la respuesta es sí para los cuatro, pero **con mecanismos distintos**, y conviene decir cuál.

> [!nota]- Resolución del Ejercicio 1
> *Un ejemplo de cada uno de cuatro ataques a un protocolo —replay, key reuse, man in the middle, masquerading— y si pueden evitarse.*
>
> La idea que ordena los cuatro: **un protocolo no falla porque la primitiva falle, sino porque un mensaje válido se usa en un contexto para el que no fue emitido** — en otro momento, en otra sesión, entre otras partes. Cada ataque es una forma de sacar un mensaje de su contexto, y cada contramedida es una forma de **atar el mensaje a su contexto**.
>
> ### 1. Replay (repetición)
>
> **Ejemplo.** Alice le envía al banco $\{\text{transferir } \$1000 \text{ a Bob}\}_{K_s}$, cifrado y autenticado con una clave que sólo ella y el banco conocen. Eve graba el mensaje y lo reenvía cien veces. El banco descifra, verifica que la integridad es correcta —lo es: el mensaje es auténtico—, y ejecuta cien transferencias. Eve no rompió ninguna clave ni falsificó nada: **el mensaje es exactamente el que Alice mandó**. El mismo patrón, sobre autenticación: grabar el intercambio con el que Alice se autenticó ante un servidor y reproducirlo para entrar como Alice.
>
> **Por qué las primitivas no lo impiden.** Ni el cifrado ni el MAC tienen estado: un par $(m, t)$ válido lo es para siempre, y el experimento `Mac-Forge` deja el reenvío afuera por definición, porque $m$ ya está en $Q$ → [[ataques-de-repeticion-y-frescura#Por qué Mac-Forge no captura el replay|Por qué Mac-Forge no captura el replay]].
>
> **Se evita** con **frescura**: algo en el mensaje que no pueda repetirse. Un **nonce** que el receptor eligió y espera de vuelta (los $r_1$, $r_2$ de Needham-Schroeder), un **número de secuencia** que el receptor lleva, o un **timestamp** con una ventana de aceptación (Denning-Sacco). Las tres tienen su costo → [[ataques-de-repeticion-y-frescura#La respuesta no vive en la primitiva: vive en el protocolo|La respuesta no vive en la primitiva]].
>
> ### 2. Key reuse (reuso de clave)
>
> **Ejemplo.** En la primera versión de Needham-Schroeder, el KDC le manda a Alice $\{K_s\}_{K_A} \Vert \{K_s\}_{K_B}$. Eve graba ese mensaje. La próxima vez que Alice pida una clave de sesión, Eve **intercepta la respuesta fresca del KDC y le reinyecta la vieja**: Alice y Bob terminan usando de nuevo la $K_s$ de la semana pasada sin saberlo. Si esa clave se filtró después de la sesión anterior —un backup, un log—, Eve lee la conversación nueva. Un segundo ejemplo, del lado de las primitivas: reusar la clave de un one-time pad, o el par $(k, IV)$ en un modo de cifrado, que es *key reuse* al nivel del cifrado y no del protocolo → [[one-time-pad|One Time Pad]], [[cifrado-probabilistico-nonce-e-iv|nonce e IV]].
>
> **Se evita** atando la clave a la ejecución: el nonce $r_1$ que Alice manda en el pedido y que el KDC devuelve **dentro** del mensaje cifrado, para que una respuesta vieja no coincida con ningún pedido nuevo → [[needham-schroeder#Segunda aproximación: agregar un nonce|Segunda aproximación]]. Y por política: claves de sesión de un solo uso, con vencimiento, que es lo que las vuelve *de sesión*.
>
> ### 3. Man in the middle
>
> **Ejemplo.** Diffie-Hellman sin autenticación. Alice manda $g^{x}$ hacia Bob; Mallory lo intercepta y le entrega a Bob $g^{m}$; Bob responde $g^{y}$, Mallory lo intercepta y le entrega a Alice $g^{m}$. Alice cree compartir $g^{xm}$ con Bob, Bob cree compartir $g^{ym}$ con Alice, y las dos claves las tiene Mallory, que descifra, lee, modifica y vuelve a cifrar todo el tráfico. Ninguno de los dos nota nada, porque cada uno recibió exactamente el tipo de mensaje que esperaba → [[diffie-hellman#En la práctica: el problema del atacante activo|el ataque paso a paso]]. El mismo ejemplo, con claves públicas en lugar de exponentes, es el Ej. 2.
>
> **Se evita** **autenticando** los mensajes del intercambio: firmando $g^{x}$ y $g^{y}$ con claves cuyos certificados cada parte puede verificar (Ej. 7 — con la letra chica de que la firma tiene que incluir a quién va dirigida), o corriendo el intercambio sobre un canal que ya sea autenticado (un MAC con una clave previa). Lo que **no** lo evita es más matemática: el logaritmo discreto sigue intacto durante todo el ataque.
>
> ### 4. Masquerading (suplantación de identidad)
>
> **Ejemplo.** Eve consiguió una clave de sesión vieja $K_s$ de Alice con Bob, y el ticket $\{A, K_s\}_{K_B}$ que la acompañaba. Le manda el ticket a Bob; Bob responde con su desafío $\{r_2\}_{K_s}$; Eve, que conoce $K_s$, contesta $\{r_2 - 1\}_{K_s}$. Bob queda convencido de estar hablando con Alice → [[needham-schroeder#El ataque: una clave de sesión vieja alcanza|el ataque a la segunda aproximación]]. Otro ejemplo, sin clave comprometida: el Ej. 9, donde **Bob** se hace pasar por Alice ante Carol reenviando un mensaje que Alice firmó para él.
>
> **Se evita** con **autenticación con frescura** en cada sentido —que cada parte pruebe conocer un secreto **sobre un desafío nuevo**—, con **certificados** que atan una clave pública a un nombre, y con mensajes firmados o cifrados que **incluyan la identidad del destinatario**, para que un mensaje emitido para Bob no valga ante Carol.
>
> ### ¿Pueden evitarse?
>
> **Sí, los cuatro, y la receta es la misma con distinto ingrediente**: cada mensaje del protocolo tiene que llevar, protegido, **cuándo** se emitió (frescura: nonce, secuencia o timestamp), **para qué ejecución** (el nonce del pedido dentro de la respuesta), **de quién a quién** (identidades adentro de lo firmado o cifrado) y **con qué clave** (certificados que aten claves a nombres). Lo que no se puede es evitarlos *gratis*: cada mecanismo tiene su costo —relojes sincronizados, estado en el receptor, una PKI— y cada uno protege contra un ataque y no contra los otros. Un protocolo bien diseñado los combina; los ejercicios que siguen muestran, uno por uno, qué pasa cuando falta alguno.

### Ejercicio 2

Considera el siguiente protocolo para enviar un texto plano $M$ entre $A$ y $B$:

$$\begin{aligned}
&1)\ A \to B:\ \{K_{pA}\}\\
&2)\ B \to A:\ \{K_{pB}\}\\
&3)\ A \to B:\ \{E_B(M)\}\\
&4)\ B \to A:\ \{E_A(M)\}
\end{aligned}$$

Si un adversario ($Z$) intercepta el **primer** mensaje, ¿cómo hace para obtener el texto plano $M$?

> El enunciado dice *"intercepta el primer mensaje"* y **sólo el primero**: no hace falta tocar el segundo ni el tercero. La pista está en el mensaje 4, que es el que parece de cortesía —¿para qué le devuelve $B$ el mensaje a $A$?— y es el que entrega $M$. Es el [[ataques-activos-y-man-in-the-middle#El problema de origen: ¿de dónde sale una clave pública? (filmina 5)|problema de origen de la clave pública]] en su forma más limpia: una clave pública que llega por el canal no dice de quién es.

> [!nota]- Resolución del Ejercicio 2
> *Un protocolo en el que $A$ y $B$ intercambian sus claves públicas en claro y después $A$ le manda $M$ cifrado para $B$, y $B$ se lo devuelve cifrado para $A$. Si $Z$ intercepta el primer mensaje, ¿cómo obtiene $M$?*
>
> ### El ataque
>
> $Z$ se pone entre $A$ y $B$ y **reemplaza la clave pública de $A$ por la suya** en el primer mensaje. No necesita hacer nada más:
>
> $$\begin{aligned}
> &1)\ A \to Z:\ K_{pA} \qquad\qquad Z \to B:\ \mathbf{K_{pZ}} \quad\text{(“ésta es la clave de } A\text{”)}\\
> &2)\ B \to A:\ K_{pB} \qquad\qquad\text{(}Z\text{ lo deja pasar tal cual)}\\
> &3)\ A \to B:\ E_B(M) \qquad\qquad\text{(}Z\text{ lo ve pasar y no puede abrirlo: no tiene } K_{sB}\text{)}\\
> &4)\ B \to A:\ E_{\mathbf{Z}}(M) \qquad\ \ \text{(}B \text{ cifra “para } A\text{” con la clave que cree de } A\text{)}
> \end{aligned}$$
>
> En el paso 4, $B$ hace exactamente lo que el protocolo le indica: devolver $M$ cifrado con la clave pública de $A$. Pero **la clave pública que $B$ tiene registrada como de $A$ es $K_{pZ}$**, así que $B$ calcula $E_Z(M)$ y $Z$, interceptando el cuarto mensaje, lo descifra con $K_{sZ}$ y obtiene $M$. $A$ no nota nada si $Z$ vuelve a cifrar $M$ con la verdadera $K_{pA}$ y se lo reenvía.
>
> **Por qué alcanza con el primer mensaje.** El mensaje 3 viaja cifrado para el verdadero $B$ y $Z$ no puede leerlo; lo que lo entrega es el **eco** del mensaje 4. Si $Z$ además interceptara el mensaje 2 y sustituyera $K_{pB}$ por $K_{pZ}$, tendría el ataque completo de *man in the middle* y leería $M$ ya en el mensaje 3 — pero el enunciado pregunta por lo mínimo, y lo mínimo es el primer mensaje.
>
> ### Qué falló, en una frase
>
> **Una clave pública que llega por el canal no trae ninguna prueba de a quién pertenece.** El protocolo confunde *"recibí una clave pública"* con *"tengo la clave pública de $A$"*, y el cifrado asimétrico, por más `CPA`-seguro que sea, cifra para **quien tenga la privada correspondiente**, sea quien sea. Es el problema que la [[infraestructura-de-clave-publica|PKI]] existe para resolver: hace falta un **certificado** —la clave pública atada a un nombre por una firma de alguien en quien $B$ confía— o un canal previo autenticado por el que la clave llegue. Sin eso, "cifrar para $A$" es cifrar para quien haya dicho ser $A$ primero.
>
> *(De paso: el mensaje 4 es además un defecto de diseño por sí mismo. Devolver el texto plano cifrado para el otro no autentica nada —cualquiera que tenga $K_{pA}$ puede producir $E_A(M)$— y duplica la exposición de $M$. Si la intención era que $A$ confirme que $B$ recibió $M$, lo que corresponde es un acuse firmado, o un hash de $M$ bajo una clave de sesión.)*

### Ejercicio 3

¿Cuál es el problema con el siguiente protocolo? Solucionarlo.

$$\begin{aligned}
&1)\ A \to B:\ S_A\{N_1, K_s\}\\
&2)\ B \to A:\ \{N_1 + 1\}_{K_s}
\end{aligned}$$

> La notación del enunciado es la trampa: $S_A\{\cdot\}$ es **firma** —$S_x$ es "firma con clave privada de $x$" según el recuadro—, y una firma **no oculta nada**. Conviene releer qué garantiza y qué no garantiza una firma en [[firma-digital#El mismo objetivo que un MAC, con otra clave|Firma digital]] antes de contestar: integridad y origen sí; confidencialidad, nunca.

> [!nota]- Resolución del Ejercicio 3
> *$A$ le envía a $B$ un nonce y una clave de sesión **firmados** con su clave privada; $B$ responde con el nonce incrementado, cifrado con la clave de sesión. ¿Cuál es el problema? Solucionarlo.*
>
> ### El problema: la clave de sesión viaja en claro
>
> $S_A(N_1, K_s)$ es una **firma**, no un cifrado. Una firma digital es un par $(m, \sigma)$ donde $m$ viaja en claro y $\sigma = \mathsf{Sign}_{K_{sA}}(m)$ es lo que cualquiera con $K_{pA}$ puede verificar; la propiedad de la firma es la **verificación pública**, y su contenido es, por definición, público. Así que el mensaje 1 le dice a todo el que escuche el canal: *"$A$ propone la clave de sesión $K_s$, y lo garantiza"*. Eve, pasiva, lee $K_s$, y con ella descifra el mensaje 2 y todo lo que $A$ y $B$ se digan después.
>
> Es exactamente el error conceptual del que el docente advirtió el 10/09 —las dos claves no son intercambiables, y usar la privada para "proteger" algo no da confidencialidad— visto desde el lado de la firma: **firmar no es cifrar** → [[criptosistema-asimetrico#Las dos claves no son intercambiables|Las dos claves no son intercambiables]].
>
> Hay un segundo problema, consecuencia del primero: el mensaje 2 pretende que $B$ demuestre conocer $K_s$ devolviendo $N_1 + 1$ cifrado. Pero como $K_s$ es pública, **cualquiera** puede producir $\{N_1+1\}_{K_s}$: el mensaje 2 no autentica a $B$. Y un tercero: nada en el mensaje 1 dice **para quién** es $K_s$ ni **cuándo** se emitió; Mallory puede grabarlo y reenviárselo a $B$ —o a $C$— más tarde, y la firma de $A$ seguirá siendo válida.
>
> ### La solución
>
> La clave de sesión tiene que viajar **cifrada para $B$**, y la firma tiene que cubrir **quién es el destinatario** y algo **fresco** de $B$. Una versión corregida:
>
> $$\begin{aligned}
> &0)\ B \to A:\ N_B \qquad\qquad\qquad\qquad\qquad\quad\text{(un desafío fresco de } B\text{)}\\
> &1)\ A \to B:\ E_B\bigl(S_A(A, B, N_B, N_1, K_s)\bigr)\\
> &2)\ B \to A:\ \{N_1 + 1\}_{K_s}
> \end{aligned}$$
>
> Cada pieza cierra un agujero:
>
> - **$E_B(\cdot)$** —cifrar con la pública de $B$ **por afuera** de la firma— hace que sólo $B$ pueda leer $K_s$. Ahora sí el mensaje 2 prueba algo: sólo quien tiene $K_{sB}$ pudo obtener $K_s$, así que $\{N_1+1\}_{K_s}$ autentica a $B$ ante $A$.
> - **$S_A(\cdot)$** con **$A$ y $B$ adentro** ata la clave a las dos partes: un mensaje emitido para $B$ no sirve ante $C$, y nadie puede reemplazar a $A$ como origen sin su clave privada.
> - **$N_B$** —o un timestamp— le da a $B$ la frescura que le faltaba: un mensaje 1 grabado no coincide con ningún desafío nuevo. $N_1$ sigue cumpliendo su función original, que es darle frescura a **$A$** en el mensaje 2.
>
> **Por qué firmar adentro y cifrar afuera, y no al revés.** Si se cifrara primero y se firmara el criptograma, $S_A(E_B(\ldots))$, la firma de $A$ estaría sobre un valor que $A$ no puede probar haber conocido —un tercero podría tomar $E_B(\ldots)$ ajeno y firmarlo como propio—, y $B$ no tendría garantía de que quien conoce el contenido es quien firmó. Firmar el contenido y cifrar la firma es el orden canónico (*sign-then-encrypt*), y es exactamente la forma del mensaje 3 del [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 9|Ej. 9]], $E_B(S_A(K_s, \mathrm{time}_A))$ — con la salvedad, que ese ejercicio muestra, de que sin la identidad de $B$ adentro de la firma **sigue habiendo un ataque**.

### Ejercicio 4

Considera el siguiente protocolo de autenticación mutua en el cual $A$ y $B$ se autentican mutuamente intercambiando 4 mensajes:

$$\begin{aligned}
&1)\ A \to B:\ N_1\\
&2)\ B \to A:\ N_2\\
&3)\ A \to B:\ \{N_2\}_{K_s}\\
&4)\ B \to A:\ \{N_1\}_{K_s}
\end{aligned}$$

Donde:

- $N_1$ y $N_2$ son números generados en forma aleatoria (*nonce*)
- $A$ y $B$ son los ID de las partes intervinientes
- $K_s$ es una clave simétrica ya compartida entre $A$ y $B$

$A$ autentica con éxito a $B$ al recibir el cuarto mensaje y $B$ autentica con éxito a $A$ al recibir el tercer mensaje. Como $K_s$ es una clave ya compartida entre $A$ y $B$ solamente, cualquiera que encripte un mensaje usando $K_s$ se asegura que posee $K$ y por lo tanto queda autenticado.

**¿Qué situación NO debe permitir $A$ para evitar que un tercero no autorizado se autentique correctamente?**

> Es un *challenge-response* simétrico en las dos direcciones → [[challenge-response-y-eke#El protocolo challenge-response|Challenge-response]]. El razonamiento del enunciado —*"cualquiera que cifre con $K_s$ posee $K_s$"*— es correcto; lo que no dice es **quién eligió lo que se cifró**. La pregunta apunta a un ataque con nombre propio, la **reflexión**, y a la observación de que en este protocolo el que inicia **prueba primero**: [[ataques-de-repeticion-y-frescura#El cuadro completo: reordenamiento, repetición y reflexión|El cuadro completo: reordenamiento, repetición y reflexión]] trae la familia.

> [!nota]- Resolución del Ejercicio 4
> *Autenticación mutua con dos nonces y una clave compartida: cada parte prueba conocer $K_s$ cifrando el nonce de la otra. ¿Qué situación no debe permitir $A$ para que un tercero no se autentique?*
>
> ### La observación que abre el ataque
>
> El mensaje 3 es $A$ cifrando **un valor que eligió $B$** —o quien diga ser $B$—, y lo hace **antes** de que la otra parte haya probado nada. O sea que, ante cualquiera que inicie un diálogo con ella como responder, $A$ funciona como un **oráculo de cifrado con $K_s$**: le mandan $X$ como "$N_2$" y $A$ devuelve $\{X\}_{K_s}$. La clave no se filtra, pero se puede obtener el cifrado de **cualquier valor elegido**. Y lo único que un impostor necesita para autenticarse ante $A$ como $B$ es, precisamente, $\{N_1\}_{K_s}$ para un $N_1$ que $A$ eligió.
>
> ### El ataque por reflexión
>
> Mallory ($M$) quiere que $A$ la acepte como $B$. Necesita que $A$ inicie dos sesiones —lo normal si $A$ es un cliente que abre varias conexiones, o un servidor que se autentica ante varios pares—:
>
> $$\begin{aligned}
> \textbf{Sesión 1}\quad &1)\ A \to M\text{ (como } B):\ N_1\\
> &2)\ M \to A:\ N_2 \qquad\text{(cualquier valor)}\\
> &3)\ A \to M:\ \{N_2\}_{K_s}\\
> &\quad\ \ A \text{ espera } \{N_1\}_{K_s};\ M \text{ no puede producirlo… todavía}\\[6pt]
> \textbf{Sesión 2}\quad &1')\ A \to M\text{ (como } B):\ N_1'\\
> &2')\ M \to A:\ \mathbf{N_1} \qquad\text{(el nonce de la sesión 1, reflejado como si fuera su } N_2'\text{)}\\
> &3')\ A \to M:\ \{N_1\}_{K_s} \qquad\text{(}A\text{ cifra, obediente, el nonce que le mandaron)}\\[6pt]
> \textbf{Sesión 1}\quad &4)\ M \to A:\ \{N_1\}_{K_s} \qquad\text{(copiado del mensaje } 3'\text{)}
> \end{aligned}$$
>
> $A$ recibe en la sesión 1 exactamente lo que esperaba, $\{N_1\}_{K_s}$, y **autentica a $M$ como $B$** sin que $M$ conozca $K_s$. La sesión 2 queda inconclusa —$M$ nunca manda su mensaje 4'—, pero ya no importa. $M$ usó a $A$ como oráculo para que le cifrara su propio nonce.
>
> ### La situación que A no debe permitir
>
> **$A$ no debe cifrar, como respuesta a un desafío, un valor que ella misma emitió como desafío y que todavía está pendiente en otra sesión** — o sea, no debe aceptar que el $N_2$ que le mandan coincida con un $N_1$ propio en curso, y en general **no debe correr sesiones en paralelo con la misma clave** mientras una está sin cerrar. En ambas formulaciones la regla es la misma: **$A$ no puede ser oráculo de cifrado de valores ajenos bajo $K_s$**, porque cifrar con $K_s$ es lo que, en este protocolo, vale como prueba de identidad.
>
> ### Cómo se arregla el protocolo, para no depender de esa disciplina
>
> Que la seguridad dependa de que $A$ "no permita una situación" es frágil. La corrección estándar es que **lo que se cifra diga quién lo cifra y en qué rol**, para que un mensaje producido en una sesión no sirva en otra:
>
> $$3)\ A \to B:\ \{B, N_2\}_{K_s} \qquad\qquad 4)\ B \to A:\ \{A, N_1\}_{K_s}$$
>
> Ahora $A$ sólo cifra bloques que llevan el nombre de **su interlocutor** en la posición de destinatario, y lo que $M$ obtendría en la sesión 2 es $\{B, N_1\}_{K_s}$, que no es lo que $A$ espera en la sesión 1 ($\{A, N_1\}_{K_s}$). Con las identidades adentro, la reflexión muere; es la forma que adopta la norma ISO/IEC 9798-2 para este mismo esquema *(precisión nuestra, fuera de la guía)*. Alternativas equivalentes: usar **claves distintas por dirección** —$K_{AB}$ para lo que cifra $A$ y $K_{BA}$ para lo que cifra $B$, como hace [[sesion-y-conexion-tls#Por qué las claves son distintas por dirección|TLS]]— o que el responder pruebe primero.
>
> **La lección transferible.** Un nonce da frescura, pero no dice **de quién es ni para qué sesión**. Un protocolo donde una parte cifra valores elegidos por la otra sin más contexto está regalando un oráculo, y el ataque por reflexión es la forma más barata de cobrarlo: no hace falta romper nada, sólo devolverle a $A$ su propia pregunta.

### Ejercicio 5

En el protocolo original de Needham Schroeder, cuando se roban claves de sesión es posible un ataque de replay.

La siguiente es una variante del protocolo de Needham Schroeder:

$$\begin{aligned}
&1.\ \text{Alice} \to \text{Bob}:\ \text{Alice}\\
&2.\ \text{Bob} \to \text{Alice}:\ \{\text{Alice}, \mathrm{rand}_X\}_{K_{BT}}\\
&3.\ \text{Alice} \to \text{Trent}:\ \{\text{Alice}, \text{Bob}, \mathrm{rand}_A, \{\text{Alice}, \mathrm{rand}_X\}_{K_{BT}}\}\\
&4.\ \text{Trent} \to \text{Alice}:\ \{\text{Alice}, \text{Bob}, \mathrm{rand}_A, k_{\mathrm{session}}, \{\text{Alice}, \mathrm{rand}_X, k_{\mathrm{session}}\}_{K_{TB}}\}_{K_{AT}}\\
&5.\ \text{Alice} \to \text{Bob}:\ \{\text{Alice}, \mathrm{rand}_X, k_{\mathrm{session}}\}_{K_{TB}}\\
&6.\ \text{Bob} \to \text{Alice}:\ \{\mathrm{rand}_B\}_{K_s}\\
&7.\ \text{Alice} \to \text{Bob}:\ \{\mathrm{rand}_B - 1\}_{K_s}
\end{aligned}$$

Mostrar que con esta variante se resuelve el problema de ataque de repetición.

> *"El protocolo original"* es la [[needham-schroeder#Segunda aproximación: agregar un nonce|segunda aproximación de Needham-Schroeder]] del deck de la Clase 05, y *"el ataque de replay cuando se roban claves de sesión"* es exactamente [[needham-schroeder#El ataque: una clave de sesión vieja alcanza|el ataque de la filmina 27]]: reenviar un ticket viejo $\{A, k_s\}_{K_B}$ con una $k_s$ comprometida. El vault trae **una** corrección, la de [[denning-sacco-y-frescura|Denning-Sacco]] con timestamp; esta variante es **la otra**, y la comparación entre las dos es la parte que vale.

> [!nota]- Resolución del Ejercicio 5
> *Una variante de Needham-Schroeder en la que Bob, antes de que Alice hable con Trent, le entrega un nonce cifrado para Trent. Mostrar que resuelve el ataque de repetición con claves de sesión robadas.*
>
> ### Dónde estaba el agujero
>
> En el protocolo original, el ticket que Bob recibe —$\{A, k_s\}_{K_{TB}}$— **no lleva nada que Bob haya elegido**. Bob no participó antes de recibirlo, así que no tiene contra qué comprobar si es de esta ejecución o de una de hace un mes. El nonce $r_1$ protege a Alice (viaja en su pedido y vuelve en la respuesta de Trent), pero **la frescura es asimétrica**: hay para un extremo y no para el otro → [[needham-schroeder#Por qué el nonce de la segunda aproximación no alcanza|Por qué el nonce de la segunda aproximación no alcanza]]. Quien tenga un ticket viejo y su $k_s$ comprometida reenvía el ticket, contesta el desafío de Bob, y Bob lo acepta como Alice.
>
> ### Qué cambia la variante
>
> La variante **hace participar a Bob antes de que exista el ticket**. Los mensajes 1 y 2 son nuevos: Alice anuncia su intención, y Bob responde con un bloque $\{\text{Alice}, \mathrm{rand}_X\}_{K_{BT}}$ que **sólo Trent puede abrir**, con un nonce $\mathrm{rand}_X$ que **Bob acaba de elegir**. Alice no puede leerlo ni modificarlo: lo reenvía tal cual a Trent en el mensaje 3, como un sobre cerrado.
>
> Trent abre el sobre, lee $\mathrm{rand}_X$, y **lo pone adentro del ticket** que fabrica para Bob: $\{\text{Alice}, \mathrm{rand}_X, k_{\mathrm{session}}\}_{K_{TB}}$. Cuando el ticket llega a Bob en el mensaje 5, Bob lo descifra y **compara el $\mathrm{rand}_X$ que trae con el que él mismo emitió en el mensaje 2**. Si coinciden, el ticket fue fabricado por Trent **después** del mensaje 2 de esta ejecución; si no, se descarta.
>
> ### Por qué el replay ya no funciona
>
> Sea $E$ un atacante con un ticket viejo $T_{\text{viejo}} = \{\text{Alice}, \mathrm{rand}_X^{\text{viejo}}, k_s^{\text{viejo}}\}_{K_{TB}}$ y con $k_s^{\text{viejo}}$ comprometida. $E$ intenta el ataque:
>
> 1. $E \to \text{Bob}$: *Alice* (mensaje 1).
> 2. $\text{Bob} \to E$: $\{\text{Alice}, \mathrm{rand}_X^{\text{nuevo}}\}_{K_{BT}}$, con un nonce **fresco**.
> 3. $E$ salta a Trent —no le sirve hablar con él, porque Trent emitiría una $k_s$ nueva que $E$ no conoce— y reenvía directamente el ticket viejo como mensaje 5.
> 4. Bob descifra $T_{\text{viejo}}$ y encuentra $\mathrm{rand}_X^{\text{viejo}} \ne \mathrm{rand}_X^{\text{nuevo}}$. **Rechaza.**
>
> ¿Puede $E$ fabricar un ticket con el nonce nuevo? No: el ticket va cifrado con $K_{TB}$, que sólo Trent y Bob conocen, y $E$ tiene $k_s^{\text{viejo}}$ pero **no** $K_{TB}$. ¿Puede $E$ conseguir que Trent le ponga $\mathrm{rand}_X^{\text{nuevo}}$ a un ticket con $k_s^{\text{viejo}}$? Tampoco: Trent genera $k_{\mathrm{session}}$ fresca en cada ejecución y no acepta claves propuestas. ¿Puede $E$ adivinar $\mathrm{rand}_X^{\text{nuevo}}$? Sólo con probabilidad despreciable, si el nonce es lo bastante largo y aleatorio. **La frescura ahora es simétrica**: $\mathrm{rand}_A$ protege a Alice contra respuestas viejas de Trent (mensaje 4), y $\mathrm{rand}_X$ protege a Bob contra tickets viejos (mensaje 5). Los mensajes 6 y 7 siguen siendo el *challenge-response* de confirmación de clave del protocolo original.
>
> ### Contra Denning-Sacco: nonce o reloj
>
> Las dos correcciones atacan el mismo mensaje —el ticket— con herramientas distintas → [[denning-sacco-y-frescura#Nonce contra timestamp, la comparación que importa|Nonce contra timestamp]]:
>
> | | Denning-Sacco (1981) | Esta variante — Needham y Schroeder (1987) |
> |---|---|---|
> | Qué agrega al ticket | un **timestamp** $T$ | el **nonce** $\mathrm{rand}_X$ elegido por Bob |
> | Qué necesita | **relojes sincronizados** y una ventana de aceptación | **dos mensajes más** al principio (1 y 2) |
> | Qué protección da | acota el ataque a una **ventana** de tiempo: un ticket viejo vale mientras $T$ esté dentro del margen | lo elimina: un ticket viejo **nunca** coincide con un nonce nuevo |
> | Costo | dependencia del reloj, ataques sobre la sincronización | una ida y vuelta extra antes de hablar con Trent |
>
> *(La atribución es precisión nuestra: la variante del enunciado es la que Needham y Schroeder publicaron en 1987 como respuesta a la crítica de Denning y Sacco, y el vault la registra acá por primera vez.)* Es la misma disyuntiva que [[ataques-de-repeticion-y-frescura#Las dos, comparadas|Repetición y frescura]] plantea para un MAC: **frescura por estado del receptor** (un nonce que él eligió y espera) o **por tiempo** (un sello que compara con su reloj). Kerberos, que desciende de Needham-Schroeder, eligió los timestamps.

### Ejercicio 6

Considera el protocolo de intercambio de claves Diffie Hellman y escribe la secuencia de pasos para que en lugar de ser 2 los participantes que generan una clave compartida sean 3.

> Todo lo que hace falta es lo que hace funcionar el protocolo a dos: que los exponentes **conmutan**, $(g^{a})^{b} = (g^{b})^{a}$ → [[diffie-hellman#El protocolo, paso a paso|Diffie-Hellman]]. Con tres partes, la clave que se busca es $g^{abc}$, y la pregunta es cuántas **rondas** hacen falta para que cada uno la calcule sin que ningún exponente viaje.

> [!nota]- Resolución del Ejercicio 6
> *Escribir los pasos de un Diffie-Hellman entre tres participantes.*
>
> ### El protocolo en dos rondas
>
> Parámetros públicos $(G, q, g)$ compartidos. Cada parte sortea su exponente secreto: $A$ elige $a$, $B$ elige $b$, $C$ elige $c$, todos en $\mathbb{Z}_q$. La clave objetivo es $K = g^{abc}$.
>
> $$\begin{aligned}
> \textbf{Ronda 1}\quad &A \to B:\ g^{a} \qquad B \to C:\ g^{b} \qquad C \to A:\ g^{c}\\[4pt]
> \textbf{Ronda 2}\quad &B \to C:\ (g^{a})^{b} = g^{ab} \qquad C \to A:\ (g^{b})^{c} = g^{bc} \qquad A \to B:\ (g^{c})^{a} = g^{ca}\\[4pt]
> \textbf{Cálculo}\quad &A:\ (g^{bc})^{a} = g^{abc} \qquad B:\ (g^{ca})^{b} = g^{abc} \qquad C:\ (g^{ab})^{c} = g^{abc}
> \end{aligned}$$
>
> Cada parte hace lo mismo en cada ronda: **toma lo que recibió y lo eleva a su propio exponente**, y lo pasa al siguiente en el anillo $A \to B \to C \to A$. En la primera ronda circulan los valores de un exponente; en la segunda, los de dos; al final cada uno agrega el tercero y obtiene $g^{abc}$. Que las tres cuentas den lo mismo es la conmutatividad del exponente de siempre: $g^{bca} = g^{cab} = g^{abc}$.
>
> **Qué viaja y qué no.** Por el canal pasan $g^{a}, g^{b}, g^{c}, g^{ab}, g^{bc}, g^{ca}$ — seis mensajes en total, dos por participante. Los exponentes $a, b, c$ nunca se transmiten, y $g^{abc}$ tampoco. Un adversario pasivo ve los seis valores y tiene que producir $g^{abc}$: es una generalización directa del problema Diffie-Hellman, y se cree tan difícil como el de dos partes bajo la misma hipótesis `DDH` *(precisión nuestra: la reducción formal existe, pero no es inmediata)*.
>
> ### Lo que no cambia, y lo que empeora
>
> - **Correctitud**: la condición fundamental $k_A = k_B = k_C$ se cumple por conmutatividad, como a dos.
> - **Costo**: cada parte hace **tres** exponenciaciones (una por ronda más la final) contra dos en el protocolo original, y hay una ronda más de latencia. Con $n$ participantes, este esquema de anillo necesita $n-1$ rondas y $n(n-1)$ exponenciaciones en total: escala mal, y por eso los protocolos de grupo reales usan árboles u otras estructuras *(fuera de la guía)*.
> - **El adversario activo**: sigue sin haber autenticación. Mallory puede interponerse en cualquiera de los seis mensajes y terminar con claves distintas con cada uno, exactamente como en el caso de dos → [[diffie-hellman#En la práctica: el problema del atacante activo|el ataque de man in the middle]]. Tres partes no arreglan lo que dos no arreglaban; el Ej. 7 es el que intenta arreglarlo.
>
> *(Nota al margen, fuera de la guía: existe un Diffie-Hellman a tres en **una sola ronda** —cada parte publica un único valor—, el protocolo de Joux de 2000, pero necesita una estructura algebraica extra, los emparejamientos bilineales sobre curvas elípticas, que no tiene ningún grupo de esta materia. Para más de tres partes en una ronda no se conoce nada práctico.)*

### Ejercicio 7

Considera un protocolo normal de intercambio de claves Diffie–Hellman con autenticación. El objetivo es proveer autenticación mutua con intercambio de claves. Asumimos que cada parte tiene una clave privada para firmar en algún esquema de firma y un certificado con la correspondiente clave pública. El protocolo procede de la siguiente manera:

$$\begin{aligned}
&1)\ A \to B:\ g^{x}\\
&2)\ B \to A:\ \{B,\ \mathrm{cert}_B,\ S_B(g^{x}, g^{y}),\ g^{y}\}\\
&3)\ A \to B:\ \{A,\ \mathrm{cert}_A,\ S_A(g^{x}, g^{y})\}
\end{aligned}$$

Finalmente, Alice y Bob pueden calcular la clave compartida y secreta $K = g^{xy}$.

**a)** Explicar el por qué de las firmas en el protocolo anterior.

**b)** Mostrar que un atacante activo, Mallory, puede interferir con el protocolo mediante un ataque *man in the middle* tal que al final tendremos la siguiente situación:

- Alice cree que se está comunicando de forma segura con Bob
- Pero Bob cree que se está comunicando de forma segura con Mallory

> Es *"la implementación de Diffie-Hellman con todo"* que el docente prometió para la Clase 05 (cue 691): el intercambio de claves más firmas más certificados. Y el (b) es la parte sorprendente: **aun con las firmas, hay un ataque**, y no requiere romper ninguna. Fijarse qué es exactamente lo que cada firma cubre, y qué no.

> [!nota]- Resolución del Ejercicio 7
> *Diffie-Hellman donde cada parte firma el par $(g^{x}, g^{y})$ y adjunta su certificado. a) ¿Para qué están las firmas? b) Mostrar un man in the middle en el que Alice cree hablar con Bob pero Bob cree hablar con Mallory.*
>
> ### a) Para qué están las firmas
>
> Diffie-Hellman sin nada es seguro sólo contra un adversario **pasivo**: un atacante activo reemplaza $g^{x}$ y $g^{y}$ por valores propios y termina compartiendo una clave con cada víctima → [[diffie-hellman#En la práctica: el problema del atacante activo|el ataque clásico]]. El protocolo requiere, en palabras del paper original y de la clase, **un canal autenticado** (cues 679-688).
>
> Las firmas son ese canal. $S_B(g^{x}, g^{y})$ le prueba a Alice que **quien conoce $K_{sB}$ vio exactamente estos dos valores** —el $g^{x}$ que ella mandó y el $g^{y}$ que recibe— y los avala. Si Mallory hubiera reemplazado $g^{x}$ por $g^{m}$ en el mensaje 1, Bob habría firmado $(g^{m}, g^{y})$, y Alice, al verificar la firma contra el $g^{x}$ que ella mandó, la rechazaría. Simétricamente, $S_A(g^{x}, g^{y})$ le prueba a Bob que Alice avala el mismo par. Y **los certificados** son lo que ata cada clave de verificación a un nombre: sin $\mathrm{cert}_B$, Alice tendría una firma válida bajo una clave pública cualquiera, que es el problema del Ej. 2 → [[certificados-digitales#Cómo se usa un certificado: las cuatro operaciones|Certificados digitales]].
>
> En resumen: la firma **ata los valores efímeros a una identidad**, y eso es lo que impide la sustitución de $g^{x}$ o $g^{y}$. Con las firmas verificadas, $K = g^{xy}$ sólo la pueden calcular quienes conocen $x$ e $y$: Alice y Bob.
>
> ### b) El ataque que sobrevive a las firmas
>
> **La firma cubre los valores, pero no dice para quién son.** $S_A(g^{x}, g^{y})$ certifica que Alice avala el par; no certifica que Alice esté hablando **con Bob**. Y $g^{x}$, $g^{y}$ son públicos: **cualquiera** puede firmarlos con su propia clave. Ahí entra Mallory, que tiene su propio certificado $\mathrm{cert}_M$ legítimo:
>
> $$\begin{aligned}
> &1)\ A \to M:\ g^{x} \qquad\qquad\qquad\qquad\qquad\ \ M \to B:\ g^{x} \qquad\text{(lo reenvía tal cual)}\\
> &2)\ B \to M:\ \{B, \mathrm{cert}_B, S_B(g^{x}, g^{y}), g^{y}\} \qquad M \to A:\ \{B, \mathrm{cert}_B, S_B(g^{x}, g^{y}), g^{y}\} \qquad\text{(tal cual)}\\
> &3)\ A \to M:\ \{A, \mathrm{cert}_A, S_A(g^{x}, g^{y})\} \qquad\quad M \to B:\ \{\mathbf{M}, \mathbf{\mathrm{cert}_M}, \mathbf{S_M(g^{x}, g^{y})}\}
> \end{aligned}$$
>
> Mallory deja pasar los mensajes 1 y 2 sin tocarlos, y **reemplaza el mensaje 3 entero**: quita la identidad, el certificado y la firma de Alice, y pone los suyos. Como $g^{x}$ y $g^{y}$ son los que Bob ya vio, $S_M(g^{x}, g^{y})$ es una firma válida de Mallory sobre el par correcto, y $\mathrm{cert}_M$ es un certificado legítimo. Bob verifica todo y concluye: *"estoy hablando con Mallory, y compartimos $g^{xy}$"*.
>
> Del lado de Alice, el mensaje 2 llegó intacto, con la firma y el certificado de Bob sobre el par correcto: *"estoy hablando con Bob, y compartimos $g^{xy}$"*.
>
> **El resultado.** Alice y Bob comparten de verdad la clave $K = g^{xy}$ —Mallory no la conoce, no tiene $x$ ni $y$— pero **Bob la atribuye a Mallory**. Es la situación exacta del enunciado. Lo que Mallory gana no es leer el tráfico sino **la atribución**: todo lo que Alice mande cifrado con $K$, Bob lo va a tomar como venido de Mallory. Si Alice envía *"depositá mi sueldo en esta cuenta"*, Bob acredita la orden a Mallory; si el protocolo se usa para autenticar un pago, el pago de Alice queda registrado a nombre de Mallory. En la literatura se lo llama **ataque de mala atribución de identidad** (*identity misbinding*, o *unknown key-share*): las partes acuerdan una clave, pero no acuerdan **con quién** *(precisión nuestra; el nombre no está en la guía)*.
>
> ### Qué le falta al protocolo
>
> Que la firma incluya **la identidad del interlocutor**: $S_A(g^{x}, g^{y}, \mathbf{B})$ y $S_B(g^{x}, g^{y}, \mathbf{A})$. Entonces Mallory no puede reemplazar el mensaje 3 sin firmar $(g^{x}, g^{y}, B)$ como si fuera Alice, y Bob detectaría que la firma que recibe de "Mallory" declara estar dirigida a $B$ desde $M$ y no desde $A$. Alternativamente, se agrega a cada mensaje un **MAC bajo la clave derivada** de $g^{xy}$ sobre la identidad del emisor —así lo hace el protocolo STS (*Station-to-Station*) y la familia SIGMA que usan `IKE` y, en espíritu, `TLS 1.3`—: como Mallory no conoce $g^{xy}$, no puede fabricar ese MAC *(precisión nuestra)*. Las dos soluciones dicen lo mismo que el Ej. 3 y el Ej. 4: **lo que se firma o cifra tiene que decir de quién a quién**.
>
> ### Por qué es el ejercicio más importante de la guía
>
> Porque muestra que **"firmar los mensajes" no es sinónimo de "autenticar el protocolo"**. Las firmas del enunciado son válidas, los certificados son válidos, el logaritmo discreto sigue intacto, y el protocolo falla igual, porque la firma responde a la pregunta *"¿quién avala estos valores?"* y el protocolo necesitaba *"¿quién avala estos valores, para hablar con quién?"*. Es la pregunta que el `TLS` real contesta con la firma sobre **toda la transcripción** del handshake, identidades incluidas → [[tls-handshake#Parte 4 (filminas 42-43): Change Cipher Spec y Finish, en las dos direcciones|TLS handshake]].

### Ejercicio 8

En este problema se comparan los servicios que provee la firma digital y los códigos de autenticación de mensajes (MAC).

Se asume que Oscar puede observar los mensajes que Alice y Bob se envían, pero no conoce ninguna clave, salvo las públicas.

Determinar si el ataque se puede detectar o proteger con la **Firma Digital**, con el código de autenticación **MAC**, con ambos o con ninguno. Clasificar el tipo de ataque (*man in the middle*, *replay*, *message integrity*, *cheating*, etc.)

**a)** Alice envía un mensaje $x = $ *"Transferir \$1000 a Mark"* en plano y también envía $\mathrm{sign}(x)$ a Bob. Oscar intercepta el mensaje y reemplaza *"Mark"* con *"Oscar"*. ¿Puede Bob detectar esto?

**b)** Alice envía un mensaje $x = $ *"Transferir \$1000 a Oscar"* en plano y también envía $\mathrm{sign}(x)$ a Bob. Oscar observa el mensaje y la firma y lo reenvía 100 veces a Bob. ¿Puede Bob detectar esto?

**c)** Oscar afirma que él envió un mensaje $x$ con firma válida $\mathrm{sign}(x)$ a Bob. Alice afirma que fue ella. ¿Puede Bob dirimir la cuestión?

**d)** Bob dice que recibió un mensaje $x = $ *"Transferir \$1000 de Alice a Bob"* con firma válida $\mathrm{sign}(x)$ de parte de Alice. Pero Alice dice que ella nunca mandó eso. ¿Puede Alice aclarar su situación?

> Es el ejercicio que la clase del 10/09 resolvió en voz sin saberlo: las tres propiedades que separan una firma de un MAC —verificación pública, transferibilidad, **no repudio**— están argumentadas desde la clave compartida en [[firma-digital#Transferibilidad y no repudio, argumentados desde la clave compartida|Firma digital]] (cues 1099-1112). Los cuatro ítems son un recorrido por qué protege cada primitiva y **qué no protege ninguna**; conviene contestar cada uno **dos veces**, una con firma y una con MAC.

> [!nota]- Resolución del Ejercicio 8
> *Cuatro escenarios entre Alice, Bob y Oscar; para cada uno, si se detecta o protege con firma digital, con MAC, con ambos o con ninguno, y qué tipo de ataque es.*
>
> El marco: una **firma** se genera con $K_{sA}$ y se verifica con $K_{pA}$, que Oscar conoce; un **MAC** se genera y se verifica con una clave $k$ que **sólo Alice y Bob** conocen. Las dos dan integridad y autenticación de origen; se separan en quién puede verificar y en quién pudo haber generado.
>
> | | Firma digital | MAC | Tipo de ataque |
> |---|---|---|---|
> | **a)** Oscar cambia *Mark* por *Oscar* | **Detecta**: $\mathsf{Vrfy}_{K_{pA}}(x', \sigma) = 0$, porque $\sigma$ es firma de $x$ y no de $x'$ | **Detecta**: $\mathsf{Vrfy}_k(x', t) = 0$ por la misma razón | **Modificación del mensaje** (*message integrity*), un atacante activo en el medio |
> | **b)** Oscar reenvía $(x, \sigma)$ cien veces | **No detecta**: las cien copias verifican, son el mensaje auténtico de Alice | **No detecta**: ídem | **Repetición** (*replay*) |
> | **c)** Oscar dice que $x$ lo mandó él; Alice dice que fue ella | **Dirime**: Bob verifica $\sigma$ con $K_{pA}$; si pasa, sólo quien tiene $K_{sA}$ pudo producirla, y Oscar no la tiene. Con $K_{pO}$ no verifica | **Dirime para sí, no ante terceros**: Oscar no conoce $k$, así que no pudo generar $t$; pero Bob no puede probarle eso a un juez, porque él mismo también pudo | **Suplantación / engaño** (*cheating*, *masquerading*) |
> | **d)** Bob dice que Alice firmó $x$; Alice lo niega | **No puede aclararlo**: si $\sigma$ verifica con $K_{pA}$, la firma la produjo $K_{sA}$; su única defensa es probar que la clave fue comprometida | **Sí puede**: la etiqueta $t$ la pudo haber generado **Bob**, que tiene la misma $k$; Bob no puede demostrar lo contrario | **Repudio** (*cheating*): el conflicto no es de un atacante externo sino entre las partes |
>
> ### Lo que muestran los cuatro, en orden
>
> **a) Integridad: las dos la dan.** Es el servicio básico, y por eso las dos primitivas existen. Cualquier bit cambiado en $x$ hace fallar la verificación, con firma o con MAC; Oscar puede modificar, pero no sin que se note.
>
> **b) Frescura: ninguna la da.** Reenviar un mensaje auténtico **no es una falsificación**: el par $(x, \sigma)$ es exactamente el que Alice emitió, y ni `Sig-forge` ni `Mac-Forge` lo consideran un ataque, porque $x$ ya fue firmado. La protección no vive en la primitiva sino en el **protocolo**: un número de secuencia, un nonce del receptor, un timestamp o un identificador de transacción dentro de $x$, para que la segunda copia sea rechazada → [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]]. Un banco que ejecuta cien transferencias porque las cien están bien firmadas no tiene un problema de firma: tiene un problema de diseño.
>
> **c) Autenticación de origen ante Bob: las dos; ante un tercero, sólo la firma.** Con MAC, Bob *sabe* que no fue Oscar —Oscar no tiene $k$—, pero lo sabe por un razonamiento que descansa en que Bob no lo generó él, cosa que sólo Bob puede saber. Con firma, la evidencia es **pública**: cualquiera con $K_{pA}$ y $K_{pO}$ ve cuál verifica. Es la **verificación pública**.
>
> **d) No repudio: sólo la firma lo da, y por eso Alice no puede zafar.** Es el espejo del (c). Con MAC, Alice tiene una defensa perfecta: *"Bob también tiene la clave; lo pudo haber fabricado él"* — y es cierto, y no hay forma de refutarlo. Con firma, no: la firma sólo la produce $K_{sA}$, que Alice tenía que custodiar. Es exactamente el argumento del docente (cues 1107-1112): *"si dos personas comparten la clave, yo no puedo garantizar cuál de las dos generó un MAC; con las firmas digitales, la clave secreta queda en manos de una sola entidad"*. Y es la propiedad con peso legal: la presunción de autoría del artículo 7 de la Ley 25.506 → [[firma-digital#El marco legal: firma registrada, presunción de validez y la ley argentina|El marco legal]]. La única salida de Alice sería demostrar que su clave privada estaba comprometida al momento de la firma —lo que la ley prevé vía la **revocación** del certificado, y por eso importa la fecha en que se revocó → [[revocacion-y-listas-crl|Revocación y listas CRL]].
>
> **La tabla que hay que llevarse**: integridad y autenticación ante el receptor, **las dos**; verificación por terceros y no repudio, **sólo la firma**; frescura, **ninguna**.

### Ejercicio 9

El siguiente protocolo usa criptografía de clave pública. Trent tiene una base de datos con todas las claves públicas de los participantes.

$$\begin{aligned}
&1)\ A \to T:\ \{A, B\}\\
&2)\ T \to A:\ \{S_T(B, K_{pB}),\ S_T(A, K_{pA})\}\\
&3)\ A \to B:\ \{E_B(S_A(K_s, \mathrm{time}_A)),\ S_T(B, K_{pB}),\ S_T(A, K_{pA})\}
\end{aligned}$$

**a)** Explicar qué hace Bob después del paso 3 para ratificar que puede comunicarse con Alice con seguridad.

**b)** Explicar cómo hace Bob para impersonarse como Alice frente a Carol (*masquerading*).

> $S_T(B, K_{pB})$ es, literalmente, un **certificado**: la clave pública de $B$ atada a su nombre por la firma de un tercero de confianza → [[certificados-digitales#Definición: qué contiene un certificado|Certificados digitales]]. Y el mensaje 3 es el molde *sign-then-encrypt* que el Ej. 3 recomendó — con una omisión. El (b) es la mejor pregunta de la guía: el atacante no es Oscar sino **Bob**, el destinatario legítimo, y no rompe nada.

> [!nota]- Resolución del Ejercicio 9
> *Un protocolo de distribución de clave de sesión con un servidor de claves públicas: Alice pide a Trent los certificados de ambos, y le manda a Bob la clave de sesión firmada y cifrada, junto con los certificados. a) Qué verifica Bob. b) Cómo Bob se hace pasar por Alice ante Carol.*
>
> ### a) Lo que Bob verifica al recibir el mensaje 3
>
> Bob tiene, de antemano, la clave pública de Trent $K_{pT}$ —es la única hipótesis de confianza del protocolo, el equivalente de la [[cadenas-de-firmas-y-autoridades-raiz#El concepto de AC raíz, en una frase|AC raíz]]—. Con eso:
>
> 1. **Verifica los dos certificados** con $K_{pT}$: $V_T(S_T(A, K_{pA}))$ y $V_T(S_T(B, K_{pB}))$. Si pasan, Bob sabe que Trent avala que $K_{pA}$ es la clave de Alice —y confirma que la $K_{pB}$ que circula es la suya—. Ahora tiene la clave pública de Alice **con garantía de origen**, que es lo que le faltaba a $B$ en el Ej. 2.
> 2. **Descifra** el primer bloque con su clave privada: $D_B(E_B(S_A(K_s, \mathrm{time}_A))) = S_A(K_s, \mathrm{time}_A)$. Sólo él podía hacerlo, así que $K_s$ no la vio nadie más en el tránsito.
> 3. **Verifica la firma de Alice** sobre $(K_s, \mathrm{time}_A)$ con la $K_{pA}$ recién validada. Si pasa, la clave de sesión la propuso Alice y nadie la alteró.
> 4. **Comprueba la frescura**: que $\mathrm{time}_A$ esté dentro de una ventana aceptable respecto de su reloj, para descartar que el bloque sea uno viejo reenviado (el mismo mecanismo de [[denning-sacco-y-frescura|Denning-Sacco]], con los mismos requisitos de reloj).
>
> Si los cuatro pasos cierran, Bob concluye: *"Alice, cuya clave certifica Trent, me propuso hace poco la clave $K_s$, y sólo yo la pude leer"*. Y empieza a usar $K_s$.
>
> ### b) Cómo Bob se hace pasar por Alice ante Carol
>
> **Lo que Bob obtuvo en el paso 2 de arriba es un objeto reutilizable**: $S_A(K_s, \mathrm{time}_A)$, la clave de sesión **firmada por Alice**, sin cifrar. Y esa firma **no dice para quién era la clave**. Bob la vuelve a cifrar, pero para Carol:
>
> $$\begin{aligned}
> &1')\ B \to T:\ \{A, C\} \qquad\text{(Bob pide los certificados de Alice y de Carol; Trent se los da a cualquiera)}\\
> &2')\ T \to B:\ \{S_T(C, K_{pC}),\ S_T(A, K_{pA})\}\\
> &3')\ B \to C:\ \{\mathbf{E_C}\bigl(S_A(K_s, \mathrm{time}_A)\bigr),\ S_T(C, K_{pC}),\ S_T(A, K_{pA})\}
> \end{aligned}$$
>
> Carol hace exactamente lo que Bob hizo en el (a): verifica los certificados, descifra con $K_{sC}$, verifica la firma de Alice —**que es válida, porque Alice la hizo**—, comprueba que $\mathrm{time}_A$ es reciente —lo es, si Bob actúa rápido— y concluye que **Alice** le propuso la clave $K_s$. A partir de ahí, todo lo que Carol cifre con $K_s$ "para Alice" lo lee Bob, y todo lo que Bob le mande cifrado con $K_s$ Carol lo atribuye a Alice. Bob no rompió ninguna firma ni ningún cifrado: **reempaquetó un mensaje auténtico para otro destinatario**.
>
> ### Qué falló, y cómo se arregla
>
> Es el mismo defecto del Ej. 7, en el cifrado en vez del intercambio: **la firma de Alice cubre la clave y la hora, pero no la identidad de Bob**. La corrección es de una línea:
>
> $$3)\ A \to B:\ \{E_B\bigl(S_A(K_s, \mathrm{time}_A, \mathbf{B})\bigr),\ \ldots\}$$
>
> Con $B$ adentro de lo firmado, Carol vería una firma de Alice que declara *"esta clave es para Bob"* y la rechazaría, y Bob no puede fabricar $S_A(K_s, \mathrm{time}_A, C)$ sin $K_{sA}$. *(La atribución es precisión nuestra: el protocolo del enunciado es el de clave pública de **Denning y Sacco** de 1981 —el mismo paper del timestamp de Needham-Schroeder—, y el ataque es el que **Abadi y Needham** publicaron en 1994 en sus "principios prudentes para el diseño de protocolos", dos de cuyos principios son exactamente éste: cada mensaje tiene que decir lo que significa por su solo contenido, y si la identidad de una parte es esencial al significado, hay que nombrarla explícitamente.)*
>
> **Las tres lecciones de la guía en un ejercicio.** El timestamp protege contra el replay **tardío** pero no contra el reenvío **inmediato** a otro destinatario (Ej. 5); firmar prueba origen, no destino (Ej. 7); y el atacante más peligroso de un protocolo suele ser **un participante legítimo** que reusa lo que recibió (Ej. 4).

### Ejercicio 10

**Certificados digitales.** Un certificado digital consiste en una clave pública y un identificador o nombre de usuario del dueño de la clave, firmado por una tercera parte confiable (autoridad certificante).

El primer paso para obtener un certificado es crear una **solicitud de certificado**. En dicha solicitud, habrá que incluir la clave privada y otros datos que identifiquen al usuario. Son campos de un nombre X.500. Para ello, usar el comando `req`:

```
openssl req [-inform PEM|DER] [-outform PEM|DER] [-in filename] [-passin
arg] [-out filename] [-passout arg] [-text] [-pubkey] [-noout] [-verify] [-
modulus] [-new] [-rand file(s)] [-newkey rsa:bits] [-newkey dsa:file] [-
newkey alg:file] [-nodes] [-key filename] [-keyform PEM|DER] [-keyout
filename] [-[md5|sha1|md2|mdc2]] [-config filename] [-subj arg] [-
multivalue-rdn] [-x509] [-days n] [-set_serial n] [-asn1-kludge] [-newhdr]
[-extensions section] [-reqexts section] [-utf8] [-nameopt] [-batch] [-
verbose] [-engine id]
```

```
$ openssl req –new –key priv.pem –out solicitud.csr
```

> **Ojo con una imprecisión del enunciado**: dice que en la solicitud *"habrá que incluir la clave privada"*. La clave privada **no va en la solicitud** —nunca sale de la máquina del solicitante—; lo que va es la clave **pública**, y la privada se usa para **firmar** la solicitud. El `-key priv.pem` del comando es eso: la clave con la que se firma, y de la que se extrae la pública. El objeto que se genera es un **CSR** (*Certificate Signing Request*, PKCS#10), y el detalle de qué campos lleva un certificado está en [[x509#Los campos que fija el estándar|X.509]].
>
> La sinopsis es de **OpenSSL 1.0.x** *(precisión nuestra)*: `-md2` y `-mdc2` ya no existen en 3.x, `-asn1-kludge` y `-newhdr` desaparecieron, y `-rand` y `-engine` están retirados. `-new`, `-key`, `-out`, `-subj`, `-x509`, `-days` y `-config` siguen todos. Y los guiones del comando son *en dashes* tipográficos (`–new`) por el procesador de texto: hay que escribirlos como guiones simples (`-new`) o el shell no los reconoce.

> [!nota]- Resolución del Ejercicio 10
> *Crear una solicitud de certificado con `openssl req -new`, a partir de una clave privada.*
>
> **Corrido con `OpenSSL 3.6.2`.** Primero hace falta la clave privada que el enunciado da por existente:
>
> ```
> $ openssl genrsa -out priv.pem 2048
> $ openssl req -new -key priv.pem -out solicitud.csr \
>     -subj "/C=AR/ST=Buenos Aires/L=Buenos Aires/O=ITBA/OU=Cripto 72.44/CN=Sebastian Caules/emailAddress=sebastiancaules5@gmail.com"
> ```
>
> *(Sin `-subj`, el comando pregunta los campos del nombre X.500 uno por uno de forma interactiva —país, provincia, localidad, organización, unidad, nombre común, correo— más un *challenge password* opcional. Con `-subj` se pasan de una vez.)*
>
> **Lo que se obtiene** es un archivo PEM que empieza con `-----BEGIN CERTIFICATE REQUEST-----`, y que `openssl req -in solicitud.csr -noout -text` decodifica así:
>
> ```
> Certificate Request:
>     Data:
>         Version: 1 (0x0)
>         Subject: C=AR, ST=Buenos Aires, L=Buenos Aires, O=ITBA, OU=Cripto 72.44,
>                  CN=Sebastian Caules, emailAddress=sebastiancaules5@gmail.com
>         Subject Public Key Info:
>             Public Key Algorithm: rsaEncryption
>                 Public-Key: (2048 bit)
>                 Modulus: 00:96:02:af:cb:27:18:a0:10:e4:5e:4a:0e:eb:b5: ...
>                 Exponent: 65537 (0x10001)
>         Attributes:
>             (none)
>     Signature Algorithm: sha256WithRSAEncryption
>     Signature Value: ...
> ```
>
> **Cómo leerlo, campo por campo.**
>
> - **`Subject`** es el nombre X.500 del solicitante: los siete campos, en la notación `C`, `ST`, `L`, `O`, `OU`, `CN`, `emailAddress`. Es la **identidad** que el certificado va a atar a la clave.
> - **`Subject Public Key Info`** es **la clave pública** —módulo $n$ de 2048 bits y exponente $e = 65537$, un `RSA` como el de [[rsa|RSA]]—. Es lo que el enunciado llama, mal, "la clave privada": la privada se quedó en `priv.pem` y no aparece.
> - **`Signature`** es la **autofirma de la solicitud** con la clave privada: prueba que quien pide el certificado posee la privada correspondiente a la pública que declara (*proof of possession*). Sin esto, cualquiera podría pedir un certificado sobre la clave pública de otro.
> - **No hay emisor, ni fechas de validez, ni número de serie.** Eso lo pone la autoridad certificante al firmar: la solicitud es sólo la mitad del certificado que aporta el solicitante.
>
> El objeto es un PKCS#10; el `Version: 1` es la única versión que existe de ese formato, no la del certificado.

### Ejercicio 11

Como aún no tenemos autoridad certificante, lo autocertificarás. Te certificarás a vos mismo haciendo:

```
$ openssl req –x509 –key priv.pem –in solicitud.csr –out autocertif.pem
```

Observa las diferencias entre el archivo `solicitud.csr` y `autocertif.pem`.

> Un certificado **autofirmado** es exactamente lo que es una [[cadenas-de-firmas-y-autoridades-raiz#El concepto de AC raíz, en una frase|autoridad raíz]]: alguien que se firma a sí mismo, y en quien se confía —o no— por fuera de la criptografía. La comparación que pide el enunciado es la mejor forma de ver qué agrega una firma de CA a una solicitud.

> [!nota]- Resolución del Ejercicio 11
> *Convertir la solicitud en un certificado autofirmado, y comparar los dos archivos.*
>
> ```
> $ openssl req -x509 -key priv.pem -in solicitud.csr -out autocertif.pem
> Warning: Not placing -key in cert or request since request is used
> Warning: No -copy_extensions given; ignoring any extensions in the request
> ```
>
> *(Los dos avisos son de OpenSSL 3.x: el primero dice que la clave pública se toma de la solicitud y no de `priv.pem`, y el segundo que las extensiones pedidas en el CSR —acá no había ninguna— se ignoran. Ninguno impide nada.)*
>
> **La diferencia que se ve sin decodificar**: la primera línea. `solicitud.csr` empieza con `-----BEGIN CERTIFICATE REQUEST-----` y `autocertif.pem` con `-----BEGIN CERTIFICATE-----`. Son dos objetos distintos, PKCS#10 contra X.509.
>
> **Las diferencias al decodificar** (`openssl x509 -in autocertif.pem -noout -text`), contra la salida del Ej. 10:
>
> | Campo | `solicitud.csr` | `autocertif.pem` |
> |---|---|---|
> | Tipo de objeto | *Certificate Request*, versión 1 | *Certificate*, **versión 3** (X.509v3) |
> | **Serial Number** | no tiene | un número aleatorio de 20 bytes, generado por OpenSSL |
> | **Issuer** | no tiene | `C=AR, ST=Buenos Aires, …, CN=Sebastian Caules` — **el mismo que el Subject**, que es la marca del autofirmado |
> | **Validity** | no tiene | `Not Before: Sep 14 03:28:31 2026 GMT` · `Not After: Oct 14 03:28:31 2026 GMT` — **30 días**, el valor por defecto cuando no se da `-days` |
> | Subject y clave pública | los siete campos, y la clave | **idénticos**: se copiaron de la solicitud |
> | **Extensiones X509v3** | ninguna | `Subject Key Identifier` y `Authority Key Identifier` **con el mismo valor** (`88:35:07:DF:…`), y `Basic Constraints: critical, CA:TRUE` |
> | Firma | del solicitante, sobre la solicitud | del "emisor" —que es el mismo solicitante—, sobre el certificado entero |
>
> **Lo que la comparación enseña.** Un certificado es una solicitud más tres cosas que sólo un emisor puede poner: **quién lo emite**, **cuándo vale** y **un número de serie** con el que revocarlo → [[x509#Los campos que fija el estándar|X.509]]. Y en un autofirmado las tres las pone el propio sujeto, con lo cual el certificado **no aporta ninguna confianza nueva**: dice *"yo afirmo que ésta es mi clave"*, que es exactamente lo que ya decía la solicitud. Su valor es de formato —ya es un X.509 que un programa puede instalar— y de **raíz**: es la forma que tiene una autoridad certificante de existir, porque la cadena de firmas tiene que terminar en alguien que se firma a sí mismo → [[cadenas-de-firmas-y-autoridades-raiz|Cadenas de firmas y autoridades raíz]]. El `CA:TRUE` que OpenSSL 3.x pone por defecto en un autofirmado dice justamente eso: este certificado está preparado para firmar otros. Que alguien confíe en él es una decisión **por fuera** de la criptografía, y ése es el Ej. 12.

### Ejercicio 12

1. Para crear una **CA** (autoridad certificante), será necesario en primer lugar que generes un par de claves privada y pública: `CApriv.key` y `CApub.key`

2. Luego, crea un archivo de texto llamado `CAconf1.cfg` con el siguiente contenido: (parámetros que se usarán para crear certificados digitales)

```
[ req ]
default_bits           = 1024
default_keyfile        = CApriv.key
distinguished_name     = req_distinguished_name
attributes             = req_attributes
x509_extensions        = v3_ca
dirstring_type         = nobmp

[ req_distinguished_name ]
countryName            = Identificador del Pais (2 letras)
countryName_default    = AR
countryName_min        = 2
countryName_max        = 2
localityName           = Localidad (ej., ciudad)
organizationalUnitName = Nombre de unidad organizacional (ej., oficina)
commonName             = Nombre comun (ej., TU nombre)
commonName_max         = 64
emailAddress           = direccion de correo electronico
emailAddress_max       = 40

[ req_attributes ]
challengePassword      = Contrasena para "challenge"
challengePassword_min  = 4
challengePassword_max  = 20

[ v3_ca ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid:always, issuer:always
basicConstraints       = CA:true
```

y el archivo `CAconf2.cfg` (completa los campos de `req_distinguished_name` con los datos de quien será la autoridad certificante)

```
[ req ]
default_bits           = 1024
default_keyfile        = CApriv.key
distinguished_name     = req_distinguished_name
attributes             = req_attributes
prompt                 = no
output_password        = mipassword
x509_extensions        = v3_ca
dirstring_type         = nobmp

[ req_distinguished_name ]
C                      = AR
ST                     = Buenos Aires
L                      = Buenos Aires
O                      = Empresa Ficticia
OU                     = Oficina de SI
CN                     = Ana Arias
emailAddress           = ariasroigana@gmail.com

[ req_attributes ]
challengePassword      = Contrasena para "challenge"
challengePassword_min  = 4
challengePassword_max  = 20

[ v3_ca ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid:always, issuer:always
basicConstraints       = CA:true
```

3. Con estos archivos preparados, crear un **certificado de autoridad** con el siguiente comando:

```
openssl req –new –key CApriv.key –out ca.cer –config CAconf2.cfg –x509 –days 3650
```

Este certificado digital está autofirmado (por la misma CA). Tiene una duración de 10 años.

La autoridad certificante ya tiene clave privada (`CApriv.key`), clave pública (`CApub.key`) y certificado autofirmado (`ca.cer`). Ya está en condiciones de certificar otros certificados.

4. De manera análoga al ejercicio 6 *[sic: es el 10]*, se creará un requerimiento de certificado. Deberás tener las claves privada y pública del usuario (`USRpriv.key` y `USRpub.key`). Usa el archivo de configuración `CAconf1.cfg` y guarda el requerimiento como `req.pem`

5. Ahora procede a firmar el requerimiento y generar el certificado del usuario (`USRcert.cer`). Usar el comando `x509`:

```
openssl x509 [-inform DER|PEM|NET] [-outform DER|PEM|NET] [-keyform DER|PEM]
[-CAform DER|PEM] [-CAkeyform DER|PEM] [-in filename] [-out filename] [-
serial] [-hash] [-subject_hash] [-issuer_hash] [-subject] [-issuer] [-
nameopt option] [-email] [-ocsp_uri] [-startdate] [-enddate] [-purpose] [-
dates] [-modulus] [-fingerprint] [-alias] [-noout] [-trustout] [-clrtrust]
[-clrreject] [-addtrust arg] [-addreject arg] [-setalias arg] [-days arg] [-
set_serial n] [-signkey filename] [-x509toreq] [-req] [-CA filename] [-CAkey
filename] [-CAcreateserial] [-CAserial filename] [-text] [-C] [-md2|-md5|-
sha1|-mdc2] [-clrext] [-extfile filename] [-extensions section] [-engine id]
```

Colocar en todos los formatos la opción PEM, generarlo para una validez de 1 año, usando hash sha1, y la opción `-text` para que lo cree en formato de texto. La opción `-CA` debe tener como argumento el certificado de la CA.

6. Observa el certificado obtenido (`USRcert.cer`). Toma nota del contenido del certificado. Compáralo con los datos de un certificado digital observado en alguna página de internet, por ejemplo la de un banco.

> Es el ejercicio más largo de la guía y el más concreto: construye a mano **una cadena de dos eslabones** —una raíz autofirmada y un certificado de usuario firmado por ella—, que es la estructura mínima de toda [[cadenas-de-firmas-y-autoridades-raiz|PKI]]. Los dos archivos de configuración están transcriptos del render del PDF (la extracción de texto los pierde enteros). Cuatro cosas para tener en cuenta al correrlo, todas *(precisión nuestra)*: **`default_bits = 1024` es un tamaño que hoy no se usa** —ver [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]]; las claves que genera el paso 1 pueden ser de 2048 igual—; el paso 5 pide firmar con **`sha1`, que está quebrado** ([[primitivas-de-hash-estandar|Primitivas de hash]]) y OpenSSL 3.x todavía lo acepta para esto pero avisa que es obsoleto; `CAconf2.cfg` trae `output_password = mipassword`, que sólo actúa si se genera una clave nueva con `-newkey`; y en OpenSSL 3.x el certificado del usuario **no hereda extensiones** salvo que se pasen con `-extfile`.

> [!nota]- Resolución del Ejercicio 12
> *Crear una CA con su par de claves y su certificado autofirmado de diez años; crear el par de claves y la solicitud de un usuario; firmar la solicitud con la CA para obtener el certificado del usuario, válido un año, con `sha1` y en texto; observar el resultado y compararlo con un certificado real.*
>
> **Corrido completo con `OpenSSL 3.6.2`**, con los dos archivos de configuración transcriptos tal cual del PDF. Las claves se generaron de 2048 bits en vez de los 1024 del `default_bits` del archivo —el valor de configuración sólo aplica cuando `req` genera la clave por sí mismo, cosa que acá no pasa—.
>
> ### Pasos 1 a 3: la autoridad certificante
>
> ```
> $ openssl genrsa -out CApriv.key 2048
> $ openssl rsa -in CApriv.key -pubout -out CApub.key
> $ openssl req -new -key CApriv.key -out ca.cer -config CAconf2.cfg -x509 -days 3650
> ```
>
> Como `CAconf2.cfg` tiene `prompt = no` y los campos completos, el comando no pregunta nada. El resultado:
>
> ```
> $ openssl x509 -in ca.cer -noout -subject -issuer -dates -ext basicConstraints
> subject=C=AR, ST=Buenos Aires, L=Buenos Aires, O=Empresa Ficticia, OU=Oficina de SI,
>         CN=Ana Arias, emailAddress=ariasroigana@gmail.com
> issuer= (idéntico al subject)
> notBefore=Sep 14 03:28:52 2026 GMT
> notAfter=Sep 11 03:28:52 2036 GMT
> X509v3 Basic Constraints:
>     CA:TRUE
> ```
>
> Diez años exactos (los 3650 días caen tres días antes por los bisiestos), emisor igual a sujeto, y `CA:TRUE` puesto por la sección `v3_ca` del archivo: la raíz de la cadena. *(`CApub.key` no se usa en ningún comando posterior —la pública viaja adentro de `ca.cer`—; el enunciado la pide por completitud.)*
>
> ### Paso 4: el usuario y su solicitud
>
> ```
> $ openssl genrsa -out USRpriv.key 2048
> $ openssl rsa -in USRpriv.key -pubout -out USRpub.key
> $ openssl req -new -key USRpriv.key -out req.pem -config CAconf1.cfg \
>     -subj "/C=AR/L=Buenos Aires/OU=Cripto 72.44/CN=Sebastian Caules/emailAddress=sebastiancaules5@gmail.com"
> ```
>
> `CAconf1.cfg` no tiene `prompt = no`, así que sin `-subj` pregunta los cinco campos que define su `req_distinguished_name` —país (por defecto `AR`), localidad, unidad, nombre común, correo— y el *challenge password*. Notar que ese archivo **no define** `stateOrProvinceName` ni `organizationName`, así que el sujeto del usuario tiene menos campos que el de la CA.
>
> ### Paso 5: la CA firma
>
> ```
> $ openssl x509 -req -inform PEM -outform PEM -CAform PEM -CAkeyform PEM \
>     -in req.pem -CA ca.cer -CAkey CApriv.key -CAcreateserial \
>     -days 365 -sha1 -text -out USRcert.cer
> Certificate request self-signature ok
> subject=C=AR, L=Buenos Aires, OU=Cripto 72.44, CN=Sebastian Caules, emailAddress=sebastiancaules5@gmail.com
> ```
>
> Cada opción hace lo que el enunciado pide: los cuatro `-…form PEM` fijan el formato de entrada, salida, certificado de la CA y clave de la CA; `-days 365` da un año; `-sha1` firma con `sha1WithRSAEncryption`; `-text` antepone el volcado legible al bloque PEM; `-CA ca.cer` y `-CAkey CApriv.key` son el certificado y la clave privada de quien firma; y `-CAcreateserial` crea el archivo `ca.srl` con el contador de números de serie de la CA, que es lo que permite que dos certificados emitidos por la misma CA nunca compartan serial. La primera línea de salida, *"Certificate request self-signature ok"*, es OpenSSL verificando la autofirma de la solicitud —la prueba de posesión del Ej. 10— antes de firmarla.
>
> ### Paso 6: el certificado obtenido
>
> ```
> Certificate:
>     Data:
>         Version: 3 (0x2)
>         Serial Number: 42:33:c7:8d:7b:fa:fb:17:34:d5:ba:5d:9c:37:61:74:bf:09:81:57
>         Signature Algorithm: sha1WithRSAEncryption
>         Issuer: C=AR, ST=Buenos Aires, L=Buenos Aires, O=Empresa Ficticia, OU=Oficina de SI,
>                 CN=Ana Arias, emailAddress=ariasroigana@gmail.com
>         Validity
>             Not Before: Sep 14 03:28:52 2026 GMT
>             Not After : Sep 14 03:28:52 2027 GMT
>         Subject: C=AR, L=Buenos Aires, OU=Cripto 72.44, CN=Sebastian Caules,
>                  emailAddress=sebastiancaules5@gmail.com
>         Subject Public Key Info:
>             Public Key Algorithm: rsaEncryption
>                 Public-Key: (2048 bit)
>         X509v3 extensions:
>             X509v3 Subject Key Identifier:
>                 4C:17:49:B3:23:B3:37:14:0D:C9:3A:9F:E4:0F:BD:E1:CE:77:F0:C7
>             X509v3 Authority Key Identifier:
>                 2F:67:71:83:0F:19:CB:7B:7E:67:63:0C:1C:F4:51:B5:50:0D:12:0E
>     Signature Algorithm: sha1WithRSAEncryption
> -----BEGIN CERTIFICATE-----
> MIID/DCCAuSgAwIBAgIUQjPHjXv6+xc01bpdnDdhdL8JgVcwDQYJKoZIhvcNAQEF ...
> ```
>
> **Y la cadena cierra:**
>
> ```
> $ openssl verify -CAfile ca.cer USRcert.cer
> USRcert.cer: OK
> ```
>
> **Qué se lee ahí, y qué cambió respecto del Ej. 11.** Ahora **Issuer y Subject son distintos**: emite Ana Arias (la CA), el sujeto es el usuario. El `Authority Key Identifier` del certificado del usuario (`2F:67:…`) es el `Subject Key Identifier` de `ca.cer`: es el puntero con el que un verificador sabe **qué clave** tiene que usar para verificar la firma, el eslabón hacia arriba de la cadena → [[x509#Verificación de un certificado X.509, en cinco pasos|Verificación de un certificado X.509]]. La validez es de un año y el serial es un número de 20 bytes que la CA no va a repetir. **No hay `Basic Constraints`**: el usuario no es una CA, y OpenSSL 3.x, a diferencia de 1.0.x, no copia extensiones de la solicitud ni pone `CA:FALSE` por defecto en `x509 -req` sin `-extfile`; en una CA real se agregaría explícitamente, con `keyUsage` y `extendedKeyUsage`.
>
> ### Contra el certificado de un banco
>
> Un certificado real —el de `www.bancogalicia.com.ar` o cualquier otro, mirando el candado del navegador— tiene la misma estructura y difiere en cinco cosas, todas instructivas:
>
> | | `USRcert.cer` | Certificado de un sitio real |
> |---|---|---|
> | Cadena | **dos** eslabones: usuario ← CA raíz propia | **tres o más**: sitio ← CA intermedia ← CA raíz de una autoridad pública (DigiCert, Let's Encrypt, GlobalSign…), y la raíz está preinstalada en el navegador |
> | Firma | `sha1WithRSAEncryption`, que ningún navegador acepta desde 2017 | `sha256WithRSAEncryption` o `ecdsa-with-SHA256`; claves `RSA` de 2048 o curvas de 256 bits |
> | Validez | 1 año | **hasta 398 días** por política de los navegadores, y cada vez menos; Let's Encrypt emite a 90 días |
> | Sujeto | un nombre de persona con correo | un **nombre de dominio** en `CN` y en `Subject Alternative Name`, que es lo que el navegador compara con la URL; en los de validación extendida, además la razón social |
> | Extensiones | dos identificadores de clave | `Basic Constraints: CA:FALSE`, `Key Usage`, `Extended Key Usage: TLS Web Server Authentication`, **puntos de distribución de CRL y OCSP** para revocación → [[revocacion-y-listas-crl\|Revocación]], y las marcas de *Certificate Transparency* |
>
> La diferencia de fondo no es técnica: el certificado del Ej. 12 lo firmó una CA que **sólo existe en esta carpeta**, y un navegador lo rechazaría con *"emisor desconocido"*. El del banco lo firmó una cadena cuya raíz alguien —el fabricante del navegador— decidió de antemano que merece confianza. Toda la PKI es esa decisión más la aritmética de los pasos 3 y 5 → [[cadenas-de-firmas-y-autoridades-raiz#Pero no hay una única AC raíz universal|Pero no hay una única AC raíz universal]].

### Ejercicio 13

Alice quiere determinar un nivel de confianza para la firma de Fred.

La notación de certificados usada es aumentada con **H** o con **L** para indicar si el que firma tiene un nivel **mayor** o **menor** de confianza en sus firmas.

Alice conoce y confía ampliamente en las opiniones de **Harold** y de **Jane**.
Alice apenas conoce a **Tiago** y por eso no sabe si sus opiniones son o no confiables.
A los demás participantes no los conoce.

Dadas las siguientes firmas, dar un argumento sólido, desde el punto de vista de Alice, por el cual la firma de Fred pueda ser confiable. $X\langle\!\langle Y\rangle\!\rangle$ significa *$X$ certifica a $Y$*.

$$\begin{aligned}
&\{\text{Ellen}(H),\ \text{Tiago}(H),\ \text{George}(H),\ \text{Fred}(H)\}\langle\!\langle\text{Fred}\rangle\!\rangle\\
&\{\text{Ellen}(H),\ \text{Harold}(L),\ \text{George}(H)\}\langle\!\langle\text{George}\rangle\!\rangle\\
&\{\text{Jane}(L),\ \text{Harold}(H),\ \text{Ellen}(H)\}\langle\!\langle\text{Ellen}\rangle\!\rangle
\end{aligned}$$

> Es el modelo de confianza **sin autoridad central** —la *web of trust* de PGP—, la alternativa a la jerarquía de los Ej. 12 y 14 → [[cadenas-de-firmas-y-autoridades-raiz#Pero no hay una única AC raíz universal|Pero no hay una única AC raíz universal]]. La notación $X\langle\!\langle Y\rangle\!\rangle$ es la de Bishop. Lo que hay que separar, y el enunciado mezcla a propósito, es **dos cosas distintas**: si Alice cree que **una clave es de quien dice ser** (validez), y si Alice cree que **su dueño certifica bien a otros** (confianza como introductor). Las letras H y L califican lo segundo.

> [!nota]- Resolución del Ejercicio 13
> *Tres listas de certificaciones sobre las claves de Fred, George y Ellen, con la confianza de cada firmante marcada H o L. Alice confía en Harold y Jane, apenas conoce a Tiago, no conoce a los demás. Argumentar por qué la firma de Fred puede ser confiable para Alice.*
>
> ### Las dos preguntas que hay que separar
>
> En una red de confianza al estilo PGP, para aceptar una firma de Fred, Alice necesita creer que **la clave con la que se verifica es realmente de Fred** — que su certificado es *válido*. Y un certificado es válido para Alice si está firmado por gente **cuyas claves Alice ya considera válidas y en cuyo criterio para certificar a otros Alice confía**. La regla habitual *(PGP, precisión nuestra)*: alcanza **una** firma de un introductor de confianza **plena**, o **dos** de introductores de confianza **parcial**. Las marcas H y L del enunciado son la confianza que cada firmante declara tener en sus propias certificaciones; la confianza de Alice en cada firmante es la que fija el texto.
>
> Lo que Alice sabe de entrada: confía **plenamente** en Harold y en Jane (sus claves son válidas para ella y su criterio es bueno); de Tiago **no sabe** (ni su criterio ni, en rigor, su clave); a Ellen, George y Fred **no los conoce**.
>
> ### La cadena, de abajo hacia arriba
>
> **Paso 1 — la clave de Ellen es válida.** El tercer certificado dice que la clave de Ellen la certifican Jane (con confianza L en su propia firma), Harold (con confianza H) y la propia Ellen (autofirma, que no cuenta). **Harold y Jane son los dos introductores de confianza plena de Alice**, y los dos avalan la clave de Ellen; Harold, además, con alta confianza en su firma. Con una firma plena alcanzaría; hay dos. Alice puede aceptar que **la clave de Ellen es de Ellen**.
>
> **Paso 2 — la clave de George es válida.** El segundo certificado lo firman Ellen (H), Harold (L) y el propio George. Harold —introductor pleno para Alice— la avala, aunque con confianza baja en su propia firma; y Ellen, cuya clave Alice acaba de validar, la avala con confianza alta. Son **dos avales independientes**, uno de un introductor pleno y otro de una clave recién validada. Alice puede aceptar que **la clave de George es de George**.
>
> **Paso 3 — la clave de Fred es válida.** El primer certificado lo firman Ellen (H), Tiago (H), George (H) y el propio Fred. Tiago no aporta nada, porque Alice no sabe si sus opiniones valen. Pero **Ellen y George** —cuyas claves Alice validó en los pasos 1 y 2— avalan la clave de Fred, los dos con **alta** confianza en su firma. Y esos dos avales llegan por **caminos que se apoyan en gente distinta**: Ellen fue validada por Harold y Jane; George por Harold y Ellen. Con dos avales de claves válidas, cada uno marcado H, Alice tiene base para aceptar que **la clave de Fred es de Fred**.
>
> **Conclusión.** Con la clave de Fred aceptada como válida, la firma de Fred sobre cualquier documento **se puede verificar con confianza**: Alice sabe que la clave que verifica es la de Fred, y por lo tanto que fue Fred quien firmó.
>
> ### Dónde está el punto débil del argumento, dicho honestamente
>
> El razonamiento **extiende confianza como introductoras a Ellen y a George**, a quienes Alice no conoce, sobre la base de que Harold y Jane avalan sus claves. Eso es exactamente lo que la red de confianza permite y lo que la hace frágil: **que una clave sea válida no implica que su dueño certifique bien**. Un modelo estricto distinguiría "confío en que ésta es la clave de Ellen" de "confío en el criterio de Ellen para certificar a Fred", y sólo lo segundo hace valer la firma de Ellen sobre Fred. El argumento es sólido porque **Harold y Jane, que sí son de confianza plena, están detrás de todos los eslabones** —Harold firma tanto a Ellen como a George—, porque hay **dos caminos** y no uno, y porque todas las firmas que cuentan están marcadas **H**. Si el único aval de Fred fuera Tiago, o si Harold hubiera firmado a Ellen con L, el argumento no cerraría.
>
> **Contra la jerarquía del Ej. 12.** Allá la confianza tiene forma de árbol y termina en **una** raíz que alguien instaló; acá es un grafo donde cada usuario decide en quién confía y cuánto, y la "raíz" de Alice son Harold y Jane. El árbol escala y se audita; el grafo no depende de nadie pero exige que cada uno haga, cada vez, el razonamiento de arriba. La PKI argentina del Ej. 14 es el primer modelo llevado al extremo: una única raíz estatal.

### Ejercicio 14

El objetivo de este ejercicio es conocer la situación actual de infraestructura de firma digital en la República Argentina.

**a)** ¿Qué área del gobierno nacional actuará por ley como autoridad certificante raíz? (ACR RA)
**b)** Investiga cuáles son los certificadores licenciados vigentes del sistema de PKI de la República Argentina. ¿Quién les otorgó la licencia?
**c)** Según la ley 25.506, ¿cuáles son las funciones de los certificadores licenciados?
**d)** ¿Desde cuándo existe un certificado de la ACR RA? ¿Para qué sirve?
**e)** Da un ejemplo de cadenas de firmas que podrían generarse a partir de la ACR RA.

> Es la contraparte institucional de lo que el docente contó en voz el 10/09 —*"Argentina fue país pionero: tenemos una ley de firmas digitales"* (cue 1120)— y de la distinción firma digital / firma electrónica → [[firma-digital#El marco legal: firma registrada, presunción de validez y la ley argentina|Firma digital]]. Todo lo que sigue está contestado contra **fuentes primarias consultadas el 14/09/2026**: el sitio de la infraestructura en `argentina.gob.ar`, el texto de la ley en InfoLEG, y los dos certificados raíz descargados de `acraiz.gov.ar` y leídos con `openssl x509`.

> [!nota]- Resolución del Ejercicio 14
> *Cinco preguntas sobre la Infraestructura de Firma Digital de la República Argentina: la autoridad raíz, los certificadores licenciados y quién los licencia, sus funciones según la ley, desde cuándo existe el certificado raíz y para qué sirve, y un ejemplo de cadena.*
>
> ### a) La autoridad certificante raíz
>
> La **Autoridad Certificante Raíz de la República Argentina (AC RAÍZ)** es el primer nivel de la jerarquía de la Infraestructura de Firma Digital de la República Argentina (IFDRA), y **la opera el Ente Licenciante**, que la Ley 25.506 pone en cabeza de la **Jefatura de Gabinete de Ministros** (art. 35 y siguientes). Dentro de la Jefatura, el área que ejerce hoy ese rol es la **Subsecretaría de Innovación**, dependiente de la Secretaría de Innovación, Ciencia y Tecnología; el nombre exacto del área cambió varias veces con las reorganizaciones ministeriales —fue la ONTI, la Secretaría de Modernización Administrativa, la Secretaría de Innovación Pública—, y lo que se mantiene fijo por ley es la Jefatura de Gabinete. Es decir: **el Estado nacional es la raíz**, no una empresa ni un consorcio; y a diferencia de la raíz de un navegador, es única para todo el sistema.
>
> ### b) Los certificadores licenciados, y quién licencia
>
> Un **certificador licenciado** es, según el art. 17 de la ley, *"toda persona de existencia ideal, registro público de contratos u organismo público que expide certificados"* con licencia otorgada por el Ente Licenciante. Al **14/09/2026**, el listado oficial del Ente Licenciante tiene **seis licencias activas**:
>
> | Certificador | Tipo | Licencia otorgada por | Vigente hasta |
> |---|---|---|---|
> | **AC ONTI** (Oficina Nacional de Tecnologías de la Información) | organismo público | Res. SIP SICYT 71/26 | 12/11/2026 |
> | **AC MODERNIZACIÓN-PFDR** (Plataforma de Firma Digital Remota, Sec. de Innovación, Ciencia y Tecnología) | organismo público | Res. SICYT 279/2025 | 01/11/2030 |
> | **AC ENCODE S.A.** | empresa privada | Res. SITSP 10/2022 | 01/01/2028 |
> | **AC LAKAUT S.A.** | empresa privada | Res. SICYT 51/2024 | 01/12/2029 |
> | **AC BOX CUSTODIA DE ARCHIVOS S.A.** | empresa privada | Res. SICYT 126/2025 | 01/06/2030 |
> | **AC DIGILOGIX S.A.** | empresa privada | Res. SICYT 41/2024 | 01/12/2029 |
>
> y cinco licencias que ya no están activas: **ARCA** (ex AFIP), **ANSES**, **Train Solutions S.A.**, **Tecnología de Valores S.A.** y **Prisma Medios de Pago S.A.**, las dos últimas por cese de actividades. **Las licencias las otorga, deniega y revoca el Ente Licenciante** —la Subsecretaría de Innovación de la Jefatura de Gabinete—, que además supervisa la operación de los licenciados; cada licencia se instrumenta con una resolución de la secretaría a cargo, y por eso las siglas de la tercera columna cambian con el nombre del área.
>
> ### c) Las funciones según la ley
>
> El **artículo 19** de la Ley 25.506 enumera las funciones del certificador licenciado:
>
> 1. **Recibir una solicitud** de emisión de certificado, firmada digitalmente con los datos de verificación de firma del solicitante — el CSR del Ej. 10, con su autofirma;
> 2. **Emitir certificados** de acuerdo con su política de certificación y con los requisitos que fije el Ente Licenciante;
> 3. **Identificar inequívocamente** los certificados emitidos — el número de serie;
> 4. **Mantener copia** de todos los certificados emitidos, con la información necesaria para verificarlos;
> 5. **Revocar** los certificados: a pedido del titular, de oficio ante compromiso de la clave o incumplimiento, o por orden judicial;
> 6. **Informar públicamente el estado** de los certificados emitidos — la lista de certificados revocados, → [[revocacion-y-listas-crl|Revocación y listas CRL]].
>
> Y el **artículo 21** fija las obligaciones que acompañan a esas funciones: informar al solicitante las condiciones antes de emitir, **abstenerse de generar, exigir o conocer los datos de creación de firma** —la clave privada nunca pasa por el certificador, que es la corrección al enunciado del Ej. 10—, mantener la confidencialidad, operar con sistemas confiables, y publicar su política de certificación.
>
> ### d) Desde cuándo existe el certificado raíz, y para qué sirve
>
> **Existen dos certificados raíz**, y los dos están publicados para descarga en `acraiz.gov.ar`. Leídos con `openssl x509 -noout -subject -dates` el 14/09/2026:
>
> ```
> AC RAÍZ 2007   subject=C=AR, O=Infraestructura de Firma Digital, CN=AC Raíz
>                notBefore=Nov 22 13:25:39 2007 GMT   notAfter=Nov 17 13:25:39 2027 GMT
>                RSA 4096 bits · sha1WithRSAEncryption
>
> AC RAÍZ 2016   subject=C=AR, O=Infraestructura de Firma Digital de la República Argentina,
>                        CN=AC Raíz de la República Argentina
>                notBefore=Jun 30 14:57:58 2016 GMT   notAfter=Jun 30 15:07:57 2036 GMT
>                RSA 4096 bits · sha512WithRSAEncryption
> ```
>
> O sea: **el primer certificado de la AC Raíz existe desde el 22 de noviembre de 2007**, seis años después de la ley (sancionada el 14/11/2001 y promulgada el 11/12/2001) y cinco después de su decreto reglamentario (2628/2002): la infraestructura tardó en ponerse en marcha. El segundo, de **2016**, lo reemplaza con veinte años de vigencia y una firma `SHA-512` en lugar de la `SHA-1` del original, que para 2016 ya estaba comprometida → [[primitivas-de-hash-estandar|Primitivas de hash estándar]]. Los dos siguen vigentes en paralelo hasta que el de 2007 venza en 2027.
>
> **Para qué sirve:** el certificado raíz es la **única ancla de confianza** de todo el sistema. La AC Raíz no emite certificados a personas: emite certificados **a los certificadores licenciados** —el segundo nivel de la jerarquía—, y son éstos los que emiten a los usuarios finales. Quien quiera verificar una firma digital argentina tiene que tener instalado el certificado raíz, y desde él verificar la cadena hasta el certificado del firmante. Es exactamente el `ca.cer` del Ej. 12, elevado a política de Estado: un autofirmado en el que se confía por decisión, no por criptografía → [[cadenas-de-firmas-y-autoridades-raiz#El concepto de AC raíz, en una frase|El concepto de AC raíz]].
>
> ### e) Un ejemplo de cadena
>
> Una cadena real de tres eslabones, tal como la vería un verificador:
>
> $$\text{AC RAÍZ 2016} \;\longrightarrow\; \text{AC ONTI} \;\longrightarrow\; \text{certificado de un funcionario que firma un expediente}$$
>
> La AC Raíz firma el certificado de AC ONTI (un certificador licenciado); AC ONTI firma el certificado de la persona; la persona firma el documento. Verificar el documento es recorrer la cadena al revés: la firma del documento con la clave del certificado de la persona, ese certificado con la clave de AC ONTI, el de AC ONTI con la clave de la AC Raíz, y la AC Raíz **con nada** —se confía en ella—. Otras cadenas del mismo sistema, cambiando el eslabón del medio:
>
> - $\text{AC RAÍZ 2016} \to \text{AC MODERNIZACIÓN-PFDR} \to$ certificado de un ciudadano que firma con la **Plataforma de Firma Digital Remota** (la que se usa desde la app Mi Argentina, con la clave custodiada en el servidor del certificador);
> - $\text{AC RAÍZ 2016} \to \text{AC LAKAUT S.A.} \to$ certificado de un apoderado de una empresa privada que firma contratos;
> - $\text{AC RAÍZ 2007} \to \text{AC ONTI (2010)} \to$ certificados viejos, todavía verificables mientras la raíz de 2007 no venza.
>
> **Y una precisión sobre lo que el modelo no tiene.** A diferencia de la PKI de los navegadores, donde hay decenas de raíces y una CA intermedia puede a su vez licenciar otras, la jerarquía argentina es **plana de tres niveles y con una sola raíz**: raíz → certificador licenciado → titular. Las **autoridades de registro** —los puntos donde uno se presenta con el DNI para que le emitan el certificado— no son un eslabón criptográfico: verifican la identidad en nombre del certificador, pero no firman certificados. Es el modelo más simple posible del Ej. 12, y el más fácil de auditar; su precio es que el Estado es el único punto de confianza, que es exactamente el trade-off que la [[distribucion-de-claves-y-kdc|Clase 04]] señaló para el KDC.

### Ejercicio 15

Sea $f$ una función seudoaleatoria, $f:\{0,1\}^{n}\to\{0,1\}^{n}$.

Sea el esquema de cifrado `CPA`-seguro $\pi(\mathsf{Gen},\mathsf{Enc},\mathsf{Dec})$ tal que:

$$k \leftarrow \mathsf{Gen}(1^{n})$$
$$c \leftarrow \mathsf{Enc}_k(m) = r \,\Vert\, \bigl(f_k(r) \oplus m\bigr), \qquad \text{con } \lvert r\rvert = n \wedge \lvert m\rvert = n$$

**a)** Escribir cómo debe ser $\mathsf{Dec}_k$.
**b)** Mostrar que el esquema **NO** es `CCA`-seguro tomando $m_0 = 00000001$ y $m_1 = 11111110$.

> Es la construcción `CPA`-segura de la [[practica-03-seudoaleatoriedad-y-modos#5. El esquema CPA-seguro construido sobre la función pseudoaleatoria|Práctica 03]] y de Katz & Lindell (Construcción 3.30), con $f_k$ una [[primitiva-de-cifrado-en-bloque|función pseudoaleatoria]]. Y el (b) es, casi palabra por palabra, el ejercicio que la Clase 03 resolvió en voz para el cifrado de flujo → [[ataque-de-texto-cifrado-escogido#Ejercicio: el cifrado de flujo no es CCA-Secure|el cifrado de flujo no es CCA-Secure]]: la estructura *keystream xor mensaje* es [[maleabilidad|maleable]], y el juego `CCA` le da al adversario el oráculo que la explota. Los dos mensajes del enunciado son **complementarios bit a bit**: eso es una pista.

> [!nota]- Resolución del Ejercicio 15
> *Un cifrado que concatena un $r$ fresco con $f_k(r)\oplus m$. a) Escribir $\mathsf{Dec}_k$. b) Mostrar que no es `CCA`-seguro con $m_0 = 00000001$ y $m_1 = 11111110$.*
>
> ### a) El descifrado
>
> El criptograma tiene $2n$ bits: los primeros $n$ son $r$ en claro, los últimos $n$ son el mensaje enmascarado. Descifrar es separar y quitar la máscara:
>
> $$\mathsf{Dec}_k(c):\quad \text{parsear } c = r \,\Vert\, s \ \ \text{con } \lvert r\rvert = \lvert s\rvert = n, \qquad \text{devolver } m := f_k(r) \oplus s$$
>
> Cierra porque $f_k(r) \oplus \bigl(f_k(r) \oplus m\bigr) = m$: el receptor **recomputa la misma máscara** $f_k(r)$ —tiene $k$ y lee $r$ del criptograma— y el XOR se cancela. $f$ no necesita ser invertible: nunca se invierte, sólo se evalúa; por eso alcanza con una función pseudoaleatoria y no hace falta una permutación. Y por qué el esquema es `CPA`-seguro: el $r$ **fresco por mensaje** hace que la máscara sea distinta cada vez, así que cifrar dos veces el mismo $m$ da criptogramas distintos, que es la condición de [[pruebas-de-indistinguibilidad#Propiedades de CPA|CPA]].
>
> ### b) El adversario contra CCA
>
> En el juego [[ataque-de-texto-cifrado-escogido#El juego CCA|CCA]] el adversario tiene, además del oráculo de cifrado, un **oráculo de descifrado** con una sola restricción: no puede pedirle que descifre el desafío $c^{*}$ tal cual. Todo lo demás vale, incluido **un criptograma que difiera de $c^{*}$ en un bit**.
>
> $$\begin{aligned}
> &1)\ A \text{ emite } m_0 = 00000001 \text{ y } m_1 = 11111110 \quad (n = 8).\\
> &2)\ \text{El desafiante sortea } b,\ \text{elige } r,\ \text{y devuelve } c^{*} = r \,\Vert\, s^{*} \ \text{ con } s^{*} = f_k(r)\oplus m_b.\\
> &3)\ A \text{ construye } c' = r \,\Vert\, \bigl(s^{*} \oplus 00000001\bigr) \ne c^{*} \ \text{ y se lo da al oráculo de descifrado.}\\
> &4)\ \text{El oráculo devuelve } m' = f_k(r) \oplus s^{*} \oplus 00000001 = m_b \oplus 00000001.\\
> &5)\ \text{Si } m' = 00000000,\ A \text{ emite } b' = 0;\ \text{si } m' = 11111111,\ \text{emite } b' = 1.
> \end{aligned}$$
>
> Como $m_0 \oplus 00000001 = 00000000$ y $m_1 \oplus 00000001 = 11111111$, los dos casos se distinguen sin ambigüedad, y
>
> $$\Pr[\mathsf{CCA}_{A,\pi} = 1] = 1 \gg \tfrac{1}{2} + \mathsf{negl}(n)$$
>
> **El esquema no es `CCA`-seguro.** La consulta $c'$ es legal —difiere de $c^{*}$ en el último bit— y una sola alcanza.
>
> **Por qué los mensajes del enunciado son ésos.** $m_0$ y $m_1$ son complementarios, así que hay una segunda versión del mismo ataque todavía más limpia: complementar **todos** los bits de la segunda mitad, $c'' = r \Vert \overline{s^{*}}$, hace que el oráculo devuelva $\overline{m_b}$, que es **el otro mensaje**: $m_1$ si $b = 0$, $m_0$ si $b = 1$. El adversario compara con los dos que él eligió y acierta. Cualquier $\Delta \ne 0$ sirve —el oráculo devuelve $m_b \oplus \Delta$, y el adversario lo compara con $m_0 \oplus \Delta$ y $m_1 \oplus \Delta$—; el enunciado eligió mensajes donde el resultado es visualmente obvio.
>
> ### Lo que muestra
>
> Es el mismo defecto de la [[maleabilidad|base de sueldos]] de la Clase 03: **quien controla un criptograma controla el mensaje descifrado, bit a bit**, porque la máscara es lineal. `CPA` no lo mide —el adversario de `CPA` nunca ve descifrar nada—; `CCA` sí, y por eso ningún esquema de esta forma lo pasa → [[ataque-de-texto-cifrado-escogido#Ningún criptosistema visto hasta el momento es CCA-Secure|Ningún criptosistema visto hasta el momento es CCA-Secure]]. Lo que lo arregla es agregar **integridad**: un MAC sobre el criptograma —*Encrypt-then-MAC*— hace que $c'$ no verifique y el oráculo devuelva $\perp$ → [[cifrado-autenticado|Cifrado autenticado]]. Y la misma idea, en clave pública, es el Ej. 17.

### Ejercicio 16

1. Mostrar que Textbook `RSA` para firma es inseguro (**ataque de no mensaje**) usando $m = \sigma^{e} \bmod N$.
2. ¿Por qué se reduce el riesgo de este ataque si se usa Hash `RSA`?

> Es el primero de los dos ataques de [[rsa-signature-y-hashed-rsa#Por qué está roto: la firma al azar|RSA-Signature]] —el que la filmina 37 trae y la voz del 10/09 no mencionó—, con la fórmula del ataque ya escrita en el enunciado. Lo que hay que hacer es correrlo contra el experimento `Sig-forge` de [[firma-digital#El experimento Sig-forge|Firma digital]] y decir por qué gana.

> [!nota]- Resolución del Ejercicio 16
> *1. Mostrar que textbook `RSA` para firma es inseguro con el ataque de no mensaje, $m = \sigma^{e} \bmod N$. 2. Por qué Hashed `RSA` reduce el riesgo.*
>
> ### 1. El ataque de no mensaje
>
> En textbook `RSA` para firma, $\mathsf{Sign}_{sk}(m) = m^{d} \bmod N$ y $\mathsf{Vrfy}_{pk}(m, \sigma) = 1 \iff \sigma^{e} \equiv m \pmod N$. El adversario conoce $pk = (N, e)$ y hace lo siguiente, **sin consultar el oráculo de firma ni una vez**:
>
> $$\sigma \leftarrow \mathbb{Z}_N^{*} \text{ (al azar)}, \qquad m := \sigma^{e} \bmod N, \qquad \text{emitir } (m, \sigma)$$
>
> La verificación calcula $\sigma^{e} \bmod N$ y lo compara con $m$: son iguales **por construcción**, así que $\mathsf{Vrfy}_{pk}(m, \sigma) = 1$. Y como el adversario no pidió ninguna firma, $Q = \varnothing$ y $m \notin Q$ trivialmente:
>
> $$\Pr[\mathsf{Sig\text{-}forge}_{A,\Pi} = 1] = 1$$
>
> El esquema **no es infalsificable**, y se rompe con cero consultas — de ahí el nombre *ataque de no mensaje*: el adversario no eligió qué mensaje firmar, eligió la firma y dejó que el mensaje saliera de ella. Lo que lo hace posible es que **la verificación es una función pública que va de firmas a mensajes**: para cualquier $\sigma$, $\sigma^{e} \bmod N$ es *el* mensaje del que $\sigma$ es firma válida. No se rompe `RSA`, ni se factoriza $N$, ni se calcula $d$: se usa la fórmula de verificación al revés.
>
> **Sobre "sin sentido".** El $m$ que sale es un número aleatorio módulo $N$, que rara vez va a ser un contrato legible. Eso no lo salva: `Sig-forge` cuenta como falsificación **cualquier** par válido con $m$ nuevo, por la misma razón que [[seguridad-de-un-mac#Se considera roto aunque la falsificación no tenga sentido|Mac-Forge]] considera roto un MAC que se falsifica sobre basura — si un esquema deja falsificar mensajes aleatorios, nada garantiza que no deje falsificar los que importan, y en `RSA` la maleabilidad multiplicativa lo demuestra: con dos firmas legítimas se fabrica una tercera sobre $m_1 m_2$ → [[rsa-signature-y-hashed-rsa#El segundo ataque: la maleabilidad multiplicativa|el segundo ataque]].
>
> ### 2. Por qué Hashed RSA reduce el riesgo
>
> En Hashed `RSA`, $\mathsf{Sign}_{sk}(m) = H(m)^{d} \bmod N$ y $\mathsf{Vrfy}_{pk}(m,\sigma) = 1 \iff \sigma^{e} \equiv H(m) \pmod N$. El adversario puede repetir el paso: elegir $\sigma$ y calcular $y := \sigma^{e} \bmod N$. Pero ahora $y$ no es un mensaje: es **el hash que el mensaje tendría que tener**. Para emitir un par válido necesita **un $m$ tal que $H(m) = y$** — o sea, encontrar una **preimagen** de un valor $y$ que no eligió, sobre una función que es resistente a preimágenes → [[resistencias-de-una-funcion-de-hash#Las tres resistencias|Las tres resistencias]]. Con un hash de 256 bits, eso cuesta del orden de $2^{256}$ evaluaciones.
>
> **Por qué "reduce" y no "elimina"**, que es la palabra que el enunciado elige con cuidado: el ataque sigue siendo *posible en principio* —un adversario con un presupuesto de $2^{256}$ lo corre—, y la seguridad ya no descansa sólo en `RSA` sino **también en $H$**: si aparece un ataque de preimagen contra la función de hash, el ataque de no mensaje vuelve. Además, la garantía formal es más débil que en cifrado: Hashed `RSA` **no tiene prueba de seguridad** salvo en un modelo ideal de $H$ → [[rsa-signature-y-hashed-rsa#El límite honesto: sin prueba fuera del modelo ideal|El límite honesto]]. De paso, el hash arregla los otros dos problemas: destruye la estructura multiplicativa ($H(m_1)H(m_2)$ no es el hash de nada conocido) y **fija el tamaño de la firma** independientemente del del mensaje — la razón práctica que el docente agregó en voz (cues 1147-1154).

### Ejercicio 17

Mostrar que Textbook `RSA` para cifrado no es seguro ante `CCA` (ataque de cifrado elegido) debido a la propiedad:

$$\forall\, m, m':\ (m \cdot m')^{e} = m^{e} \cdot m'^{e} \bmod N$$

> La propiedad del enunciado es la **homomorfía multiplicativa** de `RSA`, la misma que [[rsa-signature-y-hashed-rsa#El segundo ataque: la maleabilidad multiplicativa|rompe RSA-Signature]] y la misma que explota el ataque de Bleichenbacher contra [[pkcs1-y-tamano-de-claves#CPA sí, CCA no|PKCS#1 v1.5]]. Es la versión asimétrica del Ej. 15: allá la maleabilidad era **aditiva** (XOR), acá es **multiplicativa**, y el molde del ataque es idéntico.

> [!nota]- Resolución del Ejercicio 17
> *Mostrar que textbook `RSA` para cifrado no es `CCA`-seguro, usando que $(m\cdot m')^{e} = m^{e}\cdot m'^{e} \bmod N$.*
>
> ### Primero, lo que ya se sabía
>
> Textbook `RSA` ni siquiera es `CPA`-seguro —es determinístico, y en el juego `Eav` asimétrico el adversario puede cifrar $m_0$ y $m_1$ por su cuenta y comparar → [[criptosistema-asimetrico#El corolario que se sigue directo: cifrado no determinístico obligatorio|Criptosistema asimétrico]]—, así que a fortiori no es `CCA`-seguro. Pero el ejercicio pide algo más interesante: un ataque que use el **oráculo de descifrado**, y que por lo tanto funcionaría incluso contra una versión de `RSA` que hubiera arreglado el determinismo pero no la maleabilidad. Ése es el ataque que vale.
>
> ### El adversario contra CCA
>
> En el juego `CCA` asimétrico el adversario tiene $pk = (N, e)$ —con lo que cifra solo— y un oráculo de descifrado que acepta cualquier $c \ne c^{*}$.
>
> $$\begin{aligned}
> &1)\ A \text{ emite } m_0 \ne m_1 \text{ cualesquiera, y recibe } c^{*} = m_b^{\,e} \bmod N.\\
> &2)\ A \text{ elige } s \in \mathbb{Z}_N^{*} \text{ con } s \ne 1 \text{ y calcula } c' := c^{*} \cdot s^{e} \bmod N.\\
> &\quad\ \ \text{Por la propiedad: } c' = m_b^{\,e}\cdot s^{e} = (m_b \cdot s)^{e} \bmod N, \text{ y } c' \ne c^{*}.\\
> &3)\ A \text{ le da } c' \text{ al oráculo de descifrado, que devuelve } m' = (c')^{d} = m_b \cdot s \bmod N.\\
> &4)\ A \text{ calcula } m_b = m' \cdot s^{-1} \bmod N \text{ y lo compara con } m_0 \text{ y } m_1.\ \text{Emite } b' \text{ en consecuencia.}
> \end{aligned}$$
>
> $$\Pr[\mathsf{CCA}_{A,\Pi} = 1] = 1$$
>
> **Una consulta, y el adversario recupera el mensaje entero**, no sólo el bit $b$. La consulta es legal porque $c' \ne c^{*}$ —basta $s \ne 1$—, y el oráculo no tiene forma de saber que $c'$ "deriva" de $c^{*}$: es un criptograma perfectamente válido de $m_b \cdot s$. El inverso $s^{-1}$ existe porque $s$ es coprimo con $N$ (elegir $s$ que no lo sea equivaldría a factorizar $N$).
>
> ### Por qué la propiedad es exactamente la culpable
>
> $(m\cdot m')^{e} = m^{e}\cdot m'^{e}$ dice que **cifrar respeta el producto**: el cifrado de un producto es el producto de los cifrados. Entonces, quien tiene un criptograma $c^{*}$ de un mensaje desconocido puede fabricar, **sin conocer el mensaje**, el criptograma de cualquier múltiplo suyo, multiplicando $c^{*}$ por $s^{e}$. Es la [[maleabilidad#La propiedad formal|maleabilidad]] en su forma más limpia — la misma transformación controlada del descifrado que el XOR daba en el Ej. 15, con la multiplicación módulo $N$ en lugar del XOR—. Y `CCA` es precisamente la prueba diseñada para castigarla: un oráculo de descifrado más un criptograma maleable es un oráculo de descifrado del desafío.
>
> ### Lo que arregla, y lo que no
>
> - El **padding aleatorio de `PKCS#1 v1.5`** rompe la homomorfía a nivel de mensajes —$m_b \cdot s$ ya no despaddea a nada válido, y el oráculo devuelve error—, pero **no alcanza**: el error mismo es una señal, y Bleichenbacher (1998) mostró cómo, con miles de consultas que sólo responden "padding válido / inválido", se reconstruye $m_b$ usando **exactamente esta propiedad multiplicativa**. Por eso la filmina 27 dice que `PKCS#1 v1.5` no es `CCA`-seguro → [[pkcs1-y-tamano-de-claves#CPA sí, CCA no|PKCS#1]].
> - Lo que sí lo arregla es `RSA-OAEP`, que ata el mensaje al relleno con una construcción de dos pasadas de hash de modo que **cualquier modificación del criptograma descifra a basura sin estructura**, y el oráculo no filtra nada útil — `CCA`-seguro en el modelo del oráculo aleatorio *(precisión nuestra, fuera de la guía)*.
> - Y la lección que unifica los Ej. 15, 16 y 17: **una primitiva con estructura algebraica —XOR o producto— no puede ser `CCA`-segura ni infalsificable tal cual**; hace falta algo que destruya la estructura (un hash, un padding con integridad) antes de exponerla a un oráculo.

### Ejercicio 18

**Protocolo TLS.**

1. Investiga el Protocolo `TLS`:
   - a. ¿Cómo se llaman las dos fases del protocolo? ¿Qué función tiene cada una?
   - b. ¿Qué significa `AEAD` y para qué sirve?
   - c. ¿Qué significa `HKDF` y para qué sirve?
2. ¿Verdadero o Falso?
   - a. Por defecto, en una conexión `TLS` tanto el servidor como el cliente se autentican entre sí.
   - b. `TLS` es una versión de `SSL`.
   - c. `TLS 1.3` tiene 37 conjuntos de cifrados (*cipher suites*).
   - d. `TLS` usa intercambio de claves de Diffie Hellman con autenticación.

> Es el ejercicio de cierre y el que junta las tres clases: `TLS` es intercambio de claves autenticado con certificados (Clases 04 y 05) sobre cifrado autenticado (Clase 03). El vault tiene cinco notas sobre él escritas contra el deck de la Clase 05 —que sigue **`TLS 1.2`**—; el enunciado pregunta por `AEAD` y `HKDF`, que son las marcas de **`TLS 1.3`**, así que hay que ir un paso más allá del deck. Las respuestas están contrastadas contra las RFC (5246 para 1.2, 8446 para 1.3, 5869 para `HKDF`).

> [!nota]- Resolución del Ejercicio 18
> *Investigar `TLS`: sus dos fases, `AEAD`, `HKDF`, y cuatro afirmaciones de Verdadero/Falso.*
>
> ### 1.a — Las dos fases: handshake y record
>
> `TLS` se estructura en dos protocolos (o *fases*), uno arriba del otro:
>
> - **El handshake** (negociación): la fase en la que cliente y servidor **se ponen de acuerdo en la versión y la suite criptográfica**, **se autentican** —el servidor siempre, con su certificado; el cliente sólo si se lo pide— y **derivan las claves de sesión** a partir de un intercambio de claves. Ocurre una vez al abrir la conexión, y su producto es un conjunto de claves simétricas compartidas → [[tls-handshake#Panorama en cuatro partes|TLS handshake]].
> - **El record** (registro): la fase que **transporta los datos** de la aplicación una vez que hay claves: fragmenta el flujo en récords, opcionalmente los comprime, los **cifra y autentica** con las claves negociadas, y los entrega a la capa de transporte → [[tls-arquitectura-y-record#El TLS Record|TLS: arquitectura y record]]. Es también el protocolo sobre el que viajan los mensajes del propio handshake, del `Change Cipher Spec` y del `Alert`.
>
> En una frase: **el handshake decide con qué se va a proteger, el record protege**. El primero es criptografía asimétrica y certificados (Clases 04 y 05); el segundo es cifrado autenticado simétrico (Clase 03).
>
> ### 1.b — AEAD
>
> ***Authenticated Encryption with Associated Data***: cifrado autenticado con datos asociados. Es la categoría de [[cifrado-autenticado|cifrado autenticado]] de la Clase 03 con un agregado: además del texto plano, que se cifra **y** se autentica, admite **datos asociados** que se autentican **pero no se cifran** — típicamente la cabecera del récord (tipo, versión, longitud), que tiene que viajar en claro para que el receptor sepa qué hacer con el paquete, pero que un atacante no debe poder modificar. `AES-GCM`, `AES-CCM` y `ChaCha20-Poly1305` son `AEAD` → [[ccm-y-gcm|CCM y GCM]].
>
> **Para qué sirve en `TLS`:** reemplaza la combinación "cifrado más `HMAC` aparte" de las versiones anteriores por **una sola primitiva** que da confidencialidad e integridad a la vez, con una sola clave por dirección y sin las trampas de composición (*MAC-then-encrypt* y los ataques de *padding oracle* que sufrió `TLS 1.2` con `CBC`). **`TLS 1.3` sólo admite suites `AEAD`**: todo lo demás se eliminó.
>
> ### 1.c — HKDF
>
> ***HMAC-based Extract-and-Expand Key Derivation Function*** (RFC 5869): una función de derivación de claves construida sobre [[hmac|HMAC]], en dos pasos. **Extract** toma material de entrada con entropía pero mal distribuida —por ejemplo, el secreto $g^{xy}$ de Diffie-Hellman, que es un elemento de grupo, no una cadena uniforme— y lo condensa en una clave pseudoaleatoria de tamaño fijo: $\mathrm{PRK} = \mathsf{HMAC}(\mathrm{salt}, \mathrm{IKM})$. **Expand** estira esa clave en tantas claves independientes como haga falta, cada una etiquetada con un contexto: $\mathsf{HMAC}(\mathrm{PRK}, \mathrm{info} \Vert i)$.
>
> **Para qué sirve en `TLS`:** es el **calendario de claves de `TLS 1.3`**. Del secreto Diffie-Hellman del handshake (y, si lo hay, de una clave precompartida) se derivan, con sucesivas llamadas a `HKDF`, el secreto del handshake, los secretos de tráfico de cliente y servidor, las claves y los `IV` de cada dirección, la clave del `Finished`, y los secretos para reanudar sesiones. Reemplaza a la `PRF` de `TLS 1.2` y a la fórmula del *master secret* de `SSL 3.0` que trae el deck → [[tls-handshake#Parte 4 (filminas 42-43): Change Cipher Spec y Finish, en las dos direcciones|TLS handshake]]. Y es el motivo por el que "derivar claves" está en la tabla de [[hmac#HMAC en la práctica|HMAC en la práctica]]: `HKDF` está construido **sobre** `HMAC`, no sobre el hash pelado.
>
> ### 2 — Verdadero o Falso
>
> | | Afirmación | Veredicto | Por qué |
> |---|---|---|---|
> | a | Por defecto, servidor y cliente se autentican entre sí | **Falso** | Por defecto **sólo el servidor** se autentica, con su certificado. La autenticación del cliente es **opcional**: el servidor tiene que pedirla (`CertificateRequest`) y el cliente responder con su certificado y un `CertificateVerify`. En la web casi nunca se usa; el usuario se autentica **encima** de `TLS`, con contraseña o token → [[tls-handshake#Parte 2 (filminas 39-40): certificado y parámetros del servidor\|TLS handshake]] |
> | b | `TLS` es una versión de `SSL` | **Verdadero**, con precisión | `TLS` es el sucesor estandarizado de `SSL` por el IETF: `TLS 1.0` (RFC 2246, 1999) es `SSL 3.0` con cambios, y su número de versión interno es literalmente **3.1** (`TLS 1.2` es 3.3). El nombre cambió por razones políticas entre Netscape y Microsoft, no técnicas → [[tls-arquitectura-y-record#Qué es SSL/TLS\|TLS: arquitectura y record]]. La precisión: son **incompatibles** entre sí, y todas las versiones de `SSL` están prohibidas hoy (RFC 7568) |
> | c | `TLS 1.3` tiene 37 cipher suites | **Falso** | `TLS 1.3` (RFC 8446) define **cinco**: `TLS_AES_128_GCM_SHA256`, `TLS_AES_256_GCM_SHA384`, `TLS_CHACHA20_POLY1305_SHA256`, `TLS_AES_128_CCM_SHA256` y `TLS_AES_128_CCM_8_SHA256`. Todas `AEAD`, y ya no incluyen el intercambio de claves ni la firma, que se negocian aparte. **37 es el número de suites que define la RFC 5246 de `TLS 1.2`**, en su apéndice A.5 — el enunciado apunta a esa confusión → [[suites-criptograficas-de-tls#El menú criptográfico\|Suites criptográficas de TLS]] |
> | d | `TLS` usa Diffie-Hellman con autenticación | **Verdadero** | En `TLS 1.3` **todo** intercambio de claves es Diffie-Hellman **efímero** —sobre curvas elípticas o sobre campos finitos— y el servidor lo autentica **firmando la transcripción** del handshake con la clave de su certificado (`CertificateVerify`): es el Ej. 7 hecho bien, con las identidades y todos los mensajes adentro de lo firmado. En `TLS 1.2` era una opción entre varias (`DHE`, `ECDHE`), junto al transporte de clave con `RSA` que no da *forward secrecy* → [[suites-criptograficas-de-tls#Intercambio de clave: no todas las opciones dan lo mismo\|Suites criptográficas de TLS]]. Es *"la implementación de Diffie-Hellman con todo"* que el docente anunció el 10/09 (cue 691) |
>
> **Lo que el ejercicio junta.** Las tres primeras clases de criptografía aparecen en `TLS` en el orden en que se dictaron: Diffie-Hellman con firma y certificado en el handshake (Clases 04 y 05), `HKDF` sobre `HMAC` para pasar del secreto a las claves (Clase 03), y `AEAD` en el record para proteger los datos (Clase 03). Lo único que la guía no pregunta y que conviene saber es **por qué** `TLS 1.3` tiró tanto material de `TLS 1.2`: cada cosa eliminada —`RSA` como transporte de clave, las suites sin `AEAD`, la compresión, la renegociación— fue la causa de un ataque publicado. Es la [[agilidad-criptografica|agilidad criptográfica]] de la Clase 03 aplicada a un protocolo entero.

---

> [!nota]- Qué se lleva al parcial
> Las cinco ideas transferibles de la guía, que valen más que cualquier protocolo puntual:
>
> **1. Un protocolo falla cuando un mensaje válido se usa fuera de su contexto, y la contramedida es meter el contexto adentro del mensaje.**
> Los Ej. 1 a 5, 7 y 9 son variaciones de una sola cosa: un mensaje correctamente cifrado o firmado que sirve **en otro momento** (replay, Ej. 1 y 5), **en otra sesión** (reflexión, Ej. 4), **para otro destinatario** (Ej. 7 y 9) o **con otra clave** (Ej. 2). Y la contramedida es siempre la misma: que lo que se firma o cifra diga **cuándo** (nonce, secuencia, timestamp), **para qué ejecución** (el nonce del pedido en la respuesta), **de quién a quién** (las identidades adentro) y **con qué clave** (certificados). Son los principios de Abadi y Needham, y es lo que hay que revisar en el Ejercicio 1 del parcial: **¿qué le falta a este mensaje para que no sirva en otro contexto?**
>
> **2. Firmar no es cifrar, y firmar los valores no es autenticar el protocolo.**
> El Ej. 3 muestra una clave "protegida" con una firma, que es pública; el Ej. 7 muestra que firmar $g^{x}$ y $g^{y}$ no impide que Bob crea hablar con Mallory. Las dos claves de un par no son intercambiables (cues 719-724), y una firma responde *"¿quién avala esto?"*, nunca *"¿para quién es?"*. Antes de decir que un protocolo es seguro porque "está firmado", hay que preguntar **qué cubre exactamente la firma**.
>
> **3. Firma y MAC dan lo mismo ante el receptor y cosas distintas ante terceros; frescura no da ninguna.**
> La tabla del Ej. 8: integridad y origen, las dos; verificación pública y **no repudio**, sólo la firma; replay, ninguna. El no repudio es el argumento de la clave compartida —quien verifica un MAC puede fabricarlo— y es lo que la ley convierte en presunción de autoría (Ej. 14).
>
> **4. Un certificado es una solicitud más emisor, validez y serial, y toda cadena termina en alguien que se firma a sí mismo.**
> Los Ej. 10 a 12 lo construyen con las manos: la solicitud lleva la clave pública y la autofirma como prueba de posesión; el certificado agrega lo que sólo un emisor puede poner; la raíz es un autofirmado en el que se confía **por decisión**, sea el `ca.cer` de la carpeta, la raíz del navegador, los dos introductores de Alice (Ej. 13) o la AC Raíz de la Jefatura de Gabinete (Ej. 14). Verificar es recorrer la cadena hacia arriba hasta esa decisión.
>
> **5. Estructura algebraica expuesta a un oráculo es un ataque: `CCA` y `Sig-forge` lo miden.**
> Los Ej. 15, 16 y 17 son el mismo molde con tres primitivas: XOR maleable, verificación de `RSA` que va de firmas a mensajes, producto que `RSA` respeta. En los tres el adversario **no rompe nada** —ni la PRF, ni factoriza, ni invierte— sino que usa la estructura contra un oráculo. La respuesta de examen se escribe igual siempre: **exhibir el adversario**, mostrar que su consulta es legal, calcular que gana con probabilidad 1, y decir qué destruye la estructura (un MAC sobre el criptograma, un hash antes de firmar, un padding con integridad).
