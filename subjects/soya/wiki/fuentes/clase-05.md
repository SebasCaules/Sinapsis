---
titulo: Clase 5 — Riesgos (1): contaminación ambiental, riesgo eléctrico y protección contra incendios
tipo: fuente
modulo: [1]
clase: [5]
division: "1"
tags: [contaminantes-quimicos, cmp, riesgo-electrico, cinco-reglas-de-oro, lockout-tagout, puesta-a-tierra, incendio, tetraedro-del-fuego, banda-de-inflamabilidad, agentes-extintores, carga-de-fuego, simulacros, epp]
fuentes: [clase-05]
actualizado: 2026-09-15
estado: consolidado
raw_path: "raw/clases/clase-riesgos1/"
paginas: 42
slides: 42
autor: Ing. Hernán Darío Ordoñez
anio: 2020
rol: clase
aliases: [clase-riesgos-1, clase-4-2020, video-contaminacion, video-riesgo-electrico, video-incendios]
resumen: 'Acta de la clase de riesgos específicos del Ing. Ordoñez: un soporte de 42 slides (SOyA Clase 4 2do Cuat 2020.pdf) y tres clases grabadas que lo recorren de punta a punta —contaminación ambiental del puesto de trabajo (CMP, CMP-CPT, valor techo), riesgo eléctrico (tensiones, efectos de la corriente, las 5 reglas de oro, LOTO, puesta a tierra) y protección contra incendios (tetraedro, banda de inflamabilidad, clases de fuego, agentes extintores, art. 160 del Dec. 351/79, carga de fuego y simulacros)—. Es la primera fuente de cátedra del bloque de higiene industrial y riesgos específicos: hasta ahora el vault lo sostenía sólo con resúmenes de alumnos.'
---

## En una línea

Acta de la clase de **riesgos específicos** del Ing. Ordoñez: un soporte de 42 slides
(`SOyA Clase 4 2do Cuat 2020.pdf`) y **tres clases grabadas** que lo recorren de punta a punta
—contaminación ambiental del puesto de trabajo (CMP, CMP-CPT, valor techo), riesgo eléctrico
(tensiones, efectos de la corriente, las 5 reglas de oro, LOTO, puesta a tierra) y protección
contra incendios (tetraedro, banda de inflamabilidad, clases de fuego, agentes extintores, art. 160
del Dec. 351/79, carga de fuego y simulacros)—. **Es la primera fuente de cátedra del bloque de
higiene industrial y riesgos específicos**: hasta ahora el vault lo sostenía sólo con resúmenes de
alumnos.

> [!important] Qué cubre esta página y con qué nombre se cita cada cosa
> `raw_path` apunta a la **carpeta** `raw/clases/clase-riesgos1/`, no a un archivo: la clase son
> cuatro artefactos de un mismo acto (el soporte y sus tres grabaciones), y `tools/lint.py` admite
> declarar la carpeta para exactamente ese caso. Hoy la carpeta contiene sólo el PDF: **los tres
> `.mp4` no se conservan localmente** (decisión del usuario, 2026-09-15); lo que queda de ellos
> son las transcripciones en `.cache/txt/`, los enlaces de Drive de abajo y los recortes de
> `assets/`.
>
> | Artefacto | Cómo se cita | Convención |
> |---|---|---|
> | `SOyA Clase 4 2do Cuat 2020.pdf` (42 slides) | `(Clase 5, slide N)` | **1-up: `slide = página del PDF`.** El número impreso al pie coincide con la página. No hay que convertir nada |
> | `1 - Contaminación ambiental.mp4` (29:35) | `(Video Contaminación, mm:ss)` | tiempo absoluto del video |
> | `2 - Riesgo eléctrico.mp4` (33:03) | `(Video Riesgo eléctrico, mm:ss)` | ídem |
> | `3 - Protección contra incendios.mp4` (53:09) | `(Video Incendios, mm:ss)` | ídem |
>
> Los tres videos son **grabaciones de pantalla del mismo soporte con la voz del docente**, que va
> dibujando sobre los slides. No muestran nada que no esté en el PDF salvo esos dibujos; lo que
> agregan es **la explicación oral**, y es mucha: los slides son listas y el video es la clase.

