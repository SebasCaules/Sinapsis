---
title: Parciales viejos
resumen: 'Cuatro primeros parciales de la materia entre 2018 y 2025, resueltos a mano y verificados uno por uno: la única muestra de evaluación real del vault y de qué se toma de verdad.'
fuentes: ["[[cronograma]]", "[[reglamento-y-evaluacion]]", "[[clase-05-protocolos-criptograficos]]"]
aliases: [Parciales viejos, Primeros parciales, Parciales resueltos, Exámenes viejos, Modelos de parcial]
type: catedra
clase: catedra
orden: 6
created: 2026-09-04
updated: 2026-09-04
tags: [catedra, parcial, examenes, resoluciones, protocolos, secreto-perfecto, modos, certificados, shamir]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Parciales viejos

**Cuatro primeros parciales de la materia, resueltos a mano, entre 2018 y 2025.** Es la única muestra de evaluación real que tiene el vault, y contesta la pregunta que ninguna filmina contesta: **qué se toma de verdad.**

> Fuente: [`raw/parciales/Cripto - Primeros Parciales.pdf`](../../raw/parciales/Cripto%20-%20Primeros%20Parciales.pdf) — 13 páginas, escaneadas de un cuaderno el 23/04/2026. Los enunciados están pegados como recortes del PDF original de cada parcial; las resoluciones son manuscritas.
> **No es material de la cátedra**: es el apunte de un estudiante. Los enunciados sí son de la cátedra; las resoluciones son de quien escribió el cuaderno, y esta nota las **verifica una por una** en vez de darlas por buenas — ver [[#Discrepancias con el apunte|Discrepancias con el apunte]].

> **Ojo: esto no es lo que el docente prometió.** El 20/08 Ramele recorre el campus y dice *"ahí tienen los ejemplos de parcial"*, bajo la carpeta de Prácticas (cue pt2 521, ver [[bibliografia#El material del campus, recorrido en pantalla el 20/08|inventario del campus]]). **Aquéllos siguen sin estar en `raw/`.** Este PDF llegó por otra vía y los cuatro parciales son reales, pero no hay ninguna garantía de que sean los mismos que la cátedra publica ni de que estén completos.

---

## Qué hay, y de cuándo

| Parcial | Páginas | Ejercicios | Estado de la resolución |
|---|---|---|---|
| **2C-2025** | 2-4 | 5 | 4 resueltos · el **2 sin hacer** (marcado *"Skip"*) — **resuelto acá** |
| **1C-2025** | 5-7 | 5 | los 5 resueltos |
| **1C-2023** | 8-10 | 5 + múltiple choice | 4 resueltos · el 3b y 3c sin hacer (*"No lo vimos"*) |
| **1C-2018** | 11-12 | 5 | 2 resueltos · los Ej. 3, 4 y 5 marcados *"Repetido"* (son los del 1C-2023) |
| Shamir, Guía 6 | 13 | 2 | los 2 resueltos |

**Los cuatro son primeros parciales**, o sea que cubren el bloque de Criptografía: clases 1 a 5 según el [[cronograma]]. Coincide con lo que se ve: hay criptografía clásica, secreto perfecto, modos de encadenamiento, MAC y hash, asimétrica y protocolos.

---

## Lo que se toma de verdad

Ésta es la tabla que justifica la nota. Con sólo cuatro muestras no da para hablar de frecuencias, pero **hay tres patrones que se repiten en los cuatro**, y eso ya es información:

| Tema | 2C-2025 | 1C-2025 | 1C-2023 | 1C-2018 | Clase |
|---|---|---|---|---|---|
| **Analizar un protocolo** | Ej. 1 | Ej. 1 | Ej. 1 | Ej. 1 | [[clase-05-protocolos-criptograficos\|5]] |
| **¿Es válido este esquema de bloque?** | Ej. 3 | Ej. 2 | Ej. 2 y 4 | Ej. 3 y 4 | **2** |
| **Verdadero o Falso, con corrección** | Ej. 5 | Ej. 5 | Ej. 5 | Ej. 2 | varias |
| Secreto perfecto, demostrado | Ej. 4 | Ej. 4 | — | — | **1** |
| Criptoanálisis clásico | Ej. 2 | — | Ej. 3 | Ej. 2.2 | **1** |
| Certificados digitales y PKI | Ej. 5d | Ej. 5d | Ej. 3 | Ej. 2.1, 2.3 | [[clase-05-protocolos-criptograficos\|5]] |
| MAC, hash e integridad | Ej. 1, 5b | Ej. 3 | Ej. 5a, 5b | — | **3** |
| Diffie-Hellman | — | Ej. 1 | — | — | [[clase-04-criptografia-asimetrica-y-firma-digital\|4]] |

**Tres conclusiones operativas** *(lectura nuestra, sobre cuatro muestras)*:

1. **El Ejercicio 1 es siempre un protocolo**, en los cuatro, sin excepción. Y siempre con la misma estructura de consigna: *"¿qué tipo de protocolo sería, qué intenta construir?"*, seguido de *"¿qué problema tiene?"* o *"¿es susceptible a tal ataque?"*. Es material de la **Clase 5**, que ya tiene nota propia: [[clase-05-protocolos-criptograficos|Clase 05 — Protocolos criptográficos]]. Esa nota dedica su sección [[clase-05-protocolos-criptograficos#Para el parcial|Para el parcial]] exactamente a cruzar estos cuatro exámenes contra los tramos de la clase — con la misma tabla que ésta, mirada desde el otro lado. El caso más directo es el 1C-2018, que **es**, literalmente, el protocolo [[needham-schroeder|Needham-Schroeder]] desarrollado en esa clase.
2. **Siempre hay un esquema de cifrado en bloque inventado** y hay que decidir si es válido, si es CPA-seguro y cómo propaga errores contra `CBC`/`CTR`/`OFB`. Nunca se pregunta *"¿qué es CBC?"*: se pregunta *"¿esto sirve?"*.
3. **El último ejercicio es Verdadero o Falso con corrección obligatoria** —*"corrija la sentencia para que sea verdadera e identifique el cambio realizado"*—. No alcanza con marcar falso: hay que reescribir. Y las sentencias mezclan temas de todo el cuatrimestre.

> **Lo que estos cuatro parciales NO tienen:** ni un solo ejercicio de `CBC-MAC`, de Merkle-Damgård, de `HMAC`, de la paradoja del cumpleaños ni de `CCM`/`GCM`. La [[clase-03-macs-y-cifrado-autenticado|Clase 03]] aparece sólo como Verdadero o Falso y como *"¿este esquema da integridad?"*. *(Lectura nuestra, y con la salvedad obvia: cuatro parciales no son una muestra representativa, y el temario cambia de año en año.)*

---

## 2C-2025

### Ejercicio 1 — Protocolo de intercambio de claves con MAC

**Enunciado.**

Dado el siguiente protocolo

|  |  |  |  |
| --- | --- | --- | --- |
| (1.1) | $A \to B$ | $r_A$ | $r_A$ es un número al azar que elige A |
| (1.2) | $A \leftarrow B$ | $(B, A, r_A, r_B), h_K(B, A, r_A, r_B, K')$ | $r_B$ número al azar de B, $h_K(\cdot)$ MAC |
| (1.3) | $A \to B$ | $(A, r_B), h_K(A, r_B, K')$ |  |
| (1.4) | $A$ |  | $W = h'_{K'}(r_B)$ |
| (1.5) | $B$ |  | $W = h'_{K'}(r_B)$ |

donde A y B comparten dos claves simétricas $K$ y $K'$. $h'_{K'}(\cdot)$ es una función de MAC diferente de $h_K(\cdot)$ .

- a) ¿Qué tipo de protocolo sería? ¿Qué es lo que el protocolo intenta construir?
- b) ¿Qué le permiten hacer a A y B los mensajes cruzados 1.2 y 1.3?
- c) ¿Es este protocolo suceptible a un ataque MiTM? Justificar.

**La resolución del apunte, verificada.** Es un protocolo de intercambio de claves que busca establecer la clave de sesión $W$ y **autenticar a las dos partes**. El mensaje 1.2 le permite a $A$ validar que el mensaje no es viejo —por el nonce $r_A$ que ella misma eligió— y autenticar a $B$, porque con $K$ puede recomputar $h_K(B,A,r_A,r_B)$ sobre lo que recibe en claro. El 1.3 le permite a $B$ hacer lo mismo respecto de $A$. **No es susceptible a MitM**: la autenticación es mutua y se apoya en claves previamente compartidas, así que un atacante que no conoce $K$ ni $K'$ no puede hacerse pasar por ninguno de los dos.

**Lo que hay que ver acá** *(agregado nuestro)*: el nonce hace **frescura** y el MAC hace **autenticación de origen**, y son dos servicios distintos que el protocolo necesita a la vez — exactamente la distinción de [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]]. Un MAC sin nonce sería replayable aunque fuera infalsificable.

> No es literalmente ninguno de los protocolos que trae la [[clase-05-protocolos-criptograficos|Clase 05]] —no hay KDC ni certificado de por medio—, pero el criterio para decidir si resiste `MITM` es el mismo que esa clase desarrolla en [[ataques-activos-y-man-in-the-middle|Ataques activos y man in the middle]]: un atacante sin las claves compartidas no puede fabricar los MAC que autentican cada mensaje, así que no puede interponerse sin ser detectado. *(Cruce nuestro; el enunciado no lo pide.)*

### Ejercicio 2 — El Vigenère que el apunte no resolvió

**Enunciado.**

El siguiente texto fue encontrado en una botella en la guerra de los Roses

"GWAOESFENITLAGEUGEDRVPHJVCDFDR"

Se sabe que el mensaje fue encriptado con clave y estaba en castellano con un alfabeto de 26 letras.

- (a) Detallar cómo sería el abordaje para criptoanalizar el mensaje.
- (b) Intentar encontrar la clave y el mensaje.

Teniendo en cuenta que la frecuencia (aproximada) de aparición de letras en castellano es la siguiente:

| Letra | A | B | C | D | E | F | G | H | I | J | K | L | M | N | Ñ | O | P | Q | R | S | T | U | V | W | X | Y | Z |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| % | 13 | 1 | 4 | 5 | 13 | 1 | 1 | 1 | 7 |  |  | 5 | 3 | 7 | 0 | 9 | 3 | 1 | 7 | 8 | 4 | 4 | 1 |  |  | 1 |  |

Figura 1: Frecuencias de aparición de letras en castellano.

El apunte anota *"Es un Vigenère con clave `CLAVE`, el enunciado lo dice medio escondido"* y a continuación escribe **`Skip`**: la corazonada está, la cuenta no.

**Resuelto acá, y cierra.** Con $k = \texttt{CLAVE}$ y $m_j = (c_j - k_j) \bmod 26$:

$$\texttt{GWAOESFENITLAGEUGEDRVPHJVCDFDR} \;\longrightarrow\; \texttt{ELATAQUESERAALASVEINTEHORASFIN}$$

o sea **`EL ATAQUE SERA A LAS VEINTE HORAS FIN`**. Las 30 letras del criptograma dan 30 de texto plano y el mensaje es castellano corrido, así que no hay ambigüedad.

**El juego de palabras del enunciado.** *"Fue encriptado con clave"* no es una aclaración obvia: **es el dato**. La clave literalmente es la palabra `CLAVE`. Es el mismo tipo de gancho que la Clase 01 usa con `LACABEZA` en el ejercicio de sustitución por símbolos.

> **Cómo se resolvería sin el gancho** *(agregado nuestro, que es lo que el ítem (a) pide de verdad).* El abordaje es el estándar de [[cifrado-de-vigenere|Vigenère]]: (1) [[test-de-kasiski|test de Kasiski]] sobre las secuencias repetidas para proponer candidatos de longitud de clave; (2) [[indice-de-coincidencia|índice de coincidencia]] sobre los $t$ sub-textos para confirmar cuál $t$ hace saltar el IC a $\approx 0{,}0775$; (3) con $t$ fijo, el problema se **factoriza en $t$ rotaciones independientes** y cada una cae por [[criptoanalisis-por-frecuencias|análisis de frecuencias]] contra la tabla que el propio enunciado adjunta. Con 30 letras y $t=5$ quedan sub-textos de 6 caracteres, que es **poco para que las frecuencias sean confiables** — de ahí que el enunciado regale el gancho.

### Ejercicio 3 — ¿Es válido este esquema?

**Enunciado.**

Consideren el siguiente sistema de encripción en bloque para los mensajes $M_1M_2 \ldots M_n$, que generan los cifrados $C_0C_1C_2 \ldots C_n$.

$$\begin{aligned} C_0 &= IV \\ C_i &= E_k(C_{i-1} \oplus M_i), i = 1, 2, \ldots \end{aligned}$$

- a) ¿Es este un esquema de cifrado en bloque válido? Explicar y eventualmente corregirlo para que lo sea.
- b) Comparar la confidencialidad y la tolerancia a errores de transmisión de este sistema contra CBC, CTR y OFB.

**Verificado: es exactamente `CBC`.** El apunte lo dice —*"no es más que un encadenamiento CBC"*— y demuestra la validez exhibiendo la inversa: $D_k(C_i) = C_{i-1}\oplus M_i$, luego $M_i = D_k(C_i)\oplus C_{i-1}$. Es invertible, entonces es válido.

Para confidencialidad y errores, ver [[modos-de-encadenamiento|Modos de encadenamiento]]: `CBC` es CPA-seguro **siempre que el IV sea aleatorio**, y un bit malo en $C_i$ afecta **exactamente dos bloques**. Acá el apunte se equivoca sobre `OFB` → [[#Discrepancias con el apunte|Discrepancias]].

### Ejercicio 4 — Secreto perfecto de un Vigenère formal

**Enunciado.**

Se define un criptosistema de encripción simétrica $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ con un alfabeto de 26 letras con $K = k_1k_2k_3...k_l$ con $k_i \in \{0, ..., 25\}$. Los mensajes $M = m_1m_2...m_n$ donde $m_i \in \{0, ..., 25\}$. La encripción $\mathsf{Enc}$ procede como

$$c_j = (m_j + k_{((j-1)\bmod l)+1})(26)$$

y la desencripción $\mathsf{Dec}$

$$m_j = (c_j - k_{((j-1)\bmod l)+1})(26)$$

Demostrar si este sistema tiene secreto perfecto y ante que condiciones sobre los parámetros.

La resolución del apunte está completa y es correcta; conviene tenerla porque es el molde de lo que se pide:

**Si $l < n$** (la clave se repite), entonces $m_j$ y $m_{j+l}$ usan la misma $k$, y restando:

$$c_j - c_{j+l} = m_j - m_{j+l} \pmod{26}$$

El criptograma **revela una relación entre los mensajes sin depender de la clave**. No hay secreto perfecto.

**Si $l = n$** (clave tan larga como el mensaje, o sea un [[one-time-pad|One Time Pad]] sobre $\mathbb{Z}_{26}$), cada $k_i$ es uniforme e independiente, $\Pr[K{=}k] = (1/26)^{n}$. Fijados $c$ y $m$, la clave queda determinada: $k_j = c_j - m_j \pmod{26}$, **una sola** produce ese cifrado. Entonces

$$\Pr[C{=}c \mid M{=}m] \;=\; \Pr[K = c-m] \;=\; \left(\tfrac{1}{26}\right)^{n}$$

que **no depende de $m$**, así que $\Pr[C{=}c\mid M{=}m_0] = \Pr[C{=}c\mid M{=}m_1]$ para todo par. Hay secreto perfecto.

> **La condición que se pide nombrar es $l \ge n$ con clave uniforme y de un solo uso**, que es el teorema de Shannon instanciado: $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ ([[secreto-perfecto|Secreto perfecto]]). El ejercicio es, en el fondo, *"demostrá que Vigenère con clave del largo del mensaje es un OTP"*.

### Ejercicio 5 — Verdadero o Falso

**Enunciado.**

Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.

- a) MD5 es un criptosistema de encripción asimétrico que no debe ser utilizado porque usa una longitud de clave de 128 bits.
- b) Un protocolo de autenticación basado únicamente en un MAC simétrico provee confidencialidad, integridad y no repudio entre las partes.
- c) El uso de padding aleatorio en la implementación del algoritmo de clave pública de RSA es para que el algoritmo sea seguro a ataque de textos cifrados elegidos.
- d) Un certificado digital emitido por una autoridad certificante contiene siempre la clave pública de la CA.

