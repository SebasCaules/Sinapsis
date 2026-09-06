---
tipo: quiz
titulo: Quiz · Bloque 1, criptografía
id: quiz-bloque-1-criptografia
descripcion: Veinte preguntas sobre lo que entra en el primer parcial.
---

## ¿Qué hace falta dar para especificar un esquema de cifrado de clave privada? {#quiz-bloque-1-criptografia:especificar-un-criptosistema}
> pagina: criptosistema

- [ ] La fórmula de cifrado y la longitud de la clave
- [x] Los tres conjuntos $\mathcal{K}$, $\mathcal{M}$, $\mathcal{C}$ y los tres algoritmos $\mathsf{Gen}$, $\mathsf{Enc}$, $\mathsf{Dec}$
- [ ] Los tres algoritmos, más la distribución de probabilidad sobre el espacio de mensajes
- [ ] La fórmula de cifrado, la de descifrado y la demostración de que se cumple la corrección

> Un criptosistema es la terna $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ **junto con** los tres conjuntos; decir cómo elige la clave $\mathsf{Gen}$ —típicamente uniforme sobre $\mathcal{K}$— también es parte de la definición. Dar sólo la fórmula de cifrado es el error típico del Ejercicio 1 de la Guía 1. La distribución sobre $\mathcal{M}$ es la opción tentadora y está de más: los tres conjuntos alcanzan para **definir** el esquema, y las distribuciones se agregan recién cuando se quiere hablar de seguridad.

## Un proveedor afirma que su producto es seguro porque el algoritmo de cifrado es propietario y nadie de afuera lo conoce {#quiz-bloque-1-criptografia:seguridad-por-oscuridad}
> pagina: principio-de-kerckhoffs

¿Cómo se evalúa esa afirmación con el criterio de la materia?

- [ ] Es correcta mientras el espacio de claves sea además suficientemente grande
- [ ] Es correcta sólo frente a un adversario pasivo, porque uno activo puede sondear el sistema hasta deducir el algoritmo
- [x] Es inválida: el principio de Kerckhoffs exige que el sistema siga siendo seguro con todo público salvo la clave, y apoyarse en el secreto del algoritmo es seguridad por oscuridad
- [ ] Es correcta, porque mantener el algoritmo en secreto agranda de hecho el espacio de búsqueda del adversario

> Kerckhoffs (1883) manda regalarle al adversario el algoritmo, la implementación, los parámetros y los tres espacios; lo único que se asume protegido es $k$. El motivo es práctico además de metodológico: el algoritmo se filtra, se desensambla y cambiarlo es carísimo, mientras que rotar una clave es barato. La opción del espacio de claves confunde dos cosas distintas: un espacio grande es otra condición necesaria, y no arregla que la seguridad dependa del secreto del diseño.

## Un servidor descifra los mensajes que recibe y responde con un error distinto según si el padding es inválido o si el contenido no verifica {#quiz-bloque-1-criptografia:oraculo-de-padding-cca}
> pagina: modelos-de-ataque

¿En qué modelo de ataque queda un adversario que puede mandarle mensajes a ese servidor?

- [ ] Texto cifrado solo (COA), porque el adversario nunca ve el texto plano
- [ ] Texto plano conocido (KPA), porque el error le revela pares que él no eligió
- [ ] Texto plano elegido (CPA), porque el adversario elige lo que le manda al servidor
- [x] Texto cifrado elegido (CCA), porque cada respuesta es información sobre el descifrado de un criptograma que él eligió

> El eje que ordena la taxonomía es **qué punta del par elige** el adversario. En CPA se eligen los mensajes y se observan los criptogramas (oráculo de $\mathsf{Enc}$): el caso típico es un servicio que cifra datos provistos por el usuario. Acá el adversario elige el **criptograma** y el servidor le devuelve, aunque sea un bit por consulta, información sobre el descifrado: eso es un oráculo de $\mathsf{Dec}$, es decir CCA. La opción CPA es la tentadora porque el adversario efectivamente elige lo que envía, pero lo que envía son criptogramas, no textos planos.

