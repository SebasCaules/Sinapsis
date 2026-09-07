---
title: Pruebas de indistinguibilidad
resumen: 'Los juegos Eav, Mul y CPA con los que se mide la seguridad de un criptosistema: el adversario gana si acierta cuál de dos mensajes se cifró, y se exige que no supere al azar salvo por un margen despreciable.'
fuentes: ["[[clase-02-cifrado]]", "[[clase-03-macs-y-cifrado-autenticado]]", "[[seguridad-computacional]]"]
aliases: [Pruebas de indistinguibilidad, Prueba de seguridad, EAV, Eavesdropping indistinguishability, Múltiples cifrados, Mul, CPA-Secure, Indistinguibilidad]
type: concepto
unidad: 1
clase: 2
orden: 5
created: 2026-08-21
updated: 2026-09-06
tags: [criptografia, indistinguibilidad, eav, cpa, seguridad-computacional, juegos, clase-02, transcripcion]
sources: [Clase 02 - Criptografia - Cifrado.pdf, "raw/clases/Clase 03pt1-Transcripcion.VTT", "raw/clases/Clase 02pt1-Transcripcion.VTT"]
---

# Pruebas de indistinguibilidad

Cómo se **mide** la seguridad una vez que se abandonó el [[secreto-perfecto|secreto perfecto]]. Es el instrumento de la [[seguridad-computacional|seguridad computacional]]: en lugar de *"el criptograma no revela nada"*, se define un **juego** y se mide con qué probabilidad el adversario lo gana.

---

## Qué es una prueba de seguridad

> - **Prueban características** de un criptosistema.
> - Son una **serie de pasos que ejecutan un algoritmo** (que representa un ataque).
> - El atacante **gana o pierde** la prueba.
> - Se puede **repetir múltiples veces**: interesa la **probabilidad de éxito** del atacante.

El molde común de las tres pruebas de esta clase:

1. El adversario $A$ elige mensajes.
2. Se genera una clave $k \leftarrow K$ y un bit oculto $b \leftarrow \{0,1\}$.
3. $A$ recibe el cifrado de los mensajes **correspondientes a $b$**.
4. $A$ emite $b'$.
5. **Gana si $b = b'$.**

Adivinando a ciegas gana con probabilidad $0{,}5$. Lo que se exige es que **no pueda hacer mejor que eso salvo por un margen despreciable**.

**El juego le regala al atacante todo lo que se pueda**: él elige los mensajes, sólo tiene que distinguir entre dos, y le alcanza con acertar un poco más que tirando una moneda. Si **ni siquiera así** gana, el criptosistema es sólido. **Una definición de seguridad se hace fuerte debilitando lo que se le exige al atacante**, no exigiéndole más. *(Lectura nuestra sobre lo que dice el docente.)*

> [!quote]- De la transcripción — vocabulario, etimología y para qué sirve el conjunto (cues pt1 342, 356, 376-377, 389)
> *"Se hace con pruebas de seguridad, con los **experimentos** — también se llaman experimentos"*: las dos palabras son la misma cosa, y en Katz & Lindell se lee *experiment*.
>
> La etimología que desambigua la sigla: ***"`Eav` viene de eavesdropping, que significa espiar"*** — no es un acrónimo, es una palabra recortada. Para `CPA` da el nombre en castellano: *"ataque de texto plano escogido, chosen plaintext"*.
>
> Por qué el juego parece demasiado fácil para el atacante (cues pt1 376-377): *"Ni siquiera tiene que saber el valor exacto (…) **el adversario la tiene un poco más fácil en ese sentido, porque no es que tiene que desencriptarlo a ciegas**, sino que hay 2 mensajes y de ese $C$ que recibe tiene que identificar de cuál de los 2 vino."*
>
> Y para qué sirve el conjunto (cue pt1 389): *"así se van dando niveles de seguridad a los diferentes algoritmos. Es una manera de poder ponerle un número, ponerle una **métrica categórica** a los diferentes algoritmos en base a cuánto se le permite al atacante acceder a la información."* Es el enganche directo con el vocabulario de [[estado-de-un-criptosistema|estado de un criptosistema]].

