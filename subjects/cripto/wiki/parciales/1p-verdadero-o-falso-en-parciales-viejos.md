---
title: Verdadero o Falso en los parciales viejos
resumen: 'Los cinco ejercicios de Verdadero o Falso y de múltiple choice de los cuatro primeros parciales, con el enunciado completo, la respuesta modelo sentencia por sentencia y los tips de cada uno.'
fuentes: ["[[parciales-viejos]]", "[[certificados-digitales]]", "[[x509]]", "[[infraestructura-de-clave-publica]]", "[[cadenas-de-firmas-y-autoridades-raiz]]", "[[message-authentication-code]]", "[[privacidad-e-integridad]]", "[[resistencias-de-una-funcion-de-hash]]", "[[firma-digital]]", "[[diffie-hellman]]", "[[sesion-y-conexion-tls]]", "[[cifrado-por-transposicion]]", "[[cifrado-de-sustitucion-monoalfabetica]]"]
aliases: [Verdadero o Falso en parciales viejos, VoF resueltos del parcial, Múltiple choice en parciales viejos, Sentencias resueltas del primer parcial]
type: parcial
clase: 1p
orden: 15
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, verdadero-o-falso, multiple-choice, parciales-viejos, certificados, mac, hash]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Verdadero o Falso en los parciales viejos

Cinco ejercicios en los cuatro parciales: el Ej. 5 de [[parciales-viejos#2C-2025|2C-2025]], de [[parciales-viejos#1C-2025|1C-2025]] y de [[parciales-viejos#1C-2023|1C-2023]] —cuatro sentencias con corrección cada uno—, el múltiple choice sobre SSL, TLS y PKI del mismo 1C-2023, y el Ej. 2 de [[parciales-viejos#1C-2018|1C-2018]], tres múltiple choice con justificación. El análisis por parcial, con las resoluciones del apunte y su verificación, está en [[parciales-viejos|Parciales viejos]].

La receta y las trampas de este tipo están en [[1p-verdadero-o-falso|Verdadero o Falso, con corrección]]; la sección entera empieza en [[primer-parcial|Primer parcial]].

## 2C-2025 · Ej. 5 — Hash, MAC, padding de RSA y certificados

### Enunciado

Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.

- a) MD5 es un criptosistema de encripción asimétrico que no debe ser utilizado porque usa una longitud de clave de 128 bits.
- b) Un protocolo de autenticación basado únicamente en un MAC simétrico provee confidencialidad, integridad y no repudio entre las partes.
- c) El uso de padding aleatorio en la implementación del algoritmo de clave pública de RSA es para que el algoritmo sea seguro a ataque de textos cifrados elegidos.
- d) Un certificado digital emitido por una autoridad certificante contiene siempre la clave pública de la CA.

### Respuesta modelo

a) **Falso.** `MD5` es una función de hash que no debe ser utilizada porque está quebrada: se conocen colisiones; su salida es de 128 bits. Cambios: «criptosistema de encripción asimétrico» por «función de hash», y «usa una longitud de clave de 128 bits» por «está quebrada por colisiones; los 128 bits son la longitud de su salida». Justificación: una función de hash no tiene clave y no se descifra, así que no es un criptosistema de ninguna clase; y lo que la descalifica es que se pueden fabricar dos mensajes distintos con el mismo digest, no el tamaño de ese digest.

b) **Falso.** Un protocolo de autenticación basado únicamente en un MAC simétrico provee integridad y autenticación de origen entre las partes, pero no confidencialidad ni no repudio. Cambio: se quitan «confidencialidad» y «no repudio». Justificación: nada en la definición de un MAC obliga a que la etiqueta oculte el mensaje, y como la clave es compartida, cualquiera de las dos partes pudo generar la etiqueta: un tercero no puede atribuírsela a una de ellas. El no repudio lo da la firma digital, porque la clave privada la tiene una sola entidad.

