---
title: Intercambio de claves
resumen: 'Definición formal del protocolo con el que dos partes acuerdan una misma clave hablando por un canal público, y el experimento KE que exige que esa clave sea indistinguible de una aleatoria para un adversario pasivo — explicado en el aula dos veces por una pregunta de alumno.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[pruebas-de-indistinguibilidad]]", "[[diffie-hellman]]"]
aliases: [Intercambio de claves, Protocolo de intercambio de claves, Experimento KE, Key Exchange, Key-Exchange experiment]
type: concepto
unidad: 1
clase: 4
orden: 3
created: 2026-09-04
updated: 2026-09-14
tags: [criptografia, intercambio-de-claves, key-exchange, indistinguibilidad, adversario-pasivo, clase-04, transcripcion]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "raw/clases/Clase 04 - Transcripcion.VTT"]
---

# Intercambio de claves

**La definición formal de "dos partes se ponen de acuerdo en una clave hablando por un canal que un adversario escucha" y el experimento —`KE`— que mide si ese acuerdo es seguro.** Es la maquinaria que hace falta antes de poder juzgar si Diffie-Hellman, que viene en la sección siguiente, sirve para algo.

> **Fuentes de esta nota.** Filminas **16 y 17** de la Clase 04, dictada el **10/09** por Pablo Abad, con transcripción: [`Clase 04 - Transcripcion.VTT`](../../raw/clases/Clase%2004%20-%20Transcripcion.VTT), bloque de intercambio de claves en los cues **174-272**. La nota se escribió el 04/09 sólo contra el PDF y se revisó contra la voz el 14/09.

## Dónde queda esto dentro de la criptografía asimétrica

Antes de definir nada, el docente ubica el tema: el paper de Diffie y Hellman de 1976 propone la idea de un criptosistema con dos claves, pero **lo primero que se encuentra en ese camino no es un criptosistema sino un intercambio de claves** — el problema viejo revisitado con la perspectiva nueva. Recién después aparecen los criptosistemas que satisfacen la idea original, y el equivalente asimétrico de los MACs. Los tres forman el campo, y lo que lo vuelve interesante no es que sean construcciones distintas sino que **habilitan usos que con lo simétrico no se podían resolver**.

> [!quote]- De la transcripción — el intercambio de claves como subcampo, y la agenda en tres partes (cues 173-187)
> *"En el camino a eso, antes de llegar a los descubrimientos, se empieza a revisitar el problema de intercambio de claves sobre esta perspectiva parecida, y se encuentran mejoras. Entonces, dentro de lo que hoy se llama criptografía asimétrica hay un subcampo que no vimos hasta ahora, que es el de **intercambio de claves**, que es interesante porque permite resolver este tema de punto a punto: dos personas, cómo poder hacer que se pongan de acuerdo en una clave sin necesidad de que mágicamente esté en cada lado. Pero después se descubrieron implementaciones de criptosistemas que satisfacían las condiciones que plantearon en ese paper, y se encontró el equivalente a MACs para el lado de integridad, que también satisfacían esas condiciones de asimetría. Y estas 3 cosas forman parte de un campo dentro de la criptografía que llamamos criptografía asimétrica, que no es solamente una construcción distinta de lo que ya vimos: por esta naturaleza asimétrica, por esta división en claves, **habilita otros usos prácticos que no se pueden resolver con lo que vimos hasta ahora**."*

## Qué es, formalmente, un protocolo de intercambio de claves

Un protocolo de intercambio de claves es una función $\Pi(n)$ ejecutada por dos partes, sin más entrada que el parámetro de seguridad $n$:

$$\Pi:\ (n) \;\longrightarrow\; (\mathrm{Trans},\ k_a,\ k_b)$$

La salida tiene tres componentes:

- $\mathrm{Trans}$, la **transcripción**: el conjunto (ordenado) de todos los mensajes que las dos partes intercambiaron por el canal — esto es exactamente lo que un adversario que sólo escucha llega a ver.
- $k_a$, una clave que queda conocida **solo** por la primera parte.
- $k_b$, una clave que queda conocida **solo** por la segunda parte.

**Condición fundamental, sin la cual el protocolo no sirve para nada:**

$$k_a = k_b$$

Las dos partes tienen que terminar con **la misma** clave, a pesar de que cada una la calculó de forma local a partir de información que la otra nunca vio completa. Ese es el logro que un protocolo de intercambio de claves promete: convertir mensajes públicos en un secreto compartido.

**Dos precisiones de la voz sobre la definición.** Primero, que es un **protocolo de comunicación**: modela una serie de intercambios de mensajes entre dos entidades, y la función es *"como la receta"* de qué calcula cada lado, qué transmite y qué vuelve a calcular. Segundo, que **no tiene clave de entrada** —a diferencia de todo lo visto en las clases 2 y 3— y que el único parámetro formal es el nivel de complejidad, *"que si estamos trabajando con un algoritmo fijo, ni siquiera"* (cues 191-212).

