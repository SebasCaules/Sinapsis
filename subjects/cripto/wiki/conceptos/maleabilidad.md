---
title: Maleabilidad
resumen: 'Propiedad de un criptosistema cuyo criptograma puede transformarse en otro que descifra a un mensaje relacionado de manera controlada, sin conocer el mensaje ni la clave; es el contraejemplo de que ser CPA-Secure no protege la integridad.'
fuentes: ["[[clase-03-macs-y-cifrado-autenticado]]"]
aliases: [Maleabilidad, Malleability, Criptosistema maleable, Modificación quirúrgica, Ataque a la base de sueldos]
type: concepto
unidad: 1
clase: 3
orden: 1
created: 2026-08-28
updated: 2026-08-28
tags: [criptografia, maleabilidad, integridad, flujo, xor, cca, clase-03]
sources: ["Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "Clase 03pt1-Transcripcion.VTT"]
---

# Maleabilidad

**Un criptosistema CPA-Secure no protege la integridad.** Esta nota es el contraejemplo con el que la Clase 03 lo demuestra: un sistema construido con la mejor herramienta que dejó la [[clase-02-cifrado|Clase 02]] y atacado con éxito sin romper ni una sola vez la confidencialidad. De acá salen, en cadena, la prueba [[ataque-de-texto-cifrado-escogido|CCA]], el [[message-authentication-code|MAC]] y el [[cifrado-autenticado|cifrado autenticado]].

---

## Qué es

Un criptosistema es **maleable** cuando un adversario puede transformar un criptograma $c$ de un mensaje $m$ en otro criptograma $c'$ que descifra a un mensaje **relacionado con $m$ de una manera que él controla** — sin conocer $m$ ni la clave $k$.

Las tres cosas que hay que retener del enunciado, porque cada una es un pedazo del ataque:

1. **No hace falta descifrar nada.** El adversario nunca ve $m$.
2. **No hace falta la clave.** El descifrado legítimo lo hace la víctima, con su clave, sobre el criptograma adulterado.
3. **El cambio es controlado.** No es corromper el mensaje: es elegir en qué se convierte.

> [!quote]- De la transcripción — la definición intuitiva, en palabras del docente (cues pt1 116-120)
> **116-118.** "Vamos a leer esto de vuelta un poco más tranquilos: si yo tomo un texto cifrado que salía de algún valor plano y le modifico algún bit o algunos bits, cuando yo lo descifre con **una clave que no conozco** —no importa—, el resultado va a ser **el texto plano con esos mismos bits cambiados**."
> **120.** "Y por eso se llama maleabilidad: **yo puedo tocar el texto cifrado, moldearlo de alguna manera, para remoldear o cambiarle la forma al texto plano**."

La palabra que la filmina usa, y que conviene tener a mano porque es la que aparece en la bibliografía, es **`Malleability`**.

---

## El escenario: la base de sueldos

La filmina abre con un encargo de ingeniería, no con un teorema: *"¿Podríamos proteger los sueldos de empleados en una base de datos?"*. Con el supuesto explícito de que se usa **un [[criptosistema-de-flujo|criptosistema de flujo]] CPA-Secure**, o sea lo mejor que había hasta acá.

La solución ingenua es la que sale sola: cifrar la columna sensible y dejar el resto en claro.

| empleado | sueldo (cifrado) |
|---|---|
| 2542 | $\texttt{0xEA26969AA3F61CDD9EC68498DF031CA935EFA9C}$ |
| 2678 | $\texttt{0xF4933E107178B88D8EE00F40E43A9A3C9D2EDF79}$ |
| 2789 | $\texttt{0x155BBBE7A5442CBBCAB8F57DACF7212255F3641C}$ |
| 2890 | $\texttt{0x4D9B47D518F2ED7DE04D601F1856767969A328E8}$ |

**La estructura de la tabla es la mitad del ataque:** el legajo está **en claro** y es la llave de la fila; sólo el sueldo está cifrado. Nada en el criptograma dice a qué fila pertenece.

> **El escenario no es un mensaje en tránsito, es una base en reposo** *(precisión nuestra).* El atacante del relato es **interno** y tiene acceso de **escritura** sobre la tabla. Ése es el detalle que hace que la maleabilidad muerda: contra un adversario que sólo lee, el criptosistema se comporta perfecto.

> [!quote]- De la transcripción — el encargo y la solución ingenua (cues pt1 38-47)
> **38-40.** "Nos encomiendan construir un sistema para una empresa, para liquidación de sueldos. El sueldo de cada empleado es un dato muy sensible. La verdad que a mí no me gustaría que alguien publique todos los sueldos, o que **el administrador de tecnología que hace el backup de las bases de datos** tenga acceso a los sueldos de todos los empleados."
> **41-43.** "Con lo que sabemos decimos: no hay problema, lo tenemos resuelto. Ciframos el sueldo y lo guardamos en una base de datos asociado al empleado, pero guardamos el dato cifrado, entonces nadie tiene acceso al sueldo. **La clave estará en otro lugar** —después veremos dónde se protege o cómo se guarda—, pero problema resuelto."
> **45-47.** "Para hacerlo más educativo voy a simplificarlo un poco: vamos a asumir que el criptosistema que estamos usando es **un criptosistema de flujo `CPA-Secure`**. Se puede hacer con otros criptosistemas, es un poco más complicado lo que voy a hacer ahora."

> **Errata de la filmina:** la fila 2542 tiene **39 dígitos hexadecimales**, no 40. Con el formato que la propia filmina declara cuatro láminas más adelante, en la 9 ($12 + 4 + 4 = 20$ bytes) tendría que tener 40, como las otras tres. Falta un nibble. No cambia nada del ataque —esa fila no participa—, pero conviene no copiarla como si fuera un registro válido.

---

## Ataque 1: copiar la fila del jefe

*"A veces no es necesario conocer el valor para generar problemas…"*, dice la filmina. El atacante es el empleado 2678 y sabe que su jefe es el 2890. **Copia el criptograma entero de la fila 2890 sobre la suya.**

| empleado | sueldo (cifrado) | |
|---|---|---|
| 2542 | $\texttt{0xEA26969AA3F61CDD9EC68498DF031CA935EFA9C}$ | |
| 2678 | $\texttt{0x4D9B47D518F2ED7DE04D601F1856767969A328E8}$ | aumento de sueldo |
| 2789 | $\texttt{0x155BBBE7A5442CBBCAB8F57DACF7212255F3641C}$ | |
| 2890 | $\texttt{0x4D9B47D518F2ED7DE04D601F1856767969A328E8}$ | |

Es un copy-paste. No hay criptografía adentro del ataque: **no se descifra, no se calcula, no se adivina nada.** El atacante ni siquiera sabe cuánto se acaba de asignar; sabe algo mucho más barato, que su jefe cobra más que él.

**Y no viola `CPA`.** Ésta es la parte incómoda y es la que hay que poder defender en un parcial: el adversario sigue sin poder distinguir ese criptograma —ni el viejo ni el nuevo— de cualquier otro. La prueba [[pruebas-de-indistinguibilidad#Las tres pruebas|CPA]] mide **qué puede aprender** alguien que observa y consulta; no mide **qué puede escribir**. El ataque no aprende nada, y por eso el juego no lo ve.

> [!quote]- De la transcripción — por qué esto es un problema aunque CPA no lo vea (cues pt1 57-68)
> **57-60.** *(Pablo Abad)* "Este es un ataque que **no viola el modelo de seguridad de la prueba `CPA`**: yo, como atacante, sigo sin poder discernir el texto cifrado que había —tanto el viejo como el nuevo— de cualquier otro valor."
> **62.** "Aun así, desde un punto de vista de seguridad, de alguien que está construyendo un sistema, **me costaría mucho explicarle a alguien que me pid[ió] el sistema que esto no es un problema**."
> **63.** "No sé, a ustedes: ¿les parece que esto sería un problema?"
> **65.** *(EMILIO JOSÉ MITCHELL)* "Y es un problema."
> **66-68.** *(Pablo Abad)* "Es un problema, okay. Bien. Además, si el cliente nos pidió esto, es el cliente; el cliente tiene la razón. **Si el cliente dice que es un problema, tenemos que ver cómo resolverlo.**"

---

## El arreglo que no alcanza

La filmina propone cifrar $\text{empleado} \Vert \text{sueldo}$ en lugar del sueldo solo: si el legajo viaja **adentro** del criptograma, copiar la fila del jefe deja un registro que al descifrarse dice `2890` en una fila cuya llave es `2678`, y la aplicación lo detecta.

$$\text{Texto plano de la fila 2678:}\quad \texttt{2678}\ \ \$12{,}345$$

Lo interesante es que **no es un arreglo criptográfico**: es meter el contexto adentro del dato para que la adulteración se note. Vale la pena registrar el criterio, porque es transferible.

> [!quote]- De la transcripción — no todo se resuelve con criptografía (cues pt1 70-77)
> **70.** "Tampoco es que hay que resolver todo con criptografía. **Uno cuando aprende una herramienta nueva dice: la quiero aplicar a todo.** Pero esto se puede resolver de una forma mucho más fácil."
> **72-73.** "¿Cuál es el problema que hubo acá? Que alguien tomó cualquier valor y lo copió a otr[a fila]. Hay una forma fácil de resolver eso: como lo que yo cifro es arbitrario, **¿por qué no cifro el número de legajo y el sueldo?**"
> **74-76.** "Si alguien me copia una fila como pasaba antes, yo podría detectar eso: porque cuando descifro la fila para el proceso que sea, puedo ver el número de [lega]jo que está ahí y ver si coincide con el de la columna. Y si no llegasen a coincidir, digo: acá hubo algo raro."

> **Lo que el arreglo exige y la filmina no dice** *(precisión nuestra).* Cifrar $\text{empleado} \Vert \text{sueldo}$ no detecta nada **por sí solo**. Hace falta que la aplicación **compare** el legajo descifrado contra la llave de la fila y **rechace** cuando no coinciden. El cifrado no hace esa comparación; es código de la aplicación. La filmina muestra el formato y nunca menciona el chequeo — sin él, el arreglo no arregla nada.

---

## Ataque 2: la modificación quirúrgica

Con el legajo adentro del criptograma, copiar filas dejó de servir. Entonces aparece el ataque que le da nombre a la nota: *"¡Modificaciones quirúrgicas aún permiten cambiar el dato!"*, rotulado **`Malleability`** en la filmina.

$$\texttt{...E43A9A3C}\ \texttt{9D}\,\underline{\texttt{2EDF79}} \quad\longrightarrow\quad \texttt{...E43A9A3C}\ \texttt{9D}\,\underline{\texttt{2F69F0}}$$

$$\text{Texto plano:}\quad \texttt{2678}\ \ \$12{,}345 \quad\longrightarrow\quad \texttt{2678}\ \ \$100{,}000$$

Cambian **sólo los últimos 3 bytes**. El vector de inicialización queda intacto, el campo del legajo cifrado queda intacto —así que el chequeo del arreglo anterior sigue pasando—, y el sueldo pasa a valer lo que el atacante quiso.

> [!quote]- De la transcripción — el galerazo, y el nombre de la debilidad (cues pt1 78-87)
> **78-82.** "Y de golpe aparece alguien que dice: yo voy a hacer un **galerazo**. Voy a tomar la entrada que está ahí, que es un texto cifrado que no tiene sentido, y de golpe le voy a cambiar algunos valores. Y lo que antes era un sueldo que decía 12345, pasó a valer 100000 mágicamente."
> **83.** "Encima 100000 no [es] un número cualquiera: es un número lo suficientemente preciso como para decir *el [que hizo] esto sabe algo*."
> **86-87.** "Este ataque explota una debilidad que se llama **maleabilidad**, que tienen los criptosistemas de flujo. **Los de bloque también pueden tener esta debilidad, pero es más difícil de explotar** — por eso acá es donde simplifico un poco el ataque."

---

## Backstage: el formato del mensaje

Para operar quirúrgicamente hay que saber **dónde** está cada campo. La filmina lo declara sin rodeos —*"Se necesita conocer el criptosistema y formato de mensaje"*— y ahí se detiene: da el supuesto, no lo justifica.

- Formato del campo: $IV \Vert empl \Vert sueldo$
- $IV$: arreglo de 12 bytes · $empl$: entero de 4 bytes · $sueldo$: entero de 4 bytes

$$\underbrace{\texttt{F4933E107178B88D8EE00F40}}_{IV,\ 12\ \text{bytes}}\;\Vert\;\underbrace{\texttt{E43A9A3C}}_{empl,\ 4\ \text{bytes}}\;\Vert\;\underbrace{\texttt{9D2EDF79}}_{sueldo,\ 4\ \text{bytes}}$$

Total: 20 bytes, 40 dígitos hexadecimales.

> **Por qué el supuesto es legítimo** *(lectura nuestra; ni la filmina ni la transcripción mencionan a Kerckhoffs).* Conocer el formato y el algoritmo no le regala nada al adversario que no debiera tener ya: el [[principio-de-kerckhoffs|principio de Kerckhoffs]] manda asumir que **todo el sistema es público salvo la clave**. Un ataque que necesitara mantener el formato en secreto para no funcionar no sería una debilidad del criptosistema, sería seguridad por oscuridad.

> [!quote]- De la transcripción — por qué el dinero se codifica como entero (cues pt1 96-98)
> **96-98.** "Hay una parte que acá, para simplificar, la tenemos codificada como entero de 4 bytes, que es el legajo del empleado, y otra parte que está como entero, que es el sueldo — que **para evitar los quilombos del redondeo, el punto flotante y demás, todo lo que es moneda se suele codificar como entero y después se le corre la coma**."

---

## La propiedad formal

Todo el ataque sale de una línea. En un criptosistema de flujo, cifrar es xorear el mensaje contra la salida del [[generador-pseudoaleatorio|generador pseudoaleatorio]]:

$$\mathsf{Enc}_k(m) = G(k)\oplus m = c \qquad\Longrightarrow\qquad c' := c\oplus x \;\;\Longrightarrow\;\; \mathsf{Dec}_k(c') = m \oplus x$$

**La demostración es de un renglón**, y conviene saber hacerla en el pizarrón:

$$\mathsf{Dec}_k(c') \;=\; G(k)\oplus c' \;=\; G(k)\oplus c\oplus x \;=\; \underbrace{G(k)\oplus G(k)}_{=\,0}\oplus\, m \oplus x \;=\; m\oplus x$$

El $\oplus$ es asociativo, conmutativo y **su propio inverso**: cualquier diferencial que el adversario inyecte en el criptograma atraviesa el descifrado y aparece idéntico en el texto plano. La clave nunca entra en la cuenta, y por eso el atacante no la necesita.

> **Lo que esta propiedad dice de verdad** *(lectura nuestra).* No dice que el cifrado se rompa: el criptograma sigue siendo indistinguible de azar. Dice que **la función de descifrado es un homomorfismo respecto del xor**, y un homomorfismo es exactamente lo que un adversario activo quiere: una manija que le permite operar sobre el plano tocando el cifrado. La confidencialidad y la maleabilidad son propiedades **independientes** — se puede tener la primera en grado máximo y la segunda también.

---

## La cuenta de la filmina, verificada

La técnica que el docente le pone nombre —*armar una tabla vacía*— son dos xor en cadena: **primero se anula el valor que hay, después se escribe el que se quiere**. Es la misma figura que reaparece en el ataque a [[cbc-mac|CBC-MAC]].

1. Se aíslan los **3 bytes menos significativos** del campo `sueldo`: $\texttt{2EDF79}$. Con 3 bytes se llega hasta $2^{24}-1 = 16\,777\,215$, de sobra para el valor buscado, y el byte alto se deja quieto para no dispararse a un número absurdo que salte a la vista.
2. Se xorea $12345$ —el sueldo actual, conocido— y el registro queda en un estado que **descifra a todos ceros**: el tablero limpio.
3. Se xorea $100000$ sobre ese cero, y ahí queda escrito el valor deseado.

| Línea | Byte alto | Byte medio | Byte bajo | Qué descifra el criptograma resultante |
|---|---|---|---|---|
| $\texttt{2EDF79}$ | $\texttt{00101110}$ | $\texttt{11011111}$ | $\texttt{01111001}$ | $\mathsf{Dec}_k(c) = 12345$ |
| $\oplus\ 12345$ | $\texttt{00000000}$ | $\texttt{00110000}$ | $\texttt{00111001}$ | $\mathsf{Dec}_k(c') = 0\cdots 0$ |
| $\oplus\ 100000$ | $\texttt{00000001}$ | $\texttt{10000110}$ | $\texttt{10100000}$ | $\mathsf{Dec}_k(c'') = 100000$ |
| $=\ \texttt{2F69F0}$ | $\texttt{00101111}$ | $\texttt{01101001}$ | $\texttt{11110000}$ | (resultado según la filmina) |

**Qué cierra.** Los tres binarios de la columna izquierda son correctos: $\texttt{0x2E}\,\texttt{0xDF}\,\texttt{0x79}$ para la primera línea, y las etiquetas decimales son de verdad esos decimales —$12345 = \texttt{0x003039}$ y $100000 = \texttt{0x0186A0}$—, consistentes con los $\$12{,}345$ y $\$100{,}000$ que muestran las filminas anteriores. Los dos primeros bytes del resultado también cierran.

> **Errata de la filmina: el byte bajo del xor está mal.** La cuenta es
>
> $$\texttt{0x79}\oplus\texttt{0x39} = \texttt{0x40}, \qquad \texttt{0x40}\oplus\texttt{0xA0} = \texttt{0xE0}$$
>
> con lo cual el resultado correcto es $\texttt{0x2F69E0}$ y no $\texttt{0x2F69F0}$. Difieren en **un solo bit**, el de peso $2^{4}$. La filmina escribe $\texttt{11110000}$ donde va $\texttt{11100000}$.
>
> **Arrastre:** el criptograma que exhibe el ataque —$\texttt{...9D2F69F0}$— descifra entonces a $\$100{,}016$, no a $\$100{,}000$. Los 4 bytes de keystream alineados con el campo `sueldo` se deducen de la fila original, $\texttt{0x9D2EDF79}\oplus\texttt{0x00003039} = \texttt{0x9D2EEF40}$, y con ellos $\texttt{0x9D2F69F0}\oplus\texttt{0x9D2EEF40} = \texttt{0x000186B0} = 100\,016$. El criptograma correcto para $\$100{,}000$ es $\texttt{...9D2F69E0}$.
>
> No tiene ninguna consecuencia conceptual —el ataque funciona idéntico—, pero es del tipo de error que hace dudar a quien rehace la cuenta a mano. *(Verificación nuestra, reproducible con los datos de las filminas.)*

---

## Dónde entra el IV, y por qué el ataque sobrevive

La fórmula $\mathsf{Enc}_k(m) = G(k)\oplus m$ que usa la filmina es **determinística**, y un criptosistema determinístico [[pruebas-de-indistinguibilidad#Propiedades de CPA|no puede ser CPA-Secure]]. O sea que, tal como está escrita, contradice el supuesto con el que arranca el ejemplo. La filmina del formato sí muestra el $IV$: las dos láminas son mutuamente inconsistentes, y el docente resuelve la inconsistencia en clase a favor de la versión con $IV$.

$$\mathsf{Enc}_k(m):\;\; IV \leftarrow \{0,1\}^{n},\quad c := \langle\, IV,\;\; G(k \Vert IV)\oplus m \,\rangle \qquad\qquad \mathsf{Dec}_k\langle IV, y\rangle := G(k\Vert IV)\oplus y$$

> [!quote]- De la transcripción — la autocorrección del docente (cues pt1 268-279)
> **268-273.** "Si ciframos 2 veces el mismo mensaje con la misma clave, volvés al mismo mensaje. No, perdón: hice algo mal. Y está bien tu pregunta, porque como está, está mal. **Estos eran criptosistemas que eran `CPA-Secure`**, o sea, de los mejorcitos que teníamos. **Entonces hay un IV dando vueltas.**"
> **274-276.** "Entonces el resultado tiene esta forma: se genera un vector al azar, y lo que se devuelve es el resultado de **un xor bit a bit del generador con la clave mezclada con ese vector aleatorio**."
> **279.** "Concatenación, pero **esto hace que [no] sean determinísticos: si ciframos el mismo mensaje dos veces vamos a tener 2 textos cifrados distintos**."

**El ataque sobrevive intacto**, y es importante ver por qué: el $IV$ vuelve a `Enc` probabilístico, que es lo que hacía falta para pasar `CPA`, pero **el cuerpo del criptograma sigue siendo un xor contra un keystream**. Mientras el $IV$ no se toque, el keystream es el mismo y la propiedad $\mathsf{Dec}_k(c\oplus x) = m\oplus x$ vale igual. El azar del $IV$ compra confidencialidad; no compra integridad.

> **Corolario operativo** *(lectura nuestra; la clase lo asume sin discutirlo).* El diferencial $x$ tiene que caer sobre la parte $G(k\Vert IV)\oplus m$ y **nunca** sobre el $IV$. Tocar el $IV$ cambia la semilla, cambia todo el keystream y convierte el descifrado en basura impredecible: el ataque deja de ser quirúrgico y pasa a ser vandalismo. Por eso el ataque de la filmina modifica los últimos bytes y deja los primeros doce intactos.

---

## No hace falta conocer el sueldo

La cuenta de arriba usa el sueldo actual ($12345$) porque el atacante quiere un valor **destino exacto**. Pero eso es un lujo, no un requisito: la maleabilidad es más barata que eso.

Para cualquier diferencial $\Delta$, el criptograma $c\oplus\Delta$ descifra a $m\oplus\Delta$ **sin que el atacante sepa cuánto vale $m$**. Prender un bit alto de $\Delta$ le suma esa potencia de dos a un sueldo que nunca vio.

> [!quote]- De la transcripción — variantes del ataque sin conocer el sueldo (cues pt1 162-167)
> **162.** *(EMILIO JOSÉ MITCHELL)* "¿Eso porque nosotros usamos nuestro sueldo?"
> **163-166.** "Eso parte de la premisa de que sabés tu sueldo. **Hay otros ataques si no sabés tu sueldo**: porque si vos sabés que tu sueldo, ponele, fuese menor a un millón, **podrías cambiar el bit que sabés que va a tocar el millón, y de golpe te diste un millón más**. Si sabés el sueldo, como en este caso, podés hacer el [ataque] quirúrgico de ponerte hasta el centavo de lo que quieras."

Ésta es la versión que hace juego con la línea que abre la filmina del primer ataque —*"A veces no es necesario conocer el valor para generar problemas…"*, bajo el título *"Un nuevo tipo de ataque"*— y la que vuelve la maleabilidad un problema real y no una curiosidad de pizarrón: **el conocimiento del texto plano gradúa la precisión del ataque, no su existencia.**

---

## El flujo es el caso extremo, pero no el único

La **clase** simplifica al flujo *"para hacerlo más educativo"* (cues pt1 45-47); la filmina 5 se limita a *"Supongamos usar un criptosistema de flujo CPA-Secure"*, sin decir por qué. La debilidad no es exclusiva de él. *(La filmina y la clase sólo hablan del flujo; la lectura modo por modo de la tabla es nuestra, apoyada en la [[modos-de-encadenamiento#Propagación de errores|propagación de errores]] de la Clase 02.)*

| Construcción | ¿Maleable? | Con qué grado de control |
|---|---|---|
| [[one-time-pad\|One Time Pad]] | Sí | total: es el mismo xor, y **tiene secreto perfecto** |
| Flujo, con o sin $IV$ | Sí | total: cada bit del cifrado gobierna un bit del plano |
| [[modos-de-encadenamiento#Los cinco modos\|CTR]] | Sí | total: el cifrado también es keystream $\oplus$ mensaje |
| [[modos-de-encadenamiento#Los cinco modos\|OFB]] | Sí | total, por la misma razón que `CTR` |
| [[modos-de-encadenamiento#Los cinco modos\|CFB]] | Sí, con costo | quirúrgico en $m_i$ tocando $c_i$, **a cambio de arruinar $m_{i+1}$**: el mismo trueque que `CBC` pero con el daño hacia adelante |
| [[modos-de-encadenamiento#Los cinco modos\|CBC]] | Sí, con costo | quirúrgico en $m_i$ tocando $c_{i-1}$, **a cambio de pulverizar $m_{i-1}$**; el primer bloque se cambia a voluntad tocando el $IV$ |

**El caso de `CBC` es el que hay que entender bien** *(lectura nuestra, apoyada en la [[modos-de-encadenamiento#Propagación de errores|propagación de errores]] de la Clase 02; Katz & Lindell §4.1 registra el caso del primer bloque).* En `CBC`, $m_i = \mathsf{Dec}_k(c_i)\oplus c_{i-1}$: xorear $\Delta$ en $c_{i-1}$ produce **exactamente** $\Delta$ en $m_i$, igual que en el flujo. El precio es que $c_{i-1}$ entra a la primitiva y sale irreconocible, así que $m_{i-1}$ queda hecho ruido. El adversario cambia lo que quiere en un bloque y ensucia el anterior — sirve si el bloque arruinado es descartable, o si el objetivo es el primer bloque, que se controla desde el $IV$ **sin daño colateral**.

Ésa es la traducción exacta del *"los de bloque también pueden tener esta debilidad, pero es más difícil de explotar"* del docente: **más difícil no es imposible, y la dificultad es de precisión, no de fuerza.**

---

## Qué rompió el ataque, y qué no

El punto de llegada de todo el bloque, y la frase que más conviene tener lista para el parcial:

**Nada de lo que pasó fue una falla de confidencialidad.** El criptosistema hizo su trabajo: ningún criptograma reveló información. Lo que faltó es la capacidad de **detectar que alguien escribió encima**. Es un servicio de seguridad distinto, y se llama **integridad**.

De ahí sale, en orden, el resto de la clase:

1. Hace falta una **prueba** que vea este ataque, porque `Eav`, `Mul` y `CPA` no lo ven → [[ataque-de-texto-cifrado-escogido|CCA]].
2. Ningún criptosistema por sí solo la pasa → hace falta una primitiva nueva, el [[message-authentication-code|MAC]].
3. Y la combinación de las dos cosas → [[cifrado-autenticado|cifrado autenticado]].

> [!quote]- De la transcripción — la escena con el cliente, que es la moraleja (cues pt1 168-173)
> **168-170.** "El punto es: nosotros estábamos usando un criptosistema que pasa nuestra mejor prueba de seguridad, creíamos que estábamos tranquilos, y **bum**: esto sigue siendo un problema."
> **171-173.** "Nosotros le podemos decir: usamos el mejor criptosistema del mundo, es el que usan los bancos para proteger todo, así que estás re seguro — pero puede pasar esto. **Nos van a mirar con cara de 'yo no sé si eso es seguro'; no van a decir 'no lo estás usando bien', por lo menos.**"

---

## Ver también

- [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]] — la prueba que sí ve este ataque, y el ejercicio que convierte la maleabilidad en una victoria formal contra el flujo
- [[message-authentication-code|Message Authentication Code]] — la primitiva que detecta la adulteración
- [[privacidad-e-integridad|Privacidad e integridad]] y [[cifrado-autenticado|Cifrado autenticado]] — cómo se combinan las dos garantías
- [[criptosistema-de-flujo|Criptosistema de flujo]] — de dónde sale el $G(k)\oplus m$ que hace todo el trabajo del ataque
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — `Eav`, `Mul` y `CPA`: las tres pruebas que este ataque atraviesa sin despeinarse
- [[modos-de-encadenamiento|Modos de encadenamiento]] — por qué `CTR` y `OFB` heredan la maleabilidad entera y `CBC` sólo en parte
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — qué compra el $IV$ (y qué no)
- [[modelos-de-ataque|Modelos de ataque]] — el corte pasivo/activo, que es donde este ataque queda del lado que las pruebas de la Clase 02 no cubrían
- [[estado-de-un-criptosistema|Estado de un criptosistema]] — *"¿es seguro?"* siempre se responde *"¿contra qué prueba?"*
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]]
- Katz & Lindell cap. 4 *Message Authentication Codes* — la lectura que manda la filmina; el caso de `CBC` está en §4.1 ([[bibliografia|bibliografía]])
