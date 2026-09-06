---
title: Modelos de ataque
resumen: 'Taxonomía de lo que se le permite al adversario: COA, KPA, CPA y CCA, ordenados de menor a mayor poder y divididos en pasivos y activos. Sin fijar el modelo, decir que un esquema es inseguro no significa nada.'
fuentes: ["[[practica-01-esquemas-y-taxonomias]]", "[[clase-01-introduccion-y-criptografia-clasica]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Modelos de ataque, COA, KPA, CPA, CCA, Chosen-plaintext attack]
type: concepto
unidad: 1
clase: 1
orden: 13
created: 2026-08-10
updated: 2026-08-28
tags: [criptoanalisis, modelos-de-ataque, cpa, cca, guia-01, practica-01, clase-02, clase-03]
sources: [Clase 1.pdf (práctica), Guía 1 Ej. 8, Katz & Lindell cap. 1, "raw/clases/Clase 01-Transcripcion.VTT", "raw/clases/Clase 03pt1-Transcripcion.VTT"]
---

# Modelos de ataque

Qué se le permite hacer al adversario. Un ataque sólo tiene sentido enunciado **dentro de un modelo**: decir "el esquema es inseguro" sin decir contra qué adversario no significa nada.

> **Estado:** la taxonomía **ya se presentó en clase**. La [[practica-01-esquemas-y-taxonomias|Práctica 01 (10/08)]] trae el árbol completo de ataques, organizado por el eje **pasivo / activo**. El término *chosen-plaintext attack* aparece en el **Ej. 8 de la [[guia-01-criptografia-clasica|Guía 1]]**, y la formalización con oráculos y juegos está en Katz & Lindell cap. 1 (§1.3) y cap. 3.
>
> **Y la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] no trabaja en COA por omisión: lo declara.** Antes de atacar los cifrados clásicos, el docente fija el escenario en voz —*"desde un punto de vista de un atacante, lo único que vería sería el texto cifrado en principio"* (cue 244)—, así que los tres criptoanálisis de la [[clase-01-introduccion-y-criptografia-clasica#5. Cifrados clásicos y su criptoanálisis|§5]] corren en **texto cifrado solo** por elección explícita. Y la clase no se queda ahí: a pedido de un alumno discute en detalle el escenario en que el adversario **pide cifrados de textos que elige** (cues 294-336, con el lapsus del docente que la nota de clase marca), y al cerrar nombra los **modelos de amenaza** como una de las tres exigencias de la criptografía moderna (cues 671-681) — [[clase-01-introduccion-y-criptografia-clasica#6. ¿Hay criptosistemas seguros?|§6]].

---

## Los cuatro modelos

Ordenados de menor a mayor poder del adversario. Cada uno **contiene** al anterior.

| Modelo | Sigla | Qué tiene el adversario |
|---|---|---|
| **Ciphertext-only** | COA | Sólo criptogramas |
| **Known-plaintext** | KPA | Pares $(m, c)$ que no eligió |
| **Chosen-plaintext** | CPA | Puede **pedir** el cifrado de mensajes que él elige (oráculo de `Enc`) |
| **Chosen-ciphertext** | CCA | Además puede pedir el **descifrado** de criptogramas que él elige (oráculo de `Dec`) |

En todos ellos se asume el [[principio-de-kerckhoffs|principio de Kerckhoffs]]: el algoritmo es público, sólo la clave es secreta.

> **La versión formal llegó en la Clase 02.** Esta tabla dice *qué información tiene* el adversario; la [[clase-02-cifrado|Clase 02]] convierte eso en **juegos con una probabilidad de ganar** — `Eav` (≈ COA), `Mul` y `CPA` — donde "seguro" pasa a significar *"ningún adversario PPT gana con más de $1/2 + \varepsilon(n)$"*. Ver [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]].
>
> El salto no es sólo de notación: la versión formal permite **demostrar** seguridad por reducción, mientras que la taxonomía sola sólo permite describir ataques.

> **Y la de CCA llegó en la Clase 03.** El juego $\mathsf{CCA}_{A,\Pi}$ —oráculo de `Dec` incluido, con la única restricción de no consultarlo sobre el criptograma desafío— está en [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]].
>
> **No es lo mismo que la fila `CCA` de la tabla de arriba**, y conviene no mezclarlas: acá `CCA` es una **categoría** que dice qué recursos tiene el adversario y cuya meta es *recuperar el plano*; allá es un **juego** cuya meta es *adivinar un bit* y cuya condición de aprobación es $\Pr[\mathsf{CCA}_{A,\Pi}(n)=1] \le \tfrac12 + \mathsf{negl}(n)$ para todo adversario $\mathrm{PPT}$. La categoría sirve para **describir** ataques; el juego, para **demostrar o refutar** seguridad exhibiendo un adversario concreto. El dato que la taxonomía no podía dar: **ningún criptosistema del curso pasa esa prueba** — ver [[maleabilidad]].

---

## El eje pasivo / activo

Es la primera bifurcación del árbol de ataques de la [[practica-01-esquemas-y-taxonomias|Práctica 01]], y corta la lista anterior justo por el medio:

- **Pasivo** — el adversario **sólo observa**. No interactúa con el sistema, no le entrega entradas: se limita a leer lo que pasa por el canal. Su objetivo es **obtener todo el texto plano**.
- **Activo** — el adversario **interactúa y elige las entradas**. Tiene acceso a algo que cifra o descifra a pedido, y lo usa para fabricarse pares $(\text{cifrado}, \text{plano})$ a medida.