> [!warning] Es material de **2020**, dictado a distancia, y en esa cursada era la **clase 4**
> - El archivo se llama "Clase 4 2do Cuat 2020" y sus metadatos dicen que el PDF se generó el
>   **31/8/2020**. El pie de los slides **no trae fecha** (a diferencia de [[clase-01]] y
>   [[clase-02]]).
> - Los videos son de la misma época: el docente habla del "coronavirus" al explicar las máscaras
>   (Video Contaminación, 26:03), de subir material "a la clase del Blackboard" (Video Riesgo
>   eléctrico, 03:40) y grabó las tres partes seguidas ("seguimos con la clase de riesgos", Video
>   Riesgo eléctrico, 00:00; "siguiendo con lo que es riesgos", Video Incendios, 00:00).
> - **En el cronograma 2026 se la numera como clase 5** por decisión del usuario (2026-09-15): es la
>   que sigue a las clases 3 y 4 ya ingestadas. El nombre de la carpeta, `clase-riesgos1`, sugiere
>   que es la **primera de una serie de clases de riesgos** — si llega una `clase-riesgos2`
>   (ruido, iluminación, radiaciones…), será la 6. Ver [[cronograma]].
> - Vale lo mismo que para la clase 2: es **fuente de cátedra**, del mismo docente que dicta la
>   cursada 2026, pero de otra cursada. Lo que dice sobre el temario es sólido; lo que dice sobre
>   *cómo* se cursa (Blackboard, clases grabadas) no aplica a 2026.

> [!note] El texto extraído del PDF pierde los **títulos** de todos los slides y 17 láminas enteras
> `pypdf` no levanta el título de ningún slide (están en un cuadro de texto que no extrae) y deja
> vacíos los slides que son sólo imagen: **7, 8, 9, 10, 13 (parcial), 14, 15, 16, 20, 22, 23, 26,
> 28, 29, 33–39 y 41**. Se rasterizó el PDF entero (`pdftoppm -r 80`) y se leyeron las 42 láminas;
> las tablas de los slides 14, 15, 16 y 29 se leyeron a 170 dpi. Diez láminas se recortaron a
> `assets/` (ver al final). El caché `.cache/txt/clases--clase-riesgos1--soya-clase-4-2do-cuat-2020.txt`
> sirve para buscar texto, **no** para saber de qué habla cada slide.

## Los tres bloques y qué les corresponde en el soporte

| Bloque | Slides | Video | Páginas de la wiki |
|---|---|---|---|
| Portada | 1 | — | — |
| **Contaminación ambiental** (del puesto de trabajo) | 2–9 | Video Contaminación (29:35) | [[05-01-contaminantes-quimicos-y-cmp]], [[02-07-epp]], [[res-srt-861-15]] |
| **Riesgo eléctrico** | 10–22 | Video Riesgo eléctrico (33:03) | [[05-02-riesgo-electrico]], [[03-06-lockout-tagout]], [[res-srt-900-15]], [[02-07-epp]] |
| **Protección contra incendios** | 23–41 | Video Incendios (53:09) | [[05-03-proteccion-contra-incendios]], [[dec-351-79]] |
| "Fin" | 42 | — | — |

El docente abre diciendo qué es esta clase: *"Hoy nos toca ver riesgos"* (Video Contaminación,
00:00). Y aclara desde el primer minuto que "contaminación ambiental" acá es la del **ambiente de
trabajo**, no la del medio ambiente: *"no vamos a hablar de la contaminación del medio ambiente…
sino de los contaminantes asociados a los sitios de trabajo que pueden afectar a los trabajadores.
Con Affranchino van a ver la otra parte"* (Video Contaminación, 00:43–00:59). Es la única mención
en todo el corpus de **quién dicta el módulo 2**: ver [[modulo-2-ambiente]] y [[materia]].

## Recorrido slide por slide

`slide = página del PDF`. La columna "Video" da el tramo de la grabación en que ese slide está en
pantalla (tomado de un muestreo a un cuadro por minuto, así que los bordes son ±1 min).

### Bloque 1 — Contaminación ambiental (slides 2–9, Video Contaminación)

