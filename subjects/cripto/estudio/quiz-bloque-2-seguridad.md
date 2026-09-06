---
tipo: quiz
titulo: Quiz · Bloque 2, seguridad
id: quiz-bloque-2-seguridad
descripcion: Veinte preguntas sobre lo que entra en el segundo parcial.
---

## ¿Qué separa a la integridad de la disponibilidad en las definiciones de la clase? {#quiz-bloque-2-seguridad:cid-cuantificador-y-relacion}
> pagina: confidencialidad-integridad-y-disponibilidad

Las tres propiedades se escriben sobre el mismo par de objetos: un conjunto $X$ de entidades y una información o recurso $I$.

- [ ] El cuantificador sobre $X$: la integridad exige que la cumpla todo miembro de $X$, y la disponibilidad, que no la incumpla ninguno.
- [x] Comparten el cuantificador —todo miembro de $X$— pero no la relación: una exige confianza en $I$ y la otra, acceso efectivo cuando se lo requiere.
- [ ] El objeto sobre el que se definen: la integridad se predica del recurso $I$ y la disponibilidad, del conjunto $X$ de entidades.
- [ ] El grado: la disponibilidad es un escalón más de la integridad, porque un dato al que nadie puede acceder deja de ser confiable.

> Integridad y disponibilidad comparten el cuantificador "todo miembro de $X$"; lo que las distingue es la relación exigida, confiar en $I$ contra acceder a $I$ cuando se lo requiere. Confundir "todos confían" con "todos pueden acceder" es el error más frecuente entre las tres: un backup correcto en un disco que no arranca es íntegro y no disponible, y un servidor que responde siempre con datos corruptos es disponible y no íntegro. La última opción invierte además la idea de fondo: las tres propiedades son ejes ortogonales, no una escala.

## Si Bell-LaPadula tuviera sólo la condición de seguridad simple, ¿qué camino quedaría abierto? {#quiz-bloque-2-seguridad:blp-por-que-la-condicion-de-cierre}
> pagina: bell-lapadula

- [ ] Que un sujeto de nivel bajo lea directamente un objeto de nivel más alto que el suyo.
- [x] Que un sujeto de nivel alto lea un objeto secreto y después lo escriba en un objeto de nivel bajo, que cualquiera puede leer.
- [ ] Que un objeto cambie de nivel una vez creado y se invaliden retroactivamente accesos ya concedidos.
- [ ] Que dos compartimentos con categorías disjuntas queden comparables por la relación de dominancia.

> La condición simple ($L(O) \le L(S)$ para leer) sólo impide la lectura directa hacia arriba, que es exactamente lo que descarta la primera opción. La condición de cierre existe para tapar el camino indirecto: sin ella, quien puede leer hacia abajo escribiría lo leído en un objeto de nivel inferior y filtraría el secreto por un canal de escritura que elude por completo la restricción de lectura. Es la exigencia de "ni siquiera por vías indirectas" aplicada a este modelo. El cambio de nivel de un objeto ya creado lo previene el principio de tranquilidad, no la condición de cierre.

## Los tres modelos de integridad de Biba comparten la regla de escritura. ¿Qué los distingue? {#quiz-bloque-2-seguridad:biba-lo-que-distingue-a-los-tres}
> pagina: modelos-de-integridad-de-biba

Los tres exigen $i(o) \le i(s)$ para que $s$ escriba $o$.

- [ ] El sentido de la relación de dominancia sobre los niveles de integridad, que Strict Integrity invierte respecto de los otros dos.
- [x] Qué hacen con la lectura: Low-Water-Mark la permite pero degrada al lector, Ring Policy la permite sin costo y Strict Integrity la restringe con $i(s) \le i(o)$.
- [ ] Si admiten categorías además de niveles: sólo Strict Integrity llega al dual completo de Bell-LaPadula porque es el único que las incorpora.
- [ ] La regla de ejecución: cada modelo fija una condición distinta para que $s_1$ pueda ejecutar $s_2$.