## El teorema de Shannon dice que si un esquema tiene secreto perfecto entonces $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ {#quiz-bloque-1-criptografia:cota-de-shannon-no-suficiente}
> pagina: secreto-perfecto

Si al analizar un esquema se verifica que $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$, ¿qué se puede concluir?

- [x] Nada por sí solo: la condición es necesaria pero no suficiente, y hay esquemas que la cumplen y filtran el mensaje entero
- [ ] Que tiene secreto perfecto, porque el teorema vale en los dos sentidos
- [ ] Que resiste la fuerza bruta, que es lo mismo que tener secreto perfecto
- [ ] Que la distribución del criptograma es uniforme, y de ahí sale el secreto perfecto por Bayes

> La implicación va en un solo sentido. El Ejemplo 2 de *Probabilidad y criptografía* tiene $\lvert\mathcal{K}\rvert = 3 \ge \lvert\mathcal{M}\rvert = 2$ y observar $C = 4$ deja $\Pr[M = b \mid C = 4] = 1$: el criptograma determina el mensaje. Lo que falla no es el conteo sino **cómo están repartidas** las claves entre los criptogramas. Es el mismo patrón que con la fuerza bruta —espacio de claves grande no es sinónimo de seguro—, sólo que acá la condición de conteo sí se demuestra necesaria.

## Alicia cifra dos mensajes distintos con el mismo pad $k$ de un One Time Pad, y un adversario intercepta $c_1$ y $c_2$ {#quiz-bloque-1-criptografia:reuso-de-clave-otp}
> pagina: one-time-pad

¿Qué obtiene el adversario con sólo xorear los dos criptogramas?

- [ ] La clave $k$, porque el xor es su propio inverso
- [x] El xor de los dos textos planos, $m_1 \oplus m_2$, porque la clave se cancela
- [ ] Nada aprovechable: el OTP tiene secreto perfecto, así que el resultado es indistinguible de ruido
- [ ] Sólo la longitud del mensaje más corto de los dos

> $c_1 \oplus c_2 = (m_1 \oplus k) \oplus (m_2 \oplus k) = m_1 \oplus m_2$: la clave desaparece, y en lenguaje natural ese xor alcanza para separar los dos textos. De ahí el nombre — el "One Time" es la advertencia. La opción del secreto perfecto es la tentadora: la demostración de la clase vale para **un** cifrado con clave uniforme e independiente del mensaje, y el reuso rompe exactamente esa hipótesis. Es el mismo cálculo, con $k$ reemplazado por $G(s)$, que hace fallar la prueba `Mul` a los criptosistemas de flujo.

## El secreto perfecto se abandona por caro, no por falso, y se lo reemplaza por la seguridad computacional {#quiz-bloque-1-criptografia:dos-relajaciones-computacional}
> pagina: seguridad-computacional

¿Cuáles son las dos cosas que se relajan?

- [ ] El tamaño del mensaje y la exigencia de que $\mathsf{Dec}$ recupere siempre el plano
- [x] Se limitan los escenarios —sólo adversarios de tiempo polinomial probabilístico— y se limitan las garantías, admitiendo una probabilidad de éxito despreciable
- [ ] Se supone que el algoritmo es secreto y que el adversario sólo observa el canal
- [ ] Se mantiene $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ pero se admite que el descifrado falle con probabilidad despreciable

> Las dos relajaciones no son arbitrarias: con $\lvert\mathcal{K}\rvert < \lvert\mathcal{M}\rvert$ la fuerza bruta **siempre** funciona, y lo único que se puede hacer con ese ataque es volverlo caro (adversario $\mathrm{PPT}$) y poco confiable (probabilidad despreciable). Son, respectivamente, las dos maneras de convivir con él. Suponer el algoritmo secreto sería ir contra Kerckhoffs, y la corrección $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ no se toca en ningún momento.

