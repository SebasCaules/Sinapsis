---
title: Generador pseudoaleatorio
resumen: 'Algoritmo determinístico que expande una semilla corta en una secuencia larga indistinguible del azar para toda prueba estadística de una familia dada; reemplaza al azar verdadero del One Time Pad en el cifrado de flujo.'
fuentes: ["[[clase-02-cifrado]]", "[[one-time-pad]]", "[[seguridad-computacional]]"]
aliases: [Generador pseudoaleatorio, PRG, Pseudorandom generator, Semilla, Seed]
type: concepto
unidad: 1
clase: 2
orden: 4
created: 2026-08-21
updated: 2026-09-06
tags: [criptografia, prg, pseudoaleatorio, semilla, lfsr, clase-02, transcripcion]
sources: [Clase 02 - Criptografia - Cifrado.pdf, "raw/clases/Clase 02pt1-Transcripcion.VTT"]
---

# Generador pseudoaleatorio

La primitiva que reemplaza al azar verdadero del [[one-time-pad|OTP]] por algo que se puede **guardar en 128 bits**.

---

## Idea

- Son **algoritmos determinísticos**.
- **Expanden** una entrada llamada **semilla** (*seed*).
- La salida **parece** aleatoria.

![Ejemplo de generador: registro de desplazamiento con realimentación](../../assets/clase02-prg-lfsr.png)

*El ejemplo de la filmina es un registro de desplazamiento realimentado (LFSR): en cada paso sale el bit de un extremo y entra el xor de algunas posiciones seleccionadas.*

> **"Parece aleatoria" no es una figura retórica** — es lo que la definición formal convierte en algo verificable. Y notar la tensión: el generador es **determinístico**, así que su salida es **completamente predecible** para quien conozca la semilla. Toda la pseudoaleatoriedad vive en el desconocimiento de $k$.

> [!quote]- De la transcripción — el diálogo que instala el problema (cues pt1 260-273)
> El docente no arranca por la definición sino por una pregunta a la clase: *"¿las computadoras son deterministas o son estocásticas?"* Respuesta del curso: deterministas. *"¿Y cómo hacen las computadoras para tener algo de estocasticidad?"* — usan semillas. Y un alumno cierra el círculo: *"si se sabe el proceso con el que se genera ese número y se tiene la semilla, también se puede determinar el número final"*.
>
> Ésa **es** la definición de pseudoaleatorio: no hay azar, hay una función determinística cuya salida no se puede predecir barato. La entropía real de la máquina queda para más adelante (cues pt1 272-273), y ese "más adelante" es [[numeros-aleatorios-y-randomness|Sobre números aleatorios y randomness]].

### La analogía del anillo

No está en ninguna filmina, y es la que ordena las tres propiedades que importan de un generador.

> [!quote]- De la transcripción — el anillo, y cómo se lee con él el registro de la filmina (cues pt1 275-283, 297-309)
> *"Imagínense un algoritmo que distribuye todos los números enteros posibles —los que entran en una representación de 24 bits— **en un anillo**. Lo que ustedes determinan con la semilla es **dónde arrancan de ese anillo** para recorrer todos los números posibles."*
>
> La misma imagen le sirve para leer el registro de desplazamiento de la filmina: 8 bits, se xorean dos posiciones, el resultado se realimenta, *"con la esperanza de que esto me recorra todos los valores posibles de 8 bits sin repetirlos, haciendo un anillo completo"*.

De ahí salen tres cosas: **por qué la semilla es lo único secreto** (es la posición de arranque), **por qué el generador tiene período** (el anillo se cierra) y **por qué un período corto lo arruina** (se recorre poco antes de repetir). Las tres se ven en el ejercicio de más abajo, donde el período es $5$.

## Definición formal

Sea $D = \{\, f : \{0,1\}^{n} \to \{0,1\} \,\}$ una familia de funciones. Entonces

