---
title: Complejidad y espacio de claves
resumen: 'Las prevenciones generales de un sistema de autenticación y la fórmula de Anderson $P \ge TG/N$, que liga la probabilidad de adivinar una clave con el tiempo, las pruebas por segundo y el tamaño del espacio.'
fuentes: ["[[clase-07-autenticacion]]", "[[ataques-a-un-sistema-de-autenticacion]]", "[[video-12-proteccion-de-datos-personales]]", "[[principio-de-kerckhoffs]]"]
aliases: [Complejidad y espacio de claves, Anderson (fórmula), Desigualdad de Anderson, Espacio de claves]
type: concepto
unidad: 2
clase: 7
orden: 5
created: 2026-09-04
updated: 2026-09-04
tags: [autenticacion, complejidad, espacio-de-claves, formula-de-anderson, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf", "wiki/videos/video-07-principios-de-diseno-2024.md"]
---

# Complejidad y espacio de claves

**Cómo se defiende un sistema de autenticación en general, y con qué única fórmula numérica se convierte "subir la complejidad de las claves" en un tiempo de ataque concreto — con sus tres usos posibles y una errata de cuentas que el propio deck se contradice a sí mismo.**

*Filminas 31 a 36 del deck de Aplicaciones. Esta clase todavía no se dictó (hoy es 04/09/2026): la nota está escrita contra el PDF de filminas, verificado renderizando cada página, más lecturas propias rotuladas.*

## Prevenciones generales

La filmina 31 separa dos frentes de defensa, y cada uno ataca un lado distinto del trío $(a,c,f)$ que aparece en el [[ataques-a-un-sistema-de-autenticacion#Objetivos enfrentados|mecanismo de ataque]]:

- **Esconder información**, para que $a$, $c$ y $f$ no queden conocidas todas a la vez. La filmina hace dos observaciones sobre esto que conviene no perder: $f$ **suele conocerse igual** —es el mismo [[principio-de-kerckhoffs|principio de Kerckhoffs]] aplicado acá: el algoritmo es público, lo secreto es la clave—, y **es más fácil proteger $c$ que $a$**, porque $a$ vive en manos de la entidad externa, fuera de cualquier control del sistema.
- **Limitar el uso de la función de autenticación**: tiempos crecientes ante fallas, deshabilitar principales, *jailing*/honeypot, `CAPTCHA`s. Las cuatro son defensas exclusivamente **online** — contra un [[ataques-a-un-sistema-de-autenticacion#Dos caminos de verificación, dos modos de ataque|atacante offline]], que ya tiene $c$, nunca pasa por la función $L$ del sistema real y estas cuatro medidas no le hacen nada.

El resto de la sección —subir la complejidad de las claves— es la contraparte que sí funciona contra un atacante **offline**, porque sube el costo de calcular $f(a)$ para cada candidato en vez de limitar cuántas veces se puede intentar.

## La fórmula de Anderson

La filmina 32 da la herramienta cuantitativa de toda la sección:

$$P \ge \frac{T \cdot G}{N}$$

- $P$ — probabilidad de adivinar una clave.
- $T$ — tiempo dedicado al ataque.
- $G$ — cantidad de pruebas realizables por segundo.
- $N$ — tamaño del espacio de claves.

**El signo es $\ge$, no $\le$.** La filmina 32 no dibuja ese glifo: muestra un recuadro con un signo de pregunta, porque el deck se exportó sin quince símbolos matemáticos ([[clase-07-autenticacion#Estado de las fuentes|Clase 07 § Estado de las fuentes]] explica el defecto y lo cuantifica). Lo que el archivo **codifica** en ese lugar, en cambio, sí se puede leer, y es *greater-equal*; y coincide con el enunciado de la fuente designada de la clase, Bishop §13.4 *Attacking Passwords*: *"Then $P \ge TG/N$"* (p. 426).

Lo que la fórmula da, por lo tanto, es un **piso** del riesgo y no un techo: con $T$ y $G$ dados, el atacante alcanza **al menos** esa probabilidad *(lectura nuestra: el deck usa la fórmula pero no comenta el sentido de la desigualdad)*. De ahí que los tres ejemplos que siguen sean todos **despejes** —fijado el $P$ que se tolera, sale el $T$ dentro del cual se alcanza (ejemplos 1 y 2) o la $N$ requerida, y con ella la longitud mínima de clave (ejemplo 3)—, y que el deck la trate en los tres como una **igualdad de estimación**: reemplaza y saca un número exacto, no un rango *(lectura nuestra)*.

*(Lectura nuestra.)* La fórmula opera a un nivel distinto del de la [[seguridad-computacional|seguridad computacional]] de la Unidad 1: ahí $P$ tiene que ser una función **despreciable** del parámetro de seguridad, sin cifras concretas de tiempo; acá $P$, $T$, $G$ y $N$ son números que se pueden reemplazar y despejar directamente. Es una herramienta de ingeniería —cuánto dura un ataque con el hardware de hoy— más que un resultado asintótico, y las dos conviven sin contradecirse: la fórmula de Anderson es lo que se usa para decidir **cuán grande** tiene que ser $N$ para que la probabilidad concreta caiga por debajo de un umbral aceptable en la práctica.

### Ejemplo 1 — cuánto tarda un ataque

Claves numéricas de 10 dígitos ($N = 10^{10}$), $G = 10^{4}$ pruebas por segundo, se busca $P > 0{,}5$:

$$T \le \frac{P \cdot N}{G} = \frac{0{,}5 \times 10^{10}}{10^{4}} = 5\times 10^{5}\text{ s} = 500\,000\text{ s}$$

$500\,000 \,/\, 86\,400 \approx 5{,}79$ días, que la filmina redondea a **"~6 días"**. La cuenta cierra tal como está escrita en el deck.

### Ejemplo 2 — el mismo despeje con otro espacio

Claves de 8 letras, alfabeto de 26 caracteres ($N = 26^{8}$), mismo $G = 10^4$, mismo $P>0{,}5$:

$$N = 26^{8} = 208\,827\,064\,576, \qquad T \le \frac{0{,}5 \times 26^{8}}{10^{4}} = 10\,441\,353{,}2\text{ s} \;\approx\; 121\text{ días}$$

> **Errata de la filmina.** El renglón de la filmina dice *"T ≤ 1.044.135s ~ 121 días"* — con el signo $\le$ dibujado como un recuadro, uno de los quince glifos que le faltan al deck ([[clase-07-autenticacion#Estado de las fuentes|Clase 07 § Estado de las fuentes]]). El valor en segundos está mal por un **factor de 10**: la cuenta correcta da $10\,441\,353\text{ s}$, no $1\,044\,135\text{ s}$. Se verifica en las dos direcciones: $0{,}5 \times 26^8 / 10^4$ da $10\,441\,353{,}2$, y la propia conversión a días que la misma filmina escribe a continuación —*"~121 días"*— sólo es consistente con el valor correcto: $1\,044\,135 \,/\, 86\,400 \approx 12$ días, no 121. La filmina se contradice a sí misma, y el valor en días es el que hay que confiar: el error está en la cifra de segundos.

### Ejemplo 3 — despejar la longitud mínima

Alfabeto alfanumérico de 36 caracteres, $G = 10^5$ pruebas por segundo, un año de ataque ($T = 365\times24\times60\times60$ s), se pide $P<0{,}5$:

$$N \ge \frac{T\cdot G}{P} = \frac{31\,536\,000 \times 10^{5}}{0{,}5} = 6{,}3072\times 10^{12}$$

$$N = 36^{L} \ge 6{,}3\times 10^{12} \;\Longrightarrow\; L \ge \log_{36}\!\left(6{,}3\times 10^{12}\right) \approx 8{,}22 \;\Longrightarrow\; L \ge 9$$

Esta cuenta cierra exacta, sin errata: longitud mínima de **9 caracteres** alfanuméricos para ese umbral de riesgo.

## Mejores ataques que la búsqueda aleatoria

Los tres ejemplos anteriores asumen una **búsqueda aleatoria** sobre todo $N$. La filmina 36 muestra que esa hipótesis casi nunca se cumple en la práctica: diccionarios de palabras, diccionarios de claves ya filtradas en brechas anteriores, transformaciones simples (sufijos, prefijos, `l→1`, `o→0`, vocales por números, palabras espejadas, dos palabras combinadas) e información de contexto (nombre, usuario, DNI, fecha de nacimiento) **rebajan el $N$ efectivo** sin cambiar el espacio nominal de claves.

Es exactamente el mecanismo que ya tiene nota propia en el vault: [[ataque-de-diccionario-sobre-hashes|Ataque de diccionario sobre hashes]] desarrolla por qué reducir el dominio de búsqueda ataca sin necesidad de romper ninguna propiedad criptográfica de la función. Traducido a la fórmula de Anderson: el $N$ de la sección anterior es el tamaño del espacio **nominal**; estas mejoras operan sobre un $N$ efectivo mucho menor, y por lo tanto elevan $P$ muy por encima de lo que el ejemplo 3 calculó asumiendo búsqueda uniforme.

## Cuando el control de ejecución falla, el espacio de claves queda desnudo

*(Cruce con un video, no de la filmina.)* El [[video-12-proteccion-de-datos-personales#La anécdota de Apple contra el Estado (50:57)|Video 12]] da el ejemplo que mejor conecta esta sección con la anterior: un PIN de cuatro dígitos tiene $N=10^4$, un espacio minúsculo comparado con los tres ejemplos de arriba. Lo que lo vuelve razonablemente seguro en la práctica **no es el tamaño de $N$**, sino el contador de intentos del dispositivo — una defensa **online**, de las que la sección de "Prevenciones generales" lista arriba. Cuando ese contador se puentea (el caso real del iPhone de la maratón de Boston), el $N$ nominal queda expuesto sin ninguna protección adicional, y probar las diez mil combinaciones es trivial. Es el mismo punto, aplicado al revés, del [[ataque-de-fuerza-bruta#Principio de espacio de claves suficiente|principio de espacio de claves suficiente]]: la condición es necesaria, pero acá se ve que tampoco alcanza si el control que la rodea desaparece.
