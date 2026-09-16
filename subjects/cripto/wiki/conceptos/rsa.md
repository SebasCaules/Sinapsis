---
title: RSA
resumen: 'El criptosistema asimétrico de exponenciación modular en su versión de libro de texto, con la demostración por Euler que el docente hizo en pantalla, y los tres problemas que impiden usarlo así: determinismo, mensajes pequeños y módulos repetidos.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[criptosistema-asimetrico]]", "[[grupos-anillos-y-cuerpos]]", "[[pkcs1-y-tamano-de-claves]]", "[[practica-05-de-la-clave-privada-a-la-clave-publica]]"]
aliases: [RSA, Textbook RSA, Rivest Shamir Adleman, Cifrado RSA, Ataque de módulos repetidos]
type: concepto
unidad: 1
clase: 4
orden: 6
created: 2026-09-04
updated: 2026-09-15
tags: [criptografia, rsa, textbook-rsa, cifrado-asimetrico, factorizacion, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# RSA

**El criptosistema asimétrico más conocido del curso, en su versión "de libro de texto" — y los tres problemas concretos que hacen que nadie lo use exactamente así en producción.** Es la nota que explica por qué RSA necesita el padding de [[pkcs1-y-tamano-de-claves|PKCS#1]] para ser utilizable, no un capricho de estandarización.

> **Fuentes de esta nota.** Filminas **24 a 26** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), bloque de `RSA` en los cues **746-899**. La nota se escribió el 04/09 sólo contra el PDF y se revisó contra la voz el 14/09. Lo que la voz agregó: la **demostración en pantalla** de que descifrar deshace cifrar —que esta nota traía como lectura propia—, la anécdota de los ataques algebraicos, y el ejemplo del mensaje $1$. El ejemplo numérico de la filmina 26 se pasó *"más o menos rápido"* (cue 899).

> **La [[practica-05-de-la-clave-privada-a-la-clave-publica|Práctica 05]] (14/09) escribe la generación de claves como $\mathsf{GenRSA}$ sobre $\mathsf{GenModulus}(1^{n})$** —la separación en capas de Katz & Lindell §11.5.1, que la filmina 24 no hace— y la **corre**: `openssl genrsa` y `openssl rsa -text`, con lo que hay dentro de `privada.txt` ($p$, $q$, $N$, $e = 65537$, $d$ y los tres parámetros del teorema chino del resto). Su demostración de que descifrar deshace cifrar cabe en una línea, y esa línea se salta justo el paso de Euler que la voz desarrolló en pantalla → [[practica-05-de-la-clave-privada-a-la-clave-publica#8. GenRSA, y la clave por dentro con openssl|Práctica 05 §8]] y [[practica-05-de-la-clave-privada-a-la-clave-publica#La demostración en una línea, y el paso que se saltea|§9]].

**Cómo lo ubica la clase.** `RSA` es *"uno de los algoritmos más famosos, ya no el más usado"*; hereda el nombre de las iniciales de Rivest, Shamir y Adleman, y *"tiene la bondad de ser muy simple: si no fuese por otros problemas que se le encontraron, sería como el Diffie-Hellman de los asimétricos, lo usaría todo el mundo"* (cues 746-753). Y una observación general sobre el mundo asimétrico que `RSA` ilustra mejor que nadie: como hay que generar **un par** de claves que no son independientes, **la complejidad se traslada a la generación de claves** —hasta ahora `Gen` elegía una clave al azar y nada más (cues 754-757).

## La construcción

$$\begin{aligned}
\mathsf{Gen}&:\ \text{elegir } p,q \text{ primos},\ n = p\cdot q\\
&\quad e \leftarrow (0,\varphi(n)) \mid \gcd(e,\varphi(n))=1\\
&\quad \text{calcular } d \mid e\cdot d \equiv 1 \pmod{\varphi(n)}\\
&\quad pk = (n,e),\ sk = (n,d)\\[4pt]
\mathsf{Enc}_{pk}(m) &\equiv m^{e} \pmod n\\
\mathsf{Dec}_{sk}(c) &\equiv c^{d} \pmod n
\end{aligned}$$

$d$ se calcula con [[algoritmo-de-euclides-extendido|Euclides extendido]], exactamente como el [[inverso-modular|inverso modular]] de $e$ módulo $\varphi(n)$, con $\varphi(n) = (p-1)(q-1)$ — la fórmula de $\varphi$ para dos primos distintos que da [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]].

**La voz recorre la construcción paso a paso y justifica cada uno.** $\varphi(n)$ es trivial de calcular en `Gen` porque *"en esta etapa, como elegimos los números, tenemos la factorización"*; $e$ se elige coprimo con $\varphi(n)$ *"porque queremos que tenga un inverso multiplicativo"*; ese inverso es $d$, y calcularlo *"conocido $e$ y conocido $\varphi(n)$ es fácil"*: entra en juego el algoritmo extendido de Euclides, *"súper eficiente de calcular"*. Cifrar es *"tomar el mensaje representado como número y elevarlo al exponente de la clave pública"*; descifrar, elevar el texto cifrado al de la privada. *"Esto es RSA, así de simple."* (cues 758-782).

### Por qué cierra: Euler-Fermat

$\mathsf{Dec}(\mathsf{Enc}(m)) = (m^{e})^{d} = m^{ed} \bmod n$. Como $e \cdot d \equiv 1 \pmod{\varphi(n)}$, existe $k$ tal que $ed = 1 + k\cdot\varphi(n)$, así que

$$m^{ed} = m^{1 + k\varphi(n)} = m \cdot \bigl(m^{\varphi(n)}\bigr)^{k} \equiv m \cdot 1^{k} = m \pmod n$$

usando el teorema de Euler-Fermat, $m^{\varphi(n)} \equiv 1 \pmod n$ para $\gcd(m,n)=1$ — la misma identidad citada sin demostrar en [[grupos-anillos-y-cuerpos|04.02]] y probada en [[cuerpos-finitos-y-campos-de-galois#Función phi de Euler|02.16]].

**Esta demostración se hizo en clase, escrita en pantalla y fuera del PDF.** La nota la traía desde el 04/09 rotulada como lectura propia; el 10/09 el docente la desarrolló entera (cues 783-854), con exactamente los mismos pasos: expandir $\mathsf{Dec}(\mathsf{Enc}(p))$ como $(p^{e})^{d} = p^{ed} \bmod n$ usando que reducir módulo $n$ *"intermedio o al final da el mismo resultado"*; escribir $ed = 1 + k\varphi(n)$ a partir de la congruencia de `Gen`; separar $p^{1}\cdot (p^{\varphi(n)})^{k}$; y aplicar Euler para que el segundo factor sea $1^{k} = 1$. La condición que cierra es *"siempre que $p$ sea menor a $n$"* (cue 853), que es parte de la definición del espacio de mensajes. Un alumno contestó el paso clave —cuánto vale $p^{\varphi(n)} \bmod n$: *"uno"*—.

> [!quote]- De la transcripción — la demostración, con la "magia de la galera" (cues 806-853)
> *"¿Qué es esta parte del texto cifrado? $p$ a la $e$ módulo $n$. Acá, propiedades de aritmética modular: la exponenciación es una multiplicación repetida, así que las propiedades que aplican en la multiplicación valen con la exponenciación. Si yo tengo muchas multiplicaciones, reducirlas módulo $n$ intermedio o al final da el mismo resultado. Entonces esto es equivalente a $p$ a la $e$ a la $d$ módulo $n$, y esto es equivalente a $p$ a la $e$ por $d$ módulo $n$. Hasta acá hicimos una reducción básica. Acá entra la magia de la galera que se les ocurrió a los que inventaron el algoritmo: el **teorema de Euler**, que decía que cualquier número elevado a $\varphi(n)$ es congruente a 1 módulo $n$. (…) Fíjense cómo se crea la clave: nosotros sabemos que $e$ por $d$ es congruente a 1 módulo $\varphi(n)$; esto es lo mismo que decir que $e$ por $d$ menos 1 es múltiplo de $\varphi(n)$, o, lo que es lo mismo, $e$ por $d$ es 1 más alguna constante $k$ por $\varphi(n)$. ¿Por qué hacemos esto? Porque $e$ por $d$ aparece en la ecuación original, y ahora podemos reemplazarlo. (…) La suma de exponentes es el producto, así que esto es lo mismo que $p$ a la 1 por $p$ a la $k\varphi(n)$ módulo $n$; y potencia de potencia: $p$ a la $\varphi(n)$, todo elevado a la $k$. Y voy a traer de vuelta la idea del teorema de Euler: ¿cuánto vale $p$ a la $\varphi(n)$ módulo $n$?"*
> — **Emilio Mitchell:** *"Uno."*
> — *"Muy bien. Entonces nos queda $p$ por 1 a la $k$ módulo $n$, y 1 elevado a cualquier número entero vale 1. **Tomar $p$, cifrarlo y descifrarlo es igual a $p$, siempre que $p$ sea menor a $n$.** Eso lo pasé muy rápido, pero es parte de la definición de los conjuntos de RSA."*

> **La hipótesis que la voz no menciona** *(precisión nuestra)*. El teorema de Euler exige $\gcd(m,n) = 1$, y hay mensajes que no lo cumplen —los múltiplos de $p$ o de $q$—. La corrección sigue valiendo igual para ellos: se demuestra por separado módulo $p$ y módulo $q$ con el pequeño teorema de Fermat y se junta con el teorema chino del resto. En la práctica esos mensajes son una fracción despreciable, y quien los encontrara habría factorizado $n$.

## Los tres problemas de textbook RSA

La filmina 25 los lista sin desarrollarlos; acá van desarrollados. **La voz la encuadra con el nombre**: el sufijo *textbook* existe porque *"si agarran libros de los 80, incluso de principios de los 90, van a encontrar esta definición de RSA; en los libros más modernos se hace mucho hincapié en que implementar esto está mal, y se habla del RSA de los libros a propósito para separarlo de la implementación práctica"* (cues 864-867). Y agrega una anécdota que dimensiona el problema mejor que la lista: en una especialización en criptografía, un experto en `RSA` *"apareció con una presentación de 900 hojas de ataques algebraicos"*, y los primos que la construcción dice elegir *"cualesquiera"* necesitan en realidad satisfacer *"como 40 condiciones distintas"* (cues 868-875).

### 1. Es determinístico

$\mathsf{Enc}_{pk}(m) = m^{e} \bmod n$ da **siempre** el mismo resultado para el mismo $m$ bajo la misma clave — no hay ningún componente aleatorio. Por [[criptosistema-asimetrico|Criptosistema asimétrico]], esto **descalifica automáticamente** a textbook RSA de ser `CPA-Secure`: cualquier adversario que conoce $pk$ puede cifrar $m_0$ y $m_1$ por su cuenta y comparar contra el criptograma recibido, ganando el experimento `Eav` con probabilidad $1$. Es el primer problema que la voz nombra, y con la conclusión ya sabida: *"si es determinístico, no puede ser seguro"* (cues 857-862).

**El ejemplo más barato de la voz: el mensaje $1$.** Si se permiten mensajes arbitrarios, ¿cuánto vale el cifrado de $1$? $1^{e} \bmod n = 1$, para cualquier clave. *"Entonces, si yo veo un texto cifrado que es 1, automáticamente el texto plano era 1, y eso no es muy seguro."* Lo mismo vale para $0$. Es el caso extremo de determinismo —hay mensajes cuyo criptograma **no depende de la clave**— y es el ejemplo que el docente usa para motivar que hace falta un relleno que impida cifrar números chicos (cues 876-882).

### 2. Mensajes (y exponentes) pequeños

Si $m^{e} < n$, la exponenciación **no da vuelta** módulo $n$: el resultado de calcular $m^e$ sobre los enteros ya es menor que el módulo, así que la reducción $\bmod\ n$ no hace nada y

$$c = m^{e} \bmod n = m^{e} \quad \text{(sin reducción)}$$

Recuperar $m$ de ahí no requiere invertir nada módulo $n$: alcanza con calcular la **raíz $e$-ésima entera ordinaria** de $c$ sobre los números enteros —un problema mucho más fácil que invertir RSA en general—. Esto es exactamente lo que hace peligroso usar $e=3$ (histórico, elegido para acelerar el cifrado): con $e$ chico, la condición $m^{e}<n$ se cumple para una fracción mucho mayor de mensajes cortos.

> **Errata de la filmina (25), y una precisión sobre la palabra "logaritmo" que la voz repite.** La filmina escribe la condición como *"me < n"*, sin exponente — la condición correcta es $m^{e} < n$, no $m \cdot e < n$: verificado sobre la página renderizada, no es un aplanado de `pdftotext`, ahí nunca hubo superíndice. Y la propia filmina dice después *"se puede calcular el logaritmo"*; el docente lo dice igual en el aula: *"conozco $e$, conozco el valor de $p$ a la $e$; encontrar $p$ es resolver un logaritmo (…) el logaritmo normal, que es súper eficiente, nos daría el resultado"* (cues 888-891). Técnicamente **no es un logaritmo sino una raíz $e$-ésima** la que recupera $m$ — el logaritmo discreto es el problema de [[diffie-hellman|Diffie-Hellman]], un problema distinto—. La conclusión de la voz es correcta de todos modos: sobre los enteros, sin reducción modular, **las dos operaciones son eficientes**, y ése es el punto.

> [!quote]- De la transcripción — mensajes chicos, y por qué no se puede "adivinar" cuáles son fáciles (cues 883-894)
> *"Se imaginarán que este número $n$ tiene que ser un número muy grande, para no entrar en que se resuelva por fuerza bruta. Pero ¿qué pasa si el $p$ es muy chico, al punto que $p$ a la $e$ termina siendo menor que $n$? $e$ es el exponente público, es conocido. Así que si yo tengo el texto cifrado, conozco $e$, conozco el valor de $p$ a la $e$; encontrar $p$ es resolver un logaritmo. Gran parte de la seguridad de esto, parecida a Diffie-Hellman, es que esto sería un logaritmo discreto. Pero si estos números son lo suficientemente chicos, nunca tuvimos que reducir módulo $n$, y el logaritmo normal, que es el súper eficiente, nos daría el resultado. Entonces hay un montón de textos planos que serían triviales de recuperar. Y **no queremos un criptosistema donde tengamos que estar adivinando 'esto que voy a cifrar, ¿va a ser fácil o difícil?'** Necesitamos algo que sea consistente, que para todo texto plano posible nos dé un nivel de seguridad parecido."*

**Ejemplo numérico del ataque** *(lectura nuestra)*. Con $e=3$ y $n$ de $2048$ bits, si $m < n^{1/3}$ (es decir, $m$ cabe en menos de $\sim 683$ bits), entonces $m^{3} < n$ literalmente sobre los enteros, y $c = m^3$ sin reducción: calcular $\sqrt[3]{c}$ con aritmética de precisión arbitraria recupera $m$ exactamente, sin factorizar $n$ ni conocer $d$.

### 3. Módulos repetidos

Si dos pares de claves distintos, $(n,e_1)$ y $(n,e_2)$, **comparten el mismo módulo** $n$ — por ejemplo, porque una implementación reutiliza el mismo $n$ para varios usuarios para ahorrar el costo de generar primos nuevos —, es posible recuperar $n$ a partir de observar suficiente tráfico cifrado, y a partir de $n$, **factorizarlo** en $p\cdot q$ y reconstruir la clave privada de **cualquiera** de los dos pares. El costo de factorizar $n$ es, por diseño, la única barrera de seguridad de RSA; compartir el módulo la tira por la ventana para ambos usuarios a la vez. **La voz no desarrolla este tercer problema**: lo engloba en *"hay un montón de otros problemas de ese tipo, que por suerte son conocidos y tienen una resolución bastante sistémica"* (cues 896-897) — la resolución sistémica es [[pkcs1-y-tamano-de-claves|PKCS#1]].

*(Nota adicional, lectura nuestra: si además el **mismo mensaje** $m$ se cifra con el mismo $n$ pero exponentes $e_1, e_2$ coprimos hacia dos destinatarios distintos, existe un ataque —de módulo común— que recupera $m$ sin factorizar nada, combinando los dos criptogramas con Bézout sobre $e_1, e_2$; no está en la filmina, se menciona porque es la explotación práctica más directa de este problema.)*

## Ejemplo numérico, verificado

Parámetros muy pequeños, a modo ilustrativo (nunca de tamaño real): $p=2\,357$, $q=2\,551$.

$$n = p\cdot q = 6\,012\,707, \qquad \varphi(n) = (p-1)(q-1) = 6\,007\,800$$

Con $e = 3\,674\,911$ (elegido al azar, coprimo con $\varphi(n)$) y $d = 422\,191$ (obtenido por Euclides extendido):

$$e\cdot d \bmod \varphi(n) = 1 \quad\checkmark$$

Cifrado de $m = 5\,234\,673$:

$$\mathsf{Enc}(m) = 5\,234\,673^{\,3\,674\,911} \bmod 6\,012\,707 = 3\,650\,502$$

Descifrado de $c = 3\,650\,502$:

$$\mathsf{Dec}(c) = 3\,650\,502^{\,422\,191} \bmod 6\,012\,707 = 5\,234\,673 \quad\checkmark$$

Las tres cuentas cierran exactamente como las escribe la filmina — reverificadas acá con aritmética modular en Python (`pow(m, e, n)` y `pow(e, -1, phi)`), no sólo tomadas del PDF. En clase el ejemplo se proyectó y se pasó *"para confirmar con números que los números dan, pero más o menos rápido"* (cue 899); la cuenta que sí se hizo despacio fue la demostración general de arriba.