> [!quote]- De la transcripción — un algoritmo que emite un transcript y dos claves (cues 195-212)
> *"Un protocolo de intercambio de claves tiene una función que genera 3 componentes. Esta función en realidad es un algoritmo, es como la receta de lo que tienen que hacer, pero genera 3 componentes: genera un **transcript**, que es un conjunto de información intercambiada por las 2 partes, y genera 2 claves, una clave A y una clave B. Por definición de protocolo, este en particular no tiene clave de entrada. (…) Se generan 2 claves porque una de las claves es sólo conocida por una de las partes; la otra clave es sólo conocida por la otra parte. La condición básica que necesitamos para que esto sea un intercambio de claves es, casualmente, que **esas 2 claves que se generan sean iguales**. (…) Ése es el criterio, la condición fundamental."*

## El experimento KE: seguridad frente a un adversario pasivo

La definición de arriba dice **qué hace** el protocolo, pero no dice si el resultado es útil como clave criptográfica: una clave $k_a = k_b$ que un espía puede adivinar mirando la transcripción no sirve para nada, aunque técnicamente cumpla la condición fundamental. Hace falta una prueba de **indistinguibilidad**, con la misma estructura que las pruebas `Eav`/`CPA` de la [[pruebas-de-indistinguibilidad|Clase 02]]: un bit oculto que el adversario tiene que adivinar.

**La versión informal, que el docente da antes que la formal**, es la que conviene tener en la cabeza: un atacante que ve **todos** los mensajes intercambiados no puede calcular la clave. Si eso se cumple, se tiene una receta para convertir un canal inseguro —donde se sabe que alguien intercepta todo— en un canal seguro: al final del intercambio las dos partes comparten una clave, y a partir de ahí aplican un criptosistema autenticado de la [[clase-03-macs-y-cifrado-autenticado|Clase 03]] (cues 213-224).