| Sentencia | Apunte | Verificación |
|---|---|---|
| a) `MD5` es un criptosistema **asimétrico** que no debe usarse porque usa clave de 128 bits | Falso: es una **función de hash** | Correcto. Y la razón real de no usarlo es que está **quebrada** —colisión en $<2^{20}$ operaciones—, no la longitud; los 128 bits son la **salida**, no una clave ([[primitivas-de-hash-estandar\|03.09]]) |
| b) Un protocolo basado sólo en un MAC simétrico provee confidencialidad, integridad y **no repudio** | Falso: sólo integridad y autenticación | Correcto — y la razón del no repudio es que **la clave es compartida** ([[message-authentication-code\|03.03]]) |
| c) El padding aleatorio en RSA es para que sea seguro ante **texto cifrado elegido** | Falso: *"se hace para que sea CPA-Secure"* | Correcto — confirmado por la filmina 27 de la Clase 4, ver [[#Discrepancias con el apunte\|Discrepancias]] |
| d) Un certificado emitido por una CA contiene siempre la **clave pública de la CA** | Falso: contiene la del **titular** | Correcto. El certificado lleva la clave pública del titular y va **firmado** con la privada de la CA — es exactamente la trampa que documenta [[certificados-digitales\|Certificados digitales]] |

---

## 1C-2025

### Ejercicio 1 — Diffie-Hellman

**Enunciado.**

Dado el siguiente protocolo

|  |  |  |  |
| --- | --- | --- | --- |
| (1.1) | $A \to B$ | $G, q, g$ |  |
| (1.2) | $A$ |  | $x \leftarrow \mathbb{Z}_q$ |
| (1.3) | $A$ |  | $h_1 = g^x$ |
| (1.4) | $A \to B$ | $h_1$ |  |
| (1.5) | $B$ |  | $y \leftarrow \mathbb{Z}_q$ |
| (1.6) | $A \leftarrow B$ | $h_2$ | $h_2 = g^y$ |
| (1.7) | $A$ |  | $k_A = h_2^x$ |
| (1.8) | $B$ |  | $k_B = h_1^y$ |

donde $A(G, q, g)$ elige un Grupo $G$ $\mathbb{Z}_q$ con una raíz primitiva $g$.

- a) ¿Qué tipo de protocolo sería, qué es lo que el protocolo intenta construir?
- b) Mostrar un ejemplo numérico acotado cómo opera el protocolo. ¿Qué valores de $q$ son válidos y por qué?
- c) ¿En qué reside la seguridad computacional del algoritmo?
- d) Mencionar dos problemas que tiene este protocolo.