| Modelo | Sigla | Pasivo / Activo | Qué controla / qué recibe | Qué obtiene |
|---|---|---|---|---|
| Ataque de texto cifrado solo | COA | Pasivo | *Dato:* el cifrado | Todo el plano |
| Ataque de texto plano conocido | KPA | Pasivo | *Dato:* pares $(\text{cifrado}, \text{plano})$ que no eligió | Todo el plano |
| Ataque de texto plano elegido | CPA | Activo | Elige el **plano** (oráculo de `Enc`) | Pares $(\text{cifrado}, \text{plano})$ **y todo el plano** |
| Ataque de texto cifrado elegido | CCA | Activo | Elige el **cifrado** (oráculo de `Dec`) | Pares $(\text{cifrado}, \text{plano})$ **y todo el plano** |

**El objetivo es el mismo en los cuatro: obtener todo el plano.** En la filmina de la [[practica-01-esquemas-y-taxonomias|Práctica 01]] los cuatro ataques llevan el bullet `Obtiene todo el plano`; lo que distingue a los activos es que **además** consiguen pares $(\text{cifrado}, \text{plano})$ a pedido. Esos pares son el **medio** — lo que el adversario se fabrica por interactuar —, no la meta. Por eso la columna *"qué controla / qué recibe"* mezcla dos cosas distintas según la rama: en los pasivos es un **dato que le llega** (la filmina los rotula *Dato:*), en los activos es **lo que él elige**.

La diferencia entre los dos activos es **qué punta del par elige**: en CPA se eligen los mensajes y se miran los criptogramas (oráculo de `Enc`); en CCA se eligen los criptogramas y se miran los mensajes (oráculo de `Dec`).

> La distinción no es sólo taxonómica: contra un adversario pasivo alcanza con proteger la confidencialidad de lo que ya está en el canal, mientras que uno activo puede **sondear** el sistema. Por eso un esquema puede ser seguro contra el primero y caer en una consulta contra el segundo — es exactamente lo que pasa con los cifrados clásicos más abajo.

### Por qué modelos tan generosos

Parecen poco realistas, pero se dan todo el tiempo:

- **KPA** — encabezados fijos de protocolo, formatos conocidos, saludos convencionales.
- **CPA** — cualquier servicio que cifre datos provistos por el usuario: si el atacante puede mandarse un mail a sí mismo por el sistema, tiene un oráculo de cifrado. Es la analogía que usa la cátedra al abrir la [[clase-03-macs-y-cifrado-autenticado#1. Repaso: el criptosistema y las pruebas de la Clase 02|Clase 03]]: el oráculo no es una abstracción de papel sino *"una suerte de servicio remoto"*, y el caso concreto es una **infraestructura de email** donde los mensajes viajan cifrados entre servidores — se manda un mail con el texto plano que uno quiera y, rastreando la salida del servidor, se cosecha el criptograma que le corresponde (cues 18-24 del 27/08). Lo mismo vale para cualquier protocolo de ida y vuelta donde el atacante controla parte de lo que se cifra.
- **CCA** — un servidor que descifra y responde distinto ante un padding inválido ya es, en la práctica, un oráculo de descifrado.

**Un esquema que sólo resiste COA no sirve para nada moderno.** El estándar mínimo actual es seguridad CPA.

---

## Cómo caen los cifrados clásicos bajo CPA

Es el Ej. 8 de la [[guia-01-criptografia-clasica|Guía 1]]. El punto es que la **recuperación total de la clave** se logra con **una sola consulta**:

| Esquema | Consulta | Resultado |
|---|---|---|
| [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] | $m = \texttt{abcdefghijklmnopqrstuvwxyz}$ | El criptograma **es** la tabla de $\pi$ completa |
| [[cifrado-de-vigenere\|Vigenère]] | $m = \texttt{aaaa}\dots \texttt{a}$ (largo ≥ $t$) | El criptograma **es** la clave repetida (porque $a$ = 0, $c_i = k_j$) |

Comparar con el esfuerzo en COA: en sustitución monoalfabética hace falta [[criptoanalisis-por-frecuencias|análisis de frecuencias]] con suficiente texto; en Vigenère hace falta [[test-de-kasiski|Kasiski]] más frecuencias por bloque. **El modelo cambia el costo del ataque en órdenes de magnitud** — de ahí que sea parte del enunciado y no un detalle.

> Detalle a cuidar en el caso Vigenère: con $m = \texttt{aaa}\dots$, se recupera la clave **sólo si `Enc` es determinístico y el mensaje arranca alineado con $k_{1}$**, que es el caso en el esquema clásico. En esquemas modernos `Enc` es probabilístico justamente para romper esto.

## Ver también

- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] — el árbol de ataques tal como se dio en clase
- [[ataque-de-fuerza-bruta|Ataque de fuerza bruta]] — el ataque genérico, disponible en cualquier modelo
- [[secreto-perfecto|Secreto perfecto]] — seguridad incondicional, sin límite de cómputo
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — `Eav`, `Mul` y `CPA` como juegos formales
- [[ataque-de-texto-cifrado-escogido|Ataque de texto cifrado escogido]] — el `CCA` de esta tabla convertido en juego formal, con el ejercicio que refuta al cifrado de flujo
- [[maleabilidad|Maleabilidad]] — el ataque **activo** que ninguna de las pruebas anteriores a `CCA` detecta: modificar el criptograma en vez de leerlo
- [[seguridad-computacional|Seguridad computacional]] — el marco donde estos modelos se vuelven demostrables
- [[principio-de-kerckhoffs|Principio de Kerckhoffs]]