## En un mensaje cifrado con CBC, el bloque $C_1$ llega con un bit corrompido por el canal {#quiz-bloque-1-criptografia:propagacion-de-error-cbc}
> pagina: modos-de-encadenamiento

¿Qué se observa al descifrar?

- [ ] Sólo $P_1$ sale mal; el resto del mensaje queda intacto
- [ ] $P_1$ sale con un único bit dado vuelta y $P_2$ queda destruido por completo
- [x] $P_1$ queda destruido por completo, $P_2$ sale con exactamente un bit dado vuelta, y del tercer bloque en adelante el descifrado se recupera solo
- [ ] Todos los bloques desde $P_1$ hasta el final salen mal, porque el encadenamiento nunca se corta

> La regla es mirar la ecuación $P_i = \mathsf{Dec}_K(C_i) \oplus C_{i-1}$ y preguntarse **por dónde entra** el bloque corrompido. $C_1$ aparece en dos ecuaciones: en la de $P_1$ entra por la primitiva inversa, y eso es avalancha —el bloque entero queda arruinado—; en la de $P_2$ entra por un xor directo, y eso da vuelta exactamente ese bit. En ninguna otra aparece, así que el modo se autosincroniza. La opción de propagación total es la del **otro** caso del mismo ejercicio: un bit mal en el texto claro antes de cifrar sí arruina todos los bloques de criptograma.

## Las filminas piden IV aleatorio para CBC y sólo que no se repita el par $(k, \text{nonce})$ para CTR {#quiz-bloque-1-criptografia:nonce-contra-iv-aleatorio}
> pagina: cifrado-probabilistico-nonce-e-iv

¿Qué distingue una exigencia de la otra?

- [ ] Nada: nonce e IV son dos nombres del mismo objeto
- [x] Al nonce sólo se le pide unicidad, así que puede ser un contador predecible; al IV de CBC se le pide además que sea impredecible
- [ ] Al nonce se le pide impredecibilidad; al IV de CBC alcanza con que no se repita
- [ ] El IV viaja cifrado junto al criptograma y el nonce viaja en claro

> Un IV que el adversario pueda predecir rompe CBC aunque nunca se repita, y por eso la filmina escribe ALEATORIO en mayúsculas; CTR, en cambio, se conforma con unicidad, y ésa es la razón por la que ahí puede usarse un contador. La primera opción es la de las propias filminas, que tratan los dos términos como sinónimos, y es justamente la confusión que rompe sistemas que en el papel estaban bien. El IV o nonce viaja en claro junto al criptograma en los dos casos: es lo que le permite al receptor reproducir el keystream.

## Los sueldos de una base se guardan cifrados con un criptosistema de flujo CPA-Secure. Un empleado cambia unos bytes de su fila y su sueldo pasa a valer lo que él quiso, sin conocer la clave {#quiz-bloque-1-criptografia:maleabilidad-integridad}
> pagina: maleabilidad

¿Qué propiedad falló?

- [ ] La confidencialidad: el atacante dedujo el sueldo a partir del criptograma
- [x] La integridad: el sistema no puede detectar que alguien escribió encima, y ninguna de las pruebas hasta CPA mide eso
- [ ] La corrección del criptosistema, porque $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) \ne m$
- [ ] El principio de Kerckhoffs, porque el ataque necesita conocer el formato del mensaje

> Nada de lo que pasó fue una falla de confidencialidad: ningún criptograma reveló información, y el atacante ni siquiera necesita saber cuánto cobraba. Todo sale de que $\mathsf{Enc}_k(m) = G(k) \oplus m$ implica $\mathsf{Dec}_k(c \oplus x) = m \oplus x$ — la clave nunca entra en la cuenta. `Eav`, `Mul` y `CPA` terminan con el adversario emitiendo un bit: miden qué puede **leer**, no qué puede **escribir**. De acá salen, en cadena, la prueba `CCA`, el MAC y el cifrado autenticado. Conocer el formato es un supuesto legítimo justamente por Kerckhoffs.

