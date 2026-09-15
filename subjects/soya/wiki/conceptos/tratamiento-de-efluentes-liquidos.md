---
titulo: Tratamiento de efluentes líquidos
tipo: concepto
modulo: [2]
clase: []
division: "2"
tags: [efluentes, agua, tratamiento-de-efluentes, barros-activados, coagulacion, floculacion, desinfeccion, osmosis-inversa, barros]
fuentes: [guia-parcial-2-ambiental, preguntas-ambiental-2017, finales-soa-compilado]
actualizado: 2026-08-25
estado: en-desarrollo
aliases: [tratamiento-de-efluentes, depuracion-de-efluentes, planta-de-tratamiento-de-efluentes, tren-de-tratamiento]
resumen: 'Un efluente líquido no se "limpia" de una sola vez: se lo hace pasar por un tren de etapas en serie —primarios → secundarios → terciarios— donde cada etapa saca un tipo distinto de suciedad, y por tratamientos anexos a los costados que se llevan lo que el tren no puede volcar: los gases y los sólidos (los barros).'
---

> [!warning] Contenido de fuente de alumno, no de cátedra
> Las **preguntas** de este bloque son de cátedra ([[guia-parcial-2-ambiental]], guía oficial del
> parcial 2). Las **respuestas** son de [[preguntas-ambiental-2017]], un resumen de alumno de 2017.
> La cátedra **todavía no dictó el módulo 2 en la cursada 2026**: nada de acá está confirmado
> contra un soporte de clase. Cuando el módulo arranque, hay que cotejar y anotar las diferencias
> en [[contradicciones]].

## En una línea

Un efluente líquido no se "limpia" de una sola vez: se lo hace pasar por un **tren de etapas en
serie** —**primarios → secundarios → terciarios**— donde cada etapa saca un tipo distinto de
suciedad, y por **tratamientos anexos** a los costados que se llevan lo que el tren no puede volcar:
los **gases** y los **sólidos** (los barros).

## Por qué esta página es el corazón del bloque 2

De las 80 preguntas de la guía, **veinte** (11 a 30) son de tratamiento de efluentes, y **dieciséis
de esas veinte caen acá**. Es, por lejos, el bloque más grande del parcial 2 según la guía de
cátedra. Las otras cuatro están en [[dqo-dbo-y-biodegradabilidad]] (15, 16, 20) y
[[efluentes-gaseosos-y-toxicidad]] (27, 30).

---

## El diagrama de bloques (preg. 11)

> "Dibuje un diagrama de bloques general para el tratamiento de efluentes líquidos."
> (Guía Parcial 2, preg. 11)

> [!important] Esta pregunta se contesta **dibujando**, y la respuesta está en una figura
> Es la única de las 80 que usa el verbo "dibuje". La respuesta de 2017 **no tiene una sola palabra
> de texto**: es una figura pegada, titulada *"Esquema general del tratamiento de efluentes
> líquidos"* (Preguntas Ambiental 2017, p. 4). La extracción a `.cache/txt/` la perdió entera —hay
> que rasterizar el PDF para verla, como manda `CLAUDE.md` §2—. Lo que sigue es la **transcripción
> de esa figura**, no una reconstrucción.

```
        AIRE              EFLUENTE            QUÍMICOS
          │                  │                    │
          └────────┬─────────┴──────────┬─────────┘
                   ▼                    │
          ┌───────────────────┐         │
          │   TRATAMIENTOS    │ ◄───────┤
          │     PRIMARIOS     │         │
          └────────┬──────────┘         │
                   ▼                    │
          ┌───────────────────┐         │
          │   TRATAMIENTOS    │ ◄───────┤
          │    SECUNDARIOS    │         │
          └────────┬──────────┘         │
                   ▼                    │
 ┌──────────────┐  ┌───────────────┐  ┌──────────────┐
 │ TRATAMIENTOS │◄─┤  TRATAMIENTOS ├─►│ TRATAMIENTOS │
 │    ANEXOS    │  │   TERCIARIOS  │  │    ANEXOS    │
 └───────┬──────┘  └───────┬───────┘  └───────┬──────┘
         ▼                 ▼                  ▼
       GASES          AGUA LIMPIA          SÓLIDOS
```

Lo que la figura fija, y que es lo evaluable:

| Elemento | Qué dice la figura |
|---|---|
| **Tres entradas, arriba** | `AIRE`, `EFLUENTE` y `QUÍMICOS`. El efluente entra por el medio; el aire y los químicos son **insumos** que se inyectan en varias etapas, no corrientes a tratar |
| **Tres etapas en serie** | `TRATAMIENTOS PRIMARIOS` → `SECUNDARIOS` → `TERCIARIOS`, una debajo de la otra |
| **Dos bloques de anexos** | `TRATAMIENTOS ANEXOS`, uno a cada costado de los terciarios, **en la misma fila** |
| **Tres salidas, abajo** | `GASES` (del anexo izquierdo), `AGUA LIMPIA` (de los terciarios, el centro) y `SÓLIDOS` (del anexo derecho) |

> **Inferencia:** en el original las flechas son punteadas y de tres colores —una línea de proceso
> en negro, una de aire en azul y una de químicos en naranja que toca varios bloques a la vez—.
> Acá se simplifican a la topología, que es lo que la consigna pide ("diagrama de **bloques**"). El
> ruteo exacto de cada flecha coloreada no se transcribe porque a esta resolución no se lee sin
> ambigüedad.

> [!note] Lo que el diagrama enseña de un vistazo
> Que el tren **no tiene una sola salida**. La corriente de agua sale por el centro como `AGUA
> LIMPIA`, pero las otras dos salidas son residuos que hay que gestionar aparte: los **gases** (ver
> [[efluentes-gaseosos-y-toxicidad]]) y los **sólidos**, que son los barros (ver más abajo,
> preg. 26). Contestar la 11 dibujando sólo la columna del medio es contestarla a medias.

---

## Los secundarios

### Para qué sirven (preg. 12)

> "Buscan **oxidar la suciedad remanente** en el efluente, luego de los tratamientos primarios.
> Esta suciedad se encuentra principalmente **'disuelta' y 'finamente particulada'**."
> (Preguntas Ambiental 2017, p. 4)

Dos palabras cargan toda la respuesta:

- **remanente** — el secundario no ataca lo que el primario ya sacó. Trabaja sobre lo que quedó.
- **disuelta y finamente particulada** — y ahí está el motivo de que exista una segunda etapa: lo
  disuelto **no sedimenta ni se filtra**. No se lo puede separar físicamente; hay que
  **transformarlo químicamente**, oxidándolo. Por eso el secundario es biológico o químico y el
  primario es físico.

### Los tipos generales (preg. 13)

Cuatro, en dos familias (Preguntas Ambiental 2017, p. 4):

| Tipo | Cuándo | Qué logra |
|---|---|---|
| **Biológico aeróbico** | Efluente **biodegradable** y medianamente sucio, **DQO < 5000 mg/l** | "Pueden reducir el DQO hasta casi 0 mg/l" |
| **Biológico anaeróbico** | Efluente **biodegradable** y **muy** sucio, **DQO > 5000 mg/l**, o para **generar biogás** | Degrada muy rápido, pero **no deja el efluente en condiciones de vuelco** |
| **Biológico anóxico** | En combinación con los otros | Elimina **nitrógeno y fósforo**, y "mantiene la biomasa en condiciones" |
| **Químico** | Cuando el efluente **no es biodegradable** | Es la salida cuando lo biológico no aplica |

Y la fuente trae, en una tabla que la extracción de texto también perdió, **qué tecnología concreta
corresponde a cada casillero** según el tipo de proceso y cómo viven los microorganismos
(Preguntas Ambiental 2017, p. 4):

| | **AER.** (aeróbico) | **ANOX.** (anóxico) | **ANAER.** (anaeróbico) |
|---|---|---|---|
| **µorg. en suspensión** | barros activados, lagunas aireadas | selectores anóxicos, lagunas facultativas | UASB, lagunas anaeróbicas |
| **µorg. adheridos** | biofiltros, MBBR, RBC | biofiltros, MBBR, RBC | biofiltros anaeróbicos |
| **Macroorganismos** | humedales artificiales | humedales artificiales | humedales artificiales |

En el original, "biofiltros, MBBR, RBC" ocupa una sola celda que abarca las columnas aeróbica y
anóxica, y "humedales artificiales" una sola celda que abarca las tres. La tabla está manuscrita en
cursiva dentro de la figura.

> [!warning] La tabla nombra siete tecnologías que la fuente nunca explica
> **UASB**, **MBBR**, **RBC**, lagunas aireadas, lagunas facultativas, selectores anóxicos y
> humedales artificiales aparecen una sola vez, en esa tabla, sin una línea de desarrollo. La única
> que el resumen sí desarrolla es **barros activados** (preg. 14). Si el parcial pide "tipos
> generales", la tabla de cuatro filas de arriba alcanza; si pide ejemplos concretos, esta wiki no
> tiene con qué contestar más allá de los nombres. Anotado como hueco.

