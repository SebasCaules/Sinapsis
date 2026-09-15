---
titulo: Colores y señales de seguridad
tipo: concepto
modulo: [1]
clase: [3, 4]
division: "1"
tags: [colores-y-senales, senalizacion, barrera, epp, incendio]
fuentes: [apunte-iram-10005, aspt-trabajo-relevamientos]
actualizado: 2026-08-25
estado: consolidado
aliases: [senalizacion, senales-de-seguridad, color-de-seguridad, codigo-de-colores]
resumen: 'Cuatro colores —rojo, amarillo, verde, azul— con un significado fijo cada uno, combinados con cinco formas geométricas, forman un lenguaje sin palabras que funciona con quien no sabe leer, no habla el idioma o llegó ayer a la planta.'
---

## En una línea

Cuatro colores —rojo, amarillo, verde, azul— con un significado fijo cada uno, combinados con cinco
formas geométricas, forman un lenguaje sin palabras que funciona con quien no sabe leer, no habla
el idioma o llegó ayer a la planta.

## Desarrollo

### Qué son, textual

> "**Color de seguridad:** A los fines de la seguridad color de características específicas al que
> se le asigna un significado definido."
>
> "**Señal de seguridad:** Aquella que, mediante la combinación de una **forma geométrica**, de un
> **color** y de un **símbolo**, da una indicación concreta relacionada con la seguridad. La señal
> de seguridad puede incluir un texto […] destinado a aclarar sus significado y alcance."
>
> (IRAM 10005, p. 1)

La definición de señal es la que hay que poder decir de memoria: **forma + color + símbolo**, y el
texto es opcional. Todo el sistema es esa terna instanciada cuatro veces.

### Para qué existe la normalización

> "La función de los colores y las señales de seguridad es **atraer la atención** sobre lugares,
> objetos o situaciones que puedan provocar accidentes u originar riesgos a la salud, así como
> **indicar la ubicación** de dispositivos o equipos que tengan importancia desde el punto de vista
> de la seguridad." (IRAM 10005, p. 1)

Y el porqué de que se normalice:

> "La normalización de señales y colores de seguridad sirve para **evitar, en la medida de lo
> posible, el uso de palabras** […] debido al comercio internacional así como a la aparición de
> grupos de trabajo que no tienen un lenguaje en común o que se trasladan de un establecimiento a
> otro." (IRAM 10005, p. 1)

> Leído con [[02-03-barrera]]: una señal es una **barrera simbólica**, la más débil de las cuatro
> familias de Hollnagel, porque necesita que alguien la vea, la entienda y decida obedecerla.
> Normalizarla es lo único que la vuelve confiable — sin código común, la señal deja de ser barrera
> y pasa a ser decoración.

### Los cuatro colores y sus significados

| Color | Significado | Se usa en |
|---|---|---|
| **Rojo** | **Parada, prohibición** e identificación de elementos contra incendio | Botones de alarma; pulsadores/palancas de parada de emergencia; accionamiento de sistemas contra incendio. Y ubicación de: matafuegos, baldes o recipientes de arena o polvo extintor, nichos, hidrantes, soportes de mangas, cajas de frazadas |
| **Amarillo** | **Precaución** y **advertencia** — solo o con bandas negras de igual ancho a 45° | Partes de máquinas que puedan golpear, cortar o electrocutar, y límites de carrera de partes móviles; interior o bordes de puertas y tapas que deben estar cerradas; desniveles que puedan causar caídas (primer y último tramo de escalera, bordes de plataformas, fosas); barreras, barandas, pilares, postes y salientes en áreas de paso; salientes de equipos de construcción y movimiento de materiales |
| **Verde** | **Condición segura** — seguridad general, **excepto incendio** | Puertas de salas de primeros auxilios; puertas o salidas de emergencia; botiquines; armarios con elementos de seguridad o de protección personal; camillas; duchas de seguridad; lavaojos |
| **Azul** | **Obligación** — obliga a proceder con precaución | Tapas de tableros eléctricos; tapas de cajas de engranajes; cajas de comando de aparejos y máquinas; utilización de EPP |

(IRAM 10005, pp. 2-3)

