---
title: Analizar un protocolo
resumen: 'Cómo resolver el Ej. 1 del primer parcial: clasificar un protocolo dado como tabla de mensajes, decir qué servicio da cada campo y decidir si resiste un man in the middle o un replay, cerrando con la corrección conocida.'
fuentes: ["[[parciales-viejos]]", "[[intercambio-de-claves]]", "[[distribucion-de-claves-y-kdc]]", "[[diffie-hellman]]", "[[needham-schroeder]]", "[[denning-sacco-y-frescura]]", "[[ataques-activos-y-man-in-the-middle]]", "[[ataques-de-repeticion-y-frescura]]", "[[certificados-digitales]]", "[[tls-handshake]]", "[[firma-digital]]"]
aliases: [Analizar un protocolo (parcial), Ejercicio 1 del primer parcial, Protocolo en el parcial, Receta para analizar un protocolo]
type: parcial
clase: 1p
orden: 10
created: 2026-09-14
updated: 2026-09-14
tags: [parcial, primer-parcial, protocolos, intercambio-de-claves, man-in-the-middle, replay, frescura]
sources: ["raw/parciales/Cripto - Primeros Parciales.pdf"]
---

# Analizar un protocolo

El Ej. 1 de los cuatro parciales viejos —2C-2025, 1C-2025, 1C-2023 y 1C-2018— es siempre un protocolo: una tabla de mensajes numerados entre $A$ y $B$ (o $C$ y $S$, a veces con un tercero $T$) y tres preguntas en el mismo orden. La primera es textual en tres de los cuatro: *«¿Qué tipo de protocolo sería? ¿Qué es lo que el protocolo intenta construir?»*. La segunda pregunta para qué sirve un mensaje o un campo, y la tercera si es susceptible a un ataque —man in the middle, replay— o qué problema tiene. Es el ejercicio que abre el examen y es material de la [[clase-05-protocolos-criptograficos|Clase 05]]; los cuatro resueltos están en [[parciales-viejos|Parciales viejos]].

## Lo mínimo que hay que saber

### Qué construye un protocolo de intercambio de claves

Dos partes hablan por un canal que un atacante ve entero y terminan con la misma clave: $\Pi(n) \to (\mathrm{Trans}, k_a, k_b)$ con $k_a = k_b$, donde $\mathrm{Trans}$ es la transcripción de todos los mensajes. Esa clave es la **clave de sesión**: nueva en cada conversación, y con ella se cifra y se autentica el tráfico posterior con esquemas simétricos. Hay tres maneras de llegar a ella: por **acuerdo**, cuando cada extremo la calcula con aportes de los dos y la clave nunca viaja (Diffie-Hellman); por **transporte**, cuando una parte o un tercero la genera y la envía cifrada (el KDC de Needham-Schroeder; el secreto que el cliente cifra con la clave pública del servidor en TLS); o por **derivación** sobre claves ya compartidas, cuando cada extremo aplica un MAC o un hash con una clave de largo plazo a un nonce (2C-2025).

### Sobre qué confianza previa se apoya

- **Claves simétricas compartidas de antemano** entre $A$ y $B$: un MAC con esa clave autentica cada mensaje de forma directa (2C-2025).
- **Un tercero de confianza** ($T$, KDC): comparte una clave fija con cada participante y genera las claves de sesión; baja el total de claves de $\binom{n}{2}$ a $n$, pero conoce todas las claves de sesión y es un único punto de falla (1C-2018).
- **Certificados**: un mensaje firmado por una autoridad que ata una identidad a una clave pública, con fecha de emisión, intervalo de validez y tipo de uso. Quien lo recibe verifica la firma de la autoridad, el nombre y la vigencia, y con eso autentica a alguien con quien nunca compartió nada (1C-2023).
- **Nada**: Diffie-Hellman puro. Solo es seguro contra un adversario pasivo, el que escucha pero no modifica (1C-2025).

### Autenticación unilateral o mutua

Unilateral: una sola parte demuestra quién es (en TLS, el servidor, por su certificado; el cliente queda anónimo salvo que se le pida uno). Mutua: las dos (en 2C-2025, MAC en ambos sentidos con nonces cruzados; en Needham-Schroeder, el ticket para $B$ y el desafío $N_B$). Diffie-Hellman puro no autentica a nadie: por eso cae ante un atacante activo.

### Qué servicio da cada campo

