---
title: MAC, hash e integridad
resumen: 'Cómo se resuelve el ejercicio de integridad del primer parcial: qué es un MAC, qué es un hash y sus tres resistencias, las tres formas de combinar cifrado y autenticación, y la receta para decidir si un esquema da integridad, autenticación y no repudio.'
fuentes: ["[[parciales-viejos]]", "[[privacidad-e-integridad]]", "[[message-authentication-code]]", "[[resistencias-de-una-funcion-de-hash]]", "[[hmac]]", "[[cbc-mac]]", "[[cifrado-autenticado]]"]
aliases: [MAC hash e integridad en el parcial, Integridad en el primer parcial, Ejercicio de integridad del parcial, Esquema da integridad en el parcial]
type: parcial
clase: 1p
orden: 20
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, mac-hash-integridad, mac, hash, integridad, cifrado-autenticado]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# MAC, hash e integridad

Aparece de dos formas. Como **ejercicio completo** salió una vez en cuatro parciales: el Ej. 3 del [[parciales-viejos#1C-2025|1C-2025]] da un criptosistema inventado, $c = E_{k_1}(m \Vert H(k_2 \Vert m))$, y pregunta *a)* qué hace el receptor paso a paso, *b)* si un atacante puede modificar el mensaje, *c)* si provee autenticación y *d)* si provee no repudio. Como **sentencias de Verdadero o Falso** —siempre con la consigna *"si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado"*— salió en el [[parciales-viejos#2C-2025|2C-2025]] (Ej. 5b) y en el [[parciales-viejos#1C-2023|1C-2023]] (Ej. 5a y 5b); en el [[parciales-viejos#1C-2018|1C-2018]] no apareció, y el Ej. 1 del 2C-2025 lo roza, pero es un protocolo y se analiza con los protocolos.

Ninguno de los cuatro tomó `CBC-MAC`, `HMAC`, Merkle-Damgård, la paradoja del cumpleaños ni `CCM`/`GCM` como ejercicio propio: la Clase 3 entra como *"¿este esquema da integridad?"* y como Verdadero o Falso. Eso ordena el estudio: el argumento de integridad, autenticación y no repudio hay que saberlo escribir; las construcciones con nombre hay que saberlas reconocer y corregir.

## Lo mínimo que hay que saber

### Integridad: detectar, no impedir

**Integridad** es garantizar que ninguna modificación no autorizada pase inadvertida: no se impide el cambio, se lo detecta. Es un servicio distinto de la **confidencialidad** (que nadie pueda leer). El cifrado solo no la da: un criptosistema `CPA-Secure` garantiza que $c$ no filtra $m$, pero nada impide alterar $c$ para producir un cambio controlado en $m$ (maleabilidad). Hace falta otra primitiva: el MAC.

### MAC: etiquetar y verificar con una clave compartida

Un **Message Authentication Code** es una terna $(\mathsf{Gen}, \mathrm{MAC}, \mathrm{Vrfy})$ con una clave $k$ **compartida** entre emisor y receptor. El emisor calcula la etiqueta $t = \mathrm{MAC}_k(m)$ y envía $\langle m, t\rangle$; el receptor calcula $\mathrm{Vrfy}_k(m, t) \in \{0, 1\}$, que en los MAC usados de verdad es **recomputar la etiqueta y comparar** (verificación canónica). Propiedad básica: $\mathrm{Vrfy}_k(m, \mathrm{MAC}_k(m)) = 1$. La etiqueta es pública; lo único secreto es $k$, y por eso sirve contra un adversario y no solo contra el ruido: un checksum lo recalcula cualquiera, una etiqueta no.

**Seguridad** (experimento `Mac-Forge`): aunque el adversario obtenga etiquetas de todos los mensajes que quiera, no puede producir un par $(m', t')$ válido con $m'$ nuevo salvo con probabilidad despreciable. En una frase: **sin la clave no se forja**. Dos consecuencias: un MAC determinístico es perfectamente válido (la regla "determinístico implica inseguro" es de los criptosistemas, no de los MAC), y **un MAC no da confidencialidad**: nada en su definición pide que $t$ oculte $m$.

### Función de hash y sus tres resistencias

Una **función de hash criptográfica** $H : \{0,1\}^{*} \to \{0,1\}^{L}$ comprime mensajes de cualquier largo a $L$ bits; es pública, determinística y **sin clave**. Las colisiones existen siempre (principio del palomar: hay más mensajes que digests); lo que se exige es que sean **computacionalmente inhallables**, es decir, que ningún algoritmo de tiempo polinómico las encuentre salvo con probabilidad despreciable. Se le piden tres propiedades, que difieren solo en quién elige qué:

| Resistencia | Le dan | Debe producir | Costo genérico |
|---|---|---|---|
| **Preimagen** | un digest $y$ | un $x$ con $H(x) = y$ | $2^{L}$ |
| **Segunda preimagen** | un mensaje $x$ | un $x' \ne x$ con $H(x') = H(x)$ | $2^{L}$ |
| **Colisión** | nada | cualquier par $x \ne x'$ con $H(x) = H(x')$ | $2^{L/2}$, por el ataque del cumpleaños |

