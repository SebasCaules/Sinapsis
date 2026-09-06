---
tipo: quiz
titulo: Quiz integrador
id: quiz-integrador
descripcion: 'Preguntas que cruzan los dos bloques, en la clave del final: qué propiedad falta y con qué primitiva se consigue.'
---

## Una base de sueldos cifrada con un criptosistema de flujo CPA-Secure, con el legajo en claro, deja que un empleado con acceso de escritura cambie tres bytes del criptograma y se aumente el sueldo al valor que él elige. ¿Qué propiedad falta y con qué se consigue? {#quiz-integrador:sueldos-que-propiedad-falta}
> pagina: maleabilidad

- [ ] Falta confidencialidad: el criptosistema de flujo filtra el texto plano, y se resuelve reemplazándolo por uno de bloque, que no tiene esta debilidad.
- [x] Falta integridad: ninguna de las pruebas de la Clase 2 mide modificación, y hace falta una primitiva nueva, el MAC.
- [ ] Falta frescura: el ataque consiste en reinyectar un criptograma emitido antes, y se corta con un número de secuencia.
- [ ] Falta que el cifrado sea probabilístico: alcanza con sortear un $IV$ nuevo en cada escritura de la fila.

> Nada de lo que pasó fue una falla de confidencialidad: ningún criptograma reveló información, y el adversario nunca vio $m$. Lo que faltó es la capacidad de **detectar que alguien escribió encima**, que es otro servicio de seguridad. `Eav`, `Mul` y `CPA` terminan con el adversario emitiendo un bit: miden qué puede *leer*, no qué puede *escribir*, así que el ataque las atraviesa sin despeinarse. De ahí sale la cadena de la clase: hace falta una prueba que lo vea (`CCA`), ningún criptosistema solo la pasa, y por eso aparece el MAC. Las otras opciones fallan por motivos concretos: los criptosistemas de bloque **también** pueden ser maleables, sólo que es más difícil de explotar; el $IV$ ya está en el esquema y el ataque sobrevive igual, porque el diferencial inyectado atraviesa el descifrado sin importar cómo se sembró el generador; y no hay repetición de nada, el criptograma adulterado es nuevo.

## Un sistema autentica sus mensajes con un MAC bajo una clave compartida entre emisor y receptor. Ahora se necesita que el receptor pueda demostrarle a un auditor externo que cierto mensaje lo produjo el emisor. ¿Qué propiedad falta? {#quiz-integrador:mac-ante-un-tercero}
> pagina: message-authentication-code

- [ ] Falta integridad de datos, que un MAC no cubre: hay que agregar una función de hash sobre el mensaje antes de etiquetarlo.
- [ ] Falta autenticación de origen, que un MAC no da: se obtiene aumentando el tamaño de la etiqueta hasta $256$ bits.
- [x] Falta no repudio, y no es cuestión de construir un MAC mejor: hace falta una firma digital, porque sólo con claves asimétricas quien verifica no pudo haber fabricado la prueba.
- [ ] Falta confidencialidad frente al auditor: se resuelve cifrando la etiqueta antes de transmitirla junto al mensaje.

> Un MAC da **integridad** (el mensaje no cambió) y **autenticación de origen** (lo produjo quien comparte la clave), así que las dos primeras opciones describen propiedades que el MAC ya entrega. Lo que no puede dar es **no repudio**: si Bob verifica $\mathsf{Vrfy}_k(m,t)=1$, sabe que alguien que conoce $k$ produjo la etiqueta, pero Bob también conoce $k$ y podría haberla fabricado él mismo; el tercero no tiene forma de distinguir los dos casos. Peor todavía si la clave la comparten $n$ partes: la etiqueta válida no identifica a cuál. La limitación es **de definición, no de implementación** —es la simetría de la clave—, así que ninguna etiqueta más larga la arregla. Lo que sí lo da es la firma digital, y por la razón exacta que falta acá: se firma con una clave privada que nadie más tiene y se verifica con la pública.