| Campo | Servicio | Quién lo verifica y cómo |
|---|---|---|
| Nonce $r$, $N$ (número al azar) | **Frescura**: ata la respuesta a esta ejecución e impide reusar una respuesta vieja | Quien lo eligió, comparando con el que envió |
| Timestamp $T$ | **Frescura** por recencia, sin ida y vuelta | El receptor, contra su reloj y una ventana $\Delta t$; exige relojes sincronizados y acota el replay, no lo elimina |
| $\mathrm{MAC}_k(\cdot)$ | **Integridad y autenticación de origen**: lo produjo alguien con $k$. No da frescura ni no repudio | Quien comparte $k$, recomputándolo sobre los campos en claro |
| Firma $\mathrm{Sgn}_{sk}(\cdot)$ | Lo mismo que el MAC, más verificación pública y no repudio | Cualquiera con $pk$, que sale de un certificado |
| $E_k(\cdot)$ | **Confidencialidad**; en un desafío-respuesta ($E_k(N_B)$, $E_k(N_B - 1)$) sirve como prueba de que se conoce $k$ | Quien tiene $k$ |
| Nombre dentro del cifrado o del MAC | Ata el mensaje a una identidad: impide suplantar al destinatario o reusar el mensaje con otro par | El receptor, contra la identidad esperada |
| Certificado | Ata identidad y clave pública con la firma de una autoridad | Firma de la autoridad, nombre, vigencia y tipo de uso |

### Los dos ataques que se preguntan

- **Man in the middle.** El atacante activo puede omitir, reescribir, reordenar y repetir mensajes. La forma clásica: sustituye un valor público ($pk_B$, o $g^y$ en Diffie-Hellman) por uno propio, termina con una clave con cada víctima, y descifra, lee y vuelve a cifrar entre ambas sin que ninguna lo note. Funciona siempre que nada autentique quién envió el valor público. No rompe ninguna primitiva: explota una identidad que nadie verificó.
- **Replay.** El atacante reenvía tal cual un mensaje válido de una ejecución anterior. Un MAC o una firma no lo impiden: el mensaje está íntegro y su origen es legítimo; lo que falta es frescura. Funciona siempre que el receptor no tenga un nonce propio ni un timestamp con qué distinguir un mensaje viejo de uno nuevo.

### Cómo se razona el ataque

Se parte de lo que el atacante **no tiene** —las claves compartidas, las claves con $T$, la clave privada del certificado, los exponentes $x$ e $y$— y se hacen tres preguntas: ¿puede fabricar el mensaje que autentica a la otra parte? ¿puede sustituir un valor público sin que se detecte? ¿puede reenviar un mensaje grabado que el receptor no tenga forma de rechazar? Si las tres fallan, el protocolo resiste; si una funciona, ese es el ataque, y se escribe paso a paso: qué grabó o envió el atacante, qué concluye la víctima y qué obtiene el atacante.

> [!tip] La frase que ordena todo
> La primitiva garantiza que el mensaje no cambió y quién lo produjo; el protocolo tiene que garantizar cuándo. Autenticación y frescura son dos servicios distintos, y el examen premia nombrarlos por separado.

### Los tres protocolos con nombre

- **Diffie-Hellman** (acuerdo, sin autenticación). $A$ envía $(G, q, g)$ y $h_1 = g^x$; $B$ responde $h_2 = g^y$; ambos calculan $k = h_2^{\,x} = h_1^{\,y} = g^{xy}$. $q$ debe ser primo para que exista la raíz primitiva $g$. Seguridad: $x$ e $y$ nunca viajan, y obtenerlos de $g^x$ y $g^y$ es el problema del logaritmo discreto, sin algoritmo eficiente conocido; la hipótesis fuerte es DDH: dados $g$, $g^x$ y $g^y$, $g^{xy}$ es indistinguible de un elemento al azar. Solo resiste adversarios pasivos: un MitM sustituye $h_1$ y $h_2$ por $g^{x_M}$ y $g^{y_M}$ y queda con una clave con cada uno. Necesita un canal autenticado: MAC, firma o certificado sobre los valores.
- **Needham-Schroeder** (transporte con KDC, autenticación mutua mediada por el tercero). $A \to \mathrm{KDC}: A, B, N_A$; $\mathrm{KDC} \to A: E_{k_{A}}(N_A, B, k, E_{k_{B}}(k, A))$; $A \to B: E_{k_{B}}(k, A)$; $B \to A: E_k(N_B)$; $A \to B: E_k(N_B - 1)$. Problema: el mensaje 3 no lleva frescura para $B$; con una clave $k$ vieja comprometida, el atacante reenvía el mensaje 3 grabado, responde el desafío y suplanta a $A$. **Denning-Sacco** pone un timestamp $T$ dentro del ticket, $E_{k_{B}}(k, A, T)$: $B$ lo rechaza si no es reciente. Acota el ataque a la ventana $\Delta t$ y exige relojes sincronizados.
- **TLS** (transporte del secreto con RSA o acuerdo con Diffie-Hellman firmado; autentica al servidor, y al cliente solo si se le pide certificado). Saludos con nonces $r_1, r_2$; certificado del servidor; el cliente envía un secreto cifrado con la clave pública del servidor (o su $g^b$); ambos derivan la clave maestra del secreto y de los nonces; cada lado envía un Finished ya bajo las claves nuevas, que confirma que los dos calcularon lo mismo. La clave del certificado autentica y transporta; nunca cifra el tráfico: la clave de sesión se deriva, es simétrica y es nueva por conexión.