> **Si alguno de estos símbolos no te cierra.** El nombre largo $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$ con el que Katz escribe el mismo juego está desarmado pieza por pieza en [[notacion-y-terminologia#7. Los experimentos, desarmados|notación y terminología § Los experimentos, desarmados]], junto con el $\mathrm{PPT}$ del adversario y el $\varepsilon(n)$ despreciable. Y la flecha del paso 2 —la que marca que ahí se **sortea** en vez de calcular, y de donde sale el $b \leftarrow \{0,1\}$ del bit oculto— está en [[notacion-y-terminologia#4. Asignación y azar|§ Asignación y azar]].

> **Cómo leer el "$= 0{,}5 + \varepsilon$" de las filminas.** *(precisión nuestra.)* Las tres filminas escriben *"Si $\Pr[\text{prueba} = 1] = 0{,}5 + \varepsilon$ ⟹ $\Pi$ es indisting."*. Leído literalmente pediría una igualdad exacta; lo que se quiere decir es **$\Pr[\text{prueba} = 1] \le 1/2 + \varepsilon(n)$ para todo adversario PPT, con $\varepsilon$ despreciable**. Los dos cuantificadores que la taquigrafía se come son los importantes: **para todo $A$** y **$\varepsilon$ despreciable en $n$**.

---

## Para qué sirve una prueba: es una herramienta de decisión

Una prueba de seguridad **no es un sello de calidad abstracto**. Sirve para decidir si una construcción se puede usar **en un escenario dado**, y ése es el uso que la cátedra le pide expresamente al cerrar el ejercicio del [[ataque-de-texto-cifrado-escogido#Ejercicio: el cifrado de flujo no es CCA-Secure|cifrado de flujo bajo CCA]]: puesto en prosa, el resultado dice que **si el escenario exige sobrevivir a texto cifrado escogido, un criptosistema de flujo no sirve y hay que buscar otra cosa**. La prueba traduce una propiedad matemática en una decisión de ingeniería.

> [!quote]- De la transcripción de la Clase 03 — la lección explícita del ejercicio (cues pt1 364-368)
> *"Las pruebas de seguridad se pueden usar como **herramienta para entender si un criptosistema, una construcción criptográfica, se puede usar o no en cierto escenario**. O sea, el resultado de lo que acabamos de hacer, si lo pusiese en prosa, quiere decir que si estuviésemos en un escenario de seguridad donde aplica esta definición —donde necesitamos **sobrevivir a texto cifrado escogido**— un criptosistema de flujo **no sirve**: tenemos que buscar otra cosa. Ésa, si quieren, es la lección."*

**Y una nota metodológica sobre construir el adversario, que conviene tener antes del parcial: no es obvio la primera vez, y no se espera que lo sea.** El docente lo dice sobre su propia experiencia y le pone nombre a la categoría — *demostraciones galera*, las que parecen sacadas de la galera de un mago—: nombra exactamente la sensación de leer un ataque elegante y no ver de dónde salió. El antídoto no es tener la idea, es **reconocer la estructura repetida**. En el ejercicio de `CCA` esa estructura es *anular con un xor conocido y después leer*, y es la misma que reaparece media hora más tarde en el [[cbc-mac#El ataque de longitud variable, paso a paso|ataque al CBC-MAC]].

> [!quote]- De la transcripción de la Clase 03 — las demostraciones "galera" (cues pt1 356-361)
> *"Es muy fácil, entre comillas. O sea: yo esta demostración ya la vi 200 veces, **la puedo hacer dormido**. La primera vez que la vi, como la están viendo ustedes, dije: *no se me hubiese ocurrido jamás*. Muchas de estas cosas son como las demostraciones matemáticas esas que llamamos **galeras**: cuando uno las ve por primera vez dice *¿cómo se le ocurrió a alguien?*, y después uno empieza a ver cierta estructura y cierta idea atrás de eso."*

---

## Las tres pruebas

### 1. Eav_A,Π — indistinguibilidad ante observador

*Eavesdropping Indistinguishability test.* Dado un adversario $A$ y un criptosistema $\Pi$:

$$\begin{aligned}
&1)\ \ A \text{ genera } m_0 \text{ y } m_1 \text{ arbitrariamente}\\
&2)\ \ \text{se genera una clave } k \leftarrow K\\
&3)\ \ \text{se genera } b \leftarrow \{0,1\}\\
&4)\ \ A \text{ recibe } c = e_k(m_b)\\
&5)\ \ A \text{ emite } b' \in \{0,1\}
\end{aligned}$$

$\mathsf{Eav}_{A,\Pi} = 1$ si $b = b'$ (A gana). Si $\Pr[\mathsf{Eav}_{A,\Pi} = 1] = 0{,}5 + \varepsilon$ ⟹ $\Pi$ es indistinguible.

La filmina repite esta misma prueba una segunda vez, ya **parametrizada por el [[seguridad-computacional#Nivel de seguridad|nivel de seguridad]]**: adversario $A(n)$, criptosistema $\Pi(n)$, y $\varepsilon(n)$ en lugar de $\varepsilon$. Esa es la versión que vale — sin $n$ no se puede decir qué significa "despreciable".

> Es el equivalente formal del modelo **COA** de la taxonomía de la [[practica-01-esquemas-y-taxonomias|Práctica 01]]: adversario **pasivo**, que sólo observa. Ver [[modelos-de-ataque|Modelos de ataque]].

### 2. Mul_A,Π — múltiples cifrados

*Multiple message eavesdropping test.* Igual, pero con **vectores** de mensajes:

$$\begin{aligned}
&1)\ \ A \text{ genera } (m_{00}, m_{01}, \dots, m_{0i}) \text{ y } (m_{10}, m_{11}, \dots, m_{1i})\\
&2)\ \ \text{se genera una clave } k \leftarrow K\\
&3)\ \ \text{se genera } b \leftarrow \{0,1\}\\
&4)\ \ A \text{ recibe } (c_0, c_1, \dots, c_i), \text{ donde } c_j = \mathsf{Enc}_k(m_{bj})\\
&5)\ \ A \text{ emite } b' \in \{0,1\}
\end{aligned}$$