$$G: \{0,1\}^s \to \{0,1\}^n,\quad s < n$$

es un **generador pseudoaleatorio respecto de $D$** si para toda $f \in D$:

$$P\big(\,f(G(r^s)) \neq f(r^n)\,\big) = \varepsilon$$

Las tres anotaciones con flecha de la filmina traducen cada símbolo: el $P$ es una **probabilidad generalizada**, $r^{n}$ es una **secuencia realmente aleatoria** y $\varepsilon$ un **valor despreciable**.

| Pieza | Qué es |
|---|---|
| $s < n$ | La condición de **expansión**: la salida es más larga que la semilla. Sin esto no hay nada que ganar |
| $f \in D$ | Una **prueba estadística** de un bit: mira la secuencia y dicta un veredicto |
| $r^{s}$, $r^{n}$ | Semilla aleatoria y secuencia verdaderamente aleatoria de largo $n$ |
| $\varepsilon$ | [[seguridad-computacional#Nivel de seguridad\|Función despreciable]] |

**Lectura:** *ninguna prueba estadística de la familia $D$ reacciona distinto ante la salida del generador que ante ruido genuino.* Cuanto más rica sea $D$ —en criptografía, todas las $f$ computables en tiempo PPT— más fuerte la garantía.

> **Lo que la definición NO pide.** No pide que la salida sea "impredecible" ni que tenga período largo ni que pase tests de frecuencia. Pide algo mucho más fuerte y mucho más simple de enunciar: **que sea indistinguible**. Todo lo demás se deduce — si el período fuera corto, existiría una $f$ que lo detecta, y esa $f$ sería un distinguidor.

> **Y por qué la definición tiene que ser "indistinguible" y no "aleatorio".** *(lectura nuestra.)* Porque un $G$ determinístico **no puede fabricar azar**: como $G(r^{s})$ es función de $r^{s}$, ninguna cuenta posterior agrega información, y la salida de $n$ símbolos lleva a lo sumo el contenido que traía la semilla de $s$. **La expansión mueve recipientes, no contenido**; el déficit está siempre ahí y lo único que la definición pide es que **ninguna prueba eficiente lo encuentre**. Esa distinción entre el *binary digit* —el recipiente, un $0$ o un $1$— y el *bit* —la información que efectivamente transporta— es la que desarrolla [[teoria-de-la-informacion#8. El puente con criptografía|Teoría de la información]], donde el argumento está escrito con entropías. Es la misma distinción por la que **una clave de 56 binary digits sorteada con una `Gen()` sesgada no vale 56 bits**: los recipientes viajan medio vacíos y ningún campo del protocolo cambia de tamaño.

---

## Ejercicio de la clase, resuelto

Las filminas plantean el ejercicio y **no dan la respuesta**. Definición:

$$\begin{aligned}
s &\in \{\,1, \dots, 10\,\}\\
G(s) &= \{\, G_0 \% 2,\ G_1 \% 2,\ G_2 \% 2,\ \dots,\ G_n \% 2 \,\}\\
&\quad G_0 = s\\
&\quad G_i = G_{i-1} \cdot 3 + 1 \pmod{11}
\end{aligned}$$

> **Errata de la filmina:** escribe *"Sea $s = \{1, \dots, 10\}$"*, confundiendo el elemento con el conjunto. Es $s \in \{1,\dots,10\}$: tal como está, $G$ recibiría un conjunto. *(Precisión nuestra.)*

> **Ojo con lo que se escucha en el audio (cues pt1 324-325).** Al leer el ejercicio el docente dice *"lo voy a dividir por 2"*, pero la filmina escribe $G_i \% 2$ y lo que se toma es **el resto**, no el cociente: es el bit de paridad. La cuenta correcta es la de la filmina, que es la que sigue acá abajo.

**Generar 5 bits con $s = 2$:**

| $i$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $G_{i}$ | 2 | 7 | 0 | 1 | 4 |
| $G_i \% 2$ | **0** | **1** | **0** | **1** | **0** |

→ $G(2) = 01010$

**Generar 5 bits con $s = 6$:**

| $i$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $G_{i}$ | 6 | 8 | 3 | 10 | 9 |
| $G_i \% 2$ | **0** | **0** | **1** | **0** | **1** |

→ $G(6) = 00101$

### Y por qué este G NO es un generador pseudoaleatorio

*(desarrollo nuestro — la filmina se queda en generar los bits.)* El ejercicio es más interesante de lo que parece: sirve para **aplicar la definición** y ver que falla.

El mapa $x \mapsto 3x + 1 \pmod{11}$ tiene una estructura muy pobre:

- **Un punto fijo: $x = 5$** (porque $3\cdot 5+1 = 16 \equiv 5$). Con $s = 5$ el generador escupe $5, 5, 5, \dots$ → **$11111$ para siempre**. Es la peor semilla posible y no está excluida del dominio.
- **Dos órbitas de largo 5** que cubren todo el resto: $\{0, 1, 4, 2, 7\}$ y $\{3, 10, 9, 6, 8\}$. O sea, **el período de la secuencia es 5** para toda semilla distinta de 5.
- Las dos órbitas están relacionadas por $x \mapsto 10 - x$, que **preserva la paridad**. Por eso ambas producen **la misma secuencia de bits**, sólo desfasada: $s = 2$ y $s = 8$ dan $01010$, $s = 4$ y $s = 6$ dan $00101$, etc.

Juntando todo: de las 10 semillas del dominio salen apenas **6 secuencias distintas de 5 bits**:

| Salida de 5 bits | Semillas que la producen |
|---|---|
| $10010$ | 1, 9 |
| $01010$ | 2, 8 |
| $10100$ | 3, 7 |
| $00101$ | 4, 6 |
| $11111$ | 5 |
| $01001$ | 10 |

**El distinguidor es inmediato.** Sea $f$ la función que devuelve $1$ si la secuencia de 5 bits está en esa lista de 6 y $0$ si no:

$$P\big(f(G(r^s)) = 1\big) = 1 \qquad\text{contra}\qquad P\big(f(r^5) = 1\big) = \frac{6}{32} = 0{,}1875$$

La diferencia es $0{,}8125$ — cualquier cosa menos despreciable. Y ni siquiera hace falta la tabla: como el período es 5, **quien ve 5 bits conoce todos los que siguen**.

> **Para qué sirve entonces el ejemplo.** Para separar dos cosas que se confunden: *generar bits que se ven desordenados* (esto lo hace) y *ser un PRG criptográfico* (esto no, ni cerca). El módulo 11 es un juguete; un generador real necesita que el estado interno sea de al menos 128 bits y que el paso siguiente sea inviable de predecir. Lo que **sí** se transmite del ejemplo es la forma: **estado interno + función de próximo estado + función de salida**, que es la estructura de cualquier cifrador de flujo.

> **Consecuencia directa.** Por el [[criptosistema-de-flujo#Teorema de la clase|teorema de la clase]] y su recíproco, un [[criptosistema-de-flujo|criptosistema de flujo]] construido con este $G$ **no pasa la prueba `Eav`** — la reducción está en [[pruebas-de-indistinguibilidad#Ejercicio 1: si G se distingue, el flujo no pasa EAV|pruebas de indistinguibilidad]].

---

## Dónde reaparece

Las [[primitiva-de-cifrado-en-bloque|primitivas de cifrado en bloque]] se piden **funciones pseudoaleatorias**, y la clase liga los dos conceptos explícitamente:

> Para cada posible $k$, $f(x) = \mathsf{Enc}_k(x)$ **es un generador pseudoaleatorio**.

Por eso los modos [[modos-de-encadenamiento|OFB, CFB y CTR]] pueden construir un cifrado de flujo a partir de uno de bloque: usan la primitiva como generador de keystream.