## Receta

1. **Anote qué comparten las partes antes del primer mensaje**: claves simétricas $K$; una clave con $T$ cada uno; un certificado; nada. Eso fija la base de confianza y, con ella, el tipo.
2. **Lea la tabla fila por fila y marque dos cosas por mensaje**: quién pudo producirlo (qué clave exige) y qué campo le da frescura a quién (un nonce vale para quien lo eligió; un timestamp, para quien lo compara con su reloj).
3. **Clasifique y, si puede, nombre**: acuerdo, transporte o derivación; autenticación unilateral, mutua o ninguna; claves compartidas, KDC o certificados. $g^x$ y $g^y$ es Diffie-Hellman; un tercero que emite $E_{k_{B}}(k, A)$ y un desafío $N_B - 1$ es Needham-Schroeder; certificado, nonces y un finished es TLS.
4. **Responda (a) en dos oraciones**: el tipo con sus tres adjetivos, y qué construye: una clave de sesión entre quiénes y con qué garantías (fresca, confirmada por ambos, con las partes autenticadas).
5. **Responda (b) campo por campo**: servicio (frescura, autenticación de origen, confidencialidad, atadura a una identidad), quién lo verifica y con qué, y qué pasaría sin ese campo.
6. **Responda (c) desde lo que el atacante no tiene**: diga si es pasivo o activo, liste lo que no conoce y aplique las tres preguntas. Si hay ataque, escríbalo como secuencia de mensajes; si no lo hay, diga qué mensaje lo detendría y por qué el atacante no puede fabricarlo.
7. **Cierre con la corrección conocida**: timestamp dentro del ticket (Denning-Sacco); firma o certificado sobre $g^x$ y $g^y$; derivar la clave de sesión del secreto y de los nonces en vez de usar una clave de largo plazo.

## Plantilla de respuesta

**a)** Es un protocolo de intercambio de claves por <acuerdo / transporte / derivación>, con autenticación <mutua / unilateral de $S$ / sin autenticación>, apoyado en <claves simétricas compartidas de antemano / un tercero de confianza $T$ / certificados / nada>; <es Diffie-Hellman / es Needham-Schroeder / es un protocolo tipo TLS>. Intenta construir <una clave de sesión $W$> entre <$A$ y $B$>, de modo que <sea nueva en cada ejecución, que ninguno la transmita y que cada parte sepa con quién la comparte>.

**b)** El mensaje <1.2> le permite a <$A$>: <verificar que la respuesta es fresca, porque trae el nonce $r_A$ que ella misma eligió en 1.1>, y <autenticar a $B$, porque solo quien tiene $K$ puede producir $h_K(\ldots)$, y $A$ lo recomputa sobre los campos en claro>. El campo <$B$ dentro del cifrado> <ata la clave a la identidad de $B$: sin él, un atacante podría hacer que $A$ use $k$ con otro>. El mensaje <1.3> le permite a <$B$> lo simétrico.

