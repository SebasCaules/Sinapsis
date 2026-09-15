---
titulo: Riesgo eléctrico
tipo: concepto
modulo: [1]
clase: [5]
division: "1"
tags: [riesgo-electrico, tension, intensidad, efectos-fisiologicos, prevencion, proteccion, cinco-reglas-de-oro, consignacion, lockout-tagout, puesta-a-tierra, disyuntor-diferencial, epp, arc-flash]
fuentes: [clase-05, resumen-ordonez, finales-soa-compilado]
actualizado: 2026-09-15
estado: consolidado
aliases: [riesgo-electrico, 5-reglas-de-oro, cinco-reglas-de-oro, tension-de-seguridad, arc-flash, mbt-bt-mt-at, puesta-a-tierra, disyuntor-diferencial, tetanizacion]
resumen: 'La energía eléctrica se ordena en cuatro categorías de tensión más la tensión de seguridad (MBT, BT, MT, AT; 24 V), daña por la corriente que circula por el cuerpo (10 mA ya tetaniza, 60–75 mA fibrilan), y se interviene con dos bloques que son exactamente prevención y protección: prevenir es que no haya tensión cuando uno se acerca (trabajar sin tensión, distancias, las 5 reglas de oro, LOTO); proteger es sobrevivir al contacto si igual ocurre (puesta a tierra, disyuntor diferencial, EPP). (Clase 5, slides 11, 14 y 17)'
---

> [!important] Desde el 2026-09-15 este tema tiene fuente de cátedra
> La página se escribió desde [[resumen-ordonez]] (alumno, cursada anterior). Con [[clase-05]]
> —los slides 10 a 22 del soporte "Clase 4 2020" del Ing. Ordoñez y el video *Riesgo eléctrico*
> (33:03)— todo lo de abajo tiene slide y minuto, y la lámina de las 5 reglas de oro que el
> resumen sólo tenía como captura es el **slide 20**. El resumen queda como corroboración. Las
> preguntas de final siguen siendo de [[finales-soa-compilado]] (alumno, sin validar) y **dos de
> ellas chocan con lo que dice el soporte**: ver C-28 y C-29 en [[contradicciones]].

## En una línea

La energía eléctrica se ordena en **cuatro categorías de tensión más la tensión de seguridad**
(MBT, BT, MT, AT; 24 V), daña por la **corriente** que circula por el cuerpo (10 mA ya tetaniza,
60–75 mA fibrilan), y se interviene con dos bloques que son exactamente
[[02-04-prevencion-y-proteccion|prevención y protección]]: **prevenir** es que no haya tensión
cuando uno se acerca (trabajar sin tensión, distancias, las 5 reglas de oro, LOTO); **proteger**
es sobrevivir al contacto si igual ocurre (puesta a tierra, disyuntor diferencial, EPP).
(Clase 5, slides 11, 14 y 17)

## Desarrollo

### Las categorías de tensión — y de qué norma salen

Es lo más "de tabla" del tema y por eso lo más preguntable. Textual (Clase 5, slide 11):

| | Categoría | Sigla | Rango | Cómo se mide |
|---|---|---|---|---|
| a) | Muy baja tensión | **MBT** | hasta **50 V** | en C.C., o iguales valores eficaces **entre fases** en C.A. |
| b) | Baja tensión | **BT** | entre **50 V y 1.000 V** | en C.C., o iguales valores eficaces **entre fases** en C.A. |
| c) | Media tensión | **MT** | entre **1.000 V y 33.000 V** inclusive | — |
| d) | Alta tensión | **AT** | **sobre 33.000 V** | — |
| — | **Tensión de seguridad** | — | hasta **24 V** | **respecto a tierra**, "tanto en ambientes secos y húmedos" |