### El umbral de DQO 5000 mg/l — el criterio que se pregunta tres veces

> [!important] Éste es **el** dato del bloque: **DQO 5000 mg/l** parte las aguas
> La guía lo pregunta desde tres ángulos distintos —**preg. 16** (caso: DQO muy elevada, ¿qué
> proceso biológico ensayo?), **preg. 22** (¿cuándo anaeróbico?) y **preg. 23** (¿cuándo
> aeróbico?)— y las tres se contestan con el mismo número.
>
> | | **Aeróbico** | **Anaeróbico** |
> |---|---|---|
> | **Cuándo** | Biodegradable y **DQO < 5000 mg/l** | Biodegradable y **DQO > 5000 mg/l**, o si se quiere biogás |
> | **Velocidad** | — | "Degradan muy rápido el efluente" |
> | **¿Alcanza especificaciones de vuelco?** | **Sí**: "podría estar en condiciones de vuelco, ya que el tratamiento lo puede llevar desde DQO = 5000 mg/l hasta DQO = 0 mg/l" | **No**: "la corriente no queda en condiciones de vuelco. Para ello debería atravesar un Proceso Biológico Aeróbico" |
>
> (Preguntas Ambiental 2017, pp. 4 y 7 — preg. 13, 22 y 23)

Las preguntas 22 y 23 son un **par simétrico**: misma estructura, procesos opuestos, y las dos
rematan con la misma sub-pregunta, *"¿se alcanzan así especificaciones de vuelco?"* (Guía Parcial 2,
preg. 22 y 23). Contestar una sin la otra es media respuesta, y la sub-pregunta del vuelco es la
mitad que separa una respuesta buena de una completa.

> [!note] El anaeróbico no es una alternativa al aeróbico: es una etapa **previa**
> La respuesta a la 22 lo dice explícitamente: el anaeróbico baja la carga rápido pero deja el
> efluente fuera de especificación, y "para ello debería atravesar un Proceso Biológico Aeróbico"
> (Preguntas Ambiental 2017, p. 7). O sea que con DQO muy alta el tren no es *o uno o el otro*,
> sino **anaeróbico y después aeróbico**.

> [!warning] La respuesta de 2017 a la preg. 16 se contradice con la 22 y con la 23
> La 16 plantea un caso concreto: *"Una fábrica genera efluentes líquidos con valores **muy
> elevados** de DQO, que no se logra disminuir en las etapas primarias… ¿qué tipo de proceso
> biológico recomendaría ensayar como etapa secundaria?"* (Guía Parcial 2, preg. 16). El alumno
> contesta: *"Para valores elevado de DQO elegiría un tratamiento Biológico Aeróbico (DQO < 5000
> mg/l) o B. Anaeróbico (DQO > 5000 mg/l)"* (Preguntas Ambiental 2017, p. 6) — es decir, **no
> elige**: repite el criterio entero y deja las dos opciones abiertas.
>
> > **Inferencia:** si la consigna dice "muy elevados", el criterio que la propia fuente da en las
> > preguntas 13, 22 y 23 lleva a **anaeróbico**, y —por la 22— a **un aeróbico después** para
> > llegar a especificación de vuelco. La fuente nunca escribe esa conclusión para la 16; sale de
> > aplicarle su propio criterio.
>
> La segunda mitad de la 16 sí está contestada y sin ambigüedad: *"En caso de que el efluente no sea
> biodegradable utilizaría un Tratamiento Químico"* (p. 6). Ver [[dqo-dbo-y-biodegradabilidad]].

Hay además una discrepancia menor dentro de la propia fuente sobre hasta dónde baja el aeróbico:
la preg. 13 dice "hasta **casi** 0 mg/l" (p. 4) y la 23 dice "hasta DQO = **0** mg/l" (p. 7). En un
parcial conviene decir "casi 0": un DQO exactamente nulo no existe en la práctica.

---

## Barros activados (preg. 14)

El proceso aeróbico por excelencia, y el único que la fuente desarrolla en detalle. Es
"**tratamiento secundario (convencional)** de aguas domésticas e industriales, particularmente en
corrientes de desechos con alto contenido de materia orgánica o biodegradables" (Preguntas Ambiental
2017, p. 5).

Consiste en "el desarrollo de un **cultivo bacteriano disperso en forma de flóculo** en un depósito
(reactor biológico) **agitado, aireado y alimentado con el agua residual**, que es capaz de
metabolizar como nutrientes los contaminantes biológicos presentes en esa agua" (p. 5).

La pregunta pide **dos funciones**, una por equipo:

| Equipo | Función principal |
|---|---|
| **Biorreactor** (reactor biológico) | Es donde **ocurre la degradación**: las bacterias metabolizan la suciedad como nutriente. La **agitación** "evita sedimentos y homogeneiza la mezcla de los flóculos bacterianos con el agua residual"; la **aireación** "suministra el oxígeno necesario tanto para las bacterias como para el resto de los microorganismos aerobios" (p. 5) |
| **Sedimentador secundario** | Es donde se **separa la biomasa del agua**: "los flóculos y los sólidos sedimentan. De esta forma, luego se puede extraer el agua ya tratada, para continuar con los tratamientos terciarios" (p. 5) |

> [!important] La respuesta corta que hay que saber decir
> El **biorreactor degrada**, el **sedimentador separa**. Uno hace la química; el otro recupera el
> agua. Sin sedimentador, el agua sale con toda la biomasa adentro y el tratamiento no sirvió de
> nada — la suciedad orgánica disuelta se convirtió en suciedad orgánica en suspensión.

El oxígeno "puede provenir del aire, de un gas enriquecido en oxígeno o de oxígeno puro" (p. 5).
Es la entrada `AIRE` del diagrama de bloques.

### El esquema del proceso

También perdido en la extracción de texto; transcripto de la figura titulada *"Tratamiento por
barros activados simple"* (Preguntas Ambiental 2017, p. 5):

```
                ┌────────────────────────┐        ┌──────────────────┐
   efluente ───►│   REACTOR BIOLÓGICO    │ ─────► │  SEDIMENTADOR    │ ───► agua tratada
                │  (agitado + aireado)   │        │      2.º         │      (→ terciarios)
                └────────────────────────┘        └────────┬─────────┘
                            ▲                              │
                            └────── RECIRCULACIÓN ─────────┤
                                                           ▼
                                                        PURGA
```

> [!note] Las dos flechas que salen del sedimentador y que el texto de la fuente no explica
> El barro sedimentado se parte en dos corrientes: la **recirculación**, que vuelve al reactor
> —es lo que mantiene viva la población de bacterias, el "activado" de "barros activados"—, y la
> **purga**, por donde sale el exceso de biomasa que el sistema produce.
>
> > **Inferencia:** la purga es la puerta de entrada al bloque de `TRATAMIENTOS ANEXOS` del
> > diagrama de la preg. 11, el que remata en `SÓLIDOS`. La fuente dibuja las dos flechas y las
> > rotula, pero no las explica en ninguna línea de texto ni las conecta con el diagrama general.

---

## Microorganismos filamentosos (preg. 21)

> "Un exceso en el desarrollo de microorganismos puede generar dos tipos de fenómenos indeseables:
> **hinchamiento de lodos** · **flotación de lodos**" (Preguntas Ambiental 2017, p. 7)

El **hinchamiento de lodos** (*bulking*) y la **flotación de lodos** son las dos maneras de romper
el mismo equipo: el **sedimentador secundario**.

> **Inferencia:** los dos fenómenos son el mismo problema —el barro deja de sedimentar— y por eso
> los dos rompen la etapa de la que depende todo el proceso de barros activados. Un flóculo
> compacto cae; uno atravesado por filamentos ocupa más volumen y decanta mal (hinchamiento) o
> directamente sube (flotación). Si el barro no sedimenta, sale por arriba junto con el agua
> "tratada" y el efluente se va a especificación de vuelco con toda la biomasa adentro. La fuente
> **nombra los dos fenómenos y no explica ninguno**.

> [!warning] Ésta es una de las respuestas explícitamente incompletas de 2017
> La consigna pregunta "¿qué **inconvenientes** puede causar?" (Guía Parcial 2, preg. 21) y la
> respuesta son dos viñetas con dos nombres. Está registrado como respuesta corta en
> [[preguntas-ambiental-2017]]. Todo lo que esta wiki dice sobre el *mecanismo* está marcado como
> inferencia, y hay que cotejarlo cuando la cátedra dicte el módulo.

---

## Coagulación y floculación (preg. 19)

La guía pide **explicar y diferenciar**. Son dos operaciones distintas, consecutivas y
complementarias (Preguntas Ambiental 2017, p. 6):

| | **Coagulación** | **Floculación** |
|---|---|---|
| **Qué hace** | "Romper emulsiones, **separar** pequeñas partículas o micelas del medio líquido que las mantiene en suspensión" | "**Juntar** los coágulos y formar grumos, o sea agregados floculentos de mayor tamaño" |
| **Para qué** | Desestabilizar lo que está disperso | Que lo desestabilizado se pueda separar: "sedimentación, flotación, filtrado, etc." |
| **Verbo** | separar | juntar |

