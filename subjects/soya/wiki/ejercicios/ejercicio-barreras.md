---
titulo: Ejercicio de Barreras — resolución
tipo: ejercicio
modulo: [1]
clase: [2]
division: "1"
tags: [barreras, prevencion, proteccion, jerarquia-de-controles, caso-real, mnt]
fuentes: [ejercicio-barreras-consigna, clase-02, programa-oficial-12-83]
actualizado: 2026-08-25
estado: consolidado
aliases: [resolucion-ejercicio-barreras]
resumen: 'Resolución completa de las tres partes del Ejercicio de Barreras sobre la explosión de First Chemical Corp. (2002): nueve barreras existentes al momento del accidente (incluidas las que fallaron), su clasificación en preventivas y protectivas justificada término por término sobre R = P × G, y doce barreras nuevas mapeadas a la jerarquía de controles y al punto exacto de la línea de tiempo que atacan.'
---

## En una línea

Resolución completa de las tres partes del [[ejercicio-barreras-consigna|Ejercicio de Barreras]]
sobre la [[caso-first-chemical-2002|explosión de First Chemical Corp. (2002)]]: nueve barreras
existentes al momento del accidente (incluidas las que fallaron), su clasificación en preventivas
y protectivas justificada término por término sobre `R = P × G`, y doce barreras nuevas mapeadas a
la [[02-06-jerarquia-de-controles|jerarquía de controles]] y al punto exacto de la línea de
tiempo que atacan.

## La consigna

> "1. Encontrar las barreras existentes al momento del accidente (independientemente de si fueron
> eficaces o no). 2. Clasificar las mismas en preventivas y protectivas. 3. Proponer al menos cinco
> nuevas barreras que no estén identificadas en el caso, identificando si son preventivas o
> protectivas." (Ejercicio Barreras, p. 1)

> [!important] Este es el **TP1** del programa oficial, y lleva nota
> Actualizado el 2026-08-25. El [[programa-oficial-12-83|programa oficial]] (p. 5) lo lista
> primero, con esta descripción: *"**TP1: Barreras preventivas y protectivas.** Caso de estudio de
> accidente laboral a partir del cual se identifican y proponen nuevas barreras de tipo preventivas
> y protectivas."*
>
> Los TP **son calificados con devolución del docente**, pueden ser individuales o grupales de 3 a
> 5 personas, y hace falta haber hecho **al menos el 80 %** para aprobar la materia (p. 6). Eso
> cierra H-08 en [[huecos]]: el nombre del archivo decía "individual y en clase" y se había leído
> como trabajo de proceso sin nota. **Sí tiene nota.**

El texto completo de la consigna y la lectura crítica de sus ambigüedades están en
[[ejercicio-barreras-consigna]]; la reconstrucción del caso como línea de tiempo, en
[[caso-first-chemical-2002]]. Esta página resuelve, no reconstruye.

## El marco con el que se resuelve

**Qué cuenta como barrera.** Se aplica la definición de la cátedra, sin ampliarla:

> "Una barrera es: un medio físico o no-físico cuya función planificada es la de prevenir,
> controlar o mitigar eventos no deseados o accidentes." (Hollnagel, 2006) (Clase 2, slide 9)

De esa definición se usan las dos condiciones operativas — ver [[02-03-barrera]]:

1. **Puede ser física o no-física.** Un procedimiento, un análisis de riesgos o una regla de
   operación son barreras tanto como una válvula. No se descarta nada por no ser un objeto.
2. **Su función tiene que ser planificada.** Alguien la puso ahí a propósito, para eso. Este es el
   filtro que expulsa del inventario todo lo que en el caso sale bien por azar.

**Cómo se clasifica.** El criterio es el del slide 10, y es el único que se usa:

> "Para reducir la probabilidad de ocurrencia de accidentes, la herramienta es la Prevención. Para
> reducir la gravedad de los accidentes, la herramienta es la Protección." (Clase 2, slide 10)

Es decir, sobre `R = P × G` ([[01-05-riesgo]]): **preventiva = interviene la `P`**,
**protectiva = interviene la `G`**. Ver [[02-04-prevencion-y-proteccion]].

**Decisión metodológica para el caso dudoso.** El eje de clasificación **no es** física/no-física
ni ingeniería/administrativa: es **cuándo actúa la barrera respecto de la pérdida de control**
(Clase 2, slide 11 — [[02-05-secuencia-del-accidente]]). Cuando una barrera se puede defender de
las dos formas, se aplica esta regla de desempate, **en este orden estricto**: la 2 sólo se usa si
la 1 no alcanza para decidir, y la 3 gobierna a las dos. Vale para el inventario de la Parte 1 y
también para las barreras propuestas en la Parte 3:

1. **¿Actúa antes o después de la pérdida de control?** Antes → preventiva; después → protectiva.
   Ojo con el marcador exacto, porque acá se juega medio ejercicio: la secuencia de la cátedra
   tiene **dos** cortes, no uno — **falta de control** abre la *fase inicial* y **pérdida de
   control** abre la *fase de conclusión* (Clase 2, slide 11 — [[02-05-secuencia-del-accidente]]).
   El que decide la clasificación es el **segundo**. En este caso, la falta de control empieza con
   las válvulas deterioradas dejando pasar vapor sin que nadie mire la temperatura; la pérdida de
   control es cuando la descomposición se vuelve irreversible y se manifiesta en el "ruido grave y
   fuerte" y el humo venteando de la torre (p. 1). Todo lo que actúa entre esos dos cortes
   —incluida la alarma del 12 de octubre (B4)— sigue estando **antes** de la pérdida de control, y
   por lo tanto es preventivo.
