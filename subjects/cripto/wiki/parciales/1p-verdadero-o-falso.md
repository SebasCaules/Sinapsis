---
title: Verdadero o Falso, con corrección
resumen: 'Cómo se resuelve el ejercicio de Verdadero o Falso del primer parcial: un catálogo de sentencias verdaderas por tema para reconocer la versión falsa, el método de veredicto, reescritura y cambio identificado, y la variante de múltiple choice con justificación.'
fuentes: ["[[parciales-viejos]]", "[[certificados-digitales]]", "[[x509]]", "[[infraestructura-de-clave-publica]]", "[[cadenas-de-firmas-y-autoridades-raiz]]", "[[message-authentication-code]]", "[[privacidad-e-integridad]]", "[[resistencias-de-una-funcion-de-hash]]", "[[firma-digital]]", "[[diffie-hellman]]", "[[sesion-y-conexion-tls]]", "[[cifrado-por-transposicion]]", "[[cifrado-de-sustitucion-monoalfabetica]]"]
aliases: [Verdadero o Falso del parcial, VoF con corrección, Múltiple choice del parcial, Sentencias del primer parcial]
type: parcial
clase: 1p
orden: 14
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, verdadero-o-falso, multiple-choice, certificados, mac, hash, diffie-hellman]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Verdadero o Falso, con corrección