c) **Falso.** El uso de padding aleatorio en la implementación del algoritmo de clave pública de `RSA` es para que el algoritmo sea seguro a ataques de texto plano elegido (CPA). Cambio: «ataque de textos cifrados elegidos» por «ataques de texto plano elegido». Justificación: `RSA` sin padding es determinístico, y un cifrado determinístico no puede ser CPA-seguro porque el mismo mensaje da siempre el mismo criptograma; el padding aleatorio corrige eso. No alcanza la seguridad CCA: contra el padding de `PKCS#1 v1.5` existen ataques de texto cifrado elegido.

d) **Falso.** Un certificado digital emitido por una autoridad certificante contiene siempre la clave pública del titular, y va firmado con la clave privada de la CA. Cambio: «la clave pública de la CA» por «la clave pública del titular». Justificación: el certificado ata la identidad del titular a su clave pública; la CA aporta la firma, y su propia clave pública se obtiene de su propio certificado, adjunto en la cadena o preinstalado si es raíz.

### Tips

- La a) tiene dos errores y el segundo es el que se pierde: no alcanza con decir «es un hash»; hay que decir que los 128 bits son la salida, no una clave, y que el motivo para no usarlo son las colisiones.
- La b) se responde con una sola idea: clave compartida. De ahí salen la autenticación (solo entre las partes) y la ausencia de no repudio.
- La c) se corrige con una palabra, «cifrado» por «plano», pero conviene justificar con el determinismo de `RSA` sin padding.
- La d) vuelve, con otra formulación, en el 1C-2025 y en el 1C-2018: certificado igual a clave pública del titular más firma de la CA.

## 1C-2025 · Ej. 5 — Inyectividad, claves asimétricas, cuentas clásicas y certificados

### Enunciado

Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.

- a) Cualquier función de encripción simétrica tiene que ser inyectiva.
- b) Los sistemas de encripción basados en clave pública utilizan una de las claves para encriptar/desencriptar y la otra para firmar.
- c) Para sistemas de cifrado con un código binario de tres bits, el número de cifrados de transposición diferentes es mayor que el número de cifrados de sustitución.
- d) Un certificado público contiene la clave privada de la entidad certificante.

### Respuesta modelo

a) **Verdadero.** Para una clave fija $k$, $E_k$ tiene que ser inyectiva: si dos mensajes distintos $m \ne m'$ dieran el mismo criptograma, $E_k(m) = E_k(m')$, el descifrado no podría decidir cuál devolver y fallaría la condición de corrección $D_k(E_k(m)) = m$, que es lo que define a un criptosistema.

b) **Falso.** Los sistemas de encripción basados en clave pública utilizan la clave pública para encriptar y la clave privada para desencriptar; para firmar se usa la clave privada y para verificar la firma, la pública. Cambio: «una de las claves para encriptar/desencriptar y la otra para firmar» por «la pública para encriptar y la privada para desencriptar; la privada para firmar y la pública para verificar». Justificación: cada operación usa una clave distinta del par; ninguna clave cifra y descifra a la vez, y la firma se reparte igual, con los roles invertidos: la clave secreta genera y la pública verifica.

c) **Falso.** Para sistemas de cifrado con un código binario de tres bits, el número de cifrados de transposición diferentes es menor que el número de cifrados de sustitución. Cambio: «mayor» por «menor». Justificación: una transposición permuta las $3$ posiciones del bloque, así que hay $3! = 6$; una sustitución es una biyección sobre las $2^{3} = 8$ cadenas posibles, así que hay $8! = 40320$.

d) **Falso.** Un certificado público contiene la clave pública del titular, firmada con la clave privada de la entidad certificante. Cambios: «clave privada» por «clave pública», y «de la entidad certificante» por «del titular». Justificación: un certificado nunca contiene una clave privada, de nadie; la clave privada de la CA solo interviene para generar la firma del certificado, y esa firma se verifica con la clave pública de la CA.

### Tips