| Slide | Qué hay en el slide | Video | Qué agrega la voz |
|---|---|---|---|
| 2 | "En todos los lugares de trabajo donde se efectúen procesos que den lugar a la contaminación del ambiente con: gases, vapores, humos, niebla, polvos, fibras, aerosoles, emanaciones de cualquier tipo" | 00:00–02:13 | Humos = partícula sólida suspendida producto de combustión; nieblas = gotitas; fibras = algodón en hilanderías, **asbesto** (01:22–02:07) |
| 3 | "Se deberá: **Monitorear · Prevenir · Proteger**" | 02:13–03:16 | Monitorear es **medir**; prevención por sobre protección; las dos barreras "**como capas de cebolla**, una adentro de la otra; la última barrera es la protección" (02:40–03:13) |
| 4 | Clasificación por su acción (irritantes, asfixiantes, depresores del SNC, tóxico de sistemas, cancerígenos, mutagénicos, teratogénicos) y vías de ingreso (inhalación, absorción, ingestión) | 03:16–13:01 | **Las dos clasificaciones vienen de la toxicología** (03:37). Asfixiantes **sin reacción** (CO₂, N₂: desplazan el aire; barrido de tanques con nitrógeno) y **con reacción** (CO: se pega a la hemoglobina con más afinidad que el O₂; inodoro; tratamiento con oxígeno puro) (05:05–09:45). Depresores del SNC: alcohol, **solventes orgánicos** (09:54–10:56). Tóxicos de sistemas → **órgano diana** (10:56–11:34). Teratogénicos: sobre el feto (12:00–12:17). El docente escribe "CON R / SIN R" al lado de "asfixiantes" |
| 5 | Las tres definiciones de límite de exposición: **a) CMP**, **b) CMP-CPT**, **c) valor techo (C)** — con las condiciones en rojo | 13:01–21:47 | "Definiciones que **la ley nos trae**" (13:01). CMP definido **para 8 horas** (13:52); "la mayoría" = centro de la **curva de Gauss** de sensibilidad (14:51–15:34). Dos ejemplos: **fábrica de zapatos con cemento de contacto** (tolueno/xileno) para la CMP (16:24–17:18) y **cabina de pintura de autos** para la CMP-CPT (17:21–19:44). El techo es por *ceiling*; "no todas las sustancias lo tienen definido" y "para higiene y seguridad no tiene un uso muy extendido" (20:32–21:39) |
| 6 | "Límites (Dec. 351/79) – **PARCIAL**": tabla de 13 sustancias con CMP y CMP-CPT en ppm y mg/m³ (acetaldehído… ácido nítrico) | 21:47–23:24 | **"PARCIAL" = extracto de la tabla, no el examen.** "**Cuanto más bajo es el CMP, más tóxica es la sustancia**": el acetato de vinilo (CMP 10 ppm) es mucho más peligroso que la acetona (1.000 ppm) (22:11–22:49). Dos unidades porque hay dos formas de medir (22:51–23:17) |
| 7 | Lámina: tres campanas de extracción — **cabina, receptora, de captura** | 23:24–25:44 | Prevención = mantener la concentración lo más baja posible: ventilación **generalizada** (renovaciones de aire por hora) o **localizada**. Cabina = la de laboratorio, con vidrio; receptora = abierta; de captura = lateral o inferior, aleja el contaminante de la nariz del trabajador; se usa en **soldadura** (23:36–25:44) |
| 8 | Lámina: semimáscara y máscara completa con cartuchos | 25:44–27:03 | Protección: la **semimáscara cubre nariz y boca**; la **máscara completa cubre también los ojos**, para sustancias que irritan o ingresan por mucosa ocular (26:08–27:03) |
| 9 | Lámina: siete cartuchos de una marca, por color (amoníaco/metilamina, vapores orgánicos, formaldehído, gases ácidos, multigas, orgánico/ácido, mercurio/cloro) | 27:03–29:35 | Los filtros se **intercambian** y cada uno sirve para una sustancia; **"no importa el color, porque varía entre fabricantes"**: lo que hay que saber es que hay que preguntarle al especialista si el filtro sirve para la tarea (27:20–28:35). Los **N95 son filtros de polvo** y se adicionan encima del cartucho (28:35–29:01). Cierre: hay un **protocolo de medición** de contaminación ambiental entre los requisitos legales, "cosa que no hemos visto" (29:08–29:31) |

### Bloque 2 — Riesgo eléctrico (slides 10–22, Video Riesgo eléctrico)