> [!important] La trampa clásica: verde es seguridad **salvo** incendio
> Incendio es rojo, aunque un matafuego sea un elemento de seguridad. La norma lo dice de forma
> explícita — el verde se usa "en elementos de seguridad general, **excepto incendio**" — y es
> exactamente el tipo de excepción que se pregunta. Ver [[iram-10005]].

> [!note] Amarillo tiene dos usos que no son el mismo
> **Amarillo sólido con triángulo negro** = señal de advertencia (un pictograma, algo que informa).
> **Bandas amarillas y negras a 45°** = demarcación de un riesgo físico presente en ese lugar (un
> borde, un desnivel, una parte móvil). No es una señal que se cuelga: es pintura sobre el peligro
> mismo.

### Las cinco formas geométricas

| Familia | Forma | Color de fondo/seguridad | Superficie mínima del color |
|---|---|---|---|
| **Prohibición** | Corona circular con barra transversal sobre el símbolo | Rojo sobre fondo blanco, símbolo negro que no se superpone a la barra | **≥ 35 %** |
| **Advertencia** | Triángulo de contorno negro | Amarillo, banda triangular negra, símbolo negro centrado | **≥ 50 %** |
| **Obligatoriedad** | Círculo sin contorno | Azul, símbolo blanco centrado | **≥ 50 %** |
| **Informativa** | Cuadrado o rectángulo sin contorno | Verde, símbolo blanco | **≥ 50 %** |
| **Suplementaria** | Rectángulo o cuadrado, **sólo texto** | Fondo blanco con texto negro, o el color de la señal a la que acompaña con su color de contraste | — |

(IRAM 10005, pp. 5-6)

> Que la prohibición pida **35 %** y las otras tres **50 %** no es arbitrario: la corona circular
> roja es un anillo, no un disco, y por geometría cubre menos superficie. Es el tipo de dato
> concreto que sirve para reconocer que uno leyó la fuente.

![Cuadro resumen de la IRAM 10005 tal como lo presenta la cátedra](../../assets/aspt-trabajo-slide-06-tabla-iram-10005.png)

*(Trabajo ASPT, slide 6. **Ojo:** este cuadro tiene invertidas las columnas de símbolo y contraste
en las filas de amarillo y verde respecto del apunte — ver [[contradicciones]] C-12 y la resolución
en [[iram-10005]].)*

### El tamaño de una señal se calcula

> `A ≥ L² / 2000`
>
> "siendo A el área de la señal en metros cuadrados y L la distancia a la señal en metros. Esta
> fórmula es conveniente para distancias inferiores a 50 m." (IRAM 10005, p. 7)

| Distancia `L` | Área mínima `A` | Lado de un cuadrado equivalente |
|---|---|---|
| 5 m | 0,0125 m² | ≈ 11 cm |
| 10 m | 0,05 m² | ≈ 22 cm |
| 20 m | 0,20 m² | ≈ 45 cm |
| 50 m | 1,25 m² | ≈ 1,12 m |

> **Inferencia:** la columna del lado equivalente no está en la fuente; sale de calcular `√A` y
> sirve para tener una intuición de la escala. La fórmula y el límite de 50 m sí son de la norma.

Es el único cálculo numérico de todo el bloque, y por eso el candidato natural a un ejercicio corto
de parcial.

### Las cuatro familias de pictogramas

**Prohibición** (8, rojos, Trabajo ASPT slide 7 / IRAM 10005 p. 7): prohibido fumar · prohibido
fumar y encender fuego · prohibido pasar a los peatones · agua no potable · prohibido apagar con
agua · entrada prohibida a personas no autorizadas · no tocar · prohibido a los vehículos de
manutención.

**Advertencia** (18, amarillos, Trabajo ASPT slide 10 / IRAM 10005 p. 8): materiales inflamables ·
materiales explosivos · materias tóxicas · materias corrosivas · materias radiactivas · cargas
suspendidas · vehículos de manutención · riesgo eléctrico · peligro en general · radiación láser ·
materias comburentes · radiaciones no ionizantes · campo magnético intenso · riesgo de tropezar ·
caída a distinto nivel · riesgo biológico · baja temperatura · materias nocivas o irritantes.

**Obligatoriedad** (11, azules, Trabajo ASPT slide 9 / IRAM 10005 pp. 8-9): protección obligatoria
de la vista · de la cabeza · del oído · de las vías respiratorias · de los pies · de las manos ·
del cuerpo · de la cara · protección individual obligatoria contra caídas · vía obligatoria para
peatones · obligación general.