La resolución del apunte cubre los cuatro ítems: es **Diffie-Hellman**, genera un secreto compartido sobre un canal inseguro; $q$ tiene que ser **primo** para que exista la raíz primitiva; la seguridad computacional reside en que $x$ e $y$ **nunca se transmiten** y obtenerlos de $g^x$ y $g^y$ es el **problema del logaritmo discreto**, sin solución eficiente conocida; y los dos problemas son que **no resiste atacantes activos** —necesita un canal autenticado, o sea MitM— y que la exponenciación modular es cara al crecer los bits.

**El ejemplo numérico del apunte tiene un problema** *(precisión nuestra)*: usa $\mathbb{Z}_5$ con $g=2$, $x=3$, $y=4$, y llega a $h_1 = 2^3 = 8 \equiv 3$, $h_2 = 2^4 = 16 \equiv 1$, $k_A = 1^3 = 1$, $k_B = 3^4 = 81 \equiv 1$. Las cuentas cierran y el secreto coincide, **pero el ejemplo es degenerado**: da $k = 1$, que es el peor valor posible para ilustrar nada. Conviene rehacerlo con otros exponentes —por ejemplo $x=2$, $y=3$ sobre $\mathbb{Z}_5$ con $g=2$: $h_1 = 4$, $h_2 = 3$, $k_A = 3^2 = 9 \equiv 4$, $k_B = 4^3 = 64 \equiv 4$— antes de usarlo como modelo de respuesta.

> Esto es el concepto [[diffie-hellman|Diffie-Hellman]] de la [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]], que el vault ya tiene ingerida —sólo contra las filminas, sin transcripción, porque la clase todavía no se dictó (es el 10/09)—. Los siete pasos que formaliza esa nota coinciden exactamente con los ocho de este enunciado, y confirman los cuatro puntos de la resolución del apunte: el problema del **logaritmo discreto**, la necesidad de **canal autenticado** contra `MITM`, y que la seguridad reposa en que $x$ e $y$ nunca viajan.

### Ejercicio 2 — El esquema que parece CBC y no lo es

**Enunciado.**

Consideren el siguiente sistema de encripción en bloque para los mensajes $M_1M_2 \ldots M_n$, que generan los cifrados $C_0C_1C_2 \ldots C_n$.

$$\begin{aligned} C_0 &= IV \\ C_i &= E_k(M_i) \oplus C_{i-1}, i = 1, 2, \ldots \end{aligned}$$

- a) ¿Es este un esquema de cifrado en bloque válido? Explicar.
- b) Comparar la confidencialidad y la tolerancia a errores de transmisión de este sistema contra CBC, CTR y OFB.

**Cuidado con éste, porque es el gemelo tramposo del Ej. 3 del 2C-2025.** Ahí la primitiva envuelve al encadenamiento —$E_k(C_{i-1}\oplus M_i)$, que es `CBC`—; acá el encadenamiento envuelve a la primitiva. **No es `CBC`, y no es CPA-seguro.**

*Validez*: sí. $D_k$ existe porque $M_i = D_k(C_i \oplus C_{i-1})$.

*Confidencialidad*: **no es CPA-seguro**, y el ataque del apunte es correcto y vale la pena tenerlo escrito. De $C_i = E_k(M_i)\oplus C_{i-1}$ sale

$$C_i \oplus C_{i-1} = E_k(M_i)$$

o sea que **dos bloques contiguos revelan una función determinística del bloque de mensaje**. El adversario elige

$$m_0 = M \Vert M \quad\text{(dos bloques iguales)}, \qquad m_1 = M \Vert M'$$

y recibe $C_0, C_1, C_2$. Entonces calcula $C_1 \oplus C_0$ y $C_2 \oplus C_1$:

- si el mensaje era $m_0$, los dos valen $E_k(M)$ y **coinciden**;
- si era $m_1$, valen $E_k(M)$ y $E_k(M')$ y **difieren**.

Emite $b' = 0$ si coinciden. Acierta con **probabilidad 1**. Es el mismo defecto que prohíbe [[modos-de-encadenamiento|ECB]]: bloques iguales producen huella igual, y el IV no lo tapa porque se cancela al xorear bloques contiguos.

### Ejercicio 3 — ¿Este esquema da integridad?

**Enunciado.**

Dado el siguiente criptosistema $c = E_{k1}(\,m \Vert H(k2 \Vert m)\,)$.

donde $m$ es un mensaje de tamaño fijo, $H$ es una función de hash criptográfica, $E_k(\cdot)$ es una primitiva de encripción simétrica y $\Vert$ implica concatenación; $k1$ y $k2$ son claves compartidas entre Bob y Alice.

- a) Detallar el paso a paso itemizado de lo que debería hacer el receptor al recibir $c$.
- b) ¿Puede un atacante modificar el mensaje? Explicar la integridad del criptosistema.
- c) ¿Provee el protocolo algún esquema de autenticación? Explicar.
- d) ¿Provee el esquema algún mecanismo de no-repudio? Explicar.

La resolución del apunte es correcta en los cuatro puntos, y el (b) es el que importa: **es `authenticate-then-encrypt`**, la segunda de las [[privacidad-e-integridad|tres formas de combinar]], la que *"puede ser segura pero requiere prueba"*. El apunte dice que el atacante **sí puede modificar** porque *"primero se aplica el hash y luego se encripta"*, y que **lo correcto sería cifrar y luego autenticar**.

> **Matiz necesario** *(precisión nuestra).* La conclusión —preferir `Encrypt-then-MAC`— es la correcta y es la de la cátedra. Pero el argumento *"puede introducir un cambio tal que $c' = (m'\Vert t')$ y pasaría la validación"* está incompleto: para fabricar ese $c'$ el atacante tendría que producir un $t' = H(k_2\Vert m')$ **sin conocer $k_2$**, que es justamente lo que la construcción impide. Lo que falla de verdad en *authenticate-then-encrypt* es que **obliga a descifrar para poder verificar**, y eso abre los ataques de **oráculo de padding** que se llevaron puesto a `TLS` hasta la 1.2. La respuesta correcta al ítem (b) es *"no puede falsificar, pero el orden es igualmente malo, y ésta es la razón"*.

Sobre (c) y (d): provee **autenticación simétrica** —el receptor confirma que el emisor tiene $k_2$— pero **no identidad individual** ni **no repudio**, porque las claves son compartidas y no se puede distinguir cuál de los dos emitió.

### Ejercicio 4 — Secreto perfecto con una clave de dos bits

**Enunciado.**

Dado el siguiente criptosistema $Exp_{eav}(\mathbf{A}, n)$, verificar si un atacante tiene éxito en un ataque de texto cifrado.

$$c = E_k(m) = (m \oplus k_0) \oplus f(k_1),$$

con $f(\cdot)$ la función identidad, $f(0) = 0$ y $f(1) = 1$ y $k = k_0k_1 \in \{0,1\}^2$ uniformemente distribuídas, y teniendo en cuenta $m, c \in \{0,1\}$ y que $Pr[m = 0] = 0{,}9$ y $Pr[m = 1] = 0{,}1$.

El apunte lo resuelve **dos veces**: primero con Bayes y la tabla de verdad completa de los 8 casos, y después con el atajo. **El atajo es el que conviene reproducir en un parcial**:

$$\Pr[C{=}0\mid M{=}0] = \Pr[k{=}00] + \Pr[k{=}11] = \tfrac14+\tfrac14 = \tfrac12$$
$$\Pr[C{=}0\mid M{=}1] = \Pr[k{=}01] + \Pr[k{=}10] = \tfrac14+\tfrac14 = \tfrac12$$

y análogamente para $C{=}1$. Como $\Pr[C{=}c\mid M{=}m]$ **no depende de $m$**, hay [[secreto-perfecto|secreto perfecto]].

> **La lectura de una línea que el apunte no hace** *(agregado nuestro)*: $c = m \oplus k_0 \oplus k_1$, y **$k_0 \oplus k_1$ es uniforme en $\{0,1\}$** cuando $k$ es uniforme en $\{0,1\}^2$ —dos de las cuatro claves dan 0 y dos dan 1—. O sea que el esquema **es un One Time Pad de un bit disfrazado**, y por eso tiene secreto perfecto. Notar además que el sesgo $0{,}9 / 0{,}1$ de la distribución de $M$ **es una distracción**: el secreto perfecto no depende de cómo se distribuyan los mensajes.

### Ejercicio 5 — Verdadero o Falso

**Enunciado.**

Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.

- a) Cualquier función de encripción simétrica tiene que ser inyectiva.
- b) Los sistemas de encripción basados en clave pública utilizan una de las claves para encriptar/desencriptar y la otra para firmar.
- c) Para sistemas de cifrado con un código binario de tres bits, el número de cifrados de transposición diferentes es mayor que el número de cifrados de sustitución.
- d) Un certificado público contiene la clave privada de la entidad certificante.

| Sentencia | Apunte | Verificación |
|---|---|---|
| a) Cualquier función de encripción simétrica tiene que ser **inyectiva** | Verdadero | Correcto: si no, dos mensajes distintos darían el mismo cifrado y `Dec` no podría decidir. Es la **condición de corrección** de [[criptosistema\|01.01]] |
| b) En clave pública se usa una clave para encriptar/desencriptar y la otra para firmar | Falso: se encripta con la **pública** y se desencripta con la **privada**; se firma con la **privada** y se verifica con la **pública** | Correcto |
| c) Con un código binario de 3 bits, hay **más** cifrados de transposición que de sustitución | Falso: transposición $= 3! = 6$, sustitución $= 8! = 40320$ | Correcto. La transposición permuta **3 posiciones**; la sustitución es una biyección sobre las **8 cadenas** de 3 bits ([[cifrado-por-transposicion\|01.09]] contra [[cifrado-de-sustitucion-monoalfabetica\|01.05]]) |
| d) Un certificado público contiene la **clave privada** de la entidad certificante | Falso: contiene la pública del titular, firmada con la privada de la CA | Correcto — ver [[certificados-digitales\|Certificados digitales]] |

---

## 1C-2023

### Ejercicio 1 — Protocolo tipo TLS

**Enunciado.**

Dado el siguiente protocolo

|  |  |  |  |
| --- | --- | --- | --- |
| (1.1) | $C \to S$ | $C, C\#, N_C$ |  |
| (1.2) | $C \leftarrow S$ | $S, S\#, N_S, Cert(S, Sgn_{kS}(S))$ | Check Certificate |
| (1.3) | $C \to S$ | $E_{K_0}(kS), N$ | $k1 = H(K_0, N_C, N_S)$ |
| (1.4) | $C \to S$ | $E_{Kcs}(finished, MAC_k1(timestamp))$ | $Kcs = H(N, k1)$ |
| (1.5) | $C \leftarrow S$ | $E_{Kcs}(finished, MAC_k1(timestamp))$ |  |
| (1.6) | $C \to S$ | $E_{Kcs}(data)$ |  |
| (1.7) | $C \leftarrow S$ | $E_{Kcs}(data)$ |  |

donde $E(\cdot)$ es un esquema de cifrado simétrico, $Sgn(\cdot)$ es un esquema de firma digital.

- a) ¿Qué tipo de protocol sería, qué es lo que el protocolo intenta construir?
- b) ¿Cuál es el propósito de los mensajes (1.4) y (1.5)?
- c) ¿Por qué se deriva la clave $Kcs$ y no se usa en cambio la clave $K_0$?