2. **Si sigue siendo ambiguo: ¿qué término de `R = P × G` se movería si la barrera funcionara
   perfectamente, y qué término quedaría igual?** Si con la barrera perfecta el evento no ocurre,
   es preventiva. Si el evento ocurre igual pero termina menos mal, es protectiva.
3. **El evento de referencia es siempre la explosión de la torre**, no los eventos derivados. En un
   accidente en cascada, clasificar respecto del eslabón que se está analizando y no del siguiente
   evita que toda barrera protectiva se pueda re-etiquetar como "preventiva del incendio posterior".

Y una regla de alcance, que resuelve el punto más discutido del ejercicio: **una barrera existe "al
momento del accidente" si estaba interpuesta en la trayectoria energética de este accidente**. Un
control instalado en otra unidad no puede actuar sobre esta columna: no está en la trayectoria. Se
desarrolla abajo, en el ítem del análisis de riesgos de 1996.

## Parte 1 — Barreras existentes al momento del accidente

La consigna pide las barreras existentes **"independientemente de si fueron eficaces o no"**
(Ejercicio Barreras, p. 1). Se toma al pie de la letra: **una barrera que falló sigue siendo una
barrera existente**, y de hecho son las que más dicen sobre el accidente. Omitirlas por haber
fallado sería responder otra pregunta.

| # | Barrera | Evidencia textual en el caso | Fase de la secuencia en la que actúa | Qué pasó con ella |
|---|---|---|---|---|
| B1 | **Cierre de las válvulas que alimentaban vapor a la columna** | "los operarios, cerraron las válvulas que alimentaban el vapor a la columna" (p. 2) | Condición normal — corta el aporte de energía antes de cualquier desviación | **Falló técnicamente.** "estas válvulas se encontraban deterioradas y presentaban pérdidas que hicieron que el MNT en la columna volviera a calentarse lentamente" (p. 2). Falla silenciosa: nadie supo que la barrera estaba caída |
| B2 | **Apagado del sistema de vapor de toda la planta** | "más tarde apagaron el sistema de vapor de toda la planta industrial" (p. 2) | Condición normal — suprime la fuente de energía aguas arriba | **Funcionó mientras estuvo, y se retiró.** "En Octubre 5 volvieron a poner en marcha la producción de vapor en la planta" (p. 2). Al retirarse quedó como única barrera B1, que ya estaba fallada |
| B3 | **Instrumentación de temperatura de la columna, con lectura en tiempo real en sala de control** | "existía la instrumentación y las mediciones podían ser visualizadas en tiempo real en la sala de control" (p. 2) | Fase inicial — detección de la desviación mientras todavía hay margen de intervención | **Nunca se activó como barrera.** Existía como capacidad técnica y nadie la usó: "Los operadores de planta, confiados, no monitoreaban la temperatura de la columna" (p. 2). La barrera estaba instalada pero desconectada del sistema humano que la cerraba |
| B4 | **Alarma de alto nivel de la columna** | "El 12 de Octubre una alarma de alto nivel en la columna actuó" (p. 2) | Fase inicial — última señal antes de la pérdida de control, el día anterior a la explosión | **Funcionó técnicamente y fue anulada por decisión humana.** "los operarios pensando de que se trataba de una falsa alarma (no era posible que sonará una alarma de un equipo fuera de servicio) la desestimaron y apagaron" (p. 2) |
| B5 | **Procedimiento de parada programada del proceso** | "la empresa había decidido poner fuera de servicio el proceso de destilación de MNT. Durante la parada programa[da]…" (p. 2) | Condición normal — llevar el equipo a estado seguro | **Se ejecutó de forma incompleta.** Dejó el producto adentro: "1.200 galones (unos 4.500 litros) de MNT permanecieron en el interior de la columna que continuaron siendo calentados" (p. 2) |
| B6 | **Sala de control como refugio, a 18 m de la base de la torre** | "se refugiaron rápidamente en la sala de control que se encontraba a 18 m de la base de la torre" (p. 1) | Fase de perjuicio — acota el daño a las personas con la energía ya liberándose | **Funcionó parcialmente.** Hubo 3 lastimados y no muertos, pero "los operarios en la sala de control fueron derribados por la presión ejercida por la explosión y recibieron una lluvia de vidrio proveniente de las ventanas de la sala" (p. 1) |
| B7 | **Separación física entre equipos (layout): 150 m al tanque de 100.000 galones de MNT, refinería en predio adyacente** | "un tanque que se encontraba a 150 m de distancia y contenía 100.000 galones de MNT"; "casi colisiona con un tanque de una refinería adyacente" (p. 2) | Fase de perjuicio — limita cuánta energía llega a cada blanco | **Fue superada.** La distancia no alcanzó: el proyectil perforó el tanque a 150 m e "inicio un fuego que duró 3 hrs" (p. 2), y los desechos llegaron "hasta una milla" (p. 2) |
| B8 | **Sistema de emergencias local de aviso a los residentes** | "El sistema de emergencias local advirtió a los residentes" (p. 2) | Fase de perjuicio — reduce la exposición de terceros al evento ya ocurrido | **Funcionó parcialmente.** "pero muchos no recibieron la advertencia o no actuaron apropiadamente ante la misma" (p. 2): el emisor funcionó, la cadena completa no |
| B9 | **Análisis de riesgos de 1996 sobre MNT (barrera organizacional)** | "en el año 1996 se había realizado un análisis de riesgos en otra instalación de MNT, la cual había determinado que por encima de los 180 °C el MNT comenzaba a descomponerse y el riesgo de explosión era altísimo" (p. 2) | Condición normal — produce el conocimiento del umbral con el que se diseñan las demás barreras | **Falló por no propagación.** "no trasladándose estos resultados a la columna de MNT que había en la misma planta industrial" (p. 2) |