> Escritura y ejecución son idénticas en los tres ($i(o) \le i(s)$ y $i(s_2) \le i(s_1)$). La lectura es la única variable: en Low-Water-Mark el nivel del sujeto es dinámico y baja al valor mínimo entre el suyo y el del objeto leído; en Ring Policy la lectura es libre y sin consecuencias, con niveles estáticos; en Strict Integrity la lectura queda directamente restringida, y de ahí el lema "no se puede leer hacia abajo, no se puede escribir hacia arriba". Las categorías se agregan sobre Strict Integrity para completar el dual de Bell-LaPadula, pero no son lo que separa a los tres modelos entre sí.

## Un sujeto ya leyó un objeto del CD de Citibank, dentro del COI de entidades financieras. ¿Qué le permite la condición simple de la muralla china? {#quiz-bloque-2-seguridad:muralla-china-condicion-simple}
> pagina: muralla-china

- [x] Volver a leer otro objeto del mismo CD de Citibank, porque acceder de nuevo a esa empresa no agrega ningún conflicto que no existiera ya.
- [ ] Leer un objeto del CD del Santander mientras no escriba nada en él, porque el conflicto sólo se materializa al escribir.
- [ ] Nada de ningún otro COI hasta terminar con el actual, porque el historial bloquea al sujeto en la clase en la que entró.
- [ ] Leer el CD del Banco Francés siempre que el nivel de habilitación del sujeto domine al del objeto.

> La condición simple permite el acceso si se cumple alguna de tres cláusulas: que el objeto pertenezca a un CD ya leído, que el sujeto nunca haya tocado ese COI, o que el objeto esté declasificado. Repetir sobre Citibank cae en la primera. Leer al Santander o al Banco Francés es leer una segunda empresa dentro de un COI ya tocado, y queda prohibido por omisión, sin que "no escribir" lo habilite. Entrar a un COI distinto sí está permitido por la segunda cláusula. La última opción importa un criterio ajeno: la muralla china decide por historial de lecturas, no por dominancia de niveles como Bell-LaPadula.

## $ACL(o) = \{(\text{Pablo}, rw), (\text{Profesores}, r)\}$ con Pablo en Profesores. ¿Qué puede hacer Pablo? {#quiz-bloque-2-seguridad:acl-grant-all-contra-first-rule}
> pagina: listas-de-control-de-acceso

La entrada individual de Pablo aparece primera en la lista.

- [ ] Leer y escribir bajo cualquiera de las dos políticas de resolución, porque una entrada de grupo sólo puede agregar derechos, nunca quitarlos.
- [ ] Leer y escribir con Grant-All, y sólo leer con First-Rule, porque la política de grupo se evalúa antes que la individual.
- [x] Sólo leer con Grant-All, que exige que todos los ACs aplicables otorguen el derecho; leer y escribir con First-Rule, que usa el primer AC que encuentra.
- [ ] No queda determinado con esos datos: hace falta saber además si el sistema resuelve por Override o por Augment.

> Grant-All combina todos los ACs aplicables y se queda con la intersección: la entrada de grupo sólo concede $r$, así que Pablo pierde la escritura que su entrada individual le daba. First-Rule no combina nada, usa el primer AC de la lista y le concede $rw$. La misma tabla de entrada da resultados opuestos según la política, y por eso "qué política de resolución usa este sistema" hay que responderlo antes de poder predecir un acceso. Override y Augment resuelven otro problema: qué pasa con la entrada por defecto $(*, r)$ frente a una entrada explícita, no el choque entre grupo e individuo.

## Un atacante intercepta la URL de redirección de OAuth 2.0 y se queda con el authorization code. ¿Por qué eso no le alcanza para obtener el access token? {#quiz-bloque-2-seguridad:oauth-codigo-no-alcanza}
> pagina: oauth-2

- [ ] Porque el código viaja cifrado con una clave del proveedor y sólo la aplicación cliente registrada puede descifrarlo.
- [ ] Porque el navegador consume el código al redirigir, y lo que llega a la aplicación cliente es un valor distinto.
- [x] Porque el intercambio del código por el token es una llamada servidor a servidor que además exige el `client secret`, y ese secreto nunca pasa por el navegador.
- [ ] Porque el access token no se obtiene a partir del código: viaja en la misma redirección, en otro parámetro de la URL.

