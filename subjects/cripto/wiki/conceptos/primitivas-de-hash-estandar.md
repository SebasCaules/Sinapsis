---
title: Primitivas de hash estándar
resumen: 'Catálogo de las funciones de hash estándar MD5, SHA-1, SHA-2 y SHA-3 con el estado de cada una: cuáles están quebradas, cuál conviene usar y la historia de ataques que llevó de una a la siguiente.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]", "[[practica-04-macs-hash-y-cifrado-autenticado]]"]
aliases: [Primitivas de hash estándar, MD5, SHA-1, SHA-2, SHA-3, Keccak, SHAttered]
type: concepto
unidad: 1
clase: 3
orden: 9
created: 2026-08-28
updated: 2026-09-04
tags: [criptografia, hash, md5, sha1, sha2, sha3, keccak, clase-03]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "raw/practicas/Clase 4.pdf"]
---

# Primitivas de hash estándar

**Cuál es cuál, cuál está rota y cuál hay que usar.** Es la nota a la que se vuelve cuando aparece `MD5`, `SHA-1`, `SHA-2` o `SHA-3` en un enunciado, en una biblioteca o en un paper, y hay que decidir en dos minutos si sirve. El análogo, del lado del hash, de lo que [[eleccion-de-primitivas|Elección de primitivas]] es del lado del cifrado.

Y es también la nota donde más pesa **la historia**: las cuatro primitivas no son cuatro opciones simultáneas de un catálogo, son cuatro capas de sedimento de treinta años de ataques. Esa historia la cátedra la cuenta entera en voz y no está en ninguna filmina.