> [!important] La tabla es del **Dec. 351/79** — cerrado el hueco de atribución
> El slide no dice de dónde sale; el docente sí: *"vamos a definir **según la ley, según el
> decreto 351**, los distintos tipos de tensión"* (Video Riesgo eléctrico, 00:57). Ver
> [[dec-351-79]]. El vault había dejado esta atribución como hueco abierto (H-22); se cierra por
> fuente de cátedra, sin citar artículo porque la cátedra no lo cita.

Lo que la voz agrega (Video Riesgo eléctrico, 01:21–03:01):

- **Vivimos en BT**: 220 y 380 V son las tensiones de trabajo de la industria y de los hogares.
  MT y AT son "para la parte de distribución".
- **Por qué 24 V es "de seguridad"**: *"por la cantidad de corriente que genera ese voltaje en el
  cuerpo… el paso máximo de corriente que puede implicar una tensión de 24 volt es muy bajo y
  nunca va a afectar al ser humano"*. Es decir: la tensión de seguridad se define **por la
  corriente que produce**, no por sí misma — el criterio de toda la sección siguiente.
- Señales de datos y circuitos de control van en **5 a 12 V**; en ambientes que piden protección
  extra se trabaja en 24 V "hasta el pie del equipo" y recién ahí se alimenta el equipo con 220.

Tres detalles para no equivocarse al escribir la tabla:

1. **La tensión de seguridad no es un quinto escalón.** Las cuatro categorías se miden *entre
   fases*; la de seguridad, *respecto a tierra*. Responden preguntas distintas.
2. **"Secos y húmedos"**: un único valor de 24 V para los dos casos. Está así en el slide; no se
   completa lo que la fuente no distingue.
3. **Los 50 V aparecen en dos renglones** (MBT "hasta 50", BT "entre 50 y 1.000"). Ambigüedad de la
   fuente, no de la wiki.

### Los cinco riesgos

Qué es lo que efectivamente puede pasar (Clase 5, slide 12; Video Riesgo eléctrico, 03:07–03:28):

| Riesgo | Qué es |
|---|---|
| **Efectos fisiológicos directos e indirectos** | El daño de la corriente sobre el cuerpo (directos) y el daño derivado —quemaduras por arco, trastornos cardiovasculares— (indirectos). Desarrollados abajo |
| **Choque eléctrico (electrocución)** | "Un tipo específico del efecto fisiológico directo" (03:15) |
| **Arc flash** | La foto del slide 10: una explosión luminosa sobre una persona. *"Se da sobre todo en **tableros**, cuando se hacen determinadas maniobras"* (00:30–00:52). Quemaduras **sin que haya contacto** |
| **Incendio** | La instalación como fuente de ignición → [[05-03-proteccion-contra-incendios]] |
| **Explosiones** | Ídem, con atmósfera inflamable presente |

El slide 13 remite a un **video de YouTube** de arc flash: una empresa de textiles a prueba de arco
probándolos con maniquíes (Video Riesgo eléctrico, 03:32–04:23). No está en `raw/` — ver
[[huecos]] (H-28).

### Efectos fisiológicos directos: la tabla en miliamperes

![Slide 14: efectos fisiológicos directos de la electricidad](../../assets/clase-05-slide-14-efectos-directos-electricidad.png)

"Efectos fisiológicos **directos** de la electricidad — corriente alterna, baja frecuencia", con
`I = V/R` en el ángulo (Clase 5, slide 14):

| I | Efecto | Motivo |
|---|---|---|
| **1 a 3 mA** | **Percepción** | "El paso de la corriente produce cosquilleo. No existe peligro" (el ícono es una pila de 1,5 V) |
| **3 a 10 mA** | **Electrización** | "Produce movimientos reflejos" |
| **10 mA** | **Tetanización** | "Provoca contracciones musculares, agarrotamientos, etc." |
| **25 mA** | **Paro respiratorio** | "Si la corriente atraviesa el cerebro" |
| **25 a 30 mA** | **Asfixia** | "Si la corriente atraviesa el tórax" |
| **60 a 75 mA** | **Fibrilación ventricular** | "Si la corriente atraviesa el corazón" |

