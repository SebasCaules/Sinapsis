---
title: Criptosistema de flujo
resumen: 'El One Time Pad con la clave reemplazada por la salida de un generador pseudoaleatorio: la clave es mucho más corta que el mensaje, así que no hay secreto perfecto; pasa Eav si G es pseudoaleatorio y falla Mul por ser determinístico.'
fuentes: ["[[clase-02-cifrado]]", "[[one-time-pad]]", "[[generador-pseudoaleatorio]]"]
aliases: [Criptosistema de flujo, Cifrado de flujo, Stream cipher, Cifrador de flujo]
type: concepto
unidad: 1
clase: 2
orden: 3
created: 2026-08-21
updated: 2026-09-06
tags: [criptografia, flujo, stream-cipher, prg, rc4, salsa20, clase-02, transcripcion]
sources: [Clase 02 - Criptografia - Cifrado.pdf, "raw/clases/Clase 02pt1-Transcripcion.VTT"]
---

# Criptosistema de flujo

La primera construcción de la era [[seguridad-computacional|computacional]]: **el [[one-time-pad|OTP]] con la clave reemplazada por la salida de un [[generador-pseudoaleatorio|generador pseudoaleatorio]]**.

---

## Definición

$$\begin{aligned}
\mathsf{Gen} &: k \leftarrow K\\
\mathsf{Enc} &: e_k(m) = G(k) \oplus m\\
\mathsf{Dec} &: d_k(c) = G(k) \oplus c
\end{aligned}$$

Idéntico al OTP salvo por un detalle que lo cambia todo:

> **La gran diferencia:** $\lvert K\rvert \lll \lvert M\rvert$.
> Por ejemplo: $\lvert K\rvert = 2^{128}$, $\lvert M\rvert = \lvert K\rvert^{128}$.

$G$ **expande**: toma $n$ bits de clave y produce todos los bits de keystream que haga falta. Eso es exactamente lo que resuelve la primera mala noticia del OTP —la clave deja de ser tan larga como el mensaje— y exactamente lo que **le prohíbe** tener secreto perfecto.