## Un canal usa cifrado autenticado con claves independientes y el adversario, sin modificar un solo bit, reenvía diez veces la orden de transferencia. En el experimento `Mac-Forge` ese adversario tiene ventaja exactamente cero. ¿Qué falta y quién lo aporta? {#quiz-integrador:replay-que-falta}
> pagina: ataques-de-repeticion-y-frescura

- [x] Falta frescura, y la aporta el protocolo: se autentica $\mathrm{ctr}\Vert m$ o $T\Vert m$, con el contador o el timestamp adentro del `Mac`.
- [ ] Falta integridad, y se recupera cambiando el MAC por uno cuyo `Vrfy` lleve estado y recuerde los pares ya vistos.
- [ ] Falta autenticación de origen, y se consigue firmando digitalmente el mensaje en lugar de etiquetarlo.
- [ ] Falta un MAC con etiquetas únicas: con ellas, una segunda presentación del mismo par se rechaza.

> El replay cumple la condición (1) del experimento —la etiqueta verifica, claro que sí— y **falla la (2) por construcción**, porque el mensaje reenviado es exactamente uno que ya estaba en $Q$. O sea que pierde `Mac-Forge` con probabilidad $1$ y aun así puede vaciar una cuenta. La vulnerabilidad no es de ninguna construcción: está en la definición, y la cumplen por igual todos los esquemas seguros, incluso un MAC ideal. La razón técnica es que `Vrfy` **no tiene estado** —y no lo tiene a propósito, porque si un mensaje repetido vale o no depende de la aplicación—. El mensaje reenviado además está íntegro y su origen es legítimo, así que ni la integridad ni la autenticación de origen fallaron; por eso la firma digital tampoco resuelve el replay: acredita quién firmó, no cuándo. Lo que se agrega es un valor que no se repite, y tiene que entrar **adentro** de la etiqueta: si el contador o la hora viajaran por fuera, el adversario los cambiaría a gusto.

## Un diseño calcula $c\leftarrow\mathsf{Enc}_{k_1}(m)$ y $t\leftarrow\mathsf{Mac}_{k_2}(m)$ y transmite $\langle c,t\rangle$, con los dos componentes demostrablemente seguros por separado y con claves independientes. ¿Qué garantía se pierde? {#quiz-integrador:encrypt-and-mac-que-se-pierde}
> pagina: privacidad-e-integridad

- [ ] La integridad: la etiqueta viaja en claro, así que el adversario puede reemplazarla por otra de su elección.
- [x] La confidencialidad: como los MAC que se usan son determinísticos, dos etiquetas iguales delatan dos mensajes iguales, y el esquema compuesto no es CPA-Secure.
- [ ] Ninguna, mientras las claves sean independientes; el esquema sólo se cae si se usa $k_1=k_2$.
- [ ] La CCA-seguridad, por el oráculo de padding: hay que descifrar y quitar el relleno antes de poder verificar la etiqueta.

> `Encrypt-and-MAC` es, en realidad, no combinar nada: aplica las dos funciones en paralelo y manda las dos salidas. La etiqueta se calcula **sobre el texto plano** y viaja en claro, y la definición de MAC no pide en ningún lado que $t$ oculte $m$ —un MAC podría publicar el primer bit del mensaje pegado a la etiqueta y seguir siendo infalsificable—. No hace falta un contraejemplo artificial: `CBC-MAC` y `HMAC` son determinísticos, así que el adversario consulta el oráculo con $m_0$, pide el desafío entre $m_0$ y $m_1$, y responde comparando etiquetas; acierta con probabilidad $1-\mathsf{negl}(n)$ con una sola consulta. Lo que se pierde es lo que ya se tenía: la integridad de esta combinación está perfectamente bien. La opción del padding describe el modo de falla de la **segunda** forma, `MAC-then-Encrypt`, no de ésta; y la independencia de claves, que acá se da por cumplida, no salva nada.

## Dos partes ejecutan Diffie-Hellman sobre un grupo donde vale `DDH`, y un atacante que además de escuchar puede reescribir los mensajes queda con dos claves de sesión válidas, una con cada extremo. ¿Qué falta y con qué se consigue? {#quiz-integrador:dh-atacante-activo}
> pagina: diffie-hellman

