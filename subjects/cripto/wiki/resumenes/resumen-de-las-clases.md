---
title: Resumen de las clases
resumen: 'Toda la materia en una sola página: las diez clases con deck, comprimidas a definiciones, fórmulas y tablas, con un tooltip en cada sigla y en cada concepto. Para refrescar en segundos en medio de la práctica; para profundizar, cada enlace lleva al concepto.'
aliases: [Resumen, Resumen de las clases, Resumen de la materia, Hoja de referencia]
type: resumen
clase: ""
tags: [resumen, hoja-de-referencia, parcial, tooltips]
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[clase-02-cifrado]]", "[[clase-03-macs-y-cifrado-autenticado]]", "[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[clase-05-protocolos-criptograficos]]", "[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[clase-07-autenticacion]]", "[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[clase-09-flujo-de-informacion]]", "[[clase-10-seguridad-en-la-empresa]]"]
created: 2026-09-17
updated: 2026-09-17
sources: []
---

# Resumen de las clases

**Toda la materia en una página.** Cada clase está comprimida a lo que hay que poder enunciar de memoria —definiciones, fórmulas, tablas y trampas— en el orden en que se dictó. Está pensada para leerse en medio de la práctica de parciales: se busca el tema en el índice de abajo o en el panel lateral, se refresca en un minuto y se sigue con el ejercicio.

**Cómo usar los tooltips.** Todo lo que está enlazado tiene una tarjeta de vista previa: al pasar el puntero por una sigla o un concepto (en pantalla táctil, al mantenerlo pulsado) aparece el resumen de esa página o, si el enlace apunta a una sección, el párrafo que define el término. Con eso se resuelve casi todo sin salir de acá; para profundizar, un clic abre el concepto entero. Cada clase abre con el enlace a su nota-mapa, que es la puerta a las filminas, las transcripciones y los ejercicios.

**Alcance.** Cubre las Clases 1 a 10; la Clase 11 (Protección de datos personales, 05/11) no tiene deck de la cátedra ni nota de clase todavía. El [[primer-parcial|primer parcial]] del 24/09 toma las Clases 1 a 5, y cada una cierra con un bloque «Para el parcial» que remite a las páginas de la sección 1P.

## Contenido