**Todos los mensajes se cifran con la misma clave $k$** — ahí está el filo de la prueba.

### 3. CPA_A,Π — texto plano escogido

*Chosen Plain Text indistinguishability.* Ahora el adversario es **activo**:

$$\begin{aligned}
&1)\ \ \text{se genera una clave } k \leftarrow K\\
&2)\ \ A \text{ obtiene } f(x) = e_k(x) \ \text{(el oráculo) y genera } (m_0, m_1)\\
&3)\ \ \text{se genera } b \leftarrow \{0,1\}\\
&4)\ \ A \text{ recibe } c = e_k(m_b)\\
&5)\ \ A \text{ emite } b' \in \{0,1\}
\end{aligned}$$

La diferencia estructural: **la clave se genera primero**, porque $A$ necesita el oráculo $f(x) = e_k(x)$ **antes** de elegir sus mensajes.

Con el oráculo, la demostración de que **determinístico $\Rightarrow$ no es CPA-Secure** es inmediata, y está abajo. Lo que conviene retener: `Mul` y `CPA` rompen lo determinístico **por caminos distintos** — `Mul` por reuso de clave, `CPA` por acceso al cifrado.

> [!quote]- De la transcripción — la maquinola, y por qué en CPA no se trata del reuso de clave (cues pt1 572-615, 664-667)
> La filmina escribe $f(x) = e_k(x)$ y nada más. El docente lo llama, sin ironía, ***"una maquinola"***: *"una cajita cerrada donde alguien mete un mensaje, pum, y sale el criptograma **con la clave verdadera**"*. Aclara de dónde sale el nombre: *"esto viene de toda la teoría de ciencias de la computación que estudia computabilidad"*. Su comentario sobre el resultado (cue pt1 609): *"esto es muy loco, porque parece medio ridículo — pero justamente es para dar la idea de que $A$ puede tener acceso a una maquinola"*.
>
> Un alumno pregunta si en `CPA` la clave se reusa. Respuesta (cues pt1 664-667): *"en `CPA` la condición **no pasa por la reutilización de la clave**, sino porque el atacante tiene un poder más, que es el oráculo. Pero en el caso múltiple sí, la clave es reutilizable, porque $m_{0,0}$ y $m_{0,1}$ los encriptás con la misma clave."*

> **Divergencia con la bibliografía.** La filmina da el oráculo **sólo en el paso 2, antes del desafío**, y no lo vuelve a otorgar después de que $A$ recibe $c$. La definición estándar de Katz & Lindell —y la que usa la [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]]— da acceso al oráculo **antes y después**. La filmina no señala la diferencia. *(Precisión nuestra.)*

### Comparación