- [ ] Falta que el logaritmo discreto sea difícil: se consigue agrandando $q$ hasta que la búsqueda del exponente sea impracticable.
- [ ] Falta la conjetura `DDH`: con ella, el atacante no podría distinguir $g^{xy}$ de un elemento aleatorio del grupo y el ataque no cerraría.
- [x] Falta autenticar el canal: hay que atar $h_1$ y $h_2$ a quien los envió, con firmas digitales, porque el ataque no resuelve ningún problema difícil.
- [ ] Falta frescura: el atacante reinyecta un $h_1$ de una ejecución anterior, y alcanza con que cada parte agregue un nonce propio.

> El punto del ataque es que **no rompe nada**: $M$ elige sus propios $x_M$ e $y_M$, entrega $g^{x_M}$ a $B$ y $g^{y_M}$ a $A$, y termina compartiendo $g^{x\cdot y_M}$ con $A$ y $g^{x_M\cdot y}$ con $B$, sin resolver el logaritmo discreto ni distinguir nada. Por eso agrandar $q$ o suponer `DDH` no ayuda: las dos son hipótesis sobre la dificultad de un cálculo, y el atacante no hace ningún cálculo difícil. Tampoco es un replay: los valores que $M$ inyecta son frescos y propios, no grabados. Lo que falta es que el receptor pueda verificar **quién** envió cada $h$, de modo que sustituirlos deje evidencia; ésa es exactamente la motivación con la que la clase introduce después la firma digital. Conviene recordar además la precisión sobre la filmina: el logaritmo discreto no es `NP`-difícil, lo correcto es decir que no se conoce algoritmo eficiente para resolverlo.

## Un despliegue de dispositivos chicos usa `AES-GCM`; los equipos se reinician con frecuencia y pierden el contador con el que derivan el nonce, así que algunos nonces se repiten bajo la misma clave. ¿Cuál es la consecuencia? {#quiz-integrador:gcm-nonce-repetido}
> pagina: ccm-y-gcm

- [ ] Se pierde la confidencialidad de los mensajes que compartieron nonce, y nada más: la etiqueta sigue siendo infalsificable.
- [ ] Ninguna: la prueba específica de `GCM` es justamente la que habilita usar una sola clave con nonces arbitrarios.
- [ ] Se pierde la integridad de esos mensajes puntuales, pero el resto de lo autenticado bajo esa clave queda a salvo.
- [x] Además de repetirse el keystream, se repite la máscara $E_K(\texttt{Counter }0)$; como `GHASH` es lineal se despeja $H$ y se falsifica cualquier etiqueta bajo esa clave.

> Repetir el nonce hace **dos** cosas a la vez. La primera es el ataque clásico del modo counter: dos criptogramas xoreados dan el xor de los textos planos. La segunda es la grave: `GHASH` es una función lineal sobre $\mathrm{GF}(2^{128})$ y lo único que la convierte en autenticador es el enmascarado final; con dos etiquetas bajo la misma máscara ésta se cancela y queda una ecuación polinómica cuya única incógnita es $H$, que además vale **para siempre bajo esa clave**. Ésa es la diferencia de gravedad con `CCM`, donde un nonce repetido cuesta la confidencialidad de esos mensajes y no más. La prueba específica de `GCM` es la que autoriza una sola clave, pero justamente **bajo la condición de que el nonce no se repita**: no la levanta. Es también la razón por la que un diseño que no puede garantizar nonces únicos está mejor con `CCM`.

## Alguien recibe un mensaje con formato de certificado que afirma que cierta clave pública pertenece a $B$, con `CN`, fecha de emisión, intervalo de validez y tipo de uso. De las cuatro verificaciones que la clase enumera, ¿cuál es la que convierte a las otras tres en afirmaciones verificables? {#quiz-integrador:certificado-que-lo-sostiene}
> pagina: certificados-digitales