> El código de autorización viaja por el navegador, expuesto en la URL de redirección, y quien la intercepte lo ve; los propios mensajes de la cátedra lo confirman, porque el `code` de la *Token Request* es carácter por carácter el mismo string que llegó en la *Callback response*. Lo que protege el flujo es el paso siguiente: la petición del token va directa al proveedor, servidor a servidor, con `client_id` y `client_secret`, y ese secreto sólo lo conocen la aplicación y el servidor de autorización. La última opción describe el grant type *Implicit*, que sí devuelve el token directamente y por eso expone bastante más.

## ¿Por qué el modelo $(A, C, F, L, S)$ separa las funciones de complementación $F$ de las de autenticación $L$? {#quiz-bloque-2-seguridad:autenticacion-f-contra-l}
> pagina: autenticacion

- [x] Porque $F$ corre una sola vez, al registrar la información complementaria, y deriva $C$ a partir de $A$; $L$ corre en cada intento y decide si el par $(a,c)$ es una asociación válida.
- [ ] Porque $F$ la aporta la entidad externa en el momento de autenticarse y $L$ la aplica el sistema sobre lo que recibió.
- [ ] Porque $F$ es siempre una función de hash criptográfica y $L$ es siempre una comparación de igualdad sobre su salida.
- [ ] Porque $F$ cubre el alta, la baja y el cambio de una entidad, y $L$ cubre la selección del principal correspondiente.

> $F: A \to C$ se aplica típicamente al dar de alta la entidad, y $L: A \times C \to \{0,1\}$ en cada verificación, sobre el $a$ que la entidad trae en ese momento: no son la misma operación mirada dos veces. Quien aporta $A$ es la entidad externa, pero $F$ y $L$ son ambas del sistema. Con claves en texto plano las dos casi colapsan, y por eso la tercera opción resulta tentadora, aunque en general no tienen por qué parecerse. El alta, la baja y el cambio son las funciones de selección $S$.

## ¿Por qué limitar la cantidad de intentos no defiende contra un ataque offline? {#quiz-bloque-2-seguridad:ataque-offline-contra-online}
> pagina: ataques-a-un-sistema-de-autenticacion

- [ ] Porque el ataque offline prueba las candidatas contra la función de login, y esa función no lleva registro de los intentos fallidos.
- [ ] Porque el atacante offline conoce la sal, y con ella puede saltear la verificación en lugar de resolverla.
- [ ] Porque el ataque offline busca el $a$ original de la víctima, y no cualquier $a$ que produzca el mismo $c$ almacenado.
- [x] Porque el atacante ya consiguió $c$ y verifica cada candidata computando $f(a)$ en su propia máquina, sin volver a tocar el sistema real.

> Los dos modos de ataque se distinguen por cómo se comprueba un candidato. El online intenta autenticar vía $l(a) \in L$ contra el sistema real, y por eso cada intento se puede auditar, demorar o bloquear. El offline requiere haber conseguido $c$ de antemano —el `/etc/shadow` de Linux, el archivo `SAM` de Windows— y después corre sin más límite que el poder de cómputo del atacante. La única defensa posible ahí es subir el costo de calcular $f(a)$, que es lo que hace `PBKDF2`. La tercera opción invierte el objetivo real: al atacante le sirve cualquier $a$ que produzca el $c$ asociado a la entidad, no necesariamente la clave original.

## Un atacante roba el archivo de contraseñas y ataca una única cuenta puntual. ¿Qué le agrega la sal a esa cuenta? {#quiz-bloque-2-seguridad:salting-una-sola-cuenta}
> pagina: salting

Cada registro guarda $f(a) = x \Vert f'(a,x)$, con $x$ la sal de esa cuenta.

