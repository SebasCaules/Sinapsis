---
tipo: flashcards
titulo: Autenticación
id: autenticacion
division: "7"
descripcion: Factores, almacenamiento de claves, salting, PBKDF2, challenge-response y SSO.
---

## ¿Qué significa exactamente "autenticar", y qué distingue a una identidad de un principal? {#autenticacion:identidad-contra-principal}
> pagina: autenticacion

Autenticar es **asociar una identidad a un principal**.

- La **identidad** vive fuera del sistema y el sistema no la controla: no puede impedir que dos entidades se llamen igual ni verificar por sí solo que una sea quien dice ser.
- El **principal** es la representación interna, creada y administrada por el propio sistema, sobre la que operan sus reglas de control de acceso.

La autenticación produce el principal; el control de acceso es lo que se hace con él después.

## Enuncie los cinco componentes del modelo formal de autenticación, con el tipo de cada uno {#autenticacion:modelo-a-c-f-l-s}
> pagina: autenticacion

$$
\begin{aligned}
A &= \{a\} &&\text{información de autenticación} \\
C &= \{c\} &&\text{información complementaria} \\
F &= \{\,F : A \to C\,\} &&\text{funciones de complementación} \\
L &= \{\,L : A \times C \to \{0,1\}\,\} &&\text{funciones de autenticación} \\
S &= \{s\} &&\text{funciones de selección}
\end{aligned}
$$

$A$ lo aporta la entidad externa al autenticarse; $C$ lo guarda el sistema de antemano; $F$ se aplica típicamente al dar de alta la entidad; $L$ corre en cada intento de autenticación; $S$ crea y actualiza $A$ y $C$ (alta, baja y cambio).

## Enumere los cuatro factores de autenticación y la debilidad estructural de cada uno {#autenticacion:cuatro-factores}
> pagina: factores-de-autenticacion

- **Algo que conozco** (clave, frase, pregunta secreta): depende de la confidencialidad del secreto y requiere almacenarlo de manera segura.
- **Algo que tengo** (smart card, token, celular, tarjeta de coordenadas): el elemento se puede copiar o clonar, y la información en tránsito se puede suplantar.
- **Algo que soy** (huella, retina, voz, cara): los métodos no son 100 % eficaces y se asume que el lector no puede ser manipulado.
- **Dónde estoy / contexto** (red, país, dispositivo, día y hora, *velocity*): funciona solo como refuerzo, nunca solo.

Ningún factor está libre de fallar por sí solo: de ahí que en la práctica se combinen.

## ¿Por qué el factor de contexto es cualitativamente distinto de los otros tres? {#autenticacion:factor-de-contexto}
> pagina: factores-de-autenticacion

Porque es el único que opera en **dos direcciones opuestas**:

- **Positivo**: refuerza la identidad reclamada (por ejemplo, un operador que solo se conecta desde la red privada del centro de cómputos).
- **Negativo**: reduce la confianza sin necesariamente romperla — un usuario que aparece conectándose desde otro país tiene *menos* chances de ser quien dice ser, no ninguna.

Por eso nunca funciona solo: solo suma o resta confianza sobre lo que otro factor ya estableció.

## Complete las cinco letras del modelo para el esquema Unix tradicional de `/etc/passwd` {#autenticacion:unix-tradicional}
> pagina: almacenamiento-de-claves

$$
A = \{\text{secuencias de hasta 8 caracteres}\}, \qquad C = \{\,\underbrace{xx}_{2}\,\underbrace{H\!\cdots\!H}_{11}\,\}
$$

- $xx$ (2 caracteres) identifica cuál de las **4096** funciones se usó; $H\cdots H$ (11 caracteres) es el resultado.
- $F = \{\text{4096 versiones modificadas de DES}\}$.
- $L = \{\texttt{login}, \texttt{su}, \texttt{sudo}, \ldots\}$, $S = \{\texttt{passwd}, \texttt{adduser}, \ldots\}$.

Las $xx$ son la sal del esquema: impiden que dos usuarios con la misma clave terminen con el mismo $C$.