- [ ] Comparar el `CN` contra el hostname, la dirección de email o la razón social de la entidad con la que se quiere hablar.
- [x] Validar la firma digital de la autoridad certificante: sin esa comprobación, todo lo demás es una afirmación no verificada.
- [ ] Comprobar que la fecha de vigencia no expiró y que el tipo de uso permitido coincide con lo que se necesita.
- [ ] Obtener del propio certificado la clave pública de $B$, junto con el tipo de clave, por ejemplo `RSA-2048`.

> Un certificado es, ante todo, un **mensaje**: una estructura de datos con campos. Lo que separa un certificado de una declaración autoproclamada es que está **firmado por una autoridad competente**, y es esa firma la que convierte "alguien dice que esta clave es de $B$" en una afirmación verificable. Las otras tres operaciones son reales y hay que hacerlas —identidad por `CN`, vigencia y tipo de uso permitido, y obtener la clave pública con su tipo—, pero se apoyan sobre campos que cualquiera podría escribir: sin validar la firma, nada impide fabricar un mensaje con el formato correcto y una clave pública cualquiera. Y ahí se abre la pregunta que reinicia el problema una capa más arriba: validar una firma digital requiere, a su vez, una clave pública, la de la autoridad — que es de donde salen las cadenas de firmas y las autoridades raíz.

## Un sistema implementa Bell-LaPadula pero sólo aplica la condición de seguridad simple, $L(O)\le L(S)$ para leer. ¿Qué se puede hacer que la condición de cierre habría impedido? {#quiz-integrador:blp-sin-condicion-de-cierre}
> pagina: bell-lapadula

- [ ] Un sujeto $\mathsf{Confidential}$ puede leer un objeto $\mathsf{Top\ Secret}$, porque nada restringe la lectura hacia arriba.
- [ ] Dos proyectos aislados dejan de estar aislados entre sí, porque los niveles están totalmente ordenados y el superior domina a los dos.
- [x] Un sujeto $\mathsf{Top\ Secret}$ lee un objeto $\mathsf{Secret}$ —cosa que la condición simple permite— y después lo escribe en un objeto $\mathsf{Public}$, filtrando el contenido a cualquier lector de nivel bajo.
- [ ] Un objeto puede cambiar de nivel después de creado, invalidando retroactivamente los accesos que ya ocurrieron.

> La condición simple impide sólo la **lectura directa** hacia arriba, así que la primera opción describe justamente lo que sí sigue prohibido. La condición de cierre, $L(S)\le L(O)$ para escribir, existe para bloquear los **caminos indirectos**: un canal de escritura que elude por completo la restricción de lectura. Es la exigencia de "ni siquiera por vías indirectas" de la definición de confidencialidad, aplicada a este modelo. Las dos opciones restantes son problemas reales de Bell-LaPadula, pero otros: la falta de aislación entre proyectos es lo que resuelven las **categorías y compartimentos**, con una relación de dominancia que es un orden parcial; y el cambio de nivel de una entidad ya creada es lo que prohíbe el **principio de tranquilidad**, porque invalida garantías que las transiciones pasadas ya dieron por sentadas.

## Se quiere proteger integridad en un ambiente comercial y alguien propone reusar Bell-LaPadula tal cual, cambiando la palabra "seguridad" por "integridad" en las etiquetas. ¿Qué corresponde responder? {#quiz-integrador:biba-no-es-blp-renombrado}
> pagina: modelos-de-integridad-de-biba

- [ ] Es correcto: Bell-LaPadula ya protege las dos cosas, porque la condición de cierre impide escribir hacia abajo y eso es exactamente no degradar.
- [ ] Alcanza con aplicar las mismas dos reglas sobre niveles de integridad, porque la maquinaria de niveles y dominancia es idéntica.
- [ ] Hay que abandonar los niveles: las políticas de integridad no se describen con niveles sino sólo con listas de control de acceso.
- [x] `Strict Integrity` invierte las dos condiciones —no leer hacia abajo, no escribir hacia arriba—, porque los niveles de seguridad limitan el flujo y los de integridad limitan la modificación.

