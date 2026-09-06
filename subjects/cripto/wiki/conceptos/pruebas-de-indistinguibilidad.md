---
title: Pruebas de indistinguibilidad
resumen: 'Los juegos Eav, Mul y CPA con los que se mide la seguridad de un criptosistema: el adversario gana si acierta cuál de dos mensajes se cifró, y se exige que no supere al azar salvo por un margen despreciable.'
fuentes: ["[[clase-02-cifrado]]", "[[seguridad-computacional]]"]
aliases: [Pruebas de indistinguibilidad, Prueba de seguridad, EAV, Eavesdropping indistinguishability, Múltiples cifrados, Mul, CPA-Secure, Indistinguibilidad]
type: concepto
unidad: 1
clase: 2
orden: 5
created: 2026-08-21
updated: 2026-08-24
tags: [criptografia, indistinguibilidad, eav, cpa, seguridad-computacional, juegos, clase-02]
sources: [Clase 02 - Criptografia - Cifrado.pdf]
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

> **Si alguno de estos símbolos no te cierra.** El nombre largo $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$ con el que Katz escribe el mismo juego está desarmado pieza por pieza en [[notacion-y-terminologia#7. Los experimentos, desarmados|notación y terminología § Los experimentos, desarmados]], junto con el $\mathrm{PPT}$ del adversario y el $\varepsilon(n)$ despreciable. Y la flecha del paso 2 —la que marca que ahí se **sortea** en vez de calcular, y de donde sale el $b \leftarrow \{0,1\}$ del bit oculto— está en [[notacion-y-terminologia#4. Asignación y azar|§ Asignación y azar]].

> **Cómo leer el "$= 0{,}5 + \varepsilon$" de las filminas.** *(precisión nuestra.)* Las tres filminas escriben *"Si $\Pr[\text{prueba} = 1] = 0{,}5 + \varepsilon$ ⟹ $\Pi$ es indisting."*. Leído literalmente pediría una igualdad exacta; lo que se quiere decir es **$\Pr[\text{prueba} = 1] \le 1/2 + \varepsilon(n)$ para todo adversario PPT, con $\varepsilon$ despreciable**. Los dos cuantificadores que la taquigrafía se come son los importantes: **para todo $A$** y **$\varepsilon$ despreciable en $n$**.

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

## Ver también

- [[seguridad-computacional|Seguridad computacional]] — el marco donde estas pruebas tienen sentido
- [[modelos-de-ataque|Modelos de ataque]] — la versión informal (COA/KPA/CPA/CCA) de la [[practica-01-esquemas-y-taxonomias|Práctica 01]]
- [[criptosistema-de-flujo|Criptosistema de flujo]] — pasa `Eav`, falla `Mul`
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — la reparación
- [[modos-de-encadenamiento|Modos de encadenamiento]] — cuáles son CPA-Secure y bajo qué condición
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — *"seguro y quebrado al mismo tiempo"* depende de cuál prueba
- [[notacion-y-terminologia|Notación y terminología]] — qué es cada pieza de $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$, y de dónde sale el $b \leftarrow \{0,1\}$ del bit oculto
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
- Katz & Lindell cap. 3 ([[bibliografia|bibliografía]])