> [!important] La diferencia en una línea: **coagular es desestabilizar, flocular es agrandar**
> La coagulación rompe la suspensión pero deja las partículas del mismo tamaño —siguen sin
> sedimentar—. La floculación las **pega entre sí** hasta que el grumo es lo bastante grande como
> para caer por gravedad. Por eso "son procesos complementarios, y en general se realizan uno a
> continuación del otro" (p. 6): ninguno de los dos sirve solo.

La fuente lo ilustra con la secuencia de vasos del ensayo de *jar test*, transcripta de la figura
(Preguntas Ambiental 2017, p. 6):

| Vaso | Qué se dosifica | Cómo se agita | Cómo queda |
|---|---|---|---|
| 1 | — | — | `EFLUENTE CRUDO` |
| 2 | **coagulante** | agitación **rápida** | `EFLUENTE CRUDO + COAGULANTE` |
| 3 | — | agitación **rápida** | `EFLUENTE COAGULADO` |
| 4 | **floculante** | agitación **rápida** | `EFLUENTE COAGULADO + FLOCULANTE` |
| 5 | — | agitación **lenta** | `EFLUENTE FLOCULADO` |
| 6 | — | reposo | `CLARIFICADO` arriba, `BARRO FISICOQUÍMICO sedimentado` abajo |

> [!note] El cambio de agitación rápida a lenta es parte de la respuesta
> La figura rotula **agitación rápida** en los vasos 2, 3 y 4, y **agitación lenta** recién en el 5,
> el de la floculación propiamente dicha. Tiene sentido con la física de cada etapa: la coagulación
> necesita mezcla enérgica para dispersar el reactivo, y la floculación necesita mezcla suave para
> que los grumos crezcan sin romperse. La fuente **rotula los dos regímenes en la figura pero no
> los menciona en el texto**.

Y el vaso 6 nombra el residuo de esta línea: **barro fisicoquímico**, distinto del barro biológico
de los barros activados. Es otra corriente que termina en la salida `SÓLIDOS` del diagrama general.

---

## Tratamientos terciarios (preg. 17, 24 y 29)

La guía pregunta por los terciarios **tres veces**: qué tipos hay para desinfección (17), cuándo se
usan (24) y qué se usa además de cloro (29).

**El objetivo:** "dar los últimos retoques al agua proveniente del proceso secundario para que esté
dentro de la **especificación de vuelco**. Eliminando nutrientes, metales pesados, orgánicos
recalcitrantes, sólidos disueltos" (Preguntas Ambiental 2017, p. 6).

**Cuándo se usan — dos ocasiones** (preg. 24, p. 7):

1. Para **desinfección**, por cloro, UV, ozono, etc.
2. Para **remoción fisicoquímica de fósforo** y/u otros contaminantes.

**Con qué se desinfecta** (preg. 17 y 29): además del **cloro**, con **UV** (radiación
ultravioleta) y **ozono (O₃)** (pp. 6 y 9).

> [!important] La 29 es la 17 con otra redacción, y las dos se contestan con tres palabras
> *"Mencione los tipos de proceso terciario para desinfección de agua tratada"* (preg. 17) y
> *"Además de cloro ¿qué puede usarse para desinfectar el agua tratada?"* (preg. 29). La respuesta
> es la misma terna: **cloro, UV y ozono**. Que la guía la pregunte dos veces, separadas por doce
> números, es una señal fuerte de que se toma.

> [!note] Los terciarios son la única etapa que la fuente define por su **objetivo legal**
> Primarios y secundarios se definen por lo que sacan; los terciarios, por dónde tienen que llegar:
> **la especificación de vuelco**. Es lo que convierte al tren de tratamiento en una cuestión
> normativa y no sólo técnica — hay un valor límite fijado por afuera de la planta. Qué norma fija
> esa especificación **no está en ninguna fuente del vault**: la guía no cita ni una ley por
> número. Ver [[huecos]] y [[ley-25675]].

---

## Oxidación química avanzada (preg. 25)

Es la salida cuando **ni lo biológico ni lo fisicoquímico convencional alcanzan**:

> "Cuando se quieren tratar **contaminantes persistentes, refractarios** que no son tratables
> mediante procesos físico químicos y biológicos convencionales (**pesticidas, fármacos,
> surfactantes**), por ejemplo, aguas residuales con **recalcitrantes, tóxicos o materiales no
> biodegradables**." (Preguntas Ambiental 2017, p. 7)

