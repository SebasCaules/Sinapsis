---
title: Inverso modular
resumen: 'Cuándo existe el inverso multiplicativo módulo m, cuántos hay y cómo se calcula: existe si y solo si a es coprimo con m, se obtiene con Euclides extendido y decide qué claves sirven en un criptosistema.'
fuentes: ["[[clase-02-cifrado]]", "[[teoria-de-numeros]]", "[[video-02-guia-rapida-a-teoria-de-numeros]]", "[[guia-02-criptografia-simetrica]]"]
aliases: [Inverso modular, Inverso multiplicativo, Inversa modular, Inversas modulares, Ecuación lineal de congruencia, Congruencia lineal, Elementos inversibles, Unidades de Zm]
type: concepto
unidad: 1
clase: 2
orden: 15
created: 2026-08-24
updated: 2026-09-04
tags: [criptografia, teoria-de-numeros, inverso-modular, congruencia, euclides, rsa, clase-02, parcial]
sources: [DirtyGuidToNumberTheory.pdf, "Clase 02pt1-Transcripcion.VTT", "Guía Rápida a Teoría de Números (video, mirado)", "Guía 2 Ej. 7"]
---

# Inverso modular

Esta nota trae **cómo dividir en $\mathbb{Z}_m$: cuándo existe $a^{-1}$, cuántos hay, cómo se calcula, y por qué eso decide qué claves sirven en un criptosistema**. Es el destino de las otras dos notas de teoría de números y la operación que sostiene la generación de claves de RSA.

**Qué la distingue de sus vecinas.** [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] muestra que $\mathbb{Z}_m$ sabe sumar y multiplicar **pero no dividir**; [[algoritmo-de-euclides-extendido|Euclides extendido]] da la maquinaria genérica. Esta nota junta las dos cosas: **el inverso modular es el caso $c=1$ de la ecuación diofántica**, y es el único caso que la criptografía usa todo el tiempo.

