---
title: Seguridad de un MAC
resumen: 'El experimento Mac-Forge y el ejercicio de los tres MACs de la filmina 17: un MAC es infalsificable si ningún adversario eficiente con oráculo de etiquetado logra etiquetar un mensaje que no consultó, salvo con probabilidad despreciable.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Mac-Forge, Seguridad de un MAC, Infalsificable, Falsificación existencial, Message Authentication Experiment, Strong unforgeability]
type: concepto
unidad: 1
clase: 3
orden: 4
created: 2026-08-28
updated: 2026-09-06
tags: [criptografia, mac, mac-forge, infalsificable, integridad, juegos, replay, clase-03]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt1-Transcripcion.VTT", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "raw/practicas/Clase 4.pdf"]
---

# Seguridad de un MAC

**Qué significa que un MAC sirva.** La [[message-authentication-code|terna (Gen, Mac, Vrfy)]] sólo pide que una etiqueta legítima verifique, y eso lo cumple cualquier disparate. Esta nota trae la prueba que separa los MACs de los disparates —el experimento `Mac-Forge`—, explica **por qué la definición es tan exigente** como es, y resuelve el ejercicio de los tres MACs de la filmina 17, que es el ejercicio que la clase deja hecho y el molde de lo que se pregunta.

> **Cómo se citan los cues acá.** La Clase 03 se dictó en **dos sesiones** —27/08 y 03/09— y cada transcripción numera sus cues desde 1, así que un número suelto no identifica nada. Por eso todo cue lleva **prefijo de parte**: `(cues pt1 N-M)` para el 27/08 y `(cues pt2 N-M)` para el 03/09.

**Hay dos filminas de `Mac-Forge`, no una.** La 15 del deck de teoría (27/08) y la 2 del deck de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] (31/08), que lo reescribe en tres pasos y agrega algo que teoría nunca dice. Cada vez que esta nota cuenta pasos o señala una errata, aclara de cuál de las dos habla.

---

## El experimento Mac-Forge

*Message Authentication Experiment*, notado $\mathsf{Mac\text{-}Forge}_{A,\Pi}$. Dado un [[seguridad-computacional#Nivel de seguridad|nivel de seguridad]] $n$, un adversario $A$ y un MAC $\Pi(n)$:

$$\begin{aligned}
&1)\ \ \text{se genera una clave } k \leftarrow \mathcal{K}\\
&2)\ \ A \text{ obtiene } f(x) = \mathsf{Mac}_k(x)\ \text{(el oráculo de etiquetado)}\\
&3)\ \ A \text{ realiza las evaluaciones de } f(x) \text{ que quiera; sea } Q \text{ el conjunto de esas consultas}\\
&4)\ \ A \text{ emite } (m,\, t) \ \text{ con } \ m \notin Q
\end{aligned}$$

$$\mathsf{Mac\text{-}Forge}_{A,\Pi} = 1 \quad\text{si}\quad \mathsf{Vrfy}_k(m,t) = 1$$

Y la definición:

$$\Pr\bigl[\mathsf{Mac\text{-}Forge}_{A,\Pi}(n) = 1\bigr] \le \mathsf{negl}(n) \quad\Longrightarrow\quad \Pi \ \text{es infalsificable}$$

O sea: $\Pi$ es **infalsificable** —*unforgeable*— si **ningún** adversario $\mathrm{PPT}$ gana el experimento salvo con probabilidad despreciable.

Las tres piezas que hay que leer con cuidado, porque es donde se juega todo:

| Pieza | Qué dice |
|---|---|
| $Q$ | el conjunto de los mensajes que $A$ le **pidió** al oráculo. Se registra aparte, porque el paso 4 lo necesita |
| $m \notin Q$ | $A$ tiene que falsificar sobre un mensaje **nuevo**. Sin esta restricción ganaría reenviando cualquier par que ya recibió |
| $\mathsf{negl}(n)$ | el umbral no es $\tfrac12 + \mathsf{negl}(n)$ como en las [[pruebas-de-indistinguibilidad\|pruebas de indistinguibilidad]], sino **despreciable a secas**. Ver la sección siguiente |

> **Errata de la filmina:** el enunciado dice *"dado un nivel de seguridad $n$, un adversario $A$, y un **Criptosistema** $\Pi(n)$"*, pero `Mac-Forge` se corre contra un **MAC** —terna $(\mathsf{Gen},\mathsf{Mac},\mathsf{Vrfy})$—, no contra un criptosistema. Es copy-paste de la filmina de `CPA`. **La corrige el propio docente en vivo** (cue pt1 425): *"E ignorando que la presentación tiene un error —¿no?— y hablo de un criptosistema, lo corrijo."* Es la única errata que la cátedra marca explícitamente en toda la clase.

> **Sobre la frase que parece cortada.** El texto extraído del PDF termina en *"Si Pr[Mac-Forge=1] <= neg(n) => Π es"* y da la impresión de que falta la palabra. **Verificado sobre la filmina renderizada: la palabra "infalsificable" está**, en la línea siguiente, desbordada por debajo de la línea horizontal del pie de página. O sea que **no es una errata de contenido, es un desborde de maquetación** — pero conviene saberlo, porque cualquier extracción automática del PDF se come justo el término que define el concepto. *(Precisión nuestra.)*

> **Un detalle que rompe el paralelismo visual de las cuatro pruebas** *(precisión nuestra).* `Eav`, `Mul`, `CPA` y `CCA` se enuncian en **5 pasos**; `Mac-Forge` tiene **4**, y el docente lo dice al pasar (cue pt1 426). El paso que falta es el sorteo del bit oculto $b \leftarrow \{0,1\}$: acá no hay bit que adivinar, porque el adversario no tiene que *distinguir* nada, tiene que **fabricar** algo. Esa es la diferencia estructural entre las dos familias de pruebas, y de ella se desprende todo lo de la sección siguiente.