Se engancha directo con [[dqo-dbo-y-biodegradabilidad]]: si la biodegradabilidad es baja, el
secundario biológico no tiene con qué trabajar y hay que **romper la molécula por vía química**.
Los tres ejemplos que da la fuente —pesticidas, fármacos, surfactantes— son de la vida real, y los
surfactantes conectan con la preg. 10 sobre el vuelco de detergentes
([[cuerpos-de-agua-lenticos-y-loticos]]).

---

## Ósmosis inversa (preg. 28)

> "Se deja pasar el agua y **no las sales**; se requiere **presión** para forzar el agua pura a
> través de una **membrana**, provocando que las impurezas (sólidos disueltos, orgánicos, material
> coloidal, submicro organismos, etc.) salgan detrás. Es capaz de quitar **95-99 % de los TDS**
> (sólidos disueltos totales) y **99 % de bacterias**." (Preguntas Ambiental 2017, p. 9)

La mecánica en una línea: es una **separación por membrana forzada con presión**, no una reacción.
No transforma la suciedad — la **concentra del otro lado**.

> [!warning] La consigna tiene cuatro sub-preguntas y la fuente contesta dos
> *"¿Cómo funciona la operación de ósmosis inversa? ¿para qué se usa? ¿**genera efluente líquido**?
> ¿**qué se puede hacer con el mismo**?"* (Guía Parcial 2, preg. 28). El resumen de 2017 explica el
> mecanismo y qué remueve, y **deja las dos últimas sin contestar** (Preguntas Ambiental 2017,
> p. 9). Está registrado como respuesta incompleta en [[preguntas-ambiental-2017]].
>
> > **Inferencia:** que la respuesta sea "sí, genera efluente" se deduce del propio texto de la
> > fuente —si la membrana deja pasar agua pura y las impurezas "salen detrás", esa corriente de
> > rechazo concentrado **es** un efluente líquido, y más sucio que el original—. Qué hacer con él
> > la wiki **no lo puede contestar hoy sin inventar**: la fuente no lo dice y no hay soporte de
> > cátedra. Es un hueco declarado, no un olvido.
>
> Ojo también con las cifras: "95-99 % de TDS y 99 % de bacterias" va **sin organismo ni año**, y
> por la regla dura #5 de `CLAUDE.md` no se puede repetir como dato duro.

Los **TDS** (*total dissolved solids*, sólidos disueltos totales) son exactamente lo que ni el
primario ni el secundario biológico sacan: material disuelto que no sedimenta ni se oxida. Ver
[[glosario-es-en]].

---

## Caracterización de corrientes (preg. 18)

Es el **paso cero** de todo lo anterior: antes de elegir tratamiento hay que saber qué se está
tratando.

**Para qué sirve:** "saber qué componentes tienen los efluentes antes de ser vertidos en un río, por
ejemplo, o reutilizados. Además, permite **determinar qué tratamientos realizarle a cada una de las
corrientes**, para dejarla apta para poder volcarla" (Preguntas Ambiental 2017, p. 6).

**Los siete aspectos que se estudian** — la fuente los escribe como siete preguntas, y así conviene
memorizarlos (p. 6):

1. ¿Qué **corrientes** de efluente existen?
2. ¿**Cuán sucia** está cada una?
3. ¿Qué **sustancias** contienen?
4. ¿Son siempre iguales o **varían** mucho?
5. ¿**Caudal** de cada corriente?
6. ¿Con qué **frecuencia** se generan?
7. ¿Vienen **separadas**? ¿Dónde se juntan?

> [!important] Las siete preguntas no son una lista: son un método
> Miran cuatro dimensiones distintas —**qué hay** (1, 3), **cuánto** (2, 5), **cuándo** (4, 6) y
> **dónde** (7)—. Y la 7 es la menos obvia y la más operativa: **si dos corrientes se juntan antes
> de tratarse, la mezcla puede necesitar un tratamiento peor que cada una por separado**, porque
> una corriente diluye a la otra y sube el caudal a tratar sin bajar la carga total.
>
> > **Inferencia:** la conclusión sobre mezclar corrientes es lectura del sentido de la pregunta 7,
> > que la fuente formula sin explicar por qué importa.

> **Inferencia:** la caracterización de corrientes es, en el módulo 2, lo que el
> [[03-01-aspt|ASPT]] es en el módulo 1: **el relevamiento previo que convierte una decisión
> técnica en una decisión informada**. Los dos empiezan por listar y describir lo que hay antes de
> proponer una sola medida. La analogía es de esta wiki; ninguna fuente la hace.

---

## Qué se hace con los barros (preg. 26)

