---
tipo: flashcards
titulo: "Integridad: MAC, hash y cifrado autenticado"
id: hash-y-macs
division: "3"
descripcion: Qué garantiza un MAC, cómo se construye a partir de una PRF o de un hash, y cómo se compone con el cifrado.
---

## Enuncie la terna que define un MAC y su propiedad básica {#hash-y-macs:mac-terna-y-propiedad-basica}
> pagina: message-authentication-code

$$
\begin{aligned}
\mathsf{Gen} &: () \to \mathcal{K} && \text{generador de clave}\\
\mathsf{Mac} &: \mathcal{K}\times\mathcal{P} \to \mathcal{T} && \text{etiquetador}\\
\mathsf{Vrfy} &: \mathcal{K}\times\mathcal{P}\times\mathcal{T} \to \{0,1\} && \text{verificador}
\end{aligned}
$$

**Propiedad básica:** $\forall m \in \mathcal{P},\ \forall k \in \mathcal{K}$ válidos, $\mathsf{Vrfy}_k\bigl(m,\ \mathsf{Mac}_k(m)\bigr) = 1$ — una etiqueta legítima siempre verifica.

A diferencia del criptosistema, `Mac` y `Vrfy` **no son inversas**: `Vrfy` devuelve un bit y no recupera el mensaje. Y la propiedad básica no dice nada sobre seguridad; eso lo mide `Mac-Forge`.

## ¿Qué servicios de seguridad da un MAC y cuáles no? {#hash-y-macs:mac-que-servicios-da}
> pagina: message-authentication-code

| Servicio | ¿Lo da? |
|---|---|
| Integridad | Sí |
| Autenticación de origen | Sí, solo entre las partes que comparten la clave |
| No repudio | **No**: la clave es simétrica, el receptor pudo fabricar la etiqueta él mismo |
| Confidencialidad | **No**: nada en la definición pide que $t$ oculte $m$ |

La **etiqueta es pública** —puede guardarse junto al mensaje—; lo único privado es la clave. Y esa clave es lo que separa un MAC de un CRC o un checksum, que cualquiera recalcula.

## Enuncie el experimento Mac-Forge y la condición de infalsificabilidad {#hash-y-macs:mac-forge-experimento}
> pagina: seguridad-de-un-mac

$$
\begin{aligned}
&1)\ \ k \leftarrow \mathcal{K}\\
&2)\ \ A \text{ recibe acceso al oráculo } \mathsf{Mac}_k(\cdot)\\
&3)\ \ Q \text{ es el conjunto de las consultas que hizo}\\
&4)\ \ A \text{ emite } (m,t) \text{ con } m \notin Q
\end{aligned}
$$

Gana si $\mathsf{Vrfy}_k(m,t)=1$. Y $\Pi$ es **infalsificable** si $\Pr[\mathsf{Mac\text{-}Forge}_{A,\Pi}(n)=1] \le \mathsf{negl}(n)$ para todo $A$ $\mathrm{PPT}$.

La cota es **despreciable a secas** y no $\tfrac12+\mathsf{negl}(n)$: acá el adversario no distingue, **fabrica**, así que no hay piso de moneda. Son 4 pasos y no 5 porque no hay bit oculto que sortear.

## El MAC $\mathsf{Mac}_k(m)=k\oplus\mathsf{first}_n(m)$: exhiba una falsificación y enuncie la moraleja {#hash-y-macs:mac-etiqueta-todos-los-bits}
> pagina: seguridad-de-un-mac

Consultar cualquier $m$ con $\lvert m\rvert > n$ y recibir $t = k \oplus \mathsf{first}_n(m)$. Construir $m^{*}$ cambiando **cualquier bit a partir de la posición $n+1$** y emitir $(m^{*}, t)$: el prefijo de $n$ bits no cambió, así que la misma etiqueta verifica. Una consulta, probabilidad 1.

*(También cae por recuperación de clave: consultar $0\cdots0$ devuelve $t = k$.)*

**Moraleja:** para ser infalsificable, la etiqueta tiene que tomar en cuenta **todos** los bits del mensaje. No se puede armar un MAC infalsificable que ignore partes del mensaje.

## Escriba el MAC de longitud fija a partir de una PRF y diga por qué no alcanza {#hash-y-macs:mac-longitud-fija-prf}
> pagina: construccion-de-macs-a-partir-de-una-prf