**c)** <No / Sí> es susceptible a <MitM / replay>. El atacante <no tiene $K$ ni $K'$ / puede reescribir los mensajes pero no tiene la clave privada de $S$ / tiene una clave de sesión vieja $k$ y el mensaje 1.3 grabado>.
Si resiste: <no puede fabricar $h_K(\ldots)$ para el nonce fresco; no puede sustituir ningún valor sin invalidar el MAC; cada mensaje lleva un nonce que su destinatario eligió>.
Si hay ataque: (1) graba <mensaje>; (2) reenvía <mensaje> a <$B$>; (3) <$B$> no tiene con qué distinguirlo de uno nuevo y responde <desafío>; (4) el atacante <responde con $k$> y logra <suplantar a $A$>.
Corrección: <timestamp dentro del ticket (Denning-Sacco) / firmar $g^x$ y $g^y$ con certificados / derivar la clave de sesión del secreto y de los nonces>.

## Trampas

- **Responder «es un intercambio de claves» y nada más.** Falta qué construye, entre quiénes, si autentica y a quién, y sobre qué confianza previa. Los tres adjetivos valen puntos.
- **Confundir autenticación con frescura.** Un MAC o una firma prueban quién produjo el mensaje y que llegó íntegro, nunca cuándo: un mensaje autenticado se puede repetir. La frescura la da un nonce o un timestamp, y solo protege a quien lo eligió o lo verifica.
- **Decir que el ataque «rompe el cifrado».** Ni el MitM ni el replay rompen una primitiva: explotan una identidad que nadie verificó o un mensaje sin frescura. Escríbalo así.
- **Dar por seguro a Diffie-Hellman.** Solo resiste adversarios pasivos. Ante «¿qué problema tiene?» la respuesta es el MitM por falta de autenticación, con la secuencia de sustitución de $h_1$ y $h_2$.
- **Decir que el timestamp elimina el replay.** Lo acota a la ventana $\Delta t$ y exige relojes sincronizados; dentro de la ventana el ataque sigue.
- **Elegir exponentes que degeneran el ejemplo numérico.** Verifique que $g$ es raíz primitiva con $q$ primo, y que $h_1, h_2 \neq 1$; si no, la clave sale $1$.
- **Usar la clave del certificado para cifrar tráfico.** Esa clave es asimétrica, de largo plazo y la misma para todos: autentica y transporta el secreto; la clave de sesión se deriva y es simétrica.
- **Pasar por alto el nombre dentro del cifrado.** Sin él, el receptor no sabe con quién comparte la clave y un atacante puede hacérsela usar con la parte equivocada.
- **Contestar (c) con un adjetivo.** «Es vulnerable a replay» sin la secuencia de mensajes no alcanza: qué grabó el atacante, qué reenvía, por qué la víctima no lo distingue y qué obtiene.

## Para profundizar

- [[1p-protocolos-en-parciales-viejos|Protocolos en los parciales viejos]] — los ejercicios de este tipo que ya se tomaron, con enunciado completo, respuesta modelo y tips.
- [[primer-parcial|Primer parcial]] — el hub de la sección, con la tabla de los siete tipos y el orden sugerido.
- [[parciales-viejos|Parciales viejos]] — los cuatro exámenes con la resolución verificada.
- [[intercambio-de-claves|Intercambio de claves]] — la definición formal, el experimento KE y el adversario pasivo.
- [[distribucion-de-claves-y-kdc|Distribución de claves y KDC]] — por qué un KDC, la clave de sesión y el único punto de falla.
- [[diffie-hellman|Diffie-Hellman]] — el protocolo, el logaritmo discreto, DDH y el MitM paso a paso.
- [[needham-schroeder|Needham-Schroeder]] — el protocolo y el ataque con una clave de sesión vieja.
- [[denning-sacco-y-frescura|Denning-Sacco y frescura]] — el timestamp dentro del ticket y lo que cuesta.
- [[ataques-activos-y-man-in-the-middle|Ataques activos y man in the middle]] — los cuatro poderes del atacante activo y la sustitución de clave pública.
- [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]] — por qué un MAC no impide el replay; números de secuencia y timestamps.
- [[certificados-digitales|Certificados digitales]] — qué contiene un certificado y las cuatro verificaciones.
- [[tls-handshake|TLS handshake]] — las cuatro partes, el Finished y la derivación de la clave maestra.
- [[firma-digital|Firma digital]] — MAC contra firma: verificación pública y no repudio.
- [[message-authentication-code|Message authentication code]] — qué garantiza un MAC y qué no.
- [[clase-05-protocolos-criptograficos|Clase 05 — Protocolos criptográficos]] — la clase que reúne todo lo anterior.