- La a) es la única sentencia verdadera de los cuatro parciales. Igual se justifica; una sola oración con la condición de corrección alcanza.
- La c) se gana con las dos cuentas escritas: $3!$ contra $8!$. El error típico es contar la sustitución sobre 3 símbolos ($3!$) en vez de sobre las $2^{3}$ cadenas.
- La d) tiene dos cambios; corregir solo «privada» por «pública» deja «la clave pública de la entidad certificante», que sigue siendo falsa: es la d) del 2C-2025.
- La b) es la trampa de las claves cruzadas: escribir las cuatro operaciones con su clave cierra la respuesta.

## 1C-2023 · Ej. 5 — Cifrado con MAC, resistencias del hash, Diffie-Hellman y reversibilidad

### Enunciado

Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.

- a) Para proveer privacidad e integridad, lo correcto es primero Cifrar $m$ con $k_1$ para obtener $c$ y al mismo tiempo obtener el MAC con la clave $k_2$ de $m$ para obtener $t$. Tanto $m$ como $t$ se deben transmitir en forma conjunta. Las claves $k_1$ y $k_2$ pueden ser iguales.
- b) La seguridad de las funciones de hash se establece como el nivel de resistencia a preimagenes donde dado un $y$ hallar $x/h(x) = y$.
- c) El algoritmo de Diffie-Hellman permite que Alice le envíe una clave de sesión a Bob por un canal inseguro.
- d) En los cifrados en bloque independientemente del modo de operación se requiere que BCE Block Cipher Encryption ó PRF Psuedo Random Function siempre sea reversible.

### Respuesta modelo

a) **Falso.** Para proveer privacidad e integridad, lo correcto es primero cifrar $m$ con $k_1$ para obtener $c$ y después obtener el MAC de $c$ con la clave $k_2$ para obtener $t$. Tanto $c$ como $t$ se deben transmitir en forma conjunta. Las claves $k_1$ y $k_2$ deben ser independientes. Cambios (tres): «al mismo tiempo obtener el MAC … de $m$» por «después obtener el MAC de $c$»; «tanto $m$ como $t$» por «tanto $c$ como $t$»; «pueden ser iguales» por «deben ser independientes». Justificación: calcular la etiqueta sobre $m$ y transmitirla junto al criptograma es cifrar-y-autenticar, que es inseguro porque nada impide que $t$ filtre información de $m$ —y transmitir $m$ en claro anula la privacidad directamente—. Con el MAC sobre el criptograma (cifrar y luego autenticar) hay una demostración general de seguridad para cualquier criptosistema y cualquier MAC, pero solo si las claves se generan de forma independiente: con la misma clave existen contraejemplos, con componentes seguros por separado, donde la etiqueta revela el mensaje entero.

b) **Falso.** La seguridad de las funciones de hash se establece con tres propiedades: resistencia a preimágenes (dado $y$, es computacionalmente imposible hallar $x$ tal que $h(x) = y$), resistencia a segundas preimágenes (dado $x$, hallar $x' \ne x$ tal que $h(x') = h(x)$) y resistencia a colisiones (hallar cualquier par $x \ne x'$ tal que $h(x) = h(x')$). Cambio: «como el nivel de resistencia a preimágenes» por «con tres propiedades: resistencia a preimágenes, a segundas preimágenes y a colisiones». Justificación: las tres se distinguen por cuánto elige el adversario, y la resistencia a colisiones —donde elige los dos mensajes— es la más fuerte y la que se formaliza en el juego `Hash-Coll`. Con el criterio de la sentencia, `MD5` y `SHA-1` serían seguras: resisten preimágenes y están rotas por colisiones.

