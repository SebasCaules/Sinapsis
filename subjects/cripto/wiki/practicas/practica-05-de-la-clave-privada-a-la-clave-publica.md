---
title: Práctica 05 — De la clave privada a la clave pública
resumen: 'Las filminas de la clase práctica del 14/09, que repasan la Clase 04 cuatro días después en el orden de Katz & Lindell y anticipan tres láminas de la Clase 05: las tres limitaciones de la clave privada, Diffie-Hellman con un ejemplo numérico que da clave 1, la definición de los cuatro ataques a un protocolo, GenRSA con openssl, el cifrado híbrido y el ataque de no mensaje.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[clase-05-protocolos-criptograficos]]", "[[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital]]", "[[cifrado-hibrido]]"]
aliases: [Práctica 5, Práctica 05, Practica 5, Clase práctica 5, GenRSA con openssl, Ejemplo numérico de Diffie-Hellman, Las tres limitaciones de la clave privada]
type: practica
clase: 4
orden: 20
practica: 5
fecha: 2026-09-14
created: 2026-09-15
updated: 2026-09-15
tags: [practica, distribucion-de-claves, kdc, clave-publica, diffie-hellman, ataques-a-protocolos, rsa, openssl, cifrado-hibrido, firma-digital, hashed-rsa, pki, tls, clase-04, clase-05]
sources: ["raw/practicas/Clase 5.pdf", "Katz y Lindell - Introduction to Modern Cryptography.pdf"]
---

# Práctica 05 — De la clave privada a la clave pública

> **14/09/2026** · Filminas: [`Clase 5.pdf`](../../raw/practicas/Clase%205.pdf) (21 pp., **Ana Arias Roig**, creado el 13/09/2026) · Teoría: [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04 — Criptografía asimétrica y firma digital]] y, en tres láminas, [[clase-05-protocolos-criptograficos|Clase 05 — Protocolos criptográficos]] · Guía del mismo día: [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital|Guía 4 — Manejo de claves · Cifrado asimétrico · Firma digital]]

Esta práctica es **la imagen espejo de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]]**. Aquélla se adelantó tres días a su teoría; ésta llega **cuatro días después** de la [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]] del 10/09 y la recorre de nuevo en veintiuna láminas, en el orden de los capítulos 10 a 12 de Katz & Lindell y no en el del deck de teoría: limitaciones de la clave privada, KDC, la revolución de la clave pública, Diffie-Hellman, esquemas asimétricos, `RSA`, firma. Sólo tres láminas —los ataques, la PKI y `TLS`— miran hacia la [[clase-05-protocolos-criptograficos|Clase 05]] del 17/09. Es, en su mayor parte, un **repaso**: la primera práctica del cuatrimestre que llega después de su teoría.

Lo que agrega sobre lo que el vault ya tenía, en seis puntos:

1. **[[#3. Las tres limitaciones de la clave privada, y qué resuelve el KDC|Las tres limitaciones de la criptografía de clave privada]]** —distribución, almacenamiento, sistemas abiertos—, con la flecha que dice cuáles dos resuelve el KDC y cuál obliga a la clave pública. Teoría motiva el giro desde Kerckhoffs y la cuenta $n(n-1)/2$; esta enumeración es la de Katz & Lindell §10.1 y no está en ninguna filmina de teoría.
2. **[[#5. Diffie-Hellman en cinco pasos, y un ejemplo que da clave 1|Diffie-Hellman en los cinco pasos del libro, con un ejemplo numérico]]**: el único ejemplo con números del protocolo que dio la cátedra. Las cuentas cierran y **la clave da $1$**. El ejemplo es degenerado, y lo es por la misma razón por la que el $q$ del enunciado del parcial tiene que ser primo.
3. **[[#6. Los cuatro ataques, con la definición que la Guía 4 no daba|La definición de masquerading y de man in the middle]]** según cuántos participantes honestos ejecutan el protocolo. La [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 1|Guía 4]] pide ejemplos de esos cuatro ataques sin definirlos; ésta es la única fuente de la cátedra que define dos de ellos.
4. **[[#8. GenRSA, y la clave por dentro con openssl|GenRSA escrito sobre GenModulus, y una clave generada y abierta con openssl]]**: qué imprime `genrsa`, qué hay en `privada.txt` y para qué sirven *"los otros valores"* que la lámina no nombra.
5. **[[#10. Cifrado híbrido: la construcción que ninguna filmina de teoría trae|El cifrado híbrido]]**, con su terna y las dos hipótesis del teorema que lo hace `CPA`-seguro. Es la única construcción formal de esta práctica que **no aparece en ningún deck de teoría**, y la que explica qué quiere decir *"combina cifrado simétrico y asimétrico"* en la lámina de `TLS`. Tiene nota propia → [[cifrado-hibrido|Cifrado híbrido]].
6. **[[#12. Textbook RSA para firma, el ataque de no mensaje y el hash que reduce el riesgo|El nombre del ataque de no mensaje]]**, escrito por la cátedra para el ataque que la voz del 10/09 no mencionó y que el Ej. 16 de la Guía 4 pide.

Y lo que **no** trae, que también ordena la lectura: ni El Gamal, ni `PKCS#1`, ni `DSS`, ni el álgebra de la Clase 04, ni el experimento `KE`. Ver [[#Cabos sueltos|Cabos sueltos]].

---

## 1. Ojo con el nombre del archivo: cuarto caso del mismo patrón

`Clase 5.pdf` **no es la teórica 5**. Vive en `raw/practicas/`, la filmina 1 lleva impreso *"14 de septiembre 2026"* —un **lunes**— y la autora del PDF es **Ana Arias Roig**, la de las prácticas. Es la **clase práctica 5**. La teórica 5 —Protocolos criptográficos— es el jueves 17/09, tiene su propio deck en `raw/clases/Clase 05 - Protocolos.pdf` y su propia nota, [[clase-05-protocolos-criptograficos|clase-05]].

| Archivo | Parece | Es |
|---|---|---|
| `raw/practicas/Clase 1.pdf` | la teórica 1 (06/08) | la [[practica-01-esquemas-y-taxonomias\|práctica 1]], lunes 10/08 |
| `raw/practicas/Clase 3.pdf` | la teórica 3 (27/08) | la [[practica-03-seudoaleatoriedad-y-modos\|práctica 3]], lunes 24/08 |
| `raw/practicas/Clase 4.pdf` | la teórica 4 (10/09) | la [[practica-04-macs-hash-y-cifrado-autenticado\|práctica 4]], lunes 31/08 |
| `raw/practicas/Clase 5.pdf` | la teórica 5 (17/09) | **esta** práctica, lunes 14/09 |

Hay una señal más, nueva en este caso: **el título interno del PDF no es el del archivo.** `pdfinfo` devuelve *"Privacidad + integridad"* —un rótulo de integridad, el tema del bloque anterior—, mientras que los cuatro PDF previos de la carpeta se titulan igual que su archivo (*"Clase 1"*, *"Clase 3"*, *"Clase 4"*, *"Anexo Clase 4"*). La lectura más simple *(nuestra)* es que el deck se armó sobre el archivo de una presentación anterior y la propiedad quedó sin actualizar. No dice nada del contenido; sí recuerda que **ni el nombre del archivo ni sus metadatos identifican el tema**: hay que abrirlo. La regla operativa sigue siendo la de siempre, **la carpeta manda sobre el nombre**.

---

## 2. El arco: un repaso cuatro días después, con tres láminas de anticipo

$$\underbrace{\text{jueves } 10/09}_{\text{Clase 04, dictada}} \;\longrightarrow\; \underbrace{\text{lunes } 14/09}_{\text{esta práctica + Guía 4}} \;\longrightarrow\; \underbrace{\text{jueves } 17/09}_{\text{Clase 05}}$$

**Dieciocho de las veintiuna láminas son material de la Clase 04**, ya dictado y con transcripción. Las otras tres —la 8, la 19 y la 20— son material de la Clase 05, que se dicta tres días después; la 21 es bibliografía. Filmina por filmina:

| Filminas | Tema | Fuente de teoría | Desarrollado en |
|---|---|---|---|
| 1-4 | Limitaciones de la clave privada, KDC, pro y contra | Clase 04, filminas 2-5 (sin la lista de tres) | [[distribucion-de-claves-y-kdc\|Distribución de claves y KDC]] |
| 5-6 | La revolución de la clave pública, las tres primitivas | Clase 04, filminas 6-8 | [[criptosistema-asimetrico\|Criptosistema asimétrico]] · [[diffie-hellman\|Diffie-Hellman]] |
| 7 | Diffie-Hellman en cinco pasos, ejemplo en $\mathbb{Z}_7$ | Clase 04, filminas 18-19 (sin ejemplo numérico) | [[diffie-hellman\|Diffie-Hellman]] |
| 8 | Cuatro ataques: masquerading, man in the middle, replay, key reuse | **Clase 05**, filminas 4-6 y 24-27 | [[ataques-activos-y-man-in-the-middle\|Ataques activos]] · [[ataques-de-repeticion-y-frescura\|Repetición y frescura]] |
| 9 | Esquemas asimétricos, ventajas y desventaja | Clase 04, filminas 6-8 y 21 (sin la lista de ventajas) | [[criptosistema-asimetrico\|Criptosistema asimétrico]] |
| 10-12 | GenRSA, y la clave generada y abierta con `openssl` | Clase 04, filmina 24 (sin `openssl`) | [[rsa\|RSA]] · [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 10\|Guía 4, Ej. 10]] |
| 13-14 | Terna de clave pública, determinismo, `RSA` y su corrección | Clase 04, filminas 22-25 | [[criptosistema-asimetrico\|Criptosistema asimétrico]] · [[rsa\|RSA]] |
| 15 | **Cifrado híbrido** | ninguna filmina de teoría | [[cifrado-hibrido\|Cifrado híbrido]] |
| 16 | Firma digital contra MAC | Clase 04, filminas 33-35 | [[firma-digital\|Firma digital]] |
| 17-18 | Textbook `RSA` para firma, ataque de no mensaje, Hashed `RSA` | Clase 04, filminas 36-38 | [[rsa-signature-y-hashed-rsa\|RSA-Signature y Hashed RSA]] |
| 19 | PKI: certificados, jerarquías, validez | **Clase 05**, filminas 7-21 | [[infraestructura-de-clave-publica\|PKI]] · [[certificados-digitales\|Certificados]] · [[revocacion-y-listas-crl\|Revocación]] |
| 20-21 | `TLS` en tres líneas; Schneier y las dos RFC | **Clase 05**, filminas 29-48 | [[tls-arquitectura-y-record\|TLS: arquitectura y record]] |

Tres consecuencias para leerla:

- **Casi nada de lo que dice es nuevo, y eso es lo que la vuelve útil para el parcial**: es la versión de una página de cada concepto de la Clase 04, escrita por otra docente y con la notación del libro. Donde la práctica y la teoría difieren —el número de pasos de Diffie-Hellman, el nombre de $q$, la demostración de `RSA` en una línea— cada sección de abajo dice para qué lado cae.
- **Las tres láminas de la Clase 05 son un índice, no una exposición.** Cuatro viñetas de ataques, cuatro palabras de PKI, tres renglones de `TLS`. La [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital|Guía 4]] del mismo día, en cambio, tiene once ejercicios de esa clase: la práctica y la guía se adelantan juntas, pero es la guía la que trabaja el tema.
- **No es la práctica de aritmética que el docente anunció.** El 10/09 Abad dijo que *"en la práctica probablemente repasemos con algunos ejercicios básicos, especialmente de aritmética"* (cue 298 de la Clase 04). Lo más cerca que está de eso es el ejemplo numérico de Diffie-Hellman en $\mathbb{Z}_7$ y la lista de potencias de $3$ que lo acompaña; no hay Euclides, ni inversos modulares, ni un `RSA` con números. Si esos ejercicios existen, siguen sin estar en `raw/`.

---

## 3. Las tres limitaciones de la clave privada, y qué resuelve el KDC

*Filminas 1, 3 y 4.* La práctica abre y cierra su primer bloque con la misma lámina, un triángulo de advertencia y una caja: **LIMITACIONES** de la criptografía de clave privada, en una lista de tres.

1. **Distribución de clave.**
2. **Almacenamiento de clave.**
3. **Sistemas abiertos** (*open systems*).

Y dos flechas que hacen todo el trabajo. En la filmina 1, de la caja **KDC** salen flechas hacia los puntos 1 y 2: el centro de distribución **resuelve esos dos**. En la filmina 4, el punto 3 lleva una flecha hacia una caja nueva, **Public Key Revolution**: el problema que el KDC no puede resolver es el que obliga a cambiar de paradigma.

**Es la estructura de Katz & Lindell §10.1-10.2, casi literal.** El libro cierra la sección de gestión de claves resumiendo *"al menos tres problemas distintos"* del uso de clave privada —distribución, almacenamiento y manejo de muchas claves, e inaplicabilidad a sistemas abiertos—, y dice de los KDC que *"pueden aliviar dos de los problemas"*: la distribución, porque al ingresar un participante sólo hay que compartir una clave nueva, y el almacenamiento, porque cada uno guarda una sola. Lo que un KDC no resuelve es el caso de dos partes que **nunca interactuaron antes** y no tienen a nadie en común que las presente —una compra en un comercio de internet, un correo a un desconocido—; ése es el sistema abierto, y de ahí sale la clave pública.

**Qué agrega sobre la teoría.** La [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]] motiva el giro de otra manera: deduce el problema del principio de Kerckhoffs, cuenta las $n(n-1)/2$ claves con los alumnos y presenta el KDC como la *"central telefónica"* — ver [[distribucion-de-claves-y-kdc|Distribución de claves y KDC]]. **La lista de tres no aparece en ninguna de sus filminas ni en la voz.** El aporte de la práctica es el tercer punto: ni la cuenta cuadrática ni el KDC dicen nada de los sistemas abiertos, y ése es justamente el problema que la criptografía asimétrica resuelve y el KDC no. Sin ese punto, el KDC parece una solución completa y el paso a la clave pública parece un capricho.

*Filmina 2.* El KDC dibujado como protocolo. Todos comparten una clave $k_u$ con el centro ($k_A$ si es $A$, $k_B$ si es $B$):

$$\begin{aligned}
&1)\ A \to \mathrm{KDC}:\ B\\
&2)\ \mathrm{KDC} \to A:\ \{s\}_{k_A}\qquad \mathrm{KDC} \to B:\ \{s\}_{k_B}
\end{aligned}$$

y *"luego $A$ se comunica con $B$ usando $s$"*: $\{\ldots\}_s$. Al pie, *"Ej: Needham Schroeder"*.

> **Precisión sobre el ejemplo** *(nuestra, con Katz & Lindell §10.2)*. El diagrama es el KDC **simplificado** del libro —el centro genera la clave de sesión y se la manda a **cada** parte—, del que el propio libro dice que *"es demasiado simplista para usarse en la práctica"*. [[needham-schroeder|Needham-Schroeder]] es precisamente la variante en la que el KDC **no** le escribe a $B$: le entrega a $A$ las dos partes, $\{s\}_{k_A} \Vert \{s\}_{k_B}$, y es $A$ quien reenvía la segunda —el *ticket*— a $B$. La filmina 23 de la Clase 05 lo dibuja así, y la Guía 4 lo usa así en sus Ej. 1, 2 y 5. La diferencia no es cosmética: que el ticket viaje por $A$ es lo que le permite a $B$ saber con quién está hablando, y es también por donde entra el ataque de la filmina 27 de teoría.

*Filmina 3.* Pro y contra del KDC, con un pulgar arriba y uno abajo *(el vault no reproduce emojis)*:

| A favor | En contra: centralización |
|---|---|
| Cada uno guarda sólo $k_u$ | Ataque al KDC |
| Sólo un sitio de riesgo: el KDC | Falla en KDC |

Que *"un solo sitio de riesgo"* figure del lado positivo no es contradicción con *"ataque al KDC"* del lado negativo: es el mismo hecho mirado desde dos lados, y el libro lo dice igual. Un único punto que proteger se puede poner en un lugar seguro y darle la máxima protección; ese mismo punto, comprometido, entrega **todas** las claves del sistema, y caído, deja al sistema entero sin poder negociar claves nuevas. La teoría lo dice con la voz de Abad —*"el blanco más jugoso para atacar"* (cues 98-100)— y agrega lo que la práctica no tiene: que el KDC **achica** el problema de las claves iniciales, no lo resuelve → [[distribucion-de-claves-y-kdc#Lo que el KDC no resuelve: las claves iniciales y la base mínima de confianza|la base mínima de confianza]].

---

## 4. La revolución de la clave pública y las tres primitivas

*Filmina 5.* Las fotos de Whitfield Diffie y Martin Hellman a los costados, y la idea en una línea: **funciones fáciles en un sentido, difíciles de invertir**. De ahí, **dos claves**: una *para encripción*, del emisor, **pública**; otra *para desencripción*, del receptor, **privada**. Un sello cruzado dice **ASIMÉTRICOS**.

*Filmina 6.* Lo que la teoría cuenta como la agenda de la clase, acá es la agenda del paper de 1976. **Diffie y Hellman proponen tres primitivas**, cada una con una flecha hacia lo que la cátedra dice de ella:

| Primitiva | La flecha dice |
|---|---|
| 1ª) Encripción | `RSA` / El Gamal |
| 2ª) MAC (firma digital) | permite **no repudio** |
| 3ª) Intercambio de claves | presentan **este** protocolo completo |

La tercera columna es exacta y conviene leerla como historia: en *New Directions in Cryptography* Diffie y Hellman **definieron** el cifrado de clave pública y la firma digital sin dar ninguna construcción, y **sí** dieron completo el protocolo de intercambio de claves que lleva su nombre. Las construcciones de las dos primeras primitivas llegaron un año después con Rivest, Shamir y Adleman, y en 1985 con El Gamal — es el relato de Katz & Lindell §10.3-10.4, y es lo que la [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]] dice en voz cuando ubica el paper *"hace 50 años"* (cues 115-172, en [[diffie-hellman#La cita que abre el bloque|Diffie-Hellman]]). Que a la firma se la llame acá *"MAC (firma digital)"* es la misma idea con la que Abad presentó la firma: el MAC trasladado al mundo asimétrico, con las claves en el rol opuesto → [[firma-digital#Por qué se llama firma y no MAC asimétrico|Por qué se llama firma y no MAC asimétrico]].

---

## 5. Diffie-Hellman en cinco pasos, y un ejemplo que da clave 1

*Filmina 7.* El protocolo, en **cinco** pasos:

$$\begin{aligned}
&\text{1. } A:\ (G, q, g)\\
&\text{2. } A \text{ elige } x \leftarrow \mathbb{Z}_q \text{ aleatoriamente y uniforme y calcula } h_1 = g^{x}\\
&\text{3. } A \text{ envía } (G, q, g, h_1) \text{ a } B\\
&\text{4. } B \text{ elige } y \leftarrow \mathbb{Z}_q,\ \text{calcula } h_2 = g^{y},\ \text{lo envía a } A \text{ y calcula } k_B = h_1^{\,y}\\
&\text{5. } A \text{ calcula } k_A = h_2^{\,x}
\end{aligned}$$

$$k_A = k_B = g^{xy}$$

**Son los cinco pasos de la Construcción 10.2 de Katz & Lindell, con $h_1, h_2$ en lugar de $h_A, h_B$**; la teoría (filmina 18) desarma el paso 4 en tres y llega a **siete**, y el enunciado del parcial 1C-2025 a **ocho** — es el mismo protocolo en tres granularidades, y conviene reconocerlo en cualquiera de ellas → [[diffie-hellman#El protocolo, paso a paso|Diffie-Hellman § El protocolo]]. Lo que la práctica sí agrega, y la teoría no tiene, es **un ejemplo con números**, dibujado en globos de diálogo entre una alumna y un alumno.

### El ejemplo, rehecho

Los globos dicen: $G_7$, $q = 7$, $g = 3$. $A$ elige $x = 3$ y calcula $3^{3} \equiv 6 \pmod 7$; envía $(G_7, q = 7, g = 3, h_1 = 6)$. $B$ elige $y = 4$, calcula $3^{4} \equiv 4 \pmod 7$ y envía $h_2 = 4$. Después cada uno piensa su clave: $h_2^{\,3} = 4^{3} \equiv 1$ y $h_1^{\,4} = 6^{4} \equiv 1$. Al pie, la tabla que muestra que $3$ genera todo el grupo: $3^{0} = 1$, $3^{1} = 3$, $3^{2} = 2$, $3^{3} = 6$, $3^{4} = 4$, $3^{5} = 5$.

Rehecho a mano, todo cierra:

$$\begin{aligned}
h_1 &= 3^{3} = 27 = 3\cdot 7 + 6 \equiv 6\\
h_2 &= 3^{4} = 81 = 11\cdot 7 + 4 \equiv 4\\
k_A &= h_2^{\,x} = 4^{3} = 64 = 9\cdot 7 + 1 \equiv 1\\
k_B &= h_1^{\,y} = 6^{4} = 1296 = 185\cdot 7 + 1 \equiv 1 \qquad (6 \equiv -1,\ (-1)^{4} = 1)
\end{aligned}$$

y la tabla de potencias también: $3$ tiene orden $6$ en $\mathbb{Z}_7^{*}$, o sea que es raíz primitiva módulo $7$. **La aritmética de la lámina es correcta.** El problema es lo que ilustra.

### Por qué da 1, y qué enseña

**La clave compartida es $1$: el elemento neutro, el peor valor posible.** No es casualidad de los números elegidos, es álgebra: $k = g^{xy} = 3^{12}$, y como $3$ tiene orden $6$, $3^{12} = (3^{6})^{2} = 1$. Los exponentes $x = 3$ e $y = 4$ **no son cero** y sus valores públicos $h_1 = 6$ y $h_2 = 4$ **no son $1$**, pero el producto $xy = 12$ **sí** es múltiplo de $6$. En $\mathbb{Z}_6$ hay divisores de cero —$3 \cdot 4 \equiv 0$— y eso es exactamente lo que pasa acá.

Ésa es la lección, y es la que el parcial pregunta con otras palabras. El Ej. 1b del 1C-2025 pide *"¿qué valores de $q$ son válidos y por qué?"*, y la respuesta modelo de los [[parciales-viejos|parciales viejos]] es *"$q$ primo"*. **El ejemplo de esta filmina muestra qué se pierde cuando el orden del grupo no es primo**: con orden $6 = 2 \cdot 3$, cuatro de los veinticinco pares de exponentes entre $1$ y $5$ —$(2,3)$, $(3,2)$, $(3,4)$, $(4,3)$— dan $g^{xy} = 1$ sin que ninguno de los dos exponentes sea cero. Si el orden $q$ es primo, $\mathbb{Z}_q$ es un cuerpo, $xy \equiv 0$ obliga a $x \equiv 0$ o $y \equiv 0$, y la clave degenerada sólo aparece cuando alguna de las partes eligió el exponente nulo — que es una probabilidad $1/q$, despreciable para $q$ grande. Es una de las razones por las que Katz & Lindell exigen grupo de orden primo, junto con la conjetura `DDH` → [[diffie-hellman#Capa 2 — la conjetura de decisión Diffie-Hellman (DDH)|Diffie-Hellman § DDH]].

> **Coincidencia que conviene registrar.** El ejemplo del apunte del estudiante que resuelve el 1C-2025 usa $\mathbb{Z}_5$, $g = 2$ y **los mismos exponentes $x = 3$, $y = 4$**, y también llega a $k = 1$ — ahí porque $h_2 = 2^{4} \equiv 1$ directamente. La [[parciales-viejos|nota de parciales viejos]] ya lo marca como degenerado y propone otro par. Los dos ejemplos que el vault tiene de Diffie-Hellman con números chicos, uno de la cátedra y uno de un estudiante, terminan en la clave $1$. **Para el parcial: verificar que $k \ne 1$ antes de escribir el ejemplo**, y no alcanza con verificar $h_1, h_2 \ne 1$ — la lámina lo demuestra. Un par que sí sirve en $\mathbb{Z}_7^{*}$ con $g = 3$: $x = 2$, $y = 5$, que da $h_1 = 2$, $h_2 = 5$ y $k = 3^{10} = 3^{4} = 4$ (comprobación: $5^{2} = 25 \equiv 4$ y $2^{5} = 32 \equiv 4$).

### Dos significados de la letra q

Hay una segunda cosa en la lámina que hay que leer con cuidado. Escribe $q = 7$, y el $7$ es el **módulo**: el grupo es $\mathbb{Z}_7^{*}$, que tiene **seis** elementos. En Katz & Lindell —y en la filmina 18 de la teoría, y en la voz: *"la cantidad $q$, acuérdense, es la cantidad de elementos del grupo"* (cue 531)— la $q$ de $(G, q, g)$ es el **orden** del grupo, que acá sería $6$. Las dos convenciones conviven en el material de la cátedra: el enunciado del parcial 1C-2025 escribe *"un Grupo $G$ $\mathbb{Z}_q$ con una raíz primitiva $g$"*, o sea $q$ como módulo, igual que esta filmina.

Con $q$ como módulo, el paso *"$x \leftarrow \mathbb{Z}_q$"* sortea exponentes entre $0$ y $6$, y el $6$ sobra: $3^{6} = 3^{0} = 1$. No rompe nada —el protocolo cierra igual porque los exponentes se reducen módulo el orden— pero es una casilla de más. La nota de la sección 1P ya deja fijadas las dos lecturas para el examen —*"$q$ el tamaño del grupo, que aquí es $p-1$"*, en [[1p-cuentas-de-asimetrica#Diffie-Hellman: acordar una clave sin transmitirla|Cuentas de asimétrica]]—; esta filmina es el lugar donde se ve que la cátedra misma usa las dos.

---

## 6. Los cuatro ataques, con la definición que la Guía 4 no daba

*Filmina 8.* Con triángulo de advertencia, **Ataques**:

- **Impersonating / Masquerading**: *"uno solo de los participantes ejecuta el protocolo y el adversario se hace pasar por el otro participante"*.
- **MIM, Man in the Middle**: *"las dos partes ejecutan el protocolo. El adversario intercepta y modifica mensajes que se envían"*.
- **Replay.**
- **Key Reuse.**

Son los cuatro nombres del **Ej. 1 de la [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 1|Guía 4]]** —que los pide con ejemplo y contramedida, sin definirlos— y esta lámina es **la única fuente de la cátedra que define dos de ellos**. Y el criterio de la definición vale la pena: no es *qué hace* el adversario sino **cuántos participantes honestos están ejecutando el protocolo**. En un *masquerading* hay uno solo, y el adversario ocupa el lugar del otro extremo; en un *man in the middle* están los dos, y el adversario está entre ellos alterando lo que se cruzan. Es exactamente la distinción entre el ataque a la [[needham-schroeder#El ataque: una clave de sesión vieja alcanza|segunda aproximación de Needham-Schroeder]] —donde sólo $B$ ejecuta el protocolo y el atacante hace de $A$ con una clave vieja— y el ataque a [[diffie-hellman#En la práctica: el problema del atacante activo|Diffie-Hellman]], donde $A$ y $B$ ejecutan el protocolo completo sin saber que hay alguien en el medio.

Los otros dos van sin definición, y no hace falta: **replay** lo definió la [[practica-04-macs-hash-y-cifrado-autenticado#4. Mac-Forge, y el aviso que la teoría no da: replay|Práctica 04]] dos semanas antes, con sus dos contramedidas, y **key reuse** es el segundo problema de la primera aproximación de Needham-Schroeder → [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]].

**Contra la teoría de la Clase 05**, que todavía no se dictó: sus filminas 4 a 6 catalogan al atacante activo por sus **poderes** —omitir, reescribir, reordenar, repetir— y no por nombre de ataque → [[ataques-activos-y-man-in-the-middle#Los cuatro poderes de un atacante activo|Los cuatro poderes de un atacante activo]]. Las dos listas son complementarias: la de teoría dice qué puede hacer el adversario, la de la práctica cómo se llama el resultado. La abreviatura *"MIM"* es de la lámina; el vault y la teoría escriben `MITM`.

---

## 7. Esquemas asimétricos: qué ganan y qué cuestan

*Filmina 9.* $\mathsf{Gen}$ produce **dos claves**: una para encripción, $pk$, pública; otra para desencripción, $sk$, privada. Y la frase que encabeza: **"la seguridad subyace en mantener $sk$ secreta y no $pk$"**. Con pulgares:

| A favor | En contra |
|---|---|
| Resuelve la distribución de claves | **Más lento** |
| Sólo se guarda una $sk$ para comunicarse con varios | |
| $sk$ y $pk$ se generan por anticipado | |

Las tres ventajas son, otra vez, el cierre de Katz & Lindell §10.4, que contesta punto por punto las tres limitaciones de la [[#3. Las tres limitaciones de la clave privada, y qué resuelve el KDC|filmina 1]]: la distribución se hace por canales públicos (aunque autenticados), cada uno guarda una sola clave secreta, y el par se genera **antes** de saber con quién se va a hablar — que es la forma en que el libro describe la aplicabilidad a sistemas abiertos: el comercio publica su $pk$ y el cliente la busca cuando la necesita. La desventaja única, *"más lento"*, es la que motiva el [[#10. Cifrado híbrido: la construcción que ninguna filmina de teoría trae|cifrado híbrido]] seis láminas más adelante, y la que [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]] cuantifica.

**Lo que la teoría tiene y la práctica no**: la advertencia de Abad de que las dos claves **no son intercambiables** —*"error conceptual que pasa más de lo que me gustaría"* (cues 719-724)— y la prueba `Eav` en la que el adversario recibe $pk$, con su consecuencia de que ser indistinguible ante escucha **ya es** `CPA` → [[criptosistema-asimetrico#Las dos claves no son intercambiables|Criptosistema asimétrico]]. La práctica sólo se queda con el corolario, cuatro láminas después.

> **Un detalle de notación** *(precisión nuestra)*. La lámina escribe $p_k$ y $s_k$, con la $k$ como **subíndice**, en ésta y en las filminas 13, 15, 16 y 19. Se lee como "$p$ sub $k$", y no es eso: son las dos letras $pk$ y $sk$, *public key* y *secret key*, como las escriben el libro y la teoría. En el mundo simétrico el subíndice $k$ sí es la clave —$\mathsf{Enc}_k$, $\mathsf{Mac}_k$—, así que la grafía invita a confundir la clave con un índice.

---

## 8. GenRSA, y la clave por dentro con openssl

### GenModulus y la terna de claves

*Filmina 10.* **GenRSA: algoritmo de generación de claves**, escrito como en Katz & Lindell §11.5.1:

$$\begin{aligned}
&(N, p, q) \leftarrow \mathsf{GenModulus}(1^{n})\\
&\text{con } \varphi(N) = (p-1)(q-1)\\
&\text{Elegir } e:\ \gcd(e, \varphi(N)) = 1\\
&\text{Calcular } d := [\,e^{-1} \bmod \varphi(N)\,]
\end{aligned}$$

$$\langle N, e\rangle \text{ es } pk \qquad\qquad \langle N, d\rangle \text{ es } sk$$

La diferencia con la filmina 24 de teoría es de **capas**: la teoría escribe *"elegir $p, q$ primos, $n = p \cdot q$"* y sigue; la práctica encapsula esa elección en un algoritmo con nombre, $\mathsf{GenModulus}$, que recibe el parámetro de seguridad $1^{n}$ y devuelve el módulo con sus dos primos. Es la misma separación de responsabilidades que el libro usa para poder decir *"el problema `RSA` es difícil relativo a $\mathsf{GenRSA}$"*: la dureza de factorizar depende de **cómo** se eligen los primos, y por eso la elección merece un algoritmo propio — el que en la práctica tiene las *"como 40 condiciones"* de las que habló la voz (cue 874). La construcción, la justificación de cada paso y el cálculo de $d$ con Euclides extendido están en [[rsa#La construcción|RSA § La construcción]].

*(La lámina escribe $\Phi(N)$ con phi mayúscula y abre un corchete en el cálculo de $d$ que nunca cierra; la filmina 14 vuelve a $\varphi(n)$ minúscula. Cosmético.)*

### Los dos comandos, y qué cambió desde que se tomó la captura

*Filminas 11 y 12.* Dos capturas de terminal, pegadas como imagen —**la extracción de texto no las ve**—, con una burbuja cada una.

La primera genera la clave y mira el archivo:

```
$ openssl genrsa -out privada.pem 2048
Generating RSA private key, 2048 bit long modulus
..............................................+++
.............+++
e is 65537 (0x10001)
$ ls -l
-rw-r--r--  1 siles  staff  1679 Sep  1 00:00 privada.pem
$ file privada.pem
privada.pem: PEM RSA private key
```

y la burbuja dice lo que las líneas de puntos muestran: *"cuanto más grande la clave, más tarda en calcular los primos $p$ y $q$"* — cada `+++` cierra la búsqueda de un primo. El `e is 65537` es el exponente público por defecto, $2^{16}+1$, el mismo que aparece en los certificados de la [[x509|Clase 05]].

La segunda abre la clave en texto:

```
$ openssl rsa -in privada.pem -text -out privada.txt
writing RSA key
```

*"En `privada.txt` se va a encontrar los números $p$ y $q$, el módulo $N$, los valores $e$ y $d$ y otros valores para agilizar los cálculos."* Cierra con un enlace a un artículo de flu-project sobre generación de claves `RSA` (parte 3).

**Las capturas son de una versión vieja de OpenSSL, y hoy los dos comandos se comportan distinto.** *(Verificado corriendo los dos con `OpenSSL 3.6.2`, la misma versión con la que están corridos los ejercicios de la [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 10|Guía 4]].)*

| Lo que muestra la lámina | Lo que hace OpenSSL 3.x |
|---|---|
| `genrsa` imprime *"Generating RSA private key…"*, los puntos y *"e is 65537"* | **no imprime nada**: genera la clave en silencio |
| el archivo pesa 1679 bytes y `file` lo reconoce como *"PEM RSA private key"* | pesa unos 1700 bytes y empieza con `-----BEGIN PRIVATE KEY-----`: es formato **PKCS#8**, no el tradicional `BEGIN RSA PRIVATE KEY` de la captura. Para reproducir el de la lámina hay que agregar `-traditional` |
| permisos `-rw-r--r--`: la clave privada quedó **legible para cualquier usuario** de la máquina | el archivo se crea con `-rw-------` |
| `openssl rsa -text` contesta *"writing RSA key"* | igual: ese comando no cambió |

El formato de la salida *"Generating RSA private key, 2048 bit long modulus"* sin el sufijo *"(2 primes)"* es el de OpenSSL 1.0.x o 1.1.0 — la misma era que la sinopsis de `openssl req` que trae el enunciado de la Guía 4. El detalle de los permisos vale más que como curiosidad: una clave privada con lectura para todos es exactamente lo que el punto 2 de la [[#3. Las tres limitaciones de la clave privada, y qué resuelve el KDC|filmina 1]] —almacenamiento de claves— dice que hay que evitar, y las versiones nuevas lo corrigen solas.

### Lo que hay en privada.txt

La lámina nombra $p$, $q$, $N$, $e$, $d$ y *"otros valores para agilizar los cálculos"*, sin decir cuáles. El volcado de `-text` los lista con estos rótulos, en este orden:

| Rótulo en `privada.txt` | Qué es |
|---|---|
| `modulus` | $N = p \cdot q$ |
| `publicExponent` | $e$ — `65537 (0x10001)` |
| `privateExponent` | $d = e^{-1} \bmod \varphi(N)$ |
| `prime1`, `prime2` | $p$ y $q$ |
| `exponent1` | $d_p = d \bmod (p-1)$ |
| `exponent2` | $d_q = d \bmod (q-1)$ |
| `coefficient` | $q^{-1} \bmod p$ |

Los tres últimos son los **parámetros del teorema chino del resto**: permiten calcular $c^{d} \bmod N$ como dos exponenciaciones más chicas, módulo $p$ y módulo $q$, con exponentes $d_p$ y $d_q$ de la mitad de los bits, y recombinar con el coeficiente. Es lo que hace que descifrar y firmar con la clave privada sea unas cuatro veces más rápido que hacerlo con $d$ entero — y es también por qué la clave privada guarda a $p$ y $q$: **quien tiene `privada.txt` tiene la factorización de $N$**, y no sólo $d$. *(Las cinco identidades —$N = pq$, $ed \equiv 1 \pmod{\varphi(N)}$, $d_p$, $d_q$ y el coeficiente— se comprobaron sobre una clave generada al efecto.)* La otra mitad de la historia —por qué la clave pública son sólo $\langle N, e\rangle$ y qué tamaño tiene que tener $N$— está en [[pkcs1-y-tamano-de-claves#Tamaño de claves|PKCS#1 y tamaño de claves]].

---

## 9. El esquema de clave pública y el RSA de libro de texto

*Filmina 13.* La terna, escrita con la distinción que la [[practica-01-esquemas-y-taxonomias|Práctica 01]] fijó entre la flecha probabilística y la asignación determinística:

$$\begin{aligned}
&1.\ \mathsf{Gen}:\ (pk, sk) \leftarrow \mathsf{Gen}(1^{n})\\
&2.\ \mathsf{Enc}:\ c \leftarrow \mathsf{Enc}_{pk}(m)\\
&3.\ \mathsf{Dec}:\ m := \mathsf{Dec}_{sk}(c)
\end{aligned}$$

Y abajo, con triángulo de advertencia y en caja: **"Si el cifrado público es determinístico, NO es CPA-Secure"**. Es el corolario que la teoría deduce en la filmina 23 y que Abad dijo *"desde el vamos"*: publicar $pk$ es regalar la función de cifrado, así que el adversario del experimento `Eav` puede cifrar $m_0$ y $m_1$ por su cuenta y comparar → [[criptosistema-asimetrico#El corolario que se sigue directo: cifrado no determinístico obligatorio|Criptosistema asimétrico § cifrado no determinístico obligatorio]]. La práctica da la conclusión sin el argumento; la flecha $\leftarrow$ del paso 2 —y no $:=$— es la forma tipográfica de la misma exigencia.

*Filmina 14.* **Esquema RSA encripción**:

$$\begin{aligned}
&1.\ \mathsf{Gen}:\ \text{ejecuta } \mathsf{GenRSA};\ pk = \langle N, e\rangle,\ sk = \langle N, d\rangle\\
&2.\ \mathsf{Enc}:\ c := [\,m^{e} \bmod N\,]\\
&3.\ \mathsf{Dec}:\ m := [\,c^{d} \bmod N\,]
\end{aligned}$$

Nótese el $:=$ del paso 2: la lámina escribe a `RSA` de libro de texto como lo que es, **determinístico**, justo debajo de la caja que dice que entonces no es `CPA`-seguro. La contradicción es deliberada y es la misma de la teoría —presentar el esquema y romperlo—, sólo que la práctica no la remata: no hay ninguna lámina de `PKCS#1`, y el parche queda implícito → [[rsa#Los tres problemas de textbook RSA|RSA § Los tres problemas]] y [[pkcs1-y-tamano-de-claves|PKCS#1]].

### La demostración en una línea, y el paso que se saltea

Al pie de la filmina 14, la corrección del esquema en un solo renglón:

$$c^{d} \bmod N = c^{\,e^{-1} \bmod \varphi(n)} \bmod N = (m^{e})^{\,e^{-1} \bmod \varphi(n)} \bmod N = m^{1} = m$$

Tal como está escrita, **la línea se salta el único paso que tiene contenido.** $e \cdot (e^{-1} \bmod \varphi(n))$ **no es $1$** como número entero: es $1 + k\varphi(n)$ para algún $k$, y lo que hace que $m^{1 + k\varphi(n)} \equiv m$ es el **teorema de Euler**, $m^{\varphi(n)} \equiv 1 \pmod n$ — con la letra chica de que exige $\gcd(m, n) = 1$, y que para los mensajes que no la cumplen el resultado se rescata por el teorema chino del resto. Escribir *"$= m^{1}$"* como si los exponentes se cancelaran es tratar la congruencia módulo $\varphi(n)$ como una igualdad. Es exactamente el paso que la voz del 10/09 desarrolló en pantalla durante diez minutos, con un alumno contestando cuánto vale $m^{\varphi(n)} \bmod n$ (cues 783-854) → [[rsa#Por qué cierra: Euler-Fermat|RSA § Por qué cierra]]. Para el parcial, la versión de la teoría es la que hay que saber escribir; la de la práctica es un recordatorio, no una demostración.

---

## 10. Cifrado híbrido: la construcción que ninguna filmina de teoría trae

*Filmina 15.* **Esquema de cifrado híbrido: público-asimétrico ($\Pi$) + privado-simétrico ($\Pi'$)**.

$$\begin{aligned}
&1.\ \mathsf{Gen}^{hy}:\ (pk, sk) \leftarrow \mathsf{Gen}(1^{n})\\
&2.\ \mathsf{Enc}^{hy}:\ \text{elegir } k \leftarrow \{0,1\}^{n}.\ \text{Calcular } c_1 \leftarrow \mathsf{Enc}_{pk}(k)\ \text{(cifrado asimétrico)}\\
&\qquad\qquad \text{y } c_2 \leftarrow \mathsf{Enc}'_{k}(m)\ \text{(cifrado simétrico), y emitir } (c_1, c_2)\\
&3.\ \mathsf{Dec}^{hy}:\ k := \mathsf{Dec}_{sk}(c_1),\quad m := \mathsf{Dec}'_{k}(c_2)
\end{aligned}$$

Y en una burbuja, el teorema: **`CPA` seguro siempre que $\Pi$ sea `CPA` seguro y $\Pi'$ sea seguro ante eavesdropping.**

**Es la única construcción de esta práctica que no está en ninguna de las filminas de teoría de la Clase 04**, y es una de las más importantes en la práctica: es lo que hacen `TLS`, `PGP` y cualquier sistema que cifre volumen con clave pública. Está en Katz & Lindell §11.3 —la figura 11.1 es exactamente esta lámina; la Construcción 11.10 la reescribe con un mecanismo de encapsulamiento de clave, y el Teorema 11.12 es la burbuja—. El vault la tenía sólo mencionada al pasar, en [[costo-del-cifrado-asimetrico#Los bits asimétricos y los simétricos no se comparan uno a uno|Costo del cifrado asimétrico]] y en [[el-gamal|El Gamal]]; desde esta ingesta tiene nota propia, **[[cifrado-hibrido|Cifrado híbrido]]**, con la construcción, el porqué de cada hipótesis, la cuenta de eficiencia y el paradigma KEM/DEM.

Tres cosas de la lámina que valen por sí solas:

- **La hipótesis sobre $\Pi'$ es la débil, y está bien que lo sea.** No pide que el cifrado simétrico sea `CPA`-seguro: pide indistinguibilidad ante **una sola escucha**. La razón es que la clave $k$ es fresca en cada cifrado y se usa **una vez**; nunca hay dos criptogramas bajo la misma $k$, así que la seguridad multi-mensaje sobra. Alcanza con un cifrado de flujo sobre un generador seudoaleatorio, como el de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]]. Muchos resúmenes escriben "`CPA` en los dos"; la lámina es más precisa que eso.
- **Es un esquema de clave pública aunque adentro tenga cifrado simétrico**: emisor y receptor no comparten ningún secreto de antemano. Lo que se comparte, $k$, viaja dentro del propio criptograma.
- **Resuelve el "más lento" de la filmina 9 sin renunciar a nada.** El costo por bit de cifrar $m$ tiende al costo del cifrado simétrico a medida que $m$ crece: la parte asimétrica se paga una vez por mensaje, no por bloque.

Con esto la filmina 20, cinco láminas después, deja de ser una consigna: *"Confidencialidad: combina cifrado simétrico y asimétrico"* es **esta** construcción, con el intercambio de claves del *handshake* en el lugar de $c_1$.

---

## 11. Firma digital contra MAC, en una tabla

*Filmina 16.* Las dos ternas lado a lado —la de firma en grande, la de MAC en una caja al costado—:

$$\begin{aligned}
&1.\ \mathsf{Gen}:\ (pk, sk) \leftarrow \mathsf{Gen}(1^{n}) &&\qquad \mathsf{Gen}:\ k \leftarrow \mathsf{Gen}(1^{n})\\
&2.\ \mathsf{Sign}:\ \sigma \leftarrow \mathsf{Sign}_{sk}(m) &&\qquad \mathsf{Mac}:\ t \leftarrow \mathsf{Mac}_{k}(m),\ \text{el emisor envía } \langle m, t\rangle\\
&3.\ \mathsf{Vrfy}:\ b := \mathsf{Vrfy}_{pk}(m, \sigma) &&\qquad \mathsf{Vrfy}:\ b := \mathsf{Vrfy}_{k}(m, t),\ b = 1 \text{ si es válido}
\end{aligned}$$

y abajo, con **"ambos aseguran integridad"** en el medio, la comparación:

| Firma digital | MAC |
|---|---|
| Fácil distribución de clave | Una clave por cada receptor |
| Una sola firma puede ser verificada por cualquier receptor | Una MAC por cada clave |
| Verificables públicamente | No verificables públicamente |
| Provee *"no repudio"* | No provee *"no repudio"* |
| | **Más eficiente** |

La caja de MAC es la misma de la filmina 1 de la [[practica-04-macs-hash-y-cifrado-autenticado#3. Del cifrado al MAC|Práctica 04]], copiada con su anotación *"emisor envía $\langle m,t\rangle$"*. Las cuatro filas de la izquierda son las tres propiedades que Abad dedujo de un solo hecho —verificar usa una clave distinta de la de firmar— más la distribución; lo que la práctica agrega es el **costo** del lado del MAC, en dos renglones que la teoría dice en voz y no en filmina: para llegar a $n$ receptores hacen falta $n$ claves y $n$ etiquetas, contra una firma. Y la última fila, *"más eficiente"*, es la razón por la que ningún protocolo firma el tráfico: se firma una vez para acordar una clave y después se autentica con MAC — que es el mismo movimiento del cifrado híbrido, del lado de la integridad. Todo el argumento, con el marco legal que la lámina no tiene, en [[firma-digital#Transferibilidad y no repudio, argumentados desde la clave compartida|Firma digital]]; el ejercicio que lo pide en cuatro escenarios es el [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 8|Ej. 8 de la Guía 4]].

---

## 12. Textbook RSA para firma, el ataque de no mensaje y el hash que reduce el riesgo

*Filmina 17.* **Textbook RSA para firma**:

$$\begin{aligned}
&1.\ \mathsf{Gen}:\ \text{ejecuta } \mathsf{GenRSA};\ pk = \langle N, e\rangle,\ sk = \langle N, d\rangle\\
&2.\ \mathsf{Sign}:\ \sigma := [\,m^{d} \bmod N\,]\\
&3.\ \mathsf{Vrfy}:\ m := [\,\sigma^{e} \bmod N\,]
\end{aligned}$$

Y el veredicto en rojo, con triángulo: **INSEGURO (Ataque de no mensaje)**.

El nombre es lo que importa. La filmina 37 de teoría da dos ataques a este esquema: la **firma al azar** —elegir $\sigma$ primero y dejar que el mensaje salga de $m = \sigma^{e} \bmod N$— y el **multiplicativo**; en el aula Abad dio sólo el segundo (cues 1143-1145). El primero es el que el [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 16|Ej. 16 de la Guía 4]] pide con la fórmula ya escrita, y **acá la cátedra lo llama por su nombre de la literatura**, *no-message attack*: el adversario gana `Sig-forge` sin hacer ni una consulta al oráculo de firma. La nota [[rsa-signature-y-hashed-rsa#Por qué está roto: la firma al azar|RSA-Signature y Hashed RSA]] lo desarrolla y ya lo nombraba así; con esta lámina el nombre pasa a ser de la cátedra.

*(La lámina escribe la verificación como *"$m := [\sigma^{e} \bmod N]$"*, o sea como una función que devuelve un mensaje. Es la forma que hace evidente el ataque —cualquier $\sigma$ "verifica" contra algo—, pero un $\mathsf{Vrfy}$ devuelve un bit: la comparación $\sigma^{e} \bmod N \overset{?}{=} m$ queda implícita.)*

*Filmina 18.* **Hash RSA reduce riesgo**:

$$\begin{aligned}
&1.\ \mathsf{Gen}:\ (pk, sk) \leftarrow \mathsf{Gen}(1^{n})\\
&2.\ \mathsf{Sign}:\ \sigma := [\,H(m)^{d} \bmod N\,]
\end{aligned}$$

No hay paso 3 escrito; lo dibuja el diagrama: el documento viaja con su firma, el receptor aplica $pk$ a la firma y obtiene un $\mathrm{Hash(doc)}$, calcula el hash del documento recibido, y compara — igual, cara sonriente; distinto, pulgar abajo. Dos cosas del título:

- **"Reduce riesgo", no "es seguro".** Es la formulación honesta, y coincide con lo que la teoría concede: `Hashed RSA` no tiene demostración de seguridad fuera de un modelo ideal de $H$ (*"si la función de hash es ideal"*, cue 1155) → [[rsa-signature-y-hashed-rsa#El límite honesto: sin prueba fuera del modelo ideal|El límite honesto]].
- **Lo que el hash arregla son dos cosas, no una**, y la lámina sólo muestra la primera: rompe la estructura algebraica que hacen falsificable a la firma sin hash, y además **acota el tamaño de la firma** al del hash, sea cual sea el largo del documento — la razón que la voz agregó y que la filmina 37 de teoría no trae (cues 1147-1149). El diagrama de la práctica lo sugiere sin decirlo: el documento es una caja grande, la firma es una tira.

---

## 13. PKI en una lámina

*Filmina 19.* **PKI: Public Key Infrastructure.** *"Define cómo distribuir $\langle pk, sk\rangle$"*, una caja que dice **Certificados**, y dos viñetas: **Jerarquías**, y **Validez** con dos palabras al costado, *expiración* y *revocación*. Al pie, `https://pki.jgm.gov.ar/`.

Es el índice de las filminas 7 a 21 de la Clase 05 en cinco palabras, y cada una tiene nota: qué es y para qué sirve la infraestructura en [[infraestructura-de-clave-publica|Infraestructura de clave pública]], el objeto en [[certificados-digitales|Certificados digitales]], las jerarquías en [[cadenas-de-firmas-y-autoridades-raiz|Cadenas de firmas y autoridades raíz]] y la validez en [[revocacion-y-listas-crl|Revocación y listas CRL]]. El enlace es el sitio de la **Autoridad Certificante Raíz de la República Argentina**, publicado bajo el dominio de la Jefatura de Gabinete de Ministros, de la que depende el Ente Licenciante que la opera — la jerarquía que el [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 14|Ej. 14 de la Guía 4]] investiga, con los certificados raíz descargados y leídos.

> **Una palabra de más en la primera línea** *(precisión nuestra)*. Una PKI define cómo distribuir **claves públicas** atadas a una identidad. La clave privada **nunca se distribuye**: la genera su dueño y no sale de su poder — es la única premisa de todo el edificio, la que la filmina 9 enunció como *"mantener $sk$ secreta"*. Escribir $\langle pk, sk\rangle$ es un desliz de tipeo con consecuencias de lectura: un certificado contiene $pk$, el nombre del titular y la firma de la autoridad, y nada más. Ver [[certificados-digitales|Certificados digitales]].

---

## 14. TLS en una lámina, y las dos RFC

*Filmina 20.* **TLS = Transport Layer Security**: *"proporciona cifrado, autenticación e integridad entre ambos extremos de la conexión"*, y las tres en un renglón cada una:

| Garantía | Cómo, según la lámina |
|---|---|
| **Confidencialidad** | combina cifrado simétrico y asimétrico |
| **Autenticación** | autentica cliente y autentica servidor |
| **Integridad** | usa hash |

La primera línea es el [[#10. Cifrado híbrido: la construcción que ninguna filmina de teoría trae|cifrado híbrido]] de la filmina 15 puesto en producción. Las otras dos piden una lectura con cuidado *(precisiones nuestras, con las notas de la Clase 05)*:

- **"Autentica cliente y autentica servidor."** En `TLS` la autenticación del **servidor** es la regla y la del **cliente** es **opcional**: sólo ocurre cuando el servidor envía `CertificateRequest`, que la propia filmina 40 de teoría condiciona con *"si el cliente es autenticado"*. En la web abierta el cliente casi nunca se autentica con certificado; se autentica después, a nivel aplicación, con una contraseña que ya viaja cifrada → [[tls-handshake|TLS handshake]].
- **"Usa hash."** Lo que da integridad al tráfico es un **MAC** —`HMAC` sobre el récord en `TLS` 1.2— o un cifrado autenticado `AEAD` en `TLS` 1.3; un hash a secas no protege contra un atacante activo, que fue la tesis entera de la [[clase-03-macs-y-cifrado-autenticado|Clase 03]]. La teoría de la Clase 05 usa la misma palabra en el récord (*"hashea y cifra"*), y la nota [[tls-arquitectura-y-record#El TLS Record|TLS: arquitectura y record]] ya lo lee como *MAC-then-encrypt*. Para el Verdadero/Falso conviene tener la distinción a mano: *"`TLS` provee integridad con una función de hash"* es cierto en el sentido laxo de la cátedra y falso en el sentido de la Clase 03.

*Filmina 21.* Dos referencias: **Applied Cryptography, de Bruce Schneier**, y **`TLS` = RFC 2246 (primera versión) y RFC 8446 (`TLS` 1.3)**. Las dos RFC son exactas —la 2246 es `TLS` 1.0, de 1999; la 8446 es `TLS` 1.3, de 2018— y **ninguna es la que cita la teoría**: la filmina 48 de la Clase 05 manda a la RFC 5246, que es `TLS` 1.2 y la versión que sus láminas describen. Entre las tres RFC está la historia entera del protocolo, y el [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital#Ejercicio 18|Ej. 18 de la Guía 4]] está contestado contra las dos que cita esta lámina. Schneier figura en la [[bibliografia|bibliografía de la cátedra]] como texto de consulta, *"clásico; muy legible pero desactualizado"*; es la primera vez que una filmina lo nombra.

---

## Erratas y precisiones de las filminas

Todas verificadas **renderizando la página**, nunca leyendo el texto extraído. Las que son artefactos de extracción van [[#Artefactos de extracción|en la sección siguiente]], aparte.

| Filmina | Dice | Debería decir |
|---|---|---|
| **P5-7** | $G_7$, $q = 7$, $g = 3$ en el ejemplo, con el protocolo escrito en la notación $(G, q, g)$ del libro | En esa notación $q$ es el **orden** del grupo, y $\mathbb{Z}_7^{*}$ tiene **seis** elementos: $q = 6$. Con $q = 7$ como módulo, *"$x \leftarrow \mathbb{Z}_q$"* sortea un exponente de más ($3^{6} = 3^{0} = 1$). Es la convención del enunciado del parcial, no la de la teoría ni del libro. Ver [[#Dos significados de la letra q\|§5]] |
| **P5-7** | El ejemplo termina en $k_A = k_B = 1$ | No es un error de cuentas —cierran— sino de **elección**: $xy = 12 \equiv 0 \pmod 6$ y la clave compartida es el neutro. Un ejemplo que ilustre el protocolo necesita $k \ne 1$; con $g = 3$ sirve $x = 2$, $y = 5$, que da $k = 4$. Ver [[#Por qué da 1, y qué enseña\|§5]] |
| **P5-19** | *"Define cómo distribuir $\langle pk, sk\rangle$"* | Cómo distribuir **$pk$**, atada a una identidad. La clave privada no se distribuye nunca. Ver [[#13. PKI en una lámina\|§13]] |
| **P5-20** | *"Autentica cliente y autentica servidor"* | Autentica **al servidor**; al cliente sólo si el servidor lo pide (`CertificateRequest`, *"si el cliente es autenticado"* en la filmina 40 de teoría). Ver [[#14. TLS en una lámina, y las dos RFC\|§14]] |
| **P5-20** | *"Integridad: usa hash"* | Un **MAC** (`HMAC`) o un `AEAD`; un hash sin clave no da integridad ante un atacante activo. Misma imprecisión que la filmina 31 de teoría |
| **P5-2** | *"Ej: Needham Schroeder"* bajo un diagrama en el que el KDC le manda $\{s\}_{k_B}$ **a $B$** | En Needham-Schroeder el KDC le entrega **a $A$** las dos partes y $A$ reenvía el ticket a $B$; lo que está dibujado es el KDC simplificado de Katz & Lindell §10.2. Ver [[#3. Las tres limitaciones de la clave privada, y qué resuelve el KDC\|§3]] |
| **P5-14** | $(m^{e})^{\,e^{-1} \bmod \varphi(n)} \bmod N = m^{1} = m$ | El exponente vale $1 + k\varphi(n)$, no $1$: el paso que falta es el teorema de Euler, con $\gcd(m, n) = 1$ o el teorema chino del resto. Ver [[#La demostración en una línea, y el paso que se saltea\|§9]] |
| **P5-10** | *"Calcular $d$: $[e^{-1} \bmod (\Phi(N))$"* — corchete que abre y no cierra; $\Phi$ mayúscula | $d := [e^{-1} \bmod \varphi(N)]$. La filmina 14 vuelve a $\varphi(n)$ minúscula y con $n$ minúscula: tres grafías para la misma función en dos láminas. Cosmético |
| **P5-9, 13, 15, 16, 19** | $p_k$, $s_k$ con la $k$ como subíndice | $pk$, $sk$: dos letras, no una letra con índice. En el mundo simétrico el subíndice sí es la clave, y por eso la grafía confunde |
| **P5-17** | $\mathsf{Vrfy}:\ m := [\sigma^{e} \bmod N]$ | $\mathsf{Vrfy}$ devuelve un bit: $\sigma^{e} \bmod N \overset{?}{=} m$. Escrito como función que devuelve $m$ hace visible el ataque, pero no es una verificación |
| **P5-18** | La terna de Hashed RSA sin paso 3 | Falta $\mathsf{Vrfy}$; lo dibuja el diagrama de la misma lámina (aplicar $pk$ a la firma y comparar con el hash del documento) |
| **P5-11** | `-rw-r--r-- … privada.pem` | Una clave privada legible para todos los usuarios. No es errata de la lámina sino de la captura; OpenSSL 3 la crea con `-rw-------`. Ver [[#Los dos comandos, y qué cambió desde que se tomó la captura\|§8]] |

**Precisiones que no son erratas:**

- **P5-1 y P5-4.** *"Sólo un sitio de riesgo"* del lado positivo y *"ataque al KDC"* del negativo no se contradicen: son el mismo hecho, el KDC como único punto que proteger y como único punto cuya caída arrastra todo. Katz & Lindell lo enumera igual.
- **P5-6.** *"MAC (firma digital)"* es la presentación del libro y de la teoría —la firma como análogo de clave pública de un MAC—, no una confusión entre las dos primitivas: la filmina 16 las distingue en una tabla.
- **P5-7.** Cinco pasos contra los siete de la teoría y los ocho del parcial 1C-2025: el mismo protocolo con distinta granularidad. Y la tabla de potencias de $3$ es correcta: $3$ es raíz primitiva módulo $7$.
- **P5-8.** *"MIM"* por *man in the middle*; el vault, la teoría y la Guía 4 escriben `MITM`.
- **P5-11.** La salida *"Generating RSA private key, 2048 bit long modulus / e is 65537"* es de OpenSSL 1.0.x o 1.1.0; en 3.x `genrsa` no imprime nada y escribe PKCS#8. El comando sigue siendo correcto.
- **P5-15.** Que $\Pi'$ sólo necesite ser seguro ante *eavesdropping* —y no `CPA`— **no es una omisión**: es la hipótesis exacta del Teorema 11.12 de Katz & Lindell, y la práctica es más precisa que la mayoría de los resúmenes.
- **P5-18.** *"Reduce riesgo"* en vez de *"es seguro"* es la formulación correcta: `Hashed RSA` no tiene prueba fuera del modelo ideal.
- **Transversal.** La práctica escribe $N$ mayúscula para el módulo (filminas 10, 14, 17, 18) y la teoría $n$ minúscula; la práctica escribe $h_1, h_2$ como la teoría, y no $h_A, h_B$ como el libro.

---

## Artefactos de extracción

Defectos que **la extracción automática de texto inventa** y que el PDF no tiene, siguiendo el precedente de la [[practica-04-macs-hash-y-cifrado-autenticado#Artefactos de extracción|Práctica 04]] y de la [[clase-03-macs-y-cifrado-autenticado#Estado de las fuentes|Clase 03]].

| Filmina | Parece | Es |
|---|---|---|
| **P5-7** | Que la lámina sólo tiene los cinco pasos del protocolo y la tabla de potencias | **Artefacto grave por pérdida de contenido.** Faltan los **seis globos de diálogo** con el ejemplo numérico completo —$G_7, q = 7, g = 3$; $x = 3$, $3^{3} \equiv 6$; $h_1 = 6$; $y = 4$, $3^{4} \equiv 4$; $h_2 = 4$; $4^{3} \equiv 1$ y $6^{4} \equiv 1$—. Es el único ejemplo con números de la práctica y **la extracción no devuelve ninguno de sus valores**. Sólo se recupera renderizando |
| **P5-7** | `𝒉𝒙𝟐`, `𝟑𝟐 = 𝟐`, `𝟑𝟎 = 𝟏`, y una `𝒚` suelta en la línea anterior | $h_2^{\,x}$, $3^{2} = 2$, $3^{0} = 1$, y el exponente $y$ de $h_1^{\,y}$: superíndices y subíndices reales aplanados |
| **P5-11 y P5-12** | Que las láminas sólo tienen el título y el texto de las burbujas | Las **dos capturas de terminal** —los comandos `openssl genrsa`, `ls -l`, `file` y `openssl rsa -text` con su salida— son **imágenes**, y la extracción no las ve. Es la mitad del contenido de las dos láminas |
| **P5-10** | `con: (N)=(p-1)(q-1)`, `mcd(e, (N)) = 1`, `[e-1 mod ((N))` | $\Phi(N) = (p-1)(q-1)$, $\gcd(e, \Phi(N)) = 1$, $[e^{-1} \bmod (\Phi(N))$: la letra griega se pierde y el $-1$ es un superíndice real |
| **P5-13, 15, 16** | `(pk,sk)Gen(1n)`, `cEnc pk(m)`, `k {0,1}n`, `Genhy` | Las **flechas de asignación $\leftarrow$ se pierden** junto con los superíndices: $(pk, sk) \leftarrow \mathsf{Gen}(1^{n})$, $c \leftarrow \mathsf{Enc}_{pk}(m)$, $k \leftarrow \{0,1\}^{n}$, $\mathsf{Gen}^{hy}$. La distinción $\leftarrow$ / $:=$, que es contenido, desaparece |
| **P5-16, 17, 18** | `Sign: sign sk(m)`, `Vrfy pk(m, )`, `:=[md mod N]`, `m:=[ e mod N]` | **La letra $\sigma$ se pierde en las cuatro apariciones**: $\sigma \leftarrow \mathsf{Sign}_{sk}(m)$, $\mathsf{Vrfy}_{pk}(m, \sigma)$, $\sigma := [m^{d} \bmod N]$, $m := [\sigma^{e} \bmod N]$. Sin ella, la terna de firma parece no producir nada |
| **P5-14** | Una tira de símbolos en dos líneas, con `𝑑`, `𝑒 −1 𝑚𝑜𝑑(𝜑 𝑛 )` sueltos arriba y `𝑐 𝑚𝑜𝑑𝑁= 𝑐 …` abajo | Una sola igualdad encadenada, bien compuesta, con los exponentes apilados. Ver [[#La demostración en una línea, y el paso que se saltea\|§9]] |
| **P5-2** | `(kA si es A, kB si es B, etc.) 1º B 2º{s}kB` en una línea, como si el texto siguiera | El texto del costado izquierdo y los **rótulos de las flechas del diagrama** (*"1º B"*, *"2º{s}kA"*, *"2º{s}kB"*, *"Usan clave s: {…}s"*) quedan intercalados. El diagrama es un triángulo KDC-$A$-$B$ con cuatro flechas |
| **P5-13, 15, 9** | `(pk,sk)`, `p/encripcion (pk)` | Caso inverso: la extracción **normaliza** la grafía $p_k$, $s_k$ con subíndice de la lámina y devuelve el $pk$, $sk$ estándar. La rareza sólo se ve en el render |
| **P5-1, 4, 8, 13, 17** | Que el título va solo | Cada uno lleva un **triángulo rojo de advertencia** al costado, el organizador visual de la práctica para "esto se rompe" |
| **P5-3, 9, 18** | Que las listas son viñetas neutras | Van agrupadas bajo un **pulgar arriba** y un **pulgar abajo**; en la 18, una cara sonriente para $=$ y un pulgar abajo para $\ne$. *(Al pasar a la wiki los emojis no se reproducen: el contraste va en palabras.)* |
| **P5-5** | Sólo texto | Dos **fotografías**, de Diffie a la izquierda y de Hellman a la derecha, y un sello inclinado *"ASIMÉTRICOS"* sobre las dos claves |
| **P5-18** | `doc`, `Hash(doc)`, `Sign(hash)`, `pk`, `= ≠` como palabras sueltas | Un **diagrama de tres etapas**: el documento con su hash, el sobre con documento y firma, y la verificación con dos cajas $\mathrm{Hash(doc)}$ comparadas |

---

## Cabos sueltos

- **No hay transcripción de esta práctica.** Todo lo que dice esta nota sale del PDF y de la comparación contra el deck de teoría, su transcripción y Katz & Lindell. Si la lámina es ambigua, la ambigüedad queda declarada y no resuelta.
- **Lo que la práctica no toca de la Clase 04**: [[el-gamal|El Gamal]] —sólo nombrado en la filmina 6—, [[pkcs1-y-tamano-de-claves|PKCS#1]] y el tamaño de claves, [[digital-signature-standard|DSS]], todo el repaso de [[grupos-anillos-y-cuerpos|álgebra]] y el experimento [[intercambio-de-claves|KE]]. En particular, después de decir que `RSA` determinístico no es `CPA`-seguro **no muestra el parche**: el padding aleatorio queda para la teoría.
- **La práctica de aritmética anunciada por Abad sigue sin aparecer.** Esta es la práctica del lunes 14/09 y trae un solo ejemplo numérico, el de Diffie-Hellman. Lo que el docente describió el 10/09 —*"ejercicios básicos, especialmente de aritmética"* (cue 298)— no está ni acá ni en la Guía 4.
- **El artículo de flu-project de la filmina 12 no se ingirió.** El enlace responde (verificado el 15/09), pero es material externo a la cátedra; lo que la filmina dice de él —qué hay en `privada.txt`— está desarrollado en [[#Lo que hay en privada.txt|§8]] con el volcado real.
- **Cuál de los dos significados de $q$ va a usar el parcial** no se puede saber desde el material: el enunciado 1C-2025 usa el módulo, la teoría el orden, y esta práctica los mezcla en una misma lámina. La respuesta modelo de la sección 1P cubre las dos lecturas.
- **La filmina 15 tiene nota propia nueva**, [[cifrado-hibrido|Cifrado híbrido]] (`04.13`), porque es la única construcción con teorema que no tiene otra fuente en la cátedra. Cuando la Clase 05 se dicte y `TLS` se explique en voz, hay que volver sobre ella para ver si el docente la nombra.
