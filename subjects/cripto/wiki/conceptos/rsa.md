---
title: RSA
resumen: 'El criptosistema asimétrico de exponenciación modular en su versión de libro de texto, con su justificación por Euler-Fermat y los tres problemas que impiden usarlo así: determinismo, mensajes pequeños y módulos repetidos.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[criptosistema-asimetrico]]", "[[grupos-anillos-y-cuerpos]]", "[[pkcs1-y-tamano-de-claves]]"]
aliases: [RSA, Textbook RSA, Rivest Shamir Adleman, Cifrado RSA, Ataque de módulos repetidos]
type: concepto
unidad: 1
clase: 4
orden: 6
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, rsa, textbook-rsa, cifrado-asimetrico, factorizacion, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# RSA

**El criptosistema asimétrico más conocido del curso, en su versión "de libro de texto" — y los tres problemas concretos que hacen que nadie lo use exactamente así en producción.** Es la nota que explica por qué RSA necesita el padding de [[pkcs1-y-tamano-de-claves|PKCS#1]] para ser utilizable, no un capricho de estandarización.

Sale de las filminas **24 a 26** de la Clase 04. Esta clase todavía no se dictó —hoy es 04/09/2026, la clase es el 10/09—, así que la nota está escrita contra el PDF de filminas, más Katz & Lindell y lecturas propias rotuladas; no hay transcripción y por lo tanto ningún callout *De la transcripción*.

## La construcción

$$\begin{aligned}
\mathsf{Gen}&:\ \text{elegir } p,q \text{ primos},\ n = p\cdot q\\
&\quad e \leftarrow (0,\varphi(n)) \mid \gcd(e,\varphi(n))=1\\
&\quad \text{calcular } d \mid e\cdot d \equiv 1 \pmod{\varphi(n)}\\
&\quad pk = (n,e),\ sk = (n,d)\\[4pt]
\mathsf{Enc}_{pk}(m) &\equiv m^{e} \pmod n\\
\mathsf{Dec}_{sk}(c) &\equiv c^{d} \pmod n
\end{aligned}$$

$d$ se calcula con [[algoritmo-de-euclides-extendido|Euclides extendido]], exactamente como el [[inverso-modular|inverso modular]] de $e$ módulo $\varphi(n)$, con $\varphi(n) = (p-1)(q-1)$ — la fórmula de $\varphi$ para dos primos distintos que da [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]].

### Por qué cierra: Euler-Fermat

$\mathsf{Dec}(\mathsf{Enc}(m)) = (m^{e})^{d} = m^{ed} \bmod n$. Como $e \cdot d \equiv 1 \pmod{\varphi(n)}$, existe $k$ tal que $ed = 1 + k\cdot\varphi(n)$, así que

$$m^{ed} = m^{1 + k\varphi(n)} = m \cdot \bigl(m^{\varphi(n)}\bigr)^{k} \equiv m \cdot 1^{k} = m \pmod n$$

usando el teorema de Euler-Fermat, $m^{\varphi(n)} \equiv 1 \pmod n$ para $\gcd(m,n)=1$ — la misma identidad citada sin demostrar en [[grupos-anillos-y-cuerpos|04.02]] y probada en [[cuerpos-finitos-y-campos-de-galois#Función phi de Euler|02.16]]. *(Desarrollo de la demostración: lectura nuestra, la filmina no la incluye.)*

## Los tres problemas de textbook RSA

La filmina 25 los lista sin desarrollarlos; acá van desarrollados.

### 1. Es determinístico

$\mathsf{Enc}_{pk}(m) = m^{e} \bmod n$ da **siempre** el mismo resultado para el mismo $m$ bajo la misma clave — no hay ningún componente aleatorio. Por [[criptosistema-asimetrico|Criptosistema asimétrico]], esto **descalifica automáticamente** a textbook RSA de ser `CPA-Secure`: cualquier adversario que conoce $pk$ puede cifrar $m_0$ y $m_1$ por su cuenta y comparar contra el criptograma recibido, ganando el experimento `Eav` con probabilidad $1$.

### 2. Mensajes (y exponentes) pequeños

Si $m^{e} < n$, la exponenciación **no da vuelta** módulo $n$: el resultado de calcular $m^e$ sobre los enteros ya es menor que el módulo, así que la reducción $\bmod\ n$ no hace nada y

$$c = m^{e} \bmod n = m^{e} \quad \text{(sin reducción)}$$

Recuperar $m$ de ahí no requiere invertir nada módulo $n$: alcanza con calcular la **raíz $e$-ésima entera ordinaria** de $c$ sobre los números enteros —un problema mucho más fácil que invertir RSA en general—. Esto es exactamente lo que hace peligroso usar $e=3$ (histórico, elegido para acelerar el cifrado): con $e$ chico, la condición $m^{e}<n$ se cumple para una fracción mucho mayor de mensajes cortos.

> **Errata de la filmina (25) y precisión, ya señaladas en la [[clase-04-criptografia-asimetrica-y-firma-digital#7. RSA: textbook RSA y sus problemas|Clase 04]].** La filmina escribe la condición como *"me < n"*, sin exponente — la condición correcta es $m^{e} < n$, no $m \cdot e < n$: verificado sobre la página renderizada, no es un aplanado de `pdftotext`, ahí nunca hubo superíndice. Y la propia filmina dice después *"se puede calcular el logaritmo"*: técnicamente **no es un logaritmo sino una raíz $e$-ésima** la que recupera $m$ — el logaritmo discreto es el problema de [[diffie-hellman|Diffie-Hellman]], un problema distinto.

**Ejemplo numérico del ataque** *(lectura nuestra)*. Con $e=3$ y $n$ de $2048$ bits, si $m < n^{1/3}$ (es decir, $m$ cabe en menos de $\sim 683$ bits), entonces $m^{3} < n$ literalmente sobre los enteros, y $c = m^3$ sin reducción: calcular $\sqrt[3]{c}$ con aritmética de precisión arbitraria recupera $m$ exactamente, sin factorizar $n$ ni conocer $d$.

### 3. Módulos repetidos

Si dos pares de claves distintos, $(n,e_1)$ y $(n,e_2)$, **comparten el mismo módulo** $n$ — por ejemplo, porque una implementación reutiliza el mismo $n$ para varios usuarios para ahorrar el costo de generar primos nuevos —, es posible recuperar $n$ a partir de observar suficiente tráfico cifrado, y a partir de $n$, **factorizarlo** en $p\cdot q$ y reconstruir la clave privada de **cualquiera** de los dos pares. El costo de factorizar $n$ es, por diseño, la única barrera de seguridad de RSA; compartir el módulo la tira por la ventana para ambos usuarios a la vez.

*(Nota adicional, lectura nuestra: si además el **mismo mensaje** $m$ se cifra con el mismo $n$ pero exponentes $e_1, e_2$ coprimos hacia dos destinatarios distintos, existe un ataque —de módulo común— que recupera $m$ sin factorizar nada, combinando los dos criptogramas con Bézout sobre $e_1, e_2$; no está en la filmina, se menciona porque es la explotación práctica más directa de este problema.)*

## Ejemplo numérico, verificado

Parámetros muy pequeños, a modo ilustrativo (nunca de tamaño real): $p=2\,357$, $q=2\,551$.

$$n = p\cdot q = 6\,012\,707, \qquad \varphi(n) = (p-1)(q-1) = 6\,007\,800$$

Con $e = 3\,674\,911$ (elegido al azar, coprimo con $\varphi(n)$) y $d = 422\,191$ (obtenido por Euclides extendido):

$$e\cdot d \bmod \varphi(n) = 1 \quad\checkmark$$

Cifrado de $m = 5\,234\,673$:

$$\mathsf{Enc}(m) = 5\,234\,673^{\,3\,674\,911} \bmod 6\,012\,707 = 3\,650\,502$$

Descifrado de $c = 3\,650\,502$:

$$\mathsf{Dec}(c) = 3\,650\,502^{\,422\,191} \bmod 6\,012\,707 = 5\,234\,673 \quad\checkmark$$

Las tres cuentas cierran exactamente como las escribe la filmina — reverificadas acá con aritmética modular en Python (`pow(m, e, n)` y `pow(e, -1, phi)`), no sólo tomadas del PDF.

## Ver también

- [[clase-04-criptografia-asimetrica-y-firma-digital#7. RSA: textbook RSA y sus problemas|Clase 04 — Criptografía asimétrica y firma digital § 7. RSA: textbook RSA y sus problemas]] — la sección de la que sale esta nota, con las erratas de la filmina 25 desarrolladas
- [[criptosistema-asimetrico|Criptosistema asimétrico]] — por qué el determinismo de textbook RSA es fatal para `CPA-Secure`, no cosmético
- [[pkcs1-y-tamano-de-claves|PKCS#1 y tamaño de claves]] — el padding aleatorio que arregla el problema 1 de esta nota
- [[el-gamal|El Gamal]] — el otro criptosistema concreto de la clase, probabilístico por construcción
- [[rsa-signature-y-hashed-rsa|RSA-Signature y Hashed RSA]] — la misma exponenciación modular, invirtiendo el rol de las claves para firmar
- [[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]] — $\varphi(n)$ y el teorema de Euler-Fermat que hacen funcionar `Gen` y `Dec`
- [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]] · [[inverso-modular|Inverso modular]] — cómo se calcula $d$ a partir de $e$
- [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]] — qué tamaño de $n$ hace falta para que factorizarlo sea inviable
- Katz & Lindell, cap. 11 *Public-Key Encryption* — RSA "de libro de texto" y sus limitaciones ([[bibliografia|bibliografía]])