La explicación (Video Riesgo eléctrico, 04:25–07:21):

- **Escala**: "una plancha consume alrededor de 6, 7 **amperes**… acá estamos hablando de
  **miliamperes**". Mil veces menos.
- **Tetanización**: a 10 mA por el brazo *"la mano se cierra, se cierra bastante fuerte, tan
  fuerte que es prácticamente imposible separar a la persona que está sosteniendo un conductor
  electrificado… se queda pegado, como solemos decir"*.
- El mismo efecto en el **tórax** tetaniza los músculos de la respiración → **asfixia**; en el
  **corazón** interfiere con su marcapasos natural → **fibrilación**; en el **cerebro** (25 mA) →
  **paro cardiorrespiratorio**.

> [!important] Lo que daña es la **corriente**, y la tensión importa porque la determina
> Toda la tabla está en **mA**, el recuadro dice `I = V/R`, y el docente define la tensión de
> seguridad por "la cantidad de corriente que genera ese voltaje en el cuerpo" (Video Riesgo
> eléctrico, 02:00). Es el criterio que resuelve la pregunta 9 del final 2Q2019 (abajo), y choca
> con lo que marcó el compilado: ver C-29 en [[contradicciones]].

### Efectos indirectos: el arco y el efecto Joule

![Slide 15: efectos fisiológicos indirectos](../../assets/clase-05-slide-15-efectos-indirectos-electricidad.png)

"Efectos fisiológicos **indirectos**" (Clase 5, slide 15):

| Efecto | Motivo |
|---|---|
| **Trastornos cardiovasculares** | "El choque eléctrico afecta al ritmo cardíaco: infarto, taquicardias, etc." |
| **Quemaduras internas** | "La energía disipada produce quemaduras internas: coagulación, carbonización" |
| **Quemaduras externas** | "Producidas por el arco eléctrico a **4.000 °C**" |
| **Otros trastornos** | "Consecuencias del paso de la corriente: **auditivo, ocular, nervioso, renal**" |

El docente se detiene en dos, "el que más me importa" (Video Riesgo eléctrico, 07:29–10:21):

- **Quemaduras externas por arco de más de 4.000 °C**: las áreas de quemadura de quien estuvo
  expuesto a un arc flash.
- **Quemaduras internas por efecto Joule**: *"el efecto Joule es la conversión de energía
  eléctrica en energía calorífica por disipación en una resistencia. En este caso nuestro cuerpo
  sería la resistencia."* Y la consecuencia biológica: somos proteínas, y una proteína que se
  **desnaturaliza** por calor "pierde las cuestiones para las cuales ha sido diseñada".

> [!warning] Un electrocutado sin quemaduras visibles **va igual al hospital**
> *"Si nosotros vemos una persona que se ha electrocutado, probablemente no tenga quemaduras
> externas, pero sí pueda tener algún tipo de lesión interna… hay que llevarlo **urgentemente** a
> un hospital para que lo tengan en observación… **Eso no se ve**"* (Video Riesgo eléctrico,
> 08:42–10:21). Es la regla práctica de toda la sección.

### El corrimiento de los umbrales: por qué hay que sacar a la persona ya

![Slide 16: umbrales de percepción, no soltar y fibrilación vs. tiempo de exposición](../../assets/clase-05-slide-16-umbrales-corriente-tiempo.png)

El slide 16 es un gráfico **tiempo de exposición (ms) vs. intensidad de corriente (mA)**, los dos
en escala logarítmica, con cuatro curvas: **umbral de percepción** (vertical, ≈ 0,5 mA), **umbral
de no soltar**, **umbral de fibrilación**, y las curvas de **probabilidad de fibrilación 5 % y
50 %**, que delimitan cuatro zonas ① a ④ (Clase 5, slide 16).