$$\begin{aligned}
\textbf{Experimento } \mathsf{KE}_{A,\Pi}:\\
&\text{1. Se ejecuta } \Pi,\ \text{sea } k = k_a = k_b\\
&\text{2. Se genera } b \leftarrow \{0,1\}\\
&\text{3. Si } b=0:\ k' \leftarrow \{0,1\}^{n} \qquad \text{Si } b=1:\ k' = k\\
&\text{4. } A \text{ obtiene } (\mathrm{Trans}, k') \text{ y emite } b' \in \{0,1\}\\
&\mathsf{KE}_{A,\Pi} = 1 \iff b = b'
\end{aligned}$$

$$\Pr[\mathsf{KE}_{A,\Pi}=1] < 0{,}5 + \varepsilon(n) \;\Longrightarrow\; \Pi \text{ es seguro}$$

### Cómo leer cada paso

**Paso 1** corre el protocolo entero y fija la clave real $k$ que resultó (la que en la práctica usarían $A$ y $B$). **Paso 2-3** son el corazón de la prueba: se sortea una moneda, y **según cómo caiga**, al adversario se le entrega o bien la clave real $k$, o bien una clave $k'$ **completamente aleatoria** del mismo tamaño. **Paso 4** le da al adversario todo lo que un espía pasivo real tendría —la transcripción completa de los mensajes públicos— más el candidato de clave $k'$, y le pide que adivine cuál de los dos casos ocurrió.

La condición de éxito, $\Pr[\mathsf{KE}=1] < 0{,}5 + \varepsilon(n)$, dice que el adversario **no puede hacer mejor que adivinar al azar** (más una función despreciable de ventaja). Y eso es exactamente la propiedad que hace falta: si el adversario no puede distinguir la clave real de ruido puro, entonces $k$ es tan buena como una clave aleatoria para cualquier uso posterior — típicamente, como clave de un cifrado simétrico de la Clase 02 o 03.

**El paso 3 es el que hubo que explicar dos veces en el aula.** Carlos Vallejo Tapia preguntó qué pasa cuando $b = 0$ —*"¿como que se elige una $k$ random?"*— y la respuesta del docente es la mejor descripción del experimento que dejó la clase: los pasos 2 y 3 ocurren **fuera de la vista** del adversario; el adversario recibe los mensajes intercambiados y una clave, y **la mitad de las veces esa clave es totalmente al azar y no tiene nada que ver con nada**; lo que se le pide es que diga si la clave que le pasaron está relacionada con el intercambio o no.

> [!quote]- De la transcripción — la pregunta por b = 0, y la respuesta (cues 247-262)
> — **Carlos Vallejo Tapia:** *"No me quedó claro: ¿qué pasa si $b$ es 0? ¿Como que se elige una $k$ random?"*
> — *"Es eso, literalmente. Los pasos 2 y 3 ocurren afuera de la visibilidad del adversario. Se ejecuta un intercambio de claves, se corren los pasos 2 y 3, y el adversario lo que obtiene es los mensajes intercambiados y una clave. Esa clave, **la mitad de las veces va a ser una clave totalmente al azar**, que no tiene nada que ver con nada, se eligió al azar en el momento; **la otra mitad de las veces va a ser la clave del intercambio**. Y lo que se le pide al atacante es eso: que, habiendo observado todos los mensajes que se intercambiaron, responda si la clave que le pasaron está relacionada o no con el intercambio. (…) Fíjense que es un problema, parado desde el punto de vista del atacante, **mucho más fácil que recuperar la clave**. En ningún momento le pedimos recuperar la clave."*

## Por qué la definición pide indistinguibilidad y no "no se puede calcular k"

Una definición más débil, del estilo *"el adversario no puede calcular $k$ a partir de $\mathrm{Trans}$"*, dejaría pasar esquemas donde el adversario no recupera $k$ bit a bit pero sí aprende algo parcial —por ejemplo, la mitad de los bits de $k$, o que $k$ pertenece a un subconjunto chico de $\{0,1\}^n$—. Es la misma lógica por la que [[criptosistema#Seguridad (informal)|Criptosistema]] rechaza *"no se puede recuperar el mensaje entero"* como criterio de seguridad y exige además *"no se puede recuperar parte"* ni *"el sentido"* del mensaje. Pedir que $k$ sea **indistinguible de aleatorio** cierra de un solo golpe cualquier fuga parcial: si hubiera aunque sea un bit de $k$ correlacionado con algo público, ese sesgo le daría al adversario una ventaja no despreciable para distinguir $k$ de $k'$ uniforme.

**Es exactamente el argumento del docente, y lo dice en dos partes.** Primero el espíritu de todas las pruebas del curso: *"una prueba que, sin regalársela, le pone el escenario más fácil al atacante; porque si en este escenario no puede obtener ninguna ventaja, nos vamos a quedar mucho más tranquilos para el resto de los escenarios donde todavía tiene que hacer más trabajo"*. Después la consecuencia: pasar la prueba significa que **el atacante no puede predecir ni un bit** de la clave con probabilidad distinta de un medio. Y el ejemplo concreto de por qué eso importa llega un rato después, al hablar de Diffie-Hellman: una clave de 128 bits de la que se recuperan 64 **no rompe el logaritmo discreto y rompe la seguridad igual**, porque los otros 64 se fuerzan por fuerza bruta → [[diffie-hellman#Capa 2 — la conjetura de decisión Diffie-Hellman (DDH)|Diffie-Hellman]].

> [!quote]- De la transcripción — el escenario más fácil para el atacante, y ni un bit (cues 263-272)
> *"Es parecido al espíritu de las otras pruebas de seguridad: una prueba que, sin regalársela, le pone el escenario más fácil al atacante. Porque si el atacante en este escenario no puede obtener ninguna ventaja, nos vamos a quedar mucho más tranquilos para el resto de los escenarios donde todavía tiene que hacer más trabajo. Esto significa que el atacante **no puede ni siquiera tratar de predecir un bit** de la clave que se genera más allá de la probabilidad de un medio de ser 0 o 1; porque si pudiese hacerlo, se alejaría de forma no despreciable de un medio en la cantidad de veces que gana. Entonces lo que le pedimos al atacante es algo mucho más simple que recuperar la clave que se intercambia: es simplemente **decime si esta clave que yo te paso se corresponde con el intercambio o no tiene nada que ver**."*

## Adversario pasivo, no activo

El experimento `KE` modela específicamente un **adversario pasivo**: alguien que **escucha** la transcripción pero no puede **modificar** los mensajes que $A$ y $B$ se intercambian. Es una limitación explícita, no un descuido — [[diffie-hellman|Diffie-Hellman]] señala de entrada que su versión original **sólo** es segura contra este tipo de adversario, y que un atacante activo capaz de interceptar y sustituir mensajes rompe la seguridad con un ataque *man-in-the-middle*, desarrollado en [[ataques-activos-y-man-in-the-middle|Ataques activos y man-in-the-middle]]. El vocabulario pasivo/activo es el mismo que fija [[modelos-de-ataque|Modelos de ataque]] para el mundo simétrico. El docente lo hace explícito recién al cerrar Diffie-Hellman: *"el título que le puse a esta prueba de seguridad es seguridad frente a ataques pasivos"* (cue 677), y de ahí sale la advertencia de que usar el protocolo tal cual en la práctica *"los van a destrozar"*.