c) **Falso.** El algoritmo de Diffie-Hellman permite que Alice y Bob establezcan una clave de sesión compartida a través de un canal inseguro. Cambio: «Alice le envíe una clave de sesión a Bob» por «Alice y Bob establezcan una clave de sesión compartida». Justificación: nadie envía la clave. Alice transmite $g^{x}$, Bob transmite $g^{y}$, y cada uno calcula $g^{xy}$ por su lado con su exponente secreto, que nunca viaja; es un acuerdo de claves, no un transporte. El protocolo es seguro frente a adversarios pasivos; contra uno activo el canal tiene que estar autenticado, o cae por man-in-the-middle.

d) **Falso.** En los cifrados en bloque, según el modo de operación, se requiere que la primitiva de cifrado (BCE) sea reversible cuando el modo la aplica directamente sobre el mensaje, como en `ECB` y `CBC`; en los modos que la usan como PRF para generar un keystream, como `CTR` y `OFB`, no necesita ser reversible. Cambio: «independientemente del modo de operación … siempre sea reversible» por «según el modo: reversible en `ECB` y `CBC`, no necesariamente en `CTR` y `OFB`». Justificación: en `CTR` y `OFB` el criptograma es $C_i = M_i \oplus O_i$, con $O_i$ producido por la primitiva en sentido directo; el descifrado vuelve a generar el mismo $O_i$ y aplica el mismo $\oplus$, así que la inversa nunca se invoca.

### Tips

- La a) es la sentencia con más cambios de los cuatro parciales: tres. Conviene enumerarlos con nombre —orden, qué se transmite, claves— para que el corrector vea que se encontraron todos.
- En la b), escribir las tres definiciones con su cuantificador (dado $y$; dado $x$; nada dado) es lo que vale puntos. El contraejemplo de `MD5` y `SHA-1` cierra la justificación.
- En la c), «canal inseguro» no es el error: Diffie-Hellman está pensado para un canal público. El error es el verbo. No conviene sobrecorregir a «canal autenticado»; sí conviene mencionarlo en la justificación.
- La d) engancha con el ejercicio de esquemas de bloque del mismo parcial: la pregunta de fondo es si el modo aplica la primitiva al mensaje o solo genera keystream.

## 1C-2023 · Múltiple choice — SSL, TLS y PKI

### Enunciado

3- Confidencialidad e integridad sobre un canal inseguro

- (a) SSL ofrece integridad y autenticación de los participantes mediante el uso de un KDC centralizado.
- (b) SSL ofrece confidencialidad, integridad y no repudio de los participantes mediante el uso de PKI de distribución de certificados.
- (c) TLS ofrece confidencialidad, integridad y autenticación de los participantes bajo un esquema PKI de distribución de certificados.

### Respuesta modelo

Opción **(c)**: `TLS` ofrece confidencialidad, integridad y autenticación de los participantes bajo un esquema `PKI` de distribución de certificados: el servidor —y opcionalmente el cliente— se autentica con un certificado `X.509` firmado por una autoridad certificante, y con la clave de sesión negociada se cifran los datos y se calcula un MAC sobre cada envío. Se descarta (a) porque `SSL` no usa un `KDC` centralizado: la distribución de claves es por certificados; el `KDC` es la arquitectura del mundo simétrico, la de Needham-Schroeder. Se descarta (b) porque `SSL` no ofrece no repudio: una vez establecida la clave de sesión el esquema es simétrico —cifrado y MAC con claves compartidas—, y con clave compartida cualquiera de las dos partes pudo generar la etiqueta.

### Tips

- La pregunta se repite idéntica en el 1C-2018, como 2.3 del Ej. 2. Las dos opciones incorrectas fallan cada una por una palabra: «KDC» y «no repudio».
- «No repudio» es la palabra que hunde opciones en todo el bloque: solo lo da la firma digital, y `TLS` protege los datos con MAC de clave compartida, no con firmas.

## 1C-2018 · Ej. 2 — Múltiple choice: certificados, cifrado homofónico y SSL/TLS

### Enunciado

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

### Respuesta modelo

