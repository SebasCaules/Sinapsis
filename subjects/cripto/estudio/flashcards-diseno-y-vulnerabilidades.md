---
tipo: flashcards
titulo: Principios de diseño y vulnerabilidades
id: diseno-y-vulnerabilidades
division: "8"
descripcion: Saltzer y Schroeder, modelado de amenazas, STRIDE y las pruebas de penetración.
---

## ¿Qué es un sistema confiable y qué es el aseguramiento? {#diseno-y-vulnerabilidades:sistema-confiable-y-aseguramiento}
> pagina: confianza-y-aseguramiento

**Sistema confiable:** el que cuenta con **suficiente evidencia creíble** para que se crea que va a cumplir un conjunto de requerimientos. La confianza **no es una escala discreta**: es gradual, no un sí o no.

**Aseguramiento:** la **confianza obtenida a través de técnicas específicas**, es decir, la justificación de por qué se confía.

La filmina aclara que estos conceptos no aplican sólo a seguridad.

## Enuncie la cadena de tres niveles que ordena política, aseguramiento y mecanismo {#diseno-y-vulnerabilidades:cadena-politica-aseguramiento-mecanismo}
> pagina: confianza-y-aseguramiento

$$
\text{Política} \;\longrightarrow\; \text{Aseguramiento} \;\longrightarrow\; \text{Mecanismo}
$$

- **Política:** requerimientos que definen **explícitamente** las expectativas de seguridad.
- **Aseguramiento:** justificación, **a través de evidencia**, de que el mecanismo sigue la política.
- **Mecanismo:** ejecutables diseñados e implementados para hacer cumplir las políticas.

El punto que la cátedra marca como más importante del tramo: decir que algo es seguro **sin ofrecer evidencia** es, en sí mismo, una señal de alarma.

## ¿Cuáles son los tres niveles de evidencia y cuándo se justifica el más alto? {#diseno-y-vulnerabilidades:niveles-de-evidencia}
> pagina: confianza-y-aseguramiento

- **Informal:** enunciados, analogías.
- **Semiformal:** pseudocódigo, análisis caso por caso.
- **Formal:** métodos matemáticos, lenguajes formales de demostración de teoremas.

Probar formalmente una pieza de código **sólo se justifica en criticidad extrema**, porque el costo de la verificación formal crece mucho más rápido que el del resto del desarrollo. El nivel de evidencia que se elige es una **decisión de riesgo**, no un ideal a maximizar siempre.

## Enumere los ocho principios de diseño y las dos ideas madre de las que salen {#diseno-y-vulnerabilidades:ocho-principios-y-dos-ideas-madre}
> pagina: principios-de-diseno

Ideas madre: **simplicidad** (menos cosas pueden salir mal, menos inconsistencias, más fácil de entender y verificar) y **restricción** (minimizar el acceso, minimizar la comunicación).

Los ocho: menor privilegio, valores iniciales seguros, economía de mecanismos, mediación completa, diseño abierto, separación de privilegios, mecanismos exclusivos, aceptación psicológica.

Son *principios guía de alto nivel*, no recetas: **no son consistentes entre sí** —separación de privilegios contradice a economía de mecanismos, porque pedir dos firmas es más complejo que pedir una— y se balancean caso por caso.

## Enuncie el principio de menor privilegio y qué debería y qué no debería poder hacer un web server {#diseno-y-vulnerabilidades:menor-privilegio}
> pagina: principios-de-diseno

Un sujeto debe recibir **sólo los privilegios necesarios** para completar su tarea; los privilegios se asignan **por función, no por identidad**, y los derechos adicionales se desechan luego de su uso.

Un web server **debería** leer las carpetas de archivos web y sus archivos de configuración, y escribir en sus carpetas de logs sólo en modo **append**. **No debería** leer otros archivos, escribir en otros lugares (salvo upload o webdav) ni sobreescribir logs.

Límite práctico: el sistema operativo no siempre tiene la granularidad que el principio pediría.