Es el ejercicio que cierra el parcial: Ej. 5 en [[parciales-viejos#2C-2025|2C-2025]], [[parciales-viejos#1C-2025|1C-2025]] y [[parciales-viejos#1C-2023|1C-2023]], y Ej. 2 en [[parciales-viejos#1C-2018|1C-2018]], donde toma la forma de múltiple choice; el 1C-2023 trae además un múltiple choice suelto sobre SSL, TLS y PKI. La consigna se repite textual: «Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado». Son cuatro sentencias que mezclan temas de las Clases 1 a 5, y marcar «Falso» sin reescribir no vale puntos. En la variante de múltiple choice la consigna es «Elegir la opción correcta y justificar en una oración».

## Lo mínimo que hay que saber

Cada línea es una sentencia verdadera. El parcial arma la falsa cambiando una palabra: un sujeto, una clave, un servicio, una dirección o un cuantificador. Conviene leer cada una preguntándose qué palabra cambiaría el examen.

### Criptografía clásica

- La **sustitución** cambia los símbolos y conserva las posiciones; la **transposición** cambia las posiciones y conserva los símbolos, y por eso conserva el histograma exacto del idioma.
- Sobre bloques de $n$ bits hay $n!$ transposiciones (permutaciones de las $n$ posiciones) y $(2^{n})!$ sustituciones (biyecciones sobre las $2^{n}$ cadenas): con $n = 3$, $3! = 6$ contra $8! = 40320$. Hay **menos** transposiciones que sustituciones.
- El espacio de claves de la sustitución monoalfabética es $26! \approx 4 \times 10^{26}$: la fuerza bruta es inviable y aun así el esquema cae por análisis de frecuencias. Un espacio de claves grande es necesario, no suficiente.
- Componer dos sustituciones simples da otra sustitución simple, porque $S_n$ es un grupo: no agrega seguridad.
- Bajo texto plano elegido la sustitución monoalfabética cae en una consulta: el cifrado del alfabeto completo revela la permutación $\pi$ entera.
- Un cifrado **homofónico** reparte cada letra en varios símbolos elegidos al azar, tantos como su frecuencia: aplana el histograma y el índice de coincidencia deja de distinguir. No es Vigenère, porque no hay desplazamientos que dependan de la posición.

### Secreto perfecto

- Secreto perfecto: el criptograma no altera la probabilidad de ningún mensaje, $\Pr[M = m \mid C = c] = \Pr[M = m]$. Es confidencialidad incondicional: vale contra un adversario sin límite de cómputo.
- El One Time Pad lo tiene, y aun así cae ante un adversario que **modifica** el criptograma: el secreto perfecto habla de confidencialidad y no dice nada sobre integridad.
- Exige tantas claves como mensajes, $\lvert \mathcal{K} \rvert \ge \lvert \mathcal{M} \rvert$, y una clave nueva por mensaje: reusar la clave del One Time Pad entrega $c_1 \oplus c_2 = m_1 \oplus m_2$.
- La seguridad computacional relaja la exigencia: en lugar de «el adversario no puede», «ningún adversario de tiempo polinómico lo logra, salvo con probabilidad despreciable».

### Modos y primitivas

- Toda función de cifrado simétrico tiene que ser **inyectiva** para cada clave: si $E_k(m) = E_k(m')$ con $m \ne m'$, $D_k$ no puede decidir. Es la condición de corrección $D_k(E_k(m)) = m$.
- La primitiva de cifrado en bloque tiene que ser reversible solo cuando el modo la aplica directamente sobre el mensaje (`ECB`, `CBC`). En `CTR` y `OFB` se usa como PRF para generar un keystream que se aplica con $\oplus$: **no necesita inversa**, y se descifra con la misma operación.
- `CBC` propaga un error de transmisión al bloque afectado y al siguiente; `OFB` y `CTR` no lo propagan: el keystream no depende del criptograma, y un bit corrompido de $C_i$ corrompe exactamente ese bit de $M_i$.
- Un criptosistema **determinístico** no puede ser CPA-seguro: cifrar dos veces el mismo mensaje da el mismo criptograma y el adversario distingue. Un MAC determinístico, en cambio, puede ser seguro: `CBC-MAC` y `HMAC` lo son.

### MAC y hash

- Un MAC es la terna $(\mathsf{Gen}, \mathsf{Mac}, \mathsf{Vrfy})$ con una clave **compartida**; $\mathsf{Vrfy}_k(m, t)$ devuelve un bit y no recupera nada: la etiqueta no es el mensaje cifrado.
- Un MAC da **integridad y autenticación de origen** entre las partes que comparten la clave. **No** da confidencialidad, porque nada obliga a que $t$ oculte $m$, ni no repudio.
- No hay no repudio con un MAC porque quien verifica también puede generar: ambas partes conocen $k$, y un tercero no puede decidir cuál de las dos etiquetó.
- La etiqueta puede ser pública; lo secreto es la clave.
- Para privacidad e integridad: primero cifrar, $c = E_{k_1}(m)$; después el MAC **sobre el criptograma**, $t = \mathrm{MAC}_{k_2}(c)$; se transmite $\langle c, t \rangle$; y $k_1$, $k_2$ son **independientes**. Calcular el MAC sobre $m$ y enviarlo al lado de $c$ es inseguro: $t$ puede filtrar información de $m$.
- Una función de hash no tiene clave y no es un cifrado: no se descifra, y su salida es un digest de longitud fija (128 bits en `MD5`), no una clave.
- `MD5` no debe usarse porque está **quebrada**: se conocen colisiones. La longitud de su salida no es el motivo.
- Tres resistencias: **preimagen** (dado $y$, hallar $x$ con $H(x) = y$), **segunda preimagen** (dado $x$, hallar $x' \ne x$ con $H(x') = H(x)$) y **colisión** (hallar cualquier par $x \ne x'$ con $H(x) = H(x')$). La seguridad de un hash se establece con las tres, no solo con la primera.
- Las colisiones **existen siempre**, por el principio del palomar: entradas de longitud arbitraria, salidas de $L$ bits. Lo que se pide es que sean computacionalmente inhallables.
- La resistencia a colisiones es la más fuerte —asintóticamente implica las otras dos— y la más barata de atacar en genérico: $2^{L/2}$ por la paradoja del cumpleaños, contra $2^{L}$ para preimágenes. `MD5` y `SHA-1` están rotas para colisiones y no para preimágenes: la implicación no se invierte.

### Asimétrica y firma

- En un criptosistema de clave pública se **cifra con la pública** y se **descifra con la privada**; en una firma se **firma con la privada** y se **verifica con la pública**. Cada operación usa una clave distinta del par: ninguna clave cifra y descifra.
- Una firma digital es la versión asimétrica de un MAC, $(\mathsf{Gen}, \mathsf{Sign}, \mathsf{Vrfy})$, y por la asimetría da lo que el MAC no puede: verificación pública, transferibilidad y **no repudio**, porque solo el dueño de $sk$ pudo generarla.
- `RSA` sin padding es determinístico. El padding aleatorio (`PKCS#1 v1.5`) busca que sea **CPA-seguro**; no lo vuelve CCA-seguro, y de hecho hay ataques de texto cifrado elegido contra él.
- `MD5` no es un criptosistema, ni simétrico ni asimétrico: es una función de hash.
- Diffie-Hellman **establece** una clave compartida: $A$ envía $g^{x}$, $B$ envía $g^{y}$, y cada uno calcula $g^{xy}$ por su lado con su exponente secreto. Ni $x$, ni $y$, ni $g^{xy}$ viajan nunca: es un acuerdo de claves, no un envío ni un transporte.
- Diffie-Hellman resiste solo adversarios **pasivos**: sin canal autenticado cae por man-in-the-middle, y se lo autentica con firmas digitales o con MAC.
- Su seguridad descansa en la dureza del logaritmo discreto (condición necesaria, no suficiente) y en la conjetura `DDH`: dados $g$, $g^{x}$ y $g^{y}$, no se distingue $g^{xy}$ de un elemento aleatorio del grupo.

### Certificados y PKI

- Un certificado es un **mensaje firmado por una autoridad certificante** que ata una identidad (`CN`) a la **clave pública del titular**, con fecha de emisión, intervalo de validez y tipo de uso.
- Un certificado **nunca contiene una clave privada**, ni la del titular ni la de la CA; y la clave pública que lleva es la del **titular**, no la de la CA. La clave pública de la CA está en el certificado de la CA.
- La firma del certificado se genera con la clave **privada** de la CA y se verifica con la clave **pública** de la CA, que se obtiene de la cadena adjunta o del sistema, si la CA es raíz.
- Validar un certificado `X.509`: obtener la clave pública del emisor, verificar la firma (integridad), verificar la vigencia —del certificado hoy, y de la CA al inicio del período—, verificar la identidad (`CN`) y verificar el uso autorizado.
- Las CA raíz están **autofirmadas** —emisor igual a sujeto, `CA:TRUE`— y son el punto de confianza: vienen preinstaladas en el sistema operativo, los navegadores y los runtimes. Un certificado viaja con su cadena hasta la raíz.
- `PKI` es el conjunto de mecanismos que asocia una identidad a una clave pública para evitar la suplantación. **No aplica a criptosistemas simétricos**, cuyo análogo es un `KDC`.

### Protocolos y TLS

- `TLS` ofrece **confidencialidad, integridad y autenticación de los participantes** bajo un esquema `PKI` de distribución de certificados. No usa un `KDC`: eso es Needham-Schroeder, del mundo simétrico.
- `TLS` **no da no repudio**: una vez establecida la clave de sesión el esquema es simétrico —cifrado y MAC con claves compartidas—, y ninguna de las partes puede probarle nada a un tercero.
- Una **sesión** `TLS` es lo negociado una vez y reutilizable por varias conexiones: identificador, certificado, suite y Master Secret de 48 bytes. Una **conexión** lleva material fresco: nonces, claves de escritura y de MAC **distintas por dirección**, IVs y números de secuencia.
- Reusar la sesión `TLS` es una optimización que evita repetir el handshake completo; **no es un protocolo de sesión** de aplicación.

## Receta

1. Lea la sentencia entera y marque cada afirmación que contiene. Una sentencia puede traer dos o tres errores —la a) del 1C-2023 trae tres— y hay que encontrarlos todos.
2. Ubique el tema en el catálogo y compare palabra por palabra con la sentencia verdadera. El examen cambia un sujeto («criptosistema» por «función de hash»), una clave («pública» por «privada», «de la CA» por «del titular»), un servicio («integridad» por «no repudio»), una dirección («establecer» por «enviar») o un cuantificador («siempre», «únicamente», «independientemente del modo»).
3. Escriba el veredicto al principio, en negrita: **Verdadero** o **Falso**.
4. Si es Falso, **reescriba la sentencia completa** ya corregida, no solo el fragmento cambiado. Conserve la estructura y las palabras del original y cambie lo mínimo que la vuelve verdadera.
5. Nombre el cambio de forma explícita: «Cambio: X por Y». Si hubo varios, enumérelos todos.
6. Agregue una oración de justificación: por qué la versión corregida es la verdadera. Vale también cuando el veredicto es Verdadero: la a) del 1C-2025 pide explicar por qué la inyectividad es obligatoria.
7. En el múltiple choice: elija la opción, justifíquela en una oración y **descarte cada una de las otras** diciendo cuál es su error.
8. Relea la sentencia corregida como si fuera nueva: tiene que ser verdadera por sí sola, sin depender de la explicación.