| | `Eav` | `Mul` | `CPA` |
|---|---|---|---|
| Mensajes que elige $A$ | 2 | 2 vectores | 2, + consultas libres |
| Criptogramas que ve | 1 | $i+1$ | 1 + los del oráculo |
| Oráculo de cifrado | No | No | Sí |
| Adversario | pasivo | pasivo | **activo** |
| ¿Lo pasa un cifrado determinístico? | puede | **nunca** | **nunca** |
| ¿Lo pasa el [[criptosistema-de-flujo\|flujo]] sin IV? | Sí | No | No |

**Cada prueba contiene a la anterior**: quien gana `Eav` gana `Mul` y `CPA`, así que pasar `CPA` es la exigencia más fuerte de las tres. Es el estándar mínimo moderno.

**Qué le agrega cada paso al adversario:**

| Paso | Qué le agrega | Qué rompe |
|---|---|---|
| `Eav` → `Mul` | ver **varios** criptogramas cifrados con la **misma clave** | toda `Enc` determinística, y el [[criptosistema-de-flujo\|flujo]] que repite keystream |
| `Mul` → `CPA` | el **oráculo**: puede pedir el cifrado de lo que se le ocurra | también lo determinístico, pero **por otro camino** — no por reuso de clave sino por acceso al cifrado |