| Slide | Qué hay en el slide | Video | Qué agrega la voz |
|---|---|---|---|
| 10 | Foto de un **arc flash** sobre una persona | 00:00–00:57 | Se da sobre todo en **tableros**, al hacer maniobras (00:30–00:52) |
| 11 | Definiciones: **MBT** hasta 50 V · **BT** 50–1.000 V · **MT** 1.000–33.000 V · **AT** > 33.000 V · **tensión de seguridad hasta 24 V** respecto a tierra, secos y húmedos | 00:57–03:07 | "**Según el decreto 351**" (00:57): la tabla es del [[dec-351-79]]. Vivimos en BT (220/380 V); MT y AT son distribución. 24 V es seguro "por la cantidad de corriente que genera ese voltaje en el cuerpo"; señales y circuitos de control van en 5–12 V; en ambientes que piden protección extra se trabaja en 24 V hasta el pie del equipo (01:53–03:01) |
| 12 | Riesgos: efectos fisiológicos directos e indirectos · choque eléctrico (electrocución) · arc flash · incendio · explosiones | 03:07–04:25 | La electrocución es un caso de efecto directo (03:15) |
| 13 | "Arc flash" + URL de YouTube (`K3TymjMxzJQ`) | ~03:32 | Es el video de una empresa de **textiles a prueba de arc flash** probándolos con maniquíes; el docente lo sube al Blackboard (03:32–04:23). **No está en `raw/`** |
| 14 | Tabla "**Efectos fisiológicos DIRECTOS** de la electricidad — corriente alterna, baja frecuencia" con `I = V/R`: 1–3 mA percepción · 3–10 mA electrización · **10 mA tetanización** · 25 mA paro respiratorio · 25–30 mA asfixia · 60–75 mA fibrilación ventricular | 04:25–07:21 | Escala: una plancha consume 6–7 **amperes**, acá se habla de **miliamperes** (04:46–05:11). A 10 mA la mano **se cierra** sobre el conductor y no se puede soltar (05:11–06:22). Tórax → no se puede respirar; corazón → fibrilación; cerebro (25 mA) → paro cardiorrespiratorio (06:31–07:21) |
| 15 | Tabla "**Efectos fisiológicos INDIRECTOS**": trastornos cardiovasculares · quemaduras internas (energía disipada: coagulación, carbonización) · quemaduras externas (arco a **4.000 °C**) · otros trastornos (auditivo, ocular, nervioso, renal) | 07:21–10:28 | Quemaduras internas por **efecto Joule** (el cuerpo como resistencia); **desnaturalización de proteínas**; un electrocutado **sin quemaduras visibles** puede tener daño interno → **siempre al hospital** (08:08–10:21) |
| 16 | Gráfico tiempo de exposición (ms) vs. intensidad (mA), log-log: umbral de percepción (~0,5 mA), **umbral de no soltar**, umbral de fibrilación, probabilidad de fibrilación 5 % y 50 %, zonas ①–④ | 10:28–12:23 | **Corrimiento de los umbrales**: el de no soltar arranca en ~200 mA y **baja hasta ~10 mA en 2.000 ms** ("20 veces menos"); el de fibrilación baja "10 veces" en pocos ms. Por eso hay que **retirar a la persona lo antes posible** (10:28–12:23) |
| 17 | **Prevención**: distancias de seguridad (TCT) · trabajar siempre sin tensión · 5 reglas de oro (consignación) · LOTO. **Protección**: puesta a tierra · disyuntores diferenciales · uso de EPP | 12:23–18:43 | Trabajar sin tensión = "**eliminamos el peligro para no tener riesgos**" (13:23); sólo las **maniobras** exigen tensión. TCT: el aire es dieléctrico, **la ley trae tablas de distancias** por tensión (13:36–14:13). LOTO "puede ser considerado una de las 5 reglas" pero se lista aparte porque hay lugares que usan LOTO sin las 5 reglas (14:13–14:44). **La puesta a tierra es "fundamental y principal medida de protección"**: jabalina de cobre o aluminio hincada + circuito que une las masas (dibujo, 14:48–16:15). **Diferencial vs. térmica**: el diferencial sensa la diferencia de corriente entre ida y vuelta; la térmica salta por calentamiento de un bimetal → "**la térmica protege a los equipos y los diferenciales protegen a las personas**"; un tablero con sólo térmicas no protege personas; diferencial también en tableros zonales (16:20–18:27) |
| 18 | LOTO: LockOut TagOut = Bloqueo y Etiquetado; "procedimiento de seguridad para impedir que un equipo sea accionado mientras hay personas interviniendo en él" + fotos (seccionador con candado, cartel DANGER) | 18:43–21:29 | Corte visible en un **seccionador** + candado que impide volver a "ON"; el **color o número del candado identifica a la persona** (hay un listado); **una sola llave, del dueño**; "obviamente se puede cortar con un alicate, pero no es la idea" (18:43–21:20) |
| 19 | Definiciones — **Consignación** de una instalación, línea o aparato: a) separar mediante **corte visible** · b) **bloquear** en posición de apertura · c) verificar la **ausencia de tensión** · d) efectuar las **puestas a tierra y en cortocircuito** · e) colocar la **señalización** y **delimitar** | 21:29–25:29 | "Consignación" es la palabra del **decreto 351**, y aplica a **cualquier energía**, no sólo eléctrica (21:29–22:04). "Cinco pasos que debemos respetar **en este orden**" (22:11). Corte visible ≠ llave de luz: tiene que ser un seccionador (23:03–23:28). Paso d explicado con un **motor**: unir rotor y estator con un conductor (cortocircuito, mismo potencial) y conectarlo a tierra (potencial cero): "**son dos cosas: uno es el cortocircuito y otro la puesta a tierra**" (23:57–25:14). Anuncia **dos videos cortos** de las 5 reglas (uno en un tablero de BT, otro en una subestación de MT/AT) (22:22–22:55). **No están en `raw/`** |
| 20 | Panfleto "**Las 5 reglas de oro**": 1. Abrir (corte visible o efectivo) · 2. Bloquear (enclavamiento o bloqueo si es posible y señalización) · 3. Verificar (ausencia de tensión) · 4. Aterrar (puesta a tierra y en cortocircuito) · 5. Delimitar (señalización y delimitación) | 25:29–26:39 | Es el panfleto de las capacitaciones. En la lámina de "aterrar", los tres conductores del poste están **cortocircuitados por un conductor colgante** y aparte va la **puesta a tierra** (25:29–26:39) |
| 21 | "Medición de PAT y continuidad: hay un protocolo de medición de Puesta a Tierra y continuidad definido por la **Resolución n.º 900/15 SRT**" + infoleg.gov.ar | 26:39–28:24 | Hay que medir la puesta a tierra **y la continuidad** del circuito: suele estar **cortado** en la conexión a la jabalina o en otro punto, y el trabajador cree estar protegido porque ve el cable. El conductor de tierra es **verde con línea amarilla** (26:39–28:24). Ver [[res-srt-900-15]] |
| 22 | Lámina de EPP eléctrico: guantes, botines, traje con escafandra, herramientas aisladas, pértigas | 28:24–33:03 | **Guantes** de látex gruesos con **sello IRAM** que certifica el voltaje, y **un guante de cuero encima** porque el látex se pincha (28:30–29:18). **Botín dieléctrico** (29:25–29:44). **Escafandra con pollera** que cubre cuello y hombros contra el arc flash (29:44–30:17). Así se viste para hacer una **maniobra** o un TCT; después de las 5 reglas se lo saca (30:23–30:51). **Alfombra dieléctrica** (30:51–31:05). **Herramientas aisladas** certificadas por voltaje: no usar el destornillador de cortafierro, inspeccionarlas antes (31:05–31:58). **Pértigas** de fibra de vidrio para trabajos a distancia y maniobras (31:58–32:46) |