## Plantilla de respuesta

Para cada sentencia:

```
<letra>) **Falso.** <Sentencia completa reescrita, correcta, con la misma estructura que la original.>
Cambio: <«X» por «Y»>; <segundo cambio, si lo hay>. Justificación: <una oración con la razón>.

<letra>) **Verdadero.** <Una oración de justificación.>
```

Para el múltiple choice:

```
<n>- Opción <x>: <justificación en una oración>. Se descarta <y> porque <su error>; se descarta <z> porque <su error>.
```

Ejemplo mínimo, con la d) del 2C-2025:

> d) **Falso.** Un certificado digital emitido por una autoridad certificante contiene siempre la clave pública del titular, y va firmado con la clave privada de la CA.
> Cambio: «la clave pública de la CA» por «la clave pública del titular». Justificación: el certificado ata la identidad del titular a su clave pública; la CA aporta la firma, y su propia clave pública está en su propio certificado.

## Trampas

- **Marcar Falso y no reescribir.** La consigna exige la sentencia corregida y el cambio identificado; el veredicto solo no vale.
- **Corregir de más.** Cambie lo mínimo. Si el error es que los 128 bits de `MD5` son la salida y no una clave, no hay que reescribir el tema de hash entero.
- **Una sentencia, varios errores.** La a) del 1C-2023 trae tres (el orden, qué se transmite y las claves iguales); corregir uno solo deja la sentencia falsa.
- **Verdadero también se justifica.** «Cualquier función de encripción simétrica tiene que ser inyectiva» es verdadera, y hay que decir por qué: sin inyectividad el descifrado no puede decidir.
- **Hash no es cifrado ni clave.** `MD5` es una función de hash, no un criptosistema; sus 128 bits son la salida, y se descarta por colisiones, no por longitud.
- **MAC no es no repudio.** Clave compartida: integridad y autenticación entre las partes, nada más. El no repudio es de la firma digital.
- **Certificado: pública del titular, firmada con la privada de la CA.** Toda variante que ponga una clave privada adentro del certificado, o la clave pública «de la CA» como contenido, es falsa.
- **Diffie-Hellman no envía la clave.** La establece entre las dos partes; «envía» o «transporta» es siempre el cambio. Y es seguro solo contra adversarios pasivos.
- **Cifrar primero, MAC sobre $c$, claves independientes, transmitir $c$ y $t$.** Toda sentencia con «al mismo tiempo», «MAC de $m$», «transmitir $m$» o «las claves pueden ser iguales» es falsa.
- **Contar transposiciones con el número equivocado.** Sobre $n$ bits, transposición $n!$ y sustitución $(2^{n})!$: con $n = 3$, $6$ contra $40320$.
- **CPA y CCA no son intercambiables.** El padding aleatorio de `RSA` apunta a CPA; decir CCA es exactamente lo que se corrige.
- **Cuantificadores absolutos.** «Independientemente del modo», «siempre», «únicamente»: suelen ser el cambio. La reversibilidad de la primitiva depende del modo.
- **KDC contra PKI.** `TLS` y `SSL` usan certificados; el `KDC` es de Needham-Schroeder, del mundo simétrico. Y ninguno de los dos da no repudio.