> La maquinaria formal es la misma —conjuntos $S$, $O$, niveles, una relación de dominancia y una función $i$ que etiqueta—, y por eso la segunda opción es la tentadora. Pero las reglas van al revés, y la razón es de fondo: en Bell-LaPadula lo que se protege es que **el secreto no baje**; en Biba, que **la basura no suba**. Leer algo de menor integridad contamina el conocimiento del sujeto, y escribir algo de mayor integridad con datos poco confiables degrada ese objeto. De ahí $i(s)\le i(o)$ para leer e $i(o)\le i(s)$ para escribir. Los tres modelos de la familia comparten la regla de escritura y se distinguen sólo por qué hacen con la lectura: `Low-Water-Mark` la permite pero degrada al lector, `Ring Policy` la permite gratis, `Strict Integrity` la restringe. Y modelar los requerimientos comerciales —separación de trabajo, auditoría, administración descentralizada— con Bell-LaPadula sería, según la propia clase, muy complicado, por la cantidad de niveles y categorías que haría falta administrar de forma centralizada.

## Un backup verificado y correcto queda en un disco que no arranca; en otro servicio, un ataque de denegación deja el sitio caído sin leer ni alterar un solo dato. ¿Cómo se clasifican los dos casos? {#quiz-integrador:cid-tres-ejes}
> pagina: confidencialidad-integridad-y-disponibilidad

- [ ] Los dos son fallas de integridad, porque en ambos casos el recurso deja de ser confiable para quien lo necesita.
- [x] Los dos violan disponibilidad y ninguno toca las otras dos: son tres ejes independientes, no una escala de "más seguro".
- [ ] El primero no es un problema de seguridad: el dato sigue íntegro y confidencial, sólo cambió su ubicación.
- [ ] Sólo el segundo cuenta como problema de seguridad; que un backup no se pueda leer es un problema operativo, no de política.

> Las tres definiciones comparten la forma pero se distinguen por el cuantificador y la relación: confidencialidad pide que **ningún** miembro de $X$ obtenga información de $I$; integridad, que **todo** miembro confíe en $I$; disponibilidad, que **todo** miembro pueda acceder a $I$ cuando lo requiere. Integridad y disponibilidad comparten el cuantificador pero no la relación, y confundir "todos confían" con "todos pueden acceder" es el error más común de los tres: un backup correcto en un disco que no arranca es íntegro y no disponible, y un servidor que responde siempre con datos corruptos es disponible y no íntegro. Un ataque de denegación no lee nada confidencial ni modifica nada íntegro: apaga el acceso, y eso alcanza para violar la política. Un sistema apagado no puede violar confidencialidad ni integridad, pero sí viola disponibilidad, y eso también cuenta.

## Un sistema pasa de listas de control de acceso a capacidades: ahora cada sujeto **porta** el par $(o, r)$ y lo presenta al acceder. ¿Qué amenaza nueva aparece respecto de un ACL, y con qué se la cubre? {#quiz-integrador:capacidades-amenaza-nueva}
> pagina: listas-de-capacidades

- [ ] Que la revocación llegue tarde; se cubre calculando una función de hash sobre la lista de capacidades de cada sujeto y comparándola en cada acceso.
- [ ] Que la capacidad revele qué objetos existen; se cubre cifrando el identificador del objeto con una clave de sesión distinta por sujeto.
- [x] Que el sujeto altere una capacidad o cree capacidades que el sistema nunca emitió; se cubre adjuntando $t=\mathsf{Mac}_k(o\Vert r)$ con una clave que sólo conoce el sistema, y verificándola al presentarla.
- [ ] Que dos sujetos distintos presenten la misma capacidad; se cubre exigiendo una firma digital del sujeto sobre el par que porta.

> La diferencia de fondo con un ACL no es de simetría: un ACL vive protegido junto al objeto y sólo el dueño lo modifica, mientras que una capacidad es algo que el sujeto tiene en la mano, y **quien la tiene, tiene el acceso**. De ahí las dos amenazas que un ACL no tiene: alterarla —por ejemplo extendiendo $r$— y fabricarla de cero. El MAC las cierra las dos con la misma garantía de infalsificabilidad: modificar $r$ sin conocer $k$ invalida $t$, y crear una capacidad nueva exige forjar una etiqueta válida sobre un $(o,r)$ elegido por el atacante. Las otras opciones nombran problemas reales pero con el remedio equivocado: la revocación se resuelve por **indirección** —la capacidad es un índice a una tabla invisible para los procesos, y revocar es invalidar la entrada—, y el control de copia, por acceso indirecto o copia mediada por el sistema; que dos sujetos presenten la misma capacidad es, de hecho, parte de cómo funciona el modelo.

