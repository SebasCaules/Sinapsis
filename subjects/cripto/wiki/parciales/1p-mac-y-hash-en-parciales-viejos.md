---
title: MAC y hash en los parciales viejos
resumen: 'Los ejercicios de MAC, hash e integridad que ya se tomaron en los primeros parciales: el Ej. 3 del 1C-2025 completo con respuesta modelo, y las tres sentencias de Verdadero o Falso sobre MAC y hash del 2C-2025 y del 1C-2023, cada una con veredicto, corrección y cambio identificado.'
fuentes: ["[[parciales-viejos]]", "[[privacidad-e-integridad]]", "[[message-authentication-code]]", "[[resistencias-de-una-funcion-de-hash]]", "[[cifrado-autenticado]]"]
aliases: [MAC y hash en parciales viejos, Ejercicios viejos de MAC y hash, Verdadero o Falso de MAC y hash en el parcial, Ej. 3 del 1C-2025]
type: parcial
clase: 1p
orden: 21
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, mac-hash-integridad, parciales-viejos, verdadero-o-falso, integridad, no-repudio]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# MAC y hash en los parciales viejos

Hay un ejercicio completo de este tipo —el Ej. 3 del [[parciales-viejos#1C-2025|1C-2025]]— y tres sentencias de Verdadero o Falso: la 5b del [[parciales-viejos#2C-2025|2C-2025]] y la 5a y la 5b del [[parciales-viejos#1C-2023|1C-2023]]. En el [[parciales-viejos#1C-2018|1C-2018]] el tema no aparece. El análisis parcial por parcial, con la resolución del apunte y su verificación, está en [[parciales-viejos|Parciales viejos]].

La receta y las trampas de este tipo están en [[1p-mac-hash-e-integridad|MAC, hash e integridad]]; la sección entera empieza en [[primer-parcial|Primer parcial]].

## 1C-2025 · Ej. 3 — ¿Este esquema da integridad?

### Enunciado

Dado el siguiente criptosistema $c = E_{k1}(\,m \Vert H(k2 \Vert m)\,)$.

donde $m$ es un mensaje de tamaño fijo, $H$ es una función de hash criptográfica, $E_k(\cdot)$ es una primitiva de encripción simétrica y $\Vert$ implica concatenación; $k1$ y $k2$ son claves compartidas entre Bob y Alice.

- a) Detallar el paso a paso itemizado de lo que debería hacer el receptor al recibir $c$.
- b) ¿Puede un atacante modificar el mensaje? Explicar la integridad del criptosistema.
- c) ¿Provee el protocolo algún esquema de autenticación? Explicar.
- d) ¿Provee el esquema algún mecanismo de no-repudio? Explicar.

### Respuesta modelo

**Clasificación previa.** El esquema autentica primero y cifra después: la etiqueta $t = H(k_2 \Vert m)$ es un hash con clave que cumple el papel de MAC —sin $k_2$ no se puede recomputar—, se concatena al mensaje y todo se cifra con $k_1$. Es la combinación `MAC-then-Encrypt` (autenticar y luego cifrar): lo único que viaja es $c$, y la etiqueta va adentro. Que $m$ sea de tamaño fijo tiene dos efectos: el receptor sabe dónde termina $m$ y empieza $t$, y el ataque de extensión de longitud contra $H(k \Vert m)$ no aplica, porque un mensaje extendido tendría otro tamaño y se rechaza.

**a) Paso a paso del receptor.**

1. Recibe $c$ y lo descifra con la clave compartida $k_1$: $D_{k_1}(c) = m \Vert t$.
2. Separa el resultado en dos partes: los primeros $\lvert m\rvert$ bits son $m$ (tamaño fijo, conocido) y los $L$ bits restantes son la etiqueta recibida $t$, con $L$ el tamaño de salida de $H$.
3. Recomputa la etiqueta con la clave compartida $k_2$: $t^{*} = H(k_2 \Vert m)$.
4. Compara $t^{*}$ con $t$, en tiempo constante (sin cortar en el primer byte distinto, para no filtrar cuántos bytes coinciden).
5. Si $t^{*} = t$, acepta $m$: llegó íntegro y lo generó alguien que conoce $k_2$. Si $t^{*} \ne t$, rechaza el mensaje ($\perp$), no usa $m$ para nada y devuelve un único tipo de error, sin distinguir entre fallo de descifrado y fallo de verificación.

**b) ¿Puede un atacante modificar el mensaje? Integridad.**