La resolución cubre los tres ítems: es un protocolo de **autenticación e intercambio de claves** que construye una clave de sesión y un canal seguro con confidencialidad y **autenticación del servidor**; los mensajes 1.4 y 1.5 sirven para **validar que ambos tienen la misma $K_{cs}$**, con **timestamp contra replay** y **MAC por integridad**; y $K_{cs}$ se deriva en vez de usar $K_0$ porque $K_0$ es la **clave pública del servidor**, obtenida del certificado, o sea parte de un esquema asimétrico que no sirve para el intercambio simétrico posterior.

> **Es un protocolo *tipo TLS* disfrazado con otra notación**, y ahora el vault lo tiene desarrollado con nombre propio: [[tls-arquitectura-y-record|TLS: arquitectura y record]] y [[tls-handshake|TLS handshake]]. El certificado que trae $K_0$ es exactamente el mecanismo de [[certificados-digitales|Certificados digitales]] y [[x509|X.509]]: la clave del certificado es asimétrica y sirve para **autenticar y transportar** el material a partir del cual se deriva la clave de sesión, nunca para cifrar el tráfico en sí — la misma razón que da el apunte. *(Cruce nuestro.)*

### Ejercicio 2 — CTR con una primitiva sin inversa

**Enunciado.**

Una propuesta de un cifrador en bloque usando modo CTR usa una primitiva de encripción $E(\cdot)$ que no admite una primitiva de desencripción inversa.

- (a) ¿ Es este un sistema de encripción válido ? Explicar.
- (b) ¿ Cómo se utiliza el nonce en dicho sistema ?
- (c) ¿ Cuál es la ventaja de este sistema en términos de procesamiento ?

**Sí es válido, y ésta es la pregunta que separa a quien entendió `CTR` de quien lo memorizó.** El apunte lo resuelve bien: $C_i = M_i \oplus E_k(\text{nonce}\Vert i)$ y $M_i = C_i \oplus E_k(\text{nonce}\Vert i)$ — **la primitiva se usa hacia adelante en las dos direcciones**, nunca se invierte. Es lo que hace que `CTR` (y `OFB`, y `CFB`) sólo necesiten una **función pseudoaleatoria** y no una **permutación**; la misma distinción `PRF`/`PRP` que aparece en [[primitiva-de-cifrado-en-bloque|02.07]] y en [[cbc-mac|03.05]].

Sobre el nonce: es aleatorio, se concatena con el contador del bloque, y **no se puede repetir el par $(k, \text{nonce})$** ([[cifrado-probabilistico-nonce-e-iv|02.06]]). La ventaja de procesamiento es el **paralelismo**: no hay operaciones entre bloques, así que se cifra y descifra en paralelo y con acceso aleatorio.

### Ejercicio 3 — base64 como "cifrado"

**Enunciado.**

El banco de Estander usa base64 como sistema de encripción simétrica.

- a) ¿Puede este considerarse un sistema de encripción válido? Explicar.
- b) El CSO dice que su sistema ofrece confuseon y difusión. ¿Qué significa?
- c) El además insiste en que el sistema no es lineal. ¿Qué significa que un criptosistema simétrico sea no lineal? De un ejemplo de otro criptosistema lineal.

El apunte responde (a) correctamente —**no es un criptosistema**: no usa clave, no da confidencialidad y no hay dificultad computacional en revertirlo— y marca (b) y (c) como **"No lo vimos"**.

> **El apunte se equivoca al marcarlas "No lo vimos": el vault, cruzado, muestra que sí se vieron.** *Confusión* y *difusión* están definidas y nombradas en la propia [[primitiva-de-cifrado-en-bloque#Difusión y confusión: los dos objetivos|Primitiva de cifrado en bloque § Difusión y confusión]] —con cita textual del docente (cues pt2 44-56, 111): *"difusión: si yo altero algún bit, que se alteren muchos… confusión: que yo no pueda predecir cómo la alteración de un bit va a modificar los otros bits"*—, y **la respuesta a (b) sale de ahí**: es exactamente lo que ofrece un esquema de cifrado en bloque en lugar de un dato codificado en base64. *No linealidad* no aparece con ese nombre en una filmina de clase, pero sí como propiedad desarrollada: las **cajas $S$ son el único paso no lineal de DES** ([[des-descripcion-del-algoritmo|apunte de DES]]) y `Byte Sub` lo es de `AES` ([[aes|02.10]]), y la respuesta a (c) es que `base64` es una función **fija y lineal** —una tabla de sustitución de 6 a 8 bits sin clave— así que no tiene ninguna de las tres propiedades. *(Precisión nuestra, y también una corrección a esta misma nota: la versión anterior de este párrafo daba el hueco por real sin cruzar contra la Clase 02, que ya estaba ingerida cuando se escribió.)*

### Ejercicio 4 — Cuando el aleatorio deja de serlo

**Enunciado.**

Dado el siguiente criptosistema $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$.

Para $p \in \mathbb{Z}$ y $a, b, r \in \mathbb{Z}_p$, siendo la clave $k = (a, b)$ y siendo $r \leftarrow random$

$$\begin{aligned} c &= E_k(m) = (r, ar + b + m)_{(p)} \\ m &= D_k(c) = (-ar - b + c)_{(p)} \end{aligned}$$

donde $(\cdot)_{(p)}$ implica que opera con aritmética modular.

- a) Considerar una variante del criptosistema donde $r$ en lugar de ser aleatorio toma el valor $r = (a+b)_{(p)}$ ¿es este criptosistema seguro contra ataque de texto cifrado elegido? Demostrar mediante un experimento $\mathrm{PrivK}^{\mathrm{CPA}}_{\mathcal{A},\Pi}$

Correcto y bien visto: con $r$ fijo queda

$$c = \bigl(a+b,\; \underbrace{a^2+ab+b}_{\text{constante}} + m\bigr)_p$$

o sea **determinístico**, y *determinístico $\Rightarrow$ no CPA-seguro* es una de las tres propiedades de [[pruebas-de-indistinguibilidad|02.05]]. El adversario pide al oráculo el cifrado de $m_0$ y de $m_1$, recibe el desafío y compara: acierta con probabilidad 1.

### Ejercicio 5 — Verdadero o Falso

**Enunciado.**

Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.

- a) Para proveer privacidad e integridad, lo correcto es primero Cifrar $m$ con $k_1$ para obtener $c$ y al mismo tiempo obtener el MAC con la clave $k_2$ de $m$ para obtener $t$. Tanto $m$ como $t$ se deben transmitir en forma conjunta. Las claves $k_1$ y $k_2$ pueden ser iguales.
- b) La seguridad de las funciones de hash se establece como el nivel de resistencia a preimagenes donde dado un $y$ hallar $x/h(x) = y$.
- c) El algoritmo de Diffie-Hellman permite que Alice le envíe una clave de sesión a Bob por un canal inseguro.
- d) En los cifrados en bloque independientemente del modo de operación se requiere que BCE Block Cipher Encryption ó PRF Psuedo Random Function siempre sea reversible.

| Sentencia | Apunte | Verificación |
|---|---|---|
| a) Cifrar $m$ con $k_1$ y **a la vez** sacar el MAC de $m$ con $k_2$; $k_1$ y $k_2$ **pueden ser iguales** | Falso: primero cifrar, después el MAC **sobre $c$**, y las claves **independientes** | Correcto, y es exactamente [[privacidad-e-integridad\|03.12]] más el ejercicio de claves iguales de la [[practica-04-macs-hash-y-cifrado-autenticado\|Práctica 04]] |
| b) La seguridad de un hash se establece **sólo** como resistencia a preimágenes | Falso: son **tres** propiedades | Correcto ([[resistencias-de-una-funcion-de-hash\|03.07]]) |
| c) Diffie-Hellman permite que Alice le **envíe** una clave de sesión a Bob | Falso: permite que **la establezcan** entre los dos, no que uno se la mande | Correcto, y es la distinción que define un **acuerdo** de claves contra un **transporte** de claves |
| d) En los cifrados en bloque se requiere que la `PRF` **siempre sea reversible** | Falso: la **primitiva de cifrado** debe ser reversible, la `PRF` no | Correcto, y engancha con el Ej. 2 de este mismo parcial |