$$
\mathsf{Gen}: k \leftarrow \{0,1\}^{n} \qquad \mathsf{Mac}_k(m): t \leftarrow F_k(m),\ \ \lvert m\rvert = \lvert k\rvert = n
$$

$$
\mathsf{Vrfy}_k(m,t): \ \text{si } \lvert m\rvert \neq \lvert k\rvert \Rightarrow 0; \ \text{si no, } F_k(m)=t \Rightarrow 1
$$

Si $F$ es pseudoaleatoria, es un MAC seguro **para mensajes de $n$ bits**: falsificar obliga a acertar $F_k$ en un punto nuevo. El chequeo de longitud no es burocracia — es lo que hace cumplir esa restricción.

**No alcanza** porque $n$ es el tamaño de bloque de la primitiva: 128 bits con AES, o sea 16 bytes. El problema de estirarlo se llama **extensión de dominio**.

## En la construcción genérica $t_i:=\mathsf{Mac}'_k(r\Vert L\Vert i\Vert m_i)$, ¿qué ataque mata cada campo? {#hash-y-macs:mac-generico-cuatro-campos}
> pagina: construccion-de-macs-a-partir-de-una-prf

| Campo | Qué mata |
|---|---|
| $r$, identificador aleatorio sorteado **por mensaje** | la **mezcla** de bloques de dos mensajes distintos |
| $L$, la longitud | el **truncado**: sacar bloques cambia $L$ |
| $i$, el índice | la **permutación** de bloques |
| $m_i$ | ninguno: es el dato |

$r$ ata el bloque a su mensaje, $L$ a la longitud total, $i$ a su posición. Los bloques son de $n/4$ porque son cuatro campos y $\mathsf{Mac}'$ acepta $n$ bits; de ahí la cota $L < 2^{n/4}$.

Es correcta pero **ineficiente**: la etiqueta mide $\approx 4L$ y crece con el mensaje. Por eso se pasa a `CBC-MAC`, que consigue lo mismo con una etiqueta de $n$ bits constante.

## Escriba CBC-MAC y explique por qué $t_0$ tiene que ser fijo {#hash-y-macs:cbc-mac-construccion}
> pagina: cbc-mac

$$
t_0 = 0^{n}, \qquad t_i = F_k(t_{i-1}\oplus m_i), \qquad \mathsf{Mac}_k(m) = t_j
$$

La verificación es **canónica**: recalcular la cadena entera y comparar. Se emite **solo el último estado**; los intermedios se descartan.

Un IV aleatorio no sería neutro, sería un agujero: tendría que viajar con la etiqueta, y entonces el adversario consulta $m$, recibe $(IV,t)$ y emite $m' = (m_1\oplus\Delta)\Vert m_2\cdots$ con la etiqueta $(IV\oplus\Delta,\ t)$. Los $\Delta$ se cancelan en la primera aplicación de $F_k$ y $t$ sigue siendo válida.

## Exhiba el ataque de longitud variable contra CBC-MAC {#hash-y-macs:cbc-mac-ataque-longitud-variable}
> pagina: cbc-mac

Dos consultas: $m_1 = A\Vert B$ y $m_2 = A$, que devuelven $t_1$ y $t_2 = F_k(A)$. Emitir el mensaje de tres bloques

$$
M = A \Vert B \Vert (A\oplus t_1) \qquad \text{con la etiqueta } t_2
$$

$$
v_1 = F_k(A) = t_2,\quad v_2 = F_k(t_2\oplus B) = t_1,\quad v_3 = F_k(t_1\oplus A\oplus t_1) = F_k(A) = t_2
$$

$M \notin Q$ y $\Pr[\mathsf{Mac\text{-}Forge}=1] = 1$. La consulta de un bloque **compra el estado intermedio** que la cadena larga descarta, y el tercer bloque anula el estado para dejar $A$ pelado en la entrada de $F_k$.

## Enumere las tres extensiones seguras de CBC-MAC y enuncie el criterio prefix-free {#hash-y-macs:cbc-mac-prefix-free}
> pagina: cbc-mac

1. **Clave derivada de la longitud:** $k' := F_k(\lvert m\rvert)$, y se encadena con $F_{k'}$.
2. **Longitud como prefijo:** $\mathsf{CBC\text{-}MAC}_k\bigl(\lvert m\rvert \Vert m\bigr)$.
3. **Dos claves:** $t := F_{k_2}\bigl(\mathsf{CBC\text{-}MAC}_{k_1}(m)\bigr)$ — la única que no necesita conocer la longitud de antemano, pero pide el doble de material de clave y es la que menos se usa.