No sin ser detectado. El atacante no conoce $k_1$ ni $k_2$ y solo ve $c$. Para que el receptor acepte un $m' \ne m$, el descifrado de su $c'$ tendría que ser exactamente $m' \Vert H(k_2 \Vert m')$; producir $H(k_2 \Vert m')$ exige conocer $k_2$, y es justamente lo que un MAC (o un hash con clave) impide: sin la clave no se forja una etiqueta válida para un mensaje nuevo. El atacante ni siquiera ve etiquetas válidas, porque viajan cifradas. Si en cambio altera $c$ a ciegas, el descifrado cambia $m$, $t$ o ambos de forma que no controla, y la igualdad $H(k_2 \Vert m) = t$ falla en el paso 4 salvo con probabilidad despreciable. El esquema **provee integridad**: toda modificación se detecta.

Lo que sí hay que objetar es el **orden**. Al ir la etiqueta adentro del criptograma, el receptor está obligado a **descifrar antes de verificar**, así que $D_{k_1}$ (y, si hay relleno, el quitado del padding) corre sobre datos elegidos por el atacante. Esta combinación no tiene una prueba general de seguridad —solo hay demostraciones para combinaciones concretas— y, si el receptor distingue "padding inválido" de "etiqueta inválida" por el mensaje de error o por el tiempo de respuesta, entrega un bit por consulta: un **oráculo de padding**, ataque de texto cifrado escogido que recupera el texto plano sin la clave. Lo que este orden arriesga es la confidencialidad frente a un adversario activo, no la integridad. Lo correcto en general es **cifrar y luego autenticar**: $c = E_{k_1}(m)$, $t = \mathrm{MAC}_{k_2}(c)$, transmitir $\langle c, t\rangle$, verificar antes de descifrar y rechazar sin descifrar lo que no verifica, con $k_1$ y $k_2$ generadas de forma independiente. Ese esquema es `CCA-Secure` para cualquier criptosistema `CPA-Secure` y cualquier MAC infalsificable con etiquetas únicas (todos los determinísticos lo son): es cifrado autenticado.

**c) Autenticación.**

Sí, provee **autenticación de origen simétrica**. Si la verificación del paso 4 pasa, la etiqueta $H(k_2 \Vert m)$ la calculó alguien que conoce $k_2$, y $k_2$ la comparten solo Alice y Bob: para Bob, el emisor es Alice, y para Alice, Bob. Es una autenticación entre las dos partes que comparten la clave, y nada más: no identifica al emisor ante un tercero, y no protege contra el reenvío (un $c$ válido capturado sigue verificando si se reenvía; para eso haría falta un número de secuencia o una marca de tiempo dentro de $m$).

**d) No repudio.**

No. El no repudio exige que el emisor no pueda negar ante un tercero haber generado el mensaje, y para eso la prueba tiene que ser algo que **solo él** pudo producir. Aquí $k_2$ es compartida: Bob puede calcular $H(k_2 \Vert m)$ exactamente igual que Alice, y cifrarlo con $k_1$, que también tiene. Si Bob presenta un $c$ que verifica, un juez no puede saber si lo generó Alice o lo fabricó Bob, y Alice puede negarlo. Cualquier esquema de clave compartida tiene esta limitación, por definición y no por construcción. El no repudio lo da la **firma digital**: se firma con una clave privada que solo tiene el firmante y se verifica con la clave pública, así que la prueba solo pudo producirla él.

### Tips