No son tres pruebas sueltas: es **un adversario al que se le va soltando la soga**, que es la metáfora con la que el docente ordena el tramo — ver [[seguridad-computacional#La secuencia de las pruebas es una sola idea|Seguridad computacional]]. Esto es además la **versión formal** de la taxonomía COA/KPA/CPA/CCA de la [[practica-01-esquemas-y-taxonomias|Práctica 01]]: lo que allá era *"qué información tiene el atacante"*, acá es *un juego con una probabilidad de ganar*. Ver [[modelos-de-ataque|Modelos de ataque]].

---

## El puente que la filmina no dibuja: el secreto perfecto como caso límite

**El [[secreto-perfecto|secreto perfecto]] es el juego `Eav` con $\varepsilon = 0$**, no otra cosa. Todo lo que vino después del [[one-time-pad#Más allá del OTP|resultado de reducibilidad al OTP]] es un solo cambio: mover el $\varepsilon$ de *cero* a *despreciable*. Es el enunciado con el que se responde *"¿qué relación hay entre secreto perfecto e indistinguibilidad?"*, y es también la herramienta del [[guia-02-criptografia-simetrica#Ejercicio 4|Ej. 4 de la Guía 2]], que contesta una pregunta de secreto perfecto usando `Eav`.

> [!quote]- De la transcripción — de dónde sale esa igualdad, y el docente subiéndola a definición (cues pt1 393-405)
> Un alumno pregunta: *"¿qué tan chico tiene que ser el épsilon para que se pueda decir que es indistinguible?"* La respuesta: *"la palabrita que se usa es **negligible** (…) es un valor que, si querés, en el límite va a 0 (…) no, no hay un valor fijo, depende un montón; depende del algoritmo, del problema en sí"*. Y el motivo por el que no puede ser $0$: *"vos sabés que hay información, porque en definitiva **no es independiente**"*.
>
> Entonces otro alumno cierra el razonamiento: *"si tuvieras un épsilon exactamente 0, tendrías secreto perfecto"*. El docente confirma y lo sube a definición (cue pt1 403): ***"otra de las definiciones de secreto perfecto es cuando esto da 0,5 exacto"***.

**La equivalencia vale para `Eav`, no para `Mul` ni para `CPA`.** El [[one-time-pad|OTP]] trae condiciones extra —clave de un solo uso, del largo del mensaje— que un adversario con oráculo o con múltiples cifrados viola de entrada, así que **el OTP no pasa `CPA`**: dada la clave es determinístico, y esa clave no se puede reusar. El criptosistema más fuerte del curso falla la prueba más exigente, y eso no es una contradicción sino dos preguntas distintas — es lo que [[estado-de-un-criptosistema#Un criptosistema puede ser seguro y estar quebrado al mismo tiempo|estado de un criptosistema]] nombra como *seguro y quebrado al mismo tiempo*. *(Lectura nuestra, pero se sigue de lo citado.)*

> [!quote]- De la transcripción — el asterisco: el secreto perfecto vale sólo del lado de la confidencialidad (cues pt1 406-411)
> *"Van a ver que hay una trampita (…) el secreto perfecto es secreto perfecto **desde el punto de vista de la confidencialidad**, pero las condiciones que le vamos a ir dando al atacante hacen que después no tenga sentido, porque al final te puede hacer cosas que rompen el secreto perfecto."*

---

## Cómo se escribe la respuesta: el aviso de la clase sobre el parcial

Es el aviso más explícito de toda la Clase 02 sobre qué se evalúa, y no está en ninguna filmina. Lo que se corrige acá es **el procedimiento**, no la idea.

En un ejercicio de estos, escribir *"el atacante xorea los dos criptogramas y ya sabe"* vale poco aunque la idea esté bien. Lo que se pide es la **estructura completa del experimento**:

1. quién es $A$ y quién es $\Pi$;
2. qué mensajes elige $A$ **y por qué**;
3. qué recibe;
4. cuál es la **regla de decisión** con la que emite $b'$;
5. la **cuenta de $\Pr[\text{experimento} = 1]$** que muestra que se aparta de $0{,}5$ en algo no despreciable.

*(Lectura nuestra, pero se sigue directo de lo citado.)* Como plantilla, la solución de `Mul` que la filmina desarrolla está abajo, en los [[#Los dos ejercicios de la clase|dos ejercicios de la clase]].

> [!quote]- De la transcripción — qué se evalúa en el parcial: el procedimiento formal, paso por paso (cues pt1 483-487)
> *"Una cosa súper importante de esto, tanto para el parcial —en el final aparece menos, pero **sobre todo para el parcial y el recuperatorio**— (…) Este es un procedimiento que apunta a **dar formalismo a algo que normalmente no lo tiene**, y lo poderoso de esto es el formalismo. Por lo tanto, cuando lo tengan que hacer, es importante que **hagan los pasos, que establezcan bien los pasos, qué es cada componente**, y busquen hacer la demostración lo más formal posible. (…) **Más que el conocimiento en sí, acá la fortaleza está en establecer un procedimiento formal.**"*

---

## Propiedades de CPA

Las tres que enuncia la filmina:

**1. Un criptosistema determinístico no puede ser CPA-Secure.**

> **La demostración, en tres líneas** *(desarrollo nuestro; la filmina lo afirma sin probarlo).* $A$ pide al oráculo $c^{*} = f(m_0)$. Después emite $(m_{0}, m_{1})$ con $m_{0} \ne m_{1}$ y recibe $c$. Si `Enc` es determinística, $c = c^{*}$ **exactamente cuando $b = 0$**. $A$ responde $b' = 0$ si $c = c^{*}$ y $b' = 1$ si no. Gana con **probabilidad 1**. No hay nada que ajustar: el determinismo entrega el juego entero.

**2. Si un criptosistema es CPA-Secure para un mensaje, también lo es para múltiples.**

> Esta es la propiedad valiosa, y la asimetría que hay que tener presente para el parcial: **con `Eav` esto NO vale** — un cifrado de flujo pasa `Eav` con un mensaje y falla `Mul` con dos. Con `CPA` la extensión es gratis, y la razón intuitiva es que el oráculo ya le daba al adversario todos los cifrados que quisiera: agregarle más criptogramas no le suma poder.

**3. Un CPA-Secure de tamaño limitado se puede extender arbitrariamente.**

Si $\Pi$ cifra mensajes de hasta $n$ bits, para $m = m_0 \,\Vert\, m_1 \,\Vert\, \dots \,\Vert\, m_i$ (con $\lvert m_j\rvert = n$):

$$\mathsf{Enc}_k(m) = \mathsf{Enc}_k(m_0) \,\|\, \mathsf{Enc}_k(m_1) \,\|\, \dots \,\|\, \mathsf{Enc}_k(m_i)$$

> **Ojo con el alcance de (3).** *(lectura nuestra.)* Que se pueda partir y concatenar **no** significa que cualquier primitiva sirva: hace falta que $\Pi$ ya sea CPA-Secure, o sea **probabilístico**. Aplicar esta receta a una primitiva determinística es exactamente el modo [[modos-de-encadenamiento|ECB]] — y ECB no es CPA-Secure. La propiedad (3) y la (1) leídas juntas son la justificación completa de por qué hacen falta los **modos de encadenamiento**.

> [!quote]- De la transcripción — la justificación de (3), en voz (cues pt1 677-681)
> *"Se puede dividir como si fuesen mensajes adicionales y hacer encriptaciones múltiples de cada uno de los mensajes, con la seguridad dada por `CPA-Secure` de que no se va a poder extraer información del mensaje original mediante el xoreo de los ciphertexts en sí mismos."*

---

## Los dos ejercicios de la clase

### Ejercicio 1: si G se distingue, el flujo no pasa EAV

**Enunciado.** *Demostrar que si es posible distinguir $G(\cdot)$ de una secuencia aleatoria, un criptosistema de flujo basado en $G$ no pasa la prueba EAV.*

**Resolución** *(desarrollo nuestro — la filmina deja el ejercicio abierto).*

Supongamos que existe un distinguidor $D$ con ventaja no despreciable:

$$\delta = \Big|\,P\big(D(G(k)) = 1\big) - P\big(D(r^n) = 1\big)\,\Big|$$

Construimos un adversario $A$ para `Eav` sobre $\Pi:\ e_k(m) = G(k) \oplus m$:

1. $A$ elige **$m_0 = 0^{n}$** y **$m_{1} = r$**, con $r$ **uniforme, elegido por $A$**. *(Legal: la filmina dice que $A$ genera los mensajes "arbitrariamente", y $A$ es probabilístico.)*
2. $A$ recibe $c = G(k) \oplus m_b$.
3. $A$ corre $D(c)$ y responde $b' = 0$ si $D$ dice "pseudoaleatorio" ($D = 1$), y $b' = 1$ si no.

**Por qué funciona.** El truco está en el paso 1:

| Caso | Qué recibe el adversario |
|---|---|
| Si $b = 0$ | $c = G(k) \oplus 0^{n} = G(k)$ → $c$ se distribuye **como la salida del generador** |
| Si $b = 1$ | $c = G(k) \oplus r$ con $r$ uniforme e independiente → $c$ es **uniforme sobre $\{0,1\}^{n}$** |

O sea: $A$ le pasa a $D$ exactamente las dos distribuciones que $D$ sabe separar. Entonces

$$P[\mathsf{Eav}_{A,\Pi} = 1] = \tfrac12 P\big(D(G(k)){=}1\big) + \tfrac12\Big(1 - P\big(D(r^n){=}1\big)\Big) = \tfrac12 + \tfrac{\delta}{2}$$

Como $\delta$ no es despreciable, $\delta/2$ tampoco: **$\Pi$ no pasa `Eav`**. ∎

> **La idea reutilizable:** xorear con un $r$ uniforme **borra** cualquier estructura. Es el mismo hecho que hace funcionar al [[one-time-pad|OTP]], usado acá para fabricar una de las dos distribuciones del distinguidor.

### Ejercicio 2: atacar un cifrado de flujo bajo Mul

**Enunciado.** Los criptosistemas de flujo no son seguros bajo múltiples cifrados, porque $c_{1} \oplus c_{2} = m_{1} \oplus m_{2}$. *Definir un ataque que gane la prueba MUL.*

**Solución de la filmina:**

$$\begin{aligned}
A &\to (m_{00} = 0\dots0,\ m_{01} = 0\dots0)\ ,\ (m_{10} = 0\dots0,\ m_{11} = 1\dots1)\\
A &\text{ obtiene } c_1, c_2\\
X &= c_1 \oplus c_2 = m_1 \oplus m_2\\
&\quad \text{si } X = 0\dots0 \quad\to\quad b' = 0\\
&\quad \text{si no} \qquad\qquad\ \, \to\quad b' = 1
\end{aligned}$$

**Por qué gana siempre.** El keystream $G(k)$ es el mismo en los dos cifrados, así que se cancela y $X$ es el xor de los **dos mensajes que efectivamente se cifraron**:

- Si $b = 0$ se cifró el primer par: $X = 0\dots 0 \oplus 0\dots 0 = 0\dots 0$.
- Si $b = 1$ se cifró el segundo: $X = 0\dots 0 \oplus 1\dots 1 = 1\dots 1 \ne 0\dots 0$.

$A$ acierta con **probabilidad 1**. El adversario nunca necesitó descifrar nada: le alcanzó con que la **relación** entre los dos criptogramas sobreviviera al cifrado.

> **La generalización que saca la clase**, y que es lo importante: *"Si una función de cifrado es determinística, NO es segura bajo múltiples cifrados. El adversario anterior aplica a cualquier criptosistema donde $e_k(x)$ es constante."* → de ahí sale la [[cifrado-probabilistico-nonce-e-iv|necesidad de cifrado probabilístico]].