**Criterio:** si $F$ es pseudoaleatoria, la cadena `CBC` es una función pseudoaleatoria mientras se la consulte sobre un conjunto *prefix-free* (ningún elemento es prefijo de otro). Longitud fija y prefijo lo son; longitud libre y **longitud como sufijo** no lo son, y las dos tienen ataque. La opción 1 también reduce a ese criterio —cada longitud queda aislada en su clave—, pero **la 3 no**: a ésa la salva otra cosa, ocultar la salida de la cadena detrás de una segunda clave.

Regla general de los *extension attacks*: en una construcción iterativa, lo que distingue un mensaje de otro entra **en la clave o al principio**, nunca al final.

## Defina una función de hash criptográfica y explique por qué el selector $s$ no es una clave {#hash-y-macs:hash-definicion-y-selector}
> pagina: funciones-de-hash-criptograficas

$$
\mathsf{Gen}: s \leftarrow S \qquad\qquad \mathsf{Hash}: h = H^{s}(m) \in \{0,1\}^{L}
$$

Dominio **no acotado**, codominio de $2^{L}$ elementos, y **ningún valor secreto**.

$s$ es **información pública**: en criptografía "clave" significa un valor que el adversario no conoce, y $s$ se le entrega. Está para prohibirle **precomputar**: con una única función fija, quien conozca una colisión la lleva cableada adentro y gana siempre en tiempo constante. En la práctica $S = \{s_0\}$ — `MD5`, `SHA-1`, `SHA-2` y `SHA-3` están fijas en el estándar.

## Las tres resistencias de una función de hash: qué se le da al adversario y qué debe producir {#hash-y-macs:hash-tres-resistencias}
> pagina: resistencias-de-una-funcion-de-hash

| Propiedad | Le dan | Debe producir | Grados de libertad |
|---|---|---|---|
| Preimagen | un digest $y$ | $x$ con $h(x)=y$ | ninguno |
| Segunda preimagen | un mensaje $x$ | $x'\ne x$ con $h(x')=h(x)$ | uno |
| Colisión | nada | cualquier par $x \ne x'$ que coincida | dos |

Más grados de libertad ⇒ ataque más fácil ⇒ **propiedad más fuerte**. *Computacionalmente imposible* quiere decir: para todo $A$ $\mathrm{PPT}$, $\Pr[A \text{ lo logra}] \le \mathsf{negl}(n)$.

Las colisiones **existen siempre** por el principio del palomar, así que lo único que se puede pedir es que nadie sepa exhibir una.

## ¿Cuánto cuesta cada ataque genérico a un hash de $L$ bits, y por qué las colisiones salen la raíz? {#hash-y-macs:hash-ataque-del-cumpleanos}
> pagina: seguridad-de-las-funciones-de-hash

Preimagen y segunda preimagen: $2^{L}$ — no se conoce nada mejor. Colisión: $\Theta(2^{L/2})$, por la **paradoja del cumpleaños**, con $q \approx 1{,}18\sqrt{N}$ y $N = 2^{L}$.

**La cuenta no se hace sobre elementos, se hace sobre pares:** con $q$ entradas hay $\binom{q}{2}=\tfrac{q(q-1)}{2}$ pares y cada uno colisiona con probabilidad $1/N$; los pares crecen cuadráticamente, así que alcanzan $N$ cuando $q$ alcanza $\sqrt{N}$.

Consecuencia: **$L$ bits de salida dan $L/2$ bits de seguridad contra colisiones**, y por eso los hashes llevan aproximadamente el doble de bits que las claves de un criptosistema. Una salida de 160 bits da apenas $2^{80}$.

## Merkle-Damgård: escriba la recurrencia y enuncie el teorema que la justifica {#hash-y-macs:merkle-damgard-teorema}
> pagina: construccion-de-merkle-damgard

$$
z_0 = 0^{l}, \qquad z_i = h^{s}(z_{i-1} \Vert x_i), \qquad x_{B+1} = \lvert x\rvert, \qquad H^{s}(x) = z_{B+1}
$$

Preprocesamiento: padding hasta múltiplo del bloque **y** un bloque con la longitud.

