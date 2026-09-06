---
title: Salting
resumen: 'Valor público y distinto por cuenta que se guarda concatenado al digest de la clave: rompe la amortización de un ataque offline sobre muchas cuentas a la vez, pero no agrega dificultad contra una cuenta sola.'
fuentes: ["[[clase-07-autenticacion]]", "[[autenticacion]]", "[[almacenamiento-de-claves]]", "[[ataque-de-diccionario-sobre-hashes]]"]
aliases: [Salting, Perturbación por cuenta, Sal de autenticación, Amortización de ataques offline]
type: concepto
unidad: 2
clase: 7
orden: 7
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, autenticacion, salting, almacenamiento-de-claves, ataques-offline, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf"]
---

# Salting

**Por qué guardar un valor público y distinto por cuenta al lado de cada clave rompe la posibilidad de atacar muchas cuentas a la vez con un solo trabajo, aunque no le agregue ni un bit de dificultad a atacar una cuenta sola.** Es la nota que formaliza, con la letra de la [[clase-07-autenticacion|Clase 07]], algo que el vault ya tenía descripto de manera informal en la Unidad 1.

Cubre la filmina **40** del deck `Clase 07 - Aplicaciones - Principios y autenticacion.pdf`. Esta clase todavía no se dictó —hoy es 04/09/2026—, así que la nota está escrita contra el PDF y lecturas propias, rotuladas como tales; no hay transcripción ni video que la cubra.

## El escenario: ataque en paralelo, no en serie

La filmina abre con el escenario que motiva la sal, y es distinto del escenario de fuerza bruta contra una sola cuenta: un atacante consigue **varios** valores almacenados a la vez, $c_1, c_2, \ldots, c_n$ —por ejemplo, un archivo de contraseñas completo—, y cada candidato que prueba, $a_i \to f(a_i)$, se puede comparar **contra todos los $c_j$ simultáneamente**. Sin ninguna perturbación, evaluar $f$ una sola vez amortiza el trabajo sobre las $n$ cuentas del archivo: calcular $f(a)$ para el diccionario entero cuesta lo mismo si el archivo tiene una cuenta o un millón.

Éste es exactamente el ataque **offline** de [[ataques-a-un-sistema-de-autenticacion|Ataques a un sistema de autenticación]] —requiere haber conseguido $c$ de antemano y después corre sin límite de intentos—, con una vuelta de tuerca: no contra una cuenta, contra todas a la vez.

## El método

$$f(a) = x \,\Vert\, f'(a, x)$$

Cada $c$ almacenado se calcula con una $x$ —la sal— **distinta**. El atacante ya no puede calcular $f(a)$ una sola vez y comparar contra todos los $c_j$: cada $c_j$ tiene su propia $x_j$, así que hay que **recalcular $f'(a, x_j)$ una vez por cada valor de sal presente en el archivo**. Si hay $n$ cuentas con sales distintas, el trabajo del atacante pasa de "una pasada del diccionario" a "$n$ pasadas del diccionario" — una por sal.

**La sal no es secreta.** Se guarda en claro, junto al digest, precisamente porque `Vrfy` la necesita para poder recalcular $f'(a,x)$ contra la clave que el usuario ingresa. Su función no es esconder nada: es **desincronizar** el trabajo del atacante entre cuentas.

### Instanciando el modelo A, C, F, L, S

La fórmula $f(a) = x \Vert f'(a,x)$ **es** una instancia concreta de $C$ en el formalismo de [[autenticacion|Autenticación]]: si $a$ es la clave que provee el usuario, el sistema guarda $c = f(a)$, y esa $c$ trae la sal pegada adelante. No hace falta un componente nuevo en el modelo — la sal vive adentro de $C$, no al lado.

**El ejemplo Unix tradicional de la sección 3 de la clase ya es exactamente este mecanismo, con números concretos.** [[almacenamiento-de-claves|Almacenamiento de claves § El ejemplo Unix tradicional]] da

$$C = \{\,\underbrace{xx}_{2}\,\underbrace{H\!\cdots\!H}_{11}\,\}$$

donde $xx$ son 2 caracteres tomados de un alfabeto de 64 símbolos (`.`, `/`, dígitos, mayúsculas y minúsculas): $64^{2} = 4096$ sales posibles, exactamente el número de "funciones" que la filmina 28 enumera. Comparado con la notación de esta filmina, $xx$ es $x$ y $H\cdots H$ es $f'(a,x)$ — la única diferencia es que acá $x$ va **primero** en la concatenación, y en el esquema Unix también: la sal antecede al hash en el archivo.