> **Por qué no puede ser perfectamente secreto, en una línea.** El [[secreto-perfecto#Teorema de Shannon (cota de claves)|teorema de Shannon]] exige $\lvert K\rvert \ge \lvert M\rvert$, y acá $\lvert K\rvert \lll \lvert M\rvert$ por construcción. No es un descuido: es el precio que se eligió pagar. Lo que se busca no es que el criptograma no revele **nada**, sino que **ningún adversario PPT pueda aprovechar lo que revela**.

> **Sobre el ejemplo de la filmina.** *(Precisión nuestra.)* El exponente de $\lvert M\rvert = \lvert K\rvert^{128}$ da $2^{16384}$, un número sin interpretación natural para un espacio de mensajes. Lo que la filmina quiere decir es que **los mensajes son muchísimo más largos que la clave**, pero el $128$ es arbitrario y no lo justifica.

**La semilla del generador *es* la clave del criptosistema.** Ése es el cambio de vocabulario que hay que registrar: $\lvert K\rvert$ pasa a ser el tamaño de la semilla y no el del mensaje.

> [!quote]- De la transcripción — de dónde sale la clave, ahora (cues pt1 285-291)
> *"Es muy impráctico tener que usar claves nuevas todo el tiempo, entonces puedo tener un generador pseudoaleatorio que me genere las claves (…) con eso voy a tener una especie de clave nueva todo el tiempo."*
>
> Y el punto de vocabulario: ***"el seed se empieza a transformar en una especie de clave"***.

> [!quote]- De la transcripción — el secreto perfecto que se parte, y la tesis de toda la clase (cue pt1 255, 787)
> *"Tomen todo esto como que **se parte el secreto perfecto**, y vamos a ir rompiendo cositas del secreto perfecto, pero tratando de que lo que vamos a ir construyendo sea **como una especie de secreto perfecto**."*
>
> El flujo cambia $k$ por $G(k)$; el nonce recupera *"claves distintas"*; y de los [[modos-de-encadenamiento|modos de bloque]] dice, al llegar a `CFB` (cue pt1 787), que *"se está pareciendo cada vez más a lo que es el mismo OTP"*. **Toda la clase es una sucesión de imitaciones cada vez más baratas del [[one-time-pad|One Time Pad]]**, y el propio docente lo confirma de frente al abrir la segunda fecha.

## Teorema de la clase

> **Si $G(\cdot)$ es un generador pseudoaleatorio, entonces el criptosistema es indistinguible ante observadores.**

O sea: pasa la prueba **`Eav`** de [[pruebas-de-indistinguibilidad|indistinguibilidad]]. Es el ejemplo canónico de cómo se demuestra en criptografía moderna: **por reducción** — la seguridad del criptosistema se apoya enteramente en una propiedad de la primitiva.

La clase deja el recíproco como **ejercicio**: *demostrar que si es posible distinguir $G(\cdot)$ de una secuencia aleatoria, un criptosistema de flujo basado en $G$ no pasa la prueba EAV*. La resolución está en [[pruebas-de-indistinguibilidad#Ejercicio 1: si G se distingue, el flujo no pasa EAV|pruebas de indistinguibilidad]].

---

## El límite: no pasa Mul

Si la misma clave (y por lo tanto el mismo keystream) cifra dos mensajes:

$$\begin{aligned}
c_1 &= m_1 \oplus G(s)\\
c_2 &= m_2 \oplus G(s)\\
\Longrightarrow\quad c_1 \oplus c_2 &= m_1 \oplus m_2
\end{aligned}$$

> *"¿Similar al problema del One Time Pad con reuso de claves? **¡No es casualidad!**"* — la filmina.

Es literalmente el mismo cálculo con $k$ cambiado por $G(s)$. La conclusión general que la clase extrae de acá es más fuerte que el caso particular:

> **Si una función de cifrado es determinística, NO es segura bajo múltiples cifrados.**

**Solución:** volver `Enc` probabilístico agregando un valor que no se repita para una misma clave → [[cifrado-probabilistico-nonce-e-iv|cifrado probabilístico, nonce e IV]].

---

## Funciones G(·) que menciona la clase

La filmina de cierre lista los generadores, **con los cuatro primeros tachados**:

| $G(\cdot)$ | Dónde se usó / usa | Estado en la filmina |
|---|---|---|
| **RC4** | HTTPS, WEP | ~~tachado~~ |
| **CSS** | DVDs | ~~tachado~~ |
| **A5/1, A5/2** | GSM | ~~tachado~~ |
| **E0** | Bluetooth | ~~tachado~~ |
| **Salsa20** | $\{0,1\}^{128\ \text{o}\ 256} \times \{0,1\}^{64} \to \{0,1\}^{n}$, $n = 2^{64}\cdot 2^{9}$ | recomendado |
| **Rabbit** | $\{0,1\}^{128} \times \{0,1\}^{64} \to \{0,1\}^{n}$, $n = 2^{128}$ | recomendado |

Dos cosas para leer en esa tabla:

1. **Los tachados son todos de despliegue masivo.** RC4 estuvo en HTTPS, CSS en todos los DVDs, A5 en toda la telefonía GSM, E0 en Bluetooth. La lista no es de curiosidades académicas: es de cosas que estuvieron en producción durante años y hoy están [[estado-de-un-criptosistema|quebradas]].
2. **Los recomendados tienen un segundo argumento $\{0,1\}^{64}$** — que la filmina señala con una flecha: es el **IV**. La diferencia estructural entre las dos mitades de la tabla es precisamente que los modernos toman IV en la firma de la función.

> **Errata de la filmina:** escribe *"E0 (Bluetooh)"* — es **Bluetooth**.
