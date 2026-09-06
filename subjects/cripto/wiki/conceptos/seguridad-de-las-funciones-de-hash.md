---
title: Seguridad de las funciones de hash
resumen: 'Cuánto cuesta romper cada resistencia de un hash por fuerza bruta. Preimagen y segunda preimagen cuestan del orden de la cantidad de salidas posibles; las colisiones, sólo su raíz cuadrada, por la paradoja del cumpleaños.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Seguridad de las funciones de hash, Paradoja del cumpleaños, Ataque del cumpleaños, Birthday attack, Bits de seguridad de un hash, Tamaño de salida de un hash]
type: concepto
unidad: 1
clase: 3
orden: 11
created: 2026-08-28
updated: 2026-09-04
tags: [criptografia, hash, cumpleanos, colisiones, tamanos, riesgo, clase-03]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "Clase 4.pdf"]
---

# Seguridad de las funciones de hash

**Cuánto cuesta romper un hash, y de dónde sale el número.** Las [[resistencias-de-una-funcion-de-hash|resistencias]] dicen *qué* tiene que ser difícil; esta nota dice *cuánto* de difícil es, y la respuesta trae una sorpresa: **la propiedad más fuerte de las tres es la más barata de romper.** El culpable es la paradoja del cumpleaños, y de ella sale directamente el tamaño de salida que hay que exigirle a una función de hash.

> **Las filminas de esta nota —34 y 35— son de la segunda sesión de la Clase 3, el 03/09, y esa sesión sí está grabada.** La transcripción ([`Clase 03pt2 - Transcripcion.VTT`](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT), 910 cues) cubre este tramo en los **cues pt2 468-547**, y la nota está escrita contra ella además de contra el PDF, Katz & Lindell y lecturas propias rotuladas como tales. Los cues llevan **prefijo de parte** porque la Clase 3 tiene dos grabaciones que numeran desde 1: `(cues pt1 N)` para el 27/08 y `(cues pt2 N)` para el 03/09.
>
> Aporta además la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del **31/08**, cuya filmina 9 es más exigente que la teoría en un punto y agrega una salvedad que la teoría no hace.

---

## Los tres objetivos del atacante

Del slide 34. Sea $h: A \to B$ la función de hash:

| Objetivo | Qué se le da al atacante | Qué tiene que hallar | Fuerza bruta |
|---|---|---|---|
| **Preimagen** | $y \in B$ | $x$ con $h(x) = y$ | $\lvert B\rvert$ intentos |
| **Segunda preimagen** | $(x, y)$ con $h(x) = y$ | $x' \neq x$ con $h(x') = y$ | $\lvert B\rvert$ intentos |
| **Colisión** | nada | $x, x'$ con $x \neq x'$ y $h(x) = h(x')$ | $\lvert B\rvert^{1/2}$, **paradoja del cumpleaños** |

La diferencia entre las tres filas es **cuánta libertad tiene el atacante**, y eso es lo único que explica la raíz cuadrada de la última:

- En las dos primeras el **blanco está fijo**: hay un único $y$ que sirve. Cada intento acierta con probabilidad $1/\lvert B\rvert$ y hacen falta del orden de $\lvert B\rvert$ intentos.
- En la tercera **no hay blanco**: sirve *cualquier* par que coincida. El atacante no busca un valor, busca una **repetición**, y las repeticiones aparecen muchísimo antes.

> **Precisión sobre el "requiere $\lvert B\rvert$ intentos"** *(nuestra; el slide lo escribe como si fuera exacto).* $\lvert B\rvert$ es el **orden de magnitud**: la esperanza de una búsqueda uniforme es $\lvert B\rvert/2$ y el peor caso es $\lvert B\rvert$. Lo que sí es una afirmación precisa, y vale más, es la negativa que da Katz & Lindell §5.4.1: **no se conoce ningún ataque genérico a preimágenes ni a segundas preimágenes que haga menos de $2^{\ell}$ evaluaciones**, con $\ell$ la longitud de salida. El cumpleaños **sólo** sirve para colisiones.

> **Nota de vocabulario:** el slide dice *"segundas imágenes"*; el término estándar es **segunda preimagen** (*second preimage*). Es la misma noción. *(Precisión nuestra.)*

## Por qué la raíz cuadrada: la paradoja del cumpleaños

La filmina nombra la paradoja y no la desarrolla. Vale la pena hacerlo, porque **la cuenta es corta y el resultado gobierna todos los tamaños de la criptografía de hash**.

**El planteo.** Sea $N = \lvert B\rvert$ la cantidad de salidas posibles. El atacante evalúa $h$ sobre $q$ entradas **distintas** y se pregunta con qué probabilidad dos de los $q$ digests coinciden. Modelando $h$ como una función aleatoria, la probabilidad de que **no** haya colisión es la de ir eligiendo valores libres uno tras otro:

$$\Pr[\text{sin colisión}] = \prod_{i=1}^{q-1}\left(1 - \frac{i}{N}\right)$$

**La cota.** Usando $1 - x \le e^{-x}$ en cada factor:

$$\Pr[\text{sin colisión}] \;\le\; \exp\left(-\sum_{i=1}^{q-1}\frac{i}{N}\right) \;=\; \exp\left(-\frac{q(q-1)}{2N}\right)$$

**El despeje.** Pedir que la probabilidad de colisión llegue a $1/2$ es pedir $\exp(-q(q-1)/2N) = 1/2$, o sea $\dfrac{q(q-1)}{2N} = \ln 2$, y para $q$ grande $q(q-1)\approx q^{2}$:

$$q \;\approx\; \sqrt{2\ln 2}\,\sqrt{N} \;\approx\; 1{,}18\,\sqrt{N}$$

**Ahí está la raíz cuadrada del slide 34.** Y la constante $1{,}18$ es lo de menos: lo que importa es que $q$ escala con $\sqrt{N}$ y no con $N$.

### De dónde sale la sorpresa

> **La cuenta no se hace sobre elementos, se hace sobre pares.** *(Ésta es la única frase que hay que recordar.)* Con $q$ entradas hay $\binom{q}{2} = \dfrac{q(q-1)}{2}$ **pares**, y cada par colisiona con probabilidad $1/N$. La cantidad de pares crece **cuadráticamente** con $q$, así que alcanza $N$ cuando $q$ alcanza $\sqrt{N}$. La intuición falla porque uno cuenta personas y la matemática cuenta apretones de manos.

### El caso de los 23

Con $N = 365$ días:

$$q \approx 1{,}18\,\sqrt{365} = 1{,}18 \times 19{,}1 \approx 22{,}5 \;\Longrightarrow\; \textbf{23 personas}$$

Y el número exacto lo confirma: con 23 personas la probabilidad de que dos compartan cumpleaños es **0,507**; con 22 es 0,476. La cuenta de pares lo explica de una: $\binom{23}{2} = 253$ pares, y $253/365 = 0{,}693 = \ln 2$ — justo el valor que hace que $e^{-0{,}693}$ valga $1/2$.

**Y ahora el contraste que vuelve todo esto criptografía.** Cambiemos la pregunta a *"¿cuánta gente hace falta para que alguien comparta **mi** cumpleaños?"*:

$$1 - \left(\tfrac{364}{365}\right)^{n} \ge \tfrac12 \;\Longrightarrow\; n \ge \frac{\ln 2}{-\ln(364/365)} \approx 253$$

**253 personas contra 23.** Un factor de once para $N = 365$, y el factor **crece como $\sqrt{N}$**: es $\dfrac{N\ln 2}{1{,}18\sqrt{N}} \approx 0{,}59\sqrt{N}$. Con $N = 2^{160}$ —una salida de 160 bits— la segunda pregunta sale **$\approx 2^{79}$ veces más barata** que la primera. Y las dos preguntas son exactamente las dos filas de la tabla de arriba:

| Pregunta | Fila de la tabla | Costo |
|---|---|---|
| ¿Alguien comparte **mi** cumpleaños? | segunda preimagen — blanco fijo | $\approx \ln 2 \cdot N$, lineal |
| ¿**Dos cualesquiera** comparten cumpleaños? | colisión — sin blanco | $\approx 1{,}18\sqrt{N}$ |

*(Curiosidad: $253 = \binom{23}{2}$. Es coincidencia numérica, no un teorema — las dos cuentas dan $\ln 2$ por motivos distintos.)*

### Cómo se dio en el aula, y el 23 que aportó un alumno

El docente llega a la paradoja **por el ataque, no por la probabilidad**: primero pregunta cómo se rompe cada resistencia por fuerza bruta, deja que la clase conteste que se generan mensajes hasta pegarle, y recién ahí muestra que con colisiones se puede ser más astuto — cada mensaje nuevo se compara contra **todos** los anteriores, no contra uno. Es la cuenta de pares dicha sin escribirla. El número exacto lo pone un alumno.

> [!quote]- De la transcripción — la progresión de comparaciones, que es la cuenta de pares (cues pt2 501-504)
> *"No, por esto que les conté: porque yo no es que genero 2 mensajes y, si no hay colisión, tiro y genero otros 2 mensajes. Yo puedo generar [el] primer mensaje, genero el segundo y lo comparo; genero el tercero y lo comparo con los 2 que generé; el cuarto contra los 3. Y así voy haciendo. Y esa progresión de búsqueda —piénsenlo cuando genero el mensaje $n$— es muy parecida a un problema estadístico que se estudia en probabilidades como la paradoja del cumpleaños."*

> [!quote]- De la transcripción — el 23 lo aporta un alumno (cues pt2 510-519)
> **510-515.** *"Y si lo quiero poner de la otra manera: ¿cuántas personas —cuántos mensajes, cuántas personas— tendría que tener en el grupo para que haya una probabilidad no despreciable de que 2 personas cumplan el mismo día, o 2 mensajes [caigan] en el mismo hash? El número es súper bajo versus por ahí la intuición. (…) Uy, ahora se me fue, no me acuerdo si 14 o 21, pero…"*
>
> **516-519.** `EMILIO JOSÉ MITCHELL`: *"23, [al] 50 por 100."* — *"Veintitrés. Ahí está, gracias. Número mucho más bajo que 365. Acá pasa lo mismo: el número está en un orden —no es exactamente lo mismo, hay una constante— pero está en el orden de la **raíz cuadrada del tamaño del conjunto**."*

**El número de MD5, con las dos cifras.** El docente cierra la cuenta con el caso concreto y después lo derrumba: la fuerza bruta pide $2^{64}$, pero los ataques publicados desde 2004 bajan el costo real a **menos de $2^{20}$ operaciones**. Son cuarenta y cuatro órdenes binarios de diferencia — la distancia entre *"caro"* y *"un rato en una notebook"*.

> [!quote]- De la transcripción — de 2 a la 64 a menos de 2 a la 20 (cues pt2 521-538)
> **521-524.** *"La complejidad de hallar colisiones por fuerza bruta requiere explorar aproximadamente la raíz cuadrada del espacio. Si yo tengo $2^{128}$ elementos, como pasa en [MD5], yo requeriría aproximadamente $2^{64}$ exploraciones para poder encontrar una colisión. $2^{64}$ es un número que hoy no nos dejaría tranquilos: hoy hay poder de cómputo como para ejecutar $2^{64}$ operaciones de este tipo."*
>
> **538.** *"Desde un punto de vista formal decimos que [MD5] está quebrado. Sí, porque además, con los ataques publicados que hay, no se necesitan $2^{64}$: se necesitan **menos de $2^{20}$ operaciones** para encontrar una colisión."*

### Por qué los hashes tienen el doble de bits que las claves

Es el corolario que el docente saca de la paradoja, y explica de una sola vez por qué `AES` usa claves de 128 bits mientras que el hash recomendado saca 256:

> [!quote]- De la transcripción — el factor dos entre hash y clave (cues pt2 541-545)
> *"Ésta es la razón por la cual las funciones de hash modernas estandarizadas tienen tamaños que aproximadamente son **el doble en bits** que las de las funciones (…) que las claves de los criptosistemas. Tiene que ver con esto, porque la paradoja del cumpleaños es como que de alguna manera lleva el ataque de fuerza bruta a que tenga que explorar la mitad del tamaño [en] bits del conjunto, o la raíz cuadrada de la cantidad de elementos."*

Dicho como regla: para un nivel de seguridad de $\lambda$ bits hace falta una **clave** de $\lambda$ bits y un **hash** de $2\lambda$. No es una convención de la industria; sale de que el mejor ataque genérico contra una clave es lineal en el espacio y el mejor contra un hash es la raíz cuadrada. La tabla de [[eleccion-de-primitivas|elección de primitivas]] y la de [[primitivas-de-hash-estandar|primitivas de hash estándar]] se leen juntas con este factor 2 en la mano.

### La salvedad que rompe la jerarquía en dominios chicos

El docente interrumpe la exposición para agregar algo que **ninguna filmina dice** y que cambia el alcance de todo el bloque: la resistencia a colisiones implica las otras dos **asintóticamente**, no matemáticamente. En los bordes —entrada muy chica, pocos mensajes, etiquetas cortas— la implicación se cae.

> [!quote]- De la transcripción — la implicación es asintótica, no matemática (cues pt2 471-478)
> **471-476.** *"Algo que se me escapó decirles: la resistencia a colisiones se relaciona con estas 2, pero [de] una forma bastante compleja, y **no garantiza segundas preimágenes y preimágenes matemáticamente**, porque hay casos borde donde no lo puede garantizar: si la entrada es muy chica, o si la cantidad de mensajes que ciframos [es] muy chica. Entonces hay como subcategorías que se escapan del conocimiento de la materia, donde se habla de segundas preimágenes en conjuntos chicos, segundas preimágenes [con] etiquetas de tamaño chico…"*
>
> **477-478.** *"Ahora, asintóticamente, cuando hablamos de etiquetas de tamaño grande y potencialmente muchos mensajes, resistencia a colisiones **garantiza las otras 2 propiedades**. Por eso nos centramos sólo en esa prueba."*

**Esto no es una nota al pie: es la justificación teórica de un ejercicio de la guía.** El [[ataque-de-diccionario-sobre-hashes|ataque de diccionario sobre hashes]] —Ej. 6 de la [[guia-03-mac-y-funciones-de-hash|Guía 3]]— recupera las ocho notas de un curso enumerando un dominio de **diez** cadenas, contra una `SHA-1` que nadie rompió. El vault venía diciendo que ahí *"la resistencia a preimágenes no se viola, se esquiva"*; hasta el 03/09 eso era una lectura propia, y ahora tiene respaldo en lo dicho en clase: **el dominio de diez elementos es exactamente el caso borde que el docente exceptúa**. La jerarquía de [[resistencias-de-una-funcion-de-hash|03.07]] vale donde el dominio es grande; ese ejercicio vive justo del otro lado.

### Lo que agrega la Práctica 04

La filmina 9 del deck del **31/08** dice dos cosas que la filmina 35 de teoría no dice, y las dos apuntan al mismo lado:

| | Teoría, filmina 35 | Práctica 04, filmina 9 |
|---|---|---|
| El umbral | *"Tamaño mínimo de salida: 160 bits"* | *"necesita tener una salida que sea **mayor de** 160 bits"* — estrictamente mayor, no 160 |
| El estatus del umbral | se enuncia solo | *"Es una condición **necesaria pero no suficiente**"* |

La segunda es la que importa. Un hash de 512 bits mal diseñado no es seguro por ser largo: el tamaño de salida sólo acota el **ataque genérico**, el de fuerza bruta que esta nota calcula. Contra un ataque estructural —los de 2004 contra `MD5`, `SHAttered` contra `SHA-1`— el tamaño no protege, y de hecho las dos funciones que cayeron cumplían su propio umbral. *(La práctica lo dice; el desarrollo de por qué es nuestro.)*

> **Y el umbral mismo ya quedó corto.** Los 160 bits del slide dan $2^{80}$ contra colisiones, que es la cuenta de la sección siguiente. Ver [[#Por qué 2 elevado a la 80 ya no alcanza|Por qué 2 elevado a la 80 ya no alcanza]].

## La consecuencia operativa: L bits de salida dan L/2 bits de seguridad

Si la salida tiene $L$ bits, entonces $\lvert B\rvert = 2^{L}$ y

$$\lvert B\rvert^{1/2} = \left(2^{L}\right)^{1/2} = 2^{L/2}$$

**Un hash de $L$ bits ofrece $L$ bits de seguridad contra preimágenes y sólo $L/2$ contra colisiones.** De ahí sale, sin más, el slide 35:

| Del slide 35 | Valor |
|---|---|
| Tamaño **mínimo** de salida | **160 bits** |
| Fuerza bruta contra imágenes | $2^{160}$ operaciones |
| Fuerza bruta contra colisiones | $2^{80}$ operaciones |

Y con los tamaños de las [[primitivas-de-hash-estandar|primitivas estándar]]:

| Primitiva | $L$ | Preimagen | Colisión |
|---|---|---|---|
| `MD5` | 128 | $2^{128}$ | $2^{64}$ |
| `SHA-1` | 160 | $2^{160}$ | $2^{80}$ |
| `SHA-256` | 256 | $2^{256}$ | $2^{128}$ |
| `SHA-512` | 512 | $2^{512}$ | $2^{256}$ |

> **La asimetría con el cifrado, que es donde más se confunde.** *(Lectura nuestra.)* Una clave de [[aes|AES]] de 128 bits da **128 bits de seguridad**: recorrerla cuesta $2^{128}$. Un hash de 128 bits da **64**. Por eso los tamaños no se comparan de frente: **para igualar a `AES-128` hace falta un hash de 256 bits, no de 128.** Katz & Lindell lo dice tal cual: si se quiere que hallar colisiones sea tan difícil como una búsqueda exhaustiva sobre claves de 128 bits, la salida tiene que ser de al menos 256 bits. La regla general de dimensionamiento del libro: **para resistir un ataque que corre en tiempo $T$, la salida necesita al menos $2\log_{2} T$ bits.**

> **Y el corolario que parece paradójico y no lo es.** La [[resistencias-de-una-funcion-de-hash|resistencia a colisiones es la más fuerte]] de las tres —implica a las otras dos— y sin embargo es **la primera en caer**, a mitad de costo exponencial. No hay contradicción: que una propiedad sea más fuerte significa que **exige más de la función**, no que sea más cara de atacar. Es exactamente lo que le pasó a `MD5` y a `SHA-1`, que están rotas para colisiones y siguen en pie para preimágenes.

## La escala física: dónde cae 2 elevado a la 80

En [[eleccion-de-primitivas#Tamaños|Elección de primitivas]] ya está la escala con la que se leen estos exponentes. Puesta contra los números del hash:

| Referencia | Orden |
|---|---|
| Edad estimada del universo | $\approx 2^{58}$ segundos |
| **SHAttered**, la colisión real de `SHA-1` (2017) | $\approx 2^{63}$ evaluaciones |
| Colisiones sobre una salida de **160 bits** | $2^{80}$ |
| El $2^{88}$ de la filmina de la Clase 02 | $2^{88}$ |
| Colisiones sobre una salida de **256 bits** | $2^{128}$ |

*(La fila de $2^{88}$ va con la [[eleccion-de-primitivas#Tamaños|errata ya marcada allá]]: la filmina de la Clase 02 la presenta como la cantidad de átomos del universo y no lo es. Sirve igual como escalón de la escala.)*

> **Lo que hay que leer en esta tabla.** *(Lectura nuestra.)* El $2^{80}$ no está entre los números imposibles: está **17 órdenes binarios por encima de un ataque que ya se pagó**. SHAttered costó $\approx 2^{63}$ y se ejecutó de verdad en 2017, con presupuesto de una empresa. $2^{80}$ es $2^{17} \approx 131\,000$ veces eso — caro, pero no de otro orden. Compárese con $2^{128}$, que es $2^{65}$ veces SHAttered y ahí sí cambia de categoría.
>
> Con el vocabulario de [[estado-de-un-criptosistema#Los tres estados|Estado de un criptosistema]]: **una salida de 160 bits no está quebrada, está debilitada.** Y un sistema debilitado es un sistema con fecha de vencimiento.

## Por qué 2 elevado a la 80 ya no alcanza

El *"mínimo 160 bits"* del slide 35 es la recomendación de otra época, y conviene saber por qué se movió:

1. **Porque $2^{80}$ dejó de ser una frontera.** Es la lectura de la tabla de arriba: el margen contra lo que ya se hizo es de 17 bits, no de 60.
2. **Porque la memoria no es una defensa.** La objeción natural al ataque del cumpleaños es que guardar $2^{80}$ digests es imposible. Es cierto de la versión ingenua, pero K&L §5.4.2 da una variante por **detección de ciclos** que baja la memoria a prácticamente nada manteniendo el mismo tiempo. **La cota de espacio no protege.**
3. **Porque las colisiones sí sirven para atacar.** Ver la sección siguiente.
4. **Porque el propio slide se contradice en la práctica.** Marca el mínimo en 160 y **recomienda `SHA-3` de 256 bits** dos líneas más abajo. El mínimo que la filmina realmente sostiene es 256.

**El mínimo hoy es 256 bits de salida**, que es lo que dan `SHA-256` y `SHA3-256`. *(Síntesis nuestra sobre K&L §5.4.1 y §6.3.3.)*

> **Errata de la filmina:** en la lista de recomendadas del slide 35, **`SHA-1` figura sin ninguna marca**, al lado de `MD5` que sí dice "Quebrada". Con lo de esta nota se ve por qué es grave: 160 bits de salida son **80 bits de seguridad contra colisiones**, y ese margen se agotó en 2017 con SHAttered. Está desarrollado en [[primitivas-de-hash-estandar|Primitivas de hash estándar]].

## Una colisión cualquiera no parece útil, y sin embargo lo es

Es la objeción que siempre aparece: *"el ataque del cumpleaños te da dos mensajes basura que colisionan, ¿y con eso qué?"*. Katz & Lindell §5.4.1 la contesta con un ejemplo que conviene tener guardado:

Alice quiere que una **carta de recomendación** y una **carta de despido** tengan el mismo hash, para que la firma de una valga para la otra. Escribe cada carta y en cada frase elige entre sinónimos intercambiables —*difícil / complicado / arduo / imposible*—. Con **64 palabras con un sinónimo cada una** genera $2^{64}$ redacciones **del mismo texto**, todas igualmente presentables. Hace lo mismo con la otra carta. Después busca una colisión **entre los dos conjuntos**: con $2^{\ell/2}$ variantes de cada tipo, la halla con probabilidad $\approx 1/2$.

**La clave es que el ataque del cumpleaños sólo necesita entradas distintas, no entradas aleatorias.** Nada obliga a que los mensajes sean basura: pueden ser $2^{64}$ documentos con sentido y con el contenido que el atacante quiera. Eso es lo que convierte una curiosidad combinatoria en una falsificación de firma.

> **Y el escalón anterior, que es el slide 24.** Si hay $n+1$ mensajes y $n$ valores de salida, **existe** al menos una colisión: es el principio del palomar, y garantiza colisiones con $2^{\ell}+1$ entradas → [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]]. El cumpleaños es el refinamiento probabilístico de eso: no *garantiza* una colisión, pero la consigue con probabilidad $1/2$ usando la **raíz cuadrada** de las entradas. La distancia entre $2^{\ell}$ y $2^{\ell/2}$ es toda la diferencia entre "existe" y "la encuentro".

## Ver también

- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] — las tres propiedades que acá se ponen a precio, y el juego `Hash-Coll`
- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] — la definición sobre la que se monta todo esto
- [[primitivas-de-hash-estandar|Primitivas de hash estándar]] — qué salida tiene cada una y cuál está rota
- [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] — por qué la seguridad de la función entera se reduce a la de la función de compresión
- [[hmac|HMAC]] — dónde entra la resistencia a colisiones como hipótesis de un teorema
- [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]] — el ataque en el que ninguno de estos exponentes aparece, porque el costo lo fija el tamaño del dominio
- [[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]] — **la nota que hay que leer junto con ésta.** Un exponente no dice nada por sí solo: dice algo contra un escenario concreto. Es la razón por la que el docente sostiene que `MD5` está formalmente quebrada y que aun así sirve para verificar la lista de figuritas que faltan del álbum
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — seguro / debilitado / quebrado, el vocabulario para clasificar los $2^{80}$
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] — la escala física de los exponentes
- [[seguridad-computacional|Seguridad computacional]] — qué significa "computacionalmente imposible"
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]]
- Katz & Lindell §5.4 *Generic Attacks on Hash Functions* (ataque del cumpleaños y la variante de poco espacio) ([[bibliografia|bibliografía]])
