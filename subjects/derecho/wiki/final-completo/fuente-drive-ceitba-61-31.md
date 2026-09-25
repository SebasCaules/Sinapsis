---
title: "Fuente — Drive del CEITBA, carpeta 61.31 Derecho para Ingenieros"
resumen: "Describe el volcado completo del Drive del CEITBA para la materia: qué carpetas contiene, qué finales y parciales nuevos aporta al banco de preguntas, el Notion público de la cursada 2C 2024 y otras fuentes externas encontradas."
type: fuente
unidades: [1, 2, 3, 4, 5, 6, 7, 8, 9]
unidad: final
fuentes: ["Drive CEITBA carpeta Grado / 61.31 - Derecho para Ingenieros", "Notion público ichayer — Derecho para Ingenieros [61.32]"]
fecha_creacion: 2026-09-04
ultima_actualizacion: 2026-09-04
---

# Fuente — Drive del CEITBA, carpeta 61.31

## Qué es y de dónde salió

Carpeta pública de la materia dentro del Drive de apuntes del **CEITBA** (Centro de Estudiantes del ITBA), sección **Grado**. La carpeta raíz del Drive es
`https://drive.google.com/drive/folders/166gw4JGtHVHFGbIyKN3m5DfKJuX8qpNu` y la de la materia es
`https://drive.google.com/drive/folders/1W_af647Oy2rVI0vhch00PcgzR9Uikb2g`.

**El código oficial de la materia en el Drive es 61.31**, no 61.32. La numeración 61.32 aparece en un Notion público de alumnos (ver abajo); conviene buscar por las dos.

Bajado completo el **4 de septiembre de 2026**: se inventariaron 396 archivos y se bajaron **392, 982 MB**. Los cuatro restantes eran tres accesos directos a resúmenes duplicados y el video de un parcial, que se bajó aparte. El espejo está en `raw/drive-ceitba/`, con la misma estructura de carpetas del Drive. Las conversiones a texto plano están en `.converted/drive-ceitba/`.

Herramientas del volcado, reproducibles, en `tools/drive-sync/`:

| Script | Qué hace |
|---|---|
| `crawl.py` | Recorre el Drive público por `embeddedfolderview` y arma `inventory.json` con ruta, id y tipo MIME de cada archivo |
| `download.py` | Descarga todo preservando la estructura; exporta los documentos nativos de Google a `.docx`; deja `manifest.json` |
| `convert.py` | Convierte a texto los PDF, DOCX, PPTX, PPT y DOC |
| `ocr.sh` | OCR en español de los PDF escaneados sin capa de texto |
| `recalcular_matriz.py` | Recalcula la matriz de frecuencias con los finales nuevos y verifica que cada columna sume su número de preguntas |

## Inventario por carpeta

| Carpeta del Drive | Archivos | Qué contiene |
|---|---|---|
| `Examenes/Final/` | 13 | El material de finales: los tres finales de 2015 resueltos, el compilado de finales, el final de febrero 2025, el virtual de diciembre 2020 y el material del reducido |
| `Examenes/Parciales/` | 190 | Primeros y segundos parciales de 2015 a 2025, muchos como fotos por pregunta |
| `Examenes/` (raíz) | 12 | Compendios de preguntas: "derecho al infierno", "PREGUNTAS", "Preguntas Resueltas" |
| `Parcialitos/2C 2024/` | 38 | Los cinco parcialitos de la cursada 2C 2024, en fotos |
| `Material Útil/Powers Clases/` | 49 | Los power points de cátedra por unidad |
| `Material Útil/Resumenes/` | 34 | Resúmenes de alumnos, incluidos varios de 2004 |
| `Material Útil/Libro/` | 6 | El libro de Perego en varias versiones, una con anotaciones |
| `Material Útil/` (resto) | 24 | Apuntes de clase, Constitución Nacional, código de ética |
| `TP/` | 14 | Trabajos prácticos de otros años, útiles como modelo |