Jerarquía, válida asintóticamente: resistente a colisiones $\Rightarrow$ resistente a segundas preimágenes $\Rightarrow$ resistente a preimágenes. La más fuerte es la de colisiones (el adversario más libre) y es la única que la cátedra formaliza (`Hash-Coll`); por eso **la seguridad de un hash no se establece solo con preimágenes**. `MD5` y `SHA-1` están **quebradas para colisiones** y siguen sin ataque práctico de preimágenes: son funciones de hash, no criptosistemas, y sus 128 y 160 bits son el tamaño de la **salida**, no de una clave.

### Un hash sin clave no da integridad frente a un atacante activo

Publicar $H(m)$ junto a $m$ detecta errores accidentales, pero no adversarios: quien cambia $m$ por $m'$ **recalcula $H(m')$**, porque $H$ es pública y no tiene clave. Para integridad hace falta un secreto que el atacante no pueda usar: un MAC, o un hash **con clave** como el $H(k_2 \Vert m)$ del 1C-2025, que sin $k_2$ no se puede recomputar. Salvedad: $H(k \Vert m)$ con un hash iterativo (`MD5`, `SHA-1`, `SHA-2`) sufre **extensión de longitud** si admite mensajes de longitud variable —el digest es el estado interno, y desde él se sigue hasheando sin conocer $k$—; con mensajes de **tamaño fijo**, como pide el 1C-2025, el ataque no aplica. La construcción general y segura es `HMAC`.

### Las tres formas de combinar cifrado y autenticación

Con un criptosistema `CPA-Secure` (clave $k_1$) y un MAC infalsificable (clave $k_2$) hay tres órdenes posibles, y solo uno es seguro en general:

| Nombre | Qué se calcula | Se transmite | Veredicto |
|---|---|---|---|
| Cifrar y autenticar (`Encrypt-and-MAC`) | $c = E_{k_1}(m)$, $t = \mathrm{MAC}_{k_2}(m)$ | $\langle c, t\rangle$ | **Inseguro**: $t$ se calcula sobre $m$ y viaja en claro; nada impide que filtre información de $m$ (un MAC determinístico delata mensajes repetidos) |
| Autenticar y luego cifrar (`MAC-then-Encrypt`) | $c = E_{k_1}(m \Vert \mathrm{MAC}_{k_2}(m))$ | $c$ | **Puede ser seguro, requiere prueba** para cada combinación concreta: obliga a descifrar antes de verificar |
| Cifrar y luego autenticar (`Encrypt-then-MAC`) | $c = E_{k_1}(m)$, $t = \mathrm{MAC}_{k_2}(c)$ | $\langle c, t\rangle$ | **Siempre seguro**, si los componentes lo son y las claves son independientes |

Por qué gana la tercera: $t$ se calcula sobre $c$, que ya es público, así que no filtra nada; y cualquier $c'$ modificado necesita un $t'$ válido, o sea una falsificación. El receptor **verifica antes de descifrar** y rechaza con $\perp$ sin correr $D_{k_1}$ sobre datos elegidos por el atacante. El resultado es `CCA-Secure` e infalsificable: eso es **cifrado autenticado**.

En `MAC-then-Encrypt`, en cambio, la etiqueta está adentro de $c$: hay que descifrar (y quitar el padding) para encontrarla, y si el receptor distingue "padding inválido" de "etiqueta inválida" —por el mensaje de error o por el tiempo de respuesta— entrega un bit por consulta: es el **oráculo de padding**, un ataque de texto cifrado escogido que recupera el texto plano sin la clave. Lo que ese orden arriesga es la **confidencialidad frente a un adversario activo**, no la integridad: la combinación sigue siendo infalsificable.