## Bob recibe $(m, t)$ de Alicia y comprueba que $\mathsf{Vrfy}_k(m,t) = 1$ con el MAC infalsificable que comparten {#quiz-bloque-1-criptografia:mac-y-no-repudio}
> pagina: message-authentication-code

¿Le sirve esa etiqueta para demostrarle a un tercero que el mensaje lo emitió Alicia?

- [ ] Sí: un MAC infalsificable garantiza autenticación de origen, y eso es exactamente lo que el tercero necesita
- [x] No: Bob también conoce $k$, así que pudo haber fabricado él mismo la etiqueta, y el tercero no tiene forma de distinguir los dos casos
- [ ] No, porque la etiqueta no permite reconstruir el mensaje y el tercero no puede leer qué se autenticó
- [ ] Sí, siempre que el MAC sea determinístico, porque entonces la etiqueta es reproducible

> El MAC da integridad y autenticación de origen **entre las partes que comparten la clave**, y nada más. La simetría de la clave es lo que bloquea el no repudio, y no es un defecto de construcción: es la definición. Peor todavía si la clave la comparten $n$ partes, porque una etiqueta válida no identifica a cuál de las $n$. La opción de la autenticación de origen es la tentadora: es verdadera como afirmación suelta y no alcanza para el uso que se pretende. Lo que sí da no repudio es la firma digital, por la asimetría de claves.

## ¿Qué separa la resistencia a colisiones de la resistencia a segundas preimágenes? {#quiz-bloque-1-criptografia:colisiones-contra-segundas-preimagenes}
> pagina: resistencias-de-una-funcion-de-hash

- [x] Los grados de libertad: en segundas preimágenes el adversario recibe $x$ y tiene que hallar $x' \ne x$, mientras que en colisiones se inventa los dos mensajes
- [ ] Que las colisiones existen siempre por el principio del palomar y las segundas preimágenes no
- [ ] Que la resistencia a colisiones es la más débil de las tres y por eso se la formaliza aparte
- [ ] Que romper colisiones cuesta $2^{L}$ evaluaciones y romper segundas preimágenes cuesta $\Theta(2^{L/2})$

> La formulación exacta la dio un alumno en clase y el docente le puso el nombre: en colisiones hay **un grado más de libertad**. Y de ahí sale todo lo demás: cuantos más grados de libertad tiene el adversario, más fácil el ataque y por lo tanto más fuerte la propiedad que lo declara inviable. Resistir colisiones es lo más difícil de las tres, no lo más débil. Los costos de la última opción están invertidos: no se conoce ataque genérico a preimágenes ni a segundas preimágenes que baje de $2^{L}$, y el del cumpleaños lleva las colisiones a $\Theta(2^{L/2})$. El principio del palomar tampoco es lo que separa a las dos propiedades: lo que establece es que las colisiones existen, y por eso la resistencia no puede pedir que no las haya sino que sean computacionalmente inhallables.

## Hay tres formas de combinar un criptosistema y un MAC para tener confidencialidad e integridad a la vez {#quiz-bloque-1-criptografia:encrypt-then-mac}
> pagina: privacidad-e-integridad

¿Cuál tiene una demostración de seguridad general, y bajo qué condición?

- [ ] Cifrar y autenticar por separado, $\langle \mathsf{Enc}_{k_1}(m),\, \mathsf{Mac}_{k_2}(m)\rangle$, siempre que las claves sean independientes
- [ ] Autenticar y luego cifrar, $\mathsf{Enc}_{k_1}(m \Vert \mathsf{Mac}_{k_2}(m))$, siempre que el padding sea de longitud fija
- [x] Cifrar y luego autenticar, $\langle \mathsf{Enc}_{k_1}(m),\, \mathsf{Mac}_{k_2}(c)\rangle$, siempre que las dos primitivas sean seguras y las claves se generen de forma independiente
- [ ] Las tres, siempre que el MAC sea infalsificable y el criptosistema CPA-Secure