> **Nueve de las once señales azules son de [[02-07-epp|EPP]].** El azul, en la práctica, es *el
> color del EPP*: es la señalización de obligatoriedad de uso que el programa de EPP exige como uno
> de sus nueve pasos (Trabajo ASPT, slide 4).

**Informativas** (verdes, Trabajo ASPT slides 11-12 / IRAM 10005 p. 9): vía y salida de socorro ·
flechas de dirección a seguir (arriba, abajo, izquierda, derecha) · primeros auxilios · camilla ·
ducha de seguridad · lavado de ojos · teléfonos de salvamento. Y los carteles de texto **SALIDA** y
**SALIDA DE EMERGENCIA**.

> Hay una señal que rompe el patrón: la de **"medio no adecuado para el escape"**, que es
> **amarilla de advertencia** aunque hable de salidas (Trabajo ASPT, slide 12; IRAM 10005, p. 13).
> Tiene sentido — informar de una salida es verde, advertir de una que no sirve es advertencia.

### Cañerías: un código de colores aparte

La IRAM 10005 señaliza lugares, objetos y situaciones. Las **cañerías** tienen su propio código, y
la cátedra lo trae en la misma lámina (Trabajo ASPT, slide 5):

| Producto conducido | Color fundamental |
|---|---|
| Elementos para la lucha contra el fuego (rociado, bocas de incendio, agua de incendio, ignífugos) | Rojo |
| Vapor de agua | Naranja |
| Combustibles (líquidos y gases) | Amarillo |
| Aire comprimido | Azul |
| Electricidad | Negro |
| Vacío | Castaño |
| Agua fría | Verde |
| Agua caliente | Verde con franjas naranja |

![Tabla de colores de cañerías por producto conducido](../../assets/aspt-trabajo-slide-05-colores-canerias.png)

Normativa que el propio slide declara aplicable: [[ley-19587]] / [[dec-351-79]], **Anexos I y IV,
Capítulo 12 "Iluminación y color"**. Referencias adicionales: [[iram-10005]] partes 1 y 2,
[[iram-2507]] (identificación de cañerías) e [[iram-def-d-1054]] (carta de colores).

> [!important] El rojo cambia de sentido según el soporte
> En una **señal**, rojo es prohibición o parada. En una **cañería**, rojo es "acá va agua o agente
> de incendio". Y "agua fría" en cañería es **verde**, que en señalética significa condición
> segura. No es una contradicción: son dos códigos distintos que comparten paleta. Confundirlos es
> el error típico.

### Dónde termina el color y empieza la ley

El color no es voluntario en Argentina: el capítulo 12 del [[dec-351-79]] lo hace exigible, y
"iluminación y color" es uno de los 16 ítems relevables de
[[03-08-relevamiento-de-seguridad]]. La [[iram-10005]] es la norma técnica que dice *cómo* se
cumple.

## En la materia

Bloque 2 de [[aspt-trabajo-relevamientos]] (slides 5 a 12), respaldado por las 14 páginas de
[[apunte-iram-10005]]. Es contenido con mucha superficie memorística —cuatro colores, cinco formas,
cuatro familias de pictogramas, porcentajes mínimos, una fórmula— y por eso el más "preguntable" de
toda esta ingesta. Ver la hoja de repaso en [[repaso-parcial-modulo-1]].

## Relación con otros temas

- [[iram-10005]] — la norma, con el detalle técnico y la contradicción resuelta.
- [[apunte-iram-10005]] — el apunte que reparte la cátedra.
- [[02-03-barrera]] — la señal como barrera simbólica.
- [[02-07-epp]] — nueve de las once señales azules son de EPP.
- [[02-04-prevencion-y-proteccion]] — "establecer señales, avisos, alarmas" está en las dos
  columnas de la clase 2: hay señales que previenen y señales que protegen.
- [[dec-351-79]] — capítulo 12, lo que vuelve obligatorio todo esto.
- [[03-08-relevamiento-de-seguridad]] — "iluminación y color" es uno de los 16 ítems.

## Fuentes

- (IRAM 10005, pp. 1-14) — [[apunte-iram-10005]]
- (Trabajo ASPT, slides 5-12) — [[aspt-trabajo-relevamientos]]