> **Fuentes.** Apunte manuscrito [`DirtyGuidToNumberTheory.pdf`](../../raw/apuntes/DirtyGuidToNumberTheory.pdf), hoja 2 (secciones *Ecuación lineal de congruencia* e *Inverso modular*) — la [[teoria-de-numeros#Inverso modular|transcripción fiel está en el apunte]] · el video del docente, **ya mirado y volcado** en [[video-02-guia-rapida-a-teoria-de-numeros|video-02]] — donde, contra lo que sugiere el nombre del archivo, el título real es *Guía Rápida a Teoría de Números* · el [[guia-02-criptografia-simetrica|Ej. 7 de la Guía 2]], que es donde el vault lo necesita por primera vez.
>
> Las demostraciones, la tabla completa de inversibles de $\mathbb{Z}_{32}$, la lectura sobre el espacio de claves y el adelanto de RSA son **desarrollo nuestro**, y van rotulados.

---

## 1. Definición

$$a\,\bar{x} \equiv 1 \pmod m$$

Un $\bar{x}$ que cumpla eso es el **inverso multiplicativo de $a$ módulo $m$**, y se anota $a^{-1}$.

*(La barra del manuscrito no es decoración: la incógnita es una **clase** de $\mathbb{Z}_m$, no un entero suelto. Si $x_0$ resuelve, también resuelve $x_0 + m$.)*

> **Cuidado con la notación $\frac{1}{a}$.** El manuscrito cierra la sección escribiendo $\bar{x} = a^{-1}\ (m) = \frac{1}{a}$. Es un **abuso de notación**, no una división: en $\mathbb{Z}_m$ no hay fracciones. $a^{-1}$ es *"el elemento que multiplicado por $a$ da $1$"*, definido por la congruencia y nada más. El inverso de $7$ módulo $32$ es $23$ — no $0{,}142\ldots$, no $1/7$. Escribirlo como recíproco ayuda a la intuición y **arruina** el cálculo si se lo toma en serio.

**Por qué se lo llama "dividir".** Si $a$ tiene inverso, la ecuación $a\bar{x} \equiv b$ se resuelve multiplicando los dos lados por $a^{-1}$, igual que en $\mathbb{R}$. Sin inverso, no hay forma — y ese es exactamente el problema que [[aritmetica-modular-y-divisibilidad#Qué se hereda y qué no|aritmética modular]] deja abierto.

---

## 2. Existencia: si y sólo si a es coprimo con m

> **Teorema.** $a$ tiene inverso módulo $m$ **si y sólo si** $\operatorname{mcd}(a,m) = 1$.

*Demostración.* *(El manuscrito enuncia sólo la implicación que le conviene; las dos direcciones son cortas.)*

- **($\Leftarrow$) Si son coprimos, existe.** Por [[algoritmo-de-euclides-extendido#3. La identidad de Bézout|Bézout]], $\operatorname{mcd}(a,m)=1$ garantiza enteros $x,y$ con
  $$a x + m y = 1$$
  Leído módulo $m$, el término $my$ es múltiplo de $m$ y desaparece:
  $$a x \equiv 1 \pmod m$$
  **Ese $x$ es el inverso.** No hay ningún paso adicional: Bézout *es* el inverso modular, escrito con otras letras.
- **($\Rightarrow$) Si existe, son coprimos.** Si $ax \equiv 1 \pmod m$, entonces $m \mid (ax - 1)$, o sea $ax - 1 = -my$ para algún entero $y$, o sea $ax + my = 1$. Ahora bien, $d = \operatorname{mcd}(a,m)$ divide a $a$ y a $m$, así que por el [[aritmetica-modular-y-divisibilidad#El lemma que sostiene todo lo demás|lemma de combinación lineal]] divide a $ax+my = 1$. El único divisor positivo de $1$ es $1$. $\blacksquare$

**Otra forma de verlo, que es la que importa en criptografía:** *(argumento nuestro)*

$$a \text{ inversible en } \mathbb{Z}_m \iff \big(x \mapsto a\,x \bmod m\big) \text{ es una biyección de } \mathbb{Z}_m$$

- Si $a$ es inversible, multiplicar por $a^{-1}$ deshace la operación: es biyectiva.
- Si no lo es, sea $d = \operatorname{mcd}(a,m) > 1$. Entonces $a\cdot\frac{m}{d} = \frac{a}{d}\cdot m \equiv 0 \pmod m$, con $\frac{m}{d} \not\equiv 0$. O sea que $0$ y $\frac{m}{d}$ **colisionan**: no es inyectiva.

Y "biyectiva" es, palabra por palabra, la [[criptosistema#Condición de corrección|condición de corrección de un criptosistema]]. Volvemos sobre esto en la sección 6.

---

## 3. Unicidad módulo m

> **Teorema.** Si el inverso existe, es **único en $\mathbb{Z}_m$**.

*Demostración.* Supongamos $a x \equiv 1$ y $a x' \equiv 1 \pmod m$. Multiplicando la primera por $x'$:
$$x' \equiv x'(a x) \equiv (x'a)x \equiv x \pmod m$$
usando la asociatividad y que $x'a \equiv 1$. $\blacksquare$

**Por eso tiene sentido decir "el" inverso y escribir $a^{-1}$.** Lo que no es único es el **entero**: $23$, $55$, $-9$ y $87$ son todos inversos de $7$ módulo $32$, porque son el mismo elemento de $\mathbb{Z}_{32}$. Cuando el enunciado pide "el inverso", lo que quiere es el representante en $\{0,\dots,m-1\}$.

> **Consecuencia estructural.** Los elementos inversibles de $\mathbb{Z}_m$ forman un **grupo** con el producto —anotado $\mathbb{Z}_m^{*}$, y llamado el *grupo de unidades*—, con
> $$\lvert \mathbb{Z}_m^{*}\rvert = \varphi(m)$$
> donde $\varphi$ es la [[cuerpos-finitos|función de Euler]]: la cantidad de coprimos con $m$ en el rango $1 \le k \le m$. Cuando $m = p$ es primo, **todos** los no nulos son inversibles y $\mathbb{Z}_p$ pasa de anillo a **cuerpo** — ver [[cuerpos-finitos-y-campos-de-galois|cuerpos finitos]].

---

## 4. La ecuación lineal de congruencia

El inverso es el caso $b=1$ de un problema más general:

$$a\,\bar{x} \equiv b \pmod m$$

### El truco entero del manuscrito, en un renglón

> Una **congruencia** en una incógnita **es** una **ecuación diofántica** en dos incógnitas.

$$a\bar{x} \equiv b \ (m) \;\iff\; m \mid (a\bar{x}-b) \;\iff\; a\bar{x} - b = km \;\iff\; a\bar{x} - k\,m = b$$

Se cambió el $\equiv$ por un $=$ **al precio de una incógnita nueva**, $k$. Y esa última ecuación es exactamente $\alpha x + \beta y = c$ con $\alpha = a$, $\beta = -m$, $y = k$, $c = b$. Todo lo de [[algoritmo-de-euclides-extendido|Euclides extendido]] se aplica sin cambiar nada.

> **Ojo con la letra $b$.** En la diofántica de la hoja 1 del manuscrito, $b$ es un **coeficiente**; en la congruencia de la hoja 2 es el **término independiente**. Es la misma letra haciendo dos papeles, y es la confusión más probable del tema.

### Cuándo hay solución y cuántas

> **Teorema.** Sea $d = \operatorname{mcd}(a,m)$. La congruencia $a\bar{x} \equiv b \pmod m$
> - **no tiene solución** si $d \nmid b$;
> - tiene **exactamente $d$ soluciones distintas en $\mathbb{Z}_m$** si $d \mid b$, y están espaciadas $m/d$.

*Por qué el conteo.* Por la [[algoritmo-de-euclides-extendido#7. La forma general de las soluciones|forma general de las soluciones]], los enteros solución son $x = x_0 + t\,\frac{m}{d}$ con $t \in \mathbb{Z}$. Reduciendo módulo $m$, esa lista se repite cada $d$ pasos ($t$ y $t+d$ dan valores congruentes), así que hay $d$ clases distintas: $x_0,\ x_0+\frac{m}{d},\ \dots,\ x_0+(d-1)\frac{m}{d}$. $\blacksquare$

> **El manuscrito escribe "if" y corresponde "si y sólo si"** — el propio apunte lo había escrito con $\iff$ en la hoja 1. Y **no dice cuántas soluciones hay**, ni cómo obtener el $x_0$ del que depende toda la fórmula. Las dos cosas se completan acá. *(Corrección y desarrollo nuestros.)*

**Esta es la diferencia más grande con una ecuación en $\mathbb{R}$**, y la que más sorprende en un parcial: $a\bar{x}\equiv b$ puede tener **cero, una, o varias** soluciones. Sólo cuando $d=1$ se comporta como uno espera.

### Receta general, en 3 pasos

1. Calcular $d = \operatorname{mcd}(a,m)$ con Euclides. Si $d \nmid b$: **no hay solución**, se termina.
2. Dividir todo por $d$ — congruencia, coeficientes y **módulo**:
   $$\frac{a}{d}\,\bar{x} \equiv \frac{b}{d} \ \Big(\text{mód } \frac{m}{d}\Big)$$
   Ahora $\frac{a}{d} \perp \frac{m}{d}$, así que hay inverso y **una sola** solución $x_0$ módulo $m/d$.
3. **Levantar** a $\mathbb{Z}_m$: las $d$ soluciones son $x_0 + t\,\frac{m}{d}$ para $t=0,\dots,d-1$.

### Ejemplo con varias soluciones: 6x ≡ 4 (mod 10)

1. $\operatorname{mcd}(6,10) = 2$ y $2 \mid 4$ → hay solución, y son **dos**.
2. Dividiendo por $2$: $3\bar{x} \equiv 2 \pmod 5$. Como $3\cdot 2 = 6 \equiv 1 \pmod 5$, el inverso de $3$ es $2$, y $x_0 \equiv 2\cdot 2 = 4 \pmod 5$.
3. Levantando: $x \in \{4,\ 4+5\} = \{4,\ 9\}$ en $\mathbb{Z}_{10}$.

*Verificación:* $6\cdot 4 = 24 \equiv 4$ y $6\cdot 9 = 54 \equiv 4 \pmod{10}$. $\checkmark$

### Ejemplo sin solución: 6x ≡ 3 (mod 10)

$\operatorname{mcd}(6,10)=2$ y $2 \nmid 3$ → **ninguna solución**. Se ve sin teoría: $6x$ es siempre par, y sumarle múltiplos de $10$ no cambia la paridad, así que nunca puede ser $\equiv 3$.

---

## 5. Cómo se calcula: es el caso c = 1

$$\underbrace{a\bar{x} \equiv 1 \pmod m}_{\text{inverso}}
\quad\longleftrightarrow\quad
\underbrace{a x + m y = 1}_{\text{diofántica con } c = 1}$$

**El procedimiento completo, en 4 pasos:**

1. Correr **[[algoritmo-de-euclides-extendido#5. La versión extendida|Euclides extendido]]** sobre $a$ y $m$.
2. Si $d = \operatorname{mcd}(a,m) \ne 1$: **el inverso no existe**. Fin.
3. Si $d = 1$, la identidad de Bézout es $ax + my = 1$. **El coeficiente que acompaña a $a$ es el inverso.**
4. **Reducir módulo $m$** para dejarlo en $\{0,\dots,m-1\}$ — típicamente sale negativo.

### El ejemplo obligatorio: 7^-1 en Z_32

La [[algoritmo-de-euclides-extendido#6. Ejemplo 1: el mcd de 7 y 32|corrida completa está en la nota de Euclides]], con las dos formas (sustitución hacia atrás y tabla). El resultado:

$$2\cdot 32 - 9\cdot 7 = 64 - 63 = 1$$

El coeficiente que acompaña al $7$ es $-9$; reduciendo, $-9 \equiv 23 \pmod{32}$, y la identidad queda en la forma cómoda

$$\boxed{\;23\cdot 7 - 5\cdot 32 = 161 - 160 = 1\;}$$

Leída módulo $32$, el término $-5\cdot 32$ desaparece:

$$7\cdot 23 \equiv 1 \pmod{32} \quad\Longrightarrow\quad \boxed{7^{-1} = 23 \ \text{ en } \mathbb{Z}_{32}}$$

*Verificación directa:* $7\cdot 23 = 161 = 5\cdot 32 + 1$. $\checkmark$

**Y de yapa, la primera fila del descifrado del Ej. 7c**: la congruencia $7\bar{x} \equiv 13 \pmod{32}$ se resuelve multiplicando por el inverso, $x \equiv 23\cdot 13 = 299 = 9\cdot 32 + 11 \equiv 11 \pmod{32}$ — que es exactamente el $Y_1 = 11$ de la [[guia-02-criptografia-simetrica|tabla de descifrado de la guía]].

---

## 6. El ejemplo que importa: Z_32 y el espacio de claves

Este es el contenido del [[guia-02-criptografia-simetrica|Ej. 7a de la Guía 2]], y es donde el tema deja de ser matemática y pasa a ser criptografía.

### Quiénes son los inversibles

$$32 = 2^{5} \quad\Longrightarrow\quad \operatorname{mcd}(a, 32) = 1 \iff a \text{ es impar}$$

porque el **único** primo que divide a $32$ es el $2$: no compartir factores con $32$ es, literalmente, no ser par. Entonces

$$\mathbb{Z}_{32}^{*} = \{1, 3, 5, 7, 9, \dots, 31\}, \qquad \lvert\mathbb{Z}_{32}^{*}\rvert = \varphi(32) = \varphi(2^{5}) = 2^{4}(2-1) = \mathbf{16}$$

**La mitad exacta de $\mathbb{Z}_{32}$ es inversible y la otra mitad no.**

### La tabla completa de inversos

*(Calculada y verificada por nosotros; ninguna fuente del vault la trae. Sirve para chequear a mano cualquier corrida de Euclides módulo 32.)*

| $a$ | 1 | 3 | 5 | **7** | 9 | 11 | 13 | 15 |
|---|---|---|---|---|---|---|---|---|
| $a^{-1}$ | 1 | 11 | 13 | **23** | 25 | 3 | 5 | 15 |

| $a$ | 17 | 19 | 21 | **23** | 25 | 27 | 29 | 31 |
|---|---|---|---|---|---|---|---|---|
| $a^{-1}$ | 17 | 27 | 29 | **7** | 9 | 19 | 21 | 31 |

Tres cosas para leer en la tabla:

- **Es simétrica**: si $a^{-1}=b$ entonces $b^{-1}=a$. Obvio de la definición, pero útil como chequeo.
- Los pares $(7,23)$ y $(23,7)$ confirman la cuenta de arriba en las dos direcciones.
- **Hay cuatro elementos que son su propio inverso**: $1, 15, 17, 31$. Volvemos sobre esto enseguida, porque tiene una consecuencia criptográfica.

### Qué pasa con una clave par

Con $a = 4$: $\operatorname{mcd}(4,32) = 4 \ne 1$, así que no hay inverso. Y se ve el daño directamente:

$$4\cdot 3 = 12 \qquad\text{y}\qquad 4\cdot 11 = 44 = 32 + 12 \equiv 12 \pmod{32}$$

**Dos mensajes distintos, el mismo criptograma.** No es que el descifrado sea difícil: es que **no existe**, porque la información se perdió. Es el contraejemplo de la cancelación de la [[aritmetica-modular-y-divisibilidad#Qué se hereda y qué no|nota de aritmética modular]], ahora con nombre criptográfico.

---

## 7. La invertibilidad de la clave es la condición de corrección

*(Lectura nuestra. Ninguna fuente del vault lo dice así, y es la razón por la que este tema está en una materia de criptografía y no sólo en matemática discreta.)*

Se toma la [[primitiva-de-cifrado-en-bloque|primitiva de cifrado en bloque]] del Ej. 7:

$$E(K, M) = (M \cdot K) \bmod n$$

Para que exista $\mathsf{Dec}$, la función $E(K,\cdot)$ tiene que ser **biyectiva** sobre $\mathbb{Z}_n$ — es la [[criptosistema#Condición de corrección|condición de corrección]]. Por la sección 2, eso pasa **si y sólo si $K$ es inversible módulo $n$**. Entonces:

$$\boxed{\ \text{claves usables} \;=\; \mathbb{Z}_n^{*} \;=\; \{\,K : \operatorname{mcd}(K,n)=1\,\}, \qquad \text{y hay } \varphi(n) \ \text{de ellas}\ }$$

**No es una recomendación de seguridad: es una obligación de corrección.** Con una clave no inversible el criptosistema ni siquiera es un criptosistema — falla antes de que aparezca ningún adversario.

### El impacto en el espacio de claves, con números

| | Valor para $n = 32$ |
|---|---|
| Claves **nominales** (lo que entra en 5 bits) | $32 = 2^{5}$ |
| Claves **inversibles** ($\varphi(32)$) | $16 = 2^{4}$ |
| Claves **con efecto** (sacando $K=1$, que es la identidad) | $15$ |
| Bits **efectivos** de clave | $\mathbf{4}$, no 5 |

**La mitad del espacio nominal es basura.** Es el mismo fenómeno que la [[des-y-3des|tabla de erosión de DES]] a otra escala, y la razón por la que *"la clave tiene $n$ bits"* nunca alcanza como respuesta: hay que preguntar cuántas de esas claves **sirven**. Enlaza directo con el [[ataque-de-fuerza-bruta|principio de espacio de claves suficiente]]: necesario, nunca suficiente.

### Un detalle lindo: las claves involutivas

*(Observación nuestra, verificada a mano.)* Los cuatro elementos que son su propio inverso en $\mathbb{Z}_{32}$ —$1, 15, 17, 31$— cumplen $K^2 \equiv 1 \pmod{32}$, y por lo tanto

$$E\big(K, E(K, M)\big) = M\cdot K^{2} \equiv M \pmod{32}$$

**Cifrar dos veces con esa clave devuelve el mensaje original.** O sea: para esas cuatro claves, **cifrar y descifrar son la misma operación**. Es exactamente la definición de **clave débil** del [[guia-02-criptografia-simetrica|Ej. 8 de la Guía 2]], donde se analizan las claves débiles de [[des-y-3des|DES]]. Acá el mecanismo es aritmético en vez de estructural (allá viene del key schedule de Feistel), pero el síntoma es idéntico: $\mathsf{Enc}_K$ es una **involución**, y eso le regala información al adversario.

*Verificación:* $15^2 = 225 = 7\cdot 32 + 1$; $17^2 = 289 = 9\cdot 32 + 1$; $31^2 = 961 = 30\cdot 32 + 1$. $\checkmark$

---

## 8. Adelanto: esto es la generación de claves de RSA

> *(Lectura nuestra, y **adelanto**: RSA corresponde a la Clase 4 — Criptografía asimétrica, 10/09 según el [[cronograma]]—, que **no está ingerida**. Lo que sigue no sale de ninguna fuente del vault: se anota acá porque explica por qué el docente pidió este repaso justo ahora, y hay que **contrastarlo con la clase cuando se dé**.)*

En RSA se eligen dos primos grandes $p, q$, se arma el módulo $n = pq$, se calcula $\varphi(n) = (p-1)(q-1)$ y se elige un exponente público $e$ coprimo con $\varphi(n)$. La **clave privada** es

$$d = e^{-1} \bmod \varphi(n)$$

o sea: **un inverso modular, calculado con Euclides extendido**, exactamente el procedimiento de la sección 5 pero sobre números de miles de bits. Tres cosas de esta nota se cobran ahí enteras:

| Lo que vimos acá | Su papel en RSA |
|---|---|
| El inverso existe $\iff$ $\operatorname{mcd}(e,\varphi(n))=1$ | es **la** condición sobre $e$; por eso $e$ no se puede elegir a dedo |
| Euclides extendido es $O(\log \min)$ | es lo que hace que generar una clave tarde milisegundos y no siglos |
| $\varphi(n)$ es fácil **sólo si se conoce la factorización** | es lo que impide al atacante repetir la cuenta: sin $p$ y $q$ no tiene $\varphi(n)$, y sin $\varphi(n)$ no tiene $d$ |

La tercera fila es el corazón del asunto, y está enunciada en la sección 8 del [[cuerpos-finitos|apunte de cuerpos finitos]]: *"la función de Euler $\varphi(n)$ es sencilla de calcular sólo si $n$ está factorizado"*. **La misma operación que es trivial para quien generó la clave es inviable para quien sólo ve $n$.** Eso es criptografía asimétrica en una oración, y el inverso modular es la pieza que está de los dos lados.

Nótese además la escala: acá el ejercicio pide $7^{-1} \bmod 32$, con $\varphi(32)=16$ claves usables. RSA pide lo mismo con $\varphi(n)$ del orden de $2^{2048}$. **Es literalmente el mismo cálculo**, y por eso vale la pena hacerlo a mano una vez.

---

## 9. Checklist para el parcial

El docente marcó nominalmente *"calcular cuál es el inverso multiplicativo o modularmente de un número"*. Lo que hay que poder hacer sin dudar:

1. **Decidir si existe**: $\operatorname{mcd}(a,m)=1$. Si no, **decirlo** — "no existe" es una respuesta completa y correcta.
2. **Calcularlo** con Euclides extendido, y **reducir a $\{0,\dots,m-1\}$**: el coeficiente sale negativo casi siempre.
3. **Verificar**: $a\cdot a^{-1} \bmod m = 1$. Diez segundos, y detecta todos los errores de signo.
4. **Resolver la congruencia general** $a\bar{x}\equiv b \pmod m$: criterio $\operatorname{mcd}(a,m)\mid b$, dividir todo por $d$, resolver, levantar a $d$ soluciones.
5. **Contar los inversibles**: $\varphi(m)$. Para $m = p^{k}$, $\varphi(p^{k}) = p^{k-1}(p-1)$.
6. **Traducirlo a claves**: en un cifrado multiplicativo módulo $n$, las claves usables son los $\varphi(n)$ inversibles, y eso es corrección, no seguridad.

**Los errores más frecuentes:** dar el coeficiente sin reducir (ej. $-9$ en vez de $23$); confundir cuál de los dos coeficientes de Bézout es el inverso (**es el que multiplica a $a$**, no a $m$); y dar una sola solución cuando $d>1$ y hay $d$.

---

## Sobre la numeración de esta nota

Esta nota lleva `02.15` por la misma razón que [[aritmetica-modular-y-divisibilidad|02.13]] y [[algoritmo-de-euclides-extendido|02.14]]: es la tercera del bloque de teoría de números, que el vault ubica en la Clase 02. La justificación completa —incluido qué renumerar si el tema termina en la Clase 4, que es donde, como muestra la sección 8, se cobra de verdad— está en [[aritmetica-modular-y-divisibilidad#Sobre la numeración de esta nota|Aritmética modular y divisibilidad § Sobre la numeración de esta nota]].