## ¿Cuándo tiene sentido guardar las claves en un archivo cifrado, y qué problema arrastra? {#autenticacion:archivo-cifrado}
> pagina: almacenamiento-de-claves

Solo **si hace falta recuperar la clave original** — por ejemplo, para reenviarla a un tercer sistema que la necesita en claro. Para cualquier otro caso corresponde PBKDF2, que no guarda nada reversible.

El problema que arrastra es que cifrar el archivo requiere a su vez una clave de acceso, que puede vivir en cuatro lugares: un archivo de configuración, el propio ejecutable, pedida al usuario en cada arranque, o un dispositivo criptográfico especializado.

Guardar las claves en texto en claro es peor todavía: no puede garantizarse su confidencialidad.

## Escriba, con las letras del modelo, qué necesita encontrar un atacante para romper la autenticación {#autenticacion:objetivo-del-atacante}
> pagina: ataques-a-un-sistema-de-autenticacion

$$
a \in A \quad \text{tal que, para algún } f \in F,\quad f(a) = c \ \text{ y } \ c \text{ está asociado a una entidad}
$$

El sistema quiere identificar correctamente a las entidades; el atacante quiere ser identificado como una entidad que no es.

Lo que necesita reproducir **no es el $a$ original de la víctima**, sino cualquier $a$ que, pasado por $f$, produzca el mismo $c$. Contra una $f$ con colisiones fáciles de hallar, ni siquiera hace falta acertar la clave real.

## Distinga ataque offline de ataque online a un sistema de autenticación {#autenticacion:offline-contra-online}
> pagina: ataques-a-un-sistema-de-autenticacion

- **Offline**: se prueban varios $a$, se computa $f(a)$ y se compara contra $c$. Requiere haber conseguido $c$ (robar el archivo de hashes) y **no tiene límite de intentos**: solo lo limita el poder de cómputo. Ejemplos: `/etc/shadow` con `crack` o `john the ripper`, archivo `SAM` con `ophcrack`.
- **Online**: se intenta autenticar directamente vía $l(a) \in L$ contra el sistema real. Solo requiere llegar al login, pero cada intento se puede auditar, limitar o bloquear. Ejemplo: probar cuentas conocidas (`root`, `administrator`, `guest`).

La distinción organiza toda la prevención posterior: contra el offline no sirve limitar intentos.

## ¿Cuáles son las prevenciones generales de un sistema de autenticación, y contra qué atacante sirve cada grupo? {#autenticacion:prevenciones-generales}
> pagina: complejidad-y-espacio-de-claves

- **Esconder información**, para que $a$, $c$ y $f$ no queden conocidas todas a la vez. Con dos observaciones: $f$ suele conocerse igual (principio de Kerckhoffs), y es más fácil proteger $c$ que $a$, porque $a$ vive en manos de la entidad externa.
- **Limitar el uso de la función de autenticación**: tiempos crecientes ante fallas, deshabilitar principales, *jailing*/honeypot, `CAPTCHA`s.

Las cuatro medidas del segundo grupo son defensas **exclusivamente online**: contra un atacante que ya tiene $c$ no hacen nada. Contra él lo que sirve es subir la complejidad de las claves y el costo de calcular $f(a)$.

## Enuncie la fórmula de Anderson y el significado de cada variable {#autenticacion:formula-de-anderson}
> pagina: complejidad-y-espacio-de-claves

$$
P \ge \frac{T \cdot G}{N}
$$

- $P$: probabilidad de adivinar una clave.
- $T$: tiempo dedicado al ataque.
- $G$: cantidad de pruebas realizables por segundo.
- $N$: tamaño del espacio de claves.

El signo es $\ge$: da un **piso** del riesgo, no un techo. En la práctica se la usa despejando — fijado el $P$ tolerado, sale el $T$ o la $N$ requerida.

## Con la fórmula de Anderson, ¿qué longitud mínima de clave alfanumérica exige resistir un año de ataque a $10^5$ pruebas por segundo con $P<0{,}5$? {#autenticacion:longitud-minima-de-clave}
> pagina: complejidad-y-espacio-de-claves

