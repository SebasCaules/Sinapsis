---
title: Bibliografía
resumen: 'Los dos libros obligatorios de la materia, Katz y Lindell para el bloque de criptografía y Bishop para el de seguridad, con el capítulo que corresponde a cada clase, las lecturas designadas y los textos de consulta.'
fuentes: ["[[programa-y-objetivos]]", "[[reglamento-y-evaluacion]]", "[[clase-02-cifrado]]"]
aliases: [Bibliografía, Libros, Katz, Bishop]
type: catedra
clase: catedra
orden: 4
created: 2026-08-10
updated: 2026-09-04
tags: [catedra, bibliografia, katz-lindell, bishop, menezes]
sources: [Reglamento_Cripto.pdf, 72.44 - Criptografía y Seguridad.pdf, "Clase 03 - Criptografia - MACs y Cifrado Autenticado.pdf", "raw/clases/Clase 02pt2-Transcripcion.VTT", "raw/clases/Clase 03pt2 - Transcripcion.VTT", "Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf", "Clase 05 - Protocolos.pdf", "Clase 06 - Politicas.pdf", "Clase 07 - Aplicaciones - Principios y autenticacion.pdf", "Clase 08 - Control de acceso.pdf", "Clase 10 - Aplicaciones - Flujo de informacion.pdf", "Clase 11 - Seguridad en Redes.pdf", "Clase 12 - Analisis de vulnerabilidades.pdf", "Clase 13 - Pentesing.pdf"]
---

# Bibliografía

> Del [[reglamento-y-evaluacion|reglamento]], literal: *"la bibliografía obligatoria de la materia es el material de referencia principal. Salvo expresa disposición de la cátedra, **los temas tratados en la bibliografía constituyen el cuerpo de conocimiento sobre el cual serán evaluados los alumnos**"*. El alcance de un parcial **no** está acotado a lo dicho en clase.

## Obligatoria — disponible en el vault

Los dos libros están en [`raw/material_Catedra/bibliografia/`](../../raw/material_Catedra/bibliografia/).

### 1. Katz & Lindell — Introduction to Modern Cryptography

[`Katz y Lindell - Introduction to Modern Cryptography.pdf`](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf)

> Katz, J., & Lindell, Y. (2020). *Introduction to modern cryptography* (3rd ed.). CRC Press.
> *(el programa 2023 cita la 2ª ed. de 2014; el reglamento vigente cita la 3ª — el PDF del vault es la 3ª)*

**Cubre el bloque 1 (Criptografía — Clases 1-5, 1er parcial.)** Es la fuente del enfoque formal `(Gen, Enc, Dec)` que usa la cátedra para las definiciones.

> **Cómo leer las tablas.** El número de capítulo es un **link que abre el PDF en esa página**. La columna *Pág. libro* es la numeración impresa, para cuando cites o busques por índice. En este PDF **página física = impresa + 21** (la portada, el índice y el prefacio no están numerados).