### El punto fino: ¿el análisis de 1996 y sus controles cuentan como "existentes"?

Es la decisión más discutible del inventario y se resuelve en dos partes distintas, con el criterio
de trayectoria enunciado arriba:

- **Los "sistemas de seguridad más estrictos" derivados del análisis NO se cuentan como barreras
  existentes de este accidente.** Estaban instalados en *otra* instalación (p. 2). Una barrera es un
  medio interpuesto entre una energía y un blanco; un dispositivo que no está físicamente en la
  trayectoria de esta columna no puede prevenir, controlar ni mitigar *este* evento, por más que
  exista en el patrimonio de la empresa. Contarlos sería contar barreras que, para este accidente,
  son exactamente equivalentes a no existir.
- **El análisis de riesgos de 1996 en sí SÍ se cuenta (B9), como barrera no-física de alcance
  organizacional.** El conocimiento de que el MNT se descompone por encima de 180 °C existía dentro
  de la empresa al momento del accidente, y su función planificada —informar el control del riesgo
  de MNT— no tiene por naturaleza un límite de instalación. Contarlo permite decir algo que el otro
  criterio no deja decir: que acá no falló el conocimiento, falló su distribución. Es la diferencia
  entre "no sabían" y "la organización sabía y el turno de esa columna no".

**Si el corrector aplica el criterio estricto** ("existente = instalado en esta columna"), B9 también
sale del inventario y todo el asunto de 1996 pasa a ser materia de la Parte 3. Se elige el criterio
amplio porque es el que hace visible la falla organizacional, que es el aprendizaje principal del
caso y el que la Clase 2 pone en el centro cuando desplaza la causa del "acto inseguro" del operario
hacia las fallas de gestión.

### Lo que NO es barrera, aunque lo parezca

Tres hechos del caso evitaron consecuencias mucho peores y ninguno es una barrera, porque a ninguno
se le puede atribuir **función planificada** — la condición que exige la definición de Hollnagel
(Clase 2, slide 9):

| Hecho | Evidencia | Por qué no es barrera |
|---|---|---|
| Que los proyectiles no alcanzaran los tanques de amoníaco, cloro y ácido sulfúrico | "Estos elementos despedidos por la explosión, **afortunadamente**, no alcanzaron otros tanques cercanos que contenían amoniaco, cloro, ácido sulfúrico y otros materiales peligrosos" (p. 1) | Es la trayectoria de un fragmento balístico. Nadie la planificó y nadie la controlaba: el mismo evento con otro ángulo de salida daba otro resultado |
| Que el tanque de amoníaco golpeado estuviera fuera de servicio | "colisionó con una serie de cañerías de alimentación a un tanque de amoniaco que **casualmente y con mucha suerte** se encontraba fuera de servicio" (p. 2) | La propia consigna lo califica de casualidad. El tanque no estaba fuera de servicio *para* limitar las consecuencias de una explosión |
| Que el fragmento de seis toneladas sólo "casi" colisionara con el tanque de la refinería adyacente | "Otro de los desechos, de unas seis toneladas, **casi** colisiona con un tanque de una refinería adyacente" (p. 2) | Es un cuasi accidente ([[01-08-incidente]]), no un control. Es información valiosísima sobre el riesgo residual, pero no es algo que haya actuado |

Confundir suerte con barrera es el error que produce un análisis tranquilizador: si se cuentan estos
tres hechos como controles, el sistema parece haber tenido defensas en profundidad que no tenía.

## Parte 2 — Clasificación