### Bloque 3 — Protección contra incendios (slides 23–41, Video Incendios)

| Slide | Qué hay en el slide | Video | Qué agrega la voz |
|---|---|---|---|
| 23 | Foto: bomberos frente a un incendio | — | — |
| 24 | **Tetraedro de fuego**: combustible · calor · agente oxidante · reacción en cadena | 00:00–02:54 | Si se **elimina una cara**, el fuego no continúa: "**es la base que nos permite definir los agentes extintores**" (00:56–01:22). Reacción en cadena = en el seno de la llama se forman **radicales libres**, muy reactivos y de corta vida, que retroalimentan la reacción (01:40–02:49) |
| 25 | **Clasificación de sustancias**: explosivos · inflamables de 1.ª (punto de inflamación ≤ 40 °C: alcohol, éter, nafta, acetona) · de 2.ª (41–120 °C: kerosene, aguarrás) · muy combustibles (madera, papel, HC pesados) · combustibles (cuero, lanas, algunos plásticos, algunas maderas, carbón de coke) · poco combustibles (celulosas artificiales) · incombustibles (metales) · refractarios (hasta 1.500 °C) | 02:54–07:03 | Es la clasificación "**del decreto 351/79**" (02:54). El **punto de inflamación** es un ensayo de laboratorio con protocolo (03:28). Coke = residuo de la destilación del petróleo, necesita aflujo de aire (las fraguas de herrería) (04:30–05:29); maderas duras (**quebracho**, lapacho) (05:34–06:06); refractarios = arcillas de hornos y **ladrillos de parrilla** (06:34–06:51) |
| 26 | Lámina "**Límites de inflamabilidad**" (Instituto Argentino de Seguridad): eje 100 % aire → 0 % aire; **LII**, **LSI**, mezcla pobre, riesgo de combustión, mezcla explosiva, mezcla muy rica | 07:03–12:39 | El ejemplo de la **cocina**: hornalla abierta mucho tiempo = mezcla **rica**, no prende; hornalla chiquita y fósforo lejos = mezcla **pobre**, no prende; en el medio, prende (07:07–10:02). "**Olvídense de la mezcla explosiva**, no es importante ahora" (11:53) |
| 27 | Definiciones de **LII** (porcentaje mínimo de vapor o gas V/V debajo del cual no enciende), **LSI** (porcentaje máximo por sobre el cual no enciende) y **banda** (la diferencia; depende de cada sustancia) | 12:39–14:30 | Para HyS **lo que más importa es el LII**: es el momento en que una mezcla diluida empieza a ser peligrosa (14:00–14:22) |
| 28 | Lámina "**Clases de fuego**": A (materiales que producen brasas) · B (líquidos inflamables) · C (equipos eléctricos) · D (metales combustibles: aluminio, magnesio) · K (grasas, aceites vegetales y animales) | 14:30–18:46 | Se clasifican por material **y por el agente extintor que van a necesitar** (14:41). D: cinta de **magnesio**, aluminio finamente dividido (15:43–16:25). **K de *kitchen***: freidoras, "fuego tipo McDonald's"; **nunca echar agua a una sartén con aceite ardiendo**: tapar con un repasador mojado o una tapa, o extintor triclase (16:28–18:33) |
| 29 | Lámina "Prot. c/ incendios": **tabla agente × clase** (agua / CO₂ / polvo químico / espuma AFFF / agentes limpios × A / B / C) y la tarjeta "**Conozca su extintor**" con los pasos de uso | 18:46–22:24 | La tarjeta es la que se ve al lado de los ascensores; vale, pero **ir a los entrenamientos con matafuegos** (18:46–20:25). **CO₂ en clase A: apaga la llama pero no la brasa**, y cuando se ventea el fuego vuelve (20:47–21:34). **Agua en clase C: conduce** (21:42–22:09). Hay tablas más largas; ésta es la básica (22:13) |
| 30 | **Agua**: gran capacidad calorífica · **CO₂**: asfixiante natural · **Polvos**: sales minerales finamente pulverizadas (bicarbonatos de sodio, carbonatos de sodio o potasio, fosfato monoamónico, cloruro de potasio, urea); extinguen por reacción con los radicales libres | 22:24–26:14 | Agua: capacidad calorífica **y calor latente de evaporación**, y está en todos lados (22:38–23:19). Polvos: **sustancias comunes** (bicarbonato del polvo de hornear, cloruro de potasio de la sal *light*, urea de fertilizante), a presión en el matafuego; **cortan la reacción en cadena** (23:22–26:12) |
| 31 | **Espumas**: espumígenas mezcladas con agua en una boquilla que incorpora aire; extinguen por separación combustible/comburente (asfixia) · **Agentes limpios**: halogenados (flúor, cloro, bromo); extinguen por interacción con los radicales libres — Halón, Halotrón, FM200 | 26:14–31:29 | Espuma = detergente **resistente al calor**; hay espumas específicas (alcoholes, ácidos) (26:18–27:10). Agentes limpios: los mismos halogenados de los refrigerantes que **atacan la capa de ozono**, en menor medida; **regulados o prohibidos** en varios países (27:36–29:07). Gran poder de extinción y, como el CO₂, **no dejan residuo** → **salas de servidores** (el polvo triclase arruinaría los servidores vecinos) (29:09–30:36). Sprinklers conectados a una batería de cilindros de CO₂ sobre un sector de solventes enrejado (30:38–31:13) |
| 32 | **Dec. 351/79 – Art. 160**: las construcciones, instalaciones y equipamientos deben tener en consideración: dificultar la iniciación de incendios · evitar la propagación del fuego y los efectos de los gases tóxicos · asegurar la evacuación de las personas · facilitar el acceso y las tareas de extinción de los bomberos · proveer las instalaciones de detección y extinción | 31:29–36:11 | "Permanentemente estamos refiriéndonos… al decreto 351 de 79" (31:33). El caso **Cromañón** como ejemplo de incumplimiento de las cinco: una bengala prende una bolsa colgada del techo, se propaga por cortinados sintéticos, el **PVC genera ácido clorhídrico**, la puerta de escape con **candados**, sin detección ni extinción; "el decreto era del año 79, veinte y pico de años antes" (32:24–35:21). Y **Bhopal**, de la primera clase: las reglas estaban pero no se cumplían (35:21–36:08). El docente fecha Cromañón "creo que 2006"; la fecha no está en ninguna otra fuente del vault |
| 33 | Lámina de elementos: nicho hidrante, matafuego, hidrante/monitor, detector de humo, manta cortafuegos 1,2 × 1,2 m, sprinkler, ampollas de colores con sus temperaturas (57 · 68 · 79 · 93 · 141 · 182 °C) | 36:11–41:00 | **Nicho hidrante** con manguera y lanza; **extintores** de polvo o gas, de 5, 10, 25 y 50 kg; **monitores**: lanza fija orientable en plazas de tanques de hidrocarburos, para atacar el frente o **enfriar el tanque vecino**; **detectores de humo** que disparan alarma o acción sobre la central (cortar energía, llamar bomberos); **manta cortafuego**: se tira de las dos tiras, envuelve a la persona con la ropa prendida y se tira al piso; **sprinkler**: una **ampolla calibrada por color** para estallar a una temperatura sostiene una placa que obtura el agua; al romperse, el agua choca contra el difusor y llueve (36:11–41:00) |
| 34 | Fotos: un matafuego de polvo (Georgia) y una persona descolgándolo de la pared con su chapa baliza | 41:00–44:34 | Componentes: **boquilla, gatillo, indicador de presión, contenedor** (41:05). **Control anual** obligatorio: el **marbete** (anillo naranja del cuello) sólo se puede poner sacando el cabezal → prueba de que se revisó el polvo y el contenedor; **cada año tiene un color** (41:19–42:38). Instalación: en **sectores abiertos**, **desobstruido** (la gente acumula cosas alrededor), **colgado en la pared**, con **chapa baliza** que indica presencia y tipo, a **≈ 1,70 m** para poder manipular 10 kg (42:45–44:27) |
| 35–36 | Fotos del docente: matafuegos **obstruidos** en una juguetería y en un supermercado (mercadería, oferta del día, reloj) | 44:34–45:38 | "Fotos sacadas por mí"; "un matafuego que está jugando a las escondidas" (44:34–45:36) |
| 37 | Foto: gabinete "Pañol Brigada de Emergencia" en un supermercado | 45:38–46:52 | **Estaciones de bomberos** internas (Jumbo): equipos autónomos de respiración, trajes, mangueras, camillas, primeros auxilios — para la **brigada de ataque temprano**, no para los bomberos (45:38–46:51) |
| 38 | Fotos: un matafuego de manguera verde (Diprogom) | 46:52–47:36 | Es el de la **sala de fotocopias del anexo** (ITBA): un matafuego de **agente limpio, a base de HCFC**; la manguera verde lo delata (46:52–47:24) |
| 39 | Foto: gabinete de brigada de emergencias con matafuego y señalización | ~47:24 | Otra estación de brigada, en un sanatorio (47:24) |
| 40 | **Carga de fuego**: estudio que calcula un equivalente en madera de los materiales que pueden quemarse; con eso se calcula la cantidad de matafuegos en función del poder extintor y los tamaños. **Emergencias y simulacros**: prever las situaciones, preparar procedimientos (evacuación, roles, interacción y aviso con la comunidad, autoridades y fuerzas vivas), hacer simulacros | 47:36–53:01 | Carga de fuego: **requisito legal** para toda fábrica u oficina; determina el **potencial extintor** y de ahí la cantidad de matafuegos; la pueden pedir **la ART, la Superintendencia, el ministerio** → multa o clausura; **cambia con el tiempo** (una oficina de seguros acumula papel) y hay que revisarla (47:45–50:03). Brigada con **roles** (cortar electricidad, cortar gas, llamar bomberos) (50:24–50:45). Los simulacros, **aunque avisados**, entrenan para no entrar en pánico (50:54–51:36). **Orden y limpieza**: los "juntaderos" de madera, plástico e hidrocarburos son "una bomba de tiempo" (51:37–53:01) |
| 41 | Foto: incendio de pallets con autobomba | 53:01–53:09 | "Eso es lo último de protección contra incendios y seguiremos con otro tema" |

