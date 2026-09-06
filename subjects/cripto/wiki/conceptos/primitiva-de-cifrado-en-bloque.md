---
title: Primitiva de cifrado en bloque
resumen: 'Función pseudoaleatoria con clave que cifra bloques de tamaño fijo. Por ser determinística no es un criptosistema usable por sí sola: necesita padding y un modo de encadenamiento.'
fuentes: ["[[clase-02-cifrado]]", "[[clase-03-macs-y-cifrado-autenticado]]"]
aliases: [Primitiva de cifrado en bloque, Cifrado en bloque, Block cipher, Función pseudoaleatoria, PRF, Padding, Simple Pad, Des Pad]
type: concepto
unidad: 1
clase: 2
orden: 7
created: 2026-08-21
updated: 2026-08-28
tags: [criptografia, bloque, block-cipher, prf, padding, clase-02]
sources: ["Clase 02 - Criptografia - Cifrado.pdf", "Clase 03pt1-Transcripcion.VTT"]
---

# Primitiva de cifrado en bloque

La otra gran familia simétrica. La palabra que hay que retener es **primitiva**: por sí sola **no es un criptosistema usable**.

---

## Definición

$$\begin{aligned}
K &= \{0,1\}^n,\quad C = P = \{0,1\}^b\\
\mathsf{Gen} &: k \leftarrow K\\
\mathsf{Enc} &: e_k(m) = c\\
\mathsf{Dec} &: d_k(c) = m
\end{aligned}$$

Están definidas para mensajes de **tamaño FIJO** $b$ (el *tamaño de bloque*), con clave de $n$ bits. Dos parámetros distintos que conviene no mezclar: en AES-256, $n = 256$ pero $b = 128$.

## Son funciones pseudoaleatorias

> Podrían *"usarse"* como criptosistemas, pero **son determinísticas → No pasan la prueba `Mul`**.
> Se combinan con **mecanismos de encadenamiento** para formar criptosistemas seguros.

Y la formulación precisa que da la clase al hablar de seguridad:

> No es posible distinguir la función $f(x) = \mathsf{Enc}_k(x)$ de una función tomada **al azar del conjunto de funciones del mismo dominio**. Dicho de otra manera: **para cada posible $k$, $f(x) = \mathsf{Enc}_k(x)$ es un [[generador-pseudoaleatorio|generador pseudoaleatorio]]**.

> **Una precisión que la clase no hace** *(lectura nuestra).* Como existe `Dec`, $\mathsf{Enc}_k$ no es una función cualquiera sino una **permutación** de $\{0,1\}^{b}$ — biyectiva, por eso se puede invertir. En la literatura esto se llama **PRP** (*pseudorandom permutation*) y no PRF. La diferencia es visible sólo para un adversario que haga del orden de $2^{b/2}$ consultas (por el problema del cumpleaños: una función aleatoria tiene colisiones, una permutación no), así que para $b = 128$ es irrelevante en la práctica. Es la razón técnica por la que la clase puede tratarlas como equivalentes.

**El punto central:**

| La primitiva | El criptosistema |
|---|---|
| Determinística | Debe ser [[cifrado-probabilistico-nonce-e-iv\|probabilística]] |
| Tamaño fijo $b$ | Debe cifrar mensajes de cualquier largo |
| Falla `Mul` y `CPA` | Debe ser CPA-Secure |

Los **[[modos-de-encadenamiento|modos de encadenamiento]]** son precisamente lo que salva esas tres distancias.

---

## Por qué el bloque le ganó al flujo

Las filminas reparten las dos familias simétricas en pie de igualdad —[[criptosistema-de-flujo|flujo]] con IV, bloque con encadenamiento—, pero en la práctica **la de bloque es la que domina**. Al abrir la Clase 03 con el repaso, el docente da **tres razones** que ninguna filmina escribe:

1. **Es más eficiente.**
2. **Está mejor pensada para ejecutarse en hardware** — y de ahí el *throughput* más alto.
3. **Es más fácil de demostrar**: al no trabajar con estructuras potencialmente infinitas sino sobre un **dominio finito de tamaño fijo**, las demostraciones matemáticas salen *"un poco —no mucho, pero un poco— más fáciles de hacer y de seguir"*.

La tercera es la que más le importa a esta nota: el $b$ fijo de la definición de arriba no es sólo la limitación que los modos tienen que remendar, es también **lo que vuelve tratable la prueba**. Las dos primeras razones se encadenan entre sí en la voz del docente —eficiente *porque* está pensada para hardware—; la wiki las lista separadas porque son dos afirmaciones distintas y sólo la segunda menciona el throughput *(lectura nuestra)*.

> [!quote]- De la transcripción de la Clase 03 — las tres razones del bloque sobre el flujo (cues 29-32)
> *"Ahí aparece el concepto de los criptosistemas de bloque, que son los que hoy dominan el escenario de los criptosistemas: porque son **más eficientes**, porque están **mejor pensados para ejecutar en hardware** —entonces tienen mayor [throughput]—, y porque, al no trabajar con **estructuras potencialmente infinitas**, tienen demostraciones matemáticas un poco —no mucho, pero un poco— **más fáciles de hacer y de seguir**."*
>
> *(El ASR del cue 30 escribe "Froophoot": es **throughput**. Corrección nuestra.)*

→ El repaso completo, con la tabla de las dos ramas, está en [[clase-03-macs-y-cifrado-autenticado#2. Criptosistemas CPA-Secure: con qué se instancia|Clase 03 — §2]].

---

## Extensión: padding

*¿Qué ocurre si el mensaje a cifrar es más chico que el tamaño de bloque?* Se lo extiende **sistemáticamente**:

| Método | Cómo | Problema |
|---|---|---|
| **Simple Pad** | Completar con **ceros** | Es necesario **conocer el tamaño real** del mensaje por otra vía — si el mensaje terminaba en ceros, no se sabe cuáles son relleno |
| **Des Pad** | Agregar un bit **$1$** y después bits en **$0$** | Es autodelimitante: el receptor busca el último $1$. A cambio, **puede agregar un bloque completo** de padding (cuando el mensaje ya llenaba el bloque justo) |

> **Por qué Des Pad puede gastar un bloque entero.** *(lectura nuestra.)* Si el mensaje ya es múltiplo exacto del bloque, igual **hay que** agregar el $1$: si no se agregara, el receptor tomaría como relleno los ceros finales del mensaje real. El costo de un bloque de más es el precio de que el esquema sea no ambiguo. Es el mismo motivo por el que Simple Pad es más barato pero incompleto.

Y si el mensaje es **más grande** que el bloque:

> - Se **divide** el mensaje en bloques.
> - Se **extiende** el último bloque.
> - Se **transforma cada bloque** según algún [[modos-de-encadenamiento|modo de encadenamiento]].

## Las primitivas concretas del curso

- [[des-y-3des|DES y 3-DES]] — $b = 64$
- [[aes|AES]] — $b = 128$, la **recomendada**
- IDEA — $b = 64$, aparece sólo en la tabla de recomendados

→ [[eleccion-de-primitivas|Elección de primitivas en un proyecto]]

## Ver también

- [[modos-de-encadenamiento|Modos de encadenamiento]] — cómo se convierte la primitiva en criptosistema
- [[generador-pseudoaleatorio|Generador pseudoaleatorio]] — la propiedad que se le exige
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — por qué el determinismo no alcanza
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — la prueba `Mul` que la primitiva sola no pasa
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]]