> **Dos precisiones de Katz & Lindell** (Definición 4.2). (a) $A$ recibe **acceso de oráculo** a $\mathsf{Mac}_k(\cdot)$, no "la función" — el $f(x) = \mathsf{Mac}_k(x)$ de la filmina sugiere que $A$ se lleva el algoritmo con la clave adentro, que sería absurdo. (b) $Q$ es el conjunto de las **consultas**, no de las respuestas; la filmina lo llama *"el conjunto de las evaluaciones"*, que es ambiguo. El nombre completo de la propiedad en el libro es **existencialmente infalsificable bajo ataque adaptativo de mensaje escogido**: *existencial* porque falsificar **algún** mensaje alcanza, *adaptativo* porque cada consulta puede depender de las respuestas anteriores.

### La versión de la práctica: tres pasos, un nombre corto y dos erratas

La filmina 2 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] reescribe el mismo experimento **en tres pasos**, no en cuatro: mete dentro de un solo paso el oráculo, la definición de $Q$ y la emisión del par, y deja el veredicto como paso 3 con las dos condiciones juntas.

$$\begin{aligned}
&1)\ \ k \leftarrow \mathsf{Gen}(n)\\
&2)\ \ A \text{ recibe } 1^{n} \text{ y acceso al oráculo } \mathsf{Mac}_k(\cdot);\ Q \text{ es el conjunto de sus consultas};\ A \text{ emite } \langle m,t\rangle\\
&3)\ \ \text{la salida es } 1 \iff \mathsf{Vrfy}(m,t)=1 \ \text{ y } \ m \notin Q
\end{aligned}$$

No cambia nada de fondo —son las mismas piezas reagrupadas—, pero **la nota no puede decir "cuatro pasos" sin decir de cuál filmina habla**: cuatro es la numeración de la filmina 15 de teoría, tres la de la filmina 2 de la práctica, y cinco la de las pruebas de indistinguibilidad. Lo que se conserva en las tres es qué se registra y qué se prohíbe.

**El nombre corto.** La misma filmina define la propiedad como *"MAC es seguro (infalsificable) **ante un ataque de mensaje elegido**"*. Es la forma abreviada del nombre largo de Katz & Lindell —*existencialmente infalsificable bajo ataque adaptativo de mensaje escogido*—, y es el vocabulario que usa la cátedra: conviene reconocer los dos.

> **Errata de la filmina** (Práctica 04, filmina 2; verificada en el render, no en el texto extraído)**:** la cota está escrita $\Pr[\mathit{MAC\text{-}Forge}_{A,\pi}(n)=1] \le \mathit{negl}(\ )$, **con el paréntesis vacío**. Falta el argumento: es $\mathit{negl}(n)$. Sin él la cota no dice nada, porque lo que vuelve exigible la definición es justamente que la función despreciable se mida contra el nivel de seguridad.

> **Errata de la filmina** (Práctica 04, filmina 2; verificada en el render)**:** el paso 2 dice *"El adversario $A$ emite un par $\langle m,t\rangle$**.de igual longitud**"*. La cláusula **sobra**: en `Mac-Forge` el adversario emite **un solo par** mensaje-etiqueta y no hay contra qué comparar longitudes. Es un arrastre de los experimentos de indistinguibilidad, donde el adversario sí emite **dos mensajes** $m_0$ y $m_1$ de igual longitud — y de hecho la filmina 15 de la misma práctica, que es `PrivK`$^{CCA}$, la usa bien. Verificado además que **la filmina 15 de teoría no tiene esa cláusula**: es defecto exclusivo del deck de la práctica. Y falta el espacio después del punto, que es lo que delata el copiado.
>
> Es la misma clase de desliz que la errata *"Criptosistema"* de la filmina 15 de teoría —copiar el enunciado de la prueba de indistinguibilidad y no terminar de adaptarlo—, con una diferencia: aquélla **la cátedra la corrige en voz**, ésta no.

---

## Por qué la cota es despreciable y no un medio

En `Eav`, `Mul`, `CPA` y `CCA` el adversario **tira una moneda y acierta la mitad de las veces**; por eso el umbral de esas pruebas es $\tfrac12 + \mathsf{negl}(n)$ — el $\tfrac12$ es el piso que nadie puede evitar. En `Mac-Forge` no hay piso: un adversario que emite un par $(m,t)$ al azar **prácticamente nunca** acierta, así que la exigencia se escribe directamente contra $0$.

> [!quote]- De la transcripción — la asimetría con las pruebas de indistinguibilidad (cues pt1 447-452)
> **447.** "A diferencia de lo que pasaba con los criptosistemas, que —si se acuerdan— era: recibe un mensaje y tengo que elegir entre dos grupos; **entonces tiro una moneda y la mitad de las veces le pego, la mitad no**."
> **448-450.** "Acá las chances están en que, si elige un mensaje y una etiqueta al azar, hay tipo —no sé— **mil casos en un trillón** de que le pegue. Entonces **la probabilidad de que gane la prueba si tira valores al azar es prácticamente 0**."
> **451-452.** "Por eso el sesgo es hacia el 0 en la nomenclatura de la prueba, nada más. Pero la prueba es esa."

> **El "prácticamente 0" es una hipótesis sobre el tamaño de la etiqueta, no un regalo** *(Katz & Lindell, Ejercicio 4.1).* Si las etiquetas tienen $t(n)$ bits, adivinar una al azar acierta con probabilidad $\approx 2^{-t(n)}$. Para que eso sea despreciable hace falta que $t(n)$ sea **superlogarítmica**: si $t(n) = O(\log n)$ entonces $2^{-t(n)} \ge 1/p(n)$ para algún polinomio, y **ningún MAC con etiquetas tan cortas puede ser seguro**, por bien construido que esté. Es el análogo exacto del *"espacio de claves suficiente"* de la [[ataque-de-fuerza-bruta|fuerza bruta]]: condición necesaria, nunca suficiente.

