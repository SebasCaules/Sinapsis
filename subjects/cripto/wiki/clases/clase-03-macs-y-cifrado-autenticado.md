---
title: Clase 03 — MACs y cifrado autenticado
resumen: 'La clase de integridad, dictada en dos jueves: del ataque de texto cifrado escogido a los MAC y CBC-MAC, las funciones de hash y HMAC, y el cierre en cifrado autenticado con CCM y GCM.'
fuentes: ["[[clase-02-cifrado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]", "[[guia-03-mac-y-funciones-de-hash]]"]
aliases: [Clase 3, Clase 03, MACs, Integridad, MAC y cifrado autenticado]
type: clase
clase: 3
orden: 1
hub: true
fecha: 2026-08-27
fecha_2: 2026-09-03
created: 2026-08-28
updated: 2026-09-06
tags: [clase, integridad, maleabilidad, cca, mac, cbc-mac, hash, merkle-damgard, hmac, cumpleanos, cifrado-autenticado, ccm, gcm, clase-03, transcripcion]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt1-Transcripcion.VTT", "raw/clases/Clase 03pt2 - Transcripcion.VTT"]
---

# Clase 03 — MACs y cifrado autenticado

> **27/08 y 03/09 de 2026** — dos jueves de **teoría** · docente **Pablo Abad** en las dos sesiones · [Filminas](../../raw/clases/Clase%2003%20-%20Criptografia%20-%20MACs%20y%20Cifrado%20Autenticado.pdf) (41 slides, un solo PDF para las dos fechas)
> Transcripciones: [27/08](../../raw/clases/Clase%2003pt1-Transcripcion.VTT) (873 cues, 1h39) y [03/09](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT) (910 cues, 1h48) — **1783 cues, 3h27 en total**
> Práctica del 31/08: [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04 — MACs, hash y cifrado autenticado]] · Guía del 07/09: [[guia-03-mac-y-funciones-de-hash|Guía 3 — MAC y Funciones de Hash]], con los seis ejercicios resueltos
> Tarea que deja la clase: el ataque de sufijo al CBC-MAC de la filmina 21 → [[cbc-mac#Por qué la longitud como sufijo no sirve|CBC-MAC]]
> Lectura designada, encargada en voz el 03/09: **Katz & Lindell, cap. 4** — ver [[bibliografia|bibliografía]]
> Viene de: [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] · Sigue en: [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04 — Criptografía asimétrica y firma digital]]

**La clase es un arco cerrado, y el ejemplo que la abre es el mismo que la cierra.** Empieza con un criptosistema CPA-Secure al que igual le adulteran la base de sueldos, y termina ocho días después devolviendo la respuesta: el [[cifrado-autenticado|cifrado autenticado]]. Entre las dos puntas se repite cuatro veces el mismo movimiento —ataque concreto, prueba formal, construcción que la pasa, ataque a la construcción, arreglo—, el método que la [[clase-02-cifrado|Clase 02]] fijó con `Eav`.

**El orden es una escalera de exigencias: cada primitiva entra porque la anterior falló una prueba.** El cifrado no pasa `CCA`, así que aparece el [[message-authentication-code|MAC]]; el MAC no da confidencialidad, así que aparece la composición; la composición duplica la clave, así que aparecen los [[ccm-y-gcm|modos autenticados]]. Las [[funciones-de-hash-criptograficas|funciones de hash]] entran por el costado —*"los primos hermanos de los MAC"*, y la primera construcción **sin clave**—, lo que obliga a rehacer con ellas el recorrido entero.

**Dos jueves, un solo PDF, y el corte está medido.** El 27/08 llega hasta la filmina 21 y no menciona en ningún cue las palabras *hash*, *colisión* ni *preimagen*; el 03/09 abre en la 22 y cierra en la 41. Con dos salvedades: la segunda sesión dedica doce minutos a repasar en voz las filminas 13 a 21 —con material que no está en ninguna lámina— y **no recorre el PDF en orden**, porque saltea la 33 y vuelve recién después de la 35.

## El recorrido, tramo por tramo

| # | Tramo | Qué se dio | Dónde está desarrollado |
|---|---|---|---|
| 1 | **Repaso y mesa de herramientas** (filminas 2-4) | El criptosistema y la prueba `CPA` como quedaron, y el menú de lo que la pasa. Fuera de filmina, por qué el bloque le ganó al flujo | [[criptosistema\|Criptosistema]] · [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] · [[primitiva-de-cifrado-en-bloque\|Cifrado en bloque]] |
| 2 | **La base de sueldos** (5-10) | El ataque en cuatro pasos —copiar la fila del jefe, el arreglo que no alcanza, la modificación quirúrgica— y su backstage: el formato y la aritmética del XOR | [[maleabilidad\|Maleabilidad]] · [[criptosistema-de-flujo\|Cifrado de flujo]] |
| 3 | **CCA** (11-12) | El `CPA` con un oráculo de descifrado y una sola restricción. **Nada de lo visto lo pasa**, y el ejercicio lo demuestra con una consulta | [[ataque-de-texto-cifrado-escogido\|Texto cifrado escogido]] · [[pruebas-de-indistinguibilidad\|Pruebas de indistinguibilidad]] |
| 4 | **El MAC, Mac-Forge y los tres candidatos** (13-17) | La terna $\mathsf{Gen}$, $\mathsf{Mac}$, $\mathsf{Vrfy}$, con una etiqueta que no es secreta y no reconstruye el mensaje; la prueba que mide lo que el servicio promete, con **la lección de 2004** que justifica su exigencia; y los tres MACs de juguete que caen en clase | [[message-authentication-code\|MAC]] · [[seguridad-de-un-mac\|Seguridad de un MAC]] |
| 5 | **CBC-MAC** (18-21) | La primera construcción infalsificable, el ataque de longitud variable, las tres extensiones seguras y el ataque de sufijo que quedó de tarea | [[cbc-mac\|CBC-MAC]] · [[modos-de-encadenamiento\|Modos de encadenamiento]] |
| 6 | **El repaso hablado del 03/09** (13-21; sólo se reproyectan la 14 y la 15) | Las **dos definiciones de integridad** —controlar contra detectar—, la fuerza bruta sobre las etiquetas y los tamaños reales de un MAC | [[message-authentication-code\|MAC]] · [[ataque-de-fuerza-bruta\|Fuerza bruta]] |
| 7 | **Funciones de hash** (22-23) | El par $\mathsf{Gen}$/$\mathsf{Hash}$, el **selector que no es una clave**, el efecto avalancha y el nombre explicado desde las tablas de hash | [[funciones-de-hash-criptograficas\|Funciones de hash]] |
| 8 | **Colisiones y las tres resistencias** (24-28) | Existen siempre; qué separa segundas preimágenes de colisiones; `Hash-Coll` y para qué está la selección. Y el **commitment**, fuera de filmina | [[resistencias-de-una-funcion-de-hash\|Las tres resistencias]] |
| 9 | **Merkle-Damgård** (29) | El modelo iterativo y la función de compresión que carga la seguridad; la longitud al final como **compromiso a favor del streaming** | [[construccion-de-merkle-damgard\|Merkle-Damgård]] |
| 10 | **De MD5 a SHA-3** (30-32) | Media hora de relato fuera de filmina: el linaje MD, `SHA-0` y la NSA, **2004** como cisma del área, y por qué el concurso lo gana un modelo distinto | [[primitivas-de-hash-estandar\|Primitivas de hash]] · [[des-y-3des\|DES y 3DES]] |
| 11 | **Cuánto cuesta romperlas, y qué usar** (34-35) | Las tres cotas y la **paradoja del cumpleaños**, con la salvedad de que la jerarquía sólo vale asintóticamente. Después `SHA-3` de 256, y **de qué me protejo y de quién** | [[seguridad-de-las-funciones-de-hash\|Seguridad de los hashes]] · [[riesgo-y-seguridad-relativa\|Riesgo y seguridad relativa]] · [[ataque-de-diccionario-sobre-hashes\|Ataque de diccionario]] |
| 12 | **HMAC** (33, fuera de orden) | La segunda forma de construir un MAC: qué exige la prueba de las constantes, por qué el mensaje se procesa una sola vez y por qué domina en las librerías | [[hmac\|HMAC]] |
| 13 | **Privacidad e integridad** (36) | Ni el hash ni el MAC dan confidencialidad. Las tres formas de combinarlas, y por qué sólo la tercera tiene demostración general — más la **agilidad criptográfica** | [[privacidad-e-integridad\|Privacidad e integridad]] · [[agilidad-criptografica\|Agilidad criptográfica]] |
| 14 | **Cifrado autenticado, CCM y GCM** (37-41) | La construcción genérica, el resultado `CCA`-Secure y el **modo de falla nuevo**: descifrar puede fallar. Después, integridad **sin duplicar la clave** —counter con `CBC-MAC`, y `GHASH` sobre Galois— y la regla final: cuando piden confidencialidad, **la integridad está implícita** | [[cifrado-autenticado\|Cifrado autenticado]] · [[ccm-y-gcm\|CCM y GCM]] · [[bibliografia\|Bibliografía]] |

## Las seis ideas que hay que llevarse

1. **El cifrado no da integridad, y el contraejemplo no descifra nada.** El atacante copia una fila y la retoca byte a byte sin conocer la clave ni el sueldo: la confidencialidad queda intacta y el sistema se rompe igual.
2. **Cada primitiva entra porque la anterior falló una prueba.** `CPA` → `CCA` → MAC → hash → cifrado autenticado no es una lista de temas sino una cadena de fracasos, y una prueba sirve para **decidir si algo se puede usar en un escenario dado**.
3. **La etiqueta tiene que cubrir todo el mensaje, y la longitud nunca va al final.** Los tres MACs de juguete caen por ignorar parte del mensaje, y el `CBC-MAC` y Merkle-Damgård por el mismo motivo estructural: los *extension attacks*.
4. **La propiedad más fuerte es la más barata de romper.** Resistencia a colisiones implica las otras dos y su ataque genérico cuesta $\lvert B\rvert^{1/2}$ por la [[seguridad-de-las-funciones-de-hash|paradoja del cumpleaños]]: un hash de $L$ bits da $L/2$ de seguridad, y por eso lleva **el doble de bits que las claves**.
5. **Un hash no autentica: le falta la clave.** `HMAC` y `CBC-MAC` son las dos formas de construir un MAC sobre otra primitiva, y lo que las separa **no es la seguridad sino el costo**.
6. **`Encrypt-then-MAC` es la única con demostración general**, y por eso hoy no hay razón para cifrar sin autenticar: `AES-GCM` cuesta lo mismo y trae la integridad adentro.

## Para el parcial

- Reconstruir el **ataque de maleabilidad**: qué necesita saber el atacante, por qué el formato es público, y la cuenta $\mathsf{Dec}_k(c\oplus x) = m \oplus x$.
- Escribir **`CCA`** con su única restricción y **construir el adversario** que rompe el flujo; la estructura —anular con un xor conocido y después leer— se repite en el ataque al `CBC-MAC`.
- Dar **`Mac-Forge`** completo y saber por qué la cota es **despreciable y no un medio**, al revés que en las pruebas de indistinguibilidad.
- **Falsificar los tres MACs de la filmina 17**; el tercero se verifica por **inversión**, no por recomputación.
- El **`CBC-MAC`** con su ataque de longitud variable y las tres extensiones seguras.
- Las **tres resistencias** y la jerarquía **con su salvedad**: en dominios chicos no vale, y eso habilita el [[ataque-de-diccionario-sobre-hashes|ataque de diccionario]] del Ej. 6 de la [[guia-03-mac-y-funciones-de-hash|Guía 3]].
- Los **tres exponentes** de la filmina 34 y de dónde sale la raíz cuadrada. Y que donde diga *"libre de colisiones"* hay que leer **resistente a colisiones**.
- Las **tres formas** de combinar privacidad e integridad, cuál es insegura y por qué sólo la tercera se demuestra en general.

Dos temas de la semana que **no** salen de la teórica: la [[construccion-de-macs-a-partir-de-una-prf|construcción de MACs sobre una función pseudoaleatoria]] —el escalón entre el MAC de longitud fija y el `CBC-MAC`— y los [[ataques-de-repeticion-y-frescura|ataques de repetición y la frescura]], que `Mac-Forge` deja afuera por definición. Los aporta la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]].

