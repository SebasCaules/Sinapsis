---
title: Intercambio de claves
resumen: 'Definición formal del protocolo con el que dos partes acuerdan una misma clave hablando por un canal público, y el experimento KE que exige que esa clave sea indistinguible de una aleatoria para un adversario pasivo.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[pruebas-de-indistinguibilidad]]", "[[diffie-hellman]]"]
aliases: [Intercambio de claves, Protocolo de intercambio de claves, Experimento KE, Key Exchange, Key-Exchange experiment]
type: concepto
unidad: 1
clase: 4
orden: 3
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, intercambio-de-claves, key-exchange, indistinguibilidad, adversario-pasivo, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# Intercambio de claves

**La definición formal de "dos partes se ponen de acuerdo en una clave hablando por un canal que un adversario escucha" y el experimento —`KE`— que mide si ese acuerdo es seguro.** Es la maquinaria que hace falta antes de poder juzgar si Diffie-Hellman, que viene en la sección siguiente, sirve para algo.

Sale de las filminas **16 y 17** de la Clase 04. Esta clase todavía no se dictó —hoy es 04/09/2026, la clase es el 10/09—, así que la nota está escrita contra el PDF de filminas, más Katz & Lindell y lecturas propias rotuladas; no hay transcripción y por lo tanto ningún callout *De la transcripción*.

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

## El experimento KE: seguridad frente a un adversario pasivo

La definición de arriba dice **qué hace** el protocolo, pero no dice si el resultado es útil como clave criptográfica: una clave $k_a = k_b$ que un espía puede adivinar mirando la transcripción no sirve para nada, aunque técnicamente cumpla la condición fundamental. Hace falta una prueba de **indistinguibilidad**, con la misma estructura que las pruebas `Eav`/`CPA` de la [[clase-02-cifrado#7. Pruebas de seguridad e indistinguibilidad|Clase 02]]: un bit oculto que el adversario tiene que adivinar.

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

## Por qué la definición pide indistinguibilidad y no "no se puede calcular k"

Una definición más débil, del estilo *"el adversario no puede calcular $k$ a partir de $\mathrm{Trans}$"*, dejaría pasar esquemas donde el adversario no recupera $k$ bit a bit pero sí aprende algo parcial —por ejemplo, la mitad de los bits de $k$, o que $k$ pertenece a un subconjunto chico de $\{0,1\}^n$—. Es la misma lógica de por qué la [[clase-01-introduccion-y-criptografia-clasica#3. Seguridad (informal)|Clase 01]] rechaza *"no se puede recuperar el mensaje entero"* como criterio de seguridad y exige además *"no se puede recuperar parte"* ni *"el sentido"* del mensaje. Pedir que $k$ sea **indistinguible de aleatorio** cierra de un solo golpe cualquier fuga parcial: si hubiera aunque sea un bit de $k$ correlacionado con algo público, ese sesgo le daría al adversario una ventaja no despreciable para distinguir $k$ de $k'$ uniforme.

## Adversario pasivo, no activo

El experimento `KE` modela específicamente un **adversario pasivo**: alguien que **escucha** la transcripción pero no puede **modificar** los mensajes que $A$ y $B$ se intercambian. Es una limitación explícita, no un descuido — la [[clase-04-criptografia-asimetrica-y-firma-digital#5. Diffie-Hellman|Clase 04]] señala de entrada que la versión de Diffie-Hellman que sigue **sólo** es segura contra este tipo de adversario, y que un atacante activo capaz de interceptar y sustituir mensajes rompe la seguridad con un ataque *man-in-the-middle*, desarrollado en [[ataques-activos-y-man-in-the-middle|Ataques activos y man-in-the-middle]]. El vocabulario pasivo/activo es el mismo que fija [[modelos-de-ataque|Modelos de ataque]] para el mundo simétrico.

## Ver también

- [[clase-04-criptografia-asimetrica-y-firma-digital#4. Intercambio de claves y el experimento KE|Clase 04 — Criptografía asimétrica y firma digital § 4. Intercambio de claves y el experimento KE]] — la sección de la que sale esta nota
- [[distribucion-de-claves-y-kdc|Distribución de claves y KDC]] — la alternativa centralizada que este protocolo evita
- [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]] — el álgebra sobre la que corre el protocolo concreto de la sección siguiente
- [[diffie-hellman|Diffie-Hellman]] — el protocolo concreto que instancia esta definición abstracta
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — la familia `Eav`/`CPA`/`CCA` de la que `KE` es la variante para intercambio de claves
- [[modelos-de-ataque|Modelos de ataque]] — el vocabulario de adversario pasivo/activo que separa `KE` de un protocolo autenticado
- [[ataques-activos-y-man-in-the-middle|Ataques activos y man-in-the-middle]] — qué pasa cuando el adversario deja de ser pasivo
- Katz & Lindell, cap. 10 *Key Management and the Public-Key Revolution* — desarrollo formal del intercambio de claves ([[bibliografia|bibliografía]])