| # | Barrera | Clase | Justificación en términos de `P` o `G` |
|---|---|---|---|
| B1 | Cierre de válvulas de vapor a la columna | **Preventiva** | Corta el aporte de energía térmica al MNT. Con la barrera perfecta, el MNT nunca alcanza los 180 °C y el evento no ocurre: mueve la `P` a cero. No modifica en nada cuánto daño haría la explosión si igual ocurriera → no toca la `G` |
| B2 | Apagado del sistema de vapor de toda la planta | **Preventiva** | Misma lógica que B1 un escalón aguas arriba: suprime la fuente de energía. Interviene la `P` |
| B3 | Instrumentación de temperatura con lectura en sala de control | **Preventiva** | Su función es hacer visible la desviación **antes** de la pérdida de control, para poder actuar sobre ella. Detectar el calentamiento no reduce el tamaño de una explosión: reduce la probabilidad de llegar a ella |
| B4 | Alarma de alto nivel de la columna | **Preventiva** (caso límite, ver abajo) | Actúa en la fase inicial, el día anterior al evento, sobre una desviación que todavía admite intervención. Reduce la `P` |
| B5 | Procedimiento de parada programada | **Preventiva** | Control administrativo cuya función es llevar el equipo a un estado en el que el evento no pueda originarse. Interviene la `P`. Corresponde a "señales, avisos, controles administrativos (procedimientos, normas…)" del lado de prevenir (Clase 2, slide 12) |
| B6 | Sala de control como refugio a 18 m | **Protectiva** (caso límite, ver abajo) | No baja en nada la probabilidad de que la torre explote: la torre explota igual. Sólo cambia cuánto daño reciben las personas cuando ya explotó → interviene la `G` |
| B7 | Separación física entre equipos (150 m, predio adyacente) | **Protectiva** (caso límite, ver abajo) | La distancia no evita la explosión de la torre; limita cuánta energía llega a cada blanco secundario. Actúa sobre la extensión del daño → `G` |
| B8 | Sistema de emergencias local de aviso a residentes | **Protectiva** | Se activa cuando el evento ya ocurrió; su función es reducir la exposición de terceros al daño en curso. Es literalmente el primer ítem de "proteger es": "señales, avisos, alarmas de estado de emergencia" (Clase 2, slide 13) |
| B9 | Análisis de riesgos de 1996 | **Preventiva** | Produce el umbral de 180 °C, es decir, el dato con el que se decide qué controles instalar para que la reacción no se desate. Su objeto es la `P`. No dice nada sobre cómo acotar el daño de una explosión ya ocurrida |

**Resumen:** seis preventivas (B1, B2, B3, B4, B5, B9) y tres protectivas (B6, B7, B8). El
desbalance no es casual y conviene decirlo en la defensa: el caso tenía barreras razonables del lado
de la `P` —todas caídas, anuladas o sin usar— y muy poco del lado de la `G`, que es lo que explica
que una vez desatada la reacción no hubiera absolutamente nada entre 1.200 galones de MNT en
descomposición y tres operarios a 18 metros.

### Casos límite, argumentados

**B4, la alarma de alto nivel: preventiva, aunque sea un dispositivo de respuesta.** Es el caso más
discutible, porque "señales, avisos, alarmas" aparece en las dos columnas de la cátedra: en
"prevenir es" como "señales, avisos, controles administrativos" (Clase 2, slide 12) y en "proteger
es" como "señales, avisos, **alarmas de estado de emergencia**" (Clase 2, slide 13). La palabra que
desempata es *emergencia*. Lo que decide no es que el dispositivo reaccione, sino **a qué reacciona**:

- una alarma que anuncia una **desviación** actúa antes de la pérdida de control, cuando todavía se
  puede evitar el evento → preventiva;
- una alarma que anuncia una **emergencia en curso** actúa después, y sólo sirve para que la gente
  se ponga a resguardo → protectiva (es el caso de B8).

La alarma del 12 de octubre sonó **el día anterior** a la explosión —"El 12 de Octubre una alarma
de alto nivel en la columna actuó" (p. 2); la torre reventó "aproximadamente a las 5:00 am del 13 de
Octubre" (p. 1)—, con el proceso todavía gobernable: es del primer tipo. **Se clasifica preventiva.**

> **Inferencia:** la consigna **no da la hora** en que actuó la alarma del 12, así que el intervalo
> exacto entre la alarma y la explosión es desconocido: puede haber sido de unas pocas horas o de
> más de un día. Lo único que la fuente sostiene es el orden de los hechos y la diferencia de fecha.
> La clasificación de B4 como preventiva **no depende de
> cuántas horas pasaron**: depende sólo de que actuó antes de la pérdida de control, cuando la
> desviación todavía admitía intervención. Cualquier resolución que apoye la clasificación en un
> intervalo cuantificado está agregando un dato que la fuente no tiene.

> **Inferencia:** la alarma que actuó era de **alto nivel**, no de temperatura (p. 2). Que el nivel
> haya subido por expansión y generación de gases producto de la descomposición del MNT es una
> lectura razonable del caso, pero la consigna no lo dice. Lo que sí está en el texto es que la
> variable que había que mirar —la temperatura— tenía instrumentación y nadie la miraba (B3), y que
> la señal que efectivamente llegó a los operarios fue una alarma de nivel. La barrera que avisó no
> era la barrera diseñada para avisar de esto.

**B6, la sala de control: protectiva, sin ambigüedad real.** La tentación de llamarla preventiva
viene de que los operarios se refugiaron *antes* de la explosión (p. 1). Pero la regla de desempate
pregunta qué término se mueve: refugiarse no bajó ni un punto la probabilidad de que la torre
explotara. La torre explotó igual, minutos después. Lo único que cambió la sala fue **cuánto daño
recibieron las personas**. Es `G`. Que la barrera actúe cronológicamente antes del evento no la hace
preventiva; lo que la haría preventiva es que actuara sobre la génesis del evento.

