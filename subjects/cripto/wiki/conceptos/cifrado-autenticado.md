---
title: Cifrado autenticado
resumen: 'Criptosistema que compone uno CPA-Secure con un MAC infalsificable cifrando primero y autenticando el criptograma; da confidencialidad e integridad a la vez, es CCA-Secure y su descifrado puede fallar y devolver un símbolo de error.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Cifrado autenticado, Authenticated encryption, Encriptación autenticada, Construcción genérica de cifrado autenticado, Secure message transmission]
type: concepto
unidad: 1
clase: 3
orden: 13
created: 2026-08-28
updated: 2026-09-04
tags: [criptografia, integridad, cifrado-autenticado, cca, mac, clase-03]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "raw/practicas/Clase 4.pdf"]
---

# Cifrado autenticado

**La construcción que cierra el arco de toda la Clase 3.** Combina un criptosistema y un MAC en un único criptosistema que da confidencialidad e integridad a la vez, y el resultado es **CCA-Secure**: es la respuesta al problema con el que la clase arrancó.

> **Fuentes.** Las filminas de teoría de esta nota (slides 37 y 40) son de la **segunda sesión de la Clase 3, del 03/09**, que **sí tiene transcripción**: la construcción está en los cues pt2 719-762 y el cierre del slide 40 en los cues pt2 891-909. La [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del 31/08 —tres días **antes**— desarrolla lo mismo en sus filminas 14 a 17 y agrega un ejercicio propio en la 18. El resto sale de Katz & Lindell y de lecturas propias rotuladas como tales.
>
> Los cues llevan prefijo de parte —`pt1` para el 27/08, `pt2` para el 03/09— porque la Clase 03 tiene **dos grabaciones**, cada una numerada desde 1.

---

## La definición: es una conjunción, no un resultado

La teoría nunca define qué **es** un cifrado autenticado: enuncia el resultado (*"el criptosistema resultante es CCA-Secure"*) y sigue. **La definición la da la práctica**, en su filmina 14, y es la formulación más limpia del concepto en todo el material de la cátedra:

$$\textbf{Cifrado autenticado} \;=\; \text{privacidad} + \text{integridad} \;=\; \texttt{CCA-Secure} \;+\; \texttt{Mac-Forge-Secure}$$

La filmina lo escribe en dos líneas paralelas y con colores enfrentados —rojo para privacidad/`CCA`, verde para integridad/`Mac-Forge`—, de modo que la segunda línea se lee como la traducción formal de la primera. Y trae el **nombre alternativo** con el que aparece el concepto en la literatura: *secure message transmission*.

La consecuencia práctica es directa: **decir sólo "el esquema resultante es CCA-Secure" es dar la mitad de la definición.** Las dos propiedades se piden a la vez, y son cosas distintas — `CCA` es confidencialidad frente a un adversario activo, `Mac-Forge` es imposibilidad de fabricar mensajes.

> **Precisión sobre la segunda mitad** *(precisión nuestra)*. En Katz & Lindell la definición (4.17) también es una conjunción, pero la segunda condición no se enuncia sobre el MAC sino sobre **el esquema compuesto**: pide que sea **infalsificable** en el sentido de la Definición 4.16, con un experimento `Enc-Forge` en el que el adversario tiene que producir un criptograma que descifre a un mensaje que nunca pidió. Es la misma idea aplicada al objeto que se está definiendo. La lectura de la filmina —*el MAC de adentro tiene que pasar `Mac-Forge`*— es la hipótesis que hace verdadera esa condición, no la condición misma.

## Los dos ingredientes

La filmina pide dos cosas, y ninguna de las dos es nueva a esta altura:

- $\Pi_e(\mathsf{Gen}_e, \mathsf{Enc}, \mathsf{Dec})$, un criptosistema **[[pruebas-de-indistinguibilidad|CPA-Secure]]** — en la práctica, [[aes|AES]] en un [[modos-de-encadenamiento|modo con IV o nonce]] como `CBC` o `CTR`;
- $\Pi_m(\mathsf{Gen}_m, \mathsf{Mac}, \mathsf{Vrfy})$, un **[[seguridad-de-un-mac|MAC infalsificable]]** — en la práctica, [[cbc-mac|CBC-MAC]] o [[hmac|HMAC]] — y, según la filmina 17 de la práctica, **con etiquetas únicas** (ver [[#Etiquetas únicas: la condición que la teoría omite y la práctica pone|más abajo]]).

Lo notable es que las hipótesis son **casi exactamente** las garantías que cada primitiva ya tenía. No se le pide nada extra a ninguna salvo la unicidad de etiquetas: toda la fuerza del resultado sale de **cómo** se las compone. El docente lo dice en ese orden —*"a partir de un criptosistema \[CPA-Secure\] y un MAC infalsificable se puede construir un criptosistema autenticado"*— y remata con lo que se gana: *"nos resuelve el combo completo"*.

> [!quote]- De la transcripción — qué es un criptosistema autenticado y con qué se construye (cues pt2 722-731)
> Un criptosistema autenticado es conceptualmente un criptosistema que tiene controles de integridad. También. […] La primera forma de construirlo es a partir de un criptosistema que sea C[PA], ¿que pase la prueba de Ch[o]sen Plain Text Attack[?] […] es lo más avanzado que vimos dentro de criptosistemas hasta llegar a los problemas de integridad[,] y un [MAC] que sea infalsificable […] un cripto[sistema] autenticado de vuelta[,] nos resuelve el combo completo. Nos garantiza que la información queda confidencial y podemos detectar cualquier manipulación de la información.

## La construcción

$$\begin{aligned}
\mathsf{Gen}(1^{n}):\quad & k_1 \leftarrow \mathsf{Gen}_e(1^{n}),\qquad k_2 \leftarrow \mathsf{Gen}_m(1^{n}) \\[4pt]
\mathsf{Enc}_{k_1,k_2}(m):\quad & c \leftarrow \mathsf{Enc}_{k_1}(m),\qquad t \leftarrow \mathsf{Mac}_{k_2}(c),\qquad \text{salida } \langle c, t\rangle \\[4pt]
\mathsf{Dec}_{k_1,k_2}(\langle c,t\rangle):\quad & \text{si } \mathsf{Vrfy}_{k_2}(c,t) = 1 \;\to\; m := \mathsf{Dec}_{k_1}(c) \\
& \text{si no} \;\to\; \perp
\end{aligned}$$

Es **[[privacidad-e-integridad|Encrypt-then-MAC]]** escrito como criptosistema: la fila de abajo del slide 36, la que dice *"siempre es seguro"*, convertida en una terna $(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ que se puede usar como cualquier otra. Y el $\mathsf{Gen}$ hace explícita la condición de las **[[privacidad-e-integridad#Dos claves independientes|dos claves independientes]]**: son dos sorteos separados, uno con cada generador. La filmina 17 de la práctica no lo deja implícito: lo escribe en una estrella roja al costado — *"Las claves $k_1$ y $k_2$ deben ser independientes"*.

Es la Construcción 4.18 de Katz & Lindell.

El docente la recorre con el mismo dedo en los tres algoritmos y subraya el punto que después se vuelve operativo: **en el descifrado, primero se verifica y recién después se descifra**.

> [!quote]- De la transcripción — el recorrido de Gen, Enc y Dec, y el orden verificar antes de descifrar (cues pt2 733-737)
> [Cripto]sistema autenticado[.] De esta manera tiene una función de generación que genera 2 claves: una dentro del espacio de cada una de las funciones, ¿sí? Y básicamente hace la tercera forma que vimos[:] cifra el mensaje[,] etiqueta el texto cifrado y emite como salida [los dos.]
>
> el descifrado cambia un poquito porque se agrega el control de integridad. Entonces, ¿qué ocurre? Primero, se verifica el texto cifrado contra la etiqueta. Si pasa la verificación se descifra con la clave [de] descifrado y se [devuelve] el texto plano.

## El modo de falla nuevo

Ésta es la diferencia que se ve **desde afuera**, y el docente la marca como *"la gran diferencia"*: un criptosistema autenticado, al que se le pide descifrar un texto cifrado, **puede fallar**.

Un criptosistema tradicional no falla nunca. Se le entrega cualquier cadena de bits y devuelve algo: en el peor caso, basura aleatoria — pero devuelve. Un criptosistema autenticado, en cambio, tiene un resultado más, y **falla exactamente cuando detecta manipulación del texto cifrado**. Eso convierte una propiedad matemática en un hecho de la interfaz del programa:

- en un lenguaje con **excepciones**, la falla va a ser una excepción;
- en un lenguaje con **códigos de error**, un código de error específico.

La forma que tome depende de la implementación; lo que no depende de la implementación es que ese camino **existe** y que hay que manejarlo. Quien programa contra un criptosistema autenticado tiene que tratar el descifrado como una operación que puede fracasar, no como una función total.

> [!quote]- De la transcripción — el modo de falla nuevo y cómo se manifiesta en el lenguaje (cues pt2 738-746)
> y acá aparece la gran diferencia. Cuando miramos los criptosistemas [autenticados] desde afuera, existe un modo de falla nuevo[,] al pedir el descifrado de un texto cifrado. […] un criptosistema autenticado puede darnos como resultado una falla. Esto ya depende de cómo esté implementado. [Si] está en un lenguaje con excepciones, probablemente es una excepción[;] en un lenguaje con códigos de errores[,] tendrá un código de error específico.
>
> pero, a diferencia de lo que pasaba con los criptosistemas tradicionales[,] que yo le tiro un mensaje, y de última me sale un texto [des]cifrado que es aleatorio[,] basura[,] los cripto sistemas [autenticados] pueden fallar y van a fallar casualmente cuando detectan algún tipo de manipulación en el texto cifrado.

### El símbolo de fallo

La filmina escribe la rama negativa como *"$m = /$ (fallo)"*. La notación estándar es $\perp$ (*bottom*):

$$\mathsf{Dec}_{k_1,k_2}(\langle c,t\rangle) = \perp$$

$\perp$ **no es un mensaje**: no pertenece a $\mathcal{M}$, no se puede confundir con un texto plano válido, y significa *"esto no lo produjo quien dice haberlo producido"*. Que `Dec` devuelva un valor fuera del espacio de mensajes es lo que rompe la corrección "todo criptograma descifra a algo" que valía para los criptosistemas de la Clase 1 y 2: acá la mayoría de las cadenas de bits **no descifran a nada**, y ésa es la propiedad, no un defecto. La excepción del lenguaje y el código de error de los que habla la clase son las dos encarnaciones de ese mismo $\perp$.

> **$\perp$ tiene que ser la única información que sale del fallo** *(lectura nuestra, y es donde se rompen las implementaciones reales).* Si el receptor devuelve un $\perp$ distinguible por etiqueta inválida y otro por padding inválido —dos mensajes de error distintos, o simplemente dos tiempos de respuesta distintos—, ya no está devolviendo $\perp$ sino $\perp_1$ y $\perp_2$, y esa diferencia de un bit es un oráculo. Ver [[privacidad-e-integridad#Verificar antes de descifrar|Verificar antes de descifrar]]. Por eso la comparación de etiquetas se hace en **tiempo constante**.

## Cómo se ve desde afuera

El complemento del punto anterior, y es lo que hace que la construcción sea usable: **salvo por el modo de falla, un criptosistema autenticado se ve como un criptosistema común.** Las dos diferencias internas no se proyectan hacia afuera como dos objetos, sino como dos objetos un poco más grandes:

| Adentro | Desde afuera |
|---|---|
| dos claves, $k_1$ y $k_2$, sorteadas por generadores distintos | **una clave más grande** |
| criptograma y etiqueta, calculados por primitivas distintas | **un texto cifrado un poco más largo**, con la etiqueta adentro |
| verificación y descifrado, en ese orden | un descifrado que **puede fallar** |

Ésa es la razón por la que se lo puede enchufar donde había un criptosistema: la interfaz es la misma, y lo que se gana es la resistencia a manipulaciones del texto cifrado.

**Cómo se los nombra en las librerías.** No hay un estándar de nomenclatura, pero el patrón que se encuentra en la práctica es `<criptosistema>-<MAC>`: el nombre del criptosistema primero y después el del MAC o `HMAC`. Los ejemplos que da el docente son `AES-HMAC-SHA-1` y `AES-HMAC-SHA-3`. Es la contraparte, del lado de la construcción genérica, de la disciplina de nombres que el vault ya recomienda en [[hmac|HMAC]] y en [[eleccion-de-primitivas|Elección de primitivas en un proyecto]]: **el nombre completo dice qué primitivas hay adentro**, y por eso se puede auditar sin leer el código.

> [!quote]- De la transcripción — los nombres de librería y la vista de interfaz (cues pt2 754-761)
> en las librerías no hay no hay un estándar para esto, pero típicamente es alguna función criptográfica que empieza con el nombre del criptosistema[,] e incluye el nombre de alguna[,] de algún [MAC] o de algún H[MAC]. entonces puede[n] encontrarse con, por ejemplo, [AES-HMAC-SHA-1] o [AES-HMAC-SHA-3]. Eso es un criptosistema autenticado[,] seguro.
>
> desde afuera se ven como un criptosistema. Sí, porque acá generamos 2 claves, ¿no? Pero esto desde afuera[,] se ve como una clave más grande. Simplemente […] El cifrado se genera en 2 partes, pero lo que se ve desde afuera es como un texto cifrado un poco más largo, porque en algún lugar tiene la etiqueta. Entonces, desde afuera se ven como criptosistema, pero por ser autenticados ganan esa capacidad de ser resistentes en la prueba contra manipulaciones del texto cifrado.

## El resultado: el criptosistema es CCA-Secure

Ésta es la línea que cierra la clase: *"El criptosistema resultante es CCA-Secure"*.

**Por qué**, en una idea. La filmina 17 de la práctica da la intuición de la demostración en una sola frase —*"la idea es mostrar que la desencripción que podría dar el oráculo no sirve para nada al adversario"*—, así que el argumento que sigue **ya no es lectura nuestra**: es el argumento de la cátedra, desarrollado.

Lo único que un adversario `CCA` tiene de más respecto de uno `CPA` es el **oráculo de descifrado**. Pero en este esquema:

1. Cualquier $\langle c', t'\rangle$ que el adversario mande al oráculo y que **no** haya salido del oráculo de cifrado requiere, para no ser rechazado, que $t'$ verifique sobre $c'$ — es decir, una **falsificación** bajo $\mathsf{Mac}_{k_2}$.
2. Como $\Pi_m$ es infalsificable, eso pasa con probabilidad despreciable.
3. Entonces, salvo por un suceso despreciable, el oráculo de descifrado responde $\perp$ a **todo** lo que el adversario no haya obtenido antes por sí mismo. Y un oráculo que sólo dice $\perp$ no le enseña nada.
4. El juego `CCA` **degenera en el juego `CPA`**, que $\Pi_e$ ya gana por hipótesis.

En una frase: **el MAC no vuelve incifrable nada, vuelve inútil el oráculo de descifrado.**

> **El número del teorema: 4.19 o 4.20.** La filmina 17 de la práctica remite a *"(Ver teorema 4.20.)"*; esta nota viene citando el **Teorema 4.19** sobre la **Construcción 4.18**. En la edición de Katz & Lindell que usa el vault las dos referencias apuntan al mismo lugar y son complementarias: el **Teorema 4.19** es el enunciado (*si $\Pi_e$ es CPA-Secure y $\Pi_m$ es fuertemente seguro, la Construcción 4.18 es un esquema de cifrado autenticado*), y **4.20 es la Claim que vive adentro de su demostración** — la que prueba que la probabilidad de que el adversario mande al oráculo un criptograma nuevo y válido es despreciable. Es decir: **4.20 es exactamente la afirmación que la filmina parafrasea** cuando dice que el oráculo no le sirve de nada al adversario. No hay contradicción; hay una referencia al paso clave en vez de al enunciado. *(Verificado contra el texto del libro; otras ediciones pueden renumerar.)*

### Por qué esto es la respuesta al problema que abrió la clase

La Clase 3 arranca exhibiendo un criptosistema CPA-Secure al que se le puede **modificar el criptograma de forma controlada** para producir un cambio predecible en el texto plano: eso es la [[maleabilidad]], y el modelo que la formaliza es el [[ataque-de-texto-cifrado-escogido|ataque de texto cifrado escogido]]. El ejercicio del slide 12 remata el planteo mostrando que un [[criptosistema-de-flujo|criptosistema de flujo]] —CPA-Secure— **no** es CCA-Secure.

La construcción de esta nota es la salida, y conviene ver qué **no** hace:

- **No arregla el cifrado.** $\Pi_e$ sigue siendo tan maleable como antes; los bits de $c$ se siguen pudiendo dar vuelta y el efecto sobre $m$ sigue siendo predecible.
- **Le agrega una capa que vuelve irrelevante esa maleabilidad**: el criptograma modificado ya no lo acepta nadie, porque no viene con una etiqueta válida y el adversario no la puede fabricar.

Ese desplazamiento —de *"hacer que no se pueda modificar"* a *"hacer que la modificación no sirva"*— es la moraleja del bloque entero *(lectura nuestra)*. Y explica por qué la clase dedica veinte filminas a los MAC y a las funciones de hash antes de llegar acá: **la pieza que faltaba para el problema de confidencialidad de la Clase 2 era una primitiva de integridad**. El docente cierra el círculo señalando que la chicana con la que abrió —*"el criptosistema cubre el problema de la base de datos, pero ¿ustedes creen que hay un problema?"*— tenía respuesta afirmativa desde el principio (cue pt2 902).

### Etiquetas únicas: la condición que la teoría omite y la práctica pone

La filmina **37 de teoría** pide un MAC *"infalsificable"* (Definición 4.2 de Katz & Lindell). El **Teorema 4.19**, que es el que prueba el resultado, pide algo un poco más fuerte: un MAC **fuertemente seguro** (Definición 4.3, experimento `Mac-sforge`), en el que el adversario tampoco puede producir una etiqueta **nueva** para un mensaje que **ya** consultó.

**La omisión es de esa lámina, no del material de la cátedra.** La filmina **17 de la Práctica 04** pone la condición por escrito, con la forma equivalente de *etiquetas únicas*:

> *"$\pi_M(\mathsf{Gen}_M, \mathsf{Mac}, \mathsf{Vrfy})$ esquema de MAC seguro, con etiquetas únicas ($\forall k$, $\forall m$, hay un único valor $t$ para el cual $\mathsf{Vrfy}(m,t)=1$)."*

Si para cada clave y cada mensaje existe **una sola** etiqueta que verifica, entonces no hay ninguna etiqueta *nueva* que producir sobre un mensaje ya consultado, y la seguridad fuerte se sigue de la seguridad común. Es la misma exigencia dicha desde el lado del objeto en vez del lado del experimento.

**Por qué la diferencia muerde** *(lectura nuestra; el Ejercicio 4.21 del libro pide exhibirlo).* Si el MAC admite dos etiquetas válidas $t \neq t'$ para el mismo $c$, entonces el adversario que recibe el desafío $\langle c, t\rangle$ puede construir $\langle c, t'\rangle$, que es un **criptograma distinto** y por lo tanto **admisible en el oráculo de descifrado**. El oráculo lo verifica, lo descifra y le devuelve $m_b$ en bandeja. Se pierde el juego `CCA` sin haber roto nada.

**Por qué en la práctica no importa, y por qué igual hay que saberlo.** La **Proposición 4.4** del libro dice que todo MAC seguro con **verificación canónica** —recalcular la etiqueta y comparar— es automáticamente fuertemente seguro. [[cbc-mac|CBC-MAC]], [[hmac|HMAC]] y todos los MAC determinísticos que se usan verifican canónicamente, y por eso tienen etiquetas únicas. O sea: **la afirmación de la filmina 37 es correcta para todo lo que existe, y falsa en general — y la práctica, que llegó tres días antes, ya la había escrito completa.**

## Por qué en sistemas reales sólo se usa cifrado autenticado

El slide 40 cierra el tema con una recomendación operativa: *"En términos generales, sólo utilizar cifrado autenticado en sistemas reales"*, con tres razones. Van con el porqué de cada una, que la filmina no da y que la clase del 03/09 sí desarrolla.

**1. El cifrado "normal" puede ser manipulado.**
Es el eco directo de las primeras filminas: un esquema CPA-Secure garantiza que el criptograma no filtra el mensaje, y **nada más**. No dice nada sobre qué pasa si alguien lo modifica. El ataque de las primeras diez filminas se hace contra un cifrado que es CPA-Secure, y funciona igual. *"Cifrado sin autenticar"* no es una versión más débil de cifrado autenticado: es una primitiva que resuelve otro problema.

**2. En aplicaciones reales, el requerimiento de privacidad lleva implícito el de integridad.**
Ésta era, hasta la transcripción, la razón que esta nota rotulaba como lectura propia. **Ya no lo es**: es el remate del docente, y lo dice como consejo de relevamiento de requerimientos. Quien pide *"que nadie pueda leer esto"* casi siempre también quiere *"que nadie pueda cambiarlo"*, aunque no lo diga — porque los dos servicios se le presentan como una sola idea, *"que esto esté protegido"*. Los casos que necesitan confidencialidad **sin** integridad son de nicho. Un diseño que entrega sólo confidencialidad está entregando, sin avisar, algo que se puede adulterar; y como el que lo pidió no distingue los dos servicios, tampoco va a pedir el segundo por separado. **La forma segura de resolver un requerimiento ambiguo es dar de más, no de menos.**

> [!quote]- De la transcripción — la integridad implícita en los requerimientos y el consejo de cierre (cues pt2 893-906)
> piensen en el ejemplo de la base de datos. Si ustedes estaban relevando requerimientos, probablemente lo único que les hubiesen dicho es[:] no[,] los sueldos de los empleados son confidenciales. […] en sistemas reales son muy, muy de nicho los casos donde requieran solo confidencialidad, sin integridad[;] en general, cuando escuchen hablar de confidencialidad casi siempre viene acompañado implícitamente de integridad[.] por ese motivo, y porque existen cosas como [GCM], que prácticamente nos dan la misma performance con integridad adicionada[,] salvo que [haya] una razón muy, muy buena[,] el consejo normal es usar solo [cripto]sistemas autenticados.
>
> Hay casos de nicho donde se necesitan las cosas por separado definitivamente. Y tal vez algún protocolo que ustedes estén usando lo requiera […] Pero tengan en cuenta que, en general, cuando escuchan […] requerimientos no funcionales de seguridad que hablen de confidencialidad[,] la integridad está implícita. […] no hay razón de peso hoy día para no tratar de usar siempre criptosistemas autenticados hasta que se demuestre lo contrario. Sí, como consejo[,] erren por ese lado en los sistemas que construyen.

**3. Muy pocas veces se tiene control sobre el material que va a ser cifrado y descifrado.**
Quien escribe la biblioteca o el protocolo no sabe qué va a hacer el receptor con el texto plano que le entregue: parsearlo, ejecutarlo, usarlo como índice, mostrarlo. Si el texto plano es maleable, esa maleabilidad se convierte en **control sobre lo que el receptor haga después**, y el alcance del daño depende de un código que el diseñador criptográfico nunca vio. La filmina lo dice con precisión: *"la solución debería funcionar independientemente de esto"* — o sea, **seguro por defecto**, sin hipótesis sobre el contexto de uso.

**El argumento de costo, que en clase es la bisagra entre la razón 2 y el consejo.** Autenticar cuesta una pasada más de una primitiva simétrica — *o ni siquiera eso*, en [[ccm-y-gcm|GCM]], que el docente nombra en la misma oración: *"porque existen cosas como \[GCM\], que prácticamente nos dan la misma performance con integridad adicionada"*. Mientras tanto, el modo de falla que se evita es la pérdida total del texto plano. La asimetría entre lo que cuesta y lo que salva es de varios órdenes de magnitud, y es lo que convierte la recomendación en un valor por omisión y no en un consejo entre otros.

> Katz & Lindell §4.5 dice lo mismo y con la misma fuerza: *es la mejor práctica asegurar siempre secreto e integridad por defecto en el escenario de clave privada*.

## Del esquema genérico a los modos reales

La construcción de esta nota es **genérica**: sirve con cualquier $\Pi_e$ y cualquier $\Pi_m$ que cumplan las hipótesis — es, en palabras del docente, *"una forma que nos permite combinar arbitrariamente criptosistemas de todo tipo"* (cue pt2 762). Ésa es su virtud, y es la razón por la que la clase la ve antes que a los modos concretos. Su costo es que hace **dos pasadas** sobre los datos y necesita **dos claves**.

Los modos que se usan de verdad son instanciaciones optimizadas de esta idea, y son el tema de [[ccm-y-gcm|CCM y GCM]]. El docente los introduce exactamente por ahí: modos de encadenamiento que ganan control de integridad *"sin la necesidad de duplicar o de extender el tamaño de la clave, que es por ahí lo que más se ve como factor negativo desde fuera"* (cues pt2 764-768).

| | Composición | Claves | Pasadas |
|---|---|---|---|
| Construcción genérica (slide 37) | `Encrypt-then-MAC` | dos, independientes | dos |
| `CCM` | `authenticate-then-encrypt` | **una**, con prueba específica | dos |
| `GCM` | `encrypt-then-MAC` | una, con la etiqueta calculada por una primitiva distinta | una |

## Bibliografía y material pendiente

Al cerrar la sesión del 03/09 el docente ubica **todo** el bloque de integridad en el **capítulo 4** de Katz & Lindell (cue pt2 907). El vault cita además el capítulo 5 para las funciones de hash, y conviene dejar registrada la discrepancia: probablemente sea diferencia de edición, la misma que explica el 4.19 contra el 4.20 de más arriba.

Y hay **material anunciado que todavía no está en `raw/`**: la cátedra prometió subir al campus demostraciones y propiedades que no están en el libro (cues pt2 908-909), la misma promesa que ya había hecho al hablar de la demostración de `CCM` (cues pt2 806-808). Es un cabo suelto que hay que ir a buscar: mientras no esté, [[ccm-y-gcm|CCM y GCM]] sigue apoyándose en especificaciones externas al vault.