**Teorema:** si la función de compresión $h^{s}$ es resistente a colisiones, entonces $H^{s}$ también lo es — *una colisión en $H^{s}$ solo puede ocurrir si hay una colisión en $h^{s}$*. Eso reduce el análisis de un dominio infinito a una pieza finita.

El **bloque de longitud** es el caso 1 de la demostración: dos mensajes de largo distinto difieren en la última entrada de $h^{s}$. Sin él, $x$ y $x\Vert 0$ se rellenan a la misma cadena y colisionan sin criptoanálisis de ningún tipo.

## ¿Por qué $\mathsf{Mac}_k(m) = H(k \Vert m)$ no sirve como MAC? {#hash-y-macs:length-extension-mac-ingenuo}
> pagina: construccion-de-merkle-damgard

Por el **ataque de extensión de longitud**. En `MD5`, `SHA-1` y `SHA-2` el digest **es el estado interno** de la cadena al terminar, y $h^{s}$, el $IV$ y el padding son públicos. El adversario que ve un par legítimo $(m,t)$:

1. Toma $t$, que es el estado tras procesar $k\Vert m$ con su padding.
2. Sigue iterando $h^{s}$ con bloques $m'$ a su gusto y obtiene $t^{*}$.
3. Emite $\bigl(m \Vert \mathrm{pad}(k\Vert m) \Vert m',\ t^{*}\bigr)$, válido y nunca consultado.

Solo necesita $\lvert k\rvert$ para reconstruir el padding. Es la misma familia que el ataque al sufijo de `CBC-MAC`: **toda construcción iterativa que publique su estado final como salida es atacable por extensión**. Por eso `HMAC` es anidado.

## Escriba HMAC, con los valores de opad e ipad {#hash-y-macs:hmac-construccion}
> pagina: hmac

$$
t = H^{s}\Bigl((k \oplus \mathsf{opad}) \,\Vert\, H^{s}\bigl((k \oplus \mathsf{ipad}) \,\Vert\, m\bigr)\Bigr)
$$

- **`ipad` = el byte `0x36` repetido** (*inner*, va en el hash de adentro).
- **`opad` = el byte `0x5C` repetido** (*outer*, va en el de afuera).

*(Las dos filminas de la cátedra intercambian los valores; la fórmula está bien y los valores correctos son los de la RFC 2104.)* Se repiten hasta el **tamaño de bloque de la función de compresión**, no hasta $\lvert k\rvert$.

La prueba solo exige que las dos constantes sean **distintas**; los valores son un byte repetido por el criterio *nothing up my sleeve*. Y no cuesta el doble: el mensaje se procesa una sola vez y el hash externo ve siempre dos bloques, independientemente de $\lvert m\rvert$.

## ¿Por qué las bibliotecas prefieren HMAC antes que CBC-MAC? {#hash-y-macs:hmac-contra-cbc-mac}
> pagina: hmac

**No porque sea más seguro.** Las dos son seguras, cada una con su teorema: `CBC-MAC` a partir de una función pseudoaleatoria, `HMAC` a partir de una función de hash libre de colisiones.

La diferencia es de **costo por byte**: las permutaciones pseudoaleatorias de un cifrado de bloque son pesadas en cantidad de operaciones frente a las funciones de compresión de un hash, así que calcular la etiqueta sale **de 1 a 3 órdenes de magnitud más rápido** que cifrar el mensaje, que es lo que `CBC-MAC` necesita. Sobre teras o petabytes eso decide.

Contestar *"HMAC es más seguro"* está mal; lo correcto es *"es más barato sobre volúmenes grandes, con la misma garantía"*.

## Las tres formas de combinar un criptosistema y un MAC, con su veredicto {#hash-y-macs:tres-combinaciones-privacidad-integridad}
> pagina: privacidad-e-integridad

1. **Cifrar y autenticar** — $c \leftarrow \mathsf{Enc}_{k_1}(m)$, $t \leftarrow \mathsf{Mac}_{k_2}(m)$, se envía $\langle c,t\rangle$: **inseguro**, la etiqueta puede brindar información de $m$. Como los MAC reales son determinísticos, etiquetas iguales delatan mensajes iguales.
2. **Autenticar y luego cifrar** — $c \leftarrow \mathsf{Enc}_{k_1}\bigl(m \Vert \mathsf{Mac}_{k_2}(m)\bigr)$: **puede ser seguro, requiere prueba**. Hay pruebas para combinaciones concretas y **ninguna general**. El mecanismo que falla es el padding: hay que descifrar antes de poder verificar.
3. **Cifrar y luego autenticar** — $t \leftarrow \mathsf{Mac}_{k_2}(c)$: **siempre seguro**, con componentes seguros y **claves independientes**, y con demostración general para cualquier criptosistema y cualquier MAC.

Regla mnemotécnica: **autenticar lo que se transmite, no lo que se guardó** — el MAC va sobre $c$, que es lo que el adversario puede tocar.

## Escriba la construcción genérica de cifrado autenticado y diga qué garantiza {#hash-y-macs:cifrado-autenticado-construccion}
> pagina: cifrado-autenticado

$$
\begin{aligned}
\mathsf{Gen}(1^{n}):\quad & k_1 \leftarrow \mathsf{Gen}_e(1^{n}),\qquad k_2 \leftarrow \mathsf{Gen}_m(1^{n})\\
\mathsf{Enc}_{k_1,k_2}(m):\quad & c \leftarrow \mathsf{Enc}_{k_1}(m),\quad t \leftarrow \mathsf{Mac}_{k_2}(c),\quad \text{salida } \langle c,t\rangle\\
\mathsf{Dec}_{k_1,k_2}(\langle c,t\rangle):\quad & \mathsf{Vrfy}_{k_2}(c,t)=1 \Rightarrow m := \mathsf{Dec}_{k_1}(c); \quad \text{si no} \Rightarrow \perp
\end{aligned}
$$

$$
\textbf{Cifrado autenticado} = \text{privacidad} + \text{integridad} = \texttt{CCA-Secure} + \texttt{Mac-Forge-Secure}
$$

Se **verifica antes de descifrar**, y aparece un modo de falla nuevo: $\perp$, que no pertenece al espacio de mensajes. La idea de la demostración: el MAC no vuelve incifrable nada, **vuelve inútil el oráculo de descifrado** — todo lo que el adversario no obtuvo antes por sí mismo recibe $\perp$, y el juego `CCA` degenera en `CPA`.

## CCM contra GCM: composición, pasadas y consecuencia de repetir el nonce {#hash-y-macs:ccm-contra-gcm}
> pagina: ccm-y-gcm

| | `CCM` | `GCM` |
|---|---|---|
| Qué es | Counter with CBC-MAC | Galois/Counter Mode: CTR + GHASH sobre $\mathrm{GF}(2^{128})$ |
| Composición | *authenticate-then-encrypt* | *encrypt-then-MAC* |
| Pasadas | **dos**: $\approx 2$ evaluaciones de AES por bloque, la mitad de velocidad | **una**, y admite streaming |
| Estado | cayendo en desuso | el más usado hoy |

Los dos usan **una sola clave** y **ninguno** entra por el teorema genérico: cada uno tiene su prueba específica. En `CCM`, la condición es que el IV y el nonce no coincidan ni se reutilicen.

Nonce repetido: en `CCM` se pierde la confidencialidad de esos mensajes; en `GCM` además se despeja $H$ —GHASH es lineal— y con eso se pierde **toda** la integridad de esa clave.

## ¿Por qué un MAC infalsificable no protege contra replay? {#hash-y-macs:replay-y-frescura}
> pagina: ataques-de-repeticion-y-frescura

Porque el experimento **no lo modela**. Quien reenvía $(m,t)$ tal cual cumple $\mathsf{Vrfy}_k(m,t)=1$ pero **falla $m \notin Q$**, así que $\Pr[\mathsf{Mac\text{-}Forge}=1] = 0$ — pierde el experimento con probabilidad 1 y aun así puede vaciar una cuenta. La razón técnica: `Vrfy` **no tiene estado**.

No es defecto de ninguna construcción: está en la definición, así que lo heredan `CBC-MAC`, `HMAC` y cualquier MAC seguro por igual. **Integridad no es frescura.**

Las dos contramedidas viven en el protocolo, y en las dos **el valor entra adentro del `Mac`**:

- **Número de secuencia**, $\mathsf{Mac}_k(\mathrm{ctr}\Vert m)$: elimina el replay dentro de la sesión, pero exige estado sincronizado y sufre con pérdida o reordenamiento.
- **Timestamp**, $\mathsf{Mac}_k(T\Vert m)$: no exige estado compartido, pero sí relojes sincronizados, y **deja siempre una ventana** $\Delta$.