**B7, la distancia entre equipos: protectiva respecto de la explosión, y acá se ve por qué importa
fijar el evento de referencia.** Se puede argumentar que la distancia al tanque de 100.000 galones es
*preventiva del incendio*, porque respecto de ese segundo evento actúa antes de que ocurra. Es
correcto y es una trampa: con ese razonamiento toda barrera protectiva se vuelve preventiva del
eslabón siguiente, y la clasificación pierde sentido. Por la regla 3 del marco, el evento de
referencia es la explosión de la torre; frente a ella la distancia no hace nada sobre la `P` y todo
sobre la extensión del daño. **Protectiva.**

> **Inferencia:** que el layout de la planta (150 m al parque de tanques, refinería en predio
> vecino) constituya una barrera con *función planificada* y no una mera circunstancia es una
> lectura propia: la consigna menciona las distancias como dato geográfico y nunca dice que se hayan
> fijado con criterio de seguridad. Se la cuenta como barrera porque las distancias de separación
> entre unidades son una decisión de diseño de planta, no un accidente del terreno; pero si el
> criterio se aplicara con el mismo rigor que a los hechos de la sección "lo que no es barrera", B7
> sería el ítem más frágil del inventario. Se lo incluye y se declara la duda.

**B9, un análisis de riesgos como barrera.** Un estudio no interpone nada entre nada. Cuenta como
barrera porque la definición admite medios **no-físicos** (Clase 2, slide 9) y porque su función
planificada es exactamente la del enunciado: prevenir eventos no deseados. Es la misma familia que
los "controles administrativos" del slide 12.

## Parte 3 — Doce barreras nuevas

La consigna pide "al menos cinco" (Ejercicio Barreras, p. 1). Se proponen **doce**: ocho preventivas
y cuatro protectivas. Ninguna repite una barrera de la Parte 1 con otro nombre — la verificación
está en la sección siguiente.

### Preventivas

| # | Barrera propuesta | Clase | Qué punto exacto de la línea de tiempo ataca | Escalón de la jerarquía | Por qué no estaba en el caso |
|---|---|---|---|---|---|
| N1 | **Vaciado y purga de la columna como paso obligatorio de cierre de la parada**: drenar el producto a almacenamiento frío y dejar la columna sin MNT antes de darla por fuera de servicio | Preventiva | El origen de todo: "1.200 galones (unos 4.500 litros) de MNT permanecieron en el interior de la columna" (p. 2). Sin producto adentro, ninguna de las siete semanas siguientes tiene consecuencias | **Eliminar** | La parada programada existió (B5) pero no incluía retirar el material. El caso no registra ningún vaciado: el producto queda adentro por diseño del procedimiento, no por olvido |
| N2 | **Aislamiento positivo de la línea de vapor: brida ciega o carrete removible** entre el cabezal de vapor y el rehervidor de la columna, en lugar de válvula cerrada | Preventiva | La falla de B1: "estas válvulas se encontraban deterioradas y presentaban pérdidas" (p. 2). Una brida ciega no tiene el modo de falla "pierde": o está puesta o no está, y se ve | **Ingeniería** | El caso sólo menciona válvulas cerradas. No es la misma barrera con otro nombre: una válvula es un elemento de operación que puede pasar y degradarse, un aislamiento positivo es una desconexión física verificable a simple vista |
| N3 | **Sustitución del medio calefactor por uno cuya temperatura máxima alcanzable esté acotada por diseño por debajo del umbral de descomposición (180 °C)** | Preventiva | El mecanismo físico completo: "por encima de los 180 °C el MNT comenzaba a descomponerse y el riesgo de explosión era altísimo" (p. 2). Si el fluido no puede entregar esa temperatura, la fuga de una válvula deja de ser un camino al accidente | **Sustituir** | El caso describe "un sistema de cañerías de vapor" (p. 2) sin ninguna limitación de temperatura: el calentamiento disponible podía llevar el MNT por encima de su umbral |
| N4 | **Enclavamiento automático de corte por alta temperatura de la columna**, con actuación independiente del operador y set-point **por debajo de los 180 °C, con margen suficiente** para que la columna nunca entre en la zona de descomposición | Preventiva | Los "días siguientes" en que "el MNT siguió calentándose y comenzó a descomponerse" (p. 2) sin que nada actuara | **Ingeniería** | No repite B3: la instrumentación existente **mostraba** y dependía de que alguien mirara. Un enclavamiento **actúa** sin intervención humana. La falla del caso es precisamente que toda la cadena de detección terminaba en una pantalla que nadie miraba |
| N5 | **Procedimiento de gestión de alarmas: ninguna alarma puede silenciarse sin verificación de campo y registro**, con confirmación física del estado del equipo y aval del supervisor de turno | Preventiva | El acto del 12 de octubre: "la desestimaron y apagaron" (p. 2). Con esta barrera, apagar la alarma exige ir a ver la columna, y ver la columna cambia la historia | **Administrativo** | El caso muestra que los operarios pudieron desestimar y apagar por decisión propia, sin verificación ni registro: no había ninguna restricción sobre esa acción |
| N6 | **Regla formal: "equipo fuera de servicio con producto adentro no es equipo inerte"** — mientras conserve material, la unidad mantiene régimen pleno de monitoreo, rondas y alarmas activas, y así figura en el sistema de gestión y en los tableros | Preventiva | El razonamiento exacto que anuló la última barrera: "no era posible que sonará una alarma de un equipo fuera de servicio" (p. 2). Ataca la premisa, no el dispositivo | **Administrativo** | El razonamiento de los operarios revela que el marco vigente era el contrario: "fuera de servicio" se leía como "sin riesgo". Es una falla de clasificación organizacional, no un aparato faltante |
| N7 | **Propagación obligatoria de hallazgos de análisis de riesgos a toda instalación con el mismo material o proceso**: todo estudio sobre MNT dispara revisión documentada de las demás unidades de MNT de la empresa, con responsable y plazo | Preventiva | La falla de B9: "no trasladándose estos resultados a la columna de MNT que había en la misma planta industrial" (p. 2) | **Administrativo** | Lo que faltó no fue el análisis —ese existió y fue correcto— sino el mecanismo que lo distribuye. El caso no menciona ningún proceso de traslado de aprendizajes, y por eso el hallazgo de 1996 quedó encapsulado seis años en una sola unidad |
| N8 | **Verificación de estanqueidad de las válvulas de aislamiento de equipos parados como condición para reponer el servicio de vapor**: antes de rehabilitar el cabezal, prueba de hermeticidad y control de temperatura aguas abajo de cada válvula cerrada | Preventiva | El 5 de octubre: "volvieron a poner en marcha la producción de vapor en la planta pero mantuvieron las válvulas que alimentaban el vapor a la torre cerradas" (p. 2), sin que nadie comprobara si esas válvulas cerraban de verdad | **Administrativo** | "Lo que estos operarios desconocían es que estas válvulas se encontraban deterioradas" (p. 2): no había ninguna verificación previa al rearranque que pudiera haberlo revelado |