### Múltiple choice — SSL, TLS y PKI

**Enunciado.**

3- Confidencialidad e integridad sobre un canal inseguro

- (a) SSL ofrece integridad y autenticación de los participantes mediante el uso de un KDC centralizado.
- (b) SSL ofrece confidencialidad, integridad y no repudio de los participantes mediante el uso de PKI de distribución de certificados.
- (c) TLS ofrece confidencialidad, integridad y autenticación de los participantes bajo un esquema PKI de distribución de certificados.

Tres opciones sobre confidencialidad e integridad en canal inseguro. La correcta es **(c) TLS ofrece confidencialidad, integridad y autenticación bajo un esquema PKI de distribución de certificados**. Las otras dos fallan porque (a) atribuye a SSL un **KDC centralizado** —usa PKI, no KDC; el `KDC` es de [[needham-schroeder|Needham-Schroeder]], no de TLS— y (b) le atribuye **no repudio**, que no da porque una vez establecida la clave de sesión el esquema es simétrico. Aparece **idéntica** en el 1C-2018. Desarrollado con esta misma comparación en [[clase-05-protocolos-criptograficos#Para el parcial|Clase 05 § Para el parcial]].

---

## 1C-2018

### Ejercicio 1 — Needham-Schroeder

**Enunciado.**

Dado el siguiente protocolo

$$\begin{aligned} (1.1)\ &A \to T : A, B, N_A \\ (1.2)\ &A \leftarrow T : E_{kAT}(N_A, B, k, E_{kBT}(k, A)) \\ (1.3)\ &A \to B : E_{kBT}(k, A) \\ (1.4)\ &A \leftarrow B : E_k(N_B) \\ (1.5)\ &A \to B : E_k(N_B - 1) \end{aligned}$$

donde $E(\cdot)$ es un esquema de cifrado simétrico.

- a) ¿Para qué está el nombre del destinatario en los mensajes (1.1) y (1.2)?
- b) ¿Qué problema tiene este protocolo?
- c) El protocolo de Denning-Sacco agrega timestamps a los mensajes (1.2) y (1.3). ¿Con qué objetivo?

Es el protocolo clásico con **KDC**. **Es, literalmente, el protocolo [[needham-schroeder|Needham-Schroeder]] de la [[clase-05-protocolos-criptograficos|Clase 05]]** — con `T` en vez de `KDC` como nombre del tercero de confianza, y **sin** el timestamp de la corrección [[denning-sacco-y-frescura|Denning-Sacco]] que sí aparece en la filmina 28 de esa clase. Las tres respuestas del apunte son correctas y son las estándar:

- **(a) Por qué está el nombre del destinatario** en 1.1 y 1.2: $T$ es un KDC, y $A$ tiene que **especificar con quién quiere hablar** para obtener la clave de sesión. En 1.2 el nombre va **adentro del cifrado** para que no se pueda suplantar la identidad del destinatario aunque el mensaje esté cifrado con $K_{AT}$.
- **(b) El problema**: en el paso 1.3 **no viaja ningún timestamp ni nonce**, así que es vulnerable a **replay** — un atacante que grabó un $E_{K_{BT}}(k,A)$ viejo, con una clave $k$ ya comprometida, se lo puede reenviar a $B$.
- **(c) [[denning-sacco-y-frescura|Denning-Sacco]]** agrega timestamps a 1.2 y 1.3 justamente para eso: $B$ puede validar si el mensaje que le llegó es viejo o reciente.

### Ejercicio 2 — Múltiple choice

**Enunciado.**

Elegir la opción correcta y justificar en una oración.

1- La validación de un Certificado Digital incluye

- (a) Verificar que la clave privada contenida en el certificado digital coincida con la clave pública que tiene el emisor del certificado.
- (b) Verificar que la clave pública contenida en el certificado digital encripte adecuadamente la clave privada que tiene el emisor del certificado.
- (c) Verificar que la firma digital emitida por la Autoridad Certificante incluída dentro del Certificado Digital sea válida.

2- El Duque de Mantua en 1401 utilizó un sistema de encripción homofónico donde implementó un cifrado de sustitución de manera que cada una de las vocales era sustituída por más de un símbolo, que se seleccionaba al azar. La cantidad de símbolos de sustitución para cada vocal era proporcional a la frecuencia de aparición de esa vocal dentro del lenguaje.

- (a) El esquema no tiene secreto perfecto porque es imposible identificar la vocal asignada.
- (b) El esquema opera en realidad como un cifrado Vigènere.
- (c) El índice de coincidencia no es tan útil en este caso.

3- Confidencialidad e integridad sobre un canal inseguro

- (a) SSL ofrece integridad y autenticación de los participantes mediante el uso de un KDC centralizado.
- (b) SSL ofrece confidencialidad, integridad y no repudio de los participantes mediante el uso de PKI de distribución de certificados.
- (c) TLS ofrece confidencialidad, integridad y autenticación de los participantes bajo un esquema PKI de distribución de certificados.