## Lo que esta fuente cambia en el vault

1. **Tres páginas de concepto dejan de ser "adelanto de alumno".** [[05-01-contaminantes-quimicos-y-cmp]],
   [[05-02-riesgo-electrico]] y [[05-03-proteccion-contra-incendios]] estaban escritas desde
   [[resumen-ordonez]]; ahora se apoyan en el soporte del que ese resumen tomó sus capturas (el
   tetraedro, la banda de inflamabilidad y las 5 reglas de oro del resumen son, lámina por lámina,
   los slides 24, 26 y 20). Pasan a prefijo `05-` y a `clase: [5]`.
2. **Dos atribuciones normativas que estaban en [[huecos]] se cierran por la voz del docente**: la
   tabla de tensiones es "según el decreto 351" (Video Riesgo eléctrico, 00:57) y las definiciones
   de CMP son "las que la ley nos trae" y la tabla de límites es del Dec. 351/79 (slide 6; Video
   Contaminación, 13:01 y 21:50). Y aparece una norma nueva, la **[[res-srt-900-15|Res. SRT
   900/15]]** (slide 21).
3. **Confirma una inferencia y deja dos preguntas de final del lado de la cátedra.** El vault había
   inferido que la puesta a tierra aparece dos veces porque son dos cosas distintas (la de
   consignación y la de la instalación): el docente lo dice textual (Video Riesgo eléctrico,
   25:14 y 26:31). Y el slide 17 pone "Puesta a Tierra" bajo **Protección**, lo que choca con la
   respuesta del compilado de finales — ver C-28 en [[contradicciones]]; lo mismo con "tensión o
   intensidad" (C-29) y con la espuma para el aceite lubricante (C-30).