> **Fuentes de esta nota.** Las filminas son de la **segunda sesión de la Clase 3, del 03/09** (slides 30-32 y 35), que **sí tiene transcripción**: [`Clase 03pt2 - Transcripcion.VTT`](../../raw/clases/Clase%2003pt2%20-%20Transcripcion.VTT), 910 cues. Los cues de esa grabación se citan acá como `(cues pt2 N-M)`, porque la Clase 3 tiene **dos** grabaciones y las dos numeran desde 1. La [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del 31/08 agrega su propia tabla de primitivas (filmina 10). Lo que sale del PDF, de la clase, de Katz & Lindell o de lectura propia va rotulado en cada caso.
>
> **Ojo con el ASR al verificar una cita:** la transcripción castellaniza mal los nombres de las primitivas — `MD5` sale como *"Md. Cinco"* o *"M de 5"*, `SHA-1` como *"ya 1"*, `SHA-3` como *"ya 3"*, *hash* como *"Cash"*, *"gas"* o *"calle"*. Las correcciones de palabra entera van entre corchetes en las citas de abajo; los rangos de cues siguen siendo verificables tal cual.

---

## El cuadro comparativo

Los estados usan el vocabulario **seguro / debilitado / quebrado** de [[estado-de-un-criptosistema#Los tres estados|Estado de un criptosistema]]: *seguro* = cumple con las expectativas de su modelo, *debilitado* = hay ataque mejor que la fuerza bruta pero impagable hoy, *quebrado* = hay ataque en tiempos practicables.

| Primitiva | Año | Salida | Construcción | Estado |
|---|---|---|---|---|
| `MD5` | 1991 | 128 bits | [[construccion-de-merkle-damgard\|Merkle-Damgård]] | **quebrada** — colisiones en 2004, hoy en menos de un minuto en una PC de escritorio |
| `SHA-1` | 1995 | 160 bits | Merkle-Damgård, compresión Davies-Meyer | **quebrada** — colisión explícita en 2017 (SHAttered). La cátedra no coincide: ver [[#SHA-1: dónde el vault no coincide con la cátedra\|SHA-1: dónde el vault no coincide con la cátedra]] |
| `SHA-2` | 2001 borrador, 2002 FIPS 180-2 | 224 / 256 / 384 / 512 bits | Merkle-Damgård, compresión Davies-Meyer | **seguro** |
| `SHA-3` | 2012 elegida, 2015 estandarizada | 224 / 256 / 384 / 512 bits | **esponja** | **seguro**, recomendado para proyectos nuevos |

> **De dónde salen los años.** Los de `MD5` (1991) y `SHA-1` (1995) son de Katz & Lindell §6.3.3. Los de `SHA-3` están discutidos abajo. **El de `SHA-2` no está ni en la filmina ni en K&L**: `SHA-256/384/512` aparecen por primera vez en el borrador de 2001 y el estándar **FIPS 180-2 se aprobó en agosto de 2002** (la variante de 224 bits llegó recién con el change notice de 2004). Todo eso es conocimiento externo al vault. **La única de las cuatro que la filmina fecha es `SHA-3`** —*"Estandarizado por NIST en 2013"*, slide 32, y esa fecha es errata: ver abajo—; a `MD5`, `SHA-1` y `SHA-2` no las fecha. *(Precisión nuestra.)*

Dos lecturas que la tabla deja a la vista y la filmina no enuncia —pero que **el docente sí desarrolla en voz**, y esta nota registra abajo con sus citas—:

1. **Tres de las cuatro son la misma construcción.** `MD5`, `SHA-1` y `SHA-2` comparten paradigma —función de compresión al estilo Davies-Meyer sobre un cifrado de bloque, más [[construccion-de-merkle-damgard|Merkle-Damgård]] para longitud arbitraria— y comparten linaje: las tres descienden de MD4. Eso es exactamente lo que vuelve peligrosa la situación de 2005-2012: un avance criptoanalítico contra el paradigma se llevaba puestas las tres a la vez. `SHA-3` rompe con eso a propósito, y **ése fue el criterio explícito con el que se la eligió** → [[#SHA-3|SHA-3]].
2. **Las salidas crecen porque las colisiones cuestan la raíz.** 128 → 160 → 256 no es inflación gratuita: un hash de $L$ bits da sólo $L/2$ bits de seguridad contra colisiones, así que `MD5` nunca ofreció más de $2^{64}$ y `SHA-1` nunca más de $2^{80}$ → [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]].

## MD5

De la filmina (slide 30):

- **Entrada:** secuencia de hasta $2^{64}$ bits.
- **Salida:** secuencia de **128 bits**.
- **Aplicación iterativa.**

> **No es una errata: es un artefacto de la extracción del PDF.** *(Verificación nuestra.)* Al copiar el texto del slide con `pdftotext` el límite sale como `264 bits`, y es tentador leerlo como un $2^{64}$ al que se le perdió el exponente. **La filmina está bien**: el `64` es un superíndice tipográfico de verdad —`pdftotext -bbox-layout` lo ubica en otra línea de base y en cuerpo más chico que el `2`, y el render de la página lo muestra como $2^{64}$—. **Y ahora hay confirmación oral**: el docente lee el valor en voz alta, *"la entrada puede ser cualquier secuencia de hasta 2 a la 64 bits"* (cue pt2 380). Lo mismo vale para los $2^{160}$ y $2^{80}$ del slide 35. El defecto es de la herramienta con la que se lee el PDF, no de la cátedra, y por eso no va en la lista de erratas.
>
> **El valor en sí, para `MD5` y `SHA-1`, es correcto** ($2^{64}-1$ bits), y no es arbitrario: sale de que el padding de [[construccion-de-merkle-damgard|Merkle-Damgård]] codifica la longitud del mensaje en un campo de 64 bits. Un mensaje que no entra en ese campo no se puede paddear. La misma línea se repite en los slides 31 y 32, y **para `SHA-3` sí es falsa** — ahí sí hay errata, y es de contenido: ver abajo.

### El linaje MD y quién la escribió

**`MD5` es la quinta de una serie**, la familia **MD** de *message digest*, y su autor es **Ron Rivest** —el mismo de la R de RSA—. Eso el vault lo daba antes como "conocimiento estándar" sin respaldo; ahora es material de cátedra. El docente además le pone la analogía que ordena todo el bloque: `MD5` es, para las funciones de hash, **lo que `DES` es para los cifrados de bloque** — la primitiva histórica, masivamente desplegada, hoy obsoleta, que sigue siendo el mejor punto de entrada para explicar la familia.

> [!quote]- De la transcripción — el linaje MD, Rivest, y la analogía con DES (cues pt2 373-378)
> *"Una más conocida, histórica, que hoy día ya es un poco obsoleta, la que sería como el [DES] de las funciones de [hash]: [MD5]. [MD5] es la quinta generación de una serie de funciones de [hash MD], **message digest**, que es casi como función resumen de mensaje, creadas por **[Ron Rivest]**, que es uno de los criptógrafos famosos de nuestra época. [MD5] sigue el modelo iterativo de [Merkle-Damgård] y [usa] una función de compresión que se llama [MD5]."*

### Por qué se volvió masiva: el índice universal de las redes P2P

Es el caso de uso que explica la difusión de `MD5` mejor que ninguna recomendación técnica, y **no está en ninguna filmina del curso**.

El problema que resuelve es de sistemas de archivos distribuidos, no de criptografía: **cuando el mismo archivo vive en cientos de máquinas, tiene un nombre distinto y una ruta distinta en cada una.** No hay identificador estable. La función de hash da uno, y lo da **a partir del contenido**: dos copias del mismo archivo, con nombres distintos, dan el mismo digest; dos archivos distintos, no. Con eso, buscar deja de ser *"quién tiene un archivo llamado así"* y pasa a ser *"quién tiene un archivo cuyo contenido resume a esto"*.

Sobre esa idea se construyeron **eDonkey** y **Kademlia**, los antecesores directos de BitTorrent.

> [!quote]- De la transcripción — MD5 como índice universal en eDonkey y Kademlia (cues pt2 394-404)
> *"Se hizo súper popular porque las primeras redes de transferencia de archivos peer to peer —esto ya es historia antigua, pero por ahí escucharon hablar de **eDonkey**, **Kademlia**, que fueron siquiera los prototipos de [BitTorrent]— nacieron de la idea de utilizar esta función como una suerte de **índice universal**. O sea: si una función de hash criptográfica me da un resumen de todo el contenido de un archivo… el gran problema de los sistemas de archivos distribuidos es que cuando el archivo empieza a estar en un montón de computadoras, **tiene nombres distintos, está en lugares distintos**. Entonces las funciones de [hash] dejaban normalizar un único indicador que tenía que ver con el **contenido**. Entonces uno compartía una carpeta, se indexaban los archivos (…) uno buscaba y pedía por ese tipo de contenido."*

> **Qué queda de eso hoy** *(lectura nuestra).* La idea sobrevivió al descrédito de `MD5`: el direccionamiento por contenido es la base de Git (que usa `SHA-1`, y por eso migró a un modo de `SHA-256`), de los magnet links de BitTorrent, de IPFS y de la deduplicación de cualquier sistema de backup serio. Lo que cambió no es el patrón sino la primitiva con la que se instancia. Es, de paso, un uso donde lo que se necesita es **resistencia a colisiones** —dos contenidos distintos no deben compartir índice— y no resistencia a preimágenes, que es justo la propiedad que `MD5` perdió primero.

### Estado: quebrada

Es la única que la filmina marca. Katz & Lindell §6.3.2 pone los detalles que faltan: las colisiones las hallaron criptoanalistas chinos en **2004**, hoy se encuentran *"in under a minute on a desktop PC"*, y existen **colisiones controladas** —dos archivos PostScript con contenido visible arbitrario y el mismo digest—. Conclusión del libro, tal cual: `MD5` no debe usarse en ningún lugar donde haga falta seguridad criptográfica.

**El docente pone además una cifra que el vault no tenía**, y que conviene guardar porque es más elocuente que "menos de un minuto": la fuerza bruta contra colisiones de una salida de 128 bits cuesta $2^{64}$, pero **con los ataques publicados hacen falta menos de $2^{20}$ operaciones**. La distancia entre esos dos exponentes —44 órdenes binarios— es la medida exacta de lo que significa "quebrada".

> [!quote]- De la transcripción — el costo real de una colisión de MD5 hoy (cue pt2 538)
> *"Desde un punto de vista formal, decimos que [MD5] está quebrado. Sí, porque además, con los ataques publicados que hay, **no se necesitan 2 a las 64: se necesitan menos de 2 a la 20 operaciones** para encontrar una co[lisión]."*

> **Que esté quebrada para colisiones no la vuelve inútil para todo.** *(Lectura nuestra, y es la distinción que más se confunde.)* Lo que cayó de `MD5` es la **resistencia a colisiones**; la resistencia a **preimágenes** sigue en pie. Por eso `HMAC-MD5` no quedó roto en 2004 junto con `MD5` → [[hmac|HMAC]]. Nada de esto es una recomendación de uso: es la razón por la que "roto" hay que preguntarlo siempre contra qué propiedad → [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]].
>
> Y es también la razón por la que el docente se resiste a decir *"`MD5` es inseguro"* a secas: la respuesta correcta depende del escenario, no de la primitiva → [[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]].

## SHA-1

De la filmina (slide 31): entrada hasta $2^{64}$ bits, salida de **160 bits**, aplicación iterativa, y la frase *"Se construye sobre la base de MD5"*.

> **Errata de la filmina:** *"se construye sobre la base de MD5"* es impreciso. `SHA-1` **no** se construye sobre `MD5`. Lo que comparten es el **paradigma de diseño** (compresión Davies-Meyer + Merkle-Damgård) y el **linaje de MD4**, del que las dos descienden. Katz & Lindell §6.3.3 es explícito en que `SHA-1` sucede a **SHA-0** —retirada por fallas que nunca se especificaron públicamente—, no a `MD5`. *(El linaje MD4 es conocimiento estándar y no está en K&L; queda rotulado.)*
>
> La diferencia importa para el parcial: *"se construye sobre"* sugiere que romper `MD5` rompe `SHA-1`, y no es así — cayeron con nueve años de diferencia y con ataques distintos. Lo correcto es que **comparten familia**, que es una afirmación más débil y más útil.

### SHA-0, el encargo sin concurso, y la NSA

El vault sabía que `SHA-1` sucede a una `SHA-0` retirada *"por fallas que nunca se especificaron públicamente"*. La clase cuenta **cómo** pasó eso, y el relato es reconocible: **es el mismo patrón que las cajas $S$ de `DES`**.

La secuencia que da el docente: NIST pide una función de hash para uso comercial; **no hay concurso**, se encarga directamente; sale una función que hoy se llama `SHA-0` y que nunca se despliega; el diseño pasa por la **NSA**, que lo devuelve con cambios **y sin explicar por qué**; ese resultado es `SHA-1`.

> [!quote]- De la transcripción — el encargo, la NSA y los cambios sin explicación (cues pt2 405-412)
> *"En algún momento, siguiendo la misma lógica de [DES], el Instituto de Estándares en Estados Unidos pidió estandarizar una función de hash para uso comercial. (…) **No se hizo un concurso**, no queda muy claro; la comisionó directamente a [IBM] en su momento. Salió una función de [hash] que hoy día solemos llamar **[SHA-0]**, que no vio la luz. Parecido a lo que ocurrió con [DES], esa función se la pasaron a la **[NSA]**, la Agencia de Seguridad, y la Agencia de Seguridad dijo: *me gusta, sí, úsenla, pero úsenla con **estos cambios que no les voy a explicar por qué**, pero funciona con estos cambios, créanme que está buena*. Ésa es la función [SHA-1]."*

> **Precisión nuestra sobre la atribución a IBM.** El episodio *"lo diseñó IBM y la NSA lo modificó"* es, verificablemente, **la historia de `DES`** —que el propio docente cuenta en la [[des-y-3des#Evolución: cómo se erosionó|Clase 02]]—, no la de `SHA`. `SHA-0` (FIPS 180, 1993) y `SHA-1` (FIPS 180-1, 1995) fueron **diseñadas por la NSA** y publicadas por NIST; no hubo un contratista comercial intermedio. Lo que **sí** es correcto, y es lo sustantivo del relato, es el resto: no hubo concurso abierto, `SHA-0` se retiró casi de inmediato, y la corrección que produjo `SHA-1` se hizo **sin publicar el motivo**. *(Conocimiento externo al vault; no se puede resolver contra el material de la cátedra.)*

**El desenlace de esa historia llega en 2004, y es lo que la vuelve interesante.** Cuando los ataques del grupo chino destrozan `MD5`, `SHA-1` aguanta bastante mejor — **y aguanta gracias precisamente a los cambios que la NSA nunca explicó**. De ahí la especulación, todavía sin desclasificar, de que la agencia conocía esa familia de ataques con años de anticipación sobre la comunidad académica.

> [!quote]- De la transcripción — la especulación sobre la NSA (cues pt2 433-436)
> *"La cosa divertida, muy parecida a la historia de [DES]: resulta que [SHA-1] no se rompió tanto **por los cambios que había introducido la NSA**. Así que se especula —**todavía no está desclasificado** como para poder confirmarlo— que sabían de ciertos ataques avanzados antes de que la comunidad científica los descubra."*

> **Es literalmente el mismo argumento que las cajas $S$ de `DES`, del otro lado del curso.** *(Lectura nuestra.)* Allá: cajas secretas, sospecha de backdoor durante quince años, y en 1990 resulta que estaban elegidas para resistir el criptoanálisis diferencial que la academia recién descubría → [[des-y-3des#Evolución: cómo se erosionó|DES y 3-DES]]. Acá: cambios sin explicar, sospecha, y en 2004 resulta que eran los que la salvaron. La conclusión que el vault ya sacaba allá vale igual acá: **el secreto de diseño no mejoró la seguridad, sólo retrasó la confianza pública** — y en los dos casos la ventaja informativa de la agencia era real.

### Por qué 160 y no 128

El salto de `MD5` a `SHA-1` es, sobre todo, un salto de tamaño de etiqueta, y el docente lo justifica con la aritmética de la fuerza bruta: **cada bit agregado duplica el costo**, así que pasar de 128 a 160 bits multiplica el esfuerzo por $2^{32} \approx 4\times10^{9}$.

> [!quote]- De la transcripción — 128 queda incómodamente cerca, 160 se escapa (cues pt2 415-419)
> *"La gran diferencia entre [MD5] y [SHA-1] es que [SHA-1] tiene etiquetas un poco más largas: pasamos de 128 [bits] a 160. Y 128 bits para una función de hash —ahora, cuando veamos los modelos de ataques por fuerza bruta— **queda incómodamente cerca del poder de cómputo que puede tener un gobierno** o alguien que tenga acceso a mucho poder de cómputo. 160 ya se escapa. Acuérdense que **cada bit que agregamos duplica el esfuerzo de un ataque por fuerza bruta**; así que de 128 a 160 estamos multiplicando por mil millones y un poco más."*

> **La cuenta, hecha** *(precisión nuestra).* $2^{160-128} = 2^{32} = 4\,294\,967\,296$, que es el *"mil millones y un poco más"* del cue pt2 419 — bien dicho, con la salvedad de que son cuatro mil millones. Pero **ese factor es el de preimágenes**. Contra **colisiones**, que es la propiedad que efectivamente cayó, el salto real es de $2^{64}$ a $2^{80}$: el mismo factor $2^{16} = 65\,536$, no $2^{32}$ → [[seguridad-de-las-funciones-de-hash#La consecuencia operativa: L bits de salida dan L/2 bits de seguridad|Seguridad de las funciones de hash]]. Es la asimetría de la que vive toda esa nota, y explica por qué 160 bits envejecieron mucho más rápido de lo que sugiere la cuenta de arriba.

**El uso que motiva todo esto son los certificados digitales**, y el docente lo deja anunciado para la unidad de protocolos: un certificado es lo que garantiza que el servidor con el que uno habla es el que dice ser, y su construcción usa funciones de hash (cues pt2 422-424). Una colisión de `SHA-1` explotable ahí no es una curiosidad de laboratorio: es un certificado falso que valida.

### Estado: quebrada

No lo dice la filmina, y **tampoco lo dice el docente** — al contrario: sostiene que `SHA-1` todavía sirve. Ese desacuerdo está tratado aparte, con las dos posiciones enfrentadas, en [[#SHA-1: dónde el vault no coincide con la cátedra|SHA-1: dónde el vault no coincide con la cátedra]].

La posición del vault: la primera colisión explícita es **SHAttered**, de Stevens, Bursztein, Karpman, Albertini y Markov, **febrero de 2017**: dos PDF distintos con el mismo digest `SHA-1`, a un costo de $\approx 2^{63}$ evaluaciones. Antes de eso NIST ya la había **deprecado para firma digital en 2011** y **prohibido en 2013**, por los ataques teóricos que venían bajando la cota desde 2005.

> **Todo el párrafo anterior es externo al vault.** Ni la filmina ni Katz & Lindell lo traen: el libro es de 2014 y dice explícitamente que al momento de escribir **todavía no se había hallado una colisión en `SHA-1`**. Es la razón por la que la lista del slide 35 no la marca. *(Fechas y autoría de SHAttered: conocimiento externo, no verificable contra el material de la cátedra.)*

## 2004: el año que rompió el área

Es la bisagra de toda esta nota y no tiene filmina propia: el docente la cuenta entre el slide 31 y el 32.

**Qué pasó.** Un grupo de criptógrafos y matemáticos chinos publica una **familia nueva de ataques**, y la novedad no es que rompan una función: es que son **de propósito general**, aplicables en principio a todas las que comparten el paradigma. Los aplican sobre `MD5`, que era la más desplegada, y la destrozan.

**Qué produjo.** El docente lo llama *"un cisma y una refundación"*: cuatro años —2004 a 2008— de papers rompiendo funciones de hash y después construyendo funciones nuevas que sobrevivieran a esos ataques. Salió de ahí con `MD5` muerta, `SHA-1` bajo sospecha seria, y los 160 bits —que hasta entonces parecían cómodos— empezando a sonar chicos por dos motivos a la vez: los ataques bajaban la complejidad *y* el poder de cómputo subía.

> [!quote]- De la transcripción — la familia de ataques y la refundación del área (cues pt2 425-432, 437-441)
> *"En 2004 hubo un avance muy importante. Un grupo de criptógrafos y matemáticos chinos encuentra una familia nueva de ataques: **ataques de propósito general, ataques que afectan no a una función específica sino potencialmente a todas**. Y los aplican sobre [MD5], que era la función más famosa del momento, y lo destrozan. Básicamente, hoy día [MD5] se considera **superquebrada**. (…) Ahí hubo como un **cisma y una refundación** de la parte de la criptografía en el ámbito de funciones de [hash]. Fueron años donde hubo muchos papers y muchos avances: **primero en romper funciones de hash y después en construir funciones nuevas que sobrevivan a eso**."*
>
> *"2004, y siguieron hasta el 2008, que se fueron sofisticando y mejorando los ataques. Básicamente [MD5] murió y [SHA-1] quedó con serias dudas en cuanto a funcionamiento. Y por otro lado, los 160 que parecían cómodos, con la explosión que hubo de poder de cómputo, empezaron a ponerse en duda: o sea, si había ataques que iban a bajar la complejidad de esto, y además el poder de cómputo se acercaba, **160 empezó a sonar incómodamente chico también**."*

> **Por qué es el hecho más importante de la nota** *(lectura nuestra).* Todo lo que viene después —`SHA-2` apurada, el concurso, el criterio de diversidad de diseño con el que se eligió Keccak— es **respuesta a este párrafo**. Y la lección transferible no es sobre hash: es que la concentración de todo un campo en un único paradigma de diseño es un riesgo sistémico, independientemente de lo bueno que sea el paradigma. La misma idea reaparece del lado del cifrado en [[eleccion-de-primitivas|Elección de primitivas]] y como criterio de diseño en [[agilidad-criptografica|Agilidad criptográfica]].

## SHA-2

**La filmina no le dedica slide propio.** Aparece una sola vez, en la lista de recomendadas del slide 35, como *"SHA-2 → 256/384/512 bits"*. **La [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] la omite por completo.** Lo que sigue es reconstrucción nuestra a partir de K&L §6.3.3 y de conocimiento estándar, más lo que el docente dice al pasar, y conviene saber que la clase no le dedicó desarrollo propio.

- **Salidas reales:** 224, 256, 384 y 512 bits, más las variantes truncadas 512/224 y 512/256. El slide 35 omite la de 224.
- **Misma construcción que `SHA-1`**: Davies-Meyer sobre un cifrado de bloque —aislado retroactivamente y bautizado **SHACAL-2**, bloques de 256 bits y claves de 512— más Merkle-Damgård.
- **Consecuencia directa de esa herencia:** `SHA-2` sufre **length extension** igual que `MD5` y `SHA-1`, porque el defecto es de Merkle-Damgård y no de la función de compresión. Es la razón por la que no se puede autenticar con $H(k \,\Vert\, m)$ ni siquiera usando `SHA-256` → [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] y [[hmac|HMAC]].
- **Estado: segura.** No hay ataque práctico contra ninguna variante.

### El 3DES de los hashes

Es la caracterización que da el docente, y explica de una la naturaleza de `SHA-2`: **no es un rediseño, es `SHA-1` robustecido y agrandado, a costa de ser bastante más pesado y lento.** Exactamente la misma jugada que 3-DES respecto de `DES` → [[des-y-3des#3-DES|DES y 3-DES]]: estirar una primitiva conocida en lugar de reemplazarla, para comprar tiempo.

Y esa lectura da además **el pliego del concurso de `SHA-3`**: lo que se pedía eran funciones con los tamaños de `SHA-2` y la velocidad de `SHA-1`.

> [!quote]- De la transcripción — SHA-2 como paliativo, y el pliego del concurso (cues pt2 442-447)
> *"Entonces se estandarizan y se construyen rápido una familia (…) que se llaman [SHA-2], como **punto de contención** para los más sensitivos respecto a seguridad. Y se organiza, parecido a lo que ocurre con [AES], un concurso abierto, llamando a toda la comunidad científica y académica del mundo a construir los sucesores. [SHA-2], si quieren, para hacer una analogía, **fue como triple [DES]**: fue tomar [SHA-1] y robustecerlo y agrandar el tamaño, a costa de hacerlo mucho más pesado y lento. Entonces, en los pliegos del concurso, lo que se pedían eran funciones criptográficas que cumplan con el **tamaño de conjuntos de [SHA-2]** y tengan la **velocidad de [SHA-1]**."*

> **Precisión nuestra sobre la cronología.** El relato ubica a `SHA-2` como **respuesta posterior** a los ataques de 2004 (*"entonces se estandarizan y se construyen rápido"*). No es así: `SHA-256/384/512` son de 2001 (borrador) y **FIPS 180-2 es de agosto de 2002**, o sea **anteriores** al ataque. Lo que 2004 produjo no fue `SHA-2` sino su **adopción apurada** —hasta entonces casi nadie migraba, porque `SHA-1` parecía sana— y el llamado al concurso de `SHA-3`, que sí es posterior (2007). La sustancia del argumento no se cae: `SHA-2` funcionó como punto de contención tras 2004 aunque ya existiera. Sólo se corre la fecha en la que fue diseñada.

> **Por qué NIST abrió el concurso de SHA-3 si `SHA-2` estaba sana.** *(Lectura nuestra sobre K&L §6.3.4, ahora respaldada por los cues pt2 461-464.)* Precisamente por lo del punto 1 del cuadro comparativo: en 2007, con `MD5` caída y `SHA-1` agrietada, **toda la criptografía de hash del mundo colgaba de un único paradigma de diseño**. `SHA-2` no estaba rota, pero era la última de la familia en pie. El concurso fue un seguro contra el escenario de que el paradigma cayera entero.

## SHA-3

De la filmina (slide 32):

- Entrada: hasta $2^{64}$ bits.
- **Salida:** 224, 256, 384 o 512 bits.
- **Estandarizada por NIST en 2013.**
- **Aplicación modelo esponja.**

> **Errata de la filmina (I):** *"entrada: secuencia de hasta $2^{64}$ bits"* es **falso para `SHA-3`**. Ese límite viene del campo de longitud del padding de Merkle-Damgård, y `SHA-3` **no usa Merkle-Damgård**: usa la **construcción esponja**, que la propia filmina menciona dos líneas más abajo. La línea se copió de los slides de `MD5` y `SHA-1` sin adaptarla. La esponja absorbe bloques indefinidamente y **no tiene límite práctico de longitud de entrada**.

> **Errata de la filmina (II):** *"Estandarizado por NIST en 2013"*. Ninguna de las dos fechas relevantes es 2013: NIST **anunció a Keccak como ganador en octubre de 2012** (K&L §6.3.4), y el estándar **FIPS 202 se publicó en agosto de 2015** *(esta segunda fecha es externa al vault: K&L es de 2014 y dice que la función todavía estaba en proceso de estandarización)*.

> **Errata de la filmina (III), slide 35:** *"Antes conocida como Kekkak"*. El nombre es **Keccak** — dos `c` en el medio, una sola `k` al final. K&L titula la sección *SHA-3 (Keccak)*. La [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] lo escribe **bien** en su filmina 10: la errata es de un solo deck.

**Las cuatro salidas quedan confirmadas por dos fuentes nuevas.** El docente dice en voz que es *"una familia de 4 funciones (…) que nos permite salidas de 224, [256], 384 o 512 bits"* (cue pt2 458), y la filmina 10 de la Práctica 04 tabula `Sha3 (Estándar actual) → 224/256/384/512`. O sea que la lista corta del slide 35 (*"256/384/512"*) es la que está incompleta, no la del 32.

### El concurso, y por qué gana Keccak

**El criterio decisivo no fue el rendimiento ni la cantidad de análisis acumulado: fue la diversidad de diseño.** K&L lo dice —se eligió Keccak *"because its structure is very different from that of SHA-1 and SHA-2"*— y ahora **el docente lo desarrolla con el argumento completo**, que es más fuerte que la frase del libro: alrededor del 90 % de los candidatos eran variantes de Merkle-Damgård, y después de 2004 nadie quería que un único ataque general pudiera llevarse puesto el estándar nuevo *y* todo el campo a la vez. La esponja —inventada para el concurso— era el único finalista que no compartía el destino de los demás.

> [!quote]- De la transcripción — por qué gana un modelo distinto y no el mejor (cues pt2 460-467)
> *"Y en particular termina ganando porque en ese concurso hubo [64] participantes —y no me acuerdo el número exacto, pero no les exagero que— **el 90 por ciento de los participantes eran variantes del modelo [Merkle-Damgård]**. Y parte de lo que había quedado muy sensible con el ataque de 2004 es: **¿qué pasa si aparece otro ataque general? No podemos darnos el lujo de que nos rompa al estándar nuevo.** Entonces hubo [cinco] finalistas, y la balanza se inclinó sobre éste porque **es un modelo distinto, que se llama esponja**, que lo inventaron para el concurso. Hoy hay otras funciones de hash menos conocidas o más experimentales que usan este modelo de esponja también: el modelo demostró ser bastante robusto."*

> **Es exactamente el procedimiento de [[aes|AES]], diez años después.** *(Lectura nuestra; K&L hace el paralelo, la filmina no, y el docente lo hace explícito en el cue pt2 445.)* Convocatoria pública, candidatos publicados, criptoanálisis abierto durante cinco años, decisión argumentada. Y la lección de fondo es la misma que ya está en [[eleccion-de-primitivas|Elección de primitivas]]: **la confianza en una primitiva es un producto del escrutinio público y del tiempo**, no del ingenio de quien la escribió. La novedad de `SHA-3` frente a `AES` es que acá el concurso premió además el **no parecerse** a lo que ya había — un criterio de cartera, no de calidad individual.

### Tres precisiones sobre lo que se dijo de Keccak

> **Precisión nuestra (1): la autoría.** El docente atribuye Keccak a **Vincent Rijmen**, coautor de `AES`, y remata que *"le debemos a [Rijmen] las dos funciones más importantes de la criptografía moderna"* (cues pt2 451-453). **La sustancia es correcta y el nombre no.** Keccak es de **Guido Bertoni, Joan Daemen, Michaël Peeters y Gilles Van Assche**; el coautor de `AES` que efectivamente está detrás de `SHA-3` es **Joan Daemen** —la otra mitad de Rijndael—, no Rijmen. O sea que sí es cierto que un coautor de `AES` firma también el estándar de hash: es Daemen. *(Conocimiento externo al vault.)*

> **Precisión nuestra (2): los números del concurso.** El docente da *"63 participantes"* y *"3 finalistas"*, aclarando él mismo que no recuerda la cifra exacta. Las cifras publicadas por NIST: **64 propuestas presentadas**, de las cuales **51 fueron aceptadas a la primera ronda** (2008); **14 semifinalistas** en diciembre de 2008; y **cinco finalistas** en diciembre de 2010 — **BLAKE, Grøstl, JH, Keccak y Skein**—, con el anuncio del ganador en octubre de 2012. El *"63"* está muy cerca del total de propuestas; el *"3"* no coincide con ninguna etapa. *(Conocimiento externo al vault.)*

> **Precisión nuestra (3): "en reemplazo de SHA-2".** El docente dice que *"se estandariza [SHA-3] en reemplazo de [SHA-2] y todas las versiones anteriores"* (cue pt2 455). Es impreciso en un punto que importa operativamente: **NIST nunca deprecó `SHA-2`**. `SHA-3` es una **alternativa de diseño distinto**, no una sucesora que obsolete a la anterior — de hecho las dos conviven como estándares vigentes, y `SHA-2` sigue siendo lo más desplegado por lejos. Confundir esto lleva a la conclusión equivocada de que un sistema con `SHA-256` está desactualizado, y no lo está.

### Estado: seguro, y recomendado

Es la única a la que la filmina le pone la etiqueta *"estándar recomendado para nuevos proyectos"*, y el docente la refrenda sin reservas: *"[SHA-3] es un claro ganador (…) a nivel estandarizado, **libre de patentes**, para usar gratis y metido en todas las librerías"* (cues pt2 580-582). El dato de las patentes no es decorativo: es lo que separa a un estándar que se adopta de uno que se ignora → la anécdota comparable, del lado de los modos autenticados, está en [[ccm-y-gcm|CCM y GCM]].

> **Precisión sobre las longitudes:** el slide 32 lista `224, 256, 384 o 512` y el slide 35 lista `256/384/512`. Es una inconsistencia interna de las filminas; la lista correcta es la del slide 32, confirmada por el cue pt2 458 y por la filmina 10 de la Práctica 04. *(Precisión nuestra.)*

## Los digests de ejemplo, verificados

Los tres slides dan el hash de `""` (cadena vacía), `"a"` y `"abc"`. **Los verifiqué uno por uno contra `md5`, `shasum -a 1` y `openssl dgst -sha3-256`; los nueve coinciden con la filmina carácter por carácter.** No hay ninguna errata en esta parte.

| Primitiva | Entrada | Digest |
|---|---|---|
| `MD5` | `""` | `d41d8cd98f00b204e9800998ecf8427e` |
| `MD5` | `"a"` | `0cc175b9c0f1b6a831c399e269772661` |
| `MD5` | `"abc"` | `900150983cd24fb0d6963f7d28e17f72` |
| `SHA-1` | `""` | `da39a3ee5e6b4b0d3255bfef95601890afd80709` |
| `SHA-1` | `"a"` | `86f7e437faa5a7fce15d1ddcb9eaeaea377667b8` |
| `SHA-1` | `"abc"` | `a9993e364706816aba3e25717850c26c9cd0d89d` |
| `SHA-3` | `""` | `a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a` |
| `SHA-3` | `"a"` | `80084bf2fba02475726feb2cab2d8215eab14bc6bdd8bfb2c8151257032ecd8b` |
| `SHA-3` | `"abc"` | `3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532` |

**Los tres de `SHA-3` son SHA3-256**, no SHAKE ni el Keccak original con el padding pre-FIPS —que dan digests distintos para las mismas entradas—. La filmina no lo aclara y es una trampa clásica al reproducirlos: lo que coincide es `openssl dgst -sha3-256`. *(Verificación nuestra.)*

**Cómo reproducirlos:** `printf '%s' abc | md5`, `printf '%s' abc | shasum -a 1`, `printf '%s' abc | openssl dgst -sha3-256`. El `printf '%s'` en lugar de `echo` es esencial: `echo` agrega un `\n` y el digest cambia por completo — que es, de paso, la ilustración más barata del **efecto avalancha**.

**Y no es una molestia de tipeo: hay un ejercicio que se decide acá.** En el [[guia-03-resolucion#Ejercicio 6|Ej. 6 de la Guía 3]] las ocho preimágenes buscadas son las que produce `echo`, o sea que **el `\n` final es parte de lo que se hashea**: sin él no coincide ninguno de los ocho digests y el ejercicio parece irresoluble.

**Para qué están estos ejemplos en la filmina, dicho por el docente.** No son verificación: son la demostración visual del efecto avalancha, y detrás hay un criterio de diseño formal que la cátedra nombra y declara fuera del programa — el **criterio estricto de avalancha**, desarrollado en [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]].

> [!quote]- De la transcripción — el criterio estricto de avalancha (cues pt2 385-392)
> *"De hecho hay un criterio —no lo vamos a ver en la materia, pero hay criterios de diseño para evaluar las funciones de compresión— y hay un criterio que se llama **criterio estricto de avalancha**, que dice que ante el cambio de un bit cualquiera en la entrada tiene que haber **un sesgo despreciable alrededor del 50 por ciento de que cambie cada bit de la etiqueta**. O sea: no deberíamos poder entender que un bit de la entrada hace que cambien más ciertos bits de la etiqueta que otros. Pero bueno, la forma de ver eso es esto: que hago un cambio lo más chico posible y cambia todo."*

Los de `SHA-2` la filmina no los da. Agregados acá **por cuenta nuestra**, con `shasum -a 256`, para completar la familia:

| Primitiva | Entrada | Digest |
|---|---|---|
| `SHA-256` | `""` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `SHA-256` | `"a"` | `ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb` |
| `SHA-256` | `"abc"` | `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad` |

> **Qué hay que mirar en estas tablas, más allá de copiarlas.** *(Lectura nuestra.)* Que el hash de la **cadena vacía** existe y es un valor fijo: la función está definida para $\lvert m\rvert = 0$, porque el padding de Merkle-Damgård siempre agrega al menos el bloque de longitud. Y que `"a"` y `"abc"` —una entrada que es prefijo de la otra— dan digests **sin ningún parecido**: eso es lo que se pide de una función de hash y lo que hace inviable el criptoanálisis por parecido.

## La lista de recomendadas del slide 35

Tal como la escribe la filmina:

| Primitiva | Salida | Marca de la filmina |
|---|---|---|
| `MD5` | 128 bits | **Quebrada** |
| `SHA-1` | 160 bits | *(sin marca)* |
| `SHA-2` | 256/384/512 bits | *(sin marca)* |
| `SHA-3` | 256/384/512 bits | *"Antes conocida como Kekkak"* · **estándar recomendado para nuevos proyectos** |

Que `SHA-1` figure sin marca **no es un desliz de maquetación**: es la posición de la cátedra, sostenida en voz. Está tratada en la sección siguiente.

## SHA-1: dónde el vault no coincide con la cátedra

Hasta la sesión del 03/09 esta nota trataba la ausencia de marca sobre `SHA-1` en el slide 35 como una **errata**: una lámina desactualizada. **Con la transcripción, esa lectura ya no se sostiene.** El docente afirma explícitamente que `SHA-1` sigue siendo utilizable, y la única alerta que da en todo el bloque de recomendaciones es sobre `MD5`. O sea que la lámina dice lo que la cátedra piensa.

Por eso la entrada cambia de estatus: **deja de ser errata y pasa a ser un desacuerdo argumentado, con las dos posiciones a la vista.** El lector decide; el vault deja constancia de cuál es cuál.

> [!quote]- De la transcripción — la posición de la cátedra sobre SHA-1 (cues pt2 567-571)
> *"En general, las versiones más chicas son ultra seguras. **[SHA-1] incluso es seguro para un sistema normal. [SHA-1] está como en un horizonte, digamos, en el borde.** Y la única consideración es: si se encuentran con un criptosistema que está usando [MD5], o alguna función que no sea de éstas, **averigüen el estado**, porque es probable que ahí sí haya un problema latente de seguridad."*
>
> En la misma línea, antes: *"160 ya se escapa"* del poder de cómputo disponible (cue pt2 418).

**La posición del vault**, con lo que la sostiene:

1. **Hay una colisión explícita y pública.** SHAttered, febrero de 2017: dos PDF con contenido visualmente distinto y el mismo digest. No es una cota teórica, es un par de archivos descargables.
2. **El costo pagado fue $\approx 2^{63}$**, no $2^{80}$. La cota genérica del cumpleaños ya no es la que rige: los ataques la bajaron, exactamente como el docente anticipa que puede pasar (cues pt2 438-441).
3. **Los organismos ya se movieron, y hace más de una década.** NIST deprecó `SHA-1` para firma digital en **2011** y la prohibió en **2013**; los navegadores dejaron de aceptar certificados `SHA-1` entre 2016 y 2017; las CA públicas dejaron de emitirlos. Eso es anterior incluso a SHAttered.
4. **El escenario que importa no es "un sistema normal", es el adversarial.** Contra un adversario sin recursos, `SHA-1` alcanza; el problema es que la propiedad que ofrece —resistencia a colisiones— es exactamente la que se necesita cuando *hay* un adversario, y es la que cayó.

**Dónde las dos posiciones sí coinciden**, que es más de lo que parece: en que la respuesta correcta a *"¿es seguro?"* depende del escenario y no de la primitiva → [[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]]. El docente lo dice con todas las letras para `MD5` (*"la seguridad siempre es relativa"*, cue pt2 526) y lo aplica a `SHA-1`. **La diferencia es dónde se pone el umbral, no el criterio.** Con el vocabulario de [[estado-de-un-criptosistema#Los tres estados|Estado de un criptosistema]]: la cátedra la ubica en *debilitada*, esta nota en *quebrada*.

> **La recomendación práctica, que no depende de resolver el desacuerdo** *(síntesis nuestra).* Para **elegir** una primitiva en un proyecto nuevo, las dos posiciones dan lo mismo: `SHA-3` o `SHA-2`, nunca `SHA-1`. La discrepancia sólo muerde al **evaluar un sistema existente** que ya usa `SHA-1`: la cátedra diría *"está en el borde, mirálo"*, esta nota diría *"planificá la migración"*. Y ahí gana el criterio de [[agilidad-criptografica|Agilidad criptográfica]], que es del propio docente: lo que hay que tener resuelto no es si aguanta, es **por dónde se cambia cuando deje de aguantar**.

## Qué usar, en la práctica

Ésta es la sección que más cambió con la transcripción: lo que antes era síntesis nuestra ahora es, casi entero, **recomendación dicha en clase**.

**Lo que dice la cátedra, ordenado:**

1. **Para un proyecto nuevo, `SHA-3`.** Y dentro de la familia: **la variante de 256 bits para todo**, reservando la de 512 para almacenamiento con horizonte de décadas — el caso de la información que hay que conservar veinte o treinta años.
2. **El panorama es más simple que el del cifrado.** A diferencia de los criptosistemas, acá *"sería raro que se encuentren con una muy distinta de alguna de las generaciones de la familia SHA"*. La excepción son **tres jurisdicciones con estándares propios** —Europa, Japón y China—: si el sistema tiene origen o destino ahí, puede aparecer otra función.
3. **Si aparece `MD5`, o algo que no sea de esta familia: averiguar el estado.** Es la única alerta explícita del bloque.
4. **A décadas no se puede asegurar nada.** El docente lo dice de frente, y nombra dos vías: que aparezca un ataque contra `SHA-3`, o que las computadoras cuánticas —que hoy no tienen ningún ataque material contra hash— habiliten estudios que hoy no se pueden hacer.

> [!quote]- De la transcripción — la recomendación completa (cues pt2 552-566)
> *"A diferencia de los criptosistemas, acá la realidad es que hay muchas funciones de hash dando vueltas, pero hoy día sería raro que se encuentren con una muy distinta de alguna de las generaciones de la familia [SHA]. Si están trabajando con algún sistema de origen y destino europeo, o de origen y destino japonés o chino —**que son 3 jurisdicciones que tienen estándares propios**—, podría aparecer alguna otra; pero en general, y especialmente para todo lo que sea local o americano, sería raro que se encuentren con alguna muy distinta de éstas."*
>
> *"Entonces las recomendaciones hoy día para un proyecto nuevo son usar el último estándar, [SHA-3]. (…) El tamaño más chico es seguro; el tamaño más grande se reserva (…) [para] información que se quiere retener por 20, 30 años. **El consejo práctico es: usá la variante más chica, la de 256 bits, para todo; se recomienda la de 512 para sistemas de almacenamiento pensando en horizontes de décadas.**"*
>
> *"La gran realidad es que **en un horizonte de décadas no se puede asegurar nada**. O sea, puede aparecer un ataque que rompa [SHA-3] y que a esa altura ya tengamos [SHA-8]. Ahí están las computadoras cuánticas, que si bien hoy día no tienen ningún ataque material a esto, no quiere decir que cuando se vuelvan más masivas no generen estudios nuevos que hoy no se pueden hacer y lleguen a algo."*

### El mínimo común denominador

El docente cierra el bloque con una regla que excede a las funciones de hash y que se adelanta a la unidad de seguridad de sistemas: **la seguridad de un sistema es el mínimo común denominador de la seguridad de sus componentes.** Y la lectura que saca de ahí es incómoda a propósito: hoy la capa criptográfica está tan por encima del resto de las capas de un sistema que **caer por mal uso de criptografía bordea la negligencia**.

> [!quote]- De la transcripción — el mínimo común denominador y la negligencia (cues pt2 573-578)
> *"Me estoy adelantando al resto de la materia, pero básicamente **la seguridad de un sistema es el mínimo común denominador de la seguridad de todos los componentes**. Y hoy día toda la parte criptográfica de un sistema está como en la estratosfera versus el resto de otros patrones y de otras interacciones que hay en los sistemas. Entonces, teniendo resuelto técnicamente que la seguridad por el lado de criptografía esté a niveles buenos, **el que un sistema caiga por mal uso de criptografía bordea la negligencia hoy día**."*

> **Cómo se lee eso desde acá** *(lectura nuestra).* No es una arenga: es un criterio de asignación de esfuerzo. Si la primitiva es el eslabón más fuerte por varios órdenes de magnitud, discutir 160 contra 256 bits rinde muchísimo menos que revisar cómo se guardan las claves, cómo se compara la etiqueta o si el protocolo tiene [[ataques-de-repeticion-y-frescura|frescura]]. Y da la vuelta al desacuerdo sobre `SHA-1` de arriba: casi nunca es la variable que decide.

### La síntesis operativa

*(Nuestra, cruzando la filmina, K&L y lo dicho en clase.)*

1. **Proyecto nuevo → `SHA3-256`.** Coincide la filmina, coincide el docente, coincide K&L.
2. **`SHA-2` sigue siendo aceptable** y es lo que más se encuentra desplegado — y `SHA-3` **no** lo deprecó, contra lo que sugiere el cue pt2 455. Con una salvedad: si el uso es autenticación, **nunca $H(k \,\Vert\, m)$**, siempre [[hmac|HMAC]], por el length extension que `SHA-2` hereda de Merkle-Damgård.
3. **`MD5` no**, en ningún caso; **`SHA-1` tampoco para algo nuevo**, con la discrepancia registrada arriba. Ni siquiera "para un checksum": el día que ese checksum pase a decidir algo, el atacante ya tenía las colisiones.
4. **Mínimo de salida: 256 bits, no 160.** El *"mínimo 160"* del slide 35 da $2^{80}$ contra colisiones y eso ya no alcanza → [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]]. La Práctica 04 es más estricta que la teoría y escribe *"mayor de 160 bits"*.
5. **Revisar la elección con el tiempo.** Es la misma regla 5 de [[eleccion-de-primitivas|Elección de primitivas]] y es el concepto que el docente introduce en esta misma clase: [[agilidad-criptografica|agilidad criptográfica]]. Hoy recomendado no es para siempre — `MD5` estuvo trece años en esta misma posición.

## Lo que agrega y lo que omite la Práctica 04

La filmina 10 de la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] es la única lámina de todo el curso que pone las primitivas de hash en una sola tabla. Tres cosas para registrar.

**(a) Omite `SHA-2` por completo, y no marca `MD5` como quebrada.** Su tabla es `MD5` 128 bits · `Sha1` 160 bits · `Sha3 (Estándar actual)` 224/256/384/512 — sin `SHA-2`, y sin ninguna de las marcas de estado que la teoría sí pone en el slide 35. Es **omisión, no dato falso**, pero refuerza dos cosas: que el vault está reconstruyendo `SHA-2` casi entero por su cuenta, y que la posición de la cátedra sobre el estado de las primitivas es sistemáticamente más suave que la de esta nota.

**(b) Aporta una taxonomía que la teoría no hace.** Bajo el rótulo *"Modelos de Aplicación (Construcciones)"*, una flecha bifurcada separa dos ramas: **Iterativo → CBC-MAC/Merkle** y **Esponja → Keccak (Sha3)**. La teoría menciona *"aplicación iterativa"* y *"aplicación modelo esponja"* como atributos sueltos de cada primitiva (slides 30, 31, 32) pero **nunca como una clasificación de dos ramas**. Como eje organizador es bueno, y es el que estructura esta nota.

> **Imprecisión, no errata:** poner **`CBC-MAC` en una tabla de primitivas de hash** no corresponde — `CBC-MAC` es un [[cbc-mac|MAC]], no una función de hash, y la construcción iterativa de hash es [[construccion-de-merkle-damgard|Merkle-Damgård]]. La filmina escribe *"CBC-MAC/Merkle"* **con barra**, lo que admite leerlo como enumeración de dos construcciones encadenadas —las dos lo son— y no como el nombre de una sola. Por eso queda como imprecisión y no como errata. *(Precisión nuestra.)*

**(c) Escribe "Keccak" bien.** La errata *"Kekkak"* es exclusiva del slide 35 de teoría.

## Afirmaciones de la clase registradas con reserva

Ninguna de éstas se puede resolver contra el material de la cátedra: son datos externos. Van acá juntas para que se puedan citar sin arrastrar el error, y **sin descalificar el argumento en el que aparecen** — en los cuatro casos la afirmación de fondo se sostiene y lo que falla es un dato accesorio.

| Dice la clase | Cue | Corrección *(nuestra)* | Qué sigue en pie |
|---|---|---|---|
| Keccak fue coautoreada por **Vincent Rijmen** | 03/09 451-453 | El equipo es Bertoni, **Joan Daemen**, Peeters y Van Assche | Que un coautor de `AES` está detrás de `SHA-3`: es **Daemen** |
| El concurso tuvo **63 participantes** y **3 finalistas** | 03/09 460-464 | 64 propuestas, 51 en primera ronda, 14 semifinalistas, **5 finalistas** | Que la enorme mayoría eran Merkle-Damgård, que es el argumento real |
| `SHA-0` fue **comisionada a IBM** y modificada por la NSA | 03/09 405-412 | Diseñadas por la **NSA**, publicadas por NIST (FIPS 180 y 180-1). El episodio IBM+NSA es el de `DES` | Que no hubo concurso, que `SHA-0` se retiró, y que los cambios nunca se explicaron |
| `SHA-2` se estandariza **después** de 2004, como respuesta | 03/09 442-444 | 2001 borrador, **2002 FIPS 180-2**: es anterior al ataque | Que funcionó como punto de contención tras 2004, y el pliego del concurso |
| `SHA-3` se estandariza **en reemplazo de** `SHA-2` | 03/09 455 | NIST **no deprecó** `SHA-2`; `SHA-3` es alternativa de diseño distinto, no sucesora | Que `SHA-3` es el estándar recomendado para lo nuevo |

## Ver también

- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] — qué es lo que estas cuatro primitivas implementan, y el criterio estricto de avalancha completo
- [[resistencias-de-una-funcion-de-hash|Resistencias de una función de hash]] — contra qué propiedad está rota cada una
- [[construccion-de-merkle-damgard|Construcción de Merkle-Damgård]] — el molde que comparten `MD5`, `SHA-1` y `SHA-2`, y del que `SHA-3` se escapa
- [[hmac|HMAC]] — cómo se convierte cualquiera de estas en un MAC, y por qué no alcanza con concatenar la clave
- [[seguridad-de-las-funciones-de-hash|Seguridad de las funciones de hash]] — de dónde salen los $2^{80}$ y por qué las salidas subieron de 128 a 256 bits
- [[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]] — el criterio con el que se decide si un exponente alcanza, y por qué *"¿`MD5` es inseguro?"* no tiene respuesta sin escenario
- [[agilidad-criptografica|Agilidad criptográfica]] — por qué toda primitiva de esta tabla tiene fecha de vencimiento y qué hay que dejar previsto
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — el vocabulario seguro / debilitado / quebrado que usa la tabla
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] — la misma decisión del lado del cifrado
- [[des-y-3des|DES y 3-DES]] — las cajas $S$ secretas, que son el mismo episodio que los cambios sin explicar de `SHA-1`; y el 3-DES del que `SHA-2` es el análogo
- [[aes|AES]] — el concurso abierto que `SHA-3` repite diez años después
- [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04 — MACs, hash y cifrado autenticado]] — la filmina 10, con la taxonomía iterativo / esponja
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]]
- Katz & Lindell cap. 5 *Hash Functions and Applications* y §6.3 *Hash Functions in Practice* ([[bibliografia|bibliografía]])