### Protectivas

| # | Barrera propuesta | Clase | Qué punto exacto de la línea de tiempo ataca | Escalón de la jerarquía | Por qué no estaba en el caso |
|---|---|---|---|---|---|
| N9 | **Sala de control resistente a explosión o relocalizada fuera del radio de la torre**: estructura antiexplosión, sin aberturas enfrentadas al equipo o con vidriado antiesquirla | Protectiva | El daño efectivo a las personas: "fueron derribados por la presión ejercida por la explosión y recibieron una lluvia de vidrio proveniente de las ventanas de la sala" (p. 1) | **Ingeniería** | No es B6 con otro nombre: lo que existía era una sala a 18 m con ventanas comunes —lo prueba la lluvia de vidrio—. Lo que se propone es una propiedad de diseño distinta, resistencia estructural o relocalización, que el caso demuestra ausente justo donde hizo falta |
| N10 | **Protección pasiva del parque de tanques de MNT**: aislación ignífuga y refuerzo de envolvente en los tanques de gran volumen, con sistema fijo de enfriamiento y espuma | Protectiva | El eslabón que multiplicó el accidente: el fragmento que perforó el tanque de 100.000 galones a 150 m e "inicio un fuego que duró 3 hrs" (p. 2) | **Ingeniería** | El caso no registra ninguna protección del tanque más allá de la distancia (B7), ni ninguna acción de extinción: el fuego simplemente duró tres horas |
| N11 | **Sistema de alivio de presión dimensionado para la descomposición descontrolada del MNT**, con venteo dirigido a un destino de contención seguro | **Protectiva** (caso límite, ver abajo) | El instante final: "escucharon un ruido grave y fuerte y observaron humo venteando de la torre de destilación" (p. 1), minutos antes de que la torre reventara. Actúa con la descomposición ya desatada —es decir, **después** de la pérdida de control— sobre la energía que se libera de golpe | **Ingeniería** | El caso no menciona ningún dispositivo de alivio: el venteo observado es el fenómeno abriéndose paso por donde puede, no un sistema actuando. Es la única de las doce cuya clasificación admite defensa en las dos direcciones, y por eso se argumenta aparte |
| N12 | **Plan de emergencia externo con notificación redundante y verificable, y simulacros con la comunidad**: más de un canal de aviso, confirmación de alcance e instrucción previa sobre qué hacer | Protectiva | La falla de B8: "muchos no recibieron la advertencia o no actuaron apropiadamente ante la misma" (p. 2) — las dos mitades del problema, alcance y respuesta | **Administrativo** | El aviso existía, pero el caso muestra que no había ni redundancia de canal ni preparación previa de los residentes. Corresponde a "planes de contingencia" y "realizar simulacros" del lado de proteger (Clase 2, slide 13) |

### N11, el caso límite de la Parte 3: el alivio de presión

Es la única barrera nueva que se puede defender de las dos formas, así que corresponde declararlo y
elegir, igual que se hizo con B4, B6 y B7 en la Parte 2.

**El argumento por "preventiva".** Si se aplica la regla 2 del marco —qué término se mueve con la
barrera perfecta— y se conserva el evento de referencia de la regla 3 —la explosión de la torre—,
un alivio bien dimensionado hace que la torre **no reviente**: descarga los gases de descomposición
a un destino seguro y la columna sobrevive. Con la barrera perfecta el evento de referencia no
ocurre, y eso es la definición de preventiva.