4. **El ejercicio del tolueno del final 1Q2020 tiene ahora su origen**: el docente usa exactamente
   ese ejemplo —zapatos, cemento de contacto, tolueno, medir la concentración contra la CMP— para
   explicar la definición (Video Contaminación, 16:24–17:18).

## Lo que la fuente nombra y el vault no tiene

- El **video de arc flash** (slide 13, YouTube `K3TymjMxzJQ`) y los **dos videos cortos de las 5
  reglas de oro** (Video Riesgo eléctrico, 22:22) — material de apoyo que el docente subía al
  campus. No están en `raw/`.
- Las **tablas de distancias de seguridad** para TCT que "la ley misma tiene" (Video Riesgo
  eléctrico, 13:56) — no se reproducen ni se inventan.
- La clase de **requisitos legales** que el docente da por pendiente (Video Contaminación, 29:08).
- El "video que vimos en la clase inicial sobre riesgos laborales" con la foto del matafuego
  colocado demasiado alto (Video Incendios, 44:15) — de la clase 1 de 2020, no de la de 2026.

Ver [[huecos]] (H-28).

## Sobre los videos: de dónde salen y qué queda de ellos

Los tres videos viven en **Google Drive**, con acceso sólo para la cuenta ITBA del usuario (un
pedido anónimo devuelve 401):

| Video | Enlace | Tamaño |
|---|---|---|
| 1 - Contaminación ambiental.mp4 | https://drive.google.com/file/d/1swxXXku0IO-ffQq3qe9PdIWgy8MEu3JN/view | 92 MB |
| 2 - Riesgo eléctrico.mp4 | https://drive.google.com/file/d/1hK0zIckKO6foW0spxmutHHV2tFuGjJYN/view | 120 MB |
| 3 - Protección contra incendios.mp4 | https://drive.google.com/file/d/1n3mvWNT0uupNvNoD57p6W8vb0kG1pAZ_/view | 197 MB |