- [ ] Multiplica por $n$ el costo del ataque, con $n$ la cantidad de cuentas presentes en el archivo robado.
- [ ] Encarece cada evaluación de $f'$, porque la función tiene que procesar un argumento más largo que la clave sola.
- [x] Nada: la sal es pública, el atacante la lee del propio registro y el costo de romper esa clave queda exactamente igual.
- [ ] Impide el ataque por completo, porque sin conocer $x$ no se puede recalcular $f'(a,x)$ para compararlo contra el valor almacenado.

> La sal no es secreta: se guarda en claro junto al digest, precisamente porque la verificación la necesita para recalcular $f'(a,x)$. Lo que rompe es la amortización entre víctimas: sin sal, una pasada del diccionario sirve para todas las cuentas a la vez; con sales distintas hacen falta $n$ pasadas, una por valor de sal. Contra una sola cuenta ese factor desaparece, y la fórmula de Anderson no cambia en nada cuando $n=1$. Subir el costo por evaluación es el trabajo de una función deliberadamente lenta como `PBKDF2`, no de la sal.

## El challenge-response nunca transmite la clave. ¿Qué rendija queda igual, y cómo la cierra EKE? {#quiz-bloque-2-seguridad:eke-cierra-la-verificacion-offline}
> pagina: challenge-response-y-eke

- [x] Quien escucha el canal se queda con el par $(r, f(k,r))$ en claro y prueba candidatas $k'$ en su propia máquina; EKE cifra los tres mensajes con una clave de sesión y deja al atacante sin material para comparar.
- [ ] Queda abierta la reutilización de una respuesta vieja capturada antes; EKE la cierra agregando un número de secuencia a cada ronda.
- [ ] Queda abierto que el verificador tenga que conocer $k$; EKE lo evita reemplazando $f$ por una función de hash sin clave.
- [ ] Queda abierta la suplantación del challenge por un tercero; EKE la cierra haciendo que el verificador firme $r$ antes de enviarlo.