1. **C1** · [[#C1 · Introducción y criptografía clásica|Introducción y criptografía clásica]] — [[#El criptosistema y el principio de Kerckhoffs|El criptosistema y el principio de Kerckhoffs]] · [[#Modelos de ataque|Modelos de ataque]] · [[#Cifrado por rotación y ataque de fuerza bruta|Cifrado por rotación y ataque de fuerza bruta]] · [[#Sustitución monoalfabética y criptoanálisis por frecuencias|Sustitución monoalfabética y criptoanálisis por frecuencias]] · [[#Cifrado de Vigenère, Kasiski e índice de coincidencia|Cifrado de Vigenère, Kasiski e índice de coincidencia]] · [[#Cifrado por transposición|Cifrado por transposición]] · [[#Secreto perfecto|Secreto perfecto]] · [[#Historia: la crisis de 1945 y Enigma|Historia: la crisis de 1945 y Enigma]] · [[#Para el parcial — Clase 1|Para el parcial]]
2. **C2** · [[#C2 · Cifrado|Cifrado]] — [[#Secreto perfecto y el One Time Pad|Secreto perfecto y el One Time Pad]] · [[#Seguridad computacional|Seguridad computacional]] · [[#Cifrado de flujo y generadores pseudoaleatorios|Cifrado de flujo y generadores pseudoaleatorios]] · [[#Pruebas de indistinguibilidad|Pruebas de indistinguibilidad]] · [[#Cifrado probabilístico y primitivas de bloque|Cifrado probabilístico y primitivas de bloque]] · [[#Modos de encadenamiento|Modos de encadenamiento]] · [[#DES, 3-DES, AES y los cuerpos finitos|DES, 3-DES, AES y los cuerpos finitos]] · [[#Teoría de números y elección de primitivas|Teoría de números y elección de primitivas]] · [[#Para el parcial — Clase 2|Para el parcial]]
3. **C3** · [[#C3 · MAC y cifrado autenticado|MAC y cifrado autenticado]] — [[#Maleabilidad: el cifrado no alcanza|Maleabilidad: el cifrado no alcanza]] · [[#CCA: ningún cifrado visto lo pasa|CCA: ningún cifrado visto lo pasa]] · [[#MAC: la terna y qué garantiza|MAC: la terna y qué garantiza]] · [[#Seguridad de un MAC y los MACs de juguete|Seguridad de un MAC y los MACs de juguete]] · [[#CBC-MAC y sus extensiones seguras|CBC-MAC y sus extensiones seguras]] · [[#Funciones de hash y las tres resistencias|Funciones de hash y las tres resistencias]] · [[#Merkle-Damgård, HMAC y los estándares|Merkle-Damgård, HMAC y los estándares]] · [[#Privacidad e integridad, cifrado autenticado y modos|Privacidad e integridad, cifrado autenticado y modos]] · [[#Para el parcial — Clase 3|Para el parcial]]
4. **C4** · [[#C4 · Criptografía asimétrica y firma digital|Criptografía asimétrica y firma digital]] — [[#Distribución de claves y el problema de fondo|Distribución de claves y el problema de fondo]] · [[#Álgebra necesaria: grupos, anillos y cuerpos|Álgebra necesaria: grupos, anillos y cuerpos]] · [[#Intercambio de claves y el experimento KE|Intercambio de claves y el experimento KE]] · [[#Diffie-Hellman|Diffie-Hellman]] · [[#RSA y El Gamal|RSA y El Gamal]] · [[#Costo del cifrado asimétrico|Costo del cifrado asimétrico]] · [[#Firma digital|Firma digital]] · [[#Cifrado híbrido|Cifrado híbrido]] · [[#Para el parcial — Clase 4|Para el parcial]]
5. **C5** · [[#C5 · Protocolos criptográficos|Protocolos criptográficos]] — [[#Ataques activos y man in the middle|Ataques activos y man in the middle]] · [[#PKI y certificados digitales|PKI y certificados digitales]] · [[#Cadenas de confianza, X.509 y revocación|Cadenas de confianza, X.509 y revocación]] · [[#Needham-Schroeder|Needham-Schroeder]] · [[#Denning-Sacco y frescura|Denning-Sacco y frescura]] · [[#TLS: arquitectura, récord y suites|TLS: arquitectura, récord y suites]] · [[#Sesión y conexión TLS|Sesión y conexión TLS]] · [[#TLS handshake y mensajes de control|TLS handshake y mensajes de control]] · [[#Para el parcial — Clase 5|Para el parcial]]
6. **C6** · [[#C6 · Políticas de seguridad y control de acceso|Políticas de seguridad y control de acceso]] — [[#Política de seguridad y tríada C-I-D|Política de seguridad y tríada C-I-D]] · [[#Paradigmas y lenguajes de política|Paradigmas y lenguajes de política]] · [[#Bell-LaPadula, confidencialidad por niveles|Bell-LaPadula, confidencialidad por niveles]] · [[#Modelos de integridad de Biba|Modelos de integridad de Biba]] · [[#Muralla china y composición de políticas|Muralla china y composición de políticas]] · [[#Matriz de acceso, ACLs, capacidades y secretos compartidos|Matriz de acceso, ACLs, capacidades y secretos compartidos]] · [[#OAuth 2.0 y OpenID Connect|OAuth 2.0 y OpenID Connect]] · [[#Para el parcial — Clase 6|Para el parcial]]
7. **C7** · [[#C7 · Autenticación|Autenticación]] — [[#El modelo formal de autenticación|El modelo formal de autenticación]] · [[#Factores de autenticación|Factores de autenticación]] · [[#Almacenamiento de claves|Almacenamiento de claves]] · [[#Ataques a un sistema de autenticación|Ataques a un sistema de autenticación]] · [[#Complejidad, espacio de claves y políticas|Complejidad, espacio de claves y políticas]] · [[#Salting y PBKDF2|Salting y PBKDF2]] · [[#Challenge-response y EKE|Challenge-response y EKE]] · [[#Autenticación remota y SSO|Autenticación remota y SSO]] · [[#Para el parcial — Clase 7|Para el parcial]]
8. **C8** · [[#C8 · Principios de diseño y vulnerabilidades|Principios de diseño y vulnerabilidades]] — [[#Los ocho principios de diseño|Los ocho principios de diseño]] · [[#Confianza, aseguramiento y ciclo de vida|Confianza, aseguramiento y ciclo de vida]] · [[#Modelado de amenazas y descomposición de la aplicación|Modelado de amenazas y descomposición de la aplicación]] · [[#STRIDE, árboles de ataque e identificación de vulnerabilidades|STRIDE, árboles de ataque e identificación de vulnerabilidades]] · [[#Verificación formal contra prueba de penetración|Verificación formal contra prueba de penetración]] · [[#Metodología de Hipótesis de Falla|Metodología de Hipótesis de Falla]] · [[#Casos resueltos y validez del pentest|Casos resueltos y validez del pentest]] · [[#Para el parcial — Clase 8|Para el parcial]]
9. **C9** · [[#C9 · Flujo de información y malware|Flujo de información y malware]] — [[#Control de acceso: por qué no alcanza|Control de acceso: por qué no alcanza]] · [[#Entropía y entropía condicional|Entropía y entropía condicional]] · [[#Flujo de información: la definición formal|Flujo de información: la definición formal]] · [[#Flujo explícito e implícito|Flujo explícito e implícito]] · [[#Políticas y mecanismos de control de flujo|Políticas y mecanismos de control de flujo]] · [[#Confinamiento y canales ocultos|Confinamiento y canales ocultos]] · [[#Métodos de aislación|Métodos de aislación]] · [[#Para el parcial — Clase 9|Para el parcial]]
10. **C10** · [[#C10 · Seguridad en la empresa|Seguridad en la empresa]] — [[#Seguridad a nivel de red|Seguridad a nivel de red]] · [[#Firewalls y sus tres tipos|Firewalls y sus tres tipos]] · [[#Netfilter e iptables|Netfilter e iptables]] · [[#La DMZ y sus servicios|La DMZ y sus servicios]] · [[#Reglas de los firewalls y servicios de soporte|Reglas de los firewalls y servicios de soporte]] · [[#Segmentación interna y análisis de puntos de entrada|Segmentación interna y análisis de puntos de entrada]] · [[#Detección de intrusiones y variaciones de la arquitectura|Detección de intrusiones y variaciones de la arquitectura]] · [[#Para el parcial — Clase 10|Para el parcial]]
11. [[#Abreviaturas y símbolos|Abreviaturas y símbolos]]

## C1 · Introducción y criptografía clásica

La clase abre la materia preguntando qué significa «seguro»: un [[criptosistema#Definición formal|criptosistema]] cifra bajo el [[principio-de-kerckhoffs|principio de Kerckhoffs]] —todo público salvo la clave— y los cifrados clásicos se rompen uno por uno hasta forzar la definición rigurosa de [[secreto-perfecto|secreto perfecto]].

### El criptosistema y el principio de Kerckhoffs

Un [[criptosistema#Definición formal|criptosistema]] de clave privada es la terna $(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ con $\mathcal{K}$, $\mathcal{M}$ y $\mathcal{C}$, sujeta a la corrección $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$. $\mathsf{Gen}$ es probabilístico y sin entrada; $\mathsf{Enc}$ y $\mathsf{Dec}$ son determinísticos en los clásicos. Especificarlo exige los tres conjuntos y los tres algoritmos, no solo la fórmula.

El [[principio-de-kerckhoffs|principio de Kerckhoffs]] fija qué de eso es público: todo salvo la clave. Por eso existe un solo algoritmo para todos —el peso de la seguridad va en $k$, no en el código— y se descarta la seguridad por oscuridad: el César con $k=3$ fijo no es un criptosistema, porque elimina $\mathsf{Gen}$.

### Modelos de ataque

Antes de los cifrados hace falta fijar contra qué se mide la seguridad: los [[modelos-de-ataque|modelos de ataque]] ordenan al adversario, de menor a mayor poder.

| Modelo | Qué obtiene el adversario | Tipo |
|---|---|---|
| COA | solo criptogramas | pasivo |
| KPA | pares $(m,c)$ que no eligió | pasivo |
| CPA | oráculo de $\mathsf{Enc}$: cifra mensajes que él elige | activo |
| CCA | además, oráculo de $\mathsf{Dec}$ | activo |

Cada modelo contiene al anterior; el objetivo es siempre recuperar el plano completo. El estándar mínimo hoy es seguridad [[modelos-de-ataque#Cómo caen los cifrados clásicos bajo CPA|CPA]]; los clásicos de sustitución caen con una sola consulta que filtra la clave entera.

### Cifrado por rotación y ataque de fuerza bruta

El [[cifrado-por-rotacion#Definición formal|cifrado por rotación]] —el César— desplaza cada símbolo $k$ posiciones: $\mathcal{K}=\mathbb{Z}_n$, $\mathsf{Enc}_k(m)_i=(m_i+k)\bmod n$, $\mathsf{Dec}_k(c)_i=(c_i-k)\bmod n$, con corrección porque $\pi_{-k}\circ\pi_k=\operatorname{id}$.

Cae por [[ataque-de-fuerza-bruta|fuerza bruta]]: probar las $n$ claves cuesta $O(n\cdot\ell)$, viable porque $\lvert\mathcal{K}\rvert$ es pequeño. Exige discriminar un descifrado válido de uno inválido, hipótesis que se cae por abajo (plano sin redundancia: todos los descifrados parecen azar) y por arriba (varios descifrados con sentido); el umbral es la [[ataque-de-fuerza-bruta#Distancia de unicidad: cuándo la fuerza bruta no termina|distancia de unicidad]] de Shannon, el largo desde el cual sobrevive un único descifrado con sentido.

### Sustitución monoalfabética y criptoanálisis por frecuencias

La [[cifrado-de-sustitucion-monoalfabetica#Definición formal|sustitución monoalfabética]] reemplaza cada símbolo según una permutación fija $\pi \in S_n$, con $\lvert\mathcal{K}\rvert=n!$ ($27!\approx 1{,}1\times10^{28}$): la fuerza bruta es inviable. Aun así cae en minutos por [[criptoanalisis-por-frecuencias#Procedimiento|criptoanálisis por frecuencias]], porque $\pi$ no altera las frecuencias: la letra más común del plano va a la más común del criptograma. Es el contraejemplo canónico de espacio de claves grande sin seguridad.

Bajo [[modelos-de-ataque#Cómo caen los cifrados clásicos bajo CPA|CPA]] cae con una sola consulta: se pide el cifrado del alfabeto ordenado y el criptograma es la tabla de $\pi$ completa. El histograma también diagnostica: perfil igual al castellano sobre letras distintas es sustitución; frecuencias aplanadas cerca de $1/n$ es polialfabética.

### Cifrado de Vigenère, Kasiski e índice de coincidencia

El [[cifrado-de-vigenere#Definición formal|cifrado de Vigenère]] (1553) es una sustitución polialfabética con clave de $t$ letras: $c_i=(m_i+k_{((i-1)\bmod t)+1})\bmod n$. No falla por pocas claves —tiene $n^t$— sino porque se descompone: fijado $t$, las posiciones congruentes módulo $t$ son rotaciones puras, y el costo baja de $n^t$ a $t\cdot n$. Bajo [[modelos-de-ataque#Cómo caen los cifrados clásicos bajo CPA|CPA]] cae con una sola consulta: con $m=\texttt{aa}\dots\texttt{a}$ de largo $\ge t$, el criptograma es la clave repetida.

Hallar $t$ es tarea del [[test-de-kasiski#Idea|test de Kasiski]] (1863): las distancias entre secuencias repetidas son múltiplos de $t$, que se busca entre sus divisores comunes. El [[indice-de-coincidencia#Definición|índice de coincidencia]] confirma: probabilidad de que dos letras sin reposición coincidan, $\mathrm{IC}=\sum_i p_i^2$; muestral, $\mathrm{IC}=\sum_i n_i(n_i-1)/(N(N-1))$, $\approx 0{,}0775$ en castellano y $\approx 1/n$ en texto uniforme. Kasiski propone, el [[indice-de-coincidencia#Kasiski vs. IC|IC]] confirma: se promedia el IC muestral de los $t$ sub-bloques, y vale el $t$ menor cuyo promedio salta al valor del idioma.

### Cifrado por transposición

El [[cifrado-por-transposicion#Transposición por columnas|cifrado por transposición]] no cambia los símbolos sino sus posiciones —grilla de $n$ columnas, escrita por filas y leída por columnas— y preserva el histograma exacto del idioma. El análisis de frecuencias no lo rompe, pero lo delata: coincide letra por letra con el castellano, algo que ninguna sustitución produce salvo la identidad.

### Secreto perfecto

El [[secreto-perfecto#Definición|secreto perfecto]] cierra la clase con la primera definición rigurosa de seguridad: para toda distribución en $\mathcal{M}$ y todo $m$, $c$ con $\Pr[C=c]>0$, $\Pr[M=m\mid C=c]=\Pr[M=m]$. Ver el criptograma no cambia lo que el adversario cree del mensaje: es incondicional. La caracterización equivalente, más cómoda de demostrar, pide $\Pr[\mathsf{Enc}_K(m)=c]=\Pr[\mathsf{Enc}_K(m')=c]$ para todo par de mensajes.

El [[secreto-perfecto#Teorema de Shannon (cota de claves)|teorema de Shannon]] da la cota: implica $\lvert\mathcal{K}\rvert\ge\lvert\mathcal{M}\rvert$, necesaria pero no suficiente. La rotación solo lo alcanza con $\ell=1$: la tabla de cifrado es un cuadrado latino, el [[one-time-pad|one-time pad]] sobre $(\mathbb{Z}_n,+)$. Para verificarlo sirve el [[modelo-probabilistico-de-un-criptosistema|modelo probabilístico de un criptosistema]]: $\Pr[C=y\mid M=x]$ debe ser igual para todo $x$, bajo independencia entre clave y mensaje.

### Historia: la crisis de 1945 y Enigma

Cuatro mil años de [[historia-de-la-criptografia|historia de la criptografía]] repiten un ciclo: cifrado nuevo, criptoanálisis, cifrado nuevo. La [[historia-de-la-criptografia#La crisis de 1945|crisis de 1945]] lo corta: «nadie lo rompió todavía» deja de alcanzar como criterio, y se exige representación formal, modelo de amenaza y demostración. Las [[maquinas-de-rotores-y-enigma#Cómo funciona|máquinas de rotores y Enigma]] son la cúspide de lo clásico —polialfabético mecánico de período impráctico— con el reflector haciendo idéntica la operación de cifrar y descifrar; aun así cae, por varias vías y no solo por la captura de una máquina.

### Para el parcial — Clase 1
- Dar la definición formal completa de [[cifrado-por-rotacion|rotación]], [[cifrado-de-sustitucion-monoalfabetica|sustitución]] y [[cifrado-de-vigenere|Vigenère]] —tres conjuntos y tres algoritmos, no solo la fórmula— (Ej. 1 de la [[guia-01-criptografia-clasica|Guía 1]]).
- Motivos de falla distintos: rotación por $\lvert\mathcal{K}\rvert$ pequeño, sustitución por frecuencias preservadas, Vigenère por descomponerse en $t$ rotaciones.
- Enunciar [[secreto-perfecto|secreto perfecto]] y aplicarlo a $\ell=1$ de la rotación; la versión en castellano —del 90 % al 91 % ya lo rompe— justifica usar probabilidades. Practicar en [[1p-secreto-perfecto|Secreto perfecto, demostrado]].
- Ataque completo a Vigenère: [[test-de-kasiski|Kasiski]] propone el período, el [[indice-de-coincidencia|IC]] lo confirma, y el método de coincidencia mutua alinea las columnas estimando los corrimientos relativos hasta reducir todo a una sola rotación. Practicar en [[1p-criptoanalisis-clasico|Criptoanálisis clásico]] y en la [[practica-01-esquemas-y-taxonomias|Práctica 01]].
- Trampa de filmina: el rango de la clave de rotación vale $\mathcal{K}=\mathbb{Z}_n$, con el $0$ incluido.
- Trampa de [[ataque-de-fuerza-bruta|fuerza bruta]]: $\lvert\mathcal{K}\rvert$ astronómico ($27!$) no basta si el lenguaje queda expuesto.

## C2 · Cifrado

El [[one-time-pad|OTP]] demuestra que el [[secreto-perfecto|secreto perfecto]] existe y que es demasiado caro; el resto de la clase construye, paso a paso, imitaciones cada vez más baratas de ese ideal mediante la [[seguridad-computacional|seguridad computacional]], los [[modos-de-encadenamiento|modos de encadenamiento]] y primitivas concretas como `AES`. Notación y símbolos siguen [[notacion-y-terminologia|Notación y terminología]].

### Secreto perfecto y el One Time Pad

El [[one-time-pad|One Time Pad]] xorea el mensaje con una clave uniforme del mismo largo, y es la prueba de que el [[secreto-perfecto|secreto perfecto]] se alcanza. Trae tres malas noticias: secreto perfecto exige $\lvert K\rvert \ge \lvert C\rvert$, reutilizar la clave la cancela y expone $c_1 \oplus c_2 = m_1 \oplus m_2$, y la clave debe ser aleatoria. Los dos resultados de reducibilidad cierran la puerta: no existe otro esquema perfectamente secreto, el OTP es esencialmente el único.

### Seguridad computacional

Ante el costo del OTP, la [[seguridad-computacional|seguridad computacional]] relaja dos cosas a la vez: limita al adversario a tiempo polinomial probabilístico ([[notacion-y-terminologia#6. Adversario y recursos|PPT]]) y admite una probabilidad de éxito [[notacion-y-terminologia#Función despreciable|despreciable]] en el nivel de seguridad. Una función $\varepsilon(n)$ es despreciable si decae más rápido que la inversa de todo polinomio, a partir de algún $N$; esa clausura es lo que permite demostrar por reducción. Ese nivel tiene fecha de vencimiento: crece con la capacidad de cómputo disponible.

### Cifrado de flujo y generadores pseudoaleatorios

El [[criptosistema-de-flujo|criptosistema de flujo]] reemplaza la clave del OTP por $G(k)$, con $\lvert K\rvert \lll \lvert M\rvert$: no puede tener secreto perfecto, pero pasa [[pruebas-de-indistinguibilidad#1. Eav_A,Π — indistinguibilidad ante observador|Eav]] si $G$ es un [[generador-pseudoaleatorio|generador pseudoaleatorio]], es decir, si su salida es indistinguible del azar para toda prueba estadística de una familia dada. Al ser determinístico, falla ante múltiples cifrados con la misma clave.

### Pruebas de indistinguibilidad

Las [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]] miden formalmente esa seguridad. [[pruebas-de-indistinguibilidad#1. Eav_A,Π — indistinguibilidad ante observador|Eav]] deja ver un solo criptograma; [[pruebas-de-indistinguibilidad#2. Mul_A,Π — múltiples cifrados|Mul]] da varios cifrados con la misma clave; [[pruebas-de-indistinguibilidad#3. CPA_A,Π — texto plano escogido|CPA]] agrega un oráculo de cifrado y es la exigencia más fuerte de las tres. Un esquema determinístico nunca pasa `CPA`: el adversario compara el criptograma del oráculo con el del desafío y acierta con probabilidad 1. El caso $\varepsilon = 0$ en `Eav` es exactamente el secreto perfecto, visto como límite. Pasar `CPA` con un mensaje implica pasarla con múltiples; con `Eav` no: el flujo pasa `Eav` con uno y falla `Mul` con dos ([[pruebas-de-indistinguibilidad#Propiedades de CPA|propiedades de CPA]]).

### Cifrado probabilístico y primitivas de bloque

La reparación es el [[cifrado-probabilistico-nonce-e-iv|cifrado probabilístico]]: se agrega un nonce o `IV` que no se repite con la misma clave, y el keystream pasa a depender de $G(k, \mathrm{IV})$. Un nonce solo exige unicidad; un `IV` aleatorio exige además impredecibilidad, condición que necesita [[modos-de-encadenamiento#CBC — Cipher Block Chaining|CBC]]. Sobre bloques de tamaño fijo actúa la [[primitiva-de-cifrado-en-bloque|primitiva de cifrado en bloque]]: una función pseudoaleatoria con clave, determinística, que por sí sola no es un criptosistema usable — le falta ser probabilística, cifrar cualquier largo y pasar [[pruebas-de-indistinguibilidad#3. CPA_A,Π — texto plano escogido|CPA]].

### Modos de encadenamiento

Los [[modos-de-encadenamiento|modos de encadenamiento]] cierran esas tres distancias.

| Modo | Usa | Necesita | CPA-Secure | Propagación (error en $C_i$) |
|---|---|---|---|---|
| [[modos-de-encadenamiento#ECB — Electronic Codebook\|ECB]] | Enc y Dec | nada | no (prohibido) | 1 bloque destruido |
| [[modos-de-encadenamiento#CBC — Cipher Block Chaining\|CBC]] | Enc y Dec | `IV` aleatorio | sí | 2 bloques |
| [[modos-de-encadenamiento#CFB — Cipher Feedback\|CFB]] | solo Enc | `IV` aleatorio | sí | $1 + n/s$ segmentos |
| [[modos-de-encadenamiento#OFB — Output Feedback\|OFB]] | solo Enc | `IV` aleatorio | sí | 1 bit, nada más |
| [[modos-de-encadenamiento#Counter (CTR)\|CTR]] | solo Enc | nonce único | sí, si no se repite $(k,\text{nonce})$ | 1 bit, nada más |

Las pruebas de seguridad son por reducción a que la primitiva sea pseudoaleatoria; `CFB` realimenta el criptograma, `OFB` la salida de la primitiva y `CTR` no realimenta nada; en el canal, `CBC` es autosincronizante ante errores de bit pero no ante bloques perdidos.

### DES, 3-DES, AES y los cuerpos finitos

[[des-y-3des|DES]] es una red de Feistel de 16 rondas sobre bloques de 64 bits con clave de 56 bits efectivos; sus claves débiles (4) hacen que el key schedule genere una sola subclave en vez de 16. Cayó por fuerza bruta, no por criptoanálisis, y 3-DES lo sucede con tres claves y seguridad de unos 112 bits por el ataque meet-in-the-middle. [[aes|AES]] lo reemplazó por concurso abierto del NIST: bloques de 128 bits, claves de 128, 192 o 256, y por ronda Byte Sub (el único paso no lineal, inversión en el [[cuerpos-finitos-y-campos-de-galois|campo de Galois]] $\mathrm{GF}(2^{8})$), Shift Row, Mix Column y Add Round Key; la primera ronda solo tiene Add Round Key y la última no tiene Mix Column. Lo examinable es esa estructura algebraica, no las tablas.

### Teoría de números y elección de primitivas

Como preparación de la asimetría que sigue, la clase deja como tarea repasar [[aritmetica-modular-y-divisibilidad|divisibilidad, mcd y congruencia módulo m]], el [[algoritmo-de-euclides-extendido|algoritmo de Euclides extendido]] para resolver la ecuación diofántica y obtener coeficientes de Bézout, y el [[inverso-modular|inverso modular]], que existe si y solo si $a$ es coprimo con $m$. Sobre la ingeniería, la regla de [[eleccion-de-primitivas|elección de primitivas]] es no desarrollar criptografía propia sino usar bibliotecas escrutadas (`AES-CBC`, `AES-CTR`, Salsa20), reservando el vocabulario de [[estado-de-un-criptosistema|estado de un criptosistema]] —seguro cuando lo mejor que puede hacer el atacante es probar todas las claves, debilitado si hay ataques mejores pero impracticables, quebrado si son practicables; no son excluyentes, porque cada prueba cubre un escenario— para decidir qué entra a un proyecto nuevo: ni debilitado ni quebrado.

### Para el parcial — Clase 2
- Demostrar el secreto perfecto del OTP nombrando las hipótesis del Lema 1 y cerrando por Bayes, y enunciar los dos resultados de reducibilidad: practicar en [[1p-secreto-perfecto|Secreto perfecto, demostrado]] y en la [[guia-02-criptografia-simetrica|Guía 2]].
- Distinguir `Eav`, `Mul` y `CPA` y saber cuál rompe cada esquema: determinístico no pasa `Mul` ni `CPA`; flujo sin `IV` pasa `Eav` pero no `Mul`; `ECB` no es `CPA`-seguro. El esquema inventado de bloque de los parciales viejos se resuelve en [[1p-esquema-de-bloque|¿Es válido este esquema de bloque?]].
- La respuesta se escribe como experimento completo: pasos numerados, cada componente nombrado y la cuenta de $\Pr[\text{experimento}=1]$; no alcanza la idea ([[pruebas-de-indistinguibilidad#Cómo se escribe la respuesta: el aviso de la clase sobre el parcial|cómo se escribe la respuesta]]).
- Saber qué modo necesita `IV` aleatorio y cuál solo nonce único, y la propagación de errores de cada uno: practicar con la [[practica-03-seudoaleatoriedad-y-modos|Práctica 3]] y los videos de la [[practica-02-videos|Práctica 2]].
- Codificar no es cifrar: sin clave, el observador de `Eav` gana con probabilidad 1; es pregunta frecuente de examen.
- De `AES` va la estructura algebraica sobre $\mathrm{GF}(2^{8})$, no el key schedule; los números con su unidad: `DES` son 56 bits de clave, 3-DES unos 112 (nunca 168), `AES` 128/192/256.
- Trampa típica: el $2^{47}$ o el $2^{43}$ de los criptoanálisis de `DES` son textos planos requeridos, no espacio de claves.

## C3 · MAC y cifrado autenticado

Un criptosistema `CPA-Secure` no impide adulterar el mensaje, como muestra la [[maleabilidad|maleabilidad]]. La clase resuelve la integridad con el [[message-authentication-code|MAC]], suma las [[funciones-de-hash-criptograficas|funciones de hash]], la primera primitiva sin clave, y cierra componiendo cifrado y MAC en el [[cifrado-autenticado|cifrado autenticado]].

### Maleabilidad: el cifrado no alcanza

- **[[maleabilidad|Maleabilidad]]** — un criptograma se transforma en otro que descifra a un mensaje relacionado, sin conocer la clave ni el mensaje.
- Con [[criptosistema-de-flujo|cifrado de flujo]], $\mathsf{Dec}_k(c\oplus x) = m \oplus x$: xorear el criptograma con un valor conocido $x$ cambia el mensaje exactamente en $x$.
- El [[cifrado-probabilistico-nonce-e-iv|IV]] no protege esto: mientras no se lo toque, el keystream es el mismo y la cuenta vale igual; alcanza con conocer el formato, que es público, no el mensaje ni la clave.

### CCA: ningún cifrado visto lo pasa

- **[[ataque-de-texto-cifrado-escogido|CCA]]** — la prueba [[pruebas-de-indistinguibilidad|CPA]] con un oráculo de descifrado, con la única restricción de no consultar el criptograma del desafío.
- Ningún criptosistema previo es `CCA-Secure`: el cifrado de flujo cae con una sola consulta.
- `CCA` es estrictamente más fuerte que `CPA`: todo esquema `CCA-Secure` es `CPA-Secure`, pero no vale la vuelta.

### MAC: la terna y qué garantiza

- **[[message-authentication-code|MAC]]** — terna $\mathsf{Gen}$, $\mathsf{Mac}$, $\mathsf{Vrfy}$ con clave compartida: $\mathsf{Mac}_k(m)=t$ etiqueta, $\mathsf{Vrfy}_k(m,t)\in\{0,1\}$ verifica.
- Da integridad y autenticación de origen entre quienes comparten la clave; no da confidencialidad ni no repudio, por ser simétrica.
- `Vrfy` no invierte nada: devuelve un bit, no reconstruye el mensaje. La etiqueta es pública; solo la clave se protege.

### Seguridad de un MAC y los MACs de juguete

- **[[seguridad-de-un-mac|Mac-Forge]]** — el adversario recibe un oráculo $\mathsf{Mac}_k(\cdot)$, junta las consultas $Q$ y gana si emite $(m,t)$ válido con $m\notin Q$; un MAC infalsificable cumple $\Pr[\text{gana}]\le\mathsf{negl}(n)$, despreciable a secas y no $0{,}5+\mathsf{negl}(n)$.
- Falsificación en una consulta: $\mathsf{Mac}_k(m)=k\oplus\mathsf{first}_n(m)$ solo cubre los primeros $n$ bits. Moraleja: la etiqueta tiene que depender de todos los bits del mensaje.
- El [[construccion-de-macs-a-partir-de-una-prf|MAC de longitud fija]] $t=F_k(m)$, con $F$ pseudoaleatoria, es seguro solo si $\lvert m\rvert=n$.
- La extensión genérica con campos $r\Vert L\Vert i\Vert m_i$ sirve para cualquier longitud, pero es ineficiente.

### CBC-MAC y sus extensiones seguras

- **[[cbc-mac|CBC-MAC]]** — $t_0=0^{n}$, $t_i=F_k(t_{i-1}\oplus m_i)$, se publica solo $t_j$; un [[cifrado-probabilistico-nonce-e-iv|IV]] aleatorio rompería el esquema, porque viajaría junto a la etiqueta.
- Seguro solo a longitud fija: con dos consultas ($A\Vert B$ y $A$) se falsifica un tercer mensaje con probabilidad 1, reusando el estado intermedio que la cadena larga descarta.
- Tres extensiones seguras: clave derivada de la longitud, longitud como prefijo, o dos claves cifrando la etiqueta final. La longitud como sufijo no sirve: la cadena es segura solo si el conjunto consultado es *prefix-free*.

### Funciones de hash y las tres resistencias

- **[[funciones-de-hash-criptograficas|Hash]]** — par $\mathsf{Gen}/\mathsf{Hash}$ que comprime cualquier mensaje a $L$ bits; el selector $s$ es público, no una clave, y sirve para impedir precomputar colisiones.
- Las [[resistencias-de-una-funcion-de-hash|tres resistencias]]: preimagen (dado $y$, hallar $x$), segunda preimagen (dado $x$, hallar $x'\ne x$) y colisión (hallar cualquier par). Más grados de libertad, propiedad más fuerte: resistencia a colisiones implica las otras dos, pero solo asintóticamente (etiquetas grandes, muchos mensajes); en dominios chicos la implicación se cae. Las colisiones siempre existen por el principio del palomar.
- [[seguridad-de-las-funciones-de-hash|Costo genérico]]: preimagen y segunda preimagen cuestan $2^{L}$, colisión cuesta $\Theta(2^{L/2})$ por la paradoja del cumpleaños; de ahí que un hash lleve el doble de bits que una clave.
- El [[ataque-de-diccionario-sobre-hashes|ataque de diccionario]] no rompe ninguna resistencia: si el dominio de entradas es pequeño, se enumera y se compara digest a digest.

### Merkle-Damgård, HMAC y los estándares

- **[[construccion-de-merkle-damgard|Merkle-Damgård]]** — $z_i=h^{s}(z_{i-1}\Vert x_i)$, con un bloque final de longitud.
- Si la compresión es resistente a colisiones, el hash completo también lo es; sin el bloque de longitud, $x$ y $x\Vert 0$ rellenan igual y colisionan sin criptoanálisis.
- De ahí la extensión de longitud: el digest es el estado interno, así que $\mathsf{Mac}_k(m)=H(k\Vert m)$ se falsifica extendiendo la cadena.
- **[[primitivas-de-hash-estandar|MD5 y SHA-1]]** están quebradas; `SHA-2` es seguro y `SHA-3`, con Keccak, es el recomendado hoy.
- **[[hmac|HMAC]]** — $H^{s}\bigl((k\oplus\mathsf{opad})\Vert H^{s}((k\oplus\mathsf{ipad})\Vert m)\bigr)$, con `ipad` en `0x36` y `opad` en `0x5C` (la filmina las intercambia); es la instanciación práctica de `NMAC`.
- `HMAC` no es más seguro que [[cbc-mac|CBC-MAC]]: es más barato por byte, y por eso domina en las bibliotecas. Qué usar depende también del [[riesgo-y-seguridad-relativa|riesgo]]: una primitiva quebrada puede alcanzar en un escenario de bajo valor.

### Privacidad e integridad, cifrado autenticado y modos

- Las [[privacidad-e-integridad|tres combinaciones]] de cifrado y [[message-authentication-code|MAC]]: cifrar y autenticar (inseguro, la etiqueta filtra información), autenticar y luego cifrar (requiere prueba caso por caso) y cifrar y luego autenticar (siempre seguro, con claves independientes). Solo la tercera tiene demostración general, y por eso gana en [[agilidad-criptografica|agilidad criptográfica]]: permite cambiar el MAC sin rehacer la prueba.
- **[[cifrado-autenticado|Cifrado autenticado]]** — $c\leftarrow\mathsf{Enc}_{k_1}(m)$, $t\leftarrow\mathsf{Mac}_{k_2}(c)$; se verifica antes de descifrar, con un símbolo de fallo nuevo, $\perp$. El resultado es [[ataque-de-texto-cifrado-escogido|CCA]]-Secure.
- **[[ccm-y-gcm|CCM y GCM]]** dan cifrado autenticado con una sola clave: `CCM` une counter con [[cbc-mac|CBC-MAC]] a dos pasadas; `GCM` une counter con `GHASH` en una pasada y es hoy el más usado. Repetir el nonce en `GCM` compromete toda la integridad de esa clave.
- Un MAC infalsificable no impide el [[ataques-de-repeticion-y-frescura|replay]]: [[seguridad-de-un-mac|Mac-Forge]] no exige frescura. La frescura se agrega en el protocolo, con número de secuencia o timestamp.

### Para el parcial — Clase 3
- Reconstruir la cuenta $\mathsf{Dec}_k(c\oplus x)=m\oplus x$; practicar en [[1p-mac-hash-e-integridad|MAC, hash e integridad]], [[1p-mac-y-hash-en-parciales-viejos|parciales viejos]], la [[guia-03-mac-y-funciones-de-hash|Guía 3]] y la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]], fuente única sobre replay.
- Escribir `CCA` con su única restricción y el [[ataque-de-texto-cifrado-escogido#El adversario, completo|adversario contra el flujo]]: invertir el último bit del desafío, pedir el descifrado de ese $c'\ne c$ (es legal) y leer cualquier otro bit; acierta con probabilidad 1. La misma estructura, anular con un xor conocido y leer, reaparece en el ataque al CBC-MAC.
- Escribir [[seguridad-de-un-mac|Mac-Forge]] completo: la cota es despreciable a secas, no $0{,}5+\mathsf{negl}(n)$. Falsificar los tres MACs de juguete de la filmina 17.
- [[cbc-mac|CBC-MAC]] con su ataque de longitud variable y las tres extensiones seguras; trampa: creer que un [[cifrado-probabilistico-nonce-e-iv|IV]] aleatorio ayuda, vale $t_0=0^{n}$ fijo. Errata de [[hmac|HMAC]]: vale ipad = 0x36 y opad = 0x5C, al revés de la filmina.
- Las tres resistencias con su jerarquía y su salvedad (en dominios chicos no vale, y eso habilita el ataque de diccionario del Ej. 6 de la Guía 3); donde dice "libre de colisiones" hay que leer "resistente a colisiones".
- Las tres formas de combinar privacidad e integridad, y por qué solo la tercera tiene prueba general con claves independientes.

## C4 · Criptografía asimétrica y firma digital

La criptografía de clave pública resuelve el problema de fondo de la [[distribucion-de-claves-y-kdc|distribución de claves]] con un par de claves —una pública, la otra privada— y juzga cada esquema con el método de las clases anteriores: un experimento por objetivo, [[criptosistema-asimetrico|Eav]] para cifrar y [[firma-digital|Sig-forge]] para firmar.

### Distribución de claves y el problema de fondo

- Con una clave simétrica por par de participantes, el total crece en forma cuadrática:
$$
\binom{n}{2} = \frac{n(n-1)}{2}
$$
- El [[distribucion-de-claves-y-kdc#KDC — Key Distribution Center|KDC]] (*Key Distribution Center*) baja el costo a $n$ claves, repartiendo una clave de sesión cifrada con la clave fija de cada parte.
- Precio: un único punto de falla y una base mínima de confianza que solo se achica, nunca desaparece.

### Álgebra necesaria: grupos, anillos y cuerpos

- **Grupo** — conjunto con operación cerrada, asociativa, con neutro e inverso para cada elemento.
- Un elemento **genera** un subgrupo cíclico; su **orden** es su tamaño, y es **primitivo** si genera el grupo entero ([[grupos-anillos-y-cuerpos|Grupos, anillos y cuerpos]]).
- **Anillo** — agrega un producto al grupo aditivo; **cuerpo** — exige inverso para todo elemento no nulo.
- El grupo canónico de esta clase es $\mathbb{Z}_p^{*}$, con $p$ primo; con $n$ compuesto, solo los coprimos con $n$ forman $\mathbb{Z}_n^{*}$, de tamaño [[cuerpos-finitos-y-campos-de-galois|φ(n)]].

### Intercambio de claves y el experimento KE

- Un protocolo de [[intercambio-de-claves|intercambio de claves]] produce una transcripción pública y dos claves locales, con la condición $k_a = k_b$.
- El experimento $\mathsf{KE}$ mide seguridad frente a un adversario pasivo, que recibe la transcripción.
- Con probabilidad $0{,}5$ le dan la clave real o una aleatoria, y debe distinguirlas: no alcanza con "no poder calcular la clave", porque eso dejaría afuera la fuga de bits parciales.

### Diffie-Hellman

- [[diffie-hellman|Diffie-Hellman]] (1976): $A$ envía $h_1=g^{x}$, $B$ responde $h_2=g^{y}$, y ambos calculan $k=g^{xy}$ sin transmitirlo nunca.
$$
k_a = h_2^{\,x} = g^{xy} = h_1^{\,y} = k_b
$$
- La seguridad se apoya en el logaritmo discreto —necesario, no suficiente— y en la conjetura [[diffie-hellman#Capa 2 — la conjetura de decisión Diffie-Hellman (DDH)|DDH]], que exige que $g^{xy}$ sea indistinguible de un elemento aleatorio del grupo.
- Es seguro solo contra un adversario pasivo: uno activo sustituye $h_1$ y $h_2$ en un ataque de [[ataques-activos-y-man-in-the-middle|man-in-the-middle]], sin resolver el logaritmo discreto ni `DDH`.
- La defensa es autenticar cada valor enviado, con [[firma-digital|firma digital]] o un [[message-authentication-code|MAC]]. Domina en la práctica por su simplicidad.

### RSA y El Gamal

- Un [[criptosistema-asimetrico|criptosistema asimétrico]] cifra con la clave pública $pk$ y descifra con la privada $sk$; las claves no son intercambiables.
- El adversario de $\mathsf{Eav}$ recibe $pk$: ya tiene la función de cifrado de fábrica.
- Eso ya implica [[pruebas-de-indistinguibilidad|CPA]]-seguridad y obliga a que el cifrado sea probabilístico.
- [[rsa|RSA]] de libro de texto: $n=pq$, $\varphi(n)=(p-1)(q-1)$, $e$ coprimo con $\varphi(n)$ y $d\equiv e^{-1}\pmod{\varphi(n)}$ por [[algoritmo-de-euclides-extendido|Euclides extendido]]; $pk=(n,e)$, $sk=(n,d)$; $\mathsf{Enc}_{pk}(m)\equiv m^{e}$ y $\mathsf{Dec}_{sk}(c)\equiv c^{d}\pmod n$, y cierra por Euler-Fermat.
- Es determinístico y falla con mensajes pequeños: si $m^{e}<n$ se recupera $m$ con una raíz $e$-ésima entera.
- [[pkcs1-y-tamano-de-claves|PKCS#1 v1.5]] arregla el determinismo con relleno aleatorio antes de cifrar:
$$
m' = \texttt{00}\;\Vert\;\texttt{02}\;\Vert\;r\;\Vert\;\texttt{00}\;\Vert\;m
$$
- Se conjetura `CPA`-seguro, pero no es [[ataque-de-texto-cifrado-escogido|CCA]]-seguro: el ataque de Bleichenbacher usa un oráculo de padding válido o inválido.
- [[el-gamal|El Gamal]] extiende Diffie-Hellman un paso: cifra $c=(g^{y},\,h^{y}m)$ y descifra $c_2/c_1^{x}=m$; es probabilístico sin padding y `CPA`-seguro bajo `DDH`, y corre sobre cualquier grupo, incluidas las curvas elípticas.

### Costo del cifrado asimétrico

- La [[costo-del-cifrado-asimetrico|seguridad asimétrica]] no es un espacio de fuerza bruta: es relativa al conjunto donde vive el problema difícil.
- Sobre campos numéricos, $1024$ bits es piso histórico; la recomendación actual es $1536$ o $2048$ bits. Sobre curvas elípticas alcanzan unos $320$ bits, porque no se conoce ataque subexponencial contra ese logaritmo discreto.
- Los bits asimétricos y los simétricos no se comparan uno a uno.

### Firma digital

- La [[firma-digital|firma digital]] traslada el objetivo de un [[message-authentication-code|MAC]] a clave pública, con las claves en rol opuesto: se firma con $sk$ y se verifica con $pk$.
- La terna es $(\mathsf{Gen},\mathsf{Sign},\mathsf{Vrfy})$, y la seguridad se mide con el experimento $\mathsf{Sig\text{-}forge}$.
- Verificar con otra clave da tres propiedades que un `MAC` no tiene: verificación pública, transferibilidad y no repudio.
- [[rsa-signature-y-hashed-rsa|RSA-Signature]] sin hash está roto con probabilidad $1$: elegir $s$ al azar y definir $m:=s^{e}\bmod n$ verifica sin consulta previa, y la [[maleabilidad|maleabilidad multiplicativa]] de `RSA` permite combinar dos firmas consultadas para forjar una tercera.
- [[rsa-signature-y-hashed-rsa|Hashed RSA]] firma $H(m)$ en vez de $m$ y así rompe esa estructura.
- Su prueba de seguridad solo existe asumiendo un modelo ideal de $H$, que ninguna función real satisface.
- El [[digital-signature-standard|Digital Signature Standard]] opera sobre el logaritmo discreto en un subgrupo de orden $q$ dentro de $\mathbb{Z}_p^{*}$, con un $k$ efímero por firma: reutilizarlo entre dos firmas permite despejar la clave privada.

### Cifrado híbrido

- El [[cifrado-hibrido|cifrado híbrido]] cifra con $pk$ una clave simétrica fresca, y con esa clave el mensaje entero.
- Es [[pruebas-de-indistinguibilidad|CPA]]-seguro si el esquema de clave pública lo es y el simétrico resiste una sola escucha; es lo que hacen `TLS` y PGP.

### Para el parcial — Clase 4
- El primer parcial del 24/09 toma las Clases 1 a 5 y las Guías 1 a 4; sobre esta clase conviene [[1p-cuentas-de-asimetrica|Cuentas de asimétrica]], [[1p-asimetrica-en-las-guias|Asimétrica en la Guía 4]], la [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital|Guía 4]] y la [[practica-05-de-la-clave-privada-a-la-clave-publica|Práctica 05]].
- [[diffie-hellman|Diffie-Hellman]] es ejercicio completo, no solo verdadero o falso: justificar por qué $q$ debe ser primo, dónde reside la seguridad computacional, y que no resiste atacante activo y que la exponenciación modular es cara.
- Vale: el padding aleatorio de [[rsa|RSA]] es para volverlo `CPA`-seguro, no para resistir texto cifrado elegido; la afirmación contraria es una trampa típica de examen.
- Las claves no son intercambiables: un esquema que cifra con la privada no da confidencialidad, y una firma generada con la pública no da no repudio.
- Las ternas y sus experimentos son el patrón de examen "¿este esquema sigue siendo seguro?"; [[rsa-signature-y-hashed-rsa|RSA-Signature]] sin hash es ese ejercicio ya resuelto, con dos ataques de probabilidad $1$.
- Los ejemplos numéricos de `RSA` y [[el-gamal|El Gamal]] cierran exactamente y son el molde para calcular cifrado y descifrado con parámetros dados; uno pequeño de Diffie-Hellman da clave $1$ cuando $xy\equiv 0$ módulo el orden (los dos ejemplos de la cátedra lo hacen), por eso conviene que el orden sea primo.
- Certificados y PKI entran en el Verdadero/Falso de los parciales viejos ([[1p-verdadero-o-falso|Verdadero o falso]]) aunque son de la [[clase-05-protocolos-criptograficos|Clase 05]]: lo que esta clase fija es que una firma por sí sola no dice quién es el dueño de la clave pública.

## C5 · Protocolos criptográficos

La clase rompe el [[intercambio-de-claves|intercambio de claves]] de la Clase 04 con un adversario que además de escuchar escribe en el canal, y arma dos respuestas —[[infraestructura-de-clave-publica|PKI]] con certificados para lo asimétrico, [[needham-schroeder|Needham-Schroeder]] con un KDC para lo simétrico— que convergen en [[tls-arquitectura-y-record|TLS]].

### Ataques activos y man in the middle

Un canal seguro exige una clave ya compartida y el intercambio de claves la provee; el ataque [[ataques-activos-y-man-in-the-middle#Los cuatro poderes de un atacante activo|man in the middle]] (`MITM`) rompe su premisa —que la clave pública recibida sea la de $B$— con cuatro poderes sobre el canal:

| Poder | Qué permite |
|---|---|
| Omitir | descarta un mensaje |
| Reescribir | cambia su contenido |
| Reordenar | altera la secuencia |
| Repetir | reinyecta uno ya enviado |

Contra la sustitución de clave pública en un repositorio, ningún esquema visto hasta la Clase 04 sobrevive: $E$ no bloquea la consulta de $A$, le entrega su propia $pk_e$ en la respuesta y traduce en tiempo real entre $\mathrm{Enc}_{pk_e}$ y $\mathrm{Enc}_{pk_b}$. La conclusión de la cátedra: el problema no es de la función de cifrado, es de administración de claves.

### PKI y certificados digitales

La [[infraestructura-de-clave-publica#Definición y objetivo|PKI]] (*Public Key Infrastructure*) asocia una identidad a una clave pública para evitar la suplantación; no aplica a criptosistemas simétricos, cuyo análogo es un [[distribucion-de-claves-y-kdc|KDC]].

Un [[certificados-digitales#Definición: qué contiene un certificado|certificado digital]] es un mensaje firmado por una autoridad competente que ata identidad, clave pública, fecha de emisión, intervalo de validez y tipo de uso. Habilita cuatro verificaciones: identidad por el campo `CN`, la clave pública del titular, la validez de uso y vigencia, y la integridad de la firma.

### Cadenas de confianza, X.509 y revocación

Quién firma al certificador es una recursión que corta en una [[cadenas-de-firmas-y-autoridades-raiz#El concepto de AC raíz, en una frase|AC raíz]], autofirmada; no hay una raíz universal, sino una lista de AC preinstalada en sistemas y navegadores. Un certificado viaja con su cadena completa: $C_a = C'_a \Vert C_{CA_3}\Vert C_{CA_2}\Vert C_{CA_1}$.

El estándar [[x509|X.509]] se verifica en cinco pasos: obtener la clave pública del emisor, verificar la integridad de la firma, el intervalo de validez (del certificado y de la AC al momento de emisión), la identidad y el uso autorizado.

La [[revocacion-y-listas-crl#Las listas de revocación (CRL)|CRL]] invalida un certificado antes de su expiración —clave comprometida o cambio de dueño—; bajo `X.509` solo el emisor revoca, y la lista se consulta offline u online.

### Needham-Schroeder

El protocolo [[needham-schroeder|Needham-Schroeder]] es simétrico: un [[distribucion-de-claves-y-kdc|KDC]] que ya comparte una clave con cada parte genera una $k_s$ entre $A$ y $B$, y es la base de `Kerberos`. Con [[cifrado-probabilistico-nonce-e-iv|nonces]]: $1)\ A\to\mathrm{KDC}: A\Vert B\Vert r_1$; $2)\ \mathrm{KDC}\to A: \{A\Vert B\Vert r_1\Vert k_s\Vert\{A\Vert k_s\}_{k_b}\}_{k_a}$; $3)\ A\to B: \{A\Vert k_s\}_{k_b}$; $4)\ B\to A: \{r_2\}_{k_s}$; $5)\ A\to B: \{r_2-1\}_{k_s}$. $r_1$ ata el mensaje 2 a esta ejecución; 4 y 5 son el desafío-respuesta.

El [[needham-schroeder#El ataque: una clave de sesión vieja alcanza|ataque]]: comprometida cualquier $k_s$ vieja, $E$ arranca directamente desde el mensaje 3 —$\{A\Vert k_s\}_{k_b}$— y completa el desafío sin tocar al KDC, porque $B$ no tiene con qué distinguir una clave recién generada de una vieja.

### Denning-Sacco y frescura

La modificación [[denning-sacco-y-frescura#El arreglo: un timestamp adentro del ticket|Denning-Sacco]] agrega un timestamp $T$ adentro del ticket, $\{A\Vert T\Vert k_s\}_{k_b}$: $B$ lo compara contra su reloj y rechaza si cae fuera de la ventana $\Delta t$, sin llegar a emitir el desafío. No elimina la ventana de [[ataques-de-repeticion-y-frescura|frescura]]: la acota a $(\text{emisión de }T,\ T+\Delta t]$, a cambio de relojes sincronizados. El [[cifrado-probabilistico-nonce-e-iv|nonce]] protege a quien lo eligió: $r_1$ da frescura a $A$, no a $B$; el timestamp se la da a $B$.

### TLS: arquitectura, récord y suites

[[tls-arquitectura-y-record#Qué es SSL/TLS|TLS]] se intercala entre aplicación y transporte y da confidencialidad, integridad y autenticación sobre un transporte confiable (`TLS 1.2` = `SSL 3.3`). El [[tls-arquitectura-y-record#El TLS Record|TLS Record]] parte el mensaje en bloques de hasta $2^{16}$ bytes, los comprime, los hashea y los cifra, en ese orden.

Las [[suites-criptograficas-de-tls#El menú criptográfico|suites criptográficas]] combinan intercambio de clave, cifrado simétrico, hash o [[cifrado-autenticado|AEAD]] y [[firma-digital|firma]]. Solo el intercambio de clave decide si hay *forward secrecy*: con [[rsa|RSA]] el cliente cifra el *pre-master secret* con la clave del servidor, y comprometerla descifra todo el tráfico grabado; con [[diffie-hellman|Diffie-Hellman]] efímero (`DHE`/`ECDHE`) esa clave solo firma los parámetros de la sesión, y comprometerla solo permite suplantar a futuro.

### Sesión y conexión TLS

La [[sesion-y-conexion-tls#Sesión: lo que se negocia una vez y se puede reusar|sesión]] guarda lo negociado una vez y admite varias conexiones: identificador, certificado, método de compresión y de cifrado, y el *Master Secret* de 48 bytes. La [[sesion-y-conexion-tls#Conexión: los parámetros de uso, frescos por instancia|conexión]] guarda lo que cambia por instancia: nonces, [[cifrado-probabilistico-nonce-e-iv|IV]]s y claves de escritura y de [[message-authentication-code|MAC]] distintas por dirección, con números de secuencia independientes.

### TLS handshake y mensajes de control

El [[tls-handshake|handshake]] tiene cuatro partes: acordar parámetros (`ClientHello`/`ServerHello`, sin cifrar ni autenticar), autenticar al servidor con su certificado, completar lo que falta al servidor —con la versión $V$ repetida dentro del `ClientKeyExchange` para detectar el [[tls-handshake#Por qué V viaja de nuevo, adentro del ClientKeyExchange: el ataque de downgrade|ataque de downgrade]]— y confirmar bajo las claves nuevas con `Finish` en ambas direcciones.

[[change-cipher-spec-y-alert#Change Cipher Spec, como mensaje general|Change Cipher Spec]] dispara una renegociación de claves en cualquier momento de la conexión. [[change-cipher-spec-y-alert#TLS Alert|Alert]] informa eventos fuera de banda: advertencias que no cortan la conexión y fatales que la invalidan, además de `CloseNotify` para el cierre ordenado.

### Para el parcial — Clase 5
- El Ejercicio 1 del primer parcial es, con evidencia dura, un protocolo con la consigna «qué intenta construir, qué problema tiene»; practicarlo en [[1p-analizar-un-protocolo|Analizar un protocolo]], la [[1p-protocolos-en-parciales-viejos|Protocolos en parciales viejos]], la [[guia-04-manejo-de-claves-cifrado-asimetrico-y-firma-digital|Guía 4]] y la [[practica-05-de-la-clave-privada-a-la-clave-publica|Práctica 05]].
- Saber de memoria los cinco mensajes de [[needham-schroeder|Needham-Schroeder]] y los de [[denning-sacco-y-frescura|Denning-Sacco]], con el porqué de cada uno, y correr el ataque de clave vieja turno por turno: es el ejercicio con más probabilidad de aparecer tal cual.
- La verificación de [[x509|X.509]] en cinco pasos y qué contiene un [[certificados-digitales|certificado]]; trampa recurrente del verdadero/falso: confundir la clave pública de la AC con la del titular, y omitir la vigencia de la AC al momento de emisión.
- Reconocer un protocolo «tipo TLS» aunque venga disfrazado con otra notación: certificado, firma y confirmación mutua con un [[message-authentication-code|MAC]] sobre algo fresco, como en el 1C-2023.
- Trampa de filmina: la modificación vale como Denning-Sacco, por Dorothy Denning y Giovanni Sacco.
- Trampa de múltiple choice: [[tls-arquitectura-y-record|TLS]] da confidencialidad, integridad y autenticación bajo [[infraestructura-de-clave-publica|PKI]]; no depende de un [[distribucion-de-claves-y-kdc|KDC]] centralizado (eso es Needham-Schroeder) ni da no repudio, porque la clave de sesión vuelve a ser simétrica.

## C6 · Políticas de seguridad y control de acceso

Una [[politica-de-seguridad-y-sistema-seguro|política de seguridad]] particiona los estados de un sistema; [[bell-lapadula|Bell-LaPadula]], Biba y la muralla china formalizan esa partición, la misma matriz de acceso se proyecta en [[listas-de-control-de-acceso|ACLs]] o capacidades, y [[oauth-2|OAuth 2.0]] delega acceso sin compartir contraseñas.

### Política de seguridad y tríada C-I-D

- Una **[[politica-de-seguridad-y-sistema-seguro|política de seguridad]]** parte los estados de un sistema en autorizados y no autorizados; un **sistema seguro** arranca autorizado y nunca cruza esa frontera. Una violación de seguridad es esa transición, sin que importe la intención.
- **[[confidencialidad-integridad-y-disponibilidad|Confidencialidad, integridad y disponibilidad]]** comparten forma —conjunto $X$, información $I$— pero difieren en el cuantificador: **ningún** miembro de $X$ obtiene $I$ (ni por vías indirectas); **todo** miembro confía en $I$; **todo** miembro accede a $I$ cuando lo requiere.

### Paradigmas y lenguajes de política

- **[[paradigmas-de-control-de-acceso|DAC]]** (discrecional): quien crea la información fija el acceso y puede alterar las reglas. **[[paradigmas-de-control-de-acceso#Los dos paradigmas de la filmina|MAC]]** (mandatorio): las fija el sistema, sin negociación. No son excluyentes: Bell-LaPadula los combina, y lo discrecional solo restringe, nunca contradice, lo mandatorio.
- **[[lenguajes-de-descripcion-de-politicas|Lenguajes de política]]** de alto nivel son declarativos: **cerrados** (deny by default) o **abiertos** (allow by default). Los de bajo nivel son imperativos, como `xhost` o Tripwire.

### Bell-LaPadula, confidencialidad por niveles

Un **[[modelos-de-politica|modelo]]** describe una familia de políticas, no una política puntual, y reutiliza sus demostraciones. **[[bell-lapadula|Bell-LaPadula]]** protege confidencialidad con niveles totalmente ordenados y una función de etiquetado $L(\cdot)$:

$$
S \text{ lee } O \iff L(O) \le L(S), \qquad S \text{ escribe } O \iff L(S) \le L(O)
$$

Son la **condición simple** y la **\*-property (condición de cierre)**: se lee hacia abajo, se escribe hacia arriba. El **teorema básico** exige las dos: sin la de cierre, un sujeto de nivel alto podría leer un secreto y escribirlo en un objeto de nivel bajo. El **principio de tranquilidad** —los niveles no cambian tras crearse— sostiene el teorema. Con categorías, la dominancia $(l,C)\operatorname{dom}(l',C') \iff l'\le l \wedge C'\subseteq C$ da un orden **parcial**: dos compartimentos con categorías disjuntas no se dominan; la misma noción reaparece en la [[clase-09-flujo-de-informacion|Clase 09]].

### Modelos de integridad de Biba

**[[modelos-de-integridad-de-biba|Biba]]** invierte Bell-LaPadula: protege la modificación, no el flujo, con niveles de integridad $i(\cdot)$.

| Modelo | Lectura | Escritura |
|---|---|---|
| Low-Water-Mark | libre; degrada $i(s)$ a $\min(i(s),i(o))$ | $i(o)\le i(s)$ |
| Ring Policy | libre y sin costo, niveles estáticos | $i(o)\le i(s)$ |
| Strict Integrity | $i(s)\le i(o)$ | $i(o)\le i(s)$ |

Los tres comparten la regla de ejecución $s_1$ ejecuta $s_2 \iff i(s_2)\le i(s_1)$ y la de escritura; lo que los distingue es qué hacen con la lectura. Strict Integrity es el dual exacto de [[bell-lapadula|Bell-LaPadula]]: no se lee hacia abajo, no se escribe hacia arriba. En Low-Water-Mark los niveles decaen con el uso y eventualmente nadie puede generar objetos de nivel alto.

### Muralla china y composición de políticas

- La **[[muralla-china|muralla china]]** agrega memoria: un **[[muralla-china#Concepto y definiciones|CD]]** (Company Dataset) agrupa los objetos de una empresa; un **COI** agrupa los CD en conflicto de interés. Un sujeto lee un objeto si ya leyó otro del mismo CD, si ninguno leído comparte COI con él, o si está declasificado; leer un CD cierra para siempre los demás del mismo COI. La propiedad de cierre exige que, si el sujeto lee más de una empresa, no pueda escribir nada.
- **[[composicion-de-politicas|Componer]]** dos sistemas seguros no garantiza un sistema seguro. Dos principios guía: **autonomía** (lo que algún componente permite sigue permitido) y **seguridad** (lo que alguno prohíbe sigue prohibido). La composición adoptada hereda todas las prohibiciones; los accesos que ninguna política original menciona se permiten (Gong y Qian) o se deniegan por defecto. Hallar la composición mínima consistente es, en general, NP.

### Matriz de acceso, ACLs, capacidades y secretos compartidos

- La **[[matriz-de-control-de-acceso|matriz de control de acceso]]** asigna a cada par sujeto-objeto un conjunto de derechos, $M: S\times O \to 2^{R}$: es la más expresiva y cara. Se implementan sus dos proyecciones.
- **[[listas-de-control-de-acceso|ACL]]**$(o)$ agrupa por columna los pares (sujeto, derechos) de cada objeto, con denegar por defecto. **Grant-All** exige que todos los ACs aplicables otorguen el derecho; **First-Rule** usa el primero que encuentra sin combinar: resultados opuestos ante el mismo caso. `root` en Linux está exento de todo ACL; `administrator` en Windows tiene `take ownership` sobre todo pero sigue siendo una entrada de ACL.
- **[[listas-de-capacidades|Capacidades]]**, $CAP(s)$, proyectan por fila: el acceso **se posee**, no se consulta; se protegen con tags, segmentos protegidos o un hash con clave del sistema, y se revocan por indirección.
- Una **[[acls-propagables|ACL propagable]]** (PACL) sigue a la información, no al objeto: leer o escribir siempre interseca el PACL, nunca lo amplía — es una política de integridad de [[modelos-de-integridad-de-biba|Biba]] encubierta.
- El **[[secretos-compartidos-y-metodo-de-shamir|método de Shamir]]** reparte un secreto en $n$ sombras sobre un polinomio de grado $t-1$ en $\mathbb{Z}_p$: $t$ sombras lo reconstruyen por Lagrange evaluado en $x=0$, y menos de $t$ no filtran información.

### OAuth 2.0 y OpenID Connect

- **[[oauth-2|OAuth 2.0]]** delega acceso sin entregar la contraseña del dueño del recurso: cuatro roles (Resource Owner, Client, Resource Server, Authorization Server) y cuatro *grant types*: Authorization Code (cliente confidencial, el seguro por defecto), Implicit (cliente público: devuelve el token sin código), Resource Owner Password Credentials y Client Credentials (máquina a máquina). Un cliente confidencial corre en un servidor y guarda el `client secret`; uno público —escritorio, móvil o navegador— no puede (argumento de [[principio-de-kerckhoffs|Kerckhoffs]]: el binario llega al usuario). El código de autorización viaja por el navegador; el intercambio es servidor a servidor, fuera de él.
- **[[openid-connect-y-jwt|OpenID Connect]]** agrega autenticación sobre OAuth: un `id_token` en formato [[openid-connect-y-jwt#El bearer token es un JWT|JWT]], documento JSON firmado con claims como `sub`, `iss`, `aud` y `exp`. Autenticar (quién es: [[clase-07-autenticacion|Clase 07]]) y autorizar (qué puede hacer) son preguntas distintas.

### Para el parcial — Clase 6
- Escribir de memoria la condición simple y la de cierre de [[bell-lapadula|Bell-LaPadula]], con $\le$ y con $\operatorname{dom}$, y por qué hace falta la segunda.
- Las tres reglas de cada modelo de [[modelos-de-integridad-de-biba|Biba]]: se confunden porque comparten estructura; el eje que los separa es qué operación restringen.
- Los tres casos de la condición simple de la [[muralla-china|muralla china]] y su propiedad de cierre.
- Reconstruir un secreto de [[secretos-compartidos-y-metodo-de-shamir|Shamir]] con Lagrange dados el umbral y las sombras: practicado en [[parciales-viejos#Los ejercicios de Shamir, de la Guía 6|Ejercicio 14 de la Guía 6]]. Vale $\text{grado}=t-1$.
- Las fórmulas de [[matriz-de-control-de-acceso|matriz]], [[listas-de-control-de-acceso|ACL]] y [[listas-de-capacidades|capacidades]], su equivalencia teórica y las cuatro políticas de conflicto: Grant-All, First-Rule, Override y Augment.
- Los cuatro *grant types* de [[oauth-2|OAuth 2.0]] y qué viaja por el navegador contra qué nunca lo hace.
- Entra en el [[segundo-parcial|segundo parcial]] del 19/11, con las Clases 7 a 11.

## C7 · Autenticación

La [[autenticacion|autenticación]] asocia una identidad externa a un principal interno con un único modelo de cinco componentes, y ese molde organiza todo lo que sigue: los [[factores-de-autenticacion|factores]], el [[almacenamiento-de-claves|almacenamiento]] y los dos tipos de [[ataques-a-un-sistema-de-autenticacion|ataque]] que reparten cada defensa de la clase.

### El modelo formal de autenticación

- **Identidad** — vive fuera del sistema; el sistema no la controla ni puede impedir que dos entidades se llamen igual.
- **Principal** — la representación interna que el sistema crea y administra, y sobre la que corre el control de acceso.
- El modelo formal tiene cinco componentes: $A$ (información de autenticación, la aporta la entidad), $C$ (información complementaria, la guarda el sistema), $F:A\to C$ (complementación, típica del alta), $L:A\times C\to\{0,1\}$ (autenticación, corre en cada intento) y $S$ (selección: alta, baja, cambio).

### Factores de autenticación

- **Algo que conozco** (clave, frase secreta) — depende de la confidencialidad del secreto.
- **Algo que tengo** (token, celular, tarjeta) — el objeto se puede copiar o clonar.
- **Algo que soy** (huella, voz, cara) — no es 100% eficaz, y asume un lector no manipulable.
- **Dónde estoy o contexto** (red, país, horario) — el único factor con dos direcciones, positiva y negativa, y nunca funciona solo.

### Almacenamiento de claves

- Guardar la clave en texto plano no puede garantizar confidencialidad.
- Guardar un archivo cifrado solo se justifica cuando hace falta recuperar la clave original; la clave de acceso a ese archivo también hay que protegerla.
- El esquema Unix tradicional de `/etc/passwd` instancia el modelo completo: $A$ son secuencias de hasta ocho caracteres, $C$ concatena dos caracteres de [[salting|sal]] con once de digest, y $F$ son 4096 versiones modificadas de [[des-y-3des|DES]].

### Ataques a un sistema de autenticación

- El atacante no necesita el $a$ original: le alcanza con cualquier $a$ tal que $f(a)=c$, el mismo $c$ asociado a la entidad.
- **Ataque offline** — se prueban candidatos contra un $c$ ya robado, por ejemplo del archivo de claves visto en [[almacenamiento-de-claves|Almacenamiento de claves]]; sin límite de intentos, solo lo limita el cómputo disponible.
- **Ataque online** — se prueba directamente contra el sistema real vía $l(a)$; cada intento se puede auditar, limitar o bloquear.

### Complejidad, espacio de claves y políticas

- Esconder información sirve poco: por el [[principio-de-kerckhoffs|principio de Kerckhoffs]], $f$ suele conocerse igual, y es más fácil proteger $c$ que $a$.
- Las prevenciones online —tiempos crecientes ante fallas, deshabilitar cuentas, `CAPTCHA`— no hacen nada contra un [[ataques-a-un-sistema-de-autenticacion|atacante]] que ya tiene $c$.
- Contra ese atacante sirve subir la [[complejidad-y-espacio-de-claves|complejidad del espacio de claves]] con la fórmula de Anderson:
$$
P \ge \frac{T\cdot G}{N}
$$
- $P$ es la probabilidad de adivinar, $T$ el tiempo del ataque, $G$ las pruebas por segundo y $N$ el tamaño del espacio; el signo $\ge$ da un piso del riesgo, no un techo.
- Los [[ataque-de-diccionario-sobre-hashes|diccionarios]] y hasta las claves pronunciables recortan el $N$ efectivo sin tocar el alfabeto nominal.
- Las [[politicas-de-seleccion-y-expiracion-de-claves|políticas de selección]] comparan tres orígenes de clave —aleatoria, pronunciable y elegida por el usuario— y la expiración forzada exige tres condiciones para no ser contraproducente: evitar el reuso, evitar cambios demasiado seguidos y dar tiempo para pensar la clave nueva.

### Salting y PBKDF2

- El [[salting|salting]] guarda $f(a) = x \Vert f'(a,x)$, con una sal $x$ pública y distinta por cuenta.
- Protege contra un ataque offline en lote sobre muchas cuentas a la vez; no agrega nada contra un ataque a una sola cuenta, porque la sal es pública y la fórmula de Anderson no cambia con una víctima.
- [[pbkdf2|PBKDF2]] itera $c$ veces una [[primitiva-de-cifrado-en-bloque|función pseudoaleatoria]] sobre la contraseña y la sal, encadenando salidas; puede instanciarse con un criptosistema simétrico o un [[message-authentication-code|MAC]] (en la práctica, [[hmac|HMAC]]):
$$
u_1=\mathrm{PRF}(\mathit{pass},S),\quad u_j=\mathrm{PRF}(\mathit{pass},u_{j-1}),\quad u_1\oplus u_2\oplus\cdots\oplus u_j
$$
- No cambia la seguridad de la primitiva iterada: cambia el costo por intento, que es exactamente el $G$ de Anderson dividido por $c$.
- Lo que no resuelve: cada evaluación sigue siendo barata en memoria, así que el ataque se paraleliza en GPU o ASIC.

### Challenge-response y EKE

- El protocolo [[challenge-response-y-eke|challenge-response]] evita transmitir la clave: $B$ envía un desafío fresco $r$, y $A$ responde $f(k,r)$ sin enviar $k$.
- Requiere que $r$ sea impredecible, como un [[cifrado-probabilistico-nonce-e-iv|nonce]], y resuelve las dos fallas de enviarla: no hace falta canal seguro, y una captura vieja no sirve para la próxima ronda.
- Deja una rendija: si $r$ y $f(k,r)$ viajan en claro, quien escucha una sola ronda puede probar candidatas offline en su propia máquina.
- [[challenge-response-y-eke|EKE]] cierra esa rendija cifrando los tres mensajes con una clave de sesión independiente: no fortalece $f$, le saca al atacante el material contra el cual comparar.

### Autenticación remota y SSO

- Delegar la autenticación en un [[autenticacion-remota-y-sso|SSO]] implica necesariamente una relación de confianza: quien delega renuncia a controlar quién es cada principal.
- Entre las tecnologías abiertas, `OpenID` 1 y 2 están obsoletas; [[openid-connect-y-jwt|OpenID Connect]] está vigente y se apoya en [[oauth-2|OAuth2]] por debajo.
- En el modelo $(A,C,F,L,S)$, un SSO es mover el componente $L$ fuera del sistema que necesita el resultado.

### Para el parcial — Clase 7
- Entra en el [[segundo-parcial|segundo parcial]] (19/11); todavía no hay guía ni práctica con nota propia.
- Instanciar $(A,C,F,L,S)$ sobre un esquema dado es la consigna que más se repite; el ejemplo Unix y [[autenticacion|Autenticación]] traen casos resueltos.
- La fórmula de Anderson y sus despejes son el contenido más mecánico de [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]]: recordar que el signo es $\ge$ y no un techo, y practicar los despejes: $T$ con $P$ fijado (Ejemplos 1 y 2) y la longitud mínima vía $N$ (Ejemplo 3, que da 9 caracteres alfanuméricos).
- Vale: en el ejemplo con $N=26^{8}$, $G=10^{4}$ y $P=0{,}5$ el tiempo es $T\approx 10{,}4\times 10^{6}$ s, unos 121 días; la cifra en días es la confiable y la de segundos de la filmina está mal por un factor de 10.
- Saber qué defiende cada mitigación, si el lado offline o el online, atraviesa la segunda mitad de la clase: limitar intentos no protege un archivo ya robado, y una función lenta no impide probar `admin` contra el login.
- [[salting|Salting]] y [[pbkdf2|PBKDF2]] atacan costos distintos: la sal rompe la amortización entre víctimas, PBKDF2 sube el costo por evaluación, y ninguna sustituye a la otra.
- [[challenge-response-y-eke|Challenge-response y EKE]] son la base de todo protocolo de autenticación remota de la materia, ya presente en [[needham-schroeder|Needham-Schroeder]] de la [[clase-05-protocolos-criptograficos|Clase 05]].
- Lectura evaluable: el capítulo *Authentication* de Bishop, según el [[reglamento-y-evaluacion|reglamento]] — se busca por título, no por número de capítulo.

## C8 · Principios de diseño y vulnerabilidades

Los [[principios-de-diseno|ocho principios]] son el criterio de diseño; el [[modelado-de-amenazas|modelado de amenazas]] encuentra dónde se violó, y la [[metodologia-de-hipotesis-de-falla|metodología de hipótesis de falla]] lo comprueba contra el sistema real.

### Los ocho principios de diseño

Los **[[principios-de-diseno|ocho principios]]** de Saltzer y Schroeder aplican dos ideas madre: **simplicidad** (menos cosas pueden salir mal) y **restricción** (minimizar acceso y comunicación). Son principios guía, no reglas, y no son consistentes entre sí: separación de privilegios contradice economía de mecanismos.

| Principio | Exige | Ejemplo |
|---|---|---|
| Menor privilegio | Solo los privilegios necesarios para la tarea, por función, desechados tras su uso | web server: lee su config, escribe logs solo en *append* |
| Valores iniciales seguros | Denegar por defecto; ante un fallo, volver al estado inicial | `sshd` no abre otro puerto si falla el 22; Oracle con claves predefinidas |
| Economía de mecanismos | El mecanismo más simple posible | `finger`: respuesta infinita, *buffer overflow* |
| Mediación completa | Verificar todo acceso; un único mecanismo, no un único servidor | sin cachés; permiso revocado a mitad de un acceso |
| Diseño abierto | No depender del secreto del diseño; solo la clave permanece oculta | violarlo es seguridad por oscuridad; no aplica a las claves |
| Separación de privilegios | Más de una condición para otorgar un permiso (el método de [[secretos-compartidos-y-metodo-de-shamir\|Shamir]] lo implementa) | dos firmas del banco; un administrador no toca permisos de otro |
| Mecanismos exclusivos | No compartir mecanismos de seguridad (variables compartidas, [[canales-ocultos-y-side-channels\|canales ocultos]]); aislación por [[metodos-de-aislacion\|VM y sandbox]] | Apache reusó *syscalls* de log; iOS aísla cada proceso en su sandbox |
| Aceptación psicológica | No dificultar el uso correcto del mecanismo | firewalls personales; `UAC` de Vista |

El quinto es [[principio-de-kerckhoffs|Kerckhoffs]] un nivel más arriba: no significa publicar el código fuente.

### Confianza, aseguramiento y ciclo de vida

Un **[[confianza-y-aseguramiento|sistema confiable]]** cuenta con evidencia creíble de que cumple sus requerimientos: la confianza es gradual, no discreta. El **aseguramiento** la justifica con técnicas específicas, en la cadena política-aseguramiento-mecanismo, con tres niveles de evidencia —informal, semiformal, formal—: cuál elegir es una [[riesgo-y-seguridad-relativa|decisión de riesgo]], y el formal solo se justifica ante criticidad extrema.

El **[[aseguramiento-en-el-ciclo-de-vida|aseguramiento en el ciclo de vida]]** cubre todas las etapas del proyecto sobre nueve fuentes de problemas. La distinción central: una **amenaza** es el evento no deseado; una **vulnerabilidad**, lo que permite que ocurra, en la cadena bug, vulnerabilidad, amenaza y efecto no deseado.

### Modelado de amenazas y descomposición de la aplicación

El **[[modelado-de-amenazas|modelado de amenazas]]** documenta qué no se quiere que pase y por qué caminos podría pasar, en el ciclo iterativo de cinco pasos de Microsoft: identificar objetivos ([[confidencialidad-integridad-y-disponibilidad|C-I-D]]), conceptualizar la aplicación, descomponerla, identificar amenazas e identificar vulnerabilidades.

La **[[descomposicion-de-la-aplicacion|descomposición de la aplicación]]** (paso 3) ubica las zonas donde cambia el nivel de confianza requerido —**externas** (sistema de archivos, base de datos, web services) y **privilegiadas** (accesibles solo a un rol)— y refina el flujo de datos de lo grueso a lo fino: por capas, por páginas, por componentes.

### STRIDE, árboles de ataque e identificación de vulnerabilidades

**[[stride-y-arboles-de-ataque|STRIDE]]** entra en el paso 4 del [[modelado-de-amenazas|ciclo de modelado de amenazas]]: un cuestionario de seis letras que se aplica por cada frontera de confianza: *Spoofing*, *Tampering*, *Repudiation* (se contrarresta [[firma-digital|firmando]]), *Information disclosure*, *Denial of Service* y *Elevation of privilege*. El **árbol de ataque** descompone una amenaza ya identificada en las condiciones necesarias para que ocurra, unidas por conectores Y/O; crecen considerablemente, así que se limitan a lo esencial.

La **[[identificacion-de-vulnerabilidades|identificación de vulnerabilidades]]** (paso 5) revisa esas zonas contra esas amenazas para señalar el agujero concreto: modelar al nivel de detalle que permita la información disponible.

### Verificación formal contra prueba de penetración

La **[[verificacion-formal-y-prueba-de-penetracion|verificación formal]]** y el pentest comparten estructura de precondiciones y poscondiciones, y ambos prueban **existencia** de vulnerabilidades; solo la verificación formal puede probar **ausencia**, y solo en un algoritmo o ambiente acotado, ignorando instalación y uso. Equivale al problema `SAT`, `NP`-completo, y se reserva a criticidad extrema. El pentest **nunca** prueba ausencia: un test limpio solo evidencia que ese equipo no encontró nada; prueba los controles intentando violar la [[politica-de-seguridad-y-sistema-seguro|política de seguridad]], y por eso alcanza también a personas y procesos, no solo al código.

### Metodología de Hipótesis de Falla

La **[[metodologia-de-hipotesis-de-falla|Metodología de Hipótesis de Falla]]** tiene cinco pasos: recolección de información, hipótesis (asumir vulnerabilidades concretas), prueba (repetible; explotar es el último recurso), generalización —la más importante, según la cátedra: buscar el mismo patrón en otras partes del sistema— y eliminación, opcional. El ***pivoting*** es la excepción a "explotar es el último recurso": usar un punto ya comprometido para seguir atacando.

### Casos resueltos y validez del pentest

En **[[casos-de-prueba-de-penetracion|Michigan Terminal System]]**, un parámetro de una llamada al sistema apunta a la propia lista de parámetros; la validación revisa que los punteros sean accesibles pero no se repite después de escribir, y la escritura termina en el **segmento 5**: dos bytes bastan para apagar la protección por hardware y lograr control total. El caso de **ingeniería social** consigue contraseñas por teléfono sin tocar código: el pentest no es solo técnico; el único caso hands-on de punta a punta es el laboratorio del [[video-10-pentesting-laboratorio|video-10]].

La **[[validez-de-las-pruebas-de-penetracion|validez del pentest]]** queda abierta: depende de la capacidad de los testers para formular hipótesis, no da una forma sistemática de revisar un sistema, y sus resultados sirven poco para otros sistemas — la generalización del paso 4 opera **dentro** del mismo sistema.

### Para el parcial — Clase 8
- Los ocho principios de [[principios-de-diseno|Saltzer y Schroeder]] con un ejemplo de cada uno —la pregunta típica es "qué principios viola este sistema y cómo se arregla", no enumerarlos— y que el quinto es [[principio-de-kerckhoffs|Kerckhoffs]]: diseño abierto no es publicar el código.
- La distinción [[aseguramiento-en-el-ciclo-de-vida|amenaza contra vulnerabilidad]] con la cadena completa, y los tres niveles de evidencia de [[confianza-y-aseguramiento|confianza y aseguramiento]] —informal, semiformal, formal—.
- El [[modelado-de-amenazas|ciclo de cinco pasos]] de Microsoft, con las zonas de la [[descomposicion-de-la-aplicacion|descomposición de la aplicación]] en el paso 3, [[stride-y-arboles-de-ataque|STRIDE]] en el paso 4 y la [[identificacion-de-vulnerabilidades|identificación de vulnerabilidades]] en el paso 5.
- Los cinco pasos de la [[metodologia-de-hipotesis-de-falla|Metodología de Hipótesis de Falla]] —la generalización es la que la cátedra marca como más importante— y que solo la [[verificacion-formal-y-prueba-de-penetracion|verificación formal]] prueba ausencia, en un ambiente acotado.
- Poder contar el caso de [[casos-de-prueba-de-penetracion|Michigan Terminal System]] de punta a punta, y las dos preguntas abiertas sobre la [[validez-de-las-pruebas-de-penetracion|validez del pentest]].
- Entra en el [[segundo-parcial|segundo parcial]] del 19/11, junto con las Clases 6, 7, 9, 10 y 11.

## C9 · Flujo de información y malware

Una [[listas-de-control-de-acceso|ACL]] protege un objeto, no la información que contiene: el [[flujo-de-informacion|flujo de información]] mide con [[entropia-y-entropia-condicional|entropía condicional]] cuánto se filtra, aunque ningún acceso indebido haya ocurrido. Cuando ni siquiera se puede aislar un proceso del resto del sistema aparece el [[problema-del-confinamiento|confinamiento]].

### Control de acceso: por qué no alcanza

- **[[control-de-acceso-y-flujo-de-informacion|Control de acceso y flujo]]** — una [[listas-de-control-de-acceso|ACL]] protege un objeto; si un editor de textos deja una copia de trabajo en `/tmp` con una `ACL` más permisiva, esa copia es un objeto distinto y filtra el contenido sin que nadie toque el objeto protegido.
- Tesis de la clase: las políticas restringen el [[flujo-de-informacion|flujo]] de la información, no el acceso a los objetos. Evitar que alguien sepa un dato no es lo mismo que evitar que acceda a la base que lo contiene.
- Las `ACL` y las [[listas-de-capacidades|listas de capacidades]] sirven, pero son mecanismos abiertos que hay que complementar: el control de acceso limita operaciones sobre objetos, pero la información no es estática, se actualiza y se copia.

### Entropía y entropía condicional

- **[[entropia-y-entropia-condicional|Entropía]]** — $H(X) = -\sum_i p(x_i)\log p(x_i)$ mide la incertidumbre sobre una variable (vocabulario de la [[teoria-de-la-informacion|teoría de la información]]): máxima con distribución uniforme, nula cuando un valor tiene probabilidad 1.
- **Entropía condicional** — la incertidumbre que queda sobre $X$ una vez conocido algo de $Y$, promediando sobre los valores de $Y$:
$$
H(X\mid Y=y)=-\sum_i p(x_i\mid y)\log p(x_i\mid y),\qquad H(X\mid Y)=\sum_j p(y_j)\,H(X\mid Y=y_j)
$$
- Reemplaza al criterio binario del [[secreto-perfecto|secreto perfecto]]: en vez de responder sí o no, devuelve un número de bits filtrados.

### Flujo de información: la definición formal

- **[[flujo-de-informacion|Flujo]]** — hay flujo de $x$ a $y$ si conocer $y$ deja menos incertidumbre sobre $x$ que antes: $H(x_s\mid y_t) < H(x_s\mid y_s)$ si $y$ ya existía en el estado inicial, o $H(x_s\mid y_t) < H(x_s)$ si no existía.
- El criterio es de reducción relativa, no de valor absoluto: importa cuánto bajó la [[entropia-y-entropia-condicional|entropía]], no cuánto vale.
- Ejemplo resuelto: con $y:=x+z$, $x$ uniforme en ocho valores y $z$ con ruido, $H(x)=3$ bits y $H(x\mid y)=1{,}5$ bits; se filtró un bit y medio.

### Flujo explícito e implícito

- **[[flujo-explicito-e-implicito|Flujo explícito]]** — una asignación traspasa el valor, $y:=f(x)$.
- **Flujo implícito** — se filtra sin ninguna asignación, por la rama que se ejecuta o por si el programa termina. En `if x=0 then y=1 else y=0`, la [[entropia-y-entropia-condicional|entropía condicional]] $H(x\mid y)=0$ aunque $x$ e $y$ nunca comparten una línea.
- El bucle `while x=0 loop {}`, sin ninguna asignación, también filtra: observar si el programa terminó determina el valor de $x$ por completo.
- Problema abierto: encontrar y controlar los flujos implícitos, que un análisis de asignaciones no detecta.

### Políticas y mecanismos de control de flujo

- Toda [[politicas-de-control-de-flujo|política de control de flujo]] exige reflexión (sujetos de la misma clase tienen los mismos derechos) y transitividad, que formaliza que la información se escurre por caminos indirectos de más de un salto.
- La relación de dominancia de [[bell-lapadula|Bell-LaPadula]] se aplica al flujo en tres casos, sin la maquinaria completa de reglas de lectura y escritura; en el tercero, una restricción discrecional $(b,-,C_1)$ se elude por el camino indirecto: $a$ escribe en $o'\in C_2$, porque la restricción solo mencionaba $C_1$.
- Dos [[mecanismos-de-control-de-flujo|mecanismos]] hacen cumplir una política: el estático certifica comando por comando en compilación y es conservador por necesidad; el dinámico propaga etiquetas en ejecución, y basta haber leído una vez un dato de etiqueta alta para marcar todo lo producido después.
- El límite de lo técnico: ningún mecanismo de etiquetas impide que alguien hable, imprima o fotografíe una pantalla.

### Confinamiento y canales ocultos

- El [[problema-del-confinamiento|confinamiento]] busca impedir que un servidor revele información que el usuario considera confidencial: la parte fácil ya la resuelve el control de acceso, la difícil no.
- La aislación total exigiría que un proceso no se comunique ni sea observado, y es inalcanzable: todo proceso usa recursos medibles y compartidos —CPU, memoria, disco— que ya forman un canal.
- Un [[canales-ocultos-y-side-channels|canal oculto]] no fue diseñado para comunicar: espacial si explota un recurso compartido, temporal si explota el orden o el tiempo de acceso; se caracteriza por ruido y ancho de banda, y en la notación de la clase es un $y$ que reduce $H(x_s\mid y_t)$: la misma definición de flujo.
- Canal temporal de CPU compartida: para un 0, $a$ devuelve el control de inmediato; para un 1, agota su slot; $b$ mide con el reloj cuánto tarda en recuperar la CPU y decodifica, sin ninguna llamada entre ambos.
- El ataque lateral sobre la exponenciación modular de cuadrado y multiplicación filtra el exponente secreto de [[rsa|RSA]] o [[diffie-hellman|Diffie-Hellman]]: la multiplicación solo corre cuando el bit vale 1, así que el tiempo total delata cuántos bits están en 1, y con métodos estadísticos se reconstruye parte del exponente.

### Métodos de aislación

- Dos respuestas al [[problema-del-confinamiento|confinamiento]]: los [[metodos-de-aislacion|métodos de aislación]], separados por un solo criterio, si modifican el sistema o no; ninguno cierra el problema de los [[canales-ocultos-y-side-channels|canales ocultos]], solo reducen la superficie.
- **Máquina virtual** — presenta un ambiente simulado sin tocar el sistema. Ejemplos: `KVM`, `VMware`, `qemu`, la JVM.
- **Sandbox** — sí modifica el sistema, el kernel o el propio programa, para limitar acciones según una política. Ejemplos: `chroot`, el ebuild sandbox de Gentoo, y también la JVM. Lectura de cierre del deck: [[bibliografia|Bishop, capítulos 17 y 18]].

### Para el parcial — Clase 9
- Esta clase entra en el segundo parcial (19/11), como parte del Bloque 2.
- Escribir de memoria la [[flujo-de-informacion|definición formal de flujo]] con sus dos desigualdades, y aplicarla calculando $H(x)$ y $H(x\mid y)$ en un ejemplo con ruido.
- Distinguir flujo explícito de implícito, y justificar por qué un `if` y un `while` sin ninguna asignación igual filtran: es lo que menos detecta un análisis ingenuo del código.
- Recordar que acá [[bell-lapadula|Bell-LaPadula]] aparece recortado a la relación de dominancia; la simple security property y la *-property completas son materia de la [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 06]].
- Clasificar un [[canales-ocultos-y-side-channels|canal oculto]] dado un escenario, espacial o temporal, y explicar el ataque de tiempo sobre la exponenciación modular.
- Separar [[metodos-de-aislacion|máquina virtual de sandbox]] por el criterio de si modifican el sistema, con sus ejemplos.
- La práctica declarada de esta clase es la Guía 8 — Flujos de información, todavía no publicada en el vault, según el [[cronograma|cronograma]]; el desarrollo oral está en el [[video-11-flujo-de-informacion|Video 11]].

## C10 · Seguridad en la empresa

El [[firewalls|firewall]] no define la política de seguridad, la ejecuta: la [[seguridad-a-nivel-de-red|seguridad a nivel de red]] aplica principios ya vistos sobre un caso de estudio con [[zona-desmilitarizada|DMZ]] y dos firewalls.

### Seguridad a nivel de red

La [[seguridad-a-nivel-de-red|seguridad a nivel de red]] se apoya en tres condiciones previas a cualquier diagrama: es aplicación de principios ya vistos; se parte de una **[[politica-de-seguridad-y-sistema-seguro|política de seguridad]] ya definida**, que el diseño de red debe forzar; y esos principios son guías. El límite explícito: el diseño de red es **una capa** y probablemente no alcance para cubrir toda la política — faltan seguridad en aplicaciones y procedimientos manuales como contraseñas o capacitación.

### Firewalls y sus tres tipos

Un [[firewalls|firewall]] es un host que controla el acceso a una red, en tres tipos que se distinguen por cuánto del paquete inspeccionan:

| Tipo | Mira | Ejemplo |
|---|---|---|
| [[firewalls#Tipo 1 — Packet filters (filmina 6)\|Packet filter]] | sentido, host y puerto, flags, protocolo | routers |
| [[firewalls#Tipo 2 — Statefull packet filters (filmina 7)\|Statefull packet filter]] | lo anterior más el estado de la conexión; puede manipular paquetes (NAT) | `iptables -m state` |
| Application firewall (proxy, [[firewalls#Tipo 3 — Application firewalls (filminas 8-9)\|WAF]]) | el contenido según un protocolo de aplicación | proxy de email |

A mayor inspección, mayor costo y mayor especificidad: un packet filter es barato pero ciego al contenido; un application firewall entiende un protocolo entero pero no generaliza a otros.

### Netfilter e iptables

[[netfilter-e-iptables|Netfilter e iptables]] es la implementación de referencia en Linux. Las **chains** de la tabla `FILTER` son `INPUT`, `OUTPUT` y `FORWARD` (tráfico ruteado), cada una con una **policy** por defecto, `ACCEPT` o `DROP`, aplicada cuando ninguna regla explícita coincidió; `iptables -P INPUT DROP` cambia la chain entera, no agrega una regla. El módulo `-m state` distingue conexiones `NEW`, `ESTABLISHED` e `INVALID`, y `-m limit` acota una tasa para mitigar DoS, eficaz solo si la policy descarta el excedente.

### La DMZ y sus servicios

La [[zona-desmilitarizada|DMZ]] o red perimetral separa la red interna de la externa y aloja los servicios que Internet debe alcanzar: si un atacante la compromete, la interna sigue protegida. Su segunda razón: diferenciar servicios internos y externos, lo que simplifica qué política aplica a cada uno ([[zona-desmilitarizada#Las dos razones de ser (filmina 15)|las dos razones]]). El [[diseno-de-servicios-en-la-dmz|diseño de servicios en la DMZ]] responde siempre lo mismo: si el servidor se compromete, la red interna no se ve afectada.

| Servicio | Rasgo central | Consecuencia si se compromete |
|---|---|---|
| [[diseno-de-servicios-en-la-dmz#Servicio web (filminas 16-17)\|Web]] (*Bastion Host*) | carga de órdenes desacoplada en tres pasos | el servidor solo escribe, no lee órdenes cargadas |
| [[diseno-de-servicios-en-la-dmz#Servicio email (filminas 18-20)\|Email]] | camino entrante reescribe direcciones, saliente filtra contenido y oculta identidad interna | no expone la estructura ni la identidad de la red interna |
| [[diseno-de-servicios-en-la-dmz#Servicio web proxy (filmina 21)\|Web proxy saliente]] | verifica que el origen sea el firewall interno, filtra pedidos malformados y páginas no permitidas | la red interna queda sin salida web, porque el firewall interno fuerza todo el HTTP/S saliente por el proxy; no expone servicios internos |

### Reglas de los firewalls y servicios de soporte

Las [[reglas-de-los-firewalls-externo-e-interno|reglas de los firewalls externo e interno]] son la política concreta: el [[reglas-de-los-firewalls-externo-e-interno#Firewall externo (filmina 22)|externo]] redirige SMTP y HTTP/S entrante a sus servidores de la [[zona-desmilitarizada|DMZ]] y solo deja salir esos protocolos desde el servidor puntual correspondiente; el [[reglas-de-los-firewalls-externo-e-interno#Firewall interno (filmina 23)|interno]] es asimétrico, porque de la DMZ hacia la red interna solo deja pasar SMTP desde el email server, mientras que en sentido inverso habilita varios flujos; los dos hacen NAT para ocultar direcciones internas y rechazan cualquier otro tráfico. Los [[servicios-de-soporte-dns-log-y-proxy|servicios de soporte]] sostienen al resto: el [[servicios-de-soporte-dns-log-y-proxy#Log Server en DMZ (filmina 26)|log server]] solo agrega información y la guarda también en un medio de solo escritura, y el `DNS` interno admite por primera vez violar el [[principios-de-diseno#7. Mecanismos exclusivos|principio de mecanismos exclusivos]] —todos los servidores dependen de él—, mitigado fijando en cada servidor la dirección de los firewalls en vez de resolverla por nombre.

### Segmentación interna y análisis de puntos de entrada

La [[segmentacion-de-la-red-interna|segmentación de la red interna]] aplica la misma lógica de la [[zona-desmilitarizada|DMZ]] un nivel más adentro: subredes por grupo, cada una arbitrada por un [[firewalls|firewall]], de modo que «adentro» no sea un único nivel de confianza; el ejemplo de la cátedra niega el tráfico de desarrollo hacia la red corporativa. El [[analisis-de-puntos-de-entrada|análisis de puntos de entrada]] hace un inventario de tres superficies —puertos del web server (los cubre el proxy), puerto del email (el proxy de email) y fallas del propio firewall (simplicidad más defensa en profundidad)— y parte de una premisa: es posible que algún ataque sea exitoso, y el trato es asimétrico según dónde ocurre. En el firewall externo se registran los no exitosos y se ignoran, con fines estadísticos; en la DMZ interesan tanto los exitosos como los no, porque ahí «no debiera haber ataques» y su sola presencia implica haber pasado el firewall externo, con tres causas posibles: administrador no confiable, firewall externo comprometido o fallo de software en la DMZ.

### Detección de intrusiones y variaciones de la arquitectura

Un [[deteccion-y-prevencion-de-intrusiones|IDS]] analiza eventos buscando patrones de ataque y complementa el control manual, sin reemplazarlo; un [[deteccion-y-prevencion-de-intrusiones#IPS — Intruder Prevention System (filmina 33)|IPS]] agrega una respuesta automática, casi siempre bloquear en el [[firewalls|firewall]] el origen del ataque. Las [[variaciones-de-la-arquitectura|variaciones de la arquitectura]] modifican el diseño en dos escenarios: ancho de banda muy alto, donde solo el packet filter escala en [[variaciones-de-la-arquitectura#Clusters de firewalls para redes con ancho de banda muy alto (filmina 34)|clusters]] sin sincronizar nodos; y redes pequeñas, donde se unifican servidores —paliado con virtualización— o se [[variaciones-de-la-arquitectura#Tercerización de la DMZ|terceriza]] la [[zona-desmilitarizada|DMZ]] en un datacenter alquilado.

### Para el parcial — Clase 10
- Esta clase entra en el [[segundo-parcial|segundo parcial]] (19/11), Bloque 2 — Seguridad; sin guía ni práctica propias en el vault todavía.
- Los tres tipos de firewall y su orden de capacidad, con la [[firewalls#La progresión, y por qué el caso de estudio usa los tres|progresión completa]]: base para justificar por qué un firewall dado no alcanza para una tarea dada.
- Las banderas de `iptables` de memoria, con el detalle bandera por bandera en [[netfilter-e-iptables#Los seis comandos de las filminas 12 y 13|Netfilter e iptables]]: `-A` contra `-P`, `-i`/`-o`, `-s`/`-d`, `-p`, `--dport`/`--sport`, `-m state`, `-m multiport`, `-m limit`; en la regla SSH, `OUTPUT` acepta solo `ESTABLISHED`: aceptar `NEW` dejaría al host iniciar conexiones salientes que la política no pide.
- Qué firewall permite qué, con la [[reglas-de-los-firewalls-externo-e-interno#La asimetría entre los dos firewalls|asimetría entre los dos]] como el punto que más se presta a error: DMZ hacia interna es el único flujo reducido a un solo protocolo y un solo origen.
- Consecuencias, no solo mecanismos: poder responder «si el servidor X es comprometido, ¿qué información queda expuesta?».
- Las dos excepciones admitidas al diseño ideal —el [[servicios-de-soporte-dns-log-y-proxy#DNS Server interno|DNS interno]] y la [[variaciones-de-la-arquitectura#Unificación de servidores|unificación de servidores]]— son material típico para «justifique un trade-off»: la respuesta correcta nombra qué principio se viola, con qué se mitiga y por qué la alternativa no es viable ahí.
- `IDS` complementa, `IPS` actúa: la [[deteccion-y-prevencion-de-intrusiones#La distinción exacta, y por qué importa el orden|distinción exacta]] aparece en casi cualquier examen de seguridad de redes.

## Abreviaturas y símbolos

Cada sigla enlaza a la página o a la sección que la define: la tarjeta de vista previa alcanza para recordarla, y el clic la desarrolla. La notación matemática completa del vault, con la forma canónica de cada símbolo, está en [[notacion-y-terminologia|Notación y terminología]].

| Sigla | Qué es | Ver |
|---|---|---|
| **AC** | Autoridad certificante: firma certificados; la raíz está autofirmada y preinstalada | [[cadenas-de-firmas-y-autoridades-raiz\|AC]] · C5 |
| **ACL** | Access Control List: proyección por columnas de la matriz de acceso; protege el objeto | [[listas-de-control-de-acceso\|ACL]] · C6 |
| **AEAD** | Cifrado autenticado: confidencialidad e integridad en una sola primitiva, CCA-seguro | [[cifrado-autenticado\|AEAD]] · C3 |
| **AES** | Primitiva de bloque estándar: bloques de 128 bits, rondas sobre GF(2⁸) | [[aes\|AES]] · C2 |
| **CAPTCHA** | Prueba para distinguir humanos de programas; mitiga ataques automáticos a un login | [[ataques-a-un-sistema-de-autenticacion\|CAPTCHA]] · C7 |
| **CBC-MAC** | MAC que encadena una primitiva de bloque; seguro solo a longitud fija | [[cbc-mac\|CBC-MAC]] · C3 |
| **CCA** | Chosen-ciphertext attack: CPA más un oráculo de descifrado | [[ataque-de-texto-cifrado-escogido\|CCA]] · C3 |
| **CCM / GCM** | Modos de cifrado autenticado con una sola clave; GCM es el más usado | [[ccm-y-gcm\|CCM / GCM]] · C3 |
| **CD / COI** | Company Dataset y Conflict of Interest: las clases de la muralla china | [[muralla-china#Concepto y definiciones\|CD / COI]] · C6 |
| **C-I-D** | Confidencialidad, integridad y disponibilidad: los tres objetivos de una política | [[confidencialidad-integridad-y-disponibilidad\|C-I-D]] · C6 |
| **COA** | Ciphertext-only attack: el adversario pasivo solo ve criptogramas | [[modelos-de-ataque\|COA]] · C1 |
| **CPA** | Chosen-plaintext attack: el adversario tiene un oráculo de cifrado | [[pruebas-de-indistinguibilidad\|CPA]] · C2 |
| **CRL** | Certificate Revocation List: certificados invalidados antes de expirar | [[revocacion-y-listas-crl\|CRL]] · C5 |
| **DAC / MAC (acceso)** | Control discrecional (lo fija el dueño) contra mandatorio (lo fija el sistema) | [[paradigmas-de-control-de-acceso\|DAC / MAC]] · C6 |
| **DDH** | Conjetura de decisión Diffie-Hellman: g^xy es indistinguible de un elemento al azar | [[diffie-hellman\|DDH]] · C4 |
| **DES / 3DES** | Primitiva de bloque de 64 bits y clave de 56; red de Feistel de 16 rondas | [[des-y-3des\|DES / 3DES]] · C2 |
| **DMZ** | Zona desmilitarizada: subred perimetral entre el firewall externo y el interno | [[zona-desmilitarizada\|DMZ]] · C10 |
| **DNS** | Servicio de nombres; en la empresa, uno en la DMZ y otro interno | [[servicios-de-soporte-dns-log-y-proxy\|DNS]] · C10 |
| **DoS** | Denegación de servicio; en iptables se mitiga con el módulo limit | [[netfilter-e-iptables\|DoS]] · C10 |
| **DSS / DSA** | Digital Signature Standard: firma del NIST sobre el logaritmo discreto | [[digital-signature-standard\|DSS / DSA]] · C4 |
| **Eav** | Experimento de indistinguibilidad ante un observador pasivo, un solo criptograma | [[pruebas-de-indistinguibilidad\|Eav]] · C2 |
| **ECB / CBC / CFB / OFB / CTR** | Los cinco modos que vuelven usable una primitiva de bloque | [[modos-de-encadenamiento\|modos]] · C2 |
| **EKE** | Encrypted Key Exchange: challenge-response cifrado con la contraseña | [[challenge-response-y-eke\|EKE]] · C7 |
| **GF(2⁸)** | Campo de Galois de 256 elementos sobre el que opera AES | [[cuerpos-finitos-y-campos-de-galois\|GF(2⁸)]] · C2 |
| **HMAC** | MAC sobre una función de hash, con dos pasadas (ipad, opad) | [[hmac\|HMAC]] · C3 |
| **H(X), H(X ∣ Y)** | Entropía y entropía condicional: cuánta incertidumbre queda o se filtra | [[entropia-y-entropia-condicional\|entropía]] · C9 |
| **IC** | Índice de coincidencia: probabilidad de que dos letras al azar coincidan | [[indice-de-coincidencia\|IC]] · C1 |
| **IDS / IPS** | Detección de intrusiones; el IPS agrega respuesta automática | [[deteccion-y-prevencion-de-intrusiones\|IDS / IPS]] · C10 |
| **IV** | Vector de inicialización: público, único e impredecible según el modo | [[cifrado-probabilistico-nonce-e-iv\|IV]] · C2 |
| **JWT** | JSON Web Token: JSON firmado en tres partes; el id_token de OpenID Connect | [[openid-connect-y-jwt\|JWT]] · C6 |
| **KDC** | Key Distribution Center: tercero que reparte claves de sesión | [[distribucion-de-claves-y-kdc\|KDC]] · C4 |
| **KE** | Experimento de seguridad de un intercambio de claves ante un adversario pasivo | [[intercambio-de-claves\|KE]] · C4 |
| **KPA** | Known-plaintext attack: pares (m, c) que el adversario no eligió | [[modelos-de-ataque\|KPA]] · C1 |
| **MAC** | Message Authentication Code: terna Gen, Mac, Vrfy que da integridad con clave | [[message-authentication-code\|MAC]] · C3 |
| **Mac-Forge** | Experimento de falsificación de un MAC; la cota debe ser despreciable | [[seguridad-de-un-mac\|Mac-Forge]] · C3 |
| **MD5 / SHA-1 / SHA-2 / SHA-3** | Hashes estándar: los dos primeros quebrados, los dos últimos vigentes | [[primitivas-de-hash-estandar\|MD5 / SHA]] · C3 |
| **MITM** | Man in the middle: adversario activo que intercepta y reescribe el canal | [[ataques-activos-y-man-in-the-middle\|MITM]] · C5 |
| **Mul** | Experimento de indistinguibilidad con múltiples cifrados bajo la misma clave | [[pruebas-de-indistinguibilidad\|Mul]] · C2 |
| **NAT** | Traducción de direcciones: ambos firewalls ocultan la red interna | [[reglas-de-los-firewalls-externo-e-interno\|NAT]] · C10 |
| **NP / SAT** | Verificar formalmente un sistema equivale a SAT, problema NP-completo | [[verificacion-formal-y-prueba-de-penetracion\|NP / SAT]] · C8 |
| **OAuth 2.0** | Delegación de acceso sin compartir contraseñas; cuatro grant types | [[oauth-2\|OAuth 2.0]] · C6 |
| **OIDC** | OpenID Connect: capa de autenticación sobre OAuth 2.0 con id_token | [[openid-connect-y-jwt\|OIDC]] · C6 |
| **OTP** | One Time Pad: cifrado de Vernam, el único con secreto perfecto | [[one-time-pad\|OTP]] · C2 |
| **PACL** | ACL propagable: el control sigue a la información, no al objeto | [[acls-propagables\|PACL]] · C6 |
| **PBKDF2** | Deriva una clave de una contraseña iterando una PRF con sal | [[pbkdf2\|PBKDF2]] · C7 |
| **PGP** | Pretty Good Privacy: correo cifrado con cifrado híbrido | [[cifrado-hibrido\|PGP]] · C4 |
| **PKCS#1** | Relleno aleatorio que vuelve probabilístico a RSA | [[pkcs1-y-tamano-de-claves\|PKCS#1]] · C4 |
| **PKI** | Infraestructura de clave pública: ata identidades a claves públicas | [[infraestructura-de-clave-publica\|PKI]] · C5 |
| **PPT** | Tiempo polinomial probabilístico: el adversario de la seguridad computacional | [[seguridad-computacional\|PPT]] · C2 |
| **PRF / PRG** | Función y generador pseudoaleatorios: indistinguibles de lo uniforme | [[generador-pseudoaleatorio\|PRF / PRG]] · C2 |
| **RSA** | Criptosistema asimétrico por exponenciación modular; factorización | [[rsa\|RSA]] · C4 |
| **Sig-forge** | Experimento de falsificación existencial de una firma digital | [[firma-digital\|Sig-forge]] · C4 |
| **SSO** | Single Sign-On: delegar la autenticación en un sistema externo | [[autenticacion-remota-y-sso\|SSO]] · C7 |
| **STRIDE** | Seis categorías de amenaza: Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation | [[stride-y-arboles-de-ataque\|STRIDE]] · C8 |
| **TLS** | Transport Layer Security: la capa de seguridad entre aplicación y transporte | [[tls-arquitectura-y-record\|TLS]] · C5 |
| **WAF** | Web Application Firewall: application firewall para HTTP | [[firewalls\|WAF]] · C10 |
| **X.509** | Estándar de los campos de un certificado y de su verificación en cinco pasos | [[x509\|X.509]] · C5 |
