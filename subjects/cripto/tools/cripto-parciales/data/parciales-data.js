/* parciales-data.js — generado desde wiki/catedra/parciales-viejos.md.
   No se edita a mano: se regenera cuando cambia esa página. */
window.CRIPTO_PARCIALES = [
 {
  "id": "2c-2025-1",
  "examen": "2C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 1,
  "numeros": [
   1
  ],
  "titulo": "Protocolo de intercambio de claves con MAC",
  "tipo": "Analizar un protocolo",
  "enunciado": "Dado el siguiente protocolo\n\n|  |  |  |  |\n| --- | --- | --- | --- |\n| (1.1) | $A \\to B$ | $r_A$ | $r_A$ es un número al azar que elige A |\n| (1.2) | $A \\leftarrow B$ | $(B, A, r_A, r_B), h_K(B, A, r_A, r_B, K')$ | $r_B$ número al azar de B, $h_K(\\cdot)$ MAC |\n| (1.3) | $A \\to B$ | $(A, r_B), h_K(A, r_B, K')$ |  |\n| (1.4) | $A$ |  | $W = h'_{K'}(r_B)$ |\n| (1.5) | $B$ |  | $W = h'_{K'}(r_B)$ |\n\ndonde A y B comparten dos claves simétricas $K$ y $K'$. $h'_{K'}(\\cdot)$ es una función de MAC diferente de $h_K(\\cdot)$ .\n\n- a) ¿Qué tipo de protocolo sería? ¿Qué es lo que el protocolo intenta construir?\n- b) ¿Qué le permiten hacer a A y B los mensajes cruzados 1.2 y 1.3?\n- c) ¿Es este protocolo suceptible a un ataque MiTM? Justificar.",
  "resolucion": "**La resolución del apunte, verificada.** Es un protocolo de intercambio de claves que busca establecer la clave de sesión $W$ y **autenticar a las dos partes**. El mensaje 1.2 le permite a $A$ validar que el mensaje no es viejo —por el nonce $r_A$ que ella misma eligió— y autenticar a $B$, porque con $K$ puede recomputar $h_K(B,A,r_A,r_B)$ sobre lo que recibe en claro. El 1.3 le permite a $B$ hacer lo mismo respecto de $A$. **No es susceptible a MitM**: la autenticación es mutua y se apoya en claves previamente compartidas, así que un atacante que no conoce $K$ ni $K'$ no puede hacerse pasar por ninguno de los dos.\n\n**Lo que hay que ver acá** *(agregado nuestro)*: el nonce hace **frescura** y el MAC hace **autenticación de origen**, y son dos servicios distintos que el protocolo necesita a la vez — exactamente la distinción de [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]]. Un MAC sin nonce sería replayable aunque fuera infalsificable.\n\n> No es literalmente ninguno de los protocolos que trae la [[clase-05-protocolos-criptograficos|Clase 05]] —no hay KDC ni certificado de por medio—, pero el criterio para decidir si resiste `MITM` es el mismo que esa clase desarrolla en [[ataques-activos-y-man-in-the-middle|Ataques activos y man in the middle]]: un atacante sin las claves compartidas no puede fabricar los MAC que autentican cada mensaje, así que no puede interponerse sin ser detectado. *(Cruce nuestro; el enunciado no lo pide.)*"
 },
 {
  "id": "2c-2025-2",
  "examen": "2C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 2,
  "numeros": [
   2
  ],
  "titulo": "El Vigenère que el apunte no resolvió",
  "tipo": "Criptoanálisis clásico",
  "enunciado": "El siguiente texto fue encontrado en una botella en la guerra de los Roses\n\n\"GWAOESFENITLAGEUGEDRVPHJVCDFDR\"\n\nSe sabe que el mensaje fue encriptado con clave y estaba en castellano con un alfabeto de 26 letras.\n\n- (a) Detallar cómo sería el abordaje para criptoanalizar el mensaje.\n- (b) Intentar encontrar la clave y el mensaje.\n\nTeniendo en cuenta que la frecuencia (aproximada) de aparición de letras en castellano es la siguiente:\n\n| Letra | A | B | C | D | E | F | G | H | I | J | K | L | M | N | Ñ | O | P | Q | R | S | T | U | V | W | X | Y | Z |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| % | 13 | 1 | 4 | 5 | 13 | 1 | 1 | 1 | 7 |  |  | 5 | 3 | 7 | 0 | 9 | 3 | 1 | 7 | 8 | 4 | 4 | 1 |  |  | 1 |  |\n\nFigura 1: Frecuencias de aparición de letras en castellano.",
  "resolucion": "El apunte anota *\"Es un Vigenère con clave `CLAVE`, el enunciado lo dice medio escondido\"* y a continuación escribe **`Skip`**: la corazonada está, la cuenta no.\n\n**Resuelto acá, y cierra.** Con $k = \\texttt{CLAVE}$ y $m_j = (c_j - k_j) \\bmod 26$:\n\n$$\\texttt{GWAOESFENITLAGEUGEDRVPHJVCDFDR} \\;\\longrightarrow\\; \\texttt{ELATAQUESERAALASVEINTEHORASFIN}$$\n\no sea **`EL ATAQUE SERA A LAS VEINTE HORAS FIN`**. Las 30 letras del criptograma dan 30 de texto plano y el mensaje es castellano corrido, así que no hay ambigüedad.\n\n**El juego de palabras del enunciado.** *\"Fue encriptado con clave\"* no es una aclaración obvia: **es el dato**. La clave literalmente es la palabra `CLAVE`. Es el mismo tipo de gancho que la Clase 01 usa con `LACABEZA` en el ejercicio de sustitución por símbolos.\n\n> **Cómo se resolvería sin el gancho** *(agregado nuestro, que es lo que el ítem (a) pide de verdad).* El abordaje es el estándar de [[cifrado-de-vigenere|Vigenère]]: (1) [[test-de-kasiski|test de Kasiski]] sobre las secuencias repetidas para proponer candidatos de longitud de clave; (2) [[indice-de-coincidencia|índice de coincidencia]] sobre los $t$ sub-textos para confirmar cuál $t$ hace saltar el IC a $\\approx 0{,}0775$; (3) con $t$ fijo, el problema se **factoriza en $t$ rotaciones independientes** y cada una cae por [[criptoanalisis-por-frecuencias|análisis de frecuencias]] contra la tabla que el propio enunciado adjunta. Con 30 letras y $t=5$ quedan sub-textos de 6 caracteres, que es **poco para que las frecuencias sean confiables** — de ahí que el enunciado regale el gancho."
 },
 {
  "id": "2c-2025-3",
  "examen": "2C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 3,
  "numeros": [
   3
  ],
  "titulo": "¿Es válido este esquema?",
  "tipo": "¿Es válido este esquema de bloque?",
  "enunciado": "Consideren el siguiente sistema de encripción en bloque para los mensajes $M_1M_2 \\ldots M_n$, que generan los cifrados $C_0C_1C_2 \\ldots C_n$.\n\n$$\\begin{aligned} C_0 &= IV \\\\ C_i &= E_k(C_{i-1} \\oplus M_i), i = 1, 2, \\ldots \\end{aligned}$$\n\n- a) ¿Es este un esquema de cifrado en bloque válido? Explicar y eventualmente corregirlo para que lo sea.\n- b) Comparar la confidencialidad y la tolerancia a errores de transmisión de este sistema contra CBC, CTR y OFB.",
  "resolucion": "**Verificado: es exactamente `CBC`.** El apunte lo dice —*\"no es más que un encadenamiento CBC\"*— y demuestra la validez exhibiendo la inversa: $D_k(C_i) = C_{i-1}\\oplus M_i$, luego $M_i = D_k(C_i)\\oplus C_{i-1}$. Es invertible, entonces es válido.\n\nPara confidencialidad y errores, ver [[modos-de-encadenamiento|Modos de encadenamiento]]: `CBC` es CPA-seguro **siempre que el IV sea aleatorio**, y un bit malo en $C_i$ afecta **exactamente dos bloques**. Acá el apunte se equivoca sobre `OFB` → [[#Discrepancias con el apunte|Discrepancias]]."
 },
 {
  "id": "2c-2025-4",
  "examen": "2C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 4,
  "numeros": [
   4
  ],
  "titulo": "Secreto perfecto de un Vigenère formal",
  "tipo": "Secreto perfecto, demostrado",
  "enunciado": "Se define un criptosistema de encripción simétrica $\\Pi = (\\mathsf{Gen}, \\mathsf{Enc}, \\mathsf{Dec})$ con un alfabeto de 26 letras con $K = k_1k_2k_3...k_l$ con $k_i \\in \\{0, ..., 25\\}$. Los mensajes $M = m_1m_2...m_n$ donde $m_i \\in \\{0, ..., 25\\}$. La encripción $\\mathsf{Enc}$ procede como\n\n$$c_j = (m_j + k_{((j-1)\\bmod l)+1})(26)$$\n\ny la desencripción $\\mathsf{Dec}$\n\n$$m_j = (c_j - k_{((j-1)\\bmod l)+1})(26)$$\n\nDemostrar si este sistema tiene secreto perfecto y ante que condiciones sobre los parámetros.",
  "resolucion": "La resolución del apunte está completa y es correcta; conviene tenerla porque es el molde de lo que se pide:\n\n**Si $l < n$** (la clave se repite), entonces $m_j$ y $m_{j+l}$ usan la misma $k$, y restando:\n\n$$c_j - c_{j+l} = m_j - m_{j+l} \\pmod{26}$$\n\nEl criptograma **revela una relación entre los mensajes sin depender de la clave**. No hay secreto perfecto.\n\n**Si $l = n$** (clave tan larga como el mensaje, o sea un [[one-time-pad|One Time Pad]] sobre $\\mathbb{Z}_{26}$), cada $k_i$ es uniforme e independiente, $\\Pr[K{=}k] = (1/26)^{n}$. Fijados $c$ y $m$, la clave queda determinada: $k_j = c_j - m_j \\pmod{26}$, **una sola** produce ese cifrado. Entonces\n\n$$\\Pr[C{=}c \\mid M{=}m] \\;=\\; \\Pr[K = c-m] \\;=\\; \\left(\\tfrac{1}{26}\\right)^{n}$$\n\nque **no depende de $m$**, así que $\\Pr[C{=}c\\mid M{=}m_0] = \\Pr[C{=}c\\mid M{=}m_1]$ para todo par. Hay secreto perfecto.\n\n> **La condición que se pide nombrar es $l \\ge n$ con clave uniforme y de un solo uso**, que es el teorema de Shannon instanciado: $\\lvert\\mathcal{K}\\rvert \\ge \\lvert\\mathcal{M}\\rvert$ ([[secreto-perfecto|Secreto perfecto]]). El ejercicio es, en el fondo, *\"demostrá que Vigenère con clave del largo del mensaje es un OTP\"*."
 },
 {
  "id": "2c-2025-5",
  "examen": "2C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 5,
  "numeros": [
   5
  ],
  "titulo": "Verdadero o Falso",
  "tipo": "Verdadero o Falso, con corrección",
  "enunciado": "Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.\n\n- a) MD5 es un criptosistema de encripción asimétrico que no debe ser utilizado porque usa una longitud de clave de 128 bits.\n- b) Un protocolo de autenticación basado únicamente en un MAC simétrico provee confidencialidad, integridad y no repudio entre las partes.\n- c) El uso de padding aleatorio en la implementación del algoritmo de clave pública de RSA es para que el algoritmo sea seguro a ataque de textos cifrados elegidos.\n- d) Un certificado digital emitido por una autoridad certificante contiene siempre la clave pública de la CA.",
  "resolucion": "| Sentencia | Apunte | Verificación |\n|---|---|---|\n| a) `MD5` es un criptosistema **asimétrico** que no debe usarse porque usa clave de 128 bits | Falso: es una **función de hash** | Correcto. Y la razón real de no usarlo es que está **quebrada** —colisión en $<2^{20}$ operaciones—, no la longitud; los 128 bits son la **salida**, no una clave ([[primitivas-de-hash-estandar\\|03.09]]) |\n| b) Un protocolo basado sólo en un MAC simétrico provee confidencialidad, integridad y **no repudio** | Falso: sólo integridad y autenticación | Correcto — y la razón del no repudio es que **la clave es compartida** ([[message-authentication-code\\|03.03]]) |\n| c) El padding aleatorio en RSA es para que sea seguro ante **texto cifrado elegido** | Falso: *\"se hace para que sea CPA-Secure\"* | Correcto — confirmado por la filmina 27 de la Clase 4, ver [[#Discrepancias con el apunte\\|Discrepancias]] |\n| d) Un certificado emitido por una CA contiene siempre la **clave pública de la CA** | Falso: contiene la del **titular** | Correcto. El certificado lleva la clave pública del titular y va **firmado** con la privada de la CA — es exactamente la trampa que documenta [[certificados-digitales\\|Certificados digitales]] |"
 },
 {
  "id": "1c-2025-1",
  "examen": "1C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 1,
  "numeros": [
   1
  ],
  "titulo": "Diffie-Hellman",
  "tipo": "Analizar un protocolo",
  "enunciado": "Dado el siguiente protocolo\n\n|  |  |  |  |\n| --- | --- | --- | --- |\n| (1.1) | $A \\to B$ | $G, q, g$ |  |\n| (1.2) | $A$ |  | $x \\leftarrow \\mathbb{Z}_q$ |\n| (1.3) | $A$ |  | $h_1 = g^x$ |\n| (1.4) | $A \\to B$ | $h_1$ |  |\n| (1.5) | $B$ |  | $y \\leftarrow \\mathbb{Z}_q$ |\n| (1.6) | $A \\leftarrow B$ | $h_2$ | $h_2 = g^y$ |\n| (1.7) | $A$ |  | $k_A = h_2^x$ |\n| (1.8) | $B$ |  | $k_B = h_1^y$ |\n\ndonde $A(G, q, g)$ elige un Grupo $G$ $\\mathbb{Z}_q$ con una raíz primitiva $g$.\n\n- a) ¿Qué tipo de protocolo sería, qué es lo que el protocolo intenta construir?\n- b) Mostrar un ejemplo numérico acotado cómo opera el protocolo. ¿Qué valores de $q$ son válidos y por qué?\n- c) ¿En qué reside la seguridad computacional del algoritmo?\n- d) Mencionar dos problemas que tiene este protocolo.",
  "resolucion": "La resolución del apunte cubre los cuatro ítems: es **Diffie-Hellman**, genera un secreto compartido sobre un canal inseguro; $q$ tiene que ser **primo** para que exista la raíz primitiva; la seguridad computacional reside en que $x$ e $y$ **nunca se transmiten** y obtenerlos de $g^x$ y $g^y$ es el **problema del logaritmo discreto**, sin solución eficiente conocida; y los dos problemas son que **no resiste atacantes activos** —necesita un canal autenticado, o sea MitM— y que la exponenciación modular es cara al crecer los bits.\n\n**El ejemplo numérico del apunte tiene un problema** *(precisión nuestra)*: usa $\\mathbb{Z}_5$ con $g=2$, $x=3$, $y=4$, y llega a $h_1 = 2^3 = 8 \\equiv 3$, $h_2 = 2^4 = 16 \\equiv 1$, $k_A = 1^3 = 1$, $k_B = 3^4 = 81 \\equiv 1$. Las cuentas cierran y el secreto coincide, **pero el ejemplo es degenerado**: da $k = 1$, que es el peor valor posible para ilustrar nada. Conviene rehacerlo con otros exponentes —por ejemplo $x=2$, $y=3$ sobre $\\mathbb{Z}_5$ con $g=2$: $h_1 = 4$, $h_2 = 3$, $k_A = 3^2 = 9 \\equiv 4$, $k_B = 4^3 = 64 \\equiv 4$— antes de usarlo como modelo de respuesta.\n\n> Esto es el concepto [[diffie-hellman|Diffie-Hellman]] de la [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04]], que el vault ya tiene ingerida —sólo contra las filminas, sin transcripción, porque la clase todavía no se dictó (es el 10/09)—. Los siete pasos que formaliza esa nota coinciden exactamente con los ocho de este enunciado, y confirman los cuatro puntos de la resolución del apunte: el problema del **logaritmo discreto**, la necesidad de **canal autenticado** contra `MITM`, y que la seguridad reposa en que $x$ e $y$ nunca viajan."
 },
 {
  "id": "1c-2025-2",
  "examen": "1C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 2,
  "numeros": [
   2
  ],
  "titulo": "El esquema que parece CBC y no lo es",
  "tipo": "¿Es válido este esquema de bloque?",
  "enunciado": "Consideren el siguiente sistema de encripción en bloque para los mensajes $M_1M_2 \\ldots M_n$, que generan los cifrados $C_0C_1C_2 \\ldots C_n$.\n\n$$\\begin{aligned} C_0 &= IV \\\\ C_i &= E_k(M_i) \\oplus C_{i-1}, i = 1, 2, \\ldots \\end{aligned}$$\n\n- a) ¿Es este un esquema de cifrado en bloque válido? Explicar.\n- b) Comparar la confidencialidad y la tolerancia a errores de transmisión de este sistema contra CBC, CTR y OFB.",
  "resolucion": "**Cuidado con éste, porque es el gemelo tramposo del Ej. 3 del 2C-2025.** Ahí la primitiva envuelve al encadenamiento —$E_k(C_{i-1}\\oplus M_i)$, que es `CBC`—; acá el encadenamiento envuelve a la primitiva. **No es `CBC`, y no es CPA-seguro.**\n\n*Validez*: sí. $D_k$ existe porque $M_i = D_k(C_i \\oplus C_{i-1})$.\n\n*Confidencialidad*: **no es CPA-seguro**, y el ataque del apunte es correcto y vale la pena tenerlo escrito. De $C_i = E_k(M_i)\\oplus C_{i-1}$ sale\n\n$$C_i \\oplus C_{i-1} = E_k(M_i)$$\n\no sea que **dos bloques contiguos revelan una función determinística del bloque de mensaje**. El adversario elige\n\n$$m_0 = M \\Vert M \\quad\\text{(dos bloques iguales)}, \\qquad m_1 = M \\Vert M'$$\n\ny recibe $C_0, C_1, C_2$. Entonces calcula $C_1 \\oplus C_0$ y $C_2 \\oplus C_1$:\n\n- si el mensaje era $m_0$, los dos valen $E_k(M)$ y **coinciden**;\n- si era $m_1$, valen $E_k(M)$ y $E_k(M')$ y **difieren**.\n\nEmite $b' = 0$ si coinciden. Acierta con **probabilidad 1**. Es el mismo defecto que prohíbe [[modos-de-encadenamiento|ECB]]: bloques iguales producen huella igual, y el IV no lo tapa porque se cancela al xorear bloques contiguos."
 },
 {
  "id": "1c-2025-3",
  "examen": "1C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 3,
  "numeros": [
   3
  ],
  "titulo": "¿Este esquema da integridad?",
  "tipo": "MAC, hash e integridad",
  "enunciado": "Dado el siguiente criptosistema $c = E_{k1}(\\,m \\Vert H(k2 \\Vert m)\\,)$.\n\ndonde $m$ es un mensaje de tamaño fijo, $H$ es una función de hash criptográfica, $E_k(\\cdot)$ es una primitiva de encripción simétrica y $\\Vert$ implica concatenación; $k1$ y $k2$ son claves compartidas entre Bob y Alice.\n\n- a) Detallar el paso a paso itemizado de lo que debería hacer el receptor al recibir $c$.\n- b) ¿Puede un atacante modificar el mensaje? Explicar la integridad del criptosistema.\n- c) ¿Provee el protocolo algún esquema de autenticación? Explicar.\n- d) ¿Provee el esquema algún mecanismo de no-repudio? Explicar.",
  "resolucion": "La resolución del apunte es correcta en los cuatro puntos, y el (b) es el que importa: **es `authenticate-then-encrypt`**, la segunda de las [[privacidad-e-integridad|tres formas de combinar]], la que *\"puede ser segura pero requiere prueba\"*. El apunte dice que el atacante **sí puede modificar** porque *\"primero se aplica el hash y luego se encripta\"*, y que **lo correcto sería cifrar y luego autenticar**.\n\n> **Matiz necesario** *(precisión nuestra).* La conclusión —preferir `Encrypt-then-MAC`— es la correcta y es la de la cátedra. Pero el argumento *\"puede introducir un cambio tal que $c' = (m'\\Vert t')$ y pasaría la validación\"* está incompleto: para fabricar ese $c'$ el atacante tendría que producir un $t' = H(k_2\\Vert m')$ **sin conocer $k_2$**, que es justamente lo que la construcción impide. Lo que falla de verdad en *authenticate-then-encrypt* es que **obliga a descifrar para poder verificar**, y eso abre los ataques de **oráculo de padding** que se llevaron puesto a `TLS` hasta la 1.2. La respuesta correcta al ítem (b) es *\"no puede falsificar, pero el orden es igualmente malo, y ésta es la razón\"*.\n\nSobre (c) y (d): provee **autenticación simétrica** —el receptor confirma que el emisor tiene $k_2$— pero **no identidad individual** ni **no repudio**, porque las claves son compartidas y no se puede distinguir cuál de los dos emitió."
 },
 {
  "id": "1c-2025-4",
  "examen": "1C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 4,
  "numeros": [
   4
  ],
  "titulo": "Secreto perfecto con una clave de dos bits",
  "tipo": "Secreto perfecto, demostrado",
  "enunciado": "Dado el siguiente criptosistema $Exp_{eav}(\\mathbf{A}, n)$, verificar si un atacante tiene éxito en un ataque de texto cifrado.\n\n$$c = E_k(m) = (m \\oplus k_0) \\oplus f(k_1),$$\n\ncon $f(\\cdot)$ la función identidad, $f(0) = 0$ y $f(1) = 1$ y $k = k_0k_1 \\in \\{0,1\\}^2$ uniformemente distribuídas, y teniendo en cuenta $m, c \\in \\{0,1\\}$ y que $Pr[m = 0] = 0{,}9$ y $Pr[m = 1] = 0{,}1$.",
  "resolucion": "El apunte lo resuelve **dos veces**: primero con Bayes y la tabla de verdad completa de los 8 casos, y después con el atajo. **El atajo es el que conviene reproducir en un parcial**:\n\n$$\\Pr[C{=}0\\mid M{=}0] = \\Pr[k{=}00] + \\Pr[k{=}11] = \\tfrac14+\\tfrac14 = \\tfrac12$$\n$$\\Pr[C{=}0\\mid M{=}1] = \\Pr[k{=}01] + \\Pr[k{=}10] = \\tfrac14+\\tfrac14 = \\tfrac12$$\n\ny análogamente para $C{=}1$. Como $\\Pr[C{=}c\\mid M{=}m]$ **no depende de $m$**, hay [[secreto-perfecto|secreto perfecto]].\n\n> **La lectura de una línea que el apunte no hace** *(agregado nuestro)*: $c = m \\oplus k_0 \\oplus k_1$, y **$k_0 \\oplus k_1$ es uniforme en $\\{0,1\\}$** cuando $k$ es uniforme en $\\{0,1\\}^2$ —dos de las cuatro claves dan 0 y dos dan 1—. O sea que el esquema **es un One Time Pad de un bit disfrazado**, y por eso tiene secreto perfecto. Notar además que el sesgo $0{,}9 / 0{,}1$ de la distribución de $M$ **es una distracción**: el secreto perfecto no depende de cómo se distribuyan los mensajes."
 },
 {
  "id": "1c-2025-5",
  "examen": "1C-2025",
  "instancia": "1P",
  "anio": 2025,
  "n": 5,
  "numeros": [
   5
  ],
  "titulo": "Verdadero o Falso",
  "tipo": "Verdadero o Falso, con corrección",
  "enunciado": "Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.\n\n- a) Cualquier función de encripción simétrica tiene que ser inyectiva.\n- b) Los sistemas de encripción basados en clave pública utilizan una de las claves para encriptar/desencriptar y la otra para firmar.\n- c) Para sistemas de cifrado con un código binario de tres bits, el número de cifrados de transposición diferentes es mayor que el número de cifrados de sustitución.\n- d) Un certificado público contiene la clave privada de la entidad certificante.",
  "resolucion": "| Sentencia | Apunte | Verificación |\n|---|---|---|\n| a) Cualquier función de encripción simétrica tiene que ser **inyectiva** | Verdadero | Correcto: si no, dos mensajes distintos darían el mismo cifrado y `Dec` no podría decidir. Es la **condición de corrección** de [[criptosistema\\|01.01]] |\n| b) En clave pública se usa una clave para encriptar/desencriptar y la otra para firmar | Falso: se encripta con la **pública** y se desencripta con la **privada**; se firma con la **privada** y se verifica con la **pública** | Correcto |\n| c) Con un código binario de 3 bits, hay **más** cifrados de transposición que de sustitución | Falso: transposición $= 3! = 6$, sustitución $= 8! = 40320$ | Correcto. La transposición permuta **3 posiciones**; la sustitución es una biyección sobre las **8 cadenas** de 3 bits ([[cifrado-por-transposicion\\|01.09]] contra [[cifrado-de-sustitucion-monoalfabetica\\|01.05]]) |\n| d) Un certificado público contiene la **clave privada** de la entidad certificante | Falso: contiene la pública del titular, firmada con la privada de la CA | Correcto — ver [[certificados-digitales\\|Certificados digitales]] |"
 },
 {
  "id": "1c-2023-1",
  "examen": "1C-2023",
  "instancia": "1P",
  "anio": 2023,
  "n": 1,
  "numeros": [
   1
  ],
  "titulo": "Protocolo tipo TLS",
  "tipo": "Analizar un protocolo",
  "enunciado": "Dado el siguiente protocolo\n\n|  |  |  |  |\n| --- | --- | --- | --- |\n| (1.1) | $C \\to S$ | $C, C\\#, N_C$ |  |\n| (1.2) | $C \\leftarrow S$ | $S, S\\#, N_S, Cert(S, Sgn_{kS}(S))$ | Check Certificate |\n| (1.3) | $C \\to S$ | $E_{K_0}(kS), N$ | $k1 = H(K_0, N_C, N_S)$ |\n| (1.4) | $C \\to S$ | $E_{Kcs}(finished, MAC_k1(timestamp))$ | $Kcs = H(N, k1)$ |\n| (1.5) | $C \\leftarrow S$ | $E_{Kcs}(finished, MAC_k1(timestamp))$ |  |\n| (1.6) | $C \\to S$ | $E_{Kcs}(data)$ |  |\n| (1.7) | $C \\leftarrow S$ | $E_{Kcs}(data)$ |  |\n\ndonde $E(\\cdot)$ es un esquema de cifrado simétrico, $Sgn(\\cdot)$ es un esquema de firma digital.\n\n- a) ¿Qué tipo de protocol sería, qué es lo que el protocolo intenta construir?\n- b) ¿Cuál es el propósito de los mensajes (1.4) y (1.5)?\n- c) ¿Por qué se deriva la clave $Kcs$ y no se usa en cambio la clave $K_0$?",
  "resolucion": "La resolución cubre los tres ítems: es un protocolo de **autenticación e intercambio de claves** que construye una clave de sesión y un canal seguro con confidencialidad y **autenticación del servidor**; los mensajes 1.4 y 1.5 sirven para **validar que ambos tienen la misma $K_{cs}$**, con **timestamp contra replay** y **MAC por integridad**; y $K_{cs}$ se deriva en vez de usar $K_0$ porque $K_0$ es la **clave pública del servidor**, obtenida del certificado, o sea parte de un esquema asimétrico que no sirve para el intercambio simétrico posterior.\n\n> **Es un protocolo *tipo TLS* disfrazado con otra notación**, y ahora el vault lo tiene desarrollado con nombre propio: [[tls-arquitectura-y-record|TLS: arquitectura y record]] y [[tls-handshake|TLS handshake]]. El certificado que trae $K_0$ es exactamente el mecanismo de [[certificados-digitales|Certificados digitales]] y [[x509|X.509]]: la clave del certificado es asimétrica y sirve para **autenticar y transportar** el material a partir del cual se deriva la clave de sesión, nunca para cifrar el tráfico en sí — la misma razón que da el apunte. *(Cruce nuestro.)*"
 },
 {
  "id": "1c-2023-2",
  "examen": "1C-2023",
  "instancia": "1P",
  "anio": 2023,
  "n": 2,
  "numeros": [
   2
  ],
  "titulo": "CTR con una primitiva sin inversa",
  "tipo": "¿Es válido este esquema de bloque?",
  "enunciado": "Una propuesta de un cifrador en bloque usando modo CTR usa una primitiva de encripción $E(\\cdot)$ que no admite una primitiva de desencripción inversa.\n\n- (a) ¿ Es este un sistema de encripción válido ? Explicar.\n- (b) ¿ Cómo se utiliza el nonce en dicho sistema ?\n- (c) ¿ Cuál es la ventaja de este sistema en términos de procesamiento ?",
  "resolucion": "**Sí es válido, y ésta es la pregunta que separa a quien entendió `CTR` de quien lo memorizó.** El apunte lo resuelve bien: $C_i = M_i \\oplus E_k(\\text{nonce}\\Vert i)$ y $M_i = C_i \\oplus E_k(\\text{nonce}\\Vert i)$ — **la primitiva se usa hacia adelante en las dos direcciones**, nunca se invierte. Es lo que hace que `CTR` (y `OFB`, y `CFB`) sólo necesiten una **función pseudoaleatoria** y no una **permutación**; la misma distinción `PRF`/`PRP` que aparece en [[primitiva-de-cifrado-en-bloque|02.07]] y en [[cbc-mac|03.05]].\n\nSobre el nonce: es aleatorio, se concatena con el contador del bloque, y **no se puede repetir el par $(k, \\text{nonce})$** ([[cifrado-probabilistico-nonce-e-iv|02.06]]). La ventaja de procesamiento es el **paralelismo**: no hay operaciones entre bloques, así que se cifra y descifra en paralelo y con acceso aleatorio."
 },
 {
  "id": "1c-2023-3",
  "examen": "1C-2023",
  "instancia": "1P",
  "anio": 2023,
  "n": 3,
  "numeros": [
   3
  ],
  "titulo": "base64 como \"cifrado\"",
  "tipo": "Criptoanálisis clásico",
  "enunciado": "El banco de Estander usa base64 como sistema de encripción simétrica.\n\n- a) ¿Puede este considerarse un sistema de encripción válido? Explicar.\n- b) El CSO dice que su sistema ofrece confuseon y difusión. ¿Qué significa?\n- c) El además insiste en que el sistema no es lineal. ¿Qué significa que un criptosistema simétrico sea no lineal? De un ejemplo de otro criptosistema lineal.",
  "resolucion": "El apunte responde (a) correctamente —**no es un criptosistema**: no usa clave, no da confidencialidad y no hay dificultad computacional en revertirlo— y marca (b) y (c) como **\"No lo vimos\"**.\n\n> **El apunte se equivoca al marcarlas \"No lo vimos\": el vault, cruzado, muestra que sí se vieron.** *Confusión* y *difusión* están definidas y nombradas en la propia [[primitiva-de-cifrado-en-bloque#Difusión y confusión: los dos objetivos|Primitiva de cifrado en bloque § Difusión y confusión]] —con cita textual del docente (cues pt2 44-56, 111): *\"difusión: si yo altero algún bit, que se alteren muchos… confusión: que yo no pueda predecir cómo la alteración de un bit va a modificar los otros bits\"*—, y **la respuesta a (b) sale de ahí**: es exactamente lo que ofrece un esquema de cifrado en bloque en lugar de un dato codificado en base64. *No linealidad* no aparece con ese nombre en una filmina de clase, pero sí como propiedad desarrollada: las **cajas $S$ son el único paso no lineal de DES** ([[des-descripcion-del-algoritmo|apunte de DES]]) y `Byte Sub` lo es de `AES` ([[aes|02.10]]), y la respuesta a (c) es que `base64` es una función **fija y lineal** —una tabla de sustitución de 6 a 8 bits sin clave— así que no tiene ninguna de las tres propiedades. *(Precisión nuestra, y también una corrección a esta misma nota: la versión anterior de este párrafo daba el hueco por real sin cruzar contra la Clase 02, que ya estaba ingerida cuando se escribió.)*"
 },
 {
  "id": "1c-2023-4",
  "examen": "1C-2023",
  "instancia": "1P",
  "anio": 2023,
  "n": 4,
  "numeros": [
   4
  ],
  "titulo": "Cuando el aleatorio deja de serlo",
  "tipo": "¿Es válido este esquema de bloque?",
  "enunciado": "Dado el siguiente criptosistema $\\Pi = (\\mathsf{Gen}, \\mathsf{Enc}, \\mathsf{Dec})$.\n\nPara $p \\in \\mathbb{Z}$ y $a, b, r \\in \\mathbb{Z}_p$, siendo la clave $k = (a, b)$ y siendo $r \\leftarrow random$\n\n$$\\begin{aligned} c &= E_k(m) = (r, ar + b + m)_{(p)} \\\\ m &= D_k(c) = (-ar - b + c)_{(p)} \\end{aligned}$$\n\ndonde $(\\cdot)_{(p)}$ implica que opera con aritmética modular.\n\n- a) Considerar una variante del criptosistema donde $r$ en lugar de ser aleatorio toma el valor $r = (a+b)_{(p)}$ ¿es este criptosistema seguro contra ataque de texto cifrado elegido? Demostrar mediante un experimento $\\mathrm{PrivK}^{\\mathrm{CPA}}_{\\mathcal{A},\\Pi}$",
  "resolucion": "Correcto y bien visto: con $r$ fijo queda\n\n$$c = \\bigl(a+b,\\; \\underbrace{a^2+ab+b}_{\\text{constante}} + m\\bigr)_p$$\n\no sea **determinístico**, y *determinístico $\\Rightarrow$ no CPA-seguro* es una de las tres propiedades de [[pruebas-de-indistinguibilidad|02.05]]. El adversario pide al oráculo el cifrado de $m_0$ y de $m_1$, recibe el desafío y compara: acierta con probabilidad 1."
 },
 {
  "id": "1c-2023-5",
  "examen": "1C-2023",
  "instancia": "1P",
  "anio": 2023,
  "n": 5,
  "numeros": [
   5
  ],
  "titulo": "Verdadero o Falso",
  "tipo": "Verdadero o Falso, con corrección",
  "enunciado": "Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.\n\n- a) Para proveer privacidad e integridad, lo correcto es primero Cifrar $m$ con $k_1$ para obtener $c$ y al mismo tiempo obtener el MAC con la clave $k_2$ de $m$ para obtener $t$. Tanto $m$ como $t$ se deben transmitir en forma conjunta. Las claves $k_1$ y $k_2$ pueden ser iguales.\n- b) La seguridad de las funciones de hash se establece como el nivel de resistencia a preimagenes donde dado un $y$ hallar $x/h(x) = y$.\n- c) El algoritmo de Diffie-Hellman permite que Alice le envíe una clave de sesión a Bob por un canal inseguro.\n- d) En los cifrados en bloque independientemente del modo de operación se requiere que BCE Block Cipher Encryption ó PRF Psuedo Random Function siempre sea reversible.",
  "resolucion": "| Sentencia | Apunte | Verificación |\n|---|---|---|\n| a) Cifrar $m$ con $k_1$ y **a la vez** sacar el MAC de $m$ con $k_2$; $k_1$ y $k_2$ **pueden ser iguales** | Falso: primero cifrar, después el MAC **sobre $c$**, y las claves **independientes** | Correcto, y es exactamente [[privacidad-e-integridad\\|03.12]] más el ejercicio de claves iguales de la [[practica-04-macs-hash-y-cifrado-autenticado\\|Práctica 04]] |\n| b) La seguridad de un hash se establece **sólo** como resistencia a preimágenes | Falso: son **tres** propiedades | Correcto ([[resistencias-de-una-funcion-de-hash\\|03.07]]) |\n| c) Diffie-Hellman permite que Alice le **envíe** una clave de sesión a Bob | Falso: permite que **la establezcan** entre los dos, no que uno se la mande | Correcto, y es la distinción que define un **acuerdo** de claves contra un **transporte** de claves |\n| d) En los cifrados en bloque se requiere que la `PRF` **siempre sea reversible** | Falso: la **primitiva de cifrado** debe ser reversible, la `PRF` no | Correcto, y engancha con el Ej. 2 de este mismo parcial |"
 },
 {
  "id": "1c-2018-1",
  "examen": "1C-2018",
  "instancia": "1P",
  "anio": 2018,
  "n": 1,
  "numeros": [
   1
  ],
  "titulo": "Needham-Schroeder",
  "tipo": "Analizar un protocolo",
  "enunciado": "Dado el siguiente protocolo\n\n$$\\begin{aligned} (1.1)\\ &A \\to T : A, B, N_A \\\\ (1.2)\\ &A \\leftarrow T : E_{kAT}(N_A, B, k, E_{kBT}(k, A)) \\\\ (1.3)\\ &A \\to B : E_{kBT}(k, A) \\\\ (1.4)\\ &A \\leftarrow B : E_k(N_B) \\\\ (1.5)\\ &A \\to B : E_k(N_B - 1) \\end{aligned}$$\n\ndonde $E(\\cdot)$ es un esquema de cifrado simétrico.\n\n- a) ¿Para qué está el nombre del destinatario en los mensajes (1.1) y (1.2)?\n- b) ¿Qué problema tiene este protocolo?\n- c) El protocolo de Denning-Sacco agrega timestamps a los mensajes (1.2) y (1.3). ¿Con qué objetivo?",
  "resolucion": "Es el protocolo clásico con **KDC**. **Es, literalmente, el protocolo [[needham-schroeder|Needham-Schroeder]] de la [[clase-05-protocolos-criptograficos|Clase 05]]** — con `T` en vez de `KDC` como nombre del tercero de confianza, y **sin** el timestamp de la corrección [[denning-sacco-y-frescura|Denning-Sacco]] que sí aparece en la filmina 28 de esa clase. Las tres respuestas del apunte son correctas y son las estándar:\n\n- **(a) Por qué está el nombre del destinatario** en 1.1 y 1.2: $T$ es un KDC, y $A$ tiene que **especificar con quién quiere hablar** para obtener la clave de sesión. En 1.2 el nombre va **adentro del cifrado** para que no se pueda suplantar la identidad del destinatario aunque el mensaje esté cifrado con $K_{AT}$.\n- **(b) El problema**: en el paso 1.3 **no viaja ningún timestamp ni nonce**, así que es vulnerable a **replay** — un atacante que grabó un $E_{K_{BT}}(k,A)$ viejo, con una clave $k$ ya comprometida, se lo puede reenviar a $B$.\n- **(c) [[denning-sacco-y-frescura|Denning-Sacco]]** agrega timestamps a 1.2 y 1.3 justamente para eso: $B$ puede validar si el mensaje que le llegó es viejo o reciente."
 },
 {
  "id": "1c-2018-2",
  "examen": "1C-2018",
  "instancia": "1P",
  "anio": 2018,
  "n": 2,
  "numeros": [
   2
  ],
  "titulo": "Múltiple choice",
  "tipo": "Verdadero o Falso, con corrección",
  "enunciado": "Elegir la opción correcta y justificar en una oración.\n\n1- La validación de un Certificado Digital incluye\n\n- (a) Verificar que la clave privada contenida en el certificado digital coincida con la clave pública que tiene el emisor del certificado.\n- (b) Verificar que la clave pública contenida en el certificado digital encripte adecuadamente la clave privada que tiene el emisor del certificado.\n- (c) Verificar que la firma digital emitida por la Autoridad Certificante incluída dentro del Certificado Digital sea válida.\n\n2- El Duque de Mantua en 1401 utilizó un sistema de encripción homofónico donde implementó un cifrado de sustitución de manera que cada una de las vocales era sustituída por más de un símbolo, que se seleccionaba al azar. La cantidad de símbolos de sustitución para cada vocal era proporcional a la frecuencia de aparición de esa vocal dentro del lenguaje.\n\n- (a) El esquema no tiene secreto perfecto porque es imposible identificar la vocal asignada.\n- (b) El esquema opera en realidad como un cifrado Vigènere.\n- (c) El índice de coincidencia no es tan útil en este caso.\n\n3- Confidencialidad e integridad sobre un canal inseguro\n\n- (a) SSL ofrece integridad y autenticación de los participantes mediante el uso de un KDC centralizado.\n- (b) SSL ofrece confidencialidad, integridad y no repudio de los participantes mediante el uso de PKI de distribución de certificados.\n- (c) TLS ofrece confidencialidad, integridad y autenticación de los participantes bajo un esquema PKI de distribución de certificados.",
  "resolucion": "**2.1 Validación de un certificado digital** → la correcta es verificar que **la firma de la CA sea válida**, usando la clave pública de la CA, porque la firma se generó con la privada que sólo ella tiene — el segundo de los cinco pasos de [[x509#Verificación de un certificado X.509, en cinco pasos|X.509 § Verificación de un certificado X.509, en cinco pasos]].\n\n**2.2 El Duque de Mantua, 1401 — cifrado homofónico.** Cada vocal se sustituye por **más de un símbolo**, elegido al azar, con tantos símbolos como su frecuencia en el idioma. La correcta es **(c) el índice de coincidencia no es tan útil en este caso**, y la razón que da el apunte es exacta: al repartir cada vocal en varios símbolos **se aplana el histograma** y el [[indice-de-coincidencia|índice de coincidencia]] deja de distinguir. Las otras dos son trampas: no es Vigenère —no hay desplazamientos cíclicos— y sí se puede razonar sobre su secreto perfecto.\n\n> **Éste es el ejercicio más interesante de los cuatro parciales** *(lectura nuestra)*, porque ataca justo el punto ciego de la herramienta: el IC mide **cuán disparejo** es el histograma, y el cifrado homofónico está **diseñado** para emparejarlo. Es el contraejemplo que muestra que el IC no es un detector universal de sustitución monoalfabética.\n\n**2.3 SSL/TLS/PKI** → misma pregunta que en el 1C-2023, misma respuesta — ver [[clase-05-protocolos-criptograficos#Para el parcial|Clase 05 § Para el parcial]]."
 },
 {
  "id": "1c-2018-3",
  "examen": "1C-2018",
  "instancia": "1P",
  "anio": 2018,
  "n": 3,
  "numeros": [
   3
  ],
  "titulo": "Cirugía sobre CBC",
  "tipo": "¿Es válido este esquema de bloque?",
  "enunciado": "En un esquema de encripción en bloques CBC de longitud n un mensaje $M_1M_2 \\ldots M_n$ se cifra como un bloque de longitud n+1, $C_0C_1C_2 \\ldots C_n$.\n\n$$\\begin{aligned} C_0 &= IV \\\\ C_k &= E_k(M_k \\oplus C_{k-1}) \\end{aligned}$$\n\n- a) ¿ Cómo se ve afectada la desencripción si el primer bloque $C_0$ es eliminado del texto cifrado ?\n- b) ¿ Cómo se ve afectada la desencripción si el último bloque $C_n$ es eliminado del texto cifrado ?\n- c) Teniendo el texto cifrado ya generado como se especificó con anterioridad, ¿ Cómo puede un usuario legitimo agregar un texto de bloque $M_0$ específico al principio del mensaje plano original agregando bloques $C_k$ adicionales en cualquier ubicación del texto cifrado ?",
  "resolucion": "- **(a) Si se elimina $C_0$**: $M_1$ **no se puede recuperar**, porque $D_k(C_1) = M_1 \\oplus C_0$ y falta $C_0$. Los demás bloques salen bien.\n- **(b) Si se elimina $C_n$**: se pierde **sólo $M_n$**; $M_1 \\ldots M_{n-1}$ se recuperan correctamente.\n- **(c) Cómo agregar un bloque $M_0$ al principio**: no se puede insertar sin más, por la dependencia del bloque anterior. Hay que **anteponer un nuevo $C'_0$** tal que $M_0 = D_k(C_0) \\oplus C'_0$, o sea $C'_0 = D_k(C_0) \\oplus M_0$.\n\nLa resolución del apunte de (c) es correcta y es más fina de lo que parece: **el usuario legítimo puede hacerlo porque tiene la clave** y por lo tanto puede calcular $D_k(C_0)$. Sin la clave no sale — y ésa es la diferencia entre esta manipulación y el ataque de [[maleabilidad]] de la Clase 03."
 },
 {
  "id": "1c-2018-4",
  "examen": "1C-2018",
  "instancia": "1P",
  "anio": 2018,
  "n": 4,
  "numeros": [
   4,
   5
  ],
  "titulo": "",
  "tipo": "¿Es válido este esquema de bloque?",
  "enunciado": "**Ejercicio 4.** Dado el siguiente criptosistema $\\Pi = (\\mathsf{Gen}, \\mathsf{Enc}, \\mathsf{Dec})$.\n\nPara $p \\in \\mathbb{Z}$ y $a, b, r \\in \\mathbb{Z}_p$, siendo la clave $k = (a, b)$ y siendo $r \\leftarrow random$\n\n$$\\begin{aligned} c &= E_k(m) = (r, ar + b + m)_{(p)} \\\\ m &= D_k(c) = (-ar - b + c)_{(p)} \\end{aligned}$$\n\ndonde $(\\cdot)_{(p)}$ implica que opera con aritmética modular.\n\n- a) Considerar una variante del criptosistema donde $r$ en lugar de ser aleatorio toma el valor $r = (a+b)_{(p)}$ ¿es este criptosistema seguro contra ataque de texto cifrado elegido? Demostrar mediante un experimento $\\mathrm{PrivK}^{\\mathrm{CPA}}_{\\mathcal{A},\\Pi}$\n\n**Ejercicio 5.** Verdadero o Falso. Si es falso, corrija la sentencia para que sea verdadera e identifique el cambio realizado.\n\n- a) Para proveer privacidad e integridad, lo correcto es primero Cifrar $m$ con $k_1$ para obtener $c$ y al mismo tiempo obtener el MAC con la clave $k_2$ de $m$ para obtener $t$. Tanto $m$ como $t$ se deben transmitir en forma conjunta. Las claves $k_1$ y $k_2$ pueden ser iguales.\n- b) La seguridad de las funciones de hash se establece como el nivel de resistencia a preimagenes donde dado un $y$ hallar $x/h(x) = y$.\n- c) El algoritmo de Diffie-Hellman permite que Alice le envíe una clave de sesión a Bob por un canal inseguro.\n- d) En los cifrados en bloque independientemente del modo de operación se requiere que BCE Block Cipher Encryption ó PRF Psuedo Random Function siempre sea reversible.\n\n> El apunte los marca **\"Repetido\"**: son literalmente los mismos que el Ej. 4 y el Ej. 5 del 1C-2023, arriba. **Que un ejercicio reaparezca idéntico con cinco años de diferencia es, en sí, el dato más accionable de esta nota.**",
  "resolucion": ""
 }
];