### Claves independientes

$k_1$ y $k_2$ se generan por separado, **siempre**. Con la misma clave, dos componentes seguros pueden dar un esquema roto aunque el orden sea el correcto: con $E_k(m) = F_k(m \Vert r)$ y $\mathrm{MAC}_k(c) = F_k^{-1}(c)$, la etiqueta de `Encrypt-then-MAC` es $F_k^{-1}(F_k(m \Vert r)) = m \Vert r$, el mensaje en claro. La única excepción admitida es un modo con demostración propia, como `CCM`.

### Integridad, autenticación y no repudio son tres servicios distintos

| Servicio | Qué afirma | ¿Lo da un MAC, o un hash con clave compartida? |
|---|---|---|
| **Integridad** | el mensaje no fue modificado | Sí |
| **Autenticación de origen** | lo emitió alguien que conoce la clave | Sí, pero solo **entre las partes que comparten la clave** |
| **No repudio** | el emisor no puede negar ante un tercero que lo emitió | **No**: la clave es compartida, el receptor pudo fabricar la etiqueta él mismo y un tercero no distingue quién fue |
| **Confidencialidad** | nadie más lee el mensaje | **No**: hay que agregar cifrado |

El no repudio lo da la **firma digital**: se firma con una clave privada que solo tiene el firmante y se verifica con la pública, así que la prueba solo pudo producirla él.

### Las construcciones con nombre

- **`HMAC`**: $t = H\bigl((k \oplus \mathsf{opad}) \Vert H((k \oplus \mathsf{ipad}) \Vert m)\bigr)$. Dos pasadas de hash con la misma clave enmascarada por dos constantes distintas —`ipad` adentro, `opad` afuera; la prueba solo pide que sean distintas—; la pasada externa sella la interna y elimina la extensión de longitud. Es infalsificable si $H$ es resistente a colisiones. El mensaje se procesa **una sola vez**: la pasada externa ve dos bloques sin importar el tamaño de $m$. **No es más seguro que `CBC-MAC`**; se usa más porque hashear es de uno a tres órdenes de magnitud más barato que cifrar.
- **`CBC-MAC`**: $t_0 = 0^{n}$, $t_i = F_k(t_{i-1} \oplus m_i)$, $t = t_j$. Misma recurrencia que el modo `CBC`, pero con estado inicial **fijo en cero** (un IV aleatorio lo rompe) y emitiendo **solo el último bloque**. Es infalsificable **solo para mensajes de longitud fija**: con longitud variable, el adversario consulta $t_1 = \mathrm{MAC}_k(A \Vert B)$ y $t_2 = \mathrm{MAC}_k(A)$ y emite $A \Vert B \Vert (A \oplus t_1)$ con etiqueta $t_2$, válida con probabilidad 1, porque $t_2$ es el estado intermedio que la cadena larga descarta. Arreglos: derivar la clave de la longitud, poner la longitud como **prefijo** (como sufijo no sirve), o cifrar la etiqueta final con una segunda clave.
- **Cifrado autenticado** $=$ `CCA-Secure` $+$ `Mac-Forge-Secure`. La construcción genérica es `Encrypt-then-MAC` con dos claves independientes; su descifrado **puede fallar** y devuelve $\perp$. Los modos reales: `CCM` (`CBC-MAC` más `CTR`, una sola clave con prueba propia, dos pasadas) y `GCM` (`CTR` con la etiqueta calculada por otra primitiva, una sola pasada). En sistemas reales se usa solo cifrado autenticado.

## Receta

Para el ejercicio completo, en el orden de las cuatro preguntas del 1C-2025:

1. **Clasifica el esquema antes de contestar.** Escribe qué se cifra, qué se autentica y sobre qué (sobre $m$ o sobre $c$), con qué clave cada cosa, y qué viaja: $\langle c, t\rangle$ o solo $c$. Nómbralo con una de las tres combinaciones. Si la etiqueta es $H(k \Vert m)$, di que es un hash con clave que cumple el papel de MAC.
2. **Receptor paso a paso, itemizado y en orden.** Para autenticar y luego cifrar: (1) descifrar $c$ con $k_1$; (2) separar $m$ y $t$ —el tamaño fijo de $m$ y de la salida de $H$ dice dónde cortar—; (3) recomputar $t^{*} = H(k_2 \Vert m)$; (4) comparar $t^{*}$ con $t$ en tiempo constante; (5) aceptar $m$ si coinciden, rechazar con $\perp$ si no, sin revelar qué falló. Para cifrar y luego autenticar el orden se invierte: verificar la etiqueta sobre $c$ primero, descifrar después.
3. **Integridad: primero si puede forjar, después el orden.** Para que el receptor acepte $m' \ne m$ hace falta $H(k_2 \Vert m')$, que sin $k_2$ no se computa; modificar $c$ a ciegas altera $m$, $t$ o ambos y la verificación lo detecta. Conclusión: no puede modificar sin ser detectado, el esquema provee integridad. Recién entonces: el orden obliga a descifrar antes de verificar, no tiene prueba general y abre el oráculo de padding; lo recomendado es `Encrypt-then-MAC` con claves independientes.
4. **Autenticación: sí, simétrica y solo entre quienes comparten la clave.** Verificar prueba que la etiqueta la generó alguien con $k_2$; para el receptor, ese alguien es el otro extremo. Agrega lo que no da: identidad frente a terceros ni protección contra el reenvío de un $c$ válido.
5. **No repudio: no, y la razón es la clave compartida.** Las dos partes pueden generar la misma etiqueta, el receptor pudo fabricar el mensaje y un tercero no distingue. Cierra con lo que sí lo da: la firma digital.

Para una sentencia de Verdadero o Falso: escribe el veredicto, la sentencia reescrita completa y verdadera, y el cambio identificado con nombre (qué palabra o condición se cambió y por qué). Marcar "Falso" a secas no suma.

> [!tip] La respuesta que vale en (b)
> "No puede falsificar, pero el orden es igualmente malo, y esta es la razón." Las dos mitades suman: la primera muestra que se entiende qué protege la clave; la segunda, que se conoce el veredicto de las tres combinaciones.

## Plantilla de respuesta

**Esquema.** Es <nombre de la combinación>: se <cifra / autentica> <qué> con <clave>, y la etiqueta <viaja adentro de $c$ / viaja al lado, como $\langle c, t\rangle$>. La etiqueta <$H(k_2 \Vert m)$ o $\mathrm{MAC}_{k_2}(\cdot)$> requiere <clave> para calcularse: cumple el papel de MAC.

**a) Receptor.**
1. Descifra: $D_{k_1}(c) = m \Vert t$.
2. Separa $m$ (los primeros <tamaño de $m$> bits) y $t$ (los <tamaño de la salida de $H$> restantes).
3. Recomputa $t^{*} = H(k_2 \Vert m)$.
4. Compara $t^{*}$ con $t$, en tiempo constante.
5. Si coinciden, acepta $m$; si no, rechaza ($\perp$) y no usa $m$.

**b) Integridad.** Un atacante sin $k_1$ ni $k_2$ no puede producir un $c'$ que descifre a $m' \Vert H(k_2 \Vert m')$ con $m' \ne m$, porque la etiqueta no se computa sin $k_2$; cualquier alteración de $c$ se detecta en el paso 4. El esquema provee integridad. Sin embargo es <autenticar y luego cifrar>: obliga a descifrar antes de verificar, no tiene prueba general y, si el receptor distingue los errores, expone un oráculo de padding. Lo correcto en general es $c = E_{k_1}(m)$, $t = \mathrm{MAC}_{k_2}(c)$, enviar $\langle c, t\rangle$ y verificar antes de descifrar, con $k_1$ y $k_2$ independientes.

**c) Autenticación.** Sí: si la verificación pasa, la etiqueta la generó alguien que conoce $k_2$, que solo comparten <Alice y Bob>. Es autenticación de origen simétrica: vale entre ellos dos y no ante terceros, y no impide reenviar un $c$ válido.

**d) No repudio.** No: $k_2$ es compartida, así que <Bob> pudo fabricar el mismo $c$, y un tercero no puede distinguir quién lo generó. El no repudio requiere firma digital, con una clave privada que solo tiene el firmante.

**Sentencia de Verdadero o Falso.** <Verdadero / Falso>. Corregida: *"<sentencia reescrita, completa>"*. Cambio: <qué se reemplazó y por qué>.

## Trampas