Se descargaron el 2026-09-15 con las cookies de Chrome autorizadas por el usuario, se
transcribieron y se muestrearon, y **después se borraron por pedido del usuario**: no están en
`raw/` ni en `.cache/`. Si hace falta volver a verlos, se bajan de Drive otra vez; si el usuario
alguna vez los deja en `raw/clases/clase-riesgos1/`, esta página ya declara la carpeta entera como
`raw_path` y el `lint` los reconoce sin tocar nada.

Las **transcripciones** se generaron localmente con `tools/transcribir.py` (mlx-whisper, modelo
`whisper-large-v3-turbo`, idioma forzado a español, sin corrección manual) y viven en
`.cache/txt/`, una línea por segmento con su `[mm:ss]`, **con el nombre que les correspondería
si los videos estuvieran en `raw/`** — son lo único que queda de las grabaciones en el repo:

- `.cache/txt/clases--clase-riesgos1--1---contaminacion-ambiental.txt`
- `.cache/txt/clases--clase-riesgos1--2---riesgo-electrico.txt`
- `.cache/txt/clases--clase-riesgos1--3---proteccion-contra-incendios.txt`

`tools/buscar.py` las indexa como a cualquier fuente. Para transcribir una clase nueva:
`python3 tools/transcribir.py` (ver [[herramientas]]). **No borrar estos tres `.txt`**: el caché
es "regenerable" sólo si se vuelven a bajar los videos. Errores típicos del reconocimiento que
conviene conocer: "tetradrofuego" por *tetraedro de fuego*, "los CNA guarrasque arden" por
*kerosene, aguarrás, que arden* (Video Incendios, 03:59), "ICI" donde el docente probablemente dice
el nombre de una institución (Video Incendios, 30:43). Ver [[herramientas]].

## Assets recortados de esta fuente

| Archivo | Slide | Se usa en |
|---|---|---|
| `assets/clase-05-slide-07-campanas-de-extraccion.png` | 7 | [[05-01-contaminantes-quimicos-y-cmp]] |
| `assets/clase-05-slide-14-efectos-directos-electricidad.png` | 14 | [[05-02-riesgo-electrico]] |
| `assets/clase-05-slide-15-efectos-indirectos-electricidad.png` | 15 | [[05-02-riesgo-electrico]] |
| `assets/clase-05-slide-16-umbrales-corriente-tiempo.png` | 16 | [[05-02-riesgo-electrico]] |
| `assets/clase-05-slide-20-cinco-reglas-de-oro.png` | 20 | [[05-02-riesgo-electrico]] |
| `assets/clase-05-video-2-1820-dibujo-puesta-a-tierra.png` | Video Riesgo eléctrico, 18:20 (slide 17 con el dibujo del docente) | [[05-02-riesgo-electrico]] |
| `assets/clase-05-slide-24-tetraedro-del-fuego.png` | 24 | [[05-03-proteccion-contra-incendios]] |
| `assets/clase-05-slide-26-banda-de-inflamabilidad.png` | 26 | [[05-03-proteccion-contra-incendios]] |
| `assets/clase-05-slide-28-clases-de-fuego.png` | 28 | [[05-03-proteccion-contra-incendios]] |
| `assets/clase-05-slide-29-matriz-agentes-por-clase.png` | 29 | [[05-03-proteccion-contra-incendios]] |
| `assets/clase-05-slide-33-elementos-de-proteccion.png` | 33 | [[05-03-proteccion-contra-incendios]] |

## Relación con otros temas

- [[clase-02]] — la partición prevención/protección que esta clase aplica tres veces, y de la que
  el docente da la imagen de las "capas de cebolla".
- [[aspt-trabajo-relevamientos]] — LOTO y EPP ya aparecían ahí como fotos; acá tienen explicación.
- [[resumen-ordonez]] — el resumen de alumno que **resumía esta misma clase** (su "Clase 4 —
  lunes 28/3" es este contenido, y sus láminas son estos slides).
- [[finales-soa-compilado]] — cuatro preguntas de final salen de este material: 2Q2019 preg. 2, 6,
  9 y 21; 1Q2020 preg. 6 y 9.
- [[dec-351-79]] — la norma que esta clase cita en los tres bloques.
- [[hernan-ordonez]] — autor del soporte y voz de los tres videos.

## Fuentes

- `.cache/txt/clases--clase-riesgos1--soya-clase-4-2do-cuat-2020.txt` — texto extraído del PDF
  (incompleto: ver el aviso de arriba).
- Las 42 láminas rasterizadas y leídas el 2026-09-15.
- Las tres transcripciones de `.cache/txt/clases--clase-riesgos1--N---*.txt`, cotejadas contra un
  muestreo de un cuadro por minuto de cada video para fijar qué slide estaba en pantalla.