> [!warning] La respuesta de 2017 a esta pregunta **es sobre otra cosa** — no la copien
> El resumen contesta: *"Se lo recicla, adicionando nuevos barros y nutriéndolo de nuevo. Este ciclo
> se repite hasta que el barro esté totalmente saturado, momento en el cual se debe cambiar."*
> (Preguntas Ambiental 2017, p. 8).
>
> Justo encima de esa línea hay pegado, en la misma página, un párrafo **en inglés** sobre
> **`drill mud`** —el lodo de perforación que circula en un pozo petrolero, del que se tamizan
> sólidos y gravas y que se centrifuga hasta que queda cargado de *"rock flour"*—. La respuesta en
> castellano es un parafraseo de ese párrafo.
>
> **Barro de perforación y barro de depuradora son cosas distintas.** El de un pozo es un fluido de
> proceso que se recircula y se repone; el de una planta de tratamiento es un **residuo que la
> planta produce** y del que hay que deshacerse. La respuesta contesta la pregunta equivocada.
> Registrado como contradicción para revisar contra la cátedra.

Lo que **sí** está sostenido por las fuentes del vault sobre la línea de barros:

| Dato | De dónde sale |
|---|---|
| Los barros son una de las **tres salidas** de la planta: el ramal `SÓLIDOS` | Diagrama de la preg. 11 (Preguntas Ambiental 2017, p. 4) |
| Salen por **tratamientos anexos**, no por el tren principal | Mismo diagrama: los anexos están **al costado** de los terciarios |
| Hay al menos **dos barros distintos**: el **biológico** (purga del sedimentador secundario) y el **fisicoquímico** (sedimentado del ensayo de coagulación-floculación) | Figuras de las preg. 14 y 19 (pp. 5 y 6) |
| Parte del barro biológico **vuelve al reactor** (recirculación) y sólo el excedente se purga | Figura de la preg. 14 (p. 5) |

> [!note] Lo que la wiki **no** puede contestar hoy
> Qué se hace con el barro **una vez que sale de la planta** —espesado, deshidratado, secado,
> disposición final, si es o no residuo peligroso— **no está en ninguna fuente del vault**, y esta
> wiki no lo completa por inferencia (regla dura #2 de `CLAUDE.md`). Es especialmente delicado
> porque conecta con la preg. 57, sobre la responsabilidad del generador de residuos peligrosos
> ([[residuos-peligrosos]]), y ahí hay normativa argentina de por medio que la guía tampoco cita.

---

## En la materia

**Módulo 2 — Medio Ambiente** ([[modulo-2-ambiente]]), bloque de **tratamiento de efluentes**
(preg. 11–30 de la guía de cátedra). Es el bloque más grande del parcial 2.

**Preguntas de la guía que esta página cubre — dieciséis:**

| Preg. | Qué pide | Dónde está en esta página |
|---|---|---|
| **11** | Dibujar el diagrama de bloques | *El diagrama de bloques* |
| **12** | Finalidad específica de los secundarios | *Los secundarios → Para qué sirven* |
| **13** | Tipos generales de secundario | *Los secundarios → Los tipos generales* |
| **14** | Barros activados: biorreactor y sedimentador 2.º | *Barros activados* |
| **16** | **Caso**: DQO muy alta que no baja en primarios | *El umbral de DQO 5000 mg/l* — compartida con [[dqo-dbo-y-biodegradabilidad]] |
| **17** | Tipos de proceso terciario para desinfección | *Tratamientos terciarios* |
| **18** | Caracterización de corrientes | *Caracterización de corrientes* |
| **19** | Coagulación vs. floculación | *Coagulación y floculación* |
| **21** | Exceso de microorganismos filamentosos | *Microorganismos filamentosos* |
| **22** | Cuándo anaeróbico, ¿alcanza vuelco? | *El umbral de DQO 5000 mg/l* |
| **23** | Cuándo aeróbico, ¿alcanza vuelco? | *El umbral de DQO 5000 mg/l* |
| **24** | Cuándo se usan terciarios | *Tratamientos terciarios* |
| **25** | Cuándo se requiere oxidación química avanzada | *Oxidación química avanzada* — compartida con [[dqo-dbo-y-biodegradabilidad]] |
| **26** | Qué se hace con los barros | *Qué se hace con los barros* |
| **28** | Ósmosis inversa (cuatro sub-preguntas) | *Ósmosis inversa* |
| **29** | Además de cloro, con qué desinfectar | *Tratamientos terciarios* |

**¿Aparece en algún final del compilado?** **No como pregunta propia.** Se revisó
[[finales-soa-compilado]] entero: **ninguna de las tecnologías de esta página** —barros activados,
coagulación, floculación, ósmosis inversa, terciarios, desinfección, filamentosos— **aparece en un
final**. Aparece sólo el vocabulario, y como distractor:

- **Final, pregunta 13**: *"¿Qué cuerpo de agua es más posible que se eutrofique?"*, con las opciones
  *"c. Cuerpo lótico en presencia de DQO"* y *"d. Estuario en presencia de DBO"* (Finales SOA,
  pp. 8–9). La respuesta correcta es la b (cuerpo léntico con fósforo); DQO y DBO están puestas para
  confundir. Ver [[cuerpos-de-agua-lenticos-y-loticos]].
- **Final, pregunta 15**, sobre residuos peligrosos: la explicación aclara que *"los residuos pueden
  ser en los tres estados de la materia. Los líquidos y gaseosos se llaman **efluentes**"* (Finales
  SOA, p. 9). Es la definición de "efluente" que usa la materia y la única línea del compilado que
  la fija.