La lectura del docente (Video Riesgo eléctrico, 10:28–12:23): *"otro tema que agrava el riesgo
eléctrico es el **corrimiento de los umbrales**"*. El umbral de no soltar (la tetanización)
*"arranca en 200 miliamperes… pero rápidamente ese umbral baja tremendamente hasta los 10 en un
lapso de 2.000 milisegundos, o sea 2 segundos… **20 veces menos**"*. Lo mismo con los de
fibrilación: "**10 veces menos** en muy pocos milisegundos". Conclusión: *"cuando hay una persona
que está sufriendo una descarga, es muy importante **lo antes posible** poder retirarla de esa
exposición"*.

> **Inferencia:** el gráfico no trae fuente ni título de origen en el slide, y la lectura de
> "200 → 10 mA en 2 s" es la del docente sobre la curva, no un dato tabulado. Se transcribe como
> lo dijo.

### Prevención y protección: el mismo par de la Clase 2, aplicado

El slide 17 parte el tema en dos listas tituladas, literalmente, **"Prevención"** y **"Protección"**
(Clase 5, slide 17) — el eje de [[02-04-prevencion-y-proteccion]]: **prevención sobre la `P`**,
**protección sobre la `G`** de [[01-05-riesgo|`R = P × G`]].

| PREVENCIÓN — actúa sobre la probabilidad | PROTECCIÓN — actúa sobre la gravedad |
|---|---|
| Distancias de seguridad (**TCT**) | **Puesta a tierra** |
| Tratar siempre de trabajar **sin tensión** | **Disyuntores diferenciales** |
| **5 reglas de oro** (consignación) | Uso de **EPP** |
| **Bloqueo y etiquetado (LOTO)** → [[03-06-lockout-tagout]] | |

Lo que el docente dice de cada renglón (Video Riesgo eléctrico, 12:23–18:43):

- **Trabajar sin tensión** — "yo pondría como primera cuestión". La gran mayoría de los trabajos
  eléctricos se puede hacer sin tensión; la excepción son las **maniobras** (conectar o
  desconectar equipos, circuitos o líneas en tensión). En casa también: "no voy a cortar la luz,
  lo voy a hacer con tensión" es arriesgarse sin sentido. Y la frase que lo ubica en la
  [[02-06-jerarquia-de-controles]]: *"así evitamos, **eliminamos el peligro para no tener
  riesgos**"* (13:23) — es el primer escalón, eliminar.
- **Distancias de seguridad (TCT = trabajos con tensión)** — cuando hay que trabajar con tensión,
  se aprovecha que **el aire es dieléctrico**: *"la ley misma tiene tablas para que, en función de
  la tensión sobre la que vamos a trabajar, estén definidas las distancias mínimas"* (13:36–14:13).
  Las tablas no están en el soporte y no se reconstruyen.
- **5 reglas de oro y LOTO** — *"el bloqueo y etiquetado puede ser considerado una de las 5
  reglas… yo lo pongo aparte porque en muchos lugares no se utilizan las 5 reglas pero sí se pueden
  implementar procedimientos de bloqueo y etiquetado"* (14:13–14:44).
- **Puesta a tierra** — *"**fundamental y principal medida de protección** para el riesgo
  eléctrico es la puesta a tierra de los equipos"* (14:48). El dibujo del docente sobre el slide:
  una **jabalina** (varilla de cobre o aluminio hincada en el terreno) que disipa las corrientes que
  le lleguen, y un **circuito de puesta a tierra** —un cable— que conecta las masas de las máquinas
  con la jabalina; lo que viaja por ahí es la corriente de un cortocircuito o una descarga
  accidental (15:03–16:15). "Es lo que mejor sirve a nivel de protección."

![El dibujo del docente sobre el slide 17: la jabalina y el terreno](../../assets/clase-05-video-2-1820-dibujo-puesta-a-tierra.png)

- **Disyuntores diferenciales** — y la distinción que se pregunta:

> [!important] La térmica protege a los equipos; el diferencial protege a las personas
> *"El disyuntor diferencial hace permanentemente un sensado de la corriente que pasa por uno de
> los conductores y vuelve por el otro… y cuando detecta un **diferencial de corriente** entre la
> entrada y la salida, ahí es donde actúa. La **llave térmica**, por el contrario, trabaja **por
> calentamiento**: tiene una plaquita de un bimaterial que por calentamiento salta. No tiene la
> sensibilidad de un disyuntor diferencial. Por eso decimos que **la térmica protege a los equipos
> y los disyuntores diferenciales protegen a las personas**. El hecho de que en un tablero haya
> térmicas no es suficiente para decir que ese tablero tiene protección para las personas"*
> (Video Riesgo eléctrico, 16:20–17:51). Y tiene que haber diferencial en el tablero principal y
> también en los **tableros zonales**, "como segunda protección" (17:55–18:27).

- **EPP** — desarrollado en la última lámina (abajo).

Leído despacio, el cuadro dice algo más que "hay dos listas": las cuatro medidas de la izquierda
buscan que **la corriente no esté ahí** cuando la persona se acerque (`P → 0`), y tres de las
cuatro son barreras **no-físicas**; las tres de la derecha **presuponen que la falla ya ocurrió**
—la carcasa ya está bajo tensión, ya hay fuga, ya hay contacto— y cambian cómo termina (`G →
menor`). Es el criterio temporal de [[02-05-secuencia-del-accidente]].

### Lock-out / tag-out, explicado

El slide 18 define LOTO —*"procedimiento de seguridad para impedir que un equipo sea accionado
mientras hay personas interviniendo en él"*— y lo ilustra con un seccionador con candado y el cartel
"DANGER — Lock out & tag out" (Clase 5, slide 18). La voz agrega la mecánica que
[[03-06-lockout-tagout]] tenía marcada como inferencia (Video Riesgo eléctrico, 18:43–21:20):

- Se hace el **corte visible** en un **seccionador** y se coloca un **candado de bloqueo** que
  impide llevar la palanca otra vez a "ON".
- El **color del candado** (o un número) **identifica a la persona**: a cada responsable de
  mantenimiento se le da un candado con un color, y "hay un listado donde está a quién se le
  asigna cada color".
- **Una sola llave**, la del dueño: *"nadie tiene la posibilidad de retirar ese candado si no es el
  dueño del candado. Obviamente que esto se puede cortar con un alicate, pero no es la idea"*.
- La **tarjeta** y el cartel son el etiquetado: avisan que se están haciendo trabajos.

### Las 5 reglas de oro = la consignación del Dec. 351/79

El slide 19 las da como **definición** —"Consignación de una instalación, línea o aparato"— en cinco
incisos (Clase 5, slide 19), y el slide 20 es el **panfleto** de las capacitaciones (Clase 5,
slide 20):

![Slide 20: las 5 reglas de oro](../../assets/clase-05-slide-20-cinco-reglas-de-oro.png)

| # | Regla (slide 20) | Definición (slide 19) | Lo que agrega el docente (Video Riesgo eléctrico, 21:29–26:39) |
|---|---|---|---|
| **1** | **Abrir** — "corte visible o efectivo" | a) Separar mediante **corte visible** la instalación, línea o aparato de toda fuente de tensión | *"Corte visible significa que el corte se tiene que ver. Una llave de luz como la de nuestra casa **no** indica un corte visible… Tendría que ser un **seccionador**"* — "la palanca de las películas de Frankenstein" (22:56–23:28) |
| **2** | **Bloquear** — "enclavamiento o bloqueo si es posible y señalización" | b) **Bloquear** en posición de apertura los aparatos de corte o seccionamiento necesarios | *"Acá es donde entra el bloqueo y etiquetado, el procedimiento de LOTO"* (23:28–23:48). **La regla 2 es LOTO** |
| **3** | **Verificar** — "verificación de ausencia de tensión" | c) Verificar la **ausencia de tensión** con los elementos adecuados | "Primero verifico tensión y después intervengo en la instalación" (23:48–23:57) |
| **4** | **Aterrar** — "puesta a tierra y en cortocircuito" | d) Efectuar las **puestas a tierra y en cortocircuito** necesarias, en todos los puntos por donde pudiera llegar tensión a la instalación como consecuencia de una maniobra o falla del sistema | El ejemplo del **motor**: rotor y estator no se tocan en funcionamiento normal; para intervenir se los une con un conductor (**cortocircuito**: mismo potencial) y ese conductor se conecta a una jabalina (**puesta a tierra**: potencial cero, el mismo que pisa el trabajador). *"**Son dos cosas: uno es el cortocircuito y otro la puesta a tierra**"* (23:57–25:14). En el panfleto se ve: los tres conductores del poste unidos por un conductor colgante, y aparte la bajada a tierra (25:57–26:39) |
| **5** | **Delimitar** — "señalización y delimitación" | e) Colocar la **señalización** necesaria y **delimitar** la zona de trabajo | "Una vez que hice todo esto, señalizar la zona de trabajo" (25:19) |