## Qué compra y qué no compra

- **Qué compra.** Rompe el ataque en lote descripto arriba: contra $n$ registros con sales distintas, el costo pasa de "una pasada del diccionario" a "$n$ pasadas del diccionario", una por cada valor de sal presente. También tapa una fuga colateral: dos usuarios con la misma clave ya no comparten el mismo $c$, porque tienen sales distintas — sin sal, un vistazo al archivo delataría cuáles cuentas comparten contraseña, sin necesidad de romper nada.
- **Qué NO compra.** Nada contra un ataque **dirigido a una sola cuenta**. La sal es pública: el atacante la lee del propio registro y ataca esa cuenta con el costo de siempre — la fórmula de Anderson de [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] no cambia ni un poco cuando $n=1$. La sal ataca la **amortización entre víctimas**, no la dificultad de romper una clave.

> **El mismo mecanismo ya está en el vault, con otra notación.** [[ataque-de-diccionario-sobre-hashes#Sal|Ataque de diccionario sobre hashes § Sal]] desarrolla exactamente esta contramedida —ahí escrita $h(\text{sal} \Vert x)$, con $x$ como la clave y la sal **antes** del argumento— y llega a la misma conclusión con la misma fórmula de costo: sin sal el trabajo de un atacante contra $n$ registros es $\lvert D\rvert$ (el tamaño del diccionario, una sola pasada); con sal pasa a $n \cdot \lvert D\rvert$. Las dos fuentes describen la misma idea con roles de letras invertidos —acá $x$ es la sal y $a$ la clave; allá $x$ es la clave y la sal no tiene letra propia—, y conviene no confundir los símbolos entre una nota y la otra.
>
> Esa misma nota trae, además, lo que esta filmina **no** cubre: la **pimienta** (*pepper*), un valor secreto y compartido por todo el sistema que ataca la capacidad misma de evaluar $f'$ en lugar de la amortización, y las **funciones deliberadamente lentas** (`PBKDF2`, `bcrypt`, `scrypt`, `Argon2`), que atacan el costo por evaluación — exactamente el rol que cumple [[pbkdf2|PBKDF2]] en esta misma clase. Sal, pimienta y función lenta atacan **tres factores distintos** del costo de un ataque de diccionario, y la filmina de esta clase sólo desarrolla el primero.

## Por qué el nombre se superpone con nonce e IV, y por qué no es el mismo rol

**Precisión nuestra, ya registrada en la Unidad 1.** El docente, al hablar de cifrado probabilístico el 20/08, enumera varios nombres para la mitad pública de la semilla de un cifrado: *"se llama vector de inicialización, o se llama nonce. Se llama SALT, etcétera"* → [[clase-02-cifrado#8. Cifrado probabilístico: nonce e IV|Clase 02 § 8. Cifrado probabilístico: nonce e IV]]. Es la **misma palabra** que esta filmina usa, y el propósito de fondo es parecido —que una misma entrada no produzca siempre la misma salida—, pero el **rol es distinto**: el nonce o IV de un cifrado evita que el mismo mensaje produzca el mismo criptograma bajo la misma clave; la sal de esta filmina evita que la misma clave produzca el mismo $c$ en dos cuentas distintas, y sobre todo evita que el trabajo de romperla se amortice entre cuentas. No siembran el mismo generador ni resuelven el mismo problema — comparten nombre y mecánica superficial, no función.

## Ver también

- [[clase-07-autenticacion#7. Salting|Clase 07 — Autenticación § 7. Salting]] — la sección de la que cuelga esta nota
- [[autenticacion|Autenticación]] — el formalismo $(A,C,F,L,S)$ en el que $f(a)=x\Vert f'(a,x)$ es una instancia de $C$
- [[almacenamiento-de-claves|Almacenamiento de claves]] — el ejemplo Unix tradicional, que ya usa esta construcción con $2^{12}=4096$ sales
- [[ataques-a-un-sistema-de-autenticacion|Ataques a un sistema de autenticación]] — la distinción offline/online que hace que el ataque en lote sea posible
- [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] — la fórmula de Anderson, que la sal no modifica cuando $n=1$
- [[pbkdf2|PBKDF2]] — la contramedida complementaria, que ataca el costo por evaluación en vez de la amortización
- [[ataque-de-diccionario-sobre-hashes#Sal|Ataque de diccionario sobre hashes § Sal]] — el mismo mecanismo descripto en la Unidad 1, con notación distinta, más la pimienta y las funciones lentas que esta filmina no cubre
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — el otro uso, no relacionado en función, de la misma palabra "sal"/"nonce"/"IV"