> [!important] Que no esté en los finales **no lo saca del parcial 2**
> Son dos instancias distintas: el compilado son **finales integradores** de años anteriores, y el
> parcial 2 se toma con la [[guia-parcial-2-ambiental|guía de 80 preguntas]], que le dedica a este
> tema **veinte preguntas de ochenta**. La ausencia en los finales dice algo sobre el final, no
> sobre el parcial. Ver [[evaluacion]].

---

## Relación con otros temas

- [[dqo-dbo-y-biodegradabilidad]] — **la página bisagra**: el valor de DQO es lo que decide qué
  secundario va, y la biodegradabilidad es lo que decide si va biológico o químico.
- [[efluentes-gaseosos-y-toxicidad]] — la salida `GASES` del diagrama de bloques, y las tecnologías
  que la tratan.
- [[cuerpos-de-agua-lenticos-y-loticos]] — a dónde va a parar el agua tratada, y qué pasa si no se
  la trata (eutrofización, detergentes).
- [[suelo-y-acuiferos]] — la otra vía de contaminación: lo que no se vuelca a un curso, percola.
- [[residuos-peligrosos]] — dónde termina la salida `SÓLIDOS` si el barro califica como peligroso.
- [[guia-parcial-2-ambiental]] — las 80 preguntas de cátedra; las 11 a 30 son este bloque.
- [[preguntas-ambiental-2017]] — de dónde salen todas las respuestas de esta página, y qué tan
  confiable es cada una.
- [[banco-parcial-2-ambiental]] — el cruce pregunta ↔ respuesta ↔ concepto.
- [[modulo-2-ambiente]] — el hub del módulo.
- [[iso-14001]] — la norma de gestión ambiental. Un tren de tratamiento es un **control operacional**
  típico de un sistema de gestión ambiental; ninguna de las 80 preguntas la nombra.
- [[02-06-jerarquia-de-controles]] — la contraparte del módulo 1. Un tren de tratamiento es
  **control de ingeniería puro**: interviene sobre la corriente, no sobre la conducta de nadie. Y
  como en el módulo 1, la escala de arriba —**no generar el efluente**— siempre gana sobre tratarlo.
- [[01-05-riesgo]] — el efluente sin tratar es un peligro; el tren de tratamiento es la barrera.
- [[contradicciones]] — donde va la respuesta a la preg. 26 sobre `drill mud`.
- [[huecos]] — las siete tecnologías nombradas sin explicar, el destino final de los barros y las
  dos sub-preguntas sin contestar de la 28.
- [[glosario-es-en]] — barros activados (*activated sludge*), hinchamiento de lodos (*bulking*),
  TDS (*total dissolved solids*), vuelco (*discharge*).

## Fuentes

- (Guía Parcial 2, preg. 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 28 y 29) —
  [[guia-parcial-2-ambiental]], documento de cátedra. **Las consignas.**
- (Preguntas Ambiental 2017, pp. 4–9) — [[preguntas-ambiental-2017]], resumen de alumno.
  **Las respuestas.** Incluye las cuatro figuras y la tabla que la extracción a `.cache/txt/`
  perdió y que se leyeron rasterizando el PDF: el diagrama de bloques (p. 4), la matriz de
  tecnologías AER./ANOX./ANAER. (p. 4), el esquema de barros activados (p. 5), la fórmula de
  biodegradabilidad (p. 5) y la secuencia de vasos de coagulación-floculación (p. 6).
- (Finales SOA, pp. 8–9) — [[finales-soa-compilado]], resumen de alumno. Sólo para verificar que el
  tema **no** aparece como pregunta propia.