## ¿Qué exige el principio de valores iniciales seguros? {#diseno-y-vulnerabilidades:valores-iniciales-seguros}
> pagina: principios-de-diseno

El acceso a cualquier objeto debe ser **denegado por defecto**, y si una acción falla por seguridad el sistema debe **volver al estado de seguridad inicial**.

Ejemplo: si `sshd` falla al abrir el puerto 22, **no** debe abrir otro puerto ni elevar privilegios para reintentar. Contraejemplo: instalaciones antiguas de Oracle creaban usuarios administrativos con claves predefinidas y dejaban el cambio en manos del administrador; los instaladores actuales piden la clave al instalar.

## Enuncie mediación completa y la precisión sobre "un único mecanismo" {#diseno-y-vulnerabilidades:mediacion-completa}
> pagina: principios-de-diseno

**Todos** los accesos a objetos deben ser verificados, incluso si el objeto es accedido varias veces. Puede ir en contra de la eficiencia —no permite usar cachés— y es complejo de implementar: qué ocurre si mientras se accede a un objeto le quitan el permiso a mitad de camino.

La precisión que conviene retener: mediación completa **no exige un único servidor, exige un único mecanismo**. Dos sectores de una organización con esquemas de administración de usuarios distintos ya violan el principio, aunque cada uno medie completo sus propios accesos.

## ¿Qué dice el principio de diseño abierto y a qué no aplica? {#diseno-y-vulnerabilidades:diseno-abierto}
> pagina: principios-de-diseno

La seguridad **no debe depender del secreto del diseño o la implementación**; violarlo se denomina **seguridad por oscuridad**. No significa que deba publicarse el código fuente, y **no aplica a las claves**, sino a los algoritmos: lo único que tiene que estar oculto es la clave.

Un atacante puede conseguir el algoritmo desensamblando el ejecutable, sobornando o coercionando a un desarrollador, o buscando en desechos. Es el principio de Kerckhoffs extendido de los algoritmos criptográficos a los mecanismos de seguridad en general.

## Distinga amenaza de vulnerabilidad, y ordene la cadena que las une {#diseno-y-vulnerabilidades:amenaza-contra-vulnerabilidad}
> pagina: aseguramiento-en-el-ciclo-de-vida

**Amenaza:** evento potencial que tiene como consecuencia un efecto no deseado en el sistema. Las amenazas **no son vulnerabilidades**: una vulnerabilidad es lo que **permite** que una amenaza ocurra.

$$
\text{Bug} \;\longrightarrow\; \text{Vulnerabilidad} \;\longrightarrow\; \text{Amenaza} \;\longrightarrow\; \text{Efecto no deseado}
$$

Las amenazas se clasifican por **consecuencia**: pérdida de confidencialidad, pérdida de integridad y denegación de servicio.

## Enumere los cinco pasos del ciclo de modelado de amenazas de Microsoft {#diseno-y-vulnerabilidades:ciclo-de-modelado-microsoft}
> pagina: modelado-de-amenazas

1. **Identify Security Objectives** — confidencialidad, integridad y disponibilidad; la pregunta guía es **qué es lo que no se quiere que pase**.
2. **Application Overview** — esquematizar el despliegue, identificar roles y casos de uso, tecnologías y mecanismos de seguridad ya presentes.
3. **Decompose Application** — dónde cambia el nivel de confianza requerido, y el flujo de datos entre esas zonas.
4. **Identify Threats** — a partir de listas recurrentes o derivando amenazas mediante preguntas.
5. **Identify Vulnerabilities** — qué permite efectivamente que esas amenazas ocurran.

El paso 1 arranca el ciclo; los pasos 2 a 5 se retroalimentan entre sí: es iterativo, no lineal.

## ¿Qué zonas busca la descomposición de la aplicación y en qué orden se refina el flujo de datos? {#diseno-y-vulnerabilidades:zonas-de-confianza}
> pagina: descomposicion-de-la-aplicacion

Zonas donde **cambia el nivel de confianza requerido**, de dos tipos:

- **Externas** — acceso al sistema de archivos del servidor, a la base de datos, a web services.
- **Privilegiadas** — partes accesibles sólo para un rol particular; el ejemplo de la filmina es el reporte de sueldos reservado a managers.

El flujo de datos se refina por niveles, de lo grueso a lo fino: primero por **capas** (`browser` / `web` / `middle` / `db` / `filesystem`), luego entre **páginas**, luego entre **componentes**.

## Desarrolle la sigla STRIDE y diga cómo se aplica {#diseno-y-vulnerabilidades:stride-seis-letras}
> pagina: stride-y-arboles-de-ataque

- **S** — *Spoofing*: hacerse pasar por otro.
- **T** — *Tampering*: alterar algo de una manera no prevista por el diseño.
- **R** — *Repudiation*: negar haber hecho algo; se contrarresta **firmando**.
- **I** — *Information disclosure*: divulgación de información que debería quedar confinada.
- **D** — *Denial of Service*: amenaza a la supervivencia del sistema.
- **E** — *Elevation of privilege*: conseguir más permisos de los autorizados.

La instrucción de uso, que es la parte que más se olvida: preguntar **por cada *trust boundary*** cómo un atacante puede intentar cumplir cada una de estas amenazas. Entra en el **paso 4** del ciclo, no antes.

## ¿Qué es un árbol de ataque y qué advertencia lo acompaña? {#diseno-y-vulnerabilidades:arbol-de-ataque}
> pagina: stride-y-arboles-de-ataque

Herramienta para explorar una amenaza ya identificada: **identifica las acciones y condiciones necesarias para que esa amenaza se cumpla**. La raíz es la amenaza y los nodos de abajo son condiciones, unidas por conectores "Y" (u "O").

Ejemplo de la filmina — amenaza *obtener credenciales monitoreando la red*: (1) las credenciales se envían en plano, **Y** (2) el atacante puede capturar los paquetes, con (2.1) el atacante reconoce las credenciales.

Advertencia de la propia lámina: estos árboles pueden crecer considerablemente; hay que concentrarse sólo en los aspectos esenciales que agreguen valor.

## ¿Qué hace el paso 5 del ciclo, identificar vulnerabilidades, y qué instrucción metodológica lo cierra? {#diseno-y-vulnerabilidades:paso-5-identificar-vulnerabilidades}
> pagina: identificacion-de-vulnerabilidades

**Revisar las zonas que se derivan del análisis anterior** —las zonas y el flujo de datos del paso 3, contra las amenazas del paso 4— para encontrar las vulnerabilidades concretas que permiten que esas amenazas ocurran. Ya no se pregunta *qué podría pasar*, sino *qué del sistema real permite que pase*.

La instrucción que cierra la filmina: *modelar amenazas al nivel de detalle que corresponda según la información disponible*. Pedir de más cuando no hay información produce hipótesis sin sustento; pedir de menos cuando sí la hay deja vulnerabilidades sin nombrar.

## Verificación formal contra prueba de penetración: ¿qué prueba cada una sobre existencia y ausencia de vulnerabilidades? {#diseno-y-vulnerabilidades:formal-contra-pentest-existencia-y-ausencia}
> pagina: verificacion-formal-y-prueba-de-penetracion

**Existencia** de vulnerabilidades: las dos la prueban.

**Ausencia:** la verificación formal **sí** puede probarla, pero para eso debe incluir **todos** los factores externos, cosa que en la práctica no ocurre — se prueba ausencia en un algoritmo, programa o ambiente acotado, ignorando instalación y uso. La prueba de penetración **nunca** la prueba.

Corolario: un pentest limpio sólo evidencia que ese equipo no encontró nada, no que no haya nada que encontrar.

## ¿Por qué la verificación formal no escala? {#diseno-y-vulnerabilidades:verificacion-formal-y-sat}
> pagina: verificacion-formal-y-prueba-de-penetracion