> El estatus de las tres es distinto y conviene tenerlo preciso. La primera **no alcanza**: la etiqueta se calcula sobre el texto plano y viaja en claro, y como los MAC reales son determinísticos, dos etiquetas iguales delatan dos mensajes iguales. La segunda tiene pruebas para combinaciones concretas y **ninguna general** — el problema es el padding, porque hay que descifrar antes de poder verificar. La tercera tiene una demostración que vale para cualquier criptosistema y cualquier MAC, y las dos fallas de las otras son de confidencialidad, no de integridad. La independencia de claves no es adorno: es la hipótesis del teorema, y el ejercicio de la filmina 18 de la práctica muestra el precio de olvidarla con el orden correcto.

## Bob intercepta la orden de transferencia $(m,t)$ que Alicia le mandó al banco y la reenvía diez veces, sin tocar nada. El banco verifica bien las diez y transfiere diez veces {#quiz-bloque-1-criptografia:replay-y-mac-forge}
> pagina: ataques-de-repeticion-y-frescura

¿Por qué el experimento `Mac-Forge` no captura este ataque?

- [ ] Porque el adversario gana el experimento con probabilidad despreciable y eso se considera aceptable
- [x] Porque el experimento exige $m \notin Q$, y un mensaje reenviado es precisamente uno que ya fue autenticado: el adversario pierde con probabilidad 1
- [ ] Porque el MAC que usa el banco no es infalsificable
- [ ] Porque $\mathsf{Vrfy}$ es probabilística y puede aceptar dos veces el mismo par por azar

> `Mac-Forge` declara éxito sólo si la etiqueta verifica **y** el mensaje no fue consultado. Quien reenvía cumple la primera y falla la segunda por construcción, así que su ventaja es exactamente cero y aun así vacía la cuenta. La vulnerabilidad no es de ninguna construcción —`CBC-MAC` y `HMAC` la heredan por igual, y también la heredaría un MAC ideal—: está en la definición, porque $\mathsf{Vrfy}$ no tiene estado. Lo que falta no es integridad ni autenticación de origen sino **frescura**, y la aporta el protocolo con un número de secuencia o un timestamp, que además tienen que entrar adentro del $\mathsf{Mac}$.

## Diffie-Hellman es seguro bajo la conjetura DDH, y aun así se lo describe como inseguro frente a un adversario activo {#quiz-bloque-1-criptografia:diffie-hellman-activo}
> pagina: diffie-hellman

¿Cuál es la razón?

- [ ] Que el problema del logaritmo discreto deja de ser difícil cuando el adversario observa dos ejecuciones distintas del protocolo
- [x] Que el adversario sustituye $h_1$ y $h_2$ en tránsito y termina con dos claves de sesión válidas, una con cada parte, sin resolver ningún problema difícil
- [ ] Que $g^{xy}$ se puede calcular a partir de $g^{x}$ y $g^{y}$ cuando el grupo es de tamaño insuficiente
- [ ] Que el experimento `KE` modela adversarios activos y Diffie-Hellman no lo pasa

> El ataque *man-in-the-middle* no rompe ninguna primitiva: $M$ interpone su propio $h_1^{M}$ hacia $B$ y su propio $h_2^{M}$ hacia $A$, y cada víctima calcula una clave que comparte con $M$ y no con la otra. Todo el tráfico posterior pasa por él, que descifra con la clave que corresponde y vuelve a cifrar con la otra. El experimento `KE` es la opción tentadora y dice lo contrario: modela específicamente un adversario **pasivo**, que escucha la transcripción pero no la modifica. La defensa es autenticar quién envió cada $h$, y esa es la motivación con la que la clase introduce la firma digital.

## ¿Por qué el RSA "de libro de texto" no puede ser CPA-Secure? {#quiz-bloque-1-criptografia:textbook-rsa-determinista}
> pagina: rsa