- El inciso (b) es el que discrimina: la respuesta que vale es "no puede forjar, pero el orden es mejorable, y esta es la razón". Decir que "sí puede modificar porque primero se hashea y luego se cifra" es incorrecto: sin $k_2$ no se produce $H(k_2 \Vert m')$. La crítica correcta es que hay que descifrar para verificar, y que eso abre el oráculo de padding.
- Nombra la combinación (`MAC-then-Encrypt`), su estatus ("puede ser seguro, requiere prueba") y la recomendada (`Encrypt-then-MAC` con claves independientes): son tres líneas que el corrector espera ver.
- (c) y (d) son el mismo argumento con el signo cambiado: la clave compartida da autenticación entre las dos partes y, por lo mismo, quita el no repudio. Preguntarse "quién más tiene la clave" resuelve los dos incisos.
- El dato "mensaje de tamaño fijo" no es decorativo: dice dónde cortar en el paso 2 y elimina la extensión de longitud contra $H(k \Vert m)$. Mencionarlo muestra que se leyó el enunciado.
- Las mismas cuatro preguntas se pueden hacer sobre cualquier esquema. Si el próximo es `Encrypt-then-MAC`, el paso a paso del receptor invierte el orden: verificar la etiqueta sobre $c$ primero, descifrar después.

## Las sentencias de Verdadero o Falso sobre MAC y hash

Las tres traen la misma consigna: *"Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado."* Las tres son falsas.

### 2C-2025 · Ej. 5b — MAC simétrico y no repudio

**Sentencia.** *"Un protocolo de autenticación basado únicamente en un MAC simétrico provee confidencialidad, integridad y no repudio entre las partes."*

**Veredicto.** Falso.

**Sentencia corregida.** *"Un protocolo de autenticación basado únicamente en un MAC simétrico provee integridad y autenticación de origen entre las partes, pero no confidencialidad ni no repudio."*

**Cambio identificado.** Se quitan dos servicios y se nombra el que sí da. **Confidencialidad**: un MAC no oculta el mensaje; su definición solo pide que nadie forje etiquetas, y el par $\langle m, t\rangle$ viaja con $m$ en claro. **No repudio**: la clave es compartida, así que cualquiera de las dos partes pudo generar la etiqueta y un tercero no puede atribuírsela al emisor; el no repudio requiere firma digital, con clave privada. Lo que un MAC sí provee es **integridad** y **autenticación de origen** entre quienes comparten la clave.

### 1C-2023 · Ej. 5a — Cifrar y autenticar con claves iguales

**Sentencia.** *"Para proveer privacidad e integridad, lo correcto es primero Cifrar $m$ con $k_1$ para obtener $c$ y al mismo tiempo obtener el MAC con la clave $k_2$ de $m$ para obtener $t$. Tanto $m$ como $t$ se deben transmitir en forma conjunta. Las claves $k_1$ y $k_2$ pueden ser iguales."*

**Veredicto.** Falso.

**Sentencia corregida.** *"Para proveer privacidad e integridad, lo correcto es primero cifrar $m$ con $k_1$ para obtener $c$ y luego obtener el MAC con la clave $k_2$ de $c$ para obtener $t$. Tanto $c$ como $t$ se deben transmitir en forma conjunta. Las claves $k_1$ y $k_2$ deben ser independientes."*

**Cambio identificado.** Tres. (1) **"al mismo tiempo … de $m$" pasa a "luego … de $c$"**: la sentencia describe cifrar y autenticar por separado (`Encrypt-and-MAC`), que es la combinación insegura, porque la etiqueta se calcula sobre el texto plano, viaja en claro y puede filtrar información de $m$; lo correcto es cifrar y luego autenticar el criptograma (`Encrypt-then-MAC`), que es seguro para cualquier criptosistema y cualquier MAC seguros. (2) **Se transmiten $c$ y $t$, no $m$ y $t$**: enviar $m$ en claro anula la privacidad. (3) **"pueden ser iguales" pasa a "deben ser independientes"**: con la misma clave, dos componentes seguros pueden componer un esquema inseguro incluso en el orden correcto (con $E_k(m) = F_k(m \Vert r)$ y $\mathrm{MAC}_k(c) = F_k^{-1}(c)$, la etiqueta es $m \Vert r$ en claro).

### 1C-2023 · Ej. 5b — La seguridad de un hash y las preimágenes

**Sentencia.** *"La seguridad de las funciones de hash se establece como el nivel de resistencia a preimagenes donde dado un $y$ hallar $x/h(x) = y$."*

**Veredicto.** Falso.

**Sentencia corregida.** *"La seguridad de las funciones de hash se establece con tres niveles de resistencia: a preimágenes (dado $y$, es computacionalmente imposible hallar $x$ tal que $h(x) = y$), a segundas preimágenes (dado $x$, hallar $x' \ne x$ tal que $h(x') = h(x)$) y a colisiones (hallar cualquier par $x \ne x'$ tal que $h(x) = h(x')$); la resistencia a colisiones es la más fuerte y la que define la seguridad, porque implica las otras dos."*

**Cambio identificado.** La sentencia reduce la seguridad a **una sola** propiedad, y además a la más débil. La definición de preimagen que da es correcta; el error es presentarla como el criterio de seguridad. Son tres resistencias, ordenadas: colisiones $\Rightarrow$ segundas preimágenes $\Rightarrow$ preimágenes (la implicación vale asintóticamente, para digests grandes). La que la cátedra formaliza (`Hash-Coll`) y la que cae primero en la práctica es la de colisiones: `MD5` y `SHA-1` siguen resistiendo preimágenes y ya tienen colisiones publicadas, así que una función puede cumplir el criterio de la sentencia y estar quebrada.

## Lo que se repite

- **La pregunta de fondo es siempre "quién tiene la clave".** Con clave compartida hay integridad y autenticación entre las dos partes, y no hay no repudio; con hash sin clave no hay ni integridad frente a un adversario; el no repudio solo llega con la firma digital. Los cuatro ítems se resuelven con esa frase.
- **El orden de composición se pregunta de las dos formas**: como esquema para analizar (1C-2025) y como sentencia para corregir (1C-2023). Hay que llevar memorizadas las tres combinaciones con su veredicto: `Encrypt-and-MAC` inseguro, `MAC-then-Encrypt` requiere prueba y obliga a descifrar antes de verificar, `Encrypt-then-MAC` siempre seguro con claves independientes.
- **Las claves independientes son una condición, no una recomendación.** Cuando un enunciado dice "pueden ser iguales", es falso.
- **Un MAC provee dos servicios y no cuatro.** Integridad y autenticación de origen; ni confidencialidad ni no repudio. Toda sentencia que le atribuya más es falsa.
- **De los hash se pregunta la definición de seguridad**, y la respuesta es "tres resistencias, y la de colisiones es la que manda". Conviene llevar las tres escritas con sus cuantificadores.
- **Lo que no se tomó nunca** como ejercicio propio: `CBC-MAC`, `HMAC`, Merkle-Damgård, cumpleaños, `CCM`/`GCM`. Alcanza con tenerlos listos como Verdadero o Falso: la fórmula, la condición de seguridad y el error típico de cada uno.