> Capturar una sola vez el diálogo convierte un mecanismo pensado para atacarse online en uno atacable offline: con $r$ y $f(k,r)$ en la mano, el atacante calcula $f(k',r)$ para cada candidata sin volver a interactuar con ninguna de las dos partes, y sin límite de intentos ni de tiempo. EKE envuelve los tres mensajes en un canal cifrado con $k_s$, así que ya no hay par en claro contra el cual comparar: la rendija se cierra porque el atacante pierde el material, no porque $f$ se haya vuelto más fuerte. La reutilización de una respuesta vieja ya la impide el challenge, que debe ser fresco e impredecible en cada ronda.

## Un alumno señala que exigir dos firmas contradice el principio de economía de mecanismos. ¿Cuál es la posición de la cátedra? {#quiz-bloque-2-seguridad:principios-no-son-consistentes}
> pagina: principios-de-diseno

- [ ] Que economía de mecanismos prevalece, porque la simplicidad es una de las dos ideas madre de las que los ocho principios son casos particulares.
- [x] Que la contradicción es real y se acepta sin resolver: los ocho principios no son consistentes entre sí y se balancean caso por caso.
- [ ] Que no hay contradicción, porque cada firma es un mecanismo separado y la complejidad de cada uno por separado no aumenta.
- [ ] Que separación de privilegios prevalece siempre que haya dinero en juego, y economía de mecanismos en el resto de los casos.

> La cátedra acepta de plano que pedir dos firmas es objetivamente más complejo que pedir una, y que los principios se balancean caso por caso sin ninguna jerarquía que resuelva el conflicto de antemano. Es la evidencia más clara de que la filmina que los introduce tenía razón al llamarlos "principios guía de alto nivel" y no reglas. Ninguna de las otras opciones es sostenible: no hay prioridad fijada por idea madre ni por monto, y separar la firma en dos mecanismos no cancela el costo de complejidad, sólo lo reparte.

## En la cadena Política → Aseguramiento → Mecanismo, ¿qué aporta el eslabón del medio? {#quiz-bloque-2-seguridad:cadena-politica-aseguramiento-mecanismo}
> pagina: confianza-y-aseguramiento

- [ ] Define de manera explícita las expectativas de seguridad que el sistema debe cumplir.
- [x] Justifica con evidencia que el mecanismo sigue la política, que es lo único que distingue a un mecanismo correcto de uno que la viola y todavía no se probó.
- [ ] Implementa los ejecutables diseñados para hacer cumplir lo que la política exige.
- [ ] Convierte la confianza en una escala discreta, de modo que un sistema quede clasificado como confiable o no confiable.

> Las expectativas explícitas son la política; los ejecutables son el mecanismo. El aseguramiento es la confianza obtenida a través de técnicas específicas, es decir, la justificación de por qué se confía. Sin política, "mecanismo seguro" no significa nada, porque falta decir seguro contra qué; sin aseguramiento, un mecanismo que cumple por casualidad es indistinguible de uno que falla y nadie probó todavía. La cuarta opción invierte una definición de la clase: la confianza es gradual, no una escala discreta, y afirmar que algo es seguro sin mostrar evidencia es en sí mismo una señal de alarma.

## Un pentest de dos semanas termina sin hallazgos. ¿Qué se puede concluir? {#quiz-bloque-2-seguridad:pentest-no-prueba-ausencia}
> pagina: verificacion-formal-y-prueba-de-penetracion

- [ ] Que el sistema no tiene vulnerabilidades explotables desde afuera, aunque nada se afirme sobre un atacante con acceso interno.
- [ ] Que el sistema cumple su política de seguridad dentro del ambiente probado, sin que eso se extienda a la instalación ni al uso.
- [x] Que ese equipo no encontró nada con el tiempo y las hipótesis que tenía: la prueba de penetración nunca prueba la ausencia de vulnerabilidades.
- [ ] Que conviene repetirlo con el mismo equipo, porque sólo la repetición del mismo test permite concluir que no hay nada.

> La tabla que compara los dos métodos es tajante: las dos técnicas prueban la existencia de vulnerabilidades, pero sólo la verificación formal puede probar su ausencia, y aun así únicamente si incluye todos los factores externos, cosa que en la práctica no ocurre. Un pentest limpio es evidencia de que no se encontró nada, que es información bastante más débil que "no hay nada que encontrar". La segunda opción describe justamente lo que reclama la verificación formal sobre un ambiente acotado, no lo que puede afirmar un pentest.

## ¿Cómo se aplica STRIDE, según la instrucción escrita en la propia filmina? {#quiz-bloque-2-seguridad:stride-por-frontera-de-confianza}
> pagina: stride-y-arboles-de-ataque

- [ ] Una sola vez sobre el sistema completo, para no repetir la misma amenaza en componentes distintos.
- [x] Preguntando, por cada frontera de confianza, cómo un atacante podría cumplir cada una de las seis amenazas.
- [ ] Sobre cada vulnerabilidad ya encontrada, para clasificarla dentro de una de las seis categorías.
- [ ] Descomponiendo cada amenaza en las acciones y condiciones necesarias para que llegue a concretarse.

> La instrucción de uso es la parte que más se olvida: STRIDE no es una lista para memorizar, es un cuestionario que se aplica sistemáticamente en cada frontera de confianza identificada durante la descomposición de la aplicación. Bien aplicado produce una tabla de seis filas por zona, no seis filas para todo el sistema; la misma letra apunta a mecanismos de defensa distintos según dónde se la formule. Tampoco es una taxonomía para etiquetar hallazgos a posteriori: se usa antes, para derivar amenazas. La última opción describe el árbol de ataque, la herramienta complementaria que profundiza una amenaza puntual.

## `while x = 0 loop {}`, con $x \in \{0,1\}$ equiprobable y $y = 0$ si el programa termina. ¿Hay flujo de información? {#quiz-bloque-2-seguridad:flujo-por-comportamiento}
> pagina: flujo-explicito-e-implicito

- [ ] No hay flujo: sin ninguna asignación no existe traspaso de información, sólo un problema de disponibilidad del programa.
- [ ] Hay flujo, y es explícito, porque la condición del `while` lee el valor de $x$ en cada iteración.
- [ ] Hay flujo sólo si $x$ toma más de dos valores; con dos valores equiprobables $H(x \mid y)$ no llega a anularse.
- [x] Hay flujo implícito: lo observable es si el programa termina, y ese único bit determina $x$ por completo, con $H(x) = 1$ y $H(x \mid y) = 0$.

> Es el caso límite de la clasificación. Con $x=1$ el `while` no entra al cuerpo y el programa termina; con $x=0$ queda colgado para siempre. Saber si terminó determina $x$ sin ambigüedad, así que $H(x \mid y) = 0 < 1 = H(x)$ y se cumple la definición formal de flujo, aunque no exista una sola instrucción de asignación en el programa. Justamente por eso es implícito: explícito es el flujo con una escritura del tipo $y := f(x)$. Y la cuenta no depende del tamaño del dominio: dos valores equiprobables ya dan un bit de entropía que la observación elimina entero.

## Un proceso sin etiquetas lee una variable marcada $\{\text{alto}\}$ y luego escribe en $y$ un resultado que no usa ese valor. ¿Qué hace un mecanismo dinámico de control de flujo? {#quiz-bloque-2-seguridad:etiquetas-se-propagan-con-el-escritor}
> pagina: mecanismos-de-control-de-flujo

- [ ] Deja pasar la escritura, porque el valor escrito no depende del dato de alta etiqueta y por lo tanto no lo filtra.
- [x] Marca $y$ con $\{\text{alto}\}$ igual, y bloquea la escritura si la zona de $y$ tiene esa etiqueta entre las prohibidas.
- [ ] Bloquea ya la lectura inicial, porque un proceso sin etiquetas no puede leer un dato etiquetado por encima de él.
- [ ] Rechaza el programa entero antes de ejecutarlo, porque no logra certificar ese comando en tiempo de compilación.

> La regla de propagación tiene dos mitades: al leer, el proceso adquiere la etiqueta del dato leído; al escribir, el dato de salida queda marcado con todas las etiquetas que el escritor tenía acumuladas hasta ese momento, no sólo con las del dato que originó ese cálculo puntual. La etiqueta viaja con el escritor, así que basta haber leído alguna vez algo de alta etiqueta para que todo lo producido después salga marcado igual. Es una regla deliberadamente conservadora, que paga el precio de bloquear también flujos que no eran tales. Certificar comandos antes de ejecutar es el mecanismo estático, la otra mitad de la dicotomía.

## En el algoritmo de cuadrado y multiplicación para $a^{b} \bmod n$, ¿qué filtra el tiempo total de ejecución sobre el exponente secreto $b$? {#quiz-bloque-2-seguridad:side-channel-exponenciacion-modular}
> pagina: canales-ocultos-y-side-channels

En cada ronda, la multiplicación de la rama `if` corre sólo si $b_i = 1$; el cuadrado corre siempre.

- [ ] El valor de la base $a$, que el atacante ya conoce porque es él quien la elige en cada consulta.
- [ ] El tamaño del módulo $n$, y con él la longitud de la clave usada por el esquema.
- [x] Cuántos bits de $b$ valen 1, porque sólo esas rondas pagan la multiplicación extra: el tiempo total es, hasta una constante, función del peso de Hamming de $b$.
- [ ] En qué posiciones de $b$ están los bits en 1, dato que una sola medición del tiempo total ya entrega ordenado.

> El cuadrado se ejecuta en todas las rondas y no distingue nada; la multiplicación de la rama condicional se ejecuta únicamente cuando el bit vale 1, así que el tiempo total cuenta cuántos unos tiene el exponente, sin decir dónde están. Ésa es la versión mínima del ataque. Llegar a las posiciones exige más: medir el tiempo de cada ronda por separado, con la misma clave y bases distintas conocidas, y correlacionar estadísticamente contra cada hipótesis de $b_i$ para reconstruir el exponente bit por bit. Es la razón por la que toda implementación seria de exponenciación modular corre hoy en tiempo constante.

## Se quiere descartar un mail cuyo adjunto contiene un archivo malicioso. ¿Qué tipo de firewall hace falta? {#quiz-bloque-2-seguridad:firewall-que-entiende-el-protocolo}
> pagina: firewalls

- [ ] Un packet filter, porque alcanza con bloquear el puerto de SMTP en el sentido entrante y dejar pasar el resto.
- [x] Un application firewall o proxy, porque hay que ensamblar los paquetes y reconstruir el email, y eso exige entender el protocolo de aplicación completo.
- [ ] Un statefull packet filter, porque al clasificar la conexión como nueva, existente o inválida puede reconstruir el mensaje que la atraviesa.
- [ ] Cualquiera de los tres: la diferencia entre ellos es de costo y de rendimiento, no de qué parte del paquete inspeccionan.

> Los tres tipos se ordenan por cuánto del paquete miran. El packet filter mira sentido y encabezados —host, puerto, flags, protocolo de transporte— y es ciego al contenido; el statefull agrega memoria de conexiones y manipulación de paquetes, pero sigue sin entender el protocolo de aplicación. Escanear un adjunto exige el paso de ensamblar los paquetes y reconstruir el email, que sólo puede dar quien entiende SMTP y no sólo TCP. El precio es la especificidad: un proxy de email no sirve para filtrar tráfico web.

## En el caso de estudio, el firewall interno permite en el sentido DMZ → red interna únicamente tráfico SMTP proveniente del email server. ¿Por qué? {#quiz-bloque-2-seguridad:asimetria-del-firewall-interno}
> pagina: reglas-de-los-firewalls-externo-e-interno

- [ ] Porque el firewall externo ya filtró todo lo demás y repetir el control en el interno sería redundante.
- [ ] Porque el firewall interno no realiza NAT y compensa esa limitación restringiendo la lista de protocolos permitidos.
- [ ] Porque el tráfico HTTP/S de la DMZ hacia adentro ya se redirige de forma transparente al proxy web y no necesita otra regla.
- [x] Porque un servidor de la DMZ comprometido no debe tener casi ningún camino de vuelta hacia adentro, y nada de la red interna necesita recibir conexiones iniciadas desde la DMZ salvo el correo.

> De los cuatro flujos posibles del caso de estudio, DMZ → interna es el único reducido a un solo protocolo y un solo origen, y es exactamente el reflejo de la primera razón de ser de la DMZ: si un servidor expuesto cae, la red interna sigue protegida. Las otras opciones fallan por hechos del propio material: toda comunicación con Internet pasa por los dos firewalls y no sólo por uno, ambos realizan NAT para ocultar direcciones internas, y la redirección transparente al proxy web ocurre en el sentido interna → DMZ, no al revés.

## ¿Cuál es la relación correcta entre un IDS y un IPS? {#quiz-bloque-2-seguridad:ids-contra-ips}
> pagina: deteccion-y-prevencion-de-intrusiones

- [x] El IPS no es una alternativa al IDS: necesita la misma capacidad de análisis y le agrega encima una etapa de respuesta automática, por lo general bloquear en el firewall el origen del ataque.
- [ ] El IPS reemplaza al IDS, porque reconoce los mismos patrones de ataque y además actúa sobre ellos.
- [ ] El IDS analiza eventos de red y el IPS eventos de hosts; se complementan porque cada uno cubre una fuente distinta.
- [ ] El IPS vuelve innecesaria la inspección manual de eventos, porque una respuesta automática no genera falsos positivos.

> Un IPS lleva la detección "un nivel más adelante": no puede actuar sobre un patrón que no supo reconocer, así que contiene la capacidad de análisis de un IDS y le suma la respuesta. La tercera opción parte un criterio que en realidad es interno al IDS, que idealmente combina eventos de red y de hosts porque ninguna de las dos fuentes alcanza sola. Y la respuesta automática no elimina el riesgo de equivocarse: un falso positivo en un IPS ya no es una alerta que alguien revisa, es una acción real como bloquear tráfico legítimo, y por eso la inspección manual periódica sigue figurando como recaudo aparte.