**2.1 Validación de un certificado digital** → la correcta es verificar que **la firma de la CA sea válida**, usando la clave pública de la CA, porque la firma se generó con la privada que sólo ella tiene — el segundo de los cinco pasos de [[x509#Verificación de un certificado X.509, en cinco pasos|X.509 § Verificación de un certificado X.509, en cinco pasos]].

**2.2 El Duque de Mantua, 1401 — cifrado homofónico.** Cada vocal se sustituye por **más de un símbolo**, elegido al azar, con tantos símbolos como su frecuencia en el idioma. La correcta es **(c) el índice de coincidencia no es tan útil en este caso**, y la razón que da el apunte es exacta: al repartir cada vocal en varios símbolos **se aplana el histograma** y el [[indice-de-coincidencia|índice de coincidencia]] deja de distinguir. Las otras dos son trampas: no es Vigenère —no hay desplazamientos cíclicos— y sí se puede razonar sobre su secreto perfecto.

> **Éste es el ejercicio más interesante de los cuatro parciales** *(lectura nuestra)*, porque ataca justo el punto ciego de la herramienta: el IC mide **cuán disparejo** es el histograma, y el cifrado homofónico está **diseñado** para emparejarlo. Es el contraejemplo que muestra que el IC no es un detector universal de sustitución monoalfabética.

**2.3 SSL/TLS/PKI** → misma pregunta que en el 1C-2023, misma respuesta — ver [[clase-05-protocolos-criptograficos#Para el parcial|Clase 05 § Para el parcial]].

### Ejercicio 3 — Cirugía sobre CBC

**Enunciado.**

En un esquema de encripción en bloques CBC de longitud n un mensaje $M_1M_2 \ldots M_n$ se cifra como un bloque de longitud n+1, $C_0C_1C_2 \ldots C_n$.

$$\begin{aligned} C_0 &= IV \\ C_k &= E_k(M_k \oplus C_{k-1}) \end{aligned}$$

- a) ¿ Cómo se ve afectada la desencripción si el primer bloque $C_0$ es eliminado del texto cifrado ?
- b) ¿ Cómo se ve afectada la desencripción si el último bloque $C_n$ es eliminado del texto cifrado ?
- c) Teniendo el texto cifrado ya generado como se especificó con anterioridad, ¿ Cómo puede un usuario legitimo agregar un texto de bloque $M_0$ específico al principio del mensaje plano original agregando bloques $C_k$ adicionales en cualquier ubicación del texto cifrado ?

- **(a) Si se elimina $C_0$**: $M_1$ **no se puede recuperar**, porque $D_k(C_1) = M_1 \oplus C_0$ y falta $C_0$. Los demás bloques salen bien.
- **(b) Si se elimina $C_n$**: se pierde **sólo $M_n$**; $M_1 \ldots M_{n-1}$ se recuperan correctamente.
- **(c) Cómo agregar un bloque $M_0$ al principio**: no se puede insertar sin más, por la dependencia del bloque anterior. Hay que **anteponer un nuevo $C'_0$** tal que $M_0 = D_k(C_0) \oplus C'_0$, o sea $C'_0 = D_k(C_0) \oplus M_0$.

La resolución del apunte de (c) es correcta y es más fina de lo que parece: **el usuario legítimo puede hacerlo porque tiene la clave** y por lo tanto puede calcular $D_k(C_0)$. Sin la clave no sale — y ésa es la diferencia entre esta manipulación y el ataque de [[maleabilidad]] de la Clase 03.

### Ejercicios 4 y 5

**Enunciado.**

**Ejercicio 4.** Dado el siguiente criptosistema $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$.

Para $p \in \mathbb{Z}$ y $a, b, r \in \mathbb{Z}_p$, siendo la clave $k = (a, b)$ y siendo $r \leftarrow random$

$$\begin{aligned} c &= E_k(m) = (r, ar + b + m)_{(p)} \\ m &= D_k(c) = (-ar - b + c)_{(p)} \end{aligned}$$

donde $(\cdot)_{(p)}$ implica que opera con aritmética modular.

- a) Considerar una variante del criptosistema donde $r$ en lugar de ser aleatorio toma el valor $r = (a+b)_{(p)}$ ¿es este criptosistema seguro contra ataque de texto cifrado elegido? Demostrar mediante un experimento $\mathrm{PrivK}^{\mathrm{CPA}}_{\mathcal{A},\Pi}$

**Ejercicio 5.** Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.

- a) Para proveer privacidad e integridad, lo correcto es primero Cifrar $m$ con $k_1$ para obtener $c$ y al mismo tiempo obtener el MAC con la clave $k_2$ de $m$ para obtener $t$. Tanto $m$ como $t$ se deben transmitir en forma conjunta. Las claves $k_1$ y $k_2$ pueden ser iguales.
- b) La seguridad de las funciones de hash se establece como el nivel de resistencia a preimagenes donde dado un $y$ hallar $x/h(x) = y$.
- c) El algoritmo de Diffie-Hellman permite que Alice le envíe una clave de sesión a Bob por un canal inseguro.
- d) En los cifrados en bloque independientemente del modo de operación se requiere que BCE Block Cipher Encryption ó PRF Psuedo Random Function siempre sea reversible.

> El apunte los marca **"Repetido"**: son literalmente los mismos que el Ej. 4 y el Ej. 5 del 1C-2023, arriba. **Que un ejercicio reaparezca idéntico con cinco años de diferencia es, en sí, el dato más accionable de esta nota.**

---

## Los ejercicios de Shamir, de la Guía 6

La última página no es de un parcial: son dos ejercicios de la **Guía 6**, que el vault **no tiene ingerida**. Se conservan acá porque vinieron en el mismo PDF.

**Ejercicio 14 — encontrar al espía.**

**Enunciado.**

Supongamos que hay 4 personas en una habitación, una de las cuales es un agente extranjero. A las otras tres personas se les ha dado sus pares correspondientes al esquema de Shamir en el cual cualquier par de personas pueden determinar el secreto. Las personas tienen los siguientes pares: (módulo 11)

- A:(1, 4)
- B:(3, 7)
- C:(5, 1)
- D:(7, 2)

Determinar quién es el agente extranjero y cuál es el mensaje.

**El planteo del apunte es correcto y la aritmética no.** Resuelto de nuevo acá, verificado punto por punto.

Con umbral $k=2$, el polinomio tiene grado $k-1 = 1$: $f(x) = ax + b$, y **el secreto es $f(0) = b$**. Con tres shares legítimos y una recta, la estrategia es tomar **dos** puntos, construir la recta, y ver cuál de los otros dos **no** cae en ella. Tomando $A$ y $B$:

$$a = (y_2-y_1)(x_2-x_1)^{-1} = (7-4)\cdot(3-1)^{-1} = 3 \cdot 2^{-1} = 3\cdot 6 = 18 \equiv \mathbf{7} \pmod{11}$$
$$b = y_1 - a x_1 = 4 - 7 = -3 \equiv \mathbf{8} \pmod{11}$$

*(Usando $2^{-1} \equiv 6$, porque $2\cdot 6 = 12 \equiv 1 \pmod{11}$ — ver [[inverso-modular|Inverso modular]].)*

$$f(x) = 7x + 8 \pmod{11}$$

Verificando los cuatro:

| Share | $f(x)$ calculado | Declarado | |
|---|---|---|---|
| $A(1,4)$ | $7+8 = 15 \equiv 4$ | 4 | pertenece |
| $B(3,7)$ | $21+8 = 29 \equiv 7$ | 7 | pertenece |
| $C(5,1)$ | $35+8 = 43 \equiv 10$ | 1 | **no pertenece** |
| $D(7,2)$ | $49+8 = 57 \equiv 2$ | 2 | pertenece |

**$C$ es el agente extranjero, y el secreto es $f(0) = 8$.**

> **Este mismo ejercicio ya tiene teoría propia en el vault.** [[secretos-compartidos-y-metodo-de-shamir|Secretos compartidos y método de Shamir]] desarrolla el esquema $(t,n)$-threshold en general —acá con $t=2$, ahí con el ejemplo de la filmina en $t=3$— y documenta la interpolación de Lagrange sobre $\mathbb{Z}_p$ que hace posible reconstruir $f(0)$. Y trae un dato que conviene cruzar: **el propio deck de la cátedra comete un error de aritmética modular en su ejemplo** —$80+12+7=99\equiv 0\pmod{11}$, no $2$ como escribe la filmina 26— del mismo tipo que el de este apunte: una cuenta módulo 11 que sale mal por un paso, aunque en el deck el veredicto final tampoco se ve afectado más que en un valor de sombra. Dos aritméticas independientes, mismo módulo, mismo tipo de desliz.

> **Dónde se rompe la cuenta del apunte** *(y por qué el veredicto le sale bien igual)*. Al despejar llega a $12 - 2b = 7$, lo reduce a $1 - 2b = 7$ —correcto, $12 \equiv 1$— pero concluye $b = 3$ cuando de ahí sale $2b = -6 \equiv 5$ y $b = 5\cdot 6 = 30 \equiv 8$. Después, al verificar $C$ y $D$, usa **otro par todavía**: $a=1$, $b=6$. Esa recta **no pasa ni por $A$ ni por $B$**, que son los dos puntos de los que se dedujo. Le cierra $D$ por casualidad —$7+6=13\equiv 2$— y le falla $C$, así que el veredicto sale correcto **con la cuenta equivocada**. El apunte además **nunca dice cuál es el secreto**, que es la mitad de lo que el ejercicio pide.

**Ejercicio 15 — esquema jerárquico.**

**Enunciado.**

Un cuartel militar consiste de un general, dos coroneles y 5 suboficiales. Tienen el control sobre un poderoso misil, pero no quieren lanzarlo a  menos que el general decida hacerlo, o los dos coroneles decidan lanzarlo o los 5 suboficiales decidan lanzarlo, o un coronel y tres de los suboficiales decidan hacerlo. Describir cómo lo harías con un esquema de secreto compartido.