> **Y eso dejó de ser sólo apostilla de libro.** En el repaso del 03/09 el docente dice lo mismo como **criterio de diseño**: la fuerza bruta sobre etiquetas existe siempre —*"alguien que se ponga a probar sin parar etiquetas podría encontrar una que pase la validación: sí, podría"*— y lo único que la vuelve despreciable es que los conjuntos se elijan tan grandes como para que la chance sea muy baja, *"lo mismo que los criptosistemas: se diseñan para que los parámetros —el tamaño de las etiquetas, el tamaño de las claves— vuelvan despreciablemente baja esa probabilidad de éxito"* (cues pt2 66-88). Los tamaños concretos que da, con su corrección de unidades, están en [[message-authentication-code#Los tamaños reales, y la fuerza bruta sobre la etiqueta|Message Authentication Code § Los tamaños reales, y la fuerza bruta sobre la etiqueta]].

Y el marco general en el que hay que leer las cuatro pruebas, que el docente repite acá:

> [!quote]- De la transcripción — qué es una prueba de seguridad (cues pt1 427-439)
> **427-428.** "Acuérdense que la idea de las pruebas de seguridad es que son **una prueba estadística**: se repite muchas veces y se obtiene un resultado probabilístico de la prueba. Y compiten siempre **un algoritmo adversario y la función criptográfica que estamos probando**."
> **434-436.** "El adversario puede evaluar las veces que quiera $f(x)$ —acuérdense que acá, cuando hablamos de 'las veces que quiera', **tampoco es infinitas veces: pedimos que el adversario tenga una complejidad polinómica**. Una cantidad grande, pero polinómica, de veces."
> **437-439.** "Y esto se registra aparte, porque acá sí hay un registro de las evaluaciones —de los valores de $x$ para los cuales pidió la etiqueta— porque en el cuarto paso se le pide al algoritmo atacante que emita un par de mensaje y etiqueta **donde el mensaje no haya sido ninguno de los mensajes que probó con la función**."

---

## Cómo leer la definición: por el negativo, y las tres combinaciones que descarta

Volviendo sobre la prueba en el repaso del 03/09, el docente da **dos herramientas de lectura** que no están en ninguna filmina y que conviene tener, porque son la forma más rápida de saber qué garantiza exactamente un MAC infalsificable.

**Primera: las pruebas de seguridad se leen por el negativo.** Lo que se demuestra no es que el esquema haga algo, sino que **no existe** un adversario que lo rompa. Traducido a lenguaje llano: *nadie, sin conocer la clave, puede inventarse un par mensaje-etiqueta que pase la validación*.

**Segunda: la infalsificabilidad descarta tres combinaciones de una sola vez.** Es la enumeración que vuelve concreto el enunciado, y hay que poder recitarla:

| Lo que el atacante intenta | Por qué queda descartado |
|---|---|
| **otro** mensaje con **otra** etiqueta | sería una falsificación sobre $m \notin Q$ |
| el **mismo** mensaje con **otra** etiqueta | queda fuera de `Mac-Forge` tal como está escrito, pero lo cubre la versión **fuerte** — y para todo MAC con verificación canónica las dos coinciden, [[#Lo que la definición no cubre\|ver abajo]] |
| **otro** mensaje con la **misma** etiqueta | es la falsificación por reutilización de etiqueta: exactamente lo que rompe el segundo y el tercer MAC del ejercicio |

De ahí sale la consecuencia operativa que el docente saca a continuación: si alguien modifica el mensaje, la verificación falla y **la modificación se detecta**; y si además intenta "arreglar" la etiqueta para que cierre, no puede — porque si pudiera, existiría el ataque que la prueba declara inexistente.

> [!quote]- De la transcripción — la prueba pensada por el negativo y las tres combinaciones (cues pt2 48-63)
> **48-52.** "Las pruebas de seguridad siempre están buenas pensadas **por el negativo**: suponiendo que no existe un atacante — especialmente para nosotros, los ingenieros. ¿Qué quiere decir esta prueba de seguridad? La prueba de seguridad, en principio, quiere decir que **nadie, sin conocer la clave, va a poder inventarse un par etiqueta-mensaje que pase la validación**."
>
> **57-59.** "El que sea infalsificable, que haya pasado la prueba, me dice que nadie puede emitirme **otro mensaje con otra etiqueta, o el mismo mensaje con otra etiqueta, o otro mensaje con la misma etiqueta**. Ninguna combinación que logre pasar la verificación."
>
> **60-63.** "¿Y eso qué quiere decir? Que si alguien modifica el mensaje, cuando yo lo verifique no va a pasar: **me voy a dar cuenta de que es una modificación**. Y si alguien trata de modificar el mensaje y arreglar la etiqueta, no va a poder hacerlo, porque si no existiría un ataque de este tipo."

*(La segunda de las tres combinaciones es, en rigor, la infalsificabilidad **fuerte** y no la de la filmina 15 — el docente las junta. La distinción, y por qué en la práctica da lo mismo, está en [[#Lo que la definición no cubre|Lo que la definición no cubre]]. **Precisión nuestra.**)*

---

## Las dos observaciones, y por qué la definición es tan exigente

La filmina 16 son dos viñetas secas, y son **el núcleo conceptual del tema**. Las dos dicen lo mismo desde dos lados: la definición le regala al adversario todo lo que se pueda regalar.

> - El adversario puede obtener un MAC para **cualquier** mensaje que elija.
> - Se considera roto el MAC si el adversario puede falsificar **cualquier** mensaje, **independientemente de si tiene sentido o no**.

### El adversario puede pedir el MAC de cualquier mensaje

*(Justificación nuestra; la filmina enuncia la regla sin defenderla.)* Tres razones, y ninguna es teórica:

1. **Es lo que pasa en un protocolo real.** Cualquier servicio que autentique mensajes en nombre del usuario es un oráculo de etiquetado: le mandás lo que quieras y te devuelve la etiqueta. Es el mismo argumento con el que la Clase 2 justificó el oráculo de `CPA` — un servidor que cifra lo que le pidan existe, no hay que inventarlo.
2. **El diseñador no sabe qué mensajes se van a autenticar.** Un MAC se diseña una vez y se despliega en contextos que su autor nunca vio. Una definición que sólo garantizara seguridad *para ciertos mensajes* sería inútil, porque no hay forma de saber de antemano cuáles son.
3. **Es la única forma de que la garantía sea sobre la clave y no sobre el uso.** Si el adversario ya vio las etiquetas de todos los mensajes que quiso y aun así no puede producir una nueva, entonces lo que lo frena es **la clave**, que es exactamente lo que se quería probar.

### Se considera roto aunque la falsificación no tenga sentido

Ésta es la que provoca la objeción inmediata —*"pero nadie iba a autenticar ese mensaje"*— y es la que hay que poder defender. *(Argumentos nuestros, salvo donde se indica.)*

1. **"Tener sentido" no es una propiedad matemática.** Depende de la aplicación, del formato, del idioma y hasta del momento. Una definición que dijera *"el adversario no puede falsificar mensajes con sentido"* **no se puede verificar ni demostrar**, porque no hay manera de formalizar el predicado. Una definición que no se puede demostrar no sirve para nada.
2. **La conservadora es la barata.** Los dos errores posibles no cuestan lo mismo: una definición **demasiado fuerte** hace que descartes un esquema que quizá era usable en tu caso puntual; una definición **demasiado débil** hace que despliegues algo roto. Con esa asimetría, la elección conservadora es la única razonable.
3. **Históricamente, ningunear la falsificación "sin sentido" salió mal.** Es el argumento con el que el docente cierra el punto, y es una historia de veinte cues que no está en ninguna filmina. Resumida: en **2004** un grupo de matemáticos chinos encontró una forma nueva de falsificar, y la primera reacción de la industria fue **ningunearla** —*"el original era un PDF, la falsificación no es un PDF, así que no sirve para nada"*—; para **2006** el ataque estaba automatizado y corría en una máquina cualquiera; para **2008** producía un millón de falsificaciones por segundo, y alguien lo usó para **falsificar certificados digitales** de compañías reales. Cuatro años entre *"es un ataque teórico"* y *"esto está roto en producción"*.

> [!quote]- De la transcripción — 2004, el ninguneo, y por qué falló (cues pt1 472-493)
> **472-476.** "Esto lo agregué porque en el 2004 hubo un avance muy importante en todo este campo de la criptografía: **un grupo de matemáticos chinos encontró una forma nueva de atacar funciones —primitivas de los MACs, que se usan para integridad también— y lograban generar falsificaciones**."
> **477-480.** "Y lo primero que hicieron, especialmente las empresas que tenían productos que dependían de eso, fue básicamente **ningunearlos** diciendo: *no importa, porque las falsificaciones que crean no tienen sentido*. Uno se va a dar cuenta rápido: **el original era un PDF, la falsificación no es un PDF, así que no sirve para nada. Es un ataque teórico muy lindo, pero no sirve para nada.**"
> **481-486.** "El 2004 fue **un año bisagra**: el ataque era completamente nuevo en cuanto a metodología, y requería **una supercomputadora de esos tiempos y dejarla trabajando sus 6, 7 horas**. Pero como suele pasar con todo lo novedoso, ni bien salió se armó una comunidad muy entusiasta de *queremos entenderlo, queremos mejorarlo*. **La historia corta es: para el 2006 se había mejorado y automatizado el ataque lo suficiente como para que corra en la computadora de cualquiera. Para el 2008 se había optimizado el algoritmo al punto que se podían generar un millón de falsificaciones por segundo.**"
> **487-490.** "Y ahí se abrieron caminos donde el sinsentido empezó a tener grietas. El sinsentido se cayó cuando alguien dijo: *tal vez no quiero falsificar todo el mensaje, tal vez quiero falsificar una parte del mensaje; entonces **dejo el prefijo y el sufijo igual y modifico algo en el medio***. Y gracias a eso **lograron falsificar certificados digitales**. Cuando un flaco apareció con un certificado digital de Google, de Microsoft y no me acuerdo qué otra compañía, falsificados —el tipo era bueno y **los generó pre-expirados**, porque era una prueba de concepto—, ahí sí se armó un revuelo bastante grande."
> **491-493.** "A partir de ese momento fue toda una **gran lección para la comunidad de las pruebas de seguridad**: parecen ser como algo así, muy draconianas, y creemos que hay un espacio en el medio — **hay que tener mucho cuidado con, cuando aparece un ataque, ignorarlo porque no parece práctico.**"

> **Qué es esa historia técnicamente.** El 27/08 el docente **no nombra la función ni a los autores**: habla de *"primitivas de los MACs"*, y el vault dedujo que se trataba de las **colisiones en funciones de hash** publicadas en 2004 por Xiaoyun Wang y coautores, `MD5` entre ellas, con el episodio final de los certificados como el ataque de **prefijo elegido** de 2008. **La deducción quedó confirmada por la cátedra el 03/09**, donde el mismo episodio se cuenta con nombre y apellido: *"un grupo de criptógrafos y matemáticos chinos encuentra una familia nueva de ataques —ataques de propósito general, ataques que afectan no a una función específica sino potencialmente a todas— y lo aplican sobre [MD5], que era la función más famosa del momento, y lo destrozan. Hoy día [MD5] se considera superquebrada"* (cues pt2 425-429). O sea que la atribución **deja de ser lectura nuestra** y pasa a ser material de clase → [[primitivas-de-hash-estandar|Primitivas de hash estándar]]. O sea que el ejemplo pertenece por tema a la segunda mitad de la clase: el estado de `MD5` está en [[primitivas-de-hash-estandar|Primitivas de hash estándar]] y la mecánica del costo de hallar colisiones en [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]]. Se cuenta acá porque **el argumento es sobre la definición**, no sobre el hash: es la evidencia empírica de que la exigencia de la filmina 16 no es un capricho académico.

> **Katz & Lindell le dedica una sección entera al mismo punto** — *"Is the definition too strong?"* (pág. 113) — y agrega el argumento que falta: el receptor de un mensaje autenticado suele ser **un programa, no una persona**, y un programa no evalúa si el contenido tiene sentido: parsea lo que le llegue y actúa. Lo que a un humano le parece basura puede ser un campo de longitud, un puntero o un flag perfectamente accionable.

---

## El ejercicio de los tres MACs

**Filmina 17.** *"Considerar la seguridad de los siguientes MACs"*:

$$\begin{aligned}
\text{(a)}\quad &\mathsf{Mac}_k(m) = G(k)\oplus m && (G(\cdot)\ \text{generador pseudoaleatorio})\\
\text{(b)}\quad &\mathsf{Mac}_k(m) = k \oplus \mathsf{first\_k\_bits}(m)\\
\text{(c)}\quad &\mathsf{Mac}_k(m) = \mathsf{Enc}_k(\lvert m\rvert) && (\mathsf{Enc}\ \text{CPA-Secure})
\end{aligned}$$

**Los tres se resolvieron en clase, y los tres son inseguros.** Las tres falsificaciones aciertan con **probabilidad 1** y usan **una sola consulta** al oráculo, así que ninguno cumple $\Pr[\mathsf{Mac\text{-}Forge}=1] \le \mathsf{negl}(n)$.

**Este mismo ejercicio es el [[guia-03-mac-y-funciones-de-hash#Ejercicio 1|Ej. 1 de la Guía 3]]** —los tres MACs, misma notación y mismo orden, incluidas las barras de $\lvert m\rvert$ en el tercero—, así que el ejercicio que abre esa guía ya viene resuelto de acá; lo que la guía agrega, y lo que le quita de contexto, está en la [[guia-03-mac-y-funciones-de-hash#Ejercicio 1|resolución plegada de ese ejercicio]].

### Lo que falta antes de poder resolverlo

El enunciado da **sólo `Mac`**: faltan `Gen` y `Vrfy`, y reconstruirlos **es la mitad del ejercicio**. No es un descuido de la filmina, es donde está la dificultad — y en el tercer MAC es literalmente lo que decide el resultado.

- **`Gen`**: se asume $k$ elegida **uniformemente** sobre el espacio de claves.
- **`Vrfy`**: se construye **canónica** —recalcular la etiqueta y comparar— **sólo si `Mac` es determinística**. Si no lo es, la verificación canónica ni siquiera cumple la [[message-authentication-code#La terna Gen, Mac y Vrfy|propiedad básica]] $\mathsf{Vrfy}_k(m,\mathsf{Mac}_k(m))=1$, o sea que rechazaría etiquetas legítimas.

> [!quote]- De la transcripción — el ejercicio está incompleto a propósito (cues pt1 504-507, 817-819)
> **504-507.** "Nos faltan 2 funciones acá de la terna. La función de clave: podemos asumir que se elige una clave al azar, **pensando el espacio de claves como la distribución uniforme**. La de verificación hay que pensarla un poco más: **como esta función es determinística, podemos asumir que la verificación va a ser volver a calcular el valor y ver si coincide con la etiqueta que nos pasaron**."
> **817-819.** "Lo primero que tenés que pensar acá es cómo sería la verificación, **porque nos está dando una definición incompleta de MAC**. Digo, por ahí hay gente que lo mira y ya sabe la verificación, pero tenemos que pensar cómo sería la verificación, **porque si no, no vamos a saber si falsificamos o no algo**."

### Primer MAC: la clave expandida xor el mensaje

$$\mathsf{Mac}_k(m) = G(k)\oplus m \qquad\qquad \mathsf{Vrfy}_k(m,t) = 1 \iff t = G(k)\oplus m$$

*(Para que el xor esté definido, $\lvert G(k)\rvert = \lvert m\rvert$: es un MAC de longitud fija, la del generador.)*

**Adversario $A$:**

1. Consultar el oráculo con $m^{(0)} := 0\cdots0$. Recibe $t^{(0)} = G(k)\oplus 0\cdots0 = G(k)$.
2. Elegir cualquier $m^{*} \ne 0\cdots0$ y emitir $\bigl(m^{*},\ t^{(0)}\oplus m^{*}\bigr)$.

**Análisis.** $Q = \{0\cdots0\}$, así que $m^{*}\notin Q$. Y la verificación acepta, porque $t^{(0)}\oplus m^{*} = G(k)\oplus m^{*} = \mathsf{Mac}_k(m^{*})$ por definición. Entonces $\Pr[\mathsf{Mac\text{-}Forge}_{A,\Pi}=1] = 1$.

Y es peor que una falsificación suelta: con **una** consulta el adversario se queda con $G(k)$ **entero** y puede etiquetar cualquier mensaje que se le ocurra. Eso se llama **falsificación universal**, y es el grado más grave posible.

**Por qué falla, en una línea:** $\oplus$ es invertible, así que **la etiqueta no oculta el keystream, lo expone**. Es el [[one-time-pad|One Time Pad]] usado como autenticador — y el OTP no autentica nada, precisamente porque es [[maleabilidad|maleable]], que es lo que la primera mitad de la clase acaba de demostrar. Se recicló la construcción de un cifrado donde no correspondía. *(Lectura nuestra.)*

> [!quote]- De la transcripción — lo resuelve Carlos (cues pt1 515-536)
> **515-517, 519, 522.** *(Carlos Amador Vallejo Tapia)* "Había pensado que el MAC… vos lo que podés hacer es **agarrar un mensaje hecho de todos ceros** y básicamente hacer un xor. Vas a intentar validar todos los ceros y entonces **te queda el generador**."
> **527-528.** *(Pablo Abad)* "Aprovechando que tenés la función de etiquetado, podés etiquetar el mensaje 0 —que sería calcular el MAC— y el resultado, por cómo está construido esto, **si $m=0$ va a ser la secuencia $G(k)$**."
> **531-532.** *(Carlos)* "Y agarraría mi propio mensaje y le haría un xor con el $G(k)$ que obtuve." — *(Pablo)* "Perfecto. Y publicarías ese mensaje, llamémoslo $m'$, y como etiqueta el $G(k)$ que calculaste xor ese mensaje."
> **533-536.** *(Carlos)* "Claro, porque no cambia nada: es como si lo hubiera hecho originalmente con ése. No se podrían dar cuenta, en teoría." — *(Pablo)* "Espectacular, muy bien. Y eso efectivamente pasaría la verificación, así que **obtuviste una falsificación**."

> **Precisión nuestra sobre la lección que se sacó en clase.** Al cerrar este ítem el docente dice (cues pt1 540-542): *"esta función viola un patrón importante que tiene que ver con **el determinismo**. Si los MACs son deterministas, tienen un problema latente de que va a ser muy difícil que sean infalsificables."* **Eso no es correcto, y hay que corregirlo, porque contradice lo que la propia clase construye una filmina después:** [[cbc-mac|CBC-MAC]] y [[hmac|HMAC]] son determinísticos y son seguros. La intuición *"determinístico ⟹ inseguro"* viene del **cifrado** —donde el adversario tiene que distinguir, y criptogramas repetidos le regalan el bit— y **no se transfiere a los MACs**, donde el adversario tiene que fabricar una etiqueta sobre un mensaje nuevo y la repetibilidad no lo ayuda. Katz & Lindell va en la dirección contraria con la **Proposición 4.4**: *un MAC seguro con verificación canónica es automáticamente un MAC fuertemente seguro*, o sea que el determinismo **regala** la propiedad más fuerte. Lo que rompe este MAC no es el determinismo: es que **$\oplus$ es invertible**. Desarrollado en [[message-authentication-code#Un MAC determinístico no es un problema|Message Authentication Code § Un MAC determinístico no es un problema]].

### Segundo MAC: la clave xor los primeros bits del mensaje

$$\mathsf{Mac}_k(m) = k \oplus \mathsf{first}_n(m) \qquad\qquad \mathsf{Vrfy}_k(m,t) = 1 \iff t = k \oplus \mathsf{first}_n(m)$$

> **Precisión de notación.** La filmina escribe $\mathsf{first\_k\_bits}(m)$, y la `k` de ese nombre es **la longitud de la clave**, no la clave: son los primeros $\lvert k\rvert = n$ bits de $m$. En una filmina donde $k$ ya nombra la clave, la sobrecarga confunde; acá se escribe $\mathsf{first}_n(m)$. La función además queda **indefinida** si $\lvert m\rvert < n$, así que hay que suponer $\lvert m\rvert \ge n$. *(Precisión nuestra.)*

Cae por **dos vías independientes**, y la segunda es la que deja la lección.

**Ataque (a) — recuperación de clave.** Consultar $m^{(0)} := 0\cdots0$ (o cualquier mensaje que empiece con $n$ ceros): la respuesta es $t^{(0)} = k \oplus 0\cdots0 = k$, **la clave en claro**. Con la clave en la mano se etiqueta cualquier cosa. Es exactamente la misma estructura que el primer MAC: xorear contra una constante conocida despeja el secreto.

**Ataque (b) — el que importa.** Ni siquiera hace falta elegir el mensaje de consulta:

1. Consultar **cualquier** $m$ con $\lvert m\rvert > n$. Recibe $t = k \oplus \mathsf{first}_n(m)$.
2. Construir $m^{*}$ cambiando **cualquier bit a partir de la posición $n+1$**, dejando intacto el prefijo de $n$ bits.
3. Emitir $(m^{*},\, t)$ — **la misma etiqueta, sin tocarla**.

$m^{*}\ne m$, así que $m^{*}\notin Q$; y $\mathsf{first}_n(m^{*}) = \mathsf{first}_n(m)$, con lo cual $\mathsf{Mac}_k(m^{*}) = t$ y la verificación pasa. Probabilidad 1.

**La moraleja, que es transferible a cualquier ejercicio del tema:**

> [!quote]- De la transcripción — lo resuelve Agustín, y la lección (cues pt1 553-568)
> **553-554.** *(Pablo Abad)* "Hay otra forma también de romperla, que es todavía más devastadora. **¿Qué pasa si yo hago un mensaje que sea más largo que la clave?**"
> **557-558, 562.** *(Agustín Julián Brunero)* "Si el mensaje es más largo, **los bits estos que quedan afuera los podría cambiar el atacante**. […] Me queda el mensaje con la misma etiqueta."
> **563-567.** *(Pablo Abad)* "Exacto, **porque la etiqueta sólo toma en cuenta los primeros $k$ bits del mensaje**. Le calculamos la etiqueta y después cambiamos algunos de los bits de más atrás, que no entran en la etiqueta. Y eso sería una falsificación también."
> **567-568.** "Nos deja otra lección, que es: **para ser infalsificable, sí o sí la etiqueta tiene que tomar en cuenta todos los bits del contenido del mensaje. No se puede armar una función de [MAC] [in]falsificable que ignore partes del mensaje.**"
>
> *(El ASR del cue pt1 568 dice "una función de magging falsificable". "Magging" es `MAC`, y el "falsificable" tiene que ser **infalsificable**: la frase anterior lo exige y la conclusión no cierra de otro modo. Los dos corchetes marcan las dos correcciones nuestras.)*

> **Por qué esa moraleja es un teorema y no una recomendación** *(formalización nuestra).* Si $\mathsf{Mac}_k$ ignora algún bit del mensaje, entonces existen $m \ne m^{*}$ con $\mathsf{Mac}_k(m) = \mathsf{Mac}_k(m^{*})$ **para toda clave**, y falsificar se reduce a copiar la etiqueta. Es un argumento **combinatorio**, no computacional: ninguna hipótesis criptográfica sobre $G$, sobre $F$ o sobre $H$ puede salvarlo. Nótese además que el ataque (b) **no usa para nada** qué hace la parte de la clave: aunque $\mathsf{first}_n(m)$ se reemplazara por un hash perfecto de los primeros $n$ bits, el esquema caería igual.

### Tercer MAC: el cifrado de la longitud del mensaje

$$\mathsf{Mac}_k(m) = \mathsf{Enc}_k(\lvert m\rvert), \qquad \mathsf{Enc}\ \text{CPA-Secure}$$

**Es el más instructivo de los tres**, porque el ataque de los otros dos no se puede copiar: hay que reconstruir `Vrfy` primero, y ahí está todo el ejercicio. Se resolvió dos veces en clase; la segunda pasada (cues pt1 800-872), a pedido de Emilio, es la completa.

**Paso 1 — `Mac` no es determinística.** Por el resultado de la Clase 2, **un criptosistema determinístico no puede ser CPA-Secure** ([[pruebas-de-indistinguibilidad#Propiedades de CPA|demostración]]). Como $\mathsf{Enc}$ es CPA-Secure por hipótesis, es **probabilística**; luego dos etiquetas del mismo mensaje **dan valores distintos**.

**Paso 2 — entonces `Vrfy` NO puede ser canónica.** Recalcular $\mathsf{Enc}_k(\lvert m\rvert)$ y comparar contra $t$ fallaría **incluso sobre etiquetas legítimas**, violando la propiedad básica del MAC. La verificación ingenua acá no es floja: es **incorrecta**.

**Paso 3 — construir `Vrfy` a partir del invariante.** Lo único que sobrevive a la aleatorización de `Enc` es la corrección del criptosistema, $\mathsf{Dec}_k(\mathsf{Enc}_k(x)) = x$ para **cualquiera** de los criptogramas posibles de $x$. De ahí sale la única verificación bien definida:

$$\mathsf{Vrfy}_k(m,t) = 1 \iff \mathsf{Dec}_k(t) = \lvert m\rvert$$

> [!quote]- De la transcripción — por qué la verificación ingenua es incorrecta, y cuál es el invariante (cues pt1 820-836)
> **820-822.** "**No podés decir que `Vrfy` es 'calculo el MAC del mensaje y lo comparo con $t$'. Es incorrecto.**"
> **823-826.** "¿Qué es lo que hacíamos con los otros? Con los otros, que eran determinísticos, decíamos: calculás el MAC de vuelta y lo comparás. Porque al no ser determinístico te va a pasar esto: **cuando lo calculo me dice $xxx$, genial; cuando lo voy a verificar, lo vuelvo a calcular y me da otro valor. Era el mismo mensaje y me da distinto. Entonces la verificación no puede ser así.**"
> **828-830.** "¿Cuál es la propiedad fundamental que se va a mantener en este caso? **Que la etiqueta es el resultado de un cifrado, entonces lo podés invertir.** Lo que tienen los cifrados: vos ciframos 10 veces el mensaje y te va a dar 10 textos cifrados distintos, **pero descifrás los 10 textos cifrados distintos y todos vuelven al mensaje original**."
> **831-836.** "Entonces **el invariante es que $\mathsf{Dec}_k(t)$ va a ser, en este caso, $\lvert m\rvert$**. Entonces la verificación la vas a construir a partir de este invariante: $\mathsf{Vrfy}_k(m,t)$ va a ser **tomar la etiqueta, descifrarla, y compararla con la longitud del mensaje**."

**Paso 4 — con `Vrfy` en la mano, el ataque es trivial.** Con el ejemplo numérico de la clase:

1. Consultar $m = \texttt{123}$ (tres símbolos). Recibe $t = \mathsf{Enc}_k(3)$.
2. Emitir $(m^{*},\, t)$ con $m^{*} = \texttt{456}$: **otro mensaje, la misma longitud, la misma etiqueta**.

**Verificación:** $\mathsf{Dec}_k(t) = 3$ y $\lvert m^{*}\rvert = 3$, luego $\mathsf{Vrfy}_k(m^{*},t) = 1$. Y $m^{*}\notin Q$. Probabilidad 1.

**Por qué falla.** La etiqueta **no depende de ningún bit del contenido**, sólo de la longitud: es el caso extremo de la moraleja del segundo MAC — donde aquél ignoraba la cola del mensaje, éste ignora **el mensaje entero**. El docente lo dice así (cue pt1 598): *"fíjense que éste es no determinístico, pero también comparte el problema que tiene el MAC del medio, que es: no está evaluando parte del contenido. Bueno, éste literalmente no está evaluando nada del contenido: se queda sólo con la longitud."*

> **La hipótesis fuerte es una pista falsa** *(lectura nuestra).* El enunciado subraya que $\mathsf{Enc}$ es **CPA-Secure**, y eso invita a pensar que la fuerza de la primitiva se hereda. No se hereda: **una primitiva excelente aplicada al argumento equivocado no compra nada**. Es el mismo error de razonamiento que confundir *"AES es seguro"* con *"ECB es seguro"*, sólo que acá el argumento equivocado es la longitud en vez del bloque.

### Los tres, en una tabla

| MAC | ¿Determinístico? | Cómo queda `Vrfy` | Falsificación | Consultas | Lección |
|---|---|---|---|---|---|
| $G(k)\oplus m$ | Sí | canónica | consultar $0\cdots0$, quedarse con $G(k)$, etiquetar cualquier cosa | 1 | $\oplus$ es invertible: la etiqueta **revela el keystream** |
| $k\oplus\mathsf{first}_n(m)$ | Sí | canónica | (a) consultar $0\cdots0$ y obtener $k$; (b) mutar bits después del $n$-ésimo y **reusar** la etiqueta | 1 | la etiqueta tiene que depender de **todos** los bits |
| $\mathsf{Enc}_k(\lvert m\rvert)$ | **No** | descifrar $t$ y comparar con $\lvert m\rvert$ | reusar la etiqueta en otro mensaje de la misma longitud | 1 | una primitiva fuerte sobre **el argumento equivocado** no sirve |

Los tres son **falsificaciones existenciales con probabilidad 1 y una sola consulta**. Ninguno es infalsificable.

> **Dónde encaja esto en el libro** *(Katz & Lindell).* El **Ejercicio 4.7** es la versión del libro de la misma tarea —tres candidatos a MAC construidos sobre una función pseudoaleatoria, todos inseguros— y el **4.8** agrega otro. Ninguno de los tres de la filmina 17 aparece textual, pero el patrón de razonamiento es idéntico: reconstruir `Vrfy`, exhibir un adversario, calcular la probabilidad.

---

## Lo que la definición no cubre

*(Casi toda esta sección es de Katz & Lindell cap. 4 y no está en el deck de teoría ni se mencionó el 27/08. La excepción es el punto 2: **el replay sí es material escrito de la cátedra**, desde la Práctica 04 del 31/08. Va acá porque es exactamente el borde de la definición que la filmina 15 enuncia.)*

**1. Infalsificable no es lo mismo que fuertemente infalsificable.** El experimento `Mac-sforge` (Definición 4.3) es igual a `Mac-Forge` salvo que $Q$ guarda **pares** $(m,t)$ y el adversario gana emitiendo cualquier par válido que no esté en $Q$ — o sea que **también gana produciendo una etiqueta distinta para un mensaje que ya fue autenticado**. La diferencia muerde de verdad:

- El **Ejercicio 4.5** muestra que existen MACs seguros que **no** son fuertemente seguros.
- El **Teorema 4.19** (encrypt-then-MAC, que es la [[cifrado-autenticado|construcción de cifrado autenticado]] de la filmina 37) pide como hipótesis un MAC **fuertemente** seguro; con uno meramente infalsificable el **Ejercicio 4.21** exhibe que el resultado **puede no ser CCA-Secure**.
- Y la **Proposición 4.4** es la que salva la práctica: *todo MAC seguro con verificación canónica es fuertemente seguro*. Como CBC-MAC, HMAC y todos los MACs reales usan verificación canónica, **la afirmación de la filmina es correcta para todo lo que se usa, y falsa en general**.

**Y la cátedra sí pide la versión fuerte, aunque no la llame así.** La filmina 17 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] enuncia la hipótesis del teorema como *"esquema de MAC seguro, **con etiquetas únicas** (para todo $k$, para todo $m$, hay un único valor $t$ para el cual $\mathsf{Vrfy}_k(m,t)=1$)"*. Eso es más fuerte que la verificación canónica y alcanza de sobra: si para cada $(k,m)$ hay una sola etiqueta que verifica, producir *"otra etiqueta para el mismo mensaje"* es imposible por construcción. O sea que la condición que teoría omite en su filmina 37, la práctica la escribe.

> **Teorema 4.19 o Teorema 4.20: la referencia, resuelta.** La filmina 17 de la práctica remite a *"(Ver teorema 4.20.)"* y esta nota cita el **Teorema 4.19**. Verificado sobre el PDF de Katz & Lindell que hay en `raw/`: **para ese ejemplar el número es 4.19** — *"sea $\Pi_E$ un esquema de cifrado `CPA`-seguro y $\Pi_M$ un MAC fuertemente seguro; entonces la Construcción 4.18 es un esquema de cifrado autenticado"*. En el mismo ejemplar, *4.20* está tomado por dos cosas y ninguna es ésa: la **Afirmación 4.20**, que es un paso interno de la demostración del 4.19, y el **Ejercicio 4.20** (*"probar que la Construcción 4.7 es fuertemente segura"*). No son dos teoremas distintos: **es el mismo enunciado con la numeración de otra edición**. *(Verificación nuestra.)*
>
> De paso, un dato que cambia cómo se leen todas las referencias numéricas del vault: el PDF de `raw/material_Catedra/bibliografia/` **se identifica a sí mismo como *Second Edition*** y termina en el capítulo 13. Toda la numeración de construcciones, teoremas y ejercicios que citan estas notas es la de ese ejemplar — la ficha de [[bibliografia|bibliografía]], que hoy lo registra como 3.ª edición, es lo que hay que corregir.

**2. Un MAC no protege contra replay — y esto sí está en una filmina.** La definición **no tiene estado**: un par $(m,t)$ válido lo es **para siempre**, y reenviarlo no es una falsificación —$m$ ya está en $Q$—, así que `Mac-Forge` ni lo mira. El ejemplo del libro es la transferencia bancaria retransmitida diez veces: cada copia verifica perfectamente. Las dos defensas conocidas viven **fuera** del MAC:

| Defensa | Qué cuesta |
|---|---|
| **Números de secuencia** | exige estado sincronizado entre las partes; sufre en canales con pérdida o reordenamiento |
| **Timestamps** | exige relojes sincronizados y **deja siempre una ventana** de aceptación |

> **Corrección de esta nota.** Hasta el 04/09 el vault afirmaba que el aviso de replay no estaba en ninguna filmina y que salía sólo del libro. **Es falso desde la Práctica 04 (31/08):** su filmina 2, la misma de `Mac-Forge`, cierra con un **triángulo de advertencia rojo** y la leyenda *"MAC no protege contra ataques de **REPLAY**"*, con una flecha bifurcada hacia las dos contramedidas — *"N° de secuencia"* y *"Timestamps"*. Son exactamente las dos de la tabla de arriba. Sigue siendo cierto que **ninguna de las 41 filminas del deck de teoría lo menciona**: el aviso es aporte propio del deck de la práctica.

Es un hueco grande en una clase que se llama *integridad*, y conviene tenerlo presente: **integridad no es frescura**. El tema tiene nota propia → [[ataques-de-repeticion-y-frescura|Ataques de repetición y frescura]].

**3. La demostración no cubre los canales laterales.** Un MAC demostrablemente seguro se rompe igual si `Vrfy` compara la etiqueta **byte a byte y corta al primer error**: el tiempo de respuesta filtra **cuántos bytes coinciden**, y con eso se reconstruye la etiqueta byte por byte, unas 256 consultas por byte —4096 en el peor caso para una etiqueta de 16 bytes— en lugar de $2^{128}$. Pasó de verdad en la **Xbox 360**, donde la diferencia medible era de 2,2 ms, y se usó para cargar juegos no firmados. La conclusión operativa de K&L es literal: la comparación de etiquetas tiene que ser **de tiempo constante y comparar siempre todos los bytes**.

---

## Estado de las fuentes

- Las filminas 15, 16 y 17 tienen **respaldo completo de transcripción**: cues pt1 419-599 y 800-872, incluidas las resoluciones de dos alumnos y la segunda pasada del tercer MAC.
- El repaso que abre la sesión del **03/09** (cues pt2 38-88) vuelve sobre la prueba entera y **no contradice nada**: reconfirma los cuatro pasos, el registro de $Q$ y la condición $m\notin Q$, y agrega la lectura por el negativo, las tres combinaciones descartadas y el respaldo de cátedra al argumento del tamaño de la etiqueta.
- **La cátedra reconoce en voz alta una sola errata** en toda la Clase 03: la de la filmina 15 de teoría (*"Criptosistema"* por *"MAC"*), cue pt1 425. Las dos de la filmina 2 de la práctica —$\mathit{negl}(\ )$ y *"de igual longitud"*— **no se corrigen en ningún momento**, y están verificadas sobre el render de la lámina, no sobre el texto extraído.
- **Aporte de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] (31/08):** el experimento en tres pasos, el nombre corto de la propiedad, el aviso de replay con sus dos contramedidas y la condición de **etiquetas únicas** de la filmina 17.
- **Lo que no sale de ninguna filmina ni de la clase, y va rotulado:** las tres justificaciones de las observaciones, la formalización de la moraleja del segundo MAC, la corrección sobre el determinismo, la resolución de la referencia 4.19/4.20 y el resto de la sección *Lo que la definición no cubre*.