## Lo que aporta al final completo

Lo más valioso son los **siete finales fechados que el banco de preguntas no tenía**, más un octavo virtual. Están detallados en [[banco-preguntas]]; el resumen es:

| Examen | Archivo en `raw/drive-ceitba/` | Aporta |
|---|---|---|
| Final febrero 2025 | `Examenes/Final/Febrero 2025/Final Derecho - Febrero 2025.jpg` | Es el final más reciente conocido. Foto de las 5 consignas |
| Final virtual 17/12/2020 | `Examenes/Final/Tincho/2020 2C.docx` | Examen entero con las respuestas de un alumno y el formato virtual de Blackboard |
| Final julio 2015, 1er llamado | `Examenes/Final/Finales 2015 (resueltos).pdf` | 5 consignas con desarrollo modelo |
| Final julio 2015, 2do llamado | mismo archivo | 4 consignas transcriptas con desarrollo |
| Final diciembre 2015, 1er llamado | mismo archivo | 4 consignas transcriptas con desarrollo |
| Final diciembre 2019, 1ra fecha | `Examenes/COMPILADO derecho_al_infierno.pdf` | 5 consignas, algunas resueltas |
| Final diciembre 2019, 2da fecha | mismo archivo | 4 consignas identificables de 5; la segunda figura como "???" en la fuente |
| Final 14/12/2018, segunda versión | mismo archivo | 5 consignas distintas de las del 14/12/2018 que ya estaba en el banco. Ver la advertencia de [[matriz-frecuencias]] §2 |

Además, el compilado "derecho al infierno" trae **resueltos** dos finales que el banco ya tenía sin respuestas: el del **02/09/2015** y el del **14/12/2018**.

El final del **02/09/2015** aparece también como foto en `Examenes/Final/F 2015 2C.pdf`, con el encabezado "Final Derecho 61.31 — 2 de septiembre 2015", que es lo que confirma el código de la materia.

## Otros exámenes recuperados

- **1er parcial 2C 2023 completo y corregido**: el archivo `Examenes/Parciales/1er Parcial/2C 2023/20230924_183247.mp4` es la grabación de pantalla de un parcial ya corregido en Blackboard. Las 20 preguntas quedaron transcriptas, con la opción elegida y el puntaje de cada una, en `.converted/drive-ceitba/Examenes/Parciales/1er Parcial/2C 2023/video-blackboard-transcripcion.md`.
- **Parciales 1C 2025** (primero y segundo), en fotos: son los más recientes del corpus de parciales.
- **Parcialitos 2C 2024** de las cinco unidades evaluadas.

## El Notion público de la cursada 2C 2024

Dentro de `Material Útil/` había un documento que era solo un enlace a un **Notion público de alumnos** de la cursada 2C 2024:
`https://app.notion.com/p/ichayer/Derecho-para-Ingenieros-61-32-81ee7501e132465eb776eed1903074ff`

Ese Notion aporta dos datos que el wiki no tenía:

1. **El plantel docente de 2024**: Pablo Perego, Cristina Canto, Sofía Lavandera y Oscar Blázquez.
2. **La cursada tuvo once clases, no nueve**. Además de las nueve unidades del temario del wiki aparecen dos temas más:
   - **Clase 10 — Derecho procesal**
   - **Clase 11 — Delitos informáticos**

Esto coincide con dos señales independientes: los mazos de tarjetas de Brainscape que circulan entre alumnos de la materia incluyen "Derecho procesal" y "Derecho informático", y los compendios de preguntas del Drive también los mencionan. El hueco quedó cubierto con [[derecho-procesal|derecho-procesal]] y [[delitos-informaticos|delitos-informaticos]].

### Qué se bajó de ese Notion

A `raw/notion-ichayer-2C2024/` (146 archivos, 81 MB) y `.converted/notion-ichayer-2C2024/`:

| Material | Detalle |
|---|---|
| Clases 10 y 11 en PDF | Las diapositivas de derecho procesal y de delitos informáticos |
| Apuntes de esas dos clases | Transcriptos de las páginas de Notion. Son **más ricos que las diapositivas**, sobre todo en derecho procesal |
| Las 5 fichas del "Final Reducido" | Marcas, responsabilidad civil, contratos, concursos y quiebras, laboral. Escritas en Notion, no en PDF |
| Actividades 1 a 5 | Las cinco actividades evaluadas de la cursada, dos en PDF y tres resueltas en Notion |
| Megadocs de 1er y 2do parcial | Compilados de preguntas |
| **131 fotos de parciales reales de 2C 2024** | 65 de segundos parciales (nueve exámenes distintos, notas de 71 a 100) y 66 de primeros parciales en Blackboard (cuatro exámenes completos, notas de 64 a 84). Transcriptas en `compilado-2do-parcial-transcripcion.md` y `compilado-1er-parcial-transcripcion.md` |

Varias de esas fotos muestran la **clave de corrección**, lo que permitió confirmar tres trampas que el wiki ya sospechaba y una que no: el caso del cheque de Gutiérrez se resuelve con el escueto "lo rechaza" y no con "lo rechaza por inválido"; la clave de "dación en pago" marca la definición de pago y no la doctrinaria; la Ley 24.240 no aplica cuando el bien se integra al proceso productivo pero sí cuando sirve a una tarea administrativa; y las preguntas de completar exigen coincidencia exacta con tildes.

Se recorrió el árbol entero del Notion, incluidas sus cinco bases de datos: **no hay material de finales** más allá de las cinco fichas del reducido.

## Recursos externos encontrados

- **Programa oficial de la materia**, encontrado en el sitio institucional del ITBA y documentado en [[programa-oficial-61-31|programa-oficial-61-31]]. Es el hallazgo más importante después de los finales.
- **Segundo Drive del CEITBA** (`1JnsemBgkwMpzjMSu8n1EK_Rs3EnyAyHi`, enlazado desde el linktree del centro de estudiantes): **requiere cuenta del ITBA**, no se pudo abrir. Queda pendiente de que lo revise el usuario.
- **Altillo.com** tiene sección del ITBA pero solo con materias del curso de ingreso: **no hay Derecho**. Callejón cerrado, no vale la pena volver.
- **apuntes.ceitba.org.ar** está caído (su certificado no cubre el subdominio) y, según su versión archivada, su sección de finales de Derecho estaba vacía.
- **Studocu** tiene la materia con subidas de 2025, pero detrás de pago y de protección anti-bots.
- **Brainscape**, dos mazos de tarjetas de la materia hechos por alumnos: `https://www.brainscape.com/p/4OGEH-LH-CYLQN` (244 tarjetas sobre las unidades 1 a 7, más derecho procesal e informático) y `https://www.brainscape.com/p/4LK15-LH-D6GOA` (97 tarjetas sobre laboral, consumidor, contratos, delitos, sociedades y procesal). Son material de alumnos sin verificar: sirven para practicar, no como fuente de números.

## Advertencia sobre la calidad del material

Casi todo lo de este Drive lo escribieron alumnos, no la cátedra. Los desarrollos de los finales resueltos de 2015 y las respuestas del virtual de 2020 son útiles para saber **qué se esperaba que contestara** el alumno y con qué nivel de detalle, pero **no son clave de corrección oficial**. Vale la regla de la casa: ningún número, artículo ni plazo entra al material de estudio si no se puede rastrear a una página del wiki o a una fuente normativa. Los errores conocidos de estos compendios están anotados en [[confundibles]] y en las secciones de trampas de las fichas.

## Relación con otras páginas

- [[banco-preguntas]] · [[matriz-frecuencias]] · [[indice-final-completo|hub del final completo]] · [[esqueletos-todos]] · [[confundibles]] · [[indice|índice general del wiki]]