## Estado de las fuentes

**Las filminas son fichas técnicas: la carga está en la voz.** Fuera del PDF quedan el linaje MD, `SHA-0` y la NSA, el cisma de 2004, la diversidad de diseño, la definición de integridad, los tamaños de un MAC, el *commitment*, la seguridad relativa, el costo comparado de `HMAC` y `CBC-MAC` y el modo de falla del descifrado autenticado. Cada uno se cita, con su cue, en su concepto.

**Cada `.VTT` numera sus cues desde 1**, así que todo cue lleva prefijo: `pt1` es el 27/08, `pt2` el 03/09. Los dos son automáticos —*"Wandame Pan"* por *One Time Pad*, *"Cats"* por *Katz*—: las citas se normalizan y las correcciones van entre corchetes. **Cuatro alumnos participan por voz** —el 03/09 son 22 cues sobre 910—, y de ahí salen varias de las mejores explicaciones de la jornada: van atribuidas por nombre en cada concepto.

> [!discrepancia]- Seis erratas y precisiones de las filminas
> | Filmina | Dice | Qué vale |
> |---|---|---|
> | 15 | `Mac-Forge` corre contra *"un **Criptosistema**"* | va **un MAC**, y **la corrige el docente en vivo**: es la única errata que la cátedra reconoce → [[seguridad-de-un-mac\|MAC]] |
> | 3, 11, 15 y 22 | *"$= 0{,}5 + \varepsilon$"*, `neg(n)`, y $\varepsilon$ donde va $\in$ | el margen va **despreciable en $n$**, la abreviatura es $\mathsf{negl}$ y el símbolo es **$\in$** → [[pruebas-de-indistinguibilidad\|Pruebas]] |
> | 8, 10 y 21 | el XOR cierra en `2F69F0`; el ataque de sufijo | es **`2F69E0`**, y se arrastra al criptograma adulterado; el de la 21 queda **incompleto** → [[maleabilidad\|Maleabilidad]] · [[cbc-mac\|CBC-MAC]] |
> | 31, 32 y 35 | `SHA-1` *"sobre la base de MD5"*; $2^{64}$ bits para `SHA-3`; *"Kekkak"*; `SHA-1` recomendada sin marca | comparten linaje, no construcción; la esponja no tiene tope; es **Keccak**; y lo último no es maquetación sino **la posición de la cátedra**, contra la que la wiki disiente → [[primitivas-de-hash-estandar\|Primitivas]] |
> | 33 | `opad` e `ipad` **intercambiados**, y `HMAC` sin escalón previo | el RFC 2104 los da al revés y la Práctica 04 repite la errata: **es sistemática**. El escalón que falta es **`NMAC`** → [[hmac\|HMAC]] |
> | 36 a 39 | *"Cifrar, luego Autentificar — siempre es seguro"*; *"$m = /$"*; `CCM` y `GCM` sin reservas | faltan **claves independientes**; el fallo es $\perp$, rasgo distintivo de la construcción; `CCM` **está en retirada**, y `GHASH` se lleva la única advertencia crítica → [[privacidad-e-integridad\|Privacidad e integridad]] · [[cifrado-autenticado\|Cifrado autenticado]] · [[ccm-y-gcm\|CCM y GCM]] |
>
> **Tres cosas que parecen erratas y no lo son** —el *"⇒ Π es"* de la 15, el *"264 bits"* de las 30-32 y el `CPAA,Π` de las 3 y 11— son artefactos de `pdftotext`, registrados en sus conceptos.

