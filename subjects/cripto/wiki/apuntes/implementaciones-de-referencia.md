---
title: Implementaciones de referencia en Java (DES y AES)
resumen: 'Encuadre de los dos repositorios en Java de DES y AES que reparte la cátedra: qué es cada uno, contra qué notas leerlos y por qué leer una implementación no contradice la regla de no inventar criptografía.'
fuentes: ["[[clase-02-cifrado]]", "[[des-descripcion-del-algoritmo]]", "[[eleccion-de-primitivas]]", "[[tp-implementacion]]"]
aliases: [Implementaciones de referencia, AES en Java, DES en Java, Código de referencia, faturita]
type: apunte
clase: 2
orden: 32
created: 2026-08-24
updated: 2026-09-04
tags: [apunte, implementacion, java, aes, des, tp, pendiente, recurso-externo, transcripcion]
sources: ["Implementación AES en JAVA.txt", "Implementación DES en JAVA.txt", "raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# Implementaciones de referencia en Java (DES y AES)

> **Fuentes:** [`raw/apuntes/Implementación AES en JAVA.txt`](../../raw/apuntes/Implementaci%C3%B3n%20AES%20en%20JAVA.txt) y [`raw/apuntes/Implementación DES en JAVA.txt`](../../raw/apuntes/Implementaci%C3%B3n%20DES%20en%20JAVA.txt), más la [transcripción del 20/08](../../raw/clases/Clase%2002pt2-Transcripcion.VTT).
> Cada archivo tiene **una sola línea**: una URL de GitHub. Nada más.
> **El código está sin mirar.** Lo que sigue es el **encuadre** del recurso — **no** es una descripción de lo que hacen los repos.
> Lo que sí cambió con la transcripción del 20/08: **la autoría dejó de ser inferencia** (sección 2), y el repo de DES resultó ser el material sobre el que se dictó media clase.

Esta nota trae **dónde ver DES y AES como código y no como filminas**. La Clase 02 describe las dos primitivas a nivel de diagrama (rondas, red de Feistel, `Byte Sub`), y el [[des-descripcion-del-algoritmo|apunte des.pdf]] baja a nivel de bits; estos dos links son el tercer escalón: **algo que compila y corre**. Esta nota registra qué son, con qué notas de la wiki se leen en paralelo, y —lo más importante para el parcial y para el [[tp-implementacion|TP]]— **por qué leer una implementación no contradice la regla de "no inventes criptografía"**.

---

## 1. Qué dicen las fuentes, literal

| Archivo | Contenido completo |
|---|---|
| `Implementación AES en JAVA.txt` | `https://github.com/faturita/Advanced-Encryption-Standard-Algorithm` |
| `Implementación DES en JAVA.txt` | `https://github.com/faturita/JavaToolBox/blob/master/src/org/security/README.md` |

Leyendo **las URLs** —que es lo único que hay— salen dos observaciones *(lectura nuestra del URL)*:

**Los dos links no apuntan a la misma clase de cosa.** El de AES apunta a un **repositorio entero**, dedicado a ese algoritmo y nada más: `Advanced-Encryption-Standard-Algorithm`. El de DES apunta a un **README dentro de un subdirectorio** (`src/org/security/`) de un repo mucho más general llamado `JavaToolBox` — o sea, DES es un componente de una caja de herramientas, no un proyecto propio.

Consecuencia práctica: al abrir el link de DES **no vas a caer en el código sino en un README**, y hay que navegar hacia arriba (o hacia los `.java` hermanos) para encontrar la implementación. Conviene saberlo antes de abrirlo y concluir que "no está el código".

### Lo que las fuentes NO dicen

- **No declaran autor** ni vínculo con la cátedra. Los dos `.txt` no lo dicen; **la voz del docente sí** — ver la sección 2.
- **No dicen qué aporta cada repo**: ni qué modos implementa, ni si está completo, ni si compila, ni con qué licencia.
- **No dicen a qué clase pertenecen.** Están en `raw/apuntes/`, la carpeta de lo que no cuelga de ninguna fecha del [[cronograma]]. El único *timestamp* es el del filesystem (24/08/2026), que es **cuándo se ingirieron a `raw/`**, no cuándo se recomendaron. *(Los archivos no lo dicen; la transcripción sí: los dos se reparten en la clase del **20/08** — sección 2.)*
- **No dicen si son lectura obligatoria, sugerida o al pasar.**

---

## 2. Los dos son de la misma cuenta (inferencia nuestra)

> **El paréntesis del título quedó viejo** y se conserva sólo porque hay notas que enlazan a esta sección por su nombre. Lo que sigue **ya no es inferencia**: el docente declara en voz que las dos implementaciones son suyas.

Lo verificable a simple vista, y lo que originó esta sección: **las dos URLs empiezan con `github.com/faturita/`**. Es la misma cuenta de GitHub en los dos casos.

**La transcripción del 20/08 cierra la pregunta.** Al llegar a DES, el docente anuncia que va a explicarlo *"con una implementación mía de hace muchos años en Java"* (cue pt2 124) y, más tarde, que *"AES tiene una implementación en Java que yo les estoy subiendo"* (cue pt2 425). O sea: **los dos repos son del docente de la Clase 02, Rodrigo Ramele**, y son exactamente el material que llegó a `raw/apuntes/` — el archivo del AES es lo que él dice estar subiendo mientras recorre esa filmina. Lo único que la fuente sigue sin decir con todas las letras es que la cuenta `faturita` sea la suya; es el último eslabón, y no hay otro candidato *(lectura nuestra)*.

**El repo de DES no es un link: es la fuente de media clase.** Entre los cues pt2 167 y 317 el docente deja las filminas, comparte el proyecto en pantalla —*"esto está implementado en Java, así que si después quieren pueden toquetear el código; describe exactamente esto. Esto es como si fuese la ficha de lo que está haciendo DES"* (cue pt2 170)— y dicta sobre él todo el detalle del algoritmo. De ahí salen tres cosas que **ninguna filmina de la cátedra trae**: cómo se lee una matriz de permutación, cómo la expansión $E$ pasa de 32 a 48 bits repitiendo índices, y la aritmética de fila y columna de las cajas $S$. Están volcadas en la [[clase-02-cifrado#11. DES y 3-DES|§11 de la Clase 02]] y en [[des-descripcion-del-algoritmo|Descripción del algoritmo DES]].

**La advertencia de performance es del autor, no nuestra.** Sobre su propia implementación: *"es hiper mal performante, pero hace lo que hace el algoritmo"* (cue pt2 124). Es la caracterización exacta del recurso — **sirve para entender el algoritmo, no para usarlo**, que es justamente la línea de la sección 4. Y da la escala del esfuerzo: *"a mí me llevó, hace 20 años, una o dos semanas hacer esa implementación"* (cues pt2 469-471), dicho como argumento de por qué escribir criptografía a mano era caro y por qué que hoy sea barato **empeora** el riesgo.

**Por qué la autoría cambia cómo se lee el código.** Confirmada, valen las tres consecuencias:

- Las decisiones de diseño que aparezcan ahí —cómo se representa el bloque, qué [[primitiva-de-cifrado-en-bloque|padding]] usa, si expone un [[modos-de-encadenamiento|modo]] o sólo la primitiva— son las que se van a **dar por sentadas** en clase y en la corrección. Para DES, además, ya se dieron por sentadas: la clase se dictó encima.
- El código está elegido por **legible**, no por rápido ni por seguro en producción — y en este caso lo dice el propio autor.
- Es el punto de comparación natural para el estilo que se espera en el [[tp-implementacion|TP]].

La [[practica-03-seudoaleatoriedad-y-modos|filmina de la Práctica 03]] lo confirma por el otro lado: lista las dos implementaciones como material del curso.

---

## 3. Contra qué leerlos: los tres niveles del mismo algoritmo

El valor de estos links no está en el código aislado sino en **triangular** con lo que ya hay en la wiki. El mismo algoritmo aparece descripto en tres granularidades distintas, y cada una contesta preguntas que las otras dos no:

| Nivel | Fuente | Qué contesta | Qué deja afuera |
|---|---|---|---|
| **Qué hace** | filminas Clase 02 → [[des-y-3des\|DES y 3-DES]], [[aes\|AES]] | estructura, cantidad de rondas, por qué se diseñó así, cómo se erosionó | todo lo que sea un número concreto |
| **Con qué bits** | [[des-descripcion-del-algoritmo\|des.pdf]] | las tablas, las permutaciones, la especificación exacta | cómo se organiza eso en un programa |
| **Ejecutable** | los dos repos de esta nota | representación de datos, orden de las operaciones, qué es tabla y qué es cálculo | el porqué de cada decisión |

> **La forma de estudiarlo.** El nivel 1 te dice *por qué* AES tiene cuatro etapas por ronda; el nivel 2 te da la caja $S$ entera; el nivel 3 te muestra que esa caja $S$ es un array de $256$ bytes precomputado y no una inversión en $\mathrm{GF}(2^{8})$ calculada al vuelo. Los tres juntos son el algoritmo; ninguno solo lo es.

### Checklist de qué preguntarle al código

Cuando se abran los repos, estas son las preguntas que la Clase 02 deja planteadas y que sólo el código puede contestar. **Ninguna está contestada acá todavía** — es la lista de trabajo, no un resumen:

| Pregunta | Contra qué nota se contrasta |
|---|---|
| ¿Implementa un **criptosistema** o sólo la **primitiva**? Si cifra exactamente un bloque y nada más, no es un criptosistema | [[primitiva-de-cifrado-en-bloque\|Primitiva de cifrado en bloque]] |
| ¿Qué **modo** expone, si alguno? ¿Aparece `ECB` por defecto? | [[modos-de-encadenamiento\|Modos de encadenamiento]] |
| ¿Qué hace con el **padding**: Simple Pad, Des Pad, ninguno? | [[primitiva-de-cifrado-en-bloque\|Primitiva de cifrado en bloque]] |
| ¿De dónde saca la **clave** y el **IV**? ¿Los sortea, los pide, los hardcodea? | [[cifrado-probabilistico-nonce-e-iv\|nonce e IV]] · [[numeros-aleatorios-y-randomness\|Sobre números aleatorios]] |
| **DES:** ¿cifrar y descifrar comparten el mismo circuito, con las subclaves al revés? | [[des-y-3des#Estructura: red de Feistel\|red de Feistel]] |
| **DES:** ¿las cajas $S$ y las permutaciones están como tablas literales? | [[des-descripcion-del-algoritmo\|des.pdf]] |
| **AES:** ¿la primera ronda tiene sólo `Add Round Key` y la última saltea `Mix Column`? | [[aes#Variaciones para generar asimetrías\|asimetrías de AES]] |
| **AES:** ¿soporta las tres longitudes de clave ($128$, $192$, $256$) o sólo una? | [[aes\|AES]] |

La pregunta del IV es la más jugosa de todas, porque es donde se cruzan las dos notas de apuntes que son sólo links: **un `AES-CBC` impecable con un IV fijo deja de ser CPA-Secure**. Ver [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]].

---

## 4. La tensión con "no inventes criptografía"

Acá está el punto que conviene tener resuelto antes del parcial, porque a primera vista hay una contradicción. La filmina de [[eleccion-de-primitivas|elección de primitivas]] dice:

> Se considera **mala práctica** desarrollar un criptosistema nuevo para un proyecto.
> Existen funciones que han sido **estudiadas por años** para llegar a un nivel de confianza adecuado.

Y sin embargo la cátedra reparte código de AES y DES para leer, y el [[tp-implementacion|TP]] pide **implementar** una función de seguridad. ¿En qué quedamos?

**No hay contradicción: la regla habla de *qué se pone en producción*, no de *qué se escribe para aprender*.** El argumento de la filmina es que la confianza en una primitiva es un producto del **tiempo y del escrutinio público**, no del ingenio de quien la escribió. Un algoritmo nuevo no es inseguro, es **desconocido** — y a los fines prácticos eso es peor. Ese argumento pega sobre el **despliegue**, no sobre el ejercicio.

*(Desarrollo nuestro, cruzando la filmina con el enunciado del TP.)*

**Y el argumento se cierra solo cuando se sabe quién escribió estos repos:** el mismo docente que enuncia la regla es el que reparte código propio de AES y DES para leer. No es una contradicción, es la línea trazada donde corresponde — él implementó DES *"para entender"*, y en la misma clase dice que para producción hay que ir a la biblioteca escrutada. Y la regla que dicta ese día ya viene actualizada: *"esto debería cambiarse a: se considera mala práctica desarrollar un criptosistema nuevo para un proyecto, **o usar uno que te dé un [modelo de lenguaje]**"* (cues pt2 469-473) — ver [[eleccion-de-primitivas|Elección de primitivas]].

| Actividad | ¿La regla la prohíbe? | Por qué |
|---|---|---|
| **Leer** una implementación de AES para entenderla | No | Es lo contrario de inventar: es estudiar lo ya escrutado |
| **Reimplementar** AES como ejercicio y comparar contra vectores de prueba conocidos | No | El resultado es *conocimiento*, no un sistema en producción. Y se cuenta con especificación pública contra la cual verificar |
| **Usar tu propia** implementación de AES en un sistema real | **Sí** | La primitiva estará bien, pero tu código no tiene años de escrutinio. Va `AES-CBC` de una biblioteca |
| **Inventar una primitiva nueva** para un proyecto | **Sí — es el caso central de la regla** | Ni el algoritmo ni el código fueron mirados por nadie |
| **Implementar del paper** una función de seguridad no vista, como TP | No: **es exactamente lo que la cátedra pide** | El objetivo declarado es *componer* primitivas aprendidas para construir algo nuevo y demostrar que se entendió |

> **La línea que separa las filas.** No es *"escribir criptografía sí o no"*, es **contra qué se valida el resultado**. Un ejercicio se valida contra la especificación y contra el aprendizaje; un sistema en producción se valida contra adversarios reales durante años, y para eso el único atajo honesto es usar lo que ya sobrevivió a esa validación.

### El escalón que la Clase 02 todavía no tocó

*(Lectura nuestra — la clase no lo menciona y por eso va separado.)* Hay una tercera cosa, distinta de "el algoritmo es seguro" y de "el código es correcto": **una implementación puede ser perfectamente correcta y aun así insegura**. Un AES que produce el criptograma exacto puede filtrar la clave por el tiempo que tarda, por el consumo, o por dejar material sensible dando vueltas en memoria. Nada de eso se ve comparando salidas contra vectores de prueba.

Esto **refuerza** la regla en lugar de contradecirla, y es probablemente la razón más fuerte que existe para no usar código propio en producción. Pero **la Clase 02 no habla de canales laterales**, así que acá queda anotado como lectura nuestra y pendiente de confirmar contra la bibliografía o contra el bloque de Seguridad.

---

## 5. Java, y por qué probablemente Java

Los dos repos son de Java, y eso no parece casual: el [[programa-y-objetivos#Herramientas que se usan|programa de la materia]] lista entre las herramientas la **JVM** y **JCE** (*Java Cryptography Extension*), que se usa en la **Guía 5** — la misma fecha (28/09) en la que se presenta el TP.

*(Lectura nuestra: la fuente no relaciona estos repos con JCE.)* Si la lectura es correcta, la pareja es didácticamente perfecta y es la regla de la sección 4 en miniatura:

| | Qué es | Para qué |
|---|---|---|
| Estos repos | AES y DES escritos **a mano**, paso por paso | **entender** cómo funciona la primitiva |
| **JCE** | la biblioteca **estándar** de la plataforma | **usar** criptografía en algo real |

O sea: el mismo lenguaje sirve para las dos mitades del argumento, y se puede ver el contraste sin cambiar de stack.

---

## 6. Qué NO se afirma en esta nota

- **No se miró el código.** No se afirma qué implementa cada repo, si compila, si está completo, ni con qué licencia se distribuye. Lo que el docente explicó en clase sobre DES está volcado en la [[clase-02-cifrado#11. DES y 3-DES|Clase 02]], pero eso salió de la voz, no de leer los archivos.
- **La autoría ya no es inferencia**, pero el eslabón que la ata a las URLs sí lo es: el docente dice que las dos implementaciones son suyas y que está subiendo la de AES (cues pt2 124, 425); que la cuenta `faturita` sea la suya no lo declara nadie (sección 2).
- **No se afirma que sean material obligatorio.** Sí son material del curso: aparecen en la filmina de la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]] y el de DES se usó en clase el 20/08.
- **No se afirma que se relacionen con JCE ni con la Guía 5** — la sección 5 va rotulada como lectura nuestra.

---

## 7. Pendientes

- [ ] **Abrir los dos repos** y volcar qué aporta cada uno: contestar la checklist de la sección 3, empezando por *primitiva sola o criptosistema completo*.
- [x] **Confirmar quién es el autor.** Resuelto por la transcripción del 20/08: los dos son del docente (cues pt2 124, 425). Queda el fleco de atar la cuenta `faturita` a su nombre, que ninguna fuente declara.
- [ ] **Cruzar el código de DES contra [[des-descripcion-del-algoritmo|des.pdf]]**: verificar que las tablas de permutación del repo coinciden con las del apunte. Es el mejor ejercicio de comprensión que dan estas dos fuentes juntas — y ahora tiene un tercer testigo, la explicación en voz de los cues pt2 167-317.
- [ ] **Decidir si sirven de base para el [[tp-implementacion|TP]]** — como referencia de estilo, no como código a copiar: el TP pide algo **no visto en el curso**.
- [x] **Confirmar si tienen clase asignada.** El de DES se usó en la clase del **20/08**; el de AES se anuncia esa misma jornada. La nota sigue en `apuntes/` porque los dos `.txt` de `raw/` no cuelgan de ninguna fecha, pero el contenido está atado a la [[clase-02-cifrado|Clase 02]].

## Ver también

- [[des-y-3des|DES y 3-DES]] — la red de Feistel, la función $F$ y la tabla de erosión
- [[aes|AES]] — las cuatro etapas por ronda y las asimetrías deliberadas
- [[des-descripcion-del-algoritmo|DES — descripción del algoritmo]] — la especificación a nivel de bits: el par teórico de estas implementaciones
- [[eleccion-de-primitivas|Elección de primitivas en un proyecto]] — *no inventes criptografía*, y la distinción entre implementar para aprender e implementar para producción
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] · [[modos-de-encadenamiento|Modos de encadenamiento]] — lo que hay que buscar en el código
- [[numeros-aleatorios-y-randomness|Sobre números aleatorios y randomness]] — el otro apunte que es sólo links, y de donde sale la pregunta por el IV y la clave
- [[tp-implementacion|TP de Implementación]] — el proyecto que estas lecturas preparan
- [[programa-y-objetivos#Herramientas que se usan|Programa y objetivos]] — JCE, la JVM y OpenSSL
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