## Para profundizar

- [[1p-verdadero-o-falso-en-parciales-viejos|Verdadero o Falso en los parciales viejos]] — los ejercicios de este tipo que ya se tomaron, con enunciado completo, respuesta modelo y tips.
- [[primer-parcial|Primer parcial]] — el hub de la sección, con la tabla de los siete tipos y el orden sugerido.
- [[parciales-viejos|Parciales viejos]] — los cuatro exámenes completos, la tabla de temas y las discrepancias con el apunte.
- [[certificados-digitales|Certificados digitales]] — qué contiene un certificado y las cuatro verificaciones que permite.
- [[x509|X.509]] — los campos del estándar y la verificación en cinco pasos.
- [[infraestructura-de-clave-publica|Infraestructura de clave pública]] — PKI contra KDC, y por qué la PKI no aplica a lo simétrico.
- [[cadenas-de-firmas-y-autoridades-raiz|Cadenas de firmas y autoridades raíz]] — dónde termina la recursión de quién firma al que firma.
- [[message-authentication-code|Message Authentication Code]] — la terna, qué da y qué no da un MAC, y el argumento del no repudio.
- [[privacidad-e-integridad|Privacidad e integridad]] — las tres combinaciones de cifrado y MAC, y por qué solo una es siempre segura.
- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] — las tres propiedades, la jerarquía y el costo de cada ataque.
- [[firma-digital|Firma digital]] — la versión asimétrica del MAC y de dónde sale el no repudio.
- [[diffie-hellman|Diffie-Hellman]] — el protocolo paso a paso, qué viaja y qué no, y el man-in-the-middle.
- [[sesion-y-conexion-tls|Sesión y conexión TLS]] — qué se negocia una vez y qué es fresco por conexión.
- [[cifrado-por-transposicion|Cifrado por transposición]] — la familia que conserva el histograma, y la cuenta de $n!$.
- [[cifrado-de-sustitucion-monoalfabetica|Cifrado de sustitución monoalfabética]] — el espacio de claves de $n!$ y por qué no alcanza.
- [[secreto-perfecto|Secreto perfecto]] — la definición y lo que exige.
- [[one-time-pad|One Time Pad]] — el esquema que la cumple, con clave nueva por mensaje.
- [[modos-de-encadenamiento|Modos de encadenamiento]] — qué modo necesita la inversa de la primitiva y cómo propaga errores cada uno.
- [[cbc-mac|CBC-MAC]] — un MAC determinístico que se usa de verdad.
- [[hmac|HMAC]] — el otro MAC determinístico de uso real, construido sobre un hash.
- [[rsa|RSA]] — el esquema cuyo padding aleatorio apunta a CPA.
- [[tls-handshake|TLS handshake]] — el intercambio de certificados y la derivación del Master Secret.
- [[suites-criptograficas-de-tls|Suites criptográficas de TLS]] — qué algoritmos de cifrado y MAC se negocian.