**El argumento por "protectiva", que es el que se elige.** La regla 1 tiene prioridad sobre la 2
—la regla 2 sólo se aplica "si sigue siendo ambiguo"— y la regla 1 pregunta cuándo actúa la barrera
respecto de la **pérdida de control**. El alivio no actúa nunca mientras el proceso está gobernado:
sólo abre cuando la presión ya subió, es decir, con la reacción de descomposición **ya desatada**.
En la línea de tiempo del caso, N11 entra en juego en el mismo instante que el "ruido grave y
fuerte" y el humo venteando de la torre (p. 1) — es decir, **en la pérdida de control misma**, no
antes. Todo lo que venía pasando desde el 5 de octubre —la fuga de las válvulas, el calentamiento
lento, el MNT que "comenzó a descomponerse en subproductos peligrosos" (p. 2) sin que nadie lo
advirtiera— es la **fase inicial**, la que abre la *falta* de control; ahí todavía hay margen para
intervenir, y es exactamente por eso que la alarma del 12 de octubre (B4) se clasifica preventiva.
N11 no toca nada de esa cadena: no impide la fuga de las
válvulas, ni el calentamiento, ni la descomposición. La `P` del accidente queda **exactamente
igual** con y sin alivio. Lo único que cambia es **cuánta energía se libera de golpe y por dónde
sale**: eso es la `G`. **Se clasifica protectiva.**

**Por qué no se resuelve con la regla 3.** Podría decirse que N11 "previene" porque cambia el evento
de referencia de "explosión de la torre" a "descomposición del MNT". No hace falta ese
deslizamiento, y usarlo sería incoherente: la regla 3 se fijó justamente para no dejar que el evento
de referencia se corra fila por fila. Con el evento de referencia intacto en la explosión de la
torre, el resultado sigue siendo protectiva, porque la regla 1 ya lo resuelve. Y hay una razón
sustantiva además de la formal: un alivio de presión es el ejemplo de manual de barrera de
mitigación —acepta que el evento se desató y administra su consecuencia—, del mismo modo que la
sala de control (B6) acepta que la torre explota y administra el daño a las personas.

> **Nota de coherencia:** si un corrector aplica la regla 2 por encima de la 1, N11 pasa a
> preventiva y el reparto de la Parte 3 queda en nueve preventivas y tres protectivas. Ninguna otra
> fila cambia: N9, N10 y N12 actúan sobre blancos ya expuestos a la energía liberada y son
> protectivas bajo cualquiera de las dos lecturas.

### Por qué no se propone ninguna barrera de EPP

El EPP es el último escalón de la jerarquía ([[02-07-epp]], [[02-06-jerarquia-de-controles]]) y
acá es directamente irrelevante: ningún elemento de protección personal cambia el resultado de la
onda de presión de una torre de 50 m que proyecta toneladas de estructura a una milla. Proponerlo
sería llenar un casillero. La omisión es deliberada y forma parte de la respuesta: cuando la energía
en juego es de esta magnitud, la única intervención con sentido está arriba de la jerarquía —N1
(eliminar el producto) y N3 (sustituir el medio calefactor)—, y todo lo demás es contención de daño.

## Cómo se defiende esta resolución

Los ocho puntos discutibles, con la decisión tomada y su razón. Son también los criterios con los
que es razonable que esta resolución se corrija.

1. **Se incluyeron las barreras que fallaron.** La consigna lo pide explícitamente
   ("independientemente de si fueron eficaces o no", p. 1) y es el error típico: si se omiten B1
   (válvulas deterioradas), B3 (instrumentación no usada) y B4 (alarma anulada), el inventario se
   queda con tres barreras y el caso deja de ser analizable. Justamente esas tres son las que
   muestran los tres modos de falla distintos —técnico, de uso, de decisión— y ese contraste es el
   contenido del ejercicio.
2. **El análisis de 1996 se cuenta, sus controles no.** Criterio de trayectoria, argumentado arriba.
   Es la decisión más atacable de la Parte 1 y por eso está declarada, con la consecuencia explícita
   de aplicar el criterio contrario.
3. **La alarma de alto nivel se clasificó preventiva.** El desempate es *desviación vs. emergencia*,
   no *dispositivo vs. procedimiento*. Sonó el día anterior, con el proceso todavía gobernable. El
   argumento **no usa** ningún intervalo en horas, porque la consigna no da la hora de la alarma.
4. **La sala de control se clasificó protectiva** pese a que los operarios entraron antes de la
   explosión: cronología no es causalidad, y la sala no movió la `P`.
5. **La distancia de layout se contó como barrera, con la duda declarada.** Es el ítem más frágil
   del inventario, porque la consigna no dice que las distancias tengan función planificada de
   seguridad. Se incluye y se avisa, en vez de incluirla en silencio.
6. **La suerte no se contó como barrera.** Los tres hechos afortunados del caso están listados
   aparte y con su razón (sin función planificada, Clase 2, slide 9). Contarlos como controles
   produce un análisis falsamente tranquilizador.
7. **Ninguna barrera nueva repite una existente.** Verificación una por una: N2 ≠ B1 (aislamiento
   positivo vs. válvula, modos de falla distintos); N4 ≠ B3 (actúa vs. muestra); N5/N6 ≠ B4 (regla
   de gestión vs. dispositivo); N7 ≠ B9 (mecanismo de propagación vs. el estudio); N8 ≠ B5
   (verificación de rearranque vs. procedimiento de parada); N9 ≠ B6 (resistencia estructural vs. la
   sala existente); N10 ≠ B7 (protección del blanco vs. distancia); N12 ≠ B8 (redundancia y
   simulacro vs. el aviso). N1, N3 y N11 no tienen ningún correlato en el caso.