Mnemotecnia por iniciales: **A-B-V-A-D** — *Abrir, Bloquear, Verificar, Aterrar, Delimitar*.

> [!important] Tres cosas que el docente fija sobre las reglas
> 1. **Son "consignación" porque así lo llama el decreto 351**, y la consignación *"se realiza no
>    solamente cuando hay energía eléctrica, sino cuando hay **cualquier tipo de energía**
>    involucrada en una actividad de mantenimiento"* (21:42–22:04). Es el mismo universo de
>    energías del slide 31 del Trabajo ASPT (ver [[03-06-lockout-tagout]]).
> 2. **"Son cinco pasos que debemos respetar en este orden"** (22:11). Verificar antes de bloquear
>    no sirve; aterrar antes de verificar es cerrar un cortocircuito sobre una línea viva.
> 3. El docente anuncia **dos videos cortos** de las 5 reglas aplicadas —uno en un tablero de BT,
>    otro en una subestación de MT/AT— (22:22–22:55). No están en `raw/`.

### La puesta a tierra aparece de los dos lados — y el docente lo confirma

En el soporte, la puesta a tierra figura **dos veces**: como regla 4 de la consignación (bloque
**Prevención**) y como primer ítem del bloque **Protección** (Clase 5, slides 17 y 19). El vault
había inferido que son dos usos distintos del mismo elemento; el docente lo dice explícitamente:

- La de **consignación** es "**a tierra y en cortocircuito**", provisoria, para trabajar: "son dos
  cosas distintas, una es el cortocircuito y otra es la puesta a tierra" (Video Riesgo eléctrico,
  25:14 y 26:31).
- La de la **instalación** —la jabalina y el circuito que une las masas— es "la fundamental y
  principal medida de **protección**" (14:48–16:20).

Dejó de ser inferencia. Y tiene consecuencia sobre una pregunta de final (abajo).

### Medir la puesta a tierra **y la continuidad**: Res. SRT 900/15

> "Hay un protocolo de medición de Puesta a Tierra y continuidad definido por la **Resolución
> n.º 900/15 SRT**." (Clase 5, slide 21)

Por qué "y continuidad" (Video Riesgo eléctrico, 26:39–28:24): el circuito que une las máquinas con
la jabalina *"usualmente puede encontrarse cortado en el punto donde se conecta con la jabalina… a
veces está cortado en alguna otra parte, sin querer, en algún trabajo"*. Y entonces *"el trabajador
cree que está seguro porque ve el cable de puesta a tierra"*. El conductor de tierra es **verde con
una línea amarilla** —"el único tipo de conductor que se puede utilizar, salvo conductor desnudo"—.
Ver [[res-srt-900-15]].

### El EPP eléctrico, pieza por pieza

El slide 22 es una lámina de fotos (Clase 5, slide 22); la voz la recorre (Video Riesgo eléctrico,
28:24–32:54):

