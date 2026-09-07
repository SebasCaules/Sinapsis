---
title: PKCS#1 y tamaño de claves
resumen: 'El padding aleatorio de PKCS#1 v1.5 que vuelve probabilístico el cifrado RSA: su formato byte a byte, por qué alcanza para ser CPA-Secure pero no CCA-Secure, y la escala de un módulo de 2048 bits.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[rsa]]", "[[criptosistema-asimetrico]]", "[[parciales-viejos]]"]
aliases: [PKCS#1, PKCS#1 v1.5, PKCS1v1.5, Padding aleatorio de RSA, Tamaño de claves RSA, RSA-2048]
type: concepto
unidad: 1
clase: 4
orden: 7
created: 2026-09-04
updated: 2026-09-06
tags: [criptografia, criptografia-asimetrica, rsa, pkcs1, padding, cca-secure, tamano-de-claves, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# PKCS#1 y tamaño de claves

**Cómo se arregla el determinismo de `RSA` con un padding aleatorio, hasta qué nivel de seguridad llega esa solución (`CPA` sí, `CCA` no) y qué tamaño de módulo hace falta hoy para que `RSA` sea razonable.**

> Filminas **27-28** del PDF de teoría de la Clase 04. La clase todavía no se dictó (hoy es 04/09/2026): esta nota está escrita contra el PDF de filminas, Katz & Lindell y lecturas propias rotuladas, sin ningún aporte de la voz del docente.

## El problema que resuelve

[[rsa|RSA]] *textbook*, tal cual $\mathsf{Enc}_{pk}(m) \equiv m^{e} \pmod n$, es determinístico: cifrar dos veces el mismo $m$ con la misma clave pública da siempre el mismo criptograma. Eso alcanza para excluirlo de ser `CPA-Secure` — es exactamente la consecuencia que [[criptosistema-asimetrico|Criptosistema asimétrico]] deriva de la prueba `Eav`: **ser indistinguible ante un adversario pasivo exige cifrado no determinístico**, porque cualquiera que conozca $pk$ puede cifrar $m_0$ y $m_1$ por su cuenta y comparar contra el criptograma recibido. `PKCS#1 v1.5` (RSA Labs, *Public Key Cryptography Standard* #1) resuelve exactamente ese problema: convierte $m$ en un mensaje $m'$ más largo, con relleno aleatorio, antes de aplicarle la exponenciación modular de `RSA`.

## La construcción del padding

Sea $k$ la longitud de $n$ en bytes y $D$ la longitud de $m$ en bytes. Solo se permite paddear mensajes de hasta $k-11$ bytes. El mensaje paddeado es

$$m' = \texttt{00000000} \;\Vert\; \texttt{00000010} \;\Vert\; r \;\Vert\; \texttt{00000000} \;\Vert\; m$$

con $r$ una cadena de $k - D - 3$ bytes **aleatorios y distintos de cero**. Tres campos fijos explican el $-3$: el byte $\texttt{00000000}$ inicial, el byte $\texttt{00000010}$ que identifica esta variante del estándar (hay otra, para firma, con $\texttt{00000001}$ en esa posición — no desarrollada en esta filmina *(precisión nuestra, del estándar PKCS#1)*), y el byte $\texttt{00000000}$ que separa $r$ de $m$. De ahí sale también el límite de $k-11$ bytes para $m$: si $D = k-11$, entonces $r$ mide $k-D-3 = 8$ bytes, el mínimo que el estándar exige para el relleno *(precisión nuestra, del estándar PKCS#1)*.

Con $m'$ armado, el cifrado es el `RSA` de siempre: $\mathsf{Enc}_{pk}(m) = (m')^{e} \bmod n$.

## Por qué r no puede tener bytes en cero

$r$ tiene que ser distinto de cero **byte a byte**, y la razón es puramente de análisis sintáctico. El descifrado recupera $m'$ y tiene que separar $r$ de $m$ buscando el primer byte $\texttt{00000000}$ después del prefijo fijo. Si $r$ pudiera contener un byte $\texttt{00}$, ese byte se confundiría con el separador: el despaddeo cortaría ahí, se quedaría con un $r$ más corto que el real y devolvería como mensaje la cola de $r$ pegada a $m$. La condición "$r \neq 0$ byte a byte" no es una preferencia de seguridad — es lo que hace que el formato sea **parseable sin ambigüedad**.

## Errata de la filmina: n en vez de k

> **Errata de la filmina:** en la filmina 27, el límite de tamaño del mensaje se escribe como *"solo se permiten cifrar mensajes de hasta n-11 bytes"* — con $n$, no con $k$. Un bullet antes, la misma lámina define $k$ como *"la longitud de $n$ en bytes"*, y $n$ es el módulo de `RSA`, un número de cientos de dígitos, no algo que se mida en bytes restándole 11. La variable correcta es $k$: el límite es $k-11$ bytes, y así se usa consistentemente en la fórmula de $m'$ dos bullets después, que sí trabaja con $k$, $D$ y $r=k-D-3$. Verificado sobre la página renderizada a 150 dpi: el glifo es una "n" minúscula compuesta igual que el resto de la línea, no un aplanado de `pdftotext`. Arriba va escrito ya corregido.

## CPA sí, CCA no

La propia filmina lo dice sin vueltas: *"Se cree que es `CPA-Secure`. Pero se encontraron ataques que muestran que no es `CCA-Secure`."*

**Esta filmina revierte —no solo cierra— una conclusión que el vault ya traía en sentido contrario.** [[parciales-viejos#Discrepancias con el apunte|Parciales viejos]] no dejaba el punto neutralmente abierto: traía una conclusión tentativa específica, rotulada *"precisión nuestra"* y marcada a propósito para contrastarla cuando esta clase existiera, y esa conclusión iba en sentido **opuesto** al de la filmina — sostenía que el padding de `RSA` "sí apunta a `CCA`" y que la sentencia del examen 2C-2025 (*"el padding aleatorio en RSA es para que sea seguro ante texto cifrado elegido"*) era "defendible como verdadera". La cátedra dice lo contrario: confirma que la corrección del apunte del estudiante —*"es para que sea `CPA-Secure`"*— es la que coincide con la filmina, y que la sentencia de examen es **falsa**, sin matices.

**Qué parte del argumento viejo sobrevive.** El razonamiento de [[parciales-viejos#Discrepancias con el apunte|Parciales viejos]] se apoyaba en `RSA-OAEP`, que efectivamente se diseñó para `IND-CCA2`; eso sigue siendo cierto **en general**, pero `RSA-OAEP` no es el esquema que describe esta filmina, que es `PKCS#1 v1.5` puro. El ataque de Bleichenbacher contra `PKCS#1 v1.5` es, precisamente, un ataque de texto cifrado elegido que explota que este esquema **no** es `CCA-Secure` — o sea, el mismo ejemplo que se citaba a favor de la conjetura es el que la desmiente.

**Por qué no llega a CCA** *(lectura nuestra, no desarrollada en la filmina)*. La razón general es conocida y vale la pena tenerla para el parcial: `PKCS#1 v1.5` no valida la estructura del padding de forma que no filtre información. Un servidor que responde distinto según si un texto cifrado recibido despaddea a un $m'$ bien formado o no —esto se llama un *padding oracle*— le da a un atacante que puede enviar cifrados arbitrarios (exactamente el escenario `CCA`) una señal binaria por cada consulta. El ataque de Bleichenbacher (1998) explota justo eso: usa la maleabilidad multiplicativa de `RSA` —cifrar $c\cdot s^{e} \bmod n$ es cifrar $m\cdot s \bmod n$, sin conocer $m$— para ir acotando el mensaje original consulta a consulta, usando solo la respuesta "padding válido / inválido" del servidor. No hace falta invertir ninguna función: hace falta **una función de descifrado que se deje usar como oráculo**, que es exactamente lo que mide la prueba `CCA` y lo que `PKCS#1 v1.5` no cierra.

## Tamaño de claves

La filmina 28 no da una fórmula: exhibe un módulo `RSA-2048` completo —un número de más de 600 dígitos decimales— como ilustración de escala, sin desarrollarlo más. El punto que dice, sin decirlo en palabras, es que **2048 bits no es un número abstracto**: es un entero de ese tamaño, y factorizarlo —el problema del que depende toda la seguridad de `RSA`— significa lidiar con un número así de grande. Cuánto hace falta exactamente, y por qué el número cambia según el tipo de campo, es el desarrollo de [[costo-del-cifrado-asimetrico|Costo del cifrado asimétrico]].