- [x] Porque $\mathsf{Enc}_{pk}(m) \equiv m^{e} \pmod n$ es determinística y, con $pk$ público, el adversario cifra $m_0$ y $m_1$ por su cuenta y compara contra el desafío
- [ ] Porque el módulo $n$ es público y se lo puede factorizar en tiempo polinomial
- [ ] Porque $e$ se elige coprimo con $\varphi(n)$, y esa condición filtra información sobre el mensaje
- [ ] Porque si $m^{e} < n$ no hay reducción modular y se recupera $m$ calculando la raíz $e$-ésima entera

> En el mundo asimétrico la distinción entre `Eav` y `CPA` se borra: quien conoce $pk$ ya tiene la función de cifrado, o sea un oráculo de fábrica. Contra un esquema determinístico eso da la victoria con probabilidad 1, sin ninguna consulta. La última opción es la tentadora porque describe un problema **real** de textbook RSA —el de los mensajes y exponentes pequeños—, pero es otro de los tres de la filmina 25 y depende de que el mensaje sea corto; el determinismo descalifica al esquema para **todo** mensaje. Factorizar $n$, en cambio, es justamente lo que no se sabe hacer en tiempo polinomial.

## ¿Qué propiedad da una firma digital que un MAC no puede dar, y de dónde sale? {#quiz-bloque-1-criptografia:firma-y-no-repudio}
> pagina: firma-digital

- [ ] Integridad, porque el MAC detecta cambios en el mensaje pero no en la etiqueta
- [x] No repudio, porque se firma con una clave privada que sólo el firmante conoce y se verifica con la pública correspondiente
- [ ] Confidencialidad, porque $\mathsf{Sign}_{sk}$ cifra el mensaje con la clave privada
- [ ] Frescura, porque `Sig-forge` exige que el mensaje falsificado no haya sido consultado al oráculo

> De la asimetría de claves salen tres propiedades sin ningún mecanismo extra: verificación pública, transferibilidad y no repudio. La primera opción es falsa: como $\mathsf{Vrfy}$ mira el **par**, un MAC detecta cambios en el mensaje, en la etiqueta o en las dos cosas. Una firma tampoco cifra —persigue integridad, igual que un MAC—, y la frescura no la resuelve ninguna de las dos primitivas: la firma acredita quién firmó, no cuándo.

## Un sistema con $n$ participantes que se comunican de a pares puede resolver la distribución de claves con una clave por combinación o con un KDC {#quiz-bloque-1-criptografia:kdc-lineal-contra-cuadratico}
> pagina: distribucion-de-claves-y-kdc

¿Qué cambia al pasar de lo primero a lo segundo?

- [ ] El total pasa de $n$ a $\binom{n}{2}$ claves, pero desaparece el punto único de falla
- [x] El total pasa de $\binom{n}{2}$ claves a $n$, a cambio de introducir un único punto de falla
- [ ] El total no cambia, pero cada participante pasa a administrar una sola clave
- [ ] Se elimina la necesidad de un canal seguro previo, porque el KDC genera y distribuye las claves de sesión

> Con una clave por par el costo es cuadrático —$45$ claves con $n = 10$, casi medio millón con $n = 1000$— y cada participante nuevo obliga a distribuir con todos los que ya estaban. El KDC lo baja a $n$: cada parte comparte **una** clave fija con él y las claves de sesión se generan bajo demanda. El precio es exactamente lo que el diseño distribuido evitaba: si el KDC se compromete, quien lo comprometió obtiene de una sola vez la clave fija de cada participante. La última opción es la tentadora y es falsa: el canal seguro previo sigue haciendo falta, sólo que ahora es uno por participante contra el KDC en vez de uno por par.

## Validar la firma de un certificado exige la clave pública de quien lo firmó, que a su vez viene en otro certificado {#quiz-bloque-1-criptografia:autoridad-raiz-autofirmada}
> pagina: cadenas-de-firmas-y-autoridades-raiz

¿Dónde se corta esa recursión?