| EPP | Qué dice el docente |
|---|---|
| **Guantes dieléctricos** | De látex, "medio gorditos", con **certificación**: "una serie de sellos, particularmente el **sello IRAM**, que certifica el voltaje para el cual es apto ese guante". Y **un guante de cuero encima**, porque el látex "se puede pinchar, se puede cortar muy fácilmente" y el de cuero le da resistencia mecánica |
| **Botín dieléctrico** | "No es el botín común de la construcción: está testeado para resistir determinados voltajes" |
| **Escafandra con pollera** | Cubre la cara **y el cuello y los hombros**: sin la pollera, un arc flash "quemaría todo su cuello, lo cual comprometería muy seriamente su vida" |
| **Alfombra dieléctrica** | Aísla al trabajador del piso |
| **Herramientas aisladas** | Vástago aislado y símbolo eléctrico; certificadas por voltaje. "No se pueden usar de cortafierro"; hay que **inspeccionarlas antes** de usarlas (aislaciones rotas, cuarteadas, perforadas) |
| **Pértigas** | Varas de fibra de vidrio con herramientas en la punta (pinzas, tenazas, medidores) para **trabajar a distancia**: maniobras de conexión y desconexión, TCT |

> [!note] Así no se trabaja: así se hace la maniobra
> *"Como está vestido este hombre no es que el trabajo con electricidad se hace así. Este señor está
> haciendo un trabajo TCT, con tensión, o está pronto a realizar una **maniobra** de desconexión,
> para lo cual se pone todos estos elementos y una vez que realiza la maniobra se los saca para
> poder trabajar, una vez que hizo las cinco reglas de oro"* (Video Riesgo eléctrico, 30:23–30:51).
> El EPP pesado es para el momento de riesgo; después de la consignación, el peligro ya no está.

## En los finales: dos preguntas, y ahora la cátedra opina

> [!warning] Las respuestas del compilado no están validadas por ningún docente
> [[finales-soa-compilado]] marca sus respuestas en **negrita** y admite trabajar contra un
> "archivo de respuestas" de origen desconocido. Lo nuevo es que ahora hay **soporte de cátedra**
> contra el cual contrastarlas.

### 2Q2019, pregunta 21 — ¿cuál de estas barreras es protectiva?

> "¿Cuál de las siguientes barreras es protectiva?
> a. Puesta a tierra. b. Distancia de seguridad en trabajos con tensión. c. Las 5 reglas de oro.
> **d. Ninguna de las anteriores.**"
> (Finales SOA, p. 11 — la negrita es del compilado)

Las tres opciones son tres ítems del **slide 17**: dos del lado de Prevención (b, c) y **una del lado
de Protección (a)**. El compilado marca **d**. Con el soporte a la vista y el docente diciendo que
la puesta a tierra es "la fundamental y principal medida de **protección**", la respuesta que sale
del material de cátedra es **a**. La única lectura que salva la **d** es que "puesta a tierra" se
refiera a la de consignación (la regla 4), que es preventiva. **Registrado como C-28 en
[[contradicciones]]**; lo que hay que llevarse es el criterio: *la clasificación no depende del
objeto sino de sobre qué variable de `R = P × G` actúa en ese uso concreto*.

> Detalle de numeración: la pregunta 21 cae dentro del bloque numerado como Sección Ambiental del
> final 2Q2019 (que va de la 11 a la 21 sin reiniciar), pero el tema es de Ocupacional.

### 2Q2019, pregunta 9 — ¿tensión o intensidad?

> "A la hora de estudiar los efectos de la electricidad en el cuerpo humano:
> **a. ¿Nos importa estudiar la tensión?** b. ¿Nos importa estudiar la intensidad?
> c. ¿Importan las 5 reglas de oro? d. ¿Importa si la corriente es continua o alterna?"
> (Finales SOA, p. 6 — la negrita es del compilado)

