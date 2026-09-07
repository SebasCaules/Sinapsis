---
title: Secreto perfecto
resumen: 'Noción incondicional de seguridad: ver el criptograma no cambia lo que el adversario cree del mensaje, ni con cómputo ilimitado. Por el teorema de Shannon exige al menos tantas claves como mensajes.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[probabilidad-y-criptografia]]", "[[clase-02-cifrado]]"]
aliases: [Secreto perfecto, Perfect secrecy, Secrecía perfecta, Seguridad incondicional]
type: concepto
unidad: 1
clase: 1
orden: 11
created: 2026-08-10
updated: 2026-09-06
tags: [criptografia, seguridad, secreto-perfecto, shannon, one-time-pad, clase-01, clase-02, transcripcion]
sources: [Clase 01, probabilidad y criptografia.pdf, Clase 02 - Criptografia - Cifrado.pdf, "raw/clases/Clase 02pt1-Transcripcion.VTT"]
---

# Secreto perfecto

La formalización de la [[criptosistema#Seguridad (informal)|noción informal de seguridad]]: "el cifrado no revela **nada** sobre el mensaje".

![Definición de secreto perfecto](../../assets/Pasted%20image%2020260806184448.png)

---

## Definición

Dado un criptosistema $(\mathsf{Gen}, e, d)$, posee **secreto perfecto** si para toda distribución de probabilidades en $M$, cada mensaje $m \in M$ y cada mensaje cifrado $c \in C$ tal que $\Pr[C = c] > 0$:

$$\Pr[M = m \mid C = c] = \Pr[M = m]$$

> **Lectura:** observar el criptograma **no cambia** lo que el adversario cree sobre el mensaje. La distribución a posteriori es idéntica a la a priori — el cifrado no le aportó **ni un bit** de información.

Nótese que la definición no dice nada sobre el poder de cómputo del adversario: el secreto perfecto es **incondicional**. Ni con tiempo infinito se puede hacer mejor que adivinar.

### La paradoja del secreto perfecto

La [[clase-02-cifrado|Clase 02]] repasa esta definición y le agrega un recuadro:

> Notar que $c = e_k(m)$, así que las variables aleatorias discretas $C$ y $M$ son **dependientes**. Sin embargo, la propiedad de secreto perfecto interpretada probabilísticamente dice que son **independientes**.

> **Se resuelve mirando la tercera variable.** *(lectura nuestra.)* $C$ no es función de $M$ sola sino **del par $(M, K)$**. Con $K$ fija, $M$ y $C$ serían dependientes —y el criptograma revelaría todo—; con $K$ uniforme e independiente de $M$, la dependencia se disuelve. **El secreto perfecto es precisamente la afirmación de que la clave aporta tanta incertidumbre como la que el mensaje podría filtrar**, y por eso cuesta $\lvert K\rvert \ge \lvert M\rvert$.
>
> **Errata de la filmina:** escribe *"las V.A.D.s **C** y **E**"*; por el contexto, $E$ es un tipeo por $M$. En la transcripción el docente lee la filmina diciendo *"el valor de $C$ surge de aplicar un método de encriptación al mensaje $M$"* (cue pt1 64).

> [!quote]- De la transcripción — la clave es la que ata la dependencia (cues pt1 63-66, 163-166)
> *"La clave está justamente en que, probabilísticamente, esa dependencia se logra a partir del conocimiento del $K$. Y si $K$ no se conoce, no existe."*
>
> Al explicar por qué la clave debe ser uniforme lo reformula: ***"la clave es la que ata la dependencia"***, y si no es uniforme *"no sirve para romper esa dependencia natural que hay entre…"* [el criptograma y el mensaje]. *(El cierre de la última frase está degradado en el ASR y es reconstrucción nuestra; el sentido es inequívoco por el contexto.)*

> [!quote]- De la transcripción — la definición traducida por un alumno, y validada (cues pt1 46-62)
> Juan Ignacio Causse la traduce y el docente la valida: *"$M$ y $C$ son variables aleatorias independientes (…) la probabilidad de obtener el mensaje no cambia si vos tenés la posibilidad de ver o no ver el mensaje cifrado"*.
>
> El docente le pone la imagen operativa: *"el hecho de conocer $C$ no aporta nada de información, es cero. **Es lo mismo saberlo que no saberlo**"* — da igual que el criptograma viaje por la red y alguien lo levante con Wireshark.
>
> De ahí el salto a teoría de la información (cue pt1 57), que la wiki desarrolla en [[teoria-de-la-informacion#8. El puente con criptografía|Teoría de la información § El puente con criptografía]] —entropía, información mutua y esta misma frase escrita $I(M;C) = 0$— y, con las cuentas de Bayes, en [[probabilidad-y-criptografia|Probabilidad y criptografía]].

> **La condición de soporte, enunciada en voz.** Al leer la definición el docente glosa el $\Pr[C = c] > 0$: cada criptograma $c$ *"tal que la probabilidad de ese $c$ es positiva, es decir, que es un cifrado que puede aparecer"* (cues pt1 34-36). Es lo que hace que la condicional esté bien definida.

### Caracterización equivalente

$$\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c] \quad \forall m, m' \in \mathcal{M},\ \forall c \in \mathcal{C}, \quad K \leftarrow \mathsf{Gen}()$$

Es decir: **la distribución del texto cifrado es la misma cualquiera sea el mensaje**. Esta versión suele ser más cómoda para demostrar, porque elimina el condicionamiento y la distribución sobre $M$.

### ¿De dónde salen esas probabilidades?

Las dos condiciones de arriba se enuncian sobre distribuciones en $M$ y $K$ que la definición de criptosistema **no** provee: hay que agregarlas. Ese es el [[modelo-probabilistico-de-un-criptosistema|modelo probabilístico de un criptosistema]], donde $\Pr[M = x]$ y $\Pr[K = k]$ son datos independientes entre sí y todo lo demás se deriva. La fórmula operativa —la que se usa para verificar a mano si hay secreto perfecto— es:

$$\Pr[C = y \mid M = x] = \sum_{k\ :\ x\, =\, \mathsf{Dec}_k(y)} \Pr[K = k]$$

Se suman las claves que descifran $y$ como $x$. Con eso, chequear secreto perfecto es mecánico: comparar $\Pr[C = y \mid M = x]$ contra $\Pr[C = y]$ para todo par $(x, y)$ (o, vía Bayes, la a posteriori contra la a priori). En [[probabilidad-y-criptografia|probabilidad y criptografía]] están los dos ejemplos numéricos completos: uno que cumple y uno que no.

## Teorema de Shannon (cota de claves)

$$\text{Secreto perfecto} \implies \lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$$

Es una cota de conteo: si hubiera menos claves que mensajes, algún $c$ no sería alcanzable desde algún $m$, y ese $c$ descartaría ese $m$ — filtrando información. **Es la razón por la que el secreto perfecto es tan caro en la práctica: la clave tiene que ser al menos tan larga como todo lo que se vaya a cifrar.**

> **La implicación va en un solo sentido: $\lvert K\rvert \ge \lvert M\rvert$ es necesario pero NO suficiente.** El Ejemplo 2 de [[probabilidad-y-criptografia|probabilidad y criptografía]] tiene $\lvert K\rvert = 3 \ge \lvert M\rvert = 2$ y **no** tiene secreto perfecto: observar $C = 4$ deja $\Pr[M = b \mid C = 4] = 1$, es decir el criptograma determina el mensaje. Lo que falla no es el conteo sino **cómo están repartidas** las claves entre los criptogramas.

Es el mismo patrón que con la [[ataque-de-fuerza-bruta|fuerza bruta]] —*espacio de claves grande ≠ seguro*—, sólo que acá la condición de conteo es la que sí se demuestra necesaria.

> **El teorema tiene una versión más fuerte, en entropía: $H(K) \ge H(M)$.** El conteo trata a todas las claves por igual; la entropía las **pesa** con su probabilidad, y por eso detecta un sesgo de `Gen()` que $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ no ve: un espacio de $2^{128}$ claves cumple el conteo y puede violar la entropía. La traducción del teorema al vocabulario de Shannon —con la demostración en cuatro renglones vía regla de la cadena, y la cota de conteo saliendo como **caso particular** cuando los mensajes son equiprobables— está en [[teoria-de-la-informacion#8. El puente con criptografía|Teoría de la información]]. **Que sea más fuerte no la vuelve suficiente:** ahí mismo hay un ejemplo donde $H(K) \ge H(M)$ se cumple y tampoco hay secreto perfecto.

---

## Aplicación: ¿cuándo es perfecto el cifrado por rotación?

> Con $M = C = \Sigma^{\ell}$, el [[cifrado-por-rotacion|cifrado por rotación]] es perfectamente secreto **si y sólo si $\ell = 1$**.

**(⇐ $\ell = 1$)** Para $m, c \in \mathbb{Z}_n$ existe **exactamente una** clave que lleva $m$ a $c$: $k = (c - m) \bmod n$. Luego

$$\Pr[\mathsf{Enc}_K(m) = c] = \Pr[K = (c-m) \bmod n] = 1/n$$

valor independiente de $m$. Por la caracterización, hay secreto perfecto. Es el **one-time pad** sobre el grupo $(\mathbb{Z}_n, +)$; la tabla de cifrado es un **cuadrado latino**.

**(⇒ $\ell \ge 2$)** Dos argumentos, cualquiera alcanza:

- *Conteo (Shannon).* Se exige $\lvert K\rvert \ge \lvert M\rvert$, pero acá $\lvert K\rvert = n < n^\ell = \lvert M\rvert$.
- *Explícito.* Tomar $m = \texttt{AA}\dots$ (dos primeras letras iguales) y $m'$ con las dos primeras distintas, y un $c$ con $c_{1} \ne c_{2}$. Como $\mathsf{Enc}_k$ preserva igualdades posicionales, $\Pr[\mathsf{Enc}_K(m) = c] = 0$ mientras que $\Pr[\mathsf{Enc}_K(m') = c] > 0$. Luego no hay secreto perfecto.

El segundo argumento señala **exactamente cuál es la fuga**: la preservación del patrón de repeticiones — la misma que habilita el [[criptoanalisis-por-frecuencias|criptoanálisis por frecuencias]].

---

## Conexión con el límite de la fuerza bruta

La pregunta de las filminas *"con ROT-X, ¿cuál es el mensaje original $p$ si $e(\texttt{p}) = \texttt{a}$?"* es el caso $\ell = 1$: la [[ataque-de-fuerza-bruta|fuerza bruta]] produce $n$ candidatos **todos igualmente válidos**. No es que el ataque sea caro — es que la información no está ahí. Ese es el contenido del secreto perfecto.

---

## Dónde sigue: la Clase 02

El secreto perfecto no se abandona por falso sino **por caro**. La [[clase-02-cifrado|Clase 02]] cierra el tema en tres pasos:

1. **Existe un esquema que lo alcanza**: el [[one-time-pad|One Time Pad]], con demostración completa.
2. **Y es esencialmente el único**: *cualquier criptosistema con secreto perfecto es reducible al OTP*, y lo que no es reducible al OTP no lo tiene. O sea que las tres malas noticias del OTP —clave larga, sin reuso, estrictamente aleatoria— **no son un defecto de esa construcción sino del concepto**.
3. **Por eso hay que cambiar la definición** → [[seguridad-computacional|seguridad computacional]]: limitar los escenarios (adversarios PPT) y limitar las garantías (probabilidad de éxito despreciable).

Esa es la línea divisoria de la materia: de acá en adelante nada tiene secreto perfecto, y "seguro" pasa a significar *"pasa tal [[pruebas-de-indistinguibilidad|prueba de indistinguibilidad]]"*.