> [!discrepancia]- Siete afirmaciones de la voz que no cierran con la historia
> Ninguna afecta el argumento del docente, y todas están corregidas en su concepto. **Merkle** no era de IBM —Stanford, Berkeley y Xerox PARC— y Damgård es danés; **`SHA-0` y `SHA-1`** tampoco se comisionaron a IBM, las diseñó la NSA; **Keccak** no la coescribió Rijmen sino **Joan Daemen**; fueron **64 propuestas y 5 finalistas**, no 63 y 3; **`SHA-2`** es de 2002 y **`SHA-3`** de 2015, no de 2013; la patente que frenó ocho años una adopción es la de **`OCB`**, no la de `GCM`, que además es posterior a `CCM`; y **`SSH`** no instancia *authenticate-then-encrypt* —ése es `SSL`/`TLS`— sino la primera forma, con lo que el argumento del docente queda más fuerte.

> [!nota]- Seis cabos sueltos, y lo que cerró la segunda sesión
> - **El material prometido al campus** —la demostración de `CCM` y las *"propiedades no tan básicas"* del cierre— **no está en `raw/`**, y sin él la prueba que habilita una sola clave en `CCM` queda sin verificar.
> - **El ejercicio de la filmina 38**, esquematizar un cifrado con `AES-CCM`, no se enunció en voz ni lo trae la Guía 3; se resolvió igual en [[ccm-y-gcm|CCM y GCM]].
> - **Katz capítulo 4 contra 5**: la cátedra pone todo el bloque de integridad en el 4 y el vault cita el 5 para hash → [[bibliografia|bibliografía]].
> - **La cuenta de los modos no cierra**: el docente dice *"5 mecanismos, ignorando el `ECB`"*, y [[modos-de-encadenamiento|Modos de encadenamiento]] registra cinco con él.
> - **"Rodri"**, el docente al que atribuye la clase de bloques, es grafía del ASR sin confirmar en el [[reglamento-y-evaluacion|reglamento]].
> - **No hay una sola mención del parcial** en los 1783 cues: es el patrón de esta clase.
>
> **Lo que cerró la ingesta del 03/09**: la segunda mitad sin transcripción; la lectura de Katz; el ataque de sufijo al `CBC-MAC`, que la cátedra resolvió en el Anexo de la Práctica 04; la filmina 23; y la sospecha de *rainbow tables*, con cero apariciones. Nota de archivo: hasta el 04/09 la segunda grabación se llamaba `Clase 04 - Transcripcion.VTT` y **no era la Clase 4** — `raw/` se numera por **sesión**, no por tema. Los [[video-04-integridad-de-la-informacion-1|videos 04]] y [[video-05-integridad-de-la-informacion-2|05]] de Ramele cubren el mismo temario con otro docente.