| Cap. | Tema | Pág. libro | Clase |
|---|---|---|---|
| **[1](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=24)** | Introduction — incluye §1.3 *Historical Ciphers and Their Cryptanalysis* | 3 | [[clase-01-introduccion-y-criptografia-clasica\|Clase 1]] |
| **[2](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=46)** | Perfectly Secret Encryption | 25 | [[clase-01-introduccion-y-criptografia-clasica\|Clase 1]] |
| **[3](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=64)** | Private-Key Encryption — seguridad computacional, CPA/CCA | 43 | [[clase-02-cifrado\|Clase 2]] |
| **[4](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=128)** | Message Authentication Codes | 107 | [[clase-03-macs-y-cifrado-autenticado\|Clase 3]] — **lectura designada** |
| **[5](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=174)** | Hash Functions and Applications | 153 | [[clase-03-macs-y-cifrado-autenticado\|Clase 3]] *(la filmina no lo pide)* |
| **[6](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=214)** | Practical Constructions of Symmetric-Key Primitives — DES/AES | 193 | [[clase-02-cifrado\|Clase 2]] |
| **[7](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=262)** | Theoretical Constructions of Symmetric-Key Primitives | 241 | [[clase-02-cifrado\|Clase 2]] *(opcional)* |
| **[8](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=306)** | Number Theory and Cryptographic Hardness Assumptions | 285 | Clase 4 *(soporte)* |
| **[9](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=362)** | Algorithms for Factoring and Computing Discrete Logarithms | 341 | Clase 4 *(opcional)* |
| **[10](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=380)** | Key Management and the Public-Key Revolution | 359 | Clase 5 · Guía 4 |
| **[11](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=396)** | Public-Key Encryption — RSA, El Gamal | 375 | Clase 4 |
| **[12](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=460)** | Digital Signature Schemes | 439 | Clases 4-5 · Guía 4 |
| **[13](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=508)** | Advanced Topics in Public-Key Encryption | 487 | — |
| **[A](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=558)** | Mathematical Background | 537 | — |
| **[B](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=568)** | Basic Algorithmic Number Theory | 547 | — |

> **Qué respalda la columna *Clase*.** Dos filas **no son inferencia**: las clases que llegaron a su última filmina designan la lectura ellas mismas.
>
> - **Caps. 2 y 3** los manda la última filmina de la [[clase-02-cifrado|Clase 02]], y el docente la lee en voz al cerrar el 20/08 (cue pt2 517). Al cerrar el 13/08 había dicho **1, 2 y 3** — el capítulo 1 lo agrega él, no la filmina.
> - **Cap. 4** lo manda la última filmina de la [[clase-03-macs-y-cifrado-autenticado|Clase 03]], la 41, que no dice otra cosa: *"Lectura Recomendada — **Capítulo 4** — Introduction to Modern Cryptography — Katz & Lindell"*. Es **la tarea de lectura de esa clase**, junto con el ataque al sufijo del `CBC-MAC`. **Y quedó encargada en voz**, cosa que el 27/08 no había pasado: el docente cierra la segunda sesión con *"todo lo que es integridad desde el punto de vista de criptografía se cubre en el capítulo 4 del libro de [Katz]"* (cue pt2 907). Ojo con lo que eso implica: la cátedra ubica **todo** el bloque de integridad —MACs *y* funciones de hash— en el capítulo 4, mientras que en esta edición del libro las funciones de hash son el **capítulo 5**. Probablemente sea diferencia de edición; hasta resolverlo, las dos filas de la tabla conviven y la de abajo lo aclara.
>
> **Material extra prometido al campus, dos veces el mismo día, y todavía no está en `raw/`.** Al cerrar el 03/09 el docente anuncia dos entregas: la **demostración de seguridad de `CCM`** —*"esta demostración no está en el libro de [Katz]. Se la vamos a subir (…) como material adicional en campus"* (cues pt2 806-808)—, que es la que habilita usar **una sola clave** en ese modo y sin la cual la filmina 38 queda enunciada y no verificada; y material para *"algunos de los temas que vimos [que] no están en el libro de [Katz] (…) demostraciones o algunas propiedades no tan básicas"* (cues pt2 908-909). Ninguna de las dos está bajada al vault. Es la segunda deuda de material de la cátedra, junto con los **ejemplos de parcial** que el docente recorre en el campus el 20/08.

> Y una precisión que importa: esa filmina **pide el 4 y sólo el 4**. El **capítulo 5** —*Hash Functions and Applications*— es el que cubre las filminas 22-35 de esa misma clase, pero la cátedra **no lo designó**; esa fila es lectura nuestra. Vale la pena leerlo igual: el [[reglamento-y-evaluacion|reglamento]] evalúa sobre la bibliografía, no sobre lo designado en clase.
>
> El resto de la columna sale del [[programa-y-objetivos|programa]], que lista temas por clase pero **no cita capítulos**.