## Un archivo de contraseñas ya guarda una sal distinta por cuenta y aun así un atacante con hardware dedicado ataca una cuenta concreta. Se decide derivar el valor almacenado con `PBKDF2` y $c=100\,000$ iteraciones. ¿Qué cambia exactamente? {#quiz-integrador:pbkdf2-que-cambia}
> pagina: pbkdf2

- [ ] Sube $N$, el tamaño del espacio de claves, y por eso baja la probabilidad de éxito del ataque.
- [ ] Elimina la ventaja del atacante con GPUs, porque cada $u_i$ depende de la anterior y la cadena no se puede paralelizar.
- [x] Baja $G$, las pruebas por segundo, a $G/c$: ni $N$ ni la seguridad de la función pseudoaleatoria iterada cambian, sólo el costo de un intento.
- [ ] Reemplaza a la sal: con $c$ iteraciones encadenadas ya no hace falta un valor distinto por cuenta.

> Iterar no toca la seguridad de la $\mathrm{PRF}$: sigue siendo la misma función con las mismas garantías. Lo que cambia es el **costo por intento**, que es exactamente el $G$ de la fórmula de Anderson, $P \ge T\cdot G/N$, con $G_{\mathrm{PBKDF2}} = G/c$. Con los parámetros del ejemplo de la clase, $N=10^{10}$ y $G=10^{4}$, la probabilidad de éxito en el mismo tiempo cae de $0{,}5$ a $5\times 10^{-6}$, y alcanzar la $P=0{,}5$ anterior pasa a exigir unos $1585$ años. Ningún otro número se movió. La opción de las GPUs es el error tentador y es justamente la **limitación** de `PBKDF2`: la cadena es secuencial para una candidata, pero cada evaluación es barata en memoria, así que el atacante corre miles de candidatas en paralelo, una por núcleo, casi sin fricción — por eso `scrypt` y `Argon2` agregan costo de memoria. Y la sal no se reemplaza: es la entrada $S$ de la construcción, y ataca otro factor, la amortización entre víctimas.

## En la segunda aproximación de Needham-Schroeder, con el nonce $r_1$ que $A$ elige, se filtra una clave de sesión $k_s$ vieja, de una conversación que terminó hace meses. ¿Qué puede hacer el atacante? {#quiz-integrador:needham-schroeder-clave-vieja}
> pagina: needham-schroeder

- [ ] Nada: el nonce $r_1$ ata cada respuesta del KDC a su ejecución, y $B$ detecta que la clave no es la que corresponde.
- [ ] Necesita además comprometer al KDC, porque el mensaje que le entrega a $B$ la clave de sesión lo emite el KDC.
- [x] Reenviar $\{A\Vert k_s\}_{k_b}$ y responder el desafío de $B$: el nonce protege a $A$ contra la repetición del mensaje 2, pero $B$ nunca eligió un valor propio antes de recibir el mensaje 3.
- [ ] Impersonar a $A$ una sola vez: después del primer uso $B$ marca esa clave de sesión como consumida y la rechaza.

> El ataque arranca directamente en el **tercer** mensaje y no toca al KDC en absoluto: $\{A\Vert k_s\}_{k_b}$ sigue siendo un criptograma perfectamente válido bajo $k_b$, y nada lo hace caducar por su cuenta. $B$ lo descifra, obtiene $A$ y $k_s$, y **no tiene ningún dato** con el que distinguir una clave recién generada de una de hace un mes; manda su desafío $\{r_2\}_{k_s}$, que el atacante puede descifrar porque conoce justamente esa clave, y responde $\{r_2-1\}_{k_s}$. La asimetría es exacta: hay frescura para un extremo del protocolo y no para el otro. Y la consecuencia es peor que "una sesión expuesta": cualquier clave de sesión pasada que se filtre queda como llave de impersonación válida contra $B$ para siempre. El arreglo es la modificación Denning-Sacco, que mete un timestamp adentro del ticket para que $B$ pueda juzgar la frescura de $k_s$.