1- Opción **(c)**: validar un certificado incluye verificar, con la clave pública de la Autoridad Certificante, que la firma digital incluida en el certificado sea válida, porque esa firma se generó con la clave privada que solo la CA tiene y es lo que garantiza la integridad del certificado y la asociación entre la identidad y la clave pública del titular. Se descarta (a) porque un certificado no contiene ninguna clave privada: contiene la clave pública del titular. Se descarta (b) porque la clave pública del certificado es la del titular y no «encripta» ninguna clave privada del emisor: la validación no consiste en cifrar nada, sino en verificar una firma.

2- Opción **(c)**: el índice de coincidencia no es tan útil en este caso, porque al repartir cada vocal entre varios símbolos elegidos al azar —más símbolos cuanto más frecuente es la vocal— el histograma del criptograma se aplana, y el índice de coincidencia mide justamente cuán disparejo es ese histograma. Se descarta (a) porque su justificación está invertida: que fuera imposible identificar la vocal sería un argumento a favor del secreto, no en contra, y el secreto perfecto de un esquema se analiza comparando $\Pr[M = m \mid C = c]$ con $\Pr[M = m]$, como en cualquier otro. Se descarta (b) porque no es un cifrado de Vigenère: no hay desplazamientos que cambien con la posición del símbolo, sino una sustitución con varios símbolos por letra, elegidos al azar.

3- Opción **(c)**: `TLS` ofrece confidencialidad, integridad y autenticación de los participantes bajo un esquema `PKI` de distribución de certificados. Se descarta (a) porque `SSL` distribuye claves con certificados, no con un `KDC` centralizado, que es la arquitectura simétrica de Needham-Schroeder. Se descarta (b) porque `SSL` no da no repudio: con la clave de sesión establecida, cifrado y MAC son simétricos y cualquiera de las dos partes pudo generar cada etiqueta.

### Tips

- En el 2.1, las opciones (a) y (b) meten una clave privada adentro del certificado o hacen que la clave pública «encripte» algo: cualquier opción así se descarta de entrada. Un certificado se valida verificando una firma, no cifrando.
- El 2.2 ataca el punto ciego del índice de coincidencia: mide cuán disparejo es el histograma, y el cifrado homofónico está diseñado para emparejarlo. El índice no es un detector universal de sustitución.
- Sobre el secreto perfecto del esquema del 2.2, si se pregunta: no lo tiene, porque la clave es fija para todo el mensaje y dos símbolos iguales en el criptograma delatan dos letras iguales del texto plano. Pero ese no es el argumento de (a), que está al revés.
- El 2.3 es el mismo múltiple choice del 1C-2023; la respuesta se lleva memorizada.

## Lo que se repite

- Los certificados aparecen en los cuatro parciales, siempre con la misma trampa: qué clave contiene (la pública del titular) y con cuál se firma (la privada de la CA). Cualquier «clave privada» adentro, o «clave pública de la CA» como contenido, es falso.
- El no repudio es la palabra que decide dos ejercicios: no lo da un MAC ni `SSL`/`TLS`, porque la clave es compartida; lo da la firma digital.
- Hash: no es cifrado, no tiene clave, su salida no es una clave, se descarta por colisiones, y su seguridad son tres resistencias, no una.
- Diffie-Hellman: se establece, no se envía.
- Cifrar primero, MAC sobre $c$, transmitir $c$ y $t$, claves independientes.
- Las cuentas de la Clase 1 se llevan hechas: transposición $n!$, sustitución $(2^{n})!$; con $n = 3$, $6$ contra $40320$.
- Los cuantificadores absolutos («siempre», «únicamente», «independientemente del modo») son casi siempre el cambio; la reversibilidad de la primitiva depende del modo.
- CPA y CCA: el padding aleatorio de `RSA` apunta a CPA.
- El múltiple choice sobre SSL, TLS y PKI se repite idéntico en dos parciales; las dos opciones malas fallan por «KDC» y «no repudio».
- El formato de respuesta es siempre el mismo: veredicto, sentencia reescrita completa, cambio nombrado, una oración de por qué.