- **"El atacante puede modificar porque primero se hashea y después se cifra."** Incompleto y, como está, incorrecto: para que el receptor acepte $m'$ hace falta $H(k_2 \Vert m')$, y sin $k_2$ no se produce. Lo malo del orden es que obliga a descifrar antes de verificar, y lo que arriesga es la confidencialidad (`CCA`), no la integridad.
- **Confundir autenticación con no repudio.** La clave compartida da la primera y quita la segunda: el receptor también puede generar la etiqueta. El no repudio es solo con firma digital.
- **Atribuir confidencialidad a un MAC.** Nada en la definición pide que $t$ oculte $m$; un MAC puede publicar el mensaje entero dentro de la etiqueta y seguir siendo infalsificable.
- **"Las claves $k_1$ y $k_2$ pueden ser iguales."** Falso: deben generarse de forma independiente; con la misma clave hay contraejemplos con componentes seguros y orden correcto.
- **MAC sobre $m$ transmitido al lado de $c$** (`Encrypt-and-MAC`) es la combinación insegura. El MAC va **sobre $c$**, después de cifrar.
- **Reducir la seguridad de un hash a las preimágenes.** Son tres resistencias, y la que define la seguridad es la de colisiones, que implica las otras dos.
- **`MD5` como "criptosistema asimétrico de clave de 128 bits".** Es una función de hash; 128 bits es la salida; no se usa porque está quebrada para colisiones.
- **"`HMAC` es más seguro que `CBC-MAC`."** Son igual de seguros; `HMAC` se usa más porque es más rápido. Y los valores de las constantes son `ipad` igual al byte `0x36` repetido y `opad` igual a `0x5C` repetido, como fija el RFC 2104: las filminas los escriben intercambiados, aunque su fórmula (`ipad` adentro, `opad` afuera) está bien.
- **`CBC-MAC` con IV aleatorio, publicando estados intermedios o con longitud variable.** Cada una rompe el esquema con probabilidad 1. El estado inicial es $0^{n}$ fijo, se emite solo el último bloque y la longitud va como prefijo o en la clave, nunca como sufijo.
- **$H(k \Vert m)$ como MAC de longitud variable.** Sufre extensión de longitud; la construcción correcta es `HMAC`, con dos pasadas.
- **Marcar "Falso" sin reescribir la sentencia ni nombrar el cambio.** La consigna pide las tres cosas, y la corrección tiene que dejar una sentencia verdadera completa, no una nota al margen.

## Para profundizar

- [[1p-mac-y-hash-en-parciales-viejos|MAC y hash en los parciales viejos]] — los ejercicios de este tipo que ya se tomaron, con enunciado completo, respuesta modelo y tips.
- [[primer-parcial|Primer parcial]] — el hub de la sección, con la tabla de los siete tipos y el orden sugerido.
- [[message-authentication-code|Message Authentication Code]] — la terna Gen, Mac y Vrfy, por qué la etiqueta es pública y la clave no, y por qué un MAC no da confidencialidad ni no repudio.
- [[seguridad-de-un-mac|Seguridad de un MAC]] — el experimento Mac-Forge: qué significa exactamente "infalsificable".
- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] — qué es una función de hash criptográfica y por qué la teoría define una familia con selector público.
- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] — las tres propiedades, la jerarquía y qué ataque real cubre cada una.
- [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] — cómo se itera una función de compresión, y de dónde sale la extensión de longitud.
- [[hmac|HMAC]] — las dos pasadas, ipad y opad, su costo real y por qué domina sin ser más seguro.
- [[cbc-mac|CBC-MAC]] — la construcción, el ataque de longitud variable paso a paso y las tres extensiones seguras.
- [[privacidad-e-integridad|Privacidad e integridad]] — las tres combinaciones, el oráculo de padding y las claves independientes.
- [[cifrado-autenticado|Cifrado autenticado]] — la construcción genérica, el símbolo de fallo y por qué es CCA-Secure.
- [[ccm-y-gcm|CCM y GCM]] — los dos modos autenticados reales y con qué clave trabaja cada uno.
- [[firma-digital|Firma digital]] — la primitiva que sí da no repudio.
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — la clase de la que sale todo este tipo de ejercicio.
- [[guia-03-mac-y-funciones-de-hash|Guía 03 — MAC y funciones de hash]] — los ejercicios de la cátedra sobre el tema.
- [[parciales-viejos|Parciales viejos]] — el análisis de los cuatro parciales, ejercicio por ejercicio.