8. **El alivio de presión (N11) se clasificó protectivo, con el argumento contrario declarado.** Es
   el único caso límite de la Parte 3 y se resuelve por la regla 1 del marco —actúa después de la
   pérdida de control— y no por la regla 2, que aisladamente lo haría preventivo. El evento de
   referencia **no se corre**: sigue siendo la explosión de la torre, igual que en B7. La discusión
   completa está arriba, junto a la tabla de protectivas.

Un noveno criterio, sobre el que conviene estar listo: **ninguna barrera propuesta es genérica**.
No hay "más capacitación" ni "mejorar la cultura de seguridad". Cada una nombra el equipo, la
variable o el instante concreto sobre el que actúa: los 1.200 galones, los 180 °C, las válvulas de
aislamiento, el rearranque del 5 de octubre, la alarma del 12.

## Qué agregaría una lectura más exigente

Este accidente fue investigado por la **U.S. Chemical Safety Board (CSB)**, y su informe es la
fuente natural para contrastar esta resolución: causa raíz formal, listado de barreras que el
organismo señaló como ausentes, y recomendaciones emitidas a la empresa y al sector.

> **Nota de método:** al 13/8/2026 [[contexto-externo]] **no tiene todavía una sección sobre el
> informe de la CSB**, y por regla del vault el material de búsqueda web no entra al cuerpo de una
> página de wiki. Por eso **esta resolución no usa ni una sola afirmación del informe de la CSB**:
> todo lo de arriba sale de la consigna (p. 1-2) y de la teoría de la Clase 2. Cuando esa sección se
> incorpore a [[contexto-externo]], corresponde volver acá y contrastar —en particular los ítems 2,
> 5 y 7 de la defensa—, sabiendo que si la CSB contradice a la consigna, para la cursada **gana la
> consigna**: es la fuente de cátedra y es con lo que se corrige.

Tres preguntas que esta resolución deja abiertas y que una lectura más exigente debería responder:

- **Por qué la parada dejó producto adentro.** ¿Fue una decisión de proceso (el vaciado era
  costoso o técnicamente incómodo) o una omisión del procedimiento? De la respuesta depende que N1
  sea una barrera de diseño o una barrera de gestión.
- **Qué sabía la planta de Pascagoula sobre el umbral de 180 °C.** La consigna dice que los
  resultados no se trasladaron (p. 2), no que nadie los conociera. La diferencia decide si N7
  alcanza o si hace falta además una barrera sobre la decisión de no aplicar lo que se sabe.
- **Cuánto de la respuesta de emergencia era plan y cuánto improvisación.** El caso sólo dice que el
  sistema local "advirtió a los residentes" (p. 2). Sin más detalle, N12 se propone a ciegas sobre lo
  que ya existía.

## Relación con otros temas

- [[ejercicio-barreras-consigna]] — la consigna textual y la lectura crítica de sus ambigüedades,
  que esta página resuelve con criterio explícito.
- [[caso-first-chemical-2002]] — la línea de tiempo del caso sobre la que se construye el inventario.
- [[02-03-barrera]] — la definición de Hollnagel y el criterio preventiva/protectiva que
  estructuran toda la resolución.
- [[02-04-prevencion-y-proteccion]] — "prevenir es" / "proteger es" (slides 12-13), el contenido
  con el que se clasificó cada barrera.
- [[02-05-secuencia-del-accidente]] — el modelo temporal que sostiene la regla de desempate y la
  columna "fase de la secuencia" de la Parte 1.
- [[02-06-jerarquia-de-controles]] — el eje eliminar → sustituir → ingeniería → administrativo →
  EPP con el que se mapean las doce barreras nuevas.
- [[02-07-epp]] — por qué acá el último escalón no aporta nada.
- [[01-07-accidente]] — la definición de [[william-johnson|Johnson]] (1973), "transferencia
  indeseada de energía debido a la falta de barreras": la energía son los 1.200 galones de MNT
  calentándose, y las barreras faltantes son literalmente el objeto de este ejercicio.
- [[01-04-peligro]] — el MNT por encima de 180 °C es la fuente con potencial de causar daño.
- [[01-05-riesgo]] — `R = P × G`, la ecuación que la clasificación de la Parte 2 interviene.
- [[01-08-incidente]] — el fragmento de seis toneladas que "casi" golpea la refinería es un cuasi
  accidente, no una barrera.
- [[erik-hollnagel]] — autor de la definición de barrera y del par preventivo/protectivo.
- [[iso-45001]] — cláusula 8.1.2, origen de la jerarquía de controles usada en la Parte 3.
- [[modulo-1-seguridad]] — ítem 14 del temario, "Herramientas de análisis".
- [[repaso-parcial-modulo-1]] — este ejercicio es el ensayo general de la aplicación práctica que
  puede pedir el parcial.
- [[contexto-externo]] — dónde correspondería incorporar el informe de la CSB, hoy ausente.

## Fuentes

- (Ejercicio Barreras, p. 1-2) — [[ejercicio-barreras-consigna]]
- (Clase 2, slide 9 — Hollnagel, 2006), (Clase 2, slide 10), (Clase 2, slide 11), (Clase 2,
  slide 12), (Clase 2, slide 13) — [[clase-02]]
- ISO 45001:2018, cláusula 8.1.2 — [[iso-45001]]