Verificar una pieza de código con precondiciones y poscondiciones es **equivalente al problema `SAT`** —satisfacibilidad booleana—, que es **`NP`-completo**: no se conoce un algoritmo que lo resuelva en tiempo polinomial en el peor caso, así que el costo de verificar crece mucho más rápido que el tamaño del código.

Por eso se reserva a piezas de criticidad extrema, como el chip de control de un misil o de una central nuclear.

## Enumere los cinco pasos de la metodología de hipótesis de falla y cuál es el más importante {#diseno-y-vulnerabilidades:cinco-pasos-hipotesis-de-falla}
> pagina: metodologia-de-hipotesis-de-falla

1. **Recolección de información** — componer un modelo del sistema y sus partes.
2. **Hipótesis** — asumir la existencia de vulnerabilidades concretas.
3. **Prueba** — probar las vulnerabilidades hipotetizadas; la prueba **debe ser repetible**.
4. **Generalización** — generalizar patrones y encontrar otras vulnerabilidades del mismo tipo.
5. **Eliminación** *(opcional)* — determinar los pasos para eliminarlas.

La filmina marca la **generalización** como la parte más importante de la prueba: a veces dos vulnerabilidades combinadas constituyen un problema grave que ninguna de las dos era por separado.

## ¿Qué es el pivoting y por qué es la excepción a "explotar es el último recurso"? {#diseno-y-vulnerabilidades:pivoting}
> pagina: metodologia-de-hipotesis-de-falla

En el paso 3 la mejor manera de probar una vulnerabilidad es analizar documentación o comportamiento, e **intentar explotarla es el último recurso**, el menos eficiente; además el test se diseña lo menos intrusivo posible, porque algunas vulnerabilidades pueden denegar el servicio si se las prueba mal.

***Pivoting***: usar un punto de acceso ya comprometido para continuar el ataque —comprometer el firewall y desde ahí seguir atacando la red interna—. Como la explotación ya ocurrió, seguir desde ese punto de apoyo es más eficiente que volver a empezar; implica volver del paso 3 al paso 1 con más información.

## Caso Michigan Terminal System: ¿cuál es la hipótesis y hasta dónde llega la generalización? {#diseno-y-vulnerabilidades:caso-michigan-terminal-system}
> pagina: casos-de-prueba-de-penetracion

**Hipótesis:** qué ocurriría si la dirección de un parámetro apunta a la **lista misma de parámetros**. Los parámetros se pasan como una lista de direcciones en el segmento del usuario, y la validación del *system call* revisa que los punteros pertenezcan a zonas accesibles, pero **no se vuelve a validar** después.

**Prueba:** con `line input` —que retorna número y longitud de línea— se apunta el destino del número de línea a la dirección del otro parámetro; al escribirlo se reescribe esa dirección, y la longitud termina escrita en el **segmento 5**.

**Generalización:** en los segmentos 0 a 4 no se puede escribir, pero en el **segmento 5** vive el **nivel de privilegio** del proceso, que decide si puede hacer llamadas de nivel supervisor — y una función de nivel supervisor apaga la protección por hardware.

$$
\text{escribir 2 bytes en el segmento 5} \Rightarrow \text{elevar privilegio} \Rightarrow \text{llamadas de nivel supervisor} \Rightarrow \text{apagar la protección por hardware} \Rightarrow \text{control total}
$$

## ¿Qué determina la calidad de un pentest, y hasta dónde llega la generalización del paso 4? {#diseno-y-vulnerabilidades:validez-y-alcance-de-la-generalizacion}
> pagina: validez-de-las-pruebas-de-penetracion

La metodología de hipótesis de fallas **depende de la capacidad de los testers para formular hipótesis**, **no provee una forma sistemática** de revisar un sistema, y **los resultados de un test sirven sólo marginalmente para otros**.

La aparente contradicción con el paso 4 se resuelve separando dos escalas: la **generalización opera dentro del mismo sistema** —buscar dónde se replica el mismo problema—, y **no generaliza nada hacia sistemas distintos**. A lo sumo, un hallazgo sirve como hipótesis de partida para empezar un pentest nuevo, no como conclusión de uno ya hecho.