Alfabeto de 36 caracteres, $T = 365\times24\times60\times60 = 31\,536\,000$ s:

$$
N \ge \frac{T\cdot G}{P} = \frac{31\,536\,000 \times 10^{5}}{0{,}5} = 6{,}3072\times 10^{12}
$$

$$
36^{L} \ge 6{,}3\times 10^{12} \;\Longrightarrow\; L \ge \log_{36}\!\left(6{,}3\times 10^{12}\right) \approx 8{,}22 \;\Longrightarrow\; L \ge 9
$$

Longitud mínima: **9 caracteres** alfanuméricos.

## Compare las tres alternativas de selección de claves y el costo de cada una {#autenticacion:seleccion-de-claves}
> pagina: politicas-de-seleccion-y-expiracion-de-claves

- **Aleatoria** (`fL3K&8%j`): cada clave es equiprobable, la condición ideal para la fórmula de Anderson; es difícil de memorizar.
- **Pronunciable** (`helgoret`, `mipoterjo`, `jusacila`): fácil de memorizar por fonemas encadenados, pero el **espacio de claves efectivo se reduce mucho** frente al nominal.
- **Elegida por el usuario**: máxima comodidad, pero las claves tienden a ser fáciles de adivinar — es la puerta de entrada al ataque de diccionario.

## ¿Qué tres requisitos exige la cátedra para que una política de expiración de claves no sea contraproducente? {#autenticacion:expiracion-de-claves}
> pagina: politicas-de-seleccion-y-expiracion-de-claves

Forzar el cambio limita el daño de una clave ya comprometida que todavía no se sabe comprometida, pero requiere:

1. **Evitar el reuso**: recordar y bloquear las $N$ últimas claves.
2. **Evitar cambios demasiado frecuentes**: sin un mínimo de tiempo entre cambios, el usuario esquiva el historial cambiando la clave $N$ veces seguidas para volver a la favorita.
3. **Dar tiempo para pensar la nueva clave**: avisar con anticipación, no forzar el cambio en el momento mismo del login.

## Escriba el método de salting y explique contra qué escenario protege {#autenticacion:salting-metodo}
> pagina: salting

$$
f(a) = x \,\Vert\, f'(a, x)
$$

Cada $c$ almacenado se calcula con una sal $x$ **distinta**, guardada en claro junto al digest porque la verificación la necesita.

El escenario que motiva la sal es el ataque offline **en lote**: con $c_1,\ldots,c_n$ y sin sal, cada candidato $a$ se evalúa una vez y se compara contra todos los $c_j$, de modo que el diccionario cuesta lo mismo con una cuenta o con un millón. Con sales distintas el atacante debe recalcular $f'(a,x_j)$ por cada sal: el costo pasa de una pasada del diccionario a $n$ pasadas.

## ¿Qué NO compra el salting? {#autenticacion:salting-limite}
> pagina: salting

**Nada contra un ataque dirigido a una sola cuenta.** La sal es pública: el atacante la lee del propio registro y ataca esa cuenta con el costo de siempre — la fórmula de Anderson no cambia cuando $n=1$.

La sal ataca la **amortización entre víctimas**, no la dificultad de romper una clave. Lo colateral que sí tapa: sin sal, dos usuarios con la misma clave comparten el mismo $c$, y eso delata qué cuentas comparten contraseña sin romper nada.

## Describa la construcción de PBKDF2 para un bloque de salida {#autenticacion:pbkdf2-construccion}
> pagina: pbkdf2

Dada la contraseña $\mathit{pass}$, la sal $S$ y una función pseudoaleatoria $\mathrm{PRF}$ (instanciable con un criptosistema simétrico o un MAC), se encadena la PRF sobre sí misma:

$$
u_1 = \mathrm{PRF}(\mathit{pass}, S), \qquad u_j = \mathrm{PRF}(\mathit{pass}, u_{j-1})
$$

$$
\text{Resultado: } u_1 \oplus u_2 \oplus \cdots \oplus u_j
$$