> **Corrección respecto de la versión anterior de esta nota:** decía *"13-14 Digital Signatures"*. En este PDF **no existe el capítulo 14** — el libro termina en el 13 — y *Digital Signature Schemes* es el **capítulo 12**. Probablemente venía de la numeración de la 2ª edición.

#### Detalle de los capítulos 1 y 2 — lo que ya se cursó

El PDF no trae marcadores de sección, así que estas páginas las saqué escaneando el texto del capítulo.

| § | Tema | Pág. libro |
|---|---|---|
| **[1.1](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=24)** | Cryptography and Modern Cryptography | 3 |
| **[1.2](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=25)** | The Setting of Private-Key Encryption | 4 |
| **[1.3](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=29)** | **Historical Ciphers and Their Cryptanalysis** — rotación, sustitución, Vigenère | 8 |
| **[1.4](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=37)** | Principles of Modern Cryptography — Kerckhoffs, definiciones, demostraciones | 16 |
| **[2.1](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=47)** | Definitions — secreto perfecto | 26 |
| **[2.2](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=53)** | The One-Time Pad | 32 |
| **[2.3](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=56)** | Limitations of Perfect Secrecy | 35 |
| **[2.4](../../raw/material_Catedra/bibliografia/Katz%20y%20Lindell%20-%20Introduction%20to%20Modern%20Cryptography.pdf#page=57)** | ***Shannon's Theorem*** — la cota $\lvert K\rvert \ge \lvert M\rvert$ | 36 |

Dos anclas concretas: **§1.3** es exactamente el temario de cifrados clásicos de la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] y de la [[guia-01-criptografia-clasica|Guía 1]], y **§2.4** es el teorema que la nota de [[secreto-perfecto|secreto perfecto]] cita como cota $\lvert K\rvert \ge \lvert M\rvert$.

El **capítulo 2** completo es además el respaldo teórico del apunte [[probabilidad-y-criptografia|Probabilidad y criptografía]] (marco probabilístico y ejemplos numéricos de secreto perfecto).

### 2. Matt Bishop — Computer Security: Art and Science

[`Matt Bishop - Computer Security Art and Science.pdf`](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf)

> Bishop, M. (2018). *Computer Security – Art and Science* (2nd ed.). Addison-Wesley Professional.

**Cubre el bloque 2 (Seguridad — Clases 6-11, 2do parcial).** Son 31 capítulos y 1437 páginas: el curso toma una fracción, así que la columna *Clase* es la que decide qué leer.

> En este PDF **página física = impresa + 50**.

> **El mapeo capítulo ↔ clase de esta tabla es inferencia mía**, no de la cátedra: el [[programa-y-objetivos|programa]] lista temas por clase pero **no cita capítulos** de Bishop. Los números de capítulo, títulos y páginas sí son del PDF, verificados uno por uno. Revisalo cuando la cátedra indique lecturas.