## Un atacante activo intercepta el `ClientHello` y el `ServerHello` y los reescribe para que ambos anuncien una versión de TLS más vieja, con algoritmos más débiles, aunque las dos partes soportaban una mejor. ¿Qué elemento del handshake lo detecta? {#quiz-integrador:tls-downgrade}
> pagina: tls-handshake

- [ ] El `ServerKeyExchange`, porque va firmado con la clave privada del servidor y el atacante no puede producir esa firma.
- [ ] El `ChangeCipherSpec`, que señala el momento a partir del cual cada lado empieza a usar los parámetros negociados.
- [ ] El certificado del servidor, cuyo campo de tipo de uso declara la versión mínima de TLS que la clave admite.
- [x] El `ClientKeyExchange`, que repite $V$ —la versión que el cliente informó originalmente— cifrada con la clave pública del servidor, para que el servidor la compare contra la versión que quedó negociada.

> Los mensajes de la Parte 1 no están cifrados ni autenticados: es la primera vez que las dos partes se hablan, así que no hay con qué protegerlos, y por eso son reescribibles. La defensa consiste en hacer viajar la versión original del cliente por un canal que el atacante **no** puede tocar: el `ClientKeyExchange` va cifrado con la clave pública del servidor, y al descifrarlo el servidor compara ese $V$ contra la versión efectivamente negociada; si no coinciden, aborta. Conviene tener presente la trampa de notación: $\{\cdot\}_{K_s}$ es una **firma con la clave privada** en la Parte 2 y un **cifrado con la clave pública** en la Parte 3. El `ServerKeyExchange` firma $\mathrm{hash}(r_1\Vert r_2\Vert p)$, lo que ata esa firma a esta ejecución concreta y evita reproducir una vieja, pero no dice nada sobre la versión; y el `ChangeCipherSpec` es un mensaje vacío de señalización, sin contenido que comparar.

## En la DMZ hay un servidor web publicado en el puerto 80 y un firewall con estado en el perímetro. Se pide bloquear las peticiones HTTP que intentan recorrer directorios, del tipo `GET /../../etc/passwd`. ¿Alcanza con lo que hay? {#quiz-integrador:firewall-que-tipo-hace-falta}
> pagina: firewalls

- [ ] Sí: una regla con `-m state --state NEW,ESTABLISHED` distingue la petición maliciosa de una conexión legítima ya establecida.
- [ ] Sí, con un filtro de paquetes simple, si se cierra el puerto 80 en el firewall externo para los orígenes desconocidos.
- [x] No alcanza ningún filtro de paquetes, con estado o sin él: la diferencia está en el contenido de la petición, y verlo exige un application firewall, específico del protocolo.
- [ ] Sí: alcanza con reglas sobre los flags `Syn` y `Rst`, porque el ataque se distingue en el establecimiento de la conexión.

> Los tres tipos de firewall se ordenan por **cuánto del paquete miran**. Un packet filter controla sentido, host y puerto origen y destino, flags y protocolo de transporte: con una regla como `src:*:* dst:www.ss.com:80 allow` no puede distinguir un `GET /index.html` legítimo de la petición maliciosa, porque los dos tienen los mismos encabezados de interés y el contenido es justamente lo que no mira. El filtro con estado agrega saber si una conexión es nueva, existente o inválida, y manipular paquetes con `NAT`, pero sigue sin entender el protocolo de aplicación. Un application firewall —proxy o `WAF`— sí lo entiende: reconstruye el mensaje completo y decide si pasa, se descarta o se modifica. El precio es la especificidad: un proxy de email no sirve para filtrar tráfico web. Y cerrar el puerto 80 no es una respuesta: deja de publicar el servicio que se quería publicar.