Ninguna $u_i$ intermedia se expone. Para claves más largas se concatenan bloques: $K = \mathrm{PBKDF2}(\mathrm{prf}, \mathit{pass}, \mathit{salt}, c, \mathit{len}) = T_1 \Vert T_2 \Vert \cdots \Vert T_j$, con $U_1 = \mathrm{PRF}(\mathit{pass}, \mathit{salt}\Vert j)$.

## ¿Cómo impacta PBKDF2 en la fórmula de Anderson, y qué no cambia? {#autenticacion:pbkdf2-costo-por-intento}
> pagina: pbkdf2

Iterar $c$ veces la PRF **no cambia la seguridad de la PRF**: cambia el costo por intento, que es exactamente el $G$ de Anderson.

$$
P \ge \frac{T \cdot G}{N}, \qquad G_{\mathrm{PBKDF2}} = \frac{G_{\text{sin KDF}}}{c}
$$

Con $N=10^{10}$, $G=10^4$ y $T=500\,000$ s se llegaba a $P=0{,}5$; con $c=100\,000$ iteraciones queda $G'=0{,}1$ y $P' = 5\times10^{-6}$ en el mismo tiempo. Lo que no resuelve: cada evaluación sigue siendo barata en memoria, así que el ataque se paraleliza en GPU o ASIC; `scrypt` y `Argon2` agregan costo de memoria.

## Describa el protocolo challenge-response y qué problema resuelve {#autenticacion:challenge-response-protocolo}
> pagina: challenge-response-y-eke

$$
A \xrightarrow{\ \{\text{pedido de autenticación}\}\ } B \qquad A \xleftarrow{\ \{r\}\ } B \qquad A \xrightarrow{\ f(k,r)\ } B
$$

$B$ envía un challenge $r$ que $A$ no podía predecir; $A$ responde $f(k,r)$ con la clave compartida $k$; $B$ recalcula y compara.

Resuelve las dos fallas de enviar la clave: ya no hace falta un canal seguro para transmitirla, y una comunicación vieja capturada no compromete la clave, porque el próximo $r$ será distinto. Requiere que $r$ sea fresco e impredecible, como un nonce.

## ¿Qué rendija deja el challenge-response en claro, y cómo la cierra EKE? {#autenticacion:eke}
> pagina: challenge-response-y-eke

Si $r$ y $f(k,r)$ viajan en claro, quien escucha se queda con ambos y puede probar candidatas $k'$ calculando $f(k',r)$ **en su propia máquina**: con una sola escucha, un mecanismo pensado para atacarse online se vuelve atacable **offline**, sin límite de intentos ni interacción con $A$ ni $B$.

EKE envuelve los tres mensajes en un canal cifrado con una clave de sesión $k_s$ independiente de $k$:

$$
A \xrightarrow{\ \{\text{pedido}\}\,k_s\ } B \qquad A \xleftarrow{\ \{r\}\,k_s\ } B \qquad A \xrightarrow{\ \{f(k,r)\}\,k_s\ } B
$$

No porque $f$ se vuelva más fuerte, sino porque el atacante pierde el material sobre el cual comparar.

## ¿Qué implica delegar la autenticación en un SSO, y qué tecnologías nombra la cátedra? {#autenticacion:sso-delegacion}
> pagina: autenticacion-remota-y-sso

*Single Sign-On* es la delegación de la autenticación en un sistema externo, e **implica necesariamente una relación de confianza**: quien delega renuncia a controlar quién es cada principal, y si el tercero falla o se compromete, todos los sistemas que confían en él heredan la falla a la vez.

- **Productos comerciales**, con tecnología propia y no intercambiable: *Active Directory Federation Services*, `CAS`, *Siteminder*.
- **Tecnologías abiertas**: OpenID 1 y 2, **obsoletas**; **OpenID Connect**, vigente y construido sobre `OAuth2`.

En el modelo $(A,C,F,L,S)$, SSO es mover el componente $L$ fuera del sistema que necesita el resultado.