**Pista:** Una persona podría tener más de un par de claves.

La solución del apunte reparte el secreto en un Shamir $(1,4)$ y subdivide cada rama: $S_1$ al general directamente, $S_2$ como $(2,2)$ entre los coroneles, $S_3$ como $(5,5)$ entre los suboficiales, y $S_4$ partido en $(1,2)$ para coroneles y $(3,5)$ para suboficiales. **Una persona termina con más de un share**, que es justo lo que la pista del enunciado adelanta.

---

## Discrepancias con el apunte

Cuatro cosas que la resolución manuscrita dice mal o a medias. Ninguna invalida el veredicto final del ejercicio, pero todas cambiarían la nota si se copiaran tal cual.

**1. `OFB` no propaga errores, y el apunte dice que sí — dos veces.** En el 2C-2025 (Ej. 3) escribe *"el CBC transmite el error al bloque actual y al siguiente… En OFB sucede exactamente lo mismo"*, y en el 1C-2025 (Ej. 2) repite *"será afectado el bloque del error y el contiguo, al igual que en CBC y OFB"*.

**Es incorrecto en los dos casos.** `OFB` genera el keystream realimentando **la salida de la primitiva**, sin mirar el criptograma: $O_i = E_k(O_{i-1})$, $C_i = M_i \oplus O_i$. Como el keystream **no depende de $C$**, un bit corrompido en $C_i$ corrompe **exactamente ese bit** de $M_i$ y nada más — igual que `CTR`. La tabla verificada está en [[modos-de-encadenamiento#Propagación de errores|Modos de encadenamiento § Propagación de errores]]. **Que el error aparezca en dos parciales distintos sugiere que es una confusión asentada, no un desliz** — probablemente por agrupar `CBC`, `CFB` y `OFB` como "los que realimentan", cuando lo que decide no es *si* realimentan sino *qué*.

**2. El apunte tenía razón: la filmina lo confirma, y revierte lo que esta nota conjeturaba.** El apunte marca falsa la sentencia *"el padding aleatorio en RSA es para que sea seguro ante texto cifrado elegido"* y la corrige a *"para que sea `CPA-Secure`"*. Una versión anterior de este párrafo especulaba —rotulado *"precisión nuestra"*, a falta de la Clase 4— que la sentencia original podía ser **defendible como verdadera**, con el argumento de que `RSA-OAEP` se diseñó para `IND-CCA2` y de que Bleichenbacher es un ataque de texto cifrado elegido contra `PKCS#1 v1.5`.

**Esa conjetura era incorrecta, y la filmina 27 del deck de la Clase 4 la revierte de manera explícita.** Verificado renderizando la página —no de segunda mano—: *"Se cree que es `CPA-Secure`. Pero se encontraron ataques que muestran que no es `CCA-Secure`."* La cátedra afirma justo lo contrario de lo que esta nota conjeturaba: el padding aleatorio de `PKCS#1 v1.5` apunta a `CPA`, no a `CCA`, y de hecho **no** alcanza `CCA` — es exactamente lo que explota Bleichenbacher. El desarrollo completo, incluida la razón por la que el argumento sobre `RSA-OAEP` seguía siendo cierto en general pero no aplicaba al esquema de esta filmina, está en [[pkcs1-y-tamano-de-claves#CPA sí, CCA no|PKCS#1 y tamaño de claves § CPA sí, CCA no]]. **La corrección del apunte del estudiante era la correcta**, y la sentencia del examen 2C-2025 es **falsa**, sin matices — la tabla del Ejercicio 5 de ese parcial, arriba, ya lo dice bien.

**3. El contraejemplo del Ej. 3 del 1C-2025 está incompleto.** Ver el matiz arriba: el atacante **no** puede forjar $H(k_2\Vert m')$ sin $k_2$. Lo que hace mala a *authenticate-then-encrypt* es que obliga a descifrar para verificar, no que sea forjable.

**4. La cuenta de Shamir está mal, y el veredicto sale bien por casualidad.** En el Ej. 14 el apunte despeja $b = 3$ donde corresponde $b = 8$, y después verifica con un tercer par distinto, $a=1$, $b=6$ — una recta que **no pasa por $A$ ni por $B$**, los dos puntos que la originaron. Le falla $C$ y le cierra $D$, así que acierta que **$C$ es el espía** sin que la aritmética lo sostenga. Y **nunca da el secreto**, que es la otra mitad de la consigna: es $b = 8$. La resolución correcta, $f(x) = 7x+8 \pmod{11}$, está [[#Los ejercicios de Shamir, de la Guía 6|arriba]] verificada en los cuatro shares, con la teoría del método desarrollada en [[secretos-compartidos-y-metodo-de-shamir|Secretos compartidos y método de Shamir]] — nota que documenta, además, un error de aritmética modular **independiente** en el propio deck de la cátedra, sobre el mismo módulo 11.

> **Y una advertencia general.** Estas resoluciones son de un estudiante, no de la cátedra: **no hay ninguna corrección docente sobre ellas**. Donde esta nota dice "verificado", quiere decir verificado contra las notas de concepto del vault y contra Katz & Lindell — no contra una clave de corrección oficial.

---

## Cabos sueltos

- **Los ejemplos de parcial del campus siguen sin bajar.** Son los que el docente nombra el 20/08 (cue pt2 521) y **no son éstos**: ver el [[cronograma#Fechas críticas|cronograma]] y el [[reglamento-y-evaluacion|reglamento]]. Con cuatro parciales reales en la mano el hueco importa menos, pero sigue abierto.
- **No hay ningún segundo parcial ni ningún final** en el vault. Este PDF es explícitamente de *primeros* parciales. El segundo cubre las Clases 6 a 11 —la unidad de Seguridad—, de la que el vault ahora tiene [[clase-06-politicas-de-seguridad-y-control-de-acceso|notas de clase]] escritas contra las filminas (Clases 6 a 10; la Clase 11, Protección de datos, sigue sin deck) además de las [[videografia|notas de video]], pero **ningún examen real** de ese bloque: esta nota no puede decir todavía qué se toma de verdad ahí.
- **Confusión, difusión y no linealidad** ya no son un hueco: aparecen desarrolladas en la Clase 02 —ver la corrección al punto (b)/(c) del 1C-2023 Ej. 3, [[#1C-2023|arriba]]—. Lo que sí sigue faltando es una nota de concepto dedicada a esos tres términos como tríada de Shannon; hoy viven repartidos en `02.09`, `02.10` y `02.16`.
- **Las Clases 4 y 5 ya tienen nota**, escrita sólo contra las filminas —no se dictan hasta el 10/09 y el 17/09, así que no hay transcripción ni matiz de voz todavía—. Con eso alcanza para resolver, hoy, el Ejercicio 1 de protocolo en los cuatro parciales, el ítem de Diffie-Hellman y el bloque de certificados/PKI: ver los links agregados en cada sección de esta nota. Lo que **no** cambia es que esta nota sigue siendo el apunte de un estudiante sin corrección docente — cuando esas clases se dicten de verdad, conviene revisar de nuevo contra lo que se diga en voz.
- **La Guía 6** no está ingerida, y de ella salen los dos ejercicios de Shamir de la última página. El **método** de Shamir sí tiene teoría propia desde hoy, en [[secretos-compartidos-y-metodo-de-shamir|06.13]] — pero esa nota nace de la Clase 06 (Control de acceso), no de la Guía 6, y usa un ejemplo con umbral distinto ($t=3$, contra el $t=2$ del Ej. 14).