| Cap. | Tema | Pág. libro | Clase |
|---|---|---|---|
| **[1](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=53)** | An Overview of Computer Security | 3 | Clase 6 |
| **[2](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=81)** | Access Control Matrix | 31 | Clase 6 · Guía 6 |
| **[3](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=99)** | Foundational Results | 49 | Clase 6 *(opcional)* |
| **[4](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=159)** | Security Policies | 109 | Clase 6 |
| **[5](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=191)** | Confidentiality Policies — Bell-LaPadula | 141 | Clase 6 |
| **[6](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=223)** | Integrity Policies — Biba, Lipner, Clark-Wilson | 173 | Clase 6 |
| **[7](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=251)** | Availability Policies | 201 | Clase 6 |
| **[8](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=277)** | Hybrid Policies — Chinese Wall, RBAC | 227 | Clase 6 |
| **[9](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=305)** | Noninterference and Policy Composition | 255 | Clase 6 · Clase 9 |
| **[10](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=339)** | Basic Cryptography | 289 | *repaso del bloque 1* |
| **[11](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=381)** | Key Management | 331 | Clase 5 · Guía 4 |
| **[12](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=417)** | Cipher Techniques | 367 | [[clase-02-cifrado\|Clase 2]] |
| **[13](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=465)** | Authentication | 415 | Clase 7 · Guía 7 |
| **[14](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=505)** | Design Principles | 455 | Clase 8 |
| **[15](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=521)** | Representing Identity | 471 | Clase 7 |
| **[16](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=557)** | Access Control Mechanisms — ACLs, capacidades | 507 | Clase 6 · Guía 6 |
| **[17](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=589)** | Information Flow | 539 | Clase 9 · Guía 8 |
| **[18](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=629)** | Confinement Problem — canales ocultos | 579 | Clase 9 · Guía 8 |
| **[19](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=677)** | Introduction to Assurance | 627 | Clase 8 |
| **[20](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=699)** | Building Systems with Assurance | 649 | Clase 8 |
| **[21](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=749)** | Formal Methods | 699 | *(opcional)* |
| **[22](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=777)** | Evaluating Systems | 727 | Clase 8 |
| **[23](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=825)** | Malware | 775 | Clase 9 |
| **[24](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=875)** | Vulnerability Analysis — penetration testing | 825 | Clase 8 · Guía 9 |
| **[25](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=929)** | Auditing | 879 | Clase 10 · Guía 9 |
| **[26](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=967)** | Intrusion Detection | 917 | Clase 10 |
| **[27](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=1009)** | Attacks and Responses | 959 | Clase 10 |
| **[28](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=1055)** | Network Security | 1005 | Clase 10 |
| **[29](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=1085)** | System Security | 1035 | Clase 10 |
| **[30](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=1123)** | User Security | 1073 | Clase 11 |
| **[31](../../raw/material_Catedra/bibliografia/Matt%20Bishop%20-%20Computer%20Security%20Art%20and%20Science.pdf#page=1149)** | Program Security | 1099 | Clase 8 · Guía 9 |

---

## Lectura designada de las Clases 4 a 10 — filminas de cierre de cada deck

Los siete decks nuevos —Clases 04 a 10— cierran, cada uno, con una filmina titulada *"Lectura Recomendada"* o *"Lectura recomendada"*. Es la cátedra fijando, ella misma, qué leer de cada clase — el mismo estatus que ya tiene el capítulo 4 de Katz & Lindell para la Clase 03, más arriba. Se renderizó a 150 dpi (300 dpi para la de Clase 09) la última filmina de cada deck —nunca declarada contra `pdftotext`— y se transcribe acá tal como aparece, con el capítulo corregido a la derecha cuando corresponde.

> **Clases 4 a 10 todavía no se dictaron** (hoy 04/09/2026): no hay transcripción que confirme o corrija estas lecturas en voz, a diferencia de las de Clases 2-3 de más arriba, donde el docente las repite hablado y eso quedó citado con cue.

| Clase (vault) | Deck, filmina de cierre | Lectura tal como la escribe la filmina | Lectura en la edición del vault |
|---|---|---|---|
| [[clase-04-criptografia-asimetrica-y-firma-digital#14. Cierre y bibliografía\|Clase 04]] | `Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf`, filmina 41 | Katz & Lindell, **capítulos 9-12** | No aplica el problema de Bishop — es Katz & Lindell, sin desfasaje. La tensión con lo que esta bibliografía ya tenía asignado al cap. 10 (Clase 05) se discute en detalle en la nota de Clase 04 |
| [[clase-05-protocolos-criptograficos#14. Change Cipher Spec, Alert y panorama final\|Clase 05]] | `Clase 05 - Protocolos.pdf`, filmina 48 | Bishop, **cap. 11** (*Key Management*) · RFC 5246 (`TLS` 1.2) · vulnerabilidad de renegociación de `TLS` (2009, `g-sec.lu/practicaltls.pdf`) | Sin desfasaje — coincide letra por letra con la fila 11 de la tabla de arriba |
| [[clase-06-politicas-de-seguridad-y-control-de-acceso#15. OAuth 2.0\|Clase 06]] | `Clase 06 - Politicas.pdf`, filmina 56 *(fusión con el deck de abajo — ver el encabezado de esta ingesta)* | Bishop, **cap. 4** completo · **5.1-5.4** · **6.1-6.2** · **7.1** · **8.1** | Sin desfasaje — coincide letra por letra con las filas 4 a 8 de arriba |
| [[clase-06-politicas-de-seguridad-y-control-de-acceso#15. OAuth 2.0\|Clase 06]] | `Clase 08 - Control de acceso.pdf`, filmina 43 *(fusión con el deck de arriba)* | Bishop, **cap. 15** (*Representing Identity*) · `OAuth 2.0` — RFC 6749 | **Cap. 16** (*Access Control Mechanisms* — ACLs y capacidades), aplicando el mismo desfasaje de +1 que las tres filas de abajo — ver la discusión |
| [[clase-07-autenticacion#10. Autenticación remota y SSO\|Clase 07]] | `Clase 07 - Aplicaciones - Principios y autenticacion.pdf`, filmina 46 *(cierre del deck completo — el mismo deck que, en sus páginas 2-15, alimenta la Clase 08)* | Bishop, **caps. 12-13** | **Caps. 13-14** (*Authentication* + *Design Principles*) — ver la discusión |
| [[clase-08-principios-de-diseno-y-vulnerabilidades#7. Identificación de vulnerabilidades\|Clase 08]] | `Clase 12 - Analisis de vulnerabilidades.pdf`, filmina 22 | Bishop, **caps. 18-19** | **Caps. 19-20** (*Introduction to Assurance* + *Building Systems with Assurance*) — ver la discusión |
| [[clase-08-principios-de-diseno-y-vulnerabilidades#11. Validez de las pruebas de penetración — para discutir\|Clase 08]] | `Clase 13 - Pentesing.pdf`, filmina 32 | Bishop, **cap. 23**, secc. 1-2 · `OSSTMM` | **Cap. 24** (*Vulnerability Analysis — penetration testing*) — ver la discusión |
| [[clase-09-flujo-de-informacion#9. Métodos de aislación\|Clase 09]] | `Clase 10 - Aplicaciones - Flujo de informacion.pdf`, filmina 27 | Bishop, **cap. 16-1** (¿sección 16.1? no se puede confirmar sin la edición citada) y **cap. 17** | **Caps. 17-18** (*Information Flow* + *Confinement Problem*) — ver la discusión |
| [[clase-10-seguridad-en-la-empresa#11. Variaciones de la arquitectura (filminas 34-35)\|Clase 10]] | `Clase 11 - Seguridad en Redes.pdf`, filmina 36 | Bishop, **cap. 26** — la propia filmina 4 del mismo deck ya cita ese número al pie de un diagrama, con título puesto: *"Figura tomada de Computer Security Art & Science – Matt Bishop. Cap 26 – Network Security – pp 780"* | **Cap. 28** (*Network Security*) — desfasaje propio, de +2, no de +1 — ver la discusión |
| Clase 11 — Protección de datos | — no hay deck | Sin lectura designada: no hay filmina de la que sacarla. La única fuente de esta clase sigue siendo [[video-12-proteccion-de-datos-personales\|video-12]] | — |

### El desfasaje de numeración de Bishop: qué edición, si es sistemático, y la lectura correcta

Esta bibliografía mapea, en toda su tabla de Bishop de más arriba, la **2ª edición (2018)** — la que está físicamente en `raw/material_Catedra/bibliografia/`, verificada capítulo por capítulo contra ese PDF. Dos notas de concepto de la Clase 8 —[[identificacion-de-vulnerabilidades#La lectura recomendada de la filmina 22, y el desfasaje de numeración de Bishop|Identificación de vulnerabilidades]] y [[validez-de-las-pruebas-de-penetracion#Lectura recomendada, y el mismo desfasaje de numeración que ya aparece en el bloque de vulnerabilidades|Validez de las pruebas de penetración]]— habían detectado, cada una por su lado y sobre un deck distinto, que el número de capítulo que trae la filmina no coincide con esta edición, sin poder confirmar contra qué edición sí coincidiría. Cruzando las nueve lecturas de la tabla de arriba, el patrón se puede precisar bastante más:

- **Capítulos 1 a 11: sin desfasaje.** El deck de Políticas (caps. 4-8) y el de Protocolos (cap. 11) citan capítulos que coinciden, letra por letra y tema por tema, con la fila correspondiente de la tabla de Bishop de esta edición.
- **Capítulos 12 en adelante: +1, confirmado de forma independiente en cuatro decks.** Principios y autenticación (12-13 → 13-14), Control de acceso (15 → 16), Flujo de información (16-17 → 17-18), Vulnerabilidades (18-19 → 19-20) y Pentesting (23 → 24) — cinco lecturas en total, repartidas en cuatro decks. En los cinco casos la corrección hace que el capítulo coincida exactamente con el tema del deck que lo cita, y sin corregir ninguno coincide: *Cipher Techniques* no es *Design Principles*, *Representing Identity* no es lo que recomendaría un deck que se llama, literalmente, "Control de acceso". Es además, en las cinco filas, exactamente el capítulo que esta misma bibliografía ya le tenía asignado a esa clase **antes** de esta ingesta, por inferencia de tema, sin haber visto ninguna de estas filminas todavía — la evidencia nueva confirma la inferencia vieja, capítulo por capítulo, en las filas 13, 14, 16, 17, 18, 19, 20 y 24 de la tabla de más arriba.
- **Seguridad en Redes: un desfasaje propio, de +2, y no hace falta inferirlo por tema.** La filmina 36 recomienda "el capítulo 26", pero la filmina 4 del mismo deck ya había citado ese mismo número **con el título puesto**, al pie de un diagrama: *"Cap 26 – Network Security"* (cita completa y contexto en la nota de [[clase-10-seguridad-en-la-empresa#1. Seguridad a nivel de red (filminas 2-4)|Clase 10, §1]]). En la edición del vault, *Network Security* es el capítulo **28**. Es la única de las nueve lecturas que no depende de adivinar el tema: la propia filmina puso el número y el título juntos, así que el corrimiento de dos capítulos —no de uno— queda confirmado por texto explícito, no por inferencia.

**¿Es sistemático, entonces?** Parcialmente, y no para todo el libro por igual. El +1 se repite igual en cuatro decks que van del capítulo 12 al 24, lo cual sí sugiere una causa común: probablemente estas filminas retienen la numeración de una edición de Bishop anterior a la de 2018, una que no traía separado como capítulo propio lo que en esta edición es el capítulo 12, *Cipher Techniques* — desde ahí en adelante, cada capítulo de esa edición corre uno atrás del correspondiente en ésta. *(Inferencia nuestra. No se pudo confirmar contra un ejemplar de esa edición anterior, ni siquiera identificar con certeza cuál sería: una búsqueda no devolvió una fuente confiable con el índice exacto de una edición previa de Bishop, así que la hipótesis del capítulo insertado queda como la explicación más simple compatible con los datos, no como un hecho verificado.)* Pero el patrón no cubre el libro entero: dos decks (Políticas, Protocolos) ya citan la numeración de 2018 sin corrimiento, y uno (Seguridad en Redes) tiene un corrimiento distinto, de dos capítulos, confirmado por texto explícito y no por tema. La explicación más simple, coherente con que estos son **13 decks de numeración histórica propia** que la cátedra no armó todos en el mismo momento (ver el encabezado de esta ingesta): cada deck retiene la numeración de Bishop que tenía vigente la última vez que se lo revisó, y esa revisión no fue simultánea para los trece — algunos ya citan la edición de 2018, otros se quedaron una edición atrás, y al menos uno, más atrás todavía.

**La lectura correcta**, entonces, es la de la columna derecha de la tabla de arriba en cada fila marcada — buscada por **título de capítulo**, no por número, exactamente como ya recomiendan las notas de [[identificacion-de-vulnerabilidades|Identificación de vulnerabilidades]] y [[validez-de-las-pruebas-de-penetracion|Validez de las pruebas de penetración]] para sus dos casos.

---

## De consulta

No están en el vault; se citan en el programa como complementarias.

| Libro | Para qué sirve |
|---|---|
| **Anderson, R.** (2008). *Security Engineering* (2nd ed.). Wiley | Seguridad como disciplina de ingeniería, casos reales a escala. Ideal para el TP y para la parte de "seguridad en la empresa" |
| **Menezes, van Oorschot, Vanstone** (1997). *Handbook of Applied Cryptography*. CRC — *"el Libro Verde"* | **El único de esta lista que el docente recomendó en clase**, y con un destino concreto: **el detalle de DES y AES**. Referencia enciclopédica, de consulta puntual y no de lectura lineal. Hay ejemplar **en la biblioteca**; además está libre en [cacr.uwaterloo.ca/hac](https://cacr.uwaterloo.ca/hac/) |
| **Schneier, B.** (1996). *Applied Cryptography* (2nd ed.). Wiley | Clásico; muy legible pero desactualizado en recomendaciones concretas |
| **Howard, LeBlanc, Viega** (2009). *24 Deadly Sins of Software Security*. McGraw-Hill | Catálogo de vulnerabilidades de aplicación. Útil para Clases 8-9 y Guía 9 |
| **Pfleeger & Pfleeger** (2006). *Security in Computing* (4th ed.). Prentice Hall | Panorama general de seguridad |

### El Libro Verde: el único de estos cinco que se nombró en clase

De los cinco complementarios, cuatro son una lista que nadie mencionó nunca. **Menezes es la excepción.** Al cerrar la [[clase-02-cifrado#El cierre del 20/08: el campus, los ejemplos de parcial y el libro de aritmética|Clase 02]] el 20/08, justo después de mandar los capítulos 2 y 3 de Katz, el docente agrega (cue pt2 517):

> *"El libro de Menezes, que es **el Libro Verde**, está también **en la biblioteca**. Es un libro más bien de consulta: **ahí tienen DES descripto**, y si es una buena edición **tiene AES también**."*

Eso lo mueve de enciclopedia genérica a **referencia designada para el detalle que las filminas no dan**: el bit a bit de [[des-y-3des|DES]] y [[aes|AES]]. Tres cosas que la fuente sí dice: el apodo, que hay ejemplar en la biblioteca, y que el uso es de consulta puntual.

> **La reserva sobre AES es del propio docente, y tiene fundamento.** *"Si es una buena edición"* apunta a un problema real: el *Handbook* que cita el programa es de **1997** y `AES` se estandarizó en **2001** (FIPS 197), así que **esa edición no puede traerlo** — `DES` sí está, `AES` no. *(Precisión nuestra.)* Para `AES` el vault ya tiene la nota de concepto, y para `DES` a nivel de bit está [[des-descripcion-del-algoritmo|Descripción del algoritmo DES]], que es material que la cátedra publica en el campus.

---

## Recomendado en clase, fuera del programa

Un libro que **no** figura en ninguna de las dos listas del programa —ni obligatoria ni complementaria— y que el docente recomendó igual. **Es material optativo**, y así lo presentó: *"para los que sean más nerds de ustedes"*. No entra en lo que el [[reglamento-y-evaluacion|reglamento]] declara evaluable.

**Un libro de aritmética de María Lina Becquer y Carlos Sánchez**, para quien quiera profundizar en **teoría de números**. Lo recomienda en el último minuto de la [[clase-02-cifrado#El cierre del 20/08: el campus, los ejemplos de parcial y el libro de aritmética|Clase 02]], el 20/08 (cues pt2 536-540):

> *"Para los que sean **más nerds** de ustedes, si les copa el tema de teoría de números, les recomiendo este libro. Es un libro buenísimo **de aritmética**; es un libro que se usa para **las olimpíadas de matemática**, o se usaba, por lo menos. Es de **María Lina Becquer y Carlos Sánchez** (…) Tiene un montón de ejercicios súper interesantes de teoría de números, **divertidos** (…) y están basados en todo lo que tiene que ver con teoría de números **que se usa en criptografía**."*

**Lo que la fuente dice:** los dos **autores**, que es un libro **de aritmética**, que se usa —*"o se usaba, por lo menos"*— en las **olimpíadas de matemática**, y que trae ejercicios de teoría de números conectados con la que la criptografía usa.

**Lo que la fuente NO dice:** el **título exacto**, el **año**, la **editorial** y la **edición**. Ninguno de los cuatro aparece en la transcripción, así que acá no se completan. **Sin título no hay cita bibliográfica posible**: esto queda como pista para buscar, no como referencia.

Y el contraste que conviene no perder: la otra cosa que el docente encarga sobre teoría de números —los **dos videos** de [[teoria-de-numeros|Teoría de números]]— viene **atada al parcial**; este libro **no**. Son dos niveles distintos de obligación y la nota de ese apunte los mantiene separados.

> Del mismo pasaje sale un dato al margen, el único del curso sobre la formación común del equipo docente: Becquer y Sánchez **fueron profesores de los tres** —Ramele, Pablo y Ana— en la **Escuela Superior Técnica del Ejército** (el ASR escribe *"la Escuela Savio del Ejército"*).

## Ver también

- [[programa-y-objetivos|Programa y objetivos]] — el mapeo tema ↔ clase
- [[reglamento-y-evaluacion|Reglamento y evaluación]] — por qué esta nota importa: se evalúa **sobre la bibliografía**, no sobre lo dicho en clase
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] — designa los caps. 2 y 3, y es de donde salen el Libro Verde y el de aritmética
- [[clase-03-macs-y-cifrado-autenticado|Clase 03 — MACs y cifrado autenticado]] — designa el cap. 4 en su última filmina
- [[clase-04-criptografia-asimetrica-y-firma-digital|Clase 04 — Criptografía asimétrica y firma digital]] — designa Katz & Lindell, caps. 9-12
- [[clase-05-protocolos-criptograficos|Clase 05 — Protocolos criptográficos]] — designa el cap. 11 de Bishop, sin desfasaje
- [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 06 — Políticas de seguridad y control de acceso]] — dos decks fusionados, dos lecturas designadas (caps. 4-8 y cap. 15/16)
- [[clase-07-autenticacion|Clase 07 — Autenticación]] — designa los caps. 12-13, corregidos a 13-14
- [[clase-08-principios-de-diseno-y-vulnerabilidades|Clase 08 — Principios de diseño y vulnerabilidades]] — dos decks, dos lecturas, y el desfasaje de +1 que esta nota resuelve
- [[clase-09-flujo-de-informacion|Clase 09 — Flujo de información]] — designa los caps. 16-17, corregidos a 17-18
- [[clase-10-seguridad-en-la-empresa|Clase 10 — Seguridad en la empresa]] — designa el cap. 26, corregido a 28 (el único desfasaje de +2)
- [[identificacion-de-vulnerabilidades|Identificación de vulnerabilidades]] y [[validez-de-las-pruebas-de-penetracion|Validez de las pruebas de penetración]] — las dos notas que detectaron el desfasaje de Bishop antes de que esta nota lo resolviera en conjunto