El compilado destaca **a**. El material de cátedra tabula los efectos **por intensidad, en mA**
(slides 14 y 16), escribe `I = V/R` en el recuadro de la tabla, y el docente define la tensión de
seguridad por la corriente que genera. Con ese criterio, la opción natural es **b**. La pregunta
sigue mal formulada (las cuatro opciones son preguntas y varias admiten "sí"), así que **no se
declara una respuesta**; se registra como **C-29** en [[contradicciones]] y como pregunta para la
cátedra.

## En la materia

- **Dictado**: [[clase-05]], bloque 2 (slides 10–22 y el video *Riesgo eléctrico*, 33:03). Es el
  tema **6 del temario del módulo 1** ("Tipos de peligros y riesgos") y su bloque de medidas cae
  en el **9** ("Prevención de riesgos"); unidad 4 del [[programa-oficial-12-83|programa oficial]].
- **Es evaluable:** dos preguntas de final (2Q2019, 9 y 21), las dos sobre el cuadro
  prevención/protección o sobre el criterio corriente/tensión.
- Lo mínimo a saber de memoria: **la tabla de tensiones con sus valores**, **los tres números de
  la tabla de efectos que el docente subraya (10 mA tetanización, 25 mA cerebro, 60–75 mA
  fibrilación)**, **las 5 reglas de oro en orden y que son la consignación del Dec. 351/79**,
  **de qué lado del cuadro cae cada medida**, y **térmica = equipos, diferencial = personas**.

## Relación con otros temas

- [[02-04-prevencion-y-proteccion]] — el par que este tema instancia; el cuadro del slide 17 es
  esa partición aplicada a la electricidad.
- [[01-05-riesgo]] — `R = P × G`: prevención sobre la `P`, protección sobre la `G`.
- [[02-03-barrera]] — tres de las cuatro medidas preventivas son barreras **no-físicas**.
- [[02-06-jerarquia-de-controles]] — "trabajar sin tensión" es **eliminar** el peligro, con las
  palabras del docente; el EPP, el último escalón.
- [[03-06-lockout-tagout]] — la regla 2 de las 5 reglas de oro **es** LOTO; y acá está la
  mecánica del candado con color y llave única que esa página tenía como inferencia.
- [[03-07-permiso-de-trabajo]] — los trabajos con tensión (TCT) y las maniobras son el caso
  típico de trabajo que exige permiso.
- [[02-07-epp]] — guantes con sello IRAM, botín dieléctrico, escafandra con pollera, alfombra,
  herramientas aisladas, pértigas.
- [[05-03-proteccion-contra-incendios]] — dos de los cinco riesgos eléctricos son incendio y
  explosión; y la clase C de fuego es la eléctrica.
- [[05-01-contaminantes-quimicos-y-cmp]] — el bloque anterior de la misma clase.
- [[03-03-colores-y-senales-de-seguridad]] — reglas 2 y 5: señalizar y delimitar; el conductor
  de tierra verde-amarillo.
- [[dec-351-79]] — la norma de la que salen la tabla de tensiones, las tablas de distancias de
  TCT y el término "consignación".
- [[res-srt-900-15]] — el protocolo de medición de puesta a tierra y continuidad.
- [[iram]] — el sello que certifica los guantes dieléctricos.
- [[01-04-peligro]] — la energía eléctrica presente es el peligro; el riesgo aparece con la
  exposición.

## Fuentes

- (Clase 5, slides 10–22) — [[clase-05]]: tensiones, riesgos, las tres láminas de efectos, el
  cuadro prevención/protección, LOTO, la consignación, el panfleto de las 5 reglas, la
  Res. 900/15 y la lámina de EPP.
- (Video Riesgo eléctrico, 00:00–33:03) — [[clase-05]]: la explicación oral citada por minuto.
- (Resumen Ordoñez, p. 6, y su lámina "5 reglas de oro") — [[resumen-ordonez]]: copia del
  slide 11, del 17 y del 20. **Fuente de alumno**, corroboración.
- (Finales SOA, pp. 6 y 11) — [[finales-soa-compilado]]: final 2Q2019, preguntas 9 y 21.
  **Fuente de alumno**, sin validar.