- [ ] En el sistema operativo, que valida cada certificado consultando online el servicio de la AC que lo emitió
- [x] En una AC raíz, que firma su propio certificado y viene preinstalada como confiable en el sistema, el navegador o el runtime
- [ ] En el certificado del titular, que incluye las claves públicas de todas las AC de su cadena
- [ ] En una única AC raíz universal, en la que confían por convención todos los navegadores

> Las AC raíces están **autofirmadas** —emisor y sujeto son el mismo nombre— y son, por definición, el punto de confianza: no hay nadie más arriba que las valide, se confía en ellas porque el sistema las trae preinstaladas. La última opción es la tentadora: no hay una raíz universal sino una **lista** de raíces reconocidas, replicada en el sistema operativo, los navegadores y runtimes como la JVM, y por eso revocar la confianza en una raíz comprometida implica una actualización del sistema y no una negociación de protocolo. Lo que sí viaja con el certificado del titular es la cadena de certificados de cada eslabón, no un conjunto de claves sueltas.

## El primer paso de la verificación de un certificado X.509 es obtener una clave pública {#quiz-bloque-1-criptografia:primer-paso-verificacion-x509}
> pagina: x509

¿Cuál?

- [ ] La del sujeto, que viene dentro del propio certificado que se está verificando
- [x] La del emisor, o sea la de la AC: de la cadena de certificados adjunta, o del sistema operativo si el certificado es raíz
- [ ] La del sujeto, obtenida por separado de la CRL que publica la AC
- [ ] La de la aplicación que verifica, para comparar el `CN` contra la identidad que espera

> La confusión entre "la clave pública de la CA" y "la clave pública del titular" es la trampa más repetida de los parciales viejos. La del sujeto es lo que el certificado **transporta** y lo que se obtiene una vez validado; la firma que hay que verificar en el paso 2 es la de la AC, y por eso el paso 1 se aplica recursivamente subiendo la cadena. La otra trampa habitual está en el paso 3: no alcanza con que el certificado esté vigente hoy, la AC tiene que haber estado vigente al comienzo del período de validez del certificado que emitió. Y la CRL no distribuye claves: es la lista negra de certificados revocados antes de expirar.

## Un atacante consiguió una clave de sesión $k_s$ vieja y con eso logra impersonar a $A$ frente a $B$ en la segunda aproximación de Needham-Schroeder, la que ya tiene nonces {#quiz-bloque-1-criptografia:clave-de-sesion-vieja}
> pagina: needham-schroeder

¿Por qué el nonce $r_1$ no lo impide?

- [ ] Porque $r_1$ viaja en claro en el primer mensaje y el atacante lo puede reutilizar
- [x] Porque $r_1$ protege a $A$ contra la repetición del mensaje 2, pero $B$ nunca eligió un valor propio antes de recibir el mensaje 3 y no tiene con qué juzgar la frescura de $k_s$
- [ ] Porque $r_2$ se puede predecir a partir de $r_1$, y con eso el atacante responde el desafío sin conocer $k_s$
- [ ] Porque el atacante puede pedirle al KDC que vuelva a emitir la misma clave de sesión

> La asimetría es exacta: hay frescura para un extremo del protocolo y no para el otro. El mensaje $\{A \Vert k_s\}_{k_b}$ sigue siendo un criptograma perfectamente válido bajo $k_b$ —nadie dijo que caduque solo—, así que $B$ lo acepta, emite su desafío $\{r_2\}_{k_s}$ y el atacante, que conoce $k_s$, responde $\{r_2 - 1\}_{k_s}$ sin problema. Ni siquiera necesita hablar con el KDC. La consecuencia es peor que perder una sesión: cualquier clave de sesión vieja que se filtre sigue siendo una llave de impersonación válida para siempre. La corrección es Denning-Sacco, que mete un timestamp $T$ adentro del ticket: eso **acota** la ventana de ataque a $\Delta t$, no la elimina, y a cambio exige relojes sincronizados.
